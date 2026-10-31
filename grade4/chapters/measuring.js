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

  A.register('measuring', {
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
})();
