/* Teaching guide: Number line (Toolbox tool 'numberline', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('numberline', {
  what: 'A number line with up to 3 markers and jumps, for ordering, adding and subtracting in jumps, rounding and patterns.',
  keys: [
    ['Tray', 'Drag a marker onto the line, or tap it. Up to 3 markers.'],
    ['Move', 'Drag a marker along the line, or off the line to put it back.'],
    ['Jump', 'Drag the round handle by a marker to draw a jump, or tap a number under Jump by. Use + and − to jump forward or back.'],
    ['Zoom', 'Tap the line between two numbers to zoom in (0 to 100 becomes 30 to 40). Zoom out goes back.'],
    ['0 to 20, 0 to 100, 0 to 1 000, Blank', 'Choose the line. Blank has ticks but no numbers.'],
    ['Nearest ten, Nearest hundred', 'Shades the tens (or hundreds) around the chosen marker and marks halfway.'],
    ['Show number', 'Shows each marker’s number and the total of the jumps.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'Choose <b>0 to 100</b>. Drag a marker to about 30. Ask: “What number is it on?”',
        'Tap <b>10</b> under Jump by, twice. Ask: “Where is it now?” (50.)',
        'Turn on <b>Show number</b> to check together. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Where does it go?', codes: { 1: ['B1.3'], 2: ['B1.2'], 3: ['B1.2'] },
          goal: 'Numbers further right are bigger.',
          ido: 'Choose 0 to 100. Put one marker on 30 and one on 70. “70 is further right, so 70 is more.”',
          wedo: 'Put the third marker on 45 together: “Halfway between 40 and 50.”',
          youdo: { 1: 'On 0 to 20, the child places 12, 7 and 18, then says them from least to greatest.', 2: 'The child places 64, 46 and 81, then says them from least to greatest.', 3: 'On 0 to 1 000, the child places 450, 405 and 540, then orders them.' },
          ask: '“How did you know where to put it?”'
        },
        {
          t: 'Jump to add', codes: { 1: ['B2.4'], 2: ['B2.4'], 3: ['B2.3'] },
          goal: 'Add the tens first, then the ones.',
          ido: 'Put a marker on 38. Tap Jump by 10 twice, then 1 four times. “38 + 24 = 62.”',
          wedo: 'Do 27 + 15 together: one jump of 10, then 5 ones (42).',
          youdo: { 1: 'The child does 18 + 6 on 0 to 20, then 25 + 20 on 0 to 100.', 2: 'The child does 46 + 30 and 58 + 17.', 3: 'The child does 245 + 30 and 368 + 125 on 0 to 1 000, in big jumps first.' },
          ask: '“Which jump did you do first? Why?”'
        },
        {
          t: 'Jump back to subtract', codes: { 1: ['B2.4'], 2: ['B2.4'], 3: ['B2.3'] },
          goal: 'Take away by jumping back: tens first, then ones.',
          ido: 'Put a marker on 52. Choose −. Jump back 10, then 1 three times. “52 − 13 = 39.”',
          wedo: 'Do 45 − 20 together (25).',
          youdo: { 1: 'The child does 17 − 5 on 0 to 20, then 40 − 10.', 2: 'The child does 63 − 25 and 80 − 34.', 3: 'The child does 500 − 120 and 432 − 15.' },
          ask: '“How can you check your answer?” (Jump forward again.)'
        },
        {
          t: 'Count by 2s, 5s and 10s', codes: { 1: ['B1.5'], 2: ['B1.4'], 3: ['B1.4'] },
          goal: 'Equal jumps make a skip-counting pattern.',
          ido: 'Put a marker on 0. Tap Jump by 5 again and again, saying “5, 10, 15, 20.”',
          wedo: 'Start at 0 again and jump by 10 together, saying each number before you tap.',
          youdo: { 1: 'The child counts by 2s to 20 and by 10s to 50.', 2: 'The child counts by 25s to 200 on 0 to 1 000, then by 20s.', 3: 'The child counts by 50s and by 100s to 1000.' },
          ask: '“What comes next? How do you know?”'
        },
        {
          t: 'Round to the nearest ten', codes: { 3: ['B1.3'] },
          goal: 'Which ten is it closer to? Halfway (5) goes up.',
          ido: 'Put a marker on 47 and tap <b>Nearest ten</b>. “It is between 40 and 50, past halfway. 47 rounds to 50.”',
          wedo: 'Move the marker to 43, then 45, and decide together.',
          youdo: 'The child rounds 62, 88 and 350 (Nearest hundred: 350 rounds to 400).',
          ask: '“Which mark tells you which way to go?”'
        }
      ],
      mistakes: [
        ['Counts the tick marks instead of the jumps.', 'Count the spaces you jump, not the lines.'],
        ['Starts counting on the start number (38, 39, 40 for +2).', 'Say the start number, then count each jump: 39, 40.'],
        ['Puts 45 near 40.', 'Find halfway between the two tens first.'],
        ['Jumps forward when subtracting.', 'Check the − button is on, and say “back” for each jump.']
      ]
    },
    {
      grades: [4, 8],
      start: [
        'Choose <b>0 to 1 000</b>. Drag a marker to about 387. Ask: “About where is it?”',
        'Tap <b>Nearest hundred</b>. Ask: “Which hundred is it closer to?” (400.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Round to estimate', codes: { 4: ['B1.3', 'B2.4'], 5: ['B2.4'], 6: ['B2.4'] },
          goal: 'Round first to know about what the answer should be.',
          ido: 'Mark 387 and 245 with Nearest hundred. “About 400 and 200. So 387 + 245 is about 600.” Work it out on paper: 632. “Close to 600, so it makes sense.”',
          wedo: 'Estimate 812 − 395 together with the line (about 400), then work it out (417).',
          youdo: 'The child estimates, then works out, 649 + 278 and 905 − 487, and says if each answer makes sense.',
          ask: '“Is your answer close to your estimate? If not, what went wrong?”'
        },
        {
          t: 'Friendly jumps', codes: { 4: ['B2.4'], 5: ['B2.4'], 6: ['B2.4'] },
          goal: 'Subtract by counting up in friendly jumps.',
          ido: 'For 1000 − 368, put a marker on 368. Jump 2 to 370, 30 to 400, then 600 to 1000. “2 + 30 + 600 = 632.”',
          wedo: 'Do 700 − 245 together: 5, 50, 400 (455).',
          youdo: 'The child does 500 − 178 and 1000 − 455 by counting up.',
          ask: '“Why are 370 and 400 good places to land?”'
        },
        {
          t: 'Show an inequality', codes: { 4: ['C2.3'], 5: ['C2.4'], 6: ['C2.4'], 7: ['C2.4'], 8: ['C2.4'] },
          goal: 'An inequality has many answers. Find where they start.',
          ido: { 4: 'For n + 3 < 10, put a marker on 7: “7 + 3 is 10, not less than 10.” Mark 5 and 9 too: 5 works, 9 does not. “Every number less than 7 works.”', 5: 'For n + 15 < 40, put a marker on 25: “25 + 15 is 40, not less.” Mark 20 and 30: 20 works, 30 does not. “Every number less than 25 works.”', 6: 'For 2n + 3 < 15, put a marker on 6: “2 × 6 + 3 is 15, not less.” Mark 4 and 8: 4 works, 8 does not. “n < 6.”', 7: 'For 3n − 4 > 11, put a marker on 5: “3 × 5 − 4 is 11, not more.” Mark 3 and 8: 8 works, 3 does not. “n > 5.”', 8: 'For 2n + 7 ≥ 13, put a marker on 3: “2 × 3 + 7 is 13, so 3 works too.” Mark 1 and 6: 6 works, 1 does not. “n ≥ 3.”' },
          wedo: 'Together, draw the answer on paper: a dot on the boundary (open if it does not work, filled if it does) and an arrow the way the answers go.',
          youdo: { 4: 'The child does n + 5 < 12 and n − 2 > 8, testing with markers first.', 5: 'The child does n + 12 > 30 and 4n < 32, testing with markers first.', 6: 'The child does 3n + 1 > 16 and 2n − 4 < 10, testing with markers first.', 7: 'The child does 2n + 5 ≤ 17 and 4n − 3 > 25, testing with markers first.', 8: 'The child does 3n − 2 > 13 and 5n + 4 ≤ 39, testing with markers first, and checks one value below zero on paper.' },
          ask: '“Is the boundary number itself an answer? How do you know?”'
        },
        {
          t: 'Same jump each time', codes: { 4: ['C1.1'], 5: ['C1.1'], 6: ['C1.1'], 7: ['C1.1'], 8: ['C1.1'] },
          goal: 'A pattern that grows by the same jump each step is linear.',
          ido: { 4: 'Put a marker on 3 and jump by 5 four times: 3, 8, 13, 18, 23. “It grows by 5 each time.”', 5: 'Put a marker on 3 and jump by 5 four times: 3, 8, 13, 18, 23. Then start at 50 and jump back by 5: “This one shrinks by 5.”', 6: 'Put a marker on 3 and jump by 5 four times. “The same jump every time: a linear pattern.” Compare with 2, 4, 8, 16 on paper: not linear.', 7: 'Marker 1 starts at 2 and jumps by 5; marker 2 starts at 10 and jumps by 3. After 4 jumps both are on 22. “Different start, different step.”', 8: 'Marker 1 starts at 40 and jumps back by 6; marker 2 starts at 4 and jumps by 3. Ask: “Which shrinks? Where do they meet?” (After 4 jumps: 16.)' },
          wedo: 'Together, write the numbers in a table: step 0, 1, 2, 3, 4.',
          youdo: 'The child makes their own pattern on the line, then tells you the start and the jump.',
          ask: '“How can you tell from the table that it is linear?”'
        },
        {
          t: 'Predict far ahead', codes: { 6: ['C1.3'], 7: ['C1.3'], 8: ['C1.3'] },
          goal: 'Use the start and the jump to find any step without jumping every time.',
          ido: 'Start at 7, jump by 4. “Step 10 will be 7 + 10 × 4 = 47.” Jump 10 times to check.',
          wedo: 'Together, predict step 20 (87) and write the rule: 4n + 7.',
          youdo: 'The child makes a pattern, writes its rule, and predicts step 15 before checking.',
          ask: '“Which number in the rule is the start? Which is the jump?”'
        }
      ],
      mistakes: [
        ['Rounds 350 down to 300.', 'Use Nearest hundred: halfway goes up.'],
        ['Counts up but forgets one jump.', 'Write each jump on paper as you go, then add them.'],
        ['Includes the boundary in n + 3 < 10.', 'Test the boundary: 7 + 3 is 10, which is not less than 10.'],
        ['Calls 2, 4, 8, 16 linear.', 'Look at the jumps: 2, 4, 8. They change, so it is not linear.']
      ]
    }
  ]
});
