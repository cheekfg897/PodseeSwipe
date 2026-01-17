import { useState } from 'react';
import { MapPin, Coffee, Utensils, ArrowRight, Sparkles, ShoppingBag, Landmark } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  types: string[]; // Google Places API types
}

const categories: Category[] = [
  {
    id: 'food',
    name: 'Restaurants & Cafes',
    icon: <Utensils className="w-6 h-6" />,
    types: ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'meal_delivery']
  },
  {
    id: 'budget',
    name: 'Hawker & Coffee',
    icon: <Coffee className="w-6 h-6" />,
    types: ['food_court', 'meal_takeaway', 'cafe']
  },
  {
    id: 'self-care',
    name: 'Self Care & Wellness',
    icon: <Sparkles className="w-6 h-6" />,
    types: ['spa', 'beauty_salon', 'hair_care', 'physiotherapist']
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: <ShoppingBag className="w-6 h-6" />,
    types: ['shopping_mall', 'department_store', 'clothing_store', 'store', 'supermarket']
  },
  {
    id: 'banks',
    name: 'Banks & ATMs',
    icon: <Landmark className="w-6 h-6" />,
    types: ['bank', 'atm']
  }
];

interface LandingPageProps {
  onStart: (selectedCategories: string[], tuitionLocation: string) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['food']);
  const [tuitionLocation, setTuitionLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories([categoryId]);
  };

  const handleStart = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }
    if (!tuitionLocation.trim()) {
      alert('Please enter the tuition center location');
      return;
    }
    onStart(selectedCategories, tuitionLocation);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported on this device.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setTuitionLocation(`${latitude},${longitude}`);
        setIsLocating(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied.'
            : 'Unable to fetch current location.';
        setLocationError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Parents' Wait Time Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover nearby places to eat, shop, and relax while your child is in tuition
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Enter Location</h3>
                <p className="text-sm text-gray-600">Tell us where the tuition center is</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Choose Categories</h3>
                <p className="text-sm text-gray-600">Select what you're interested in</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Swipe & Go</h3>
                <p className="text-sm text-gray-600">Swipe right to navigate instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tuition Center Location</h2>
          <input
            type="text"
            placeholder="e.g., 123 Main Street, Singapore"
            value={tuitionLocation}
            onChange={(e) => setTuitionLocation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mt-3">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLocating ? 'Locating...' : 'Use current location'}
            </button>
            <p className="text-sm text-gray-500 mt-2 sm:mt-0">
              Enter the address of the tuition center or use your current location
            </p>
          </div>
          {locationError && (
            <p className="text-sm text-red-600 mt-2">{locationError}</p>
          )}
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What are you looking for?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Select one category
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedCategories.includes(category.id)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`mb-2 ${
                  selectedCategories.includes(category.id)
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}>
                  {category.icon}
                </div>
                <div className={`font-semibold text-sm ${
                  selectedCategories.includes(category.id)
                    ? 'text-blue-900'
                    : 'text-gray-900'
                }`}>
                  {category.name}
                </div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-lg"
        >
          Find Nearby Places
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>We'll show you places within 2-5km radius</p>
          <p className="mt-1">Swipe left to skip • Swipe right to navigate</p>
        </div>
      </div>
    </div>
  );
}

export { categories };
