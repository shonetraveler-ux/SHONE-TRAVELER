import React, { useState, useEffect } from 'react';
import PaymentForm from './PaymentForm';
import Header from './Header';
import Footer from './Footer';
import { FaCalendarAlt, FaDollarSign, FaStar, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import '../styles/recommendations.css';

export default function BookingPage() {
  const [tour, setTour] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Get tour from localStorage or URL params
    const storedTour = localStorage.getItem('selectedTour');
    if (storedTour) {
      setTour(JSON.parse(storedTour));
    }

    // Create payment intent
    const createPaymentIntent = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        window.location.href = '/';
        return;
      }

      // Parse amount from tour.priceRange (e.g., "$1500 - $2000" -> 1500)
      const priceMatch = tour.priceRange.match(/\$(\d+)/);
      const parsedAmount = priceMatch ? parseInt(priceMatch[1]) : 1000;
      setAmount(parsedAmount);

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: Date.now(), // dummy booking id
            amount: parsedAmount,
            currency: 'usd',
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setClientSecret(data.client_secret);
        } else {
          alert('Failed to create payment intent');
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };

    createPaymentIntent();
    setLoading(false);
  }, []);

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
          tourName: tour?.title || 'Tour',
          amount: amount
        }),
      }).then(() => {
        alert('Confirmation email sent!');
      }).catch(() => {
        alert('Email send failed, but booking confirmed.');
      });
    }
    // Redirect to home or success page
    window.location.href = '/';
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error}`);
  };

  if (loading) return (
    <div style={{ background: 'linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%)', minHeight: '100vh' }}>
      <Header />
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', fontSize: '18px', color: 'var(--primary-blue)' }}>
        <FaCreditCard style={{ fontSize: '50px', marginBottom: '20px' }} />
        Preparing your booking...
      </div>
      <Footer />
    </div>
  );

  if (!tour) return (
    <div style={{ background: 'linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%)', minHeight: '100vh' }}>
      <Header />
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="no-results">
          No tour selected. <a href="/" className="btn-primary" style={{ marginTop: '20px' }}>Go back to explore tours</a>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%)', minHeight: '100vh' }}>
      <Header />
      <div className="rec-section" style={{ marginTop: '20px', marginBottom: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="rec-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaCreditCard /> Book Your Tour
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="tour-card" style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
            <div className="tour-image" style={{ backgroundImage: tour.image ? `url(${tour.image})` : "url('/images/home-desctop.jpg')" }} />
            <div className="tour-body">
              <div className="tour-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaStar style={{ color: 'var(--gold)' }} /> {tour.title}
              </div>
              <div className="tour-meta">
                <span className="tour-duration" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FaCalendarAlt /> {tour.duration}
                </span>
                <span className="tour-price" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FaDollarSign /> {tour.priceRange}
                </span>
                <span className="tour-score">{tour._score}% match</span>
              </div>
              <div className="tour-badge">Why recommended? {tour.tags ? tour.tags.join(', ') : 'Perfect for you!'}</div>
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px', padding: '20px', background: 'var(--white)', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--primary-blue)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <FaCheckCircle /> Complete Payment
            </h3>
            <PaymentForm
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={() => window.location.href = '/'} className="btn" style={{ background: 'var(--text-medium)', color: 'var(--white)' }}>Cancel Booking</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}