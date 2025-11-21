import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapComponent } from './components/Map';
import { Attraction, RouteRequest } from './types';
import { findAttractions } from './services/geminiService';

const App: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [routePoints, setRoutePoints] = useState<{ start: string; end: string } | null>(null);
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);

  const handleRouteSearch = useCallback(async (request: RouteRequest) => {
    setLoading(true);
    setError(null);
    setRoutePoints({ start: request.start, end: request.end });
    setAttractions([]); // Clear previous results

    try {
      const results = await findAttractions(request.start, request.end);
      setAttractions(results);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to find attractions. Please check your API key or try different locations.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectAttraction = useCallback((id: string) => {
    setSelectedAttractionId(id);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar Area */}
      <div className="w-full md:w-[400px] md:flex-shrink-0 h-1/2 md:h-full z-20 shadow-xl bg-white relative">
        <Sidebar
          onSearch={handleRouteSearch}
          attractions={attractions}
          loading={loading}
          error={error}
          selectedId={selectedAttractionId}
          onSelect={handleSelectAttraction}
        />
      </div>

      {/* Map Area */}
      <div className="flex-grow h-1/2 md:h-full relative z-10">
        <MapComponent
          attractions={attractions}
          selectedId={selectedAttractionId}
          onMarkerClick={handleSelectAttraction}
        />
      </div>
    </div>
  );
};

export default App;