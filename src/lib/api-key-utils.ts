/**
 * API Key Utilities for NeuroShield
 * Handles generation, hashing, and validation of API keys
 */

import { createHash, randomBytes } from 'crypto';

export interface ApiKeyData {
  hashedKey: string;
  userId: string;
  keyName: string;
  scopes: string[];
  metadata: {
    createdAt: Date;
    lastUsed: Date | null;
    isActive: boolean;
    expiresAt: Date | null;
  };
  usage: {
    totalRequests: number;
    dailyLimit: number;
    monthlyLimit: number;
    lastResetDate: string; // YYYY-MM-DD format
    requestsToday: number;
  };
}

/**
 * Generate a secure API key with NeuroShield prefix
 * Format: ns_live_<32_random_hex_chars>
 */
export function generateApiKey(): string {
  const randomPart = randomBytes(32).toString('hex');
  return `ns_live_${randomPart}`;
}

/**
 * Hash an API key using SHA-256
 * This is what gets stored in Firestore
 */
export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  return /^ns_live_[a-f0-9]{64}$/.test(apiKey);
}

/**
 * Extract API key from request headers
 * Supports both 'x-api-key' and 'Authorization: Bearer' formats
 */
export function extractApiKey(headers: Headers): string | null {
  // Check x-api-key header first
  const xApiKey = headers.get('x-api-key');
  if (xApiKey) {
    return xApiKey;
  }

  // Check Authorization header
  const authHeader = headers.get('authorization');
  if (authHeader?.startsWith('Bearer ns_live_')) {
    return authHeader.substring(7); // Remove 'Bearer '
  }

  return null;
}

/**
 * Available scopes for API keys
 */
export const API_SCOPES = {
  SCAN_FILE: 'scan:file',
  SCAN_URL: 'scan:url',
  READ_REPORTS: 'reports:read',
  WRITE_REPORTS: 'reports:write',
  ADMIN: 'admin',
} as const;

export type ApiScope = typeof API_SCOPES[keyof typeof API_SCOPES];

/**
 * Default rate limits
 */
export const DEFAULT_RATE_LIMITS = {
  FREE: {
    dailyLimit: 100,
    monthlyLimit: 1000,
  },
  PRO: {
    dailyLimit: 1000,
    monthlyLimit: 20000,
  },
  ENTERPRISE: {
    dailyLimit: 10000,
    monthlyLimit: 200000,
  },
} as const;
