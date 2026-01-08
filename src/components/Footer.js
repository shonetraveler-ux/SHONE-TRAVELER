import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/App.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer id="contact" style={styles.footer}>
      <div className="container">
        {/* Newsletter Section */}
        <div style={styles.newsletterSection}>
          <h2 style={styles.newsletterTitle}>Subscribe to our Newsletter</h2>
          <p style={styles.newsletterSubtitle}>For the latest updates and special offers.</p>
          <form onSubmit={handleSubmit} style={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.newsletterInput}
            />
            <button type="submit" style={styles.newsletterButton}>
              SUBMIT
            </button>
          </form>
        </div>

        <div className="footer-content" style={styles.footerContent}>
          <div className="footer-section" style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Navigation</h3>
            <ul style={styles.footerList}>
              {['Home', 'Tours', 'Destinations', 'Accommodations', 'Promotions', 'Blog'].map((item) => (
                <li key={item} style={styles.footerItem}>
                  <a href={`#${item.toLowerCase()}`} style={styles.footerLink}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section" style={styles.footerSection}>
            <h3 style={styles.footerTitle}>SHONE TRAVELER Family</h3>
            <ul style={styles.footerList}>
              {['Hotels', 'Travels', 'Experiences', 'Sustainability'].map((item) => (
                <li key={item} style={styles.footerItem}>
                  <button style={styles.footerLink} onClick={() => {}}>{item}</button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section" style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Contact Us</h3>
            <div style={styles.contactInfo}>
              <p style={styles.contactItem}>
                <FaPhone style={styles.contactIcon} /> Hotline: +94 78 656 2997
              </p>
              <p style={styles.contactNote}>(24/7) Only for international inquiries</p>
              <p style={styles.contactItem}>
                <FaMapMarkerAlt style={styles.contactIcon} /> SHONE TRAVELER (Private) Ltd
              </p>
              <p style={styles.contactAddress}>46/26, Navam Mawatha, Colombo 02, SRI LANKA.</p>
              <p style={styles.contactItem}>
                <FaEnvelope style={styles.contactIcon} /> Email: inquiries@shonetraveler.com
              </p>
            </div>
            
            <div className="social-icons" style={styles.socialIcons}>
              <button style={styles.socialIcon} aria-label="Facebook" onClick={() => {}}>
                <FaFacebookF />
              </button>
              <button style={styles.socialIcon} aria-label="Instagram" onClick={() => {}}>
                <FaInstagram />
              </button>
              <button style={styles.socialIcon} aria-label="Twitter" onClick={() => {}}>
                <FaTwitter />
              </button>
              <button style={styles.socialIcon} aria-label="YouTube" onClick={() => {}}>
                <FaYoutube />
              </button>
            </div>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} SHONE TRAVELER. All rights reserved.</p>
          <p>The Home of Sri Lankan Hospitality</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  newsletterSection: {
    textAlign: 'center',
    marginBottom: '60px',
    padding: '40px 0',
    borderBottom: '1px solid var(--light-gray)',
  },
  newsletterTitle: {
    color: 'var(--gold)',
    fontSize: '2rem',
    marginBottom: '10px',
  },
  newsletterSubtitle: {
    color: 'var(--light-gray)',
    fontSize: '1.1rem',
    marginBottom: '30px',
  },
  newsletterForm: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  newsletterInput: {
    flex: 1,
    padding: '12px 15px',
    border: '1px solid var(--light-gray)',
    borderRadius: '5px',
    backgroundColor: 'var(--white)',
    color: 'var(--dark-blue)',
    fontSize: '1rem',
  },
  newsletterButton: {
    padding: '12px 20px',
    backgroundColor: 'var(--gold)',
    color: 'var(--dark-blue)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'var(--transition)',
  },
  footer: {
    backgroundColor: 'var(--dark-blue)',
    color: 'var(--white)',
    padding: '60px 0 30px'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  footerSection: {},
  footerTitle: {
    color: 'var(--gold)',
    marginBottom: '20px',
    fontSize: '1.2rem'
  },
  footerList: {
    listStyle: 'none'
  },
  footerItem: {
    marginBottom: '10px'
  },
  footerLink: {
    color: 'var(--light-gray)',
    textDecoration: 'none',
    transition: 'var(--transition)'
  },
  footerLinkHover: {
    color: 'var(--gold)'
  },
  contactInfo: {
    color: 'var(--light-gray)'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  contactIcon: {
    color: 'var(--gold)'
  },
  contactNote: {
    fontSize: '0.9rem',
    opacity: 0.8,
    marginBottom: '15px'
  },
  contactAddress: {
    marginBottom: '15px',
    paddingLeft: '25px'
  },
  socialIcons: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  },
  socialIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    color: 'var(--white)',
    textDecoration: 'none',
    transition: 'var(--transition)'
  },
  socialIconHover: {
    backgroundColor: 'var(--gold)'
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '30px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--light-gray)',
    fontSize: '0.9rem'
  }
};

export default Footer;