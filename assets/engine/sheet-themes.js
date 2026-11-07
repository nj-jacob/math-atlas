/* Math Atlas worksheet themes, shared by every grade. Needs sheets.js first.
   A theme gives a sheet its own look: page frame, heading, section names, question numbers, cards, the box around
   "Watch me", the things to count (pucks, jars, stars, muffins ...) and what holds them (bags, crates ...), and its
   own display font (loaded in sheets.css). The numbers and questions stay the same, so no theme is harder than another.
   Practise 3 and Think draw plain dots instead of the theme's things, to move from pictures to numbers.
   House style (Noel): the paper is always white and colour is light. Themes differ by line art, layout and font,
   drawn as thin outlines in one accent colour, never as large filled areas.

   Words: a and b (two names), one and many (the things), cont and conts (what holds them). Every story is written
   so that "puts 5 {many} in each of 4 {conts}" and "4 rows of 5 {many}" read well in every theme.
   id: two letters, used in the sheet number. art: the theme's small picture (56 x 56) for the theme buttons.
   Optional drawing hooks (each returns SVG): frame(W, H, M, RIGHT), head(h), section(y, label, M, RIGHT), band(x, y, w, h),
   card(x, y, w, h), badge(cx, cy, n), glyph(cx, cy, r), holder(x, y, w, h). Without them a theme uses the plain look. */
(function () {
  'use strict';
  var S = window.Atlas && Atlas.sheets;
  if (!S) return;
  var T = S.T, INK = '#132039';
  function disc(tint) { return '<circle cx="28" cy="28" r="27" fill="' + tint + '"/>'; }
  /* a five-point star: filled when fill is a colour, an outline when stroke is given */
  function star(cx, cy, r, fill, stroke, sw) {
    var p = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push((cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1)); }
    return '<path d="M' + p.join(' L') + ' Z" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 1.2) + '" stroke-linejoin="round"' : '') + '/>';
  }
  /* a maple leaf, outlined */
  function leaf(cx, cy, s, stroke, rot, fill) {
    var pts = [[0, -20], [4, -10], [10, -13], [8, -3], [16, -6], [13, 2], [18, 4], [8, 8], [9, 12], [1, 9], [1, 20], [-1, 20], [-1, 9], [-9, 12], [-8, 8], [-18, 4], [-13, 2], [-16, -6], [-8, -3], [-10, -13], [-4, -10]];
    return '<path transform="translate(' + cx + ' ' + cy + ') rotate(' + (rot || 0) + ') scale(' + s + ')" d="M' + pts.map(function (p) { return p.join(' '); }).join(' L') + ' Z" fill="' + (fill || 'none') + '" stroke="' + stroke + '" stroke-width="' + (1.3 / s).toFixed(2) + '" stroke-linejoin="round"/>';
  }

  /* ---------- At the rink: a rink outline, a scoreboard heading, pucks ---------- */
  var RK = { blue: '#2f62c4', red: '#c8434a', font: "'Barlow Condensed', 'Arial Narrow', sans-serif" };
  S.theme({
    id: 'RK', name: 'At the rink', acc: RK.blue, tint: '#eef3fb', font: RK.font,
    w: { a: 'Ava', b: 'Liam', one: 'puck', many: 'pucks', cont: 'bag', conts: 'bags' },
    art: disc('#eef3fb') + '<path d="M17 11 L31 37 Q32 39 35 39 L46 39" fill="none" stroke="' + RK.blue + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="20" cy="42" rx="7" ry="3" fill="' + INK + '"/>',
    frame: function (W, H) {
      return '<rect x="16" y="14" width="' + (W - 32) + '" height="' + (H - 58) + '" rx="56" fill="none" stroke="' + RK.blue + '" stroke-width="1.5"/>' +
        '<line x1="16" y1="' + H / 2 + '" x2="' + (W - 16) + '" y2="' + H / 2 + '" stroke="' + RK.red + '" stroke-width="1" opacity=".25"/>' +
        '<circle cx="' + W / 2 + '" cy="' + H / 2 + '" r="46" fill="none" stroke="' + RK.blue + '" stroke-width="1" opacity=".18"/>';
    },
    head: function (h) {
      var size = h.fit(h.title.toUpperCase(), 340, 30, RK.font, 800);
      return '<rect x="' + h.M + '" y="30" width="' + (h.RIGHT - h.M) + '" height="58" rx="10" fill="none" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<rect x="' + (h.RIGHT - 118) + '" y="38" width="106" height="42" rx="6" fill="none" stroke="' + RK.red + '" stroke-width="1.3"/>' +
        T(h.RIGHT - 65, 66, h.key ? 'KEY' : 'GRADE ' + Atlas.grade, { s: 18, w: 800, f: RK.red, a: 'middle', fam: RK.font, ls: 2 }) +
        T(h.M + 18, 58 + size * 0.2, h.title.toUpperCase(), { s: size, w: 800, f: INK, fam: RK.font, ls: 0.5 }) +
        T(h.M + 18, 80, h.sub.toUpperCase(), { s: 11, w: 700, f: RK.blue, fam: RK.font, ls: 1.5 }) +
        (h.key ? '' : T(h.M, 112, 'Name', { s: 11, f: '#55627a' }) + '<line x1="' + (h.M + 34) + '" y1="114" x2="330" y2="114" stroke="#55627a"/>' +
          T(352, 112, 'Date', { s: 11, f: '#55627a' }) + '<line x1="384" y1="114" x2="' + h.RIGHT + '" y2="114" stroke="#55627a"/>');
    },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label.toUpperCase(), 13, 800, RK.font) + 26;
      return '<rect x="' + M + '" y="' + (y - 15) + '" width="' + w + '" height="21" rx="10.5" fill="none" stroke="' + RK.blue + '" stroke-width="1.3"/>' +
        T(M + 13, y + 0.5, label.toUpperCase(), { s: 13, w: 800, f: RK.blue, fam: RK.font, ls: 1 }) +
        '<line x1="' + (M + w + 8) + '" y1="' + (y - 4.5) + '" x2="' + RIGHT + '" y2="' + (y - 4.5) + '" stroke="' + RK.red + '" stroke-width="1" opacity=".6"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="22" fill="none" stroke="' + RK.blue + '" stroke-width="1.2"/>'; },
    badge: function (cx, cy, n) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="13" ry="10" fill="none" stroke="' + INK + '" stroke-width="1.4"/><path d="M' + (cx - 13) + ' ' + (cy + 1) + ' q13 6 26 0" fill="none" stroke="' + INK + '" stroke-width="1"/>' + T(cx, cy + 3.5, n, { s: 13, w: 800, f: INK, a: 'middle', fam: RK.font }); },
    glyph: function (cx, cy, r) { return '<ellipse cx="' + cx + '" cy="' + (cy + r * 0.25) + '" rx="' + r * 1.15 + '" ry="' + r * 0.75 + '" fill="' + INK + '"/><ellipse cx="' + cx + '" cy="' + (cy - r * 0.05) + '" rx="' + r * 1.15 + '" ry="' + r * 0.62 + '" fill="#33415f"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="none" stroke="' + RK.blue + '" stroke-width="1.3"/><path d="M' + (x + w / 2 - 6) + ' ' + y + ' q6 -6 12 0" fill="none" stroke="' + RK.blue + '" stroke-width="1.3"/>'; }
  });

  /* ---------- At the sugar bush: outlined maple leaves, a serif heading, jars in crates ---------- */
  var SB = { brown: '#5a3410', amber: '#9a5a17', line: '#dcc7a6', font: "'Fraunces', Georgia, serif" };
  S.theme({
    id: 'SB', name: 'At the sugar bush', acc: SB.amber, tint: '#f6ece0', font: SB.font,
    w: { a: 'Noor', b: 'Kai', one: 'jar', many: 'jars', cont: 'crate', conts: 'crates' },
    art: disc('#f6ece0') + '<rect x="11" y="8" width="10" height="40" rx="3" fill="' + SB.amber + '"/><path d="M21 22 L28 24" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/><path d="M24 27 L40 27 L38 43 L26 43 Z" fill="none" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 13 Q35 18 32 20 Q29 18 32 13 Z" fill="' + SB.amber + '"/>',
    frame: function (W, H) {
      return leaf(W - 50, 44, 1.4, SB.amber, 18) + leaf(W - 96, 28, 0.85, SB.amber, -24);
    },
    head: function (h) {
      var size = h.fit(h.title, h.key ? 400 : 330, 32, SB.font, 800);
      return T(h.M, 66, h.title, { s: size, w: 800, f: SB.brown, fam: SB.font }) +
        T(h.M, 90, h.sub, { s: 14, i: 1, f: SB.amber, fam: SB.font }) +
        '<path d="M' + h.M + ' 106 q 12 -5 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0" fill="none" stroke="' + SB.amber + '" stroke-width="1.1"/>' +
        (h.key ? '' : S.nameDate(392, 128 - 70, h.RIGHT - 70, '#7a5a3a'));
    },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label, 16, 600, SB.font);
      return leaf(M + 7, y - 6, 0.38, SB.amber, 0) + T(M + 20, y, label, { s: 16, w: 600, i: 1, f: SB.brown, fam: SB.font }) +
        '<line x1="' + (M + 30 + w) + '" y1="' + (y - 5) + '" x2="' + RIGHT + '" y2="' + (y - 5) + '" stroke="' + SB.line + '" stroke-width="1.6" stroke-dasharray="1 5" stroke-linecap="round"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="none" stroke="' + SB.amber + '" stroke-width="1" stroke-dasharray="4 3"/>'; },
    card: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="none" stroke="' + SB.line + '" stroke-width="1.1"/>'; },
    badge: function (cx, cy, n) { return '<path d="M' + cx + ' ' + (cy - 14) + ' C' + (cx + 4) + ' ' + (cy - 7) + ' ' + (cx + 11) + ' ' + (cy - 1) + ' ' + (cx + 11) + ' ' + (cy + 4) + ' A11 11 0 0 1 ' + (cx - 11) + ' ' + (cy + 4) + ' C' + (cx - 11) + ' ' + (cy - 1) + ' ' + (cx - 4) + ' ' + (cy - 7) + ' ' + cx + ' ' + (cy - 14) + ' Z" fill="none" stroke="' + SB.amber + '" stroke-width="1.4"/>' + T(cx, cy + 8, n, { s: 13, w: 700, f: SB.brown, a: 'middle' }); },
    glyph: function (cx, cy, r) { return '<rect x="' + (cx - r * 0.8) + '" y="' + (cy - r * 0.55) + '" width="' + r * 1.6 + '" height="' + r * 1.6 + '" rx="' + r * 0.4 + '" fill="#f3dfbf" stroke="' + SB.brown + '" stroke-width="1.1"/><rect x="' + (cx - r * 0.65) + '" y="' + (cy - r * 1.05) + '" width="' + r * 1.3 + '" height="' + r * 0.5 + '" rx="1" fill="' + SB.brown + '"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="none" stroke="' + SB.amber + '" stroke-width="1.3"/><line x1="' + x + '" y1="' + (y + h - 4) + '" x2="' + (x + w) + '" y2="' + (y + h - 4) + '" stroke="' + SB.amber + '" stroke-width="1"/>'; }
  });

  /* ---------- At the planetarium: line-art stars and a moon, outlined round panels ---------- */
  var PL = { violet: '#4b45a1', line: '#d5d3ef', font: "'Exo 2', 'Trebuchet MS', sans-serif" };
  var SKY = [[400, 16, 2.5], [470, 13, 3], [540, 17, 2.5], [592, 48, 3], [592, 98, 2.5], [22, 40, 3]];
  S.theme({
    id: 'PL', name: 'At the planetarium', acc: PL.violet, tint: '#ebeaf7', font: PL.font,
    w: { a: 'Hana', b: 'Theo', one: 'star', many: 'stars', cont: 'row', conts: 'rows' },
    art: disc('#ebeaf7') + '<path d="M10 40 A18 18 0 0 1 46 40 Z" fill="' + PL.violet + '"/><rect x="8" y="40" width="40" height="4" rx="2" fill="' + INK + '"/>' + star(28, 27, 6, '#fff'),
    frame: function (W, H) {
      return SKY.map(function (s) { return star(s[0], s[1], s[2] * 1.6, null, PL.violet, 1); }).join('') +
        '<ellipse cx="' + (W - 40) + '" cy="' + (H - 50) + '" rx="130" ry="44" fill="none" stroke="' + PL.violet + '" stroke-width="1" opacity=".2" transform="rotate(-18 ' + (W - 40) + ' ' + (H - 50) + ')"/>';
    },
    head: function (h) {
      var size = h.fit(h.title, h.key ? 440 : 270, 28, PL.font, 800);
      return '<path d="M' + (h.M + 18) + ' 46 a16 16 0 1 0 14 22 a12 12 0 1 1 -14 -22 Z" fill="none" stroke="' + PL.violet + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        T(h.M + 50, 62, h.title, { s: size, w: 800, f: INK, fam: PL.font }) + T(h.M + 50, 84, h.sub, { s: 13, f: PL.violet, fam: PL.font }) +
        (h.key ? '' : '<rect x="384" y="30" width="' + (h.RIGHT - 384) + '" height="62" rx="31" fill="none" stroke="' + PL.line + '" stroke-width="1.4"/>' + S.nameDate(400, 54, h.RIGHT - 20)) +
        '<line x1="' + h.M + '" y1="106" x2="' + h.RIGHT + '" y2="106" stroke="' + PL.line + '" stroke-width="1.4" stroke-dasharray="2 5" stroke-linecap="round"/>';
    },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label.toUpperCase(), 12, 700, PL.font) + label.length * 2;
      return star(M + 7, y - 5, 7, null, PL.violet, 1.2) + T(M + 20, y, label.toUpperCase(), { s: 12, w: 700, f: PL.violet, fam: PL.font, ls: 2 }) +
        '<line x1="' + (M + 30 + w) + '" y1="' + (y - 5) + '" x2="' + RIGHT + '" y2="' + (y - 5) + '" stroke="' + PL.line + '" stroke-width="1.5" stroke-dasharray="2 5" stroke-linecap="round"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="16" fill="none" stroke="' + PL.line + '" stroke-width="1.4"/>' + star(x + w - 22, y + 18, 6, null, PL.violet, 1) + star(x + w - 40, y + 30, 3, null, PL.violet, 1); },
    card: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" fill="none" stroke="' + PL.line + '" stroke-width="1.2"/>'; },
    badge: function (cx, cy, n) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="16" ry="6" fill="none" stroke="' + PL.violet + '" stroke-width="1" transform="rotate(-20 ' + cx + ' ' + cy + ')"/><circle cx="' + cx + '" cy="' + cy + '" r="10.5" fill="#fff" stroke="' + PL.violet + '" stroke-width="1.3"/>' + T(cx, cy + 4.5, n, { s: 12, w: 700, f: PL.violet, a: 'middle', fam: PL.font }); },
    glyph: function (cx, cy, r) { return star(cx, cy, r * 1.45, '#e3e1f6', PL.violet, 1.1); },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" fill="none" stroke="' + PL.violet + '" stroke-width="1.1" stroke-dasharray="3 3"/>'; }
  });

  /* ---------- At the bakery: a scalloped edge, a recipe-card heading, muffins on trays ---------- */
  var BK = { rust: '#b4531a', deep: '#7a2e12', line: '#efd3c2', font: "'DM Serif Display', Georgia, serif" };
  function scallop(y, W, down) {
    var d = 'M0 ' + y;
    for (var x = 0; x < W; x += 16) d += ' q8 ' + (down ? 8 : -8) + ' 16 0';
    return '<path d="' + d + '" fill="none" stroke="' + BK.rust + '" stroke-width="1.1" opacity=".7"/>';
  }
  S.theme({
    id: 'BK', name: 'At the bakery', acc: BK.rust, tint: '#f9e9de', font: BK.font,
    w: { a: 'Zara', b: 'Mateo', one: 'muffin', many: 'muffins', cont: 'tray', conts: 'trays' },
    art: disc('#f9e9de') + '<rect x="9" y="38" width="38" height="4" rx="2" fill="' + INK + '"/><path d="M14 37 L16 29 L24 29 L26 37 Z M30 37 L32 29 L40 29 L42 37 Z" fill="' + BK.rust + '"/><path d="M14 29 Q20 20 26 29 Z M30 29 Q36 20 42 29 Z" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>',
    frame: function (W, H) { return scallop(10, W, true) + scallop(H - 10, W, false); },
    head: function (h) {
      var size = h.fit(h.title, h.key ? 400 : 300, 30, BK.font, 400);
      return '<rect x="' + h.M + '" y="30" width="' + (h.RIGHT - h.M) + '" height="80" rx="6" fill="none" stroke="' + BK.line + '" stroke-width="1.4"/>' +
        '<rect x="' + (h.M + 16) + '" y="22" width="92" height="18" rx="4" fill="#fff" stroke="' + BK.rust + '" stroke-width="1.1"/>' + T(h.M + 62, 35, h.key ? 'ANSWER KEY' : 'TODAY’S BAKE', { s: 9.5, w: 700, f: BK.rust, a: 'middle', ls: 1.2 }) +
        T(h.M + 18, 76, h.title, { s: size, w: 400, f: BK.deep, fam: BK.font }) + T(h.M + 18, 98, h.sub, { s: 12, f: BK.rust }) +
        (h.key ? '' : '<line x1="370" y1="42" x2="370" y2="100" stroke="' + BK.line + '" stroke-width="1.4"/>' + S.nameDate(384, 62, h.RIGHT - 14, BK.deep));
    },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label, 17, 400, BK.font);
      return T(M, y + 1, label, { s: 17, w: 400, f: BK.deep, fam: BK.font }) +
        '<line x1="' + (M + w + 12) + '" y1="' + (y - 5) + '" x2="' + RIGHT + '" y2="' + (y - 5) + '" stroke="' + BK.rust + '" stroke-width="2" stroke-dasharray="0.5 6" stroke-linecap="round"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="none" stroke="' + BK.line + '" stroke-width="1.3"/><line x1="' + (x + 1) + '" y1="' + (y + 1) + '" x2="' + (x + w - 1) + '" y2="' + (y + 1) + '" stroke="' + BK.rust + '" stroke-width="1.5"/>'; },
    card: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="none" stroke="' + BK.line + '" stroke-width="1.2"/><line x1="' + (x + 1) + '" y1="' + (y + 1) + '" x2="' + (x + w - 1) + '" y2="' + (y + 1) + '" stroke="' + BK.rust + '" stroke-width="1.2"/>'; },
    badge: function (cx, cy, n) { return '<rect x="' + (cx - 11) + '" y="' + (cy - 11) + '" width="22" height="22" rx="5" fill="none" stroke="' + BK.rust + '" stroke-width="1.4"/>' + T(cx, cy + 4.5, n, { s: 13, w: 700, f: BK.deep, a: 'middle' }); },
    glyph: function (cx, cy, r) { return '<path d="M' + (cx - r) + ' ' + cy + ' L' + (cx - r * 0.7) + ' ' + (cy + r) + ' L' + (cx + r * 0.7) + ' ' + (cy + r) + ' L' + (cx + r) + ' ' + cy + ' Z" fill="#f4dccb" stroke="' + BK.deep + '" stroke-width="1"/><path d="M' + (cx - r * 1.1) + ' ' + (cy + 0.5) + ' Q' + cx + ' ' + (cy - r * 1.6) + ' ' + (cx + r * 1.1) + ' ' + (cy + 0.5) + ' Z" fill="#fff" stroke="' + BK.deep + '" stroke-width="1"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="none" stroke="' + BK.deep + '" stroke-width="1.2"/><rect x="' + (x - 3) + '" y="' + (y + h / 2 - 3) + '" width="3" height="6" fill="' + BK.deep + '"/><rect x="' + (x + w) + '" y="' + (y + h / 2 - 3) + '" width="3" height="6" fill="' + BK.deep + '"/>'; }
  });

  /* a heading with the title on the left and Name and Date on the right; used by themes that only change its decoration */
  function simpleHead(h, font, weight, col, sub, x, y, max, noName) {
    var size = h.fit(h.title, h.key ? 440 : max || 300, 28, font, weight);
    return T(x || h.M, y || 62, h.title, { s: size, w: weight, f: col, fam: font }) + T(x || h.M, (y || 62) + 22, h.sub, { s: 13, f: sub, fam: font }) +
      (h.key || noName ? '' : S.nameDate(392, 56, h.RIGHT));
  }
  function sectionLine(y, label, M, RIGHT, o) {
    var txt = o.upper ? label.toUpperCase() : label, x = M + (o.icon ? 20 : 0), w = S.tw(txt, o.s, o.w, o.font) + (o.ls ? txt.length * o.ls : 0);
    return (o.icon ? o.icon(M + 7, y - 5) : '') + T(x, y, txt, { s: o.s, w: o.w, f: o.col, fam: o.font, ls: o.ls }) +
      '<line x1="' + (x + w + 10) + '" y1="' + (y - 5) + '" x2="' + RIGHT + '" y2="' + (y - 5) + '" stroke="' + o.line + '" stroke-width="1.2"' + (o.dash ? ' stroke-dasharray="' + o.dash + '" stroke-linecap="round"' : '') + '/>';
  }
  function wave(x0, x1, y, amp, len, col, sw) {
    var d = 'M' + x0 + ' ' + y;
    for (var x = x0; x + len <= x1 + 0.5; x += len) d += ' q' + len / 4 + ' ' + (-amp) + ' ' + len / 2 + ' 0 t' + len / 2 + ' 0';
    return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (sw || 1.2) + '" stroke-linecap="round"/>';
  }

  /* ---------- At the lake: waves, a buoy for each number, fish in nets ---------- */
  var LK = { teal: '#0b6e78', pale: '#d3e8ea', font: "'Josefin Sans', 'Trebuchet MS', sans-serif" };
  S.theme({
    id: 'LK', name: 'At the lake', acc: LK.teal, tint: '#e3f1f2', font: LK.font,
    w: { a: 'Mei', b: 'Arjun', one: 'fish', many: 'fish', cont: 'net', conts: 'nets' },
    art: disc('#e3f1f2') + '<path d="M8 30 Q28 44 48 30 Z" fill="' + LK.teal + '"/><path d="M33 11 L25 38" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/><path d="M10 45 Q15 42 20 45 T30 45 T40 45 T47 45" fill="none" stroke="' + LK.teal + '" stroke-width="2" stroke-linecap="round"/>',
    frame: function (W, H) { return wave(40, W - 40, H - 52, 3, 28, LK.pale, 1.2) + wave(54, W - 54, H - 46, 3, 28, LK.pale, 1.2); },
    head: function (h) { return simpleHead(h, LK.font, 700, INK, LK.teal) + wave(h.M, h.RIGHT, 104, 3, 24, LK.teal, 1.2); },
    section: function (y, label, M, RIGHT) { return sectionLine(y, label, M, RIGHT, { s: 13, w: 700, font: LK.font, col: LK.teal, line: LK.pale, upper: 1, ls: 1.2, icon: function (x, yy) { return wave(x - 7, x + 7, yy + 1, 3, 7, LK.teal, 1.4); } }); },
    band: function (x, y, w, h) { return wave(x, x + w, y + 2, 3, 24, LK.teal, 1.1) + wave(x, x + w, y + h - 2, 3, 24, LK.teal, 1.1); },
    badge: function (cx, cy, n) { return '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="none" stroke="' + LK.teal + '" stroke-width="1.4"/><path d="M' + (cx - 11) + ' ' + (cy + 4) + ' L' + (cx + 11) + ' ' + (cy + 4) + '" stroke="' + LK.teal + '" stroke-width="1"/>' + T(cx, cy + 2.5, n, { s: 11, w: 700, f: LK.teal, a: 'middle', fam: LK.font }); },
    glyph: function (cx, cy, r) { return '<path d="M' + (cx + r * 0.55) + ' ' + cy + ' L' + (cx + r * 1.2) + ' ' + (cy - r * 0.55) + ' L' + (cx + r * 1.2) + ' ' + (cy + r * 0.55) + ' Z" fill="' + LK.teal + '"/><ellipse cx="' + (cx - r * 0.15) + '" cy="' + cy + '" rx="' + r * 0.85 + '" ry="' + r * 0.6 + '" fill="#e3f1f2" stroke="' + LK.teal + '" stroke-width="1.1"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + Math.min(14, h / 2) + '" fill="none" stroke="' + LK.teal + '" stroke-width="1.3" stroke-dasharray="1 3" stroke-linecap="round"/><line x1="' + (x + w / 2) + '" y1="' + y + '" x2="' + (x + w / 2 + 6) + '" y2="' + (y - 7) + '" stroke="' + LK.teal + '" stroke-width="1.2"/>'; }
  });

  /* ---------- At the farmers' market: a striped awning, price tags, apples in baskets ---------- */
  var MK = { green: '#3d7f3a', pale: '#cfe3cc', red: '#b4283f', font: "'Kalam', 'Comic Sans MS', cursive" };
  S.theme({
    id: 'MK', name: "At the farmers' market", acc: MK.green, tint: '#e5f1e3', font: MK.font,
    w: { a: 'Amara', b: 'Owen', one: 'apple', many: 'apples', cont: 'basket', conts: 'baskets' },
    art: disc('#e5f1e3') + '<circle cx="21" cy="25" r="6" fill="' + MK.red + '"/><circle cx="33" cy="24" r="6" fill="' + MK.green + '"/><circle cx="27" cy="21" r="6" fill="' + MK.red + '"/><path d="M11 28 L45 28 L41 44 L15 44 Z" fill="#fff" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>',
    frame: function (W) {
      var d = 'M16 14 L' + (W - 16) + ' 14', out = '';
      for (var x = 16; x < W - 16; x += 36) { d += ' M' + x + ' 14 a18 12 0 0 0 36 0'; out += '<line x1="' + (x + 18) + '" y1="14" x2="' + (x + 18) + '" y2="26" stroke="' + MK.pale + '" stroke-width="1.2"/>'; }
      return out + '<path d="' + d + '" fill="none" stroke="' + MK.green + '" stroke-width="1.3"/>';
    },
    head: function (h) { return simpleHead(h, MK.font, 700, INK, MK.green, h.M, 68) + '<line x1="' + h.M + '" y1="106" x2="' + h.RIGHT + '" y2="106" stroke="' + MK.green + '" stroke-width="1.2"/>'; },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label, 16, 700, MK.font) + 30;
      return '<path d="M' + M + ' ' + (y - 6) + ' L' + (M + 10) + ' ' + (y - 17) + ' L' + (M + w) + ' ' + (y - 17) + ' L' + (M + w) + ' ' + (y + 5) + ' L' + (M + 10) + ' ' + (y + 5) + ' Z" fill="none" stroke="' + MK.green + '" stroke-width="1.3" stroke-linejoin="round"/><circle cx="' + (M + 10) + '" cy="' + (y - 6) + '" r="2.2" fill="none" stroke="' + MK.green + '" stroke-width="1.1"/>' +
        T(M + 18, y + 0.5, label, { s: 16, w: 700, f: MK.green, fam: MK.font }) + '<line x1="' + (M + w + 10) + '" y1="' + (y - 6) + '" x2="' + RIGHT + '" y2="' + (y - 6) + '" stroke="' + MK.pale + '" stroke-width="1.2"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="none" stroke="' + MK.green + '" stroke-width="1.1" stroke-dasharray="6 4"/>'; },
    badge: function (cx, cy, n) { return '<path d="M' + (cx - 13) + ' ' + cy + ' L' + (cx - 6) + ' ' + (cy - 10) + ' L' + (cx + 12) + ' ' + (cy - 10) + ' L' + (cx + 12) + ' ' + (cy + 10) + ' L' + (cx - 6) + ' ' + (cy + 10) + ' Z" fill="none" stroke="' + MK.green + '" stroke-width="1.3" stroke-linejoin="round"/>' + T(cx + 2, cy + 4.5, n, { s: 13, w: 700, f: MK.green, a: 'middle' }); },
    glyph: function (cx, cy, r) { return '<circle cx="' + cx + '" cy="' + (cy + r * 0.1) + '" r="' + r * 0.95 + '" fill="#f6dfe2" stroke="' + MK.red + '" stroke-width="1.1"/><path d="M' + cx + ' ' + (cy - r * 0.8) + ' l' + r * 0.25 + ' ' + (-r * 0.5) + '" stroke="' + INK + '" stroke-width="1"/><path d="M' + (cx + r * 0.2) + ' ' + (cy - r * 1.1) + ' q' + r * 0.5 + ' ' + (-r * 0.3) + ' ' + r * 0.7 + ' ' + r * 0.1 + ' q' + (-r * 0.4) + ' ' + r * 0.3 + ' ' + (-r * 0.7) + ' ' + (-r * 0.1) + ' Z" fill="' + MK.green + '"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="none" stroke="' + MK.green + '" stroke-width="1.3"/><path d="M' + (x + 8) + ' ' + y + ' Q' + (x + w / 2) + ' ' + (y - 12) + ' ' + (x + w - 8) + ' ' + y + '" fill="none" stroke="' + MK.green + '" stroke-width="1.2"/>'; }
  });

  /* ---------- In music class: a staff, note-head numbers, drums in boxes ---------- */
  var MU = { plum: '#a8326a', pale: '#ecd3df', font: "'Playfair Display', Georgia, serif" };
  function staff(x0, x1, y, col) { var o = ''; for (var i = 0; i < 5; i++) o += '<line x1="' + x0 + '" y1="' + (y + i * 4) + '" x2="' + x1 + '" y2="' + (y + i * 4) + '" stroke="' + col + '" stroke-width=".8"/>'; return o; }
  function note(x, y, col) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="4" ry="3" transform="rotate(-20 ' + x + ' ' + y + ')" fill="' + col + '"/><line x1="' + (x + 3.6) + '" y1="' + (y - 1) + '" x2="' + (x + 3.6) + '" y2="' + (y - 13) + '" stroke="' + col + '" stroke-width="1.1"/><path d="M' + (x + 3.6) + ' ' + (y - 13) + ' q4 3 4 8" fill="none" stroke="' + col + '" stroke-width="1.1"/>'; }
  S.theme({
    id: 'MU', name: 'In music class', acc: MU.plum, tint: '#f6e6ee', font: MU.font,
    w: { a: 'Leila', b: 'Lucas', one: 'drum', many: 'drums', cont: 'box', conts: 'boxes' },
    art: disc('#f6e6ee') + '<path d="M24 38 L24 14 L40 10 L40 34" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="20" cy="38" rx="5.5" ry="4.2" fill="' + MU.plum + '"/><ellipse cx="36" cy="34" rx="5.5" ry="4.2" fill="' + MU.plum + '"/>',
    frame: function (W, H) { return staff(40, W - 40, H - 66, MU.pale) + '<line x1="' + (W - 40) + '" y1="' + (H - 66) + '" x2="' + (W - 40) + '" y2="' + (H - 50) + '" stroke="' + MU.pale + '" stroke-width="2.5"/>'; },
    head: function (h) { return simpleHead(h, MU.font, 800, INK, MU.plum) + staff(h.M, h.RIGHT, 98, MU.pale) + note(h.RIGHT - 30, 106, MU.plum) + note(h.RIGHT - 16, 102, MU.plum); },
    section: function (y, label, M, RIGHT) { return sectionLine(y, label, M, RIGHT, { s: 16, w: 700, font: MU.font, col: MU.plum, line: MU.pale, icon: function (x, yy) { return note(x - 3, yy + 5, MU.plum); } }); },
    band: function (x, y, w, h) { return '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + h) + '" stroke="' + MU.plum + '" stroke-width="1.2"/><line x1="' + (x + w - 6) + '" y1="' + y + '" x2="' + (x + w - 6) + '" y2="' + (y + h) + '" stroke="' + MU.plum + '" stroke-width="1.2"/><line x1="' + (x + w) + '" y1="' + y + '" x2="' + (x + w) + '" y2="' + (y + h) + '" stroke="' + MU.plum + '" stroke-width="3"/>' +
      '<line x1="' + x + '" y1="' + y + '" x2="' + (x + w) + '" y2="' + y + '" stroke="' + MU.pale + '" stroke-width="1"/><line x1="' + x + '" y1="' + (y + h) + '" x2="' + (x + w) + '" y2="' + (y + h) + '" stroke="' + MU.pale + '" stroke-width="1"/>'; },
    badge: function (cx, cy, n) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="13" ry="9.5" transform="rotate(-20 ' + cx + ' ' + cy + ')" fill="none" stroke="' + MU.plum + '" stroke-width="1.4"/>' + T(cx, cy + 4.5, n, { s: 13, w: 700, f: MU.plum, a: 'middle', fam: MU.font }); },
    glyph: function (cx, cy, r) { var w = r * 0.95, t = cy - r * 0.55, b = cy + r * 0.75; return '<path d="M' + (cx - w) + ' ' + t + ' L' + (cx - w) + ' ' + b + ' A' + w + ' ' + r * 0.3 + ' 0 0 0 ' + (cx + w) + ' ' + b + ' L' + (cx + w) + ' ' + t + '" fill="#f6e6ee" stroke="' + MU.plum + '" stroke-width="1.1"/><ellipse cx="' + cx + '" cy="' + t + '" rx="' + w + '" ry="' + r * 0.3 + '" fill="#fff" stroke="' + MU.plum + '" stroke-width="1.1"/><path d="M' + (cx - w) + ' ' + (t + r * 0.4) + ' L' + (cx - w / 3) + ' ' + (b - r * 0.1) + ' L' + (cx + w / 3) + ' ' + (t + r * 0.4) + ' L' + (cx + w) + ' ' + (b - r * 0.1) + '" fill="none" stroke="' + MU.plum + '" stroke-width=".8"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="none" stroke="' + MU.plum + '" stroke-width="1.2"/><line x1="' + (x - 2) + '" y1="' + y + '" x2="' + (x + w + 2) + '" y2="' + y + '" stroke="' + MU.plum + '" stroke-width="2.2"/>'; }
  });

  /* ---------- In the garden: a vine, sprouts, seeds in pots ---------- */
  var GD = { green: '#5b7f22', pale: '#dbe6c7', soil: '#8a5a2b', font: "'Quicksand', 'Trebuchet MS', sans-serif" };
  function sprout(x, y, s, col) { return '<path d="M' + x + ' ' + y + ' L' + x + ' ' + (y - 9 * s) + '" stroke="' + col + '" stroke-width="1.2"/><path d="M' + x + ' ' + (y - 6 * s) + ' q' + (-6 * s) + ' ' + (-1 * s) + ' ' + (-7 * s) + ' ' + (-7 * s) + ' q' + (6 * s) + ' 0 ' + (7 * s) + ' ' + 7 * s + ' Z M' + x + ' ' + (y - 8 * s) + ' q' + (5 * s) + ' ' + (-5 * s) + ' ' + (8 * s) + ' ' + (-4 * s) + ' q' + (-2 * s) + ' ' + (5 * s) + ' ' + (-8 * s) + ' ' + (4 * s) + ' Z" fill="none" stroke="' + col + '" stroke-width="1.1" stroke-linejoin="round"/>'; }
  S.theme({
    id: 'GD', name: 'In the garden', acc: GD.green, tint: '#eef3e1', font: GD.font,
    w: { a: 'Sofia', b: 'Jayden', one: 'seed', many: 'seeds', cont: 'pot', conts: 'pots' },
    art: disc('#eef3e1') + '<path d="M18 32 L38 32 L35 46 L21 46 Z" fill="#b4531a"/><rect x="16" y="29" width="24" height="5" rx="2" fill="' + INK + '"/><path d="M28 29 L28 17" stroke="' + GD.green + '" stroke-width="2.6" stroke-linecap="round"/><path d="M28 21 Q20 20 19 12 Q27 13 28 21 Z M28 18 Q34 12 39 14 Q37 21 28 18 Z" fill="' + GD.green + '"/>',
    frame: function (W, H) { var o = '<line x1="40" y1="' + (H - 48) + '" x2="' + (W - 40) + '" y2="' + (H - 48) + '" stroke="' + GD.pale + '" stroke-width="1.2"/>'; for (var x = 70; x < W - 40; x += 120) o += sprout(x, H - 48, 1.3, GD.green); return o; },
    head: function (h) {
      var vine = '<path d="M' + h.M + ' 104 C' + (h.M + 80) + ' 94 ' + (h.M + 160) + ' 114 ' + (h.M + 260) + ' 104 S ' + (h.M + 440) + ' 94 ' + h.RIGHT + ' 104" fill="none" stroke="' + GD.green + '" stroke-width="1.2"/>', l = '';
      for (var i = 1; i < 6; i++) l += sprout(h.M + i * 88, 104 + (i % 2 ? 1 : -1), 0.8, GD.green);
      return simpleHead(h, GD.font, 700, INK, GD.green) + vine + l;
    },
    section: function (y, label, M, RIGHT) { return sectionLine(y, label, M, RIGHT, { s: 15, w: 700, font: GD.font, col: GD.green, line: GD.pale, dash: '6 4', icon: function (x, yy) { return sprout(x, yy + 7, 1, GD.green); } }); },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="18" fill="none" stroke="' + GD.green + '" stroke-width="1.1"/>' + sprout(x + w - 20, y + h - 6, 1.1, GD.green) + sprout(x + w - 34, y + h - 6, 0.8, GD.green); },
    badge: function (cx, cy, n) { return '<path d="M' + (cx - 11) + ' ' + (cy - 8) + ' L' + (cx + 11) + ' ' + (cy - 8) + ' L' + (cx + 8) + ' ' + (cy + 11) + ' L' + (cx - 8) + ' ' + (cy + 11) + ' Z" fill="none" stroke="' + GD.soil + '" stroke-width="1.3" stroke-linejoin="round"/><line x1="' + (cx - 13) + '" y1="' + (cy - 8) + '" x2="' + (cx + 13) + '" y2="' + (cy - 8) + '" stroke="' + GD.soil + '" stroke-width="2"/>' + T(cx, cy + 6.5, n, { s: 12, w: 700, f: GD.soil, a: 'middle', fam: GD.font }); },
    glyph: function (cx, cy, r) { return '<path d="M' + cx + ' ' + (cy - r * 1.05) + ' C' + (cx + r * 0.9) + ' ' + (cy - r * 0.3) + ' ' + (cx + r * 0.8) + ' ' + (cy + r * 0.9) + ' ' + cx + ' ' + (cy + r * 0.9) + ' C' + (cx - r * 0.8) + ' ' + (cy + r * 0.9) + ' ' + (cx - r * 0.9) + ' ' + (cy - r * 0.3) + ' ' + cx + ' ' + (cy - r * 1.05) + ' Z" fill="#eadcc6" stroke="' + GD.soil + '" stroke-width="1.1"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="none" stroke="' + GD.soil + '" stroke-width="1.2"/><line x1="' + (x - 3) + '" y1="' + y + '" x2="' + (x + w + 3) + '" y2="' + y + '" stroke="' + GD.soil + '" stroke-width="2.4"/>'; }
  });

  /* ---------- At the train yard: a track, wheel numbers, logs in rail cars ---------- */
  var TR = { slate: '#4a5a78', pale: '#d6dce6', font: "'Roboto Slab', Rockwell, serif" };
  function track(x0, x1, y, col) { var o = '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="' + col + '" stroke-width="1.2"/><line x1="' + x0 + '" y1="' + (y + 6) + '" x2="' + x1 + '" y2="' + (y + 6) + '" stroke="' + col + '" stroke-width="1.2"/>'; for (var x = x0 + 4; x < x1; x += 12) o += '<line x1="' + x + '" y1="' + (y - 2) + '" x2="' + x + '" y2="' + (y + 8) + '" stroke="' + col + '" stroke-width="1"/>'; return o; }
  S.theme({
    id: 'TR', name: 'At the train yard', acc: TR.slate, tint: '#e9edf3', font: TR.font,
    w: { a: 'Ethan', b: 'Chloe', one: 'log', many: 'logs', cont: 'car', conts: 'cars' },
    art: disc('#e9edf3') + '<rect x="11" y="22" width="34" height="14" rx="2" fill="' + TR.slate + '"/><circle cx="18" cy="38" r="4" fill="' + INK + '"/><circle cx="38" cy="38" r="4" fill="' + INK + '"/><path d="M8 44 L48 44" stroke="' + INK + '" stroke-width="2"/>',
    frame: function (W, H) { return track(40, W - 40, H - 56, TR.pale); },
    head: function (h) {
      return '<rect x="' + h.M + '" y="28" width="' + (h.RIGHT - h.M) + '" height="66" rx="4" fill="none" stroke="' + TR.slate + '" stroke-width="1.4"/>' +
        [h.M + 40, h.M + 76, h.RIGHT - 76, h.RIGHT - 40].map(function (x) { return '<circle cx="' + x + '" cy="100" r="7" fill="#fff" stroke="' + TR.slate + '" stroke-width="1.3"/>'; }).join('') +
        simpleHead(h, TR.font, 800, INK, TR.slate, h.M + 16, 60, 300, true) +
        (h.key ? '' : '<line x1="372" y1="36" x2="372" y2="86" stroke="' + TR.pale + '" stroke-width="1.2"/>' + S.nameDate(384, 54, h.RIGHT - 14));
    },
    section: function (y, label, M, RIGHT) { return sectionLine(y, label, M, RIGHT, { s: 13, w: 800, font: TR.font, col: TR.slate, line: TR.pale, upper: 1, ls: 1, dash: '10 3' }); },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="none" stroke="' + TR.slate + '" stroke-width="1.2"/><circle cx="' + (x + 30) + '" cy="' + (y + h) + '" r="6" fill="#fff" stroke="' + TR.slate + '" stroke-width="1.2"/><circle cx="' + (x + w - 30) + '" cy="' + (y + h) + '" r="6" fill="#fff" stroke="' + TR.slate + '" stroke-width="1.2"/>'; },
    badge: function (cx, cy, n) { return '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="none" stroke="' + TR.slate + '" stroke-width="1.4"/><circle cx="' + cx + '" cy="' + cy + '" r="8" fill="none" stroke="' + TR.pale + '" stroke-width="1"/>' + T(cx, cy + 4, n, { s: 11, w: 800, f: TR.slate, a: 'middle', fam: TR.font }); },
    glyph: function (cx, cy, r) { return '<rect x="' + (cx - r * 1.1) + '" y="' + (cy - r * 0.5) + '" width="' + r * 2.2 + '" height="' + r + '" rx="' + r * 0.5 + '" fill="#efe6da" stroke="#7a5a3a" stroke-width="1.1"/><circle cx="' + (cx + r * 0.6) + '" cy="' + cy + '" r="' + r * 0.25 + '" fill="none" stroke="#7a5a3a" stroke-width=".9"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="none" stroke="' + TR.slate + '" stroke-width="1.3"/><circle cx="' + (x + 8) + '" cy="' + (y + h + 2) + '" r="3" fill="#fff" stroke="' + TR.slate + '" stroke-width="1.1"/><circle cx="' + (x + w - 8) + '" cy="' + (y + h + 2) + '" r="3" fill="#fff" stroke="' + TR.slate + '" stroke-width="1.1"/>'; }
  });

  /* ---------- At the coast: a sun, a shoreline, shells in pails ---------- */
  var CO = { blue: '#1d6f96', pale: '#cfe2ec', sand: '#c79a4a', font: "'Comfortaa', 'Trebuchet MS', sans-serif" };
  function sun(cx, cy, r, col) { var o = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="1.3"/>'; for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; o += '<line x1="' + (cx + Math.cos(a) * (r + 3)).toFixed(1) + '" y1="' + (cy + Math.sin(a) * (r + 3)).toFixed(1) + '" x2="' + (cx + Math.cos(a) * (r + 7)).toFixed(1) + '" y2="' + (cy + Math.sin(a) * (r + 7)).toFixed(1) + '" stroke="' + col + '" stroke-width="1.2" stroke-linecap="round"/>'; } return o; }
  function shell(cx, cy, r, col, fill) { var o = '<path d="M' + (cx - r) + ' ' + (cy + r * 0.2) + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + (cy + r * 0.2) + ' L' + cx + ' ' + (cy + r * 0.9) + ' Z" fill="' + (fill || 'none') + '" stroke="' + col + '" stroke-width="1.1" stroke-linejoin="round"/>'; for (var i = -1; i <= 1; i++) o += '<line x1="' + cx + '" y1="' + (cy + r * 0.9) + '" x2="' + (cx + i * r * 0.55) + '" y2="' + (cy - r * 0.6) + '" stroke="' + col + '" stroke-width=".8"/>'; return o; }
  S.theme({
    id: 'CO', name: 'At the coast', acc: CO.blue, tint: '#e2eff6', font: CO.font,
    w: { a: 'Priya', b: 'Malik', one: 'shell', many: 'shells', cont: 'pail', conts: 'pails' },
    art: disc('#e2eff6') + '<path d="M17 24 L39 24 L36 42 L20 42 Z" fill="' + CO.blue + '"/><path d="M19 24 Q28 10 37 24" fill="none" stroke="' + INK + '" stroke-width="2.2"/><path d="M8 48 Q13 45 18 48 T28 48 T38 48 T48 48" fill="none" stroke="' + CO.blue + '" stroke-width="2" stroke-linecap="round"/>',
    frame: function (W, H) { return '<path d="M40 ' + (H - 50) + ' C' + W * 0.3 + ' ' + (H - 64) + ' ' + W * 0.6 + ' ' + (H - 40) + ' ' + (W - 40) + ' ' + (H - 54) + '" fill="none" stroke="' + CO.sand + '" stroke-width="1.1" opacity=".7"/>' + shell(W - 70, H - 64, 7, CO.sand); },
    head: function (h) { return sun(h.M + 18, 58, 11, CO.sand) + simpleHead(h, CO.font, 700, INK, CO.blue, h.M + 46, 62, h.key ? 400 : 280) + wave(h.M, h.RIGHT, 104, 2.5, 40, CO.blue, 1.1); },
    section: function (y, label, M, RIGHT) { return sectionLine(y, label, M, RIGHT, { s: 14, w: 700, font: CO.font, col: CO.blue, line: CO.pale, icon: function (x, yy) { return shell(x, yy - 2, 7, CO.blue); } }); },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="none" stroke="' + CO.pale + '" stroke-width="1.3"/>' + wave(x + 14, x + w - 14, y + h - 8, 2.5, 30, CO.blue, 1); },
    card: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="none" stroke="' + CO.pale + '" stroke-width="1.1"/>'; },
    badge: function (cx, cy, n) { return '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="none" stroke="' + CO.blue + '" stroke-width="1.3" stroke-dasharray="3 2"/>' + T(cx, cy + 4, n, { s: 12, w: 700, f: CO.blue, a: 'middle', fam: CO.font }); },
    glyph: function (cx, cy, r) { return shell(cx, cy - r * 0.15, r * 1.05, CO.blue, '#e2eff6'); },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="none" stroke="' + CO.blue + '" stroke-width="1.2"/><path d="M' + (x + 6) + ' ' + y + ' Q' + (x + w / 2) + ' ' + (y - 10) + ' ' + (x + w - 6) + ' ' + y + '" fill="none" stroke="' + CO.blue + '" stroke-width="1"/>'; }
  });
})();
