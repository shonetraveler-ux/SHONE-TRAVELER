// Simple content-based recommendation algorithm

const BUDGET_LEVEL = { budget: 1, mid: 2, luxury: 3 };

function scoreInterests(userInterests = [], tour) {
  if (!userInterests || userInterests.length === 0) return 0;
  const tourCats = new Set([...(tour.category || []), ...(tour.tags || [])]);
  const matches = userInterests.filter(i => tourCats.has(i)).length;
  return matches / Math.max(userInterests.length, 1);
}

function scoreBudget(userBudget, tourPrice) {
  if (!userBudget || !tourPrice) return 0.5; // neutral
  const u = BUDGET_LEVEL[userBudget] || 2;
  const t = BUDGET_LEVEL[tourPrice] || 2;
  const diff = Math.abs(u - t);
  if (diff === 0) return 1;
  if (diff === 1) return 0.6;
  return 0.2;
}

function scoreTravelStyle(userStyle, tourStyle) {
  if (!userStyle) return 0.5;
  if (!tourStyle) return 0;
  // tourStyle may be string or array
  const styles = Array.isArray(tourStyle) ? tourStyle : [tourStyle];
  return styles.includes(userStyle) ? 1 : 0;
}

function scoreDuration(userDuration, tourDuration) {
  if (!userDuration) return 0.5;
  if (!tourDuration) return 0;
  return userDuration === tourDuration ? 1 : 0.5;
}

function scoreSeason(userSeason, tourSeason) {
  if (!userSeason || userSeason === 'any') return 0.7;
  if (!tourSeason || tourSeason === 'any') return 0.5;
  return userSeason === tourSeason ? 1 : 0.4;
}

export function calculateSimilarity(userPrefs = {}, tour = {}) {
  // weights - tuneable
  const W = {
    interests: 0.45,
    budget: 0.18,
    travelStyle: 0.15,
    duration: 0.12,
    season: 0.05,
    popularity: 0.05
  };

  const iScore = scoreInterests(userPrefs.interests, tour);
  const bScore = scoreBudget(userPrefs.budget, tour.priceRange);
  const sScore = scoreTravelStyle(userPrefs.travelStyle, tour.travelStyle);
  const dScore = scoreDuration(userPrefs.duration, tour.duration);
  const seScore = scoreSeason(userPrefs.season, tour.bestSeason);
  const popularity = Math.min(Math.max(Number(tour.popularityScore) || 0, 0), 100) / 100;

  const total =
    iScore * W.interests +
    bScore * W.budget +
    sScore * W.travelStyle +
    dScore * W.duration +
    seScore * W.season +
    popularity * W.popularity;

  // scale to 0-100
  return Math.round(total * 100);
}

export function getRecommendations(userPrefs = {}, allTours = [], count = 6) {
  if (!Array.isArray(allTours)) return [];

  // Basic filtering: keep tours that match travelStyle (if provided)
  let candidates = allTours.filter(t => {
    if (userPrefs.travelStyle) {
      const styles = Array.isArray(t.travelStyle) ? t.travelStyle : [t.travelStyle];
      if (!styles.includes(userPrefs.travelStyle)) return false;
    }
    // filter by budget allowing one level difference
    if (userPrefs.budget) {
      const u = BUDGET_LEVEL[userPrefs.budget] || 2;
      const tLevel = BUDGET_LEVEL[t.priceRange] || 2;
      if (Math.abs(u - tLevel) > 1) return false;
    }
    // filter by duration exact or compatible
    if (userPrefs.duration && t.duration) {
      if (userPrefs.duration !== t.duration) {
        // allow extended tours for week/weekend requests, but keep strict otherwise
        if (!(userPrefs.duration === 'week' && t.duration === 'extended')) return false;
      }
    }
    return true;
  });

  // score each candidate
  const scored = candidates.map(t => ({
    tour: t,
    score: calculateSimilarity(userPrefs, t)
  }));

  // sort by score desc then popularity
  scored.sort((a, b) => b.score - a.score || ( (b.tour.popularityScore||0) - (a.tour.popularityScore||0) ));

  return scored.slice(0, count).map(s => ({ ...s.tour, _score: s.score }));
}

const recommendationUtils = { calculateSimilarity, getRecommendations };

export default recommendationUtils;
