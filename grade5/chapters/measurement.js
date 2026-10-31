(function () {
  var A = Atlas, R = A.R;
  /* protractor drawing with an angle of t degrees opening from the right-hand base ray */
  function protractor(t, label, showNum, two) {
    var cx = 180, cy = 170, r = 150, s = '';
    s += '<path d="M' + (cx - r) + ',' + cy + ' A' + r + ',' + r + ' 0 0 1 ' + (cx + r) + ',' + cy + ' Z" style="fill:color-mix(in srgb,var(--strand) 8%,var(--card));stroke:var(--ink2)" stroke-width="1.5"/>';
    for (var d = 0; d <= 180; d += 5) {
      var a = d * Math.PI / 180, l = d % 10 ? 8 : 14, x1 = cx + r * Math.cos(a), y1 = cy - r * Math.sin(a), x2 = cx + (r - l) * Math.cos(a), y2 = cy - (r - l) * Math.sin(a);
      s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" style="stroke:var(--ink2)" stroke-width="1"/>';
      if (d % 30 === 0) s += '<text x="' + (cx + (r - 26) * Math.cos(a)).toFixed(1) + '" y="' + (cy - (r - 26) * Math.sin(a) + 4).toFixed(1) + '" text-anchor="middle" font-size="16" class="t2">' + d + '</text>' + (two ? '<text x="' + (cx + (r - 50) * Math.cos(a)).toFixed(1) + '" y="' + (cy - (r - 50) * Math.sin(a) + 4).toFixed(1) + '" text-anchor="middle" font-size="14" style="fill:var(--pm2)">' + (180 - d) + '</text>' : '');
    }
    var ra = t * Math.PI / 180;
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + r + 10) + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + (r + 10) * Math.cos(ra)).toFixed(1) + '" y2="' + (cy - (r + 10) * Math.sin(ra)).toFixed(1) + '" style="stroke:var(--ink)" stroke-width="4" stroke-linecap="round"/>' +
      (t === 90 ? '<rect x="' + cx + '" y="' + (cy - 22) + '" width="22" height="22" style="fill:none;stroke:var(--strand)" stroke-width="3"/>' :
        '<path d="M' + (cx + 40) + ',' + cy + ' A40,40 0 0 0 ' + (cx + 40 * Math.cos(ra)).toFixed(1) + ',' + (cy - 40 * Math.sin(ra)).toFixed(1) + '" style="fill:none;stroke:var(--strand)" stroke-width="4"/>') +
      '<circle cx="' + cx + '" cy="' + cy + '" r="4" style="fill:var(--ink)"/>' +
      (showNum ? '<text x="' + (cx + 62 * Math.cos(ra / 2)).toFixed(1) + '" y="' + (cy - 62 * Math.sin(ra / 2) + 5).toFixed(1) + '" text-anchor="middle" class="tb" font-size="18">' + t + '°</text>' : '');
    return A.svg(360, 182, s, label || 'Protractor showing an angle of ' + t + ' degrees');
  }
  function kind(t) { return t < 90 ? 'acute' : t === 90 ? 'right' : t < 180 ? 'obtuse' : 'straight'; }
  /* rectangle drawn on a cm grid */
  function rect(w, h, u) {
    u = u || Math.min(22, 300 / Math.max(w, h)); var s = '';
    for (var i = 0; i < w; i++) for (var j = 0; j < h; j++) s += '<rect x="' + (30 + i * u) + '" y="' + (10 + j * u) + '" width="' + u + '" height="' + u + '" style="fill:color-mix(in srgb,var(--strand) 22%,var(--card));stroke:var(--line)" stroke-width="1"/>';
    s += '<rect x="30" y="10" width="' + w * u + '" height="' + h * u + '" style="fill:none;stroke:var(--strand)" stroke-width="3"/>' +
      '<text x="' + (30 + w * u / 2) + '" y="' + (h * u + 30) + '" text-anchor="middle" class="tb" font-size="17">' + w + ' cm</text><text x="24" y="' + (10 + h * u / 2 + 6) + '" text-anchor="end" class="tb" font-size="17">' + h + '</text>';
    return A.svg(w * u + 50, h * u + 40, s, 'Rectangle ' + w + ' cm by ' + h + ' cm');
  }
  /* parallelogram or triangle with base b and height h (cm) */
  function shape(sh, b, h) {
    var u = Math.min(22, 320 / (b + 3), 180 / h), x0 = 30, y0 = 14, W = b * u, H = h * u, sk = Math.min(3, b / 2) * u, pts, s = '';
    if (sh === 'rect') pts = [[x0, y0], [x0 + W, y0], [x0 + W, y0 + H], [x0, y0 + H]];
    else if (sh === 'para') pts = [[x0 + sk, y0], [x0 + sk + W, y0], [x0 + W, y0 + H], [x0, y0 + H]];
    else pts = [[x0 + W * 0.35, y0], [x0 + W, y0 + H], [x0, y0 + H]];
    s += '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" style="fill:color-mix(in srgb,var(--strand) 22%,var(--card));stroke:var(--strand)" stroke-width="3"/>';
    var hx = sh === 'rect' ? x0 + W : sh === 'para' ? x0 + sk : x0 + W * 0.35;
    s += '<line x1="' + hx + '" y1="' + y0 + '" x2="' + hx + '" y2="' + (y0 + H) + '" style="stroke:var(--bad)" stroke-width="2" stroke-dasharray="6 4"/>' +
      '<rect x="' + (hx - (sh === 'rect' ? 12 : 0)) + '" y="' + (y0 + H - 12) + '" width="12" height="12" style="fill:none;stroke:var(--bad)" stroke-width="2"/>' +
      '<text x="' + (sh === 'tri' ? x0 + W + 10 : hx + (sh === 'rect' ? -16 : 8)) + '" y="' + (y0 + H * 0.5 + 6) + '" class="tb" style="fill:var(--bad)"' + (sh === 'rect' ? ' text-anchor="end"' : '') + '>h = ' + h + ' cm</text>' +
      '<text x="' + (x0 + W / 2) + '" y="' + (y0 + H + 22) + '" text-anchor="middle" class="tb">b = ' + b + ' cm</text>';
    return A.svg(Math.ceil(x0 + W + sk + 70), Math.ceil(y0 + H + 34), s, sh + ' with base ' + b + ' cm and height ' + h + ' cm');
  }
  var FILL = 'color-mix(in srgb,var(--strand) 22%,var(--card))';
  function txt(x, y, t, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 17) + '"' + (o.c ? ' style="fill:' + o.c + '"' : '') + ' class="' + (o.cl || 'tb') + '">' + t + '</text>'; }
  function arrowH(x1, x2, y, label) {
    return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" style="stroke:var(--bad)" stroke-width="2.5"/>' +
      '<path d="M' + x1 + ' ' + y + ' l9 -6 v12 z M' + x2 + ' ' + y + ' l-9 -6 v12 z" style="fill:var(--bad)"/>' + (label ? txt((x1 + x2) / 2, y + 22, label, { c: 'var(--bad)' }) : '');
  }
  /* little pictures of benchmark sizes */
  var ICON = {
    mm: function () { return '<circle cx="48" cy="52" r="34" style="fill:#c9ccd3;stroke:var(--ink)" stroke-width="2"/>' + txt(48, 58, '10¢', { s: 16 }) + '<rect x="104" y="18" width="5" height="68" style="fill:#aeb2bb;stroke:var(--ink)" stroke-width="1.5"/>' + txt(106, 112, '1 mm', { c: 'var(--bad)' }) + txt(106, 12, 'side', { s: 12, cl: 't2' }); },
    cm: function () { return '<path d="M52 100 V30 a18 18 0 0 1 36 0 V100" style="fill:#f3c9a8;stroke:var(--ink)" stroke-width="2"/><path d="M58 30 a12 12 0 0 1 24 0 v8 h-24 z" style="fill:#fbe7da;stroke:var(--ink)" stroke-width="1.5"/>' + arrowH(52, 88, 64) + txt(112, 70, '1 cm', { c: 'var(--bad)' }); },
    m: function () { return '<circle cx="70" cy="16" r="9" style="fill:none;stroke:var(--ink)" stroke-width="3"/><path d="M70 25 V56 M70 34 L52 48 M70 34 L88 48 M70 56 L30 86 M70 56 L110 86" style="fill:none;stroke:var(--ink)" stroke-width="3" stroke-linecap="round"/>' + arrowH(30, 110, 98) + txt(70, 120, '1 m', { c: 'var(--bad)' }); },
    km: function () { return '<path d="M10 80 C50 80 50 40 90 40 S130 20 136 20" style="fill:none;stroke:var(--ink2)" stroke-width="10" stroke-linecap="round"/><path d="M10 80 C50 80 50 40 90 40 S130 20 136 20" style="fill:none;stroke:#fff" stroke-width="2" stroke-dasharray="6 6"/><circle cx="104" cy="82" r="20" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><path d="M104 68 V82 L114 88" style="fill:none;stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>' + txt(40, 112, '1 km', { c: 'var(--bad)' }); },
    g: function () { return '<path d="M44 70 V30 a12 12 0 0 1 24 0 V78 a18 18 0 0 1 -36 0 V36" style="fill:none;stroke:#7b8494" stroke-width="5" stroke-linecap="round" transform="rotate(-70 60 55) translate(0 -6)"/>' + txt(70, 104, '1 g', { c: 'var(--bad)' }); },
    kg: function () { return '<path d="M46 34 L56 16 H84 L94 34 V104 H46 Z" style="fill:#d8ecfb;stroke:var(--ink)" stroke-width="2.5"/><path d="M46 34 H94" style="stroke:var(--ink)" stroke-width="2"/>' + txt(70, 62, '1 L', { s: 16 }) + txt(70, 82, 'water', { s: 13, cl: 't2' }) + txt(122, 74, '1 kg', { c: 'var(--bad)' }); },
    mL: function () { return '<path d="M40 70 q-10 -14 0 -28 q10 14 0 28" style="fill:#7cc0f2;stroke:var(--ink)" stroke-width="1.5"/><path d="M62 74 q-10 -14 0 -28 q10 14 0 28" style="fill:#7cc0f2;stroke:var(--ink)" stroke-width="1.5"/><path d="M84 70 q-10 -14 0 -28 q10 14 0 28" style="fill:#7cc0f2;stroke:var(--ink)" stroke-width="1.5"/>' + txt(70, 104, '1 mL', { c: 'var(--bad)' }); },
    L: function () { return '<path d="M60 8 h20 v14 l10 12 V106 H50 V34 l10 -12 z" style="fill:#d8ecfb;stroke:var(--ink)" stroke-width="2.5"/><rect x="50" y="56" width="40" height="22" style="fill:var(--strand);opacity:.8"/>' + txt(122, 72, '1 L', { c: 'var(--bad)' }); },
    cm2: function () { return '<path d="M52 110 V40 a18 18 0 0 1 36 0 V110" style="fill:#f3c9a8;stroke:var(--ink)" stroke-width="2"/><rect x="58" y="30" width="24" height="24" rx="3" style="fill:#fbe7da;stroke:var(--bad)" stroke-width="2.5"/>' + txt(118, 48, '1 cm²', { c: 'var(--bad)' }); },
    m2: function () { return '<rect x="14" y="16" width="90" height="90" style="fill:' + FILL + ';stroke:var(--bad)" stroke-width="3"/>' + txt(59, 66, '1 m²', { c: 'var(--bad)' }) + '<circle cx="124" cy="40" r="7" style="fill:none;stroke:var(--ink)" stroke-width="2.5"/><path d="M124 47 V78 M124 56 L114 66 M124 56 L134 66 M124 78 L116 104 M124 78 L132 104" style="fill:none;stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>'; }
  };
  function icon(k) { return A.svg(140, 124, ICON[k](), 'Picture of ' + k); }
  function benchmarks() {
    var f = function (k, name, def) { return '<figure>' + icon(k) + '<figcaption><b>' + name + '</b><br>' + def + '</figcaption></figure>'; };
    return '<p><b>Length</b>: how long, tall or far</p><div class="pies thumbs">' + f('mm', 'Millimetre', 'thickness of a dime') + f('cm', 'Centimetre', 'width of a fingertip') + f('m', 'Metre', 'one big step') + f('km', 'Kilometre', 'about 12 minutes of walking') + '</div>' +
      '<p><b>Mass</b>: how heavy</p><div class="pies thumbs">' + f('g', 'Gram', 'a paper clip') + f('kg', 'Kilogram', 'a litre of water') + '</div>' +
      '<p><b>Capacity</b>: how much a container holds</p><div class="pies thumbs">' + f('mL', 'Millilitre', 'about 20 drops') + f('L', 'Litre', 'a large water bottle') + '</div>' +
      '<p><b>Area</b>: how much flat space</p><div class="pies thumbs">' + f('cm2', 'Square centimetre', 'a fingernail') + f('m2', 'Square metre', 'a big poster') + '</div>';
  }
  /* the unit staircase: going down a step means multiplying */
  var LADDER = { length: [['km', 1000], ['m', 100], ['cm', 10], ['mm']], mass: [['kg', 1000], ['g']], capacity: [['L', 1000], ['mL']] };
  function kindOf(u) { return u === 'kg' || u === 'g' ? 'mass' : u === 'L' || u === 'mL' ? 'capacity' : 'length'; }
  function stair(kind, from, to) {
    var L = LADDER[kind], names = L.map(function (r) { return r[0]; }), i0 = from ? names.indexOf(from) : -1, i1 = to ? names.indexOf(to) : -1, s = '', bw = 72, st = 92, sy = 46;
    L.forEach(function (r, i) {
      var x = 10 + i * st, y = 24 + i * sy, on = i0 >= 0 && i >= i0 && i <= i1;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="38" rx="8" style="fill:' + (i === i0 ? 'var(--strand)' : on ? 'color-mix(in srgb,var(--strand) 25%,var(--card))' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>' +
        txt(x + bw / 2, y + 26, r[0], { s: 19, c: i === i0 ? '#fff' : null });
      if (r[1]) {
        var hot = on && i < i1, col = hot ? 'var(--bad)' : 'var(--ink2)', ex = x + st + bw / 2;
        s += '<path d="M' + (x + bw) + ' ' + (y + 19) + ' H' + ex + ' V' + (y + sy - 6) + '" style="fill:none;stroke:' + col + '" stroke-width="' + (hot ? 3.5 : 2) + '"/><path d="M' + (ex - 6) + ' ' + (y + sy - 8) + ' l6 8 l6 -8 z" style="fill:' + col + '"/>' +
          txt(x + bw + 34, y + 12, '&times; ' + A.fmt(r[1]), { c: col });
      }
    });
    var n = L.length;
    return A.svg(10 + (n - 1) * st + bw + 30, 24 + (n - 1) * sy + 48, s, 'Unit staircase: ' + names.join(', ') + '. Going down a step means multiply.');
  }
  /* n metre sticks, each split into 10 parts of 10 cm */
  function msticks(n, lab) {
    var w = n > 2 ? 112 : 170, s = '';
    for (var k = 0; k < n; k++) {
      var x = 10 + k * (w + 12);
      for (var j = 0; j < 10; j++) s += '<rect x="' + (x + j * w / 10) + '" y="10" width="' + w / 10 + '" height="26" style="fill:' + (j % 2 ? '#f6d860' : '#fff4c2') + ';stroke:var(--ink)" stroke-width="1"/>';
      s += '<rect x="' + x + '" y="10" width="' + w + '" height="26" style="fill:none;stroke:var(--ink)" stroke-width="2.5"/>' + txt(x + w / 2, 58, lab ? lab(k) : '1 m = 100 cm');
    }
    return A.svg(10 + n * (w + 12), 68, s, n + ' metre sticks');
  }
  /* an angle with arms and an arc, opening up from a flat arm */
  function angPic(t, ref) {
    var cx = 30, cy = 92, r = 90, ra = t * Math.PI / 180, s = '';
    if (t > 90) cx = 110;
    if (ref) s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy - r) + '" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="5 4"/><rect x="' + cx + '" y="' + (cy - 16) + '" width="16" height="16" style="fill:none;stroke:var(--ink2)" stroke-width="1.5"/>';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + r) + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + r * Math.cos(ra)).toFixed(1) + '" y2="' + (cy - r * Math.sin(ra)).toFixed(1) + '" style="stroke:var(--ink)" stroke-width="4" stroke-linecap="round"/>' +
      (t === 90 ? '<rect x="' + cx + '" y="' + (cy - 22) + '" width="22" height="22" style="fill:none;stroke:var(--strand)" stroke-width="3"/>' :
        '<path d="M' + (cx + 30) + ',' + cy + ' A30,30 0 0 0 ' + (cx + 30 * Math.cos(ra)).toFixed(1) + ',' + (cy - 30 * Math.sin(ra)).toFixed(1) + '" style="fill:none;stroke:var(--strand)" stroke-width="4"/>');
    return A.svg(t > 90 ? 210 : 130, 104, s, 'An angle of ' + t + ' degrees');
  }
  function angleBench() {
    var f = function (t, name, def) { return '<figure>' + angPic(t) + '<figcaption><b>' + name + '</b><br>' + def + '</figcaption></figure>'; };
    return '<div class="pies thumbs">' + f(45, '45&deg;', 'half a right angle') + f(90, '90&deg;', 'a square corner') + f(135, '135&deg;', 'a right angle and a half') + f(180, '180&deg;', 'a straight line') + '</div>';
  }
  /* cut the triangle off a parallelogram and slide it across to make a rectangle */
  function cutPara() {
    var W = 150, H = 84, sk = 42, x = 14, y = 12, s = '', T = 'color-mix(in srgb,var(--hi) 70%,var(--card))';
    s += '<polygon points="' + [[x + sk, y], [x + sk + W, y], [x + W, y + H], [x, y + H]].join(' ') + '" style="fill:' + FILL + ';stroke:var(--strand)" stroke-width="3"/>' +
      '<polygon points="' + [[x, y + H], [x + sk, y], [x + sk, y + H]].join(' ') + '" style="fill:' + T + ';stroke:var(--ink)" stroke-width="1.5"/>' +
      '<line x1="' + (x + sk) + '" y1="' + y + '" x2="' + (x + sk) + '" y2="' + (y + H) + '" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="6 4"/>' + txt(x + W / 2, y + H + 24, 'cut along the height');
    var x2 = x + sk + W + 60;
    s += '<path d="M' + (x2 - 48) + ' ' + (y + H / 2) + ' h32" style="stroke:var(--ink)" stroke-width="3"/><path d="M' + (x2 - 14) + ' ' + (y + H / 2) + ' l-10 -7 v14 z" style="fill:var(--ink)"/>';
    s += '<rect x="' + x2 + '" y="' + y + '" width="' + W + '" height="' + H + '" style="fill:' + FILL + ';stroke:var(--strand)" stroke-width="3"/>' +
      '<polygon points="' + [[x2 + W - sk, y + H], [x2 + W, y], [x2 + W, y + H]].join(' ') + '" style="fill:' + T + ';stroke:var(--ink)" stroke-width="1.5"/>' + txt(x2 + W / 2, y + H + 24, 'a rectangle, b &times; h');
    return A.svg(x2 + W + 14, y + H + 34, s, 'A parallelogram cut along its height; the triangle slides across to make a rectangle with the same base and height');
  }
  function halfPara() {
    var W = 170, H = 90, sk = 60, x = 50, y = 12;
    return A.svg(330, H + 40, '<polygon points="' + [[x + sk, y], [x + sk + W, y], [x + W, y + H]].join(' ') + '" style="fill:none;stroke:var(--ink2)" stroke-width="2.5" stroke-dasharray="7 5"/>' +
      '<polygon points="' + [[x, y + H], [x + W, y + H], [x + sk, y]].join(' ') + '" style="fill:' + FILL + ';stroke:var(--strand)" stroke-width="3"/>' + txt(165, y + H + 26, 'two copies make a parallelogram'),
      'A triangle and a dashed copy of it make a parallelogram');
  }
  /* area counts squares inside; perimeter walks around the edge */
  function areaVsPerim(w, h) {
    var u = 30, s = '', x = 6, y = 24, n = 0;
    for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) { n++; s += '<rect x="' + (x + i * u) + '" y="' + (y + j * u) + '" width="' + u + '" height="' + u + '" style="fill:' + FILL + ';stroke:var(--ink2)" stroke-width="1"/>' + txt(x + i * u + u / 2, y + j * u + u / 2 + 6, n, { s: 15 }); }
    s += txt(x + w * u / 2, y + h * u + 46, 'Area: ' + n + ' cm²');
    var x2 = x + w * u + 46, k = 0, c = 'var(--strand)';
    s += '<rect x="' + x2 + '" y="' + y + '" width="' + w * u + '" height="' + h * u + '" style="fill:var(--card);stroke:' + c + '" stroke-width="4"/>';
    for (var a = 0; a < w; a++) s += txt(x2 + a * u + u / 2, y - 7, ++k, { s: 14, c: c });
    for (var b = 0; b < h; b++) s += txt(x2 + w * u + 6, y + b * u + u / 2 + 5, ++k, { s: 14, c: c, a: 'start' });
    for (var c2 = w - 1; c2 >= 0; c2--) s += txt(x2 + c2 * u + u / 2, y + h * u + 18, ++k, { s: 14, c: c });
    for (var d = h - 1; d >= 0; d--) s += txt(x2 - 6, y + d * u + u / 2 + 5, ++k, { s: 14, c: c, a: 'end' });
    s += txt(x2 + w * u / 2, y + h * u + 46, 'Perimeter: ' + k + ' cm');
    return A.svg(x2 + w * u + 30, y + h * u + 54, s, 'Area counts ' + n + ' squares inside. Perimeter counts ' + k + ' unit edges around.');
  }
  /* two gardens of 36 square metres */
  function gardens() {
    var u = 11, s = '', x = 16, y = 12;
    s += '<rect x="' + x + '" y="' + y + '" width="' + 6 * u + '" height="' + 6 * u + '" style="fill:color-mix(in srgb,var(--good) 30%,var(--card));stroke:var(--good)" stroke-width="3"/>' + txt(x + 3 * u, y + 6 * u + 22, '6 m by 6 m') + txt(x + 3 * u, y + 6 * u + 44, 'fence 24 m', { c: 'var(--bad)' });
    var x2 = x + 6 * u + 40;
    s += '<rect x="' + x2 + '" y="' + (y + 4 * u) + '" width="' + 18 * u + '" height="' + 2 * u + '" style="fill:color-mix(in srgb,var(--good) 30%,var(--card));stroke:var(--good)" stroke-width="3"/>' + txt(x2 + 9 * u, y + 6 * u + 22, '18 m by 2 m') + txt(x2 + 9 * u, y + 6 * u + 44, 'fence 40 m', { c: 'var(--bad)' });
    return A.svg(x2 + 18 * u + 16, y + 6 * u + 54, s, 'Two gardens of 36 square metres: 6 by 6 needs 24 m of fence, 18 by 2 needs 40 m');
  }
  /* estimate against the actual amount, as two bars */
  function estBars(g, actual, unit) {
    var m = Math.max(g, actual) || 1, W = 160, s = '';
    [[g, 'Estimate', 'var(--hi)'], [actual, 'Actual', 'var(--strand)']].forEach(function (r, i) {
      var y = 6 + i * 44, w = Math.max(3, r[0] / m * W);
      s += txt(0, y + 23, r[1], { a: 'start' }) + '<rect x="84" y="' + (y + 2) + '" width="' + w.toFixed(1) + '" height="30" rx="4" style="fill:' + r[2] + ';stroke:var(--ink)" stroke-width="1.5"/>' + txt(90 + w, y + 23, A.fmt(String(A.clean(r[0]))) + ' ' + unit, { a: 'start' });
    });
    return A.svg(380, 94, s, 'Estimate compared with the actual amount');
  }
  var UNITS = {
    km: { to: 'm', f: 1000, kind: 'length' }, m: { to: 'cm', f: 100, kind: 'length' }, cm: { to: 'mm', f: 10, kind: 'length' },
    kg: { to: 'g', f: 1000, kind: 'mass' }, L: { to: 'mL', f: 1000, kind: 'capacity' }
  };

  A.fig = A.fig || {};
  A.fig.stair = stair; A.fig.shape = shape; A.fig.rect = rect; A.fig.angleBench = angleBench; A.fig.areaVsPerim = areaVsPerim;

  A.register('measurement', {
    html:
'<section class="sec"><h2><span class="n">1</span>Choosing metric units</h2>' +
'<p>Pick a unit that fits the size of the thing you are measuring. Benchmarks help you estimate.</p>' +
benchmarks() +
'<div class="lab"><span class="lt">Try it: estimate first, then check</span>' +
'<div class="ctrl"><label for="eo">Object<select id="eo"><option value="0">Length of a pencil</option><option value="1">Mass of an apple</option><option value="2">Water in a bathtub</option><option value="3">Distance from Toronto to Ottawa</option><option value="4">Area of a classroom floor</option><option value="5">Mass of a car</option></select></label>' +
'<label for="eg">Your estimate<input type="number" id="eg" min="0" value="20"></label>' +
'<label for="eu">Unit<select id="eu"><option>mm</option><option selected>cm</option><option>m</option><option>km</option><option>g</option><option>kg</option><option>mL</option><option>L</option><option>cm²</option><option>m²</option></select></label></div>' +
'<div class="fig" id="efig"></div><div class="out" id="eout"></div></div>' +
'<div class="eg"><p><b>Example.</b> A door is about 2 m tall. In millimetres that is about 2000 mm, which is harder to picture. Metres fit best.</p><div class="fig">' + msticks(2, function () { return '1 m'; }) + '</div><p class="cap">A door is about as tall as two metre sticks end to end.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up mass and capacity. Grams and kilograms measure how heavy something is. Millilitres and litres measure how much a container holds.</p><div class="pies thumbs"><figure>' + icon('kg') + '<figcaption><b>Mass</b><br>how heavy</figcaption></figure><figure>' + icon('L') + '<figcaption><b>Capacity</b><br>how much it holds</figcaption></figure></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Converting units</h2>' +
'<p>Metric units are built on <b>10</b>. To change a larger unit into a smaller one, <b>multiply</b>, because you need more of the small units.</p><div class="fig">' + stair('length') + '</div><p>Each step down the stairs, multiply by the number on the arrow. Mass and capacity have one step of &times; 1000:</p><div class="pies">' + stair('mass') + stair('capacity') + '</div>' +
'<div class="lab"><span class="lt">Try it: convert to a smaller unit</span>' +
'<div class="ctrl"><label for="ca">Amount<input type="text" id="ca" value="2.5" inputmode="decimal" autocomplete="off"></label>' +
'<label for="cu">Unit<select id="cu"><option value="km">km</option><option value="m">m</option><option value="cm">cm</option><option value="kg">kg</option><option value="L" selected>L</option></select></label></div>' +
'<div class="fig" id="cfig"></div><div class="out" id="cout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Dividing when you go to a smaller unit. 3 m is not 0.03 cm. Smaller units mean a bigger number: 3 m = 300 cm.</p><div class="fig">' + msticks(3, function () { return '100 cm'; }) + '</div><p class="cap">3 metre sticks, 100 cm each: 300 cm.</p></div>' +
'<div class="eg"><p><b>Example.</b> 3.6 km = 3.6 &times; 1000 = <b>3600 m</b>. And 3600 m = 3600 &times; 100 = 360 000 cm.</p><div class="fig">' + stair('length', 'km', 'cm') + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Comparing and measuring angles</h2>' +
'<p>An angle measures the amount of turn between two arms that meet at a <b>vertex</b>. You can compare two angles by placing one on top of the other. To measure, use a <b>protractor</b>: put its centre on the vertex, line up 0 with one arm, and read where the other arm crosses the scale.</p>' +
'<div class="lab"><span class="lt">Try it: protractor</span>' +
'<div class="ctrl"><label for="ag">Angle: <output id="ago"></output><input type="range" id="ag" min="0" max="180" value="120"></label></div>' +
'<div class="fig" id="afig"></div><div class="out" id="aout"></div></div>' +
'<div class="key"><b class="t">Key idea</b>' + angleBench() + '<p>Use benchmarks to estimate: 45&deg; is half a right angle, 90&deg; is a square corner, and 180&deg; is a straight line. An angle a bit wider than a square corner is a bit more than 90&deg;.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>A protractor has two scales. Start at 0 on the arm you line up with, and read the scale that begins at that 0. An angle that looks wide cannot be 60&deg;.</p><div class="fig">' + protractor(120, 'A protractor with two scales showing an angle of 120 degrees', true, true) + '</div><p class="cap">The arm starts at 0 on the right, so read the outer scale: 120&deg;. The inner scale says 60, which is wrong for this angle.</p></div>' +
'<div class="eg"><p><b>Example.</b> An angle is a bit wider than a square corner. Estimate: about 100&deg;. Measure with a protractor: 105&deg;. The estimate was close.</p><div class="fig">' + angPic(105, true) + '</div><p class="cap">The dashed line is a square corner. The angle opens a little past it.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Area of parallelograms and triangles</h2>' +
'<p><b>Area</b> is the flat space inside a shape, measured in square units like cm&sup2;. Cut a triangle off one end of a parallelogram and move it to the other end. You get a rectangle with the same base and height. So a parallelogram\'s area is <b>base &times; height</b>.</p><div class="fig">' + cutPara() + '</div>' +
'<p>The <b>height</b> is the straight-across distance from the base, at a right angle. It is never the slanted side.</p>' +
'<div class="lab"><span class="lt">Try it: find the area</span>' +
'<div class="ctrl"><label for="sh">Shape<select id="sh"><option value="rect">Rectangle</option><option value="para" selected>Parallelogram</option><option value="tri">Triangle</option></select></label>' +
'<label for="sb">Base: <output id="sbo"></output><input type="range" id="sb" min="2" max="15" value="8"></label>' +
'<label for="shh">Height: <output id="sho"></output><input type="range" id="shh" min="2" max="12" value="5"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>A triangle is half of a parallelogram with the same base and height. So a triangle\'s area is <b>base &times; height &divide; 2</b>.</p><div class="fig">' + halfPara() + '</div></div>' +
'<div class="eg"><p><b>Example.</b> A parallelogram has a base of 9 cm and a height of 4 cm. A = 9 &times; 4 = <b>36 cm&sup2;</b>. A triangle with the same base and height has A = 36 &divide; 2 = 18 cm&sup2;.</p><div class="pies">' + shape('para', 9, 4) + shape('tri', 9, 4) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Same area, different perimeters</h2>' +
'<p><b>Perimeter</b> is the distance around a shape. Shapes with the same area can have very different perimeters. Long, thin shapes have a bigger perimeter. Shapes close to a square have a smaller one.</p>' +
'<div class="lab"><span class="lt">Try it: rectangles with the same area</span>' +
'<div class="ctrl"><label for="pa">Area (cm&sup2;)<select id="pa"><option>12</option><option>16</option><option selected>24</option><option>36</option></select></label>' +
'<label for="pw">Choose a rectangle: <output id="pwo"></output><input type="range" id="pw" min="0" max="3" value="1"></label></div>' +
'<div class="fig" id="pfig"></div><div class="tbl" id="ptbl"></div><div class="out" id="pout"></div></div>' +
'<div class="eg"><p>A garden needs 36 m&sup2;. A 6 m by 6 m garden needs 24 m of fence. A 2 m by 18 m garden needs 40 m of fence. The square shape saves fence.</p><div class="fig">' + gardens() + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up area and perimeter. Area counts the squares inside, in cm&sup2;. Perimeter is the distance around, in cm.</p><div class="fig">' + areaVsPerim(4, 3) + '</div></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      var OBJ = [{ v: 19, u: 'cm', t: 'about 19 cm', ok: ['cm', 'mm'] }, { v: 150, u: 'g', t: 'about 150 g', ok: ['g'] }, { v: 150, u: 'L', t: 'about 150 L', ok: ['L'] },
        { v: 450, u: 'km', t: 'about 450 km by road', ok: ['km'] }, { v: 70, u: 'm²', t: 'about 70 m²', ok: ['m²'] }, { v: 1500, u: 'kg', t: 'about 1500 kg', ok: ['kg'] }];
      var F = { mm: 0.001, cm: 0.01, m: 1, km: 1000, g: 1, kg: 1000, mL: 1, L: 1000, 'cm²': 1, 'm²': 10000 };
      var KIND = { mm: 'len', cm: 'len', m: 'len', km: 'len', g: 'mass', kg: 'mass', mL: 'cap', L: 'cap', 'cm²': 'area', 'm²': 'area' };
      function est() {
        var o = OBJ[+$('#eo', root).value], g = parseFloat($('#eg', root).value), u = $('#eu', root).value, out = $('#eout', root);
        var good = o.ok.indexOf(u) >= 0, same = KIND[u] === KIND[o.u];
        var msg = '<p>Actual: <b>' + o.t + '</b>.</p>';
        if (!same) msg += '<p>' + u + ' measures a different thing. Try a unit of ' + { len: 'length', mass: 'mass', cap: 'capacity', area: 'area' }[KIND[o.u]] + '.</p>';
        else {
          var gv = isNaN(g) ? 0 : g * F[u] / F[o.u], ratio = gv / o.v;
          msg += '<p>' + (good ? 'Good unit choice. ' : 'That unit works, but ' + o.u + ' fits better. ') + (isNaN(g) ? '' : 'Your estimate is ' + (ratio > 0.7 && ratio < 1.4 ? '<b>close</b>.' : ratio < 1 ? 'too small.' : 'too big.')) + '</p>';
        }
        out.innerHTML = msg;
        $('#efig', root).innerHTML = same && !isNaN(g) && g > 0 ? estBars(g * F[u] / F[o.u], o.v, o.u) : '';
      }
      A.bind(root, ['eo', 'eg', 'eu'], est);

      function conv() {
        var t = $('#ca', root).value.trim(), u = $('#cu', root).value, o = $('#cout', root), f = $('#cfig', root);
        if (!/^\d{1,4}(\.\d{1,3})?$/.test(t)) { f.innerHTML = ''; o.innerHTML = '<p>Type an amount like 2.5 or 40.</p>'; return; }
        var x = parseFloat(t), c = UNITS[u], chain = [], s = '';
        if (c.kind === 'length') {
          var steps = { km: [['km', 1], ['m', 1000], ['cm', 100000], ['mm', 1000000]], m: [['m', 1], ['cm', 100], ['mm', 1000]], cm: [['cm', 1], ['mm', 10]] }[u];
          steps.forEach(function (p) { chain.push(A.fmt(String(A.clean(x * p[1]))) + ' ' + p[0]); });
          f.innerHTML = stair('length', u, 'mm');
        } else {
          chain = [A.fmt(t) + ' ' + u, A.fmt(String(A.clean(x * 1000))) + ' ' + c.to];
          f.innerHTML = stair(c.kind, u, c.to);
        }
        o.innerHTML = '<p><span class="big">' + chain.join(' = ') + '</span></p><p>1 ' + u + ' = ' + A.fmt(c.f) + ' ' + c.to + ', so multiply by ' + A.fmt(c.f) + ': ' + t + ' &times; ' + A.fmt(c.f) + ' = ' + A.fmt(String(A.clean(x * c.f))) + ' ' + c.to + '.</p>';
      }
      A.bind(root, ['ca', 'cu'], conv);

      function ang() {
        var t = +$('#ag', root).value;
        $('#ago', root).textContent = t + '°';
        $('#afig', root).innerHTML = protractor(t, null, true);
        var bench = t < 30 ? 'less than 45&deg;, a small turn' : t < 60 ? 'close to 45&deg;, half a right angle' : t < 80 ? 'between 45&deg; and 90&deg;' : t <= 100 ? 'close to 90&deg;, a square corner' : t < 170 ? 'between 90&deg; and 180&deg;' : 'close to 180&deg;, a straight line';
        $('#aout', root).innerHTML = '<p><span class="big">' + t + '° is ' + (t === 0 ? 'a zero angle' : (kind(t) === 'acute' || kind(t) === 'obtuse' ? 'an ' : 'a ') + kind(t) + ' angle') + '.</span></p><p>Benchmark: ' + bench + '.</p>';
      }
      A.bind(root, ['ag'], ang);

      function area() {
        var sh = $('#sh', root).value, b = +$('#sb', root).value, h = +$('#shh', root).value;
        $('#sbo', root).textContent = b + ' cm'; $('#sho', root).textContent = h + ' cm';
        $('#sfig', root).innerHTML = shape(sh, b, h);
        var ar = sh === 'tri' ? b * h / 2 : b * h;
        $('#sout', root).innerHTML = '<p><span class="big">' + (sh === 'tri' ? 'A = b × h ÷ 2 = ' + b + ' × ' + h + ' ÷ 2' : 'A = b × h = ' + b + ' × ' + h) + ' = ' + ar + ' cm²</span></p>' +
          (sh === 'para' ? '<p>The slanted side is not used. Only the base and the perpendicular height matter.</p>' : '') +
          (sh === 'tri' ? '<p>b × h = ' + (b * h) + ' would be a parallelogram, so the triangle is half of that.</p>' : '');
      }
      A.bind(root, ['sh', 'sb', 'shh'], area);

      function per() {
        var a = +$('#pa', root).value, opts = [];
        for (var w = a; w >= 1; w--) if (a % w === 0 && w >= a / w) opts.push([w, a / w]);
        var r = $('#pw', root); r.max = opts.length - 1;
        var k = Math.min(+r.value, opts.length - 1), p = opts[k];
        $('#pwo', root).textContent = p[0] + ' by ' + p[1];
        $('#pfig', root).innerHTML = rect(p[0], p[1], Math.min(20, 380 / p[0]));
        $('#ptbl', root).innerHTML = '<table><thead><tr><th>Length</th><th>Width</th><th>Area</th><th>Perimeter</th></tr></thead><tbody>' +
          opts.map(function (q, i) { return '<tr' + (i === k ? ' style="font-weight:800;background:color-mix(in srgb,var(--hi) 30%,var(--card))"' : '') + '><td>' + q[0] + ' cm</td><td>' + q[1] + ' cm</td><td>' + a + ' cm²</td><td>' + 2 * (q[0] + q[1]) + ' cm</td></tr>'; }).join('') + '</tbody></table>';
        $('#pout', root).innerHTML = '<p><span class="big">P = 2 × (' + p[0] + ' + ' + p[1] + ') = ' + 2 * (p[0] + p[1]) + ' cm</span></p><p>Every rectangle in the table has an area of ' + a + ' cm², but the perimeters are different.</p>';
      }
      A.bind(root, ['pa', 'pw'], per);
    },

    quiz: [
      { q: 'Which unit is best for the mass of a bag of flour?', type: 'mc', options: ['mL', 'kg', 'km', 'cm'], answer: 1, hint: 'Mass is measured in grams or kilograms.', explain: 'A bag of flour is a few kilograms.' },
      { q: 'A jug holds 2.5 L. How many millilitres is that?', fig: stair('capacity'), type: 'num', answer: 2500, unit: 'mL', hint: '1 L = 1000 mL.', explain: '2.5 &times; 1000 = 2500 mL.' },
      { q: 'How many centimetres are in 4.2 m?', type: 'num', answer: 420, unit: 'cm', hint: '1 m = 100 cm.', explain: '4.2 &times; 100 = 420 cm.' },
      { q: 'What angle does the protractor show?', fig: protractor(130, 'Protractor showing an angle'), type: 'num', answer: 130, unit: '&deg;', hint: 'Start at 0 on the bottom-right arm and count around.', explain: 'The arm crosses 130 on the scale that starts at 0 on the right. It is obtuse.' },
      { q: 'A parallelogram has a base of 8 cm, a height of 5 cm and a slanted side of 6 cm. What is its area?', fig: shape('para', 8, 5), type: 'num', answer: 40, unit: 'cm²', hint: 'The slanted side is not needed.', explain: '8 &times; 5 = 40 cm&sup2;.' },
      { q: 'A triangle has a base of 10 cm and a height of 6 cm. What is its area?', fig: shape('tri', 10, 6), type: 'num', answer: 30, unit: 'cm²', hint: 'Multiply base by height, then take half.', explain: '10 &times; 6 &divide; 2 = 30 cm&sup2;.' },
      { q: 'Two rectangles each have an area of 16 cm&sup2;. One is 4 cm by 4 cm, the other is 8 cm by 2 cm. Which has the greater perimeter?', fig: '<div class="pies">' + rect(4, 4, 24) + rect(8, 2, 24) + '</div>', type: 'mc', options: ['4 cm by 4 cm', '8 cm by 2 cm', 'They are the same'], answer: 1, hint: 'Find each perimeter: 2 &times; (length + width).', explain: '4 by 4: 16 cm. 8 by 2: 20 cm. The long thin one has the greater perimeter.' }
    ],

    quick: ['me-unit', 'me-conv', 'me-angle', 'me-area', 'me-perim'],

    practice: [
      { id: 'me-unit', name: 'Choose a metric unit', code: 'E2.1', gen: function (lv) {
        var items = [['the length of an ant', 'mm'], ['the height of a door', 'm'], ['the length of a fingernail', 'mm'], ['the width of a book', 'cm'], ['the distance between two cities', 'km'],
          ['the mass of a paper clip', 'g'], ['the mass of a dog', 'kg'], ['the water in a bathtub', 'L'], ['the medicine in a spoon', 'mL'], ['the area of a stamp', 'cm²'], ['the area of a soccer field', 'm²']];
        var it = R.pick(lv === 1 ? items.slice(1, 8) : items), pool = ['mm', 'cm', 'm', 'km', 'g', 'kg', 'mL', 'L', 'cm²', 'm²'].filter(function (u) { return u !== it[1]; });
        if (lv === 3) {
          var n = R.int(2, 9), big = R.pick([['km', 'm', 1000], ['kg', 'g', 1000], ['m', 'cm', 100], ['L', 'mL', 1000]]), x = n * big[2] + R.pick([-1, 1]) * R.int(1, 3) * big[2] / 10;
          var bigger = x > n * big[2] ? x + ' ' + big[1] : n + ' ' + big[0];
          var o3 = R.mc(bigger, [x > n * big[2] ? n + ' ' + big[0] : x + ' ' + big[1], 'They are equal']);
          return { q: 'Which is more: <b>' + n + ' ' + big[0] + '</b> or <b>' + A.fmt(x) + ' ' + big[1] + '</b>?', type: 'mc', options: o3.options.map(function (s) { return s.replace(/^(\d+)/, function (m) { return A.fmt(m); }); }), answer: o3.answer,
            hint: 'Change ' + n + ' ' + big[0] + ' into ' + big[1] + ' first.', steps: ['1 ' + big[0] + ' = ' + A.fmt(big[2]) + ' ' + big[1] + '.' + stair(kindOf(big[0]), big[0], big[1]), n + ' ' + big[0] + ' = ' + A.fmt(n * big[2]) + ' ' + big[1] + '.', 'Compare ' + A.fmt(n * big[2]) + ' and ' + A.fmt(x) + '.'],
            explain: n + ' ' + big[0] + ' = ' + A.fmt(n * big[2]) + ' ' + big[1] + ', so ' + bigger.replace(/^(\d+)/, function (m) { return A.fmt(m); }) + ' is more.' };
        }
        var o = R.mc(it[1], R.shuffle(pool));
        return { q: 'Which unit is best for measuring <b>' + it[0] + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'First decide: is it length, mass, capacity or area? Then think about the size.',
          steps: ['Decide what is being measured.', 'Pick a unit of that kind that gives a number that is not too big or too small.', 'The best unit is ' + it[1] + '.'], explain: it[1] + ' fits ' + it[0] + '.' };
      } },
      { id: 'me-conv', name: 'Convert to smaller units', code: 'E2.2', gen: function (lv) {
        var u = R.pick(lv === 1 ? ['m', 'cm', 'kg', 'L'] : ['km', 'm', 'kg', 'L', 'cm']), c = UNITS[u];
        var x = lv === 1 ? R.int(2, 9) : lv === 2 ? A.clean(R.int(11, 99) / 10) : A.clean(R.int(101, 999) / 100);
        var ans = A.clean(x * c.f);
        return { q: 'Convert: <span class="math">' + x + ' ' + u + ' = ? ' + c.to + '</span>', fig: lv === 1 ? stair(c.kind, u, c.to) : '', type: 'num', answer: ans, unit: c.to, hint: '1 ' + u + ' = ' + A.fmt(c.f) + ' ' + c.to + '. Going to a smaller unit, multiply.',
          steps: ['1 ' + u + ' = ' + A.fmt(c.f) + ' ' + c.to + '.' + (lv > 1 ? stair(c.kind, u, c.to) : ''), 'Multiply: ' + x + ' &times; ' + A.fmt(c.f) + '.', 'Each digit moves ' + (String(c.f).length - 1) + (c.f === 10 ? ' place' : ' places') + ' left: ' + A.fmt(ans) + ' ' + c.to + '.'],
          explain: x + ' ' + u + ' = ' + A.fmt(ans) + ' ' + c.to + '.' };
      } },
      { id: 'me-angle', name: 'Measure and estimate angles', code: 'E2.3, E2.4', gen: function (lv) {
        var t = lv === 1 ? R.pick([30, 45, 60, 90, 120, 135, 150, 170]) : lv === 2 ? R.int(2, 17) * 10 : R.int(4, 34) * 5;
        if (lv === 1) {
          var o = R.mc(kind(t), ['acute', 'right', 'obtuse', 'straight']);
          return { q: 'What kind of angle is this?', fig: protractor(t, 'An angle on a protractor'), type: 'mc', options: o.options, answer: o.answer, hint: 'Compare it with a square corner (90&deg;).',
            steps: ['A right angle is a square corner, 90&deg;.', 'This angle is ' + t + '&deg;.', t < 90 ? 'Less than 90&deg; is acute.' : t === 90 ? 'Exactly 90&deg; is right.' : 'Between 90&deg; and 180&deg; is obtuse.'], explain: t + '&deg; is ' + kind(t) + '.' };
        }
        return { q: 'What angle does the protractor show?', fig: protractor(t, 'An angle on a protractor'), type: 'num', answer: t, unit: '&deg;',
          hint: 'Start at 0 on the bottom-right arm. Is the angle smaller or bigger than 90&deg;?',
          steps: ['The bottom arm lines up with 0 on the right.', 'The angle is ' + (t < 90 ? 'less' : t === 90 ? 'exactly' : 'more') + ' than a right angle, so use the scale that starts at 0 on the right.', 'The other arm crosses at ' + t + '&deg;.'],
          explain: 'The angle is ' + t + '&deg;, ' + (/^[aeiou]/.test(kind(t)) ? 'an ' : 'a ') + kind(t) + ' angle.' };
      } },
      { id: 'me-area', name: 'Area of parallelograms and triangles', code: 'E2.5', gen: function (lv) {
        var sh = lv === 1 ? 'para' : lv === 2 ? 'tri' : R.pick(['para', 'tri']), b = R.int(3, 14), h = R.int(2, 10);
        if (sh === 'tri' && (b * h) % 2) b++;
        var ar = sh === 'tri' ? b * h / 2 : b * h, side = h + R.int(1, 3);
        var word = lv === 3 ? (sh === 'para' ? 'A parallelogram has a base of ' + b + ' cm, a height of ' + h + ' cm and slanted sides of ' + side + ' cm. What is its area?' : 'A triangle has a base of ' + b + ' cm and a height of ' + h + ' cm. What is its area?') : 'What is the area of this ' + (sh === 'tri' ? 'triangle' : 'parallelogram') + '?';
        return { q: word, fig: lv < 3 ? shape(sh, b, h) : '', type: 'num', answer: ar, unit: 'cm²', hint: sh === 'tri' ? 'Base times height, then half.' : 'Base times height. Ignore the slanted side.',
          steps: ['Base = ' + b + ' cm, height = ' + h + ' cm' + (lv === 3 && sh === 'para' ? ' (the ' + side + ' cm side is not used)' : '') + '.' + (lv === 3 ? shape(sh, b, h) : ''), sh === 'tri' ? b + ' &times; ' + h + ' = ' + b * h + ', which is the parallelogram with the same base and height.' : 'A = b &times; h.', sh === 'tri' ? 'Half of ' + b * h + ' is ' + ar + ' cm&sup2;.' : b + ' &times; ' + h + ' = ' + ar + ' cm&sup2;.'],
          explain: 'Area = ' + ar + ' cm&sup2;.' };
      } },
      { id: 'me-perim', name: 'Area and perimeter', code: 'E2.6', gen: function (lv) {
        if (lv === 1) {
          var w = R.int(2, 12), h = R.int(2, 9);
          return { q: 'What is the perimeter of a rectangle ' + w + ' cm by ' + h + ' cm?', fig: rect(w, h, Math.min(30, 300 / w)), type: 'num', answer: 2 * (w + h), unit: 'cm', hint: 'Add all four sides.',
            steps: ['The sides are ' + w + ', ' + h + ', ' + w + ' and ' + h + ' cm.', 'Add them: ' + w + ' + ' + h + ' + ' + w + ' + ' + h + '.', 'Perimeter = ' + 2 * (w + h) + ' cm.'], explain: '2 &times; (' + w + ' + ' + h + ') = ' + 2 * (w + h) + ' cm.' };
        }
        var a = R.pick([12, 16, 18, 20, 24, 30, 36]), opts = [];
        for (var x = 1; x <= a; x++) if (a % x === 0 && x <= a / x) opts.push([a / x, x]);
        if (lv === 2) {
          var p = R.pick(opts), w2 = R.int(0, 1) ? p[0] : p[1], other = a / w2;
          return { q: 'A rectangle has an area of ' + a + ' cm&sup2;. One side is ' + w2 + ' cm. What is its perimeter?', type: 'num', answer: 2 * (w2 + other), unit: 'cm', hint: 'First find the other side: ' + a + ' &divide; ' + w2 + '.',
            steps: ['Area = length &times; width, so the other side is ' + a + ' &divide; ' + w2 + ' = ' + other + ' cm.' + (Math.max(w2, other) <= 18 ? rect(Math.max(w2, other), Math.min(w2, other), Math.min(20, 300 / Math.max(w2, other))) : ''), 'Perimeter = 2 &times; (' + w2 + ' + ' + other + ').', '= ' + 2 * (w2 + other) + ' cm.'], explain: 'The rectangle is ' + w2 + ' by ' + other + ', so P = ' + 2 * (w2 + other) + ' cm.' };
        }
        var best = opts[opts.length - 1], right = best[0] + ' cm by ' + best[1] + ' cm';
        var o = R.mc(right, opts.slice(0, -1).map(function (q) { return q[0] + ' cm by ' + q[1] + ' cm'; }));
        return { q: 'Each rectangle has an area of ' + a + ' cm&sup2;. Which one has the <b>smallest</b> perimeter?', type: 'mc', options: o.options, answer: o.answer, hint: 'Find each perimeter, or remember: the closer to a square, the smaller the perimeter.',
          steps: opts.map(function (q) { return q[0] + ' by ' + q[1] + ': P = ' + 2 * (q[0] + q[1]) + ' cm.'; }).slice(0, 3).concat(['The smallest is ' + right + ', with P = ' + 2 * (best[0] + best[1]) + ' cm.']),
          explain: right + ' is closest to a square, so its perimeter (' + 2 * (best[0] + best[1]) + ' cm) is smallest.' };
      } }
    ]
  });
})();
