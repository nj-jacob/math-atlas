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

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  var QN = ['rectangle', 'parallelogram', 'square', 'kite', 'trapezoid'];
  function quadRow(st) {
    var u = 16, s = '';
    QN.forEach(function (nm, i) {
      var P = QUADS[nm], ox = 10 + (i % 3) * 120, oy = 10 + Math.floor(i / 3) * 110, on = st && st.lit[i];
      s += '<g data-k="' + i + '"><rect x="' + (ox - 6) + '" y="' + (oy - 6) + '" width="112" height="100" rx="12" style="fill:' + (on ? 'color-mix(in srgb,var(--strand) 22%,var(--card))' : 'transparent') + ';stroke:' + (on ? 'var(--strand)' : 'var(--line)') + '" stroke-width="2"/>' +
        '<polygon points="' + P.map(function (p) { return (ox + 4 + p[0] * u).toFixed(1) + ',' + (oy + 4 + (5 - p[1]) * u).toFixed(1); }).join(' ') + '" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/></g>';
    });
    return A.svg(370, 220, s, 'Five four-sided shapes: rectangle, parallelogram, square, kite, trapezoid');
  }
  var START = move(TRI, 2, 2);

  var LESSONS = [
    { id: 'angles', title: 'Angles', sub: 'Compare with a square corner.', concepts: [
      { id: 'kinds', title: 'Kinds of angles', exp: ['E2.4'], skill: 'sh4-angle',
        body: '<p>An angle is how far two lines <b>open</b>. A <b>right angle</b> is a square corner, like the corner of a page. Compare other angles with it.</p>',
        watch: K.watch([[30, 'Acute: <b>less</b> than a right angle.'], [90, 'Right: a <b>square corner</b>, 90&deg;.'], [135, 'Obtuse: <b>more</b> than a right angle, less than straight.'], [180, 'Straight: a <b>straight line</b>, 180&deg;.']].map(function (p) { return [p[1], angle(p[0], 0, null, false, true), 2000]; })),
        try: K.lab({ controls: [{ id: 't', label: 'Opening', min: 5, max: 180, step: 5, value: 45, fmt: function (v) { return v + '&deg;'; } }, { id: 'r', label: 'Turn the drawing', min: 0, max: 330, step: 30, value: 0, fmt: function (v) { return v + '&deg;'; } }],
          render: function (s) { s.k = kind(s.t); return { fig: angle(s.t, s.r, null, false, true), out: '<p><span class="big">' + s.k + '</span> ' + KDESC[s.k] + '</p>' }; },
          tasks: [
            { do: 'Make an <b>obtuse</b> angle.', goal: function (s) { return s.k === 'obtuse'; }, yes: 'More than a square corner.' },
            { do: 'Make a <b>right</b> angle, then <b>turn</b> the drawing.', goal: function (s) { return s.k === 'right' && s.r > 0; }, yes: 'Still a right angle: turning does not change it.' }
          ] }),
        key: '<p>Compare with a <b>square corner</b>: smaller is acute, bigger is obtuse.</p>',
        check: [T('angle', 1), T('angle', 1)] },

      { id: 'turned', title: 'Turned and tricky angles', exp: ['E2.4'], skill: 'sh4-angle', hard: true,
        body: '<p>An angle\'s kind does not change when it is <b>turned</b> or when its lines are <b>longer</b>. Only the opening matters.</p>',
        watch: K.watch([
          ['An obtuse angle.', angle(120, 0, null, false, true), 1600],
          ['Turned: still 120&deg;, still obtuse.', angle(120, 100, null, false, true), 1800],
          ['Turned again. Hold a square corner against it to check.', angle(120, 220, null, false, true), 2000]
        ]),
        ways: [
          { label: 'Paper corner test', html: '<p>Fold any paper twice to make a perfect square corner. Put one edge on one line of the angle. If the other line is <b>inside</b> the corner, it is acute. <b>Outside</b>, obtuse.</p>' },
          { label: 'Arms', html: '<p>Hold one arm straight out in front and the other straight up: right angle. Close them a little: acute. Open them wider: obtuse. Out flat: straight.</p>' }
        ],
        key: '<p><b>Only the opening matters</b>, not the length or the direction.</p>',
        mistake: '<p>Thinking a turned right angle is not right, or that longer lines make a bigger angle. Turn the page so one line is flat and check again.</p>',
        check: [T('angle', 2), T('angle', 3)] }
    ] },

    { id: 'quads', title: 'Rectangles and symmetry', sub: 'Right angles, parallel sides, lines of symmetry.', concepts: [
      { id: 'rect-props', title: 'What makes a rectangle', exp: ['E1.1'], skill: 'sh4-rect',
        body: '<p>A <b>rectangle</b> has 4 right angles. Its opposite sides are <b>parallel</b> (they never meet) and equal. Sides that meet are <b>perpendicular</b>.</p>',
        watch: K.watch([
          ['A rectangle.', rect(5, 3, {}), 1400],
          ['4 right angles: every corner is square.', rect(5, 3, { right: true }), 1800],
          ['Opposite sides are parallel: matching arrows.', rect(5, 3, { par: true }), 2000]
        ]),
        key: '<p>Rectangle: <b>4 right angles</b>, opposite sides <b>parallel</b>.</p>',
        check: [T('rect', 1), T('rect', 3)] },

      { id: 'is-rect', title: 'Is it a rectangle?', exp: ['E1.1'], skill: 'sh4-rect',
        body: '<p>To decide, <b>check every corner</b>. All 4 must be right angles. A square is a special rectangle.</p>',
        watch: K.watch([
          ['A parallelogram: parallel sides, but its corners are not square. <b>Not</b> a rectangle.', quad('parallelogram', 150), 2200],
          ['A square: 4 right angles. It <b>is</b> a rectangle, with all sides equal too.', quad('square', 150), 2200]
        ]),
        try: K.tap({ render: quadRow, label: function (st) { return '<p>' + st.order.length + ' chosen</p>'; },
          tasks: [{ do: 'Tap <b>every</b> shape that is a rectangle.', goal: function (st) { var k = Object.keys(st.lit).sort().join(); return k === '0,2'; }, yes: 'The rectangle and the square: both have 4 right angles.' }] }),
        key: '<p><b>4 right angles = rectangle.</b> Squares count.</p>',
        mistake: '<p>Leaving the square out ("it is a square, not a rectangle"), or counting a parallelogram because it "looks like a pushed-over rectangle". Check the corners.</p>',
        check: [T('rect', 2), T('rect', 2)] },

      { id: 'symmetry', title: 'Lines of symmetry', exp: ['E1.1'], skill: 'sh4-sym',
        body: '<p>A <b>line of symmetry</b> folds a shape so both halves match exactly.</p>',
        watch: K.watch([
          ['A rectangle folds top to bottom and side to side: <b>2</b> lines.', rect(5, 3, { sym: true }), 2200],
          ['A square also folds corner to corner: <b>4</b> lines.', rect(3, 3, { sym: true }), 2200],
          ['A kite folds only one way: <b>1</b> line.', quad('kite', 150), 2000]
        ]),
        key: '<p>Fold it in your mind: <b>do the halves match exactly?</b></p>',
        mistake: '<p>Counting the diagonals of a rectangle as lines of symmetry. Cut a paper rectangle and fold it corner to corner: the halves do not match.</p>',
        check: [T('sym', 1), T('sym', 2)] }
    ] },

    { id: 'grid', title: 'Grids and moves', sub: 'Ordered pairs, slides and flips.', concepts: [
      { id: 'plot', title: 'Ordered pairs', exp: ['E1.2'], skill: 'sh4-coord', hard: true,
        body: '<p>(3, 5) means go <b>across 3</b>, then <b>up 5</b>. Across always comes first.</p>',
        watch: K.watch([
          ['(3, 5). Start at 0.', grid(10, [], null, []), 1400],
          ['Across 3.', grid(10, [], null, [[0, 0, 3, 0]]), 1600],
          ['Then up 5. That is <b>(3, 5)</b>.', grid(10, [{ x: 3, y: 5, l: 'A' }], null, [[0, 0, 3, 0], [3, 0, 3, 5]]), 2200]
        ]),
        try: K.lab({ controls: [{ id: 'x', label: 'Across', min: 0, max: 10, value: 0 }, { id: 'y', label: 'Up', min: 0, max: 10, value: 0 }],
          render: function (s) { return { fig: grid(10, [{ x: s.x, y: s.y, l: 'P' }]), out: '<p class="big math">P (' + s.x + ', ' + s.y + ')</p>' }; },
          tasks: [
            { do: 'Plot <b>(4, 7)</b>.', goal: function (s) { return s.x === 4 && s.y === 7; }, yes: 'Across 4, up 7.' },
            { do: 'Now plot <b>(7, 4)</b>. Notice how far it is from (4, 7).', goal: function (s) { return s.x === 7 && s.y === 4; }, yes: 'A different point: the order matters.' }
          ] }),
        ways: [
          { label: 'Walk, then climb', html: '<p>Walk along the hallway (across), then take the elevator (up). You cannot take the elevator before you reach it.</p>' },
          { label: 'Alphabetical', html: '<p>The pair is (x, y). <b>x</b> comes before <b>y</b> in the alphabet, and across comes before up.</p>' }
        ],
        key: '<p><b>Across first, then up.</b></p>',
        mistake: '<p>Swapping the numbers: plotting (4, 7) at across 7, up 4. Ask: "Which way did you go first?"</p>',
        check: [T('coord', 1), T('coord', 2), T('coord', 3)] },

      { id: 'translate', title: 'Slides', exp: ['E1.2', 'E1.3'], skill: 'sh4-trans',
        body: '<p>A <b>translation</b> slides a shape without turning it. Every corner moves the same way: right and left change the first number, up and down change the second.</p>',
        watch: K.watch([
          ['A triangle.', grid(10, [], [{ pts: START, fill: 'color-mix(in srgb,var(--strand) 35%,var(--card))' }]), 1400],
          ['Slide it 4 right and 3 up. Every corner moves the same.', grid(10, [], [{ pts: START, fill: 'transparent', dash: true }, { pts: move(START, 4, 3), fill: 'color-mix(in srgb,var(--strand) 35%,var(--card))' }], [[2, 2, 6, 5]]), 2400]
        ]),
        try: K.lab({ controls: [{ id: 'dx', label: 'Right (+) or left (&minus;)', min: -2, max: 6, value: 0 }, { id: 'dy', label: 'Up (+) or down (&minus;)', min: -2, max: 5, value: 0 }],
          render: function (s) { return { fig: grid(10, [{ x: 2 + s.dx, y: 2 + s.dy, c: 'var(--accent)' }], [{ pts: START, fill: 'transparent', dash: true }, { pts: move(START, s.dx, s.dy), fill: 'color-mix(in srgb,var(--strand) 35%,var(--card))' }], s.dx || s.dy ? [[2, 2, 2 + s.dx, 2 + s.dy]] : []), out: '<p>' + dirWords(s.dx, s.dy) + '. Corner: (2, 2) &rarr; <b>(' + (2 + s.dx) + ', ' + (2 + s.dy) + ')</b></p>' }; },
          tasks: [
            { do: 'Slide the triangle <b>3 right and 2 up</b>.', goal: function (s) { return s.dx === 3 && s.dy === 2; }, yes: 'The corner moved from (2, 2) to (5, 4).' },
            { do: 'Slide it so the orange corner lands on <b>(1, 6)</b>.', goal: function (s) { return s.dx === -1 && s.dy === 4; }, yes: '1 left and 4 up.' }
          ] }),
        key: '<p>Right/left: <b>first number</b>. Up/down: <b>second number</b>.</p>',
        check: [T('trans', 1), T('trans', 2), T('trans', 3)] },

      { id: 'reflect', title: 'Flips', exp: ['E1.3'], skill: 'sh4-refl', hard: true,
        body: '<p>A <b>reflection</b> flips a shape over a mirror line. Each point lands the <b>same distance</b> on the other side.</p>',
        watch: K.watch([
          ['A flag and a mirror line at 5.', grid(10, [], [{ pts: move(FLAG, 2, 4), fill: 'color-mix(in srgb,var(--strand) 35%,var(--card))' }], null, { v: 5 }), 1600],
          ['The pole is 3 from the line. Its image is 3 on the other side: at 8. The flag faces the other way.', grid(10, [], [{ pts: move(FLAG, 2, 4), fill: 'color-mix(in srgb,var(--strand) 35%,var(--card))' }, { pts: reflV(move(FLAG, 2, 4), 5), fill: 'color-mix(in srgb,var(--btn) 35%,var(--card))' }], null, { v: 5 }), 2600]
        ]),
        try: K.lab({ controls: [{ id: 'x', label: 'P across', min: 0, max: 5, value: 1 }, { id: 'y', label: 'P up', min: 0, max: 10, value: 2 }],
          render: function (s) { var ix = 10 - s.x; return { fig: grid(10, [{ x: s.x, y: s.y, l: 'P' }, { x: ix, y: s.y, l: "P'", c: 'var(--btn)' }], null, null, { v: 5 }), out: '<p>P (' + s.x + ', ' + s.y + ') is ' + (5 - s.x) + ' from the line. Image: <b>(' + ix + ', ' + s.y + ')</b></p>' }; },
          tasks: [{ do: 'Move P so its image lands on <b>(8, 4)</b>.', goal: function (s) { return s.x === 2 && s.y === 4; }, yes: 'P at (2, 4) is 3 left of the line; the image is 3 right.' }] }),
        ways: [
          { label: 'Fold the paper', html: '<p>Fold along the mirror line. The point and its image touch when folded.</p>' },
          { label: 'Count to the line', html: '<p>Count squares from the point straight to the line. Keep counting the same number past it. That is the image.</p>' }
        ],
        key: '<p><b>Same distance from the mirror line, on the other side.</b></p>',
        mistake: '<p>Sliding the shape across instead of flipping it, so it faces the same way. In a reflection, the image faces the opposite way.</p>',
        check: [T('refl', 1), T('refl', 3)] }
    ] }
  ];

  A.register('shapes', {
    lessons: LESSONS,
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

  /* ---------- More ways to ask (question shapes; see docs/QUESTIONS.md) ----------
     q.meta holds the facts that tests/verify/grade4.js uses to work each answer out again. */
  var why = K.why, who = A.Q && A.Q.name;
  var small = K.small;
  var SYM = { square: 4, rectangle: 2, kite: 1, parallelogram: 0 };
  function symPic(name) { return small(name === 'square' ? rect(3, 3, {}) : name === 'rectangle' ? rect(5, 3, {}) : quad(name, 150), 130); }
  /* the 0 to 10 grid with lettered points to tap. pts = [{ x, y, key }] */
  function gridTap(pts, mirror) {
    var u = 40, o = 36, X = function (x) { return o + x * u; }, Y = function (y) { return 10 + (10 - y) * u; }, s = '';
    pts.forEach(function (p) {
      s += '<g data-hit="' + p.key + '" aria-label="point ' + p.key + '"><circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="15" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>' +
        '<text x="' + X(p.x) + '" y="' + (Y(p.y) + 6) + '" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--ink)">' + p.key + '</text></g>';
    });
    return grid(10, [], null, null, mirror).replace(/<\/svg>$/, s + '</svg>');
  }
  /* three different points on the grid: the right one first, then two near misses */
  function three(x, y, alts) {
    var out = [[x, y]];
    alts.forEach(function (a) { if (out.length < 3 && a[0] >= 0 && a[0] <= 10 && a[1] >= 0 && a[1] <= 10 && !out.some(function (p) { return p[0] === a[0] && p[1] === a[1]; })) out.push(a); });
    while (out.length < 3) { var r = [R.int(0, 10), R.int(0, 10)]; if (!out.some(function (p) { return p[0] === r[0] && p[1] === r[1]; })) out.push(r); }
    return R.shuffle(out).map(function (p, i) { return { x: p[0], y: p[1], key: 'ABC'.charAt(i) }; });
  }
  var FACTS = [['A square is a rectangle.', true, 'A square has 4 right angles, so it is a special rectangle.'], ['Every rectangle has 4 right angles.', true, 'That is what makes it a rectangle.'],
    ['A rectangle has sides that are perpendicular.', true, 'Sides that meet at a corner make a right angle, so they are perpendicular.'], ['A parallelogram is always a rectangle.', false, 'Most parallelograms do not have right angles.'],
    ['A rectangle has only 1 pair of parallel sides.', false, 'Both pairs of opposite sides are parallel.'], ['The opposite sides of a rectangle are different lengths.', false, 'Opposite sides of a rectangle are always equal.']];
  var SHAPES = {
    'sh4-angle': [
      [1, 'tap', function (lv) {
        var want = R.pick(['acute', 'right', 'obtuse']), ts = R.shuffle([R.pick(lv === 1 ? [30, 45, 60] : [70, 80, 85]), 90, R.pick(lv === 1 ? [120, 135, 150] : [95, 100, 110])]);
        var ans = ts.map(kind).indexOf(want);
        return { q: 'Tap the <b>' + want + '</b> angle.', type: 'tap', tiles: ts.map(function (t) { return small(angle(t, lv === 1 ? 0 : R.pick([0, 40, 200])), 140); }), answer: ans, answerText: 'the ' + want + ' angle',
          hint: 'Compare each angle with a square corner.', steps: ['A ' + want + ' angle is ' + KDESC[want] + '.'], explain: 'The ' + want + ' angle is ' + KDESC[want] + '.', meta: { k: 'sh4-angle-tap', ts: ts, want: want } };
      }],
      [1, 'match', function () {
        var ts = [R.pick([30, 45, 60]), 90, R.pick([120, 135, 150])];
        var pairs = ts.map(function (t) { return [small(angle(t, 0), 120), kind(t)]; });
        return { q: 'Match each angle to its name.', type: 'match', pairs: pairs, hint: 'Is it smaller than, equal to, or bigger than a square corner?',
          steps: ['Acute: less than a right angle. Right: a square corner. Obtuse: more than a right angle.'], explain: 'Acute, right and obtuse.', meta: { k: 'sh4-angle-match', ts: ts } };
      }],
      [2, 'mistake', function () {
        var t = R.pick([75, 85, 95, 105, 135, 45]), p = who(), k = kind(t), truth = !R.int(0, 1), said = truth ? k : (k === 'acute' ? 'obtuse' : 'acute');
        var right = 'This angle is ' + KDESC[k] + ', so it is ' + k + '.';
        return { q: p + ' says this angle is <b>' + said + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: angle(t, R.pick([0, 60, 210])),
          why: why(right, ['Turning an angle changes its kind.', 'Longer arms make a bigger angle.', 'Every angle that leans is obtuse.']),
          hint: 'Imagine a square corner on top of it.', steps: [right], explain: right, meta: { k: 'sh4-angle-tf', t: t, said: said } };
      }],
      [2, 'pick', function () {
        var want = R.pick(['acute', 'obtuse']), opts = R.shuffle([20, 45, 89, 90, 91, 120, 170, 180]).slice(0, 5);
        if (!opts.some(function (t) { return kind(t) === want; })) opts[0] = want === 'acute' ? 60 : 130;
        var ans = opts.map(function (t, j) { return kind(t) === want ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every angle that is <b>' + want + '</b>.', type: 'pick', options: opts.map(function (t) { return t + '&deg;'; }), answer: ans,
          hint: want === 'acute' ? 'Acute means less than 90&deg;.' : 'Obtuse means more than 90&deg; and less than 180&deg;.', steps: ['A right angle is 90&deg;. A straight angle is 180&deg;.'],
          explain: want === 'acute' ? 'Acute angles are less than 90&deg;.' : 'Obtuse angles are between 90&deg; and 180&deg;.', meta: { k: 'sh4-angle-pick', want: want } };
      }]
    ],
    'sh4-rect': [
      [1, 'pick', function () {
        var names = R.shuffle(['rectangle', 'square', 'parallelogram', 'trapezoid', 'kite']);
        var ans = names.map(function (n, j) { return n === 'rectangle' || n === 'square' ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every shape that is a <b>rectangle</b>.', type: 'pick', options: names.map(function (n) { return small(quad(n, 120), 110); }), answer: ans,
          hint: 'A rectangle has 4 right angles. A square counts too.', steps: ['Check every corner of each shape.', 'The rectangle and the square have 4 right angles.'],
          explain: 'The rectangle and the square both have 4 right angles.', meta: { k: 'sh4-rect-pick', names: names } };
      }],
      [1, 'mistake', function () {
        var f = R.pick(FACTS), p = who();
        return { q: p + ' says: "' + f[0] + '" True or false: ' + p + ' is right.', type: 'tf', answer: f[1], fig: rect(5, 3, { right: true, par: true }),
          why: why(f[2], ['Rectangles can have any angles.', 'Only long shapes are rectangles.', 'A rectangle has 3 sides.']),
          hint: 'A rectangle has 4 right angles, and its opposite sides are parallel and equal.', steps: [f[2]], explain: f[2], meta: { k: 'sh4-rect-tf', fact: f[0] } };
      }],
      [2, 'fill', function () {
        return { q: 'Fill in the facts about a rectangle that is not a square.', type: 'fill', fill: 'Right angles: [[]] &nbsp; Pairs of parallel sides: [[]] &nbsp; Lines of symmetry: [[]]', answers: [4, 2, 2], fig: rect(5, 3, { right: true, par: true, sym: true }),
          hint: 'Look at the marks on the picture.', steps: ['The corner marks show the right angles.', 'The arrows show parallel sides. The dashed lines show symmetry.'],
          explain: '4 right angles, 2 pairs of parallel sides, 2 lines of symmetry.', meta: { k: 'sh4-rect-fill' } };
      }]
    ],
    'sh4-sym': [
      [1, 'tap', function () {
        var names = R.shuffle(Object.keys(SYM)).slice(0, 3), target = R.pick(names);
        return { q: 'Tap the shape with <b>' + (SYM[target] === 0 ? 'no lines' : SYM[target] + ' line' + (SYM[target] > 1 ? 's' : '')) + '</b> of symmetry.', type: 'tap', tiles: names.map(symPic), answer: names.indexOf(target), answerText: 'the ' + target,
          hint: 'Imagine folding each shape so the halves match.', steps: ['Square: 4. Rectangle: 2. Kite: 1. Parallelogram: 0.'], explain: 'The ' + target + ' has ' + SYM[target] + '.', meta: { k: 'sh4-sym-tap', names: names } };
      }],
      [1, 'match', function () {
        var names = R.shuffle(Object.keys(SYM)).slice(0, 3), pairs = names.map(function (n) { return [symPic(n), SYM[n] + ' line' + (SYM[n] === 1 ? '' : 's')]; });
        return { q: 'Match each shape to its number of lines of symmetry.', type: 'match', pairs: pairs, hint: 'Try folding up and down, left and right, and corner to corner.',
          steps: ['Square: 4. Rectangle: 2. Kite: 1. Parallelogram: 0.'], explain: names.map(function (n) { return n + ': ' + SYM[n]; }).join('. ') + '.', meta: { k: 'sh4-sym-match', names: names } };
      }],
      [2, 'mistake', function () {
        var n = R.pick(Object.keys(SYM)), p = who(), truth = !R.int(0, 1), said = truth ? SYM[n] : R.pick([0, 1, 2, 4].filter(function (x) { return x !== SYM[n]; }));
        var right = 'The ' + n + ' has ' + SYM[n] + ' line' + (SYM[n] === 1 ? '' : 's') + ' of symmetry.';
        return { q: p + ' says this ' + n + ' has <b>' + said + '</b> line' + (said === 1 ? '' : 's') + ' of symmetry. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: symPic(n),
          why: why(right, ['Every four-sided shape has 4 lines of symmetry.', 'A corner-to-corner fold always works.', 'Lines of symmetry are the same as sides.']),
          hint: 'A fold must make both halves match exactly.', steps: [right], explain: right, meta: { k: 'sh4-sym-tf', name: n, said: said } };
      }]
    ],
    'sh4-coord': [
      [1, 'tap', function () {
        var x, y; do { x = R.int(1, 9); y = R.int(1, 9); } while (x === y);
        var pts = three(x, y, [[y, x], [x + 1, y], [x, y - 1]]);
        return { q: 'Tap the point at <b>(' + x + ', ' + y + ')</b>.', type: 'tap', pic: gridTap(pts), answer: pts.filter(function (p) { return p.x === x && p.y === y; })[0].key, answerText: 'the point at (' + x + ', ' + y + ')',
          hint: 'Go across first, then up.', steps: ['Start at 0. Go across to ' + x + '.', 'Then go up to ' + y + '.'], explain: '(' + x + ', ' + y + ') is ' + x + ' across and ' + y + ' up.', meta: { k: 'sh4-coord-tap', pts: pts, x: x, y: y } };
      }],
      [1, 'fill', function () {
        var x = R.int(0, 10), y = R.int(0, 10);
        return { q: 'Write the ordered pair for point A.', type: 'fill', fill: 'A is at ( [[]] , [[]] )', answers: [x, y], fig: grid(10, [{ x: x, y: y, l: 'A' }]),
          hint: 'The first number is how far across. The second is how far up.', steps: ['Look straight down from A: ' + x + '.', 'Look straight across from A: ' + y + '.'],
          explain: 'A is at (' + x + ', ' + y + ').', meta: { k: 'sh4-coord-fill', x: x, y: y } };
      }],
      [2, 'mistake', function () {
        var x, y; do { x = R.int(1, 9); y = R.int(1, 9); } while (x === y);
        var p = who(), truth = !R.int(0, 2), said = truth ? [x, y] : [y, x];
        var right = 'Across first, then up: P is at (' + x + ', ' + y + ').';
        return { q: p + ' says point P is at <b>(' + said[0] + ', ' + said[1] + ')</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: grid(10, [{ x: x, y: y, l: 'P' }]),
          why: why(right, ['Up comes first, then across.', 'The order of the numbers does not matter.', 'Always write the bigger number first.']),
          hint: 'Which number comes first in an ordered pair?', steps: [right], explain: right, meta: { k: 'sh4-coord-tf', x: x, y: y, said: said } };
      }]
    ],
    'sh4-trans': [
      [1, 'tap', function (lv) {
        var x = R.int(1, 5), y = R.int(1, 5), dx = R.int(1, 4), dy = lv === 1 ? 0 : R.int(1, 4) * R.pick([1, -1]);
        if (y + dy < 0) dy = -dy;
        var nx = x + dx, ny = y + dy, pts = three(nx, ny, [[x - dx, y + dy], [x + dy, y + dx], [nx, y - dy]]);
        return { q: 'Point S is at (' + x + ', ' + y + '). It slides <b>' + dirWords(dx, dy) + '</b>. Tap where it lands.', type: 'tap', pic: gridTap(pts), answer: pts.filter(function (p) { return p.x === nx && p.y === ny; })[0].key, answerText: 'the point at (' + nx + ', ' + ny + ')',
          hint: 'Right and left change the first number. Up and down change the second.', steps: ['Across: ' + x + ' + ' + dx + ' = ' + nx + '.', dy ? 'Up or down: ' + y + (dy > 0 ? ' + ' : ' &minus; ') + Math.abs(dy) + ' = ' + ny + '.' : 'No up or down move.'],
          explain: 'It lands at (' + nx + ', ' + ny + ').', meta: { k: 'sh4-trans-tap', pts: pts, x: x, y: y, dx: dx, dy: dy } };
      }],
      [1, 'fill', function () {
        var x = R.int(1, 5), y = R.int(1, 5), dx = R.int(-x, 4), dy = R.int(-y, 4);
        if (!dx && !dy) dx = 2;
        return { q: 'A point at (' + x + ', ' + y + ') slides <b>' + dirWords(dx, dy) + '</b>. Where does it land?', type: 'fill', fill: '( [[]] , [[]] )', answers: [x + dx, y + dy], fig: grid(10, [{ x: x, y: y, l: 'A' }]),
          hint: 'Right adds to the first number, left takes away. Up adds to the second number, down takes away.', steps: ['First number: ' + x + ' to ' + (x + dx) + '.', 'Second number: ' + y + ' to ' + (y + dy) + '.'],
          explain: 'It lands at (' + (x + dx) + ', ' + (y + dy) + ').', meta: { k: 'sh4-trans-fill', x: x, y: y, dx: dx, dy: dy } };
      }],
      [2, 'mistake', function () {
        var x = R.int(1, 5), y = R.int(1, 5), dx = R.int(1, 4), p = who(), truth = !R.int(0, 2), said = truth ? [x + dx, y] : [x, y + dx];
        var right = 'Sliding right changes the first number: (' + x + ' + ' + dx + ', ' + y + ') = (' + (x + dx) + ', ' + y + ').';
        return { q: 'A point at (' + x + ', ' + y + ') slides ' + dirWords(dx, 0) + '. ' + p + ' says it lands at <b>(' + said[0] + ', ' + said[1] + ')</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Sliding right changes the second number.', 'Both numbers go up when you slide right.', 'A slide does not change the numbers.']),
          hint: 'Which number tells how far across?', steps: [right], explain: right, meta: { k: 'sh4-trans-tf', x: x, y: y, dx: dx, said: said } };
      }]
    ],
    'sh4-refl': [
      [1, 'tap', function () {
        var m = R.int(3, 7), x = R.int(Math.max(0, m - 3), m - 1), y = R.int(1, 9), nx = 2 * m - x;
        var all = three(nx, y, [[nx - 1, y], [nx, y === 9 ? y - 1 : y + 1], [m, y]]);
        return { q: 'Point P at (' + x + ', ' + y + ') is reflected in the dashed mirror line. Tap its image.', type: 'tap', pic: gridTap(all, { v: m }), answer: all.filter(function (p) { return p.x === nx && p.y === y; })[0].key, answerText: 'the point at (' + nx + ', ' + y + ')',
          hint: 'P is ' + (m - x) + ' from the line. Its image is the same distance on the other side.', steps: ['P is ' + (m - x) + ' to the left of the line at ' + m + '.', 'Go ' + (m - x) + ' to the right of the line: ' + nx + '. The height stays ' + y + '.'],
          explain: 'The image is at (' + nx + ', ' + y + ').', meta: { k: 'sh4-refl-tap', pts: all, m: m, x: x, y: y } };
      }],
      [1, 'fill', function () {
        var m = R.int(3, 7), x = R.int(Math.max(0, m - 3), m - 1), y = R.int(1, 9);
        return { q: 'Point P is reflected in the dashed mirror line. Write the ordered pair of its image.', type: 'fill', fill: 'Image: ( [[]] , [[]] )', answers: [2 * m - x, y], fig: grid(10, [{ x: x, y: y, l: 'P' }], null, null, { v: m }),
          hint: 'Count from P to the line. Count the same on the other side. The height stays the same.', steps: ['P is ' + (m - x) + ' from the line at ' + m + '.', m + ' + ' + (m - x) + ' = ' + (2 * m - x) + '.'],
          explain: 'The image is at (' + (2 * m - x) + ', ' + y + ').', meta: { k: 'sh4-refl-fill', m: m, x: x, y: y } };
      }],
      [2, 'mistake', function () {
        var m = R.int(3, 7), x = R.int(Math.max(0, m - 3), m - 1), y = R.int(1, 9), p = who(), truth = !R.int(0, 1), said = truth ? 2 * m - x : m + 1 + (m - x);
        var right = 'The image is as far past the line as P is before it: ' + m + ' + ' + (m - x) + ' = ' + (2 * m - x) + '.';
        return { q: 'P at (' + x + ', ' + y + ') is reflected in the mirror line at ' + m + '. ' + p + ' says the image is at <b>(' + said + ', ' + y + ')</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: grid(10, [{ x: x, y: y, l: 'P' }], null, null, { v: m }),
          why: why(right, ['The image is always 1 square past the line.', 'A reflection changes the height too.', 'The image is on the same side as P.']),
          hint: 'Count squares from P to the line, then the same past it.', steps: [right], explain: right, meta: { k: 'sh4-refl-tf', m: m, x: x, said: said } };
      }]
    ]
  };
  K.shapes('shapes', SHAPES);
})();
