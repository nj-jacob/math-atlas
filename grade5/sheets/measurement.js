/* Grade 5 Measurement: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/measurement.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E2.1 choose metric units and estimate with benchmarks; E2.2 convert between metric units; E2.3 angle
   benchmarks; E2.4 measure angles with a protractor; E2.5 the area of parallelograms and triangles; E2.6 area and
   perimeter, and shapes with the same area but different perimeters. The answer checks are in tests/verify/sheets.js:
   a unit or an estimate from the thing's real size (pick.size), a conversion with its units (3.5 m = 350 cm), an
   angle's kind and nearest benchmark from the angle drawn (pick.angle, pick.near), a protractor reading from the
   angle, and an area or perimeter from the shape's base and height. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var F = S.fmt, MU = { mm: 0.001, cm: 0.01, m: 1, km: 1000, g: 1, kg: 1000, mL: 0.001, L: 1 };
  var LEN = ['mm', 'cm', 'm', 'km'], MASS = ['g', 'kg'], CAP = ['mL', 'L'];
  /* the unit that fits a thing whose real size is v metres, grams or litres */
  function UN(q, u, v) {
    var opts = u === 'm' ? LEN : u === 'g' ? MASS : CAP, size = {};
    var fit = u === 'm' ? (v < 0.01 ? 'mm' : v < 1 ? 'cm' : v < 1000 ? 'm' : 'km') : u === 'g' ? (v < 1000 ? 'g' : 'kg') : v < 1 ? 'mL' : 'L';
    size[u] = v;
    return { q: q, pick: { opts: opts, ans: opts.indexOf(fit), size: size } };
  }
  /* the best estimate of the three */
  function ES(q, opts, u, v) {
    var size = {}, d = opts.map(function (o) { var m = o.split(' '); return Math.abs(Math.log(+m[0] * MU[m[1]] / v)); });
    size[u] = v;
    return { q: q, pick: { opts: opts, ans: d.indexOf(Math.min.apply(null, d)), size: size } };
  }
  /* a conversion: n of one unit in another */
  function CV(n, from, to) { return { eq: [F(n) + ' ' + from + ' = [] ' + to], a: [Math.round(n * MU[from] / MU[to] * 1000) / 1000] }; }
  /* is the first amount more than the second? */
  function MORE(x, y) {
    var v = function (s) { var m = s.split(' '); return +m[0] * MU[m[1]]; };
    return { q: 'Is ' + x + ' more than ' + y + '?', pick: { opts: ['yes', 'no'], ans: v(x) > v(y) ? 0 : 1 }, tf: x + ' > ' + y };
  }
  /* angles: name by size; the closest benchmark; read a protractor */
  var KINDS = ['acute', 'right', 'obtuse', 'straight'], BENCH = ['45°', '90°', '135°', '180°'];
  function KN(g, rot) { return { pic: ['angle', { deg: g, rot: rot || 0 }], pick: { opts: KINDS, ans: g < 90 ? 0 : g === 90 ? 1 : g < 180 ? 2 : 3, angle: true } }; }
  function near(g, opts) { var d = opts.map(function (o) { return Math.abs(parseFloat(o) - g); }); return d.indexOf(Math.min.apply(null, d)); }
  function BN(g, rot) { return { pic: ['angle', { deg: g, rot: rot || 0, bench: true }], pick: { opts: BENCH, ans: near(g, BENCH), near: true } }; }
  function EA(g, opts, rot) { return { q: 'About how big?', pic: ['angle', { deg: g, rot: rot || 0, bench: true }], pick: { opts: opts, ans: near(g, opts), near: true } }; }
  function PR(g, from) { return { pic: ['angle', { deg: g, prot: true, from: from }], eq: ['[] °'], a: [g] }; }
  function PS(g, from, flip) { var opts = flip ? [(180 - g) + '°', g + '°'] : [g + '°', (180 - g) + '°']; return { q: 'Which is the angle?', pic: ['angle', { deg: g, prot: true, from: from }], pick: { opts: opts, ans: flip ? 1 : 0, near: true } }; }
  /* area: base × height for a rectangle or parallelogram (the slanted side is there to tempt), half of it for a triangle */
  function PA(b, h, s, off) { return { pic: ['plane', { kind: 'para', b: b, h: h, s: s, off: off }], eq: ['[] × [] = [] cm²'], a: [b, h, b * h] }; }
  function PF(b, h, s, off) { return { pic: ['plane', { kind: 'para', b: b, h: h, s: s, off: off }], eq: ['[] cm²'], a: [b * h] }; }
  function RA(b, h) { return { pic: ['plane', { kind: 'rect', b: b, h: h }], eq: ['[] × [] = [] cm²'], a: [b, h, b * h] }; }
  function TR(b, h, off, s) { return { pic: ['plane', { kind: 'tri', b: b, h: h, off: off, s: s }], eq: ['[] × [] ÷ 2 = [] cm²'], a: [b, h, b * h / 2] }; }
  function TF(b, h, off, s) { return { pic: ['plane', { kind: 'tri', b: b, h: h, off: off, s: s }], eq: ['[] cm²'], a: [b * h / 2] }; }
  /* area and perimeter of a rectangle */
  function AP(b, h) { return { pic: ['plane', { kind: 'rect', b: b, h: h }], eq: ['[] × [] = [] cm²', '2 × (' + b + ' + ' + h + ') = [] cm'], a: [b, h, b * h, 2 * (b + h)] }; }
  function PP(b, h) { return { pic: ['plane', { kind: 'rect', b: b, h: h, ask: 'perim' }], eq: ['[] cm'], a: [2 * (b + h)] }; }
  function story(q, unit, ans, calc, pic) { var o = { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; if (pic) o.pic = pic; return o; }

  S.register('measurement', { code: 'ME', ideas: {
    choose: {
      watch: 'mixing up mass and capacity, or a unit that makes the number huge or tiny. Ask "how heavy, or how much it holds?"',
      goal: 'I can choose a metric unit and estimate with benchmarks.',
      learn: {
        show: { eq: ['fingertip: 1 cm', 'big step: 1 m', 'paper clip: 1 g'] },
        together: [UN('The length of a pencil', 'm', 0.18), UN('The mass of a cat', 'g', 4500)],
        cue: 'Small thing, small unit. Big thing, big unit.',
        own: [UN('The juice in a glass', 'L', 0.25), UN('The trip to the next town', 'm', 12000)]
      },
      p1: {
        show: { eq: ['How long? mm, cm, m, km', 'How heavy? g, kg', 'How much it holds? mL, L'] },
        items: [UN('The thickness of a coin', 'm', 0.002), UN('The height of a door', 'm', 2), UN('The mass of an apple', 'g', 150),
          UN('The water in a bathtub', 'L', 150), UN('The width of a book', 'm', 0.2), UN('The mass of a bag of flour', 'g', 5000)]
      },
      p2: {
        items: [ES('A pencil is about', ['18 mm', '18 cm', '18 m'], 'm', 0.18), ES('A door is about', ['2 cm', '2 m', '2 km'], 'm', 2),
          ES('An apple is about', ['150 g', '150 kg', '15 kg'], 'g', 150), ES('A glass holds about', ['250 mL', '250 L', '25 L'], 'L', 0.25),
          ES('A slice of bread is about', ['30 g', '30 kg', '300 kg'], 'g', 30), ES('A walk to school is about', ['1 km', '1 m', '1 cm'], 'm', 1000)]
      },
      p3: {
        items: [UN('The length of an ant', 'm', 0.004), UN('The mass of a moose', 'g', 450000), UN('Milk in a big jug', 'L', 4),
          ES('A paper clip is about', ['1 g', '1 kg', '10 kg'], 'g', 1), ES('A soccer field is about', ['100 m', '100 cm', '100 km'], 'm', 100),
          ES('A sink holds about', ['10 L', '10 mL', '1000 L'], 'L', 10)]
      },
      think: {
        items: [{ q: '{b} says a cat has a mass of 4 L. What went wrong?', lines: { n: 3, key: 'L is for how much a container holds. Mass is in g or kg: about 4 kg.' } },
          { q: 'Name something you would measure in millimetres. Why?', lines: { n: 3, key: 'Something very thin or tiny, like a coin\'s thickness or an ant: cm would give a part of 1.' } },
          ES('Your hand span is about', ['15 cm', '15 mm', '15 m'], 'm', 0.15)]
      }
    },

    convert: {
      watch: 'dividing when going to a smaller unit (3 m = 0.03 cm). Smaller units mean more of them.',
      goal: 'I can change a bigger unit into a smaller one.',
      learn: {
        show: { eq: ['1 m = 100 cm', '3 m = 300 cm'] },
        together: [CV(4, 'm', 'cm'), CV(2, 'kg', 'g')],
        cue: 'Bigger unit to smaller unit: multiply.',
        own: [CV(5, 'L', 'mL'), CV(3, 'km', 'm')]
      },
      p1: {
        show: { eq: ['km to m: × 1000', 'm to cm: × 100', 'cm to mm: × 10'] },
        items: [CV(7, 'm', 'cm'), CV(6, 'cm', 'mm'), CV(9, 'kg', 'g'), CV(4, 'L', 'mL'), CV(8, 'km', 'm'), { eq: ['25 × 100 = []'], a: [2500] }]
      },
      p2: {
        show: { eq: ['2.5 m = 250 cm'] },
        items: [CV(2.5, 'm', 'cm'), CV(1.75, 'L', 'mL'), CV(3.6, 'km', 'm'), CV(0.8, 'kg', 'g'), CV(4.5, 'cm', 'mm'), { eq: ['1 m 25 cm = [] cm'], a: [125] }]
      },
      p3: {
        items: [CV(2, 'km', 'cm'), CV(0.35, 'm', 'mm'), MORE('3 m', '250 cm'), MORE('1.2 kg', '1500 g'),
          story('A ribbon 2.4 m long (1 m = 100 cm) is cut into 6 equal pieces. How long is each piece?', 'cm', 40, '2.4 × 100 ÷ 6'),
          story('{b} runs 2.5 km. How many metres is that? (1 km = 1000 m)', 'm', 2500, '2.5 × 1000')]
      },
      think: {
        items: [{ q: '{b} says 3 m = 0.03 cm. What went wrong?', lines: { n: 3, key: 'Bigger unit to smaller unit: multiply. 3 × 100 = 300 cm.' } },
          { q: 'Why does 5 kg become a bigger number in grams?', lines: { n: 3, key: 'A gram is much smaller, so it takes 1000 of them for each kg: 5000 g.' } },
          CV(1.05, 'km', 'm')]
      }
    },

    bench: {
      watch: 'judging an angle by how long its arms are. The size is the turn between the arms.',
      goal: 'I can estimate an angle with 45°, 90°, 135° and 180°.',
      learn: {
        show: { pic: ['angle', { deg: 45, bench: true }], cap: 'half a square corner', eq: ['45°'] },
        together: [KN(60, 10), BN(130)],
        cue: 'Compare with a square corner.',
        own: [KN(150, 20), BN(40, 30)]
      },
      p1: {
        items: [KN(30), KN(90, 15), KN(120), KN(70, 40), KN(180), KN(160, 10)]
      },
      p2: {
        items: [BN(50), BN(100, 10), BN(140), BN(170), BN(30, 20), BN(80, 30)]
      },
      p3: {
        items: [EA(60, ['20°', '60°', '120°']), EA(110, ['70°', '110°', '160°'], 20), EA(20, ['20°', '90°', '150°'], 40),
          { q: 'Draw an obtuse angle.', draw: { h: 70, key: 'Two arms opened wider than a square corner, but less than a straight line.' } }]
      },
      think: {
        items: [{ q: '{b} says an angle with long arms is bigger than one with short arms. Is that right?', lines: { n: 3, key: 'No. The size is the turn between the arms, not how long they are.' } },
          { q: 'How can a square corner help you estimate 135°?', lines: { n: 3, key: '135° is a square corner and a half: 90° + 45°.' } },
          BN(140, 25)]
      }
    },

    protractor: {
      watch: 'reading the wrong scale (60° for 120°). Estimate first: is it wider than a square corner?',
      goal: 'I can measure an angle with a protractor.',
      learn: {
        show: { pic: ['angle', { deg: 120, prot: true }], cap: 'start at the 0 on the first arm: 120°' },
        together: [PR(40)],
        cue: 'Centre on the corner. Count from 0.',
        own: [PR(60, 'left')]
      },
      p1: {
        show: { eq: ['arm on the right: inner scale', 'arm on the left: outer scale'] },
        items: [PR(40), PR(100), PR(60, 'left'), PR(140, 'left')]
      },
      p2: {
        items: [PR(50), PR(130, 'left'), PR(110), PR(70, 'left')]
      },
      p3: {
        items: [PS(30), PS(150, null, true), PS(80, 'left', true), PS(120, 'left')]
      },
      think: {
        items: [{ q: '{b} read 60° for this angle. What went wrong?', pic: ['angle', { deg: 120, prot: true }], lines: { n: 2, key: '{b} used the wrong scale. Count from the 0 on the first arm: 120°.' } },
          { q: 'Why estimate before you measure?', lines: { n: 3, key: 'To catch the wrong scale: an angle wider than a square corner must be more than 90°.' } }]
      }
    },

    para: {
      watch: 'using the slanted side instead of the height. The height meets the base at a square corner.',
      goal: 'I can find the area of a parallelogram.',
      learn: {
        show: { pic: ['plane', { kind: 'para', b: 9, h: 4, s: 5 }], eq: ['9 × 4 = 36 cm²'] },
        together: [PA(7, 5, 6), RA(8, 3)],
        cue: 'Base × height. The height is dashed.',
        own: [PA(6, 4, 5), PA(10, 3, 4)]
      },
      p1: {
        show: { eq: ['A = base × height'] },
        items: [RA(6, 4), PA(8, 3, 4), PA(5, 4, 5, 2), RA(9, 2), PA(7, 6, 7), PA(12, 5, 6, 3)]
      },
      p2: {
        items: [PF(9, 7, 8), PF(11, 4, 5), PF(6, 6, 7, 2), PF(15, 3, 4, 4),
          { q: 'Area 48 cm², base 8 cm. Find the height.', eq: ['48 ÷ 8 = [] cm'], a: [6] },
          { q: 'Area 56 cm², height 7 cm. Find the base.', eq: ['56 ÷ 7 = [] cm'], a: [8] }]
      },
      p3: {
        items: [story('A garden bed is a parallelogram with base 12 m and height 5 m. Its slanted side is 7 m. What is its area?', 'm²', 60, '12 × 5'),
          story('A tile is a parallelogram: base 4 cm, height 3 cm. How much area do 10 tiles cover?', 'cm²', 120, '4 × 3 × 10'),
          PF(2.5, 4, 5), { q: 'Area 45 cm², base 9 cm. Find the height.', eq: ['45 ÷ 9 = [] cm'], a: [5] }]
      },
      think: {
        items: [{ q: '{b} found 9 × 5 = 45 cm². What went wrong?', pic: ['plane', { kind: 'para', b: 9, h: 4, s: 5 }], lines: { n: 2, key: '{b} used the slanted side. Use the height: 9 × 4 = 36 cm².' } },
          { q: 'A rectangle and a parallelogram have the same base and height. Compare their areas.', lines: { n: 3, key: 'They are the same: cut the triangle off one end and slide it across to make the rectangle.' } }]
      }
    },

    triangle: {
      watch: 'forgetting to halve. Two copies of the triangle make a parallelogram.',
      goal: 'I can find the area of a triangle.',
      learn: {
        show: { pic: ['plane', { kind: 'tri', b: 9, h: 4, off: 3 }], eq: ['9 × 4 ÷ 2 = 18 cm²'] },
        together: [TR(10, 6, 4), TR(8, 3, 2)],
        cue: 'Base × height, then halve.',
        own: [TR(6, 5, 3), TR(12, 4, 8)]
      },
      p1: {
        show: { eq: ['A = base × height ÷ 2'] },
        items: [TR(8, 5, 3), TR(6, 4, 2), TR(10, 3, 6), TR(7, 4, 3), TR(9, 6, 5), TR(4, 4, 1)]
      },
      p2: {
        items: [TF(12, 5, 4, 6), TF(9, 8, 3, 9), TF(14, 3, 9), TF(5, 6, 2, 6),
          { q: 'Area 24 cm², base 8 cm. Find the height.', eq: ['24 × 2 ÷ 8 = [] cm'], a: [6] },
          { q: 'Area 15 cm², height 5 cm. Find the base.', eq: ['15 × 2 ÷ 5 = [] cm'], a: [6] }]
      },
      p3: {
        items: [story('A sail is a triangle with base 4 m and height 6 m. What is its area?', 'm²', 12, '4 × 6 ÷ 2', ['plane', { kind: 'tri', b: 4, h: 6, off: 0, unit: 'm' }]),
          { q: 'Triangle A: base 6 cm, height 4 cm. Triangle B: base 5 cm, height 6 cm. Which has more area?', pick: { opts: ['A', 'B'], ans: 1, more: ['6 × 4', '5 × 6'] } },
          TF(7, 5, 2), TF(11, 4, 7, 5)]
      },
      think: {
        items: [{ q: '{b} says this triangle\'s area is 40 cm². What went wrong?', pic: ['plane', { kind: 'tri', b: 10, h: 4, off: 3 }], lines: { n: 2, key: '{b} forgot to halve. 10 × 4 ÷ 2 = 20 cm².' } },
          { q: 'Why is a triangle half of a parallelogram?', lines: { n: 3, key: 'Two copies of the triangle, one turned over, fit together into a parallelogram with the same base and height.' } }]
      }
    },

    'inside-around': {
      watch: 'mixing up area and perimeter, or writing cm for area. Area is cm², perimeter is cm.',
      goal: 'I can find the area and perimeter of a rectangle.',
      learn: {
        show: { pic: ['plane', { kind: 'rect', b: 4, h: 3 }], eq: ['4 × 3 = 12 cm²', '4 + 3 + 4 + 3 = 14 cm'] },
        together: [AP(5, 2)],
        cue: 'Area: squares inside. Perimeter: all the way around.',
        own: [AP(6, 3)]
      },
      p1: {
        show: { eq: ['4 × 3 = 12 cm²', '2 × (4 + 3) = 14 cm'] },
        items: [AP(4, 2), AP(7, 3), AP(5, 5), AP(8, 1)]
      },
      p2: {
        items: [PP(9, 4), PP(6, 6), PP(10, 2), PP(7, 5), RA(9, 4), RA(10, 2)]
      },
      p3: {
        items: [story('A rug is 3 m by 2 m. How much trim goes around its edge?', 'm', 10, '3 + 2 + 3 + 2'),
          story('A rug is 3 m by 2 m. How much floor does it cover?', 'm²', 6, '3 × 2'),
          story('A square photo has sides of 12 cm. How much frame goes around it?', 'cm', 48, '12 + 12 + 12 + 12'),
          story('A field is 80 m by 50 m. How much grass is there?', 'm²', 4000, '80 × 50')]
      },
      think: {
        items: [{ q: '{b} says a 5 cm by 2 cm rectangle has a perimeter of 10 cm². What went wrong?', lines: { n: 3, key: 'That is the area (5 × 2 = 10 cm²). The perimeter goes around: 5 + 2 + 5 + 2 = 14 cm.' } },
          { q: 'You are putting a fence around a yard. Do you need its area or its perimeter? Why?', lines: { n: 3, key: 'Perimeter: the fence goes around the edge.' } }]
      }
    },

    'same-area': {
      watch: 'thinking the same area means the same perimeter. Long, thin shapes need more fence.',
      goal: 'I can show that the same area can have different perimeters.',
      learn: {
        show: { cap: 'each has an area of 24 cm²', eq: ['12 by 2: 28 cm around', '6 by 4: 20 cm around'] },
        together: [{ q: 'An 8 cm by 3 cm rectangle.', eq: ['8 × 3 = [] cm²', '2 × (8 + 3) = [] cm'], a: [24, 22] }],
        cue: 'Closer to a square: less around.',
        own: [{ q: 'A 24 cm by 1 cm rectangle.', eq: ['24 × 1 = [] cm²', '2 × (24 + 1) = [] cm'], a: [24, 50] }]
      },
      p1: {
        items: [{ q: 'Rectangles with area 12 cm²: 1 by 12, 2 by 6, 3 by 4. Find each perimeter.', eq: ['2 × (1 + 12) = [] cm', '2 × (2 + 6) = [] cm', '2 × (3 + 4) = [] cm'], a: [26, 16, 14], wide: true },
          { q: 'Which needs the least fence? 1 m by 12 m, 2 m by 6 m or 3 m by 4 m.', pick: { opts: ['1 by 12', '2 by 6', '3 by 4'], ans: 2, less: ['1 + 12', '2 + 6', '3 + 4'] } },
          { q: 'Which needs the most fence? 1 m by 12 m, 2 m by 6 m or 3 m by 4 m.', pick: { opts: ['1 by 12', '2 by 6', '3 by 4'], ans: 0, more: ['1 + 12', '2 + 6', '3 + 4'] } },
          { q: 'Rectangles with area 16 cm²: 1 by 16, 2 by 8, 4 by 4. Find each perimeter.', eq: ['2 × (1 + 16) = [] cm', '2 × (2 + 8) = [] cm', '2 × (4 + 4) = [] cm'], a: [34, 20, 16], wide: true }]
      },
      p2: {
        items: [{ q: 'Rectangles with area 18 cm²: 1 by 18, 2 by 9, 3 by 6. Find each perimeter.', eq: ['2 × (1 + 18) = [] cm', '2 × (2 + 9) = [] cm', '2 × (3 + 6) = [] cm'], a: [38, 22, 18], wide: true },
          { q: 'A rectangle has area 20 cm² and is 5 cm long. How wide? Its perimeter?', eq: ['20 ÷ 5 = [] cm', '2 × (5 + []) = [] cm'], a: [4, 4, 18] },
          { q: 'A rectangle has area 20 cm² and is 10 cm long. How wide? Its perimeter?', eq: ['20 ÷ 10 = [] cm', '2 × (10 + []) = [] cm'], a: [2, 2, 24] }]
      },
      p3: {
        items: [{ q: 'Each garden has an area of 36 m²: 9 m by 4 m, 12 m by 3 m and 6 m by 6 m. Which needs the least fence?', pick: { opts: ['9 by 4', '12 by 3', '6 by 6'], ans: 2, less: ['9 + 4', '12 + 3', '6 + 6'] }, wide: true },
          { q: 'Perimeter of the 6 m by 6 m garden:', eq: ['2 × (6 + 6) = [] m'], a: [24] },
          { q: 'Perimeter of the 12 m by 3 m garden:', eq: ['2 × (12 + 3) = [] m'], a: [30] },
          { q: 'Draw two rectangles with an area of 16 squares and different perimeters.', draw: { h: 80, key: 'For example 4 by 4 (perimeter 16) and 8 by 2 (perimeter 20), or 16 by 1 (perimeter 34).' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says two rectangles with the same area must have the same perimeter. Is that right?', lines: { n: 3, key: 'No. 12 by 2 and 6 by 4 both have area 24 cm², but perimeters 28 cm and 20 cm.' } },
          { q: 'You have 36 m² of lawn to fence. Which shape uses the least fence? Why?', lines: { n: 3, key: 'A 6 m by 6 m square: 24 m. The closer to a square, the less fence.' } }]
      }
    }
  } });
})();
