export type UserRole = 'Pending' | 'Worker' | 'TeamLead' | 'Admin';

export type AuthResponse = {
  token: string;
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
};

export type LoginState = {
  token: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    isActive: boolean;
  };
};