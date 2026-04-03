import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiArrowUp, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const styles = {
  footer: {
    background: '#0f172a',
    color: '#cbd5e1',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: '0.95rem',
    lineHeight: 1.7,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
  },
  heading: {
    color: '#ffffff',
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '20px',
    position: 'relative',
    paddingBottom: '12px',
  },
  headingBar: {
    content: '',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '40px',
    height: '3px',
    background: '#3b82f6',
    borderRadius: '2px',
  },
  description: {
    color: '#94a3b8',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  linkItem: {
    marginBottom: '10px',
  },
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    display: 'inline-block',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '14px',
  },
  contactIcon: {
    color: '#3b82f6',
    marginTop: '4px',
    flexShrink: 0,
  },
  socialRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    padding: '30px 0',
    borderTop: '1px solid #1e293b',
    marginTop: '40px',
  },
  socialIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  copyright: {
    textAlign: 'center',
    padding: '20px 0',
    borderTop: '1px solid #1e293b',
    color: '#64748b',
    fontSize: '0.85rem',
  },
  scrollTopBtn: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
    zIndex: 1000,
  },
  responsiveGrid: `
    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 576px) {
      .footer-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `,
};

const MotionLink = motion(Link);

const FooterHeading = ({ children }) => (
  <h3 style={styles.heading}>
    {children}
    <span style={styles.headingBar} />
  </h3>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Machines', to: '/machines' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const serviceLinks = [
    { label: 'Buy Machines', to: '/services/buy' },
    { label: 'Rent Machines', to: '/services/rent' },
    { label: 'Machine Repair', to: '/services/repair' },
    { label: 'Spare Parts', to: '/services/parts' },
  ];

  const socialIcons = [
    { Icon: FiFacebook, href: '#' },
    { Icon: FiTwitter, href: '#' },
    { Icon: FiInstagram, href: '#' },
    { Icon: FiLinkedin, href: '#' },
  ];

  return (
    <footer style={styles.footer}>
      <style>{styles.responsiveGrid}</style>
      <div style={styles.container}>
        <div className="footer-grid" style={styles.grid}>
          {/* About Column */}
          <div>
            <FooterHeading>About BServ</FooterHeading>
            <p style={styles.description}>
              BServ is your trusted partner for premium photocopier machines. We provide
              top-quality sales, rentals, repairs, and spare parts to keep your business
              running smoothly.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul style={styles.linkList}>
              {quickLinks.map(({ label, to }) => (
                <li key={label} style={styles.linkItem}>
                  <MotionLink
                    to={to}
                    style={styles.link}
                    whileHover={{ color: '#3b82f6', x: 4 }}
                  >
                    {label}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <FooterHeading>Our Services</FooterHeading>
            <ul style={styles.linkList}>
              {serviceLinks.map(({ label, to }) => (
                <li key={label} style={styles.linkItem}>
                  <MotionLink
                    to={to}
                    style={styles.link}
                    whileHover={{ color: '#3b82f6', x: 4 }}
                  >
                    {label}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <FooterHeading>Contact Info</FooterHeading>
            <div style={styles.contactRow}>
              <FiMapPin size={18} style={styles.contactIcon} />
              <span>123 Business Avenue, Tech District, Nairobi, Kenya</span>
            </div>
            <div style={styles.contactRow}>
              <FiPhone size={18} style={styles.contactIcon} />
              <span>+254 700 123 456</span>
            </div>
            <div style={styles.contactRow}>
              <FiMail size={18} style={styles.contactIcon} />
              <span>info@bserv.co.ke</span>
            </div>
          </div>
        </div>

        {/* Social Media Row */}
        <div style={styles.socialRow}>
          {socialIcons.map(({ Icon, href }, index) => (
            <motion.a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialIcon}
              whileHover={{
                scale: 1.15,
                background: '#3b82f6',
                color: '#ffffff',
                borderColor: '#3b82f6',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </div>

        {/* Copyright Bar */}
        <div style={styles.copyright}>
          &copy; 2024 BServ. All rights reserved.
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        style={styles.scrollTopBtn}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <FiArrowUp size={22} />
      </motion.button>
    </footer>
  );
};

export default Footer;
