import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing target stream URL parameters', { status: 400 });
  }

  try {
    // Authenticate the request headers so storage buckets recognize it as a standard web browser
    const audioResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive'
      }
    });

    if (!audioResponse.ok || !audioResponse.body) {
      console.warn(`Remote storage responded with status: ${audioResponse.status}`);
      throw new Error("Target file destination unreachable or empty body");
    }

    const mediaStream = audioResponse.body;

    return new NextResponse(mediaStream, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Cache-Control': 'no-cache, no-transform'
      }
    });

  } catch (error) {
    console.error("Stream tunnel fault handled:", error);
    // Safe redirection failover to direct link if proxy layer stutters
    return NextResponse.redirect(targetUrl);
  }
}