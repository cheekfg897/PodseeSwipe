import { Place } from '@/types/place';

// Mock data simulating Google Maps Places API response
export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'The Cozy Nook Cafe',
    category: 'Cafe & Coffee Shop',
    rating: 4.5,
    distance: 0.8,
    openingHours: 'Open until 10:00 PM',
    description: 'A warm and inviting cafe perfect for parents to relax. Features comfortable seating, free WiFi, and excellent coffee.',
    imageUrl: 'https://images.unsplash.com/photo-1642647916334-82e513d9cc48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZXxlbnwxfHx8fDE3NjgyNjc4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    latitude: 1.3521,
    longitude: 103.8198,
    address: '123 Main Street, #01-45'
  },
  {
    id: '2',
    name: 'Golden Dragon Restaurant',
    category: 'Chinese Restaurant',
    rating: 4.7,
    distance: 1.2,
    openingHours: 'Open until 11:00 PM',
    description: 'Authentic Chinese cuisine with a modern twist. Popular for dim sum and family dinners.',
    imageUrl: 'https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY4MzAxMzg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    latitude: 1.3545,
    longitude: 103.8210,
    address: '456 Food Street, Level 2'
  },
  {
    id: '3',
    name: 'Westfield Shopping Mall',
    category: 'Shopping Center',
    rating: 4.3,
    distance: 1.5,
    openingHours: 'Open until 10:00 PM',
    description: 'Large shopping complex with retail stores, food court, and entertainment options. Great for browsing while waiting.',
    imageUrl: 'https://images.unsplash.com/photo-1580793241553-e9f1cce181af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGx8ZW58MXx8fHwxNzY4MjY2NDY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    latitude: 1.3560,
    longitude: 103.8225,
    address: '789 Shopping Avenue'
  },
  {
    id: '4',
    name: 'Central Public Library',
    category: 'Library & Study Space',
    rating: 4.6,
    distance: 1.8,
    openingHours: 'Open until 9:00 PM',
    description: 'Quiet reading space with WiFi. Perfect for catching up on work or reading while your child is in tuition.',
    imageUrl: 'https://images.unsplash.com/photo-1568667256531-7d5ac92eaa7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3N8ZW58MXx8fHwxNzY4MzU0MDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    latitude: 1.3575,
    longitude: 103.8240,
    address: '321 Library Lane'
  },
  {
    id: '5',
    name: 'Sunshine Park',
    category: 'Park & Recreation',
    rating: 4.4,
    distance: 1.0,
    openingHours: 'Open 24 hours',
    description: 'Beautiful park with walking trails and benches. Enjoy fresh air and nature while waiting for pickup time.',
    imageUrl: 'https://images.unsplash.com/photo-1634608874538-443b84f7b06b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJrJTIwcGxheWdyb3VuZHxlbnwxfHx8fDE3NjgzMDk5ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    latitude: 1.3530,
    longitude: 103.8205,
    address: 'Park Road'
  },
  {
    id: '6',
    name: 'Hawker Center Food Court',
    category: 'Food Court',
    rating: 4.8,
    distance: 0.6,
    openingHours: 'Open until 11:00 PM',
    description: 'Variety of local food stalls offering affordable and delicious meals. Quick dining options available.',
    imageUrl: 'https://images.unsplash.com/photo-1649301795137-6d3631815772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwY291cnQlMjBhc2lhbnxlbnwxfHx8fDE3NjgzNTY2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    latitude: 1.3510,
    longitude: 103.8190,
    address: '88 Hawker Lane'
  }
];

// Function to simulate filtering places by radius
export function filterPlacesByRadius(places: Place[], radius: number): Place[] {
  return places.filter(place => place.distance <= radius);
}

// Function to open Google Maps with directions
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
  
  if (isMobile) {
    // Try to open native Google Maps app first
    const mapsUrl = `https://www.google.com/maps/dir/?${params.toString()}`;
    window.location.href = mapsUrl;
  } else {
    // Open in new tab for desktop
    const mapsUrl = `https://www.google.com/maps/dir/?${params.toString()}`;
    window.open(mapsUrl, '_blank');
  }
}
