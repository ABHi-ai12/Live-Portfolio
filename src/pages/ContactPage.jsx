import { useRef, useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SubPageHeader from '../components/SubPageHeader';
import AOS from 'aos';
import 'aos/dist/aos.css';

import SplitTextReveal from '../components/effects/SplitTextReveal';
import MagneticButton from '../components/effects/MagneticButton';
import MouseGlow from '../components/effects/MouseGlow';

const FloatingParticles = lazy(() => import('../components/effects/FloatingParticles'));

// Helper for timeouts to prevent infinite hanging
const withTimeout = (promise, ms = 15000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out. Please check your internet connection.')), ms)
    )
  ]);
};

/* ─── Shimmer keyframes injected once ─── */
const shimmerStyleId = 'contact-shimmer-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(shimmerStyleId)) {
  const style = document.createElement('style');
  style.id = shimmerStyleId;
  style.textContent = `
    @keyframes contactShimmer {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
  `;
  document.head.appendChild(style);
}

/* ─── Animated Connection Lines ─── */
const ConnectionLines = () => {
  const nodes = [
    { cx: 60, cy: 30 },
    { cx: 180, cy: 55 },
    { cx: 310, cy: 25 },
    { cx: 420, cy: 60 },
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
  ];

  return (
    <div className="absolute top-6 left-0 w-full pointer-events-none z-[2] hidden md:block">
      <svg
        viewBox="0 0 480 90"
        fill="none"
        className="w-full max-w-xl mx-auto opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        {edges.map(([a, b], i) => (
          <motion.line
            key={`edge-${i}`}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="white"
            strokeWidth="0.8"
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.2, ease: 'easeInOut' }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={n.cx}
            cy={n.cy}
            r="4"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={n.cx}
            cy={n.cy}
            r="4"
            fill="none"
            stroke="white"
            strokeWidth="0.6"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{
              scale: [1, 2.8],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
};

/* ─── GlowInput – wraps an input/textarea with focus glow ─── */
const GlowInput = ({ children }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  return (
    <div
      className="relative transition-shadow duration-500 ease-out rounded-sm"
      style={{
        boxShadow: focused
          ? '0 0 15px rgba(255,255,255,0.2)'
          : '0 0 0px rgba(255,255,255,0)',
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
};

/* ─── Main Page ─── */
const ContactPage = () => {
  const sectionRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    permission: false
  });
  const [status, setStatus] = useState({ type: '', message: '' }); // 'success', 'error', 'sending'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax translation for the big watermark text
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { firstName, lastName, email, phone, subject, message, permission } = formData;

    if (!firstName || !email || !message) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (!permission) {
      setStatus({ type: 'error', message: 'Please check the box to grant contact permission.' });
      return;
    }

    setStatus({ type: 'sending', message: 'Sending your message...' });
    setIsSubmitting(true);

    try {
      console.log('Sending request to serverless contact API...');
      const res = await withTimeout(
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            subject,
            message,
            permission
          })
        }),
        15000
      );

      if (!res.ok) {
        let errorMsg = 'Failed to send message';
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          errorMsg = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const result = await res.json();

      if (result.emailStatus === 'failed') {
        setStatus({ 
          type: 'success', 
          message: 'Thank you! Your message was received, but the email notification failed.' 
        });
      } else {
        setStatus({ 
          type: 'success', 
          message: 'Thank you! Your message has been sent successfully.' 
        });
      }

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        permission: false
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus({ type: 'error', message: err.message || 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });

  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-sans relative overflow-hidden">
      {/* 1. Subpage Header */}
      <SubPageHeader title="Contact" subtitle="Reach out for software consulting, remote positions, or full-stack web builds." />

      {/* 2. Contact Form Section */}
      <section 
        ref={sectionRef} 
        className="bg-[#0a0a0a] w-full relative overflow-hidden pt-24 pb-24 border-b border-zinc-900"
      >
        {/* MouseGlow */}
        <MouseGlow color="rgba(255, 42, 42, 0.05)" size={400} />

        {/* FloatingParticles */}
        <Suspense fallback={null}>
          <FloatingParticles count={40} color="#ff2a2a" className="opacity-10" />
        </Suspense>

        {/* Huge parallax Background Text – shimmer gradient */}
        <motion.div 
          style={{ y: watermarkY }}
          className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center overflow-hidden pointer-events-none z-0 pt-8"
        >
          <h1 
            className="text-[25vw] leading-[0.75] font-black uppercase tracking-tighter select-none scale-y-[1.6] origin-top"
            style={{
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,42,42,0.4) 50%, rgba(255,255,255,0.8) 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'contactShimmer 4s linear infinite',
            }}
          >
            Contact
          </h1>
        </motion.div>

        {/* Animated connection lines */}
        <ConnectionLines />

        {/* Form Card Overlay */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 mt-12 flex justify-end">
          <div 
            data-aos="fade-up"
            className="bg-[#ff2a2a] w-full lg:w-[85%] p-8 md:p-16 text-white flex flex-col justify-between rounded-3xl shadow-[0_30px_60px_rgba(255,42,42,0.15)]"
          >
            <SplitTextReveal
              text="Reach Us"
              splitBy="char"
              className="text-xs font-bold tracking-[0.2em] mb-12 md:mb-20 uppercase opacity-90"
              staggerDelay={0.05}
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-12 md:gap-16 w-full">
              <div className="flex flex-col md:flex-row gap-12 md:gap-20 w-full">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-10">
                  <GlowInput>
                    <input 
                      type="text" 
                      id="firstName" 
                      placeholder="First Name" 
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                    />
                  </GlowInput>
                  <GlowInput>
                    <input 
                      type="text" 
                      id="lastName" 
                      placeholder="Last Name" 
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                    />
                  </GlowInput>
                  <GlowInput>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="Email" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                    />
                  </GlowInput>
                  <GlowInput>
                    <input 
                      type="tel" 
                      id="phone" 
                      placeholder="Phone Number" 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                    />
                  </GlowInput>
                  <GlowInput>
                    <input 
                      type="text" 
                      id="subject" 
                      placeholder="Subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                    />
                  </GlowInput>
                </div>

                {/* Right Column */}
                <div className="flex-1 flex flex-col">
                  <GlowInput>
                    <textarea 
                      id="message" 
                      placeholder="Type your message here" 
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full h-full min-h-[120px] bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium resize-none rounded-none"
                    ></textarea>
                  </GlowInput>
                </div>
              </div>

              {status.message && (
                <div className={`p-4 rounded text-sm font-semibold transition-all duration-300 ${
                  status.type === 'error' 
                    ? 'bg-black/30 border border-white/20 text-white' 
                    : status.type === 'success' 
                    ? 'bg-white/20 border border-white/40 text-white' 
                    : 'bg-white/10 text-white/90'
                }`}>
                  {status.message}
                </div>
              )}

              {/* Bottom Section */}
              <div className="flex flex-col md:flex-row gap-12 mt-4">
                {/* Left text */}
                <div className="flex-1 flex items-start gap-4 text-sm font-medium text-white/90">
                  <input 
                    type="checkbox" 
                    id="permission" 
                    checked={formData.permission}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded-sm border-white/40 bg-transparent text-white focus:ring-white focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" 
                    style={{ accentColor: "white" }}
                  />
                  <label htmlFor="permission" className="cursor-pointer max-w-[280px] leading-snug">
                    I give permission to contact me at this email address.
                  </label>
                </div>

                {/* Right text & button */}
                <div className="flex-1 flex flex-col gap-8 text-xs text-white/70 font-medium">
                  <p className="leading-relaxed max-w-[400px]">
                    This site is protected by reCAPTCHA and the Google <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a> and <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a> apply.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
                    <p className="max-w-[250px] leading-relaxed">
                      For information on how to unsubscribe, please review our <a href="#" className="underline hover:text-white transition-colors">privacy policy</a>.
                    </p>
                    
                    <MagneticButton strength={0.3}>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-8 py-3 rounded-full border border-white/40 text-white font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-[#ff2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group whitespace-nowrap self-start sm:self-auto"
                      >
                        {isSubmitting ? 'Sending...' : 'Send'}
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
