import React, { useMemo, useEffect } from 'react';
import TourCard from './TourCard';
import tours from '../../data/tourData';
import '../../styles/tour-page-recommendations.css';
import analytics from '../../utils/recommendationAnalytics';
import { useRecommendation } from '../../context/RecommendationContext';

function intersect(a = [], b = []) {
  return a.filter(x => b.includes(x));
}

function priceSimilar(a = 'mid', b = 'mid') {
  const map = { budget: 1, mid: 2, luxury: 3 };
  return Math.abs((map[a] || 2) - (map[b] || 2)) <= 1;
}

export default function TourPageRecommendations({ currentTour = {} , similarCount = 4 }) {
  const allTours = tours;
  const { trackView } = useRecommendation();

  useEffect(() => {
    if (currentTour && currentTour.id) {
      try { analytics.trackView({ tourId: currentTour.id, tourTitle: currentTour.title }); } catch(e){}
      if (trackView) trackView(currentTour);
    }
  }, [currentTour]);

  const similarTours = useMemo(() => {
    if (!currentTour || !currentTour.id) return [];
    const candidates = allTours.filter(t => t.id !== currentTour.id);

    const scored = candidates.map(t => {
      // category overlap
      const catMatch = intersect(t.category || [], currentTour.category || []).length;
      // tags overlap (including possible location tag)
      const tagMatch = intersect(t.tags || [], currentTour.tags || []).length;
      // price similarity
      const price = priceSimilar(t.priceRange, currentTour.priceRange) ? 1 : 0;
      // location match if both have location field otherwise use tags
      const locationMatch = (currentTour.location && t.location && currentTour.location === t.location) ? 1 : 0;
      const score = catMatch * 3 + tagMatch * 1.5 + price * 2 + locationMatch * 3 + (t.popularityScore || 0) / 50;
      return { tour: t, score };
    });

    scored.sort((a,b) => b.score - a.score);
    return scored.slice(0, similarCount).map(s => ({ ...s.tour, _score: Math.round((s.score/8)*100) }));
  }, [currentTour, allTours, similarCount]);

  const alsoLiked = useMemo(() => {
    if (!currentTour || !currentTour.id) return [];
    // People who viewed also liked: choose popular tours that share at least one category or tag
    const candidates = allTours.filter(t => t.id !== currentTour.id)
      .filter(t => (intersect(t.category||[], currentTour.category||[]).length > 0) || (intersect(t.tags||[], currentTour.tags||[]).length > 0));
    candidates.sort((a,b) => (b.popularityScore||0) - (a.popularityScore||0));
    return candidates.slice(0, similarCount).map(t => ({ ...t, _score: t.popularityScore || 0 }));
  }, [currentTour, allTours, similarCount]);

  const addons = [
    { id: 'A1', type: 'Hotel', title: 'Seaside Hotel - 3 nights', price: 120, desc: 'Comfort stay near attractions' },
    { id: 'A2', type: 'Transport', title: 'Airport Transfer (round trip)', price: 40, desc: 'Private car' },
    { id: 'A3', type: 'Hotel', title: 'Luxury Resort - 2 nights', price: 280, desc: 'Premium amenities' }
  ];

  function addToCart(item) {
    try {
      const key = 'shone_cart';
      const raw = localStorage.getItem(key);
      const cart = raw ? JSON.parse(raw) : [];
      cart.push(item);
      localStorage.setItem(key, JSON.stringify(cart));
      alert(item.title + ' added to cart');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="tour-page-recs">
      <div className="rec-block">
        <h3>Similar Tours You Might Like</h3>
        <div className="rec-grid-small">
          {similarTours.length ? similarTours.map(t => <TourCard key={t.id} tour={t} />) : <div className="empty">No similar tours found.</div>}
        </div>
      </div>

      <div className="rec-block">
        <h3>People Who Viewed This Also Liked</h3>
        <div className="rec-grid-small">
          {alsoLiked.length ? alsoLiked.map(t => <TourCard key={t.id} tour={t} />) : <div className="empty">No data yet.</div>}
        </div>
      </div>

      <div className="rec-block addons">
        <h3>Complete Your Trip</h3>
        <div className="addons-list">
          {addons.map(a => (
            <div key={a.id} className="addon-item">
              <div className="addon-info">
                <div className="addon-title">{a.title}</div>
                <div className="addon-desc">{a.desc}</div>
              </div>
              <div className="addon-actions">
                <div className="addon-price">${a.price}</div>
                <button className="btn primary small" onClick={() => addToCart(a)}>Add to cart</button>
                <button className="btn small" onClick={() => alert('Proceeding to booking for ' + a.title)}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
