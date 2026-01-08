import React, { useEffect, useState } from 'react';
import '../../styles/user-preference.css';
import { useRecommendation } from '../../context/RecommendationContext';


const INTERESTS = [
  { key: 'beach', label: 'Beach' },
  { key: 'culture', label: 'Culture/History' },
  { key: 'adventure', label: 'Adventure' },
  { key: 'wildlife', label: 'Wildlife' },
  { key: 'luxury', label: 'Luxury' },
  { key: 'family', label: 'Family' },
  { key: 'honeymoon', label: 'Honeymoon' },
  { key: 'food', label: 'Food' }
];

const BUDGETS = [
  { key: 'budget', label: 'Budget' },
  { key: 'mid', label: 'Mid-range' },
  { key: 'luxury', label: 'Luxury' }
];

const STYLES = [
  { key: 'solo', label: 'Solo' },
  { key: 'couple', label: 'Couple' },
  { key: 'family', label: 'Family' },
  { key: 'group', label: 'Group' }
];

const DURATIONS = [
  { key: 'weekend', label: 'Weekend (2-3 days)' },
  { key: 'week', label: 'Week (4-7 days)' },
  { key: 'extended', label: 'Extended (8+ days)' }
];

const SEASONS = [
  { key: 'any', label: 'Any' },
  { key: 'dry', label: 'Dry Season' },
  { key: 'festive', label: 'Festive Season' }
];

const STORAGE_KEY = 'shone_user_preferences_v1';

export default function UserPreferenceForm() {
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [duration, setDuration] = useState('');
  const [season, setSeason] = useState('any');
  const [saved, setSaved] = useState(false);
  const { userPreferences, setUserPreferences } = useRecommendation();

  useEffect(() => {
    if (userPreferences) {
      setInterests(userPreferences.interests || []);
      setBudget(userPreferences.budget || '');
      setTravelStyle(userPreferences.travelStyle || '');
      setDuration(userPreferences.duration || '');
      setSeason(userPreferences.season || 'any');
    }
  }, [userPreferences]);

  const toggleInterest = (key) => {
    setInterests(prev => (prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { interests, budget, travelStyle, duration, season };
    if (setUserPreferences) setUserPreferences(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const filledCount = (interests.length > 0 ? 1 : 0) + (budget ? 1 : 0) + (travelStyle ? 1 : 0) + (duration ? 1 : 0) + (season ? 1 : 0);
  const progress = Math.round((filledCount / 5) * 100);

  return (
    <div className="pref-card">
      <div className="pref-header">
        <div className="pref-title">User Preferences</div>
      </div>

      <div className="pref-progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <div className="progress-text">{progress}%</div>
      </div>

      <form className="pref-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Travel Interests</legend>
          <div className="grid interests">
            {INTERESTS.map(item => (
              <label key={item.key} className={`chip ${interests.includes(item.key) ? 'selected' : ''}`}>
                <input type="checkbox" checked={interests.includes(item.key)} onChange={() => toggleInterest(item.key)} />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Budget Range</legend>
          <div className="options">
            {BUDGETS.map(b => (
              <label key={b.key} className={`radio ${budget === b.key ? 'selected' : ''}`}>
                <input type="radio" name="budget" checked={budget === b.key} onChange={() => setBudget(b.key)} />
                <span>{b.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Travel Style</legend>
          <div className="options">
            {STYLES.map(s => (
              <label key={s.key} className={`radio ${travelStyle === s.key ? 'selected' : ''}`}>
                <input type="radio" name="style" checked={travelStyle === s.key} onChange={() => setTravelStyle(s.key)} />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Trip Duration</legend>
          <div className="options">
            {DURATIONS.map(d => (
              <label key={d.key} className={`radio ${duration === d.key ? 'selected' : ''}`}>
                <input type="radio" name="duration" checked={duration === d.key} onChange={() => setDuration(d.key)} />
                <span>{d.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Preferred Season</legend>
          <div className="options">
            {SEASONS.map(s => (
              <label key={s.key} className={`radio ${season === s.key ? 'selected' : ''}`}>
                <input type="radio" name="season" checked={season === s.key} onChange={() => setSeason(s.key)} />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="pref-actions">
          <button type="submit" className="btn primary">Submit</button>
          <button type="button" className="btn" onClick={() => { if (setUserPreferences) setUserPreferences({}); localStorage.removeItem(STORAGE_KEY); setInterests([]); setBudget(''); setTravelStyle(''); setDuration(''); setSeason('any'); }}>Reset</button>
          {saved && <div className="saved">Saved</div>}
        </div>
      </form>
    </div>
  );
}
