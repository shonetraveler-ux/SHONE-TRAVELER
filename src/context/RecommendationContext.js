import React, { createContext, useContext, useReducer, useEffect } from 'react';
import tours from '../data/tourData';
import { getRecommendations } from '../utils/recommendationAlgo';

const RecommendationContext = createContext(null);

const STORAGE_KEY = 'shone_user_preferences_v1';

const initialState = {
  userPreferences: null,
  recommendations: [],
  history: [],
  loading: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PREFS':
      return { ...state, userPreferences: action.payload };
    case 'SET_RECS':
      return { ...state, recommendations: action.payload };
    case 'ADD_HISTORY':
      return { ...state, history: [action.payload, ...state.history].slice(0, 50) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function RecommendationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // load prefs from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const prefs = JSON.parse(raw);
        dispatch({ type: 'SET_PREFS', payload: prefs });
        // initial recommendations
        const recs = getRecommendations(prefs, tours, 6);
        dispatch({ type: 'SET_RECS', payload: recs });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // action: set user preferences (persist + recompute recs)
  const setUserPreferences = (prefs) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      dispatch({ type: 'SET_PREFS', payload: prefs });
      const recs = getRecommendations(prefs, tours, 6);
      dispatch({ type: 'SET_RECS', payload: recs });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // action: update recommendations (can be called to refresh)
  const updateRecommendations = (overrides = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const prefs = { ...(state.userPreferences || {}), ...overrides };
      const recs = getRecommendations(prefs, tours, 6);
      dispatch({ type: 'SET_RECS', payload: recs });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // action: track a viewed tour
  const trackView = (tour) => {
    if (!tour) return;
    dispatch({ type: 'ADD_HISTORY', payload: { id: tour.id, title: tour.title, viewedAt: Date.now() } });
    // optionally update recommendations to include related
    const prefs = state.userPreferences || {};
    const recs = getRecommendations(prefs, tours.filter(t => t.id !== tour.id), 6);
    dispatch({ type: 'SET_RECS', payload: recs });
  };

  const value = {
    userPreferences: state.userPreferences,
    recommendations: state.recommendations,
    history: state.history,
    loading: state.loading,
    setUserPreferences,
    updateRecommendations,
    trackView
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendation() {
  const ctx = useContext(RecommendationContext);
  if (!ctx) throw new Error('useRecommendation must be used within RecommendationProvider');
  return ctx;
}

export default RecommendationContext;
