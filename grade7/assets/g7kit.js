/* Grade 7 lesson kit: small helpers that chapters use to build one-idea-at-a-time lessons on top of the shared engine
   (assets/lesson.js and assets/manip.js). Grade 7 only; the shared files are never changed here.
   - K.slides(frames): a "Watch" clip made from the chapter's own drawings. Each frame fades in and its drawing builds itself.
   - K.lab(html, init, tasks): a "Try it" built from one of the chapter's interactive drawings, with challenges that check themselves.
   - K.ck(skillId, level): a quick check made by a practice skill, so lessons, practice and check-ups share one question bank.
   - K.why, K.uniq, K.picks: small helpers for writing more ways to ask each practice skill. */
(function () {
  'use strict';
  var A = window.Atlas, R = A.R, K = (A.k7 = {});

  /* frames: [{ say: caption, fig: html or function returning html, ms }] */
  K.slides = function (frames) {
    function html(f) { return typeof f.fig === 'function' ? f.fig() : f.fig; }
    return {
      mount: function (el) {
        el.className = 'k7-stage';
        var T = { root: el, fast: false, ep: 0 };
        T.show = function (h) {
          if (h == null) return Promise.resolve();
          if (el.offsetHeight) el.style.minHeight = el.offsetHeight + 'px';
          var d = document.createElement('div');
          d.className = 'k7-slide' + (T.fast ? '' : ' k7-in');
          d.innerHTML = h;
          el.innerHTML = '';
          el.appendChild(d);
          var sv = d.querySelector('svg');
          if (sv && !T.fast && A.drawIn) A.drawIn(sv);
          if (T.fast) { el.style.minHeight = ''; return Promise.resolve(); }
          return new Promise(function (r) { setTimeout(function () { el.style.minHeight = ''; r(); }, 450); });
        };
        T.reset = function () {
          T.ep++;
          el.style.minHeight = '';
          var f0 = frames.filter(function (f) { return f.fig != null; })[0];
          el.innerHTML = '<div class="k7-slide">' + (f0 ? html(f0) : '') + '</div>';
        };
        T.reset();
        return T;
      },
      steps: frames.map(function (f) {
        return { say: f.say, act: f.fig == null ? null : function (t) { return t.show(html(f)); }, ms: f.ms == null ? 2000 : f.ms };
      })
    };
  };

  /* tasks: [{ do, goal(host), yes }]. init(host) wires the drawing. A task is checked after every change. */
  K.lab = function (html, init, tasks, intro) {
    tasks = tasks || [];
    return {
      do: intro || (tasks[0] ? tasks[0].do : ''),
      mount: function (host, done) {
        host.innerHTML = '<div class="k7-lab">' + html + '</div>';
        init(host);
        var box = host.closest('.ls-try'), taskEl = box && box.querySelector('.ls-task'), nx = box && box.querySelector('.ls-tnext'), k = 0, solved = false;
        function show() {
          solved = false;
          if (taskEl && tasks[k]) taskEl.innerHTML = (tasks.length > 1 ? '<span class="ls-tasknum">Challenge ' + (k + 1) + ' of ' + tasks.length + '</span>' : '') + tasks[k].do;
          var d = box && box.querySelector('.ls-done');
          if (d && k) { d.textContent = ''; d.classList.remove('yes'); }
          if (nx) nx.innerHTML = '';
        }
        function test() {
          var t = tasks[k];
          if (!t || solved || !t.goal(host)) return;
          solved = true;
          done(typeof t.yes === 'function' ? t.yes(host) : t.yes);
          if (k + 1 < tasks.length && nx) {
            nx.innerHTML = '<button type="button" class="btn">Next challenge</button>';
            nx.querySelector('button').addEventListener('click', function () { k++; show(); test(); });
          } else if (nx) nx.innerHTML = '<p class="t2">All challenges done. Keep exploring, or go on to "Your turn" below.</p>';
        }
        show();
        ['input', 'change'].forEach(function (ev) { host.addEventListener(ev, function () { setTimeout(test, 0); }); });
        host.addEventListener('click', function () { setTimeout(test, 30); });
      }
    };
  };
  /* read a control in a lab */
  K.v = function (host, id) { var e = host.querySelector('#' + id); if (!e) return null; var v = e.value; return (e.type === 'range' || e.tagName === 'SELECT') && v !== '' && !isNaN(v) ? +v : v; };

  /* a quick check from a practice skill, at a given level (default: start at 1, step up to 2 on the third round) */
  var sks = null;
  function skill(id) {
    if (!sks) { sks = {}; A.meta.forEach(function (m) { var ch = A.chapters[m.id]; if (ch && ch.practice) ch.practice.forEach(function (s) { sks[s.id] = s; }); }); }
    return sks[id];
  }
  K.ck = function (id, lv) {
    return function () {
      var s = skill(id);
      if (!s) throw new Error('No practice skill ' + id);
      return s.gen(lv || 1);
    };
  };
  /* a fixed question, or a function that makes one */
  K.q = function (fn) { return fn; };
  /* ---------- question shapes: more ways to practise each skill (see docs/QUESTIONS.md) ----------
     Each chapter ends with a SHAPES block, { skillId: [[minLevel, 'shape', fn(lv)], ...] }, passed to the shared Atlas.Q.shapes.
     Every shape sets meta.k, and tests/verify/grade7.js checks its answer independently. */
  K.name = function () { return A.Q.name(); };
  K.two = function () { return A.Q.two(); };
  /* a "why" list for true/false questions: the right reason plus wrong ones, shuffled */
  K.why = function (right, wrong) { var o = R.shuffle([right].concat(wrong)); return { options: o, answer: o.indexOf(right) }; };
  /* n different values from make(); key(v) says when two values count as the same */
  K.uniq = function (n, make, key) {
    var out = [], seen = {}, tries = 0;
    key = key || String;
    while (out.length < n && tries++ < 400) { var v = make(), k = key(v); if (!seen[k]) { seen[k] = 1; out.push(v); } }
    return out;
  };
  /* indexes of the values that pass test, or null when none or all of them do (a pick question needs both kinds) */
  K.picks = function (vals, test) {
    var a = [];
    vals.forEach(function (v, i) { if (test(v)) a.push(i); });
    return a.length && a.length < vals.length ? a : null;
  };
  /* keep calling make() until it returns a question (make returns null to ask for another try) */
  K.retry = function (make) { for (var i = 0; i < 60; i++) { var q = make(); if (q) return q; } throw new Error('shape could not be made'); };
})();
