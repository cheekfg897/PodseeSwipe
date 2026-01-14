import { Place } from '@/types/place';

// Backend API base URL - change this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface NearbyPlacesParams {
  location: string; // Address or "lat,lng"
  radius: number; // in km
  categories: string[]; // category IDs
}

interface NearbyPlacesResponse {
  success: boolean;
  places: Place[];
  error?: string;
}

/**
 * Fetch nearby places from backend
 */
export async function fetchNearbyPlaces(params: NearbyPlacesParams): Promise<NearbyPlacesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/nearby-places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return {
      success: false,
      places: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Geocode an address to lat/lng using backend
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/geocode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.location : null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}
