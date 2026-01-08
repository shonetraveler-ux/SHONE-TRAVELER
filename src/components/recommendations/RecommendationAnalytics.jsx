import React, { useEffect, useState } from 'react';
import analytics, { getMetrics, resetAnalytics, getRawData } from '../../utils/recommendationAnalytics';
import '../../styles/recommendations.css';

export default function RecommendationAnalytics() {
  const [metrics, setMetrics] = useState(getMetrics());
  const [raw, setRaw] = useState(getRawData());

  useEffect(() => {
    setMetrics(getMetrics());
    setRaw(getRawData());
  }, []);

  const refresh = () => {
    setMetrics(getMetrics());
    setRaw(getRawData());
  };

  const doReset = () => {
    resetAnalytics();
    refresh();
  };

  return (
    <section className="rec-section">
      <div className="rec-header">
        <h2>Recommendation Analytics</h2>
        <div>
          <button className="view-all" onClick={refresh}>Refresh</button>
          <button className="view-all" onClick={doReset} style={{ marginLeft: 8 }}>Reset Analytics</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
        <div style={{ minWidth: 160 }}>
          <div><strong>Clicks:</strong> {metrics.clicksCount}</div>
          <div><strong>Bookings:</strong> {metrics.bookingsCount}</div>
          <div><strong>Views:</strong> {metrics.viewsCount}</div>
          <div><strong>Conversion:</strong> {metrics.conversionRate}%</div>
        </div>

        <div style={{ flex: 1 }}>
          <strong>Top Clicked Tours</strong>
          <ul>
            {metrics.topClicked && metrics.topClicked.length ? metrics.topClicked.map(t => (
              <li key={t.id}>{t.title} — {t.clicks} clicks</li>
            )) : <li>No clicks yet</li>}
          </ul>
        </div>
      </div>

      <details style={{ marginTop: 12 }}>
        <summary>Raw events</summary>
        <pre style={{ maxHeight: 240, overflow: 'auto' }}>{JSON.stringify(raw, null, 2)}</pre>
      </details>
    </section>
  );
}
