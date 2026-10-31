(function () {
  var K = K8, A = Atlas, F = K.fx('geometry'), C = 'geometry', T = K.txt, D = '°';
  var TRI = [[1, 1], [4, 1], [1, 3]];
  function line(a, x) {
    return A.svg(400, 150, '<line x1="30" y1="120" x2="370" y2="120" style="stroke:var(--ink)" stroke-width="2.5"/>' +
      '<line x1="200" y1="120" x2="' + (200 + 150 * Math.cos(F.rad(a))) + '" y2="' + (120 - 150 * Math.sin(F.rad(a))) + '" style="stroke:var(--ink)" stroke-width="2.5"/>' +
      F.arc(200, 120, 34, 0, a, 'var(--strand)', a + D, 58) + F.arc(200, 120, 26, a, 180, 'var(--accent)', x, 48), 'A straight line split into ' + a + ' degrees and ' + x + '.');
  }
  function cross(lab) {
    return A.svg(400, 170, '<line x1="40" y1="140" x2="360" y2="30" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="40" y1="40" x2="360" y2="130" style="stroke:var(--ink)" stroke-width="2.5"/>' +
      F.arc(200, 85, 30, 161, 196, 'var(--strand)', '35' + D, 52) + F.arc(200, 85, 30, -19, 16, 'var(--strand)', '35' + D, 52) + F.arc(200, 85, 30, 16, 161, 'var(--accent)', lab, 46), 'Two lines crossing. Two vertically opposite angles are 35 degrees.');
  }
  function tri(img) { return F.plane([{ pts: TRI, col: 'var(--strand)', lab: 'ABC' }].concat(img ? [{ pts: img, col: 'var(--accent)', lab: 'ABC', prime: true, dash: true }] : [])); }

  K.lessons(C, [
    { id: 'angles', title: 'Angle facts', sub: 'Four facts that unlock most problems.', concepts: [
      { id: 'straight', title: 'Straight lines and full turns', exp: ['E2.2'], skill: 'ge-angles',
        body: '<p>Angles on a straight line add to <b>180°</b>. Angles all the way around a point add to <b>360°</b>.</p>',
        watch: K.film([
          [line(130, 'x'), 'A straight line, split into 130° and x.'],
          [line(130, '50' + D), 'Together they make 180°, so x = 180 − 130 = 50°.'],
          [T(['around a point: 360°', '90 + 120 + x = 360 → x = 150']), 'All the way around: 360°.', 2600]
        ]),
        key: '<p>Straight line: <b>180°</b>. Around a point: <b>360°</b>.</p>',
        mistake: '<p>Using 360° for a straight line. A straight line is half a turn.</p>',
        check: [K.chk(C, 'ge-angles', 1), K.chk(C, 'ge-angles', 1)] },
      { id: 'opposite', title: 'Opposite angles and triangles', exp: ['E2.2'], skill: 'ge-angles',
        body: '<p>When two lines cross, the <b>vertically opposite</b> angles (across the X) are equal. The angles inside a triangle add to <b>180°</b>.</p>',
        watch: K.film([
          [cross('x'), 'Two lines cross. The two angles across from each other are both 35°.'],
          [cross('145' + D), 'x sits beside 35° on a straight line: 180 − 35 = 145°.'],
          [T(['triangle: 50 + 60 + x = 180', 'x = 70°']), 'In a triangle, the three angles add to 180°.', 2600]
        ]),
        key: '<p>Across the X: <b>equal</b>. Inside a triangle: <b>180°</b>.</p>',
        mistake: '<p>Calling the angle beside 35° equal to it. Beside is on a straight line (180°); across is equal.</p>',
        check: [K.chk(C, 'ge-angles', 2), K.chk(C, 'ge-angles', 3)] }
    ] },
    { id: 'parallel', title: 'Parallel lines', sub: 'F, Z and C angles.', concepts: [
      { id: 'pairs', title: 'F, Z and C', exp: ['E2.2'], skill: 'ge-parallel', hard: true,
        body: '<p>A <b>transversal</b> crossing two parallel lines makes 8 angles in just two sizes. <b>Corresponding</b> (F) angles are equal. <b>Alternate</b> (Z) angles are equal. <b>Co-interior</b> (C) angles add to 180°.</p>',
        watch: K.film([
          [F.parallel(60, 'deg'), 'Two parallel lines and a transversal at 60°. Only two sizes: 60° and 120°.'],
          [F.parallel(60, 'deg', [1, 5]), 'Corresponding: an F shape. Equal.'],
          [F.parallel(60, 'deg', [3, 5]), 'Alternate: a Z shape. Equal.'],
          [F.parallel(60, 'deg', [4, 5]), 'Co-interior: a C shape. 60 + 120 = 180.', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Show the <b>alternate (Z)</b> pair. Tilt the line. Do they stay equal?', goal: function (g) { return g('plp') === '3,5' && g('pla') !== 60; }, yes: 'Alternate angles stay equal at every tilt.' },
          { do: 'Show the <b>co-interior (C)</b> pair at <b>110°</b>.', goal: function (g) { return g('plp') === '4,5' && g('pla') === 110; }, yes: '110 + 70 = 180.' }] }),
        ways: [{ label: 'Slide the crossing', html: '<p>The bottom crossing is a copy of the top one, slid along the transversal. So each angle at the top matches the angle in the same spot at the bottom.</p>' },
          { label: 'Two sizes only', html: '<p>Every angle is either the small one or the big one, and small + big = 180°. Once you know one angle, you know all eight.</p>' }],
        key: '<p>F and Z: <b>equal</b>. C: <b>add to 180°</b>.</p>',
        mistake: '<p>Using these rules when the lines are not parallel. Look for the arrow marks first.</p>',
        check: [K.chk(C, 'ge-parallel', 1), K.chk(C, 'ge-parallel', 2)] },
      { id: 'find', title: 'Finding missing angles', exp: ['E2.2'], skill: 'ge-parallel',
        body: '<p>Name the pair, state the rule, then calculate. Give a reason for every step.</p>',
        watch: K.film([
          [F.parallel(70, 'num'), 'Angle 1 is 70°. Find angle 8.'],
          [T(['∠5 = 70° (corresponding to ∠1)']), 'Angle 5 matches angle 1: F shape.'],
          [T(['∠8 = 180 − 70 = 110°', '(straight line with ∠5)']), 'Angle 8 sits on a straight line with angle 5.', 2600]
        ]),
        key: '<p>Every step: <b>angle, value, reason</b>.</p>',
        mistake: '<p>Writing an answer with no reason. In Grade 8, the reason is part of the answer.</p>',
        check: [K.chk(C, 'ge-parallel', 3), K.chk(C, 'ge-parallel', 2)] }
    ] },
    { id: 'polygons', title: 'Angles in polygons', sub: 'Split into triangles.', concepts: [
      { id: 'sum', title: 'The interior angle sum', exp: ['E2.2'], skill: 'ge-polygon',
        body: '<p>From one corner, a polygon with n sides splits into n − 2 triangles. Each triangle has 180°.</p>' + K.eq('Sum = (n − 2) × 180°'),
        watch: K.film([
          [F.polygon(4, true), 'A quadrilateral: 2 triangles. 2 × 180 = 360°.'],
          [F.polygon(5, true), 'A pentagon: 3 triangles. 540°.'],
          [F.polygon(6, true), 'A hexagon: 4 triangles. 720°.', 2600]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Find the polygon whose angles add to <b>1080°</b>.', goal: function (g) { return g('pgn') === 8; }, yes: 'An octagon: 6 triangles × 180 = 1080°.' },
          { do: 'Which polygon has exactly <b>10 triangles</b>?', goal: function (g) { return g('pgn') === 12; }, yes: '12 sides: 12 − 2 = 10 triangles.' }] }),
        key: '<p>Sum = <b>(n − 2) × 180°</b>.</p>',
        mistake: '<p>Using n × 180°. Count the triangles: always 2 fewer than the sides.</p>',
        check: [K.chk(C, 'ge-polygon', 1), K.num('What is the sum of the interior angles of a decagon (10 sides)?', 1440, '(10 − 2) × 180.', '8 × 180 = 1440°.', { unit: '°' })] },
      { id: 'regular', title: 'Regular polygons', exp: ['E2.2'], skill: 'ge-polygon', hard: true,
        body: '<p>In a <b>regular</b> polygon, all angles are equal: divide the sum by n. The exterior angles of any convex polygon add to <b>360°</b>.</p>',
        watch: K.film([
          [F.polygon(6, false), 'A regular hexagon: 720° shared by 6 angles.'],
          [T(['720 ÷ 6 = 120°']), 'Each interior angle: 120°.'],
          [T(['exterior: 360 ÷ 6 = 60°', '120 + 60 = 180']), 'Each exterior angle is 360 ÷ 6. Interior + exterior = 180°.', 2600]
        ]),
        ways: [{ label: 'Walk around it', html: '<p>Walk around any polygon and you turn a full circle, 360°. Each corner turn is an exterior angle.</p>' }],
        key: '<p>Each interior = <b>sum ÷ n</b>. Each exterior = <b>360 ÷ n</b>.</p>',
        mistake: '<p>Dividing 360 by n and calling it the interior angle. That is the exterior.</p>',
        check: [K.chk(C, 'ge-polygon', 2), K.chk(C, 'ge-polygon', 3)] },
      { id: 'tessellate', title: 'Tessellations', exp: ['E1.4', 'E2.2'], skill: 'ge-polygon',
        body: '<p>A <b>tessellation</b> covers a surface with no gaps or overlaps. Where tiles meet, the angles must add to exactly 360°.</p>',
        watch: K.film([
          [F.tess(), 'Hexagons fit: 3 × 120 = 360. Pentagons leave a gap: 3 × 108 = 324.'],
          [T(['triangle 6 × 60 = 360 ✓', 'square 4 × 90 = 360 ✓', 'hexagon 3 × 120 = 360 ✓']), 'Only three regular polygons tessellate on their own.', 2800]
        ]),
        key: '<p>Angles at each meeting point must make <b>360°</b>.</p>',
        mistake: '<p>Thinking any shape can tessellate if you squeeze it. Check whether the angle divides 360 exactly.</p>',
        check: [K.mc('Can regular octagons (135° each) tessellate on their own?', 'No', ['Yes'], 'Does 135 go into 360 a whole number of times?', '2 × 135 = 270, 3 × 135 = 405. Neither is 360.')] }
    ] },
    { id: 'transform', title: 'Transformations', sub: 'Slide, flip, turn and resize.', concepts: [
      { id: 'rigid', title: 'Slide, flip and turn', exp: ['E1.4'], skill: 'ge-transform', hard: true,
        body: '<p>A <b>translation</b> slides, a <b>reflection</b> flips, a <b>rotation</b> turns. The image (A′B′C′) is the same size and shape; only its position changes.</p>',
        watch: K.film([
          [tri(), 'Triangle ABC: A(1, 1), B(4, 1), C(1, 3).'],
          [tri(TRI.map(function (p) { return F.tx('tr', [-5, -4], p); })), 'Translate 5 left and 4 down: (x, y) → (x − 5, y − 4).'],
          [tri(TRI.map(function (p) { return F.tx('rx', 0, p); })), 'Reflect in the x-axis: (x, y) → (x, −y).'],
          [tri(TRI.map(function (p) { return F.tx('r90', 0, p); })), 'Rotate 90° counter-clockwise: (x, y) → (−y, x).', 2800]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Translate the triangle <b>3 right and 2 up</b>.', goal: function (g) { return g('tft') === 'tr' && g('tfa') === 3 && g('tfb') === 2; }, yes: 'A(1, 1) → A′(4, 3).' },
          { do: 'Reflect it in the <b>y-axis</b>.', goal: function (g) { return g('tft') === 'ry'; }, yes: '(x, y) → (−x, y). The x-coordinates change sign.' },
          { do: 'Rotate it <b>180°</b>.', goal: function (g) { return g('tft') === 'r180'; }, yes: '(x, y) → (−x, −y). Both signs change.' }] }),
        ways: [{ label: 'Tracing paper', html: '<p>Trace the triangle. For a rotation, hold a pencil on the origin and turn the paper. For a reflection, flip the paper over the axis.</p>' }],
        key: '<p>Translation, reflection, rotation: <b>same size and shape</b>.</p>',
        mistake: '<p>Mixing up the x-axis and y-axis reflections. Reflecting in the x-axis flips up and down, so y changes sign.</p>',
        check: [K.chk(C, 'ge-transform', 1), K.chk(C, 'ge-transform', 2)] },
      { id: 'dilate', title: 'Dilations', exp: ['E1.4'], skill: 'ge-transform',
        body: '<p>A <b>dilation</b> resizes a shape from a centre. With the origin as centre, multiply every coordinate by the scale factor k. The shape stays the same; the size changes.</p>',
        watch: K.film([
          [tri(TRI.map(function (p) { return F.tx('di', 2, p); })), 'Scale factor 2: (x, y) → (2x, 2y). Twice as big.'],
          [tri(TRI.map(function (p) { return F.tx('di', 0.5, p); })), 'Scale factor 0.5: half the size.', 2600]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Make a dilation that <b>doubles</b> the triangle.', goal: function (g) { return g('tft') === 'di' && /Dilation by 2 about/.test(g.text('#tfout')); }, yes: 'A(1, 1) → A′(2, 2).' }] }),
        key: '<p>Dilation by k: <b>(x, y) → (kx, ky)</b>.</p>',
        mistake: '<p>Adding k instead of multiplying. That is a translation.</p>',
        check: [K.chk(C, 'ge-transform', 3), K.mc('Triangle P(2, 4) is dilated by 1.5 about the origin. Where is P′?', '(3, 6)', ['(3.5, 5.5)', '(2, 6)', '(1.5, 1.5)'], 'Multiply both coordinates by 1.5.', '2 × 1.5 = 3 and 4 × 1.5 = 6.')] }
    ] },
    { id: 'scale', title: 'Scale drawings', sub: 'Smaller on paper, same shape.', concepts: [
      { id: 'drawing', title: 'Using a scale', exp: ['E1.3'], skill: 'ge-scale',
        body: '<p>A scale of 1 : 50 means 1 cm on the drawing is 50 cm in real life. Multiply to go from drawing to real; divide to go back.</p>',
        watch: K.film([
          [F.plan(8, 6, 50), 'A room is 8 cm by 6 cm on a plan at 1 : 50.'],
          [T(['8 × 50 = 400 cm = 4 m', '6 × 50 = 300 cm = 3 m']), 'Multiply each length by 50.'],
          [T(['real room: 4 m by 3 m']), 'Change to metres to make sense of it.', 2600]
        ]),
        key: '<p>Real = <b>drawing × scale</b>.</p>',
        mistake: '<p>Forgetting to change cm to m at the end, giving a room 400 m long.</p>',
        check: [K.chk(C, 'ge-scale', 1), K.chk(C, 'ge-scale', 2)] },
      { id: 'area', title: 'Area grows faster', exp: ['E1.3'], skill: 'ge-scale', hard: true,
        body: '<p>If lengths are multiplied by k, areas are multiplied by <b>k²</b>. Double a drawing and it needs 4 times the paint.</p>',
        watch: K.film([
          [T(['plan: 8 cm × 6 cm = 48 cm²']), 'On the plan: 48 cm².'],
          [T(['real: 4 m × 3 m = 12 m²']), 'In real life: 12 m².'],
          [T(['lengths × 50', 'area × 50² = × 2500']), 'Lengths grew 50 times; area grew 2500 times.', 2600]
        ]),
        ways: [{ label: 'Tiles', html: '<p>A 1 by 1 square doubled becomes 2 by 2. It holds 4 of the original squares, not 2.</p>' },
          { label: 'Views', html: '<p>Builders also draw the front, side and top views of an object.</p><div class="fig">' + F.views() + '</div>' }],
        key: '<p>Lengths × k → area × <b>k²</b>.</p>',
        mistake: '<p>Multiplying the area by k instead of k².</p>',
        check: [K.chk(C, 'ge-scale', 3), K.num('A photo 10 cm by 15 cm is enlarged by a factor of 3. How many times bigger is its area?', 9, 'Area grows by k².', '3² = 9 times.')] }
    ] }
  ]);
})();