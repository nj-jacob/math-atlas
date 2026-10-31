/* Math Plan: the pages. Home, placement check, today's session, weekly check-in, the plan and the report.
   Progress is saved in this browser under "mathplan:". On the family website, sync.js copies it to the
   student's account, and parents and tutors see it through accounts.js. */
(function () {
  var E = window.PE, V = window.PV, app = document.getElementById('app');
  var KEY = 'mathplan:state', CUR = 'mathplan:cur';
  var acct = { mode: 'local' };   /* local | student | adult (set by accounts.js) */
  window.MathPlan = { acct: acct, render: function () { route(); }, KEY: KEY };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load() {
    if (acct.mode === 'adult') return acct.st || null;
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function save(st) {
    if (acct.mode === 'adult') return;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* storage full or blocked */ }
  }
  function cur(v) {
    if (v === undefined) { try { return JSON.parse(localStorage.getItem(CUR)); } catch (e) { return null; } }
    try { if (v === null) localStorage.removeItem(CUR); else localStorage.setItem(CUR, JSON.stringify(v)); } catch (e) { /* ignore */ }
  }
  function go(h) { if (location.hash === '#' + h) route(); else location.hash = h; }
  function grownUp() { return acct.mode === 'adult' || (acct.mode === 'local' && sessionStorage.getItem('mathplan-adult') === '1'); }
  /* Where the grade sites are: next door on the family website, or the live site when this page is opened elsewhere. */
  var SITES = (document.querySelector('meta[name="plan-sites"]') || {}).content || '../';
  function siteLink(g, hash) { return SITES + 'grade' + g + '/' + (hash ? '#' + hash : ''); }
  var all = document.getElementById('allgrades'); if (all) all.href = SITES;

  /* Practice already done in the grade sites (same website): a secure skill counts as a right day. */
  function skillDays(id) {
    var r = E.row(id), out = [];
    if (!r) return out;
    (r.sk || []).forEach(function (s) {
      try {
        var v = JSON.parse(localStorage.getItem('g' + r.g + 'atlas:sk:' + s[1]) || 'null');
        if (v && v.secure && v.t) { var d = E.today(new Date(v.t)); if (out.indexOf(d) < 0) out.push(d); }
      } catch (e) { /* not practised yet */ }
    });
    return out;
  }
  function lessonState(id) {
    var r = E.row(id), seen = 0, got = 0, secure = 0;
    if (!r) return '';
    (r.sk || []).forEach(function (s) {
      try { var v = JSON.parse(localStorage.getItem('g' + r.g + 'atlas:sk:' + s[1]) || 'null'); if (v && v.secure) secure++; else if (v && v.n) seen++; } catch (e) { /* none */ }
    });
    if (acct.mode === 'adult' && acct.skills) {
      (r.sk || []).forEach(function (s) { var v = acct.skills('g' + r.g, s[1]); if (v && v.secure) secure++; else if (v && v.n) seen++; });
    }
    return secure ? 'practice secure' : seen ? 'practice started' : got ? 'lesson done' : '';
  }

  /* ---------- page frame ---------- */
  function nav(r) {
    [].forEach.call(document.querySelectorAll('#nav a'), function (a) { if (a.getAttribute('data-r') === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  }
  function page(html, r) {
    stopSpeech();
    app.innerHTML = html;
    nav(r);
    window.scrollTo(0, 0);
    setTimeout(animateBars, 30);
  }
  function animateBars() {
    [].forEach.call(document.querySelectorAll('.track .fill[data-w]'), function (f) { f.style.width = f.getAttribute('data-w'); });
  }
  function route() {
    var h = location.hash.replace(/^#/, ''), st = load();
    if (acct.mode === 'adult' && !acct.sid) return adultPick();
    if (h === 'about') return about();
    if (!st && acct.mode !== 'adult') return h === 'setup' ? setup() : welcome();
    if (!st) return adultEmpty();
    if (h === 'test') return placement(st);
    if (h === 'today') return today(st);
    if (h === 'check') return checkin(st);
    if (h === 'plan') return plan(st);
    if (h === 'report') return report(st);
    if (h === 'setup') return setup(st);
    if (st.place) return home(st);
    if (!st.levels) return placementIntro(st);
    return home(st);
  }
  window.addEventListener('hashchange', route);

  /* ---------- welcome and setup ---------- */
  function welcome() {
    page('<div class="hero"><div><h1>Find the right starting point in math</h1>' +
      '<p class="lead">A short check finds where a student is in each part of Ontario math, from Grade 1 to Grade 8. Then it builds a plan of what to learn next, and checks in each week to adjust it.</p>' +
      '<div class="steps3"><div><b>1. Placement check</b>About 25 minutes. Can be split into two sittings.</div><div><b>2. A plan</b>The ideas to learn next, in the order they build on each other.</div><div><b>3. Check-ins</b>A short session each day and a check every week. The plan adjusts.</div></div>' +
      '<div class="row"><a class="btn" href="#setup">Get started</a><a class="btn alt" href="#about">How it works</a></div></div>' +
      '<div class="hero-art" aria-hidden="true">' + V.blocks(234, { maxW: 300 }) + '<div class="count" id="hc"></div><p class="hint">Touch the blocks. They light up and count.</p></div></div>');
    wireTaps(app.querySelector('.hero-art'));
  }
  function setup(st) {
    var name = (st && st.name) || acct.name || '', g = st ? st.grade : '';
    var opts = '<option value="">Choose a grade</option>';
    for (var i = 1; i <= 8; i++) opts += '<option value="' + i + '"' + (g === i ? ' selected' : '') + '>Grade ' + i + '</option>';
    page('<div class="card" style="max-width:620px"><h1>' + (st ? 'Change details' : 'Who is this plan for?') + '</h1>' +
      '<form id="sf"><label class="f" for="nm">First name</label><input class="f" id="nm" maxlength="40" autocomplete="off" value="' + esc(name) + '">' +
      '<label class="f" for="gr">Grade at school this year</label><select class="f" id="gr" required>' + opts + '</select>' +
      '<p class="t2 small" style="margin-top:10px">The check starts a little below this grade, so the first questions should feel comfortable.</p>' +
      '<div class="row" style="margin-top:16px"><button class="btn" type="submit">' + (st ? 'Save' : 'Continue') + '</button>' + (st ? '<a class="btn quiet" href="#">Cancel</a>' : '') + '</div></form></div>', 'setup');
    document.getElementById('sf').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var gr = parseInt(document.getElementById('gr').value, 10), nm = document.getElementById('nm').value.trim();
      if (!gr) { document.getElementById('gr').focus(); return; }
      if (st) { st.name = nm; st.grade = gr; save(st); go(''); return; }
      save(E.fresh(nm, gr)); go('');
    });
  }
  function placementIntro(st) {
    page('<div class="card" style="max-width:720px"><h1>' + (st.name ? esc(st.name) + ', let\'s find your starting point' : 'Let\'s find your starting point') + '</h1>' +
      '<p class="lead">This is not a test with a mark. It finds what you already know, so your plan skips what you know and starts where it helps.</p>' +
      '<ul><li>About 30 questions in 6 areas: numbers, operations, patterns, shapes and measuring, data, and money.</li>' +
      '<li>Some questions will feel easy and some will feel hard. That is how it finds the right level.</li>' +
      '<li>There is no timer. If you don\'t know, press <b>I don\'t know yet</b>. That is a good answer too.</li>' +
      '<li>You can stop after any area and come back later.</li>' +
      '<li>Press <b>Read to me</b> to hear a question. Touch the blocks, coins and counters to count them.</li></ul>' +
      '<div class="row" style="margin-top:14px"><button class="btn" id="go">Start the check</button><a class="btn quiet" href="#setup">Change name or grade</a></div></div>');
    document.getElementById('go').addEventListener('click', function () { E.startPlacement(st); save(st); go('test'); });
  }

  /* ---------- home ---------- */
  function home(st) {
    var h = '<h1>' + (st.name ? 'Hi ' + esc(st.name) : 'Your math plan') + '</h1>';
    if (st.place) {
      var p = E.placeProgress(st);
      h += '<div class="card fade-in"><h2>' + (st.place.kind === 'recheck' ? 'Level re-check' : 'Placement check') + ': ' + p.done + ' of ' + p.total + ' areas done</h2>' +
        '<div class="prog" style="margin:8px 0 14px"><i style="width:' + Math.round(100 * p.done / p.total) + '%"></i></div>' +
        '<p>Pick up where you stopped.</p><a class="btn" href="#test">Keep going</a></div>';
      return page(h, '');
    }
    var c = E.todayConcept(st), r = c && E.row(c), wk = E.weeklyDue(st), rc = E.recheckDue(st);
    var done = st.sessions.length && st.sessions[st.sessions.length - 1].d === E.today();
    h += '<div class="grid2">';
    h += '<div class="card fade-in"><h2>Today\'s session</h2><p class="t2">About 15 minutes: 3 warm-up questions, one new idea, then a short check.</p>' +
      (r ? '<p><b>Today\'s idea:</b> ' + esc(E.title(r)) + '<br><span class="t2 small">' + esc(E.plain(r)) + '</span></p>' : '<p>Everything in the plan is mastered. Ask a grown-up to run a level re-check.</p>') +
      (done ? '<p class="chip mastered">Done today. One more is fine if you like.</p> ' : '') +
      (r ? '<a class="btn" href="#today">' + (cur() && cur().kind === 'today' ? 'Continue the session' : 'Start') + '</a>' : '') + '</div>';
    h += '<div class="card fade-in"><h2>Weekly check-in</h2>' + (wk ? '<p>It has been a week. A 10-minute check-in on this week\'s ideas, and the plan adjusts.</p><a class="btn" href="#check">Start the check-in</a>' :
      '<p class="t2">About 10 questions on this week\'s ideas. ' + nextCheck(st) + '</p><a class="btn alt" href="#check">Do it early</a>') + '</div>';
    if (rc) h += '<div class="card fade-in"><h2>Level re-check</h2><p>About once a month, a short re-check makes sure the levels are still right.</p><button class="btn" id="rc">Start the re-check</button></div>';
    h += '<div class="card fade-in"><h2>This week</h2>' + weekList(st, true) + '<a class="btn alt" href="#plan">See the whole plan</a></div>';
    h += '</div>';
    h += '<div class="card"><h2>Levels</h2>' + levels(st) + '</div>';
    page(h, '');
    var b = document.getElementById('rc');
    if (b) b.addEventListener('click', function () { E.startPlacement(st, 'recheck'); save(st); go('test'); });
  }
  function nextCheck(st) {
    var last = st.checkins.length ? st.checkins[st.checkins.length - 1].d : st.week && st.week.start;
    if (!last) return '';
    var left = 7 - E.daysBetween(last, E.today());
    return left > 0 ? 'Next one in ' + left + (left === 1 ? ' day.' : ' days.') : '';
  }
  function chip(c) {
    var names = { mastered: 'Mastered', learning: 'Learning', review: 'Review', todo: 'Up next', placed: 'Already secure' };
    return '<span class="chip ' + c.st + '">' + names[c.st] + '</span>';
  }
  function ev(c) {
    var n = Math.min(E.MASTER_DAYS, c.days.length);
    var s = '<span class="ev" title="Right on ' + c.days.length + ' of ' + E.MASTER_DAYS + ' days">';
    for (var i = 0; i < E.MASTER_DAYS; i++) s += '<i class="' + (i < n || c.st === 'mastered' ? 'y' : '') + '"></i>';
    return s + '</span>';
  }
  function weekList(st, short) {
    var w = (st.week && st.week.items) || [];
    if (!w.length) return '<p>Nothing in focus right now.</p>';
    return '<ul class="items">' + w.map(function (id) {
      var r = E.row(id), c = st.concepts[id];
      return '<li><div class="main"><b>' + esc(E.title(r)) + '</b> ' + chip(c) + ev(c) +
        (c.step ? ' <span class="chip review">Step back</span>' : '') + (c.alt ? ' <span class="chip">New explanation</span>' : '') +
        (short ? '' : '<br><span class="t2 small">' + esc(E.plain(r)) + '</span>') + '</div>' +
        (short ? '' : ctl(st, id)) + '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- levels chart ---------- */
  function levels(st) {
    if (!st.levels) return '<p>No levels yet.</p>';
    var h = '<div class="levels">';
    E.AREAS.forEach(function (a) {
      var l = st.levels[a] || 0, gap = st.grade - l;
      h += '<div class="lvrow"><div class="lvname">' + E.AREA_NAME[a] + '</div><div><div class="track"><div class="fill" data-w="' + (l / 8 * 100) + '%"></div>' +
        '<div class="you" data-l="Grade ' + st.grade + '" style="left:calc(' + (st.grade / 8 * 100) + '% - 2px)"></div></div>' +
        '<div class="scale">' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (g) { return '<span>' + g + '</span>'; }).join('') + '</div></div>' +
        '<div class="lvtxt">' + (l ? 'Secure to Grade ' + l : 'Building Grade 1') + '<br>' + (gap <= 0 ? 'on track' : gap === 1 ? '1 grade to catch up' : gap + ' grades to catch up') + '</div></div>';
    });
    return h + '</div><p class="t2 small" style="margin-top:12px">The coloured bar shows the grade the student is secure in. The blue line is their grade at school.</p>';
  }

  /* ---------- question card ---------- */
  /* opts: title, area, progress(0..1), feedback (show right or wrong), onAnswer(ok, q), onNext() */
  function showQ(q, opts) {
    var h = '<div class="qwrap"><div class="qhead"><span class="area">' + esc(opts.title || '') + '</span><div class="prog" aria-hidden="true"><i style="width:' + Math.round((opts.progress || 0) * 100) + '%"></i></div>' +
      (opts.quit ? '<a class="btn quiet sm noprint" href="#">' + opts.quit + '</a>' : '') + '</div>' +
      '<div class="q" id="qc"><button class="btn alt sm say" id="say" type="button" aria-label="Read the question aloud">🔊 Read to me</button>' +
      '<div class="qtext">' + q.text + '</div>' + (q.vis ? '<div class="visbox">' + q.vis + '</div>' + (/class="[^"]*\btap\b/.test(q.vis) ? '<div style="text-align:center"><span class="count" id="cnt" aria-live="polite"></span></div>' + (q.hint ? '<p class="hint">' + esc(q.hint) + '</p>' : '') : '') : '');
    if (q.type === 'mc') {
      var pics = q.choices.some(function (c) { return /<svg/.test(c); });
      h += '<div class="choices' + (pics ? ' pics' : '') + '" role="group" aria-label="Answers">' + q.choices.map(function (c, i) { return '<button type="button" class="choice" data-i="' + i + '">' + c + '</button>'; }).join('') + '</div>';
    } else {
      h += '<div class="pad"><div class="display focus" id="disp" aria-live="polite"><span id="dv"></span><span class="caret"></span>' + (q.unit ? '<span class="unit">' + esc(q.unit) + '</span>' : '') + '</div>' +
        '<div class="keys">' + ['7', '8', '9', '4', '5', '6', '1', '2', '3', q.negok ? '−' : '.', '0', '⌫'].map(function (k) { return '<button type="button" data-k="' + k + '"' + (k === '⌫' ? ' aria-label="Delete"' : '') + '>' + k + '</button>'; }).join('') +
        '<button type="button" class="go" id="okb">Check</button></div></div>';
    }
    h += '<div class="idk"><button type="button" id="idk">I don\'t know yet</button></div><div id="fb"></div></div></div>';
    page(h, opts.route || '');
    var card = document.getElementById('qc'), done = false, val = '';
    window.MathPlan.q = q;
    wireTaps(card);
    document.getElementById('say').addEventListener('click', function () { speak(q); });
    function finish(ok, pickedIdx) {
      if (done) return; done = true;
      document.removeEventListener('keydown', keys);
      [].forEach.call(card.querySelectorAll('.choice, .keys button, #idk'), function (b) { b.disabled = true; });
      if (q.type === 'mc') {
        var bs = card.querySelectorAll('.choice');
        if (opts.feedback) { bs[q.ans].classList.add('right'); if (pickedIdx != null && pickedIdx !== q.ans) bs[pickedIdx].classList.add('wrong'); }
        else if (pickedIdx != null) bs[pickedIdx].classList.add('picked');
      }
      opts.onAnswer(ok, q);
      var fb = document.getElementById('fb');
      if (opts.feedback) {
        var right = q.type === 'mc' ? q.choices[q.ans] : V.fmt(q.ans) + (q.unit ? ' ' + esc(q.unit) : '');
        fb.innerHTML = '<div class="fb ' + (ok ? 'ok' : 'no') + '">' + (ok ? tick() : '<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#e09a2a"/><path d="M20 10v13M20 28v2" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>') +
          '<div><p><b>' + (ok ? 'Right.' : ok === null ? 'That\'s fine. Here is how it works.' : 'Not quite. The answer is ' + (/<svg/.test(right) ? 'shown in green' : right) + '.') + '</b></p>' + (q.why ? '<p>' + q.why + '</p>' : '') + '</div></div>' +
          '<div class="next"><button class="btn" id="nx" type="button">Next</button></div>';
        var nx = document.getElementById('nx'); nx.focus({ preventScroll: true });
        nx.addEventListener('click', leave);
        fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        fb.innerHTML = '<div class="fb neutral"><div><p><b>Thanks.</b> Next one…</p></div></div>';
        setTimeout(leave, 650);
      }
    }
    function leave() { card.classList.add('out'); setTimeout(opts.onNext, 220); }
    if (q.type === 'mc') {
      [].forEach.call(card.querySelectorAll('.choice'), function (b) {
        b.addEventListener('click', function (ev) {
          ripple(b, ev);
          var i = +b.getAttribute('data-i'); finish(i === q.ans, i);
        });
      });
    } else {
      var dv = document.getElementById('dv');
      var press = function (k) {
        if (done) return;
        if (k === '⌫') val = val.slice(0, -1);
        else if (k === '−' || k === '-') { if (!val) val = '−'; }
        else if (k === '.') { if (val.indexOf('.') < 0) val += (val ? '' : '0') + '.'; }
        else if (/^\d$/.test(k) && val.replace(/\D/g, '').length < 9) val += k;
        dv.textContent = val;
      };
      [].forEach.call(card.querySelectorAll('.keys button[data-k]'), function (b) { b.addEventListener('click', function () { press(b.getAttribute('data-k')); }); });
      var check = function () {
        if (!val || val === '−') { document.getElementById('disp').animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], 260); return; }
        var n = parseFloat(val.replace('−', '-'));
        finish(Math.abs(n - q.ans) < 1e-9);
      };
      document.getElementById('okb').addEventListener('click', check);
      var keyPress = press;
      keys.check = check; keys.press = keyPress;
    }
    function keys(ev) {
      if (ev.target && /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName)) return;
      if (q.type === 'mc') {
        var n = parseInt(ev.key, 10);
        if (n >= 1 && n <= q.choices.length) { card.querySelectorAll('.choice')[n - 1].click(); }
        return;
      }
      if (/^[\d.]$/.test(ev.key)) keys.press(ev.key);
      else if (ev.key === '-') keys.press('−');
      else if (ev.key === 'Backspace') { ev.preventDefault(); keys.press('⌫'); }
      else if (ev.key === 'Enter') { ev.preventDefault(); keys.check(); }
    }
    document.addEventListener('keydown', keys);
    document.getElementById('idk').addEventListener('click', function () { finish(null); });
    window.__planCleanup = function () { document.removeEventListener('keydown', keys); };
  }
  function tick() { return '<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#17803d"/><path class="tick" d="M11 21l6 6 12-13" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function ripple(b, ev) {
    var r = b.getBoundingClientRect(), s = document.createElement('span'), d = Math.max(r.width, r.height);
    s.className = 'ripple'; s.style.width = s.style.height = d + 'px';
    s.style.left = ((ev.clientX || r.left + r.width / 2) - r.left - d / 2) + 'px'; s.style.top = ((ev.clientY || r.top + r.height / 2) - r.top - d / 2) + 'px';
    b.appendChild(s); setTimeout(function () { s.remove(); }, 650);
  }
  /* Touchable drawings: light a piece up and show the running count. */
  function wireTaps(root) {
    [].forEach.call(root.querySelectorAll('svg.vis'), function (svg) {
      svg.addEventListener('click', function (ev) {
        var t = ev.target.closest ? ev.target.closest('.tap') : null;
        if (!t || !svg.contains(t)) return;
        var box = root.querySelector('.count');
        if (svg.classList.contains('bars')) {
          [].forEach.call(svg.querySelectorAll('.tap.on'), function (x) { if (x !== t) x.classList.remove('on'); });
          t.classList.toggle('on');
          if (box) say(box, t.classList.contains('on') ? 'This bar shows ' + V.fmt(+t.getAttribute('data-v')) : '');
          return;
        }
        t.classList.remove('on'); void t.getBBox; t.getBoundingClientRect();
        if (t.getAttribute('data-lit') === '1') { t.removeAttribute('data-lit'); } else { t.setAttribute('data-lit', '1'); t.classList.add('on'); }
        var sum = 0, n = 0;
        [].forEach.call(root.querySelectorAll('svg.vis .tap[data-lit="1"]'), function (x) { sum += +x.getAttribute('data-v') || 0; n++; });
        [].forEach.call(root.querySelectorAll('svg.vis .tap[data-lit="1"]'), function (x) { x.classList.add('on'); });
        if (!box) return;
        if (!n) return say(box, '');
        if (svg.classList.contains('coins')) say(box, 'Counted: ' + (sum >= 100 ? V.money(sum) : sum + '¢'));
        else say(box, 'Counted: ' + V.fmt(sum));
      });
    });
  }
  function say(box, t) { box.textContent = t; box.classList.remove('bump'); void box.offsetWidth; if (t) box.classList.add('bump'); }

  /* Read aloud with the browser's own voice. */
  function spoken(html) {
    return String(html).replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<span class="mx">(\d+)<span class="fr"><i>([^<]*)<\/i><i>([^<]*)<\/i><\/span><\/span>/g, '$1 and $2 over $3')
      .replace(/<span class="fr"><i>([^<]*)<\/i><i>([^<]*)<\/i><\/span>/g, ' $1 over $2 ').replace(/<sup>2<\/sup>/g, ' squared').replace(/<sup>(\d+)<\/sup>/g, ' to the power of $1')
      .replace(/<br>/g, '. ').replace(/<[^>]+>/g, '').replace(/&lt;/g, ' is less than ').replace(/&gt;/g, ' is greater than ').replace(/&amp;/g, ' and ')
      .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−(?=\d)/g, ' negative ').replace(/ − /g, ' minus ').replace(/√/g, 'the square root of ')
      .replace(/(\d) (\d{3})/g, '$1$2').replace(/cm²/g, 'square centimetres').replace(/cm³/g, 'cubic centimetres').replace(/°/g, ' degrees').replace(/\?/g, '?').replace(/\s+/g, ' ').trim();
  }
  function speak(q) {
    if (!('speechSynthesis' in window)) { alert('This browser cannot read aloud.'); return; }
    stopSpeech();
    var t = spoken(q.text);
    if (q.type === 'mc' && !q.choices.some(function (c) { return /<svg/.test(c); })) t += '. The choices are: ' + q.choices.map(spoken).join('; ') + '.';
    var u = new SpeechSynthesisUtterance(t); u.lang = 'en-CA'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
  function stopSpeech() { try { if (window.__planCleanup) { window.__planCleanup(); window.__planCleanup = null; } if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }

  /* ---------- placement ---------- */
  function placement(st) {
    if (acct.mode === 'adult') return go('plan');
    if (!st.place) { if (!st.levels) E.startPlacement(st); else return go(''); save(st); }
    var a = E.placeArea(st);
    if (!a) { var lv = E.finishPlacement(st); save(st); cur(null); return results(st, lv); }
    var p = E.placeProgress(st), A = st.place.areas[a];
    var q = E.placeNext(st);
    if (!q) return placement(st);
    var answered = st.place.log.length;
    showQ(q, {
      title: E.AREA_NAME[a] + ' · area ' + (p.done + 1) + ' of ' + p.total, progress: (p.done + Math.min(A.n / 6, 0.9)) / p.total, feedback: false, quit: 'Stop for now', route: 'test',
      onAnswer: function (ok) { var areaDone = E.placeAnswer(st, q, ok); save(st); q.areaDone = areaDone; },
      onNext: function () {
        if (q.areaDone && E.placeArea(st)) return breakScreen(st, a);
        placement(st);
      }
    });
    void answered;
  }
  function breakScreen(st, a) {
    var p = E.placeProgress(st), next = E.placeArea(st);
    page('<div class="card fade-in" style="max-width:640px;margin:0 auto"><div class="row">' + tick() + '<h2 style="margin:0">' + E.AREA_NAME[a] + ' done</h2></div>' +
      '<div class="prog" style="margin:16px 0"><i style="width:' + Math.round(100 * (p.done - 1) / p.total) + '%" data-to="' + Math.round(100 * p.done / p.total) + '%"></i></div>' +
      '<p>' + p.done + ' of ' + p.total + ' areas finished. Next is <b>' + E.AREA_NAME[next] + '</b>.</p><p class="t2">Good time for a stretch or a drink of water. Everything is saved.</p>' +
      '<div class="row"><a class="btn" href="#test" id="kg">Keep going</a><a class="btn quiet" href="#">Take a break</a></div></div>', 'test');
    setTimeout(function () { var i = app.querySelector('.prog i'); if (i) i.style.width = i.getAttribute('data-to'); }, 60);
    document.getElementById('kg').addEventListener('click', function (e) { e.preventDefault(); placement(load()); });
  }
  function results(st, lv) {
    var h = '<div class="card fade-in"><h1>Your starting point</h1><p class="lead">Thank you. Here is what the check found. The plan starts with the first ideas that are not secure yet in each area.</p>' + levels(st) + '</div>';
    h += '<div class="card fade-in"><h2>First ideas in the plan</h2>' + weekList(st, false) + '<div class="row"><a class="btn" href="#today">Start today\'s session</a><a class="btn alt" href="#plan">See the whole plan</a></div></div>';
    page(h, 'test');
    void lv;
  }

  /* ---------- today's session ---------- */
  function today(st) {
    if (acct.mode === 'adult') return go('plan');
    var s = cur();
    if (!s || s.kind !== 'today' || s.d !== E.today()) {
      var c = E.todayConcept(st);
      if (!c) return go('');
      s = { kind: 'today', d: E.today(), concept: c, step: 'warm', warm: [], check: [], qs: E.warmup(st).map(stripQ) };
      cur(s);
    }
    var r = E.row(s.concept);
    var stepper = function (on) {
      var k = ['warm', 'learn', 'check'], names = ['Warm-up', 'Learn', 'Check'];
      return '<div class="stepper">' + k.map(function (x, i) { return '<span class="' + (x === on ? 'on' : k.indexOf(on) > i ? 'done' : '') + '">' + (i + 1) + '. ' + names[i] + '</span>'; }).join('') + '</div>';
    };
    if (s.step === 'warm') {
      var i = s.warm.length;
      if (i >= s.qs.length) { s.step = 'learn'; cur(s); return today(st); }
      var q = rebuild(s.qs[i]);
      showQ(q, { title: 'Warm-up ' + (i + 1) + ' of ' + s.qs.length, progress: i / s.qs.length * 0.33, feedback: true, quit: 'Stop', route: 'today',
        onAnswer: function (ok) { s.warm.push({ concept: q.concept, ok: !!ok }); cur(s); }, onNext: function () { today(load()); } });
      app.insertAdjacentHTML('afterbegin', stepper('warm'));
      return;
    }
    if (s.step === 'learn') {
      var c2 = st.concepts[s.concept] || {}, links = lessonLinks(r);
      page(stepper('learn') + '<div class="card fade-in"><p class="t2" style="margin:0">Today\'s idea</p><h1>' + esc(r.topic) + '</h1><p class="lead">' + esc(E.plain(r)) + '</p>' +
        '<p class="t2 small">Grade ' + r.g + ' · Ontario expectation ' + r.code + '</p>' +
        (c2.alt ? '<div class="note warm"><b>This one was tricky before.</b> This time, use the hands-on pictures (blocks, number lines, fraction bars) and go slowly. A grown-up can explain it a different way too.</div>' : '') +
        (c2.step ? '<div class="note">This is a step back to an earlier idea. It makes the next one easier.</div>' : '') +
        '<h2 style="margin-top:18px">1. Learn it</h2>' + links +
        '<h2 style="margin-top:18px">2. Then come back here</h2><p>When you have done the lesson and some practice, come back and do a short check: 2 questions.</p>' +
        '<div class="row"><button class="btn" id="tocheck">I\'m ready for the check</button></div></div>', 'today');
      document.getElementById('tocheck').addEventListener('click', function () { s.step = 'check'; s.qs = []; var used = []; for (var k = 0; k < 2; k++) { var qq = E.questionFor(s.concept, used); if (qq) { used.push(qq.item); s.qs.push(stripQ(qq)); } } cur(s); today(load()); });
      return;
    }
    if (s.step === 'check') {
      var j = s.check.length;
      if (j >= s.qs.length) {
        var out = E.finishSession(st, s, skillDays);
        save(st); cur(null);
        return sessionDone(st, s, out);
      }
      var q2 = rebuild(s.qs[j]);
      showQ(q2, { title: 'Check ' + (j + 1) + ' of ' + s.qs.length + ' · ' + r.topic, progress: 0.66 + j / s.qs.length * 0.33, feedback: true, quit: 'Stop', route: 'today',
        onAnswer: function (ok) { s.check.push({ concept: s.concept, ok: !!ok }); cur(s); }, onNext: function () { today(load()); } });
      app.insertAdjacentHTML('afterbegin', stepper('check'));
    }
  }
  /* Questions are kept as (item, seed) so a session can be resumed after visiting a lesson. */
  function stripQ(q) { return { item: q.item, seed: q.seed, concept: q.concept }; }
  function rebuild(x) { var item = E.itemById(x.item), q = E.make(item, x.seed); q.concept = x.concept; return q; }
  var mk = E.make;
  E.make = function (item, s) { if (s == null) s = Math.floor(Math.random() * 4294967295) >>> 0; var q = mk(item, s); q.seed = s; return q; };

  function lessonLinks(r) {
    if (!r.ch.length) return '<p>This idea is taught in Grade ' + r.g + '. <a href="' + siteLink(r.g) + '">Open the Grade ' + r.g + ' Math Atlas</a> and look for ' + esc(r.topic.toLowerCase()) + '.</p>';
    var h = '<div class="row">' + r.ch.slice(0, 2).map(function (ch) { return '<a class="btn alt" href="' + siteLink(r.g, ch) + '">Open the lesson: ' + esc(ch.replace(/-/g, ' ')) + '</a>'; }).join('') + '</div>';
    if (r.sk.length) h += '<p style="margin-top:10px">Practice: ' + r.sk.map(function (s) { return '<a href="' + siteLink(r.g, s[0] + '/practice/' + s[1]) + '">' + esc(s[2] || s[1]) + '</a>'; }).join(' · ') + '</p>';
    return h;
  }
  function sessionDone(st, s, out) {
    var r = E.row(s.concept), c = st.concepts[s.concept], o = out[s.concept];
    var right = s.check.filter(function (x) { return x.ok; }).length;
    var msg = o === 'ok' && c.st === 'mastered' ? '<b>Mastered.</b> Right on ' + E.MASTER_DAYS + ' different days. It moves out of the plan and comes back now and then for review.' :
      o === 'ok' ? '<b>Right on ' + c.days.length + ' of ' + E.MASTER_DAYS + ' days.</b> One more good day on this idea and it is mastered.' :
        o === 'stepback' ? '<b>This one is tricky right now.</b> The plan adds an earlier idea first, then comes back to this one with a different explanation.' :
          o === 'review' ? 'This idea goes back on the plan for some review.' : '<b>Not yet.</b> That\'s normal. It stays in the plan for another day.';
    page('<div class="card fade-in" style="max-width:720px;margin:0 auto"><div class="row">' + tick() + '<h1 style="margin:0">Session done</h1></div>' +
      '<p class="lead" style="margin-top:12px">' + esc(E.title(r)) + ': ' + right + ' of ' + s.check.length + ' right in the check.</p><p>' + msg + ev(c) + '</p>' +
      '<p class="t2">Warm-up: ' + s.warm.filter(function (x) { return x.ok; }).length + ' of ' + s.warm.length + ' right.</p>' +
      '<div class="row"><a class="btn" href="#">Done</a><a class="btn alt" href="#plan">See the plan</a></div></div>', 'today');
  }

  /* ---------- weekly check-in ---------- */
  function checkin(st) {
    if (acct.mode === 'adult') return go('plan');
    var s = cur();
    if (!s || s.kind !== 'check') {
      var qs = E.checkinQuestions(st).map(stripQ);
      if (!qs.length) { page('<div class="card"><h1>Weekly check-in</h1><p>There is nothing to check yet.</p><a class="btn" href="#">Back</a></div>'); return; }
      s = { kind: 'check', d: E.today(), qs: qs, res: [] };
      cur(s);
      page('<div class="card fade-in" style="max-width:680px;margin:0 auto"><h1>Weekly check-in</h1><p class="lead">' + qs.length + ' questions on this week\'s ideas, plus a couple of older ones. About 10 minutes.</p>' +
        '<p>After each answer you will see how it works. At the end, the plan adjusts: mastered ideas move out, and tricky ones get a step back.</p><button class="btn" id="b">Start</button></div>');
      document.getElementById('b').addEventListener('click', function () { checkin(load()); });
      return;
    }
    var i = s.res.length;
    if (i >= s.qs.length) {
      var out = E.finishCheckin(st, s.res, skillDays);
      save(st); cur(null);
      return checkinDone(st, s, out);
    }
    var q = rebuild(s.qs[i]);
    showQ(q, { title: 'Weekly check-in · ' + (i + 1) + ' of ' + s.qs.length, progress: i / s.qs.length, feedback: true, quit: 'Stop', route: 'check',
      onAnswer: function (ok) { s.res.push({ concept: q.concept, ok: !!ok }); cur(s); }, onNext: function () { checkin(load()); } });
  }
  function checkinDone(st, s, out) {
    var right = s.res.filter(function (x) { return x.ok; }).length;
    var names = { ok: 'Right', miss: 'Keep practising', stepback: 'Step back added', review: 'Back for review' };
    var h = '<div class="card fade-in"><div class="row">' + tick() + '<h1 style="margin:0">Check-in done</h1></div><p class="lead" style="margin-top:12px">' + right + ' of ' + s.res.length + ' right.</p><ul class="items">';
    Object.keys(out).forEach(function (id) {
      var c = st.concepts[id];
      h += '<li><div class="main"><b>' + esc(E.title(E.row(id))) + '</b> ' + chip(c) + ev(c) + '<br><span class="t2 small">' + names[out[id]] + '</span></div></li>';
    });
    h += '</ul></div><div class="card fade-in"><h2>Next week</h2>' + weekList(st, true) + '<div class="row"><a class="btn" href="#">Done</a><a class="btn alt" href="#plan">See the plan</a></div></div>';
    page(h, 'check');
  }

  /* ---------- the plan ---------- */
  function ctl(st, id) {
    if (!grownUp()) return '';
    var pin = st.prefs.pin.indexOf(id) >= 0;
    return '<div class="ctl noprint"><button class="btn quiet sm" data-act="pin" data-id="' + id + '">' + (pin ? 'Unpin' : 'Pin to top') + '</button>' +
      '<button class="btn quiet sm" data-act="up" data-id="' + id + '">Move up</button><button class="btn quiet sm" data-act="skip" data-id="' + id + '">Skip</button></div>';
  }
  function plan(st) {
    if (!st.levels) return go('');
    var cn = E.counts(st), lastP = st.history[st.history.length - 1];
    var h = '<div class="row" style="justify-content:space-between"><div><h1>' + (st.name ? esc(st.name) + '\'s plan' : 'The plan') + '</h1><p class="t2">Grade ' + st.grade + ' at school · placement on ' + esc(lastP ? lastP.d : '') +
      ' · ' + cn.mastered + ' mastered, ' + ((cn.learning || 0) + (cn.review || 0)) + ' in progress, ' + st.queue.length + ' in the plan</p></div>' +
      '<div class="row noprint"><a class="btn alt sm" href="#report">Printable report</a>' + (acct.mode === 'local' ? '<button class="btn quiet sm" id="gu">' + (grownUp() ? 'Hide grown-up controls' : 'Grown-up controls') + '</button>' : '') + '</div></div>';
    if (acct.mode === 'adult' && acct.saved) h += '<div class="note">' + esc(acct.saved) + '</div>';
    h += '<div class="card fade-in"><h2>Levels</h2>' + levels(st) + '</div>';
    h += '<div class="card fade-in"><h2>This week\'s focus</h2><p class="t2 small">Mastered means right on ' + E.MASTER_DAYS + ' different days. Each circle is one day.</p>' + weekList(st, false) + '</div>';
    h += '<div class="card fade-in"><h2>Concept map</h2><p class="t2 small">Every Ontario expectation from Grade 1 to Grade 8, one square each. Touch a square to see it.</p>' + cmap(st) + '<div id="pop"></div></div>';
    var up = st.queue.filter(function (id) { return !st.week || st.week.items.indexOf(id) < 0; }).slice(0, 12);
    h += '<div class="card fade-in"><h2>Up next</h2>' + (up.length ? '<ul class="items">' + up.map(function (id) {
      var r = E.row(id), c = st.concepts[id];
      return '<li><div class="main"><b>' + esc(E.title(r)) + '</b> ' + chip(c) + (c.gap ? ' <span class="chip review">Gap found in placement</span>' : '') + '<br><span class="t2 small">' + esc(E.plain(r)) + '</span></div>' + ctl(st, id) + '</li>';
    }).join('') + '</ul>' + (st.queue.length > up.length + ((st.week && st.week.items.length) || 0) ? '<p class="t2 small">…and ' + (st.queue.length - up.length - st.week.items.length) + ' more after these.</p>' : '') : '<p>Nothing else waiting.</p>') + '</div>';
    if (grownUp() && st.prefs.skip.length) h += '<div class="card"><h2>Skipped</h2><ul class="items">' + st.prefs.skip.map(function (id) { return '<li><div class="main">' + esc(E.title(E.row(id))) + '</div><div class="ctl"><button class="btn quiet sm" data-act="unskip" data-id="' + id + '">Put back</button></div></li>'; }).join('') + '</ul></div>';
    h += '<div class="card fade-in"><h2>What changed and why</h2>' + logList(st, 15) + '</div>';
    h += '<div class="card"><h2>Placement history</h2>' + histTable(st) + (grownUp() ? '<div class="row noprint" style="margin-top:12px"><button class="btn alt sm" id="rc2">Run a level re-check now</button>' + (acct.mode === 'local' ? '<button class="btn quiet sm" id="reset">Start over</button>' : '') + '</div>' : '') + '</div>';
    page(h, 'plan');
    wirePlan(st);
  }
  function logList(st, n) {
    if (!st.log.length) return '<p>Nothing yet.</p>';
    return '<ul class="log">' + st.log.slice(0, n).map(function (l) { return '<li class="' + l.k + '"><span class="d">' + esc(l.d) + '</span>' + esc(l.t) + '</li>'; }).join('') + '</ul>';
  }
  function histTable(st) {
    return '<div class="mapwrap"><table class="vt" style="margin:0"><thead><tr><th>Date</th><th>Kind</th>' + E.AREAS.map(function (a) { return '<th>' + E.AREA_NAME[a].split(' ')[0] + '</th>'; }).join('') + '</tr></thead><tbody>' +
      st.history.map(function (x) { return '<tr><td>' + x.d + '</td><td>' + (x.kind === 'recheck' ? 'Re-check' : 'Placement') + '</td>' + E.AREAS.map(function (a) { return '<td>' + (x.levels[a] || '–') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function cmap(st) {
    var C = st.concepts, skip = st.prefs.skip;
    var h = '<div class="legend"><span><i class="dot mastered"></i>Mastered</span><span><i class="dot learning"></i>Learning now</span><span><i class="dot review"></i>Review</span><span><i class="dot todo"></i>In the plan</span><span><i class="dot placed"></i>Secure from placement</span><span><i class="dot"></i>Not in the plan yet</span></div>';
    h += '<div class="cmap">';
    E.AREAS.forEach(function (a) {
      h += '<div class="carea"><h3>' + E.AREA_NAME[a] + '</h3><div class="cgr">';
      for (var g = 1; g <= 8; g++) {
        h += '<div class="cg"><span>Gr ' + g + '</span><div class="dots">' + E.rowsFor(g, a).map(function (r) {
          var c = C[r.id], s = skip.indexOf(r.id) >= 0 ? 'skip' : c ? c.st : '';
          return '<button type="button" class="dot ' + s + '" data-id="' + r.id + '" aria-label="' + esc(E.title(r)) + (s ? ': ' + s : '') + '"></button>';
        }).join('') + '</div></div>';
      }
      h += '</div></div>';
    });
    return h + '</div>';
  }
  function wirePlan(st) {
    var gu = document.getElementById('gu');
    if (gu) gu.addEventListener('click', function () { sessionStorage.setItem('mathplan-adult', grownUp() ? '0' : '1'); plan(load()); });
    [].forEach.call(app.querySelectorAll('.dot[data-id]'), function (d) {
      d.addEventListener('click', function () {
        var id = d.getAttribute('data-id'), r = E.row(id), c = st.concepts[id], pop = document.getElementById('pop');
        pop.innerHTML = '<div class="pop"><b>' + esc(E.title(r)) + '</b> ' + (c ? chip(c) + (c.days.length ? ev(c) : '') : '<span class="chip">Not in the plan yet</span>') + '<p style="margin:6px 0">' + esc(E.plain(r)) + '</p>' +
          (r.ch.length ? '<p class="small"><a href="' + siteLink(r.g, r.ch[0]) + '">Open the Grade ' + r.g + ' lesson</a>' + (lessonState(id) ? ' · ' + lessonState(id) : '') + '</p>' : '') +
          (grownUp() && (!c || c.st !== 'mastered') ? '<p class="noprint"><button class="btn quiet sm" data-act="pin" data-id="' + id + '">Add to the top of the plan</button></p>' : '') + '</div>';
        wireActs(pop, st);
      });
    });
    wireActs(app, st);
    var rc = document.getElementById('rc2');
    if (rc) rc.addEventListener('click', function () {
      if (acct.mode === 'adult') { alert('The re-check runs on the student\'s sign-in. Ask them to open Math Plan; it will offer the re-check.'); return; }
      E.startPlacement(st, 'recheck'); save(st); go('test');
    });
    var rs = document.getElementById('reset');
    if (rs) rs.addEventListener('click', function () { if (confirm('Delete this plan and start again from the placement check?')) { localStorage.removeItem(KEY); cur(null); go(''); } });
  }
  function wireActs(root, st) {
    [].forEach.call(root.querySelectorAll('[data-act]'), function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id'), act = b.getAttribute('data-act');
        if (act === 'pin') E.setPref(st, 'pin', id, st.prefs.pin.indexOf(id) < 0);
        else if (act === 'skip') E.setPref(st, 'skip', id, true);
        else if (act === 'unskip') E.setPref(st, 'skip', id, false);
        else if (act === 'up') moveUp(st, id);
        if (acct.mode === 'adult' && acct.savePrefs) acct.savePrefs(st);
        save(st); plan(st);
      });
    });
  }
  function moveUp(st, id) {
    var q = st.queue, i = q.indexOf(id);
    if (i <= 0) return;
    q.forEach(function (x, k) { st.concepts[x].manual = k; });
    st.concepts[id].manual = i - 1.5;
    E.order(st);
    q = st.queue; q.forEach(function (x, k) { st.concepts[x].manual = k; });
    if (st.week) { var w = st.week.items, j = w.indexOf(id); if (j > 0) { w.splice(j, 1); w.splice(j - 1, 0, id); } else if (j < 0 && q.indexOf(id) < E.WEEK_SIZE) E.fillWeek(st); }
    st.prefs.order = q.slice(0, 40);
  }

  /* ---------- report ---------- */
  function report(st) {
    if (!st.levels) return go('');
    var cn = E.counts(st), since = new Date(); since.setDate(since.getDate() - 30); var from = E.today(since);
    var recent = Object.keys(st.concepts).filter(function (id) { return st.concepts[id].mastered && st.concepts[id].mastered >= from; });
    var h = '<div class="row noprint" style="justify-content:space-between"><a class="btn quiet sm" href="#plan">Back to the plan</a><button class="btn sm" onclick="window.print()">Print</button></div>' +
      '<div class="card"><h1>Math progress report</h1><p><b>' + esc(st.name || 'Student') + '</b> · Grade ' + st.grade + ' · ' + E.today() + '</p>' +
      '<p>' + cn.mastered + ' ideas mastered in the plan (' + recent.length + ' in the last 30 days). ' + st.sessions.length + ' sessions and ' + st.checkins.length + ' weekly check-ins done.</p></div>' +
      '<div class="card"><h2>Levels by area</h2>' + levels(st) + histTable(st) + '</div>' +
      '<div class="card"><h2>Working on now</h2>' + weekList(st, false) + '</div>' +
      '<div class="card"><h2>Mastered in the last 30 days</h2>' + (recent.length ? '<ul>' + recent.map(function (id) { return '<li>' + esc(E.title(E.row(id))) + ' (' + st.concepts[id].mastered + ')</li>'; }).join('') + '</ul>' : '<p>None yet.</p>') + '</div>' +
      '<div class="card"><h2>Changes to the plan</h2>' + logList(st, 25) + '</div>';
    page(h, 'plan');
  }

  /* ---------- how it works ---------- */
  function about() {
    page('<div class="card" style="max-width:820px"><h1>How Math Plan works</h1>' +
      '<h2>1. Placement check</h2><ul><li>It checks 6 areas on their own: numbers, operations, patterns and algebra, shapes and measuring, data and probability, and money.</li>' +
      '<li>Each area starts one grade below the student\'s school grade. Two right answers at a grade means "secure there" and the questions move up a grade. Two misses means "not yet" and they move down.</li>' +
      '<li>It stops when it finds a grade that is secure with the next grade not secure yet. That is the level for the area.</li>' +
      '<li>"I don\'t know yet" counts as not yet. There is no timer and no mark. Most students answer about 30 questions.</li></ul>' +
      '<h2>2. The plan</h2><ul><li>The plan lists every Ontario expectation (from Noel\'s Ministry document) from the level up to the school grade, in each area.</li>' +
      '<li>Ideas from lower grades come first, and numbers and operations lead, because most other topics build on them.</li>' +
      '<li>If the check missed something at a grade that is otherwise secure, that gap goes to the front.</li>' +
      '<li>Four ideas are in focus each week. Each one links to its lesson and practice in that grade\'s Math Atlas.</li></ul>' +
      '<h2>3. The loop</h2><ul><li><b>Each session</b>: 3 warm-up questions on things already learned, one idea to learn, and a 2-question check.</li>' +
      '<li><b>Mastered</b> means right on ' + E.MASTER_DAYS + ' different days. Practice that is secure in the grade site counts as one of those days.</li>' +
      '<li><b>Stuck</b>: missed ' + E.STEP_BACK + ' times in a row means the plan adds the idea that comes before it (usually the same topic a grade lower), and marks the hard one for a different explanation.</li>' +
      '<li><b>Weekly check-in</b>: about 10 questions on the week\'s ideas and 2 older ones. A mastered idea that is missed goes back for review.</li>' +
      '<li><b>Monthly re-check</b>: a short placement check that starts at the current levels and updates them.</li></ul>' +
      '<h2>4. For parents and tutors</h2><ul><li>The plan page shows the levels, the week\'s focus, a concept map of every expectation, what changed and why, and a printable report.</li>' +
      '<li>Grown-ups can pin an idea to the top, move it up, or skip it. On the family website, they see this from their own sign-in.</li></ul>' +
      '<a class="btn" href="#">Back</a></div>', 'about');
  }

  /* ---------- parents and tutors with an account ---------- */
  function adultPick() {
    var kids = acct.kids || [];
    page('<div class="card" style="max-width:700px"><h1>Math plans</h1>' + (kids.length ? '<p>Choose a student.</p><div class="kid-pick">' + kids.map(function (k) { return '<button class="btn alt" data-sid="' + esc(k.sid) + '">' + esc(k.name) + '</button>'; }).join('') + '</div>' :
      '<p>No students yet. Add a student on the <a href="../family.html">family page</a> first.</p>') + '</div>', 'plan');
    [].forEach.call(app.querySelectorAll('[data-sid]'), function (b) { b.addEventListener('click', function () { acct.open(b.getAttribute('data-sid')); }); });
  }
  function adultEmpty() {
    page('<div class="card" style="max-width:700px"><h1>No plan yet</h1><p>' + esc(acct.kidName || 'This student') + ' has not taken the placement check. On their own sign-in, they open Math Plan and press <b>Get started</b>. It takes about 25 minutes and can be split into two sittings.</p>' +
      ((acct.kids || []).length > 1 ? '<button class="btn alt" id="other">Choose another student</button>' : '') + '</div>', 'plan');
    var o = document.getElementById('other'); if (o) o.addEventListener('click', function () { acct.sid = null; route(); });
  }

  route();
})();
