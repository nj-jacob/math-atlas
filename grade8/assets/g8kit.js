/* Grade 8 lesson kit: small helpers that turn the chapters' own drawings into "Watch" clips and "Try it" labs
   for the shared lesson engine (lesson.js). Grade 8 only; the shared engine files stay unchanged. */
(function () {
  'use strict';
  var A = window.Atlas, M = window.Manip, K = (window.K8 = {}), uid = 0;
  function bump(e, c) { if (M && M.bump) M.bump(e, c); }

  /* Watch: a short clip of frames. frames = [[html or function, caption, ms], ...] */
  K.film = function (frames) {
    return {
      mount: function (el) {
        var t = { root: el, fast: false };
        t.paint = function (i) {
          var f = frames[i], h = typeof f[0] === 'function' ? f[0]() : f[0];
          el.innerHTML = '<div class="k8-frame' + (t.fast ? '' : ' k8-in') + '">' + h + '</div>';
        };
        t.reset = function () { t.paint(0); };
        t.reset();
        return t;
      },
      steps: frames.map(function (f, i) { return { say: f[1], act: function (t) { t.paint(i); }, ms: f[2] || 1700 }; })
    };
  };

  /* Try it: sliders and menus that redraw a picture, with challenges that check themselves.
     o = { ctrls: [{id, label, min, max, step, value, fmt} | {id, label, options: [[value, text]]}], draw(v) -> {fig, out}, tasks: [{do, goal(v), yes}] } */
  K.lab = function (o) {
    return {
      do: o.intro || '',
      mount: function (host, done) {
        var p = 'k8l' + (++uid) + '-', v = {}, k = 0, solved = false, tasks = o.tasks || [];
        host.innerHTML = '<div class="ctrl">' + o.ctrls.map(function (c) {
          if (c.options) return '<label for="' + p + c.id + '">' + c.label + '<select id="' + p + c.id + '">' + c.options.map(function (op) { return '<option value="' + op[0] + '"' + (op[0] === c.value ? ' selected' : '') + '>' + op[1] + '</option>'; }).join('') + '</select></label>';
          return '<label for="' + p + c.id + '">' + c.label + ': <output id="' + p + c.id + 'o"></output><input type="range" id="' + p + c.id + '" min="' + c.min + '" max="' + c.max + '" step="' + (c.step || 1) + '" value="' + c.value + '"></label>';
        }).join('') + '</div><p class="k8-task"></p><div class="fig k8-fig"></div><div class="out k8-out" aria-live="polite"></div><p class="k8-yes" aria-live="polite"></p><div class="k8-next"></div>';
        var task = host.querySelector('.k8-task'), fig = host.querySelector('.k8-fig'), out = host.querySelector('.k8-out'), yes = host.querySelector('.k8-yes'), nx = host.querySelector('.k8-next');
        function read() {
          o.ctrls.forEach(function (c) {
            var e = host.querySelector('#' + p + c.id), val = e.value;
            v[c.id] = c.options ? (isNaN(+val) || val === '' ? val : +val) : +val;
            if (!c.options) host.querySelector('#' + p + c.id + 'o').textContent = c.fmt ? c.fmt(v[c.id]) : A.fmt(v[c.id]);
          });
        }
        function showTask() {
          solved = false; yes.textContent = ''; nx.innerHTML = '';
          var t = tasks[k];
          task.innerHTML = t ? (tasks.length > 1 ? '<span class="ls-tasknum">Challenge ' + (k + 1) + ' of ' + tasks.length + '</span>' : '') + t.do : '';
        }
        function check() {
          var t = tasks[k];
          if (!t || solved || !t.goal(v)) return;
          solved = true;
          var msg = typeof t.yes === 'function' ? t.yes(v) : t.yes || 'Yes, that is it.';
          if (k + 1 < tasks.length) {
            yes.textContent = msg; bump(yes, 'yes');
            nx.innerHTML = '<button type="button" class="btn">Next challenge</button>';
            nx.querySelector('button').addEventListener('click', function () { k++; showTask(); render(); });
          } else { done(msg); }
        }
        function render() { read(); var r = o.draw(v) || {}; fig.innerHTML = r.fig || ''; out.innerHTML = r.out || ''; check(); }
        o.ctrls.forEach(function (c) { var e = host.querySelector('#' + p + c.id); e.addEventListener('input', render); e.addEventListener('change', render); });
        showTask(); render();
      }
    };
  };

  /* Try it: tap squares to light them up and count them. groups = [{n, cols, label, col}] */
  K.tap = function (o) {
    return {
      do: o.intro || '',
      mount: function (host, done) {
        var k = 0, solved = false, tasks = o.tasks || [], lit = o.groups.map(function (g) { var a = []; for (var i = 0; i < g.n; i++) a.push(!!(g.on && i < g.on)); return a; });
        host.innerHTML = '<p class="k8-task"></p><div class="k8-tap">' + o.groups.map(function (g, gi) {
          var h = '<div class="k8-tg" style="--k8c:' + (g.col || 'var(--strand)') + '"><div class="k8-cells" style="grid-template-columns:repeat(' + g.cols + ',auto)">';
          for (var i = 0; i < g.n; i++) h += '<button type="button" class="k8-cell' + (lit[gi][i] ? ' on' : '') + '" data-g="' + gi + '" data-i="' + i + '" aria-pressed="' + lit[gi][i] + '" aria-label="' + g.label + ', square ' + (i + 1) + ' of ' + g.n + '"' + (g.cell ? ' style="--k8s:' + g.cell + 'px"' : '') + '></button>';
          return h + '</div><p class="k8-cnt">' + g.label + ': <b>0</b>' + (g.of ? ' of ' + g.n : '') + '</p></div>';
        }).join('') + '</div><div class="out k8-out" aria-live="polite"></div><p class="k8-yes" aria-live="polite"></p><div class="k8-next"></div>' +
          '<div class="btnrow"><button type="button" class="btn alt k8-clear">Clear</button></div>';
        var task = host.querySelector('.k8-task'), out = host.querySelector('.k8-out'), yes = host.querySelector('.k8-yes'), nx = host.querySelector('.k8-next');
        function st() { return { c: lit.map(function (a) { return a.filter(Boolean).length; }), lit: lit }; }
        function paint(gi) {
          var b = host.querySelectorAll('.k8-cnt b')[gi];
          b.textContent = st().c[gi]; bump(b, 'mp-bump');
          if (o.draw) out.innerHTML = o.draw(st());
          check();
        }
        function showTask() {
          solved = false; yes.textContent = ''; nx.innerHTML = '';
          var t = tasks[k];
          task.innerHTML = t ? (tasks.length > 1 ? '<span class="ls-tasknum">Challenge ' + (k + 1) + ' of ' + tasks.length + '</span>' : '') + t.do : '';
        }
        function check() {
          var t = tasks[k];
          if (!t || solved || !t.goal(st())) return;
          solved = true;
          var msg = typeof t.yes === 'function' ? t.yes(st()) : t.yes || 'Yes.';
          if (k + 1 < tasks.length) {
            yes.textContent = msg; bump(yes, 'yes');
            nx.innerHTML = '<button type="button" class="btn">Next challenge</button>';
            nx.querySelector('button').addEventListener('click', function () { k++; showTask(); check(); });
          } else done(msg);
        }
        host.addEventListener('click', function (e) {
          var c = e.target.closest('.k8-cell');
          if (c) {
            var gi = +c.getAttribute('data-g'), i = +c.getAttribute('data-i');
            lit[gi][i] = !lit[gi][i];
            c.classList.toggle('on', lit[gi][i]); c.setAttribute('aria-pressed', String(lit[gi][i]));
            if (lit[gi][i]) bump(c, 'k8-pop');
            paint(gi);
          } else if (e.target.closest('.k8-clear')) {
            lit.forEach(function (a, gi) { a.forEach(function (x, i) { a[i] = false; }); paint(gi); });
            Array.prototype.forEach.call(host.querySelectorAll('.k8-cell'), function (c) { c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
            o.groups.forEach(function (g, gi) { paint(gi); });
          }
        });
        showTask();
        o.groups.forEach(function (g, gi) { var b = host.querySelectorAll('.k8-cnt b')[gi]; b.textContent = st().c[gi]; });
        if (o.draw) out.innerHTML = o.draw(st());
      }
    };
  };


  /* simple text frames and equation lines for clips */
  K.txt = function (lines) {
    return A.svg(400, 30 + lines.length * 36, lines.map(function (l, i) { return '<text x="200" y="' + (40 + i * 36) + '" text-anchor="middle" font-size="22"' + (i === lines.length - 1 ? ' class="tb"' : '') + '>' + l + '</text>'; }).join(''), lines.join('. '));
  };
  K.eq = function (t) { return '<p class="k8-eq">' + t + '</p>'; };

  /* Try it from one of the chapter's own interactive drawings (its "lab" boxes), with challenges.
     All of the chapter's labs are mounted so its init code finds every control; only lab number idx is shown.
     tasks: [{do, goal(g), yes}] where g(id) reads a control's value and g.text(sel) reads text in the lab. */
  K.reuse = function (chId, idx, o) {
    o = o || {};
    return {
      do: o.intro || '',
      mount: function (host, done) {
        var ch = A.chapters[chId], tmp = document.createElement('div');
        tmp.innerHTML = ch.html;
        var labs = Array.prototype.slice.call(tmp.querySelectorAll('.lab'));
        host.innerHTML = '<p class="k8-task"></p>' + labs.map(function (l, i) { l.classList.add('k8-reuse'); var lt = l.querySelector('.lt'); if (lt) lt.remove(); return '<div class="k8-rl"' + (i === idx ? '' : ' hidden') + '>' + l.outerHTML + '</div>'; }).join('') + '<p class="k8-yes" aria-live="polite"></p><div class="k8-next"></div>';
        if (ch.init) ch.init(host);
        var shown = host.querySelectorAll('.k8-rl')[idx], task = host.querySelector('.k8-task'), yes = host.querySelector('.k8-yes'), nx = host.querySelector('.k8-next'), tasks = o.tasks || [], k = 0, solved = false;
        function g(id) { var e = host.querySelector('#' + id); if (!e) return null; return isNaN(+e.value) || e.value === '' ? e.value : +e.value; }
        g.text = function (sel) { var e = shown.querySelector(sel || '.out'); return e ? e.textContent : ''; };
        g.root = shown;
        function showTask() {
          solved = false; yes.textContent = ''; nx.innerHTML = '';
          var t = tasks[k];
          task.innerHTML = t ? (tasks.length > 1 ? '<span class="ls-tasknum">Challenge ' + (k + 1) + ' of ' + tasks.length + '</span>' : '') + t.do : '';
        }
        function check() {
          var t = tasks[k];
          if (!t || solved || !t.goal(g)) return;
          solved = true;
          var msg = typeof t.yes === 'function' ? t.yes(g) : t.yes || 'Yes.';
          if (k + 1 < tasks.length) {
            yes.textContent = msg; bump(yes, 'yes');
            nx.innerHTML = '<button type="button" class="btn">Next challenge</button>';
            nx.querySelector('button').addEventListener('click', function () { k++; showTask(); setTimeout(check, 0); });
          } else done(msg);
        }
        ['input', 'change', 'click'].forEach(function (ev) { shown.addEventListener(ev, function () { setTimeout(check, 0); }); });
        showTask();
      }
    };
  };

  /* quick checks from a chapter's practice skill */
  K.chk = function (chId, skId, lv) {
    return function () {
      var sk = (A.chapters[chId].practice || []).filter(function (s) { return s.id === skId; })[0];
      return sk.gen(lv || 1);
    };
  };
  /* a fixed multiple-choice check: right answer first in the list */
  K.mc = function (q, right, wrong, hint, explain, fig) {
    return function () { var o = A.R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; };
  };
  /* a fixed numeric check */
  K.num = function (q, answer, hint, explain, extra) {
    return function () { var r = { q: q, type: 'num', answer: answer, hint: hint, explain: explain }; if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; }); return r; };
  };

  /* Try it: a counter mat for integers. +1 and -1 counters, a button that cancels zero pairs.
     o = { start: {pos, neg}, draw(st) -> html, tasks: [{do, goal(st), yes}] }, st = {pos, neg, val} */
  K.mat = function (o) {
    return {
      do: o.intro || '',
      mount: function (host, done) {
        var st0 = o.start || {}, pos = st0.pos || 0, neg = st0.neg || 0, k = 0, solved = false, tasks = o.tasks || [];
        host.innerHTML = '<p class="k8-task"></p><div class="btnrow k8-matb">' +
          '<button type="button" class="btn alt" data-a="p">Add +1</button><button type="button" class="btn alt" data-a="n">Add &minus;1</button>' +
          '<button type="button" class="btn alt" data-a="z">Cancel zero pairs</button><button type="button" class="btn alt" data-a="c">Clear</button></div>' +
          '<div class="fig k8-fig"></div><div class="out k8-out" aria-live="polite"></div><p class="k8-yes" aria-live="polite"></p><div class="k8-next"></div>';
        var task = host.querySelector('.k8-task'), fig = host.querySelector('.k8-fig'), out = host.querySelector('.k8-out'), yes = host.querySelector('.k8-yes'), nx = host.querySelector('.k8-next');
        function st() { return { pos: pos, neg: neg, val: pos - neg, n: pos + neg }; }
        function render() {
          fig.innerHTML = o.draw(st());
          out.innerHTML = pos + ' positive, ' + neg + ' negative &rarr; the mat shows <b>' + A.neg(pos - neg).replace('&minus;', '−') + '</b>';
          check();
        }
        function showTask() {
          solved = false; yes.textContent = ''; nx.innerHTML = '';
          var t = tasks[k];
          task.innerHTML = t ? (tasks.length > 1 ? '<span class="ls-tasknum">Challenge ' + (k + 1) + ' of ' + tasks.length + '</span>' : '') + t.do : '';
        }
        function check() {
          var t = tasks[k];
          if (!t || solved || !t.goal(st())) return;
          solved = true;
          var msg = typeof t.yes === 'function' ? t.yes(st()) : t.yes || 'Yes.';
          if (k + 1 < tasks.length) {
            yes.textContent = msg; bump(yes, 'yes');
            nx.innerHTML = '<button type="button" class="btn">Next challenge</button>';
            nx.querySelector('button').addEventListener('click', function () { k++; showTask(); check(); });
          } else done(msg);
        }
        host.querySelector('.k8-matb').addEventListener('click', function (e) {
          var b = e.target.closest('button'); if (!b) return;
          var a = b.getAttribute('data-a');
          if (a === 'p' && pos + neg < 27) pos++;
          else if (a === 'n' && pos + neg < 27) neg++;
          else if (a === 'z') { var m = Math.min(pos, neg); pos -= m; neg -= m; }
          else if (a === 'c') { pos = 0; neg = 0; }
          render();
        });
        showTask(); render();
      }
    };
  };
  K.fx = function (id) { return A.chapters[id].fx; };
  /* attach lessons to a chapter (they appear one idea at a time) */
  K.lessons = function (id, list) { A.chapters[id].lessons = list; };
})();
