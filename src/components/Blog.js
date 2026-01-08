import React from 'react';
import '../styles/App.css';

const Blog = () => {
  const blogPosts = [
    {
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: 'Published on 22 Feb 2024',
      title: 'Exploring Sri Lanka\'s Flavourful Tapestry',
      description: 'A journey through the diverse and delicious culinary landscape of Sri Lanka.',
      author: '+ SHONE TRAVELER'
    },
    {
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: 'Published on 4 Jan 2024',
      title: 'Unravelling the Secrets of Unexplored Destinations',
      description: 'Discover hidden gems and off-the-beaten-path locations in Sri Lanka.',
      author: '+ SHONE TRAVELER'
    }
  ];

  return (
    <section id="blog" className="section-padding" style={styles.section}>
      <div className="container">
        <h2 className="section-title">Our Blog</h2>
        <p className="section-subtitle">Tales of travels. Stories from all over.</p>
        
        <div className="blog-grid" style={styles.blogGrid}>
          {blogPosts.map((post, index) => (
            <div key={index} style={styles.blogCard}>
              <div className="blog-image" style={styles.blogImage}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  style={styles.image}
                />
              </div>
              <div style={styles.blogContent}>
                <p style={styles.blogDate}>{post.date}</p>
                <h3 style={styles.blogTitle}>{post.title}</h3>
                <p style={styles.blogDescription}>{post.description}</p>
                <p style={styles.blogAuthor}>{post.author}</p>
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
  blogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  },
  blogCard: {
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    backgroundColor: 'var(--white)'
  },
  blogImage: {
    height: '200px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  blogContent: {
    padding: '25px'
  },
  blogDate: {
    color: 'var(--gold)',
    fontSize: '0.9rem',
    marginBottom: '10px'
  },
  blogTitle: {
    color: 'var(--primary-blue)',
    marginBottom: '15px',
    fontSize: '1.3rem'
  },
  blogDescription: {
    color: 'var(--text-medium)',
    marginBottom: '15px',
    lineHeight: '1.6'
  },
  blogAuthor: {
    color: 'var(--gold)',
    fontWeight: '600'
  }
};

export default Blog;