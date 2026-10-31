(function () {
  var A = Atlas, R = A.R, cl = A.clean;
  function sg(n) { n = cl(n); return n < 0 ? '&minus;' + (-n) : String(n); }
  function pt(p) { return '(' + sg(p[0]) + ', ' + sg(p[1]) + ')'; }

  /* ---- solids, drawn as wireframes with hidden edges dashed ---- */
  function poly(pts, fill) { return '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" style="fill:' + (fill || 'color-mix(in srgb,var(--strand) 16%,var(--card))') + ';stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>'; }
  function dash(a, b) { return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" style="stroke:var(--ink2)" stroke-width="1.5" stroke-dasharray="5 4"/>'; }
  var SOLIDS = {
    rect: { name: 'Rectangular prism', F: 6, E: 12, V: 8, base: 'rectangle', planes: '3', rot: 'order 2, about an axis through the centres of two opposite faces',
      draw: function () { var o = [50, -34]; return dash([40, 160], [90, 126]) + dash([90, 126], [230, 126]) + dash([90, 126], [90, 46]) + poly([[40, 80], [180, 80], [230, 46], [90, 46]], 'color-mix(in srgb,var(--strand) 30%,var(--card))') + poly([[180, 80], [230, 46], [230, 126], [180, 160]], 'color-mix(in srgb,var(--strand) 45%,var(--card))') + poly([[40, 80], [180, 80], [180, 160], [40, 160]]); } },
    cube: { name: 'Cube', F: 6, E: 12, V: 8, base: 'square', planes: '9', rot: 'order 4, about an axis through the centres of two opposite faces',
      draw: function () { return dash([60, 170], [105, 140]) + dash([105, 140], [205, 140]) + dash([105, 140], [105, 40]) + poly([[60, 70], [160, 70], [205, 40], [105, 40]], 'color-mix(in srgb,var(--strand) 30%,var(--card))') + poly([[160, 70], [205, 40], [205, 140], [160, 170]], 'color-mix(in srgb,var(--strand) 45%,var(--card))') + poly([[60, 70], [160, 70], [160, 170], [60, 170]]); } },
    tri: { name: 'Triangular prism', F: 5, E: 9, V: 6, base: 'triangle', planes: '4 (if the triangle is equilateral)', rot: 'order 3, about the axis through the centres of the two triangles',
      draw: function () { return dash([40, 160], [100, 130]) + dash([100, 130], [220, 130]) + dash([100, 130], [160, 40]) + poly([[100, 70], [160, 40], [220, 130], [160, 160]], 'color-mix(in srgb,var(--strand) 40%,var(--card))') + poly([[40, 160], [100, 70], [160, 160]]); } },
    sqpyr: { name: 'Square-based pyramid', F: 5, E: 8, V: 5, base: 'square', planes: '4', rot: 'order 4, about the axis from the top point to the centre of the base',
      draw: function () { return dash([40, 160], [90, 125]) + dash([90, 125], [210, 125]) + dash([90, 125], [125, 30]) + poly([[160, 160], [210, 125], [125, 30]], 'color-mix(in srgb,var(--strand) 40%,var(--card))') + poly([[40, 160], [160, 160], [125, 30]]); } },
    tripyr: { name: 'Triangular pyramid', F: 4, E: 6, V: 4, base: 'triangle', planes: '6 (if every face is an equilateral triangle)', rot: 'order 3, about an axis from a corner to the centre of the opposite face',
      draw: function () { return dash([40, 160], [130, 130]) + dash([130, 130], [200, 160]) + dash([130, 130], [115, 30]) + poly([[115, 160], [200, 160], [115, 30]], 'color-mix(in srgb,var(--strand) 40%,var(--card))') + poly([[40, 160], [115, 160], [115, 30]]); } },
    cyl: { name: 'Cylinder', F: '2 flat faces and 1 curved surface', E: '2 curved edges', V: 0, base: 'circle', planes: 'infinitely many through its axis, plus 1 across the middle', rot: 'any angle at all, about its central axis',
      draw: function () { return '<rect x="50" y="50" width="140" height="110" style="fill:color-mix(in srgb,var(--strand) 16%,var(--card))"/><path d="M50 160 A70 20 0 0 0 190 160" style="fill:none;stroke:var(--ink)" stroke-width="2"/><path d="M50 160 A70 20 0 0 1 190 160" style="fill:none;stroke:var(--ink2)" stroke-width="1.5" stroke-dasharray="5 4"/>' +
        '<line x1="50" y1="50" x2="50" y2="160" style="stroke:var(--ink)" stroke-width="2"/><line x1="190" y1="50" x2="190" y2="160" style="stroke:var(--ink)" stroke-width="2"/><ellipse cx="120" cy="50" rx="70" ry="20" style="fill:color-mix(in srgb,var(--strand) 35%,var(--card));stroke:var(--ink)" stroke-width="2"/>'; } }
  };
  function solid(k, w) { return A.svg(w || 250, 180, SOLIDS[k].draw(), SOLIDS[k].name); }

  /* ---- cube buildings from a height map (rows back to front, columns left to right) ---- */
  function iso(map) {
    var a = 22, b = 12.7, hh = 25, s = '', cubes = [], R0 = map.length, C0 = map[0].length, maxH = 0;
    for (var r = 0; r < R0; r++) for (var c = 0; c < C0; c++) { maxH = Math.max(maxH, map[r][c]); for (var z = 0; z < map[r][c]; z++) cubes.push([c, r, z]); }
    cubes.sort(function (p, q) { return (p[0] + p[1]) - (q[0] + q[1]) || p[2] - q[2]; });
    var ox = 30 + R0 * a, oy = 20 + Math.max(maxH, 1) * hh;
    var P = function (c, r, z) { return [(ox + (c - r) * a).toFixed(1), (oy + (c + r) * b - z * hh).toFixed(1)]; };
    var face = function (pts, col) { return '<polygon points="' + pts.map(function (p) { return P.apply(null, p).join(','); }).join(' ') + '" style="fill:' + col + ';stroke:var(--ink)" stroke-width="1.2" stroke-linejoin="round"/>'; };
    for (var g = 0; g <= R0; g++) s += '<line x1="' + P(0, g, 0)[0] + '" y1="' + P(0, g, 0)[1] + '" x2="' + P(C0, g, 0)[0] + '" y2="' + P(C0, g, 0)[1] + '" style="stroke:var(--line)"/>';
    for (var g2 = 0; g2 <= C0; g2++) s += '<line x1="' + P(g2, 0, 0)[0] + '" y1="' + P(g2, 0, 0)[1] + '" x2="' + P(g2, R0, 0)[0] + '" y2="' + P(g2, R0, 0)[1] + '" style="stroke:var(--line)"/>';
    cubes.forEach(function (q) {
      var c = q[0], r = q[1], z = q[2];
      s += face([[c, r, z + 1], [c + 1, r, z + 1], [c + 1, r + 1, z + 1], [c, r + 1, z + 1]], 'color-mix(in srgb,var(--sb) 25%,var(--card))');
      s += face([[c, r + 1, z], [c + 1, r + 1, z], [c + 1, r + 1, z + 1], [c, r + 1, z + 1]], 'color-mix(in srgb,var(--sb) 60%,var(--card))');
      s += face([[c + 1, r, z], [c + 1, r + 1, z], [c + 1, r + 1, z + 1], [c + 1, r, z + 1]], 'var(--sb)');
    });
    var fx = P(C0 / 2, R0, 0), rx = P(C0, R0 / 2, 0);
    s += '<text x="' + (+fx[0] - 30) + '" y="' + (+fx[1] + 30) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--se)">FRONT</text>';
    s += '<text x="' + (+rx[0] + 34) + '" y="' + (+rx[1] + 30) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--se)">RIGHT</text>';
    return A.svg(Math.ceil(60 + (R0 + C0) * a + 40), Math.ceil(oy + (R0 + C0) * b + 44), s, 'A building of ' + cubes.length + ' cubes');
  }
  /* a 2-D view: columns of heights, drawn as squares */
  function view(cols, label, sz) {
    sz = sz || 24;
    var H = Math.max(1, Math.max.apply(null, cols)), s = '';
    cols.forEach(function (h, i) { for (var z = 0; z < h; z++) s += '<rect x="' + (4 + i * sz) + '" y="' + (4 + (H - 1 - z) * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:color-mix(in srgb,var(--se) 30%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>'; });
    s += '<line x1="0" y1="' + (4 + H * sz) + '" x2="' + (8 + cols.length * sz) + '" y2="' + (4 + H * sz) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(8 + cols.length * sz, 8 + H * sz, s, label + ': column heights ' + cols.join(', '));
  }
  function topView(map, sz) {
    sz = sz || 24;
    var s = '';
    map.forEach(function (row, r) { row.forEach(function (h, c) { if (h) s += '<rect x="' + (4 + c * sz) + '" y="' + (4 + r * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:color-mix(in srgb,var(--se) 30%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>'; }); });
    return A.svg(8 + map[0].length * sz, 8 + map.length * sz, s, 'Top view');
  }
  function views(map) {
    var C0 = map[0].length, R0 = map.length, front = [], side = [];
    for (var c = 0; c < C0; c++) { var m = 0; for (var r = 0; r < R0; r++) m = Math.max(m, map[r][c]); front.push(m); }
    for (var r2 = R0 - 1; r2 >= 0; r2--) side.push(Math.max.apply(null, map[r2]));
    return { front: front, side: side };
  }

  /* ---- coordinate plane ---- */
  function plane(shapes, lim, extra) {
    lim = lim || 8;
    var W = 400, u = (W - 40) / (2 * lim), o = W / 2, s = '', X = function (x) { return o + x * u; }, Y = function (y) { return o - y * u; };
    for (var i = -lim; i <= lim; i++) {
      s += '<line x1="' + X(i) + '" y1="' + Y(-lim) + '" x2="' + X(i) + '" y2="' + Y(lim) + '" style="stroke:var(--line)"/><line x1="' + X(-lim) + '" y1="' + Y(i) + '" x2="' + X(lim) + '" y2="' + Y(i) + '" style="stroke:var(--line)"/>';
      if (i && i % 2 === 0) s += '<text x="' + X(i) + '" y="' + (o + 18) + '" text-anchor="middle" font-size="13" class="t2">' + sg(i) + '</text><text x="' + (o - 6) + '" y="' + (Y(i) + 5) + '" text-anchor="end" font-size="13" class="t2">' + sg(i) + '</text>';
    }
    s += '<line x1="' + X(-lim) + '" y1="' + o + '" x2="' + X(lim) + '" y2="' + o + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + o + '" y1="' + Y(-lim) + '" x2="' + o + '" y2="' + Y(lim) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + (X(lim) - 4) + '" y="' + (o - 8) + '" text-anchor="end" font-size="15" font-style="italic" font-weight="700">x</text><text x="' + (o + 8) + '" y="' + (Y(lim) + 14) + '" font-size="15" font-style="italic" font-weight="700">y</text>';
    if (extra) s += extra(X, Y);
    shapes.forEach(function (sh) {
      s += '<polygon points="' + sh.pts.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" style="fill:color-mix(in srgb,' + sh.col + ' 25%,transparent);stroke:' + sh.col + '" stroke-width="2.5"' + (sh.dash ? ' stroke-dasharray="6 4"' : '') + '/>';
      sh.pts.forEach(function (p, k) {
        s += '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="4" style="fill:' + sh.col + '"/>';
        if (sh.labs) s += '<text x="' + (X(p[0]) + 7) + '" y="' + (Y(p[1]) - 7) + '" font-size="16" font-weight="700" style="fill:' + sh.col + '">' + sh.labs[k] + '</text>';
      });
    });
    return A.svg(W, W, s, shapes.map(function (sh) { return (sh.name || 'Shape') + ' at ' + sh.pts.map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }).join(', '); }).join('. '));
  }
  var MOVES = {
    tr: function (p, a, b) { return [p[0] + a, p[1] + b]; },
    rx: function (p) { return [p[0], -p[1]]; },
    ry: function (p) { return [-p[0], p[1]]; },
    r90cw: function (p) { return [p[1], -p[0]]; },
    r90ccw: function (p) { return [-p[1], p[0]]; },
    r180: function (p) { return [-p[0], -p[1]]; },
    dil: function (p, k) { return [cl(p[0] * k), cl(p[1] * k)]; }
  };
  var MNAME = { rx: 'reflection in the x-axis', ry: 'reflection in the y-axis', r90cw: 'rotation of 90&deg; clockwise about the origin', r90ccw: 'rotation of 90&deg; counterclockwise about the origin', r180: 'rotation of 180&deg; about the origin' };
  var MRULE = { rx: '(x, y) &rarr; (x, &minus;y)', ry: '(x, y) &rarr; (&minus;x, y)', r90cw: '(x, y) &rarr; (y, &minus;x)', r90ccw: '(x, y) &rarr; (&minus;y, x)', r180: '(x, y) &rarr; (&minus;x, &minus;y)' };
  var TRI = [[1, 1], [4, 1], [1, 3]];

  A.register('shapes-moves', {
    html:
'<section class="sec"><h2><span class="n">1</span>Prisms, pyramids and cylinders</h2>' +
'<p>A <b>prism</b> has two matching bases joined by rectangles. A <b>pyramid</b> has one base, and triangles that meet at a point. A <b>cylinder</b> has two circle bases joined by a curved surface. The base gives the name.</p>' +
'<div class="vrow">' + ['tri', 'rect', 'sqpyr', 'tripyr', 'cyl'].map(function (k) { return '<figure><figcaption>' + SOLIDS[k].name + '</figcaption>' + solid(k, 180).replace('width="180"', 'width="150"') + '</figure>'; }).join('') + '</div>' +
'<div class="vs"><div><b class="t">Prism</b><p>Same shape all the way through. Cut it anywhere parallel to the base and you get the base again.</p></div><div><b class="t">Pyramid</b><p>Gets smaller toward the top. All the side faces are triangles.</p></div></div>' +
'<p>A <b>plane of symmetry</b> cuts a solid into two mirror halves. A solid has <b>rotational symmetry</b> if you can turn it part of the way around and it looks the same. The <b>order</b> is how many times it looks the same in one full turn.</p>' +
'<div class="lab"><span class="lt">Try it: explore a solid</span>' +
'<div class="ctrl"><label for="slk">Solid<select id="slk">' + Object.keys(SOLIDS).map(function (k) { return '<option value="' + k + '"' + (k === 'sqpyr' ? ' selected' : '') + '>' + SOLIDS[k].name + '</option>'; }).join('') + '</select></label></div>' +
'<div class="row2"><div class="fig" id="slfig"></div><div class="out" id="slout"></div></div></div>' +
A.yt({ q: 'How many edges does a triangular prism have?', answer: 9, hint: '3 edges on each triangle, plus the edges that join them.', explain: '3 + 3 on the two triangles, plus 3 joining them: 9 edges.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Top, front and side views</h2>' +
'<p>Architects draw a building from different directions. A <b>view</b> is what you see looking straight at one side. You only see the outline, not depth.</p>' +
'<div class="lab"><span class="lt">Try it: build with cubes</span>' +
'<p class="t2" style="margin:0 0 6px">Each square is a spot on the floor (the back row is at the top). Press a square to add a cube there, up to 3. A fourth press clears it.</p>' +
'<div class="vbuild" id="vbgrid"></div>' +
'<div class="row2"><div class="fig" id="vbiso"></div><div class="vrow" id="vbviews"></div></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>The <b>front view</b> shows the tallest stack in each column, seen from the front. The <b>right side view</b> shows the tallest stack in each row, seen from the right. The <b>top view</b> shows which floor squares are covered.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>A view loses one direction. Many different buildings can have the same front view, so you need two or three views to know the shape.</p></div>' +
A.yt({ q: 'A building has 2 rows. The back row has stacks of 1, 1, 3. The front row has stacks of 2, 1, 0. How tall is the tallest column in the front view, and which column is it? (Type its height.)', answer: 3, hint: 'In each column, take the taller of the two stacks.', explain: 'Columns: max(1, 2) = 2, max(1, 1) = 1, max(3, 0) = 3. The front view is 2, 1, 3, so the tallest is 3, on the right.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>The Cartesian plane and translations</h2>' +
'<p>The <b>Cartesian plane</b> has an <i>x</i>-axis (across) and a <i>y</i>-axis (up and down). They cross at the <b>origin</b>, (0, 0). Negative numbers let us use all four <b>quadrants</b>. A point is written (<i>x</i>, <i>y</i>): across first, then up or down.</p>' +
'<p>A <b>translation</b> slides every point the same distance in the same direction. "Right 3, down 5" adds 3 to every <i>x</i> and subtracts 5 from every <i>y</i>.</p>' +
'<div class="fig">' + plane([{ pts: TRI, col: 'var(--sb)', labs: ['A', 'B', 'C'], name: 'Triangle ABC' }, { pts: TRI.map(function (p) { return MOVES.tr(p, 3, -5); }), col: 'var(--se)', labs: ["A'", "B'", "C'"], name: "Image A'B'C'" }], 8) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A(1, 1) moves right 3 and down 5 to A\'(4, &minus;4). The image is the same size and shape, and faces the same way.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up the order. (3, &minus;2) means 3 across and 2 down, not 3 up and 2 across.</p></div>' +
A.yt({ q: 'Point P(&minus;2, 5) is translated left 4 and down 6. Where does it land?', type: 'mc', options: ['(&minus;6, &minus;1)', '(2, &minus;1)', '(&minus;6, 11)', '(4, &minus;1)'], answer: 0, hint: 'Left changes <i>x</i>, down changes <i>y</i>.', explain: '&minus;2 &minus; 4 = &minus;6 and 5 &minus; 6 = &minus;1, so (&minus;6, &minus;1).' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Reflections and rotations</h2>' +
'<p>A <b>reflection</b> flips a shape over a line, like a mirror. A <b>rotation</b> turns a shape around a point. In both, the image is the same size and shape, but it may face a different way.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Move</th><th>Rule</th></tr></thead><tbody>' + Object.keys(MNAME).map(function (k) { return '<tr><td class="l">' + MNAME[k].replace(/^./, function (c) { return c.toUpperCase(); }) + '</td><td class="math">' + MRULE[k] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: move the triangle</span>' +
'<div class="ctrl"><label for="mvk">Move<select id="mvk"><option value="tr">translation</option><option value="rx">reflect in the x-axis</option><option value="ry" selected>reflect in the y-axis</option><option value="r90cw">rotate 90&deg; clockwise</option><option value="r90ccw">rotate 90&deg; counterclockwise</option><option value="r180">rotate 180&deg;</option></select></label>' +
'<label for="mva">Slide across: <output id="mvao"></output><input type="range" id="mva" min="-6" max="6" value="2"></label><label for="mvb">Slide up: <output id="mvbo"></output><input type="range" id="mvb" min="-6" max="6" value="-3"></label></div>' +
'<div class="row2"><div class="fig" id="mvfig"></div><div class="out" id="mvout"></div></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Predict before you move. A reflection in the <i>y</i>-axis changes the sign of <i>x</i>, so the shape jumps to the other side, left or right. A 180&deg; rotation changes both signs, so the shape lands in the opposite quadrant.</p></div>' +
A.yt({ q: 'Point Q(3, &minus;2) is rotated 180&deg; about the origin. Where does it land?', type: 'mc', options: ['(&minus;3, 2)', '(3, 2)', '(&minus;2, 3)', '(&minus;3, &minus;2)'], answer: 0, hint: 'A 180&deg; rotation changes the sign of both coordinates.', explain: '(3, &minus;2) &rarr; (&minus;3, 2).' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Dilations and similar shapes</h2>' +
'<p>A <b>dilation</b> makes a shape bigger or smaller from a centre point. Every length is multiplied by the <b>scale factor</b>. With the centre at the origin, multiply both coordinates by the scale factor.</p>' +
'<div class="fig">' + plane([{ pts: [[1, 1], [3, 1], [1, 2]], col: 'var(--sb)', labs: ['A', 'B', 'C'], name: 'Triangle ABC' }, { pts: [[3, 3], [9, 3], [3, 6]], col: 'var(--se)', labs: ["A'", "B'", "C'"], name: "Image with scale factor 3" }], 10, function (X, Y) { return [[3, 3], [9, 3], [3, 6]].map(function (p) { return '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(p[0]) + '" y2="' + Y(p[1]) + '" style="stroke:var(--ink2)" stroke-dasharray="3 4"/>'; }).join(''); }) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Scale factor 3, centre (0, 0). B(3, 1) &rarr; B\'(9, 3). Side AB was 2 units, and A\'B\' is 6 units: 3 times as long. The dashed lines from the origin pass through each point and its image.</p></div>' +
'<p>The image is <b>similar</b> to the original: same shape, same angles, and every side in the same ratio. A scale factor greater than 1 enlarges. Between 0 and 1, it shrinks.</p>' +
'<div class="lab"><span class="lt">Try it: change the scale factor</span>' +
'<div class="ctrl"><label for="dlk">Scale factor<select id="dlk"><option>0.5</option><option>1</option><option>1.5</option><option selected>2</option><option>3</option></select></label></div>' +
'<div class="row2"><div class="fig" id="dlfig"></div><div class="out" id="dlout"></div></div></div>' +
A.yt({ q: 'A rectangle 4 cm by 6 cm is dilated by a scale factor of 2.5. How long is the longer side of the image?', answer: 15, unit: 'cm', hint: 'Multiply the 6 cm side by 2.5.', explain: '6 &times; 2.5 = 15 cm. (The other side is 4 &times; 2.5 = 10 cm.)' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.bind(root, ['slk'], function () {
        var k = $('#slk', root).value, S = SOLIDS[k];
        $('#slfig', root).innerHTML = solid(k);
        $('#slout', root).innerHTML = '<div class="tbl"><table><tbody><tr><td class="l">Base</td><td class="l">' + S.base + '</td></tr><tr><td class="l">Faces</td><td class="l">' + S.F + '</td></tr><tr><td class="l">Edges</td><td class="l">' + S.E + '</td></tr><tr><td class="l">Vertices (corners)</td><td class="l">' + S.V + '</td></tr>' +
          '<tr><td class="l">Planes of symmetry</td><td class="l">' + S.planes + '</td></tr><tr><td class="l">Rotational symmetry</td><td class="l">' + S.rot + '</td></tr></tbody></table></div>' +
          (typeof S.F === 'number' ? '<p class="t2">Check: faces + vertices &minus; edges = ' + S.F + ' + ' + S.V + ' &minus; ' + S.E + ' = 2. This works for every prism and pyramid.</p>' : '');
      });
      var map = [[1, 2, 3], [0, 1, 2], [1, 0, 1]];
      function vb() {
        $('#vbgrid', root).innerHTML = map.map(function (row, r) { return row.map(function (h, c) { return '<button type="button" class="vcell" data-r="' + r + '" data-c="' + c + '" aria-label="Row ' + (r + 1) + ' from the back, column ' + (c + 1) + ': ' + h + ' cubes">' + h + '</button>'; }).join(''); }).join('');
        A.$$('.vcell', root).forEach(function (b) { b.addEventListener('click', function () { var r = +b.getAttribute('data-r'), c = +b.getAttribute('data-c'); map[r][c] = (map[r][c] + 1) % 4; vb(); var nb = A.$('.vcell[data-r="' + r + '"][data-c="' + c + '"]', root); if (nb) nb.focus(); }); });
        var v = views(map);
        $('#vbiso', root).innerHTML = iso(map);
        $('#vbviews', root).innerHTML = '<figure><figcaption>Front view</figcaption>' + view(v.front, 'Front view') + '</figure><figure><figcaption>Right side view</figcaption>' + view(v.side, 'Right side view') + '</figure><figure><figcaption>Top view</figcaption>' + topView(map) + '</figure>';
      }
      vb();
      A.bind(root, ['mvk', 'mva', 'mvb'], function () {
        var k = $('#mvk', root).value, a = +$('#mva', root).value, b = +$('#mvb', root).value, img = TRI.map(function (p) { return MOVES[k](p, a, b); });
        $('#mvao', root).innerHTML = sg(a); $('#mvbo', root).innerHTML = sg(b);
        $('#mva', root).disabled = $('#mvb', root).disabled = k !== 'tr';
        $('#mvfig', root).innerHTML = plane([{ pts: TRI, col: 'var(--sb)', labs: ['A', 'B', 'C'] }, { pts: img, col: 'var(--se)', labs: ["A'", "B'", "C'"] }], 8, k === 'rx' || k === 'ry' ? function (X, Y) { return k === 'rx' ? '<line x1="' + X(-8) + '" y1="' + Y(0) + '" x2="' + X(8) + '" y2="' + Y(0) + '" style="stroke:var(--se)" stroke-width="4" opacity=".6"/>' : '<line x1="' + X(0) + '" y1="' + Y(-8) + '" x2="' + X(0) + '" y2="' + Y(8) + '" style="stroke:var(--se)" stroke-width="4" opacity=".6"/>'; } : null);
        $('#mvout', root).innerHTML = '<p><b>' + (k === 'tr' ? 'Translation ' + (a ? (a > 0 ? 'right ' + a : 'left ' + (-a)) : '') + (a && b ? ', ' : '') + (b ? (b > 0 ? 'up ' + b : 'down ' + (-b)) : '') : MNAME[k].replace(/^./, function (c) { return c.toUpperCase(); })) + '</b></p>' +
          '<p class="math">Rule: ' + (k === 'tr' ? '(x, y) &rarr; (x ' + (a < 0 ? '&minus; ' + (-a) : '+ ' + a) + ', y ' + (b < 0 ? '&minus; ' + (-b) : '+ ' + b) + ')' : MRULE[k]) + '</p>' +
          '<div class="tbl"><table><thead><tr><th>Point</th><th>Image</th></tr></thead><tbody>' + TRI.map(function (p, i) { return '<tr><td>' + 'ABC'[i] + pt(p) + '</td><td>' + 'ABC'[i] + "'" + pt(img[i]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      });
      A.bind(root, ['dlk'], function () {
        var k = parseFloat($('#dlk', root).value), base = [[2, 2], [4, 2], [2, 6]], img = base.map(function (p) { return MOVES.dil(p, k); });
        $('#dlfig', root).innerHTML = plane([{ pts: base, col: 'var(--sb)', labs: ['A', 'B', 'C'] }, { pts: img, col: 'var(--se)', labs: ["A'", "B'", "C'"], dash: k === 1 }], 12, function (X, Y) { return img.map(function (p) { return '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(p[0]) + '" y2="' + Y(p[1]) + '" style="stroke:var(--ink2)" stroke-dasharray="3 4"/>'; }).join(''); });
        $('#dlout', root).innerHTML = '<p class="big2">Scale factor ' + k + '</p><p>' + (k > 1 ? 'Enlargement.' : k < 1 ? 'Reduction.' : 'Same size: the image sits on top of the original.') + '</p>' +
          '<div class="tbl"><table><thead><tr><th>Point</th><th>Image</th></tr></thead><tbody>' + base.map(function (p, i) { return '<tr><td>' + 'ABC'[i] + pt(p) + '</td><td>' + 'ABC'[i] + "'" + pt(img[i]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
          '<p>Side AB = 2 units, so A\'B\' = 2 &times; ' + k + ' = ' + cl(2 * k) + ' units. Side AC = 4 units, so A\'C\' = ' + cl(4 * k) + ' units.</p>';
      });
    },

    quiz: [
      { q: 'Which solid has 5 faces, 8 edges and 5 vertices?', type: 'mc', options: ['Triangular prism', 'Square-based pyramid', 'Cube', 'Triangular pyramid'], answer: 1, hint: 'Count the base plus the triangles.', explain: 'A square-based pyramid: 1 square + 4 triangles = 5 faces, 4 + 4 = 8 edges, 4 corners + 1 top = 5 vertices.' },
      { q: 'What is the order of rotational symmetry of a square-based pyramid, turning about the axis through its top point?', type: 'num', answer: 4, fig: solid('sqpyr'), hint: 'How many times does the square base look the same in one full turn?', explain: 'Every quarter turn looks the same: order 4.' },
      { q: 'Which is the front view of this building?', type: 'mc', fig: iso([[2, 1], [1, 3]]), options: [view([2, 3], 'A'), view([1, 3], 'B'), view([2, 1], 'C')], answer: 0, hint: 'For each column, take the tallest stack.', explain: 'Left column: max(2, 1) = 2. Right column: max(1, 3) = 3. Front view: 2, 3.' },
      { q: 'Triangle ABC has A(2, &minus;1). After a translation of left 5 and up 3, where is A\'?', type: 'mc', options: ['(&minus;3, 2)', '(7, 2)', '(&minus;3, &minus;4)', '(5, 2)'], answer: 0, hint: 'Subtract 5 from <i>x</i> and add 3 to <i>y</i>.', explain: '2 &minus; 5 = &minus;3 and &minus;1 + 3 = 2: (&minus;3, 2).' },
      { q: 'Point (4, 3) is reflected in the <i>x</i>-axis. What is the image?', type: 'mc', options: ['(&minus;4, 3)', '(4, &minus;3)', '(&minus;4, &minus;3)', '(3, 4)'], answer: 1, hint: 'Reflecting in the <i>x</i>-axis flips up and down.', explain: '(x, y) &rarr; (x, &minus;y): (4, &minus;3).' },
      { q: 'Point (2, 5) is rotated 90&deg; clockwise about the origin. What is the image?', type: 'mc', options: ['(5, &minus;2)', '(&minus;5, 2)', '(&minus;2, &minus;5)', '(2, &minus;5)'], answer: 0, fig: plane([{ pts: [[0, 0], [2, 5]], col: 'var(--sb)', labs: ['O', 'P'] }], 6), hint: 'The rule for 90&deg; clockwise is (x, y) &rarr; (y, &minus;x).', explain: '(2, 5) &rarr; (5, &minus;2). It moves from quadrant 1 to quadrant 4.' },
      { q: 'A triangle with vertex (6, 4) is dilated by a scale factor of 0.5 about the origin. Where does that vertex go?', type: 'mc', options: ['(3, 2)', '(12, 8)', '(5.5, 3.5)', '(6, 2)'], answer: 0, hint: 'Multiply both coordinates by 0.5.', explain: '6 &times; 0.5 = 3 and 4 &times; 0.5 = 2: (3, 2).' }
    ],

    practice: [
      { id: 'sm-solid', name: 'Properties of solids', code: 'E1.1', gen: function (lv) {
        var keys = ['rect', 'cube', 'tri', 'sqpyr', 'tripyr'], k = R.pick(keys), S = SOLIDS[k];
        if (lv === 3) {
          var n = R.int(5, 8), prism = R.int(0, 1), names = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' }, what = R.pick(['faces', 'edges', 'vertices']);
          var val = prism ? { faces: n + 2, edges: 3 * n, vertices: 2 * n }[what] : { faces: n + 1, edges: 2 * n, vertices: n + 1 }[what];
          var why = prism ? { faces: '2 bases + ' + n + ' rectangles = ' + (n + 2), edges: n + ' on each base + ' + n + ' joining them = ' + 3 * n, vertices: n + ' on each base = ' + 2 * n }[what]
            : { faces: '1 base + ' + n + ' triangles = ' + (n + 1), edges: n + ' around the base + ' + n + ' up to the top = ' + 2 * n, vertices: n + ' around the base + 1 at the top = ' + (n + 1) }[what];
          return { q: 'How many ' + what + ' does a ' + names[n] + '-based ' + (prism ? 'prism' : 'pyramid') + ' have? (A ' + names[n] + ' has ' + n + ' sides.)', type: 'num', answer: val,
            hint: prism ? 'A prism has two bases joined by rectangles.' : 'A pyramid has one base and triangles that meet at the top.', steps: ['Picture the ' + (prism ? 'two ' + names[n] + 's' : names[n] + ' base') + '.', why + '.'], explain: 'It has ' + val + ' ' + what + '.' };
        }
        if (lv === 2) {
          var what2 = R.pick(['F', 'E', 'V']), nm = { F: 'faces', E: 'edges', V: 'vertices' }[what2];
          return { q: 'How many ' + nm + ' does a ' + S.name.toLowerCase() + ' have?', type: 'num', answer: S[what2], hint: 'Count the base, then the sides.', steps: ['Look at the drawing. Dashed lines are hidden edges.', 'A ' + S.name.toLowerCase() + ' has ' + S.F + ' faces, ' + S.E + ' edges and ' + S.V + ' vertices.'], fig: solid(k), explain: 'A ' + S.name.toLowerCase() + ' has ' + S[what2] + ' ' + nm + '.' };
        }
        var o = R.mc(S.name, R.shuffle(keys.filter(function (x) { return x !== k; })).slice(0, 3).map(function (x) { return SOLIDS[x].name; }));
        return { q: 'What is this solid called?', type: 'mc', options: o.options, answer: o.answer, fig: solid(k),
          hint: 'Is it the same all the way through (prism), or does it come to a point (pyramid)? What shape is the base?', steps: ['It ' + (/pyr/.test(k) ? 'comes to a point, so it is a pyramid' : 'is the same all the way through, so it is a prism') + '.', 'The base is a ' + S.base + '.', 'It is a ' + S.name.toLowerCase() + '.'], explain: 'This is a ' + S.name.toLowerCase() + '.' };
      } },
      { id: 'sm-view', name: 'Views of a building', code: 'E1.2', gen: function (lv) {
        var rows = lv === 1 ? 2 : 3, cols = lv === 1 ? 2 : 3, map, v;
        do { map = []; for (var r = 0; r < rows; r++) { var row = []; for (var c = 0; c < cols; c++) row.push(R.int(0, 3)); map.push(row); } v = views(map); }
        while (v.front.indexOf(0) >= 0 || v.side.indexOf(0) >= 0 || v.front.join() === v.side.join() || v.front.join() === v.front.slice().reverse().join());
        var which = lv === 3 ? R.pick(['front', 'side']) : 'front', right = which === 'front' ? v.front : v.side;
        var wrongs = [which === 'front' ? v.side : v.front, right.slice().reverse(), right.map(function (h, i) { return i === 0 ? Math.max(1, (h % 3) + 1) : h; })].filter(function (w) { return w.join() !== right.join() && w.length === right.length; });
        var seen = {}, opts = [];
        wrongs.forEach(function (w) { if (!seen[w.join()]) { seen[w.join()] = 1; opts.push(view(w, 'View')); } });
        var o = R.mc(view(right, 'View'), opts);
        return { q: 'Which is the ' + (which === 'front' ? 'front' : 'right side') + ' view of this building?', type: 'mc', fig: iso(map), options: o.options, answer: o.answer,
          hint: which === 'front' ? 'Look from the FRONT label. For each column, the tallest stack is what you see.' : 'Look from the RIGHT label. For each row, the tallest stack is what you see. The front row is on the left.',
          steps: [which === 'front' ? 'Look at each column from left to right.' : 'Look at each row, from the front row to the back row.', 'The tallest stacks are ' + right.join(', ') + '.', 'Pick the view with columns of ' + right.join(', ') + '.'],
          explain: 'The ' + (which === 'front' ? 'front' : 'right side') + ' view has columns ' + right.join(', ') + ' cubes tall.' };
      } },
      { id: 'sm-translate', name: 'Translations', code: 'E1.4', gen: function (lv) {
        var p = [R.int(-6, 6), R.int(-6, 6)], a = R.int(-6, 6), b = R.int(-6, 6);
        if (!a) a = 3; if (!b) b = -2;
        var img = MOVES.tr(p, a, b), dir = (a > 0 ? 'right ' + a : 'left ' + (-a)) + ' and ' + (b > 0 ? 'up ' + b : 'down ' + (-b));
        if (lv === 3) {
          var ot = R.mc(dir, [(a > 0 ? 'left ' + a : 'right ' + (-a)) + ' and ' + (b > 0 ? 'up ' + b : 'down ' + (-b)), (b > 0 ? 'right ' + b : 'left ' + (-b)) + ' and ' + (a > 0 ? 'up ' + a : 'down ' + (-a)), (a > 0 ? 'right ' + a : 'left ' + (-a)) + ' and ' + (b > 0 ? 'down ' + b : 'up ' + (-b))]);
          return { q: 'Point P' + pt(p) + ' is translated to P\'' + pt(img) + '. Describe the translation.', type: 'mc', options: ot.options, answer: ot.answer,
            hint: 'Subtract: new <i>x</i> &minus; old <i>x</i>, and new <i>y</i> &minus; old <i>y</i>.', steps: ['Change in <i>x</i>: ' + sg(img[0]) + ' &minus; ' + (p[0] < 0 ? '(' + sg(p[0]) + ')' : sg(p[0])) + ' = ' + sg(a) + '.', 'Change in <i>y</i>: ' + sg(img[1]) + ' &minus; ' + (p[1] < 0 ? '(' + sg(p[1]) + ')' : sg(p[1])) + ' = ' + sg(b) + '.', 'So the translation is ' + dir + '.'], explain: 'It moved ' + dir + '.' };
        }
        var o = R.mc(pt(img), [pt([p[0] - a, p[1] - b]), pt([p[0] + b, p[1] + a]), pt([p[0] + a, p[1] - b])]);
        return { q: 'Point P' + pt(p) + ' is translated ' + dir + '. Where does it land?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? plane([{ pts: [p, p], col: 'var(--sb)', labs: ['P', ''] }], 8) : '',
          hint: 'Right and left change <i>x</i>. Up and down change <i>y</i>.', steps: ['<i>x</i>: ' + sg(p[0]) + (a > 0 ? ' + ' + a : ' &minus; ' + (-a)) + ' = ' + sg(img[0]) + '.', '<i>y</i>: ' + sg(p[1]) + (b > 0 ? ' + ' + b : ' &minus; ' + (-b)) + ' = ' + sg(img[1]) + '.', 'P\' is ' + pt(img) + '.'], explain: 'P\' is ' + pt(img) + '.' };
      } },
      { id: 'sm-reflect', name: 'Reflections', code: 'E1.4', gen: function (lv) {
        var p = [R.int(1, 7) * (R.int(0, 1) ? 1 : -1), R.int(1, 7) * (R.int(0, 1) ? 1 : -1)], k = R.pick(['rx', 'ry']), img = MOVES[k](p);
        if (Math.abs(p[0]) === Math.abs(p[1])) p[1] = p[1] > 0 ? p[1] + 1 : p[1] - 1, img = MOVES[k](p);
        var o = R.mc(pt(img), [pt(MOVES[k === 'rx' ? 'ry' : 'rx'](p)), pt(MOVES.r180(p)), pt([p[1], p[0]])].filter(function (x) { return x !== pt(img); }));
        if (lv === 3) {
          var q = [p, [p[0] + 2 * Math.sign(p[0] || 1), p[1]], [p[0], p[1] + 3 * Math.sign(p[1] || 1)]], imgs = q.map(function (x) { return MOVES[k](x); });
          var orf = R.mc(pt(imgs[1]), [pt(MOVES[k === 'rx' ? 'ry' : 'rx'](q[1])), pt(MOVES.r180(q[1])), pt([q[1][1], q[1][0]])].filter(function (x) { return x !== pt(imgs[1]); }));
          return { q: 'Triangle ABC has A' + pt(q[0]) + ', B' + pt(q[1]) + ', C' + pt(q[2]) + '. It is reflected in the ' + (k === 'rx' ? '<i>x</i>' : '<i>y</i>') + '-axis. Where is B\'?', type: 'mc', options: orf.options, answer: orf.answer,
            hint: 'Use the rule ' + MRULE[k] + ' on B.', steps: ['The rule is ' + MRULE[k] + '.', 'B' + pt(q[1]) + ' becomes B\'' + pt(imgs[1]) + '.'], explain: 'B\' is ' + pt(imgs[1]) + '.' };
        }
        return { q: 'Point P' + pt(p) + ' is reflected in the ' + (k === 'rx' ? '<i>x</i>' : '<i>y</i>') + '-axis. Where is P\'?', type: 'mc', options: o.options, answer: o.answer,
          fig: lv === 1 ? plane([{ pts: [p, p], col: 'var(--sb)', labs: ['P', ''] }], 8, function (X, Y) { return k === 'rx' ? '<line x1="' + X(-8) + '" y1="' + Y(0) + '" x2="' + X(8) + '" y2="' + Y(0) + '" style="stroke:var(--se)" stroke-width="4" opacity=".6"/>' : '<line x1="' + X(0) + '" y1="' + Y(-8) + '" x2="' + X(0) + '" y2="' + Y(8) + '" style="stroke:var(--se)" stroke-width="4" opacity=".6"/>'; }) : '',
          hint: k === 'rx' ? 'The <i>x</i>-axis is the mirror. The point flips up or down, so <i>y</i> changes sign.' : 'The <i>y</i>-axis is the mirror. The point flips left or right, so <i>x</i> changes sign.',
          steps: ['The rule is ' + MRULE[k] + '.', 'P' + pt(p) + ' &rarr; P\'' + pt(img) + '.'], explain: 'P\' is ' + pt(img) + ', the same distance from the axis on the other side.' };
      } },
      { id: 'sm-rotate', name: 'Rotations', code: 'E1.4', gen: function (lv) {
        var p = [R.int(1, 7) * (R.int(0, 1) ? 1 : -1), R.int(1, 7) * (R.int(0, 1) ? 1 : -1)], k = lv === 1 ? 'r180' : R.pick(['r90cw', 'r90ccw', 'r180']);
        if (Math.abs(p[0]) === Math.abs(p[1])) p[0] += p[0] > 0 ? 1 : -1;
        var img = MOVES[k](p), others = ['r90cw', 'r90ccw', 'r180', 'rx', 'ry'].filter(function (x) { return x !== k; }).map(function (x) { return pt(MOVES[x](p)); });
        var o = R.mc(pt(img), others.filter(function (x) { return x !== pt(img); }));
        return { q: 'Point P' + pt(p) + ' is given a ' + MNAME[k] + '. Where is P\'?', type: 'mc', options: o.options, answer: o.answer,
          fig: lv < 3 ? plane([{ pts: [[0, 0], p], col: 'var(--sb)', labs: ['O', 'P'] }], 8) : '',
          hint: 'Use the rule: ' + MRULE[k] + '. Or turn the page and watch where P goes.', steps: ['The rule is ' + MRULE[k] + '.', 'Here <i>x</i> = ' + sg(p[0]) + ' and <i>y</i> = ' + sg(p[1]) + '.', 'P\' = ' + pt(img) + '.'], explain: 'P\' is ' + pt(img) + '.' };
      } },
      { id: 'sm-dilate', name: 'Dilations', code: 'E1.3', gen: function (lv) {
        var k = lv === 1 ? R.pick([2, 3]) : R.pick([0.5, 1.5, 2, 2.5, 3, 4]), p = [R.int(-6, 6), R.int(-6, 6)];
        if (k === 0.5 || k === 1.5 || k === 2.5) p = [p[0] * 2 || 2, p[1] * 2 || -4];
        if (lv === 3) {
          var s1 = R.int(2, 9), s2 = s1 * k;
          if (R.int(0, 1)) return { q: 'A side of a shape is ' + s1 + ' cm long. After a dilation, the matching side is ' + cl(s2) + ' cm. What is the scale factor?', type: 'num', answer: k,
            hint: 'Image length &divide; original length.', steps: ['Scale factor = image &divide; original.', cl(s2) + ' &divide; ' + s1 + ' = ' + k + '.'], explain: 'The scale factor is ' + k + '.' };
          return { q: 'A photo is ' + s1 + ' cm wide. It is enlarged with a scale factor of ' + k + '. How wide is the enlargement?', type: 'num', answer: cl(s2), unit: 'cm',
            hint: 'Multiply the width by ' + k + '.', steps: ['Every length is multiplied by ' + k + '.', s1 + ' &times; ' + k + ' = ' + cl(s2) + ' cm.'], explain: 'The enlargement is ' + cl(s2) + ' cm wide.' };
        }
        var img = MOVES.dil(p, k), o = R.mc(pt(img), [pt([p[0] + k, p[1] + k]), pt([cl(p[0] / k), cl(p[1] / k)]), pt([cl(p[0] * k), p[1]])].filter(function (x) { return x !== pt(img) && !/\.\d{3}/.test(x); }));
        return { q: 'Point P' + pt(p) + ' is dilated by a scale factor of ' + k + ' about the origin. Where is P\'?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Multiply both coordinates by ' + k + '.', steps: ['<i>x</i>: ' + sg(p[0]) + ' &times; ' + k + ' = ' + sg(img[0]) + '.', '<i>y</i>: ' + sg(p[1]) + ' &times; ' + k + ' = ' + sg(img[1]) + '.', 'P\' = ' + pt(img) + '.'], explain: 'P\' is ' + pt(img) + '.' };
      } }
    ]
  });
})();
