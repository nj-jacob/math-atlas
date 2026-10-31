/* Grade 2 lesson helpers (this grade only; the shared engine is lesson.js + manip.js).
   K.clip(steps): a "Watch" clip built from drawings. Each step shows one frame; parts marked with K.pop() appear one after another.
   K.lab(html, init, text): a "Try it" activity made from one of this grade's own drawings and controls.
   K.T(chapter, key) and K.P(chapter, skill, level): reuse "Your turn" and practice questions as quick checks.
   K.why and K.who help write more ways to ask each practice skill (see docs/QUESTIONS.md). */
(function () {
  var A = window.Atlas, K = (A.kit = {});
  K.stage = function (el) {
    var T = { root: el, fast: false, ep: 0 };
    el.classList.add('g2-stage');
    el.innerHTML = '<div class="g2-fr"></div>';
    var fr = el.firstChild;
    T.wait = function (ms) { return T.fast ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); };
    T.show = function (html, ms) {
      fr.innerHTML = html;
      fr.classList.toggle('g2-still', T.fast);
      if (!T.fast) { fr.classList.remove('g2-in'); void fr.offsetWidth; fr.classList.add('g2-in'); }
      return T.wait(ms == null ? 600 : ms);
    };
    T.reset = function () { T.ep++; fr.innerHTML = ''; };
    return T;
  };
  /* steps: [[caption, frame html, pause ms], ...] */
  K.clip = function (steps) {
    return {
      mount: K.stage,
      steps: steps.map(function (s) { return { say: s[0], act: function (t) { return t.show(typeof s[1] === 'function' ? s[1]() : s[1], 500); }, ms: s[2] || 1500 }; })
    };
  };
  /* wrap SVG parts so they appear one after another */
  K.pop = function (svgPart, i) { return '<g class="g2a" style="--i:' + (i || 0) + '">' + svgPart + '</g>'; };
  /* a "Try it" made from html + init(root, changed). done() fires after the first real change. */
  K.lab = function (html, init, text) {
    return {
      do: text,
      mount: function (host, done) {
        host.innerHTML = '<div class="g2-lab">' + html + '</div>';
        var n = 0, said = false;
        init(host.firstChild, function (msg) { n++; if (!said && (n > 1 || msg)) { said = true; done(msg || 'Nice work. Keep exploring, then try "Your turn" below.'); } });
      }
    };
  };
  K.T = function (ch, k) { return function () { return A.chapters[ch].turns[k](); }; };
  K.P = function (ch, id, lv) {
    return function () {
      var s = A.chapters[ch].practice.filter(function (x) { return x.id === id; })[0];
      return s.gen(typeof lv === 'function' ? lv() : lv || 1);
    };
  };
  /* ---------- question shapes ----------
     Each chapter wires its SHAPES in with the shared Atlas.Q.shapes(chapterId, SHAPES).
     Every shape sets meta.k, checked again in tests/verify/grade2.js. */
  /* the "why" choices for a true-or-false question: the right reason plus wrong ones, shuffled */
  K.why = function (right, wrong) { var o = A.R.mc(right, wrong); return { options: o.options, answer: o.answer }; };
  /* a child's name for a story or a mistake */
  K.who = function () { return A.Q.name(); };
  /* a "this, not that" box */
  K.vs = function (a, b) { return '<div class="vs"><div><b class="t">This</b><p>' + a + '</p></div><div><b class="t">Not that</b><p>' + b + '</p></div></div>'; };
})();
