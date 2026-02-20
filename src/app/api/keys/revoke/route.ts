/**
 * Revoke/Delete API Key
 * POST /api/keys/revoke
 * Deactivates an API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

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
    const { keyId } = body;

    if (!keyId || typeof keyId !== 'string') {
      return NextResponse.json(
        { error: 'keyId is required' },
        { status: 400 }
      );
    }

    // Get the key document
    const keyDoc = await adminDb.collection('api_keys').doc(keyId).get();

    if (!keyDoc.exists) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    const keyData = keyDoc.data();

    // Verify ownership
    if (keyData?.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to revoke this API key' },
        { status: 403 }
      );
    }

    // Deactivate the key (soft delete)
    await keyDoc.ref.update({
      'metadata.isActive': false,
      'metadata.revokedAt': new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully',
    });

  } catch (error: any) {
    console.error('Error revoking API key:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}
