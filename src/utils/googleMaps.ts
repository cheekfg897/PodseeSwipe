import { Place } from '@/types/place';

// Open Google Maps with directions to a place.
export function openGoogleMaps(place: Place, origin?: string) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const trimmedOrigin = origin?.trim();
  const hasPlaceId = place.id && !/^\d+$/.test(place.id);
  const params = new URLSearchParams({
    api: '1',
    destination: `${place.latitude},${place.longitude}`,
  });

  if (trimmedOrigin) {
    params.set('origin', trimmedOrigin);
  }

  if (hasPlaceId) {
    params.set('destination_place_id', place.id);
  }

  const mapsUrl = `https://www.google.com/maps/dir/?${params.toString()}`;
  if (isMobile) {
    // Try to open native Google Maps app first.
    window.location.href = mapsUrl;
  } else {
    // Open in new tab for desktop.
    window.open(mapsUrl, '_blank');
  }
}
