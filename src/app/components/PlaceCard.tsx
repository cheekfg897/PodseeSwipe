import { useEffect, useState } from 'react';
import { MapPin, Star, Clock, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { Place } from '@/types/place';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const fallbackImageUrl = getFallbackImageUrl(place.category);
  const imageUrls = (place.imageUrls ?? [])
    .filter((url) => url?.trim())
    .length > 0
    ? (place.imageUrls ?? []).filter((url) => url?.trim())
    : [place.imageUrl].filter((url) => url?.trim());
  const sanitizedImageUrls = imageUrls.length > 0 ? imageUrls : [fallbackImageUrl];
  const [imageIndex, setImageIndex] = useState(0);
  const reviews = place.reviews ?? [];
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    setReviewIndex(0);
    setImageIndex(0);
  }, [place.id]);

  const currentReview = reviews[reviewIndex];
  const priceLabel = formatPriceLevel(place.priceLevel);

  return (
    <div className="h-full w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        <ImageWithFallback
          src={sanitizedImageUrls[imageIndex]}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        {sanitizedImageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setImageIndex((prev) =>
                  (prev - 1 + sanitizedImageUrls.length) % sanitizedImageUrls.length
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/60 p-2 text-gray-700 shadow-sm backdrop-blur hover:bg-white/80"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setImageIndex((prev) => (prev + 1) % sanitizedImageUrls.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/60 p-2 text-gray-700 shadow-sm backdrop-blur hover:bg-white/80"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{place.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col min-h-0 overflow-y-auto">
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

          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <span className="text-sm">Price: {priceLabel}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm flex-1">{place.description}</p>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Reviews</span>
            {reviews.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setReviewIndex((prev) => (prev + 1) % reviews.length)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {currentReview ? (
            <>
              <p className="text-sm text-gray-700 min-h-[72px]">
                "{currentReview.text || 'No review text available.'}"
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>— {currentReview.authorName}</span>
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {currentReview.rating}
                </span>
              </div>
              {currentReview.relativeTimeDescription ? (
                <div className="mt-1 text-[11px] text-gray-400">
                  {currentReview.relativeTimeDescription}
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-gray-500">No reviews available yet.</p>
          )}
        </div>

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

function formatPriceLevel(priceLevel?: number | null): string {
  if (priceLevel === null || priceLevel === undefined) {
    return 'Unknown';
  }

  const safeLevel = Math.max(0, Math.min(4, priceLevel));
  const dollars = '$'.repeat(Math.max(1, safeLevel));
  return dollars;
}

function getFallbackImageUrl(category?: string | null): string {
  const normalized = (category ?? '').toLowerCase();

  if (normalized.includes('atm') || normalized.includes('bank')) {
    return 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800';
  }
  if (normalized.includes('shopping') || normalized.includes('store') || normalized.includes('mall')) {
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800';
  }
  if (normalized.includes('spa') || normalized.includes('salon') || normalized.includes('wellness')) {
    return 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800';
  }
  if (normalized.includes('cafe') || normalized.includes('restaurant') || normalized.includes('food')) {
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800';
  }

  return 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800';
}
