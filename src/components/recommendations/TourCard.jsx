import React from 'react';
import '../../styles/recommendations.css';
import analytics from '../../utils/recommendationAnalytics';

function handleView(tour) {
  try { analytics.trackClick({ tourId: tour.id, tourTitle: tour.title }); } catch(e){}
  // placeholder for navigation to tour detail page
  if (tour && tour.id) {
    // e.g., window.location = `/tours/${tour.id}`;
  }
}

function handleBook(tour) {
  try { analytics.trackBooking({ tourId: tour.id, tourTitle: tour.title }); } catch(e){}
  alert('Proceed to booking for ' + (tour.title || 'tour'));
}

export default function TourCard({ tour }) {
  const { title, priceRange, duration, _score, image, tags = [] } = tour;

  const badgeReason = () => {
    if (tags.includes('beach') || (tour.category || []).includes('beach')) return 'Matches your love for beaches';
    if (tags.includes('food') || (tour.category || []).includes('food')) return 'Recommended for food lovers';
    if ((tour.category || []).includes('adventure')) return 'Great for adventure seekers';
    return 'Recommended for you';
  };

  return (
    <div className="tour-card">
      <div className="tour-image" style={{ backgroundImage: image ? `url(${image})` : "url('/images/home-desctop.jpg')" }} />
      <div className="tour-body">
        <div className="tour-title">{title}</div>
        <div className="tour-meta">
          <span className="tour-duration">{duration}</span>
          <span className="tour-price">{priceRange}</span>
          <span className="tour-score">{_score}% match</span>
        </div>
        <div className="tour-badge">Why recommended? {badgeReason()}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => handleView(tour)}>View</button>
          <button className="btn primary" onClick={() => handleBook(tour)}>Book Now</button>
        </div>
      </div>
    </div>
  );
}
