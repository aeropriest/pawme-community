const fs = require('fs');

const chatFile = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product/History/WhatsApp Chat - Rolling Robot - Pawme/_chat.txt';
const chatContent = fs.readFileSync(chatFile, 'utf-8');
const lines = chatContent.split('\n');

const dateMedia = {};
// Match lines with media attachments - look for the attached pattern anywhere in the line
const attachedPattern = /<attached:\s+([^>]+?)>/;

for (const line of lines) {
  const attachedMatch = line.match(attachedPattern);
  if (attachedMatch) {
    // Extract date from the line
    const dateMatch = line.match(/\[(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (dateMatch) {
      const date = dateMatch[1];
      const file = attachedMatch[1].trim();
      if (!dateMedia[date]) dateMedia[date] = [];
      const type = file.endsWith('.mp4') || file.endsWith('.mov') ? 'video' : 
                   file.endsWith('.pdf') ? 'pdf' :
                   file.endsWith('.vcf') ? 'contact' : 'image';
      dateMedia[date].push({ file, type });
    }
  }
}

const dates = Object.keys(dateMedia).sort((a, b) => {
  const [da, ma, ya] = a.split('/').map(Number);
  const [db, mb, yb] = b.split('/').map(Number);
  return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
});

let totalMedia = 0;
for (const date of dates) {
  const media = dateMedia[date];
  totalMedia += media.length;
  console.log(date + ': ' + media.length + ' media');
}

console.log('\nTotal:', totalMedia, 'media files across', dates.length, 'dates');

// Save media map
fs.writeFileSync('/Users/ashokjaiswal/Development/AyvaLabs/pawme-community/src/lib/date-media.json', JSON.stringify(dateMedia, null, 2));
