import { useState, useEffect } from 'react';
import { SwipeableCard } from './components/SwipeableCard';
import { LocationHeader } from './components/LocationHeader';
import { LandingPage } from './components/LandingPage';
import { Place } from '@/types/place';
import { openGoogleMaps } from '@/utils/googleMaps';
import { fetchNearbyPlaces, geocodeAddress } from '@/services/api';
import { RotateCcw, AlertCircle, Loader2, Home, Undo2 } from 'lucide-react';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [radius, setRadius] = useState<number>(5); // Default 5km
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tuitionLocation, setTuitionLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Handle starting from landing page
  const handleStart = async (categories: string[], location: string, term: string) => {
    setSelectedCategories(categories);
    setTuitionLocation(location);
    setSearchTerm(term);
    setShowLanding(false);
    
    // Try to fetch real data
    await fetchPlaces(location, radius, categories, term);
  };

  // Fetch places from backend or use mock data
  const fetchPlaces = async (
    location: string,
    radiusKm: number,
    categories: string[],
    term: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from backend
      const response = await fetchNearbyPlaces({
        location,
        radius: radiusKm,
        categories,
        searchTerm: term,
      });

      if (response.success && response.places.length > 0) {
        setPlaces(response.places);
      } else {
        console.log('No places found:', response.error || 'No places found');
        setPlaces([]);
        setError(response.error || 'No places found for that location.');
      }
    } catch (err) {
      console.error('Error fetching places:', err);
      setPlaces([]);
      setError('Failed to fetch places. Check your network or API key.');
    } finally {
      setIsLoading(false);
      setCurrentIndex(0);
    }
  };

  // Refetch when radius changes
  useEffect(() => {
    if (!showLanding && tuitionLocation) {
      fetchPlaces(tuitionLocation, radius, selectedCategories, searchTerm);
    }
  }, [radius]);

  const handleSwipeLeft = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleSwipeRight = (place: Place) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Open Google Maps after a short delay
    setTimeout(() => {
      openGoogleMaps(place, tuitionLocation);
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  const handleUndo = () => {
    if (isAnimating) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleBackToHome = () => {
    setShowLanding(true);
    setPlaces([]);
    setCurrentIndex(0);
    setError(null);
  };

  // Show landing page
  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  const currentPlace = places[currentIndex];
  const nextPlace = places[currentIndex + 1];
  const hasMorePlaces = currentIndex < places.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Header */}
      <LocationHeader
        tuitionCenter={tuitionLocation}
        radius={radius}
        onRadiusChange={setRadius}
      />

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {!isLoading && hasMorePlaces && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur hover:bg-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-white/60 disabled:text-gray-400"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Finding Nearby Places...
            </h2>
            <p className="text-gray-600">
              Searching within {radius} km
            </p>
          </div>
        ) : hasMorePlaces ? (
          <div className="relative w-full max-w-md aspect-[3/4] mx-auto">
            {/* Show next card behind */}
            {nextPlace && (
              <div className="absolute inset-0">
                <SwipeableCard
                  place={nextPlace}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  isTop={false}
                />
              </div>
            )}
            
            {/* Show current card on top */}
            {currentPlace && (
              <div className="absolute inset-0">
                <SwipeableCard
                  place={currentPlace}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  isTop={true}
                />
              </div>
            )}
          </div>
        ) : (
          // No more places
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No More Places
            </h2>
            <p className="text-gray-600 mb-6">
              You've seen all nearby places within {radius} km!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Start Over
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Change Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white p-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {hasMorePlaces ? (
            <>
              Showing {currentIndex + 1} of {places.length} places
            </>
          ) : (
            'Swipe cards to explore places'
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ← Swipe left to skip | Swipe right to navigate →
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            onClick={handleBackToHome}
            className="text-xs text-blue-600 hover:text-blue-700 underline"
          >
            Back to Home
          </button>
        </div>
      </div>

    </div>
  );
}
