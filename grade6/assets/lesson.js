/* Math Atlas lessons: a chapter is a few lessons, a lesson is a few concepts, and the student sees ONE concept per screen.
   Each concept screen follows the same order: a short explanation, "Watch" (an animated demonstration),
   "Try it" (a manipulative with small challenges), "See it another way" (extra explanations for harder ideas),
   the key idea, then "Your turn" (quick checks). Shared by every grade; needs site.js (Atlas) and manip.js (Manip).

   A chapter opts in with  lessons: [{ id, title, sub, concepts: [concept, ...] }]  in its Atlas.register call.
   concept = { id: 'zero', title, exp: ['B1.1'], skill: 'n2-blocks', hard: true,
     body: html, watch: { tool, opts, steps } or { mount(el) -> tool, steps }, try: { tool, opts, tasks: [{ do, goal(state, tool), yes }] } or { mount(el, done) },
     ways: [{ label, html, tool, opts, watch }], key: html, mistake: html, check: function () -> question (or a list of them) }
   Progress is saved under cn:<full concept id> = { seen, n, ok, got, t }. A concept is mastered when its practice skill is secure. */
(function () {
  'use strict';
  var A = window.Atlas, M = window.Manip, $ = A.$, $$ = A.$$;
  var L = (A.lessons = {});
  var ST = ['Not started', 'Seen', 'Got it', 'Mastered'];
  L.labels = ST;
  var GOT = 2; /* right first try this many times to mark "Got it" */

  function load(k, d) { try { var v = A.store(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { A.store(k, JSON.stringify(v)); }
  function grade() { return 'g' + (A.grade || ''); }

  /* full ids, chapter and lesson links, in teaching order */
  function prep(chId) {
    var ch = A.chapters[chId];
    if (!ch || !ch.lessons || ch._prepped) return ch;
    ch.lessons.forEach(function (ls, li) {
      ls.n = li + 1;
      ls.concepts.forEach(function (c, ci) {
        c.slug = c.slug || c.id;
        c.id = grade() + '-' + chId + '-' + c.slug;
        c.ch = chId; c.lesson = ls; c.n = ci + 1;
      });
    });
    ch._prepped = true;
    return ch;
  }
  function flat(chId) {
    var ch = prep(chId), out = [];
    if (ch && ch.lessons) ch.lessons.forEach(function (ls) { ls.concepts.forEach(function (c) { out.push(c); }); });
    return out;
  }
  L.flat = flat;
  L.cstate = function (c) { return load('cn:' + c.id, { seen: 0, n: 0, ok: 0, got: false }); };
  L.status = function (c) {
    var sk = c.skill ? load('sk:' + c.skill, null) : null, s = L.cstate(c);
    if (sk && sk.secure) return 3;
    if (s.got) return 2;
    if (s.seen) return 1;
    return 0;
  };
  /* every concept of the grade, for the progress page, the family page and the learning plan */
  L.all = function () {
    var out = [];
    A.meta.forEach(function (m) {
      flat(m.id).forEach(function (c) {
        out.push({ id: c.id, title: c.title, ch: m.id, chTitle: m.title, lesson: c.lesson.title, exp: c.exp || [], skill: c.skill || '', status: L.status(c), href: '#' + m.id + '/learn/' + c.slug });
      });
    });
    return out;
  };
  L.byExp = function (code) { return L.all().filter(function (c) { return c.exp.indexOf(code) >= 0; }); };
  function mark(c, patch) {
    var s = L.cstate(c);
    Object.keys(patch).forEach(function (k) { s[k] = patch[k]; });
    s.t = Date.now();
    save('cn:' + c.id, s);
    return s;
  }
  function dot(k) { return '<span class="ls-st s' + k + '" aria-hidden="true"></span>'; }
  function legend() { return '<p class="ls-legend">' + ST.map(function (t, k) { return '<span>' + dot(k) + t + '</span>'; }).join('') + '</p>'; }
  /* typed answers: whole numbers, decimals, fractions (3/4), mixed numbers (1 3/4), and the minus signs − and – */
  function parseNum(t) {
    if (A.parseNum) return A.parseNum(t);
    var x = String(t).replace(/[\u2212\u2013]/g, '-').replace(/[$,¢\s]+$/, '').replace(/^\$/, '').trim(), m;
    if ((m = x.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/))) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]);
    if ((m = x.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/))) return m[1] / m[2];
    return parseFloat(x.replace(/[^0-9.\-]/g, ''));
  }
  L.parseNum = parseNum;

  /* ---------- the chapter page ---------- */
  L.chapter = function (app, id, sub, ctx) {
    var ch = prep(id), parts = (sub || '').split('/'), tab = parts[0] || 'learn';
    var tabs = '<nav class="jump ls-tabs" aria-label="In this chapter">' +
      [['learn', 'Lessons', '#' + id], ['practice', 'Practise', '#' + id + '/practice'], ['quiz', 'Chapter quiz', '#' + id + '/quiz']].map(function (t) {
        return '<a href="' + t[2] + '"' + (tab === t[0] ? ' aria-current="page"' : '') + '>' + t[1] + '</a>';
      }).join('') + '<a href="#check-up/' + id + '">Check-up</a><a href="#progress">My progress</a></nav>';
    var h = '<div class="wrap chapter" data-strand="' + ctx.m.strand + '"><p class="crumb"><a href="#home">All chapters</a></p>' + ctx.head + tabs;
    if (tab === 'learn' && parts[1]) return concept(app, id, parts[1], h, ctx);
    if (tab === 'practice') {
      app.innerHTML = h + '<div class="quiz prac" id="practice"></div>' + nextPrev(ctx) + '</div>';
      A.practice($('#practice', app), id, ch.practice, parts[1] || null);
      return '';
    }
    if (tab === 'quiz') {
      app.innerHTML = h + '<div class="quiz" id="quiz"></div>' + nextPrev(ctx) + '</div>';
      A.quiz($('#quiz', app), id, ch.quiz);
      return '';
    }
    overview(app, id, h, ctx);
    return '';
  };
  function nextPrev(ctx) {
    return '<div class="pn">' + (ctx.prev ? '<a href="#' + ctx.prev.id + '"><small>Previous</small>' + ctx.prev.title + '</a>' : '<span></span>') +
      (ctx.next ? '<a class="nx" href="#' + ctx.next.id + '"><small>Next</small>' + ctx.next.title + '</a>' : '') + '</div>';
  }
  function overview(app, id, h, ctx) {
    var ch = A.chapters[id], all = flat(id), next = all.filter(function (c) { return L.status(c) < 2; })[0] || all[0];
    var anySeen = all.some(function (c) { return L.status(c) > 0; });
    h += '<div class="ls-go"><a class="btn" href="#' + id + '/learn/' + next.slug + '">' + (anySeen ? 'Continue: ' + next.title : 'Start the first lesson') + '</a>' +
      '<span class="t2">' + ch.lessons.length + ' lessons, ' + all.length + ' ideas. One idea at a time.</span></div>' + legend() +
      '<div class="ls-map">' + ch.lessons.map(function (ls) {
        return '<section class="ls-lesson"><h2><span class="n">' + ls.n + '</span>' + ls.title + '</h2>' + (ls.sub ? '<p class="t2">' + ls.sub + '</p>' : '') +
          '<ul class="ls-cl">' + ls.concepts.map(function (c) {
            var k = L.status(c);
            return '<li><a href="#' + id + '/learn/' + c.slug + '" title="' + ST[k] + '">' + dot(k) + '<span>' + c.title + '</span><span class="sr"> (' + ST[k] + ')</span></a></li>';
          }).join('') + '</ul></section>';
      }).join('') + '</div>' +
      '<div class="note"><p><b>How each idea works.</b> Read a short explanation, watch it happen, try it with blocks or counters, then answer a few quick questions. Getting ' + GOT + ' right on the first try marks the idea <b>Got it</b>. It becomes <b>Mastered</b> when the matching skill in Practise is secure.</p></div>' +
      nextPrev(ctx) + '</div>';
    app.innerHTML = h;
  }

  /* ---------- one concept ---------- */
  var lastIndex = -1;
  function concept(app, id, slug, h, ctx) {
    var all = flat(id), i = -1;
    all.forEach(function (c, j) { if (c.slug === slug) i = j; });
    if (slug.indexOf('end-') === 0) return lessonEnd(app, id, slug.slice(4), h, ctx);
    if (i < 0) { location.hash = '#' + id; return ''; }
    var c = all[i], ls = c.lesson, prev = all[i - 1], next = all[i + 1], dir = i < lastIndex ? ' back' : '';
    lastIndex = i;
    var st = mark(c, { seen: 1 });
    var endOfLesson = !next || next.lesson !== ls;
    h += '<div class="ls-top"><span class="ls-where">Lesson ' + ls.n + ': ' + ls.title + ' &middot; idea ' + c.n + ' of ' + ls.concepts.length + '</span>' +
      '<span class="ls-dots" aria-label="Ideas in this lesson">' + ls.concepts.map(function (x) {
        return '<a href="#' + id + '/learn/' + x.slug + '" class="s' + L.status(x) + '"' + (x === c ? ' aria-current="step"' : '') + ' aria-label="' + x.title + ' (' + ST[L.status(x)] + ')"></a>';
      }).join('') + '</span></div>' +
      '<article class="sec ls-card' + dir + '" id="lesson"><h2><span class="n">' + ls.n + '.' + c.n + '</span>' + c.title + '<span class="ls-badge">' + (st.got ? '<span class="ls-got">Got it</span>' : '') + '</span></h2>' +
      '<div class="ls-body">' + (c.body || '') + '</div>' +
      (c.watch ? '<div class="ls-part"><p class="ls-lab"><i>1</i>Watch</p><div class="ls-watch"></div></div>' : '') +
      (c.try ? '<div class="lab ls-try"><span class="lt">Try it</span><p class="ls-task"></p><div class="ls-tool"></div><p class="ls-done" aria-live="polite"></p><div class="ls-tnext"></div></div>' : '') +
      (c.ways && c.ways.length ? '<div class="ls-ways"><p>' + (c.hard ? 'Still tricky? See it another way:' : 'See it another way:') + '</p><div class="ls-wtabs">' +
        c.ways.map(function (w, j) { return '<button type="button" class="btn alt" data-w="' + j + '" aria-pressed="false">' + w.label + '</button>'; }).join('') + '</div><div class="ls-wpanel"></div></div>' : '') +
      (c.key ? '<div class="key"><b class="t">Key idea</b>' + c.key + '</div>' : '') +
      (c.mistake ? '<div class="mistake"><b class="t">For grown-ups: a common mistake</b>' + c.mistake + '<p class="t2">If you see this, point back to "Watch" or "Try it" and let the child show you again.</p></div>' : '') +
      (c.check ? '<div class="yt ls-check"></div>' : '') + '</article>' +
      '<nav class="ls-nav" aria-label="Ideas">' + (prev ? '<a class="btn alt" href="#' + id + '/learn/' + prev.slug + '">&larr; Back</a>' : '<a class="btn alt" href="#' + id + '">&larr; Lessons</a>') +
      '<a class="btn ls-next" href="#' + id + '/learn/' + (endOfLesson ? 'end-' + ls.id : next.slug) + '">' + (endOfLesson ? 'Finish the lesson' : 'Next idea') + ' &rarr;</a></nav>' + '</div>';
    app.innerHTML = h;
    var card = $('.ls-card', app);
    if (c.watch) mountWatch($('.ls-watch', card), c.watch);
    if (c.try) mountTry($('.ls-try', card), c);
    if (c.ways) mountWays($('.ls-ways', card), c.ways);
    if (c.check) checks($('.ls-check', card), c, function () {
      $('.ls-badge', card).innerHTML = '<span class="ls-got">Got it</span>';
      var nb = $('.ls-next', app); if (nb) M.bump(nb, 'ls-next-ready');
      var d = $('.ls-dots [aria-current]', app); if (d) d.className = 's' + L.status(c);
    });
    if (ctx.after) ctx.after(card, c);
    return 'lesson';
  }
  function makeTool(host, spec) {
    var el = document.createElement('div');
    host.appendChild(el);
    var opts = typeof spec.opts === 'function' ? spec.opts() : spec.opts;
    /* a custom tool gets the options too, so it can call opts.onChange(state, tool) to drive the challenges */
    return spec.mount ? spec.mount(el, opts || {}) : M.make(spec.tool, el, opts);
  }
  function mountWatch(host, w) {
    var holder = document.createElement('div');
    host.appendChild(holder);
    var stage = document.createElement('div'), tool;
    tool = w.mount ? w.mount(stage, w.opts || {}) : M.make(w.tool, stage, Object.assign({ tap: false, controls: false }, w.opts || {}));
    if (!tool.root) tool.root = stage;
    M.player(holder, tool, w.steps, { autoplay: w.autoplay });
  }
  /* "Try it": a manipulative and a short list of challenges that check themselves as the student works */
  function mountTry(box, c) {
    var t = c.try, task = $('.ls-task', box), done = $('.ls-done', box), nx = $('.ls-tnext', box), host = $('.ls-tool', box), k = 0, tool, solved = false;
    if (t.mount) {
      task.innerHTML = t.do || '';
      t.mount(host, function (msg) { done.innerHTML = msg || 'Well done.'; M.bump(done, 'yes'); mark(c, { tried: 1 }); });
      return;
    }
    var tasks = t.tasks || [];
    function show() {
      solved = false;
      var tk = tasks[k];
      task.innerHTML = tk ? (tasks.length > 1 ? '<span class="ls-tasknum">Challenge ' + (k + 1) + ' of ' + tasks.length + '</span>' : '') + tk.do : (t.free || 'Play with the tool.');
      done.textContent = ''; done.classList.remove('yes'); nx.innerHTML = '';
    }
    function check(state, tl) {
      var tk = tasks[k];
      if (!tk || solved || !tk.goal(state, tl || tool)) return;
      solved = true;
      done.innerHTML = (typeof tk.yes === 'function' ? tk.yes(state) : tk.yes) || 'Yes, that is it.';
      M.bump(done, 'yes');
      if (k + 1 < tasks.length) {
        nx.innerHTML = '<button type="button" class="btn">Next challenge</button>';
        $('button', nx).addEventListener('click', function () { k++; if (tasks[k].reset !== false && tool.reset) tool.reset(); show(); if (tasks[k].setup) tasks[k].setup(tool); });
      } else {
        mark(c, { tried: 1 });
        nx.innerHTML = '<p class="t2">All challenges done. Keep playing, or go on to "Your turn" below.</p>';
      }
    }
    var opts = Object.assign({}, typeof t.opts === 'function' ? t.opts() : t.opts);
    var user = opts.onChange;
    opts.onChange = function (s, tl) { if (user) user(s, tl); if (tool) check(s, tl); };
    show();
    tool = makeTool(host, { tool: t.tool, opts: opts, mount: t.mountTool });
    if (tasks[0] && tasks[0].setup) tasks[0].setup(tool);
  }
  function mountWays(box, ways) {
    var panel = $('.ls-wpanel', box);
    $$('.ls-wtabs .btn', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var j = +b.getAttribute('data-w'), w = ways[j], on = b.getAttribute('aria-pressed') === 'true';
        $$('.ls-wtabs .btn', box).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); x.classList.add('alt'); });
        panel.innerHTML = '';
        if (on) return;
        b.setAttribute('aria-pressed', 'true'); b.classList.remove('alt');
        panel.innerHTML = w.html || '';
        if (w.watch) mountWatch(panel, w.watch);
        if (w.tool || w.mount) makeTool(panel, w);
        M.bump(panel, 'mp-fade');
      });
    });
  }

  /* ---------- "Your turn": quick checks ---------- */
  function checks(box, c, onGot) {
    var gens = [].concat(c.check), round = 0;
    function show() {
      var gen = gens[round % gens.length], q = typeof gen === 'function' ? gen() : gen, tries = 0, done = false;
      round++;
      var uid = 'ck-' + c.slug + round;
      var h = '<p class="ytl">Your turn</p><p class="qtext">' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
      if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
      else h += '<form class="numrow"><label class="sr" for="' + uid + '">Your answer</label><input type="text" inputmode="' + (q.kb || 'decimal') + '" autocomplete="off" id="' + uid + '" placeholder="Type your answer">' + (q.unit === '$' ? '' : q.unit ? '<span class="unit">' + q.unit + '</span>' : '') + '<button class="btn" type="submit">Check</button></form>';
      h += '<div class="fb" aria-live="polite"></div><div class="ytn"></div>';
      box.innerHTML = h;
      box._q = q; /* exposed for automated checks */
      var fb = $('.fb', box);
      function shown(v) {
        if (q.type === 'mc') return q.options[v];
        if (q.show != null) return typeof q.show === 'function' ? q.show(v) : q.show;
        if (q.unit === '$') return '$' + Number(v).toFixed(2);
        return A.fmt(v) + (q.unit ? ' ' + q.unit : '');
      }
      function result(ok, btn) {
        tries++;
        if (ok) {
          done = true;
          var s = L.cstate(c), first = tries === 1, was = s.got;
          s = mark(c, { n: (s.n || 0) + 1, ok: (s.ok || 0) + (first ? 1 : 0) });
          if (!s.got && s.ok >= GOT) { s = mark(c, { got: true }); }
          fb.className = 'fb ok';
          fb.innerHTML = '<b>' + (first ? 'Yes.' : 'Yes, you fixed it.') + '</b> <span>' + (q.explain || '') + '</span>' + (!was && s.got ? '<p class="ls-got">Got it. This idea is marked on your progress page.</p>' : '');
          $$('button.opt, input, form .btn', box).forEach(function (b) { b.disabled = true; });
          $('.ytn', box).innerHTML = '<button type="button" class="btn alt">Another one</button>';
          $('.ytn .btn', box).addEventListener('click', function () { show(); var f = $('.opt, input', box); if (f) f.focus(); });
          if (!was && s.got) onGot();
          return;
        }
        if (btn) { btn.classList.add('no'); btn.disabled = true; } else M.bump($('.numrow', box), 'mp-shake');
        fb.className = 'fb bad';
        if (tries >= 2) {
          done = true;
          var s2 = L.cstate(c);
          mark(c, { n: (s2.n || 0) + 1 });
          if (q.type === 'mc') $$('.opt', box)[q.answer].classList.add('yes');
          $$('button.opt, input, form .btn', box).forEach(function (b) { b.disabled = true; });
          fb.innerHTML = '<b>The answer is ' + shown(q.answer) + '.</b> <span>' + (q.explain || '') + '</span>' +
            (q.steps && q.steps.length ? '<ol class="ls-reveal">' + q.steps.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' : '') +
            '<p class="t2">Look at "Watch" again if you like, then try another one.</p>';
          $('.ytn', box).innerHTML = '<button type="button" class="btn">Try another one</button>';
          $('.ytn .btn', box).addEventListener('click', function () { show(); var f = $('.opt, input', box); if (f) f.focus(); });
        } else fb.innerHTML = '<b>Not yet.</b> <span>' + (q.hint || 'Look at the example again.') + ' Try again.</span>';
      }
      if (q.type === 'mc') $$('.opt', box).forEach(function (b) {
        b.addEventListener('click', function () { if (done) return; var j = +b.getAttribute('data-j'); if (j === q.answer) b.classList.add('yes'); result(j === q.answer, j === q.answer ? null : b); });
      });
      else $('form', box).addEventListener('submit', function (e) {
        e.preventDefault();
        if (done) return;
        var raw = $('input', box).value, v = parseNum(raw);
        if (isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Type a number first.'; return; }
        /* a grade can judge answers its own way (accepted forms, units) with Atlas.judgeNum(q, value, raw) */
        result(A.judgeNum ? A.judgeNum(q, v, raw) : Math.abs(v - q.answer) <= (q.tol || Math.max(1e-9, 1e-9 * Math.abs(q.answer))));
      });
    }
    show();
  }

  /* ---------- end of a lesson: what was covered, and what to practise ---------- */
  function lessonEnd(app, id, lsId, h, ctx) {
    var ch = A.chapters[id], ls = ch.lessons.filter(function (x) { return x.id === lsId; })[0];
    if (!ls) { location.hash = '#' + id; return ''; }
    var nextLs = ch.lessons[ls.n], skills = {};
    ls.concepts.forEach(function (c) { if (c.skill) skills[c.skill] = 1; });
    var sk = (ch.practice || []).filter(function (s) { return skills[s.id]; });
    h += '<article class="sec ls-card"><h2><span class="n">' + ls.n + '</span>Lesson ' + ls.n + ' done: ' + ls.title + '</h2>' +
      '<p>Here is where each idea stands.</p><ul class="ls-sum">' + ls.concepts.map(function (c) {
        var k = L.status(c);
        return '<li>' + dot(k) + '<a href="#' + id + '/learn/' + c.slug + '">' + c.title + '</a> <span class="t2">' + ST[k] + '</span></li>';
      }).join('') + '</ul>' +
      (sk.length ? '<p><b>Practise to make it stick.</b> A few minutes now helps you remember tomorrow.</p><div class="btnrow">' + sk.map(function (s) { return '<a class="btn alt" href="#' + id + '/practice/' + s.id + '">Practise: ' + s.name + '</a>'; }).join('') + '</div>' : '') +
      '</article><nav class="ls-nav"><a class="btn alt" href="#' + id + '">All lessons</a>' +
      (nextLs ? '<a class="btn ls-next" href="#' + id + '/learn/' + nextLs.concepts[0].slug + '">Lesson ' + nextLs.n + ': ' + nextLs.title + ' &rarr;</a>' : '<a class="btn ls-next" href="#' + id + '/quiz">Chapter quiz &rarr;</a>') +
      '</nav></div>';
    app.innerHTML = h;
    return 'lesson';
  }

  /* ---------- My progress: every concept and skill, for the student and the grown-ups ---------- */
  L.progress = function (app) {
    var skLv = A.skillStatus || function () { return { k: 0, t: '' }; };
    var all = L.all(), cnt = [0, 0, 0, 0];
    all.forEach(function (c) { cnt[c.status]++; });
    var skills = A.allSkills ? A.allSkills() : [], secure = skills.filter(function (p) { return skLv(p.sk.id).k === 4; }).length;
    var h = '<div class="wrap chapter"><p class="crumb"><a href="#home">All chapters</a></p><header class="chead"><span class="num">Progress</span><h1>My progress</h1>' +
      '<p class="lede">Every idea and skill in this grade, and how far along each one is.</p></header>' +
      '<div class="pg-sum">' + (all.length ? '<div><b>' + (cnt[1] + cnt[2] + cnt[3]) + ' / ' + all.length + '</b>ideas seen</div><div><b>' + (cnt[2] + cnt[3]) + '</b>ideas "Got it"</div><div><b>' + cnt[3] + '</b>ideas mastered</div>' : '') +
      '<div><b>' + secure + ' / ' + skills.length + '</b>practice skills secure</div></div>' + legend();
    A.meta.forEach(function (m, i) {
      var ch = A.chapters[m.id];
      if (!ch || m.ref) return;
      var cs = flat(m.id), sks = ch.practice || [];
      var parts = [0, 0, 0, 0], tot;
      if (cs.length) { cs.forEach(function (c) { parts[L.status(c)]++; }); tot = cs.length; }
      else { sks.forEach(function (s) { var k = skLv(s.id).k; parts[k === 4 ? 3 : k >= 2 ? 2 : k ? 1 : 0]++; }); tot = sks.length || 1; }
      h += '<details class="pg-ch" data-strand="' + m.strand + '"' + (cs.length ? ' open' : '') + '><summary><span>' + (i + 1) + '. ' + m.title + '</span><span class="pg-bar" aria-hidden="true">' +
        [3, 2, 1].map(function (k) { return '<i class="b' + k + '" style="width:' + (parts[k] / tot * 100) + '%"></i>'; }).join('') + '</span><span class="t2">' +
        (cs.length ? (parts[2] + parts[3]) + ' of ' + tot + ' ideas got' : parts[3] + ' of ' + sks.length + ' skills secure') + '</span></summary>';
      if (cs.length) h += '<div class="pg-scroll"><table><thead><tr><th>Idea</th><th>Lesson</th><th>Expectation</th><th>Status</th></tr></thead><tbody>' + cs.map(function (c) {
        var k = L.status(c);
        return '<tr><td><a href="#' + m.id + '/learn/' + c.slug + '">' + c.title + '</a></td><td>' + c.lesson.title + '</td><td>' + (c.exp || []).join(', ') + '</td><td>' + dot(k) + ' ' + ST[k] + '</td></tr>';
      }).join('') + '</tbody></table></div>';
      h += '<div class="pg-scroll"><table><thead><tr><th>Practice skill</th><th>Expectation</th><th>Level</th></tr></thead><tbody>' + sks.map(function (s) {
        return '<tr><td><a href="#' + m.id + '/practice/' + s.id + '">' + s.name + '</a></td><td>' + s.code + '</td><td>' + (skLv(s.id).t || 'Not started') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
      h += '</details>';
    });
    h += '<div class="note"><p><b>For parents and tutors.</b> "Seen" means the idea was opened. "Got it" means ' + GOT + ' quick questions were right on the first try. "Mastered" means the matching practice skill reached the top level three times in a row. Signed-in students\' progress also shows on the family page.</p></div></div>';
    app.innerHTML = h;
  };

  /* ---------- Toolbox: every manipulative, free to play with ---------- */
  var BOX = [
    ['base10', 'Base-ten blocks', 'Tap + to add blocks. Tap a block to light it up and count. Group 10 ones into a ten, or break a ten apart.', { controls: true, words: function (n) { return A.words ? A.words(n) : ''; } }],
    ['disks', 'Place value disks', 'Tap + to add disks. Tap a disk to light it and count. Group 10 disks into 1 of the next place, or break 1 into 10.', { controls: true, places: [3, 2, 1, 0, -1] }],
    ['clock', 'Clock', 'Move the time forward or back and see how much time has passed.', { t: 540 }],
    ['areagrid', 'Area grid', 'Tap squares to cover a shape and count its area.', { cols: 10, rows: 6 }],
    ['scale', 'Kitchen scale', 'Put 1 kg, 100 g and 10 g blocks on the scale.', {}],
    ['counters', 'Counters', 'Tap counters to count them. Pair them up to see even and odd, or group them in tens.', { n: 13, controls: true, max: 60 }],
    ['tenframe', 'Ten-frames', 'Tap a box to put in a counter. Tap again to change its colour.', { frames: 2, two: true }],
    ['hundred', 'Hundred chart', 'Tap numbers to light them up and look for patterns.', { pages: true }],
    ['numberline', 'Number line', 'Tap or drag along the line, or make jumps.', { min: 0, max: 100, tick: 5, every: 10, step: [2, 5, 10, 20, 25], snap: 1 }],
    ['fractions', 'Fraction strips', 'Choose how many equal parts, then tap parts to shade them.', { parts: 4 }],
    ['coins', 'Coins and bills', 'Tap coins and bills to add them. Tap one on the mat to take it away.', { set: [5, 10, 25, 100, 200, 500, 1000, 2000] }],
    ['geoboard', 'Geoboard', 'Tap pegs to stretch a band into a shape.', { size: 5 }],
    ['tiles', 'Algebra tiles', 'Add positive and negative tiles. Remove zero pairs.', { x2: true }]
  ];
  /* a grade lists the tools its Toolbox shows in Atlas.tools (ids); unset shows them all */
  L.toolbox = function (app, sub) {
    var box = A.tools ? BOX.filter(function (b) { return A.tools.indexOf(b[0]) >= 0; }) : BOX;
    var cur = box.filter(function (b) { return b[0] === sub; })[0] || box[0];
    app.innerHTML = '<div class="wrap chapter"><p class="crumb"><a href="#home">All chapters</a></p><header class="chead"><span class="num">Toolbox</span><h1>Math tools</h1>' +
      '<p class="lede">The hands-on tools from the lessons, free to play with. Good for working through a question with a tutor or parent.</p></header>' +
      '<nav class="tb-pick" aria-label="Tools">' + box.map(function (b) { return '<a href="#tools/' + b[0] + '"' + (b === cur ? ' aria-current="page"' : '') + '>' + b[1] + '</a>'; }).join('') + '</nav>' +
      '<section class="sec"><h2>' + cur[1] + '</h2><p>' + cur[2] + '</p><div id="tbtool"></div></section></div>';
    M.make(cur[0], $('#tbtool', app), cur[3]);
  };

  /* left and right arrow keys move between ideas */
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var nav = $('.ls-nav');
    if (!nav) return;
    var a = e.key === 'ArrowRight' ? $('.ls-next', nav) : $('a.alt', nav);
    if (a) location.hash = a.getAttribute('href');
  });
})();
