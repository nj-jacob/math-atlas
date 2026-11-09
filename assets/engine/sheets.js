/* Math Atlas worksheets: printable sheets for every idea of a chapter, shared by every grade.
   Needs site.js (Atlas) and lesson.js (Atlas.lessons). The themes are in sheet-themes.js. Each grade's
   sheets/<chapter>.js holds that chapter's written questions:

     Atlas.sheets.register('multiply-divide', { code: 'MD', ideas: { <idea slug>: idea, ... } });
     idea = { watch: 'what to watch for (answer key only)', goal: 'I can ... (under the title)',
              learn:  { show, together: [item, item], cue: 'the tip, shown beside the example on every sheet of the idea', own: [item x 4] },
              p1: { show, items: [item x 6] }, p2: { show, items }, p3: { items },   (practise at 3 levels)
              think: { items: [item x 4 to 6] } }
     show = { pic, cap, eq: ['4 + 4 + 4 = 12', '3 × 4 = 12'] }   the "Watch me" (learn) or "Example" at the top
     item = { q: 'words, with theme words like {a} {many}', pic: ['groups' | 'array' | 'line' | 'share' | 'table', options],
              eq: ['[] × [] = []', ...] ([] is a line to write on), a: [answers for every [] in eq, in order], pick: { opts: [...], ans: index },
              draw: { h, key: pic or 'words' }, lines: { n, key: 'a good answer' }, wide: true (both columns),
              calc: '4 × 5' (a story's sum, for the answer check), tf: '3 × 6 = 6 × 3' (the statement a true/false pick is about) }
   Theme words: {a} and {b} (two names), {one} and {many} (the things), {cont} and {conts} (what holds them).
   Every theme uses the same numbers and layout, so no theme is harder than another.

   A sheet is drawn as one Letter page (612 x 792 points) in SVG, so it prints exactly as it looks on screen.
   The look is "Editorial" (Noel's choice, 2026-11-08): a large title in the theme's face with the goal under it, the example
   with the tip beside it, questions in two columns with their numbers hanging in the margin and hairlines between rows,
   answers written on short lines, and a "How did it feel?" check-in at the bottom. No boxes around questions.
   Its answer key is the same page with the answers in red, a "watch for" note, the Ontario codes and a score line.
   Sheet numbers (G3-MD-07-P2-RK) name the grade, chapter, idea, kind and theme, so a sheet always prints the same.
   The answer checks are in tests/verify/sheets.js; tests/run.js draws every sheet in every theme and checks it fits. */
(function () {
  'use strict';
  var A = window.Atlas;
  if (!A || !A.lessons) return;
  var $ = A.$;
  var S = (A.sheets = { chapters: {}, themes: [], overflow: [] });
  var W = 612, H = 792, M = 40, RIGHT = W - M, BOTTOM = 686, COL1 = M + 30, COLW = 228, COL2 = RIGHT - COLW, SIDEW = 150, BL = 40;
  var CUR = { th: null, plain: false }; /* the theme being drawn, and whether counting pictures use plain dots */
  var INK = '#132039', INK2 = '#55627a', LINE = '#cdd5e1', KEY = '#b4283f', DOT = '#b9c2d0';
  var FONT = "'Atkinson Hyperlegible', system-ui, sans-serif";
  var KINDS = [['learn', 'Learn', 'L'], ['p1', 'Practise 1', 'P1'], ['p2', 'Practise 2', 'P2'], ['p3', 'Practise 3', 'P3'], ['think', 'Think', 'T']];
  S.kinds = KINDS;

  S.register = function (chId, def) { S.chapters[chId] = def; };
  S.theme = function (th) { S.themes.push(th); };
  S.has = function (chId) { return !!S.chapters[chId]; };

  /* ---------- small helpers ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function plain(h) { var d = document.createElement('div'); d.innerHTML = h; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  var ctx2d;
  function tw(s, size, weight, family) {
    ctx2d = ctx2d || document.createElement('canvas').getContext('2d');
    ctx2d.font = (weight || 400) + ' ' + size + 'px ' + (family || FONT);
    return ctx2d.measureText(String(s)).width;
  }
  function wrap(s, size, width, family) {
    var lines = [], cur = '';
    String(s).split(' ').forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (cur && tw(t, size, 400, family) > width) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  /* a line of text; the font and colour go in a style so the site's own "svg text" rule cannot replace them */
  function T(x, y, s, o) {
    o = o || {};
    var size = o.s || 14, body = esc(s);
    /* a power written 10^6 has its exponent small and raised; the empty part after it brings the line back down */
    if (/\^\d/.test(body)) body = body.replace(/\^(\d+)/g, function (m, e) { return '<tspan dy="-' + size * 0.4 + '" font-size="' + size * 0.62 + '">' + e + '</tspan><tspan dy="' + size * 0.4 + '">\u200b</tspan>'; });
    return '<text x="' + x + '" y="' + y + '" style="font-family:' + (o.fam || FONT).replace(/"/g, "'") + ';fill:' + (o.f || INK) + '" font-size="' + size + '" font-weight="' + (o.w || 400) + '"' +
      (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.i ? ' font-style="italic"' : '') + (o.ls ? ' letter-spacing="' + o.ls + '"' : '') + (o.c ? ' class="' + o.c + '"' : '') + '>' + body + '</text>';
  }
  /* a number as a sheet writes it: 12500 as "12 500" (a no-break space keeps it one number); 4-digit numbers stay as they are */
  function fmt(n) {
    if (typeof n !== 'number') return n;
    var parts = String(Math.abs(n)).split('.'), whole = parts[0];
    if (whole.length >= 5) whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
    /* a negative number takes a true minus sign (−3), as the sheet's sums write it */
    return (n < 0 ? '\u2212' : '') + whole + (parts[1] != null ? '.' + parts[1] : '');
  }
  S.fmt = fmt;
  function words(s, th) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return th.w[k] != null ? th.w[k] : m; }); }
  function rep(g, k) { var a = []; for (var i = 0; i < g; i++) a.push(k); return a; }
  /* one thing to count: the theme's own picture (a puck, a jar ...), or a plain dot on Practise 3 and Think */
  function obj(cx, cy, r) {
    var th = CUR.th;
    return '<g class="dot">' + (th && th.glyph && !CUR.plain ? th.glyph(cx, cy, r) : '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/>') + '</g>';
  }
  /* what holds a group: the theme's own shape (a bag, a crate, a tray ...), or a rounded box */
  function holder(x, y, w, h) {
    var th = CUR.th;
    return '<g class="grp">' + (th && th.holder && !CUR.plain ? th.holder(x, y, w, h) : '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="#fff" stroke="' + INK2 + '" stroke-width="1.2"/>') + '</g>';
  }

  /* ---------- pictures: each returns { svg, h } drawn from (x, y) within width w ---------- */
  var PIC = {};
  /* equal (or unequal) groups of plain dots: { g, k } or { counts: [4, 4, 3] } */
  PIC.groups = function (p, x, y, w) {
    var counts = p.counts || rep(p.g, p.k), n = counts.length, most = Math.max.apply(null, counts);
    var cols = most > 5 ? Math.ceil(most / 2) : most, rows = most > 5 ? 2 : 1, gap = 8;
    /* as few lines of groups as fit, with things as big as fit (up to 19 points apart) */
    var per = n, sp = 0;
    for (var lines = 1; lines <= n; lines++) {
      per = Math.ceil(n / lines);
      sp = Math.min(19, ((w - gap * (per - 1)) / per - 8) / cols);
      if (sp >= 12) break;
    }
    var gw = cols * sp + 8, gh = rows * sp + 8, r = sp / 3.1, out = '';
    counts.forEach(function (k, j) {
      var gx = x + (j % per) * (gw + gap), gy = y + Math.floor(j / per) * (gh + gap);
      out += holder(gx, gy, gw, gh);
      for (var d = 0; d < k; d++) out += obj(gx + 4 + sp / 2 + (d % cols) * sp, gy + 4 + sp / 2 + Math.floor(d / cols) * sp, r);
    });
    return { svg: out, h: Math.ceil(n / per) * (gh + gap) - gap, w: Math.min(n, per) * (gw + gap) - gap };
  };
  /* an array: { r, c, split: rows above a dashed cut } */
  PIC.array = function (p, x, y) {
    var sp = p.c > 8 || p.r >= 6 ? 12 : p.c > 6 ? 15 : 18, out = '';
    for (var i = 0; i < p.r; i++) for (var j = 0; j < p.c; j++) out += obj(x + 6 + j * sp, y + 6 + i * sp + (p.split && i >= p.split ? 8 : 0), sp / 3.1);
    if (p.split) { var ly = y + 6 + p.split * sp - sp / 2 + 4; out += '<line x1="' + x + '" y1="' + ly + '" x2="' + (x + p.c * sp) + '" y2="' + ly + '" stroke="' + KEY + '" stroke-width="1.4" stroke-dasharray="5 4"/>'; }
    return { svg: out, h: p.r * sp + (p.split ? 8 : 0), w: p.c * sp };
  };
  /* t loose dots in rows of 10, for making groups */
  PIC.dots = function (p, x, y) {
    var out = '';
    for (var i = 0; i < p.t; i++) out += obj(x + 7 + (i % 10) * 19, y + 7 + Math.floor(i / 10) * 19, 5);
    return { svg: out, h: Math.ceil(p.t / 10) * 19 - 5, w: Math.min(p.t, 10) * 19 };
  };
  /* a number line from 0 to max with n jumps of size step drawn from 0 (n: 0 for an empty line) */
  PIC.line = function (p, x, y, w) {
    var max = p.max, u = (w - 16) / max, x0 = x + 6, ly = y + 29, out = '', lab = p.labels || p.step;
    out += '<line x1="' + x0 + '" y1="' + ly + '" x2="' + (x0 + max * u) + '" y2="' + ly + '" stroke="' + INK + '" stroke-width="1.3"/>';
    var tick = max > 50 ? 10 : max > 30 ? 5 : 1;
    for (var t = 0; t <= max; t += tick) {
      var big = t % lab === 0;
      out += '<line x1="' + (x0 + t * u) + '" y1="' + (ly - (big ? 6 : 4)) + '" x2="' + (x0 + t * u) + '" y2="' + (ly + (big ? 6 : 4)) + '" stroke="' + INK + '" stroke-width="1"/>';
      if (big) out += T(x0 + t * u, ly + 19, t, { s: 10, f: INK2, a: 'middle' });
    }
    for (var j = 0; j < (p.n || 0); j++) {
      var a = x0 + j * p.step * u, b = x0 + (j + 1) * p.step * u;
      out += '<path class="jump" d="M' + a + ' ' + (ly - 2) + ' Q' + (a + b) / 2 + ' ' + (ly - 26) + ' ' + b + ' ' + (ly - 2) + '" fill="none" stroke="' + INK2 + '" stroke-width="1.4"/>';
    }
    return { svg: out, h: 52, w: w };
  };
  /* sharing: t dots to share, and g empty plates to draw them on (the key draws them in) */
  PIC.share = function (p, x, y, w, key) {
    var out = '', per = Math.min(p.t, Math.floor((w - 6) / 14));
    for (var i = 0; i < p.t; i++) out += obj(x + 6 + (i % per) * 14, y + 6 + Math.floor(i / per) * 14, 4.4);
    var top = y + Math.ceil(p.t / per) * 14 + 10, pr = Math.min(24, (w - 8 * (p.g - 1)) / p.g / 2), each = p.t / p.g;
    for (var j = 0; j < p.g; j++) {
      var cx = x + pr + j * (pr * 2 + 8), cy = top + pr;
      out += '<circle class="plate" cx="' + cx + '" cy="' + cy + '" r="' + pr + '" fill="#fff" stroke="' + INK2 + '" stroke-width="1.2"/>';
      if (key) for (var d = 0; d < each; d++) {
        var ang = d / each * Math.PI * 2, rr = each > 1 ? pr * 0.55 : 0;
        out += '<circle cx="' + (cx + Math.cos(ang) * rr) + '" cy="' + (cy + Math.sin(ang) * rr) + '" r="3.4" fill="' + KEY + '"/>';
      }
    }
    return { svg: out, h: top - y + pr * 2, w: w };
  };
  /* a two-column table: { head: [words, words], rows: [[1, 5], [2, '[]']] }; blanks take answers in order */
  PIC.table = function (p, x, y, w, key, th, ans) {
    var cw = Math.min(100, w / 2), rh = 27, out = '', k = 0;
    p.head.forEach(function (hd, c) { out += T(x + c * cw + cw / 2, y + 18, words(hd, th), { s: 12, w: 700, f: INK2, a: 'middle' }); });
    p.rows.forEach(function (row, r) {
      var ry = y + 26 + r * rh;
      out += '<line x1="' + x + '" y1="' + ry + '" x2="' + (x + cw * 2) + '" y2="' + ry + '" stroke="' + LINE + '" stroke-width="1"/>';
      row.forEach(function (v, c) {
        var cx = x + c * cw + cw / 2;
        if (v === '[]') { out += '<line class="blank" x1="' + (cx - 20) + '" y1="' + (ry + 24) + '" x2="' + (cx + 20) + '" y2="' + (ry + 24) + '" stroke="' + INK + '" stroke-width="1.3"/>'; if (key) out += T(cx, ry + 20, fmt(ans[k]), { s: 15, w: 700, f: KEY, a: 'middle' }); k++; }
        else out += T(cx, ry + 20, v, { s: 15, w: 700, a: 'middle' });
      });
    });
    out += '<line x1="' + (x + cw) + '" y1="' + (y + 4) + '" x2="' + (x + cw) + '" y2="' + (y + 26 + p.rows.length * rh) + '" stroke="' + LINE + '" stroke-width="1"/>';
    return { svg: out, h: 26 + p.rows.length * rh, w: cw * 2, used: k };
  };
  function pic(spec, x, y, w, key, th, ans) { return PIC[spec[0]](spec[1], x, y, w, key, th, ans); }

  /* a number as a sum writes it: digits with a minus sign, a $, a % or a root sign, in brackets or not: −3, (−2.5), √49 */
  var NUM = /^\(?[\u2212\u221a]?\$?[\d,.\/\u00a0:]*\d[\d,.\/\u00a0%:]*\)?$/;
  /* one row of an equation: numbers, symbols and words; [] is a short line to write on, long enough for its answer;
     3/[] and []/8 put the line in one part of a fraction; a blank may sit in brackets: 2 × ([] + []);
     a power is written 2^5 or (−3)^2, and its exponent may be a blank: 10^[] */
  function eqRow(s, x, y, key, ans, size) {
    var out = '', cx = x, k = 0, big = size || 18;
    s.replace(/(\d) (?=\d{3}\b)/g, '$1\u00a0').split(' ').filter(Boolean).forEach(function (tok) {
      var pw = tok.match(/^(.+)\^(\[\]|\d+)$/), root = tok === '√[]';
      if (root) { out += T(cx, y + 21, '√', { s: big, w: 700 }); cx += tw('√', big, 700) + 1; tok = '[]'; }
      if (pw && (NUM.test(pw[1]) || pw[1] === '[]')) {
        /* the base at full size (or a line to write it on), the exponent small and raised; a blank exponent is a short raised line */
        if (pw[1] === '[]') {
          out += '<line class="blank" x1="' + cx + '" y1="' + (y + 25) + '" x2="' + (cx + 30) + '" y2="' + (y + 25) + '" stroke="' + INK + '" stroke-width="1.3"/>';
          if (key) out += T(cx + 15, y + 21, fmt(ans[k]), { s: big, w: 700, f: KEY, a: 'middle' });
          k++; cx += 31;
        } else { out += T(cx, y + 21, pw[1], { s: big, w: 700 }); cx += tw(pw[1], big, 700) + 1; }
        if (pw[2] === '[]') {
          out += '<line class="blank" x1="' + cx + '" y1="' + (y + 10) + '" x2="' + (cx + 20) + '" y2="' + (y + 10) + '" stroke="' + INK + '" stroke-width="1.2"/>';
          if (key) out += T(cx + 10, y + 7, fmt(ans[k]), { s: 11, w: 700, f: KEY, a: 'middle' });
          k++; cx += 27;
        } else { out += T(cx, y + 11, pw[2], { s: big * 0.62, w: 700 }); cx += tw(pw[2], big * 0.62, 700) + 7; }
        return;
      }
      var open = /^\(.*\[\]/.test(tok), close = /\[\].*\)$/.test(tok);
      if (open) { out += T(cx, y + 21, '(', { s: 14, f: INK2 }); cx += tw('(', 14) + 2; tok = tok.slice(1); }
      if (close) tok = tok.slice(0, -1);
      var comma = tok === '[],';
      if (comma) tok = '[]';
      var fr = tok.match(/^(\d*\/)?\[\](\/\d+)?$/);
      if (fr && (tok === '[]' || !fr[1] !== !fr[2])) {
        /* a blank, or a blank for one part of a fraction: 3/[] or []/8 */
        /* the line grows only when the answer would not fit on it even in smaller type; the key's answer shrinks to fit */
        var short = tok !== '[]', base = short ? 28 : BL, aw = ans[k] == null ? 0 : tw(fmt(ans[k]), big, 700);
        var bl = Math.max(base, aw * 12 / big + 6), fs = Math.min(big, big * (bl - 6) / (aw || 1));
        if (fr[1]) { out += T(cx, y + 21, fr[1], { s: big, w: 700 }); cx += tw(fr[1], big, 700) + 2; }
        out += '<line class="blank" x1="' + cx + '" y1="' + (y + 25) + '" x2="' + (cx + bl) + '" y2="' + (y + 25) + '" stroke="' + INK + '" stroke-width="1.3"/>';
        if (key) out += T(cx + bl / 2, y + 21, fmt(ans[k]), { s: fs, w: 700, f: KEY, a: 'middle' });
        k++; cx += bl + (fr[2] ? 2 : 7);
        if (fr[2]) { out += T(cx, y + 21, fr[2], { s: big, w: 700 }); cx += tw(fr[2], big, 700) + 7; }
        if (comma) { out += T(cx - 4, y + 21, ',', { s: big, w: 700 }); cx += 6; }
        if (close) { out += T(cx - 4, y + 21, ')', { s: 14, f: INK2 }); cx += tw(')', 14) + 3; }
      } else if (NUM.test(tok)) { out += T(cx, y + 21, tok, { s: big, w: 700 }); cx += tw(tok, big, 700) + 7; }
      else { out += T(cx, y + 21, tok, { s: 14, f: INK2 }); cx += tw(tok, 14) + 7; }
    });
    return { svg: out, w: cx - 7 - x, used: k };
  }
  /* ---------- one question: its number hangs to the left of x, its parts are drawn from (x, y) within width w ---------- */
  function item(it, n, x, y, w, key, th) {
    var out = '', cy = y, ans = (it.a || []).slice(), ai = 0;
    out += T(x - 12, y + 22, n, { s: 26, w: 400, f: th.acc, a: 'end', fam: th.font });
    if (it.q) { wrap(words(it.q, th).replace(/(\d) (?=\d{3}\b)/g, '$1\u00a0'), 14, w).forEach(function (l) { out += T(x, cy + 16, l); cy += 19; }); cy += 6; }
    if (it.pic) {
      var p = pic(it.pic, x, cy + (it.q ? 0 : 4), w, key, th, ans);
      out += '<g class="pic">' + p.svg + '</g>';
      if (p.used) ans = ans.slice(p.used);
      cy += p.h + (it.q ? 12 : 16);
    }
    function pick() {
      var px = x;
      it.pick.opts.forEach(function (o, i) {
        var ow = tw(words(o, th), 16, 700);
        /* choices that do not fit on one line go on to the next */
        if (i && px + ow > x + w) { px = x; cy += 34; }
        if (key && i === it.pick.ans) out += '<ellipse cx="' + (px + ow / 2) + '" cy="' + (cy + 15) + '" rx="' + (ow / 2 + 11) + '" ry="14" fill="none" stroke="' + KEY + '" stroke-width="1.8"/>';
        out += T(px, cy + 21, words(o, th), { s: 16, w: 700 });
        px += ow + 34;
      });
      if (px - 34 > x + w) S.overflow.push('a choice is too wide: ' + it.pick.opts.join(', '));
      cy += 36;
    }
    if (it.pick && !it.pickLast) pick();
    if (it.draw) {
      var dh = it.draw.h || 80, dw = Math.min(w, 260), dots = '';
      for (var gy = cy + 7; gy < cy + dh; gy += 14) for (var gx = x + 7; gx < x + dw; gx += 14) dots += '<circle cx="' + gx + '" cy="' + gy + '" r=".9" fill="' + DOT + '"/>';
      out += '<g class="draw">' + dots + '</g>';
      if (key && it.draw.key) {
        if (typeof it.draw.key === 'string') wrap(words(it.draw.key, th), 12, dw - 16).forEach(function (l, i) { out += T(x + 8, cy + 20 + i * 16, l, { s: 12, f: KEY }); });
        else out += '<g opacity=".9">' + pic(it.draw.key, x + 8, cy + 8, dw - 16, true, th).svg.replace(/fill="#132039"/g, 'fill="' + KEY + '"') + '</g>';
      }
      cy += dh + 10;
    }
    var cols = it.cols || 1, cw = w / cols, per = Math.ceil((it.eq || []).length / cols);
    (it.eq || []).forEach(function (row, i) {
      var c = Math.floor(i / per), r = eqRow(words(row, th), x + c * cw, cy + (i % per) * 36, key, ans.slice(ai));
      out += r.svg; ai += r.used;
      if (r.w > cw - (cols > 1 ? 12 : 0)) S.overflow.push('a sum is too wide: ' + row);
    });
    cy += per * 36;
    if (it.pick && it.pickLast) pick();
    if (it.lines) {
      cy += 6;
      for (var i = 0; i < it.lines.n; i++) out += '<line x1="' + x + '" y1="' + (cy + 18 + i * 28) + '" x2="' + (x + w - 6) + '" y2="' + (cy + 18 + i * 28) + '" stroke="' + LINE + '" stroke-width="1.1"/>';
      if (key && it.lines.key) wrap(words(it.lines.key, th), 12, w - 10).forEach(function (l, j) { out += T(x + 2, cy + 14 + j * 28, l, { s: 12, f: KEY }); });
      cy += it.lines.n * 28 + 4;
    }
    return { svg: '<g class="it" data-n="' + n + '" data-x0="' + (x - 30) + '" data-x1="' + (x + w) + '">' + out + '</g>', h: cy - y };
  }

  /* questions in two columns, each number hanging in the gap to its left; a hairline between rows; wide: true takes the row */
  function grid(list, y, n0, key, th) {
    var out = '', n = n0, i = 0;
    while (i < list.length) {
      var row = list[i].wide ? [list[i]] : [list[i]].concat(list[i + 1] && !list[i + 1].wide ? [list[i + 1]] : []);
      if (i > 0) out += rule(y - 11);
      var hs = row.map(function (it, c) { var r = item(it, n + c, c ? COL2 : COL1, y, row.length === 1 && it.wide ? RIGHT - COL1 : COLW, key, th); out += r.svg; return r.h; });
      n += row.length; i += row.length;
      y += Math.max.apply(null, hs) + 22;
    }
    return { svg: out, y: y, n: n };
  }
  function rule(y, x0) { return '<line x1="' + (x0 || M) + '" y1="' + y + '" x2="' + RIGHT + '" y2="' + y + '" stroke="' + LINE + '" stroke-width=".8"/>'; }
  /* a small spaced-out label, such as WATCH ME or ON YOUR OWN */
  function label(x, y, s, colour) { return T(x, y, s.toUpperCase(), { s: 9, w: 700, f: colour, ls: 1.4 }); }
  /* a side note on the right: a label and a few short lines */
  function note(x, y, w, head, text, th, colour) {
    var out = label(x, y, head, colour || th.acc), cy = y + 4;
    wrap(text, 11.5, w).forEach(function (l) { out += T(x, cy + 14, l, { s: 11.5, f: colour === KEY ? INK : INK2 }); cy += 15.5; });
    return { svg: out, y: cy };
  }
  /* the Watch me or Example: picture, then the sum beside it (or under it), with the tip as a side note on the right */
  function band(show, tip, y, th, head) {
    var right = tip ? RIGHT - SIDEW - 24 : RIGHT, p = show.pic ? pic(show.pic, M, y, 250, false, th, []) : { svg: '', h: 0, w: 0 };
    var lines = show.eq || [], sizes = lines.map(function (l, i) { return i === lines.length - 1 ? 24 : 17; });
    var fam = function (i) { return i === lines.length - 1 ? th.font : FONT; };
    var textW = Math.max.apply(null, [show.cap ? tw(words(show.cap, th), 13) : 0].concat(lines.map(function (l, i) { return tw(l, sizes[i], 700, fam(i)); })));
    var hText = (show.cap ? 22 : 0) + lines.length * 30, beside = !p.w || M + p.w + 28 + textW <= right;
    var tx = beside && p.w ? M + p.w + 28 : M, ty = beside ? y + Math.max(0, p.h / 2 - hText / 2) : y + p.h + 12, out = label(M, y - 12, head, th.acc) + '<g class="show">' + p.svg + '</g>';
    if (show.cap) { out += T(tx, ty + 13, words(show.cap, th), { s: 13, f: INK2 }); ty += 22; }
    lines.forEach(function (l, i) {
      out += T(tx, ty + 22, l, { s: sizes[i], w: 700, c: 'showeq', fam: i === lines.length - 1 ? th.font : null });
      if (tx + tw(l, sizes[i], 700, fam(i)) > right) S.overflow.push('the example is too wide: ' + l);
      ty += 30;
    });
    var h = Math.max(beside ? p.h : 0, ty - y);
    if (tip) { var nt = note(RIGHT - SIDEW, y - 12, SIDEW, 'Tip', tip, th); out += nt.svg; h = Math.max(h, nt.y - y); }
    return { svg: out, h: h };
  }

  /* ---------- a whole page ---------- */
  function nameDate(x, y, right, colour) {
    return T(x, y, 'Name', { s: 10, f: colour || INK2 }) + '<line x1="' + (x + 32) + '" y1="' + (y + 2) + '" x2="' + right + '" y2="' + (y + 2) + '" stroke="' + (colour || INK2) + '" stroke-width=".8"/>' +
      T(x, y + 24, 'Date', { s: 10, f: colour || INK2 }) + '<line x1="' + (x + 32) + '" y1="' + (y + 26) + '" x2="' + right + '" y2="' + (y + 26) + '" stroke="' + (colour || INK2) + '" stroke-width=".8"/>';
  }
  S.T = T;
  S.tw = tw;
  /* for picture files loaded after this one (sheet-pics.js, sheet-pics-upper.js): add S.pics.<name> = function (p, x, y, w, key, th, ans)
     returning { svg, h, w, used } (used: how many answers its own blanks took, from the start of ans) */
  S.pics = PIC;
  S.draw = { T: T, tw: tw, wrap: wrap, words: words, obj: obj, holder: holder, rule: rule, pic: pic, INK: INK, INK2: INK2, LINE: LINE, KEY: KEY, DOT: DOT, FONT: FONT, BL: BL };
  function concept(chId, slug) { return A.lessons.flat(chId).filter(function (c) { return c.slug === slug; })[0]; }
  S.code = function (chId, slug, kind, th) {
    var d = S.chapters[chId], ideas = Object.keys(d.ideas), kd = KINDS.filter(function (k) { return k[0] === kind; })[0];
    return 'G' + A.grade + '-' + d.code + '-' + ('0' + (ideas.indexOf(slug) + 1)).slice(-2) + '-' + kd[2] + '-' + th.id;
  };
  S.themeById = function (id) { return S.themes.filter(function (t) { return t.id === id; })[0] || S.themes[0]; };
  /* the heading: the theme's mark, a small line naming the chapter and kind, the title in the theme's face, and the goal */
  function heading(title, kicker, goal, key, th) {
    var size = 34, max = key ? RIGHT - M : 330;
    while (tw(title, size, 700, th.font) > max && size > 18) size--;
    var out = '<g transform="translate(' + M + ' 28) scale(.5)">' + th.mark + '</g>' + label(M + 36, 47, kicker, th.acc) +
      T(M, 92, title, { s: size, w: 700, fam: th.font }) + (goal ? T(M, 116, goal, { s: 13, i: 1, f: INK2 }) : '');
    if (!key) out += nameDate(392, 52, RIGHT);
    return out + '<line x1="' + M + '" y1="134" x2="' + RIGHT + '" y2="134" stroke="' + INK + '" stroke-width="1.2"/>';
  }
  S.page = function (chId, slug, kind, themeId, key) {
    var d = S.chapters[chId], idea = d.ideas[slug], spec = idea[kind], c = concept(chId, slug), th = S.themeById(themeId);
    var m = A.meta.filter(function (x) { return x.id === chId; })[0], code = S.code(chId, slug, kind, th), kd = KINDS.filter(function (k) { return k[0] === kind; })[0];
    var title = plain(c.title), tip = idea.learn && idea.learn.cue ? words(idea.learn.cue, th) : '', out = '', y = 168, n = 1;
    CUR.th = th; CUR.plain = kind === 'p3' || kind === 'think';
    if (th.frame) out += th.frame(W, H, M, RIGHT);
    out += heading(key ? 'Answer key: ' + title : title, plain(m.title) + ' · ' + kd[1] + (key ? ' · for grown-ups' : ''), idea.goal, key, th);
    if (spec.show) {
      var b = band(spec.show, tip, y, th, kind === 'learn' ? 'Watch me' : 'Example'); out += b.svg; y += b.h + 16;
      out += rule(y - 2, M); y += 26;
    } else if (tip) {
      var nt = note(M, y - 12, RIGHT - M, 'Tip', tip, th); out += nt.svg; y = nt.y + 10;
      out += rule(y - 2, M); y += 26;
    }
    if (kind === 'learn') {
      out += label(M, y - 12, 'Together', th.acc);
      var g1 = grid(spec.together, y + 4, n, key, th); out += g1.svg; n = g1.n; y = g1.y + 2;
      out += rule(y - 13, M) + label(M, y + 2, 'On your own', th.acc);
      var g2 = grid(spec.own, y + 18, n, key, th); out += g2.svg; y = g2.y; n = g2.n;
    } else {
      var g3 = grid(spec.items, y, n, key, th); out += g3.svg; y = g3.y; n = g3.n;
    }
    if (y - 26 > BOTTOM) S.overflow.push(code + ' runs ' + Math.round(y - 26 - BOTTOM) + ' points past the bottom');
    out += '<line x1="' + M + '" y1="' + (BOTTOM + 10) + '" x2="' + RIGHT + '" y2="' + (BOTTOM + 10) + '" stroke="' + INK + '" stroke-width="1"/>';
    if (key) {
      var w = note(M, BOTTOM + 28, RIGHT - M - 110, 'Watch for', words(idea.watch, th), th, KEY);
      out += w.svg + label(RIGHT - 90, BOTTOM + 28, 'Ontario', KEY) + T(RIGHT - 90, BOTTOM + 46, c.exp.join(', '), { s: 11.5 }) + T(RIGHT - 90, BOTTOM + 64, 'Score ____ of ' + (n - 1), { s: 11.5, f: INK2 });
      if (w.y > BOTTOM + 66) S.overflow.push(code + ' has a watch-for note longer than 2 lines');
    } else {
      var fx = M + tw('How did it feel?', 12, 700) + 18;
      out += T(M, BOTTOM + 30, 'How did it feel?', { s: 12, w: 700 });
      ['I could explain it', 'One more go', 'I need help'].forEach(function (f) { out += '<circle cx="' + (fx + 5) + '" cy="' + (BOTTOM + 26) + '" r="5" fill="none" stroke="' + INK2 + '" stroke-width=".9"/>' + T(fx + 15, BOTTOM + 30, f, { s: 11.5, f: INK2 }); fx += tw(f, 11.5) + 34; });
    }
    out += T(M, 774, ('Math Atlas · Grade ' + A.grade + ' · ' + th.name).toUpperCase(), { s: 8, w: 700, f: INK2, ls: 1 }) + T(RIGHT, 774, code, { s: 8, w: 700, f: INK2, a: 'end', ls: 1 });
    return '<svg class="ws-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(title + ', ' + kd[1] + (key ? ', answer key' : '')) + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="#fff"/>' + out + '</svg>';
  };
  /* every sheet of a chapter, for the review page and the checks */
  S.list = function (chId) {
    var out = [];
    Object.keys(S.chapters[chId].ideas).forEach(function (slug) { KINDS.forEach(function (k) { if (S.chapters[chId].ideas[slug][k[0]]) out.push({ slug: slug, kind: k[0] }); }); });
    return out;
  };
  /* the questions of a sheet with the theme's words put in, for the answer checks */
  S.items = function (chId, slug, kind, themeId) {
    var sp = S.chapters[chId].ideas[slug][kind], th = S.themeById(themeId);
    var all = kind === 'learn' ? sp.together.concat(sp.own) : sp.items;
    return { show: sp.show || null, items: all.map(function (it) { var c = JSON.parse(JSON.stringify(it)); ['q', 'calc'].forEach(function (f) { if (c[f]) c[f] = words(c[f], th); }); if (c.eq) c.eq = c.eq.map(function (r) { return words(r, th); }); return c; }) };
  };

  /* the fonts a sheet is drawn in, so the page can wait for them (and the checks can make sure they loaded) */
  S.fontList = function () {
    return ["400 14px 'Atkinson Hyperlegible'", "700 14px 'Atkinson Hyperlegible'", "italic 400 13px 'Atkinson Hyperlegible'"].concat(S.themes.map(function (t) { return '700 24px ' + t.font; }));
  };

  /* ---------- the Worksheets tab (grown-up view) ---------- */
  function pref(k, v) { try { if (v === undefined) return localStorage.getItem('atlas:sheet-' + k); localStorage.setItem('atlas:sheet-' + k, v); } catch (e) { return null; } return v; }
  function fonts() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var wait = Promise.all(S.fontList().map(function (f) { return document.fonts.load(f).catch(function () {}); }));
    return Promise.race([wait, new Promise(function (r) { setTimeout(r, 1500); })]);
  }
  function chips(th) {
    return '<div class="ws-themes" role="radiogroup" aria-label="Theme">' + S.themes.map(function (t) {
      return '<button type="button" role="radio" class="ws-chip" data-th="' + t.id + '" aria-checked="' + (t.id === th.id) + '"><svg viewBox="0 0 56 56" aria-hidden="true">' + t.art + '</svg>' + t.name + '</button>';
    }).join('') + '</div>';
  }
  function keyToggle() {
    var on = pref('key') !== '0';
    return '<label class="ws-key"><input type="checkbox" id="ws-key"' + (on ? ' checked' : '') + '> Answer key as page 2</label>';
  }
  function wire(app, redraw) {
    app.querySelectorAll('.ws-chip').forEach(function (b) { b.addEventListener('click', function () { pref('theme', b.getAttribute('data-th')); redraw(); }); });
    var k = $('#ws-key', app);
    if (k) k.addEventListener('change', function () { pref('key', k.checked ? '1' : '0'); redraw(); });
  }
  S.view = function (app, chId, rest, head) {
    var th = S.themeById(pref('theme')), d = S.chapters[chId], base = '#' + chId + '/sheets';
    var redraw = function () { S.view(app, chId, rest, head); };
    document.documentElement.classList.toggle('ws-on', !!rest[0] && rest[0] !== 'all');
    if (rest[0] && rest[0] !== 'all' && d.ideas[rest[0]]) return preview(app, chId, rest[0], rest[1] || 'learn', th, head, redraw);
    if (rest[0] === 'all') {
      app.innerHTML = head + '<div class="ws-ui"><p class="ws-lede">Every sheet in this chapter, in one theme. Tap a sheet to open it.</p>' + chips(th) + '<p><a href="' + base + '">Back to worksheets</a></p></div><div class="ws-all" id="ws-all"></div></div>';
      wire(app, redraw);
      return fonts().then(function () {
        $('#ws-all', app).innerHTML = S.list(chId).map(function (s) {
          return '<a class="ws-thumb" href="' + base + '/' + s.slug + '/' + s.kind + '">' + S.page(chId, s.slug, s.kind, th.id) + '<span>' + plain(concept(chId, s.slug).title) + ' · ' + KINDS.filter(function (k) { return k[0] === s.kind; })[0][1] + '</span></a>';
        }).join('');
      });
    }
    var h = head + '<div class="ws-ui"><p class="ws-lede">Print a sheet for one idea. Learn teaches it step by step, Practise 1 to 3 go from more help to less, and Think asks for reasoning. The level is only in the sheet number, never on the page.</p>' +
      chips(th) + keyToggle() + '<p><a href="' + base + '/all">See every sheet at once</a></p></div>';
    A.chapters[chId].lessons.forEach(function (ls) {
      var rows = ls.concepts.filter(function (c) { return d.ideas[c.slug]; });
      if (!rows.length) return;
      h += '<section class="ws-lesson"><h2>' + ls.title + '</h2><ul class="ws-list">' + rows.map(function (c) {
        return '<li><span class="ws-idea">' + c.title + '</span><span class="ws-kinds">' + KINDS.filter(function (k) { return d.ideas[c.slug][k[0]]; }).map(function (k) {
          return '<a class="ws-k" href="' + base + '/' + c.slug + '/' + k[0] + '">' + k[1] + '</a>';
        }).join('') + '</span></li>';
      }).join('') + '</ul></section>';
    });
    app.innerHTML = h + '</div>';
    wire(app, redraw);
  };
  function preview(app, chId, slug, kind, th, head, redraw) {
    var d = S.chapters[chId], c = concept(chId, slug), base = '#' + chId + '/sheets', key = pref('key') !== '0';
    var tabs = KINDS.filter(function (k) { return d.ideas[slug][k[0]]; }).map(function (k) {
      return '<a class="ws-k" href="' + base + '/' + slug + '/' + k[0] + '"' + (k[0] === kind ? ' aria-current="page"' : '') + '>' + k[1] + '</a>';
    }).join('');
    app.innerHTML = head + '<div class="ws-ui"><p class="crumb"><a href="' + base + '">All worksheets</a></p><h2 class="ws-title">' + c.title + '</h2>' +
      '<div class="ws-kinds">' + tabs + '</div>' + chips(th) + keyToggle() +
      '<p><button type="button" class="btn" id="ws-print">Print or save as PDF</button></p><p class="ws-tip">On an iPad, choose Print, then Share, then Save to Files to keep a PDF.</p></div>' +
      '<div class="ws-pages" id="ws-pages"></div></div>';
    wire(app, redraw);
    $('#ws-print', app).addEventListener('click', function () { window.print(); });
    return fonts().then(function () {
      $('#ws-pages', app).innerHTML = '<div class="ws-sheet">' + S.page(chId, slug, kind, th.id) + '</div>' + (key ? '<div class="ws-sheet ws-keypage">' + S.page(chId, slug, kind, th.id, true) + '</div>' : '');
    });
  }
})();
