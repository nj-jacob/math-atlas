/* Teaching guide: Measuring kit (Toolbox tool 'scale', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('scale', {
  what: 'A ruler, a pan balance, a measuring jug, a protractor (Grade 4 and up) and circles (Grade 7 and up), for measuring with real units.',
  keys: [
    ['Length', 'Measure a thing with cubes or paper clips (Grades 1 to 3) or a ruler (Grade 2 and up). Drag the thing, or move it off 0.'],
    ['Mass', 'A pan balance: the thing on one side, cubes or weights on the other. Tap a weight to take it off.'],
    ['Capacity', 'Fill a container and pour it into a measuring jug.'],
    ['Angles', 'Grade 4 and up: drag an arm or step it; a protractor from Grade 5.'],
    ['Circles', 'Grade 7 and up: drag the radius; Diameter and Unroll show how a circle is measured.'],
    ['Show number', 'Shows the measurement.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'In <b>Length</b>, pick the pencil. Measure it with cubes. Ask: “How many cubes long?”',
        'Switch to paper clips. Ask: “Why is the number different?”',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Measure with units', codes: { 1: ['E2.2'], 2: ['E2.1'], 3: ['E2.5'] },
          goal: 'Line units up end to end, with no gaps.',
          ido: 'Measure the pencil with cubes. “Start at the end, no gaps: 6 cubes.”',
          wedo: 'Together, measure the ribbon and the straw. Which is longer?',
          youdo: 'The child orders three things from shortest to longest by measuring.',
          ask: '“What happens if there are gaps?”'
        },
        {
          t: 'Bigger unit, smaller count', codes: { 2: ['E2.1'], 3: ['E2.5'] },
          goal: 'The bigger the unit, the fewer you need.',
          ido: 'Measure the ribbon in cubes, then in paper clips. “Paper clips are longer, so fewer fit.”',
          wedo: 'Together, predict the leaf in cubes and in clips, then check.',
          youdo: 'The child explains why two people got different numbers for the same thing.',
          ask: '“Did the ribbon change length?”'
        },
        {
          t: 'Use a ruler', codes: { 2: ['E2.3', 'E2.2'], 3: ['E2.2'] },
          goal: 'Start at 0, or subtract where you start.',
          ido: 'Measure the pencil with the ruler: “12 cm.” Move it to start at 2: “It ends at 14. 14 − 2 = 12 cm.”',
          wedo: 'Together, measure the crayon starting at 3.',
          youdo: { 2: 'The child measures every thing in cm.', 3: 'The child measures every thing in cm and says which is closest to 10 cm.' },
          ask: '“Why didn’t the pencil get longer when we moved it?”'
        },
        {
          t: 'Which is heavier?', codes: { 1: ['E2.2'], 3: ['E2.4'] },
          goal: 'The heavier side of the balance goes down.',
          ido: { 1: 'In <b>Mass</b>, put the apple on. Add cubes until it balances: “15 cubes.”', 3: 'In <b>Mass</b>, put the apple on. Add weights: 100 g + 50 g = 150 g.' },
          wedo: 'Together, compare two things. Which needs more to balance?',
          youdo: 'The child orders three things from lightest to heaviest.',
          ask: '“Is the bigger thing always heavier?”'
        },
        {
          t: 'How much does it hold?', codes: { 1: ['E2.2'], 3: ['E2.3'] },
          goal: 'Capacity is how much a container holds.',
          ido: { 1: 'In <b>Capacity</b>, fill the bottle and pour it into cups: “4 cups.”', 3: 'In <b>Capacity</b>, fill the bottle and pour it into the jug: “750 mL.”' },
          wedo: 'Together, compare two containers. Which holds more?',
          youdo: 'The child orders the containers from holds least to holds most.',
          ask: '“Can a tall thin bottle hold less than a short wide one?”'
        }
      ],
      mistakes: [
        ['Starts measuring at 1 instead of 0.', 'Line the end up with 0, or subtract the start.'],
        ['Leaves gaps between units.', 'Units go end to end with no gaps.'],
        ['Thinks the bigger thing is always heavier.', 'Test it on the balance.'],
        ['Thinks a taller container always holds more.', 'Pour both into the jug and compare.']
      ]
    },
    {
      grades: [4, 6],
      start: [
        'In <b>Mass</b>, put the bag of flour on. Ask: “Will it be more or less than 1 kg?”',
        'Add weights until it balances. Read it: 1 kg 250 g.',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Grams and kilograms', codes: { 4: ['E2.1'], 5: ['E2.2'], 6: ['E2.1'] },
          goal: '1000 grams make 1 kilogram.',
          ido: { 4: 'Balance the flour: 1 kg + 250 g. “1 kg 250 g, or 1250 g.”', 5: 'Balance the flour: 1 kg + 250 g. “1.25 kg, or 1250 g.”', 6: 'Balance the flour: “1.25 kg. In grams, multiply by 1000: 1250 g.”' },
          wedo: 'Together, balance the apple and write it in g and in kg (0.15 kg).',
          youdo: 'The child weighs two things and writes each in both units.',
          ask: '“Which is heavier: 900 g or 1 kg?”'
        },
        {
          t: 'Millilitres and litres', codes: { 4: ['E2.1'], 5: ['E2.2'], 6: ['E2.1'] },
          goal: '1000 mL make 1 L.',
          ido: 'Fill the bottle and pour it into the jug: “750 mL.” From Grade 5: “0.75 L.”',
          wedo: 'Together, estimate the next container before pouring.',
          youdo: 'The child orders the containers and writes each in mL and L.',
          ask: '“How many of these would fill 1 L?”'
        },
        {
          t: 'Measure angles', codes: { 4: ['E2.4'], 5: ['E2.4'], 6: ['E2.2'] },
          goal: 'Angles are turns, measured in degrees.',
          ido: { 4: 'In <b>Angles</b>, make 90°. “A right angle.” Open it more: “Obtuse.” Close it: “Acute.”', 5: 'Use the protractor to make 135°. “Start at 0 on the right scale, read to 135.”', 6: 'Make 300°. “More than a straight angle: a reflex angle. 360 − 300 = 60 on the other side.”' },
          wedo: 'Together, estimate an angle, then measure it.',
          youdo: { 4: 'The child makes an acute, a right, an obtuse and a straight angle.', 5: 'The child makes 45°, 120° and 170° and names each.', 6: 'The child makes 210° and 330° and says each other way round.' },
          ask: '“How did you estimate before measuring?”'
        },
        {
          t: 'Millimetres, centimetres, metres', codes: { 4: ['E2.2'], 5: ['E2.2'], 6: ['E2.1'] },
          goal: '10 mm = 1 cm, 100 cm = 1 m.',
          ido: 'Measure the pencil: 123 mm. “12.3 cm.” From Grade 5: “0.123 m.”',
          wedo: 'Together, measure the ribbon and write it three ways.',
          youdo: 'The child picks the best unit for a pencil, a room and a road.',
          ask: '“Why choose mm for a pencil but km for a road?”'
        }
      ],
      mistakes: [
        ['Writes 1 kg 250 g as 1.250 kg and thinks it is 1250 kg.', 'Read it: one and a quarter kilograms.'],
        ['Reads the wrong protractor scale (45° for 135°).', 'Start at 0 on the arm, then read that scale.'],
        ['Thinks 0.75 L is less than 500 mL.', 'Change both to mL: 750 mL.'],
        ['Calls 180° a reflex angle.', '180° is a straight angle; reflex is more than 180°.']
      ]
    },
    {
      grades: [7, 8],
      start: [
        'In <b>Circles</b>, drag the radius to 3 cm. Ask: “How long is the diameter?” (6 cm.)',
        'Tap <b>Unroll</b>. Ask: “How many diameters long is the circle?” (A little more than 3.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Around a circle', codes: { 7: ['E2.3', 'E2.4'], 8: ['E2.3'] },
          goal: 'The circumference is π times the diameter.',
          ido: 'Radius 3 cm, diameter 6 cm. Unroll: “About 3.14 diameters: C ≈ 18.8 cm.”',
          wedo: 'Together, find C for a radius of 5 cm (31.4 cm).',
          youdo: 'The child finds C for a diameter of 10 cm and draws a circle with C ≈ 12.6 cm (radius 2 cm).',
          ask: '“Why is it always a little more than 3 diameters?”'
        },
        {
          t: 'Area of a circle', codes: { 7: ['E2.5'], 8: ['E2.3'] },
          goal: 'Area is π times the radius squared.',
          ido: 'Radius 3 cm: “π × 3 × 3 ≈ 28.3 cm².”',
          wedo: 'Together, find the area for a radius of 4 cm (about 50.3 cm²).',
          youdo: 'The child finds the area of a circle with a diameter of 10 cm.',
          ask: '“If the radius doubles, what happens to the area?”'
        },
        {
          t: 'Volume and capacity', codes: { 7: ['E2.1'] },
          goal: '1 cm³ holds 1 mL.',
          ido: 'In <b>Capacity</b>, fill the bottle: 750 mL. “It would fill 750 cubes of 1 cm³.”',
          wedo: 'Together, change 2.5 L to cm³ (2500 cm³).',
          youdo: 'The child changes 350 mL, 1.2 L and 4000 cm³ to the other unit.',
          ask: '“How many mL fit in a 10 cm cube?”'
        },
        {
          t: 'Angle facts', codes: { 8: ['E2.2'] },
          goal: 'Angles on a line make 180°; around a point, 360°.',
          ido: 'In <b>Angles</b>, make 130°. “The angle beside it on the line is 50°.”',
          wedo: 'Together, make 300° and find the angle that completes the turn.',
          youdo: 'The child finds the missing angles in a drawing you sketch with two crossing lines.',
          ask: '“Which angles are equal when two lines cross?”'
        }
      ],
      mistakes: [
        ['Uses the diameter in πr².', 'Halve it first: the radius.'],
        ['Writes cm for area.', 'Area is in square units: cm².'],
        ['Thinks doubling the radius doubles the area.', 'Try it: radius 2 and radius 4.'],
        ['Adds angles on a line to 360°.', 'A straight line is half a turn: 180°.']
      ]
    }
  ]
});
