(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  /* solids: 3D points, edges (h = hidden), visible faces. Facts are for flat faces.
     Curved objects are described in words (flat faces, curved surface, point): edges and vertices are counted only on objects with flat faces. */
  var S = {
    cube: { name: 'cube', f: 6, e: 12, v: 8, faces: '6 squares', pts: [[0, 0, 0], [110, 0, 0], [110, 110, 0], [0, 110, 0], [0, 0, 110], [110, 0, 110], [110, 110, 110], [0, 110, 110]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 5], [2, 6], [3, 7], [5, 6], [6, 7], [0, 4, 1], [4, 5, 1], [4, 7, 1]], vis: [[0, 1, 2, 3], [3, 2, 6, 7], [1, 5, 6, 2]] },
    rprism: { name: 'rectangular prism', f: 6, e: 12, v: 8, faces: '6 rectangles', pts: [[0, 0, 0], [170, 0, 0], [170, 90, 0], [0, 90, 0], [0, 0, 90], [170, 0, 90], [170, 90, 90], [0, 90, 90]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 5], [2, 6], [3, 7], [5, 6], [6, 7], [0, 4, 1], [4, 5, 1], [4, 7, 1]], vis: [[0, 1, 2, 3], [3, 2, 6, 7], [1, 5, 6, 2]] },
    tprism: { name: 'triangular prism', f: 5, e: 9, v: 6, faces: '2 triangles and 3 rectangles', pts: [[0, 0, 0], [130, 0, 0], [65, 105, 0], [0, 0, 150], [130, 0, 150], [65, 105, 150]],
      edges: [[0, 1], [1, 2], [2, 0], [1, 4], [2, 5], [4, 5], [0, 3, 1], [3, 4, 1], [3, 5, 1]], vis: [[0, 1, 2], [1, 4, 5, 2]] },
    spyr: { name: 'square-based pyramid', f: 5, e: 8, v: 5, faces: '1 square and 4 triangles', pts: [[0, 0, 0], [150, 0, 0], [150, 0, 150], [0, 0, 150], [75, 150, 75]],
      edges: [[0, 1], [1, 2], [0, 4], [1, 4], [2, 4], [2, 3, 1], [3, 0, 1], [3, 4, 1]], vis: [[0, 1, 4], [1, 2, 4]] },
    tpyr: { name: 'triangular pyramid', f: 4, e: 6, v: 4, faces: '4 triangles', pts: [[0, 0, 0], [160, 0, 0], [70, 0, 130], [75, 150, 40]],
      edges: [[0, 1], [1, 2], [0, 3], [1, 3], [2, 3], [0, 2, 1]], vis: [[0, 1, 3], [1, 2, 3]] },
    cyl: { name: 'cylinder', f: 2, faces: '2 circles and 1 curved surface', words: '2 flat faces (circles), 1 curved surface and no point', round: 'cyl' },
    cone: { name: 'cone', f: 1, faces: '1 circle, 1 curved surface and 1 point', words: '1 flat face (a circle), 1 curved surface and 1 point', round: 'cone' }
  };
  var ORDER = ['cube', 'rprism', 'tprism', 'spyr', 'tpyr', 'cyl', 'cone'], POLY = ORDER.filter(function (k) { return !S[k].round; });
  function P(p, ox, oy) { return [ox + p[0] + p[2] * 0.5, oy - p[1] - p[2] * 0.36]; }
  function solid(key, hl, ox, oy, label) {
    var d = typeof key === 'string' ? S[key] : key, s = '', col = 'var(--strand)';
    ox = ox === undefined ? 60 : ox; oy = oy === undefined ? 230 : oy;
    var faceFill = hl === 'f' ? 'color-mix(in srgb,var(--hi) 70%,var(--card))' : 'color-mix(in srgb,' + col + ' 20%,var(--card))';
    var lineCol = hl === 'e' ? 'var(--bad)' : 'var(--ink)', lw = hl === 'e' ? 5 : 3;
    if (d.round) {
      lineCol = 'var(--ink)'; lw = 3;
      var rx = d.rx || 80, cx = ox + 90, ry = Math.round(rx * 0.33);
      if (d.round === 'cyl') {
        var top = oy - (d.ht || 150);
        s += '<path d="M' + (cx - rx) + ' ' + top + ' V' + oy + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + oy + ' V' + top + '" style="fill:' + faceFill.replace('70%', '30%') + '"/>';
        s += '<ellipse cx="' + cx + '" cy="' + top + '" rx="' + rx + '" ry="' + ry + '" style="fill:' + faceFill + ';stroke:' + lineCol + '" stroke-width="' + lw + '"/>';
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + oy + '" fill="none" style="stroke:' + lineCol + '" stroke-width="' + lw + '"/>';
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + oy + '" fill="none" style="stroke:' + lineCol + '" stroke-width="2" stroke-dasharray="6 5"/>';
        s += '<line x1="' + (cx - rx) + '" y1="' + top + '" x2="' + (cx - rx) + '" y2="' + oy + '" style="stroke:var(--ink)" stroke-width="3"/><line x1="' + (cx + rx) + '" y1="' + top + '" x2="' + (cx + rx) + '" y2="' + oy + '" style="stroke:var(--ink)" stroke-width="3"/>';
      } else {
        var ap = oy - (d.ht || 170);
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' L' + cx + ' ' + ap + ' L' + (cx + rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx - rx) + ' ' + oy + 'Z" style="fill:color-mix(in srgb,' + col + ' 20%,var(--card))"/>';
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + oy + '" style="fill:' + (hl === 'f' ? faceFill : 'none') + ';stroke:' + lineCol + '" stroke-width="' + lw + '"/>';
        s += '<path d="M' + (cx - rx) + ' ' + oy + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + oy + '" fill="none" style="stroke:' + lineCol + '" stroke-width="2" stroke-dasharray="6 5"/>';
        s += '<line x1="' + (cx - rx) + '" y1="' + oy + '" x2="' + cx + '" y2="' + ap + '" style="stroke:var(--ink)" stroke-width="3"/><line x1="' + (cx + rx) + '" y1="' + oy + '" x2="' + cx + '" y2="' + ap + '" style="stroke:var(--ink)" stroke-width="3"/>';
      }
      return A.svg(ox + 200, oy + 34, s, label || 'A ' + d.name);
    }
    var pp = d.pts.map(function (p) { return P(p, ox, oy); });
    d.vis.forEach(function (f) { s += '<polygon points="' + f.map(function (i) { return pp[i].join(','); }).join(' ') + '" style="fill:' + faceFill + '"/>'; });
    d.edges.forEach(function (e) {
      var a = pp[e[0]], b = pp[e[1]];
      s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" style="stroke:' + (e[2] ? (hl === 'e' ? 'var(--bad)' : 'var(--ink2)') : lineCol) + '" stroke-width="' + (e[2] ? 2 : lw) + '"' + (e[2] ? ' stroke-dasharray="6 5"' : '') + ' stroke-linecap="round"/>';
    });
    if (hl === 'v') pp.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>'; });
    var xs = pp.map(function (p) { return p[0]; }), ys = pp.map(function (p) { return p[1]; });
    return A.svg(Math.ceil(Math.max.apply(null, xs) + 20), Math.ceil(Math.max.apply(null, ys) + 16), s, label || 'A ' + d.name);
  }
  /* a box built from cubes, a by b by c */
  function box(a, b, c, x, base, p, u) { return A.draw.prism(x, base, a * u, b * u, c * u, a, b, c, p); }
  /* grid map with a walker. path: list of [col,row]; dir 0 up,1 right,2 down,3 left */
  var COLS = 'ABCDEF';
  function map(path, dir, label) {
    var sz = 62, s = '', W = 6 * sz + 40, H = 6 * sz + 40;
    for (var i = 0; i < 6; i++) {
      s += '<text x="' + (36 + i * sz + sz / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="19" class="tb">' + COLS[i] + '</text>';
      s += '<text x="16" y="' + (12 + (5 - i) * sz + sz / 2 + 6) + '" text-anchor="middle" font-size="19" class="tb">' + (i + 1) + '</text>';
    }
    for (var c = 0; c < 6; c++) for (var r = 0; r < 6; r++) s += '<rect x="' + (36 + c * sz) + '" y="' + (12 + (5 - r) * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1.5"/>';
    var places = [[4, 5, 'Library', 'var(--sc)'], [0, 4, 'Park', 'var(--sd)'], [5, 0, 'Pool', 'var(--sb)']];
    places.forEach(function (pl) { s += '<rect x="' + (38 + pl[0] * sz) + '" y="' + (14 + (5 - pl[1]) * sz) + '" width="' + (sz - 4) + '" height="' + (sz - 4) + '" rx="8" style="fill:color-mix(in srgb,' + pl[3] + ' 30%,var(--card))"/><text x="' + (36 + pl[0] * sz + sz / 2) + '" y="' + (12 + (5 - pl[1]) * sz + sz - 8) + '" text-anchor="middle" font-size="13" class="tb">' + pl[2] + '</text>'; });
    var C = function (p) { return [36 + p[0] * sz + sz / 2, 12 + (5 - p[1]) * sz + sz / 2]; };
    if (path.length > 1) s += '<polyline points="' + path.map(function (p) { return C(p).join(','); }).join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>';
    var st = C(path[0]); s += '<circle cx="' + st[0] + '" cy="' + st[1] + '" r="9" style="fill:var(--card);stroke:var(--ink)" stroke-width="3"/>';
    var e = C(path[path.length - 1]);
    s += '<g transform="translate(' + e[0] + ' ' + e[1] + ') rotate(' + dir * 90 + ')"><polygon points="0,-20 15,14 0,6 -15,14" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/></g>';
    return A.svg(W, H, s, label || 'Map grid with columns A to F and rows 1 to 6');
  }
  /* structures: parts sized to fit, built from the same point lists as the solids */
  var BOX = { cube: [110, 110, 110], rprism: [170, 90, 90] };
  function boxDef(k) { var d = BOX[k], w = d[0], h = d[1], z = d[2], e = S[k].edges.map(function (x) { return x.slice(); });
    e[6][2] = 1; e[8][2] = 1; /* the roof hides the back and left top edges */
    return { name: S[k].name, pts: [[0, 0, 0], [w, 0, 0], [w, h, 0], [0, h, 0], [0, 0, z], [w, 0, z], [w, h, z], [0, h, z]], edges: e, vis: S[k].vis }; }
  function roofDef(k) { var d = BOX[k], w = d[0], h = d[1], z = d[2], r = 70;
    return { name: 'triangular prism', pts: [[0, h, 0], [w, h, 0], [w / 2, h + r, 0], [0, h, z], [w, h, z], [w / 2, h + r, z]], edges: S.tprism.edges, vis: S.tprism.vis }; }
  function pyrDef(k) { var d = BOX[k], w = d[0], h = d[1], z = d[2];
    return { name: 'square-based pyramid', pts: [[0, h, 0], [w, h, 0], [w, h, z], [0, h, z], [w / 2, h + 100, z / 2]], edges: S.spyr.edges, vis: S.spyr.vis }; }
  var ST = { house: ['cube', 'tprism', 'It looks like a house.'], barn: ['rprism', 'tprism', 'It looks like a barn.'], tower: ['cube', 'spyr', 'It looks like a tower with a pointed roof.'], silo: ['cyl', 'cone', 'It looks like a grain silo.'] };
  function inner(x) { return x.replace(/^<svg[^>]*>|<\/svg>$/g, ''); }
  function structFig(k, split) {
    var c = ST[k], b = c[0], t = c[1], lift = split ? 70 : 0, bot, top;
    if (b === 'cyl') { bot = solid({ name: 'cylinder', round: 'cyl', rx: 80, ht: 150 }, '', 60, 380); top = solid({ name: 'cone', round: 'cone', rx: 80, ht: 130 }, '', 60, 380 - 150 - lift); }
    else { bot = solid(split ? b : boxDef(b), '', 30, 380); top = solid(t === 'tprism' ? roofDef(b) : pyrDef(b), '', 30, 380 - lift); }
    return A.svg(320, 420, '<g>' + inner(bot) + '</g><g>' + inner(top).replace(/var\(--strand\)/g, 'var(--sb)') + '</g>', (split ? 'Taken apart: a ' + S[t].name + ' lifted off a ' : 'A ' + S[t].name + ' on top of a ') + S[b].name);
  }
  var DIRS = ['up (north)', 'right (east)', 'down (south)', 'left (west)'], DN = ['north', 'east', 'south', 'west'];

  /* ---------- Lessons: one idea per screen ---------- */
  var CH = 'shapes';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function cap(t) { return t ? '<p class="g3-sym" style="font-size:1.1rem;color:var(--ink)">' + t + '</p>' : ''; }
  var HLN = { f: 'faces', e: 'edges', v: 'vertices' };
  /* what an object has, in words: counts for flat-faced objects, words for curved ones */
  function facts(k) { var d = S[k]; return d.round ? d.words : G3.pl(d.f, 'flat face') + ', ' + G3.pl(d.e, 'edge') + ' and ' + G3.pl(d.v, 'vertex', 'vertices'); }
  function solidInfo(k) { return '<b>' + S[k].name.charAt(0).toUpperCase() + S[k].name.slice(1) + '</b>: ' + facts(k) + '.'; }
  function boxPair(a, b, c, show) {
    var u = 18, s = box(3, 2, 4, 20, 150, 2, u) + '<text x="60" y="180" text-anchor="middle" font-size="18" class="tb">A: 3 by 2 by 4</text>' + box(a, b, c, 230, 150, 3, u) + '<text x="' + (230 + a * u / 2 + 10) + '" y="180" text-anchor="middle" font-size="18" class="tb">B: ' + a + ' by ' + b + ' by ' + c + '</text>';
    return A.svg(440, 190, s, 'Box A is 3 by 2 by 4 cubes. Box B is ' + a + ' by ' + b + ' by ' + c + ' cubes.');
  }
  function congruent(a, b, c) { return [a, b, c].sort(function (x, y) { return x - y; }).join() === '2,3,4'; }
  /* an arrow that turns: quarter and half turns */
  function compass(dir, say) {
    var s = '<circle cx="110" cy="110" r="88" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
    ['N', 'E', 'S', 'W'].forEach(function (l, i) { var a = -Math.PI / 2 + i * Math.PI / 2; s += '<text x="' + (110 + 102 * Math.cos(a)) + '" y="' + (117 + 102 * Math.sin(a)) + '" text-anchor="middle" font-size="20" class="tb">' + l + '</text>'; });
    s += '<g style="transition:transform .5s ease;transform-origin:110px 110px;transform:rotate(' + dir * 90 + 'deg)"><polygon points="110,40 132,120 110,104 88,120" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/></g>';
    return '<div>' + A.svg(220, 230, s, 'Facing ' + DN[((dir % 4) + 4) % 4]) + cap(say) + '</div>';
  }
  function walkStep(s, act) {
    if (act === 'f') { var d = [[0, 1], [1, 0], [0, -1], [-1, 0]][s.dir], nx = s.pos[0] + d[0], ny = s.pos[1] + d[1]; if (nx < 0 || nx > 5 || ny < 0 || ny > 5) { s.note = 'That would go off the map. Turn first.'; return; } s.pos = [nx, ny]; s.path.push([nx, ny]); s.log.push('forward 1'); }
    else { s.dir = (s.dir + (act === 'l' ? 3 : act === 'r' ? 1 : 2)) % 4; s.log.push(act === 'l' ? 'quarter turn left' : act === 'r' ? 'quarter turn right' : 'half turn'); }
    s.note = '';
  }

  /* drawings for the Watch and My turn clips: each takes the clip's state */
  function solidView(s) { return '<div>' + solid(s.k, s.hl) + cap(s.say) + '</div>'; }
  function structView(s) { return '<div>' + structFig(s.k, s.split) + cap(s.say) + '</div>'; }
  function pairView(s) { return '<div>' + boxPair(s.a, s.b, s.c) + cap(s.say) + '</div>'; }
  function compassView(s) { return compass(s.d, s.say); }
  function mapView(s) { return '<div>' + map(s.path, s.dir) + cap(s.say) + '</div>'; }

  var LESSONS = [
    { id: 'solids', title: '3D objects', sub: 'Faces, edges and vertices.', concepts: [
      { id: 'parts', title: 'Faces, edges and vertices', exp: ['E1.1'], skill: 'sh-count',
        body: '<p>A <b>face</b> is a flat surface. An <b>edge</b> is where two faces meet. A <b>vertex</b> is a corner where edges meet. Dashed lines are edges hidden at the back. A cone or cylinder has a <b>curved surface</b>, so we describe it in words.</p>',
        watch: { mount: G3.view(solidView, { k: 'cube', hl: '', say: 'A cube' }), steps: [
          { say: 'This is a cube.', ms: 1200 },
          { say: 'The flat surfaces are <b>faces</b>. A cube has 6.', act: function (t) { return t.set({ hl: 'f', say: '6 faces' }, 1800); } },
          { say: 'Where two faces meet is an <b>edge</b>. A cube has 12.', act: function (t) { return t.set({ hl: 'e', say: '12 edges' }, 1800); } },
          { say: 'The corners are <b>vertices</b>. A cube has 8.', act: function (t) { return t.set({ hl: 'v', say: '8 vertices' }, 1800); } }
        ] },
        example: { mount: G3.view(solidView, { k: 'tprism', hl: '', say: 'A triangular prism' }), steps: [
          { say: 'My turn. This is a triangular prism.', ms: 1300 },
          { say: 'I find the flat faces: 2 triangles and 3 rectangles. That is <b>5 faces</b>.', act: function (t) { return t.set({ hl: 'f', say: '5 faces' }, 1900); } },
          { say: 'I find the edges, where two faces meet. There are <b>9 edges</b>.', act: function (t) { return t.set({ hl: 'e', say: '9 edges' }, 1900); } },
          { say: 'I find the corners. There are <b>6 vertices</b>.', act: function (t) { return t.set({ hl: 'v', say: '6 vertices' }, 1900); } }
        ] },
        try: { mount: G3.play({ state: { k: 'cube', hl: '' }, draw: function (s) { return solid(s.k, s.hl); },
          selects: [{ key: 'k', label: 'Object', options: ORDER.map(function (k) { return [k, S[k].name]; }) }],
          buttons: ['f', 'e', 'v'].map(function (h) { return { label: 'Show ' + HLN[h], act: function (s) { s.hl = s.hl === h ? '' : h; } }; }),
          info: function (s) { return solidInfo(s.k); },
          tasks: [{ do: 'Show the <b>vertices</b> of a <b>triangular prism</b>. How many?', goal: function (s) { return s.k === 'tprism' && s.hl === 'v'; }, yes: '6 vertices: 3 on each triangle end.' },
            { do: 'Find an object with a <b>curved surface</b> and <b>no point</b>.', goal: function (s) { return s.k === 'cyl'; }, yes: 'A cylinder: 2 flat circles and 1 curved surface.' }] }), do: '' },
        key: '<p>Face: <b>flat</b>. Edge: <b>where faces meet</b>. Vertex: <b>corner</b>.</p>',
        check: [TU('s1', 0), TU('s1', 1), SK('sh-count', 1)] },

      { id: 'kinds', title: 'Prisms and pyramids', exp: ['E1.1'], skill: 'sh-name',
        body: '<p>A <b>prism</b> has two matching ends joined by rectangles. A <b>pyramid</b> has one base, with triangles that meet at a point. The <b>base</b> gives the object its name.</p>',
        watch: { mount: G3.view(solidView, { k: 'tprism', hl: '', say: '' }), steps: [
          { say: 'A triangular prism: two triangle ends, joined by rectangles.', act: function (t) { return t.set({ hl: 'f', say: 'Triangular prism' }, 2000); } },
          { say: 'A square-based pyramid: a square base, with 4 triangles meeting at a point.', act: function (t) { return t.set({ k: 'spyr', hl: 'f', say: 'Square-based pyramid' }, 2200); } },
          { say: 'A triangular pyramid: every face is a triangle.', act: function (t) { return t.set({ k: 'tpyr', say: 'Triangular pyramid' }, 2000); } }
        ] },
        example: { mount: G3.view(solidView, { k: 'rprism', hl: 'f', say: 'Rectangular prism' }), steps: [
          { say: 'My turn. This has two matching ends, joined by rectangles. It is a <b>prism</b>: a rectangular prism.', ms: 2200 },
          { say: 'This one has one triangle base, and triangles that meet at a point. It is a <b>pyramid</b>: a triangular pyramid.', act: function (t) { return t.set({ k: 'tpyr', say: 'Triangular pyramid' }, 2300); } },
          { say: 'A cube has two matching square ends, joined by squares. So a cube is a prism too.', act: function (t) { return t.set({ k: 'cube', say: 'Cube: a prism' }, 2200); } }
        ] },
        try: { mount: G3.play({ state: { k: 'cube' }, draw: function (s) { return solid(s.k, 'f'); },
          selects: [{ key: 'k', label: 'Object', options: ORDER.map(function (k) { return [k, S[k].name]; }) }],
          info: function (s) { return 'Faces: ' + S[s.k].faces + '.'; },
          tasks: [{ do: 'Find the object with <b>1 square and 4 triangles</b>.', goal: function (s) { return s.k === 'spyr'; }, yes: 'A square-based pyramid.' },
            { do: 'Find the object with <b>2 triangles and 3 rectangles</b>.', goal: function (s) { return s.k === 'tprism'; }, yes: 'A triangular prism.' }] }), do: '' },
        key: '<p>Prism: <b>two matching ends</b>. Pyramid: <b>one base and a point</b>.</p>',
        mistake: '<p>Naming the object by the side faces ("rectangle prism" for a triangular prism). Ask: "What shape are the two ends?"</p>',
        check: [TU('s1', 2), SK('sh-name', 1), SK('sh-name', 2)] },

      { id: 'count', title: 'Count without missing any', exp: ['E1.1'], skill: 'sh-count', hard: true,
        body: '<p>Count in an order so you never miss or double count. For edges: <b>the top, the bottom, then the ones going up</b>.</p>',
        watch: { mount: G3.view(solidView, { k: 'rprism', hl: 'e', say: '' }), steps: [
          { say: '4 edges around the top.', act: function (t) { return t.set({ say: '4' }, 1500); } },
          { say: '4 around the bottom (one is dashed at the back).', act: function (t) { return t.set({ say: '4 + 4' }, 1500); } },
          { say: '4 going up. 4 + 4 + 4 = <b>12 edges</b>.', act: function (t) { return t.set({ say: '4 + 4 + 4 = 12' }, 2000); } }
        ] },
        example: { mount: G3.view(solidView, { k: 'tprism', hl: 'e', say: '' }), steps: [
          { say: 'My turn. I count the edges of a triangular prism, in order.', ms: 1500 },
          { say: '3 edges around the front triangle.', act: function (t) { return t.set({ say: '3' }, 1500); } },
          { say: '3 around the back triangle. Some are dashed because they are hidden.', act: function (t) { return t.set({ say: '3 + 3' }, 1700); } },
          { say: '3 going from the front to the back. 3 + 3 + 3 = <b>9 edges</b>.', act: function (t) { return t.set({ say: '3 + 3 + 3 = 9' }, 2000); } }
        ] },
        ways: [
          { label: 'Use the ends', html: '<p>A triangular prism has 2 triangle ends. Each has 3 vertices: 3 + 3 = <b>6</b>. Each has 3 edges, plus 3 joining them: 3 + 3 + 3 = <b>9 edges</b>.</p><div class="fig">' + solid('tprism', 'v') + '</div>' },
          { label: 'Hold a real box', html: '<p>Hold a cereal box. Put a finger on each corner as you count. Then run a finger along each edge.</p>' },
          { label: 'Use the table', html: '<div class="tbl"><table><thead><tr><th class="l">Object</th><th>F</th><th>E</th><th>V</th></tr></thead><tbody>' + POLY.map(function (k) { return '<tr><td class="l">' + S[k].name + '</td><td>' + S[k].f + '</td><td>' + S[k].e + '</td><td>' + S[k].v + '</td></tr>'; }).join('') + '</tbody></table></div>' }
        ],
        key: '<p>Count <b>in order</b>: top, bottom, then up.</p>',
        mistake: '<p>Forgetting the hidden (dashed) edges and vertices at the back. Point out the dashed lines every time.</p>',
        check: [SK('sh-count', 2), SK('sh-count', 3)] }
    ] },

    { id: 'build', title: 'Structures', sub: 'Put objects together, and take them apart.', concepts: [
      { id: 'apart', title: 'Take a structure apart', exp: ['E1.2'], skill: 'sh-name',
        body: '<p>Buildings and toys are made of 3D objects put together. A house can be a <b>cube</b> with a <b>triangular prism</b> on top.</p>',
        watch: { mount: G3.view(structView, { k: 'house', split: false, say: 'A house' }), steps: [
          { say: 'This looks like a house.', ms: 1300 },
          { say: 'Lift off the roof. It is a triangular prism.', act: function (t) { return t.set({ split: true, say: 'Triangular prism on a cube' }, 1800); } },
          { say: 'A grain silo: a cone on a cylinder.', act: function (t) { return t.set({ k: 'silo', split: true, say: 'Cone on a cylinder' }, 2000); } }
        ] },
        example: { mount: G3.view(structView, { k: 'tower', split: false, say: 'A tower' }), steps: [
          { say: 'My turn. This looks like a tower with a pointed roof.', ms: 1400 },
          { say: 'I lift off the top. It is a square-based pyramid on a cube.', act: function (t) { return t.set({ split: true, say: 'Square-based pyramid on a cube' }, 2000); } },
          { say: 'This barn is a triangular prism on a rectangular prism.', act: function (t) { return t.set({ k: 'barn', split: true, say: 'Triangular prism on a rectangular prism' }, 2000); } },
          { say: 'A structure is objects put together.', ms: 1600 }
        ] },
        try: { mount: G3.play({ state: { k: 'barn', split: false }, draw: function (s) { return structFig(s.k, s.split); },
          selects: [{ key: 'k', label: 'Structure', options: [['house', 'house'], ['barn', 'barn'], ['tower', 'tower'], ['silo', 'silo']] }],
          buttons: [{ label: 'Take it apart', act: function (s) { s.split = !s.split; } }],
          info: function (s) { var c = ST[s.k]; return 'A <b>' + S[c[1]].name + '</b> on a <b>' + S[c[0]].name + '</b>.'; },
          tasks: [{ do: 'Take the <b>tower</b> apart. What is on top?', goal: function (s) { return s.k === 'tower' && s.split; }, yes: 'A square-based pyramid on a cube.' }] }), do: '' },
        key: '<p>A structure is <b>objects put together</b>.</p>',
        check: [TU('s2', 1), G3.turn({ q: 'A barn is a rectangular prism with what on top?', options: ['a triangular prism', 'a cone', 'a cylinder'], answer: 0, why: 'The roof has triangle ends joined by rectangles.' })] },

      { id: 'everyday', title: 'Objects all around us', exp: ['E1.2', 'E1.1'], skill: 'sh-name',
        body: '<p>Look for 3D objects in things you use. A can is a <b>cylinder</b>. A tent is a <b>triangular prism</b>. Look at the flat 2D shapes too: the front of a house shows a square and a triangle.</p>',
        watch: { mount: G3.view(solidView, { hl: '', k: 'cyl', say: 'A can of soup' }), steps: [
          { say: 'A can of soup is a cylinder.', ms: 1600 },
          { say: 'A tent is a triangular prism.', act: function (t) { return t.set({ k: 'tprism', say: 'A tent' }, 1600); } },
          { say: 'A traffic cone is a cone. A number cube is a cube.', act: function (t) { return t.set({ k: 'cone', say: 'A traffic cone' }, 1400).then(function () { return t.set({ k: 'cube', say: 'A number cube' }, 1600); }); } }
        ] },
        example: { mount: G3.view(solidView, { k: 'rprism', hl: '', say: 'A cereal box' }), steps: [
          { say: 'My turn. A cereal box is a rectangular prism. Its faces are 6 rectangles.', ms: 1900 },
          { say: 'An ice cream cone is a cone. It has 1 circle and 1 curved surface.', act: function (t) { return t.set({ k: 'cone', say: 'An ice cream cone' }, 1900); } },
          { say: 'A roll of paper towel is a cylinder. It has 2 circles and 1 curved surface.', act: function (t) { return t.set({ k: 'cyl', say: 'A roll of paper towel' }, 1900); } },
          { say: 'I name the 3D object first, then its 2D faces.', ms: 1600 }
        ] },
        key: '<p>Name the <b>3D object</b>, then the <b>2D faces</b>.</p>',
        check: [TU('s2', 0), TU('s2', 2)] }
    ] },

    { id: 'congruent', title: 'Congruent objects', sub: 'Exactly the same size and shape.', concepts: [
      { id: 'same', title: 'What congruent means', exp: ['E1.3'], skill: 'sh-congruent',
        body: '<p>Two objects are <b>congruent</b> if they are exactly the same size and shape. Their matching faces and edges are all the same length.</p>',
        watch: { mount: G3.view(pairView, { a: 3, b: 2, c: 3, say: '' }), steps: [
          { say: 'Box A is 3 by 2 by 4. Box B is 3 by 2 by 3.', ms: 1800 },
          { say: 'B is one cube shorter. <b>Not congruent.</b>', act: function (t) { return t.set({ say: 'Not congruent' }, 1600); } },
          { say: 'Make B 4 tall. Now every edge matches. <b>Congruent.</b>', act: function (t) { return t.set({ c: 4, say: 'Congruent' }, 2000); } }
        ] },
        example: { mount: G3.view(pairView, { a: 3, b: 1, c: 4, say: '' }), steps: [
          { say: 'My turn. Box A is 3 by 2 by 4. Box B is 3 by 1 by 4.', ms: 1800 },
          { say: 'I check each edge. B is only 1 cube deep, not 2. <b>Not congruent.</b>', act: function (t) { return t.set({ say: 'Not congruent' }, 1800); } },
          { say: 'I make B 2 deep. Now every edge matches. <b>Congruent</b>: same size and same shape.', act: function (t) { return t.set({ b: 2, say: 'Congruent' }, 2200); } }
        ] },
        try: { mount: G3.play({ state: { a: 4, b: 2, c: 3 }, draw: function (s) { return boxPair(s.a, s.b, s.c); },
          sliders: [{ key: 'a', label: 'B long', min: 1, max: 5 }, { key: 'b', label: 'B deep', min: 1, max: 5 }, { key: 'c', label: 'B tall', min: 1, max: 5 }],
          info: function (s) { return congruent(s.a, s.b, s.c) ? '<b>Congruent</b>: the same three lengths.' : 'Not congruent yet.'; },
          tasks: [{ do: 'Make box B exactly like box A: <b>3 long, 2 deep, 4 tall</b>.', goal: function (s) { return s.a === 3 && s.b === 2 && s.c === 4; }, yes: 'Same size, same shape: congruent.' }] }), do: '' },
        key: '<p>Congruent: <b>same size and same shape</b>.</p>',
        check: [TU('s3', 2), SK('sh-congruent', 1)] },

      { id: 'turned', title: 'Turned but still congruent', exp: ['E1.3'], skill: 'sh-congruent', hard: true,
        body: '<p>Turning an object does not change it. A box lying down can be congruent to a box standing up. Check: do they use the <b>same three lengths</b>?</p>',
        watch: { mount: G3.view(pairView, { a: 3, b: 2, c: 4, say: 'The same box' }), steps: [
          { say: 'B matches A: 3 by 2 by 4.', ms: 1500 },
          { say: 'Lay B on its side: 4 long, 2 deep, 3 tall.', act: function (t) { return t.set({ a: 4, c: 3, say: '4 by 2 by 3' }, 1800); } },
          { say: 'It looks different, but it uses 2, 3 and 4. <b>Still congruent.</b>', ms: 2000 }
        ] },
        example: { mount: G3.view(pairView, { a: 2, b: 3, c: 4, say: 'Is B congruent to A?' }), steps: [
          { say: 'My turn. Is box B congruent to box A? B is 2 long, 3 deep and 4 tall.', ms: 1900 },
          { say: 'I list the lengths. A: 3, 2 and 4. B: 2, 3 and 4.', act: function (t) { return t.set({ say: 'A: 3, 2, 4. B: 2, 3, 4.' }, 1900); } },
          { say: 'Same three lengths, in a different order. B is just turned. <b>Congruent.</b>', ms: 2000 },
          { say: 'I turn B to check: 3 long, 2 deep, 4 tall. It matches A.', act: function (t) { return t.set({ a: 3, b: 2, say: 'The same box' }, 2000); } }
        ] },
        ways: [
          { label: 'Sort the numbers', html: '<p>Write each box\'s lengths from smallest to biggest. A: 2, 3, 4. B: 2, 3, 4. Same list, so congruent.</p>' },
          { label: 'Count the cubes', html: '<p>Congruent boxes always use the same number of cubes: 3 &times; 2 &times; 4 = 24. But the same number of cubes is not enough: a 1 by 4 by 6 box also uses 24 and is a different shape.</p>' }
        ],
        try: { mount: G3.play({ state: { a: 1, b: 1, c: 1 }, draw: function (s) { return boxPair(s.a, s.b, s.c); },
          sliders: [{ key: 'a', label: 'B long', min: 1, max: 5 }, { key: 'b', label: 'B deep', min: 1, max: 5 }, { key: 'c', label: 'B tall', min: 1, max: 5 }],
          info: function (s) { return congruent(s.a, s.b, s.c) ? '<b>Congruent</b>.' : 'Not congruent yet.'; },
          tasks: [{ do: 'Make B congruent to A, but <b>turned</b>: B must not be 3 long.', goal: function (s) { return congruent(s.a, s.b, s.c) && s.a !== 3; }, yes: function (s) { return s.a + ' by ' + s.b + ' by ' + s.c + ' is A turned.'; } }] }), do: '' },
        key: '<p>Same three lengths, <b>in any order</b>.</p>',
        mistake: '<p>Thinking objects are different because one is turned. A box lying down can still be congruent to a box standing up.</p>',
        check: [TU('s3', 0), TU('s3', 1), SK('sh-congruent', 2)] }
    ] },

    { id: 'moves', title: 'Giving directions', sub: 'How far, and which way to turn.', concepts: [
      { id: 'turns', title: 'Quarter and half turns', exp: ['E1.4'], skill: 'sh-turn',
        body: '<p>A <b>quarter turn</b> turns you to face the side. A <b>half turn</b> turns you to face the opposite way. Four quarter turns bring you all the way around.</p>',
        watch: { mount: G3.view(compassView, { d: 0, say: 'Facing north' }), steps: [
          { say: 'Facing north.', ms: 1200 },
          { say: 'A quarter turn right: now facing east.', act: function (t) { return t.set({ d: 1, say: 'Quarter turn right: east' }, 1500); } },
          { say: 'A half turn: now facing west, the opposite way.', act: function (t) { return t.set({ d: 3, say: 'Half turn: west' }, 1500); } },
          { say: 'A quarter turn right: back to north. <b>Turns depend on where you face.</b>', act: function (t) { return t.set({ d: 4, say: 'Quarter turn right: north' }, 2000); } }
        ] },
        example: { mount: G3.view(compassView, { d: 1, say: 'Facing east' }), steps: [
          { say: 'My turn. I am facing east.', ms: 1200 },
          { say: 'I make a half turn. Now I face west, the opposite way.', act: function (t) { return t.set({ d: 3, say: 'Half turn: west' }, 1600); } },
          { say: 'I make a quarter turn left. Now I face south.', act: function (t) { return t.set({ d: 2, say: 'Quarter turn left: south' }, 1600); } },
          { say: 'Another quarter turn left: east. A quarter turn goes to the side. A half turn goes the opposite way.', act: function (t) { return t.set({ d: 1, say: 'Quarter turn left: east' }, 2200); } }
        ] },
        try: { mount: G3.play({ state: { d: 0 }, draw: function (s) { return compass(s.d, 'Facing ' + DN[((s.d % 4) + 4) % 4]); },
          buttons: [{ label: 'Quarter turn left', act: function (s) { s.d--; } }, { label: 'Quarter turn right', act: function (s) { s.d++; } }, { label: 'Half turn', act: function (s) { s.d += 2; } }],
          tasks: [{ do: 'Face <b>south</b> using only one turn.', goal: function (s) { return s.d === 2; }, yes: 'One half turn from north faces south.' },
            { do: 'Now face <b>east</b>.', reset: false, goal: function (s) { return ((s.d % 4) + 4) % 4 === 1; }, yes: 'From south, a quarter turn left faces east.' }] }), do: '' },
        key: '<p>Quarter turn: <b>to the side</b>. Half turn: <b>opposite way</b>.</p>',
        check: [TU('s4', 0), TU('s4', 1), TU('s4', 2), SK('sh-turn', 1)] },

      { id: 'map', title: 'Follow directions on a map', exp: ['E1.4'], skill: 'sh-path', hard: true,
        body: '<p>Directions say <b>how far to go</b> and <b>which way to turn</b>. Follow them one step at a time, and keep track of which way you face.</p>',
        watch: { mount: G3.view(mapView, { path: [[0, 0]], dir: 0, say: 'Start at A1, facing north' }), steps: [
          { say: 'Start at A1, facing north.', ms: 1300 },
          { say: 'Forward 3: A2, A3, A4.', act: function (t) { return t.seq([{ path: [[0, 0], [0, 1]] }, { path: [[0, 0], [0, 1], [0, 2]] }, { path: [[0, 0], [0, 1], [0, 2], [0, 3]], say: 'At A4' }], 600); } },
          { say: 'Quarter turn right: now facing east.', act: function (t) { return t.set({ dir: 1, say: 'Facing east' }, 1300); } },
          { say: 'Forward 2. You are at <b>C4</b>.', act: function (t) { return t.seq([{ path: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]] }, { path: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3]], say: 'At C4' }], 600); } }
        ] },
        example: { mount: G3.view(mapView, { path: [[1, 0]], dir: 1, say: 'Start at B1, facing east' }), steps: [
          { say: 'My turn. I start at B1, facing east.', ms: 1300 },
          { say: 'Forward 2: C1, D1.', act: function (t) { return t.seq([{ path: [[1, 0], [2, 0]] }, { path: [[1, 0], [2, 0], [3, 0]], say: 'At D1' }], 600); } },
          { say: 'A quarter turn left: now I face north.', act: function (t) { return t.set({ dir: 0, say: 'Facing north' }, 1300); } },
          { say: 'Forward 3: D2, D3, D4. I am at <b>D4</b>.', act: function (t) { return t.seq([{ path: [[1, 0], [2, 0], [3, 0], [3, 1]] }, { path: [[1, 0], [2, 0], [3, 0], [3, 1], [3, 2]] }, { path: [[1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3]], say: 'At D4' }], 600); } }
        ] },
        ways: [
          { label: 'Turn the map', html: '<p>Turn the page so the arrow points up before each turn. Then left and right are easy to see.</p>' },
          { label: 'Use compass words', html: '<p>North is up, east is right, south is down, west is left. "Go 2 east" works whichever way you face.</p>' }
        ],
        try: { mount: G3.play({ state: { pos: [0, 0], dir: 0, path: [[0, 0]], log: [], note: '' }, draw: function (s) { return map(s.path, s.dir); },
          buttons: [{ label: 'Forward 1', act: function (s) { walkStep(s, 'f'); } }, { label: 'Quarter turn left', act: function (s) { walkStep(s, 'l'); } }, { label: 'Quarter turn right', act: function (s) { walkStep(s, 'r'); } }, { label: 'Start over', act: function (s) { s.pos = [0, 0]; s.dir = 0; s.path = [[0, 0]]; s.log = []; s.note = ''; } }],
          info: function (s) { return (s.note ? s.note + ' ' : '') + 'At <b>' + COLS[s.pos[0]] + (s.pos[1] + 1) + '</b>, facing ' + DN[s.dir] + '.'; },
          tasks: [{ do: 'Walk from A1 to the <b>Library at E6</b>.', goal: function (s) { return s.pos[0] === 4 && s.pos[1] === 5; }, yes: function (s) { return 'Your directions: ' + s.log.join(', ') + '.'; } }] }), do: '' },
        key: '<p>One step at a time. <b>Keep track of where you face.</b></p>',
        mistake: '<p>Turning right as if still facing north after an earlier turn. Have the child turn their own body, or the page, at each turn.</p>',
        check: [SK('sh-path', 1), SK('sh-path', 2)] }
    ] }
  ];

  A.register('shapes', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Faces, edges and vertices</h2>' +
'<p>A <b>3D object</b> has length, width and height. A <b>face</b> is a flat surface. An <b>edge</b> is where two faces meet. A <b>vertex</b> is a corner where edges meet. More than one vertex are called <b>vertices</b>. Dashed lines show edges hidden at the back.</p>' +
'<div class="lab"><span class="lt">Try it: explore an object</span>' +
'<div class="ctrl"><label for="sok">Object<select id="sok">' + ORDER.map(function (k) { return '<option value="' + k + '">' + S[k].name + '</option>'; }).join('') + '</select></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-hl="f" aria-pressed="false">Show faces</button><button type="button" class="btn alt" data-hl="e" aria-pressed="false">Show edges</button><button type="button" class="btn alt" data-hl="v" aria-pressed="false">Show vertices</button></div>' +
'<div class="fig" id="sofig"></div><div class="out" id="soout" aria-live="polite"></div></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Object</th><th>Faces</th><th>Edges</th><th>Vertices</th></tr></thead><tbody>' +
POLY.map(function (k) { return '<tr><td class="l">' + S[k].name + '</td><td>' + S[k].f + '</td><td>' + S[k].e + '</td><td>' + S[k].v + '</td></tr>'; }).join('') + '</tbody></table></div>' +
'<p>Curved objects: a <b>cylinder</b> has ' + S.cyl.words + '. A <b>cone</b> has ' + S.cone.words + '.</p>' +
'<div class="key"><b class="t">Key idea</b><p>A <b>prism</b> has two matching ends joined by rectangles. A <b>pyramid</b> has one base, and triangles that meet at a point. The base gives the object its name.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Count the vertices of a triangular prism. Each triangle end has 3 corners. There are 2 ends. 3 + 3 = <b>6 vertices</b>.</p><div class="fig">' + solid('tprism', 'v') + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Shapes inside structures</h2>' +
'<p>Buildings and toys are made of 3D objects put together. A house can be a cube with a triangular prism on top. You can also take a structure apart to see the objects it is made of.</p>' +
'<div class="lab"><span class="lt">Try it: build a structure</span>' +
'<div class="ctrl"><label for="stb">Structure<select id="stb"><option value="house">house</option><option value="barn">barn</option><option value="tower">tower</option><option value="silo">silo</option></select></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="stsplit" aria-pressed="false">Take it apart</button></div>' +
'<div class="fig" id="stfig"></div><div class="out" id="stout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Look for flat 2D shapes too. The front of a house might show a square and a triangle.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A grain silo is a <b>cylinder</b> with a <b>cone</b> on top. From the front you see a rectangle and a triangle.</p></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Congruent objects</h2>' +
'<p>Two objects are <b>congruent</b> if they are exactly the same size and shape. You could turn one so it fits perfectly on the other. Their matching faces, edges and angles are all the same.</p>' +
'<div class="lab"><span class="lt">Try it: match two boxes</span>' +
'<p class="t2" style="margin:.2em 0">Box A is 3 cubes long, 2 cubes deep and 4 cubes tall. Change box B.</p>' +
'<div class="ctrl"><label for="cga">B long: <output id="cgao"></output><input type="range" id="cga" min="1" max="5" value="4"></label><label for="cgb">B deep: <output id="cgbo"></output><input type="range" id="cgb" min="1" max="5" value="2"></label><label for="cgc">B tall: <output id="cgco"></output><input type="range" id="cgc" min="1" max="5" value="3"></label></div>' +
'<div class="fig" id="cgfig"></div><div class="out" id="cgout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking objects are different because one is turned. A box lying down can still be congruent to a box standing up.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Box A is 2 by 3 by 5 cubes. Box B is 5 by 2 by 3 cubes. They use the same three numbers, so B is A turned. They are <b>congruent</b>.</p></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Giving directions</h2>' +
'<p>Directions tell someone how to move. Say how far to go and which way to turn. A <b>quarter turn</b> turns you to face the side. A <b>half turn</b> turns you to face the opposite way. Four quarter turns bring you all the way around.</p>' +
'<div class="lab"><span class="lt">Try it: walk on the map</span>' +
'<div class="btnrow"><button type="button" class="btn" id="mvf">Forward 1</button><button type="button" class="btn alt" id="mvl">Quarter turn left</button><button type="button" class="btn alt" id="mvr">Quarter turn right</button><button type="button" class="btn alt" id="mvh">Half turn</button><button type="button" class="btn alt" id="mv0">Start over</button></div>' +
'<div class="fig" id="mvfig"></div><div class="out" id="mvout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Turns depend on which way you are facing. A quarter turn right from north faces east. A quarter turn right from east faces south.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Start at A1, facing north. Go forward 3 to A4. Make a quarter turn right, so you face east. Go forward 2. You are at <b>C4</b>.</p><div class="fig">' + map([[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3]], 1, 'Path from A1 north to A4, then east to C4') + '</div></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'How many faces does a cube have?', fig: solid('cube', 'f', 40, 200), options: ['4', '6', '8'], answer: 1, why: 'Count the flat surfaces: top, bottom, front, back, left, right.' },
        { q: 'Which object has a curved surface and no point?', options: ['cone', 'cylinder', 'pyramid'], answer: 1, why: 'A cylinder has 2 flat circles and 1 curved surface. A cone has a point at the top.' },
        { q: 'A pyramid has a square base. How many triangle faces does it have?', options: ['3', '4', '5'], answer: 1, why: 'One triangle goes up from each side of the square. A square has 4 sides.' }
      ],
      s2: [
        { q: 'An ice cream cone with one scoop is like:', options: ['a cone and a sphere', 'a cylinder and a cube', 'two cones'], answer: 0, why: 'The cone holds the ice cream. The scoop is round like a ball, which is a sphere.' },
        { q: 'A tent is shaped like a:', options: ['cube', 'triangular prism', 'cylinder'], answer: 1, why: 'A tent has triangle ends joined by rectangle sides.' },
        { q: 'A can of soup is a:', options: ['cylinder', 'cone', 'rectangular prism'], answer: 0, why: 'It has two circle faces and a curved side.' }
      ],
      s3: [
        { q: 'Box A is 1 by 2 by 3 cubes. Box B is 3 by 1 by 2 cubes. Are they congruent?', options: ['Yes', 'No'], answer: 0, why: 'They use the same three numbers. B is A turned.' },
        { q: 'Box A is 2 by 2 by 4 cubes. Box B is 2 by 2 by 3 cubes. Are they congruent?', options: ['Yes', 'No'], answer: 1, why: 'One edge is 4 cubes long and the other is 3. They are not the same size.' },
        { q: 'Two cubes are congruent when:', options: ['their edges are the same length', 'they are the same colour', 'they are in the same place'], answer: 0, why: 'Congruent is about size and shape, not colour or place.' }
      ],
      s4: [
        { q: 'You face north. You make a quarter turn right. Which way do you face?', options: ['east', 'west', 'south'], answer: 0, why: 'Right from north is east.' },
        { q: 'You face east. You make a half turn. Which way do you face?', options: ['west', 'north', 'south'], answer: 0, why: 'A half turn faces the opposite way.' },
        { q: 'How many quarter turns make a full turn?', options: ['2', '4', '6'], answer: 1, why: 'Each quarter turn is one side. 4 sides bring you back around.' }
      ]
    },

    init: function (root) {
      var $ = A.$, hl = '';
      function so() {
        var k = $('#sok', root).value, d = S[k];
        $('#sofig', root).innerHTML = solid(k, hl);
        root.querySelectorAll('[data-hl]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-hl') === hl)); });
        $('#soout', root).innerHTML = '<p><span class="big">' + d.name.charAt(0).toUpperCase() + d.name.slice(1) + '</span></p><p>' + facts(k) + '.' + (d.round ? ' The curved surface is not a flat face.' : '') + '</p>';
      }
      root.querySelectorAll('[data-hl]').forEach(function (b) { b.addEventListener('click', function () { var h = b.getAttribute('data-hl'); hl = hl === h ? '' : h; so(); }); });
      A.bind(root, ['sok'], so);
      var split = false;
      function st() {
        var k = $('#stb', root).value, c = ST[k], b = c[0], t = c[1];
        $('#stfig', root).innerHTML = structFig(k, split);
        $('#stsplit', root).textContent = split ? 'Put it together' : 'Take it apart';
        $('#stsplit', root).setAttribute('aria-pressed', split ? 'true' : 'false');
        $('#stout', root).innerHTML = '<p>This ' + k + ' is a <b>' + S[b].name + '</b> with a <b>' + S[t].name + '</b> on top.</p><p>' + c[2] + ' Take it apart and you have <b>2 objects</b>.</p>';
      }
      $('#stsplit', root).addEventListener('click', function () { split = !split; st(); });
      A.bind(root, ['stb'], st);
      function cg() {
        var a = +$('#cga', root).value, b = +$('#cgb', root).value, c = +$('#cgc', root).value, u = 18;
        $('#cgao', root).textContent = a; $('#cgbo', root).textContent = b; $('#cgco', root).textContent = c;
        var s = box(3, 2, 4, 20, 150, 2, u) + '<text x="60" y="180" text-anchor="middle" font-size="18" class="tb">A: 3 by 2 by 4</text>' + box(a, b, c, 230, 150, 3, u) + '<text x="' + (230 + a * u / 2 + 10) + '" y="180" text-anchor="middle" font-size="18" class="tb">B: ' + a + ' by ' + b + ' by ' + c + '</text>';
        $('#cgfig', root).innerHTML = A.svg(440, 190, s, 'Box A is 3 by 2 by 4 cubes. Box B is ' + a + ' by ' + b + ' by ' + c + ' cubes.');
        var sa = [2, 3, 4], sb = [a, b, c].sort(function (x, y) { return x - y; }), same = sa.join() === sb.join();
        $('#cgout', root).innerHTML = '<p><span class="big">' + (same ? 'Congruent' : 'Not congruent') + '</span></p><p>A uses 2, 3 and 4. B uses ' + sb.join(', ') + '. ' + (same ? 'Same three lengths, so B is A turned around.' : 'The lengths do not all match, so B is a different size or shape.') + ' A has ' + 24 + ' cubes. B has ' + a * b * c + '.</p>';
      }
      A.bind(root, ['cga', 'cgb', 'cgc'], cg);
      var pos, dir, path, log;
      function reset() { pos = [0, 0]; dir = 0; path = [[0, 0]]; log = []; mv(); }
      function mv(msg) {
        $('#mvfig', root).innerHTML = map(path, dir, 'Map. You are at ' + COLS[pos[0]] + (pos[1] + 1) + ', facing ' + DN[dir] + '.');
        $('#mvout', root).innerHTML = '<p><span class="big">At ' + COLS[pos[0]] + (pos[1] + 1) + ', facing ' + DIRS[dir] + '</span></p>' + (msg ? '<p>' + msg + '</p>' : '') +
          '<p class="t2">Your directions: ' + (log.length ? log.join(', ') : 'none yet') + '. Try to reach the Library at E6.</p>';
      }
      $('#mvf', root).addEventListener('click', function () {
        var d = [[0, 1], [1, 0], [0, -1], [-1, 0]][dir], nx = pos[0] + d[0], ny = pos[1] + d[1];
        if (nx < 0 || nx > 5 || ny < 0 || ny > 5) { mv('That would go off the map. Turn first.'); return; }
        pos = [nx, ny]; path.push(pos.slice()); log.push('forward 1');
        mv(pos[0] === 4 && pos[1] === 5 ? 'You reached the Library.' : '');
      });
      $('#mvl', root).addEventListener('click', function () { dir = (dir + 3) % 4; log.push('quarter turn left'); mv(); });
      $('#mvr', root).addEventListener('click', function () { dir = (dir + 1) % 4; log.push('quarter turn right'); mv(); });
      $('#mvh', root).addEventListener('click', function () { dir = (dir + 2) % 4; log.push('half turn'); mv(); });
      $('#mv0', root).addEventListener('click', reset);
      reset();
    },

    quiz: [
      { q: 'How many edges does this rectangular prism have?', type: 'num', answer: 12, fig: solid('rprism', 'e'),
        hint: 'Count 4 edges around the top, 4 around the bottom, and 4 going up.', explain: '4 + 4 + 4 = 12 edges.' },
      { q: 'I have 5 faces: 1 square and 4 triangles. What am I?', type: 'mc', options: ['cube', 'square-based pyramid', 'triangular prism', 'cone'], answer: 1,
        hint: 'Triangles meeting at a point make a pyramid.', explain: 'A square-based pyramid has a square base and 4 triangle faces.' },
      { q: 'How many flat faces does a cone have?', type: 'num', answer: 1,
        hint: 'Look for the flat circle at the bottom.', explain: 'A cone has 1 flat face: the circle at the bottom. The rest is a curved surface.' },
      { q: 'Box A is 2 by 3 by 4 cubes. Which box is congruent to A?', type: 'mc', options: ['4 by 2 by 3', '2 by 3 by 3', '2 by 4 by 5', '3 by 3 by 4'], answer: 0,
        hint: 'Look for the box that uses the numbers 2, 3 and 4.', explain: '4 by 2 by 3 uses the same lengths, so it is A turned.' },
      { q: 'You face south. You make a quarter turn left. Which way do you face now?', type: 'mc', options: ['east', 'west', 'north', 'south'], answer: 0,
        hint: 'Picture yourself facing south. Your left hand points which way?', explain: 'Facing south, your left is east.' },
      { q: 'Start at B2 facing north. Go forward 3. Make a quarter turn right. Go forward 2. Where are you?', type: 'mc', options: ['D5', 'B5', 'D2', 'C5'], answer: 0, fig: map([[1, 1]], 0, 'Map grid with a start at B2 facing north'),
        hint: 'Forward 3 from B2 going north takes you to B5. Then face east.', explain: 'B2 to B5, then east 2 squares to D5.' },
      { q: 'A house shape is made of a cube and a triangular prism. How many objects are in it?', type: 'num', answer: 2,
        hint: 'Count the 3D objects, not the faces.', explain: 'There are 2 objects: a cube and a triangular prism.' }
    ],

    practice: [
      { id: 'sh-count', name: 'Faces, edges, vertices', code: 'E1.1', gen: function (lv) {
        var k = lv === 1 ? R.pick(['cube', 'rprism']) : R.pick(ORDER), d = S[k], part = lv === 1 ? R.pick(['f', 'v']) : d.round ? 'f' : R.pick(['f', 'e', 'v']);
        var nm = { f: 'flat faces', e: 'edges', v: 'vertices' }[part], ans = d[part];
        return { q: 'How many <b>' + nm + '</b> does a ' + d.name + ' have?', type: 'num', answer: ans, fig: lv < 3 ? solid(k, part, 40, 210, 'A ' + d.name) : '',
          hint: part === 'f' ? 'Count the flat surfaces, even the ones you cannot see.' : part === 'e' ? 'Count where two faces meet. Remember the dashed edges at the back.' : 'Count the corners, front and back.',
          steps: ['A ' + d.name + ' has ' + d.faces + '.', 'Count carefully, including the hidden back.<div class="fig">' + solid(k, part, 40, 210) + '</div>', 'It has ' + G3.pl(ans, { f: 'flat face', e: 'edge', v: 'vertex' }[part], nm) + '.'],
          explain: 'A ' + d.name + ' has ' + facts(k) + '.', meta: { k: 'solid-count', name: d.name, part: part } };
      } },
      { id: 'sh-name', name: 'Name the object', code: 'E1.1', gen: function (lv) {
        var k = R.pick(ORDER), d = S[k], clue = lv === 1 ? 'I have ' + d.faces + '.' : lv === 2 || d.round ? 'I have ' + facts(k) + '.' : 'I have ' + G3.pl(d.v, 'vertex', 'vertices') + ' and ' + G3.pl(d.e, 'edge') + '.';
        var others = ORDER.filter(function (x) { return x !== k; });
        if (lv === 3) others = others.filter(function (x) { return !(S[x].v === d.v && S[x].e === d.e); });
        if (lv === 2) others = others.filter(function (x) { return !(S[x].v === d.v && S[x].e === d.e && S[x].f === d.f); });
        var o = R.mc(d.name, R.shuffle(others).map(function (x) { return S[x].name; }));
        return { q: clue + ' What am I?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Use the table of faces, edges and vertices.', steps: ['Check each object against the clue.', 'Only one object matches: a ' + d.name + '.<div class="fig">' + solid(k, '', 40, 210) + '</div>', 'A ' + d.name + ' has ' + facts(k) + '.'],
          explain: 'It is a ' + d.name + '.' };
      } },
      { id: 'sh-congruent', name: 'Congruent boxes', code: 'E1.3', gen: function (lv) {
        var a = [R.int(1, 4), R.int(1, 4), R.int(2, 5)], same = R.int(0, 1), b;
        if (same) b = R.shuffle(a); else { b = R.shuffle(a); var i = R.int(0, 2); b[i] = b[i] + (b[i] > 1 && R.int(0, 1) ? -1 : 1); }
        var sa = a.slice().sort().join(), sb = b.slice().sort().join(), ans = sa === sb ? 'Yes' : 'No';
        return { q: 'Box A is ' + a.join(' by ') + ' cubes. Box B is ' + b.join(' by ') + ' cubes. Are they congruent?', type: 'mc', options: ['Yes', 'No'], answer: ans === 'Yes' ? 0 : 1,
          fig: lv === 1 ? A.svg(440, 190, box(a[0], a[1], a[2], 20, 160, 2, 18) + box(b[0], b[1], b[2], 240, 160, 3, 18), 'Box A and box B') : '',
          hint: 'Put each box\'s three numbers in order from smallest to largest. Do they match?',
          steps: ['A in order: ' + a.slice().sort(function (x, y) { return x - y; }).join(', ') + '.', 'B in order: ' + b.slice().sort(function (x, y) { return x - y; }).join(', ') + '.', ans === 'Yes' ? 'They match, so B is A turned. Congruent.' : 'They do not match, so they are not congruent.'],
          explain: ans === 'Yes' ? 'Same lengths: congruent.' : 'Different lengths: not congruent.' };
      } },
      { id: 'sh-turn', name: 'Quarter and half turns', code: 'E1.4', gen: function (lv) {
        var d = R.int(0, 3), moves = lv === 1 ? [R.pick(['quarter turn right', 'quarter turn left'])] : lv === 2 ? [R.pick(['half turn', 'quarter turn right', 'quarter turn left']), R.pick(['quarter turn right', 'quarter turn left'])] : [R.pick(['half turn', 'quarter turn right']), R.pick(['quarter turn left', 'quarter turn right']), R.pick(['half turn', 'quarter turn left'])];
        var cur = d, trail = [];
        moves.forEach(function (m) { cur = (cur + (m === 'half turn' ? 2 : m === 'quarter turn right' ? 1 : 3)) % 4; trail.push(m + ' &rarr; ' + DN[cur]); });
        var o = R.mc(DN[cur], DN.filter(function (x) { return x !== DN[cur]; }));
        return { q: 'You face ' + DN[d] + '. You make ' + moves.join(', then ') + '. Which way do you face?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Do one turn at a time. Going clockwise: north, east, south, west.',
          steps: ['Start facing ' + DN[d] + '.', trail.join('. ') + '.', 'You face ' + DN[cur] + '.'],
          explain: 'You end up facing ' + DN[cur] + '.' };
      } },
      { id: 'sh-path', name: 'Follow directions on a map', code: 'E1.4', gen: function (lv) {
        var x, y, d = 0, steps = [], k, ok = false, path;
        while (!ok) {
          x = R.int(0, 2); y = R.int(0, 2); d = lv === 3 ? R.int(0, 3) : 0; path = [[x, y]]; steps = []; ok = true;
          var n = lv === 1 ? 1 : 2, cx = x, cy = y, cd = d;
          for (k = 0; k < n + 1 && ok; k++) {
            if (k) { var t = R.pick(['right', 'left']); cd = (cd + (t === 'right' ? 1 : 3)) % 4; steps.push('make a quarter turn ' + t); }
            var f = R.int(1, 3), dv = [[0, 1], [1, 0], [0, -1], [-1, 0]][cd];
            cx += dv[0] * f; cy += dv[1] * f; steps.push('go forward ' + f);
            if (cx < 0 || cx > 5 || cy < 0 || cy > 5) ok = false;
          }
        }
        var ans = COLS[cx] + (cy + 1), wrong = [COLS[Math.min(5, cx + 1)] + (cy + 1), COLS[cx] + Math.min(6, cy + 2), COLS[Math.max(0, cx - 1)] + Math.max(1, cy), COLS[cy % 6] + (cx + 1)];
        var o = R.mc(ans, wrong.filter(function (w) { return w !== ans; }));
        return { q: 'Start at ' + COLS[x] + (y + 1) + ' facing ' + DN[d] + '. ' + steps.map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); }).join('. ') + '. Where are you?', type: 'mc', options: o.options, answer: o.answer,
          fig: map([[x, y]], d, 'Map grid with a start at ' + COLS[x] + (y + 1)),
          hint: 'North is up (higher row numbers). East is right (later letters). Do one step at a time.',
          steps: ['Start at ' + COLS[x] + (y + 1) + ', facing ' + DN[d] + '.', 'Follow each direction in order: ' + steps.join(', ') + '.', 'You end at ' + ans + '.'],
          explain: 'You end at ' + ans + '.' };
      } }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ----------
     Each practice skill keeps its first way of asking ("plain") and adds new shapes.
     Shapes unlock with the level, so level 1 stays gentle. q.meta is read by the automatic answer checks. */
  var Q = A.Q;
  if (Q) (function () {
    var nm = Q.name, PART = { f: 'flat faces', e: 'edges', v: 'vertices' };
    function why(right, wrong) { var o = R.mc(right, wrong); return { options: o.options, answer: o.answer }; }
    function small(k) { return solid(k, '', 30, 200, 'A ' + S[k].name); }
    /* solids that each have a different count of the chosen part */
    function distinctBy(part, n) {
      var seen = {}, out = [];
      R.shuffle(part === 'f' ? ORDER : POLY).forEach(function (k) { if (out.length < n && !seen[S[k][part]]) { seen[S[k][part]] = 1; out.push(k); } });
      return out;
    }
    var EVERYDAY = [['a soup can', 'cyl'], ['a number cube', 'cube'], ['a cereal box', 'rprism'], ['an ice cream cone', 'cone'], ['a tent', 'tprism'], ['a pyramid in Egypt', 'spyr']];
    var CRIT = [['has a curved surface', function (k) { return !!S[k].round; }], ['has at least one triangle face', function (k) { return /triangle/.test(S[k].faces); }], ['has exactly 6 flat faces', function (k) { return S[k].f === 6; }], ['has exactly 5 flat faces', function (k) { return S[k].f === 5; }]];
    function dims(d) { return d.join(' by '); }
    function sameBox(a, b) { return a.slice().sort().join() === b.slice().sort().join(); }
    function boxFig(d) { return A.svg(230, 190, box(d[0], d[1], d[2], 20, 170, 2, 18), dims(d) + ' box'); }
    var TURN = { 'quarter turn right': 1, 'half turn': 2, 'quarter turn left': 3 };
    /* a compass you can tap: each direction is a hit area */
    function compassPic() {
      var s = '<circle cx="130" cy="130" r="70" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
      DN.forEach(function (d, i) {
        var a = -Math.PI / 2 + i * Math.PI / 2, x = 130 + 96 * Math.cos(a), y = 130 + 96 * Math.sin(a);
        s += '<g data-hit="' + d + '" style="cursor:pointer"><circle cx="' + x + '" cy="' + y + '" r="30" style="fill:color-mix(in srgb,var(--strand) 12%,var(--card));stroke:var(--strand)" stroke-width="2"/><text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" font-size="18" class="tb">' + d.charAt(0).toUpperCase() + d.slice(1) + '</text></g>';
      });
      return A.svg(260, 260, s, 'Compass. Tap north, east, south or west.');
    }
    /* the map, with every square tappable */
    function tapMap(start, dir) {
      var sz = 62, hits = '';
      for (var c = 0; c < 6; c++) for (var r = 0; r < 6; r++) hits += '<rect data-hit="' + COLS[c] + (r + 1) + '" x="' + (36 + c * sz) + '" y="' + (12 + (5 - r) * sz) + '" width="' + sz + '" height="' + sz + '" fill="transparent" style="cursor:pointer"/>';
      return map([start], dir, 'Map grid. Tap the square where you end.').replace(/<\/svg>$/, hits + '</svg>');
    }
    /* walk a list like ['forward 2', 'right', 'forward 1'] from x, y facing d */
    function walk(x, y, d, acts) {
      acts.forEach(function (a) { if (a === 'right') d = (d + 1) % 4; else if (a === 'left') d = (d + 3) % 4; else { var f = +a.split(' ')[1], v = [[0, 1], [1, 0], [0, -1], [-1, 0]][d]; x += v[0] * f; y += v[1] * f; } });
      return [x, y, d];
    }
    function route(lv) {
      for (;;) {
        var x = R.int(0, 3), y = R.int(0, 3), acts = ['forward ' + R.int(1, 3)];
        if (lv > 1 || R.int(0, 1)) acts.push(R.pick(['right', 'left']), 'forward ' + R.int(1, 2));
        var e = walk(x, y, 0, acts);
        if (e[0] >= 0 && e[0] <= 5 && e[1] >= 0 && e[1] <= 5) return { x: x, y: y, acts: acts, end: e };
      }
    }
    function actText(acts) { return acts.map(function (a) { return a === 'right' || a === 'left' ? 'make a quarter turn ' + a : 'go ' + a; }).join(', then '); }
    function cell(x, y) { return COLS[x] + (y + 1); }

    var SHAPES = {
      'sh-count': [
        [1, 'match', function (lv) {
          var part = lv === 1 ? 'f' : R.pick(['f', 'e', 'v']), ks = distinctBy(part, 3);
          var pairs = ks.map(function (k) { return [S[k].name, String(S[k][part])]; });
          return { q: 'Match each object to its number of <b>' + PART[part] + '</b>.', type: 'match', pairs: pairs,
            hint: 'Picture each object. Count the hidden back too.', steps: pairs.map(function (p) { return 'A ' + p[0] + ' has ' + p[1] + ' ' + PART[part] + '.'; }),
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'solid-match', part: part } };
        }],
        [1, 'tap', function (lv) {
          var part = lv === 1 ? 'f' : R.pick(['f', 'v']), set = distinctBy(part, 3), k = R.pick(set);
          return { q: 'Tap the object with <b>' + S[k][part] + ' ' + PART[part] + '</b>.', type: 'tap', tiles: set.map(small), answer: set.indexOf(k), answerText: 'the ' + S[k].name,
            hint: 'Count the ' + PART[part] + ' on each object, front and back.', steps: ['A ' + S[k].name + ' has ' + S[k][part] + ' ' + PART[part] + '.'],
            explain: 'The ' + S[k].name + ' has ' + S[k][part] + ' ' + PART[part] + '.', meta: { k: 'solid-tap', part: part, n: S[k][part], set: set.map(function (x) { return S[x].name; }) } };
        }],
        [1, 'fill', function (lv) {
          var k = lv === 1 ? R.pick(['cube', 'rprism']) : R.pick(ORDER.slice(0, 5));
          return { q: 'Look at the ' + S[k].name + '. Fill in the blanks.', type: 'fill', fig: small(k), fill: 'A ' + S[k].name + ' has [[]] flat faces, [[]] edges and [[]] vertices.', answers: [S[k].f, S[k].e, S[k].v],
            hint: 'Dashed lines show the edges at the back.', steps: ['Faces: ' + S[k].faces + '.', 'Edges are where two faces meet. Vertices are the corners.'],
            explain: 'A ' + S[k].name + ' has ' + S[k].f + ' flat faces, ' + S[k].e + ' edges and ' + S[k].v + ' vertices.', meta: { k: 'solid-fill', name: S[k].name } };
        }],
        [2, 'mistake', function (lv) {
          var k = R.pick(['cube', 'rprism', 'tprism']), who = nm(), truth = !R.int(0, 2), said = truth ? S[k].f : S[k].vis.length;
          var right = 'Some faces are hidden at the back. A ' + S[k].name + ' has ' + S[k].f + ' flat faces.';
          return { q: who + ' looks at this ' + S[k].name + ' and says it has <b>' + said + '</b> flat faces. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: small(k),
            why: why(right, ['Only the faces you can see count.', 'Count the corners to find the faces.', 'Every object has 6 faces.']),
            hint: 'Do not forget the faces at the back and the bottom.', steps: [right], explain: right, meta: { k: 'solid-tf', name: S[k].name, part: 'f', said: said } };
        }]
      ],
      'sh-name': [
        [1, 'tap', function (lv) {
          var set = R.shuffle(ORDER).slice(0, 3), k = R.pick(set);
          return { q: 'Tap the <b>' + S[k].name + '</b>.', type: 'tap', tiles: set.map(small), answer: set.indexOf(k), answerText: 'the ' + S[k].name,
            hint: 'A ' + S[k].name + ' has ' + S[k].faces + '.', steps: ['Look for ' + S[k].faces + '.'],
            explain: 'This is the ' + S[k].name + '.', meta: { k: 'name-tap', name: S[k].name, set: set.map(function (x) { return S[x].name; }) } };
        }],
        [1, 'match', function (lv) {
          var list = R.shuffle(EVERYDAY).slice(0, 3), pairs = list.map(function (e) { return [e[0], S[e[1]].name]; });
          return { q: 'Match each everyday object to its 3D shape.', type: 'match', pairs: pairs,
            hint: 'Think about the faces. Is any part curved? Is there a point?', steps: pairs.map(function (p) { return p[0].charAt(0).toUpperCase() + p[0].slice(1) + ' is shaped like a ' + p[1] + '.'; }),
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'name-match' } };
        }],
        [1, 'pick', function (lv) {
          var c, opts, ans;
          do { c = R.pick(CRIT); opts = R.shuffle(ORDER).slice(0, 5); ans = []; opts.forEach(function (k, j) { if (c[1](k)) ans.push(j); }); } while (!ans.length || ans.length === opts.length);
          return { q: 'Pick every object that <b>' + c[0] + '</b>.', type: 'pick', options: opts.map(function (k) { return S[k].name; }), answer: ans,
            hint: 'Picture each object, one at a time.', steps: opts.map(function (k) { return 'A ' + S[k].name + ' has ' + S[k].faces + '.'; }),
            explain: ans.map(function (j) { return S[opts[j]].name; }).join(' and ') + ' ' + (ans.length > 1 ? 'fit' : 'fits') + '.', meta: { k: 'name-pick', c: c[0] } };
        }],
        [2, 'mistake', function (lv) {
          var k = R.pick(ORDER.slice(0, 5)), who = nm(), others = POLY.filter(function (x) { return x !== k && S[x].v !== S[k].v; }), truth = !R.int(0, 2), sk = truth ? k : R.pick(others);
          var right = 'A ' + S[k].name + ' has ' + S[k].v + ' vertices and ' + S[k].e + ' edges.';
          return { q: 'An object has <b>' + S[k].v + ' vertices</b> and <b>' + S[k].e + ' edges</b>. ' + who + ' says it is a <b>' + S[sk].name + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Any object with a point is a pyramid.', 'Edges and vertices are the same thing.', 'Every object with flat faces is a cube.']),
            hint: 'How many vertices does a ' + S[sk].name + ' have?', steps: [right], explain: right, meta: { k: 'name-tf', v: S[k].v, e: S[k].e, said: S[sk].name } };
        }]
      ],
      'sh-congruent': [
        [1, 'pick', function (lv) {
          var a = R.shuffle([R.int(1, 2), R.int(3, 4), R.int(5, 6)]), opts = [], seen = {};
          while (opts.length < 4) {
            var good = opts.length < 2, b = R.shuffle(a);
            if (!good) { var i = R.int(0, 2); b[i] += R.pick([1, -1]); if (b[i] < 1) b[i] = 2; }
            if (seen[b.join()] || (!good && sameBox(a, b))) continue; seen[b.join()] = 1; opts.push(b);
          }
          opts = R.shuffle(opts);
          var ans = []; opts.forEach(function (b, j) { if (sameBox(a, b)) ans.push(j); });
          return { q: 'Box A is <b>' + dims(a) + '</b> cubes. Pick every box that is congruent to it.', type: 'pick', options: opts.map(dims), answer: ans,
            hint: 'Congruent boxes have the same three lengths, in any order.', steps: ['Sort each box\'s lengths from smallest to largest. Compare with ' + a.slice().sort().join(', ') + '.'],
            explain: ans.map(function (j) { return dims(opts[j]); }).join(' and ') + ' are box A turned.', meta: { k: 'cong-pick', a: a } };
        }],
        [1, 'tap', function (lv) {
          var a = [R.int(1, 2), R.int(2, 3), R.int(3, 4)], good = R.shuffle(a), b1 = a.slice(), b2 = a.slice();
          b1[0] += 1; b2[2] += 1;
          if (sameBox(good, a) && good.join() === a.join()) good = [a[2], a[0], a[1]];
          var set = R.shuffle([good, b1, b2]);
          return { q: 'Box A is <b>' + dims(a) + '</b> cubes. Tap the box that is congruent to box A.', type: 'tap', fig: boxFig(a), tiles: set.map(boxFig), answer: set.indexOf(good), answerText: 'the ' + dims(good) + ' box',
            hint: 'Count the cubes along each edge of each box.', steps: ['Box A has edges of ' + a.join(', ') + ' cubes.', 'The ' + dims(good) + ' box has the same lengths, turned.'],
            explain: 'The ' + dims(good) + ' box is box A turned.', meta: { k: 'cong-tap', a: a, set: set } };
        }],
        [1, 'match', function (lv) {
          var pairs = [], seen = {};
          while (pairs.length < 3) {
            var a = [R.int(1, 3), R.int(2, 4), R.int(2, 5)], key = a.slice().sort().join();
            if (seen[key]) continue; seen[key] = 1;
            var b; do { b = R.shuffle(a); } while (b.join() === a.join() && new Set(a).size > 1);
            pairs.push([dims(a), dims(b)]);
          }
          return { q: 'Match each box to the box that is congruent to it.', type: 'match', pairs: pairs,
            hint: 'Look for the same three numbers in a different order.', steps: ['Sort the three lengths of each box, then match.'],
            explain: pairs.map(function (p) { return p[0] + ' and ' + p[1]; }).join('. ') + '.', meta: { k: 'cong-match' } };
        }],
        [2, 'mistake', function (lv) {
          var a = [R.int(1, 3), R.int(2, 4), R.int(3, 5)], turned = R.int(0, 2) > 0, b = turned ? [a[2], a[0], a[1]] : [a[2] + 1, a[0], a[1]], who = nm();
          var right = turned ? 'Box B has the same lengths, ' + a.slice().sort().join(', ') + ', just turned. Turning does not change the size or shape, so they are congruent.' : 'Box B has a length of ' + (a[2] + 1) + ', and box A does not. They are not congruent.';
          return { q: 'Box A is ' + dims(a) + '. Box B is ' + dims(b) + '. ' + who + ' says they are <b>not</b> congruent. True or false: ' + who + ' is right.', type: 'tf', answer: !turned,
            why: why(right, ['Turning a box changes its shape.', 'Congruent boxes must face the same way.', 'Only cubes can be congruent.']),
            hint: 'Does turning change the size of a box?', steps: [right], explain: right, meta: { k: 'cong-tf', a: a, b: b } };
        }]
      ],
      'sh-turn': [
        [1, 'tap', function (lv) {
          var d = lv === 1 ? 0 : R.int(0, 3), mv = lv === 1 ? [R.pick(['quarter turn right', 'quarter turn left', 'half turn'])] : [R.pick(Object.keys(TURN)), R.pick(Object.keys(TURN))];
          var end = d; mv.forEach(function (m) { end = (end + TURN[m]) % 4; });
          return { q: 'You face <b>' + DN[d] + '</b>. You make a ' + mv.join(', then a ') + '. Tap the way you face now.', type: 'tap', pic: compassPic(), answer: DN[end], answerText: DN[end],
            hint: 'Clockwise goes north, east, south, west. A quarter turn right is one step clockwise.', steps: ['Start: ' + DN[d] + '.', 'After the turns you face ' + DN[end] + '.'],
            explain: 'You face ' + DN[end] + '.', meta: { k: 'turn-tap', d: DN[d], moves: mv } };
        }],
        [1, 'match', function (lv) {
          var d = lv === 1 ? 0 : R.int(0, 3), mv = R.shuffle(Object.keys(TURN));
          var pairs = mv.map(function (m) { return ['a ' + m, DN[(d + TURN[m]) % 4]]; });
          return { q: 'You face <b>' + DN[d] + '</b>. Match each turn to the way you face after it.', type: 'match', pairs: pairs, fig: compass(d),
            hint: 'A quarter turn right goes one step clockwise. A half turn faces the other way.', steps: pairs.map(function (p) { return 'After ' + p[0] + ': ' + p[1] + '.'; }),
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'turn-match', d: DN[d] } };
        }],
        [2, 'mistake', function (lv) {
          var d = R.int(0, 3), who = nm(), truth = !R.int(0, 2), said = truth ? DN[(d + 1) % 4] : DN[(d + 3) % 4];
          var right = 'A quarter turn right goes clockwise: ' + DN[d] + ' to ' + DN[(d + 1) % 4] + '.';
          return { q: who + ' faces ' + DN[d] + ' and makes a quarter turn right. ' + who + ' says they now face <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Right turns go counterclockwise.', 'A quarter turn faces the opposite way.', 'A quarter turn does not change the way you face.']),
            hint: 'Clockwise: north, east, south, west.', steps: [right], explain: right, meta: { k: 'turn-tf', d: DN[d], moves: ['quarter turn right'], said: said } };
        }]
      ],
      'sh-path': [
        [1, 'tap', function (lv) {
          var r = route(lv), end = cell(r.end[0], r.end[1]);
          return { q: 'Start at ' + cell(r.x, r.y) + ', facing north. ' + actText(r.acts).charAt(0).toUpperCase() + actText(r.acts).slice(1) + '. Tap the square where you end.', type: 'tap', pic: tapMap([r.x, r.y], 0), answer: end, answerText: end,
            hint: 'North is up. A quarter turn right then faces east.', steps: ['Start at ' + cell(r.x, r.y) + '.', 'Do one step at a time.', 'You end at ' + end + '.'],
            explain: 'You end at ' + end + '.', meta: { k: 'path-tap', x: r.x, y: r.y, acts: r.acts } };
        }],
        [1, 'which', function (lv) {
          var r = route(lv), from = cell(r.x, r.y), to = cell(r.end[0], r.end[1]);
          var wrong = [r.acts.map(function (a) { return a === 'right' ? 'left' : a === 'left' ? 'right' : a; }), r.acts.map(function (a) { return /forward/.test(a) ? 'forward ' + (+a.split(' ')[1] + 1) : a; }), ['forward ' + (+r.acts[0].split(' ')[1] + 1)]];
          var o = R.mc(actText(r.acts), wrong.filter(function (w) { var e = walk(r.x, r.y, 0, w); return cell(e[0], e[1]) !== to; }).map(actText));
          return { q: 'You start at <b>' + from + '</b>, facing north. Which directions take you to <b>' + to + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: map([[r.x, r.y]], 0),
            hint: 'Try each one on the map, one step at a time.', steps: ['Follow: ' + actText(r.acts) + '.', 'You reach ' + to + '.'],
            explain: actText(r.acts) + ' takes you to ' + to + '.', meta: { k: 'path-which', x: r.x, y: r.y, to: to } };
        }],
        [2, 'mistake', function (lv) {
          var r = route(2), turn = r.acts[1], wrongActs = r.acts.map(function (a) { return a === 'right' ? 'left' : a === 'left' ? 'right' : a; }), we = walk(r.x, r.y, 0, wrongActs);
          var who = nm(), truth = !R.int(0, 2) || we[0] < 0 || we[0] > 5, said = truth ? cell(r.end[0], r.end[1]) : cell(we[0], Math.max(0, Math.min(5, we[1])));
          var right = 'A quarter turn ' + turn + ' from north faces ' + (turn === 'right' ? 'east' : 'west') + '. You end at ' + cell(r.end[0], r.end[1]) + '.';
          return { q: 'Start at ' + cell(r.x, r.y) + ', facing north. ' + actText(r.acts).charAt(0).toUpperCase() + actText(r.acts).slice(1) + '. ' + who + ' says you end at <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: said === cell(r.end[0], r.end[1]), fig: map([[r.x, r.y]], 0),
            why: why(right, ['A quarter turn ' + turn + ' from north faces ' + (turn === 'right' ? 'west' : 'east') + '.', 'Turning moves you one square.', 'North is down on a map.']),
            hint: 'Which way do you face after the turn?', steps: [right], explain: right, meta: { k: 'path-tf', x: r.x, y: r.y, acts: r.acts, said: said } };
        }]
      ]
    };
    Q.shapes(CH, SHAPES);
  })();
})();
