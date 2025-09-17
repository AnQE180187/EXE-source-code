// Based on backend DTO
export interface UpdateProfileDto {
  displayName: string;
  avatarUrl?: string;
  city?: string;
  bio?: string;
}

// Represents the full profile data received from the server
export interface UserProfile extends UpdateProfileDto {
  id: string; // Add the ID field
  email: string;
  role: 'participant' | 'organizer' | 'admin';
}

// You can expand this later
export interface UserEvents {
  registered: any[];
  favorited: any[];
  organized: any[];
}
