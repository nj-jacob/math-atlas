/* Grade 7 Circles and Volume: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/circles-volume.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E2.1 a litre is a 10 cm cube (1 cm³ = 1 mL); E2.2 square and cubic units; E2.3 radius, diameter and
   circumference; E2.4 draw circles; E2.5 the area of a circle; E2.6 the surface area of a cylinder from its net; E2.7 the
   volume of prisms and cylinders, and a missing measure. π is 3.14. The answer checks are in tests/verify/sheets.js:
   every sum is worked out again, and a story's numbers must be in the question or the picture. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function rd(x) { return Math.round(x * 1e4) / 1e4; }
  /* the same question with no picture: the measure goes in the question */
  function bare(it, q) { delete it.pic; it.q = q; it.wide = false; return it; }
  /* a circle: diameter from radius, radius from diameter */
  function DR(r) { return { pic: ['circ', { r: r, show: 'r', unit: 'cm' }], q: 'Diameter?', eq: ['2 × ' + r + ' = [] cm'], a: [2 * r] }; }
  function RD(d) { return { pic: ['circ', { d: d, show: 'd', unit: 'cm' }], q: 'Radius?', eq: [d + ' ÷ 2 = [] cm'], a: [d / 2] }; }
  /* circumference from the diameter, or from the radius */
  function CD(d, unit) { return { pic: ['circ', { d: d, show: 'd', unit: unit || 'cm', ask: 'C' }], eq: ['3.14 × ' + d + ' = [] ' + (unit || 'cm')], a: [rd(3.14 * d)] }; }
  function CR(r, unit) { return { pic: ['circ', { r: r, show: 'r', unit: unit || 'cm', ask: 'C' }], eq: ['3.14 × 2 × ' + r + ' = [] ' + (unit || 'cm')], a: [rd(3.14 * 2 * r)] }; }
  /* area from the radius, or from the diameter (halve it first) */
  function AR(r, unit) { return { pic: ['circ', { r: r, show: 'r', unit: unit || 'cm', ask: 'A' }], eq: ['3.14 × ' + r + ' × ' + r + ' = [] ' + (unit || 'cm') + '²'], a: [rd(3.14 * r * r)] }; }
  function AD(d, unit) { var r = d / 2; return { pic: ['circ', { d: d, show: 'd', unit: unit || 'cm', ask: 'A' }], eq: [d + ' ÷ 2 = []', '3.14 × [] × [] = []'], a: [r, r, r, rd(3.14 * r * r)], wide: true }; }
  /* around (circumference) or inside (area) */
  function AI(q, around) { return { q: q, pick: { opts: ['circumference', 'area'], ans: around ? 0 : 1, around: true }, wide: true }; }
  /* volume of a box, a triangular prism and a cylinder */
  function VB(l, w, h) { return { pic: ['prism', { l: l, w: w, h: h, ask: 'V' }], eq: [l + ' × ' + w + ' × ' + h + ' = [] cm³'], a: [rd(l * w * h)] }; }
  function VT(b, th, l) { return { pic: ['prism', { tri: true, b: b, th: th, l: l, ask: 'V' }], eq: [b + ' × ' + th + ' ÷ 2 = [] cm²', '[] × ' + l + ' = [] cm³'], a: [b * th / 2, b * th / 2, rd(b * th / 2 * l)] }; }
  function VC(r, h) { return { pic: ['cyl', { r: r, h: h, show: 'r', ask: 'V' }], eq: ['3.14 × ' + r + ' × ' + r + ' = [] cm²', '[] × ' + h + ' = [] cm³'], a: [rd(3.14 * r * r), rd(3.14 * r * r), rd(3.14 * r * r * h)] }; }
  /* surface area of a cylinder from its net */
  function SA(r, h) {
    var c = rd(2 * 3.14 * r * r), s = rd(2 * 3.14 * r * h);
    return { pic: ['cnet', { r: r, h: h }], eq: ['2 × 3.14 × ' + r + ' × ' + r + ' = []', '2 × 3.14 × ' + r + ' × ' + h + ' = []', '[] + [] = [] cm²'], a: [c, s, c, s, rd(c + s)] };
  }
  function story(q, unit, ans, calc, more) { var it = { q: q, eq: ['[] ' + unit], a: [ans], calc: calc, know: [2, 3.14, 1000, 10000, 1000000], wide: true }; return more ? Object.assign(it, more) : it; }

  S.register('circles-volume', { code: 'CV', ideas: {

    parts: {
      watch: 'using the diameter where the radius is needed (or the other way round). Ask: centre to edge, or all the way across?',
      goal: 'I can find the radius and diameter of a circle.',
      learn: {
        show: { pic: ['circ', { r: 4, show: 'r', unit: 'cm' }], cap: 'centre to edge: radius', eq: ['diameter = 2 × 4 = 8 cm'] },
        together: [DR(6), RD(14)],
        cue: 'Diameter = 2 radii.',
        own: [bare(DR(9), 'Radius 9 cm. Diameter?'), bare(RD(30), 'Diameter 30 cm. Radius?')]
      },
      p1: {
        show: { cap: 'radius 7 cm', eq: ['diameter 14 cm'] },
        items: [DR(3), RD(10), bare(DR(12), 'Radius 12 cm. Diameter?'), bare(RD(26), 'Diameter 26 cm. Radius?'), bare(DR(2.5), 'Radius 2.5 cm. Diameter?'), bare(RD(9), 'Diameter 9 cm. Radius?')]
      },
      p2: {
        items: [{ eq: ['2 × 45 = [] cm'], a: [90] }, { eq: ['3.6 ÷ 2 = [] m'], a: [1.8] }, { eq: ['2 × 0.75 = [] m'], a: [1.5] }, { eq: ['125 ÷ 2 = [] mm'], a: [62.5] },
          { q: 'Which circle is wider: radius 9 cm (2 × 9 across) or diameter 16 cm?', pick: { opts: ['radius 9 cm', 'diameter 16 cm'], ans: 0, more: ['2 × 9', '16'] }, wide: true }]
      },
      p3: {
        items: [story('A bike wheel has a diameter of 66 cm. What is its radius?', 'cm', 33, '66 ÷ 2'),
          story('A round pond has a radius of 4.5 m. How far is it straight across?', 'm', 9, '2 × 4.5'),
          story('A pizza is 36 cm across. How far is it from the centre to the crust?', 'cm', 18, '36 ÷ 2')]
      },
      think: {
        items: [{ q: '{b} says a circle with a radius of 5 cm is 5 cm across. What went wrong?', lines: { n: 3, key: 'The radius goes from the centre to the edge. Across is the diameter: 10 cm.' } },
          { q: 'How many radii fit along a diameter?', lines: { n: 1, key: 'Two.' } },
          DR(7.5)]
      }
    },

    pi: {
      watch: 'multiplying the radius by π and forgetting to double it. Write d = 2r first.',
      goal: 'I can find the circumference of a circle.',
      learn: {
        show: { pic: ['circ', { d: 10, show: 'd', unit: 'cm' }], cap: 'around = π × across', eq: ['3.14 × 10 = 31.4 cm'] },
        together: [CD(5), CR(3)],
        cue: 'C = 3.14 × diameter.',
        own: [bare(CD(20), 'd = 20 cm'), bare(CR(10), 'r = 10 cm')]
      },
      p1: {
        show: { eq: ['d = 8 cm: 3.14 × 8 = 25.12 cm'] },
        items: [CD(6), CD(15), bare(CD(2), 'd = 2 cm'), bare(CD(12), 'd = 12 cm'), bare(CD(30), 'd = 30 cm'), bare(CD(100), 'd = 100 cm')]
      },
      p2: {
        items: [CR(4), CR(7), bare(CR(25), 'r = 25 cm'), bare(CR(1.5), 'r = 1.5 cm')]
      },
      p3: {
        items: [story('A bike wheel is 70 cm across. How far does it roll in one turn?', 'cm', 219.8, '3.14 × 70'),
          story('A round garden has a radius of 3 m. How much fencing goes around it?', 'm', 18.84, '3.14 × 2 × 3'),
          story('A circle has a circumference of 62.8 cm. What is its diameter?', 'cm', 20, '62.8 ÷ 3.14')]
      },
      think: {
        items: [{ q: '{a} found the circumference of a circle with radius 5 cm as 3.14 × 5. What went wrong?', lines: { n: 3, key: 'C = π × diameter. The diameter is 10 cm, so C = 31.4 cm.' } },
          { q: 'Why is the circumference always a bit more than 3 times the diameter?', lines: { n: 3, key: 'π is about 3.14: the distance around is 3.14 times the distance across, for every circle.' } },
          CD(50)]
      }
    },

    compass: {
      watch: 'opening the compass to the diameter, which draws a circle twice as wide.',
      goal: 'I can draw a circle with a compass.',
      learn: {
        show: { cap: 'diameter 8 cm: compass width = radius', eq: ['8 ÷ 2 = 4 cm'] },
        together: [{ q: 'Diameter 10 cm. Open the compass to:', eq: ['10 ÷ 2 = [] cm'], a: [5] }, { q: 'Radius 3 cm. Open the compass to:', eq: ['[] cm'], a: [3], calc: '3' }],
        cue: 'The compass width is the radius.',
        own: [{ q: 'Diameter 7 cm. Open the compass to:', eq: ['7 ÷ 2 = [] cm'], a: [3.5] }, { q: 'Draw a circle with radius 2 cm.', draw: { h: 110, key: 'A circle 4 cm across, with its centre marked.' } }]
      },
      p1: {
        show: { cap: 'radius 2.5 cm', eq: ['open to 2.5 cm'] },
        items: [{ q: 'Diameter 6 cm. Open to:', eq: ['6 ÷ 2 = [] cm'], a: [3] }, { q: 'Diameter 11 cm. Open to:', eq: ['11 ÷ 2 = [] cm'], a: [5.5] },
          { q: 'Diameter 9 cm. Open to:', eq: ['9 ÷ 2 = [] cm'], a: [4.5] }, { q: 'Diameter 4 cm. Open to:', eq: ['4 ÷ 2 = [] cm'], a: [2] },
          { q: 'Draw a circle with diameter 6 cm. Mark the centre and a radius.', draw: { h: 150, key: 'Compass open to 3 cm; centre marked; one radius drawn and labelled 3 cm.' }, wide: true }]
      },
      p2: {
        items: [{ q: 'Draw two circles with the same centre: radius 2 cm and radius 3 cm.', draw: { h: 170, key: 'Two circles, one inside the other, with the same centre: 4 cm and 6 cm across.' }, wide: true },
          { q: 'What is the gap between the two circles?', eq: ['3 − 2 = [] cm'], a: [1] }]
      },
      p3: {
        items: [{ q: 'Draw a circle with radius 3 cm. Keep the compass the same and step it around the edge 6 times. Join the marks.', draw: { h: 180, key: 'A regular hexagon inside the circle: each side is 3 cm, the same as the radius.' }, wide: true },
          { q: 'Each side of the hexagon is as long as the radius, 3 cm. How long is the hexagon all the way around?', eq: ['6 × 3 = [] cm'], a: [18] }]
      },
      think: {
        items: [{ q: '{b} wanted a 10 cm wide circle and opened the compass to 10 cm. What went wrong?', lines: { n: 3, key: 'The compass width is the radius. Open it to 5 cm.' } },
          { q: 'Why does every point on the circle sit the same distance from the centre?', lines: { n: 2, key: 'The compass keeps the same width all the way around.' } }]
      }
    },

    slices: {
      watch: 'computing π × r × 2 (the circumference idea) instead of π × r × r.',
      goal: 'I can find the area of a circle.',
      learn: {
        show: { pic: ['circ', { r: 5, show: 'r', unit: 'cm' }], cap: 'slices make a near rectangle: half the circumference by r', eq: ['3.14 × 5 × 5 = 78.5 cm²'] },
        together: [AR(3), AR(10)],
        cue: 'A = 3.14 × r × r.',
        own: [bare(AR(4), 'r = 4 cm'), bare(AD(12), 'd = 12 cm')]
      },
      p1: {
        show: { cap: 'r = 2 cm', eq: ['3.14 × 2 × 2 = 12.56 cm²'] },
        items: [AR(6), AR(7), bare(AR(1), 'r = 1 cm'), bare(AR(20), 'r = 20 cm')]
      },
      p2: {
        items: [AD(8), bare(AD(10), 'd = 10 cm'), bare(AR(2.5), 'r = 2.5 cm'), bare(AR(1.5, 'm'), 'r = 1.5 m')]
      },
      p3: {
        items: [story('A round rug has a radius of 2 m. What is its area?', 'm²', 12.56, '3.14 × 2 × 2'),
          story('A pizza is 30 cm across. What is its area?', 'cm²', 706.5, '3.14 × (30 ÷ 2) × (30 ÷ 2)'),
          story('A sprinkler waters a circle 8 m across. What area does it water?', 'm²', 50.24, '3.14 × (8 ÷ 2) × (8 ÷ 2)')]
      },
      think: {
        items: [{ q: '{a} found the area of a circle with radius 6 cm as 3.14 × 6 × 2. What went wrong?', lines: { n: 3, key: 'That is the circumference. Area is 3.14 × 6 × 6 = 113.04 cm².' } },
          { q: 'When the radius doubles, what happens to the area?', lines: { n: 3, key: 'It becomes 4 times as big, because r × r becomes 2r × 2r.' } },
          AR(9)]
      }
    },

    around: {
      watch: 'answering an area question in cm, or a fence question in m². Check what is being measured.',
      goal: 'I can tell when to find the circumference and when to find the area.',
      learn: {
        show: { cap: 'fence: around, plain units · grass: inside, square units' },
        together: [AI('Trim to go around a round table', true), AI('Paint to cover a round sign', false)],
        cue: 'Around: circumference. Inside: area.',
        own: [AI('A fence around a round pool', true), AI('Grass seed for a round lawn', false), AI('A ribbon around a round cake', true)]
      },
      p1: {
        show: { eq: ['around: cm · inside: cm²'] },
        items: [AI('Carpet to cover a round floor', false), AI('A border along the edge of a round rug', true), AI('Glass to cover a round window', false),
          AI('Lights strung around a round tree trunk', true), AI('Cloth to cover a round tabletop', false)]
      },
      p2: {
        items: [story('A round table has a radius of 0.5 m. How much trim goes around it?', 'm', 3.14, '3.14 × 2 × 0.5'),
          story('A round table has a radius of 0.5 m. What area does its cloth cover?', 'm²', 0.785, '3.14 × 0.5 × 0.5'),
          story('A round pool is 6 m across. How long is the fence around it?', 'm', 18.84, '3.14 × 6')]
      },
      p3: {
        items: [story('A circular garden has a radius of 3 m. Seed costs $2 per m². How much for the whole garden?', 'dollars', 56.52, '3.14 × 3 × 3 × 2'),
          story('The same garden needs edging at $5 per m. How much for the edging?', 'dollars', 94.2, '3.14 × 2 × 3 × 5', { q: 'A circular garden has a radius of 3 m. Edging costs $5 per m. How much for edging all the way around?' })]
      },
      think: {
        items: [{ q: '{b} answered an area question in cm. What went wrong?', lines: { n: 3, key: 'Area covers a surface, so it is in square units: cm².' } },
          { q: 'Make up one question about a circle that needs the circumference and one that needs the area.', lines: { n: 3, key: 'For example: a fence around a round pool (circumference); paint for a round sign (area).' } }]
      }
    },

    litre: {
      watch: 'forgetting to divide by 1000 to get litres, or dividing by 100.',
      goal: 'I can link cm³, mL and L.',
      learn: {
        show: { cap: 'a 10 cm cube', eq: ['10 × 10 × 10 = 1000 cm³ = 1 L', '1 cm³ = 1 mL'] },
        together: [{ eq: ['2500 ÷ 1000 = [] L'], a: [2.5] }, { eq: ['3 × 1000 = [] mL'], a: [3000] }],
        cue: '1000 cm³ = 1 L.',
        own: [{ eq: ['750 ÷ 1000 = [] L'], a: [0.75] }, { eq: ['1.2 × 1000 = [] cm³'], a: [1200] }, { eq: ['4000 ÷ 1000 = [] L'], a: [4] }]
      },
      p1: {
        show: { eq: ['500 cm³ = 500 mL = 0.5 L'] },
        items: [{ eq: ['6000 ÷ 1000 = [] L'], a: [6] }, { eq: ['250 ÷ 1000 = [] L'], a: [0.25] }, { eq: ['1.5 × 1000 = [] mL'], a: [1500] },
          { eq: ['0.4 × 1000 = [] cm³'], a: [400] }, { eq: ['12 500 ÷ 1000 = [] L'], a: [12.5] }, { eq: ['0.05 × 1000 = [] mL'], a: [50] }]
      },
      p2: {
        items: [story('A box is 20 cm by 10 cm by 15 cm. How many litres does it hold?', 'L', 3, '20 × 10 × 15 ÷ 1000'),
          story('A fish tank is 50 cm by 30 cm by 40 cm. How many litres?', 'L', 60, '50 × 30 × 40 ÷ 1000'),
          story('A juice box is 10 cm by 5 cm by 4 cm. How many millilitres?', 'mL', 200, '10 × 5 × 4')]
      },
      p3: {
        items: [story('A cooler holds 24 L. How many cm³ is that?', 'cm³', 24000, '24 × 1000'),
          story('A carton is 7 cm by 7 cm by 20 cm. Can it hold 1 L of milk? Find its volume.', 'cm³', 980, '7 × 7 × 20'),
          { q: 'Can the 980 cm³ carton hold 1 L? Explain.', lines: { n: 2, key: 'No. 1 L is 1000 cm³, and 980 cm³ is less.' } }]
      },
      think: {
        items: [{ q: '{a} changed 2500 cm³ to 25 L. What went wrong?', lines: { n: 3, key: '{a} divided by 100. 1 L = 1000 cm³, so 2500 cm³ = 2.5 L.' } },
          { q: 'Why is a litre the same as a 10 cm cube?', lines: { n: 2, key: '10 × 10 × 10 = 1000 cm³, and 1000 mL = 1 L.' } }]
      }
    },

    convert: {
      watch: 'thinking 1 m² = 100 cm². A square metre is 100 cm by 100 cm: 10 000 cm².',
      goal: 'I can change square and cubic units.',
      learn: {
        show: { cap: '1 m by 1 m = 100 cm by 100 cm', eq: ['1 m² = 10 000 cm²', '1 m³ = 1 000 000 cm³'] },
        together: [{ eq: ['3 × 10 000 = [] cm²'], a: [30000] }, { eq: ['5 × 100 = [] mm²'], a: [500] }],
        cue: 'Square the factor for area. Cube it for volume.',
        own: [{ eq: ['50 000 ÷ 10 000 = [] m²'], a: [5], wide: true }, { eq: ['2 × 1 000 000 = [] cm³'], a: [2000000], wide: true }]
      },
      p1: {
        show: { eq: ['1 cm² = 10 × 10 = 100 mm²'] },
        items: [{ eq: ['7 × 10 000 = [] cm²'], a: [70000] }, { eq: ['2.5 × 10 000 = [] cm²'], a: [25000] }, { eq: ['800 ÷ 100 = [] cm²'], a: [8] },
          { eq: ['6 × 100 = [] mm²'], a: [600] }, { eq: ['40 000 ÷ 10 000 = [] m²'], a: [4], wide: true }, { eq: ['3 × 1000 = [] mm³'], a: [3000] }]
      },
      p2: {
        items: [story('A floor is 4 m by 3 m. What is its area in cm²?', 'cm²', 120000, '4 × 3 × 10 000'),
          story('A tile is 50 cm by 50 cm. How many tiles cover 1 m²?', 'tiles', 4, '10 000 ÷ (50 × 50)'),
          story('A garden box holds 0.5 m³ of soil. How many cm³ is that?', 'cm³', 500000, '0.5 × 1 000 000')]
      },
      p3: {
        items: [{ q: '3 m² in cm². Is it more than 25 000 cm²?', eq: ['3 × 10 000 = [] cm²'], a: [30000], wide: true },
          { q: '0.2 m³ in cm³. Is it more than 150 000 cm³?', eq: ['0.2 × 1 000 000 = [] cm³'], a: [200000], wide: true },
          { q: 'Draw a picture to show why 1 cm² = 100 mm².', draw: { h: 120, key: 'A 1 cm square split into 10 rows of 10 small squares, each 1 mm by 1 mm.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 1 m² = 100 cm². What went wrong?', lines: { n: 3, key: 'A square metre is 100 cm by 100 cm: 100 × 100 = 10 000 cm².' } },
          { q: 'Why is 1 m³ a million cm³?', lines: { n: 2, key: '100 × 100 × 100 = 1 000 000.' } }]
      }
    },

    layers: {
      watch: 'using the area of a side face instead of the base, or forgetting to square the radius.',
      goal: 'I can find the volume of a prism or cylinder.',
      learn: {
        show: { cap: 'base area × height', eq: ['box: 6 × 4 × 5 = 120 cm³'] },
        together: [VB(5, 3, 4), VC(2, 10)],
        cue: 'Volume = area of the base × height.',
        own: [bare(VB(8, 2.5, 6), 'Box 8 by 2.5 by 6 cm'), bare(VC(3, 5), 'Cylinder r = 3 cm, h = 5 cm')]
      },
      p1: {
        show: { cap: 'cylinder: r 3 cm, h 10 cm', eq: ['3.14 × 3 × 3 × 10 = 282.6 cm³'] },
        items: [VB(10, 4, 3), VC(5, 4), VT(8, 3, 12), bare(VB(7, 7, 7), 'A 7 cm cube')]
      },
      p2: {
        items: [VC(1, 20), VT(5, 6, 9), bare(VC(4, 2.5), 'Cylinder r = 4 cm, h = 2.5 cm'), bare(VB(12, 1.5, 4), 'Box 12 by 1.5 by 4 cm')]
      },
      p3: {
        items: [story('A can has a radius of 4 cm and a height of 12 cm. What is its volume?', 'cm³', 602.88, '3.14 × 4 × 4 × 12'),
          story('A tent is a triangular prism: the triangle has base 2 m and height 1.5 m, and it is 3 m long. Volume?', 'm³', 4.5, '2 × 1.5 ÷ 2 × 3'),
          story('A pool is 10 m by 4 m by 1.5 m. How many litres? (1 m³ = 1000 L)', 'L', 60000, '10 × 4 × 1.5 × 1000')]
      },
      think: {
        items: [{ q: '{a} found the volume of a cylinder with radius 3 cm and height 10 cm as 3.14 × 3 × 10. What went wrong?', lines: { n: 3, key: 'The base is a circle: 3.14 × 3 × 3. Then × 10 = 282.6 cm³.' } },
          { q: 'Why does volume = base × height work for every prism?', lines: { n: 3, key: 'The prism is the same layer, the base, stacked up to the height.' } }]
      }
    },

    back: {
      watch: 'multiplying again instead of dividing.',
      goal: 'I can find a missing height or base.',
      learn: {
        show: { cap: 'box 120 cm³, base 6 by 4', eq: ['120 ÷ (6 × 4) = 5 cm tall'] },
        together: [{ q: 'Volume 240 cm³, base 8 by 5. Height?', eq: ['240 ÷ (8 × 5) = [] cm'], a: [6] }, { q: 'Volume 314 cm³, base area 31.4 cm². Height?', eq: ['314 ÷ 31.4 = [] cm'], a: [10] }],
        cue: 'Missing height: volume ÷ base.',
        own: [{ q: 'Volume 360 cm³, height 9 cm. Base area?', eq: ['360 ÷ 9 = [] cm²'], a: [40] }, { q: 'Volume 500 cm³, base 10 by 10. Height?', eq: ['500 ÷ (10 × 10) = [] cm'], a: [5] }]
      },
      p1: {
        show: { eq: ['base area = volume ÷ height'] },
        items: [{ q: '96 cm³, base 4 by 4. Height?', eq: ['96 ÷ (4 × 4) = [] cm'], a: [6] }, { q: '420 cm³, base 7 by 6. Height?', eq: ['420 ÷ (7 × 6) = [] cm'], a: [10] },
          { q: '150 cm³, height 6 cm. Base area?', eq: ['150 ÷ 6 = [] cm²'], a: [25] }, { q: '1000 cm³, height 8 cm. Base area?', eq: ['1000 ÷ 8 = [] cm²'], a: [125] }]
      },
      p2: {
        items: [story('A box holds 2 L (2000 cm³). Its base is 20 cm by 10 cm. How tall is it?', 'cm', 10, '2000 ÷ (20 × 10)'),
          story('A cylinder has volume 628 cm³ and base area 78.5 cm². How tall is it?', 'cm', 8, '628 ÷ 78.5'),
          story('A box is 5 cm tall and holds 300 cm³. Its base is 10 cm long. How wide is it?', 'cm', 6, '300 ÷ 5 ÷ 10')]
      },
      p3: {
        items: [story('A fish tank holds 72 L. Its base is 60 cm by 30 cm. How deep is the water when it is full?', 'cm', 40, '72 × 1000 ÷ (60 × 30)'),
          story('A can holds 1 L (1000 cm³). Its base area is 80 cm². How tall must it be?', 'cm', 12.5, '1000 ÷ 80')]
      },
      think: {
        items: [{ q: '{b} found the height of a 240 cm³ box with base 8 by 5 as 240 × 40. What went wrong?', lines: { n: 3, key: 'To undo a multiplication, divide: 240 ÷ 40 = 6 cm.' } },
          { q: 'How can you check a missing height?', lines: { n: 2, key: 'Multiply base by height and see if you get the volume.' } }]
      }
    },

    net: {
      watch: 'using the diameter for the rectangle\'s length, or forgetting one of the circles.',
      goal: 'I can find the surface area of a cylinder from its net.',
      learn: {
        show: { cap: 'r 3 cm, h 10 cm: 56.52 + 188.4 = 244.92 cm²' },
        together: [SA(2, 5)],
        cue: 'Two circles, plus circumference × height.',
        own: [bare(SA(1, 10), 'r = 1 cm, h = 10 cm'), bare(SA(2, 3), 'r = 2 cm, h = 3 cm')]
      },
      p1: {
        show: { cap: 'two circles + rectangle', eq: ['2 × 3.14 × r × r + 2 × 3.14 × r × h'] },
        items: [SA(3, 4), SA(5, 10), bare(SA(1, 5), 'r = 1 cm, h = 5 cm'), bare(SA(2, 10), 'r = 2 cm, h = 10 cm')]
      },
      p2: {
        items: [SA(4, 6), SA(10, 5), bare(SA(3, 10), 'r = 3 cm, h = 10 cm'), bare(SA(5, 2), 'r = 5 cm, h = 2 cm')]
      },
      p3: {
        items: [story('A can has radius 4 cm and height 10 cm. How much metal (area) for the can, top and bottom included?', 'cm²', 351.68, '2 × 3.14 × 4 × 4 + 2 × 3.14 × 4 × 10'),
          story('A label wraps around a can of radius 3 cm and height 8 cm. What is the area of the label?', 'cm²', 150.72, '2 × 3.14 × 3 × 8')]
      },
      think: {
        items: [{ q: '{a} made the rectangle of the net as long as the diameter. What went wrong?', lines: { n: 3, key: 'The rectangle wraps all the way around the circle, so its length is the circumference.' } },
          { q: 'Sketch the net of a cylinder. Label the radius, height and circumference.', draw: { h: 150, key: 'Two circles touching the long sides of a rectangle; the rectangle is the circumference long and the height wide.' } }]
      }
    }
  } });
})();
