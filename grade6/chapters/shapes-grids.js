(function () {
  var A = Atlas, R = A.R;
  function sg(x) { return x < 0 ? '−' + -x : String(x); }
  function pt(p) { return '(' + sg(p[0]) + ', ' + sg(p[1]) + ')'; }
  /* quadrilateral data: points in a 200x160 box, properties */
  var Q = {
    square: { p: [[40, 20], [180, 20], [180, 160], [40, 160]], lines: 4, rot: 4, sides: 'all 4 equal', ang: 'all 90&deg;', par: '2 pairs', diag: 'equal, cut each other in half, meet at 90&deg;', sym: [[[110, 0], [110, 180]], [[20, 90], [200, 90]], [[30, 10], [190, 170]], [[190, 10], [30, 170]]] },
    rectangle: { p: [[20, 40], [200, 40], [200, 140], [20, 140]], lines: 2, rot: 2, sides: 'opposite sides equal', ang: 'all 90&deg;', par: '2 pairs', diag: 'equal, cut each other in half', sym: [[[110, 20], [110, 160]], [[0, 90], [220, 90]]] },
    rhombus: { p: [[110, 10], [190, 90], [110, 170], [30, 90]], lines: 2, rot: 2, sides: 'all 4 equal', ang: 'opposite angles equal', par: '2 pairs', diag: 'cut each other in half, meet at 90&deg;', sym: [[[110, 0], [110, 180]], [[10, 90], [210, 90]]] },
    parallelogram: { p: [[60, 40], [210, 40], [160, 140], [10, 140]], lines: 0, rot: 2, sides: 'opposite sides equal', ang: 'opposite angles equal', par: '2 pairs', diag: 'cut each other in half', sym: [] },
    trapezoid: { p: [[70, 40], [150, 40], [200, 140], [20, 140]], lines: 1, rot: 1, sides: 'can vary (this one has 2 equal sides)', ang: 'can vary', par: 'at least 1 pair', diag: 'equal in this isosceles one', sym: [[[110, 20], [110, 160]]] },
    kite: { p: [[110, 10], [170, 70], [110, 170], [50, 70]], lines: 1, rot: 1, sides: '2 pairs of equal sides next to each other', ang: '1 pair of opposite angles equal', par: 'none', diag: 'meet at 90&deg;, one cuts the other in half', sym: [[[110, 0], [110, 180]]] }
  };
  function quad(name, o) {
    o = o || {}; var q = Q[name], s = '', P = q.p;
    s += '<g transform="rotate(' + (o.rot || 0) + ' 110 90)"><polygon points="' + P.map(function (p) { return p.join(','); }).join(' ') + '" style="fill:color-mix(in srgb,var(--strand) 22%,var(--card));stroke:var(--strand)" stroke-width="3"/>';
    if (o.diag) s += '<line x1="' + P[0][0] + '" y1="' + P[0][1] + '" x2="' + P[2][0] + '" y2="' + P[2][1] + '" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="6 4"/><line x1="' + P[1][0] + '" y1="' + P[1][1] + '" x2="' + P[3][0] + '" y2="' + P[3][1] + '" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="6 4"/>';
    if (o.sym) q.sym.forEach(function (l) { s += '<line x1="' + l[0][0] + '" y1="' + l[0][1] + '" x2="' + l[1][0] + '" y2="' + l[1][1] + '" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="2 5" stroke-linecap="round"/>'; });
    s += '<circle cx="' + P[0][0] + '" cy="' + P[0][1] + '" r="5" style="fill:var(--hi);stroke:var(--ink)"/></g>';
    if (o.ghost) s = '<polygon points="' + P.map(function (p) { return p.join(','); }).join(' ') + '" style="fill:none;stroke:var(--line)" stroke-width="3" stroke-dasharray="5 4"/>' + s;
    if (o.rot !== undefined) return A.svg(240, 240, '<g transform="translate(10,30)">' + s + '</g>', 'A ' + name + (o.diag ? ' with its diagonals' : '') + (o.sym ? ' with ' + q.lines + ' lines of symmetry' : '') + (o.rot ? ', turned ' + o.rot + ' degrees' : ''));
    return A.svg(220, 180, s, 'A ' + name + (o.diag ? ' with its diagonals' : '') + (o.sym ? ' with ' + q.lines + ' lines of symmetry' : '') + (o.rot ? ', turned ' + o.rot + ' degrees' : ''));
  }
  /* coordinate grid from -n to n; pts [{p,[x,y], lab, c}], polys [{pts, c, dash}], arrows [[from,to]] */
  function grid(n, pts, polys, arrows, size) {
    size = size || 22; var W = 2 * n * size + 60, o = W / 2, s = '';
    function X(x) { return o + x * size; } function Y(y) { return o - y * size; }
    for (var i = -n; i <= n; i++) {
      s += '<line x1="' + X(i) + '" y1="' + Y(-n) + '" x2="' + X(i) + '" y2="' + Y(n) + '" style="stroke:var(--line)"/><line x1="' + X(-n) + '" y1="' + Y(i) + '" x2="' + X(n) + '" y2="' + Y(i) + '" style="stroke:var(--line)"/>';
      if (i && (n <= 6 || i % 2 === 0)) s += '<text x="' + X(i) + '" y="' + (Y(0) + 18) + '" text-anchor="middle" font-size="14" class="t2">' + sg(i) + '</text><text x="' + (X(0) - 6) + '" y="' + (Y(i) + 5) + '" text-anchor="end" font-size="14" class="t2">' + sg(i) + '</text>';
    }
    s += '<line x1="' + X(-n - 0.6) + '" y1="' + Y(0) + '" x2="' + X(n + 0.6) + '" y2="' + Y(0) + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + X(0) + '" y1="' + Y(-n - 0.6) + '" x2="' + X(0) + '" y2="' + Y(n + 0.6) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + X(n + 0.6) + '" y="' + (Y(0) - 6) + '" font-size="16" class="tb" text-anchor="end">x</text><text x="' + (X(0) + 8) + '" y="' + Y(n + 0.3) + '" font-size="16" class="tb">y</text>';
    [['I', 1, 1], ['II', -1, 1], ['III', -1, -1], ['IV', 1, -1]].forEach(function (q) { s += '<text x="' + X(q[1] * (n - 1)) + '" y="' + Y(q[2] * (n - 1)) + '" text-anchor="middle" font-size="16" style="fill:var(--ink2);opacity:.6" font-weight="700">' + q[0] + '</text>'; });
    (polys || []).forEach(function (pg) { s += '<polygon points="' + pg.pts.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" style="fill:color-mix(in srgb,' + (pg.c || 'var(--strand)') + ' 30%,transparent);stroke:' + (pg.c || 'var(--strand)') + '" stroke-width="2.5"' + (pg.dash ? ' stroke-dasharray="6 4"' : '') + '/>' + (pg.lab ? '<text x="' + X(pg.pts[0][0]) + '" y="' + (Y(pg.pts[0][1]) - 8) + '" font-size="16" font-weight="700" text-anchor="middle" style="fill:' + (pg.c || 'var(--strand)') + '">' + pg.lab + '</text>' : ''); });
    (arrows || []).forEach(function (a) { s += '<path d="M' + X(a[0][0]) + ' ' + Y(a[0][1]) + ' H' + X(a[1][0]) + ' V' + Y(a[1][1]) + '" fill="none" style="stroke:var(--accent)" stroke-width="3" stroke-dasharray="7 4" marker-end="url(#gar)"/>'; });
    if (arrows && arrows.length) s = '<defs><marker id="gar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>' + s;
    (pts || []).forEach(function (p) { s += '<circle cx="' + X(p.p[0]) + '" cy="' + Y(p.p[1]) + '" r="7" style="fill:' + (p.c || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>' + (p.lab ? '<text x="' + (X(p.p[0]) + 10) + '" y="' + (Y(p.p[1]) - 10) + '" font-size="18" font-weight="700">' + p.lab + '</text>' : ''); });
    return A.svg(W, W, s, 'Coordinate grid from ' + -n + ' to ' + n + (pts && pts.length ? ' with points ' + pts.map(function (p) { return (p.lab || '') + ' ' + pt(p.p); }).join(', ') : ''));
  }
  /* isometric drawing of stacked cubes from a height map h[row][col] (row 0 = back) */
  function iso(h) {
    var u = 26, s = '', rows = h.length, cols = h[0].length;
    var ox = 30 + rows * u * 0.87, oy = 30 + 4 * u;
    function P(x, y, z) { return [ox + (x - y) * u * 0.87, oy + (x + y) * u * 0.5 - z * u]; }
    function face(pts, fill) { return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" style="fill:' + fill + ';stroke:var(--ink)" stroke-width="1.2"/>'; }
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) for (var z = 0; z < h[r][c]; z++) {
      var x = c, y = r;
      s += face([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], 'color-mix(in srgb,var(--strand) 35%,var(--card))');
      s += face([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], 'color-mix(in srgb,var(--strand) 70%,var(--card))');
      s += face([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], 'var(--strand)');
    }
    var W = ox + cols * u * 0.87 + 30, H = oy + (rows + cols) * u * 0.5 + 20;
    return A.svg(Math.ceil(W), Math.ceil(H), s, 'Cube structure drawn in 3D');
  }
  /* a 2D view: columns of squares. heights left to right */
  function view(hs, title) {
    var u = 24, mx = Math.max.apply(null, hs.concat([1])), s = '', W = hs.length * u + 8, H = mx * u + 34;
    hs.forEach(function (h, i) { for (var z = 0; z < h; z++) s += '<rect x="' + (4 + i * u) + '" y="' + (H - 6 - (z + 1) * u) + '" width="' + u + '" height="' + u + '" style="fill:color-mix(in srgb,var(--strand) 45%,var(--card));stroke:var(--ink)" stroke-width="1.2"/>'; });
    s += '<text x="' + W / 2 + '" y="16" text-anchor="middle" font-size="15" class="tb">' + title + '</text>';
    return A.svg(Math.max(W, 70), H, s, title + ' view: column heights ' + hs.join(', '));
  }
  function topView(h) {
    var u = 24, s = '', rows = h.length, cols = h[0].length;
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) if (h[r][c]) s += '<rect x="' + (4 + c * u) + '" y="' + (24 + r * u) + '" width="' + u + '" height="' + u + '" style="fill:color-mix(in srgb,var(--strand) 35%,var(--card));stroke:var(--ink)" stroke-width="1.2"/><text x="' + (4 + c * u + u / 2) + '" y="' + (24 + r * u + 17) + '" text-anchor="middle" font-size="14" class="t2">' + h[r][c] + '</text>';
    s += '<text x="' + (cols * u / 2 + 4) + '" y="16" text-anchor="middle" font-size="15" class="tb">top</text>';
    return A.svg(Math.max(cols * u + 8, 70), rows * u + 28, s, 'Top view');
  }
  function fronts(h) { var o = []; for (var c = 0; c < h[0].length; c++) { var m = 0; for (var r = 0; r < h.length; r++) m = Math.max(m, h[r][c]); o.push(m); } return o; }
  function sides(h) { return h.map(function (row) { return Math.max.apply(null, row); }).reverse(); }
  /* transformations of points about the origin */
  var T = {
    'reflect in the x-axis': function (p) { return [p[0], -p[1]]; },
    'reflect in the y-axis': function (p) { return [-p[0], p[1]]; },
    'rotate 90° clockwise about (0, 0)': function (p) { return [p[1], -p[0]]; },
    'rotate 180° about (0, 0)': function (p) { return [-p[0], -p[1]]; },
    'rotate 90° counterclockwise about (0, 0)': function (p) { return [-p[1], p[0]]; }
  };
  function moveTxt(dx, dy) {
    var a = [];
    if (dx) a.push((dx > 0 ? 'right ' : 'left ') + Math.abs(dx));
    if (dy) a.push((dy > 0 ? 'up ' : 'down ') + Math.abs(dy));
    return a.join(', ') || 'no move';
  }

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var CH = 'shapes-grids', g = G6.g, lab = G6.lab, play = G6.play;
  var TRI = [[1, 1], [4, 1], [1, 3]], HM = [[1, 0, 0], [2, 1, 0], [3, 2, 1]];
  function mv(j, p) { return j === 0 ? [p[0], -p[1]] : j === 1 ? [-p[0], p[1]] : j === 2 ? [p[1], -p[0]] : j === 3 ? [-p[0], -p[1]] : j === 4 ? [-p[1], p[0]] : [p[0] + 3, p[1] - 2]; }
  function img(j) { return TRI.map(function (p) { return mv(j, p); }); }
  var LESSONS = [
    { id: 'quads', title: 'Quadrilaterals', sub: 'sides, angles and diagonals', concepts: [
      { id: 'props', title: 'Properties of quadrilaterals', exp: ['E1.1'], skill: 'sg-quad',
        body: '<p>A <b>quadrilateral</b> has 4 sides. Each kind has <b>properties</b>: facts about its sides, angles and <b>diagonals</b> (lines joining opposite corners).</p>',
        watch: play([
          ['Square: 4 equal sides, 4 right angles. Diagonals equal, meeting at 90°.', quad('square', { diag: true })],
          ['Rectangle: 4 right angles. Diagonals equal.', quad('rectangle', { diag: true })],
          ['Rhombus: 4 equal sides. Diagonals meet at 90°.', quad('rhombus', { diag: true })],
          ['Parallelogram: 2 pairs of parallel sides. Diagonals cut each other in half.', quad('parallelogram', { diag: true })],
          ['Trapezoid: at least 1 pair of parallel sides.', quad('trapezoid', { diag: true })],
          ['Kite: 2 pairs of equal sides next to each other. Diagonals meet at 90°.', quad('kite', { diag: true })]
        ]),
        try: lab(CH, 0, 'Find the shape whose diagonals meet at 90° but which has only <b>one</b> line of symmetry. Turn on "show lines of symmetry" to check.', function (h) { return h.querySelector('#qk').value === 'kite' && h.querySelector('#qs').checked; }, 'Yes: the kite.'),
        key: '<p>Describe a quadrilateral by its sides, angles, parallel sides, diagonals and symmetry.</p>',
        check: [{ q: 'Which quadrilateral has diagonals that meet at 90° but only one line of symmetry?', type: 'mc', options: ['rhombus', 'kite', 'rectangle', 'parallelogram'], answer: 1, hint: 'The rhombus has 2 lines.', explain: 'The kite.' }, g(CH, 'sg-quad', 1), g(CH, 'sg-quad', 2)] },
      { id: 'families', title: 'Shape families', exp: ['E1.1'], skill: 'sg-quad', hard: true,
        body: '<p>A shape can belong to more than one family. A square is a rectangle (4 right angles) <b>and</b> a rhombus (4 equal sides). Every rectangle and every rhombus is a parallelogram.</p>',
        watch: play([
          ['A parallelogram: 2 pairs of parallel sides.', quad('parallelogram')],
          ['Make all the angles 90°: a rectangle. Still a parallelogram.', quad('rectangle')],
          ['Make all the sides equal instead: a rhombus. Still a parallelogram.', quad('rhombus')],
          ['Do both: a square. It belongs to all three families.', quad('square')]
        ]),
        ways: [{ label: 'Example or not?', html: '<div class="tbl"><table><thead><tr><th class="l">Shape</th><th class="l">Is it a rhombus?</th><th class="l">Why</th></tr></thead><tbody><tr><td class="l">square</td><td class="l">yes</td><td class="l">4 equal sides</td></tr><tr><td class="l">kite</td><td class="l">no</td><td class="l">only pairs of sides are equal</td></tr><tr><td class="l">2 cm by 5 cm rectangle</td><td class="l">no</td><td class="l">sides not all equal</td></tr></tbody></table></div>' },
          { label: 'Ask "always?"', html: '<p>"Is every square a rectangle?" Check the rectangle rule: 4 right angles. Every square has them, so yes. "Is every rectangle a square?" A square needs 4 equal sides. A 2 by 5 rectangle does not, so no.</p>' }],
        key: '<p>Check the family rule. If the shape meets it, it belongs.</p>',
        mistake: '<p>Saying a square is "not a rectangle" because it looks different. Families are decided by properties, not looks.</p>',
        check: [{ q: 'Is every square a rhombus?', type: 'mc', options: ['Yes', 'No'], answer: 0, hint: 'A rhombus needs 4 equal sides.', explain: 'Every square has 4 equal sides, so yes.' }, { q: 'Is every rectangle a square?', type: 'mc', options: ['Yes', 'No'], answer: 1, hint: 'Do all rectangles have 4 equal sides?', explain: 'No: a 2 by 5 rectangle is not a square.' }, g(CH, 'sg-quad', 3)] }
    ] },
    { id: 'symmetry', title: 'Symmetry', sub: 'folds and turns', concepts: [
      { id: 'lines', title: 'Lines of symmetry', exp: ['E1.1'], skill: 'sg-sym',
        body: '<p>A <b>line of symmetry</b> folds a shape exactly onto itself.</p>',
        watch: play([
          ['A square folds 4 ways.', quad('square', { sym: true }), '4 lines'],
          ['A rectangle folds 2 ways. A diagonal fold does not match.', quad('rectangle', { sym: true }), '2 lines'],
          ['A kite folds 1 way.', quad('kite', { sym: true }), '1 line'],
          ['A parallelogram has no fold that works.', quad('parallelogram'), '0 lines']
        ]),
        key: '<p>Picture the fold. Do both halves land exactly on each other?</p>',
        check: [{ q: 'How many lines of symmetry does a rectangle (not a square) have?', type: 'num', answer: 2, hint: 'Across and down. Does a diagonal work?', explain: 'Two.' }, g(CH, 'sg-sym', 1)] },
      { id: 'turns', title: 'Rotational symmetry', exp: ['E1.1'], skill: 'sg-sym', hard: true,
        body: '<p>A shape has <b>rotational symmetry</b> if it matches itself before a full turn. The <b>order</b> is how many times it matches in one full turn (360°).</p>',
        watch: play([
          ['A parallelogram. The orange dot marks one corner.', quad('parallelogram', { rot: 0, ghost: true })],
          ['Turn 90°: it does not match the outline.', quad('parallelogram', { rot: 90, ghost: true }), 'No match'],
          ['Turn 180°: it matches.', quad('parallelogram', { rot: 180, ghost: true }), 'Match 1'],
          ['Turn 360°: back to the start. 2 matches: order 2.', quad('parallelogram', { rot: 360, ghost: true }), 'Order 2']
        ]),
        try: lab(CH, 1, 'Choose the <b>rectangle</b> and turn it to its first match after 0°.', function (h) { return h.querySelector('#rk').value === 'rectangle' && +h.querySelector('#ra').value === 180; }, 'Yes: 180°. It matches at 180° and 360°, so order 2.'),
        ways: [{ label: 'Divide 360', html: '<p>A square first matches at 90°. 360 &divide; 90 = 4, so order 4. A rectangle first matches at 180°. 360 &divide; 180 = 2.</p>' }],
        key: '<p>Count the matches in one full turn. Order 1 means no rotational symmetry.</p>',
        check: [{ q: 'What is the order of rotational symmetry of a square?', type: 'num', answer: 4, hint: 'Try 90° turns.', explain: '90°, 180°, 270°, 360°: order 4.' }, g(CH, 'sg-sym', 2)] }
    ] },
    { id: 'views', title: 'Views of 3D objects', sub: 'top, front and side', concepts: [
      { id: 'build', title: 'Building from views', exp: ['E1.2'], skill: 'sg-views', hard: true,
        body: '<p>A 3D object can be drawn as flat <b>views</b>: from the top, the front and the side. A top view with numbers tells you how tall each stack is.</p>',
        watch: play([
          ['A building made of cubes.', iso(HM)],
          ['From the top, with each stack height written in.', '<div class="vrow"><figure>' + iso(HM) + '</figure><figure>' + topView(HM) + '</figure></div>'],
          ['From the front: the tallest stack in each column.', '<div class="vrow"><figure>' + iso(HM) + '</figure><figure>' + view(fronts(HM), 'front') + '</figure></div>'],
          ['From the right side.', '<div class="vrow"><figure>' + iso(HM) + '</figure><figure>' + view(sides(HM), 'right side') + '</figure></div>', '1 + 2 + 1 + 3 + 2 + 1 = 10 cubes']
        ]),
        try: lab(CH, 2, 'Build an object with exactly <b>6</b> cubes and a front view that is <b>3</b> tall.', function (h) { var t = 0, mx = 0; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) { var v = Math.max(0, Math.min(4, parseInt(h.querySelector('#iso' + r + c).value, 10) || 0)); t += v; mx = Math.max(mx, v); } return t === 6 && mx === 3; }, 'Yes: 6 cubes with a stack of 3.'),
        ways: [{ label: 'Count from the top view', html: '<p>Add the numbers on the top view: that is the number of cubes. The front and side views can hide cubes behind taller stacks.</p>' }],
        key: '<p>Top view for where. Numbers for how tall. Front and side to check.</p>',
        mistake: '<p>Thinking the front and side views show every cube. Cubes can hide behind taller stacks; only the numbered top view gives the exact count.</p>',
        check: [{ q: 'A top view has the numbers 2, 1, 3 and 1 on its squares. How many cubes are there?', type: 'num', answer: 7, hint: 'Add the numbers.', explain: '2 + 1 + 3 + 1 = 7.' }, g(CH, 'sg-views', 1), g(CH, 'sg-views', 2)] }
    ] },
    { id: 'grid', title: 'The four-quadrant grid', sub: 'points and slides', concepts: [
      { id: 'plot', title: 'Plotting points', exp: ['E1.3'], skill: 'sg-coord',
        body: '<p>The x-axis and y-axis cross at the <b>origin</b> (0, 0) and make 4 <b>quadrants</b>, I to IV, counterclockwise from top right. A point (x, y): go <b>across</b> x first, then <b>up or down</b> y.</p>',
        watch: play([
          ['Start at the origin, (0, 0).', grid(5, [{ p: [0, 0], lab: 'O' }], [], [], 26)],
          ['To plot (−3, 2), go across first: 3 to the left.', grid(5, [{ p: [-3, 0] }], [], [[[0, 0], [-3, 0]]], 26), 'x = −3'],
          ['Then up 2.', grid(5, [{ p: [-3, 2], lab: 'P' }], [], [[[0, 0], [-3, 2]]], 26), '(−3, 2): quadrant II'],
          ['(4, −1): right 4, down 1. Quadrant IV.', grid(5, [{ p: [-3, 2], lab: 'P' }, { p: [4, -1], lab: 'Q', c: 'var(--strand)' }], [], [], 26), '(4, −1)']
        ]),
        key: '<p>Across, then up or down. Negative x is left, negative y is down.</p>',
        mistake: '<p>Swapping the order: plotting (2, −5) at (−5, 2). x always comes first.</p>',
        check: [{ q: 'Which quadrant is (−4, −6) in?', type: 'mc', options: ['I', 'II', 'III', 'IV'], answer: 2, hint: 'Left and down.', explain: 'Quadrant III.' }, g(CH, 'sg-coord', 1), g(CH, 'sg-coord', 2)] },
      { id: 'translate', title: 'Translations', exp: ['E1.3'], skill: 'sg-translate',
        body: '<p>A <b>translation</b> slides a point. To find it, subtract: new x &minus; old x tells left or right; new y &minus; old y tells up or down.</p>',
        watch: play([
          ['A is (−3, 4). B is (2, −1).', grid(5, [{ p: [-3, 4], lab: 'A' }, { p: [2, -1], lab: 'B', c: 'var(--strand)' }], [], [], 26)],
          ['Across: 2 − (−3) = 5. Right 5. Down: −1 − 4 = −5. Down 5.', grid(5, [{ p: [-3, 4], lab: 'A' }, { p: [2, -1], lab: 'B', c: 'var(--strand)' }], [], [[[-3, 4], [2, -1]]], 26), 'Right 5, down 5']
        ]),
        try: lab(CH, 3, 'Set A and B so that A to B is <b>right 5, down 3</b>.', function (h) { function v(id) { return Math.max(-8, Math.min(8, parseInt(h.querySelector(id).value, 10) || 0)); } return v('#cbx') - v('#cax') === 5 && v('#cby') - v('#cay') === -3; }, 'Yes: right 5, down 3.'),
        key: '<p>New minus old, for x and for y.</p>',
        check: [{ q: 'Which translation moves (−3, 4) to (2, −1)?', type: 'mc', options: ['right 5, down 5', 'left 5, down 5', 'right 1, down 3', 'right 5, up 5'], answer: 0, hint: 'x: −3 to 2. y: 4 to −1.', explain: 'Right 5, down 5.' }, g(CH, 'sg-translate', 1), g(CH, 'sg-translate', 2)] }
    ] },
    { id: 'transform', title: 'Transformations', sub: 'flips, turns and slides', concepts: [
      { id: 'reflect', title: 'Reflections', exp: ['E1.4'], skill: 'sg-transform',
        body: '<p>A <b>reflection</b> flips a shape over a line, like a mirror. Reflect in the x-axis: (x, −y). Reflect in the y-axis: (−x, y).</p>',
        watch: play([
          ['A triangle in quadrant I.', grid(6, [], [{ pts: TRI }], [], 22)],
          ['Reflect in the x-axis: each y changes sign. (4, 1) goes to (4, −1).', grid(6, [], [{ pts: TRI }, { pts: img(0), c: 'var(--bad)' }], [], 22), '(x, −y)'],
          ['Reflect in the y-axis instead: each x changes sign.', grid(6, [], [{ pts: TRI }, { pts: img(1), c: 'var(--bad)' }], [], 22), '(−x, y)']
        ]),
        key: '<p>Same size, same shape, flipped. Every corner is the same distance from the mirror line.</p>',
        check: [{ q: 'Point (2, 5) is reflected in the y-axis. Where does it land?', type: 'mc', options: ['(2, −5)', '(−2, 5)', '(−2, −5)', '(5, 2)'], answer: 1, hint: 'Only x changes sign.', explain: '(−2, 5).' }, g(CH, 'sg-transform', 1)] },
      { id: 'rotate', title: 'Rotations and combined moves', exp: ['E1.4'], skill: 'sg-transform', hard: true,
        body: '<p>A <b>rotation</b> turns a shape about a point. About (0, 0): 180° gives (−x, −y). 90° clockwise gives (y, −x). You can do one move after another.</p>',
        watch: play([
          ['Start: the triangle (1, 1), (4, 1), (1, 3).', grid(6, [], [{ pts: TRI }], [], 22)],
          ['Rotate 180° about the origin: (−x, −y).', grid(6, [], [{ pts: TRI }, { pts: img(3), c: 'var(--bad)' }], [], 22), 'Quadrant III'],
          ['Rotate 90° clockwise instead: (y, −x). (4, 1) goes to (1, −4).', grid(6, [], [{ pts: TRI }, { pts: img(2), c: 'var(--bad)' }], [], 22), 'Quadrant IV']
        ]),
        try: lab(CH, 4, 'Choose two moves that put the triangle in <b>quadrant III</b> (all corners left of and below the origin).', function (h) { var a = +h.querySelector('#tm1').value, b = +h.querySelector('#tm2').value; return TRI.every(function (p) { var q = mv(b, mv(a, p)); return q[0] < 0 && q[1] < 0; }); }, 'Yes: the image is in quadrant III.'),
        ways: [{ label: 'Follow one corner', html: '<p>Track only (4, 1). Rotate 90° clockwise: (1, −4). Then reflect in the y-axis: (−1, −4). Do the same to the other corners.</p>' },
          { label: 'Turn the page', html: '<p>Trace the shape and the axes on paper. Pin the origin with a pencil tip and turn the paper a quarter turn clockwise.</p>' }],
        key: '<p>Predict one corner with the rule, then the rest.</p>',
        check: [{ q: 'Point (4, 1) is rotated 180° about the origin. Where does it land?', type: 'mc', options: ['(−4, 1)', '(4, −1)', '(−4, −1)', '(1, 4)'], answer: 2, hint: 'Both signs change.', explain: '(−4, −1).' }, g(CH, 'sg-transform', 2), g(CH, 'sg-transform', 3)] }
    ] }
  ];
  A.register('shapes-grids', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Properties of quadrilaterals</h2>' +
'<p>A <b>quadrilateral</b> has 4 sides. Each kind has its own <b>properties</b>: facts about its sides, angles, diagonals and symmetry. A <b>diagonal</b> joins opposite corners.</p>' +
'<div class="lab"><span class="lt">Try it: explore a quadrilateral</span>' +
'<div class="ctrl"><label for="qk">Shape<select id="qk"><option>square</option><option>rectangle</option><option selected>rhombus</option><option>parallelogram</option><option>trapezoid</option><option>kite</option></select></label>' +
'<label><span><input type="checkbox" id="qd" checked> show diagonals</span></label><label><span><input type="checkbox" id="qs"> show lines of symmetry</span></label></div>' +
'<div class="row2"><div class="fig" id="qfig"></div><div class="tbl" id="qtbl"></div></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>A shape can belong to more than one family. A square is also a rectangle (4 right angles) <b>and</b> a rhombus (4 equal sides). Every rectangle and rhombus is a parallelogram.</p></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Example or non-example?</th><th class="l">Rhombus</th><th class="l">Why</th></tr></thead><tbody>' +
'<tr><td class="l">square</td><td class="l">yes</td><td class="l">4 equal sides</td></tr><tr><td class="l">kite</td><td class="l">no</td><td class="l">only pairs of sides are equal, not all 4</td></tr><tr><td class="l">rectangle 2 cm by 5 cm</td><td class="l">no</td><td class="l">sides are not all equal</td></tr></tbody></table></div>' +
A.yt({ q: 'Which quadrilateral has diagonals that meet at 90&deg; but only <b>one</b> line of symmetry?', type: 'mc', options: ['rhombus', 'kite', 'rectangle', 'parallelogram'], answer: 1,
  hint: 'Use the explorer: turn on diagonals and symmetry for each shape.', explain: 'A kite’s diagonals meet at 90&deg;, and it has 1 line of symmetry, down the middle.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Line and rotational symmetry</h2>' +
'<p>A <b>line of symmetry</b> folds a shape onto itself. A shape has <b>rotational symmetry</b> if it matches itself before a full turn. The <b>order</b> is how many times it matches in one full turn (360&deg;).</p>' +
'<div class="lab"><span class="lt">Try it: turn the shape</span>' +
'<div class="ctrl"><label for="rk">Shape<select id="rk"><option>square</option><option>rectangle</option><option>rhombus</option><option selected>parallelogram</option><option>kite</option></select></label><label for="ra">Turn: <output id="rao"></output><input type="range" id="ra" min="0" max="360" step="15" value="90"></label></div>' +
'<div class="row2"><div class="fig" id="rfig"></div><div class="out" id="rout"></div></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A rectangle matches itself after a 180&deg; turn and after 360&deg;. That is 2 matches in a full turn: rotational symmetry of <b>order 2</b>. Every shape matches after 360&deg;, so order 1 means no rotational symmetry.</p></div>' +
A.yt({ q: 'What is the order of rotational symmetry of a square?', type: 'num', answer: 4,
  hint: 'Say the rule: count how many times it matches itself in one full turn. Try 90&deg; turns.', explain: 'A square matches at 90&deg;, 180&deg;, 270&deg; and 360&deg;: order 4.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Building from views</h2>' +
'<p>Architects draw 3D objects as flat <b>views</b>: from the <b>top</b>, the <b>front</b> and the <b>side</b>. You can build the object from its views. The front view shows the tallest stack in each column.</p>' +
'<div class="lab"><span class="lt">Try it: build with cubes</span><p class="t2" style="margin:.2em 0">Type how many cubes are stacked on each square of a 3 by 3 base (0 to 4). The top row is at the back.</p>' +
'<div id="isoin" style="display:grid;grid-template-columns:repeat(3,4.2em);gap:6px;margin:6px 0"></div>' +
'<div class="row2"><div class="fig" id="isofig"></div><div class="vrow" id="isoviews"></div></div><div class="out" id="isoout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking the views show every cube. Cubes can hide behind taller stacks. The top view with numbers tells you exactly how many are in each stack.</p></div>' +
A.yt({ q: 'A top view has the numbers 2, 1, 3 and 1 written on its squares. How many cubes are in the object?', type: 'num', answer: 7,
  hint: 'Say the rule: each number is the height of one stack. Add them.', explain: '2 + 1 + 3 + 1 = 7 cubes.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>The four-quadrant grid</h2>' +
'<p>The <b>Cartesian plane</b> has a horizontal <b>x-axis</b> and a vertical <b>y-axis</b> that cross at the <b>origin</b>, (0, 0). They split the plane into four <b>quadrants</b>, numbered I to IV counterclockwise from the top right.</p>' +
'<p>A point is written (x, y): first go <b>across</b> x, then <b>up or down</b> y. Negative x goes left. Negative y goes down.</p>' +
'<div class="lab"><span class="lt">Try it: move from one point to another</span>' +
'<div class="ctrl"><label for="cax">A: x<input type="number" id="cax" min="-8" max="8" value="-3"></label><label for="cay">A: y<input type="number" id="cay" min="-8" max="8" value="2"></label><label for="cbx">B: x<input type="number" id="cbx" min="-8" max="8" value="4"></label><label for="cby">B: y<input type="number" id="cby" min="-8" max="8" value="-3"></label></div>' +
'<div class="fig" id="cfig"></div><div class="out" id="cout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up the order. (2, &minus;5) and (&minus;5, 2) are different points. x always comes first: "across the hall, then up the stairs".</p></div>' +
A.yt({ q: 'Which quadrant is the point (&minus;4, &minus;6) in?', type: 'mc', options: ['I', 'II', 'III', 'IV'], answer: 2,
  hint: 'Say the rule: negative x is left, negative y is down. Left and down is the bottom left.', explain: 'Left and down: quadrant III.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Translations, reflections and rotations</h2>' +
'<p>A <b>translation</b> slides a shape. A <b>reflection</b> flips it over a line. A <b>rotation</b> turns it about a point. The shape stays the same size and shape; only its position changes. The new shape is called the <b>image</b>.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Move</th><th class="l">Rule for (x, y)</th><th class="l">(3, 1) becomes</th></tr></thead><tbody>' +
'<tr><td class="l">reflect in the x-axis</td><td class="l">(x, &minus;y)</td><td class="l">(3, &minus;1)</td></tr><tr><td class="l">reflect in the y-axis</td><td class="l">(&minus;x, y)</td><td class="l">(&minus;3, 1)</td></tr>' +
'<tr><td class="l">rotate 180&deg; about (0, 0)</td><td class="l">(&minus;x, &minus;y)</td><td class="l">(&minus;3, &minus;1)</td></tr><tr><td class="l">rotate 90&deg; clockwise about (0, 0)</td><td class="l">(y, &minus;x)</td><td class="l">(1, &minus;3)</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: combine two moves</span>' +
'<div class="ctrl"><label for="tm1">First move<select id="tm1"></select></label><label for="tm2">Then<select id="tm2"></select></label></div>' +
'<div class="fig" id="tfig"></div><div class="out" id="tout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Predict first, then check. Find where <b>one corner</b> goes using the rule, then move the other corners the same way.</p></div>' +
A.yt({ q: 'Point (2, 5) is reflected in the y-axis. Where does it land?', type: 'mc', options: ['(2, −5)', '(−2, 5)', '(−2, −5)', '(5, 2)'], answer: 1,
  hint: 'Say the rule: reflecting in the y-axis changes the sign of x only.', explain: '(&minus;x, y): (&minus;2, 5).' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function qx() {
        var k = $('#qk', root).value, q = Q[k];
        $('#qfig', root).innerHTML = quad(k, { diag: $('#qd', root).checked, sym: $('#qs', root).checked });
        $('#qtbl', root).innerHTML = '<table><tbody><tr><th class="l">Sides</th><td class="l">' + q.sides + '</td></tr><tr><th class="l">Parallel sides</th><td class="l">' + q.par + '</td></tr><tr><th class="l">Angles</th><td class="l">' + q.ang + '</td></tr><tr><th class="l">Diagonals</th><td class="l">' + q.diag + '</td></tr><tr><th class="l">Lines of symmetry</th><td class="l">' + q.lines + '</td></tr><tr><th class="l">Rotational symmetry</th><td class="l">order ' + q.rot + (q.rot === 1 ? ' (none)' : '') + '</td></tr></tbody></table>';
      }
      A.bind(root, ['qk', 'qd', 'qs'], qx);
      function rt() {
        var k = $('#rk', root).value, a = +$('#ra', root).value, q = Q[k], step = 360 / q.rot, match = a % step === 0;
        $('#rao', root).textContent = a + '°';
        $('#rfig', root).innerHTML = quad(k, { rot: a, ghost: true });
        var list = []; for (var t = step; t <= 360; t += step) list.push(t + '&deg;');
        $('#rout', root).innerHTML = '<p><span class="big" style="color:' + (match ? 'var(--good)' : 'var(--bad)') + '">' + (match ? 'Matches' : 'Does not match') + '</span></p><p>The dashed outline is where it started. The orange dot shows one corner, so you can see the turn.</p><p>The ' + k + ' matches itself at ' + list.join(', ') + ': rotational symmetry of <b>order ' + q.rot + '</b>.</p>';
      }
      A.bind(root, ['rk', 'ra'], rt);
      var hmap = [[1, 0, 0], [2, 1, 0], [3, 2, 1]], box = $('#isoin', root);
      box.innerHTML = [0, 1, 2].map(function (r) { return [0, 1, 2].map(function (c) { return '<label class="sr" for="iso' + r + c + '">Row ' + (r + 1) + ' column ' + (c + 1) + '</label><input type="number" id="iso' + r + c + '" min="0" max="4" value="' + hmap[r][c] + '" style="width:4.2em">'; }).join(''); }).join('');
      function is() {
        var h = [0, 1, 2].map(function (r) { return [0, 1, 2].map(function (c) { return Math.max(0, Math.min(4, parseInt($('#iso' + r + c, root).value, 10) || 0)); }); });
        $('#isofig', root).innerHTML = iso(h);
        $('#isoviews', root).innerHTML = '<figure>' + topView(h) + '</figure><figure>' + view(fronts(h), 'front') + '</figure><figure>' + view(sides(h), 'right side') + '</figure>';
        var tot = 0; h.forEach(function (r) { r.forEach(function (v) { tot += v; }); });
        $('#isoout', root).innerHTML = '<p><span class="big">' + tot + ' cubes</span></p><p>The front view shows the tallest stack in each column, seen from the front. The side view looks from the right.</p>';
      }
      var ids = []; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) ids.push('iso' + r + c);
      A.bind(root, ids, is);
      function cp() {
        var g = function (id) { return Math.max(-8, Math.min(8, parseInt($(id, root).value, 10) || 0)); }, a = [g('#cax'), g('#cay')], b = [g('#cbx'), g('#cby')];
        $('#cfig', root).innerHTML = grid(8, [{ p: a, lab: 'A' }, { p: b, lab: 'B', c: 'var(--strand)' }], [], [[a, b]], 20);
        function qd(p) { return !p[0] || !p[1] ? 'on an axis' : 'in quadrant ' + (p[0] > 0 ? (p[1] > 0 ? 'I' : 'IV') : (p[1] > 0 ? 'II' : 'III')); }
        $('#cout', root).innerHTML = '<p>A ' + pt(a) + ' is ' + qd(a) + '. B ' + pt(b) + ' is ' + qd(b) + '.</p><p><span class="big">A to B: ' + moveTxt(b[0] - a[0], b[1] - a[1]) + '</span></p><p class="t2">Across: ' + sg(b[0]) + ' &minus; (' + sg(a[0]) + ') = ' + sg(b[0] - a[0]) + '. Up or down: ' + sg(b[1]) + ' &minus; (' + sg(a[1]) + ') = ' + sg(b[1] - a[1]) + '.</p>';
      }
      A.bind(root, ['cax', 'cay', 'cbx', 'cby'], cp);
      var moves = Object.keys(T).concat(['translate right 3, down 2']);
      ['#tm1', '#tm2'].forEach(function (id, i) { $(id, root).innerHTML = moves.map(function (m, j) { return '<option value="' + j + '"' + (j === (i ? 5 : 2) ? ' selected' : '') + '>' + m + '</option>'; }).join(''); });
      function doMove(j, p) { return j < 5 ? T[moves[j]](p) : [p[0] + 3, p[1] - 2]; }
      function tr() {
        var tri = [[1, 1], [4, 1], [1, 3]], m1 = +$('#tm1', root).value, m2 = +$('#tm2', root).value;
        var t1 = tri.map(function (p) { return doMove(m1, p); }), t2 = t1.map(function (p) { return doMove(m2, p); });
        $('#tfig', root).innerHTML = grid(7, [], [{ pts: tri, lab: 'start' }, { pts: t1, c: 'var(--ink2)', dash: true, lab: '1' }, { pts: t2, c: 'var(--bad)', lab: '2' }], [], 22);
        $('#tout', root).innerHTML = '<p>Start: ' + tri.map(pt).join(', ') + '</p><p>After "' + moves[m1] + '": ' + t1.map(pt).join(', ') + '</p><p><b>After "' + moves[m2] + '": ' + t2.map(pt).join(', ') + '</b></p>';
      }
      A.bind(root, ['tm1', 'tm2'], tr);
    },

    quiz: [
      { q: 'Which shape has 4 equal sides but angles that are <b>not</b> all 90&deg;?', type: 'mc', options: ['square', 'rhombus', 'rectangle', 'kite'], answer: 1, fig: quad('rhombus', { diag: true }),
        hint: 'Which shapes have 4 equal sides? Which of those has no right angles?', explain: 'A rhombus has 4 equal sides. A square does too, but its angles are all 90&deg;.' },
      { q: 'How many lines of symmetry does a rectangle (that is not a square) have?', type: 'num', answer: 2, fig: quad('rectangle', { sym: true }),
        hint: 'Fold it in your mind: across the middle, and down the middle. Does a diagonal fold work?', explain: 'Two: one across, one down. A diagonal fold does not match the corners.' },
      { q: 'What is the order of rotational symmetry of a parallelogram?', type: 'num', answer: 2, fig: quad('parallelogram'),
        hint: 'Turn it 180&deg;. Does it match?', explain: 'It matches after 180&deg; and 360&deg;: order 2.' },
      { q: 'How many cubes does this top view describe? (Each number is the height of that stack.)', type: 'num', answer: 9, fig: topView([[2, 1, 0], [1, 3, 0], [0, 1, 1]]),
        hint: 'Add all the numbers.', explain: '2 + 1 + 1 + 3 + 1 + 1 = 9.' },
      { q: 'What are the coordinates of point P?', type: 'mc', options: ['(3, −2)', '(−2, 3)', '(−3, 2)', '(2, −3)'], answer: 1, fig: grid(5, [{ p: [-2, 3], lab: 'P' }], [], [], 26),
        hint: 'Read across first (x), then up or down (y).', explain: 'P is 2 left (x = &minus;2) and 3 up (y = 3): (&minus;2, 3).' },
      { q: 'Which translation moves (&minus;3, 4) to (2, &minus;1)?', type: 'mc', options: ['right 5, down 5', 'left 5, down 5', 'right 1, down 3', 'right 5, up 5'], answer: 0,
        hint: 'x changes from &minus;3 to 2. y changes from 4 to &minus;1.', explain: '&minus;3 to 2 is right 5. 4 to &minus;1 is down 5.' },
      { q: 'Point (4, 1) is rotated 180&deg; about the origin. Where does it land?', type: 'mc', options: ['(−4, 1)', '(4, −1)', '(−4, −1)', '(1, 4)'], answer: 2, fig: grid(5, [{ p: [4, 1], lab: '(4, 1)' }], [], [], 26),
        hint: 'A half turn changes the sign of both numbers.', explain: '(&minus;x, &minus;y): (&minus;4, &minus;1).' }
    ],

    practice: [
      { id: 'sg-quad', name: 'Quadrilateral properties', code: 'E1.1', gen: function (lv) {
        var facts = lv === 1 ? [['4 equal sides and 4 right angles', 'square'], ['4 right angles, but sides not all equal', 'rectangle'], ['exactly one pair of parallel sides', 'trapezoid'], ['2 pairs of equal sides next to each other, and no parallel sides', 'kite']]
          : lv === 2 ? [['4 equal sides, no right angles', 'rhombus'], ['2 pairs of parallel sides, no right angles, sides not all equal', 'parallelogram'], ['equal diagonals that meet at 90&deg;', 'square'], ['diagonals that meet at 90&deg;, and exactly 1 line of symmetry', 'kite']]
          : [['rotational symmetry of order 2 and no lines of symmetry', 'parallelogram'], ['rotational symmetry of order 4', 'square'], ['2 lines of symmetry along its diagonals', 'rhombus'], ['equal diagonals and 2 lines of symmetry through the middles of its sides', 'rectangle']];
        var f = R.pick(facts), names = ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite'], wrong = R.shuffle(names.filter(function (n) { return n !== f[1]; })).slice(0, 3), o = R.mc(f[1], wrong);
        return { q: 'Which quadrilateral has <b>' + f[0] + '</b>?', type: 'mc', options: o.options, answer: o.answer, v: { f: f[0], ans: f[1] },
          hint: 'Picture each shape. Check sides, angles, diagonals and symmetry one at a time.', steps: ['Read the property: ' + f[0] + '.', 'Here is the ' + f[1] + ':<div class="fig">' + quad(f[1], { diag: true, sym: true }) + '</div>', 'It is a ' + f[1] + '.'],
          explain: 'A ' + f[1] + ' has ' + f[0] + '.' };
      } },
      { id: 'sg-sym', name: 'Symmetry', code: 'E1.1', gen: function (lv) {
        var k = R.pick(Object.keys(Q)), q = Q[k], askRot = lv === 3 || (lv === 2 && R.int(0, 1));
        return { q: askRot ? 'What is the <b>order of rotational symmetry</b> of this ' + k + '?' : 'How many <b>lines of symmetry</b> does this ' + k + ' have?', type: 'num', answer: askRot ? q.rot : q.lines, fig: quad(k, { diag: lv === 1 }), v: { k: k, rot: askRot },
          hint: askRot ? 'Count how many times it matches itself in one full turn. 360&deg; counts.' : 'Imagine folding it. Count every fold that matches exactly.',
          steps: askRot ? ['Turn it a little at a time.', 'It matches every ' + 360 / q.rot + '&deg;.', 'In a full turn: order ' + q.rot + '.'] : ['Try folds across, down and along the diagonals.', 'Lines that work:<div class="fig">' + quad(k, { sym: true }) + '</div>', q.lines + ' line' + (q.lines === 1 ? '' : 's') + ' of symmetry.'],
          explain: 'A ' + k + ' has ' + (askRot ? 'rotational symmetry of order ' + q.rot : q.lines + ' line' + (q.lines === 1 ? '' : 's') + ' of symmetry') + '.' };
      } },
      { id: 'sg-coord', name: 'Read and plot points', code: 'E1.3', gen: function (lv) {
        var p = [R.int(-6, 6), R.int(-6, 6)];
        if (lv > 1) while (p[0] >= 0 && p[1] >= 0) p = [R.int(-6, 6), R.int(-6, 6)];
        if (!p[0]) p[0] = -2; if (!p[1]) p[1] = 3;
        if (lv === 3) { var qn = p[0] > 0 ? (p[1] > 0 ? 'I' : 'IV') : (p[1] > 0 ? 'II' : 'III');
          return { q: 'Which quadrant is ' + pt(p) + ' in?', type: 'mc', options: ['I', 'II', 'III', 'IV'], answer: ['I', 'II', 'III', 'IV'].indexOf(qn), v: { p: p },
            hint: 'Is x positive (right) or negative (left)? Is y positive (up) or negative (down)?', steps: ['x = ' + sg(p[0]) + ': ' + (p[0] > 0 ? 'right' : 'left') + '.', 'y = ' + sg(p[1]) + ': ' + (p[1] > 0 ? 'up' : 'down') + '.', (p[0] > 0 ? 'Right' : 'Left') + ' and ' + (p[1] > 0 ? 'up' : 'down') + ' is quadrant ' + qn + '.<div class="fig">' + grid(6, [{ p: p }], [], [], 22) + '</div>'], explain: pt(p) + ' is in quadrant ' + qn + '.' }; }
        var right = pt(p), o = R.mc(right, [pt([p[1], p[0]]), pt([-p[0], p[1]]), pt([p[0], -p[1]]), pt([-p[0], -p[1]])].filter(function (x) { return x !== right; }));
        return { q: 'What are the coordinates of the point?', type: 'mc', options: o.options, answer: o.answer, fig: grid(6, [{ p: p }], [], [], 24), v: { p: p },
          hint: 'Go across first (x), then up or down (y). Left and down are negative.', steps: ['From the origin, count across: ' + (p[0] > 0 ? 'right ' : 'left ') + Math.abs(p[0]) + ', so x = ' + sg(p[0]) + '.', 'Count up or down: ' + (p[1] > 0 ? 'up ' : 'down ') + Math.abs(p[1]) + ', so y = ' + sg(p[1]) + '.', 'The point is ' + right + '.'], explain: 'The point is ' + right + '.' };
      } },
      { id: 'sg-translate', name: 'Describe a translation', code: 'E1.3', gen: function (lv) {
        var a = [R.int(-6, 6), R.int(-6, 6)], dx = R.int(-6, 6), dy = R.int(-6, 6);
        if (!dx && !dy) dx = 3;
        var b = [a[0] + dx, a[1] + dy];
        if (Math.abs(b[0]) > 7 || Math.abs(b[1]) > 7) { a = [-1, 2]; dx = 4; dy = -5; b = [3, -3]; }
        if (lv === 3) { var o0 = R.mc(pt(b), [pt([a[0] - dx, a[1] - dy]), pt([a[0] + dy, a[1] + dx]), pt([a[0] + dx, a[1] - dy]), pt([a[0] - dx, a[1] + dy])].filter(function (x) { return x !== pt(b); }));
          return { q: 'Start at ' + pt(a) + ' and move <b>' + moveTxt(dx, dy) + '</b>. Where do you end?', type: 'mc', options: o0.options, answer: o0.answer, v: { a: a, dx: dx, dy: dy },
            hint: 'Right adds to x, left subtracts. Up adds to y, down subtracts.', steps: ['x: ' + sg(a[0]) + (dx >= 0 ? ' + ' + dx : ' &minus; ' + -dx) + ' = ' + sg(b[0]) + '.', 'y: ' + sg(a[1]) + (dy >= 0 ? ' + ' + dy : ' &minus; ' + -dy) + ' = ' + sg(b[1]) + '.', 'You end at ' + pt(b) + '.'], explain: 'You end at ' + pt(b) + '.' }; }
        var right = moveTxt(dx, dy), o = R.mc(right, [moveTxt(-dx, -dy), moveTxt(dy, dx), moveTxt(dx, -dy), moveTxt(-dx, dy)].filter(function (x) { return x !== right; }));
        return { q: 'Which translation moves A ' + pt(a) + ' to B ' + pt(b) + '?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? grid(7, [{ p: a, lab: 'A' }, { p: b, lab: 'B', c: 'var(--strand)' }], [], [], 20) : '', v: { a: a, b: b },
          hint: 'Subtract: new x minus old x, then new y minus old y.', steps: ['Across: ' + sg(b[0]) + ' &minus; (' + sg(a[0]) + ') = ' + sg(dx) + (dx ? ' (' + (dx > 0 ? 'right' : 'left') + ')' : '') + '.', 'Up or down: ' + sg(b[1]) + ' &minus; (' + sg(a[1]) + ') = ' + sg(dy) + (dy ? ' (' + (dy > 0 ? 'up' : 'down') + ')' : '') + '.', 'The translation is ' + right + '.'], explain: 'A to B is ' + right + '.' };
      } },
      { id: 'sg-transform', name: 'Reflections and rotations', code: 'E1.4', gen: function (lv) {
        var keys = Object.keys(T), k = lv === 1 ? R.pick(keys.slice(0, 2)) : lv === 2 ? R.pick(keys.slice(0, 4)) : R.pick(keys), p = [R.int(1, 6) * R.pick([1, -1]), R.int(1, 6) * R.pick([1, -1])];
        if (Math.abs(p[0]) === Math.abs(p[1])) p[1] = p[1] > 0 ? p[1] - 1 || 2 : p[1] + 1 || -2;
        var img = T[k](p), right = pt(img), cands = keys.map(function (kk) { return pt(T[kk](p)); }).concat([pt([p[1], p[0]])]);
        var o = R.mc(right, cands.filter(function (x) { return x !== right; }));
        return { q: 'Point ' + pt(p) + ' is ' + k.replace('reflect', 'reflected').replace('rotate', 'rotated') + '. Where does it land?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? grid(6, [{ p: p, lab: 'P' }], [], [], 22) : '', v: { p: p, k: k },
          hint: { 'reflect in the x-axis': 'Reflecting in the x-axis changes the sign of y only.', 'reflect in the y-axis': 'Reflecting in the y-axis changes the sign of x only.', 'rotate 180° about (0, 0)': 'A half turn changes the sign of both numbers.', 'rotate 90° clockwise about (0, 0)': 'Clockwise quarter turn: (x, y) becomes (y, &minus;x).', 'rotate 90° counterclockwise about (0, 0)': 'Counterclockwise quarter turn: (x, y) becomes (&minus;y, x).' }[k],
          steps: ['The rule for "' + k + '" is ' + { 'reflect in the x-axis': '(x, &minus;y)', 'reflect in the y-axis': '(&minus;x, y)', 'rotate 180° about (0, 0)': '(&minus;x, &minus;y)', 'rotate 90° clockwise about (0, 0)': '(y, &minus;x)', 'rotate 90° counterclockwise about (0, 0)': '(&minus;y, x)' }[k] + '.', 'Put in x = ' + sg(p[0]) + ' and y = ' + sg(p[1]) + '.', 'The image is ' + right + '.<div class="fig">' + grid(6, [{ p: p, lab: 'P' }, { p: img, lab: 'P′', c: 'var(--strand)' }], [], [], 22) + '</div>'],
          explain: pt(p) + ' lands on ' + right + '.' };
      } },
      { id: 'sg-views', name: 'Views of cube buildings', code: 'E1.2', gen: function (lv) {
        var h = [[R.int(0, 2), R.int(0, 3), R.int(0, 1)], [R.int(0, 3), R.int(1, 3), R.int(0, 2)], [R.int(1, 3), R.int(0, 2), R.int(1, 3)]];
        var tot = 0; h.forEach(function (r) { r.forEach(function (v) { tot += v; }); });
        if (lv === 1) return { q: 'How many cubes are in this building? The numbers show the height of each stack.', type: 'num', answer: tot, fig: topView(h), v: { h: h },
          hint: 'Add every number in the top view.', steps: ['Each number is one stack.', 'Add them: ' + [].concat.apply([], h).filter(Boolean).join(' + ') + '.', 'Total: ' + tot + ' cubes.'], explain: tot + ' cubes.' };
        var fr = fronts(h), right = fr.join(', '), cols = fr.length;
        var wr = [h[2].join(', '), fr.slice().reverse().join(', '), sides(h).join(', '), fr.map(function (x) { return x + 1; }).join(', ')].filter(function (x) { return x !== right; });
        var o = R.mc(right, wr);
        return { q: 'Looking from the <b>front</b> (the bottom of the top view), what are the heights of the columns, left to right?', type: 'mc', options: o.options, answer: o.answer, fig: (lv === 2 ? iso(h) : '') + topView(h), v: { h: h },
          hint: 'For each column, find the tallest stack anywhere in that column.', steps: ['Look down each column of the top view.', 'The tallest in each column: ' + fr.join(', ') + '.', 'The front view is:<div class="fig">' + view(fr, 'front') + '</div>'], explain: 'The front view shows the tallest stack in each column: ' + right + '.' };
      } }
    ]
  });
})();
