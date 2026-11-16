/* Teaching guide: Counters and ten-frames (Toolbox tool 'counters', Grades 1 to 3). Format: see assets/engine/guide.js. */
AtlasGuide.add('counters', {
  what: 'Red and yellow counters on a free mat or on ten-frames, for counting, adding, even and odd, and sharing.',
  keys: [
    ['Tray', 'Tap a red or yellow counter, or drag it onto the mat.'],
    ['Turn over', 'Tap a counter on the mat to turn it over: red becomes yellow.'],
    ['Take away', 'Drag a counter off the mat.'],
    ['Free mat, 1 ten-frame, 2 ten-frames', 'Choose the mat. A counter dropped on a frame snaps into a box.'],
    ['Pair up', 'Lines the counters up in pairs, to see even and odd.'],
    ['Rows of ten', 'Lines the counters up in tens, to count them quickly.'],
    ['Share into…', 'Shares the counters into 2 to 10 equal groups, with any left over to the side.'],
    ['Show number', 'Shows how many. Leave it off while the child counts, then turn it on to check.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'Choose <b>1 ten-frame</b>. Tap 7 red counters. Ask: “How many empty boxes?” (3.)',
        'Tap 3 yellow counters to fill it. Say: “7 and 3 make 10.”',
        'Tap one red counter to turn it over. Ask: “Is it still 10?” Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Partners of 10', codes: { 1: ['B2.2', 'C2.3'], 2: ['B2.2', 'C2.3'], 3: ['C2.3'] },
          goal: 'Every full ten-frame shows two numbers that make 10.',
          ido: 'On 1 ten-frame, tap 6 red. Point to the empty boxes: “4 empty. 6 and 4 make 10.” Fill them with yellow.',
          wedo: 'Turn one red counter over. Together: “Now 5 red, 5 yellow. 5 and 5 make 10.” Turn over one more (4 and 6).',
          youdo: 'The child turns counters over one at a time and says each pair (3 and 7, 2 and 8…) without counting every box.',
          ask: '“How do you know it is 4 empty without counting?”'
        },
        {
          t: 'Make a ten to add', codes: { 1: ['B1.2', 'B2.3'], 2: ['B2.3'], 3: ['B2.3'] },
          goal: 'Fill the first ten-frame first. Then it is 10 and some more.',
          ido: 'Choose <b>2 ten-frames</b>. Tap 8 red, then 5 yellow. “The first frame is full: 10. Three more: 13. So 8 + 5 = 13.”',
          wedo: 'Clear and do 9 + 4 together. Ask: “How many yellow went into the first frame?” (1.) “So 10 and 3.”',
          youdo: { 1: 'The child does 7 + 6 and 8 + 8, saying “10 and…” each time, then checks with Show number.', 2: 'The child does 7 + 6, 8 + 8 and 9 + 7, saying “10 and…” each time, then checks with Show number.', 3: 'The child does 8 + 7 and 9 + 6, then uses the same idea in their head: 48 + 7 is 50 and 5.' },
          ask: '“Why is it easier once the first frame is full?”'
        },
        {
          t: 'Even or odd', codes: { 2: ['B1.5'] },
          goal: 'A number is even when every counter has a partner.',
          ido: 'Free mat. Tap 8 counters and tap <b>Pair up</b>. “Every counter has a partner. 8 is even.” Add one: “This one is alone. 9 is odd.”',
          wedo: 'Tap 12, then 15. Before Pair up, ask the child to predict even or odd. Pair up to check.',
          youdo: 'The child tests 6, 11, 14 and 17, and says the rule in their own words.',
          ask: '“What do even numbers end in?”'
        },
        {
          t: 'Share fairly', codes: { 1: ['B1.6'], 2: ['B2.6'], 3: ['B2.1', 'B2.6'] },
          goal: 'Sharing puts the same number in every group. Some may be left over.',
          ido: 'Free mat. Tap 12 counters. Tap <b>Share into…</b> 3. “12 shared into 3 groups: 4 in each.”',
          wedo: { 1: 'Share 10 into 2 together, then 10 into 4: “2 in each, 2 left over. What could we do with those?” (Cut them in halves.)', 2: 'Share 14 into 4 together: 3 in each, 2 left over.', 3: 'Share 20 into 4 together, then write 20 ÷ 4 = 5 and 4 × 5 = 20.' },
          youdo: { 1: 'The child shares 8 into 2 and 9 into 2, and says what to do with the one left over.', 2: 'The child shares 12 into 2, 3, 4 and 6 and says how many each time.', 3: 'The child shares 18 into 3 and 6, and writes the division and the multiplication for each.' },
          ask: '“How can you check every group has the same?”'
        },
        {
          t: 'Guess, then count', codes: { 1: ['B1.4'], 2: ['B1.3'] },
          goal: 'Make a good guess, then count in tens to check.',
          ido: 'Free mat, Show number off. Tap about 30 counters. Say: “I think about 30.” Tap <b>Rows of ten</b> and count: “10, 20, 30, and 4: 34. Close.”',
          wedo: 'Clear and tap a new handful. Both guess, then use Rows of ten to count together.',
          youdo: { 1: 'The child guesses and checks two more piles, up to 50.', 2: 'The child guesses and checks two more piles, up to 100.' },
          ask: '“Was your guess too many or too few? How will you guess next time?”'
        },
        {
          t: 'Equal groups', codes: { 1: ['B2.5'], 2: ['B2.5'], 3: ['B2.6'] },
          goal: 'Multiplying means equal groups.',
          ido: 'Free mat. Tap 15 counters. Tap <b>Share into…</b> 3. “3 groups of 5. 5, 10, 15.”',
          wedo: 'Tap 8. Share into 2. Together: “2 groups of 4 is 8.” Then share into 4.',
          youdo: { 1: 'The child makes 2 groups of 3 and 2 groups of 5, and counts them.', 2: 'The child makes 4 groups of 3 and 5 groups of 2, and says each total.', 3: 'The child makes 6 groups of 3 and 4 groups of 5, and writes the multiplication for each.' },
          ask: '“Is 3 groups of 5 the same as 5 groups of 3?”'
        }
      ],
      mistakes: [
        ['Counts some counters twice.', 'Line them up with Rows of ten or Pair up, and count in order.'],
        ['Thinks 5 and 3 is different from 3 and 5.', 'Turn the counters over so the colours swap. The total stays.'],
        ['Ignores the counters left over when sharing.', 'Point to them: “These have not been shared yet. What can we do?”'],
        ['Counts the empty boxes instead of the counters.', 'Point to the counters only, then say how many boxes are empty.']
      ]
    }
  ]
});
