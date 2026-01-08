import React from 'react';
import '../styles/App.css';

const Tours = () => {
  return (
    <section id="tours" className="section-padding" style={styles.section}>
      <div className="container">
        <h2 className="section-title">Discover paradise, the SHONE TRAVELER way</h2>
        <p className="section-subtitle">Your journey: your plan.</p>
        <div style={styles.toursContent}>
          <p>Accommodations of choice</p>
          <a href="#accommodations" className="btn-primary">View all tours</a>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--light-gray)',
  },
  toursContent: {
    textAlign: 'center',
    marginTop: '30px',
  },
};

export default Tours;