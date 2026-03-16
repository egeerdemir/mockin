/* exam.js — MockIn Exam Engine + Results + App Root (text/babel) */
const { useState: useS, useEffect: useEf, useRef: useR, useMemo: uM } = React;

/* ── Calc Results ── */
function calcResults(answers, questions, config) {
  let correct = 0;
  const topicMap = {};
  questions.forEach(q => {
    const ok = answers[q.id] === q.correctAnswer;
    if (ok) correct++;
    if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 };
    topicMap[q.topic].total++;
    if (ok) topicMap[q.topic].correct++;
  });
  const score = Math.round((correct / questions.length) * 100);
  const topicResults = Object.entries(topicMap)
    .map(([topic, d]) => ({ topic, correct: d.correct, total: d.total, pct: Math.round((d.correct / d.total) * 100) }))
    .sort((a, b) => b.pct - a.pct);
  const percentile = score >= config.classAvg
    ? Math.min(99, Math.round(50 + ((score - config.classAvg) / (100 - config.classAvg)) * 49))
    : Math.max(1, Math.round((score / config.classAvg) * 50));
  const review = questions.map(q => ({ question: q, userAnswer: answers[q.id] ?? null, isCorrect: answers[q.id] === q.correctAnswer }));
  return { score, correct, total: questions.length, topicResults, classAvg: config.classAvg, percentile, review };
}

/* ── ExamTimer ── */
function ExamTimer({ timeLeft }) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const warn = timeLeft <= 300, crit = timeLeft <= 60;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-base ${crit ? 'border-coral bg-coral bg-opacity-10 text-coral animate-pulse' : warn ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-400' : 'border-dk-border bg-dk-hover text-dk-text'}`}>
      <span className="text-sm">⏱</span>{mins}:{secs}
    </div>
  );
}

/* ── ExamHeader ── */
function ExamHeader({ exam, currentQ, total, timeLeft, onExit }) {
  return (
    <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onExit} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 flex-shrink-0 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Exit</button>
        <div className="h-5 w-px bg-dk-border" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-coral font-semibold">{exam.classCode}</span>
            <span className="text-dk-muted text-xs">·</span>
            <span className="text-dk-muted text-xs">{exam.checkpoint}</span>
          </div>
          <p className="font-heading font-bold text-dk-text text-sm leading-tight truncate">{exam.title}</p>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 bg-dk-hover border border-dk-border rounded-xl px-4 py-1.5">
          <span className="text-dk-muted text-sm">Question</span>
          <span className="font-mono font-bold text-dk-text">{currentQ + 1}</span>
          <span className="text-dk-muted text-sm">of</span>
          <span className="font-mono text-dk-muted">{total}</span>
        </div>
      </div>
      <ExamTimer timeLeft={timeLeft} />
    </header>
  );
}

/* ── OptionButton ── */
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
function OptionButton({ option, letter, selected, onSelect }) {
  return (
    <button onClick={onSelect}
      className={`w-full flex items-start gap-4 px-5 py-4 rounded-xl border text-sm font-medium text-left transition-all duration-150 ${selected ? 'border-coral bg-coral bg-opacity-10 text-dk-text shadow-glow' : 'border-dk-border bg-dk-card hover:border-dk-line hover:bg-dk-hover text-dk-dim hover:text-dk-text'}`}>
      <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${selected ? 'border-coral bg-coral text-dk-base' : 'border-dk-line text-dk-muted'}`}>{letter}</span>
      <span className="pt-0.5 leading-relaxed">{option}</span>
    </button>
  );
}

/* ── ReviewFlagButton ── */
function ReviewFlagButton({ flagged, onToggle }) {
  return (
    <button onClick={onToggle}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all duration-150 ${flagged ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-400' : 'border-dk-border text-dk-muted hover:border-dk-line hover:text-dk-text'}`}>
      <span>{flagged ? '⚑' : '⚐'}</span>{flagged ? 'Flagged' : 'Flag for review'}
    </button>
  );
}

/* ── QuestionCard ── */
function QuestionCard({ question, currentAnswer, onAnswer, flagged, onFlag }) {
  const diffColor = { easy:'text-mint', medium:'text-lavender', hard:'text-coral' }[question.difficulty];
  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="bg-dk-hover border border-dk-border text-dk-muted text-xs px-2.5 py-1 rounded-lg font-medium">{question.topic}</span>
        <span className={`text-xs font-medium capitalize ${diffColor}`}>{question.difficulty}</span>
        <div className="ml-auto"><ReviewFlagButton flagged={flagged} onToggle={onFlag} /></div>
      </div>
      <div className="bg-dk-card border border-dk-border rounded-2xl p-6">
        <p className="text-dk-text text-base leading-relaxed font-medium">{question.text}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, i) => (
          <OptionButton key={i} option={opt} letter={LETTERS[i]} selected={currentAnswer === i} onSelect={() => onAnswer(i)} />
        ))}
      </div>
    </div>
  );
}

/* ── QuestionNavigator ── */
function QuestionNavigator({ questions, answers, flagged, currentQ, onJump }) {
  const answered = Object.keys(answers).length;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-2xs text-dk-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-mint inline-block" />Answered</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" />Flagged</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-dk-border inline-block" />Unanswered</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((q, idx) => {
          const isCur = idx === currentQ, isAns = answers[q.id] !== undefined, isFlg = flagged.has(q.id);
          const cls = isCur && isFlg ? 'bg-yellow-400 border-coral text-dk-base ring-2 ring-coral ring-offset-1 ring-offset-dk-base'
            : isCur && isAns  ? 'bg-mint border-coral text-dk-base ring-2 ring-coral ring-offset-1 ring-offset-dk-base'
            : isCur           ? 'border-2 border-coral text-coral bg-dk-hover'
            : isFlg           ? 'bg-yellow-400 border-yellow-500 text-dk-base'
            : isAns           ? 'bg-mint border-mint text-dk-base'
            : 'border-dk-border text-dk-muted hover:border-dk-line hover:text-dk-text bg-dk-hover';
          return (
            <button key={q.id} id={`qnav-${q.id}`} onClick={() => onJump(idx)}
              className={`h-9 rounded-lg text-xs font-mono font-semibold transition-all duration-100 border ${cls}`}>
              {idx + 1}
            </button>
          );
        })}
      </div>
      <div className="border-t border-dk-border pt-3 space-y-2">
        {[{ label:'Answered', val:`${answered}/${questions.length}`, color:'text-mint' }, { label:'Flagged', val:flagged.size, color:'text-yellow-400' }, { label:'Unanswered', val:questions.length-answered, color: questions.length-answered>0?'text-coral':'text-dk-muted' }].map(s => (
          <div key={s.label} className="flex justify-between text-xs">
            <span className="text-dk-muted">{s.label}</span>
            <span className={`font-mono font-medium ${s.color}`}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ExamFooterNav ── */
function ExamFooterNav({ currentQ, total, onPrev, onNext, onSubmit }) {
  const isLast = currentQ === total - 1, isFirst = currentQ === 0;
  return (
    <footer className="h-16 bg-dk-card border-t border-dk-border flex items-center px-6 gap-3 flex-shrink-0 sticky bottom-0 z-40">
      <button onClick={onPrev} disabled={isFirst}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dk-border text-sm font-medium text-dk-muted hover:text-dk-text hover:border-dk-line transition-all disabled:opacity-30 disabled:cursor-not-allowed">
        ← Previous
      </button>
      <div className="flex-1 flex justify-center items-center gap-1">
        {Array.from({ length: Math.min(total, 15) }, (_, i) => {
          const active = total > 1 ? Math.round((currentQ / (total - 1)) * 14) : 0;
          return <div key={i} className={`h-1.5 rounded-full transition-all duration-200 ${i < active ? 'bg-mint w-3' : i === active ? 'bg-coral w-4' : 'bg-dk-border w-2'}`} />;
        })}
      </div>
      {isLast
        ? <button onClick={onSubmit} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-coral text-dk-base text-sm font-bold hover:opacity-90 transition-opacity shadow-glow">Submit Exam →</button>
        : <button onClick={onNext} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dk-hover border border-dk-line text-dk-text text-sm font-medium hover:border-coral hover:text-coral transition-all">Next →</button>
      }
    </footer>
  );
}

/* ── SubmitConfirmModal ── */
function SubmitConfirmModal({ answers, flaggedCount, total, onConfirm, onCancel }) {
  const answeredCount = Object.keys(answers).length, unanswered = total - answeredCount;
  return (
    <div className="fixed inset-0 bg-dk-base bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dk-card border border-dk-line rounded-2xl shadow-pop p-8 max-w-sm w-full animate-scale-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📋</div>
          <h2 className="font-heading font-bold text-dk-text text-xl mb-1">Submit Exam?</h2>
          <p className="text-dk-muted text-sm">This action cannot be undone.</p>
        </div>
        <div className="space-y-0 mb-5 border border-dk-border rounded-xl overflow-hidden">
          {[{ label:'Total questions', val:total, color:'text-dk-text' }, { label:'Answered', val:answeredCount, color:'text-mint' }, ...(unanswered > 0 ? [{ label:'Unanswered', val:unanswered, color:'text-coral' }] : []), ...(flaggedCount > 0 ? [{ label:'Flagged for review', val:flaggedCount, color:'text-yellow-400' }] : [])].map((s, i, arr) => (
            <div key={s.label} className={`flex justify-between text-sm px-4 py-3 ${i < arr.length-1 ? 'border-b border-dk-border' : ''}`}>
              <span className="text-dk-muted">{s.label}</span>
              <span className={`font-mono font-semibold ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
        {unanswered > 0 && (
          <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl px-4 py-3 mb-5">
            <p className="text-yellow-400 text-xs leading-relaxed"><span className="font-bold">{unanswered} unanswered</span> questions will count as incorrect.</p>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-dk-border text-dk-muted text-sm font-medium hover:border-dk-line hover:text-dk-text transition-colors">Review Answers</button>
          <button onClick={onConfirm} id="confirm-submit-btn" className="flex-1 py-2.5 rounded-xl bg-coral text-dk-base text-sm font-bold hover:opacity-90 transition-opacity">Submit Exam</button>
        </div>
      </div>
    </div>
  );
}

/* ── ExamPage ── */
function ExamPage({ exam, questions, onComplete, onExit }) {
  const [currentQ, setCurrentQ] = useS(0);
  const [answers, setAnswers] = useS({});
  const [flagged, setFlagged] = useS(new Set());
  const [timeLeft, setTimeLeft] = useS(exam.duration);
  const [showModal, setShowModal] = useS(false);
  const [showNavPanel, setShowNavPanel] = useS(false);
  const submitted = useR(false);
  const doSubmitRef = useR(null);

  const doSubmit = () => { submitted.current = true; onComplete(calcResults(answers, questions, exam)); };
  doSubmitRef.current = doSubmit;

  useEf(() => {
    const id = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(id); if (!submitted.current) doSubmitRef.current(); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, []);

  const toggleFlag = () => setFlagged(prev => { const n = new Set(prev); n.has(questions[currentQ].id) ? n.delete(questions[currentQ].id) : n.add(questions[currentQ].id); return n; });

  return (
    <div className="flex flex-col h-screen bg-dk-base font-sans text-dk-text antialiased">
      <ExamHeader exam={exam} currentQ={currentQ} total={questions.length} timeLeft={timeLeft} onExit={onExit} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-7">
          {/* Mobile Questions toggle button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowNavPanel(v => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dk-border text-dk-muted text-xs font-medium hover:border-dk-line hover:text-dk-text transition-colors"
            >
              ☰ Questions ({Object.keys(answers).length}/{questions.length})
            </button>
            {showNavPanel && (
              <div className="mt-3 bg-dk-card border border-dk-border rounded-xl p-4">
                <QuestionNavigator questions={questions} answers={answers} flagged={flagged} currentQ={currentQ} onJump={(idx) => { setCurrentQ(idx); setShowNavPanel(false); }} />
              </div>
            )}
          </div>
          <QuestionCard
            question={questions[currentQ]}
            currentAnswer={answers[questions[currentQ].id]}
            onAnswer={opt => setAnswers(prev => ({ ...prev, [questions[currentQ].id]: opt }))}
            flagged={flagged.has(questions[currentQ].id)}
            onFlag={toggleFlag}
          />
        </div>
        <aside className="hidden lg:flex w-64 border-l border-dk-border bg-dk-card overflow-y-auto px-4 py-5 flex-shrink-0 flex-col">
          <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest mb-4">Navigator</p>
          <QuestionNavigator questions={questions} answers={answers} flagged={flagged} currentQ={currentQ} onJump={setCurrentQ} />
        </aside>
      </div>
      <ExamFooterNav currentQ={currentQ} total={questions.length}
        onPrev={() => setCurrentQ(q => Math.max(0, q - 1))}
        onNext={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
        onSubmit={() => setShowModal(true)}
      />
      {showModal && <SubmitConfirmModal answers={answers} flaggedCount={flagged.size} total={questions.length} onConfirm={doSubmit} onCancel={() => setShowModal(false)} />}
    </div>
  );
}

/* ── PerformanceSummary ── */
function PerformanceSummary({ results, exam }) {
  const { score, correct, total, classAvg, percentile } = results;
  const pointsEarned = results.pointsEarned !== undefined ? results.pointsEarned : (results.estimatedPoints !== undefined ? results.estimatedPoints : null);
  const scoreColor = score >= 80 ? 'text-mint' : score >= 60 ? 'text-lavender' : 'text-coral';
  const feedback = score >= 80 ? "You're building real exam momentum." : score >= 60 ? "Solid checkpoint. A few topics need tightening before the next exam." : "Early checkpoints are meant to expose gaps. Focus on these topics and you'll recover quickly.";
  const statItems = [
    { label:'Correct', val:`${correct}/${total}`, color:'text-dk-text' },
    ...(pointsEarned !== null ? [{ label:'Points Earned', val:pointsEarned, color:'text-coral' }] : []),
    { label:'Class Avg', val:classAvg, color:'text-dk-dim' },
    { label:'Percentile', val:`Top ${100 - percentile}%`, color: score >= classAvg ? 'text-mint' : 'text-yellow-400' },
  ];
  return (
    <div className="bg-dk-card border border-dk-border rounded-2xl p-8 shadow-card text-center mb-5">
      <p className="text-dk-muted text-2xs uppercase tracking-widest font-medium mb-1">{exam.classCode} · {exam.checkpoint}</p>
      <h2 className="font-heading font-bold text-dk-text text-xl mb-6">{exam.title}</h2>
      <div className="mb-6">
        <span className={`font-heading font-black leading-none ${scoreColor}`} style={{ fontSize: '5rem' }}>{score}</span>
        <span className="text-dk-muted text-2xl font-mono ml-2"> / 100</span>
      </div>
      <div className="flex justify-center border border-dk-border rounded-2xl overflow-hidden mb-6">
        {statItems.map((s, i, arr) => (
          <div key={s.label} className={`flex-1 py-4 px-3 ${i < arr.length-1 ? 'border-r border-dk-border' : ''}`}>
            <p className={`font-mono font-bold text-xl ${s.color}`}>{s.val}</p>
            <p className="text-dk-muted text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-dk-muted text-sm italic leading-relaxed max-w-md mx-auto">"{feedback}"</p>
    </div>
  );
}

/* ── TopicBreakdownCard ── */
function TopicBreakdownCard({ topicResults }) {
  const barColor = pct => pct >= 80 ? 'bg-mint' : pct >= 60 ? 'bg-lavender' : pct >= 40 ? 'bg-yellow-400' : 'bg-coral';
  const textColor = pct => pct >= 80 ? 'text-mint' : pct >= 60 ? 'text-lavender' : pct >= 40 ? 'text-yellow-400' : 'text-coral';
  return (
    <div className="bg-dk-card border border-dk-border rounded-2xl p-6 shadow-card mb-4">
      <h3 className="font-heading font-bold text-dk-text text-base mb-5">Topic Breakdown</h3>
      <div className="space-y-4">
        {topicResults.map(t => (
          <div key={t.topic}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-dk-text text-sm font-medium">{t.topic}</span>
              <div className="flex items-center gap-2">
                <span className="text-dk-muted text-xs font-mono">{t.correct}/{t.total}</span>
                <span className={`font-mono text-sm font-bold ${textColor(t.pct)}`}>{t.pct}%</span>
              </div>
            </div>
            <div className="h-2 bg-dk-hover rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${barColor(t.pct)}`} style={{ width:`${t.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── StrengthWeaknessPanel ── */
function StrengthWeaknessPanel({ topicResults }) {
  const sorted = [...topicResults].sort((a, b) => b.pct - a.pct);
  const strengths = sorted.filter(t => t.pct >= 70);
  const weaknesses = sorted.filter(t => t.pct < 60);
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-dk-card border border-dk-border rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-mint text-lg">💪</span>
          <h3 className="font-heading font-bold text-dk-text text-sm">Strongest Topics</h3>
        </div>
        {strengths.length > 0 ? (
          <div className="space-y-2">
            {strengths.map(t => (
              <div key={t.topic} className="flex items-center justify-between py-2 border-b border-dk-border last:border-0">
                <span className="text-dk-dim text-xs">{t.topic}</span>
                <span className="font-mono text-xs font-bold text-mint">{t.pct}%</span>
              </div>
            ))}
          </div>
        ) : <p className="text-dk-muted text-xs">Keep practicing to build strengths.</p>}
      </div>
      <div className="bg-dk-card border border-dk-border rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-coral text-lg">📖</span>
          <h3 className="font-heading font-bold text-dk-text text-sm">Review These Next</h3>
        </div>
        {weaknesses.length > 0 ? (
          <div className="space-y-2">
            {weaknesses.map(t => (
              <div key={t.topic} className="flex items-center justify-between py-2 border-b border-dk-border last:border-0">
                <span className="text-dk-dim text-xs">{t.topic}</span>
                <span className="font-mono text-xs font-bold text-coral">{t.pct}%</span>
              </div>
            ))}
          </div>
        ) : <p className="text-dk-muted text-xs italic">Solid across the board — great work!</p>}
      </div>
    </div>
  );
}

/* ── ApiKeyModal ── */
function ApiKeyModal({ onClose, onSaved }) {
  const [key, setKey] = useS('');
  const hasKey = typeof loadApiKey === 'function' && !!loadApiKey();
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dk-card border border-dk-border rounded-2xl max-w-sm w-full p-6 shadow-pop animate-scale-in" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading font-bold text-dk-text text-base mb-2">Claude API Key</h2>
        <p className="text-dk-muted text-xs leading-relaxed mb-4">Your API key is stored only in your browser — it is never sent to MockIn servers.</p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-…"
          className="w-full bg-dk-base border border-dk-border rounded-xl px-4 py-2.5 text-dk-text text-sm focus:outline-none focus:border-coral mb-3"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-dk-card border border-dk-border rounded-xl text-dk-muted text-sm font-medium hover:border-dk-line hover:text-dk-text transition-colors">Skip</button>
          <button onClick={() => { if (!key.trim()) return; if (typeof saveApiKey === 'function') saveApiKey(key.trim()); onSaved(); }} className="flex-1 py-2.5 bg-coral text-dk-base rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">Save</button>
        </div>
        {hasKey && (
          <button onClick={() => { if (typeof clearApiKey === 'function') clearApiKey(); onClose(); }} className="w-full mt-3 text-xs text-dk-muted hover:text-coral transition-colors text-center">Remove saved key</button>
        )}
      </div>
    </div>
  );
}

/* ── FeedbackCard ── */
function FeedbackCard({ score, weakTopics, subject }) {
  const [feedbackState, setFeedbackState] = useS('loading');
  const [feedbackText, setFeedbackText] = useS('');
  const [showApiModal, setShowApiModal] = useS(false);

  const loadTemplate = () => {
    setFeedbackState('template');
    setFeedbackText(typeof generateFeedback === 'function' ? generateFeedback(score, weakTopics, subject) : '');
  };

  const fetchAi = (key) => {
    setFeedbackState('loading');
    callClaudeForFeedback(key, score, weakTopics, subject).then(res => {
      if (res.ok) { setFeedbackState('ai'); setFeedbackText(res.text); }
      else loadTemplate();
    });
  };

  useEf(() => {
    const key = typeof loadApiKey === 'function' ? loadApiKey() : null;
    if (key) fetchAi(key);
    else loadTemplate();
  }, []);

  return (
    <div className="bg-dk-card border border-dk-border rounded-2xl p-5 shadow-card mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lavender text-base">💡</span>
        <h3 className="font-heading font-bold text-dk-text text-sm">Study Coach</h3>
      </div>
      {feedbackState === 'loading' ? (
        <div className="flex items-center gap-2 text-dk-muted text-sm">
          <span className="inline-block w-3.5 h-3.5 border-2 border-dk-border border-t-coral rounded-full flex-shrink-0" style={{ animation: 'spin 0.8s linear infinite' }} />
          Generating your feedback…
        </div>
      ) : (
        <>
          <p className="text-dk-dim text-sm leading-relaxed mb-3">{feedbackText}</p>
          <div className="flex items-center justify-between">
            <span className="text-dk-muted text-2xs font-mono">
              {feedbackState === 'ai' ? 'AI-powered · Claude' : 'Study coach tip'}
            </span>
            <button onClick={() => setShowApiModal(true)} className="text-coral text-xs hover:underline">
              {feedbackState === 'ai' ? 'Change API key' : 'Enable AI Feedback'}
            </button>
          </div>
        </>
      )}
      {showApiModal && (
        <ApiKeyModal
          onClose={() => setShowApiModal(false)}
          onSaved={() => { setShowApiModal(false); const k = typeof loadApiKey === 'function' ? loadApiKey() : null; if (k) fetchAi(k); else loadTemplate(); }}
        />
      )}
    </div>
  );
}

/* ── ResultsPage ── */
function ResultsPage({ results, exam, onReturn, onReview }) {
  return (
    <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased">
      <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 sticky top-0 z-40">
        <button onClick={onReturn} id="results-back-btn" className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back to Dashboard</button>
        <div className="h-5 w-px bg-dk-border" />
        <span className="font-heading font-bold text-dk-text text-sm">Exam Results</span>
        <div className="ml-auto">
          <span className="font-mono text-xs text-dk-muted bg-dk-hover border border-dk-border px-2.5 py-1 rounded-lg">{exam.classCode} · {exam.checkpoint}</span>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <PerformanceSummary results={results} exam={exam} />
        {results.newlyUnlocked && results.newlyUnlocked.length > 0 && (
          <div className="my-4 flex flex-col gap-2">
            {results.newlyUnlocked.map(id => {
              const a = (typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS : []).find(x => x.id === id);
              if (!a) return null;
              return (
                <div key={id} className="flex items-center gap-3 px-4 py-3 bg-mint bg-opacity-10 border border-mint border-opacity-30 rounded-xl">
                  <span className="text-lg leading-none">{a.icon}</span>
                  <div>
                    <p className="text-mint text-xs font-bold">Achievement Unlocked</p>
                    <p className="text-dk-text text-sm font-semibold">{a.name} <span className="text-dk-muted font-normal">· {a.desc}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <FeedbackCard score={results.score} weakTopics={results.weakTopics || (results.topicResults || []).filter(t => t.pct < 70).map(t => t.topic)} subject={results.subject || ''} />
        <TopicBreakdownCard topicResults={results.topicResults} />
        <StrengthWeaknessPanel topicResults={results.topicResults} />
        <div className="flex gap-3 mt-4">
          <button onClick={onReturn} className="flex-1 py-3 bg-dk-card border border-dk-border rounded-xl text-dk-muted text-sm font-medium hover:border-dk-line hover:text-dk-text transition-colors">← Return to Dashboard</button>
          <button onClick={onReview || undefined} disabled={!onReview} className="flex-1 py-3 bg-coral text-dk-base rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-glow disabled:opacity-50">Review Answers</button>
        </div>
      </div>
    </div>
  );
}

/* ── ReviewQuestionCard ── */
function ReviewQuestionCard({ item, index, total }) {
  const { question, userAnswer } = item;
  const diffColor = { easy: 'text-mint', medium: 'text-lavender', hard: 'text-coral' }[question.difficulty] || 'text-dk-muted';

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="bg-dk-hover border border-dk-border text-dk-muted text-xs px-2.5 py-1 rounded-lg font-medium">{question.topic}</span>
        <span className={`text-xs font-medium capitalize ${diffColor}`}>{question.difficulty}</span>
        <span className="ml-auto font-mono text-xs text-dk-muted">{index + 1} / {total}</span>
      </div>
      <div className="bg-dk-card border border-dk-border rounded-2xl p-6">
        <p className="text-dk-text text-base leading-relaxed font-medium">{question.text}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, i) => {
          const isCorrectOpt = i === question.correctAnswer;
          const isUserOpt = i === userAnswer;
          let borderCls, bgCls, textCls, letterCls, badge = null;
          if (isCorrectOpt && isUserOpt) {
            borderCls = 'border-mint'; bgCls = 'bg-mint bg-opacity-10'; textCls = 'text-dk-text';
            letterCls = 'border-mint bg-mint text-dk-base';
            badge = <span className="ml-auto flex-shrink-0 text-xs font-semibold text-mint bg-mint bg-opacity-20 px-2 py-0.5 rounded-md">Correct · Your answer</span>;
          } else if (isCorrectOpt) {
            borderCls = 'border-mint'; bgCls = 'bg-mint bg-opacity-10'; textCls = 'text-dk-text';
            letterCls = 'border-mint bg-mint text-dk-base';
            badge = <span className="ml-auto flex-shrink-0 text-xs font-semibold text-mint bg-mint bg-opacity-20 px-2 py-0.5 rounded-md">Correct</span>;
          } else if (isUserOpt) {
            borderCls = 'border-coral'; bgCls = 'bg-coral bg-opacity-10'; textCls = 'text-dk-text';
            letterCls = 'border-coral bg-coral text-dk-base';
            badge = <span className="ml-auto flex-shrink-0 text-xs font-semibold text-coral bg-coral bg-opacity-20 px-2 py-0.5 rounded-md">Your answer</span>;
          } else {
            borderCls = 'border-dk-border'; bgCls = 'bg-dk-card'; textCls = 'text-dk-dim';
            letterCls = 'border-dk-line text-dk-muted';
          }
          return (
            <div key={i} className={`w-full flex items-start gap-4 px-5 py-4 rounded-xl border text-sm font-medium ${borderCls} ${bgCls} ${textCls}`}>
              <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${letterCls}`}>{LETTERS[i]}</span>
              <span className="pt-0.5 leading-relaxed flex-1">{opt}</span>
              {badge}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── ReviewPage ── */
function ReviewPage({ results, exam, onBack }) {
  const [currentQ, setCurrentQ] = useS(0);
  const items = results.review;
  const total = items.length;
  const item = items[currentQ];

  return (
    <div className="flex flex-col h-screen bg-dk-base font-sans text-dk-text antialiased">
      <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-40">
        <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0">← Back to Results</button>
        <div className="h-5 w-px bg-dk-border" />
        <span className="font-heading font-bold text-dk-text text-sm">Answer Review</span>
        <div className="ml-auto">
          <span className="font-mono text-xs text-dk-muted bg-dk-hover border border-dk-border px-2.5 py-1 rounded-lg">{exam.classCode} · {exam.checkpoint}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-7">
          <ReviewQuestionCard item={item} index={currentQ} total={total} />
        </div>
        <aside className="hidden lg:flex flex-col w-64 border-l border-dk-border bg-dk-card overflow-y-auto px-4 py-5 flex-shrink-0">
          <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest mb-4">Navigator</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-2xs text-dk-muted mb-4">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-mint inline-block" />Correct</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-coral inline-block" />Wrong</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-dk-border inline-block" />Unanswered</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {items.map((it, idx) => {
              const isCur = idx === currentQ;
              const ringCls = isCur ? 'ring-2 ring-coral ring-offset-1 ring-offset-dk-base' : '';
              let baseCls;
              if (it.isCorrect)                          baseCls = 'bg-mint border-mint text-dk-base';
              else if (it.userAnswer !== null)            baseCls = 'bg-coral border-coral text-dk-base';
              else                                       baseCls = 'border-dk-border text-dk-muted bg-dk-hover hover:border-dk-line hover:text-dk-text';
              return (
                <button key={idx} onClick={() => setCurrentQ(idx)}
                  className={`h-9 rounded-lg text-xs font-mono font-semibold transition-all duration-100 border ${baseCls} ${ringCls}`}>
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="border-t border-dk-border pt-3 mt-4 space-y-2">
            {[
              { label: 'Correct',    val: items.filter(i => i.isCorrect).length,                             color: 'text-mint' },
              { label: 'Wrong',      val: items.filter(i => i.userAnswer !== null && !i.isCorrect).length,   color: 'text-coral' },
              { label: 'Unanswered', val: items.filter(i => i.userAnswer === null).length,                   color: 'text-dk-muted' },
            ].map(s => (
              <div key={s.label} className="flex justify-between text-xs">
                <span className="text-dk-muted">{s.label}</span>
                <span className={`font-mono font-medium ${s.color}`}>{s.val}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <footer className="h-16 bg-dk-card border-t border-dk-border flex items-center px-6 gap-3 flex-shrink-0 sticky bottom-0 z-40">
        <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dk-border text-sm font-medium text-dk-muted hover:text-dk-text hover:border-dk-line transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          ← Previous
        </button>
        <div className="flex-1 flex justify-center">
          <span className="font-mono text-sm text-dk-muted">Q <span className="font-bold text-dk-text">{currentQ + 1}</span> of <span className="font-bold text-dk-text">{total}</span></span>
        </div>
        <button onClick={() => setCurrentQ(q => Math.min(total - 1, q + 1))} disabled={currentQ === total - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dk-border text-sm font-medium text-dk-muted hover:text-dk-text hover:border-dk-line transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          Next →
        </button>
      </footer>
    </div>
  );
}

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

/* ── buildCatchupExam ── */
function buildCatchupExam(classId, weakTopics) {
  const bank = (typeof QUESTION_BANKS !== 'undefined' && QUESTION_BANKS[classId]) ? QUESTION_BANKS[classId] : [];
  if (bank.length === 0) return [];
  if (bank.length <= 10) return shuffle([...bank]);
  const topics = Array.isArray(weakTopics) && weakTopics.length > 0 ? weakTopics : null;
  if (!topics) return shuffle([...bank]).slice(0, 10);
  const weak    = shuffle(bank.filter(q => topics.includes(q.topic))).slice(0, 8);
  const needed  = 10 - weak.length;
  const weakIds = new Set(weak.map(q => q.id));
  const filler  = shuffle(bank.filter(q => !weakIds.has(q.id) && !topics.includes(q.topic))).slice(0, needed);
  const extra   = needed - filler.length > 0
    ? shuffle(bank.filter(q => !weakIds.has(q.id) && !filler.find(f => f.id === q.id))).slice(0, needed - filler.length)
    : [];
  return [...weak, ...filler, ...extra];
}

/* ── generateFeedback ── */
function generateFeedback(score, weakTopics, subject) {
  const wt = Array.isArray(weakTopics) ? weakTopics : [];
  if (score >= 90) {
    return `Excellent work — you've demonstrated strong command of the material. To push further, target the hard-difficulty questions on ${wt[0] || 'all topics'}.`;
  }
  if (score >= 70 && wt.length > 0) {
    return `Good result overall. Your answers indicate ${wt[0]} needs reinforcement — revisit definitions and worked examples in that area before your next checkpoint.`;
  }
  if (score < 70 && wt.length > 0) {
    return `This checkpoint needs more work. Focus your revision on ${wt[0]} and ${wt[1] || 'related fundamentals'} — these appeared most in your incorrect answers. A catch-up exam is available to help you target these gaps.`;
  }
  return `This checkpoint needs more work. Review the full topic list and try the catch-up exam to identify your weakest areas.`;
}

/* ── callClaudeForFeedback ── */
async function callClaudeForFeedback(apiKey, score, weakTopics, subject) {
  const wt = Array.isArray(weakTopics) ? weakTopics : [];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `You are a concise study coach for an engineering student at RWTH Aachen. They completed a mock exam on ${subject}. Score: ${score}%. Weak topics: ${wt.join(', ') || 'none identified'}. Give exactly 2–3 sentences of actionable study advice. Be specific and encouraging. Do not use lists. Do not repeat the score back.`,
        }],
      }),
    });
    if (!res.ok) return { ok: false };
    const data = await res.json();
    const text = data && data.content && data.content[0] && data.content[0].text;
    if (!text) return { ok: false };
    return { ok: true, text };
  } catch (e) {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

/* ── getCommunityPool ── */
function getCommunityPool(classId) {
  if (typeof COMMUNITY_SEED_QUESTIONS === 'undefined') {
    return loadCommunityQuestions().filter(q => q.classId === classId);
  }
  const seeded = COMMUNITY_SEED_QUESTIONS.filter(q => q.classId === classId);
  const stored = loadCommunityQuestions().filter(q => q.classId === classId);
  return [...seeded, ...stored];
}

/* ══════════════════════════════════════════════
   SELF STUDY
══════════════════════════════════════════════ */

/* ── SelfStudyPage ── */
function SelfStudyPage({ classes, onBack, onOpenCommunity }) {
  /* phase: 'hub' | 'class-select' | 'topic-select' | 'session' | 'summary' */
  const [phase, setPhase] = useS('hub');
  const [mode, setMode]   = useS(null);      /* 'drill' | 'practice' */
  const [selClass, setSelClass] = useS(null);
  const [selTopic, setSelTopic] = useS(null);
  const [questions, setQuestions] = useS([]);
  const [currentQ, setCurrentQ]   = useS(0);
  const [userAnswers, setUserAnswers] = useS({});  /* idx → chosen option index */
  const [revealed, setRevealed]       = useS({});  /* idx → true */
  const [includeCommunity, setIncludeCommunity] = useS(false);

  const availableClasses = classes || [];

  /* ── start session ── */
  const startSession = (qs) => {
    setQuestions(qs);
    setCurrentQ(0);
    setUserAnswers({});
    setRevealed({});
    setPhase('session');
  };

  const handleSelectMode = (m) => { setMode(m); if (m === 'drill') setIncludeCommunity(false); setPhase('class-select'); };

  const handleSelectClass = (cls) => {
    setSelClass(cls);
    if (mode === 'drill') {
      setPhase('topic-select');
    } else {
      const bank = (typeof QUESTION_BANKS !== 'undefined' && QUESTION_BANKS[cls.id]) ? QUESTION_BANKS[cls.id] : EXAM_QUESTIONS;
      const base = bank || [];
      const extra = includeCommunity ? getCommunityPool(cls.id) : [];
      startSession(shuffle([...base, ...extra]));
    }
  };

  const handleSelectTopic = (topic) => {
    setSelTopic(topic);
    const bank = (typeof QUESTION_BANKS !== 'undefined' && QUESTION_BANKS[selClass.id]) ? QUESTION_BANKS[selClass.id] : EXAM_QUESTIONS;
    const pool = shuffle(bank.filter(q => q.topic === topic));
    startSession(pool.length > 0 ? pool.slice(0, 5) : [bank[0]]);
  };

  const handleAnswer = (idx, opt) => {
    if (revealed[idx]) return;
    setUserAnswers(prev => ({ ...prev, [idx]: opt }));
    setRevealed(prev => ({ ...prev, [idx]: true }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(q => q + 1);
    else setPhase('summary');
  };
  const handlePrev = () => { if (currentQ > 0) setCurrentQ(q => q - 1); };

  const handleRetry = () => {
    setPhase(mode === 'drill' ? 'topic-select' : 'class-select');
    setQuestions([]);
    setCurrentQ(0);
    setUserAnswers({});
    setRevealed({});
  };

  /* ── HUB ── */
  if (phase === 'hub') return (
    <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased">
      <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 sticky top-0 z-40">
        <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back</button>
        <div className="h-5 w-px bg-dk-border" />
        <span className="font-heading font-bold text-dk-text text-sm">Self Study</span>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-dk-muted text-xs font-mono mb-1 uppercase tracking-widest">Self Study</p>
        <h2 className="font-heading font-bold text-dk-text text-2xl mb-2">Practice at your own pace</h2>
        <p className="text-dk-muted text-sm mb-8">No timer. No pressure. Instant feedback after every answer.</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id:'drill',    icon:'✎', label:'Topic Drill',    sub:'5 questions · pick a topic · instant feedback' },
            { id:'practice', icon:'≡', label:'Free Practice',  sub:'15 questions · full class bank · no timer'     },
          ].map(m => (
            <div key={m.id} className="bg-dk-card border border-dk-border rounded-2xl p-6 flex flex-col gap-4 hover:border-dk-line transition-colors shadow-card">
              <div className="w-10 h-10 bg-dk-hover border border-dk-border rounded-xl flex items-center justify-center text-xl">{m.icon}</div>
              <div>
                <h3 className="font-heading font-bold text-dk-text text-base">{m.label}</h3>
                <p className="text-dk-muted text-xs mt-1">{m.sub}</p>
              </div>
              <button onClick={() => handleSelectMode(m.id)}
                className="mt-auto w-full py-2.5 bg-coral text-dk-base text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
                Start {m.label} →
              </button>
            </div>
          ))}
          <div className="bg-dk-card border border-dk-border rounded-2xl p-6 flex flex-col gap-4 hover:border-dk-line transition-colors shadow-card">
            <div className="w-10 h-10 bg-dk-hover border border-dk-border rounded-xl flex items-center justify-center text-xl">◉</div>
            <div>
              <h3 className="font-heading font-bold text-dk-text text-base">Community Bank</h3>
              <p className="text-dk-muted text-xs mt-1">Browse and contribute questions</p>
            </div>
            <button onClick={onOpenCommunity}
              className="mt-auto w-full py-2.5 bg-coral text-dk-base text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── CLASS SELECT ── */
  if (phase === 'class-select') return (
    <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased">
      <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 sticky top-0 z-40">
        <button onClick={() => setPhase('hub')} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back</button>
        <div className="h-5 w-px bg-dk-border" />
        <span className="font-heading font-bold text-dk-text text-sm">{mode === 'drill' ? 'Topic Drill' : 'Free Practice'}</span>
      </header>
      <div className="max-w-xl mx-auto px-6 py-8">
        <p className="text-dk-muted text-xs mb-6">Select a class to practice</p>
        {availableClasses.length === 0 ? (
          <p className="text-dk-muted text-sm">No question banks available yet.</p>
        ) : (
          <div className="space-y-3">
            {availableClasses.map(cls => {
              const bank = (typeof QUESTION_BANKS !== 'undefined' && QUESTION_BANKS[cls.id]) ? QUESTION_BANKS[cls.id] : (typeof EXAM_QUESTIONS !== 'undefined' ? EXAM_QUESTIONS : []);
              const topics = [...new Set(bank.map(q => q.topic))];
              return (
                <button key={cls.id} onClick={() => handleSelectClass(cls)}
                  className="w-full text-left bg-dk-card border border-dk-border rounded-2xl px-5 py-4 hover:border-dk-line transition-colors shadow-card group">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm font-bold text-coral">{cls.code}</span>
                      <p className="text-dk-muted text-xs mt-0.5 truncate max-w-xs">{cls.fullName}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="text-dk-muted text-xs font-mono">{bank.length} questions</span>
                      <p className="text-dk-muted text-xs">{topics.length} topics</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {mode === 'practice' && (() => {
          const communityCount = getCommunityPool(selClass ? selClass.id : '').length;
          const disabled = communityCount === 0;
          return (
            <div className="mt-5 pt-5 border-t border-dk-border">
              <div className={`flex items-center justify-between py-2 ${disabled ? 'opacity-50' : ''}`}>
                <div>
                  <span className="text-dk-text text-sm font-medium">Include community questions in session</span>
                  <p className="text-dk-muted text-xs mt-0.5">
                    {disabled ? 'No community questions available' : `${communityCount} community question${communityCount !== 1 ? 's' : ''} available`}
                  </p>
                </div>
                <button
                  disabled={disabled}
                  onClick={() => !disabled && setIncludeCommunity(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${!disabled && includeCommunity ? 'bg-coral' : 'bg-dk-hover border border-dk-border'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-dk-text transition-transform ${includeCommunity && !disabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );

  /* ── TOPIC SELECT (drill only) ── */
  if (phase === 'topic-select') {
    const bank = (typeof QUESTION_BANKS !== 'undefined' && QUESTION_BANKS[selClass.id]) ? QUESTION_BANKS[selClass.id] : (typeof EXAM_QUESTIONS !== 'undefined' ? EXAM_QUESTIONS : []);
    const topics = [...new Set(bank.map(q => q.topic))];
    return (
      <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased">
        <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 sticky top-0 z-40">
          <button onClick={() => setPhase('class-select')} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back</button>
          <div className="h-5 w-px bg-dk-border" />
          <span className="font-heading font-bold text-dk-text text-sm">{selClass.code} — Topic Drill</span>
        </header>
        <div className="max-w-xl mx-auto px-6 py-8">
          <p className="text-dk-muted text-xs mb-6">Choose a topic to drill</p>
          <div className="space-y-2">
            {topics.map(topic => {
              const count = bank.filter(q => q.topic === topic).length;
              return (
                <button key={topic} onClick={() => handleSelectTopic(topic)}
                  className="w-full text-left bg-dk-card border border-dk-border rounded-xl px-5 py-3.5 hover:border-dk-line transition-colors flex items-center justify-between group">
                  <span className="text-dk-text text-sm font-medium">{topic}</span>
                  <span className="text-dk-muted text-xs font-mono flex-shrink-0 ml-3">{count} question{count !== 1 ? 's' : ''}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── SESSION ── */
  if (phase === 'session') {
    const q = questions[currentQ];
    if (!q) return null;
    const isRevealed = !!revealed[currentQ];
    const chosen = userAnswers[currentQ];
    const isLast = currentQ === questions.length - 1;
    return (
      <div className="flex flex-col h-screen bg-dk-base font-sans text-dk-text antialiased">
        <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-40">
          <button onClick={() => setPhase('hub')} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0">← Exit</button>
          <div className="h-5 w-px bg-dk-border" />
          <span className="font-heading font-bold text-dk-text text-sm">{mode === 'drill' ? 'Topic Drill' : 'Free Practice'} · {selClass && selClass.code}</span>
          <div className="ml-auto">
            <span className="font-mono text-xs text-dk-muted bg-dk-hover border border-dk-border px-2.5 py-1 rounded-lg">{currentQ + 1} / {questions.length}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-dk-hover border border-dk-border text-dk-muted text-xs px-2.5 py-1 rounded-lg font-medium">{q.topic}</span>
              <span className={`text-xs font-medium capitalize ${{ easy:'text-mint', medium:'text-lavender', hard:'text-coral' }[q.difficulty] || 'text-dk-muted'}`}>{q.difficulty}</span>
            </div>
            <div className="bg-dk-card border border-dk-border rounded-2xl p-6">
              <p className="text-dk-text text-base leading-relaxed font-medium">{q.text}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctAnswer;
                const isChosen  = i === chosen;
                let cls;
                if (!isRevealed) {
                  cls = 'border-dk-border bg-dk-card text-dk-dim hover:border-dk-line hover:bg-dk-hover hover:text-dk-text cursor-pointer';
                } else if (isCorrect && isChosen) {
                  cls = 'border-mint bg-mint bg-opacity-10 text-dk-text pointer-events-none';
                } else if (isCorrect) {
                  cls = 'border-mint bg-mint bg-opacity-10 text-dk-text pointer-events-none';
                } else if (isChosen) {
                  cls = 'border-coral bg-coral bg-opacity-10 text-dk-text pointer-events-none';
                } else {
                  cls = 'border-dk-border bg-dk-card text-dk-dim pointer-events-none opacity-50';
                }
                const lCls = !isRevealed ? 'border-dk-line text-dk-muted'
                  : isCorrect ? 'border-mint bg-mint text-dk-base'
                  : isChosen  ? 'border-coral bg-coral text-dk-base'
                  : 'border-dk-line text-dk-muted';
                let badge = null;
                if (isRevealed) {
                  if (isCorrect && isChosen) badge = <span className="ml-auto flex-shrink-0 text-xs font-semibold text-mint bg-mint bg-opacity-20 px-2 py-0.5 rounded-md">Correct · Your answer</span>;
                  else if (isCorrect)        badge = <span className="ml-auto flex-shrink-0 text-xs font-semibold text-mint bg-mint bg-opacity-20 px-2 py-0.5 rounded-md">Correct</span>;
                  else if (isChosen)         badge = <span className="ml-auto flex-shrink-0 text-xs font-semibold text-coral bg-coral bg-opacity-20 px-2 py-0.5 rounded-md">Your answer</span>;
                }
                return (
                  <div key={i} onClick={!isRevealed ? () => handleAnswer(currentQ, i) : undefined}
                    className={`w-full flex items-start gap-4 px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-150 ${cls}`}>
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${lCls}`}>{LETTERS[i]}</span>
                    <span className="pt-0.5 leading-relaxed flex-1">{opt}</span>
                    {badge}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <footer className="h-16 bg-dk-card border-t border-dk-border flex items-center px-6 gap-3 flex-shrink-0 sticky bottom-0 z-40">
          <button onClick={handlePrev} disabled={currentQ === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dk-border text-sm font-medium text-dk-muted hover:text-dk-text hover:border-dk-line transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            ← Previous
          </button>
          <div className="flex-1 flex justify-center">
            <span className="font-mono text-sm text-dk-muted">Q <span className="font-bold text-dk-text">{currentQ + 1}</span> of <span className="font-bold text-dk-text">{questions.length}</span></span>
          </div>
          {isRevealed && (
            <button onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-coral text-dk-base text-sm font-bold hover:opacity-90 transition-opacity shadow-glow">
              {isLast ? 'See Results →' : 'Next →'}
            </button>
          )}
        </footer>
      </div>
    );
  }

  /* ── SUMMARY ── */
  if (phase === 'summary') {
    const correct = questions.filter((q, i) => userAnswers[i] === q.correctAnswer).length;
    const pct = Math.round((correct / questions.length) * 100);
    const scoreColor = pct >= 80 ? 'text-mint' : pct >= 60 ? 'text-lavender' : 'text-coral';

    /* Compute topicResults for free practice breakdown */
    const topicMap = {};
    questions.forEach((q, i) => {
      if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 };
      topicMap[q.topic].total++;
      if (userAnswers[i] === q.correctAnswer) topicMap[q.topic].correct++;
    });
    const topicResults = Object.entries(topicMap)
      .map(([topic, d]) => ({ topic, correct: d.correct, total: d.total, pct: Math.round((d.correct / d.total) * 100) }))
      .sort((a, b) => b.pct - a.pct);

    return (
      <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased">
        <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 sticky top-0 z-40">
          <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors">← Back to Dashboard</button>
          <div className="h-5 w-px bg-dk-border" />
          <span className="font-heading font-bold text-dk-text text-sm">{mode === 'drill' ? 'Topic Drill' : 'Free Practice'} Results</span>
        </header>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-dk-card border border-dk-border rounded-2xl p-8 shadow-card text-center mb-5">
            <p className="text-dk-muted text-2xs uppercase tracking-widest font-medium mb-1">
              {selClass && selClass.code}{mode === 'drill' && selTopic ? ` · ${selTopic}` : ''}
            </p>
            <h2 className="font-heading font-bold text-dk-text text-xl mb-4">{mode === 'drill' ? 'Topic Drill' : 'Free Practice'}</h2>
            <div className="mb-4">
              <span className={`font-heading font-black leading-none ${scoreColor}`} style={{ fontSize: '4rem' }}>{correct}</span>
              <span className="text-dk-muted text-2xl font-mono ml-2"> / {questions.length}</span>
            </div>
            <p className={`font-mono font-bold text-lg ${scoreColor}`}>{pct}%</p>
          </div>

          <div className="bg-dk-card border border-dk-border rounded-2xl p-5 shadow-card mb-4">
            <h3 className="font-heading font-bold text-dk-text text-base mb-4">Question Review</h3>
            <div className="space-y-3">
              {questions.map((q, i) => {
                const isCorrect = userAnswers[i] === q.correctAnswer;
                return (
                  <div key={i} className={`rounded-xl border px-4 py-3 ${isCorrect ? 'border-mint bg-mint bg-opacity-5' : 'border-coral bg-coral bg-opacity-5'}`}>
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 font-mono font-bold text-sm mt-0.5 ${isCorrect ? 'text-mint' : 'text-coral'}`}>{isCorrect ? '✓' : '✗'}</span>
                      <div className="min-w-0">
                        <p className="text-dk-text text-sm leading-snug">{q.text}</p>
                        {!isCorrect && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-coral">Your answer: <span className="font-medium">{userAnswers[i] !== undefined ? q.options[userAnswers[i]] : 'Unanswered'}</span></p>
                            <p className="text-xs text-mint">Correct: <span className="font-medium">{q.options[q.correctAnswer]}</span></p>
                          </div>
                        )}
                      </div>
                      <span className="flex-shrink-0 ml-auto">
                        <span className="text-dk-muted text-2xs font-mono bg-dk-hover border border-dk-border px-2 py-0.5 rounded-md">{q.topic}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {mode === 'practice' && topicResults.length > 1 && (
            <TopicBreakdownCard topicResults={topicResults} />
          )}

          <div className="flex gap-3 mt-4">
            <button onClick={handleRetry} className="flex-1 py-3 bg-dk-card border border-dk-border rounded-xl text-dk-muted text-sm font-medium hover:border-dk-line hover:text-dk-text transition-colors">Try Again</button>
            <button onClick={onBack} className="flex-1 py-3 bg-coral text-dk-base rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-glow">Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ── CommunityBankPage ── */
function CommunityBankPage({ classes, onBack, onOpenSubmit }) {
  const [selClass, setSelClass] = useS('all');

  const pool = selClass === 'all'
    ? (classes || []).flatMap(c => getCommunityPool(c.id))
    : getCommunityPool(selClass);

  const diffColor = { easy: 'text-mint', medium: 'text-lavender', hard: 'text-coral' };

  return (
    <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased">
      <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 sticky top-0 z-40">
        <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0">← Back</button>
        <div className="h-5 w-px bg-dk-border" />
        <span className="font-heading font-bold text-dk-text text-sm">Community Bank</span>
        <button onClick={onOpenSubmit} className="ml-auto flex items-center gap-1.5 text-xs bg-coral text-dk-base px-3.5 py-2 rounded-xl hover:opacity-90 transition-opacity font-bold">Contribute a Question →</button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Class filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setSelClass('all')} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selClass === 'all' ? 'bg-coral text-dk-base' : 'bg-dk-card border border-dk-border text-dk-muted hover:text-dk-text hover:border-dk-line'}`}>All</button>
          {(classes || []).map(c => (
            <button key={c.id} onClick={() => setSelClass(c.id)} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selClass === c.id ? 'bg-coral text-dk-base' : 'bg-dk-card border border-dk-border text-dk-muted hover:text-dk-text hover:border-dk-line'}`}>{c.code}</button>
          ))}
        </div>

        {pool.length === 0 ? (
          <div className="bg-dk-card border border-dk-border rounded-2xl p-10 text-center shadow-card">
            <p className="text-dk-muted text-sm mb-4">No community questions yet{selClass !== 'all' ? ' for this class' : ''}. Be the first to contribute.</p>
            <button onClick={onOpenSubmit} className="px-5 py-2.5 bg-coral text-dk-base text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">Contribute a Question →</button>
          </div>
        ) : (
          <div className="space-y-2">
            {pool.map(q => (
              <div key={q.id} className="bg-dk-card border border-dk-border rounded-2xl px-5 py-4 shadow-card">
                <p className="text-dk-text text-sm font-medium leading-snug line-clamp-2 mb-3">{q.text}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-dk-hover border border-dk-border text-dk-muted text-2xs px-2 py-0.5 rounded-md font-medium">{q.topic}</span>
                  <span className={`text-2xs font-semibold capitalize ${diffColor[q.difficulty] || 'text-dk-muted'}`}>{q.difficulty}</span>
                  <span className="text-2xs font-mono font-bold text-coral">{q.classId}</span>
                  <span className="ml-auto text-dk-muted text-2xs">Submitted by: {q.submittedBy || 'Anonymous'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── QuestionSubmitForm ── */
function QuestionSubmitForm({ classes, onSubmit, onBack }) {
  const [classId, setClassId]     = useS((classes && classes[0]) ? classes[0].id : '');
  const [topic, setTopic]         = useS('');
  const [topicOther, setTopicOther] = useS('');
  const [difficulty, setDifficulty] = useS('medium');
  const [text, setText]           = useS('');
  const [options, setOptions]     = useS(['', '', '', '']);
  const [correct, setCorrect]     = useS(null);
  const [errors, setErrors]       = useS({});
  const [done, setDone]           = useS(false);

  const topicsForClass = (id) => {
    if (typeof QUESTION_BANKS === 'undefined' || !QUESTION_BANKS[id]) return [];
    return [...new Set(QUESTION_BANKS[id].map(q => q.topic))];
  };
  const topics = topicsForClass(classId);
  const resolvedTopic = topic === '__other__' ? topicOther.trim() : topic;

  const setOpt = (i, val) => setOptions(prev => { const n = [...prev]; n[i] = val; return n; });

  const validate = () => {
    const e = {};
    if (!classId) e.classId = 'Select a class';
    if (!resolvedTopic) e.topic = 'Enter a topic';
    if (!text.trim()) e.text = 'Enter the question text';
    options.forEach((o, i) => { if (!o.trim()) e[`opt${i}`] = 'Required'; });
    if (correct === null) e.correct = 'Select the correct answer';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const q = {
      id: 'community-' + Date.now(),
      classId,
      topic: resolvedTopic,
      difficulty,
      text: text.trim(),
      options: options.map(o => o.trim()),
      correctAnswer: correct,
      submittedBy: 'You',
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    saveCommunityQuestion(q);
    if (onSubmit) onSubmit(q);
    setDone(true);
  };

  const reset = () => {
    setClassId((classes && classes[0]) ? classes[0].id : '');
    setTopic(''); setTopicOther(''); setDifficulty('medium');
    setText(''); setOptions(['','','','']); setCorrect(null); setErrors({}); setDone(false);
  };

  if (done) return (
    <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased flex flex-col items-center justify-center px-6">
      <div className="bg-dk-card border border-dk-border rounded-2xl p-10 max-w-md w-full text-center shadow-card">
        <div className="w-12 h-12 rounded-full bg-mint bg-opacity-20 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
        <h2 className="font-heading font-bold text-dk-text text-lg mb-1">Question submitted!</h2>
        <p className="text-dk-muted text-sm mb-6">Your question has been added to the community bank.</p>
        <div className="flex gap-3">
          <button onClick={reset} className="flex-1 py-2.5 bg-dk-card border border-dk-border rounded-xl text-dk-muted text-sm font-medium hover:border-dk-line hover:text-dk-text transition-colors">Submit Another</button>
          <button onClick={onBack} className="flex-1 py-2.5 bg-coral text-dk-base rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">Back to Community Bank</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased">
      <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 gap-4 sticky top-0 z-40">
        <button onClick={onBack} className="text-dk-muted hover:text-dk-text text-sm font-medium flex items-center gap-1.5 hover:bg-dk-hover px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0">← Back</button>
        <div className="h-5 w-px bg-dk-border" />
        <span className="font-heading font-bold text-dk-text text-sm">Contribute a Question</span>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* Class */}
        <div>
          <label className="block text-dk-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Class</label>
          <select value={classId} onChange={e => { setClassId(e.target.value); setTopic(''); setErrors({}); }}
            className="w-full bg-dk-card border border-dk-border rounded-xl px-4 py-2.5 text-dk-text text-sm focus:outline-none focus:border-coral">
            {(classes || []).map(c => <option key={c.id} value={c.id}>{c.code} — {c.fullName.split(' \u2014 ')[0]}</option>)}
          </select>
          {errors.classId && <p className="text-coral text-xs mt-1">{errors.classId}</p>}
        </div>

        {/* Topic */}
        <div>
          <label className="block text-dk-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Topic</label>
          <select value={topic} onChange={e => { setTopic(e.target.value); setErrors(prev => ({ ...prev, topic: null })); }}
            className="w-full bg-dk-card border border-dk-border rounded-xl px-4 py-2.5 text-dk-text text-sm focus:outline-none focus:border-coral">
            <option value="">Select a topic…</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
            <option value="__other__">Other (enter below)</option>
          </select>
          {topic === '__other__' && (
            <input value={topicOther} onChange={e => setTopicOther(e.target.value)} placeholder="Enter topic"
              className="mt-2 w-full bg-dk-card border border-dk-border rounded-xl px-4 py-2.5 text-dk-text text-sm focus:outline-none focus:border-coral" />
          )}
          {errors.topic && <p className="text-coral text-xs mt-1">{errors.topic}</p>}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-dk-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Difficulty</label>
          <div className="flex gap-2">
            {['easy','medium','hard'].map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${difficulty === d ? (d==='easy'?'bg-mint text-dk-base':d==='medium'?'bg-lavender text-dk-base':'bg-coral text-dk-base') : 'bg-dk-card border border-dk-border text-dk-muted hover:border-dk-line'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question text */}
        <div>
          <label className="block text-dk-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Question</label>
          <textarea value={text} onChange={e => { setText(e.target.value); setErrors(prev => ({ ...prev, text: null })); }}
            rows={3} placeholder="Enter your question here…"
            className="w-full bg-dk-card border border-dk-border rounded-xl px-4 py-3 text-dk-text text-sm focus:outline-none focus:border-coral resize-none" />
          {errors.text && <p className="text-coral text-xs mt-1">{errors.text}</p>}
        </div>

        {/* Options */}
        <div>
          <label className="block text-dk-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Options <span className="normal-case text-dk-muted font-normal">(select the correct answer)</span></label>
          <div className="space-y-2">
            {['A','B','C','D'].map((letter, i) => (
              <div key={i} className="flex items-center gap-3">
                <button onClick={() => { setCorrect(i); setErrors(prev => ({ ...prev, correct: null })); }}
                  className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-colors ${correct === i ? 'bg-mint border-mint text-dk-base' : 'border-dk-line text-dk-muted hover:border-dk-border'}`}>
                  {letter}
                </button>
                <input value={options[i]} onChange={e => { setOpt(i, e.target.value); setErrors(prev => ({ ...prev, [`opt${i}`]: null })); }}
                  placeholder={`Option ${letter}`}
                  className={`flex-1 bg-dk-card border rounded-xl px-4 py-2.5 text-dk-text text-sm focus:outline-none focus:border-coral ${errors[`opt${i}`] ? 'border-coral' : 'border-dk-border'}`} />
              </div>
            ))}
          </div>
          {errors.correct && <p className="text-coral text-xs mt-1">{errors.correct}</p>}
        </div>

        <button onClick={handleSubmit} className="w-full py-3 bg-coral text-dk-base text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-glow">Submit Question →</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   APP SHELL — persistent sidebar layout for authenticated sub-pages
══════════════════════════════════════════════ */
function AppShell({ user, earned, onNavClick, onLogout, onToggleTheme, currentTheme, currentView, children }) {
  const [sidebarOpen, setSidebarOpen] = useS(false);
  const close = () => setSidebarOpen(false);
  return (
    <div className="bg-dk-base min-h-screen font-sans text-dk-text antialiased">
      {/* Desktop: sidebar in normal flow */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar user={user} activeItem={currentView} onNavClick={onNavClick} onLogout={onLogout} onToggleTheme={onToggleTheme} currentTheme={currentTheme} />
        <div className="flex-1 min-w-0">{children}</div>
      </div>

      {/* Mobile: full-screen content + hamburger FAB + slide-in drawer */}
      <div className="lg:hidden min-h-screen">
        {/* Hamburger FAB — always visible top-left */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-coral text-white shadow-lg text-lg"
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Content */}
        <div className="pt-16 min-h-screen">{children}</div>

        {/* Backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40" onClick={close} />
        )}

        {/* Slide-in drawer */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-250 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar
            user={user}
            activeItem={currentView}
            onNavClick={(id, tab) => { close(); onNavClick && onNavClick(id, tab); }}
            onLogout={onLogout}
            onToggleTheme={onToggleTheme}
            currentTheme={currentTheme}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════ */
function App() {
  /* ── State ── */
  const [userProfile, setUserProfile] = useS(() => loadUser());
  const [progress, setProgress] = useS(() => {
    const u = loadUser();
    return (u && u.assignedClasses) ? initProgress(u.assignedClasses) : {};
  });
  const [view, setView] = useS(() => {
    const u = loadUser();
    if (!u) return 'landing';
    if (!u.assignedClasses) return 'course-select';
    return 'dashboard';
  });
  const [results, setResults] = useS(null);
  const [examCtx, setExamCtx] = useS(null); /* { classId, cpId, cpIndex, examConfig } */
  const [communityView, setCommunityView] = useS('bank');
  const [profileTab, setProfileTab] = useS('profile');
  const [theme, setTheme] = useS(() => typeof loadTheme === 'function' ? loadTheme() : 'dark');
  const earned = uM(() => loadAchievements(), [progress]);

  useEf(() => { document.documentElement.setAttribute('data-theme', theme); }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    if (typeof saveTheme === 'function') saveTheme(next);
    setTheme(next);
  }

  const mergeProfile = (patch) => setUserProfile(prev => ({ ...(prev || {}), ...patch }));

  /* ── Enriched classes: merge assignedClasses + live progress ── */
  const enrichedClasses = uM(() => {
    if (!userProfile || !userProfile.assignedClasses) return null;
    return userProfile.assignedClasses.map(cls => {
      const clsProg      = progress[cls.id] || {};
      const checkpoints  = clsProg.checkpoints || generateCheckpoints();
      const totalPoints  = clsProg.totalPoints || 0;
      const completedCnt = checkpoints.filter(c => c.completed).length;
      const lb           = generateLeaderboard(cls.id, totalPoints, userProfile.name, completedCnt);
      const weakCps      = checkpoints.filter(cp => getCheckpointStatus(cp) === 'weak');
      return {
        ...cls,
        checkpoints,
        totalPoints,
        userScore:    totalPoints,
        userRank:     lb.userRank,
        enrolled:     lb.total,
        hasCatchup:    weakCps.length > 0,
        catchupTopics: [...new Set(weakCps.flatMap(cp => cp.weakTopics || []))],
        catchupCpId:   weakCps.length > 0 ? weakCps[0].id : null,
      };
    });
  }, [userProfile, progress]);

  /* ── Start a specific checkpoint exam ── */
  const startCheckpointExam = (classId, cpId) => {
    const cls = userProfile && userProfile.assignedClasses
      ? userProfile.assignedClasses.find(c => c.id === classId)
      : null;
    const examConfig = cls ? {
      id:         cls.id + '-cp' + cpId,
      title:      'Checkpoint ' + cpId + ' Mock Exam',
      classCode:  cls.code,
      className:  cls.fullName,
      checkpoint: 'Checkpoint ' + cpId,
      duration:   40 * 60,
      ects:       cls.ects || 6,
      classAvg:   71,
    } : EXAM_CONFIG;
    const questions = (typeof QUESTION_BANKS !== 'undefined' && QUESTION_BANKS[classId])
      ? QUESTION_BANKS[classId]
      : EXAM_QUESTIONS;
    setExamCtx({ classId, cpId, cpIndex: cpId - 1, examConfig, questions });
    setView('exam');
  };

  /* ── Exam completion: save result + update progress state ── */
  const handleExamComplete = (res) => {
    const weakTopics = (res.topicResults || []).filter(t => t.pct < 70).map(t => t.topic);
    const subject = (enrichedClasses && examCtx && examCtx.classId)
      ? (enrichedClasses.find(c => c.id === examCtx.classId)?.fullName || '')
      : '';

    if (examCtx && examCtx.isCatchup) {
      const updatedProgress = saveCatchupResult(examCtx.classId, examCtx.cpId, res.score);
      if (updatedProgress) setProgress({ ...updatedProgress });

      /* Achievement evaluation — mirrors normal checkpoint path */
      const earnedIds     = evaluateAchievements(updatedProgress || loadProgress(), userProfile && userProfile.assignedClasses);
      const previous      = loadAchievements();
      const newlyUnlocked = earnedIds.filter(id => !previous.includes(id));
      if (newlyUnlocked.length > 0) saveAchievements(earnedIds);

      setResults({ ...res, isCatchup: true, subject, newlyUnlocked });
    } else if (examCtx && examCtx.classId) {
      const pts         = calcCheckpointPoints(res.score, examCtx.cpIndex);
      const newProgress = saveCheckpointResult(examCtx.classId, examCtx.cpId, res.score, pts, weakTopics);
      setProgress({ ...newProgress });

      /* Achievement evaluation */
      const earnedIds     = evaluateAchievements(newProgress, userProfile && userProfile.assignedClasses);
      const previous      = loadAchievements();
      const newlyUnlocked = earnedIds.filter(id => !previous.includes(id));
      if (newlyUnlocked.length > 0) saveAchievements(earnedIds);

      setResults({ ...res, pointsEarned: pts, newlyUnlocked, subject });
    } else {
      setResults({ ...res, newlyUnlocked: [], subject });
    }
    setView('results');
  };

  /* ── Start a catch-up exam for a weak checkpoint ── */
  const startCatchupExam = (classId, cpId) => {
    const prog = loadProgress();
    const cp = prog[classId]?.checkpoints?.find(c => c.id === cpId);
    const weakTopics = cp?.weakTopics || [];
    const questions = buildCatchupExam(classId, weakTopics);
    if (!questions.length) return;
    const cls = userProfile && userProfile.assignedClasses
      ? userProfile.assignedClasses.find(c => c.id === classId)
      : null;
    const examConfig = cls ? {
      id:         cls.id + '-catchup-' + cpId,
      title:      'Catch-up · Checkpoint ' + cpId,
      classCode:  cls.code,
      className:  cls.fullName,
      checkpoint: 'Catch-up · Checkpoint ' + cpId,
      duration:   20 * 60,
      ects:       cls.ects || 6,
      classAvg:   71,
    } : { ...(typeof EXAM_CONFIG !== 'undefined' ? EXAM_CONFIG : {}), duration: 20 * 60 };
    setExamCtx({ classId, cpId, cpIndex: cpId - 1, examConfig, questions, isCatchup: true });
    setView('exam');
  };

  /* ── Onboarding views (unchanged flow) ── */
  if (view === 'landing') return (
    <LandingPage onContinue={mode => setView(mode === 'login' ? 'login' : 'signup')} />
  );
  if (view === 'signup') return (
    <AuthPage
      mode="signup"
      onComplete={u => { mergeProfile(u); setView('profile'); }}
      onSwitch={() => setView('login')}
    />
  );
  if (view === 'login') return (
    <AuthPage
      mode="login"
      onComplete={u => { mergeProfile(u); setView('profile'); }}
      onSwitch={() => setView('signup')}
    />
  );
  if (view === 'profile') return (
    <OnboardingProfilePage
      name={userProfile && userProfile.name}
      onComplete={p => { mergeProfile(p); setView('course-select'); }}
    />
  );
  if (view === 'course-select') return (
    <CourseSelectPage
      department={userProfile && userProfile.department}
      onComplete={courses => { mergeProfile({ selectedCourses: courses }); setView('class-assign'); }}
    />
  );
  if (view === 'class-assign') return (
    <ClassAssignmentPage
      selectedCourses={(userProfile && userProfile.selectedCourses) || []}
      onComplete={classes => {
        const full = { ...(userProfile || {}), assignedClasses: classes };
        saveUser(full);
        setUserProfile(full);
        /* Initialise the progress store for the new classes */
        const prog = initProgress(classes);
        setProgress({ ...prog });
        setView('dashboard');
      }}
    />
  );

  /* ── Exam & results ── */
  if (view === 'exam') {
    const cfg = examCtx && examCtx.examConfig ? examCtx.examConfig : EXAM_CONFIG;
    return (
      <ExamPage
        exam={cfg}
        questions={examCtx?.questions ?? EXAM_QUESTIONS}
        onComplete={handleExamComplete}
        onExit={() => setView('dashboard')}
      />
    );
  }
  if (view === 'review') {
    const cfg = examCtx && examCtx.examConfig ? examCtx.examConfig : EXAM_CONFIG;
    return <ReviewPage results={results} exam={cfg} onBack={() => setView('results')} />;
  }
  if (view === 'results') {
    const cfg = examCtx && examCtx.examConfig ? examCtx.examConfig : EXAM_CONFIG;
    return (
      <ResultsPage
        results={results}
        exam={cfg}
        onReturn={() => { setResults(null); setExamCtx(null); setView('dashboard'); }}
        onReview={() => setView('review')}
      />
    );
  }

  /* ── shared shell props ── */
  const shellProps = {
    user: userProfile,
    earned,
    onNavClick: (id, tab) => {
      if (tab) setProfileTab(tab);
      if (id === 'profile' || id === 'user-profile') { setView('user-profile'); return; }
      if (id === 'leaderboard') { setView('leaderboard'); return; }
      if (id === 'exams') { setView('exams'); return; }
      if (id === 'season') { setView('season'); return; }
      if (id === 'quizzes' || id === 'drills') { setView('self-study'); return; }
      if (id === 'exercises') { setCommunityView('bank'); setView('community-bank'); return; }
      if (id === 'achievements') { setView('dashboard'); setTimeout(() => { const el = document.getElementById('achievements-card'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); return; }
      if (id === 'dashboard') { setView('dashboard'); return; }
    },
    onLogout: () => { clearUser(); setUserProfile(null); setProgress({}); setView('landing'); },
    onToggleTheme: toggleTheme,
    currentTheme: theme,
  };

  /* ── Self Study ── */
  if (view === 'self-study') return (
    <AppShell {...shellProps} currentView="dashboard">
      <SelfStudyPage
        classes={enrichedClasses}
        onBack={() => setView('dashboard')}
        onOpenCommunity={() => { setCommunityView('bank'); setView('community-bank'); }}
      />
    </AppShell>
  );

  /* ── Community Bank ── */
  if (view === 'community-bank') {
    if (communityView === 'submit') return (
      <AppShell {...shellProps} currentView="dashboard">
        <QuestionSubmitForm
          classes={enrichedClasses}
          onSubmit={() => {}}
          onBack={() => setCommunityView('bank')}
        />
      </AppShell>
    );
    return (
      <AppShell {...shellProps} currentView="dashboard">
        <CommunityBankPage
          classes={enrichedClasses}
          onBack={() => { setCommunityView('bank'); setView('self-study'); }}
          onOpenSubmit={() => setCommunityView('submit')}
        />
      </AppShell>
    );
  }

  /* ── Season ── */
  if (view === 'season') return (
    <AppShell {...shellProps} currentView="season">
      <SeasonPage
        user={userProfile}
        classes={enrichedClasses}
        progress={progress}
        onBack={() => setView('dashboard')}
        onStartCheckpoint={startCheckpointExam}
        onStartCatchup={startCatchupExam}
      />
    </AppShell>
  );

  /* ── Exams ── */
  if (view === 'exams') return (
    <AppShell {...shellProps} currentView="exams">
      <ExamsPage
        assignedClasses={userProfile && userProfile.assignedClasses ? userProfile.assignedClasses : []}
        onBack={() => setView('dashboard')}
      />
    </AppShell>
  );

  /* ── Leaderboard ── */
  if (view === 'leaderboard') return (
    <AppShell {...shellProps} currentView="leaderboard">
      <LeaderboardPage
        user={userProfile}
        progress={progress}
        assignedClasses={userProfile && userProfile.assignedClasses ? userProfile.assignedClasses : []}
        onBack={() => setView('dashboard')}
      />
    </AppShell>
  );

  /* ── Profile & Settings ── */
  if (view === 'user-profile') return (
    <AppShell {...shellProps} currentView="profile">
      <ProfilePage
        user={userProfile}
        profileTab={profileTab}
        onSave={(fields) => { const updated = updateUserProfile(fields); if (updated) setUserProfile(updated); else setUserProfile(prev => ({ ...(prev || {}), ...fields })); }}
        onApiKeySave={(key) => { if (typeof saveApiKey === 'function') saveApiKey(key); }}
        onApiKeyRemove={() => { if (typeof clearApiKey === 'function') clearApiKey(); }}
        onClearData={() => { clearUser(); window.location.reload(); }}
        onBack={() => setView('dashboard')}
      />
    </AppShell>
  );

  /* ── Dashboard ── */
  return (
    <AppShell {...shellProps} currentView="dashboard">
      <Dashboard
        user={userProfile}
        classes={enrichedClasses}
        onStartExam={() => {
          if (!enrichedClasses) return;
          for (const cls of enrichedClasses) {
            const cp = (cls.checkpoints || []).find(c => getCheckpointStatus(c) === 'available');
            if (cp) { startCheckpointExam(cls.id, cp.id); return; }
          }
        }}
        onStartCheckpoint={startCheckpointExam}
        onStartCatchup={startCatchupExam}
        earned={earned}
        onToggleTheme={toggleTheme}
        currentTheme={theme}
        onNavClick={shellProps.onNavClick}
        onLogout={shellProps.onLogout}
      />
    </AppShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
