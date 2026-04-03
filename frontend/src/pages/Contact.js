import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createContact } from '../api';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const contactInfo = [
    { icon: FiPhone, title: 'Phone', detail: '+92 300 1234567', sub: 'Mon-Sat, 9am-6pm' },
    { icon: FiMail, title: 'Email', detail: 'info@bserv.pk', sub: 'We reply within 24 hours' },
    { icon: FiMapPin, title: 'Address', detail: 'Office #12, Blue Area', sub: 'Islamabad, Pakistan' },
    { icon: FiClock, title: 'Business Hours', detail: 'Mon - Sat: 9AM - 6PM', sub: 'Sunday: Closed' },
  ];

  const faqs = [
    {
      q: 'Do you offer rental plans for photocopiers?',
      a: 'Yes, we offer flexible rental plans starting from monthly to yearly contracts. Our rental packages include maintenance and toner supply, so you get a hassle-free experience.',
    },
    {
      q: 'What brands of photocopiers do you deal in?',
      a: 'We deal in all major brands including Ricoh, Konica Minolta, Canon, Kyocera, and Sharp. We carry both new and certified refurbished machines.',
    },
    {
      q: 'Do you provide after-sales maintenance and support?',
      a: 'Absolutely. We provide comprehensive after-sales support including on-site maintenance, spare parts, toner refills, and emergency repair services with quick response times.',
    },
    {
      q: 'Can I get a demo or trial before purchasing?',
      a: 'Yes, we offer on-site demonstrations so you can evaluate the machine before making a decision. Contact us to schedule a free demo at your office.',
    },
    {
      q: 'What is the warranty period on your machines?',
      a: 'New machines come with the manufacturer warranty (typically 1-2 years). Refurbished machines carry our own 6-12 month warranty covering parts and labor.',
    },
  ];

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Enter a valid email';
    }
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await createContact(form);
      toast.success('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: { minHeight: '100vh', background: '#f8f9fa' },
    banner: {
      background: 'linear-gradient(135deg, #0a3458 0%, #1a6db5 100%)',
      padding: '80px 20px 60px',
      textAlign: 'center',
      color: '#fff',
    },
    bannerTitle: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 800,
      margin: 0,
    },
    bannerSub: {
      fontSize: '1.1rem',
      opacity: 0.85,
      marginTop: 12,
      maxWidth: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    container: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '60px 20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 40,
    },
    sectionTitle: {
      fontSize: '1.8rem',
      fontWeight: 700,
      color: '#0f4c81',
      marginBottom: 30,
    },
    infoCard: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      background: '#fff',
      borderRadius: 12,
      padding: '24px 20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      cursor: 'pointer',
    },
    iconBox: {
      width: 50,
      height: 50,
      borderRadius: 12,
      background: 'linear-gradient(135deg, #0f4c81, #1a6db5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    infoTitle: { fontWeight: 700, fontSize: '1rem', color: '#222', margin: 0 },
    infoDetail: { fontSize: '0.95rem', color: '#444', margin: '4px 0 2px' },
    infoSub: { fontSize: '0.82rem', color: '#888', margin: 0 },
    form: { display: 'flex', flexDirection: 'column', gap: 18 },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: 5 },
    label: { fontSize: '0.9rem', fontWeight: 600, color: '#333' },
    input: {
      padding: '12px 16px',
      borderRadius: 8,
      border: '1.5px solid #ddd',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    inputError: { borderColor: '#e74c3c' },
    errorText: { color: '#e74c3c', fontSize: '0.8rem', margin: 0 },
    textarea: {
      padding: '12px 16px',
      borderRadius: 8,
      border: '1.5px solid #ddd',
      fontSize: '0.95rem',
      outline: 'none',
      resize: 'vertical',
      minHeight: 120,
      fontFamily: 'inherit',
    },
    submitBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '14px 32px',
      background: 'linear-gradient(135deg, #0f4c81, #1a6db5)',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      fontSize: '1rem',
      fontWeight: 700,
      cursor: 'pointer',
      marginTop: 4,
    },
    mapBox: {
      background: '#e9ecef',
      borderRadius: 16,
      height: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#888',
      gap: 12,
      marginTop: 60,
    },
    faqSection: { marginTop: 80 },
    faqItem: {
      background: '#fff',
      borderRadius: 10,
      marginBottom: 12,
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    },
    faqQ: {
      padding: '18px 24px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '1rem',
      color: '#222',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      userSelect: 'none',
    },
    faqA: {
      padding: '0 24px 18px',
      fontSize: '0.93rem',
      color: '#555',
      lineHeight: 1.7,
    },
  };

  return (
    <div style={styles.page}>
      {/* Banner */}
      <div style={styles.banner}>
        <motion.h1
          style={styles.bannerTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
        </motion.h1>
        <motion.p
          style={styles.bannerSub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Have questions or need a quote? Reach out and our team will get back to you promptly.
        </motion.p>
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Left Column - Contact Info */}
          <div>
            <h2 style={styles.sectionTitle}>Get In Touch</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {contactInfo.map((item, i) => (
                <motion.div
                  key={i}
                  style={styles.infoCard}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(15,76,129,0.13)' }}
                >
                  <div style={styles.iconBox}>
                    <item.icon size={22} color="#fff" />
                  </div>
                  <div>
                    <p style={styles.infoTitle}>{item.title}</p>
                    <p style={styles.infoDetail}>{item.detail}</p>
                    <p style={styles.infoSub}>{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <h2 style={styles.sectionTitle}>Send Us a Message</h2>
            <motion.form
              style={styles.form}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
                {errors.name && <p style={styles.errorText}>{errors.name}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p style={styles.errorText}>{errors.email}</p>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    style={styles.input}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 3XX XXXXXXX"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Subject *</label>
                <input
                  style={{ ...styles.input, ...(errors.subject ? styles.inputError : {}) }}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                />
                {errors.subject && <p style={styles.errorText}>{errors.subject}</p>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Message *</label>
                <textarea
                  style={{ ...styles.textarea, ...(errors.message ? styles.inputError : {}) }}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your requirements..."
                />
                {errors.message && <p style={styles.errorText}>{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
                <FiSend size={18} />
              </motion.button>
            </motion.form>
          </div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          style={styles.mapBox}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <FiMapPin size={48} color="#aaa" />
          <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#999' }}>Our Location</span>
          <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Google Maps embed will appear here</span>
        </motion.div>

        {/* FAQ Section */}
        <div style={styles.faqSection}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Frequently Asked Questions</h2>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                style={styles.faqItem}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div
                  style={styles.faqQ}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '1.4rem', color: '#0f4c81', lineHeight: 1 }}
                  >
                    +
                  </motion.span>
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={styles.faqA}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
