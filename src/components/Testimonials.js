import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import '../styles/App.css';

const Testimonials = () => {
  return (
    <section className="section-padding" style={styles.section}>
      <div className="container">
        <h2 className="section-title">The memories they made</h2>
        <p className="section-subtitle">Our guests share their thoughts</p>
        
        <div className="testimonial-container" style={styles.testimonialContainer}>
          <div style={styles.quoteIcon}>
            <FaQuoteLeft />
          </div>
          <p className="testimonial-text" style={styles.testimonialText}>
            "Had a magical trip to Sri Lanka with over 1,000 photos and a fantastic 20-minute film made by our son. Smooth, hassle-free holiday with a perfect guide. Highly recommended!"
          </p>
          <p style={styles.testimonialAuthor}>Charlotte, United Kingdom</p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--medium-gray)'
  },
  testimonialContainer: {
    maxWidth: '800px',
    margin: '40px auto 0',
    padding: '50px',
    backgroundColor: 'var(--white)',
    borderRadius: '10px',
    boxShadow: 'var(--shadow)',
    textAlign: 'center',
    position: 'relative'
  },
  quoteIcon: {
    fontSize: '2.5rem',
    color: 'var(--gold)',
    marginBottom: '20px'
  },
  testimonialText: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: 'var(--text-medium)',
    marginBottom: '25px',
    lineHeight: '1.8'
  },
  testimonialAuthor: {
    fontWeight: 'bold',
    color: 'var(--primary-blue)',
    fontSize: '1.1rem'
  }
};

export default Testimonials;