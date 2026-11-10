/* Grade 6 Measurement: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/measurement.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E2.1 converting metric units, including square units; E2.2 angles up to 360°, either way round; E2.3
   complementary, supplementary and opposite angles, and the angles of a triangle; E2.4 the area of trapezoids,
   rhombuses, kites and composite shapes; E2.5 nets of prisms and pyramids; E2.6 surface area. The answer checks are
   in tests/verify/sheets.js: a conversion with its units (3 m² = 30 000 cm²), an angle from the angle drawn, the four
   angles where two lines cross (cross), a triangle's missing angle (ask), an area from the shape's lengths, the faces,
   edges and vertices of an object (solid), and a surface area from the net. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var F = S.fmt, MU = { mm: 0.001, cm: 0.01, m: 1, km: 1000, mg: 0.001, g: 1, kg: 1000, mL: 0.001, L: 1 };
  function r6(v) { return Math.round(v * 1e6) / 1e6; }
  /* a conversion: n of one unit in another (square units with sq) */
  function CV(n, from, to) { return { eq: [F(n) + ' ' + from + ' = [] ' + to], a: [r6(n * MU[from] / MU[to])] }; }
  function SQ(n, from, to) { var k = MU[from] / MU[to]; return { eq: [F(n) + ' ' + from + '² = [] ' + to + '²'], a: [r6(n * k * k)] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* angles: name by size; measure a reflex angle from the small one */
  var KINDS = ['acute', 'obtuse', 'reflex'];
  function KN(g, rot) { return { pic: ['angle', { deg: g, rot: rot || 0 }], pick: { opts: KINDS, ans: g < 90 ? 0 : g < 180 ? 1 : 2, angle: true } }; }
  function RX(g, rot) { return { q: 'The small angle is ' + (360 - g) + '°.', pic: ['angle', { deg: g, rot: rot || 0 }], eq: ['360° − ' + (360 - g) + '° = []°'], a: [g] }; }
  function SUB(whole, part) { return { eq: [whole + '° − ' + part + '° = []°'], a: [whole - part] }; }
  /* is the pair complementary (adds to 90°), supplementary (180°) or neither? */
  function PR(x, y) { var t = x + y; return { q: x + '° and ' + y + '°', pick: { opts: ['complementary', 'supplementary', 'neither'], ans: t === 90 ? 0 : t === 180 ? 1 : 2, pair: [x, y] } }; }
  /* two crossing lines: the angle beside the one given (a) and the one opposite it (b) */
  function CR(g) { return { pic: ['cross', { deg: g, labs: [g + '°', 'a', 'b'] }], eq: ['a = []°', 'b = []°'], a: [180 - g, g] }; }
  /* the missing angle of a triangle, drawn, or from two angles */
  function MA(an, i) { return { pic: ['tri', { angles: an, show: 'angles', ask: i }], eq: ['? is []°'], a: [an[i]] }; }
  function MS(x, y) { return { eq: ['180° − ' + x + '° − ' + y + '° = []°'], a: [180 - x - y] }; }
  /* areas from a picture */
  function AR(kind, o) { var p = Object.assign({ kind: kind, unit: 'cm' }, o); var a = kind === 'trap' ? (o.b + o.t) * o.h / 2 : o.b * o.h / 2; return { pic: ['plane', p], eq: ['[] cm²'], a: [a] }; }
  function TF(b, t, h) { return { eq: ['(' + b + ' + ' + t + ') × ' + h + ' ÷ 2 = []'], a: [(b + t) * h / 2] }; }
  function DF(d1, d2) { return { eq: [d1 + ' × ' + d2 + ' ÷ 2 = []'], a: [d1 * d2 / 2] }; }
  /* a shape of squares on a grid, each square 1 cm² */
  function CP(cells, cols, rows) { return { q: 'Each square is 1 cm².', pic: ['area', { cols: cols, rows: rows, cells: cells, u: 14 }], eq: ['[] cm²'], a: [cells.length] }; }
  function cells(rects) { var out = []; rects.forEach(function (r) { for (var x = r[0]; x < r[0] + r[2]; x++) for (var y = r[1]; y < r[1] + r[3]; y++) { var k = x + ',' + y; if (out.indexOf(k) < 0) out.push(k); } }); return out; }
  /* faces, edges and vertices of an object */
  var SOL = { tri: ['triangular prism', 5, 9, 6], prism: ['rectangular prism', 6, 12, 8], pyramid: ['square-based pyramid', 5, 8, 5], tpyr: ['triangular pyramid', 4, 6, 4], cube: ['cube', 6, 12, 8] };
  function FV(k) { var s = SOL[k]; return { q: (/^[aeiou]/.test(s[0]) ? 'An ' : 'A ') + s[0] + ':', eq: ['[] faces', '[] edges', '[] vertices'], a: [s[1], s[2], s[3]], solid: k }; }
  function KP(k) { var s = SOL[k]; return { q: (/^[aeiou]/.test(s[0]) ? 'An ' : 'A ') + s[0] + ' is a:', pick: { opts: ['prism', 'pyramid'], ans: /pyr/.test(k) || k === 'pyramid' ? 1 : 0 }, solid: k }; }
  /* surface area from a net */
  function NT(o, unit) { var p = Object.assign({ unit: unit || 'cm' }, o); var sa = o.kind === 'box' ? 2 * (o.l * o.w + o.l * o.h + o.w * o.h) : o.kind === 'tprism' ? o.b * o.th + (o.b + 2 * o.s) * o.l : o.b * o.b + 2 * o.b * o.sh; return { q: 'Surface area?', pic: ['net', p], eq: ['[] ' + (unit || 'cm') + '²'], a: [sa], wide: true }; }
  function BX(l, w, h) { return { eq: ['2 × (' + l + ' × ' + w + ' + ' + l + ' × ' + h + ' + ' + w + ' × ' + h + ') = []'], a: [2 * (l * w + l * h + w * h)], wide: true }; }

  S.register('measurement', { code: 'ME', ideas: {

    ladder: {
      watch: 'moving the decimal the wrong way. A smaller unit means more of them: multiply.',
      goal: 'I can convert between metric units.',
      learn: {
        show: { cap: 'km, m, cm, mm: each step is 10, 100 or 1000', eq: ['2.5 m = 250 cm', '4500 g = 4.5 kg'] },
        together: [CV(3.2, 'km', 'm'), CV(850, 'mm', 'cm')],
        cue: 'To a smaller unit: multiply. To a bigger unit: divide.',
        own: [CV(6.4, 'L', 'mL'), CV(750, 'g', 'kg'), CV(0.45, 'm', 'cm')]
      },
      p1: {
        show: { eq: ['1 km = 1000 m', '1 m = 100 cm = 1000 mm'] },
        items: [CV(5, 'km', 'm'), CV(3.7, 'm', 'cm'), CV(42, 'mm', 'cm'), CV(2.75, 'kg', 'g'), CV(1500, 'mL', 'L'), CV(80, 'cm', 'm')]
      },
      p2: {
        items: [CV(0.6, 'km', 'm'), CV(12500, 'm', 'km'), CV(3.05, 'L', 'mL'), CV(4.8, 'cm', 'mm'), CV(250, 'mg', 'g'), CV(0.035, 'kg', 'g'),
          story('A trail is 4.2 km long. {a} has walked 1800 m. How far is left, in metres?', 'm', 2400, '4.2 km − 1800 m')]
      },
      p3: {
        items: [CV(7.25, 'km', 'm'), CV(65, 'cm', 'm'), CV(2340, 'g', 'kg'),
          story('A {cont} holds 1.5 L. How many 250 mL cups fill it?', 'cups', 6, '1.5 L ÷ 250 mL'),
          story('A bag of flour is 2.5 kg. {b} uses 600 g. How many grams are left?', 'g', 1900, '2.5 kg − 600 g')]
      },
      think: {
        items: [{ q: '{b} says 3.5 m = 35 cm. What went wrong?', lines: { n: 2, key: '1 m is 100 cm, not 10: 3.5 m = 350 cm.' } },
          { q: 'Why is a millimetre called "milli"?', lines: { n: 2, key: 'Milli means one thousandth: 1 mm is 1/1000 of a metre.' } },
          CV(0.08, 'km', 'cm'),
          { q: 'Order from least to greatest: 1.2 km, 1150 m, 120 000 cm.', lines: { n: 1, key: '1150 m, 1.2 km and 120 000 cm (both 1200 m).' } }]
      }
    },

    square: {
      watch: 'using 100 for square units. 1 m² is 100 cm by 100 cm: 10 000 cm².',
      goal: 'I can convert square units.',
      learn: {
        show: { cap: '1 m by 1 m = 100 cm by 100 cm', eq: ['1 m² = 10 000 cm²'] },
        together: [SQ(3, 'm', 'cm'), SQ(1, 'cm', 'mm')],
        cue: 'Square the step: 100 × 100 for m² to cm², 10 × 10 for cm² to mm².',
        own: [SQ(5, 'cm', 'mm'), SQ(20000, 'cm', 'm'), SQ(0.5, 'm', 'cm')]
      },
      p1: {
        show: { eq: ['1 cm² = 10 × 10 = 100 mm²'] },
        items: [SQ(2, 'm', 'cm'), SQ(7, 'cm', 'mm'), SQ(40000, 'cm', 'm'), SQ(300, 'mm', 'cm'), SQ(1.5, 'm', 'cm'), SQ(12, 'cm', 'mm')]
      },
      p2: {
        items: [SQ(0.25, 'm', 'cm'), SQ(850, 'mm', 'cm'), SQ(65000, 'cm', 'm'), SQ(4.2, 'cm', 'mm'),
          story('A rug is 2 m by 3 m. 1 m² = 10 000 cm². Its area in cm²?', 'cm²', 60000, '2 × 3 × 10000')]
      },
      p3: {
        items: [SQ(3.6, 'm', 'cm'), SQ(1250, 'mm', 'cm'),
          story('A garden is 5 m by 4 m. 1 m² = 10 000 cm². Its area in cm²?', 'cm²', 200000, '5 × 4 × 10000'),
          { q: 'A tile is 20 cm by 20 cm. How many tiles cover 1 m² (10 000 cm²)?', eq: ['[] tiles'], a: [25], calc: '10000 ÷ (20 × 20)' }]
      },
      think: {
        items: [{ q: '{b} says 1 m² = 100 cm². Draw or explain why that is wrong.', lines: { n: 3, key: 'A 1 m square is 100 cm by 100 cm, so it holds 100 × 100 = 10 000 cm².' } },
          { q: 'Which is bigger: 0.5 m² or 4000 cm²?', lines: { n: 1, key: '0.5 m², which is 5000 cm².' } },
          SQ(2.5, 'm', 'cm')]
      }
    },

    big: {
      watch: 'reading a reflex angle as the small one. Check which side has the arc.',
      goal: 'I can name and measure angles up to 360°.',
      learn: {
        show: { pic: ['angle', { deg: 250 }], cap: 'reflex: more than 180°', eq: ['360° − 110° = 250°'] },
        together: [KN(220), RX(300)],
        cue: 'Measure the small angle. Take it from 360°.',
        own: [KN(135), RX(230, 20)]
      },
      p1: {
        show: { eq: ['acute < 90°, obtuse < 180°', 'reflex between 180° and 360°'] },
        items: [KN(70), KN(200), RX(270), RX(325)]
      },
      p2: {
        items: [KN(265, 40), KN(95), RX(240, 10), RX(195), SUB(360, 145), SUB(360, 78)]
      },
      p3: {
        items: [RX(280, 30), RX(315), SUB(360, 32),
          { q: 'Draw a 240° angle. Show the arc.', draw: { h: 80, key: 'Draw a 120° angle, then mark the arc on the outside: 360 − 120 = 240.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} measured a reflex angle as 70°. What went wrong?', lines: { n: 3, key: '{b} read the small angle. The reflex angle is 360° − 70° = 290°.' } },
          { q: 'How many degrees in a three-quarter turn? Explain.', lines: { n: 2, key: '270°: three right angles, 3 × 90°.' } },
          RX(250, 50)]
      }
    },

    ways: {
      watch: 'forgetting there are two ways round. Clockwise and counterclockwise together make 360°.',
      goal: 'I can find an angle turning clockwise or counterclockwise.',
      learn: {
        show: { cap: 'clockwise 70°, so counterclockwise', eq: ['360° − 70° = 290°'] },
        together: [SUB(360, 90), SUB(360, 120)],
        cue: 'The two ways round add to 360°.',
        own: [SUB(360, 45), SUB(360, 210), SUB(360, 135)]
      },
      p1: {
        show: { eq: ['quarter turn: 90° or 270°'] },
        items: [SUB(360, 60), SUB(360, 180), SUB(360, 270), SUB(360, 25), SUB(360, 150), SUB(360, 300)]
      },
      p2: {
        items: [story('{a} turns 90° clockwise, then 45° more clockwise. How far in all?', '°', 135, '90 + 45'),
          story('{a} turns 180°, then 45° more the same way. How far in all?', '°', 225, '180 + 45'),
          story('Each hour on a clock is 30°. The hand turns from 12 to 4. How many degrees?', '°', 120, '4 × 30'),
          SUB(360, 135), SUB(360, 15)]
      },
      p3: {
        items: [story('A wheel turns 360° and then 90° more. How many degrees in all?', '°', 450, '360 + 90'),
          story('{b} faces north and turns 270° clockwise. Then 90° counterclockwise. How far clockwise from north?', '°', 180, '270 − 90'),
          SUB(360, 225),
          { q: 'Facing east, which way is shorter to face north: clockwise or counterclockwise? By how much?', lines: { n: 2, key: 'Counterclockwise: 90°, not 270°.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says turning 270° clockwise is the same as 90° counterclockwise. Is that true?', lines: { n: 3, key: 'Yes. You end facing the same way, because 270 + 90 = 360.' } },
          { q: 'Why do the two ways round add to 360°?', lines: { n: 2, key: 'Together they go all the way round: one full turn.' } },
          SUB(360, 95)]
      }
    },

    pairs: {
      watch: 'mixing up the two. Complementary makes a corner (90°); supplementary makes a straight line (180°).',
      goal: 'I can use complementary and supplementary angles.',
      learn: {
        show: { cap: 'corner: 90°, straight line: 180°', eq: ['35° + 55° = 90°', '120° + 60° = 180°'] },
        together: [SUB(90, 35), PR(110, 70)],
        cue: 'Corner: take from 90°. Straight line: take from 180°.',
        own: [SUB(180, 125), PR(40, 50), SUB(90, 62)]
      },
      p1: {
        show: { eq: ['complement of 30°: 60°', 'supplement of 30°: 150°'] },
        items: [SUB(90, 20), SUB(90, 45), SUB(180, 90), SUB(180, 35), PR(25, 65), PR(100, 70)]
      },
      p2: {
        items: [SUB(90, 8), SUB(180, 162), PR(135, 45), PR(48, 42), SUB(180, 99),
          { q: 'Two equal angles are supplementary. How big is each?', eq: ['180° ÷ 2 = []°'], a: [90] }]
      },
      p3: {
        items: [PR(73, 17), SUB(90, 54), SUB(180, 47),
          { q: 'One angle is 4 times its complement. How big are they?', lines: { n: 2, key: '72° and 18°: 5 parts make 90°, so 1 part is 18°.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says the complement of 120° is 60°. What went wrong?', lines: { n: 3, key: '120° and 60° make 180°: they are supplementary. 120° has no complement, as it is more than 90°.' } },
          { q: 'Can an obtuse angle have a complement? Why?', lines: { n: 2, key: 'No. It is already more than 90°.' } },
          SUB(180, 66)]
      }
    },

    opposite: {
      watch: 'adding opposite angles to 180°. Opposite angles are equal; angles side by side make 180°.',
      goal: 'I can find the angles where two lines cross.',
      learn: {
        show: { cap: 'opposite angles are equal', eq: ['beside 60°: 180° − 60° = 120°'] },
        together: [Object.assign(SUB(180, 70), { q: 'Two lines cross. One angle is 70°. The angle beside it:' })],
        cue: 'Opposite: the same. Side by side: they make 180°.',
        own: [CR(40), CR(115)]
      },
      p1: {
        show: { eq: ['opposite: equal, beside: 180°'] },
        items: [CR(55), CR(80), CR(130), CR(35)]
      },
      p2: {
        items: [CR(65), CR(100), CR(45), CR(150)]
      },
      p3: {
        items: [CR(72), CR(118),
          CR(90),
          { q: 'Why are opposite angles always equal?', lines: { n: 2, key: 'Each one makes 180° with the same angle between them, so they must be the same size.' } }]
      },
      think: {
        items: [{ q: '{b} says the angle opposite 70° is 110°. What went wrong?', lines: { n: 3, key: '110° is the angle beside it. The opposite angle is equal: 70°.' } },
          { q: 'The four angles where two lines cross add to how much? Why?', lines: { n: 2, key: '360°: they go all the way round the point.' } },
          CR(25)]
      }
    },

    triangle: {
      watch: 'adding to 360° in a triangle. The angles of a triangle always add to 180°.',
      goal: 'I can find a missing angle in a triangle.',
      learn: {
        show: { cap: 'every triangle', eq: ['50° + 60° + 70° = 180°'] },
        together: [MA([45, 75, 60], 2), MS(90, 35)],
        cue: 'Add the two you know. Take them from 180°.',
        own: [MA([30, 110, 40], 1), MS(64, 58)]
      },
      p1: {
        show: { eq: ['180° − 90° − 40° = 50°'] },
        items: [MA([60, 60, 60], 0), MA([90, 30, 60], 2), MS(70, 40), MS(100, 45), MS(55, 55), MS(90, 72)]
      },
      p2: {
        items: [MA([35, 105, 40], 1), MA([20, 80, 80], 0), MS(118, 31), MS(47, 86),
          { q: 'An isosceles triangle has a top angle of 40°. The other two are equal. How big is each?', eq: ['(180° − 40°) ÷ 2 = []°'], a: [70], wide: true }]
      },
      p3: {
        items: [MS(123, 19), MS(66, 67),
          Object.assign(MS(90, 28), { q: 'A right triangle has a 28° angle. The third?' }),
          { q: 'Can a triangle have two obtuse angles? Why?', lines: { n: 2, key: 'No. Two angles over 90° already add to more than 180°.' } }]
      },
      think: {
        items: [{ q: '{b} found a third angle of 200° in a triangle. What went wrong?', lines: { n: 3, key: 'The three angles must add to 180°, so no angle in a triangle can be 180° or more.' } },
          { q: 'Tear the corners off a paper triangle and put them in a row. What do you see? Why?', lines: { n: 3, key: 'They make a straight line: 180°.' } },
          MS(37, 98)]
      }
    },

    trap: {
      watch: 'multiplying all three lengths. Add the two parallel sides, times the height, then halve.',
      goal: 'I can find the area of a trapezoid.',
      learn: {
        show: { pic: ['plane', { kind: 'trap', b: 8, t: 4, h: 3, off: 2, unit: 'cm' }], eq: ['(8 + 4) × 3 ÷ 2', '= 18 cm²'] },
        together: [TF(6, 4, 5), AR('trap', { b: 10, t: 6, h: 4, off: 2 })],
        cue: 'Add the parallel sides. Times the height. Halve it.',
        own: [TF(9, 5, 2), AR('trap', { b: 7, t: 3, h: 6, off: 1 })]
      },
      p1: {
        show: { eq: ['two copies make a parallelogram', 'so halve it'] },
        items: [TF(5, 3, 4), TF(10, 8, 2), TF(12, 6, 3), AR('trap', { b: 9, t: 5, h: 4, off: 2 }), AR('trap', { b: 8, t: 2, h: 5, off: 3 })]
      },
      p2: {
        items: [TF(11, 7, 6), TF(14, 9, 4), AR('trap', { b: 12, t: 8, h: 5, off: 2 }), AR('trap', { b: 6, t: 4, h: 7, off: 1 }),
          { q: 'A garden is a trapezoid with parallel sides 9 m and 5 m, 4 m apart. Its area?', eq: ['(9 + 5) × 4 ÷ 2 = [] m²'], a: [28], wide: true }]
      },
      p3: {
        items: [TF(7.5, 4.5, 4), AR('trap', { b: 15, t: 9, h: 6, off: 3 }),
          { q: 'A ramp side is a trapezoid: 2.4 m and 1.6 m, 1.5 m apart. Its area?', eq: ['(2.4 + 1.6) × 1.5 ÷ 2 = [] m²'], a: [3], wide: true },
          { q: 'Area 30 cm², parallel sides 7 cm and 5 cm. The height?', eq: ['(7 + 5) × [] ÷ 2 = 30'], a: [5] }]
      },
      think: {
        items: [{ q: 'Why do we halve? Draw two copies of a trapezoid to explain.', draw: { h: 70, key: 'Two copies, one turned, make a parallelogram with base (b + t). The trapezoid is half of it.' } },
          { q: '{b} found 8 × 4 × 3 = 96 cm². What went wrong?', lines: { n: 3, key: '{b} multiplied all three. Add the parallel sides: (8 + 4) × 3 ÷ 2 = 18 cm².' } },
          TF(13, 7, 5)]
      }
    },

    kite: {
      watch: 'forgetting to halve. A rhombus or kite is half the rectangle around its diagonals.',
      goal: 'I can find the area of a rhombus or a kite.',
      learn: {
        show: { pic: ['plane', { kind: 'rhom', b: 6, h: 4, unit: 'cm' }], eq: ['6 × 4 ÷ 2 = 12 cm²'] },
        together: [DF(8, 6), AR('kite', { b: 6, h: 10, off: 3 })],
        cue: 'Multiply the diagonals. Halve it.',
        own: [DF(10, 4), AR('rhom', { b: 8, h: 6 })]
      },
      p1: {
        show: { eq: ['the box around it: d1 × d2', 'the shape is half'] },
        items: [DF(6, 6), DF(12, 5), DF(9, 4), AR('rhom', { b: 10, h: 8 }), AR('kite', { b: 4, h: 7, off: 2 })]
      },
      p2: {
        items: [DF(14, 8), DF(7, 6), AR('kite', { b: 8, h: 12, off: 3 }), AR('rhom', { b: 12, h: 9 }),
          { q: 'A kite is 60 cm across and 90 cm tall. How much fabric covers it?', eq: ['60 × 90 ÷ 2 = [] cm²'], a: [2700], wide: true }]
      },
      p3: {
        items: [DF(2.5, 4), AR('kite', { b: 9, h: 14, off: 4 }),
          { q: 'A rhombus has area 24 cm² and one diagonal 8 cm. The other?', eq: ['8 × [] ÷ 2 = 24'], a: [6] },
          { q: 'A sign is a rhombus with diagonals 1.2 m and 0.8 m. Its area?', eq: ['1.2 × 0.8 ÷ 2 = [] m²'], a: [0.48] }]
      },
      think: {
        items: [{ q: 'Why is a kite half of the rectangle around it?', draw: { h: 70, key: 'The diagonals cut the rectangle into 8 triangles; the kite holds 4 of them, one of each matching pair.' } },
          { q: 'A square has diagonals of 10 cm. What is its area? Explain.', lines: { n: 2, key: '50 cm²: 10 × 10 ÷ 2. A square is a rhombus too.' } },
          DF(16, 9)]
      }
    },

    composite: {
      watch: 'counting an overlap twice or missing a part. Split the shape, then add the parts once each.',
      goal: 'I can find the area of a composite shape.',
      learn: {
        show: { cap: 'an L shape: split into two rectangles', eq: ['6 × 2 + 3 × 2 = 18'] },
        together: [CP(cells([[0, 0, 5, 2], [0, 2, 2, 2]]), 6, 4), { eq: ['8 × 3 + 4 × 2 = []'], a: [32] }],
        cue: 'Split into shapes you know. Find each area. Add.',
        own: [CP(cells([[0, 0, 2, 4], [2, 2, 3, 2]]), 6, 4), { eq: ['6 × 4 + 6 × 3 ÷ 2 = []'], a: [33] }]
      },
      p1: {
        show: { eq: ['or: big rectangle − gap'] },
        items: [CP(cells([[0, 0, 6, 2], [2, 2, 2, 2]]), 6, 4), CP(cells([[0, 0, 2, 4], [2, 0, 2, 2], [4, 0, 2, 4]]), 6, 4),
          { eq: ['10 × 6 − 4 × 3 = []'], a: [48] }, { eq: ['5 × 5 + 5 × 2 ÷ 2 = []'], a: [30] }]
      },
      p2: {
        items: [CP(cells([[1, 0, 3, 4], [0, 1, 5, 2]]), 6, 4),
          story('A room is an L: 6 m by 4 m, plus 3 m by 2 m. Its floor area?', 'm²', 30, '6 × 4 + 3 × 2'),
          story('A yard is 12 m by 8 m with a 3 m by 3 m shed. Grass area?', 'm²', 87, '12 × 8 − 3 × 3'),
          { eq: ['(6 + 4) × 3 ÷ 2 + 6 × 2 = []'], a: [27], wide: true }]
      },
      p3: {
        items: [CP(cells([[0, 0, 6, 1], [0, 1, 1, 3], [5, 1, 1, 3], [0, 3, 6, 1]]), 6, 4),
          { q: 'A wall is an 8 m by 5 m rectangle with a triangle on top, 8 m wide and 3 m tall. Its area?', eq: ['8 × 5 + 8 × 3 ÷ 2 = [] m²'], a: [52], wide: true },
          { q: 'Draw a composite shape of a rectangle and a triangle. Find its area.', draw: { h: 80, key: 'For example a 6 × 4 rectangle (24) with a triangle of base 6 and height 2 (6): 30 square units.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Show two ways to split an L shape. Do you get the same area?', draw: { h: 70, key: 'Cut across or cut down: both give the same total.' } },
          { q: 'When is taking away easier than adding parts?', lines: { n: 2, key: 'When the shape is a big rectangle with a piece cut out.' } },
          { eq: ['9 × 7 − 3 × 2 − 2 × 2 = []'], a: [53], wide: true }]
      }
    },

    net: {
      watch: 'calling every 3D object a prism. A prism has 2 matching bases; a pyramid has 1 base and triangles meeting at a point.',
      goal: 'I can describe prisms and pyramids and draw their nets.',
      learn: {
        show: { pic: ['net', { kind: 'box', l: 4, w: 2, h: 3, unit: 'cm' }], cap: 'a box: 6 rectangles' },
        together: [FV('tri')],
        cue: 'Prism: 2 matching bases joined by rectangles. Pyramid: 1 base, triangles to a point.',
        own: [KP('tpyr'), KP('prism')]
      },
      p1: {
        show: { eq: ['2 triangles + 3 rectangles'] },
        items: [FV('prism'), FV('tpyr'), KP('prism'), KP('pyramid')]
      },
      p2: {
        items: [FV('cube'), FV('tri'),
          { q: 'Draw a net of a triangular prism.', draw: { h: 90, key: '3 rectangles in a row, with a triangle on each side of the middle one.' }, wide: true }]
      },
      p3: {
        items: [FV('pyramid'), KP('cube'),
          { q: 'Draw a net of a square-based pyramid.', draw: { h: 90, key: 'A square with a triangle on each of its 4 sides.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a cube has only one net. Is that true?', lines: { n: 2, key: 'No. A cube has 11 different nets.' } },
          { q: 'How are a triangular prism and a triangular pyramid different?', lines: { n: 3, key: 'The prism has 2 triangles joined by 3 rectangles. The pyramid has 4 triangles that meet at a point.' } },
          FV('tpyr')]
      }
    },

    sa: {
      watch: 'adding only the faces you can see. A box has 6 faces: 3 pairs.',
      goal: 'I can find the surface area of a prism.',
      learn: {
        show: { cap: 'a 4 by 3 by 2 box: 3 pairs of faces', eq: ['2 × (12 + 8 + 6) = 52 cm²'] },
        together: [NT({ kind: 'box', l: 5, w: 2, h: 3 })],
        cue: 'Find each face. Faces come in pairs. Add them all.',
        own: [BX(6, 4, 2)]
      },
      p1: {
        show: { eq: ['cube 3 cm: 6 × 9 = 54 cm²'] },
        items: [BX(3, 3, 3), BX(5, 4, 1), NT({ kind: 'box', l: 6, w: 3, h: 2 })]
      },
      p2: {
        items: [BX(10, 5, 4), NT({ kind: 'tprism', b: 6, th: 4, s: 5, l: 8 }),
          { q: 'A cube box has 5 cm edges. How much paper covers it?', eq: ['6 × 5 × 5 = [] cm²'], a: [150] }]
      },
      p3: {
        items: [NT({ kind: 'spyr', b: 4, sh: 5 }), BX(2.5, 2, 4),
          { q: 'A box 30 cm by 20 cm by 10 cm has no lid. How much cardboard?', eq: ['30 × 20 + 2 × 30 × 10 + 2 × 20 × 10 = [] cm²'], a: [1600], wide: true }]
      },
      think: {
        items: [{ q: '{b} added 3 faces of a box: 12 + 8 + 6 = 26 cm². What went wrong?', lines: { n: 3, key: 'A box has 6 faces, in 3 pairs. Double it: 52 cm².' } },
          { q: 'Two boxes hold the same amount. Must they need the same paper? Explain.', lines: { n: 3, key: 'No. A 1 × 1 × 8 box and a 2 × 2 × 2 box both hold 8 cm³ but need 34 cm² and 24 cm².' } },
          BX(7, 3, 2)]
      }
    }
  } });
})();
