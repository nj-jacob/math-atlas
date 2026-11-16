/* Teaching guide: Number chart (Toolbox tool 'hundred', Grades 1 to 4). Format: see assets/engine/guide.js. */
AtlasGuide.add('hundred', {
  what: 'A 10 by 10 chart of numbers, for counting, skip counting, patterns and seeing jumps of ten and one.',
  keys: [
    ['Colour it', 'Choose a pen colour, then tap squares to colour them.'],
    ['2, 3, 4, 5, 10, 25', 'Skip count: colours every 2nd, 3rd, 4th, 5th, 10th or 25th number, one after another.'],
    ['Jump from… to…', 'Tap a start and an end. A path shows the jumps of ten (down or up) and of one (across).'],
    ['Hide some', 'Blanks a few numbers. Tap one to show it.'],
    ['1 to 100, 101 to 200, 0 to 99', 'Choose which numbers the chart shows.'],
    ['Show number', 'Shows the sum of a jump.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 4],
      start: [
        'Tap <b>5</b>. Every 5th number lights up. Read them together: “5, 10, 15, 20…”',
        'Ask: “What do you notice?” (They make two columns. They end in 5 or 0.)',
        'Tap <b>Hide some</b> and ask the child to find one hidden number. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Skip count', codes: { 1: ['B1.5'], 2: ['B1.4'], 3: ['B1.4'], 4: ['B2.2'] },
          goal: 'Skip counting makes a pattern on the chart.',
          ido: 'Tap <b>10</b>. Read the coloured column aloud: “10, 20, 30… 100.” “Counting by 10 goes straight down.”',
          wedo: 'Choose a new colour and tap <b>2</b>. Read the first row together. Ask: “Where do the 2s land?” (Every other column.)',
          youdo: { 1: 'The child counts by 5s to 50 and by 2s to 30, reading the coloured numbers.', 2: 'The child chooses 101 to 200 and counts by 25s and by 10s from 101.', 3: 'The child counts by 4s and by 25s, and says what pattern each makes.', 4: 'The child colours the 3s and the 4s, and reads the 4 times table from the chart.' },
          ask: '“Can you say the next one before it lights up?”'
        },
        {
          t: 'Ten more, ten less', codes: { 1: ['B1.2'], 2: ['B2.3'], 3: ['B2.3'] },
          goal: 'Down one row is ten more. Across one square is one more.',
          ido: 'Tap <b>Jump from… to…</b>, then 23 and 47. “Down 2 rows: 20 more. Across 4: 4 more. 23 + 24 = 47.”',
          wedo: 'Jump from 35 to 68 together. Ask before tapping: “How many rows down? How many across?” (33.)',
          youdo: 'The child picks two numbers, says the jump first, then taps to check with Show number.',
          ask: '“Why does the ones digit stay the same when you go down?”'
        },
        {
          t: 'Even and odd', codes: { 2: ['B1.5'] },
          goal: 'Counting by 2 from 2 colours the even numbers.',
          ido: 'Tap <b>2</b>. “These are the even numbers. The ones left white are odd.”',
          wedo: 'Read the last digits of the coloured numbers together: 2, 4, 6, 8, 0.',
          youdo: 'The child says if 46, 73, 90 and 101 are even or odd, and points to the column that proves it.',
          ask: '“How can you tell 136 is even without the chart?”'
        },
        {
          t: 'Find the hidden numbers', codes: { 1: ['C1.4'], 2: ['C1.4'], 3: ['C1.4'], 4: ['C1.1'] },
          goal: 'Use the numbers around a square to work it out.',
          ido: 'Tap <b>Hide some</b>. Point to a blank square. “Above it is 35. Down is ten more. It is 45.” Tap it to check.',
          wedo: 'Find two more together. Each time, say which neighbour helped.',
          youdo: 'The child finds the rest and explains each one before tapping it.',
          ask: '“Which neighbour helped you most?”'
        },
        {
          t: 'Round to the nearest ten', codes: { 3: ['B1.3'], 4: ['B1.3'] },
          goal: 'Numbers ending in 5 or more go up to the next ten.',
          ido: 'Choose one colour and tap 41 to 44. Choose another and tap 45 to 49. “The first colour rounds to 40, the second to 50.”',
          wedo: 'Do 51 to 59 together. Ask where 55 goes and why.',
          youdo: 'The child rounds 67, 72, 85 and 98 and points to the row that shows it.',
          ask: '“Why does 45 round up to 50?”'
        }
      ],
      mistakes: [
        ['Says 10 more than 37 is 38.', 'Show the jump: down one row is ten more. Across is one more.'],
        ['Thinks the next row starts at 11 after 100.', 'Choose 101 to 200 and read the first column: 101, 111, 121.'],
        ['Skip counts but misses a number.', 'Let the chart light them one by one and read along.'],
        ['Rounds 45 down to 40.', 'Show the two colours: 5 to 9 go up.']
      ]
    }
  ]
});
