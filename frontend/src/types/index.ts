export interface EmailRequest {
  email: string;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export interface EmailValidationResponse {
  universityName: string;
  isSupported: boolean;
  message: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  username: string;
  universityName: string;
  token: string;
  isFirstLogin?: boolean;
}

export interface ProfileSetupRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  description?: string;
  profilePicture?: File | null;
}

export interface ProfileSetupResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  description: string | null;
  profilePictureUrl: string | null;
  universityName: string;
  token: string;
}

export interface SupportedUniversityDTO {
  id: number;
  name: string;
  domain: string;
  logoUrl: string | null;
}

export interface SchoolRedirectDTO {
  redirectUrl: string;
} 