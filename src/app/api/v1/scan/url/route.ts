/**
 * Public API Endpoint for URL Scanning (API Key Auth)
 * POST /api/v1/scan/url
 * Requires API key authentication via x-api-key header
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, hasScope } from '@/lib/api-key-validator';
import { extractApiKey, API_SCOPES } from '@/lib/api-key-utils';
import { scanUrl, type ScanUrlInput } from '@/ai/flows/scan-url-flow';

export const maxDuration = 60;

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

    // Check if key has URL scanning scope
    if (!hasScope(validation.scopes!, API_SCOPES.SCAN_URL)) {
      return NextResponse.json(
        { error: 'API key does not have URL scanning permission' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'url is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`[API v1] Scanning URL: ${url}`);

    // Call the Genkit flow
    const scanInput: ScanUrlInput = { url };
    const result = await scanUrl(scanInput);

    if (result.status === 'error' || result.error) {
      return NextResponse.json(
        { error: result.error || 'URL scan failed' },
        { status: 502 }
      );
    }

    // Return standardized response with rate limit headers
    const response = NextResponse.json({
      success: true,
      data: {
        url,
        status: result.status,
        threatLabel: result.threatLabel,
        threatScore: result.threatScore,
        detectionCount: result.detectionCount,
        totalEngines: result.totalEngines,
        categories: result.categories,
        timestamp: result.timestamp || new Date().toISOString(),
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
    console.error('[API v1] Error processing URL scan:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'NeuroShield URL Scanning API',
    version: '1.0',
    endpoint: 'POST /api/v1/scan/url',
    authentication: 'API Key required (x-api-key header)',
    documentation: 'https://neuroshield.com/docs/api',
  });
}
