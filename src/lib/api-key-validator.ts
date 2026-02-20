/**
 * API Key Validation Middleware for NeuroShield
 * Server-side validation using Firebase Admin SDK
 */

import { adminDb } from './firebase-admin';
import { hashApiKey, isValidApiKeyFormat, type ApiKeyData } from './api-key-utils';

export interface ValidationResult {
  isValid: boolean;
  userId?: string;
  scopes?: string[];
  error?: string;
  keyData?: ApiKeyData;
}

/**
 * Validate an API key against Firestore
 * Returns user ID and scopes if valid
 */
export async function validateApiKey(apiKey: string): Promise<ValidationResult> {
  try {
    // Check format first
    if (!isValidApiKeyFormat(apiKey)) {
      return {
        isValid: false,
        error: 'Invalid API key format',
      };
    }

    // Hash the key
    const hashedKey = hashApiKey(apiKey);

    // Query Firestore for the hashed key
    const apiKeysRef = adminDb.collection('api_keys');
    const snapshot = await apiKeysRef
      .where('hashedKey', '==', hashedKey)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        isValid: false,
        error: 'API key not found',
      };
    }

    const keyDoc = snapshot.docs[0];
    const keyData = keyDoc.data() as ApiKeyData;

    // Check if key is active
    if (!keyData.metadata.isActive) {
      return {
        isValid: false,
        error: 'API key has been deactivated',
      };
    }

    // Check if key has expired
    if (keyData.metadata.expiresAt) {
      const expiresAt = keyData.metadata.expiresAt instanceof Date 
        ? keyData.metadata.expiresAt 
        : (keyData.metadata.expiresAt as any).toDate();
      
      if (expiresAt < new Date()) {
        return {
          isValid: false,
          error: 'API key has expired',
        };
      }
    }

    // Check rate limits
    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily counter if it's a new day
    if (keyData.usage.lastResetDate !== today) {
      await keyDoc.ref.update({
        'usage.requestsToday': 0,
        'usage.lastResetDate': today,
      });
      keyData.usage.requestsToday = 0;
    }

    // Check daily limit
    if (keyData.usage.requestsToday >= keyData.usage.dailyLimit) {
      return {
        isValid: false,
        error: 'Daily rate limit exceeded',
      };
    }

    // Check monthly limit (reset at start of each month)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const lastMonth = keyData.usage.lastResetDate?.slice(0, 7) || '';
    
    // Reset monthly counter if it's a new month
    if (currentMonth !== lastMonth) {
      await keyDoc.ref.update({
        'usage.totalRequests': 0,
        'usage.requestsToday': 0,
        'usage.lastResetDate': today,
      });
      keyData.usage.totalRequests = 0;
      keyData.usage.requestsToday = 0;
    } else if (keyData.usage.totalRequests >= keyData.usage.monthlyLimit) {
      return {
        isValid: false,
        error: 'Monthly rate limit exceeded',
      };
    }

    // Update usage statistics
    await keyDoc.ref.update({
      'metadata.lastUsed': new Date(),
      'usage.totalRequests': keyData.usage.totalRequests + 1,
      'usage.requestsToday': keyData.usage.requestsToday + 1,
    });

    return {
      isValid: true,
      userId: keyData.userId,
      scopes: keyData.scopes,
      keyData,
    };
  } catch (error: any) {
    console.error('Error validating API key:', error);
    return {
      isValid: false,
      error: 'Internal error validating API key',
    };
  }
}

/**
 * Check if API key has required scope
 */
export function hasScope(scopes: string[], requiredScope: string): boolean {
  return scopes.includes(requiredScope) || scopes.includes('admin');
}
