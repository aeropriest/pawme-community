const fs = require('fs');

const chatFile = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product/History/WhatsApp Chat - Rolling Robot - Pawme/_chat.txt';
const chatContent = fs.readFileSync(chatFile, 'utf-8');
const lines = chatContent.split('\n');

const dateMedia = {};
const msgRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}:\d{2}[^\]]*)\] ([^:]+): (.*)/;
// Use a more flexible media regex
const mediaRegex = /<attached:\s+([^>]+?)>/;

for (const line of lines) {
  const match = line.match(msgRegex);
  if (match) {
    const date = match[1], sender = match[3], content = match[4];
    // Find all media attachments in this line
    let mediaMatch;
    const regex = new RegExp(mediaRegex.source, 'g');
    while ((mediaMatch = regex.exec(content)) !== null) {
      const file = mediaMatch[1].trim();
      if (!dateMedia[date]) dateMedia[date] = [];
      const type = file.endsWith('.mp4') || file.endsWith('.mov') ? 'video' : 
                   file.endsWith('.pdf') ? 'pdf' :
                   file.endsWith('.vcf') ? 'contact' : 'image';
      dateMedia[date].push({ file, sender, type });
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
