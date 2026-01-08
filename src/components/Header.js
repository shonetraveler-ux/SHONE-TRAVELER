import React, { useState } from 'react';
import { FaPhone, FaVideo, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/App.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar" style={styles.topBar}>
        <div className="container" style={styles.topBarContainer}>
          <div style={styles.logoSmall}>SHONE TRAVELER</div>
          <div style={styles.contactTop}>
            <a href="tel:+94786562997" style={styles.contactLink}>
              <FaPhone style={styles.icon} /> +94 78 656 2997 (24/7)
            </a>
            <button onClick={() => alert('Video chat service coming soon!')} style={styles.videoButton}>
              <FaVideo style={styles.icon} /> Video Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header style={styles.header}>
        <div className="container" style={styles.navContainer}>
          <div style={styles.logo}>
            SHONE <span style={styles.logoHighlight}>TRAVELER</span>
          </div>
          
          <button 
            style={styles.mobileMenuBtn} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <nav style={{...styles.nav, ...(isMenuOpen ? styles.navOpen : {})}}>
            <ul style={styles.navList}>
              {['Home', 'Tours', 'Destinations', 'Accommodations', 'Promotions', 'Blog', 'Contact'].map((item) => (
                <li key={item} style={styles.navItem}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    style={styles.navLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

const styles = {
  topBar: {
    backgroundColor: 'var(--primary-blue)',
    color: 'var(--white)',
    padding: '10px 0',
    fontSize: '0.9rem'
  },
  topBarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoSmall: {
    fontWeight: 'bold'
  },
  contactTop: {
    display: 'flex',
    gap: '20px'
  },
  contactLink: {
    color: 'var(--white)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  videoButton: {
    background: 'none',
    border: 'none',
    color: 'var(--white)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  icon: {
    fontSize: '0.9rem'
  },
  header: {
    padding: '20px 0',
    backgroundColor: 'var(--white)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'var(--primary-blue)'
  },
  logoHighlight: {
    color: 'var(--gold)'
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: 'var(--primary-blue)',
    cursor: 'pointer'
  },
  nav: {},
  navOpen: {
    display: 'block'
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    gap: '25px'
  },
  navItem: {},
  navLink: {
    textDecoration: 'none',
    color: 'var(--text-dark)',
    fontWeight: 500,
    transition: 'var(--transition)'
  },
  '@media (max-width: 768px)': {
    mobileMenuBtn: {
      display: 'block'
    },
    nav: {
      display: 'none',
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'var(--white)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      padding: '20px'
    },
    navList: {
      flexDirection: 'column',
      gap: '15px'
    }
  }
};

export default Header;