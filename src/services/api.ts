import { Place, PlaceReview } from '@/types/place';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
const FRONTEND_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const USE_BACKEND = API_BASE_URL.length > 0;

const CATEGORY_TYPE_MAP: Record<string, string[]> = {
  food: ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'meal_delivery'],
  budget: ['food_court', 'meal_takeaway', 'cafe'],
  'self-care': ['spa', 'beauty_salon', 'hair_care', 'physiotherapist'],
  shopping: ['shopping_mall', 'department_store', 'clothing_store', 'store', 'supermarket'],
  banks: ['bank', 'atm'],
};

const SINGAPORE_BOUNDS = {
  minLat: 1.1304753,
  maxLat: 1.4504753,
  minLng: 103.6920359,
  maxLng: 104.0120359,
};

let googleMapsPromise: Promise<typeof window.google> | null = null;

function loadGoogleMaps(): Promise<typeof window.google> {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve(window.google);
      return;
    }

    if (!FRONTEND_API_KEY) {
      reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${FRONTEND_API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.maps?.places) {
        resolve(window.google);
      } else {
        reject(new Error('Google Maps failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function isLatLngString(value: string): boolean {
  return /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(value);
}

function isWithinSingapore(lat: number, lng: number): boolean {
  return (
    lat >= SINGAPORE_BOUNDS.minLat &&
    lat <= SINGAPORE_BOUNDS.maxLat &&
    lng >= SINGAPORE_BOUNDS.minLng &&
    lng <= SINGAPORE_BOUNDS.maxLng
  );
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

interface NearbyPlacesParams {
  location: string; // Address or "lat,lng"
  radius: number; // in km
  categories: string[]; // category IDs
  searchTerm?: string; // optional keyword
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
  if (!USE_BACKEND) {
    return fetchNearbyPlacesFromGoogle(params);
  }

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
  if (!USE_BACKEND) {
    return geocodeWithGoogle(address);
  }

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

async function geocodeWithGoogle(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!FRONTEND_API_KEY) {
    console.error('Missing VITE_GOOGLE_MAPS_API_KEY');
    return null;
  }

  try {
    const google = await loadGoogleMaps();
    return await new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { address, componentRestrictions: { country: 'SG' } },
        (results, status) => {
          if (status !== 'OK' || !results?.length) {
            resolve(null);
            return;
          }
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          if (!isWithinSingapore(lat, lng)) {
            resolve(null);
            return;
          }
          resolve({ lat, lng });
        }
      );
    });
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

async function fetchNearbyPlacesFromGoogle(
  params: NearbyPlacesParams
): Promise<NearbyPlacesResponse> {
  if (!FRONTEND_API_KEY) {
    return { success: false, places: [], error: 'Google Maps API key not configured' };
  }

  try {
    const google = await loadGoogleMaps();
    let latLngString = params.location;

    if (!isLatLngString(params.location)) {
      const location = await geocodeWithGoogle(params.location);
      if (!location) {
        return { success: false, places: [], error: 'Could not find location' };
      }
      latLngString = `${location.lat},${location.lng}`;
    }

    const [centerLat, centerLng] = latLngString.split(',').map(Number);
    if (!isWithinSingapore(centerLat, centerLng)) {
      return { success: false, places: [], error: 'Location must be within Singapore' };
    }

    const types = params.categories.flatMap((cat) => CATEGORY_TYPE_MAP[cat] || []);
    const uniqueTypes = [...new Set(types)];
    const radiusMeters = params.radius * 1000;
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const keyword = params.searchTerm?.trim();

    const resultsByType = await Promise.all(
      uniqueTypes.map(
        (type) =>
          new Promise<any[]>((resolve, reject) => {
            service.nearbySearch(
              {
                location: new google.maps.LatLng(centerLat, centerLng),
                radius: radiusMeters,
                type,
                ...(keyword ? { keyword } : {}),
              },
              (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  resolve(results || []);
                  return;
                }
                if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                  resolve([]);
                  return;
                }
                reject(new Error(`Places error: ${status}`));
              }
            );
          })
      )
    );

    const allPlaces = resultsByType.flat();
    const uniquePlaces = Array.from(
      new Map(allPlaces.map((place) => [place.place_id, place])).values()
    ).filter((place) => !place.types?.includes('lodging'));
    const allowedTypes = new Set(uniqueTypes);
    const categoryFilteredPlaces = uniquePlaces.filter((place) =>
      place.types?.some((type) => allowedTypes.has(type))
    );

    const transformedPlaces: Place[] = await Promise.all(categoryFilteredPlaces.slice(0, 50).map(async (place) => {
      const matchedType = place.types?.find((type) => allowedTypes.has(type));
      const distance = calculateDistance(
        centerLat,
        centerLng,
        place.geometry?.location?.lat?.() ?? centerLat,
        place.geometry?.location?.lng?.() ?? centerLng
      );

      const details = await fetchPlaceDetailsFromGoogle(google, service, place.place_id || place.id);

      const imageUrls = place.photos?.length
        ? place.photos
            .slice(0, 5)
            .map((photo) => photo.getUrl({ maxWidth: 800 }))
        : details.photoUrls;

      return {
        id: place.place_id || place.id || `${place.name}-${distance}`,
        name: place.name || 'Place',
        category: matchedType
          ? matchedType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
          : 'Place',
        rating: place.rating || 0,
        priceLevel: details.priceLevel,
        reviews: details.reviews,
        imageUrls,
        distance: parseFloat(distance.toFixed(1)),
        openingHours:
          details.isOpenNow === true
            ? 'Open now'
            : details.isOpenNow === false
              ? 'Closed'
              : 'Hours unavailable',
        description: place.vicinity || place.formatted_address || 'No description available',
        imageUrl: imageUrls[0] ||
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        latitude: place.geometry?.location?.lat?.() ?? centerLat,
        longitude: place.geometry?.location?.lng?.() ?? centerLng,
        address: place.vicinity || place.formatted_address || '',
      };
    }));

    transformedPlaces.sort((a, b) => a.distance - b.distance);

    return { success: true, places: transformedPlaces };
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return {
      success: false,
      places: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function fetchPlaceDetailsFromGoogle(
  google: typeof window.google,
  service: google.maps.places.PlacesService,
  placeId?: string
): Promise<{
  priceLevel: number | null;
  reviews: PlaceReview[];
  photoUrls: string[];
  isOpenNow: boolean | null;
}> {
  if (!placeId) {
    return { priceLevel: null, reviews: [], photoUrls: [], isOpenNow: null };
  }

  return new Promise((resolve) => {
    service.getDetails(
      { placeId, fields: ['price_level', 'reviews', 'photos', 'opening_hours'] },
      (result, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !result) {
          resolve({ priceLevel: null, reviews: [], photoUrls: [], isOpenNow: null });
          return;
        }

        const reviews = Array.isArray(result.reviews)
          ? result.reviews.slice(0, 5).map((review) => ({
              authorName: review.author_name || 'Anonymous',
              rating: review.rating || 0,
              text: review.text || '',
              relativeTimeDescription: review.relative_time_description || '',
            }))
          : [];

        const photoUrls = Array.isArray(result.photos)
          ? result.photos.slice(0, 5).map((photo) => photo.getUrl({ maxWidth: 800 }))
          : [];

        const isOpenNow =
          typeof result.opening_hours?.open_now === 'boolean'
            ? result.opening_hours.open_now
            : null;

        resolve({
          priceLevel: typeof result.price_level === 'number' ? result.price_level : null,
          reviews,
          photoUrls,
          isOpenNow,
        });
      }
    );
  });
}
