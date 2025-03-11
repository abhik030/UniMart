export interface EmailRequest {
  email: string;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export interface SchoolRedirectDTO {
  isSupported: boolean;
  universityName?: string;
  message: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  username: string;
  universityName: string;
  token: string;
}

export interface SupportedUniversityDTO {
  id: number;
  name: string;
  domain: string;
  logoUrl?: string;
} 