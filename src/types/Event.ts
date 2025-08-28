export type EventCategory = 'academic' | 'social' | 'sports' | 'clubs' | 'career';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
  image: string;
  attendees: number;
  price: number;
  tags: string[];
}