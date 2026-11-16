/* Teaching guide: Balance (Toolbox tool 'balance', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('balance', {
  what: 'A pan balance for seeing that = means “the same as”, and from Grade 4 for solving equations and inequalities.',
  keys: [
    ['Tray', 'Tap or drag cubes (1), tens (Grade 2 and up), bags holding a hidden x (Grade 4 and up), 0.1 pieces (Grade 7 and up) or −1 balloons (Grade 8) onto a side.'],
    ['Free', 'Build anything. The beam tips to the heavier side.'],
    ['Make it balance', 'Dashed cubes show what the lighter side needs.'],
    ['Solve', 'Grade 4 and up: take the same from both sides, split both sides, peek in the bag, or get a new puzzle.'],
    ['Try numbers', 'Grade 4 and up: pick <, = or >, put a number in the bag, and see on a number line which numbers work.'],
    ['Show number', 'Writes each side, such as 5 + 3 = 4 + 4.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'Put 5 cubes on the left and 3 on the right. Ask: “Which side is heavier? Why?”',
        'Add cubes to the right until it balances. Ask: “How many did you add?” (2.)',
        'Turn on <b>Show number</b>: 5 = 3 + 2. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Balanced means the same', codes: { 1: ['C2.2'], 2: ['C2.2'], 3: ['C2.2'] },
          goal: 'The equal sign means both sides are worth the same.',
          ido: { 1: 'Put 5 + 3 on the left (two colours) and 4 + 4 on the right. “It balances. 5 + 3 = 4 + 4.”', 2: 'Put 9 + 6 on the left and 10 + 5 on the right. “It balances. 9 + 6 = 10 + 5.”', 3: 'Put 3 groups of 4 on the left and 6 + 6 on the right. “It balances. 3 × 4 = 6 + 6.”' },
          wedo: { 1: 'Together: does 6 + 1 balance 3 + 3? Predict first, then build.', 2: 'Together: does 12 − 4 balance 5 + 3? (Build 8 on the left.)', 3: 'Together: does 2 × 6 balance 4 × 3?' },
          youdo: { 1: 'The child finds two different ways to balance 7.', 2: 'The child finds three ways to balance 15.', 3: 'The child finds a multiplication and an addition that balance 18.' },
          ask: '“Does = mean “the answer comes next”, or “the same as”?”'
        },
        {
          t: 'What is missing?', codes: { 1: ['C2.3'], 2: ['C2.1'], 3: ['C2.1'] },
          goal: 'Find what the lighter side needs.',
          ido: 'Put 8 on the left and 5 on the right. Tap <b>Make it balance</b>. “3 dashed cubes: 5 + 3 = 8.”',
          wedo: { 1: 'Together: 10 on one side, 6 on the other. How many more?', 2: 'Together: 14 on the left, 9 on the right. Write 9 + □ = 14.', 3: 'Together: 20 on the left, 12 on the right. Write 12 + n = 20.' },
          youdo: { 1: 'The child balances 7 with 4 and something, then 9 with 5 and something.', 2: 'The child solves □ + 6 = 15 and 18 = 10 + □.', 3: 'The child solves n + 25 = 40 and 3 × n = 15 with the balance.' },
          ask: '“How did you know how many to add?”'
        },
        {
          t: 'Many ways to make a number', codes: { 1: ['C2.3'], 2: ['C2.3'], 3: ['C2.3'] },
          goal: 'One number can be made in many ways.',
          ido: { 1: 'Put 10 on the left. On the right, make 6 + 4. “It balances.” Change it to 7 + 3.', 2: 'Put 25 on the left. Make 20 + 5, then 10 + 10 + 5 on the right.', 3: 'Put 100 on the left. Make 50 + 50, then 4 × 25 on the right.' },
          wedo: 'Together, find one more way and write it as an equation.',
          youdo: 'The child writes three equations for the same number, building each to check.',
          ask: '“Which way is your favourite? Why?”'
        }
      ],
      mistakes: [
        ['Reads 5 + 3 = 4 + 4 as false because 5 + 3 = 8.', 'Build both sides. The balance shows they are the same.'],
        ['Thinks = means “write the answer”.', 'Say “is the same as” for = every time.'],
        ['Adds to the heavier side to balance.', 'Point to the side that is up: that side needs more.'],
        ['In 9 + □ = 14, writes 23.', 'Build it: 14 on one side, 9 on the other. What makes them level?']
      ]
    },
    {
      grades: [4, 8],
      start: [
        'Put a bag (x) and 3 cubes on the left, 7 cubes on the right. Ask: “What could be in the bag?”',
        'In <b>Solve</b>, take 3 cubes from both sides. Ask: “What is in the bag?” (4.)',
        'Peek in the bag to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Do the same to both sides', codes: { 4: ['C2.2'], 5: ['C2.3'], 6: ['C2.3'], 7: ['C2.3'], 8: ['C2.3'] },
          goal: 'Whatever you do to one side, do to the other. It stays balanced.',
          ido: { 4: 'Make x + 12 = 30 (a bag and 1 ten 2 cubes; 3 tens). Take 12 from both sides. “x = 18.”', 5: 'Make 4x = 48. Split both sides into 4. “x = 12.”', 6: 'Type 2x + 3 = 11. Take 3 from both sides, then split into 2. “x = 4.”', 7: 'Make 3x + 2 = x + 8. Take a bag from both sides, then 2 cubes. “2x = 6, x = 3.”', 8: 'Make x + 4 = −2 with balloons. Add −4 to both sides and cancel. “x = −6.”' },
          wedo: { 4: 'Together: x + 7 = 25.', 5: 'Together: 3x = 36.', 6: 'Together: 3x + 5 = 20.', 7: 'Together: 4x + 1 = 2x + 9.', 8: 'Together: 2x + 6 = −2.' },
          youdo: { 4: 'The child solves 15 + x = 42 and checks by peeking.', 5: 'The child solves 5x = 45 and x + 23 = 61.', 6: 'The child solves 4x − 3 = 21 on paper, then on the balance.', 7: 'The child solves 5x + 3 = 2x + 15.', 8: 'The child solves 3x − 5 = 7 and x + 9 = 2.' },
          ask: '“Why do we take the same from both sides?”'
        },
        {
          t: 'Try numbers', codes: { 4: ['C2.3'], 5: ['C2.4'], 6: ['C2.4'], 7: ['C2.4'], 8: ['C2.4'] },
          goal: 'An inequality has many answers. Test numbers to find where they start.',
          ido: { 4: 'Choose <b>Try numbers</b> and <. Make x + 3 < 9. Try 4: true. Try 6: false. “Every number less than 6 works.”', 5: 'Make 3x < 21. Try 5 and 7. “x < 7.”', 6: 'Make 2x + 1 > 9. Try 3, 4 and 5. “x > 4.”', 7: 'Make 2x + 3 ≤ 13. Try 4, 5 and 6. “x ≤ 5.”', 8: 'Make x + 6 > 2. Try −5, −4 and −3. “x > −4.”' },
          wedo: 'Together, look at the number line: green numbers work. Say where the green starts and which way it goes.',
          youdo: 'The child makes their own inequality, predicts the answers, then tests three numbers.',
          ask: '“Is the boundary number an answer? How do you know?”'
        },
        {
          t: 'Write what you see', codes: { 4: ['C2.1'], 5: ['C2.1'], 6: ['C2.2'], 7: ['C2.2'], 8: ['C2.2'] },
          goal: 'The balance, the words and the equation say the same thing.',
          ido: 'Build 3 bags and 2 cubes on the left, 14 cubes on the right. Say: “Three bags and two make fourteen.” Write 3x + 2 = 14.',
          wedo: { 4: 'Together, write the equation for 2 bags and 5 cubes balancing 17.', 5: 'Together, write the equation for 4 bags and 1 cube balancing 21.', 6: 'Together, peek in the bag (x = 4) and work out 3x + 2: 14.', 7: 'Together, work out 3x + 2 for x = 2.5 on paper.', 8: 'Together, work out 3x + 2 for x = −2 on paper (−4).' },
          youdo: 'The child builds a balance from an equation you give, then writes a word story for it.',
          ask: '“What does the bag stand for in your story?”'
        }
      ],
      mistakes: [
        ['Takes 3 from one side only.', 'Watch the beam tip. Do it to both sides.'],
        ['Solves 4x = 48 by subtracting 4.', 'Four bags: split both sides into 4 equal groups.'],
        ['Includes the boundary for <.', 'Test it: 6 + 3 = 9 is not less than 9.'],
        ['Forgets to check the answer.', 'Peek in the bag, or put the number back in the equation.']
      ]
    }
  ]
});
