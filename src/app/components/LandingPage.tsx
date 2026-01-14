import { useState } from 'react';
import { MapPin, Coffee, ShoppingBag, Utensils, Building2, TreePine, Book, Heart, Dumbbell, ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  types: string[]; // Google Places API types
}

const categories: Category[] = [
  {
    id: 'food',
    name: 'Restaurants & Food',
    icon: <Utensils className="w-6 h-6" />,
    types: ['restaurant', 'food']
  },
  {
    id: 'cafe',
    name: 'Cafes & Coffee',
    icon: <Coffee className="w-6 h-6" />,
    types: ['cafe', 'bakery']
  },
  {
    id: 'shopping',
    name: 'Shopping & Malls',
    icon: <ShoppingBag className="w-6 h-6" />,
    types: ['shopping_mall', 'store', 'supermarket']
  },
  {
    id: 'banking',
    name: 'Banks & ATMs',
    icon: <Building2 className="w-6 h-6" />,
    types: ['bank', 'atm']
  },
  {
    id: 'parks',
    name: 'Parks & Recreation',
    icon: <TreePine className="w-6 h-6" />,
    types: ['park']
  },
  {
    id: 'library',
    name: 'Libraries',
    icon: <Book className="w-6 h-6" />,
    types: ['library']
  },
  {
    id: 'health',
    name: 'Pharmacy & Health',
    icon: <Heart className="w-6 h-6" />,
    types: ['pharmacy', 'drugstore', 'health']
  },
  {
    id: 'gym',
    name: 'Gyms & Fitness',
    icon: <Dumbbell className="w-6 h-6" />,
    types: ['gym']
  }
];

interface LandingPageProps {
  onStart: (selectedCategories: string[], tuitionLocation: string) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['food', 'cafe']);
  const [tuitionLocation, setTuitionLocation] = useState('');

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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
          <p className="text-sm text-gray-500 mt-2">
            Enter the address of the tuition center or use your current location
          </p>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What are you looking for?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Select one or more categories (you can choose multiple)
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
