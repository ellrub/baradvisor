'use client';

import { MapPin, Star, Heart, ExternalLink } from 'lucide-react';
import { useFavorites } from '@/hooks/useLocalStorage';

const BarCard = ({ bar, onSelect, isSelected }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isBarFavorite = isFavorite(bar.id);

  const getTypeColor = (type) => {
    const colors = {
      'Cocktail Bar': 'bg-purple-100 text-purple-800',
      'Wine Bar': 'bg-red-100 text-red-800',
      'Sports Bar': 'bg-green-100 text-green-800',
      'Café Bar': 'bg-yellow-100 text-yellow-800',
      'Pub': 'bg-blue-100 text-blue-800',
      'Craft Beer': 'bg-orange-100 text-orange-800',
      'Brewery': 'bg-amber-100 text-amber-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const openInMaps = (e) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(bar.address);
    const url = `https://maps.google.com/?q=${encodedAddress}`;
    window.open(url, '_blank');
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(bar.id);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 mb-3 cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
      }`}
      onClick={() => onSelect(bar)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-900 leading-tight flex-1 pr-2">{bar.name}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-1 rounded-full transition-colors ${
              isBarFavorite 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart 
              className={`w-5 h-5 ${isBarFavorite ? 'fill-current' : ''}`} 
            />
          </button>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700 ml-1">{bar.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center mb-2">
        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="text-sm text-gray-600 ml-1 flex-1">{bar.address}</span>
        <button
          onClick={openInMaps}
          className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
          title="Open in Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(bar.type)}`}>
          {bar.type}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 leading-relaxed">{bar.description}</p>
    </div>
  );
};

export default BarCard;
