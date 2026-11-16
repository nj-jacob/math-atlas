/* Teaching guide: Arrays and area model (Toolbox tool 'areagrid', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('areagrid', {
  what: 'Rows and columns of dots, squares to cover, and from Grade 4 an area model, for equal groups, area and multiplying and dividing.',
  keys: [
    ['Arrays', 'Rows and columns of dots. Use − and + to change them (up to 12 by 12).'],
    ['Turn it', 'Swaps rows and columns (Grade 3 and up).'],
    ['Split', 'Tap between two columns to split the array in two (Grade 3 and up).'],
    ['Cover', 'Tap or drag over squares to cover a shape.'],
    ['Area model', 'From Grade 4: Multiply cuts a rectangle by place value; Divide builds the answer in chunks.'],
    ['Show number', 'Shows the facts, the area and the perimeter.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'In <b>Arrays</b>, make 3 rows of 4. Ask: “How many dots? How did you count?”',
        'Count by rows together: “4, 8, 12.”',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Equal rows', codes: { 1: ['B2.5'], 2: ['B2.5'], 3: ['B2.6'] },
          goal: 'An array is equal groups in rows.',
          ido: 'Make 2 rows of 5. “2 rows, 5 in each row. 5, 10.”',
          wedo: 'Add a row together. Ask: “How many now?” (15.)',
          youdo: { 1: 'The child makes 2 rows of 3 and 4 rows of 2 and counts them.', 2: 'The child makes 3 rows of 4 and 5 rows of 2 and says each as groups.', 3: 'The child makes 4 × 6 and 7 × 3 and writes each fact.' },
          ask: '“How many in each row? How many rows?”'
        },
        {
          t: 'Count by rows', codes: { 1: ['B1.5'], 2: ['B1.4'] },
          goal: 'Skip count by the number in each row.',
          ido: 'Make 4 rows of 5. Point to each row: “5, 10, 15, 20.”',
          wedo: 'Make 5 rows of 10 and count by 10s together.',
          youdo: 'The child makes 6 rows of 2 and counts by 2s.',
          ask: '“Why is counting by rows faster?”'
        },
        {
          t: 'Turn it', codes: { 2: ['B2.1'], 3: ['B2.1'] },
          goal: 'Turning an array does not change how many.',
          ido: 'Make 3 rows of 5. Tap <b>Turn it</b>: 5 rows of 3. “Still 15. 3 × 5 = 5 × 3.”',
          wedo: 'Together, make 2 rows of 7 and turn it.',
          youdo: 'The child makes 4 rows of 6, says the fact, turns it and says the turned fact.',
          ask: '“Which fact is easier for you? Why can you use either?”'
        },
        {
          t: 'Cover a shape', codes: { 1: ['E2.2'], 2: ['E1.2'], 3: ['E2.8', 'E2.9'] },
          goal: 'Area is how many squares cover a shape, with no gaps or overlaps.',
          ido: 'In <b>Cover</b>, drag over a 4 by 3 rectangle. “12 squares cover it.”',
          wedo: { 1: 'Together, cover a long thin shape and a short wide one. Which covers more?', 2: 'Together, cover 12 squares as a different shape. “Same squares, same area.”', 3: 'Together, cover a 5 by 2 rectangle and read its area in cm² (10 cm²).' },
          youdo: { 1: 'The child makes two shapes and says which covers more.', 2: 'The child makes two different shapes with 8 squares each.', 3: 'The child makes two shapes with 12 cm² and compares their perimeters.' },
          ask: '“What happens if we leave a gap?”'
        },
        {
          t: 'Split an array', codes: { 3: ['B2.6'] },
          goal: 'Split a hard fact into two easy ones.',
          ido: 'Make 3 rows of 7. Tap between columns 5 and 6. “3 × 5 is 15, 3 × 2 is 6. 15 + 6 = 21.”',
          wedo: 'Together: 4 × 8 split into 4 × 5 and 4 × 3 (32).',
          youdo: 'The child splits 6 × 7 and 3 × 9 into facts they know.',
          ask: '“Where is a good place to split? Why?”'
        },
        {
          t: 'Share into rows', codes: { 2: ['B2.6'], 3: ['B2.6'] },
          goal: 'Dividing is putting things into equal rows.',
          ido: 'Make 12 dots as 3 rows of 4. “12 shared into 3 rows: 4 in each. 12 ÷ 3 = 4.”',
          wedo: 'Together: 15 into 5 rows (3 each).',
          youdo: { 2: 'The child shares 10 into 2 rows and 12 into 4 rows.', 3: 'The child shares 24 into 6 rows and 30 into 5, and writes each division.' },
          ask: '“Which multiplication fact helps?”'
        }
      ],
      mistakes: [
        ['Counts dots one by one every time.', 'Count by rows: 4, 8, 12.'],
        ['Thinks 3 × 5 and 5 × 3 are different amounts.', 'Tap Turn it and check: same dots.'],
        ['Leaves gaps when covering.', 'Cover again: no gaps, no overlaps.'],
        ['Mixes up rows and columns.', 'Rows go across, like rows of seats.']
      ]
    },
    {
      grades: [4, 8],
      start: [
        'In <b>Area model</b>, choose Multiply and make 34 × 6. Ask: “What are the two parts?”',
        'Point to each part: 30 × 6 = 180 and 4 × 6 = 24. Ask: “What is the total?” (204.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Length times width', codes: { 4: ['E2.5', 'E2.6'], 5: ['E2.6'], 8: ['E2.3'] },
          goal: 'The area of a rectangle is rows times columns.',
          ido: { 4: 'In <b>Cover</b>, cover a 4 by 3 rectangle. “4 squares in a row, 3 rows: 4 × 3 = 12 cm².”', 5: 'In <b>Cover</b>, make a 6 by 2 rectangle and a 4 by 3 one. “Both 12 cm², but perimeters 16 cm and 14 cm.”', 8: 'In <b>Cover</b>, cover an L shape. “Split it into two rectangles: 4 × 2 + 2 × 3 = 14 cm².”' },
          wedo: { 4: 'Together, find the missing side: area 24 cm², length 6 cm (4 cm).', 5: 'Together, make another shape with 12 cm² and a bigger perimeter.', 8: 'Together, cover a U shape and find its area by splitting.' },
          youdo: { 4: 'The child finds the area of a 7 by 5 rectangle and a missing side for 36 cm² with length 9 cm.', 5: 'The child makes the rectangle with 20 cm² and the smallest perimeter.', 8: 'The child finds the area of a T shape two ways: adding parts and subtracting from a rectangle.' },
          ask: '“Why does multiplying give the same answer as counting?”'
        },
        {
          t: 'Multiply with the area model', codes: { 4: ['B2.5'], 5: ['B2.6'], 6: ['B2.7'], 7: ['B2.9'] },
          goal: 'Split each number by place value and add the parts.',
          ido: { 4: 'Multiply 34 × 6: 30 × 6 = 180 and 4 × 6 = 24. “180 + 24 = 204.”', 5: 'Multiply 23 × 14: 200 + 80 + 30 + 12 = 322.', 6: 'Turn on Tenths. Multiply 24 × 0.6: 20 × 0.6 = 12 and 4 × 0.6 = 2.4. “14.4.”', 7: 'Multiply 1.2 × 2.5: 2 + 0.5 + 0.4 + 0.1 = 3.' },
          wedo: { 4: 'Together: 52 × 3 (150 + 6 = 156).', 5: 'Together: 36 × 21 (756).', 6: 'Together: 15 × 0.4 (6).', 7: 'Together: 2.4 × 1.5 (3.6).' },
          youdo: { 4: 'The child does 47 × 5 and 68 × 4, and writes the parts.', 5: 'The child does 42 × 17 and 58 × 23.', 6: 'The child does 32 × 0.7 and 105 × 0.3.', 7: 'The child does 3.5 × 1.2 and 0.6 × 0.8.' },
          ask: '“Which part is the biggest? Does your answer make sense?”'
        },
        {
          t: 'Divide with the area model', codes: { 4: ['B2.6'], 5: ['B2.7'], 6: ['B2.1'], 7: ['B2.1'], 8: ['B2.1'] },
          goal: 'Build the answer in friendly chunks.',
          ido: { 4: 'Choose Divide: 96 ÷ 4. “4 × 20 = 80, 16 left. 4 × 4 = 16. 20 + 4 = 24.”', 5: 'Choose Divide: 384 ÷ 12. “12 × 30 = 360, 24 left. 12 × 2 = 24. 32.”', 6: 'Choose Divide: 552 ÷ 12. “12 × 40 = 480, 72 left. 12 × 6 = 72. 46.”', 7: 'Choose Divide: 875 ÷ 25. “25 × 30 = 750, 125 left. 25 × 5 = 125. 35.”', 8: 'Choose Divide: 744 ÷ 24. “24 × 30 = 720, 24 left. 24 × 1 = 24. 31.”' },
          wedo: { 4: 'Together: 87 ÷ 5 (17, 2 left over, or 17 2/5).', 5: 'Together: 275 ÷ 11 (25).', 6: 'Together: 630 ÷ 15 (42).', 7: 'Together: 912 ÷ 16 (57).', 8: 'Together: 950 ÷ 25 (38).' },
          youdo: { 4: 'The child does 78 ÷ 3 and 125 ÷ 6.', 5: 'The child does 448 ÷ 14 and 500 ÷ 12.', 6: 'The child does 728 ÷ 14 and checks by multiplying.', 7: 'The child does 966 ÷ 23 and checks by multiplying.', 8: 'The child does 952 ÷ 34 and checks by multiplying.' },
          ask: '“How did you choose the first chunk?”'
        },
        {
          t: 'Split to multiply in your head', codes: { 4: ['B2.1'], 5: ['B2.1'], 6: ['B2.1'], 7: ['B2.1'], 8: ['B2.1'] },
          goal: 'Splitting one factor makes a hard product easy.',
          ido: 'In <b>Arrays</b>, make 6 by 12. Tap between columns 10 and 11. “6 × 10 + 6 × 2 = 60 + 12 = 72.”',
          wedo: 'Together: 7 × 12 as 7 × 10 + 7 × 2 (84). Write it as 7 × (10 + 2).',
          youdo: 'The child works out 8 × 12 and 9 × 11 by splitting, and writes the brackets version.',
          ask: '“Why does the split give the same answer?”'
        }
      ],
      mistakes: [
        ['34 × 6 = 184 (only multiplies the 4).', 'Show both parts in the area model: 30 × 6 is a part too.'],
        ['Confuses area and perimeter.', 'Area covers the inside. Perimeter goes around the outside.'],
        ['Divides and forgets the remainder.', 'Look at what is left over after the last chunk.'],
        ['Places the decimal point by guessing.', 'Estimate first: 24 × 0.6 is a bit more than half of 24.']
      ]
    }
  ]
});
