import React, { useState } from 'react';
import '../../styles/recommendations.css';
import analytics from '../../utils/recommendationAnalytics';
import LoginSignupModal from './LoginSignupModal';
import PaymentForm from '../PaymentForm';

function handleView(tour) {
  try { analytics.trackClick({ tourId: tour.id, tourTitle: tour.title }); } catch(e){}
  // placeholder for navigation to tour detail page
  if (tour && tour.id) {
    // e.g., window.location = `/tours/${tour.id}`;
  }
}

function handleBook(tour, setShowModal) {
  try { analytics.trackBooking({ tourId: tour.id, tourTitle: tour.title }); } catch(e){}
  setShowModal(true);
}

export default function TourCard({ tour }) {
  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const { title, priceRange, duration, _score, image, tags = [] } = tour;

  const badgeReason = () => {
    if (tags.includes('beach') || (tour.category || []).includes('beach')) return 'Matches your love for beaches';
    if (tags.includes('food') || (tour.category || []).includes('food')) return 'Recommended for food lovers';
    if ((tour.category || []).includes('adventure')) return 'Great for adventure seekers';
    return 'Recommended for you';
  };

  const handlePaymentSuccess = (paymentIntent) => {
    alert('Payment successful! Your booking is confirmed.');
    // Send confirmation email
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          tourName: tour.title
        }),
      }).then(() => {
        alert('Confirmation email sent!');
      }).catch(() => {
        alert('Email send failed, but booking confirmed.');
      });
    }
    setShowPayment(false);
    // Optionally, redirect to success page or update UI
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error}`);
  };

  const handleLoginSuccess = async (user) => {
    // Store selected tour
    localStorage.setItem('selectedTour', JSON.stringify(tour));
    // Navigate to booking page
    window.location.href = '/booking';
  };

  return (
    <>
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
            <button className="btn primary" onClick={() => handleBook(tour, setShowModal)}>Book Now</button>
          </div>
        </div>
      </div>
      <LoginSignupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleLoginSuccess}
        tour={tour}
      />
      {showPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
          }}>
            <h3>Complete Payment for {title}</h3>
            <PaymentForm
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            <button onClick={() => setShowPayment(false)} style={{ marginTop: '10px' }}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
