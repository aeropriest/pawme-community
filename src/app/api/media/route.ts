/**
 * Media serving API — Serves files from local Google Drive mount
 * In production, these would be served from Firebase Storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const MEDIA_BASE = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const file = searchParams.get('file');
  
  if (!file) {
    return NextResponse.json({ error: 'No file specified' }, { status: 400 });
  }

  // Security: prevent directory traversal
  if (file.includes('..') || file.includes('~')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
  }

  // Try to find the file
  const searchPaths = [
    join(MEDIA_BASE, 'History/WhatsApp Chat - Rolling Robot - Pawme', file),
    join(MEDIA_BASE, 'History/WhatsApp Chat - Rolling Robot - Pawme/studio', file),
    join(MEDIA_BASE, file),
  ];

  for (const filePath of searchPaths) {
    if (existsSync(filePath)) {
      console.log(`[Media] Serving: ${filePath}`);
      
      const ext = filePath.split('.').pop()?.toLowerCase();
      const contentType = 
        ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
        ext === 'png' ? 'image/png' :
        ext === 'gif' ? 'image/gif' :
        ext === 'mp4' ? 'video/mp4' :
        ext === 'mov' ? 'video/quicktime' :
        ext === 'pdf' ? 'application/pdf' :
        'application/octet-stream';

      const buffer = readFileSync(filePath);
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
          'Content-Length': buffer.length.toString(),
        },
      });
    }
  }

  console.log(`[Media] File not found: ${file}`);
  return NextResponse.json({ error: 'File not found' }, { status: 404 });
}
