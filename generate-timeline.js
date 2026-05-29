const fs = require('fs');

// Read parsed dates
const parsedData = JSON.parse(fs.readFileSync('/Users/ashokjaiswal/Development/AyvaLabs/pawme-community/src/lib/parsed-dates.json', 'utf-8'));

// Read the chat file
const chatFile = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product/History/WhatsApp Chat - Rolling Robot - Pawme/_chat.txt';
const chatContent = fs.readFileSync(chatFile, 'utf-8');
const chatLines = chatContent.split('\n');

// Build a map of date -> conversation messages
const dateConversations = {};
const msgRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}:\d{2}[^\]]*)\] ([^:]+): (.*)/;

for (const line of chatLines) {
  const match = line.match(msgRegex);
  if (match) {
    const date = match[1], sender = match[3], content = match[4];
    if (!dateConversations[date]) dateConversations[date] = [];
    const cleanContent = content.replace(/<attached:[^>]+>/g, '').trim();
    if (cleanContent.length > 10 && !cleanContent.startsWith('https://') && !cleanContent.includes('Messages and calls are encrypted')) {
      dateConversations[date].push(sender + ': ' + cleanContent);
    }
  }
}

// Read studio video files
const studioDir = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product/History/WhatsApp Chat - Rolling Robot - Pawme/studio';
let studioVideos = [];
try {
  studioVideos = fs.readdirSync(studioDir).filter(f => f.endsWith('.mp4') || f.endsWith('.jpg'));
} catch(e) {}

console.log('Studio videos found:', studioVideos.length);

// Generate timeline entries
const day0 = new Date(2025, 6, 21);
const entries = [];

for (const entry of parsedData) {
  const parts = entry.date.split('/');
  const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
  const dateObj = new Date(y, m - 1, d);
  const dayNumber = Math.round((dateObj.getTime() - day0.getTime()) / 86400000);
  
  const convs = dateConversations[entry.date] || [];
  const meaningfulMsgs = convs.filter(m => 
    m.length > 20 && 
    !m.includes('You created group') &&
    !m.includes('joined using your invite') &&
    !m.includes('changed the group') &&
    !m.includes("changed this group's icon")
  );
  
  const summary = meaningfulMsgs.slice(0, 5).join('\n');
  
  let pillar = 'build_in_public';
  const allText = (summary + ' ' + entry.participants.join(' ')).toLowerCase();
  if (allText.includes('design') || allText.includes('ameya') || allText.includes('industrial')) pillar = 'design';
  else if (allText.includes('video') || allText.includes('kickstarter') || allText.includes('shoot')) pillar = 'media';
  else if (allText.includes('patent') || allText.includes('award') || allText.includes('token')) pillar = 'milestone';
  else if (allText.includes('ship') || allText.includes('courier') || allText.includes('assembly')) pillar = 'manufacturing';
  else if (allText.includes('app') || allText.includes('flutter') || allText.includes('react')) pillar = 'software';
  
  entries.push({
    dayNumber,
    date: entry.date,
    dateLabel: dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    messageCount: entry.messages,
    mediaCount: entry.mediaCount,
    participants: entry.participants.filter(p => !p.includes('Rolling Robot - Pawme')),
    mediaFiles: entry.mediaFiles,
    summary: summary.substring(0, 600),
    pillar,
    tags: [pillar]
  });
}

entries.sort((a, b) => a.dayNumber - b.dayNumber);

// Save
const output = {
  studioVideos,
  entries,
  totalDays: entries.length,
  dayRange: { from: entries[0].dayNumber, to: entries[entries.length - 1].dayNumber },
  totalMedia: entries.reduce((s, e) => s + e.mediaCount, 0),
  totalMessages: entries.reduce((s, e) => s + e.messageCount, 0)
};

fs.writeFileSync('/Users/ashokjaiswal/Development/AyvaLabs/pawme-community/src/lib/generated-timeline.json', JSON.stringify(output, null, 2));

console.log('Generated', entries.length, 'timeline entries');
console.log('Day range: Day', entries[0].dayNumber, 'to Day', entries[entries.length - 1].dayNumber);
console.log('Total media:', output.totalMedia);
console.log('Total messages:', output.totalMessages);
console.log('Studio videos:', studioVideos.length);
