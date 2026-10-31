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
      righttri: { p: [[cx - h, cy - h], [cx - h, cy + h], [cx + 1.1 * h, cy + h]], sides: 3, sq: 1, eq: false, sym: 0, name: 'triangle with a square corner' },
      rhombus: { p: [[cx, cy - 1.2 * h], [cx + 0.8 * h, cy], [cx, cy + 1.2 * h], [cx - 0.8 * h, cy]], sides: 4, sq: 0, eq: true, sym: 2, name: 'rhombus' },
      trap: { p: [[cx - 0.6 * h, cy - 0.8 * h], [cx + 0.6 * h, cy - 0.8 * h], [cx + 1.3 * h, cy + 0.8 * h], [cx - 1.3 * h, cy + 0.8 * h]], sides: 4, sq: 0, eq: false, sym: 1, name: 'trapezoid' },
      pent: { p: regular(5, cx, cy + 0.08 * h, 1.1 * h), sides: 5, sq: 0, eq: true, sym: 5, name: 'pentagon' },
      hex: { p: regular(6, cx, cy, 1.1 * h, 0), sides: 6, sq: 0, eq: true, sym: 6, name: 'hexagon' },
      oct: { p: regular(8, cx, cy, 1.15 * h), sides: 8, sq: 0, eq: true, sym: 8, name: 'octagon' },
      house: { p: [[cx - h, cy + h], [cx - h, cy - 0.1 * h], [cx, cy - 1.1 * h], [cx + h, cy - 0.1 * h], [cx + h, cy + h]], sides: 5, sq: 2, eq: false, sym: 1, name: 'house-shaped pentagon' }
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

  A.register('shapes', {
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
})();
