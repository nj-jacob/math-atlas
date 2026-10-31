(function () {
  var A = Atlas, R = A.R;
  var PI = '&pi;', SQ = '<sup>2</sup>', CU = '<sup>3</sup>';
  function r1(x) { return Math.round(x * 10) / 10; }
  function f1(x) { return A.fmt(r1(x)); }
  function sq4(x) { return A.fmt(Math.round(x * x * 10000) / 10000); }
  function sqrtS(n) { return '&radic;' + A.fmt(n); }
  /* answers that use pi or a square root: accept a small rounding difference */
  function approx(o, plainUnit) {
    o.tol = Math.max(0.1, Math.abs(o.answer) * 0.005);
    o.show = f1(o.answer) + (plainUnit ? ' ' + plainUnit : '');
    return o;
  }
  var ROUND = ' Round to one decimal place.';
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

  /* right triangle, legs a (across) and b (up), right angle at bottom left */
  function rtri(a, b, la, lb, lc, unk) {
    var u = Math.min(250 / a, 150 / b), W = a * u, H = b * u, x0 = 80, y0 = H + 24;
    var s = '<polygon points="' + x0 + ',' + y0 + ' ' + (x0 + W) + ',' + y0 + ' ' + x0 + ',' + (y0 - H) + '" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<path d="M' + (x0 + 16) + ' ' + y0 + ' V' + (y0 - 16) + ' H' + x0 + '" fill="none" style="stroke:var(--ink)" stroke-width="1.5"/>';
    function lab(t, x, y, anc, k) { return t ? '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anc + '" font-size="18" class="tb"' + (unk === k ? ' style="fill:var(--accent)"' : '') + '>' + t + '</text>' : ''; }
    var L = Math.sqrt(W * W + H * H), nx = H / L, ny = -W / L;
    s += lab(la, x0 + W / 2, y0 + 24, 'middle', 'a') + lab(lb, x0 - 10, y0 - H / 2 + 6, 'end', 'b') + lab(lc, x0 + W / 2 + nx * 18, y0 - H / 2 + ny * 18 + 6, 'start', 'c');
    return A.svg(400, Math.ceil(H + 60), s, 'A right triangle. The side along the bottom is ' + (la || 'unlabelled') + ', the upright side is ' + (lb || 'unlabelled') + ', and the sloping side, the hypotenuse, is ' + (lc || 'unlabelled') + '.');
  }
  /* squares built on each side of a right triangle */
  function psq(a, b) {
    var u = Math.min(380 / (a + 2 * b), 330 / (2 * a + b)), x0 = 10 + b * u + (380 - (a + 2 * b) * u) / 2, y0 = 10 + (a + b) * u;
    var c2 = a * a + b * b, s = '', i;
    function sq(pts, col) { return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" style="fill:color-mix(in srgb,' + col + ' 26%,var(--card));stroke:' + col + '" stroke-width="2"/>'; }
    s += sq([[x0, y0], [x0 + a * u, y0], [x0 + a * u, y0 + a * u], [x0, y0 + a * u]], 'var(--strand)');
    s += sq([[x0 - b * u, y0 - b * u], [x0, y0 - b * u], [x0, y0], [x0 - b * u, y0]], 'var(--sb)');
    var Ax = x0 + a * u, Bx = x0, By = y0 - b * u;
    s += sq([[Ax, y0], [Bx, By], [Bx + b * u, By - a * u], [Ax + b * u, y0 - a * u]], 'var(--accent)');
    for (i = 1; i < a; i++) s += '<line x1="' + (x0 + i * u).toFixed(1) + '" y1="' + y0 + '" x2="' + (x0 + i * u).toFixed(1) + '" y2="' + (y0 + a * u).toFixed(1) + '" style="stroke:var(--strand)" stroke-opacity=".45"/><line x1="' + x0 + '" y1="' + (y0 + i * u).toFixed(1) + '" x2="' + (x0 + a * u).toFixed(1) + '" y2="' + (y0 + i * u).toFixed(1) + '" style="stroke:var(--strand)" stroke-opacity=".45"/>';
    for (i = 1; i < b; i++) s += '<line x1="' + (x0 - i * u).toFixed(1) + '" y1="' + (y0 - b * u).toFixed(1) + '" x2="' + (x0 - i * u).toFixed(1) + '" y2="' + y0 + '" style="stroke:var(--sb)" stroke-opacity=".45"/><line x1="' + (x0 - b * u).toFixed(1) + '" y1="' + (y0 - i * u).toFixed(1) + '" x2="' + x0 + '" y2="' + (y0 - i * u).toFixed(1) + '" style="stroke:var(--sb)" stroke-opacity=".45"/>';
    s += '<polygon points="' + x0 + ',' + y0 + ' ' + Ax + ',' + y0 + ' ' + Bx + ',' + By + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>';
    function t(x, y, txt) { return '<text x="' + x.toFixed(1) + '" y="' + (y + 6).toFixed(1) + '" text-anchor="middle" font-size="17" class="tb" style="paint-order:stroke;stroke:var(--card);stroke-width:4px">' + txt + '</text>'; }
    s += t(x0 + a * u / 2, y0 + a * u / 2, a * a) + t(x0 - b * u / 2, y0 - b * u / 2, b * b) + t((Ax + Bx + b * u) / 2, (y0 + By - a * u) / 2, c2);
    return A.svg(400, Math.ceil((2 * a + b) * u + 20), s, 'A right triangle with legs ' + a + ' and ' + b + '. The square on the first leg has area ' + a * a + ', the square on the second leg has area ' + b * b + ', and the square on the hypotenuse has area ' + c2 + ', which is the sum of the other two.');
  }
  /* the same big square cut two ways */
  function rearr() {
    var a = 3, b = 4, u = 170 / 7, s = '';
    function P(ox, pts) { return pts.map(function (p) { return (ox + p[0] * u).toFixed(1) + ',' + (10 + p[1] * u).toFixed(1); }).join(' '); }
    function poly(ox, pts, col, pc) { return '<polygon points="' + P(ox, pts) + '" style="fill:color-mix(in srgb,' + col + ' ' + (pc || 26) + '%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>'; }
    function t(ox, x, y, txt) { return '<text x="' + (ox + x * u).toFixed(1) + '" y="' + (16 + y * u).toFixed(1) + '" text-anchor="middle" font-size="18" class="tb">' + txt + '</text>'; }
    var L = 10, T = 'var(--line)';
    s += poly(L, [[0, 0], [7, 0], [7, 7], [0, 7]], 'var(--card)', 0);
    [[[0, 0], [3, 0], [0, 4]], [[7, 0], [7, 3], [3, 0]], [[7, 7], [4, 7], [7, 3]], [[0, 7], [0, 4], [4, 7]]].forEach(function (tr) { s += poly(L, tr, 'var(--ink)', 14); });
    s += poly(L, [[3, 0], [7, 3], [4, 7], [0, 4]], 'var(--accent)', 30) + t(L, 3.5, 3.5, 'c²');
    var Rx = 220;
    s += poly(Rx, [[0, 0], [3, 0], [3, 3], [0, 3]], 'var(--strand)', 30) + poly(Rx, [[3, 3], [7, 3], [7, 7], [3, 7]], 'var(--sb)', 30);
    [[[3, 0], [7, 0], [7, 3]], [[3, 0], [3, 3], [7, 3]], [[0, 3], [3, 3], [0, 7]], [[3, 3], [3, 7], [0, 7]]].forEach(function (tr) { s += poly(Rx, tr, 'var(--ink)', 14); });
    s += t(Rx, 1.5, 1.5, 'a²') + t(Rx, 5, 5, 'b²');
    s += '<text x="95" y="208" text-anchor="middle" font-size="16" class="t2">4 triangles + c²</text><text x="305" y="208" text-anchor="middle" font-size="16" class="t2">4 triangles + a² + b²</text>';
    return A.svg(400, 216, s, 'Two equal big squares. The left one holds 4 right triangles and a tilted square c squared. The right one holds the same 4 triangles, plus a squared and b squared. Since the big squares match, c squared equals a squared plus b squared.');
  }
  /* circle cut into 12 slices, then laid out as a near rectangle */
  function slices() {
    var s = '', R = 55, cx = 72, cy = 100, i;
    for (i = 0; i < 12; i++) {
      var a1 = i * Math.PI / 6, a2 = (i + 1) * Math.PI / 6;
      s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + R * Math.cos(a1)).toFixed(1) + ' ' + (cy + R * Math.sin(a1)).toFixed(1) + ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R * Math.cos(a2)).toFixed(1) + ' ' + (cy + R * Math.sin(a2)).toFixed(1) + ' Z" style="fill:' + (i % 2 ? 'color-mix(in srgb,var(--strand) 45%,var(--card))' : 'color-mix(in srgb,var(--accent) 30%,var(--card))') + ';stroke:var(--ink)" stroke-width="1"/>';
    }
    var w = R * Math.PI / 6, x = 160, top = 45, bot = top + R;
    for (i = 0; i < 6; i++) {
      var l = x + i * w;
      s += '<path d="M' + (l + w / 2).toFixed(1) + ' ' + top + ' L' + l.toFixed(1) + ' ' + bot + ' Q' + (l + w / 2).toFixed(1) + ' ' + (bot + 4) + ' ' + (l + w).toFixed(1) + ' ' + bot + ' Z" style="fill:color-mix(in srgb,var(--accent) 30%,var(--card));stroke:var(--ink)" stroke-width="1"/>';
      s += '<path d="M' + (l + w).toFixed(1) + ' ' + bot + ' L' + (l + w / 2).toFixed(1) + ' ' + top + ' Q' + (l + w).toFixed(1) + ' ' + (top - 4) + ' ' + (l + w * 1.5).toFixed(1) + ' ' + top + ' Z" style="fill:color-mix(in srgb,var(--strand) 45%,var(--card));stroke:var(--ink)" stroke-width="1"/>';
    }
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R) + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="2.5"/><text x="' + (cx + R / 2) + '" y="' + (cy - 6) + '" text-anchor="middle" font-size="17" class="tb" style="paint-order:stroke;stroke:var(--card);stroke-width:4px">r</text>';
    s += '<text x="' + (x + 3 * w + w / 4) + '" y="' + (bot + 26) + '" text-anchor="middle" font-size="17" class="tb">about &pi;r</text>';
    s += '<text x="' + (x + 6.5 * w + 8).toFixed(1) + '" y="' + (top + R / 2 + 6) + '" font-size="17" class="tb">r</text>';
    s += '<text x="200" y="182" text-anchor="middle" font-size="17">area &asymp; &pi;r &times; r = &pi;r²</text>';
    return A.svg(400, 192, s, 'A circle cut into 12 slices. The slices are laid side by side, pointing up and down, to make a shape close to a rectangle. Its length is about half the circumference, pi times r, and its height is r, so the area is about pi r squared.');
  }
  /* circle with radius, r-squared square and the circumference unrolled */
  function circW(r) {
    var cx = 90, cy = 85, R = 62, s = '';
    s += '<rect x="' + cx + '" y="' + (cy - R) + '" width="' + R + '" height="' + R + '" fill="none" style="stroke:var(--sb)" stroke-width="2" stroke-dasharray="5 3"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" style="fill:color-mix(in srgb,var(--strand) 20%,transparent);stroke:var(--strand)" stroke-width="3"/>';
    s += '<line x1="' + (cx - R) + '" y1="' + cy + '" x2="' + cx + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R) + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<text x="' + (cx + R / 2) + '" y="' + (cy + 20) + '" text-anchor="middle" font-size="17" class="tb">r</text><text x="' + (cx + R / 2) + '" y="' + (cy - R / 2 + 6) + '" text-anchor="middle" font-size="16" class="tb" style="fill:var(--sb)">r²</text>';
    var d = r * 2, C = Math.PI * d, Ar = Math.PI * r * r;
    s += '<text x="180" y="40" font-size="17">r = ' + A.fmt(r) + ' cm</text><text x="180" y="66" font-size="17">d = ' + A.fmt(d) + ' cm</text><text x="180" y="98" font-size="17" class="tb">C &asymp; ' + f1(C) + ' cm</text><text x="180" y="124" font-size="17" class="tb">A &asymp; ' + f1(Ar) + ' cm²</text>';
    var y = 190, D = 108, x0 = 20;
    s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + Math.PI * D).toFixed(1) + '" y2="' + y + '" style="stroke:var(--strand)" stroke-width="6" stroke-linecap="round"/>';
    for (var k = 0; k <= 3; k++) s += '<line x1="' + (x0 + k * D) + '" y1="' + (y - 10) + '" x2="' + (x0 + k * D) + '" y2="' + (y + 10) + '" style="stroke:var(--ink)" stroke-width="2"/>' + (k ? '<text x="' + (x0 + k * D - D / 2) + '" y="' + (y - 14) + '" text-anchor="middle" font-size="16" class="t2">d</text>' : '');
    s += '<text x="' + (x0 + 3 * D + 8) + '" y="' + (y + 30) + '" text-anchor="end" font-size="16" class="t2">a bit more than 3 diameters</text>';
    return A.svg(400, 228, s, 'A circle with radius ' + r + ' cm. Circumference about ' + f1(C) + ' cm, area about ' + f1(Ar) + ' square centimetres. Below, the circumference is unrolled: it is a little more than 3 diameters long. The area is a little more than 3 squares of side r.');
  }
  /* composite shapes */
  function comp(t, d) {
    var s = '', u, x0 = 30, y0 = 20, W, H, txt = '', fill = 'style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--ink)" stroke-width="2.5"';
    function lab(x, y, tt, anc) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + (anc || 'middle') + '" font-size="17" class="tb">' + tt + '</text>'; }
    if (t === 'semi') {
      u = Math.min(270 / (d.w + d.h / 2), 160 / d.h); W = d.w * u; H = d.h * u; x0 = 70;
      s += '<path d="M' + x0 + ' ' + y0 + ' H' + (x0 + W) + ' A' + H / 2 + ' ' + H / 2 + ' 0 0 1 ' + (x0 + W) + ' ' + (y0 + H) + ' H' + x0 + ' Z" ' + fill + '/>';
      s += '<line x1="' + (x0 + W) + '" y1="' + y0 + '" x2="' + (x0 + W) + '" y2="' + (y0 + H) + '" style="stroke:var(--ink)" stroke-dasharray="5 4"/>';
      s += lab(x0 + W / 2, y0 + H + 24, d.w + ' cm') + lab(x0 - 6, y0 + H / 2 + 6, d.h + ' cm', 'end');
      txt = 'A rectangle ' + d.w + ' cm by ' + d.h + ' cm with a half circle on its right end. The half circle has a diameter of ' + d.h + ' cm.';
      return A.svg(400, Math.ceil(H + 56), s, txt);
    }
    if (t === 'house') {
      u = Math.min(300 / d.w, 190 / (d.h + d.t)); W = d.w * u; H = d.h * u; var T = d.t * u; x0 = 60; y0 = 14 + T;
      s += '<path d="M' + x0 + ' ' + y0 + ' L' + (x0 + W / 2) + ' ' + (y0 - T) + ' L' + (x0 + W) + ' ' + y0 + ' V' + (y0 + H) + ' H' + x0 + ' Z" ' + fill + '/>';
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + W) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-dasharray="5 4"/><line x1="' + (x0 + W / 2) + '" y1="' + (y0 - T) + '" x2="' + (x0 + W / 2) + '" y2="' + y0 + '" style="stroke:var(--accent)" stroke-width="2" stroke-dasharray="3 3"/>';
      s += lab(x0 + W / 2 + 10, y0 - T / 2 + 6, d.t + ' cm', 'start') + lab(x0 + W / 2, y0 + H + 24, d.w + ' cm') + lab(x0 - 6, y0 + H / 2 + 6, d.h + ' cm', 'end');
      return A.svg(400, Math.ceil(y0 + H + 34), s, 'A house shape: a rectangle ' + d.w + ' cm wide and ' + d.h + ' cm tall, with a triangle on top that is ' + d.t + ' cm tall.');
    }
    if (t === 'L') {
      u = Math.min(280 / d.W, 180 / d.H); W = d.W * u; H = d.H * u; var cw = d.cw * u, ch = d.ch * u; x0 = 70;
      s += '<path d="M' + x0 + ' ' + y0 + ' H' + (x0 + W - cw) + ' V' + (y0 + ch) + ' H' + (x0 + W) + ' V' + (y0 + H) + ' H' + x0 + ' Z" ' + fill + '/>';
      s += '<rect x="' + (x0 + W - cw) + '" y="' + y0 + '" width="' + cw + '" height="' + ch + '" fill="none" style="stroke:var(--accent)" stroke-dasharray="5 4"/>';
      s += lab(x0 + W / 2, y0 + H + 24, d.W + ' cm') + lab(x0 - 6, y0 + H / 2 + 6, d.H + ' cm', 'end') + lab(x0 + W - cw / 2, y0 + ch / 2 + 6, d.cw + ' &times; ' + d.ch, 'middle');
      return A.svg(400, Math.ceil(H + 54), s, 'An L shape: a ' + d.W + ' cm by ' + d.H + ' cm rectangle with a ' + d.cw + ' cm by ' + d.ch + ' cm corner cut out of the top right.');
    }
    /* ring */
    var Rr = 80, rr = Rr * d.r / d.R, cx = 200, cy = 95;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + Rr + '" ' + fill + '/><circle cx="' + cx + '" cy="' + cy + '" r="' + rr.toFixed(1) + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Rr) + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + cx + '" y1="' + cy + '" x2="' + (cx - rr * 0.7).toFixed(1) + '" y2="' + (cy - rr * 0.7).toFixed(1) + '" style="stroke:var(--accent)" stroke-width="2"/>';
    s += lab(cx + Rr / 2 + rr / 2, cy + 22, d.R + ' cm') + lab(cx - rr * 0.35 - 6, cy - rr * 0.35 - 4, d.r, 'end');
    return A.svg(400, 186, s, 'A ring: a circle of radius ' + d.R + ' cm with a circle of radius ' + d.r + ' cm cut from the middle.');
  }
  /* 3D sketches. Depth goes up and to the right at half scale. */
  function solid(t, d, labels) {
    var s = '', k = 0.42, line = 'style="stroke:var(--ink)" stroke-width="2"', dash = 'style="stroke:var(--ink)" stroke-width="1.2" stroke-dasharray="4 3"';
    function L(x1, y1, x2, y2, st) { return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" ' + (st || line) + '/>'; }
    function lab(x, y, tt, anc) { return tt ? '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + (anc || 'middle') + '" font-size="17" class="tb">' + tt + '</text>' : ''; }
    function face(pts, pc) { return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" style="fill:color-mix(in srgb,var(--strand) ' + pc + '%,var(--card));stroke:var(--ink)" stroke-width="2"/>'; }
    var lb = labels || {};
    if (t === 'box') {
      var u = Math.min(230 / (d.l + d.w * k), 130 / (d.h + d.w * k * 0.6)), l = d.l * u, h = d.h * u, dx = d.w * u * k, dy = d.w * u * k * 0.6, x0 = 70, y0 = 20 + dy + h;
      s += L(x0 + dx, y0 - dy, x0 + dx, y0 - dy - h, dash) + L(x0 + dx, y0 - dy, x0, y0, dash) + L(x0 + dx, y0 - dy, x0 + l + dx, y0 - dy, dash);
      s += face([[x0, y0 - h], [x0 + l, y0 - h], [x0 + l + dx, y0 - h - dy], [x0 + dx, y0 - h - dy]], 12);
      s += face([[x0 + l, y0], [x0 + l + dx, y0 - dy], [x0 + l + dx, y0 - h - dy], [x0 + l, y0 - h]], 30);
      s += '<rect x="' + x0 + '" y="' + (y0 - h).toFixed(1) + '" width="' + l.toFixed(1) + '" height="' + h.toFixed(1) + '" style="fill:color-mix(in srgb,var(--strand) 20%,transparent);stroke:var(--ink)" stroke-width="2"/>';
      s += lab(x0 + l / 2, y0 + 22, lb.l) + lab(x0 - 6, y0 - h / 2 + 6, lb.h, 'end') + lab(x0 + l + dx / 2 + 8, y0 - dy / 2 + 14, lb.w, 'start');
      return A.svg(400, Math.ceil(y0 + 32), s, 'A rectangular prism' + (lb.l ? ', ' + lb.l + ' long, ' + lb.w + ' deep and ' + lb.h + ' tall' : '') + '.');
    }
    if (t === 'cyl') {
      var uc = Math.min(110 / d.r, 140 / d.h), rx = d.r * uc, ry = Math.max(8, rx * 0.28), hh = d.h * uc, cx = 180, ty = 34 + ry, by = ty + hh;
      s += '<path d="M' + (cx - rx) + ' ' + ty + ' V' + by + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + by + ' V' + ty + '" style="fill:color-mix(in srgb,var(--strand) 20%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
      s += '<path d="M' + (cx - rx) + ' ' + by + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + by + '" fill="none" ' + dash + '/>';
      s += '<ellipse cx="' + cx + '" cy="' + ty + '" rx="' + rx + '" ry="' + ry + '" style="fill:color-mix(in srgb,var(--strand) 38%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
      s += L(cx, ty, cx + rx, ty) + lab(cx + rx / 2, ty - ry - 8, lb.r) + lab(cx + rx + 8, ty + hh / 2 + 6, lb.h, 'start');
      return A.svg(400, Math.ceil(by + ry + 12), s, 'A cylinder' + (lb.r ? ' with radius ' + lb.r + ' and height ' + lb.h : '') + '.');
    }
    /* triangular prism: right-triangle end with legs b (across) and a (up), length len going back */
    var ut = Math.min(200 / (d.b + d.len * k), 140 / (d.a + d.len * k * 0.6)), B = d.b * ut, H = d.a * ut, ddx = d.len * ut * k, ddy = d.len * ut * k * 0.6, x1 = 70, y1 = 16 + ddy + H;
    s += L(x1 + ddx, y1 - ddy, x1, y1, dash) + L(x1 + ddx, y1 - ddy, x1 + B + ddx, y1 - ddy, dash) + L(x1 + ddx, y1 - ddy, x1 + ddx, y1 - ddy - H, dash);
    s += face([[x1, y1 - H], [x1 + B, y1], [x1 + B + ddx, y1 - ddy], [x1 + ddx, y1 - H - ddy]], 14);
    s += face([[x1, y1], [x1 + B, y1], [x1, y1 - H]], 36);
    s += '<path d="M' + (x1 + 12) + ' ' + y1 + ' V' + (y1 - 12) + ' H' + x1 + '" fill="none" style="stroke:var(--ink)" stroke-width="1.2"/>';
    s += lab(x1 + B / 2, y1 + 22, lb.b) + lab(x1 - 6, y1 - H / 2 + 6, lb.a, 'end') + lab(x1 + B + ddx / 2 + 8, y1 - ddy / 2 + 14, lb.len, 'start') + lab(x1 + B / 2 + 14, y1 - H / 2 - 4, lb.c, 'start');
    return A.svg(400, Math.ceil(y1 + 32), s, 'A triangular prism. Each end is a right triangle' + (lb.b ? ' with legs ' + lb.b + ' and ' + lb.a + (lb.c ? ' and hypotenuse ' + lb.c : '') + '. The prism is ' + lb.len + ' long' : '') + '.');
  }
  /* nets for the widget */
  function boxNet(l, w, h) {
    var u = Math.min(380 / (l + 2 * h), 320 / (2 * w + 2 * h)), x0 = 10 + (380 - (l + 2 * h) * u) / 2, s = '';
    var C = { lw: 'var(--strand)', lh: 'var(--sb)', wh: 'var(--accent)' };
    function f(cx, cy, cw, chh, key, area) {
      var X = x0 + cx * u, Y = 6 + cy * u, Wd = cw * u, Hd = chh * u;
      return '<rect x="' + X.toFixed(1) + '" y="' + Y.toFixed(1) + '" width="' + Wd.toFixed(1) + '" height="' + Hd.toFixed(1) + '" style="fill:color-mix(in srgb,' + C[key] + ' 28%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>' +
        (Wd >= 26 && Hd >= 22 ? '<text x="' + (X + Wd / 2).toFixed(1) + '" y="' + (Y + Hd / 2 + 6).toFixed(1) + '" text-anchor="middle" font-size="16" class="tb">' + area + '</text>' : '');
    }
    s += f(h, 0, l, w, 'lw', l * w) + f(h, w, l, h, 'lh', l * h) + f(h, w + h, l, w, 'lw', l * w) + f(h, 2 * w + h, l, h, 'lh', l * h) + f(0, w + h, h, w, 'wh', w * h) + f(h + l, w + h, h, w, 'wh', w * h);
    return A.svg(400, Math.ceil((2 * w + 2 * h) * u + 12), s, 'The net of the box: six rectangles in three matching pairs. Two are ' + l + ' by ' + w + ', two are ' + l + ' by ' + h + ', and two are ' + w + ' by ' + h + '.');
  }
  function cylNet(r, h) {
    var c = 2 * Math.PI * r, u = Math.min(380 / c, 300 / (h + 4 * r)), W = c * u, x0 = 10 + (380 - W) / 2, R = r * u, y0 = 6 + 2 * R, s = '';
    var cx = x0 + W / 2;
    s += '<circle cx="' + cx.toFixed(1) + '" cy="' + (y0 - R).toFixed(1) + '" r="' + R.toFixed(1) + '" style="fill:color-mix(in srgb,var(--accent) 28%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>';
    s += '<rect x="' + x0.toFixed(1) + '" y="' + y0.toFixed(1) + '" width="' + W.toFixed(1) + '" height="' + (h * u).toFixed(1) + '" style="fill:color-mix(in srgb,var(--strand) 28%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>';
    s += '<circle cx="' + cx.toFixed(1) + '" cy="' + (y0 + h * u + R).toFixed(1) + '" r="' + R.toFixed(1) + '" style="fill:color-mix(in srgb,var(--accent) 28%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>';
    if (h * u >= 22) s += '<text x="' + cx.toFixed(1) + '" y="' + (y0 + h * u / 2 + 6).toFixed(1) + '" text-anchor="middle" font-size="16" class="tb">' + f1(c) + ' &times; ' + h + '</text>';
    return A.svg(400, Math.ceil(h * u + 4 * R + 14), s, 'The net of the cylinder: two circles of radius ' + r + ' and a rectangle ' + h + ' tall whose length is the circumference, about ' + f1(c) + '.');
  }

  var html =
'<section class="sec"><h2><span class="n">1</span>The Pythagorean relationship</h2>' +
'<p>In a right triangle, the longest side is across from the right angle. It is called the <b>hypotenuse</b>, c. The two shorter sides, a and b, are called <b>legs</b>.</p>' +
'<p>Build a square on each side. The two smaller squares together have exactly the same area as the big one.</p>' +
'<p style="text-align:center;font-size:1.15rem"><b>a' + SQ + ' + b' + SQ + ' = c' + SQ + '</b></p>' +
'<div class="lab"><span class="lt">Try it: build squares on the sides</span>' +
'<div class="ctrl"><label for="pya">Leg a: <output id="pyao"></output><input type="range" id="pya" min="1" max="12" value="3"></label><label for="pyb">Leg b: <output id="pybo"></output><input type="range" id="pyb" min="1" max="12" value="4"></label></div>' +
'<div class="fig" id="pyfig"></div><div class="out" id="pyout"></div></div>' +
'<p>Here is a second way to see it. Both big squares below are the same size and hold the same 4 triangles. What is left over must match too.</p>' +
'<div class="fig">' + rearr() + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A right triangle has legs of 6 cm and 8 cm. Find the hypotenuse.</p><ol><li>Square the legs: 6' + SQ + ' = 36 and 8' + SQ + ' = 64.</li><li>Add: 36 + 64 = 100. So c' + SQ + ' = 100.</li><li>Take the square root: c = &radic;100 = 10 cm.</li></ol></div>' +
A.yt({ q: 'A right triangle has legs of 5 cm and 12 cm. How long is the hypotenuse?', a: 13, unit: 'cm', back: 'Go back to step 1: square each leg, add, then take the square root.', ok: '25 + 144 = 169, and &radic;169 = 13 cm.' }) +
'<div class="key"><b class="t">Key idea</b><p>This only works for <b>right</b> triangles, and c is always the side across from the right angle.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Finding a missing side</h2>' +
'<p>If you know the hypotenuse and one leg, rearrange: <b>a' + SQ + ' = c' + SQ + ' &minus; b' + SQ + '</b>. You subtract, because the leg\'s square is the big square minus the other small one.</p>' +
'<div class="fig">' + rtri(1.4, 4.8, '1.4 m', 'h = ?', '5 m', 'b') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A 5 m ladder leans on a wall. Its foot is 1.4 m from the wall. How high up the wall does it reach?</p><ol><li>The ladder is the hypotenuse: c = 5. One leg is 1.4.</li><li>h' + SQ + ' = 5' + SQ + ' &minus; 1.4' + SQ + ' = 25 &minus; 1.96 = 23.04.</li><li>h = &radic;23.04 = 4.8 m.</li></ol></div>' +
A.yt({ q: 'A right triangle has a hypotenuse of 13 cm and one leg of 5 cm. How long is the other leg?', a: 12, unit: 'cm', back: 'Look at the rule above: subtract the leg\'s square from the hypotenuse\'s square, then take the square root.', ok: '169 &minus; 25 = 144, and &radic;144 = 12 cm.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding when you should subtract. Check your answer: a leg must be <b>shorter</b> than the hypotenuse.</p></div>' +
'<p><b>Is it a right triangle?</b> Test the sides. If the two smaller squares add to the largest square, there is a right angle. For 7, 24, 25: 49 + 576 = 625 = 25' + SQ + ', so yes. Builders use this with a 3 m, 4 m, 5 m string to check square corners.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Circles</h2>' +
'<p>The <b>radius</b> r goes from the centre to the edge. The <b>diameter</b> d goes all the way across, so d = 2r. The distance around is the <b>circumference</b>.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Find</th><th class="l">Formula</th></tr></thead><tbody><tr><td class="l">Circumference</td><td class="l math">C = &pi;d = 2&pi;r</td></tr><tr><td class="l">Area</td><td class="l math">A = &pi;r' + SQ + '</td></tr></tbody></table></div>' +
'<p>&pi; (pi) is about 3.14. Use the &pi; key on a calculator when you can.</p>' +
'<div class="lab"><span class="lt">Try it: change the radius</span>' +
'<div class="ctrl"><label for="cir">Radius: <output id="ciro"></output><input type="range" id="cir" min="1" max="50" value="5"></label></div>' +
'<div class="fig" id="cifig"></div><div class="out" id="ciout"></div></div>' +
'<p>Why &pi;r' + SQ + '? Cut a circle into thin slices and line them up:</p>' +
'<div class="fig">' + slices() + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A bike wheel has a diameter of 60 cm. How far does the bike roll in one turn? In 100 turns?</p><ol><li>One turn rolls one circumference: C = &pi; &times; 60 &asymp; 188.5 cm.</li><li>100 turns: 188.5 &times; 100 = 18 850 cm.</li><li>That is about 188.5 m.</li></ol></div>' +
A.yt({ q: 'A circle has a radius of 5 cm. What is its area, to one decimal place?', a: 25 * Math.PI, tol: 0.2, unit: 'cm' + SQ, show: '78.5', back: 'Use the table: A = &pi;r' + SQ + '. Square the radius first, then multiply by &pi;.', ok: '&pi; &times; 5' + SQ + ' = &pi; &times; 25 &asymp; 78.5 cm' + SQ + '.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Putting the diameter into &pi;r' + SQ + '. If you are given d, halve it first.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Composite shapes</h2>' +
'<p>A <b>composite</b> shape is made of simple shapes. Split it into pieces you know, find each area, then add (or subtract a piece that is cut out).</p>' +
'<div class="fig">' + comp('semi', { w: 10, h: 6 }) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Find the area and perimeter of the shape above.</p><ol><li>Rectangle: 10 &times; 6 = 60 cm' + SQ + '.</li><li>Half circle: the diameter is 6, so r = 3. Area = &pi; &times; 3' + SQ + ' &divide; 2 &asymp; 14.1 cm' + SQ + '.</li><li>Total area &asymp; 60 + 14.1 = 74.1 cm' + SQ + '.</li><li>Perimeter: only the outside edges. 10 + 6 + 10 = 26, plus half the circumference, &pi; &times; 6 &divide; 2 &asymp; 9.4. Total &asymp; 35.4 cm.</li></ol></div>' +
'<div class="fig">' + comp('house', { w: 8, h: 5, t: 3 }) + '</div>' +
A.yt({ q: 'The house shape is a rectangle 8 cm by 5 cm with a triangle 3 cm tall on top. What is its area?', a: 52, unit: 'cm' + SQ, back: 'Split it into the rectangle and the triangle. The triangle\'s area is base &times; height &divide; 2.', ok: '8 &times; 5 = 40, and 8 &times; 3 &divide; 2 = 12. Total: 52 cm' + SQ + '.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting the dashed join line in the perimeter. Perimeter is only the outside edge.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Volume of prisms and cylinders</h2>' +
'<p>A <b>prism</b> has the same cross-section all the way through. A <b>cylinder</b> is like a prism with a circle for its base. For all of them:</p>' +
'<p style="text-align:center;font-size:1.15rem"><b>Volume = area of base &times; height</b></p>' +
'<div class="tbl"><table><thead><tr><th class="l">Solid</th><th class="l">Base area</th><th class="l">Volume</th></tr></thead><tbody>' +
'<tr><td class="l">Rectangular prism</td><td class="l">l &times; w</td><td class="l math">V = lwh</td></tr><tr><td class="l">Triangular prism</td><td class="l">b &times; h &divide; 2</td><td class="l math">V = (bh &divide; 2) &times; length</td></tr><tr><td class="l">Cylinder</td><td class="l">&pi;r' + SQ + '</td><td class="l math">V = &pi;r' + SQ + 'h</td></tr></tbody></table></div>' +
'<div class="fig">' + solid('cyl', { r: 4, h: 10 }, { r: '4 cm', h: '10 cm' }) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A can has a radius of 4 cm and a height of 10 cm. Find its volume.</p><ol><li>Base area: &pi; &times; 4' + SQ + ' = &pi; &times; 16 &asymp; 50.27 cm' + SQ + '.</li><li>Volume: 50.27 &times; 10 &asymp; 502.7 cm' + CU + '.</li><li>Since 1000 cm' + CU + ' = 1 L, the can holds about 0.5 L.</li></ol></div>' +
A.yt({ q: 'A box is 5 cm long, 4 cm wide and 3 cm tall. What is its volume?', a: 60, unit: 'cm' + CU, back: 'Go back to the table: base area l &times; w, then times the height.', ok: '5 &times; 4 = 20 cm' + SQ + ', and 20 &times; 3 = 60 cm' + CU + '.' }) +
'<div class="key"><b class="t">Key idea</b><p>1 cm' + CU + ' holds 1 mL. 1000 cm' + CU + ' holds 1 L.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Surface area</h2>' +
'<p><b>Surface area</b> is the total area of every face, like the wrapping paper you need. Unfold the solid into a flat <b>net</b> and add the pieces.</p>' +
'<div class="lab"><span class="lt">Try it: unfold the solid</span>' +
'<div class="ctrl"><label for="sot">Solid<select id="sot"><option value="box">rectangular prism</option><option value="cyl">cylinder</option></select></label>' +
'<label for="so1"><span id="so1n">Length:</span> <output id="so1o"></output><input type="range" id="so1" min="1" max="10" value="5"></label><label for="so2">Width: <output id="so2o"></output><input type="range" id="so2" min="1" max="10" value="4"></label><label for="so3">Height: <output id="so3o"></output><input type="range" id="so3" min="1" max="10" value="3"></label></div>' +
'<div class="fig" id="sofig"></div><div class="out" id="soout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Find the surface area of the can with r = 4 cm and h = 10 cm.</p><ol><li>Two circles: 2 &times; &pi; &times; 4' + SQ + ' &asymp; 100.5 cm' + SQ + '.</li><li>The side unrolls into a rectangle. Its length is the circumference, 2 &times; &pi; &times; 4 &asymp; 25.13 cm, and its height is 10 cm. Area &asymp; 251.3 cm' + SQ + '.</li><li>Total &asymp; 100.5 + 251.3 = 351.9 cm' + SQ + '.</li></ol></div>' +
A.yt({ q: 'A box is 2 cm by 3 cm by 4 cm. What is its surface area?', a: 52, unit: 'cm' + SQ, back: 'There are three pairs of matching faces: 2 &times; 3, 2 &times; 4 and 3 &times; 4. Find each, add, then double.', ok: '6 + 8 + 12 = 26, and 26 &times; 2 = 52 cm' + SQ + '.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up units. Area is in square units (cm' + SQ + '). Volume is in cubic units (cm' + CU + ').</p></div>' +
'</section>';

  function triple(lv) {
    var t = R.pick(lv === 1 ? TRIPLES.slice(0, 2) : TRIPLES), k = lv === 1 ? R.pick([1, 2]) : R.pick([1, 2, 3]);
    return [t[0] * k, t[1] * k, t[2] * k];
  }
  var practice = [
    { id: 'ms-hyp', name: 'Find the hypotenuse', code: 'E2.4', gen: function (lv) {
      var a, b, c;
      if (lv < 3) {
        var t = triple(lv); a = t[0]; b = t[1]; c = t[2]; if (R.int(0, 1)) { var z = a; a = b; b = z; }
        var q = lv === 1 ? 'A right triangle has legs of ' + a + ' cm and ' + b + ' cm. How long is the hypotenuse?' : R.pick(['A TV screen is ' + a * 10 + ' cm wide and ' + b * 10 + ' cm tall. How long is its diagonal?', 'You walk ' + a * 10 + ' m east, then ' + b * 10 + ' m north. How far are you from where you started, in a straight line?']);
        var m = lv === 1 ? 1 : 10, u = lv === 1 ? 'cm' : (q.indexOf('TV') >= 0 ? 'cm' : 'm');
        return { q: q, type: 'num', answer: c * m, unit: u, fig: rtri(a, b, a * m + ' ' + u, b * m + ' ' + u, 'c = ?', 'c'),
          hint: 'The two given lengths are the legs. Square each, add, then take the square root.', steps: [a * m + SQ + ' = ' + A.fmt(a * a * m * m) + ' and ' + b * m + SQ + ' = ' + A.fmt(b * b * m * m) + '.', 'Add: ' + A.fmt(c * c * m * m) + '.', sqrtS(c * c * m * m) + ' = ' + c * m + '.'], explain: 'The answer is ' + c * m + ' ' + u + '.' };
      }
      a = R.int(2, 12); b = R.int(2, 12); var c2 = a * a + b * b; c = Math.sqrt(c2);
      return approx({ q: 'A right triangle has legs of ' + a + ' cm and ' + b + ' cm. How long is the hypotenuse?' + ROUND, type: 'num', answer: c, unit: 'cm', fig: rtri(a, b, a + ' cm', b + ' cm', 'c = ?', 'c'),
        hint: 'Square, add, square root. The answer may not be a whole number.', steps: [a + SQ + ' + ' + b + SQ + ' = ' + a * a + ' + ' + b * b + ' = ' + c2 + '.', 'c = ' + sqrtS(c2) + ' &asymp; ' + f1(c) + '.', 'Check: c should be longer than ' + Math.max(a, b) + ' but shorter than ' + (a + b) + '.'], explain: 'c = ' + sqrtS(c2) + ' &asymp; ' + f1(c) + ' cm.' }, 'cm');
    } },
    { id: 'ms-leg', name: 'Find a missing leg', code: 'E2.4', gen: function (lv) {
      if (lv === 3 && R.int(0, 1)) {
        var right = R.int(0, 1), t = TRIPLES[R.int(0, 4)], sides = right ? t : [t[0], t[1], t[2] + R.pick([-1, 1])];
        var ok = sides[0] * sides[0] + sides[1] * sides[1] === sides[2] * sides[2];
        return { q: 'A triangle has sides of ' + sides.join(' cm, ') + ' cm. Is it a right triangle?', type: 'mc', options: ['Yes', 'No'], answer: ok ? 0 : 1,
          hint: 'Square the two shorter sides and add. Compare with the square of the longest side.', steps: [sides[0] + SQ + ' + ' + sides[1] + SQ + ' = ' + (sides[0] * sides[0] + sides[1] * sides[1]) + '.', sides[2] + SQ + ' = ' + sides[2] * sides[2] + '.', ok ? 'They match, so it is a right triangle.' : 'They do not match, so it is not a right triangle.'], explain: ok ? 'Yes: the squares match.' : 'No: ' + (sides[0] * sides[0] + sides[1] * sides[1]) + ' is not ' + sides[2] * sides[2] + '.' };
      }
      if (lv === 3) {
        var c = R.int(8, 20), b = R.int(2, c - 2), a2 = c * c - b * b, a = Math.sqrt(a2);
        return approx({ q: 'A right triangle has a hypotenuse of ' + c + ' cm and a leg of ' + b + ' cm. How long is the other leg?' + ROUND, type: 'num', answer: a, unit: 'cm', fig: rtri(a, b, 'a = ?', b + ' cm', c + ' cm', 'a'),
          hint: 'Subtract: a' + SQ + ' = c' + SQ + ' &minus; b' + SQ + '.', steps: [c + SQ + ' &minus; ' + b + SQ + ' = ' + c * c + ' &minus; ' + b * b + ' = ' + a2 + '.', 'a = ' + sqrtS(a2) + ' &asymp; ' + f1(a) + '.', 'Check: shorter than ' + c + '.'], explain: 'a &asymp; ' + f1(a) + ' cm.' }, 'cm');
      }
      var tt = triple(lv), leg = tt[0], other = tt[1], hyp = tt[2]; if (R.int(0, 1)) { leg = tt[1]; other = tt[0]; }
      if (lv === 1) return { q: 'A right triangle has a hypotenuse of ' + hyp + ' cm and one leg of ' + other + ' cm. How long is the other leg?', type: 'num', answer: leg, unit: 'cm', fig: rtri(leg, other, '? cm', other + ' cm', hyp + ' cm', 'a'),
        hint: 'Square the hypotenuse, subtract the square of the leg, then take the square root.', steps: [hyp + SQ + ' &minus; ' + other + SQ + ' = ' + hyp * hyp + ' &minus; ' + other * other + ' = ' + leg * leg + '.', sqrtS(leg * leg) + ' = ' + leg + '.'], explain: 'The other leg is ' + leg + ' cm.' };
      var s = R.pick([10, 1]);
      var ladder = s === 10 ? 'A ' + hyp / 10 + ' m ladder leans on a wall with its foot ' + other / 10 + ' m from the wall. How high up the wall does it reach, in metres?' : 'A ramp is ' + hyp + ' m long and covers ' + other + ' m along the ground. How high does it rise, in metres?';
      var ans = leg / s;
      return { q: ladder, type: 'num', answer: ans, unit: 'm', show: A.fmt(ans) + ' m', fig: rtri(other, leg, other / s + ' m', '? m', hyp / s + ' m', 'b'),
        hint: 'The sloping length is the hypotenuse. Subtract: c' + SQ + ' &minus; a' + SQ + '.', steps: [A.fmt(hyp / s) + SQ + ' &minus; ' + A.fmt(other / s) + SQ + ' = ' + sq4(hyp / s) + ' &minus; ' + sq4(other / s) + ' = ' + sq4(ans) + '.', '&radic;' + sq4(ans) + ' = ' + A.fmt(ans) + '.'], explain: 'It reaches ' + A.fmt(ans) + ' m.' };
    } },
    { id: 'ms-circle', name: 'Circles', code: 'E2.3', gen: function (lv) {
      var r = R.int(2, 15), giveD = R.int(0, 1), d = 2 * r, given = giveD ? 'a diameter of ' + d + ' cm' : 'a radius of ' + r + ' cm';
      if (lv === 1) {
        var C = Math.PI * d;
        return approx({ q: 'A circle has ' + given + '. What is its circumference?' + ROUND, type: 'num', answer: C, unit: 'cm',
          hint: 'C = &pi;d. ' + (giveD ? '' : 'Double the radius to get d first.'), steps: [(giveD ? 'd = ' + d : 'd = 2 &times; ' + r + ' = ' + d) + '.', 'C = &pi; &times; ' + d + ' &asymp; ' + f1(C) + '.'], explain: 'C &asymp; ' + f1(C) + ' cm.' }, 'cm');
      }
      if (lv === 2) {
        var Ar = Math.PI * r * r;
        return approx({ q: 'A circle has ' + given + '. What is its area?' + ROUND, type: 'num', answer: Ar, unit: 'cm' + SQ,
          hint: 'A = &pi;r' + SQ + '. ' + (giveD ? 'Halve the diameter to get r first.' : 'Square the radius, then multiply by &pi;.'), steps: [(giveD ? 'r = ' + d + ' &divide; 2 = ' + r : 'r = ' + r) + '.', 'r' + SQ + ' = ' + r * r + '.', 'A = &pi; &times; ' + r * r + ' &asymp; ' + f1(Ar) + '.'], explain: 'A &asymp; ' + f1(Ar) + ' cm' + SQ + '.' }, 'cm²');
      }
      if (R.int(0, 1)) {
        var Cg = R.int(20, 120);
        return approx({ q: 'A circle has a circumference of ' + Cg + ' cm. What is its radius?' + ROUND, type: 'num', answer: Cg / (2 * Math.PI), unit: 'cm',
          hint: 'Work backwards from C = 2&pi;r: divide by 2&pi;.', steps: ['r = C &divide; (2&pi;).', Cg + ' &divide; 6.283&hellip; &asymp; ' + f1(Cg / (2 * Math.PI)) + '.', 'Check: 2 &times; &pi; &times; ' + f1(Cg / (2 * Math.PI)) + ' is close to ' + Cg + '.'], explain: 'r &asymp; ' + f1(Cg / (2 * Math.PI)) + ' cm.' }, 'cm');
      }
      var Rb = R.int(5, 12), rs = R.int(1, Rb - 2), ring = Math.PI * (Rb * Rb - rs * rs);
      return approx({ q: 'A ring is a circle of radius ' + Rb + ' cm with a circle of radius ' + rs + ' cm cut out. What is the area of the ring?' + ROUND, type: 'num', answer: ring, unit: 'cm' + SQ, fig: comp('ring', { R: Rb, r: rs }),
        hint: 'Big circle area minus small circle area.', steps: ['Big: &pi; &times; ' + Rb + SQ + ' &asymp; ' + f1(Math.PI * Rb * Rb) + '.', 'Small: &pi; &times; ' + rs + SQ + ' &asymp; ' + f1(Math.PI * rs * rs) + '.', 'Ring: &pi; &times; (' + Rb * Rb + ' &minus; ' + rs * rs + ') = &pi; &times; ' + (Rb * Rb - rs * rs) + ' &asymp; ' + f1(ring) + '.'], explain: 'The ring is about ' + f1(ring) + ' cm' + SQ + '.' }, 'cm²');
    } },
    { id: 'ms-composite', name: 'Composite shapes', code: 'E2.3', gen: function (lv) {
      if (lv === 1) {
        var w = R.int(3, 10) * 2, h = R.int(3, 9), t = R.int(2, 6), ar = w * h + w * t / 2;
        return { q: 'This house shape is a rectangle ' + w + ' cm wide and ' + h + ' cm tall with a triangle ' + t + ' cm tall on top. What is its area?', type: 'num', answer: ar, unit: 'cm' + SQ, fig: comp('house', { w: w, h: h, t: t }),
          hint: 'Rectangle area plus triangle area. Triangle: base &times; height &divide; 2.', steps: ['Rectangle: ' + w + ' &times; ' + h + ' = ' + w * h + '.', 'Triangle: ' + w + ' &times; ' + t + ' &divide; 2 = ' + w * t / 2 + '.', 'Total: ' + ar + ' cm' + SQ + '.'], explain: 'The area is ' + ar + ' cm' + SQ + '.' };
      }
      if (lv === 2 && R.int(0, 1)) {
        var W = R.int(8, 14), H = R.int(6, 10), cw = R.int(2, W - 3), ch = R.int(2, H - 3), aL = W * H - cw * ch;
        return { q: 'Find the area of the L shape: a ' + W + ' cm by ' + H + ' cm rectangle with a ' + cw + ' cm by ' + ch + ' cm corner cut out.', type: 'num', answer: aL, unit: 'cm' + SQ, fig: comp('L', { W: W, H: H, cw: cw, ch: ch }),
          hint: 'Whole rectangle minus the cut-out corner.', steps: ['Whole: ' + W + ' &times; ' + H + ' = ' + W * H + '.', 'Corner: ' + cw + ' &times; ' + ch + ' = ' + cw * ch + '.', 'L shape: ' + W * H + ' &minus; ' + cw * ch + ' = ' + aL + '.'], explain: 'The area is ' + aL + ' cm' + SQ + '.' };
      }
      var w2 = R.int(6, 14), h2 = R.int(2, 6) * 2, rr = h2 / 2;
      if (lv === 2) {
        var a2 = w2 * h2 + Math.PI * rr * rr / 2;
        return approx({ q: 'The shape is a rectangle ' + w2 + ' cm by ' + h2 + ' cm with a half circle on one end. What is its area?' + ROUND, type: 'num', answer: a2, unit: 'cm' + SQ, fig: comp('semi', { w: w2, h: h2 }),
          hint: 'Rectangle plus half of a circle. The half circle\'s diameter is ' + h2 + ' cm, so r = ' + rr + '.', steps: ['Rectangle: ' + w2 + ' &times; ' + h2 + ' = ' + w2 * h2 + '.', 'Half circle: &pi; &times; ' + rr + SQ + ' &divide; 2 &asymp; ' + f1(Math.PI * rr * rr / 2) + '.', 'Total &asymp; ' + f1(a2) + '.'], explain: 'The area is about ' + f1(a2) + ' cm' + SQ + '.' }, 'cm²');
      }
      var p = 2 * w2 + h2 + Math.PI * h2 / 2;
      return approx({ q: 'The shape is a rectangle ' + w2 + ' cm by ' + h2 + ' cm with a half circle on one end. What is its perimeter?' + ROUND, type: 'num', answer: p, unit: 'cm', fig: comp('semi', { w: w2, h: h2 }),
        hint: 'Only outside edges: two long sides, one short side, and half a circumference. Do not count the dashed line.', steps: ['Straight edges: ' + w2 + ' + ' + w2 + ' + ' + h2 + ' = ' + (2 * w2 + h2) + '.', 'Curved edge: &pi; &times; ' + h2 + ' &divide; 2 &asymp; ' + f1(Math.PI * h2 / 2) + '.', 'Total &asymp; ' + f1(p) + '.'], explain: 'The perimeter is about ' + f1(p) + ' cm.' }, 'cm');
    } },
    { id: 'ms-volume', name: 'Volume', code: 'E2.3', gen: function (lv) {
      if (lv === 1) {
        var l = R.int(2, 12), w = R.int(2, 10), h = R.int(2, 10), V = l * w * h;
        return { q: 'A box is ' + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm tall. What is its volume?', type: 'num', answer: V, unit: 'cm' + CU, fig: solid('box', { l: l, w: w, h: h }, { l: l + ' cm', w: w + ' cm', h: h + ' cm' }),
          hint: 'Base area (l &times; w) times height.', steps: ['Base: ' + l + ' &times; ' + w + ' = ' + l * w + ' cm' + SQ + '.', 'Volume: ' + l * w + ' &times; ' + h + ' = ' + A.fmt(V) + ' cm' + CU + '.'], explain: 'V = ' + A.fmt(V) + ' cm' + CU + '.' };
      }
      if (lv === 2 && R.int(0, 1)) {
        var b = R.int(2, 10), a = R.int(2, 10), len = R.int(4, 15), Vt = a * b / 2 * len;
        return { q: 'A triangular prism has a right-triangle end with legs ' + b + ' cm and ' + a + ' cm. It is ' + len + ' cm long. What is its volume?', type: 'num', answer: Vt, unit: 'cm' + CU, fig: solid('tri', { a: a, b: b, len: len }, { a: a + ' cm', b: b + ' cm', len: len + ' cm' }),
          hint: 'The base is the triangle: ' + b + ' &times; ' + a + ' &divide; 2. Multiply by the length.', steps: ['Triangle: ' + b + ' &times; ' + a + ' &divide; 2 = ' + a * b / 2 + ' cm' + SQ + '.', 'Volume: ' + a * b / 2 + ' &times; ' + len + ' = ' + A.fmt(Vt) + ' cm' + CU + '.'], explain: 'V = ' + A.fmt(Vt) + ' cm' + CU + '.' };
      }
      var r = R.int(2, 10), hc = R.int(3, 20), Vc = Math.PI * r * r * hc;
      if (lv === 2) return approx({ q: 'A cylinder has a radius of ' + r + ' cm and a height of ' + hc + ' cm. What is its volume?' + ROUND, type: 'num', answer: Vc, unit: 'cm' + CU, fig: solid('cyl', { r: r, h: hc }, { r: r + ' cm', h: hc + ' cm' }),
        hint: 'Base area &pi;r' + SQ + ', times the height.', steps: ['Base: &pi; &times; ' + r + SQ + ' = &pi; &times; ' + r * r + ' &asymp; ' + f1(Math.PI * r * r) + ' cm' + SQ + '.', 'Volume: &pi; &times; ' + r * r + ' &times; ' + hc + ' &asymp; ' + f1(Vc) + ' cm' + CU + '.'], explain: 'V &asymp; ' + f1(Vc) + ' cm' + CU + '.' }, 'cm³');
      if (R.int(0, 1)) {
        var L = R.pick([10, 20, 25, 30, 40, 50]), W2 = R.pick([10, 20, 25, 30]), H2 = R.pick([10, 20, 30, 40]), Lt = L * W2 * H2 / 1000;
        return { q: 'A fish tank is ' + L + ' cm long, ' + W2 + ' cm wide and ' + H2 + ' cm tall. How many litres does it hold when full?', type: 'num', answer: Lt, unit: 'L', show: A.fmt(Lt) + ' L', fig: solid('box', { l: L, w: W2, h: H2 }, { l: L + ' cm', w: W2 + ' cm', h: H2 + ' cm' }),
          hint: 'Find the volume in cm' + CU + ', then divide by 1000 (1000 cm' + CU + ' = 1 L).', steps: ['V = ' + L + ' &times; ' + W2 + ' &times; ' + H2 + ' = ' + A.fmt(L * W2 * H2) + ' cm' + CU + '.', A.fmt(L * W2 * H2) + ' &divide; 1000 = ' + A.fmt(Lt) + ' L.'], explain: 'It holds ' + A.fmt(Lt) + ' L.' };
      }
      var l3 = R.int(3, 10), w3 = R.int(2, 8), h3 = R.int(2, 12), V3 = l3 * w3 * h3;
      return { q: 'A box has a volume of ' + V3 + ' cm' + CU + '. Its base is ' + l3 + ' cm by ' + w3 + ' cm. How tall is it?', type: 'num', answer: h3, unit: 'cm',
        hint: 'Volume = base area &times; height, so height = volume &divide; base area.', steps: ['Base area: ' + l3 + ' &times; ' + w3 + ' = ' + l3 * w3 + '.', 'Height: ' + V3 + ' &divide; ' + l3 * w3 + ' = ' + h3 + '.'], explain: 'It is ' + h3 + ' cm tall.' };
    } },
    { id: 'ms-surface', name: 'Surface area', code: 'E2.3', gen: function (lv) {
      if (lv === 1) {
        var l = R.int(2, 10), w = R.int(2, 8), h = R.int(2, 8), S = 2 * (l * w + l * h + w * h);
        return { q: 'A box is ' + l + ' cm by ' + w + ' cm by ' + h + ' cm. What is its surface area?', type: 'num', answer: S, unit: 'cm' + SQ, fig: solid('box', { l: l, w: w, h: h }, { l: l + ' cm', w: w + ' cm', h: h + ' cm' }),
          hint: 'Three pairs of matching faces: l &times; w, l &times; h, w &times; h. Add them and double.', steps: ['Faces: ' + l * w + ', ' + l * h + ', ' + w * h + '.', 'One of each: ' + (l * w + l * h + w * h) + '.', 'Double: ' + S + ' cm' + SQ + '.'], explain: 'SA = ' + S + ' cm' + SQ + '.' };
      }
      if (lv === 2) {
        var r = R.int(2, 10), hc = R.int(3, 20), Sc = 2 * Math.PI * r * r + 2 * Math.PI * r * hc;
        return approx({ q: 'A closed cylinder has a radius of ' + r + ' cm and a height of ' + hc + ' cm. What is its surface area?' + ROUND, type: 'num', answer: Sc, unit: 'cm' + SQ, fig: solid('cyl', { r: r, h: hc }, { r: r + ' cm', h: hc + ' cm' }),
          hint: 'Two circles (&pi;r' + SQ + ' each) plus the side, a rectangle 2&pi;r long and h tall.', steps: ['Two circles: 2 &times; &pi; &times; ' + r * r + ' &asymp; ' + f1(2 * Math.PI * r * r) + '.', 'Side: 2 &times; &pi; &times; ' + r + ' &times; ' + hc + ' &asymp; ' + f1(2 * Math.PI * r * hc) + '.', 'Total &asymp; ' + f1(Sc) + '.'], explain: 'SA &asymp; ' + f1(Sc) + ' cm' + SQ + '.' }, 'cm²');
      }
      if (R.int(0, 1)) {
        var ro = R.int(3, 8), ho = R.int(5, 15), So = Math.PI * ro * ro + 2 * Math.PI * ro * ho;
        return approx({ q: 'A cup is a cylinder with no lid: radius ' + ro + ' cm, height ' + ho + ' cm. What is the area of its outside surface (bottom and side)?' + ROUND, type: 'num', answer: So, unit: 'cm' + SQ, fig: solid('cyl', { r: ro, h: ho }, { r: ro + ' cm', h: ho + ' cm' }),
          hint: 'Only one circle this time, plus the side.', steps: ['Bottom: &pi; &times; ' + ro * ro + ' &asymp; ' + f1(Math.PI * ro * ro) + '.', 'Side: 2 &times; &pi; &times; ' + ro + ' &times; ' + ho + ' &asymp; ' + f1(2 * Math.PI * ro * ho) + '.', 'Total &asymp; ' + f1(So) + '.'], explain: 'About ' + f1(So) + ' cm' + SQ + '.' }, 'cm²');
      }
      var t = R.pick(TRIPLES.slice(0, 3)), a = t[0], b = t[1], c = t[2], len = R.int(5, 15), St = a * b + (a + b + c) * len;
      return { q: 'A triangular prism has right-triangle ends with legs ' + b + ' cm and ' + a + ' cm. It is ' + len + ' cm long. What is its surface area? (Find the third side first.)', type: 'num', answer: St, unit: 'cm' + SQ, fig: solid('tri', { a: a, b: b, len: len }, { a: a + ' cm', b: b + ' cm', len: len + ' cm', c: '?' }),
        hint: 'Use Pythagoras for the sloping side. Then: two triangles, plus three rectangles (each side &times; the length).', steps: ['Sloping side: ' + sqrtS(a * a + b * b) + ' = ' + c + '.', 'Two triangles: 2 &times; (' + a + ' &times; ' + b + ' &divide; 2) = ' + a * b + '.', 'Rectangles: (' + a + ' + ' + b + ' + ' + c + ') &times; ' + len + ' = ' + (a + b + c) * len + '.', 'Total: ' + St + ' cm' + SQ + '.'], explain: 'SA = ' + St + ' cm' + SQ + '.' };
    } }
  ];

  var quiz = [
    { q: 'A right triangle has legs of 9 cm and 12 cm. How long is the hypotenuse?', type: 'num', answer: 15, unit: 'cm', hint: 'Square each leg, add, then take the square root.', explain: '81 + 144 = 225, and &radic;225 = 15 cm.' },
    { q: 'A right triangle has a hypotenuse of 17 cm and a leg of 8 cm. How long is the other leg?', type: 'num', answer: 15, unit: 'cm', hint: 'Subtract: c' + SQ + ' &minus; b' + SQ + '.', explain: '289 &minus; 64 = 225, and &radic;225 = 15 cm.' },
    { q: 'A triangle has sides of 6 cm, 9 cm and 11 cm. Is it a right triangle?', type: 'mc', options: ['No', 'Yes'], answer: 0, hint: 'Does 6' + SQ + ' + 9' + SQ + ' equal 11' + SQ + '?', explain: '36 + 81 = 117, but 11' + SQ + ' = 121. They do not match, so it is not a right triangle.' },
    { q: 'What is the area of a circle with a radius of 6 cm, to one decimal place?', type: 'num', answer: 36 * Math.PI, tol: 0.2, unit: 'cm' + SQ, hint: 'A = &pi;r' + SQ + '. Square 6 first.', explain: '&pi; &times; 36 &asymp; 113.1 cm' + SQ + '.' },
    { q: 'A shape is a rectangle 8 cm by 4 cm with a half circle on one 4 cm end. What is its area, to one decimal place?', type: 'num', answer: 32 + 2 * Math.PI, tol: 0.2, unit: 'cm' + SQ, hint: 'Rectangle plus half a circle with r = 2.', explain: '8 &times; 4 = 32. Half circle: &pi; &times; 2' + SQ + ' &divide; 2 &asymp; 6.3. Total &asymp; 38.3 cm' + SQ + '.' },
    { q: 'A cylinder has a radius of 3 cm and a height of 10 cm. What is its volume, to one decimal place?', type: 'num', answer: 90 * Math.PI, tol: 0.3, unit: 'cm' + CU, hint: 'Base area &pi;r' + SQ + ', times the height.', explain: '&pi; &times; 9 &times; 10 = 90&pi; &asymp; 282.7 cm' + CU + '.' },
    { q: 'A box is 6 cm by 4 cm by 2 cm. What is its surface area?', type: 'num', answer: 88, unit: 'cm' + SQ, hint: 'Faces: 6 &times; 4, 6 &times; 2, 4 &times; 2. Add them and double.', explain: '24 + 12 + 8 = 44, and 44 &times; 2 = 88 cm' + SQ + '.' }
  ];

  A.register('measurement', {
    fx: { r1: r1, f1: f1, sq4: sq4, sqrtS: sqrtS, approx: approx, rtri: rtri, psq: psq, rearr: rearr, slices: slices, circW: circW, comp: comp, solid: solid, boxNet: boxNet, cylNet: cylNet, triple: triple },
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      A.bind(root, ['pya', 'pyb'], function () {
        var a = +$('#pya').value, b = +$('#pyb').value, c2 = a * a + b * b, c = Math.sqrt(c2), whole = c === Math.round(c);
        $('#pyao').textContent = a; $('#pybo').textContent = b;
        $('#pyfig').innerHTML = psq(a, b);
        $('#pyout').innerHTML = '<span class="big">' + a * a + ' + ' + b * b + ' = ' + c2 + '</span><br>The hypotenuse is &radic;' + c2 + (whole ? ' = <b>' + c + '</b> exactly.' : ' &asymp; <b>' + (Math.round(c * 100) / 100) + '</b>.') + (whole ? ' A whole-number set like ' + a + ', ' + b + ', ' + c + ' is called a Pythagorean triple.' : ' Try 3 and 4, or 5 and 12, for whole-number answers.');
      });
      A.bind(root, ['cir'], function () {
        var r = +$('#cir').value; $('#ciro').textContent = r + ' cm';
        $('#cifig').innerHTML = circW(r);
        $('#ciout').innerHTML = 'C = 2 &times; &pi; &times; ' + r + ' &asymp; <b>' + f1(2 * Math.PI * r) + ' cm</b><br>A = &pi; &times; ' + r + SQ + ' = &pi; &times; ' + A.fmt(r * r) + ' &asymp; <b>' + f1(Math.PI * r * r) + ' cm' + SQ + '</b><br>Double the radius and the circumference doubles, but the area becomes 4 times as big.';
      });
      A.bind(root, ['sot', 'so1', 'so2', 'so3'], function () {
        var t = $('#sot').value, a = +$('#so1').value, b = +$('#so2').value, c = +$('#so3').value;
        $('#so2').disabled = t === 'cyl';
        $('#so1n').textContent = t === 'cyl' ? 'Radius:' : 'Length:';
        $('#so1o').textContent = a + ' cm'; $('#so2o').textContent = t === 'cyl' ? '–' : b + ' cm'; $('#so3o').textContent = c + ' cm';
        if (t === 'box') {
          $('#sofig').innerHTML = solid('box', { l: a, w: b, h: c }, { l: a + ' cm', w: b + ' cm', h: c + ' cm' }) + boxNet(a, b, c);
          $('#soout').innerHTML = 'Surface area = 2 &times; (' + a * b + ' + ' + a * c + ' + ' + b * c + ') = <b>' + 2 * (a * b + a * c + b * c) + ' cm' + SQ + '</b><br>Volume = ' + a + ' &times; ' + b + ' &times; ' + c + ' = <b>' + a * b * c + ' cm' + CU + '</b>';
        } else {
          $('#sofig').innerHTML = solid('cyl', { r: a, h: c }, { r: a + ' cm', h: c + ' cm' }) + cylNet(a, c);
          $('#soout').innerHTML = 'Two circles: 2 &times; &pi; &times; ' + a * a + ' &asymp; ' + f1(2 * Math.PI * a * a) + '. Side: ' + f1(2 * Math.PI * a) + ' &times; ' + c + ' &asymp; ' + f1(2 * Math.PI * a * c) + '.<br>Surface area &asymp; <b>' + f1(2 * Math.PI * a * (a + c)) + ' cm' + SQ + '</b><br>Volume = &pi; &times; ' + a * a + ' &times; ' + c + ' &asymp; <b>' + f1(Math.PI * a * a * c) + ' cm' + CU + '</b>';
        }
      });
    }
  });

  /* ---------- question shapes (more ways to ask each skill; checks in tests/verify/grade8.js) ---------- */
  var K = window.K8;
  var SHAPES = {
    'ms-hyp': [
      [1, 'fill', function (lv) {
        var t = triple(1), a = t[0], b = t[1];
        return { q: 'A right triangle has legs of ' + a + ' cm and ' + b + ' cm. Find the hypotenuse c, one step at a time.', type: 'fill', fill: 'c' + SQ + ' = ' + a + SQ + ' + ' + b + SQ + ' = [[]] + [[]] = [[]], so c = [[]] cm', answers: [a * a, b * b, a * a + b * b, t[2]], fig: rtri(a, b, a + ' cm', b + ' cm', 'c = ?', 'c'),
          hint: 'Square each leg. Add. Then take the square root.', steps: [a + SQ + ' = ' + a * a + ', ' + b + SQ + ' = ' + b * b + '.', a * a + ' + ' + b * b + ' = ' + (a * a + b * b) + '.', sqrtS(a * a + b * b) + ' = ' + t[2] + '.'], explain: 'c = ' + t[2] + ' cm.', meta: { k: 'mh-fill', a: a, b: b } };
      }],
      [1, 'story', function (lv) {
        var who = K.name(), t = triple(lv), k = 10;
        return { q: who + ' cuts straight across a rectangular park that is <b>' + t[0] * k + ' m</b> long and <b>' + t[1] * k + ' m</b> wide, from corner to corner. How long is the shortcut?', type: 'num', answer: t[2] * k, unit: 'm', fig: rtri(t[0], t[1], t[0] * k + ' m', t[1] * k + ' m', '?', 'c'),
          hint: 'The sides of the park are the legs. The shortcut is the hypotenuse.', steps: [t[0] * k + SQ + ' + ' + t[1] * k + SQ + ' = ' + A.fmt(t[2] * t[2] * k * k) + '.', sqrtS(t[2] * t[2] * k * k) + ' = ' + t[2] * k + '.'], explain: 'The shortcut is ' + t[2] * k + ' m.', meta: { k: 'mh-story', a: t[0] * k, b: t[1] * k } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), t = triple(lv), truth = R.int(0, 1), said = truth ? t[2] : t[0] + t[1];
        return K.tf({ q: 'A right triangle has legs of ' + t[0] + ' cm and ' + t[1] + ' cm. ' + who + ' says the hypotenuse is <b>' + said + ' cm</b>. True or false?', truth: truth, fig: rtri(t[0], t[1], t[0] + ' cm', t[1] + ' cm', 'c = ?', 'c'),
          right: 'Square, add, then square root: ' + sqrtS(t[0] * t[0] + t[1] * t[1]) + ' = ' + t[2] + ' cm. A straight line is shorter than going around two sides.', wrong: ['The hypotenuse is the two legs added together.', 'The hypotenuse is the longer leg doubled.'],
          hint: 'Use a' + SQ + ' + b' + SQ + ' = c' + SQ + '.', meta: { k: 'mh-tf', a: t[0], b: t[1], said: said } });
      }],
      [2, 'line', function (lv) {
        var a = R.int(2, 9), b = R.int(2, 9), c = Math.sqrt(a * a + b * b);
        return { q: 'A right triangle has legs of ' + a + ' cm and ' + b + ' cm. Place the length of the hypotenuse on the line, to the nearest tenth.', type: 'line', min: 0, max: 15, tick: 1, every: 5, snap: 0.1, answer: r1(c), tol: 0.2, fig: rtri(a, b, a + ' cm', b + ' cm', 'c = ?', 'c'),
          hint: 'Square, add, then square root. It must be longer than ' + Math.max(a, b) + ' cm.', steps: [a + SQ + ' + ' + b + SQ + ' = ' + (a * a + b * b) + '.', 'c = ' + sqrtS(a * a + b * b) + ' &asymp; ' + f1(c) + '.'], explain: 'c &asymp; ' + f1(c) + ' cm. Within 0.2 counts.', meta: { k: 'mh-line', a: a, b: b } };
      }],
      [2, 'pick', function (lv) {
        return K.until(function () {
          var opts = R.shuffle(TRIPLES).slice(0, 3).map(function (t) { var k = R.pick([1, 2]); return [t[0] * k + ', ' + t[1] * k + ', ' + t[2] * k, true]; })
            .concat([[R.int(4, 8) + ', ' + R.int(9, 12) + ', ' + R.int(13, 16), false], [R.int(2, 5) + ', ' + R.int(6, 8) + ', ' + R.int(10, 12), false]]);
          return K.pickAll({ q: 'Each set gives the three sides of a triangle in cm. Pick every set that makes a <b>right</b> triangle.', opts: opts, hint: 'Square the two shorter sides and add. Does it equal the longest side squared?', steps: ['A right triangle has a' + SQ + ' + b' + SQ + ' = c' + SQ + '.'], explain: 'The right triangles are the ones where the squares match.', meta: { k: 'mh-pick' } });
        });
      }]
    ],
    'ms-leg': [
      [1, 'fill', function (lv) {
        var t = triple(1);
        return { q: 'A right triangle has a hypotenuse of ' + t[2] + ' cm and a leg of ' + t[1] + ' cm. Find the other leg.', type: 'fill', fill: 'a' + SQ + ' = ' + t[2] + SQ + ' &minus; ' + t[1] + SQ + ' = [[]], so a = [[]] cm', answers: [t[0] * t[0], t[0]], fig: rtri(t[0], t[1], 'a = ?', t[1] + ' cm', t[2] + ' cm', 'a'),
          hint: 'Subtract the squares, then take the square root.', steps: [t[2] * t[2] + ' &minus; ' + t[1] * t[1] + ' = ' + t[0] * t[0] + '.', sqrtS(t[0] * t[0]) + ' = ' + t[0] + '.'], explain: 'The other leg is ' + t[0] + ' cm.', meta: { k: 'ml-fill', c: t[2], b: t[1] } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), t = triple(lv), truth = R.int(0, 1), said = truth ? t[0] : t[2] - t[1];
        if (said === t[0]) truth = 1;
        return K.tf({ q: 'A right triangle has a hypotenuse of ' + t[2] + ' cm and a leg of ' + t[1] + ' cm. ' + who + ' says the other leg is <b>' + said + ' cm</b>. True or false?', truth: truth,
          right: 'Subtract the squares: ' + t[2] + SQ + ' &minus; ' + t[1] + SQ + ' = ' + t[0] * t[0] + ', and ' + sqrtS(t[0] * t[0]) + ' = ' + t[0] + ' cm.', wrong: ['Just subtract the two lengths.', 'Add the squares to find a leg.'],
          hint: 'Use c' + SQ + ' &minus; b' + SQ + ', not c &minus; b.', meta: { k: 'ml-tf', c: t[2], b: t[1], said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), t = R.pick([[3, 4, 5], [6, 8, 10], [9, 12, 15]]), k = R.pick([10, 12]);
        return { q: who + '\'s TV has a diagonal of <b>' + t[2] * k + ' cm</b> and is <b>' + t[1] * k + ' cm</b> wide. How tall is it?', type: 'num', answer: t[0] * k, unit: 'cm',
          hint: 'The diagonal is the hypotenuse. Find the missing leg.', steps: [A.fmt(t[2] * t[2] * k * k) + ' &minus; ' + A.fmt(t[1] * t[1] * k * k) + ' = ' + A.fmt(t[0] * t[0] * k * k) + '.', sqrtS(t[0] * t[0] * k * k) + ' = ' + t[0] * k + '.'], explain: 'The TV is ' + t[0] * k + ' cm tall.', meta: { k: 'ml-story', c: t[2] * k, b: t[1] * k } };
      }]
    ],
    'ms-circle': [
      [1, 'match', function (lv) {
        var rs = []; while (rs.length < 3) { var v = R.int(2, 12); if (rs.indexOf(v) < 0) rs.push(v); }
        return { q: 'Match each radius to the circumference (to one decimal place).', type: 'match', pairs: rs.map(function (r) { return ['r = ' + r + ' cm', f1(2 * Math.PI * r) + ' cm']; }),
          hint: 'C = 2&pi;r, or &pi; times the diameter.', steps: ['A bigger radius gives a bigger circumference.'], explain: rs.map(function (r) { return 'r = ' + r + ': C &asymp; ' + f1(2 * Math.PI * r); }).join(', ') + '.', meta: { k: 'mc-match' } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), r = R.int(2, 10), truth = R.int(0, 1), right = r1(Math.PI * r * r), said = truth ? right : r1(Math.PI * 4 * r * r);
        return K.tf({ q: 'A circle has a diameter of ' + 2 * r + ' cm. ' + who + ' says its area is about <b>' + A.fmt(said) + ' cm' + SQ + '</b>. True or false?', truth: truth,
          right: 'Use the radius, ' + r + ' cm: A = &pi; &times; ' + r + SQ + ' &asymp; ' + A.fmt(right) + ' cm' + SQ + '.', wrong: ['Use the diameter in A = &pi;r' + SQ + '.', 'Area and circumference use the same formula.'],
          hint: 'A = &pi;r' + SQ + ' needs the radius, not the diameter.', meta: { k: 'mc-tf', d: 2 * r, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), d = R.pick([50, 60, 66, 70]), C = Math.PI * d;
        return approx({ q: who + '\'s bike wheel has a diameter of <b>' + d + ' cm</b>. How far does the bike roll in one full turn of the wheel?' + ROUND, type: 'num', answer: C, unit: 'cm',
          hint: 'One turn rolls out the circumference: C = &pi;d.', steps: ['C = &pi; &times; ' + d + ' &asymp; ' + f1(C) + ' cm.'], explain: 'About ' + f1(C) + ' cm per turn.', meta: { k: 'mc-story', d: d } }, 'cm');
      }],
      [2, 'fill', function (lv) {
        var d = R.int(2, 15) * 2;
        return { q: 'A circle has a diameter of ' + d + ' cm. Fill in the blanks.', type: 'fill', fill: 'r = [[]] cm, and A = &pi; &times; [[]] cm' + SQ, answers: [d / 2, d * d / 4],
          hint: 'The radius is half the diameter. Then square it.', steps: ['r = ' + d + ' &divide; 2 = ' + d / 2 + '.', 'r' + SQ + ' = ' + d * d / 4 + '.'], explain: 'A = &pi; &times; ' + d * d / 4 + ' &asymp; ' + f1(Math.PI * d * d / 4) + ' cm' + SQ + '.', meta: { k: 'mc-fill', d: d } };
      }]
    ],
    'ms-composite': [
      [1, 'fill', function (lv) {
        var w = R.int(3, 10) * 2, h = R.int(3, 9), t = R.int(2, 6);
        return { q: 'Find the area of the house shape in two parts.', type: 'fill', fill: 'Rectangle: [[]] cm' + SQ + ' &nbsp; Triangle: [[]] cm' + SQ + ' &nbsp; Total: [[]] cm' + SQ, answers: [w * h, w * t / 2, w * h + w * t / 2], fig: comp('house', { w: w, h: h, t: t }),
          hint: 'Rectangle: width &times; height. Triangle: base &times; height &divide; 2.', steps: [w + ' &times; ' + h + ' = ' + w * h + '.', w + ' &times; ' + t + ' &divide; 2 = ' + w * t / 2 + '.'], explain: 'Total: ' + (w * h + w * t / 2) + ' cm' + SQ + '.', meta: { k: 'mp-fill', w: w, h: h, t: t } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), W = R.int(8, 14), H = R.int(6, 10), cw = R.int(2, W - 3), ch = R.int(2, H - 3), truth = R.int(0, 1), said = truth ? W * H - cw * ch : W * H + cw * ch;
        return K.tf({ q: who + ' says the area of this L shape is <b>' + said + ' cm' + SQ + '</b>. True or false?', truth: truth, fig: comp('L', { W: W, H: H, cw: cw, ch: ch }),
          right: 'Whole rectangle minus the cut-out corner: ' + W * H + ' &minus; ' + cw * ch + ' = ' + (W * H - cw * ch) + ' cm' + SQ + '.', wrong: ['Add the corner to the whole rectangle.', 'Multiply all four lengths.'],
          hint: 'Is the corner part of the shape, or cut away?', meta: { k: 'mp-tf', W: W, H: H, cw: cw, ch: ch, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), W = R.int(8, 14), H = R.int(6, 10), cw = R.int(2, W - 3), ch = R.int(2, H - 3);
        return { q: who + '\'s backyard is a ' + W + ' m by ' + H + ' m rectangle, but a ' + cw + ' m by ' + ch + ' m shed sits in one corner. How much area needs new sod?', type: 'num', answer: W * H - cw * ch, unit: 'm' + SQ, fig: comp('L', { W: W, H: H, cw: cw, ch: ch }).replace(/cm/g, 'm'),
          hint: 'Whole yard minus the shed.', steps: [W + ' &times; ' + H + ' = ' + W * H + '.', cw + ' &times; ' + ch + ' = ' + cw * ch + '.', W * H + ' &minus; ' + cw * ch + ' = ' + (W * H - cw * ch) + '.'], explain: (W * H - cw * ch) + ' m' + SQ + ' needs sod.', meta: { k: 'mp-story', W: W, H: H, cw: cw, ch: ch } };
      }],
      [2, 'way', function (lv) {
        var W = R.int(8, 14), H = R.int(6, 10), cw = R.int(2, W - 3), ch = R.int(2, H - 3);
        return K.pick1({ q: 'Which way finds the area of this L shape?', fig: comp('L', { W: W, H: H, cw: cw, ch: ch }), right: W + ' &times; ' + H + ' &minus; ' + cw + ' &times; ' + ch, wrong: [W + ' &times; ' + H + ' + ' + cw + ' &times; ' + ch, W + ' + ' + H + ' &minus; ' + cw + ' &minus; ' + ch, '2 &times; (' + W + ' + ' + H + ')'],
          hint: 'Start with the whole rectangle. What was taken away?', steps: ['Whole rectangle minus the cut-out corner.'], explain: W * H + ' &minus; ' + cw * ch + ' = ' + (W * H - cw * ch) + ' cm' + SQ + '.', meta: { k: 'mp-way', W: W, H: H, cw: cw, ch: ch } });
      }]
    ],
    'ms-volume': [
      [1, 'fill', function (lv) {
        var l = R.int(2, 12), w = R.int(2, 10), h = R.int(2, 10);
        return { q: 'Find the volume of the box in two steps.', type: 'fill', fill: 'Base: ' + l + ' &times; ' + w + ' = [[]] cm' + SQ + ' &nbsp; Volume: [[]] &times; ' + h + ' = [[]] cm' + CU, answers: [l * w, l * w, l * w * h], fig: solid('box', { l: l, w: w, h: h }, { l: l + ' cm', w: w + ' cm', h: h + ' cm' }),
          hint: 'Base area first, then times the height.', steps: [l + ' &times; ' + w + ' = ' + l * w + '.', l * w + ' &times; ' + h + ' = ' + l * w * h + '.'], explain: 'V = ' + A.fmt(l * w * h) + ' cm' + CU + '.', meta: { k: 'mv-fill', l: l, w: w, h: h } };
      }],
      [1, 'story', function (lv) {
        var who = K.name(), l = R.pick([20, 25, 30]), w = R.pick([5, 6, 8]), h = R.pick([25, 30, 35]);
        return { q: who + ' designs a cereal box that is ' + l + ' cm long, ' + w + ' cm deep and ' + h + ' cm tall. What volume of cereal fits inside?', type: 'num', answer: l * w * h, unit: 'cm' + CU, fig: solid('box', { l: l / 5, w: w / 2, h: h / 5 }, { l: l + ' cm', w: w + ' cm', h: h + ' cm' }),
          hint: 'Volume = length &times; width &times; height.', steps: [l + ' &times; ' + w + ' = ' + l * w + '.', l * w + ' &times; ' + h + ' = ' + A.fmt(l * w * h) + '.'], explain: 'It holds ' + A.fmt(l * w * h) + ' cm' + CU + '.', meta: { k: 'mv-story', l: l, w: w, h: h } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), k = R.pick([2, 3]), truth = R.int(0, 1), said = truth ? k * k * k : k;
        return K.tf({ q: 'Every edge of a box is made ' + k + ' times as long. ' + who + ' says the volume becomes <b>' + said + ' times</b> as big. True or false?', truth: truth,
          right: 'Length, width and height each grow ' + k + ' times: ' + k + ' &times; ' + k + ' &times; ' + k + ' = ' + k * k * k + ' times the volume.', wrong: ['The volume grows by the same factor as each edge.', 'Only the height changes the volume.'],
          hint: 'Try it with a 1 by 1 by 1 cube.', meta: { k: 'mv-tf', k2: k, said: said } });
      }],
      [2, 'order', function (lv) {
        return K.until(function () {
          var list = [0, 1, 2].map(function () { return [R.int(2, 9), R.int(2, 9), R.int(2, 9)]; }), v = list.map(function (b) { return b[0] * b[1] * b[2]; });
          if (new Set(v).size < 3) return null;
          list.sort(function (a, b) { return a[0] * a[1] * a[2] - b[0] * b[1] * b[2]; });
          return { q: 'Three boxes have these edges, in cm. Put them in order of volume, smallest to largest.', type: 'order', items: list.map(function (b) { return b.join(' &times; '); }), first: 'smallest', last: 'largest',
            hint: 'Multiply the three edges of each box.', steps: list.map(function (b) { return b.join(' &times; ') + ' = ' + b[0] * b[1] * b[2] + ' cm' + CU; }), explain: 'Volumes: ' + list.map(function (b) { return b[0] * b[1] * b[2]; }).join(', ') + ' cm' + CU + '.', meta: { k: 'mv-order' } };
        });
      }]
    ],
    'ms-surface': [
      [1, 'fill', function (lv) {
        var l = R.int(2, 10), w = R.int(2, 8), h = R.int(2, 8);
        return { q: 'Find the surface area of the box. First find one face of each kind.', type: 'fill', fill: 'l &times; w = [[]], l &times; h = [[]], w &times; h = [[]]. Surface area = [[]] cm' + SQ, answers: [l * w, l * h, w * h, 2 * (l * w + l * h + w * h)], fig: solid('box', { l: l, w: w, h: h }, { l: l + ' cm', w: w + ' cm', h: h + ' cm' }),
          hint: 'A box has two of each face. Add the three faces, then double.', steps: ['Faces: ' + l * w + ', ' + l * h + ', ' + w * h + '.', '2 &times; ' + (l * w + l * h + w * h) + ' = ' + 2 * (l * w + l * h + w * h) + '.'], explain: 'SA = ' + 2 * (l * w + l * h + w * h) + ' cm' + SQ + '.', meta: { k: 'ma-fill', l: l, w: w, h: h } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), l = R.int(2, 10), w = R.int(2, 8), h = R.int(2, 8), one = l * w + l * h + w * h, truth = R.int(0, 1), said = truth ? 2 * one : one;
        return K.tf({ q: 'A box is ' + l + ' cm by ' + w + ' cm by ' + h + ' cm. ' + who + ' says its surface area is <b>' + said + ' cm' + SQ + '</b>. True or false?', truth: truth, fig: solid('box', { l: l, w: w, h: h }, { l: l + ' cm', w: w + ' cm', h: h + ' cm' }),
          right: 'There are 6 faces, two of each kind: 2 &times; (' + l * w + ' + ' + l * h + ' + ' + w * h + ') = ' + 2 * one + ' cm' + SQ + '.', wrong: ['A box has only 3 faces.', 'Surface area is length &times; width &times; height.'],
          hint: 'How many faces does a box have?', meta: { k: 'ma-tf', l: l, w: w, h: h, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), l = R.int(10, 30), w = R.int(5, 20), h = R.int(5, 15), sa = 2 * (l * w + l * h + w * h);
        return { q: who + ' wraps a gift box that is ' + l + ' cm by ' + w + ' cm by ' + h + ' cm. How much wrapping paper covers it exactly, with no overlap?', type: 'num', answer: sa, unit: 'cm' + SQ,
          hint: 'The paper covers all 6 faces: the surface area.', steps: ['Faces: ' + l * w + ', ' + l * h + ', ' + w * h + '.', '2 &times; ' + (l * w + l * h + w * h) + ' = ' + A.fmt(sa) + '.'], explain: A.fmt(sa) + ' cm' + SQ + ' of paper.', meta: { k: 'ma-story', l: l, w: w, h: h } };
      }]
    ]
  };
  K.shapes('measurement', SHAPES);
})();
