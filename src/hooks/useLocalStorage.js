'use client';

import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('barAdvisor_favorites', []);

  const toggleFavorite = useCallback((barId) => {
    setFavorites(prev => {
      if (prev.includes(barId)) {
        return prev.filter(id => id !== barId);
      } else {
        return [...prev, barId];
      }
    });
  }, [setFavorites]);

  const isFavorite = useCallback((barId) => {
    return favorites.includes(barId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('barAdvisor_preferences', {
    defaultView: 'list',
    lastLocation: null,
    sortBy: 'rating'
  });

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setPreferences]);

  return { preferences, updatePreference };
};
