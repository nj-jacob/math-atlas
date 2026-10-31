(function () {
  var A = Atlas, R = A.R, fmt = A.fmt;
  function cl(x) { return A.clean(x); }
  var TXT = 'style="paint-order:stroke;stroke:var(--card);stroke-width:4px"';

  /* ---- metric ladder ---- */
  var PRE = [['kilo', 'k', 3], ['hecto', 'h', 2], ['deca', 'da', 1], ['', '', 0], ['deci', 'd', -1], ['centi', 'c', -2], ['milli', 'm', -3]];
  var COMMON = { m: ['k', '', 'd', 'c', 'm'], g: ['k', '', 'm'], L: ['', 'm'] };
  function uinfo(u) { var b = u.slice(-1), p = u.slice(0, -1), e = 0; PRE.forEach(function (x) { if (x[1] === p) e = x[2]; }); return { b: b, p: p, e: e, i: 3 - e }; }
  function conv(v, from, to) { var k = uinfo(from).e - uinfo(to).e; return k >= 0 ? cl(v * Math.pow(10, k)) : cl(v / Math.pow(10, -k)); }
  function ladder(from, to) {
    var f = uinfo(from), t = uinfo(to), b = f.b, s = '', bw = 64, gap = 6, x0 = 6, y0 = 56;
    PRE.forEach(function (p, i) {
      var x = x0 + i * (bw + gap), y = y0 + i * 18, on = i === f.i || i === t.i, com = COMMON[b].indexOf(p[1]) >= 0;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="40" rx="5" style="fill:' + (i === f.i ? 'var(--hi)' : i === t.i ? 'color-mix(in srgb,var(--strand) 45%,var(--card))' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="' + (on ? 2.5 : 1.2) + '"' + (com || on ? '' : ' opacity=".45"') + '/>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (y + 27) + '" text-anchor="middle" font-size="19" font-weight="700"' + (com || on ? '' : ' opacity=".5"') + '>' + p[1] + b + '</text>';
    });
    if (f.i !== t.i) {
      var xa = x0 + f.i * (bw + gap) + bw / 2, ya = y0 + f.i * 18, xb = x0 + t.i * (bw + gap) + bw / 2, yb = y0 + t.i * 18, n = t.i - f.i, top = Math.min(ya, yb) - 40;
      s += '<path d="M' + xa + ' ' + (ya - 2) + ' Q' + ((xa + xb) / 2) + ' ' + top + ' ' + xb + ' ' + (yb - 4) + '" fill="none" style="stroke:var(--ink)" stroke-width="2.5"/>';
      s += '<polygon points="' + (xb - 6) + ',' + (yb - 14) + ' ' + (xb + 6) + ',' + (yb - 14) + ' ' + xb + ',' + (yb - 3) + '" style="fill:var(--ink)"/>';
      s += '<text x="' + ((xa + xb) / 2) + '" y="' + Math.max(20, (top + Math.min(ya, yb)) / 2 - 2) + '" text-anchor="middle" font-size="20" font-weight="800" ' + TXT + '>' + (n > 0 ? '&times; ' : '&divide; ') + fmt(Math.pow(10, Math.abs(n))) + '</text>';
    }
    s += '<text x="6" y="232" font-size="18" class="t2">&#8592; bigger units</text><text x="494" y="232" font-size="18" class="t2" text-anchor="end">smaller units &#8594;</text>';
    return A.svg(500, 240, s, 'Metric ladder from k' + b + ' down to m' + b + '. Each step is times 10.' + (f.i !== t.i ? ' From ' + from + ' to ' + to + '.' : ''));
  }

  /* ---- angles ---- */
  function P(cx, cy, r, d, dir) { var t = d * Math.PI / 180; return [cx + r * Math.cos(t), cy + (dir === 'cw' ? 1 : -1) * r * Math.sin(t)]; }
  function wedge(cx, cy, r, a0, a1, dir, style) {
    if (a1 - a0 >= 359.5) return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="' + style + '"/>';
    if (a1 - a0 <= 0) return '';
    var p = P(cx, cy, r, a0, dir), q = P(cx, cy, r, a1, dir);
    return '<path d="M' + cx + ' ' + cy + ' L' + p[0] + ' ' + p[1] + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' ' + (dir === 'cw' ? 1 : 0) + ' ' + q[0] + ' ' + q[1] + ' Z" style="' + style + '"/>';
  }
  function kind(d) { return d === 0 ? 'zero' : d < 90 ? 'acute' : d === 90 ? 'right' : d < 180 ? 'obtuse' : d === 180 ? 'straight' : d < 360 ? 'reflex' : 'full turn'; }
  function angleFig(deg, dir, o) {
    o = o || {}; var cx = 160, cy = 160, s = '', t;
    if (o.prot) {
      s += '<circle cx="160" cy="160" r="142" style="fill:none;stroke:var(--ink2)" stroke-width="1.5"/>';
      for (t = 0; t < 360; t += 5) { var a = P(cx, cy, 142, t, dir), b = P(cx, cy, t % 10 ? 135 : t % 30 ? 130 : 124, t, dir); s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" style="stroke:var(--ink2)" stroke-width="' + (t % 30 ? 1 : 2) + '"/>'; }
    }
    s += wedge(cx, cy, 44, 0, deg, dir, 'fill:color-mix(in srgb,var(--strand) 35%,transparent);stroke:var(--strand);stroke-width:2');
    var e = P(cx, cy, 152, deg, dir);
    s += '<line x1="160" y1="160" x2="312" y2="160" style="stroke:var(--ink)" stroke-width="3"/><line x1="160" y1="160" x2="' + e[0] + '" y2="' + e[1] + '" style="stroke:var(--ink)" stroke-width="3"/><circle cx="160" cy="160" r="4" style="fill:var(--ink)"/>';
    if (o.prot) for (t = 0; t < 360; t += 30) { var q = P(cx, cy, 108, t, dir); s += '<text x="' + q[0] + '" y="' + (q[1] + 5) + '" text-anchor="middle" font-size="15" class="t2" ' + TXT + '>' + t + '</text>'; }
    if (o.label) { var l = P(cx, cy, deg < 40 ? 80 : 68, deg / 2, dir); s += '<text x="' + l[0] + '" y="' + (l[1] + 6) + '" text-anchor="middle" font-size="19" font-weight="800" ' + TXT + '>' + o.label + '</text>'; }
    var lbl = 'An angle of ' + (o.label || 'unknown size') + ' measured ' + (dir === 'cw' ? 'clockwise' : 'counterclockwise') + ' from a ray pointing right';
    if (!o.prot && deg <= 180) return '<svg viewBox="0 ' + (dir === 'cw' ? 140 : 0) + ' 320 180" width="320" role="img" aria-label="' + lbl + '">' + s + '</svg>';
    return A.svg(320, 320, s, 'An angle of ' + (o.label || 'unknown size') + ' measured ' + (dir === 'cw' ? 'clockwise' : 'counterclockwise') + ' from a ray pointing right' + (o.prot ? ', on a 360 degree protractor' : ''));
  }
  function lab(cx, cy, mid, span, txt, rmin) {
    var r = Math.min(120, Math.max(rmin || 62, 26 / Math.sin(Math.max(span, 4) * Math.PI / 360))), p = P(cx, cy, r, mid, 'ccw');
    return '<text x="' + p[0] + '" y="' + (p[1] + 6) + '" text-anchor="middle" font-size="18" font-weight="800" ' + TXT + '>' + txt + '</text>';
  }
  var S1 = 'fill:color-mix(in srgb,var(--strand) 35%,transparent);stroke:var(--strand);stroke-width:2', S2 = 'fill:color-mix(in srgb,var(--sb) 35%,transparent);stroke:var(--sb);stroke-width:2';
  /* a right or straight angle split by one ray at x degrees */
  function splitFig(total, x, l1, l2) {
    var cx = total === 90 ? 110 : 200, cy = 200, s = '', end = P(cx, cy, 175, total, 'ccw'), mid = P(cx, cy, 175, x, 'ccw');
    s += wedge(cx, cy, 40, 0, x, 'ccw', S1) + wedge(cx, cy, 34, x, total, 'ccw', S2);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 175) + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="3"/><line x1="' + cx + '" y1="' + cy + '" x2="' + end[0] + '" y2="' + end[1] + '" style="stroke:var(--ink)" stroke-width="3"/><line x1="' + cx + '" y1="' + cy + '" x2="' + mid[0] + '" y2="' + mid[1] + '" style="stroke:var(--ink)" stroke-width="3"/>';
    if (total === 90) s += '<rect x="' + cx + '" y="' + (cy - 14) + '" width="14" height="14" fill="none" style="stroke:var(--ink)" stroke-width="2"/>';
    s += lab(cx, cy, x / 2, x, l1) + lab(cx, cy, (x + total) / 2, total - x, l2);
    return A.svg(400, 220, s, (total === 90 ? 'A right angle' : 'A straight angle') + ' split into ' + l1 + ' and ' + l2);
  }
  /* two crossing lines; L = labels for the 4 angles, counterclockwise from the right */
  function crossFig(a, L) {
    var cx = 200, cy = 120, s = '', len = Math.min(190, 108 / Math.sin(a * Math.PI / 180)), p = P(cx, cy, len, a, 'ccw'), q = P(cx, cy, len, a + 180, 'ccw');
    var sp = [a, 180 - a, a, 180 - a], st = [0, a, 180, 180 + a];
    for (var i = 0; i < 4; i++) s += wedge(cx, cy, i % 2 ? 24 : 30, st[i], st[i] + sp[i], 'ccw', i % 2 ? S2 : S1);
    s += '<line x1="10" y1="120" x2="390" y2="120" style="stroke:var(--ink)" stroke-width="3"/><line x1="' + q[0] + '" y1="' + q[1] + '" x2="' + p[0] + '" y2="' + p[1] + '" style="stroke:var(--ink)" stroke-width="3"/>';
    for (i = 0; i < 4; i++) if (L[i]) s += lab(cx, cy, st[i] + sp[i] / 2, sp[i], L[i], 58);
    return A.svg(400, 240, s, 'Two lines crossing. Angles: ' + L.filter(Boolean).join(', '));
  }
  /* triangle with base angles a (left) and b (right); L = {A, B, C, ext} labels; ext is the exterior angle at B */
  function triFig(a, b, L) {
    var r = Math.PI / 180, AC = Math.sin(b * r) / Math.sin((a + b) * r), C = [AC * Math.cos(a * r), AC * Math.sin(a * r)];
    var xs = [0, 1, C[0]].concat(L.ext ? [1.32] : []), mnx = Math.min.apply(null, xs), mxx = Math.max.apply(null, xs), k = Math.min(320 / (mxx - mnx), 165 / C[1]);
    function S(p) { return [40 + (p[0] - mnx) * k, 205 - p[1] * k]; }
    var pa = S([0, 0]), pb = S([1, 0]), pc = S(C), s = '';
    var dA = Math.atan2(-(pa[1] - pc[1]), pa[0] - pc[0]) / r; if (dA < 0) dA += 360;
    s += wedge(pa[0], pa[1], 30, 0, a, 'ccw', S1) + wedge(pb[0], pb[1], 30, 180 - b, 180, 'ccw', S1) + wedge(pc[0], pc[1], 26, dA, dA + 180 - a - b, 'ccw', S1);
    if (L.ext) { s += wedge(pb[0], pb[1], 26, 0, 180 - b, 'ccw', S2) + '<line x1="' + pb[0] + '" y1="' + pb[1] + '" x2="' + Math.min(395, pb[0] + 0.32 * k + 20) + '" y2="' + pb[1] + '" style="stroke:var(--ink)" stroke-width="2.5" stroke-dasharray="7 5"/>'; }
    s += '<polygon points="' + [pa, pb, pc].map(function (p) { return p.join(','); }).join(' ') + '" fill="none" style="stroke:var(--ink)" stroke-width="3" stroke-linejoin="round"/>';
    var g = [(pa[0] + pb[0] + pc[0]) / 3, (pa[1] + pb[1] + pc[1]) / 3];
    function inside(p, ang, t) { if (!t) return ''; var dx = g[0] - p[0], dy = g[1] - p[1], d = Math.sqrt(dx * dx + dy * dy), m = Math.min(d * 0.8, Math.max(46, 24 / Math.sin(ang * r / 2))); return '<text x="' + (p[0] + dx / d * m) + '" y="' + (p[1] + dy / d * m + 6) + '" text-anchor="middle" font-size="18" font-weight="800" ' + TXT + '>' + t + '</text>'; }
    s += inside(pa, a, L.A) + inside(pb, b, L.B) + inside(pc, 180 - a - b, L.C);
    if (L.ext) s += lab(pb[0], pb[1], (180 - b) / 2, 180 - b, L.ext, 48);
    return A.svg(400, 230, s, 'A triangle. Angles: ' + [L.A, L.B, L.C].filter(Boolean).join(', ') + (L.ext ? '. Exterior angle: ' + L.ext : ''));
  }

  /* ---- area figures ---- */
  var FILL = 'fill:color-mix(in srgb,var(--strand) 25%,var(--card));stroke:var(--strand)', FILL2 = 'fill:color-mix(in srgb,var(--sb) 28%,var(--card));stroke:var(--sb)';
  function T(x, y, t, anc, sz) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anc || 'middle') + '" font-size="' + (sz || 17) + '" font-weight="700" ' + TXT + '>' + t + '</text>'; }
  function poly(pts, st, w) { return '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" style="' + st + '" stroke-width="' + (w || 2.5) + '" stroke-linejoin="round"/>'; }
  function trapFig(a, b, h, split) {
    if (a > b) { var t0 = a; a = b; b = t0; }
    var s = Math.min(300 / b, 150 / h, 26), x0 = 200 - b * s / 2, y0 = 190, off = (b - a) * 0.35;
    var BL = [x0, y0], BR = [x0 + b * s, y0], TR = [x0 + (off + a) * s, y0 - h * s], TL = [x0 + off * s, y0 - h * s], o = '';
    if (split) o += poly([TL, TR, BR], FILL2) + poly([TL, BR, BL], FILL);
    else o += poly([BL, BR, TR, TL], FILL, 3);
    o += '<line x1="' + TL[0] + '" y1="' + TL[1] + '" x2="' + TL[0] + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="6 4"/><rect x="' + TL[0] + '" y="' + (y0 - 10) + '" width="10" height="10" fill="none" style="stroke:var(--ink)"/>';
    o += T((TL[0] + TR[0]) / 2, TL[1] - 8, a + ' cm') + T(200, y0 + 24, b + ' cm') + T(TL[0] + 6, (TL[1] + y0) / 2 + (split ? 18 : 6), h + ' cm', 'start');
    return A.svg(400, 222, o, 'A trapezoid with parallel sides ' + a + ' cm and ' + b + ' cm, height ' + h + ' cm' + (split ? ', cut into two triangles along a diagonal' : ''));
  }
  function diagFig(d1, d2, kite, box) {
    var s = Math.min(300 / d1, 170 / d2, 26), cx = 200, y0 = 24, p = kite ? d2 * 0.3 : d2 / 2, w = d1 * s / 2, H = d2 * s;
    var top = [cx, y0], rt = [cx + w, y0 + p * s], bot = [cx, y0 + H], lf = [cx - w, y0 + p * s], o = '';
    if (box) o += '<rect x="' + (cx - w) + '" y="' + y0 + '" width="' + 2 * w + '" height="' + H + '" style="' + FILL2 + '" stroke-width="1.5" stroke-dasharray="6 4"/>';
    o += poly([top, rt, bot, lf], FILL, 3);
    o += '<line x1="' + lf[0] + '" y1="' + lf[1] + '" x2="' + rt[0] + '" y2="' + rt[1] + '" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="6 4"/><line x1="' + cx + '" y1="' + y0 + '" x2="' + cx + '" y2="' + (y0 + H) + '" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="6 4"/>';
    o += T(cx + w / 2, lf[1] - 8, d1 + ' cm') + T(cx + 8, y0 + p * s + (H - p * s) / 2 + 20, d2 + ' cm', 'start');
    return A.svg(400, H + 40, o, 'A ' + (kite ? 'kite' : 'rhombus') + ' with diagonals ' + d1 + ' cm and ' + d2 + ' cm' + (box ? ', inside a ' + d1 + ' by ' + d2 + ' rectangle' : ''));
  }
  function lFig(W, H, cw, ch, split) {
    var s = Math.min(300 / W, 170 / H, 24), x0 = 200 - W * s / 2, y0 = 20, X = function (x) { return x0 + x * s; }, Y = function (y) { return y0 + y * s; }, o = '';
    o += poly([[X(0), Y(0)], [X(W - cw), Y(0)], [X(W - cw), Y(ch)], [X(W), Y(ch)], [X(W), Y(H)], [X(0), Y(H)]], FILL, 3);
    if (split) o += '<line x1="' + X(W - cw) + '" y1="' + Y(ch) + '" x2="' + X(W - cw) + '" y2="' + Y(H) + '" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="6 4"/>';
    o += T((X(0) + X(W)) / 2, Y(H) + 24, W + ' cm') + T(X(0) - 8, (Y(0) + Y(H)) / 2 + 6, H + ' cm', 'end') + T((X(W - cw) + X(W)) / 2, Y(ch) - 8, cw + ' cm') + T(X(W - cw) - 6, (Y(0) + Y(ch)) / 2 + 6, ch + ' cm', 'end');
    return A.svg(400, H * s + 52, o, 'An L shape: a ' + W + ' by ' + H + ' cm rectangle with a ' + cw + ' by ' + ch + ' cm corner cut out');
  }
  function houseFig(w, h, t) {
    var s = Math.min(240 / w, 170 / (h + t), 24), x0 = 200 - w * s / 2, yb = 196, yt = yb - h * s, ya = yt - t * s, o = '';
    o += poly([[x0, yb], [x0 + w * s, yb], [x0 + w * s, yt], [x0, yt]], FILL, 3) + poly([[x0, yt], [x0 + w * s, yt], [200, ya]], FILL2, 3);
    o += '<line x1="200" y1="' + ya + '" x2="200" y2="' + yt + '" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="6 4"/>';
    o += T(200, yb + 22, w + ' cm') + T(x0 + w * s + 8, (yb + yt) / 2 + 6, h + ' cm', 'start') + T(206, (ya + yt) / 2 + 8, t + ' cm', 'start');
    return A.svg(400, 222, o, 'A house shape: a ' + w + ' by ' + h + ' cm rectangle with a triangle on top, base ' + w + ' cm, height ' + t + ' cm');
  }

  /* ---- nets. mode: 'area' labels face areas, 'dims' labels face sizes ---- */
  function faceLab(x, y, w, h, a, d, mode, sz) {
    var t = mode === 'area' ? a + (w > 64 ? ' cm²' : '') : mode === 'dims' ? d : '';
    return t && w > 26 && h > 22 ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 6) + '" text-anchor="middle" font-size="' + (sz || 16) + '" font-weight="700">' + t + '</text>' : '';
  }
  function boxNet(l, w, h, mode) {
    var s = Math.min(380 / (2 * w + l), 380 / (2 * w + 2 * h), 34), x0 = (400 - (2 * w + l) * s) / 2, y0 = 6, o = '';
    var F = [[w, 0, l, w, 'top', 0], [0, w, w, h, 'side', 2], [w, w, l, h, 'front', 1], [w + l, w, w, h, 'side', 2], [w, w + h, l, w, 'bottom', 0], [w, 2 * w + h, l, h, 'back', 1]];
    var C = [FILL, FILL2, 'fill:color-mix(in srgb,var(--ink2) 16%,var(--card));stroke:var(--ink)'];
    F.forEach(function (f) { var x = x0 + f[0] * s, y = y0 + f[1] * s; o += '<rect x="' + x + '" y="' + y + '" width="' + f[2] * s + '" height="' + f[3] * s + '" style="' + C[f[5]] + '" stroke-width="2"/>' + faceLab(x, y, f[2] * s, f[3] * s, f[2] * f[3], f[2] + ' &times; ' + f[3], mode); });
    return A.svg(400, (2 * w + 2 * h) * s + 12, o, 'Net of a rectangular prism ' + l + ' by ' + w + ' by ' + h + ' cm: 6 rectangles');
  }
  function pyrNet(b, t, mode) {
    var s = Math.min(380 / (b + 2 * t), 30), c = 200, half = b * s / 2, H = (b + 2 * t) * s, cy = H / 2 + 6, o = '';
    var sq = [[c - half, cy - half], [c + half, cy - half], [c + half, cy + half], [c - half, cy + half]], ts = t * s;
    o += poly([sq[0], sq[1], [c, cy - half - ts]], FILL2, 2) + poly([sq[1], sq[2], [c + half + ts, cy]], FILL2, 2) + poly([sq[2], sq[3], [c, cy + half + ts]], FILL2, 2) + poly([sq[3], sq[0], [c - half - ts, cy]], FILL2, 2);
    o += poly(sq, FILL, 2) + faceLab(c - half, cy - half, b * s, b * s, b * b, b + ' &times; ' + b, mode);
    if (mode === 'area' && ts > 30 && b * s > 30) o += '<text x="' + c + '" y="' + (cy - half - ts / 3 + 4) + '" text-anchor="middle" font-size="15" font-weight="700">' + (b * t / 2) + '</text>';
    if (mode === 'dims') o += '<line x1="' + c + '" y1="' + (cy - half) + '" x2="' + c + '" y2="' + (cy - half - ts) + '" style="stroke:var(--ink)" stroke-dasharray="4 3" stroke-width="1.5"/>' + T(c + 6, cy - half - ts / 2 + 6, t, 'start', 16);
    return A.svg(400, H + 12, o, 'Net of a square-based pyramid: a ' + b + ' cm square and 4 triangles with height ' + t + ' cm');
  }
  function triNet(k, L, mode) {
    var a = 3 * k, b = 4 * k, c = 5 * k, s = Math.min(380 / (12 * k), 360 / (L + 6 * k), 30), x0 = (400 - 12 * k * s) / 2, y0 = 6 + a * s, o = '', x1 = x0 + a * s;
    o += poly([[x1, y0], [x1 + b * s, y0], [x1, y0 - a * s]], FILL2, 2) + poly([[x1, y0 + L * s], [x1 + b * s, y0 + L * s], [x1, y0 + L * s + a * s]], FILL2, 2);
    [[0, a], [a, b], [a + b, c]].forEach(function (r) { var x = x0 + r[0] * s; o += '<rect x="' + x + '" y="' + y0 + '" width="' + r[1] * s + '" height="' + L * s + '" style="' + FILL + '" stroke-width="2"/>' + faceLab(x, y0, r[1] * s, L * s, r[1] * L, r[1] + ' &times; ' + L, mode, 15); });
    if (mode === 'area' && a * s > 34) o += '<text x="' + (x1 + b * s / 3) + '" y="' + (y0 - a * s / 3 + 5) + '" text-anchor="middle" font-size="15" font-weight="700">' + (a * b / 2) + '</text>';
    return A.svg(400, (L + 6 * k) * s + 12, o, 'Net of a triangular prism: 2 right triangles with legs ' + a + ' and ' + b + ' cm, and rectangles ' + a + ', ' + b + ' and ' + c + ' cm wide by ' + L + ' cm long');
  }
  /* small cube-net pictures for examples and non-examples */
  function sqNet(cells) {
    var z = 30, mx = 0, my = 0, o = '';
    cells.forEach(function (c) { mx = Math.max(mx, c[0]); my = Math.max(my, c[1]); o += '<rect x="' + (3 + c[0] * z) + '" y="' + (3 + c[1] * z) + '" width="' + z + '" height="' + z + '" style="' + FILL + '" stroke-width="2"/>'; });
    return A.svg((mx + 1) * z + 6, (my + 1) * z + 6, o, 'Six squares joined edge to edge');
  }

  /* ---- solids for the faces skill ---- */
  var BASE = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon' };
  var SOL = [['cube', 'prism', 4], ['triangular prism', 'prism', 3], ['pentagonal prism', 'prism', 5], ['hexagonal prism', 'prism', 6], ['square-based pyramid', 'pyramid', 4], ['triangular pyramid', 'pyramid', 3], ['pentagonal pyramid', 'pyramid', 5], ['hexagonal pyramid', 'pyramid', 6]];
  function nfaces(x) { return x[1] === 'prism' ? x[2] + 2 : x[2] + 1; }
  function fdesc(x) {
    if (x[0] === 'cube') return '6 squares';
    if (x[0] === 'triangular pyramid') return '4 triangles';
    return x[1] === 'prism' ? '2 ' + BASE[x[2]] + 's and ' + x[2] + ' rectangles' : '1 ' + BASE[x[2]] + ' and ' + x[2] + ' triangles';
  }

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var CH = 'measurement', g = G6.g, glab = G6.lab, play = G6.play;
  function nv(h, id) { return Math.max(1, Math.min(20, Math.round(+h.querySelector(id).value) || 1)); }
  var LESSONS = [
    { id: 'units', title: 'Metric units', sub: 'the conversion ladder', concepts: [
      { id: 'ladder', title: 'Converting units', exp: ['E2.1'], skill: 'me-convert',
        body: '<p>Metric units sit on a <b>ladder</b>. Each step down is a unit 10 times smaller. Going <b>down</b> to a smaller unit: <b>multiply</b> by 10 for each step. Going <b>up</b>: <b>divide</b>.</p>',
        watch: play([
          ['The ladder for length. Kilo is 1000, centi is one hundredth, milli is one thousandth.', ladder('m', 'm')],
          ['2.5 m to cm: 2 steps down, so multiply by 100.', ladder('m', 'cm'), '2.5 m = 250 cm'],
          ['4500 mL to L: 3 steps up, so divide by 1000.', ladder('mL', 'L'), '4500 mL = 4.5 L'],
          ['Smaller unit, bigger number. Bigger unit, smaller number.', ladder('kg', 'g'), '1 kg = 1000 g']
        ]),
        try: glab(CH, 0, 'Use the ladder to show that <b>3.5 kg = 3500 g</b>.', function (h) { return +h.querySelector('#cvv').value === 3.5 && h.querySelector('#cvf').value === 'kg' && h.querySelector('#cvt').value === 'g'; }, 'Yes: 3 steps down, times 1000.'),
        key: '<p>Count the steps. Down: multiply. Up: divide.</p>',
        check: [{ q: 'How many millilitres are in 2.4 L?', type: 'num', unit: 'mL', answer: 2400, hint: 'L to mL: multiply by 1000.', explain: '2.4 &times; 1000 = 2400 mL.' }, g(CH, 'me-convert', 1), g(CH, 'me-convert', 2)] },
      { id: 'square', title: 'Square units', exp: ['E2.1'], skill: 'me-convert', hard: true,
        body: '<p>A square metre is a square 100 cm by 100 cm. So 1 m² is 100 &times; 100 = <b>10 000 cm²</b>, not 100.</p>',
        watch: play([
          ['1 m² is a square 1 m long and 1 m wide.', '<p class="g6-big">1 m &times; 1 m = 1 m²</p>'],
          ['Each side is 100 cm.', '<p class="g6-big">100 cm &times; 100 cm</p>'],
          ['So it holds 10 000 square centimetres.', '<p class="g6-big">= 10 000 cm²</p>', 'Not 100 cm²']
        ]),
        ways: [{ label: 'Count rows', html: '<p>Fill a square metre with 1 cm squares. One row along the bottom holds 100. There are 100 rows. 100 rows of 100 is 10 000.</p>' }],
        key: '<p>For square units, convert both the length and the width.</p>',
        mistake: '<p>Converting square units with the length rule: writing 1 m² = 100 cm².</p>',
        check: [{ q: 'How many cm² are in 1 m²?', type: 'mc', options: ['100', '1000', '10 000', '100 000'], answer: 2, hint: '100 cm by 100 cm.', explain: '100 &times; 100 = 10 000.' }, { q: 'A rug is 2 m by 3 m. What is its area in m²?', type: 'num', unit: 'm²', answer: 6, hint: 'Length times width.', explain: '2 &times; 3 = 6 m².' }] }
    ] },
    { id: 'angles', title: 'Angles to 360°', sub: 'measure and draw any turn', concepts: [
      { id: 'big', title: 'Angles up to 360°', exp: ['E2.2'], skill: 'me-angle',
        body: '<p>An angle measures a turn. A full turn is <b>360°</b>. Acute: less than 90°. Obtuse: between 90° and 180°. <b>Reflex</b>: between 180° and 360°.</p>',
        watch: play([
          ['45°: an acute angle.', angleFig(45, 'ccw', { prot: true, label: '45°' })],
          ['135°: obtuse.', angleFig(135, 'ccw', { prot: true, label: '135°' })],
          ['250°: past a straight line, so reflex.', angleFig(250, 'ccw', { prot: true, label: '250°' }), 'Reflex: more than 180°']
        ]),
        try: glab(CH, 1, 'Make a <b>reflex</b> angle of <b>250°</b> going <b>clockwise</b>.', function (h) { return +h.querySelector('#ang').value === 250 && h.querySelector('#adir').value === 'cw'; }, 'Yes: 250° clockwise.'),
        key: '<p>Start at 0 on the first ray. Estimate first: more or less than 180°?</p>',
        mistake: '<p>Reading the wrong scale on the protractor. Ask the student to estimate first and check the answer against the estimate.</p>',
        check: [g(CH, 'me-angle', 1), g(CH, 'me-angle', 2)] },
      { id: 'ways', title: 'Clockwise and counterclockwise', exp: ['E2.2'], skill: 'me-angle', hard: true,
        body: '<p>From one ray to the other you can turn either way. The two ways together make a full turn: they add to <b>360°</b>.</p>',
        watch: play([
          ['130° counterclockwise.', angleFig(130, 'ccw', { prot: true, label: '130°' })],
          ['Same two rays, the other way: clockwise.', angleFig(230, 'cw', { prot: true, label: '230°' }), '360 − 130 = 230']
        ]),
        ways: [{ label: 'Think of a clock', html: '<p>From 12 to 3 clockwise is a quarter turn, 90°. From 12 to 3 the other way round is three quarters, 270°. 90 + 270 = 360.</p>' }],
        key: '<p>Other way = 360 &minus; this way.</p>',
        check: [{ q: 'An angle measures 130° counterclockwise. What does it measure clockwise?', type: 'num', unit: '°', answer: 230, hint: 'They add to 360°.', explain: '360 &minus; 130 = 230°.' }, g(CH, 'me-angle', 3)] }
    ] },
    { id: 'unknown', title: 'Unknown angles', sub: 'find angles without a protractor', concepts: [
      { id: 'pairs', title: 'Complementary and supplementary', exp: ['E2.3'], skill: 'me-relate',
        body: '<p><b>Complementary</b> angles add to <b>90°</b>. <b>Supplementary</b> angles add to <b>180°</b>, a straight line.</p>',
        watch: play([
          ['A right angle split in two.', splitFig(90, 35, '35°', '?')],
          ['They add to 90°: 90 − 35 = 55°.', splitFig(90, 35, '35°', '55°'), 'Complementary'],
          ['A straight line split in two.', splitFig(180, 110, '110°', '?')],
          ['They add to 180°: 180 − 110 = 70°.', splitFig(180, 110, '110°', '70°'), 'Supplementary']
        ]),
        key: '<p>C before S, 90 before 180.</p>',
        mistake: '<p>Mixing up complementary (90°) and supplementary (180°). The memory trick: C comes before S, and 90 comes before 180.</p>',
        check: [{ q: 'Two angles are complementary. One is 35°. What is the other?', type: 'num', unit: '°', answer: 55, hint: 'They add to 90°.', explain: '55°.' }, { q: 'Two angles are supplementary. One is 115°. What is the other?', type: 'num', unit: '°', answer: 65, hint: 'They add to 180°.', explain: '65°.' }, g(CH, 'me-relate', 1)] },
      { id: 'opposite', title: 'Opposite angles', exp: ['E2.3'], skill: 'me-relate',
        body: '<p>Where two lines cross, the angles <b>opposite</b> each other are equal. Angles next to each other are supplementary.</p>',
        watch: play([
          ['Two lines cross. One angle is 50°.', crossFig(50, ['50°', '', '', ''])],
          ['Next to it on the line: 180 − 50 = 130°.', crossFig(50, ['50°', '130°', '', ''])],
          ['Opposite angles match.', crossFig(50, ['50°', '130°', '50°', '130°']), 'All four: 360°']
        ]),
        try: glab(CH, 2, 'Make all four angles <b>equal</b>.', function (h) { return +h.querySelector('#xa').value === 90; }, 'Yes: four right angles, 90° each.'),
        key: '<p>Opposite: equal. Next to each other: add to 180°.</p>',
        check: [{ q: 'Two lines cross. One angle is 72°. What is the angle opposite it?', type: 'num', unit: '°', answer: 72, hint: 'Opposite angles are equal.', explain: '72°.' }, g(CH, 'me-relate', 2)] },
      { id: 'triangle', title: 'Angles in a triangle', exp: ['E2.3'], skill: 'me-relate', hard: true,
        body: '<p>The three <b>interior</b> angles of a triangle add to <b>180°</b>. An <b>exterior</b> angle and the interior angle beside it add to 180°.</p>',
        watch: play([
          ['A triangle with angles 50° and 70°.', triFig(50, 70, { A: '50°', B: '70°', C: '?' })],
          ['The third angle: 180 − 50 − 70 = 60°.', triFig(50, 70, { A: '50°', B: '70°', C: '60°' })],
          ['Extend a side. The exterior angle: 180 − 70 = 110°. That equals 50 + 60.', triFig(50, 70, { A: '50°', B: '70°', C: '60°', ext: '110°' }), 'Exterior = the two far angles']
        ]),
        try: glab(CH, 3, 'Make angle C a <b>right angle</b> (90°).', function (h) { return +h.querySelector('#ta').value + +h.querySelector('#tb').value === 90; }, 'Yes: A + B = 90°, so C = 90°.'),
        ways: [{ label: 'Tear the corners', html: '<p>Cut out a paper triangle. Tear off the three corners and line them up point to point. They always make a straight line: 180°.</p>' }],
        key: '<p>Inside angles: 180°. Exterior + its neighbour: 180°.</p>',
        check: [{ q: 'A triangle has angles of 50° and 70°. What is the third angle?', type: 'num', unit: '°', answer: 60, hint: 'Take both from 180.', explain: '60°.' }, g(CH, 'me-relate', 2), g(CH, 'me-relate', 3)] }
    ] },
    { id: 'area', title: 'Area', sub: 'cut shapes into pieces you know', concepts: [
      { id: 'trap', title: 'Trapezoids', exp: ['E2.4'], skill: 'me-area',
        body: '<p>Cut a trapezoid along a diagonal into 2 triangles with the same height. Area = (top + bottom) &times; height &divide; 2.</p>',
        watch: play([
          ['A trapezoid: top 6 cm, bottom 10 cm, height 4 cm.', trapFig(6, 10, 4)],
          ['Cut along a diagonal: 2 triangles, both 4 cm high.', trapFig(6, 10, 4, true)],
          ['Blue: 6 × 4 ÷ 2 = 12. Orange: 10 × 4 ÷ 2 = 20.', trapFig(6, 10, 4, true), '12 + 20 = 32 cm²'],
          ['Shortcut: (6 + 10) × 4 ÷ 2 = 32 cm².', trapFig(6, 10, 4), '32 cm²']
        ]),
        try: glab(CH, 4, 'Make a <b>trapezoid</b> with an area of exactly <b>30 cm²</b>.', function (h) { return h.querySelector('#arsh').value === 'trap' && (nv(h, '#ar1') + nv(h, '#ar2')) * nv(h, '#ar3') === 60; }, 'Yes: 30 cm².'),
        key: '<p>Add the parallel sides, times the height, divide by 2.</p>',
        mistake: '<p>Using the slanted side as the height. The height is measured straight across, at 90°, between the parallel sides.</p>',
        check: [{ q: 'A trapezoid has parallel sides 6 cm and 10 cm and height 4 cm. What is its area?', type: 'num', unit: 'cm²', answer: 32, hint: '(6 + 10) &times; 4 &divide; 2.', explain: '32 cm².' }, g(CH, 'me-area', 1), g(CH, 'me-area', 2)] },
      { id: 'kite', title: 'Rhombuses and kites', exp: ['E2.4'], skill: 'me-area', hard: true,
        body: '<p>Draw a rectangle around the diagonals. A rhombus or kite fills exactly <b>half</b> of it. Area = diagonal &times; diagonal &divide; 2.</p>',
        watch: play([
          ['A rhombus with diagonals 10 cm and 7 cm.', diagFig(10, 7, false)],
          ['Draw a rectangle around it: 10 × 7 = 70 cm².', diagFig(10, 7, false, true)],
          ['Each outside corner matches a triangle inside. The rhombus is half: 35 cm².', diagFig(10, 7, false, true), '70 ÷ 2 = 35 cm²'],
          ['A kite works the same way: 8 × 6 ÷ 2 = 24 cm².', diagFig(8, 6, true, true), '24 cm²']
        ]),
        ways: [{ label: 'Two triangles', html: '<p>Cut the kite along its long diagonal (8 cm). Each half is a triangle with base 8 cm and height 3 cm: 8 &times; 3 &divide; 2 = 12. Two of them: 24 cm².</p>' }],
        key: '<p>Diagonal &times; diagonal &divide; 2.</p>',
        check: [{ q: 'A rhombus has diagonals of 10 cm and 7 cm. What is its area?', type: 'num', unit: 'cm²', answer: 35, hint: 'Multiply, then halve.', explain: '35 cm².' }, { q: 'A kite has diagonals of 8 cm and 6 cm. What is its area?', type: 'num', unit: 'cm²', answer: 24, hint: 'Multiply, then halve.', explain: '24 cm².' }, g(CH, 'me-area', 3)] },
      { id: 'composite', title: 'Composite shapes', exp: ['E2.4'], skill: 'me-area',
        body: '<p>Cut a composite shape into rectangles and triangles, then add. Or find a big rectangle and subtract the missing piece.</p>',
        watch: play([
          ['An L shape: 10 by 8 with a 4 by 3 corner missing.', lFig(10, 8, 4, 3).replace(/ cm/g, ' m')],
          ['Subtract: 10 × 8 − 4 × 3 = 80 − 12 = 68 m².', lFig(10, 8, 4, 3).replace(/ cm/g, ' m'), '68 m²'],
          ['Or cut it into two rectangles and add. Same answer.', lFig(10, 8, 4, 3, true).replace(/ cm/g, ' m'), '68 m²'],
          ['A house shape: rectangle plus triangle.', houseFig(8, 5, 3), '40 + 12 = 52 cm²']
        ]),
        key: '<p>Split and add, or surround and subtract.</p>',
        check: [{ q: 'A house shape is an 8 cm by 5 cm rectangle with a triangle on top (base 8 cm, height 3 cm). What is its area?', type: 'num', unit: 'cm²', answer: 52, fig: houseFig(8, 5, 3), hint: 'Rectangle plus triangle.', explain: '40 + 12 = 52 cm².' }, g(CH, 'me-area', 2)] }
    ] },
    { id: 'nets', title: 'Nets and surface area', sub: 'unfold it, add the faces', concepts: [
      { id: 'net', title: 'Nets of prisms and pyramids', exp: ['E2.5'], skill: 'me-faces',
        body: '<p>A <b>net</b> is a flat pattern that folds into a 3D object. A <b>prism</b> has 2 matching bases joined by rectangles. A <b>pyramid</b> has 1 base and triangles that meet at a point.</p>',
        watch: play([
          ['A box unfolded: 6 rectangles in matching pairs.', boxNet(5, 3, 2, 'dims'), 'Rectangular prism: 6 faces'],
          ['A square-based pyramid unfolded: 1 square and 4 triangles.', pyrNet(4, 5, 'dims'), '5 faces'],
          ['A triangular prism: 2 triangles and 3 rectangles.', triNet(1, 6, 'dims'), '5 faces']
        ]),
        ways: [{ label: 'Cube nets', html: '<div class="tbl"><table><thead><tr><th class="l">Net</th><th class="l">Cube?</th></tr></thead><tbody><tr><td class="l">' + sqNet([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]]) + '</td><td class="l"><b>yes</b></td></tr><tr><td class="l">' + sqNet([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]) + '</td><td class="l"><b>no</b>: it cannot fold up</td></tr></tbody></table></div>' }],
        key: '<p>A net shows every face exactly once.</p>',
        mistake: '<p>Counting only the faces you can see in a drawing. A box drawing shows 3 faces, but a box has 6.</p>',
        check: [{ q: 'How many faces does a square-based pyramid have?', type: 'num', answer: 5, hint: '1 base and the triangles.', explain: '1 square + 4 triangles = 5.' }, g(CH, 'me-faces', 1), g(CH, 'me-faces', 2)] },
      { id: 'sa', title: 'Surface area', exp: ['E2.6'], skill: 'me-sa', hard: true,
        body: '<p><b>Surface area</b> is the total area of all the faces: how much paper covers the object. On a box, faces come in pairs, so find 3 areas and double each.</p>',
        watch: play([
          ['A box 5 cm long, 3 cm wide, 2 cm high.', boxNet(5, 3, 2, 'dims')],
          ['Find each face area.', boxNet(5, 3, 2, 'area'), '15, 10, 6'],
          ['Double each and add: 30 + 20 + 12 = 62 cm².', boxNet(5, 3, 2, 'area'), '62 cm²']
        ]),
        try: glab(CH, 5, 'Make a <b>rectangular prism</b> with a surface area of exactly <b>52 cm²</b>.', function (h) { function v(id) { return Math.max(1, Math.min(12, Math.round(+h.querySelector(id).value) || 1)); } var a = v('#n1'), b = v('#n2'), c = v('#n3'); return h.querySelector('#nsh').value === 'box' && 2 * (a * b + a * c + b * c) === 52; }, 'Yes: 52 cm².'),
        ways: [{ label: 'A pyramid', html: '<p>Square-based pyramid, base 4 cm, triangle height 5 cm. Base: 4 &times; 4 = 16. Each triangle: 4 &times; 5 &divide; 2 = 10, and there are 4: 40. Total: 56 cm².</p>' }],
        key: '<p>Add the area of every face.</p>',
        check: [{ q: 'A cube has edges of 4 cm. What is its surface area?', type: 'num', unit: 'cm²', answer: 96, hint: '6 equal squares.', explain: '6 &times; 16 = 96 cm².' }, g(CH, 'me-sa', 1), g(CH, 'me-sa', 2)] }
    ] }
  ];
  A.register('measurement', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Metric units and converting</h2>' +
'<p>Every metric unit is built from a base unit: the <b>metre</b> (m) for length, the <b>gram</b> (g) for mass and the <b>litre</b> (L) for capacity. A prefix tells you how big the unit is: <b>kilo</b> means 1000, <b>centi</b> means one hundredth, <b>milli</b> means one thousandth.</p>' +
'<p>Put the units on a ladder. Each step down is a unit 10 times smaller. To go <b>down</b> to a smaller unit, <b>multiply</b> by 10 for each step. To go <b>up</b> to a bigger unit, <b>divide</b> by 10 for each step.</p>' +
'<div class="lab"><span class="lt">Try it: the conversion ladder</span>' +
'<div class="ctrl"><label for="cvv">Amount<input type="number" id="cvv" min="0" max="100000" step="any" value="2.5" style="width:7em"></label><label for="cvk">Measuring<select id="cvk"><option value="m">length</option><option value="g">mass</option><option value="L">capacity</option></select></label><label for="cvf">From<select id="cvf"></select></label><label for="cvt">To<select id="cvt"></select></label></div>' +
'<div class="fig" id="cvfig"></div><div class="out" id="cvout"></div></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Use it for</th><th class="l">Units</th><th class="l">Remember</th></tr></thead><tbody>' +
'<tr><td class="l">Length</td><td class="l">mm, cm, m, km</td><td class="l">1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m</td></tr>' +
'<tr><td class="l">Mass</td><td class="l">mg, g, kg</td><td class="l">1 g = 1000 mg, 1 kg = 1000 g</td></tr>' +
'<tr><td class="l">Capacity</td><td class="l">mL, L</td><td class="l">1 L = 1000 mL</td></tr>' +
'<tr><td class="l">Area</td><td class="l">cm², m², km²</td><td class="l">1 m² = 10 000 cm²</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A water bottle holds 750 mL. How many litres do 6 bottles hold?</p><p>6 &times; 750 = 4500 mL. mL to L is 3 steps up the ladder, so divide by 1000: 4500 &divide; 1000 = <b>4.5 L</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Smaller unit, bigger number. Bigger unit, smaller number. 2.5 m and 250 cm are the same length.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking 1 m² = 100 cm². A square metre is 100 cm by 100 cm, so it holds 100 &times; 100 = <b>10 000</b> square centimetres.</p></div>' +
A.yt({ q: 'How many millilitres are in 2.4 L?', type: 'num', answer: 2400, unit: 'mL',
  hint: 'L to mL is 3 steps down the ladder: multiply by 1000.', explain: '2.4 &times; 1000 = 2400 mL.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Angles up to 360&deg;</h2>' +
'<p>An angle measures a turn. A full turn is <b>360&deg;</b>. Angles bigger than 180&deg; but less than 360&deg; are called <b>reflex</b> angles.</p>' +
'<div class="tbl"><table><tbody><tr><th class="l">acute</th><td class="l">less than 90&deg;</td><th class="l">straight</th><td class="l">exactly 180&deg;</td></tr><tr><th class="l">right</th><td class="l">exactly 90&deg;</td><th class="l">reflex</th><td class="l">between 180&deg; and 360&deg;</td></tr><tr><th class="l">obtuse</th><td class="l">between 90&deg; and 180&deg;</td><th class="l">full turn</th><td class="l">exactly 360&deg;</td></tr></tbody></table></div>' +
'<p>You can turn from one ray to the other <b>counterclockwise</b> or <b>clockwise</b>. One way is the short way and the other is the long way. Together they make a full turn.</p>' +
'<div class="lab"><span class="lt">Try it: turn a ray</span>' +
'<div class="ctrl"><label for="ang">Angle <output id="angv">120&deg;</output><input type="range" id="ang" min="0" max="360" step="5" value="120"></label><label for="adir">Direction<select id="adir"><option value="ccw">counterclockwise</option><option value="cw">clockwise</option></select></label><label for="aprot" style="flex-direction:row;align-items:center;gap:6px"><input type="checkbox" id="aprot" checked>show protractor</label></div>' +
'<div class="fig" id="afig"></div><div class="out" id="aout"></div></div>' +
'<div class="eg"><b class="t">Worked example: draw a 250&deg; angle</b><p>1. Draw a ray. Put the centre of a 360&deg; protractor on its end point, with 0 on the ray.</p><p>2. Count around the scale counterclockwise to 250 and make a dot.</p><p>3. Join the end point to the dot. Check: 250&deg; is between 180&deg; and 270&deg;, so the ray should point down and to the left.</p><p>With a 180&deg; protractor, draw 360 &minus; 250 = 110&deg; the other way instead.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Clockwise + counterclockwise = 360&deg;. If one way is 120&deg;, the other way is 360 &minus; 120 = 240&deg;.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Reading the wrong scale. Always start counting from the 0 on your first ray, and estimate first: is it less than or more than 180&deg;?</p></div>' +
A.yt({ q: 'An angle measures 130&deg; counterclockwise. What does it measure clockwise?', type: 'num', answer: 230, unit: '&deg;',
  hint: 'The two ways around add to 360&deg;.', explain: '360 &minus; 130 = 230&deg;.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Finding unknown angles</h2>' +
'<p>You can find an angle without a protractor if you know how it is related to other angles.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Name</th><th class="l">What it means</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l"><b>Complementary</b></td><td class="l">two angles that add to 90&deg;</td><td class="l">30&deg; and 60&deg;</td></tr>' +
'<tr><td class="l"><b>Supplementary</b></td><td class="l">two angles that add to 180&deg; (a straight line)</td><td class="l">110&deg; and 70&deg;</td></tr>' +
'<tr><td class="l"><b>Opposite</b></td><td class="l">across from each other where two lines cross; they are equal</td><td class="l">40&deg; and 40&deg;</td></tr>' +
'<tr><td class="l"><b>Interior</b> angles of a triangle</td><td class="l">the three inside angles add to 180&deg;</td><td class="l">50&deg; + 60&deg; + 70&deg;</td></tr>' +
'<tr><td class="l"><b>Exterior</b> angle</td><td class="l">made by extending one side; it and the interior angle beside it add to 180&deg;</td><td class="l">interior 70&deg;, exterior 110&deg;</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: two crossing lines</span>' +
'<div class="ctrl"><label for="xa">Angle <output id="xav">50&deg;</output><input type="range" id="xa" min="10" max="170" step="5" value="50"></label></div>' +
'<div class="fig" id="xfig"></div><div class="out" id="xout"></div></div>' +
'<div class="lab"><span class="lt">Try it: angles in a triangle</span>' +
'<div class="ctrl"><label for="ta">Angle A <output id="tav">60&deg;</output><input type="range" id="ta" min="10" max="150" step="5" value="60"></label><label for="tb">Angle B <output id="tbv">50&deg;</output><input type="range" id="tb" min="10" max="150" step="5" value="50"></label></div>' +
'<div class="fig" id="tfig"></div><div class="out" id="tout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A triangle has angles of 48&deg; and 67&deg;. Find the third angle and the exterior angle next to it.</p><p>Third angle: 180 &minus; 48 &minus; 67 = <b>65&deg;</b>. Exterior angle: 180 &minus; 65 = <b>115&deg;</b>. Check: 115 = 48 + 67. The exterior angle always equals the two far interior angles added together.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up complementary and supplementary. Memory trick: <b>C</b> comes before <b>S</b> in the alphabet, and <b>90</b> comes before <b>180</b>.</p></div>' +
A.yt({ q: 'Two angles are complementary. One is 35&deg;. What is the other?', type: 'num', answer: 55, unit: '&deg;',
  hint: 'Complementary angles add to 90&deg;.', explain: '90 &minus; 35 = 55&deg;.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Area by cutting into pieces</h2>' +
'<p>You already know the area of a rectangle (length &times; width), a parallelogram (base &times; height) and a triangle (base &times; height &divide; 2). Any other polygon can be cut into these shapes.</p>' +
'<div class="lab"><span class="lt">Try it: cut a shape apart</span>' +
'<div class="ctrl"><label for="arsh">Shape<select id="arsh"><option value="trap">trapezoid</option><option value="rh">rhombus</option><option value="kite">kite</option></select></label><label for="ar1"><span id="ar1l">Top side (cm)</span><input type="number" id="ar1" min="1" max="20" value="5"></label><label for="ar2"><span id="ar2l">Bottom side (cm)</span><input type="number" id="ar2" min="1" max="20" value="9"></label><label for="ar3" id="ar3w">Height (cm)<input type="number" id="ar3" min="1" max="20" value="4"></label></div>' +
'<div class="fig" id="arfig"></div><div class="out" id="arout"></div></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Shape</th><th class="l">Cut it into</th><th class="l">Area</th></tr></thead><tbody>' +
'<tr><td class="l">Trapezoid</td><td class="l">2 triangles with the same height</td><td class="l">(top + bottom) &times; height &divide; 2</td></tr>' +
'<tr><td class="l">Rhombus or kite</td><td class="l">half of the rectangle around the diagonals</td><td class="l">diagonal &times; diagonal &divide; 2</td></tr>' +
'<tr><td class="l">Composite shape</td><td class="l">rectangles and triangles</td><td class="l">add the pieces (or subtract a missing piece)</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>An L-shaped garden is a 10 m by 8 m rectangle with a 4 m by 3 m corner missing.</p><p>Subtract: 10 &times; 8 &minus; 4 &times; 3 = 80 &minus; 12 = <b>68 m²</b>. Or split it into two rectangles and add. You get the same answer either way.</p></div>' +
'<div class="fig">' + lFig(10, 8, 4, 3, true).replace(/ cm/g, ' m') + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>Kites and rhombuses: area = diagonal &times; diagonal &divide; 2. The shape fills exactly half of the rectangle drawn around its diagonals.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Using a slanted side as the height. The height is always measured <b>straight across at 90&deg;</b> between the parallel sides (the dashed line).</p></div>' +
A.yt({ q: 'A rhombus has diagonals of 10 cm and 7 cm. What is its area?', type: 'num', answer: 35, unit: 'cm²', fig: diagFig(10, 7, false, true),
  hint: 'Diagonal times diagonal, then divide by 2.', explain: '10 &times; 7 = 70, and 70 &divide; 2 = 35 cm².' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Nets and surface area</h2>' +
'<p>A <b>net</b> is a flat pattern that folds up into a 3D object. It shows every face exactly once. A <b>prism</b> has two matching bases joined by rectangles. A <b>pyramid</b> has one base and triangles that meet at a point.</p>' +
'<p>The <b>surface area</b> is the total area of all the faces: how much paper you need to cover the object. It is measured in square units such as cm².</p>' +
'<div class="lab"><span class="lt">Try it: unfold a solid</span>' +
'<div class="ctrl"><label for="nsh">Solid<select id="nsh"><option value="box">rectangular prism</option><option value="pyr">square-based pyramid</option><option value="tri">triangular prism</option></select></label><label for="n1"><span id="n1l">Length (cm)</span><input type="number" id="n1" min="1" max="12" value="6"></label><label for="n2"><span id="n2l">Width (cm)</span><input type="number" id="n2" min="1" max="12" value="4"></label><label for="n3" id="n3w">Height (cm)<input type="number" id="n3" min="1" max="12" value="3"></label></div>' +
'<div class="fig" id="nfig"></div><div class="out" id="nout"></div></div>' +
'<p><b>Does it fold into a cube?</b> Six squares are not always a cube net. Picture folding each one.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Net</th><th class="l">Cube?</th><th class="l">Why</th></tr></thead><tbody>' +
'<tr><td class="l">' + sqNet([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]]) + '</td><td class="l"><b>yes</b></td><td class="l">a row of 4 wraps around; one square folds up as the top, one down as the bottom</td></tr>' +
'<tr><td class="l">' + sqNet([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2], [1, 3]]) + '</td><td class="l"><b>yes</b></td><td class="l">the column of 4 wraps around; the two side squares close the ends</td></tr>' +
'<tr><td class="l">' + sqNet([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]) + '</td><td class="l"><b>no</b></td><td class="l">squares meet 4 at a corner, so it cannot fold up at all</td></tr>' +
'<tr><td class="l">' + sqNet([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]]) + '</td><td class="l"><b>no</b></td><td class="l">both top squares fold onto the same face and overlap</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Find the surface area of a box 6 cm long, 4 cm wide and 3 cm high.</p><p>Top and bottom: 6 &times; 4 = 24, twice is 48. Front and back: 6 &times; 3 = 18, twice is 36. Two ends: 4 &times; 3 = 12, twice is 24. Total: 48 + 36 + 24 = <b>108 cm²</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Surface area = add the area of every face. Faces come in matching pairs on a box, so find 3 areas and double each one.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting only the faces you can see in a drawing. A box drawing shows 3 faces, but a box has 6.</p></div>' +
A.yt({ q: 'A cube has edges of 4 cm. What is its surface area?', type: 'num', answer: 96, unit: 'cm²',
  hint: 'A cube has 6 square faces, all the same.', explain: 'One face: 4 &times; 4 = 16 cm². Six faces: 6 &times; 16 = 96 cm².' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function fillUnits() {
        var b = $('#cvk', root).value, opts = COMMON[b].map(function (p) { return '<option>' + p + b + '</option>'; }).join('');
        $('#cvf', root).innerHTML = opts; $('#cvt', root).innerHTML = opts;
        $('#cvf', root).value = b === 'L' ? 'L' : 'k' + b; $('#cvt', root).value = b === 'L' ? 'mL' : b === 'm' ? 'm' : b;
      }
      $('#cvk', root).addEventListener('change', fillUnits); fillUnits();
      function cv() {
        var v = parseFloat($('#cvv', root).value), f = $('#cvf', root).value, t = $('#cvt', root).value;
        $('#cvfig', root).innerHTML = ladder(f, t);
        if (isNaN(v) || v < 0) { $('#cvout', root).innerHTML = '<p>Type an amount of 0 or more.</p>'; return; }
        v = Math.min(v, 100000);
        var n = uinfo(t).i - uinfo(f).i, k = Math.pow(10, Math.abs(n)), r = conv(v, f, t);
        $('#cvout', root).innerHTML = '<p class="big">' + fmt(cl(v)) + ' ' + f + ' = ' + fmt(r) + ' ' + t + '</p><p>' + (n === 0 ? 'Same unit: nothing changes.' : Math.abs(n) + ' step' + (Math.abs(n) > 1 ? 's' : '') + (n > 0 ? ' down to a smaller unit, so multiply: ' + fmt(cl(v)) + ' &times; ' + fmt(k) : ' up to a bigger unit, so divide: ' + fmt(cl(v)) + ' &divide; ' + fmt(k)) + ' = ' + fmt(r) + '.') + '</p>';
      }
      A.bind(root, ['cvv', 'cvk', 'cvf', 'cvt'], cv);
      function an() {
        var d = +$('#ang', root).value, dir = $('#adir', root).value, other = 360 - d, w = dir === 'cw' ? 'clockwise' : 'counterclockwise', w2 = dir === 'cw' ? 'counterclockwise' : 'clockwise';
        $('#angv', root).innerHTML = d + '&deg;';
        $('#afig', root).innerHTML = angleFig(d, dir, { prot: $('#aprot', root).checked, label: d + '&deg;' });
        $('#aout', root).innerHTML = '<p class="big">' + d + '&deg; ' + w + '</p><p>This is ' + (kind(d) === 'acute' || kind(d) === 'obtuse' ? 'an ' : 'a ') + '<b>' + kind(d) + '</b> angle. Going the other way (' + w2 + ') the same two rays make 360 &minus; ' + d + ' = <b>' + other + '&deg;</b>.</p>';
      }
      A.bind(root, ['ang', 'adir', 'aprot'], an);
      function xl() {
        var a = +$('#xa', root).value, b = 180 - a;
        $('#xav', root).innerHTML = a + '&deg;';
        $('#xfig', root).innerHTML = crossFig(a, [a + '&deg;', b + '&deg;', a + '&deg;', b + '&deg;']);
        $('#xout', root).innerHTML = '<p>Angles next to each other on a line are supplementary: ' + a + ' + ' + b + ' = 180&deg;.</p><p>Opposite angles are equal: both orange angles are ' + a + '&deg; and both blue angles are ' + b + '&deg;.</p><p class="t2">All four add to 360&deg;: ' + a + ' + ' + b + ' + ' + a + ' + ' + b + ' = 360.</p>';
      }
      A.bind(root, ['xa'], xl);
      function tr() {
        var a = +$('#ta', root).value, b = +$('#tb', root).value, note = '';
        if (a + b > 170) { b = 170 - a; note = '<p class="t2">A and B must add to less than 180&deg;, so B was set to ' + b + '&deg;.</p>'; }
        $('#tav', root).innerHTML = a + '&deg;'; $('#tbv', root).innerHTML = b + '&deg;';
        var c = 180 - a - b;
        $('#tfig', root).innerHTML = triFig(a, b, { A: a + '&deg;', B: b + '&deg;', C: c + '&deg;', ext: (180 - b) + '&deg;' });
        $('#tout', root).innerHTML = note + '<p>Third angle C: 180 &minus; ' + a + ' &minus; ' + b + ' = <b>' + c + '&deg;</b>.</p><p>Exterior angle at B (blue): 180 &minus; ' + b + ' = <b>' + (180 - b) + '&deg;</b>. Check: A + C = ' + a + ' + ' + c + ' = ' + (a + c) + '&deg;.</p>';
      }
      A.bind(root, ['ta', 'tb'], tr);
      function ar() {
        var sh = $('#arsh', root).value, x = Math.max(1, Math.min(20, Math.round(+$('#ar1', root).value) || 1)), y = Math.max(1, Math.min(20, Math.round(+$('#ar2', root).value) || 1)), h = Math.max(1, Math.min(20, Math.round(+$('#ar3', root).value) || 1));
        $('#ar1l', root).textContent = sh === 'trap' ? 'Top side (cm)' : 'Diagonal across (cm)';
        $('#ar2l', root).textContent = sh === 'trap' ? 'Bottom side (cm)' : 'Diagonal down (cm)';
        $('#ar3w', root).style.display = sh === 'trap' ? '' : 'none';
        if (sh === 'trap') {
          var t1 = x * h / 2, t2 = y * h / 2;
          $('#arfig', root).innerHTML = trapFig(x, y, h, true);
          $('#arout', root).innerHTML = '<p>Cut along a diagonal. You get two triangles with the same height, ' + h + ' cm.</p><p>Blue: ' + Math.min(x, y) + ' &times; ' + h + ' &divide; 2 = ' + fmt(Math.min(t1, t2)) + '. Orange: ' + Math.max(x, y) + ' &times; ' + h + ' &divide; 2 = ' + fmt(Math.max(t1, t2)) + '.</p><p class="big">Area = (' + x + ' + ' + y + ') &times; ' + h + ' &divide; 2 = ' + fmt(cl(t1 + t2)) + ' cm²</p>';
        } else {
          $('#arfig', root).innerHTML = diagFig(x, y, sh === 'kite', true);
          $('#arout', root).innerHTML = '<p>Draw a rectangle around the diagonals: ' + x + ' &times; ' + y + ' = ' + x * y + ' cm². The ' + (sh === 'kite' ? 'kite' : 'rhombus') + ' fills exactly half of it. Each blue corner matches an orange triangle inside.</p><p class="big">Area = ' + x + ' &times; ' + y + ' &divide; 2 = ' + fmt(cl(x * y / 2)) + ' cm²</p>';
        }
      }
      A.bind(root, ['arsh', 'ar1', 'ar2', 'ar3'], ar);
      function nt() {
        var sh = $('#nsh', root).value, a = Math.max(1, Math.min(12, Math.round(+$('#n1', root).value) || 1)), b = Math.max(1, Math.min(12, Math.round(+$('#n2', root).value) || 1)), c = Math.max(1, Math.min(12, Math.round(+$('#n3', root).value) || 1));
        $('#n1l', root).textContent = sh === 'box' ? 'Length (cm)' : sh === 'pyr' ? 'Base side (cm)' : 'Size (1 to 4)';
        $('#n2l', root).textContent = sh === 'box' ? 'Width (cm)' : sh === 'pyr' ? 'Triangle height (cm)' : 'Length (cm)';
        $('#n3w', root).style.display = sh === 'box' ? '' : 'none';
        var rows, total;
        if (sh === 'box') {
          $('#nfig', root).innerHTML = boxNet(a, b, c, 'area');
          rows = [['top and bottom', a + ' &times; ' + b, a * b, 2], ['front and back', a + ' &times; ' + c, a * c, 2], ['two ends', b + ' &times; ' + c, b * c, 2]];
        } else if (sh === 'pyr') {
          $('#nfig', root).innerHTML = pyrNet(a, b, 'area');
          rows = [['square base', a + ' &times; ' + a, a * a, 1], ['triangles', a + ' &times; ' + b + ' &divide; 2', cl(a * b / 2), 4]];
        } else {
          var k = Math.min(a, 4);
          $('#nfig', root).innerHTML = triNet(k, b, 'area');
          rows = [['triangle ends', 3 * k + ' &times; ' + 4 * k + ' &divide; 2', 6 * k * k, 2], ['rectangle', 3 * k + ' &times; ' + b, 3 * k * b, 1], ['rectangle', 4 * k + ' &times; ' + b, 4 * k * b, 1], ['rectangle', 5 * k + ' &times; ' + b, 5 * k * b, 1]];
        }
        total = cl(rows.reduce(function (s, r) { return s + r[2] * r[3]; }, 0));
        $('#nout', root).innerHTML = '<div class="tbl"><table><thead><tr><th class="l">Faces</th><th>Each</th><th>How many</th><th>Area</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td class="l">' + r[0] + '</td><td>' + r[1] + ' = ' + fmt(r[2]) + '</td><td>' + r[3] + '</td><td>' + fmt(cl(r[2] * r[3])) + '</td></tr>'; }).join('') + '</tbody></table></div><p class="big">Surface area = ' + fmt(total) + ' cm²</p>' + (sh === 'tri' ? '<p class="t2">The triangle has sides ' + 3 * k + ', ' + 4 * k + ' and ' + 5 * k + ' cm, with a right angle between the two short sides.</p>' : '');
      }
      A.bind(root, ['nsh', 'n1', 'n2', 'n3'], nt);
    },

    quiz: [
      { q: 'How many metres are in 2.5 km?', type: 'num', answer: 2500, unit: 'm',
        hint: 'km to m is 3 steps down the ladder.', explain: '1 km = 1000 m, so 2.5 &times; 1000 = 2500 m.' },
      { q: 'This angle is 60&deg; measured counterclockwise. What is it measured clockwise?', type: 'num', answer: 300, unit: '&deg;', fig: angleFig(60, 'ccw', { label: '60&deg;' }),
        hint: 'The two ways around add to 360&deg;.', explain: '360 &minus; 60 = 300&deg;.' },
      { q: 'Two angles are supplementary. One is 115&deg;. What is the other?', type: 'num', answer: 65, unit: '&deg;',
        hint: 'Supplementary angles add to 180&deg;, a straight line.', explain: '180 &minus; 115 = 65&deg;.' },
      { q: 'Find the missing angle in the triangle.', type: 'num', answer: 60, unit: '&deg;', fig: triFig(50, 70, { A: '50&deg;', B: '70&deg;', C: '?' }),
        hint: 'The three angles of a triangle add to 180&deg;.', explain: '180 &minus; 50 &minus; 70 = 60&deg;.' },
      { q: 'What is the area of this trapezoid?', type: 'num', answer: 32, unit: 'cm²', fig: trapFig(6, 10, 4),
        hint: 'Add the two parallel sides, multiply by the height, then divide by 2.', explain: '(6 + 10) &times; 4 &divide; 2 = 16 &times; 4 &divide; 2 = 32 cm².' },
      { q: 'A kite has diagonals of 8 cm and 6 cm. What is its area?', type: 'num', answer: 24, unit: 'cm²', fig: diagFig(8, 6, true),
        hint: 'Diagonal times diagonal, divided by 2.', explain: '8 &times; 6 = 48, and 48 &divide; 2 = 24 cm².' },
      { q: 'What is the surface area of a box 5 cm long, 3 cm wide and 2 cm high?', type: 'num', answer: 62, unit: 'cm²', fig: boxNet(5, 3, 2, 'dims'),
        hint: 'Find the 3 different face areas, double each, then add.', explain: '5 &times; 3 = 15, 5 &times; 2 = 10, 3 &times; 2 = 6. Doubled: 30 + 20 + 12 = 62 cm².' }
    ],

    practice: [
      { id: 'me-convert', name: 'Convert metric units', code: 'E2.1', gen: function (lv) {
        var P1 = [['km', 'm'], ['m', 'cm'], ['cm', 'mm'], ['m', 'mm'], ['kg', 'g'], ['g', 'mg'], ['L', 'mL']], pr = R.pick(P1), terms, to;
        if (lv === 1) { terms = [[R.int(2, 25), pr[0]]]; to = pr[1]; }
        else if (lv === 2) {
          if (R.int(0, 1)) { terms = [[R.int(12, 990), pr[1]]]; to = pr[0]; }
          else { terms = [[cl(R.int(105, 995) / 100), pr[0]]]; to = pr[1]; }
        } else if (R.int(0, 1)) { terms = [[cl(R.int(11, 49) / 10), 'km']]; to = 'cm'; }
        else {
          var f = conv(1, pr[0], pr[1]), sm = f === 1000 ? R.int(1, 9) * 100 + R.pick([0, 50]) : f === 100 ? R.int(5, 95) : R.int(1, 9);
          terms = [[cl(R.int(11, 49) / 10), pr[0]], [sm, pr[1]]]; to = pr[1];
        }
        var res = cl(terms.reduce(function (s, t) { return s + conv(t[0], t[1], to); }, 0)), u = terms[0][1], n = uinfo(to).i - uinfo(u).i, k = Math.pow(10, Math.abs(n)), first = conv(terms[0][0], u, to);
        var q = terms.length === 1 ? 'Convert: <b>' + fmt(terms[0][0]) + ' ' + u + '</b> = ? ' + to : 'Add <b>' + fmt(terms[0][0]) + ' ' + u + ' + ' + fmt(terms[1][0]) + ' ' + terms[1][1] + '</b>. Give the answer in ' + to + '.';
        var steps = [(n > 0 ? '1 ' + u + ' = ' + fmt(k) + ' ' + to : '1 ' + to + ' = ' + fmt(k) + ' ' + u) + '. That is ' + Math.abs(n) + ' step' + (Math.abs(n) > 1 ? 's' : '') + ' on the ladder.',
          (n > 0 ? 'Going to a smaller unit means more of them, so multiply: ' + fmt(terms[0][0]) + ' &times; ' + fmt(k) : 'Going to a bigger unit means fewer of them, so divide: ' + fmt(terms[0][0]) + ' &divide; ' + fmt(k)) + ' = ' + fmt(first) + ' ' + to + '.<div class="fig">' + ladder(u, to) + '</div>'];
        if (terms.length > 1) steps.push('Now add: ' + fmt(first) + ' + ' + fmt(terms[1][0]) + ' = ' + fmt(res) + ' ' + to + '.');
        else steps.push('So ' + fmt(terms[0][0]) + ' ' + u + ' = ' + fmt(res) + ' ' + to + '.');
        return { q: q, type: 'num', answer: res, unit: to, fig: lv === 1 ? ladder(u, to) : '', v: { terms: terms, to: to },
          hint: terms.length > 1 ? 'First change ' + u + ' into ' + to + '. Then add.' : 'Count the steps on the ladder. Each step is &times; 10 or &divide; 10.', steps: steps,
          explain: q.replace(/<\/?b>/g, '').replace('Convert: ', '').replace(/ = \? .*$/, '').replace(/^Add /, '').replace(/\. Give.*$/, '') + ' = ' + fmt(res) + ' ' + to + '.' };
      } },
      { id: 'me-angle', name: 'Angles to 360°', code: 'E2.2', gen: function (lv) {
        if (lv === 1) {
          var ty = R.pick(['acute', 'right', 'obtuse', 'straight', 'reflex']), d = { acute: R.int(2, 17) * 5, right: 90, obtuse: R.int(19, 35) * 5, straight: 180, reflex: R.int(37, 70) * 5 }[ty];
          var o = R.mc(ty, R.shuffle(['acute', 'right', 'obtuse', 'straight', 'reflex'].filter(function (x) { return x !== ty; })));
          return { q: 'What kind of angle is ' + d + '&deg;?', type: 'mc', options: o.options, answer: o.answer, fig: angleFig(d, 'ccw', { label: d + '&deg;' }), v: { deg: d, kind: 'type' },
            hint: 'Compare it with 90&deg; (a square corner) and 180&deg; (a straight line).', steps: ['Is it less than 90&deg;, exactly 90&deg;, between 90&deg; and 180&deg;, exactly 180&deg;, or more than 180&deg;?', d + '&deg; is ' + (d < 90 ? 'less than 90&deg;' : d === 90 ? 'exactly 90&deg;' : d < 180 ? 'between 90&deg; and 180&deg;' : d === 180 ? 'exactly 180&deg;' : 'between 180&deg; and 360&deg;') + '.', 'It is ' + (ty === 'acute' || ty === 'obtuse' ? 'an ' : 'a ') + ty + ' angle.'], explain: d + '&deg; is ' + (ty === 'acute' || ty === 'obtuse' ? 'an ' : 'a ') + ty + ' angle.' };
        }
        var dir = R.pick(['ccw', 'cw']), w = dir === 'cw' ? 'clockwise' : 'counterclockwise';
        if (lv === 2) {
          var g = R.int(1, 35) * 10;
          return { q: 'Read the angle. It is measured <b>' + w + '</b> from the ray pointing right.', type: 'num', answer: g, unit: '&deg;', fig: angleFig(g, dir, { prot: true }), v: { deg: g, kind: 'read' },
            hint: 'Start at 0 on the ray pointing right. The big numbers go up by 30.', steps: ['Find the 0 on the flat ray.', 'Count ' + w + ' to the other ray. Use the nearest labelled number, then count the small ticks (10&deg; each).', 'The angle is ' + g + '&deg;.<div class="fig">' + angleFig(g, dir, { prot: true, label: g + '&deg;' }) + '</div>'], explain: 'The angle is ' + g + '&deg; ' + w + '.' };
        }
        var x = R.int(4, 68) * 5, w2 = dir === 'cw' ? 'counterclockwise' : 'clockwise';
        return { q: 'Ray B is ' + x + '&deg; <b>' + w + '</b> from ray A. How many degrees is it from A to B going <b>' + w2 + '</b>?', type: 'num', answer: 360 - x, unit: '&deg;', fig: '', v: { deg: x, kind: 'other' },
          hint: 'Both ways around add up to a full turn, 360&deg;.', steps: ['A full turn is 360&deg;.', 'One way is ' + x + '&deg;. The other way is the rest of the turn.', '360 &minus; ' + x + ' = ' + (360 - x) + '&deg;.<div class="fig">' + angleFig(x, dir, { label: x + '&deg;' }) + '</div>'], explain: '360 &minus; ' + x + ' = ' + (360 - x) + '&deg;.' };
      } },
      { id: 'me-relate', name: 'Find unknown angles', code: 'E2.3', gen: function (lv) {
        var k = R.pick(lv === 1 ? ['comp', 'supp'] : lv === 2 ? ['opp', 'tri', 'ext'] : ['quad', 'rem', 'tri']), q, ans, fig = '', hint, steps, v;
        if (k === 'comp' || k === 'supp') {
          var tot = k === 'comp' ? 90 : 180, x = k === 'comp' ? R.int(12, 78) : R.int(20, 160); if (x === 90) x = 105;
          ans = tot - x; q = 'Two angles are <b>' + (k === 'comp' ? 'complementary' : 'supplementary') + '</b>. One is ' + x + '&deg;. What is the other?'; fig = splitFig(tot, x, x + '&deg;', '?');
          hint = (k === 'comp' ? 'Complementary' : 'Supplementary') + ' angles add to ' + tot + '&deg;.'; steps = [hint, tot + ' &minus; ' + x + ' = ' + ans + '.', 'The other angle is ' + ans + '&deg;.']; v = { kind: k, x: x };
        } else if (k === 'opp') {
          var a = R.int(25, 155); if (a === 90) a = 75; var adj = R.int(0, 1);
          ans = adj ? 180 - a : a; q = 'Two lines cross. One angle is ' + a + '&deg;. What is the angle marked ?'; fig = crossFig(a, [a + '&deg;', adj ? '?' : '', adj ? '' : '?', '']);
          hint = adj ? 'The two angles sit together on a straight line.' : 'The angle is across from the ' + a + '&deg; angle.';
          steps = adj ? ['The angles are next to each other on a straight line: supplementary.', '180 &minus; ' + a + ' = ' + ans + '.', 'The angle is ' + ans + '&deg;.'] : ['The angles are opposite each other.', 'Opposite angles are equal.', 'The angle is ' + a + '&deg;.']; v = { kind: adj ? 'adj' : 'opp', a: a };
        } else if (k === 'tri') {
          var A1 = R.int(25, 95), B1 = R.int(20, Math.max(20, 155 - A1));
          ans = 180 - A1 - B1; q = 'Two angles of a triangle are ' + A1 + '&deg; and ' + B1 + '&deg;. What is the third angle?'; fig = triFig(A1, B1, { A: A1 + '&deg;', B: B1 + '&deg;', C: '?' });
          hint = 'The angles inside a triangle add to 180&deg;.'; steps = [hint, A1 + ' + ' + B1 + ' = ' + (A1 + B1) + '.', '180 &minus; ' + (A1 + B1) + ' = ' + ans + '&deg;.']; v = { kind: 'tri', a: A1, b: B1 };
        } else if (k === 'ext') {
          var b2 = R.int(30, 130), a2 = R.int(20, 160 - b2);
          ans = 180 - b2; q = 'The interior angle at B is ' + b2 + '&deg;. What is the exterior angle marked ?'; fig = triFig(a2, b2, { B: b2 + '&deg;', ext: '?' });
          hint = 'The interior and exterior angles at B make a straight line.'; steps = ['They are on a straight line, so they add to 180&deg;.', '180 &minus; ' + b2 + ' = ' + ans + '.', 'The exterior angle is ' + ans + '&deg;.']; v = { kind: 'ext', b: b2 };
        } else if (k === 'rem') {
          var a3 = R.int(25, 80), c3 = R.int(25, 80), b3 = 180 - a3 - c3;
          ans = a3 + c3; q = 'Find the exterior angle marked ?'; fig = triFig(a3, b3, { A: a3 + '&deg;', C: c3 + '&deg;', ext: '?' });
          hint = 'First find the angle at B. Or use the shortcut: the exterior angle equals the two far angles added.'; steps = ['Angle B = 180 &minus; ' + a3 + ' &minus; ' + c3 + ' = ' + b3 + '&deg;.', 'Exterior angle = 180 &minus; ' + b3 + ' = ' + ans + '&deg;.', 'Check with the shortcut: ' + a3 + ' + ' + c3 + ' = ' + ans + '.']; v = { kind: 'rem', a: a3, c: c3 };
        } else {
          var qs; do { qs = [R.int(60, 120), R.int(60, 120), R.int(60, 120)]; } while (360 - qs[0] - qs[1] - qs[2] < 40 || 360 - qs[0] - qs[1] - qs[2] > 170);
          ans = 360 - qs[0] - qs[1] - qs[2]; q = 'A quadrilateral has angles of ' + qs.join('&deg;, ').replace(/, (\d+)$/, ' and $1') + '&deg;. What is the fourth angle?';
          hint = 'A quadrilateral can be cut into 2 triangles, so its angles add to 2 &times; 180 = 360&deg;.'; steps = ['The angles of a quadrilateral add to 360&deg;.', qs.join(' + ') + ' = ' + (360 - ans) + '.', '360 &minus; ' + (360 - ans) + ' = ' + ans + '&deg;.']; v = { kind: 'quad', qs: qs };
        }
        return { q: q, type: 'num', answer: ans, unit: '&deg;', fig: fig, v: v, hint: hint, steps: steps, explain: 'The angle is ' + ans + '&deg;.' };
      } },
      { id: 'me-area', name: 'Area of polygons', code: 'E2.4', gen: function (lv) {
        var k = lv === 1 ? R.pick(['rh', 'kite']) : lv === 2 ? R.pick(['trap', 'trap', 'kite']) : R.pick(['L', 'house']), v, ans, q, fig, steps, hint;
        if (k === 'rh' || k === 'kite') {
          var d1 = R.int(3, 14), d2 = R.int(2, 12); if (d1 * d2 % 2) d1++;
          ans = d1 * d2 / 2; q = 'A ' + (k === 'kite' ? 'kite' : 'rhombus') + ' has diagonals of ' + d1 + ' cm and ' + d2 + ' cm. What is its area?'; fig = diagFig(d1, d2, k === 'kite');
          hint = 'Diagonal times diagonal, then divide by 2.'; steps = ['The shape fills half of a ' + d1 + ' by ' + d2 + ' rectangle.<div class="fig">' + diagFig(d1, d2, k === 'kite', true) + '</div>', d1 + ' &times; ' + d2 + ' = ' + d1 * d2 + '.', d1 * d2 + ' &divide; 2 = ' + ans + ' cm².']; v = { k: k, d1: d1, d2: d2 };
        } else if (k === 'trap') {
          var a = R.int(2, 10), b = a + R.int(2, 8), h = R.int(2, 10); if ((a + b) * h % 2) h++;
          ans = (a + b) * h / 2; q = 'What is the area of this trapezoid?'; fig = trapFig(a, b, h);
          hint = 'Add the two parallel sides, multiply by the height, then divide by 2.'; steps = ['Cut it into two triangles along a diagonal.<div class="fig">' + trapFig(a, b, h, true) + '</div>', a + ' &times; ' + h + ' &divide; 2 = ' + cl(a * h / 2) + ' and ' + b + ' &times; ' + h + ' &divide; 2 = ' + cl(b * h / 2) + '.', 'Add: ' + cl(a * h / 2) + ' + ' + cl(b * h / 2) + ' = ' + ans + ' cm². Same as (' + a + ' + ' + b + ') &times; ' + h + ' &divide; 2.']; v = { k: k, a: a, b: b, h: h };
        } else if (k === 'L') {
          var W = R.int(6, 14), H = R.int(5, 12), cw = R.int(2, W - 3), ch = R.int(2, H - 2);
          ans = W * H - cw * ch; q = 'What is the area of this L shape?'; fig = lFig(W, H, cw, ch);
          hint = 'Find the area of the big rectangle, then take away the missing corner.'; steps = ['Big rectangle: ' + W + ' &times; ' + H + ' = ' + W * H + '.', 'Missing corner: ' + cw + ' &times; ' + ch + ' = ' + cw * ch + '.', W * H + ' &minus; ' + cw * ch + ' = ' + ans + ' cm².']; v = { k: k, W: W, H: H, cw: cw, ch: ch };
        } else {
          var w = R.int(2, 6) * 2, hh = R.int(3, 9), t = R.int(2, 6);
          ans = w * hh + w * t / 2; q = 'What is the area of this shape?'; fig = houseFig(w, hh, t);
          hint = 'Split it into a rectangle and a triangle.'; steps = ['Rectangle: ' + w + ' &times; ' + hh + ' = ' + w * hh + '.', 'Triangle: ' + w + ' &times; ' + t + ' &divide; 2 = ' + w * t / 2 + '.', 'Add: ' + w * hh + ' + ' + w * t / 2 + ' = ' + ans + ' cm².']; v = { k: k, w: w, h: hh, t: t };
        }
        return { q: q, type: 'num', answer: ans, unit: 'cm²', fig: fig, v: v, hint: hint, steps: steps, explain: 'The area is ' + fmt(ans) + ' cm².' };
      } },
      { id: 'me-faces', name: 'Faces and nets', code: 'E2.5', gen: function (lv) {
        var s = R.pick(SOL), n = nfaces(s), d = fdesc(s), net = s[0] === 'cube' ? boxNet(3, 3, 3) : s[0] === 'square-based pyramid' ? pyrNet(4, 4) : s[0] === 'triangular prism' ? triNet(1, 5) : '';
        var why = s[1] === 'prism' ? 'A prism has 2 matching bases (' + BASE[s[2]] + 's) joined by one rectangle for each side of the base: ' + s[2] + ' rectangles.' : 'A pyramid has 1 base (a ' + BASE[s[2]] + ') and one triangle for each side of the base: ' + s[2] + ' triangles.';
        if (s[0] === 'cube') why = 'A cube is a prism with square bases, and all its faces are squares.';
        var steps = [why, 'So the net has ' + d + '.' + (net ? '<div class="fig">' + net + '</div>' : ''), 'Total: ' + n + ' faces.'];
        if (lv === 1) return { q: 'How many faces does a <b>' + s[0] + '</b> have?', type: 'num', answer: n, v: { s: s[0] }, hint: s[1] === 'prism' ? 'Count the 2 bases, then one face for each side of the base.' : 'Count the 1 base, then one triangle for each side of the base.', steps: steps, explain: 'A ' + s[0] + ' has ' + n + ' faces: ' + d + '.' };
        if (lv === 2) {
          var o = R.mc(d, R.shuffle(SOL.filter(function (x) { return x !== s; }).map(fdesc)));
          return { q: 'Which faces make the net of a <b>' + s[0] + '</b>?', type: 'mc', options: o.options, answer: o.answer, v: { s: s[0] }, hint: 'Is it a prism (2 bases) or a pyramid (1 base)? What shape is the base?', steps: steps, explain: 'A ' + s[0] + ': ' + d + '.' };
        }
        var o2 = R.mc(s[0], R.shuffle(SOL.filter(function (x) { return x !== s; }).map(function (x) { return x[0]; })));
        return { q: 'A net has <b>' + d + '</b>. What solid does it fold into?', type: 'mc', options: o2.options, answer: o2.answer, v: { s: s[0], d: d }, hint: 'Rectangles around the side mean a prism. Triangles meeting at a point mean a pyramid.', steps: steps, explain: d + ' fold into a ' + s[0] + '.' };
      } },
      { id: 'me-sa', name: 'Surface area', code: 'E2.6', gen: function (lv) {
        var k = lv === 1 ? R.pick(['cube', 'box']) : lv === 2 ? R.pick(['box', 'pyr']) : R.pick(['tri', 'open']), v, ans, q, fig, steps;
        if (k === 'cube') {
          var e = R.int(2, 12); ans = 6 * e * e; q = 'A cube has edges of ' + e + ' cm. What is its surface area?'; fig = boxNet(e, e, e, 'dims');
          steps = ['One face: ' + e + ' &times; ' + e + ' = ' + e * e + ' cm².', 'A cube has 6 faces the same.', '6 &times; ' + e * e + ' = ' + fmt(ans) + ' cm².']; v = { k: k, e: e };
        } else if (k === 'box' || k === 'open') {
          var l = R.int(3, 12), w = R.int(2, 9), h = R.int(2, 9), A1 = l * w, A2 = l * h, A3 = w * h;
          ans = k === 'box' ? 2 * (A1 + A2 + A3) : A1 + 2 * A2 + 2 * A3;
          q = (k === 'open' ? 'An <b>open box</b> (no lid) is ' : 'A box is ') + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm high. What is its ' + (k === 'open' ? 'outside ' : '') + 'surface area?'; fig = boxNet(l, w, h, 'dims');
          steps = ['Face areas: ' + l + ' &times; ' + w + ' = ' + A1 + ', ' + l + ' &times; ' + h + ' = ' + A2 + ', ' + w + ' &times; ' + h + ' = ' + A3 + '.', k === 'box' ? 'Each comes twice: 2 &times; ' + A1 + ' + 2 &times; ' + A2 + ' + 2 &times; ' + A3 + '.' : 'No lid, so the ' + A1 + ' face counts only once: ' + A1 + ' + 2 &times; ' + A2 + ' + 2 &times; ' + A3 + '.', 'Total: ' + fmt(ans) + ' cm².<div class="fig">' + boxNet(l, w, h, 'area') + '</div>']; v = { k: k, l: l, w: w, h: h };
        } else if (k === 'pyr') {
          var b = R.int(2, 10), t = R.int(3, 12); if (b * t % 2) t++;
          ans = b * b + 2 * b * t; q = 'A square-based pyramid has a base ' + b + ' cm by ' + b + ' cm. Each triangle has a height of ' + t + ' cm. What is its surface area?'; fig = pyrNet(b, t, 'dims');
          steps = ['Base: ' + b + ' &times; ' + b + ' = ' + b * b + ' cm².', 'One triangle: ' + b + ' &times; ' + t + ' &divide; 2 = ' + b * t / 2 + ' cm². Four triangles: ' + 2 * b * t + ' cm².', 'Total: ' + b * b + ' + ' + 2 * b * t + ' = ' + fmt(ans) + ' cm².<div class="fig">' + pyrNet(b, t, 'area') + '</div>']; v = { k: k, b: b, t: t };
        } else {
          var m = R.int(1, 3), L = R.int(3, 12), a = 3 * m, bb = 4 * m, c = 5 * m;
          ans = a * bb + (a + bb + c) * L; q = 'A triangular prism is ' + L + ' cm long. Its triangle ends have sides ' + a + ', ' + bb + ' and ' + c + ' cm, with a right angle between the ' + a + ' cm and ' + bb + ' cm sides. What is its surface area?'; fig = triNet(m, L, 'dims');
          steps = ['Two triangles: 2 &times; (' + a + ' &times; ' + bb + ' &divide; 2) = ' + a * bb + ' cm².', 'Three rectangles: ' + a + ' &times; ' + L + ' + ' + bb + ' &times; ' + L + ' + ' + c + ' &times; ' + L + ' = ' + (a + bb + c) * L + ' cm².', 'Total: ' + a * bb + ' + ' + (a + bb + c) * L + ' = ' + fmt(ans) + ' cm².<div class="fig">' + triNet(m, L, 'area') + '</div>']; v = { k: k, a: a, b: bb, c: c, L: L };
        }
        return { q: q, type: 'num', answer: ans, unit: 'cm²', fig: fig, v: v, hint: 'Find the area of each face in the net, then add them all.', steps: steps, explain: 'The surface area is ' + fmt(ans) + ' cm².' };
      } }
    ]
  });
  /* ---------- practice shapes: more ways to ask each skill (docs/QUESTIONS.md). Answer checks: tests/verify/grade6.js ---------- */
  (function () {
    var KIT = A.Q, why = G6.why, nm = KIT.name;
    var PAIRS = [['km', 'm'], ['m', 'cm'], ['cm', 'mm'], ['m', 'mm'], ['kg', 'g'], ['g', 'mg'], ['L', 'mL']];
    var KINDS = [['acute', 40], ['right', 90], ['obtuse', 130], ['straight', 180], ['reflex', 250]];
    function deg(d) { return d + '&deg;'; }
    function faces(name) { var s = SOL.filter(function (x) { return x[0] === name; })[0]; return nfaces(s); }
    var SHAPES = {
      'me-convert': [
        [1, 'line', function () {
          var cm = R.int(5, 45) * 10;
          return { q: 'A board is <b>' + fmt(cm) + ' cm</b> long. Place its length in metres on the line.', type: 'line', min: 0, max: 5, tick: 0.1, every: 1, snap: 0.1, answer: cl(cm / 100), fig: ladder('cm', 'm'),
            hint: '100 cm make 1 m.', steps: [fmt(cm) + ' &divide; 100 = ' + fmt(cl(cm / 100)) + '.'], explain: fmt(cm) + ' cm = ' + fmt(cl(cm / 100)) + ' m.', meta: { k: 'g6-conv-line', cm: cm } };
        }],
        [1, 'mistake', function () {
          var pr = R.pick(PAIRS), v = R.int(2, 25), f = conv(1, pr[0], pr[1]), who = nm(), truth = !R.int(0, 2), said = truth ? v * f : v * (f === 10 ? 100 : f / 10);
          return { q: who + ' says <b>' + v + ' ' + pr[0] + ' = ' + fmt(said) + ' ' + pr[1] + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: ladder(pr[0], pr[1]),
            why: why('1 ' + pr[0] + ' = ' + fmt(f) + ' ' + pr[1] + ', so ' + v + ' ' + pr[0] + ' = ' + fmt(v * f) + ' ' + pr[1] + '.', ['Every metric change is &times; 100.', 'Going to a smaller unit means divide.']),
            hint: 'How many ' + pr[1] + ' make 1 ' + pr[0] + '?', steps: [v + ' &times; ' + fmt(f) + ' = ' + fmt(v * f) + '.'], explain: v + ' ' + pr[0] + ' = ' + fmt(v * f) + ' ' + pr[1] + '.', meta: { k: 'g6-conv-tf', v: v, from: pr[0], to: pr[1], said: said } };
        }],
        [1, 'match', function () {
          var prs = R.shuffle(PAIRS.filter(function (p) { return conv(1, p[0], p[1]) !== 100; })).slice(0, 3), vs = R.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
          return { q: 'Match the equal amounts.', type: 'match', pairs: prs.map(function (p, j) { return [vs[j] + ' ' + p[0], fmt(vs[j] * conv(1, p[0], p[1])) + ' ' + p[1]]; }),
            hint: 'kilo means 1000. milli means one thousandth.', steps: prs.map(function (p, j) { return vs[j] + ' ' + p[0] + ' = ' + fmt(vs[j] * conv(1, p[0], p[1])) + ' ' + p[1] + '.'; }), explain: 'Multiply by 10 or 1000 to go to the smaller unit.', meta: { k: 'g6-conv-match' } };
        }],
        [2, 'order', function () {
          var m = R.shuffle([1200, 1500, 1800, 2100, 2400, 900, 600]).slice(0, 3).sort(function (x, y) { return x - y; }), us = R.shuffle(['m', 'cm', 'mm']);
          var items = m.map(function (mm, j) { return fmt(conv(mm, 'mm', us[j])) + ' ' + us[j]; });
          return { q: 'Put these lengths in order from <b>shortest</b> to longest.', type: 'order', items: items, first: 'shortest', last: 'longest',
            hint: 'Change them all to the same unit first.', steps: m.map(function (mm, j) { return items[j] + ' = ' + fmt(mm / 10) + ' cm.'; }), explain: items.join(', ') + '.', meta: { k: 'g6-conv-order' } };
        }]
      ],
      'me-angle': [
        [1, 'tap', function () {
          var want = R.pick(KINDS), list = R.shuffle([want].concat(R.shuffle(KINDS.filter(function (k) { return k !== want; })).slice(0, 2)));
          var ds = list.map(function (k) { return k[0] === 'acute' ? R.int(3, 16) * 5 : k[0] === 'obtuse' ? R.int(20, 34) * 5 : k[0] === 'reflex' ? R.int(38, 68) * 5 : k[1]; });
          return { q: 'Tap the <b>' + want[0] + '</b> angle.', type: 'tap', tiles: ds.map(function (d) { return angleFig(d, 'ccw', {}); }), answer: list.indexOf(want), answerText: 'the ' + want[0] + ' angle',
            hint: 'Compare each angle with a square corner (90&deg;) and a straight line (180&deg;).', steps: ['The ' + want[0] + ' angle is ' + deg(ds[list.indexOf(want)]) + '.'], explain: 'It is ' + deg(ds[list.indexOf(want)]) + '.', meta: { k: 'g6-ang-tap', want: want[0], ds: ds } };
        }],
        [1, 'mistake', function () {
          var d = R.pick([R.int(2, 17) * 5, R.int(19, 35) * 5, R.int(37, 70) * 5]), right = kind(d), who = nm(), truth = !R.int(0, 2);
          var said = truth ? right : R.pick(['acute', 'obtuse', 'reflex'].filter(function (x) { return x !== right; }));
          return { q: who + ' says a <b>' + deg(d) + '</b> angle is <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: angleFig(d, 'ccw', { label: deg(d) }),
            why: why(deg(d) + ' is ' + (d < 90 ? 'less than 90&deg;' : d < 180 ? 'between 90&deg; and 180&deg;' : 'between 180&deg; and 360&deg;') + ', so it is ' + right + '.', ['Any angle more than 90&deg; is reflex.', 'Obtuse angles are smaller than acute ones.']),
            hint: 'Compare with 90&deg; and 180&deg;.', steps: [deg(d) + ' is ' + right + '.'], explain: 'It is ' + right + '.', meta: { k: 'g6-ang-tf', d: d, said: said } };
        }],
        [1, 'line', function () {
          var x = R.int(2, 16) * 10;
          return { q: 'Ray B is ' + deg(x) + ' counterclockwise from ray A. Place the angle from A to B going <b>clockwise</b>.', type: 'line', min: 0, max: 360, tick: 10, every: 90, snap: 10, answer: 360 - x, fig: angleFig(x, 'ccw', { label: deg(x) }),
            hint: 'Both ways around make a full turn.', steps: ['360 &minus; ' + x + ' = ' + (360 - x) + '.'], explain: deg(360 - x) + '.', meta: { k: 'g6-ang-line', x: x } };
        }]
      ],
      'me-relate': [
        [1, 'fill', function () {
          var a = R.int(25, 95), b = R.int(20, 155 - a);
          return { q: 'Two angles of a triangle are ' + deg(a) + ' and ' + deg(b) + '. Find the third.', type: 'fill', fill: a + ' + ' + b + ' = [[]]&deg; &nbsp; Third angle: [[]]&deg;', answers: [a + b, 180 - a - b], fig: triFig(a, b, { A: deg(a), B: deg(b), C: '?' }),
            hint: 'The angles of a triangle add to 180&deg;.', steps: [a + ' + ' + b + ' = ' + (a + b) + '.', '180 &minus; ' + (a + b) + ' = ' + (180 - a - b) + '.'], explain: deg(180 - a - b) + '.', meta: { k: 'g6-rel-fill', a: a, b: b } };
        }],
        [1, 'mistake', function () {
          var x = R.int(15, 75), who = nm(), truth = !R.int(0, 2), said = truth ? 180 - x : 90 - x;
          return { q: 'One angle is ' + deg(x) + '. ' + who + ' says its <b>supplement</b> is <b>' + deg(said) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: splitFig(180, x, deg(x), '?'),
            why: why('Supplementary angles add to 180&deg;: 180 &minus; ' + x + ' = ' + (180 - x) + '.', ['Supplementary angles add to 90&deg;.', 'The supplement is the same size.']),
            hint: 'Supplementary angles make a straight line.', steps: ['180 &minus; ' + x + ' = ' + (180 - x) + '.'], explain: deg(180 - x) + '.', meta: { k: 'g6-rel-tf', x: x, said: said } };
        }],
        [1, 'match', function () {
          var x = R.int(10, 80);
          return { q: 'An angle is ' + deg(x) + '. Match each angle to its size.', type: 'match', pairs: [['Its complement', deg(90 - x)], ['Its supplement', deg(180 - x)], ['The rest of a full turn', deg(360 - x)]],
            hint: 'Complement: 90&deg;. Supplement: 180&deg;. Full turn: 360&deg;.', steps: ['90 &minus; ' + x + ' = ' + (90 - x) + '.', '180 &minus; ' + x + ' = ' + (180 - x) + '.', '360 &minus; ' + x + ' = ' + (360 - x) + '.'], explain: 'Subtract from 90, 180 and 360.', meta: { k: 'g6-rel-match', x: x } };
        }]
      ],
      'me-area': [
        [1, 'fill', function () {
          var a = R.int(2, 10), b = a + R.int(2, 8), h = R.int(2, 10); if ((a + b) * h % 2) h++;
          return { q: 'Find the area of this trapezoid.', type: 'fill', fill: a + ' + ' + b + ' = [[]] &nbsp; Times ' + h + ': [[]] &nbsp; Half of that: [[]] cm²', answers: [a + b, (a + b) * h, (a + b) * h / 2], fig: trapFig(a, b, h),
            hint: 'Add the parallel sides, times the height, then halve.', steps: [a + ' + ' + b + ' = ' + (a + b) + '.', (a + b) + ' &times; ' + h + ' = ' + (a + b) * h + '.', (a + b) * h + ' &divide; 2 = ' + (a + b) * h / 2 + '.'], explain: (a + b) * h / 2 + ' cm².', meta: { k: 'g6-area-fill', a: a, b: b, h: h } };
        }],
        [1, 'mistake', function () {
          var d1 = R.int(3, 14), d2 = R.int(2, 12), who = nm(), truth = !R.int(0, 2); if (d1 * d2 % 2) d1++;
          var said = truth ? d1 * d2 / 2 : d1 * d2;
          return { q: 'A kite has diagonals of ' + d1 + ' cm and ' + d2 + ' cm. ' + who + ' says its area is <b>' + said + ' cm²</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: diagFig(d1, d2, true, true),
            why: why('The kite fills half of the ' + d1 + ' by ' + d2 + ' rectangle: ' + d1 * d2 + ' &divide; 2 = ' + d1 * d2 / 2 + ' cm².', ['Multiply the diagonals. That is the area.', 'Add the diagonals.']),
            hint: 'Does the kite fill the whole rectangle around it?', steps: [d1 + ' &times; ' + d2 + ' &divide; 2 = ' + d1 * d2 / 2 + '.'], explain: d1 * d2 / 2 + ' cm².', meta: { k: 'g6-area-tf', d1: d1, d2: d2, said: said } };
        }],
        [1, 'story', function () {
          var d1 = R.int(4, 16), d2 = R.int(3, 12); if (d1 * d2 % 2) d1++;
          return { q: 'A flower bed is shaped like a rhombus. Its diagonals are ' + d1 + ' m and ' + d2 + ' m. How many square metres of soil does it cover?', type: 'num', unit: 'm²', answer: d1 * d2 / 2, fig: diagFig(d1, d2, false),
            hint: 'Diagonal times diagonal, then divide by 2.', steps: [d1 + ' &times; ' + d2 + ' = ' + d1 * d2 + '.', d1 * d2 + ' &divide; 2 = ' + d1 * d2 / 2 + '.'], explain: d1 * d2 / 2 + ' m².', meta: { k: 'g6-area-story', d1: d1, d2: d2 } };
        }]
      ],
      'me-faces': [
        [1, 'match', function () {
          var by = {}; SOL.forEach(function (s) { (by[nfaces(s)] = by[nfaces(s)] || []).push(s[0]); });
          var ns = R.shuffle(Object.keys(by)).slice(0, 3), names = ns.map(function (n) { return R.pick(by[n]); });
          return { q: 'Match each solid to its number of faces.', type: 'match', pairs: names.map(function (n) { return [n.charAt(0).toUpperCase() + n.slice(1), faces(n) + ' faces']; }),
            hint: 'Prism: 2 bases + one face per side. Pyramid: 1 base + one triangle per side.', steps: names.map(function (n) { return 'A ' + n + ' has ' + faces(n) + '.'; }), explain: 'Count the bases, then the sides.', meta: { k: 'g6-faces-match' } };
        }],
        [1, 'mistake', function () {
          var s = R.pick(SOL), n = nfaces(s), who = nm(), truth = !R.int(0, 2), said = truth ? n : s[1] === 'prism' ? s[2] + 1 : s[2] + 2;
          if (s[0] === 'cube' && !truth) said = 8;
          return { q: who + ' says a <b>' + s[0] + '</b> has <b>' + said + '</b> faces. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('A ' + s[0] + ' has ' + fdesc(s) + ': ' + n + ' faces.', ['Prisms have 1 base and pyramids have 2.', 'Every solid has 6 faces.']),
            hint: s[1] === 'prism' ? 'A prism has 2 bases.' : 'A pyramid has 1 base.', steps: [fdesc(s) + '.'], explain: n + ' faces.', meta: { k: 'g6-faces-tf', s: s[0], said: said } };
        }],
        [2, 'pick', function () {
          var n = R.pick([5, 6, 7]), names = SOL.map(function (s) { return s[0]; });
          return { q: 'Pick every solid with exactly <b>' + n + ' faces</b>.', type: 'pick', options: names, answer: names.map(function (x, j) { return faces(x) === n ? j : -1; }).filter(function (j) { return j >= 0; }),
            hint: 'Count bases and side faces for each one.', steps: ['With ' + n + ' faces: ' + names.filter(function (x) { return faces(x) === n; }).join(' and ') + '.'], explain: 'A prism and a pyramid can have the same number of faces.', meta: { k: 'g6-faces-pick', n: n } };
        }]
      ],
      'me-sa': [
        [1, 'fill', function () {
          var l = R.int(3, 12), w = R.int(2, 9), h = R.int(2, 9);
          return { q: 'A box is ' + l + ' cm by ' + w + ' cm by ' + h + ' cm. Find the area of each kind of face, then the surface area.', type: 'fill', fill: 'Top: [[]] &nbsp; Front: [[]] &nbsp; Side: [[]] &nbsp; Total: [[]] cm²', answers: [l * w, l * h, w * h, 2 * (l * w + l * h + w * h)], fig: boxNet(l, w, h, 'dims'),
            hint: 'Each kind of face comes twice.', steps: [l + ' &times; ' + w + ' = ' + l * w + ', ' + l + ' &times; ' + h + ' = ' + l * h + ', ' + w + ' &times; ' + h + ' = ' + w * h + '.', '2 &times; (' + l * w + ' + ' + l * h + ' + ' + w * h + ') = ' + 2 * (l * w + l * h + w * h) + '.'], explain: fmt(2 * (l * w + l * h + w * h)) + ' cm².', meta: { k: 'g6-sa-fill', l: l, w: w, h: h } };
        }],
        [1, 'mistake', function () {
          var e = R.int(2, 9), who = nm(), truth = !R.int(0, 2), said = truth ? 6 * e * e : e * e * e;
          if (said === 6 * e * e && !truth) said = 4 * e * e;
          return { q: 'A cube has edges of ' + e + ' cm. ' + who + ' says its surface area is <b>' + fmt(said) + ' cm²</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: boxNet(e, e, e, 'dims'),
            why: why('A cube has 6 square faces of ' + e * e + ' cm² each: 6 &times; ' + e * e + ' = ' + 6 * e * e + ' cm².', ['Multiply the three edges together.', 'A cube has 4 faces.']),
            hint: 'How many faces does a cube have?', steps: ['6 &times; ' + e + ' &times; ' + e + ' = ' + 6 * e * e + '.'], explain: fmt(6 * e * e) + ' cm².', meta: { k: 'g6-sa-tf', e: e, said: said } };
        }],
        [1, 'story', function () {
          var l = R.int(10, 30), w = R.int(5, 20), h = R.int(3, 12), sa = 2 * (l * w + l * h + w * h);
          return { q: 'You wrap a gift box that is ' + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm high. With no overlap, how much paper covers it?', type: 'num', unit: 'cm²', answer: sa,
            hint: 'Find the surface area of the box.', steps: [l + ' &times; ' + w + ' = ' + l * w + ', ' + l + ' &times; ' + h + ' = ' + l * h + ', ' + w + ' &times; ' + h + ' = ' + w * h + '.', '2 &times; (' + l * w + ' + ' + l * h + ' + ' + w * h + ') = ' + fmt(sa) + '.'], explain: fmt(sa) + ' cm².', meta: { k: 'g6-sa-story', l: l, w: w, h: h } };
        }]
      ]
    };
    Atlas.Q.shapes(CH, SHAPES);
  })();
})();
