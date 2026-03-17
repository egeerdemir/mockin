/* dashboard.js — MockIn Dashboard Components (text/babel) */
const { useState: _us } = React;

/* ── Utils ── */
const statusStyle = s => (({
  done:      { dot:'bg-mint',                              icon:'✓', ic:'text-dk-base'  },
  weak:      { dot:'bg-yellow-400',                        icon:'!', ic:'text-dk-base'  },
  missed:    { dot:'bg-dk-border',                         icon:'–', ic:'text-dk-muted' },
  upcoming:  { dot:'border border-dk-line bg-transparent', icon:'',  ic:''              },
  available: { dot:'border-2 border-coral bg-dk-hover',    icon:'▶', ic:'text-coral'    },
  locked:    { dot:'border border-dk-border bg-dk-base',   icon:'',  ic:''              },
})[s] ?? { dot:'bg-dk-border', icon:'', ic:'' });

const statusLabel = s => ({
  done:'Completed', weak:'Needs review', missed:'Missed',
  upcoming:'Upcoming', available:'Ready to start', locked:'Locked',
}[s] ?? '');

const calcPct = (rank, total) => Math.round((rank / total) * 100);
const calcPts = (score, ects) => score * ects;

/* ── Study Streak ── */
function getStudyStreak() {
  try {
    const raw = localStorage.getItem('mockin_study_dates');
    const dates = raw ? JSON.parse(raw) : [];
    if (!dates.length) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let check = new Date(today);
    while (true) {
      const iso = check.toISOString().slice(0, 10);
      if (dates.includes(iso)) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  } catch (e) {
    return 0;
  }
}

function recordStudyDay() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem('mockin_study_dates');
    const dates = raw ? JSON.parse(raw) : [];
    if (!dates.includes(today)) {
      dates.push(today);
      localStorage.setItem('mockin_study_dates', JSON.stringify(dates));
    }
  } catch (e) {}
}

/* ── Avatar ── */
function Avatar({ initials, color='bg-coral', size='md' }) {
  const sz = { xs:'w-6 h-6 text-2xs', sm:'w-7 h-7 text-xs', md:'w-8 h-8 text-xs', lg:'w-10 h-10 text-sm' }[size];
  return <span className={`${sz} ${color} rounded-full flex items-center justify-center font-heading font-bold text-dk-base flex-shrink-0 select-none`}>{initials}</span>;
}

/* ── Tag ── */
function Tag({ children, variant='default' }) {
  const v = { default:'bg-dk-hover text-dk-muted border border-dk-border', coral:'bg-coral text-dk-base', mint:'bg-mint bg-opacity-20 text-mint', lavender:'bg-lavender bg-opacity-15 text-lavender', yellow:'bg-yellow-400 bg-opacity-15 text-yellow-400' }[variant] ?? 'bg-dk-hover text-dk-muted border border-dk-border';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-medium font-mono uppercase tracking-wider select-none ${v}`}>{children}</span>;
}

function Divider() { return <div className="h-px bg-dk-border my-1" />; }

/* ── CheckpointDot ── */
function CheckpointDot({ cp, index, onStart }) {
  const [hovered, setHovered] = _us(false);
  const [tapped, setTapped] = _us(false);
  const tapTimerRef = React.useRef(null);
  /* Support both new schema (unlockDate) and legacy demo schema (status string) */
  const status = cp.unlockDate !== undefined ? getCheckpointStatus(cp) : (cp.status || 'upcoming');
  const { dot, icon, ic } = statusStyle(status);
  const labelColor = {
    done:'text-mint', weak:'text-yellow-400', missed:'text-dk-muted',
    upcoming:'text-dk-dim', available:'text-coral', locked:'text-dk-muted',
  }[status] ?? 'text-dk-dim';
  const dateStr = cp.unlockDate ? fmtDate(cp.unlockDate) : (cp.date || '—');
  const isAvailable = status === 'available';
  const show = hovered || tapped;

  React.useEffect(() => {
    return () => { if (tapTimerRef.current) clearTimeout(tapTimerRef.current); };
  }, []);

  const handleTap = (e) => {
    if (isAvailable && onStart) { onStart(cp.id); return; }
    e.stopPropagation();
    if (tapped) { setTapped(false); clearTimeout(tapTimerRef.current); return; }
    setTapped(true);
    tapTimerRef.current = setTimeout(() => setTapped(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        onClick={handleTap}
        className={`w-7 h-7 rounded-full ${dot} flex items-center justify-center transition-transform duration-150 hover:scale-110 select-none ${isAvailable ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {icon
          ? <span className={`text-xs font-bold ${ic}`}>{icon}</span>
          : status === 'locked'
            ? <span className="text-2xs leading-none">🔒</span>
            : <span className="text-2xs font-mono text-dk-muted">{index + 1}</span>
        }
      </div>
      {show && (
        <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 z-50 animate-scale-in pointer-events-none">
          <div className="bg-dk-raised border border-dk-line rounded-xl shadow-pop px-3.5 py-2.5 min-w-max">
            <span className="font-mono text-2xs text-dk-muted block">{dateStr}</span>
            <span className={`text-xs font-semibold ${labelColor}`}>{statusLabel(status)}</span>
            {cp.score !== null && <span className="font-mono text-xs text-dk-text font-medium block">{cp.score} / 100</span>}
            {cp.points > 0 && <span className="font-mono text-xs text-coral block">{cp.points} pts</span>}
            {isAvailable && <span className="text-2xs text-coral font-medium block mt-0.5">← click to start</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ClassCard ── */
function ClassCard({ cls, onViewClass }) {
  const points = cls.totalPoints !== undefined ? cls.totalPoints : calcPts(cls.userScore, cls.ects);
  const percnt = cls.enrolled > 0 ? calcPct(cls.userRank, cls.enrolled) : 0;
  const done = cls.checkpoints.filter(c => {
    const s = c.unlockDate !== undefined ? getCheckpointStatus(c) : c.status;
    return s === 'done' || s === 'weak';
  }).length;
  const progress = Math.round((done / cls.checkpoints.length) * 100);

  return (
    <div
      onClick={() => onViewClass && onViewClass(cls.id)}
      className="bg-dk-card border border-dk-border rounded-2xl p-4 shadow-card hover:border-coral transition-all duration-200 cursor-pointer flex flex-col gap-3 h-36"
    >
      {/* Top row: code + ECTS */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="font-mono text-xs font-bold text-coral tracking-wide block">{cls.code}</span>
          {cls.hasCatchup && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block mt-1" title="Catch-up available" />}
        </div>
        <span className="flex-shrink-0 font-mono text-2xs text-dk-muted bg-dk-hover border border-dk-border px-2 py-0.5 rounded-md">{cls.ects} ECTS</span>
      </div>

      {/* Class name — grows to fill space */}
      <p className="text-dk-text text-xs font-medium leading-snug flex-1">{cls.fullName}</p>

      {/* Progress bar */}
      <div>
        <div className="h-1 bg-dk-hover rounded-full overflow-hidden mb-1.5">
          <div className="h-full rounded-full bg-mint" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xs font-mono text-dk-muted">{done}/{cls.checkpoints.length} CPs</span>
          <span className="text-2xs font-mono text-coral font-semibold">{points}pts</span>
        </div>
      </div>
    </div>
  );
}

/* ── SeasonOverview ── */
function SeasonOverview({ classes }) {
  const totalPts  = classes.reduce((s, c) => s + (c.totalPoints !== undefined ? c.totalPoints : calcPts(c.userScore, c.ects)), 0);
  const totalEcts = classes.reduce((s, c) => s + c.ects, 0);
  const week      = getCurrentSeasonWeek();
  const weekPct   = Math.round((week / SEASON.totalWeeks) * 100);
  return (
    <div className="bg-dk-card border border-dk-border rounded-2xl p-5 shadow-card mb-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-dk-muted text-2xs uppercase tracking-widest font-medium mb-1">Current Season</p>
          <h2 className="font-heading font-bold text-dk-text text-lg leading-none">{SEASON.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          {[
            { label:'Total Points', val:totalPts.toLocaleString(), color:'text-coral' },
            { label:'ECTS Load',    val:totalEcts,                 color:'text-dk-text' },
            { label:'Week',         val:<>{week}<span className="text-dk-muted font-normal text-xs">/{SEASON.totalWeeks}</span></>, color:'text-dk-text' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <div className="text-right">
                <p className="text-dk-muted text-2xs mb-0.5">{s.label}</p>
                <p className={`font-mono font-bold text-lg leading-none ${s.color}`}>{s.val}</p>
              </div>
              {i < arr.length-1 && <div className="h-8 w-px bg-dk-border" />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="mb-1">
        <div className="flex justify-between text-2xs font-mono text-dk-muted mb-1.5">
          <span>Season start</span><span>{weekPct}% complete</span><span>Finals</span>
        </div>
        <div className="h-1.5 bg-dk-hover rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-coral to-lavender" style={{ width:`${weekPct}%` }} />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {classes.map(cls => {
          const clsDone = cls.checkpoints.filter(c => {
            const s = c.unlockDate !== undefined ? getCheckpointStatus(c) : c.status;
            return s === 'done' || s === 'weak';
          }).length;
          const cpPct = cls.checkpoints.length ? Math.round((clsDone / cls.checkpoints.length) * 100) : 0;
          const pts = cls.totalPoints !== undefined ? cls.totalPoints : calcPts(cls.userScore, cls.ects);
          return (
            <div key={cls.id} className="flex items-center gap-3">
              <span className="font-mono text-2xs text-coral w-24 flex-shrink-0 truncate">{cls.code}</span>
              <div className="flex-1 h-1.5 bg-dk-hover rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-mint" style={{ width:`${cpPct}%` }} />
              </div>
              <span className="font-mono text-2xs text-dk-muted w-8 text-right">{cpPct}%</span>
              <span className="font-mono text-xs font-semibold text-coral w-12 text-right">{pts}</span>
              <span className="text-dk-muted text-2xs">pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── FullLeaderboardModal ── */
function FullLeaderboardModal({ lb, user, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dk-card border border-dk-border rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-pop" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-dk-border flex-shrink-0">
          <div>
            <h2 className="font-heading font-bold text-dk-text text-base">Full Leaderboard</h2>
            <p className="text-dk-muted text-xs mt-0.5">{lb.total} students enrolled</p>
          </div>
          <button onClick={onClose} className="text-dk-muted hover:text-dk-text text-xl leading-none px-2 py-1 hover:bg-dk-hover rounded-lg transition-colors">×</button>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-[2.5rem_1fr_4rem_3rem] px-4 py-2.5 border-b border-dk-border sticky top-0 bg-dk-card z-10">
            {['#','Student','Pts','Δ'].map(h => (
              <span key={h} className="text-dk-muted font-medium text-2xs uppercase tracking-wider first:text-center last:text-right">{h}</span>
            ))}
          </div>
          {lb.all.map(s => {
            const isUser = s.isUser;
            const deltaColor = s.delta > 0 ? 'text-mint' : s.delta < 0 ? 'text-coral' : 'text-dk-muted';
            const deltaStr = s.delta > 0 ? `+${s.delta}` : s.delta < 0 ? `${s.delta}` : '—';
            return (
              <div key={s.rank} className={`grid grid-cols-[2.5rem_1fr_4rem_3rem] px-4 py-2.5 border-b border-dk-border items-center hover:bg-dk-hover transition-colors cursor-default ${isUser ? 'border-l-2 border-l-coral bg-dk-raised' : ''}`}>
                <span className={`text-center font-mono text-xs font-bold ${s.rank===1?'text-yellow-400':s.rank===2?'text-dk-dim':s.rank===3?'text-yellow-700':isUser?'text-coral':'text-dk-muted'}`}>{s.rank}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar initials={s.initials} color={s.color} size="xs" />
                  <span className={`text-xs font-medium truncate ${isUser ? 'text-coral font-semibold' : 'text-dk-text'}`}>{s.name}</span>
                </div>
                <span className={`text-right font-mono text-xs font-semibold ${isUser ? 'text-coral' : 'text-dk-dim'}`}>{s.pts}</span>
                <span className={`text-right font-mono text-xs font-bold ${deltaColor}`}>{deltaStr}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Leaderboard ── */
function Leaderboard({ cls, user }) {
  if (!cls) return null;
  const [showModal, setShowModal] = _us(false);
  const completedCount = cls.checkpoints
    ? cls.checkpoints.filter(c => {
        const s = c.unlockDate !== undefined ? getCheckpointStatus(c) : c.status;
        return s === 'done' || s === 'weak';
      }).length
    : 0;
  const userTotalPts = cls.totalPoints !== undefined ? cls.totalPoints : calcPts(cls.userScore, cls.ects);
  const lb     = generateLeaderboard(cls.id, userTotalPts, user && user.name, completedCount);
  const topPct = Math.round((lb.userRank / lb.total) * 100);
  const topTag = topPct <= 10 ? 'mint' : topPct <= 25 ? 'lavender' : 'coral';
  const DeltaBadge = ({ delta }) => {
    if (delta > 0) return <span className="text-right font-mono text-xs font-bold text-mint">+{delta}</span>;
    if (delta < 0) return <span className="text-right font-mono text-xs font-bold text-coral">{delta}</span>;
    return <span className="text-right font-mono text-xs text-dk-muted">—</span>;
  };

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-heading font-bold text-dk-text text-base">{cls.code} — Leaderboard</h2>
          <p className="text-dk-muted text-xs mt-0.5">{lb.total} students enrolled</p>
        </div>
        <button onClick={() => setShowModal(true)} className="text-coral text-xs font-medium hover:underline">View all →</button>
      </div>
      <div className="bg-dk-card border border-dk-border rounded-2xl overflow-hidden shadow-card">
        <div className="grid grid-cols-[2.5rem_1fr_4rem_3.5rem_3rem] px-4 py-2.5 border-b border-dk-border">
          {['#','Student','Points','Top %','Δ'].map(h => (
            <span key={h} className="text-dk-muted font-medium text-2xs uppercase tracking-wider first:text-center last:text-right">{h}</span>
          ))}
        </div>
        {lb.top5.map((s, i) => (
          <div key={s.rank} className={`grid grid-cols-[2.5rem_1fr_4rem_3.5rem_3rem] px-4 py-3 border-b border-dk-border items-center hover:bg-dk-hover transition-colors cursor-default ${i===0?'bg-dk-hover':''}`}>
            <span className={`text-center font-mono text-sm font-bold ${s.rank===1?'text-yellow-400':s.rank===2?'text-dk-dim':s.rank===3?'text-yellow-700':'text-dk-muted'}`}>{s.rank}</span>
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar initials={s.initials} color={s.color} size="sm" />
              <span className="text-dk-text text-sm font-medium truncate">{s.name}</span>
            </div>
            <span className="text-right font-mono font-semibold text-coral text-sm">{s.pts}</span>
            <span className="text-right text-dk-muted font-mono text-xs">Top {Math.round((s.rank / lb.total) * 100)}%</span>
            <DeltaBadge delta={s.delta} />
          </div>
        ))}
        {lb.userRank > 5 && (
          <div className="flex items-center gap-3 px-4 py-1.5 bg-dk-hover border-b border-dk-border">
            <div className="h-px flex-1 border-t border-dashed border-dk-line" />
            <span className="text-dk-muted text-2xs font-mono">· · · {lb.userRank - 6} more · · ·</span>
            <div className="h-px flex-1 border-t border-dashed border-dk-line" />
          </div>
        )}
        <div className="grid grid-cols-[2.5rem_1fr_4rem_3.5rem_3rem] px-4 py-3 items-center bg-dk-raised border-t-2 border-coral">
          <span className="text-center font-mono text-sm font-bold text-coral">{lb.userRank}</span>
          <div className="flex items-center gap-2.5">
            <Avatar initials={lb.userEntry.initials} color="bg-coral" size="sm" />
            <span className="text-dk-text text-sm font-medium">
              You{user && user.name ? <span className="text-dk-muted text-2xs"> ({user.name.split(' ')[0]})</span> : ''}
            </span>
          </div>
          <span className="text-right font-mono font-semibold text-coral text-sm">{lb.userEntry.pts}</span>
          <span className="text-right"><Tag variant={topTag}>Top {topPct}%</Tag></span>
          <DeltaBadge delta={lb.userEntry.delta} />
        </div>
      </div>
      {showModal && <FullLeaderboardModal lb={lb} user={user} onClose={() => setShowModal(false)} />}
    </section>
  );
}

/* ── AchievementsCard ── */
function AchievementsCard({ earned }) {
  const earnedSet = new Set(earned || []);
  const earnedCount = ACHIEVEMENTS.filter(a => earnedSet.has(a.id)).length;

  return (
    <section id="achievements-card" className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading font-bold text-dk-text text-base">Achievements</h2>
        <span className="text-dk-muted text-xs font-mono">{earnedCount} / {ACHIEVEMENTS.length} earned</span>
      </div>
      <div className="bg-dk-card border border-dk-border rounded-2xl p-4 shadow-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map(a => {
            const isEarned = earnedSet.has(a.id);
            return (
              <div key={a.id} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${isEarned ? '' : 'opacity-40'}`} title={a.desc}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold ${isEarned ? 'bg-coral text-dk-base' : 'bg-dk-hover text-dk-muted'}`}>
                  {a.icon}
                </div>
                <span className={`text-2xs font-medium text-center leading-tight ${isEarned ? 'text-dk-text' : 'text-dk-muted'}`}>{a.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Sidebar ── */
function Sidebar({ onNavClick, user, onLogout, onToggleTheme, currentTheme, activeItem }) {
  const [activeId, setActiveId] = _us('dashboard');
  const resolvedActiveId = activeItem !== undefined ? activeItem : activeId;
  const handleClick = (id) => { setActiveId(id); if (onNavClick) onNavClick(id); };
  const name     = (user && user.name)  || 'You';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'EG';
  const dept     = (user && user.department) || 'RWTH Aachen';
  return (
    <aside className="w-56 bg-dk-card border-r border-dk-border flex flex-col h-screen sticky top-0 flex-shrink-0">
      <div className="px-5 pt-6 pb-5 border-b border-dk-border">
        <h1 className="font-heading font-black text-[1.6rem] leading-none tracking-tight text-dk-text">Mock<span className="text-coral">In</span></h1>
        <p className="text-dk-muted text-2xs mt-1 font-mono">{SEASON.name}</p>
      </div>
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = item.id === 'dashboard';
          const isProfile = item.id === 'profile';
          const isSettings = item.id === 'settings';
          const isLeaderboard = item.id === 'leaderboard';
          const isExams = item.id === 'exams';
          const isSeason = item.id === 'season';
          const isAchievements = item.id === 'achievements';
          const isComingSoon = !isActive && !isProfile && !isSettings && !isLeaderboard && !isExams && !isSeason && !isAchievements;
          const handleItemClick = isActive
            ? () => handleClick(item.id)
            : isProfile
              ? () => onNavClick('user-profile', 'profile')
              : isSettings
                ? () => onNavClick('user-profile', 'settings')
                : isLeaderboard
                  ? () => onNavClick && onNavClick('leaderboard')
                  : isExams
                    ? () => onNavClick && onNavClick('exams')
                    : isSeason
                      ? () => onNavClick && onNavClick('season')
                      : isAchievements
                        ? () => onNavClick && onNavClick('achievements')
                        : undefined;
          return (
            <div key={item.id} className="relative group">
              <button
                id={`nav-${item.id}`}
                onClick={handleItemClick}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                  resolvedActiveId === item.id
                    ? 'bg-coral text-dk-base shadow-glow font-semibold'
                    : isComingSoon
                      ? 'text-dk-border cursor-default opacity-50'
                      : 'text-dk-muted hover:text-dk-text hover:bg-dk-hover'
                }`}
              >
                <span className="text-base leading-none w-4 flex-shrink-0 text-center">{item.icon}</span>
                {item.label}
                {isComingSoon && <span className="ml-auto text-2xs font-mono text-dk-border">Soon</span>}
              </button>
              {isComingSoon && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover:block pointer-events-none">
                  <div className="bg-dk-raised border border-dk-line rounded-lg shadow-pop px-2.5 py-1.5 whitespace-nowrap">
                    <span className="text-dk-muted text-2xs">Coming soon</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div className="pt-4 pb-1">
          <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest px-3 mb-1.5">Self Study</p>
          <Divider />
        </div>
        {SELF_STUDY_ITEMS.map(tool => (
          <button key={tool.id} id={`study-${tool.id}`} onClick={() => { setActiveId(tool.id); if (onNavClick) onNavClick(tool.id); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-dk-muted hover:text-dk-text hover:bg-dk-hover transition-all duration-150 text-left">
            <span className="text-base leading-none w-4 flex-shrink-0 text-center">{tool.icon}</span>{tool.label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-dk-border space-y-1">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-dk-hover transition-colors cursor-pointer">
          <Avatar initials={initials} color="bg-coral" size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-dk-text text-sm font-semibold leading-tight truncate">{name}</p>
            <p className="text-dk-muted text-2xs truncate">{dept}</p>
          </div>
        </div>
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-dk-muted text-2xs font-medium hover:text-dk-text hover:bg-dk-hover transition-colors"
          >
            <span className="text-sm leading-none">{currentTheme === 'dark' ? '☀' : '◑'}</span>
            {currentTheme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-1.5 rounded-lg text-dk-muted text-2xs font-medium hover:text-coral hover:bg-dk-hover transition-colors"
          >
            ↩ Sign out
          </button>
        )}
      </div>
    </aside>
  );
}

/* ── MainContent ── */
function MainContent({ onStartCheckpoint, classes, userName, user, earned, onStartCatchup, onViewClass }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-6 pt-6 pb-20">
      <div className="flex flex-col gap-3 mb-6">
        <div className="pt-2 lg:pt-0">
          <p className="text-dk-muted text-xs font-mono mb-0.5 uppercase tracking-widest">Dashboard</p>
          <h1 className="font-heading font-bold text-xl lg:text-2xl text-dk-text leading-tight">{greeting}, {userName || 'there'} 👋</h1>
          <p className="text-dk-muted text-xs mt-0.5">
            Week {getCurrentSeasonWeek()} of {SEASON.totalWeeks} · {classes.length} active classes
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-1">
          {(earned && earned.length > 0)
            ? earned.slice(0, 5).map(id => {
                const a = ACHIEVEMENTS.find(x => x.id === id);
                if (!a) return null;
                return (
                  <span key={id} title={a.name} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-dk-card border border-dk-border text-base hover:border-dk-line transition-colors cursor-default flex-shrink-0">
                    {a.icon || (a.name && a.name[0]) || '?'}
                  </span>
                );
              })
            : <span className="text-dk-muted text-xs font-mono">No badges yet</span>
          }
        </div>
      </div>
      <SeasonOverview classes={classes} />
      {/* Mobile-only upcoming exams compact block */}
      <div className="lg:hidden mb-5">
        <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest mb-2">Upcoming Exams</p>
        <div className="space-y-2">
          {((() => {
            const now = new Date();
            const upcomingReal = classes
              .filter(c => c.examDate)
              .map(c => {
                const d = new Date(c.examDate);
                const daysLeft = Math.ceil((d - now) / 86400000);
                const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                return { code: c.code, title: 'Final Exam', date, daysLeft };
              })
              .filter(e => e.daysLeft >= 0)
              .sort((a, b) => a.daysLeft - b.daysLeft);
            return upcomingReal.length > 0 ? upcomingReal : UPCOMING_EXAMS;
          })()).slice(0, 3).map((ex, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-dk-card border border-dk-border rounded-xl">
              <div className="min-w-0">
                <span className="font-mono text-2xs text-coral font-semibold">{ex.code}</span>
                <p className="text-dk-text text-xs font-medium truncate">{ex.title}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-mono text-xs font-bold text-dk-text">{ex.date}</p>
                <span className={`text-2xs font-mono ${ex.daysLeft<=5?'text-coral':'text-dk-muted'}`}>in {ex.daysLeft}d</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading font-semibold text-dk-text text-base">Active Classes</h2>
        <span className="text-2xs font-mono text-dk-muted bg-dk-card border border-dk-border px-2.5 py-1 rounded-lg">{classes.length} classes</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {classes.map(cls => <ClassCard key={cls.id} cls={cls} onViewClass={onViewClass} />)}
      </div>
      <Leaderboard cls={classes[0]} user={user} />
      <AchievementsCard earned={earned} />
    </main>
  );
}

/* ── RightPanel ── */
function RightPanel({ onStartExam, onStartCheckpoint, onStartCatchup, classes }) {
  const catchupClasses = classes.filter(c => c.hasCatchup);

  /* Derive upcoming exams from real class exam dates when available */
  const now = new Date();
  const upcomingReal = classes
    .filter(c => c.examDate)
    .map(c => {
      const d = new Date(c.examDate);
      const daysLeft = Math.ceil((d - now) / 86400000);
      const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      return { code: c.code, title: 'Final Exam', date, daysLeft, type: 'exam' };
    })
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  const examList = upcomingReal.length > 0 ? upcomingReal : UPCOMING_EXAMS;

  return (
    <aside className="hidden lg:flex w-72 border-l border-dk-border flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 bg-dk-base">
      <div className="px-5 pt-6 pb-3 border-b border-dk-border">
        <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest mb-0.5">Upcoming</p>
        <h2 className="font-heading font-bold text-dk-text text-base">Exams & Checkpoints</h2>
      </div>
      <div className="px-4 py-3 space-y-2">
        {examList.map((ex, i) => (
          <div key={i} onClick={() => i === 0 && onStartExam && onStartExam()}
            className={`group flex items-start justify-between gap-3 p-3.5 bg-dk-card border border-dk-border rounded-xl transition-all duration-200 ${i===0 ? 'hover:border-coral cursor-pointer' : 'cursor-default'}`}>
            <div className="min-w-0">
              <span className="font-mono text-2xs text-coral font-semibold block mb-0.5">{ex.code}</span>
              <p className="text-dk-text text-sm font-medium truncate">{ex.title}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Tag variant="default">{ex.type}</Tag>
                <span className={`text-2xs font-mono ${ex.daysLeft<=5?'text-coral':'text-dk-muted'}`}>in {ex.daysLeft}d</span>
                {i === 0 && <span className="text-2xs text-coral font-medium">· tap to start</span>}
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-mono text-xs font-bold text-dk-text">{ex.date}</p>
            </div>
          </div>
        ))}
      </div>
      <Divider />
      {catchupClasses.length > 0 && (
        <>
          <div className="px-5 pt-3 pb-2">
            <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest mb-0.5">Action Required</p>
            <h2 className="font-heading font-bold text-dk-text text-base">Catch-up</h2>
          </div>
          <div className="px-4 pb-3 space-y-2">
            {catchupClasses.map(cls => (
              <div key={cls.id} className="bg-dk-card border border-yellow-500 border-opacity-40 rounded-xl p-4">
                <div className="flex items-start gap-2.5 mb-3">
                  <span className="text-yellow-400 text-base flex-shrink-0 mt-0.5">⚠</span>
                  <div>
                    <p className="text-dk-text text-sm font-semibold leading-tight">Weak checkpoint</p>
                    <p className="text-dk-muted text-xs mt-0.5 font-mono">{cls.code}</p>
                  </div>
                </div>
                <p className="text-dk-dim text-xs leading-relaxed mb-3">Score below 70 — review recommended · 35 min</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(cls.catchupTopics || []).map(t => <span key={t} className="text-2xs bg-dk-hover border border-dk-border text-dk-muted px-2 py-0.5 rounded-full">{t}</span>)}
                </div>
                <button
                  onClick={() => onStartCatchup && cls.catchupCpId != null && onStartCatchup(cls.id, cls.catchupCpId)}
                  className="w-full text-xs bg-yellow-400 text-dk-base font-bold px-3 py-2 rounded-lg hover:bg-yellow-300 transition-colors">
                  Start Catch-up →
                </button>
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}
      <div className="px-5 pt-3 pb-2">
        <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest mb-0.5">This Season</p>
        <h2 className="font-heading font-bold text-dk-text text-base">Your Stats</h2>
      </div>
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        {[
          { label:'Study Streak', value:`${getStudyStreak()}d`, icon:'🔥', color:'text-coral' },
          { label:'Exams Done',   value: classes.reduce((s,c) => s + (c.checkpoints ? c.checkpoints.filter(p => p.completed).length : 0), 0).toString(), icon:'📝', color:'text-mint' },
          { label:'Avg Score',    value: (() => { const allScores = classes.flatMap(c => (c.checkpoints || []).filter(p => p.score !== null).map(p => p.score)); return allScores.length ? Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length)+'%' : '—'; })(), icon:'📊', color:'text-lavender' },
          { label:'Total Pts',    value: classes.reduce((s,c) => s + (c.totalPoints !== undefined ? c.totalPoints : calcPts(c.userScore,c.ects)), 0).toLocaleString(), icon:'⭐', color:'text-yellow-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-dk-card border border-dk-border rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{stat.icon}</span>
              <span className={`font-mono font-bold text-lg leading-none ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-dk-muted text-2xs">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="px-4 pb-5 mt-auto">
        <div className="bg-dk-card border border-dk-border rounded-xl p-4">
          <p className="text-dk-dim text-xs italic leading-relaxed">"Solid checkpoint. A few topics need tightening before the next exam."</p>
          <p className="text-dk-muted text-2xs mt-2 font-mono">— MockIn · after your last exam</p>
        </div>
      </div>
    </aside>
  );
}

/* ── StickyRankBar ── */
function StickyRankBar({ classes, user }) {
  const [showModal, setShowModal] = _us(false);
  const totalPts = classes.reduce((s, c) => s + (c.totalPoints !== undefined ? c.totalPoints : calcPts(c.userScore, c.ects)), 0);
  const name     = (user && user.name) || 'You';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'EG';
  /* Compute lb from the class where the user has the BEST (lowest) rank */
  const lbPerClass = classes.map(cls => {
    const completed = cls.checkpoints
      ? cls.checkpoints.filter(c => {
          const s = c.unlockDate !== undefined ? getCheckpointStatus(c) : c.status;
          return s === 'done' || s === 'weak';
        }).length
      : 0;
    const pts = cls.totalPoints !== undefined ? cls.totalPoints : calcPts(cls.userScore, cls.ects);
    return generateLeaderboard(cls.id, pts, user && user.name, completed);
  });
  const bestLb = lbPerClass.reduce((best, cur) => {
    if (!best) return cur;
    if (!cur || cur.userRank == null) return best;
    if (best.userRank == null) return cur;
    return cur.userRank < best.userRank ? cur : best;
  }, null);
  const lb     = bestLb || null;
  const rank   = lb ? lb.userRank : null;
  const total  = lb ? lb.total : null;
  const topPct = rank && total ? Math.round((rank / total) * 100) : null;
  const tagV   = topPct !== null ? (topPct <= 10 ? 'mint' : topPct <= 25 ? 'lavender' : 'coral') : 'default';
  return (
    <>
      <div id="sticky-rank-bar" className="fixed bottom-0 left-0 right-0 lg:left-56 lg:right-72 bg-dk-card border-t border-dk-border shadow-pop px-4 lg:px-6 py-2.5 flex items-center justify-between z-50">
        {/* Mobile layout */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <Avatar initials={initials} color="bg-coral" size="sm" />
          <span className="font-mono font-bold text-coral text-sm">{rank ? `#${rank}` : '—'}<span className="text-dk-muted font-normal text-xs">/{total}</span></span>
          <span className="text-dk-muted text-xs">·</span>
          <span className="text-xs font-medium text-dk-muted">top {topPct}%</span>
          <span className="text-dk-muted text-xs">·</span>
          <span className="font-mono text-sm font-bold text-dk-text">{totalPts}</span>
          <span className="text-dk-muted text-xs">pts</span>
        </div>
        <button onClick={() => lb && setShowModal(true)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-dk-hover border border-dk-border text-dk-text hover:border-coral hover:text-coral transition-all text-sm">↗</button>

        {/* Desktop layout */}
        <div className="hidden lg:flex items-center gap-4">
          <Avatar initials={initials} color="bg-coral" size="sm" />
          <div className="flex items-center gap-3">
            <div>
              <p className="text-dk-muted text-2xs leading-none mb-0.5">Overall Rank</p>
              {rank ? <p className="font-mono font-bold text-coral text-base leading-none">#{rank} <span className="text-dk-muted font-normal text-xs">/{total}</span></p> : <p className="font-mono font-bold text-dk-muted text-base leading-none">—</p>}
            </div>
            <div className="h-6 w-px bg-dk-border" />
            {topPct !== null ? <Tag variant={tagV}>Top {topPct}%</Tag> : <Tag variant="default">New</Tag>}
            <div className="h-6 w-px bg-dk-border" />
            <div>
              <p className="text-dk-muted text-2xs leading-none mb-0.5">Points</p>
              <p className="font-mono font-bold text-dk-text text-base leading-none">{totalPts.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-dk-muted text-xs font-mono">{SEASON.name}</span>
          <button id="full-leaderboard-btn" onClick={() => lb && setShowModal(true)} className="flex items-center gap-1.5 text-xs bg-dk-hover border border-dk-border text-dk-text px-3.5 py-2 rounded-xl hover:border-coral hover:text-coral transition-all duration-150 font-medium">Full Leaderboard →</button>
        </div>
      </div>
      {showModal && lb && <FullLeaderboardModal lb={lb} user={user} onClose={() => setShowModal(false)} />}
    </>
  );
}

/* ── Dashboard (wrapper) ── */
function Dashboard({ onStartExam, onStartCheckpoint, user, classes: classesProp, onLogout, earned, onNavClick, onStartCatchup, onToggleTheme, currentTheme, onViewClass }) {
  const classes = classesProp || CLASSES;
  React.useEffect(() => { recordStudyDay(); }, []);
  return (
    <div className="flex min-h-screen bg-dk-base font-sans text-dk-text antialiased">
      <div className="hidden">
        <Sidebar user={user} onLogout={onLogout} onNavClick={onNavClick} onToggleTheme={onToggleTheme} currentTheme={currentTheme} />
      </div>
      <MainContent onStartCheckpoint={onStartCheckpoint} classes={classes} userName={user && user.name} user={user} earned={earned} onStartCatchup={onStartCatchup} onViewClass={onViewClass} />
      <RightPanel onStartExam={onStartExam} onStartCheckpoint={onStartCheckpoint} onStartCatchup={onStartCatchup} classes={classes} />
      <StickyRankBar classes={classes} user={user} />
    </div>
  );
}
