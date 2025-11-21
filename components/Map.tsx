import React, { useEffect, useRef } from 'react';
import { Attraction } from '../types';

interface MapComponentProps {
  attractions: Attraction[];
  selectedId: string | null;
  onMarkerClick: (id: string) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  attractions,
  selectedId,
  onMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const polylineRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) {
      console.error("Leaflet not loaded");
      return;
    }

    // Default view: US Center approx
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([39.8283, -98.5795], 4);

    // Add Tile Layer (OpenStreetMap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
    
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ prefix: false, position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Route Line
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;

    if (!map || !L) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current.clear();
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (attractions.length === 0) {
      // Reset view if no attractions (optional, maybe keep last view)
      return;
    }

    const points: [number, number][] = [];

    // Create Markers
    attractions.forEach((attr) => {
      const isSelected = selectedId === attr.id;
      
      // Create Custom Icon
      const iconHtml = `
        <div style="
          background-color: ${isSelected ? '#2563EB' : '#EF4444'};
          width: ${isSelected ? '32px' : '24px'};
          height: ${isSelected ? '32px' : '24px'};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker', // Tailwind classes don't work inside Shadow DOM of Leaflet usually, so inline style is safer
        iconSize: isSelected ? [32, 32] : [24, 24],
        iconAnchor: isSelected ? [16, 16] : [12, 12],
      });

      const marker = L.marker([attr.latitude, attr.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${attr.name}</h3>
            <p style="font-size: 12px; color: #555; margin: 0;">${attr.category}</p>
          </div>
        `);

      marker.on('click', () => {
        onMarkerClick(attr.id);
      });
      
      if (isSelected) {
        marker.setZIndexOffset(1000); // Bring to front
        marker.openPopup();
      }

      markersRef.current.set(attr.id, marker);
      points.push([attr.latitude, attr.longitude]);
    });

    // Draw dashed line between points to simulate a rough route
    // Sort points by simple logic? No, Gemini returns them likely in order or random. 
    // We can't guarantee order from Gemini without explict instruction, but usually it does logic order.
    // Let's just fit bounds for now. Drawing a line might be confusing if the order is wrong.
    // Actually, let's try to draw a light line just to connect them visually if needed, but safer to just show points.
    
    // Fit bounds
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

  }, [attractions, selectedId, onMarkerClick]);

  return (
    <div className="w-full h-full bg-gray-200 relative">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Legend overlay */}
      <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-[1000] text-xs pointer-events-none md:pointer-events-auto">
        <div className="font-semibold mb-2 text-gray-700">Map Legend</div>
        <div className="flex items-center gap-2 mb-1">
           <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>
           <span>Attraction</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm"></div>
           <span>Selected</span>
        </div>
      </div>
    </div>
  );
};