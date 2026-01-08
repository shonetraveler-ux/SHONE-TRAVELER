import React from 'react';
import '../styles/App.css';

const Hero = () => {
  return (
    <section id="home" style={styles.hero}>
      <div className="container" style={styles.heroContent}>
        <h1 style={styles.heroTitle}>The Home of Sri Lankan Hospitality</h1>
        <p style={styles.heroSubtitle}>Welcome to SHONE TRAVELER</p>
        <p style={styles.heroText}>
          Paradise. Where else do you find perfect beaches, ancient history, vibrant culture, exotic cuisine and exciting wilderness in one tiny island? Come, let's explore Sri Lanka.
        </p>
        <a href="#tours" className="btn-primary" style={styles.ctaButton}>
          Start Your Journey
        </a>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/home-desctop.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'var(--white)',
    textAlign: 'center',
    padding: '120px 0',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center'
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontFamily: "'Playfair Display', serif",
    marginBottom: '20px',
    fontWeight: '700'
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: 'var(--gold)'
  },
  heroText: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    lineHeight: '1.8'
  },
  ctaButton: {
    fontSize: '1.1rem',
    padding: '15px 40px'
  },
  '@media (max-width: 768px)': {
    hero: {
      padding: '80px 0'
    },
    heroTitle: {
      fontSize: '2.5rem'
    },
    heroSubtitle: {
      fontSize: '1.2rem'
    },
    heroText: {
      fontSize: '1rem'
    }
  }
};

export default Hero;