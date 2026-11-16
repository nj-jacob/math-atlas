/* Teaching guide: Times grid (Toolbox tool 'times', Grades 3 to 8). Format: see assets/engine/guide.js. */
AtlasGuide.add('times', {
  what: 'A times table you can tap, plus factors, primes and squares, for learning facts and seeing how numbers are built.',
  keys: [
    ['Times grid', 'Tap a square to light its rectangle, its turned fact and every other place with the same product (10 by 10 in Grade 3, 12 by 12 from Grade 4).'],
    ['Factors', 'From Grade 4: every rectangle a number of squares can make, and its factor pairs. Change the number with − and +.'],
    ['Primes', 'From Grade 6: cross out the multiples of 2, 3, 5 and 7 in turn on a 1 to 100 chart.'],
    ['Squares', 'From Grade 7: a number drawn as the biggest square it holds, with its square root.'],
    ['Show number', 'Shows the facts and answers.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [3, 4],
      start: [
        'Tap the square for 4 × 6. Ask: “How many small squares in the rectangle?” (24.)',
        'Point to the other lit squares. Ask: “Why do these light up too?” (They are also 24.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'A fact and its turn', codes: { 3: ['B2.2'], 4: ['B2.2'] },
          goal: 'Every fact has a turned partner with the same answer.',
          ido: 'Tap 3 × 5. “3 rows of 5: 15. And 5 × 3 lights up too: same answer.”',
          wedo: { 3: 'Tap 2 × 8 together and find its partner.', 4: 'Tap 6 × 7 together and find its partner.' },
          youdo: { 3: 'The child says the 5 times table, tapping each fact to check.', 4: 'The child taps 7 × 8, 9 × 6 and 12 × 4 and says each fact both ways.' },
          ask: '“If you know 3 × 5, what else do you know?”'
        },
        {
          t: 'Use a fact to divide', codes: { 3: ['B2.1'], 4: ['B2.1'] },
          goal: 'A times fact gives two division facts.',
          ido: 'Tap 4 × 6. “4 × 6 = 24, so 24 ÷ 4 = 6 and 24 ÷ 6 = 4.”',
          wedo: 'Together: find 35 ÷ 5 by looking for 35 in the 5 row.',
          youdo: { 3: 'The child finds 20 ÷ 2, 40 ÷ 10 and 30 ÷ 5 on the grid.', 4: 'The child finds 42 ÷ 7, 56 ÷ 8 and 81 ÷ 9 on the grid.' },
          ask: '“Which row did you look in? Why?”'
        },
        {
          t: 'Patterns in the table', codes: { 3: ['C1.1'], 4: ['C1.1'] },
          goal: 'Each row grows by the same amount.',
          ido: 'Tap along the 5 row: 5, 10, 15, 20. “It grows by 5 each time, and ends in 5 or 0.”',
          wedo: 'Look at the 10 row and the 2 row together. What patterns do they make?',
          youdo: 'The child finds a pattern in the 9 row and explains it.',
          ask: '“Can you predict the next number?”'
        },
        {
          t: 'Factors', codes: { 4: ['B2.2'] },
          goal: 'Factors are the numbers that multiply to make a number.',
          ido: 'Open <b>Factors</b> with 24. “24 squares make 1 × 24, 2 × 12, 3 × 8 and 4 × 6.”',
          wedo: 'Together: find every rectangle for 18.',
          youdo: 'The child finds the factors of 36 and 13.',
          ask: '“Why does 13 make only one rectangle?”'
        }
      ],
      mistakes: [
        ['Mixes up 6 × 7 and 6 + 7.', 'Show the rectangle: 6 rows of 7.'],
        ['Counts every square to find a product.', 'Use a fact you know and add a row.'],
        ['Thinks 24 ÷ 4 and 4 ÷ 24 are the same.', 'Divide means share 24 into 4 rows.'],
        ['Misses a factor pair.', 'Go in order: 1, 2, 3, 4… and stop when they meet.']
      ]
    },
    {
      grades: [5, 8],
      start: [
        'Open <b>Factors</b> with 24. Ask: “How many different rectangles can 24 squares make?”',
        'List the factor pairs together: 1 × 24, 2 × 12, 3 × 8, 4 × 6.',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Factor pairs', codes: { 5: ['B2.2'], 6: ['B2.6'], 7: ['B2.6'] },
          goal: 'Factors come in pairs that multiply to the number.',
          ido: 'Open Factors with 36. “1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6. The pairs meet at 6.”',
          wedo: { 5: 'Together: find the factors of 48.', 6: 'Together: find the factors of 60, then build a factor tree on paper (2 × 2 × 3 × 5).', 7: 'Together: find the factors of 18 and 24, and their greatest common factor (6).' },
          youdo: { 5: 'The child finds the factors of 30 and 42.', 6: 'The child writes 72 and 90 as products of primes.', 7: 'The child finds the GCF and the LCM of 12 and 18 (6 and 36).' },
          ask: '“How do you know you found them all?”'
        },
        {
          t: 'Times facts to 12', codes: { 5: ['B2.2'], 6: ['B2.2'] },
          goal: 'Use facts you know to find ones you do not.',
          ido: 'Tap 12 × 7. “10 × 7 is 70, 2 × 7 is 14: 84.”',
          wedo: { 5: 'Together: 11 × 8 and 12 × 9.', 6: 'Together: is 96 divisible by 4? Find 96 in the grid: 8 × 12. Since 8 = 2 × 4, yes.' },
          youdo: { 5: 'The child says the 12 times table, tapping each to check.', 6: 'The child tests 72, 84 and 90 for divisibility by 3, 4 and 6.' },
          ask: '“Which fact helped you?”'
        },
        {
          t: 'Use a fact to divide', codes: { 5: ['B2.7'] },
          goal: 'Times facts make division quick.',
          ido: 'Tap 12 × 6. “12 × 6 = 72, so 72 ÷ 12 = 6.”',
          wedo: 'Together: 132 ÷ 12 (11).',
          youdo: 'The child does 96 ÷ 8, 108 ÷ 9 and 121 ÷ 11.',
          ask: '“How does knowing 12 × 6 help with 720 ÷ 12?”'
        },
        {
          t: 'Primes', codes: { 6: ['B2.6'], 7: ['B2.6'] },
          goal: 'A prime has exactly two factors: 1 and itself.',
          ido: 'Open <b>Primes</b>. Cross out the multiples of 2, then 3, then 5, then 7. “What is left are the primes.”',
          wedo: 'Together, check 23 and 27 with Factors.',
          youdo: 'The child lists the primes between 50 and 70 and checks one.',
          ask: '“Why is 1 not prime?”'
        },
        {
          t: 'Squares and roots', codes: { 7: ['B1.2'], 8: ['B1.3', 'B2.2'] },
          goal: 'A square number makes a square. Its side is the square root.',
          ido: 'Open <b>Squares</b> with 36. “A 6 by 6 square. √36 = 6.”',
          wedo: 'Together: 49 and 64.',
          youdo: 'The child finds the square roots of 81, 100 and 144.',
          ask: '“Why is 12 not a square number?”'
        },
        {
          t: 'Estimate a root', codes: { 7: ['B1.2'], 8: ['B1.3'] },
          goal: 'A non-square number’s root sits between two whole numbers.',
          ido: 'Open Squares with 40. “The biggest square is 36, with 4 left. √40 is between 6 and 7, closer to 6.”',
          wedo: 'Together: estimate √70 (between 8 and 9).',
          youdo: 'The child estimates √20 and √95 to one decimal place and checks on a calculator.',
          ask: '“Is √50 closer to 7 or to 8? Why?”'
        },
        {
          t: 'Order roots and numbers', codes: { 8: ['B1.2'] },
          goal: 'Estimate roots to put them in order with other numbers.',
          ido: 'Open Squares with 50. “√50 is just over 7.” Compare: 7 < √50 < 7.5.',
          wedo: 'Together: order √10, 3.5 and π.',
          youdo: 'The child orders √2, 1.5 and 7/5.',
          ask: '“How did you estimate √10?”'
        }
      ],
      mistakes: [
        ['Calls 1 a prime.', 'Check Factors: 1 has only one factor.'],
        ['Thinks √40 = 20.', 'Square root is the side of the square, not half.'],
        ['Stops listing factors too soon.', 'Keep going until the pairs meet.'],
        ['Thinks every odd number is prime.', 'Check 9, 15 and 21 with Factors.']
      ]
    }
  ]
});
