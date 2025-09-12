'use client';

import { useEffect, useState, useRef } from 'react';
import { MapPin, Star } from 'lucide-react';

const Map = ({ bars, selectedBar, onBarSelect }) => {
  const [map, setMap] = useState(null);
  const [L, setL] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      // Fix for default markers in Next.js
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  useEffect(() => {
    if (L && !map) {
      // Initialize map centered on Bergen
      const mapInstance = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        dragging: true
      }).setView([60.3913, 5.3221], 14);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      setMap(mapInstance);
    }
  }, [L, map]);

  useEffect(() => {
    if (map && L && bars) {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        map.removeLayer(marker);
      });

      // Create new markers
      const newMarkers = bars.map(bar => {
        const marker = L.marker(bar.coordinates)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${bar.name}</h3>
              <p class="text-xs text-gray-600">${bar.type}</p>
              <div class="flex items-center mt-1">
                <span class="text-yellow-500 text-xs">★</span>
                <span class="text-xs ml-1">${bar.rating}</span>
              </div>
            </div>
          `)
          .on('click', () => {
            onBarSelect(bar);
          });

        return marker.addTo(map);
      });

      markersRef.current = newMarkers;
    }
  }, [map, L, bars, onBarSelect]);

  useEffect(() => {
    if (map && selectedBar) {
      map.setView(selectedBar.coordinates, 16);
    }
  }, [map, selectedBar]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <div id="map" className="w-full h-full"></div>
    </>
  );
};

export default Map;
