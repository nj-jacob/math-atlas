(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  /* solids: 3D points, edges (h = hidden), visible faces. Facts are for flat faces. */
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
    cyl: { name: 'cylinder', f: 2, e: 2, v: 0, faces: '2 circles and 1 curved surface', round: 'cyl' },
    cone: { name: 'cone', f: 1, e: 1, v: 1, faces: '1 circle and 1 curved surface', round: 'cone' }
  };
  var ORDER = ['cube', 'rprism', 'tprism', 'spyr', 'tpyr', 'cyl', 'cone'];
  function P(p, ox, oy) { return [ox + p[0] + p[2] * 0.5, oy - p[1] - p[2] * 0.36]; }
  function solid(key, hl, ox, oy, label) {
    var d = typeof key === 'string' ? S[key] : key, s = '', col = 'var(--strand)';
    ox = ox === undefined ? 60 : ox; oy = oy === undefined ? 230 : oy;
    var faceFill = hl === 'f' ? 'color-mix(in srgb,var(--hi) 70%,var(--card))' : 'color-mix(in srgb,' + col + ' 20%,var(--card))';
    var lineCol = hl === 'e' ? 'var(--bad)' : 'var(--ink)', lw = hl === 'e' ? 5 : 3;
    if (d.round) {
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
        if (hl === 'v') s += '<circle cx="' + cx + '" cy="' + ap + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
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
  var DIRS = ['up (north)', 'right (east)', 'down (south)', 'left (west)'], DN = ['north', 'east', 'south', 'west'];

  A.register('shapes', {
    html:
'<section class="sec"><h2><span class="n">1</span>Faces, edges and vertices</h2>' +
'<p>A <b>3D object</b> has length, width and height. A <b>face</b> is a flat surface. An <b>edge</b> is where two faces meet. A <b>vertex</b> is a corner where edges meet. More than one vertex are called <b>vertices</b>. Dashed lines show edges hidden at the back.</p>' +
'<div class="lab"><span class="lt">Try it: explore an object</span>' +
'<div class="ctrl"><label for="sok">Object<select id="sok">' + ORDER.map(function (k) { return '<option value="' + k + '">' + S[k].name + '</option>'; }).join('') + '</select></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-hl="f" aria-pressed="false">Show faces</button><button type="button" class="btn alt" data-hl="e" aria-pressed="false">Show edges</button><button type="button" class="btn alt" data-hl="v" aria-pressed="false">Show vertices</button></div>' +
'<div class="fig" id="sofig"></div><div class="out" id="soout" aria-live="polite"></div></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Object</th><th>Faces</th><th>Edges</th><th>Vertices</th></tr></thead><tbody>' +
ORDER.map(function (k) { return '<tr><td class="l">' + S[k].name + '</td><td>' + S[k].f + '</td><td>' + S[k].e + '</td><td>' + S[k].v + '</td></tr>'; }).join('') + '</tbody></table></div>' +
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
        { q: 'Which object has no vertices?', options: ['cone', 'cylinder', 'pyramid'], answer: 1, why: 'A cylinder has no corners. A cone has 1 point at the top.' },
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
        $('#soout', root).innerHTML = '<p><span class="big">' + d.name.charAt(0).toUpperCase() + d.name.slice(1) + '</span></p><p><b>' + d.f + '</b> flat face' + (d.f === 1 ? '' : 's') + ' (' + d.faces + '), <b>' + d.e + '</b> edge' + (d.e === 1 ? '' : 's') + ', <b>' + d.v + '</b> vert' + (d.v === 1 ? 'ex' : 'ices') + '.' +
          (d.round ? ' The curved surface is not a flat face, and its edges are curved.' : '') + '</p>';
      }
      root.querySelectorAll('[data-hl]').forEach(function (b) { b.addEventListener('click', function () { var h = b.getAttribute('data-hl'); hl = hl === h ? '' : h; so(); }); });
      A.bind(root, ['sok'], so);
      /* structures: parts sized to fit, built from the same point lists as the solids */
      var BOX = { cube: [110, 110, 110], rprism: [170, 90, 90] }, split = false;
      function boxDef(k) { var d = BOX[k], w = d[0], h = d[1], z = d[2], e = S[k].edges.map(function (x) { return x.slice(); });
        e[6][2] = 1; e[8][2] = 1; /* the roof hides the back and left top edges */
        return { name: S[k].name, pts: [[0, 0, 0], [w, 0, 0], [w, h, 0], [0, h, 0], [0, 0, z], [w, 0, z], [w, h, z], [0, h, z]], edges: e, vis: S[k].vis }; }
      function roofDef(k) { var d = BOX[k], w = d[0], h = d[1], z = d[2], r = 70;
        return { name: 'triangular prism', pts: [[0, h, 0], [w, h, 0], [w / 2, h + r, 0], [0, h, z], [w, h, z], [w / 2, h + r, z]], edges: S.tprism.edges, vis: S.tprism.vis }; }
      function pyrDef(k) { var d = BOX[k], w = d[0], h = d[1], z = d[2];
        return { name: 'square-based pyramid', pts: [[0, h, 0], [w, h, 0], [w, h, z], [0, h, z], [w / 2, h + 100, z / 2]], edges: S.spyr.edges, vis: S.spyr.vis }; }
      var ST = { house: ['cube', 'tprism', 'It looks like a house.'], barn: ['rprism', 'tprism', 'It looks like a barn.'], tower: ['cube', 'spyr', 'It looks like a tower with a pointed roof.'], silo: ['cyl', 'cone', 'It looks like a grain silo.'] };
      function inner(x) { return x.replace(/^<svg[^>]*>|<\/svg>$/g, ''); }
      function st() {
        var k = $('#stb', root).value, c = ST[k], b = c[0], t = c[1], lift = split ? 70 : 0, bot, top;
        if (b === 'cyl') { bot = solid({ name: 'cylinder', round: 'cyl', rx: 80, ht: 150 }, '', 60, 380); top = solid({ name: 'cone', round: 'cone', rx: 80, ht: 130 }, '', 60, 380 - 150 - lift); }
        else { bot = solid(split ? b : boxDef(b), '', 30, 380); top = solid(t === 'tprism' ? roofDef(b) : pyrDef(b), '', 30, 380 - lift); }
        $('#stfig', root).innerHTML = A.svg(320, 420, '<g>' + inner(bot) + '</g><g>' + inner(top).replace(/var\(--strand\)/g, 'var(--sb)') + '</g>', (split ? 'Taken apart: a ' + S[t].name + ' lifted off a ' : 'A ' + S[t].name + ' on top of a ') + S[b].name);
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
      { q: 'How many vertices does a cone have?', type: 'num', answer: 1,
        hint: 'Look for the pointed tip.', explain: 'A cone has 1 vertex, at its tip.' },
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
        var k = lv === 1 ? R.pick(['cube', 'rprism']) : R.pick(ORDER), part = lv === 1 ? R.pick(['f', 'v']) : R.pick(['f', 'e', 'v']), d = S[k];
        var nm = { f: 'flat faces', e: 'edges', v: 'vertices' }[part], ans = d[part];
        return { q: 'How many <b>' + nm + '</b> does a ' + d.name + ' have?', type: 'num', answer: ans, fig: lv < 3 ? solid(k, part, 40, 210, 'A ' + d.name) : '',
          hint: part === 'f' ? 'Count the flat surfaces, even the ones you cannot see.' : part === 'e' ? 'Count where two faces meet. Remember the dashed edges at the back.' : 'Count the corners, front and back.',
          steps: ['A ' + d.name + ' has ' + d.faces + '.', 'Count carefully, including the hidden back.<div class="fig">' + solid(k, part, 40, 210) + '</div>', 'It has ' + ans + ' ' + nm + '.'],
          explain: 'A ' + d.name + ' has ' + d.f + ' flat faces, ' + d.e + ' edges and ' + d.v + ' vertices.' };
      } },
      { id: 'sh-name', name: 'Name the object', code: 'E1.1', gen: function (lv) {
        var k = R.pick(ORDER), d = S[k], clue = lv === 1 ? 'I have ' + d.faces + '.' : lv === 2 ? 'I have ' + d.f + ' flat face' + (d.f === 1 ? '' : 's') + ', ' + d.e + ' edge' + (d.e === 1 ? '' : 's') + ' and ' + d.v + ' vert' + (d.v === 1 ? 'ex' : 'ices') + '.' : 'I have ' + d.v + ' vert' + (d.v === 1 ? 'ex' : 'ices') + ' and ' + d.e + ' edge' + (d.e === 1 ? '' : 's') + '.';
        var others = ORDER.filter(function (x) { return x !== k; });
        if (lv === 3) others = others.filter(function (x) { return !(S[x].v === d.v && S[x].e === d.e); });
        if (lv === 2) others = others.filter(function (x) { return !(S[x].v === d.v && S[x].e === d.e && S[x].f === d.f); });
        var o = R.mc(d.name, R.shuffle(others).map(function (x) { return S[x].name; }));
        return { q: clue + ' What am I?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Use the table of faces, edges and vertices.', steps: ['Check each object against the clue.', 'Only one object matches: a ' + d.name + '.<div class="fig">' + solid(k, '', 40, 210) + '</div>', 'A ' + d.name + ' has ' + d.f + ' flat faces, ' + d.e + ' edges and ' + d.v + ' vertices.'],
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
})();
