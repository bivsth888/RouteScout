import React, { useState } from 'react';
import { Attraction, RouteRequest } from '../types';

interface SidebarProps {
  onSearch: (request: RouteRequest) => void;
  attractions: Attraction[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const colors: Record<string, string> = {
    Nature: 'bg-emerald-100 text-emerald-800',
    History: 'bg-amber-100 text-amber-800',
    Culture: 'bg-purple-100 text-purple-800',
    Food: 'bg-orange-100 text-orange-800',
    Adventure: 'bg-red-100 text-red-800',
    Other: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[category] || colors.Other}`}>
      {category}
    </span>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  onSearch,
  attractions,
  loading,
  error,
  selectedId,
  onSelect,
}) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start.trim() && end.trim()) {
      onSearch({ start, end });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header & Form */}
      <div className="p-6 border-b border-gray-100 bg-white z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">RouteScout</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
            </div>
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Start Location (e.g., Los Angeles)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
            />
          </div>
          
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100"></div>
            </div>
            <input
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="Destination (e.g., Grand Canyon)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !start || !end}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scouting...
              </>
            ) : (
              'Find Attractions'
            )}
          </button>
        </form>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gray-50">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        {!loading && attractions.length === 0 && !error && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-semibold mb-1">Ready to explore?</h3>
            <p className="text-gray-500 text-sm">Enter your route to discover amazing places along the way.</p>
          </div>
        )}

        {attractions.map((attraction) => (
          <div
            key={attraction.id}
            onClick={() => onSelect(attraction.id)}
            className={`
              group p-4 rounded-xl border cursor-pointer transition-all duration-200
              ${selectedId === attraction.id 
                ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-md' 
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {attraction.name}
              </h3>
              {attraction.rating && (
                <div className="flex items-center text-xs font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                  <svg className="w-3 h-3 mr-0.5 fill-current" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {attraction.rating}
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <CategoryBadge category={attraction.category} />
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {attraction.description}
            </p>

            <div className="mt-3 flex items-center text-xs text-gray-400 font-medium">
               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               {attraction.latitude.toFixed(3)}, {attraction.longitude.toFixed(3)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};