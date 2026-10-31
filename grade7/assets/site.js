/* Grade 7 Math Atlas: tiny hash router, chapter registry, practice questions, adaptive practice and check-up. No dependencies. */
(function () {
  'use strict';
  var Atlas = (window.Atlas = {
    chapters: {},
    strands: { B: 'Number', C: 'Algebra', D: 'Data', E: 'Spatial Sense', F: 'Financial Literacy' },
    meta: [
      { id: 'powers-factors', title: 'Powers, Roots and Factors', sub: 'big numbers, exponents, square roots, GCF and LCM', strand: 'B', codes: 'B1.1, B1.2, B2.6, B2.7',
        desc: 'Numbers to one billion, powers of ten, perfect squares, square roots, common factors and common multiples.' },
      { id: 'fractions', title: 'Fractions', sub: 'simplify, compare, add and subtract', strand: 'B', codes: 'B1.4, B1.5, B2.5',
        desc: 'Simplify with the GCF, compare and order, find a fraction between two others, add and subtract.' },
      { id: 'mult-div', title: 'Multiplying and Dividing', sub: 'fractions, decimals, rounding, order of operations', strand: 'B', codes: 'B1.6, B2.1, B2.8, B2.9',
        desc: 'Round decimals, multiply and divide fractions and decimals, and use the order of operations.' },
      { id: 'integers', title: 'Integers', sub: 'numbers below zero', strand: 'B', codes: 'B1.3, B2.4, C1.4',
        desc: 'Negative numbers on a line and a thermometer, comparing, adding and subtracting integers, and integer patterns.' },
      { id: 'percent-ratio', title: 'Percents, Ratios and Rates', sub: 'comparing amounts fairly', strand: 'B', codes: 'B1.7, B2.2, B2.3, B2.10',
        desc: 'Fraction, decimal and percent equivalents, quick percent changes, unit rates and proportional reasoning.' },
      { id: 'algebra', title: 'Patterns, Expressions and Equations', sub: 'rules, variables, balance, code', strand: 'C', codes: 'C1.1 to C3.2',
        desc: 'Linear growing patterns, like terms, evaluating, solving equations and inequalities, and reading code.' },
      { id: 'data-probability', title: 'Data and Probability', sub: 'circle graphs, averages, chance', strand: 'D', codes: 'D1.1 to D2.2',
        desc: 'Kinds of data, circle graphs, mean, median and mode, misleading graphs, independent and dependent events.' },
      { id: 'shapes-moves', title: 'Shapes, Views and Moves', sub: '3-D objects and transformations', strand: 'E', codes: 'E1.1 to E1.4',
        desc: 'Prisms, pyramids and cylinders, top, front and side views, translations, reflections, rotations and dilations.' },
      { id: 'circles-volume', title: 'Circles, Surface Area and Volume', sub: 'pi, cylinders and prisms', strand: 'E', codes: 'E2.1 to E2.7',
        desc: 'Circumference and area of circles, mL and cubic centimetres, unit conversions, volume and surface area.' },
      { id: 'money', title: 'Money Matters', sub: 'exchange rates, budgets, interest', strand: 'F', codes: 'F1.1 to F1.6',
        desc: 'Convert currencies, plan a budget for a big goal, interest on savings and loans, and compare accounts.' },
      { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
        desc: 'Powers, squares, equivalents, integer rules, formulas and units.' }
    ]
  });

  var $ = (Atlas.$ = function (s, r) { return (r || document).querySelector(s); });
  Atlas.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  Atlas.register = function (id, ch) { Atlas.chapters[id] = ch; };

  /* Canadian number style: a space groups numbers of 5 or more digits. */
  Atlas.fmt = function (n) {
    var s = String(n), neg = '';
    if (s.charAt(0) === '-') { neg = '-'; s = s.slice(1); }
    var p = s.split('.'), i = p[0];
    if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return neg + i + (p.length > 1 ? '.' + p[1] : '');
  };
  Atlas.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  Atlas.money = function (c) { return '$' + (c / 100).toFixed(2); };
  /* round away floating point noise: 0.1 + 0.2 -> 0.3 */
  Atlas.clean = function (x) { return Math.round(x * 1e6) / 1e6; };
  /* stacked fractions in text: Atlas.fr(3, 4), Atlas.mixed(2, 1, 4) */
  Atlas.fr = function (n, d) {
    var neg = typeof n === 'number' && n < 0 ? '&minus;' : '';
    return neg + '<span class="fr"><span>' + (neg ? -n : n) + '</span><span>' + d + '</span></span>';
  };
  Atlas.mixed = function (w, n, d) { return (w < 0 ? '&minus;' + (-w) : w) + (n ? '&#8202;' + Atlas.fr(n, d) : ''); };
  /* a fraction n/d in simplest form, as a mixed number if it is more than 1 */
  Atlas.frs = function (n, d, plain) {
    if (d < 0) { n = -n; d = -d; }
    var g = Atlas.gcd(n, d) || 1; n /= g; d /= g;
    if (d === 1) return String(n);
    var w = Math.trunc(n / d), r = Math.abs(n % d);
    if (plain) return (w ? w + ' ' : (n < 0 ? '-' : '')) + r + '/' + d;
    return w ? Atlas.mixed(w, r, d) : Atlas.fr(n, d);
  };
  /* is the typed answer a fraction in lowest terms equal to n/d? */
  Atlas.lowest = function (n, d) {
    return function (t) {
      t = String(t).trim().replace(/\u2212/g, '-');
      var m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/), w = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
      if (m) return Atlas.gcd(+m[1], +m[2]) === 1 && Math.abs(m[1] / m[2] - n / d) < 1e-9;
      if (w) return Atlas.gcd(+w[2], +w[3]) === 1 && +w[2] < +w[3] && Math.abs(Math.abs(+w[1]) + w[2] / w[3] - Math.abs(n / d)) < 1e-9;
      return /^-?\d+$/.test(t) && +t === n / d;
    };
  };

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem('g7atlas:' + k); localStorage.setItem('g7atlas:' + k, v); } catch (e) { return null; }
  }
  function load(k, d) { try { var v = store(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { store(k, JSON.stringify(v)); }
  Atlas.store = store;

  /* random helpers for practice generators */
  var R = (Atlas.R = {
    int: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },
    /* multiple choice: correct answer plus distractors, duplicates removed, shuffled */
    mc: function (right, wrong) {
      var seen = {}, opts = [String(right)];
      seen[String(right)] = 1;
      wrong.forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } });
      opts = R.shuffle(opts);
      return { options: opts, answer: opts.indexOf(String(right)) };
    }
  });

  /* drawings shared by chapters and practice questions */
  Atlas.svg = function (w, h, inner, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" role="img" aria-label="' + (label || '') + '">' + inner + '</svg>';
  };
  Atlas.draw = {
    /* a bar split into d parts with n shaded */
    bar: function (n, d, w, label) {
      w = w || 360;
      var s = '', cw = (w - 4) / d;
      for (var i = 0; i < d; i++) s += '<rect x="' + (2 + i * cw) + '" y="2" width="' + cw + '" height="34" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
      return Atlas.svg(w, 38, s, label || n + ' of ' + d + ' equal parts shaded');
    },
    /* n pieces of size 1/d, drawn across as many whole bars as needed */
    wholes: function (n, d, label) {
      var count = Math.max(1, Math.ceil(n / d)), bw = Math.min(150, 520 / count - 8), s = '';
      for (var w = 0; w < count; w++) for (var i = 0; i < d; i++) {
        var k = w * d + i;
        s += '<rect x="' + (2 + w * (bw + 8) + i * bw / d) + '" y="2" width="' + bw / d + '" height="34" style="fill:' + (k < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
      }
      return Atlas.svg(Math.ceil(count * (bw + 8)), 38, s, label || n + ' pieces of size 1/' + d);
    },
    /* hundred grid with n squares shaded */
    grid: function (n, size) {
      size = size || 18;
      var s = '';
      for (var i = 0; i < 100; i++) s += '<rect x="' + (2 + (i % 10) * size) + '" y="' + (2 + Math.floor(i / 10) * size) + '" width="' + size + '" height="' + size + '" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1"/>';
      return Atlas.svg(size * 10 + 4, size * 10 + 4, s, n + ' of 100 squares shaded');
    },
    /* number line from a to b with tick labels and an optional marked point */
    line: function (a, b, step, mark, label) {
      var W = 440, x0 = 24, x1 = W - 24, s = '<line x1="' + x0 + '" y1="30" x2="' + x1 + '" y2="30" style="stroke:var(--ink)" stroke-width="2"/>';
      var n = Math.round((b - a) / step);
      for (var i = 0; i <= n; i++) {
        var v = Atlas.clean(a + i * step), x = x0 + (x1 - x0) * i / n;
        s += '<line x1="' + x + '" y1="22" x2="' + x + '" y2="38" style="stroke:var(--ink)" stroke-width="2"/>' +
          (n <= 10 || i % Math.ceil(n / 10) === 0 ? '<text x="' + x + '" y="56" text-anchor="middle" font-size="13">' + Atlas.fmt(v) + '</text>' : '');
      }
      if (mark !== undefined && mark !== null) {
        var mx = x0 + (x1 - x0) * (mark - a) / (b - a);
        s += '<circle cx="' + mx + '" cy="30" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
      }
      return Atlas.svg(W, 62, s, label || 'Number line from ' + a + ' to ' + b);
    }
  };

  /* ---- place value pictures. One colour per place, used for disks and base-ten blocks.
     Place index p: 0 ones, 1 tens, 2 hundreds, 3 thousands, 4 ten thousands, 5 hundred thousands. ---- */
  Atlas.PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands'];
  Atlas.PLACE1 = ['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand'];
  Atlas.pc = function (p) { return 'var(--p' + p + ')'; };
  /* a single place value disk; small disks (r < 12) have no label */
  Atlas.draw.disk = function (x, y, r, p) {
    var lab = Atlas.fmt(Math.pow(10, p)), fs = lab.length <= 3 ? r * 0.8 : lab.length === 4 ? r * 0.62 : r * 0.48;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + Atlas.pc(p) + '" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>' +
      (r >= 12 ? '<text x="' + x + '" y="' + (y + fs * 0.36) + '" text-anchor="middle" font-size="' + fs.toFixed(1) + '" font-weight="700" style="fill:' + (p ? '#fff' : '#13203a') + '">' + lab + '</text>' : '');
  };
  /* labelled disks for a list of groups [{p, n}], one row per group, in the order given */
  Atlas.draw.disks = function (groups, label) {
    var r = 17, gap = 38, s = '', y = 22, maxN = 1;
    groups.forEach(function (g) { maxN = Math.max(maxN, Math.min(g.n, 10)); });
    var W = Math.max(150, 120 + maxN * gap);
    groups.forEach(function (g) {
      var rows = Math.ceil(g.n / 10) || 1;
      s += '<text x="4" y="' + (y + 5) + '" font-size="13" class="t2">' + Atlas.PLACES[g.p] + '</text>';
      for (var i = 0; i < g.n; i++) s += Atlas.draw.disk(120 + (i % 10) * gap, y + Math.floor(i / 10) * gap, r, g.p);
      y += rows * gap + 4;
    });
    return Atlas.svg(W, y - 2, s, label || 'Place value disks');
  };
  /* a box drawn in oblique view. a wide, b deep, c tall; na, nb, nc grid lines per edge */
  Atlas.draw.prism = function (x, y, a, b, c, na, nb, nc, p) {
    var k = 0.42, dx = b * k, dy = -b * k, col = Atlas.pc(p), s = '', i, t;
    var ln = function (x1, y1, x2, y2) { return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>'; };
    s += '<polygon points="' + [x, y - c, x + a, y - c, x + a + dx, y - c + dy, x + dx, y - c + dy].join(',') + '" style="fill:color-mix(in srgb,' + col + ' 62%,#fff)"/>';
    s += '<polygon points="' + [x + a, y, x + a, y - c, x + a + dx, y - c + dy, x + a + dx, y + dy].join(',') + '" style="fill:color-mix(in srgb,' + col + ' 72%,#000)"/>';
    s += '<rect x="' + x + '" y="' + (y - c) + '" width="' + a + '" height="' + c + '" style="fill:' + col + '"/>';
    var g = '';
    for (i = 1; i < na; i++) { t = x + a * i / na; g += ln(t, y, t, y - c) + ln(t, y - c, t + dx, y - c + dy); }
    for (i = 1; i < nc; i++) { t = y - c * i / nc; g += ln(x, t, x + a, t) + ln(x + a, t, x + a + dx, t + dy); }
    for (i = 1; i < nb; i++) { t = i / nb; g += ln(x + dx * t, y - c + dy * t, x + a + dx * t, y - c + dy * t) + ln(x + a + dx * t, y + dy * t, x + a + dx * t, y - c + dy * t); }
    s += '<g stroke="rgba(0,0,0,.35)" stroke-width="1">' + g + '</g>';
    s += '<polygon points="' + [x, y, x, y - c, x + dx, y - c + dy, x + a + dx, y - c + dy, x + a + dx, y + dy, x + a, y].join(',') + '" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="1.5" stroke-linejoin="round"/>';
    return s;
  };
  /* base-ten blocks for one place. u is the size of a small cube. Returns {svg, w, h}. */
  Atlas.draw.block = function (x, y, p, u) {
    var P = Atlas.draw.prism, k = 0.42;
    var dims = [[1, 1, 1, 1, 1, 1], [1, 1, 10, 1, 1, 10], [10, 1, 10, 10, 1, 10], [10, 10, 10, 10, 10, 10]][p];
    var a = dims[0] * u, b = dims[1] * u, c = dims[2] * u;
    return { svg: P(x, y, a, b, c, dims[3], dims[4], dims[5], p), w: a + b * k, h: c + b * k };
  };
  /* a picture of a whole number up to 9999 in base-ten blocks, wrapping onto new rows */
  Atlas.draw.blocks = function (n, label, W) {
    W = W || 540;
    var u = 5, s = '', x = 4, rowH = 0, top = 4, items = [], digits = String(n).split('').reverse();
    for (var p = 3; p >= 0; p--) for (var i = 0; i < (+digits[p] || 0); i++) items.push(p);
    var rows = [[]], rx = 4;
    items.forEach(function (p, j) {
      var b = Atlas.draw.block(0, 0, p, u), row = rows[rows.length - 1];
      var gap = row.length ? (items[j - 1] !== p ? 18 : 6) : 0;
      if (row.length && rx + gap + b.w > W) { rows.push(row = []); rx = 4; gap = 0; }
      row.push({ p: p, x: rx + gap, b: b });
      rx += gap + b.w;
    });
    var y = top, maxX = 0;
    rows.forEach(function (row) {
      var h = 0;
      row.forEach(function (it) { h = Math.max(h, it.b.h); });
      row.forEach(function (it) { s += Atlas.draw.block(it.x, y + h, it.p, u).svg; maxX = Math.max(maxX, it.x + it.b.w); });
      y += h + 12;
    });
    return Atlas.svg(Math.ceil(maxX + 4), Math.ceil(y), s, label || 'Base-ten blocks showing ' + n);
  };

  Atlas.bind = function (root, ids, fn) {
    ids.forEach(function (i) {
      var e = $('#' + i, root);
      if (e) { e.addEventListener('input', fn); e.addEventListener('change', fn); }
    });
    fn();
  };

  function shown(q, v) {
    if (q.type === 'mc') return q.options[v];
    if (q.show !== undefined && v === q.answer) return q.show;
    var a = Atlas.fmt(v);
    if (q.unit === '$') return '$' + Number(v).toFixed(2);
    return a + (q.unit ? ' ' + q.unit : '');
  }
  function unitHtml(q) { return q.unit && q.unit !== '$' ? '<span class="unit">' + q.unit + '</span>' : ''; }
  /* accepts 12 000, -4, \u22124, 3/4, -3/4 and mixed numbers like 2 1/2 */
  function parseNum(t) {
    t = String(t).replace(/\u2212/g, '-').replace(/,/g, '').trim();
    var m = t.match(/^(-?)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]);
    m = t.match(/^(-?\s*\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/);
    if (m) return +m[2] ? parseFloat(m[1].replace(/\s/g, '')) / +m[2] : NaN;
    return parseFloat(t.replace(/[^0-9.\-]/g, ''));
  }
  Atlas.parseNum = parseNum;
  function numOk(q, v) { return Math.abs(v - q.answer) <= (q.tol || 1e-9); }
  /* q.accept(raw text) lets a question insist on a form, such as lowest terms */
  function judgeNum(q, v, raw) { return q.accept ? q.accept(raw) : numOk(q, v); }
  Atlas.judgeNum = judgeNum;
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text.replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus '));
    u.lang = 'en-CA'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
  Atlas.speak = speak;
  /* text for reading aloud: powers are said in words, drawings are skipped */
  function textOf(el) {
    var c = el.cloneNode(true);
    Atlas.$$('svg,.fig,button,.sr', c).forEach(function (x) { x.parentNode.removeChild(x); });
    Atlas.$$('.fr', c).forEach(function (x) { var p = x.children; x.textContent = ' ' + p[0].textContent + ' over ' + p[1].textContent + ' '; });
    Atlas.$$('sup', c).forEach(function (x) { x.textContent = x.textContent === '2' ? ' squared ' : x.textContent === '3' ? ' cubed ' : ' to the power of ' + x.textContent + ' '; });
    return c.textContent.replace(/\u221a/g, ' the square root of ').replace(/\s+/g, ' ');
  }
  Atlas.textOf = textOf;
  function sayBtn() { return 'speechSynthesis' in window ? '<button type="button" class="say" aria-label="Read the question aloud">Read aloud</button>' : ''; }

  /* Practice questions.
     {q, type:'mc', options:[...], answer:index, explain, hint}
     {q, type:'num', answer:number, tol, unit, explain, hint} */
  Atlas.quiz = function (box, id, qs) {
    var st = qs.map(function () { return { tries: 0, done: false, first: false }; });
    function score() {
      var d = st.filter(function (s) { return s.done; }).length;
      var r = st.filter(function (s) { return s.first; }).length;
      var el = $('.qscore', box);
      if (d === qs.length) {
        el.textContent = r + ' of ' + qs.length + ' right on the first try';
        var best = parseInt(store('best:' + id) || '-1', 10);
        if (r > best) store('best:' + id, String(r));
      } else el.textContent = d + ' of ' + qs.length + ' answered';
    }
    box.innerHTML = '<div class="qhead"><h2>Chapter quiz</h2><p class="qscore" aria-live="polite"></p></div>' +
      '<p class="qintro">Seven questions about the whole chapter. You get a hint after a wrong answer, then a second try.</p>';
    qs.forEach(function (q, i) {
      var d = document.createElement('div');
      d.className = 'q';
      var h = '<p class="qtext"><span class="qn">' + (i + 1) + '</span>' + q.q + '</p>';
      if (q.fig) h += '<div class="fig">' + q.fig + '</div>';
      if (q.type === 'mc') {
        h += '<div class="opts">' + q.options.map(function (o, j) {
          return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>';
        }).join('') + '</div>';
      } else {
        h += '<form class="numrow"><label class="sr" for="q-' + id + '-' + i + '">Your answer</label>' +
          (q.unit === '$' ? '<span class="unit">$</span>' : '') +
          '<input type="text" inputmode="' + (q.kb || 'decimal') + '" autocomplete="off" id="q-' + id + '-' + i + '" placeholder="Type your answer">' +
          unitHtml(q) + '<button class="btn" type="submit">Check</button></form>';
      }
      h += '<div class="fb" aria-live="polite"></div>';
      d.innerHTML = h;
      box.appendChild(d);
      var fb = $('.fb', d), s = st[i];
      function finish(ok) {
        s.done = true;
        if (ok && s.tries === 1) s.first = true;
        fb.className = 'fb ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = '<b>' + (ok ? 'Correct.' : 'The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span>';
        Atlas.$$('button,input', d).forEach(function (b) { b.disabled = true; });
        score();
      }
      function wrong() {
        fb.className = 'fb bad';
        fb.innerHTML = '<b>Not quite.</b> <span>' + (q.hint || 'Have another go.') + '</span>';
      }
      if (q.type === 'mc') {
        Atlas.$$('.opt', d).forEach(function (b) {
          b.addEventListener('click', function () {
            if (s.done) return;
            s.tries++;
            var j = +b.getAttribute('data-j');
            if (j === q.answer) { b.classList.add('yes'); finish(true); }
            else {
              b.classList.add('no'); b.disabled = true;
              if (s.tries >= 2) { Atlas.$$('.opt', d)[q.answer].classList.add('yes'); finish(false); } else wrong();
            }
          });
        });
      } else {
        $('form', d).addEventListener('submit', function (e) {
          e.preventDefault();
          if (s.done) return;
          var raw = $('input', d).value, v = parseNum(raw);
          if (isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Type a number first.'; return; }
          s.tries++;
          if (judgeNum(q, v, raw)) finish(true);
          else if (s.tries >= 2) finish(false); else wrong();
        });
      }
    });
    score();
  };

  /* ---------- Your turn: one quick question straight after a worked example (I do, we do, you do) ----------
     Atlas.yt({q, type:'mc', options, answer, hint, explain}) or {q, answer:number, unit, hint, explain} returns html. */
  var YT = Atlas._yt = [];
  Atlas.yt = function (q) {
    if (!q.type) q.type = 'num';
    YT.push(q);
    var i = YT.length - 1, h = '<div class="yt" data-yt="' + i + '"><b class="t">Your turn</b><p class="qtext">' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
    if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
    else h += '<form class="numrow"><label class="sr" for="yt' + i + '">Your answer</label>' + (q.unit === '$' ? '<span class="unit">$</span>' : '') +
      '<input type="text" inputmode="' + (q.kb || 'decimal') + '" autocomplete="off" id="yt' + i + '" placeholder="Type your answer">' + unitHtml(q) + '<button class="btn" type="submit">Check</button></form>';
    return h + '<div class="fb" aria-live="polite"></div></div>';
  };
  function wireYt(root) {
    Atlas.$$('.yt', root).forEach(function (d) {
      var q = YT[+d.getAttribute('data-yt')], tries = 0, fb = $('.fb', d), over = false;
      function end(ok) {
        over = true;
        fb.className = 'fb ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = '<b>' + (ok ? (tries === 1 ? 'Yes.' : 'Yes, on the second try.') : 'The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span>';
        Atlas.$$('button,input', d).forEach(function (b) { b.disabled = true; });
        if (q.type === 'mc') Atlas.$$('.opt', d)[q.answer].classList.add('yes');
      }
      function judge(ok, b) {
        if (over) return;
        tries++;
        if (ok) { if (b) b.classList.add('yes'); end(true); return; }
        if (b) { b.classList.add('no'); b.disabled = true; }
        if (tries >= 2) end(false);
        else { fb.className = 'fb bad'; fb.innerHTML = '<b>Not quite.</b> <span>' + (q.hint || 'Look back at the example above.') + '</span>'; }
      }
      if (q.type === 'mc') Atlas.$$('.opt', d).forEach(function (b) { b.addEventListener('click', function () { judge(+b.getAttribute('data-j') === q.answer, b); }); });
      else $('form', d).addEventListener('submit', function (e) {
        e.preventDefault();
        var raw = $('input', d).value, v = parseNum(raw);
        if (isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Type a number first.'; return; }
        judge(judgeNum(q, v, raw));
      });
    });
  }
  /* read a lesson part aloud: headings, paragraphs and boxes, not the drawings or the tools */
  function sayParts(root) {
    if (!('speechSynthesis' in window)) return;
    Atlas.$$('.sec', root).forEach(function (sec) {
      var h2 = $('h2', sec);
      if (!h2) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'say sec-say'; b.textContent = 'Read aloud';
      b.setAttribute('aria-label', 'Read this part aloud');
      h2.parentNode.insertBefore(b, h2.nextSibling);
      b.addEventListener('click', function () {
        var t = [h2.textContent.replace(/^\d+/, '')];
        Atlas.$$(':scope > p, :scope > .key, :scope > .mistake, :scope > .eg, :scope > .vs', sec).forEach(function (e) { t.push(textOf(e)); });
        speak(t.join('. '));
      });
    });
  }

  /* ---------- Adaptive practice ----------
     Each chapter lists skills: {id, name, code, gen: function (level) -> question}.
     A question is {q, type, options/answer, unit, tol, fig, hint, steps:[...], explain}.
     Level 1 is the gentlest. Three right in a row on the first try moves up a level.
     Two misses in a row moves down a level and shows the steps. */
  var LV = ['', 'Getting started', 'Building', 'Stretch'];
  function skillState(sid) { return load('sk:' + sid, { lv: 1, streak: 0, miss: 0, n: 0, ok: 0, secure: false }); }
  function skillSave(sid, s) { s.t = Date.now(); save('sk:' + sid, s); }
  function status(s) {
    if (s.secure) return { k: 4, t: 'Secure' };
    if (!s.n) return { k: 0, t: 'Not started' };
    return { k: s.lv, t: 'Level ' + s.lv + ': ' + LV[s.lv] };
  }
  Atlas.skillStatus = function (sid) { return status(skillState(sid)); };
  function meter(k) {
    var h = '<span class="meter" aria-hidden="true">';
    for (var i = 1; i <= 4; i++) h += '<i class="' + (i <= k ? 'on' : '') + '"></i>';
    return h + '</span>';
  }
  Atlas.allSkills = function () {
    var out = [];
    Atlas.meta.forEach(function (m) {
      var ch = Atlas.chapters[m.id];
      if (ch && ch.practice) ch.practice.forEach(function (sk) { out.push({ ch: m, sk: sk }); });
    });
    return out;
  };
  function make(sk, lv) {
    var q = sk.gen(lv);
    q.skill = sk.id;
    return q;
  }

  Atlas.practice = function (box, id, skills, startSkill) {
    var mix = false, cur = null, sk = null, q = null, tries = 0, done = false, session = { n: 0, first: 0 };
    /* Mostly review: every fourth question comes from a skill practised before in another chapter. */
    function reviewSkill() {
      var ids = skills.map(function (x) { return x.id; });
      var old = Atlas.allSkills().filter(function (p) { return ids.indexOf(p.sk.id) < 0 && skillState(p.sk.id).n > 0; });
      return old.length ? R.pick(old) : null;
    }
    function pickWeakest() {
      var list = skills.map(function (sk) { return { sk: sk, s: skillState(sk.id) }; });
      list.sort(function (a, b) {
        var ka = a.s.secure ? 9 : a.s.lv, kb = b.s.secure ? 9 : b.s.lv;
        return ka - kb || (a.s.t || 0) - (b.s.t || 0);
      });
      return list[0].sk;
    }
    function skillRow() {
      return skills.map(function (sk) {
        var st = status(skillState(sk.id));
        return '<button type="button" class="skill' + (cur && cur.id === sk.id && !mix ? ' cur' : '') + '" data-sk="' + sk.id + '" aria-pressed="' + (cur && cur.id === sk.id && !mix) + '">' +
          '<span class="sn">' + sk.name + '</span><span class="ss">' + meter(st.k) + ' ' + st.t + '</span><span class="sc">' + sk.code + '</span></button>';
      }).join('') +
        '<button type="button" class="skill mixb' + (mix ? ' cur' : '') + '" data-sk="mix" aria-pressed="' + mix + '"><span class="sn">Mixed review</span><span class="ss">All skills, weakest first</span><span class="sc">Repeat</span></button>';
    }
    box.innerHTML = '<div class="qhead"><h2>Practise</h2><p class="qscore pscore" aria-live="polite"></p></div>' +
      '<p class="qintro">New questions every time. Pick a skill. Three right in a row moves you up a level. If a question is tricky, you get a hint, then the steps, then a similar one to try.</p>' +
      '<div class="skills"></div><div class="pq" aria-live="polite"></div>';
    var row = $('.skills', box), pq = $('.pq', box);
    function refreshRow() {
      row.innerHTML = skillRow();
      Atlas.$$('.skill', row).forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-sk');
          mix = k === 'mix';
          cur = mix ? pickWeakest() : skills.filter(function (s) { return s.id === k; })[0];
          next(true);
        });
      });
    }
    function scoreLine() {
      $('.pscore', box).textContent = session.n ? 'This session: ' + session.n + ' done, ' + session.first + ' right first time' : '';
    }
    function next(focus, easier) {
      if (mix) cur = pickWeakest();
      sk = cur;
      var rv = !easier && session.n % 4 === 3 ? reviewSkill() : null;
      if (rv) sk = rv.sk;
      var st = skillState(sk.id);
      var lv = easier ? Math.max(1, st.lv - 1) : st.lv;
      q = make(sk, lv); q.lv = lv; tries = 0; done = false;
      Atlas._q = q; /* exposed for automated checks */
      refreshRow();
      var h = '<div class="pcard">' + (rv ? '<p class="rvtag">Review from ' + rv.ch.title + '</p>' : '') + '<p class="plv"><span class="pill">' + sk.code + '</span> <b>' + sk.name + '</b> &middot; Level ' + lv + ': ' + LV[lv] + '</p>' +
        '<p class="qtext">' + q.q + '</p>' + sayBtn() + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
      if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
      else h += '<form class="numrow"><label class="sr" for="pin-' + id + '">Your answer</label>' + (q.unit === '$' ? '<span class="unit">$</span>' : '') +
        '<input type="text" inputmode="' + (q.kb || 'decimal') + '" autocomplete="off" id="pin-' + id + '" placeholder="Type your answer">' + unitHtml(q) + '<button class="btn" type="submit">Check</button></form>';
      h += '<div class="fb"></div><div class="steps"></div><div class="pnext"></div></div>';
      pq.innerHTML = h;
      var say = $('.say', pq);
      if (say) say.addEventListener('click', function () { speak(textOf($('.qtext', pq))); });
      if (q.type === 'mc') Atlas.$$('.opt', pq).forEach(function (b) {
        b.addEventListener('click', function () {
          if (done) return;
          var j = +b.getAttribute('data-j');
          if (j === q.answer) { b.classList.add('yes'); answer(true); }
          else { b.classList.add('no'); b.disabled = true; answer(false); }
        });
      });
      else $('form', pq).addEventListener('submit', function (e) {
        e.preventDefault();
        if (done) return;
        var raw = $('input', pq).value, v = parseNum(raw);
        if (isNaN(v)) { $('.fb', pq).className = 'fb bad'; $('.fb', pq).textContent = 'Type a number first.'; return; }
        answer(judgeNum(q, v, raw));
      });
      if (focus) { var f = $('.opt, input', pq); if (f) f.focus(); }
      scoreLine();
    }
    function answer(ok) {
      tries++;
      var fb = $('.fb', pq), st = skillState(sk.id), msg = '';
      if (!ok && tries === 1) {
        fb.className = 'fb bad';
        fb.innerHTML = '<b>Not quite.</b> <span>' + (q.hint || 'Have another go.') + '</span>' + (q.steps && q.steps.length ? '<span class="t2"> Look at step 1: </span><span>' + q.steps[0] + '</span>' : '');
        return;
      }
      done = true; session.n++;
      Atlas.$$('button.opt, input, form .btn', pq).forEach(function (b) { b.disabled = true; });
      if (q.type === 'mc') Atlas.$$('.opt', pq)[q.answer].classList.add('yes');
      st.n++;
      if (ok && tries === 1) {
        session.first++; st.ok++; st.streak++; st.miss = 0;
        if (st.streak >= 3 && st.lv < 3) { st.lv++; st.streak = 0; msg = 'Three in a row. Moving up to level ' + st.lv + '.'; }
        else if (st.streak >= 3 && st.lv === 3 && !st.secure) { st.secure = true; msg = 'This skill is now marked secure. Come back to it now and then to keep it fresh.'; }
      } else {
        st.streak = 0;
        if (!ok) {
          st.miss++;
          if (st.miss >= 2 && st.lv > 1) { st.lv--; st.miss = 0; msg = 'Let\'s step back to level ' + st.lv + ' and build up again.'; }
        }
      }
      skillSave(sk.id, st);
      fb.className = 'fb ' + (ok ? 'ok' : 'bad');
      fb.innerHTML = '<b>' + (ok ? (tries === 1 ? 'Correct.' : 'Correct on the second try.') : 'The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span>' +
        (msg ? '<p class="lvmsg">' + msg + '</p>' : '');
      var nb = '<button type="button" class="btn" id="pn-' + id + '">Next question</button>';
      if (!ok && q.steps && q.steps.length) {
        showSteps();
        nb = '<button type="button" class="btn" id="pn-' + id + '">Try a similar one</button>';
      }
      $('.pnext', pq).innerHTML = nb;
      $('#pn-' + id, pq).addEventListener('click', function () { next(true, !ok); });
      $('#pn-' + id, pq).focus();
      refreshRow();
      scoreLine();
    }
    function showSteps() {
      var box2 = $('.steps', pq), k = 0;
      function draw() {
        box2.innerHTML = '<p class="sth"><b>Step by step</b></p><ol>' + q.steps.slice(0, k + 1).map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
          (k + 1 < q.steps.length ? '<button type="button" class="btn alt" id="ps-' + id + '">Show the next step</button>' : '');
        var b = $('#ps-' + id, box2);
        if (b) b.addEventListener('click', function () { k++; draw(); var nb = $('#ps-' + id, box2); (nb || $('.pnext .btn', pq)).focus(); });
      }
      draw();
    }
    cur = (startSkill && skills.filter(function (s) { return s.id === startSkill; })[0]) || pickWeakest();
    refreshRow();
    pq.innerHTML = '<p class="pstart">Start with <b>' + cur.name + '</b>, or pick any skill above.</p><button type="button" class="btn" id="pgo-' + id + '">Start practising</button>';
    $('#pgo-' + id, pq).addEventListener('click', function () { next(true); });
    if (startSkill) next(false);
  };

  /* ---------- Check-up (assessment) ---------- */
  function checkup(app, scope) {
    var hist = load('checkups', []);
    if (!scope) {
      var h = '<div class="wrap chapter"><p class="crumb"><a href="#home">All chapters</a></p><header class="chead"><span class="num">Assessment</span><h1>Check-up</h1>' +
        '<p class="lede">Find out what you know and what to practise next.</p></header>' +
        '<section class="sec cu"><h2>How it works</h2><ul>' +
        '<li>Each question is new. There are no hints and no time limit.</li>' +
        '<li>If you do not know, choose <b>"I\'m not sure yet"</b>. That is more useful than a guess.</li>' +
        '<li>At the end you see every answer, what each question checked, and a plan for what to practise.</li>' +
        '<li>Your practice levels change to match your results.</li></ul>' +
        '<div class="cuopts"><a class="btn" href="#check-up/all">Full check-up: 20 questions</a></div>' +
        '<h3>Or check one chapter (6 questions)</h3><div class="cuch">' +
        Atlas.meta.filter(function (m) { return Atlas.chapters[m.id] && Atlas.chapters[m.id].practice; }).map(function (m) {
          return '<a class="pill" data-strand="' + m.strand + '" href="#check-up/' + m.id + '">' + m.title + '</a>';
        }).join('') + '</div></section>';
      if (hist.length) {
        h += '<section class="sec cu"><h2>Past check-ups</h2><div class="tbl"><table><thead><tr><th class="l">Date</th><th class="l">What</th><th>Result</th></tr></thead><tbody>' +
          hist.slice(-10).reverse().map(function (r) { return '<tr><td class="l">' + r.d + '</td><td class="l">' + r.w + '</td><td>' + r.s + ' of ' + r.n + '</td></tr>'; }).join('') +
          '</tbody></table></div></section>';
      }
      h += '<div class="note"><p><b>For parents and teachers.</b> Each question is tagged with the Ontario expectation it checks. A single check-up is a snapshot, not a mark. Use it to choose what to practise, and repeat it after a few weeks to see growth.</p></div></div>';
      app.innerHTML = h;
      return;
    }
    var pool = Atlas.allSkills(), items = [], label;
    if (scope === 'all') {
      label = 'Full check-up';
      Atlas.meta.forEach(function (m) {
        var mine = R.shuffle(pool.filter(function (p) { return p.ch.id === m.id; })).slice(0, 2);
        mine.forEach(function (p) { items.push(p); });
      });
    } else {
      var m0 = Atlas.meta.filter(function (m) { return m.id === scope; })[0];
      if (!m0) { location.hash = '#check-up'; return; }
      label = m0.title + ' check-up';
      var mine = pool.filter(function (p) { return p.ch.id === scope; });
      /* 3 starter (level 1) questions, then 3 core (level 2) */
      for (var i = 0; i < 6; i++) items.push({ ch: mine[i % mine.length].ch, sk: mine[i % mine.length].sk, lv: i < 3 ? 1 : 2 });
    }
    /* the whole-grade check-up uses starter (level 1) questions only, so it matches the grade and does not overwhelm */
    var qs = items.map(function (p) { var q = make(p.sk, p.lv || 1); q.ch = p.ch; q.sk = p.sk; return q; });
    var res = [], k = 0;
    function show() {
      var q = qs[k];
      Atlas._q = q;
      var h = '<div class="wrap chapter" data-strand="' + q.ch.strand + '"><p class="crumb"><a href="#check-up">Check-up</a></p>' +
        '<div class="sec cu"><div class="cuprog"><span>' + label + '</span><span>Question ' + (k + 1) + ' of ' + qs.length + '</span></div>' +
        '<div class="bar-h"><i style="width:' + (k / qs.length * 100) + '%;background:var(--accent)"></i></div>' +
        '<p class="plv"><span class="pill">' + q.ch.title + '</span></p><p class="qtext">' + q.q + '</p>' + sayBtn() + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
      if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
      else h += '<form class="numrow"><label class="sr" for="cuin">Your answer</label>' + (q.unit === '$' ? '<span class="unit">$</span>' : '') +
        '<input type="text" inputmode="' + (q.kb || 'decimal') + '" autocomplete="off" id="cuin" placeholder="Type your answer">' + unitHtml(q) + '<button class="btn" type="submit">Save answer</button></form>';
      h += '<p><button type="button" class="btn alt" id="cuskip">I\'m not sure yet</button></p></div></div>';
      app.innerHTML = h;
      var say = $('.say', app);
      if (say) say.addEventListener('click', function () { speak(textOf($('.qtext', app))); });
      function rec(given, ok) { res.push({ given: given, ok: ok }); k++; if (k < qs.length) { show(); var f = $('.opt, input', app); if (f) f.focus(); } else report(); }
      if (q.type === 'mc') Atlas.$$('.opt', app).forEach(function (b) {
        b.addEventListener('click', function () { var j = +b.getAttribute('data-j'); rec(q.options[j], j === q.answer); });
      });
      else $('form', app).addEventListener('submit', function (e) {
        e.preventDefault();
        var raw = $('#cuin', app).value, v = parseNum(raw);
        if (isNaN(v)) { $('#cuin', app).focus(); return; }
        rec(raw.trim(), judgeNum(q, v, raw));
      });
      $('#cuskip', app).addEventListener('click', function () { rec(null, false); });
    }
    function report() {
      var right = res.filter(function (r) { return r.ok; }).length, bySk = {}, order = [];
      qs.forEach(function (q, i) {
        var key = q.sk.id;
        if (!bySk[key]) { bySk[key] = { q: q, ok: 0, n: 0 }; order.push(key); }
        bySk[key].n++; if (res[i].ok) bySk[key].ok++;
        var st = skillState(key);
        if (res[i].ok) { if (st.lv < 2) st.lv = 2; } else { st.lv = 1; st.secure = false; }
        st.streak = 0; st.miss = 0; skillSave(key, st);
      });
      var d = new Date(), ds = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      hist.push({ d: ds, w: label, s: right, n: qs.length });
      save('checkups', hist.slice(-30));
      var todo = order.filter(function (key) { return bySk[key].ok < bySk[key].n; });
      save('plan', todo.slice(0, 4).map(function (key) { var q = bySk[key].q; return { ch: q.ch.id, sk: key, name: q.sk.name, t: q.ch.title }; }));
      var pct = right / qs.length;
      var h = '<div class="wrap chapter"><p class="crumb"><a href="#check-up">Check-up</a></p><header class="chead"><span class="num">Results &middot; ' + ds + '</span><h1>' + right + ' of ' + qs.length + '</h1>' +
        '<p class="lede">' + (pct >= 0.85 ? 'Strong work. Keep these skills fresh with mixed review.' : pct >= 0.6 ? 'A solid base. The plan below shows what to work on next.' : 'This shows where to start. Work through the plan one skill at a time.') + '</p></header>' +
        '<section class="sec cu"><h2>Your plan</h2>' +
        (todo.length ? '<ol class="plan">' + todo.slice(0, 4).map(function (key) {
          var q = bySk[key].q;
          return '<li><a href="#' + q.ch.id + '/practice/' + key + '">Practise <b>' + q.sk.name + '</b></a> <span class="t2">(' + q.ch.title + ', ' + q.sk.code + ')</span></li>';
        }).join('') + '</ol>' : '<p>Nothing to fix. Try the Stretch level in any chapter.</p>') +
        '<p><button type="button" class="btn alt" onclick="window.print()">Print or save this report</button></p></section>' +
        '<section class="sec cu"><h2>Every question</h2><div class="tbl"><table><thead><tr><th class="l">Skill</th><th>Expectation</th><th>Result</th></tr></thead><tbody>' +
        order.map(function (key) {
          var b = bySk[key];
          return '<tr><td class="l">' + b.q.sk.name + '</td><td>' + b.q.sk.code + '</td><td>' + (b.ok === b.n ? '<b class="okc">Got it</b>' : b.ok ? 'Partly' : '<b class="noc">Not yet</b>') + (b.n > 1 ? ' (' + b.ok + '/' + b.n + ')' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="review">' + qs.map(function (q, i) {
          var r = res[i];
          return '<div class="q"><p class="qtext"><span class="qn">' + (i + 1) + '</span>' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '') +
            '<p class="fb ' + (r.ok ? 'ok' : 'bad') + '"><b>' + (r.ok ? 'Correct: ' + shown(q, q.answer) : (r.given === null ? 'Not sure yet.' : 'You said ' + r.given + '.') + ' The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span></p></div>';
        }).join('') + '</div></section>' +
        '<p><a class="btn" href="#check-up">Back to check-ups</a></p></div>';
      app.innerHTML = h;
      window.scrollTo(0, 0);
    }
    show();
  }

  function counts(ch) {
    return { s: (ch.html.match(/<section/g) || []).length, q: ch.quiz ? ch.quiz.length : 0 };
  }

  function home(app) {
    var h = '<div class="wrap"><div class="hero"><p class="kicker">Ontario Grade 7 &middot; 2020 curriculum</p><h1>Grade 7 Math, <em>one idea at a time</em></h1>' +
      '<p class="lede">A free study site for Ontario Grade 7 math. Each idea is shown with a picture, worked through with an example, then handed to you to try. Practice adjusts to you, and a check-up shows what to work on next.</p>' +
      '<div class="legend">';
    Object.keys(Atlas.strands).forEach(function (k) {
      h += '<span class="pill" data-strand="' + k + '">' + k + ' &middot; ' + Atlas.strands[k] + '</span>';
    });
    h += '</div></div>';
    var plan = load('plan', []), hist = load('checkups', []);
    h += '<div class="start">';
    if (hist.length) {
      var last = hist[hist.length - 1];
      h += '<p><b>Last check-up</b> (' + last.d + '): ' + last.s + ' of ' + last.n + '.</p>' +
        (plan.length ? '<p>Next up:</p><ul>' + plan.map(function (p) { return '<li><a href="#' + p.ch + '/practice/' + p.sk + '">' + p.name + '</a> <span class="t2">(' + p.t + ')</span></li>'; }).join('') + '</ul>' : '') +
        '<p><a href="#check-up">Take another check-up</a></p>';
    } else {
      h += '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It has 20 questions, takes about 25 minutes, and builds a practice plan for you.</p>';
    }
    h += '</div><div class="cards">';
    Atlas.meta.forEach(function (m, i) {
      var ch = Atlas.chapters[m.id];
      if (!ch) return;
      var c = counts(ch), best = parseInt(store('best:' + m.id) || '-1', 10), sec = 0, nsk = ch.practice ? ch.practice.length : 0;
      if (ch.practice) ch.practice.forEach(function (sk) { if (skillState(sk.id).secure) sec++; });
      h += '<a class="card" data-strand="' + m.strand + '" href="#' + m.id + '">' +
        '<span class="no">' + (m.ref ? 'Ref' : i + 1) + '</span><h2>' + m.title + '</h2><p class="sub">' + m.sub + '</p><p class="desc">' + m.desc + '</p>' +
        '<div class="meta"><span class="pill" data-strand="' + m.strand + '">' + m.strand + ' &middot; ' + Atlas.strands[m.strand] + '</span>' +
        (m.ref ? '<span>one page</span>' : '<span>' + c.s + ' parts' + (best >= 0 ? ' &middot; <span class="done">quiz ' + best + '/' + c.q + '</span>' : '') + (sec ? ' &middot; <span class="done">' + sec + '/' + nsk + ' secure</span>' : '') + '</span>') + '</div></a>';
    });
    h += '</div><div class="note"><p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 7. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>Not covered as its own chapter:</b> strand A (social-emotional learning skills and math processes) is woven through. Mathematical modelling (C4) has no chapter of its own. Making a full infographic (D1.4) and writing real code (C3) are explained with examples, but done off the site.</p>' +
      '<p><b>Progress</b> is saved only in this browser. Nothing is sent anywhere.</p></div></div>';
    app.innerHTML = h;
  }

  function chapter(app, id, sub) {
    var ch = Atlas.chapters[id], idx = 0;
    Atlas.meta.forEach(function (m, i) { if (m.id === id) idx = i; });
    var m = Atlas.meta[idx], prev = Atlas.meta[idx - 1], next = Atlas.meta[idx + 1];
    var h = '<div class="wrap chapter" data-strand="' + m.strand + '"><p class="crumb"><a href="#home">All chapters</a></p>' +
      '<header class="chead"><span class="num">' + (m.ref ? 'Reference' : 'Chapter ' + (idx + 1)) + '</span><h1>' + m.title + '</h1>' +
      '<p class="lede">' + m.sub.charAt(0).toUpperCase() + m.sub.slice(1) + '.</p>' +
      '<span class="pill">' + m.strand + ' &middot; ' + Atlas.strands[m.strand] + '</span>' + (m.codes ? ' <span class="codes">Ontario expectations ' + m.codes + '</span>' : '') + '</header>';
    if (ch.practice || ch.quiz) h += '<nav class="jump" aria-label="In this chapter"><a href="#' + id + '/lesson">Lesson</a>' + (ch.practice ? '<a href="#' + id + '/practice">Practise</a>' : '') + (ch.quiz ? '<a href="#' + id + '/quiz">Chapter quiz</a>' : '') + '<a href="#check-up/' + id + '">Check-up</a></nav>';
    h += '<div id="lesson">' + ch.html + '</div>';
    if (ch.practice) h += '<div class="quiz prac" id="practice"></div>';
    if (ch.quiz) h += '<div class="quiz" id="quiz"></div>';
    h += '<div class="pn">' +
      (prev ? '<a href="#' + prev.id + '"><small>Previous</small>' + prev.title + '</a>' : '<span></span>') +
      (next ? '<a class="nx" href="#' + next.id + '"><small>Next</small>' + next.title + '</a>' : '') + '</div></div>';
    app.innerHTML = h;
    if (ch.init) ch.init(app);
    wireYt(app);
    sayParts(app);
    var parts = (sub || '').split('/');
    if (ch.practice) Atlas.practice($('#practice', app), id, ch.practice, parts[0] === 'practice' ? parts[1] : null);
    if (ch.quiz) Atlas.quiz($('#quiz', app), id, ch.quiz);
    return parts[0];
  }

  var lastPage = '';
  /* gentle motion: parts of the page slide in as they scroll into view, and figures draw themselves once */
  function motion(root) {
    if (!('IntersectionObserver' in window) || !window.matchMedia || !matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        Atlas.$$('.fig > svg, .opts svg', el).forEach(function (sv) {
          var k = 0;
          Atlas.$$('*', sv).forEach(function (n) {
            if (/^(defs|marker|title|tspan)$/i.test(n.tagName) || n.closest('defs')) return;
            n.style.setProperty('--i', Math.min(k++, 30));
            if (n.getTotalLength && /^(line|path|polyline)$/i.test(n.tagName)) { try { n.style.setProperty('--len', Math.ceil(n.getTotalLength()) + 1); } catch (x) {} }
          });
          sv.classList.add('draw');
          setTimeout(function () { sv.classList.remove('draw'); }, 2200);
        });
        el.classList.add('in');
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Atlas.$$('.hero, .cards > *, .sec, .quiz, .pbox, .note, .cuopts, .cuch', root).forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  }
  function route() {
    var raw = (location.hash || '').replace('#', '') || 'home';
    var cut = raw.indexOf('/'), id = cut < 0 ? raw : raw.slice(0, cut), sub = cut < 0 ? '' : raw.slice(cut + 1);
    var app = $('#app'), target = null;
    /* in-chapter jumps do not re-render the page */
    if (id === lastPage && Atlas.chapters[id] && (sub === 'lesson' || sub === 'practice' || sub === 'quiz')) {
      target = $('#' + sub, app);
      if (target) { target.scrollIntoView(); return; }
    }
    lastPage = id;
    if (id === 'check-up') checkup(app, sub);
    else if (id === 'home' || !Atlas.chapters[id]) home(app);
    else {
      var where = chapter(app, id, sub);
      if (where) target = $('#' + where, app);
    }
    if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
    motion(app);
  }

  /* reading supports: theme and larger text, remembered in this browser */
  function prefs() {
    var root = document.documentElement, th = store('theme') === 'dark' ? 'dark' : 'light', big = store('big') === '1';
    function apply() {
      if (th === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', th);
      root.classList.toggle('bigtext', big);
      var tb = $('#themeb'), bb = $('#bigb');
      if (tb) tb.textContent = 'Theme: ' + th;
      if (bb) { bb.setAttribute('aria-pressed', String(big)); bb.textContent = big ? 'Text: larger' : 'Text: normal'; }
    }
    var tb = $('#themeb'), bb = $('#bigb');
    if (tb) tb.addEventListener('click', function () { th = th === 'light' ? 'dark' : 'light'; store('theme', th); apply(); });
    if (bb) bb.addEventListener('click', function () { big = !big; store('big', big ? '1' : '0'); apply(); });
    apply();
  }

  /* keep the groups of a big number together on one line: 48 000 never breaks after 48 */
  function glue(node) {
    var w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), t, re = /(\d) (?=\d{3}(?!\d))/g;
    while ((t = w.nextNode())) if (re.test(t.nodeValue)) { re.lastIndex = 0; t.nodeValue = t.nodeValue.replace(re, '$1\u00a0'); }
  }
  Atlas.start = function () {
    prefs();
    glue(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') glue(m.target.parentNode || m.target);
        else m.addedNodes.forEach(function (n) { if (n.nodeType === 1 || n.nodeType === 3) glue(n.nodeType === 3 ? n.parentNode || n : n); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
    /* slider readouts give a small bump when they change */
    document.addEventListener('input', function (e) {
      var o = e.target && e.target.closest && e.target.closest('label');
      o = o && o.querySelector('output');
      if (o) { o.classList.remove('bump'); void o.offsetWidth; o.classList.add('bump'); }
    });
    window.addEventListener('hashchange', route);
    route();
  };
})();
