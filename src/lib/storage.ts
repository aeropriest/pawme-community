/**
 * Firebase Storage utilities for uploading and retrieving media files
 */

import { adminStorage } from './firebase-admin';

const BUCKET_NAME = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file buffer to Firebase Storage
 */
export async function uploadToStorage(
  fileBuffer: Buffer,
  destinationPath: string,
  contentType: string
): Promise<UploadResult> {
  try {
    console.log(`[Storage] Uploading to ${destinationPath} (${contentType}, ${fileBuffer.length} bytes)`);
    
    if (!adminStorage.bucket) {
      console.error('[Storage] Firebase Storage not initialized');
      return { success: false, error: 'Storage not initialized' };
    }

    const bucket = adminStorage.bucket(BUCKET_NAME);
    const file = bucket.file(destinationPath);

    await file.save(fileBuffer, {
      metadata: { contentType },
      resumable: false,
    });

    // Make the file publicly accessible
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destinationPath}`;
    console.log(`[Storage] Upload successful: ${publicUrl}`);

    return { success: true, url: publicUrl, path: destinationPath };
  } catch (error) {
    console.error('[Storage] Upload failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Get a signed URL for a file (for private files)
 */
export async function getSignedUrl(path: string, expiresInMinutes = 60): Promise<string> {
  try {
    const bucket = adminStorage.bucket(BUCKET_NAME);
    const file = bucket.file(path);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });
    return url;
  } catch (error) {
    console.error('[Storage] Signed URL failed:', error);
    return '';
  }
}

/**
 * List files in a storage path
 */
export async function listFiles(prefix: string): Promise<string[]> {
  try {
    const bucket = adminStorage.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix });
    return files.map(f => f.name);
  } catch (error) {
    console.error('[Storage] List files failed:', error);
    return [];
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(path: string): Promise<boolean> {
  try {
    const bucket = adminStorage.bucket(BUCKET_NAME);
    await bucket.file(path).delete();
    console.log(`[Storage] Deleted: ${path}`);
    return true;
  } catch (error) {
    console.error('[Storage] Delete failed:', error);
    return false;
  }
}

/**
 * Upload a local file from the WhatsApp media folder to Firebase Storage
 */
export async function uploadLocalMedia(
  localPath: string,
  destinationFolder: 'timeline' | 'posts' | 'media' = 'media'
): Promise<UploadResult> {
  try {
    const fs = require('fs');
    const path = require('path');
    
    if (!fs.existsSync(localPath)) {
      console.error(`[Storage] File not found: ${localPath}`);
      return { success: false, error: 'File not found' };
    }

    const fileBuffer = fs.readFileSync(localPath);
    const filename = path.basename(localPath);
    const destinationPath = `${destinationFolder}/${filename}`;
    
    // Determine content type
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (filename.endsWith('.png')) contentType = 'image/png';
    else if (filename.endsWith('.gif')) contentType = 'image/gif';
    else if (filename.endsWith('.mp4')) contentType = 'video/mp4';
    else if (filename.endsWith('.mov')) contentType = 'video/quicktime';
    else if (filename.endsWith('.pdf')) contentType = 'application/pdf';

    console.log(`[Storage] Local upload: ${localPath} → ${destinationPath}`);
    return uploadToStorage(fileBuffer, destinationPath, contentType);
  } catch (error) {
    console.error('[Storage] Local upload failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Batch upload multiple files
 */
export async function batchUpload(
  files: Array<{ localPath: string; destinationFolder?: 'timeline' | 'posts' | 'media' }>
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  for (const file of files) {
    const result = await uploadLocalMedia(file.localPath, file.destinationFolder || 'media');
    results.push(result);
  }
  const successCount = results.filter(r => r.success).length;
  console.log(`[Storage] Batch upload complete: ${successCount}/${results.length} successful`);
  return results;
}

/**
 * Get public URL for a storage path
 */
export function getPublicUrl(path: string): string {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${path}`;
}
