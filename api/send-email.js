import nodemailer from 'nodemailer';

// Very basic in-memory rate limiting (max 10 requests per minute per IP)
const rateLimitCache = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

const cleanIp = (ip) => ip?.replace(/^.*:/, '') || 'unknown';

const isRateLimited = (ip) => {
  const now = Date.now();
  if (!rateLimitCache.has(ip)) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  const limitData = rateLimitCache.get(ip);
  if (now > limitData.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  limitData.count += 1;
  return limitData.count > MAX_REQUESTS;
};

// HTML Sanitizer
const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  return html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:[^"]*/g, '');
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Rate Limiting
  const ip = cleanIp(req.headers['x-forwarded-for'] || req.socket.remoteAddress);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const idToken = authHeader.split(' ')[1];
  const apiKey = process.env.VITE_FIREBASE_API_KEY;

  if (!apiKey) {
    console.error('❌ VITE_FIREBASE_API_KEY environment variable is missing on server.');
    return res.status(500).json({ error: 'Server configuration error: missing API key' });
  }

  try {
    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      console.error('❌ Firebase token verification failed:', errData);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const verifyData = await verifyRes.json();
    const adminUser = verifyData.users?.[0];
    if (!adminUser) {
      return res.status(401).json({ error: 'Unauthorized: User lookup failed' });
    }

    // Input Validation
    const { to, toName, subject, messageHtml, messageText, attachment } = req.body;

    if (!to || !subject || !messageHtml) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, messageHtml' });
    }

    // SMTP Config
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({ error: 'Server configuration error: missing SMTP credentials' });
    }

    // HTML Sanitization
    const sanitizedHtml = sanitizeHtml(messageHtml);

    // Nodemailer Transporter Setup
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    // Build Mail Options
    const mailOptions = {
      from: `"Abhinav Arya Studio" <${smtpUser}>`,
      to: toName ? `"${toName}" <${to}>` : to,
      replyTo: smtpUser,
      subject: subject,
      html: sanitizedHtml,
      text: messageText || sanitizedHtml.replace(/<[^>]*>/g, ''), // Fallback text
      charset: 'utf-8'
    };

    // Add Attachment if present
    if (attachment && attachment.content && attachment.filename) {
      mailOptions.attachments = [
        {
          filename: attachment.filename,
          content: Buffer.from(attachment.content, 'base64'),
          contentType: attachment.contentType
        }
      ];
    }

    console.log(`📤 [Backend SendEmail] Sending email to ${to} via SMTP...`);

    // Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [Backend SendEmail] Email sent successfully:', info.messageId);

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('❌ [Backend SendEmail] Error occurred:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send email via SMTP'
    });
  }
}
