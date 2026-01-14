import { MapPin, Star, Clock, Navigation } from 'lucide-react';
import { Place } from '@/types/place';

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <div className="h-full w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-1/2 overflow-hidden">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{place.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-2">{place.name}</h2>
        <p className="text-gray-600 mb-4">{place.category}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-sm">{place.distance} km away</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-sm">{place.openingHours}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm flex-1">{place.description}</p>

        {/* Swipe Instructions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-red-500">
              <span className="text-2xl">←</span>
              <span>Skip</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <span>Navigate</span>
              <span className="text-2xl">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
