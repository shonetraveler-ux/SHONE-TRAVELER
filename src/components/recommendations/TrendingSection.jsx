import React from 'react';
import tours from '../../data/tourData';
import TourCard from './TourCard';
import '../../styles/recommendations.css';

export default function TrendingSection({ count = 4 }) {
  const top = [...tours].sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)).slice(0, count);

  return (
    <section className="rec-section">
      <div className="rec-header">
        <h2>Trending Now</h2>
        <button className="view-all">View All</button>
      </div>

      <div className="rec-grid">
        {top.map(t => <TourCard key={t.id} tour={t} />)}
      </div>
    </section>
  );
}
