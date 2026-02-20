/**
 * API Key Generation Endpoint
 * POST /api/keys/generate
 * Requires Firebase Authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { generateApiKey, hashApiKey, DEFAULT_RATE_LIMITS, API_SCOPES } from '@/lib/api-key-utils';

export async function POST(request: NextRequest) {
  try {
    // Verify Firebase Auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Parse request body
    const body = await request.json();
    const { keyName, scopes, tier = 'FREE', expiresInDays } = body;

    // Validate inputs
    if (!keyName || typeof keyName !== 'string') {
      return NextResponse.json(
        { error: 'keyName is required and must be a string' },
        { status: 400 }
      );
    }

    if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
      return NextResponse.json(
        { error: 'scopes must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate scopes
    const validScopes = Object.values(API_SCOPES);
    const invalidScopes = scopes.filter(s => !validScopes.includes(s));
    if (invalidScopes.length > 0) {
      return NextResponse.json(
        { error: `Invalid scopes: ${invalidScopes.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user already has too many keys (limit: 10 for regular users, unlimited for admins)
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const isAdmin = userDoc.exists && userDoc.data()?.role === 'admin';
    
    if (!isAdmin) {
      const existingKeys = await adminDb
        .collection('api_keys')
        .where('userId', '==', userId)
        .where('metadata.isActive', '==', true)
        .get();

      if (existingKeys.size >= 10) {
        return NextResponse.json(
          { error: 'Maximum number of active API keys reached (10)' },
          { status: 400 }
        );
      }
      
      // Check for duplicate key names
      const duplicateName = existingKeys.docs.some(doc => 
        doc.data().keyName.toLowerCase() === keyName.toLowerCase()
      );
      
      if (duplicateName) {
        return NextResponse.json(
          { error: `An API key with the name "${keyName}" already exists. Please choose a different name.` },
          { status: 400 }
        );
      }
    } else {
      // For admins, still check for duplicate names
      const existingKeys = await adminDb
        .collection('api_keys')
        .where('userId', '==', userId)
        .where('metadata.isActive', '==', true)
        .get();
      
      const duplicateName = existingKeys.docs.some(doc => 
        doc.data().keyName.toLowerCase() === keyName.toLowerCase()
      );
      
      if (duplicateName) {
        return NextResponse.json(
          { error: `An API key with the name "${keyName}" already exists. Please choose a different name.` },
          { status: 400 }
        );
      }
    }

    // Generate new API key
    const plainKey = generateApiKey();
    const hashedKey = hashApiKey(plainKey);

    // Get rate limits based on tier
    const rateLimits = DEFAULT_RATE_LIMITS[tier as keyof typeof DEFAULT_RATE_LIMITS] || DEFAULT_RATE_LIMITS.FREE;

    // Calculate expiration date
    let expiresAt = null;
    if (expiresInDays && typeof expiresInDays === 'number' && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create API key document
    const apiKeyData = {
      hashedKey,
      userId,
      keyName,
      scopes,
      metadata: {
        createdAt: new Date(),
        lastUsed: null,
        isActive: true,
        expiresAt,
      },
      usage: {
        totalRequests: 0,
        dailyLimit: rateLimits.dailyLimit,
        monthlyLimit: rateLimits.monthlyLimit,
        lastResetDate: new Date().toISOString().split('T')[0],
        requestsToday: 0,
      },
      tier,
    };

    // Save to Firestore
    const docRef = await adminDb.collection('api_keys').add(apiKeyData);

    // Return the plain key (ONLY TIME IT'S SHOWN!)
    return NextResponse.json({
      success: true,
      apiKey: plainKey, // Show plain key
      keyId: docRef.id,
      keyName,
      scopes,
      tier,
      dailyLimit: rateLimits.dailyLimit,
      monthlyLimit: rateLimits.monthlyLimit,
      expiresAt: expiresAt?.toISOString() || null,
      message: 'API key generated successfully',
    });

  } catch (error: any) {
    console.error('Error generating API key:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Authentication token expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST to generate a new API key' },
    { status: 405 }
  );
}
