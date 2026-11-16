/* Teaching guide: Pattern builder (Toolbox tool 'patterns', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('patterns', {
  what: 'Repeating, number and growing patterns, shown as shapes, letters, tables and graphs, for finding the rule and predicting.',
  keys: [
    ['Repeat', 'Tap shapes to make the core, then Repeat the core. Take one off, Hide one, and see it as Letters or Claps (a Table from Grade 3).'],
    ['Numbers', 'Choose a start and a step (add, take away, multiply or divide) and see the pattern on a line, chart, table or graph.'],
    ['Grow', 'Grade 4 and up: tile figures that grow (or shrink, from Grade 5), with a table, graph and, from Grade 6, the rule.'],
    ['Compare', 'Grade 7 and up: two patterns on one table and graph, and where they meet.'],
    ['Show number', 'Shows the numbers, the rule and the answers.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'In <b>Repeat</b>, tap red circle, blue square, blue square. Tap <b>Repeat the core</b> twice.',
        'Ask: “What comes next? How do you know?”',
        'Tap <b>Letters</b> to see A B B. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Find the core', codes: { 1: ['C1.1'], 2: ['C1.1'], 3: ['C1.1'] },
          goal: 'The core is the part that repeats.',
          ido: 'Make circle, square, square and repeat it 3 times. Point to each core and say: “circle, square, square… again.”',
          wedo: 'Make a new pattern together with a 4-shape core. Ask the child to point to where each core starts.',
          youdo: 'The child makes their own repeating pattern and tells you its core.',
          ask: '“How many shapes are in the core?”'
        },
        {
          t: 'Same pattern, new way', codes: { 1: ['C1.2'], 2: ['C1.2'], 3: ['C1.2'] },
          goal: 'A pattern can be shapes, letters, sounds or movements.',
          ido: 'Make an A B B pattern. Tap <b>Letters</b>, then <b>Claps</b>. Clap it: “clap, stamp, stamp.”',
          wedo: 'Together, show the same pattern with different shapes.',
          youdo: { 1: 'The child shows an A B pattern three ways: shapes, letters and claps.', 2: 'The child makes an A A B C pattern and shows it two other ways.', 3: 'The child makes a pattern, shows it as letters and opens the Table to say where each shape is.' },
          ask: '“How are these two patterns the same?”'
        },
        {
          t: 'What is missing?', codes: { 1: ['C1.3'], 2: ['C1.3'], 3: ['C1.3'] },
          goal: 'Use the rule to find a hidden or missing shape.',
          ido: 'Make a pattern and tap <b>Hide one</b>. “The core is red, blue, blue. So this one is blue.”',
          wedo: { 1: 'Together, find another hidden shape.', 2: 'Together, find the hidden shape and the 10th shape.', 3: 'Together, use the Table: in A B C, what is in position 7? (A, a red circle.)' },
          youdo: { 1: 'The child hides one for you to find, then finds one you hide.', 2: 'The child predicts the 12th shape and checks.', 3: 'The child predicts position 15 and 20, and explains with the table.' },
          ask: '“How did you know without counting every shape?”'
        },
        {
          t: 'Number patterns', codes: { 1: ['C1.4'], 2: ['C1.4'], 3: ['C1.4'] },
          goal: 'A number pattern has a start and a step.',
          ido: { 1: 'In <b>Numbers</b>, start at 2 and add 2: 2, 4, 6, 8. “It goes up by 2.”', 2: 'Start at 5 and add 5. Show it on the number chart.', 3: 'Start at 100 and add 50: 100, 150, 200.' },
          wedo: { 1: 'Together: start at 20, take away 1.', 2: 'Together: start at 90, take away 10.', 3: 'Together: start at 1000, take away 100.' },
          youdo: 'The child makes a number pattern, then you guess its rule.',
          ask: '“What is the rule? What comes next?”'
        }
      ],
      mistakes: [
        ['Calls A B B A B B A an A B pattern.', 'Point to each core: the B comes twice.'],
        ['Thinks a pattern must use colours.', 'Show it as letters or claps: same pattern.'],
        ['Guesses the next shape without the core.', 'Find the core first, then count on.'],
        ['Counts by 2 but starts at 1 (1, 3, 5) when asked to start at 2.', 'Say the start number first.']
      ]
    },
    {
      grades: [4, 8],
      start: [
        'In <b>Grow</b>, look at the first three figures. Ask: “How many tiles are added each time?”',
        'Open the <b>Table</b>. Ask: “How many tiles in figure 10?”',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Growing patterns in a table', codes: { 4: ['C1.2'], 5: ['C1.2'], 6: ['C1.2'], 7: ['C1.2'], 8: ['C1.2'] },
          goal: 'A table shows how much a pattern grows each step.',
          ido: 'In <b>Grow</b>, show figures 1 to 4. Read the table: 4, 7, 10, 13. “It grows by 3 each time.”',
          wedo: 'Together, open the graph. “The points make a straight line because it grows the same each time.”',
          youdo: 'The child makes a new growing pattern and fills in the table to figure 6.',
          ask: '“How can you see the growth in the table? In the graph?”'
        },
        {
          t: 'Find the rule and predict', codes: { 4: ['C1.3'], 5: ['C1.3'], 6: ['C1.3'], 7: ['C1.3'], 8: ['C1.3'] },
          goal: 'The rule finds any figure without building them all.',
          ido: { 4: 'For 4, 7, 10, 13: “Start at 4, add 3.” Find figure 8 by counting on (25).', 5: 'For 4, 7, 10, 13: “Start at 4, add 3.” Find figure 10 (31).', 6: 'For 4, 7, 10, 13: the rule is 3n + 1. Figure 20: 3 × 20 + 1 = 61.', 7: 'For 4, 7, 10, 13: the rule is 3n + 1. Which figure has 100 tiles? (33.)', 8: 'For 4, 7, 10, 13: the rule is 3n + 1. Which figure has 151 tiles? (50.)' },
          wedo: 'Together, find the rule for 5, 9, 13, 17.',
          youdo: 'The child predicts figure 15 for a pattern you make, then checks with Show number.',
          ask: '“Why is it 3n and not n + 3?”'
        },
        {
          t: 'Growing and shrinking', codes: { 4: ['C1.1'], 5: ['C1.1'], 6: ['C1.1'], 7: ['C1.4'], 8: ['C1.4'] },
          goal: 'Some patterns grow, some shrink, by the same step each time.',
          ido: { 4: 'In <b>Numbers</b>, start at 3 and add 4: 3, 7, 11, 15.', 5: 'In <b>Numbers</b>, start at 50 and take away 6: 50, 44, 38.', 6: 'In <b>Numbers</b>, compare add 3 (linear) with multiply by 2 (not linear).', 7: 'In <b>Numbers</b>, start at 5 and add −3: 5, 2, −1, −4.', 8: 'In <b>Numbers</b>, start at 6 and add −2: 6, 4, 2, 0, −2.' },
          wedo: 'Together, describe the pattern in words: start and step.',
          youdo: 'The child makes one growing and one shrinking pattern and describes both.',
          ask: '“How can you tell a pattern is shrinking?”'
        },
        {
          t: 'Compare two patterns', codes: { 7: ['C1.1'], 8: ['C1.1'] },
          goal: 'Different start, different step: which grows faster, and where do they meet?',
          ido: 'In <b>Compare</b>, make 2n + 5 and 4n + 1. “At step 2 both are 9. After that, 4n + 1 is bigger.”',
          wedo: 'Together: n + 10 and 3n. Where do they meet? (Step 5.)',
          youdo: 'The child makes two patterns that meet at step 4, and checks on the graph.',
          ask: '“Which number in the rule makes it grow faster?”'
        }
      ],
      mistakes: [
        ['Writes the rule as n + 3 for 4, 7, 10.', 'Check: figure 2 would be 5. The step 3 multiplies n.'],
        ['Builds every figure to find figure 20.', 'Use the rule instead.'],
        ['Thinks a shrinking pattern is not a pattern.', 'It still has a start and a step.'],
        ['Reads where lines cross as the answer for both rules.', 'At that step both patterns have the same value.']
      ]
    }
  ]
});
