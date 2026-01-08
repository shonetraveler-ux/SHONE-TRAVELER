import { useMemo } from 'react';
import tours from '../data/tourData';
import { getRecommendations } from '../utils/recommendationAlgo';

// Hook: useRecommendations(userPrefs, count)
// returns top recommendations (memoized)
export default function useRecommendations(userPrefs = {}, count = 6, allTours = tours) {
  const recommendations = useMemo(() => {
    // simple guard
    if (!userPrefs) return [];
    return getRecommendations(userPrefs, allTours, count);
  }, [userPrefs, count, allTours]);

  return recommendations;
}
