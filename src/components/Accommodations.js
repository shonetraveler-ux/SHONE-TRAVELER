import React from 'react';
import '../styles/App.css';

const Accommodations = () => {
  const accommodations = [
    {
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      name: 'SHONE Saman Villas',
      location: 'Bentota',
      description: 'Where restful pleasures await'
    },
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      name: 'SHONE Vil Uyana',
      location: 'Sigiriya',
      description: 'A unique eco-luxury experience'
    },
    {
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      name: 'SHONE Blue',
      location: 'Negombo',
      description: 'Beachfront luxury and relaxation'
    }
  ];

  return (
    <section id="accommodations" className="section-padding" style={styles.section}>
      <div className="container">
        <h2 className="section-title">Accommodations of choice</h2>
        <p className="section-subtitle">Luxurious stays along the way</p>
        
        <div className="accommodations-grid" style={styles.accommodationsGrid}>
          {accommodations.map((acc, index) => (
            <div key={index} style={styles.accCard}>
              <div className="acc-image" style={styles.accImage}>
                <img 
                  src={acc.image} 
                  alt={acc.name} 
                  style={styles.image}
                />
              </div>
              <div style={styles.accContent}>
                <h3 style={styles.accName}>{acc.name}</h3>
                <p style={styles.accLocation}>{acc.location}</p>
                <p style={styles.accDescription}>{acc.description}</p>
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
  accommodationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  },
  accCard: {
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    backgroundColor: 'var(--white)'
  },
  accImage: {
    height: '220px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  accContent: {
    padding: '25px'
  },
  accName: {
    color: 'var(--primary-blue)',
    marginBottom: '5px',
    fontSize: '1.3rem'
  },
  accLocation: {
    color: 'var(--gold)',
    fontWeight: '600',
    marginBottom: '10px'
  },
  accDescription: {
    color: 'var(--text-medium)',
    lineHeight: '1.6'
  }
};

export default Accommodations;