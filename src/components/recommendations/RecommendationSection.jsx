import React from 'react';
import useRecommendations from '../../hooks/useRecommendations';
import tours from '../../data/tourData';
import TourCard from './TourCard';
import '../../styles/recommendations.css';
import { useRecommendation } from '../../context/RecommendationContext';

export default function RecommendationSection({ count = 4 }) {
  const { userPreferences, recommendations } = useRecommendation();
  const prefs = userPreferences || null;
  const hookRecs = useRecommendations(prefs || {}, count, tours);
  const recs = (recommendations && recommendations.length) ? recommendations.slice(0, count) : hookRecs;

  return (
    <section className="rec-section">
      <div className="rec-header">
        <h2>Recommended For You</h2>
        <button className="view-all">View All</button>
      </div>

      <div className="rec-grid">
        {(!prefs || Object.keys(prefs).length === 0) ? (
          <div className="no-results">
            <p>Please set your travel preferences to get personalized recommendations.</p>
            <a className="btn view-preferences" href="#preferences">Set your travel preferences</a>
          </div>
        ) : recs && recs.length > 0 ? (
          recs.map(t => <TourCard key={t.id} tour={t} />)
        ) : (
          <div className="no-results">No recommendations found. Try changing your preferences.</div>
        )}
      </div>
    </section>
  );
}
