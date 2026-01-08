import React, { useMemo } from 'react';
import { useRecommendation } from '../../context/RecommendationContext';
import tours from '../../data/tourData';
import TourCard from './TourCard';
import '../../styles/recommendations.css';

const INTEREST_LABEL = {
  beach: 'Beaches',
  culture: 'Culture & History',
  adventure: 'Adventure'
};

export default function InterestBasedRecommendations({ perSection = 4 }) {
  const { userPreferences } = useRecommendation();

  const interests = (userPreferences && userPreferences.interests) || [];

  const chosen = useMemo(() => {
    if (!interests || interests.length === 0) return [];
    // prioritize the three categories requested
    const order = ['beach', 'culture', 'adventure'];
    const filtered = order.filter(k => interests.includes(k));
    // if user has other interests, append them (but we only show up to 3 sections)
    const others = interests.filter(i => !order.includes(i));
    return [...filtered, ...others].slice(0, 3);
  }, [interests]);

  if (!userPreferences || chosen.length === 0) {
    return (
      <section className="rec-section">
        <div className="rec-header">
          <h2>Interest-based Recommendations</h2>
        </div>
        <div className="no-results">Set your travel preferences to see recommendations by interest.</div>
      </section>
    );
  }

  return (
    <div>
      {chosen.map(interestKey => {
        const label = INTEREST_LABEL[interestKey] || interestKey;
        const list = tours.filter(t => (t.category || []).includes(interestKey) || (t.tags || []).includes(interestKey)).slice(0, perSection);
        return (
          <section key={interestKey} className="rec-section">
            <div className="rec-header">
              <h2>Based on your interest in {label}</h2>
            </div>
            <div className="rec-grid">
              {list.length > 0 ? list.map(t => <TourCard key={t.id} tour={t} />) : <div className="no-results">No tours found for {label}.</div>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
