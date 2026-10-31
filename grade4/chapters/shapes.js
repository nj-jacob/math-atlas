(function () {
  var A = Atlas, R = A.R;
  function kind(t) { return t === 0 ? 'zero' : t < 90 ? 'acute' : t === 90 ? 'right' : t < 180 ? 'obtuse' : 'straight'; }
  var KDESC = { acute: 'less than a right angle', right: 'a square corner, exactly 90&deg;', obtuse: 'more than a right angle, less than a straight angle', straight: 'a straight line, 180&deg;' };
  /* an angle of t degrees with an arc; rot turns the whole drawing */
  function angle(t, rot, label, showDeg, fixed) {
    rot = rot || 0;
    var cx = 160, cy = 150, L = 130, s = '', a0 = rot * Math.PI / 180, a1 = (rot + t) * Math.PI / 180;
    function P(a, r) { return [(cx + r * Math.cos(a)).toFixed(1), (cy - r * Math.sin(a)).toFixed(1)]; }
    var p0 = P(a0, L), p1 = P(a1, L);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p0[0] + '" y2="' + p0[1] + '" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/>';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p1[0] + '" y2="' + p1[1] + '" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/>';
    if (t === 90) {
      var q0 = P(a0, 26), q1 = P(a1, 26), q2 = [(+q0[0] + +q1[0] - cx).toFixed(1), (+q0[1] + +q1[1] - cy).toFixed(1)];
      s += '<polyline points="' + q0.join(',') + ' ' + q2.join(',') + ' ' + q1.join(',') + '" style="fill:color-mix(in srgb,var(--strand) 25%,transparent);stroke:var(--strand)" stroke-width="3"/>';
    } else if (t > 0) {
      var r0 = P(a0, 40), r1 = P(a1, 40);
      s += '<path d="M' + cx + ' ' + cy + ' L' + r0.join(' ') + ' A40 40 0 0 0 ' + r1.join(' ') + ' Z" style="fill:color-mix(in srgb,var(--strand) 25%,transparent);stroke:var(--strand)" stroke-width="3"/>';
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="5" style="fill:var(--ink)"/>';
    if (showDeg) { var m = P((a0 + a1) / 2, 70); s += '<text x="' + m[0] + '" y="' + (+m[1] + 6) + '" text-anchor="middle" font-size="19" class="tb">' + t + '&deg;</text>'; }
    /* fit the box around what is drawn; the widget (fixed) keeps a full square so it does not jump */
    var xs = [cx, +p0[0], +p1[0]], ys = [cy, +p0[1], +p1[1]];
    for (var k = 0; k <= 8; k++) { var q = P(a0 + (a1 - a0) * k / 8, showDeg ? 90 : 45); xs.push(+q[0]); ys.push(+q[1]); }
    var x0 = Math.min.apply(null, xs) - 14, y0 = Math.min.apply(null, ys) - 14, x1 = Math.max.apply(null, xs) + 14, y1 = Math.max.apply(null, ys) + 14;
    if (fixed) { x0 = cx - 150; y0 = cy - 150; x1 = cx + 150; y1 = cy + 150; }
    return A.svg(Math.round(x1 - x0), Math.round(y1 - y0), '<g transform="translate(' + (-x0).toFixed(1) + ' ' + (-y0).toFixed(1) + ')">' + s + '</g>', label || 'An angle of ' + t + ' degrees, ' + kind(t));
  }
  /* rectangle w by h (grid units) with optional marks */
  function rect(w, h, o) {
    o = o || {};
    var u = Math.min(40, 360 / w, 220 / h), x0 = 40, y0 = 30, W = w * u, H = h * u, s = '';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--ink)" stroke-width="3"/>';
    if (o.right) [[x0, y0, 1, 1], [x0 + W, y0, -1, 1], [x0, y0 + H, 1, -1], [x0 + W, y0 + H, -1, -1]].forEach(function (c) {
      s += '<polyline points="' + (c[0] + 16 * c[2]) + ',' + c[1] + ' ' + (c[0] + 16 * c[2]) + ',' + (c[1] + 16 * c[3]) + ' ' + c[0] + ',' + (c[1] + 16 * c[3]) + '" style="fill:none;stroke:var(--strand)" stroke-width="2.5"/>';
    });
    if (o.par) {
      function arr(x, y, vert, n) { var h2 = ''; for (var i = 0; i < n; i++) { var d = (i - (n - 1) / 2) * 10; h2 += vert ? '<polyline points="' + (x - 7) + ',' + (y + d + 5) + ' ' + x + ',' + (y + d - 3) + ' ' + (x + 7) + ',' + (y + d + 5) + '" style="fill:none;stroke:var(--btn)" stroke-width="3"/>' : '<polyline points="' + (x + d - 5) + ',' + (y - 7) + ' ' + (x + d + 3) + ',' + y + ' ' + (x + d - 5) + ',' + (y + 7) + '" style="fill:none;stroke:var(--btn)" stroke-width="3"/>'; } return h2; }
      s += arr(x0 + W / 2, y0, false, 1) + arr(x0 + W / 2, y0 + H, false, 1) + arr(x0, y0 + H / 2, true, 2) + arr(x0 + W, y0 + H / 2, true, 2);
    }
    if (o.sym) {
      s += '<line x1="' + (x0 + W / 2) + '" y1="' + (y0 - 18) + '" x2="' + (x0 + W / 2) + '" y2="' + (y0 + H + 18) + '" style="stroke:var(--accent)" stroke-width="3" stroke-dasharray="8 6"/>' +
        '<line x1="' + (x0 - 18) + '" y1="' + (y0 + H / 2) + '" x2="' + (x0 + W + 18) + '" y2="' + (y0 + H / 2) + '" style="stroke:var(--accent)" stroke-width="3" stroke-dasharray="8 6"/>';
      if (w === h) s += '<line x1="' + (x0 - 12) + '" y1="' + (y0 - 12) + '" x2="' + (x0 + W + 12) + '" y2="' + (y0 + H + 12) + '" style="stroke:var(--accent)" stroke-width="3" stroke-dasharray="8 6"/><line x1="' + (x0 + W + 12) + '" y1="' + (y0 - 12) + '" x2="' + (x0 - 12) + '" y2="' + (y0 + H + 12) + '" style="stroke:var(--accent)" stroke-width="3" stroke-dasharray="8 6"/>';
    }
    if (o.lab) s += '<text x="' + (x0 + W / 2) + '" y="' + (y0 + H + 40) + '" text-anchor="middle" font-size="18" class="tb">' + w + ' units</text><text x="' + (x0 + W + 12) + '" y="' + (y0 + H / 2 + 6) + '" font-size="18" class="tb">' + h + '</text>';
    return A.svg(Math.ceil(x0 + W + 50), Math.ceil(y0 + H + (o.lab ? 50 : 30)), s, (w === h ? 'Square' : 'Rectangle') + ' ' + w + ' by ' + h + (o.right ? ', right angles marked' : '') + (o.par ? ', parallel sides marked with matching arrows' : '') + (o.sym ? ', lines of symmetry dashed' : ''));
  }
  /* four-sided shapes for sorting: rectangle, square, parallelogram, trapezoid, kite */
  var QUADS = {
    rectangle: [[0, 0], [5, 0], [5, 3], [0, 3]], square: [[0, 0], [3, 0], [3, 3], [0, 3]], parallelogram: [[0, 0], [4, 0], [5.5, 3], [1.5, 3]],
    trapezoid: [[0, 0], [6, 0], [4.5, 3], [1.5, 3]], kite: [[2, 0], [4, 2.2], [2, 5], [0, 2.2]]
  };
  function quad(name, size) {
    var P = QUADS[name], u = (size || 120) / 6, s = '<polygon points="' + P.map(function (p) { return (10 + p[0] * u).toFixed(1) + ',' + (10 + (5 - p[1]) * u).toFixed(1); }).join(' ') + '" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--ink)" stroke-width="3" stroke-linejoin="round"/>';
    return A.svg(20 + 6 * u, 20 + 5 * u, s, 'A ' + name);
  }
  /* coordinate grid 0..n; pts: [{x,y,l,c}], polys: [{pts, fill, dash}], arrows: [[x1,y1,x2,y2]], mirror: {v: x} or {h: y} */
  function grid(n, pts, polys, arrows, mirror) {
    var u = Math.min(40, 400 / n), o = 36, s = '';
    for (var i = 0; i <= n; i++) {
      s += '<line x1="' + (o + i * u) + '" y1="10" x2="' + (o + i * u) + '" y2="' + (10 + n * u) + '" style="stroke:var(--line)" stroke-width="1"/><line x1="' + o + '" y1="' + (10 + i * u) + '" x2="' + (o + n * u) + '" y2="' + (10 + i * u) + '" style="stroke:var(--line)" stroke-width="1"/>' +
        '<text x="' + (o + i * u) + '" y="' + (32 + n * u) + '" text-anchor="middle" font-size="17" class="t2">' + i + '</text><text x="' + (o - 8) + '" y="' + (16 + (n - i) * u) + '" text-anchor="end" font-size="17" class="t2">' + i + '</text>';
    }
    s += '<line x1="' + o + '" y1="' + (10 + n * u) + '" x2="' + (o + n * u + 8) + '" y2="' + (10 + n * u) + '" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="' + o + '" y1="2" x2="' + o + '" y2="' + (10 + n * u) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    function X(x) { return o + x * u; } function Y(y) { return 10 + (n - y) * u; }
    if (mirror) s += mirror.v !== undefined ? '<line x1="' + X(mirror.v) + '" y1="4" x2="' + X(mirror.v) + '" y2="' + (16 + n * u) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="9 6"/>' : '<line x1="' + (o - 6) + '" y1="' + Y(mirror.h) + '" x2="' + (o + n * u + 6) + '" y2="' + Y(mirror.h) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="9 6"/>';
    (polys || []).forEach(function (p) { s += '<polygon points="' + p.pts.map(function (q) { return X(q[0]) + ',' + Y(q[1]); }).join(' ') + '" style="fill:' + p.fill + ';stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"' + (p.dash ? ' stroke-dasharray="7 5"' : '') + '/>'; });
    if (arrows && arrows.length) {
      s += '<defs><marker id="shgr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>';
      arrows.forEach(function (a) { s += '<line x1="' + X(a[0]) + '" y1="' + Y(a[1]) + '" x2="' + X(a[2]) + '" y2="' + Y(a[3]) + '" style="stroke:var(--accent)" stroke-width="3" marker-end="url(#shgr)"/>'; });
    }
    (pts || []).forEach(function (p) { s += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="7" style="fill:' + (p.c || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>' + (p.l ? '<text x="' + (X(p.x) + 10) + '" y="' + (Y(p.y) - 9) + '" font-size="19" class="tb">' + p.l + '</text>' : ''); });
    return A.svg(o + n * u + 16, n * u + 40, s, 'Coordinate grid from 0 to ' + n + (pts && pts.length ? ' with points ' + pts.map(function (p) { return (p.l || '') + ' (' + p.x + ', ' + p.y + ')'; }).join(', ') : ''));
  }
  var TRI = [[0, 0], [2, 0], [0, 3]], FLAG = [[0, 0], [0, 3], [2, 2.5], [0, 2]];
  function move(P, dx, dy) { return P.map(function (p) { return [p[0] + dx, p[1] + dy]; }); }
  function reflV(P, m) { return P.map(function (p) { return [2 * m - p[0], p[1]]; }); }
  function reflH(P, m) { return P.map(function (p) { return [p[0], 2 * m - p[1]]; }); }
  function dirWords(dx, dy) {
    var w = [];
    if (dx) w.push(Math.abs(dx) + ' unit' + (Math.abs(dx) > 1 ? 's' : '') + ' ' + (dx > 0 ? 'right' : 'left'));
    if (dy) w.push(Math.abs(dy) + ' unit' + (Math.abs(dy) > 1 ? 's' : '') + ' ' + (dy > 0 ? 'up' : 'down'));
    return w.join(' and ') || 'no move';
  }

  var gen = {
    angle: function (lv) {
      var t = lv === 1 ? R.pick([30, 45, 90, 120, 150, 180, 60]) : lv === 2 ? R.pick([80, 100, 85, 95, 135, 170, 20]) : R.pick([88, 92, 175, 15, 105, 75]);
      var rot = lv === 1 ? 0 : R.pick([0, 30, 60, 100, 200, 250]), k = kind(t), o = R.mc(k, ['acute', 'right', 'obtuse', 'straight'].filter(function (x) { return x !== k; }));
      return { q: 'What kind of angle is this?', type: 'mc', options: o.options, answer: o.answer, fig: angle(t, rot),
        hint: 'Compare it with the corner of a sheet of paper. Is it smaller, the same, or bigger?', steps: ['A right angle is a square corner. Compare the angle to a square corner.', 'This angle is ' + KDESC[k] + '.', 'So it is ' + (k === 'acute' || k === 'obtuse' ? 'an ' : 'a ') + k + ' angle.' + (lv > 1 ? ' (It measures ' + t + '&deg;.)' : '')],
        explain: 'It is ' + (k === 'acute' || k === 'obtuse' ? 'an ' : 'a ') + k + ' angle: ' + KDESC[k] + '.' };
    },
    rect: function (lv) {
      if (lv === 1) {
        var q = R.pick([['How many right angles does every rectangle have?', 4], ['How many pairs of parallel sides does a rectangle have?', 2], ['How many lines of symmetry does a rectangle that is not a square have?', 2], ['How many lines of symmetry does a square have?', 4]]);
        return { q: q[0], type: 'num', answer: q[1], fig: q[0].indexOf('square') > 0 ? rect(3, 3, { sym: true }) : rect(5, 3, { right: q[1] === 4 && q[0].indexOf('right') > 0, par: q[0].indexOf('parallel') > 0 }),
          hint: 'Look at the marks on the picture.', steps: ['Count the marks on the picture.', 'The answer is ' + q[1] + '.'], explain: 'The answer is ' + q[1] + '.' };
      }
      var names = ['rectangle', 'square', 'parallelogram', 'trapezoid', 'kite'], nm = R.pick(names), isR = nm === 'rectangle' || nm === 'square';
      if (lv === 2) {
        var o = R.mc(isR ? 'Yes' : 'No', [isR ? 'No' : 'Yes']);
        return { q: 'Is this shape a rectangle?', type: 'mc', options: o.options, answer: o.answer, fig: quad(nm, 150),
          hint: 'A rectangle has 4 right angles. Check every corner.', steps: ['Check each corner for a square corner.', isR ? 'All 4 corners are right angles.' : 'Not all the corners are right angles.', isR ? 'So it is a rectangle' + (nm === 'square' ? '. A square is a special rectangle with 4 equal sides.' : '.') : 'So it is not a rectangle. It is a ' + nm + '.'], explain: isR ? 'Yes. It has 4 right angles' + (nm === 'square' ? '. A square is a rectangle.' : '.') : 'No. It does not have 4 right angles. It is a ' + nm + '.' };
      }
      var o3 = R.mc('Perpendicular', ['Parallel', 'Neither']);
      return { q: 'In a rectangle, how are two sides that meet at a corner related?', type: 'mc', options: o3.options, answer: o3.answer, fig: rect(5, 3, { right: true }),
        hint: 'They meet at a right angle.', steps: ['Sides that meet at a corner make a right angle.', 'Lines that meet at a right angle are perpendicular.'], explain: 'They meet at a right angle, so they are perpendicular. Opposite sides are parallel.' };
    },
    coord: function (lv) {
      var x = R.int(lv === 1 ? 1 : 0, 9), y = R.int(lv === 1 ? 1 : 0, 9);
      if (lv === 1 && x === y) y = (y % 9) + 1;
      if (lv === 3) {
        var o3 = R.mc('(' + x + ', ' + y + ')', ['(' + y + ', ' + x + ')', '(' + (x + 1) + ', ' + y + ')', '(' + x + ', ' + (y + 1) + ')'].filter(function (s) { return s !== '(' + x + ', ' + y + ')'; }));
        return { q: 'Which ordered pair names point P?', type: 'mc', options: o3.options, answer: o3.answer, fig: grid(10, [{ x: x, y: y, l: 'P' }]),
          hint: 'Go across first (x), then up (y). The order matters.', steps: ['From 0, go across to ' + x + '.', 'Then go up to ' + y + '.', 'Write across first: (' + x + ', ' + y + ').'], explain: 'P is at (' + x + ', ' + y + ').' };
      }
      var ask = R.pick(['x', 'y']);
      return { q: 'Point A is plotted. What is its <b>' + (ask === 'x' ? 'first (across)' : 'second (up)') + '</b> number?', type: 'num', answer: ask === 'x' ? x : y, fig: grid(10, [{ x: x, y: y, l: 'A' }]),
        hint: ask === 'x' ? 'Look straight down from A to the bottom axis.' : 'Look straight across from A to the side axis.', steps: ['The first number tells how far across. The second tells how far up.', 'A is at (' + x + ', ' + y + ').'], explain: 'A is at (' + x + ', ' + y + '), so the answer is ' + (ask === 'x' ? x : y) + '.' };
    },
    trans: function (lv) {
      var x = R.int(1, 5), y = R.int(1, 5), dx = R.int(-x, 4), dy = R.int(-y, 4);
      if (!dx && !dy) dx = 2;
      if (lv === 3) {
        var right = dirWords(dx, dy), o = R.mc(right, [dirWords(-dx || 1, dy), dirWords(dy, dx), dirWords(dx, -dy || 1)].filter(function (s) { return s !== right; }));
        return { q: 'Point A moves to point B. Describe the translation.', type: 'mc', options: o.options, answer: o.answer, fig: grid(10, [{ x: x, y: y, l: 'A' }, { x: x + dx, y: y + dy, l: 'B', c: 'var(--strand)' }]),
          hint: 'Count across first: how many squares right or left? Then count up or down.', steps: ['A is at (' + x + ', ' + y + '). B is at (' + (x + dx) + ', ' + (y + dy) + ').', 'Across: ' + x + ' to ' + (x + dx) + ' is ' + (dx ? Math.abs(dx) + ' ' + (dx > 0 ? 'right' : 'left') : 'no move') + '. Up/down: ' + y + ' to ' + (y + dy) + ' is ' + (dy ? Math.abs(dy) + ' ' + (dy > 0 ? 'up' : 'down') : 'no move') + '.', 'The translation is ' + right + '.'], explain: right + '.' };
      }
      var ans = lv === 1 ? x + dx : (R.int(0, 1) ? x + dx : y + dy), askX = ans === x + dx && (lv === 1 || R.int(0, 1)), q2;
      if (lv === 1) { dy = 0; if (!dx) dx = 3; ans = x + dx; askX = true; }
      return { q: 'Point A is at (' + x + ', ' + y + '). It slides ' + dirWords(dx, dy) + '. What is the <b>' + (askX ? 'first' : 'second') + '</b> number of its new position?', type: 'num', answer: askX ? x + dx : y + dy,
        fig: lv === 1 ? grid(10, [{ x: x, y: y, l: 'A' }]) : '', hint: 'Right and left change the first number. Up and down change the second number.',
        steps: ['Right adds to the first number, left subtracts. Up adds to the second number, down subtracts.', 'New position: (' + x + (dx >= 0 ? ' + ' + dx : ' &minus; ' + -dx) + ', ' + y + (dy >= 0 ? ' + ' + dy : ' &minus; ' + -dy) + ') = (' + (x + dx) + ', ' + (y + dy) + ').<div class="fig">' + grid(10, [{ x: x, y: y, l: 'A' }, { x: x + dx, y: y + dy, l: 'A′', c: 'var(--strand)' }], null, [[x, y, x + dx, y + dy]]) + '</div>'],
        explain: 'The new position is (' + (x + dx) + ', ' + (y + dy) + ').' };
    },
    refl: function (lv) {
      var m = R.int(3, 7), x = R.int(Math.max(0, m - 3), m - 1), y = R.int(1, 9), nx = 2 * m - x;
      if (lv === 3) {
        var hy = R.int(3, 7), py = R.int(hy - 3, hy - 1), px = R.int(1, 9), ny = 2 * hy - py;
        return { q: 'Point P at (' + px + ', ' + py + ') is reflected in the dashed line across the grid at height ' + hy + '. What is the second number of its image?', type: 'num', answer: ny, fig: grid(10, [{ x: px, y: py, l: 'P' }], null, null, { h: hy }),
          hint: 'P is ' + (hy - py) + ' below the line. Its image is the same distance above the line.', steps: ['P is ' + (hy - py) + ' unit' + (hy - py > 1 ? 's' : '') + ' below the mirror line.', 'The image is ' + (hy - py) + ' above it: ' + hy + ' + ' + (hy - py) + ' = ' + ny + '.', 'The image is (' + px + ', ' + ny + '). The first number does not change.'], explain: 'The image is at (' + px + ', ' + ny + ').' };
      }
      return { q: 'Point P is reflected in the dashed mirror line. What is the first number of its image?', type: 'num', answer: nx, fig: grid(10, [{ x: x, y: y, l: 'P' }], null, null, { v: m }),
        hint: 'Count the squares from P to the line. The image is the same distance on the other side.', steps: ['P is at (' + x + ', ' + y + '). The mirror line is at ' + m + '.', 'P is ' + (m - x) + ' unit' + (m - x > 1 ? 's' : '') + ' left of the line. The image is ' + (m - x) + ' right of it: ' + m + ' + ' + (m - x) + ' = ' + nx + '.', 'The image is at (' + nx + ', ' + y + ').<div class="fig">' + grid(10, [{ x: x, y: y, l: 'P' }, { x: nx, y: y, l: 'P′', c: 'var(--strand)' }], null, null, { v: m }) + '</div>'], explain: 'The image is at (' + nx + ', ' + y + ').' };
    },
    sym: function (lv) {
      var shapes = [['rectangle', 2, rect(5, 3, {})], ['square', 4, rect(3, 3, {})], ['parallelogram', 0, quad('parallelogram', 150)], ['kite', 1, quad('kite', 150)], ['trapezoid', 1, quad('trapezoid', 150)]];
      var sh = lv === 1 ? R.pick(shapes.slice(0, 2)) : R.pick(shapes);
      return { q: 'How many lines of symmetry does this ' + sh[0] + ' have?', type: 'num', answer: sh[1], fig: sh[2],
        hint: 'A line of symmetry folds the shape so both halves match exactly. Try folding up-down, left-right, and corner to corner.', steps: ['Imagine folding the shape along different lines.', sh[0] === 'rectangle' ? 'Folding top to bottom or left to right matches. Folding corner to corner does not, because the sides are not equal.' : sh[0] === 'square' ? 'Up-down, left-right and both diagonals all match.' : sh[0] === 'parallelogram' ? 'No fold makes the halves match exactly.' : 'Only one fold, down the middle, makes the halves match.', 'It has ' + sh[1] + ' line' + (sh[1] === 1 ? '' : 's') + ' of symmetry.'],
        explain: 'A ' + sh[0] + ' like this has ' + sh[1] + ' line' + (sh[1] === 1 ? '' : 's') + ' of symmetry.' };
    }
  };

  A.register('shapes', {
    html:
'<section class="sec"><h2><span class="n">1</span>Kinds of angles</h2>' +
'<p>An <b>angle</b> is made where two lines meet. Its size is how far it opens, measured in degrees (&deg;). The <b>corner of a sheet of paper</b> is a right angle. Use it to check other angles.</p>' +
'<div class="vrow"><figure><figcaption>acute: less than a right angle</figcaption>' + angle(45, 0) + '</figure><figure><figcaption>right: a square corner</figcaption>' + angle(90, 0) + '</figure><figure><figcaption>obtuse: between right and straight</figcaption>' + angle(130, 0) + '</figure><figure><figcaption>straight: a straight line</figcaption>' + angle(180, 0) + '</figure></div>' +
'<div class="lab"><span class="lt">Try it: open the angle</span>' +
'<div class="ctrl"><label for="san">Opening: <output id="sano"></output><input type="range" id="san" min="5" max="180" step="5" value="60"></label><label for="sar">Turn the drawing: <output id="saro"></output><input type="range" id="sar" min="0" max="345" step="15" value="0"></label></div>' +
'<div class="fig" id="safig"></div><div class="out" id="saout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking longer lines make a bigger angle. The size of an angle is how far it opens, not how long the lines are. Turning the drawing does not change it either.</p></div>' +
A.yt({ gen: function () { return gen.angle(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Properties of rectangles</h2>' +
'<p>Every <b>rectangle</b> has:</p>' +
'<ul><li><b>4 right angles</b>.</li><li>Opposite sides that are <b>parallel</b>: they go in the same direction and never meet. Matching arrows show parallel sides.</li><li>Sides that meet at a corner are <b>perpendicular</b>: they meet at a right angle.</li><li><b>2 lines of symmetry</b>. A square, which is a special rectangle, has 4.</li></ul>' +
'<div class="lab"><span class="lt">Try it: explore a rectangle</span>' +
'<div class="ctrl"><label for="srw">Width: <output id="srwo"></output><input type="range" id="srw" min="1" max="9" value="6"></label><label for="srh">Height: <output id="srho"></output><input type="range" id="srh" min="1" max="5" value="3"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-sr="right" aria-pressed="true">Right angles</button><button type="button" class="btn alt" data-sr="par" aria-pressed="false">Parallel sides</button><button type="button" class="btn alt" data-sr="sym" aria-pressed="false">Lines of symmetry</button></div>' +
'<div class="fig" id="srfig"></div><div class="out" id="srout"></div></div>' +
'<div class="eg"><b class="t">Examples and non-examples</b><p>Only shapes with 4 right angles are rectangles.</p>' +
'<div class="vrow"><figure><figcaption>rectangle: yes</figcaption>' + quad('rectangle') + '</figure><figure><figcaption>square: yes</figcaption>' + quad('square') + '</figure><figure><figcaption>parallelogram: no</figcaption>' + quad('parallelogram') + '</figure><figure><figcaption>trapezoid: no</figcaption>' + quad('trapezoid') + '</figure></div></div>' +
A.yt({ gen: function () { return gen.rect(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Coordinates</h2>' +
'<p>A <b>coordinate grid</b> uses two numbers to name a point, like (4, 2). This is an <b>ordered pair</b>. Always go <b>across first, then up</b>. The point (0, 0) is called the <b>origin</b>.</p>' +
'<div class="lab"><span class="lt">Try it: plot a point</span>' +
'<div class="ctrl"><label for="scx">Across (first number): <output id="scxo"></output><input type="range" id="scx" min="0" max="10" value="4"></label><label for="scy">Up (second number): <output id="scyo"></output><input type="range" id="scy" min="0" max="10" value="2"></label></div>' +
'<div class="fig" id="scfig"></div><div class="out" id="scout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up the order. (4, 2) and (2, 4) are different points. Across first, then up: "walk, then climb".</p></div>' +
A.yt({ gen: function () { return gen.coord(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Translations: slides</h2>' +
'<p>A <b>translation</b> slides a shape. Every point moves the same distance in the same direction. The shape does not turn or flip, and it stays the same size. Describe it by how far it moves <b>right or left</b>, and <b>up or down</b>.</p>' +
'<div class="lab"><span class="lt">Try it: slide the triangle</span>' +
'<div class="ctrl"><label for="stx">Right (+) or left (&minus;): <output id="stxo"></output><input type="range" id="stx" min="-2" max="6" value="4"></label><label for="sty">Up (+) or down (&minus;): <output id="styo"></output><input type="range" id="sty" min="-2" max="5" value="1"></label></div>' +
'<div class="fig" id="stfig"></div><div class="out" id="stout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Right and left change the <b>first</b> number. Up and down change the <b>second</b> number.</p></div>' +
A.yt({ gen: function () { return gen.trans(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Reflections: flips</h2>' +
'<p>A <b>reflection</b> flips a shape over a <b>mirror line</b>. Each point lands the same distance from the line, on the other side. The image is a mirror image: it faces the other way.</p>' +
'<div class="lab"><span class="lt">Try it: move the mirror</span>' +
'<div class="ctrl"><label for="sfm">Mirror line at: <output id="sfmo"></output><input type="range" id="sfm" min="4" max="8" value="5"></label><label for="sfd">Direction<select id="sfd"><option value="v">up and down (vertical)</option><option value="h">across (horizontal)</option></select></label></div>' +
'<div class="fig" id="sffig"></div><div class="out" id="sfout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Point P is at (3, 6). The mirror line goes up and down through 5. P is 2 units left of the line, so its image is 2 units right: <b>(7, 6)</b>. The second number stays the same.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Sliding instead of flipping. A reflection reverses the shape, like your hand in a mirror. Check: matching points must be the same distance from the line.</p></div>' +
A.yt({ gen: function () { return gen.refl(1); } }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function an() {
        var t = +$('#san', root).value, r = +$('#sar', root).value, k = kind(t);
        $('#sano', root).textContent = t + '°'; $('#saro', root).textContent = r + '°';
        $('#safig', root).innerHTML = angle(t, r, null, true, true);
        $('#saout', root).innerHTML = '<p>This is ' + (k === 'acute' || k === 'obtuse' ? 'an ' : 'a ') + '<span class="big">' + k + '</span> angle: ' + KDESC[k] + '.</p>';
      }
      A.bind(root, ['san', 'sar'], an);
      var on = { right: true, par: false, sym: false };
      function rc() {
        var w = +$('#srw', root).value, h = +$('#srh', root).value;
        $('#srwo', root).textContent = w; $('#srho', root).textContent = h;
        $('#srfig', root).innerHTML = rect(w, h, { right: on.right, par: on.par, sym: on.sym, lab: true });
        $('#srout', root).innerHTML = '<p>' + (w === h ? 'This is a <b>square</b>: a rectangle with 4 equal sides. It has <b>4</b> lines of symmetry.' : 'This is a <b>rectangle</b>. It has <b>2</b> lines of symmetry.') + ' It always has 4 right angles and 2 pairs of parallel sides.</p>';
        A.$$('[data-sr]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(on[b.getAttribute('data-sr')])); b.classList.toggle('alt', !on[b.getAttribute('data-sr')]); });
      }
      A.$$('[data-sr]', root).forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-sr'); on[k] = !on[k]; rc(); }); });
      A.bind(root, ['srw', 'srh'], rc);
      function co() {
        var x = +$('#scx', root).value, y = +$('#scy', root).value;
        $('#scxo', root).textContent = x; $('#scyo', root).textContent = y;
        var paths = x || y ? [{ pts: [[0, 0], [x, 0], [x, 0.001]], fill: 'none' }] : [];
        $('#scfig', root).innerHTML = grid(10, [{ x: x, y: y, l: '(' + x + ', ' + y + ')' }], null, (x ? [[0, 0, x, 0]] : []).concat(y ? [[x, 0, x, y]] : []));
        $('#scout', root).innerHTML = '<p>Start at the origin (0, 0). Go <b>' + x + '</b> across, then <b>' + y + '</b> up. The point is <span class="big">(' + x + ', ' + y + ')</span>.</p>';
      }
      A.bind(root, ['scx', 'scy'], co);
      function tr() {
        var dx = +$('#stx', root).value, dy = +$('#sty', root).value, P = move(TRI, 2, 3), Q = move(P, dx, dy);
        $('#stxo', root).textContent = dx; $('#styo', root).textContent = dy;
        $('#stfig', root).innerHTML = grid(10, [{ x: P[0][0], y: P[0][1], l: 'A' }, { x: Q[0][0], y: Q[0][1], l: 'A′', c: 'var(--strand)' }], [{ pts: P, fill: 'color-mix(in srgb,var(--hi) 55%,transparent)' }, { pts: Q, fill: 'color-mix(in srgb,var(--strand) 35%,transparent)', dash: true }], dx || dy ? [[P[0][0], P[0][1], Q[0][0], Q[0][1]]] : []);
        $('#stout', root).innerHTML = '<p>Translation: <b>' + dirWords(dx, dy) + '</b>.</p><p>Corner A moves from (' + P[0].join(', ') + ') to (' + Q[0].join(', ') + '). Every corner moves the same way: ' + P.map(function (p, i) { return '(' + p.join(', ') + ') &rarr; (' + Q[i].join(', ') + ')'; }).join(', ') + '.</p>';
      }
      A.bind(root, ['stx', 'sty'], tr);
      function rf() {
        var m = +$('#sfm', root).value, d = $('#sfd', root).value, P, Q;
        $('#sfmo', root).textContent = m;
        if (d === 'v') { P = move(FLAG, m - 3, 2); Q = reflV(P, m); } else { P = move(FLAG, 3, m - 4); Q = reflH(P, m); }
        $('#sffig', root).innerHTML = grid(10, [{ x: P[2][0], y: P[2][1], l: 'P' }, { x: Q[2][0], y: Q[2][1], l: 'P′', c: 'var(--strand)' }], [{ pts: P, fill: 'color-mix(in srgb,var(--hi) 55%,transparent)' }, { pts: Q, fill: 'color-mix(in srgb,var(--strand) 35%,transparent)', dash: true }], null, d === 'v' ? { v: m } : { h: m });
        var dist = d === 'v' ? m - P[2][0] : m - P[2][1];
        $('#sfout', root).innerHTML = '<p>The flag tip P is at (' + P[2].join(', ') + '). It is ' + Math.abs(dist) + (Math.abs(dist) === 1 ? ' unit' : ' units') + ' from the mirror line, so its image P′ is ' + Math.abs(dist) + (Math.abs(dist) === 1 ? ' unit' : ' units') + ' on the other side, at <b>(' + Q[2].join(', ') + ')</b>.</p><p>The flag now points the other way. That is how you can tell a flip from a slide.</p>';
      }
      A.bind(root, ['sfm', 'sfd'], rf);
    },

    quiz: [
      { q: 'What kind of angle is this?', type: 'mc', fig: angle(125, 20), options: ['acute', 'right', 'obtuse', 'straight'], answer: 2, hint: 'It opens wider than a square corner but is not a straight line.', explain: 'It is more than a right angle and less than a straight angle: obtuse.' },
      { q: 'Which is <b>not</b> true for every rectangle?', type: 'mc', options: ['All four sides are the same length', 'It has 4 right angles', 'Opposite sides are parallel', 'It has at least 2 lines of symmetry'], answer: 0, hint: 'Think of a long, thin rectangle.', explain: 'Only squares have 4 equal sides. Most rectangles have two long and two short sides.' },
      { q: 'How many lines of symmetry does a square have?', type: 'num', answer: 4, fig: rect(3, 3, { sym: true }), hint: 'Count the dashed lines.', explain: 'Up-down, across, and both diagonals: 4.' },
      { q: 'Which ordered pair names point Q?', type: 'mc', fig: grid(10, [{ x: 6, y: 3, l: 'Q' }]), options: ['(3, 6)', '(6, 6)', '(6, 3)', '(3, 3)'], answer: 2, hint: 'Across first, then up.', explain: 'Q is 6 across and 3 up: (6, 3).' },
      { q: 'Point A at (2, 5) slides 4 units right and 3 units down. Where does it end up?', type: 'mc', options: ['(6, 8)', '(6, 2)', '(5, 1)', '(2, 2)'], answer: 1, hint: 'Right adds to the first number. Down subtracts from the second.', explain: '(2 + 4, 5 &minus; 3) = (6, 2).' },
      { q: 'Point P at (2, 4) is reflected in a vertical mirror line through 5. What is the first number of its image?', type: 'num', answer: 8, fig: grid(10, [{ x: 2, y: 4, l: 'P' }], null, null, { v: 5 }), hint: 'P is 3 units left of the line.', explain: 'The image is 3 units right of the line: 5 + 3 = 8. The image is (8, 4).' },
      { q: 'Two lines meet at a right angle. What are they called?', type: 'mc', options: ['parallel', 'symmetry lines', 'acute', 'perpendicular'], answer: 3, hint: 'Parallel lines never meet.', explain: 'Lines that meet at a right angle are perpendicular.' }
    ],

    practice: [
      { id: 'sh4-angle', name: 'Kinds of angles', code: 'E2.4', gen: gen.angle },
      { id: 'sh4-rect', name: 'Rectangle properties', code: 'E1.1', gen: gen.rect },
      { id: 'sh4-sym', name: 'Lines of symmetry', code: 'E1.1', gen: gen.sym },
      { id: 'sh4-coord', name: 'Read coordinates', code: 'E1.2', gen: gen.coord },
      { id: 'sh4-trans', name: 'Translations', code: 'E1.2, E1.3', gen: gen.trans },
      { id: 'sh4-refl', name: 'Reflections', code: 'E1.3', gen: gen.refl }
    ]
  });
})();
