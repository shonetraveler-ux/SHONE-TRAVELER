import React from 'react';
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
import './styles/App.css';
import './styles/variables.css';
import Chatbot from './components/Chatbot';
import UserPreferenceForm from './components/recommendations/UserPreferenceForm';
import RecommendedTours from './components/recommendations/RecommendedTours';
import TrendingSection from './components/recommendations/TrendingSection';
import { RecommendationProvider } from './context/RecommendationContext';

function App() {
  return (
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

        <Chatbot />
        <Footer />
      </div>
    </RecommendationProvider>
  );
}

export default App;
