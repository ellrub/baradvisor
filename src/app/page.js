'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { bergenBars } from '@/data/bars';
import BarCard from '@/components/BarCard';
import { MapPin, List, Search, Filter, Heart, SortAsc } from 'lucide-react';
import { useFavorites, useUserPreferences } from '@/hooks/useLocalStorage';

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-gray-100">Loading map...</div>
});

export default function Home() {
  const [selectedBar, setSelectedBar] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'map'
  const [filteredBars, setFilteredBars] = useState(bergenBars);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const { favorites, isFavorite } = useFavorites();
  const { preferences, updatePreference } = useUserPreferences();

  const barTypes = ['all', ...new Set(bergenBars.map(bar => bar.type))];
  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' }
  ];

  // Load user preferences on mount
  useEffect(() => {
    if (preferences.defaultView) {
      setCurrentView(preferences.defaultView);
    }
    if (preferences.sortBy) {
      setSortBy(preferences.sortBy);
    }
  }, [preferences]);

  useEffect(() => {
    let filtered = bergenBars;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bar =>
        bar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bar.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(bar => bar.type === selectedType);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(bar => favorites.includes(bar.id));
    }

    // Sort bars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    setFilteredBars(filtered);
  }, [searchTerm, selectedType, showFavoritesOnly, sortBy, favorites]);

  const handleBarSelect = useCallback((bar) => {
    setSelectedBar(bar);
    if (currentView === 'list') {
      setCurrentView('map');
    }
  }, [currentView]);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    updatePreference('defaultView', view);
  }, [updatePreference]);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    updatePreference('sortBy', newSortBy);
  }, [updatePreference]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 text-center">
            🍺 Bergen Bar Advisor
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            Discover the best bars in Bergen, Norway
          </p>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Row */}
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-4 h-4 flex-shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {barTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-2 rounded-lg border transition-colors ${
              showFavoritesOnly 
                ? 'bg-red-50 border-red-300 text-red-600' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title="Show favorites only"
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Sort Row */}
        <div className="flex items-center space-x-2">
          <SortAsc className="text-gray-400 w-4 h-4 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white border-b border-gray-200 p-2">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleViewChange('list')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              currentView === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </button>
          <button
            onClick={() => handleViewChange('map')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              currentView === 'map'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Map
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'list' ? (
          <div className="p-4 pb-20">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredBars.length} {filteredBars.length === 1 ? 'bar' : 'bars'} found
              </p>
              {favorites.length > 0 && (
                <p className="text-sm text-gray-500">
                  {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {filteredBars.map(bar => (
              <BarCard
                key={bar.id}
                bar={bar}
                onSelect={handleBarSelect}
                isSelected={selectedBar?.id === bar.id}
              />
            ))}
            {filteredBars.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {showFavoritesOnly 
                    ? "No favorite bars found. Add some favorites to see them here!" 
                    : "No bars found matching your criteria."
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[calc(100vh-250px)]">
            <Map
              bars={filteredBars}
              selectedBar={selectedBar}
              onBarSelect={setSelectedBar}
            />
          </div>
        )}
      </main>

      {/* Selected Bar Info (Bottom Sheet for Map View) */}
      {currentView === 'map' && selectedBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 max-h-[50vh] overflow-y-auto">
          <BarCard
            bar={selectedBar}
            onSelect={() => {}}
            isSelected={true}
          />
          <button
            onClick={() => setSelectedBar(null)}
            className="w-full mt-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
