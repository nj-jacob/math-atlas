/* Grade 6 helpers for the shared lesson engine (lesson.js, manip.js). Grade-local: nothing here changes the shared files.
   G6.play(frames)  -> a "Watch" that steps through pictures: [[caption, svgOrHtml, note], ...]
   G6.lab(chapter, n, doText, test, msg) -> a "Try it" that shows the chapter's widget number n; done when test(host) is true
   G6.goal(host, test, msg, done) -> calls done(msg) the first time test(host) is true after any input
   G6.g(chapter, skill, level) -> a quick-check generator that reuses a practice skill
   G6.shapes(chapter, SHAPES) -> adds a chapter's extra question shapes to its practice skills (docs/QUESTIONS.md)
   G6.why(right, wrong) -> the "why" choices for a true-or-false question */
(function () {
  var A = window.Atlas, M = window.Manip;
  var G6 = (window.G6 = {});
  G6.frames = function (el, start) {
    var T = { root: el, fast: false, ep: 0 };
    el.classList.add('g6-frames');
    el.innerHTML = '<div class="g6-fr"></div><div class="g6-note" aria-live="polite"></div>';
    var fr = el.querySelector('.g6-fr'), nt = el.querySelector('.g6-note');
    T.wait = function (ms) { return T.fast ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); };
    T.show = function (html, note) {
      fr.innerHTML = html; nt.innerHTML = note || '';
      if (!T.fast) M.bump(fr, 'g6-in');
      return T.wait(600);
    };
    T.reset = function () { T.ep++; fr.innerHTML = start || ''; nt.innerHTML = ''; };
    T.reset();
    return T;
  };
  G6.play = function (frames, start) {
    return {
      mount: function (el) { return G6.frames(el, start === undefined ? frames[0][1] : start); },
      steps: frames.map(function (f) { return { say: f[0], act: function (t) { return t.show(f[1], f[2]); }, ms: f[3] == null ? 1500 : f[3] }; })
    };
  };
  /* Try it with one of the chapter's own widgets: the chapter page is built hidden and only widget number n is shown,
     so the chapter's init() wires it exactly as on the full page. */
  G6.lab = function (ch, n, doText, test, msg) {
    return { do: doText || '', mount: function (host, done) {
      var c = A.chapters[ch];
      host.innerHTML = '<div class="g6-hide">' + c.html + '</div>';
      var labs = host.querySelectorAll('.lab'), lab = labs[n];
      lab.classList.add('g6-keep');
      var sec = lab.parentNode; while (sec && !sec.classList.contains('sec')) sec = sec.parentNode;
      if (sec) sec.classList.add('g6-has');
      c.init(host);
      if (test) G6.goal(host, test, msg || 'Well done.', done);
    } };
  };
  G6.goal = function (host, test, msg, done) {
    var hit = false;
    function chk() { if (!hit && test(host)) { hit = true; done(typeof msg === 'function' ? msg(host) : msg); } }
    host.addEventListener('input', chk); host.addEventListener('change', chk); host.addEventListener('click', function () { setTimeout(chk, 0); });
  };
  G6.shapes = function (id, SHAPES) {
    var ch = A.chapters[id];
    ch.quizFresh = true;
    ch.practice.forEach(function (sk) {
      var plain = sk.gen, extra = SHAPES[sk.id] || [];
      sk.shapes = ['plain'].concat(extra.map(function (s) { return s[1]; }));
      sk.gen = function (lv) { return A.Q.vary(sk.id, lv, [[1, 'plain', plain]].concat(extra)); };
    });
    ch._shapes = SHAPES;
  };
  G6.why = function (right, wrong) { var o = A.R.mc(right, wrong); return { options: o.options, answer: o.answer }; };
  G6.g = function (ch, sk, lv) {
    return function () {
      var c = A.chapters[ch], s = c && c.practice.filter(function (x) { return x.id === sk; })[0];
      var q = s.gen(lv || 1); q.skill = sk; return q;
    };
  };
})();
