/* Teaching guide: Shape kit (Toolbox tool 'geoboard', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('geoboard', {
  what: 'Pattern blocks with a mirror, and a geoboard with bands, for building shapes, symmetry, perimeter, area and angles.',
  keys: [
    ['Blocks', 'Add a block from the tray and drag it. Corners snap together. Turn, Flip and Take off change the chosen block.'],
    ['Mirror', 'Shows each block reflected across a line.'],
    ['Geoboard', 'Tap pegs to stretch a band; tap the first peg to close it. Drag a corner to change the shape.'],
    ['Show number', 'Names the shape and gives sides, corners, perimeter, area and angles, depending on the grade.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'In <b>Blocks</b>, add a hexagon. Ask: “Can you cover it with other blocks?”',
        'Add two trapezoids on top. Ask: “How many trapezoids make a hexagon?” (2.)',
        'Turn on <b>Show number</b>. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Make a shape from blocks', codes: { 1: ['E1.2'], 2: ['E1.2'], 3: ['E2.7'] },
          goal: 'Small shapes fit together to make bigger ones.',
          ido: 'Cover a hexagon with 6 triangles. “Six triangles make one hexagon.”',
          wedo: { 1: 'Together, cover the hexagon with 3 blue rhombuses.', 2: 'Together, cover the hexagon another way. “Different blocks, same area.”', 3: 'Together, make two different shapes, each with an area of 6 triangles.' },
          youdo: { 1: 'The child builds a picture with blocks and names each block.', 2: 'The child finds three ways to cover a trapezoid.', 3: 'The child makes the biggest and smallest shape they can from 4 triangles.' },
          ask: '“How many triangles make a trapezoid?”'
        },
        {
          t: 'Matching halves', codes: { 1: ['E1.3'], 2: ['E1.1'] },
          goal: 'A symmetrical shape has two matching halves.',
          ido: 'Build half a picture and tap <b>Mirror</b>. “The other half appears, exactly matching.”',
          wedo: 'Together, build a butterfly with the mirror on.',
          youdo: 'The child builds their own symmetrical design and shows the mirror line.',
          ask: '“Where is the line of symmetry?”'
        },
        {
          t: 'Name the shape', codes: { 1: ['E1.1'], 2: ['E1.1'] },
          goal: 'Shapes are named by their sides and corners.',
          ido: 'On the <b>Geoboard</b>, stretch a band around 3 pegs. “3 sides, 3 corners: a triangle.”',
          wedo: 'Together, make a shape with 4 sides that is not a square.',
          youdo: 'The child makes a triangle, a rectangle and a shape with 5 sides, and names each.',
          ask: '“How many sides? How many corners?”'
        },
        {
          t: 'Around the edge', codes: { 3: ['E2.1'] },
          goal: 'Perimeter is the distance all the way around.',
          ido: 'On the Geoboard, make a 4 by 3 rectangle. Count the units around: “4 + 3 + 4 + 3 = 14.”',
          wedo: 'Together, make a different rectangle with a perimeter of 14.',
          youdo: 'The child makes a shape with a perimeter of 12 and checks with Show number.',
          ask: '“Did you count every side?”'
        },
        {
          t: 'Count the area', codes: { 3: ['E2.8', 'E2.9'] },
          goal: 'Area is how many squares are inside.',
          ido: 'Make a 4 by 3 rectangle. Count the squares inside: “12 squares.”',
          wedo: 'Together, make an L shape and count its squares.',
          youdo: 'The child makes two shapes with an area of 6 squares.',
          ask: '“Can two shapes have the same area but look different?”'
        }
      ],
      mistakes: [
        ['Calls a turned square a diamond and says it is a new shape.', 'Turn it back: same sides, same shape.'],
        ['Counts pegs instead of units for perimeter.', 'Count the spaces between pegs.'],
        ['Mixes up perimeter and area.', 'Perimeter goes around; area fills the inside.'],
        ['Thinks a shape is symmetrical if both halves have the same blocks.', 'Use Mirror: the halves must match like a reflection.']
      ]
    },
    {
      grades: [4, 8],
      start: [
        'On the <b>Geoboard</b>, stretch a band into a 4 by 3 rectangle.',
        'Ask: “How many right angles? Which sides are parallel?”',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Angles and sides', codes: { 4: ['E1.1', 'E2.4'], 5: ['E1.1'], 6: ['E1.1'] },
          goal: 'Shapes are named by their angles and sides.',
          ido: { 4: 'Make a rectangle. “4 right angles, opposite sides parallel.” Drag a corner: “Now one angle is obtuse.”', 5: 'Make a triangle with a right angle. Show number names it: right triangle. Drag a corner to make it acute.', 6: 'Make a rhombus and turn on <b>Diagonals</b>. “They cross at right angles.”' },
          wedo: { 4: 'Together, make a shape with exactly one right angle.', 5: 'Together, make an isosceles triangle.', 6: 'Together, make a kite and compare its diagonals.' },
          youdo: { 4: 'The child makes a shape with two pairs of parallel sides and no right angles.', 5: 'The child makes a scalene obtuse triangle.', 6: 'The child makes a parallelogram and a trapezoid and lists how they differ.' },
          ask: '“How do you know it is a right angle?”'
        },
        {
          t: 'Area and perimeter', codes: { 4: ['E2.5'], 5: ['E2.5', 'E2.6'], 6: ['E2.4'], 7: ['E2.2'], 8: ['E2.3'] },
          goal: 'Split or surround a shape with rectangles to find its area.',
          ido: { 4: 'Make a 5 by 2 rectangle. “5 × 2 = 10 squares.” Perimeter: 14.', 5: 'Make a parallelogram. “Cut the triangle off one end and move it: a rectangle, same area.”', 6: 'Make a trapezoid. “Split it into a rectangle and two triangles.”', 7: 'Make a 6 by 4 rectangle with 1 unit = 1 m. “24 m², or 240 000 cm².”', 8: 'Make an L shape. “Split it into two rectangles and add.”' },
          wedo: 'Together, find the area of a triangle as half its rectangle.',
          youdo: 'The child makes a shape, predicts its area and perimeter, then checks.',
          ask: '“Why is a triangle half of a rectangle?”'
        },
        {
          t: 'Angles add up', codes: { 5: ['E2.4'], 6: ['E2.3'], 8: ['E2.2'] },
          goal: 'The angles inside a shape add to a fixed total.',
          ido: 'Make a triangle with Show number on. Add its three angles: 180°. Make a quadrilateral: 360°.',
          wedo: 'Together, drag a corner and check the total stays the same.',
          youdo: 'The child finds a missing angle in a triangle (two angles given), then checks.',
          ask: '“Why does the total stay the same when the shape changes?”'
        },
        {
          t: 'Flip it', codes: { 4: ['E1.3'], 5: ['E1.5'], 6: ['E1.4'], 7: ['E1.4'] },
          goal: 'A flip makes a mirror image across a line.',
          ido: 'In <b>Blocks</b>, build a shape and tap <b>Mirror</b>. “Each block is the same distance from the line on the other side.”',
          wedo: 'Together, predict where one block will land before turning Mirror on.',
          youdo: 'The child builds a design that looks the same after a flip.',
          ask: '“What stays the same in a flip? What changes?”'
        },
        {
          t: 'Bigger, same shape', codes: { 7: ['E1.3'], 8: ['E1.3'] },
          goal: 'Enlarging multiplies every side by the same number.',
          ido: 'Make a 2 by 1 rectangle, then a 4 by 2. “Every side doubled. Same shape, area 4 times.”',
          wedo: 'Together, make a triangle and one 3 times as big.',
          youdo: 'The child makes a shape at scale 1 : 2 and says the new perimeter and area.',
          ask: '“If the sides double, why does the area go up 4 times?”'
        },
        {
          t: 'Squares on the sides', codes: { 8: ['E2.4'] },
          goal: 'In a right triangle, the two small squares add up to the big square.',
          ido: 'Make a right triangle with sides 3 and 4. Turn on <b>Squares on sides</b>. “9 + 16 = 25. The long side is 5.”',
          wedo: 'Together, make a right triangle with sides 6 and 8 (10).',
          youdo: 'The child finds the long side for legs 5 and 12, then checks.',
          ask: '“Does it work for a triangle without a right angle?”'
        },
        {
          t: 'Tile with no gaps', codes: { 8: ['E1.1'] },
          goal: 'Some shapes cover a surface with no gaps or overlaps.',
          ido: 'In <b>Blocks</b>, tile with hexagons. “The corners meet: 120° + 120° + 120° = 360°.”',
          wedo: 'Together, try tiling with the trapezoid and with the tan rhombus.',
          youdo: 'The child finds a block that tiles with no gaps and explains why.',
          ask: '“Why must the angles at a point make 360°?”'
        }
      ],
      mistakes: [
        ['Measures the slanted side as the height.', 'The height meets the base at a right angle.'],
        ['Thinks every 4-sided shape is a square.', 'Check the sides and angles with Show number.'],
        ['Thinks doubling the sides doubles the area.', 'Count the squares: 4 times.'],
        ['Says angles in a triangle add to 360°.', 'Add the three angles on the board: 180°.']
      ]
    }
  ]
});
