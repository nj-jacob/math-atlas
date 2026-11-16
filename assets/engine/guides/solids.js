/* Teaching guide: 3D solids and nets (Toolbox tool 'solids', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('solids', {
  what: '3D solids to turn and explore, cubes to build with, and from Grade 6 nets and volume.',
  keys: [
    ['Solids', 'Pick a solid. Drag it or tap ↺ ↻ to turn it; Tip shows another side.'],
    ['Build', 'Tap the grid to stack cubes, or tap a stack to take one off. From Grade 5 it shows the top, front and side views.'],
    ['Nets', 'Grade 6 and up: fold and unfold a net, with each face’s area.'],
    ['Volume', 'Grade 7 and up: fill a prism or cylinder one layer at a time.'],
    ['Show number', 'Shows faces, edges and vertices, areas and volumes.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'Pick the <b>cylinder</b>. Turn it with a drag. Ask: “Which faces are flat? Which part is curved?”',
        'Ask: “Could it roll? Could it stack?”',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Name and sort solids', codes: { 1: ['E1.1'], 2: ['E1.1'], 3: ['E1.1'] },
          goal: 'Solids are sorted by their faces.',
          ido: { 1: 'Pick the cube, then the sphere. “The cube has flat faces. The sphere has none.”', 2: 'Pick the cube and the square pyramid. “Their faces are squares and triangles.” Name each face shape.', 3: 'Pick the triangular prism. Count with Show number: 5 faces, 9 edges, 6 vertices.' },
          wedo: 'Together, sort the solids into two groups and say the rule.',
          youdo: { 1: 'The child sorts the solids by “rolls” and “does not roll”.', 2: 'The child finds every solid with a square face.', 3: 'The child compares a cube and a square pyramid by faces, edges and vertices.' },
          ask: '“What is your sorting rule?”'
        },
        {
          t: 'Roll, slide or stack', codes: { 1: ['E1.2'], 2: ['E1.2'], 3: ['E1.2'] },
          goal: 'The faces decide how a solid moves.',
          ido: 'Pick the cylinder. Tip it. “On its side it rolls. On a flat face it slides and stacks.”',
          wedo: 'Together, test the cone and the cube.',
          youdo: 'The child finds something at home shaped like each solid.',
          ask: '“Why can a cube stack but a sphere cannot?”'
        },
        {
          t: 'Build with cubes', codes: { 1: ['E1.2'], 2: ['E1.2'], 3: ['E1.3'] },
          goal: 'Build a structure and describe it.',
          ido: 'In <b>Build</b>, stack 3 cubes in a row and 2 on top. “5 cubes. It looks like stairs.”',
          wedo: { 1: 'Together, build a tower and a wall with 6 cubes each.', 2: 'Together, build a shape and name the flat shapes you see on it.', 3: 'Build a shape. Together, build one exactly the same next to it.' },
          youdo: 'The child builds something from a description you give (“3 long, 2 high”).',
          ask: '“How many cubes? How did you count?”'
        }
      ],
      mistakes: [
        ['Calls a cube a square.', 'A square is flat. A cube has 6 square faces.'],
        ['Counts the same edge twice.', 'Turn the solid slowly and count one side at a time.'],
        ['Thinks a cone has no flat face.', 'Tip it over: the bottom is a flat circle.'],
        ['Mixes up faces and edges.', 'Faces are flat surfaces; edges are where two faces meet.']
      ]
    },
    {
      grades: [4, 5],
      start: [
        'Pick the <b>rectangular prism</b>. Turn it. Ask: “What shape is each face?”',
        'In <b>Build</b>, stack a 3 by 2 layer of cubes. Ask: “How many in one layer?” (6.)',
        'Add a second layer. Ask: “How many now?” (12.) Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Faces are flat shapes', codes: { 4: ['E1.1'], 5: ['E1.2'] },
          goal: 'Each face of a prism is a flat shape. Some faces match exactly.',
          ido: { 4: 'Pick the rectangular prism. “Every face is a rectangle: four right angles, opposite sides parallel.”', 5: 'Pick the rectangular prism. “Opposite faces are exactly the same: congruent.”' },
          wedo: 'Together, look at the triangular prism. Which faces match?',
          youdo: 'The child names the faces of the hexagonal prism and finds the matching ones.',
          ask: '“How do you know two faces are the same?”'
        },
        {
          t: 'Count cubes by layers', codes: { 4: ['B2.5'], 5: ['B2.1'] },
          goal: 'Multiply one layer by the number of layers.',
          ido: 'Build a 4 by 3 layer. “12 cubes.” Add 2 more layers. “3 layers of 12: 36.”',
          wedo: { 4: 'Together: a 5 by 2 layer, 3 layers high (30).', 5: 'Together: a 6 by 4 layer, 3 layers high (72).' },
          youdo: 'The child builds a box and works out the cubes before counting.',
          ask: '“Why multiply instead of counting each cube?”'
        },
        {
          t: 'Draw the views', codes: { 5: ['E1.3'] },
          goal: 'Each view shows the tallest stack you can see from that side.',
          ido: 'Build a small structure. Read the top, front and side views.',
          wedo: 'Together, add one cube and predict which views change.',
          youdo: 'The child builds a structure, draws the three views on paper, then checks.',
          ask: '“Why can’t you see some cubes from the front?”'
        },
        {
          t: 'Growing towers', codes: { 4: ['C1.2'], 5: ['C1.2'] },
          goal: 'A growing pattern of stacks can go in a table.',
          ido: 'Build stairs: 1, then 2, then 3 cubes. “Each step adds one stack.” Total: 1, 3, 6.',
          wedo: 'Together, make a table of step and total cubes.',
          youdo: 'The child predicts step 5 and builds it to check (15).',
          ask: '“How much is added each time?”'
        }
      ],
      mistakes: [
        ['Counts only the cubes they can see.', 'Count layer by layer: the hidden ones count too.'],
        ['Draws the side view as the front view.', 'Stand where the view is from, then look.'],
        ['Thinks all faces of a prism are rectangles.', 'Look at the ends of a triangular prism.'],
        ['Adds the layers instead of multiplying.', 'Each layer has the same number: multiply.']
      ]
    },
    {
      grades: [6, 8],
      start: [
        'In <b>Nets</b>, pick a box and tap <b>Unfold</b>. Ask: “How many faces? Which are the same?”',
        'Read each face’s area. Ask: “What is the total?” (That is the surface area.)',
        'Tap <b>Fold</b> to close it. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Build from views', codes: { 6: ['E1.2'], 7: ['E1.2'], 8: ['E1.2'] },
          goal: 'Three views tell you how to build a structure.',
          ido: 'In <b>Build</b>, open a views puzzle. Read the top view: “cubes go here.” Use the front and side to decide the heights.',
          wedo: 'Together, solve the next puzzle.',
          youdo: 'The child makes a structure, draws its views, and gives them to you to rebuild.',
          ask: '“Is there more than one structure with these views?”'
        },
        {
          t: 'Draw the views', codes: { 6: ['E1.2'], 7: ['E1.2'] },
          goal: 'Each view shows the tallest stack you can see from that side.',
          ido: 'In <b>Build</b>, make a small structure. Read its top, front and side views.',
          wedo: 'Together, add one cube and predict which views change before looking.',
          youdo: 'The child builds a structure and draws its views on paper, then checks them.',
          ask: '“Can two different structures have the same three views?”'
        },
        {
          t: 'Nets and surface area', codes: { 6: ['E2.5', 'E2.6'], 7: ['E2.6'], 8: ['E2.3'] },
          goal: 'Surface area is all the faces of the net added up.',
          ido: { 6: 'Unfold a 4 × 3 × 2 box. “Two 12s, two 8s, two 6s: 52 cm².”', 7: 'Unfold a cylinder. “Two circles and a rectangle as long as the circumference.”', 8: 'Unfold a triangular prism. Add the two triangles and three rectangles.' },
          wedo: 'Together, find the surface area of a cube with 3 cm sides (54 cm²).',
          youdo: 'The child finds the surface area of a new box, then checks with Show number.',
          ask: '“Which faces come in pairs?”'
        },
        {
          t: 'Volume by layers', codes: { 7: ['E2.7', 'E2.1'], 8: ['E2.3'] },
          goal: 'Volume = base area × height.',
          ido: 'In <b>Volume</b>, fill a 4 × 3 × 3 box layer by layer. “Base 12, 3 layers: 36 cm³ = 36 mL.”',
          wedo: 'Together, fill a cylinder with radius 2 and height 3 (about 37.7 cm³).',
          youdo: 'The child finds the volume of a triangular prism, then checks.',
          ask: '“Why is 1 cm³ the same as 1 mL?”'
        },
        {
          t: 'Sort solids', codes: { 7: ['E1.1'] },
          goal: 'Prisms, pyramids and cylinders differ in their bases and sides.',
          ido: 'Compare the hexagonal prism and the hexagonal pyramid. “Two bases and rectangles; one base and triangles.”',
          wedo: 'Together, find the lines of symmetry in a square pyramid’s base.',
          youdo: 'The child sorts all the solids and explains the rule.',
          ask: '“What do a cylinder and a prism have in common?”'
        }
      ],
      mistakes: [
        ['Counts a face twice in a net.', 'Fold it and unfold it: each face appears once.'],
        ['Adds the three dimensions for volume (4 + 3 + 3).', 'Fill layer by layer: it multiplies.'],
        ['Confuses surface area and volume.', 'Surface area covers the outside; volume fills the inside.'],
        ['Uses cm² for volume.', 'Volume is in cubes: cm³.']
      ]
    }
  ]
});
