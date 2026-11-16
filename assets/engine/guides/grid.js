/* Teaching guide: Grid and robot (Toolbox tool 'grid', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('grid', {
  what: 'A robot to code on a grid, a map for directions (Grades 1 to 3), and from Grade 4 a coordinate grid to plot points and move shapes.',
  keys: [
    ['Robot', 'Tap blocks to build code. Go runs it; Step runs one block at a time. Pen draws the path.'],
    ['Blocks', 'Arrows in Grades 1 and 2. From Grade 3: forward, turn left, turn right, turn around and repeat. From Grade 5: if wall ahead and repeat until. From Grade 7: my block.'],
    ['Map', 'Grades 1 to 3: put places on a map and tap two for directions.'],
    ['Plot', 'Grade 4 and up: plot points by x and y or by tapping, and join them.'],
    ['Move', 'Grade 4 and up: slide, flip and (from Grade 5) turn a shape; grow it from Grade 7.'],
    ['Show number', 'Counts blocks, steps and turns, or gives distances and coordinates.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'In <b>Robot</b>, tap → → ↑ (Grade 3: forward, forward, turn left, forward). Tap <b>Go</b>.',
        'Ask: “Where did the robot end up? Was that what you expected?”',
        'Tap <b>New goal</b> and let the child try to reach it. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Code a path', codes: { 1: ['C3.1'], 2: ['C3.1'], 3: ['C3.1'] },
          goal: 'Code is steps in order. The robot does exactly what it says.',
          ido: { 1: 'Point to the goal. Say each step aloud as you tap: “right, right, up, up, right.” Tap Go.', 2: 'Point to the goal. Say each step aloud as you tap: “right, right, up, up, right.” Tap Go.', 3: 'Tap repeat 4 times: forward, forward, turn right. Tap Go. “It drew a square and came back.”' },
          wedo: 'Together, plan a path to a new goal with a finger first, then tap the code.',
          youdo: { 1: 'The child codes a path to two new goals.', 2: 'The child turns on Two robots and codes both to meet.', 3: 'The child uses repeat to draw a rectangle.' },
          ask: '“How many steps will it take? Count before you tap Go.”'
        },
        {
          t: 'Fix the code', codes: { 1: ['C3.2'], 2: ['C3.2'], 3: ['C3.2'] },
          goal: 'When code goes wrong, find the step that is wrong and change it.',
          ido: 'Code a path with one wrong arrow. Tap <b>Step</b>. “Here it went the wrong way. I change this one.”',
          wedo: 'Make another mistake on purpose. Together, step through and find it.',
          youdo: 'The child changes one block in their code, predicts where the robot will end, then checks.',
          ask: '“Which step was the bug? How did you find it?”'
        },
        {
          t: 'Give directions', codes: { 1: ['E1.5'], 2: ['E1.4', 'E1.5'], 3: ['E1.4'] },
          goal: 'Directions say how far and which way.',
          ido: { 1: 'In <b>Map</b>, put a school and swings. Tap both: “5 right, 2 up.” Say where things are: “The tree is beside the school.”', 2: 'In <b>Map</b>, put a home, a park and a store. Tap two: “5 right, 2 up.”', 3: 'In <b>Map</b>, tap two places. Give the directions with a turn: “Go 3 forward, a quarter turn right, 2 forward.”' },
          wedo: 'Together, give directions from one place to another and check by tapping.',
          youdo: 'The child gives you directions to a place without saying which one; you follow them.',
          ask: '“Is there another way to get there? Which is shorter?”'
        }
      ],
      mistakes: [
        ['Mixes up left and right when the robot faces down.', 'Turn your own body the way the robot faces.'],
        ['Counts the start square as a step.', 'A step is a move to the next square.'],
        ['Rebuilds all the code when one step is wrong.', 'Use Step to find the one wrong block.'],
        ['Says “up” for “forward” in Grade 3.', 'Forward is the way the robot faces.']
      ]
    },
    {
      grades: [4, 8],
      start: [
        'In <b>Plot</b>, plot (1, 4) and (5, 2). Ask: “How far right? How far down?” (4 right, 2 down.)',
        'In <b>Robot</b>, build repeat 4 times: forward, turn right. Ask before tapping Go: “What will it draw?”',
        'Tap <b>Go</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Loops and decisions', codes: { 4: ['C3.1'], 5: ['C3.1'], 6: ['C3.1'], 7: ['C3.1'], 8: ['C3.1'] },
          goal: 'Repeat and if make code shorter and smarter.',
          ido: { 4: 'Draw a staircase: repeat 3 times [forward, turn left, forward, turn right]. “A loop instead of 12 blocks.”', 5: 'In a maze, use repeat until at the goal [if wall ahead: turn right, otherwise forward].', 6: 'Solve a maze with the fewest blocks. Count them with Show number.', 7: 'Make my block = forward, forward, turn right. Use it 4 times to draw a square.', 8: 'Run the same maze code twice with the pen on. Count the steps each time and say which code is more efficient.' },
          wedo: 'Together, write the code on paper first, then build it.',
          youdo: 'The child solves a new goal or maze and explains why their code works.',
          ask: '“Could it be shorter? How?”'
        },
        {
          t: 'Change the code', codes: { 4: ['C3.2'], 5: ['C3.2'], 6: ['C3.2'], 7: ['C3.2'], 8: ['C3.2'] },
          goal: 'Predict how a change will change the result.',
          ido: 'Take a working square program. Change repeat 4 to repeat 3. “Predict: it will not close.” Tap Go.',
          wedo: 'Together, change one block and predict the new path before tapping Go.',
          youdo: 'The child changes the code to draw a bigger square and explains each change.',
          ask: '“What did you predict? Were you right?”'
        },
        {
          t: 'Plot points', codes: { 4: ['E1.2'], 5: ['E1.4'], 6: ['E1.3'], 7: ['E1.4'], 8: ['E1.4'] },
          goal: 'Across first, then up: (x, y).',
          ido: { 4: 'Plot (2, 3): “2 across, 3 up.” Plot (5, 1) and read the slide: 3 right, 2 down.', 5: 'Change the scale to 1 square = 5. Plot (10, 25): “2 squares across, 5 up.”', 6: 'Plot (−3, 2) and (4, −1). “Negative x goes left; negative y goes down.”', 7: 'Plot a triangle at (1, 1), (4, 1), (1, 3) and read its corners.', 8: 'Plot a triangle in two quadrants and read its corners.' },
          wedo: 'Together, plot three points and join them to make a shape.',
          youdo: 'The child plots a shape you describe in coordinates and names it.',
          ask: '“Why does the order of the numbers matter?”'
        },
        {
          t: 'Move a shape', codes: { 4: ['E1.3'], 5: ['E1.5'], 6: ['E1.4'], 7: ['E1.3', 'E1.4'], 8: ['E1.4'] },
          goal: 'Predict where a shape will land, then check.',
          ido: { 4: 'In <b>Move</b>, slide a shape 3 right and 1 down. Read the table: each corner moves the same.', 5: 'Turn a shape a half turn. Predict where one corner will land, then check.', 6: 'Combine a slide and a flip. Predict, then check.', 7: 'Grow a shape 2 times. “Every side doubles; the angles stay the same.”', 8: 'Turn a shape a quarter turn about (0, 0). Read the rule: (x, y) → (y, −x).' },
          wedo: 'Together, predict one corner before each move, then check the table.',
          youdo: 'The child moves a shape to a target you choose and lists the moves.',
          ask: '“Which corners moved the most? Why?”'
        }
      ],
      mistakes: [
        ['Plots (2, 3) as 3 across, 2 up.', 'Across the hall, then up the stairs.'],
        ['Expects repeat 3 to close a square.', 'A square has 4 sides and 4 turns.'],
        ['Thinks a flip and a turn are the same.', 'Try both on the same shape and compare.'],
        ['Thinks growing a shape doubles its area.', 'Count the squares: 2 times wider and taller is 4 times the area.']
      ]
    }
  ]
});
