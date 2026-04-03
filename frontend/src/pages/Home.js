import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiPrinter,
  FiShield,
  FiTruck,
  FiClock,
  FiStar,
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiPhone,
} from 'react-icons/fi';
import CountUp from 'react-countup';
import { useInView as useInViewIO } from 'react-intersection-observer';
import { getFeaturedMachines, getCategories } from '../api';
import MachineCard from '../components/MachineCard';

/* ───────────────────────── helpers ───────────────────────── */

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return width;
};

/* reusable scroll-triggered wrapper */
const AnimatedSection = ({ children, style, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* ───────────────────────── constants ───────────────────────── */

const PRIMARY = '#0f4c81';
const ACCENT = '#ff6b35';
const HERO_DARK = '#0a3458';
const HERO_LIGHT = '#1a6db5';
const LIGHT_BG = '#f8fafc';

const rotatingWords = [
  'Photocopier Machines',
  'Printing Solutions',
  'Office Equipment',
];

const stats = [
  { icon: <FiPrinter />, end: 500, suffix: '+', label: 'Machines Sold' },
  { icon: <FiUsers />, end: 200, suffix: '+', label: 'Rental Clients' },
  { icon: <FiStar />, end: 15, suffix: '+', label: 'Years Experience' },
  { icon: <FiAward />, end: 50, suffix: '+', label: 'Brands Available' },
];

const whyCards = [
  {
    icon: <FiShield size={32} />,
    title: 'Certified Machines',
    desc: 'Every machine is rigorously inspected and certified to meet the highest quality and performance standards.',
  },
  {
    icon: <FiTruck size={32} />,
    title: 'Free Delivery',
    desc: 'Enjoy complimentary delivery and professional installation across the region at no extra cost.',
  },
  {
    icon: <FiClock size={32} />,
    title: '24/7 Support',
    desc: 'Our dedicated support team is available around the clock to keep your machines running smoothly.',
  },
  {
    icon: <FiAward size={32} />,
    title: 'Best Prices',
    desc: 'Competitive pricing with flexible rental and purchase plans designed to fit any budget.',
  },
];

const checkList = [
  'Wide range of top-brand photocopiers',
  'Flexible rental and lease options',
  'Expert maintenance and repair services',
  'Genuine parts and consumables',
  'Tailored solutions for every business size',
];

/* ───────────────────────── floating shapes ───────────────────────── */

const FloatingShape = ({ size, top, left, borderRadius, delay, duration, color }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      left,
      borderRadius: borderRadius || '50%',
      background: color || 'rgba(255,255,255,0.06)',
      pointerEvents: 'none',
    }}
    animate={{ y: [0, -30, 0], rotate: [0, 360] }}
    transition={{ duration: duration || 12, repeat: Infinity, delay: delay || 0, ease: 'easeInOut' }}
  />
);

/* ───────────────────────── skeleton card ───────────────────────── */

const SkeletonCard = () => (
  <div
    style={{
      background: '#e2e8f0',
      borderRadius: 16,
      height: 360,
      animation: 'pulse 1.5s infinite',
    }}
  />
);

/* ================================================================= */
/*                           HOME COMPONENT                          */
/* ================================================================= */

const Home = () => {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width < 1024;

  /* rotating word index */
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % rotatingWords.length), 3000);
    return () => clearInterval(id);
  }, []);

  /* API data */
  const [machines, setMachines] = useState([]);
  const [machinesLoading, setMachinesLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    getFeaturedMachines()
      .then((res) => setMachines(res.data?.data || []))
      .catch(() => {})
      .finally(() => setMachinesLoading(false));

    getCategories()
      .then((res) => setCategories(res.data?.data || []))
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
  }, []);

  /* stats intersection observer */
  const { ref: statsRef, inView: statsInView } = useInViewIO({ triggerOnce: true, threshold: 0.3 });

  /* ────────────── styles ────────────── */

  const sectionPadding = isMobile
    ? '60px 20px'
    : isTablet
    ? '80px 40px'
    : '100px 80px';

  const sectionTitle = {
    fontSize: isMobile ? 28 : 40,
    fontWeight: 800,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  };

  const sectionSub = {
    fontSize: isMobile ? 15 : 18,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 600,
    margin: '0 auto 48px',
    lineHeight: 1.6,
  };

  /* ════════════════════════ RENDER ════════════════════════ */

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* inject keyframes once */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* ─────────────── 1. HERO ─────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${HERO_DARK} 0%, ${HERO_LIGHT} 100%)`,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: isMobile ? '100px 20px 60px' : '0 80px',
        }}
      >
        {/* floating shapes */}
        <FloatingShape size={300} top="-80px" left="-100px" delay={0} duration={18} />
        <FloatingShape size={180} top="60%" left="75%" delay={2} duration={14} />
        <FloatingShape size={100} top="20%" left="55%" borderRadius="20%" delay={1} duration={10} color="rgba(255,107,53,0.12)" />
        <FloatingShape size={60} top="75%" left="15%" borderRadius="30%" delay={3} duration={16} />
        <FloatingShape size={220} top="10%" left="85%" delay={4} duration={20} color="rgba(255,255,255,0.04)" />
        <FloatingShape size={40} top="45%" left="40%" borderRadius="10%" delay={0.5} duration={9} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 1320,
            margin: '0 auto',
            gap: isMobile ? 40 : 60,
          }}
        >
          {/* left text */}
          <div style={{ flex: 1, maxWidth: isMobile ? '100%' : 600 }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                color: ACCENT,
                fontWeight: 700,
                fontSize: isMobile ? 14 : 16,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Welcome to BServ
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{
                color: '#fff',
                fontSize: isMobile ? 32 : isTablet ? 42 : 54,
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 0,
              }}
            >
              Your Trusted Partner for
            </motion.h1>

            {/* rotating word */}
            <div style={{ height: isMobile ? 48 : 70, position: 'relative', marginBottom: 24 }}>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={wordIdx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.45 }}
                  style={{
                    position: 'absolute',
                    color: ACCENT,
                    fontSize: isMobile ? 32 : isTablet ? 42 : 54,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {rotatingWords[wordIdx]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              style={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: isMobile ? 15 : 18,
                lineHeight: 1.7,
                maxWidth: 520,
                marginBottom: 36,
              }}
            >
              BServ is your one-stop destination for high-quality photocopier machines, printers,
              and office equipment. Whether you need to buy, rent, or lease, we offer the best
              brands at unbeatable prices with expert support every step of the way.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <Link to="/machines" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: ACCENT,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 50,
                    padding: '16px 36px',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 8px 30px rgba(255,107,53,0.35)',
                  }}
                >
                  Browse Machines <FiArrowRight />
                </motion.button>
              </Link>

              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'transparent',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: 50,
                    padding: '14px 36px',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  Contact Us <FiPhone />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* right illustration area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{
              flex: 1,
              display: isMobile ? 'none' : 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              minHeight: 420,
            }}
          >
            {/* main printer icon area */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <FiPrinter size={140} color="rgba(255,255,255,0.85)" strokeWidth={1} />
            </motion.div>

            {/* floating badge top-right */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{
                position: 'absolute',
                top: 30,
                right: 20,
                background: ACCENT,
                color: '#fff',
                borderRadius: 16,
                padding: '14px 22px',
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 8px 30px rgba(255,107,53,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <FiStar /> Top Rated
            </motion.div>

            {/* floating badge bottom-left */}
            <motion.div
              animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{
                position: 'absolute',
                bottom: 40,
                left: 10,
                background: '#fff',
                color: PRIMARY,
                borderRadius: 16,
                padding: '14px 22px',
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <FiShield /> Certified Quality
            </motion.div>

            {/* floating badge bottom-right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{
                position: 'absolute',
                bottom: 60,
                right: 0,
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                borderRadius: 16,
                padding: '12px 20px',
                fontWeight: 600,
                fontSize: 13,
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <FiTruck /> Free Delivery
            </motion.div>
          </motion.div>
        </div>

        {/* curved bottom edge */}
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
          }}
        >
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ width: '100%', height: 60 }}>
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,100 L0,100 Z" fill={LIGHT_BG} />
          </svg>
        </div>
      </section>

      {/* ─────────────── 2. STATS COUNTER ─────────────── */}
      <section
        ref={statsRef}
        style={{
          background: LIGHT_BG,
          padding: sectionPadding,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(4, 1fr)',
            gap: isMobile ? 24 : 40,
          }}
        >
          {stats.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                style={{
                  textAlign: 'center',
                  padding: isMobile ? '24px 12px' : '36px 20px',
                  background: '#fff',
                  borderRadius: 20,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${PRIMARY}, ${HERO_LIGHT})`,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    margin: '0 auto 16px',
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 30 : 42,
                    fontWeight: 800,
                    color: PRIMARY,
                    lineHeight: 1.1,
                  }}
                >
                  {statsInView ? (
                    <CountUp end={s.end} duration={2.5} suffix={s.suffix} />
                  ) : (
                    `0${s.suffix}`
                  )}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 13 : 15,
                    color: '#64748b',
                    fontWeight: 600,
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─────────────── 3. FEATURED MACHINES ─────────────── */}
      <section style={{ padding: sectionPadding, background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <AnimatedSection>
            <h2 style={sectionTitle}>Featured Machines</h2>
            <p style={sectionSub}>
              Explore our hand-picked selection of top-performing photocopiers and printers,
              trusted by businesses across the country.
            </p>
          </AnimatedSection>

          {machinesLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(4, 1fr)',
                gap: 24,
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(4, 1fr)',
                gap: 24,
              }}
            >
              {machines.slice(0, 8).map((machine, i) => (
                <AnimatedSection key={machine.id || i} delay={i * 0.08}>
                  <MachineCard machine={machine} />
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link to="/machines" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: PRIMARY,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 50,
                    padding: '16px 40px',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 8px 30px rgba(15,76,129,0.25)',
                  }}
                >
                  View All Machines <FiArrowRight />
                </motion.button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─────────────── 4. CATEGORIES ─────────────── */}
      <section style={{ padding: sectionPadding, background: LIGHT_BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AnimatedSection>
            <h2 style={sectionTitle}>Browse by Category</h2>
            <p style={sectionSub}>
              Find the right machine for your needs. Browse our carefully organized categories
              to quickly locate the perfect solution.
            </p>
          </AnimatedSection>

          {categoriesLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
                gap: 24,
              }}
            >
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
                gap: 28,
              }}
            >
              {categories.map((cat, i) => (
                <AnimatedSection key={cat.id || i} delay={i * 0.1}>
                  <Link
                    to={`/machines?category=${cat.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{
                        borderRadius: 20,
                        overflow: 'hidden',
                        background: '#fff',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          height: 200,
                          background: cat.image
                            ? `url(${cat.image}) center/cover no-repeat`
                            : `linear-gradient(135deg, ${PRIMARY}, ${HERO_LIGHT})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {!cat.image && (
                          <FiPrinter size={64} color="rgba(255,255,255,0.5)" />
                        )}
                      </div>
                      <div style={{ padding: '20px 24px' }}>
                        <h3
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#0f172a',
                            margin: 0,
                          }}
                        >
                          {cat.name}
                        </h3>
                        <p
                          style={{
                            fontSize: 14,
                            color: '#64748b',
                            margin: '6px 0 0',
                          }}
                        >
                          {cat.machine_count != null
                            ? `${cat.machine_count} machines`
                            : 'Explore category'}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────── 5. WHY CHOOSE US ─────────────── */}
      <section style={{ padding: sectionPadding, background: '#fff' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: isMobile ? 40 : 80,
          }}
        >
          {/* left */}
          <AnimatedSection style={{ flex: 1 }}>
            <div>
              <h2
                style={{
                  fontSize: isMobile ? 28 : 40,
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: 16,
                  lineHeight: 1.2,
                }}
              >
                Why Choose{' '}
                <span style={{ color: PRIMARY }}>BServ</span>?
              </h2>
              <p
                style={{
                  fontSize: isMobile ? 15 : 17,
                  color: '#64748b',
                  lineHeight: 1.7,
                  marginBottom: 28,
                }}
              >
                With over 15 years of experience in the photocopier and printing industry, BServ
                has established itself as a market leader. We combine top-quality products with
                unmatched customer service to deliver complete office solutions that keep your
                business running efficiently.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {checkList.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 14,
                      fontSize: isMobile ? 14 : 16,
                      color: '#334155',
                      fontWeight: 500,
                    }}
                  >
                    <FiCheckCircle color={ACCENT} size={20} style={{ flexShrink: 0 }} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          {/* right - 2x2 cards */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {whyCards.map((card, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
                  style={{
                    background: LIGHT_BG,
                    borderRadius: 20,
                    padding: isMobile ? 24 : 28,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: `linear-gradient(135deg, ${PRIMARY}, ${HERO_LIGHT})`,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    {card.icon}
                  </div>
                  <h4
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: '0 0 8px',
                    }}
                  >
                    {card.title}
                  </h4>
                  <p
                    style={{
                      fontSize: 14,
                      color: '#64748b',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {card.desc}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── 6. CTA BANNER ─────────────── */}
      <section
        style={{
          position: 'relative',
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
          padding: isMobile ? '60px 20px' : '80px 80px',
          overflow: 'hidden',
        }}
      >
        {/* animated background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1.5px, transparent 1.5px), radial-gradient(circle at 60% 80%, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px, 80px 80px, 50px 50px',
            pointerEvents: 'none',
          }}
        />
        <FloatingShape size={200} top="-60px" left="80%" delay={0} duration={15} color="rgba(255,255,255,0.06)" />
        <FloatingShape size={120} top="60%" left="5%" delay={2} duration={12} color="rgba(255,255,255,0.05)" />

        <AnimatedSection>
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: 900,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? 26 : 42,
                fontWeight: 800,
                color: '#fff',
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Ready to find your perfect photocopier?
            </h2>
            <p
              style={{
                fontSize: isMobile ? 15 : 18,
                color: 'rgba(255,255,255,0.85)',
                maxWidth: 600,
                margin: '0 auto 36px',
                lineHeight: 1.6,
              }}
            >
              Get in touch with our experts today and let us help you choose the ideal machine
              for your business needs and budget.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
              }}
            >
              <Link to="/machines" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: '#fff',
                    color: PRIMARY,
                    border: 'none',
                    borderRadius: 50,
                    padding: '16px 40px',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  }}
                >
                  Get Started <FiArrowRight />
                </motion.button>
              </Link>

              <a
                href="tel:+1234567890"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#fff',
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.18)',
                  }}
                >
                  <FiPhone size={20} />
                </motion.span>
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Home;
