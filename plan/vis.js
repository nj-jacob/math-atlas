/* Math Plan: drawings and helpers shared by the question bank.
   Every drawing is an SVG string. Parts a student can touch carry class "tap" and data-v (their value):
   touching them lights them up and the page shows the running count. */
(function () {
  var V = {};

  /* ---------- numbers and random choices ---------- */
  V.rng = function (seed) {
    var s = (seed >>> 0) || 1;
    function next() { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }
    return {
      next: next,
      int: function (a, b) { return a + Math.floor(next() * (b - a + 1)); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      shuffle: function (arr) { arr = arr.slice(); for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(next() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; },
      chance: function (p) { return next() < p; }
    };
  };
  /* Canadian style: a space in numbers with 5 or more digits (12 345), none in 4-digit numbers (4305). */
  V.fmt = function (n) {
    var neg = n < 0, s = String(Math.abs(n)), parts = s.split('.'), w = parts[0];
    if (w.length >= 5) w = w.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : '') + w + (parts.length > 1 ? '.' + parts[1] : '');
  };
  V.dec = function (n, places) { return V.fmt(Number(n.toFixed(places))); };
  V.money = function (cents) {
    var neg = cents < 0; cents = Math.abs(Math.round(cents));
    var d = Math.floor(cents / 100), c = cents % 100;
    return (neg ? '−' : '') + '$' + V.fmt(d) + '.' + (c < 10 ? '0' : '') + c;
  };
  V.cents = function (c) { return c >= 100 && c % 100 === 0 ? '$' + c / 100 : c + '¢'; };
  V.fr = function (n, d) { return '<span class="fr"><i>' + n + '</i><i>' + d + '</i></span>'; };
  V.mixed = function (w, n, d) { return '<span class="mx">' + w + V.fr(n, d) + '</span>'; };
  V.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  V.neg = function (n) { return n < 0 ? '−' + Math.abs(n) : String(n); };
  V.par = function (n) { return n < 0 ? '(−' + Math.abs(n) + ')' : String(n); };

  /* Multiple choice: the right answer plus up to 3 different wrong ones, shuffled. */
  V.mc = function (r, ans, wrongs, keep) {
    var seen = {}, list = [];
    seen[String(ans)] = 1;
    (wrongs || []).forEach(function (w) { var k = String(w); if (!seen[k] && w !== undefined && w !== null && k !== 'NaN') { seen[k] = 1; list.push(w); } });
    list = list.slice(0, keep || 3);
    var all = keep === 'all' ? [ans].concat(list) : r.shuffle([ans].concat(list));
    return { type: 'mc', choices: all.map(String), ans: all.indexOf(ans) };
  };
  /* Choices in a fixed order (for words like "impossible, possible, certain"). */
  V.ordered = function (ans, list) { return { type: 'mc', choices: list.slice(), ans: list.indexOf(ans), fixed: true }; };
  V.num = function (ans, unit) { return { type: 'num', ans: ans, unit: unit || '' }; };

  function svg(w, h, body, label, cls, grow) {
    return '<svg class="vis' + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + (label || '') + '" style="max-width:' + Math.round(Math.max(w * (grow || 1), 160)) + 'px">' + body + '</svg>';
  }
  V.svg = svg;
  function t(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.fs || 15) + '"' + (o.w ? ' font-weight="' + o.w + '"' : '') + ' class="' + (o.c || 'tx') + '">' + s + '</text>';
  }
  V.t = t;

  /* ---------- manipulatives ---------- */
  /* Base-ten blocks: hundreds flats, tens rods, ones cubes. */
  V.blocks = function (n, opt) {
    opt = opt || {};
    var th = Math.floor(n / 1000), h = Math.floor(n / 100) % 10, te = Math.floor(n / 10) % 10, o = n % 10, s = '', x = 6, y = 6, u = 6, rowH = 66, right = 0;
    var maxW = opt.maxW || 420;
    function wrap(w) { if (x + w > maxW) { x = 6; y += rowH; } right = Math.max(right, x + w); }
    for (var k = 0; k < th; k++) {
      wrap(78);
      s += '<g class="tap thousand" data-v="1000"><rect x="' + (x + 12) + '" y="' + y + '" width="60" height="60" class="b-h" /><path d="M' + (x + 12) + ' ' + y + 'l-12 12v60h60l12-12" class="b-h b-side"/>' +
        '<rect x="' + x + '" y="' + (y + 12) + '" width="60" height="60" class="b-h"/>' + grid(x, y + 12, 10, 10) + '</g>';
      x += 84;
    }
    for (k = 0; k < h; k++) {
      wrap(64);
      s += '<g class="tap" data-v="100"><rect x="' + x + '" y="' + y + '" width="60" height="60" rx="1" class="b-h"/>' + grid(x, y, 10, 10) + '</g>';
      x += 66;
    }
    for (k = 0; k < te; k++) {
      wrap(10);
      s += '<g class="tap" data-v="10"><rect x="' + x + '" y="' + y + '" width="' + u + '" height="60" class="b-t"/>' + grid(x, y, 1, 10) + '</g>';
      x += 10;
    }
    if (te) x += 6;
    for (k = 0; k < o; k++) {
      var cx = x + (k % 2) * 10, cy = y + 48 - Math.floor(k / 2) * 10;
      if (k % 2 === 0 && k > 0 && x + 20 > maxW) { x = 6; y += rowH; cx = x; cy = y + 48; }
      s += '<rect class="tap b-o" data-v="1" x="' + cx + '" y="' + cy + '" width="' + (u + 1) + '" height="' + (u + 1) + '"/>';
      right = Math.max(right, cx + 8);
    }
    var W = right + 6;
    return svg(W, y + 66, s, n + ' shown with base-ten blocks', 'blocks', W < 200 ? 1.7 : 1.3);
  };
  function grid(x, y, c, r) {
    var s = '<path class="b-grid" d="';
    for (var i = 1; i < c; i++) s += 'M' + (x + i * 6) + ' ' + y + 'v' + r * 6;
    for (i = 1; i < r; i++) s += 'M' + x + ' ' + (y + i * 6) + 'h' + c * 6;
    return s + '"/>';
  }
  /* Counters in ten-frames. */
  V.frames = function (n, opt) {
    opt = opt || {};
    var frames = Math.max(1, Math.ceil(n / 10)), per = opt.cols || 2, s = '', fw = 5 * 30 + 8, fh = 2 * 30 + 8;
    for (var f = 0; f < frames; f++) {
      var fx = 4 + (f % per) * (fw + 12), fy = 4 + Math.floor(f / per) * (fh + 12);
      s += '<rect x="' + fx + '" y="' + fy + '" width="' + fw + '" height="' + fh + '" rx="6" class="frame"/>';
      for (var c = 0; c < 10; c++) {
        var cx = fx + 4 + (c % 5) * 30 + 15, cy = fy + 4 + Math.floor(c / 5) * 30 + 15, i = f * 10 + c;
        s += '<rect x="' + (cx - 15) + '" y="' + (cy - 15) + '" width="30" height="30" class="cell"/>';
        if (i < n) s += '<circle class="tap ctr' + (opt.two && i >= opt.two ? ' ctr2' : '') + '" data-v="1" cx="' + cx + '" cy="' + cy + '" r="11"/>';
      }
    }
    var rows = Math.ceil(frames / per);
    return svg(Math.min(frames, per) * (fw + 12), rows * (fh + 12), s, n + ' counters', 'frames');
  };
  /* Loose counters in equal groups (circles around each group). */
  V.groups = function (g, each, opt) {
    opt = opt || {};
    var s = '', gw = 92, per = Math.min(g, 4);
    for (var i = 0; i < g; i++) {
      var gx = 6 + (i % per) * (gw + 10), gy = 6 + Math.floor(i / per) * (gw + 10);
      s += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + gw + '" rx="40" class="grp"/>';
      for (var k = 0; k < each; k++) {
        var a = (k / each) * Math.PI * 2, rr = each === 1 ? 0 : 26;
        s += '<circle class="tap ctr" data-v="1" cx="' + (gx + gw / 2 + rr * Math.cos(a)) + '" cy="' + (gy + gw / 2 + rr * Math.sin(a)) + '" r="10"/>';
      }
    }
    return svg(per * (gw + 10) + 2, Math.ceil(g / per) * (gw + 10) + 2, s, g + ' groups of ' + each);
  };
  /* An array: rows of dots. */
  V.array = function (rows, cols) {
    var s = '', d = cols > 10 ? 20 : 26;
    for (var i = 0; i < rows; i++) {
      s += '<g class="tap rowtap" data-v="' + cols + '">';
      for (var j = 0; j < cols; j++) s += '<circle class="ctr" cx="' + (16 + j * d) + '" cy="' + (16 + i * d) + '" r="' + (d / 2 - 3) + '"/>';
      s += '</g>';
    }
    return svg(cols * d + 8, rows * d + 8, s, rows + ' rows of ' + cols);
  };
  /* Canadian coins and bills. */
  var COIN = { 5: [21, 'silver', '5¢'], 10: [18, 'silver', '10¢'], 25: [23, 'silver', '25¢'], 100: [25, 'gold', '$1'], 200: [27, 'two', '$2'] };
  var BILL = { 500: 'b5', 1000: 'b10', 2000: 'b20', 5000: 'b50', 10000: 'b100' };
  V.coins = function (list) {
    var s = '', x = 6, y = 6, rowH = 62, maxW = 400;
    list.forEach(function (v) {
      if (BILL[v]) {
        if (x + 104 > maxW) { x = 6; y += rowH; }
        s += '<g class="tap" data-v="' + v + '"><rect x="' + x + '" y="' + (y + 4) + '" width="100" height="50" rx="5" class="bill ' + BILL[v] + '"/>' + t(x + 50, y + 36, '$' + v / 100, { fs: 20, w: 700, c: 'billtx' }) + '</g>';
        x += 108;
      } else {
        var c = COIN[v], r = c[0];
        if (x + 2 * r + 6 > maxW) { x = 6; y += rowH; }
        var cx = x + r, cy = y + 30;
        s += '<g class="tap" data-v="' + v + '"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="coin ' + c[1] + '"/>' +
          (c[1] === 'two' ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 8) + '" class="coin gold"/>' : '') +
          t(cx, cy + 5, c[2], { fs: 14, w: 700, c: 'cointx' }) + '</g>';
        x += 2 * r + 8;
      }
    });
    return svg(maxW + 4, y + rowH + 2, s, 'coins and bills', 'coins');
  };
  V.money.coinName = { 5: 'nickel', 10: 'dime', 25: 'quarter', 100: 'loonie', 200: 'toonie' };

  /* ---------- number lines, fractions ---------- */
  V.line = function (a, b, step, opt) {
    opt = opt || {};
    var W = 420, x0 = 24, x1 = W - 24, s = '<line x1="' + (x0 - 12) + '" y1="40" x2="' + (x1 + 12) + '" y2="40" class="ax" marker-end="url(#ar)"/>', n = Math.round((b - a) / step);
    function X(v) { return x0 + (v - a) / (b - a) * (x1 - x0); }
    for (var i = 0; i <= n; i++) {
      var v = a + i * step, lab = opt.labels ? opt.labels(v, i) : V.fmt(Math.round(v * 1000) / 1000);
      s += '<line x1="' + X(v) + '" y1="32" x2="' + X(v) + '" y2="48" class="ax"/>';
      if (lab !== '') s += t(X(v), 68, lab, { fs: 13 });
    }
    (opt.marks || []).forEach(function (m) {
      s += '<circle cx="' + X(m.v) + '" cy="40" r="8" class="mark ' + (m.c || '') + '"/>' + (m.label ? t(X(m.v), 20, m.label, { w: 700 }) : '');
    });
    return svg(W, 78, '<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" class="axf"/></marker></defs>' + s, 'number line');
  };
  V.fbar = function (d, shaded, opt) {
    opt = opt || {};
    var W = opt.w || 360, s = '', pw = W / d;
    for (var i = 0; i < d; i++) s += '<rect class="tap fpart' + (i < shaded ? ' sh' : '') + '" data-v="1" x="' + (4 + i * pw) + '" y="4" width="' + pw + '" height="44"/>';
    return svg(W + 8, 52, s, shaded + ' of ' + d + ' parts shaded');
  };
  V.fcircle = function (d, shaded, r) {
    r = r || 60;
    var s = '', cx = r + 4, cy = r + 4;
    if (d === 1) return svg(2 * r + 8, 2 * r + 8, '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="fpart' + (shaded ? ' sh' : '') + '"/>');
    for (var i = 0; i < d; i++) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d;
      s += '<path class="tap fpart' + (i < shaded ? ' sh' : '') + '" data-v="1" d="M' + cx + ' ' + cy + 'L' + (cx + r * Math.cos(a0)).toFixed(2) + ' ' + (cy + r * Math.sin(a0)).toFixed(2) +
        'A' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + (cx + r * Math.cos(a1)).toFixed(2) + ' ' + (cy + r * Math.sin(a1)).toFixed(2) + 'Z"/>';
    }
    return svg(2 * r + 8, 2 * r + 8, s, shaded + ' of ' + d + ' parts shaded');
  };
  /* Several small drawings side by side, each with a letter, for "which picture" questions. */
  V.row = function (items) {
    return '<div class="vrow">' + items.map(function (h, i) { return '<figure>' + h + '<figcaption>' + 'ABCD'[i] + '</figcaption></figure>'; }).join('') + '</div>';
  };
  /* A 10 by 10 hundredths grid with some squares shaded. */
  V.hgrid = function (shaded, tenths) {
    var s = '', c = 22;
    var cells = tenths ? 10 : 100;
    for (var i = 0; i < cells; i++) {
      var x = tenths ? 4 + i * c : 4 + (i % 10) * c, y = 4;
      var w = c, h = tenths ? 10 * c : c;
      if (!tenths) { x = 4 + Math.floor(i / 10) * c; y = 4 + (i % 10) * c; }
      s += '<rect class="tap fpart' + (i < shaded ? ' sh' : '') + '" data-v="1" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>';
    }
    return svg(10 * c + 8, 10 * c + 8, s, shaded + (tenths ? ' tenths' : ' hundredths') + ' shaded');
  };

  /* ---------- data ---------- */
  V.bars = function (labels, vals, step, opt) {
    opt = opt || {};
    var max = Math.max.apply(null, vals), top = Math.ceil(max / step) * step, H = 180, x0 = 44, bw = 50, gap = 22, W = x0 + labels.length * (bw + gap) + 10, s = '';
    for (var v = 0; v <= top; v += step) {
      var y = 10 + H - v / top * H;
      s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (W - 6) + '" y2="' + y + '" class="gl"/>' + t(x0 - 8, y + 5, V.fmt(v), { a: 'end', fs: 13 });
    }
    labels.forEach(function (l, i) {
      var h = vals[i] / top * H, x = x0 + gap / 2 + i * (bw + gap);
      s += '<rect class="tap bar c' + (i % 5) + '" data-v="' + vals[i] + '" x="' + x + '" y="' + (10 + H - h) + '" width="' + bw + '" height="' + h + '"/>' + t(x + bw / 2, H + 30, l, { fs: 13 });
    });
    return svg(W, H + 40, s, opt.label || 'bar graph', 'bars');
  };
  V.picto = function (labels, counts, key, opt) {
    opt = opt || {};
    var s = '', rowH = 34, lw = 92;
    labels.forEach(function (l, i) {
      var y = 6 + i * rowH;
      s += t(lw - 8, y + 21, l, { a: 'end', fs: 14 });
      var full = Math.floor(counts[i] / key), half = counts[i] % key;
      for (var k = 0; k < full + (half ? 1 : 0); k++) {
        var cx = lw + 14 + k * 30;
        if (k === full) s += '<path class="tap pic" data-v="' + half + '" d="M' + cx + ' ' + (y + 4) + 'a12 12 0 0 0 0 24z"/>';
        else s += '<circle class="tap pic" data-v="' + key + '" cx="' + cx + '" cy="' + (y + 16) + '" r="12"/>';
      }
    });
    var maxK = Math.max.apply(null, counts.map(function (c) { return Math.ceil(c / key); }));
    if (key > 1) s += '<circle class="pic" cx="' + (lw + 14) + '" cy="' + (labels.length * rowH + 20) + '" r="10"/>' + t(lw + 30, labels.length * rowH + 25, '= ' + key, { a: 'start', fs: 14 });
    return svg(lw + 30 + maxK * 30, labels.length * rowH + (key > 1 ? 40 : 10), s, 'pictograph');
  };
  V.spinner = function (parts) {
    var r = 70, cx = 76, cy = 76, s = '', n = parts.length;
    parts.forEach(function (p, i) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
      s += '<path class="sp ' + p + '" d="M' + cx + ' ' + cy + 'L' + (cx + r * Math.cos(a0)).toFixed(2) + ' ' + (cy + r * Math.sin(a0)).toFixed(2) + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(2) + ' ' + (cy + r * Math.sin(a1)).toFixed(2) + 'Z"/>';
    });
    s += '<g class="needle"><path d="M' + cx + ' ' + cy + 'l-5 0l5 -52l5 52z" class="ndl"/><circle cx="' + cx + '" cy="' + cy + '" r="6" class="ndl"/></g>';
    return svg(152, 152, s, 'spinner', 'spin');
  };
  V.marbles = function (list) {
    var s = '';
    s += '<path d="M10 20 q0 100 70 100 q70 0 70 -100" class="bag"/>';
    list.forEach(function (c, i) { s += '<circle class="tap mb ' + c + '" data-v="1" cx="' + (36 + (i % 5) * 22) + '" cy="' + (100 - Math.floor(i / 5) * 22) + '" r="10"/>'; });
    return svg(160, 126, s, 'a bag of marbles');
  };

  /* ---------- shapes and measuring ---------- */
  V.poly = function (n, opt) {
    opt = opt || {};
    var r = opt.r || 46, cx = r + 6, cy = r + 6, pts = [];
    for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + Math.PI / n + i * 2 * Math.PI / n; pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
    return svg(2 * r + 12, 2 * r + 12, '<polygon class="tap shp" data-v="1" points="' + pts.join(' ') + '"/>', n + '-sided shape');
  };
  V.shape = function (kind) {
    var s;
    if (kind === 'circle') s = '<circle class="shp" cx="50" cy="50" r="42"/>';
    else if (kind === 'square') s = '<rect class="shp" x="12" y="12" width="76" height="76"/>';
    else if (kind === 'rectangle') s = '<rect class="shp" x="4" y="24" width="92" height="52"/>';
    else if (kind === 'triangle') s = '<polygon class="shp" points="50,8 94,88 6,88"/>';
    else if (kind === 'rhombus') s = '<polygon class="shp" points="50,4 92,50 50,96 8,50"/>';
    else if (kind === 'trapezoid') s = '<polygon class="shp" points="28,20 72,20 96,82 4,82"/>';
    else if (kind === 'parallelogram') s = '<polygon class="shp" points="30,20 96,20 70,82 4,82"/>';
    else if (kind === 'oval') s = '<ellipse class="shp" cx="50" cy="50" rx="46" ry="30"/>';
    return svg(100, 100, s, kind);
  };
  /* Simple line drawings of 3D objects. */
  V.solid = function (kind) {
    var s = '';
    if (kind === 'cube') s = '<path class="shp" d="M10 34h56v56h-56z"/><path class="shp s2" d="M10 34l22-22h56l-22 22z"/><path class="shp s3" d="M66 34l22-22v56l-22 22z"/>';
    else if (kind === 'prism') s = '<path class="shp" d="M6 44h70v46h-70z"/><path class="shp s2" d="M6 44l18-20h70l-18 20z"/><path class="shp s3" d="M76 44l18-20v46l-18 20z"/>';
    else if (kind === 'pyramid') s = '<path class="shp s3" d="M50 8L88 72L60 90z"/><path class="shp" d="M50 8L12 80L60 90z"/>';
    else if (kind === 'cylinder') s = '<path class="shp" d="M14 22v58a36 12 0 0 0 72 0v-58"/><ellipse class="shp s2" cx="50" cy="22" rx="36" ry="12"/>';
    else if (kind === 'cone') s = '<path class="shp" d="M50 8L14 80a36 12 0 0 0 72 0z"/>';
    else if (kind === 'sphere') s = '<circle class="shp" cx="50" cy="50" r="40"/><ellipse class="s-eq" cx="50" cy="50" rx="40" ry="12"/>';
    else if (kind === 'tri-prism') s = '<path class="shp" d="M8 88L30 50L52 88z"/><path class="shp s2" d="M30 50L70 20L92 58L52 88z"/><path class="shp s3" d="M8 88L52 88L92 58" fill="none"/>';
    return svg(100, 100, s, kind);
  };
  /* A box with its three measurements. */
  V.box = function (l, w, h, unit) {
    var s = '<path class="shp" d="M10 60h120v70h-120z"/><path class="shp s2" d="M10 60l40-36h120l-40 36z"/><path class="shp s3" d="M130 60l40-36v70l-40 36z"/>';
    s += t(70, 150, l + ' ' + unit) + t(166, 118, w + ' ' + unit, { a: 'start' }) + t(4, 100, h + ' ' + unit, { a: 'end' });
    return svg(230, 158, '<g transform="translate(40 0)">' + s + '</g>', 'box ' + l + ' by ' + w + ' by ' + h + ' ' + unit);
  };
  V.cyl = function (r, h, unit) {
    var s = '<path class="shp" d="M20 30v100a60 18 0 0 0 120 0v-100"/><ellipse class="shp s2" cx="80" cy="30" rx="60" ry="18"/><line x1="80" y1="30" x2="140" y2="30" class="dim"/>';
    s += t(110, 24, 'r = ' + r + ' ' + unit, { fs: 14 }) + '<line x1="152" y1="30" x2="152" y2="130" class="dim"/>' + t(158, 86, h + ' ' + unit, { a: 'start', fs: 14 });
    return svg(220, 160, s, 'cylinder');
  };
  /* Rectangle drawn on a grid of unit squares (tappable squares). */
  V.rgrid = function (w, h, opt) {
    opt = opt || {};
    var c = opt.c || 28, s = '';
    for (var i = 0; i < h; i++) for (var j = 0; j < w; j++) s += '<rect class="tap sq" data-v="1" x="' + (4 + j * c) + '" y="' + (4 + i * c) + '" width="' + c + '" height="' + c + '"/>';
    return svg(w * c + 8, h * c + 8, s, w + ' by ' + h + ' rectangle on a grid');
  };
  V.rect = function (w, h, lw, lh, opt) {
    opt = opt || {};
    var sc = Math.min(260 / w, 130 / h), W = w * sc, H = h * sc;
    var s = '<rect class="shp" x="50" y="14" width="' + W + '" height="' + H + '"/>' + t(50 + W / 2, 14 + H + 24, lw) + t(42, 14 + H / 2 + 5, lh, { a: 'end' });
    return svg(W + 70, H + 44, s, 'rectangle');
  };
  V.tri = function (b, h, unit) {
    var s = '<polygon class="shp" points="20,140 240,140 170,20"/><line x1="170" y1="20" x2="170" y2="140" class="dim dash"/><path d="M170 128h12v12" class="dim"/>' +
      t(130, 164, b + ' ' + unit) + t(178, 90, h + ' ' + unit, { a: 'start' });
    return svg(260, 172, s, 'triangle base ' + b + ' height ' + h);
  };
  V.para = function (b, h, unit) {
    var s = '<polygon class="shp" points="20,140 200,140 250,30 70,30"/><line x1="200" y1="30" x2="200" y2="140" class="dim dash"/><path d="M200 128h-12v12" class="dim"/>' +
      t(110, 164, b + ' ' + unit) + t(206, 96, h + ' ' + unit, { a: 'start' });
    return svg(270, 172, s, 'parallelogram base ' + b + ' height ' + h);
  };
  V.trap = function (a, b, h, unit) {
    var s = '<polygon class="shp" points="20,140 250,140 190,40 80,40"/><line x1="80" y1="40" x2="80" y2="140" class="dim dash"/>' +
      t(135, 30, a + ' ' + unit) + t(135, 164, b + ' ' + unit) + t(74, 96, h + ' ' + unit, { a: 'end' });
    return svg(270, 172, s, 'trapezoid');
  };
  V.rtri = function (a, b, c, unit) {
    /* right angle at bottom left; legs a (up) and b (across); c is the slanted side ('?' allowed) */
    var s = '<polygon class="shp" points="40,20 40,150 230,150"/><path d="M40 136h14v14" class="dim"/>' +
      t(32, 90, a + ' ' + unit, { a: 'end' }) + t(135, 174, b + ' ' + unit) + t(146, 76, c + (c === '?' ? '' : ' ' + unit), { a: 'start', w: 700 });
    return svg(260, 182, s, 'right triangle');
  };
  V.circ = function (r, unit, show) {
    var s = '<circle class="shp" cx="90" cy="90" r="76"/><circle cx="90" cy="90" r="3" class="ndl"/>';
    if (show === 'd') s += '<line x1="14" y1="90" x2="166" y2="90" class="dim"/>' + t(90, 82, 'd = ' + r * 2 + ' ' + unit, { w: 700 });
    else s += '<line x1="90" y1="90" x2="166" y2="90" class="dim"/>' + t(128, 82, 'r = ' + r + ' ' + unit, { w: 700 });
    return svg(180, 180, s, 'circle');
  };
  V.angle = function (deg, opt) {
    opt = opt || {};
    var cx = 30, cy = 120, L = 120, a = deg * Math.PI / 180, s = '';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + L + 40) + '" y2="' + cy + '" class="arm"/>';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + L * Math.cos(a)).toFixed(1) + '" y2="' + (cy - L * Math.sin(a)).toFixed(1) + '" class="arm"/>';
    if (deg === 90) s += '<path d="M' + cx + ' ' + (cy - 18) + 'h18v18" class="dim"/>';
    else s += '<path d="M' + (cx + 26) + ' ' + cy + 'A26 26 0 ' + (deg > 180 ? 1 : 0) + ' 0 ' + (cx + 26 * Math.cos(a)).toFixed(1) + ' ' + (cy - 26 * Math.sin(a)).toFixed(1) + '" class="arc"/>';
    if (opt.label) s += t(cx + 44 * Math.cos(a / 2), cy - 44 * Math.sin(a / 2) + 5, opt.label, { w: 700, a: 'start' });
    var minX = Math.min(0, cx + L * Math.cos(a)) - 10;
    return '<svg class="vis" viewBox="' + minX + ' 0 ' + (200 - minX) + ' 132" role="img" aria-label="an angle" style="max-width:' + (220 - minX) + 'px">' + s + '</svg>';
  };
  /* Two parallel lines cut by a transversal; label one angle with a number and ask for another. */
  V.parallel = function (given, ask) {
    /* positions: 1..4 around top crossing, 5..8 around bottom crossing; given angle value at position 1 (top-right, acute side) */
    var s = '<line x1="10" y1="50" x2="290" y2="50" class="arm"/><line x1="10" y1="140" x2="290" y2="140" class="arm"/><line x1="100" y1="185" x2="210" y2="5" class="arm"/>';
    var tx = 100 + (185 - 50) / 180 * 110, bx = 100 + (185 - 140) / 180 * 110;
    s += t(tx + 26, 42, given.top || '', { w: 700 }) + t(tx - 26, 68, given.topOpp || '', { w: 700 });
    s += t(bx + 26, 132, given.bot || '', { w: 700 }) + t(bx - 26, 158, given.botOpp || '', { w: 700 });
    s += t(tx - 26, 42, given.topL || '', { w: 700 }) + t(bx - 26, 132, given.botL || '', { w: 700 }) + t(bx + 26, 158, given.botR || '', { w: 700 }) + t(tx + 26, 68, given.topR || '', { w: 700 });
    return svg(300, 190, s, 'two parallel lines and a crossing line');
  };
  /* Ruler in centimetres with an object (bar) above it. */
  V.ruler = function (len, start) {
    start = start || 0;
    var u = 26, s = '', n = Math.max(len + start + 1, 8);
    s += '<rect x="10" y="50" width="' + (n * u + 10) + '" height="40" rx="3" class="ruler"/>';
    for (var i = 0; i <= n; i++) {
      s += '<line x1="' + (15 + i * u) + '" y1="50" x2="' + (15 + i * u) + '" y2="66" class="tick"/>' + t(15 + i * u, 84, i, { fs: 12 });
      if (i < n) s += '<line x1="' + (15 + i * u + u / 2) + '" y1="50" x2="' + (15 + i * u + u / 2) + '" y2="58" class="tick"/>';
    }
    s += '<rect x="' + (15 + start * u) + '" y="14" width="' + len * u + '" height="26" rx="13" class="pencil"/>';
    return svg(n * u + 30, 96, s, 'ruler in centimetres');
  };
  V.lengths = function (lens) {
    var s = '';
    lens.forEach(function (l, i) { s += t(14, 30 + i * 38, 'ABCD'[i], { w: 700 }) + '<rect x="30" y="' + (14 + i * 38) + '" width="' + l * 26 + '" height="22" rx="11" class="tap pencil c' + i + '" data-v="1"/>'; });
    return svg(30 + Math.max.apply(null, lens) * 26 + 10, lens.length * 38 + 6, s, 'strips of different lengths');
  };
  V.clock = function (h, m) {
    var s = '<circle cx="80" cy="80" r="74" class="clk"/>';
    for (var i = 1; i <= 12; i++) { var a = (i * 30 - 90) * Math.PI / 180; s += t((80 + 58 * Math.cos(a)).toFixed(1), (80 + 58 * Math.sin(a) + 6).toFixed(1), i, { fs: 16, w: 700 }); }
    for (i = 0; i < 60; i++) { var b = i * 6 * Math.PI / 180, r0 = i % 5 ? 70 : 66; s += '<line x1="' + (80 + r0 * Math.sin(b)).toFixed(1) + '" y1="' + (80 - r0 * Math.cos(b)).toFixed(1) + '" x2="' + (80 + 74 * Math.sin(b)).toFixed(1) + '" y2="' + (80 - 74 * Math.cos(b)).toFixed(1) + '" class="tick"/>'; }
    var ha = ((h % 12) + m / 60) * 30 * Math.PI / 180, ma = m * 6 * Math.PI / 180;
    s += '<line x1="80" y1="80" x2="' + (80 + 36 * Math.sin(ha)).toFixed(1) + '" y2="' + (80 - 36 * Math.cos(ha)).toFixed(1) + '" class="hand hh"/>';
    s += '<line x1="80" y1="80" x2="' + (80 + 56 * Math.sin(ma)).toFixed(1) + '" y2="' + (80 - 56 * Math.cos(ma)).toFixed(1) + '" class="hand mh"/><circle cx="80" cy="80" r="5" class="ndl"/>';
    return svg(160, 160, s, 'a clock');
  };
  V.calendar = function (month, startDay, days) {
    var s = '', c = 40, D = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    s += t(144, 20, month, { w: 700, fs: 16 });
    D.forEach(function (d, i) { s += t(4 + i * c + c / 2, 46, d, { w: 700, fs: 13 }); });
    for (var d = 1; d <= days; d++) {
      var p = startDay + d - 1, x = 4 + (p % 7) * c, y = 54 + Math.floor(p / 7) * 30;
      s += '<rect x="' + x + '" y="' + y + '" width="' + c + '" height="30" class="cal"/>' + t(x + c / 2, y + 20, d, { fs: 13 });
    }
    return svg(7 * c + 8, 54 + Math.ceil((startDay + days) / 7) * 30 + 4, s, month + ' calendar');
  };
  /* Coordinate grid with labelled points. quad4 = all four quadrants. */
  V.plane = function (pts, opt) {
    opt = opt || {};
    var n = opt.n || 6, q4 = !!opt.q4, lo = q4 ? -n : 0, c = q4 ? 18 : 30, size = (n - lo) * c, ox = 24 - lo * c, oy = 10 + n * c, s = '';
    for (var i = lo; i <= n; i++) {
      s += '<line x1="' + (ox + i * c) + '" y1="10" x2="' + (ox + i * c) + '" y2="' + (10 + size) + '" class="gl"/>';
      s += '<line x1="' + (ox + lo * c) + '" y1="' + (oy - i * c) + '" x2="' + (ox + n * c) + '" y2="' + (oy - i * c) + '" class="gl"/>';
      if (i !== 0 || !q4) { s += t(ox + i * c, oy + 16, V.neg(i), { fs: 11 }); s += t(ox - 8, oy - i * c + 4, i === 0 ? '' : V.neg(i), { fs: 11, a: 'end' }); }
    }
    s += '<line x1="' + (ox + lo * c) + '" y1="' + oy + '" x2="' + (ox + n * c) + '" y2="' + oy + '" class="ax"/><line x1="' + ox + '" y1="10" x2="' + ox + '" y2="' + (10 + size) + '" class="ax"/>';
    pts.forEach(function (p) { s += '<circle class="mark" cx="' + (ox + p[0] * c) + '" cy="' + (oy - p[1] * c) + '" r="6"/>' + t(ox + p[0] * c + 10, oy - p[1] * c - 8, p[2], { w: 700, a: 'start' }); });
    return svg(size + 48, size + 34, s, 'coordinate grid');
  };
  /* A row of pattern pieces. Codes: c=circle s=square t=triangle; colours via suffix. '?' = blank. */
  V.pattern = function (seq) {
    var s = '', w = 44;
    seq.forEach(function (p, i) {
      var x = 6 + i * w, cx = x + 20;
      if (p === '?') s += '<rect x="' + x + '" y="6" width="40" height="40" rx="8" class="blank"/>' + t(cx, 33, '?', { w: 700, fs: 20 });
      else if (p[0] === 'c') s += '<circle class="tap pp ' + p + '" data-v="1" cx="' + cx + '" cy="26" r="17"/>';
      else if (p[0] === 's') s += '<rect class="tap pp ' + p + '" data-v="1" x="' + (x + 4) + '" y="10" width="32" height="32" rx="3"/>';
      else if (p[0] === 't') s += '<polygon class="tap pp ' + p + '" data-v="1" points="' + cx + ',8 ' + (cx + 19) + ',44 ' + (cx - 19) + ',44"/>';
    });
    return svg(seq.length * w + 10, 52, s, 'pattern');
  };
  /* Growing pattern: towers of squares. */
  V.towers = function (counts) {
    var s = '', c = 14, x = 6, top = Math.max.apply(null, counts);
    counts.forEach(function (n, i) {
      var cols = Math.min(n, 3), rows = Math.ceil(n / 3);
      for (var k = 0; k < n; k++) s += '<rect class="tap sq on2" data-v="1" x="' + (x + (k % 3) * c) + '" y="' + (8 + Math.ceil(top / 3) * c - (Math.floor(k / 3) + 1) * c) + '" width="' + c + '" height="' + c + '"/>';
      s += t(x + cols * c / 2, Math.ceil(top / 3) * c + 30, 'Step ' + (i + 1), { fs: 12 });
      x += Math.max(cols * c, 46) + 18;
    });
    return svg(x, Math.ceil(top / 3) * c + 36, s, 'growing pattern');
  };
  V.table = function (head, rows) {
    return '<table class="vt"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  };
  V.balance = function (left, right) {
    var s = '<path d="M150 150l-24 24h48z" class="stand"/><line x1="150" y1="40" x2="150" y2="150" class="arm"/><line x1="30" y1="40" x2="270" y2="40" class="arm"/>' +
      '<path d="M10 90h100l-14 22h-72z" class="pan"/><path d="M190 90h100l-14 22h-72z" class="pan"/><line x1="30" y1="40" x2="40" y2="90" class="thin"/><line x1="30" y1="40" x2="80" y2="90" class="thin"/>' +
      '<line x1="270" y1="40" x2="220" y2="90" class="thin"/><line x1="270" y1="40" x2="260" y2="90" class="thin"/>' + t(60, 107, left, { w: 700, fs: 16 }) + t(240, 107, right, { w: 700, fs: 16 });
    return svg(300, 180, s, 'balance: ' + left + ' and ' + right);
  };
  /* A street-map style grid with objects, for position and direction. */
  V.map = function (items, n) {
    n = n || 5;
    var c = 44, s = '';
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) s += '<rect x="' + (4 + j * c) + '" y="' + (4 + i * c) + '" width="' + c + '" height="' + c + '" class="cal"/>';
    items.forEach(function (it) { s += '<text x="' + (4 + it[0] * c + c / 2) + '" y="' + (4 + it[1] * c + c / 2 + 8) + '" text-anchor="middle" font-size="24">' + it[2] + '</text>'; });
    return svg(n * c + 8, n * c + 8, s, 'map grid');
  };

  window.PV = V;
})();
