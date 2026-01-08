import React, { useState } from 'react';
import '../styles/App.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with email:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <section className="section-padding" style={styles.section}>
      <div className="container">
        <div style={styles.newsletterContent}>
          <h2 style={styles.title}>Subscribe to our Newsletter</h2>
          <p style={styles.subtitle}>For the latest updates and special offers.</p>
          
          <form onSubmit={handleSubmit} className="newsletter-form" style={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
              style={styles.input}
            />
            <button type="submit" className="newsletter-button" style={styles.button}>
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--primary-blue)',
    color: 'var(--white)'
  },
  newsletterContent: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto'
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '15px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--light-gray)',
    marginBottom: '30px',
    opacity: 0.9
  },
  newsletterForm: {
    display: 'flex',
    gap: '0'
  },
  input: {
    flex: '1',
    padding: '15px',
    border: 'none',
    borderRadius: '5px 0 0 5px',
    fontSize: '1rem',
    outline: 'none'
  },
  button: {
    backgroundColor: 'var(--gold)',
    color: 'var(--white)',
    border: 'none',
    padding: '0 30px',
    borderRadius: '0 5px 5px 0',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'var(--transition)'
  }
};

export default Newsletter;