/* Grade 6 Math Atlas: tiny hash router, chapter registry, practice questions, adaptive practice and check-up. No dependencies. */
(function () {
  'use strict';
  var Atlas = (window.Atlas = {
    chapters: {},
    strands: { B: 'Number', C: 'Algebra', D: 'Data', E: 'Spatial Sense', F: 'Financial Literacy' },
    meta: [
      { id: 'numbers-integers', title: 'Big Numbers, Integers and Factors', sub: 'to one million, below zero, prime factors', strand: 'B', codes: 'B1.1, B1.2, B1.3, B2.2, B2.6',
        desc: 'Read numbers to one million, use negative numbers, divisibility rules and factor trees.' },
      { id: 'decimals', title: 'Decimals to Thousandths', sub: 'tenths, hundredths, thousandths', strand: 'B', codes: 'B1.3, B1.4, B1.5, B1.6',
        desc: 'Read, compare, order and round decimals, and match them to fractions.' },
      { id: 'fractions', title: 'Fractions', sub: 'unlike denominators, groups of a fraction', strand: 'B', codes: 'B1.3, B2.5, B2.9, B2.10',
        desc: 'Add and subtract unlike fractions, multiply and divide whole numbers by fractions.' },
      { id: 'decimal-ops', title: 'Decimal Calculations', sub: 'add, subtract, multiply, divide', strand: 'B', codes: 'B2.1, B2.4, B2.7, B2.8, B2.11',
        desc: 'Estimate first, then add, subtract, multiply and divide with decimals.' },
      { id: 'ratios-percents', title: 'Ratios, Rates and Percents', sub: 'comparing and scaling', strand: 'B', codes: 'B2.1, B2.3, B2.12',
        desc: 'Ratio tables, unit rates, better buys and percents of a number in your head.' },
      { id: 'patterns-algebra', title: 'Patterns, Equations and Code', sub: 'rules, variables, balance', strand: 'C', codes: 'C1.1 to C3.2',
        desc: 'Growing and shrinking patterns, expressions, equations, inequalities and code with conditions.' },
      { id: 'data-probability', title: 'Data, Graphs and Probability', sub: 'histograms, averages, chance', strand: 'D', codes: 'D1.1 to D2.2',
        desc: 'Discrete and continuous data, histograms, broken-line graphs, mean, median, mode and chance.' },
      { id: 'shapes-grids', title: 'Shapes, Grids and Moves', sub: 'quadrilaterals, views, four quadrants', strand: 'E', codes: 'E1.1 to E1.4',
        desc: 'Properties of quadrilaterals, views of 3D objects, the four-quadrant grid and transformations.' },
      { id: 'measurement', title: 'Measuring', sub: 'units, angles, area, surface area', strand: 'E', codes: 'E2.1 to E2.6',
        desc: 'Metric conversions, angles up to 360&deg;, area of trapezoids and kites, nets and surface area.' },
      { id: 'money', title: 'Money Matters', sub: 'paying, saving, interest', strand: 'F', codes: 'F1.1 to F1.5',
        desc: 'Ways to pay, saving goals, interest and fees, and trading, lending and donating.' },
      { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
        desc: 'Place value, divisibility, equivalents, formulas, units and angle facts.' }
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
  /* a stacked fraction for HTML text */
  Atlas.fr = function (n, d) { return '<span class="fr" role="math" aria-label="' + n + ' over ' + d + '"><span>' + n + '</span><span>' + d + '</span></span>'; };
  Atlas.money = function (c) { return '$' + (c / 100).toFixed(2); };
  /* round away floating point noise: 0.1 + 0.2 -> 0.3 */
  Atlas.clean = function (x) { return Math.round(x * 1e6) / 1e6; };

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem('g6atlas:' + k); localStorage.setItem('g6atlas:' + k, v); } catch (e) { return null; }
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
     Place index p: 0 ones, 1 tens, 2 hundreds, 3 thousands, 4 ten thousands, 5 hundred thousands, 6 millions. ---- */
  Atlas.PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
  Atlas.PLACE1 = ['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand', 'million'];
  Atlas.pc = function (p) { return 'var(--p' + p + ')'; };
  /* a single place value disk; small disks (r < 12) have no label */
  Atlas.draw.disk = function (x, y, r, p) {
    var lab = Atlas.fmt(Math.pow(10, p)), fs = lab.length <= 3 ? r * 0.8 : lab.length === 4 ? r * 0.62 : lab.length <= 7 ? r * 0.48 : r * 0.36;
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
    var a = Atlas.fmt(v);
    if (q.unit === '$') return '$' + Number(v).toFixed(2);
    return a + (q.unit ? ' ' + q.unit : '');
  }
  function unitHtml(q) { return q.unit && q.unit !== '$' ? '<span class="unit">' + q.unit + '</span>' : ''; }
  function parseNum(t) { return parseFloat(String(t).replace(/[\u2212\u2013]/g, '-').replace(/[^0-9.\-]/g, '')); }
  function numOk(q, v) { return Math.abs(v - q.answer) <= (q.tol || 1e-9); }
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text.replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus '));
    u.lang = 'en-CA'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
  Atlas.speak = speak;
  /* spoken text for an element: fractions as "n over d", squared units, degrees */
  function sayText(el) {
    var c = el.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll('svg,.lab,.yt,.say,.sr,button,input,select'), function (x) { x.remove(); });
    Array.prototype.forEach.call(c.querySelectorAll('.fr'), function (f) { var p = f.children; f.textContent = p.length === 2 ? ' ' + p[0].textContent + ' over ' + p[1].textContent + ' ' : f.textContent; });
    Array.prototype.forEach.call(c.querySelectorAll('p,li,tr,h2,h3,.t'), function (x) { x.appendChild(document.createTextNode('. ')); });
    return c.textContent.replace(/(\w)²/g, '$1 squared').replace(/°/g, ' degrees').replace(/\s+/g, ' ').replace(/(\. )+/g, '. ');
  }
  Atlas.sayText = sayText;
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
          '<input type="text" inputmode="decimal" autocomplete="off" id="q-' + id + '-' + i + '" placeholder="Type a number">' +
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
          var v = parseNum($('input', d).value);
          if (isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Type a number first.'; return; }
          s.tries++;
          if (numOk(q, v)) finish(true);
          else if (s.tries >= 2) finish(false); else wrong();
        });
      }
    });
    score();
  };

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
    var mix = false, cur = null, qsk = null, q = null, tries = 0, done = false, session = { n: 0, first: 0 };
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
      '<p class="qintro">New questions every time. Pick a skill. Three right in a row moves you up a level. Every fourth question reviews another skill. If a question is tricky, you get a hint, then the steps, then a similar one to try.</p>' +
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
      /* every 4th question in single-skill practice reviews another skill already started */
      qsk = cur;
      if (!mix && !easier && session.n % 4 === 3) {
        var others = skills.filter(function (x) { return x.id !== cur.id && skillState(x.id).n > 0; });
        if (others.length) qsk = R.pick(others);
      }
      var st = skillState(qsk.id);
      var lv = easier ? Math.max(1, st.lv - 1) : st.lv;
      q = make(qsk, lv); q.lv = lv; tries = 0; done = false;
      Atlas._q = q; /* exposed for automated checks */
      refreshRow();
      var h = '<div class="pcard"><p class="plv"><span class="pill">' + qsk.code + '</span> ' + (qsk !== cur ? '<b>Quick review:</b> ' : '') + '<b>' + qsk.name + '</b> &middot; Level ' + lv + ': ' + LV[lv] + '</p>' +
        '<p class="qtext">' + q.q + '</p>' + sayBtn() + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
      if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
      else h += '<form class="numrow"><label class="sr" for="pin-' + id + '">Your answer</label>' + (q.unit === '$' ? '<span class="unit">$</span>' : '') +
        '<input type="text" inputmode="decimal" autocomplete="off" id="pin-' + id + '" placeholder="Type a number">' + unitHtml(q) + '<button class="btn" type="submit">Check</button></form>';
      h += '<div class="fb"></div><div class="steps"></div><div class="pnext"></div></div>';
      pq.innerHTML = h;
      var say = $('.say', pq);
      if (say) say.addEventListener('click', function () { speak(sayText($('.qtext', pq))); });
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
        var v = parseNum($('input', pq).value);
        if (isNaN(v)) { $('.fb', pq).className = 'fb bad'; $('.fb', pq).textContent = 'Type a number first.'; return; }
        answer(numOk(q, v));
      });
      if (focus) { var f = $('.opt, input', pq); if (f) f.focus(); }
      scoreLine();
    }
    function answer(ok) {
      tries++;
      var fb = $('.fb', pq), st = skillState(qsk.id), msg = '';
      if (!ok && tries === 1) {
        fb.className = 'fb bad';
        fb.innerHTML = '<b>Not quite.</b> <span>' + (q.hint || 'Have another go.') + '</span>';
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
      skillSave(qsk.id, st);
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


  /* ---------- "Your turn" quick checks ----------
     A chapter writes A.yt({q, type, options, answer, unit, hint, explain}) right after a worked example.
     First wrong answer: the hint sends the student back to the rule. Second: the answer and why. */
  Atlas.yt = function (q, head) {
    return '<div class="yt" data-q="' + encodeURIComponent(JSON.stringify(q)) + '"' + (head ? ' data-h="' + encodeURIComponent(head) + '"' : '') + '></div>';
  };
  var ytN = 0;
  function miniQ(el, q, head, onDone) {
    var id = 'yt' + (++ytN), tries = 0, done = false;
    var h = '<span class="yth">' + (head || 'Your turn') + '</span><p class="qtext">' + q.q + '</p>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
    if (q.type === 'mc') h += '<div class="opts">' + q.options.map(function (o, j) { return '<button type="button" class="opt" data-j="' + j + '">' + o + '</button>'; }).join('') + '</div>';
    else h += '<form class="numrow"><label class="sr" for="' + id + '">Your answer</label>' + (q.unit === '$' ? '<span class="unit">$</span>' : '') +
      '<input type="text" inputmode="decimal" autocomplete="off" id="' + id + '" placeholder="Type a number">' + unitHtml(q) + '<button class="btn" type="submit">Check</button></form>';
    h += '<div class="fb" aria-live="polite"></div>';
    el.innerHTML = h;
    var fb = $('.fb', el);
    function res(ok) {
      tries++;
      if (!ok && tries === 1) { fb.className = 'fb bad'; fb.innerHTML = '<b>Not quite.</b> <span>' + (q.hint || 'Look back at the example and try again.') + '</span>'; return; }
      done = true;
      Atlas.$$('button.opt, input, form .btn', el).forEach(function (b) { b.disabled = true; });
      if (q.type === 'mc') Atlas.$$('.opt', el)[q.answer].classList.add('yes');
      fb.className = 'fb ' + (ok ? 'ok' : 'bad');
      fb.innerHTML = '<b>' + (ok ? 'Correct.' : 'The answer is ' + shown(q, q.answer) + '.') + '</b> <span>' + (q.explain || '') + '</span>';
      if (onDone) onDone(ok && tries === 1);
    }
    if (q.type === 'mc') Atlas.$$('.opt', el).forEach(function (b) {
      b.addEventListener('click', function () {
        if (done) return;
        var j = +b.getAttribute('data-j');
        if (j === q.answer) { b.classList.add('yes'); res(true); } else { b.classList.add('no'); b.disabled = true; res(false); }
      });
    });
    else $('form', el).addEventListener('submit', function (e) {
      e.preventDefault();
      if (done) return;
      var v = parseNum($('input', el).value);
      if (isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Type a number first.'; return; }
      res(numOk(q, v));
    });
  }
  Atlas.wireYT = function (root) {
    Atlas.$$('.yt[data-q]', root).forEach(function (el) {
      var q = JSON.parse(decodeURIComponent(el.getAttribute('data-q'))), hd = el.getAttribute('data-h');
      el.removeAttribute('data-q');
      miniQ(el, q, hd ? decodeURIComponent(hd) : null);
    });
  };
  /* warm-up: three quick questions from earlier chapters, weakest and least recent first */
  function warmup(box, idx) {
    var pool = [];
    Atlas.meta.slice(0, idx).forEach(function (m) {
      var ch = Atlas.chapters[m.id];
      if (ch && ch.practice) ch.practice.forEach(function (sk) { pool.push({ ch: m, sk: sk, s: skillState(sk.id) }); });
    });
    if (!pool.length) { box.parentNode.removeChild(box); return; }
    pool = R.shuffle(pool).sort(function (a, b) { return (a.s.secure ? 1 : 0) - (b.s.secure ? 1 : 0) || (a.s.t || 0) - (b.s.t || 0); });
    var pick = [], used = {};
    pool.forEach(function (p) { if (pick.length < 3 && !used[p.ch.id]) { used[p.ch.id] = 1; pick.push(p); } });
    pool.forEach(function (p) { if (pick.length < 3 && pick.indexOf(p) < 0) pick.push(p); });
    box.innerHTML = '<h2>Warm-up: 3 from earlier chapters</h2><p class="qintro">A quick review before the new work. These do not change your levels.</p><div class="wq"></div>';
    var wq = $('.wq', box);
    pick.forEach(function (p) {
      var d = document.createElement('div');
      d.className = 'yt';
      wq.appendChild(d);
      var q = make(p.sk, Math.min(2, Math.max(1, p.s.lv)));
      miniQ(d, q, p.ch.title + ' &middot; ' + p.sk.name);
    });
  }

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
        '<h3>Or check one chapter (8 questions)</h3><div class="cuch">' +
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
      for (var i = 0; i < 8; i++) items.push(mine[i % mine.length]);
    }
    var qs = items.map(function (p, j) { var q = make(p.sk, j % 2 ? 2 : 1); /* gentle start: alternate level 1 and level 2 */ q.ch = p.ch; q.sk = p.sk; return q; });
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
        '<input type="text" inputmode="decimal" autocomplete="off" id="cuin" placeholder="Type a number">' + unitHtml(q) + '<button class="btn" type="submit">Save answer</button></form>';
      h += '<p><button type="button" class="btn alt" id="cuskip">I\'m not sure yet</button></p></div></div>';
      app.innerHTML = h;
      var say = $('.say', app);
      if (say) say.addEventListener('click', function () { speak(sayText($('.qtext', app))); });
      function rec(given, ok) { res.push({ given: given, ok: ok }); k++; if (k < qs.length) { show(); var f = $('.opt, input', app); if (f) f.focus(); } else report(); }
      if (q.type === 'mc') Atlas.$$('.opt', app).forEach(function (b) {
        b.addEventListener('click', function () { var j = +b.getAttribute('data-j'); rec(q.options[j], j === q.answer); });
      });
      else $('form', app).addEventListener('submit', function (e) {
        e.preventDefault();
        var v = parseNum($('#cuin', app).value);
        if (isNaN(v)) { $('#cuin', app).focus(); return; }
        rec(shown(q, v), numOk(q, v));
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
    var h = '<div class="wrap"><div class="hero"><h1>Grade 6 Math, step by step</h1>' +
      '<p class="lede">A free study site for Ontario Grade 6 math. Short lessons built around pictures, drawings you can change, practice that adjusts to you, and a check-up that shows what to work on next.</p>' +
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
      h += '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It takes about 20 minutes and builds a practice plan for you.</p>';
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
    h += '</div><div class="note"><p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 6. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning skills and math processes) is woven through, not taught as its own chapter. Mathematical modelling (C4) has no chapter of its own. Infographics (D1.4) are described but not built on the site. Coding (C3) is taught with short code you read and change on paper, not a live coding tool.</p>' +
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
    if (ch.practice && idx > 0) h += '<section class="warm" id="warm" aria-label="Warm-up review"></section>';
    h += '<div id="lesson">' + ch.html + '</div>';
    if (ch.practice) h += '<div class="quiz prac" id="practice"></div>';
    if (ch.quiz) h += '<div class="quiz" id="quiz"></div>';
    h += '<div class="pn">' +
      (prev ? '<a href="#' + prev.id + '"><small>Previous</small>' + prev.title + '</a>' : '<span></span>') +
      (next ? '<a class="nx" href="#' + next.id + '"><small>Next</small>' + next.title + '</a>' : '') + '</div></div>';
    app.innerHTML = h;
    if (ch.init) ch.init(app);
    Atlas.wireYT(app);
    if ('speechSynthesis' in window) Atlas.$$('section.sec > h2', app).forEach(function (h2) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'say ssay'; b.textContent = 'Read aloud';
      b.setAttribute('aria-label', 'Read this section aloud');
      b.addEventListener('click', function () { speak(sayText(h2.parentNode)); });
      h2.insertAdjacentElement('afterend', b);
    });
    var wb = $('#warm', app);
    if (wb) warmup(wb, idx);
    var parts = (sub || '').split('/');
    if (ch.practice) Atlas.practice($('#practice', app), id, ch.practice, parts[0] === 'practice' ? parts[1] : null);
    if (ch.quiz) Atlas.quiz($('#quiz', app), id, ch.quiz);
    return parts[0];
  }

  var lastPage = '';
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
  }

  /* reading supports: theme and larger text, remembered in this browser */
  function prefs() {
    var root = document.documentElement, th = store('theme') || 'auto', big = store('big') === '1';
    function apply() {
      if (th === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', th);
      root.classList.toggle('bigtext', big);
      var tb = $('#themeb'), bb = $('#bigb');
      if (tb) tb.textContent = 'Theme: ' + (th === 'auto' ? 'auto' : th);
      if (bb) { bb.setAttribute('aria-pressed', String(big)); bb.textContent = big ? 'Text: larger' : 'Text: normal'; }
    }
    var tb = $('#themeb'), bb = $('#bigb');
    if (tb) tb.addEventListener('click', function () { th = th === 'auto' ? 'light' : th === 'light' ? 'dark' : 'auto'; store('theme', th); apply(); });
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
    window.addEventListener('hashchange', route);
    route();
  };
})();
