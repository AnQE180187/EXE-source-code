
export interface User {
  id: string;
  email: string;
  role: 'participant' | 'organizer' | 'admin';
  name: string;
}
