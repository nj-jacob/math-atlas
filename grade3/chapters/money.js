/* Grade 3 Money: a full chapter (docs/QUESTIONS.md, "Full chapters"). 4 lessons, 9 ideas, one practice skill per idea.
   Ontario 2020 F1.1: estimate and calculate the change for simple cash transactions, with whole-dollar amounts and amounts less than $1.
   Canada has no pennies: prices can be any number of cents, but a cash total rounds to the nearest 5 cents.
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3mn-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'money';

  /* ---------- words and question builders ---------- */
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = h; return e.textContent.replace(/\s+/g, ' ').trim(); }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function coin() { return Math.random() < 0.5; }
  function mc(q, right, wrongs, x) {
    var seen = {}, opts = [right], fix = {};
    seen[plain(right)] = 1;
    wrongs.forEach(function (w) { var t = plain(w[0]); if (opts.length >= 4 || seen[t]) return; seen[t] = 1; opts.push(w[0]); if (w[1]) fix[t] = w[1]; });
    var o = R.shuffle(opts);
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(right), wrong: fix }, x || {});
  }
  function num(q, ans, fixes, x) { var w = {}; Object.keys(fixes || {}).forEach(function (k) { if (+k !== ans && +k >= 0) w[k] = fixes[k]; }); return put({ q: q, type: 'num', answer: ans, wrong: w }, x); }
  function fill(q, f, answers, x) { return put({ q: q, type: 'fill', fill: f, answers: answers }, x); }
  function tf(q, truth, right, bad, fix, x) {
    var o = R.mc(right, bad), w = {};
    w[truth ? 'False' : 'True'] = fix;
    return put({ q: q, type: 'tf', answer: truth, why: { options: o.options, answer: o.answer }, wrong: w, steps: [right], explain: right }, x);
  }
  function tileFix(tiles, ans, say) { var w = {}; tiles.forEach(function (t, i) { if (i !== ans) w[plain(t) || String(i)] = say(i); }); return w; }

  /* ---------- money ---------- */
  /* values in cents. A cash total rounds to the nearest 5 cents: 1, 2 down; 3, 4 up; 6, 7 down; 8, 9 up */
  function cash(c) { var r = c % 5; return r >= 3 ? c - r + 5 : c - r; }
  function m(v) { return v < 100 ? v + '¢' : '$' + A.fmt(v / 100); }
  function sum(l) { return l.reduce(function (a, b) { return a + b; }, 0); }
  var C = {
    5: { name: 'nickel', r: 23, lab: '5¢', fill: '#c9ced6', ring: '#8d949e' },
    10: { name: 'dime', r: 20, lab: '10¢', fill: '#d4d8de', ring: '#8d949e' },
    25: { name: 'quarter', r: 27, lab: '25¢', fill: '#c3c8d0', ring: '#7d848e' },
    100: { name: 'loonie', r: 30, lab: '$1', fill: '#e2b84a', ring: '#a37f1c', sides: 11 },
    200: { name: 'toonie', r: 32, lab: '$2', fill: '#e2b84a', ring: '#9aa1ab', two: true },
    500: { name: '$5 bill', bill: '#4f86c6', lab: '$5' }, 1000: { name: '$10 bill', bill: '#8a5ab5', lab: '$10' }, 2000: { name: '$20 bill', bill: '#3f9a5c', lab: '$20' },
    5000: { name: '$50 bill', bill: '#c0504d', lab: '$50' }, 10000: { name: '$100 bill', bill: '#8a6a3f', lab: '$100' }
  };
  var CENTS = [25, 10, 5], DOLLARS = [2000, 1000, 500, 200, 100];
  /* the fewest coins or bills for an amount */
  function make(v, set) { var out = []; (set || DOLLARS.concat(CENTS)).forEach(function (d) { while (v >= d) { out.push(d); v -= d; } }); return out; }
  function coinSvg(v, x, y) {
    var c = C[v], s = '';
    if (c.bill) return '<g class="coin c' + v + '"><rect x="' + x + '" y="' + (y - 30) + '" width="112" height="60" rx="6" style="fill:' + c.bill + ';stroke:var(--ink)" stroke-width="2"/><rect x="' + (x + 6) + '" y="' + (y - 24) + '" width="100" height="48" rx="4" fill="none" stroke="#fff" stroke-width="1.5" opacity=".6"/><text x="' + (x + 56) + '" y="' + (y + 9) + '" text-anchor="middle" font-size="24" font-weight="700" fill="#fff">' + c.lab + '</text></g>';
    var cx = x + c.r;
    if (c.sides) { var p = []; for (var i = 0; i < c.sides; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / c.sides; p.push((cx + c.r * Math.cos(a)).toFixed(1) + ',' + (y + c.r * Math.sin(a)).toFixed(1)); } s += '<polygon points="' + p.join(' ') + '" style="fill:' + c.fill + ';stroke:' + c.ring + '" stroke-width="3"/>'; }
    else if (c.two) s += '<circle cx="' + cx + '" cy="' + y + '" r="' + c.r + '" style="fill:' + c.ring + ';stroke:#6c737c" stroke-width="2"/><circle cx="' + cx + '" cy="' + y + '" r="' + (c.r - 9) + '" style="fill:' + c.fill + '"/>';
    else s += '<circle cx="' + cx + '" cy="' + y + '" r="' + c.r + '" style="fill:' + c.fill + ';stroke:' + c.ring + '" stroke-width="3"/>';
    return '<g class="coin c' + v + '">' + s + '<text x="' + cx + '" y="' + (y + 7) + '" text-anchor="middle" font-size="' + (c.r < 22 ? 15 : 18) + '" font-weight="700" fill="#2a2420">' + c.lab + '</text></g>';
  }
  function wid(v) { return C[v].bill ? 112 : C[v].r * 2; }
  /* a row of coins and bills, biggest first, wrapping at W; lit = how many are counted so far (with running totals under them) */
  function coins(list, label, W, lit) {
    W = W || 420;
    var l = list.slice().sort(function (a, b) { return b - a; }), x = 8, y = 40, s = '', rowH = 0, run = 0;
    l.forEach(function (v, i) {
      var w = wid(v);
      if (x + w > W - 8) { x = 8; y += rowH + (lit != null ? 34 : 10); rowH = 0; }
      rowH = Math.max(rowH, C[v].bill ? 60 : C[v].r * 2);
      s += coinSvg(v, x, y);
      if (lit != null && i < lit) { run += v; s += '<text x="' + (x + w / 2) + '" y="' + (y + 52) + '" text-anchor="middle" font-size="17" class="tb" style="fill:var(--strand)">' + m(run) + '</text>'; }
      x += w + 10;
    });
    if (!l.length) s = '<text x="10" y="44" font-size="17" class="t2">No coins</text>';
    return A.svg(W, y + (lit != null ? 64 : 40), s, label || 'Money: ' + listName(l));
  }
  function listName(l) {
    var cnt = {}; l.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; });
    var parts = Object.keys(cnt).map(Number).sort(function (a, b) { return b - a; }).map(function (v) { return cnt[v] + ' ' + C[v].name + (cnt[v] > 1 ? 's' : ''); });
    return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0] || 'none';
  }
  /* count up from the price to what was paid on a number line, smallest coins first; upto = how many hops to show */
  function countUp(price, paid, upto) {
    var ch = make(paid - price, price >= 100 ? DOLLARS : CENTS).reverse(), x0 = 34, x1 = 400, s = '', cur = price;
    if (upto == null) upto = ch.length;
    function X(v) { return x0 + (v - price) / (paid - price) * (x1 - x0); }
    s += '<line x1="' + x0 + '" y1="110" x2="' + x1 + '" y2="110" style="stroke:var(--ink)" stroke-width="3"/>';
    var marks = [price];
    ch.slice(0, upto).forEach(function (d) {
      var a = X(cur), b = X(cur + d), mid = (a + b) / 2, ht = Math.min(60, 18 + (b - a) * 0.35);
      s += '<path d="M' + a.toFixed(1) + ' 106 Q' + mid.toFixed(1) + ' ' + (106 - ht * 2).toFixed(1) + ' ' + b.toFixed(1) + ' 106" fill="none" style="stroke:var(--strand)" stroke-width="3"/>';
      s += '<text x="' + mid.toFixed(1) + '" y="' + (100 - ht).toFixed(1) + '" text-anchor="middle" font-size="' + (b - a < 50 ? 16 : 20) + '" class="tb" style="fill:var(--strand)">+' + m(d) + '</text>';
      cur += d; marks.push(cur);
    });
    if (marks[marks.length - 1] !== paid) marks.push(paid);
    marks.forEach(function (v, j) {
      var x = X(v);
      s += '<line x1="' + x.toFixed(1) + '" y1="100" x2="' + x.toFixed(1) + '" y2="120" style="stroke:var(--ink)" stroke-width="3"/>';
      s += '<text x="' + x.toFixed(1) + '" y="' + (j % 2 && marks.length > 3 ? 168 : 144) + '" text-anchor="middle" font-size="20" class="tb">' + m(v) + '</text>';
    });
    return A.svg(440, 178, s, 'Count up from ' + m(price) + ' to ' + m(paid));
  }
  /* a number line of cents from a ten to the next ten, with the 5s marked; t = the total, arrow to its cash amount */
  function roundLine(t, show) {
    var lo = Math.floor(t / 10) * 10, x0 = 30, x1 = 410, s = '';
    function X(v) { return x0 + (v - lo) / 10 * (x1 - x0); }
    s += '<line x1="' + x0 + '" y1="70" x2="' + x1 + '" y2="70" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var v = lo; v <= lo + 10; v++) {
      var five = v % 5 === 0;
      s += '<line x1="' + X(v) + '" y1="' + (five ? 54 : 62) + '" x2="' + X(v) + '" y2="' + (five ? 86 : 78) + '" style="stroke:var(--ink)" stroke-width="' + (five ? 3 : 2) + '"/>';
      if (five) s += '<rect x="' + (X(v) - 26) + '" y="94" width="52" height="30" rx="6" style="fill:color-mix(in srgb,var(--strand) 16%,var(--card))"/><text x="' + X(v) + '" y="116" text-anchor="middle" font-size="19" class="tb">' + m(v) + '</text>';
    }
    s += '<circle cx="' + X(t) + '" cy="70" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + X(t) + '" y="40" text-anchor="middle" font-size="19" class="tb">' + m(t) + '</text>';
    if (show) { var c = cash(t); if (c !== t) s += '<path d="M' + X(t) + ' 82 Q' + ((X(t) + X(c)) / 2) + ' 108 ' + X(c) + ' 90" fill="none" style="stroke:var(--strand)" stroke-width="3"/>'; }
    return A.svg(440, 132, s, 'A number line from ' + m(lo) + ' to ' + m(lo + 10) + '. The total ' + m(t) + ' is marked.');
  }
  /* price tags in a row, and an optional total line like a receipt */
  function tags(items, total) {
    var s = '', x = 6, W = 0;
    items.forEach(function (it) {
      var w = Math.max(96, it[0].length * 10 + 26);
      s += '<path d="M' + (x + 16) + ' 8 H' + (x + w) + ' V78 H' + (x + 16) + ' L' + x + ' 43 Z" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/><circle cx="' + (x + 18) + '" cy="43" r="4" style="fill:var(--ink)"/>';
      s += '<text x="' + (x + 16 + (w - 16) / 2) + '" y="36" text-anchor="middle" font-size="16" class="t2">' + it[0] + '</text><text x="' + (x + 16 + (w - 16) / 2) + '" y="64" text-anchor="middle" font-size="22" class="tb">' + m(it[1]) + '</text>';
      x += w + 10; W = x;
    });
    var H = 88;
    if (total) { s += '<line x1="6" y1="96" x2="' + (W - 10) + '" y2="96" style="stroke:var(--line)" stroke-width="2"/><text x="6" y="124" font-size="19" class="tb">' + total + '</text>'; H = 134; }
    return A.svg(Math.max(W, 220), H, s, 'Prices: ' + items.map(function (it) { return it[0] + ' ' + m(it[1]); }).join(', '));
  }
  var SMALL = ['pencil', 'eraser', 'juice box', 'granola bar', 'apple', 'sticker', 'bookmark', 'banana', 'muffin', 'ribbon', 'orange', 'maple candy'];
  var BIG = ['book', 'puzzle', 'kite', 'ball', 'T-shirt', 'board game', 'water bottle', 'toque', 'pair of mittens', 'roll of hockey tape', 'paint set', 'jump rope'];
  var PLACES = ['at the school fair', 'at the corner store', 'at the farmers\' market', 'at the rink snack bar', 'at the book fair', 'at the canteen'];
  function an(w) { return G3.an(w); }

  /* a Watch or My turn clip: list = [[line, change to the picture (or a list of changes), ms], ...] */
  function sym(s) { return s.sym ? '<p class="g3-sym">' + s.sym + '</p>' : ''; }
  function clip(draw, start, list) {
    return { mount: G3.view(function (s) { return '<div>' + draw(s) + sym(s) + '</div>'; }, start), steps: list.map(function (s) {
      var st = { say: s[0], ms: s[2] || 1900 }, p = s[1];
      if (p) st.act = function (t) { return Array.isArray(p) ? t.seq(p, 900) : t.set(p, 700); };
      return st;
    }) };
  }

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }

  /* ======================= Lesson 1: Coins and cash ======================= */
  /* ---------- Count coins, biggest first ---------- */
  function handful(lv) {
    for (;;) {
      var l = [], n = R.int(lv === 1 ? 2 : 3, lv === 1 ? 5 : lv === 2 ? 6 : 9);
      for (var i = 0; i < n; i++) l.push(R.pick(lv === 1 ? [10, 5] : CENTS));
      if (sum(l) < 100 && (lv < 3 || new Set(l).size === 3)) return l;
    }
  }
  function dollarsHandful() { for (;;) { var l = [], n = R.int(3, 6); for (var i = 0; i < n; i++) l.push(R.pick([2000, 1000, 500, 200, 100])); if (sum(l) <= 5000) return l; } }
  function runText(l) { var run = 0; return l.slice().sort(function (a, b) { return b - a; }).map(function (v) { run += v; return m(run); }).join(', '); }
  function countFix(l) { var f = {}; f[l.length] = 'That counts the coins. Add what each one is worth.'; f[l.length * 10] = 'Not every coin is 10¢. Read each one.'; return f; }
  skill('mn-count', 'Count coins, biggest first', 'F1.1', [
    [1, 'plain', function (lv) {
      var dol = lv === 3 && coin(), l = dol ? dollarsHandful() : handful(lv), t = sum(l);
      return num('How much money is this?', dol ? t / 100 : t, dol ? {} : countFix(l), { unit: dol ? '$' : '¢', fig: coins(l),
        hint: 'Start with the biggest. Count on.', steps: ['Biggest first: ' + runText(l) + '.'], explain: m(t) + '.', meta: { k: 'g3mn-ct-pic', dol: dol } });
    }],
    [1, 'times', function (lv) {
      var pick = lv === 1 ? [[10, 2, 9], [5, 2, 9]] : lv === 2 ? [[25, 2, 3], [10, 3, 9], [5, 6, 19]] : [[25, 2, 3], [200, 3, 9], [500, 2, 9], [5, 11, 19]];
      var c = R.pick(pick), n = R.int(c[1], c[2]), t = n * c[0], dol = c[0] >= 100, f = {};
      f[dol ? n + c[0] / 100 : n + c[0]] = 'That adds. ' + n + ' coins of ' + m(c[0]) + ' is ' + n + ' &times; ' + m(c[0]) + '.';
      return num('How much are <b>' + n + ' ' + C[c[0]].name + (n > 1 ? 's' : '') + '</b>?', dol ? t / 100 : t, f, { unit: dol ? '$' : '¢', fig: lv === 1 ? coins(Array.apply(null, Array(n)).map(function () { return c[0]; })) : '',
        hint: 'Count by ' + m(c[0]) + ', ' + n + ' times.', steps: [n + ' &times; ' + m(c[0]) + ' = ' + m(t) + '.'], explain: m(t) + '.', meta: { k: 'g3mn-ct-times', n: n, c: c[0] } });
    }],
    [1, 'story', function (lv) {
      var who = Q.name(), l = handful(lv), t = sum(l);
      return num(who + ' finds ' + listName(l) + ' in a coat pocket. How much is that?', t, countFix(l), { unit: '¢',
        hint: 'Quarters 25¢, dimes 10¢, nickels 5¢. Biggest first.', steps: ['Count on: ' + runText(l) + '.'], explain: m(t) + '.', meta: { k: 'g3mn-ct-words' } });
    }],
    [1, 'tap', function (lv) {
      var set = [], seen = {};
      while (set.length < 3) { var l = handful(lv), t = sum(l); if (seen[t]) continue; seen[t] = 1; set.push(l); }
      var k = R.int(0, 2), tt = sum(set[k]), tiles = set.map(function (l) { return coins(l, null, 260); });
      return { q: 'Tap the coins that make <b>' + tt + '¢</b>.', type: 'tap', tiles: tiles, answer: k, answerText: listName(set[k]), wrong: tileFix(tiles, k, function (i) { return 'Those make ' + sum(set[i]) + '¢.'; }),
        hint: 'Count each group, biggest first.', steps: [listName(set[k]) + ': ' + runText(set[k]) + '.'], explain: listName(set[k]) + '.', meta: { k: 'g3mn-ct-tap', t: tt } };
    }],
    [2, 'tf', function (lv) {
      var l; do { l = handful(2); } while (l.length * 10 === sum(l) || l.length === sum(l));
      var who = Q.name(), truth = coin(), said = truth ? sum(l) : R.pick([l.length * 10, sum(l) + 5, sum(l) - 5]);
      return tf(who + ' says these coins make <b>' + said + '¢</b>. True or false: ' + who + ' is right.', truth, 'Biggest first: ' + runText(l) + '.',
        ['Every coin is worth 10¢.', 'Bigger coins are always worth more.', 'Count the coins, then add a zero.'], 'Count again, biggest first.', { fig: coins(l), hint: 'Read the value on each coin.', meta: { k: 'g3mn-ct-tf', said: said } });
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) { var l = handful(lv), t = sum(l); if (seen[t]) continue; seen[t] = 1; pairs.push([listName(l), t + '¢']); }
      return { q: 'Match each group of coins to its value.', type: 'match', pairs: pairs, hint: 'Biggest first, then count on.', steps: ['Quarters by 25s, dimes by 10s, nickels by 5s.'],
        explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'g3mn-ct-match' } };
    }]
  ]);
  function tgCount(lv) {
    return function () {
      var l; do { l = handful(lv); } while (new Set(l).size < 2);
      var kinds = CENTS.filter(function (v) { return l.indexOf(v) >= 0; }), steps = [], run = 0;
      kinds.forEach(function (v, i) {
        var n = l.filter(function (x) { return x === v; }).length, f = {};
        f[n] = 'That is how many ' + C[v].name + 's. How much are they worth?';
        steps.push({ prompt: i === 0 ? 'Start with the biggest coins.' : 'Now the ' + C[v].name + 's.', q: num('How much are the ' + n + ' ' + C[v].name + (n > 1 ? 's' : '') + '?', n * v, f, { unit: '¢', hint: 'Count by ' + v + 's.', meta: { k: 'g3mn-ct-times', n: n, c: v } }) });
        run += n * v;
      });
      steps.push({ prompt: 'Add the parts.', q: num(kinds.map(function (v) { return l.filter(function (x) { return x === v; }).length * v; }).join(' + ') + ' = ?', run, {}, { unit: '¢', hint: 'Add them.', meta: { k: 'g3mn-ct-sum' } }) });
      return { q: 'How much money is this?', fig: coins(l), done: 'That is ' + run + '¢.', steps: steps };
    };
  }

  /* ---------- Cash totals round to 5¢ ---------- */
  function rcase(lv) { var t; do { t = R.int(lv === 1 ? 11 : 6, 99); } while (t % 5 === 0 && (lv > 1 || coin())); return t; }
  function rFix(t) { var f = {}, ten = Math.round(t / 10) * 10; if (ten !== cash(t)) f[ten] = 'Round to the nearest 5¢, not 10¢.'; f[cash(t) === t - t % 5 ? t - t % 5 + 5 : t - t % 5] = 'Check which 5 is closer on the line.'; return f; }
  function rWhy(t) { var r = t % 10; return r === 0 || r === 5 ? m(t) + ' already ends in 0 or 5.' : 'It ends in ' + r + ': ' + (r === 1 || r === 2 || r === 6 || r === 7 ? 'round down' : 'round up') + ' to ' + m(cash(t)) + '.'; }
  function pair(lv) { for (;;) { var a = R.int(lv === 1 ? 10 : 6, 60), b = R.int(6, 45); if (a + b < 100 && (a + b) % 5 && a % 5 && (lv > 1 || (a + b) % 10)) return [a, b]; } }
  skill('mn-round', 'Cash totals round to 5¢', 'F1.1', [
    [1, 'plain', function (lv) {
      var t = rcase(lv);
      return num('The total is <b>' + m(t) + '</b>. You pay with cash. How much do you pay?', cash(t), rFix(t), { unit: '¢', fig: lv < 3 ? roundLine(t) : '',
        hint: 'Which is closer: the 5 below or the 5 above?', steps: [rWhy(t)], explain: m(cash(t)) + '.', meta: { k: 'g3mn-rd-num', t: t } });
    }],
    [1, 'card', function (lv) {
      var p = pair(lv), t = p[0] + p[1], items = R.shuffle(SMALL).slice(0, 2);
      return fill('You buy ' + an(items[0]) + ' for ' + m(p[0]) + ' and ' + an(items[1]) + ' for ' + m(p[1]) + '.', 'By card you pay the exact total: [[]]¢<br>By cash you pay: [[]]¢', [t, cash(t)], { fig: tags([[items[0], p[0]], [items[1], p[1]]]),
        hint: 'Add first. Then round the total to the nearest 5¢.', steps: [p[0] + ' + ' + p[1] + ' = ' + t + '.', rWhy(t)], explain: 'Card ' + m(t) + ', cash ' + m(cash(t)) + '.', meta: { k: 'g3mn-rd-card', a: p[0], b: p[1] } });
    }],
    [1, 'up', function (lv) {
      var t; do { t = rcase(lv); } while (t % 5 === 0);
      var up = cash(t) > t, o = ['Up to ' + m(t - t % 5 + 5), 'Down to ' + m(t - t % 5), 'It stays ' + m(t)], ans = up ? 0 : 1, w = {};
      w[o[1 - ans]] = 'Look at the line: which 5 is closer?'; w[o[2]] = 'Cash totals always end in 0 or 5.';
      var sh = R.shuffle([0, 1, 2]);
      return put({ q: 'Paying cash, does <b>' + m(t) + '</b> round up or down?', type: 'mc', options: sh.map(function (i) { return o[i]; }), answer: sh.indexOf(ans), wrong: w }, { fig: roundLine(t),
        hint: 'Count the steps to each 5.', steps: [rWhy(t)], explain: rWhy(t), meta: { k: 'g3mn-rd-up', t: t } });
    }, 2],
    [1, 'line', function (lv) {
      var t; do { t = rcase(lv); } while (t % 5 === 0);
      var lo = Math.floor(t / 10) * 10;
      return { q: 'The total is <b>' + m(t) + '</b>. Put the marker on what you pay in cash.', type: 'line', min: lo, max: lo + 10, tick: 1, every: 5, snap: 1, answer: cash(t), hideValue: true, label: function (v) { return v + '¢'; },
        hint: 'Cash amounts end in 0 or 5.', steps: [rWhy(t)], explain: m(cash(t)) + '.', meta: { k: 'g3mn-rd-line', t: t } };
    }],
    [2, 'tf', function (lv) {
      var t; do { t = rcase(lv); } while (t % 5 === 0 || Math.round(t / 10) * 10 === cash(t));
      var who = Q.name(), truth = coin(), said = truth ? cash(t) : Math.round(t / 10) * 10;
      return tf('The total is ' + m(t) + '. ' + who + ' says the cash total is <b>' + m(said) + '</b>. True or false: ' + who + ' is right.', truth, rWhy(t),
        ['Cash totals round to the nearest 10¢.', 'Always round up.', 'Cash totals are not rounded.'], 'Round to the nearest 5¢, not 10¢.', { fig: roundLine(t), hint: 'Nearest 5¢.', meta: { k: 'g3mn-rd-tf', t: t, said: said } });
    }],
    [2, 'sum', function (lv) {
      var p = pair(lv), who = Q.name(), t = p[0] + p[1], f = rFix(t);
      f[t] = 'That is the exact total. Cash rounds it to the nearest 5¢.';
      return num(who + ' buys two things ' + R.pick(PLACES) + ': ' + m(p[0]) + ' and ' + m(p[1]) + '. ' + who + ' pays cash. How much does ' + who + ' pay?', cash(t), f, { unit: '¢',
        hint: 'Add. Then round to the nearest 5¢.', steps: [p[0] + ' + ' + p[1] + ' = ' + t + '.', rWhy(t)], explain: m(cash(t)) + '.', meta: { k: 'g3mn-rd-sum', a: p[0], b: p[1] } });
    }],
    [2, 'pick', function (lv) {
      var c = R.pick([15, 25, 35, 45, 55, 65, 75, 85]), opts = R.shuffle([c - 4, c - 3, c - 2, c - 1, c + 1, c + 2, c + 3, c + 4]).slice(0, 5), ans = [];
      opts.forEach(function (v, j) { if (cash(v) === c) ans.push(j); });
      return { q: 'Pick every total that you would pay as <b>' + m(c) + '</b> in cash.', type: 'pick', options: opts.map(m), answer: ans,
        hint: 'Totals 1 or 2 away from ' + m(c) + ' round to it.', steps: [m(c - 2) + ' to ' + m(c + 2) + ' round to ' + m(c) + '.'], explain: ans.map(function (j) { return m(opts[j]); }).join(', ') + '.', meta: { k: 'g3mn-rd-pick', c: c } };
    }],
    [3, 'change', function (lv) {
      var p = pair(3), t = p[0] + p[1], f = {};
      f[100 - t] = 'Round the total to ' + m(cash(t)) + ' first.';
      return num('Two things cost ' + m(p[0]) + ' and ' + m(p[1]) + '. You pay with a loonie, in cash. How much change do you get?', 100 - cash(t), f, { unit: '¢',
        hint: 'Add, round to the nearest 5¢, then count up to $1.', steps: [p[0] + ' + ' + p[1] + ' = ' + t + '. Cash: ' + m(cash(t)) + '.', '100 &minus; ' + cash(t) + ' = ' + (100 - cash(t)) + '.'], explain: m(100 - cash(t)) + '.', meta: { k: 'g3mn-rd-change', a: p[0], b: p[1] } });
    }]
  ]);
  function tgRound(lv) {
    return function () {
      var t; do { t = rcase(lv === 1 ? 2 : lv); } while (t % 5 === 0);
      var lo = t - t % 5, hi = lo + 5, up = cash(t) === hi, f3 = {};
      f3[Math.round(t / 10) * 10] = 'Nearest 5¢, not 10¢.';
      return { q: 'The total is ' + m(t) + '. How much do you pay in cash?', fig: roundLine(t), done: rWhy(t), steps: [
        { prompt: 'Find the 5s on each side.', q: fill('The 5s on each side', '[[]]¢ and [[]]¢', [lo, hi], { hint: 'Look for the labels on the line.', meta: { k: 'g3mn-rd-near', t: t } }) },
        { prompt: 'Which one is closer?', q: put({ q: 'Which is closer to ' + m(t) + '?', type: 'mc', options: [m(lo), m(hi)], answer: up ? 1 : 0, wrong: (function () { var w = {}; w[m(up ? lo : hi)] = 'Count the small steps to each one.'; return w; })() }, { hint: 'Count the steps.', meta: { k: 'g3mn-rd-close', t: t } }) },
        { prompt: 'That is the cash total.', q: num('How much do you pay in cash?', cash(t), f3, { unit: '¢', hint: 'The closer 5.', meta: { k: 'g3mn-rd-num', t: t } }) }
      ] };
    };
  }

  /* ======================= Lesson 2: Change from a dollar ======================= */
  /* ---------- Count up to make change ---------- */
  function price(lv) { return lv === 1 ? R.int(1, 9) * 10 : R.int(1, 19) * 5; }
  function upFix(p, paid) { var f = {}, ch = paid - p, t = Math.floor(ch / 10) * 10, o = ch % 10; f[p] = 'That is the price. Count up from it to ' + m(paid) + '.'; if (o) f[(10 - Math.floor(p / 10) - 1) * 10 + o] = 'Count up from ' + m(p) + ': first to the next 10, then on.'; f[ch + 10] = 'Count the jumps again.'; return f; }
  function hops(p, paid) { var ch = make(paid - p, CENTS).reverse(), run = p; return [m(p)].concat(ch.map(function (d) { run += d; return m(run); })).join(', '); }
  /* two hops for the count-up: to the next 10 (or 25 or 50), then to what was paid */
  function twoHops(p, paid) { var a = p % 10 ? p - p % 10 + 10 : p % 25 ? p - p % 25 + 25 : p + 25; if (a >= paid) a = paid - 5; return [a - p, paid - a, a]; }
  skill('mn-up', 'Count up to make change', 'F1.1', [
    [1, 'plain', function (lv) {
      var p = price(lv), it = R.pick(SMALL);
      return num(cap(an(it)) + ' costs ' + m(p) + '. You pay with a loonie ($1). How much change do you get?', 100 - p, upFix(p, 100), { unit: '¢', fig: lv === 1 ? countUp(p, 100) : coins([100]),
        hint: 'Count up from ' + m(p) + ' to $1.', steps: ['Count up: ' + hops(p, 100) + '.', 'The jumps add to ' + m(100 - p) + '.'], explain: m(100 - p) + '.', meta: { k: 'g3mn-up-num', p: p, paid: 100 } });
    }],
    [1, 'hops', function (lv) {
      var p; do { p = price(lv); } while ((p % 10 === 0 && lv > 1) || p > 90);
      var h = twoHops(p, 100);
      return fill(cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. Count up to $1.', m(p) + ' + [[]]¢ = ' + m(h[2]) + '<br>' + m(h[2]) + ' + [[]]¢ = $1<br>Change: [[]]¢', [h[0], h[1], 100 - p], { fig: lv < 3 ? countUp(p, 100) : '',
        hint: 'Jump to a friendly number first.', steps: [m(p) + ' + ' + h[0] + '¢ = ' + m(h[2]) + '.', m(h[2]) + ' + ' + h[1] + '¢ = $1.', h[0] + ' + ' + h[1] + ' = ' + (100 - p) + '.'], explain: m(100 - p) + ' change.', meta: { k: 'g3mn-up-hops', p: p, paid: 100 } });
    }],
    [1, 'story', function (lv) {
      var p = price(lv), who = Q.name(), it = R.pick(SMALL);
      return num(who + ' buys ' + an(it) + ' ' + R.pick(PLACES) + ' for ' + m(p) + ' and pays with a loonie. How much change does ' + who + ' get?', 100 - p, upFix(p, 100), { unit: '¢',
        hint: 'A loonie is 100¢. Count up from the price.', steps: ['Count up: ' + hops(p, 100) + '.'], explain: m(100 - p) + '.', meta: { k: 'g3mn-up-num', p: p, paid: 100 } });
    }],
    [2, 'match', function (lv) {
      var ps = R.shuffle(lv === 3 ? [15, 35, 45, 55, 65, 85, 95] : [10, 20, 30, 40, 60, 70, 80, 90, 25, 75]).slice(0, 3);
      return { q: 'You pay with a loonie each time. Match each price to the change.', type: 'match', pairs: ps.map(function (p) { return ['costs ' + m(p), m(100 - p) + ' change']; }),
        hint: 'Price + change = 100¢.', steps: ['Count up from each price to 100¢.'], explain: ps.map(function (p) { return m(p) + ' + ' + m(100 - p) + ' = $1'; }).join('. ') + '.', meta: { k: 'g3mn-up-match', paid: 100 } };
    }],
    [2, 'tf', function (lv) {
      var p = R.int(1, 9) * 10 + 5, who = Q.name(), truth = coin(), wrong = (10 - Math.floor(p / 10)) * 10 + 5, said = truth ? 100 - p : wrong;
      return tf(cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. You pay with a loonie. ' + who + ' says the change is <b>' + m(said) + '</b>. True or false: ' + who + ' is right.', truth, 'Count up: ' + hops(p, 100) + '. The change is ' + m(100 - p) + '.',
        ['Take the tens from 10 and keep the 5.', 'The change is always 50¢.', 'Add the price to 100.'], 'Check: does the price plus the change make 100¢?', { fig: countUp(p, 100, 0), hint: 'Price + change must make 100¢.', meta: { k: 'g3mn-up-tf', p: p, paid: 100, said: said } });
    }],
    [3, 'pay', function (lv) {
      var paid = R.pick([50, 75]), p = R.int(1, paid / 5 - 1) * 5, it = R.pick(SMALL), f = upFix(p, paid);
      f[100 - p] = 'You paid ' + m(paid) + ', not $1.';
      return num(cap(an(it)) + ' costs ' + m(p) + '. You pay with ' + (paid === 50 ? '2 quarters' : '3 quarters') + '. How much change do you get?', paid - p, f, { unit: '¢', fig: coins(paid === 50 ? [25, 25] : [25, 25, 25]),
        hint: (paid === 50 ? '2 quarters is 50¢.' : '3 quarters is 75¢.') + ' Count up from the price.', steps: ['You pay ' + m(paid) + '.', 'Count up: ' + hops(p, paid) + '.'], explain: m(paid - p) + '.', meta: { k: 'g3mn-up-num', p: p, paid: paid } });
    }]
  ]);
  function tgUp(lv) {
    return function () {
      var p; do { p = price(lv); } while ((p % 10 === 0 && lv > 1) || p > 90);
      var h = twoHops(p, 100), f3 = {};
      f3[p] = 'That is the price.';
      return { q: cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. You pay $1. How much change?', fig: countUp(p, 100), done: m(100 - p) + ' change: ' + m(p) + ' + ' + m(100 - p) + ' = $1.', steps: [
        { prompt: 'Jump to ' + m(h[2]) + ' first.', q: num(m(p) + ' + ? = ' + m(h[2]), h[0], {}, { unit: '¢', hint: 'Count on from ' + m(p) + '.', meta: { k: 'g3mn-up-gap', a: p, b: h[2] } }) },
        { prompt: 'Now jump to $1.', q: num(m(h[2]) + ' + ? = $1', h[1], {}, { unit: '¢', hint: 'What makes 100?', meta: { k: 'g3mn-up-gap', a: h[2], b: 100 } }) },
        { prompt: 'Add the two jumps.', q: num(h[0] + '¢ + ' + h[1] + '¢ = ?', 100 - p, f3, { unit: '¢', hint: 'Add them.', meta: { k: 'g3mn-up-num', p: p, paid: 100 } }) }
      ] };
    };
  }

  /* ---------- Add the prices, then find the change ---------- */
  function basket(lv) {
    for (;;) {
      var n = lv === 3 ? 3 : 2, ps = [];
      for (var i = 0; i < n; i++) ps.push(lv === 1 ? R.int(1, 8) * 5 : R.int(6, 45));
      var t = sum(ps);
      if (t < 96 && (lv === 1 || t % 5)) return { ps: ps, items: R.shuffle(SMALL).slice(0, n), t: t, c: cash(t) };
    }
  }
  function bSteps(b) { return [b.ps.join(' + ') + ' = ' + b.t + '.', b.c === b.t ? 'It ends in 0 or 5: pay ' + m(b.c) + '.' : rWhy(b.t), '100 &minus; ' + b.c + ' = ' + (100 - b.c) + '.']; }
  function bFix(b) { var f = {}; f[100 - b.t] = 'Round the total to ' + m(b.c) + ' before you find the change.'; f[100 - b.ps[0]] = 'Add all the prices first.'; f[b.c] = 'That is the cash total. Now find the change from $1.'; return f; }
  skill('mn-two', 'Add the prices, then find the change', 'F1.1', [
    [1, 'plain', function (lv) {
      var b = basket(lv);
      return num('You buy ' + b.items.map(an).join(' and ') + '. You pay cash with a loonie. How much change do you get?', 100 - b.c, bFix(b), { unit: '¢', fig: tags(b.items.map(function (it, i) { return [it, b.ps[i]]; })),
        hint: 'Add. Round to the nearest 5¢. Then count up to $1.', steps: bSteps(b), explain: m(100 - b.c) + '.', meta: { k: 'g3mn-two-chg', ps: b.ps } });
    }],
    [1, 'total', function (lv) {
      var b = basket(lv), f = {};
      f[b.ps[0] + b.ps[1] + 10] = 'Add the tens, then the ones.';
      return num('How much do ' + b.items.map(an).join(' and ') + ' cost together?', b.t, f, { unit: '¢', fig: tags(b.items.map(function (it, i) { return [it, b.ps[i]]; })),
        hint: 'Add the prices.', steps: [b.ps.join(' + ') + ' = ' + b.t + '.'], explain: m(b.t) + '.', meta: { k: 'g3mn-two-tot', ps: b.ps } });
    }],
    [1, 'fill', function (lv) {
      var b = basket(lv);
      return fill('You buy ' + b.items.map(an).join(' and ') + ' and pay cash with a loonie.', 'Total: [[]]¢<br>Cash total: [[]]¢<br>Change: [[]]¢', [b.t, b.c, 100 - b.c], { fig: tags(b.items.map(function (it, i) { return [it, b.ps[i]]; })),
        hint: 'Three steps: add, round, count up.', steps: bSteps(b), explain: m(b.t) + ', then ' + m(b.c) + ', then ' + m(100 - b.c) + ' change.', meta: { k: 'g3mn-two-fill', ps: b.ps } });
    }],
    [2, 'mc', function (lv) {
      var b = basket(lv), f = bFix(b), W = [];
      Object.keys(f).forEach(function (k) { if (+k > 0 && +k !== 100 - b.c) W.push([m(+k), f[k]]); });
      W.push([m(100 - b.c + 10), 'Count up from ' + m(b.c) + ' again.']);
      return mc('You buy ' + b.items.map(an).join(' and ') + ' with a loonie, in cash. What is your change?', m(100 - b.c), W, { fig: tags(b.items.map(function (it, i) { return [it, b.ps[i]]; })),
        hint: 'Add, round, then count up.', steps: bSteps(b), explain: m(100 - b.c) + '.', meta: { k: 'g3mn-two-mc', ps: b.ps } });
    }],
    [2, 'tf', function (lv) {
      var b = basket(2), who = Q.name(), truth = coin(), said = truth ? 100 - b.c : 100 - b.t;
      if (said === 100 - b.c && !truth) said += 5;
      return tf(who + ' buys ' + b.items.map(an).join(' and ') + ' with a loonie, in cash. ' + who + ' says the change is <b>' + m(said) + '</b>. True or false: ' + who + ' is right.', said === 100 - b.c, 'Total ' + m(b.t) + ', cash ' + m(b.c) + ', change ' + m(100 - b.c) + '.',
        ['Cash totals are not rounded.', 'Change is the total minus $1.', 'Only the first price counts.'], 'Add, round to the nearest 5¢, then count up to $1.', { fig: tags(b.items.map(function (it, i) { return [it, b.ps[i]]; })), hint: 'Did ' + who + ' round first?', meta: { k: 'g3mn-two-tf', ps: b.ps, said: said } });
    }],
    [2, 'receipt', function (lv) {
      var b = basket(3), f = bFix(b);
      return num('Here is your bill. You pay cash with a loonie. How much change do you get?', 100 - b.c, f, { unit: '¢', fig: tags(b.items.map(function (it, i) { return [it, b.ps[i]]; }), 'Total: ' + m(b.t)),
        hint: 'Round the total to the nearest 5¢ first.', steps: bSteps(b).slice(1), explain: m(100 - b.c) + '.', meta: { k: 'g3mn-two-chg', ps: b.ps } });
    }]
  ]);
  function tgTwo(lv) {
    return function () {
      var b = basket(lv), f2 = {}, f3 = {};
      f2[Math.round(b.t / 10) * 10] = 'Nearest 5¢, not 10¢.';
      f3[100 - b.t] = 'Use the cash total, ' + m(b.c) + '.';
      return { q: 'You buy ' + b.items.map(an).join(' and ') + '. You pay cash with a loonie.', fig: tags(b.items.map(function (it, i) { return [it, b.ps[i]]; })), done: 'Change: ' + m(100 - b.c) + '.', steps: [
        { prompt: 'Add the prices.', q: num(b.ps.join('¢ + ') + '¢ = ?', b.t, {}, { unit: '¢', hint: 'Tens, then ones.', meta: { k: 'g3mn-two-tot', ps: b.ps } }) },
        { prompt: 'Round to the nearest 5¢.', q: num('What do you pay in cash?', b.c, f2, { unit: '¢', hint: 'Which 5 is closer?', meta: { k: 'g3mn-rd-num', t: b.t } }) },
        { prompt: 'Count up to $1.', q: num('How much change?', 100 - b.c, f3, { unit: '¢', hint: 'Count up from ' + m(b.c) + '.', meta: { k: 'g3mn-up-num', p: b.c, paid: 100 } }) }
      ] };
    };
  }

  /* ---------- Give change with the fewest coins ---------- */
  function cnt(l, v) { return l.filter(function (x) { return x === v; }).length; }
  function giveFix(ch) { var f = {}, l = make(ch, CENTS); f[ch / 5] = 'That is all nickels. Use quarters and dimes first.'; f[l.length + 1] = 'Use the biggest coin that fits, again and again.'; return f; }
  skill('mn-give', 'Give change with the fewest coins', 'F1.1', [
    [1, 'plain', function (lv) {
      var p = price(lv), ch = 100 - p, l = make(ch, CENTS), w = {};
      w[[cnt(l, 25), cnt(l, 10) + 2, Math.max(0, cnt(l, 5) - 1)].join(', ')] = 'Use quarters first.';
      return fill(cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. You pay $1. Give the change with the <b>fewest</b> coins.', '[[]] quarters, [[]] dimes and [[]] nickels', [cnt(l, 25), cnt(l, 10), cnt(l, 5)], { fig: lv === 1 ? countUp(p, 100) : '', wrong: w,
        hint: 'Change: ' + (lv === 1 ? m(ch) : 'count up first') + '. Then quarters while you can, then dimes, then nickels.', steps: ['The change is ' + m(ch) + '.', listName(l) + ' make ' + m(ch) + '.<div class="fig">' + coins(l) + '</div>'], explain: listName(l) + '.', meta: { k: 'g3mn-gv-fill', ch: ch } });
    }],
    [1, 'build', function (lv) {
      var p = price(lv), it = R.pick(SMALL);
      return { q: 'You sell ' + an(it) + ' for ' + m(p) + '. The customer pays with a loonie. Show the change with coins.', type: 'build', tool: 'coins', answer: 100 - p,
        hint: 'Count up from ' + m(p) + ' to $1 as you add coins.', steps: ['The change is ' + m(100 - p) + '.', 'One way: ' + listName(make(100 - p, CENTS)) + '.'], explain: m(100 - p) + ' in coins.', meta: { k: 'g3mn-gv-build', p: p } };
    }],
    [1, 'count', function (lv) {
      var ch = lv === 1 ? R.int(1, 9) * 10 : R.int(2, 19) * 5, l = make(ch, CENTS);
      return num('What is the fewest number of coins that make <b>' + m(ch) + '</b>?', l.length, giveFix(ch), {
        hint: 'Quarters first, then dimes, then nickels. Count the coins.', steps: [listName(l) + '.', l.length + ' coins.'], explain: l.length + ' coins: ' + listName(l) + '.', meta: { k: 'g3mn-gv-count', ch: ch } });
    }],
    [2, 'mc', function (lv) {
      var p = price(lv), ch = 100 - p, l = make(ch, CENTS), W = [];
      [[25], [10], [5]].forEach(function (x) { var w = l.concat(x); W.push([listName(w), 'Those make ' + m(sum(w)) + '. Too much.']); });
      if (l.length > 1) { var s2 = l.slice(1); W.push([listName(s2), 'Those make ' + m(sum(s2)) + '. Not enough.']); }
      return mc(cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. You pay $1. Which coins are the right change?', listName(l), W, {
        hint: 'Find the change first. Then add up each choice.', steps: ['Change: 100 &minus; ' + p + ' = ' + ch + '.', listName(l) + ' make ' + m(ch) + '.'], explain: listName(l) + '.', meta: { k: 'g3mn-gv-mc', ch: ch } });
    }],
    [2, 'tf', function (lv) {
      var ch = R.int(4, 19) * 5, l = make(ch, CENTS), who = Q.name(), truth = coin(), said = l;
      if (!truth) said = l.indexOf(25) >= 0 ? l.filter(function (x, i) { return i !== l.indexOf(25); }).concat([10, 10, 5]) : l.concat([5]);
      return tf(who + ' gives ' + m(ch) + ' in change as <b>' + listName(said) + '</b>. True or false: that is the right change with the fewest coins.', truth, 'The fewest coins for ' + m(ch) + ': ' + listName(l) + '.',
        ['Any coins that make the amount are the fewest.', 'Nickels make the fewest coins.', 'Quarters are only for $1.'], 'Add up ' + who + '\'s coins. Then try quarters first.', { fig: coins(said), hint: 'Do they make ' + m(ch) + '? Could fewer coins do it?', meta: { k: 'g3mn-gv-tf', ch: ch, said: said } });
    }],
    [3, 'back', function (lv) {
      var l = handful(2), ch = sum(l), p = 100 - ch, f = {};
      f[ch] = 'That is the change. The price is the rest of the $1.';
      return num('You pay with a loonie and get back ' + listName(l) + '. What was the price?', p, f, { unit: '¢', fig: coins(l),
        hint: 'Price + change = $1.', steps: ['The change is ' + m(ch) + '.', '100 &minus; ' + ch + ' = ' + p + '.'], explain: m(p) + '.', meta: { k: 'g3mn-gv-back', coins: l } });
    }]
  ]);
  function tgGive(lv) {
    return function () {
      var p; do { p = price(lv); } while (100 - p < 25 && lv > 1);
      var ch = 100 - p, l = make(ch, CENTS), q25 = cnt(l, 25), left = ch - q25 * 25, f2 = {};
      f2[Math.floor(ch / 10)] = 'Use quarters first.';
      return { q: cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. You pay $1. Give the change with the fewest coins.', fig: countUp(p, 100), done: listName(l) + ': ' + m(ch) + '.', steps: [
        { prompt: 'Find the change first.', q: num('How much change?', ch, upFix(p, 100), { unit: '¢', hint: 'Count up to $1.', meta: { k: 'g3mn-up-num', p: p, paid: 100 } }) },
        { prompt: 'Quarters first.', q: num('How many quarters fit in ' + m(ch) + '?', q25, f2, { hint: 'Count by 25s without going over.', meta: { k: 'g3mn-gv-q', ch: ch } }) },
        { prompt: 'Then dimes and nickels for the rest: ' + m(left) + '.', q: fill('The rest is ' + m(left) + '.', '[[]] dimes and [[]] nickels', [cnt(l, 10), cnt(l, 5)], { hint: 'Dimes first.', meta: { k: 'g3mn-gv-rest', ch: left } }) }
      ] };
    };
  }

  /* ======================= Lesson 3: Change from a bill ======================= */
  function billCase(lv) {
    var b = lv === 1 ? R.pick([500, 1000]) : lv === 2 ? R.pick([1000, 2000]) : R.pick([2000, 5000]), p = R.int(lv === 3 ? 11 : 1, b / 100 - 1) * 100;
    return { b: b, p: p, ch: b - p };
  }
  function billFix(c) { var f = {}; f[c.p / 100] = 'That is the price. Count up from it.'; f[(c.b + c.p) / 100] = 'Change is less than what you paid. Count up or subtract.'; f[c.ch / 100 + 1] = 'Count the jumps again.'; return f; }
  function bHops(c) { var ch = make(c.ch, DOLLARS).reverse(), run = c.p; return [m(c.p)].concat(ch.map(function (d) { run += d; return m(run); })).join(', '); }
  skill('mn-bill', 'Count up to the bill', 'F1.1', [
    [1, 'plain', function (lv) {
      var c = billCase(lv), it = R.pick(BIG);
      return num(cap(an(it)) + ' costs ' + m(c.p) + '. You pay with a ' + m(c.b) + ' bill. How much change do you get?', c.ch / 100, billFix(c), { unit: '$', fig: lv < 3 ? countUp(c.p, c.b) : coins([c.b]),
        hint: 'Count up from ' + m(c.p) + ' to ' + m(c.b) + '.', steps: ['Count up: ' + bHops(c) + '.'], explain: m(c.ch) + '.', meta: { k: 'g3mn-bl-num', p: c.p, b: c.b } });
    }],
    [1, 'hops', function (lv) {
      var c; do { c = billCase(lv); } while (c.p % 500 === 0 || Math.ceil(c.p / 500) * 500 >= c.b);
      var a = Math.ceil(c.p / 500) * 500;
      return fill('A ' + R.pick(BIG) + ' costs ' + m(c.p) + '. You pay ' + m(c.b) + '. Count up.', m(c.p) + ' + $[[]] = ' + m(a) + '<br>' + m(a) + ' + $[[]] = ' + m(c.b) + '<br>Change: $[[]]', [(a - c.p) / 100, (c.b - a) / 100, c.ch / 100], { fig: countUp(c.p, c.b),
        hint: 'Jump to the next $5 first.', steps: [m(c.p) + ' + ' + m(a - c.p) + ' = ' + m(a) + '.', m(a) + ' + ' + m(c.b - a) + ' = ' + m(c.b) + '.'], explain: m(c.ch) + '.', meta: { k: 'g3mn-bl-hops', p: c.p, b: c.b, a: a } });
    }],
    [1, 'story', function (lv) {
      var c = billCase(lv), who = Q.name(), it = R.pick(BIG);
      return num(who + ' buys ' + an(it) + ' for ' + m(c.p) + ' ' + R.pick(PLACES) + ' and pays with a ' + m(c.b) + ' bill. How much change does ' + who + ' get?', c.ch / 100, billFix(c), { unit: '$',
        hint: 'Count up from the price to the bill.', steps: ['Count up: ' + bHops(c) + '.'], explain: m(c.ch) + '.', meta: { k: 'g3mn-bl-num', p: c.p, b: c.b } });
    }],
    [2, 'coins', function (lv) {
      var b = R.pick([1000, 2000]), p = R.int(b / 100 - 9, b / 100 - 1) * 100, ch = b - p, l = make(ch, [500, 200, 100]);
      return fill('A ' + R.pick(BIG) + ' costs ' + m(p) + '. You pay ' + m(b) + '. Give the change with the fewest bills and coins.', '[[]] $5 bills, [[]] toonies and [[]] loonies', [cnt(l, 500), cnt(l, 200), cnt(l, 100)], { fig: lv === 2 ? countUp(p, b) : '',
        hint: 'Change: ' + m(ch) + '. Biggest first.', steps: ['The change is ' + m(ch) + '.', listName(l) + '.'], explain: listName(l) + '.', meta: { k: 'g3mn-bl-coins', ch: ch } });
    }],
    [2, 'match', function (lv) {
      var b = lv === 3 ? 5000 : 2000, ps = R.shuffle(Array.apply(null, Array(b / 100 - 1)).map(function (_, i) { return (i + 1) * 100; })).slice(0, 3);
      return { q: 'You pay with a <b>' + m(b) + '</b> bill each time. Match each price to the change.', type: 'match', pairs: ps.map(function (p) { return ['costs ' + m(p), m(b - p) + ' change']; }),
        hint: 'Price + change = ' + m(b) + '.', steps: ['Count up from each price.'], explain: ps.map(function (p) { return m(p) + ' + ' + m(b - p) + ' = ' + m(b); }).join('. ') + '.', meta: { k: 'g3mn-bl-match', b: b } };
    }],
    [2, 'tf', function (lv) {
      var c = billCase(lv), who = Q.name(), truth = coin(), said = truth ? c.ch : R.pick([c.ch + 100, c.ch - 100, c.p]);
      if (said <= 0 || (said === c.ch) !== truth) said = c.ch + 100;
      return tf(cap(an(R.pick(BIG))) + ' costs ' + m(c.p) + '. ' + who + ' pays with a ' + m(c.b) + ' bill and says the change is <b>' + m(said) + '</b>. True or false: ' + who + ' is right.', said === c.ch, 'Count up: ' + bHops(c) + '. Change ' + m(c.ch) + '.',
        ['The change is the same as the price.', 'Count the starting number as a jump.', 'Change is always a toonie.'], 'Check: price + change must make ' + m(c.b) + '.', { fig: countUp(c.p, c.b, 0), hint: 'Price + change = the bill.', meta: { k: 'g3mn-bl-tf', p: c.p, b: c.b, said: said } });
    }]
  ]);
  function tgBill(lv) {
    return function () {
      var c; do { c = billCase(lv); } while (c.p % 500 === 0 || Math.ceil(c.p / 500) * 500 >= c.b);
      var a = Math.ceil(c.p / 500) * 500;
      return { q: 'A ' + R.pick(BIG) + ' costs ' + m(c.p) + '. You pay with a ' + m(c.b) + ' bill.', fig: countUp(c.p, c.b), done: m(c.ch) + ' change.', steps: [
        { prompt: 'Jump to the next $5.', q: num(m(c.p) + ' + ? = ' + m(a), (a - c.p) / 100, {}, { unit: '$', hint: 'Count on in loonies.', meta: { k: 'g3mn-bl-gap', a: c.p, b: a } }) },
        { prompt: 'Then jump to the bill.', q: num(m(a) + ' + ? = ' + m(c.b), (c.b - a) / 100, {}, { unit: '$', hint: 'Count by 5s.', meta: { k: 'g3mn-bl-gap', a: a, b: c.b } }) },
        { prompt: 'Add the jumps.', q: num(m(a - c.p) + ' + ' + m(c.b - a) + ' = ?', c.ch / 100, {}, { unit: '$', hint: 'Add them.', meta: { k: 'g3mn-bl-num', p: c.p, b: c.b } }) }
      ] };
    };
  }

  /* ---------- Subtract to find the change ---------- */
  function subCase(lv) {
    for (;;) {
      var b = lv === 1 ? 1000 : lv === 2 ? 2000 : R.pick([5000, 10000]), p = R.int(lv === 1 ? 1 : 11, b / 100 - 1);
      if (lv > 1 && p % 10 === 0) continue;
      return { b: b, p: p * 100, ch: b - p * 100 };
    }
  }
  function subFix(c) { var f = {}, B = c.b / 100, P = c.p / 100; f[B + P] = 'That adds. Change is what you paid minus the price.'; var bad = (Math.floor(B / 10) - Math.floor(P / 10)) * 10 + Math.abs(B % 10 - P % 10); if (bad !== B - P) f[bad] = 'Regroup: take 1 ten to make 10 ones before you subtract.'; f[B - P - 10] = 'Check the tens again.'; return f; }
  skill('mn-sub', 'Subtract to find the change', 'F1.1', [
    [1, 'plain', function (lv) {
      var c = subCase(lv);
      return num('<span class="math">' + m(c.b) + ' &minus; ' + m(c.p) + ' = ?</span>', c.ch / 100, subFix(c), { unit: '$', fig: coins(make(c.b, [10000, 5000, 2000, 1000])),
        hint: 'Subtract, or count up from ' + m(c.p) + '.', steps: [m(c.b) + ' &minus; ' + m(c.p) + ' = ' + m(c.ch) + '.', 'Check: ' + m(c.p) + ' + ' + m(c.ch) + ' = ' + m(c.b) + '.'], explain: m(c.ch) + '.', meta: { k: 'g3mn-sb-num', b: c.b, ps: [c.p] } });
    }],
    [1, 'story', function (lv) {
      var c = subCase(lv), who = Q.name(), it = R.pick(BIG);
      return num(who + ' buys ' + an(it) + ' for ' + m(c.p) + ' and pays with ' + (c.b === 10000 ? 'a $100 bill' : c.b === 5000 ? 'a $50 bill' : 'a ' + m(c.b) + ' bill') + '. Subtract to find the change.', c.ch / 100, subFix(c), { unit: '$', fig: tags([[it, c.p]]),
        hint: 'Paid minus price.', steps: [m(c.b) + ' &minus; ' + m(c.p) + ' = ' + m(c.ch) + '.'], explain: m(c.ch) + '.', meta: { k: 'g3mn-sb-num', b: c.b, ps: [c.p] } });
    }],
    [1, 'fill', function (lv) {
      var c = subCase(lv);
      return fill('A ' + R.pick(BIG) + ' costs ' + m(c.p) + '. You pay ' + m(c.b) + '. Fill in the change and check it.', m(c.b) + ' &minus; ' + m(c.p) + ' = $[[]]<br>Check: ' + m(c.p) + ' + $[[]] = $[[]]', [c.ch / 100, c.ch / 100, c.b / 100], {
        hint: 'Subtract. Then add back to check.', steps: [m(c.b) + ' &minus; ' + m(c.p) + ' = ' + m(c.ch) + '.', m(c.p) + ' + ' + m(c.ch) + ' = ' + m(c.b) + '.'], explain: m(c.ch) + '.', meta: { k: 'g3mn-sb-fill', b: c.b, p: c.p } });
    }],
    [2, 'mc', function (lv) {
      var c = subCase(lv), f = subFix(c), W = [];
      Object.keys(f).forEach(function (k) { if (+k > 0 && +k !== c.ch / 100) W.push(['$' + k, f[k]]); });
      W.push(['$' + (c.ch / 100 + 1), 'Check: price + change must make ' + m(c.b) + '.']);
      return mc('A ' + R.pick(BIG) + ' costs ' + m(c.p) + '. You pay with ' + m(c.b) + '. What is the change?', m(c.ch), W, {
        hint: 'Subtract, then check by adding.', steps: [m(c.b) + ' &minus; ' + m(c.p) + ' = ' + m(c.ch) + '.'], explain: m(c.ch) + '.', meta: { k: 'g3mn-sb-mc', b: c.b, p: c.p } });
    }],
    [2, 'tf', function (lv) {
      var c = subCase(lv), who = Q.name(), truth = coin(), f = subFix(c), bads = Object.keys(f).map(Number).filter(function (x) { return x > 0 && x !== c.ch / 100; }), said = truth ? c.ch : R.pick(bads) * 100;
      return tf(who + ' works out ' + m(c.b) + ' &minus; ' + m(c.p) + ' and gets <b>' + m(said) + '</b>. True or false: ' + who + ' is right.', said === c.ch, 'Check by adding: ' + m(c.p) + ' + ' + m(c.ch) + ' = ' + m(c.b) + '.',
        ['Subtract the smaller digit from the bigger one in each place.', 'Change is the price plus the bill.', 'The change is always less than $10.'], 'Check by adding: price + change should make ' + m(c.b) + '.', { hint: 'Add back to check.', meta: { k: 'g3mn-sb-tf', b: c.b, p: c.p, said: said } });
    }],
    [3, 'two', function (lv) {
      var b = R.pick([2000, 5000]), p1, p2;
      do { p1 = R.int(3, b / 200) * 100; p2 = R.int(3, b / 200) * 100; } while (p1 + p2 >= b);
      var t = p1 + p2, it = R.shuffle(BIG).slice(0, 2), f = {};
      f[(b - p1) / 100] = 'Add both prices first.'; f[t / 100] = 'That is the total. Now subtract it from ' + m(b) + '.';
      return num('You buy ' + an(it[0]) + ' for ' + m(p1) + ' and ' + an(it[1]) + ' for ' + m(p2) + '. You pay with a ' + m(b) + ' bill. How much change do you get?', (b - t) / 100, f, { unit: '$', fig: tags([[it[0], p1], [it[1], p2]]),
        hint: 'Two steps: add the prices, then subtract from ' + m(b) + '.', steps: [m(p1) + ' + ' + m(p2) + ' = ' + m(t) + '.', m(b) + ' &minus; ' + m(t) + ' = ' + m(b - t) + '.'], explain: m(b - t) + '.', meta: { k: 'g3mn-sb-num', b: b, ps: [p1, p2] } });
    }]
  ]);
  function tgSub(lv) {
    return function () {
      var c = subCase(lv), B = c.b / 100, P = c.p / 100, tens = Math.floor(P / 10) * 10, ones = P - tens, f1 = {};
      f1[B + tens] = 'Take away, do not add.';
      return { q: 'A ' + R.pick(BIG) + ' costs ' + m(c.p) + '. You pay ' + m(c.b) + '. Find the change.', fig: coins(make(c.b, [10000, 5000, 2000, 1000])), done: m(c.b) + ' &minus; ' + m(c.p) + ' = ' + m(c.ch) + '.', steps: tens ? [
        { prompt: 'Take away the tens first.', q: num(m(c.b) + ' &minus; ' + m(tens * 100) + ' = ?', B - tens, f1, { unit: '$', hint: 'Count back by 10s.', meta: { k: 'g3mn-sb-part', a: B, b: tens } }) },
        { prompt: 'Now take away the ones.', q: num(m((B - tens) * 100) + ' &minus; ' + m(ones * 100) + ' = ?', B - P, {}, { unit: '$', hint: 'Count back ' + ones + '.', meta: { k: 'g3mn-sb-part', a: B - tens, b: ones } }) },
        { prompt: 'Check by adding.', q: num(m(c.p) + ' + ' + m(c.ch) + ' = ?', B, {}, { unit: '$', hint: 'It should make what you paid.', meta: { k: 'g3mn-sb-check', a: P, b: B - P } }) }
      ] : [
        { prompt: 'Subtract.', q: num(m(c.b) + ' &minus; ' + m(c.p) + ' = ?', B - P, subFix(c), { unit: '$', hint: 'Count back from ' + m(c.b) + '.', meta: { k: 'g3mn-sb-part', a: B, b: P } }) },
        { prompt: 'Check by adding.', q: num(m(c.p) + ' + ' + m(c.ch) + ' = ?', B, {}, { unit: '$', hint: 'It should make what you paid.', meta: { k: 'g3mn-sb-check', a: P, b: B - P } }) }
      ] };
    };
  }

  /* ======================= Lesson 4: Estimate and choose ======================= */
  /* ---------- Estimate the change ---------- */
  function near10(c) { return Math.round(c / 10) * 10; }
  function estCase(lv) { var p; do { p = R.int(lv === 1 ? 11 : 21, 89); } while (p % 10 === 0 || p % 10 === 5); return p; }
  skill('mn-est', 'Estimate the change', 'F1.1', [
    [1, 'plain', function (lv) {
      var p = estCase(lv), it = R.pick(SMALL), e = 100 - near10(p), f = {};
      f[100 - p] = 'That is the exact change. Round the price first.'; f[near10(p)] = 'That is the rounded price. Now find the change.';
      return num(cap(an(it)) + ' costs ' + m(p) + '. Round the price to the nearest 10¢. About how much change from $1?', e, f, { unit: '¢', fig: tags([[it, p]]),
        hint: m(p) + ' is close to which 10?', steps: [m(p) + ' is about ' + m(near10(p)) + '.', '100 &minus; ' + near10(p) + ' = ' + e + '.'], explain: 'About ' + m(e) + '.', meta: { k: 'g3mn-es-num', p: p } });
    }],
    [1, 'fill', function (lv) {
      var p = estCase(lv), it = R.pick(SMALL);
      return fill(cap(an(it)) + ' costs ' + m(p) + '. You pay $1. Estimate.', m(p) + ' is about [[]]¢.<br>The change is about [[]]¢.', [near10(p), 100 - near10(p)], { fig: tags([[it, p]]),
        hint: 'Round to the nearest 10¢, then count up to $1.', steps: [m(p) + ' is about ' + m(near10(p)) + '.', 'About ' + m(100 - near10(p)) + ' change.'], explain: 'About ' + m(100 - near10(p)) + '.', meta: { k: 'g3mn-es-fill', p: p } });
    }],
    [1, 'mc', function (lv) {
      var p = estCase(lv), e = 100 - near10(p), W = [];
      [e + 10, e - 10, near10(p), e + 20].forEach(function (x) { if (x > 0 && x < 100 && x !== e) W.push(['about ' + m(x), x === near10(p) ? 'That is about the price. Find the change.' : 'Round ' + m(p) + ' to the nearest 10 first.']); });
      return mc(cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. You pay $1. About how much change should you get?', 'about ' + m(e), W, {
        hint: 'Round the price to the nearest 10¢.', steps: [m(p) + ' is about ' + m(near10(p)) + '.', 'About ' + m(e) + '.'], explain: 'About ' + m(e) + ' (exactly ' + m(100 - p) + ').', meta: { k: 'g3mn-es-mc', p: p } });
    }],
    [2, 'tf', function (lv) {
      var p = estCase(lv), who = Q.name(), truth = coin(), wrong = (10 - Math.floor(p / 10)) * 10 + p % 10, got = truth ? 100 - p : wrong;
      if (!truth && Math.abs(got - (100 - near10(p))) < 15) got = 100 - p + 30 < 100 ? 100 - p + 30 : 100 - p - 30;
      return tf(cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. ' + who + ' pays $1 and gets <b>' + m(got) + '</b> back. True or false: that change makes sense.', truth, 'The change should be about ' + m(100 - near10(p)) + '. Exactly ' + m(100 - p) + '.',
        ['Any change from $1 makes sense.', 'Change is always more than the price.', 'You cannot check change without paper.'], 'Estimate first: round ' + m(p) + ' to the nearest 10¢.', { fig: tags([['price', p]]), hint: 'Estimate, then compare.', meta: { k: 'g3mn-es-tf', p: p, got: got } });
    }],
    [2, 'line', function (lv) {
      var p = estCase(lv);
      return { q: cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. You pay $1. Put the marker on your <b>estimate</b> of the change (to the nearest 10¢).', type: 'line', min: 0, max: 100, tick: 10, every: 20, snap: 10, answer: 100 - near10(p), hideValue: true, label: function (v) { return v + '¢'; },
        hint: 'Round the price to the nearest 10¢ first.', steps: [m(p) + ' is about ' + m(near10(p)) + '.', 'About ' + m(100 - near10(p)) + ' change.'], explain: 'About ' + m(100 - near10(p)) + '.', meta: { k: 'g3mn-es-line', p: p } };
    }],
    [3, 'dollars', function (lv) {
      var a, b, bill = R.pick([5000, 10000]);
      do { a = R.int(11, 49); b = R.int(11, 49); } while (a % 10 === 5 || b % 10 === 5 || a % 10 === 0 || b % 10 === 0 || near10(a) + near10(b) >= bill / 100);
      var e = bill / 100 - near10(a) - near10(b), f = {};
      f[bill / 100 - a - b] = 'That is the exact change. Round each price first.';
      return num('A ' + R.pick(BIG) + ' costs ' + m(a * 100) + ' and a ' + R.pick(BIG) + ' costs ' + m(b * 100) + '. Round each price to the nearest $10. About how much change from ' + m(bill) + '?', e, f, { unit: '$',
        hint: 'Round each price. Add. Then subtract from ' + m(bill) + '.', steps: [m(a * 100) + ' is about ' + m(near10(a) * 100) + '. ' + m(b * 100) + ' is about ' + m(near10(b) * 100) + '.', m(bill) + ' &minus; ' + m((near10(a) + near10(b)) * 100) + ' = ' + m(e * 100) + '.'], explain: 'About ' + m(e * 100) + '.', meta: { k: 'g3mn-es-dol', a: a, b: b, bill: bill / 100 } });
    }]
  ]);
  function tgEst(lv) {
    return function () {
      var p = estCase(lv), e = 100 - near10(p), f1 = {}, f2 = {};
      f1[p - p % 10] = 'Is ' + m(p) + ' closer to ' + m(p - p % 10) + ' or ' + m(p - p % 10 + 10) + '?'; f1[p - p % 10 + 10] = f1[p - p % 10];
      f2[100 - p] = 'That is exact. Use the rounded price.';
      return { q: cap(an(R.pick(SMALL))) + ' costs ' + m(p) + '. You pay $1. About how much change?', fig: tags([['price', p]]), done: 'About ' + m(e) + '. Exactly ' + m(100 - p) + ': close.', steps: [
        { prompt: 'Round the price to the nearest 10¢.', q: num(m(p) + ' is about how many cents?', near10(p), f1, { unit: '¢', hint: 'Look at the ones digit.', meta: { k: 'g3mn-es-near', p: p } }) },
        { prompt: 'Count up from the rounded price.', q: num('About how much change from $1?', e, f2, { unit: '¢', hint: '100 &minus; ' + near10(p) + '.', meta: { k: 'g3mn-es-num', p: p } }) },
        { prompt: 'Now check against the exact change.', q: num('Exact change: 100 &minus; ' + p + ' = ?', 100 - p, {}, { unit: '¢', hint: 'Count up from ' + m(p) + '.', meta: { k: 'g3mn-up-num', p: p, paid: 100 } }) }
      ] };
    };
  }

  /* ---------- Total, change or how much more? (look-alikes mixed) ---------- */
  var ASK = ['the total', 'the change', 'how much more'];
  function mixCase(lv, kind) {
    var who = Q.name(), dol = lv === 3 ? coin() : lv === 2, k = kind || R.pick(['total', 'change', 'more']), it = R.shuffle(dol ? BIG : SMALL).slice(0, 2), a, b, have, q, ans;
    for (;;) {
      a = dol ? R.int(2, 19) * 100 : R.int(2, 9) * 5; b = dol ? R.int(2, 19) * 100 : R.int(2, 9) * 5;
      have = dol ? R.pick([1000, 2000, 5000]) : 100;
      if (k === 'total' && (dol || a + b < 100)) { ans = a + b; break; }
      if (k === 'change' && a < have) { ans = have - a; break; }
      if (k === 'more' && a > b) { ans = a - b; break; }
    }
    if (k === 'total') q = who + ' buys ' + an(it[0]) + ' for ' + m(a) + ' and ' + an(it[1]) + ' for ' + m(b) + '. How much does ' + who + ' spend?';
    else if (k === 'change') q = who + ' buys ' + an(it[0]) + ' for ' + m(a) + ' and pays with ' + (have === 100 ? 'a loonie' : 'a ' + m(have) + ' bill') + '. How much change does ' + who + ' get?';
    else q = who + ' has ' + m(b) + '. ' + cap(an(it[0])) + ' costs ' + m(a) + '. How much more money does ' + who + ' need?';
    return { k: k, a: a, b: b, have: have, q: q, ans: ans, dol: dol };
  }
  function mixFix(c) {
    var f = {}, d = c.dol ? 100 : 1;
    if (c.k === 'total') f[Math.abs(c.a - c.b) / d] = 'Spending on both: add the prices.';
    if (c.k === 'change') { f[(c.have + c.a) / d] = 'Change is what you get back: take the price from what you paid.'; f[c.a / d] = 'That is the price.'; }
    if (c.k === 'more') { f[(c.a + c.b) / d] = '"How much more" means the gap: take away.'; f[c.a / d] = 'That is the price. Find the gap.'; }
    return f;
  }
  function mixSteps(c) { return c.k === 'total' ? [m(c.a) + ' + ' + m(c.b) + ' = ' + m(c.ans) + '.'] : c.k === 'change' ? [m(c.have) + ' &minus; ' + m(c.a) + ' = ' + m(c.ans) + '.'] : [m(c.a) + ' &minus; ' + m(c.b) + ' = ' + m(c.ans) + '.']; }
  function whichQ(c, x) {
    var right = { total: 0, change: 1, more: 2 }[c.k], o = R.shuffle([0, 1, 2]), w = {};
    [0, 1, 2].forEach(function (i) { if (i !== right) w[ASK[i]] = ['Read the question again: "spend" means add both prices.', 'Read the question again: change is money you get back.', 'Read the question again: "how much more" is the gap to the price.'][right]; });
    return put({ q: c.q + ' <b>What do you need to find?</b>', type: 'mc', options: o.map(function (i) { return ASK[i]; }), answer: o.indexOf(right), wrong: w }, x);
  }
  skill('mn-mix', 'Total, change or how much more?', 'F1.1', [
    [1, 'plain', function (lv) {
      var c = mixCase(lv);
      return num(c.q, c.dol ? c.ans / 100 : c.ans, mixFix(c), { unit: c.dol ? '$' : '¢',
        hint: 'Total: add. Change: paid minus price. More: price minus what you have.', steps: mixSteps(c), explain: m(c.ans) + '.', meta: { k: 'g3mn-mx-num', kind: c.k, a: c.a, b: c.b, have: c.have, dol: c.dol } });
    }],
    [1, 'which', function (lv) {
      var c = mixCase(lv);
      return whichQ(c, { hint: 'Spend, get back, or need more?', steps: ['This asks for ' + ASK[{ total: 0, change: 1, more: 2 }[c.k]] + '.'], explain: cap(ASK[{ total: 0, change: 1, more: 2 }[c.k]]) + '.', meta: { k: 'g3mn-mx-which', kind: c.k } });
    }],
    [1, 'more', function (lv) {
      var c = mixCase(lv, 'more');
      return num(c.q, c.dol ? c.ans / 100 : c.ans, mixFix(c), { unit: c.dol ? '$' : '¢', fig: c.dol ? '' : coins(make(c.b, CENTS)),
        hint: 'Count up from what you have to the price.', steps: mixSteps(c), explain: m(c.ans) + ' more.', meta: { k: 'g3mn-mx-num', kind: 'more', a: c.a, b: c.b, have: c.have, dol: c.dol } });
    }],
    [2, 'enough', function (lv) {
      var have = R.pick([500, 1000, 2000]), a = R.int(1, have / 100 - 1) * 100, b = R.int(1, have / 100 - 1) * 100, who = Q.name(), ok = a + b <= have;
      return tf(who + ' has ' + m(have) + '. True or false: that is enough to buy things that cost <b>' + m(a) + '</b> and <b>' + m(b) + '</b>.', ok, m(a) + ' + ' + m(b) + ' = ' + m(a + b) + (ok ? ', not more than ' : ', more than ') + m(have) + '.',
        ['You only need to look at the bigger price.', 'Two things always cost too much.', 'Each price is less, so it is always enough.'], 'Add the prices, then compare with ' + m(have) + '.', { fig: coins(make(have, [2000, 1000, 500])), hint: 'Add first.', meta: { k: 'g3mn-mx-enough', have: have, a: a, b: b } });
    }],
    [2, 'story', function (lv) {
      var c = mixCase(lv === 2 ? 3 : lv);
      return num(c.q, c.dol ? c.ans / 100 : c.ans, mixFix(c), { unit: c.dol ? '$' : '¢',
        hint: 'Decide first: total, change, or how much more?', steps: ['It asks for ' + ASK[{ total: 0, change: 1, more: 2 }[c.k]] + '.'].concat(mixSteps(c)), explain: m(c.ans) + '.', meta: { k: 'g3mn-mx-num', kind: c.k, a: c.a, b: c.b, have: c.have, dol: c.dol } });
    }],
    [3, 'two', function (lv) {
      var a, b, have = R.pick([1000, 2000]);
      do { a = R.int(2, 9) * 100; b = R.int(2, 9) * 100; } while (a + b === have);
      var who = Q.name(), t = a + b, it = R.shuffle(BIG).slice(0, 2), ans, f = {};
      if (t < have) { ans = (have - t) / 100; f[t / 100] = 'That is the total. Now find the change.'; }
      else { ans = (t - have) / 100; f[t / 100] = 'That is the total. Find how much more than ' + m(have) + '.'; }
      return num(who + ' has ' + m(have) + ' and wants ' + an(it[0]) + ' for ' + m(a) + ' and ' + an(it[1]) + ' for ' + m(b) + '. ' + (t < have ? 'How much change will ' + who + ' get?' : 'How much more money does ' + who + ' need?'), ans, f, { unit: '$', fig: tags([[it[0], a], [it[1], b]]),
        hint: 'Find the total first.', steps: [m(a) + ' + ' + m(b) + ' = ' + m(t) + '.', t < have ? m(have) + ' &minus; ' + m(t) + ' = ' + m(have - t) + '.' : m(t) + ' &minus; ' + m(have) + ' = ' + m(t - have) + '.'], explain: m(ans * 100) + '.', meta: { k: 'g3mn-mx-two', a: a, b: b, have: have } });
    }]
  ]);
  function tgMix(kind) {
    return function () {
      var c = mixCase(2, kind === 'any' ? null : kind), add = c.k === 'total', o = ['Add', 'Subtract'], w = {};
      w[o[add ? 1 : 0]] = add ? 'Spending on both: put them together.' : c.k === 'change' ? 'Change: take the price away from what you paid.' : 'How much more: the gap between what you have and the price.';
      return { q: c.q, done: m(c.ans) + '.', steps: [
        { prompt: 'Read the question. What does it ask?', q: whichQ(c, { hint: 'Spend, get back, or need more?', meta: { k: 'g3mn-mx-which', kind: c.k } }) },
        { prompt: add ? 'A total puts amounts together.' : 'This one finds a difference.', q: put({ q: 'Add or subtract?', type: 'mc', options: o, answer: add ? 0 : 1, wrong: w }, { hint: 'Together, or the gap?', meta: { k: 'g3mn-mx-op', kind: c.k } }) },
        { prompt: 'Now work it out.', q: num(mixSteps(c)[0].replace(/ = .*$/, ' = ?'), c.dol ? c.ans / 100 : c.ans, mixFix(c), { unit: c.dol ? '$' : '¢', hint: 'Count up or count back.', meta: { k: 'g3mn-mx-num', kind: c.k, a: c.a, b: c.b, have: c.have, dol: c.dol } }) }
      ] };
    };
  }

  /* ======================= Watch and My turn pictures ======================= */
  var coinsV = function (s) { return coins(s.l, null, 420, s.lit); };
  var roundV = function (s) { return roundLine(s.t, s.show); };
  var upV = function (s) { return countUp(s.p, s.paid, s.k); };
  var tagsV = function (s) { return tags(s.items, s.total); };
  var changeV = function (s) { return countUp(s.p, 100, s.k) + coins(make(100 - s.p, CENTS).slice(0, s.n == null ? 9 : s.n), 'Change coins'); };
  function lits(n) { var out = []; for (var i = 1; i <= n; i++) out.push({ lit: i }); return out; }
  function hopsTo(n) { var out = []; for (var i = 1; i <= n; i++) out.push({ k: i }); return out; }

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'cash', title: 'Coins and cash', sub: 'Count money, and round cash totals.', concepts: [
      { id: 'count', title: 'Count coins, biggest first', exp: ['F1.1'], skill: 'mn-count',
        watch: clip(coinsV, { l: [10, 25, 5, 25, 10], lit: 0 }, [
          ['Two quarters, two dimes, a nickel.'],
          ['Quarters by 25s: 25, 50.', lits(2)],
          ['Dimes by 10s: 60, 70. The nickel: 75.', lits(5).slice(2), 2200],
          ['5 coins, worth 75¢.', { sym: '25 + 25 + 10 + 10 + 5 = 75¢' }]
        ]),
        example: clip(coinsV, { l: [5, 10, 25, 10, 25, 25], lit: 0 }, [
          ['My turn. I sort: quarters first.'],
          ['25, 50, 75.', lits(3)],
          ['Then 85, 95, 100. That is $1. Not 6¢: each coin has its own value.', lits(6).slice(3), 2400],
          ['3 &times; 25¢ + 2 &times; 10¢ + 5¢ = $1.', { sym: '75 + 20 + 5 = 100¢' }]
        ]),
        try: { tool: 'coins', opts: { set: [5, 10, 25, 100, 200] }, tasks: [
          { do: 'Make <b>85¢</b>.', goal: function (s) { return s.total === 85; }, yes: '85¢.' },
          { do: 'Make <b>$3</b> with exactly 2 coins.', goal: function (s) { return s.total === 300 && s.n === 2; }, yes: 'A toonie and a loonie.' }
        ] },
        together: [tgCount(1), tgCount(2), tgCount(3)],
        mistake: '<p>Counting the coins instead of their values (5 coins: "5¢"), or thinking the dime is worth less because it is small. Sort first, then count by each coin\'s value.</p>',
        check: [ck('mn-count', 'plain', 1), ck('mn-count', 'times', 1), ck('mn-count', 'story', 2), ck('mn-count', 'tf', 2), ck('mn-count', 'plain', 3)] },

      { id: 'round', title: 'Cash totals round to 5¢', exp: ['F1.1'], skill: 'mn-round',
        watch: clip(roundV, { t: 43, show: false }, [
          ['Canada has no pennies. The total is 43¢.'],
          ['45¢ is 2 steps away. 40¢ is 3. Pay 45¢.', { show: true, sym: '43¢ &rarr; 45¢' }],
          ['47¢ is closer to 45¢.', { t: 47, show: true, sym: '47¢ &rarr; 45¢' }],
          ['48¢ is closer to 50¢.', { t: 48, show: true, sym: '48¢ &rarr; 50¢' }]
        ]),
        example: clip(roundV, { t: 61, show: false }, [
          ['My turn. The total is 61¢.'],
          ['61 is 1 step from 60, 4 from 65. I pay 60¢.', { show: true, sym: '61¢ &rarr; 60¢' }],
          ['Not 70¢: I round to the nearest 5, not 10.', { t: 64, show: true, sym: '64¢ &rarr; 65¢' }],
          ['By card I pay the exact total. Only cash rounds.', { sym: 'card 64¢, cash 65¢' }]
        ]),
        try: { mount: G3.play({ state: { t: 72 }, draw: function (s) { return roundLine(s.t, true); },
          sliders: [{ key: 't', label: 'Total', min: 1, max: 99, fmt: function (v) { return v + '¢'; } }],
          info: function (s) { return 'Cash total: <b>' + m(cash(s.t)) + '</b>'; },
          tasks: [{ do: 'Find a total that rounds <b>up</b> to 50¢.', goal: function (s) { return cash(s.t) === 50 && s.t < 50; }, yes: function (s) { return m(s.t) + ' rounds up to 50¢.'; } },
            { do: 'Find a total that rounds <b>down</b> to 85¢.', goal: function (s) { return cash(s.t) === 85 && s.t > 85; }, yes: function (s) { return m(s.t) + ' rounds down to 85¢.'; } }] }), do: '' },
        together: [tgRound(1), tgRound(2), tgRound(3)],
        mistake: '<p>Rounding to the nearest 10¢ (47¢ to 50¢), or rounding prices instead of the total. Only the cash total rounds: add first, then round to the nearest 5¢. Card payments are never rounded.</p>',
        check: [ck('mn-round', 'plain', 1), ck('mn-round', 'up', 1), ck('mn-round', 'card', 2), ck('mn-round', 'tf', 2), ck('mn-round', 'sum', 3)] }
    ] },

    { id: 'dollar', title: 'Change from a dollar', sub: 'Count up from the price to $1.', concepts: [
      { id: 'countup', title: 'Count up to make change', exp: ['F1.1'], skill: 'mn-up',
        watch: clip(upV, { p: 65, paid: 100, k: 0 }, [
          ['A juice box costs 65¢. You pay $1.'],
          ['A dime: 75¢.', { k: 1 }],
          ['A quarter: $1.', { k: 2 }],
          ['10¢ + 25¢ = 35¢ change.', { sym: '65¢ + 35¢ = $1' }]
        ]),
        example: clip(upV, { p: 40, paid: 100, k: 0 }, [
          ['My turn. 40¢, and I pay $1.'],
          ['I jump to 50¢ with a dime, then a quarter to 75¢, and another to $1.', hopsTo(3), 2400],
          ['10 + 25 + 25 = 60¢. Not 40¢: that is the price.', { sym: '40¢ + 60¢ = $1' }]
        ]),
        try: { mount: G3.play({ state: { p: 80, k: 0 }, draw: function (s) { return changeV({ p: s.p, k: s.k, n: s.k }); },
          sliders: [{ key: 'p', label: 'Price', min: 5, max: 95, step: 5, fmt: function (v) { return v + '¢'; } }],
          buttons: [{ label: 'Next coin', act: function (s) { if (s.k < make(100 - s.p, CENTS).length) s.k++; } }, { label: 'Start over', act: function (s) { s.k = 0; } }],
          info: function (s) { return s.k === make(100 - s.p, CENTS).length ? 'Change: <b>' + m(100 - s.p) + '</b>' : ''; },
          tasks: [{ do: 'A pencil costs <b>80¢</b>. Count up the change.', goal: function (s) { return s.p === 80 && s.k === make(20, CENTS).length; }, yes: '2 dimes: 20¢.' },
            { do: 'Pick a price that needs exactly <b>3 coins</b> of change.', goal: function (s) { return make(100 - s.p, CENTS).length === 3 && s.k === 3; }, yes: function (s) { return m(s.p) + ': ' + m(100 - s.p) + ' change.'; } }] }), do: '' },
        together: [tgUp(1), tgUp(2), tgUp(3)],
        mistake: '<p>Subtracting digit by digit (100 &minus; 65 = 45), or giving the price as the change. Count up out loud with real coins: "65, 75, one dollar."</p>',
        check: [ck('mn-up', 'plain', 1), ck('mn-up', 'hops', 1), ck('mn-up', 'story', 2), ck('mn-up', 'tf', 2), ck('mn-up', 'pay', 3)] },

      { id: 'two', title: 'Add the prices, then find the change', exp: ['F1.1'], skill: 'mn-two',
        watch: clip(tagsV, { items: [['apple', 35], ['sticker', 28]] }, [
          ['An apple and a sticker.'],
          ['Add: 35 + 28 = 63¢.', { total: 'Total: 63¢' }],
          ['Cash rounds 63¢ to 65¢.', { total: 'Total: 63¢. Cash: 65¢' }],
          ['Count up to $1: 35¢ change.', { sym: '65¢ + 35¢ = $1' }]
        ]),
        example: clip(tagsV, { items: [['muffin', 42], ['juice box', 39]] }, [
          ['My turn. 42 + 39 = 81¢.', { total: 'Total: 81¢' }],
          ['81 is closer to 80. I pay 80¢.', { total: 'Total: 81¢. Cash: 80¢' }],
          ['Change: 20¢. Not 19¢: I use the cash total.', { sym: '80¢ + 20¢ = $1' }]
        ]),
        together: [tgTwo(1), tgTwo(2), tgTwo(3)],
        mistake: '<p>Finding the change from the exact total (19¢ instead of 20¢), or forgetting one of the items. Write the three steps: add, round, count up.</p>',
        check: [ck('mn-two', 'total', 1), ck('mn-two', 'plain', 1), ck('mn-two', 'fill', 2), ck('mn-two', 'mc', 2), ck('mn-two', 'receipt', 3)] },

      { id: 'give', title: 'Give change with the fewest coins', exp: ['F1.1'], skill: 'mn-give',
        watch: clip(changeV, { p: 15, k: 3, n: 0 }, [
          ['The change is 85¢.'],
          ['Quarters while they fit: 25, 50, 75.', [{ n: 1 }, { n: 2 }, { n: 3 }]],
          ['Then a dime: 85¢. 4 coins.', { n: 4, sym: '3 quarters and 1 dime' }]
        ]),
        example: clip(changeV, { p: 55, k: 2, n: 0 }, [
          ['My turn. The change is 45¢.'],
          ['A quarter first: 25¢.', { n: 1 }],
          ['Then 2 dimes: 45¢. Not 9 nickels: that is too many coins.', { n: 3, sym: '1 quarter and 2 dimes' }]
        ]),
        try: { tool: 'coins', opts: { set: [5, 10, 25] }, tasks: [
          { do: 'A juice box costs <b>65¢</b>. Give the change from $1.', goal: function (s) { return s.total === 35; }, yes: function (s) { return s.n === 2 ? '35¢ in 2 coins: the fewest.' : '35¢. Can you do it in 2 coins?'; } },
          { do: 'Give <b>70¢</b> with the fewest coins.', goal: function (s) { return s.total === 70 && s.n === 4; }, yes: '2 quarters and 2 dimes.' }
        ] },
        together: [tgGive(1), tgGive(2), tgGive(3)],
        mistake: '<p>Giving the right amount in many small coins, or using too many dimes when a quarter fits. Ask: "Does a quarter fit? Another one?"</p>',
        check: [ck('mn-give', 'plain', 1), ck('mn-give', 'count', 1), ck('mn-give', 'mc', 2), ck('mn-give', 'tf', 2), ck('mn-give', 'back', 3)] }
    ] },

    { id: 'bills', title: 'Change from a bill', sub: 'Whole-dollar prices.', concepts: [
      { id: 'bill', title: 'Count up to the bill', exp: ['F1.1'], skill: 'mn-bill',
        watch: clip(upV, { p: 1300, paid: 2000, k: 0 }, [
          ['A book costs $13. You pay $20.'],
          ['A toonie: $15.', { k: 1 }],
          ['A $5 bill: $20.', { k: 2 }],
          ['$2 + $5 = $7 change.', { sym: '$13 + $7 = $20' }]
        ]),
        example: clip(upV, { p: 600, paid: 1000, k: 0 }, [
          ['My turn. A kite is $6. I pay $10.'],
          ['I count up: $8, then $10.', hopsTo(2)],
          ['2 toonies: $4. Not $16: change is less than I paid.', { sym: '$6 + $4 = $10' }]
        ]),
        try: { mount: G3.play({ state: { p: 1200, b: 2000, k: 0 }, draw: function (s) { return countUp(s.p, s.b, s.k); },
          sliders: [{ key: 'p', label: 'Price', min: 100, max: 1900, step: 100, fmt: function (v) { return m(v); } }],
          buttons: [{ label: 'Next jump', act: function (s) { if (s.k < make(s.b - s.p, DOLLARS).length) s.k++; } }, { label: 'Start over', act: function (s) { s.k = 0; } }],
          info: function (s) { return s.k === make(s.b - s.p, DOLLARS).length ? 'Change: <b>' + m(s.b - s.p) + '</b>' : 'Count up to $20.'; },
          tasks: [{ do: 'A puzzle costs <b>$12</b>. Count up to $20.', goal: function (s) { return s.p === 1200 && s.k === make(800, DOLLARS).length; }, yes: '$8 change.' }] }), do: '' },
        together: [tgBill(1), tgBill(2), tgBill(3)],
        mistake: '<p>Adding the price and the bill ($6 + $10 = $16), or counting the starting number as a jump. Ask: "Can the change be more than you paid?"</p>',
        check: [ck('mn-bill', 'plain', 1), ck('mn-bill', 'hops', 1), ck('mn-bill', 'story', 2), ck('mn-bill', 'coins', 2), ck('mn-bill', 'plain', 3)] },

      { id: 'subtract', title: 'Subtract to find the change', exp: ['F1.1'], skill: 'mn-sub',
        watch: clip(coinsV, { l: [2000] }, [
          ['$20 for a $13 game.'],
          ['Take away the ten: $20 &minus; $10 = $10.', { sym: '20 &minus; 10 = 10' }],
          ['Take away 3 more: $7.', { sym: '10 &minus; 3 = 7' }],
          ['Check: $13 + $7 = $20.', { sym: '13 + 7 = 20' }]
        ]),
        example: clip(coinsV, { l: [5000] }, [
          ['My turn. $50 for a $27 jacket.'],
          ['$50 &minus; $20 = $30. Then $30 &minus; $7 = $23.', { sym: '50 &minus; 27 = 23' }],
          ['Not $37: 0 take away 7 needs a regroup.', { sym: '27 + 23 = 50' }]
        ]),
        together: [tgSub(1), tgSub(2), tgSub(3)],
        mistake: '<p>Subtracting the smaller digit from the bigger in each place ($50 &minus; $27 = $37). Take away the tens, then the ones, and always check by adding.</p>',
        check: [ck('mn-sub', 'plain', 1), ck('mn-sub', 'story', 1), ck('mn-sub', 'fill', 2), ck('mn-sub', 'tf', 2), ck('mn-sub', 'two', 3)] }
    ] },

    { id: 'estimate', title: 'Estimate and choose', sub: 'About how much? Which question is it?', concepts: [
      { id: 'est', title: 'Estimate the change', exp: ['F1.1'], skill: 'mn-est',
        watch: clip(roundV, { t: 68, show: false }, [
          ['A pencil costs 68¢. About how much change from $1?'],
          ['68 is about 70.', { sym: '68¢ &asymp; 70¢' }],
          ['70 to 100 is 30. About 30¢ change.', { sym: 'about 30¢' }],
          ['Exactly 32¢: close to 30¢. It makes sense.', { sym: 'exact 32¢' }]
        ]),
        example: clip(roundV, { t: 23, show: false }, [
          ['My turn. An eraser costs 23¢.'],
          ['23 is about 20. So about 80¢ back.', { sym: 'about 80¢' }],
          ['If I get 57¢, that is far from 80¢. Not right: I check again.', { sym: 'exact 77¢' }]
        ]),
        together: [tgEst(1), tgEst(2), tgEst(3)],
        mistake: '<p>Giving the exact change when asked for an estimate, or not noticing a change far from the estimate. Ask: "About how much should it be? Is this close?"</p>',
        check: [ck('mn-est', 'plain', 1), ck('mn-est', 'mc', 1), ck('mn-est', 'fill', 2), ck('mn-est', 'tf', 2), ck('mn-est', 'dollars', 3)] },

      { id: 'mix', title: 'Total, change or how much more?', exp: ['F1.1'], skill: 'mn-mix',
        watch: clip(tagsV, { items: [['book', 800], ['kite', 600]] }, [
          ['"How much do both cost?" Add: $14.', { sym: 'total: $8 + $6 = $14' }],
          ['"You pay $10 for the book. Change?" Take away: $2.', { sym: 'change: $10 &minus; $8 = $2' }],
          ['"You have $6. How much more for the book?" The gap: $2.', { sym: 'more: $8 &minus; $6 = $2' }]
        ]),
        example: clip(tagsV, { items: [['muffin', 45]] }, [
          ['My turn. "Ali has 30¢. How much more for the muffin?"'],
          ['That is the gap, so I subtract: 45 &minus; 30 = 15.', { sym: '15¢ more' }],
          ['Not 75¢: I add only to find a total.', { sym: 'gap, not total' }]
        ]),
        together: [tgMix('total'), tgMix('more'), tgMix('any')],
        mistake: '<p>Adding every pair of numbers, even for "how much more" or change. Before working it out, ask: "Are we putting money together, or finding a gap?"</p>',
        check: [ck('mn-mix', 'which', 1), ck('mn-mix', 'plain', 1), ck('mn-mix', 'more', 2), ck('mn-mix', 'enough', 2), ck('mn-mix', 'two', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      { q: 'How much money is this?', type: 'num', answer: 65, unit: '¢', fig: coins([25, 25, 10, 5]), hint: 'Biggest first.', explain: '25, 50, 60, 65.', meta: { k: 'g3mn-ct-pic', dol: false } },
      { q: 'The total is 48¢. You pay with cash. How much do you pay?', type: 'num', answer: 50, unit: '¢', hint: 'Nearest 5¢.', explain: '48¢ is closer to 50¢.', meta: { k: 'g3mn-rd-num', t: 48 } },
      { q: 'A juice box costs 70¢. You pay with a loonie. How much change do you get?', type: 'num', answer: 30, unit: '¢', hint: 'Count up to $1.', explain: '70, 80, 90, 100: 30¢.', meta: { k: 'g3mn-up-num', p: 70, paid: 100 } },
      { q: 'You buy an apple for 35¢ and a sticker for 28¢. You pay cash with a loonie. How much change do you get?', type: 'num', answer: 35, unit: '¢', hint: 'Add, round, count up.', explain: '63¢, cash 65¢, change 35¢.', meta: { k: 'g3mn-two-chg', ps: [35, 28] } },
      { q: 'A book costs $13. You pay with a $20 bill. How much change do you get?', type: 'num', answer: 7, unit: '$', hint: 'Count up to $20.', explain: '$13 + $7 = $20.', meta: { k: 'g3mn-bl-num', p: 1300, b: 2000 } },
      { q: '<span class="math">$50 &minus; $27 = ?</span>', type: 'num', answer: 23, unit: '$', hint: 'Tens, then ones.', explain: '$23.', meta: { k: 'g3mn-sb-num', b: 5000, ps: [2700] } },
      { q: 'A pencil costs 68¢. Round the price to the nearest 10¢. About how much change from $1?', type: 'num', answer: 30, unit: '¢', hint: '68 is about 70.', explain: 'About 30¢.', meta: { k: 'g3mn-es-num', p: 68 } }
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
