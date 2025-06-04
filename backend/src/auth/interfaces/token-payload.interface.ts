export interface TokenPayload {
  sub: number; // User ID
  email: string;
  roles?: string[]; // Optional: user roles
}
