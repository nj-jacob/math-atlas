/* Grade 3 lesson kit: small helpers so any Grade 3 drawing can become a "Watch" clip or a hands-on "Try it".
   Works with the shared lesson engine (lesson.js) and does not change it.
   G3.view(draw, start)  -> a mount for watch or example: { mount: G3.view(...), steps: [{ say, act: function (t) { return t.set({...}); } }] }
   G3.play({ state, draw, buttons, sliders, selects, tap, info, tasks }) -> a mount for try: { mount: G3.play(...), do: '' }
   G3.turn(item), G3.skill(chapter, skillId, level) -> quick-check generators. */
(function () {
  'use strict';
  var A = window.Atlas, G = (window.G3 = {});
  function copy(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(t) { return String(t).replace(/"/g, '&quot;'); }

  /* an animated picture: each step changes the state and the drawing redraws with a soft fade */
  G.view = function (draw, start) {
    return function (el) {
      var T = { root: el, fast: false, state: null };
      function render() {
        el.innerHTML = '<div class="g3v">' + draw(T.state) + '</div>';
        if (!T.fast) el.firstChild.classList.add('g3-in');
      }
      T.reset = function () { T.state = copy(typeof start === 'function' ? start() : start); render(); };
      T.set = function (patch, ms) {
        Object.keys(patch).forEach(function (k) { T.state[k] = patch[k]; });
        render();
        return T.fast ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms == null ? 450 : ms); });
      };
      /* run a list of small changes one after another, like counting up */
      T.seq = function (patches, ms) {
        var p = Promise.resolve();
        patches.forEach(function (pt) { p = p.then(function () { return T.set(pt, ms == null ? 380 : ms); }); });
        return p;
      };
      T.reset();
      return T;
    };
  };

  /* a hands-on activity: a drawing, buttons or sliders that change it, and challenges that check themselves */
  G.play = function (o) {
    return function (host, done) {
      var tasks = o.tasks || [], k = 0, s, solved = false;
      host.innerHTML = '<p class="g3-task"></p><div class="g3-fig fig"></div><p class="g3-info" aria-live="polite"></p><div class="g3-ctl"></div><p class="g3-msg" aria-live="polite"></p><div class="g3-nx"></div>';
      var task = host.querySelector('.g3-task'), fig = host.querySelector('.g3-fig'), info = host.querySelector('.g3-info'), ctl = host.querySelector('.g3-ctl'), msg = host.querySelector('.g3-msg'), nx = host.querySelector('.g3-nx');
      var uid = 'g3p' + Math.floor(Math.random() * 1e6);
      var h = '';
      (o.selects || []).forEach(function (c, i) {
        h += '<label class="g3-sel" for="' + uid + 's' + i + '">' + c.label + '<select id="' + uid + 's' + i + '" data-s="' + i + '">' + c.options.map(function (op) { return '<option value="' + esc(op[0]) + '">' + op[1] + '</option>'; }).join('') + '</select></label>';
      });
      (o.sliders || []).forEach(function (c, i) {
        h += '<label class="g3-sl" for="' + uid + 'r' + i + '"><span>' + c.label + ': <output></output></span><input type="range" id="' + uid + 'r' + i + '" data-r="' + i + '" min="' + c.min + '" max="' + c.max + '" step="' + (c.step || 1) + '"></label>';
      });
      if (o.buttons) h += '<div class="btnrow">' + o.buttons.map(function (b, i) { return '<button type="button" class="btn alt" data-b="' + i + '">' + b.label + '</button>'; }).join('') + '</div>';
      ctl.innerHTML = h;
      function syncCtl() {
        (o.sliders || []).forEach(function (c, i) {
          var r = ctl.querySelector('[data-r="' + i + '"]');
          r.value = s[c.key];
          r.parentNode.querySelector('output').textContent = c.fmt ? c.fmt(s[c.key]) : s[c.key];
        });
        (o.selects || []).forEach(function (c, i) { ctl.querySelector('[data-s="' + i + '"]').value = String(s[c.key]); });
      }
      function render() {
        fig.innerHTML = o.draw(s);
        fig.classList.remove('g3-in'); void fig.offsetWidth; fig.classList.add('g3-in');
        info.innerHTML = o.info ? o.info(s) : '';
        syncCtl();
        if (o.tap) Array.prototype.forEach.call(fig.querySelectorAll('[data-tap]'), function (g) {
          g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
          function hit() { var v = g.getAttribute('data-tap'); o.tap(s, v); changed(); var f = fig.querySelector('[data-tap="' + v + '"]'); if (f) f.focus(); }
          g.addEventListener('click', hit);
          g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(); } });
        });
      }
      function showTask() {
        var tk = tasks[k];
        task.innerHTML = tk ? (tasks.length > 1 ? '<span class="ls-tasknum">Challenge ' + (k + 1) + ' of ' + tasks.length + '</span>' : '') + tk.do : (o.free || 'Explore.');
        msg.textContent = ''; msg.classList.remove('yes'); nx.innerHTML = ''; solved = false;
      }
      function check() {
        var tk = tasks[k];
        if (!tk || solved || !tk.goal(s)) return;
        solved = true;
        msg.innerHTML = typeof tk.yes === 'function' ? tk.yes(s) : tk.yes || 'Yes, that is it.';
        msg.classList.remove('yes'); void msg.offsetWidth; msg.classList.add('yes');
        if (k + 1 < tasks.length) {
          nx.innerHTML = '<button type="button" class="btn">Next challenge</button>';
          nx.querySelector('button').addEventListener('click', function () {
            k++;
            if (tasks[k].reset !== false) s = copy(typeof o.state === 'function' ? o.state() : o.state);
            if (tasks[k].setup) tasks[k].setup(s);
            showTask(); render();
          });
        } else {
          nx.innerHTML = '<p class="t2">All challenges done. Keep exploring, or go on to "Your turn" below.</p>';
          done('');
        }
      }
      function changed() { render(); check(); }
      ctl.addEventListener('click', function (e) { var b = e.target.closest('[data-b]'); if (!b) return; o.buttons[+b.getAttribute('data-b')].act(s); changed(); });
      ctl.addEventListener('input', function (e) {
        var r = e.target.getAttribute('data-r'), q = e.target.getAttribute('data-s');
        if (r != null) { var c = o.sliders[+r]; s[c.key] = +e.target.value; }
        else if (q != null) { var d = o.selects[+q], v = e.target.value; s[d.key] = isNaN(+v) ? v : +v; if (d.change) d.change(s); }
        changed();
      });
      s = copy(typeof o.state === 'function' ? o.state() : o.state);
      if (tasks[0] && tasks[0].setup) tasks[0].setup(s);
      showTask(); render();
    };
  };

  /* quick checks */
  G.turn = function (it) {
    return function () {
      var order = it.options.map(function (_, i) { return i; }).sort(function () { return Math.random() - 0.5; });
      return { q: it.q, type: 'mc', fig: it.fig || '', options: order.map(function (i) { return it.options[i]; }), answer: order.indexOf(it.answer), hint: it.why, explain: it.why };
    };
  };
  G.skill = function (ch, id, lv) {
    return function () { var s = A.chapters[ch].practice.filter(function (x) { return x.id === id; })[0], q = s.gen(lv || 1); q.skill = id; return q; };
  };
})();
