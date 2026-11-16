/* Teaching guide: Algebra tiles (Toolbox tool 'tiles', Grades 5 to 8). Format: see assets/engine/guide.js. */
AtlasGuide.add('tiles', {
  what: 'x tiles and unit tiles (with negative tiles from Grade 6), for building expressions, solving equations and adding integers.',
  keys: [
    ['Tray', 'Tap an x tile or a unit tile (−x and −1 from Grade 7) to add it.'],
    ['Expressions', 'Build an expression. Group like terms simplifies it; Let x = works out its value.'],
    ['Equations', 'Tiles on the left and right of =. Add to Left, Right or Both sides; Share the units among the x tiles.'],
    ['Integers', 'Grade 6 and up: +1 and −1 tiles, zero pairs and Take away.'],
    ['Show number', 'Writes what the tiles show.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [5, 8],
      start: [
        'In <b>Expressions</b>, tap 2 x tiles and 3 unit tiles. Ask: “How would you write this?” (2x + 3.)',
        'Use <b>Let x =</b> 3. Ask: “What is it worth now?” (9.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Build and evaluate', codes: { 5: ['C2.2'], 6: ['C2.2'], 7: ['C2.2'], 8: ['C2.2'] },
          goal: 'An x tile stands for a number. Put the number in to find the value.',
          ido: 'Build 2x + 3. Let x = 3. “Each x is 3: 3 + 3 + 3 = 9.”',
          wedo: { 5: 'Together: 3x + 1 when x = 4 (13).', 6: 'Together: 4x + 2 when x = 0.5 (4).', 7: 'Together: 2x + 5 when x = 1.5 (8).', 8: 'Together: 3x + 4 when x = −2 (−2).' },
          youdo: { 5: 'The child builds 5x + 2 and finds its value when x = 6.', 6: 'The child builds 3x + 1 and finds its value when x = 2.5.', 7: 'The child builds x + 7 and 2x + 3 and finds when they are equal by trying values.', 8: 'The child finds 2x − 3 when x = −4.' },
          ask: '“What changes if x changes? What stays the same?”'
        },
        {
          t: 'Group like terms', codes: { 5: ['C2.1'], 6: ['C2.1'], 7: ['C2.1'], 8: ['C2.1'] },
          goal: 'Only like tiles can be grouped: x tiles with x tiles, units with units.',
          ido: { 5: 'Build x + 2 + x + 1. Tap <b>Group like terms</b>: 2x + 3. Say it in words: “two x and three.”', 6: 'Build 2x + 3x + 4. Group like terms: 5x + 4.', 7: 'Build x + 1 + (−x) + x + (−1). Group: “x and −x cancel, 1 and −1 cancel. x.”', 8: 'Build (2x + 3) + (x − 5). Group: 3x − 2.' },
          wedo: { 5: 'Together, build “three x and four” and write it.', 6: 'Together: x + 4 + 2x + 1 (3x + 5).', 7: 'Together: 5x − 2x + 3 (3x + 3).', 8: 'Together: (3x − 1) + (−x + 4) (2x + 3).' },
          youdo: 'The child builds an expression you say in words, groups it and writes it.',
          ask: '“Why can’t 2x + 3 become 5x?”'
        },
        {
          t: 'Solve an equation', codes: { 5: ['C2.3'], 6: ['C2.3'], 7: ['C2.3'], 8: ['C2.3'] },
          goal: 'Do the same to both sides until one x is alone.',
          ido: 'In <b>Equations</b>, build 2x + 3 = 7. Take 3 from both sides: 2x = 4. Tap <b>Share</b>: x = 2. Check: 2 × 2 + 3 = 7.',
          wedo: { 5: 'Together: 3x = 12.', 6: 'Together: 2x + 5 = 13.', 7: 'Together: 3x + 2 = x + 8.', 8: 'Together: 2x + 7 = 1.' },
          youdo: { 5: 'The child solves 4x = 20 and x + 9 = 15.', 6: 'The child solves 3x + 4 = 19.', 7: 'The child solves 4x − 3 = 2x + 5.', 8: 'The child solves 3x + 5 = −4 and checks.' },
          ask: '“How do you check your answer?”'
        },
        {
          t: 'Add and subtract integers', codes: { 6: ['B1.2'], 7: ['B2.4'], 8: ['B2.4', 'B2.7'] },
          goal: 'A +1 and a −1 make zero.',
          ido: { 6: 'In <b>Integers</b>, put 5 +1 tiles and 3 −1 tiles. Pair them: 3 zero pairs. “2 left: 5 + (−3) = 2.”', 7: 'Put 2 +1 tiles. Take away −2: there are none, so add 2 zero pairs, then take 2 −1 tiles. “2 − (−2) = 4.”', 8: 'Use Make a × b: 3 groups of −2. “3 × (−2) = −6.”' },
          wedo: { 6: 'Together: 4 + (−6).', 7: 'Together: −3 − 2.', 8: 'Together: −2 × 3 and −2 × (−3) (take away groups).' },
          youdo: { 6: 'The child shows −4 three different ways.', 7: 'The child does 5 − (−1) and −4 + 7.', 8: 'The child does 4 × (−3) and −12 ÷ 4.' },
          ask: '“Why does taking away a negative make it bigger?”'
        }
      ],
      mistakes: [
        ['Groups 2x + 3 into 5x.', 'x tiles and units are different sizes. They cannot join.'],
        ['Takes 3 from one side only.', 'Do the same to both sides.'],
        ['Thinks 2 − (−2) = 0.', 'Add zero pairs so there are −1 tiles to take away.'],
        ['Forgets to check the answer.', 'Put the x value back into the first equation.']
      ]
    }
  ]
});
