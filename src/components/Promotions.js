import React from 'react';
import '../styles/App.css';

const Promotions = () => {
  const promotions = [
    {
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      discount: 'Save up to 15%',
      title: 'Maldives Special Offer',
      description: 'Escape to a resort in the Maldives, a luxury 5-star private island resort setting the stage to fuel guests\' Lust for life. Imagine waking up to the sound of the waves drumming against the infinity pool and one of the best house reefs in the Maldives.'
    },
    {
      image: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      discount: 'Special Package',
      title: 'Ayurveda Wellness',
      description: 'Indulge in the ultimate Ayurveda Wellness experience amidst the serene beauty of Sri Lanka. Immerse yourself in ancient healing traditions, surrounded by lush landscapes and expert practitioners. Elevate your well-being with personalized treatments, yoga and rejuvenating escapes.'
    }
  ];

  return (
    <section id="promotions" className="section-padding" style={styles.section}>
      <div className="container">
        <h2 className="section-title">Latest Promotions</h2>
        <p className="section-subtitle">More reasons to Say yes. Deals and Special Offers</p>
        
        <div className="promotions-grid" style={styles.promotionsGrid}>
          {promotions.map((promo, index) => (
            <div key={index} style={styles.promoCard}>
              <div className="promo-image" style={styles.promoImage}>
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  style={styles.image}
                />
              </div>
              <div style={styles.promoContent}>
                <span style={styles.discountBadge}>{promo.discount}</span>
                <h3 style={styles.promoTitle}>{promo.title}</h3>
                <p style={styles.promoDescription}>{promo.description}</p>
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
  promotionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  },
  promoCard: {
    backgroundColor: 'var(--white)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)'
  },
  promoImage: {
    height: '200px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  promoContent: {
    padding: '25px'
  },
  discountBadge: {
    display: 'inline-block',
    backgroundColor: 'var(--gold)',
    color: 'var(--white)',
    padding: '5px 15px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    marginBottom: '15px'
  },
  promoTitle: {
    color: 'var(--primary-blue)',
    marginBottom: '15px',
    fontSize: '1.3rem'
  },
  promoDescription: {
    color: 'var(--text-medium)',
    lineHeight: '1.6'
  }
};

export default Promotions;