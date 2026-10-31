(function () {
  var A = Atlas, R = A.R, N = A.neg;
  var D = '&#176;';
  function rad(d) { return d * Math.PI / 180; }
  function arc(cx, cy, r, a1, a2, col, lab, lr) {
    /* angles in degrees, measured counter-clockwise from the positive x direction (SVG y flipped) */
    var x1 = cx + r * Math.cos(rad(a1)), y1 = cy - r * Math.sin(rad(a1)), x2 = cx + r * Math.cos(rad(a2)), y2 = cy - r * Math.sin(rad(a2));
    var big = ((a2 - a1 + 360) % 360) > 180 ? 1 : 0, mid = a1 + ((a2 - a1 + 360) % 360) / 2, lrr = lr || r + 16;
    return '<path d="M' + cx + ' ' + cy + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + big + ' 0 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z" style="fill:color-mix(in srgb,' + col + ' 30%,transparent);stroke:' + col + '" stroke-width="1.5"/>' +
      (lab ? '<text x="' + (cx + lrr * Math.cos(rad(mid))).toFixed(1) + '" y="' + (cy - lrr * Math.sin(rad(mid)) + 6).toFixed(1) + '" text-anchor="middle" font-size="17" class="tb">' + lab + '</text>' : '');
  }
  /* two parallel lines cut by a transversal at angle t (degrees). marks: {k: label} for the 8 angles, colour by group */
  function parallel(t, show, hlPair) {
    var s = '', cy1 = 70, cy2 = 170, dx = 100 / Math.tan(rad(t)), cx1 = 200 - dx / 2, cx2 = 200 + dx / 2;
    var ang = { 1: [0, t], 2: [t, 180], 3: [180, 180 + t], 4: [180 + t, 360] };
    s += '<line x1="20" y1="' + cy1 + '" x2="380" y2="' + cy1 + '" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="20" y1="' + cy2 + '" x2="380" y2="' + cy2 + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<path d="M352 ' + (cy1 - 6) + ' l10 6 l-10 6 M352 ' + (cy2 - 6) + ' l10 6 l-10 6" fill="none" style="stroke:var(--ink)" stroke-width="2"/>';
    var L = 160, ux = Math.cos(rad(t)), uy = Math.sin(rad(t));
    s += '<line x1="' + (200 - ux * L * 1.15) + '" y1="' + (120 + uy * L * 1.15) + '" x2="' + (200 + ux * L * 1.15) + '" y2="' + (120 - uy * L * 1.15) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    var acute = t <= 90 ? t : 180 - t, obt = 180 - acute;
    var vals = { 1: t, 2: 180 - t, 3: t, 4: 180 - t, 5: t, 6: 180 - t, 7: t, 8: 180 - t };
    [[cx1, cy1, 0], [cx2, cy2, 4]].forEach(function (c) {
      [1, 2, 3, 4].forEach(function (k) {
        var id = k + c[2], a = ang[k], isA = vals[id] === Math.min(t, 180 - t), col = isA ? 'var(--strand)' : 'var(--accent)';
        var on = !hlPair || hlPair.indexOf(id) >= 0;
        if (on) s += arc(c[0], c[1], 22, a[0], a[1], col, show ? (show === 'num' ? String(id) : vals[id] + D) : '', 40);
      });
    });
    return A.svg(400, 240, s, 'Two parallel lines cut by a transversal at ' + t + ' degrees. The acute angles are all ' + Math.min(t, 180 - t) + ' degrees and the obtuse angles are all ' + Math.max(t, 180 - t) + ' degrees.');
  }
  /* regular polygon with diagonals from one vertex */
  function polygon(n, tri) {
    var s = '', cx = 130, cy = 120, r = 100, P = [];
    for (var i = 0; i < n; i++) { var a = -90 + 360 * i / n + (n % 2 ? 0 : 180 / n); P.push([cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))]); }
    if (tri) for (var k = 1; k < n - 1; k++) s += '<polygon points="' + [P[0], P[k], P[k + 1]].map(function (p) { return p.join(','); }).join(' ') + '" style="fill:color-mix(in srgb,var(--se) ' + (k % 2 ? 22 : 10) + '%,var(--card));stroke:var(--se)" stroke-width="1" stroke-dasharray="4 3"/>';
    s += '<polygon points="' + P.map(function (p) { return p.map(function (v) { return v.toFixed(1); }).join(','); }).join(' ') + '" fill="none" style="stroke:var(--ink)" stroke-width="2.5"/>';
    var sum = (n - 2) * 180, each = sum / n;
    s += '<text x="250" y="70" font-size="17">' + n + ' sides</text><text x="250" y="98" font-size="17">' + (n - 2) + ' triangles</text><text x="250" y="126" font-size="17" class="tb">sum = ' + A.fmt(sum) + D + '</text><text x="250" y="154" font-size="17">each = ' + (Math.round(each * 100) / 100) + D + '</text>';
    return A.svg(400, 236, s, 'A regular polygon with ' + n + ' sides, split into ' + (n - 2) + ' triangles from one corner. The angles add to ' + sum + ' degrees, so each angle is ' + (Math.round(each * 100) / 100) + ' degrees.');
  }
  /* coordinate plane with shapes [{pts, col, lab, dash}] */
  function plane(shapes, lim) {
    lim = lim || 8;
    var S = 360, x0 = 20, y0 = 20, u = S / (2 * lim), s = '';
    function X(v) { return x0 + (v + lim) * u; } function Y(v) { return y0 + (lim - v) * u; }
    for (var v = -lim; v <= lim; v++) {
      s += '<line x1="' + X(v) + '" y1="' + Y(-lim) + '" x2="' + X(v) + '" y2="' + Y(lim) + '" style="stroke:var(--line)" stroke-width="' + (v ? 1 : 0) + '"/><line x1="' + X(-lim) + '" y1="' + Y(v) + '" x2="' + X(lim) + '" y2="' + Y(v) + '" style="stroke:var(--line)" stroke-width="' + (v ? 1 : 0) + '"/>';
      if (v && v % 2 === 0) s += '<text x="' + X(v) + '" y="' + (Y(0) + 17) + '" text-anchor="middle" font-size="14" class="t2">' + (v < 0 ? '−' + -v : v) + '</text><text x="' + (X(0) - 5) + '" y="' + (Y(v) + 5) + '" text-anchor="end" font-size="14" class="t2">' + (v < 0 ? '−' + -v : v) + '</text>';
    }
    s += '<line x1="' + X(-lim) + '" y1="' + Y(0) + '" x2="' + X(lim) + '" y2="' + Y(0) + '" style="stroke:var(--ink)" stroke-width="1.8"/><line x1="' + X(0) + '" y1="' + Y(-lim) + '" x2="' + X(0) + '" y2="' + Y(lim) + '" style="stroke:var(--ink)" stroke-width="1.8"/>';
    s += '<text x="' + (X(lim) - 4) + '" y="' + (Y(0) - 8) + '" text-anchor="end" font-size="16" class="tb">x</text><text x="' + (X(0) + 8) + '" y="' + (Y(lim) + 14) + '" font-size="16" class="tb">y</text>';
    shapes.forEach(function (sh) {
      s += '<polygon points="' + sh.pts.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" style="fill:color-mix(in srgb,' + sh.col + ' 25%,transparent);stroke:' + sh.col + '" stroke-width="2.5"' + (sh.dash ? ' stroke-dasharray="6 4"' : '') + '/>';
      sh.pts.forEach(function (p, i) {
        s += '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="4" style="fill:' + sh.col + '"/>';
        if (sh.lab) s += '<text x="' + (X(p[0]) + 7) + '" y="' + (Y(p[1]) - 7) + '" font-size="16" class="tb" style="fill:' + sh.col + '">' + sh.lab.charAt(i) + (sh.prime ? '′' : '') + '</text>';
      });
    });
    return A.svg(400, 400, s, 'Coordinate plane. ' + shapes.map(function (sh) { return (sh.name || 'Shape') + ' at ' + sh.pts.map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }).join(', '); }).join('. ') + '.');
  }
  function tx(type, k, p) {
    var x = p[0], y = p[1];
    if (type === 'tr') return [x + k[0], y + k[1]];
    if (type === 'rx') return [x, -y];
    if (type === 'ry') return [-x, y];
    if (type === 'r90') return [-y, x];
    if (type === 'r180') return [-x, -y];
    if (type === 'r270') return [y, -x];
    if (type === 'di') return [x * k, y * k];
  }
  var TNAME = { tr: 'translation', rx: 'reflection in the x-axis', ry: 'reflection in the y-axis', r90: 'rotation 90' + D + ' counter-clockwise about the origin', r180: 'rotation 180' + D + ' about the origin', r270: 'rotation 90' + D + ' clockwise about the origin', di: 'dilation about the origin' };
  var TRULE = { tr: '(x, y) &rarr; (x + a, y + b)', rx: '(x, y) &rarr; (x, &minus;y)', ry: '(x, y) &rarr; (&minus;x, y)', r90: '(x, y) &rarr; (&minus;y, x)', r180: '(x, y) &rarr; (&minus;x, &minus;y)', r270: '(x, y) &rarr; (y, &minus;x)', di: '(x, y) &rarr; (kx, ky)' };
  function pt(p) { return '(' + N(p[0]) + ', ' + N(p[1]) + ')'; }

  /* tessellations: hexagons, and pentagons leaving a gap */
  function tess() {
    var s = '', r = 22, h = r * Math.sqrt(3);
    for (var row = 0; row < 4; row++) for (var col = 0; col < 5; col++) {
      var cx = 20 + col * 1.5 * r, cy = 22 + row * h + (col % 2 ? h / 2 : 0), P = [];
      for (var i = 0; i < 6; i++) P.push((cx + r * Math.cos(rad(60 * i))).toFixed(1) + ',' + (cy + r * Math.sin(rad(60 * i))).toFixed(1));
      s += '<polygon points="' + P.join(' ') + '" style="fill:color-mix(in srgb,var(--se) ' + ((row + col) % 3 * 15 + 15) + '%,var(--card));stroke:var(--ink)" stroke-width="1.2"/>';
    }
    s += '<text x="82" y="186" text-anchor="middle" font-size="16" class="tb">hexagons</text><text x="82" y="206" text-anchor="middle" font-size="15">3 &#215; 120' + D + ' = 360' + D + '</text>';
    /* three pentagons around a point leave a gap */
    var cx2 = 300, cy2 = 90, R5 = 38;
    for (var k = 0; k < 3; k++) {
      var rot = k * 108, P2 = [], c = [cx2 + R5 * 0.81 * Math.cos(rad(rot + 54 - 90)) * 1.0, 0];
      /* each pentagon has one vertex at the point; build it by walking edges */
      var a0 = rot - 90, px = cx2, py = cy2, pts = [[px, py]], dir = a0 - 54;
      for (var e = 0; e < 4; e++) { px += 40 * Math.cos(rad(dir)); py += 40 * Math.sin(rad(dir)); pts.push([px, py]); dir += 72; }
      s += '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" style="fill:color-mix(in srgb,var(--accent) ' + (15 + k * 12) + '%,var(--card));stroke:var(--ink)" stroke-width="1.2"/>';
    }
    s += '<circle cx="' + cx2 + '" cy="' + cy2 + '" r="4" style="fill:var(--bad)"/><text x="300" y="186" text-anchor="middle" font-size="16" class="tb">pentagons</text><text x="300" y="206" text-anchor="middle" font-size="15">3 &#215; 108' + D + ' = 324' + D + '</text><text x="300" y="226" text-anchor="middle" font-size="15" style="fill:var(--bad)">a 36' + D + ' gap is left</text>';
    return A.svg(400, 234, s, 'Left: regular hexagons tile with no gaps because three angles of 120 degrees make 360 degrees. Right: three regular pentagons around a point make only 324 degrees, leaving a 36 degree gap.');
  }
  /* an L-shaped block structure and its three views */
  function views() {
    var s = '', u = 26, ox = 70, oy = 150, k = 0.5;
    /* cubes: [x, y, z] with x right, y back, z up */
    var cubes = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 0, 1]];
    cubes.sort(function (a, b) { return (b[1] - a[1]) || (a[2] - b[2]) || (a[0] - b[0]); });
    cubes.forEach(function (c) {
      var x = ox + c[0] * u + c[1] * u * k, y = oy - c[2] * u - c[1] * u * k;
      s += '<polygon points="' + [x, y, x + u, y, x + u, y - u, x, y - u].join(',') + '" style="fill:color-mix(in srgb,var(--se) 45%,var(--card));stroke:var(--ink)" stroke-width="1.2"/>';
      s += '<polygon points="' + [x, y - u, x + u, y - u, x + u + u * k, y - u - u * k, x + u * k, y - u - u * k].join(',') + '" style="fill:color-mix(in srgb,var(--se) 22%,var(--card));stroke:var(--ink)" stroke-width="1.2"/>';
      s += '<polygon points="' + [x + u, y, x + u + u * k, y - u * k, x + u + u * k, y - u - u * k, x + u, y - u].join(',') + '" style="fill:color-mix(in srgb,var(--se) 70%,var(--card));stroke:var(--ink)" stroke-width="1.2"/>';
    });
    s += '<text x="110" y="178" text-anchor="middle" font-size="15" class="t2">the object</text>';
    function grid(gx, gy, cells, lab) {
      var h = '';
      cells.forEach(function (c) { h += '<rect x="' + (gx + c[0] * 20) + '" y="' + (gy - (c[1] + 1) * 20) + '" width="20" height="20" style="fill:color-mix(in srgb,var(--se) 35%,var(--card));stroke:var(--ink)" stroke-width="1.2"/>'; });
      return h + '<text x="' + (gx + 30) + '" y="' + (gy + 18) + '" text-anchor="middle" font-size="15" class="tb">' + lab + '</text>';
    }
    s += grid(240, 72, [[0, 0], [1, 0], [2, 0], [0, 1]], 'front');
    s += grid(320, 72, [[0, 0], [1, 0], [0, 1]], 'side');
    s += grid(270, 160, [[0, 0], [1, 0], [2, 0], [0, 1]], 'top');
    return A.svg(400, 184, s, 'An object made of 5 cubes: 3 in a row, one behind the left cube, and one on top of the left cube. Front view: 3 squares in a row with 1 on top at the left. Side view: 2 squares in a row with 1 on top. Top view: 3 squares in a row with 1 behind at the left.');
  }
  /* scale drawing: a rectangle room with scale */
  function plan(wcm, hcm, sc) {
    var u = 30, s = '<rect x="30" y="20" width="' + wcm * u + '" height="' + hcm * u + '" style="fill:color-mix(in srgb,var(--se) 12%,var(--card));stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 1; i < wcm; i++) s += '<line x1="' + (30 + i * u) + '" y1="20" x2="' + (30 + i * u) + '" y2="' + (20 + hcm * u) + '" style="stroke:var(--line)"/>';
    for (var j = 1; j < hcm; j++) s += '<line x1="30" y1="' + (20 + j * u) + '" x2="' + (30 + wcm * u) + '" y2="' + (20 + j * u) + '" style="stroke:var(--line)"/>';
    s += '<text x="' + (30 + wcm * u / 2) + '" y="' + (hcm * u + 44) + '" text-anchor="middle" font-size="17" class="tb">' + wcm + ' cm on the plan</text><text x="' + (40 + wcm * u) + '" y="' + (20 + hcm * u / 2) + '" font-size="17" class="tb">' + hcm + ' cm</text>';
    s += '<text x="30" y="' + (hcm * u + 70) + '" font-size="16" class="t2">Scale 1 : ' + sc + ' (1 cm on the plan is ' + sc + ' cm in real life)</text>';
    return A.svg(400, hcm * u + 80, s, 'A floor plan ' + wcm + ' cm by ' + hcm + ' cm at a scale of 1 to ' + sc + '.');
  }

  var TRI = [[1, 1], [4, 1], [1, 3]];
  var html =
'<section class="sec"><h2><span class="n">1</span>Angle facts</h2>' +
'<p>Four facts unlock most angle problems.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Fact</th><th class="l">Rule</th></tr></thead><tbody>' +
'<tr><td class="l">Angles on a straight line</td><td class="l">add to 180' + D + '</td></tr><tr><td class="l">Angles around a point</td><td class="l">add to 360' + D + '</td></tr>' +
'<tr><td class="l">Vertically opposite angles (an X shape)</td><td class="l">are equal</td></tr><tr><td class="l">Angles in a triangle</td><td class="l">add to 180' + D + '</td></tr></tbody></table></div>' +
'<div class="fig">' + A.svg(400, 170, '<line x1="40" y1="140" x2="360" y2="30" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="40" y1="40" x2="360" y2="130" style="stroke:var(--ink)" stroke-width="2.5"/>' +
  arc(200, 85, 30, 161, 196, 'var(--strand)', '35' + D, 52) + arc(200, 85, 30, -19, 16, 'var(--strand)', '35' + D, 52) + arc(200, 85, 30, 16, 161, 'var(--accent)', 'x', 46), 'Two lines crossing. Two vertically opposite angles are 35 degrees. The angle x is next to a 35 degree angle on a straight line.') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Two lines cross. One angle is 35' + D + '. Find x, the angle next to it.</p><ol><li>x and 35' + D + ' sit together on a straight line.</li><li>So x + 35 = 180.</li><li>x = 145' + D + '. The angle opposite x is also 145' + D + ' (vertically opposite).</li></ol></div>' +
A.yt({ q: 'A triangle has angles of 48' + D + ' and 67' + D + '. What is the third angle?', a: 65, unit: D, back: 'Use the triangle fact from the table: the three angles add to 180' + D + '. Subtract the two you know.', ok: '180 &minus; 48 &minus; 67 = 65' + D + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Parallel lines and a transversal</h2>' +
'<p>When a line (the <b>transversal</b>) crosses two parallel lines, it makes 8 angles. They come in just two sizes. Three patterns name the pairs:</p>' +
'<ul class="steplist"><li><b>Corresponding</b> angles (an F shape) are equal.</li><li><b>Alternate</b> angles (a Z shape) are equal.</li><li><b>Co-interior</b> angles (a C shape, between the lines on the same side) add to 180' + D + '.</li></ul>' +
'<div class="lab"><span class="lt">Try it: tilt the transversal</span>' +
'<div class="ctrl"><label for="pla">Angle: <output id="plao"></output><input type="range" id="pla" min="30" max="150" value="60"></label><label for="plp">Show pair<select id="plp"><option value="">all angles</option><option value="1,5">corresponding (F)</option><option value="3,5">alternate (Z)</option><option value="4,5">co-interior (C)</option><option value="1,3">vertically opposite</option></select></label></div>' +
'<div class="fig" id="plfig"></div><div class="out" id="plout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Parallel lines are cut by a transversal. One angle between the lines is 72' + D + '. Find its co-interior partner and its alternate partner.</p><ol><li>Co-interior angles add to 180' + D + ': 180 &minus; 72 = 108' + D + '.</li><li>Alternate angles are equal: 72' + D + '.</li><li>Check: every angle in the picture is either 72' + D + ' or 108' + D + '.</li></ol></div>' +
A.yt({ q: 'Two parallel lines are cut by a transversal. One angle is 115' + D + '. What is its co-interior angle?', a: 65, unit: D, back: 'Look at the list: co-interior angles add to 180' + D + '.', ok: '180 &minus; 115 = 65' + D + '.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>These rules only work when the lines are <b>parallel</b>. Look for the arrow marks before you use them.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Angles in polygons</h2>' +
'<p>From one corner, a polygon with n sides splits into n &minus; 2 triangles. Each triangle has 180' + D + '.</p>' +
'<p style="text-align:center;font-size:1.1rem"><b>Sum of interior angles = (n &minus; 2) &times; 180' + D + '</b></p>' +
'<div class="lab"><span class="lt">Try it: count the triangles</span>' +
'<div class="ctrl"><label for="pgn">Sides: <output id="pgno"></output><input type="range" id="pgn" min="3" max="12" value="6"></label></div>' +
'<div class="fig" id="pgfig"></div><div class="out" id="pgout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Find each interior angle of a regular octagon (8 equal sides and angles).</p><ol><li>Sum: (8 &minus; 2) &times; 180 = 6 &times; 180 = 1080' + D + '.</li><li>There are 8 equal angles.</li><li>Each: 1080 &divide; 8 = 135' + D + '.</li></ol></div>' +
A.yt({ q: 'What is each interior angle of a regular hexagon (6 sides)?', a: 120, unit: D, back: 'Go back to step 1: find the sum with (n &minus; 2) &times; 180' + D + ', then share it between the 6 angles.', ok: '(6 &minus; 2) &times; 180 = 720' + D + ', and 720 &divide; 6 = 120' + D + '.' }) +
'<div class="key"><b class="t">Key idea</b><p>The exterior angles of any convex polygon add to 360' + D + '. For a regular polygon, each exterior angle is 360' + D + ' &divide; n, and interior + exterior = 180' + D + '.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Transformations on a grid</h2>' +
'<p>A transformation moves a shape to a new position, called the <b>image</b>. Image points get a prime mark: A becomes A&prime;.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Transformation</th><th class="l">Rule</th></tr></thead><tbody>' +
['tr', 'rx', 'ry', 'r90', 'r180', 'di'].map(function (k) { return '<tr><td class="l">' + TNAME[k] + '</td><td class="l math">' + TRULE[k] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: move triangle ABC</span>' +
'<div class="ctrl"><label for="tft">Transformation<select id="tft"><option value="tr">translation</option><option value="rx">reflect in x-axis</option><option value="ry">reflect in y-axis</option><option value="r90">rotate 90' + D + ' counter-clockwise</option><option value="r180">rotate 180' + D + '</option><option value="r270">rotate 90' + D + ' clockwise</option><option value="di">dilation</option></select></label>' +
'<label for="tfa">Right/left or factor: <output id="tfao"></output><input type="range" id="tfa" min="-5" max="3" value="-5"></label><label for="tfb">Up/down: <output id="tfbo"></output><input type="range" id="tfb" min="-6" max="4" value="-4"></label></div>' +
'<div class="fig" id="tffig"></div><div class="out" id="tfout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Reflect the point (3, &minus;2) in the x-axis, then dilate the result by a factor of 2 about the origin.</p><ol><li>Reflecting in the x-axis keeps x and changes the sign of y: (3, 2).</li><li>A dilation by 2 multiplies both coordinates by 2: (6, 4).</li><li>A dilation changes the size but keeps the shape. The others keep the size too.</li></ol></div>' +
A.yt({ q: 'Rotate the point (2, 5) by 180' + D + ' about the origin. What is the image?', opts: ['(&minus;2, &minus;5)', '(5, 2)', '(&minus;5, 2)', '(2, &minus;5)'], a: 0, back: 'Use the table: a 180' + D + ' rotation changes the sign of both coordinates.', ok: '(x, y) &rarr; (&minus;x, &minus;y), so (2, 5) &rarr; (&minus;2, &minus;5).' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Tessellations</h2>' +
'<p>A <b>tessellation</b> covers a surface with tiles, with no gaps or overlaps. Where tiles meet at a point, the angles must add to exactly 360' + D + '.</p>' +
'<div class="fig">' + tess() + '</div>' +
'<p>Only three regular polygons tessellate on their own: equilateral triangles (6 &times; 60' + D + '), squares (4 &times; 90' + D + ') and regular hexagons (3 &times; 120' + D + '). Tessellations repeat by <b>translations</b>, and many also use <b>rotations</b> and <b>reflections</b>.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Can regular octagons tessellate on their own?</p><ol><li>Each angle of a regular octagon is 135' + D + ' (from part 3).</li><li>Two make 270' + D + ', three make 405' + D + '. Neither is 360' + D + '.</li><li>No. But octagons with squares can tessellate: 135 + 135 + 90 = 360' + D + '.</li></ol></div>' +
A.yt({ q: 'Which regular polygon tessellates on its own?', opts: ['Hexagon', 'Pentagon', 'Octagon', 'Decagon'], a: 0, back: 'Go back to step 2: find each angle, then check whether a whole number of them makes 360' + D + '.', ok: 'Each hexagon angle is 120' + D + ', and 3 &times; 120 = 360' + D + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Scale drawings and views</h2>' +
'<p>A <b>scale drawing</b> shows a real object smaller (or larger) by the same factor in every direction. A scale of 1 : 50 means 1 cm on the drawing is 50 cm in real life.</p>' +
'<div class="fig">' + plan(8, 6, 50) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A room is 8 cm by 6 cm on a plan with scale 1 : 50. Find its real size and area.</p><ol><li>Length: 8 &times; 50 = 400 cm = 4 m. Width: 6 &times; 50 = 300 cm = 3 m.</li><li>Real area: 4 &times; 3 = 12 m' + '<sup>2</sup>.</li><li>Lengths grew 50 times, but the area grew 50 &times; 50 = 2500 times.</li></ol></div>' +
A.yt({ q: 'A map has a scale of 1 cm : 2 m. A path is 7.5 cm on the map. How long is it really?', a: 15, unit: 'm', back: 'Go back to step 1: multiply the map length by the scale.', ok: '7.5 &times; 2 = 15 m.' }) +
'<div class="key"><b class="t">Key idea</b><p>If lengths are multiplied by k, areas are multiplied by k<sup>2</sup>. Double a drawing and it needs 4 times the paint.</p></div>' +
'<p>Builders also use <b>views</b>: what you see from the front, the side and the top.</p>' +
'<div class="fig">' + views() + '</div>' +
'</section>';

  var practice = [
    { id: 'ge-angles', name: 'Angle facts', code: 'E2.2', gen: function (lv) {
      var t = lv === 1 ? R.int(0, 1) : R.int(0, 3), a, b, ans, q, st, h;
      if (t === 0) { a = R.int(20, 160); ans = 180 - a; q = 'Two angles sit together on a straight line. One is ' + a + D + '. Find the other.'; h = 'Angles on a straight line add to 180' + D + '.'; st = ['Straight line: 180' + D + '.', '180 &minus; ' + a + ' = ' + ans + '.']; }
      else if (t === 1) { a = R.int(25, 85); b = R.int(25, 150 - a); ans = 180 - a - b; q = 'A triangle has angles of ' + a + D + ' and ' + b + D + '. Find the third angle.'; h = 'The angles in a triangle add to 180' + D + '.'; st = ['Triangle: 180' + D + '.', '180 &minus; ' + a + ' &minus; ' + b + ' = ' + ans + '.']; }
      else if (t === 2) { a = R.int(60, 150); b = R.int(40, 300 - a - 20); if (a + b >= 340) b = 340 - a; ans = 360 - a - b; q = 'Three angles meet at a point. Two are ' + a + D + ' and ' + b + D + '. Find the third.'; h = 'Angles around a point add to 360' + D + '.'; st = ['Around a point: 360' + D + '.', '360 &minus; ' + a + ' &minus; ' + b + ' = ' + ans + '.']; }
      else { a = R.int(30, 150); var x = R.int(0, 1); ans = x ? a : 180 - a; q = 'Two straight lines cross. One angle is ' + a + D + '. Find the angle ' + (x ? '<b>vertically opposite</b> it' : 'next to it on the same line') + '.'; h = x ? 'Vertically opposite angles are equal.' : 'Angles on a straight line add to 180' + D + '.'; st = [x ? 'Vertically opposite angles are equal.' : 'They are on a straight line: 180' + D + '.', 'The angle is ' + ans + D + '.']; }
      return { q: q, type: 'num', answer: ans, unit: D, hint: h, steps: st.concat(['Check that your answer makes sense in a sketch.']), explain: 'The angle is ' + ans + D + '.' };
    } },
    { id: 'ge-parallel', name: 'Parallel line angles', code: 'E2.2', gen: function (lv) {
      var t = R.int(35, 145); while (t === 90) t = R.int(35, 145);
      var pairs = [['corresponding', '1,5', 'equal'], ['alternate', '3,5', 'equal'], ['co-interior', '4,5', 'add to 180' + D]], pr = R.pick(pairs);
      var vals = { 1: t, 2: 180 - t, 3: t, 4: 180 - t, 5: t, 6: 180 - t, 7: t, 8: 180 - t }, ids = pr[1].split(',').map(Number);
      if (lv === 3) {
        var k = R.int(1, 8);
        return { q: 'Parallel lines are cut by a transversal. Angle 1 is ' + t + D + '. Find angle ' + k + '.', type: 'num', answer: vals[k], unit: D, fig: parallel(t, 'num'),
          hint: 'Every angle is either ' + t + D + ' or 180' + D + ' &minus; ' + t + D + '. Compare angle ' + k + ' with angle 1.', steps: ['The angles come in two sizes: ' + t + D + ' and ' + (180 - t) + D + '.', 'Angle ' + k + ' is ' + (vals[k] === t ? 'the same size as angle 1.' : 'the other size: they add to 180' + D + '.'), 'Angle ' + k + ' = ' + vals[k] + D + '.'], explain: 'Angle ' + k + ' = ' + vals[k] + D + '.' };
      }
      if (lv === 1) {
        var o = R.mc(pr[0].charAt(0).toUpperCase() + pr[0].slice(1), ['Corresponding', 'Alternate', 'Co-interior', 'Vertically opposite'].filter(function (x) { return x.toLowerCase() !== pr[0]; }));
        return { q: 'What kind of angle pair is highlighted?', type: 'mc', options: o.options, answer: o.answer, fig: parallel(t, '', ids),
          hint: 'F shape: corresponding. Z shape: alternate. C shape between the lines: co-interior.', steps: ['Look at where the two angles are.', 'They make ' + { corresponding: 'an F shape', alternate: 'a Z shape', 'co-interior': 'a C shape' }[pr[0]] + '.', 'So they are ' + pr[0] + ' angles.'], explain: 'These are ' + pr[0] + ' angles. They ' + pr[2] + '.' };
      }
      var given = vals[ids[0]], ans = vals[ids[1]];
      return { q: 'Parallel lines are cut by a transversal. One angle is ' + given + D + '. What is its ' + pr[0] + ' partner?', type: 'num', answer: ans, unit: D, fig: parallel(t, '', ids),
        hint: pr[0] + ' angles ' + pr[2] + '.', steps: [pr[0].charAt(0).toUpperCase() + pr[0].slice(1) + ' angles ' + pr[2] + '.', pr[2] === 'equal' ? 'So the partner is also ' + ans + D + '.' : '180 &minus; ' + given + ' = ' + ans + '.'], explain: 'The ' + pr[0] + ' angle is ' + ans + D + '.' };
    } },
    { id: 'ge-polygon', name: 'Polygon angles', code: 'E2.2', gen: function (lv) {
      var n = R.pick([5, 6, 8, 9, 10, 12]), sum = (n - 2) * 180;
      if (lv === 1) return { q: 'What is the sum of the interior angles of a polygon with ' + n + ' sides?', type: 'num', answer: sum, unit: D, fig: polygon(n, true).replace(/<text x="250" y="126"[^]*$/, '</svg>').replace(/<\/svg><\/svg>$/, '</svg>'),
        hint: '(n &minus; 2) &times; 180' + D + '. How many triangles fit?', steps: ['n = ' + n + ', so there are ' + (n - 2) + ' triangles.', (n - 2) + ' &times; 180 = ' + A.fmt(sum) + '.'], explain: 'The sum is ' + A.fmt(sum) + D + '.' };
      if (lv === 2) return { q: 'What is each interior angle of a regular polygon with ' + n + ' sides?', type: 'num', answer: sum / n, unit: D,
        hint: 'Find the sum with (n &minus; 2) &times; 180' + D + ', then divide by ' + n + '.', steps: ['Sum: (' + n + ' &minus; 2) &times; 180 = ' + A.fmt(sum) + D + '.', 'Each: ' + A.fmt(sum) + ' &divide; ' + n + ' = ' + sum / n + D + '.'], explain: 'Each angle is ' + sum / n + D + '.' };
      var m = R.pick([3, 4, 5, 6, 8, 10, 12]), each = (m - 2) * 180 / m, ok = 360 % each === 0;
      return { q: 'Can regular polygons with ' + m + ' sides tessellate on their own?', type: 'mc', options: ['Yes', 'No'], answer: ok ? 0 : 1,
        hint: 'Find each interior angle. Does a whole number of them make exactly 360' + D + '?', steps: ['Each angle: (' + m + ' &minus; 2) &times; 180 &divide; ' + m + ' = ' + each + D + '.', '360 &divide; ' + each + ' = ' + Math.round(360 / each * 100) / 100 + '.', ok ? 'That is a whole number, so yes.' : 'Not a whole number, so there would be gaps or overlaps.'], explain: ok ? 'Yes: ' + 360 / each + ' &times; ' + each + D + ' = 360' + D + '.' : 'No: ' + each + D + ' does not divide 360' + D + ' evenly.' };
    } },
    { id: 'ge-transform', name: 'Transformations', code: 'E1.4', gen: function (lv) {
      var types = lv === 1 ? ['tr', 'rx', 'ry'] : lv === 2 ? ['rx', 'ry', 'r180', 'r90', 'di'] : ['r90', 'r270', 'di', 'r180'];
      var t = R.pick(types), p = [R.int(-6, 6) || 2, R.int(-6, 6) || 3], k = t === 'tr' ? [R.int(-4, 4) || 1, R.int(-4, 4) || -2] : t === 'di' ? R.pick([2, 3, 0.5]) : null;
      if (t === 'di' && k === 0.5) p = [p[0] * 2 > 8 ? 4 : p[0] * 2, p[1] * 2 > 8 ? -4 : p[1] * 2];
      var img = tx(t, k, p), name = t === 'tr' ? 'a translation ' + Math.abs(k[0]) + ' ' + (k[0] > 0 ? 'right' : 'left') + ' and ' + Math.abs(k[1]) + ' ' + (k[1] > 0 ? 'up' : 'down') : t === 'di' ? 'a dilation by a factor of ' + k + ' about the origin' : 'a ' + TNAME[t];
      var right = pt(img), wr = [pt([-img[0], img[1]]), pt([img[0], -img[1]]), pt([img[1], img[0]]), pt([-img[1], -img[0]]), pt(p)].filter(function (w) { return w !== right; });
      var o = R.mc(right, wr);
      return { q: 'Point ' + pt(p) + ' has ' + name + '. Where is its image?', type: 'mc', options: o.options, answer: o.answer,
        fig: lv === 1 ? plane([{ pts: [p], col: 'var(--strand)', name: 'Point' }], 8).replace(/<polygon[^>]*\/>/, '') : '',
        hint: 'Use the rule: ' + TRULE[t] + '.', steps: ['Rule for ' + (t === 'tr' ? 'this translation' : TNAME[t]) + ': ' + TRULE[t].replace('a,', N(t === 'tr' ? k[0] : 0) + ',').replace('+ a', '+ ' + (t === 'tr' ? P(k[0]) : 'a')).replace('+ b', '+ ' + (t === 'tr' ? P(k[1]) : 'b')).replace(/k/g, t === 'di' ? k : 'k') + '.', 'Apply it to ' + pt(p) + '.', 'The image is ' + right + '.'], explain: 'The image is ' + right + '.' };
    } },
    { id: 'ge-scale', name: 'Scale drawings', code: 'E1.3', gen: function (lv) {
      var sc = R.pick([20, 25, 50, 100, 200]), l = R.int(3, 12) + (lv > 1 ? R.pick([0, 0.5]) : 0);
      if (lv === 1) { var real = l * sc / 100;
        return { q: 'A plan has a scale of 1 : ' + sc + '. A wall is ' + l + ' cm on the plan. How long is it in real life, in metres?', type: 'num', unit: 'm', answer: real, show: A.fmt(String(real)) + ' m',
          hint: 'Multiply by ' + sc + ' to get centimetres, then divide by 100 for metres.', steps: [l + ' &times; ' + sc + ' = ' + l * sc + ' cm.', l * sc + ' cm &divide; 100 = ' + real + ' m.'], explain: 'The wall is ' + real + ' m long.' }; }
      if (lv === 2) { var rl = R.int(2, 15), mm = R.pick([1, 2, 5]), dl = rl / mm;
        return { q: 'A map uses 1 cm for every ' + mm + ' km. Two towns are ' + rl + ' km apart. How far apart are they on the map, in cm?', type: 'num', unit: 'cm', answer: dl, show: A.fmt(String(dl)) + ' cm',
          hint: 'Each centimetre stands for ' + mm + ' km. Divide the real distance by ' + mm + '.', steps: [rl + ' &divide; ' + mm + ' = ' + dl + '.', 'They are ' + dl + ' cm apart on the map.'], explain: rl + ' km is ' + dl + ' cm on the map.' }; }
      var w = R.int(2, 8), h = R.int(2, 6), k = R.pick([2, 3, 4, 5]);
      return { q: 'A rectangle ' + w + ' cm by ' + h + ' cm is enlarged by a scale factor of ' + k + '. What is the area of the new rectangle, in cm<sup>2</sup>?', type: 'num', unit: 'cm<sup>2</sup>', answer: w * h * k * k,
        hint: 'Multiply each side by ' + k + ' first. Or: area grows by ' + k + '<sup>2</sup> = ' + k * k + '.', steps: ['New sides: ' + w * k + ' cm and ' + h * k + ' cm.', 'Area: ' + w * k + ' &times; ' + h * k + ' = ' + w * h * k * k + ' cm<sup>2</sup>.', 'Check: old area ' + w * h + ' &times; ' + k * k + ' = ' + w * h * k * k + '.'], explain: 'The new area is ' + w * h * k * k + ' cm<sup>2</sup>, ' + k * k + ' times the old one.' };
    } }
  ];
  function P(n) { return n < 0 ? '(' + N(n) + ')' : String(n); }

  var quiz = [
    { q: 'Two straight lines cross. One angle is 128' + D + '. What is the angle vertically opposite it?', type: 'num', answer: 128, unit: D, hint: 'Vertically opposite angles are equal.', explain: 'Vertically opposite angles are equal: 128' + D + '.' },
    { q: 'Parallel lines are cut by a transversal. An angle is 54' + D + '. What is its alternate angle?', type: 'num', answer: 54, unit: D, hint: 'Alternate angles (Z shape) are equal.', explain: 'Alternate angles are equal: 54' + D + '.' },
    { q: 'Parallel lines are cut by a transversal. An angle is 54' + D + '. What is its co-interior angle?', type: 'num', answer: 126, unit: D, hint: 'Co-interior angles add to 180' + D + '.', explain: '180 &minus; 54 = 126' + D + '.' },
    { q: 'What is the sum of the interior angles of a pentagon?', type: 'num', answer: 540, unit: D, hint: '(n &minus; 2) &times; 180' + D + ' with n = 5.', explain: '3 &times; 180 = 540' + D + '.' },
    { q: 'Triangle ABC has A(1, 2). After a reflection in the y-axis, where is A&prime;?', type: 'mc', options: ['(&minus;1, 2)', '(1, &minus;2)', '(&minus;1, &minus;2)', '(2, 1)'], answer: 0, hint: 'Reflecting in the y-axis changes the sign of x.', explain: '(x, y) &rarr; (&minus;x, y), so (1, 2) &rarr; (&minus;1, 2).' },
    { q: 'A shape is dilated by a scale factor of 3 about the origin. The point (&minus;2, 4) moves to where?', type: 'mc', options: ['(&minus;6, 12)', '(1, 7)', '(&minus;6, 4)', '(6, &minus;12)'], answer: 0, hint: 'Multiply both coordinates by 3.', explain: '(&minus;2 &times; 3, 4 &times; 3) = (&minus;6, 12).' },
    { q: 'A garden is 5 cm by 4 cm on a plan with scale 1 : 200. What is its real area in m<sup>2</sup>?', type: 'num', answer: 80, unit: 'm<sup>2</sup>', hint: 'Find the real length and width in metres first: 5 &times; 200 cm and 4 &times; 200 cm.', explain: '5 &times; 200 = 1000 cm = 10 m; 4 &times; 200 = 800 cm = 8 m. Area: 10 &times; 8 = 80 m<sup>2</sup>.' }
  ];

  A.register('geometry', {
    fx: { rad: rad, arc: arc, parallel: parallel, polygon: polygon, plane: plane, tx: tx, pt: pt, tess: tess, views: views, plan: plan, P: P },
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      A.bind(root, ['pla', 'plp'], function () {
        var t = +$('#pla').value, p = $('#plp').value, ids = p ? p.split(',').map(Number) : null;
        $('#plao').textContent = t + '°';
        $('#plfig').innerHTML = parallel(t, 'deg', ids);
        var msg = { '1,5': 'Corresponding angles (F shape) are equal.', '3,5': 'Alternate angles (Z shape) are equal.', '4,5': 'Co-interior angles (C shape) add to 180' + D + ': ' + (180 - t) + ' + ' + t + ' = 180.', '1,3': 'Vertically opposite angles are equal.' }[p] || 'There are only two sizes: ' + Math.min(t, 180 - t) + D + ' and ' + Math.max(t, 180 - t) + D + '. Together they make 180' + D + '.';
        $('#plout').innerHTML = (t === 90 ? 'At 90' + D + ' every angle is a right angle. ' : '') + msg;
      });
      A.bind(root, ['pgn'], function () {
        var n = +$('#pgn').value; $('#pgno').textContent = n;
        $('#pgfig').innerHTML = polygon(n, true);
        $('#pgout').innerHTML = '<span class="big">(' + n + ' &minus; 2) &times; 180' + D + ' = ' + A.fmt((n - 2) * 180) + D + '</span><br>Regular: each angle ' + A.fmt((n - 2) * 180) + ' &divide; ' + n + ' = ' + Math.round((n - 2) * 180 / n * 100) / 100 + D + '. Each exterior angle: 360 &divide; ' + n + ' = ' + Math.round(360 / n * 100) / 100 + D + '.';
      });
      A.bind(root, ['tft', 'tfa', 'tfb'], function () {
        var t = $('#tft').value, a = +$('#tfa').value, b = +$('#tfb').value, k;
        $('#tfa').disabled = !(t === 'tr' || t === 'di'); $('#tfb').disabled = t !== 'tr';
        if (t === 'tr') k = [a, b];
        if (t === 'di') { k = [0.5, 1, 2, 2.5][Math.max(0, Math.min(3, a + 2))] || 2; if (a < -2) k = 0.5; if (a > 1) k = 2.5; if (a === -1) k = 1; if (a === 0 || a === 1) k = 2; }
        $('#tfao').textContent = t === 'di' ? '×' + k : t === 'tr' ? (a < 0 ? '−' + -a : a) : '–';
        $('#tfbo').textContent = t === 'tr' ? (b < 0 ? '−' + -b : b) : '–';
        var img = TRI.map(function (p) { return tx(t, k, p); });
        $('#tffig').innerHTML = plane([{ pts: TRI, col: 'var(--strand)', lab: 'ABC', name: 'Triangle ABC' }, { pts: img, col: 'var(--accent)', lab: 'ABC', prime: true, dash: true, name: 'Image' }], Math.max(8, Math.ceil(Math.max.apply(null, img.map(function (p) { return Math.max(Math.abs(p[0]), Math.abs(p[1])); })) / 2) * 2));
        $('#tfout').innerHTML = '<b>' + (t === 'tr' ? 'Translation ' + Math.abs(a) + ' ' + (a < 0 ? 'left' : 'right') + ', ' + Math.abs(b) + ' ' + (b < 0 ? 'down' : 'up') : t === 'di' ? 'Dilation by ' + k + ' about the origin' : TNAME[t].charAt(0).toUpperCase() + TNAME[t].slice(1)) + '</b><br>' +
          TRI.map(function (p, i) { return 'ABC'.charAt(i) + pt(p) + ' &rarr; ' + 'ABC'.charAt(i) + '&prime;' + pt(img[i]); }).join('<br>') +
          '<br>' + (t === 'di' ? (k === 1 ? 'Factor 1: same size.' : k > 1 ? 'Bigger, same shape.' : 'Smaller, same shape.') : 'Same size and shape: only the position changes.');
      });
    }
  });
})();
