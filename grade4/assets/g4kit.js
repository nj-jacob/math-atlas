/* Grade 4 lesson kit: small helpers that turn Grade 4 drawings into "Watch" clips and "Try it" labs
   for the shared lesson engine (lesson.js). Grade 4 only; the shared engine files stay untouched.
   K.watch([[caption, figure html, ms], ...])  a clip: each step shows a drawing; parts that are new in a step light up.
   K.lab({ controls, render, tasks })           a hands-on lab with sliders, buttons or a list, and self-checking challenges.
   K.tap({ items, render, tasks })              a lab where you tap parts of a drawing to light them up and count. */
(function () {
  'use strict';
  var A = window.Atlas, K = (A.kit = {});
  var SVGNS = 'http://www.w3.org/2000/svg';
  function wait(t, ms) { return t.fast ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- Watch: a clip made of drawings ---------- */
  function stage(el) {
    el.classList.add('g4stage');
    var t = { root: el, fast: false };
    t.reset = function () { el.innerHTML = ''; };
    t.show = function (html) {
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      var oldSvg = el.querySelector(':scope > .g4fr svg'), newSvg = tmp.querySelector('svg');
      /* same drawing, new step: keep it on screen and light up only what changed */
      if (oldSvg && newSvg && tmp.querySelectorAll('svg').length === 1 && el.querySelectorAll(':scope > .g4fr svg').length === 1 &&
          oldSvg.getAttribute('viewBox') === newSvg.getAttribute('viewBox')) {
        var had = {};
        Array.prototype.forEach.call(oldSvg.children, function (c) { had[c.outerHTML] = (had[c.outerHTML] || 0) + 1; });
        var k = 0;
        Array.prototype.forEach.call(newSvg.children, function (c) {
          if (had[c.outerHTML]) { had[c.outerHTML]--; return; }
          if (!t.fast) { c.classList.add('g4new'); c.style.animationDelay = Math.min(k++ * 45, 900) + 'ms'; }
        });
        el.querySelector(':scope > .g4fr').innerHTML = tmp.innerHTML;
        return wait(t, 500);
      }
      var fr = document.createElement('div');
      fr.className = 'g4fr' + (t.fast ? '' : ' g4in');
      fr.innerHTML = tmp.innerHTML;
      el.innerHTML = '';
      el.appendChild(fr);
      return wait(t, 500);
    };
    return t;
  }
  /* the shared engine now has the same helper (Manip.frames); use it when present so every grade's clips look alike */
  K.watch = function (steps, o) {
    if (window.Manip && window.Manip.frames && !(o && o.own)) return window.Manip.frames(steps);
    o = o || {};
    return {
      autoplay: o.autoplay,
      mount: function (el) { var t = stage(el); if (steps[0]) { t.fast = true; t.show(typeof steps[0][1] === 'function' ? steps[0][1]() : steps[0][1]); t.fast = false; } return t; },
      steps: steps.map(function (s) {
        return { say: s[0], ms: s[2] == null ? 1500 : s[2], act: function (t) { return t.show(typeof s[1] === 'function' ? s[1]() : s[1]); } };
      })
    };
  };

  /* ---------- challenges, shared by the labs ---------- */
  function challenges(box, tasks, done) {
    var k = 0, solved = false, taskEl = box.querySelector('.g4task'), yes = box.querySelector('.g4yes'), nx = box.querySelector('.g4nx');
    function show() {
      solved = false;
      var tk = tasks[k];
      taskEl.innerHTML = tk ? (tasks.length > 1 ? '<span class="ls-tasknum">Challenge ' + (k + 1) + ' of ' + tasks.length + '</span>' : '') + tk.do : '';
      yes.textContent = ''; yes.classList.remove('yes'); nx.innerHTML = '';
    }
    show();
    return {
      first: function (api) { if (tasks[0] && tasks[0].setup) tasks[0].setup(api); },
      check: function (st, api) {
        var tk = tasks[k];
        if (!tk || solved || !tk.goal(st)) return;
        solved = true;
        yes.innerHTML = (typeof tk.yes === 'function' ? tk.yes(st) : tk.yes) || 'Yes, that is it.';
        window.Manip.bump(yes, 'yes');
        if (k + 1 < tasks.length) {
          nx.innerHTML = '<button type="button" class="btn">Next challenge</button>';
          nx.querySelector('button').addEventListener('click', function () { k++; show(); if (tasks[k].setup) tasks[k].setup(api); });
        } else {
          nx.innerHTML = '<p class="t2">All challenges done. Keep exploring, or go on to "Your turn" below.</p>';
          done(tk.end || 'Well done.');
        }
      }
    };
  }
  var uid = 0;

  /* ---------- Lab: controls + a live drawing ----------
     controls: [{ id, label, min, max, step, value, fmt } | { id, label, type: 'select', options: [[value, text]] } | { id, label, type: 'toggle', value }]
     render(state) -> { fig, out };  tasks: [{ do, goal(state), yes, setup(api) }]   api.set(id, value) */
  K.lab = function (spec) {
    return { do: spec.do || '', mount: function (host, done) {
      var me = 'g4l' + (++uid), st = {};
      var h = '<p class="g4task"></p><div class="ctrl">' + spec.controls.map(function (c) {
        var id = me + c.id;
        if (c.type === 'select') return '<label for="' + id + '">' + c.label + '<select id="' + id + '">' + c.options.map(function (op) { return '<option value="' + op[0] + '">' + op[1] + '</option>'; }).join('') + '</select></label>';
        if (c.type === 'toggle') return '<button type="button" class="btn alt g4tog" id="' + id + '" aria-pressed="false">' + c.label + '</button>';
        if (c.type === 'action') return '<button type="button" class="btn alt g4act" id="' + id + '">' + c.label + '</button>';
        if (c.type === 'number') return '<label for="' + id + '">' + c.label + '<input type="number" inputmode="numeric" id="' + id + '" min="' + c.min + '" max="' + c.max + '" value="' + c.value + '"></label>';
        /* a long slider is hard to stop on one exact number, so it also gets a box to type in */
        var big = (c.max - c.min) / (c.step || 1) > 60;
        return '<label for="' + id + '">' + c.label + ' ' + (big ? '' : '<output id="' + id + 'o"></output>') + '<input type="range" id="' + id + '" min="' + c.min + '" max="' + c.max + '" step="' + (c.step || 1) + '" value="' + c.value + '"></label>' +
          (big ? '<label class="g4box" for="' + id + 'n">or type it<input type="number" inputmode="numeric" id="' + id + 'n" min="' + c.min + '" max="' + c.max + '" step="' + (c.step || 1) + '" value="' + c.value + '"></label>' : '');
      }).join('') + '</div><div class="fig g4fig" aria-live="polite"></div><div class="out g4out"></div><p class="ls-done g4yes" aria-live="polite"></p><div class="g4nx"></div>';
      host.innerHTML = h;
      var fig = host.querySelector('.g4fig'), out = host.querySelector('.g4out'), lastFig = '';
      var api = { reinit: function () { if (spec.init) spec.init(st); draw(); }, set: function (id, v) { var e = host.querySelector('#' + me + id); if (!e) return; if (e.tagName === 'BUTTON') e.setAttribute('aria-pressed', String(!!v)); else { e.value = v; var nb = host.querySelector('#' + me + id + 'n'); if (nb) nb.value = v; } draw(); }, state: st };
      var ch = challenges(host, spec.tasks || [], done);
      function read() {
        spec.controls.forEach(function (c) {
          var e = host.querySelector('#' + me + c.id);
          if (c.type === 'action') { e.disabled = c.can ? !c.can(st) : false; return; }
          if (c.type === 'number') { var v = parseInt(e.value, 10); st[c.id] = isNaN(v) ? c.min : Math.max(c.min, Math.min(c.max, v)); return; }
          st[c.id] = c.type === 'toggle' ? e.getAttribute('aria-pressed') === 'true' : c.type === 'select' ? e.value : +e.value;
          if (c.type === 'toggle') e.classList.toggle('alt', !st[c.id]);
          var o = host.querySelector('#' + me + c.id + 'o');
          if (o) o.textContent = c.fmt ? c.fmt(st[c.id]) : st[c.id];
        });
      }
      function draw() {
        read();
        var r = spec.render(st) || {};
        if (r.fig !== lastFig) {
          /* morph the drawing so what changed lights up */
          if (fig._t) fig._t.show(r.fig || ''); else { fig._t = stage(fig); fig._t.fast = true; fig._t.show(r.fig || ''); fig._t.fast = false; }
          lastFig = r.fig;
        }
        out.innerHTML = r.out || '';
        spec.controls.forEach(function (c) { if (c.type === 'action') host.querySelector('#' + me + c.id).disabled = c.can ? !c.can(st) : false; });
        ch.check(st, api);
        st.last = '';
      }
      spec.controls.forEach(function (c) {
        var e = host.querySelector('#' + me + c.id);
        if (c.type === 'action') { e.addEventListener('click', function () { c.act(st, api); st.last = c.id; draw(); }); return; }
        if (c.type === 'toggle') { if (c.value) e.setAttribute('aria-pressed', 'true'); e.addEventListener('click', function () { e.setAttribute('aria-pressed', String(e.getAttribute('aria-pressed') !== 'true')); draw(); }); }
        else { e.addEventListener('input', draw); e.addEventListener('change', draw); }
        var nb = host.querySelector('#' + me + c.id + 'n');
        if (nb) {
          e.addEventListener('input', function () { nb.value = e.value; });
          nb.addEventListener('input', function () { var v = parseFloat(nb.value); if (!isNaN(v) && v >= c.min && v <= c.max) { e.value = v; draw(); } });
          nb.addEventListener('change', function () { nb.value = e.value; });
        }
      });
      if (spec.init) spec.init(st);
      ch.first(api);
      draw();
    } };
  };

  /* ---------- Tap lab: tap parts of a drawing to light them up ----------
     render(state) returns svg html where tappable parts carry data-k="key"; state.lit = {key: true}, state.order = [keys]
     tasks goals see the state; label(state) gives the running count shown next to the drawing */
  K.tap = function (spec) {
    return { do: spec.do || '', mount: function (host, done) {
      host.innerHTML = '<p class="g4task"></p><div class="fig g4fig g4tapfig"></div><div class="out g4out" aria-live="polite"></div>' +
        '<div class="btnrow"><button type="button" class="btn alt g4clr">Clear</button></div><p class="ls-done g4yes" aria-live="polite"></p><div class="g4nx"></div>';
      var st = { lit: {}, order: [] }, fig = host.querySelector('.g4fig'), out = host.querySelector('.g4out');
      var api = { reset: function () { st.lit = {}; st.order = []; draw(); }, state: st };
      var ch = challenges(host, spec.tasks || [], done);
      function draw(newKey) {
        fig.innerHTML = spec.render(st);
        A.$$('[data-k]', fig).forEach(function (p) {
          var k = p.getAttribute('data-k');
          p.setAttribute('tabindex', '0'); p.setAttribute('role', 'button');
          p.classList.add('g4tp');
          if (st.lit[k]) p.classList.add('g4lit');
          if (k === newKey) p.classList.add('g4flash');
        });
        out.innerHTML = spec.label ? spec.label(st) : '';
        ch.check(st, api);
      }
      function hit(e) {
        var p = e.target.closest('[data-k]');
        if (!p) return;
        var k = p.getAttribute('data-k');
        if (st.lit[k]) { delete st.lit[k]; st.order = st.order.filter(function (x) { return x !== k; }); draw(); }
        else { st.lit[k] = true; st.order.push(k); draw(k); }
      }
      fig.addEventListener('click', hit);
      fig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(e); } });
      host.querySelector('.g4clr').addEventListener('click', api.reset);
      ch.first(api);
      draw();
    } };
  };

  /* checks built from practice generators: K.gen(gen.add, 1) */
  K.gen = function (fn, lv) { return function () { return fn(lv); }; };
})();
