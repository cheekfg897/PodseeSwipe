export interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  priceLevel?: number | null;
  reviews?: PlaceReview[];
  distance: number;
  openingHours: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface PlaceReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription?: string;
}
