/* Grade 8 Measurement: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/measurement.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names.
   Ontario 2020: E2.3 circumference and area of circles, composite shapes, volume and surface area of prisms and
   cylinders, capacity; E2.4 the Pythagorean relationship; B1.3 roots that are not whole. π is used as 3.14 on the sheets.
   The answer checks are in tests/verify/sheets.js: a right triangle's sides must fit a² + b² = c² (rtri), the side
   marked "?" is the answer, "is it a right triangle?" is worked out from the sides (right), and every area, volume and
   surface area is worked out again from the measures in the picture. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var Q = S.q;
  /* the hypotenuse, or a leg, of a right triangle */
  function HY(a, b) { var c = Math.sqrt(a * a + b * b); return { pic: ['rtri', { a: a, b: b, c: c, ask: 'c' }], q: 'Find the hypotenuse.', eq: ['√(' + a + '² + ' + b + '²) = [] cm'], a: [c] }; }
  function LG(a, b) { var c = Math.sqrt(a * a + b * b); return { pic: ['rtri', { a: a, b: b, c: c, ask: 'b' }], q: 'Find the missing leg.', eq: ['√(' + S.fmt(c) + '² − ' + a + '²) = [] cm'], a: [b] }; }
  /* a hypotenuse that is not whole, to one decimal place */
  function HR(a, b) { var c = Math.sqrt(a * a + b * b); return { pic: ['rtri', { a: a, b: b, c: c, ask: 'c' }], q: 'Find the hypotenuse to 1 decimal place.', eq: ['√(' + a + '² + ' + b + '²) ≈ [] cm'], a: [+c.toFixed(1)] }; }
  function LR(c, a) { var b = Math.sqrt(c * c - a * a); return { pic: ['rtri', { a: a, b: b, c: c, ask: 'b' }], q: 'Find the missing leg to 1 decimal place.', eq: ['√(' + c + '² − ' + a + '²) ≈ [] cm'], a: [+b.toFixed(1)] }; }
  function RT(s) { var t = s.slice().sort(function (x, y) { return x - y; }), ok = t[0] * t[0] + t[1] * t[1] === t[2] * t[2]; return { q: 'Sides ' + s.join(', ') + ' cm. A right triangle?', eq: [t[0] + '² + ' + t[1] + '² = []', t[2] + '² = []'], a: [t[0] * t[0] + t[1] * t[1], t[2] * t[2]], pick: { opts: ['yes', 'no'], ans: ok ? 0 : 1, right: s }, pickLast: true }; }
  /* from a picture: q, the sum to work out, the unit */
  function PI(pic, q, calc, unit, dp) { var v = S.calc(calc); return { pic: pic, q: q, eq: ['[] ' + unit], a: [dp != null ? +v.toFixed(dp) : v], calc: calc, dp: dp }; }
  function ST(q, calc, unit, dp) { var v = S.calc(calc); if (/3\.14/.test(calc)) q += ' Use π ≈ 3.14.'; return { q: q, eq: ['[]' + (unit ? ' ' + unit : '')], a: [dp != null ? +v.toFixed(dp) : v], calc: calc, dp: dp }; }
  function CI(r, what) { return what === 'C' ? PI(['circ', { r: r }], 'Circumference?', '2 × 3.14 × ' + r, 'cm') : PI(['circ', { r: r }], 'Area?', '3.14 × ' + r + ' × ' + r, 'cm²'); }
  function CD(d, what) { return what === 'C' ? PI(['circ', { d: d }], 'Circumference?', '3.14 × ' + d, 'cm') : PI(['circ', { d: d }], 'Area?', '3.14 × (' + d + ' ÷ 2) × (' + d + ' ÷ 2)', 'cm²'); }

  S.register('measurement', { code: 'MS', ideas: {

    sides: {
      watch: 'calling the longest leg the hypotenuse. The hypotenuse is across from the right angle.',
      goal: 'I can name the legs and the hypotenuse.',
      learn: {
        show: { pic: ['rtri', { a: 8, b: 6, c: 10 }], cap: 'across from the right angle: the hypotenuse, 10 cm' },
        together: [{ q: 'Which side is the hypotenuse? Write its length.', pic: ['rtri', { a: 12, b: 5, c: 13 }], eq: ['[] cm'], a: [13], is: 13 }],
        cue: 'The hypotenuse faces the right angle. It is always the longest side.',
        own: [{ q: 'Legs 9 and 12, hypotenuse 15. Longest side?', eq: ['[] cm'], a: [15], calc: '15' }, Q('6² + 8²')]
      },
      p1: {
        show: { cap: 'the legs make the right angle', eq: ['3² + 4² = 5²'] },
        items: [Q('3² + 4²'), Q('5² + 12²'), Q('8² + 15²'), Q('7² + 24²'), Q('9²'), Q('13²')]
      },
      p2: {
        items: [Q('9² + 12²'), Q('15²'), Q('20² + 21²'), Q('29²'), Q('1.5² + 2²'), Q('2.5²')]
      },
      p3: {
        items: [Q('12² + 16²'), Q('20²'), Q('10² + 24²'), Q('26²'), Q('0.6² + 0.8²'), Q('11² + 60²')]
      },
      think: {
        items: [{ q: 'Why is the hypotenuse the longest side?', lines: { n: 3, key: 'It faces the biggest angle, 90°, and the longest side is always across from the biggest angle.' } },
          { q: 'Can a triangle with an obtuse angle have a hypotenuse? Explain.', lines: { n: 2, key: 'No. Only right triangles have one.' } },
          Q('16² + 30²'),
          { q: 'Draw a right triangle and label the legs and the hypotenuse.', draw: { h: 70, key: 'A right triangle: the two sides of the square corner are legs; the slanted side is the hypotenuse.' } }]
      }
    },

    squares: {
      watch: 'adding the sides instead of their squares. The areas of the squares on the legs add to the square on the hypotenuse.',
      goal: 'I can show the Pythagorean relationship with squares.',
      learn: {
        show: { cap: 'squares on the sides of a 3-4-5 triangle', eq: ['9 + 16 = 25'] },
        together: [{ q: 'Squares on the legs are 36 cm² and 64 cm². Square on the hypotenuse?', eq: ['36 + 64 = [] cm²'], a: [100] }],
        cue: 'Leg square + leg square = hypotenuse square.',
        own: [{ q: 'Leg squares 25 and 144. Hypotenuse square?', eq: ['25 + 144 = [] cm²'], a: [169] }, { q: 'Hypotenuse square 100, one leg square 36. The other?', eq: ['100 − 36 = [] cm²'], a: [64] }]
      },
      p1: {
        show: { eq: ['a² + b² = c²'] },
        items: [{ eq: ['81 + 144 = []'], a: [225] }, { eq: ['49 + 576 = []'], a: [625] }, { eq: ['169 − 25 = []'], a: [144] }, { eq: ['289 − 64 = []'], a: [225] },
          { q: 'Squares 16 and 9. The hypotenuse square?', eq: ['16 + 9 = [] cm²'], a: [25] }, { q: 'Side of a 49 cm² square, in cm?', eq: ['√49 = []'], a: [7] }]
      },
      p2: {
        items: [{ eq: ['√(36 + 64) = []'], a: [10] }, { eq: ['√(225 − 81) = []'], a: [12] }, { eq: ['√(64 + 225) = []'], a: [17] }, { eq: ['√(841 − 400) = []'], a: [21] },
          { q: 'Do squares of 20, 30 and 50 cm² fit a right triangle?', eq: ['20 + 30 = []'], a: [50] }]
      },
      p3: {
        items: [{ eq: ['√(0.36 + 0.64) = []'], a: [1] }, { eq: ['√(2.25 + 4) = []'], a: [2.5] }, { eq: ['√(1600 + 900) = []'], a: [50] },
          { q: 'The hypotenuse square is 74 cm², a leg square 25 cm². The other leg?', eq: ['√(74 − 25) = [] cm'], a: [7] }]
      },
      think: {
        items: [{ q: 'Explain the Pythagorean relationship with squares.', lines: { n: 3, key: 'Draw a square on each side. The two smaller squares together have the same area as the biggest.' } },
          { q: 'Does it work for a triangle with no right angle?', lines: { n: 2, key: 'No. Only for right triangles.' } },
          { eq: ['√(144 + 256) = []'], a: [20] },
          { q: 'Sketch squares on a 3-4-5 triangle.', draw: { h: 80, key: 'Squares of 9, 16 and 25 squares on the sides.' } }]
      }
    },

    hyp: {
      watch: 'stopping at c². Take the square root at the end.',
      goal: 'I can find the hypotenuse.',
      learn: {
        show: { cap: 'legs 8 and 6', eq: ['√(8² + 6²) = √100 = 10 cm'] },
        together: [HY(4, 3)],
        cue: 'Square both legs, add, then take the square root.',
        own: [HY(12, 5)]
      },
      p1: {
        show: { eq: ['c = √(a² + b²)'] },
        items: [HY(8, 6), HY(15, 8), HY(24, 7), HY(12, 9)]
      },
      p2: {
        items: [HY(16, 12), HY(21, 20), HY(40, 9), HY(2, 1.5)]
      },
      p3: {
        items: [HY(24, 10), HY(36, 15), ST('A ladder: its foot is 2.1 m from a wall and it reaches 2.8 m up. How long is it?', '√(2.1² + 2.8²)', 'm'),
          ST('A park is 60 m by 80 m. How long is the path from corner to corner?', '√(60² + 80²)', 'm')]
      },
      think: {
        items: [{ q: '{a} says the hypotenuse of a 3, 4 triangle is 7. Explain.', lines: { n: 3, key: '{a} added the sides. 3² + 4² = 25, √25 = 5.' } },
          { q: 'Why is the hypotenuse shorter than the two legs added?', lines: { n: 2, key: 'A straight path is the shortest way between two points.' } },
          HY(9, 12),
          { q: 'Where would a builder use this?', lines: { n: 1, key: 'For example the length of a roof rafter or a ramp.' } }]
      }
    },

    leg: {
      watch: 'adding when a leg is missing. Subtract: leg² = hypotenuse² − other leg².',
      goal: 'I can find a missing leg.',
      learn: {
        show: { cap: 'hypotenuse 13, leg 5', eq: ['√(13² − 5²) = √144 = 12 cm'] },
        together: [LG(6, 8)],
        cue: 'Hypotenuse squared minus the known leg squared. Then the root.',
        own: [LG(9, 12)]
      },
      p1: {
        show: { eq: ['b = √(c² − a²)'] },
        items: [LG(3, 4), LG(5, 12), LG(8, 15), LG(7, 24)]
      },
      p2: {
        items: [LG(20, 21), LG(9, 40), LG(12, 16), LG(1.5, 2)]
      },
      p3: {
        items: [LG(10, 24), ST('A 5 m ladder has its foot 1.4 m from a wall. How high does it reach?', '√(5² − 1.4²)', 'm'),
          ST('A TV screen is 100 cm across the diagonal and 60 cm high. How wide is it?', '√(100² − 60²)', 'cm'), LG(15, 36)]
      },
      think: {
        items: [{ q: 'Why subtract to find a leg?', lines: { n: 3, key: 'The hypotenuse square is the two leg squares together; take one away to leave the other.' } },
          { q: '{a} added 13² + 5² to find a leg. What happens?', lines: { n: 2, key: 'The answer, about 13.9, is longer than the hypotenuse, which is impossible.' } },
          LG(16, 30),
          { q: 'Check your last answer.', lines: { n: 1, key: '16² + 30² = 256 + 900 = 1156 = 34².' } }]
      }
    },

    test: {
      watch: 'testing with the sides in any order. The longest side must be the one on its own.',
      goal: 'I can test if a triangle is a right triangle.',
      learn: {
        show: { cap: 'sides 6, 8, 10', eq: ['36 + 64 = 100 = 10²', 'yes, right'] },
        together: [RT([5, 12, 13])],
        cue: 'Square the two shorter sides and add. Compare with the longest squared.',
        own: [RT([4, 5, 6])]
      },
      p1: {
        show: { eq: ['equal: right', 'not equal: not right'] },
        items: [RT([9, 12, 15]), RT([6, 7, 9]), RT([8, 15, 17]), RT([10, 11, 15])]
      },
      p2: {
        items: [RT([7, 24, 25]), RT([12, 13, 18]), RT([20, 21, 29]), RT([9, 10, 14])]
      },
      p3: {
        items: [RT([15, 36, 39]), RT([11, 60, 61]), RT([14, 48, 51]), RT([30, 40, 50])]
      },
      think: {
        items: [{ q: 'How can a carpenter check a corner is square with a tape measure?', lines: { n: 3, key: 'Mark 3 m and 4 m along the two sides; the diagonal should be 5 m.' } },
          { q: 'If a² + b² is more than c², what kind of angle is opposite c?', lines: { n: 2, key: 'Acute: smaller than a right angle.' } },
          RT([16, 30, 34]),
          { q: 'Find a right triangle with whole-number sides.', lines: { n: 1, key: 'For example 6, 8, 10 or 5, 12, 13.' } }]
      }
    },

    round: {
      exp: ['E2.4', 'B1.3'],
      watch: 'rounding too early. Keep the full number until the square root, then round.',
      goal: 'I can find sides that are not whole numbers.',
      learn: {
        show: { cap: 'legs 4 and 7', eq: ['√(16 + 49) = √65 ≈ 8.1'] },
        together: [HR(5, 3)],
        cue: 'Work it out exactly. Round only at the end.',
        own: [HR(6, 4)]
      },
      p1: {
        show: { eq: ['√50 is between 7 and 8', '√50 ≈ 7.1'] },
        items: [HR(2, 3), HR(7, 5), HR(10, 4), HR(9, 6)]
      },
      p2: {
        items: [LR(8, 3), LR(10, 7), HR(12, 5.5), LR(15, 9.5)]
      },
      p3: {
        items: [HR(11, 8), LR(20, 13),
          ST('A square room is 4 m wide. How long is its diagonal, to 1 decimal place?', '√(4² + 4²)', 'm', 1),
          ST('A 6 m ramp rises 1.5 m. How far along the ground, to 1 decimal place?', '√(6² − 1.5²)', 'm', 1)]
      },
      think: {
        items: [{ q: 'Why not round 4² + 7² before the root?', lines: { n: 2, key: 'It is exact: 65. Rounding early can change the answer.' } },
          { q: 'Between which two whole numbers is √65?', lines: { n: 1, key: '8 and 9: 8² = 64 and 9² = 81.' } },
          HR(3, 3),
          { q: 'Why is a square\'s diagonal never a whole number when its side is?', lines: { n: 3, key: 'It is the side × √2, and √2 is irrational.' } }]
      }
    },

    parts: {
      watch: 'mixing up radius and diameter. The diameter goes all the way across: it is 2 radii.',
      goal: 'I can use radius, diameter and circumference.',
      learn: {
        show: { pic: ['circ', { r: 5 }], cap: 'radius 5 cm', eq: ['diameter = 10 cm'] },
        together: [{ q: 'Radius 7 cm. Diameter?', eq: ['2 × 7 = [] cm'], a: [14] }],
        cue: 'd = 2r. C = π × d. Use π ≈ 3.14.',
        own: [{ q: 'Diameter 18 cm. Radius?', eq: ['18 ÷ 2 = [] cm'], a: [9] }, { q: 'C ÷ d is about?', eq: ['31.4 ÷ 10 = []'], a: [3.14] }]
      },
      p1: {
        show: { eq: ['C ÷ d = π ≈ 3.14'] },
        items: [{ eq: ['2 × 12.5 = []'], a: [25] }, { eq: ['30 ÷ 2 = []'], a: [15] }, { eq: ['62.8 ÷ 20 = []'], a: [3.14] }, { eq: ['3.14 × 10 = []'], a: [31.4] },
          { q: 'A wheel has a radius of 35 cm. Diameter?', eq: ['2 × 35 = [] cm'], a: [70] }, { q: 'A plate is 26 cm across. Radius?', eq: ['26 ÷ 2 = [] cm'], a: [13] }]
      },
      p2: {
        items: [ST('A circle has C = 47.1 cm. What is its diameter?', '47.1 ÷ 3.14', 'cm'), ST('C = 25.12 m. What is the diameter?', '25.12 ÷ 3.14', 'm'),
          ST('C = 94.2 cm. What is the radius?', '94.2 ÷ 3.14 ÷ 2', 'cm'), { eq: ['3.14 × 2.5 = []'], a: [7.85] }]
      },
      p3: {
        items: [ST('A track is a circle with C = 400 m. What is its diameter, to the nearest metre?', '400 ÷ 3.14', 'm', 0),
          ST('A tree trunk measures 157 cm around. How wide is it?', '157 ÷ 3.14', 'cm'), ST('A coin has C = 8.164 cm. What is its radius?', '8.164 ÷ 3.14 ÷ 2', 'cm')]
      },
      think: {
        items: [{ q: 'What is π?', lines: { n: 2, key: 'The number of diameters that fit around any circle: about 3.14.' } },
          { q: 'How could you find π with a can and a string?', lines: { n: 3, key: 'Wrap the string around to measure C, measure across for d, and divide C by d.' } },
          ST('C = 69.08 cm. What is the diameter?', '69.08 ÷ 3.14', 'cm'),
          { q: 'Is π a rational number? Explain.', lines: { n: 2, key: 'No. Its decimals never end or repeat; 3.14 is only an estimate.' } }]
      }
    },

    circum: {
      watch: 'using the radius in C = π × d. With a radius, use C = 2 × π × r.',
      goal: 'I can find the circumference of a circle.',
      learn: {
        show: { pic: ['circ', { r: 4 }], eq: ['2 × 3.14 × 4 = 25.12 cm'] },
        together: [CI(5, 'C')],
        cue: 'C = π × d, or 2 × π × r. Use π ≈ 3.14.',
        own: [CD(10, 'C'), CI(3, 'C')]
      },
      p1: {
        show: { pic: ['circ', { d: 8 }], eq: ['3.14 × 8 = 25.12 cm'] },
        items: [CI(2, 'C'), CI(6, 'C'), CD(12, 'C'), CD(7, 'C')]
      },
      p2: {
        items: [CI(15, 'C'), CD(25, 'C'), CI(2.5, 'C'), CD(0.5, 'C')]
      },
      p3: {
        items: [ST('A bike wheel is 70 cm across. How far does it roll in one turn?', '3.14 × 70', 'cm'),
          ST('A wheel 70 cm across turns 100 times. How far does it roll, in metres?', '3.14 × 70 × 100 ÷ 100', 'm'),
          ST('A round garden has a radius of 3 m. Fencing costs $12 a metre. Cost?', '2 × 3.14 × 3 × 12', 'dollars'),
          ST('A half circle has a diameter of 10 cm. Its curved edge?', '3.14 × 10 ÷ 2', 'cm')]
      },
      think: {
        items: [{ q: 'Why are C = π × d and C = 2 × π × r the same?', lines: { n: 2, key: 'Because d = 2r.' } },
          { q: 'If you double the radius, what happens to the circumference?', lines: { n: 2, key: 'It doubles too.' } },
          CI(9, 'C'),
          { q: '{a} found C = 3.14 × 5 for a radius of 5. Explain.', lines: { n: 2, key: 'That uses the radius as the diameter. C = 3.14 × 10 = 31.4.' } }]
      }
    },

    area: {
      watch: 'multiplying π by the diameter for area. Area = π × r × r.',
      goal: 'I can find the area of a circle.',
      learn: {
        show: { pic: ['circ', { r: 5 }], eq: ['3.14 × 5 × 5 = 78.5 cm²'] },
        together: [CI(3, 'A')],
        cue: 'Area = π × r². Halve a diameter first.',
        own: [CI(10, 'A'), CD(4, 'A')]
      },
      p1: {
        show: { eq: ['d = 8: r = 4', '3.14 × 4 × 4 = 50.24'] },
        items: [CI(2, 'A'), CI(4, 'A'), CI(6, 'A'), CD(10, 'A')]
      },
      p2: {
        items: [CI(7, 'A'), CD(20, 'A'), CI(1.5, 'A'), CD(9, 'A')]
      },
      p3: {
        items: [ST('A round rug has a radius of 1.2 m. Its area?', '3.14 × 1.2 × 1.2', 'm²', 4),
          ST('A pizza is 30 cm across. Its area?', '3.14 × (30 ÷ 2) × (30 ÷ 2)', 'cm²'),
          ST('A ring: a 5 cm circle with a 3 cm hole (radii). The ring\'s area?', '3.14 × 5 × 5 − 3.14 × 3 × 3', 'cm²'),
          ST('A half circle has a radius of 6 cm. Its area?', '3.14 × 6 × 6 ÷ 2', 'cm²')]
      },
      think: {
        items: [{ q: 'How does doubling the radius change the area?', lines: { n: 2, key: 'It is 4 times as big: 2 × 2.' } },
          { q: 'One 30 cm pizza or two 20 cm pizzas? Which is more pizza?', lines: { n: 3, key: '3.14 × 15² ≈ 706.5 cm² for one; 2 × 3.14 × 10² = 628 cm² for two. One big pizza.' } },
          CI(8, 'A'),
          { q: 'Why does circle area use r × r?', lines: { n: 2, key: 'Cut the circle into thin slices: they make a near-rectangle of π × r by r.' } }]
      }
    },

    split: {
      watch: 'adding the whole outside rectangle. Split into shapes you know, then add, or take away the missing part.',
      goal: 'I can find the area of composite shapes.',
      learn: {
        show: { cap: 'a 10 m by 6 m rectangle with a 4 m by 3 m corner cut off', eq: ['10 × 6 − 4 × 3 = 48 m²'] },
        together: [PI(['comp', { kind: 'L', w: 8, h: 5, cw: 3, ch: 2, unit: 'm' }], 'Area?', '8 × 5 − 3 × 2', 'm²')],
        cue: 'Split into rectangles, triangles and circles. Add, or take away.',
        own: [PI(['comp', { kind: 'semi', w: 10, h: 6, unit: 'cm' }], 'Area? (rectangle + half circle)', '10 × 6 + 3.14 × 5 × 5 ÷ 2', 'cm²')]
      },
      p1: {
        show: { eq: ['rectangle + half circle', '10 × 6 + 3.14 × 5² ÷ 2'] },
        items: [PI(['comp', { kind: 'L', w: 12, h: 8, cw: 5, ch: 4, unit: 'm' }], 'Area?', '12 × 8 − 5 × 4', 'm²'), PI(['comp', { kind: 'L', w: 9, h: 7, cw: 4, ch: 3, unit: 'cm' }], 'Area?', '9 × 7 − 4 × 3', 'cm²'),
          PI(['comp', { kind: 'semi', w: 8, h: 5, unit: 'cm' }], 'Area?', '8 × 5 + 3.14 × 4 × 4 ÷ 2', 'cm²'), PI(['comp', { kind: 'semi', w: 6, h: 10, unit: 'm' }], 'Area?', '6 × 10 + 3.14 × 3 × 3 ÷ 2', 'm²')]
      },
      p2: {
        items: [PI(['comp', { kind: 'L', w: 15, h: 10, cw: 6, ch: 7, unit: 'm' }], 'Area?', '15 × 10 − 6 × 7', 'm²'), PI(['comp', { kind: 'semi', w: 12, h: 4, unit: 'cm' }], 'Area?', '12 × 4 + 3.14 × 6 × 6 ÷ 2', 'cm²'),
          ST('A rectangle 10 m by 4 m with a triangle of base 10 m and height 3 m on top (triangle: b × h ÷ 2). Area?', '10 × 4 + 10 × 3 ÷ 2', 'm²'),
          ST('A square of side 8 cm with a circle of radius 2 cm cut out. Area left?', '8 × 8 − 3.14 × 2 × 2', 'cm²')]
      },
      p3: {
        items: [PI(['comp', { kind: 'L', w: 7.5, h: 6, cw: 2.5, ch: 4, unit: 'm' }], 'Area?', '7.5 × 6 − 2.5 × 4', 'm²'), PI(['comp', { kind: 'semi', w: 20, h: 15, unit: 'm' }], 'Area?', '20 × 15 + 3.14 × 10 × 10 ÷ 2', 'm²'),
          ST('A running track: a 100 m by 60 m rectangle with a half circle of radius 30 m at each end. Area?', '100 × 60 + 3.14 × 30 × 30', 'm²')]
      },
      think: {
        items: [{ q: 'Show two ways to split an L shape.', draw: { h: 70, key: 'Cut across to make two rectangles, or cut down; or take the corner from a big rectangle.' } },
          { q: 'When is taking away easier than adding?', lines: { n: 2, key: 'When the shape is a simple shape with a piece missing.' } },
          PI(['comp', { kind: 'L', w: 11, h: 9, cw: 5, ch: 5, unit: 'm' }], 'Area?', '11 × 9 − 5 × 5', 'm²'),
          { q: 'Why does every way give the same area?', lines: { n: 2, key: 'The shape covers the same space however you split it.' } }]
      }
    },

    perim: {
      watch: 'adding the inside cut lines. Perimeter is only the outside edge.',
      goal: 'I can find the perimeter of composite shapes.',
      learn: {
        show: { cap: 'an L shape has the same perimeter as its full rectangle', eq: ['10 + 6 + 10 + 6 = 32 m'] },
        together: [PI(['comp', { kind: 'L', w: 8, h: 5, cw: 3, ch: 2, unit: 'm' }], 'Perimeter?', '8 + 5 + 8 + 5', 'm')],
        cue: 'Walk round the outside only. Curved parts are part of a circumference.',
        own: [PI(['comp', { kind: 'semi', w: 10, h: 6, unit: 'cm' }], 'Perimeter?', '10 + 6 + 6 + 3.14 × 10 ÷ 2', 'cm')]
      },
      p1: {
        show: { eq: ['half circle edge: 3.14 × d ÷ 2'] },
        items: [PI(['comp', { kind: 'L', w: 12, h: 8, cw: 5, ch: 4, unit: 'm' }], 'Perimeter?', '12 + 8 + 12 + 8', 'm'), PI(['comp', { kind: 'L', w: 9, h: 7, cw: 4, ch: 3, unit: 'cm' }], 'Perimeter?', '9 + 7 + 9 + 7', 'cm'),
          PI(['comp', { kind: 'semi', w: 8, h: 5, unit: 'cm' }], 'Perimeter?', '8 + 5 + 5 + 3.14 × 8 ÷ 2', 'cm'), PI(['comp', { kind: 'semi', w: 6, h: 10, unit: 'm' }], 'Perimeter?', '6 + 10 + 10 + 3.14 × 6 ÷ 2', 'm')]
      },
      p2: {
        items: [PI(['comp', { kind: 'semi', w: 12, h: 4, unit: 'cm' }], 'Perimeter?', '12 + 4 + 4 + 3.14 × 12 ÷ 2', 'cm'),
          ST('A half circle with a diameter of 10 cm: curved edge plus the straight edge?', '3.14 × 10 ÷ 2 + 10', 'cm'),
          ST('A quarter circle of radius 4 cm: curved edge plus two radii?', '2 × 3.14 × 4 ÷ 4 + 4 + 4', 'cm'),
          ST('A square of side 5 m. What is its perimeter?', '5 + 5 + 5 + 5', 'm')]
      },
      p3: {
        items: [ST('A running track: two 100 m straights and two half circles of diameter 60 m. Its length?', '2 × 100 + 3.14 × 60', 'm'),
          ST('A garden: a 6 m by 4 m rectangle with a half circle on one 4 m end. Fence length?', '6 + 6 + 4 + 3.14 × 4 ÷ 2', 'm'),
          ST('Edging costs $3.50 a metre. How much for 22.28 m?', '22.28 × 3.50', 'dollars')]
      },
      think: {
        items: [{ q: 'Why does an L shape have the same perimeter as the full rectangle?', lines: { n: 3, key: 'The cut moves two edges inwards, but they have the same total length.' } },
          { q: 'Can two shapes with the same area have different perimeters?', lines: { n: 2, key: 'Yes. A 2 by 8 and a 4 by 4 both have area 16, but perimeters 20 and 16.' } },
          PI(['comp', { kind: 'L', w: 11, h: 9, cw: 5, ch: 5, unit: 'm' }], 'Perimeter?', '11 + 9 + 11 + 9', 'm'),
          { q: 'Give a real reason to find a perimeter.', lines: { n: 1, key: 'For example fencing, edging or a picture frame.' } }]
      }
    },

    prism: {
      watch: 'using any face as the base. The base is the face that is the same all the way through.',
      goal: 'I can find volume as base area times height.',
      learn: {
        show: { pic: ['rbox', { l: 8, w: 5, h: 3 }], eq: ['8 × 5 × 3 = 120 cm³'] },
        together: [PI(['rbox', { l: 6, w: 4, h: 5 }], 'Volume?', '6 × 4 × 5', 'cm³')],
        cue: 'Area of the base × the height (length) of the prism.',
        own: [PI(['tprism', { b: 6, h: 4, l: 10 }], 'Volume?', '6 × 4 ÷ 2 × 10', 'cm³')]
      },
      p1: {
        show: { eq: ['triangle base: 6 × 4 ÷ 2 = 12', '12 × 10 = 120 cm³'] },
        items: [PI(['rbox', { l: 10, w: 3, h: 4 }], 'Volume?', '10 × 3 × 4', 'cm³'), PI(['rbox', { l: 7, w: 7, h: 7 }], 'Volume?', '7 × 7 × 7', 'cm³'),
          PI(['tprism', { b: 8, h: 3, l: 12 }], 'Volume?', '8 × 3 ÷ 2 × 12', 'cm³'), PI(['tprism', { b: 5, h: 6, l: 9 }], 'Volume?', '5 × 6 ÷ 2 × 9', 'cm³')]
      },
      p2: {
        items: [PI(['rbox', { l: 2.5, w: 4, h: 6 }], 'Volume?', '2.5 × 4 × 6', 'cm³'), PI(['tprism', { b: 10, h: 7, l: 15 }], 'Volume?', '10 × 7 ÷ 2 × 15', 'cm³'),
          ST('A prism has a base area of 45 cm² and is 12 cm long. Volume?', '45 × 12', 'cm³'),
          ST('A box is 120 cm³. Its base is 6 cm by 5 cm. How tall?', '120 ÷ (6 × 5)', 'cm')]
      },
      p3: {
        items: [PI(['tprism', { b: 1.5, h: 2, l: 8 }], 'Volume?', '1.5 × 2 ÷ 2 × 8', 'm³'),
          ST('A tent is a triangular prism: base 3 m, height 2 m, length 4 m. Volume?', '3 × 2 ÷ 2 × 4', 'm³'),
          ST('A pool is 25 m by 10 m by 2 m. Volume?', '25 × 10 × 2', 'm³'), ST('A 360 cm³ prism has a base of 24 cm². Length?', '360 ÷ 24', 'cm')]
      },
      think: {
        items: [{ q: 'Why does base × height work for every prism?', lines: { n: 3, key: 'A prism is the same base stacked layer on layer, so you multiply the base by the number of layers.' } },
          { q: 'Which face is the base of a triangular prism?', lines: { n: 2, key: 'A triangle: it is the same all the way through.' } },
          PI(['rbox', { l: 12, w: 5, h: 2 }], 'Volume?', '12 × 5 × 2', 'cm³'),
          { q: 'Two boxes have volume 60 cm³. Give their sizes.', lines: { n: 1, key: 'For example 3 × 4 × 5 and 2 × 5 × 6.' } }]
      }
    },

    cyl: {
      watch: 'using the diameter in π × r². Halve it first.',
      goal: 'I can find the volume of a cylinder.',
      learn: {
        show: { pic: ['cyl', { r: 3, h: 10 }], eq: ['3.14 × 3² × 10 = 282.6 cm³'] },
        together: [PI(['cyl', { r: 2, h: 5 }], 'Volume?', '3.14 × 2 × 2 × 5', 'cm³')],
        cue: 'Circle area (π × r²) × height.',
        own: [PI(['cyl', { r: 5, h: 4 }], 'Volume?', '3.14 × 5 × 5 × 4', 'cm³')]
      },
      p1: {
        show: { eq: ['base: 3.14 × 2 × 2 = 12.56', '× 5 = 62.8 cm³'] },
        items: [PI(['cyl', { r: 1, h: 10 }], 'Volume?', '3.14 × 1 × 1 × 10', 'cm³'), PI(['cyl', { r: 4, h: 6 }], 'Volume?', '3.14 × 4 × 4 × 6', 'cm³'),
          PI(['cyl', { r: 10, h: 2 }], 'Volume?', '3.14 × 10 × 10 × 2', 'cm³'), PI(['cyl', { r: 3, h: 3 }], 'Volume?', '3.14 × 3 × 3 × 3', 'cm³')]
      },
      p2: {
        items: [PI(['cyl', { r: 2.5, h: 8 }], 'Volume?', '3.14 × 2.5 × 2.5 × 8', 'cm³'), PI(['cyl', { r: 6, h: 1.5 }], 'Volume?', '3.14 × 6 × 6 × 1.5', 'cm³'),
          ST('A can is 10 cm across and 12 cm tall. Volume?', '3.14 × (10 ÷ 2) × (10 ÷ 2) × 12', 'cm³'), ST('A pipe has a radius of 0.5 m and is 20 m long. Volume?', '3.14 × 0.5 × 0.5 × 20', 'm³')]
      },
      p3: {
        items: [ST('A round pool is 6 m across and 1.5 m deep. Volume?', '3.14 × (6 ÷ 2) × (6 ÷ 2) × 1.5', 'm³'),
          ST('A cylinder has base area 50 cm² and holds 600 cm³. How tall?', '600 ÷ 50', 'cm'),
          ST('A tank 2 m across and 3 m tall. Volume, to 1 decimal place?', '3.14 × 1 × 1 × 3', 'm³', 1)]
      },
      think: {
        items: [{ q: 'How is a cylinder like a prism?', lines: { n: 2, key: 'It has the same base (a circle) all the way up, so V = base area × height.' } },
          { q: 'Double the radius: what happens to the volume?', lines: { n: 2, key: 'It becomes 4 times as big, because r is squared.' } },
          PI(['cyl', { r: 7, h: 10 }], 'Volume?', '3.14 × 7 × 7 × 10', 'cm³'),
          { q: 'Which holds more: r = 2, h = 8 or r = 4, h = 2?', lines: { n: 2, key: 'They are the same: 3.14 × 4 × 8 = 3.14 × 16 × 2 = 100.48 cm³.' } }]
      }
    },

    litres: {
      watch: 'mixing cm³ and L. 1000 cm³ = 1 L, and 1 cm³ = 1 mL.',
      goal: 'I can change volume to capacity.',
      learn: {
        show: { cap: 'a 10 cm cube holds 1 L', eq: ['1000 cm³ = 1 L', '1 m³ = 1000 L'] },
        together: [ST('A box is 20 cm by 10 cm by 15 cm. How many litres does it hold?', '20 × 10 × 15 ÷ 1000', 'L')],
        cue: 'cm³ ÷ 1000 = L. m³ × 1000 = L.',
        own: [{ q: '2500 cm³ in L?', eq: ['2500 ÷ 1000 = []'], a: [2.5] }, { q: '3 m³ in L?', eq: ['3 × 1000 = []'], a: [3000] }]
      },
      p1: {
        show: { eq: ['1 cm³ = 1 mL'] },
        items: [{ q: '4000 cm³ in L?', eq: ['4000 ÷ 1000 = []'], a: [4] }, { q: '750 cm³ in mL?', eq: ['750 × 1 = []'], a: [750] }, { q: '0.5 m³ in L?', eq: ['0.5 × 1000 = []'], a: [500] }, { q: '1.2 L in cm³?', eq: ['1.2 × 1000 = []'], a: [1200] },
          ST('A tank is 50 cm by 40 cm by 30 cm. Litres?', '50 × 40 × 30 ÷ 1000', 'L'), ST('A carton is 7 cm by 7 cm by 20 cm. mL?', '7 × 7 × 20', 'mL')]
      },
      p2: {
        items: [ST('A pool is 25 m by 10 m by 2 m. Litres?', '25 × 10 × 2 × 1000', 'L'), ST('A can: radius 4 cm, height 10 cm. mL?', '3.14 × 4 × 4 × 10', 'mL'),
          ST('A 2 L bottle fills cups of 250 mL. How many cups?', '2 × 1000 ÷ 250', 'cups'), { q: '0.08 m³ in L?', eq: ['0.08 × 1000 = []'], a: [80] }]
      },
      p3: {
        items: [ST('A fish tank 60 cm by 30 cm by 40 cm is filled to 35 cm. Litres?', '60 × 30 × 35 ÷ 1000', 'L'),
          ST('A water tank: radius 1 m, height 2 m. Litres?', '3.14 × 1 × 1 × 2 × 1000', 'L'),
          ST('A bathtub holds 0.24 m³. A shower uses 60 L. How many showers is one bath?', '0.24 × 1000 ÷ 60', 'showers')]
      },
      think: {
        items: [{ q: 'Why is 1 m³ equal to 1000 L?', lines: { n: 3, key: '1 m³ is 100 × 100 × 100 = 1 000 000 cm³, and every 1000 cm³ is 1 L.' } },
          { q: 'Where might you need to change m³ to litres?', lines: { n: 2, key: 'For example filling a pool or a rain barrel.' } },
          ST('A box 25 cm by 20 cm by 10 cm. Litres?', '25 × 20 × 10 ÷ 1000', 'L'),
          { q: 'Volume or capacity: what is the difference?', lines: { n: 2, key: 'Volume is the space taken up; capacity is how much a container holds.' } }]
      }
    },

    net: {
      watch: 'counting only 3 faces of a box. A box has 6 faces, in 3 matching pairs.',
      goal: 'I can find the surface area of a prism from its net.',
      learn: {
        show: { cap: 'an 8 cm by 5 cm by 3 cm box', eq: ['2 × (40 + 24 + 15) = 158 cm²'] },
        together: [PI(['rbox', { l: 4, w: 3, h: 2 }], 'Surface area?', '2 × (4 × 3 + 4 × 2 + 3 × 2)', 'cm²')],
        cue: 'Find each face once. Double, because each has a twin.',
        own: [PI(['rbox', { l: 5, w: 5, h: 5 }], 'Surface area? A cube has 6 faces.', '6 × 5 × 5', 'cm²')]
      },
      p1: {
        show: { eq: ['cube: 6 × side × side'] },
        items: [PI(['rbox', { l: 6, w: 4, h: 3 }], 'Surface area?', '2 × (6 × 4 + 6 × 3 + 4 × 3)', 'cm²'), PI(['rbox', { l: 10, w: 2, h: 5 }], 'Surface area?', '2 × (10 × 2 + 10 × 5 + 2 × 5)', 'cm²'),
          PI(['rbox', { l: 3, w: 3, h: 3 }], 'Surface area? A cube has 6 faces.', '6 × 3 × 3', 'cm²'), PI(['rbox', { l: 8, w: 6, h: 1 }], 'Surface area?', '2 × (8 × 6 + 8 × 1 + 6 × 1)', 'cm²')]
      },
      p2: {
        items: [PI(['tprism', { b: 6, h: 4, l: 10 }], 'Surface area? (slanted sides 5 cm)', '2 × 6 × 4 ÷ 2 + 6 × 10 + 2 × 5 × 10', 'cm²'),
          PI(['rbox', { l: 2.5, w: 2, h: 4 }], 'Surface area?', '2 × (2.5 × 2 + 2.5 × 4 + 2 × 4)', 'cm²'),
          ST('A gift box is 30 cm by 20 cm by 10 cm. How much paper covers it?', '30 × 20 + 30 × 20 + 30 × 10 + 30 × 10 + 20 × 10 + 20 × 10', 'cm²')]
      },
      p3: {
        items: [PI(['tprism', { b: 8, h: 3, l: 12 }], 'Surface area? (slanted sides 5 cm)', '2 × 8 × 3 ÷ 2 + 8 × 12 + 2 × 5 × 12', 'cm²'),
          ST('A room is 5 m by 4 m by 2.5 m. Paint the 4 walls only. Area?', '5 × 2.5 + 5 × 2.5 + 4 × 2.5 + 4 × 2.5', 'm²'),
          ST('Paint covers 10 m² a can. How many cans for 45 m²? (round up)', '45 ÷ 10', 'cans', 0)]
      },
      think: {
        items: [{ q: 'Sketch a net of a box.', draw: { h: 80, key: 'Six rectangles in a cross shape: a top, bottom, front, back and two ends.' } },
          { q: 'Why find surface area?', lines: { n: 2, key: 'To know how much wrapping, paint or material covers a solid.' } },
          PI(['rbox', { l: 9, w: 4, h: 2 }], 'Surface area?', '2 × (9 × 4 + 9 × 2 + 4 × 2)', 'cm²'),
          { q: 'Can two boxes with the same volume have different surface areas?', lines: { n: 2, key: 'Yes. A long thin box has more surface than a cube of the same volume.' } }]
      }
    },

    cylsa: {
      watch: 'forgetting the curved side. Unrolled, it is a rectangle: circumference by height.',
      goal: 'I can find the surface area of a cylinder.',
      learn: {
        show: { cap: 'r = 3, h = 10: two circles and the curved side', eq: ['56.52 + 188.4 = 244.92 cm²'] },
        together: [PI(['cyl', { r: 2, h: 5 }], 'Surface area?', '2 × 3.14 × 2 × 2 + 2 × 3.14 × 2 × 5', 'cm²')],
        cue: 'Two circles + a rectangle (2 × π × r by h).',
        own: [PI(['cyl', { r: 1, h: 4 }], 'Surface area?', '2 × 3.14 × 1 × 1 + 2 × 3.14 × 1 × 4', 'cm²')]
      },
      p1: {
        show: { eq: ['curved side: 2 × 3.14 × r × h'] },
        items: [PI(['cyl', { r: 5, h: 10 }], 'Surface area?', '2 × 3.14 × 5 × 5 + 2 × 3.14 × 5 × 10', 'cm²'), PI(['cyl', { r: 4, h: 6 }], 'Surface area?', '2 × 3.14 × 4 × 4 + 2 × 3.14 × 4 × 6', 'cm²'),
          PI(['cyl', { r: 10, h: 2 }], 'Curved side only?', '2 × 3.14 × 10 × 2', 'cm²'), PI(['cyl', { r: 3, h: 3 }], 'Surface area?', '2 × 3.14 × 3 × 3 + 2 × 3.14 × 3 × 3', 'cm²')]
      },
      p2: {
        items: [PI(['cyl', { r: 2.5, h: 8 }], 'Surface area?', '2 × 3.14 × 2.5 × 2.5 + 2 × 3.14 × 2.5 × 8', 'cm²'),
          ST('A can label goes around a can 8 cm across and 11 cm tall. Label area?', '3.14 × 8 × 11', 'cm²'),
          ST('An open-top can: radius 3 cm, height 10 cm. Area of metal?', '3.14 × 3 × 3 + 2 × 3.14 × 3 × 10', 'cm²')]
      },
      p3: {
        items: [ST('A round tank, radius 2 m, height 3 m, is painted outside, top and sides only. Area?', '3.14 × 2 × 2 + 2 × 3.14 × 2 × 3', 'm²'),
          ST('A paper tube is 4 cm across and 30 cm long, with open ends. Paper?', '3.14 × 4 × 30', 'cm²'),
          ST('A drum: radius 0.3 m, height 0.9 m. Surface area, to 2 decimal places?', '2 × 3.14 × 0.3 × 0.3 + 2 × 3.14 × 0.3 × 0.9', 'm²', 2)]
      },
      think: {
        items: [{ q: 'Why is the curved side a rectangle when unrolled?', lines: { n: 3, key: 'Cut down the side and flatten it: its width is the circle\'s circumference and its length is the height.' } },
          { q: 'When would you leave out a circle?', lines: { n: 2, key: 'For an open container, like a cup or a can with no lid.' } },
          PI(['cyl', { r: 6, h: 5 }], 'Surface area?', '2 × 3.14 × 6 × 6 + 2 × 3.14 × 6 × 5', 'cm²'),
          { q: 'Sketch the net of a cylinder.', draw: { h: 80, key: 'A rectangle with a circle above and below it.' } }]
      }
    }

  } });
})();
