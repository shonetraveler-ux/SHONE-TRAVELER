import React from 'react';
import { FaCalendarCheck, FaHotel, FaBus, FaLeaf } from 'react-icons/fa';
import '../styles/App.css';

const Features = () => {
  const features = [
    {
      icon: <FaCalendarCheck />,
      title: 'Over 50 Years In Business',
      description: 'Decades of excellence in creating unforgettable Sri Lankan experiences.'
    },
    {
      icon: <FaHotel />,
      title: 'Our Own Hotels Across The Island',
      description: 'Premium accommodations in the most beautiful locations.'
    },
    {
      icon: <FaBus />,
      title: 'Our Own Fleet of Vehicles',
      description: 'Comfortable and reliable transportation for all your travels.'
    },
    {
      icon: <FaLeaf />,
      title: 'Sustainability',
      description: 'Committed to responsible tourism and preserving Sri Lanka\'s beauty.'
    }
  ];

  return (
    <section className="section-padding" style={styles.section}>
      <div className="container">
        <h2 className="section-title">Sri Lanka with SHONE TRAVELER</h2>
        <p style={styles.introText}>
          With over 4 decades of experience, we know our island home; its every nook and corner. 
          A leading Destination Management Company in Sri Lanka, our service is legendary and our standards are exceptional.
        </p>
        
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--dark-blue)',
    color: 'var(--text-dark)'
  },
  introText: {
    textAlign: 'center',
    maxWidth: '900px',
    margin: '0 auto 50px',
    fontSize: '1.1rem',
    color: 'var(--text-medium)',
    lineHeight: '1.8'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  },
  featureCard: {
    backgroundColor: 'var(--light-gray)',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: 'var(--shadow)',
    transition: 'var(--transition)'
  },
  featureIcon: {
    fontSize: '2.5rem',
    color: 'var(--gold)',
    marginBottom: '20px'
  },
  featureTitle: {
    color: 'var(--primary-blue)',
    marginBottom: '15px',
    fontSize: '1.3rem'
  },
  featureDescription: {
    color: 'var(--text-medium)',
    lineHeight: '1.6'
  },
  '@media (max-width: 768px)': {
    featuresGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px'
    },
    featureCard: {
      padding: '20px'
    }
  }
};

export default Features;