/* Math Atlas worksheets: the pictures every chapter after Multiplying and Dividing needs (Grades 1 to 3 and up).
   Loaded after sheets.js; each adds itself to Atlas.sheets.pics and is used in a question as pic: ['<name>', options].
   A picture draws from (x, y) within width w and returns { svg, h, w, used }; used is how many answers its own write-on
   lines took from the question's answers (they are taken first, in order). Pictures are plain line drawings in ink with one
   light shade, so the paper stays white. The answer checks read the same options (tests/verify/sheets.js).

     blocks    { h, t, o, small }                     base ten blocks: flats, rods and cubes
     tenframe  { a, b }                               two ten frames with a and b counters
     col       { a, b, op: '+' | '−' }                a sum in columns; every digit of the answer is a line to write on
     frac      { n, k, shape: 'bar' | 'circle', uneven: [cuts from 0 to 1] }   a whole cut in n parts, k shaded
     wholes    { n }                                  n whole things in a row (pancakes, pizzas)
     pat       { seq: 'csts..', blanks, next, core }  a row of shapes (c s t d, C shaded, > < ^ v arrows), blanks to fill
     clock     { h, m, blank }                        a clock face; blank: no hands (the key draws them)
     coins     { list: [cents, ...] }                 Canadian coins and bills as outlines
     tag       { t, p }                               a price tag: a label and cents
     bar       { cats, vals, max, step }              a bar graph (a val of null leaves that bar to draw)
     tally     { cats, vals, head, blank }            a tally table; blank: the counts are lines to write on
     solids    { list: ['cube', 'prism', 'pyramid', 'cylinder', 'cone', 'sphere', 'tri'], letters }
     area      { cols, rows, cells: ['c,r', ...] | rect: [c, r] }   squares on a grid, some shaded
     rect      { a, b, unit, all }                    a rectangle with its side lengths (not to scale)
     ruler     { len, from, max }                     a cm ruler with a ribbon of len cm above it
     balance   { l, r, tilt: -1 | 0 | 1 }             a pan balance with cubes (numbers) or words on each side
     cups      { n }                                  n cups in a row
     nl        { min, max, tick, lab, pt, ptl, ask: [values], jumps: [[from, to, 'label']] }   a number line; ask: lines under those ticks
     map       { cols, rows, marks: [[c, r, 'label']], start: [c, r, '>'], path: [[c, r], ...] }   a grid map; the key draws the path
     venn      { a, b }                               a two-circle Venn diagram
     row       { list: [pic, pic], labels, gap }      pictures side by side */
(function () {
  'use strict';
  var S = window.Atlas && Atlas.sheets;
  if (!S || !S.pics) return;
  var P = S.pics, D = S.draw, T = D.T, INK = D.INK, INK2 = D.INK2, LINE = D.LINE, KEY = D.KEY, SHADE = '#e3e8f0';
  function r(x, y, w, h, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (o.rx ? ' rx="' + o.rx + '"' : '') + ' fill="' + (o.f || '#fff') + '" stroke="' + (o.s || INK) + '" stroke-width="' + (o.sw || 1.2) + '"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + '/>'; }
  function ln(a, b, c, d, o) { o = o || {}; return '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="' + (o.s || INK) + '" stroke-width="' + (o.sw || 1.2) + '"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + ' stroke-linecap="round"/>'; }
  function circ(cx, cy, rr, o) { o = o || {}; return '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="' + (o.f || '#fff') + '" stroke="' + (o.s || INK) + '" stroke-width="' + (o.sw || 1.2) + '"/>'; }
  function path(d, o) { o = o || {}; return '<path d="' + d + '" fill="' + (o.f || 'none') + '" stroke="' + (o.s || INK) + '" stroke-width="' + (o.sw || 1.2) + '" stroke-linejoin="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + '/>'; }
  /* a short line to write on, centred on cx, with the key's answer above it */
  function blank(cx, y, w, key, a, size) {
    return '<line class="blank" x1="' + (cx - w / 2) + '" y1="' + y + '" x2="' + (cx + w / 2) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="1.3"/>' +
      (key && a != null ? T(cx, y - 4, a, { s: size || 15, w: 700, f: KEY, a: 'middle' }) : '');
  }
  S.draw.blank = blank;

  P.blocks = function (p, x, y) {
    var out = '', cx = x, s = p.small ? 30 : 40, u = s / 10, k;
    for (var i = 0; i < p.h; i++) { out += r(cx, y, s, s, { s: INK2 }); for (k = 1; k < 10; k++) out += ln(cx + k * u, y, cx + k * u, y + s, { s: LINE, sw: 0.6 }) + ln(cx, y + k * u, cx + s, y + k * u, { s: LINE, sw: 0.6 }); cx += s + 6; }
    if (p.h) cx += 4;
    for (var j = 0; j < p.t; j++) { out += r(cx, y, u + 2, s, { s: INK2 }); for (k = 1; k < 10; k++) out += ln(cx, y + k * u, cx + u + 2, y + k * u, { s: LINE, sw: 0.6 }); cx += u + 6; }
    if (p.t) cx += 4;
    for (var q = 0; q < p.o; q++) out += r(cx + (q % 3) * (u + 4), y + s - (Math.floor(q / 3) + 1) * (u + 4) + 4, u + 1, u + 1, { s: INK2 });
    cx += Math.min(p.o, 3) * (u + 4);
    return { svg: out, h: s, w: cx - x };
  };
  P.tenframe = function (p, x, y) {
    var out = '', c = 15;
    [p.a, p.b].forEach(function (n, f) {
      var fx = x + f * (5 * c + 12);
      for (var i = 0; i < 10; i++) {
        var cx = fx + (i % 5) * c, cy = y + Math.floor(i / 5) * c;
        out += r(cx, cy, c, c, { s: INK2, sw: 1 });
        if (i < n) out += circ(cx + c / 2, cy + c / 2, 5, f ? { f: '#fff', s: INK } : { f: INK, s: INK });
      }
    });
    return { svg: out, h: 2 * c, w: 10 * c + 12 };
  };
  P.col = function (p, x, y, w, key, th, ans) {
    var out = '', d = 24, res = p.op === '+' ? p.a + p.b : p.a - p.b, digits = Math.max(String(p.a).length, String(p.b).length, String(res).length), wx = x + 22, used = 0;
    var row = function (n, ry) { String(n).split('').reverse().forEach(function (ch, i) { out += T(wx + (digits - 1 - i) * d + d / 2, ry, ch, { s: 19, w: 700, a: 'middle' }); }); };
    row(p.a, y + 20); row(p.b, y + 46); out += T(wx - 12, y + 46, p.op, { s: 19, w: 700, a: 'middle' });
    out += ln(wx - 20, y + 55, wx + digits * d, y + 55, { sw: 1.5 });
    var n = String(res).length;
    for (var i = 0; i < n; i++) { out += blank(wx + (digits - n + i) * d + d / 2, y + 84, d - 6, key, ans && ans[used], 19); used++; }
    return { svg: out, h: 88, w: digits * d + 22, used: used };
  };
  P.frac = function (p, x, y, w) {
    var out = '', n = p.n;
    if (p.shape === 'circle') {
      var R = p.R || 30, cx = x + R + 2, cy = y + R + 2;
      if (n === 1) return { svg: circ(cx, cy, R, { f: p.k ? SHADE : '#fff' }), h: 2 * R + 4, w: 2 * R + 4 };
      for (var i = 0; i < n; i++) {
        var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
        out += path('M' + cx + ' ' + cy + ' L' + (cx + R * Math.cos(a0)).toFixed(1) + ' ' + (cy + R * Math.sin(a0)).toFixed(1) + ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R * Math.cos(a1)).toFixed(1) + ' ' + (cy + R * Math.sin(a1)).toFixed(1) + ' Z', { f: i < (p.k || 0) ? SHADE : '#fff' });
      }
      return { svg: out, h: 2 * R + 4, w: 2 * R + 4 };
    }
    var bw = Math.min(w - 4, p.bw || 180), bh = p.bh || 30, cuts = [];
    if (p.uneven) cuts = p.uneven; else for (var j = 0; j <= n; j++) cuts.push(j / n);
    for (var c = 0; c < cuts.length - 1; c++) out += r(x + cuts[c] * bw, y, (cuts[c + 1] - cuts[c]) * bw, bh, { f: c < (p.k || 0) ? SHADE : '#fff' });
    return { svg: out, h: bh, w: bw };
  };
  P.wholes = function (p, x, y, w) {
    var out = '', R = Math.min(p.R || 18, (w - 10 * (p.n - 1)) / p.n / 2);
    for (var i = 0; i < p.n; i++) out += circ(x + R + i * (2 * R + 10), y + R, R, { s: INK2 }) + circ(x + R + i * (2 * R + 10), y + R, R * 0.68, { s: LINE, sw: 0.8 });
    return { svg: out, h: 2 * R, w: p.n * (2 * R + 10) - 10 };
  };
  function shape(ch, cx, cy, s, col) {
    col = col || INK;
    if (ch === 'c') return circ(cx, cy, s * 0.45, { s: col, sw: 1.4 });
    if (ch === 'C') return circ(cx, cy, s * 0.45, { s: col, f: SHADE, sw: 1.4 });
    if (ch === 's') return r(cx - s * 0.42, cy - s * 0.42, s * 0.84, s * 0.84, { s: col, sw: 1.4 });
    if (ch === 'S') return r(cx - s * 0.42, cy - s * 0.42, s * 0.84, s * 0.84, { s: col, f: SHADE, sw: 1.4 });
    if (ch === 't') return path('M' + cx + ' ' + (cy - s * 0.45) + ' L' + (cx + s * 0.48) + ' ' + (cy + s * 0.4) + ' L' + (cx - s * 0.48) + ' ' + (cy + s * 0.4) + ' Z', { s: col, sw: 1.4 });
    if (ch === 'd') return path('M' + cx + ' ' + (cy - s * 0.48) + ' L' + (cx + s * 0.4) + ' ' + cy + ' L' + cx + ' ' + (cy + s * 0.48) + ' L' + (cx - s * 0.4) + ' ' + cy + ' Z', { s: col, sw: 1.4 });
    if ('><^v'.indexOf(ch) >= 0) {
      var rot = { '>': 0, 'v': 90, '<': 180, '^': 270 }[ch];
      return '<g transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')">' + path('M' + (cx - s * 0.38) + ' ' + cy + ' L' + (cx + s * 0.3) + ' ' + cy + ' M' + (cx + s * 0.08) + ' ' + (cy - s * 0.22) + ' L' + (cx + s * 0.34) + ' ' + cy + ' L' + (cx + s * 0.08) + ' ' + (cy + s * 0.22), { s: col, sw: 1.8 }) + '</g>';
    }
    return '';
  }
  S.draw.shape = shape;
  P.pat = function (p, x, y, w, key) {
    var s = p.s || 24, out = '', seq = p.seq.split(''), all = seq.length + (p.blanks || 0), sp = Math.min(s + 8, (w - 4) / all), sz = Math.min(s, sp - 6);
    seq.forEach(function (ch, i) { out += shape(ch, x + sp / 2 + i * sp, y + s / 2 + 6, sz); });
    for (var b = 0; b < (p.blanks || 0); b++) {
      var bx = x + (seq.length + b) * sp + 2;
      out += r(bx, y + 4, sp - 4, s + 4, { rx: 4, s: INK2, d: '3 3' });
      if (key && p.next) out += shape(p.next[b], bx + (sp - 4) / 2, y + s / 2 + 6, sz, KEY);
    }
    if (p.core) out += r(x + 1, y, p.core * sp - 2, s + 12, { rx: 6, s: KEY, f: 'none', sw: 1.4, d: '5 3' });
    return { svg: out, h: s + 12, w: all * sp };
  };
  P.clock = function (p, x, y, w, key) {
    var R = p.R || 34, cx = x + R + 2, cy = y + R + 2, out = circ(cx, cy, R, { sw: 1.6 });
    for (var i = 0; i < 60; i++) { var a = i * Math.PI / 30, big = i % 5 === 0; out += ln((cx + Math.sin(a) * (R - (big ? 5 : 2.5))).toFixed(1), (cy - Math.cos(a) * (R - (big ? 5 : 2.5))).toFixed(1), (cx + Math.sin(a) * R).toFixed(1), (cy - Math.cos(a) * R).toFixed(1), { s: big ? INK : LINE, sw: big ? 1.2 : 0.7 }); }
    for (var h = 1; h <= 12; h++) { var b = h * Math.PI / 6; out += T((cx + Math.sin(b) * (R - 13)).toFixed(1), (cy - Math.cos(b) * (R - 13) + 4).toFixed(1), h, { s: R > 30 ? 10 : 8, w: 700, a: 'middle' }); }
    if (!p.blank || key) {
      var col = p.blank ? KEY : INK, ma = p.m * Math.PI / 30, ha = ((p.h % 12) + p.m / 60) * Math.PI / 6;
      out += ln(cx, cy, (cx + Math.sin(ha) * R * 0.5).toFixed(1), (cy - Math.cos(ha) * R * 0.5).toFixed(1), { s: col, sw: 3 }) + ln(cx, cy, (cx + Math.sin(ma) * R * 0.78).toFixed(1), (cy - Math.cos(ma) * R * 0.78).toFixed(1), { s: col, sw: 1.8 });
    }
    out += circ(cx, cy, 2.2, { f: INK });
    return { svg: out, h: 2 * R + 4, w: 2 * R + 4 };
  };
  P.coins = function (p, x, y, w) {
    var out = '', cx = x, cy = y, rowH = 0, sz = { 5: 10.6, 10: 9, 25: 11.9, 100: 13.3, 200: 14 };
    p.list.forEach(function (v) {
      if (v >= 500) {
        if (cx + 70 > x + w) { cx = x; cy += rowH + 8; rowH = 0; }
        out += r(cx, cy, 66, 32, { rx: 3, s: INK2 }) + r(cx + 4, cy + 4, 58, 24, { rx: 2, s: LINE, sw: 0.8 }) + T(cx + 33, cy + 21, '$' + v / 100, { s: 13, w: 700, a: 'middle' });
        cx += 74; rowH = Math.max(rowH, 32); return;
      }
      var R = sz[v] * 1.35;
      if (cx + 2 * R > x + w) { cx = x; cy += rowH + 8; rowH = 0; }
      var mx = cx + R, my = cy + R;
      out += v === 100 ? path(Array.apply(null, Array(11)).map(function (z, i) { var a = i * 2 * Math.PI / 11 - Math.PI / 2; return (i ? 'L' : 'M') + (mx + Math.cos(a) * R).toFixed(1) + ' ' + (my + Math.sin(a) * R).toFixed(1); }).join(' ') + ' Z', { s: INK2, f: '#fff', sw: 1.3 }) : circ(mx, my, R, { s: INK2, sw: 1.3 });
      if (v === 200) out += circ(mx, my, R * 0.62, { s: LINE, sw: 0.9 });
      out += T(mx, my + 4.5, v >= 100 ? '$' + v / 100 : v + '¢', { s: v >= 100 ? 11 : 10, w: 700, a: 'middle' });
      cx += 2 * R + 6; rowH = Math.max(rowH, 2 * R);
    });
    return { svg: out, h: cy - y + rowH, w: w };
  };
  function cash(c) { return c >= 100 ? '$' + (c / 100).toFixed(2) : c + '¢'; }
  S.draw.cash = cash;
  P.tag = function (p, x, y) {
    var w = Math.max(104, D.tw(p.t, 10) + 34), out = path('M' + x + ' ' + (y + 16) + ' L' + (x + 14) + ' ' + y + ' L' + (x + w) + ' ' + y + ' L' + (x + w) + ' ' + (y + 32) + ' L' + (x + 14) + ' ' + (y + 32) + ' Z', { s: INK2 }) + circ(x + 12, y + 16, 2.5, { s: INK2 });
    out += T(x + 22, y + 13, p.t, { s: 10, f: INK2 }) + T(x + 22, y + 28, cash(p.p), { s: 14, w: 700 });
    return { svg: out, h: 32, w: w };
  };
  P.bar = function (p, x, y, w) {
    var gx = x + 26, gw = Math.min(w - 32, 260), gh = p.h || 110, top = y + 6, out = '', bw = gw / p.cats.length;
    for (var v = 0; v <= p.max; v += p.step) { var ly = top + gh - v / p.max * gh; out += ln(gx, ly, gx + gw, ly, { s: LINE, sw: 0.7 }) + T(gx - 6, ly + 4, v, { s: 9, f: INK2, a: 'end' }); }
    p.cats.forEach(function (c, i) {
      var bh = p.vals[i] / p.max * gh;
      if (p.vals[i] != null) out += r(gx + i * bw + bw * 0.2, top + gh - bh, bw * 0.6, bh, { f: SHADE, s: INK2, sw: 1 });
      out += T(gx + i * bw + bw / 2, top + gh + 14, c, { s: 10, a: 'middle', f: INK2 });
    });
    out += ln(gx, top, gx, top + gh, { sw: 1.3 }) + ln(gx, top + gh, gx + gw, top + gh, { sw: 1.3 });
    return { svg: out, h: gh + 22, w: gw + 26 };
  };
  P.tally = function (p, x, y, w, key, th, ans) {
    var out = '', rh = 26, c1 = 84, c2 = 90, c3 = 50, used = 0;
    out += T(x + 6, y + 14, p.head ? p.head[0] : 'Kind', { s: 11, w: 700, f: INK2 }) + T(x + c1 + 6, y + 14, 'Tally', { s: 11, w: 700, f: INK2 }) + T(x + c1 + c2 + c3 / 2, y + 14, 'Count', { s: 11, w: 700, f: INK2, a: 'middle' });
    p.cats.forEach(function (c, i) {
      var ry = y + 20 + i * rh, n = p.vals[i], tx = x + c1 + 6;
      out += ln(x, ry, x + c1 + c2 + c3, ry, { s: LINE, sw: 0.8 }) + T(x + 6, ry + 18, D.words(c, th), { s: 13 });
      for (var k = 0; k < n; k++) { var g = Math.floor(k / 5), m = k % 5, gx = tx + g * 26; out += m < 4 ? ln(gx + m * 5, ry + 5, gx + m * 5, ry + 21, { sw: 1.4 }) : ln(gx - 3, ry + 17, gx + 19, ry + 8, { sw: 1.4 }); }
      if (p.blank) { out += blank(x + c1 + c2 + c3 / 2, ry + 22, 34, key, ans && ans[used], 14); used++; }
      else out += T(x + c1 + c2 + c3 / 2, ry + 18, n, { s: 14, w: 700, a: 'middle' });
    });
    out += ln(x, y + 20 + p.cats.length * rh, x + c1 + c2 + c3, y + 20 + p.cats.length * rh, { s: LINE, sw: 0.8 });
    return { svg: out, h: 22 + p.cats.length * rh, w: c1 + c2 + c3, used: used };
  };
  function solid(k, x, y, s) {
    var o = { s: INK, sw: 1.3 }, d = { s: INK2, sw: 1, d: '3 3' }, out = '', q = s * 0.3;
    if (k === 'cube' || k === 'prism') {
      var w = k === 'prism' ? s * 1.3 : s * 0.8, h = k === 'prism' ? s * 0.6 : s * 0.8, bx = x, by = y + q;
      out += r(bx, by, w, h, o) + path('M' + bx + ' ' + by + ' L' + (bx + q) + ' ' + (by - q) + ' L' + (bx + w + q) + ' ' + (by - q) + ' L' + (bx + w + q) + ' ' + (by + h - q) + ' L' + (bx + w) + ' ' + (by + h) + ' M' + (bx + w) + ' ' + by + ' L' + (bx + w + q) + ' ' + (by - q), o);
      out += path('M' + (bx + q) + ' ' + (by - q) + ' L' + (bx + q) + ' ' + (by + h - q) + ' L' + (bx + w + q) + ' ' + (by + h - q) + ' M' + (bx + q) + ' ' + (by + h - q) + ' L' + bx + ' ' + (by + h), d);
      return { svg: out, w: w + q, h: h + q };
    }
    if (k === 'pyramid') {
      var a = [x, y + s * 0.8], b = [x + s * 0.7, y + s * 0.95], c = [x + s, y + s * 0.7], dd = [x + s * 0.3, y + s * 0.6], t = [x + s * 0.5, y];
      out += path('M' + a + ' L' + b + ' L' + c + ' L' + t + ' Z M' + t + ' L' + b, o) + path('M' + a + ' L' + dd + ' L' + c + ' M' + dd + ' L' + t, d);
      return { svg: out, w: s, h: s * 0.95 };
    }
    if (k === 'cylinder') {
      var cw = s * 0.7, ch = s * 0.9, e = s * 0.12;
      out += '<ellipse cx="' + (x + cw / 2) + '" cy="' + (y + e) + '" rx="' + cw / 2 + '" ry="' + e + '" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>' + path('M' + x + ' ' + (y + e) + ' L' + x + ' ' + (y + ch) + ' A' + cw / 2 + ' ' + e + ' 0 0 0 ' + (x + cw) + ' ' + (y + ch) + ' L' + (x + cw) + ' ' + (y + e), o) + path('M' + x + ' ' + (y + ch) + ' A' + cw / 2 + ' ' + e + ' 0 0 1 ' + (x + cw) + ' ' + (y + ch), d);
      return { svg: out, w: cw, h: ch + e };
    }
    if (k === 'cone') {
      var kw = s * 0.75, kh = s * 0.9, ke = s * 0.12;
      out += path('M' + x + ' ' + (y + kh) + ' L' + (x + kw / 2) + ' ' + y + ' L' + (x + kw) + ' ' + (y + kh) + ' A' + kw / 2 + ' ' + ke + ' 0 0 1 ' + x + ' ' + (y + kh), o) + path('M' + x + ' ' + (y + kh) + ' A' + kw / 2 + ' ' + ke + ' 0 0 1 ' + (x + kw) + ' ' + (y + kh), d);
      return { svg: out, w: kw, h: kh + ke };
    }
    if (k === 'sphere') { var R = s * 0.42; out += circ(x + R, y + R, R, o) + path('M' + x + ' ' + (y + R) + ' A' + R + ' ' + R * 0.3 + ' 0 0 0 ' + (x + 2 * R) + ' ' + (y + R), { s: INK2, sw: 1 }); return { svg: out, w: 2 * R, h: 2 * R }; }
    if (k === 'tri') {
      var tw2 = s * 0.8, th2 = s * 0.6, tq = s * 0.35, by2 = y + s * 0.85;
      out += path('M' + x + ' ' + by2 + ' L' + (x + tw2) + ' ' + by2 + ' L' + (x + tw2 / 2) + ' ' + (by2 - th2) + ' Z', o) + path('M' + (x + tw2 / 2) + ' ' + (by2 - th2) + ' L' + (x + tw2 / 2 + tq) + ' ' + (by2 - th2 - tq * 0.5) + ' L' + (x + tw2 + tq) + ' ' + (by2 - tq * 0.5) + ' L' + (x + tw2) + ' ' + by2, o) + path('M' + x + ' ' + by2 + ' L' + (x + tq) + ' ' + (by2 - tq * 0.5) + ' L' + (x + tw2 + tq) + ' ' + (by2 - tq * 0.5) + ' M' + (x + tq) + ' ' + (by2 - tq * 0.5) + ' L' + (x + tw2 / 2 + tq) + ' ' + (by2 - th2 - tq * 0.5), d);
      return { svg: out, w: tw2 + tq, h: s * 0.9 };
    }
    return { svg: '', w: 0, h: 0 };
  }
  P.solids = function (p, x, y, w) {
    var s = p.s || 56, out = '', cx = x, h = 0;
    var need = p.list.reduce(function (t, k) { return t + solid(k, 0, 0, s).w + 22; }, -22);
    var gaps = 22 * (p.list.length - 1);
    if (need > w) s = s * (w - gaps) / (need - gaps) * 0.97;
    p.list.forEach(function (k, i) {
      var o = solid(k, cx, y, s); out += o.svg;
      if (p.letters) out += T(cx + o.w / 2, y + s + 22, String.fromCharCode(65 + i), { s: 12, w: 700, f: INK2, a: 'middle' });
      cx += o.w + 22; h = Math.max(h, o.h);
    });
    return { svg: out, h: h + (p.letters ? 26 : 4), w: cx - x - 22 };
  };
  P.area = function (p, x, y) {
    var u = p.u || 15, out = '';
    for (var i = 0; i < p.rows; i++) for (var j = 0; j < p.cols; j++) {
      var on = p.rect ? (j < p.rect[0] && i < p.rect[1]) : (p.cells || []).indexOf(j + ',' + i) >= 0;
      out += '<rect x="' + (x + j * u) + '" y="' + (y + i * u) + '" width="' + u + '" height="' + u + '" fill="' + (on ? SHADE : '#fff') + '" stroke="' + (on ? INK2 : LINE) + '" stroke-width="' + (on ? 1 : 0.7) + '"/>';
    }
    return { svg: out, h: p.rows * u, w: p.cols * u };
  };
  P.rect = function (p, x, y) {
    var w = p.w || 120, h = p.h || 64, top = p.all ? 16 : 0, out = r(x + 50, y + 4 + top, w, h, { s: INK, sw: 1.5 });
    out += T(x + 50 + w / 2, y + top + h + 22, p.a + ' ' + p.unit, { s: 12, w: 700, a: 'middle' }) + T(x + 44, y + top + 4 + h / 2 + 4, p.b + ' ' + p.unit, { s: 12, w: 700, a: 'end' });
    if (p.all) out += T(x + 50 + w / 2, y + 12, p.a + ' ' + p.unit, { s: 12, w: 700, a: 'middle' }) + T(x + 56 + w, y + top + 4 + h / 2 + 4, p.b + ' ' + p.unit, { s: 12, w: 700 });
    return { svg: out, h: h + 28 + top, w: w + 100 };
  };
  P.ruler = function (p, x, y, w) {
    var max = p.max || 12, cm = Math.min(18, (w - 10) / max), out = '', ry = y + 20;
    out += r(x + 2 + (p.from || 0) * cm, y, p.len * cm, 12, { rx: 3, f: SHADE, s: INK2 });
    out += r(x, ry, max * cm + 4, 30, { rx: 3, s: INK2 });
    for (var i = 0; i <= max * 10; i++) { var tx = x + 2 + i * cm / 10, big = i % 10 === 0; out += ln(tx, ry, tx, ry + (big ? 11 : i % 5 === 0 ? 8 : 4), { s: big ? INK : INK2, sw: big ? 1 : 0.5 }); if (big) out += T(tx, ry + 24, i / 10, { s: 9, a: 'middle' }); }
    return { svg: out, h: 52, w: max * cm + 4 };
  };
  P.balance = function (p, x, y, w, key, th) {
    var cx = x + 96, t = (p.tilt || 0) * 10, out = '';
    out += path('M' + (cx - 16) + ' ' + (y + 76) + ' L' + (cx + 16) + ' ' + (y + 76) + ' L' + cx + ' ' + (y + 30) + ' Z', { s: INK2 });
    out += ln(cx - 70, y + 30 - t, cx + 70, y + 30 + t, { sw: 1.6 });
    [[-70, p.l, -t], [70, p.r, t]].forEach(function (s) {
      var px = cx + s[0], py = y + 30 + s[2];
      out += ln(px, py, px - 18, py + 18, { s: INK2, sw: 1 }) + ln(px, py, px + 18, py + 18, { s: INK2, sw: 1 }) + path('M' + (px - 26) + ' ' + (py + 18) + ' L' + (px + 26) + ' ' + (py + 18) + ' Q' + px + ' ' + (py + 32) + ' ' + (px - 26) + ' ' + (py + 18), { s: INK });
      if (typeof s[1] === 'number') for (var i = 0; i < s[1]; i++) out += r(px - 20 + (i % 4) * 10, py + 8 - Math.floor(i / 4) * 10, 9, 9, { s: INK2, sw: 0.9 });
      else if (s[1]) out += T(px, py + 11, D.words(s[1], th), { s: 11, w: 700, a: 'middle' });
    });
    return { svg: out, h: 80, w: 192 };
  };
  P.cups = function (p, x, y) {
    var out = '';
    for (var i = 0; i < p.n; i++) { var cx = x + i * 26; out += path('M' + cx + ' ' + y + ' L' + (cx + 20) + ' ' + y + ' L' + (cx + 17) + ' ' + (y + 26) + ' L' + (cx + 3) + ' ' + (y + 26) + ' Z', { s: INK2 }) + ln(cx + 2, y + 8, cx + 18, y + 8, { s: LINE, sw: 0.8 }); }
    return { svg: out, h: 28, w: p.n * 26 };
  };
  P.nl = function (p, x, y, w, key, th, ans) {
    var span = p.max - p.min, u = (w - 24) / span, x0 = x + 12, ly = y + 30, used = 0;
    var out = ln(x0 - 6, ly, x0 + span * u + 6, ly, { sw: 1.3 });
    for (var t = p.min; t <= p.max; t += p.tick) {
      var big = (t - p.min) % p.lab === 0, tx = x0 + (t - p.min) * u;
      out += ln(tx, ly - (big ? 7 : 4), tx, ly + (big ? 7 : 4), { sw: 1 });
      if (big && (p.ask || []).indexOf(t) < 0) out += T(tx, ly + 21, t, { s: 10, f: INK2, a: 'middle' });
    }
    (p.ask || []).forEach(function (v) { out += blank(x0 + (v - p.min) * u, ly + 28, 34, key, ans && ans[used], 12); used++; });
    if (p.pt != null) { var px = x0 + (p.pt - p.min) * u; out += circ(px, ly, 4, { f: INK }) + T(px, ly - 12, p.ptl || p.pt, { s: 12, w: 700, a: 'middle' }); }
    (p.jumps || []).forEach(function (j) {
      var a = x0 + (j[0] - p.min) * u, b = x0 + (j[1] - p.min) * u;
      out += path('M' + a + ' ' + (ly - 2) + ' Q' + (a + b) / 2 + ' ' + (ly - 28) + ' ' + b + ' ' + (ly - 2), { s: INK2, sw: 1.3 }) + (j[2] ? T((a + b) / 2, ly - 18, j[2], { s: 10, w: 700, f: INK2, a: 'middle' }) : '');
    });
    return { svg: out, h: 60, w: w, used: used };
  };
  P.map = function (p, x, y, w, key, th) {
    var u = p.u || 26, out = '';
    for (var i = 0; i <= p.rows; i++) out += ln(x, y + i * u, x + p.cols * u, y + i * u, { s: LINE, sw: 0.8 });
    for (var j = 0; j <= p.cols; j++) out += ln(x + j * u, y, x + j * u, y + p.rows * u, { s: LINE, sw: 0.8 });
    (p.marks || []).forEach(function (m) { out += circ(x + m[0] * u + u / 2, y + m[1] * u + u / 2, u * 0.38, { s: INK2 }) + T(x + m[0] * u + u / 2, y + m[1] * u + u / 2 + 4, D.words(m[2], th), { s: 10, w: 700, a: 'middle' }); });
    if (p.start) out += shape(p.start[2], x + p.start[0] * u + u / 2, y + p.start[1] * u + u / 2, u * 0.8);
    if (key && p.path) out += path('M' + p.path.map(function (q) { return (x + q[0] * u + u / 2) + ' ' + (y + q[1] * u + u / 2); }).join(' L'), { s: KEY, sw: 1.8 });
    return { svg: out, h: p.rows * u, w: p.cols * u };
  };
  P.venn = function (p, x, y, w, key, th) {
    var R = p.R || Math.min(70, w / 3.2), cx = x + Math.min(w, 3.2 * R) / 2, out = '<ellipse cx="' + (cx - R * 0.55) + '" cy="' + (y + R + 18) + '" rx="' + R + '" ry="' + R * 0.85 + '" fill="none" stroke="' + INK + '" stroke-width="1.4"/><ellipse cx="' + (cx + R * 0.55) + '" cy="' + (y + R + 18) + '" rx="' + R + '" ry="' + R * 0.85 + '" fill="none" stroke="' + INK + '" stroke-width="1.4"/>';
    out += T(cx - R * 0.9, y + 10, D.words(p.a, th), { s: 12, w: 700, a: 'middle' }) + T(cx + R * 0.9, y + 10, D.words(p.b, th), { s: 12, w: 700, a: 'middle' });
    return { svg: out, h: 2 * R * 0.85 + 24, w: Math.min(w, 3.2 * R) };
  };
  P.row = function (p, x, y, w, key, th, ans) {
    var cx = x, h = 0, out = '', used = 0, gap = p.gap || 16, each = (w - (p.list.length - 1) * gap) / p.list.length;
    p.list.forEach(function (sp, i) {
      var o = D.pic(sp, cx, y, each, key, th, ans ? ans.slice(used) : null);
      out += o.svg; used += o.used || 0;
      if (p.labels) out += T(cx + o.w / 2, y + o.h + 16, D.words(p.labels[i], th), { s: 11, w: 700, f: INK2, a: 'middle' });
      cx += o.w + gap; h = Math.max(h, o.h);
    });
    return { svg: out, h: h + (p.labels ? 20 : 0), w: cx - x - gap, used: used };
  };
})();
