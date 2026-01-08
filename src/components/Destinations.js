import React from 'react';
import '../styles/App.css';

const Destinations = () => {
  const destinations = [
    {
      image:"/images/unavatuna.jpg",
      title: 'Unawatuna',
      category: 'Beach'
    },
    {
      image: "/images/sigiriya.jpeg",
      title: 'Sigiriya',
      category: 'Ancient'
    },
    {
      image: "/images/jala.jpg",
      title: 'Yala National Park',
      category: 'Wildlife'
    },
    {
      image: "/images/ella.jpg",
      title: 'Ella',
      category: 'Hill Country'
    }
  ];

  return (
    <section id="destinations" className="section-padding" style={styles.section}>
      <div className="container">
        <h2 className="section-title">Fortresses, forests, temples, treasures</h2>
        <p className="section-subtitle">Magical destinations</p>
        
        <div className="destinations-grid" style={styles.destinationsGrid}>
          {destinations.map((destination, index) => (
            <div key={index} style={styles.destinationCard}>
              <div className="destination-image" style={styles.destinationImage}>
                <img 
                  src={destination.image} 
                  alt={destination.title} 
                  style={styles.image}
                />
                <div style={styles.overlay}>
                  <h3 style={styles.destinationTitle}>{destination.title}</h3>
                </div>
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
    backgroundColor: 'var(--white)'
  },
  destinationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    marginTop: '40px'
  },
  destinationCard: {
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    position: 'relative'
  },
  destinationImage: {
    height: '300px',
    position: 'relative',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    color: 'var(--white)',
    padding: '20px'
  },
  destinationTitle: {
    fontSize: '1.5rem',
    margin: 0
  }
};

export default Destinations;