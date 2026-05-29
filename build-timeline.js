const fs = require('fs');

// Read all the data
const parsedData = JSON.parse(fs.readFileSync('/Users/ashokjaiswal/Development/AyvaLabs/pawme-community/src/lib/parsed-dates.json', 'utf-8'));
const dateMedia = JSON.parse(fs.readFileSync('/Users/ashokjaiswal/Development/AyvaLabs/pawme-community/src/lib/date-media.json', 'utf-8'));

// Read chat for conversation summaries
const chatFile = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product/History/WhatsApp Chat - Rolling Robot - Pawme/_chat.txt';
const chatContent = fs.readFileSync(chatFile, 'utf-8');
const chatLines = chatContent.split('\n');

// Build conversation map
const dateConversations = {};
const msgRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}:\d{2}[^\]]*)\] ([^:]+): (.*)/;

for (const line of chatLines) {
  const match = line.match(msgRegex);
  if (match) {
    const date = match[1], sender = match[3], content = match[4];
    if (!dateConversations[date]) dateConversations[date] = [];
    const cleanContent = content.replace(/<attached:[^>]+>/g, '').trim();
    if (cleanContent.length > 10 && !cleanContent.startsWith('https://')) {
      dateConversations[date].push(sender + ': ' + cleanContent);
    }
  }
}

// Read studio videos
const studioDir = '/Users/ashokjaiswal/Library/CloudStorage/GoogleDrive-pawme@ayvalabs.com/My Drive/5. Product/History/WhatsApp Chat - Rolling Robot - Pawme/studio';
let studioVideos = [];
try { studioVideos = fs.readdirSync(studioDir).filter(f => f.endsWith('.mp4')); } catch(e) {}

// Build complete timeline
const day0 = new Date(2025, 6, 21);
const entries = [];

for (const entry of parsedData) {
  const [d, m, y] = entry.date.split('/').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayNumber = Math.round((dateObj.getTime() - day0.getTime()) / 86400000);
  
  const convs = dateConversations[entry.date] || [];
  const meaningfulMsgs = convs.filter(m => 
    m.length > 20 && 
    !m.includes('You created group') &&
    !m.includes('joined using your invite') &&
    !m.includes('changed the group')
  );
  
  const mediaForDate = dateMedia[entry.date] || [];
  const summary = meaningfulMsgs.slice(0, 6).join('\n');
  
  // Determine pillar
  let pillar = 'build_in_public';
  const allText = (summary + ' ' + entry.participants.join(' ')).toLowerCase();
  if (allText.includes('design') || allText.includes('ameya') || allText.includes('industrial') || allText.includes('render')) pillar = 'design';
  else if (allText.includes('video') || allText.includes('kickstarter') || allText.includes('shoot') || allText.includes('edit') || allText.includes('youtube')) pillar = 'media';
  else if (allText.includes('patent') || allText.includes('award') || allText.includes('token') || allText.includes('partnership') || allText.includes('red dot')) pillar = 'milestone';
  else if (allText.includes('ship') || allText.includes('courier') || allText.includes('assembly') || allText.includes('pcb') || allText.includes('manufacturing')) pillar = 'manufacturing';
  else if (allText.includes('app') || allText.includes('flutter') || allText.includes('react') || allText.includes('website') || allText.includes('vercel')) pillar = 'software';
  else if (allText.includes('market') || allText.includes('competitor') || allText.includes('campaign')) pillar = 'market_context';
  else if (allText.includes('firmware') || allText.includes('esp32') || allText.includes('openai') || allText.includes('sensor')) pillar = 'firmware';
  
  entries.push({
    dayNumber,
    date: entry.date,
    dateLabel: dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    messageCount: entry.messages,
    mediaCount: mediaForDate.length,
    participants: entry.participants.filter(p => !p.includes('Rolling Robot - Pawme')),
    mediaFiles: mediaForDate.slice(0, 10),
    summary: summary.substring(0, 800),
    pillar,
    tags: [pillar],
    hasMedia: mediaForDate.length > 0
  });
}

entries.sort((a, b) => a.dayNumber - b.dayNumber);

const output = {
  studioVideos,
  entries,
  totalDays: entries.length,
  dayRange: { from: entries[0].dayNumber, to: entries[entries.length - 1].dayNumber },
  totalMedia: entries.reduce((s, e) => s + e.mediaCount, 0),
  totalMessages: entries.reduce((s, e) => s + e.messageCount, 0),
  mediaDates: entries.filter(e => e.hasMedia).length
};

fs.writeFileSync('/Users/ashokjaiswal/Development/AyvaLabs/pawme-community/src/lib/generated-timeline.json', JSON.stringify(output, null, 2));

console.log('Generated', entries.length, 'timeline entries');
console.log('Day range: Day', entries[0].dayNumber, 'to Day', entries[entries.length - 1].dayNumber);
console.log('Total media:', output.totalMedia, 'files across', output.mediaDates, 'dates');
console.log('Studio videos:', studioVideos.length);
