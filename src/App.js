import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import JourneyTypes from './components/JourneyTypes';
import Destinations from './components/Destinations';
import Tours from './components/Tours';
import Accommodations from './components/Accommodations';
import Promotions from './components/Promotions';
import Blog from './components/Blog';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import './styles/App.css';
import './styles/variables.css';
import UserPreferenceForm from './components/recommendations/UserPreferenceForm';
import RecommendedTours from './components/recommendations/RecommendedTours';
import TrendingSection from './components/recommendations/TrendingSection';
import { RecommendationProvider } from './context/RecommendationContext';
import Success from './components/Success';
import Cancel from './components/Cancel';

const stripePromise = loadStripe('pk_test_...'); // Replace with your publishable key

function App() {
  const pathname = window.location.pathname;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      alert('Google login successful!');
    }
  }, []);

  if (pathname === '/success') {
    return (
      <Elements stripe={stripePromise}>
        <Success />
      </Elements>
    );
  }

  if (pathname === '/cancel') {
    return (
      <Elements stripe={stripePromise}>
        <Cancel />
      </Elements>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <RecommendationProvider>
        <div className="App">
        <Header />
        <Hero />
        <Features />
        <JourneyTypes />
        <Destinations />
        <Tours />
        <Accommodations />
        <Promotions />
        <Blog />
        <Testimonials />

        {/* Preferences section (anchor for Set Preferences button) */}
        <div id="preferences">
          <UserPreferenceForm />
        </div>

        {/* Recommendations and trending */}
        <RecommendedTours />
        <TrendingSection />

          <Footer />
          <Chatbot />
        </div>
      </RecommendationProvider>
    </Elements>
  );
}

export default App;
