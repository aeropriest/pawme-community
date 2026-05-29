import * as fs from 'fs';

const CHAT_FILE = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product/History/WhatsApp Chat - Rolling Robot - Pawme/_chat.txt';

const content = fs.readFileSync(CHAT_FILE, 'utf-8');
const lines = content.split('\n');

interface ChatMessage {
  date: string;
  time: string;
  sender: string;
  content: string;
  mediaFile?: string;
}

const messages: ChatMessage[] = [];
const msgRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}:\d{2}[^\]]*)\] ([^:]+): (.*)/;
const mediaRegex = /<attached: ([^>]+)>/;

for (const line of lines) {
  const match = line.match(msgRegex);
  if (match) {
    const [, date, time, sender, rawContent] = match;
    const mediaMatch = rawContent.match(mediaRegex);
    const mediaFile = mediaMatch ? mediaMatch[1].trim() : undefined;
    const textContent = rawContent.replace(mediaRegex, '').trim();
    messages.push({ date, time, sender, content: textContent, mediaFile });
  }
}

// Group by date
const byDate: Record<string, ChatMessage[]> = {};
for (const msg of messages) {
  if (!byDate[msg.date]) byDate[msg.date] = [];
  byDate[msg.date].push(msg);
}

const dates = Object.keys(byDate).sort((a, b) => {
  const [da, ma, ya] = a.split('/').map(Number);
  const [db, mb, yb] = b.split('/').map(Number);
  return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
});

console.log('Parsed ' + messages.length + ' messages');
console.log('Found ' + dates.length + ' unique dates');

// Build output
const dateEntries: Array<{
  date: string;
  day: string;
  messages: number;
  mediaCount: number;
  participants: string[];
  hasMedia: boolean;
  mediaFiles: Array<{ file: string; sender: string; type: string }>;
  previews: string[];
}> = [];

for (const date of dates) {
  const msgs = byDate[date];
  const participants = [...new Set(msgs.map(m => m.sender))];
  const mediaFiles = msgs
    .filter(m => m.mediaFile)
    .map(m => ({
      file: m.mediaFile!,
      sender: m.sender,
      type: m.mediaFile!.endsWith('.mp4') || m.mediaFile!.endsWith('.mov') ? 'video' :
            m.mediaFile!.endsWith('.pdf') ? 'pdf' : 'image'
    }));

  const textMsgs = msgs.filter(m => m.content && m.content.length > 15);
  const previews = textMsgs.slice(0, 3).map(m => m.sender + ': ' + m.content.substring(0, 120));

  dateEntries.push({
    date,
    day: date.replace(/\//g, '-'),
    messages: msgs.length,
    mediaCount: mediaFiles.length,
    participants,
    hasMedia: mediaFiles.length > 0,
    mediaFiles: mediaFiles.slice(0, 10),
    previews
  });
}

// Write as JSON
const jsonPath = '/Users/ashokjaiswal/Development/AyvaLabs/pawme-community/src/lib/parsed-dates.json';
fs.writeFileSync(jsonPath, JSON.stringify(dateEntries, null, 2));

console.log('Wrote ' + dateEntries.length + ' date entries to ' + jsonPath);

// Print summary
console.log('\n=== All dates ===');
for (const entry of dateEntries) {
  const mediaFlag = entry.hasMedia ? ' [' + entry.mediaCount + ' media]' : '';
  console.log(entry.date + ': ' + entry.messages + ' msgs' + mediaFlag + ' | ' + entry.participants.join(', '));
}
