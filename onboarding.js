/* onboarding.js — MockIn Onboarding Flow (text/babel) */
const { useState: _uS, useEffect: _uEf, useRef: _uR, useMemo: _uM } = React;

/* ══════════════════════════════════════════════
   SHARED ONBOARDING PRIMITIVES
══════════════════════════════════════════════ */

/* ── OnboardingShell ──
   Wraps every step: nav header + centered content area */
function OnboardingShell({ step, totalSteps, children, wide }) {
  return (
    <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased flex flex-col">
      {/* Top bar */}
      <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6 flex-shrink-0">
        <h1 className="font-heading font-black text-xl leading-none tracking-tight text-dk-text">
          Mock<span className="text-coral">In</span>
        </h1>
        {step !== null && (
          <div className="ml-auto flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i < step  ? 'w-2 h-2 bg-mint' :
                  i === step ? 'w-4 h-2 bg-coral' :
                               'w-2 h-2 bg-dk-border'
                }`}
              />
            ))}
          </div>
        )}
      </header>
      {/* Body */}
      <div className={`flex-1 flex items-center justify-center px-4 py-10 ${wide ? '' : ''}`}>
        <div className={wide ? 'w-full max-w-2xl' : 'w-full max-w-sm'}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── InputField ── */
function InputField({ label, type = 'text', value, onChange, placeholder, error, readOnly, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-dk-dim text-xs font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full bg-dk-raised border rounded-xl px-4 py-3 text-sm text-dk-text placeholder-dk-muted outline-none transition-all duration-150
          focus:border-coral focus:ring-1 focus:ring-coral focus:ring-opacity-30
          ${readOnly ? 'opacity-60 cursor-default' : ''}
          ${error ? 'border-coral' : 'border-dk-border hover:border-dk-line'}`}
      />
      {error && <p className="text-coral text-xs">{error}</p>}
      {hint && !error && <p className="text-dk-muted text-xs">{hint}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   STEP 1 — LANDING PAGE
══════════════════════════════════════════════ */
function LandingPage({ onContinue }) {
  return (
    <div className="min-h-screen bg-dk-base font-sans text-dk-text antialiased flex flex-col">
      {/* Nav */}
      <header className="h-14 bg-dk-card border-b border-dk-border flex items-center px-6">
        <h1 className="font-heading font-black text-xl leading-none tracking-tight text-dk-text">
          Mock<span className="text-coral">In</span>
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => onContinue('login')}
            className="text-dk-muted text-sm font-medium hover:text-dk-text transition-colors px-3 py-1.5 rounded-lg hover:bg-dk-hover"
          >
            Log in
          </button>
          <button
            onClick={() => onContinue('signup')}
            className="bg-coral text-dk-base text-sm font-bold px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity shadow-glow"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-4 pb-16">
        <div className="mb-6">
          <span className="font-mono text-2xs text-coral uppercase tracking-[0.25em] bg-coral bg-opacity-10 border border-coral border-opacity-20 px-3 py-1.5 rounded-full">
            RWTH Aachen · Winter 2026
          </span>
        </div>

        <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl leading-tight text-dk-text max-w-xl mb-4">
          We don't lock<br/>people in.
        </h2>
        <p className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl leading-tight text-coral max-w-xl mb-8">
          People lock in.
        </p>

        <p className="text-dk-muted text-base max-w-md leading-relaxed mb-10">
          Seasonal exam structure and community-driven preparation for RWTH students.
          Track your progress, compete with your class, and lock in together.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <button
            onClick={() => onContinue('signup')}
            className="bg-coral text-dk-base font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-glow text-base"
          >
            Join your class →
          </button>
          <button
            onClick={() => onContinue('login')}
            className="border border-dk-border text-dk-dim font-medium px-8 py-3.5 rounded-xl hover:border-dk-line hover:text-dk-text transition-all text-base"
          >
            Already have an account
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 max-w-lg">
          {[
            { icon: '📅', label: 'Checkpoint exams' },
            { icon: '🏆', label: 'Class leaderboard' },
            { icon: '📊', label: 'Progress tracking' },
            { icon: '🤝', label: 'Community-driven' },
            { icon: '🔓', label: 'Free forever' },
          ].map(f => (
            <span
              key={f.label}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-dk-card border border-dk-border rounded-xl text-dk-dim text-sm font-medium"
            >
              <span>{f.icon}</span>{f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-dk-border px-6 py-4 flex items-center justify-center">
        <p className="text-dk-muted text-xs font-mono">
          MockIn · Community-powered · No paywalls · No forced subscriptions
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STEP 2 — AUTH (Login / Signup)
══════════════════════════════════════════════ */
function AuthPage({ mode, onComplete, onSwitch }) {
  const [name, setName]   = _uS('');
  const [email, setEmail] = _uS('');
  const [pass, setPass]   = _uS('');
  const [pass2, setPass2] = _uS('');
  const [errors, setErrors] = _uS({});
  const isSignup = mode === 'signup';

  const validate = () => {
    const e = {};
    if (isSignup && !name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (isSignup) {
      const weakPasswords = ['password','password1','password123','123456','12345678','123456789','qwerty','qwerty123','abc123','letmein','welcome','iloveyou','00000000','11111111'];
      if (pass.length < 8) e.pass = 'Password must be at least 8 characters';
      else if (!/[0-9]/.test(pass) && !/[^a-zA-Z0-9]/.test(pass)) e.pass = 'Add a number or special character';
      else if (weakPasswords.includes(pass.toLowerCase())) e.pass = 'This password is too common — choose something unique';
    } else {
      if (pass.length < 1) e.pass = 'Enter your password';
    }
    if (isSignup && pass !== pass2) e.pass2 = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onComplete({ name: isSignup ? name.trim() : (email.split('@')[0]), email: email.trim(), isLogin: !isSignup });
  };

  return (
    <OnboardingShell step={null} totalSteps={3}>
      <div className="bg-dk-card border border-dk-border rounded-2xl p-8 shadow-card animate-fade-in">
        <div className="text-center mb-7">
          <h2 className="font-heading font-bold text-dk-text text-2xl mb-1">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-dk-muted text-sm">
            {isSignup ? 'Start your exam season with MockIn' : 'Log in to your MockIn account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <InputField
              label="Full name"
              value={name}
              onChange={setName}
              placeholder="Your name"
              error={errors.name}
            />
          )}
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            error={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            value={pass}
            onChange={setPass}
            placeholder="Min. 8 characters"
            error={errors.pass}
            hint={isSignup ? 'At least 8 characters with a number or special character' : undefined}
          />
          {isSignup && (
            <InputField
              label="Confirm password"
              type="password"
              value={pass2}
              onChange={setPass2}
              placeholder="Repeat your password"
              error={errors.pass2}
            />
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-coral text-dk-base font-bold rounded-xl hover:opacity-90 transition-opacity shadow-glow text-sm"
          >
            {isSignup ? 'Create account →' : 'Log in →'}
          </button>
        </form>

        <p className="text-center text-dk-muted text-xs mt-5">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={onSwitch} className="text-coral font-medium hover:underline">
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </OnboardingShell>
  );
}

/* ══════════════════════════════════════════════
   STEP 3 — PROFILE SETUP
══════════════════════════════════════════════ */
function OnboardingProfilePage({ name, onComplete }) {
  const [university, setUniversity] = _uS('RWTH Aachen');
  const [department, setDepartment] = _uS('');
  const [error, setError] = _uS('');

  const DEPTS = [
    'Mechanical Engineering', 'Electrical Engineering & Information Technology',
    'Computer Science', 'Civil Engineering', 'Architecture',
    'Mathematics, Computer Science & Natural Sciences',
    'Georesources & Materials Engineering', 'Business & Economics',
    'Chemistry', 'Physics', 'Biology', 'Medicine', 'Other',
  ];

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!department.trim()) { setError('Please select or enter your department'); return; }
    onComplete({ university, department: department.trim() });
  };

  return (
    <OnboardingShell step={0} totalSteps={3}>
      <div className="animate-fade-in">
        <div className="text-center mb-7">
          <div className="text-3xl mb-3">👋</div>
          <h2 className="font-heading font-bold text-dk-text text-2xl mb-1">
            Welcome, {name || 'there'}
          </h2>
          <p className="text-dk-muted text-sm">Tell us a little about yourself</p>
        </div>

        <div className="bg-dk-card border border-dk-border rounded-2xl p-6 shadow-card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              label="Full name"
              value={name || ''}
              readOnly
              hint="Set during signup"
            />
            <InputField
              label="University"
              value={university}
              onChange={setUniversity}
              placeholder="Your university"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-dk-dim text-xs font-medium">Department / Program</label>
              <select
                value={department}
                onChange={e => { setDepartment(e.target.value); setError(''); }}
                className="w-full bg-dk-raised border border-dk-border rounded-xl px-4 py-3 text-sm text-dk-text outline-none transition-all duration-150 focus:border-coral focus:ring-1 focus:ring-coral focus:ring-opacity-30 cursor-pointer"
              >
                <option value="">Select your department…</option>
                {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {error && <p className="text-coral text-xs">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-coral text-dk-base font-bold rounded-xl hover:opacity-90 transition-opacity shadow-glow text-sm"
            >
              Continue →
            </button>
          </form>
        </div>
      </div>
    </OnboardingShell>
  );
}

/* ══════════════════════════════════════════════
   STEP 4 — COURSE SELECTION
══════════════════════════════════════════════ */
function CourseSelectPage({ onComplete, department }) {
  const [query, setQuery]     = _uS('');
  const [selected, setSelected] = _uS([]);
  const [debouncedQ, setDebouncedQ] = _uS('');
  const timerRef = _uR(null);

  /* Debounce search */
  const handleQueryChange = (val) => {
    setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(val), 150);
  };

  /* Filter courses from the global RWTH_COURSES constant */
  const results = _uM(() => {
    if (!debouncedQ.trim()) return [];
    const q = debouncedQ.toLowerCase();
    return RWTH_COURSES
      .filter(c => c.title.toLowerCase().includes(q) || (c.lecturer && c.lecturer.toLowerCase().includes(q)))
      .slice(0, 60);
  }, [debouncedQ]);

  const isSelected = (id) => selected.some(s => s.id === id);

  const toggle = (course) => {
    if (isSelected(course.id)) {
      setSelected(prev => prev.filter(c => c.id !== course.id));
    } else {
      setSelected(prev => [...prev, course]);
    }
  };

  const remove = (id) => setSelected(prev => prev.filter(c => c.id !== id));

  return (
    <OnboardingShell step={1} totalSteps={3} wide>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h2 className="font-heading font-bold text-dk-text text-2xl mb-1">Choose your courses</h2>
          <p className="text-dk-muted text-sm">
            Search for courses you're taking this semester. You'll be placed in a MockIn class for each one.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dk-muted text-sm pointer-events-none">🔍</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder="Search RWTH courses by title or lecturer…"
            className="w-full bg-dk-raised border border-dk-border rounded-xl pl-9 pr-4 py-3 text-sm text-dk-text placeholder-dk-muted outline-none focus:border-coral focus:ring-1 focus:ring-coral focus:ring-opacity-30 transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setDebouncedQ(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dk-muted hover:text-dk-text text-sm"
            >×</button>
          )}
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="mb-4 bg-dk-card border border-dk-border rounded-xl p-3">
            <p className="text-dk-muted text-2xs font-semibold uppercase tracking-widest mb-2">
              Selected ({selected.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selected.map(c => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 bg-coral bg-opacity-10 border border-coral border-opacity-30 text-coral text-xs font-medium px-2.5 py-1 rounded-full max-w-[220px]"
                >
                  <span className="truncate">{c.title.length > 30 ? c.title.slice(0, 28) + '…' : c.title}</span>
                  <button
                    onClick={() => remove(c.id)}
                    className="flex-shrink-0 hover:text-dk-text transition-colors leading-none"
                  >×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results list */}
        <div className="bg-dk-card border border-dk-border rounded-xl overflow-hidden mb-5" style={{ maxHeight: '240px', overflowY: 'auto' }}>
          {!debouncedQ.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <span className="text-3xl mb-3">🎓</span>
              <p className="text-dk-dim text-sm font-medium mb-1">Search your courses</p>
              <p className="text-dk-muted text-xs">Type a course name or your lecturer's name</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <span className="text-3xl mb-3">🔎</span>
              <p className="text-dk-dim text-sm font-medium mb-1">No courses found</p>
              <p className="text-dk-muted text-xs">Try a different search term</p>
            </div>
          ) : (
            results.map((course, i) => {
              const sel = isSelected(course.id);
              return (
                <button
                  key={course.id}
                  onClick={() => toggle(course)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-dk-border last:border-0
                    ${sel ? 'bg-coral bg-opacity-5 hover:bg-coral hover:bg-opacity-10' : 'hover:bg-dk-hover'}`}
                >
                  {/* Check indicator */}
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all
                    ${sel ? 'bg-coral border-coral' : 'border-dk-line'}`}>
                    {sel && <span className="text-dk-base text-2xs font-bold leading-none">✓</span>}
                  </div>

                  {/* Course info */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${sel ? 'text-coral' : 'text-dk-text'}`}>
                      {course.title}
                    </p>
                    {course.lecturer && (
                      <p className="text-dk-muted text-xs truncate">{course.lecturer}</p>
                    )}
                  </div>

                  {/* Exam badge */}
                  {course.examDate && (
                    <span className="flex-shrink-0 flex items-center gap-1 text-2xs font-mono text-mint bg-mint bg-opacity-10 border border-mint border-opacity-20 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block" />
                      {course.examDate.slice(0, 10)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {results.length > 0 && (
          <p className="text-dk-muted text-2xs font-mono mb-4 text-center">
            {results.length < 60
              ? `${results.length} course${results.length !== 1 ? 's' : ''} found`
              : 'Showing top 60 results · refine your search for more'}
          </p>
        )}

        <button
          onClick={() => onComplete(selected)}
          disabled={selected.length === 0}
          className="w-full py-3 bg-coral text-dk-base font-bold rounded-xl hover:opacity-90 transition-opacity shadow-glow text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {selected.length === 0
            ? 'Select at least one course'
            : `Continue with ${selected.length} course${selected.length !== 1 ? 's' : ''} →`}
        </button>
      </div>
    </OnboardingShell>
  );
}

/* ══════════════════════════════════════════════
   STEP 5 — CLASS ASSIGNMENT CONFIRMATION
══════════════════════════════════════════════ */
function ClassAssignmentPage({ selectedCourses, onComplete }) {
  const assignedClasses = _uM(() => deriveClasses(selectedCourses), [selectedCourses]);

  return (
    <OnboardingShell step={2} totalSteps={3} wide>
      <div className="animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎓</div>
          <h2 className="font-heading font-bold text-dk-text text-2xl mb-1">
            You've joined your MockIn classes.
          </h2>
          <p className="text-dk-muted text-sm max-w-sm mx-auto">
            You've been assigned to the following classes for{' '}
            {(typeof SEASON !== 'undefined') ? SEASON.name : 'this season'}.
            Checkpoint exams will appear once the season starts.
          </p>
        </div>

        {/* Class cards */}
        <div className="space-y-2.5 mb-6">
          {assignedClasses.map((cls, i) => (
            <div
              key={cls.id + i}
              className="bg-dk-card border border-dk-border rounded-xl p-4 flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-coral bg-opacity-10 border border-coral border-opacity-20 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-2xs font-bold text-coral leading-none text-center">
                  {cls.code.split(' ')[0].slice(0, 4)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-semibold text-coral">{cls.code}</span>
                  <span className="font-mono text-xs bg-dk-hover border border-dk-border text-dk-muted px-2 py-0.5 rounded-md">
                    {cls.ects} ECTS
                  </span>
                </div>
                <p className="text-dk-dim text-xs truncate">{cls.fullName}</p>
              </div>
              <span className="flex-shrink-0 text-mint text-sm">✓</span>
            </div>
          ))}
        </div>

        <div className="bg-dk-raised border border-dk-border rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
          <span className="text-lavender text-base flex-shrink-0">ℹ</span>
          <p className="text-dk-muted text-xs leading-relaxed">
            Each class has checkpoint mock exams throughout the semester.
            Complete them to earn points and climb the leaderboard.
          </p>
        </div>

        <button
          onClick={() => onComplete(assignedClasses)}
          className="w-full py-3.5 bg-coral text-dk-base font-bold rounded-xl hover:opacity-90 transition-opacity shadow-glow text-sm"
        >
          Enter Dashboard →
        </button>
      </div>
    </OnboardingShell>
  );
}
