// src/types/index.ts

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  failedLoginAttempts?: number;
  lockedUntil?: number;
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  walletAddress?: string; // Added as per original plan, though not used yet
  activeMembership?: { // Add this section
    planName: string;
    activatedAt: number;
    expiresAt: number; // When the current 24h access expires
    codeUsed: string;
  };
}

export interface MockMembershipCode {
  code: string;
  planName: string;
  durationHours: number;
  expiresAt: number; // Code expiry
  isUsed: boolean;
  usedByUserId?: string;
  activatedAt?: number; // Membership activation time
}

// Mock user session structure
export interface MockUserSession {
  userId: string;
  email: string; // Corrected from email:string to email: string
  role: 'user' | 'admin';
  loggedInAt: number;
}
