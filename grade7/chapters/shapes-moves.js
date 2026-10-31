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

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    slk: { title: 'explore a solid', html:
      '<div class="ctrl"><label for="slk">Solid<select id="slk">' + Object.keys(SOLIDS).map(function (k) { return '<option value="' + k + '"' + (k === 'sqpyr' ? ' selected' : '') + '>' + SOLIDS[k].name + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="row2"><div class="fig" id="slfig"></div><div class="out" id="slout"></div></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['slk'], function () {
          var k = $('#slk', root).value, S = SOLIDS[k];
          $('#slfig', root).innerHTML = solid(k);
          $('#slout', root).innerHTML = '<div class="tbl"><table><tbody><tr><td class="l">Base</td><td class="l">' + S.base + '</td></tr><tr><td class="l">Faces</td><td class="l">' + S.F + '</td></tr><tr><td class="l">Edges</td><td class="l">' + S.E + '</td></tr><tr><td class="l">Vertices (corners)</td><td class="l">' + S.V + '</td></tr>' +
            '<tr><td class="l">Planes of symmetry</td><td class="l">' + S.planes + '</td></tr><tr><td class="l">Rotational symmetry</td><td class="l">' + S.rot + '</td></tr></tbody></table></div>' +
            (typeof S.F === 'number' ? '<p class="t2">Check: faces + vertices &minus; edges = ' + S.F + ' + ' + S.V + ' &minus; ' + S.E + ' = 2. This works for every prism and pyramid.</p>' : '');
        });
      } },
    vbgrid: { title: 'build with cubes', html:
      '<p class="t2" style="margin:0 0 6px">Each square is a spot on the floor (the back row is at the top). Press a square to add a cube there, up to 3. A fourth press clears it.</p>' +
      '<div class="vbuild" id="vbgrid"></div>' +
      '<div class="row2"><div class="fig" id="vbiso"></div><div class="vrow" id="vbviews"></div></div>',
      init: function (root) {
        var $ = A.$;
        var map = [[1, 2, 3], [0, 1, 2], [1, 0, 1]];
        function vb() {
          $('#vbgrid', root).innerHTML = map.map(function (row, r) { return row.map(function (h, c) { return '<button type="button" class="vcell" data-r="' + r + '" data-c="' + c + '" aria-label="Row ' + (r + 1) + ' from the back, column ' + (c + 1) + ': ' + h + ' cubes">' + h + '</button>'; }).join(''); }).join('');
          A.$$('.vcell', root).forEach(function (b) { b.addEventListener('click', function () { var r = +b.getAttribute('data-r'), c = +b.getAttribute('data-c'); map[r][c] = (map[r][c] + 1) % 4; vb(); var nb = A.$('.vcell[data-r="' + r + '"][data-c="' + c + '"]', root); if (nb) nb.focus(); }); });
          var v = views(map);
          $('#vbiso', root).innerHTML = iso(map);
          $('#vbviews', root).innerHTML = '<figure><figcaption>Front view</figcaption>' + view(v.front, 'Front view') + '</figure><figure><figcaption>Right side view</figcaption>' + view(v.side, 'Right side view') + '</figure><figure><figcaption>Top view</figcaption>' + topView(map) + '</figure>';
        }
        vb();
      } },
    mvk: { title: 'move the triangle', html:
      '<div class="ctrl"><label for="mvk">Move<select id="mvk"><option value="tr">translation</option><option value="rx">reflect in the x-axis</option><option value="ry" selected>reflect in the y-axis</option><option value="r90cw">rotate 90&deg; clockwise</option><option value="r90ccw">rotate 90&deg; counterclockwise</option><option value="r180">rotate 180&deg;</option></select></label>' +
      '<label for="mva">Slide across: <output id="mvao"></output><input type="range" id="mva" min="-6" max="6" value="2"></label><label for="mvb">Slide up: <output id="mvbo"></output><input type="range" id="mvb" min="-6" max="6" value="-3"></label></div>' +
      '<div class="row2"><div class="fig" id="mvfig"></div><div class="out" id="mvout"></div></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['mvk', 'mva', 'mvb'], function () {
          var k = $('#mvk', root).value, a = +$('#mva', root).value, b = +$('#mvb', root).value, img = TRI.map(function (p) { return MOVES[k](p, a, b); });
          $('#mvao', root).innerHTML = sg(a); $('#mvbo', root).innerHTML = sg(b);
          $('#mva', root).disabled = $('#mvb', root).disabled = k !== 'tr';
          $('#mvfig', root).innerHTML = plane([{ pts: TRI, col: 'var(--sb)', labs: ['A', 'B', 'C'] }, { pts: img, col: 'var(--se)', labs: ["A'", "B'", "C'"] }], 8, k === 'rx' || k === 'ry' ? function (X, Y) { return k === 'rx' ? '<line x1="' + X(-8) + '" y1="' + Y(0) + '" x2="' + X(8) + '" y2="' + Y(0) + '" style="stroke:var(--se)" stroke-width="4" opacity=".6"/>' : '<line x1="' + X(0) + '" y1="' + Y(-8) + '" x2="' + X(0) + '" y2="' + Y(8) + '" style="stroke:var(--se)" stroke-width="4" opacity=".6"/>'; } : null);
          $('#mvout', root).innerHTML = '<p><b>' + (k === 'tr' ? 'Translation ' + (a ? (a > 0 ? 'right ' + a : 'left ' + (-a)) : '') + (a && b ? ', ' : '') + (b ? (b > 0 ? 'up ' + b : 'down ' + (-b)) : '') : MNAME[k].replace(/^./, function (c) { return c.toUpperCase(); })) + '</b></p>' +
            '<p class="math">Rule: ' + (k === 'tr' ? '(x, y) &rarr; (x ' + (a < 0 ? '&minus; ' + (-a) : '+ ' + a) + ', y ' + (b < 0 ? '&minus; ' + (-b) : '+ ' + b) + ')' : MRULE[k]) + '</p>' +
            '<div class="tbl"><table><thead><tr><th>Point</th><th>Image</th></tr></thead><tbody>' + TRI.map(function (p, i) { return '<tr><td>' + 'ABC'[i] + pt(p) + '</td><td>' + 'ABC'[i] + "'" + pt(img[i]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
        });
      } },
    dlk: { title: 'change the scale factor', html:
      '<div class="ctrl"><label for="dlk">Scale factor<select id="dlk"><option>0.5</option><option>1</option><option>1.5</option><option selected>2</option><option>3</option></select></label></div>' +
      '<div class="row2"><div class="fig" id="dlfig"></div><div class="out" id="dlout"></div></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['dlk'], function () {
          var k = parseFloat($('#dlk', root).value), base = [[2, 2], [4, 2], [2, 6]], img = base.map(function (p) { return MOVES.dil(p, k); });
          $('#dlfig', root).innerHTML = plane([{ pts: base, col: 'var(--sb)', labs: ['A', 'B', 'C'] }, { pts: img, col: 'var(--se)', labs: ["A'", "B'", "C'"], dash: k === 1 }], 12, function (X, Y) { return img.map(function (p) { return '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(p[0]) + '" y2="' + Y(p[1]) + '" style="stroke:var(--ink2)" stroke-dasharray="3 4"/>'; }).join(''); });
          $('#dlout', root).innerHTML = '<p class="big2">Scale factor ' + k + '</p><p>' + (k > 1 ? 'Enlargement.' : k < 1 ? 'Reduction.' : 'Same size: the image sits on top of the original.') + '</p>' +
            '<div class="tbl"><table><thead><tr><th>Point</th><th>Image</th></tr></thead><tbody>' + base.map(function (p, i) { return '<tr><td>' + 'ABC'[i] + pt(p) + '</td><td>' + 'ABC'[i] + "'" + pt(img[i]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
            '<p>Side AB = 2 units, so A\'B\' = 2 &times; ' + k + ' = ' + cl(2 * k) + ' units. Side AC = 4 units, so A\'C\' = ' + cl(4 * k) + ' units.</p>';
        });
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  function shape(k) { return '<figure class="k7-solid"><figcaption>' + SOLIDS[k].name + '</figcaption>' + solid(k, 220) + '</figure>'; }
  function tri(img, labs, extra) { var sh = [{ pts: TRI, col: 'var(--sb)', labs: ['A', 'B', 'C'], name: 'Triangle ABC' }]; if (img) sh.push({ pts: img, col: 'var(--se)', labs: labs || ["A'", "B'", "C'"], name: 'Image' }); return plane(sh, 8, extra); }
  function axis(k) { return function (X, Y) { return k === 'rx' ? '<line x1="' + X(-8) + '" y1="' + Y(0) + '" x2="' + X(8) + '" y2="' + Y(0) + '" style="stroke:var(--se)" stroke-width="4"/>' : '<line x1="' + X(0) + '" y1="' + Y(-8) + '" x2="' + X(0) + '" y2="' + Y(8) + '" style="stroke:var(--se)" stroke-width="4"/>'; }; }
  function img(k, a, b) { return TRI.map(function (p) { return MOVES[k](p, a, b); }); }
  /* the "My turn" examples use triangle DEF and building EXBLD, so they differ from the Watch clips */
  var DEF = [[1, 2], [3, 2], [3, 5]], EXBLD = [[2, 1, 0], [1, 1, 0], [3, 1, 1]];
  function def(k, a, b, extra, lim) {
    var sh = [{ pts: DEF, col: 'var(--sb)', labs: ['D', 'E', 'F'], name: 'Triangle DEF' }];
    if (k) sh.push({ pts: DEF.map(function (p) { return MOVES[k](p, a, b); }), col: 'var(--se)', labs: ["D'", "E'", "F'"], name: 'Image' });
    return plane(sh, lim || 8, extra);
  }
  var BLD = [[1, 2, 3], [0, 1, 2], [1, 0, 1]];

  var LESSONS = [
    { id: 'solids', title: 'Prisms, pyramids and cylinders', sub: 'Name a solid by its base.', concepts: [
      { id: 'names', title: 'Prism or pyramid?', exp: ['E1.1'], skill: 'sm-solid',
        body: '<p>A <b>prism</b> has two matching bases joined by rectangles. A <b>pyramid</b> has one base, and triangles that meet at a point. A <b>cylinder</b> has two circle bases and a curved surface. The base gives the name.</p>',
        watch: K.slides([
          { say: 'A triangular prism: two triangle bases, joined by rectangles.', fig: function () { return shape('tri'); } },
          { say: 'Cut it anywhere parallel to the base, and you get the same triangle. Same shape all the way through.', fig: function () { return shape('tri'); } },
          { say: 'A square-based pyramid: one square base, and 4 triangles that meet at the top.', fig: function () { return shape('sqpyr'); } },
          { say: 'A cylinder: two circles and one curved surface.', fig: function () { return shape('cyl'); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will name this solid. It has two rectangle bases, joined by rectangles.', fig: function () { return shape('rect'); } },
          { say: 'It is the same shape all the way through, so it is a prism. Its base is a rectangle: a <b>rectangular prism</b>.', fig: function () { return shape('rect'); } },
          { say: 'Next solid: one triangle base, and 3 triangles that meet at a point.', fig: function () { return shape('tripyr'); } },
          { say: 'It comes to a point, so it is a pyramid. Its base is a triangle: a <b>triangular pyramid</b>.', fig: function () { return shape('tripyr'); }, ms: 2400 }
        ]),
        try: lab('slk', [
          { do: 'Find the solid with <b>4 faces</b>.', goal: function (h) { return K.v(h, 'slk') === 'tripyr'; }, yes: 'The triangular pyramid: 4 triangles.' },
          { do: 'Find a solid with <b>12 edges</b>.', goal: function (h) { var k = K.v(h, 'slk'); return k === 'rect' || k === 'cube'; }, yes: 'Rectangular prisms and cubes have 12 edges.' },
          { do: 'Find the solid with <b>no vertices</b>.', goal: function (h) { return K.v(h, 'slk') === 'cyl'; }, yes: 'A cylinder has no corners.' }
        ]),
        key: '<p><b>Prism: two bases, same all the way through. Pyramid: one base, comes to a point.</b></p>',
        mistake: '<p>Naming a solid by its side faces (calling a triangular prism a "rectangle prism"). The <b>base</b> gives the name.</p>',
        check: [function () { return { q: 'How many edges does a triangular prism have?', type: 'num', answer: 9, hint: '3 edges on each triangle, plus the edges that join them.', explain: '3 + 3 + 3 = 9 edges.' }; }, K.ck('sm-solid', 1), K.ck('sm-solid', 2)] },
      { id: 'symmetry', title: 'Symmetry in solids', exp: ['E1.1'], skill: 'sm-solid', hard: true,
        body: '<p>A <b>plane of symmetry</b> cuts a solid into two mirror halves. A solid has <b>rotational symmetry</b> if a part turn makes it look the same. The <b>order</b> is how many times it looks the same in one full turn.</p>',
        watch: K.slides([
          { say: 'A square-based pyramid. Slice it straight down through the top point and the middle of two sides: two mirror halves.', fig: function () { return shape('sqpyr'); } },
          { say: 'It has 4 planes of symmetry: 2 through the middles of the sides, 2 through the corners.', fig: eq('4 planes of symmetry') },
          { say: 'Spin it about the line through the top point. Every quarter turn looks the same: order 4.', fig: eq('360&deg; &divide; 90&deg; = 4 &rarr; order 4'), ms: 2800 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find the symmetry of a rectangular prism, like a shoebox.', fig: function () { return shape('rect'); } },
          { say: 'I slice it through the middle, from end to end: two mirror halves. I can also slice it front to back, and top to bottom.', fig: eq('3 planes of symmetry') },
          { say: 'Next I spin it about a line through the centres of two opposite faces. It looks the same after a half turn.', fig: eq('360&deg; &divide; 180&deg; = 2 &rarr; order 2') },
          { say: 'So a rectangular prism has 3 planes of symmetry. Its rotational symmetry is order 2.', fig: eq('3 planes &nbsp;&nbsp; order 2'), ms: 2600 }
        ]),
        ways: [
          { label: 'Look at the base', html: '<p>For prisms and pyramids, the rotational symmetry about the central axis comes from the base. A square base gives order 4. An equilateral triangle gives order 3.</p>' },
          { label: 'Use a real object', html: '<p>Turn a box of tissues (a rectangular prism) on the table. It looks the same after a half turn: order 2.</p>' }
        ],
        key: '<p><b>Order = how many times it looks the same in one full turn.</b></p>',
        mistake: '<p>Counting the starting position twice, or saying order 1 means "no symmetry" without explaining that every shape looks the same after a full turn.</p>',
        check: [function () { return { q: 'What is the order of rotational symmetry of a square-based pyramid, turning about the axis through its top point?', type: 'num', answer: 4, fig: solid('sqpyr'), hint: 'How many times does the square base look the same in one full turn?', explain: 'Every quarter turn: order 4.' }; }, K.ck('sm-solid', 3)] }
    ] },
    { id: 'views', title: 'Views of a building', sub: 'Top, front and side.', concepts: [
      { id: 'views', title: 'Front, side and top views', exp: ['E1.2'], skill: 'sm-view', hard: true,
        body: '<p>A <b>view</b> is what you see looking straight at one side. You see only the outline, not depth.</p>',
        watch: K.slides([
          { say: 'A building made of cubes.', fig: function () { return iso(BLD); } },
          { say: 'The <b>front view</b>: for each column, the tallest stack, seen from the front.', fig: function () { var v = views(BLD); return iso(BLD) + '<div class="vrow"><figure><figcaption>Front view</figcaption>' + view(v.front, 'Front view') + '</figure></div>'; } },
          { say: 'The <b>right side view</b>: for each row, the tallest stack, seen from the right.', fig: function () { var v = views(BLD); return '<div class="vrow"><figure><figcaption>Front</figcaption>' + view(v.front, 'Front view') + '</figure><figure><figcaption>Right side</figcaption>' + view(v.side, 'Right side view') + '</figure></div>'; } },
          { say: 'The <b>top view</b>: which floor squares are covered.', fig: function () { var v = views(BLD); return '<div class="vrow"><figure><figcaption>Front</figcaption>' + view(v.front, 'Front view') + '</figure><figure><figcaption>Right side</figcaption>' + view(v.side, 'Right side view') + '</figure><figure><figcaption>Top</figcaption>' + topView(BLD) + '</figure></div>'; }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will draw the views of this cube building.', fig: function () { return iso(EXBLD); } },
          { say: 'Front view: I look at each column from the front, and draw its tallest stack.', fig: function () { var v = views(EXBLD); return iso(EXBLD) + '<div class="vrow"><figure><figcaption>Front view</figcaption>' + view(v.front, 'Front view') + '</figure></div>'; } },
          { say: 'Right side view: I look at each row from the right, and draw its tallest stack.', fig: function () { var v = views(EXBLD); return '<div class="vrow"><figure><figcaption>Front</figcaption>' + view(v.front, 'Front view') + '</figure><figure><figcaption>Right side</figcaption>' + view(v.side, 'Right side view') + '</figure></div>'; } },
          { say: 'Top view: I look down, and shade every floor square that is covered.', fig: function () { var v = views(EXBLD); return '<div class="vrow"><figure><figcaption>Front</figcaption>' + view(v.front, 'Front view') + '</figure><figure><figcaption>Right side</figcaption>' + view(v.side, 'Right side view') + '</figure><figure><figcaption>Top</figcaption>' + topView(EXBLD) + '</figure></div>'; }, ms: 2600 }
        ]),
        try: lab('vbgrid', [
          { do: 'Make the <b>front view</b> show three columns of height <b>3</b>.', goal: function (h) { var c = h.querySelectorAll('.vcell'), m = [0, 0, 0]; c.forEach(function (b) { var k = +b.getAttribute('data-c'); m[k] = Math.max(m[k], +b.textContent); }); return m.join() === '3,3,3'; }, yes: 'Each column needs at least one stack of 3.' },
          { do: 'Make the <b>top view</b> show only <b>one</b> square.', goal: function (h) { var n = 0; h.querySelectorAll('.vcell').forEach(function (b) { if (+b.textContent) n++; }); return n === 1; }, yes: 'One stack: the top view is a single square.' }
        ]),
        ways: [
          { label: 'Stand where the viewer stands', html: '<p>Imagine kneeling in front of the building. Each column of the floor is one column in your view. You only see the tallest stack in each column, because it hides the ones behind.</p>' },
          { label: 'Why you need more than one view', html: '<p>A front view of 2, 3 could come from many buildings: the stacks could be anywhere front to back. The side and top views pin it down.</p>' }
        ],
        key: '<p><b>Front: tallest in each column. Side: tallest in each row. Top: covered squares.</b></p>',
        mistake: '<p>Adding the stacks in a column instead of taking the tallest. A view shows height, not how many cubes.</p>',
        check: [function () { return mc('Which is the front view of this building?', view([2, 3], 'A'), [view([1, 3], 'B'), view([2, 1], 'C')], 'For each column, take the tallest stack.', 'Left column: 2. Right column: 3.', iso([[2, 1], [1, 3]])); }, K.ck('sm-view', 1), K.ck('sm-view', 2)] }
    ] },
    { id: 'plane', title: 'The Cartesian plane', sub: 'Four quadrants and translations.', concepts: [
      { id: 'coords', title: 'Points in four quadrants', exp: ['E1.4'], skill: 'sm-translate',
        body: '<p>The <b>Cartesian plane</b> has an <i>x</i>-axis (across) and a <i>y</i>-axis (up and down). They cross at the <b>origin</b>, (0, 0). A point (<i>x</i>, <i>y</i>) means across first, then up or down.</p>',
        watch: K.slides([
          { say: 'The axes cross at the origin, (0, 0).', fig: function () { return plane([{ pts: [[0, 0], [0, 0]], col: 'var(--sb)', labs: ['O', ''] }], 8); } },
          { say: '(3, 2): 3 right, 2 up.', fig: function () { return plane([{ pts: [[3, 2], [3, 2]], col: 'var(--sb)', labs: ['(3, 2)', ''] }], 8); } },
          { say: '(&minus;4, 5): 4 left, 5 up. Negative <i>x</i> means left.', fig: function () { return plane([{ pts: [[3, 2], [3, 2]], col: 'var(--sb)', labs: ['(3, 2)', ''] }, { pts: [[-4, 5], [-4, 5]], col: 'var(--se)', labs: ['(&minus;4, 5)', ''] }], 8); } },
          { say: '(3, &minus;2): 3 right, 2 down. The four regions are the four quadrants.', fig: function () { return plane([{ pts: [[3, 2], [3, 2]], col: 'var(--sb)', labs: ['(3, 2)', ''] }, { pts: [[-4, 5], [-4, 5]], col: 'var(--se)', labs: ['(&minus;4, 5)', ''] }, { pts: [[3, -2], [3, -2]], col: 'var(--sd)', labs: ['(3, &minus;2)', ''] }], 8); }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will plot three points. I always start at the origin, (0, 0).', fig: function () { return plane([{ pts: [[0, 0], [0, 0]], col: 'var(--sb)', labs: ['O', ''] }], 8); } },
          { say: '(&minus;5, &minus;3): across first, 5 left. Then 3 down.', fig: function () { return plane([{ pts: [[-5, -3], [-5, -3]], col: 'var(--sb)', labs: ['(&minus;5, &minus;3)', ''] }], 8); } },
          { say: '(2, &minus;6): 2 right, then 6 down.', fig: function () { return plane([{ pts: [[-5, -3], [-5, -3]], col: 'var(--sb)', labs: ['(&minus;5, &minus;3)', ''] }, { pts: [[2, -6], [2, -6]], col: 'var(--se)', labs: ['(2, &minus;6)', ''] }], 8); } },
          { say: '(&minus;1, 4): 1 left, then 4 up. Across first, then up or down.', fig: function () { return plane([{ pts: [[-5, -3], [-5, -3]], col: 'var(--sb)', labs: ['(&minus;5, &minus;3)', ''] }, { pts: [[2, -6], [2, -6]], col: 'var(--se)', labs: ['(2, &minus;6)', ''] }, { pts: [[-1, 4], [-1, 4]], col: 'var(--sd)', labs: ['(&minus;1, 4)', ''] }], 8); }, ms: 2600 }
        ]),
        key: '<p><b>(<i>x</i>, <i>y</i>): across first, then up or down.</b></p>',
        mistake: '<p>Swapping the order: (3, &minus;2) plotted as 3 up and 2 left.</p>',
        check: [function () { return mc('Which point is 5 left and 2 up from the origin?', '(&minus;5, 2)', ['(5, &minus;2)', '(2, &minus;5)', '(&minus;2, 5)'], 'Across first: left is negative.', '(&minus;5, 2).'); }, function () { return mc('In which quadrant are both coordinates negative?', 'Bottom left', ['Top left', 'Top right', 'Bottom right'], 'Negative <i>x</i> is left, negative <i>y</i> is down.', 'Left and down: bottom left.'); }] },
      { id: 'translate', title: 'Translations', exp: ['E1.4'], skill: 'sm-translate',
        body: '<p>A <b>translation</b> slides every point the same distance in the same direction. "Right 3, down 5" adds 3 to every <i>x</i> and subtracts 5 from every <i>y</i>.</p>',
        watch: K.slides([
          { say: 'Triangle ABC.', fig: function () { return tri(); } },
          { say: 'Slide it right 3 and down 5.', fig: function () { return tri(img('tr', 3, -5)); } },
          { say: 'A(1, 1) goes to A\'(4, &minus;4). Every point moves the same way.', fig: eq('(1, 1) &rarr; (1 + 3, 1 &minus; 5) = (4, &minus;4)') },
          { say: 'Same size, same shape, facing the same way.', fig: function () { return tri(img('tr', 3, -5)); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will slide triangle DEF 4 left and 3 down.', fig: function () { return def(); } },
          { say: 'Left changes x: I subtract 4. Down changes y: I subtract 3. D(1, 2) goes to D\'(&minus;3, &minus;1).', fig: eq('(1, 2) &rarr; (1 &minus; 4, 2 &minus; 3) = (&minus;3, &minus;1)') },
          { say: 'I do the same to every point. E(3, 2) &rarr; (&minus;1, &minus;1). F(3, 5) &rarr; (&minus;1, 2).', fig: function () { return def('tr', -4, -3); } },
          { say: 'The image is the same size and shape, and it faces the same way.', fig: function () { return def('tr', -4, -3); }, ms: 2400 }
        ]),
        try: lab('mvk', [
          { do: 'Choose <b>translation</b> and move A to <b>(4, &minus;4)</b>.', goal: function (h) { return K.v(h, 'mvk') === 'tr' && K.v(h, 'mva') === 3 && K.v(h, 'mvb') === -5; }, yes: 'Right 3, down 5.' },
          { do: 'Slide the triangle so A lands on <b>(&minus;3, 4)</b>.', goal: function (h) { return K.v(h, 'mvk') === 'tr' && K.v(h, 'mva') === -4 && K.v(h, 'mvb') === 3; }, yes: 'Left 4, up 3.' }
        ]),
        key: '<p><b>Right/left changes <i>x</i>. Up/down changes <i>y</i>.</b></p>',
        mistake: '<p>Changing the wrong coordinate for up/down, or moving only one vertex.</p>',
        check: [function () { return mc('Point P(&minus;2, 5) is translated left 4 and down 6. Where does it land?', '(&minus;6, &minus;1)', ['(2, &minus;1)', '(&minus;6, 11)', '(4, &minus;1)'], 'Left changes <i>x</i>, down changes <i>y</i>.', '&minus;2 &minus; 4 = &minus;6 and 5 &minus; 6 = &minus;1.'); }, K.ck('sm-translate', 1), K.ck('sm-translate', 2)] }
    ] },
    { id: 'moves', title: 'Reflections and rotations', sub: 'Flip and turn.', concepts: [
      { id: 'reflect', title: 'Reflections', exp: ['E1.4'], skill: 'sm-reflect',
        body: '<p>A <b>reflection</b> flips a shape over a line, like a mirror. Each point is the same distance from the line, on the other side.</p>',
        watch: K.slides([
          { say: 'Reflect triangle ABC in the <i>y</i>-axis.', fig: function () { return tri(null, null, axis('ry')); } },
          { say: 'Each point jumps to the other side, the same distance away.', fig: function () { return tri(img('ry'), null, axis('ry')); } },
          { say: 'The rule: (x, y) &rarr; (&minus;x, y). Only the sign of <i>x</i> changes.', fig: eq('(1, 1) &rarr; (&minus;1, 1) &nbsp; (4, 1) &rarr; (&minus;4, 1)') },
          { say: 'In the <i>x</i>-axis: (x, y) &rarr; (x, &minus;y). The shape flips up and down.', fig: function () { return tri(img('rx'), null, axis('rx')); }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will reflect triangle DEF in the <i>x</i>-axis.', fig: function () { return def(null, 0, 0, axis('rx')); } },
          { say: 'Each point jumps to the other side, the same distance away. D(1, 2) is 2 above, so D\' is 2 below: (1, &minus;2).', fig: eq('(1, 2) &rarr; (1, &minus;2)') },
          { say: 'E(3, 2) &rarr; (3, &minus;2). F(3, 5) &rarr; (3, &minus;5). Only the sign of <i>y</i> changes.', fig: function () { return def('rx', 0, 0, axis('rx')); } },
          { say: 'In the <i>x</i>-axis: (x, y) &rarr; (x, &minus;y). The triangle flips upside down.', fig: eq('(x, y) &rarr; (x, &minus;y)'), ms: 2400 }
        ]),
        try: lab('mvk', [
          { do: 'Reflect the triangle so it lands <b>below</b> the <i>x</i>-axis.', goal: function (h) { return K.v(h, 'mvk') === 'rx'; }, yes: 'Reflect in the x-axis: (x, y) → (x, −y).' },
          { do: 'Reflect it so it lands <b>to the left</b>.', goal: function (h) { return K.v(h, 'mvk') === 'ry'; }, yes: 'Reflect in the y-axis: (x, y) → (−x, y).' }
        ]),
        key: '<p><b>In the <i>x</i>-axis: change the sign of <i>y</i>. In the <i>y</i>-axis: change the sign of <i>x</i>.</b></p>',
        mistake: '<p>Mixing up the two axes. Reflecting in the <i>x</i>-axis flips up and down, because the <i>x</i>-axis is the horizontal mirror.</p>',
        check: [function () { return mc('Point (4, 3) is reflected in the <i>x</i>-axis. What is the image?', '(4, &minus;3)', ['(&minus;4, 3)', '(&minus;4, &minus;3)', '(3, 4)'], 'The <i>x</i>-axis is a horizontal mirror.', '(x, y) &rarr; (x, &minus;y).'); }, K.ck('sm-reflect', 1), K.ck('sm-reflect', 2)] },
      { id: 'rotate', title: 'Rotations about the origin', exp: ['E1.4'], skill: 'sm-rotate', hard: true,
        body: '<p>A <b>rotation</b> turns a shape around a point. The image is the same size and shape, but faces a different way.</p>',
        watch: K.slides([
          { say: 'Rotate triangle ABC 180&deg; about the origin.', fig: function () { return tri(); } },
          { say: 'A half turn: it lands in the opposite quadrant. Both signs change.', fig: function () { return tri(img('r180')); } },
          { say: '90&deg; clockwise: a quarter turn, like a clock hand. (x, y) &rarr; (y, &minus;x).', fig: function () { return tri(img('r90cw')); } },
          { say: 'A(1, 1) &rarr; (1, &minus;1). B(4, 1) &rarr; (1, &minus;4).', fig: eq('(4, 1) &rarr; (1, &minus;4)'), ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will rotate triangle DEF 90&deg; counterclockwise about the origin: a quarter turn, against the clock.', fig: function () { return def(); } },
          { say: 'The rule for 90&deg; counterclockwise is (x, y) &rarr; (&minus;y, x). I swap the numbers and change the sign of the first one.', fig: eq('(x, y) &rarr; (&minus;y, x)') },
          { say: 'D(1, 2) &rarr; (&minus;2, 1). E(3, 2) &rarr; (&minus;2, 3). F(3, 5) &rarr; (&minus;5, 3).', fig: eq('(1, 2) &rarr; (&minus;2, 1) &nbsp; (3, 2) &rarr; (&minus;2, 3) &nbsp; (3, 5) &rarr; (&minus;5, 3)') },
          { say: 'I check with the picture: the triangle made a quarter turn into the second quadrant.', fig: function () { return def('r90ccw'); }, ms: 2600 }
        ]),
        try: lab('mvk', [
          { do: 'Rotate the triangle into the <b>opposite quadrant</b>.', goal: function (h) { return K.v(h, 'mvk') === 'r180'; }, yes: '180°: (x, y) → (−x, −y).' },
          { do: 'Rotate it so B lands on <b>(&minus;1, 4)</b>.', goal: function (h) { return K.v(h, 'mvk') === 'r90ccw'; }, yes: '90° counterclockwise: (x, y) → (−y, x).' }
        ]),
        ways: [
          { label: 'Turn the page', html: '<p>Draw the shape on tracing paper with the axes. Put a pencil on the origin and turn the paper a quarter turn. Read the new coordinates.</p>' },
          { label: 'Follow one point', html: '<p>(4, 1) is 4 right, 1 up. A quarter turn clockwise turns "right" into "down" and "up" into "right": 1 right, 4 down, (1, &minus;4).</p>' },
          { label: 'Rules to check with', html: '<p>90&deg; clockwise: (x, y) &rarr; (y, &minus;x).<br>90&deg; counterclockwise: (x, y) &rarr; (&minus;y, x).<br>180&deg;: (x, y) &rarr; (&minus;x, &minus;y).</p>' }
        ],
        key: '<p><b>180&deg;: change both signs. 90&deg;: swap the numbers and change one sign.</b> Check with a picture.</p>',
        mistake: '<p>Swapping coordinates but forgetting the sign change, or turning the wrong way. Have the student trace and turn.</p>',
        check: [function () { return mc('Point Q(3, &minus;2) is rotated 180&deg; about the origin. Where does it land?', '(&minus;3, 2)', ['(3, 2)', '(&minus;2, 3)', '(&minus;3, &minus;2)'], 'Change the sign of both coordinates.', '(3, &minus;2) &rarr; (&minus;3, 2).'); }, K.ck('sm-rotate', 1), K.ck('sm-rotate', 2)] }
    ] },
    { id: 'dilate', title: 'Dilations', sub: 'Bigger or smaller, same shape.', concepts: [
      { id: 'scale', title: 'Scale factor', exp: ['E1.3'], skill: 'sm-dilate',
        body: '<p>A <b>dilation</b> makes a shape bigger or smaller from a centre point. With the centre at the origin, <b>multiply both coordinates by the scale factor</b>.</p>',
        watch: K.slides([
          { say: 'Triangle ABC: A(1, 1), B(3, 1), C(1, 2).', fig: function () { return plane([{ pts: [[1, 1], [3, 1], [1, 2]], col: 'var(--sb)', labs: ['A', 'B', 'C'] }], 10); } },
          { say: 'Scale factor 3: multiply every coordinate by 3. B(3, 1) &rarr; B\'(9, 3).', fig: function () { return plane([{ pts: [[1, 1], [3, 1], [1, 2]], col: 'var(--sb)', labs: ['A', 'B', 'C'] }, { pts: [[3, 3], [9, 3], [3, 6]], col: 'var(--se)', labs: ["A'", "B'", "C'"] }], 10); } },
          { say: 'Lines from the origin pass through each point and its image.', fig: function () { return plane([{ pts: [[1, 1], [3, 1], [1, 2]], col: 'var(--sb)', labs: ['A', 'B', 'C'] }, { pts: [[3, 3], [9, 3], [3, 6]], col: 'var(--se)', labs: ["A'", "B'", "C'"] }], 10, function (X, Y) { return [[3, 3], [9, 3], [3, 6]].map(function (p) { return '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(p[0]) + '" y2="' + Y(p[1]) + '" style="stroke:var(--ink2)" stroke-dasharray="4 4"/>'; }).join(''); }); } },
          { say: 'Side AB was 2 units. A\'B\' is 6 units: 3 times as long.', fig: eq('AB = 2 &nbsp; A\'B\' = 2 &times; 3 = 6'), ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will dilate triangle DEF by a scale factor of 2, from the origin.', fig: function () { return def(null, 0, 0, null, 10); } },
          { say: 'I multiply every coordinate by 2. D(1, 2) &rarr; (2, 4). E(3, 2) &rarr; (6, 4). F(3, 5) &rarr; (6, 10).', fig: function () { return def('dil', 2, 0, null, 10); } },
          { say: 'Side DE was 2 units long. D\'E\' is 4 units: twice as long.', fig: eq('DE = 2 &nbsp; D\'E\' = 2 &times; 2 = 4') },
          { say: 'A scale factor bigger than 1 enlarges. A scale factor between 0 and 1 would shrink it.', fig: eq('&times; 2 &rarr; twice as big'), ms: 2400 }
        ]),
        try: lab('dlk', [
          { do: 'Make the triangle <b>twice as big</b>.', goal: function (h) { return K.v(h, 'dlk') === 2; }, yes: 'Scale factor 2: every length doubles.' },
          { do: 'Make it <b>smaller</b>.', goal: function (h) { return K.v(h, 'dlk') < 1; }, yes: 'A scale factor between 0 and 1 shrinks the shape.' }
        ]),
        key: '<p><b>Multiply both coordinates (and every length) by the scale factor.</b> Bigger than 1 enlarges; between 0 and 1 shrinks.</p>',
        mistake: '<p>Adding the scale factor instead of multiplying: (3, 1) with factor 3 written as (6, 4).</p>',
        check: [function () { return mc('A triangle with vertex (6, 4) is dilated by a scale factor of 0.5 about the origin. Where does that vertex go?', '(3, 2)', ['(12, 8)', '(5.5, 3.5)', '(6, 2)'], 'Multiply both coordinates by 0.5.', '(3, 2).'); }, K.ck('sm-dilate', 1), K.ck('sm-dilate', 2)] },
      { id: 'similar', title: 'Similar shapes', exp: ['E1.3'], skill: 'sm-dilate',
        body: '<p>A dilated image is <b>similar</b> to the original: same shape, same angles, and every side in the same ratio.</p>',
        watch: K.slides([
          { say: 'A 4 cm by 6 cm rectangle, scale factor 2.5.', fig: eq('4 &times; 2.5 = 10 &nbsp;&nbsp; 6 &times; 2.5 = 15') },
          { say: 'The image is 10 cm by 15 cm. Each side is 2.5 times as long.', fig: eq('10 : 4 = 15 : 6 = 2.5') },
          { say: 'The angles are still right angles. Same shape, different size: similar.', fig: eq('similar: same angles, sides in the same ratio'), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. A triangle has sides of 3 cm, 4 cm and 5 cm. I enlarge it with a scale factor of 1.5.', fig: eq('3 cm, 4 cm, 5 cm &nbsp; &times; 1.5') },
          { say: 'I multiply every side by 1.5: 3 &times; 1.5 = 4.5, 4 &times; 1.5 = 6, and 5 &times; 1.5 = 7.5.', fig: eq('4.5 cm, 6 cm, 7.5 cm') },
          { say: 'I check the ratios. 4.5 &divide; 3, 6 &divide; 4 and 7.5 &divide; 5 all equal 1.5.', fig: eq('4.5 : 3 = 6 : 4 = 7.5 : 5 = 1.5') },
          { say: 'The angles do not change. Same angles, sides in the same ratio: the triangles are similar.', fig: eq('similar: same angles, sides in the same ratio'), ms: 2400 }
        ]),
        key: '<p><b>Similar: same angles, all sides multiplied by the same scale factor.</b></p>',
        mistake: '<p>Calling any two rectangles similar. A 2 by 3 and a 4 by 5 rectangle are not: 4 &divide; 2 = 2 but 5 &divide; 3 is not 2.</p>',
        check: [function () { return { q: 'A rectangle 4 cm by 6 cm is dilated by a scale factor of 2.5. How long is the longer side of the image?', type: 'num', answer: 15, unit: 'cm', hint: 'Multiply 6 by 2.5.', explain: '6 &times; 2.5 = 15 cm.' }; }, K.ck('sm-dilate', 3)] }
    ] }
  ];


  A.register('shapes-moves', {
    lessons: LESSONS,

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

  /* ---------- question shapes: more ways to practise each skill ---------- */
  var LET = ['A', 'B', 'C', 'D'];
  /* the plane with point P and four lettered points to tap; cands[i] is the point for letter i */
  function tapPlane(p, cands, lim) {
    return plane([{ pts: [p, p], col: 'var(--sb)', labs: ['P', ''], name: 'Point P' }], lim, function (X, Y) {
      return cands.map(function (c, i) {
        return '<g data-hit="' + i + '" aria-label="point ' + LET[i] + ' at (' + c[0] + ', ' + c[1] + ')"><circle cx="' + X(c[0]) + '" cy="' + Y(c[1]) + '" r="16" style="fill:transparent"/>' +
          '<circle cx="' + X(c[0]) + '" cy="' + Y(c[1]) + '" r="8" style="fill:var(--card);stroke:var(--se)" stroke-width="3"/>' +
          '<text x="' + (X(c[0]) + 11) + '" y="' + (Y(c[1]) + 18) + '" font-size="16" font-weight="700" style="fill:var(--se)">' + LET[i] + '</text></g>';
      }).join('');
    });
  }
  /* four different points on the grid: the right one plus likely mistakes, then points 2 squares away (so the tap targets never touch); none is P */
  function cands(p, right, wrongs, lim) {
    var list = [right], key = function (c) { return c.join(); };
    wrongs.concat([[right[0] + 2, right[1]], [right[0], right[1] - 2], [right[0] - 2, right[1] + 2], [right[0] + 2, right[1] + 2]]).forEach(function (w) {
      if (list.length < 4 && Math.abs(w[0]) <= lim && Math.abs(w[1]) <= lim && w.join() !== p.join() && !list.some(function (c) { return key(c) === key(w); })) list.push(w);
    });
    return R.shuffle(list);
  }
  function coordFill(lead, p) { return lead + ' <span class="math">(</span>[[]]<span class="math">, </span>[[]]<span class="math">)</span>'; }
  function moveTap(k, lv) {
    var lim = 8, p, img;
    do { p = [R.int(-6, 6), R.int(-6, 6)]; img = MOVES[k](p); } while (!p[0] || !p[1] || img.join() === p.join());
    var wrong = { rx: [MOVES.ry(p), MOVES.r180(p)], ry: [MOVES.rx(p), MOVES.r180(p)], r180: [MOVES.rx(p), MOVES.ry(p)], r90cw: [MOVES.r90ccw(p), MOVES.r180(p)], r90ccw: [MOVES.r90cw(p), MOVES.r180(p)] }[k];
    var cs = cands(p, img, wrong, lim), at = cs.findIndex(function (c) { return c.join() === img.join(); });
    return { q: 'Point P' + pt(p) + ' is given a ' + MNAME[k] + '. Tap where P\' lands.', type: 'tap', pic: tapPlane(p, cs, lim), answer: String(at), answerText: 'point ' + LET[at] + ' ' + pt(img),
      hint: 'The rule is ' + MRULE[k] + '.', steps: ['Use the rule ' + MRULE[k] + '.', 'P\' is ' + pt(img) + '.'],
      explain: 'P\'' + pt(img) + ' is point ' + LET[at] + '.', meta: { k: 'sm-move-tap', move: k, p: p, cands: cs } };
  }
  function moveFill(k) {
    var p; do { p = [R.int(-7, 7), R.int(-7, 7)]; } while (!p[0] || !p[1]);
    var img = MOVES[k](p);
    return { q: 'Point P' + pt(p) + ' is given a ' + MNAME[k] + '. Write the coordinates of P\'.', type: 'fill', fill: coordFill('P\'', p), answers: img,
      hint: 'The rule is ' + MRULE[k] + '.', steps: ['Use the rule ' + MRULE[k] + '.'], explain: 'P\' is ' + pt(img) + '.', meta: { k: 'sm-move-fill', move: k, p: p } };
  }
  var SOLKEYS = ['rect', 'tri', 'sqpyr', 'tripyr'];
  function fev(k) { var S = SOLIDS[k]; return S.F + ' faces, ' + S.E + ' edges, ' + S.V + ' vertices'; }
  Atlas.Q.shapes('shapes-moves', {
    'sm-solid': [
      [1, 'tap', function () {
        var keys = R.shuffle(['rect', 'cube', 'tri', 'sqpyr', 'tripyr', 'cyl']).slice(0, 4), at = R.int(0, 3);
        return { q: 'Tap the <b>' + SOLIDS[keys[at]].name.toLowerCase() + '</b>.', type: 'tap', tiles: keys.map(function (k) { return solid(k, 150); }), answer: at, answerText: SOLIDS[keys[at]].name,
          hint: 'Prisms have two matching bases. Pyramids come to a point.', steps: ['Look at the base shape, then at the top.'],
          explain: 'That is the ' + SOLIDS[keys[at]].name.toLowerCase() + '.', meta: { k: 'sm-solid-tap', keys: keys } };
      }],
      [1, 'match', function () {
        var keys = R.shuffle(SOLKEYS).slice(0, 3), pairs = keys.map(function (k) { return [SOLIDS[k].name, fev(k)]; });
        return { q: 'Match each solid to its faces, edges and vertices.', type: 'match', pairs: pairs,
          hint: 'A prism has 2 bases plus one side face for each side of the base. A pyramid has 1 base plus triangles.', steps: ['A triangular pyramid has the fewest: 4 faces.'],
          explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'sm-fev-match' } };
      }],
      [1, 'fill', function () {
        var k = R.pick(SOLKEYS), S = SOLIDS[k];
        return { q: 'Count the faces, edges and vertices of this ' + S.name.toLowerCase() + '.', type: 'fill', fill: 'Faces [[]] &nbsp; Edges [[]] &nbsp; Vertices [[]]', answers: [S.F, S.E, S.V], fig: solid(k),
          hint: 'Dashed lines are hidden edges. Count them too.', steps: ['Faces are the flat surfaces. Edges are where two faces meet. Vertices are the corners.'],
          explain: 'A ' + S.name.toLowerCase() + ' has ' + fev(k) + '.', meta: { k: 'sm-fev-fill', name: S.name } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), k = R.pick(SOLKEYS), S = SOLIDS[k], what = R.pick(['F', 'E', 'V']), nm = { F: 'faces', E: 'edges', V: 'vertices' }[what], truth = R.int(0, 1), said = truth ? S[what] : S[what] + R.pick([-1, 1]);
        var right = 'A ' + S.name.toLowerCase() + ' has ' + fev(k) + '.';
        return { q: who + ' says a <b>' + S.name.toLowerCase() + '</b> has <b>' + said + ' ' + nm + '</b>. True or false?', type: 'tf', answer: !!truth, fig: solid(k),
          why: K.why(right, ['Every solid has 6 faces.', 'Hidden edges do not count.']),
          hint: 'Count carefully, including the hidden (dashed) parts.', steps: [right], explain: right, meta: { k: 'sm-fev-tf', name: S.name, what: what, said: said } };
      }]
    ],
    'sm-view': [
      [1, 'fill', function () {
        var map, v;
        do { map = [[R.int(0, 3), R.int(0, 3), R.int(0, 3)], [R.int(1, 3), R.int(1, 3), R.int(1, 3)]]; v = views(map); } while (v.front.indexOf(0) >= 0);
        return { q: 'Look from the FRONT. How tall is each column of the front view, from left to right?', type: 'fill', fill: '[[]] &nbsp; [[]] &nbsp; [[]]', answers: v.front, fig: iso(map),
          hint: 'For each column, the tallest stack is what you see.', steps: ['Check each column from left to right, front and back rows together.'],
          explain: 'The front view has columns ' + v.front.join(', ') + ' cubes tall.', meta: { k: 'sm-front-fill', map: map } };
      }],
      [1, 'tap', function () {
        var map, v;
        do { map = [[R.int(0, 3), R.int(0, 3)], [R.int(1, 3), R.int(1, 3)]]; v = views(map); } while (v.front.indexOf(0) >= 0 || v.side.indexOf(0) >= 0 || v.front.join() === v.side.join() || v.front.join() === v.front.slice().reverse().join() || v.side.join() === v.front.slice().reverse().join());
        var sets = R.shuffle([v.front, v.side, v.front.slice().reverse()]), at = sets.indexOf(v.front);
        return { q: 'Tap the <b>front</b> view of this building.', type: 'tap', tiles: sets.map(function (c) { return view(c, 'View'); }), answer: at, answerText: 'columns ' + v.front.join(', '), fig: iso(map),
          hint: 'Stand at the FRONT label. Left stays left.', steps: ['The tallest stacks in each column, left to right: ' + v.front.join(', ') + '.'],
          explain: 'The front view has columns ' + v.front.join(', ') + '.', meta: { k: 'sm-front-tap', map: map, sets: sets } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), map, v;
        do { map = [[R.int(0, 3), R.int(0, 3)], [R.int(1, 3), R.int(1, 3)]]; v = views(map); } while (v.front.indexOf(0) >= 0 || v.side.indexOf(0) >= 0 || v.front.join() === v.side.join());
        var truth = R.int(0, 1), said = truth ? v.front : v.side;
        var right = 'From the front, the columns are ' + v.front.join(', ') + ' cubes tall.';
        return { q: who + ' says this is the <b>front</b> view of the building. True or false?', type: 'tf', answer: !!truth, fig: iso(map) + view(said, 'Claimed front view'),
          why: K.why(right, ['The front view is the same as the side view.', 'Only the front row of cubes shows in the front view.']),
          hint: 'Stand at the FRONT label and look at each column.', steps: [right], explain: right, meta: { k: 'sm-front-tf', map: map, said: said } };
      }]
    ],
    'sm-translate': [
      [1, 'tap', function () {
        var lim = 8, p, a, b, img;
        do { p = [R.int(-5, 5), R.int(-5, 5)]; a = R.int(-4, 4); b = R.int(-4, 4); img = [p[0] + a, p[1] + b]; } while (!a || !b || Math.abs(img[0]) > 7 || Math.abs(img[1]) > 7);
        var cs = cands(p, img, [[p[0] + b, p[1] + a], [p[0] - a, p[1] + b], [p[0] + a, p[1] - b]], lim), at = cs.findIndex(function (c) { return c.join() === img.join(); });
        var dir = Math.abs(a) + (a > 0 ? ' right' : ' left') + ' and ' + Math.abs(b) + (b > 0 ? ' up' : ' down');
        return { q: 'Point P' + pt(p) + ' is translated ' + dir + '. Tap where it lands.', type: 'tap', pic: tapPlane(p, cs, lim), answer: String(at), answerText: 'point ' + LET[at] + ' ' + pt(img),
          hint: 'Move along the x-axis first, then up or down.', steps: [pt(p) + ' &rarr; ' + pt(img) + '.'],
          explain: 'P\' is ' + pt(img) + ', point ' + LET[at] + '.', meta: { k: 'sm-tr-tap', p: p, a: a, b: b, cands: cs } };
      }],
      [1, 'fill', function () {
        var p = [R.int(-6, 6), R.int(-6, 6)], a = R.int(-5, 5) || 3, b = R.int(-5, 5) || -2;
        var dir = Math.abs(a) + (a > 0 ? ' right' : ' left') + ' and ' + Math.abs(b) + (b > 0 ? ' up' : ' down');
        return { q: 'Point P' + pt(p) + ' is translated ' + dir + '. Write the coordinates of P\'.', type: 'fill', fill: coordFill('P\'', p), answers: [p[0] + a, p[1] + b],
          hint: 'Right and left change x. Up and down change y.', steps: ['x: ' + sg(p[0]) + (a < 0 ? ' &minus; ' + (-a) : ' + ' + a) + ' = ' + sg(p[0] + a) + '.', 'y: ' + sg(p[1]) + (b < 0 ? ' &minus; ' + (-b) : ' + ' + b) + ' = ' + sg(p[1] + b) + '.'],
          explain: 'P\' is ' + pt([p[0] + a, p[1] + b]) + '.', meta: { k: 'sm-tr-fill', p: p, a: a, b: b } };
      }],
      [1, 'story', function () {
        var who = K.name(), p = [R.int(-4, 4), R.int(-4, 4)], a = R.int(1, 4) * R.pick([1, -1]), b = R.int(1, 4) * R.pick([1, -1]), place = R.pick(['the library', 'the rink', 'the bakery', 'the park gate']);
        var walk = Math.abs(a) + ' block' + (Math.abs(a) > 1 ? 's' : '') + (a > 0 ? ' east' : ' west') + ' and ' + Math.abs(b) + ' block' + (Math.abs(b) > 1 ? 's' : '') + (b > 0 ? ' north' : ' south');
        return { q: 'On a town map grid, ' + place + ' is at ' + pt(p) + '. ' + who + ' starts there and walks ' + walk + '. Where does ' + who + ' end up?', type: 'fill', fill: coordFill(who + ' is at', p), answers: [p[0] + a, p[1] + b],
          hint: 'East and west change x. North and south change y.', steps: ['x: ' + sg(p[0]) + (a < 0 ? ' &minus; ' + (-a) : ' + ' + a) + ' = ' + sg(p[0] + a) + '.', 'y: ' + sg(p[1]) + (b < 0 ? ' &minus; ' + (-b) : ' + ' + b) + ' = ' + sg(p[1] + b) + '.'],
          explain: who + ' ends up at ' + pt([p[0] + a, p[1] + b]) + '.', meta: { k: 'sm-tr-story', p: p } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), p = [R.int(-5, 5), R.int(-5, 5)], a = R.int(1, 5), b = R.int(1, 5), truth = R.int(0, 1), said = truth ? [p[0] - a, p[1] + b] : [p[0] + a, p[1] - b];
        var right = 'Left takes away from x and up adds to y: ' + pt(p) + ' &rarr; ' + pt([p[0] - a, p[1] + b]) + '.';
        return { q: who + ' translates P' + pt(p) + ' <b>' + a + ' left and ' + b + ' up</b> and gets ' + pt(said) + '. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Left adds to x and up takes away from y.', 'A translation does not change the coordinates.']),
          hint: 'Which way is left on the x-axis?', steps: [right], explain: right, meta: { k: 'sm-tr-tf', p: p, a: -a, b: b, said: said } };
      }]
    ],
    'sm-reflect': [
      [1, 'tap', function () { return moveTap(R.pick(['rx', 'ry'])); }],
      [1, 'fill', function () { return moveFill(R.pick(['rx', 'ry'])); }],
      [2, 'mistake', function () {
        var who = K.name(), p; do { p = [R.int(-7, 7), R.int(-7, 7)]; } while (!p[0] || !p[1] || Math.abs(p[0]) === Math.abs(p[1]));
        var k = R.pick(['rx', 'ry']), truth = R.int(0, 1), said = truth ? MOVES[k](p) : MOVES[k === 'rx' ? 'ry' : 'rx'](p);
        var right = 'In the ' + (k === 'rx' ? 'x' : 'y') + '-axis, the ' + (k === 'rx' ? 'y' : 'x') + '-coordinate changes sign: ' + MRULE[k] + '. So P\' is ' + pt(MOVES[k](p)) + '.';
        return { q: who + ' reflects P' + pt(p) + ' in the <i>' + (k === 'rx' ? 'x' : 'y') + '</i>-axis and gets ' + pt(said) + '. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['In the x-axis, the x-coordinate changes sign.', 'A reflection changes the sign of both coordinates.']),
          hint: 'Which coordinate measures the distance from that axis?', steps: [right], explain: right, meta: { k: 'sm-move-tf', move: k, p: p, said: said } };
      }]
    ],
    'sm-rotate': [
      [1, 'tap', function (lv) { return moveTap(lv === 1 ? 'r180' : R.pick(['r90cw', 'r90ccw', 'r180'])); }],
      [1, 'fill', function (lv) { return moveFill(lv === 1 ? 'r180' : R.pick(['r90cw', 'r90ccw', 'r180'])); }],
      [2, 'mistake', function () {
        var who = K.name(), p; do { p = [R.int(-7, 7), R.int(-7, 7)]; } while (!p[0] || !p[1] || Math.abs(p[0]) === Math.abs(p[1]));
        var k = R.pick(['r90cw', 'r90ccw']), truth = R.int(0, 1), said = truth ? MOVES[k](p) : MOVES[k === 'r90cw' ? 'r90ccw' : 'r90cw'](p);
        var right = 'The rule for a ' + MNAME[k] + ' is ' + MRULE[k] + '. So P\' is ' + pt(MOVES[k](p)) + '.';
        return { q: who + ' gives P' + pt(p) + ' a ' + MNAME[k] + ' and gets ' + pt(said) + '. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Clockwise and counterclockwise give the same point.', 'A 90&deg; rotation only changes the signs.']),
          hint: 'Turn the grid in your mind, or use the rule.', steps: [right], explain: right, meta: { k: 'sm-move-tf', move: k, p: p, said: said } };
      }]
    ],
    'sm-dilate': [
      [1, 'fill', function (lv) {
        var k = lv === 1 ? R.pick([2, 3]) : R.pick([0.5, 1.5, 2, 3]), p = [R.int(-4, 4) * 2, R.int(-4, 4) * 2];
        return { q: 'Point P' + pt(p) + ' is dilated by a scale factor of ' + k + ' about the origin. Write the coordinates of P\'.', type: 'fill', fill: coordFill('P\'', p), answers: MOVES.dil(p, k),
          hint: 'Multiply both coordinates by ' + k + '.', steps: [sg(p[0]) + ' &times; ' + k + ' = ' + sg(p[0] * k) + ' and ' + sg(p[1]) + ' &times; ' + k + ' = ' + sg(p[1] * k) + '.'],
          explain: 'P\' is ' + pt(MOVES.dil(p, k)) + '.', meta: { k: 'sm-dil-fill', p: p, f: k } };
      }],
      [1, 'tap', function () {
        var lim = 8, p; do { p = [R.int(-3, 3), R.int(-3, 3)]; } while (!p[0] || !p[1]);
        var img = MOVES.dil(p, 2), cs = cands(p, img, [[p[0] + 2, p[1] + 2], [p[0] * 2, p[1]], [p[0], p[1] * 2]], lim), at = cs.findIndex(function (c) { return c.join() === img.join(); });
        return { q: 'Point P' + pt(p) + ' is dilated by a scale factor of 2 about the origin. Tap where P\' lands.', type: 'tap', pic: tapPlane(p, cs, lim), answer: String(at), answerText: 'point ' + LET[at] + ' ' + pt(img),
          hint: 'P\' is twice as far from the origin, in the same direction.', steps: ['Multiply both coordinates by 2: ' + pt(img) + '.'],
          explain: 'P\' is ' + pt(img) + ', point ' + LET[at] + '.', meta: { k: 'sm-dil-tap', p: p, f: 2, cands: cs } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), k = R.pick([2, 3]), p; do { p = [R.int(1, 5), R.int(1, 5)]; } while (p[0] * k === p[0] + k || p[1] * k === p[1] + k); /* adding k must give a different point */
        var truth = R.int(0, 1), said = truth ? MOVES.dil(p, k) : [p[0] + k, p[1] + k];
        var right = 'A dilation multiplies each coordinate by the scale factor: ' + pt(p) + ' &rarr; ' + pt(MOVES.dil(p, k)) + '.';
        return { q: who + ' dilates P' + pt(p) + ' by a scale factor of ' + k + ' and gets ' + pt(said) + '. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['A dilation adds the scale factor to each coordinate.', 'A dilation only changes the x-coordinate.']),
          hint: 'Scale factor means multiply.', steps: [right], explain: right, meta: { k: 'sm-dil-tf', p: p, f: k, said: said } };
      }]
    ]
  });
})();
