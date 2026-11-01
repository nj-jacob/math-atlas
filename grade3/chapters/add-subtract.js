/* Grade 3 Adding and Subtracting: a full chapter (docs/QUESTIONS.md, "Full chapters"). 6 lessons, 16 ideas, one practice skill per idea.
   Ontario 2020: B2.3 mental math and estimation to 1000 (with the facts to 20 it builds on), B2.4 the written methods connected to blocks,
   B2.5 problems with addition and subtraction to 1000, C2.3 equal sides (equivalent relationships to 1000).
   Most questions are typed answers. Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3as-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'add-subtract';

  /* ---------- words and numbers ---------- */
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = String(h); return e.textContent.replace(/\s+/g, ' ').trim(); }
  function coin() { return Math.random() < 0.5; }
  function math(t) { return '<span class="math">' + t + '</span>'; }
  function sg(op) { return op === '+' ? '+' : '&minus;'; }
  function ex(a, op, b) { return a + ' ' + sg(op) + ' ' + b; }
  function calc(a, op, b) { return op === '+' ? a + b : a - b; }
  function dig(n) { return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000) % 10]; }
  function placeN(k, p) { return k + ' ' + (k === 1 ? A.PLACE1[p] : A.PLACES[p]); }
  function roundTo(n, p) { return Math.floor(n / p) * p + (n % p >= p / 2 ? p : 0); }
  function sum(list) { return list.reduce(function (x, y) { return x + y; }, 0); }
  var PNAME = ['ones', 'tens', 'hundreds', 'thousands'];

  /* ---------- question builders ---------- */
  /* pick one: the right answer and up to 3 wrong ones; wrongs = [[html, fix], ...]. q.wrong holds the fixes (Atlas.Q.diag). */
  function mc(q, right, wrongs, x) {
    right = String(right);
    var seen = {}, opts = [right], fix = {};
    seen[plain(right)] = 1;
    wrongs.forEach(function (w) {
      if (!Array.isArray(w)) w = [w];
      var h = String(w[0]), t = plain(h);
      if (opts.length >= 4 || seen[t]) return;
      seen[t] = 1; opts.push(h); if (w[1]) fix[t] = w[1];
    });
    var o = R.shuffle(opts);
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(right), wrong: fix }, x || {});
  }
  function fixed(q, opts, ans, fixes, x) { var w = {}; opts.forEach(function (o, j) { if (j !== ans && fixes[j]) w[plain(o)] = fixes[j]; }); return put({ q: q, type: 'mc', options: opts, answer: ans, wrong: w }, x || {}); }
  function num(q, ans, fixes, x) { var w = {}; Object.keys(fixes || {}).forEach(function (k) { if (+k !== ans && fixes[k]) w[k] = fixes[k]; }); return put({ q: q, type: 'num', answer: ans, wrong: w }, x || {}); }
  function fill(q, text, answers, x) { return put({ q: q, type: 'fill', fill: text, answers: answers }, x || {}); }
  function tf(q, truth, right, bad, fix, x) {
    var o = R.mc(right, bad), w = {};
    w[truth ? 'False' : 'True'] = fix;
    return put({ q: q, type: 'tf', answer: truth, why: { options: o.options, answer: o.answer }, wrong: w, steps: [right], explain: right }, x || {});
  }
  /* a typed calculation: a op b */
  function calcQ(q, a, op, b, fixes, x) { return num(q, calc(a, op, b), fixes, put({ meta: { k: 'g3as-calc', a: a, op: op, b: b } }, x || {})); }
  /* several bare calculations in one card: list = [[a, op, b], ...] */
  function rowQ(q, list, x) {
    return fill(q, list.map(function (c) { return ex(c[0], c[1], c[2]) + ' = [[]]'; }).join('<br>'), list.map(function (c) { return calc(c[0], c[1], c[2]); }), put({ meta: { k: 'g3as-row', list: list } }, x || {}));
  }
  /* "someone worked it out": true when said is the real answer */
  function calcTF(who, a, op, b, said, right, bad, fix, x) {
    return tf(who + ' says ' + math(ex(a, op, b) + ' = ' + said) + '. True or false: ' + who + ' is right.', said === calc(a, op, b), right, bad, fix, put({ meta: { k: 'g3as-calctf', a: a, op: op, b: b, said: said } }, x || {}));
  }
  /* fill-in lines where every line is a true equation once filled */
  function eqsQ(q, text, answers, x) { return fill(q, text, answers, put({ meta: { k: 'g3as-eqs' } }, x || {})); }

  /* ---------- pictures ---------- */
  var FILL = 'var(--strand)', HI = 'var(--hi)';
  function r1(v) { return Math.round(v * 10) / 10; }
  /* two ten frames: a dots, then b dots. made: b's dots first fill the first frame (making a ten) */
  function tenFrames(a, b, made) {
    var s = '', cs = 32, c1 = [], c2 = [], i, rest = made ? Math.max(0, a + b - 10) : b;
    for (i = 0; i < 10; i++) { c1.push(i < a ? FILL : made && i < a + b ? HI : null); c2.push(i < rest ? HI : null); }
    [[c1, 4], [c2, 188]].forEach(function (f) {
      for (var j = 0; j < 10; j++) {
        var x = f[1] + (j % 5) * cs, y = 4 + Math.floor(j / 5) * cs;
        s += '<rect x="' + x + '" y="' + y + '" width="' + cs + '" height="' + cs + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
        if (f[0][j]) s += '<circle cx="' + (x + cs / 2) + '" cy="' + (y + cs / 2) + '" r="11" style="fill:' + f[0][j] + ';stroke:var(--ink)" stroke-width="1.5"/>';
      }
    });
    return A.svg(352, 72, s, 'Two ten frames: ' + a + ' dots and ' + b + ' dots' + (made ? ', moved to fill the first frame' : ''));
  }
  /* two rows of dots for doubles: the extra dot in the longer row is lighter */
  function dotRows(a, b) {
    var s = '', m = Math.min(a, b), big = Math.max(a, b), cs = big > 12 ? 20 : 28, r = big > 12 ? 7 : 10;
    [a, b].forEach(function (n, row) {
      for (var i = 0; i < n; i++) s += '<circle cx="' + (6 + r + i * cs) + '" cy="' + (6 + r + row * (cs + 4)) + '" r="' + r + '" style="fill:' + (i < m ? FILL : HI) + ';stroke:var(--ink)" stroke-width="1.5"/>';
    });
    return A.svg(12 + big * cs, 2 * cs + 16, s, 'A row of ' + a + ' dots and a row of ' + b + ' dots');
  }
  /* a number bond: the whole on top, two parts below; null shows a question mark */
  function bond(whole, p1, p2) {
    var s = '<line x1="170" y1="60" x2="90" y2="120" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="170" y1="60" x2="250" y2="120" style="stroke:var(--ink)" stroke-width="2.5"/>';
    [[170, 44, whole, FILL], [90, 136, p1, 'var(--card)'], [250, 136, p2, 'var(--card)']].forEach(function (c) {
      s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="36" style="fill:' + (c[2] === null ? HI : c[3]) + ';stroke:var(--ink)" stroke-width="2.5"/>' +
        '<text x="' + c[0] + '" y="' + (c[1] + 10) + '" text-anchor="middle" font-size="28" font-weight="700" style="fill:' + (c[3] === FILL && c[2] !== null ? '#fff' : 'var(--ink)') + '">' + (c[2] === null ? '?' : c[2]) + '</text>';
    });
    return A.svg(340, 178, s, 'A number bond: whole ' + (whole === null ? 'unknown' : whole) + ', parts ' + (p1 === null ? 'unknown' : p1) + ' and ' + (p2 === null ? 'unknown' : p2));
  }
  /* the column method on a place value grid. k = how many columns are done, from the ones.
     Adding: carried 1s show above. Subtracting: traded digits are crossed out with the new value above. */
  function colFig(a, b, op, k) {
    var res = calc(a, op, b), cols = Math.max(3, String(a).length, String(res).length), da = dig(a), db = dig(b), dr = dig(res), cw = 66, x0 = 54, s = '', p;
    var carry = [0, 0, 0, 0, 0], top = da.slice();
    if (op === '+') { var c = 0; for (p = 0; p < cols; p++) { carry[p] = c; c = da[p] + db[p] + c >= 10 ? 1 : 0; } }
    else for (p = 0; p < Math.min(k, cols); p++) if (top[p] < db[p]) { var q2 = p + 1; while (top[q2] === 0) q2++; top[q2]--; for (var r = q2 - 1; r > p; r--) top[r] = 9; top[p] += 10; }
    function X(p) { return x0 + cw * (cols - 1 - p) + cw / 2; }
    for (p = 0; p < cols; p++) {
      s += '<rect x="' + (X(p) - cw / 2 + 3) + '" y="2" width="' + (cw - 6) + '" height="24" rx="6" style="fill:var(--p' + p + ')"/><text x="' + X(p) + '" y="19" text-anchor="middle" font-size="12" font-weight="700" style="fill:' + (p ? '#fff' : '#13203a') + '">' + PNAME[p] + '</text>';
      if (op === '+' && carry[p] && k >= p && p < cols) s += '<text x="' + X(p) + '" y="52" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--accent)">1</text>';
      if (p < String(a).length) {
        var ch = op === '-' && top[p] !== da[p];
        s += '<text x="' + X(p) + '" y="92" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display)' + (ch ? ';fill:var(--ink2)' : '') + '">' + da[p] + '</text>';
        if (ch) s += '<line x1="' + (X(p) - 14) + '" y1="88" x2="' + (X(p) + 14) + '" y2="66" style="stroke:var(--accent)" stroke-width="3"/><text x="' + X(p) + '" y="52" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--accent)">' + top[p] + '</text>';
      }
      if (p < String(b).length) s += '<text x="' + X(p) + '" y="136" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display)">' + db[p] + '</text>';
      if (p < k && p < String(res).length) s += '<text x="' + X(p) + '" y="190" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display);fill:var(--p' + Math.min(p, 3) + ')">' + dr[p] + '</text>';
    }
    s += '<text x="' + (x0 - 22) + '" y="136" text-anchor="middle" font-size="36" font-weight="700">' + (op === '+' ? '+' : '&minus;') + '</text>';
    s += '<line x1="' + (x0 - 40) + '" y1="150" x2="' + (x0 + cw * cols) + '" y2="150" style="stroke:var(--ink)" stroke-width="3"/>';
    return A.svg(x0 + cw * cols + 6, 202, s, ex(a, op, b) + ' in columns' + (k >= cols ? ' = ' + res : ''));
  }
  /* an open number line with jumps (parts are signed: +30, -1). hideEnd puts a ? on the last stop */
  function lineHops(start, parts, hideEnd) {
    var vals = [start], i;
    parts.forEach(function (p) { vals.push(vals[vals.length - 1] + p); });
    var xs = [0];
    parts.forEach(function (p) { xs.push(xs[xs.length - 1] + (p > 0 ? 1 : -1) * Math.max(60, Math.sqrt(Math.abs(p)) * 13)); });
    var mn = Math.min.apply(null, xs), mx = Math.max.apply(null, xs), W = 560, k = (W - 80) / (mx - mn || 1);
    xs = xs.map(function (x) { return 40 + (x - mn) * k; });
    var s = '<line x1="16" y1="96" x2="' + (W - 16) + '" y2="96" style="stroke:var(--ink)" stroke-width="3"/>';
    for (i = 0; i < vals.length; i++) {
      var last = i === vals.length - 1;
      s += '<line x1="' + r1(xs[i]) + '" y1="88" x2="' + r1(xs[i]) + '" y2="104" style="stroke:var(--ink)" stroke-width="2.5"/>' +
        '<text x="' + r1(xs[i]) + '" y="' + (i && parts[i - 1] < 0 ? 186 : 128) + '" text-anchor="middle" font-size="20" class="tb"' + (last ? ' style="fill:var(--accent)"' : '') + '>' + (last && hideEnd ? '?' : vals[i]) + '</text>';
      if (i) {
        var xa = xs[i - 1], up = parts[i - 1] > 0, h = Math.min(56, Math.abs(xs[i] - xa) * 0.45 + 12), col = Math.abs(parts[i - 1]) >= 100 ? 2 : Math.abs(parts[i - 1]) >= 10 ? 1 : 0, cy = up ? 92 - h * 2 : 100 + h * 1.2;
        s += '<path d="M' + r1(xa) + ' ' + (up ? 92 : 100) + ' Q' + r1((xa + xs[i]) / 2) + ' ' + r1(cy) + ' ' + r1(xs[i]) + ' ' + (up ? 92 : 100) + '" fill="none" style="stroke:var(--p' + col + ')" stroke-width="3"/>' +
          '<text x="' + r1((xa + xs[i]) / 2) + '" y="' + r1(up ? 92 - h - 6 : 100 + h * 0.6 + 18) + '" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--p' + col + ')">' + (up ? '+' : '&minus;') + Math.abs(parts[i - 1]) + '</text>';
      }
    }
    s += '<circle cx="' + r1(xs[0]) + '" cy="96" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    var neg = parts.some(function (p) { return p < 0; });
    return A.svg(W, neg ? 196 : 136, s, 'Open number line: start at ' + start + ', ' + parts.map(function (p) { return (p > 0 ? 'add ' : 'take away ') + Math.abs(p); }).join(', then ') + (hideEnd ? '' : ', to land on ' + vals[vals.length - 1]));
  }
  /* a pan balance, level, with an expression on each side */
  function balance(left, right) {
    var s = '<polygon points="280,170 250,210 310,210" style="fill:var(--ink2)"/><line x1="280" y1="60" x2="280" y2="172" style="stroke:var(--ink2)" stroke-width="6"/><line x1="90" y1="60" x2="470" y2="60" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>';
    [[110, left], [450, right]].forEach(function (pn) {
      s += '<line x1="' + pn[0] + '" y1="60" x2="' + (pn[0] - 60) + '" y2="120" style="stroke:var(--ink2)" stroke-width="2"/><line x1="' + pn[0] + '" y1="60" x2="' + (pn[0] + 60) + '" y2="120" style="stroke:var(--ink2)" stroke-width="2"/>' +
        '<path d="M' + (pn[0] - 90) + ' 120 H' + (pn[0] + 90) + ' Q' + pn[0] + ' 160 ' + (pn[0] - 90) + ' 120Z" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="2.5"/>' +
        '<text x="' + pn[0] + '" y="110" text-anchor="middle" font-size="26" font-weight="700" style="font-family:var(--display)">' + pn[1] + '</text>';
    });
    s += '<circle cx="280" cy="60" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 216, s, 'A level balance: ' + plain(left) + ' on one side, ' + plain(right) + ' on the other');
  }
  /* bar models. whole: two parts and the total; part: the total and one part; compare: two bars and the difference. null = ? */
  function barFig(kind, a, b) {
    var s = '', W = 320, x0 = 10, big = kind === 'part' || kind === 'compare' ? a : a + b, k = W / big;
    function bx(x, y, w, fill, label) { return '<rect x="' + r1(x) + '" y="' + y + '" width="' + r1(w) + '" height="40" rx="4" style="fill:' + fill + ';stroke:var(--ink)" stroke-width="2"' + (fill === 'none' ? ' stroke-dasharray="6 4"' : '') + '/><text x="' + r1(x + w / 2) + '" y="' + (y + 27) + '" text-anchor="middle" font-size="20" font-weight="700">' + label + '</text>'; }
    if (kind === 'compare') {
      s += bx(x0, 4, a * k, 'color-mix(in srgb,var(--strand) 30%,var(--card))', a) + bx(x0, 54, b * k, 'color-mix(in srgb,var(--hi) 60%,var(--card))', b) + bx(x0 + b * k, 54, (a - b) * k, 'none', '?');
      return A.svg(W + 20, 100, s, 'Two bars: ' + a + ' and ' + b + '. The difference is unknown.');
    }
    var p1 = kind === 'whole' ? a : b, p2 = kind === 'whole' ? b : a - b;
    s += bx(x0, 4, W, kind === 'whole' ? 'none' : 'color-mix(in srgb,var(--strand) 30%,var(--card))', kind === 'whole' ? '?' : a);
    s += bx(x0, 54, p1 * k, 'color-mix(in srgb,var(--hi) 60%,var(--card))', p1) + bx(x0 + p1 * k, 54, p2 * k, kind === 'whole' ? 'color-mix(in srgb,var(--hi) 60%,var(--card))' : 'none', kind === 'whole' ? p2 : '?');
    return A.svg(W + 20, 100, s, kind === 'whole' ? 'Parts ' + a + ' and ' + b + ', total unknown' : 'Total ' + a + ', one part ' + b + ', the other part unknown');
  }
  function blk(n, u0) { return A.draw.blocks(n, 'Base-ten blocks for ' + n, 520, u0 || 5); }
  function addFig(a, b) { return '<div>' + blk(a) + '<p class="g3-sym">+</p>' + blk(b) + '</div>'; }

  /* a Watch or My turn clip on a drawing: list = [[line, change to the picture (or a list of changes), ms], ...] */
  function view(draw) { return function (s) { return '<div>' + draw(s) + (s.sym ? '<p class="g3-sym">' + s.sym + '</p>' : '') + '</div>'; }; }
  function clip(draw, start, list) {
    return { mount: G3.view(view(draw), start), steps: list.map(function (s) {
      var st = { say: s[0], ms: s[2] || 1900 }, p = s[1];
      if (p) st.act = function (t) { return Array.isArray(p) ? t.seq(p, 650) : t.set(p, 700); };
      return st;
    }) };
  }
  function tool(name, opts, list) { return { tool: name, opts: opts, steps: list.map(function (s) { var st = { say: s[0], ms: s[2] || 1600 }; if (s[1]) st.act = s[1]; return st; }) }; }

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }
  /* small step questions for Together */
  function stepQ(q, a, op, b, hint, fixes) { return calcQ(q, a, op, b, fixes || {}, { hint: hint || ex(a, op, b) + '.' }); }
  function missQ(q, a, t, hint) { return num(q, t - a, {}, { hint: hint || 'Count up from ' + a + ' to ' + t + '.', meta: { k: 'g3as-missing', a: a, t: t } }); }
  function addnQ(q, list, hint) { return num(q, sum(list), {}, { hint: hint || list.join(' + ') + '.', meta: { k: 'g3as-addn', list: list } }); }

  /* ======================= Lesson 1: Facts to 20 ======================= */
  var THINGS = [['stickers', 'gets'], ['beads', 'finds'], ['hockey cards', 'buys'], ['crackers', 'is given'], ['apples', 'picks'], ['shells', 'finds']];
  function storyAdd(who, a, b) { var t = R.pick(THINGS); return who + ' has ' + a + ' ' + t[0] + ' and ' + t[1] + ' ' + b + ' more. How many ' + t[0] + ' now?'; }
  function storySub(who, a, b) { var t = R.pick([['stickers', 'gives away'], ['crackers', 'eats'], ['beads', 'loses'], ['apples', 'shares out'], ['pencils', 'lends out']]); return who + ' has ' + a + ' ' + t[0] + ' and ' + t[1] + ' ' + b + '. How many are left?'; }

  /* ---------- Make a ten ---------- */
  function mCase(lv) {
    var a, b;
    if (lv === 1) { a = 9; b = R.int(2, 9); }
    else if (lv === 2) { a = R.pick([7, 8, 9]); do { b = R.int(3, 9); } while (a + b <= 10); }
    else { var o = R.pick([6, 7, 8, 9]); a = R.int(1, 9) * 10 + o; do { b = R.int(4, 9); } while (o + b <= 10); }
    var need = 10 - a % 10;
    return { a: a, b: b, need: need, rest: b - need };
  }
  function m10Fix(c) { var f = {}; f[c.a + c.b - 10] = 'You made the ten. Count the ten too.'; f[c.a + c.b + 1] = 'Count again: ' + c.need + ' and ' + c.rest + ' make ' + c.b + '.'; return f; }
  skill('as-make10', 'Make a ten', 'B2.3', [
    [1, 'plain', function (lv) {
      var c = mCase(lv);
      return calcQ(math(ex(c.a, '+', c.b) + ' = ?'), c.a, '+', c.b, m10Fix(c), { fig: lv < 3 ? tenFrames(c.a, c.b, false) : tenFrames(c.a % 10, c.b, false),
        hint: 'Move ' + c.need + ' over to make the next ten.', steps: [c.a + ' + ' + c.need + ' = ' + (c.a + c.need) + '.', (c.a + c.need) + ' + ' + c.rest + ' = ' + (c.a + c.b) + '.'], explain: ex(c.a, '+', c.b) + ' = ' + (c.a + c.b) + '.' });
    }],
    [1, 'split', function (lv) {
      var c = mCase(lv);
      return eqsQ('Make a ten. Fill in the blanks.', c.a + ' + ' + c.b + ' = ' + c.a + ' + [[]] + [[]] = [[]]', [c.need, c.rest, c.a + c.b], { fig: lv === 1 ? tenFrames(c.a, c.b, true) : '',
        hint: 'How many does ' + c.a + ' need to make ' + (c.a + c.need) + '?', steps: ['Split ' + c.b + ' into ' + c.need + ' and ' + c.rest + '.', c.a + ' + ' + c.need + ' = ' + (c.a + c.need) + ', then ' + c.rest + ' more: ' + (c.a + c.b) + '.'], explain: c.a + ' + ' + c.b + ' = ' + (c.a + c.need) + ' + ' + c.rest + ' = ' + (c.a + c.b) + '.' });
    }],
    [1, 'next', function (lv) {
      var c = mCase(lv);
      return num('How many more does ' + math(c.a) + ' need to make the next ten?', c.need, {}, { fig: lv < 3 ? tenFrames(c.a % 10 || 10, 0, false) : '',
        hint: 'Count the empty boxes.', steps: [c.a + ' + ' + c.need + ' = ' + (c.a + c.need) + '.'], explain: c.a + ' + ' + c.need + ' = ' + (c.a + c.need) + '.', meta: { k: 'g3as-tonext', a: c.a } });
    }],
    [2, 'row', function (lv) {
      var list = []; while (list.length < 3) { var c = mCase(lv); if (!list.some(function (x) { return x[0] === c.a && x[2] === c.b; })) list.push([c.a, '+', c.b]); }
      return rowQ('Make a ten in your head.', list, { hint: 'Fill the ten first, then add the rest.', steps: list.map(function (x) { return ex(x[0], '+', x[2]) + ' = ' + (x[0] + x[2]) + '.'; }), explain: 'Each one: fill the ten, then add the rest.' });
    }],
    [2, 'story', function (lv) {
      var c = mCase(lv), who = Q.name();
      return calcQ(storyAdd(who, c.a, c.b), c.a, '+', c.b, m10Fix(c), { hint: 'Make a ten first.', steps: [c.a + ' + ' + c.need + ' = ' + (c.a + c.need) + '.', 'Then ' + c.rest + ' more: ' + (c.a + c.b) + '.'], explain: (c.a + c.b) + ' in all.' });
    }],
    [2, 'tf', function (lv) {
      var c = mCase(lv), who = Q.name(), truth = coin(), said = truth ? c.a + c.b : R.pick([c.a + c.b - 10, c.a + c.b + 1, c.a + c.b - 1]);
      return calcTF(who, c.a, '+', c.b, said, c.a + ' + ' + c.need + ' makes ' + (c.a + c.need) + ', and ' + c.rest + ' more is ' + (c.a + c.b) + '.',
        ['Adding always ends in 0.', 'Forget the ten you made.', 'Add the first digits only.'], 'Make the ten, then add what is left.', { fig: lv < 3 ? tenFrames(c.a % 10, c.b, true) : '', hint: 'Make a ten first.' });
    }]
  ]);
  function tgMake10(lv) {
    return function () {
      var c = mCase(lv);
      return { q: 'Work out ' + math(ex(c.a, '+', c.b)) + '.', fig: tenFrames(c.a % 10, c.b, false), done: ex(c.a, '+', c.b) + ' = ' + (c.a + c.b) + '.', steps: [
        { prompt: 'How many to fill the ten?', q: num('How many more does ' + c.a + ' need to make ' + (c.a + c.need) + '?', c.need, {}, { hint: 'Count the empty boxes.', meta: { k: 'g3as-tonext', a: c.a } }) },
        { prompt: 'Take those from ' + c.b + '.', q: stepQ(ex(c.b, '-', c.need) + ' = ?', c.b, '-', c.need, 'How many dots are left over?') },
        { prompt: 'The ten and the rest.', q: stepQ(ex(c.a + c.need, '+', c.rest) + ' = ?', c.a + c.need, '+', c.rest, 'Ten and ' + c.rest + '.') }
      ] };
    };
  }

  /* ---------- Doubles and near doubles ---------- */
  function dCase(lv) { var a = lv === 1 ? R.int(2, 5) : lv === 2 ? R.int(5, 9) : R.int(11, 25), b = a + (coin() ? 1 : -1); if (b < 1) b = a + 1; return { a: a, b: b, s: Math.min(a, b), big: Math.max(a, b) }; }
  function ndFix(c) { var f = {}; f[2 * c.s] = 'That is the double. Add 1 more.'; f[2 * c.big] = 'That double is too big. Use the smaller one, then add 1.'; return f; }
  skill('as-doubles', 'Doubles and near doubles', 'B2.3', [
    [1, 'plain', function (lv) {
      var c = dCase(lv);
      return calcQ(math(ex(c.a, '+', c.b) + ' = ?'), c.a, '+', c.b, ndFix(c), { fig: lv < 3 ? dotRows(c.a, c.b) : '',
        hint: 'Use the double: ' + c.s + ' + ' + c.s + '.', steps: [c.s + ' + ' + c.s + ' = ' + 2 * c.s + '.', 'One more: ' + (c.a + c.b) + '.'], explain: ex(c.a, '+', c.b) + ' = ' + (c.a + c.b) + '.' });
    }],
    [1, 'fill', function (lv) {
      var c = dCase(lv);
      return eqsQ('Use a double you know.', c.s + ' + ' + c.s + ' = [[]]<br>' + c.a + ' + ' + c.b + ' = [[]]', [2 * c.s, c.a + c.b], { fig: lv === 1 ? dotRows(c.a, c.b) : '',
        hint: 'The second one has 1 more.', steps: [c.s + ' + ' + c.s + ' = ' + 2 * c.s + '.', 'So ' + c.a + ' + ' + c.b + ' = ' + (c.a + c.b) + '.'], explain: 'Double, then 1 more.' });
    }],
    [1, 'story', function (lv) {
      var c = dCase(lv), who = Q.name();
      return calcQ(storyAdd(who, c.a, c.b), c.a, '+', c.b, ndFix(c), { hint: 'Find a double close by.', steps: [c.s + ' + ' + c.s + ' = ' + 2 * c.s + '.', 'One more: ' + (c.a + c.b) + '.'], explain: (c.a + c.b) + ' in all.' });
    }],
    [2, 'mc', function (lv) {
      var c = dCase(lv), wr = [];
      while (wr.length < 3) { var x = R.int(lv === 3 ? 11 : 2, lv === 3 ? 25 : 9), y = x + R.pick([-1, 1]) * R.int(3, 6); if (y > 0 && wr.indexOf(x + ' + ' + y) < 0) wr.push(x + ' + ' + y); }
      return mc('Which one is a <b>near double</b>?', math(ex(c.a, '+', c.b)), wr.map(function (w) { return [math(w), 'Those two numbers are far apart.']; }), {
        hint: 'A near double has numbers just 1 apart.', steps: [c.a + ' and ' + c.b + ' are 1 apart.'], explain: ex(c.a, '+', c.b) + ' = ' + c.s + ' + ' + c.s + ' + 1.', meta: { k: 'g3as-ndmc' } });
    }],
    [2, 'row', function (lv) {
      var list = []; while (list.length < 3) { var c = dCase(lv); if (!list.some(function (x) { return x[0] === c.a; })) list.push([c.a, '+', c.b]); }
      return rowQ('Near doubles. Fill in the answers.', list, { hint: 'Double the smaller number, then add 1.', steps: list.map(function (x) { return ex(x[0], '+', x[2]) + ' = ' + (x[0] + x[2]) + '.'; }), explain: 'Double, then 1 more.' });
    }],
    [2, 'tf', function (lv) {
      var c = dCase(lv), who = Q.name(), truth = coin(), said = truth ? c.a + c.b : R.pick([2 * c.s, 2 * c.big, c.a + c.b + 2]);
      return calcTF(who, c.a, '+', c.b, said, c.s + ' + ' + c.s + ' = ' + 2 * c.s + ', and 1 more is ' + (c.a + c.b) + '.',
        ['A near double is the same as the double.', 'Add 2 to the double.', 'Double the bigger number and add 1.'], 'Double the smaller number, then add 1.', { hint: 'Use the double.' });
    }]
  ]);
  function tgDoubles(lv) {
    return function () {
      var c = dCase(lv);
      return { q: 'Work out ' + math(ex(c.a, '+', c.b)) + '.', fig: dotRows(c.a, c.b), done: ex(c.a, '+', c.b) + ' = ' + (c.a + c.b) + '.', steps: [
        { prompt: 'Find the double you know.', q: stepQ(ex(c.s, '+', c.s) + ' = ?', c.s, '+', c.s, 'Two rows of ' + c.s + '.') },
        { prompt: 'One row has 1 more.', q: stepQ(ex(2 * c.s, '+', 1) + ' = ?', 2 * c.s, '+', 1, 'One more.') }
      ] };
    };
  }

  /* ---------- Think addition to subtract ---------- */
  function tCase(lv) {
    var u = lv === 3 && coin() ? 10 : 1, c, b;
    if (lv === 1) { c = R.int(11, 15); b = R.int(6, 9); }
    else { c = R.int(11, 18); do { b = R.int(3, 9); } while (b <= c % 10 || c - b > 9); }
    if (lv === 1) while (b <= c % 10 || c - b > 9) b = R.int(6, 9);
    return { c: c * u, b: b * u, d: (c - b) * u, u: u };
  }
  skill('as-think', 'Think addition to subtract', 'B2.3', [
    [1, 'plain', function (lv) {
      var t = tCase(lv), fx = {}; fx[t.c + t.b] = 'That is adding. This is take away.'; fx[t.d + t.u] = 'Count up again from ' + t.b + '.';
      return calcQ(math(ex(t.c, '-', t.b) + ' = ?'), t.c, '-', t.b, fx, { fig: lv < 3 ? bond(t.c, t.b, null) : '',
        hint: 'Think: ' + t.b + ' + ? = ' + t.c + '.', steps: [t.b + ' + ' + t.d + ' = ' + t.c + '.', 'So ' + ex(t.c, '-', t.b) + ' = ' + t.d + '.'], explain: ex(t.c, '-', t.b) + ' = ' + t.d + '.' });
    }],
    [1, 'bond', function (lv) {
      var t = tCase(lv);
      return eqsQ('Think addition. Fill in the blanks.', t.b + ' + [[]] = ' + t.c + '<br>So ' + t.c + ' &minus; ' + t.b + ' = [[]]', [t.d, t.d], { fig: bond(t.c, t.b, null),
        hint: 'What goes with ' + t.b + ' to make ' + t.c + '?', steps: [t.b + ' + ' + t.d + ' = ' + t.c + '.', ex(t.c, '-', t.b) + ' = ' + t.d + '.'], explain: 'The missing part is ' + t.d + '.' });
    }],
    [1, 'story', function (lv) {
      var t = tCase(lv), who = Q.name();
      return calcQ(storySub(who, t.c, t.b), t.c, '-', t.b, {}, { hint: 'Think: ' + t.b + ' + ? = ' + t.c + '.', steps: [t.b + ' + ' + t.d + ' = ' + t.c + '.'], explain: t.d + ' are left.' });
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) { var t = tCase(lv), key = t.d; if (seen[key]) continue; seen[key] = 1; pairs.push([math(ex(t.c, '-', t.b)), math(t.b + ' + ' + t.d + ' = ' + t.c)]); }
      return { q: 'Match each subtraction to the addition that solves it.', type: 'match', pairs: pairs, hint: 'Look for the same two numbers.', steps: ['14 &minus; 6: think 6 + 8 = 14.'], explain: 'The missing part is the answer.', meta: { k: 'g3as-bondmatch' } };
    }],
    [2, 'row', function (lv) {
      var list = []; while (list.length < 3) { var t = tCase(lv); if (!list.some(function (x) { return x[0] === t.c && x[2] === t.b; })) list.push([t.c, '-', t.b]); }
      return rowQ('Think addition. Fill in the answers.', list, { hint: 'For each one: the small number plus what makes the big one?', steps: list.map(function (x) { return ex(x[0], '-', x[2]) + ' = ' + (x[0] - x[2]) + '.'; }), explain: 'Think addition each time.' });
    }],
    [2, 'tf', function (lv) {
      var t = tCase(lv), who = Q.name(), truth = coin(), said = truth ? t.d : R.pick([t.d + t.u, t.d - t.u, t.c + t.b]);
      return calcTF(who, t.c, '-', t.b, said, t.b + ' + ' + t.d + ' = ' + t.c + ', so the answer is ' + t.d + '.',
        ['Subtract the ones digits only.', 'Take the small number from the ones.', 'Add the two numbers.'], 'Check: does ' + t.b + ' + ' + said + ' make ' + t.c + '?', { hint: 'Check by adding.' });
    }]
  ]);
  function tgThink(lv) {
    return function () {
      var t = tCase(lv), ten = 10 * t.u;
      return { q: 'Work out ' + math(ex(t.c, '-', t.b)) + '. Count up from ' + t.b + '.', fig: bond(t.c, t.b, null), done: ex(t.c, '-', t.b) + ' = ' + t.d + '.', steps: [
        { prompt: 'Count up to ' + ten + ' first.', q: missQ(t.b + ' + ? = ' + ten, t.b, ten) },
        { prompt: 'Then up to ' + t.c + '.', q: missQ(ten + ' + ? = ' + t.c, ten, t.c) },
        { prompt: 'Add the two jumps.', q: stepQ(ex(ten - t.b, '+', t.c - ten) + ' = ?', ten - t.b, '+', t.c - ten, 'That is how far you counted.') }
      ] };
    };
  }

  /* ---------- Mixed facts to 20 ---------- */
  function fact(lv, op) {
    var a, b;
    if (op === '+') { if (lv === 1) { a = R.int(1, 9); b = R.int(1, 10 - a); } else { do { a = R.int(2, 10); b = R.int(2, 10); } while (a + b <= 10); } return [a, '+', b]; }
    var d, c;
    if (lv === 1) { c = R.int(3, 10); b = R.int(1, c - 1); } else { do { b = R.int(2, 10); d = R.int(2, 10); c = b + d; } while (c <= 10); }
    return [c, '-', b];
  }
  skill('as-facts', 'Mixed facts to 20', 'B2.3', [
    [1, 'plain', function (lv) {
      var f = fact(lv, coin() ? '+' : '-'), fx = {}; fx[f[1] === '+' ? f[0] - f[2] : f[0] + f[2]] = f[1] === '+' ? 'Check the sign: this one adds.' : 'Check the sign: this one takes away.';
      return calcQ(math(ex(f[0], f[1], f[2]) + ' = ?'), f[0], f[1], f[2], fx, { hint: f[1] === '+' ? 'Make a ten, or use a double.' : 'Think addition: ' + f[2] + ' + ? = ' + f[0] + '.', steps: [ex(f[0], f[1], f[2]) + ' = ' + calc(f[0], f[1], f[2]) + '.'], explain: ex(f[0], f[1], f[2]) + ' = ' + calc(f[0], f[1], f[2]) + '.' });
    }],
    [1, 'row', function (lv) {
      var list = []; while (list.length < 4) { var f = fact(lv, list.length % 2 ? '-' : '+'); if (!list.some(function (x) { return x.join() === f.join(); })) list.push(f); }
      list = R.shuffle(list);
      return rowQ('Facts to 20. Watch the signs.', list, { hint: 'Read each sign first.', steps: list.map(function (x) { return ex(x[0], x[1], x[2]) + ' = ' + calc(x[0], x[1], x[2]) + '.'; }), explain: 'Four facts done.' });
    }],
    [2, 'missing', function (lv) {
      var f = fact(lv, coin() ? '+' : '-'), r = calc(f[0], f[1], f[2]), k = R.int(0, 1), t, ans;
      if (k === 0) { t = '[[]] ' + sg(f[1]) + ' ' + f[2] + ' = ' + r; ans = f[0]; } else { t = f[0] + ' ' + sg(f[1]) + ' [[]] = ' + r; ans = f[2]; }
      return eqsQ('Find the missing number.', t, [ans], { hint: 'Use the fact family.', steps: [ex(f[0], f[1], f[2]) + ' = ' + r + '.'], explain: ex(f[0], f[1], f[2]) + ' = ' + r + '.' });
    }],
    [2, 'story', function (lv) {
      var op = coin() ? '+' : '-', f = fact(lv, op), who = Q.name();
      return calcQ(op === '+' ? storyAdd(who, f[0], f[2]) : storySub(who, f[0], f[2]), f[0], op, f[2], {}, { hint: op === '+' ? '"More" means add.' : '"Left" means take away.', steps: [ex(f[0], op, f[2]) + ' = ' + calc(f[0], op, f[2]) + '.'], explain: calc(f[0], op, f[2]) + '.' });
    }],
    [2, 'tf', function (lv) {
      var f = fact(lv, coin() ? '+' : '-'), r = calc(f[0], f[1], f[2]), who = Q.name(), truth = coin(), said = truth ? r : r + R.pick([1, -1, 2]);
      return calcTF(who, f[0], f[1], f[2], said, ex(f[0], f[1], f[2]) + ' = ' + r + '.', ['Close enough is right.', 'Facts can be guessed.', 'The sign does not matter.'], 'Work it out yourself, then compare.', { hint: 'Use a fact you know.' });
    }]
  ]);
  function tgFacts(lv) {
    return function () {
      var f = fact(lv, '+'), a = f[0], b = f[2], s = a + b;
      return { q: 'One family of facts: ' + a + ', ' + b + ' and ' + s + '.', fig: bond(s, a, b), done: a + ' + ' + b + ' = ' + s + ', ' + b + ' + ' + a + ' = ' + s + ', ' + s + ' &minus; ' + a + ' = ' + b + ', ' + s + ' &minus; ' + b + ' = ' + a + '.', steps: [
        { prompt: 'Add the parts.', q: stepQ(ex(a, '+', b) + ' = ?', a, '+', b) },
        { prompt: 'Turn them around.', q: stepQ(ex(b, '+', a) + ' = ?', b, '+', a, 'Same parts, same whole.') },
        { prompt: 'Take one part away.', q: stepQ(ex(s, '-', a) + ' = ?', s, '-', a, 'The other part is left.') },
        { prompt: 'Now the other part.', q: stepQ(ex(s, '-', b) + ' = ?', s, '-', b, 'The other part is left.') }
      ] };
    };
  }

  /* ======================= Lesson 2: Mental math to 1000 ======================= */
  /* ---------- Add and subtract tens and hundreds ---------- */
  function kCase(lv) {
    var op = coin() ? '+' : '-', a, b, u;
    if (lv === 1) { u = 100; var f = fact(1, op); a = f[0] * u; b = f[2] * u; }
    else if (lv === 2) { u = 10; var g = fact(2, op); a = g[0] * u; b = g[2] * u; }
    else {
      u = 0;
      if (op === '+') { do { a = R.int(11, 89) * 10; b = R.int(2, 9) * 10; } while (Math.floor(a / 100) === Math.floor((a + b) / 100) || a % 100 === 0); }
      else { do { a = R.int(11, 99) * 10; b = R.int(2, 9) * 10; } while (Math.floor(a / 100) === Math.floor((a - b) / 100) || a % 100 === 0); }
    }
    return { a: a, b: b, op: op, u: u };
  }
  skill('as-tens', 'Tens and hundreds', 'B2.3', [
    [1, 'plain', function (lv) {
      var c = kCase(lv), r = calc(c.a, c.op, c.b);
      return calcQ(math(ex(c.a, c.op, c.b) + ' = ?'), c.a, c.op, c.b, {}, { fig: lv === 1 ? blk(c.a) : '',
        hint: c.u ? 'Use a fact: ' + ex(c.a / c.u, c.op, c.b / c.u) + '.' : 'Go to the next hundred first.', steps: c.u ? [ex(c.a / c.u, c.op, c.b / c.u) + ' = ' + calc(c.a / c.u, c.op, c.b / c.u) + '.', 'So ' + ex(c.a, c.op, c.b) + ' = ' + r + '.'] : [ex(c.a, c.op, c.b) + ' = ' + r + '.'], explain: ex(c.a, c.op, c.b) + ' = ' + r + '.' });
    }],
    [1, 'fact', function (lv) {
      var c = kCase(lv === 3 ? 2 : lv), x = c.a / c.u, y = c.b / c.u;
      return eqsQ('Use a fact you know.', ex(x, c.op, y) + ' = [[]]<br>So ' + ex(c.a, c.op, c.b) + ' = [[]]', [calc(x, c.op, y), calc(c.a, c.op, c.b)], {
        hint: c.u === 100 ? 'Count hundreds like ones.' : 'Count tens like ones.', steps: [ex(x, c.op, y) + ' = ' + calc(x, c.op, y) + '.', calc(x, c.op, y) + ' ' + (c.u === 100 ? 'hundreds' : 'tens') + ' = ' + calc(c.a, c.op, c.b) + '.'], explain: ex(c.a, c.op, c.b) + ' = ' + calc(c.a, c.op, c.b) + '.' });
    }],
    [2, 'line', function (lv) {
      var c = kCase(lv), r = calc(c.a, c.op, c.b), lo = Math.min(c.a, r), hi = Math.max(c.a, r), step = c.u === 100 ? 100 : 10, mn = Math.max(0, Math.floor(lo / 100) * 100 - (step === 100 ? 0 : 50)), mx = Math.min(1000, Math.ceil(hi / 100) * 100 + (step === 100 ? 0 : 50));
      if (mx - mn < 200) mx = mn + 200;
      return calcQ('Start at ' + c.a + '. Jump ' + (c.op === '+' ? 'forward ' : 'back ') + c.b + '. Where do you land?', c.a, c.op, c.b, {}, { type: 'line', min: mn, max: mx, tick: step, every: step === 100 ? 100 : 50, snap: step,
        hint: c.u ? 'Use the fact ' + ex(c.a / c.u, c.op, c.b / c.u) + '.' : 'Cross the hundred.', steps: [ex(c.a, c.op, c.b) + ' = ' + r + '.'], explain: 'You land on ' + r + '.' });
    }],
    [2, 'story', function (lv) {
      var c = kCase(lv), who = Q.name(), r = calc(c.a, c.op, c.b);
      var q = c.op === '+' ? 'A school collected ' + c.a + ' cans of food. Then it collected ' + c.b + ' more. How many cans now?' : who + '\'s class had ' + c.a + ' craft sticks. They used ' + c.b + '. How many are left?';
      return calcQ(q, c.a, c.op, c.b, {}, { hint: 'Use a fact you know.', steps: [ex(c.a, c.op, c.b) + ' = ' + r + '.'], explain: r + '.' });
    }],
    [2, 'tf', function (lv) {
      var c = kCase(lv), who = Q.name(), r = calc(c.a, c.op, c.b), truth = coin(), said = truth ? r : r + R.pick([10, -10, 100, -100]);
      if (said < 0) said = r + 10;
      return calcTF(who, c.a, c.op, c.b, said, ex(c.a, c.op, c.b) + ' = ' + r + '.', ['Only the ones change.', 'Add a zero to the end.', 'Tens and hundreds are the same.'], 'Use a fact you know.', { hint: 'Count in tens or hundreds.' });
    }]
  ]);
  function tgTens(lv) {
    return function () {
      var c = kCase(lv), r = calc(c.a, c.op, c.b), steps;
      if (c.u) steps = [
        { prompt: 'Use the fact you know.', q: stepQ(ex(c.a / c.u, c.op, c.b / c.u) + ' = ?', c.a / c.u, c.op, c.b / c.u) },
        { prompt: 'Now in ' + (c.u === 100 ? 'hundreds.' : 'tens.'), q: stepQ(ex(c.a, c.op, c.b) + ' = ?', c.a, c.op, c.b, calc(c.a / c.u, c.op, c.b / c.u) + ' ' + (c.u === 100 ? 'hundreds' : 'tens') + '.') }
      ];
      else {
        var h = c.op === '+' ? Math.ceil(c.a / 100) * 100 : Math.floor(c.a / 100) * 100, first = Math.abs(h - c.a);
        steps = [
          { prompt: 'Jump to the hundred.', q: stepQ(ex(c.a, c.op, first) + ' = ?', c.a, c.op, first, 'Land on ' + h + '.') },
          { prompt: 'Then the rest of ' + c.b + '.', q: stepQ(ex(h, c.op, c.b - first) + ' = ?', h, c.op, c.b - first) }
        ];
      }
      return { q: 'Work out ' + math(ex(c.a, c.op, c.b)) + '.', fig: c.u ? '' : lineHops(c.a, [(c.op === '+' ? 1 : -1) * Math.abs((c.op === '+' ? Math.ceil(c.a / 100) * 100 : Math.floor(c.a / 100) * 100) - c.a), (c.op === '+' ? 1 : -1) * (c.b - Math.abs((c.op === '+' ? Math.ceil(c.a / 100) * 100 : Math.floor(c.a / 100) * 100) - c.a))], true), done: ex(c.a, c.op, c.b) + ' = ' + r + '.', steps: steps };
    };
  }

  /* ---------- Jump by place on a number line ---------- */
  function jCase(lv) {
    var op = coin() ? '+' : '-', a, b, r;
    do {
      a = R.int(120, 880); b = lv === 3 ? R.int(101, 399) : R.int(11, 89);
      r = calc(a, op, b);
      var ao = a % 10, bo = b % 10, at = Math.floor(a / 10) % 10, bt = Math.floor(b / 10) % 10;
      var ok = lv === 1 ? (op === '+' ? ao + bo < 10 && at + bt < 10 : ao >= bo && at >= bt) : lv === 2 ? (op === '+' ? ao + bo >= 10 : ao < bo) : true;
    } while (!ok || r < 100 || r > 999 || b % 10 === 0);
    var parts = [Math.floor(b / 100) * 100, Math.floor(b / 10) % 10 * 10, b % 10].filter(function (x) { return x; });
    return { a: a, b: b, op: op, r: r, parts: parts };
  }
  function signed(c) { return c.parts.map(function (p) { return c.op === '+' ? p : -p; }); }
  skill('as-jump', 'Jump by place', 'B2.3', [
    [1, 'plain', function (lv) {
      var c = jCase(lv);
      return calcQ(math(ex(c.a, c.op, c.b) + ' = ?'), c.a, c.op, c.b, {}, { fig: lv < 3 ? lineHops(c.a, signed(c), true) : '',
        hint: 'Jump the ' + (c.parts.length === 3 ? 'hundreds, then the tens, then the ones.' : 'tens, then the ones.'), steps: c.parts.map(function (p, i) { var from = c.a + (c.op === '+' ? 1 : -1) * sum(c.parts.slice(0, i)); return ex(from, c.op, p) + ' = ' + calc(from, c.op, p) + '.'; }), explain: ex(c.a, c.op, c.b) + ' = ' + c.r + '.' });
    }],
    [1, 'land', function (lv) {
      var c = jCase(lv), cur = c.a, lines = [], ans = [];
      c.parts.forEach(function (p, i) { lines.push((i ? '[[]]' : cur) + ' ' + sg(c.op) + ' ' + p + ' = [[]]'); if (i) ans.push(cur); cur = calc(cur, c.op, p); ans.push(cur); });
      return eqsQ('Jump one place at a time.', lines.join('<br>'), ans, { fig: lineHops(c.a, signed(c), true),
        hint: 'Each line starts where the last one landed.', steps: [ex(c.a, c.op, c.b) + ' = ' + c.r + '.'], explain: ex(c.a, c.op, c.b) + ' = ' + c.r + '.' });
    }],
    [1, 'story', function (lv) {
      var c = jCase(lv), who = Q.name();
      var q = c.op === '+' ? who + ' biked ' + c.a + ' m to the park, then ' + c.b + ' m to the library. How far did ' + who + ' bike?' : 'A roll of paper is ' + c.a + ' cm long. ' + who + ' cuts off ' + c.b + ' cm. How much is left?';
      return calcQ(q, c.a, c.op, c.b, {}, { hint: 'Jump by place: tens, then ones.', steps: [ex(c.a, c.op, c.b) + ' = ' + c.r + '.'], explain: c.r + (c.op === '+' ? ' m.' : ' cm.') });
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) { var c = jCase(lv); if (seen[c.r]) continue; seen[c.r] = 1; pairs.push([math(ex(c.a, c.op, c.b)), String(c.r)]); }
      return { q: 'Match each one to its answer.', type: 'match', pairs: pairs, hint: 'Work each one out by jumps.', steps: ['Jump the tens, then the ones.'], explain: pairs.map(function (p) { return plain(p[0]) + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'g3as-calcmatch' } };
    }],
    [2, 'tf', function (lv) {
      var c = jCase(lv), who = Q.name(), truth = coin(), said = truth ? c.r : c.r + R.pick([10, -10, 1, -1]);
      return calcTF(who, c.a, c.op, c.b, said, ex(c.a, c.op, c.b) + ' = ' + c.r + '.', ['Jump only the tens.', 'Jump the ones twice.', 'Jumps can be any size.'], 'Jump each place yourself, then compare.', { hint: 'Jump by place.' });
    }]
  ]);
  function tgJump(lv) {
    return function () {
      var c = jCase(lv), cur = c.a, steps = [];
      c.parts.forEach(function (p, i) { steps.push({ prompt: ['Jump the ', 'Now the ', 'Last, the '][Math.min(i, 2)] + PNAME[String(p).length - 1] + '.', q: stepQ(ex(cur, c.op, p) + ' = ?', cur, c.op, p) }); cur = calc(cur, c.op, p); });
      return { q: 'Work out ' + math(ex(c.a, c.op, c.b)) + ' by jumps.', fig: lineHops(c.a, signed(c), true), done: ex(c.a, c.op, c.b) + ' = ' + c.r + '.', steps: steps };
    };
  }

  /* ---------- Use a friendly number ---------- */
  function frCase(lv) {
    var a, b, op;
    if (lv === 1) { op = '+'; b = R.pick([9, 19, 29, 39]); a = R.int(21, 69); }
    else if (lv === 2) { op = '+'; b = R.pick([99, 98, 199, 198, 49, 48]); a = R.int(105, 999 - b); }
    else { op = '-'; b = R.pick([99, 98, 199, 198, 97]); a = R.int(b + 120, 980); }
    var f = Math.ceil(b / 10) * 10 + (b % 10 === 0 ? 0 : 0);
    return { a: a, b: b, op: op, f: f, k: f - b, r: calc(a, op, b) };
  }
  skill('as-friendly', 'Use a friendly number', 'B2.3', [
    [1, 'plain', function (lv) {
      var c = frCase(lv), fx = {}; fx[calc(c.a, c.op, c.f)] = 'That used ' + c.f + '. Now fix the extra ' + c.k + '.'; fx[c.op === '+' ? c.r + 2 * c.k : c.r - 2 * c.k] = 'The fix goes the other way.';
      return calcQ(math(ex(c.a, c.op, c.b) + ' = ?'), c.a, c.op, c.b, fx, { fig: lv < 3 ? lineHops(c.a, [c.op === '+' ? c.f : -c.f, c.op === '+' ? -c.k : c.k], true) : '',
        hint: ex(c.a, c.op, c.f) + ', then ' + (c.op === '+' ? 'take ' + c.k + ' back' : 'add ' + c.k + ' back') + '.', steps: [ex(c.a, c.op, c.f) + ' = ' + calc(c.a, c.op, c.f) + '.', ex(calc(c.a, c.op, c.f), c.op === '+' ? '-' : '+', c.k) + ' = ' + c.r + '.'], explain: ex(c.a, c.op, c.b) + ' = ' + c.r + '.' });
    }],
    [1, 'fill', function (lv) {
      var c = frCase(lv), m = calc(c.a, c.op, c.f), back = c.op === '+' ? '-' : '+';
      return eqsQ('Use ' + c.f + ' instead of ' + c.b + '.', c.a + ' ' + sg(c.op) + ' ' + c.f + ' = [[]]<br>[[]] ' + sg(back) + ' ' + c.k + ' = [[]]', [m, m, c.r], { fig: lineHops(c.a, [c.op === '+' ? c.f : -c.f, c.op === '+' ? -c.k : c.k], true),
        hint: c.f + ' is ' + c.k + ' more than ' + c.b + '.', steps: [ex(c.a, c.op, c.f) + ' = ' + m + '.', ex(m, back, c.k) + ' = ' + c.r + '.'], explain: ex(c.a, c.op, c.b) + ' = ' + c.r + '.' });
    }],
    [2, 'mc', function (lv) {
      var c = frCase(lv), back = c.op === '+' ? '-' : '+', other = c.op === '+' ? '+' : '-';
      return mc('Which is a quick way to work out ' + math(ex(c.a, c.op, c.b)) + '?', math(c.a + ' ' + sg(c.op) + ' ' + c.f + ' ' + sg(back) + ' ' + c.k), [
        [math(c.a + ' ' + sg(c.op) + ' ' + c.f + ' ' + sg(other) + ' ' + c.k), 'The fix goes the wrong way. ' + c.f + ' is too big by ' + c.k + '.'],
        [math(c.a + ' ' + sg(back) + ' ' + c.f + ' ' + sg(c.op) + ' ' + c.k), 'Keep the same sign as the question.'],
        [math(c.a + ' ' + sg(c.op) + ' ' + (c.f + 10) + ' ' + sg(back) + ' ' + c.k), 'Use the friendly number closest to ' + c.b + '.']], {
        hint: 'Use ' + c.f + ', then fix the extra ' + c.k + '.', steps: [c.f + ' is ' + c.k + ' more than ' + c.b + '.'], explain: math(c.a + ' ' + sg(c.op) + ' ' + c.f + ' ' + sg(back) + ' ' + c.k) + ' = ' + c.r + '.', meta: { k: 'g3as-friendmc', a: c.a, op: c.op, b: c.b } });
    }],
    [2, 'story', function (lv) {
      var c = frCase(lv), who = Q.name(), q = c.op === '+' ? who + ' buys a bike helmet for $' + c.b + ' and a lock for $' + c.a + '. What is the total, in dollars?' : who + ' has $' + c.a + ' in a savings account and spends $' + c.b + ' on skates. How many dollars are left?';
      return calcQ(q, c.a, c.op, c.b, {}, { hint: c.b + ' is close to ' + c.f + '.', steps: [ex(c.a, c.op, c.f) + ' = ' + calc(c.a, c.op, c.f) + '.', 'Fix the ' + c.k + ': ' + c.r + '.'], explain: '$' + c.r + '.' });
    }],
    [2, 'tf', function (lv) {
      var c = frCase(lv), who = Q.name(), truth = coin(), wrong = c.op === '+' ? c.r + 2 * c.k : c.r - 2 * c.k, said = truth ? c.r : R.pick([wrong, calc(c.a, c.op, c.f)]);
      return calcTF(who, c.a, c.op, c.b, said, ex(c.a, c.op, c.f) + ' = ' + calc(c.a, c.op, c.f) + ', then fix the ' + c.k + ': ' + c.r + '.', ['The friendly number is the answer.', 'Always add the fix.', 'Round both numbers.'], 'Use ' + c.f + ', then fix the extra ' + c.k + '.', { hint: c.b + ' is ' + c.k + ' less than ' + c.f + '.' });
    }]
  ]);
  function tgFriendly(lv) {
    return function () {
      var c = frCase(lv), m = calc(c.a, c.op, c.f), back = c.op === '+' ? '-' : '+';
      return { q: 'Work out ' + math(ex(c.a, c.op, c.b)) + ' with a friendly number.', fig: lineHops(c.a, [c.op === '+' ? c.f : -c.f, c.op === '+' ? -c.k : c.k], true), done: ex(c.a, c.op, c.b) + ' = ' + c.r + '.', steps: [
        { prompt: 'Find a friendly number close to ' + c.b + '.', q: num('Which ten is ' + c.b + ' just below?', c.f, {}, { hint: 'The next ten up.', meta: { k: 'g3as-friend', b: c.b } }) },
        { prompt: 'Use it.', q: stepQ(ex(c.a, c.op, c.f) + ' = ?', c.a, c.op, c.f) },
        { prompt: 'Fix the extra ' + c.k + '.', q: stepQ(ex(m, back, c.k) + ' = ?', m, back, c.k, c.f + ' was ' + c.k + ' too many.') }
      ] };
    };
  }

  /* ---------- Count up to subtract ---------- */
  function cuCase(lv) {
    var a, b;
    if (lv === 1) { a = R.int(2, 9) * 100; b = a - R.int(11, 89); }
    else if (lv === 2) { do { a = R.int(2, 9) * 100 + R.int(1, 9); b = a - R.int(21, 95); } while (b % 10 === 0); }
    else { do { a = coin() ? 1000 : R.int(3, 9) * 100 + R.int(0, 1) * 10 + R.int(1, 9); b = a - R.int(105, 389); } while (b % 10 === 0 || b < 100); }
    var stops = [b], cur = b;
    while (cur < a) {
      var nt = Math.ceil((cur + 1) / 10) * 10, nh = Math.ceil((cur + 1) / 100) * 100;
      if (cur % 10 && nt <= a) cur = nt;
      else if (cur % 100 && nh <= a) cur = nh;
      else if (a - cur >= 100) cur += Math.floor((a - cur) / 100) * 100;
      else if (a - cur >= 10) cur += Math.floor((a - cur) / 10) * 10;
      else cur = a;
      stops.push(cur);
    }
    var hops = stops.slice(1).map(function (s, i) { return s - stops[i]; });
    return { a: a, b: b, d: a - b, stops: stops, hops: hops };
  }
  skill('as-countup', 'Count up to subtract', 'B2.3', [
    [1, 'plain', function (lv) {
      var c = cuCase(lv), fx = {}; fx[c.a + c.b] = 'That is adding. Count up from ' + c.b + ' instead.';
      return calcQ(math(ex(c.a, '-', c.b) + ' = ?'), c.a, '-', c.b, fx, { fig: lv === 1 ? lineHops(c.b, c.hops, false) : '',
        hint: 'Count up from ' + c.b + ' to ' + c.a + '.', steps: c.hops.map(function (h, i) { return c.stops[i] + ' + ' + h + ' = ' + c.stops[i + 1] + '.'; }).concat(['Add the jumps: ' + c.hops.join(' + ') + ' = ' + c.d + '.']), explain: ex(c.a, '-', c.b) + ' = ' + c.d + '.' });
    }],
    [1, 'hops', function (lv) {
      var c = cuCase(lv), lines = c.hops.map(function (h, i) { return c.stops[i] + ' + [[]] = ' + c.stops[i + 1]; });
      return eqsQ('Count up from ' + c.b + ' to ' + c.a + '.', lines.join('<br>') + '<br>' + c.a + ' &minus; ' + c.b + ' = [[]]', c.hops.concat([c.d]), { fig: lineHops(c.b, c.hops, false),
        hint: 'Add up all the jumps at the end.', steps: ['Jumps: ' + c.hops.join(' + ') + ' = ' + c.d + '.'], explain: ex(c.a, '-', c.b) + ' = ' + c.d + '.' });
    }],
    [1, 'story', function (lv) {
      var c = cuCase(lv), who = Q.name(), t = R.pick([['The trail is', 'm long. ' + who + ' has walked', 'm. How many metres are left?'], ['A book has', 'pages. ' + who + ' has read', 'pages. How many pages are left?'], ['The arena has', 'seats. So far', 'people have come. How many seats are empty?']]);
      return calcQ(t[0] + ' ' + c.a + ' ' + t[1] + ' ' + c.b + ' ' + t[2], c.a, '-', c.b, {}, { hint: 'Count up from ' + c.b + '.', steps: ['Jumps: ' + c.hops.join(' + ') + ' = ' + c.d + '.'], explain: c.d + ' left.' });
    }],
    [2, 'check', function (lv) {
      var c = cuCase(lv);
      return eqsQ('Find the missing number.', c.b + ' + [[]] = ' + c.a, [c.d], { hint: 'Count up from ' + c.b + ' to ' + c.a + '.', steps: ['Jumps: ' + c.hops.join(' + ') + ' = ' + c.d + '.'], explain: c.b + ' + ' + c.d + ' = ' + c.a + '.' });
    }],
    [2, 'tf', function (lv) {
      var c = cuCase(lv), who = Q.name(), truth = coin(), said = truth ? c.d : c.d + R.pick([10, -10, 100]);
      return calcTF(who, c.a, '-', c.b, said, 'Counting up: ' + c.hops.join(' + ') + ' = ' + c.d + '.', ['Count up only to the next ten.', 'Count the stops, not the jumps.', 'Subtracting always gives a hundred.'], 'Count up from ' + c.b + ' and add the jumps.', { hint: 'Check: does ' + c.b + ' + ' + said + ' make ' + c.a + '?' });
    }]
  ]);
  function tgCountup(lv) {
    return function () {
      var c = cuCase(lv), steps = c.hops.map(function (h, i) { var t = c.stops[i + 1]; return { prompt: i === 0 ? 'Count up to ' + t + '.' : 'Then up to ' + t + '.', q: missQ(c.stops[i] + ' + ? = ' + t, c.stops[i], t) }; });
      steps.push({ prompt: 'Add the jumps.', q: num(c.hops.join(' + ') + ' = ?', c.d, {}, { hint: 'That is how far you counted.', meta: { k: 'g3as-addn', list: c.hops } }) });
      return { q: 'Work out ' + math(ex(c.a, '-', c.b)) + '. Count up from ' + c.b + '.', fig: lineHops(c.b, c.hops, true), done: ex(c.a, '-', c.b) + ' = ' + c.d + '.', steps: steps };
    };
  }

  /* ======================= Lessons 3 and 4: the written methods ======================= */
  function pw(p) { return Math.pow(10, p); }
  function len(n) { return String(n).length; }
  /* regrouping when adding: [ones make a ten, tens make a hundred] */
  function regA(a, b) { var x = dig(a), y = dig(b), c1 = x[0] + y[0] >= 10 ? 1 : 0; return [c1, x[1] + y[1] + c1 >= 10 ? 1 : 0]; }
  /* kinds: o2 = 3-digit + 2-digit, ones trade only; one = one trade; two = two trades; big = two trades, total 900 to 1000 */
  function addPick(kind) {
    for (;;) {
      var a = R.int(101, 899), b = kind === 'o2' ? R.int(11, 89) : R.int(101, 899), s = a + b, c = regA(a, b), n = c[0] + c[1];
      if (a % 10 === 0 || b % 10 === 0) continue;
      if (kind === 'big' ? s < 900 || s > 1000 || n < 2 : s > 999) continue;
      if (kind === 'o2' && !(c[0] && !c[1])) continue;
      if (kind === 'one' && n !== 1) continue;
      if (kind === 'two' && n !== 2) continue;
      return { a: a, b: b, s: s, c1: c[0], c2: c[1], x: dig(a), y: dig(b) };
    }
  }
  /* the answer when every trade is forgotten: each place keeps only its last digit */
  function noCarry(a, b) { var x = dig(a), y = dig(b), r = 0; for (var p = 0; p < 3; p++) r += (x[p] + y[p]) % 10 * pw(p); return r; }
  /* the digits on top after every trade when subtracting */
  function tops(a, b) {
    var top = dig(a), y = dig(b);
    for (var p = 0; p < 3; p++) if (top[p] < y[p]) { var q = p + 1; while (top[q] === 0) q++; top[q]--; for (var r = q - 1; r > p; r--) top[r] = 9; top[p] += 10; }
    return top;
  }
  function regS(a, b) { var x = dig(a), y = dig(b), t0 = x[0] < y[0] ? 1 : 0; return [t0, x[1] - t0 < y[1] ? 1 : 0]; }
  /* kinds: o2 = 3-digit − 2-digit, ones trade only; one = one trade; two = two trades; zero = trade across a zero, or from 1000 */
  function subPick(kind) {
    for (;;) {
      var a, b;
      if (kind === 'zero') {
        if (Math.random() < 0.3) { a = 1000; b = R.int(101, 899); }
        else { a = R.int(2, 9) * 100 + R.int(0, 8); b = R.int(101, a - 20); if (dig(b)[0] <= dig(a)[0]) continue; }
      } else { a = R.int(201, 999); b = kind === 'o2' ? R.int(11, 89) : R.int(101, a - 30); }
      if (b % 10 === 0 || a - b < 10) continue;
      var t = regS(a, b), n = t[0] + t[1];
      if (kind === 'o2' && !(t[0] && !t[1])) continue;
      if (kind === 'one' && n !== 1) continue;
      if (kind === 'two' && (n !== 2 || dig(a)[1] === 0)) continue;
      return { a: a, b: b, d: a - b, t0: t[0], t1: t[1], x: dig(a), y: dig(b), top: tops(a, b) };
    }
  }
  /* the answer when the smaller digit is taken from the bigger one in each place */
  function smallBig(a, b) { var x = dig(a), y = dig(b), r = 0; for (var p = 0; p < 3; p++) r += Math.abs(x[p] - y[p]) * pw(p); return r; }
  function sFix(c) { var f = {}; f[smallBig(c.a, c.b)] = 'You took the smaller digit from the bigger one. Trade first, then take away.'; f[c.d + 10] = 'You traded a ten. Cross out and lower the tens digit too.'; f[c.a + c.b] = 'That is adding. This one takes away.'; return f; }
  function aFix(c) { var f = {}; f[noCarry(c.a, c.b)] = 'A place made 10 or more. Trade 10 for 1 of the next place.'; f[c.s - 10] = 'Add the traded ten to the tens.'; f[c.s + 100] = 'Only trade when a place makes 10 or more.'; return f; }
  function addThings(who, a, b) { return R.pick([
    'A school library has ' + a + ' books. It gets ' + b + ' new ones. How many books now?',
    who + ' scored ' + a + ' points on Monday and ' + b + ' on Tuesday. How many points in all?',
    'A ferry carries ' + a + ' people in the morning and ' + b + ' in the afternoon. How many people in all?',
    'A maple farm fills ' + a + ' jars of syrup one week and ' + b + ' the next. How many jars in all?']); }
  function subThings(who, a, b) { return R.pick([
    'A rink has ' + a + ' seats. ' + b + ' are full. How many are empty?',
    who + '\'s school raised $' + a + '. It spent $' + b + ' on books. How many dollars are left?',
    'A trail is ' + a + ' m long. ' + who + ' has walked ' + b + ' m. How far is left?',
    'A bakery made ' + a + ' bannock buns. It sold ' + b + '. How many are left?']); }
  /* lines for "work each column": addition shows any carry */
  function addCols(c, cols) {
    var lines = [], ans = [], cy = 0;
    for (var p = 0; p < cols; p++) {
      var parts = [c.x[p], c.y[p]].concat(cy ? [1] : []), t = sum(parts);
      lines.push(PNAME[p].charAt(0).toUpperCase() + PNAME[p].slice(1) + ': ' + parts.join(' + ') + ' = [[]]'); ans.push(t); cy = t >= 10 ? 1 : 0;
    }
    return { lines: lines, ans: ans };
  }
  function subCols(c) {
    var lines = [], ans = [];
    for (var p = 0; p < len(c.b); p++) { lines.push(PNAME[p].charAt(0).toUpperCase() + PNAME[p].slice(1) + ': ' + c.top[p] + ' &minus; ' + c.y[p] + ' = [[]]'); ans.push(c.top[p] - c.y[p]); }
    return { lines: lines, ans: ans };
  }

  /* ---------- Add with blocks ---------- */
  var ABLK = { 1: 'o2', 2: 'one', 3: 'two' };
  skill('as-addblk', 'Add with blocks', 'B2.4', [
    [1, 'plain', function (lv) {
      var c = addPick(ABLK[lv]);
      return calcQ(math(ex(c.a, '+', c.b) + ' = ?'), c.a, '+', c.b, aFix(c), { fig: lv < 3 ? addFig(c.a, c.b) : '',
        hint: 'Put the cubes together first. 10 cubes make a rod.', steps: ['Ones: ' + c.x[0] + ' + ' + c.y[0] + ' = ' + (c.x[0] + c.y[0]) + '.', 'Tens and hundreds next.', ex(c.a, '+', c.b) + ' = ' + c.s + '.'], explain: ex(c.a, '+', c.b) + ' = ' + c.s + '.' });
    }],
    [1, 'trade', function (lv) {
      var c = addPick(lv === 1 ? 'o2' : 'two'), o = c.x[0] + c.y[0];
      return eqsQ('Add the cubes. Then trade 10 of them for a rod.', c.x[0] + ' + ' + c.y[0] + ' = [[]]<br>[[]] = 10 + [[]]<br>So ' + ex(c.a, '+', c.b) + ' = [[]]', [o, o, o - 10, c.s], { fig: addFig(c.a, c.b),
        hint: 'The 10 becomes 1 rod. The rest stay as cubes.', steps: [c.x[0] + ' + ' + c.y[0] + ' = ' + o + ' = 10 + ' + (o - 10) + '.', ex(c.a, '+', c.b) + ' = ' + c.s + '.'], explain: ex(c.a, '+', c.b) + ' = ' + c.s + '.' });
    }],
    [1, 'build', function (lv) {
      var c = addPick(ABLK[lv]);
      return { q: 'Build the total of ' + math(ex(c.a, '+', c.b)) + '. Trade 10 cubes for a rod.', type: 'build', tool: 'base10', answer: c.s, opts: { max: { h: 9, t: 19, o: 19 } },
        hint: 'Build ' + c.a + ', then add ' + c.b + '.', steps: ['Put both numbers in blocks.', 'Trade 10 of a kind for 1 of the next.'], explain: ex(c.a, '+', c.b) + ' = ' + c.s + '.', meta: { k: 'g3as-build', a: c.a, op: '+', b: c.b } };
    }],
    [2, 'places', function (lv) {
      var c = addPick(ABLK[lv]), H1 = c.x[2] * 100 + c.y[2] * 100, T = c.x[1] * 10 + c.y[1] * 10, O = c.x[0] + c.y[0];
      return eqsQ('Add each place. Then add the parts.', (c.x[2] * 100) + ' + ' + (c.y[2] * 100) + ' = [[]]<br>' + (c.x[1] * 10) + ' + ' + (c.y[1] * 10) + ' = [[]]<br>' + c.x[0] + ' + ' + c.y[0] + ' = [[]]<br>[[]] + [[]] + [[]] = [[]]', [H1, T, O, H1, T, O, c.s], { fig: lv < 3 ? addFig(c.a, c.b) : '',
        hint: 'Flats with flats, rods with rods, cubes with cubes.', steps: [H1 + ' + ' + T + ' + ' + O + ' = ' + c.s + '.'], explain: ex(c.a, '+', c.b) + ' = ' + c.s + '.' });
    }],
    [2, 'story', function (lv) {
      var c = addPick(ABLK[lv]);
      return calcQ(addThings(Q.name(), c.a, c.b), c.a, '+', c.b, aFix(c), { hint: 'Add with blocks in your head: ones, tens, hundreds.', steps: [ex(c.a, '+', c.b) + ' = ' + c.s + '.'], explain: c.s + '.' });
    }],
    [2, 'tf', function (lv) {
      var c = addPick(ABLK[lv]), truth = coin(), said = truth ? c.s : noCarry(c.a, c.b), who = Q.name();
      return calcTF(who, c.a, '+', c.b, said, ex(c.a, '+', c.b) + ' = ' + c.s + '. A place made 10 or more, so it was traded.', ['Each place keeps its last digit.', 'Blocks never need trading.', 'Add the digits all together.'], 'Look for a place that makes 10 or more.', { hint: 'Do the ones make 10 or more?' });
    }]
  ]);
  function tgAddblk(lv) {
    return function () {
      var c = addPick(ABLK[lv]), tens = [c.x[1], c.y[1]].concat(c.c1 ? [1] : []);
      return { q: 'Add ' + math(ex(c.a, '+', c.b)) + ' with blocks.', fig: addFig(c.a, c.b), done: ex(c.a, '+', c.b) + ' = ' + c.s + '.', steps: [
        { prompt: 'Put the cubes together.', q: stepQ('Ones: ' + c.x[0] + ' + ' + c.y[0] + ' = ?', c.x[0], '+', c.y[0], c.c1 ? '10 of them make a new rod.' : 'Count the cubes.') },
        { prompt: c.c1 ? 'Now the rods, with the new one.' : 'Now the rods.', q: addnQ('Rods: ' + tens.join(' + ') + ' = ?', tens) },
        { prompt: 'The total.', q: stepQ(ex(c.a, '+', c.b) + ' = ?', c.a, '+', c.b, c.c2 ? '10 rods make a new flat.' : 'Flats, rods, then cubes.') }
      ] };
    };
  }

  /* ---------- Add in columns ---------- */
  var ACOL = { 1: 'one', 2: 'two', 3: 'big' };
  skill('as-addcol', 'Add in columns', 'B2.5', [
    [1, 'plain', function (lv) {
      var c = addPick(ACOL[lv]);
      return calcQ(math(ex(c.a, '+', c.b) + ' = ?'), c.a, '+', c.b, aFix(c), { fig: lv < 3 ? colFig(c.a, c.b, '+', 0) : '',
        hint: 'Start with the ones. Carry 1 when a column makes 10 or more.', steps: addCols(c, 3).ans.map(function (t, p) { return PNAME[p] + ': ' + t + '.'; }).concat([ex(c.a, '+', c.b) + ' = ' + c.s + '.']), explain: ex(c.a, '+', c.b) + ' = ' + c.s + '.' });
    }],
    [1, 'colstep', function (lv) {
      var c = addPick(ACOL[lv]), o = c.x[0] + c.y[0];
      return fill('Start with the ones of ' + math(ex(c.a, '+', c.b)) + '.', 'Ones: ' + c.x[0] + ' + ' + c.y[0] + ' = [[]]<br>Write [[]] in the ones. Carry [[]] to the tens.', [o, o % 10, Math.floor(o / 10)], { fig: colFig(c.a, c.b, '+', 0),
        hint: 'A 2-digit total: write the ones, carry the ten.', steps: [c.x[0] + ' + ' + c.y[0] + ' = ' + o + '.'], explain: o >= 10 ? 'Write ' + (o % 10) + ', carry 1.' : 'Write ' + o + ', carry 0.', meta: { k: 'g3as-colstep', a: c.a, b: c.b } });
    }],
    [1, 'digit', function (lv) {
      var c = addPick(ACOL[lv]), p = R.int(1, 2), d = dig(c.s)[p];
      return num('Add in columns. What digit goes in the <b>' + PNAME[p] + '</b> of the answer?', d, {}, { fig: colFig(c.a, c.b, '+', p),
        hint: 'Remember any carry above the ' + PNAME[p] + '.', steps: [ex(c.a, '+', c.b) + ' = ' + c.s + '.'], explain: 'The ' + PNAME[p] + ' digit of ' + c.s + ' is ' + d + '.', meta: { k: 'g3as-digit', a: c.a, op: '+', b: c.b, p: p } });
    }],
    [2, 'row', function (lv) {
      var l = [addPick(ACOL[lv]), addPick(ACOL[lv])].map(function (c) { return [c.a, '+', c.b]; });
      return rowQ('Add in columns.', l, { hint: 'Ones, tens, then hundreds.', steps: l.map(function (x) { return ex(x[0], '+', x[2]) + ' = ' + (x[0] + x[2]) + '.'; }), explain: 'Both done.' });
    }],
    [2, 'story', function (lv) {
      var c = addPick(ACOL[lv]);
      return calcQ(addThings(Q.name(), c.a, c.b), c.a, '+', c.b, aFix(c), { hint: 'Line up the places.', steps: [ex(c.a, '+', c.b) + ' = ' + c.s + '.'], explain: c.s + '.' });
    }],
    [2, 'tf', function (lv) {
      var c = addPick(ACOL[lv]), truth = coin(), said = truth ? c.s : R.pick([noCarry(c.a, c.b), c.s - 10]), who = Q.name();
      return calcTF(who, c.a, '+', c.b, said, ex(c.a, '+', c.b) + ' = ' + c.s + '. Every carry is counted.', ['Carries can be left out.', 'Start with the hundreds.', 'Write both digits of a column.'], 'Add it in columns yourself. Count every carry.', { fig: colFig(c.a, c.b, '+', 0), hint: 'Check each carry.' });
    }]
  ]);
  function tgAddcol(lv) {
    return function () {
      var c = addPick(ACOL[lv]), cy = 0, steps = [];
      for (var p = 0; p < 3; p++) {
        var parts = [c.x[p], c.y[p]].concat(cy ? [1] : []), t = sum(parts);
        steps.push({ prompt: ['Ones first.', 'Tens, with any carry.', 'Hundreds.'][p], q: addnQ(PNAME[p].charAt(0).toUpperCase() + PNAME[p].slice(1) + ': ' + parts.join(' + ') + ' = ?', parts, t >= 10 ? 'Write ' + (t % 10) + ' and carry 1.' : '') });
        if (p) steps[p].q.fig = colFig(c.a, c.b, '+', p);
        cy = t >= 10 ? 1 : 0;
      }
      return { q: 'Add ' + math(ex(c.a, '+', c.b)) + ' in columns.', fig: colFig(c.a, c.b, '+', 0), done: ex(c.a, '+', c.b) + ' = ' + c.s + '.', steps: steps };
    };
  }

  /* ---------- Subtract with blocks ---------- */
  var SBLK = { 1: 'o2', 2: 'one', 3: 'two' };
  function tradeQ(n, p, x) {
    var d = dig(n), ans = p === 0 ? [d[2], d[1] - 1, d[0] + 10] : [d[2] - 1, d[1] + 10, d[0]];
    return fill('Break 1 ' + (p === 0 ? 'ten into 10 ones.' : 'hundred into 10 tens.'), n + ' = [[]] hundreds, [[]] tens and [[]] ones', ans, put({ fig: blk(n),
      hint: p === 0 ? 'One rod less, 10 cubes more.' : 'One flat less, 10 rods more.', steps: [n + ' = ' + ans[0] + ' hundreds, ' + ans[1] + ' tens and ' + ans[2] + ' ones.'], explain: 'Still ' + n + '.', meta: { k: 'g3as-trade', n: n, p: p } }, x || {}));
  }
  skill('as-subblk', 'Subtract with blocks', 'B2.4', [
    [1, 'plain', function (lv) {
      var c = subPick(SBLK[lv]);
      return calcQ(math(ex(c.a, '-', c.b) + ' = ?'), c.a, '-', c.b, sFix(c), { fig: lv < 3 ? blk(c.a) : '',
        hint: 'Not enough cubes? Break a rod into 10 cubes.', steps: ['Trade where a place is short.', ex(c.a, '-', c.b) + ' = ' + c.d + '.'], explain: ex(c.a, '-', c.b) + ' = ' + c.d + '.' });
    }],
    [1, 'trade', function (lv) {
      var p = lv === 1 ? 0 : R.int(0, 1), n;
      do { n = R.int(201, 989); } while (dig(n)[p + 1] === 0);
      return tradeQ(n, p);
    }],
    [1, 'build', function (lv) {
      var c = subPick(SBLK[lv]);
      return { q: 'Build ' + c.a + '. Take away ' + c.b + '. Leave what is left.', type: 'build', tool: 'base10', answer: c.d, opts: { max: { h: 9, t: 19, o: 19 } },
        hint: 'Break a rod or a flat when you need more.', steps: ['Build ' + c.a + '.', 'Take away ' + c.b + '. ' + c.d + ' is left.'], explain: ex(c.a, '-', c.b) + ' = ' + c.d + '.', meta: { k: 'g3as-build', a: c.a, op: '-', b: c.b } };
    }],
    [2, 'cols', function (lv) {
      var c = subPick(SBLK[lv]), s = subCols(c);
      return eqsQ('Trade first. Then take away each place.', s.lines.join('<br>') + '<br>So ' + ex(c.a, '-', c.b) + ' = [[]]', s.ans.concat([c.d]), { fig: blk(c.a),
        hint: 'The top digits already show the trades.', steps: [ex(c.a, '-', c.b) + ' = ' + c.d + '.'], explain: ex(c.a, '-', c.b) + ' = ' + c.d + '.' });
    }],
    [2, 'story', function (lv) {
      var c = subPick(SBLK[lv]);
      return calcQ(subThings(Q.name(), c.a, c.b), c.a, '-', c.b, sFix(c), { hint: 'Take away. Trade when a place is short.', steps: [ex(c.a, '-', c.b) + ' = ' + c.d + '.'], explain: c.d + '.' });
    }],
    [2, 'tf', function (lv) {
      var c = subPick(SBLK[lv]), truth = coin(), said = truth ? c.d : smallBig(c.a, c.b), who = Q.name();
      return calcTF(who, c.a, '-', c.b, said, ex(c.a, '-', c.b) + ' = ' + c.d + '. A short place needs a trade.', ['Take the smaller digit from the bigger one.', 'Never break a rod.', 'Swap the numbers when the top is small.'], 'Trade when the top digit is too small.', { hint: 'Is there enough in each place of ' + c.a + '?' });
    }]
  ]);
  function tgSubblk(lv) {
    return function () {
      var c = subPick(SBLK[lv]), p = c.t0 ? 0 : 1;
      return { q: 'Take ' + c.b + ' away from ' + c.a + ' with blocks.', fig: blk(c.a), done: ex(c.a, '-', c.b) + ' = ' + c.d + '.', steps: [
        { prompt: p === 0 ? 'Too few cubes. Break a rod.' : 'Too few rods. Break a flat.', q: tradeQ(c.a, p) },
        { prompt: 'Take away the cubes.', q: stepQ('Ones: ' + c.top[0] + ' &minus; ' + c.y[0] + ' = ?', c.top[0], '-', c.y[0]) },
        { prompt: 'Finish.', q: stepQ(ex(c.a, '-', c.b) + ' = ?', c.a, '-', c.b, c.t0 && c.t1 ? 'Break a flat for the tens too.' : 'Tens, then hundreds.', sFix(c)) }
      ] };
    };
  }

  /* ---------- Subtract in columns ---------- */
  var SCOL = { 1: 'one', 2: 'two', 3: 'zero' };
  skill('as-subcol', 'Subtract in columns', 'B2.5', [
    [1, 'plain', function (lv) {
      var c = subPick(SCOL[lv]);
      return calcQ(math(ex(c.a, '-', c.b) + ' = ?'), c.a, '-', c.b, sFix(c), { fig: lv < 3 ? colFig(c.a, c.b, '-', 0) : '',
        hint: 'Start with the ones. Top too small? Trade from the next column.', steps: subCols(c).ans.map(function (t, p) { return PNAME[p] + ': ' + c.top[p] + ' &minus; ' + c.y[p] + ' = ' + t + '.'; }), explain: ex(c.a, '-', c.b) + ' = ' + c.d + '.' });
    }],
    [1, 'check', function (lv) {
      var c = subPick(SCOL[lv]);
      return eqsQ('Subtract. Then add to check.', ex(c.a, '-', c.b) + ' = [[]]<br>Check: [[]] + ' + c.b + ' = [[]]', [c.d, c.d, c.a], { fig: colFig(c.a, c.b, '-', 0),
        hint: 'Your answer plus ' + c.b + ' must make ' + c.a + '.', steps: [ex(c.a, '-', c.b) + ' = ' + c.d + '.', c.d + ' + ' + c.b + ' = ' + c.a + '.'], explain: 'It checks: ' + c.d + ' + ' + c.b + ' = ' + c.a + '.' });
    }],
    [1, 'digit', function (lv) {
      var c = subPick(SCOL[lv]), p = R.int(0, 1), d = dig(c.d)[p];
      return num('Subtract in columns. What digit goes in the <b>' + PNAME[p] + '</b> of the answer?', d, {}, { fig: colFig(c.a, c.b, '-', p),
        hint: 'Cross out and trade first if the top digit is too small.', steps: [ex(c.a, '-', c.b) + ' = ' + c.d + '.'], explain: 'The ' + PNAME[p] + ' digit of ' + c.d + ' is ' + d + '.', meta: { k: 'g3as-digit', a: c.a, op: '-', b: c.b, p: p } });
    }],
    [2, 'row', function (lv) {
      var l = [subPick(SCOL[lv]), subPick(SCOL[lv])].map(function (c) { return [c.a, '-', c.b]; });
      return rowQ('Subtract in columns.', l, { hint: 'Trade when the top digit is too small.', steps: l.map(function (x) { return ex(x[0], '-', x[2]) + ' = ' + (x[0] - x[2]) + '.'; }), explain: 'Both done.' });
    }],
    [2, 'story', function (lv) {
      var c = subPick(SCOL[lv]);
      return calcQ(subThings(Q.name(), c.a, c.b), c.a, '-', c.b, sFix(c), { hint: 'Line up the places. Start with the ones.', steps: [ex(c.a, '-', c.b) + ' = ' + c.d + '.'], explain: c.d + '.' });
    }],
    [2, 'tf', function (lv) {
      var c = subPick(SCOL[lv]), truth = coin(), said = truth ? c.d : R.pick([smallBig(c.a, c.b), c.d + 10]), who = Q.name();
      return calcTF(who, c.a, '-', c.b, said, ex(c.a, '-', c.b) + ' = ' + c.d + '. ' + c.d + ' + ' + c.b + ' = ' + c.a + '.', ['Take the smaller digit from the bigger one.', 'The top digit stays the same after a trade.', 'Start with the hundreds.'], 'Add to check: the answer plus ' + c.b + ' must make ' + c.a + '.', { fig: colFig(c.a, c.b, '-', 0), hint: 'Check by adding.' });
    }]
  ]);
  function tgSubcol(lv) {
    return function () {
      var c = subPick(SCOL[lv]), steps = [];
      for (var p = 0; p < len(c.b); p++) {
        var st = { prompt: ['Ones first. Trade if the top is too small.', 'Tens.', 'Hundreds.'][p], q: stepQ(PNAME[p].charAt(0).toUpperCase() + PNAME[p].slice(1) + ': ' + c.top[p] + ' &minus; ' + c.y[p] + ' = ?', c.top[p], '-', c.y[p], c.top[p] !== c.x[p] ? 'After the trade the top is ' + c.top[p] + '.' : '') };
        if (p) st.q.fig = colFig(c.a, c.b, '-', p);
        steps.push(st);
      }
      return { q: 'Subtract ' + math(ex(c.a, '-', c.b)) + ' in columns.', fig: colFig(c.a, c.b, '-', 0), done: ex(c.a, '-', c.b) + ' = ' + c.d + '.', steps: steps };
    };
  }

  /* ======================= Lesson 5: Estimate and check ======================= */
  function estCase(lv) {
    for (;;) {
      var op = lv === 1 ? '+' : coin() ? '+' : '-', p = lv === 3 ? 10 : 100, a = R.int(110, 890), b = R.int(110, 890);
      if (op === '-' && a < b) { var t = a; a = b; b = t; }
      if (lv < 3 && [a, b].some(function (n) { var td = dig(n)[1]; return td === 4 || td === 5; })) continue;
      var ra = roundTo(a, p), rb = roundTo(b, p), e = calc(ra, op, rb), s = calc(a, op, b);
      if (op === '+' && (s > 999 || e > 1000)) continue;
      if (op === '-' && (e <= 0 || s < 20)) continue;
      if (a % 10 === 0 || b % 10 === 0 || ra === rb) continue;
      return { a: a, b: b, op: op, p: p, ra: ra, rb: rb, e: e, s: s };
    }
  }
  function nearest(p) { return 'the nearest ' + (p === 10 ? 'ten' : 'hundred'); }
  skill('as-est', 'Estimate first', 'B2.3', [
    [1, 'plain', function (lv) {
      var c = estCase(lv), fx = {}; fx[c.s] = 'That is the exact answer. Round first, then ' + (c.op === '+' ? 'add.' : 'subtract.');
      return num('Estimate ' + math(ex(c.a, c.op, c.b)) + '. Round each number to ' + nearest(c.p) + ' first.', c.e, fx, { fig: lv < 3 ? lineHops(c.ra, [c.op === '+' ? c.rb : -c.rb], true) : '',
        hint: c.a + ' is about ' + c.ra + '.', steps: [c.a + ' rounds to ' + c.ra + '. ' + c.b + ' rounds to ' + c.rb + '.', ex(c.ra, c.op, c.rb) + ' = ' + c.e + '.'], explain: 'About ' + c.e + '.', meta: { k: 'g3as-est', a: c.a, op: c.op, b: c.b, p: c.p } });
    }],
    [1, 'fill', function (lv) {
      var c = estCase(lv);
      return fill('Round to ' + nearest(c.p) + '. Then estimate ' + math(ex(c.a, c.op, c.b)) + '.', c.a + ' rounds to [[]]<br>' + c.b + ' rounds to [[]]<br>Estimate: [[]]', [c.ra, c.rb, c.e], {
        hint: 'Round, then ' + (c.op === '+' ? 'add' : 'subtract') + ' the round numbers.', steps: [ex(c.ra, c.op, c.rb) + ' = ' + c.e + '.'], explain: 'About ' + c.e + '.', meta: { k: 'g3as-estfill', a: c.a, op: c.op, b: c.b, p: c.p } });
    }],
    [2, 'mc', function (lv) {
      var c = estCase(lv), d = c.p, w = [c.e + d, c.e - d, c.e + 2 * d, c.e - 2 * d].filter(function (v) { return v > 0 && v <= 1000; });
      return mc('Which is the best estimate for ' + math(ex(c.a, c.op, c.b)) + '?', String(c.e), w.map(function (v) { return [String(v), 'Round each number to ' + nearest(c.p) + ' first.']; }), {
        hint: 'Round both numbers to ' + nearest(c.p) + '.', steps: [ex(c.ra, c.op, c.rb) + ' = ' + c.e + '.'], explain: 'About ' + c.e + '.', meta: { k: 'g3as-estmc', a: c.a, op: c.op, b: c.b, p: c.p } });
    }],
    [2, 'story', function (lv) {
      var c = estCase(lv), who = Q.name();
      var q = c.op === '+' ? 'A museum had ' + c.a + ' visitors on Saturday and ' + c.b + ' on Sunday. About how many in all? Round to ' + nearest(c.p) + '.' : who + ' needs ' + c.a + ' beads for a project and has ' + c.b + '. About how many more are needed? Round to ' + nearest(c.p) + '.';
      return num(q, c.e, {}, { hint: 'Round each number first.', steps: [c.ra + ' ' + sg(c.op) + ' ' + c.rb + ' = ' + c.e + '.'], explain: 'About ' + c.e + '.', meta: { k: 'g3as-est', a: c.a, op: c.op, b: c.b, p: c.p } });
    }],
    [2, 'tf', function (lv) {
      var c = estCase(lv), truth = coin(), said = truth ? c.s : c.s + R.pick([100, -100, 200]), who = Q.name();
      if (said <= 0) said = c.s + 100;
      return calcTF(who, c.a, c.op, c.b, said, 'The estimate is ' + c.e + '. ' + c.s + ' is close to it.', ['Any answer near 1000 is fine.', 'Estimates are always exact.', 'Only the ones matter.'], 'Estimate first: about ' + c.e + '. Is ' + said + ' close?', { hint: 'Estimate first.' });
    }]
  ]);
  function tgEst(lv) {
    return function () {
      var c = estCase(lv);
      return { q: 'Estimate ' + math(ex(c.a, c.op, c.b)) + '. Round to ' + nearest(c.p) + '.', fig: lineHops(c.ra, [c.op === '+' ? c.rb : -c.rb], true), done: 'Estimate ' + c.e + '. Exact ' + c.s + ': close.', steps: [
        { prompt: 'Round the first number.', q: num(c.a + ' rounds to ?', c.ra, {}, { hint: 'Which ' + (c.p === 10 ? 'ten' : 'hundred') + ' is closer?', meta: { k: 'g3as-rnd', n: c.a, p: c.p } }) },
        { prompt: 'Then the second.', q: num(c.b + ' rounds to ?', c.rb, {}, { hint: 'Look at the next digit to the right.', meta: { k: 'g3as-rnd', n: c.b, p: c.p } }) },
        { prompt: 'Estimate.', q: stepQ(ex(c.ra, c.op, c.rb) + ' = ?', c.ra, c.op, c.rb) }
      ] };
    };
  }

  /* ---------- Check your answer ---------- */
  var CHK = { 1: 'one', 2: 'two', 3: 'zero' };
  function chkEx(c) { var o = c.op === '-'; return { a: c.a, b: c.b, op: c.op, r: o ? c.d : c.s }; }
  function chkCase(lv) { return coin() ? put(subPick(CHK[lv]), { op: '-' }) : put(addPick(lv === 3 ? 'big' : CHK[lv]), { op: '+' }); }
  skill('as-check', 'Check your answer', 'B2.3', [
    [1, 'plain', function (lv) {
      var c = subPick(CHK[lv]);
      return eqsQ('Subtract. Then check by adding.', ex(c.a, '-', c.b) + ' = [[]]<br>[[]] + ' + c.b + ' = [[]]', [c.d, c.d, c.a], { fig: lv < 3 ? bond(c.a, c.b, null) : '',
        hint: 'Adding back must give ' + c.a + '.', steps: [ex(c.a, '-', c.b) + ' = ' + c.d + '.', c.d + ' + ' + c.b + ' = ' + c.a + '.'], explain: 'It checks.' });
    }],
    [1, 'inverse', function (lv) {
      var c = subPick(CHK[lv]);
      return mc('Which addition checks ' + math(ex(c.a, '-', c.b) + ' = ' + c.d) + '?', math(c.d + ' + ' + c.b + ' = ' + c.a), [
        [math(c.a + ' + ' + c.b + ' = ' + (c.a + c.b)), 'Add the answer to the number taken away.'],
        [math(c.d + ' + ' + c.a + ' = ' + (c.d + c.a)), 'Add the answer to ' + c.b + ', not to ' + c.a + '.'],
        [math(c.b + ' + ' + c.b + ' = ' + (2 * c.b)), 'Use the answer, ' + c.d + '.']], {
        hint: 'Answer + the part taken away = the start.', steps: [c.d + ' + ' + c.b + ' = ' + c.a + '.'], explain: c.d + ' + ' + c.b + ' = ' + c.a + '.', meta: { k: 'g3as-invmc', a: c.a, b: c.b, d: c.d } });
    }],
    [1, 'fix', function (lv) {
      var c = subPick(CHK[lv]), bad = R.pick([smallBig(c.a, c.b), c.d + 10]), who = Q.name();
      if (bad === c.d) bad = c.d + 10;
      return calcQ(who + ' wrote ' + math(ex(c.a, '-', c.b) + ' = ' + bad) + '. The check gives ' + math(bad + ' + ' + c.b + ' = ' + (bad + c.b)) + ', not ' + c.a + '. What is the right answer?', c.a, '-', c.b, sFix(c), {
        hint: 'Work ' + ex(c.a, '-', c.b) + ' again, in columns.', steps: [ex(c.a, '-', c.b) + ' = ' + c.d + '.', 'Check: ' + c.d + ' + ' + c.b + ' = ' + c.a + '.'], explain: c.d + '.' });
    }],
    [2, 'estex', function (lv) {
      var c = estCase(lv === 3 ? 2 : lv);
      return fill('Estimate first. Then work it out.', 'Estimate: [[]]<br>' + ex(c.a, c.op, c.b) + ' = [[]]', [c.e, c.s], {
        hint: 'Round to ' + nearest(c.p) + ' for the estimate.', steps: ['Estimate: ' + ex(c.ra, c.op, c.rb) + ' = ' + c.e + '.', 'Exact: ' + c.s + '. Close, so it makes sense.'], explain: 'About ' + c.e + '; exactly ' + c.s + '.', meta: { k: 'g3as-estex', a: c.a, op: c.op, b: c.b, p: c.p } });
    }],
    [2, 'tf', function (lv) {
      var c = chkCase(lv), x = chkEx(c), truth = coin(), said = truth ? x.r : x.r + R.pick([10, -10, 100]), who = Q.name();
      return calcTF(who, x.a, x.op, x.b, said, x.op === '-' ? 'Check: ' + x.r + ' + ' + x.b + ' = ' + x.a + '.' : 'Check: ' + x.r + ' &minus; ' + x.b + ' = ' + x.a + '.', ['It looks about right.', 'The last digit is right.', 'Big answers are usually right.'], 'Check with the opposite: ' + (x.op === '-' ? 'add ' : 'subtract ') + x.b + '.', { hint: 'Use the opposite to check.' });
    }]
  ]);
  function tgCheck(lv) {
    return function () {
      var c = subPick(CHK[lv]), p = 100, ra = roundTo(c.a, p), rb = roundTo(c.b, p);
      if (ra <= rb) { p = 10; ra = roundTo(c.a, p); rb = roundTo(c.b, p); }
      return { q: 'Estimate, subtract, then check: ' + math(ex(c.a, '-', c.b)) + '.', fig: colFig(c.a, c.b, '-', 0), done: ex(c.a, '-', c.b) + ' = ' + c.d + '. Close to ' + (ra - rb) + ', and it checks.', steps: [
        { prompt: 'Estimate.', q: stepQ(ex(ra, '-', rb) + ' = ?', ra, '-', rb, 'Round to ' + nearest(p) + ': ' + ra + ' and ' + rb + '.') },
        { prompt: 'Subtract.', q: stepQ(ex(c.a, '-', c.b) + ' = ?', c.a, '-', c.b, 'Use columns.', sFix(c)) },
        { prompt: 'Check.', q: stepQ(c.d + ' + ' + c.b + ' = ?', c.d, '+', c.b, 'You should get ' + c.a + ' back.') }
      ] };
    };
  }

  /* ======================= Lesson 6: Problems and equal sides ======================= */
  var KOP = { join: '+', more: '+', separate: '-', compare: '-', part: '-', change: '-' };
  function wNums(lv, op) {
    if (lv === 1) { if (op === '+') { var a = R.int(21, 79); return { a: a, b: R.int(11, 99 - a) }; } var x = R.int(40, 99); return { a: x, b: R.int(11, x - 15) }; }
    var c = op === '+' ? addPick(lv === 2 ? 'one' : 'two') : subPick(lv === 2 ? 'one' : 'two');
    return { a: c.a, b: c.b };
  }
  function wCase(lv, kinds) {
    var kind = R.pick(kinds || ['join', 'more', 'separate', 'compare', 'part', 'change']), op = KOP[kind], n = wNums(lv, op), a = n.a, b = n.b, who = Q.name(), who2;
    do { who2 = Q.name(); } while (who2 === who);
    var t = {
      join: who + ' read ' + a + ' pages in March and ' + b + ' pages in April. How many pages in all?',
      more: 'The Grade 3 class collected ' + a + ' cans. The Grade 4 class collected ' + b + ' more than that. How many did the Grade 4 class collect?',
      separate: 'A canoe club had ' + a + ' paddles. It lent out ' + b + '. How many are still at the club?',
      compare: who + ' has ' + a + ' hockey cards. ' + who2 + ' has ' + b + '. How many more does ' + who + ' have?',
      part: 'At a powwow, ' + a + ' dancers join the Grand Entry. ' + b + ' of them are jingle dress dancers. How many are other dancers?',
      change: who + ' had ' + b + ' stamps. After a trip, ' + who + ' has ' + a + '. How many new stamps did ' + who + ' get?'
    }[kind];
    return { kind: kind, op: op, a: a, b: b, r: calc(a, op, b), text: t };
  }
  var WHY = { join: 'Two amounts are put together.', more: 'One amount is that many more.', separate: 'Some are taken away.', compare: 'You find the difference.', part: 'You know the whole and one part.' };
  function barOf(c) { return c.kind === 'compare' ? barFig('compare', c.a, c.b) : c.op === '+' ? barFig('whole', c.a, c.b) : barFig('part', c.a, c.b); }
  function twoCase(lv) {
    for (;;) {
      var a = R.int(lv === 3 ? 150 : 40, lv === 3 ? 600 : 90), o1 = coin() ? '+' : '-', o2 = coin() ? '+' : '-', b = R.int(12, lv === 3 ? 240 : 40), c = R.int(12, lv === 3 ? 240 : 40), m = calc(a, o1, b), r = calc(m, o2, c);
      if (m > 0 && r > 0 && m <= 1000 && r <= 1000 && b % 10 && c % 10) return { a: a, b: b, c: c, o1: o1, o2: o2, m: m, r: r };
    }
  }
  function busTxt(t) { return 'A bus leaves with ' + t.a + ' people. At the first stop, ' + t.b + (t.o1 === '+' ? ' get on' : ' get off') + '. At the next stop, ' + t.c + (t.o2 === '+' ? ' get on' : ' get off') + '. How many people are on the bus now?'; }
  skill('as-word', 'Add or subtract?', 'B2.5', [
    [1, 'plain', function (lv) {
      var c = wCase(lv), fx = {}; fx[c.op === '+' ? Math.abs(c.a - c.b) : c.a + c.b] = c.op === '+' ? 'This story puts amounts together: add.' : 'This story finds what is left or the difference: subtract.';
      return calcQ(c.text, c.a, c.op, c.b, fx, { hint: 'Do you put together, or take apart?', steps: [ex(c.a, c.op, c.b) + ' = ' + c.r + '.'], explain: c.r + '.' });
    }],
    [1, 'fill', function (lv) {
      var c = wCase(lv);
      return fill(c.text + ' Write the number sentence.', '[[]] ' + sg(c.op) + ' [[]] = [[]]', [c.a, c.b, c.r], {
        hint: 'Use the two numbers in the story.', steps: [ex(c.a, c.op, c.b) + ' = ' + c.r + '.'], explain: ex(c.a, c.op, c.b) + ' = ' + c.r + '.', meta: { k: 'g3as-wordfill', a: c.a, op: c.op, b: c.b } });
    }],
    [2, 'bar', function (lv) {
      var c = wCase(lv, ['join', 'separate', 'compare', 'part']);
      return calcQ(c.text, c.a, c.op, c.b, {}, { fig: barOf(c), hint: 'The ? in the bars is what you find.', steps: [ex(c.a, c.op, c.b) + ' = ' + c.r + '.'], explain: c.r + '.' });
    }],
    [2, 'tf', function (lv) {
      var c = wCase(lv, ['join', 'more', 'separate', 'compare', 'part']), said = coin() ? '+' : '-';
      return tf(c.text + ' True or false: you ' + (said === '+' ? 'add' : 'subtract') + ' to solve this.', said === c.op, WHY[c.kind], ['The bigger number goes first.', 'Stories always add.', 'The word "how" means subtract.'], 'Picture the story. ' + WHY[c.kind], { hint: 'Put together, or take apart?', meta: { k: 'g3as-optf', kind: c.kind, said: said } });
    }],
    [3, 'two', function (lv) {
      var t = twoCase(lv);
      return num(busTxt(t), t.r, {}, { hint: 'One stop at a time.', steps: [ex(t.a, t.o1, t.b) + ' = ' + t.m + '.', ex(t.m, t.o2, t.c) + ' = ' + t.r + '.'], explain: t.r + ' people.', meta: { k: 'g3as-two', a: t.a, b: t.b, c: t.c, o1: t.o1, o2: t.o2 } });
    }]
  ]);
  function tgWord(lv) {
    return function () {
      var c = wCase(lv, ['join', 'separate', 'compare', 'part']);
      return { q: c.text, fig: barOf(c), done: ex(c.a, c.op, c.b) + ' = ' + c.r + '.', steps: [
        { prompt: 'Put together, or take apart?', q: fixed('Add or subtract?', ['Add', 'Subtract'], c.op === '+' ? 0 : 1, ['', ''], { hint: WHY[c.kind], meta: { k: 'g3as-op', kind: c.kind } }) },
        { prompt: 'Write it and solve.', q: fill('Fill in the number sentence.', '[[]] ' + sg(c.op) + ' [[]] = [[]]', [c.a, c.b, c.r], { hint: ex(c.a, c.op, c.b) + '.', meta: { k: 'g3as-wordfill', a: c.a, op: c.op, b: c.b } }) }
      ] };
    };
  }

  /* ---------- Equal sides ---------- */
  function eqCase(lv) {
    for (;;) {
      var u = lv === 1 ? 100 : lv === 2 ? 10 : 1, o1 = lv === 3 && coin() ? '-' : '+', o2 = lv === 3 && coin() ? '-' : '+';
      var a = R.int(lv === 1 ? 1 : 11, lv === 1 ? 6 : 60) * u, b = R.int(lv === 1 ? 1 : 11, lv === 1 ? 4 : 40) * u, c = R.int(lv === 1 ? 1 : 11, lv === 1 ? 8 : 80) * u;
      if (lv === 3) { a = R.int(151, 609); c = R.int(101, 899); }
      var L = calc(a, o1, b), d = o2 === '+' ? L - c : c - L;
      if (L <= 0 || L > 1000 || d <= 0 || c === a || c === b || d === b) continue;
      return { a: a, b: b, c: c, d: d, o1: o1, o2: o2, L: L };
    }
  }
  function eqTxt(c, blank) { return ex(c.a, c.o1, c.b) + ' = ' + c.c + ' ' + sg(c.o2) + ' ' + (blank ? blank : c.d); }
  skill('as-equal', 'Equal sides', 'C2.3', [
    [1, 'plain', function (lv) {
      var c = eqCase(lv);
      return eqsQ('Make both sides equal.', eqTxt(c, '[[]]'), [c.d], { fig: balance(ex(c.a, c.o1, c.b), c.c + ' ' + sg(c.o2) + ' ?'),
        hint: 'Work out the left side first: ' + ex(c.a, c.o1, c.b) + '.', steps: [ex(c.a, c.o1, c.b) + ' = ' + c.L + '.', ex(c.c, c.o2, c.d) + ' = ' + c.L + ' too.'], explain: plain(eqTxt(c)) + '.' });
    }],
    [1, 'story', function (lv) {
      var c = eqCase(lv === 3 ? 2 : lv), who = Q.name(), who2;
      do { who2 = Q.name(); } while (who2 === who);
      var s = c.a + c.b;
      if (c.c >= s) c.c = s - (lv === 1 ? 100 : 10);
      return num(who + ' has ' + c.a + ' red beads and ' + c.b + ' blue beads. ' + who2 + ' has ' + c.c + ' beads. How many more beads does ' + who2 + ' need to have the same number?', s - c.c, {}, { fig: balance(c.a + ' + ' + c.b, c.c + ' + ?'),
        hint: 'How many does ' + who + ' have in all?', steps: [c.a + ' + ' + c.b + ' = ' + s + '.', s + ' &minus; ' + c.c + ' = ' + (s - c.c) + '.'], explain: (s - c.c) + ' more.', meta: { k: 'g3as-eqstory', a: c.a, b: c.b, c: c.c } });
    }],
    [1, 'row', function (lv) {
      var l = [eqCase(lv), eqCase(lv), eqCase(lv)];
      return eqsQ('Make both sides equal.', l.map(function (c) { return eqTxt(c, '[[]]'); }).join('<br>'), l.map(function (c) { return c.d; }), {
        hint: 'Left side first, every time.', steps: l.map(function (c) { return plain(eqTxt(c)) + '.'; }), explain: 'All three balance.' });
    }],
    [2, 'tf', function (lv) {
      var c = eqCase(lv), truth = coin(), d = truth ? c.d : c.d + R.pick([10, 100, -10]);
      if (d <= 0) d = c.d + 10;
      return tf('True or false: ' + math(ex(c.a, c.o1, c.b) + ' = ' + ex(c.c, c.o2, d)), truth, ex(c.a, c.o1, c.b) + ' = ' + c.L + ' and ' + ex(c.c, c.o2, c.d) + ' = ' + c.L + '.', ['Both sides use big numbers.', 'The last number decides.', 'An equal sign means "the answer is next".'], 'Work out each side. Are they the same?', { fig: balance(ex(c.a, c.o1, c.b), ex(c.c, c.o2, d)), hint: 'Work out both sides.', meta: { k: 'g3as-eqtf', l: [c.a, c.o1, c.b], r: [c.c, c.o2, d] } });
    }],
    [2, 'pick', function (lv) {
      var u = lv === 3 ? 1 : 10, t = R.int(lv === 3 ? 30 : 3, lv === 3 ? 90 : 9) * (lv === 3 ? 10 : 100), opts = [], seen = {}, nRight = R.int(2, 3);
      while (opts.length < 5) {
        var ok = opts.length < nRight, x = R.int(2, Math.floor(t / u) - 2) * u, op = coin() ? '+' : '-', y, v;
        if (op === '+') { y = (ok ? t : t + R.pick([10, -10, 100])) - x; } else { x = R.int(Math.floor(t / u) + 2, Math.floor(t / u) + (lv === 3 ? 300 : 40)) * u; if (x > 999) continue; y = x - (ok ? t : t + R.pick([10, -10, 100])); }
        if (y <= 0) continue;
        v = ex(x, op, y);
        if (seen[v]) continue; seen[v] = 1; opts.push(v);
      }
      var order = R.shuffle([0, 1, 2, 3, 4]), sh = order.map(function (i) { return opts[i]; }), ans = [];
      order.forEach(function (i, j) { if (i < nRight) ans.push(j); });
      return { q: 'Pick every one that equals <b>' + t + '</b>.', type: 'pick', options: sh, answer: ans, hint: 'Work out each one.', steps: ['Each one that makes ' + t + ' balances with ' + t + '.'], explain: ans.map(function (j) { return plain(sh[j]); }).join(', ') + '.', meta: { k: 'g3as-eqpick', t: t } };
    }],
    [2, 'match', function (lv) {
      var pairs = [], seen = {};
      while (pairs.length < 3) {
        var c = eqCase(lv);
        if (seen[c.L]) continue; seen[c.L] = 1;
        pairs.push([math(ex(c.a, c.o1, c.b)), math(ex(c.c, c.o2, c.d))]);
      }
      return { q: 'Match the sides that are equal.', type: 'match', pairs: pairs, hint: 'Work out each side.', steps: ['Equal sides have the same value.'], explain: pairs.map(function (p) { return plain(p[0]) + ' = ' + plain(p[1]); }).join('; ') + '.', meta: { k: 'g3as-eqmatch' } };
    }]
  ]);
  function tgEqual(lv) {
    return function () {
      var c = eqCase(lv), find = c.o2 === '+' ? missQ(c.c + ' + ? = ' + c.L, c.c, c.L) : stepQ(c.c + ' &minus; ' + c.L + ' = ?', c.c, '-', c.L, 'Take ' + c.L + ' from ' + c.c + '.');
      return { q: 'Make it balance: ' + math(eqTxt(c, '?')), fig: balance(ex(c.a, c.o1, c.b), c.c + ' ' + sg(c.o2) + ' ?'), done: plain(eqTxt(c)) + '.', steps: [
        { prompt: 'Work out the left side.', q: stepQ(ex(c.a, c.o1, c.b) + ' = ?', c.a, c.o1, c.b) },
        { prompt: 'What makes the right side ' + c.L + '?', q: find },
        { prompt: 'Check.', q: stepQ(ex(c.c, c.o2, c.d) + ' = ?', c.c, c.o2, c.d, 'It should be ' + c.L + '.') }
      ] };
    };
  }

  /* ======================= Watch and My turn pictures ======================= */
  function tfV(s) { return tenFrames(s.a, s.b, s.made); }
  function dotV(s) { return dotRows(s.a, s.b); }
  function bondV(s) { return bond(s.w, s.p1, s.p2); }
  function colV(s) { return colFig(s.a, s.b, s.op, s.k); }
  function hopV(s) { return lineHops(s.start, s.parts, false); }
  function barV(s) { return barFig(s.kind, s.a, s.b); }
  function balV(s) { return balance(s.l, s.r); }
  function b10(extra) { return put({ max: { h: 9, t: 19, o: 19 } }, extra); }
  function three(gen) { return [gen(1), gen(2), gen(3)]; }

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'facts', title: 'Facts to 20', sub: 'Quick ways to add and subtract small numbers.', concepts: [
      { id: 'make10', title: 'Make a ten to add', exp: ['B2.3'], skill: 'as-make10',
        watch: clip(tfV, { a: 8, b: 5, made: false }, [
          ['8 and 5.'],
          ['Move 2 to fill the frame.', { made: true }],
          ['10 and 3 more: <b>13</b>.']
        ]),
        example: clip(tfV, { a: 9, b: 7, made: false }, [
          ['My turn. 9 + 7.'],
          ['Move 1: 10 and 6.', { made: true }],
          ['<b>16</b>. Not 15.']
        ]),
        together: three(tgMake10),
        mistake: '<p>Counting on by ones from the bigger number and losing count, or forgetting the ten once it is made (8 + 5 = 3). Split the second number: 5 = 2 + 3.</p>',
        check: [ck('as-make10', 'plain', 1), ck('as-make10', 'split', 1), ck('as-make10', 'next', 2), ck('as-make10', 'row', 2), ck('as-make10', 'plain', 3)] },

      { id: 'doubles', title: 'Use doubles', exp: ['B2.3'], skill: 'as-doubles',
        watch: clip(dotV, { a: 6, b: 6 }, [
          ['6 + 6 = 12.'],
          ['One more dot: 6 + 7.', { b: 7 }],
          ['12 and 1 more: <b>13</b>.']
        ]),
        example: clip(dotV, { a: 8, b: 7 }, [
          ['My turn. 8 + 7.'],
          ['7 + 7 = 14.'],
          ['1 more: <b>15</b>.']
        ]),
        together: three(tgDoubles),
        mistake: '<p>Doubling the bigger number and then adding 1 (8 + 7 as 16 + 1). Double the smaller number and add 1, or double the bigger and take 1 away.</p>',
        check: [ck('as-doubles', 'plain', 1), ck('as-doubles', 'fill', 1), ck('as-doubles', 'story', 2), ck('as-doubles', 'row', 2), ck('as-doubles', 'plain', 3)] },

      { id: 'think', title: 'Think addition to subtract', exp: ['B2.3'], skill: 'as-think',
        watch: clip(bondV, { w: 13, p1: 8, p2: null }, [
          ['13 &minus; 8 = ?'],
          ['8 + ? = 13.'],
          ['8 + 5 = 13. So <b>5</b>.', { p2: 5 }]
        ]),
        example: clip(bondV, { w: 15, p1: 9, p2: null }, [
          ['My turn. 15 &minus; 9.'],
          ['9 + 6 = 15. So <b>6</b>.', { p2: 6 }]
        ]),
        together: three(tgThink),
        mistake: '<p>Counting back by ones from 13 and miscounting, or answering with the whole (13). Ask: "8 and what make 13?"</p>',
        check: [ck('as-think', 'plain', 1), ck('as-think', 'bond', 1), ck('as-think', 'story', 2), ck('as-think', 'row', 2), ck('as-think', 'plain', 3)] },

      { id: 'mixed', title: 'One fact gives four', exp: ['B2.3'], skill: 'as-facts',
        watch: clip(bondV, { w: 14, p1: 6, p2: 8 }, [
          ['6 + 8 = 14.'],
          ['8 + 6 = 14.'],
          ['14 &minus; 6 = 8.'],
          ['14 &minus; 8 = 6.']
        ]),
        example: clip(bondV, { w: 17, p1: 9, p2: 8 }, [
          ['My turn. 9 + 8 = 17.'],
          ['So 17 &minus; 9 = 8.'],
          ['And 17 &minus; 8 = 9.']
        ]),
        together: three(tgFacts),
        mistake: '<p>Mixing up the signs in a row of mixed facts. Have your child read each sign out loud before answering. Practise a few minutes most days: speed comes from knowing, not counting.</p>',
        check: [ck('as-facts', 'plain', 1), ck('as-facts', 'row', 1), ck('as-facts', 'missing', 2), ck('as-facts', 'row', 2), ck('as-facts', 'plain', 2)] }
    ] },

    { id: 'mental', title: 'Mental math to 1000', sub: 'Work it out in your head.', concepts: [
      { id: 'tens', title: 'Count tens and hundreds like ones', exp: ['B2.3'], skill: 'as-tens',
        watch: tool('base10', b10({ h: 3 }), [
          ['3 hundreds.'],
          ['4 more hundreds.', function (t) { return t.add('h', 4, 300); }],
          ['3 + 4 = 7, so 300 + 400 = <b>700</b>.', function (t) { return t.countAll(150); }]
        ]),
        example: tool('base10', b10({ t: 8 }), [
          ['My turn. 80 + 50.'],
          ['5 more tens.', function (t) { return t.add('t', 5, 260); }],
          ['8 + 5 = 13. 13 tens = <b>130</b>.', function (t) { return t.group('t'); }]
        ]),
        together: three(tgTens),
        mistake: '<p>Writing 80 + 50 = 1 030 or 13. Say it in words: "8 tens and 5 tens make 13 tens", then 13 tens is 130.</p>',
        check: [ck('as-tens', 'plain', 1), ck('as-tens', 'fact', 1), ck('as-tens', 'line', 2), ck('as-tens', 'story', 2), ck('as-tens', 'plain', 3)] },

      { id: 'jump', title: 'Jump hundreds, then tens, then ones', exp: ['B2.3'], skill: 'as-jump',
        watch: clip(hopV, { start: 358, parts: [] }, [
          ['358 + 234.'],
          ['+200: 558.', { parts: [200] }],
          ['+30: 588.', { parts: [200, 30] }],
          ['+4: <b>592</b>.', { parts: [200, 30, 4] }]
        ]),
        example: clip(hopV, { start: 645, parts: [] }, [
          ['My turn. 645 &minus; 123.'],
          ['Back 100, back 20.', { parts: [-100, -20] }],
          ['Back 3: <b>522</b>.', { parts: [-100, -20, -3] }]
        ]),
        together: three(tgJump),
        mistake: '<p>Jumping 2 instead of 200 (treating every digit as ones). Say each jump with its place: "two hundred", "thirty", "four".</p>',
        check: [ck('as-jump', 'plain', 1), ck('as-jump', 'land', 1), ck('as-jump', 'story', 2), ck('as-jump', 'plain', 2), ck('as-jump', 'plain', 3)] },

      { id: 'friendly', title: 'Use a friendly number, then fix', exp: ['B2.3'], skill: 'as-friendly',
        watch: clip(hopV, { start: 346, parts: [] }, [
          ['346 + 99.'],
          ['Add 100: 446.', { parts: [100] }],
          ['1 too many. Back 1: <b>445</b>.', { parts: [100, -1] }]
        ]),
        example: clip(hopV, { start: 523, parts: [] }, [
          ['My turn. 523 &minus; 198.'],
          ['Take 200: 323.', { parts: [-200] }],
          ['2 too many taken. Add 2: <b>325</b>.', { parts: [-200, 2] }]
        ]),
        together: three(tgFriendly),
        mistake: '<p>Fixing the wrong way: for 523 &minus; 198, taking 2 more away instead of giving 2 back. Ask: "Did I take away too many or too few?"</p>',
        check: [ck('as-friendly', 'plain', 1), ck('as-friendly', 'fill', 1), ck('as-friendly', 'story', 2), ck('as-friendly', 'mc', 2), ck('as-friendly', 'plain', 3)] },

      { id: 'countup', title: 'Count up to subtract', exp: ['B2.3'], skill: 'as-countup',
        watch: clip(hopV, { start: 268, parts: [] }, [
          ['403 &minus; 268. Start at 268.'],
          ['+2 to 270. +30 to 300.', { parts: [2, 30] }],
          ['+100 to 400. +3 to 403.', { parts: [2, 30, 100, 3] }],
          ['2 + 30 + 100 + 3 = <b>135</b>.']
        ]),
        example: clip(hopV, { start: 263, parts: [] }, [
          ['My turn. 500 &minus; 263.'],
          ['+7, +30 to 300.', { parts: [7, 30] }],
          ['+200 to 500. 7 + 30 + 200 = <b>237</b>.', { parts: [7, 30, 200] }]
        ]),
        together: three(tgCountup),
        mistake: '<p>Giving the last stop (403) as the answer, or counting the stops instead of adding the jumps. The answer is the total of the jumps.</p>',
        check: [ck('as-countup', 'plain', 1), ck('as-countup', 'hops', 1), ck('as-countup', 'check', 2), ck('as-countup', 'story', 2), ck('as-countup', 'plain', 3)] }
    ] },

    { id: 'add', title: 'Adding 3-digit numbers', sub: 'Blocks first, then columns.', concepts: [
      { id: 'addblk', title: 'Trade 10 ones for a ten', exp: ['B2.4'], skill: 'as-addblk',
        watch: tool('base10', b10({ h: 2, t: 4, o: 7 }), [
          ['247 + 135.'],
          ['Put in 135.', function (t) { return t.add('h', 1, 300).then(function () { return t.add('t', 3, 260); }).then(function () { return t.add('o', 5, 220); }); }],
          ['12 cubes. 10 of them make a rod.', function (t) { return t.group('o'); }],
          ['3 flats, 8 rods, 2 cubes: <b>382</b>.', function (t) { return t.countAll(160); }]
        ]),
        example: tool('base10', b10({ h: 1, t: 6, o: 8 }), [
          ['My turn. 168 + 54.'],
          ['Put in 54.', function (t) { return t.add('t', 5, 260).then(function () { return t.add('o', 4, 220); }); }],
          ['12 cubes: trade 10 for a rod.', function (t) { return t.group('o'); }],
          ['12 rods: trade 10 for a flat. <b>222</b>.', function (t) { return t.group('t'); }]
        ]),
        try: { tool: 'base10', opts: b10({ controls: true, h: 2, t: 6, o: 8 }), tasks: [
          { do: 'This is 268. Add <b>1 rod and 5 cubes</b>, then group 10 cubes into a rod.', goal: function (s) { return s.value === 283 && s.o < 10; }, yes: '268 + 15 = 283.' }
        ] },
        together: three(tgAddblk),
        mistake: '<p>Writing 12 in the ones place (247 + 135 = 3712), or leaving 12 cubes without trading. Ten of one kind always becomes one of the next kind.</p>',
        check: [ck('as-addblk', 'plain', 1), ck('as-addblk', 'trade', 1), ck('as-addblk', 'build', 2), ck('as-addblk', 'places', 2), ck('as-addblk', 'plain', 3)] },

      { id: 'addcol', title: 'Add in columns, ones first', exp: ['B2.4', 'B2.5'], skill: 'as-addcol',
        watch: clip(colV, { a: 476, b: 258, op: '+', k: 0 }, [
          ['Line up the places.'],
          ['6 + 8 = 14. Write 4, carry 1.', { k: 1 }],
          ['7 + 5 + 1 = 13. Write 3, carry 1.', { k: 2 }],
          ['4 + 2 + 1 = 7. <b>734</b>.', { k: 3 }]
        ]),
        example: clip(colV, { a: 385, b: 247, op: '+', k: 0 }, [
          ['My turn. 385 + 247.'],
          ['12: write 2, carry 1.', { k: 1 }],
          ['8 + 4 + 1 = 13: write 3, carry 1.', { k: 2 }],
          ['3 + 2 + 1 = 6. <b>632</b>, not 522.', { k: 3 }]
        ]),
        together: three(tgAddcol),
        mistake: '<p>Forgetting the carried 1 (385 + 247 = 522), or starting with the hundreds. Each carried 1 is a traded ten or hundred, just like the blocks.</p>',
        check: [ck('as-addcol', 'plain', 1), ck('as-addcol', 'colstep', 1), ck('as-addcol', 'digit', 2), ck('as-addcol', 'row', 2), ck('as-addcol', 'plain', 3)] }
    ] },

    { id: 'sub', title: 'Subtracting 3-digit numbers', sub: 'Blocks first, then columns.', concepts: [
      { id: 'subblk', title: 'Break a ten when the ones run out', exp: ['B2.4'], skill: 'as-subblk',
        watch: tool('base10', b10({ h: 3, t: 5, o: 2 }), [
          ['352 &minus; 128.'],
          ['Only 2 cubes. Break a rod.', function (t) { return t.split('t'); }],
          ['12 cubes. Take 8.', function (t) { return t.remove('o', 8); }],
          ['Take 2 rods and 1 flat: <b>224</b>.', function (t) { return t.remove('t', 2).then(function () { return t.remove('h', 1); }); }]
        ]),
        example: tool('base10', b10({ h: 4, t: 0, o: 6 }), [
          ['My turn. 406 &minus; 151.'],
          ['No rods to take 5 from. Break a flat.', function (t) { return t.split('h'); }],
          ['Take 1 cube, 5 rods, 1 flat.', function (t) { return t.remove('o', 1).then(function () { return t.remove('t', 5); }).then(function () { return t.remove('h', 1); }); }],
          ['<b>255</b> left.', function (t) { return t.countAll(160); }]
        ]),
        together: three(tgSubblk),
        mistake: '<p>Taking the smaller digit from the bigger one in each place (352 &minus; 128 = 236). Build the top number, and break a rod or flat when there are not enough to take away.</p>',
        check: [ck('as-subblk', 'plain', 1), ck('as-subblk', 'trade', 1), ck('as-subblk', 'build', 2), ck('as-subblk', 'cols', 2), ck('as-subblk', 'plain', 3)] },

      { id: 'subcol', title: 'Subtract in columns, ones first', exp: ['B2.4', 'B2.5'], skill: 'as-subcol',
        watch: clip(colV, { a: 523, b: 247, op: '-', k: 0 }, [
          ['Line up the places.'],
          ['3 is less than 7: trade a ten. 13 &minus; 7 = 6.', { k: 1 }],
          ['1 is less than 4: trade a hundred. 11 &minus; 4 = 7.', { k: 2 }],
          ['4 &minus; 2 = 2. <b>276</b>.', { k: 3 }]
        ]),
        example: clip(colV, { a: 604, b: 258, op: '-', k: 0 }, [
          ['My turn. 604 &minus; 258. No tens to trade.'],
          ['Break a hundred, then a ten. 14 &minus; 8 = 6.', { k: 1 }],
          ['9 &minus; 5 = 4.', { k: 2 }],
          ['5 &minus; 2 = 3. <b>346</b>.', { k: 3 }]
        ]),
        together: three(tgSubcol),
        mistake: '<p>Crossing out to trade but not lowering the next digit, or trading across a zero wrongly (604 &minus; 258). Show the blocks: a 0 in the tens means break a hundred first.</p>',
        check: [ck('as-subcol', 'plain', 1), ck('as-subcol', 'check', 1), ck('as-subcol', 'digit', 2), ck('as-subcol', 'row', 2), ck('as-subcol', 'plain', 3)] }
    ] },

    { id: 'estimate', title: 'Estimate and check', sub: 'Is my answer about right?', concepts: [
      { id: 'est', title: 'Estimate first', exp: ['B2.3'], skill: 'as-est',
        watch: clip(hopV, { start: 300, parts: [] }, [
          ['312 + 487. About how much?'],
          ['312 is about 300. 487 is about 500.'],
          ['300 + 500 = <b>800</b>.', { parts: [500] }]
        ]),
        example: clip(hopV, { start: 700, parts: [] }, [
          ['My turn. 692 &minus; 315.'],
          ['About 700 &minus; 300.'],
          ['<b>400</b>. The exact answer, 377, is close.', { parts: [-300] }]
        ]),
        together: three(tgEst),
        mistake: '<p>Working out the exact answer and calling it an estimate, or rounding only one number. Round both numbers first; the estimate tells you what answer to expect.</p>',
        check: [ck('as-est', 'plain', 1), ck('as-est', 'fill', 1), ck('as-est', 'story', 2), ck('as-est', 'mc', 2), ck('as-est', 'plain', 3)] },

      { id: 'check', title: 'Check with the opposite', exp: ['B2.3', 'B2.5'], skill: 'as-check',
        watch: clip(colV, { a: 532, b: 278, op: '-', k: 0 }, [
          ['532 &minus; 278.'],
          ['254.', { k: 3 }],
          ['Add back: 254 + 278.', { a: 254, b: 278, op: '+', k: 0 }],
          ['<b>532</b>. It checks.', { k: 3 }]
        ]),
        example: clip(bondV, { w: 700, p1: 356, p2: 344 }, [
          ['My turn. Is 700 &minus; 356 = 344?'],
          ['344 + 356 = 700. Yes.']
        ]),
        together: three(tgCheck),
        mistake: '<p>Adding the answer to the starting number (254 + 532) to check. Add the answer to the number that was taken away; you should get the start back.</p>',
        check: [ck('as-check', 'plain', 1), ck('as-check', 'fix', 1), ck('as-check', 'estex', 2), ck('as-check', 'inverse', 2), ck('as-check', 'plain', 3)] }
    ] },

    { id: 'problems', title: 'Problems and equal sides', sub: 'Choose the operation. Balance both sides.', concepts: [
      { id: 'word', title: 'Put together, or take apart?', exp: ['B2.5'], skill: 'as-word',
        watch: clip(barV, { kind: 'whole', a: 245, b: 130 }, [
          ['245 red beads and 130 blue. How many in all?'],
          ['Parts make a whole: add.'],
          ['245 + 130 = <b>375</b>.']
        ]),
        example: clip(barV, { kind: 'compare', a: 420, b: 265 }, [
          ['My turn. 420 and 265. How many more?'],
          ['Find the gap: subtract.'],
          ['420 &minus; 265 = <b>155</b>.']
        ]),
        together: three(tgWord),
        mistake: '<p>Adding because the story says "more" ("how many more" asks for a difference). Draw the bars: if the ? is a part or a gap, subtract; if it is the whole, add.</p>',
        check: [ck('as-word', 'plain', 1), ck('as-word', 'fill', 1), ck('as-word', 'bar', 2), ck('as-word', 'tf', 2), ck('as-word', 'two', 3)] },

      { id: 'equal', title: 'Both sides have the same value', exp: ['C2.3'], skill: 'as-equal',
        watch: clip(balV, { l: '300 + 200', r: '400 + ?' }, [
          ['300 + 200 = 500.'],
          ['400 + 100 is 500 too.', { r: '400 + 100' }],
          ['It balances.']
        ]),
        example: clip(balV, { l: '250 + 150', r: '300 + ?' }, [
          ['My turn. The left is 400.'],
          ['300 + <b>100</b> = 400.', { r: '300 + 100' }]
        ]),
        together: three(tgEqual),
        mistake: '<p>Reading = as "the answer comes next" and writing 300 + 200 = 400 + 500. The = sign means both sides have the same value. Work out the left side first.</p>',
        check: [ck('as-equal', 'plain', 1), ck('as-equal', 'story', 1), ck('as-equal', 'row', 2), ck('as-equal', 'tf', 2), ck('as-equal', 'plain', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      { q: math('8 + 7 = ?'), type: 'num', answer: 15, fig: tenFrames(8, 7, false),
        hint: 'Make a ten: move 2.', explain: '10 and 5: 15.', meta: { k: 'g3as-calc', a: 8, op: '+', b: 7 } },
      { q: math('14 &minus; 6 = ?'), type: 'num', answer: 8, fig: bond(14, 6, null),
        hint: '6 + ? = 14.', explain: '6 + 8 = 14, so 8.', meta: { k: 'g3as-calc', a: 14, op: '-', b: 6 } },
      { q: math('346 + 99 = ?'), type: 'num', answer: 445,
        hint: 'Add 100, then take 1 back.', explain: '446 &minus; 1 = 445.', meta: { k: 'g3as-calc', a: 346, op: '+', b: 99 } },
      { q: math('476 + 258 = ?'), type: 'num', answer: 734, fig: colFig(476, 258, '+', 0),
        hint: 'Ones first. Carry when a column makes 10 or more.', explain: '476 + 258 = 734.', meta: { k: 'g3as-calc', a: 476, op: '+', b: 258 } },
      { q: math('604 &minus; 258 = ?'), type: 'num', answer: 346, fig: colFig(604, 258, '-', 0),
        hint: 'No tens: break a hundred first.', explain: '604 &minus; 258 = 346.', meta: { k: 'g3as-calc', a: 604, op: '-', b: 258 } },
      { q: 'Estimate ' + math('312 + 487') + '. Round each number to the nearest hundred.', type: 'num', answer: 800,
        hint: '312 is about 300.', explain: '300 + 500 = 800.', meta: { k: 'g3as-est', a: 312, op: '+', b: 487, p: 100 } },
      { q: 'What makes both sides equal? ' + math('300 + 250 = 400 + ?'), type: 'num', answer: 150, fig: balance('300 + 250', '400 + ?'),
        hint: 'The left side is 550.', explain: '400 + 150 = 550.', meta: { k: 'g3as-missing', a: 400, t: 550 } }
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  /* every skill's other shapes (docs/QUESTIONS.md); each skill keeps its first way of asking as "plain" */
  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
