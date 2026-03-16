/* season.js — MockIn Season Engine (plain JS, no JSX) */

const CHECKPOINT_WEEKS       = [2, 4, 7, 10, 13, 15];
const DIFFICULTY_MULTIPLIERS = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5];
const _MS_WEEK               = 7 * 24 * 60 * 60 * 1000;

/* Current 1-based week number within the season */
function getCurrentSeasonWeek() {
  const sd    = (typeof SEASON !== 'undefined' && SEASON.startDate) ? SEASON.startDate : '2026-02-04';
  const start = new Date(sd + 'T00:00:00');
  const weeks = Math.floor((Date.now() - start.getTime()) / _MS_WEEK) + 1;
  const total = (typeof SEASON !== 'undefined') ? SEASON.totalWeeks : 16;
  return Math.max(1, Math.min(weeks, total));
}

/* Generates the 6-checkpoint schedule for a class */
function generateCheckpoints() {
  const sd    = (typeof SEASON !== 'undefined' && SEASON.startDate) ? SEASON.startDate : '2026-02-04';
  const start = new Date(sd + 'T00:00:00');
  return CHECKPOINT_WEEKS.map((week, i) => ({
    id:         i + 1,
    week,
    unlockDate: new Date(start.getTime() + (week - 1) * _MS_WEEK).toISOString().slice(0, 10),
    label:      'Checkpoint ' + (i + 1),
    completed:  false,
    score:      null,
    points:     null,
  }));
}

/* Points earned for a completed checkpoint */
function calcCheckpointPoints(score, cpIndex) {
  const m = DIFFICULTY_MULTIPLIERS[cpIndex] !== undefined ? DIFFICULTY_MULTIPLIERS[cpIndex] : 1.0;
  return Math.round(score * m);
}

/*
 * Returns the display status for a checkpoint.
 * Handles both new schema (unlockDate) and legacy demo schema (status string).
 */
function getCheckpointStatus(cp) {
  if (!cp.unlockDate) return cp.status || 'upcoming';       /* legacy fallback */
  if (cp.completed) {
    const recovered = !cp.weakTopics || cp.weakTopics.length === 0;
    return (cp.score !== null && cp.score >= 70) || recovered ? 'done' : 'weak';
  }
  if (getCurrentSeasonWeek() >= cp.week) return 'available';
  return 'locked';
}

/* Formats "2026-02-11" → "11 Feb" */
function fmtDate(isoStr) {
  if (!isoStr) return '—';
  try { return new Date(isoStr + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  catch (e) { return isoStr; }
}
