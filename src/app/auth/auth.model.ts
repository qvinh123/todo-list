export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  kind: string;
  displayName: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
