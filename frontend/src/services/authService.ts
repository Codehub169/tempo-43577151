import api from './api';
import { User } from '../types'; // Assuming User type is defined in types/index.ts

// Minimal interface if User type is not globally defined
// interface User {
//   id: number | string;
//   name: string;
//   email: string;
//   roles: string[];
// }

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('authToken', response.data.accessToken);
      // Optionally store user data in localStorage or context
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    // Optionally, could call a backend /auth/logout endpoint if it exists
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Placeholder for register if needed in the future
  // register: async (data: any) => {
  //   const response = await api.post('/auth/register', data);
  //   if (response.data.accessToken) {
  //     localStorage.setItem('authToken', response.data.accessToken);
  //   }
  //   return response.data;
  // },

  // Placeholder for fetching user profile from backend if needed beyond initial login
  // getUserProfile: async (): Promise<User> => {
  //   const response = await api.get<User>('/auth/profile');
  //   return response.data;
  // }
};

export default AuthService;
