/* user-store.js — MockIn user persistence + class assignment */

const USER_STORE_KEY    = 'mockin_user_v1';
const PROGRESS_KEY      = 'mockin_progress_v1';
const RANKS_KEY         = 'mockin_ranks_v1';
const ACHIEVEMENTS_KEY  = 'mockin_achievements_v1';
const COMMUNITY_KEY     = 'mockin_community_v1';
const API_KEY_KEY       = 'mockin_api_key';
const THEME_KEY         = 'mockin_theme_v1';

/* ── Auth / profile ── */
function loadUser() {
  try {
    const raw = localStorage.getItem(USER_STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveUser(profile) {
  try { localStorage.setItem(USER_STORE_KEY, JSON.stringify(profile)); } catch (e) {}
}

function updateUserProfile(fields) {
  const user = loadUser();
  const updated = Object.assign({}, user, fields);
  saveUser(updated);
  return updated;
}

function clearUser() {
  localStorage.removeItem(USER_STORE_KEY);
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(RANKS_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
  localStorage.removeItem(COMMUNITY_KEY);
  clearApiKey();
}

/* ── Progress (checkpoint scores, points) ── */
function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function saveProgress(progress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) {}
}

/* ── Last-known ranks (for leaderboard delta calculation) ── */
function loadLastRanks() {
  try {
    const raw = localStorage.getItem(RANKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function saveLastRanks(ranks) {
  try { localStorage.setItem(RANKS_KEY, JSON.stringify(ranks)); } catch (e) {}
}

/* ── Achievements ── */
function loadAchievements() {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveAchievements(ids) {
  try { localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(ids)); } catch (e) {}
}

/* ── Community questions ── */
function loadCommunityQuestions() {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveCommunityQuestion(q) {
  try {
    const current = loadCommunityQuestions();
    current.push(q);
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(current));
  } catch (e) {}
}

/* ── Catch-up results ── */
function saveCatchupResult(classId, cpId, score) {
  try {
    const progress = loadProgress();
    const cls = progress[classId];
    if (!cls || !Array.isArray(cls.checkpoints)) return progress;
    const cp = cls.checkpoints.find(c => c.id === cpId);
    if (!cp) return progress;
    cp.catchupResults = cp.catchupResults ?? [];
    cp.catchupResults.push({ score, date: new Date().toISOString().slice(0, 10) });
    if (score >= 70) {
      cp.completed  = true;
      cp.weakTopics = [];
    }
    saveProgress(progress);
    return progress;
  } catch (e) {}
}

/* ── API key ── */
function loadApiKey() {
  return localStorage.getItem(API_KEY_KEY) || null;
}

function saveApiKey(key) {
  localStorage.setItem(API_KEY_KEY, key);
}

function clearApiKey() {
  localStorage.removeItem(API_KEY_KEY);
}

/* ── Theme preference (device-level — not cleared on sign-out) ── */
function loadTheme() { try { const t = localStorage.getItem(THEME_KEY); return t === 'light' ? 'light' : 'dark'; } catch(e) { return 'dark'; } }
function saveTheme(theme) { try { localStorage.setItem(THEME_KEY, theme); } catch(e) {} }

/*
 * Pure, idempotent evaluation of all earned achievements.
 * Returns string[] of all currently earned achievement IDs.
 * Never throws — returns [] on any error.
 */
function evaluateAchievements(progress, assignedClasses) {
  try {
    const classIds = (assignedClasses || []).map(c => c.id);
    const allCps = classIds.flatMap(id => (progress[id] && progress[id].checkpoints) ? progress[id].checkpoints : []);
    const completedCps = allCps.filter(cp => cp.completed);
    const totalPoints = classIds.reduce((sum, id) => sum + ((progress[id] && progress[id].totalPoints) || 0), 0);

    const earned = [];

    if (completedCps.length >= 1) earned.push('first_step');
    if (completedCps.some(cp => cp.score >= 90)) earned.push('sharp_mind');
    if (completedCps.some(cp => cp.score === 100)) earned.push('perfect');
    if (completedCps.length >= 3) earned.push('halfway');
    if (completedCps.filter(cp => cp.score >= 70).length >= 3) earned.push('consistent');
    if (totalPoints >= 300) earned.push('points_300');

    /* season_done: all 6 checkpoints completed in any single class */
    if (classIds.some(id => {
      const cps = (progress[id] && progress[id].checkpoints) || [];
      return cps.length === 6 && cps.every(cp => cp.completed);
    })) earned.push('season_done');

    /* on_a_roll: any 3 consecutive checkpoints (by id, 1-indexed) in one class */
    if (classIds.some(id => {
      const cps = (progress[id] && progress[id].checkpoints) || [];
      const byId = {};
      cps.forEach(cp => { byId[cp.id] = cp; });
      for (let start = 1; start <= 4; start++) {
        if (byId[start] && byId[start+1] && byId[start+2] &&
            byId[start].completed && byId[start+1].completed && byId[start+2].completed) {
          return true;
        }
      }
      return false;
    })) earned.push('on_a_roll');

    return earned;
  } catch (e) { return []; }
}

/*
 * Ensures every class has a progress entry with generated checkpoints.
 * Creates entries only for classes that don't already exist.
 * Returns the full progress object.
 */
function initProgress(classes) {
  if (!classes || !classes.length) return {};
  const progress = loadProgress();
  let dirty = false;
  classes.forEach(cls => {
    if (!progress[cls.id]) {
      progress[cls.id] = { checkpoints: generateCheckpoints(), totalPoints: 0 };
      dirty = true;
    }
  });
  if (dirty) saveProgress(progress);
  return progress;
}

/*
 * Saves a completed checkpoint result and recalculates totalPoints for the class.
 * Returns the updated full progress object.
 */
function saveCheckpointResult(classId, cpId, score, points, weakTopics) {
  const progress = loadProgress();
  if (!progress[classId]) progress[classId] = { checkpoints: generateCheckpoints(), totalPoints: 0 };
  const cp = progress[classId].checkpoints.find(c => c.id === cpId);
  if (cp) {
    cp.completed = true;
    cp.score     = score;
    cp.points    = Math.max(cp.points || 0, points);
    cp.weakTopics = weakTopics || [];
  }
  progress[classId].totalPoints = progress[classId].checkpoints
    .filter(c => c.completed)
    .reduce((sum, c) => sum + (c.points || 0), 0);
  saveProgress(progress);
  return progress;
}

/* ── Class code derivation ── */
function _makeCode(title) {
  const stopwords = new Set(['and','the','of','in','to','for','a','an','with','on','at','by','from','introduction','advanced','fundamentals','applied','principles']);
  const words = title
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopwords.has(w.toLowerCase()))
    .map(w => w.replace(/[^a-zA-Z]/g, '').toUpperCase());
  if (words.length === 0) return 'CRS';
  if (words.length === 1) return words[0].slice(0, 6);
  return words[0].slice(0, 3) + words[1].slice(0, 3);
}

/*
 * Derives class metadata from selected courses.
 * Checkpoints are NOT stored here — they live in the progress store.
 */
function deriveClasses(selectedCourses) {
  const seen = {};
  return selectedCourses.map(course => {
    let base = _makeCode(course.title);
    let suffix = '';
    if (seen[base]) { seen[base]++; suffix = seen[base]; }
    else { seen[base] = 1; }
    const seasonCode = (typeof SEASON !== 'undefined') ? SEASON.code : 'W26';
    const seasonName = (typeof SEASON !== 'undefined') ? SEASON.name : 'Winter 2026';
    const code = base + suffix + ' ' + seasonCode;
    return {
      id:       course.id,
      code,
      fullName: course.title + ' \u2014 ' + seasonName,
      ects:     course.ects || 6,
      examDate: course.examDate || null,
    };
  });
}
