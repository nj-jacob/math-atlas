/* Math Atlas worksheet themes, shared by every grade. Needs sheets.js first.
   A theme gives a sheet its own look: page frame, heading, section names, question numbers, cards, the band behind
   "Watch me", the things to count (pucks, jars, stars, muffins ...) and what holds them (bags, crates ...), and its
   own display font (loaded in sheets.css). The numbers and questions stay the same, so no theme is harder than another.
   Practise 3 and Think draw plain dots instead of the theme's things, to move from pictures to numbers.

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
  function star(cx, cy, r, fill) {
    var p = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push((cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1)); }
    return '<path d="M' + p.join(' L') + ' Z" fill="' + fill + '"/>';
  }
  function leaf(cx, cy, s, fill, rot) {
    var pts = [[0, -20], [4, -10], [10, -13], [8, -3], [16, -6], [13, 2], [18, 4], [8, 8], [9, 12], [1, 9], [1, 20], [-1, 20], [-1, 9], [-9, 12], [-8, 8], [-18, 4], [-13, 2], [-16, -6], [-8, -3], [-10, -13], [-4, -10]];
    return '<path transform="translate(' + cx + ' ' + cy + ') rotate(' + (rot || 0) + ') scale(' + s + ')" d="M' + pts.map(function (p) { return p.join(' '); }).join(' L') + ' Z" fill="' + fill + '"/>';
  }

  /* ---------- At the rink: a rink outline, a scoreboard heading, pucks ---------- */
  var RK = { blue: '#2f62c4', red: '#c8434a', ice: '#eef3fb', font: "'Barlow Condensed', 'Arial Narrow', sans-serif" };
  S.theme({
    id: 'RK', name: 'At the rink', acc: RK.blue, tint: RK.ice, font: RK.font,
    w: { a: 'Ava', b: 'Liam', one: 'puck', many: 'pucks', cont: 'bag', conts: 'bags' },
    art: disc('#e6edf9') + '<path d="M17 11 L31 37 Q32 39 35 39 L46 39" fill="none" stroke="' + RK.blue + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="20" cy="42" rx="7" ry="3" fill="' + INK + '"/>',
    frame: function (W, H) {
      return '<rect x="16" y="14" width="' + (W - 32) + '" height="' + (H - 58) + '" rx="56" fill="none" stroke="' + RK.blue + '" stroke-width="3"/>' +
        '<line x1="16" y1="' + H / 2 + '" x2="' + (W - 16) + '" y2="' + H / 2 + '" stroke="' + RK.red + '" stroke-width="5" opacity=".1"/>' +
        '<circle cx="' + W / 2 + '" cy="' + H / 2 + '" r="46" fill="none" stroke="' + RK.blue + '" stroke-width="2" opacity=".1"/>' +
        '<circle cx="92" cy="' + (H - 120) + '" r="30" fill="none" stroke="' + RK.red + '" stroke-width="2" opacity=".14"/><circle cx="' + (W - 92) + '" cy="' + (H - 120) + '" r="30" fill="none" stroke="' + RK.red + '" stroke-width="2" opacity=".14"/>';
    },
    head: function (h) {
      var size = h.fit(h.title.toUpperCase(), 340, 30, RK.font, 800);
      return '<rect x="' + h.M + '" y="30" width="' + (h.RIGHT - h.M) + '" height="58" rx="10" fill="' + INK + '"/>' +
        '<rect x="' + (h.RIGHT - 118) + '" y="38" width="106" height="42" rx="6" fill="#0c1730" stroke="' + RK.red + '" stroke-width="1.5"/>' +
        T(h.RIGHT - 65, 66, h.key ? 'KEY' : 'GRADE ' + Atlas.grade, { s: 18, w: 800, f: '#ffb3b7', a: 'middle', fam: RK.font, ls: 2 }) +
        T(h.M + 18, 58 + size * 0.2, h.title.toUpperCase(), { s: size, w: 800, f: '#fff', fam: RK.font, ls: 0.5 }) +
        T(h.M + 18, 80, h.sub.toUpperCase(), { s: 11, w: 700, f: '#9fb8ec', fam: RK.font, ls: 1.5 }) +
        (h.key ? '' : T(h.M, 112, 'Name', { s: 11, f: '#55627a' }) + '<line x1="' + (h.M + 34) + '" y1="114" x2="330" y2="114" stroke="#55627a"/>' +
          T(352, 112, 'Date', { s: 11, f: '#55627a' }) + '<line x1="384" y1="114" x2="' + h.RIGHT + '" y2="114" stroke="#55627a"/>');
    },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label.toUpperCase(), 13, 800, RK.font) + 26;
      return '<rect x="' + M + '" y="' + (y - 15) + '" width="' + w + '" height="21" rx="10.5" fill="' + RK.blue + '"/>' +
        T(M + 13, y + 0.5, label.toUpperCase(), { s: 13, w: 800, f: '#fff', fam: RK.font, ls: 1 }) +
        '<line x1="' + (M + w + 8) + '" y1="' + (y - 4.5) + '" x2="' + RIGHT + '" y2="' + (y - 4.5) + '" stroke="' + RK.red + '" stroke-width="1.5"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="22" fill="' + RK.ice + '" stroke="' + RK.blue + '" stroke-width="1.5"/>'; },
    badge: function (cx, cy, n) { return '<ellipse cx="' + cx + '" cy="' + (cy + 1) + '" rx="13" ry="10" fill="' + INK + '"/><ellipse cx="' + cx + '" cy="' + (cy - 1) + '" rx="13" ry="9" fill="#2a3756"/>' + T(cx, cy + 4, n, { s: 13, w: 800, f: '#fff', a: 'middle', fam: RK.font }); },
    glyph: function (cx, cy, r) { return '<ellipse cx="' + cx + '" cy="' + (cy + r * 0.25) + '" rx="' + r * 1.15 + '" ry="' + r * 0.75 + '" fill="' + INK + '"/><ellipse cx="' + cx + '" cy="' + (cy - r * 0.05) + '" rx="' + r * 1.15 + '" ry="' + r * 0.62 + '" fill="#33415f"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + RK.ice + '" stroke="' + RK.blue + '" stroke-width="1.4"/><path d="M' + (x + w / 2 - 6) + ' ' + y + ' q6 -6 12 0" fill="none" stroke="' + RK.blue + '" stroke-width="1.4"/>'; }
  });

  /* ---------- At the sugar bush: warm paper, maple leaves, a serif heading, jars in crates ---------- */
  var SB = { brown: '#5a3410', amber: '#9a5a17', kraft: '#f1e3cc', line: '#d9bf98', font: "'Fraunces', Georgia, serif" };
  S.theme({
    id: 'SB', name: 'At the sugar bush', acc: SB.amber, tint: SB.kraft, font: SB.font, paper: '#fcf8f1',
    w: { a: 'Noor', b: 'Kai', one: 'jar', many: 'jars', cont: 'crate', conts: 'crates' },
    art: disc('#f6ece0') + '<rect x="11" y="8" width="10" height="40" rx="3" fill="' + SB.amber + '"/><path d="M21 22 L28 24" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/><path d="M24 27 L40 27 L38 43 L26 43 Z" fill="none" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 13 Q35 18 32 20 Q29 18 32 13 Z" fill="' + SB.amber + '"/>',
    frame: function (W, H) {
      return leaf(W - 46, 40, 1.5, '#c0622b', 18) + leaf(W - 92, 26, 0.9, '#d9a441', -24) + leaf(W - 30, 96, 0.8, SB.amber, 40) +
        '<path d="M0 ' + (H - 8) + ' Q' + W / 4 + ' ' + (H - 16) + ' ' + W / 2 + ' ' + (H - 8) + ' T' + W + ' ' + (H - 8) + ' L' + W + ' ' + H + ' L0 ' + H + ' Z" fill="' + SB.kraft + '"/>';
    },
    head: function (h) {
      var size = h.fit(h.title, h.key ? 400 : 330, 32, SB.font, 800);
      return T(h.M, 66, h.title, { s: size, w: 800, f: SB.brown, fam: SB.font }) +
        T(h.M, 90, h.sub, { s: 14, i: 1, f: SB.amber, fam: SB.font }) +
        '<path d="M' + h.M + ' 106 q 12 -5 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0" fill="none" stroke="' + SB.amber + '" stroke-width="1.4"/>' +
        (h.key ? '' : S.nameDate(392, 128 - 70, h.RIGHT - 70, '#7a5a3a'));
    },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label, 16, 600, SB.font);
      return leaf(M + 7, y - 6, 0.38, '#c0622b', 0) + T(M + 20, y, label, { s: 16, w: 600, i: 1, f: SB.brown, fam: SB.font }) +
        '<line x1="' + (M + 30 + w) + '" y1="' + (y - 5) + '" x2="' + RIGHT + '" y2="' + (y - 5) + '" stroke="' + SB.line + '" stroke-width="1.6" stroke-dasharray="1 5" stroke-linecap="round"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + SB.kraft + '"/><rect x="' + (x + 5) + '" y="' + (y + 5) + '" width="' + (w - 10) + '" height="' + (h - 10) + '" rx="4" fill="none" stroke="' + SB.amber + '" stroke-width="1" stroke-dasharray="4 3"/>'; },
    card: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="#fffdf8" stroke="#e8d6b8" stroke-width="1.2"/>'; },
    badge: function (cx, cy, n) { return '<path d="M' + cx + ' ' + (cy - 14) + ' C' + (cx + 4) + ' ' + (cy - 7) + ' ' + (cx + 11) + ' ' + (cy - 1) + ' ' + (cx + 11) + ' ' + (cy + 4) + ' A11 11 0 0 1 ' + (cx - 11) + ' ' + (cy + 4) + ' C' + (cx - 11) + ' ' + (cy - 1) + ' ' + (cx - 4) + ' ' + (cy - 7) + ' ' + cx + ' ' + (cy - 14) + ' Z" fill="' + SB.amber + '"/>' + T(cx, cy + 8, n, { s: 13, w: 700, f: '#fff', a: 'middle' }); },
    glyph: function (cx, cy, r) { return '<rect x="' + (cx - r * 0.8) + '" y="' + (cy - r * 0.55) + '" width="' + r * 1.6 + '" height="' + r * 1.6 + '" rx="' + r * 0.4 + '" fill="#c47a1e"/><rect x="' + (cx - r * 0.65) + '" y="' + (cy - r * 1.05) + '" width="' + r * 1.3 + '" height="' + r * 0.5 + '" rx="1" fill="' + SB.brown + '"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="#f6ead6" stroke="' + SB.amber + '" stroke-width="1.4"/><line x1="' + x + '" y1="' + (y + h - 4) + '" x2="' + (x + w) + '" y2="' + (y + h - 4) + '" stroke="' + SB.amber + '" stroke-width="1"/>'; }
  });

  /* ---------- At the planetarium: a night-sky heading, stars, outlined panels ---------- */
  var PL = { night: '#1d1a4a', violet: '#4b45a1', pale: '#ebeaf7', line: '#d5d3ef', font: "'Exo 2', 'Trebuchet MS', sans-serif" };
  var SKY = [[60, 22, 2], [118, 98, 1.5], [170, 18, 2.5], [230, 70, 1.4], [292, 24, 1.8], [340, 98, 2.2], [360, 40, 1.3], [470, 18, 1.6], [560, 100, 1.8], [24, 80, 1.6], [590, 30, 2]];
  S.theme({
    id: 'PL', name: 'At the planetarium', acc: PL.violet, tint: PL.pale, font: PL.font,
    w: { a: 'Hana', b: 'Theo', one: 'star', many: 'stars', cont: 'row', conts: 'rows' },
    art: disc(PL.pale) + '<path d="M10 40 A18 18 0 0 1 46 40 Z" fill="' + PL.violet + '"/><rect x="8" y="40" width="40" height="4" rx="2" fill="' + INK + '"/>' + star(28, 27, 6, '#fff'),
    frame: function (W, H) {
      return '<rect width="' + W + '" height="116" fill="' + PL.night + '"/>' + SKY.map(function (s) { return star(s[0], s[1], s[2] * 2, '#fff'); }).join('') +
        '<ellipse cx="' + (W - 40) + '" cy="' + (H - 50) + '" rx="130" ry="44" fill="none" stroke="' + PL.violet + '" stroke-width="1.2" opacity=".14" transform="rotate(-18 ' + (W - 40) + ' ' + (H - 50) + ')"/>';
    },
    head: function (h) {
      var size = h.fit(h.title, h.key ? 440 : 280, 28, PL.font, 800);
      return '<path d="M' + (h.M + 18) + ' 46 a16 16 0 1 0 14 22 a12 12 0 1 1 -14 -22 Z" fill="#f6d36b"/>' +
        T(h.M + 50, 62, h.title, { s: size, w: 800, f: '#fff', fam: PL.font }) + T(h.M + 50, 84, h.sub, { s: 13, f: '#b9b4f0', fam: PL.font }) +
        (h.key ? '' : '<rect x="384" y="30" width="' + (h.RIGHT - 384) + '" height="62" rx="10" fill="#fff"/>' + S.nameDate(396, 54, h.RIGHT - 12));
    },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label.toUpperCase(), 12, 700, PL.font) + label.length * 2;
      return star(M + 7, y - 5, 7, PL.violet) + T(M + 20, y, label.toUpperCase(), { s: 12, w: 700, f: PL.violet, fam: PL.font, ls: 2 }) +
        '<line x1="' + (M + 30 + w) + '" y1="' + (y - 5) + '" x2="' + RIGHT + '" y2="' + (y - 5) + '" stroke="' + PL.line + '" stroke-width="1.5" stroke-dasharray="2 5" stroke-linecap="round"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="16" fill="' + PL.pale + '"/>' + star(x + w - 22, y + 18, 6, PL.violet) + star(x + w - 40, y + 30, 3, PL.violet); },
    card: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" fill="#fff" stroke="' + PL.line + '" stroke-width="1.4"/>'; },
    badge: function (cx, cy, n) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="16" ry="6" fill="none" stroke="' + PL.violet + '" stroke-width="1.2" transform="rotate(-20 ' + cx + ' ' + cy + ')"/><circle cx="' + cx + '" cy="' + cy + '" r="10.5" fill="' + PL.night + '"/>' + T(cx, cy + 4.5, n, { s: 12, w: 700, f: '#fff', a: 'middle', fam: PL.font }); },
    glyph: function (cx, cy, r) { return star(cx, cy, r * 1.45, PL.violet); },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" fill="#f6f5fd" stroke="' + PL.violet + '" stroke-width="1.2" stroke-dasharray="3 3"/>'; }
  });

  /* ---------- At the bakery: gingham edges, a recipe-card heading, muffins on trays ---------- */
  var BK = { rust: '#b4531a', deep: '#7a2e12', peach: '#f9e9de', line: '#efd3c2', font: "'DM Serif Display', Georgia, serif" };
  function gingham(y, W, h) {
    var out = '<rect x="0" y="' + y + '" width="' + W + '" height="' + h + '" fill="#fff"/>';
    for (var x = 0; x < W; x += 8) out += '<rect x="' + x + '" y="' + y + '" width="4" height="' + h + '" fill="' + BK.rust + '" opacity=".22"/>';
    for (var yy = y; yy < y + h; yy += 8) out += '<rect x="0" y="' + yy + '" width="' + W + '" height="4" fill="' + BK.rust + '" opacity=".22"/>';
    return out;
  }
  S.theme({
    id: 'BK', name: 'At the bakery', acc: BK.rust, tint: BK.peach, font: BK.font, paper: '#fffaf6',
    w: { a: 'Zara', b: 'Mateo', one: 'muffin', many: 'muffins', cont: 'tray', conts: 'trays' },
    art: disc(BK.peach) + '<rect x="9" y="38" width="38" height="4" rx="2" fill="' + INK + '"/><path d="M14 37 L16 29 L24 29 L26 37 Z M30 37 L32 29 L40 29 L42 37 Z" fill="' + BK.rust + '"/><path d="M14 29 Q20 20 26 29 Z M30 29 Q36 20 42 29 Z" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>',
    frame: function (W, H) { return gingham(0, W, 16) + gingham(H - 16, W, 16); },
    head: function (h) {
      var size = h.fit(h.title, h.key ? 400 : 300, 30, BK.font, 400);
      return '<rect x="' + h.M + '" y="30" width="' + (h.RIGHT - h.M) + '" height="80" rx="6" fill="#fff" stroke="' + BK.line + '" stroke-width="1.4"/>' +
        '<rect x="' + (h.M + 16) + '" y="22" width="92" height="18" rx="4" fill="' + BK.rust + '"/>' + T(h.M + 62, 35, h.key ? 'ANSWER KEY' : 'TODAY’S BAKE', { s: 9.5, w: 700, f: '#fff', a: 'middle', ls: 1.2 }) +
        T(h.M + 18, 76, h.title, { s: size, w: 400, f: BK.deep, fam: BK.font }) + T(h.M + 18, 98, h.sub, { s: 12, f: BK.rust }) +
        (h.key ? '' : '<line x1="370" y1="42" x2="370" y2="100" stroke="' + BK.line + '" stroke-width="1.4"/>' + S.nameDate(384, 62, h.RIGHT - 14, BK.deep));
    },
    section: function (y, label, M, RIGHT) {
      var w = S.tw(label, 17, 400, BK.font);
      return T(M, y + 1, label, { s: 17, w: 400, f: BK.deep, fam: BK.font }) +
        '<line x1="' + (M + w + 12) + '" y1="' + (y - 5) + '" x2="' + RIGHT + '" y2="' + (y - 5) + '" stroke="' + BK.rust + '" stroke-width="2" stroke-dasharray="0.5 6" stroke-linecap="round"/>';
    },
    band: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + BK.peach + '"/><rect x="' + x + '" y="' + y + '" width="' + w + '" height="5" rx="2" fill="' + BK.rust + '" opacity=".5"/>'; },
    card: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="#fff" stroke="' + BK.line + '" stroke-width="1.2"/><line x1="' + (x + 1) + '" y1="' + (y + 1.5) + '" x2="' + (x + w - 1) + '" y2="' + (y + 1.5) + '" stroke="' + BK.rust + '" stroke-width="3"/>'; },
    badge: function (cx, cy, n) { return '<rect x="' + (cx - 11) + '" y="' + (cy - 11) + '" width="22" height="22" rx="5" fill="' + BK.rust + '"/>' + T(cx, cy + 4.5, n, { s: 13, w: 700, f: '#fff', a: 'middle' }); },
    glyph: function (cx, cy, r) { return '<path d="M' + (cx - r) + ' ' + cy + ' L' + (cx - r * 0.7) + ' ' + (cy + r) + ' L' + (cx + r * 0.7) + ' ' + (cy + r) + ' L' + (cx + r) + ' ' + cy + ' Z" fill="' + BK.rust + '"/><path d="M' + (cx - r * 1.1) + ' ' + (cy + 0.5) + ' Q' + cx + ' ' + (cy - r * 1.6) + ' ' + (cx + r * 1.1) + ' ' + (cy + 0.5) + ' Z" fill="#e3a35c"/>'; },
    holder: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="#f6e4d6" stroke="' + BK.deep + '" stroke-width="1.3"/><rect x="' + (x - 3) + '" y="' + (y + h / 2 - 3) + '" width="3" height="6" fill="' + BK.deep + '"/><rect x="' + (x + w) + '" y="' + (y + h / 2 - 3) + '" width="3" height="6" fill="' + BK.deep + '"/>'; }
  });

  /* ---------- the six themes still to be given their own look (plain look until then) ---------- */
  [
    { id: 'LK', name: 'At the lake', acc: '#0b6e78', tint: '#e3f1f2', w: { a: 'Mei', b: 'Arjun', one: 'fish', many: 'fish', cont: 'net', conts: 'nets' },
      art: '<path d="M8 30 Q28 44 48 30 Z" fill="#0b6e78"/><path d="M33 11 L25 38" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/><path d="M10 45 Q15 42 20 45 T30 45 T40 45 T47 45" fill="none" stroke="#0b6e78" stroke-width="2" stroke-linecap="round"/>' },
    { id: 'MK', name: "At the farmers' market", acc: '#3d7f3a', tint: '#e5f1e3', w: { a: 'Amara', b: 'Owen', one: 'apple', many: 'apples', cont: 'basket', conts: 'baskets' },
      art: '<circle cx="21" cy="25" r="6" fill="#b4283f"/><circle cx="33" cy="24" r="6" fill="#3d7f3a"/><circle cx="27" cy="21" r="6" fill="#b4283f"/><path d="M11 28 L45 28 L41 44 L15 44 Z" fill="#fff" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' },
    { id: 'MU', name: 'In music class', acc: '#a8326a', tint: '#f6e6ee', w: { a: 'Leila', b: 'Lucas', one: 'shaker', many: 'shakers', cont: 'box', conts: 'boxes' },
      art: '<path d="M24 38 L24 14 L40 10 L40 34" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="20" cy="38" rx="5.5" ry="4.2" fill="#a8326a"/><ellipse cx="36" cy="34" rx="5.5" ry="4.2" fill="#a8326a"/>' },
    { id: 'GD', name: 'In the garden', acc: '#5b7f22', tint: '#eef3e1', w: { a: 'Sofia', b: 'Jayden', one: 'seed', many: 'seeds', cont: 'pot', conts: 'pots' },
      art: '<path d="M18 32 L38 32 L35 46 L21 46 Z" fill="#b4531a"/><rect x="16" y="29" width="24" height="5" rx="2" fill="' + INK + '"/><path d="M28 29 L28 17" stroke="#5b7f22" stroke-width="2.6" stroke-linecap="round"/><path d="M28 21 Q20 20 19 12 Q27 13 28 21 Z M28 18 Q34 12 39 14 Q37 21 28 18 Z" fill="#5b7f22"/>' },
    { id: 'TR', name: 'At the train yard', acc: '#4a5a78', tint: '#e9edf3', w: { a: 'Ethan', b: 'Chloe', one: 'log', many: 'logs', cont: 'car', conts: 'cars' },
      art: '<rect x="11" y="22" width="34" height="14" rx="2" fill="#4a5a78"/><circle cx="18" cy="38" r="4" fill="' + INK + '"/><circle cx="38" cy="38" r="4" fill="' + INK + '"/><path d="M8 44 L48 44" stroke="' + INK + '" stroke-width="2"/>' },
    { id: 'CO', name: 'At the coast', acc: '#1d6f96', tint: '#e2eff6', w: { a: 'Priya', b: 'Malik', one: 'shell', many: 'shells', cont: 'pail', conts: 'pails' },
      art: '<path d="M17 24 L39 24 L36 42 L20 42 Z" fill="#1d6f96"/><path d="M19 24 Q28 10 37 24" fill="none" stroke="' + INK + '" stroke-width="2.2"/><path d="M8 48 Q13 45 18 48 T28 48 T38 48 T48 48" fill="none" stroke="#1d6f96" stroke-width="2" stroke-linecap="round"/>' }
  ].forEach(function (t) { t.art = disc(t.tint) + t.art; S.theme(t); });
})();
