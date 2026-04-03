import React from 'react';
import { motion, useInView } from 'framer-motion';
import { FiTarget, FiEye, FiUsers, FiAward, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import CountUp from 'react-countup';
import { useInView as useInViewIO } from 'react-intersection-observer';

const About = () => {
  const statsData = [
    { end: 500, suffix: '+', label: 'Machines Sold & Rented' },
    { end: 200, suffix: '+', label: 'Happy Clients' },
    { end: 15, suffix: '+', label: 'Years Experience' },
    { end: 98, suffix: '%', label: 'Customer Satisfaction' },
  ];

  const values = [
    {
      icon: FiAward,
      title: 'Quality',
      desc: 'We source and deliver only the highest quality photocopiers, ensuring reliability and peak performance for every client.',
    },
    {
      icon: FiCheckCircle,
      title: 'Trust',
      desc: 'Transparent pricing, honest consultations, and dependable after-sales service have earned us the trust of hundreds of businesses.',
    },
    {
      icon: FiTarget,
      title: 'Innovation',
      desc: 'We stay ahead of industry trends, offering the latest technology in digital printing and document management solutions.',
    },
    {
      icon: FiUsers,
      title: 'Service',
      desc: 'Our dedicated support team provides rapid response maintenance, training, and consultation to keep your operations running smoothly.',
    },
  ];

  const team = [
    { name: 'Ahmed Khan', role: 'Founder & CEO', color: '#0f4c81' },
    { name: 'Sara Malik', role: 'Operations Manager', color: '#1a6db5' },
    { name: 'Usman Ali', role: 'Technical Lead', color: '#ff6b35' },
  ];

  const [statsRef, statsInView] = useInViewIO({ triggerOnce: true, threshold: 0.3 });

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
    }),
  };

  const s = {
    page: { minHeight: '100vh', background: '#f8f9fa' },
    banner: {
      background: 'linear-gradient(135deg, #0a3458 0%, #1a6db5 100%)',
      padding: '80px 20px 60px',
      textAlign: 'center',
      color: '#fff',
    },
    bannerTitle: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: 0 },
    bannerSub: { fontSize: '1.1rem', opacity: 0.85, marginTop: 12, maxWidth: 600, margin: '12px auto 0' },
    section: { maxWidth: 1200, margin: '0 auto', padding: '80px 20px' },
    sectionTitle: { fontSize: '1.8rem', fontWeight: 700, color: '#0f4c81', marginBottom: 10 },
    sectionSubtitle: { fontSize: '1rem', color: '#666', marginBottom: 40, maxWidth: 600 },
    twoCol: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 50,
      alignItems: 'center',
    },
    paragraph: { fontSize: '1rem', lineHeight: 1.8, color: '#555', marginBottom: 16 },
    imgPlaceholder: {
      width: '100%',
      height: 350,
      borderRadius: 16,
      background: 'linear-gradient(135deg, #0f4c81 0%, #1a6db5 60%, #ff6b35 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    mvGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 30,
    },
    mvCard: {
      background: '#fff',
      borderRadius: 16,
      padding: '40px 30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      textAlign: 'center',
    },
    mvIcon: {
      width: 64,
      height: 64,
      borderRadius: 16,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    mvTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#222', margin: '0 0 12px' },
    mvText: { fontSize: '0.95rem', color: '#666', lineHeight: 1.7, margin: 0 },
    statsSection: {
      background: 'linear-gradient(135deg, #0f4c81 0%, #1a6db5 100%)',
      padding: '60px 20px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 30,
      maxWidth: 1000,
      margin: '0 auto',
      textAlign: 'center',
      color: '#fff',
    },
    statNum: { fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, margin: 0 },
    statLabel: { fontSize: '0.9rem', opacity: 0.85, marginTop: 6 },
    valGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 24,
    },
    valCard: {
      background: '#fff',
      borderRadius: 14,
      padding: '32px 24px',
      boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
    },
    valIconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      background: 'rgba(15,76,129,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    valTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#222', margin: '0 0 8px' },
    valDesc: { fontSize: '0.9rem', color: '#666', lineHeight: 1.7, margin: 0 },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 30,
    },
    teamCard: {
      background: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
      textAlign: 'center',
    },
    teamImg: {
      width: '100%',
      height: 220,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '3rem',
      fontWeight: 700,
    },
    teamInfo: { padding: '20px 16px 24px' },
    teamName: { fontSize: '1.1rem', fontWeight: 700, color: '#222', margin: 0 },
    teamRole: { fontSize: '0.88rem', color: '#0f4c81', marginTop: 4 },
    cta: {
      background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f65 100%)',
      borderRadius: 20,
      padding: '60px 30px',
      textAlign: 'center',
      color: '#fff',
      maxWidth: 900,
      margin: '0 auto',
    },
    ctaTitle: { fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 },
    ctaSub: { fontSize: '1.05rem', opacity: 0.9, margin: '12px 0 28px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' },
    ctaBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 36px',
      background: '#fff',
      color: '#ff6b35',
      border: 'none',
      borderRadius: 8,
      fontSize: '1rem',
      fontWeight: 700,
      cursor: 'pointer',
      textDecoration: 'none',
    },
  };

  return (
    <div style={s.page}>
      {/* Banner */}
      <div style={s.banner}>
        <motion.h1
          style={s.bannerTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About BServ
        </motion.h1>
        <motion.p
          style={s.bannerSub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Your trusted partner for photocopier sales, rentals, and servicing solutions.
        </motion.p>
      </div>

      {/* Our Story */}
      <div style={s.section}>
        <div style={s.twoCol}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 style={s.sectionTitle}>Our Story</h2>
            <p style={s.paragraph}>
              BServ was founded with a simple mission: to make high-quality document solutions accessible
              and affordable for businesses of all sizes. Starting as a small photocopier repair shop over
              15 years ago, we have grown into one of the most trusted names in the photocopier industry,
              serving hundreds of satisfied clients across Pakistan.
            </p>
            <p style={s.paragraph}>
              Today, we offer a comprehensive range of services including new and refurbished photocopier
              sales, flexible rental plans, professional maintenance, and genuine parts supply. Our team of
              certified technicians and dedicated account managers ensures that every client receives
              personalized attention and world-class support.
            </p>
          </motion.div>
          <motion.div
            style={s.imgPlaceholder}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            BServ Office
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div style={{ ...s.section, paddingTop: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ ...s.sectionTitle, textAlign: 'center' }}>Mission & Vision</h2>
        </div>
        <div style={s.mvGrid}>
          <motion.div
            style={s.mvCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            whileHover={{ y: -6, boxShadow: '0 8px 30px rgba(15,76,129,0.12)' }}
          >
            <div style={{ ...s.mvIcon, background: 'linear-gradient(135deg, #0f4c81, #1a6db5)' }}>
              <FiTarget size={28} color="#fff" />
            </div>
            <h3 style={s.mvTitle}>Our Mission</h3>
            <p style={s.mvText}>
              To provide businesses with reliable, cost-effective document management solutions backed by
              exceptional service and technical expertise, enabling our clients to focus on what matters
              most -- growing their business.
            </p>
          </motion.div>
          <motion.div
            style={s.mvCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            whileHover={{ y: -6, boxShadow: '0 8px 30px rgba(255,107,53,0.12)' }}
          >
            <div style={{ ...s.mvIcon, background: 'linear-gradient(135deg, #ff6b35, #ff8f65)' }}>
              <FiEye size={28} color="#fff" />
            </div>
            <h3 style={s.mvTitle}>Our Vision</h3>
            <p style={s.mvText}>
              To become the leading photocopier solutions provider in Pakistan, recognized for innovation,
              customer-centric service, and building lasting partnerships with businesses across all
              industries and scales.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsSection} ref={statsRef}>
        <div style={s.statsGrid}>
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <p style={s.statNum}>
                {statsInView ? (
                  <CountUp end={stat.end} duration={2.5} suffix={stat.suffix} />
                ) : (
                  `0${stat.suffix}`
                )}
              </p>
              <p style={s.statLabel}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Values */}
      <div style={s.section}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ ...s.sectionTitle, textAlign: 'center' }}>Our Values</h2>
          <p style={{ ...s.sectionSubtitle, margin: '10px auto 0' }}>
            The principles that guide everything we do.
          </p>
        </div>
        <div style={s.valGrid}>
          {values.map((val, i) => (
            <motion.div
              key={i}
              style={s.valCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -5, boxShadow: '0 6px 24px rgba(0,0,0,0.1)' }}
            >
              <div style={s.valIconBox}>
                <val.icon size={22} color="#0f4c81" />
              </div>
              <h3 style={s.valTitle}>{val.title}</h3>
              <p style={s.valDesc}>{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ ...s.section, paddingTop: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ ...s.sectionTitle, textAlign: 'center' }}>Meet Our Team</h2>
          <p style={{ ...s.sectionSubtitle, margin: '10px auto 0' }}>
            The people behind BServ's success.
          </p>
        </div>
        <div style={s.teamGrid}>
          {team.map((member, i) => (
            <motion.div
              key={i}
              style={s.teamCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
            >
              <div style={{ ...s.teamImg, background: member.color }}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={s.teamInfo}>
                <h3 style={s.teamName}>{member.name}</h3>
                <p style={s.teamRole}>{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ ...s.section, paddingTop: 0 }}>
        <motion.div
          style={s.cta}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={s.ctaTitle}>Ready to Partner with Us?</h2>
          <p style={s.ctaSub}>
            Let us help you find the perfect photocopier solution for your business needs.
          </p>
          <motion.a
            href="/contact"
            style={s.ctaBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Get in Touch <FiArrowRight size={18} />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
