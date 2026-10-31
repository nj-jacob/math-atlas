(function () {
  var A = Atlas, R = A.R;
  /* fit polygon points (math coordinates, y up) into a w by h box; returns svg points string */
  function fit(pts, w, h, pad) {
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    var sc = Math.min((w - 2 * pad) / Math.max(1e-6, maxx - minx), (h - 2 * pad) / Math.max(1e-6, maxy - miny));
    var ox = (w - (maxx - minx) * sc) / 2, oy = (h - (maxy - miny) * sc) / 2;
    return pts.map(function (p) { return [ox + (p[0] - minx) * sc, h - (oy + (p[1] - miny) * sc)]; });
  }
  function poly(P, fill) {
    return '<polygon points="' + P.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" style="fill:' + (fill || 'color-mix(in srgb,var(--strand) 22%,var(--card))') + ';stroke:var(--strand)" stroke-width="3" stroke-linejoin="round"/>';
  }
  function bySides(a, b, c) { return a === b && b === c ? 'equilateral' : a === b || b === c || a === c ? 'isosceles' : 'scalene'; }
  function byAngles(x, y, z) { var m = Math.max(x, y, z); return m === 90 ? 'right' : m > 90 ? 'obtuse' : 'acute'; }
  function an(word) { return /^[aeiou]/.test(word) ? 'an ' + word : 'a ' + word; }

  /* coordinate grid 0..10 with a scale; items: [{x,y,label,colour}] in grid units, polys: [{pts,fill}] */
  function grid(scale, items, polys, size) {
    var u = size || 30, o = 40, W = o + 10 * u + 16, s = '';
    for (var i = 0; i <= 10; i++) {
      s += '<line x1="' + (o + i * u) + '" y1="10" x2="' + (o + i * u) + '" y2="' + (10 + 10 * u) + '" style="stroke:var(--line)" stroke-width="1"/>' +
        '<line x1="' + o + '" y1="' + (10 + i * u) + '" x2="' + (o + 10 * u) + '" y2="' + (10 + i * u) + '" style="stroke:var(--line)" stroke-width="1"/>';
      if (i % (scale >= 5 ? 2 : 1) === 0 || scale < 5) {
        s += '<text x="' + (o + i * u) + '" y="' + (28 + 10 * u) + '" text-anchor="middle" font-size="14" class="t2">' + i * scale + '</text>' +
          '<text x="' + (o - 6) + '" y="' + (14 + (10 - i) * u) + '" text-anchor="end" font-size="14" class="t2">' + i * scale + '</text>';
      }
    }
    s += '<line x1="' + o + '" y1="' + (10 + 10 * u) + '" x2="' + (o + 10 * u) + '" y2="' + (10 + 10 * u) + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + o + '" y1="10" x2="' + o + '" y2="' + (10 + 10 * u) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    (polys || []).forEach(function (p) {
      s += '<polygon points="' + p.pts.map(function (q) { return (o + q[0] * u) + ',' + (10 + (10 - q[1]) * u); }).join(' ') + '" style="fill:' + p.fill + ';stroke:' + (p.stroke || 'var(--ink)') + '" stroke-width="2.5" stroke-linejoin="round"' + (p.dash ? ' stroke-dasharray="6 4"' : '') + '/>';
    });
    (items || []).forEach(function (it) {
      var cx = o + it.x * u, cy = 10 + (10 - it.y) * u;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="6" style="fill:' + (it.c || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>' +
        (it.label ? '<text x="' + (cx + 9) + '" y="' + (cy - 8) + '" class="tb" font-size="14">' + it.label + '</text>' : '');
    });
    return A.svg(W, 10 * u + 36, s, 'Coordinate grid');
  }

  /* views of a building: h is a 3x3 array of heights, rows from back (0) to front (2), columns left to right */
  var S = 22, K = 0.866 * S, HH = 0.5 * S;
  function iso(h) {
    var mz = 4, ox = 3 * K + 12, oy = mz * S + 12, s = '';
    function P(x, y, z) { return (ox + (x - y) * K).toFixed(1) + ',' + (oy + (x + y) * HH - z * S).toFixed(1); }
    for (var sum = 0; sum <= 4; sum++) for (var x = 0; x < 3; x++) {
      var y = sum - x; if (y < 0 || y > 2) continue;
      for (var z = 0; z < h[y][x]; z++) {
        s += '<polygon points="' + [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)].join(' ') + '" style="fill:color-mix(in srgb,var(--strand) 35%,var(--card));stroke:var(--ink)" stroke-width="1"/>' +
          '<polygon points="' + [P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)].join(' ') + '" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1"/>' +
          '<polygon points="' + [P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)].join(' ') + '" style="fill:color-mix(in srgb,var(--strand) 65%,var(--ink));stroke:var(--ink)" stroke-width="1"/>';
      }
    }
    return A.svg(Math.ceil(6 * K + 24), Math.ceil(6 * HH + mz * S + 24), s, '3D drawing of a building made of cubes');
  }
  function front(h) { return [0, 1, 2].map(function (x) { return Math.max(h[0][x], h[1][x], h[2][x]); }); }
  function side(h) { return [2, 1, 0].map(function (y) { return Math.max.apply(null, h[y]); }); }
  function view(cols, label) {
    var s = '', c = 30;
    cols.forEach(function (n, i) { for (var z = 0; z < n; z++) s += '<rect x="' + (4 + i * c) + '" y="' + (4 + (3 - z) * c) + '" width="' + c + '" height="' + c + '" style="fill:color-mix(in srgb,var(--strand) 30%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>'; });
    s += '<line x1="2" y1="' + (4 + 4 * c) + '" x2="' + (6 + 3 * c) + '" y2="' + (4 + 4 * c) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(3 * c + 8, 4 * c + 8, s, label);
  }
  function top(h, nums) {
    var s = '', c = 38;
    for (var y = 0; y < 3; y++) for (var x = 0; x < 3; x++) if (h[y][x] > 0 || nums) {
      s += '<rect x="' + (4 + x * c) + '" y="' + (4 + y * c) + '" width="' + c + '" height="' + c + '" style="fill:' + (h[y][x] ? 'color-mix(in srgb,var(--strand) 30%,var(--card))' : 'var(--card)') + ';stroke:' + (h[y][x] ? 'var(--ink)' : 'var(--line)') + '" stroke-width="1.5"/>' +
        (nums && h[y][x] ? '<text x="' + (4 + x * c + c / 2) + '" y="' + (4 + y * c + c / 2 + 6) + '" text-anchor="middle" class="tb" font-size="18">' + h[y][x] + '</text>' : '');
    }
    return A.svg(3 * c + 8, 3 * c + 8, s, 'Top view' + (nums ? ' with the number of cubes in each stack' : ''));
  }
  /* a triangle picture with tick marks on equal sides (ticks: side indexes) and an angle mark at a corner */
  function triPic(pts, ticks, corner, kind, w, h) {
    w = w || 150; h = h || 120;
    var P = fit(pts, w, h, 16), s = poly(P);
    (ticks || []).forEach(function (i) {
      var a = P[i], b = P[(i + 1) % 3], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy), nx = -dy / L * 7, ny = dx / L * 7;
      s += '<line x1="' + (mx - nx) + '" y1="' + (my - ny) + '" x2="' + (mx + nx) + '" y2="' + (my + ny) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    });
    if (corner !== undefined && corner !== null) {
      var c = P[corner], u = P[(corner + 1) % 3], v = P[(corner + 2) % 3];
      var ux = u[0] - c[0], uy = u[1] - c[1], vx = v[0] - c[0], vy = v[1] - c[1], lu = Math.sqrt(ux * ux + uy * uy), lv = Math.sqrt(vx * vx + vy * vy), r = 14;
      ux /= lu; uy /= lu; vx /= lv; vy /= lv;
      if (kind === 'right') s += '<path d="M' + (c[0] + ux * r) + ' ' + (c[1] + uy * r) + ' L' + (c[0] + (ux + vx) * r) + ' ' + (c[1] + (uy + vy) * r) + ' L' + (c[0] + vx * r) + ' ' + (c[1] + vy * r) + '" fill="none" style="stroke:var(--bad)" stroke-width="2.5"/>';
      else s += '<path d="M' + (c[0] + ux * r) + ' ' + (c[1] + uy * r) + ' A' + r + ' ' + r + ' 0 0 ' + (ux * vy - uy * vx > 0 ? 1 : 0) + ' ' + (c[0] + vx * r) + ' ' + (c[1] + vy * r) + '" fill="none" style="stroke:var(--bad)" stroke-width="2.5"/>';
    }
    return A.svg(w, h, s, 'Triangle');
  }
  function triGallery() {
    var f = function (pic, name, def) { return '<figure>' + pic + '<figcaption><b>' + name + '</b><br>' + def + '</figcaption></figure>'; };
    return '<p><b>By sides</b> (marks show equal sides)</p><div class="pies thumbs">' +
      f(triPic([[0, 0], [2, 0], [1, 1.732]], [0, 1, 2]), 'Equilateral', '3 equal sides') +
      f(triPic([[0, 0], [2, 0], [1, 2.6]], [1, 2]), 'Isosceles', '2 equal sides') +
      f(triPic([[0, 0], [3, 0], [0.8, 1.6]], []), 'Scalene', 'no equal sides') + '</div>' +
      '<p><b>By angles</b> (the red mark shows the angle that decides)</p><div class="pies thumbs">' +
      f(triPic([[0, 0], [2.4, 0], [1.3, 1.8]], [], 2, 'arc'), 'Acute', 'all angles under 90&deg;') +
      f(triPic([[0, 0], [2.4, 0], [0, 1.6]], [], 0, 'right'), 'Right', 'one angle exactly 90&deg;') +
      f(triPic([[0, 0], [3, 0], [-0.9, 1.1]], [], 0, 'arc'), 'Obtuse', 'one angle over 90&deg;') + '</div>';
  }
  /* triangle from its angles (a at left, b at right), each angle written inside its corner */
  function angTri(a, b, c, hide) {
    var ra = a * Math.PI / 180, rb = b * Math.PI / 180, d = Math.sin(rb) / Math.sin(ra + rb);
    var P = fit([[0, 0], [1, 0], [d * Math.cos(ra), d * Math.sin(ra)]], 340, 210, 42), deg = [a, b, c], t = '';
    P.forEach(function (V, i) {
      var U = P[(i + 1) % 3], W = P[(i + 2) % 3], ux = U[0] - V[0], uy = U[1] - V[1], wx = W[0] - V[0], wy = W[1] - V[1];
      var lu = Math.hypot(ux, uy), lw = Math.hypot(wx, wy), bx = ux / lu + wx / lw, by = uy / lu + wy / lw, lb = Math.hypot(bx, by);
      var r = -26;
      t += '<text x="' + (V[0] + bx / lb * r).toFixed(1) + '" y="' + (V[1] + by / lb * r + 6).toFixed(1) + '" text-anchor="middle" class="tb" font-size="18">' + (i === hide ? '?' : deg[i] + '°') + '</text>';
    });
    return A.svg(340, 210, poly(P) + t, 'Triangle with angles ' + deg.map(function (v, i) { return i === hide ? 'unknown' : v + ' degrees'; }).join(', '));
  }
  /* triangle from its side lengths (a is the base), each side labelled in cm */
  function sideTri(a, b, c) {
    var x = (a * a + b * b - c * c) / (2 * a), y = Math.sqrt(Math.max(0, b * b - x * x));
    var P = fit([[0, 0], [a, 0], [x, y]], 340, 200, 40);
    function mid(p, q, v, dy, anc) { return '<text x="' + ((p[0] + q[0]) / 2 + (anc === 'end' ? -8 : anc === 'start' ? 8 : 0)).toFixed(1) + '" y="' + ((p[1] + q[1]) / 2 + dy).toFixed(1) + '" text-anchor="' + anc + '" class="tb" font-size="18">' + v + ' cm</text>'; }
    return A.svg(340, 200, poly(P) + mid(P[0], P[1], a, 26, 'middle') + mid(P[0], P[2], b, 0, 'end') + mid(P[1], P[2], c, 0, 'start'), 'Triangle with sides ' + a + ', ' + b + ' and ' + c + ' cm');
  }
  /* two shapes side by side, drawn to the same scale: [{w,h,lean,label}] */
  function pair(list) {
    var u = 22, x = 20, s = '', H = 0;
    list.forEach(function (r) { H = Math.max(H, r.h); });
    list.forEach(function (r, i) {
      var lean = r.lean ? r.h * u * 0.4 : 0, top = 16 + (H - r.h) * u, bot = 16 + H * u, lw = r.label.length * 10.5, sw = r.w * u + lean;
      if (lw > sw) x += (lw - sw) / 2;
      s += '<polygon points="' + [[x + lean, top], [x + lean + r.w * u, top], [x + r.w * u, bot], [x, bot]].map(function (q) { return q.join(','); }).join(' ') + '" style="fill:' + (i ? 'color-mix(in srgb,var(--hi) 55%,var(--card))' : 'color-mix(in srgb,var(--strand) 25%,var(--card))') + ';stroke:var(--ink)" stroke-width="2.5"/>' +
        '<text x="' + (x + lean / 2 + r.w * u / 2) + '" y="' + (bot + 26) + '" text-anchor="middle" class="tb" font-size="18">' + r.label + '</text>';
      x += sw + Math.max(0, (lw - sw) / 2) + 40;
    });
    return A.svg(x - 20, 16 + H * u + 40, s, list.map(function (r) { return r.label; }).join(' and '));
  }
  /* three sticks: a base and two sides hinged at its ends, swung up to meet if they can */
  function sticks(b, l, r) {
    var sc = 34, x0 = 30, y0 = 130, s = '', ok = l + r > b && l + b > r && r + b > l;
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + b * sc) + '" y2="' + y0 + '" style="stroke:var(--strand)" stroke-width="7" stroke-linecap="round"/>';
    if (ok) {
      var x = (l * l - r * r + b * b) / (2 * b), y = Math.sqrt(Math.max(0, l * l - x * x));
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + x * sc) + '" y2="' + (y0 - y * sc) + '" style="stroke:var(--pm1)" stroke-width="7" stroke-linecap="round"/><line x1="' + (x0 + b * sc) + '" y1="' + y0 + '" x2="' + (x0 + x * sc) + '" y2="' + (y0 - y * sc) + '" style="stroke:var(--good)" stroke-width="7" stroke-linecap="round"/>';
    } else {
      s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + l * sc * 0.6) + '" y2="' + (y0 - l * sc * 0.8) + '" style="stroke:var(--pm1)" stroke-width="7" stroke-linecap="round"/><line x1="' + (x0 + b * sc) + '" y1="' + y0 + '" x2="' + (x0 + b * sc - r * sc * 0.6) + '" y2="' + (y0 - r * sc * 0.8) + '" style="stroke:var(--good)" stroke-width="7" stroke-linecap="round"/>' +
        '<text x="' + (x0 + b * sc / 2) + '" y="' + 22 + '" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--bad)">gap: the ends cannot meet</text>';
    }
    s += '<text x="' + (x0 + b * sc / 2) + '" y="' + (y0 + 26) + '" text-anchor="middle" font-size="17" font-weight="700">' + b + ' cm</text>';
    return A.svg(x0 * 2 + b * sc, y0 + 34, s, 'Sticks of ' + l + ', ' + r + ' and ' + b + ' cm' + (ok ? ' make a triangle' : ' do not meet'));
  }
  function moves() {
    return '<div class="pies thumbs">' +
      '<figure>' + grid(1, [], [{ pts: [[1, 1], [4, 1], [1, 4]], fill: 'color-mix(in srgb,var(--strand) 30%,var(--card))' }, { pts: [[5, 4], [8, 4], [5, 7]], fill: 'color-mix(in srgb,var(--hi) 55%,var(--card))' }], 13) + '<figcaption><b>Translation</b><br>slide</figcaption></figure>' +
      '<figure>' + grid(1, [], [{ pts: [[5, 0], [5, 10], [5, 10]], fill: 'none', stroke: 'var(--bad)', dash: 1 }, { pts: [[1, 2], [4, 2], [4, 6]], fill: 'color-mix(in srgb,var(--strand) 30%,var(--card))' }, { pts: [[9, 2], [6, 2], [6, 6]], fill: 'color-mix(in srgb,var(--hi) 55%,var(--card))' }], 13) + '<figcaption><b>Reflection</b><br>flip over a line</figcaption></figure>' +
      '<figure>' + grid(1, [{ x: 5, y: 5, c: 'var(--bad)' }], [{ pts: [[5, 5], [9, 5], [5, 7]], fill: 'color-mix(in srgb,var(--strand) 30%,var(--card))' }, { pts: [[5, 5], [5, 1], [7, 5]], fill: 'color-mix(in srgb,var(--hi) 55%,var(--card))' }], 13) + '<figcaption><b>Rotation</b><br>turn about a point</figcaption></figure></div>';
  }
  A.fig = A.fig || {};
  var BUILD = {
    steps: [[0, 0, 0], [1, 2, 3], [1, 1, 2]],
    tower: [[0, 1, 0], [1, 3, 1], [0, 1, 0]],
    ell: [[2, 0, 0], [2, 0, 0], [2, 1, 1]],
    wall: [[0, 0, 0], [0, 0, 0], [2, 2, 2]]
  };

  A.fig.moves = moves; A.fig.triGallery = triGallery; A.fig.angTri = angTri;


  /* ---------- Lessons: one idea per screen (assets/lesson.js) ---------- */
  var KIT = A.kit;
  function P(id, lv) { return KIT.P('shapes-grids', id, lv); }
  function wrap(svg) { return '<div class="g5-anim">' + svg + '</div>'; }
  /* geoboard triangle tests: squared side lengths and the dot product at each corner */
  function tri(s) {
    if (!s.closed || s.sides !== 3) return null;
    var p = s.points, d = [], dot = [];
    for (var i = 0; i < 3; i++) {
      var a = p[i], b = p[(i + 1) % 3], c = p[(i + 2) % 3];
      d.push((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
      dot.push((b[0] - a[0]) * (c[0] - a[0]) + (b[1] - a[1]) * (c[1] - a[1]));
    }
    if (!s.area) return null;
    return { iso: d[0] === d[1] || d[1] === d[2] || d[0] === d[2], right: dot.indexOf(0) >= 0, obtuse: dot.some(function (x) { return x < 0; }) };
  }
  var FILL = 'color-mix(in srgb,var(--strand) 30%,var(--card))', FILL2 = 'color-mix(in srgb,var(--hi) 55%,var(--card))';
  var LESSONS = [
    { id: 'triangles', title: 'Kinds of triangles', sub: 'Named by sides and by angles.', concepts: [
      { id: 'by-sides', title: 'Named by sides', exp: ['E1.1'], skill: 'sg-tri',
        body: '<p><b>Equilateral</b>: 3 equal sides. <b>Isosceles</b>: 2 equal sides. <b>Scalene</b>: no equal sides. Tick marks show which sides are equal.</p>',
        watch: KIT.watch([
          { say: 'Equilateral: all 3 sides are equal. The marks show it.', fig: wrap(triPic([[0, 0], [2, 0], [1, 1.732]], [0, 1, 2], null, null, 220, 180)) },
          { say: 'Isosceles: 2 sides are equal.', fig: wrap(triPic([[0, 0], [2, 0], [1, 2.6]], [1, 2], null, null, 220, 180)) },
          { say: 'Scalene: no sides are equal.', fig: wrap(triPic([[0, 0], [3, 0], [0.8, 1.6]], [], null, null, 220, 180)), ms: 2000 }
        ]),
        try: { tool: 'geoboard', opts: {}, tasks: [
          { do: 'Tap pegs to make an <b>isosceles</b> triangle. Tap the first peg again to close it.', goal: function (s) { var t = tri(s); return t && t.iso; }, yes: 'Yes. Two sides are the same length.' },
          { do: 'Now make a <b>scalene</b> triangle: no two sides the same.', goal: function (s) { var t = tri(s); return t && !t.iso; }, yes: 'Yes. Every side is a different length.' }
        ] },
        key: '<p>Equilateral: 3 equal sides. Isosceles: 2 equal sides. Scalene: 0 equal sides.</p>',
        check: [P('sg-tri', 1), P('sg-tri', 1)] },

      { id: 'by-angles', title: 'Named by angles', exp: ['E1.1'], skill: 'sg-tri',
        body: '<p><b>Right</b>: one angle is exactly 90&deg;. <b>Obtuse</b>: one angle is more than 90&deg;. <b>Acute</b>: every angle is less than 90&deg;.</p>',
        watch: { tool: 'geoboard', opts: {}, steps: [
          { say: 'A right triangle has a square corner, exactly 90&deg;.', act: function (t) { return t.shape([[0, 0], [0, 3], [3, 3]], 300); } },
          { say: 'An obtuse triangle has one wide corner, more than 90&deg;.', act: function (t) { return t.shape([[0, 2], [1, 4], [4, 4]], 300); } },
          { say: 'An acute triangle has three sharp corners, all less than 90&deg;.', act: function (t) { return t.shape([[2, 0], [0, 3], [4, 4]], 300); }, ms: 2000 }
        ] },
        try: { tool: 'geoboard', opts: {}, tasks: [
          { do: 'Make a <b>right</b> triangle.', goal: function (s) { var t = tri(s); return t && t.right; }, yes: 'Yes. It has a square corner.' },
          { do: 'Make an <b>obtuse</b> triangle.', goal: function (s) { var t = tri(s); return t && t.obtuse; }, yes: 'Yes. One corner is wider than a square corner.' }
        ] },
        key: '<p>Check the <b>biggest</b> angle. Exactly 90&deg;: right. More: obtuse. Less: acute.</p>',
        mistake: '<p>Calling a triangle acute because it has some sharp corners. Every triangle has at least two acute angles. Only the biggest angle decides.</p>',
        check: [P('sg-tri', 2), P('sg-tri', 2)] },

      { id: 'angle-sum', title: 'The angles add to 180&deg;', exp: ['E1.1'], skill: 'sg-tri', hard: true,
        body: '<p>The three angles of every triangle add up to <b>180&deg;</b>. If you know two angles, you can find the third.</p>',
        watch: KIT.watch([
          { say: 'An equilateral triangle: 60&deg; + 60&deg; + 60&deg; = 180&deg;.', fig: wrap(angTri(60, 60, 60)) },
          { say: 'Change the shape: 40&deg; + 70&deg; + 70&deg; = 180&deg;.', fig: wrap(angTri(40, 70, 70)) },
          { say: 'Two angles are 90&deg; and 35&deg;. What is the third?', fig: wrap(angTri(90, 35, 55, 2)) },
          { say: '180 &minus; 90 &minus; 35 = <b>55&deg;</b>.', fig: wrap(angTri(90, 35, 55)), ms: 2200 }
        ]),
        try: KIT.widget('shapes-grids', 0, 'Nice. Try two big angles, like 100° and 90°. What goes wrong?'),
        ways: [
          { label: 'Tear the corners', html: '<p>Cut out a paper triangle and tear off its three corners. Put the points together: they make a straight line, which is 180&deg;.</p>' },
          { label: 'Half a square', html: '<p>A square has four 90&deg; corners: 360&deg;. Cut it along a diagonal and each triangle gets half: 180&deg;.</p>' }
        ],
        key: '<p><b>Angles in a triangle add to 180&deg;.</b> Missing angle = 180&deg; minus the other two.</p>',
        mistake: '<p>Forgetting to subtract both known angles, or drawing a triangle with two right angles. Two right angles already make 180&deg;, leaving nothing for the third corner.</p>',
        check: [P('sg-tri', 3), P('sg-tri', 2)] },

      { id: 'side-rule', title: 'Can these sides make a triangle?', exp: ['E1.1'], skill: 'sg-tri', hard: true,
        body: '<p>Not every three lengths make a triangle. The two shorter sides together must be <b>longer</b> than the longest side.</p>',
        watch: KIT.watch([
          { say: 'Sticks of 4 cm, 5 cm and 7 cm. 4 + 5 = 9, longer than 7.', fig: wrap(sticks(7, 4, 5)) },
          { say: 'They meet: a triangle.', fig: wrap(sideTri(7, 4, 5)) },
          { say: 'Sticks of 2 cm, 3 cm and 8 cm. 2 + 3 = 5, shorter than 8.', fig: wrap(sticks(8, 2, 3)) },
          { say: 'The ends cannot meet. <b>No triangle</b>.', fig: wrap(sticks(8, 2, 3)), ms: 2200 }
        ]),
        try: KIT.widget('shapes-grids', 1, 'Good. Find three lengths where the two short sides add up to exactly the long one.'),
        ways: [
          { label: 'Arms', html: '<p>The two short sides are arms reaching from the ends of the long side. If together they are too short, their hands cannot touch.</p>' },
          { label: 'Exactly equal', html: '<p>3 cm, 4 cm and 7 cm: 3 + 4 = 7 exactly. The sides lie flat on top of the long side. That is a line, not a triangle.</p>' }
        ],
        key: '<p><b>Short + short &gt; long</b>, or there is no triangle.</p>',
        mistake: '<p>Thinking any three sticks make a triangle. Use real strips of paper cut to the lengths and try it.</p>',
        check: [function () {
          var a = R.int(2, 6), b = R.int(2, 6), ok = R.int(0, 1), c = ok ? R.int(Math.abs(a - b) + 1, a + b - 1) : a + b + R.int(0, 3);
          return KIT.mc('Can sides of ' + a + ' cm, ' + b + ' cm and ' + c + ' cm make a triangle?', ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], { fig: sticks(Math.max(a, b, c), Math.min(a, b, c), a + b + c - Math.max(a, b, c) - Math.min(a, b, c)), hint: 'Add the two shorter sides. Is the total longer than the longest side?', explain: ok ? 'The two shorter sides add to more than the longest, so they meet.' : 'The two shorter sides are not longer than the longest side, so the ends cannot meet.' });
        }, P('sg-tri', 1)] }
    ] },

    { id: 'congruent', title: 'Congruent shapes', sub: 'Same size, same shape.', concepts: [
      { id: 'congruent', title: 'Same size and shape', exp: ['E1.2'], skill: 'sg-cong',
        body: '<p>Two shapes are <b>congruent</b> if one fits exactly on the other after a slide, turn or flip. Stretching or shrinking breaks it.</p>',
        watch: KIT.watch([
          { say: 'A 5 by 3 rectangle.', fig: wrap(grid(1, [], [{ pts: [[1, 2], [6, 2], [6, 5], [1, 5]], fill: FILL }], 26)) },
          { say: 'Turn it a quarter turn: 3 by 5. Same size and shape, so <b>congruent</b>.', fig: wrap(grid(1, [], [{ pts: [[1, 2], [6, 2], [6, 5], [1, 5]], fill: FILL }, { pts: [[7, 1], [10, 1], [10, 6], [7, 6]], fill: FILL2 }], 26)) },
          { say: 'Stretch it to 5 by 4. Different size: <b>not congruent</b>.', fig: wrap(grid(1, [], [{ pts: [[1, 2], [6, 2], [6, 5], [1, 5]], fill: FILL }, { pts: [[4, 6], [9, 6], [9, 10], [4, 10]], fill: 'color-mix(in srgb,var(--bad) 30%,var(--card))' }], 26)), ms: 2200 }
        ]),
        try: KIT.widget('shapes-grids', 2, 'Nice. Only "made bigger" and "squashed" break congruence.'),
        key: '<p>Slide, turn or flip: <b>congruent</b>. Stretch or shrink: <b>not congruent</b>.</p>',
        mistake: '<p>Deciding a turned shape is different because it "points another way". Trace one shape on paper and lay it over the other.</p>',
        check: [P('sg-cong', 1), P('sg-cong', 2)] }
    ] },

    { id: 'views', title: 'Views of objects', sub: 'Top, front and side.', concepts: [
      { id: 'views', title: 'Top, front and side views', exp: ['E1.3'], skill: 'sg-views', hard: true,
        body: '<p>The <b>top view</b> is what you see from above. The <b>front</b> and <b>side</b> views show the tallest stack in each column, like a shadow on a wall.</p>',
        watch: KIT.watch([
          { say: 'A building made of cube stacks.', fig: wrap(iso(BUILD.steps)) },
          { say: 'From the top, you see where the stacks stand. The numbers say how tall.', fig: wrap(top(BUILD.steps, true)) },
          { say: 'From the front, each column shows its tallest stack.', fig: wrap(view(front(BUILD.steps), 'Front view')) },
          { say: 'From the right side, the same idea going back to front.', fig: wrap(view(side(BUILD.steps), 'Side view')), ms: 2200 }
        ]),
        try: KIT.widget('shapes-grids', 3, 'Good. Try the tower. Which views look the same?'),
        ways: [
          { label: 'Shadow', html: '<p>Shine a torch on the building from the front. The shadow on the wall is the front view: flat, showing only heights.</p>' },
          { label: 'Row of stacks', html: '<div class="pies"><figure>' + iso([[0, 0, 0], [0, 0, 0], [2, 1, 3]]) + '<figcaption>stacks of 2, 1, 3</figcaption></figure><figure>' + view([2, 1, 3], 'Front view') + '<figcaption>front view</figcaption></figure></div>' }
        ],
        key: '<p>Front and side views are <b>flat</b>. Each column shows its <b>tallest</b> stack.</p>',
        mistake: '<p>Drawing hidden cubes in a front view, or drawing it in 3D. Build it with real cubes and look with one eye closed at table height.</p>',
        check: [P('sg-views', 1), P('sg-views', 2)] }
    ] },

    { id: 'coords', title: 'Coordinates', sub: 'Across, then up.', concepts: [
      { id: 'plot', title: 'Plot a point', exp: ['E1.4'], skill: 'sg-coord',
        body: '<p>A point is named by an <b>ordered pair</b> (x, y). Start at the origin (0, 0). Go <b>across</b> x, then <b>up</b> y.</p>',
        watch: KIT.watch([
          { say: 'Plot (4, 6). Start at the origin, (0, 0).', fig: wrap(grid(1, [{ x: 0, y: 0, label: '(0, 0)', c: 'var(--strand)' }], [], 26)) },
          { say: 'Go 4 across.', fig: wrap(grid(1, [{ x: 4, y: 0, c: 'var(--strand)' }], [{ pts: [[0, 0], [4, 0], [4, 0]], fill: 'none', stroke: 'var(--accent)' }], 26)) },
          { say: 'Then 6 up.', fig: wrap(grid(1, [{ x: 4, y: 6, label: '(4, 6)' }], [{ pts: [[0, 0], [4, 0], [4, 0]], fill: 'none', stroke: 'var(--accent)' }, { pts: [[4, 0], [4, 6], [4, 6]], fill: 'none', stroke: 'var(--pm1)' }], 26)) },
          { say: '(6, 4) is a different point. Order matters.', fig: wrap(grid(1, [{ x: 4, y: 6, label: '(4, 6)' }, { x: 6, y: 4, label: '(6, 4)', c: 'var(--strand)' }], [], 26)), ms: 2200 }
        ]),
        try: KIT.widget('shapes-grids', 4, 'Nice. Change the scale to count by 5. The point moves to bigger numbers.'),
        key: '<p><b>Across first, then up.</b> "Walk to the ladder, then climb it."</p>',
        mistake: '<p>Mixing up the order, so (2, 5) is plotted at (5, 2). Say "across, then up" every time, and trace with a finger.</p>',
        check: [P('sg-coord', 1), P('sg-coord', 2)] }
    ] },

    { id: 'transform', title: 'Transformations', sub: 'Slide, flip and turn.', concepts: [
      { id: 'moves', title: 'Slide, flip and turn', exp: ['E1.5'], skill: 'sg-trans', hard: true,
        body: '<p>A <b>translation</b> slides a shape. A <b>reflection</b> flips it over a line. A <b>rotation</b> turns it about a point. The shape stays congruent.</p>',
        watch: KIT.watch([
          { say: 'A triangle on the grid.', fig: wrap(grid(1, [], [{ pts: [[1, 1], [4, 1], [1, 4]], fill: FILL }], 26)) },
          { say: '<b>Translation</b>: slide 4 right and 3 up. Every point moves the same way.', fig: wrap(grid(1, [], [{ pts: [[1, 1], [4, 1], [1, 4]], fill: FILL }, { pts: [[5, 4], [8, 4], [5, 7]], fill: FILL2 }], 26)) },
          { say: '<b>Reflection</b> in the line x = 5: each point lands the same distance on the other side.', fig: wrap(grid(1, [], [{ pts: [[5, 0], [5, 10], [5, 10]], fill: 'none', stroke: 'var(--bad)', dash: 1 }, { pts: [[1, 1], [4, 1], [1, 4]], fill: FILL }, { pts: [[9, 1], [6, 1], [9, 4]], fill: FILL2 }], 26)) },
          { say: '<b>Rotation</b> a half turn about (5, 5).', fig: wrap(grid(1, [{ x: 5, y: 5, c: 'var(--bad)' }], [{ pts: [[1, 1], [4, 1], [1, 4]], fill: FILL }, { pts: [[9, 9], [6, 9], [9, 6]], fill: FILL2 }], 26)), ms: 2200 }
        ]),
        try: KIT.widget('shapes-grids', 5, 'Good. Try each kind and check that the shape never changes size.'),
        ways: [
          { label: 'Track one corner', html: '<p>Follow just one corner. Translation: count across and up. Reflection: count to the line, then the same on the other side. Then draw the rest.</p>' },
          { label: 'Tracing paper', html: '<p>Trace the shape. Slide the paper (translation), flip it over (reflection), or pin one point and turn it (rotation).</p>' },
          { label: 'All three', html: A.fig.moves() }
        ],
        key: '<p>Slide, flip and turn change <b>where</b> a shape is, never its <b>size or shape</b>.</p>',
        mistake: '<p>Moving the corners by different amounts in a translation, or reflecting to the wrong distance. Have the child move one corner at a time and count squares aloud.</p>',
        check: [P('sg-trans', 1), P('sg-trans', 2)] }
    ] }
  ];
  A.register('shapes-grids', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Kinds of triangles</h2>' +
'<p>Triangles are named by their <b>sides</b> and by their <b>angles</b>. The three angles of every triangle add up to <b>180&deg;</b>.</p>' +
triGallery() +
'<div class="lab"><span class="lt">Try it: build a triangle from two angles</span>' +
'<div class="ctrl"><label for="ta">Left angle: <output id="tao"></output><input type="range" id="ta" min="10" max="150" step="5" value="60"></label>' +
'<label for="tb">Right angle: <output id="tbo"></output><input type="range" id="tb" min="10" max="150" step="5" value="60"></label></div>' +
'<div class="fig" id="tfig"></div><div class="out" id="tout"></div></div>' +
'<div class="eg"><p><b>Example.</b> A triangle has angles of 90&deg;, 45&deg; and 45&deg;. It is a right triangle. It is also isosceles, because two angles are equal, so two sides are equal.</p><div class="fig">' + triPic([[0, 0], [2, 0], [0, 2]], [0, 2], 0, 'right', 220, 170) + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>A triangle can have at most one right angle or one obtuse angle. Two of them would already add to 180&deg; or more.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Building triangles from side lengths</h2>' +
'<p>You can construct a triangle from three side lengths with a ruler and compass. But not every three lengths work. The two shorter sides together must be <b>longer</b> than the longest side.</p>' +
'<div class="lab"><span class="lt">Try it: three sides</span>' +
'<div class="ctrl"><label for="sa">Base (cm): <output id="sao"></output><input type="range" id="sa" min="2" max="12" value="8"></label>' +
'<label for="sb">Left side (cm): <output id="sbo"></output><input type="range" id="sb" min="2" max="12" value="6"></label>' +
'<label for="sc">Right side (cm): <output id="sco"></output><input type="range" id="sc" min="2" max="12" value="6"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking any three sticks make a triangle. Sides of 2 cm, 3 cm and 8 cm cannot meet: 2 + 3 is only 5, which is shorter than 8.</p><div class="fig">' + sticks(8, 2, 3) + '</div></div>' +
'<div class="eg"><p><b>Example.</b> Can sides of 4 cm, 5 cm and 7 cm make a triangle? 4 + 5 = 9, which is more than 7. <b>Yes</b>.</p><div class="fig">' + sticks(7, 4, 5) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Congruent shapes</h2>' +
'<p>Two shapes are <b>congruent</b> if they are exactly the same size and shape. One would fit exactly on top of the other after you slide, turn or flip it. Matching sides are equal, and matching angles are equal.</p>' +
'<div class="lab"><span class="lt">Try it: is it congruent?</span>' +
'<div class="ctrl"><label for="cs">Shape<select id="cs"><option value="tri">Triangle</option><option value="rect">Rectangle</option><option value="para">Parallelogram</option></select></label>' +
'<label for="cm">Second shape is the first one<select id="cm"><option value="slide">slid over</option><option value="turn">turned</option><option value="flip">flipped</option><option value="grow">made bigger</option><option value="squash">squashed</option></select></label></div>' +
'<div class="fig" id="cfig"></div><div class="out" id="cout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Sliding, turning and flipping never change size or shape, so they always give a congruent shape. Stretching or shrinking does not.</p></div>' +
'<div class="eg"><p><b>Example.</b> A rectangle 3 cm by 5 cm and a rectangle 5 cm by 3 cm are congruent. One is the other turned a quarter turn.</p><div class="fig">' + grid(1, [], [{ pts: [[1, 2], [6, 2], [6, 5], [1, 5]], fill: 'color-mix(in srgb,var(--strand) 30%,var(--card))' }, { pts: [[7, 1], [10, 1], [10, 6], [7, 6]], fill: 'color-mix(in srgb,var(--hi) 55%,var(--card))' }], 26) + '</div><p class="t2">Orange: 5 by 3. Yellow: 3 by 5, the same rectangle turned.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Views of objects</h2>' +
'<p>A 3D object looks different from different sides. The <b>top view</b> is what you see from above. The <b>front view</b> and <b>side view</b> show the tallest stack in each column, like a shadow on a wall.</p>' +
'<div class="lab"><span class="lt">Try it: look from three sides</span>' +
'<div class="ctrl"><label for="vb">Building<select id="vb"><option value="steps">Steps</option><option value="tower">Tower</option><option value="ell">L-shape</option><option value="wall">Wall</option></select></label></div>' +
'<div class="fig" id="vfig"></div><div class="views" id="vviews"></div><div class="out" id="vout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Drawing hidden cubes in a front view. A front view is flat. It only shows how tall each column is, not how deep.</p></div>' +
'<div class="eg"><p><b>Example.</b> Stacks of 2, 1 and 3 cubes stand in a row from left to right. The front view is three columns of 2, 1 and 3 squares.</p><div class="pies"><figure>' + iso([[0, 0, 0], [0, 0, 0], [2, 1, 3]]) + '<figcaption>the stacks</figcaption></figure><figure>' + view([2, 1, 3], 'Front view') + '<figcaption>front view</figcaption></figure></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Coordinates</h2>' +
'<p>A <b>coordinate grid</b> has a horizontal <b>x-axis</b> and a vertical <b>y-axis</b>. A point is named by an <b>ordered pair</b> (x, y): first go across, then go up. The point (0, 0) is called the origin. The axes can count by 1s, 2s, 5s or more. That is the <b>scale</b>.</p>' +
'<div class="lab"><span class="lt">Try it: plot and move a point</span>' +
'<div class="ctrl"><label for="gs">Scale<select id="gs"><option value="1">count by 1</option><option value="2">count by 2</option><option value="5">count by 5</option></select></label>' +
'<label for="gx">Across: <output id="gxo"></output><input type="range" id="gx" min="0" max="10" value="2"></label>' +
'<label for="gy">Up: <output id="gyo"></output><input type="range" id="gy" min="0" max="10" value="3"></label>' +
'<label for="gr">Move right: <output id="gro"></output><input type="range" id="gr" min="-5" max="5" value="4"></label>' +
'<label for="gu">Move up: <output id="guo"></output><input type="range" id="gu" min="-5" max="5" value="2"></label></div>' +
'<div class="fig" id="gfig"></div><div class="out" id="gout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up the order. (2, 5) and (5, 2) are different points. Across first, then up: "walk to the ladder, then climb it".</p><div class="fig">' + grid(1, [{ x: 2, y: 5, label: '(2, 5)' }, { x: 5, y: 2, label: '(5, 2)', c: 'var(--strand)' }], [], 26) + '</div></div>' +
'<div class="eg"><p><b>Example.</b> To plot (4, 6), start at the origin (0, 0). Go 4 across, then 6 up.</p><div class="fig">' + grid(1, [{ x: 4, y: 6, label: '(4, 6)' }], [{ pts: [[0, 0], [4, 0], [4, 0]], fill: 'none', stroke: 'var(--accent)' }, { pts: [[4, 0], [4, 6], [4, 6]], fill: 'none', stroke: 'var(--pm1)' }], 26) + '</div><p class="t2">Teal: 4 across. Orange: 6 up.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Translations, reflections and rotations</h2>' +
moves() +
'<ul><li>A <b>translation</b> slides a shape. Every point moves the same distance in the same direction.</li>' +
'<li>A <b>reflection</b> flips a shape over a line, like a mirror. Each point ends up the same distance from the line, on the other side.</li>' +
'<li>A <b>rotation</b> turns a shape around a point. A quarter turn is 90&deg;, and a half turn is 180&deg;.</li></ul>' +
'<div class="lab"><span class="lt">Try it: transform a triangle</span>' +
'<div class="ctrl"><label for="xt">Transformation<select id="xt"><option value="tr">translation</option><option value="rv">reflection in the line x = 5</option><option value="rh">reflection in the line y = 5</option><option value="r90">rotation 90&deg; clockwise about (5, 5)</option><option value="r180">rotation 180&deg; about (5, 5)</option></select></label>' +
'<label for="xr">Right: <output id="xro"></output><input type="range" id="xr" min="0" max="6" value="4"></label>' +
'<label for="xu">Up: <output id="xuo"></output><input type="range" id="xu" min="0" max="6" value="3"></label></div>' +
'<div class="fig" id="xfig"></div><div class="out" id="xout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>All three transformations give a congruent shape. Only the position, and sometimes the direction it faces, changes.</p></div>' +
'<div class="eg"><p><b>Example.</b> Reflect (2, 3) in the line x = 5. The point is 3 units left of the line, so its image is 3 units right of it: <b>(8, 3)</b>.</p><div class="fig">' + grid(1, [{ x: 2, y: 3, label: '(2, 3)', c: 'var(--strand)' }, { x: 8, y: 3, label: '(8, 3)' }], [{ pts: [[5, 0], [5, 10], [5, 10]], fill: 'none', stroke: 'var(--bad)', dash: 1 }, { pts: [[2, 3], [8, 3], [8, 3]], fill: 'none', stroke: 'var(--accent)', dash: 1 }], 26) + '</div></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function tri() {
        var a = +$('#ta', root).value, b = +$('#tb', root).value, c = 180 - a - b, o = $('#tout', root);
        $('#tao', root).textContent = a + '°'; $('#tbo', root).textContent = b + '°';
        if (c <= 0) { $('#tfig', root).innerHTML = ''; o.innerHTML = '<p>' + a + '&deg; + ' + b + '&deg; = ' + (a + b) + '&deg;. That leaves no room for a third angle. The two angles must add up to less than 180&deg;.</p>'; return; }
        var ra = a * Math.PI / 180, rb = b * Math.PI / 180, d = Math.sin(rb) / Math.sin(ra + rb);
        var P = fit([[0, 0], [1, 0], [d * Math.cos(ra), d * Math.sin(ra)]], 360, 200, 30);
        var lab = '<text x="' + (P[0][0] + 22) + '" y="' + (P[0][1] - 8) + '" class="tb" font-size="17">' + a + '°</text><text x="' + (P[1][0] - 22) + '" y="' + (P[1][1] - 8) + '" text-anchor="end" class="tb" font-size="17">' + b + '°</text><text x="' + P[2][0] + '" y="' + (P[2][1] + (P[2][1] < 40 ? 30 : -10)) + '" text-anchor="middle" class="tb" font-size="17">' + c + '°</text>';
        $('#tfig', root).innerHTML = A.svg(360, 200, poly(P) + lab, 'Triangle with angles ' + a + ', ' + b + ' and ' + c + ' degrees');
        var sides = a === b && b === c ? 'equilateral' : a === b || b === c || a === c ? 'isosceles' : 'scalene';
        o.innerHTML = '<p>Third angle: 180&deg; &minus; ' + a + '&deg; &minus; ' + b + '&deg; = <b>' + c + '&deg;</b></p><p><span class="big">' + an(byAngles(a, b, c)).replace(/^./, function (x) { return x.toUpperCase(); }) + ', ' + sides + ' triangle</span></p>' +
          '<p>' + (sides === 'scalene' ? 'No angles are equal, so no sides are equal.' : 'Equal angles sit opposite equal sides.') + '</p>';
      }
      A.bind(root, ['ta', 'tb'], tri);

      function sid() {
        var a = +$('#sa', root).value, b = +$('#sb', root).value, c = +$('#sc', root).value, o = $('#sout', root);
        $('#sao', root).textContent = a; $('#sbo', root).textContent = b; $('#sco', root).textContent = c;
        var m = Math.max(a, b, c), rest = a + b + c - m;
        if (rest <= m) {
          var L = fit([[0, 0], [a, 0], [0, 3]], 360, 120, 20);
          var u = (L[1][0] - L[0][0]) / a, y0 = 90;
          var s0 = '<line x1="30" y1="' + y0 + '" x2="' + (30 + a * u) + '" y2="' + y0 + '" style="stroke:var(--strand)" stroke-width="4"/>' +
            '<line x1="30" y1="' + y0 + '" x2="' + (30 + b * u * 0.94) + '" y2="' + (y0 - b * u * 0.34) + '" style="stroke:var(--ink)" stroke-width="3"/>' +
            '<line x1="' + (30 + a * u) + '" y1="' + y0 + '" x2="' + (30 + a * u - c * u * 0.94) + '" y2="' + (y0 - c * u * 0.34) + '" style="stroke:var(--ink)" stroke-width="3"/>';
          $('#sfig', root).innerHTML = A.svg(Math.max(360, 60 + a * u), 110, s0, 'The sides do not meet');
          o.innerHTML = '<p><b style="color:var(--bad)">No triangle.</b> The two shorter sides add to ' + rest + ' cm, which is not longer than ' + m + ' cm, so they cannot meet.</p>';
          return;
        }
        var x = (a * a + b * b - c * c) / (2 * a), y = Math.sqrt(Math.max(0, b * b - x * x));
        var P = fit([[0, 0], [a, 0], [x, y]], 360, 220, 30);
        function mid(p, q, t, dy) { return '<text x="' + ((p[0] + q[0]) / 2) + '" y="' + ((p[1] + q[1]) / 2 + dy) + '" text-anchor="middle" class="tb" font-size="17">' + t + ' cm</text>'; }
        $('#sfig', root).innerHTML = A.svg(360, 220, poly(P) + mid(P[0], P[1], a, 20) + mid(P[0], P[2], b, -6).replace('text-anchor="middle"', 'text-anchor="end"') + mid(P[1], P[2], c, -6).replace('text-anchor="middle"', 'text-anchor="start"'), 'Triangle with sides ' + a + ', ' + b + ' and ' + c + ' cm');
        var big = m * m, sq = a * a + b * b + c * c - big, ang = big === sq ? 'right' : big > sq ? 'obtuse' : 'acute';
        o.innerHTML = '<p><span class="big">' + an(bySides(a, b, c)).replace(/^./, function (x) { return x.toUpperCase(); }) + ' triangle</span></p><p>' +
          (bySides(a, b, c) === 'equilateral' ? 'All three sides are equal.' : bySides(a, b, c) === 'isosceles' ? 'Two sides are equal.' : 'No two sides are equal.') + ' It is also ' + an(ang) + ' triangle.</p>';
      }
      A.bind(root, ['sa', 'sb', 'sc'], sid);

      function con() {
        var sh = $('#cs', root).value, mv = $('#cm', root).value, base;
        if (sh === 'tri') base = [[0, 0], [4, 0], [1, 3]];
        else if (sh === 'rect') base = [[0, 0], [4, 0], [4, 2], [0, 2]];
        else base = [[0, 0], [4, 0], [5, 2], [1, 2]];
        var u = 26, s0 = '';
        function draw(pts, ox, oy, fill) {
          return '<polygon points="' + pts.map(function (p) { return (ox + p[0] * u) + ',' + (oy - p[1] * u); }).join(' ') + '" style="fill:' + fill + ';stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
        }
        var B;
        if (mv === 'slide') B = base;
        else if (mv === 'turn') B = base.map(function (p) { return [3 - p[1], p[0]]; });
        else if (mv === 'flip') B = base.map(function (p) { return [5 - p[0], p[1]]; });
        else if (mv === 'grow') B = base.map(function (p) { return [p[0] * 1.5, p[1] * 1.5]; });
        else B = base.map(function (p) { return [p[0], p[1] * 0.5]; });
        var minx = Math.min.apply(null, B.map(function (p) { return p[0]; })), miny = Math.min.apply(null, B.map(function (p) { return p[1]; }));
        B = B.map(function (p) { return [p[0] - minx, p[1] - miny]; });
        s0 += draw(base, 20, 200, 'color-mix(in srgb,var(--strand) 30%,var(--card))') + '<text x="20" y="226" class="tb" font-size="13">First shape</text>';
        s0 += draw(B, 200, 200, 'color-mix(in srgb,var(--hi) 55%,var(--card))') + '<text x="200" y="226" class="tb" font-size="13">Second shape</text>';
        $('#cfig', root).innerHTML = A.svg(400, 234, s0, 'Two shapes side by side');
        var yes = mv === 'slide' || mv === 'turn' || mv === 'flip';
        $('#cout', root).innerHTML = '<p><span class="big">' + (yes ? 'Congruent' : 'Not congruent') + '</span></p><p>' +
          (yes ? 'The shape was ' + (mv === 'slide' ? 'slid' : mv === 'turn' ? 'turned' : 'flipped') + '. Every side and angle stays the same, so it would fit exactly on top.' : mv === 'grow' ? 'Every side got 1.5 times as long. Same shape, different size, so it is not congruent.' : 'The height was cut in half. The sides and angles changed, so it is not congruent.') + '</p>';
      }
      A.bind(root, ['cs', 'cm'], con);

      function vw() {
        var h = BUILD[$('#vb', root).value], cubes = h.reduce(function (t, r) { return t + r.reduce(function (x, y) { return x + y; }, 0); }, 0);
        $('#vfig', root).innerHTML = iso(h) + '<p class="t2" style="font-size:.85rem;text-align:center;margin:0">Front is the bottom left side. Right side is the bottom right side.</p>';
        $('#vviews', root).innerHTML = '<div class="vrow"><figure><figcaption>Top view (numbers show stack height)</figcaption>' + top(h, true) + '</figure><figure><figcaption>Front view</figcaption>' + view(front(h), 'Front view') + '</figure><figure><figcaption>Right side view</figcaption>' + view(side(h), 'Right side view') + '</figure></div>';
        $('#vout', root).innerHTML = '<p>This building uses <b>' + cubes + '</b> cubes. The front view shows column heights ' + front(h).filter(function (n) { return n; }).join(', ') + ' from left to right.</p>';
      }
      A.bind(root, ['vb'], vw);

      function co() {
        var sc = +$('#gs', root).value, x = +$('#gx', root).value, y = +$('#gy', root).value, dx = +$('#gr', root).value, dy = +$('#gu', root).value;
        $('#gxo', root).textContent = x * sc; $('#gyo', root).textContent = y * sc; $('#gro', root).textContent = dx * sc; $('#guo', root).textContent = dy * sc;
        var nx = Math.max(0, Math.min(10, x + dx)), ny = Math.max(0, Math.min(10, y + dy)), clip = nx !== x + dx || ny !== y + dy;
        $('#gfig', root).innerHTML = grid(sc, [{ x: x, y: y, label: 'A', c: 'var(--strand)' }, { x: nx, y: ny, label: 'B' }], [{ pts: [[x, y], [nx, y], [nx, ny]], fill: 'none', stroke: 'var(--accent)', dash: true }]);
        function dir(v, pos, neg) { return v === 0 ? '' : Math.abs(v * sc) + ' ' + (v > 0 ? pos : neg); }
        var moves = [dir(nx - x, 'right', 'left'), dir(ny - y, 'up', 'down')].filter(Boolean).join(' and ');
        $('#gout', root).innerHTML = '<p><span class="big">A(' + x * sc + ', ' + y * sc + ') &rarr; B(' + nx * sc + ', ' + ny * sc + ')</span></p><p>' + (moves ? 'The translation is ' + moves + '.' : 'The point did not move.') + (clip ? ' (The point stopped at the edge of the grid.)' : '') + '</p>';
      }
      A.bind(root, ['gs', 'gx', 'gy', 'gr', 'gu'], co);

      function tf() {
        var t = $('#xt', root).value, dx = +$('#xr', root).value, dy = +$('#xu', root).value, T = [[1, 1], [4, 1], [1, 3]], I, why;
        $('#xro', root).textContent = dx; $('#xuo', root).textContent = dy;
        $('#xr', root).disabled = $('#xu', root).disabled = t !== 'tr';
        if (t === 'tr') { I = T.map(function (p) { return [p[0] + dx, p[1] + dy]; }); why = 'Every point moved ' + dx + ' right and ' + dy + ' up.'; }
        else if (t === 'rv') { I = T.map(function (p) { return [10 - p[0], p[1]]; }); why = 'Each point is the same distance from the line x = 5, on the other side.'; }
        else if (t === 'rh') { I = T.map(function (p) { return [p[0], 10 - p[1]]; }); why = 'Each point is the same distance from the line y = 5, on the other side.'; }
        else if (t === 'r90') { I = T.map(function (p) { return [p[1], 10 - p[0]]; }); why = 'The triangle turned a quarter turn clockwise around (5, 5).'; }
        else { I = T.map(function (p) { return [10 - p[0], 10 - p[1]]; }); why = 'The triangle turned a half turn around (5, 5). It now points the opposite way.'; }
        var items = [{ x: 5, y: 5, c: 'var(--card)' }];
        if (t === 'r90' || t === 'r180') items = [{ x: 5, y: 5, label: '(5, 5)', c: 'var(--bad)' }];
        var polys = [{ pts: T, fill: 'color-mix(in srgb,var(--strand) 35%,transparent)' }, { pts: I, fill: 'color-mix(in srgb,var(--hi) 60%,transparent)' }];
        if (t === 'rv') polys.push({ pts: [[5, 0], [5, 10]], fill: 'none', stroke: 'var(--bad)', dash: true });
        if (t === 'rh') polys.push({ pts: [[0, 5], [10, 5]], fill: 'none', stroke: 'var(--bad)', dash: true });
        $('#xfig', root).innerHTML = grid(1, t === 'r90' || t === 'r180' ? items : [], polys);
        function nm(P) { return P.map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }).join(', '); }
        $('#xout', root).innerHTML = '<p>Orange triangle: ' + nm(T) + '<br>Yellow image: <b>' + nm(I) + '</b></p><p>' + why + '</p>';
      }
      A.bind(root, ['xt', 'xr', 'xu'], tf);
    },

    quiz: [
      { q: 'A triangle has sides of 5 cm, 5 cm and 8 cm. What kind of triangle is it?', fig: sideTri(8, 5, 5), type: 'mc', options: ['Equilateral', 'Isosceles', 'Scalene', 'Right'], answer: 1, hint: 'How many sides are equal?', explain: 'Two equal sides make it isosceles.' },
      { q: 'Two angles of a triangle are 50&deg; and 70&deg;. What is the third angle?', fig: angTri(50, 70, 60, 2), type: 'num', answer: 60, unit: '&deg;', hint: 'The angles add up to 180&deg;.', explain: '180 &minus; 50 &minus; 70 = 60&deg;.' },
      { q: 'Which three side lengths can make a triangle?', type: 'mc', options: ['2 cm, 3 cm, 8 cm', '4 cm, 4 cm, 9 cm', '5 cm, 6 cm, 9 cm', '1 cm, 2 cm, 3 cm'], answer: 2, hint: 'The two shorter sides must add up to more than the longest side.', explain: '5 + 6 = 11, which is more than 9. The others are too short.' },
      { q: 'Shape B is shape A flipped over a line. Are they congruent?', fig: grid(1, [], [{ pts: [[1, 2], [4, 2], [1, 6]], fill: 'color-mix(in srgb,var(--strand) 25%,var(--card))' }, { pts: [[5, 0], [5, 10], [5, 10]], fill: 'none', stroke: 'var(--bad)', dash: 1 }, { pts: [[9, 2], [6, 2], [9, 6]], fill: 'color-mix(in srgb,var(--hi) 55%,var(--card))' }], 24), type: 'mc', options: ['Yes, a flip keeps the same size and shape', 'No, a flip changes the shape', 'Only if the shape is a square'], answer: 0, hint: 'Does flipping change any side lengths?', explain: 'Reflections, translations and rotations always give congruent shapes.' },
      { q: 'Point P is at (3, 7). It is translated 4 right and 2 down. Where does it end up?', fig: grid(1, [{ x: 3, y: 7, label: 'P', c: 'var(--strand)' }], [], 24), type: 'mc', options: ['(7, 5)', '(7, 9)', '(5, 3)', '(1, 11)'], answer: 0, hint: 'Right changes the first number. Down changes the second.', explain: '3 + 4 = 7 and 7 &minus; 2 = 5, so (7, 5).' },
      { q: 'A grid counts by 5s. A point is 3 lines across and 4 lines up. What are its coordinates?', type: 'mc', options: ['(3, 4)', '(15, 20)', '(20, 15)', '(8, 9)'], answer: 1, hint: 'Each line is worth 5.', explain: '3 &times; 5 = 15 and 4 &times; 5 = 20, so (15, 20).' },
      { q: 'A building has stacks of 1, 3 and 2 cubes in a row from left to right. How many squares are in its front view?', fig: iso([[0, 0, 0], [0, 0, 0], [1, 3, 2]]), type: 'num', answer: 6, unit: 'squares', hint: 'The front view shows each stack as a column of squares.', explain: '1 + 3 + 2 = 6 squares.' }
    ],

    quick: ['sg-tri', 'sg-tri', 'sg-cong', 'sg-views', 'sg-coord', 'sg-trans'],

    practice: [
      { id: 'sg-tri', name: 'Classify triangles', code: 'E1.1', gen: function (lv) {
        if (lv === 3) {
          var a = R.int(3, 14) * 5, b = R.int(3, 14) * 5;
          while (a + b >= 170) b = R.int(3, 10) * 5;
          var c = 180 - a - b;
          return { q: 'Two angles of a triangle are ' + a + '&deg; and ' + b + '&deg;. What is the third angle?', fig: angTri(a, b, c, 2), type: 'num', answer: c, unit: '&deg;', hint: 'All three angles add up to 180&deg;.',
            steps: ['The angles of a triangle add to 180&deg;.', a + ' + ' + b + ' = ' + (a + b) + '.', '180 &minus; ' + (a + b) + ' = ' + c + '&deg;.'], explain: '180 &minus; ' + a + ' &minus; ' + b + ' = ' + c + '&deg;. It is ' + an(byAngles(a, b, c)) + ' triangle.' };
        }
        if (lv === 1) {
          var k = R.pick(['equilateral', 'isosceles', 'scalene']), s1 = R.int(3, 9), sd = k === 'equilateral' ? [s1, s1, s1] : k === 'isosceles' ? [s1, s1, s1 + R.int(1, 3)] : [s1, s1 + 1, s1 + R.int(2, 3)];
          sd = R.shuffle(sd);
          var o = R.mc(k, ['equilateral', 'isosceles', 'scalene']);
          return { q: 'A triangle has sides of ' + sd.join(' cm, ') + ' cm. What kind of triangle is it?', fig: sideTri(sd[0], sd[1], sd[2]), type: 'mc', options: o.options, answer: o.answer,
            hint: 'Count how many sides are equal.', steps: ['The sides are ' + sd.join(', ') + '.', k === 'equilateral' ? 'All three are equal.' : k === 'isosceles' ? 'Exactly two are equal.' : 'None are equal.', 'So it is ' + k + '.'], explain: 'It is ' + an(k) + ' triangle.' };
        }
        var x = R.pick([30, 40, 45, 50, 60, 70]), y = R.pick([20, 30, 40, 45, 50, 90, 100, 110]);
        if (x + y >= 175) y = 30;
        var z = 180 - x - y, kk = byAngles(x, y, z), o2 = R.mc(kk, ['acute', 'right', 'obtuse']);
        return { q: 'A triangle has angles of ' + x + '&deg;, ' + y + '&deg; and ' + z + '&deg;. What kind of triangle is it, by its angles?', fig: angTri(x, y, z), type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Look at the biggest angle. Is it less than, equal to, or more than 90&deg;?', steps: ['The biggest angle is ' + Math.max(x, y, z) + '&deg;.', Math.max(x, y, z) === 90 ? 'It is exactly 90&deg;.' : Math.max(x, y, z) > 90 ? 'It is more than 90&deg;.' : 'It is less than 90&deg;, so all angles are.', 'So it is ' + an(kk) + ' triangle.'],
          explain: 'The biggest angle, ' + Math.max(x, y, z) + '&deg;, makes it ' + kk + '.' };
      } },
      { id: 'sg-cong', name: 'Congruent shapes', code: 'E1.2', gen: function (lv) {
        var w = R.int(3, 9), h = R.int(2, 6);
        if (w === h) w++;
        var shape = lv === 2 ? 'rectangle' : R.pick(['rectangle', 'parallelogram']), right = 'A ' + shape + ' ' + h + ' cm by ' + w + ' cm';
        if (lv === 1) {
          var same = R.int(0, 1) === 1, w2 = same ? w : w + 1;
          return { q: 'Rectangle A is ' + w + ' cm by ' + h + ' cm. Rectangle B is ' + w2 + ' cm by ' + h + ' cm. Are they congruent?', fig: pair([{ w: w, h: h, label: 'A: ' + w + ' by ' + h }, { w: w2, h: h, label: 'B: ' + w2 + ' by ' + h }]), type: 'mc', options: ['Yes', 'No'], answer: same ? 0 : 1,
            hint: 'Congruent shapes have exactly the same side lengths.', steps: ['Compare the sides: ' + w + ' and ' + w2 + ', ' + h + ' and ' + h + '.', same ? 'All matching sides are equal.' : w + ' cm is not equal to ' + w2 + ' cm.', same ? 'Yes, congruent.' : 'No, not congruent.'],
            explain: same ? 'Same side lengths, so they are congruent.' : 'One side is different, so they are not congruent.' };
        }
        var o2 = R.mc(right, ['A ' + shape + ' ' + (w * 2) + ' cm by ' + (h * 2) + ' cm', 'A ' + shape + ' ' + w + ' cm by ' + (h + 1) + ' cm', 'A square ' + w + ' cm by ' + w + ' cm']);
        return { q: 'Which shape is congruent to a ' + shape + ' that is ' + w + ' cm by ' + h + ' cm' + (shape === 'parallelogram' ? ' with the same angles' : '') + '?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'A turned shape is still congruent. Look for the same two side lengths.', steps: ['Congruent means same size and same shape.', 'Turning the ' + shape + ' swaps which side is on the bottom, but the lengths stay ' + w + ' cm and ' + h + ' cm.', 'The answer has sides ' + h + ' cm and ' + w + ' cm.', pair([{ w: w, h: h, lean: shape === 'parallelogram', label: w + ' by ' + h }, { w: h, h: w, lean: shape === 'parallelogram', label: 'turned: ' + h + ' by ' + w }])],
          explain: h + ' cm by ' + w + ' cm is the same shape turned, so it is congruent.' };
      } },
      { id: 'sg-views', name: 'Views of objects', code: 'E1.3', gen: function (lv) {
        var h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (var y = 0; y < 3; y++) for (var x = 0; x < 3; x++) h[y][x] = R.int(0, lv === 1 ? 2 : 3);
        h[2][R.int(0, 2)] = Math.max(1, h[2][1]);
        var cubes = h.reduce(function (t, r) { return t + r.reduce(function (a, b) { return a + b; }, 0); }, 0);
        if (lv === 1) return { q: 'The top view shows how many cubes are in each stack. How many cubes are in the building?', fig: top(h, true), type: 'num', answer: cubes, hint: 'Add all the numbers in the top view.',
          steps: ['Each number is the height of one stack.', 'Add them: ' + h.map(function (r) { return r.filter(function (n) { return n; }).join(' + '); }).filter(Boolean).join(' + ') + '.', 'Total: ' + cubes + ' cubes.'], explain: 'The building has ' + cubes + ' cubes.' };
        var f = lv === 2 ? front(h) : side(h), sq = f.reduce(function (a, b) { return a + b; }, 0);
        var which = lv === 2 ? 'front' : 'right side';
        return { q: 'The top view shows how many cubes are in each stack. The front is at the bottom of the top view. How many squares are in the <b>' + which + ' view</b>?', fig: top(h, true), type: 'num', answer: sq,
          hint: lv === 2 ? 'Look down each column (top to bottom). The front view shows the tallest stack in each column.' : 'Look along each row. The side view shows the tallest stack in each row.',
          steps: [lv === 2 ? 'Tallest stack in each column, left to right: ' + f.join(', ') + '.' : 'Tallest stack in each row, from the front row to the back row: ' + f.join(', ') + '.', 'The ' + which + ' view has columns of those heights:' + view(f, 'The ' + which + ' view'), 'Squares: ' + f.join(' + ') + ' = ' + sq + '.'],
          explain: 'The ' + which + ' view has ' + sq + ' squares.' };
      } },
      { id: 'sg-coord', name: 'Coordinates', code: 'E1.4', gen: function (lv) {
        var sc = lv === 1 ? 1 : lv === 2 ? R.pick([1, 2]) : R.pick([2, 5]), x = R.int(1, 9), y = R.int(1, 9);
        while (x === y) y = R.int(1, 9);
        if (lv < 3) {
          var o = R.mc('(' + x * sc + ', ' + y * sc + ')', ['(' + y * sc + ', ' + x * sc + ')', '(' + x + ', ' + y + ')', '(' + (x + 1) * sc + ', ' + y * sc + ')']);
          return { q: 'What are the coordinates of point A?' + (sc > 1 ? ' The grid counts by ' + sc + 's.' : ''), fig: grid(sc, [{ x: x, y: y, label: 'A', c: 'var(--strand)' }], [], 24), type: 'mc', options: o.options, answer: o.answer,
            hint: 'Go across first (x), then up (y).', steps: ['From the origin, go across to A: ' + x + ' lines, each worth ' + sc + ': ' + x * sc + '.', 'Then up: ' + y + ' lines: ' + y * sc + '.', 'A is at (' + x * sc + ', ' + y * sc + ').'],
            explain: 'A is at (' + x * sc + ', ' + y * sc + ').' };
        }
        var dx = R.int(-3, 4), dy = R.int(-3, 4);
        if (!dx && !dy) dx = 2;
        var nx = Math.max(0, Math.min(10, x + dx)), ny = Math.max(0, Math.min(10, y + dy));
        dx = nx - x; dy = ny - y;
        function d(v, p, n) { return v === 0 ? '' : Math.abs(v * sc) + ' ' + (v > 0 ? p : n); }
        var right = [d(dx, 'right', 'left'), d(dy, 'up', 'down')].filter(Boolean).join(', ');
        var o2 = R.mc(right, [[d(dy, 'right', 'left'), d(dx, 'up', 'down')].filter(Boolean).join(', ') || '0', [d(-dx, 'right', 'left'), d(-dy, 'up', 'down')].filter(Boolean).join(', ') || '0', [d(dx, 'right', 'left'), d(-dy, 'up', 'down')].filter(Boolean).join(', ') || '0']);
        return { q: 'Point A(' + x * sc + ', ' + y * sc + ') moves to B(' + nx * sc + ', ' + ny * sc + '). Describe the translation.', fig: grid(sc, [{ x: x, y: y, label: 'A', c: 'var(--strand)' }, { x: nx, y: ny, label: 'B' }], [], 24), type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Compare the x-coordinates for left or right. Compare the y-coordinates for up or down.',
          steps: ['x changes from ' + x * sc + ' to ' + nx * sc + ': ' + (d(dx, 'right', 'left') || 'no change') + '.', 'y changes from ' + y * sc + ' to ' + ny * sc + ': ' + (d(dy, 'up', 'down') || 'no change') + '.', 'The translation is ' + right + '.'],
          explain: 'The translation is ' + right + '.' };
      } },
      { id: 'sg-trans', name: 'Transformations on a grid', code: 'E1.5', gen: function (lv) {
        var x = R.int(1, 4), y = R.int(1, 4), t = lv === 1 ? 'tr' : lv === 2 ? R.pick(['rv', 'rh']) : R.pick(['r180', 'r90']), nx, ny, desc, why;
        if (t === 'tr') { var dx = R.int(1, 5), dy = R.int(1, 5); nx = x + dx; ny = y + dy; desc = 'translated ' + dx + ' right and ' + dy + ' up'; why = 'Add ' + dx + ' to x and ' + dy + ' to y.'; }
        else if (t === 'rv') { nx = 10 - x; ny = y; desc = 'reflected in the line x = 5'; why = x + ' is ' + (5 - x) + ' left of the line, so the image is ' + (5 - x) + ' right of it: x = ' + nx + '. y stays the same.'; }
        else if (t === 'rh') { nx = x; ny = 10 - y; desc = 'reflected in the line y = 5'; why = y + ' is ' + (5 - y) + ' below the line, so the image is ' + (5 - y) + ' above it: y = ' + ny + '. x stays the same.'; }
        else if (t === 'r180') { nx = 10 - x; ny = 10 - y; desc = 'rotated 180&deg; about (5, 5)'; why = 'A half turn sends the point to the opposite side of (5, 5), the same distance away.'; }
        else { nx = y; ny = 10 - x; desc = 'rotated 90&deg; clockwise about (5, 5)'; why = 'A quarter turn clockwise: the point was ' + (5 - x) + ' left and ' + (5 - y) + ' below the centre. It ends up ' + (5 - x) + ' above and ' + (5 - y) + ' left of the centre.'; }
        var o = R.mc('(' + nx + ', ' + ny + ')', ['(' + ny + ', ' + nx + ')', '(' + x + ', ' + (10 - y) + ')', '(' + (10 - x) + ', ' + y + ')', '(' + (10 - x) + ', ' + (10 - y) + ')', '(' + (x + 1) + ', ' + y + ')']);
        var lines = t === 'rv' ? [{ pts: [[5, 0], [5, 10]], fill: 'none', stroke: 'var(--bad)', dash: true }] : t === 'rh' ? [{ pts: [[0, 5], [10, 5]], fill: 'none', stroke: 'var(--bad)', dash: true }] : [];
        var items = [{ x: x, y: y, label: 'P', c: 'var(--strand)' }];
        if (t === 'r90' || t === 'r180') items.push({ x: 5, y: 5, label: 'centre', c: 'var(--bad)' });
        return { q: 'Point P(' + x + ', ' + y + ') is ' + desc + '. Where is its image?', fig: grid(1, items, lines, 24), type: 'mc', options: o.options, answer: o.answer,
          hint: t === 'tr' ? 'Right adds to x. Up adds to y.' : t === 'r90' || t === 'r180' ? 'Picture turning the grid around the centre point.' : 'Count the distance from P to the mirror line.',
          steps: ['P is at (' + x + ', ' + y + ').', why, 'The image is at (' + nx + ', ' + ny + ').'], explain: 'The image of P is (' + nx + ', ' + ny + ').' };
      } }
    ]
  });

  /* ---------- more ways to ask each practice skill (docs/QUESTIONS.md); answer checks in tests/verify/grade5.js ---------- */
  var nm = function () { return A.Q.name(); };
  /* a 0 to 10 grid with labelled points that can be tapped (data-hit = the label); one grid square is 30 px */
  function tapGrid(points, lines) {
    var u = 30, o = 40, b = 10 + 10 * u, s = '';
    for (var i = 0; i <= 10; i++) {
      s += '<line x1="' + (o + i * u) + '" y1="10" x2="' + (o + i * u) + '" y2="' + b + '" style="stroke:var(--line)" stroke-width="1"/><line x1="' + o + '" y1="' + (10 + i * u) + '" x2="' + (o + 10 * u) + '" y2="' + (10 + i * u) + '" style="stroke:var(--line)" stroke-width="1"/>' +
        '<text x="' + (o + i * u) + '" y="' + (b + 18) + '" text-anchor="middle" font-size="13" class="t2">' + i + '</text><text x="' + (o - 8) + '" y="' + (b - i * u + 4) + '" text-anchor="end" font-size="13" class="t2">' + i + '</text>';
    }
    (lines || []).forEach(function (l) { s += '<line x1="' + (o + l[0] * u) + '" y1="' + (b - l[1] * u) + '" x2="' + (o + l[2] * u) + '" y2="' + (b - l[3] * u) + '" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="6 4"/>'; });
    points.forEach(function (p) {
      var cx = o + p.x * u, cy = b - p.y * u, body = '<circle cx="' + cx + '" cy="' + cy + '" r="9" style="fill:' + (p.fixed ? 'var(--strand)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/><text x="' + (cx + 12) + '" y="' + (cy - 10) + '" font-size="16" font-weight="700">' + p.label + '</text>';
      s += p.fixed ? body : '<g data-hit="' + p.label + '" aria-label="point ' + p.label + '">' + body + '</g>';
    });
    return A.svg(o + 10 * u + 16, b + 26, s, 'Coordinate grid from 0 to 10 with points ' + points.map(function (p) { return p.label; }).join(', '));
  }
  function xy(x, y) { return '(' + x + ', ' + y + ')'; }
  /* where a point lands: t is 'tr' (dx, dy), 'rv' (mirror line x = 5) or 'rh' (mirror line y = 5) */
  function moveTo(x, y, t, dx, dy) { return t === 'tr' ? [x + dx, y + dy] : t === 'rv' ? [10 - x, y] : [x, 10 - y]; }
  function moveText(t, dx, dy) { return t === 'tr' ? 'translated ' + dx + ' right and ' + dy + ' up' : t === 'rv' ? 'reflected in the line x = 5' : 'reflected in the line y = 5'; }
  function triSides(k) { var s = R.int(3, 9); return R.shuffle(k === 'equilateral' ? [s, s, s] : k === 'isosceles' ? [s, s, s + R.int(1, 3)] : [s, s + 1, s + R.int(2, 3)]); }
  var SHAPES = {
    'sg-tri': [
      [1, 'match', function (lv) {
        var kinds = ['equilateral', 'isosceles', 'scalene'];
        return { q: 'Match each triangle to its name. The numbers are side lengths in cm.', type: 'match', pairs: kinds.map(function (k) { return [triSides(k).join(', '), k]; }),
          hint: 'Count the equal sides in each one.', steps: ['3 equal sides: equilateral.', 'Exactly 2 equal sides: isosceles.', 'No equal sides: scalene.'],
          explain: 'Equilateral has 3 equal sides, isosceles has 2, scalene has none.', meta: { k: 'g5sg-trimatch' } };
      }],
      [1, 'tap', function (lv) {
        var want = R.pick(['equilateral', 'isosceles', 'scalene']), kinds = R.shuffle(['equilateral', 'isosceles', 'scalene']), sets = kinds.map(triSides);
        return { q: 'Tap the <b>' + want + '</b> triangle.', type: 'tap', tiles: sets.map(function (sd) { return sideTri(sd[0], sd[1], sd[2]); }), answer: kinds.indexOf(want), answerText: 'the triangle with sides ' + sets[kinds.indexOf(want)].join(', ') + ' cm',
          hint: want === 'equilateral' ? 'Look for 3 equal sides.' : want === 'isosceles' ? 'Look for exactly 2 equal sides.' : 'Look for no equal sides.', steps: ['Read the three side lengths on each triangle.', 'Count how many are equal.'],
          explain: 'The ' + want + ' triangle has sides ' + sets[kinds.indexOf(want)].join(', ') + ' cm.', meta: { k: 'g5sg-tritap', sets: sets } };
      }],
      [1, 'mistake', function (lv) {
        var who = nm(), x = R.pick([30, 40, 50]), y = R.pick([20, 30, 40, 50, 60, 70]), z = 180 - x - y, truth = byAngles(x, y, z) === 'acute';
        var right = 'The biggest angle is ' + Math.max(x, y, z) + '&deg;. ' + (truth ? 'It is less than 90&deg;, so the triangle is acute.' : 'It is ' + (Math.max(x, y, z) === 90 ? 'exactly' : 'more than') + ' 90&deg;, so the triangle is ' + byAngles(x, y, z) + ', not acute.');
        return KIT.tf(who, 'a triangle with angles ' + x + '&deg;, ' + y + '&deg; and ' + z + '&deg; is <b>acute</b>.', truth, right,
          ['If two angles are acute, the triangle is acute.', 'Every triangle is acute.', 'Look at the smallest angle to decide.'],
          { fig: angTri(x, y, z), hint: 'An acute triangle has all three angles less than 90&deg;.', meta: { k: 'g5sg-tritf', a: [x, y, z] } });
      }],
      [2, 'fill', function (lv) {
        var a = R.int(3, 14) * 5, b = R.int(3, 14) * 5;
        while (a + b >= 170) b = R.int(3, 10) * 5;
        return { q: 'Find the missing angle.', type: 'fill', fig: angTri(a, b, 180 - a - b, 2), fill: a + '&deg; + ' + b + '&deg; + [[]]&deg; = 180&deg;', answers: [180 - a - b],
          hint: 'The three angles of a triangle add to 180&deg;.', steps: [a + ' + ' + b + ' = ' + (a + b) + '.', '180 &minus; ' + (a + b) + ' = ' + (180 - a - b) + '.'],
          explain: 'The missing angle is ' + (180 - a - b) + '&deg;.', meta: { k: 'g5sg-trifill' } };
      }]
    ],
    'sg-cong': [
      [1, 'pick', function (lv) {
        var w = R.int(3, 8), h = R.int(2, 6);
        if (w === h) w++;
        var opts = R.shuffle([[w, h], [h, w], [w * 2, h * 2], [w, h + 1], [w + 1, h - 1 || h + 2]].filter(function (r, i, a) { return a.map(String).indexOf(String(r)) === i; }));
        return KIT.pick('Which rectangles are congruent to one that is <b>' + w + ' cm by ' + h + ' cm</b>? Pick every one.', opts, function (r) { return (r[0] === w && r[1] === h) || (r[0] === h && r[1] === w); }, function (r) { return r[0] + ' cm by ' + r[1] + ' cm'; }, {
          hint: 'Congruent means exactly the same side lengths. Turning is allowed.', steps: ['Look for sides ' + w + ' cm and ' + h + ' cm, in either order.', 'Bigger copies are similar, not congruent.'],
          explain: w + ' by ' + h + ' and ' + h + ' by ' + w + ' are the same rectangle turned.', meta: { k: 'g5sg-congpick' } });
      }],
      [1, 'tap', function (lv) {
        var w = R.int(3, 6), h = R.int(2, 4);
        if (w === h) w++;
        var set = R.shuffle([[h, w], [w + 1, h], [w, h + 1]]);
        return { q: 'Tap the rectangle that is congruent to this one. It may be turned.', fig: pair([{ w: w, h: h, label: w + ' by ' + h }]), type: 'tap', tiles: set.map(function (r) { return pair([{ w: r[0], h: r[1], label: r[0] + ' by ' + r[1] }]); }), answer: set.map(String).indexOf(String([h, w])), answerText: h + ' by ' + w,
          hint: 'Find the one with sides ' + w + ' and ' + h + '.', steps: ['Turning a shape does not change its side lengths.', h + ' by ' + w + ' is the same rectangle turned.'],
          explain: h + ' by ' + w + ' is congruent: the same rectangle, turned.', meta: { k: 'g5sg-congtap', w: w, h: h, set: set } };
      }],
      [1, 'mistake', function (lv) {
        var who = nm(), p = R.pick([[[6, 4], [8, 3]], [[12, 2], [6, 4]], [[9, 4], [12, 3]], [[10, 3], [6, 5]]]), truth = false;
        var right = 'They have the same area, ' + p[0][0] * p[0][1] + ' square cm, but different side lengths, so they are not congruent.';
        return KIT.tf(who, 'a ' + p[0][0] + ' cm by ' + p[0][1] + ' cm rectangle and a ' + p[1][0] + ' cm by ' + p[1][1] + ' cm rectangle are congruent because they have the same area.', truth, right,
          ['Same area means congruent.', 'All rectangles are congruent.', 'Congruent shapes only need the same number of sides.'],
          { fig: pair([{ w: p[0][0], h: p[0][1], label: p[0][0] + ' by ' + p[0][1] }, { w: p[1][0], h: p[1][1], label: p[1][0] + ' by ' + p[1][1] }]), hint: 'Congruent means the same size and shape. Compare the sides.', meta: { k: 'g5sg-congtf', p: p } });
      }]
    ],
    'sg-views': [
      [1, 'fill', function (lv) {
        var h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (var y = 0; y < 3; y++) for (var x = 0; x < 3; x++) h[y][x] = R.int(0, lv === 1 ? 2 : 3);
        h[2][R.int(0, 2)] = Math.max(1, h[2][1]);
        var f = front(h);
        return { q: 'The top view shows how many cubes are in each stack. The front is at the bottom. How tall is each column of the <b>front view</b>, from left to right?', type: 'fill', fig: top(h, true), fill: '[[]], [[]], [[]]', answers: f,
          hint: 'Look down each column of the top view. The front view shows the tallest stack.', steps: ['Left column: tallest is ' + f[0] + '. Middle: ' + f[1] + '. Right: ' + f[2] + '.', view(f, 'The front view')],
          explain: 'The front view has columns ' + f.join(', ') + ' tall.', meta: { k: 'g5sg-viewfill', h: h } };
      }],
      [1, 'tap', function (lv) {
        var h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], f, s2;
        do { for (var y = 0; y < 3; y++) for (var x = 0; x < 3; x++) h[y][x] = R.int(0, 3); f = front(h); s2 = side(h); } while (f.join() === s2.join() || f.join() === s2.slice().reverse().join() || f.join() === f.slice().reverse().join() || !f.every(function (v) { return v; }));
        var set = R.shuffle([f, f.slice().reverse(), s2]).filter(function (v, i, a) { return a.map(String).indexOf(String(v)) === i; });
        return { q: 'Tap the <b>front view</b> of this building. The front is at the bottom of the top view.', fig: top(h, true), type: 'tap', tiles: set.map(function (c) { return view(c, 'A view with columns ' + c.join(', ')); }), answer: set.map(String).indexOf(String(f)), answerText: 'the view with columns ' + f.join(', '),
          hint: 'Find the tallest stack in each column, left to right.', steps: ['Tallest stacks, left to right: ' + f.join(', ') + '.'],
          explain: 'The front view has columns ' + f.join(', ') + ' tall.', meta: { k: 'g5sg-viewtap', h: h } };
      }],
      [2, 'mistake', function (lv) {
        var h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (var y = 0; y < 3; y++) for (var x = 0; x < 3; x++) h[y][x] = R.int(1, 3);
        h[0][0] = 2;
        var cubes = h.reduce(function (t, r) { return t + r.reduce(function (a, b) { return a + b; }, 0); }, 0), who = nm(), truth = !R.int(0, 2), said = truth ? cubes : 9;
        var right = 'Each number is the height of one stack. Add them all: ' + cubes + ' cubes.';
        return KIT.tf(who, 'this building has <b>' + said + '</b> cubes.', truth, right,
          ['Count the squares in the top view.', 'Multiply the biggest number by 3.', 'The top view only shows the top layer, so count 9.'],
          { fig: top(h, true), hint: 'What does each number in the top view mean?', meta: { k: 'g5sg-viewtf', h: h, said: said } });
      }]
    ],
    'sg-coord': [
      [1, 'tap', function (lv) {
        var pts = [], seen = {}, labels = ['A', 'B', 'C', 'D'];
        var x = R.int(1, 9), y = R.int(1, 9);
        while (x === y) y = R.int(1, 9);
        [[x, y], [y, x], [x, y + (y < 9 ? 1 : -1)], [x + (x < 9 ? 1 : -1), y]].forEach(function (p) { if (!seen[p]) { seen[p] = 1; pts.push(p); } });
        pts = R.shuffle(pts);
        var ans = labels[pts.map(String).indexOf(String([x, y]))];
        return { q: 'Tap the point at <b>' + xy(x, y) + '</b>.', type: 'tap', pic: tapGrid(pts.map(function (p, i) { return { x: p[0], y: p[1], label: labels[i] }; })), answer: ans, answerText: 'point ' + ans,
          hint: 'Go across ' + x + ' first, then up ' + y + '.', steps: ['Start at (0, 0).', 'Go right ' + x + ', then up ' + y + '.'],
          explain: 'Point ' + ans + ' is at ' + xy(x, y) + '.', meta: { k: 'g5sg-coordtap' } };
      }],
      [1, 'fill', function (lv) {
        var sc = lv === 1 ? 1 : R.pick([1, 2]), x = R.int(1, 9), y = R.int(1, 9);
        while (x === y) y = R.int(1, 9);
        return { q: 'Write the coordinates of point A.' + (sc > 1 ? ' The grid counts by ' + sc + 's.' : ''), type: 'fill', fig: grid(sc, [{ x: x, y: y, label: 'A', c: 'var(--strand)' }], [], 24), fill: 'A = ([[]], [[]])', answers: [x * sc, y * sc],
          hint: 'Across first (x), then up (y).', steps: ['Across: ' + x * sc + '.', 'Up: ' + y * sc + '.'],
          explain: 'A is at ' + xy(x * sc, y * sc) + '.', meta: { k: 'g5sg-coordfill', x: x * sc, y: y * sc } };
      }],
      [1, 'mistake', function (lv) {
        var x = R.int(1, 9), y = R.int(1, 9), who = nm(), truth = !R.int(0, 2);
        while (x === y) y = R.int(1, 9);
        var said = truth ? [x, y] : [y, x], right = 'Go across first, then up. A is ' + x + ' across and ' + y + ' up, so A is at ' + xy(x, y) + '.';
        return KIT.tf(who, 'point A is at <b>' + xy(said[0], said[1]) + '</b>.', truth, right,
          ['Go up first, then across.', 'The order of the numbers does not matter.', 'Count the squares, not the lines.'],
          { fig: grid(1, [{ x: x, y: y, label: 'A', c: 'var(--strand)' }], [], 24), hint: 'Which number comes first: across or up?', meta: { k: 'g5sg-coordtf', x: x, y: y, said: said } });
      }]
    ],
    'sg-trans': [
      [1, 'fill', function (lv) {
        var t = lv === 1 ? 'tr' : R.pick(['tr', 'rv', 'rh']), x = R.int(1, 4), y = R.int(1, 4), dx = R.int(1, 5), dy = R.int(1, 5), im = moveTo(x, y, t, dx, dy);
        return { q: 'Point P' + xy(x, y) + ' is ' + moveText(t, dx, dy) + '. Where is its image?', type: 'fill', fig: grid(1, [{ x: x, y: y, label: 'P', c: 'var(--strand)' }], t === 'rv' ? [{ pts: [[5, 0], [5, 10]], fill: 'none', stroke: 'var(--bad)', dash: true }] : t === 'rh' ? [{ pts: [[0, 5], [10, 5]], fill: 'none', stroke: 'var(--bad)', dash: true }] : [], 24), fill: "P' = ([[]], [[]])", answers: im,
          hint: t === 'tr' ? 'Right adds to x. Up adds to y.' : 'Count the distance to the mirror line. Go the same distance on the other side.', steps: [t === 'tr' ? x + ' + ' + dx + ' = ' + im[0] + ', ' + y + ' + ' + dy + ' = ' + im[1] + '.' : 'The image is the same distance from the mirror line, on the other side.', 'The image is ' + xy(im[0], im[1]) + '.'],
          explain: "P' is at " + xy(im[0], im[1]) + '.', meta: { k: 'g5sg-transfill' } };
      }],
      [1, 'tap', function (lv) {
        var t = lv === 1 ? 'tr' : R.pick(['rv', 'rh']), x = R.int(1, 4), y = R.int(1, 4), dx = R.int(1, 4), dy = dx === 4 ? R.int(1, 3) : dx + R.int(1, 4 - dx), im = moveTo(x, y, t, dx, dy), labels = ['A', 'B', 'C'];
        var cand = [im, t === 'tr' ? [x + dy, y + dx] : moveTo(x, y, t === 'rv' ? 'rh' : 'rv'), [im[0] + 1, im[1]]], uniq = [];
        cand.forEach(function (p) { if (uniq.map(String).indexOf(String(p)) < 0 && !(p[0] === x && p[1] === y)) uniq.push(p); });
        if (uniq.length < 3) uniq.push([im[0], im[1] + 1]);
        uniq = R.shuffle(uniq);
        var ans = labels[uniq.map(String).indexOf(String(im))];
        return { q: 'P' + xy(x, y) + ' is ' + moveText(t, dx, dy) + '. Tap its image.', type: 'tap', pic: tapGrid([{ x: x, y: y, label: 'P', fixed: true }].concat(uniq.map(function (p, i) { return { x: p[0], y: p[1], label: labels[i] }; })), t === 'rv' ? [[5, 0, 5, 10]] : t === 'rh' ? [[0, 5, 10, 5]] : []),
          answer: ans, answerText: 'point ' + ans + ' at ' + xy(im[0], im[1]),
          hint: t === 'tr' ? 'Start at P. Count ' + dx + ' right, then ' + dy + ' up.' : 'Count from P to the red line. Go the same distance past it.', steps: ['The image is at ' + xy(im[0], im[1]) + '.'],
          explain: 'The image of P is ' + ans + ', at ' + xy(im[0], im[1]) + '.', meta: { k: 'g5sg-transtap' } };
      }],
      [1, 'mistake', function (lv) {
        var x = R.int(1, 4), y = R.int(1, 4), dx = R.int(1, 5), dy = R.int(1, 5), who = nm(), truth = !R.int(0, 2);
        if (dx === dy) dy = dx === 5 ? 4 : dx + 1;
        var said = truth ? [x + dx, y + dy] : [x + dy, y + dx], right = 'Right changes x and up changes y: (' + x + ' + ' + dx + ', ' + y + ' + ' + dy + ') = ' + xy(x + dx, y + dy) + '.';
        return KIT.tf(who, 'P' + xy(x, y) + ' translated ' + dx + ' right and ' + dy + ' up lands at <b>' + xy(said[0], said[1]) + '</b>.', truth, right,
          ['Right changes y and up changes x.', 'Add both numbers to x.', 'A translation does not move the point.'],
          { hint: 'Which coordinate changes when you move right?', meta: { k: 'g5sg-transtf', said: said } });
      }],
      [2, 'match', function (lv) {
        var x, y, dx = R.int(1, 3), dy = R.int(1, 3), list, ims;
        do { x = R.int(1, 4); y = R.int(1, 4); list = [['tr', dx, dy], ['rv'], ['rh']]; ims = list.map(function (m) { return moveTo(x, y, m[0], m[1], m[2]); }); } while (new Set(ims.map(String)).size < 3);
        return { q: 'P is at ' + xy(x, y) + '. Match each move to where P lands.', type: 'match', pairs: list.map(function (m, i) { return [moveText(m[0], m[1], m[2]).replace(/^./, function (c) { return c.toUpperCase(); }), xy(ims[i][0], ims[i][1])]; }),
          fig: grid(1, [{ x: x, y: y, label: 'P', c: 'var(--strand)' }], [], 24), hint: 'Do each move on its own, starting from P.', steps: ['A translation slides. A reflection flips over the line.'],
          explain: list.map(function (m, i) { return moveText(m[0], m[1], m[2]) + ': ' + xy(ims[i][0], ims[i][1]); }).join('. ') + '.', meta: { k: 'g5sg-transmatch' } };
      }]
    ]
  };
  KIT.shapes('shapes-grids', SHAPES);
})();
