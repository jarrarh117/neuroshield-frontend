/**
 * Public API Endpoint for File Scanning (API Key Auth)
 * POST /api/v1/scan/file
 * Requires API key authentication via x-api-key header
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, hasScope } from '@/lib/api-key-validator';
import { extractApiKey, API_SCOPES } from '@/lib/api-key-utils';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    // Extract and validate API key
    const apiKey = extractApiKey(request.headers);
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Missing API key',
          message: 'Provide API key via x-api-key header or Authorization: Bearer header'
        },
        { status: 401 }
      );
    }

    const validation = await validateApiKey(apiKey);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid API key' },
        { status: 401 }
      );
    }

    // Check if key has file scanning scope
    if (!hasScope(validation.scopes!, API_SCOPES.SCAN_FILE)) {
      return NextResponse.json(
        { error: 'API key does not have file scanning permission' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { fileDataUri, fileName } = body;

    if (!fileDataUri || typeof fileDataUri !== 'string') {
      return NextResponse.json(
        { error: 'fileDataUri is required and must be a base64 data URI' },
        { status: 400 }
      );
    }

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json(
        { error: 'fileName is required' },
        { status: 400 }
      );
    }

    // Forward to backend API (Render)
    const backendUrl = process.env.EMBER_API_URL || 'https://neuroshield-backend.onrender.com';
    
    console.log(`[API v1] Forwarding file scan to backend: ${fileName}`);
    
    const backendResponse = await fetch(`${backendUrl}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_data: fileDataUri,
        file_name: fileName,
      }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('[API v1] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Backend scan failed', details: errorText },
        { status: 502 }
      );
    }

    const scanResult = await backendResponse.json();

    // Return standardized response with rate limit headers
    const response = NextResponse.json({
      success: true,
      data: {
        fileName,
        verdict: scanResult.verdict || 'Unknown',
        confidence: scanResult.confidence || 0,
        malwareProbability: scanResult.malware_probability || 0,
        threatSeverity: scanResult.threat_severity || 'Unknown',
        fileHash: scanResult.file_hash,
        fileSize: scanResult.file_size,
        timestamp: scanResult.timestamp || new Date().toISOString(),
      },
      usage: {
        requestsToday: validation.keyData?.usage.requestsToday || 0,
        dailyLimit: validation.keyData?.usage.dailyLimit || 0,
        remainingToday: (validation.keyData?.usage.dailyLimit || 0) - (validation.keyData?.usage.requestsToday || 0),
      },
    });

    // Add standard rate limit headers
    response.headers.set('X-RateLimit-Limit', String(validation.keyData?.usage.dailyLimit || 0));
    response.headers.set('X-RateLimit-Remaining', String((validation.keyData?.usage.dailyLimit || 0) - (validation.keyData?.usage.requestsToday || 0)));
    response.headers.set('X-RateLimit-Reset', new Date(new Date().setUTCHours(24, 0, 0, 0)).toISOString());

    return response;

  } catch (error: any) {
    console.error('[API v1] Error processing file scan:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'NeuroShield File Scanning API',
    version: '1.0',
    endpoint: 'POST /api/v1/scan/file',
    authentication: 'API Key required (x-api-key header)',
    documentation: 'https://neuroshield.com/docs/api',
  });
}
