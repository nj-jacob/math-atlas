(function () {
  var A = Atlas, R = A.R, D = A.draw;
  var NAMES = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' };
  function pts(list) { return list.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function regular(n, cx, cy, r, rot) {
    var out = [];
    rot = rot === undefined ? -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n) : rot;
    for (var i = 0; i < n; i++) { var a = rot + 2 * Math.PI * i / n; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return out;
  }
  function poly(p, fill, extra) { return '<polygon points="' + pts(p) + '" style="fill:' + (fill || 'color-mix(in srgb,var(--strand) 30%,var(--card))') + ';stroke:var(--ink)" stroke-width="3" stroke-linejoin="round" ' + (extra || '') + '/>'; }
  function dots(p) { return p.map(function (q) { return '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="6" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>'; }).join(''); }
  /* the same number of sides, but a stretched, uneven version */
  function irregular(n, cx, cy, r, seed) {
    var p = regular(n, cx, cy, r), k = seed || 1;
    return p.map(function (q, i) { var f = 0.72 + 0.28 * Math.abs(Math.sin(k * (i + 1) * 1.7)); return [cx + (q[0] - cx) * f * 1.15, cy + (q[1] - cy) * f]; });
  }
  /* a gallery of named shapes for questions. Each: {p: points, sides, sq: number of square corners, eq: all sides equal, sym: lines of symmetry, name} */
  function lib(cx, cy, s) {
    s = s || 1;
    var h = 46 * s;
    return {
      square: { p: [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]], sides: 4, sq: 4, eq: true, sym: 4, name: 'square' },
      rectangle: { p: [[cx - 1.5 * h, cy - 0.8 * h], [cx + 1.5 * h, cy - 0.8 * h], [cx + 1.5 * h, cy + 0.8 * h], [cx - 1.5 * h, cy + 0.8 * h]], sides: 4, sq: 4, eq: false, sym: 2, name: 'rectangle' },
      eqtri: { p: regular(3, cx, cy + 0.2 * h, 1.15 * h), sides: 3, sq: 0, eq: true, sym: 3, name: 'triangle with equal sides' },
      isotri: { p: [[cx, cy - 1.1 * h], [cx + 0.75 * h, cy + h], [cx - 0.75 * h, cy + h]], sides: 3, sq: 0, eq: false, sym: 1, name: 'tall triangle' },
      righttri: { p: [[cx - h, cy - 0.5 * h], [cx - h, cy + h], [cx + 1.2 * h, cy + h]], sides: 3, sq: 1, eq: false, sym: 0, name: 'triangle with a square corner' },
      rhombus: { p: [[cx, cy - 1.2 * h], [cx + 0.8 * h, cy], [cx, cy + 1.2 * h], [cx - 0.8 * h, cy]], sides: 4, sq: 0, eq: true, sym: 2, name: 'rhombus' },
      trap: { p: [[cx - 0.6 * h, cy - 0.8 * h], [cx + 0.6 * h, cy - 0.8 * h], [cx + 1.3 * h, cy + 0.8 * h], [cx - 1.3 * h, cy + 0.8 * h]], sides: 4, sq: 0, eq: false, sym: 1, name: 'trapezoid' },
      pent: { p: regular(5, cx, cy + 0.08 * h, 1.1 * h), sides: 5, sq: 0, eq: true, sym: 5, name: 'pentagon' },
      hex: { p: regular(6, cx, cy, 1.1 * h, 0), sides: 6, sq: 0, eq: true, sym: 6, name: 'hexagon' },
      oct: { p: regular(8, cx, cy, 1.15 * h), sides: 8, sq: 0, eq: true, sym: 8, name: 'octagon' },
      house: { p: [[cx - h, cy + h], [cx - h, cy - 0.1 * h], [cx, cy - 1.3 * h], [cx + h, cy - 0.1 * h], [cx + h, cy + h]], sides: 5, sq: 2, eq: false, sym: 1, name: 'house-shaped pentagon' }
    };
  }
  function one(key, label, fill) { var L = lib(80, 70); return A.svg(160 + (key === 'rectangle' || key === 'trap' ? 40 : 0), 140, poly(L[key].p.map(function (q) { return [q[0] + (key === 'rectangle' || key === 'trap' ? 20 : 0), q[1]]; }), fill), label || L[key].name); }
  /* symmetry lines for the library shapes */
  function symLines(key, cx, cy, h) {
    var L = [];
    function ln(a, r) { L.push([cx - r * Math.cos(a), cy - r * Math.sin(a), cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    var r = 1.6 * h;
    if (key === 'square') { ln(0, r); ln(Math.PI / 2, r); ln(Math.PI / 4, r); ln(-Math.PI / 4, r); }
    if (key === 'rectangle') { ln(0, 2 * h); ln(Math.PI / 2, r); }
    if (key === 'rhombus') { ln(0, r); ln(Math.PI / 2, r); }
    if (key === 'isotri' || key === 'trap' || key === 'house') ln(Math.PI / 2, r);
    if (key === 'eqtri') for (var i = 0; i < 3; i++) { var a = -Math.PI / 2 + 2 * Math.PI * i / 3; L.push([cx + 1.15 * h * Math.cos(a), cy + 0.2 * h + 1.15 * h * Math.sin(a), cx - 0.58 * h * Math.cos(a), cy + 0.2 * h - 0.58 * h * Math.sin(a)]); }
    if (key === 'pent') for (var j = 0; j < 5; j++) { var b = -Math.PI / 2 + 2 * Math.PI * j / 5; L.push([cx + 1.1 * h * Math.cos(b), cy + 0.08 * h + 1.1 * h * Math.sin(b), cx - 0.9 * h * Math.cos(b), cy + 0.08 * h - 0.9 * h * Math.sin(b)]); }
    if (key === 'hex') for (var k = 0; k < 6; k++) ln(Math.PI * k / 6, 1.25 * h);
    if (key === 'oct') for (var m = 0; m < 8; m++) ln(Math.PI * m / 8 + Math.PI / 8, 1.3 * h);
    return L.map(function (l) { return '<line x1="' + l[0].toFixed(1) + '" y1="' + l[1].toFixed(1) + '" x2="' + l[2].toFixed(1) + '" y2="' + l[3].toFixed(1) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="8 5"/>'; }).join('');
  }
  /* pattern-block hexagon filled with pieces: 'tri', 'rho', 'trap', 'mix' */
  function hexFill(kind, cx, cy, r) {
    var c = regular(6, cx, cy, r, 0), s = '', T = 'var(--sd)', Rh = 'var(--sb)', Tr = 'var(--bad)';
    function tri(i) { return poly([[cx, cy], c[i], c[(i + 1) % 6]], T); }
    if (kind === 'tri') for (var i = 0; i < 6; i++) s += tri(i);
    if (kind === 'rho') for (var j = 0; j < 3; j++) s += poly([[cx, cy], c[2 * j], c[2 * j + 1], c[(2 * j + 2) % 6]], Rh);
    if (kind === 'trap') { s += poly([c[0], c[1], c[2], c[3]], Tr); s += poly([c[3], c[4], c[5], c[0]], Tr); }
    if (kind === 'mix') { s += poly([c[0], c[1], c[2], c[3]], Tr); s += poly([[cx, cy], c[3], c[4], c[5]], Rh); s += tri(5); }
    if (kind === 'none') s += poly(c, 'var(--card)');
    return s;
  }
  var HEX = { tri: { n: 6, w: 'triangles' }, rho: { n: 3, w: 'blue rhombuses' }, trap: { n: 2, w: 'red trapezoids' }, mix: { n: 3, w: 'pieces: 1 trapezoid, 1 rhombus and 1 triangle' } };
  /* grid shape from a list of cells [col,row] */
  function cells(list, col, u, ox, oy) {
    u = u || 36; ox = ox || 4; oy = oy || 4;
    return list.map(function (c) { return '<rect x="' + (ox + c[0] * u) + '" y="' + (oy + c[1] * u) + '" width="' + u + '" height="' + u + '" style="fill:' + (col || 'var(--strand)') + ';stroke:var(--ink)" stroke-width="2"/>'; }).join('');
  }
  function grid(w, h, u, ox, oy) {
    var s = '';
    for (var i = 0; i <= w; i++) s += '<line x1="' + (ox + i * u) + '" y1="' + oy + '" x2="' + (ox + i * u) + '" y2="' + (oy + h * u) + '" style="stroke:var(--line)" stroke-width="1"/>';
    for (var j = 0; j <= h; j++) s += '<line x1="' + ox + '" y1="' + (oy + j * u) + '" x2="' + (ox + w * u) + '" y2="' + (oy + j * u) + '" style="stroke:var(--line)" stroke-width="1"/>';
    return s;
  }
  var SHAPES2 = [
    [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]],
    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],
    [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]],
    [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2]]
  ];
  /* a shape and a copy that is turned, flipped or resized */
  function copyOf(key, how) {
    var L = lib(0, 0, 1), p = L[key].p, out = '', scale = how === 'big' ? 1.4 : how === 'small' ? 0.65 : 1, ang = how === 'turn' ? Math.PI / 2 : 0;
    var a = p.map(function (q) { return [100 + q[0], 100 + q[1]]; });
    var b = p.map(function (q) { var x = q[0] * scale, y = q[1] * scale; if (how === 'flip') x = -x; var xr = x * Math.cos(ang) - y * Math.sin(ang), yr = x * Math.sin(ang) + y * Math.cos(ang); return [320 + xr, 100 + yr]; });
    out += poly(a, 'color-mix(in srgb,var(--strand) 30%,var(--card))') + poly(b, 'color-mix(in srgb,var(--hi) 55%,var(--card))');
    return A.svg(440, 200, out, 'Two shapes. The second is ' + ({ same: 'an exact copy', turn: 'turned', flip: 'flipped', big: 'made bigger', small: 'made smaller' })[how] + '.');
  }

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'shapes';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  /* a hexagon with its sides numbered one at a time */
  /* a regular shape with n sides (6 if not given), sides 1 to upto counted */
  function numbered(upto, n) {
    n = n || 6;
    var c = regular(n, 110, 95, 76, n === 6 ? 0 : undefined), s = poly(c);
    for (var i = 0; i < upto; i++) {
      var a = c[i], b = c[(i + 1) % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      s += K.pop('<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" style="stroke:var(--hi)" stroke-width="7" stroke-linecap="round"/><text x="' + (110 + (mx - 110) * 1.25).toFixed(1) + '" y="' + (95 + (my - 95) * 1.25 + 7).toFixed(1) + '" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--strand)">' + (i + 1) + '</text>', i === upto - 1 ? 0 : -9);
    }
    return A.svg(220, 190, s + (upto === n ? K.pop(dots(c), 1) : ''), 'A ' + NAMES[n] + ' with ' + upto + ' sides counted');
  }
  /* a page corner placed on a shape's corner */
  function pageCorner(x, y, fits) {
    return '<path d="M' + x + ' ' + (y - 34) + ' V' + y + ' H' + (x + 34) + '" fill="none" style="stroke:' + (fits ? 'var(--ok)' : 'var(--bad)') + '" stroke-width="5"/>';
  }
  function cornerFrame(k, fits) {
    var L = lib(110, 85), p = L[k].p, c = k === 'rhombus' ? p[3] : k === 'hex' ? p[4] : p[3];
    return A.svg(220, 180, poly(p) + K.pop(pageCorner(c[0], c[1], fits), 0), 'A ' + L[k].name + ' with a page corner on one corner');
  }
  /* tap every shape that matches a rule */
  function pickLab(rule, keys, test, label) {
    return K.lab('<p class="t2">' + label + '</p><div class="btnrow g2-picks">' + keys.map(function (k) { var L = lib(50, 46, 0.62); return '<button type="button" class="btn alt g2-pick" aria-pressed="false" data-k="' + k + '">' + A.svg(100, 92, poly(L[k].p), L[k].name) + '</button>'; }).join('') + '</div><div class="out" aria-live="polite"></div>',
      function (root, done) {
        var out = root.querySelector('.out'), L = lib(0, 0);
        root.addEventListener('click', function (e) {
          var b = e.target.closest('.g2-pick'); if (!b) return;
          b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
          var picked = [].filter.call(root.querySelectorAll('.g2-pick'), function (x) { return x.getAttribute('aria-pressed') === 'true'; }).map(function (x) { return x.getAttribute('data-k'); });
          var want = keys.filter(function (k) { return test(L[k]); });
          var wrong = picked.filter(function (k) { return want.indexOf(k) < 0; });
          if (wrong.length) out.innerHTML = '<p>Check the <b>' + L[wrong[0]].name + '</b> again. ' + rule(L[wrong[0]]) + '</p>';
          else if (picked.length < want.length) out.innerHTML = '<p>' + picked.length + ' found. ' + (want.length - picked.length) + ' more to go.</p>';
          else { out.innerHTML = '<p><span class="big">All ' + want.length + ' found.</span></p>'; done('Yes. Every shape you picked follows the rule.'); }
        });
      }, 'Tap every shape that follows the rule. Tap again to undo.');
  }
  var namesLab = K.lab(
    '<div class="ctrl"><label for="lsn">Sides: <output id="lsno">5</output><input type="range" id="lsn" min="3" max="8" value="5"></label></div><div class="vrow" id="lsfig"></div><div class="out" id="lsout"></div>',
    function (root, done) {
      var $ = A.$;
      A.bind(root, ['lsn'], function () {
        var n = +$('#lsn', root).value, p1 = regular(n, 90, 85, 70), p2 = irregular(n, 90, 85, 66, n);
        $('#lsno', root).textContent = n;
        $('#lsfig', root).innerHTML = '<figure>' + A.svg(180, 170, poly(p1) + dots(p1), 'A ' + NAMES[n] + ' with equal sides') + '</figure><figure>' + A.svg(200, 170, poly(p2, 'color-mix(in srgb,var(--hi) 55%,var(--card))') + dots(p2), 'A ' + NAMES[n] + ' with uneven sides') + '</figure>';
        $('#lsout', root).innerHTML = '<p><span class="big">' + n + ' sides, ' + n + ' corners</span></p><p>Both are <b>' + NAMES[n] + 's</b>. One has equal sides. One has uneven sides. The name comes from the number of sides.</p>';
        done();
      });
    }, 'Slide to change the number of sides. Watch the name.');
  var symLab = K.lab(
    '<div class="ctrl"><label for="lyk">Shape<select id="lyk">' + ['square', 'rectangle', 'eqtri', 'isotri', 'righttri', 'rhombus', 'trap', 'house', 'hex'].map(function (k) { return '<option value="' + k + '"' + (k === 'isotri' ? ' selected' : '') + '>' + lib(0, 0)[k].name + '</option>'; }).join('') + '</select></label></div>' +
    '<div class="btnrow"><button type="button" class="btn" id="lynext">Show a line</button><button type="button" class="btn alt" id="lyclr">Start again</button></div><div class="fig" id="lyfig"></div><div class="out" id="lyout" aria-live="polite"></div>',
    function (root, done) {
      var $ = A.$, shown = 0;
      function draw() {
        var k = $('#lyk', root).value, L = lib(140, 100, 1.2), sh = L[k], lines = symLines(k, 140, 100, 46 * 1.2).split('/>').filter(Boolean).slice(0, shown).map(function (x) { return x + '/>'; }).join('');
        $('#lyfig', root).innerHTML = A.svg(280, 200, poly(sh.p) + lines, 'A ' + sh.name + ' showing ' + shown + ' lines of symmetry');
        var all = shown >= sh.sym;
        $('#lynext', root).disabled = all;
        $('#lyout', root).innerHTML = sh.sym === 0 ? '<p>No fold makes the halves match. A ' + sh.name + ' has <span class="big">0</span> lines of symmetry.</p>' : all ? '<p>That is all of them. A ' + sh.name + ' has <span class="big">' + sh.sym + '</span> line' + (sh.sym === 1 ? '' : 's') + ' of symmetry.</p>' : '<p>' + (shown ? shown + ' so far. Is there another fold that matches?' : 'Guess first: how many folds make the halves match?') + '</p>';
        return all;
      }
      $('#lynext', root).addEventListener('click', function () { shown++; if (draw()) done('Good. Now pick another shape and guess before you look.'); });
      $('#lyclr', root).addEventListener('click', function () { shown = 0; draw(); });
      $('#lyk', root).addEventListener('change', function () { shown = 0; draw(); });
      draw();
    }, 'Pick a shape. Guess its lines of symmetry, then show them one at a time.');
  var hexLab = K.lab(
    '<div class="btnrow"><button type="button" class="btn alt" data-hx="tri">Triangles</button><button type="button" class="btn alt" data-hx="rho">Rhombuses</button><button type="button" class="btn alt" data-hx="trap">Trapezoids</button><button type="button" class="btn alt" data-hx="mix">Mix them</button></div><div class="fig" id="lxfig"></div><div class="out" id="lxout" aria-live="polite"></div>',
    function (root, done) {
      var $ = A.$;
      function x(kind) {
        $('#lxfig', root).innerHTML = A.svg(200, 180, hexFill(kind, 100, 90, 84), kind === 'none' ? 'An empty hexagon' : 'A hexagon filled with ' + HEX[kind].n + ' ' + HEX[kind].w);
        $('#lxout', root).innerHTML = kind === 'none' ? '<p>Pick a kind of piece.</p>' : '<p>The hexagon is filled with <span class="big">' + HEX[kind].n + '</span> ' + HEX[kind].w + '.</p>' + (kind === 'mix' ? '<p class="t2">A trapezoid is 3 triangles, and a rhombus is 2 triangles. 3 + 2 + 1 = 6 triangles, the same as a full hexagon.</p>' : '');
      }
      root.addEventListener('click', function (e) { var b = e.target.closest('[data-hx]'); if (b) { x(b.getAttribute('data-hx')); done(); } });
      x('none');
    }, 'Fill the same hexagon with different pieces.');
  var copyLab = K.lab(
    '<div class="ctrl"><label for="lck">Shape<select id="lck"><option value="trap">trapezoid</option><option value="isotri">tall triangle</option><option value="righttri" selected>triangle with a square corner</option><option value="house">house shape</option></select></label></div>' +
    '<div class="btnrow"><button type="button" class="btn alt" data-cp="same">Exact copy</button><button type="button" class="btn alt" data-cp="turn">Turn it</button><button type="button" class="btn alt" data-cp="flip">Flip it</button><button type="button" class="btn alt" data-cp="big">Make it bigger</button><button type="button" class="btn alt" data-cp="small">Make it smaller</button></div>' +
    '<div class="fig" id="lcfig"></div><div class="out" id="lcout" aria-live="polite"></div>',
    function (root, done) {
      var $ = A.$, how = 'same', tried = {};
      function c() {
        $('#lcfig', root).innerHTML = copyOf($('#lck', root).value, how);
        var yes = how !== 'big' && how !== 'small';
        $('#lcout', root).innerHTML = '<p><span class="big">' + (yes ? 'Congruent' : 'Not congruent') + '</span></p><p>' + (yes ? 'Same size and shape. ' + (how === 'same' ? 'It is not moved at all.' : 'It is only ' + (how === 'turn' ? 'turned' : 'flipped') + '.') : 'Same shape, but its sides are ' + (how === 'big' ? 'longer' : 'shorter') + '.') + '</p>';
      }
      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-cp]'); if (!b) return;
        how = b.getAttribute('data-cp'); tried[how] = 1; c();
        if ((tried.turn || tried.flip) && (tried.big || tried.small)) done('Right. Turning and flipping keep it congruent. Changing the size does not.');
      });
      $('#lck', root).addEventListener('change', c);
      c();
    }, 'Move the copy. Try a turn or flip, and try a size change.');
  function areaFrame(a, col, ox, w, h) { return grid(w, h, 36, ox, 4) + cells(a, col, 36, ox, 4); }
  var GEO = 'Tap pegs to stretch the band. Tap the first peg again to close it.';

  var LESSONS = [
    { id: 'sides', title: 'Sides and corners', sub: 'Count to name a shape.', concepts: [
      { id: 'count', title: 'Count sides and corners', exp: ['E1.1'], skill: 's2-name',
        body: '<p>A <b>side</b> is a straight edge of a shape. A <b>corner</b> is where two sides meet. Count each side once as you go around.</p>',
        watch: K.clip([
          ['Start at one side. That is 1.', numbered(1)],
          ['Go around: 2, 3.', numbered(3)],
          ['4, 5, 6. Back to the start.', numbered(6)],
          ['6 sides and 6 corners. It is a <b>hexagon</b>.', numbered(6), 2000]
        ]),
        example: K.clip([
          ['My turn. I will name this shape. I start at one side and call it 1.', numbered(1, 5)],
          ['I go around, one side at a time: 2, 3.', numbered(3, 5)],
          ['4, 5. I am back at the start, so I stop.', numbered(5, 5)],
          ['5 sides and 5 corners. It is a <b>pentagon</b>.', numbered(5, 5), 2000]
        ]),
        try: { tool: 'geoboard', opts: {}, tasks: [
          { do: 'Make a shape with <b>3 sides</b>. ' + GEO, goal: function (s) { return s.closed && s.sides === 3 && s.area > 0; }, yes: 'A triangle: 3 sides and 3 corners.' },
          { do: 'Now make a shape with <b>4 sides</b>.', goal: function (s) { return s.closed && s.sides === 4 && s.area > 0; }, yes: 'A quadrilateral: 4 sides and 4 corners.' },
          { do: 'Now make a shape with <b>5 sides</b>.', goal: function (s) { return s.closed && s.sides === 5 && s.area > 0; }, yes: 'A pentagon. Did it look like a house? It does not have to.' }
        ] },
        key: '<p>Same number of sides and corners, every time. 3 triangle, 4 quadrilateral, 5 pentagon, 6 hexagon, 8 octagon.</p>',
        mistake: '<p>Counting the first side twice. Have your child put a finger on the first side and stop when they reach it again.</p>',
        check: [T('sides'), P('s2-name', 1)] },
      { id: 'names', title: 'The name stays the same', exp: ['E1.1'], skill: 's2-name', hard: true,
        body: '<p>A shape is named by its <b>number of sides</b>. It keeps its name when it is turned, stretched or has uneven sides.</p>' + K.vs('Any shape with 5 straight sides is a pentagon.', 'A pentagon must look like a house.'),
        watch: K.clip([
          ['A pentagon with equal sides.', A.svg(220, 180, K.pop(poly(regular(5, 110, 92, 76))), 'A pentagon')],
          ['Stretch it. Still 5 sides.', A.svg(220, 180, K.pop(poly(irregular(5, 110, 92, 76, 3))), 'A stretched pentagon')],
          ['Turn it upside down. Still 5 sides.', A.svg(220, 180, K.pop(poly(irregular(5, 110, 92, 76, 3).map(function (q) { return [q[0], 184 - q[1]]; }))), 'A turned pentagon')],
          ['All three are <b>pentagons</b>.', A.svg(330, 120, poly(regular(5, 55, 62, 48)) + poly(irregular(5, 165, 62, 48, 3)) + poly(irregular(5, 275, 62, 48, 3).map(function (q) { return [q[0], 124 - q[1]]; })), 'Three pentagons'), 2000]
        ]),
        example: K.clip([
          ['My turn. Here is a hexagon. I count 6 sides.', A.svg(220, 180, K.pop(poly(regular(6, 110, 92, 76, 0))), 'A hexagon')],
          ['Now it is stretched. I count the sides again: still 6.', A.svg(220, 180, K.pop(poly(irregular(6, 110, 92, 72, 5))), 'A stretched hexagon')],
          ['Now it is turned. I count again: still 6.', A.svg(220, 180, K.pop(poly(irregular(6, 110, 92, 72, 5).map(function (q) { return [220 - q[0], 184 - q[1]]; }))), 'A turned hexagon')],
          ['6 sides each time, so all three are <b>hexagons</b>. The name stays the same.', A.svg(330, 120, poly(regular(6, 55, 62, 48, 0)) + poly(irregular(6, 165, 62, 46, 5)) + poly(irregular(6, 275, 62, 46, 5).map(function (q) { return [550 - q[0], 124 - q[1]]; })), 'Three hexagons'), 2200]
        ]),
        try: namesLab,
        ways: [
          { label: 'Count the corners', html: '<p>Corners are easier to count than sides. Put a dot on each corner. The number of dots is the number of sides.</p><div class="fig">' + A.svg(200, 170, poly(irregular(6, 100, 85, 66, 4)) + dots(irregular(6, 100, 85, 66, 4)), 'An uneven hexagon with its corners dotted') + '</div><p>6 dots, so it is a hexagon.</p>' },
          { label: 'Ignore the look', html: '<p>Ask only one question: <b>how many straight sides?</b> Colour, size and which way it points do not matter.</p>' }
        ],
        key: '<p>Count the sides. The count gives the name. Nothing else does.</p>',
        mistake: '<p>Calling a shape "not a triangle" or "not a hexagon" because it is turned or has uneven sides.</p>',
        check: [P('s2-name', 2), P('s2-name', 3)] }
    ] },
    { id: 'sort', title: 'Sorting shapes', sub: 'Sort by corners and sides.', concepts: [
      { id: 'corner', title: 'Square corners', exp: ['E1.1'], skill: 's2-sort',
        body: '<p>A <b>square corner</b> fits the corner of a page exactly. Hold a page corner on each corner of a shape to check.</p>',
        watch: K.clip([
          ['Put a page corner on the rectangle.', cornerFrame('rectangle', true)],
          ['It fits. That is a <b>square corner</b>.', cornerFrame('rectangle', true)],
          ['Try the rhombus. It does not fit.', cornerFrame('rhombus', false)],
          ['The rhombus has <b>no square corners</b>.', cornerFrame('rhombus', false), 2000]
        ]),
        example: K.clip([
          ['My turn. Does the square have a square corner? I put a page corner on it.', cornerFrame('square', true)],
          ['It fits exactly. That is a <b>square corner</b>.', cornerFrame('square', true)],
          ['Now the trapezoid. I put the page corner on it.', cornerFrame('trap', false)],
          ['It does not fit. That corner is <b>not</b> a square corner.', cornerFrame('trap', false), 2000]
        ]),
        try: pickLab(function (s) { return s.sq ? 'It has ' + s.sq + ' square corners.' : 'Put a page corner on it. Does it fit?'; }, ['square', 'rhombus', 'righttri', 'hex', 'house', 'eqtri'], function (s) { return s.sq > 0; }, 'Rule: <b>has a square corner</b>.'),
        key: '<p>Check every corner with a page corner. It fits exactly, or it does not.</p>',
        mistake: '<p>Calling any pointy corner a square corner. Use a real page corner to check.</p>',
        check: [T('sort'), P('s2-sort', 2)] },
      { id: 'equal', title: 'Equal sides', exp: ['E1.1'], skill: 's2-sort',
        body: '<p>Some shapes have all their sides the <b>same length</b>. A square does. This rectangle does not.</p><div class="vrow"><figure>' + one('square') + '<figcaption>4 equal sides, 4 square corners</figcaption></figure><figure>' + one('rectangle') + '<figcaption>4 square corners, sides not all equal</figcaption></figure></div>',
        watch: K.clip([
          ['A square: all 4 sides the same length.', one('square')],
          ['A rectangle: 2 long sides and 2 short sides.', one('rectangle')],
          ['A rhombus: 4 equal sides, but no square corners.', one('rhombus')],
          ['Sort them by more than one rule.', '<div class="vrow">' + one('square') + one('rectangle') + one('rhombus') + '</div>', 2000]
        ]),
        example: K.clip([
          ['My turn. I check the sides. This triangle has 3 sides, all the same length.', one('eqtri')],
          ['This tall triangle has 2 long sides and 1 short side. Not all equal.', one('isotri')],
          ['This square has 4 sides, all the same length.', one('square')],
          ['I sort them. All sides equal: the first triangle and the square. Not equal: the tall triangle.', '<div class="vrow">' + one('eqtri') + one('square') + one('isotri') + '</div>', 2400]
        ]),
        try: { tool: 'geoboard', opts: {}, tasks: [
          { do: 'Make a <b>square</b>: 4 equal sides and 4 square corners. ' + GEO, goal: function (s) { return s.closed && s.sides === 4 && s.perimeter != null && s.perimeter * s.perimeter === 16 * s.area && s.area > 0; }, yes: 'A square. All 4 sides match.' },
          { do: 'Now make a <b>rectangle that is not a square</b>.', goal: function (s) { return s.closed && s.sides === 4 && s.perimeter != null && s.area > 0 && s.perimeter * s.perimeter !== 16 * s.area; }, yes: 'A rectangle. The long sides match, and the short sides match.' }
        ] },
        key: '<p>Rules to sort by: number of sides, square corners, equal sides.</p>',
        check: [T('odd'), P('s2-sort', 3)] }
    ] },
    { id: 'sym', title: 'Lines of symmetry', sub: 'Fold so the halves match.', concepts: [
      { id: 'fold', title: 'What a line of symmetry is', exp: ['E1.1'], skill: 's2-sym', hard: true,
        body: '<p>A <b>line of symmetry</b> cuts a shape into two halves that match exactly. Fold on the line, and one half sits right on top of the other.</p>',
        watch: K.clip([
          ['A tall triangle.', A.svg(220, 180, poly(lib(110, 90).isotri.p), 'A tall triangle')],
          ['Fold it down the middle.', A.svg(220, 180, poly(lib(110, 90).isotri.p) + K.pop(symLines('isotri', 110, 90, 46), 0), 'A tall triangle with a fold line')],
          ['One half lands on the other. They <b>match</b>.', A.svg(220, 180, poly(lib(110, 90).isotri.p) + K.pop(poly([lib(110, 90).isotri.p[0], lib(110, 90).isotri.p[1], [110, lib(110, 90).isotri.p[1][1]]], 'color-mix(in srgb,var(--hi) 60%,var(--card))'), 0) + symLines('isotri', 110, 90, 46), 'The two halves match')],
          ['A fold from a corner to a side does not match. Not a line of symmetry.', A.svg(220, 180, poly(lib(110, 90).isotri.p) + K.pop('<line x1="' + lib(110, 90).isotri.p[1][0] + '" y1="' + lib(110, 90).isotri.p[1][1] + '" x2="72" y2="68" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="8 5"/>', 0), 'A fold that does not match'), 2200]
        ]),
        example: K.clip([
          ['My turn. Is there a line of symmetry? Here is a house shape.', A.svg(220, 180, poly(lib(110, 90).house.p), 'A house shape')],
          ['I fold it straight down the middle.', A.svg(220, 180, poly(lib(110, 90).house.p) + K.pop(symLines('house', 110, 90, 46), 0), 'A house shape with a fold line')],
          ['The left half lands on the right half. They <b>match</b>. That is a line of symmetry.', A.svg(220, 180, poly(lib(110, 90).house.p) + symLines('house', 110, 90, 46), 'A house shape with a line of symmetry')],
          ['Now I fold from the top corner to a bottom corner. The halves do not match. Not a line of symmetry.', A.svg(220, 180, poly(lib(110, 90).house.p) + K.pop('<line x1="' + lib(110, 90).house.p[2][0] + '" y1="' + lib(110, 90).house.p[2][1] + '" x2="' + lib(110, 90).house.p[0][0] + '" y2="' + lib(110, 90).house.p[0][1] + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="8 5"/>', 0), 'A fold that does not match'), 2400]
        ]),
        try: symLab,
        ways: [
          { label: 'Fold paper', html: '<p>Cut the shape out of paper. Fold it. If the edges line up all the way around, the fold is a line of symmetry.</p>' },
          { label: 'Use a mirror', html: '<p>Stand a small mirror on the line. If the half you see plus its reflection looks like the whole shape, it is a line of symmetry.</p>' },
          { label: 'This, not that', html: K.vs('Both halves are the same size and shape, and they match when folded.', 'The line just cuts the shape into two pieces.') }
        ],
        key: '<p>Fold in your head. Halves match: line of symmetry. Halves do not match: not one.</p>',
        mistake: '<p>Thinking any line through the middle is a line of symmetry. The halves must match when folded, not just be the same size.</p>',
        check: [T('isline'), P('s2-sym', 1)] },
      { id: 'many', title: 'Some shapes have more', exp: ['E1.1'], skill: 's2-sym',
        body: '<p>Some shapes have more than one line of symmetry. Some have none. Try every fold: up and down, side to side, and corner to corner.</p>',
        watch: K.clip([
          ['A square. Fold up and down: 1.', A.svg(220, 180, poly(lib(110, 90).square.p) + K.pop(symLines('square', 110, 90, 46).split('/>')[0] + '/>'), 'A square with 1 line')],
          ['Side to side: 2.', A.svg(220, 180, poly(lib(110, 90).square.p) + symLines('square', 110, 90, 46).split('/>').slice(0, 2).join('/>') + '/>', 'A square with 2 lines')],
          ['Corner to corner: 3 and 4.', A.svg(220, 180, poly(lib(110, 90).square.p) + K.pop(symLines('square', 110, 90, 46)), 'A square with 4 lines')],
          ['A square has <b>4 lines of symmetry</b>.', A.svg(220, 180, poly(lib(110, 90).square.p) + symLines('square', 110, 90, 46), 'A square with 4 lines of symmetry'), 2000]
        ]),
        example: K.clip([
          ['My turn. How many lines of symmetry does a rectangle have? I fold it side to side: 1.', A.svg(220, 180, poly(lib(110, 90).rectangle.p) + K.pop(symLines('rectangle', 110, 90, 46).split('/>')[0] + '/>'), 'A rectangle with 1 line')],
          ['I fold it up and down: 2.', A.svg(220, 180, poly(lib(110, 90).rectangle.p) + K.pop(symLines('rectangle', 110, 90, 46)), 'A rectangle with 2 lines')],
          ['I try corner to corner. The halves do not match, so I do not count it.', A.svg(220, 180, poly(lib(110, 90).rectangle.p) + symLines('rectangle', 110, 90, 46) + K.pop('<line x1="' + lib(110, 90).rectangle.p[0][0] + '" y1="' + lib(110, 90).rectangle.p[0][1] + '" x2="' + lib(110, 90).rectangle.p[2][0] + '" y2="' + lib(110, 90).rectangle.p[2][1] + '" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="3 5"/>', 0), 'A rectangle with a diagonal that does not match')],
          ['A rectangle has <b>2 lines of symmetry</b>.', A.svg(220, 180, poly(lib(110, 90).rectangle.p) + symLines('rectangle', 110, 90, 46), 'A rectangle with 2 lines of symmetry'), 2000]
        ]),
        try: symLab,
        key: '<p>Try every kind of fold. Count only the ones that match.</p>',
        check: [T('count'), P('s2-sym', 2)] }
    ] },
    { id: 'make', title: 'Putting shapes together', sub: 'Make and break shapes.', concepts: [
      { id: 'hexagon', title: 'Many ways to make a hexagon', exp: ['E1.2'], skill: 's2-compose',
        body: '<p>Small shapes fit together to <b>make</b> a bigger shape. A big shape can be <b>broken</b> into smaller ones.</p>',
        watch: K.clip([
          ['An empty hexagon.', A.svg(200, 180, hexFill('none', 100, 90, 84), 'An empty hexagon')],
          ['Fill it with 6 triangles.', A.svg(200, 180, K.pop(hexFill('tri', 100, 90, 84)), 'A hexagon of 6 triangles')],
          ['Or with 3 rhombuses.', A.svg(200, 180, K.pop(hexFill('rho', 100, 90, 84)), 'A hexagon of 3 rhombuses')],
          ['Or with 2 trapezoids. The same hexagon each time.', A.svg(200, 180, K.pop(hexFill('trap', 100, 90, 84)), 'A hexagon of 2 trapezoids'), 2000]
        ]),
        example: K.clip([
          ['My turn. I will fill a hexagon a new way.', A.svg(200, 180, hexFill('none', 100, 90, 84), 'An empty hexagon')],
          ['I use 1 trapezoid, 1 rhombus and 1 triangle. 3 pieces fill it.', A.svg(200, 180, K.pop(hexFill('mix', 100, 90, 84)), 'A hexagon of a trapezoid, a rhombus and a triangle')],
          ['I check with triangles: the trapezoid is 3, the rhombus is 2, the triangle is 1. 3 + 2 + 1 = 6. The same hexagon.', A.svg(200, 180, hexFill('mix', 100, 90, 84), 'A hexagon of a trapezoid, a rhombus and a triangle'), 2600]
        ]),
        try: hexLab,
        ways: [
          { label: 'Think in triangles', html: '<p>A hexagon is 6 triangles. A trapezoid is 3 triangles, so 2 trapezoids make a hexagon. A rhombus is 2 triangles, so 3 rhombuses make a hexagon.</p><div class="fig">' + A.svg(200, 180, hexFill('mix', 100, 90, 84), 'A hexagon of 1 trapezoid, 1 rhombus and 1 triangle') + '</div>' }
        ],
        key: '<p>Bigger pieces: fewer of them. Smaller pieces: more of them.</p>',
        mistake: '<p>Thinking the hexagon is a different size when it is made of different pieces.</p>',
        check: [T('hex'), P('s2-compose', 1), P('s2-compose', 2)] },
      { id: 'area', title: 'Move the pieces, same area', exp: ['E1.2'], skill: 's2-compose', hard: true,
        body: '<p>The <b>area</b> is how much space a shape covers. Move the same pieces into a new shape, and the area stays the same.</p>',
        watch: K.clip([
          ['A shape made of 6 squares.', A.svg(400, 120, areaFrame(SHAPES2[0], 'var(--strand)', 4, 4, 2), 'A shape of 6 squares')],
          ['Move the same 6 squares.', A.svg(400, 120, areaFrame(SHAPES2[0], 'var(--strand)', 4, 4, 2) + K.pop(areaFrame(SHAPES2[2], 'var(--sd)', 240, 3, 2)), 'Two shapes of 6 squares')],
          ['They look different. Both cover <b>6 squares</b>.', A.svg(400, 120, areaFrame(SHAPES2[0], 'var(--strand)', 4, 4, 2) + areaFrame(SHAPES2[2], 'var(--sd)', 240, 3, 2), 'Two shapes, same area'), 2000]
        ]),
        example: K.clip([
          ['My turn. This shape is a row of 6 squares.', A.svg(400, 152, areaFrame(SHAPES2[1], 'var(--strand)', 4, 6, 1), 'A row of 6 squares')],
          ['I move the same 6 squares into a new shape.', A.svg(400, 152, areaFrame(SHAPES2[1], 'var(--strand)', 4, 6, 1) + K.pop(areaFrame(SHAPES2[3], 'var(--sd)', 260, 3, 4)), 'Two shapes of 6 squares')],
          ['I count the squares in the new shape: 6. They look different, but both cover <b>6 squares</b>. Same area.', A.svg(400, 152, areaFrame(SHAPES2[1], 'var(--strand)', 4, 6, 1) + areaFrame(SHAPES2[3], 'var(--sd)', 260, 3, 4), 'Two shapes, same area'), 2400]
        ]),
        try: { tool: 'geoboard', opts: {}, tasks: [
          { do: 'Make a shape that covers exactly <b>4 squares</b>. ' + GEO, goal: function (s) { return s.closed && s.area === 4; }, yes: 'Area 4. The board shows it.' },
          { do: 'Now make a <b>different</b> shape that also covers 4 squares. Try a long thin one.', goal: function (s) { return s.closed && s.area === 4 && s.perimeter != null && s.perimeter !== 8; }, yes: 'It looks different, but it covers the same 4 squares.' }
        ] },
        ways: [
          { label: 'Count the squares', html: '<p>Area here means counting squares. Count each square once. Two shapes with the same count have the same area, whatever they look like.</p>' },
          { label: 'Cut and move', html: '<p>Cut a paper rectangle in two. Put the pieces together a new way. You did not add or throw away any paper, so the area did not change.</p>' }
        ],
        key: '<p>Same pieces, new shape: same area.</p>',
        mistake: '<p>Thinking a longer or taller shape must cover more space.</p>',
        check: [T('area'), P('s2-compose', 3)] }
    ] },
    { id: 'cong', title: 'Same size, same shape', sub: 'Congruent shapes.', concepts: [
      { id: 'congruent', title: 'Congruent shapes', exp: ['E1.3'], skill: 's2-congruent', hard: true,
        body: '<p>Two shapes are <b>congruent</b> when they are the same size and the same shape. One would fit exactly on top of the other. Turning or flipping does not change that.</p>',
        watch: K.clip([
          ['A shape and an exact copy. <b>Congruent</b>.', copyOf('righttri', 'same')],
          ['Turn the copy. Still <b>congruent</b>.', copyOf('righttri', 'turn')],
          ['Flip the copy. Still <b>congruent</b>.', copyOf('righttri', 'flip')],
          ['Make it bigger. Same shape, new size. <b>Not congruent</b>.', copyOf('righttri', 'big'), 2200]
        ]),
        example: K.clip([
          ['My turn. Are these two shapes congruent? The copy is turned.', copyOf('trap', 'turn')],
          ['I check: same shape, and the sides are the same lengths. Turning does not change that. <b>Congruent</b>.', copyOf('trap', 'turn'), 2000],
          ['Now the copy is flipped. Same shape, same size. Still <b>congruent</b>.', copyOf('trap', 'flip')],
          ['This copy is smaller. Same shape, but a new size. <b>Not congruent</b>.', copyOf('trap', 'small'), 2200]
        ]),
        try: copyLab,
        ways: [
          { label: 'Trace it', html: '<p>Trace one shape on thin paper. Slide, turn or flip the paper. If the tracing fits exactly on the other shape, they are congruent.</p>' },
          { label: 'Match the sides', html: '<p>Measure each side. Congruent shapes have sides of the same lengths and corners of the same sizes.</p>' },
          { label: 'This, not that', html: K.vs('Same size and same shape, even if turned or flipped.', 'Same shape but a different size.') }
        ],
        key: '<p>Turn it, flip it, slide it: still congruent. Change its size: not congruent.</p>',
        mistake: '<p>Saying a turned or flipped copy is not congruent, or saying a bigger copy is congruent because it is "the same shape".</p>',
        check: [T('cong'), P('s2-congruent', 1), P('s2-congruent', 2)] }
    ] }
  ];
  A.register('shapes', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Sides and corners</h2>' +
'<p>A <b>side</b> is a straight line on the edge of a shape. A <b>corner</b> (also called a vertex) is where two sides meet. Shapes are named by how many sides they have.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>I count the sides of this shape: 1, 2, 3, 4, 5, 6. It has <b>6 sides</b> and <b>6 corners</b>. It is a <b>hexagon</b>.</p><div class="fig">' + A.svg(200, 170, poly(regular(6, 100, 85, 72, 0)) + dots(regular(6, 100, 85, 72, 0)) + regular(6, 100, 85, 72, 0).map(function (q, i, a) { var nx = a[(i + 1) % 6], mx = (q[0] + nx[0]) / 2, my = (q[1] + nx[1]) / 2; return '<text x="' + (100 + (mx - 100) * 1.22).toFixed(1) + '" y="' + (85 + (my - 85) * 1.22 + 7).toFixed(1) + '" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--strand)">' + (i + 1) + '</text>'; }).join(''), 'A hexagon with its 6 sides numbered and 6 corners marked') + '</div></div>' +
'<div class="tbl"><table><thead><tr><th scope="col">Sides</th><th scope="col">Name</th></tr></thead><tbody>' + [[3, 'triangle'], [4, 'quadrilateral'], [5, 'pentagon'], [6, 'hexagon'], [8, 'octagon']].map(function (r) { return '<tr><td>' + r[0] + '</td><td><b>' + r[1] + '</b></td></tr>'; }).join('') + '</tbody></table></div>' +
'<div class="yt" data-yt="sides"></div>' +
'<div class="lab"><span class="lt">Try it: count the sides</span>' +
'<div class="ctrl"><label for="sn">Sides: <output id="sno">5</output><input type="range" id="sn" min="3" max="8" value="5"></label></div>' +
'<div class="vrow" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a shape changes its name when it is turned or stretched. A triangle is still a triangle when it is upside down. A shape with 5 sides is always a pentagon, even if the sides are different lengths.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Sorting shapes</h2>' +
'<p>We can sort shapes by the number of sides, by whether all the sides are the <b>same length</b>, or by whether they have <b>square corners</b>. A square corner looks like the corner of a page.</p>' +
'<div class="vrow"><figure>' + one('square') + '<figcaption>4 equal sides, 4 square corners</figcaption></figure><figure>' + one('rectangle') + '<figcaption>4 sides, 4 square corners, not all equal</figcaption></figure><figure>' + one('rhombus') + '<figcaption>4 equal sides, no square corners</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Sorting rule: <b>has a square corner</b>. I check each corner with the corner of a page. The square, the rectangle and the house shape have square corners. The hexagon and the rhombus do not.</p></div>' +
'<div class="yt" data-yt="sort"></div>' +
'<div class="key"><b class="t">Key idea</b><p>A square is a special rectangle: it has 4 square corners like every rectangle, and all its sides are the same length.</p></div>' +
'<div class="yt" data-yt="odd"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Lines of symmetry</h2>' +
'<p>A <b>line of symmetry</b> cuts a shape into two halves that match exactly. If you fold the shape on the line, the halves sit right on top of each other.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>A rectangle folds in half the long way and the short way. Both times the halves match. A rectangle has <b>2 lines of symmetry</b>. A fold from corner to corner does not match, so that is not a line of symmetry.</p>' +
'<div class="fig">' + A.svg(220, 150, (function () { var L = lib(110, 75); return poly(L.rectangle.p) + symLines('rectangle', 110, 75, 46); })(), 'A rectangle with its 2 lines of symmetry') + '</div></div>' +
'<div class="yt" data-yt="isline"></div>' +
'<div class="lab"><span class="lt">Try it: find the lines of symmetry</span>' +
'<div class="ctrl"><label for="yk">Shape<select id="yk"><option value="square">square</option><option value="rectangle">rectangle</option><option value="eqtri">triangle with equal sides</option><option value="isotri" selected>tall triangle</option><option value="righttri">triangle with a square corner</option><option value="rhombus">rhombus</option><option value="trap">trapezoid</option><option value="house">house shape</option><option value="hex">hexagon</option></select></label>' +
'<button type="button" class="btn" id="yshow">Show the lines</button></div>' +
'<div class="fig" id="yfig"></div><div class="out" id="yout"></div></div>' +
'<div class="yt" data-yt="count"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Putting shapes together</h2>' +
'<p>Small shapes can be put together to <b>make</b> a bigger shape. A big shape can be broken into smaller ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>A hexagon can be made from 6 triangles, or 3 rhombuses, or 2 trapezoids. It is the same hexagon each time.</p>' +
'<div class="vrow"><figure>' + A.svg(150, 136, hexFill('tri', 75, 68, 64), 'A hexagon made of 6 triangles') + '<figcaption>6 triangles</figcaption></figure><figure>' + A.svg(150, 136, hexFill('rho', 75, 68, 64), 'A hexagon made of 3 rhombuses') + '<figcaption>3 rhombuses</figcaption></figure><figure>' + A.svg(150, 136, hexFill('trap', 75, 68, 64), 'A hexagon made of 2 trapezoids') + '<figcaption>2 trapezoids</figcaption></figure></div></div>' +
'<div class="yt" data-yt="hex"></div>' +
'<div class="lab"><span class="lt">Try it: fill the hexagon</span>' +
'<div class="btnrow"><button type="button" class="btn alt" data-hx="tri">Triangles</button><button type="button" class="btn alt" data-hx="rho">Rhombuses</button><button type="button" class="btn alt" data-hx="trap">Trapezoids</button><button type="button" class="btn alt" data-hx="mix">Mix them</button></div>' +
'<div class="fig" id="xfig"></div><div class="out" id="xout"></div></div>' +
'<p>When you move the pieces of a shape around, the <b>area</b> (the space it covers) stays the same.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Both shapes are made of the same 6 squares, moved around. They look different, but they cover the <b>same area: 6 squares</b>.</p>' +
'<div class="fig">' + A.svg(400, 120, grid(4, 2, 36, 4, 4) + cells(SHAPES2[0], 'var(--strand)', 36, 4, 4) + grid(3, 2, 36, 240, 4) + cells(SHAPES2[2], 'var(--sd)', 36, 240, 4), 'Two shapes, each made of 6 squares') + '</div></div>' +
'<div class="yt" data-yt="area"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Same size, same shape</h2>' +
'<p>Two shapes are <b>congruent</b> if they are the same size and the same shape. You could trace one and it would fit exactly on the other. Turning or flipping a shape does not change that.</p>' +
'<div class="vrow"><figure>' + copyOf('isotri', 'turn') + '<figcaption>Congruent: the copy is just turned</figcaption></figure><figure>' + copyOf('isotri', 'big') + '<figcaption>Not congruent: same shape, different size</figcaption></figure></div>' +
'<div class="yt" data-yt="cong"></div>' +
'<div class="lab"><span class="lt">Try it: move a copy</span>' +
'<div class="ctrl"><label for="ck">Shape<select id="ck"><option value="trap">trapezoid</option><option value="isotri">tall triangle</option><option value="righttri" selected>triangle with a square corner</option><option value="house">house shape</option></select></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-cp="same">Exact copy</button><button type="button" class="btn alt" data-cp="turn">Turn it</button><button type="button" class="btn alt" data-cp="flip">Flip it</button><button type="button" class="btn alt" data-cp="big">Make it bigger</button><button type="button" class="btn alt" data-cp="small">Make it smaller</button></div>' +
'<div class="fig" id="cfig"></div><div class="out" id="cout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To check, match the sides and the corners. Congruent shapes have sides of the same lengths and corners of the same sizes.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function s() {
        var n = +$('#sn', root).value, p1 = regular(n, 90, 85, 70), p2 = irregular(n, 90, 85, 66, n);
        $('#sno', root).textContent = n;
        $('#sfig', root).innerHTML = '<figure>' + A.svg(180, 170, poly(p1) + dots(p1), 'A ' + NAMES[n] + ' with equal sides') + '</figure><figure>' + A.svg(200, 170, poly(p2, 'color-mix(in srgb,var(--hi) 55%,var(--card))') + dots(p2), 'A ' + NAMES[n] + ' with uneven sides') + '</figure>';
        $('#sout', root).innerHTML = '<p><span class="big">' + n + ' sides, ' + n + ' corners</span></p><p>Both shapes are <b>' + NAMES[n] + 's</b>. One has equal sides. The other has uneven sides, but it still has ' + n + '.</p>';
      }
      A.bind(root, ['sn'], s);
      var showY = false;
      function y() {
        var k = $('#yk', root).value, L = lib(140, 100, 1.2), sh = L[k];
        $('#yfig', root).innerHTML = A.svg(280, 200, poly(sh.p) + (showY ? symLines(k, 140, 100, 46 * 1.2) : ''), 'A ' + sh.name + (showY ? ' with ' + sh.sym + ' lines of symmetry' : ''));
        $('#yout', root).innerHTML = showY ? '<p>A ' + sh.name + ' has <span class="big">' + sh.sym + '</span> line' + (sh.sym === 1 ? '' : 's') + ' of symmetry.' + (sh.sym === 0 ? ' No fold makes the halves match.' : '') + '</p>' : '<p>Think: where could you fold it so the halves match? Then press the button.</p>';
        $('#yshow', root).textContent = showY ? 'Hide the lines' : 'Show the lines';
      }
      $('#yshow', root).addEventListener('click', function () { showY = !showY; y(); });
      $('#yk', root).addEventListener('change', function () { showY = false; y(); });
      y();
      function x(kind) {
        $('#xfig', root).innerHTML = A.svg(200, 180, hexFill(kind, 100, 90, 84), kind === 'none' ? 'An empty hexagon' : 'A hexagon filled with ' + HEX[kind].n + ' ' + HEX[kind].w);
        $('#xout', root).innerHTML = kind === 'none' ? '<p>Pick a kind of piece.</p>' : '<p>The hexagon is filled with <span class="big">' + HEX[kind].n + '</span> ' + HEX[kind].w + '.</p>' + (kind === 'mix' ? '<p class="t2">A trapezoid is 3 triangles, and a rhombus is 2 triangles. 3 + 2 + 1 = 6 triangles, the same as a full hexagon.</p>' : '');
      }
      root.querySelectorAll('[data-hx]').forEach(function (b) { b.addEventListener('click', function () { x(b.getAttribute('data-hx')); }); });
      x('none');
      var how = 'turn';
      function c() {
        var k = $('#ck', root).value;
        $('#cfig', root).innerHTML = copyOf(k, how);
        var yes = how !== 'big' && how !== 'small';
        $('#cout', root).innerHTML = '<p><span class="big">' + (yes ? 'Congruent' : 'Not congruent') + '</span></p><p>' + (yes ? 'The copy is the same size and shape. ' + (how === 'same' ? 'It is not moved at all.' : 'It is only ' + (how === 'turn' ? 'turned' : 'flipped') + '.') : 'The copy has the same shape, but its sides are ' + (how === 'big' ? 'longer' : 'shorter') + '.') + '</p>';
      }
      root.querySelectorAll('[data-cp]').forEach(function (b) { b.addEventListener('click', function () { how = b.getAttribute('data-cp'); c(); }); });
      $('#ck', root).addEventListener('change', c);
      c();
    },

    turns: {
      sides: function () { var n = R.pick([3, 4, 5, 6, 8]), p = irregular(n, 90, 80, 64, R.int(1, 9)); var o = R.mc(NAMES[n], [3, 4, 5, 6, 8].filter(function (k) { return k !== n; }).map(function (k) { return NAMES[k]; })); return { q: 'Count the sides. What is this shape called?', type: 'mc', options: o.options, answer: o.answer, fig: A.svg(200, 160, poly(p), 'A shape to count'), hint: 'Put your finger on one side and count each side once as you go around.', explain: 'It has ' + n + ' sides, so it is a ' + NAMES[n] + '.' }; },
      sort: function () { var L = lib(80, 70), keys = ['square', 'rectangle', 'rhombus', 'trap', 'righttri', 'hex', 'eqtri', 'house']; var k = R.pick(keys), yes = L[k].sq > 0; return { q: 'Does this shape have a <b>square corner</b>?', type: 'mc', options: ['Yes', 'No'], answer: yes ? 0 : 1, fig: A.svg(200, 150, poly(lib(100, 75)[k].p), L[k].name), hint: 'Look at each corner. Does any corner look like the corner of a page?', explain: 'A ' + L[k].name + (yes ? ' has ' + L[k].sq + ' square corner' + (L[k].sq > 1 ? 's' : '') + '.' : ' has no square corners.') }; },
      odd: function () { var groups = [['square', 'rectangle', 'trap', 'eqtri'], ['eqtri', 'isotri', 'righttri', 'pent'], ['hex', 'pent', 'oct', 'square']]; var g = R.pick([0, 1]), set = groups[g], L = lib(0, 0, 0.6); var oddKey = set[3], s = ''; var order = R.shuffle(set); order.forEach(function (k, i) { s += poly(L[k].p.map(function (q) { return [70 + i * 110 + q[0], 60 + q[1]]; })) + '<text x="' + (70 + i * 110) + '" y="128" text-anchor="middle" font-size="20" font-weight="800">' + 'ABCD'.charAt(i) + '</text>'; }); var o = { options: ['A', 'B', 'C', 'D'], answer: order.indexOf(oddKey) }; return { q: 'Which shape does <b>not</b> belong?', type: 'mc', options: o.options, answer: o.answer, fig: A.svg(440, 138, s, 'Four shapes: ' + order.map(function (k, i) { return 'ABCD'.charAt(i) + ' is a ' + L[k].name; }).join(', ')), hint: 'Count the sides of each shape. Three of them have the same number.', explain: 'The ' + L[oddKey].name + ' has ' + L[oddKey].sides + ' sides. The others have ' + L[set[0]].sides + '.' }; },
      isline: function () { var k = R.pick(['square', 'rectangle', 'isotri', 'rhombus']), good = R.int(0, 1), L = lib(110, 80), line; if (good) line = symLines(k, 110, 80, 46).split('/>')[0] + '/>'; else { var p = L[k].p; line = '<line x1="' + p[0][0] + '" y1="' + p[0][1] + '" x2="' + p[2][0] + '" y2="' + p[2][1] + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="8 5"/>'; if (k === 'isotri') line = '<line x1="128" y1="20" x2="128" y2="140" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="8 5"/>'; if (k === 'square' || k === 'rhombus') { line = '<line x1="' + (L[k].p[0][0] + 20) + '" y1="' + (L[k].p[0][1] - 10) + '" x2="' + (L[k].p[2][0] - 20) + '" y2="' + (L[k].p[2][1] + 10) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="8 5"/>'; } } return { q: 'Is the dashed line a line of symmetry?', type: 'mc', options: ['Yes', 'No'], answer: good ? 0 : 1, fig: A.svg(220, 160, poly(L[k].p) + line, 'A ' + L[k].name + ' with a dashed line'), hint: 'Imagine folding the shape on the line. Would the two halves sit exactly on top of each other?', explain: good ? 'Folding on the line makes the halves match.' : 'The two halves would not match, so it is not a line of symmetry.' }; },
      count: function () { var k = R.pick(['square', 'rectangle', 'isotri', 'righttri', 'eqtri', 'house']), L = lib(100, 80); return { q: 'How many lines of symmetry does this ' + L[k].name + ' have?', type: 'num', answer: L[k].sym, fig: A.svg(200, 160, poly(L[k].p), 'A ' + L[k].name), hint: 'Try folding it in your head: up and down, side to side, and corner to corner. Count the folds that match.', explain: 'A ' + L[k].name + ' has ' + L[k].sym + ' line' + (L[k].sym === 1 ? '' : 's') + ' of symmetry.' }; },
      hex: function () { var k = R.pick(['tri', 'rho', 'trap']); return { q: 'How many ' + HEX[k].w + ' make one hexagon?', type: 'num', answer: HEX[k].n, fig: A.svg(150, 136, hexFill('none', 75, 68, 64) + hexFill(k, 75, 68, 64).split('/>').slice(0, 1).join('') + '/>', 'An empty hexagon with one piece in it'), hint: 'Look back at the pictures of filled hexagons above.', explain: HEX[k].n + ' ' + HEX[k].w + ' fill a hexagon.' }; },
      area: function () { var a = R.pick(SHAPES2), n = a.length; return { q: 'How many squares cover this shape?', type: 'num', answer: n, fig: A.svg(240, 160, grid(6, 4, 36, 4, 4) + cells(a, 'var(--sd)', 36, 4, 4), 'A shape made of squares'), hint: 'Count each coloured square once.', explain: 'The shape covers ' + n + ' squares.' }; },
      cong: function () { var how = R.pick(['turn', 'flip', 'big', 'small', 'same']), k = R.pick(['trap', 'righttri', 'house']), yes = how !== 'big' && how !== 'small'; return { q: 'Are these two shapes congruent?', type: 'mc', options: ['Yes, congruent', 'No, not congruent'], answer: yes ? 0 : 1, fig: copyOf(k, how), hint: 'Are they the same size? Turning or flipping is fine, but a different size is not.', explain: yes ? 'Same size and shape, so they are congruent.' : 'They are different sizes, so they are not congruent.' }; }
    },

    quiz: [
      { q: 'A shape has 5 sides. What is it called?', type: 'mc', options: ['hexagon', 'pentagon', 'octagon', 'quadrilateral'], answer: 1, hint: 'Look at the table of shape names.', explain: 'A shape with 5 sides is a pentagon.' },
      { q: 'How many corners does an octagon have?', type: 'num', answer: 8, fig: A.svg(180, 170, poly(regular(8, 90, 85, 74)), 'An octagon'), hint: 'A shape has the same number of corners as sides.', explain: 'An octagon has 8 sides and 8 corners.' },
      { q: 'Which shape has 4 equal sides but <b>no</b> square corners?', type: 'mc', options: ['square', 'rectangle', 'rhombus', 'triangle'], answer: 2, hint: 'A square has square corners. Which 4-sided shape is "leaning over"?', explain: 'A rhombus has 4 equal sides and no square corners.' },
      { q: 'How many lines of symmetry does a square have?', type: 'num', answer: 4, fig: A.svg(160, 140, poly(lib(80, 70).square.p), 'A square'), hint: 'Try folding it up and down, side to side, and corner to corner.', explain: 'A square folds evenly 4 ways: up and down, side to side, and on both diagonals.' },
      { q: 'How many triangles make a hexagon?', type: 'num', answer: 6, hint: 'Picture the pattern-block hexagon cut from the centre to every corner.', explain: '6 triangles make one hexagon.' },
      { q: 'These two shapes are made of the same squares, moved around. What is true?', type: 'mc', options: ['The blue one covers more area', 'The orange one covers more area', 'They cover the same area'], answer: 2, fig: A.svg(400, 160, grid(2, 4, 36, 4, 4) + cells([[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], 'var(--strand)', 36, 4, 4) + grid(5, 1, 36, 200, 40) + cells([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], 'var(--se)', 36, 200, 40), 'Two shapes made of 5 squares each'), hint: 'Count the squares in each shape.', explain: 'Each shape is 5 squares, so they cover the same area.' },
      { q: 'A triangle is turned upside down. Is the new triangle congruent to the old one?', type: 'mc', options: ['Yes', 'No'], answer: 0, hint: 'Turning does not change the size or the shape.', explain: 'Turning a shape does not change its size or shape, so they are congruent.' }
    ],

    practice: [
      { id: 's2-name', name: 'Name shapes by sides', code: 'E1.1', gen: function (lv) {
        var n = R.pick(lv === 1 ? [3, 4, 5, 6] : [3, 4, 5, 6, 8]), p = lv === 1 ? regular(n, 90, 80, 66) : irregular(n, 90, 80, 64, R.int(1, 9));
        if (lv === 3) p = p.map(function (q) { return [180 - q[0], q[1] * 0.85 + 12]; });
        var o = R.mc(NAMES[n], [3, 4, 5, 6, 8].filter(function (k) { return k !== n; }).map(function (k) { return NAMES[k]; }));
        return { q: 'What is this shape called?', type: 'mc', options: o.options, answer: o.answer, fig: A.svg(200, 160, poly(p) + (lv === 1 ? dots(p) : ''), 'A shape to name'), hint: 'Count the sides. Start at one corner and go around once.', steps: ['Put your finger on one corner and go around.', 'There are ' + n + ' sides.', 'A shape with ' + n + ' sides is a ' + NAMES[n] + '.'], explain: n + ' sides: ' + NAMES[n] + '.' };
      } },
      { id: 's2-sort', name: 'Sort by sides and corners', code: 'E1.1', gen: function (lv) {
        var L = lib(100, 75), keys = Object.keys(L), k = R.pick(keys), sh = L[k];
        var ask = lv === 1 ? 'sides' : lv === 2 ? R.pick(['sq', 'eq']) : R.pick(['sq', 'eq', 'sides']);
        if (ask === 'sides') return { q: 'How many sides does this ' + (lv === 3 ? 'shape' : sh.name) + ' have?', type: 'num', answer: sh.sides, fig: A.svg(200, 150, poly(sh.p), sh.name), hint: 'Count each straight edge once.', steps: ['Start at one corner.', 'Count each side as you go around.', 'There are ' + sh.sides + '.'], explain: 'A ' + sh.name + ' has ' + sh.sides + ' sides.' };
        if (ask === 'sq') return { q: 'How many <b>square corners</b> does this shape have?', type: 'num', answer: sh.sq, fig: A.svg(200, 150, poly(sh.p), sh.name), hint: 'Check each corner with the corner of a page.', steps: ['Look at each corner one at a time.', 'A square corner fits the corner of a page exactly.', 'This ' + sh.name + ' has ' + sh.sq + '.'], explain: 'A ' + sh.name + ' has ' + sh.sq + ' square corner' + (sh.sq === 1 ? '' : 's') + '.' };
        return { q: 'Are all the sides of this shape the <b>same length</b>?', type: 'mc', options: ['Yes', 'No'], answer: sh.eq ? 0 : 1, fig: A.svg(200, 150, poly(sh.p), sh.name), hint: 'Compare the sides. Is any side longer or shorter than another?', steps: ['Look at each side.', sh.eq ? 'They are all the same length.' : 'Some sides are longer than others.'], explain: 'A ' + sh.name + (sh.eq ? ' has all sides the same length.' : ' has sides of different lengths.') };
      } },
      { id: 's2-sym', name: 'Lines of symmetry', code: 'E1.1', gen: function (lv) {
        var keys = lv === 1 ? ['isotri', 'trap', 'house', 'righttri'] : lv === 2 ? ['rectangle', 'rhombus', 'isotri', 'house', 'righttri'] : ['square', 'eqtri', 'rectangle', 'hex', 'rhombus', 'trap'];
        var k = R.pick(keys), L = lib(100, 80), sh = L[k];
        return { q: 'How many lines of symmetry does this ' + sh.name + ' have?', type: 'num', answer: sh.sym, fig: A.svg(200, 160, poly(sh.p), 'A ' + sh.name), hint: 'Try each fold: up and down, side to side, corner to corner. Count the ones where the halves match.',
          steps: ['Try a fold straight down the middle.', 'Try a fold across, and then from corner to corner.', 'The folds that match are shown.<div class="fig">' + A.svg(200, 160, poly(sh.p) + symLines(k, 100, 80, 46), sh.sym + ' lines of symmetry') + '</div>'], explain: sh.sym + ' line' + (sh.sym === 1 ? '' : 's') + ' of symmetry.' };
      } },
      { id: 's2-compose', name: 'Make and break shapes', code: 'E1.2', gen: function (lv) {
        if (lv === 3) {
          var a = R.pick(SHAPES2), sq = a.length, b = R.pick([[[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]]);
          var same = b.length === sq ? 0 : 1;
          return { q: 'Do these two shapes cover the <b>same area</b>?', type: 'mc', options: ['Yes, the same', 'No, different'], answer: same, fig: A.svg(400, 160, grid(4, 4, 32, 4, 4) + cells(a, 'var(--strand)', 32, 4, 4) + grid(4, 4, 32, 210, 4) + cells(b, 'var(--se)', 32, 210, 4), 'Two shapes made of squares'), hint: 'Count the squares in each shape.', steps: ['The blue shape has ' + sq + ' squares.', 'The orange shape has ' + b.length + ' squares.', same ? 'Different numbers of squares, so different areas.' : 'Same number of squares, so the same area.'], explain: 'Blue: ' + sq + ' squares. Orange: ' + b.length + ' squares.' };
        }
        if (lv === 2) {
          var two = R.pick([['rho', 'tri', 2, 'rhombus'], ['trap', 'tri', 3, 'trapezoid'], ['trap2', 'rho', 0, '']]);
          if (two[0] === 'trap2') return { q: 'How many trapezoids make one hexagon?', type: 'num', answer: 2, fig: A.svg(150, 136, hexFill('trap', 75, 68, 64), 'A hexagon cut into trapezoids'), hint: 'Count the red pieces.', steps: ['Look at the hexagon.', 'Count the red trapezoids: 2.'], explain: '2 trapezoids make a hexagon.' };
          return { q: 'How many green triangles make one ' + two[3] + '?', type: 'num', answer: two[2], hint: 'A hexagon is 6 triangles. A ' + two[3] + ' is part of a hexagon.', steps: ['A hexagon is 6 triangles.', two[3] === 'rhombus' ? '3 rhombuses make a hexagon, so each rhombus is 2 triangles.' : '2 trapezoids make a hexagon, so each trapezoid is 3 triangles.'], explain: 'A ' + two[3] + ' is ' + two[2] + ' triangles.' };
        }
        var k = R.pick(['tri', 'rho', 'trap']);
        return { q: 'How many pieces fill this hexagon?', type: 'num', answer: HEX[k].n, fig: A.svg(150, 136, hexFill(k, 75, 68, 64), 'A hexagon filled with pieces'), hint: 'Count each coloured piece once.', steps: ['Count the pieces one at a time.', 'There are ' + HEX[k].n + ' ' + HEX[k].w + '.'], explain: HEX[k].n + ' ' + HEX[k].w + '.' };
      } },
      { id: 's2-congruent', name: 'Congruent or not', code: 'E1.3', gen: function (lv) {
        var how = R.pick(lv === 1 ? ['same', 'big', 'turn'] : ['turn', 'flip', 'big', 'small', 'same']), k = R.pick(['trap', 'righttri', 'house', 'isotri']), yes = how !== 'big' && how !== 'small';
        return { q: 'Are these two shapes congruent?', type: 'mc', options: ['Yes, congruent', 'No, not congruent'], answer: yes ? 0 : 1, fig: copyOf(k, how), hint: 'Congruent means same size and same shape. Turning or flipping is allowed.', steps: ['Check the shape: is it the same kind of shape?', 'Check the size: are the sides the same lengths?', yes ? 'Yes to both, so they are congruent.' : 'The sides are different lengths, so they are not congruent.'], explain: yes ? 'They are congruent.' : 'They are not congruent: the sizes are different.' };
      } }
    ]
  });
  /* ---------- more ways to ask each practice skill (answer checks: tests/verify/grade2.js) ---------- */
  var why = K.why, who = K.who;
  /* a shape with n sides on its own small picture: even sides (regular) or uneven */
  function sided(n, even, seed) { var p = even ? regular(n, 70, 64, 52) : irregular(n, 70, 64, 50, seed || R.int(1, 9)); return A.svg(140, 128, poly(p), 'A shape with ' + n + ' sides'); }
  function shown(key) { return A.svg(200, 160, poly(lib(100, 80)[key].p), 'A ' + lib(0, 0)[key].name); }
  /* a shape from the library with one dashed fold line through its middle, at angle a */
  function folded(key, a) { var r = 90; return A.svg(200, 160, poly(lib(100, 80)[key].p) + '<line x1="' + (100 - r * Math.cos(a)).toFixed(1) + '" y1="' + (80 - r * Math.sin(a)).toFixed(1) + '" x2="' + (100 + r * Math.cos(a)).toFixed(1) + '" y2="' + (80 + r * Math.sin(a)).toFixed(1) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="8 5"/>', 'A ' + lib(0, 0)[key].name + ' with a fold line'); }
  var FOLDS = { isotri: [[Math.PI / 2], [0, Math.PI / 4]], trap: [[Math.PI / 2], [0, Math.PI / 4]], house: [[Math.PI / 2], [0, -Math.PI / 4]], rectangle: [[0, Math.PI / 2], [Math.atan2(1.6, 3), -Math.atan2(1.6, 3)]], rhombus: [[0, Math.PI / 2], [Math.PI / 4, -Math.PI / 4]] };
  var PIECES = { tri: '6 triangles', rho: '3 rhombuses', trap: '2 trapezoids' };
  function hexPic(kind) { return A.svg(150, 136, hexFill(kind, 75, 68, 64), 'A hexagon filled with pieces'); }
  function twoAreas(a, b) { return A.svg(400, 160, grid(4, 4, 32, 4, 4) + cells(a, 'var(--strand)', 32, 4, 4) + grid(4, 4, 32, 210, 4) + cells(b, 'var(--se)', 32, 210, 4), 'Two shapes made of squares'); }
  var CONG = { same: true, turn: true, flip: true, big: false, small: false };
  Atlas.Q.shapes(CH, {
    's2-name': [
      [1, 'tap', function (lv) {
        var set = R.shuffle(lv === 1 ? [3, 4, 5, 6] : [3, 4, 5, 6, 8]).slice(0, 3), n = set[0], tiles = R.shuffle(set);
        return { q: 'Tap the <b>' + NAMES[n] + '</b>.', type: 'tap', tiles: tiles.map(function (s) { return sided(s, lv === 1); }), answer: tiles.indexOf(n), answerText: 'the shape with ' + n + ' sides',
          hint: 'A ' + NAMES[n] + ' has ' + n + ' sides. Count the sides of each shape.', steps: ['Count the sides of each shape.', 'The one with ' + n + ' sides is the ' + NAMES[n] + '.'],
          explain: 'A ' + NAMES[n] + ' has ' + n + ' sides.', meta: { k: 's2-name-tap' } };
      }],
      [1, 'match', function (lv) {
        var set = R.shuffle(lv === 1 ? [3, 4, 5, 6] : [3, 4, 5, 6, 8]).slice(0, 3);
        return { q: 'Match each shape to its name.', type: 'match', pairs: set.map(function (n) { return [sided(n, lv === 1), NAMES[n]]; }),
          hint: 'Count the sides. 3 is a triangle, 4 is a quadrilateral, 5 is a pentagon, 6 is a hexagon.', steps: ['Count the sides of each shape, then find its name.'],
          explain: set.map(function (n) { return n + ' sides: ' + NAMES[n]; }).join('. ') + '.', meta: { k: 's2-name-match' } };
      }],
      [2, 'mistake', function (lv) {
        var n = R.pick([4, 5, 6, 8]), name = who(), truth = !R.int(0, 2), said = truth ? NAMES[n] : NAMES[n === 8 ? 6 : n + 1];
        var right = 'It has ' + n + ' sides, so it is a ' + NAMES[n] + '. A shape does not need equal sides to have a name.';
        return { q: name + ' says this shape is a <b>' + said + '</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: sided(n, false),
          why: why(right, ['Only shapes with equal sides have names.', 'You name a shape by how big it is.', 'You name a shape by its colour.']),
          hint: 'Count the sides, even when the shape looks stretched.', steps: [right], explain: right, meta: { k: 's2-name-tf' } };
      }]
    ],
    's2-sort': [
      [1, 'pick', function (lv) {
        var L = lib(0, 0), ask = lv === 1 ? R.pick([3, 4]) : R.pick(['sq', 'eq']);
        var ok = function (k) { return ask === 'sq' ? L[k].sq > 0 : ask === 'eq' ? L[k].eq : L[k].sides === ask; };
        var all = ['square', 'rectangle', 'eqtri', 'isotri', 'righttri', 'rhombus', 'trap', 'pent', 'hex', 'house'];
        var yes = R.shuffle(all.filter(ok)), no = R.shuffle(all.filter(function (k) { return !ok(k); })), y = R.int(1, Math.min(3, yes.length));
        var keys = R.shuffle(yes.slice(0, y).concat(no.slice(0, 5 - y)));
        var what = ask === 'sq' ? 'at least one square corner' : ask === 'eq' ? 'all sides the same length' : ask + ' sides';
        return { q: 'Pick every shape with <b>' + what + '</b>.', type: 'pick', options: keys.map(shown), answer: keys.map(function (k, j) { return ok(k) ? j : -1; }).filter(function (j) { return j >= 0; }),
          hint: ask === 'sq' ? 'Check each corner with the corner of a page.' : ask === 'eq' ? 'Compare the sides of each shape.' : 'Count the sides of each shape.', steps: ['Look at one shape at a time.', 'Keep the ones with ' + what + '.'],
          explain: 'The shapes with ' + what + ' are: ' + keys.filter(ok).map(function (k) { return L[k].name; }).join(', ') + '.', meta: { k: 's2-sort-pick', ask: ask } };
      }],
      [1, 'order', function (lv) {
        var set = R.shuffle([3, 4, 5, 6, 8]).slice(0, lv === 1 ? 3 : 4).sort(function (a, b) { return a - b; });
        return { q: 'Put these shapes in order from <b>fewest sides</b> to most sides.', type: 'order', items: set.map(function (n) { return NAMES[n]; }), first: 'fewest sides', last: 'most sides',
          hint: 'Triangle 3, quadrilateral 4, pentagon 5, hexagon 6, octagon 8.', steps: ['Think of how many sides each shape has.'],
          explain: set.map(function (n) { return NAMES[n] + ' (' + n + ')'; }).join(', ') + '.', meta: { k: 's2-sort-order' } };
      }],
      [2, 'mistake', function (lv) {
        var L = lib(0, 0), key = R.pick(['square', 'rectangle', 'rhombus', 'trap', 'righttri', 'house']), sh = L[key], name = who(), truth = !R.int(0, 2);
        var said = truth ? sh.sq : (sh.sq === 4 ? 2 : sh.sq + R.pick([1, 2]));
        var right = 'The ' + sh.name + ' has ' + sh.sq + ' square corner' + (sh.sq === 1 ? '' : 's') + '.';
        return { q: name + ' says this shape has <b>' + said + '</b> square corner' + (said === 1 ? '' : 's') + '. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: shown(key),
          why: why(right, ['Every corner is a square corner.', 'Shapes with 4 sides always have 4 square corners.', 'Pointy corners are square corners.']),
          hint: 'Check each corner with the corner of a page.', steps: [right], explain: right, meta: { k: 's2-sort-tf' } };
      }]
    ],
    's2-sym': [
      [1, 'tap', function (lv) {
        var key = R.pick(lv === 1 ? ['isotri', 'trap', 'house'] : Object.keys(FOLDS)), f = FOLDS[key], good = R.pick(f[0]), set = R.shuffle([good].concat(f[1]));
        return { q: 'Tap the picture where the dashed line is a <b>line of symmetry</b>.', type: 'tap', tiles: set.map(function (a) { return folded(key, a); }), answer: set.indexOf(good), answerText: 'the fold where both halves match',
          hint: 'Imagine folding on the line. Do the two halves match exactly?', steps: ['Fold each picture on its line in your head.', 'A line of symmetry makes two halves that match.'],
          explain: 'Only that fold makes two halves that match.', meta: { k: 's2-sym-tap' } };
      }],
      [1, 'mistake', function (lv) {
        var key = R.pick(lv === 1 ? ['isotri', 'trap', 'house', 'righttri'] : ['rectangle', 'rhombus', 'square', 'isotri']), sh = lib(0, 0)[key], name = who(), truth = !R.int(0, 2);
        var said = truth ? sh.sym : (key === 'rectangle' || key === 'rhombus' ? 4 : sh.sym + 1);
        var right = 'The ' + sh.name + ' has ' + sh.sym + ' line' + (sh.sym === 1 ? '' : 's') + ' of symmetry.';
        return { q: name + ' says this shape has <b>' + said + '</b> line' + (said === 1 ? '' : 's') + ' of symmetry. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: shown(key),
          why: why(right, ['Every shape has 4 lines of symmetry.', 'A line from corner to corner is always a line of symmetry.', 'Lines of symmetry are the same as sides.']),
          hint: 'Try each fold. Count only the folds where the halves match.', steps: [right], explain: right, meta: { k: 's2-sym-tf' } };
      }],
      [2, 'pick', function (lv) {
        var L = lib(0, 0), keys = R.shuffle(['isotri', 'trap', 'house', 'rectangle', 'rhombus', 'square']).slice(0, 3).concat(['righttri']);
        keys = R.shuffle(keys);
        return { q: 'Pick every shape that has <b>at least one</b> line of symmetry.', type: 'pick', options: keys.map(shown), answer: keys.map(function (k, j) { return L[k].sym ? j : -1; }).filter(function (j) { return j >= 0; }),
          hint: 'Can you fold it so the two halves match?', steps: ['Try a fold down the middle of each shape.', 'Then try across and corner to corner.'],
          explain: 'The ' + L.righttri.name + ' has no line of symmetry. The others do.', meta: { k: 's2-sym-pick' } };
      }]
    ],
    's2-compose': [
      [1, 'tap', function (lv) {
        var set = R.shuffle(['tri', 'rho', 'trap']), want = R.pick(set);
        return { q: 'Tap the hexagon made of <b>' + PIECES[want] + '</b>.', type: 'tap', tiles: set.map(hexPic), answer: set.indexOf(want), answerText: 'the hexagon with ' + PIECES[want],
          hint: 'Count the pieces in each hexagon.', steps: ['Count the pieces in each one.', 'Find the one with ' + PIECES[want] + '.'],
          explain: 'That hexagon is made of ' + PIECES[want] + '.', meta: { k: 's2-comp-tap' } };
      }],
      [1, 'match', function (lv) {
        var set = R.shuffle(['tri', 'rho', 'trap']);
        return { q: 'Match each hexagon to the pieces that fill it.', type: 'match', pairs: set.map(function (s) { return [hexPic(s), PIECES[s]]; }),
          hint: 'Count the pieces in each hexagon.', steps: ['Count each piece once.'], explain: '6 triangles, 3 rhombuses or 2 trapezoids each make one hexagon.', meta: { k: 's2-comp-match' } };
      }],
      [2, 'mistake', function (lv) {
        var a = R.pick(SHAPES2), b = R.pick([[[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]]), name = who(), same = a.length === b.length;
        var right = 'The blue shape has ' + a.length + ' squares and the orange shape has ' + b.length + '.';
        return { q: name + ' says these two shapes cover the <b>same area</b>. True or false: ' + name + ' is right.', type: 'tf', answer: same, fig: twoAreas(a, b),
          why: why(right, ['Shapes that look different always have different areas.', 'The taller shape always covers more.', 'You cannot count area.']),
          hint: 'Count the squares in each shape.', steps: [right], explain: right + (same ? ' The same, so the areas are the same.' : ' Different, so the areas are different.'), meta: { k: 's2-comp-tf' } };
      }]
    ],
    's2-congruent': [
      [1, 'tap', function (lv) {
        var key = R.pick(['trap', 'righttri', 'house', 'isotri']), good = R.pick(lv === 1 ? ['same', 'turn'] : ['turn', 'flip']), set = R.shuffle([good, 'big', 'small']);
        return { q: 'Tap the pair of shapes that are <b>congruent</b>.', type: 'tap', tiles: set.map(function (h) { return copyOf(key, h); }), answer: set.indexOf(good), answerText: 'the pair that is the same size and shape',
          hint: 'Congruent means same size and same shape. Turning or flipping is allowed.', steps: ['Check each pair: same shape?', 'Then check: same size?'],
          explain: 'Only that pair is the same size and the same shape.', meta: { k: 's2-cong-tap' } };
      }],
      [1, 'mistake', function (lv) {
        var key = R.pick(['trap', 'righttri', 'house', 'isotri']), how = R.pick(lv === 1 ? ['turn', 'big'] : ['turn', 'flip', 'small']), name = who();
        var right = CONG[how] ? 'Turning or flipping does not change the size or shape, so they are congruent.' : 'One shape is a different size, so they are not congruent.';
        return { q: name + ' says these two shapes are <b>congruent</b>. True or false: ' + name + ' is right.', type: 'tf', answer: CONG[how], fig: copyOf(key, how),
          why: why(right, ['A turned shape is never congruent.', 'Any two shapes of the same kind are congruent.', 'Colour decides if shapes are congruent.']),
          hint: 'Same size and same shape? Turning and flipping are allowed.', steps: [right], explain: right, meta: { k: 's2-cong-tf' } };
      }],
      [2, 'pick', function (lv) {
        var key = R.pick(['trap', 'righttri', 'house', 'isotri']), set = R.shuffle(['same', 'turn', 'flip', 'big', 'small']).slice(0, 4);
        if (set.every(function (h) { return CONG[h]; })) set[0] = 'big';
        if (!set.some(function (h) { return CONG[h]; })) set[0] = 'turn';
        return { q: 'Pick every pair of shapes that are <b>congruent</b>.', type: 'pick', options: set.map(function (h) { return copyOf(key, h); }), answer: set.map(function (h, j) { return CONG[h] ? j : -1; }).filter(function (j) { return j >= 0; }),
          hint: 'Congruent means same size and same shape. Turning or flipping is allowed.', steps: ['Check the size of each pair first.', 'Pairs that are only turned or flipped are still congruent.'],
          explain: 'Turned, flipped or exact copies are congruent. Bigger or smaller copies are not.', meta: { k: 's2-cong-pick' } };
      }]
    ]
  });
})();
