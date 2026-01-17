/**
 * Node.js Backend Server for Parents' Wait Time Guide
 * 
 * Setup Instructions:
 * 1. Install dependencies: npm install express cors dotenv node-cache axios
 * 2. Create .env file with: GOOGLE_MAPS_API_KEY=your_api_key_here
 * 3. Run: node server.js
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cache results for 2 hours (7200 seconds)
const cache = new NodeCache({ stdTTL: 7200 });

// Middleware
app.use(cors());
app.use(express.json());

// Google Maps API Key from environment variable
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Singapore bounding box (approx) to enforce country-only results
const SINGAPORE_BOUNDS = {
  minLat: 1.1304753,
  maxLat: 1.4504753,
  minLng: 103.6920359,
  maxLng: 104.0120359
};

// Category mapping to Google Places API types
const CATEGORY_TYPE_MAP = {
  food: ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'meal_delivery'],
  budget: ['food_court', 'meal_takeaway', 'cafe'],
  'self-care': ['spa', 'beauty_salon', 'hair_care', 'physiotherapist'],
  shopping: ['shopping_mall', 'department_store', 'clothing_store', 'store', 'supermarket'],
  banks: ['bank', 'atm']
};

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    hasApiKey: !!GOOGLE_MAPS_API_KEY 
  });
});

/**
 * Geocode address to lat/lng
 */
app.post('/api/geocode', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address is required' 
      });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Google Maps API key not configured' 
      });
    }

    // Check cache first
    const cacheKey = `geocode:${address}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Cache hit for geocoding:', address);
      return res.json({ success: true, location: cached });
    }

    // Call Google Geocoding API
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        components: 'country:SG',
        region: 'sg',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      if (!isWithinSingapore(location.lat, location.lng)) {
        return res.json({
          success: false,
          error: 'Location must be within Singapore'
        });
      }
      
      // Cache the result
      cache.set(cacheKey, location);

      res.json({ 
        success: true, 
        location: location 
      });
    } else {
      res.json({ 
        success: false, 
        error: 'Could not geocode address' 
      });
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Geocoding failed' 
    });
  }
});

/**
 * Get nearby places
 */
app.post('/api/nearby-places', async (req, res) => {
  try {
    const { location, radius, categories } = req.body;

    if (!location || !radius || !categories) {
      return res.status(400).json({ 
        success: false, 
        error: 'Location, radius, and categories are required' 
      });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Google Maps API key not configured' 
      });
    }

    // Generate cache key
    const cacheKey = `places:${location}:${radius}:${categories.sort().join(',')}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Cache hit for nearby places');
      return res.json({ success: true, places: cached });
    }

    // Convert location to lat,lng if it's an address
    let latLng = location;
    if (!location.match(/^-?\d+\.?\d*,-?\d+\.?\d*$/)) {
      // It's an address, geocode it first
      const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          components: 'country:SG',
          region: 'sg',
          key: GOOGLE_MAPS_API_KEY
        }
      });

      if (geocodeResponse.data.status === 'OK' && geocodeResponse.data.results.length > 0) {
        const loc = geocodeResponse.data.results[0].geometry.location;
        if (!isWithinSingapore(loc.lat, loc.lng)) {
          return res.json({
            success: false,
            error: 'Location must be within Singapore',
            places: []
          });
        }
        latLng = `${loc.lat},${loc.lng}`;
      } else {
        return res.json({ 
          success: false, 
          error: 'Could not find location',
          places: [] 
        });
      }
    }

    // Get types from categories
    const types = categories.flatMap(cat => CATEGORY_TYPE_MAP[cat] || []);
    const uniqueTypes = [...new Set(types)]; // Remove duplicates

    // Fetch places for each type and combine results
    const allPlaces = [];
    const radiusMeters = radius * 1000; // Convert km to meters

    for (const type of uniqueTypes) {
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
          params: {
            location: latLng,
            radius: radiusMeters,
            type: type,
            key: GOOGLE_MAPS_API_KEY
          }
        });

        if (response.data.status === 'OK') {
          allPlaces.push(...response.data.results);
        }
      } catch (error) {
        console.error(`Error fetching places for type ${type}:`, error.message);
      }
    }

    // Remove duplicates by place_id
    const uniquePlaces = Array.from(
      new Map(allPlaces.map(place => [place.place_id, place])).values()
    );

    // Transform to our Place format
    const [centerLat, centerLng] = latLng.split(',').map(Number);
    if (!isWithinSingapore(centerLat, centerLng)) {
      return res.json({
        success: false,
        error: 'Location must be within Singapore',
        places: []
      });
    }
    const transformedPlaces = uniquePlaces.slice(0, 50).map(place => {
      // Calculate distance
      const distance = calculateDistance(
        centerLat,
        centerLng,
        place.geometry.location.lat,
        place.geometry.location.lng
      );

      return {
        id: place.place_id,
        name: place.name,
        category: place.types[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Place',
        rating: place.rating || 0,
        distance: parseFloat(distance.toFixed(1)),
        openingHours: place.opening_hours?.open_now ? 'Open now' : 'Closed',
        description: place.vicinity || 'No description available',
        imageUrl: place.photos?.[0] 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
          : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        address: place.vicinity || ''
      };
    });

    // Sort by distance
    transformedPlaces.sort((a, b) => a.distance - b.distance);

    // Cache the results
    cache.set(cacheKey, transformedPlaces);

    res.json({ 
      success: true, 
      places: transformedPlaces 
    });

  } catch (error) {
    console.error('Error fetching nearby places:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch places',
      places: [] 
    });
  }
});

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

function isWithinSingapore(lat, lng) {
  return (
    lat >= SINGAPORE_BOUNDS.minLat &&
    lat <= SINGAPORE_BOUNDS.maxLat &&
    lng >= SINGAPORE_BOUNDS.minLng &&
    lng <= SINGAPORE_BOUNDS.maxLng
  );
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/nearby-places`);
  console.log(`🔑 Google Maps API Key: ${GOOGLE_MAPS_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️  Warning: GOOGLE_MAPS_API_KEY not set in .env file');
  }
});
