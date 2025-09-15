export interface UpdateProfileDto {
  displayName: string; // Max 50 chars
  avatarUrl?: string; // Optional, valid URL, max 2048 chars
  city?: string; // Optional, max 100 chars
  bio?: string; // Optional, max 500 chars
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    city?: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserEvents {
  registeredEvents: Array<{
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    location: string;
  }>;
  favoritedEvents: Array<{
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    location: string;
  }>;
}