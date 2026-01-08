import React from 'react';
import '../styles/App.css';

const JourneyTypes = () => {
  const journeyTypes = [
    {
      image: "/images/perahara.jpg",
      title: 'Authentic Ceylon',
      description: 'Experience the true essence of Sri Lankan culture and traditions.'
    },
    {
      image: "/images/advencher.jpg",
      title: 'Adventurous Spirit',
      description: 'Thrilling experiences for the adventurous traveler.'
    },
    {
      image: "/images/luxury.jpg",
      title: 'Barefoot Luxury',
      description: 'Luxurious experiences in harmony with nature.'
    },
    {
      image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Join a Group',
      description: 'Travel with like-minded explorers on guided group tours.'
    }
  ];

  return (
    <section className="section-padding" style={styles.section}>
      <div className="container">
        <h2 className="section-title">The paths are many - you choose.</h2>
        <p className="section-subtitle">What's your journey? Your adventure. Your way.</p>
        
        <div style={styles.journeyGrid}>
          {journeyTypes.map((journey, index) => (
            <div key={index} style={styles.journeyCard}>
              <div style={styles.journeyImage}>
                <img 
                  src={journey.image} 
                  alt={journey.title} 
                  style={styles.image}
                />
              </div>
              <div style={styles.journeyContent}>
                <h3 style={styles.journeyTitle}>{journey.title}</h3>
                <p style={styles.journeyDescription}>{journey.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--medium-gray)'
  },
  journeyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    marginTop: '40px'
  },
  journeyCard: {
    backgroundColor: 'var(--white)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  },
  journeyCardHover: {
    transform: 'translateY(-10px)'
  },
  journeyImage: {
    height: '200px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },
  journeyContent: {
    padding: '25px'
  },
  journeyTitle: {
    color: 'var(--primary-blue)',
    marginBottom: '10px',
    fontSize: '1.3rem'
  },
  journeyDescription: {
    color: 'var(--text-medium)',
    fontSize: '0.95rem',
    lineHeight: '1.6'
  },
  '@media (max-width: 768px)': {
    journeyGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px'
    },
    journeyImage: {
      height: '180px'
    }
  }
};

export default JourneyTypes;