/* Grade 3 3D Shapes and Directions: a full chapter (docs/QUESTIONS.md, "Full chapters"). 4 lessons, 11 ideas, one practice skill per idea.
   Ontario 2020: E1.1 3D objects, E1.2 structures, E1.3 congruence, E1.4 directions with distances and turns.
   Curved objects are described by flat faces, curved surface and point. Edges and vertices are counted only on objects with flat faces only.
   Every question sets meta.k; the answer checks are in tests/verify/grade3.js (keys start with g3sh-). */
(function () {
  var A = Atlas, R = A.R, Q = A.Q, CH = 'shapes';

  /* ---------- words and question builders ---------- */
  function put(o, x) { for (var k in x) o[k] = x[k]; return o; }
  function plain(h) { var e = document.createElement('div'); e.innerHTML = h; return e.textContent.replace(/\s+/g, ' ').trim(); }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function coin() { return Math.random() < 0.5; }
  function pl(n, one, many) { return G3.pl(n, one, many); }
  /* pick one: the right answer and up to 3 wrong ones, each with the fix for that mistake: wrongs = [[html, fix], ...] */
  function mc(q, right, wrongs, x) {
    var seen = {}, opts = [right], fix = {};
    seen[plain(right)] = 1;
    wrongs.forEach(function (w) { var t = plain(w[0]); if (opts.length >= 4 || seen[t]) return; seen[t] = 1; opts.push(w[0]); if (w[1]) fix[t] = w[1]; });
    var o = R.shuffle(opts);
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(right), wrong: fix }, x || {});
  }
  function num(q, ans, fixes, x) { var w = {}; Object.keys(fixes || {}).forEach(function (k) { if (+k !== ans) w[k] = fixes[k]; }); return put({ q: q, type: 'num', answer: ans, wrong: w }, x); }
  function fill(q, f, answers, x) { return put({ q: q, type: 'fill', fill: f, answers: answers }, x); }
  function tf(q, truth, right, bad, fix, x) {
    var o = R.mc(right, bad), w = {};
    w[truth ? 'False' : 'True'] = fix;
    return put({ q: q, type: 'tf', answer: truth, why: { options: o.options, answer: o.answer }, wrong: w, steps: [right], explain: right }, x);
  }
  function fillText(f, ans) { var i = 0; return f.replace(/\[\[\]\]/g, function () { return ans[i++]; }); }
  function tileFix(tiles, ans, say) { var w = {}; tiles.forEach(function (t, i) { if (i !== ans) w[plain(t) || String(i)] = say(i); }); return w; }

  /* ---------- 3D objects: 3D points, edges ([a, b, hidden]), the faces you can see, and edge and corner groups for counting in order ---------- */
  var S = {
    cube: { name: 'cube', kind: 'prism', base: 'square', f: 6, e: 12, v: 8, see: 3, sq: 6, parts: 'A cube has [[]] flat faces. All of them are squares.', pa: [6],
      pts: [[0, 0, 0], [110, 0, 0], [110, 110, 0], [0, 110, 0], [0, 0, 110], [110, 0, 110], [110, 110, 110], [0, 110, 110]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 5], [2, 6], [3, 7], [5, 6], [6, 7], [0, 4, 1], [4, 5, 1], [4, 7, 1]], vis: [[0, 1, 2, 3], [3, 2, 6, 7], [1, 5, 6, 2]],
      ge: [['around the front', [0, 1, 2, 3]], ['around the back', [7, 8, 10, 11]], ['going back', [4, 5, 6, 9]]], gv: [['on the front', [0, 1, 2, 3]], ['on the back', [4, 5, 6, 7]]] },
    rprism: { name: 'rectangular prism', kind: 'prism', base: 'rectangle', f: 6, e: 12, v: 8, see: 3, sq: 6, parts: 'A rectangular prism has [[]] flat faces. All of them are rectangles.', pa: [6],
      pts: [[0, 0, 0], [170, 0, 0], [170, 90, 0], [0, 90, 0], [0, 0, 70], [170, 0, 70], [170, 90, 70], [0, 90, 70]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 5], [2, 6], [3, 7], [5, 6], [6, 7], [0, 4, 1], [4, 5, 1], [4, 7, 1]], vis: [[0, 1, 2, 3], [3, 2, 6, 7], [1, 5, 6, 2]],
      ge: [['around the front', [0, 1, 2, 3]], ['around the back', [7, 8, 10, 11]], ['going back', [4, 5, 6, 9]]], gv: [['on the front', [0, 1, 2, 3]], ['on the back', [4, 5, 6, 7]]] },
    tprism: { name: 'triangular prism', kind: 'prism', base: 'triangle', f: 5, e: 9, v: 6, see: 2, sq: 3, parts: '[[]] triangles + [[]] rectangles = [[]] flat faces', pa: [2, 3, 5],
      pts: [[0, 0, 0], [130, 0, 0], [65, 105, 0], [0, 0, 150], [130, 0, 150], [65, 105, 150]],
      edges: [[0, 1], [1, 2], [2, 0], [1, 4], [2, 5], [4, 5], [0, 3, 1], [3, 4, 1], [3, 5, 1]], vis: [[0, 1, 2], [1, 4, 5, 2]],
      ge: [['around the front', [0, 1, 2]], ['around the back', [5, 7, 8]], ['going back', [3, 4, 6]]], gv: [['on the front', [0, 1, 2]], ['on the back', [3, 4, 5]]] },
    spyr: { name: 'square-based pyramid', kind: 'pyramid', base: 'square', f: 5, e: 8, v: 5, see: 2, sq: 1, parts: '[[]] square + [[]] triangles = [[]] flat faces', pa: [1, 4, 5],
      pts: [[0, 0, 0], [150, 0, 0], [150, 0, 150], [0, 0, 150], [75, 150, 75]],
      edges: [[0, 1], [1, 2], [0, 4], [1, 4], [2, 4], [2, 3, 1], [3, 0, 1], [3, 4, 1]], vis: [[0, 1, 4], [1, 2, 4]],
      ge: [['around the base', [0, 1, 5, 6]], ['up to the point', [2, 3, 4, 7]]], gv: [['around the base', [0, 1, 2, 3]], ['at the point', [4]]] },
    tpyr: { name: 'triangular pyramid', kind: 'pyramid', base: 'triangle', f: 4, e: 6, v: 4, see: 2, sq: 0, parts: '[[]] triangle on the bottom + [[]] triangles up the sides = [[]] flat faces', pa: [1, 3, 4],
      pts: [[0, 0, 0], [160, 0, 0], [70, 0, 130], [75, 150, 40]],
      edges: [[0, 1], [1, 2], [0, 3], [1, 3], [2, 3], [0, 2, 1]], vis: [[0, 1, 3], [1, 2, 3]],
      ge: [['around the base', [0, 1, 5]], ['up to the point', [2, 3, 4]]], gv: [['around the base', [0, 1, 2]], ['at the point', [3]]] },
    cyl: { name: 'cylinder', kind: 'curved', f: 2, cs: 1, pt: 0, round: 'cyl', parts: 'A cylinder has [[]] flat faces (circles) and [[]] curved surface.', pa: [2, 1] },
    cone: { name: 'cone', kind: 'curved', f: 1, cs: 1, pt: 1, round: 'cone', parts: 'A cone has [[]] flat face (a circle), [[]] curved surface and [[]] point.', pa: [1, 1, 1] }
  };
  var POLY = ['cube', 'rprism', 'tprism', 'spyr', 'tpyr'], ALL = POLY.concat(['cyl', 'cone']), PRISMS = ['cube', 'rprism', 'tprism'];
  function nm(k) { return S[k].name; }
  function a(k) { return G3.an(S[k].name); }
  var EVERY = [['a cereal box', 'rprism'], ['a tissue box', 'rprism'], ['a number cube', 'cube'], ['a building block', 'cube'], ['a tent', 'tprism'], ['a wedge of cheese', 'tprism'],
    ['a soup can', 'cyl'], ['a drum', 'cyl'], ['a traffic cone', 'cone'], ['a party hat', 'cone'], ['a pyramid in Egypt', 'spyr'], ['a tent with a square floor', 'spyr']];

  /* ---------- pictures ---------- */
  var INK = 'var(--ink)', HOT = 'var(--bad)';
  function P(p, ox, oy) { return [Math.round(ox + p[0] + p[2] * 0.5), Math.round(oy - p[1] - p[2] * 0.36)]; }
  /* a 3D object. hl: 'f' faces, 'e' edges, 'v' vertices; mark: { e: [edge indexes], v: [corner indexes] } lights only some */
  function solid(key, hl, ox, oy, label, mark) {
    var d = typeof key === 'string' ? S[key] : key, s = '', col = 'var(--strand)';
    mark = mark || {};
    ox = ox === undefined ? 60 : ox; oy = oy === undefined ? 230 : oy;
    var faceFill = hl === 'f' ? 'color-mix(in srgb,var(--hi) 70%,var(--card))' : 'color-mix(in srgb,' + col + ' 20%,var(--card))';
    if (d.round) {
      var rx = d.rx || 80, cx = ox + 90, ry = Math.round(rx * 0.33), lw = 3;
      if (d.round === 'cyl') {
        var top = oy - (d.ht || 150);
        s += '<path d="M' + (cx - rx) + ' ' + top + ' V' + oy + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + oy + ' V' + top + '" style="fill:' + (d.hc ? 'color-mix(in srgb,var(--hi) 45%,var(--card))' : 'color-mix(in srgb,' + col + ' 20%,var(--card))') + '"/>';
        s += '<ellipse cx="' + cx + '" cy="' + top + '" rx="' + rx + '" ry="' + ry + '" style="fill:' + faceFill + ';stroke:' + INK + '" stroke-width="' + lw + '"/>';
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + oy + '" fill="none" style="stroke:' + INK + '" stroke-width="' + lw + '"/>';
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + oy + '" fill="none" style="stroke:' + INK + '" stroke-width="2" stroke-dasharray="6 5"/>';
        s += '<line x1="' + (cx - rx) + '" y1="' + top + '" x2="' + (cx - rx) + '" y2="' + oy + '" style="stroke:' + INK + '" stroke-width="3"/><line x1="' + (cx + rx) + '" y1="' + top + '" x2="' + (cx + rx) + '" y2="' + oy + '" style="stroke:' + INK + '" stroke-width="3"/>';
      } else {
        var ap = oy - (d.ht || 170);
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' L' + cx + ' ' + ap + ' L' + (cx + rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx - rx) + ' ' + oy + 'Z" style="fill:' + (d.hc ? 'color-mix(in srgb,var(--hi) 45%,var(--card))' : 'color-mix(in srgb,' + col + ' 20%,var(--card))') + '"/>';
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + oy + '" style="fill:' + (hl === 'f' ? faceFill : 'none') + ';stroke:' + INK + '" stroke-width="' + lw + '"/>';
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + oy + '" fill="none" style="stroke:' + INK + '" stroke-width="2" stroke-dasharray="6 5"/>';
        s += '<line x1="' + (cx - rx) + '" y1="' + oy + '" x2="' + cx + '" y2="' + ap + '" style="stroke:' + INK + '" stroke-width="3"/><line x1="' + (cx + rx) + '" y1="' + oy + '" x2="' + cx + '" y2="' + ap + '" style="stroke:' + INK + '" stroke-width="3"/>';
        if (d.hp) s += '<circle cx="' + cx + '" cy="' + ap + '" r="9" style="fill:var(--hi);stroke:' + INK + '" stroke-width="2"/>';
      }
      return A.svg(ox + 200, oy + 34, s, label || G3.an(d.name, true));
    }
    var pp = d.pts.map(function (p) { return P(p, ox, oy); }), me = mark.e || [], mv = mark.v || [];
    d.vis.forEach(function (f) { s += '<polygon points="' + f.map(function (i) { return pp[i].join(','); }).join(' ') + '" style="fill:' + faceFill + '"/>'; });
    d.edges.forEach(function (e, i) {
      var p = pp[e[0]], q = pp[e[1]], hot = hl === 'e' || me.indexOf(i) >= 0;
      s += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" style="stroke:' + (hot ? HOT : e[2] ? 'var(--ink2)' : INK) + '" stroke-width="' + (hot ? (e[2] ? 3 : 5) : e[2] ? 2 : 3) + '"' + (e[2] ? ' stroke-dasharray="6 5"' : '') + ' stroke-linecap="round"/>';
    });
    pp.forEach(function (p, i) { if (hl === 'v' || mv.indexOf(i) >= 0) s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" style="fill:var(--hi);stroke:' + INK + '" stroke-width="2"/>'; });
    var xs = pp.map(function (p) { return p[0]; }), ys = pp.map(function (p) { return p[1]; });
    return A.svg(Math.ceil(Math.max.apply(null, xs) + 20), Math.ceil(Math.max.apply(null, ys) + 16), s, label || G3.an(d.name, true));
  }
  function small(k) { return solid(k, '', 30, 200); }
  /* a row of objects with letters under them */
  function lineUp(keys, labels) {
    var out = '', x = 0, H = 0;
    keys.forEach(function (k, i) {
      var svg = small(k), w = +svg.match(/viewBox="0 0 (\d+)/)[1], h = +svg.match(/viewBox="0 0 \d+ (\d+)/)[1];
      H = Math.max(H, h + (labels ? 34 : 4));
      out += '<g transform="translate(' + x + ' 0)">' + svg.replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g>' + (labels ? '<text x="' + (x + w / 2) + '" y="' + (h + 26) + '" text-anchor="middle" font-size="26" class="tb">' + labels[i] + '</text>' : '');
      x += w + 10;
    });
    return A.svg(x, H, out, keys.map(function (k) { return S[k].name; }).join(', '));
  }

  /* structures: parts from the bottom up. Boxes hide the edges a part on top covers. */
  var BOX = { cube: [110, 110, 110], rprism: [170, 90, 70] };
  function boxDef(k, y0) {
    var d = BOX[k], w = d[0], h = d[1], z = d[2], e = S[k].edges.map(function (x) { return x.slice(); });
    e[6][2] = 1; e[8][2] = 1;
    return { name: S[k].name, pts: [[0, y0, 0], [w, y0, 0], [w, y0 + h, 0], [0, y0 + h, 0], [0, y0, z], [w, y0, z], [w, y0 + h, z], [0, y0 + h, z]], edges: e, vis: S[k].vis };
  }
  function roofDef(k, y0) { var d = BOX[k], w = d[0], z = d[2]; return { name: 'triangular prism', pts: [[0, y0, 0], [w, y0, 0], [w / 2, y0 + 70, 0], [0, y0, z], [w, y0, z], [w / 2, y0 + 70, z]], edges: S.tprism.edges, vis: S.tprism.vis }; }
  function pyrDef(k, y0) { var d = BOX[k], w = d[0], z = d[2]; return { name: 'square-based pyramid', pts: [[0, y0, 0], [w, y0, 0], [w, y0, z], [0, y0, z], [w / 2, y0 + 100, z / 2]], edges: S.spyr.edges, vis: S.spyr.vis }; }
  /* name, parts from the bottom, what it is, the 2D shapes seen from the front */
  var ST = {
    house: { name: 'house', parts: ['cube', 'tprism'], front: 'a square and a triangle' },
    barn: { name: 'barn', parts: ['rprism', 'tprism'], front: 'a rectangle and a triangle' },
    tower: { name: 'tower', parts: ['cube', 'spyr'], front: 'a square and a triangle' },
    silo: { name: 'grain silo', parts: ['cyl', 'cone'], front: 'a rectangle and a triangle' },
    tall: { name: 'tall tower', parts: ['cube', 'cube', 'spyr'], front: '2 squares and a triangle' },
    shed: { name: 'long shed', parts: ['rprism', 'rprism', 'tprism'], front: '2 rectangles and a triangle' }
  };
  var STK = Object.keys(ST);
  function inner(x) { return x.replace(/^<svg[^>]*>|<\/svg>$/g, ''); }
  function structFig(k, split) {
    var c = ST[k], lift = split ? 50 : 0, out = '', H = 380, label = 'A ' + c.name + ' made of ' + partsText(k);
    if (c.parts[0] === 'cyl') {
      out = inner(solid({ name: 'cylinder', round: 'cyl', rx: 80, ht: 150 }, '', 60, H)) + '<g>' + inner(solid({ name: 'cone', round: 'cone', rx: 80, ht: 120 }, '', 60, H - 150 - lift)).replace(/var\(--strand\)/g, 'var(--sb)') + '</g>';
      return A.svg(320, H + 34, out, label);
    }
    var y = 0, top = c.parts.length - 1, bk = c.parts[0], tall = 70;
    c.parts.forEach(function (p) { tall += p === 'tprism' ? 70 : p === 'spyr' ? 100 : BOX[p][1]; });
    H = tall + lift * top;
    c.parts.forEach(function (p, i) {
      var y0 = y + lift * i, def = p === 'tprism' ? roofDef(bk, y0) : p === 'spyr' ? pyrDef(bk, y0) : i === top || split ? put(boxDef(p, y0), { edges: S[p].edges }) : boxDef(p, y0);
      var g = inner(solid(def, '', 30, H));
      out += '<g>' + (i % 2 ? g.replace(/var\(--strand\)/g, 'var(--sb)') : g) + '</g>';
      y += BOX[p] ? BOX[p][1] : 0;
    });
    return A.svg(260, H + 16, out, label);
  }
  function partsText(k) {
    var p = ST[k].parts, out = [];
    p.slice().reverse().forEach(function (x) { out.push(G3.an(nm(x))); });
    return out.join(' on ');
  }

  /* a flat face, drawn to scale on centimetre squares, with its sides labelled */
  var U = 22;
  function faceShape(f, x, y, lab) {
    var s = '', w = f[0] * U, h = f[1] * U;
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" style="fill:color-mix(in srgb,var(--strand) 22%,var(--card));stroke:' + INK + '" stroke-width="3"/>';
    s += '<text x="' + (x + w / 2) + '" y="' + (y + h + 24) + '" text-anchor="middle" font-size="17" class="tb">' + f[0] + ' cm</text>';
    s += '<text x="' + (x - 8) + '" y="' + (y + h / 2 + 6) + '" text-anchor="end" font-size="17" class="tb">' + f[1] + ' cm</text>';
    if (lab) s += '<text x="' + (x + w / 2) + '" y="' + (y - 10) + '" text-anchor="middle" font-size="22" class="tb">' + lab + '</text>';
    return { s: s, w: w, h: h };
  }
  function faces(list, labels) {
    var x = 52, out = '', H = 0;
    list.forEach(function (f, i) { var r = faceShape(f, x, 34, labels ? labels[i] : ''); out += r.s; x += r.w + 64; H = Math.max(H, r.h); });
    return A.svg(x - 10, H + 70, out, list.map(function (f, i) { return (labels ? labels[i] + ': ' : '') + f[0] + ' cm by ' + f[1] + ' cm'; }).join('. '));
  }
  /* a box built from cubes, a long, b deep, c tall */
  function boxAt(d, x, base, u, p) { return A.draw.prism(x, base, d[0] * u, d[1] * u, d[2] * u, d[0], d[1], d[2], p); }
  function unit(list) { return Math.min(18, Math.floor(100 / Math.max.apply(null, [].concat.apply([], list)))); }
  function boxPair(a, b) {
    var u = unit([a, b]), s = boxAt(a, 20, 150, u, 2) + '<text x="70" y="182" text-anchor="middle" font-size="18" class="tb">A: ' + dims(a) + '</text>' + boxAt(b, 230, 150, u, 3) + '<text x="290" y="182" text-anchor="middle" font-size="18" class="tb">B: ' + dims(b) + '</text>';
    return A.svg(440, 192, s, 'Box A is ' + dims(a) + ' cubes. Box B is ' + dims(b) + ' cubes.');
  }
  function boxFig(d) { return A.svg(230, 190, boxAt(d, 20, 170, unit([d]), 2), dims(d) + ' box'); }
  function dims(d) { return d.join(' by '); }
  function srt(d) { return d.slice().sort(function (x, y) { return x - y; }); }
  function sameBox(a, b) { return srt(a).join() === srt(b).join(); }

  /* directions: a 6 by 6 map. Columns A to F (east is right), rows 1 to 6 (north is up). */
  var COLS = 'ABCDEF', DN = ['north', 'east', 'south', 'west'], MOVE = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  var PLACES = [[4, 5, 'Library'], [0, 4, 'Park'], [5, 0, 'Pool'], [2, 2, 'School']];
  function cell(x, y) { return COLS[x] + (y + 1); }
  function map(path, dir, label, hits) {
    var sz = 62, s = '', W = 6 * sz + 40, H = 6 * sz + 40;
    for (var i = 0; i < 6; i++) {
      s += '<text x="' + (36 + i * sz + sz / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="19" class="tb">' + COLS[i] + '</text>';
      s += '<text x="16" y="' + (12 + (5 - i) * sz + sz / 2 + 6) + '" text-anchor="middle" font-size="19" class="tb">' + (i + 1) + '</text>';
    }
    for (var c = 0; c < 6; c++) for (var r = 0; r < 6; r++) s += '<rect x="' + (36 + c * sz) + '" y="' + (12 + (5 - r) * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1.5"/>';
    PLACES.forEach(function (p) { s += '<rect x="' + (38 + p[0] * sz) + '" y="' + (14 + (5 - p[1]) * sz) + '" width="' + (sz - 4) + '" height="' + (sz - 4) + '" rx="8" style="fill:color-mix(in srgb,var(--sc) 26%,var(--card))"/><text x="' + (36 + p[0] * sz + sz / 2) + '" y="' + (12 + (5 - p[1]) * sz + sz - 8) + '" text-anchor="middle" font-size="12" class="tb">' + p[2] + '</text>'; });
    var C = function (p) { return [36 + p[0] * sz + sz / 2, 12 + (5 - p[1]) * sz + sz / 2]; };
    if (path.length > 1) s += '<polyline points="' + path.map(function (p) { return C(p).join(','); }).join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>';
    var st = C(path[0]), e = C(path[path.length - 1]);
    s += '<circle cx="' + st[0] + '" cy="' + st[1] + '" r="9" style="fill:var(--card);stroke:' + INK + '" stroke-width="3"/>';
    s += '<g transform="translate(' + e[0] + ' ' + e[1] + ') rotate(' + dir * 90 + ')"><polygon points="0,-20 15,14 0,6 -15,14" style="fill:var(--hi);stroke:' + INK + '" stroke-width="2.5" stroke-linejoin="round"/></g>';
    if (hits) for (var hc = 0; hc < 6; hc++) for (var hr = 0; hr < 6; hr++) s += '<rect data-hit="' + cell(hc, hr) + '" aria-label="' + cell(hc, hr) + '" x="' + (36 + hc * sz) + '" y="' + (12 + (5 - hr) * sz) + '" width="' + sz + '" height="' + sz + '" fill="transparent" style="cursor:pointer"/>';
    return A.svg(W, H, s, label || 'Map with columns A to F and rows 1 to 6. You start at ' + cell(path[0][0], path[0][1]) + ', facing ' + DN[dir] + '.');
  }
  /* walk ['forward 2', 'right', 'forward 1'] from x, y facing d. Returns [x, y, d, path] */
  function walk(x, y, d, acts) {
    var path = [[x, y]];
    acts.forEach(function (t) {
      if (t === 'right') d = (d + 1) % 4; else if (t === 'left') d = (d + 3) % 4; else if (t === 'half') d = (d + 2) % 4;
      else for (var i = +t.split(' ')[1]; i > 0; i--) { x += MOVE[d][0]; y += MOVE[d][1]; path.push([x, y]); }
    });
    return [x, y, d, path];
  }
  function on(e) { return e[0] >= 0 && e[0] <= 5 && e[1] >= 0 && e[1] <= 5; }
  function say(acts) { return acts.map(function (t) { return t === 'right' || t === 'left' ? 'make a quarter turn ' + t : t === 'half' ? 'make a half turn' : 'go ' + t; }).join(', then '); }
  function route(lv) {
    for (;;) {
      var x = R.int(0, 5), y = R.int(0, 5), d = lv === 1 ? 0 : R.int(0, 3), acts = ['forward ' + R.int(1, 3)];
      var legs = lv === 1 ? 1 : lv === 2 ? R.int(1, 2) : 2;
      for (var i = 0; i < legs; i++) acts.push(R.pick(['right', 'left']), 'forward ' + R.int(1, lv === 3 ? 4 : 3));
      var e = walk(x, y, d, acts);
      if (on(e) && e[3].every(on) && (e[0] !== x || e[1] !== y)) return { x: x, y: y, d: d, acts: acts, end: e };
    }
  }
  function compass(dir, lab) {
    var s = '<circle cx="120" cy="120" r="88" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
    ['N', 'E', 'S', 'W'].forEach(function (l, i) { var t = -Math.PI / 2 + i * Math.PI / 2; s += '<text x="' + Math.round(120 + 104 * Math.cos(t)) + '" y="' + Math.round(127 + 104 * Math.sin(t)) + '" text-anchor="middle" font-size="20" class="tb">' + l + '</text>'; });
    s += '<g style="transition:transform .5s ease;transform-origin:120px 120px;transform:rotate(' + dir * 90 + 'deg)"><polygon points="120,48 142,128 120,112 98,128" style="fill:var(--hi);stroke:' + INK + '" stroke-width="2.5" stroke-linejoin="round"/></g>';
    return A.svg(240, 244, s, lab || 'An arrow facing ' + DN[((dir % 4) + 4) % 4]);
  }
  function compassPic() {
    var s = '<circle cx="130" cy="130" r="70" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
    DN.forEach(function (d, i) {
      var t = -Math.PI / 2 + i * Math.PI / 2, x = Math.round(130 + 96 * Math.cos(t)), y = Math.round(130 + 96 * Math.sin(t));
      s += '<g data-hit="' + d + '" aria-label="' + d + '" style="cursor:pointer"><circle cx="' + x + '" cy="' + y + '" r="31" style="fill:color-mix(in srgb,var(--strand) 12%,var(--card));stroke:var(--strand)" stroke-width="2"/><text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" font-size="18" class="tb">' + cap(d) + '</text></g>';
    });
    return A.svg(260, 260, s, 'Tap north, east, south or west.');
  }
  var TURN = { 'quarter turn right': 1, 'half turn': 2, 'quarter turn left': 3 };

  /* a Watch or My turn clip: list = [[line, change to the picture (or a list of changes), ms], ...] */
  function sym(s) { return s.sym ? '<p class="g3-sym">' + s.sym + '</p>' : ''; }
  function clip(draw, start, list) {
    return { mount: G3.view(function (s) { return '<div>' + draw(s) + sym(s) + '</div>'; }, start), steps: list.map(function (s) {
      var st = { say: s[0], ms: s[2] || 1900 }, p = s[1];
      if (p) st.act = function (t) { return Array.isArray(p) ? t.seq(p, 900) : t.set(p, 700); };
      return st;
    }) };
  }

  /* ---------- skills: one per idea. DEF[id] = [[minLevel, shape, fn(lv), maxLevel], ...], the first is "plain" ---------- */
  var DEF = {}, SKILLS = [];
  function skill(id, name, code, list) { DEF[id] = list; SKILLS.push({ id: id, name: name, code: code }); }
  function ck(id, shape, lv) { return function () { var s = DEF[id].filter(function (x) { return x[1] === shape; })[0], q = s[2](lv); q.shape = shape; return q; }; }

  /* ======================= Lesson 1: 3D objects ======================= */
  /* ---------- Count the flat faces ---------- */
  var FK = { 1: ['cube', 'rprism', 'tprism'], 2: POLY, 3: POLY.concat(['cyl', 'cone']) };
  function seeFix(k) { var f = {}; if (!S[k].see) return f; f[S[k].see] = 'Those are the faces you can see. Count the hidden ones at the back and bottom too.'; return f; }
  function facesTotal(lv) {
    var n = lv === 3 ? 3 : 2, ks = [];
    for (var i = 0; i < n; i++) ks.push(R.pick(lv === 1 ? ['cube', 'tprism', 'spyr'] : ALL));
    return ks;
  }
  skill('sh-faces', 'Count the flat faces', 'E1.1', [
    [1, 'plain', function (lv) {
      var k = R.pick(FK[lv]);
      return num('How many <b>flat faces</b> does this ' + nm(k) + ' have?', S[k].f, seeFix(k), { fig: solid(k, 'f'),
        hint: 'Count the faces you see. Then add the hidden ones at the back and bottom.', steps: [S[k].see ? 'You can see ' + S[k].see + '.' : 'The flat faces are the circles.', 'A ' + nm(k) + ' has ' + pl(S[k].f, 'flat face') + ' in all.'], explain: 'A ' + nm(k) + ' has ' + pl(S[k].f, 'flat face') + '.', meta: { k: 'g3sh-f-num', names: [nm(k)] } });
    }],
    [1, 'fill', function (lv) {
      var k = R.pick(lv === 1 ? ['cube', 'rprism', 'tprism'] : lv === 2 ? ['tprism', 'spyr', 'cyl'] : ['tprism', 'spyr', 'tpyr', 'cone']);
      return fill('Look at the ' + nm(k) + '. Fill in the blanks.', S[k].parts, S[k].pa.slice(), { fig: solid(k, 'f'),
        hint: 'Name each kind of face, then count it. Dashed lines show the back.', steps: ['Count each kind of face, front and back.'], explain: fillText(S[k].parts, S[k].pa), meta: { k: 'g3sh-f-fill', name: nm(k) } });
    }],
    [1, 'tap', function (lv) {
      var seen = {}, set = [];
      R.shuffle(lv === 1 ? POLY : ALL).forEach(function (k) { if (set.length < 3 && !seen[S[k].f]) { seen[S[k].f] = 1; set.push(k); } });
      var k = R.pick(set), tiles = set.map(small), ans = set.indexOf(k);
      return { q: 'Tap the object with <b>' + pl(S[k].f, 'flat face') + '</b>.', type: 'tap', tiles: tiles, answer: ans, answerText: 'the ' + nm(k), wrong: tileFix(tiles, ans, function (i) { return 'That ' + nm(set[i]) + ' has ' + pl(S[set[i]].f, 'flat face') + '.'; }),
        hint: 'Count the faces on each one, hidden ones too.', steps: ['A ' + nm(k) + ' has ' + pl(S[k].f, 'flat face') + '.'], explain: 'The ' + nm(k) + '.', meta: { k: 'g3sh-f-tap', names: set.map(nm), n: S[k].f } };
    }],
    [1, 'everyday', function (lv) {
      var e = R.pick(EVERY.filter(function (x) { return FK[lv].indexOf(x[1]) >= 0; })), k = e[1];
      return num(cap(e[0]) + ' is shaped like ' + a(k) + '. How many flat faces does it have?', S[k].f, seeFix(k), { fig: small(k),
        hint: 'Picture it in your hand. Turn it over and count.', steps: ['It is ' + a(k) + '.', 'Flat faces: ' + S[k].f + '.'], explain: pl(S[k].f, 'flat face') + '.', meta: { k: 'g3sh-f-num', names: [nm(k)] } });
    }],
    [2, 'tf', function (lv) {
      var k = R.pick(lv === 2 ? POLY : POLY.concat(['cyl'])), who = Q.name(), truth = coin(), said = truth ? S[k].f : (S[k].see ? S[k].see : S[k].f + 1);
      return tf(who + ' looks at this ' + nm(k) + ' and says it has <b>' + pl(said, 'flat face') + '</b>. True or false: ' + who + ' is right.', truth, 'Count the hidden faces too: a ' + nm(k) + ' has ' + pl(S[k].f, 'flat face') + '.',
        ['Only the faces you can see count.', 'Count the corners to find the faces.', 'Every object has 6 faces.'], 'Count again, front, back and bottom.', { fig: small(k), hint: 'Do not forget the back and the bottom.', meta: { k: 'g3sh-f-tf', name: nm(k), said: said } });
    }],
    [2, 'total', function (lv) {
      var ks = facesTotal(lv), who = Q.name(), t = ks.reduce(function (s, k) { return s + S[k].f; }, 0), f = {};
      f[ks.length * 6] = 'Not every object has 6 faces. Count each one.';
      return num(who + ' has ' + ks.map(a).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. How many flat faces do they have <b>in all</b>?', t, f, { fig: lineUp(ks),
        hint: 'Count the flat faces on each object. Then add.', steps: ks.map(function (k) { return cap(nm(k)) + ': ' + S[k].f + '.'; }).concat([ks.map(function (k) { return S[k].f; }).join(' + ') + ' = ' + t + '.']), explain: t + ' flat faces in all.', meta: { k: 'g3sh-f-num', names: ks.map(nm) } });
    }]
  ]);
  function tgFaces(k) {
    return function () {
      var key = k || R.pick(POLY), d = S[key], f1 = {}, f3 = {};
      f1[d.f] = 'That is all of them. How many can you see in the picture?';
      f3[d.see] = 'Add the hidden ones.';
      return { q: 'How many flat faces does this ' + d.name + ' have?', fig: solid(key, 'f'), done: 'A ' + d.name + ' has ' + pl(d.f, 'flat face') + '.', steps: [
        { prompt: 'Count the faces you can see.', q: num('How many faces can you see?', d.see, f1, { hint: 'The shaded faces are the ones in front.', meta: { k: 'g3sh-f-see', name: d.name } }) },
        { prompt: 'The dashed lines show faces at the back and bottom.', q: num('How many faces are hidden?', d.f - d.see, {}, { hint: 'Picture turning it around.', meta: { k: 'g3sh-f-hid', name: d.name } }) },
        { prompt: 'Add them.', q: num(d.see + ' + ' + (d.f - d.see) + ' = ?', d.f, f3, { hint: 'Seen plus hidden.', meta: { k: 'g3sh-f-num', names: [d.name] } }) }
      ] };
    };
  }

  /* ---------- Edges and vertices ---------- */
  var EK = { 1: ['cube', 'rprism', 'tprism'], 2: POLY, 3: POLY };
  var PART = { e: ['edge', 'edges'], v: ['vertex', 'vertices'] };
  function grp(k, p) { return S[k]['g' + p]; }
  function edgeFix(k, p) { var f = {}, o = p === 'e' ? 'v' : 'e'; f[S[k][o]] = 'That is the number of ' + PART[o][1] + '. ' + cap(PART[p][1]) + (p === 'e' ? ' are where two faces meet.' : ' are corners.'); f[S[k].f] = 'That is the faces.'; return f; }
  skill('sh-edges', 'Count edges and vertices', 'E1.1', [
    [1, 'plain', function (lv) {
      var k = R.pick(EK[lv]);
      return num('How many <b>edges</b> does this ' + nm(k) + ' have?', S[k].e, edgeFix(k, 'e'), { fig: lv < 3 ? solid(k, 'e') : solid(k, ''),
        hint: 'An edge is where two faces meet. Count the dashed ones too.', steps: grp(k, 'e').map(function (g) { return g[1].length + ' ' + g[0] + '.'; }).concat([grp(k, 'e').map(function (g) { return g[1].length; }).join(' + ') + ' = ' + S[k].e + '.']), explain: pl(S[k].e, 'edge') + '.', meta: { k: 'g3sh-e-num', names: [nm(k)], part: 'e' } });
    }],
    [1, 'vertices', function (lv) {
      var k = R.pick(EK[lv]);
      return num('How many <b>vertices</b> (corners) does this ' + nm(k) + ' have?', S[k].v, edgeFix(k, 'v'), { fig: lv < 3 ? solid(k, 'v') : solid(k, ''),
        hint: 'A vertex is a corner. Count the back ones too.', steps: grp(k, 'v').map(function (g) { return g[1].length + ' ' + g[0] + '.'; }).concat([grp(k, 'v').map(function (g) { return g[1].length; }).join(' + ') + ' = ' + S[k].v + '.']), explain: pl(S[k].v, 'vertex', 'vertices') + '.', meta: { k: 'g3sh-e-num', names: [nm(k)], part: 'v' } });
    }],
    [1, 'order', function (lv) {
      var k = R.pick(EK[lv]), g = grp(k, 'e');
      return fill('Count the edges of the ' + nm(k) + ' in order.', g.map(function (x) { return '[[]] ' + x[0]; }).join(' + ') + ' = [[]] edges', g.map(function (x) { return x[1].length; }).concat([S[k].e]), { fig: solid(k, 'e'),
        hint: 'Go around one end first, then the other, then the edges that join them.', steps: [g.map(function (x) { return x[1].length; }).join(' + ') + ' = ' + S[k].e + '.'], explain: pl(S[k].e, 'edge') + '.', meta: { k: 'g3sh-e-order', name: nm(k) } });
    }],
    [1, 'tap', function (lv) {
      var p = lv === 1 ? 'v' : R.pick(['e', 'v']), seen = {}, set = [];
      R.shuffle(POLY).forEach(function (k) { if (set.length < 3 && !seen[S[k][p]]) { seen[S[k][p]] = 1; set.push(k); } });
      var k = R.pick(set), tiles = set.map(small), ans = set.indexOf(k);
      return { q: 'Tap the object with <b>' + pl(S[k][p], PART[p][0], PART[p][1]) + '</b>.', type: 'tap', tiles: tiles, answer: ans, answerText: 'the ' + nm(k), wrong: tileFix(tiles, ans, function (i) { return 'That ' + nm(set[i]) + ' has ' + pl(S[set[i]][p], PART[p][0], PART[p][1]) + '.'; }),
        hint: 'Count on each one. Remember the hidden back.', steps: ['A ' + nm(k) + ' has ' + pl(S[k][p], PART[p][0], PART[p][1]) + '.'], explain: 'The ' + nm(k) + '.', meta: { k: 'g3sh-e-tap', names: set.map(nm), part: p, n: S[k][p] } };
    }],
    [2, 'tf', function (lv) {
      var k = R.pick(POLY), p = R.pick(['e', 'v']), o = p === 'e' ? 'v' : 'e', who = Q.name(), truth = coin(), said = truth ? S[k][p] : S[k][o];
      return tf(who + ' says a ' + nm(k) + ' has <b>' + pl(said, PART[p][0], PART[p][1]) + '</b>. True or false: ' + who + ' is right.', truth, 'A ' + nm(k) + ' has ' + S[k].e + ' edges and ' + S[k].v + ' vertices.',
        ['Edges and vertices are the same thing.', 'Only count what you can see.', 'Every object has 8 ' + PART[p][1] + '.'], 'Edges are where faces meet. Vertices are corners. Count again.', { fig: small(k), hint: 'Edges are lines. Vertices are points.', meta: { k: 'g3sh-e-tf', name: nm(k), part: p, said: said } });
    }],
    [3, 'total', function (lv) {
      var ks = R.shuffle(POLY).slice(0, 2), p = R.pick(['e', 'v']), t = S[ks[0]][p] + S[ks[1]][p];
      return num('How many <b>' + PART[p][1] + '</b> do ' + a(ks[0]) + ' and ' + a(ks[1]) + ' have in all?', t, {}, { fig: lineUp(ks),
        hint: 'Find each one, then add.', steps: [cap(nm(ks[0])) + ': ' + S[ks[0]][p] + '. ' + cap(nm(ks[1])) + ': ' + S[ks[1]][p] + '.', S[ks[0]][p] + ' + ' + S[ks[1]][p] + ' = ' + t + '.'], explain: t + ' ' + PART[p][1] + ' in all.', meta: { k: 'g3sh-e-num', names: ks.map(nm), part: p } });
    }]
  ]);
  function tgEdges(keys) {
    return function () {
      var k = R.pick(keys), g = grp(k, 'e'), steps = [], fig = solid(k, '');
      g.forEach(function (x, i) {
        steps.push({ prompt: i === 0 ? 'Start with the edges ' + x[0] + '.' : 'Now the edges ' + x[0] + '.', q: num('How many edges ' + x[0] + '?', x[1].length, {}, { fig: solid(k, '', 60, 230, null, { e: x[1] }), hint: 'Count the red edges, dashed ones too.', meta: { k: 'g3sh-e-group', name: nm(k), g: i } }) });
      });
      steps.push({ prompt: 'Add the groups.', q: num(g.map(function (x) { return x[1].length; }).join(' + ') + ' = ?', S[k].e, {}, { hint: 'Add them up.', meta: { k: 'g3sh-e-num', names: [nm(k)], part: 'e' } }) });
      return { q: 'Count the edges of this ' + nm(k) + ', in order.', fig: fig, done: 'A ' + nm(k) + ' has ' + S[k].e + ' edges.', steps: steps };
    };
  }

  /* ---------- Prism or pyramid ---------- */
  var KIND_ANS = { prism: 'Prism', pyramid: 'Pyramid', curved: 'Neither' };
  var POLYN = { 3: 'triangle', 4: 'square', 5: 'pentagon (5 sides)', 6: 'hexagon (6 sides)' };
  function kindFix(k) {
    return { Prism: S[k].kind === 'pyramid' ? 'A prism has two matching ends. This one has one base and a point.' : 'It has curved parts. Prisms have only flat faces.',
      Pyramid: S[k].kind === 'prism' ? 'A pyramid ends in a point. This one has two matching ends.' : 'It has a curved surface. Pyramids have only flat faces.',
      Neither: 'Look again: every face is flat.' };
  }
  function kindQ(q, k, x) {
    var f = kindFix(k), right = KIND_ANS[S[k].kind], opts = ['Prism', 'Pyramid', 'Neither'], w = {};
    opts.forEach(function (o) { if (o !== right) w[o] = f[o]; });
    return put({ q: q, type: 'mc', options: opts, answer: opts.indexOf(right), wrong: w }, x);
  }
  function nameWrongs(k) {
    return ALL.filter(function (x) { return x !== k; }).map(function (x) {
      return [nm(x), S[x].kind !== S[k].kind ? (S[k].kind === 'prism' ? 'It has two matching ends, so it is a prism.' : S[k].kind === 'pyramid' ? 'It has one base and a point, so it is a pyramid.' : 'It has a curved surface.') : 'Look at the shape of the base.'];
    });
  }
  skill('sh-kind', 'Prism or pyramid?', 'E1.1', [
    [1, 'plain', function (lv) {
      var k = R.pick(lv === 1 ? POLY : ALL);
      return kindQ('Is this object a prism or a pyramid?', k, { fig: small(k), hint: 'Two matching ends: prism. One base and a point: pyramid.', steps: [S[k].kind === 'prism' ? 'It has two matching ends.' : S[k].kind === 'pyramid' ? 'It has one base, and its triangles meet at a point.' : 'It has a curved surface, so it is neither.'],
        explain: 'It is ' + a(k) + '.', meta: { k: 'g3sh-k-kind', name: nm(k) } });
    }],
    [1, 'name', function (lv) {
      var k = R.pick(lv === 1 ? POLY : ALL);
      return mc('What is this object called?', nm(k), R.shuffle(nameWrongs(k)), { fig: small(k), hint: 'Prism or pyramid? Then look at the shape of the base.', steps: ['It is ' + a(k) + '.'], explain: 'It is ' + a(k) + '.', meta: { k: 'g3sh-k-name', name: nm(k) } });
    }],
    [1, 'base', function (lv) {
      var k = R.pick(POLY), b = S[k].base;
      return mc('What shape is the base of this ' + (lv === 1 ? 'object' : S[k].kind) + '?', b, [['triangle', 'Look at the end it stands on.'], ['square', 'Look at the end it stands on.'], ['rectangle', 'Look at the end it stands on.'], ['circle', 'Circles are on cylinders and cones.']].filter(function (w) { return w[0] !== b; }),
        { fig: small(k), hint: 'The base gives the object its name.', steps: ['The base is a ' + b + '.'], explain: 'A ' + b + ' base: ' + a(k) + '.', meta: { k: 'g3sh-k-base', name: nm(k) } });
    }],
    [1, 'sides', function (lv) {
      var n = R.pick(lv === 1 ? [3, 4] : [3, 4, 5, 6]), kind = R.pick(['prism', 'pyramid']), ans = n, f = {};
      f[n + (kind === 'prism' ? 2 : 1)] = 'That counts every face. Count only the ' + (kind === 'prism' ? 'rectangles' : 'triangles') + '.';
      return num('A ' + kind + ' has a ' + POLYN[n] + ' ' + (kind === 'prism' ? 'at each end' : 'base') + '. How many <b>' + (kind === 'prism' ? 'rectangle' : 'triangle') + '</b> faces does it have?', ans, f, { fig: n <= 4 ? small(n === 3 ? (kind === 'prism' ? 'tprism' : 'tpyr') : kind === 'prism' ? 'cube' : 'spyr') : '',
        hint: 'One ' + (kind === 'prism' ? 'rectangle' : 'triangle') + ' for each side of the base.', steps: ['The base has ' + n + ' sides.', 'So ' + n + ' ' + (kind === 'prism' ? 'rectangles' : 'triangles') + '.'], explain: n + ' ' + (kind === 'prism' ? 'rectangles' : 'triangles') + '.', meta: { k: 'g3sh-k-sides', kind: kind, n: n, ask: 'side' } });
    }],
    [2, 'tf', function (lv) {
      var k = R.pick(POLY), who = Q.name(), truth = coin(), said = truth ? nm(k) : nm(R.pick(POLY.filter(function (x) { return x !== k && (S[x].base === S[k].base || S[x].kind === S[k].kind); })));
      return tf(who + ' says this is a <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, 'It ' + (S[k].kind === 'prism' ? 'has two matching ' + S[k].base + ' ends' : 'has one ' + S[k].base + ' base and a point') + ': ' + a(k) + '.',
        ['Any object with triangles is a pyramid.', 'The side faces give the name.', 'Prisms always have a point.'], 'Prism or pyramid? Then what shape is the base?', { fig: small(k), hint: 'Check the ends, then the base.', meta: { k: 'g3sh-k-tf', name: nm(k), said: said } });
    }],
    [2, 'pick', function (lv) {
      var want = R.pick(['prism', 'pyramid']), opts = R.shuffle(lv === 3 ? ALL : POLY).slice(0, 5), ans = [];
      opts.forEach(function (k, j) { if (S[k].kind === want) ans.push(j); });
      if (!ans.length || ans.length === opts.length) { opts = ['cube', 'spyr', 'tprism', 'cyl']; ans = []; opts.forEach(function (k, j) { if (S[k].kind === want) ans.push(j); }); }
      return { q: 'Pick every <b>' + want + '</b>.', type: 'pick', options: opts.map(nm), answer: ans,
        hint: want === 'prism' ? 'Prisms have two matching ends.' : 'Pyramids have one base and a point.', steps: opts.map(function (k) { return cap(nm(k)) + ': ' + (S[k].kind === 'curved' ? 'curved' : S[k].kind) + '.'; }), explain: ans.map(function (j) { return nm(opts[j]); }).join(', ') + '.', meta: { k: 'g3sh-k-pick', want: want } };
    }],
    [3, 'all', function (lv) {
      var n = R.pick([3, 4, 5, 6]), kind = R.pick(['prism', 'pyramid']), ans = kind === 'prism' ? n + 2 : n + 1, f = {};
      f[n] = 'Add the ' + (kind === 'prism' ? '2 ends' : 'base') + ' too.';
      return num('A ' + kind + ' has a ' + POLYN[n] + ' ' + (kind === 'prism' ? 'at each end' : 'base') + '. How many flat faces does it have <b>in all</b>?', ans, f, {
        hint: 'Side faces: one for each side of the base. Then add the ' + (kind === 'prism' ? '2 ends' : 'base') + '.', steps: [n + ' ' + (kind === 'prism' ? 'rectangles' : 'triangles') + '.', n + ' + ' + (kind === 'prism' ? 2 : 1) + ' = ' + ans + '.'], explain: ans + ' flat faces.', meta: { k: 'g3sh-k-sides', kind: kind, n: n, ask: 'all' } });
    }]
  ]);
  function tgKind(keys) {
    return function () {
      var k = R.pick(keys), d = S[k], ends = d.kind === 'prism' ? 0 : 1;
      var o1 = ['Two matching ends', 'One base and a point'], o2 = ['triangle', 'square', 'rectangle'];
      return { q: 'What is this object?', fig: small(k), done: 'It is ' + a(k) + '.', steps: [
        { prompt: 'Look at the ends.', q: put({ q: 'What does it have?', type: 'mc', options: o1, answer: ends, wrong: (function () { var w = {}; w[o1[1 - ends]] = ends ? 'Look for the point at the top.' : 'Both ends match. There is no point.'; return w; })() }, { hint: 'Is there a point?', meta: { k: 'g3sh-k-ends', name: d.name } }) },
        { prompt: 'Now the base.', q: mc('What shape is the base?', d.base, o2.filter(function (x) { return x !== d.base; }).map(function (x) { return [x, 'Count the sides of the end it stands on.']; }), { hint: 'Count its sides and corners.', meta: { k: 'g3sh-k-base', name: d.name } }) },
        { prompt: 'Put the two together.', q: mc('So it is a...', d.name, R.shuffle(POLY.filter(function (x) { return x !== k; })).map(function (x) { return [nm(x), S[x].kind !== d.kind ? 'Check the ends again.' : 'Check the base shape again.']; }), { hint: 'Base shape, then prism or pyramid.', meta: { k: 'g3sh-k-name', name: d.name } }) }
      ] };
    };
  }

  /* ---------- Curved surfaces ---------- */
  var CF = { flat: ['f', 'flat face', 'flat faces'], point: ['pt', 'point', 'points'], curved: ['cs', 'curved surface', 'curved surfaces'] };
  function curvedSet(lv) {
    var c = { cyl: R.int(lv === 3 ? 2 : 1, lv === 1 ? 2 : 4), cone: R.int(lv === 3 ? 2 : 1, lv === 1 ? 2 : 4) };
    if (lv > 1 && coin()) c.cube = R.int(1, 2);
    return c;
  }
  function setText(c) { var p = []; Object.keys(c).forEach(function (k) { p.push(pl(c[k], nm(k))); }); return p.length > 1 ? p.slice(0, -1).join(', ') + ' and ' + p[p.length - 1] : p[0]; }
  function setCount(c, ask) { var t = 0; Object.keys(c).forEach(function (k) { t += c[k] * (ask === 'flat' ? S[k].f : ask === 'point' ? (S[k].pt || 0) : (S[k].cs || 0)); }); return t; }
  skill('sh-curved', 'Curved surfaces', 'E1.1', [
    [1, 'plain', function (lv) {
      var k = R.pick(['cyl', 'cone']), f = {};
      f[k === 'cyl' ? 3 : 2] = 'The curved surface is not a flat face.';
      return num('How many <b>flat faces</b> does this ' + nm(k) + ' have?', S[k].f, f, { fig: solid(k, 'f'),
        hint: 'Flat faces are circles here. The curved part does not count.', steps: ['The flat faces are the circles.', pl(S[k].f, 'circle') + '.'], explain: pl(S[k].f, 'flat face') + ', and 1 curved surface.', meta: { k: 'g3sh-c-num', c: (function () { var c = {}; c[k] = 1; return c; })(), ask: 'flat' } });
    }],
    [1, 'fill', function (lv) {
      var k = R.pick(['cyl', 'cone']);
      return fill('Look at the ' + nm(k) + '. Fill in the blanks.', S[k].parts, S[k].pa.slice(), { fig: solid(put({ hc: 1, hp: 1 }, S[k]), 'f'),
        hint: 'Count the flat circles, the curved surface, and any point.', steps: [k === 'cyl' ? '2 circles, 1 curved surface, no point.' : '1 circle, 1 curved surface, 1 point.'], explain: k === 'cyl' ? '2 flat faces and 1 curved surface.' : '1 flat face, 1 curved surface and 1 point.', meta: { k: 'g3sh-c-fill', name: nm(k) } });
    }],
    [1, 'which', function (lv) {
      var c = R.pick([['has a curved surface and a point', 'cone'], ['has a curved surface and no point', 'cyl'], ['has 2 flat faces that are circles', 'cyl'], ['has only 1 flat face', 'cone']]);
      var pool = lv === 1 ? ['cyl', 'cone', 'cube'] : ['cyl', 'cone', 'spyr', 'tprism'];
      return mc('Which object <b>' + c[0] + '</b>?', nm(c[1]), pool.filter(function (x) { return x !== c[1]; }).map(function (x) { return [nm(x), S[x].kind === 'curved' ? 'Check the clue again: count the circles and look for a point.' : 'A ' + nm(x) + ' has only flat faces.']; }),
        { hint: 'Picture each object. Does it roll? Does it have a point?', steps: ['A cylinder: 2 circles, no point. A cone: 1 circle and a point.'], explain: 'A ' + nm(c[1]) + '.', meta: { k: 'g3sh-c-which', clue: c[0] } });
    }],
    [2, 'pick', function (lv) {
      var opts = R.shuffle(ALL).slice(0, 5), ans = [];
      if (opts.indexOf('cyl') < 0 && opts.indexOf('cone') < 0) opts[0] = R.pick(['cyl', 'cone']);
      opts.forEach(function (k, j) { if (S[k].kind === 'curved') ans.push(j); });
      return { q: 'Pick every object with a <b>curved surface</b>.', type: 'pick', options: opts.map(nm), answer: ans,
        hint: 'Which ones could roll?', steps: ['Cylinders and cones have a curved surface.'], explain: ans.map(function (j) { return nm(opts[j]); }).join(' and ') + '.', meta: { k: 'g3sh-c-pick' } };
    }],
    [2, 'tf', function (lv) {
      var k = R.pick(['cyl', 'cone']), ask = R.pick(['flat', 'point']), who = Q.name(), truth = coin(), one = {}, right, said;
      one[k] = 1; right = setCount(one, ask); said = truth ? right : right === 0 ? 1 : ask === 'flat' ? right + 1 : 0;
      return tf(who + ' says a ' + nm(k) + ' has <b>' + pl(said, CF[ask][1], CF[ask][2]) + '</b>. True or false: ' + who + ' is right.', truth, 'A ' + nm(k) + ' has ' + (k === 'cyl' ? '2 flat faces, 1 curved surface and no point' : '1 flat face, 1 curved surface and 1 point') + '.',
        ['The curved surface counts as a flat face.', 'Every object has a point.', 'A cylinder has a point at each end.'], 'Look again: count the circles, and look for a point.', { fig: small(k), hint: 'Circles are flat. The side is curved.', meta: { k: 'g3sh-c-tf', name: nm(k), ask: ask, said: said } });
    }],
    [2, 'count', function (lv) {
      var c = curvedSet(lv), ask = lv === 2 ? R.pick(['flat', 'point']) : R.pick(['flat', 'curved', 'point']), t = setCount(c, ask), who = Q.name(), f = {};
      f[Object.keys(c).reduce(function (s, k) { return s + c[k]; }, 0)] = 'That counts the objects. Count the ' + CF[ask][2] + ' on each one.';
      return num(who + ' has ' + setText(c) + '. How many <b>' + CF[ask][2] + '</b> are there in all?', t, f, { fig: (function () { var ks = [].concat.apply([], Object.keys(c).map(function (k) { return Array.apply(null, Array(c[k])).map(function () { return k; }); })); return ks.length <= 5 ? lineUp(ks) : ''; })(),
        hint: 'Find how many one object has. Then count by that for each kind.', steps: Object.keys(c).map(function (k) { var each = ask === 'flat' ? S[k].f : ask === 'point' ? (S[k].pt || 0) : (S[k].cs || 0); return c[k] + ' &times; ' + each + ' = ' + c[k] * each + ' (' + nm(k) + 's)'; }).concat([t + ' in all.']), explain: t + ' ' + CF[ask][2] + '.', meta: { k: 'g3sh-c-num', c: c, ask: ask } });
    }]
  ]);
  function tgCurved(k) {
    return function () {
      var key = k || R.pick(['cyl', 'cone']), d = S[key], f2 = {};
      f2[d.f + 1] = 'The curved surface is not flat.';
      return { q: 'Describe this ' + d.name + '.', fig: solid(put({ hc: 1, hp: 1 }, d), 'f'), done: 'A ' + d.name + ': ' + (key === 'cyl' ? '2 flat faces, 1 curved surface, no point.' : '1 flat face, 1 curved surface, 1 point.'), steps: [
        { prompt: 'Run a finger around the side.', q: put({ q: 'Is the side flat or curved?', type: 'mc', options: ['Flat', 'Curved'], answer: 1, wrong: { Flat: 'It bends all the way around. It could roll.' } }, { hint: 'Could it roll?', meta: { k: 'g3sh-c-yes', name: d.name } }) },
        { prompt: 'Now count the flat circles.', q: num('How many flat faces?', d.f, f2, { hint: 'Count the circles.', meta: { k: 'g3sh-c-num', c: (function () { var c = {}; c[key] = 1; return c; })(), ask: 'flat' } }) },
        { prompt: 'Look at the top.', q: num('How many points?', d.pt, {}, { hint: 'A point is where it comes to a tip.', meta: { k: 'g3sh-c-num', c: (function () { var c = {}; c[key] = 1; return c; })(), ask: 'point' } }) }
      ] };
    };
  }

  /* ---------- Which object is it? (look-alikes mixed) ---------- */
  /* clues: [id, words, the object]; the answer checks keep their own copy of what each clue means */
  var CLUES = [
    ['c6sq', 'I have 6 flat faces. They are all squares.', 'cube'], ['c6re', 'I have 6 flat faces. They are rectangles, not squares.', 'rprism'],
    ['c5re', 'I have 5 flat faces. 3 of them are rectangles.', 'tprism'], ['c5pt', 'I have 5 flat faces and a point.', 'spyr'],
    ['c4tr', 'I have 4 flat faces. They are all triangles.', 'tpyr'], ['c8v', 'I have 8 vertices and every face is a square.', 'cube'],
    ['c6v', 'I have 6 vertices and 9 edges.', 'tprism'], ['c5v', 'I have 5 vertices and 8 edges.', 'spyr'],
    ['ccy', 'I have a curved surface and 2 flat faces.', 'cyl'], ['cco', 'I have a curved surface and a point.', 'cone']
  ];
  var LOOK = { cube: 'rprism', rprism: 'cube', tprism: 'spyr', spyr: 'tprism', tpyr: 'spyr', cyl: 'cone', cone: 'cyl' };
  function clue(lv) { return R.pick(lv === 1 ? CLUES.slice(0, 5).concat(CLUES.slice(8)) : CLUES); }
  skill('sh-which', 'Which object is it?', 'E1.1', [
    [1, 'plain', function (lv) {
      var c = clue(lv), k = c[2], pool = R.shuffle(ALL.filter(function (x) { return x !== k && x !== LOOK[k]; })).slice(0, 2).concat([LOOK[k]]);
      return mc(c[1] + ' What am I?', nm(k), pool.map(function (x) { return [nm(x), 'Check every part of the clue against ' + a(x) + '.']; }), { fig: lineUp([k, LOOK[k]], ['?', '?']).replace(/aria-label="[^"]*"/, 'aria-label="Two objects that look alike"'),
        hint: 'Two objects are close. Which part of the clue tells them apart?', steps: ['The look-alike is ' + a(LOOK[k]) + '.', 'Only ' + a(k) + ' fits every part.'], explain: 'A ' + nm(k) + '.', meta: { k: 'g3sh-w-mc', clue: c[0] } });
    }],
    [1, 'tap', function (lv) {
      var c = clue(lv), k = c[2], set = R.shuffle([k, LOOK[k], R.pick(ALL.filter(function (x) { return x !== k && x !== LOOK[k]; }))]), tiles = set.map(small), ans = set.indexOf(k);
      return { q: c[1] + ' Tap me.', type: 'tap', tiles: tiles, answer: ans, answerText: 'the ' + nm(k), wrong: tileFix(tiles, ans, function (i) { return 'That is ' + a(set[i]) + '. Check the clue again.'; }),
        hint: 'Check each part of the clue.', steps: ['It is ' + a(k) + '.'], explain: 'The ' + nm(k) + '.', meta: { k: 'g3sh-w-tap', clue: c[0], names: set.map(nm) } };
    }],
    [1, 'corners', function (lv) {
      var k = R.pick(lv === 1 ? ['cube', 'rprism', 'tprism'] : POLY), f = {};
      f[S[k].f] = 'That is every face. Count only faces with 4 square corners.';
      return num('How many faces of this ' + nm(k) + ' have <b>4 square corners</b>?', S[k].sq, f, { fig: solid(k, 'f'),
        hint: 'Squares and rectangles have 4 square corners. The triangles here have none.', steps: [k === 'tprism' ? '3 rectangles, 2 triangles.' : k === 'spyr' ? '1 square base, 4 triangles.' : k === 'tpyr' ? '4 triangles.' : 'Every face is a ' + (k === 'cube' ? 'square' : 'rectangle') + '.', 'So ' + S[k].sq + '.'], explain: S[k].sq + '.', meta: { k: 'g3sh-w-sqc', name: nm(k) } });
    }],
    [2, 'compare', function (lv) {
      var p = R.pick(['f', 'e', 'v']), ks;
      do { ks = R.shuffle(POLY).slice(0, 2); } while (S[ks[0]][p] === S[ks[1]][p]);
      if (S[ks[0]][p] < S[ks[1]][p]) ks.reverse();
      var w = { f: ['flat face', 'flat faces'], e: PART.e, v: PART.v }[p], d = S[ks[0]][p] - S[ks[1]][p], f = {};
      f[S[ks[0]][p] + S[ks[1]][p]] = 'That adds them. "How many more" means take away.';
      return num('How many more <b>' + w[1] + '</b> does ' + a(ks[0]) + ' have than ' + a(ks[1]) + '?', d, f, { fig: lineUp(ks),
        hint: 'Find each number, then subtract.', steps: [cap(nm(ks[0])) + ': ' + S[ks[0]][p] + '. ' + cap(nm(ks[1])) + ': ' + S[ks[1]][p] + '.', S[ks[0]][p] + ' &minus; ' + S[ks[1]][p] + ' = ' + d + '.'], explain: d + ' more.', meta: { k: 'g3sh-w-cmp', a: nm(ks[0]), b: nm(ks[1]), part: p } });
    }],
    [2, 'tf', function (lv) {
      var c = R.pick(CLUES), who = Q.name(), truth = coin(), said = truth ? c[2] : LOOK[c[2]];
      return tf(c[1] + ' ' + who + ' says it is <b>' + a(said) + '</b>. True or false: ' + who + ' is right.', truth, 'Only ' + a(c[2]) + ' fits every part of the clue.',
        ['Close is good enough.', 'Any object with flat faces fits.', 'Look-alikes have the same name.'], 'Check every part of the clue, one at a time.', { fig: small(said), hint: 'Test each part of the clue.', meta: { k: 'g3sh-w-tf', clue: c[0], said: nm(said) } });
    }],
    [3, 'twostep', function (lv) {
      var k = R.pick(POLY), t = S[k].e - S[k].v, f = {};
      f[S[k].e + S[k].v] = 'That adds them. Take away instead.';
      return num(R.pick(CLUES.filter(function (c) { return c[2] === k; }))[1] + ' How many more edges than vertices do I have?', t, f, {
        hint: 'Name the object first. Then find its edges and vertices.', steps: ['It is ' + a(k) + ': ' + S[k].e + ' edges, ' + S[k].v + ' vertices.', S[k].e + ' &minus; ' + S[k].v + ' = ' + t + '.'], explain: t + ' more.', meta: { k: 'g3sh-w-cmp', a: nm(k), b: nm(k), part: 'ev' } });
    }]
  ]);
  function tgWhich(k) {
    return function () {
      var b = LOOK[k], c = R.pick(CLUES.filter(function (x) { return x[2] === k; })), fig = lineUp([k, b], ['A', 'B']);
      var tell = k === 'cube' || k === 'rprism' ? ['Are all its faces squares?', k === 'cube' ? 0 : 1, ['Yes, all squares', 'No, some are rectangles']]
        : k === 'cyl' || k === 'cone' ? ['Does it have a point?', k === 'cone' ? 0 : 1, ['Yes, a point', 'No point']]
          : ['Does it have a point?', S[k].kind === 'pyramid' ? 0 : 1, ['Yes, a point', 'No point']];
      var w2 = {}; w2[tell[2][1 - tell[1]]] = 'Look at object A again.';
      return { q: c[1] + ' Am I A or B?', fig: fig, done: 'A is the ' + nm(k) + ', B is the ' + nm(b) + '. The clue fits A.', steps: [
        { prompt: 'Both look alike. Start with A.', q: num('How many flat faces does A have?', S[k].f, {}, { hint: 'Count the hidden ones too.', meta: { k: 'g3sh-f-num', names: [nm(k)] } }) },
        { prompt: 'Find what tells them apart.', q: put({ q: tell[0] + ' (object A)', type: 'mc', options: tell[2], answer: tell[1], wrong: w2 }, { hint: 'Look closely at A.', meta: { k: 'g3sh-w-tell', name: nm(k), ask: tell[0] } }) },
        { prompt: 'Check the clue.', q: put({ q: 'Which one fits the clue?', type: 'mc', options: ['A: the ' + nm(k), 'B: the ' + nm(b)], answer: 0, wrong: (function () { var w = {}; w['B: the ' + nm(b)] = 'Test B against each part of the clue.'; return w; })() }, { hint: 'Test each part of the clue.', meta: { k: 'g3sh-w-ab', clue: c[0] } }) }
      ] };
    };
  }

  /* ======================= Lesson 2: Structures ======================= */
  function stName(k) { return ST[k].parts.length === 2 ? G3.an(nm(ST[k].parts[1])) + ' on ' + G3.an(nm(ST[k].parts[0])) : partsText(k); }
  function stFaces(k) { return ST[k].parts.reduce(function (s, p) { return s + S[p].f; }, 0); }
  function stWrongs(k) {
    var p = ST[k].parts, top = p[p.length - 1], W = [];
    STK.forEach(function (o) { if (o !== k && stName(o) !== stName(k)) W.push([stName(o), 'Take it apart in your head. What is on top? What is underneath?']); });
    W.unshift([G3.an(nm(LOOK[top])) + ' on ' + G3.an(nm(p[0])), 'Look at the top part again: ' + (S[top].kind === 'curved' ? 'it has a point.' : S[top].kind === 'pyramid' ? 'its triangles meet at a point.' : 'it has two triangle ends.')]);
    return W;
  }
  skill('sh-build', 'Take a structure apart', 'E1.2', [
    [1, 'plain', function (lv) {
      var k = R.pick(lv === 1 ? ['house', 'barn', 'tower', 'silo'] : STK);
      return mc('This ' + ST[k].name + ' is made of...', stName(k), stWrongs(k), { fig: structFig(k, lv === 1),
        hint: 'Lift off the top in your head.', steps: ['Top: ' + nm(ST[k].parts[ST[k].parts.length - 1]) + '.', 'Underneath: ' + ST[k].parts.slice(0, -1).map(nm).join(' and ') + '.'], explain: stName(k) + '.', meta: { k: 'g3sh-b-mc', st: k } });
    }],
    [1, 'count', function (lv) {
      var k = R.pick(STK), n = lv === 1 ? 1 : R.int(2, lv === 2 ? 3 : 5), who = Q.name(), t = n * ST[k].parts.length, f = {};
      f[n] = 'Each one is made of ' + ST[k].parts.length + ' objects.';
      return num(n === 1 ? 'How many 3D objects make this ' + ST[k].name + '?' : who + ' builds ' + n + ' ' + ST[k].name + 's like this. How many 3D objects does ' + who + ' use?', t, n === 1 ? {} : f, { fig: structFig(k, false),
        hint: 'Count the parts in one. ' + (n > 1 ? 'Then count by that ' + n + ' times.' : ''), steps: ['One ' + ST[k].name + ': ' + ST[k].parts.length + ' objects.', n > 1 ? n + ' &times; ' + ST[k].parts.length + ' = ' + t + '.' : ''].filter(Boolean), explain: t + ' objects.', meta: { k: 'g3sh-b-count', st: k, n: n } });
    }],
    [1, 'front', function (lv) {
      var k = R.pick(STK), opts = ['a square and a triangle', 'a rectangle and a triangle', '2 squares and a triangle', '2 rectangles and a triangle', 'a circle and a triangle'];
      return mc('Look at this ' + ST[k].name + ' from the front. Which 2D shapes do you see?', ST[k].front, opts.filter(function (o) { return o !== ST[k].front; }).map(function (o) { return [o, /circle/.test(o) ? 'From the front, a cylinder looks like a rectangle.' : 'Count the parts and check their front faces.']; }),
        { fig: structFig(k, false), hint: 'Look only at the front faces.', steps: ['The front shows ' + ST[k].front + '.'], explain: ST[k].front + '.', meta: { k: 'g3sh-b-front', st: k } });
    }, 1],
    [1, 'parts', function (lv) {
      var k = R.pick(lv === 1 ? ['house', 'barn', 'tower', 'silo'] : STK), p = ST[k].parts.slice().reverse();
      return fill('Take this ' + ST[k].name + ' apart. Count the flat faces of each part, then add.', p.map(function (x) { return cap(nm(x)) + ': [[]]'; }).join('<br>') + '<br>In all: [[]]', p.map(function (x) { return S[x].f; }).concat([stFaces(k)]), { fig: structFig(k, true),
        hint: 'Count the hidden faces too.', steps: [p.map(function (x) { return nm(x) + ' ' + S[x].f; }).join(', ') + '.', p.map(function (x) { return S[x].f; }).join(' + ') + ' = ' + stFaces(k) + '.'], explain: stFaces(k) + ' flat faces.', meta: { k: 'g3sh-b-fill', st: k } });
    }],
    [2, 'faces', function (lv) {
      var k = R.pick(lv === 2 ? ['house', 'barn', 'tower', 'silo'] : STK), n = lv === 3 ? R.int(2, 3) : 1, t = n * stFaces(k), f = {};
      f[stFaces(k) - 2] = 'Count every face of each part after you take it apart, even the ones that were touching.';
      return num((n === 1 ? 'Take this ' + ST[k].name + ' apart.' : 'Take ' + n + ' ' + ST[k].name + 's like this apart.') + ' How many flat faces do all the parts have?', t, n === 1 ? f : {}, { fig: structFig(k, true),
        hint: 'Count the flat faces of each part, then add.', steps: [ST[k].parts.map(function (p) { return nm(p) + ' ' + S[p].f; }).join(', ') + '.', ST[k].parts.map(function (p) { return S[p].f; }).join(' + ') + ' = ' + stFaces(k) + (n > 1 ? '. ' + n + ' &times; ' + stFaces(k) + ' = ' + t : '') + '.'], explain: t + ' flat faces.', meta: { k: 'g3sh-b-faces', st: k, n: n } });
    }],
    [2, 'pick', function (lv) {
      var k = R.pick(STK), need = ST[k].parts.filter(function (x, i) { return ST[k].parts.indexOf(x) === i; }), ans = [];
      var opts = R.shuffle(need.concat(R.shuffle(ALL.filter(function (x) { return need.indexOf(x) < 0; })).slice(0, 5 - need.length)));
      opts.forEach(function (x, j) { if (ST[k].parts.indexOf(x) >= 0) ans.push(j); });
      return { q: 'Pick every 3D object in this ' + ST[k].name + '.', type: 'pick', options: opts.map(nm), answer: ans, fig: structFig(k, true),
        hint: 'Name each part you see.', steps: [cap(stName(k)) + '.'], explain: ans.map(function (j) { return nm(opts[j]); }).join(' and ') + '.', meta: { k: 'g3sh-b-pick', st: k } };
    }],
    [2, 'tf', function (lv) {
      var k = R.pick(STK), who = Q.name(), truth = coin(), w = stWrongs(k)[0][0], said = truth ? stName(k) : w;
      return tf(who + ' says this ' + ST[k].name + ' is <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, 'It is ' + stName(k) + '.',
        ['Any pointed top is a cone.', 'A structure is one object.', 'The bottom part does not matter.'], 'Take it apart: check the top, then the bottom.', { fig: structFig(k, false), hint: 'Name the top and the bottom.', meta: { k: 'g3sh-b-tf', st: k, said: said } });
    }]
  ]);
  function tgBuild(keys) {
    return function () {
      var k = R.pick(keys), p = ST[k].parts, top = p[p.length - 1], f3 = {};
      f3[stFaces(k) - 2] = 'Count the touching faces too: the parts are apart now.';
      var steps = [
        { prompt: 'Lift off the top.', q: mc('What is the top part?', nm(top), ALL.filter(function (x) { return x !== top; }).slice(0, 3).map(function (x) { return [nm(x), 'Look at the top part on its own.']; }), { hint: 'Does it have a point? Triangle ends?', meta: { k: 'g3sh-b-part', st: k, which: 'top' } }) },
        { prompt: 'Now the part underneath.', q: mc('What is the bottom part?', nm(p[0]), ALL.filter(function (x) { return x !== p[0]; }).slice(0, 3).map(function (x) { return [nm(x), 'Look at the bottom part on its own.']; }), { hint: 'Count its faces.', meta: { k: 'g3sh-b-part', st: k, which: 'bottom' } }) },
        { prompt: 'Add the flat faces of all the parts.', q: num(p.map(function (x) { return S[x].f; }).join(' + ') + ' = ?', stFaces(k), f3, { hint: 'Add them.', meta: { k: 'g3sh-b-faces', st: k, n: 1 } }) }
      ];
      return { q: 'Take this ' + ST[k].name + ' apart.', fig: structFig(k, true), done: 'It is ' + stName(k) + ': ' + stFaces(k) + ' flat faces in all.', steps: steps };
    };
  }

  /* ======================= Lesson 3: Congruent ======================= */
  /* ---------- Congruent faces ---------- */
  function rectCase(lv) {
    var w = R.int(2, lv === 1 ? 4 : 5), h; do { h = R.int(1, lv === 1 ? 3 : 4); } while (h === w);
    var A0 = [w, h], kind = R.pick(lv === 1 ? ['turn', 'same', 'size'] : ['turn', 'size', 'size2', 'turn']), B0;
    if (kind === 'same') B0 = [w, h];
    else if (kind === 'turn') B0 = [h, w];
    else if (kind === 'size') B0 = coin() ? [w + 1, h] : [w, h + 1];
    else B0 = [h + 1, w];
    return { a: A0, b: B0, cong: srt(A0).join() === srt(B0).join() };
  }
  var CF_OPTS = ['Yes, they match', 'No, a side is different', 'No, B is turned'];
  function cfQ(q, c, x) {
    var ans = c.cong ? 0 : 1, w = {};
    w[CF_OPTS[1 - ans]] = c.cong ? 'B is A turned. Turning does not change size.' : 'Compare the side lengths: they do not all match.';
    w[CF_OPTS[2]] = 'Turning never changes size or shape. Compare the lengths.';
    var o = R.shuffle(CF_OPTS);
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(CF_OPTS[ans]), wrong: w }, x);
  }
  skill('sh-cface', 'Congruent faces', 'E1.3', [
    [1, 'plain', function (lv) {
      var c = rectCase(lv);
      return cfQ('Are faces A and B <b>congruent</b>?', c, { fig: faces([c.a, c.b], ['A', 'B']), hint: 'List each face\'s sides, short then long. Do they match?', steps: ['A: ' + srt(c.a).join(' and ') + ' cm.', 'B: ' + srt(c.b).join(' and ') + ' cm.'], explain: c.cong ? 'Same sides: congruent.' : 'The sides do not match: not congruent.', meta: { k: 'g3sh-cf-mc', a: c.a, b: c.b } });
    }],
    [1, 'side', function (lv) {
      var w = R.int(2, lv === 3 ? 9 : 6), h; do { h = R.int(1, lv === 3 ? 8 : 5); } while (h === w);
      var f = {}; f[w] = 'B is turned, so its height is A\'s width.';
      return num('Face B is congruent to face A, but turned. A is ' + w + ' cm wide and ' + h + ' cm tall. B is ' + h + ' cm wide. How tall is B?', w, f, { fig: lv < 3 ? faces([[w, h]], ['A']) : '',
        hint: 'Turning swaps width and height.', steps: ['B uses the same two lengths: ' + w + ' cm and ' + h + ' cm.', 'B is ' + h + ' cm wide, so it is ' + w + ' cm tall.'], explain: w + ' cm.', unit: 'cm', meta: { k: 'g3sh-cf-side', a: [w, h], given: h } });
    }],
    [1, 'tap', function (lv) {
      var w = R.int(2, 5), h; do { h = R.int(1, 4); } while (h === w);
      var good = [h, w], set = R.shuffle([good, [h + 1, w], [h, w + 1]]), tiles = set.map(function (f) { return faces([f]); }), ans = set.indexOf(good);
      return { q: 'Face A is ' + w + ' cm by ' + h + ' cm. Tap the face that is <b>congruent</b> to A.', type: 'tap', tiles: tiles, answer: ans, answerText: 'the ' + h + ' cm by ' + w + ' cm face', fig: faces([[w, h]], ['A']),
        wrong: tileFix(tiles, ans, function (i) { return 'That one is ' + set[i][0] + ' cm by ' + set[i][1] + ' cm. One side is different.'; }),
        hint: 'Look for the same two lengths, turned.', steps: ['A uses ' + srt([w, h]).join(' cm and ') + ' cm.'], explain: 'A, turned.', meta: { k: 'g3sh-cf-tap', a: [w, h], set: set } };
    }, 1],
    [1, 'count', function (lv) {
      var w = R.int(2, lv === 3 ? 9 : 5), h; do { h = R.int(1, lv === 3 ? 8 : 4); } while (h === w);
      var pool = [[w, h], [h, w], [w + 1, h], [w, h + 1], [h, w + 1], [h + 1, w]], list, n, up;
      do { list = []; for (var i = 0; i < (lv === 1 ? 4 : lv === 2 ? 5 : 6); i++) list.push(R.pick(pool)); n = list.filter(function (f) { return srt(f).join() === srt([w, h]).join(); }).length; } while (!n);
      up = list.filter(function (f) { return f[0] === w && f[1] === h; }).length;
      var f = {}; if (up !== n) f[up] = 'Turned faces count too.';
      return num('Face A is ' + w + ' cm by ' + h + ' cm. How many of these faces are <b>congruent</b> to A? ' + list.map(function (x, j) { return 'BCDEFG'[j] + ': ' + x[0] + ' cm by ' + x[1] + ' cm'; }).join('; ') + '.', n, f, { fig: faces([[w, h]], ['A']),
        hint: 'Sort each face\'s sides, short then long. Compare with A.', steps: ['A: ' + srt([w, h]).join(' and ') + ' cm.', 'Matches: ' + list.map(function (x, j) { return srt(x).join() === srt([w, h]).join() ? 'BCDEFG'[j] : ''; }).filter(Boolean).join(', ') + '.'], explain: n + '.', meta: { k: 'g3sh-cf-count', a: [w, h], list: list } });
    }],
    [2, 'box', function (lv) {
      var d; do { d = [R.int(2, 5), R.int(2, 5), R.int(2, 5)]; } while (lv === 2 && new Set(d).size < 3);
      var fx = [d[0], d[2]], n = [[d[0], d[1]], [d[0], d[1]], [d[1], d[2]], [d[1], d[2]], [d[0], d[2]], [d[0], d[2]]].filter(function (f) { return srt(f).join() === srt(fx).join(); }).length, f = {};
      f[1] = 'The back face matches it too.';
      return num('A box is ' + d[0] + ' cm long, ' + d[1] + ' cm deep and ' + d[2] + ' cm tall. Its front face is ' + d[0] + ' cm by ' + d[2] + ' cm. How many of its 6 faces are <b>congruent</b> to the front face (count the front too)?', n, f, { fig: boxFig(d),
        hint: 'Faces come in pairs: front and back, top and bottom, left and right. Check if any other pair has the same sides.', steps: ['Front and back: ' + d[0] + ' by ' + d[2] + '. Top and bottom: ' + d[0] + ' by ' + d[1] + '. Sides: ' + d[1] + ' by ' + d[2] + '.', n + ' match.'], explain: n + ' faces.', meta: { k: 'g3sh-cf-box', d: d } });
    }],
    [2, 'tf', function (lv) {
      var c; do { c = rectCase(2); } while (c.cong);
      if (coin()) c = { a: c.a, b: [c.a[1], c.a[0]], cong: true };
      var who = Q.name();
      return tf('Face A is ' + c.a[0] + ' cm by ' + c.a[1] + ' cm. Face B is ' + c.b[0] + ' cm by ' + c.b[1] + ' cm. ' + who + ' says they are <b>not</b> congruent. True or false: ' + who + ' is right.', !c.cong, c.cong ? 'B uses the same two lengths, turned. They are congruent.' : 'One side is different, so they are not congruent.',
        ['A turned face is a different face.', 'Faces must point the same way.', 'Any two rectangles are congruent.'], 'List both faces\' sides, short then long.', { fig: faces([c.a, c.b], ['A', 'B']), hint: 'Does turning change the size?', meta: { k: 'g3sh-cf-tf', a: c.a, b: c.b } });
    }],
    [3, 'edges', function (lv) {
      var d; do { d = [R.int(2, 6), R.int(2, 6), R.int(2, 6)]; } while (new Set(d).size === 1 && coin());
      var L = R.pick(d), n = d.filter(function (x) { return x === L; }).length * 4, f = {};
      f[n / 4] = 'Each length is used by 4 edges.';
      return num('A box is ' + dims(d) + ' cm. How many of its 12 edges are <b>' + L + ' cm</b> long?', n, f, { fig: boxFig(d),
        hint: '4 edges go along each direction: long, deep and tall.', steps: ['4 edges go each way.', d.map(function (x, i) { return ['long', 'deep', 'tall'][i] + ': ' + x + ' cm'; }).join(', ') + '.', n + ' edges are ' + L + ' cm.'], explain: n + ' edges.', meta: { k: 'g3sh-cf-edges', d: d, L: L } });
    }]
  ]);
  function tgCface(kind) {
    return function () {
      var c; do { c = rectCase(2); } while (kind === 'turn' ? !c.cong : kind === 'size' ? c.cong : false);
      return { q: 'Are faces A and B congruent?', fig: faces([c.a, c.b], ['A', 'B']), done: c.cong ? 'Same two lengths: congruent.' : 'The lengths are different: not congruent.', steps: [
        { prompt: 'List A\'s sides, short then long.', q: fill('Face A', '[[]] cm and [[]] cm', srt(c.a), { hint: 'Read the labels on A.', meta: { k: 'g3sh-cf-sort', s: c.a } }) },
        { prompt: 'Now B, short then long.', q: fill('Face B', '[[]] cm and [[]] cm', srt(c.b), { hint: 'Read the labels on B.', meta: { k: 'g3sh-cf-sort', s: c.b } }) },
        { prompt: 'Same two lengths?', q: cfQ('Are A and B congruent?', c, { hint: 'Compare the two lists.', meta: { k: 'g3sh-cf-mc', a: c.a, b: c.b } }) }
      ] };
    };
  }

  /* ---------- Congruent objects ---------- */
  function cbCase(lv) {
    var a; do { a = [R.int(1, lv === 1 ? 3 : 4), R.int(2, lv === 1 ? 3 : 4), R.int(2, lv === 1 ? 4 : 5)]; } while (new Set(a).size < 2);
    var kind = R.pick(['turn', 'turn', 'off']), b;
    if (kind === 'turn') { do { b = R.shuffle(a); } while (b.join() === a.join()); }
    else do { b = R.shuffle(a); var i = R.int(0, 2); b[i] += b[i] > 1 && coin() ? -1 : 1; } while (sameBox(a, b));
    return { a: a, b: b, cong: sameBox(a, b) };
  }
  var CB_OPTS = ['Yes, B is A turned', 'No, a length is different', 'No, B faces a different way'];
  function cbQ(q, c, x) {
    var ans = c.cong ? 0 : 1, w = {};
    if (c.cong) w[CB_OPTS[1]] = 'Sort both lists of lengths. They match.'; else w[CB_OPTS[0]] = 'Sort both lists: one length does not match.';
    w[CB_OPTS[2]] = 'Turning never changes size or shape.';
    var o = R.shuffle(CB_OPTS);
    return put({ q: q, type: 'mc', options: o, answer: o.indexOf(CB_OPTS[ans]), wrong: w }, x);
  }
  skill('sh-cbox', 'Congruent objects', 'E1.3', [
    [1, 'plain', function (lv) {
      var c = cbCase(lv);
      return cbQ('Box A is ' + dims(c.a) + ' cubes. Box B is ' + dims(c.b) + ' cubes. Are they congruent?', c, { fig: lv < 3 ? boxPair(c.a, c.b) : '',
        hint: 'Sort each box\'s three lengths, smallest first.', steps: ['A sorted: ' + srt(c.a).join(', ') + '.', 'B sorted: ' + srt(c.b).join(', ') + '.'], explain: c.cong ? 'Same three lengths: congruent.' : 'Different lengths: not congruent.', meta: { k: 'g3sh-cb-mc', a: c.a, b: c.b } });
    }],
    [1, 'missing', function (lv) {
      var a; do { a = [R.int(1, lv === 3 ? 8 : 5), R.int(2, lv === 3 ? 9 : 5), R.int(2, lv === 3 ? 9 : 6)]; } while (new Set(a).size < 3);
      var b = R.shuffle(a); if (b.join() === a.join()) b = [a[2], a[0], a[1]];
      var f = {}; f[b[0]] = 'That length is already used.'; f[b[1]] = 'That length is already used.';
      return num('Box B is box A turned. A is ' + dims(a) + ' cubes. B is ' + b[0] + ' long and ' + b[1] + ' deep. How tall is B?', b[2], f, { fig: lv === 1 ? boxFig(a) : '',
        hint: 'B uses the same three lengths as A. Which one is left?', steps: ['A uses ' + a.join(', ') + '.', b[0] + ' and ' + b[1] + ' are used. ' + b[2] + ' is left.'], explain: b[2] + ' tall.', meta: { k: 'g3sh-cb-miss', a: a, given: [b[0], b[1]] } });
    }],
    [1, 'sort', function (lv) {
      var c = cbCase(lv);
      return fill('Sort box B\'s lengths, smallest first. B is ' + dims(c.b) + ' cubes.', '[[]], [[]], [[]]', srt(c.b), { fig: boxFig(c.b),
        hint: 'Smallest first.', steps: ['Sorted: ' + srt(c.b).join(', ') + '.'], explain: srt(c.b).join(', ') + '.', meta: { k: 'g3sh-cb-sort', d: c.b } });
    }],
    [1, 'tap', function (lv) {
      var a; do { a = [R.int(1, 3), R.int(2, 3), R.int(3, 4)]; } while (new Set(a).size < 2);
      var good; do { good = R.shuffle(a); } while (good.join() === a.join());
      var b1 = a.slice(), b2 = a.slice(); b1[0] += 1; b2[2] += 1;
      var set = R.shuffle([good, b1, b2]), tiles = set.map(boxFig), ans = set.indexOf(good);
      return { q: 'Box A is <b>' + dims(a) + '</b> cubes. Tap the box that is congruent to A.', type: 'tap', fig: boxFig(a), tiles: tiles, answer: ans, answerText: 'the ' + dims(good) + ' box',
        wrong: tileFix(tiles, ans, function (i) { return 'That box is ' + dims(set[i]) + '. Sorted, it does not match A.'; }),
        hint: 'Count the cubes along each edge.', steps: ['A: ' + srt(a).join(', ') + ' sorted.', 'The ' + dims(good) + ' box sorts the same.'], explain: 'The ' + dims(good) + ' box.', meta: { k: 'g3sh-cb-tap', a: a, set: set } };
    }, 1],
    [2, 'tf', function (lv) {
      var pairs = [[[2, 3, 4], [1, 4, 6]], [[2, 2, 6], [3, 2, 4]], [[1, 6, 4], [2, 3, 4]], [[2, 3, 6], [3, 3, 4]], [[2, 4, 3], [4, 3, 2]], [[1, 3, 4], [4, 1, 3]], [[3, 2, 2], [2, 3, 2]], [[2, 5, 3], [3, 2, 5]]];
      var p = R.pick(pairs), who = Q.name(), c = { a: p[0], b: p[1], cong: sameBox(p[0], p[1]) }, nA = p[0][0] * p[0][1] * p[0][2];
      return tf('Box A is ' + dims(c.a) + ' cubes. Box B is ' + dims(c.b) + ' cubes. Both use ' + nA + ' cubes. ' + who + ' says that makes them congruent. True or false: ' + who + ' is right.', c.cong, c.cong ? 'They use the same three lengths, so they are congruent.' : 'Same number of cubes, but different lengths: not congruent.',
        ['The same number of cubes always means congruent.', 'Turned boxes are never congruent.', 'Only cubes can be congruent.'], 'Do not count cubes. Sort the three lengths and compare.', { fig: boxPair(c.a, c.b), hint: 'Sort both lists of lengths.', meta: { k: 'g3sh-cb-tf', a: c.a, b: c.b } });
    }],
    [3, 'cubes', function (lv) {
      var d = [R.int(2, 4), R.int(2, 3), R.int(2, 5)], layer = d[0] * d[1], t = layer * d[2], f = {};
      f[d[0] + d[1] + d[2]] = 'Do not add the lengths. Find one layer, then count layers.';
      return num('Box A is ' + d[0] + ' long, ' + d[1] + ' deep and ' + d[2] + ' tall. How many cubes is it made of?', t, f, { fig: boxFig(d),
        hint: 'One layer: ' + d[0] + ' &times; ' + d[1] + '. Then count the layers.', steps: ['One layer: ' + d[0] + ' &times; ' + d[1] + ' = ' + layer + '.', d[2] + ' layers: ' + d[2] + ' &times; ' + layer + ' = ' + t + '.'], explain: t + ' cubes. A congruent box uses ' + t + ' too.', meta: { k: 'g3sh-cb-cubes', d: d } });
    }]
  ]);
  function tgCbox(kind) {
    return function () {
      var c; do { c = cbCase(2); } while (kind === 'turn' ? !c.cong : kind === 'off' ? c.cong : false);
      return { q: 'Box A is ' + dims(c.a) + ' cubes. Box B is ' + dims(c.b) + ' cubes. Are they congruent?', fig: boxPair(c.a, c.b), done: c.cong ? 'B is A turned: congruent.' : 'One length is different: not congruent.', steps: [
        { prompt: 'Sort A\'s lengths, smallest first.', q: fill('Box A sorted', '[[]], [[]], [[]]', srt(c.a), { hint: 'Smallest first.', meta: { k: 'g3sh-cb-sort', d: c.a } }) },
        { prompt: 'Now sort B\'s.', q: fill('Box B sorted', '[[]], [[]], [[]]', srt(c.b), { hint: 'Smallest first.', meta: { k: 'g3sh-cb-sort', d: c.b } }) },
        { prompt: 'Do the lists match?', q: cbQ('Are A and B congruent?', c, { hint: 'Same three numbers?', meta: { k: 'g3sh-cb-mc', a: c.a, b: c.b } }) }
      ] };
    };
  }

  /* ======================= Lesson 4: Directions ======================= */
  /* ---------- Quarter and half turns ---------- */
  function turnCase(lv) {
    var d = lv === 1 ? 0 : R.int(0, 3), keys = Object.keys(TURN), mv = lv === 1 ? [R.pick(keys)] : lv === 2 ? [R.pick(keys), R.pick(keys)] : [R.pick(keys), R.pick(keys), R.pick(keys)], end = d;
    mv.forEach(function (m) { end = (end + TURN[m]) % 4; });
    return { d: d, mv: mv, end: end };
  }
  function turnWrongs(c) {
    var W = [], mirror = c.d;
    c.mv.forEach(function (m) { mirror = (mirror + (TURN[m] === 2 ? 2 : 4 - TURN[m])) % 4; });
    W.push([DN[mirror], 'Right and left are swapped. Right goes clockwise: north, east, south, west.']);
    DN.forEach(function (x, i) { if (i !== c.end) W.push([x, i === c.d ? 'That is where you started.' : 'Do one turn at a time.']); });
    return W;
  }
  function turnSteps(c) { var cur = c.d; return ['Start facing ' + DN[c.d] + '.'].concat(c.mv.map(function (m) { cur = (cur + TURN[m]) % 4; return cap(G3.an(m)) + ': ' + DN[cur] + '.'; })); }
  skill('sh-turn', 'Quarter and half turns', 'E1.4', [
    [1, 'plain', function (lv) {
      var c = turnCase(lv);
      return mc('You face <b>' + DN[c.d] + '</b>. You make ' + c.mv.map(function (m) { return G3.an(m); }).join(', then ') + '. Which way do you face now?', DN[c.end], turnWrongs(c), { fig: compass(c.d),
        hint: 'One turn at a time. Clockwise: north, east, south, west.', steps: turnSteps(c), explain: 'You face ' + DN[c.end] + '.', meta: { k: 'g3sh-t-mc', d: c.d, mv: c.mv } });
    }],
    [1, 'tap', function (lv) {
      var c = turnCase(lv);
      return { q: 'You face <b>' + DN[c.d] + '</b>. You make ' + c.mv.map(function (m) { return G3.an(m); }).join(', then ') + '. Tap the way you face now.', type: 'tap', pic: compassPic(), answer: DN[c.end], answerText: DN[c.end],
        hint: 'Clockwise: north, east, south, west.', steps: turnSteps(c), explain: 'You face ' + DN[c.end] + '.', meta: { k: 'g3sh-t-tap', d: c.d, mv: c.mv } };
    }, 1],
    [1, 'quarters', function (lv) {
      var mv = [], t = 0;
      for (var i = 0; i < lv + 1; i++) mv.push(R.pick(['quarter turn right', 'half turn']));
      if (mv.indexOf('half turn') < 0) mv[R.int(0, mv.length - 1)] = 'half turn';
      mv.forEach(function (m) { t += m === 'half turn' ? 2 : 1; });
      var f = {}; f[mv.length] = 'A half turn is 2 quarter turns.';
      return num('You make ' + mv.map(function (m) { return G3.an(m); }).join(', then ') + '. How many <b>quarter turns right</b> is that in all?', t, f, { fig: compass(0),
        hint: 'A half turn is 2 quarter turns.', steps: [mv.map(function (m) { return m === 'half turn' ? 2 : 1; }).join(' + ') + ' = ' + t + '.'], explain: pl(t, 'quarter turn') + '.', meta: { k: 'g3sh-t-quarters', mv: mv } });
    }],
    [1, 'count', function (lv) {
      var from = lv === 1 ? 0 : R.int(0, 3), k = R.int(1, 3), way = lv === 3 ? R.pick(['right', 'left']) : 'right', to = way === 'right' ? (from + k) % 4 : (from + 4 - k) % 4, f = {};
      f[4 - k] = 'That is turning the other way. Turn ' + way + ', one quarter at a time.';
      return num('You face <b>' + DN[from] + '</b>. How many <b>quarter turns ' + way + '</b> until you face <b>' + DN[to] + '</b>?', k, f, { fig: compass(from),
        hint: 'Turn one quarter at a time and count.', steps: ['Quarter turns ' + way + ' from ' + DN[from] + ': ' + (function () { var s = [], cur = from; for (var i = 0; i < k; i++) { cur = way === 'right' ? (cur + 1) % 4 : (cur + 3) % 4; s.push(DN[cur]); } return s.join(', '); })() + '.', k + '.'], explain: pl(k, 'quarter turn') + '.', meta: { k: 'g3sh-t-count', from: from, to: to, way: way } });
    }],
    [2, 'match', function (lv) {
      var d = R.int(0, 3), mv = R.shuffle(Object.keys(TURN));
      return { q: 'You face <b>' + DN[d] + '</b>. Match each turn to the way you face after it.', type: 'match', pairs: mv.map(function (m) { return [G3.an(m), DN[(d + TURN[m]) % 4]]; }), fig: compass(d),
        hint: 'Right is clockwise. A half turn faces the opposite way.', steps: mv.map(function (m) { return cap(G3.an(m)) + ': ' + DN[(d + TURN[m]) % 4] + '.'; }), explain: 'Right, half, left.', meta: { k: 'g3sh-t-match', d: d } };
    }, 2],
    [2, 'tf', function (lv) {
      var c = turnCase(lv), who = Q.name(), truth = coin(), said = truth ? DN[c.end] : turnWrongs(c)[0][0];
      if (!truth && said === DN[c.end]) said = DN[(c.end + 2) % 4];
      return tf('You face ' + DN[c.d] + ' and make ' + c.mv.map(function (m) { return G3.an(m); }).join(', then ') + '. ' + who + ' says you now face <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, turnSteps(c).join(' '),
        ['Right turns go counterclockwise.', 'A quarter turn faces the opposite way.', 'Turning does not change the way you face.'], 'Turn one step at a time on the compass.', { fig: compass(c.d), hint: 'Clockwise: north, east, south, west.', meta: { k: 'g3sh-t-tf', d: c.d, mv: c.mv, said: said } });
    }],
    [2, 'full', function (lv) {
      var n = (lv === 2 ? 4 : R.pick([8, 12])) + R.int(1, 3), d = R.int(0, 3), end = (d + n) % 4, f = {};
      f[n] = 'Every 4 quarter turns is a full turn: you are back where you started.';
      return num('You face ' + DN[d] + ' and make ' + n + ' quarter turns right. How many <b>more</b> quarter turns right until you face ' + DN[d] + ' again?', 4 - n % 4, f, { fig: compass(d),
        hint: '4 quarter turns make a full turn.', steps: [n + ' quarter turns: ' + Math.floor(n / 4) + ' full ' + (Math.floor(n / 4) === 1 ? 'turn' : 'turns') + ' and ' + (n % 4) + ' more. You face ' + DN[end] + '.', 'Turn on until ' + DN[d] + '.'], explain: (4 - n % 4) + ' more.', meta: { k: 'g3sh-t-full', n: n } });
    }]
  ]);
  function tgTurn(lv) {
    return function () {
      var c = turnCase(lv), cur = c.d, steps = [];
      c.mv.forEach(function (m, i) {
        var before = cur; cur = (cur + TURN[m]) % 4;
        var sub = { d: before, mv: [m], end: cur };
        steps.push({ prompt: i === 0 ? 'Do the first turn only.' : 'Now the next turn, from ' + DN[before] + '.', q: mc('Facing ' + DN[before] + ', you make ' + G3.an(m) + '. Which way now?', DN[cur], turnWrongs(sub), { fig: compass(before), hint: m === 'half turn' ? 'A half turn faces the opposite way.' : 'Right is clockwise.', meta: { k: 'g3sh-t-mc', d: before, mv: [m] } }) });
      });
      if (steps.length < 2) steps.push({ prompt: 'Count the turns.', q: num('How many quarter turns is that?', TURN[c.mv[0]] === 2 ? 2 : 1, {}, { hint: 'A half turn is 2 quarter turns.', meta: { k: 'g3sh-t-q', mv: c.mv[0] } }) });
      return { q: 'You face ' + DN[c.d] + '. You make ' + c.mv.map(function (m) { return G3.an(m); }).join(', then ') + '.', fig: compass(c.d), done: 'You face ' + DN[c.end] + '.', steps: steps };
    };
  }

  /* ---------- Follow directions on a map ---------- */
  function startText(r) { return 'Start at ' + cell(r.x, r.y) + ', facing ' + DN[r.d] + '. ' + cap(say(r.acts)) + '.'; }
  function walked(acts) { return acts.filter(function (t) { return /forward/.test(t); }).reduce(function (s, t) { return s + +t.split(' ')[1]; }, 0); }
  function pathWrongs(r) {
    var W = [], sw = walk(r.x, r.y, r.d, r.acts.map(function (t) { return t === 'right' ? 'left' : t === 'left' ? 'right' : t; }));
    if (on(sw)) W.push([cell(sw[0], sw[1]), 'Right and left are swapped. Check which way you face after the turn.']);
    var nt = walk(r.x, r.y, r.d, r.acts.filter(function (t) { return /forward/.test(t); }));
    if (on(nt)) W.push([cell(nt[0], nt[1]), 'Do not forget the turn.']);
    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(function (o) { var x = r.end[0] + o[0], y = r.end[1] + o[1]; if (on([x, y])) W.push([cell(x, y), 'Count the squares again, one at a time.']); });
    return W;
  }
  skill('sh-path', 'Follow directions on a map', 'E1.4', [
    [1, 'plain', function (lv) {
      var r = route(lv), end = cell(r.end[0], r.end[1]);
      return { q: startText(r) + ' Tap the square where you end.', type: 'tap', pic: map([[r.x, r.y]], r.d, null, true), answer: end, answerText: end, wrong: (function () { var w = {}; pathWrongs(r).forEach(function (x) { w[x[0]] = x[1]; }); return w; })(),
        hint: 'North is up, east is right. One step at a time.', steps: ['Start at ' + cell(r.x, r.y) + '.', 'Follow each step in order.', 'You end at ' + end + '.<div class="fig">' + map(r.end[3], r.end[2]) + '</div>'], explain: 'You end at ' + end + '.', meta: { k: 'g3sh-p-tap', x: r.x, y: r.y, d: r.d, acts: r.acts } };
    }],
    [1, 'walk', function (lv) {
      var r = route(lv), t = walked(r.acts), f = {};
      f[r.acts.filter(function (x) { return /forward/.test(x); }).length] = 'That counts the moves. Add the squares in each move.';
      return num(startText(r) + ' How many squares do you walk <b>in all</b>?', t, f, { fig: map([[r.x, r.y]], r.d),
        hint: 'Add the forward numbers. Turns do not move you.', steps: [r.acts.filter(function (x) { return /forward/.test(x); }).map(function (x) { return x.split(' ')[1]; }).join(' + ') + ' = ' + t + '.'], explain: t + ' squares.', meta: { k: 'g3sh-p-walk', acts: r.acts } });
    }],
    [1, 'dist', function (lv) {
      var y = R.int(0, 5), x1 = R.int(0, 2), x2 = R.int(x1 + 1, 5), vert = coin(), from, to, n, dir;
      if (vert) { from = [y, x1]; to = [y, x2]; dir = 'north'; } else { from = [x1, y]; to = [x2, y]; dir = 'east'; }
      if (lv > 1 && coin()) { var t = from; from = to; to = t; dir = vert ? 'south' : 'west'; }
      n = Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);
      var f = {}; f[n + 1] = 'Do not count the square you start on.';
      return num('You are at ' + cell(from[0], from[1]) + ', facing ' + dir + '. How many squares forward to reach ' + cell(to[0], to[1]) + '?', n, f, { fig: map([from], DN.indexOf(dir)),
        hint: 'Count the steps, not the square you stand on.', steps: [cell(from[0], from[1]) + ' to ' + cell(to[0], to[1]) + ': ' + n + ' steps.'], explain: n + ' squares.', meta: { k: 'g3sh-p-dist', from: from, to: to } });
    }],
    [2, 'which', function (lv) {
      var r = route(lv), end = cell(r.end[0], r.end[1]);
      return mc(startText(r) + ' Where do you end?', end, pathWrongs(r), { fig: map([[r.x, r.y]], r.d),
        hint: 'Trace it with your finger.', steps: ['You end at ' + end + '.'], explain: end + '.', meta: { k: 'g3sh-p-mc', x: r.x, y: r.y, d: r.d, acts: r.acts } });
    }, 2],
    [2, 'home', function (lv) {
      var r; do { r = route(lv); } while (r.end[0] === r.x && r.end[1] === r.y);
      var dx = Math.abs(r.end[0] - r.x), dy = Math.abs(r.end[1] - r.y), f = {};
      f[walked(r.acts)] = 'That is how far you walked. Count the shortest way back.';
      return num(startText(r) + ' Moving along rows and columns, what is the fewest number of squares back to ' + cell(r.x, r.y) + '?', dx + dy, f, { fig: map([[r.x, r.y]], r.d),
        hint: 'Find where you end. Then count the columns across and the rows up or down.', steps: ['You end at ' + cell(r.end[0], r.end[1]) + '.', 'Across ' + dx + ', up or down ' + dy + ': ' + (dx + dy) + '.'], explain: (dx + dy) + ' squares.', meta: { k: 'g3sh-p-home', x: r.x, y: r.y, d: r.d, acts: r.acts } });
    }],
    [2, 'tf', function (lv) {
      var r = route(2), end = cell(r.end[0], r.end[1]), who = Q.name(), truth = coin(), W = pathWrongs(r), said = truth || !W.length ? end : W[0][0];
      return tf(startText(r) + ' ' + who + ' says you end at <b>' + said + '</b>. True or false: ' + who + ' is right.', said === end, 'Step by step, you end at ' + end + '.',
        ['Turns move you one square.', 'North is down on a map.', 'Right and left mean the same.'], 'Trace the path one step at a time.', { fig: map([[r.x, r.y]], r.d), hint: 'Which way do you face after each turn?', meta: { k: 'g3sh-p-tf', x: r.x, y: r.y, d: r.d, acts: r.acts, said: said } });
    }],
    [3, 'face', function (lv) {
      var r = route(3);
      return mc(startText(r) + ' Which way are you facing at the end?', DN[r.end[2]], DN.filter(function (x, i) { return i !== r.end[2]; }).map(function (x) { return [x, 'Follow each turn on the compass.']; }), { fig: map([[r.x, r.y]], r.d),
        hint: 'Only the turns change the way you face.', steps: ['After the turns you face ' + DN[r.end[2]] + '.'], explain: DN[r.end[2]] + '.', meta: { k: 'g3sh-p-face', d: r.d, acts: r.acts } });
    }]
  ]);
  function tgPath(lv) {
    return function () {
      var r = route(lv), f1 = walk(r.x, r.y, r.d, r.acts.slice(0, 1)), f2 = walk(r.x, r.y, r.d, r.acts.slice(0, 2)), end = cell(r.end[0], r.end[1]);
      var near = function (p) { var W = []; [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(function (o) { var x = p[0] + o[0], y = p[1] + o[1]; if (on([x, y])) W.push([cell(x, y), 'Count the squares again, one at a time.']); }); return W; };
      return { q: startText(r), fig: map([[r.x, r.y]], r.d), done: 'You end at ' + end + ', after ' + walked(r.acts) + ' squares.', steps: [
        { prompt: 'Do only the first move.', q: mc('After "' + r.acts[0] + '", where are you?', cell(f1[0], f1[1]), near(f1), { hint: 'Facing ' + DN[r.d] + ', count the squares.', meta: { k: 'g3sh-p-mc', x: r.x, y: r.y, d: r.d, acts: r.acts.slice(0, 1) } }) },
        { prompt: 'Now turn. Which way do you face?', q: mc('After the turn, which way do you face?', DN[f2[2]], DN.filter(function (x, i) { return i !== f2[2]; }).map(function (x, i) { return [x, 'From ' + DN[r.d] + ', a quarter turn ' + r.acts[1] + ' goes ' + (r.acts[1] === 'right' ? 'clockwise' : 'the other way') + '.']; }), { hint: 'Right is clockwise.', meta: { k: 'g3sh-p-face', d: r.d, acts: r.acts.slice(0, 2) } }) },
        { prompt: 'Finish the directions.', q: mc('Where do you end?', end, pathWrongs(r), { hint: 'Keep going, one step at a time.', meta: { k: 'g3sh-p-mc', x: r.x, y: r.y, d: r.d, acts: r.acts } }) },
        { prompt: 'Add the forward moves.', q: num('How many squares did you walk in all?', walked(r.acts), {}, { hint: 'Add the forward numbers.', meta: { k: 'g3sh-p-walk', acts: r.acts } }) }
      ] };
    };
  }

  /* ---------- Give directions ---------- */
  /* a trip from a start (facing north) to a target: up first, then a quarter turn, then across */
  function trip(lv) {
    for (;;) {
      var x = R.int(0, 5), y = R.int(0, 3), up = R.int(1, Math.min(lv === 1 ? 3 : 5, 5 - y)), x2 = R.int(0, 5);
      if (x2 === x || up < 1 || y + up > 5) continue;
      return { x: x, y: y, up: up, turn: x2 > x ? 'right' : 'left', across: Math.abs(x2 - x), to: [x2, y + up] };
    }
  }
  function tripText(t) { return 'You are at <b>' + cell(t.x, t.y) + '</b>, facing north. Give directions to <b>' + cell(t.to[0], t.to[1]) + '</b>.'; }
  skill('sh-give', 'Give directions', 'E1.4', [
    [1, 'plain', function (lv) {
      var t = trip(lv);
      return fill(tripText(t), 'Go forward [[]]. Make a quarter turn ' + t.turn + '. Go forward [[]].', [t.up, t.across], { fig: map([[t.x, t.y]], 0),
        hint: 'First count the squares north. Then count the squares across.', steps: ['North from row ' + (t.y + 1) + ' to row ' + (t.y + t.up + 1) + ': ' + t.up + '.', 'Across from ' + COLS[t.x] + ' to ' + COLS[t.to[0]] + ': ' + t.across + '.<div class="fig">' + map(walk(t.x, t.y, 0, ['forward ' + t.up, t.turn, 'forward ' + t.across])[3], t.turn === 'right' ? 1 : 3) + '</div>'],
        explain: 'Forward ' + t.up + ', quarter turn ' + t.turn + ', forward ' + t.across + '.', meta: { k: 'g3sh-g-fill', x: t.x, y: t.y, turn: t.turn, to: t.to } });
    }],
    [1, 'turn', function (lv) {
      var t = trip(lv), opts = ['quarter turn right', 'quarter turn left', 'half turn'], ans = opts.indexOf('quarter turn ' + t.turn), w = {};
      opts.forEach(function (o, i) { if (i !== ans) w[o] = i === 2 ? 'A half turn would face south, back the way you came.' : 'Is ' + COLS[t.to[0]] + ' to the east (right) or the west (left)?'; });
      return put({ q: tripText(t) + ' After going north ' + t.up + ', which turn points you at it?', type: 'mc', options: opts, answer: ans, wrong: w }, { fig: map([[t.x, t.y]], 0),
        hint: 'Later letters are east (right).', steps: [COLS[t.to[0]] + ' is ' + (t.turn === 'right' ? 'east' : 'west') + ' of ' + COLS[t.x] + '.'], explain: 'A quarter turn ' + t.turn + '.', meta: { k: 'g3sh-g-turn', x: t.x, to: t.to } });
    }],
    [1, 'fewest', function (lv) {
      var t = trip(lv), y0 = lv === 3 && coin() ? Math.max(0, t.y - R.int(1, 2)) : t.y, n = t.up + (t.y - y0) + t.across, f = {};
      f[Math.max(t.up + t.y - y0, t.across)] = 'Add both parts: up and across.';
      return num('You can only move along rows and columns. What is the fewest number of squares from ' + cell(t.x, y0) + ' to ' + cell(t.to[0], t.to[1]) + '?', n, f, { fig: map([[t.x, y0]], 0),
        hint: 'Count the rows up, then the columns across. Add.', steps: ['Up: ' + (t.up + t.y - y0) + '. Across: ' + t.across + '.', (t.up + t.y - y0) + ' + ' + t.across + ' = ' + n + '.'], explain: n + ' squares.', meta: { k: 'g3sh-g-fewest', from: [t.x, y0], to: t.to } });
    }],
    [2, 'tf', function (lv) {
      var t = trip(lv), who = Q.name(), truth = coin(), up = t.up, ac = t.across, tn = t.turn;
      if (!truth) { var r = R.int(0, 2); if (r === 0) tn = tn === 'right' ? 'left' : 'right'; else if (r === 1) up += 1; else ac += 1; }
      var e = walk(t.x, t.y, 0, ['forward ' + up, tn, 'forward ' + ac]), ok = e[0] === t.to[0] && e[1] === t.to[1];
      return tf(tripText(t) + ' ' + who + ' says: forward ' + up + ', quarter turn ' + tn + ', forward ' + ac + '. True or false: ' + who + '\'s directions work.', ok, 'The right directions: forward ' + t.up + ', quarter turn ' + t.turn + ', forward ' + t.across + '.',
        ['Any directions with a turn will work.', 'Count the square you start on.', 'Left and right go the same way.'], 'Follow ' + who + '\'s directions on the map and see where they end.', { fig: map([[t.x, t.y]], 0), hint: 'Try the directions on the map.', meta: { k: 'g3sh-g-tf', x: t.x, y: t.y, acts: ['forward ' + up, tn, 'forward ' + ac], to: t.to } });
    }],
    [2, 'which', function (lv) {
      var t = trip(lv), right = 'forward ' + t.up + ', quarter turn ' + t.turn + ', forward ' + t.across, other = t.turn === 'right' ? 'left' : 'right';
      return mc(tripText(t) + ' Which directions work?', right, [['forward ' + t.up + ', quarter turn ' + other + ', forward ' + t.across, 'That turn goes the wrong way.'], ['forward ' + t.across + ', quarter turn ' + t.turn + ', forward ' + t.up, 'Those numbers are swapped. North first.'], ['forward ' + (t.up + 1) + ', quarter turn ' + t.turn + ', forward ' + t.across, 'Count the rows again.']].filter(function (w) { var a2 = w[0].split(', '), e = walk(t.x, t.y, 0, [a2[0], a2[1].replace('quarter turn ', ''), a2[2]]); return !(e[0] === t.to[0] && e[1] === t.to[1]); }),
        { fig: map([[t.x, t.y]], 0), hint: 'Try each one on the map.', steps: ['Forward ' + t.up + ' to row ' + (t.to[1] + 1) + ', turn ' + t.turn + ', forward ' + t.across + '.'], explain: right + '.', meta: { k: 'g3sh-g-which', x: t.x, y: t.y, to: t.to } });
    }],
    [3, 'back', function (lv) {
      var t = trip(3), back = t.turn === 'right' ? 'left' : 'right';
      return fill('You walked from ' + cell(t.x, t.y) + ': forward ' + t.up + ' north, a quarter turn ' + t.turn + ', forward ' + t.across + '. Now you make a half turn to go back the way you came. Fill in the numbers.', 'Go forward [[]]. Make a quarter turn ' + back + '. Go forward [[]].', [t.across, t.up], { fig: map(walk(t.x, t.y, 0, ['forward ' + t.up, t.turn, 'forward ' + t.across])[3], t.turn === 'right' ? 1 : 3),
        hint: 'Going back, the moves come in the opposite order.', steps: ['After the half turn you face ' + (t.turn === 'right' ? 'west' : 'east') + '.', 'Back across ' + t.across + ', a quarter turn ' + back + ' to face south, then down ' + t.up + '.'], explain: 'Forward ' + t.across + ', quarter turn ' + back + ', forward ' + t.up + '.', meta: { k: 'g3sh-g-back', x: t.x, y: t.y, turn: t.turn, to: t.to } });
    }]
  ]);
  function tgGive(lv) {
    return function () {
      var t = trip(lv), f2 = {};
      f2[t.up] = 'That is the rows. Count the columns across now.';
      var opts = ['quarter turn right', 'quarter turn left'], ans = opts.indexOf('quarter turn ' + t.turn), w = {};
      w[opts[1 - ans]] = COLS[t.to[0]] + ' is ' + (t.turn === 'right' ? 'east, to the right.' : 'west, to the left.');
      return { q: tripText(t), fig: map([[t.x, t.y]], 0), done: 'Forward ' + t.up + ', quarter turn ' + t.turn + ', forward ' + t.across + '.', steps: [
        { prompt: 'Go north first. Count the rows.', q: num('How many squares north?', t.up, {}, { hint: 'From row ' + (t.y + 1) + ' to row ' + (t.to[1] + 1) + '.', meta: { k: 'g3sh-g-up', y: t.y, to: t.to } }) },
        { prompt: 'Which way is the target now?', q: put({ q: 'Which turn?', type: 'mc', options: opts, answer: ans, wrong: w }, { hint: 'Later letters are to the east.', meta: { k: 'g3sh-g-turn', x: t.x, to: t.to } }) },
        { prompt: 'Count the columns across.', q: num('How many squares across?', t.across, f2, { hint: 'From ' + COLS[t.x] + ' to ' + COLS[t.to[0]] + '.', meta: { k: 'g3sh-g-across', x: t.x, to: t.to } }) }
      ] };
    };
  }

  /* ======================= Watch and My turn pictures ======================= */
  var solidV = function (s) { return solid(s.k, s.hl, 60, 230, null, s.mark); };
  var curvedV = function (s) { return solid(put({ hc: s.hc, hp: s.hp }, S[s.k]), s.hl); };
  var rowV = function (s) { return lineUp(s.ks, s.labs); };
  var structV = function (s) { return structFig(s.k, s.split); };
  var facesV = function (s) { return faces(s.f, ['A', 'B']); };
  var pairV = function (s) { return boxPair(s.a, s.b); };
  var compassV = function (s) { return compass(s.d); };
  var mapV = function (s) { return map(s.path, s.dir); };
  function grpMarks(k, p, upto) { var g = grp(k, p), m = []; for (var i = 0; i < upto; i++) m = m.concat(g[i][1]); var o = {}; o[p] = m; return o; }
  function walkFrames(x, y, d, acts) {
    var out = [], done = [];
    acts.forEach(function (t) { done.push(t); var e = walk(x, y, d, done); out.push({ path: e[3], dir: e[2] }); });
    return out;
  }

  /* ======================= The lessons ======================= */
  var LESSONS = [
    { id: 'solids', title: '3D objects', sub: 'Faces, edges, vertices and curved surfaces.', concepts: [
      { id: 'faces', title: 'Count the flat faces', exp: ['E1.1'], skill: 'sh-faces',
        watch: clip(solidV, { k: 'cube', hl: '' }, [
          ['A face is a flat surface.', { hl: 'f' }],
          ['You can see 3 faces.', { sym: '3' }],
          ['3 more hide at the back and bottom.', { sym: '3 + 3 = 6' }]
        ]),
        example: clip(solidV, { k: 'tprism', hl: '' }, [
          ['My turn. I can see 2 faces.', { hl: 'f', sym: '2' }],
          ['I picture the back: 1 triangle and 2 rectangles hide there.', { sym: '2 + 3' }],
          ['5 faces. Not 2: hidden faces count too.', { sym: '2 + 3 = 5' }]
        ]),
        try: { mount: G3.play({ state: { k: 'cube', hl: 'f' }, draw: function (s) { return solid(s.k, s.hl); },
          selects: [{ key: 'k', label: 'Object', options: ALL.map(function (k) { return [k, nm(k)]; }) }],
          info: function (s) { return '<b>' + cap(nm(s.k)) + '</b>: ' + pl(S[s.k].f, 'flat face') + '.'; },
          tasks: [{ do: 'Find an object with <b>4 flat faces</b>.', goal: function (s) { return s.k === 'tpyr'; }, yes: 'A triangular pyramid: 4 triangles.' },
            { do: 'Find an object with only <b>1 flat face</b>.', goal: function (s) { return s.k === 'cone'; }, yes: 'A cone: 1 circle.' }] }), do: '' },
        together: [tgFaces('cube'), tgFaces('tprism'), tgFaces()],
        mistake: '<p>Counting only the faces in the picture (3 for a cube). Hold a real box and turn it: "Which faces could you not see?"</p>',
        check: [ck('sh-faces', 'plain', 1), ck('sh-faces', 'tap', 1), ck('sh-faces', 'fill', 2), ck('sh-faces', 'tf', 2), ck('sh-faces', 'total', 3)] },

      { id: 'edges', title: 'Count edges and vertices', exp: ['E1.1'], skill: 'sh-edges',
        watch: clip(solidV, { k: 'cube', hl: '', mark: {} }, [
          ['An edge is where two faces meet. Start at the front: 4.', { mark: grpMarks('cube', 'e', 1), sym: '4' }],
          ['4 around the back. Dashed ones hide.', { mark: grpMarks('cube', 'e', 2), sym: '4 + 4' }],
          ['4 going back. 12 edges.', { mark: grpMarks('cube', 'e', 3), sym: '4 + 4 + 4 = 12' }],
          ['A vertex is a corner: 4 front, 4 back.', { mark: { v: [0, 1, 2, 3, 4, 5, 6, 7] }, sym: '4 + 4 = 8 vertices' }]
        ]),
        example: clip(solidV, { k: 'spyr', hl: '', mark: {} }, [
          ['My turn. 4 edges around the base.', { mark: grpMarks('spyr', 'e', 1), sym: '4' }],
          ['4 more go up to the point.', { mark: grpMarks('spyr', 'e', 2), sym: '4 + 4 = 8 edges' }],
          ['Corners: 4 on the base and 1 at the point. Not 4: the point is a vertex too.', { mark: { v: [0, 1, 2, 3, 4] }, sym: '4 + 1 = 5 vertices' }]
        ]),
        try: { mount: G3.play({ state: { k: 'tprism', g: 0 }, draw: function (s) { return solid(s.k, '', 60, 230, null, grpMarks(s.k, 'e', s.g)); },
          selects: [{ key: 'k', label: 'Object', options: POLY.map(function (k) { return [k, nm(k)]; }), change: function (s) { s.g = 0; } }],
          buttons: [{ label: 'Light the next group', act: function (s) { if (s.g < grp(s.k, 'e').length) s.g++; } }, { label: 'Start over', act: function (s) { s.g = 0; } }],
          info: function (s) { var g = grp(s.k, 'e').slice(0, s.g); return g.length ? g.map(function (x) { return x[1].length; }).join(' + ') + (s.g === grp(s.k, 'e').length ? ' = <b>' + S[s.k].e + ' edges</b>' : '') : 'Tap to light the edges, one group at a time.'; },
          tasks: [{ do: 'Light every edge of the <b>triangular prism</b>.', goal: function (s) { return s.k === 'tprism' && s.g === 3; }, yes: '3 + 3 + 3 = 9 edges.' },
            { do: 'Now count the edges of a <b>triangular pyramid</b>.', goal: function (s) { return s.k === 'tpyr' && s.g === 2; }, yes: '3 + 3 = 6 edges.' }] }), do: '' },
        together: [tgEdges(['cube', 'rprism']), tgEdges(['tprism']), tgEdges(['spyr', 'tpyr'])],
        mistake: '<p>Missing the dashed back edges, or mixing up edges and vertices. Count in groups (front, back, joining) and say "edges are lines, vertices are points". Cones and cylinders are left out: we describe them with words instead.</p>',
        check: [ck('sh-edges', 'plain', 1), ck('sh-edges', 'vertices', 1), ck('sh-edges', 'order', 2), ck('sh-edges', 'tf', 2), ck('sh-edges', 'total', 3)] },

      { id: 'kinds', title: 'Prism or pyramid?', exp: ['E1.1'], skill: 'sh-kind',
        watch: clip(rowV, { ks: ['tprism'] }, [
          ['Two matching ends, joined by rectangles: a prism.'],
          ['One base, with triangles meeting at a point: a pyramid.', { ks: ['tprism', 'spyr'] }],
          ['The base names it: triangular prism, square-based pyramid.', { sym: 'base + kind' }]
        ]),
        example: clip(rowV, { ks: ['tpyr'] }, [
          ['My turn. One base and a point: a pyramid.'],
          ['The base is a triangle: a triangular pyramid.', { sym: 'triangle + pyramid' }],
          ['A cube has two matching square ends. So it is a prism too.', { ks: ['tpyr', 'cube'], sym: 'cube = square prism' }]
        ]),
        together: [tgKind(['tprism', 'rprism']), tgKind(['spyr', 'tpyr']), tgKind(POLY)],
        mistake: '<p>Naming an object by its side faces ("rectangle pyramid" for a triangular prism). Ask: "Two matching ends, or one base and a point? What shape is the base?"</p>',
        check: [ck('sh-kind', 'plain', 1), ck('sh-kind', 'name', 1), ck('sh-kind', 'sides', 2), ck('sh-kind', 'tf', 2), ck('sh-kind', 'all', 3)] },

      { id: 'curved', title: 'Curved surfaces', exp: ['E1.1'], skill: 'sh-curved',
        watch: clip(curvedV, { k: 'cyl', hl: '' }, [
          ['A cylinder has 2 flat faces: circles.', { hl: 'f' }],
          ['Its side is one curved surface. It can roll.', { hc: 1, hl: '' }],
          ['A cone: 1 flat face, 1 curved surface, 1 point.', { k: 'cone', hc: 1, hp: 1, hl: 'f' }]
        ]),
        example: clip(curvedV, { k: 'cone', hl: '' }, [
          ['My turn. I find the flat circle: 1 flat face.', { hl: 'f' }],
          ['I find the curved surface.', { hc: 1 }],
          ['I find the tip: 1 point. I do not count edges on curved objects.', { hp: 1 }]
        ]),
        try: { mount: G3.play({ state: { k: 'cyl' }, draw: function (s) { return solid(put({ hc: 1, hp: 1 }, S[s.k]), 'f'); },
          selects: [{ key: 'k', label: 'Object', options: [['cyl', 'cylinder'], ['cone', 'cone']] }],
          info: function (s) { return s.k === 'cyl' ? '2 flat faces, 1 curved surface, no point.' : '1 flat face, 1 curved surface, 1 point.'; },
          tasks: [{ do: 'Find the object with a <b>point</b>.', goal: function (s) { return s.k === 'cone'; }, yes: 'The cone.' }] }), do: '' },
        together: [tgCurved('cyl'), tgCurved('cone'), tgCurved()],
        mistake: '<p>Counting the curved surface as a flat face (a cylinder "has 3 faces"), or calling the cone\'s tip an edge. Roll the object: "The part that rolls is curved, not flat."</p>',
        check: [ck('sh-curved', 'plain', 1), ck('sh-curved', 'which', 1), ck('sh-curved', 'fill', 2), ck('sh-curved', 'tf', 2), ck('sh-curved', 'count', 3)] },

      { id: 'which', title: 'Which object is it?', exp: ['E1.1'], skill: 'sh-which',
        watch: clip(rowV, { ks: ['cube', 'rprism'], labs: ['A', 'B'] }, [
          ['Look-alikes: both have 6 faces.'],
          ['A has only squares. B has rectangles.', { sym: 'A: cube. B: rectangular prism.' }],
          ['Both have 5 faces. Only the pyramid has a point.', { ks: ['tprism', 'spyr'], sym: 'point: pyramid' }],
          ['Squares and rectangles have 4 square corners.', { ks: ['cube', 'tprism'], sym: 'square corners' }]
        ]),
        example: clip(rowV, { ks: ['cyl', 'cone'], labs: ['A', 'B'] }, [
          ['My turn. "A curved surface and a point." Both are curved.'],
          ['A has no point. B has a point.', { sym: 'point?' }],
          ['So it is B, the cone. I check every part of the clue.', { sym: 'B: cone' }]
        ]),
        together: [tgWhich('cube'), tgWhich('tprism'), tgWhich(R.pick(['cyl', 'cone', 'spyr', 'rprism']))],
        mistake: '<p>Stopping at the first clue that fits (5 faces: "triangular prism") without checking the rest. Have the child test every part of the clue, and name the look-alike that does not fit.</p>',
        check: [ck('sh-which', 'plain', 1), ck('sh-which', 'corners', 1), ck('sh-which', 'tap', 2), ck('sh-which', 'compare', 2), ck('sh-which', 'tf', 3)] }
    ] },

    { id: 'build', title: 'Structures', sub: 'Put objects together, and take them apart.', concepts: [
      { id: 'apart', title: 'Take a structure apart', exp: ['E1.2'], skill: 'sh-build',
        watch: clip(structV, { k: 'house', split: false }, [
          ['This looks like a house.'],
          ['Lift off the roof: a triangular prism on a cube.', { split: true }],
          ['From the front: a square and a triangle.', { sym: '2D: square + triangle' }],
          ['A grain silo: a cone on a cylinder.', { k: 'silo', split: true, sym: '' }]
        ]),
        example: clip(structV, { k: 'tall', split: false }, [
          ['My turn. A tall tower.'],
          ['I take it apart: a pyramid, a cube, another cube.', { split: true }],
          ['3 objects. Flat faces: 5 + 6 + 6 = 17.', { sym: '5 + 6 + 6 = 17' }]
        ]),
        try: { mount: G3.play({ state: { k: 'barn', split: false }, draw: function (s) { return structFig(s.k, s.split); },
          selects: [{ key: 'k', label: 'Structure', options: STK.map(function (k) { return [k, ST[k].name]; }) }],
          buttons: [{ label: 'Take it apart', act: function (s) { s.split = !s.split; } }],
          info: function (s) { return cap(stName(s.k)) + '.'; },
          tasks: [{ do: 'Take the <b>tower</b> apart.', goal: function (s) { return s.k === 'tower' && s.split; }, yes: 'A square-based pyramid on a cube.' },
            { do: 'Find a structure made of <b>3 objects</b>.', goal: function (s) { return ST[s.k].parts.length === 3; }, yes: function (s) { return cap(stName(s.k)) + '.'; } }] }), do: '' },
        together: [tgBuild(['house', 'barn']), tgBuild(['tower', 'silo']), tgBuild(['tall', 'shed'])],
        mistake: '<p>Naming the whole structure as one object ("a pentagon prism") or forgetting faces that touch once the parts come apart. Build it with real blocks, then lift the top off.</p>',
        check: [ck('sh-build', 'plain', 1), ck('sh-build', 'count', 1), ck('sh-build', 'front', 2), ck('sh-build', 'faces', 2), ck('sh-build', 'count', 3)] }
    ] },

    { id: 'congruent', title: 'Congruent', sub: 'Exactly the same size and shape.', concepts: [
      { id: 'cfaces', title: 'Congruent faces', exp: ['E1.3'], skill: 'sh-cface',
        watch: clip(facesV, { f: [[4, 2], [4, 2]] }, [
          ['Face A and face B: both 4 cm by 2 cm.', { sym: 'congruent' }],
          ['Turn B. It is still 2 and 4.', { f: [[4, 2], [2, 4]] }],
          ['Make B 3 cm tall. Now one side is different.', { f: [[4, 2], [4, 3]], sym: 'not congruent' }],
          ['Square corners match square corners: congruent angles.', { f: [[3, 3], [3, 3]], sym: 'every corner matches' }]
        ]),
        example: clip(facesV, { f: [[5, 3], [3, 5]] }, [
          ['My turn. A: 5 by 3. B: 3 by 5.'],
          ['I list short then long: A 3, 5. B 3, 5.', { sym: '3, 5 and 3, 5' }],
          ['Not different just because B is turned. Congruent.', { sym: 'congruent' }]
        ]),
        together: [tgCface('turn'), tgCface('size'), tgCface('any')],
        mistake: '<p>Calling a turned face "different", or calling two rectangles congruent because they are both rectangles. Cut the faces out of paper and lay one on the other.</p>',
        check: [ck('sh-cface', 'plain', 1), ck('sh-cface', 'side', 1), ck('sh-cface', 'tap', 2), ck('sh-cface', 'box', 2), ck('sh-cface', 'edges', 3)] },

      { id: 'cboxes', title: 'Congruent objects', exp: ['E1.3'], skill: 'sh-cbox',
        watch: clip(pairV, { a: [3, 2, 4], b: [3, 2, 3] }, [
          ['A is 3 by 2 by 4. B is one cube shorter.', { sym: 'not congruent' }],
          ['Make B 4 tall. Every length matches.', { b: [3, 2, 4], sym: 'congruent' }],
          ['Lay B on its side: 4 by 2 by 3. Still 2, 3 and 4.', { b: [4, 2, 3], sym: 'still congruent' }]
        ]),
        example: clip(pairV, { a: [2, 3, 4], b: [1, 4, 6] }, [
          ['My turn. Both boxes use 24 cubes.'],
          ['I sort the lengths: A 2, 3, 4. B 1, 4, 6.', { sym: '2, 3, 4 and 1, 4, 6' }],
          ['Same cubes, different shape. Not congruent.', { sym: 'not congruent' }]
        ]),
        try: { mount: G3.play({ state: { a: 4, b: 2, c: 3 }, draw: function (s) { return boxPair([3, 2, 4], [s.a, s.b, s.c]); },
          sliders: [{ key: 'a', label: 'B long', min: 1, max: 5 }, { key: 'b', label: 'B deep', min: 1, max: 5 }, { key: 'c', label: 'B tall', min: 1, max: 5 }],
          info: function (s) { return sameBox([3, 2, 4], [s.a, s.b, s.c]) ? '<b>Congruent</b>: the same three lengths.' : 'Not congruent yet.'; },
          tasks: [{ do: 'Make B congruent to A, but <b>turned</b>: B must not be 3 long.', goal: function (s) { return sameBox([3, 2, 4], [s.a, s.b, s.c]) && s.a !== 3; }, yes: function (s) { return s.a + ' by ' + s.b + ' by ' + s.c + ' is A turned.'; } }] }), do: '' },
        together: [tgCbox('turn'), tgCbox('off'), tgCbox('any')],
        mistake: '<p>Thinking a turned box is different, or that the same number of cubes makes two boxes congruent (2 by 3 by 4 and 1 by 4 by 6 both use 24). Sort the three lengths and compare the lists.</p>',
        check: [ck('sh-cbox', 'plain', 1), ck('sh-cbox', 'missing', 1), ck('sh-cbox', 'tap', 2), ck('sh-cbox', 'tf', 2), ck('sh-cbox', 'missing', 3)] }
    ] },

    { id: 'moves', title: 'Directions', sub: 'How far, and which way to turn.', concepts: [
      { id: 'turns', title: 'Quarter and half turns', exp: ['E1.4'], skill: 'sh-turn',
        watch: clip(compassV, { d: 0 }, [
          ['Facing north.'],
          ['A quarter turn right: east.', { d: 1 }],
          ['A half turn: the opposite way, west.', { d: 3 }],
          ['A quarter turn left: south. 4 quarter turns make a full turn.', { d: 2 }]
        ]),
        example: clip(compassV, { d: 1 }, [
          ['My turn. I face east.'],
          ['A quarter turn left: north. Not south: left goes the other way.', { d: 0 }],
          ['Another quarter turn left: west.', { d: -1 }]
        ]),
        try: { mount: G3.play({ state: { d: 0 }, draw: function (s) { return compass(s.d); },
          buttons: [{ label: 'Quarter turn left', act: function (s) { s.d--; } }, { label: 'Quarter turn right', act: function (s) { s.d++; } }, { label: 'Half turn', act: function (s) { s.d += 2; } }],
          info: function (s) { return 'Facing <b>' + DN[((s.d % 4) + 4) % 4] + '</b>.'; },
          tasks: [{ do: 'Face <b>south</b> with one turn.', goal: function (s) { return s.d === 2 || s.d === -2; }, yes: 'A half turn.' },
            { do: 'Now face <b>east</b>.', reset: false, goal: function (s) { return ((s.d % 4) + 4) % 4 === 1; }, yes: 'From south, a quarter turn left.' }] }), do: '' },
        together: [tgTurn(1), tgTurn(2), tgTurn(3)],
        mistake: '<p>Turning right as if still facing north after an earlier turn, or mixing up quarter and half turns. Have the child stand up and turn their own body for each step.</p>',
        check: [ck('sh-turn', 'plain', 1), ck('sh-turn', 'tap', 1), ck('sh-turn', 'count', 2), ck('sh-turn', 'tf', 2), ck('sh-turn', 'full', 3)] },

      { id: 'map', title: 'Follow directions on a map', exp: ['E1.4'], skill: 'sh-path',
        watch: clip(mapV, { path: [[0, 0]], dir: 0 }, [
          ['Start at A1, facing north.'],
          ['Forward 3: A2, A3, A4.', walkFrames(0, 0, 0, ['forward 1', 'forward 1', 'forward 1'])],
          ['A quarter turn right: now east.', { dir: 1 }],
          ['Forward 2. At C4, after 3 + 2 = 5 squares.', walkFrames(0, 0, 0, ['forward 3', 'right', 'forward 1', 'forward 1']).slice(2)]
        ]),
        example: clip(mapV, { path: [[1, 0]], dir: 1 }, [
          ['My turn. B1, facing east.'],
          ['Forward 2: D1.', walkFrames(1, 0, 1, ['forward 1', 'forward 1'])],
          ['A quarter turn left: north. Not south.', { dir: 0 }],
          ['Forward 3: D4. 2 + 3 = 5 squares.', walkFrames(1, 0, 1, ['forward 2', 'left', 'forward 1', 'forward 1', 'forward 1']).slice(2)]
        ]),
        together: [tgPath(1), tgPath(2), tgPath(3)],
        mistake: '<p>Counting the starting square as the first step, or turning the wrong way after facing east or south. Turn the page so the arrow points up before each turn.</p>',
        check: [ck('sh-path', 'plain', 1), ck('sh-path', 'walk', 1), ck('sh-path', 'dist', 2), ck('sh-path', 'which', 2), ck('sh-path', 'face', 3)] },

      { id: 'give', title: 'Give directions', exp: ['E1.4'], skill: 'sh-give',
        watch: clip(mapV, { path: [[1, 0]], dir: 0 }, [
          ['From B1 to E4. North first: 3 rows.', walkFrames(1, 0, 0, ['forward 3'])],
          ['E is to the east: a quarter turn right.', { dir: 1 }],
          ['Then 3 across.', walkFrames(1, 0, 0, ['forward 3', 'right', 'forward 3']).slice(2)],
          ['Forward 3, quarter turn right, forward 3.', { sym: '3 + 3 = 6 squares' }]
        ]),
        example: clip(mapV, { path: [[4, 1]], dir: 0 }, [
          ['My turn. E2 to B5.'],
          ['Rows: 2 to 5 is 3. I go forward 3.', walkFrames(4, 1, 0, ['forward 3'])],
          ['B is to the west, so a quarter turn left. Not right.', { dir: 3 }],
          ['E to B is 3 columns. Forward 3.', walkFrames(4, 1, 0, ['forward 3', 'left', 'forward 3']).slice(2)]
        ]),
        try: { mount: G3.play({ state: { pos: [0, 0], dir: 0, path: [[0, 0]], log: [], note: '' }, draw: function (s) { return map(s.path, s.dir); },
          buttons: [{ label: 'Forward 1', act: function (s) { var x = s.pos[0] + MOVE[s.dir][0], y = s.pos[1] + MOVE[s.dir][1]; if (!on([x, y])) { s.note = 'That goes off the map. Turn first.'; return; } s.pos = [x, y]; s.path.push([x, y]); s.log.push('forward 1'); s.note = ''; } },
            { label: 'Quarter turn left', act: function (s) { s.dir = (s.dir + 3) % 4; s.log.push('quarter turn left'); s.note = ''; } },
            { label: 'Quarter turn right', act: function (s) { s.dir = (s.dir + 1) % 4; s.log.push('quarter turn right'); s.note = ''; } },
            { label: 'Start over', act: function (s) { s.pos = [0, 0]; s.dir = 0; s.path = [[0, 0]]; s.log = []; s.note = ''; } }],
          info: function (s) { return (s.note ? s.note + ' ' : '') + 'At <b>' + cell(s.pos[0], s.pos[1]) + '</b>, facing ' + DN[s.dir] + '.'; },
          tasks: [{ do: 'Walk from A1 to the <b>Library at E6</b>.', goal: function (s) { return s.pos[0] === 4 && s.pos[1] === 5; }, yes: function (s) { return s.path.length - 1 + ' squares.'; } }] }), do: '' },
        together: [tgGive(1), tgGive(2), tgGive(3)],
        mistake: '<p>Giving a turn without a direction ("turn"), or swapping the numbers (across first, then up). Have the child read their directions aloud while you walk them out.</p>',
        check: [ck('sh-give', 'plain', 1), ck('sh-give', 'turn', 1), ck('sh-give', 'fewest', 2), ck('sh-give', 'tf', 2), ck('sh-give', 'back', 3)] }
    ] }
  ];

  A.register(CH, {
    full: true,
    lessons: LESSONS,
    quiz: [
      { q: 'How many edges does this rectangular prism have?', type: 'num', answer: 12, fig: solid('rprism', 'e'), hint: 'Front 4, back 4, then the 4 joining them.', explain: '4 + 4 + 4 = 12 edges.', meta: { k: 'g3sh-e-num', names: ['rectangular prism'], part: 'e' } },
      { q: 'A pyramid has a square base. How many flat faces does it have in all?', type: 'num', answer: 5, hint: '4 triangles and the base.', explain: '4 + 1 = 5.', meta: { k: 'g3sh-k-sides', kind: 'pyramid', n: 4, ask: 'all' } },
      { q: 'How many flat faces does a cone have?', type: 'num', answer: 1, fig: small('cone'), hint: 'The curved surface is not flat.', explain: '1 flat face: the circle.', meta: { k: 'g3sh-c-num', c: { cone: 1 }, ask: 'flat' } },
      { q: 'Take this house apart. How many flat faces do the parts have in all?', type: 'num', answer: 11, fig: structFig('house', true), hint: 'Cube, then triangular prism.', explain: '6 + 5 = 11.', meta: { k: 'g3sh-b-faces', st: 'house', n: 1 } },
      { q: 'Box B is box A turned. A is 2 by 3 by 5 cubes. B is 5 long and 2 deep. How tall is B?', type: 'num', answer: 3, hint: 'Which length is left?', explain: '3 tall.', meta: { k: 'g3sh-cb-miss', a: [2, 3, 5], given: [5, 2] } },
      { q: 'You face south. You make a quarter turn left. Which way do you face now?', type: 'mc', options: ['east', 'west', 'north', 'south'], answer: 0, hint: 'Facing south, your left hand points east.', explain: 'East.', meta: { k: 'g3sh-t-mc', d: 2, mv: ['quarter turn left'] } },
      { q: 'Start at B2, facing north. Go forward 3, then make a quarter turn right, then go forward 2. How many squares do you walk in all?', type: 'num', answer: 5, fig: map([[1, 1]], 0), hint: 'Add the forward moves.', explain: '3 + 2 = 5.', meta: { k: 'g3sh-p-walk', acts: ['forward 3', 'right', 'forward 2'] } }
    ],
    practice: SKILLS.map(function (s) { return { id: s.id, name: s.name, code: s.code, gen: DEF[s.id][0][2] }; })
  });

  var SHAPES = {};
  SKILLS.forEach(function (s) { SHAPES[s.id] = DEF[s.id].slice(1); });
  Q.shapes(CH, SHAPES);
})();
