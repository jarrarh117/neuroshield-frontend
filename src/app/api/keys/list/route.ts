/**
 * List User's API Keys
 * GET /api/keys/list
 * Returns all API keys for the authenticated user (without plain keys)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
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

    // Get all API keys for this user (without orderBy to avoid index requirement)
    const snapshot = await adminDb
      .collection('api_keys')
      .where('userId', '==', userId)
      .get();

    // Sort in memory instead of in query
    const keys = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          keyName: data.keyName,
          scopes: data.scopes,
          tier: data.tier || 'FREE',
          metadata: {
            createdAt: data.metadata.createdAt?.toDate?.()?.toISOString() || data.metadata.createdAt,
            lastUsed: data.metadata.lastUsed?.toDate?.()?.toISOString() || data.metadata.lastUsed,
            isActive: data.metadata.isActive,
            expiresAt: data.metadata.expiresAt?.toDate?.()?.toISOString() || data.metadata.expiresAt,
          },
          usage: {
            totalRequests: data.usage.totalRequests,
            dailyLimit: data.usage.dailyLimit,
            monthlyLimit: data.usage.monthlyLimit,
            requestsToday: data.usage.requestsToday,
          },
          // Show last 8 characters of hashed key for identification
          keyPreview: `...${data.hashedKey.slice(-8)}`,
          _createdAt: data.metadata.createdAt?.toDate?.()?.getTime() || 0, // For sorting
        };
      })
      .sort((a, b) => b._createdAt - a._createdAt); // Sort by creation date, newest first

    // Remove the temporary sort field
    keys.forEach(key => delete (key as any)._createdAt);

    return NextResponse.json({
      success: true,
      keys,
      total: keys.length,
    });

  } catch (error: any) {
    console.error('Error listing API keys:', error);
    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}
