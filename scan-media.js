const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product';
const WHATSAPP_DIR = path.join(BASE_DIR, 'History/WhatsApp Chat - Rolling Robot - Pawme');
const STUDIO_DIR = path.join(WHATSAPP_DIR, 'studio');

function scanMedia(dir, prefix) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === '.DS_Store') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...scanMedia(fullPath, prefix + entry.name + '/'));
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.pdf'].includes(ext)) {
          const stat = fs.statSync(fullPath);
          results.push({
            file: entry.name,
            name: entry.name,
            type: ext === '.mp4' || ext === '.mov' ? 'video' : ext === '.pdf' ? 'document' : 'image',
            size: stat.size,
            relPath: prefix + entry.name,
            localPath: fullPath
          });
        }
      }
    }
  } catch(e) {}
  return results;
}

console.log('Scanning media files...');
const allMedia = scanMedia(BASE_DIR, '');
const whatsappMedia = scanMedia(WHATSAPP_DIR, 'whatsapp/');
const studioMedia = scanMedia(STUDIO_DIR, 'studio/');

console.log('Total media:', allMedia.length);
console.log('WhatsApp media:', whatsappMedia.length);
console.log('Studio media:', studioMedia.length);

// Save media index
const mediaIndex = {
  scannedAt: new Date().toISOString(),
  totalFiles: allMedia.length,
  whatsappFiles: whatsappMedia.length,
  studioFiles: studioMedia.length,
  files: allMedia,
  whatsappFiles: whatsappMedia,
  studioFiles: studioMedia,
};

fs.writeFileSync(
  '/Users/ashokjaiswal/Development/AyvaLabs/pawme-community/src/lib/media-index.json',
  JSON.stringify(mediaIndex, null, 2)
);

console.log('Saved media index to src/lib/media-index.json');
