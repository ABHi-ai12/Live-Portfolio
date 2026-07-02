import { Resend } from 'resend';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, updateDoc, addDoc, collection } from 'firebase/firestore';

const cleanEnvVar = (val) => typeof val === 'string' ? val.replace(/[\r\n]+/g, '').trim() : val;

const isDevelopment = process.env.NODE_ENV !== 'production';
const resendApiKey = cleanEnvVar(process.env.RESEND_API_KEY);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Firebase configuration using server environment variables
const firebaseConfig = {
  apiKey: cleanEnvVar(process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY),
  authDomain: cleanEnvVar(process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvVar(process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvVar(process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvVar(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvVar(process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID)
};

console.log('Firebase Config & Resend Status:', {
  projectId: firebaseConfig.projectId,
  hasApiKey: Boolean(firebaseConfig.apiKey),
  apiKeyLength: firebaseConfig.apiKey ? firebaseConfig.apiKey.length : 0,
  hasResendApiKey: Boolean(resendApiKey),
  resendApiKeyLength: resendApiKey ? resendApiKey.length : 0,
  nodeEnv: process.env.NODE_ENV
});

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const notificationTo = cleanEnvVar(process.env.CONTACT_NOTIFICATION_TO || 'abhinavarya7983@gmail.com');
const fromAddress = cleanEnvVar(process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev');

// Helper to escape HTML tags
const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// Helper to enforce a timeout on any promise
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), ms)
    )
  ]);
};

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('1. [Request Received] New contact form API request.');

  // Validate form fields
  const { firstName, lastName, email, phone, subject, message, permission } = req.body || {};

  if (!firstName || !email || !message) {
    console.warn('2. [Validation Failed] Missing required fields: firstName, email, or message.');
    return res.status(400).json({ error: 'First Name, Email, and Message are required fields.' });
  }

  if (!permission) {
    console.warn('2. [Validation Failed] Permission checkbox not checked.');
    return res.status(400).json({ error: 'Permission to contact must be granted.' });
  }

  console.log('2. [Validation Passed] Fields valid. Initializing Firestore write...');

  let messageId = null;

  try {
    // 3. Save submission to Firestore first with emailStatus: "pending", wrapped in 10s timeout
    console.log('3. [Firestore Write] Attempting write to Firestore...');
    const docRef = await withTimeout(
      addDoc(collection(firestore, 'contact_messages'), {
        firstName: firstName.trim(),
        lastName: (lastName || '').trim(),
        name: `${firstName.trim()} ${(lastName || '').trim()}`.trim(),
        email: email.trim(),
        phone: (phone || '').trim(),
        subject: (subject || '').trim(),
        message: message.trim(),
        permission: Boolean(permission),
        createdAt: new Date().toISOString(),
        status: 'Unread',
        isArchived: false,
        emailStatus: 'pending'
      }),
      10000
    );

    messageId = docRef.id;
    console.log(`3. [Firestore Write Success] Message saved with ID: ${messageId}`);
  } catch (firestoreError) {
    const isTimeout = firestoreError.message === 'TIMEOUT';
    console.error(`3. [Firestore Write Failed] ${isTimeout ? 'Write timed out after 10s' : 'Error storing message'}:`, firestoreError);
    return res.status(500).json({ error: isTimeout ? 'Database write timed out.' : 'Failed to save contact message to database.' });
  }

  // 4. Send email notification using Resend
  if (!resend) {
    console.warn('4. [Resend API Skipped] RESEND_API_KEY is not configured on this server.');
    try {
      await updateDoc(doc(firestore, 'contact_messages', messageId), { emailStatus: 'failed' });
    } catch (updateErr) {
      console.error('Failed to update emailStatus to failed in Firestore:', updateErr);
    }
    return res.status(202).json({
      success: true,
      emailStatus: 'failed',
      messageId,
      message: 'Message received. Notification email could not be sent (missing API key).'
    });
  }

  const safeFirstName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  const emailPayload = {
    from: fromAddress,
    to: notificationTo,
    subject: safeSubject ? `Portfolio: ${safeSubject}` : `New Portfolio Message from ${safeFirstName} ${safeLastName}`.trim(),
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #ff2a2a; margin-top: 0;">New Contact Form Submission</h2>
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
        <p><strong>Name:</strong> ${safeFirstName} ${safeLastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        ${phone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
        ${subject ? `<p><strong>Subject:</strong> ${safeSubject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="white-space: pre-wrap; background: #f4f4f5; padding: 16px; border-radius: 6px; border: 1px solid #e4e4e7; color: #18181b; line-height: 1.6;">${safeMessage}</div>
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
        <p style="font-size: 12px; color: #71717a; text-align: center; margin-bottom: 0;">This email was sent automatically from your portfolio site contact form.</p>
      </div>
    `
  };

  console.log(`4. [Resend Request] Sending email via Resend to: ${notificationTo}`);

  try {
    // Call Resend with a strict 10 second timeout limit
    const response = await withTimeout(resend.emails.send(emailPayload), 10000);
    const { data, error } = response || {};

    console.log('4. [Resend Response]', { data, error });

    if (error) {
      throw error;
    }

    // Email successfully sent: update status in Firestore
    console.log('5. [Updating Status] Setting emailStatus: "sent" in Firestore...');
    await updateDoc(doc(firestore, 'contact_messages', messageId), {
      emailStatus: 'sent'
    });

    console.log('6. [Completion] Contact submission complete and email sent.');
    return res.status(200).json({ success: true, emailStatus: 'sent', messageId });
  } catch (resendError) {
    const isTimeout = resendError.message === 'TIMEOUT';
    console.error(`4. [Resend Failed] ${isTimeout ? 'Request timed out after 10s' : 'Resend returned error'}:`, resendError);

    // Keep Firestore record, but update status to failed
    try {
      console.log('5. [Updating Status] Setting emailStatus: "failed" in Firestore due to email failure...');
      await updateDoc(doc(firestore, 'contact_messages', messageId), {
        emailStatus: 'failed'
      });
    } catch (updateErr) {
      console.error('Failed to update emailStatus to failed in Firestore:', updateErr);
    }

    console.log('6. [Completion] Contact submission saved but email failed.');
    return res.status(202).json({
      success: true,
      emailStatus: 'failed',
      messageId,
      message: isTimeout
        ? 'Message received, but the notification email timed out.'
        : 'Message received, but the notification email could not be sent.'
    });
  }
}

