import { EventStatus } from './enums';

// Based on Prisma Schema and API responses
export interface Event {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  locationText: string;
  startAt: string; // ISO Date string
  endAt: string;   // ISO Date string
  price: number | null;
  capacity: number | null;
  status: EventStatus;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  organizer?: {
    id: string;
    name: string;
  };
}
