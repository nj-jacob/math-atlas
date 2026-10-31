(function () {
  var A = Atlas, R = A.R;
  var SQ = '<sup>2</sup>';
  function pl(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

  /* ---------- mass and capacity drawings ---------- */
  /* kilogram blocks and 100 g blocks */
  function massBlocks(kg, h) {
    var s = '', x = 10, y = 10, rows = 0;
    for (var i = 0; i < kg; i++) {
      s += '<rect x="' + x + '" y="' + y + '" width="100" height="100" rx="10" style="fill:color-mix(in srgb,var(--strand) 30%,var(--card));stroke:var(--ink)" stroke-width="2.5"/>' +
        '<text x="' + (x + 50) + '" y="' + (y + 50) + '" text-anchor="middle" font-size="24" class="tb">1 kg</text>' +
        '<text x="' + (x + 50) + '" y="' + (y + 78) + '" text-anchor="middle" font-size="17">1000 g</text>';
      x += 110;
    }
    if (kg) { rows++; y += 112; x = 10; }
    for (var j = 0; j < h; j++) {
      s += '<rect x="' + x + '" y="' + y + '" width="54" height="54" rx="7" style="fill:color-mix(in srgb,var(--hi) 55%,var(--card));stroke:var(--ink)" stroke-width="2"/>' +
        '<text x="' + (x + 27) + '" y="' + (y + 33) + '" text-anchor="middle" font-size="17">100 g</text>';
      x += 60;
    }
    if (h) rows++;
    var H = (kg ? 112 : 0) + (h ? 66 : 0) + 10;
    if (!kg && !h) { s = '<text x="130" y="40" text-anchor="middle" font-size="18">nothing on the scale</text>'; H = 60; }
    return A.svg(Math.max(260, kg * 110 + 10, h * 60 + 10), H, s, kg + ' kilogram blocks and ' + h + ' hundred-gram blocks, ' + (kg * 1000 + h * 100) + ' grams in all');
  }
  /* a kitchen scale dial; max 1000 (labels every 100 g) or 5000 (labels every kg) */
  function dial(g, max) {
    var cx = 150, cy = 140, r = 118, s = '', big = max > 1000, lab = big ? 1000 : 100, tk = big ? 250 : 50;
    function ang(v) { return (225 - 270 * v / max) * Math.PI / 180; }
    function pt(v, rr) { var a = ang(v); return [(cx + rr * Math.cos(a)).toFixed(1), (cy - rr * Math.sin(a)).toFixed(1)]; }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 10) + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="4"/>';
    for (var v = 0; v <= max; v += tk) {
      var major = v % lab === 0, a = pt(v, r), b = pt(v, major ? r - 16 : r - 9);
      s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" style="stroke:var(--ink)" stroke-width="' + (major ? 3 : 1.5) + '"/>';
      if (major) { var t = pt(v, r - 36); s += '<text x="' + t[0] + '" y="' + (+t[1] + 6) + '" text-anchor="middle" font-size="' + (big ? 18 : 16) + '">' + (big ? v / 1000 + ' kg' : v) + '</text>'; }
    }
    var n = pt(g, r - 22);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + n[0] + '" y2="' + n[1] + '" style="stroke:var(--btn)" stroke-width="5" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + cy + '" r="8" style="fill:var(--btn)"/>';
    s += '<text x="' + cx + '" y="' + (cy + 102) + '" text-anchor="middle" font-size="17" class="tb">' + (big ? 'kilograms' : 'grams') + '</text>';
    return A.svg(300, 282, s, 'A scale dial from 0 to ' + (big ? max / 1000 + ' kilograms' : max + ' grams') + '. The needle points to ' + g + ' grams.');
  }
  /* a measuring jug holding ml millilitres (1000 mL jug, marks every 100 mL) */
  function jug(ml, step) {
    step = step || 100;
    var x0 = 70, x1 = 210, top = 30, bot = 330, s = '', H = bot - top;
    s += '<path d="M' + x1 + ' ' + (top + 40) + ' q55 10 50 80 q-5 70 -50 80" style="fill:none;stroke:var(--ink)" stroke-width="8"/>';
    s += '<rect x="' + x0 + '" y="' + (bot - H * ml / 1000) + '" width="' + (x1 - x0) + '" height="' + (H * ml / 1000) + '" style="fill:color-mix(in srgb,#3c9bd6 45%,var(--card))"/>';
    s += '<path d="M' + x0 + ' ' + (top - 12) + ' L' + x0 + ' ' + bot + ' L' + x1 + ' ' + bot + ' L' + x1 + ' ' + (top - 12) + '" style="fill:none;stroke:var(--ink)" stroke-width="4"/>';
    for (var v = 50; v <= 1000; v += 50) {
      var y = bot - H * v / 1000, major = v % step === 0;
      if (v % 100 && step === 100) { s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + 12) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="1.5"/>'; continue; }
      s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + (major ? 26 : 12)) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="' + (major ? 2.5 : 1.5) + '"/>';
      if (v % 100 === 0) s += '<text x="' + (x0 - 8) + '" y="' + (y + 6) + '" text-anchor="end" font-size="17">' + v + '</text>';
    }
    s += '<text x="' + ((x0 + x1) / 2) + '" y="' + (bot + 26) + '" text-anchor="middle" font-size="17" class="tb">mL</text>';
    return A.svg(300, 362, s, 'A measuring jug marked from 0 to 1000 millilitres. It holds ' + ml + ' millilitres.');
  }
  /* capacity benchmarks on a line from 0 to 1000 mL */
  function capLine() {
    var it = [[5, 'teaspoon', '5 mL'], [200, 'juice box', '200 mL'], [355, 'can of pop', '355 mL'], [500, 'water bottle', '500 mL'], [1000, 'milk carton', '1 L = 1000 mL']];
    var x0 = 40, x1 = 520, y = 110, s = '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="3"/>';
    it.forEach(function (d, i) {
      var x = x0 + (x1 - x0) * d[0] / 1000, up = i % 2 === 0, ty = up ? y - 58 : y + 48, anc = i === 0 ? 'start' : i === it.length - 1 ? 'end' : 'middle', tx = i === 0 ? x - 14 : i === it.length - 1 ? x + 18 : x;
      s += '<line x1="' + x + '" y1="' + (y - 10) + '" x2="' + x + '" y2="' + (y + 10) + '" style="stroke:var(--ink)" stroke-width="3"/><circle cx="' + x + '" cy="' + y + '" r="7" style="fill:var(--strand)"/>' +
        '<text x="' + tx + '" y="' + ty + '" text-anchor="' + anc + '" font-size="22" class="tb">' + d[1] + '</text><text x="' + tx + '" y="' + (ty + 26) + '" text-anchor="' + anc + '" font-size="21">' + d[2] + '</text>';
    });
    return A.svg(560, 200, s, 'Benchmarks from 0 to 1 litre: a teaspoon is 5 mL, a juice box 200 mL, a can of pop 355 mL, a water bottle 500 mL, a milk carton 1 litre or 1000 mL.');
  }
  /* 1 m = 100 cm, and 1 cm = 10 mm */
  function metre() {
    var s = '', x0 = 30, W = 500, y = 30;
    s += '<rect x="' + x0 + '" y="' + y + '" width="' + W + '" height="44" style="fill:color-mix(in srgb,var(--hi) 45%,var(--card));stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 1; i < 10; i++) s += '<line x1="' + (x0 + i * 50) + '" y1="' + y + '" x2="' + (x0 + i * 50) + '" y2="' + (y + 44) + '" style="stroke:var(--ink)" stroke-width="1.5"/>';
    for (i = 0; i <= 10; i += 2) s += '<text x="' + (x0 + i * 50) + '" y="' + (y + 68) + '" text-anchor="middle" font-size="20">' + i * 10 + '</text>';
    s += '<text x="280" y="' + (y + 92) + '" text-anchor="middle" font-size="21" class="tb">1 metre = 100 centimetres</text>';
    s += '<rect x="' + x0 + '" y="' + y + '" width="50" height="44" style="fill:color-mix(in srgb,var(--strand) 45%,transparent);stroke:var(--strand)" stroke-width="3"/>';
    var y2 = 170, zx = 130, zW = 300;
    s += '<line x1="' + x0 + '" y1="' + (y + 44) + '" x2="' + zx + '" y2="' + y2 + '" style="stroke:var(--strand)" stroke-width="2" stroke-dasharray="5 4"/><line x1="' + (x0 + 50) + '" y1="' + (y + 44) + '" x2="' + (zx + zW) + '" y2="' + y2 + '" style="stroke:var(--strand)" stroke-width="2" stroke-dasharray="5 4"/>';
    s += '<rect x="' + zx + '" y="' + y2 + '" width="' + zW + '" height="44" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="3"/>';
    for (i = 1; i < 10; i++) s += '<line x1="' + (zx + i * 30) + '" y1="' + y2 + '" x2="' + (zx + i * 30) + '" y2="' + (y2 + 44) + '" style="stroke:var(--ink)" stroke-width="1.5"/>';
    for (i = 0; i <= 10; i += 2) s += '<text x="' + (zx + i * 30) + '" y="' + (y2 + 66) + '" text-anchor="middle" font-size="20">' + i + '</text>';
    s += '<text x="280" y="' + (y2 + 92) + '" text-anchor="middle" font-size="21" class="tb">10 centimetres = 100 millimetres</text>';
    return A.svg(560, 290, s, 'A metre stick split into 10 parts of 10 centimetres. One part is zoomed in: 10 centimetres split into 10 centimetres, each 10 millimetres.');
  }

  /* ---------- time ---------- */
  function hm(t) { var h = Math.floor(t / 60) % 24, m = t % 60; return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m; }
  function fixDots(q) { var f = function (x) { return typeof x === 'string' ? x.replace(/\.m\.\./g, '.m.') : x; }; ['q', 'explain', 'hint'].forEach(function (k) { q[k] = f(q[k]); }); if (q.steps) q.steps = q.steps.map(f); if (q.options) q.options = q.options.map(f); return q; }
  function fmtT(t) { return hm(t) + ' ' + (Math.floor(t / 60) % 24 < 12 ? 'a.m.' : 'p.m.'); }
  function dur(m) { var h = Math.floor(m / 60), r = m % 60; return h ? pl(h, 'hour') + (r ? ' ' + pl(r, 'minute') : '') : pl(r, 'minute'); }
  function clock(t, cap) {
    var cx = 90, cy = 90, r = 76, s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="4"/>';
    for (var i = 1; i <= 12; i++) {
      var a = (90 - i * 30) * Math.PI / 180;
      s += '<text x="' + (cx + 58 * Math.cos(a)).toFixed(1) + '" y="' + (cy - 58 * Math.sin(a) + 6).toFixed(1) + '" text-anchor="middle" font-size="20">' + i + '</text>';
    }
    for (i = 0; i < 60; i++) { var b = (90 - i * 6) * Math.PI / 180, r1 = i % 5 ? 71 : 67; s += '<line x1="' + (cx + r1 * Math.cos(b)).toFixed(1) + '" y1="' + (cy - r1 * Math.sin(b)).toFixed(1) + '" x2="' + (cx + 75 * Math.cos(b)).toFixed(1) + '" y2="' + (cy - 75 * Math.sin(b)).toFixed(1) + '" style="stroke:var(--ink)" stroke-width="' + (i % 5 ? 1 : 2) + '"/>'; }
    var m = t % 60, h = (t / 60) % 12, am = (90 - m * 6) * Math.PI / 180, ah = (90 - h * 30) * Math.PI / 180;
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 38 * Math.cos(ah)).toFixed(1) + '" y2="' + (cy - 38 * Math.sin(ah)).toFixed(1) + '" style="stroke:var(--ink)" stroke-width="7" stroke-linecap="round"/>';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 58 * Math.cos(am)).toFixed(1) + '" y2="' + (cy - 58 * Math.sin(am)).toFixed(1) + '" style="stroke:var(--btn)" stroke-width="4" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + cy + '" r="5" style="fill:var(--ink)"/>';
    if (cap) s += '<text x="' + cx + '" y="196" text-anchor="middle" font-size="18" class="tb">' + cap + '</text>';
    return A.svg(180, cap ? 206 : 180, s, (cap ? cap + ': ' : '') + 'a clock showing ' + fmtT(t));
  }
  function clocks(a, b) { return '<div class="vrow">' + '<figure>' + clock(a, 'Start ' + hm(a)) + '</figure><figure>' + clock(b, 'End ' + hm(b)) + '</figure></div>'; }
  /* jumps from a to b: to the next hour, whole hours, then minutes */
  function jumps(a, b) {
    var out = [], t = a;
    if (t % 60 && b >= t - t % 60 + 60) { out.push([t, t - t % 60 + 60]); t = t - t % 60 + 60; }
    if (b - t >= 60) { var hh = Math.floor((b - t) / 60) * 60; out.push([t, t + hh]); t += hh; }
    if (b > t) out.push([t, b]);
    return out;
  }
  function timeLine(a, b) {
    var J = jumps(a, b), x0 = 36, x1 = 424, n = J.length, s = '', y = 110, xs = [x0];
    var tot = b - a, ws = J.map(function (j) { return Math.max(100, (x1 - x0) * (j[1] - j[0]) / tot); }), k = (x1 - x0) / ws.reduce(function (p, q) { return p + q; }, 0);
    ws.forEach(function (w) { xs.push(xs[xs.length - 1] + w * k); });
    s += '<line x1="' + (x0 - 14) + '" y1="' + y + '" x2="' + (x1 + 14) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="3"/>';
    J.forEach(function (j, i) {
      var p = xs[i], q = xs[i + 1], m = (p + q) / 2, top = y - Math.min(66, (q - p) * 0.45);
      s += '<path d="M' + (p + 4) + ' ' + (y - 4) + ' Q' + m + ' ' + (2 * top - y) + ' ' + (q - 4) + ' ' + (y - 4) + '" style="fill:none;stroke:var(--strand)" stroke-width="3"/>' +
        '<polygon points="' + (q - 4) + ',' + (y - 4) + ' ' + (q - 15) + ',' + (y - 13) + ' ' + (q - 9) + ',' + (y - 1) + '" style="fill:var(--strand)"/>' +
        '<text x="' + m + '" y="' + (top - 8) + '" text-anchor="middle" font-size="22" class="tb" style="fill:var(--strand)">+' + (j[1] - j[0] >= 60 ? (j[1] - j[0]) / 60 + ' h' : (j[1] - j[0]) + ' min') + '</text>';
    });
    xs.forEach(function (x, i) {
      var t = i ? J[i - 1][1] : a;
      s += '<line x1="' + x + '" y1="' + (y - 10) + '" x2="' + x + '" y2="' + (y + 10) + '" style="stroke:var(--ink)" stroke-width="3"/><text x="' + x + '" y="' + (y + 36) + '" text-anchor="middle" font-size="22">' + hm(t) + '</text>';
    });
    return A.svg(460, 160, s, 'A time line from ' + fmtT(a) + ' to ' + fmtT(b) + ' with jumps of ' + J.map(function (j) { return dur(j[1] - j[0]); }).join(', then ') + '.');
  }
  function timeSteps(a, b) {
    var J = jumps(a, b);
    return [ 'Start at ' + fmtT(a) + '. ' + (a % 60 ? 'Jump to the next hour first.' : 'Count the jumps.'),
      J.map(function (j) { return hm(j[0]) + ' to ' + hm(j[1]) + ' is ' + dur(j[1] - j[0]); }).join('. ') + '.<div class="fig">' + timeLine(a, b) + '</div>',
      'Add the jumps: ' + dur(b - a) + (b - a >= 60 ? ' (' + (b - a) + ' minutes)' : '') + '.'];
  }

  /* ---------- area ---------- */
  function areaPic(l, w, o) {
    o = o || {};
    var u = Math.min(42, 440 / l, 250 / w), x0 = 40, y0 = o.area ? 52 : 20, W = l * u, H = w * u, s = '', un = o.unit || 'cm';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--ink)" stroke-width="3"/>';
    if (o.grid) for (var r = 0; r < w; r++) for (var c = 0; c < l; c++) {
      var fill = o.rows && r % 2 === 0 ? 'color-mix(in srgb,var(--strand) 34%,var(--card))' : o.rows ? 'color-mix(in srgb,var(--hi) 40%,var(--card))' : 'transparent';
      if (o.partial && !(r === 0 || c === 0)) fill = 'transparent';
      s += '<rect x="' + (x0 + c * u) + '" y="' + (y0 + r * u) + '" width="' + u + '" height="' + u + '" style="fill:' + fill + ';stroke:var(--ink)" stroke-width="1" stroke-opacity="' + (o.partial && !(r === 0 || c === 0) ? 0.25 : 0.8) + '"/>';
    }
    s += '<text x="' + (x0 + W / 2) + '" y="' + (y0 + H + 28) + '" text-anchor="middle" font-size="19" class="tb">' + (o.unknown === 'l' ? '?' : l + ' ' + un) + '</text>';
    s += '<text x="' + (x0 + W + 10) + '" y="' + (y0 + H / 2 + 7) + '" font-size="19" class="tb">' + (o.unknown === 'w' ? '?' : w + ' ' + un) + '</text>';
    if (o.area) s += '<text x="' + x0 + '" y="32" font-size="19" class="tb" style="fill:var(--strand)">Area = ' + o.area + ' ' + un + '²</text>';
    return A.svg(Math.max(300, x0 + W + 90), y0 + H + 44, s, 'A rectangle ' + (o.unknown === 'l' ? 'with an unknown length' : l + ' ' + un + ' long') + ' and ' + (o.unknown === 'w' ? 'an unknown width' : w + ' ' + un + ' wide') + (o.area ? ', area ' + o.area + ' square ' + un : '') + (o.grid ? ', split into unit squares' : '') + '.');
  }

  /* ---------- benchmarks and units ---------- */
  var MASS = [['a paper clip', 1, 'g'], ['a pencil', 5, 'g'], ['an apple', 150, 'g'], ['a dictionary', 1, 'kg'], ['a pet cat', 4, 'kg'], ['a bicycle', 12, 'kg'], ['a Grade 4 student', 30, 'kg']];
  var CAP = [['a teaspoon of medicine', 5, 'mL'], ['a juice box', 200, 'mL'], ['a water bottle', 500, 'mL'], ['a bag of milk', 4, 'L'], ['a pail of water', 10, 'L'], ['a full bathtub', 150, 'L']];
  var MEAS = [
    ['the length of a pencil', 'cm', 'ruler', 'L'], ['the width of a fingernail', 'mm', 'ruler', 'L'], ['the length of a classroom', 'm', 'measuring tape', 'L'], ['the distance from Toronto to Ottawa', 'km', 'map with a scale', 'L'],
    ['the mass of a strawberry', 'g', 'kitchen scale', 'M'], ['the mass of a large dog', 'kg', 'bathroom scale', 'M'],
    ['one dose of cough medicine', 'mL', 'medicine cup', 'C'], ['the water in a bathtub', 'L', 'pail marked in litres', 'C']];
  function estQ(list, units) {
    var it = R.pick(list), right = A.fmt(it[1]) + ' ' + it[2], other = units[0] === it[2] ? units[1] : units[0];
    var o = R.mc(right, [A.fmt(it[1]) + ' ' + other, A.fmt(it[1] * 10) + ' ' + it[2], A.fmt(it[1] * 100) + ' ' + it[2], A.fmt(it[1] * 1000) + ' ' + it[2]]);
    return { q: 'Which is the best estimate for ' + (list === MASS ? 'the mass of ' : 'the amount in ') + it[0] + '?', type: 'mc', options: o.options, answer: o.answer,
      hint: 'Use benchmarks. ' + (list === MASS ? 'A paper clip is about 1 g. A dictionary is about 1 kg.' : 'A teaspoon is about 5 mL. A milk carton is 1 L.'),
      steps: ['Think of a benchmark you know.', 'Check the unit: is it small (' + units[0] + ') or large (' + units[1] + ')?', it[0].charAt(0).toUpperCase() + it[0].slice(1) + ' is about ' + right + '.'], explain: 'About ' + right + '.' };
  }

  var gen = {
    mass: function (lv) {
      if (lv === 3) {
        if (R.int(0, 1)) return estQ(MASS, ['g', 'kg']);
        var k = R.int(1, 4), g = k * 1000 + R.pick([-100, 100, -50, 200]), big = Math.max(k * 1000, g);
        var o = R.mc(k + ' kg', [A.fmt(g) + ' g', 'They are the same']);
        if (g > k * 1000) o = R.mc(A.fmt(g) + ' g', [k + ' kg', 'They are the same']);
        return { q: 'Which is heavier: ' + k + ' kg or ' + A.fmt(g) + ' g?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Change kilograms to grams first. 1 kg = 1000 g.', steps: [k + ' kg = ' + k + ' &times; 1000 g = ' + A.fmt(k * 1000) + ' g.', 'Compare ' + A.fmt(k * 1000) + ' g and ' + A.fmt(g) + ' g.', A.fmt(big) + ' g is more.'], explain: (g > k * 1000 ? A.fmt(g) + ' g' : k + ' kg') + ' is heavier, because ' + k + ' kg = ' + A.fmt(k * 1000) + ' g.' };
      }
      if (R.int(0, 2) === 0) {
        var gg = lv === 1 ? R.int(1, 9) * 100 : R.int(1, 19) * 50;
        return { q: 'What mass does the scale show?', type: 'num', answer: gg, unit: 'g', fig: dial(gg, 1000),
          hint: 'The big numbers go up by 100. Each small mark between them is 50.', steps: ['Find the big number just before the needle.', gg % 100 ? 'The needle is one small mark past ' + (gg - 50) + ', so add 50.' : 'The needle points right at a big number.', 'The scale shows ' + gg + ' g.'], explain: 'The needle points to ' + gg + ' g.' };
      }
      var kg = R.int(1, 9);
      if (lv === 1) return { q: 'How many grams are in ' + kg + ' kg?', type: 'num', answer: kg * 1000, unit: 'g', fig: kg <= 5 ? massBlocks(kg, 0) : '',
        hint: '1 kg = 1000 g.', steps: ['Each kilogram is 1000 grams.', kg + ' &times; 1000 = ' + A.fmt(kg * 1000) + '.'], explain: kg + ' kg = ' + A.fmt(kg * 1000) + ' g.' };
      if (R.int(0, 1)) {
        var h = R.int(1, 9), k2 = R.int(1, 5);
        return { q: k2 + ' kg ' + h * 100 + ' g = how many grams?', type: 'num', answer: k2 * 1000 + h * 100, unit: 'g', fig: massBlocks(k2, h),
          hint: 'Change the kilograms to grams, then add the extra grams.', steps: [k2 + ' kg = ' + A.fmt(k2 * 1000) + ' g.', A.fmt(k2 * 1000) + ' + ' + h * 100 + ' = ' + A.fmt(k2 * 1000 + h * 100) + '.'], explain: k2 + ' kg ' + h * 100 + ' g = ' + A.fmt(k2 * 1000 + h * 100) + ' g.' };
      }
      return { q: A.fmt(kg * 1000) + ' g = how many kilograms?', type: 'num', answer: kg, unit: 'kg',
        hint: 'Every 1000 g makes 1 kg. How many thousands are there?', steps: ['1000 g = 1 kg.', A.fmt(kg * 1000) + ' is ' + kg + ' thousands.', 'So it is ' + kg + ' kg.'], explain: A.fmt(kg * 1000) + ' g = ' + kg + ' kg.' };
    },
    cap: function (lv) {
      if (lv === 3) {
        if (R.int(0, 1)) return estQ(CAP, ['mL', 'L']);
        var c = R.pick([100, 200, 250, 500]);
        return { q: 'A cup holds ' + c + ' mL. How many cups fill a 1 L jug?', type: 'num', answer: 1000 / c, unit: 'cups', fig: jug(c),
          hint: '1 L = 1000 mL. How many ' + c + 's make 1000?', steps: ['1 L = 1000 mL.', 'Count by ' + c + 's to 1000: ' + Array.apply(null, Array(1000 / c)).map(function (_, i) { return (i + 1) * c; }).join(', ') + '.', 'That is ' + 1000 / c + ' cups.'], explain: 1000 / c + ' &times; ' + c + ' mL = 1000 mL = 1 L.' };
      }
      if (R.int(0, 1)) {
        var ml = lv === 1 ? R.int(1, 9) * 100 : R.int(1, 19) * 50;
        return { q: 'How much water is in the jug?', type: 'num', answer: ml, unit: 'mL', fig: jug(ml),
          hint: 'The numbers go up by 100. A short mark is halfway: 50 more.', steps: ['Look at the top of the water.', ml % 100 ? 'It is at the short mark between ' + (ml - 50) + ' and ' + (ml + 50) + '.' : 'It is right at the ' + ml + ' mark.', 'The jug holds ' + ml + ' mL.'], explain: 'The water is at ' + ml + ' mL.' };
      }
      var L = R.int(1, 9);
      if (lv === 1) return { q: 'How many millilitres are in ' + L + ' L?', type: 'num', answer: L * 1000, unit: 'mL',
        hint: '1 L = 1000 mL.', steps: ['Each litre is 1000 mL.', L + ' &times; 1000 = ' + A.fmt(L * 1000) + '.'], explain: L + ' L = ' + A.fmt(L * 1000) + ' mL.' };
      var m2 = R.int(1, 9) * 100;
      return { q: 'A jug holds 1 L. You pour in ' + m2 + ' mL. How many more millilitres will fill it?', type: 'num', answer: 1000 - m2, unit: 'mL', fig: jug(m2),
        hint: '1 L = 1000 mL. What goes with ' + m2 + ' to make 1000?', steps: ['1 L = 1000 mL.', 'Count up from ' + m2 + ' to 1000: that is ' + (1000 - m2) + '.'], explain: m2 + ' + ' + (1000 - m2) + ' = 1000 mL.' };
    },
    unit: function (lv) {
      var it = R.pick(MEAS);
      if (lv === 1) {
        var pool = it[3] === 'L' ? ['mm', 'cm', 'm', 'km'] : it[3] === 'M' ? ['g', 'kg', 'mL', 'm'] : ['mL', 'L', 'g', 'cm'];
        var o = R.mc(it[1], pool.filter(function (u) { return u !== it[1]; }));
        return { q: 'Which unit is best for measuring ' + it[0] + '?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Is it a length, a mass or an amount of liquid? Is it small or large?', steps: [it[3] === 'L' ? 'This is a length.' : it[3] === 'M' ? 'This is a mass (how heavy).' : 'This is a capacity (how much liquid).', 'Pick a unit that fits the size, so the number is not huge or tiny.', 'The best unit is ' + it[1] + '.'], explain: 'Use ' + it[1] + '.' };
      }
      if (lv === 2) {
        var F = R.pick([['centimetres', 'metre', 100, 'm', 'cm'], ['millimetres', 'centimetre', 10, 'cm', 'mm'], ['metres', 'kilometre', 1000, 'km', 'm'], ['millimetres', 'metre', 1000, 'm', 'mm']]), n = R.int(1, 6);
        return { q: n + ' ' + F[3] + ' = how many ' + F[0] + '?', type: 'num', answer: n * F[2], unit: F[4],
          hint: 'There are ' + F[2] + ' ' + F[0] + ' in 1 ' + F[1] + '.', steps: ['1 ' + F[3] + ' = ' + F[2] + ' ' + F[4] + '.', n + ' &times; ' + F[2] + ' = ' + A.fmt(n * F[2]) + '.'], explain: n + ' ' + F[3] + ' = ' + A.fmt(n * F[2]) + ' ' + F[4] + '.' };
      }
      var others = R.shuffle(MEAS.filter(function (m) { return m[3] !== it[3]; })).map(function (m) { return m[2]; });
      var o3 = R.mc(it[2], others);
      return { q: 'Which tool would you use to measure ' + it[0] + '?', type: 'mc', options: o3.options, answer: o3.answer,
        hint: 'First decide: length, mass, or liquid? Then pick a tool for that.', steps: [it[3] === 'L' ? 'This is a length.' : it[3] === 'M' ? 'This is a mass.' : 'This is a capacity.', 'Use a ' + it[2] + ', measuring in ' + it[1] + '.'], explain: 'A ' + it[2] + ', in ' + it[1] + '.' };
    },
    time: function (lv) { return fixDots(gen.timeX(lv)); },
    timeX: function (lv) {
      var a, b;
      if (lv === 1) {
        if (R.int(0, 2) === 0) {
          var U = R.pick([['minutes', 'hour', 60], ['hours', 'day', 24], ['days', 'week', 7], ['seconds', 'minute', 60]]), n = R.int(2, 4);
          return { q: 'How many ' + U[0] + ' are in ' + n + ' ' + U[1] + 's?', type: 'num', answer: n * U[2], unit: U[0],
            hint: '1 ' + U[1] + ' = ' + U[2] + ' ' + U[0] + '.', steps: ['1 ' + U[1] + ' = ' + U[2] + ' ' + U[0] + '.', n + ' &times; ' + U[2] + ' = ' + n * U[2] + '.'], explain: n + ' ' + U[1] + 's = ' + n * U[2] + ' ' + U[0] + '.' };
        }
        a = R.int(7, 16) * 60; b = a + R.int(2, 11) * 5;
      } else if (lv === 2) {
        a = R.int(7, 16) * 60 + R.int(5, 11) * 5; b = a - a % 60 + 60 + R.int(1, 10) * 5;
      } else {
        a = R.int(8, 15) * 60 + R.int(1, 11) * 5; b = a + R.int(65, 170);
        b -= b % 5;
        if ((b - a) % 60 === 0) b += 15;
        if (R.int(0, 1)) {
          var d = b - a, right = fmtT(b), o = R.mc(right, [fmtT(b + 10), fmtT(b - 60), fmtT(b + 60), fmtT(b - 10)]);
          return { q: 'A soccer practice starts at ' + fmtT(a) + ' and lasts ' + dur(d) + '. When does it end?', type: 'mc', options: o.options, answer: o.answer, fig: clock(a, 'Start ' + hm(a)),
            hint: 'Add the hours first, then the minutes. Watch for passing a new hour.', steps: ['Start at ' + fmtT(a) + '.', 'Add ' + pl(Math.floor(d / 60), 'hour') + ': ' + fmtT(a + Math.floor(d / 60) * 60) + '.', 'Add ' + pl(d % 60, 'minute') + ': ' + fmtT(b) + '.<div class="fig">' + timeLine(a, b) + '</div>'], explain: 'It ends at ' + fmtT(b) + '.' };
        }
        var right3 = dur(b - a), o3 = R.mc(right3, [dur(b - a + 10), dur(b - a - 10), dur(b - a + 60), dur(b - a - 60 > 0 ? b - a - 60 : b - a + 20)]);
        return { q: 'A trip goes from ' + fmtT(a) + ' to ' + fmtT(b) + '. How long is the trip?', type: 'mc', options: o3.options, answer: o3.answer, fig: clocks(a, b),
          hint: 'Use a time line: jump to the next hour, then whole hours, then the minutes left.', steps: timeSteps(a, b), explain: 'The trip takes ' + right3 + '.' };
      }
      return { q: 'A ' + R.pick(['class', 'baking job', 'board game', 'swim lesson']) + ' goes from ' + fmtT(a) + ' to ' + fmtT(b) + '. How many minutes is that?', type: 'num', answer: b - a, unit: 'min', fig: clocks(a, b),
        hint: lv === 1 ? 'Count the minutes from :00 to :' + (b % 60 < 10 ? '0' : '') + b % 60 + '.' : 'Jump to the next hour first, then count the minutes after it.', steps: timeSteps(a, b), explain: 'It takes ' + (b - a) + ' minutes.' };
    },
    area: function (lv) {
      var un = R.pick(['cm', 'm']);
      if (lv === 1) {
        var l = R.int(2, 7), w = R.int(2, 5);
        return { q: 'Each small square is 1 ' + un + SQ + '. What is the area of the rectangle?', type: 'num', answer: l * w, unit: un + SQ, fig: areaPic(l, w, { grid: true, rows: true, unit: un }),
          hint: 'Count one row. Then count how many rows. Multiply.', steps: ['Each row has ' + l + ' squares.', 'There are ' + w + ' rows.', w + ' &times; ' + l + ' = ' + l * w + ' squares, so ' + l * w + ' ' + un + SQ + '.'], explain: 'Area = ' + l + ' &times; ' + w + ' = ' + l * w + ' ' + un + SQ + '.' };
      }
      var L = R.int(3, lv === 2 ? 10 : 15), W = R.int(2, 9);
      if (lv === 2) return { q: 'What is the area of this rectangle?', type: 'num', answer: L * W, unit: un + SQ, fig: areaPic(L, W, { unit: un }),
        hint: 'Area = length &times; width.', steps: ['Think of rows: ' + W + ' rows of ' + L + ' squares.', 'Area = ' + L + ' &times; ' + W + ' = ' + L * W + ' ' + un + SQ + '.'], explain: L + ' &times; ' + W + ' = ' + L * W + ' ' + un + SQ + '.' };
      var thing = R.pick([['A garden', 'm'], ['A poster', 'cm'], ['A patio', 'm'], ['A photo', 'cm']]);
      return { q: thing[0] + ' is ' + L + ' ' + thing[1] + ' long and ' + W + ' ' + thing[1] + ' wide. What is its area?', type: 'num', answer: L * W, unit: thing[1] + SQ, fig: areaPic(L, W, { unit: thing[1], grid: true }),
        hint: 'Area = length &times; width. Do not add the sides.', steps: ['Area = length &times; width.', L + ' &times; ' + W + ' = ' + L * W + '.', 'The area is ' + L * W + ' ' + thing[1] + SQ + '.'], explain: L + ' &times; ' + W + ' = ' + L * W + ' ' + thing[1] + SQ + '.' };
    },
    side: function (lv) {
      var w = R.int(2, lv === 1 ? 5 : 9), l = R.int(2, lv === 1 ? 6 : 10), un = R.pick(['cm', 'm']), A2 = l * w;
      if (lv === 3) {
        var th = R.pick(['rug', 'garden', 'sandbox', 'mural']);
        return { q: 'A ' + th + ' has an area of ' + A2 + ' m' + SQ + '. It is ' + w + ' m wide. How long is it?', type: 'num', answer: l, unit: 'm', fig: areaPic(l, w, { unit: 'm', unknown: 'l', area: A2 }),
          hint: 'What times ' + w + ' makes ' + A2 + '? You can divide: ' + A2 + ' &divide; ' + w + '.', steps: ['Area = length &times; width, so ? &times; ' + w + ' = ' + A2 + '.', A2 + ' &divide; ' + w + ' = ' + l + '.', 'Check: ' + l + ' &times; ' + w + ' = ' + A2 + '.'], explain: 'It is ' + l + ' m long, because ' + l + ' &times; ' + w + ' = ' + A2 + '.' };
      }
      return { q: 'The area is ' + A2 + ' ' + un + SQ + '. One side is ' + w + ' ' + un + '. What is the missing side?', type: 'num', answer: l, unit: un, fig: areaPic(l, w, { unit: un, unknown: 'l', area: lv === 1 ? 0 : A2, grid: lv === 1, partial: lv === 1 }),
        hint: lv === 1 ? 'There are ' + w + ' rows. How many squares in each row make ' + A2 + '?' : 'Divide the area by the side you know: ' + A2 + ' &divide; ' + w + '.', steps: ['? &times; ' + w + ' = ' + A2 + '.', 'Think: ' + w + ' &times; what = ' + A2 + '? ' + w + ' &times; ' + l + ' = ' + A2 + '.', 'The missing side is ' + l + ' ' + un + '.'], explain: A2 + ' &divide; ' + w + ' = ' + l + ' ' + un + '.' };
    }
  };

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  function fmtMin(v) { return fmtT(v); }

  var LESSONS = [
    { id: 'mass-cap', title: 'Mass and capacity', sub: 'Grams and kilograms, millilitres and litres.', concepts: [
      { id: 'grams-kg', title: 'Grams and kilograms', exp: ['E2.1'], skill: 'me4-mass',
        body: '<p><b>Mass</b> is how heavy something is. Light things are measured in <b>grams (g)</b>, heavy things in <b>kilograms (kg)</b>. <b>1 kg = 1000 g.</b></p>',
        watch: K.watch([
          ['A paper clip is about 1 gram. A dictionary is about 1 kilogram.', massBlocks(1, 0), 1800],
          ['Ten 100 g blocks balance 1 kg: 10 &times; 100 = 1000.', massBlocks(1, 0) + massBlocks(0, 10), 2200],
          ['2 kg and 300 g is 2000 + 300 = <b>2300 g</b>.', massBlocks(2, 3), 2200]
        ]),
        try: K.lab({ controls: [{ id: 'k', label: 'Kilogram blocks', min: 0, max: 4, value: 0 }, { id: 'h', label: '100 g blocks', min: 0, max: 10, value: 0 }],
          render: function (s) { s.g = s.k * 1000 + s.h * 100; return { fig: massBlocks(s.k, s.h), out: '<p class="big">' + A.fmt(s.g) + ' g</p>' }; },
          tasks: [
            { do: 'Put <b>2300 g</b> on the scale.', goal: function (s) { return s.g === 2300; }, yes: '2 kg and 300 g.' },
            { do: 'Make exactly <b>1 kg</b> with no kilogram blocks.', goal: function (s) { return s.k === 0 && s.h === 10; }, yes: '10 &times; 100 g = 1000 g = 1 kg.' }
          ] }),
        example: K.watch([
          ['My turn. I will change 3 kg 400 g into grams. Here are 3 kilogram blocks and 4 blocks of 100 g.', massBlocks(3, 4), 2000],
          ['1 kg = 1000 g. So 3 kg is 3 &times; 1000 = 3000 g.', massBlocks(3, 4), 2000],
          ['4 blocks of 100 g make 400 g.', massBlocks(3, 4), 1600],
          ['I add: 3000 + 400 = <b>3400 g</b>.', massBlocks(3, 4), 2000]
        ]),
        key: '<p><b>1 kg = 1000 g.</b></p>',
        mistake: '<p>Thinking 1 kg = 100 g. Ask: "How many 100 g blocks balance a kilogram?"</p>',
        check: [T('mass', 1), T('mass', 2), T('mass', 3)] },

      { id: 'read-scale', title: 'Read a scale', exp: ['E2.1'], skill: 'me4-mass',
        body: '<p>Find the numbered mark <b>just before</b> the needle, then count the small marks after it. On this scale each small mark is <b>50 g</b>.</p>',
        watch: K.watch([[300, 'The needle is on 300: <b>300 g</b>.'], [350, 'Halfway past 300, on the small mark: <b>350 g</b>.'], [650, 'One small mark past 600: <b>650 g</b>.']].map(function (p) { return [p[1], dial(p[0], 1000), 2000]; })),
        try: K.lab({ controls: [{ id: 'g', label: 'Mass', min: 0, max: 1000, step: 50, value: 100, fmt: function (v) { return v + ' g'; } }],
          render: function (s) { return { fig: dial(s.g, 1000), out: '' }; },
          tasks: [
            { do: 'Make the scale show <b>750 g</b>.', goal: function (s) { return s.g === 750; }, yes: '750 g: halfway between 700 and 800.' },
            { do: 'Make it show <b>half a kilogram</b>.', goal: function (s) { return s.g === 500; }, yes: 'Half of 1000 g is 500 g.' }
          ] }),
        example: K.watch([
          ['My turn. I will read this scale. First I find the numbered mark just before the needle: 400.', dial(450, 1000), 2200],
          ['Each small mark is 50 g. The needle is on the first small mark after 400.', dial(450, 1000), 2000],
          ['400 + 50 = <b>450 g</b>.', dial(450, 1000), 1800]
        ]),
        key: '<p><b>Numbered mark before the needle, then count on.</b></p>',
        check: [T('mass', 2), T('mass', 2)] },

      { id: 'litres', title: 'Litres and millilitres', exp: ['E2.1'], skill: 'me4-cap',
        body: '<p><b>Capacity</b> is how much a container holds. A teaspoon is about 5 mL. A milk carton is 1 L. <b>1 L = 1000 mL.</b></p>',
        watch: K.watch([
          ['From a teaspoon to a milk carton.', capLine(), 2400],
          ['A jug with 250 mL.', jug(250, 100), 1600],
          ['Fill it to the top line: 1000 mL = <b>1 L</b>.', jug(1000, 100), 2000]
        ]),
        try: K.lab({ controls: [{ id: 'm', label: 'Water', min: 0, max: 1000, step: 50, value: 200, fmt: function (v) { return v + ' mL'; } }],
          render: function (s) { return { fig: jug(s.m, 100), out: '<p>' + s.m + ' mL. ' + (s.m < 1000 ? (1000 - s.m) + ' mL more fills 1 L.' : 'Full: 1 L.') + '</p>' }; },
          tasks: [
            { do: 'Pour <b>750 mL</b>.', goal: function (s) { return s.m === 750; }, yes: '750 mL. 250 mL more makes 1 L.' },
            { do: 'Fill the jug to <b>1 L</b>.', goal: function (s) { return s.m === 1000; }, yes: '1000 mL = 1 L.' }
          ] }),
        example: K.watch([
          ['My turn. How much more water will make 1 L? I read the jug: the water is at the 600 line, so it holds 600 mL.', jug(600, 100), 2400],
          ['1 L = 1000 mL. I count up from 600 to 1000.', jug(600, 100), 1800],
          ['600 + 400 = 1000. I need <b>400 mL</b> more.', jug(1000, 100), 2200]
        ]),
        key: '<p><b>1 L = 1000 mL.</b></p>',
        check: [T('cap', 1), T('cap', 2), T('cap', 3)] },

      { id: 'units', title: 'Choose the unit and the tool', exp: ['E2.2'], skill: 'me4-unit', hard: true,
        body: '<p>First ask: <b>length, mass or capacity?</b> Then: <b>small or large?</b> That tells you the unit and the tool.</p>',
        watch: K.watch([
          ['Length: mm, cm, m, km. 1 m = 100 cm, 1 cm = 10 mm.', metre(), 2600],
          ['Capacity: mL for small amounts, L for big ones.', capLine(), 2200]
        ]),
        ways: [
          { label: 'A table to keep', html: '<div class="tbl"><table><thead><tr><th>What</th><th>Small</th><th>Large</th><th>Tool</th></tr></thead><tbody><tr><td>Length</td><td>mm, cm</td><td>m, km</td><td>ruler, tape</td></tr><tr><td>Mass</td><td>g</td><td>kg</td><td>scale</td></tr><tr><td>Capacity</td><td>mL</td><td>L</td><td>measuring cup or jug</td></tr></tbody></table></div>' },
          { label: 'Body benchmarks', html: '<p>A fingernail is about <b>1 cm</b> wide. A big step is about <b>1 m</b>. A paper clip is about <b>1 g</b>. A full water bottle is about <b>500 mL</b>.</p>' }
        ],
        example: K.watch([
          ['My turn. Which unit should I use for the mass of a watermelon? First I ask: length, mass or capacity?', '<p class="math big">length &nbsp; mass &nbsp; capacity</p>', 2000],
          ['"How heavy" means <b>mass</b>. Mass is measured in grams or kilograms.', '<p class="math big"><b>mass</b>: g or kg?</p>', 2000],
          ['Next I ask: small or large? A watermelon is about as heavy as 4 dictionaries. That is large.', massBlocks(4, 0), 2200],
          ['What kind? Mass. How big? Large. So I use <b>kilograms</b>, on a scale.', massBlocks(4, 0), 2200]
        ]),
        key: '<p><b>What kind? How big?</b> Then pick the unit.</p>',
        mistake: '<p>Using a length unit for mass ("the cat is 4 m"), or a huge unit for a small thing. Ask: "Are we measuring how long, how heavy, or how much it holds?"</p>',
        check: [T('unit', 1), T('unit', 2), T('unit', 3)] }
    ] },

    { id: 'time', title: 'Time', sub: 'Units of time and elapsed time.', concepts: [
      { id: 'time-units', title: 'Units of time', exp: ['E2.3'], skill: 'me4-time',
        body: '<p>60 seconds = 1 minute. <b>60 minutes = 1 hour.</b> 24 hours = 1 day. 7 days = 1 week.</p>',
        watch: K.watch([
          ['The minute hand goes all the way round: 60 minutes.', clock(9 * 60, '9:00'), 1600],
          ['One full turn later: 1 hour has passed.', clock(10 * 60, '10:00'), 1800],
          ['A quarter turn: 15 minutes. A half turn: 30 minutes.', clock(10 * 60 + 30, '10:30'), 2000]
        ]),
        try: { tool: 'clock', opts: { t: 9 * 60 + 30 }, tasks: [
          { do: 'Move the clock on by <b>1 hour</b>.', goal: function (s) { return s.elapsed === 60; }, yes: 'The minute hand went all the way round once: 60 minutes.' },
          { do: 'From 9:30, move the clock to <b>11:15 a.m.</b>', goal: function (s) { return s.h === 11 && s.m === 15; }, yes: '1 hour 45 minutes later.' }
        ] },
        example: K.watch([
          ['My turn. How many minutes are in 2 hours? I start at 2:00.', clock(2 * 60, '2:00'), 1600],
          ['The minute hand goes all the way round once: 60 minutes. Now it is 3:00.', clock(3 * 60, '3:00'), 1800],
          ['Once more round: another 60 minutes. Now it is 4:00.', clock(4 * 60, '4:00'), 1800],
          ['60 + 60 = <b>120 minutes</b>. There are 60 minutes in an hour, not 100.', clock(4 * 60, '4:00'), 2200]
        ]),
        key: '<p><b>60 minutes in an hour</b>, not 100.</p>',
        check: [T('time', 1), T('time', 1)] },

      { id: 'elapsed', title: 'How long did it take?', exp: ['E2.3'], skill: 'me4-time', hard: true,
        body: '<p>To find elapsed time, use a <b>time line</b>. Jump to the next hour, then whole hours, then the minutes that are left. Add the jumps.</p>',
        watch: K.watch([
          ['Start 9:40, end 11:15.', clocks(9 * 60 + 40, 11 * 60 + 15), 1800],
          ['Jump 20 min to 10:00, 1 hour to 11:00, 15 min to 11:15.', timeLine(9 * 60 + 40, 11 * 60 + 15), 2600],
          ['20 + 60 + 15 = 95 minutes = <b>1 hour 35 minutes</b>.', timeLine(9 * 60 + 40, 11 * 60 + 15), 2200]
        ]),
        try: K.lab({ controls: [{ id: 'a', label: 'Start', min: 480, max: 900, step: 5, value: 585, fmt: fmtMin }, { id: 'd', label: 'Lasts', min: 5, max: 180, step: 5, value: 50, fmt: dur }],
          render: function (s) { s.b = s.a + s.d; return { fig: clocks(s.a, s.b) + timeLine(s.a, s.b), out: '<p>' + fmtT(s.a) + ' to <b>' + fmtT(s.b) + '</b>: ' + dur(s.d) + '</p>' }; },
          tasks: [
            { do: 'A swim lesson starts at <b>9:45 a.m.</b> and lasts <b>50 minutes</b>. Show it.', goal: function (s) { return s.a === 585 && s.d === 50; }, yes: 'It ends at 10:35 a.m.' },
            { do: 'Make an activity that starts at 10:40 a.m. and ends at exactly <b>12:00 noon</b>.', goal: function (s) { return s.a === 640 && s.b === 720; }, yes: '1 hour 20 minutes.' }
          ] }),
        ways: [
          { label: 'Count on the clock', html: '<p>Start at 9:40. Move the minute hand to 10:00 (20 min). One full turn to 11:00 (1 hour). Then to 11:15 (15 min).</p>' },
          { label: 'Hours, then minutes', html: '<p>9:40 to 10:40 is 1 hour. 10:40 to 11:15 is 35 minutes (20 to 11:00, then 15). Total: <b>1 hour 35 minutes</b>.</p>' }
        ],
        example: K.watch([
          ['My turn. A movie starts at 1:50 and ends at 4:25. How long is it?', clocks(13 * 60 + 50, 16 * 60 + 25), 1800],
          ['First I jump to the next hour: 1:50 to 2:00 is 10 minutes.', timeLine(13 * 60 + 50, 16 * 60 + 25), 2000],
          ['Then whole hours: 2:00 to 4:00 is 2 hours. Then the minutes left: 4:00 to 4:25 is 25 minutes.', timeLine(13 * 60 + 50, 16 * 60 + 25), 2600],
          ['I add the jumps: 10 minutes + 2 hours + 25 minutes = <b>2 hours 35 minutes</b>.', timeLine(13 * 60 + 50, 16 * 60 + 25), 2400]
        ]),
        key: '<p><b>Jump to the next hour first.</b> Then whole hours, then minutes.</p>',
        mistake: '<p>Subtracting clock times like ordinary numbers (11:15 &minus; 9:40 = 1:75 or 175). An hour has 60 minutes, not 100. Use a time line.</p>',
        check: [T('time', 2), T('time', 3)] }
    ] },

    { id: 'area', title: 'Area', sub: 'Count square units; multiply length by width.', concepts: [
      { id: 'squares', title: 'Area is square units', exp: ['E2.5'], skill: 'me4-area',
        body: '<p><b>Area</b> is how much surface a shape covers. Count the <b>square units</b>: each small square is 1 cm' + SQ + '.</p>',
        watch: K.watch([
          ['A rectangle covered in 1 cm' + SQ + ' squares.', areaPic(6, 4, { grid: true }), 1600],
          ['Count one row: 6 squares. There are 4 rows.', areaPic(6, 4, { grid: true, rows: true }), 2000],
          ['4 rows of 6 = <b>24 cm' + SQ + '</b>.', areaPic(6, 4, { grid: true, rows: true, area: 24 }), 2000]
        ]),
        try: K.lab({ controls: [{ id: 'l', label: 'Length', min: 1, max: 10, value: 3 }, { id: 'w', label: 'Width', min: 1, max: 6, value: 2 }],
          render: function (s) { s.a = s.l * s.w; return { fig: areaPic(s.l, s.w, { grid: true, rows: true }), out: '<p class="big">' + s.w + ' rows of ' + s.l + ' = ' + s.a + ' cm' + SQ + '</p>' }; },
          tasks: [
            { do: 'Make a rectangle with an area of <b>24 cm' + SQ + '</b>.', goal: function (s) { return s.a === 24; }, yes: function (s) { return s.l + ' by ' + s.w + '.'; } },
            { do: 'Make a <b>different</b> rectangle with the same area, 24 cm' + SQ + '.', goal: function (s) { return s.a === 24 && s.l !== s._l1; }, setup: function (api) { api.state._l1 = api.state.l; }, yes: 'Different shape, same area.' }
          ] }),
        ways: [{ label: 'Cover it yourself', html: '<p>Tap squares to cover a rectangle. Count the squares, then check: rows &times; number in each row.</p>', tool: 'areagrid', opts: { cols: 8, rows: 5 } }],
        example: K.watch([
          ['My turn. What is the area of this rectangle? It is covered in 1 cm' + SQ + ' squares.', areaPic(5, 3, { grid: true }), 1800],
          ['I count one row: 5 squares. There are 3 rows.', areaPic(5, 3, { grid: true, rows: true }), 1800],
          ['3 rows of 5 = 15. The area is <b>15 cm' + SQ + '</b>.', areaPic(5, 3, { grid: true, rows: true, area: 15 }), 2200]
        ]),
        key: '<p>Area = <b>how many square units</b> cover the shape.</p>',
        check: [T('area', 1), T('area', 1)] },

      { id: 'formula', title: 'Length times width', exp: ['E2.5'], skill: 'me4-area', hard: true,
        body: '<p>You do not need to count every square. <b>Area = length &times; width</b>: the number of rows times the number in each row.</p>',
        watch: K.watch([
          ['8 m long, 5 m wide. Just the first row and column.', areaPic(8, 5, { grid: true, partial: true, unit: 'm' }), 2000],
          ['5 rows of 8: 8 &times; 5 = <b>40 m' + SQ + '</b>.', areaPic(8, 5, { grid: true, rows: true, unit: 'm', area: 40 }), 2200]
        ]),
        ways: [
          { label: 'It is an array', html: '<p>The squares are an array: rows &times; number in each row. Same as 5 &times; 8 dots.</p>' },
          { label: 'Not the edge', html: '<p>Walking around the edge is the <b>perimeter</b>: 8 + 5 + 8 + 5 = 26 m. Area is the <b>inside</b>: 40 m' + SQ + '. Different questions, different answers.</p>' }
        ],
        example: K.watch([
          ['My turn. A garden is 7 m long and 6 m wide. What is its area? I picture the first row and the first column.', areaPic(7, 6, { grid: true, partial: true, unit: 'm' }), 2200],
          ['One row has 7 squares. There are 6 rows. I do not need to count them all.', areaPic(7, 6, { grid: true, partial: true, unit: 'm' }), 2000],
          ['Area = length &times; width = 7 &times; 6 = <b>42 m' + SQ + '</b>.', areaPic(7, 6, { grid: true, rows: true, unit: 'm', area: 42 }), 2400]
        ]),
        key: '<p><b>Area = length &times; width</b>, in square units.</p>',
        mistake: '<p>Adding the sides (8 + 5 = 13) or finding the perimeter instead. Ask: "Are we covering the inside or walking around the edge?"</p>',
        check: [T('area', 2), T('area', 3)] },

      { id: 'missing-side', title: 'Find a missing side', exp: ['E2.6'], skill: 'me4-side',
        body: '<p>If you know the area and one side, <b>divide</b>: area &divide; the side you know = the other side.</p>',
        watch: K.watch([
          ['Area 36 m' + SQ + '. Width 4 m. Length?', areaPic(9, 4, { unit: 'm', unknown: 'l', area: 36 }), 2000],
          ['? &times; 4 = 36. 36 &divide; 4 = <b>9 m</b>.', areaPic(9, 4, { unit: 'm', grid: true, rows: true, area: 36 }), 2200]
        ]),
        try: K.lab({ controls: [{ id: 'l', label: 'Length', min: 1, max: 12, value: 3 }],
          render: function (s) { return { fig: areaPic(s.l, 4, { unit: 'm', grid: true, rows: true, area: s.l * 4 }), out: '<p>' + s.l + ' &times; 4 = ' + s.l * 4 + ' m' + SQ + '</p>' }; },
          tasks: [{ do: 'A garden is 4 m wide with an area of <b>36 m' + SQ + '</b>. Find its length.', goal: function (s) { return s.l === 9; }, yes: '36 &divide; 4 = 9 m.' }] }),
        example: K.watch([
          ['My turn. A rectangle has an area of 30 cm' + SQ + '. Its width is 5 cm. What is its length?', areaPic(6, 5, { unknown: 'l', area: 30 }), 2000],
          ['I know the area and one side, so I divide: area &divide; the side I know. 30 &divide; 5.', areaPic(6, 5, { unknown: 'l', area: 30 }), 2200],
          ['30 &divide; 5 = 6. The length is <b>6 cm</b>.', areaPic(6, 5, { grid: true, rows: true, area: 30 }), 1800],
          ['I check: 6 &times; 5 = 30. It works.', areaPic(6, 5, { grid: true, rows: true, area: 30 }), 1800]
        ]),
        key: '<p><b>Missing side = area &divide; known side.</b></p>',
        check: [T('side', 1), T('side', 2), T('side', 3)] }
    ] }
  ];

  A.register('measuring', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Grams and kilograms</h2>' +
'<p><b>Mass</b> tells how heavy something is. Small things are measured in <b>grams (g)</b>. Heavier things are measured in <b>kilograms (kg)</b>.</p>' +
'<p class="big" style="text-align:center">1 kg = 1000 g</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Benchmark</th><th>About</th></tr></thead><tbody>' +
'<tr><td class="l">a paper clip</td><td>1 g</td></tr><tr><td class="l">an apple</td><td>150 g</td></tr><tr><td class="l">a 1 L carton of milk, or a dictionary</td><td>1 kg</td></tr><tr><td class="l">a pet cat</td><td>4 kg</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: load the scale</span>' +
'<div class="ctrl"><label for="mkg">Kilogram blocks: <output id="mkgo"></output><input type="range" id="mkg" min="0" max="4" value="2"></label><label for="mhg">100 g blocks: <output id="mhgo"></output><input type="range" id="mhg" min="0" max="9" value="3"></label></div>' +
'<div class="fig" id="mmfig"></div><div class="fig" id="mmdial"></div><div class="out" id="mmout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A bag of apples is 2 kg 300 g. How many grams is that?</p><ol><li>2 kg = 2 &times; 1000 = 2000 g.</li><li>2000 g + 300 g = <b>2300 g</b>.</li></ol></div>' +
A.yt({ gen: function () { return gen.mass(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Litres and millilitres</h2>' +
'<p><b>Capacity</b> tells how much a container holds. Small amounts are measured in <b>millilitres (mL)</b>. Large amounts are measured in <b>litres (L)</b>.</p>' +
'<p class="big" style="text-align:center">1 L = 1000 mL</p>' +
'<div class="fig">' + capLine() + '</div>' +
'<p>In Ontario, a <b>bag of milk</b> holds 4 L. A full bathtub holds about 150 L.</p>' +
'<div class="lab"><span class="lt">Try it: fill the jug</span>' +
'<div class="ctrl"><label for="mjl">Water: <output id="mjlo"></output><input type="range" id="mjl" min="0" max="1000" step="50" value="350"></label></div>' +
'<div class="fig" id="mjfig"></div><div class="out" id="mjout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Kilo means 1000 of the main unit: 1 kg = 1000 g. Milli means one part of 1000: there are 1000 mL in 1 L.</p></div>' +
A.yt({ gen: function () { return gen.cap(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Metric prefixes, units and tools</h2>' +
'<p>The start of a metric unit, the <b>prefix</b>, tells its size. The same prefixes work for length, mass and capacity.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Prefix</th><th class="l">Means</th><th class="l">Examples</th></tr></thead><tbody>' +
'<tr><td class="l"><b>kilo</b></td><td class="l">1000 of them</td><td class="l">1 km = 1000 m, 1 kg = 1000 g</td></tr>' +
'<tr><td class="l"><b>centi</b></td><td class="l">one part of 100</td><td class="l">1 m = 100 cm</td></tr>' +
'<tr><td class="l"><b>milli</b></td><td class="l">one part of 1000</td><td class="l">1 m = 1000 mm, 1 L = 1000 mL</td></tr></tbody></table></div>' +
'<div class="fig">' + metre() + '</div>' +
'<div class="lab"><span class="lt">Try it: choose a unit and a tool</span>' +
'<div class="ctrl"><label for="mut">What do you want to measure?<select id="mut">' + MEAS.map(function (m, i) { return '<option value="' + i + '">' + m[0] + '</option>'; }).join('') + '</select></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="mubtn">Show the best choice</button></div><div class="out" id="muout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Choosing a unit that makes the number huge or tiny. A road trip in centimetres would be millions of centimetres. A pencil in kilometres would be a tiny part of 1 km. Pick the unit that fits the size.</p></div>' +
A.yt({ gen: function () { return gen.unit(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Elapsed time</h2>' +
'<p><b>Elapsed time</b> is how much time passes from the start to the end. Remember: <b>60 seconds = 1 minute</b>, <b>60 minutes = 1 hour</b>, <b>24 hours = 1 day</b>, <b>7 days = 1 week</b>.</p>' +
'<p>Use a <b>time line</b>. Jump to the next hour first, then jump whole hours, then the minutes that are left. Add the jumps.</p>' +
'<div class="lab"><span class="lt">Try it: time a trip</span>' +
'<div class="ctrl"><label for="mts">Start: <output id="mtso"></output><input type="range" id="mts" min="420" max="1080" step="5" value="560"></label><label for="mtd">How long: <output id="mtdo"></output><input type="range" id="mtd" min="5" max="240" step="5" value="95"></label></div>' +
'<div class="fig" id="mtclk"></div><div class="fig" id="mtfig"></div><div class="out" id="mtout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A movie starts at 2:45 p.m. and ends at 4:20 p.m. How long is it?</p><div class="fig">' + timeLine(14 * 60 + 45, 16 * 60 + 20) + '</div><ol><li>2:45 to 3:00 is 15 minutes.</li><li>3:00 to 4:00 is 1 hour.</li><li>4:00 to 4:20 is 20 minutes.</li><li>1 hour + 15 minutes + 20 minutes = <b>1 hour 35 minutes</b>.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Subtracting times like ordinary numbers: 4:20 &minus; 2:45 is not 1:75 or 175. An hour has 60 minutes, not 100. Use jumps on a time line.</p></div>' +
A.yt({ gen: function () { return gen.time(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Area of rectangles</h2>' +
'<p><b>Area</b> is how much surface a shape covers. We measure it in <b>square units</b>: square centimetres (cm' + SQ + ') or square metres (m' + SQ + '). A 1 cm' + SQ + ' square is 1 cm on each side.</p>' +
'<p>A rectangle covered in unit squares is an <b>array</b>: rows and columns. Count the squares in one row, then multiply by the number of rows.</p>' +
'<div class="lab"><span class="lt">Try it: build a rectangle</span>' +
'<div class="ctrl"><label for="mal">Length: <output id="malo"></output><input type="range" id="mal" min="1" max="12" value="6"></label><label for="maw">Width: <output id="mawo"></output><input type="range" id="maw" min="1" max="8" value="4"></label></div>' +
'<div class="fig" id="mafig"></div><div class="out" id="maout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p><b>Area of a rectangle = length &times; width.</b> It works for any rectangle, because the rows always have the same number of squares.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the sides instead of multiplying. A 6 cm by 4 cm rectangle has area 6 &times; 4 = 24 cm' + SQ + ', not 6 + 4 = 10. Adding all the way around gives the perimeter, which is a different thing.</p></div>' +
A.yt({ gen: function () { return gen.area(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Finding a missing side</h2>' +
'<p>If you know the area and one side, you can find the other side. Ask: <b>what times the side I know makes the area?</b> Or divide: <b>area &divide; known side</b>.</p>' +
'<div class="lab"><span class="lt">Try it: find the missing side</span>' +
'<div class="ctrl"><label for="msw">Known side: <output id="mswo"></output><input type="range" id="msw" min="2" max="9" value="4"></label><label for="msl">Missing side (hidden): <output id="mslo"></output><input type="range" id="msl" min="2" max="10" value="7"></label></div>' +
'<div class="fig" id="msfig"></div><div class="btnrow"><button type="button" class="btn" id="msbtn">Show the missing side</button></div><div class="out" id="msout" aria-live="polite"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A rug has an area of 24 m' + SQ + '. It is 4 m wide. How long is it?</p><ol><li>? &times; 4 = 24.</li><li>24 &divide; 4 = 6.</li><li>Check: 6 &times; 4 = 24. The rug is <b>6 m</b> long.</li></ol></div>' +
A.yt({ gen: function () { return gen.side(2); } }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.bind(root, ['mkg', 'mhg'], function () {
        var k = +$('#mkg', root).value, h = +$('#mhg', root).value, g = k * 1000 + h * 100;
        $('#mkgo', root).textContent = k; $('#mhgo', root).textContent = h;
        $('#mmfig', root).innerHTML = massBlocks(k, h);
        $('#mmdial', root).innerHTML = dial(g, 5000);
        $('#mmout', root).innerHTML = '<p>' + k + ' kg = ' + A.fmt(k * 1000) + ' g. Add ' + h * 100 + ' g. The total is <span class="big">' + A.fmt(g) + ' g</span>' + (k && h ? ', or ' + k + ' kg ' + h * 100 + ' g' : '') + '.</p>' + (h ? '<p>' + (10 - h) + ' more 100 g block' + (10 - h === 1 ? '' : 's') + ' would make another kilogram.</p>' : '');
      });
      A.bind(root, ['mjl'], function () {
        var ml = +$('#mjl', root).value;
        $('#mjlo', root).textContent = ml + ' mL';
        $('#mjfig', root).innerHTML = jug(ml);
        $('#mjout', root).innerHTML = '<p>The jug holds <span class="big">' + ml + ' mL</span>.' + (ml < 1000 ? ' You need ' + (1000 - ml) + ' mL more to make 1 L.' : ' That is exactly 1 L.') + '</p>' + (ml && 1000 % ml === 0 && ml < 1000 ? '<p>' + 1000 / ml + ' of these make 1 L.</p>' : '');
      });
      function mu(show) {
        var m = MEAS[+$('#mut', root).value];
        $('#muout', root).innerHTML = show ? '<p>Best unit: <b>' + m[1] + '</b>. Tool: <b>' + m[2] + '</b>.</p><p>' + (m[3] === 'L' ? 'This is a length.' : m[3] === 'M' ? 'This is a mass.' : 'This is a capacity.') + ' ' + m[1] + ' keeps the number a sensible size.</p>' : '<p>Think first: is it a length, a mass, or an amount of liquid? Is it small or large?</p>';
      }
      $('#mut', root).addEventListener('change', function () { mu(false); });
      $('#mubtn', root).addEventListener('click', function () { mu(true); });
      mu(false);
      A.bind(root, ['mts', 'mtd'], function () {
        var a = +$('#mts', root).value, d = +$('#mtd', root).value, b = a + d;
        $('#mtso', root).textContent = fmtT(a); $('#mtdo', root).textContent = dur(d);
        $('#mtclk', root).innerHTML = clocks(a, b);
        $('#mtfig', root).innerHTML = timeLine(a, b);
        $('#mtout', root).innerHTML = '<p>' + jumps(a, b).map(function (j) { return hm(j[0]) + ' to ' + hm(j[1]) + ' is ' + dur(j[1] - j[0]); }).join('. ') + '.</p><p>Start ' + fmtT(a) + ', end <span class="big">' + fmtT(b) + '</span> Elapsed time: <b>' + dur(d) + '</b>' + (d >= 60 ? ' (' + d + ' minutes)' : '') + '.</p>';
      });
      A.bind(root, ['mal', 'maw'], function () {
        var l = +$('#mal', root).value, w = +$('#maw', root).value;
        $('#malo', root).textContent = l + ' cm'; $('#mawo', root).textContent = w + ' cm';
        $('#mafig', root).innerHTML = areaPic(l, w, { grid: true, rows: true });
        $('#maout', root).innerHTML = '<p>' + pl(w, 'row') + ' of ' + l + ' squares. ' + w + ' &times; ' + l + ' = <span class="big">' + l * w + ' cm' + SQ + '</span>.</p>';
      });
      function ms(show) {
        var w = +$('#msw', root).value, l = +$('#msl', root).value;
        $('#mswo', root).textContent = w + ' m'; $('#mslo', root).textContent = show ? l + ' m' : '?';
        $('#msfig', root).innerHTML = areaPic(l, w, { unit: 'm', unknown: show ? '' : 'l', area: l * w });
        $('#msout', root).innerHTML = show ? '<p>? &times; ' + w + ' = ' + l * w + '. ' + l * w + ' &divide; ' + w + ' = <span class="big">' + l + ' m</span>. Check: ' + l + ' &times; ' + w + ' = ' + l * w + '.</p>' : '<p>The area is ' + l * w + ' m' + SQ + ' and one side is ' + w + ' m. What is the missing side? Think, then press the button.</p>';
      }
      A.bind(root, ['msw', 'msl'], function () { ms(false); });
      $('#msbtn', root).addEventListener('click', function () { ms(true); });
    },

    quiz: [
      { q: 'How many grams are in 3 kg?', type: 'num', answer: 3000, unit: 'g', hint: '1 kg = 1000 g.', explain: '3 &times; 1000 = 3000 g.' },
      { q: 'How much water is in the jug?', type: 'num', answer: 650, unit: 'mL', fig: jug(650), hint: 'The numbers go up by 100. The short mark is halfway.', explain: 'The water is halfway between 600 and 700: 650 mL.' },
      { q: 'Which is the best estimate for the mass of an apple?', type: 'mc', options: ['15 kg', '1500 g', '150 g', '150 kg'], answer: 2, hint: 'An apple is light. A dictionary is about 1 kg.', explain: 'An apple is about 150 g.' },
      { q: 'Which unit is best for the distance from Ottawa to Kingston?', type: 'mc', options: ['mm', 'cm', 'm', 'km'], answer: 3, hint: 'It is a long trip by car.', explain: 'Long distances between cities are measured in kilometres (km).' },
      { q: 'A movie starts at 2:45 p.m. and ends at 4:20 p.m. How long is it?', type: 'mc', options: ['1 hour 75 minutes', '1 hour 25 minutes', '1 hour 35 minutes', '2 hours 25 minutes'], answer: 2, hint: 'Jump to 3:00 first, then to 4:00, then to 4:20.', explain: '15 minutes + 1 hour + 20 minutes = 1 hour 35 minutes.' },
      { q: 'What is the area of a rectangle 9 cm long and 6 cm wide?', type: 'num', answer: 54, unit: 'cm' + SQ, fig: areaPic(9, 6, {}), hint: 'Area = length &times; width.', explain: '9 &times; 6 = 54 cm' + SQ + '.' },
      { q: 'A rectangle has an area of 42 m' + SQ + '. Its width is 6 m. How long is it?', type: 'num', answer: 7, unit: 'm', fig: areaPic(7, 6, { unit: 'm', unknown: 'l', area: 42 }), hint: 'What times 6 is 42?', explain: '42 &divide; 6 = 7 m.' }
    ],

    practice: [
      { id: 'me4-mass', name: 'Grams and kilograms', code: 'E2.1', gen: gen.mass },
      { id: 'me4-cap', name: 'Litres and millilitres', code: 'E2.1', gen: gen.cap },
      { id: 'me4-unit', name: 'Units and tools', code: 'E2.2', gen: gen.unit },
      { id: 'me4-time', name: 'Elapsed time', code: 'E2.3', gen: gen.time },
      { id: 'me4-area', name: 'Area of rectangles', code: 'E2.5', gen: gen.area },
      { id: 'me4-side', name: 'Missing side', code: 'E2.6', gen: gen.side }
    ]
  });

  /* ---------- More ways to ask (question shapes; see docs/QUESTIONS.md) ----------
     q.meta holds the facts that tests/verify/grade4.js uses to work each answer out again. */
  var why = K.why, who = A.Q && A.Q.name;
  var small = K.small;
  function kgg(g) { return g % 1000 === 0 ? g / 1000 + ' kg' : g > 1000 ? Math.floor(g / 1000) + ' kg ' + g % 1000 + ' g' : g + ' g'; }
  function lml(ml) { return ml % 1000 === 0 ? ml / 1000 + ' L' : ml > 1000 ? Math.floor(ml / 1000) + ' L ' + ml % 1000 + ' mL' : ml + ' mL'; }
  var UNITS = { length: ['mm', 'cm', 'm', 'km'], mass: ['g', 'kg'], capacity: ['mL', 'L'] };
  var SHAPES = {
    'me4-mass': [
      [1, 'match', function () {
        var pairs = [], seen = {};
        while (pairs.length < 3) { var g = R.int(1, 4) * 1000 + R.pick([0, R.int(1, 9) * 100]); if (seen[g]) continue; seen[g] = 1; pairs.push([kgg(g), A.fmt(g) + ' g']); }
        return { q: 'Match the masses that are the same.', type: 'match', pairs: pairs, hint: '1 kg = 1000 g.', steps: ['Change the kilograms to grams, then add the extra grams.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'me4-mass-match', pairs: pairs } };
      }],
      [1, 'line', function (lv) {
        var g = lv === 1 ? R.int(1, 9) * 100 : R.int(1, 19) * 50;
        return { q: 'A bag of apples has a mass of <b>' + g + ' g</b>. Place it on the line.', type: 'line', min: 0, max: 1000, tick: 50, every: 500, snap: 50, answer: g, tol: 0, unit: 'g',
          hint: 'Each small mark is 50 g. Halfway is 500 g.', steps: [g + ' g is ' + (g >= 500 ? (g - 500) + ' g past halfway.' : (500 - g) + ' g before halfway.')],
          explain: g + ' g is less than 1 kg.', meta: { k: 'me4-mass-line' } };
      }],
      [2, 'mistake', function () {
        var kg = R.int(2, 9), p = who(), truth = !R.int(0, 2), said = truth ? kg * 1000 : kg * 100;
        var right = '1 kg = 1000 g, so ' + kg + ' kg = ' + A.fmt(kg * 1000) + ' g.';
        return { q: p + ' says <b>' + kg + ' kg</b> is the same as <b>' + A.fmt(said) + ' g</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['1 kg = 100 g.', 'Grams and kilograms are the same size.', '1 kg = 10 g.']), hint: 'How many grams are in 1 kg?', steps: [right], explain: right, meta: { k: 'me4-mass-tf', kg: kg, said: said } };
      }],
      [2, 'order', function () {
        var gs = [];
        while (gs.length < 4) { var g = R.pick([R.int(1, 9) * 100, R.int(1, 3) * 1000, R.int(1, 2) * 1000 + R.int(1, 9) * 100]); if (gs.indexOf(g) < 0) gs.push(g); }
        gs.sort(function (a, b) { return a - b; });
        return { q: 'Put these masses in order from <b>lightest to heaviest</b>.', type: 'order', items: gs.map(kgg), first: 'lightest', last: 'heaviest',
          hint: 'Change them all to grams first.', steps: ['In grams: ' + gs.map(function (g) { return A.fmt(g) + ' g'; }).join(', ') + '.'], explain: 'Lightest to heaviest: ' + gs.map(kgg).join(', ') + '.', meta: { k: 'me4-mass-order' } };
      }]
    ],
    'me4-cap': [
      [1, 'line', function (lv) {
        var ml = lv === 1 ? R.int(1, 9) * 100 : R.int(1, 19) * 50;
        return { q: 'Fill the jug to <b>' + ml + ' mL</b>. Place it on the line.', type: 'line', min: 0, max: 1000, tick: 50, every: 500, snap: 50, answer: ml, tol: 0, unit: 'mL',
          hint: 'The line goes from 0 to 1000 mL, which is 1 L. Each small mark is 50 mL.', steps: [ml + ' mL is ' + ml / 50 + ' small marks from 0.'], explain: ml + ' mL is ' + (1000 - ml) + ' mL less than 1 L.', meta: { k: 'me4-cap-line' } };
      }],
      [1, 'fill', function () {
        var a = R.int(2, 9), b = R.int(1, 4), c = R.int(1, 9) * 100;
        return { q: 'Change litres to millilitres.', type: 'fill', fill: a + ' L = [[]] mL<br>' + b + ' L ' + c + ' mL = [[]] mL', answers: [a * 1000, b * 1000 + c],
          hint: '1 L = 1000 mL.', steps: [a + ' &times; 1000 = ' + A.fmt(a * 1000) + '.', A.fmt(b * 1000) + ' + ' + c + ' = ' + A.fmt(b * 1000 + c) + '.'], explain: a + ' L = ' + A.fmt(a * 1000) + ' mL.', meta: { k: 'me4-cap-fill' } };
      }],
      [2, 'mistake', function () {
        var c = R.pick([100, 200, 250, 500]), p = who(), truth = !R.int(0, 2), said = truth ? 1000 / c : 100 / c;
        if (said < 1) said = 1000 / c * 2;
        var right = '1 L = 1000 mL. ' + 1000 / c + ' &times; ' + c + ' mL = 1000 mL.';
        return { q: 'A cup holds ' + c + ' mL. ' + p + ' says <b>' + said + '</b> cups fill a 1 L jug. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: jug(c),
          why: why(right, ['1 L = 100 mL.', 'Any cup fills a jug in 2 pours.', '1 L = 10 000 mL.']), hint: 'How many millilitres are in 1 L?', steps: [right], explain: right, meta: { k: 'me4-cap-tf', c: c, said: said } };
      }]
    ],
    'me4-unit': [
      [1, 'pick', function () {
        var kind = R.pick(['length', 'mass', 'capacity']), opts = R.shuffle(['mm', 'cm', 'm', 'km', 'g', 'kg', 'mL', 'L']).slice(0, 6);
        if (!opts.some(function (u) { return UNITS[kind].indexOf(u) >= 0; })) opts[0] = UNITS[kind][0];
        var ans = opts.map(function (u, j) { return UNITS[kind].indexOf(u) >= 0 ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every unit that measures <b>' + kind + '</b>.', type: 'pick', options: opts, answer: ans,
          hint: kind === 'length' ? 'Length units end in "metre".' : kind === 'mass' ? 'Mass units end in "gram".' : 'Capacity units end in "litre".', steps: ['Length: mm, cm, m, km. Mass: g, kg. Capacity: mL, L.'],
          explain: kind.charAt(0).toUpperCase() + kind.slice(1) + ': ' + UNITS[kind].join(', ') + '.', meta: { k: 'me4-unit-pick', kind: kind } };
      }],
      [1, 'fill', function () {
        var F = R.pick([['m', 'cm', 100], ['cm', 'mm', 10], ['km', 'm', 1000]]), n = R.int(2, 9);
        return { q: 'Change the units.', type: 'fill', fill: n + ' ' + F[0] + ' = [[]] ' + F[1], answers: [n * F[2]], hint: '1 ' + F[0] + ' = ' + F[2] + ' ' + F[1] + '.',
          steps: [n + ' &times; ' + F[2] + ' = ' + A.fmt(n * F[2]) + '.'], explain: n + ' ' + F[0] + ' = ' + A.fmt(n * F[2]) + ' ' + F[1] + '.', meta: { k: 'me4-unit-fill', from: F[0], to: F[1], n: n } };
      }],
      [2, 'mistake', function () {
        var F = R.pick([['m', 'cm', 100, 10], ['cm', 'mm', 10, 100], ['km', 'm', 1000, 100]]), n = R.int(2, 9), p = who(), truth = !R.int(0, 2), said = n * (truth ? F[2] : F[3]);
        var right = '1 ' + F[0] + ' = ' + F[2] + ' ' + F[1] + ', so ' + n + ' ' + F[0] + ' = ' + A.fmt(n * F[2]) + ' ' + F[1] + '.';
        return { q: p + ' says <b>' + n + ' ' + F[0] + '</b> is the same as <b>' + A.fmt(said) + ' ' + F[1] + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Every metric unit is 10 times the next one.', 'Bigger units have more of them.', '1 ' + F[0] + ' = ' + F[3] + ' ' + F[1] + '.']), hint: 'How many ' + F[1] + ' are in 1 ' + F[0] + '?', steps: [right], explain: right, meta: { k: 'me4-unit-tf', from: F[0], to: F[1], n: n, said: said } };
      }]
    ],
    'me4-time': [
      [1, 'line', function (lv) {
        var h = R.int(8, 15), a = h * 60 + (lv === 1 ? 0 : R.int(1, 5) * 5), len = lv === 1 ? R.int(2, 10) * 5 : R.int(5, 15) * 5, b = a + len;
        return { q: 'A ' + R.pick(['swim lesson', 'piano lesson', 'library visit']) + ' starts at <b>' + fmtT(a) + '</b> and lasts <b>' + dur(len) + '</b>. Place the end time on the line.', type: 'line', min: h * 60, max: h * 60 + 120, tick: 5, every: 30, snap: 5, answer: b, tol: 0, label: hm,
          hint: 'Each small mark is 5 minutes. Count on from the start.', steps: ['Start at ' + hm(a) + '.', 'Add ' + dur(len) + ': ' + hm(b) + '.'], explain: 'It ends at ' + fmtT(b) + '.', meta: { k: 'me4-time-line', a: a, len: len } };
      }],
      [1, 'fill', function () {
        var a = R.int(7, 16) * 60 + R.int(7, 11) * 5, b = a - a % 60 + 60 + R.int(1, 9) * 5, top = a - a % 60 + 60;
        return { q: 'Find the time from <b>' + fmtT(a) + '</b> to <b>' + fmtT(b) + '</b>. Jump to the hour first.', type: 'fill', fill: hm(a) + ' to ' + hm(top) + ': [[]] min<br>' + hm(top) + ' to ' + hm(b) + ': [[]] min<br>Total: [[]] min', answers: [top - a, b - top, b - a],
          fig: timeLine(a, b), hint: 'How many minutes to the next hour? Then how many after it?', steps: [hm(a) + ' to ' + hm(top) + ' is ' + (top - a) + ' minutes.', hm(top) + ' to ' + hm(b) + ' is ' + (b - top) + ' minutes.', (top - a) + ' + ' + (b - top) + ' = ' + (b - a) + '.'],
          explain: 'The time is ' + (b - a) + ' minutes.', meta: { k: 'me4-time-fill', a: a, b: b } };
      }],
      [2, 'mistake', function () {
        var a = R.int(7, 16) * 60 + R.int(7, 11) * 5, b = a - a % 60 + 60 + R.int(1, 5) * 5, p = who(), truth = !R.int(0, 1), wrong = (b % 60 + 100) - (a % 60), said = truth ? b - a : wrong;
        if (said === b - a && !truth) said = b - a + 40;
        var right = 'Count to the hour, then past it: ' + (a - a % 60 + 60 - a) + ' + ' + b % 60 + ' = ' + (b - a) + ' minutes. An hour has 60 minutes, not 100.';
        return { q: 'From ' + fmtT(a) + ' to ' + fmtT(b) + ', ' + p + ' says <b>' + said + ' minutes</b> pass. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: clocks(a, b),
          why: why(right, ['Subtract the times like whole numbers.', 'An hour has 100 minutes.', 'Only the minute hand matters.']), hint: 'Jump to the next hour first.', steps: [right], explain: right, meta: { k: 'me4-time-tf', a: a, b: b, said: said } };
      }]
    ],
    'me4-area': [
      [1, 'tap', function () {
        var sets = [], areas = [];
        while (sets.length < 3) { var l = R.int(2, 6), w = R.int(2, 4); if (areas.indexOf(l * w) >= 0) continue; areas.push(l * w); sets.push([l, w]); }
        var want = R.int(0, 2);
        return { q: 'Each square is 1 cm' + SQ + '. Tap the rectangle with an area of <b>' + areas[want] + ' cm' + SQ + '</b>.', type: 'tap', tiles: sets.map(function (s) { return small(areaPic(s[0], s[1], { grid: true, unit: 'cm' }), 150); }), answer: want, answerText: 'the ' + sets[want][0] + ' by ' + sets[want][1] + ' rectangle',
          hint: 'Rows &times; squares in each row.', steps: sets.map(function (s) { return s[0] + ' &times; ' + s[1] + ' = ' + s[0] * s[1] + '.'; }), explain: sets[want][0] + ' &times; ' + sets[want][1] + ' = ' + areas[want] + ' cm' + SQ + '.', meta: { k: 'me4-area-tap', sets: sets } };
      }],
      [1, 'match', function () {
        var pairs = [], seen = {};
        while (pairs.length < 3) { var l = R.int(2, 9), w = R.int(2, 6); if (seen[l * w]) continue; seen[l * w] = 1; pairs.push([l + ' m by ' + w + ' m', l * w + ' m' + SQ]); }
        return { q: 'Match each rectangle to its area.', type: 'match', pairs: pairs, hint: 'Area = length &times; width.', steps: ['Multiply the two side lengths.'],
          explain: pairs.map(function (p) { return p[0] + ' has an area of ' + p[1]; }).join('. ') + '.', meta: { k: 'me4-area-match', pairs: pairs } };
      }],
      [2, 'mistake', function () {
        var l = R.int(3, 9), w = R.int(2, 7), p = who(), truth = !R.int(0, 2), said = truth ? l * w : R.pick([l + w, 2 * (l + w)]);
        if (said === l * w && !truth) said = l + w + 1;
        var right = 'Area = length &times; width = ' + l + ' &times; ' + w + ' = ' + l * w + ' m' + SQ + '.';
        return { q: 'A patio is ' + l + ' m long and ' + w + ' m wide. ' + p + ' says its area is <b>' + said + ' m' + SQ + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: areaPic(l, w, { unit: 'm' }),
          why: why(right, ['Area = length + width.', 'Area is the distance around the edge.', 'Area = 2 &times; length.']), hint: 'Area counts the squares that cover it.', steps: [right], explain: right, meta: { k: 'me4-area-tf', l: l, w: w, said: said } };
      }]
    ],
    'me4-side': [
      [1, 'fill', function (lv) {
        var w = R.int(2, lv === 1 ? 5 : 9), l = R.int(2, lv === 1 ? 6 : 10), a = l * w;
        return { q: 'The area is ' + a + ' cm' + SQ + '. One side is ' + w + ' cm. Find the missing side.', type: 'fill', fill: '[[]] &times; ' + w + ' = ' + a + ', so the missing side is [[]] cm.', answers: [l, l],
          fig: areaPic(l, w, { unit: 'cm', unknown: 'l', area: a }), hint: 'What times ' + w + ' makes ' + a + '?', steps: [a + ' &divide; ' + w + ' = ' + l + '.'], explain: 'The missing side is ' + l + ' cm.', meta: { k: 'me4-side-fill', a: a, w: w } };
      }],
      [1, 'pick', function () {
        var a = R.pick([12, 16, 18, 20, 24, 30, 36]), opts = [], dims = [];
        for (var x = 1; x <= a; x++) if (a % x === 0 && x <= a / x && x > 1) dims.push([x, a / x]);
        dims = R.shuffle(dims).slice(0, 2);
        var wrong = [[dims[0][0] + 1, dims[0][1]], [dims[0][0], dims[0][1] - 1], [2, a / 2 + 1]];
        dims.concat(wrong).forEach(function (d) { var t = d[0] + ' m by ' + d[1] + ' m'; if (opts.indexOf(t) < 0) opts.push(t); });
        opts = R.shuffle(opts);
        var ans = opts.map(function (o, j) { var n = o.match(/\d+/g); return n[0] * n[1] === a ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every garden that has an area of <b>' + a + ' m' + SQ + '</b>.', type: 'pick', options: opts, answer: ans, hint: 'Multiply the two sides of each one.',
          steps: ['Length &times; width must equal ' + a + '.'], explain: 'These make ' + a + ' m' + SQ + ': ' + ans.map(function (j) { return opts[j]; }).join('; ') + '.', meta: { k: 'me4-side-pick', a: a } };
      }],
      [2, 'mistake', function () {
        var w = R.int(2, 9), l = R.int(3, 10), a = l * w, p = who(), truth = !R.int(0, 2), said = truth ? l : a - w;
        if (said === l && !truth) said = l + 2;
        var right = 'Missing side = area &divide; known side = ' + a + ' &divide; ' + w + ' = ' + l + ' m.';
        return { q: 'A rug has an area of ' + a + ' m' + SQ + ' and is ' + w + ' m wide. ' + p + ' says it is <b>' + said + ' m</b> long. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Subtract the side from the area.', 'Add the side to the area.', 'The missing side is always half the area.']), hint: 'What times ' + w + ' makes ' + a + '?', steps: [right], explain: right, meta: { k: 'me4-side-tf', a: a, w: w, said: said } };
      }]
    ]
  };
  Atlas.Q.shapes('measuring', SHAPES);
})();
