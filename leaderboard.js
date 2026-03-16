/* leaderboard.js — MockIn Leaderboard Engine (plain JS, no JSX) */

const _LB_FIRST = [
  'Ayşe','Mehmet','Sara','Jin','Mia','Leon','Emma','Noah','Lena','Felix',
  'Sophie','Jonas','Hannah','Lukas','Marie','Tim','Anna','Jan','Laura','David',
  'Ali','Zeynep','Kemal','Fatima','Omar','Yuki','Chen','Priya','Max','Lea',
  'Erik','Isabella','Nour','Lars','Chloe','Ryo','Diego','Ava','Kai','Zara',
];
const _LB_LAST = 'ABCDEFGHKLMNOPRSTWY'.split('');
const _LB_COLS = ['bg-lavender','bg-mint','bg-yellow-500','bg-dk-line','bg-yellow-700','bg-lavender'];

function _strSeed(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (((h << 5) + h) ^ str.charCodeAt(i)) >>> 0;
  return h;
}
function _lcg(seed) {
  let v = seed >>> 0;
  return () => { v = (Math.imul(1664525, v) + 1013904223) >>> 0; return v / 0x100000000; };
}

/*
 * Generates a deterministic leaderboard for a class.
 *
 * classId          — used as random seed (same inputs → same board)
 * userTotalPoints  — user's accumulated points
 * userName         — displayed in the "You" row
 * completedCount   — how many checkpoints have been completed (drives peer scores)
 * lastRank         — optional: user's persisted rank from previous session;
 *                    if provided, user delta = lastRank − currentRank (positive = moved up)
 *
 * Returns: { top5, userRank, userEntry, total }
 */
function generateLeaderboard(classId, userTotalPoints, userName, completedCount, lastRank) {
  const rand      = _lcg(_strSeed(classId + '|lb'));
  const deltaRand = _lcg(_strSeed(classId + '|delta|' + Math.floor(Date.now() / 86400000)));
  const total = 150 + Math.floor(rand() * 101);   /* 150–250 students */
  const students = [];

  for (let i = 0; i < total; i++) {
    const first = _LB_FIRST[Math.floor(rand() * _LB_FIRST.length)];
    const last  = _LB_LAST[Math.floor(rand() * _LB_LAST.length)];
    const color = _LB_COLS[Math.floor(rand() * _LB_COLS.length)];
    let pts = 0;
    for (let cp = 0; cp < completedCount; cp++) {
      pts += calcCheckpointPoints(Math.floor(rand() * 61 + 40), cp);  /* random score 40–100 */
    }
    /* Triangular distribution (average of two uniform samples) biases delta toward 0 */
    const delta = Math.max(-5, Math.min(5, Math.round((deltaRand() + deltaRand()) * 5 - 5)));
    students.push({ name: first + ' ' + last + '.', initials: first[0] + last, color, pts, isUser: false, delta });
  }

  const uName     = userName || 'You';
  const uInitials = uName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'YO';
  const uSimDelta = Math.max(-5, Math.min(5, Math.round((deltaRand() + deltaRand()) * 5 - 5)));
  students.push({ name: uName, initials: uInitials, color: 'bg-coral', pts: userTotalPoints, isUser: true, delta: uSimDelta });

  students.sort((a, b) => b.pts - a.pts);
  students.forEach((s, idx) => { s.rank = idx + 1; });

  const userEntry = students.find(s => s.isUser);
  if (userEntry && lastRank != null) {
    userEntry.delta = lastRank - userEntry.rank;
  }

  return {
    top5:      students.slice(0, 5),
    userRank:  userEntry ? userEntry.rank : total + 1,
    userEntry: userEntry || { rank: total + 1, name: uName, initials: uInitials, color: 'bg-coral', pts: userTotalPoints, isUser: true, delta: uSimDelta },
    total:     students.length,
    all:       students,
  };
}
