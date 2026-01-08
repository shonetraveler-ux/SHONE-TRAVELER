const STORAGE_KEY = 'shone_reco_analytics_v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { clicks: [], bookings: [], views: [], createdAt: Date.now() };
    return JSON.parse(raw);
  } catch (e) {
    return { clicks: [], bookings: [], views: [], createdAt: Date.now() };
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Analytics save error', e);
  }
}

export function trackClick({ tourId, tourTitle, source = 'recommendation' } = {}) {
  const data = load();
  data.clicks.push({ tourId, tourTitle, source, at: Date.now() });
  save(data);
}

export function trackBooking({ tourId, tourTitle, source = 'recommendation' } = {}) {
  const data = load();
  data.bookings.push({ tourId, tourTitle, source, at: Date.now() });
  save(data);
}

export function trackView({ tourId, tourTitle, source = 'recommendation' } = {}) {
  const data = load();
  data.views.push({ tourId, tourTitle, source, at: Date.now() });
  save(data);
}

export function getRawData() {
  return load();
}

export function getMetrics() {
  const data = load();
  const clicks = data.clicks || [];
  const bookings = data.bookings || [];
  const views = data.views || [];

  const clicksCount = clicks.length;
  const bookingsCount = bookings.length;
  const viewsCount = views.length;
  const conversionRate = clicksCount === 0 ? 0 : Math.round((bookingsCount / clicksCount) * 10000) / 100; // percent 2dp

  // top clicked tours
  const agg = {};
  clicks.forEach(c => {
    const id = c.tourId || 'unknown';
    agg[id] = agg[id] || { id, title: c.tourTitle || id, clicks: 0 };
    agg[id].clicks += 1;
  });
  const topClicked = Object.values(agg).sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  return {
    clicksCount,
    bookingsCount,
    viewsCount,
    conversionRate,
    topClicked
  };
}

export function resetAnalytics() {
  const empty = { clicks: [], bookings: [], views: [], createdAt: Date.now() };
  save(empty);
  return empty;
}

const analytics = { trackClick, trackBooking, trackView, getRawData, getMetrics, resetAnalytics };
export default analytics;
