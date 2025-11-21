export interface Attraction {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: 'Nature' | 'History' | 'Culture' | 'Food' | 'Adventure' | 'Other';
  rating?: number; // 1-5
}

export interface RouteRequest {
  start: string;
  end: string;
}

export interface RouteResponse {
  attractions: Attraction[];
}

// For Leaflet interactions
export interface MapViewState {
  center: [number, number];
  zoom: number;
}