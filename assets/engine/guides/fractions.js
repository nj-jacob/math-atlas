/* Teaching guide: Fraction kit (Toolbox tool 'fractions', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('fractions', {
  what: 'Fraction pieces under a whole, seen at once as strips, circles, counters and a number line, for sharing, equal fractions and calculating.',
  keys: [
    ['Tray', 'Tap or drag a piece (a whole, a half, a third…) onto the mat. From Grade 4, a Decimals tab adds 0.1 pieces and smaller.'],
    ['See it as', 'Shows the same amount as strips, a circle, counters, a number line and, from Grade 4, a grid and symbols.'],
    ['Share', 'Shares things among 2 to 10 people, cuts the leftovers and puts one share on the mat.'],
    ['Split', 'Cuts every piece into 2 to 5 smaller ones. The amount stays the same.'],
    ['Line up', 'Puts up to 3 amounts under each other to compare.'],
    ['Fill wholes', 'Packs pieces into whole bars, or breaks a whole into pieces.'],
    ['Count on', 'Adds one more of the same piece each tap.'],
    ['Explore, Calculate', 'From Grade 5: Join, Combine, Groups of, Fit into and, from Grade 7, Times and Find one between.'],
    ['Show number', 'Shows the fraction (in words in Grades 1 and 2).'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'Tap a <b>half</b>. Ask: “How much of the whole is coloured?”',
        'Tap <b>Split</b> into 2. The half becomes two fourths. Ask: “Did the amount change?” (No.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Share fairly', codes: { 1: ['B1.6'], 2: ['B1.6'], 3: ['B1.6'] },
          goal: 'Fair shares are the same size. Leftovers can be cut.',
          ido: { 1: 'Tap <b>Share</b>: 5 things among 2 people. “2 each, and 1 left over. Cut it in half: 2 and a half each.”', 2: 'Tap <b>Share</b>: 7 things among 3 people. “2 each, 1 left. Cut it in thirds: 2 and 1 third each.”', 3: 'Tap <b>Share</b>: 9 things among 4 people. “2 each, 1 left. Cut it in fourths: 2 and 1 fourth each.”' },
          wedo: { 1: 'Share 6 among 4 together. Talk about the 2 left over.', 2: 'Share 10 among 4 together (2 and 2 fourths each).', 3: 'Share 13 among 5 together (2 and 3 fifths each).' },
          youdo: { 1: 'The child shares 3 among 2 and 7 among 2, and says each share.', 2: 'The child shares 5 among 2 and 8 among 6.', 3: 'The child shares 11 among 4 and 17 among 8.' },
          ask: '“How do you know the shares are fair?”'
        },
        {
          t: 'Same amount, different pieces', codes: { 1: ['B1.7'], 2: ['B1.7'], 3: ['B1.7'] },
          goal: 'Cutting pieces smaller does not change how much there is.',
          ido: { 1: 'Tap a half. Tap <b>Split</b> into 2: two fourths. “One half and two fourths are the same amount.”', 2: 'Tap a third. Split into 2: two sixths. “One third and two sixths are the same.”', 3: 'Tap a half. Split into 2, then 2 again: 2/4, then 4/8. “1/2 = 2/4 = 4/8.”' },
          wedo: 'Use <b>Line up</b> to put the two amounts under each other and see they end at the same place.',
          youdo: { 1: 'The child shows that two halves make a whole, and two fourths make a half.', 2: 'The child shows a half another way, and a third another way.', 3: 'The child finds a fraction equal to 1/5 and one equal to 3/4.' },
          ask: '“Why are there more pieces but the same amount?”'
        },
        {
          t: 'More people, smaller pieces', codes: { 1: ['B1.8'], 2: ['B1.6'] },
          goal: 'The more people share one thing, the smaller each piece.',
          ido: 'Use <b>Line up</b> with a half, a fourth and an eighth. “Shared by 2, by 4, by 8. More people, smaller pieces.”',
          wedo: 'Together, guess: is a third bigger or smaller than a fourth? Line them up to check.',
          youdo: 'The child puts a half, a sixth and a tenth in order from biggest to smallest.',
          ask: '“Would you rather have a third or a sixth of a pizza? Why?”'
        },
        {
          t: 'Count the pieces', codes: { 1: ['B2.5'], 2: ['B2.5'], 3: ['B2.8'] },
          goal: 'Counting the same piece builds a fraction.',
          ido: 'Tap a fourth, then <b>Count on</b>: “1 fourth, 2 fourths, 3 fourths, 4 fourths: one whole.”',
          wedo: { 1: 'Count halves together up to 3 halves. Ask: “How many wholes is that?” (1 and a half.)', 2: 'Count fourths together up to 6 fourths (1 and 2 fourths).', 3: 'Count thirds together and write 1/3 + 1/3 + 1/3 = 3/3 = 1.' },
          youdo: { 1: 'The child counts 4 halves and says how many wholes.', 2: 'The child counts 3 groups of a half and says the total.', 3: 'The child writes 3/4 as 1/4 + 1/4 + 1/4 and 5/6 the same way.' },
          ask: '“How many fourths make a whole?”'
        }
      ],
      mistakes: [
        ['Thinks a fourth is bigger than a half because 4 is bigger than 2.', 'Line them up: more people sharing means smaller pieces.'],
        ['Shares unequal pieces and calls them halves.', 'Halves must be the same size. Line them up.'],
        ['Forgets the leftovers when sharing.', 'Point to them: “These still need sharing. Can we cut them?”'],
        ['Thinks 2 fourths is more than 1 half.', 'Split the half and line them up: same length.']
      ]
    },
    {
      grades: [4, 6],
      start: [
        'Tap three 1/4 pieces. Ask: “What fraction is this? What do the 3 and the 4 mean?”',
        'Open the <b>Symbols</b> window. Ask: “What is 3/4 as a decimal?” (0.75.)',
        'Tap <b>Split</b> into 2: 6/8. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Top and bottom numbers', codes: { 4: ['B1.4'], 5: ['B1.3'], 6: ['B1.3'] },
          goal: 'The bottom number says how many equal parts make a whole. The top says how many we have.',
          ido: 'Tap 5 eighths. “Eighths: 8 make a whole. We have 5: 5/8.” Show it as a strip, a circle and counters.',
          wedo: { 4: 'Build 7/10 together and say what each number means.', 5: 'Build 7/4 together: “More than a whole.” Tap <b>Fill wholes</b>: 1 3/4.', 6: 'Build 11/6 together and Fill wholes (1 5/6).' },
          youdo: { 4: 'The child builds 2/3, 4/5 and 6/6, and explains each.', 5: 'The child builds 9/4 and 2 1/3, and says each another way.', 6: 'The child builds 13/8 and 2 2/5, and says each another way.' },
          ask: '“Why is 6/6 the same as 1?”'
        },
        {
          t: 'Fractions as decimals', codes: { 4: ['B1.9'], 5: ['B1.7'], 6: ['B1.6'] },
          goal: 'The same amount can be a fraction, a decimal or a percent.',
          ido: { 4: 'Tap 3 tenths. Open Symbols: 3/10 = 0.3. Open Grid: 30 small squares.', 5: 'Tap 1/4. Open Symbols: 1/4 = 0.25 = 25%. Open Grid: 25 small squares.', 6: 'Tap 3/8. Open Symbols: 3/8 = 0.375.' },
          wedo: { 4: 'Build 0.5 from the Decimals tab and find its fraction together.', 5: 'Build 3/5 together and find its decimal and percent (0.6, 60%).', 6: 'Build 5/8 together and find its decimal (0.625).' },
          youdo: { 4: 'The child shows 7/10 and 1.2 and says each both ways.', 5: 'The child shows 3/4, 0.4 and 15% and gives each in the other two forms.', 6: 'The child shows 1/8 and 0.125 and explains why they are the same.' },
          ask: '“Which is easier to compare, fractions or decimals? Why?”'
        },
        {
          t: 'Add fractions', codes: { 4: ['B2.7'], 5: ['B2.5'], 6: ['B2.5'] },
          goal: 'Add pieces of the same size. Different sizes must be cut to match first.',
          ido: { 4: 'Use <b>Groups of</b>: 3 groups of 1/5. “1/5 + 1/5 + 1/5 = 3 × 1/5 = 3/5.”', 5: 'Use <b>Combine</b>: 3/8 and 2/8. “Same size pieces: 5/8.”', 6: 'Put 1/2 and 1/3 on the mat. Tap <b>Cut into same-size pieces</b>: 3/6 + 2/6 = 5/6.' },
          wedo: { 4: 'Together: 4 groups of 1/3 (4/3, or 1 1/3).', 5: 'Together: 7/10 − 3/10 (4/10).', 6: 'Together: 3/4 + 1/6 (11/12).' },
          youdo: { 4: 'The child shows 5 × 1/4 and 2 × 2/3.', 5: 'The child does 5/12 + 4/12 and 1 1/4 − 3/4.', 6: 'The child does 2/3 + 1/4 and 1/2 − 1/5.' },
          ask: '“Why can’t we just add the bottom numbers?”'
        },
        {
          t: 'Compare and order', codes: { 4: ['B1.5'], 5: ['B1.4'], 6: ['B1.3'] },
          goal: 'Line them up under the same whole to compare.',
          ido: 'Use <b>Line up</b> with 2/3 and 3/4. “3/4 goes further. It is bigger.”',
          wedo: { 4: 'Together: 3 people share a pizza, 5 people share another. Line up 1/3 and 1/5.', 5: 'Together: order 5/8, 2/3 and 7/12.', 6: 'Together: line up 0.7, 3/4 and 2/3.' },
          youdo: { 4: 'The child compares 2/5 and 1/2, then 3/8 and 3/10.', 5: 'The child orders 5/4, 1 1/3 and 9/8.', 6: 'The child orders 0.45, 3/8 and 2/5.' },
          ask: '“How can you tell without the strips?”'
        },
        {
          t: 'Fit into', codes: { 5: ['B2.8'], 6: ['B2.10'] },
          goal: 'Dividing by a fraction asks how many pieces fit.',
          ido: 'Put 3 wholes on the mat. Use <b>Fit into</b> with 1/4. “12 fourths fit into 3. So 3 ÷ 1/4 = 12.”',
          wedo: { 5: 'Together: 2 ÷ 1/3 (6).', 6: 'Together: 4 ÷ 2/3 (6).' },
          youdo: { 5: 'The child does 3 ÷ 1/2 and 4 ÷ 1/5.', 6: 'The child does 3 ÷ 3/4 and 2 ÷ 2/5.' },
          ask: '“Why is the answer bigger than the number we started with?”'
        }
      ],
      mistakes: [
        ['Adds 1/2 + 1/3 = 2/5.', 'Line up both. Cut them into the same size pieces first.'],
        ['Thinks 3/8 > 3/4 because 8 > 4.', 'Line them up: eighths are smaller pieces.'],
        ['Reads 0.25 as “twenty-five”.', 'Say “twenty-five hundredths” and show the grid.'],
        ['Thinks dividing always makes smaller.', 'Use Fit into: 3 ÷ 1/4 = 12.']
      ]
    },
    {
      grades: [7, 8],
      start: [
        'Tap 6/8. Use <b>Join</b> to simplify it. Ask: “Is 3/4 the same amount?”',
        'Switch to <b>Calculate</b> and tap <b>Times</b>. Make 3/4 × 2/3 and open the <b>Area</b> window.',
        'Ask: “What part of the square is the overlap?” (6/12 = 1/2.) Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Simplify', codes: { 7: ['B1.4'], 8: ['B1.4'] },
          goal: 'Join pieces into bigger equal pieces to simplify.',
          ido: { 7: 'Tap 6/8. Tap <b>Join</b>: 3/4. “Divide the top and bottom by 2.”', 8: 'Type 150% on the mat. “1 1/2.” Then type 0.5%: 1/200.' },
          wedo: { 7: 'Simplify 9/12 together (3/4).', 8: 'Together, show 125% as a fraction and a decimal (1 1/4, 1.25).' },
          youdo: { 7: 'The child simplifies 10/12 and 4/10 and checks with Line up.', 8: 'The child shows 0.2%, 240% and 7/4 in all three forms.' },
          ask: '“How do you know it is in simplest form?”'
        },
        {
          t: 'Multiply fractions', codes: { 7: ['B2.8'], 8: ['B2.6'] },
          goal: 'Times means “of”: 2/3 of 3/4.',
          ido: { 7: 'Tap <b>Times</b>: 3/4 × 2/3. In <b>Area</b>, 3/4 is columns, 2/3 is rows. “6 of 12 parts overlap: 6/12 = 1/2.”', 8: 'Tap <b>Times</b>: 1 1/2 × 2/3. “Two thirds of one and a half is 1.”' },
          wedo: { 7: 'Together: 1/2 × 4/5 (4/10 = 2/5).', 8: 'Together: 2 1/4 × 2/3 (1 1/2).' },
          youdo: { 7: 'The child does 2/3 × 3/5 and 3/4 × 1/2, simplifying each.', 8: 'The child does 1 1/3 × 3/4 and 2 1/2 × 2/5.' },
          ask: '“Why is the answer smaller than both fractions?”'
        },
        {
          t: 'Divide fractions', codes: { 7: ['B2.8'], 8: ['B2.6'] },
          goal: 'How many of one fraction fit into another?',
          ido: 'Use <b>Fit into</b>: 3/4 ÷ 2/3. Cut into same-size pieces: 9/12 and 8/12. “One whole 2/3 fits, and 1/8 of another: 1 1/8.”',
          wedo: 'Together: 1/2 ÷ 1/6 (3).',
          youdo: { 7: 'The child does 5/6 ÷ 1/3 and 2/3 ÷ 3/4.', 8: 'The child does 2 1/2 ÷ 3/4 and 1 ÷ 2/5.' },
          ask: '“Why do same-size pieces make it easier?”'
        },
        {
          t: 'Add unlike fractions', codes: { 7: ['B2.5'], 8: ['B2.5'] },
          goal: 'Find a piece size both fractions can use.',
          ido: 'Put 1/2 and 1/3 on the mat. Tap <b>Cut into same-size pieces</b>: 3/6 + 2/6 = 5/6.',
          wedo: 'Together: 3/4 − 1/6 (7/12).',
          youdo: 'The child does 2/3 + 3/4 and 1 1/2 − 5/8, then checks with Line up.',
          ask: '“How did you choose the new piece size?”'
        },
        {
          t: 'Find one between', codes: { 7: ['B1.5'], 8: ['B1.2'] },
          goal: 'There is always another fraction between two fractions.',
          ido: 'Line up 1/3 and 1/2. Tap <b>Find one between</b>: twelfths. “4/12 < 5/12 < 6/12.”',
          wedo: 'Together: find a decimal between 0.3 and 0.4.',
          youdo: 'The child finds a fraction between 3/5 and 2/3, and a decimal between 0.25 and 0.26.',
          ask: '“Could you find another one? And another?”'
        },
        {
          t: 'Negative fractions', codes: { 7: ['B1.3'] },
          goal: 'Below zero, the further left, the smaller.',
          ido: 'Use <b>Line up</b> with Minus: −3/4 and −1/2. “−3/4 is further left. It is smaller.”',
          wedo: 'Together: order −1/3, 1/4 and −0.5.',
          youdo: 'The child orders −2/3, −0.6 and −3/4.',
          ask: '“Why is −3/4 less than −1/2?”'
        }
      ],
      mistakes: [
        ['Multiplies 3/4 × 2/3 and expects a bigger answer.', 'Open Area: a part of a part is smaller.'],
        ['Adds the tops and bottoms: 1/2 + 1/3 = 2/5.', 'Cut into same-size pieces first.'],
        ['Thinks −1/2 < −3/4.', 'Line them up with Minus: further left is smaller.'],
        ['Reads 150% as less than 1.', 'Type it on the mat: it fills more than one whole.']
      ]
    }
  ]
});
