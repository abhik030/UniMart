export interface ProfileSetupRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  description?: string;
  profilePicture?: File | null;
}

export interface ProfileSetupResponse {
  id?: number;
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  description?: string | null;
  profilePictureUrl?: string | null;
  universityName?: string;
  token: string;
}

export interface EmailRequest {
  email: string;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export interface SchoolRedirectDTO {
  redirectUrl: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  username?: string;
  universityName: string;
  token: string;
  isFirstLogin: boolean;
}

export interface SupportedUniversityDTO {
  id: number;
  name: string;
  domain: string;
  logoUrl: string | null;
}

export interface EmailValidationResponse {
  universityName: string;
  isSupported: boolean;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
} 