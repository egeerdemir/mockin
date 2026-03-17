/* dashboard-pages.js — Consolidated pages for MockIn (Leaderboard, Exams, Season, Profile/Settings) (text/babel) */

/* ══════════════════════════════════════════════
   LEADERBOARD PAGE
   ══════════════════════════════════════════════ */

function buildLeaderboardData(assignedClasses, progress, user) {
  const rankMap = {};
  (assignedClasses || []).forEach(function(cls) {
    const userPoints = (progress[cls.id] && progress[cls.id].totalPoints) || 0;
    const userCheckpoints = progress[cls.id] && progress[cls.id].checkpoints
      ? progress[cls.id].checkpoints.filter(function(c) { return c.completed; }).length
      : 0;
    const lb = generateLeaderboard(cls.id, userPoints, user ? user.name : 'You', userCheckpoints);
    const list = lb.all;
    const userRank = lb.userRank || (list ? list.length + 1 : 1);
    rankMap[cls.id] = {
      list: list,
      userRank: userRank,
      userPoints: userPoints,
      userCheckpoints: userCheckpoints
    };
  });
  return rankMap;
}

function LeaderboardRow({ rank, name, points, checkpointsDone, isCurrentUser }) {
  const medalBadge = rank === 1
    ? 'bg-yellow-400 text-white'
    : rank === 2
      ? 'bg-gray-300 text-dk-text'
      : rank === 3
        ? 'bg-amber-700 text-white'
        : null;

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${
      isCurrentUser
        ? 'bg-dk-accent bg-opacity-10 border-l-2 border-dk-accent font-semibold'
        : 'bg-dk-surface hover:bg-dk-hover transition-colors'
    }`}>
      <div className="w-7 flex-shrink-0 flex justify-center">
        {medalBadge ? (
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-2xs font-bold ${medalBadge}`}>
            {rank}
          </span>
        ) : (
          <span className="text-dk-muted text-xs font-mono">{rank}</span>
        )}
      </div>
      <span className={`flex-1 text-sm truncate ${isCurrentUser ? 'text-dk-accent font-bold' : 'text-dk-text'}`}>
        {name}
      </span>
      <span className="text-dk-text text-xs font-mono w-16 text-right flex-shrink-0">{points} pts</span>
      <span className="text-dk-muted text-xs w-12 text-right flex-shrink-0">{checkpointsDone}/6 ✓</span>
    </div>
  );
}

function ClassLeaderboard({ classId, cls, rankData, userName }) {
  if (!rankData) return null;
  const { list, userRank } = rankData;
  const total = list ? list.length : 0;

  return (
    <div className="mt-4">
      <div className="bg-dk-accent bg-opacity-10 border-l-4 border-dk-accent rounded p-3 mb-4">
        <p className="text-dk-accent text-sm font-semibold">
          You are ranked <span className="font-bold">#{userRank}</span> of {total} in {cls ? cls.code : classId}
        </p>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-1 pr-1">
        {(list || []).map((entry, i) => (
          <LeaderboardRow
            key={entry.name + i}
            rank={i + 1}
            name={entry.name}
            points={entry.pts}
            checkpointsDone={entry.checkpointsDone || 0}
            isCurrentUser={entry.name === userName}
          />
        ))}
      </div>
    </div>
  );
}

function SeasonSummaryCard({ assignedClasses, rankMap }) {
  if (!assignedClasses || assignedClasses.length === 0) return null;

  return (
    <div className="bg-dk-surface border border-dk-border rounded-xl p-4 mb-4">
      <h2 className="font-heading font-semibold text-dk-text text-sm mb-3">Season Standings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-max">
          <thead>
            <tr className="text-dk-muted font-medium border-b border-dk-border">
              <th className="text-left pb-2">Class</th>
              <th className="text-center pb-2">Rank</th>
              <th className="text-right pb-2">Points</th>
              <th className="text-right pb-2">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dk-border">
            {assignedClasses.map(cls => {
              const rd = rankMap[cls.id];
              const rank = rd ? rd.userRank : '—';
              const points = rd ? rd.userPoints : 0;
              const checkpoints = rd ? rd.userCheckpoints : 0;
              const rankBadge = typeof rank === 'number' && rank <= 3
                ? 'bg-yellow-400 text-white'
                : typeof rank === 'number' && rank <= 10
                  ? 'bg-dk-dim text-white'
                  : 'bg-dk-surface2 text-dk-muted';

              return (
                <tr key={cls.id} className="text-dk-text">
                  <td className="py-2 pr-2">
                    <span className="font-mono text-dk-text">{cls.code}</span>
                  </td>
                  <td className="py-2 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-2xs font-bold ${rankBadge}`}>
                      #{rank}
                    </span>
                  </td>
                  <td className="py-2 text-right font-mono">{points}</td>
                  <td className="py-2 text-right text-dk-muted">{checkpoints}/6 ✓</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaderboardPage({ user, progress, assignedClasses, onBack }) {
  const [activeClassId, setActiveClassId] = React.useState((assignedClasses && assignedClasses[0]) ? assignedClasses[0].id : null);
  const [rankMap, setRankMap] = React.useState({});

  React.useEffect(() => {
    if (assignedClasses && assignedClasses.length > 0) {
      setRankMap(buildLeaderboardData(assignedClasses, progress || {}, user));
    }
  }, [assignedClasses, progress, user]);

  const activeClass = (assignedClasses || []).find(c => c.id === activeClassId) || null;

  return (
    <div className="flex-1 min-w-0 overflow-y-auto px-6 pt-6 pb-20 bg-dk-base min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back</button>
          <h1 className="font-heading font-bold text-xl text-dk-text">Leaderboard</h1>
        </div>
        <SeasonSummaryCard assignedClasses={assignedClasses} rankMap={rankMap} />
        {assignedClasses && assignedClasses.length > 0 && (
          <>
            <div className="flex gap-2 flex-wrap mb-4">
              {assignedClasses.map(cls => (
                <button key={cls.id} onClick={() => setActiveClassId(cls.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${cls.id === activeClassId ? 'bg-dk-accent text-white' : 'bg-dk-surface2 text-dk-muted hover:bg-dk-hover hover:text-dk-text'}`}>
                  {cls.code}
                </button>
              ))}
            </div>
            <ClassLeaderboard classId={activeClassId} cls={activeClass} rankData={rankMap[activeClassId]} userName={user && user.name} />
          </>
        )}
      </div>
    </div>
  );
}

window.LeaderboardPage = LeaderboardPage;

/* ══════════════════════════════════════════════
   EXAMS PAGE
   ══════════════════════════════════════════════ */

function prepareExamData(assignedClasses) {
  if (!assignedClasses || !assignedClasses.length) return [];
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var result = [];
  assignedClasses.forEach(function(c) {
    if (!c.examDate) return;
    var parts = c.examDate.split('-');
    var target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
    if (isNaN(target.getTime())) return;
    var daysRemaining = Math.floor((target - today) / 86400000);
    var status = daysRemaining > 0 ? 'upcoming' : daysRemaining === 0 ? 'today' : 'passed';
    var formattedDate = target.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    result.push({ id: c.id, code: c.code, fullName: c.fullName, ects: c.ects, examDate: c.examDate, daysRemaining: daysRemaining, status: status, formattedDate: formattedDate, targetTime: target.getTime() });
  });
  result.sort(function(a, b) { return a.targetTime - b.targetTime; });
  return result;
}

function ExamsPage({ assignedClasses, onBack }) {
  const preparedExams = prepareExamData(assignedClasses);
  const nextExam = preparedExams.find(e => e.status !== 'passed') || null;

  return (
    <div className="flex-1 min-w-0 overflow-y-auto px-6 pt-6 pb-20 bg-dk-base min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back</button>
          <h1 className="font-heading font-bold text-xl text-dk-text">Exams</h1>
        </div>
        {nextExam ? (
          <div className="bg-dk-surface border border-dk-border rounded-xl p-6 text-center mb-6">
            <div className="text-6xl font-bold text-dk-accent leading-none mb-1">{nextExam.status === 'today' ? 'Today' : nextExam.daysRemaining}</div>
            {nextExam.status !== 'today' && <p className="text-dk-muted text-sm mb-2">days until</p>}
            <p className="text-dk-text font-medium mt-2"><span className="font-mono text-dk-accent">{nextExam.code}</span> — {nextExam.fullName}</p>
            <p className="text-dk-muted text-sm mt-1">{nextExam.formattedDate}</p>
          </div>
        ) : (
          <div className="bg-dk-surface border border-dk-border rounded-xl p-6 text-center mb-6">
            <div className="text-5xl text-dk-accent mb-2">✓</div>
            <p className="text-dk-text font-medium">All exams complete</p>
          </div>
        )}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-6 border-l-2 border-dk-border" />
          {preparedExams.map(exam => (
             <div key={exam.id} className={`relative pl-10 pb-6 ${exam.status === 'passed' ? 'opacity-60' : ''}`}>
               <span className={`absolute left-[11px] top-3 w-3 h-3 rounded-full ${exam.status === 'today' ? 'bg-yellow-400' : exam.status === 'upcoming' ? 'bg-dk-accent' : 'bg-dk-border'}`} />
               <div className="bg-dk-surface border border-dk-border rounded-xl p-4 flex items-start justify-between gap-4">
                 <div className="min-w-0">
                   <span className="text-xs font-mono bg-dk-surface2 px-2 py-1 rounded text-dk-text">{exam.code}</span>
                   <p className="text-dk-muted text-sm mt-1.5 truncate">{exam.fullName}</p>
                 </div>
                 <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                   <span className="text-dk-muted text-xs">{exam.formattedDate}</span>
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${exam.status === 'today' ? 'bg-yellow-500/20 text-yellow-400' : exam.status === 'upcoming' ? 'bg-dk-accent/15 text-dk-accent' : 'bg-dk-surface2 text-dk-muted'}`}>{exam.status === 'today' ? 'Today' : exam.status === 'upcoming' ? 'In ' + exam.daysRemaining + 'd' : 'Passed'}</span>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.ExamsPage = ExamsPage;

/* ══════════════════════════════════════════════
   SEASON PAGE
   ══════════════════════════════════════════════ */

function SeasonPage({ user, classes, progress, onBack, onStartCheckpoint, onStartCatchup }) {
  const week = getCurrentSeasonWeek();
  const safeClasses = classes || [];
  const safeProgress = progress || {};

  return (
    <div className="flex-1 min-w-0 overflow-y-auto px-6 pt-6 pb-20 bg-dk-base min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back</button>
          <h1 className="font-heading font-bold text-xl text-dk-text">Season Overview</h1>
          <span className="font-mono text-xs bg-dk-surface2 border border-dk-border text-coral px-2.5 py-1 rounded-lg">{`W${week}`}</span>
          <span className="text-xs bg-dk-hover border border-dk-border text-dk-muted px-2.5 py-1 rounded-full font-mono">Week {week} of 16</span>
        </div>

        <div className="bg-dk-surface border border-dk-border rounded-xl p-4 mb-6">
          <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest mb-3">Timeline</p>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(w => (
              <div key={w} className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono border ${w === week ? 'bg-coral border-coral text-dk-base font-bold' : w < week ? 'bg-dk-hover border-dk-border text-dk-muted' : 'border-dk-border text-dk-muted/40'}`}>
                {w}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {safeClasses.map(cls => {
            const progressData = safeProgress[cls.id];
            const cps = (progressData && progressData.checkpoints && progressData.checkpoints.length > 0)
              ? progressData.checkpoints
              : (cls.checkpoints || []);
            const totalPoints = (progressData && progressData.totalPoints != null)
              ? progressData.totalPoints
              : (cls.totalPoints || 0);
            const done = cps.filter(c => getCheckpointStatus(c) === 'done' || getCheckpointStatus(c) === 'weak').length;
            return (
              <div key={cls.id} className="bg-dk-surface border border-dk-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-bold text-coral">{cls.code}</span>
                  <span className="text-2xs font-mono text-dk-muted">{done}/{cps.length} Points: {totalPoints}</span>
                </div>
                <div className="flex items-center gap-1">
                  {cps.map((cp, j) => {
                    const s = getCheckpointStatus(cp);
                    const isClickable = s === 'available' || s === 'weak';
                    const handleClick = isClickable
                      ? () => {
                          if (s === 'available' && typeof onStartCheckpoint === 'function') {
                            onStartCheckpoint(cls.id, cp.id);
                          } else if (s === 'weak' && typeof onStartCatchup === 'function') {
                            onStartCatchup(cls.id, cp.id);
                          }
                        }
                      : undefined;
                    return (
                      <div
                        key={j}
                        onClick={handleClick}
                        className={`flex-1 h-2 rounded-full ${s==='done'?'bg-mint':s==='weak'?'bg-yellow-400':s==='available'?'bg-coral/40':'bg-dk-border'} ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.SeasonPage = SeasonPage;

/* ══════════════════════════════════════════════
   PROFILE / SETTINGS PAGE
   ══════════════════════════════════════════════ */

function ProfilePage({ user, profileTab, onSave, onApiKeySave, onApiKeyRemove, onClearData, onBack }) {
  const [activeTab, setActiveTab] = React.useState(profileTab || 'profile');
  const [name, setName] = React.useState((user && user.name) || '');
  const [department, setDepartment] = React.useState((user && user.department) || '');
  const [key, setKey] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (typeof loadApiKey === 'function') setKey(loadApiKey() || '');
  }, []);

  const handleSave = () => {
    onSave({ name, department });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto px-6 pt-6 pb-20 bg-dk-base min-h-screen">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back</button>
          <h1 className="font-heading font-bold text-xl text-dk-text">Profile & Settings</h1>
        </div>

        <div className="flex gap-2 mb-6">
          {['profile', 'settings'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === t ? 'bg-dk-accent text-white' : 'bg-dk-surface2 text-dk-muted hover:text-dk-text'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-dk-surface border border-dk-border rounded-2xl p-6">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-dk-muted text-xs font-medium mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dk-base border border-dk-border rounded-xl px-4 py-2.5 text-dk-text focus:border-coral focus:ring-1 focus:ring-coral focus:outline-none" />
              </div>
              <div>
                <label className="block text-dk-muted text-xs font-medium mb-1.5">Department</label>
                <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-dk-base border border-dk-border rounded-xl px-4 py-2.5 text-dk-text focus:border-coral focus:ring-1 focus:ring-coral focus:outline-none" />
              </div>
              <button onClick={handleSave} className="bg-dk-accent text-white px-5 py-2.5 rounded-xl text-sm font-bold">{saved ? 'Saved ✓' : 'Save Changes'}</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-dk-muted text-xs font-medium mb-1.5">Claude API Key</label>
                <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="sk-ant-..." className="w-full bg-dk-base border border-dk-border rounded-xl px-4 py-2.5 text-dk-text" />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => onApiKeySave(key)} className="bg-dk-accent text-white px-4 py-2 rounded-xl text-sm font-bold">Save Key</button>
                  <button onClick={() => { onApiKeyRemove(); setKey(''); }} className="text-dk-muted text-sm px-4 py-2">Remove</button>
                </div>
              </div>
              <div className="pt-6 border-t border-dk-border">
                <button onClick={onClearData} className="text-dk-danger border border-dk-danger px-4 py-2 rounded-xl text-sm font-bold">Clear All Data</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.ProfilePage = ProfilePage;

/* ══════════════════════════════════════════════
   CLASS DETAIL PAGE
   ══════════════════════════════════════════════ */

function ClassDetailPage({ cls, onBack, onStartCheckpoint, onStartCatchup, onStudy }) {
  if (!cls) return null;

  const points = cls.totalPoints !== undefined ? cls.totalPoints : calcPts(cls.userScore, cls.ects);
  const percnt = cls.enrolled > 0 ? calcPct(cls.userRank, cls.enrolled) : 0;

  const done = cls.checkpoints.filter(c => {
    const s = c.unlockDate !== undefined ? getCheckpointStatus(c) : c.status;
    return s === 'done' || s === 'weak';
  }).length;
  const progress = Math.round((done / cls.checkpoints.length) * 100);

  const completed = cls.checkpoints.filter(c => c.score !== null);
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, c) => s + c.score, 0) / completed.length)
    : null;

  const nextAvailable = cls.checkpoints.find(c => {
    const s = c.unlockDate !== undefined ? getCheckpointStatus(c) : c.status;
    return s === 'available';
  });

  const firstDate = cls.checkpoints[0] && cls.checkpoints[0].unlockDate
    ? fmtDate(cls.checkpoints[0].unlockDate)
    : (cls.checkpoints[0] && cls.checkpoints[0].date) || '—';
  const lastCp = cls.checkpoints[cls.checkpoints.length - 1];
  const lastDate = lastCp && lastCp.unlockDate
    ? fmtDate(lastCp.unlockDate)
    : (lastCp && lastCp.date) || '—';

  const userName = 'You';
  const lb = typeof generateLeaderboard === 'function'
    ? generateLeaderboard(cls.id, points, userName, done)
    : null;

  const stats = [
    { label: 'Rank', val: cls.enrolled > 0 ? `#${cls.userRank}/${cls.enrolled}` : '—', color: 'text-dk-text' },
    { label: 'Points', val: points, color: 'text-coral' },
    { label: 'Top', val: cls.enrolled > 0 ? `${percnt}%` : '—', color: percnt <= 10 ? 'text-mint' : percnt <= 25 ? 'text-lavender' : 'text-dk-dim' },
    { label: 'Avg Score', val: avgScore ? `${avgScore}%` : '—', color: 'text-dk-dim' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <button onClick={onBack} className="flex items-center gap-1.5 text-dk-muted text-xs hover:text-coral transition-colors mb-5">
        <span>←</span><span>Classes</span>
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-lg font-bold text-coral">{cls.code}</span>
          {cls.hasCatchup && <Tag variant="yellow">Catch-up</Tag>}
        </div>
        <h1 className="text-dk-text font-heading font-bold text-xl mb-2">{cls.fullName}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-dk-muted bg-dk-hover border border-dk-border px-2.5 py-1 rounded-lg">{cls.ects} ECTS</span>
          <span className="font-mono text-xs text-dk-muted bg-dk-hover border border-dk-border px-2.5 py-1 rounded-lg">{cls.enrolled} enrolled</span>
          <span className={`font-mono text-xs px-2.5 py-1 rounded-lg border ${percnt <= 10 ? 'text-mint border-mint/30 bg-mint/10' : 'text-dk-muted border-dk-border bg-dk-hover'}`}>top {percnt}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-dk-card border border-dk-border rounded-xl p-3 flex flex-col gap-1">
            <span className="text-2xs font-medium text-dk-muted uppercase tracking-wider">{s.label}</span>
            <span className={`font-mono font-bold text-lg ${s.color}`}>{s.val}</span>
          </div>
        ))}
      </div>

      <div className="bg-dk-card border border-dk-border rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-dk-text">Checkpoints</span>
          <span className="text-2xs font-mono text-dk-muted">{done}/{cls.checkpoints.length} done</span>
        </div>
        <div className="flex items-center gap-0 mb-2">
          {cls.checkpoints.map((cp, i) => (
            <div key={i} className="flex items-center flex-1 gap-0">
              <CheckpointDot
                cp={cp} index={i}
                onStart={onStartCheckpoint ? (cpId) => onStartCheckpoint(cls.id, cpId) : null}
              />
              {i < cls.checkpoints.length - 1 && (
                <div className={`flex-1 h-px mx-0.5 ${
                  (getCheckpointStatus(cp) === 'done' || getCheckpointStatus(cp) === 'weak')
                    ? 'bg-dk-line' : 'bg-dk-border'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-2xs font-mono text-dk-muted">{firstDate}</span>
          <span className="text-2xs font-mono text-dk-muted">{lastDate}</span>
        </div>
        <div className="h-1.5 bg-dk-hover rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-mint" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {nextAvailable && (
          <button
            onClick={() => onStartCheckpoint && onStartCheckpoint(cls.id, nextAvailable.id)}
            className="w-full py-3 rounded-xl bg-coral text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Start Next Checkpoint →
          </button>
        )}
        {cls.hasCatchup && (
          <button
            onClick={() => onStartCatchup && onStartCatchup(cls.id)}
            className="w-full py-3 rounded-xl border border-yellow-400/50 text-yellow-400 font-semibold text-sm hover:bg-yellow-400/10 transition-colors"
          >
            Catch-up Topics
          </button>
        )}
        <button
          onClick={() => onStudy && onStudy(cls.id)}
          className="w-full py-3 rounded-xl border border-dk-border text-dk-muted font-semibold text-sm hover:border-coral hover:text-coral transition-colors"
        >
          Study This Class →
        </button>
      </div>

      {lb && (
        <div className="bg-dk-card border border-dk-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-dk-border">
            <span className="text-sm font-semibold text-dk-text">Class Leaderboard</span>
          </div>
          <div className="divide-y divide-dk-border">
            {lb.top5.map(entry => (
              <div key={entry.name} className={`flex items-center gap-3 px-5 py-3 ${entry.isUser ? 'bg-coral/5' : ''}`}>
                <span className="w-6 font-mono text-xs text-dk-muted text-center">{entry.rank}</span>
                <span className="flex-1 text-sm text-dk-text truncate">{entry.name}</span>
                <span className="font-mono text-xs text-coral font-semibold">{entry.pts}pts</span>
              </div>
            ))}
            {lb.userRank > 5 && (
              <>
                <div className="px-5 py-2 text-center text-dk-muted text-2xs font-mono">· · · {lb.userRank - 6} more · · ·</div>
                <div className="flex items-center gap-3 px-5 py-3 bg-coral/5">
                  <span className="w-6 font-mono text-xs text-coral text-center font-bold">{lb.userRank}</span>
                  <span className="flex-1 text-sm text-coral font-semibold truncate">You</span>
                  <span className="font-mono text-xs text-coral font-semibold">{points}pts</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
