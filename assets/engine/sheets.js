/* Math Atlas worksheets: printable sheets for every idea of a chapter, shared by every grade.
   Needs site.js (Atlas) and lesson.js (Atlas.lessons). The themes are in sheet-themes.js. Each grade's
   sheets/<chapter>.js holds that chapter's written questions:

     Atlas.sheets.register('multiply-divide', { code: 'MD', ideas: { <idea slug>: idea, ... } });
     idea = { watch: 'what to watch for (answer key only)',
              learn:  { show, together: [item, item], cue: 'thinking cue', own: [item x 4] },
              p1: { show, items: [item x 6] }, p2: { show, items }, p3: { items },   (practise at 3 levels)
              think: { items: [item x 4 to 6] } }
     show = { pic, cap, eq: ['4 + 4 + 4 = 12', '3 × 4 = 12'] }   the "Watch me" (learn) or "Remember" band
     item = { q: 'words, with theme words like {a} {many}', pic: ['groups' | 'array' | 'line' | 'share' | 'table', options],
              eq: ['[] × [] = []', ...], a: [answers for every [] in eq, in order], pick: { opts: [...], ans: index },
              draw: { h, key: pic or 'words' }, lines: { n, key: 'a good answer' }, wide: true (both columns),
              calc: '4 × 5' (a story's sum, for the answer check), tf: '3 × 6 = 6 × 3' (the statement a true/false pick is about) }
   Theme words: {a} and {b} (two names), {one} and {many} (the things), {cont} and {conts} (what holds them).
   Every theme uses the same numbers and layout, so no theme is harder than another.

   A sheet is drawn as one Letter page (612 x 792 points) in SVG, so it prints exactly as it looks on screen.
   Its answer key is the same page with the answers in red, a "watch for" note and the Ontario codes.
   Sheet numbers (G3-MD-07-P2-RK) name the grade, chapter, idea, kind and theme, so a sheet always prints the same.
   The answer checks are in tests/verify/sheets.js; tests/run.js draws every sheet in every theme and checks it fits. */
(function () {
  'use strict';
  var A = window.Atlas;
  if (!A || !A.lessons) return;
  var $ = A.$;
  var S = (A.sheets = { chapters: {}, themes: [], overflow: [] });
  var W = 612, H = 792, M = 40, RIGHT = W - M, BOTTOM = 690, COLW = 254, GAP = 24, PAD = 32;
  var CUR = { th: null, plain: false }; /* the theme being drawn, and whether counting pictures use plain dots */
  var INK = '#132039', INK2 = '#55627a', LINE = '#cdd5e1', KEY = '#b4283f', NOTE = '#fdf6dd';
  var FONT = "'Atkinson Hyperlegible', system-ui, sans-serif", DISPLAY = "'Bricolage Grotesque', system-ui, sans-serif";
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
  function wrap(s, size, width) {
    var lines = [], cur = '';
    String(s).split(' ').forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (cur && tw(t, size) > width) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function T(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-family="' + (o.fam || (o.d ? DISPLAY : FONT)) + '" font-size="' + (o.s || 14) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.f || INK) + '"' +
      (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.i ? ' font-style="italic"' : '') + (o.ls ? ' letter-spacing="' + o.ls + '"' : '') + (o.c ? ' class="' + o.c + '"' : '') + '>' + esc(s) + '</text>';
  }
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
    var max = p.max, u = (w - 16) / max, x0 = x + 6, ly = y + 34, out = '', lab = p.labels || p.step;
    out += '<line x1="' + x0 + '" y1="' + ly + '" x2="' + (x0 + max * u) + '" y2="' + ly + '" stroke="' + INK + '" stroke-width="1.3"/>';
    var tick = max > 50 ? 10 : max > 30 ? 5 : 1;
    for (var t = 0; t <= max; t += tick) {
      var big = t % lab === 0;
      out += '<line x1="' + (x0 + t * u) + '" y1="' + (ly - (big ? 6 : 4)) + '" x2="' + (x0 + t * u) + '" y2="' + (ly + (big ? 6 : 4)) + '" stroke="' + INK + '" stroke-width="1"/>';
      if (big) out += T(x0 + t * u, ly + 19, t, { s: 10, f: INK2, a: 'middle' });
    }
    for (var j = 0; j < (p.n || 0); j++) {
      var a = x0 + j * p.step * u, b = x0 + (j + 1) * p.step * u;
      out += '<path class="jump" d="M' + a + ' ' + (ly - 2) + ' Q' + (a + b) / 2 + ' ' + (ly - 30) + ' ' + b + ' ' + (ly - 2) + '" fill="none" stroke="' + INK2 + '" stroke-width="1.4"/>';
    }
    return { svg: out, h: 58, w: w };
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
    var cw = Math.min(100, w / 2), rh = 30, out = '', k = 0;
    p.head.forEach(function (hd, c) { out += T(x + c * cw + cw / 2, y + 18, words(hd, th), { s: 12, w: 700, f: INK2, a: 'middle' }); });
    p.rows.forEach(function (row, r) {
      var ry = y + 26 + r * rh;
      out += '<line x1="' + x + '" y1="' + ry + '" x2="' + (x + cw * 2) + '" y2="' + ry + '" stroke="' + LINE + '" stroke-width="1"/>';
      row.forEach(function (v, c) {
        var cx = x + c * cw + cw / 2;
        if (v === '[]') { out += '<rect x="' + (cx - 20) + '" y="' + (ry + 3) + '" width="40" height="24" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="1.2"/>'; if (key) out += T(cx, ry + 20, ans[k], { s: 15, w: 700, f: KEY, a: 'middle' }); k++; }
        else out += T(cx, ry + 20, v, { s: 15, w: 700, a: 'middle' });
      });
    });
    out += '<line x1="' + (x + cw) + '" y1="' + (y + 4) + '" x2="' + (x + cw) + '" y2="' + (y + 26 + p.rows.length * rh) + '" stroke="' + LINE + '" stroke-width="1"/>';
    return { svg: out, h: 26 + p.rows.length * rh, w: cw * 2, used: k };
  };
  function pic(spec, x, y, w, key, th, ans) { return PIC[spec[0]](spec[1], x, y, w, key, th, ans); }

  /* one row of an equation: numbers, symbols and words; [] is a box to write in */
  function eqRow(s, x, y, key, ans, size) {
    var out = '', cx = x, k = 0, big = size || 17;
    s.split(' ').forEach(function (tok) {
      var comma = tok === '[],';
      if (comma) tok = '[]';
      if (tok === '[]') {
        out += '<rect x="' + cx + '" y="' + y + '" width="38" height="30" rx="5" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>';
        if (key) out += T(cx + 19, y + 21, ans[k], { s: big, w: 700, f: KEY, a: 'middle' });
        k++; cx += 45;
        if (comma) { out += T(cx - 5, y + 21, ',', { s: big, w: 700 }); cx += 6; }
      } else if (/^[\d,]+$/.test(tok)) { out += T(cx, y + 21, tok, { s: big, w: 700 }); cx += tw(tok, big, 700) + 8; }
      else { out += T(cx, y + 21, tok, { s: 15, f: INK2 }); cx += tw(tok, 15) + 8; }
    });
    return { svg: out, w: cx - 8 - x, used: k };
  }

  /* ---------- one question, drawn in a cell of width w; returns { svg, h } ---------- */
  function item(it, n, x, y, w, key, th) {
    var out = '', cy = y, iw = w - PAD, ix = x + PAD, ans = (it.a || []).slice(), ai = 0;
    out += th.badge ? th.badge(x + 11, y + 11, n) : '<circle cx="' + (x + 11) + '" cy="' + (y + 11) + '" r="11" fill="' + th.acc + '"/>' + T(x + 11, y + 16, n, { s: 12, w: 700, f: '#fff', a: 'middle' });
    if (it.q) { wrap(words(it.q, th), 14, iw).forEach(function (l) { out += T(ix, cy + 16, l); cy += 19; }); cy += 6; }
    else cy += 0;
    if (it.pic) {
      var p = pic(it.pic, ix, cy + (it.q ? 0 : 2), iw, key, th, it.pic[0] === 'table' ? ans : null);
      out += '<g class="pic">' + p.svg + '</g>';
      if (p.used) { ans = ans.slice(p.used); }
      cy += p.h + 12;
    }
    function pick() {
      var px = ix;
      it.pick.opts.forEach(function (o, i) {
        var ow = tw(words(o, th), 16, 700);
        if (key && i === it.pick.ans) out += '<ellipse cx="' + (px + ow / 2) + '" cy="' + (cy + 15) + '" rx="' + (ow / 2 + 11) + '" ry="14" fill="none" stroke="' + KEY + '" stroke-width="1.8"/>';
        out += T(px, cy + 21, words(o, th), { s: 16, w: 700 });
        px += ow + 34;
      });
      cy += 38;
    }
    if (it.pick && !it.pickLast) pick();
    if (it.draw) {
      var dh = it.draw.h || 80;
      out += '<rect x="' + ix + '" y="' + cy + '" width="' + Math.min(iw, 230) + '" height="' + dh + '" rx="8" fill="none" stroke="' + LINE + '" stroke-width="1.2" stroke-dasharray="5 4"/>';
      if (key && it.draw.key) {
        if (typeof it.draw.key === 'string') wrap(words(it.draw.key, th), 12, Math.min(iw, 230) - 16).forEach(function (l, i) { out += T(ix + 8, cy + 20 + i * 16, l, { s: 12, f: KEY }); });
        else out += '<g opacity=".9">' + pic(it.draw.key, ix + 8, cy + 8, Math.min(iw, 230) - 16, true, th).svg.replace(/fill="#132039"/g, 'fill="' + KEY + '"') + '</g>';
      }
      cy += dh + 10;
    }
    var cols = it.cols || 1, cw = iw / cols, per = Math.ceil((it.eq || []).length / cols);
    (it.eq || []).forEach(function (row, i) {
      var c = Math.floor(i / per), r = eqRow(words(row, th), ix + c * cw, cy + (i % per) * 38, key, ans.slice(ai));
      out += r.svg; ai += r.used;
      if (r.w > cw - (cols > 1 ? 12 : 0)) S.overflow.push('a sum is too wide: ' + row);
    });
    cy += per * 38;
    if (it.pick && it.pickLast) pick();
    if (it.lines) {
      cy += 8;
      for (var i = 0; i < it.lines.n; i++) out += '<line x1="' + ix + '" y1="' + (cy + 18 + i * 28) + '" x2="' + (ix + iw - 6) + '" y2="' + (cy + 18 + i * 28) + '" stroke="' + LINE + '" stroke-width="1.2"/>';
      if (key && it.lines.key) wrap(words(it.lines.key, th), 12, iw - 10).forEach(function (l, j) { out += T(ix + 2, cy + 14 + j * 28, l, { s: 12, f: KEY }); });
      cy += it.lines.n * 28 + 4;
    }
    var h = cy - y;
    return { svg: '<g class="it" data-n="' + n + '" data-x0="' + x + '" data-x1="' + (x + w) + '">' + (th.card ? th.card(x - 8, y - 10, w + 16, h + 16) : '') + out + '</g>', h: h };
  }

  /* questions in two columns; an item with wide: true takes the whole row */
  function grid(list, y, n0, key, th) {
    var out = '', n = n0, i = 0;
    while (i < list.length) {
      var row = list[i].wide ? [list[i]] : [list[i]].concat(list[i + 1] && !list[i + 1].wide ? [list[i + 1]] : []);
      var hs = row.map(function (it, c) { var r = item(it, n + c, M + c * (COLW + GAP), y, row.length === 1 && it.wide ? RIGHT - M : COLW, key, th); out += r.svg; return r.h; });
      n += row.length; i += row.length;
      y += Math.max.apply(null, hs) + (th.card ? 30 : 22);
    }
    return { svg: out, y: y, n: n };
  }
  function section(y, label, th) {
    if (th.section) return th.section(y, label, M, RIGHT);
    var lw = tw(label.toUpperCase(), 11, 700, DISPLAY) + label.length * 1.4;
    return T(M, y, label.toUpperCase(), { s: 11, w: 700, f: th.acc, ls: 1.4, d: 1 }) + '<line x1="' + (M + lw + 10) + '" y1="' + (y - 4) + '" x2="' + RIGHT + '" y2="' + (y - 4) + '" stroke="' + LINE + '" stroke-width="1"/>';
  }
  /* the Watch me / Remember band: picture on the left, the sum on the right */
  function band(show, y, th) {
    var p = show.pic ? pic(show.pic, M + 22, y + 18, 250) : { svg: '', h: 0, w: 0 };
    var tx = p.w ? Math.max(M + 22 + p.w + 36, 300) : M + 24, lines = (show.eq || []), hText = (show.cap ? 24 : 0) + lines.length * 32;
    var h = Math.max(p.h, hText) + 30, out = (th.band ? th.band(M, y, RIGHT - M, h) : '<rect x="' + M + '" y="' + y + '" width="' + (RIGHT - M) + '" height="' + h + '" rx="12" fill="' + th.tint + '"/>') + '<g class="show">' + p.svg + '</g>';
    var ty = y + h / 2 - hText / 2;
    if (show.cap) { out += T(tx, ty + 14, words(show.cap, th), { s: 14, f: INK2 }); ty += 24; }
    lines.forEach(function (l, i) { var last = i === lines.length - 1; out += T(tx, ty + 24, l, { s: last ? 26 : 19, w: last ? 800 : 700, d: last ? 1 : 0, c: 'showeq', fam: last ? th.font : null }); ty += 32; });
    lines.forEach(function (l, i) { var last = i === lines.length - 1; if (tx + tw(l, last ? 26 : 19, last ? 800 : 700, last ? th.font || DISPLAY : FONT) > RIGHT - 8) S.overflow.push('the band is too wide: ' + l); });
    return { svg: out, h: h };
  }

  /* ---------- a whole page ---------- */
  function nameDate(x, y, right, colour) {
    return T(x, y, 'Name', { s: 11, f: colour || INK2 }) + '<line x1="' + (x + 34) + '" y1="' + (y + 2) + '" x2="' + right + '" y2="' + (y + 2) + '" stroke="' + (colour || INK2) + '" stroke-width="1"/>' +
      T(x, y + 26, 'Date', { s: 11, f: colour || INK2 }) + '<line x1="' + (x + 34) + '" y1="' + (y + 28) + '" x2="' + right + '" y2="' + (y + 28) + '" stroke="' + (colour || INK2) + '" stroke-width="1"/>';
  }
  S.nameDate = nameDate;
  S.T = T;
  S.tw = tw;
  function defaultHead(hd, th) {
    var size = hd.fit(hd.title, hd.key ? 420 : 300, 24);
    return '<g transform="translate(' + M + ' 34)">' + th.art + '</g>' + T(M + 70, 60, hd.title, { s: size, w: 800, d: 1 }) + T(M + 70, 82, hd.sub, { s: 13, f: INK2 }) +
      (hd.key ? '' : nameDate(392, 58, RIGHT)) + '<line x1="' + M + '" y1="104" x2="' + RIGHT + '" y2="104" stroke="' + INK + '" stroke-width="1.5"/>';
  }
  function concept(chId, slug) { return A.lessons.flat(chId).filter(function (c) { return c.slug === slug; })[0]; }
  S.code = function (chId, slug, kind, th) {
    var d = S.chapters[chId], ideas = Object.keys(d.ideas), kd = KINDS.filter(function (k) { return k[0] === kind; })[0];
    return 'G' + A.grade + '-' + d.code + '-' + ('0' + (ideas.indexOf(slug) + 1)).slice(-2) + '-' + kd[2] + '-' + th.id;
  };
  S.themeById = function (id) { return S.themes.filter(function (t) { return t.id === id; })[0] || S.themes[0]; };
  S.page = function (chId, slug, kind, themeId, key) {
    var d = S.chapters[chId], idea = d.ideas[slug], spec = idea[kind], c = concept(chId, slug), th = S.themeById(themeId);
    var m = A.meta.filter(function (x) { return x.id === chId; })[0], code = S.code(chId, slug, kind, th), kd = KINDS.filter(function (k) { return k[0] === kind; })[0];
    var title = plain(c.title), out = '', y, n = 1;
    CUR.th = th; CUR.plain = kind === 'p3' || kind === 'think';
    var head = { title: key ? 'Answer key: ' + title : title, sub: key ? th.name + ' \u00b7 ' + kd[1] + ' \u00b7 for grown-ups' : th.name, key: !!key, M: M, RIGHT: RIGHT,
      fit: function (s, max, size, family, weight) { while (tw(s, size, weight || 800, family || DISPLAY) > max && size > 14) size--; return size; } };
    if (th.frame) out += th.frame(W, H, M, RIGHT);
    out += th.head ? th.head(head) : defaultHead(head, th);
    y = 134;
    if (kind === 'learn') {
      out += section(y, 'Watch me', th); var b = band(spec.show, y + 12, th); out += b.svg; y += b.h + 38;
      out += section(y, 'Together', th); var g1 = grid(spec.together, y + 16, n, key, th); out += g1.svg; y = g1.y - 8; n = g1.n;
      if (spec.cue) { out += T(M, y, words(spec.cue, th), { s: 12, i: 1, f: INK2 }); y += 34; }
      out += section(y, 'On your own', th); var g2 = grid(spec.own, y + 16, n, key, th); out += g2.svg; y = g2.y; n = g2.n;
    } else {
      if (spec.show) { out += section(y, 'Remember', th); var b2 = band(spec.show, y + 12, th); out += b2.svg; y += b2.h + 38; out += section(y, 'On your own', th); y += 16; }
      var g3 = grid(spec.items, y, n, key, th); out += g3.svg; y = g3.y; n = g3.n;
    }
    if (y - 22 > BOTTOM) S.overflow.push(code + ' runs ' + Math.round(y - 22 - BOTTOM) + ' points past the bottom');
    if (key) {
      var note = wrap('Watch for: ' + idea.watch, 11, RIGHT - M - 28);
      var codes = 'Ontario ' + c.exp.join(', ');
      out += '<rect x="' + M + '" y="' + (BOTTOM + 6) + '" width="' + (RIGHT - M) + '" height="' + (note.length * 15 + 28) + '" rx="8" fill="' + NOTE + '"/>';
      note.forEach(function (l, i) { out += T(M + 14, BOTTOM + 24 + i * 15, l, { s: 11 }); });
      out += T(M + 14, BOTTOM + 24 + note.length * 15, codes, { s: 11, w: 700 });
      if (note.length > 2) S.overflow.push(code + ' has a watch-for note longer than 2 lines');
    }
    out += '<line x1="' + M + '" y1="752" x2="' + RIGHT + '" y2="752" stroke="' + LINE + '" stroke-width="1"/>' +
      T(M, 768, 'Math Atlas · Grade ' + A.grade + ' · ' + plain(m.title), { s: 9, f: INK2 }) +
      T(RIGHT, 768, code + (key ? ' · score ____ of ' + (n - 1) : ''), { s: 9, f: INK2, a: 'end' });
    return '<svg class="ws-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(title + ', ' + kd[1] + (key ? ', answer key' : '')) + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="' + (th.paper || '#fff') + '"/>' + out + '</svg>';
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

  /* ---------- the Worksheets tab (grown-up view) ---------- */
  function pref(k, v) { try { if (v === undefined) return localStorage.getItem('atlas:sheet-' + k); localStorage.setItem('atlas:sheet-' + k, v); } catch (e) { return null; } return v; }
  function fonts() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var wait = Promise.all(["400 14px 'Atkinson Hyperlegible'", "700 14px 'Atkinson Hyperlegible'", "800 24px 'Bricolage Grotesque'"].concat(S.themes.map(function (t) { return t.font ? '800 24px ' + t.font : null; }).filter(Boolean)).map(function (f) { return document.fonts.load(f).catch(function () {}); }));
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
