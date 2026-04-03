import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhone, FiMail, FiPrinter } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Machines', path: '/machines' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const colors = {
  primary: '#0f4c81',
  accent: '#ff6b35',
  white: '#ffffff',
  lightGray: '#f8f9fa',
  textMuted: '#cbd5e1',
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const sidebarVariants = {
    closed: {
      x: '100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const linkItemVariants = {
    closed: { opacity: 0, x: 30 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.08, duration: 0.3 },
    }),
  };

  const styles = {
    topBar: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '8px 0',
      fontSize: '14px',
    },
    topBarInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap',
    },
    topBarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: colors.textMuted,
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : colors.white,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'background-color 0.3s, box-shadow 0.3s, backdrop-filter 0.3s',
    },
    navInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '72px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      color: colors.primary,
      fontSize: '26px',
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    logoIcon: {
      color: colors.accent,
      fontSize: '28px',
      display: 'flex',
    },
    desktopLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    navLink: (isActive) => ({
      textDecoration: 'none',
      color: isActive ? colors.accent : colors.primary,
      fontWeight: isActive ? 700 : 500,
      fontSize: '15px',
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: isActive ? 'rgba(255,107,53,0.08)' : 'transparent',
      transition: 'all 0.2s',
      position: 'relative',
    }),
    ctaButton: {
      display: 'inline-block',
      textDecoration: 'none',
      backgroundColor: colors.accent,
      color: colors.white,
      fontWeight: 600,
      fontSize: '15px',
      padding: '10px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
    },
    hamburger: {
      display: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: colors.primary,
      fontSize: '26px',
      padding: '4px',
      zIndex: 1100,
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 1050,
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '280px',
      backgroundColor: colors.white,
      zIndex: 1060,
      display: 'flex',
      flexDirection: 'column',
      padding: '80px 32px 32px',
      boxShadow: '-4px 0 30px rgba(0,0,0,0.12)',
    },
    sidebarClose: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: colors.primary,
      fontSize: '26px',
      padding: '4px',
    },
    mobileLink: (isActive) => ({
      textDecoration: 'none',
      color: isActive ? colors.accent : colors.primary,
      fontWeight: isActive ? 700 : 500,
      fontSize: '18px',
      padding: '14px 0',
      borderBottom: `1px solid ${colors.lightGray}`,
      display: 'block',
    }),
    mobileCta: {
      marginTop: '24px',
      textAlign: 'center',
      textDecoration: 'none',
      backgroundColor: colors.accent,
      color: colors.white,
      fontWeight: 600,
      fontSize: '16px',
      padding: '14px 24px',
      borderRadius: '8px',
      display: 'block',
      boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
    },
    mobileContact: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingTop: '24px',
      borderTop: `1px solid ${colors.lightGray}`,
    },
    mobileContactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: colors.primary,
      textDecoration: 'none',
      fontSize: '14px',
    },
    /* responsive helpers applied via media-query-like logic below */
  };

  const mediaQuery = typeof window !== 'undefined' && window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(mediaQuery);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarInner}>
          <a href="tel:+1234567890" style={styles.topBarItem}>
            <FiPhone size={14} />
            <span>+1 (234) 567-890</span>
          </a>
          <a href="mailto:info@bserv.com" style={styles.topBarItem}>
            <FiMail size={14} />
            <span>info@bserv.com</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <header style={styles.header}>
        <nav style={styles.navInner}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <motion.span
              style={styles.logoIcon}
              whileHover={{ rotate: -15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FiPrinter />
            </motion.span>
            BServ
          </Link>

          {/* Desktop Links */}
          {!isMobile && (
            <ul style={styles.desktopLinks}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link to={link.path} style={styles.navLink(isActive)}>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            left: '16px',
                            right: '16px',
                            height: '3px',
                            borderRadius: '2px',
                            backgroundColor: colors.accent,
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Desktop CTA */}
          {!isMobile && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" style={styles.ctaButton}>
                Get Quote
              </Link>
            </motion.div>
          )}

          {/* Hamburger Button */}
          {isMobile && (
            <button
              style={{ ...styles.hamburger, display: 'block' }}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <FiMenu />
            </button>
          )}
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              style={styles.overlay}
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              style={styles.sidebar}
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <button
                style={styles.sidebarClose}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <FiX />
              </button>

              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    custom={i}
                    variants={linkItemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link to={link.path} style={styles.mobileLink(isActive)}>
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                custom={navLinks.length}
                variants={linkItemVariants}
                initial="closed"
                animate="open"
              >
                <Link to="/contact" style={styles.mobileCta}>
                  Get Quote
                </Link>
              </motion.div>

              <div style={styles.mobileContact}>
                <a href="tel:+1234567890" style={styles.mobileContactItem}>
                  <FiPhone size={14} />
                  <span>+1 (234) 567-890</span>
                </a>
                <a href="mailto:info@bserv.com" style={styles.mobileContactItem}>
                  <FiMail size={14} />
                  <span>info@bserv.com</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
