/* Teaching guide: Place value disks (Toolbox tool 'disks', Grades 3 to 7). Format: see assets/engine/guide.js. */
AtlasGuide.add('disks', {
  what: 'Disks that stand for 1, 10, 100 and so on (and 0.1, 0.01 from Grade 4), for big numbers, decimals and regrouping.',
  keys: [
    ['Tray', 'Tap a disk to add it to its column.'],
    ['Take away', 'Tap a disk on the mat to take it off.'],
    ['Group 10', 'Turns 10 disks in one column into 1 disk of the next place.'],
    ['Break one', 'Then tap a disk: it becomes 10 disks of the place to its right.'],
    ['× 10, ÷ 10', 'From Grade 5: slides every disk one place left or right.'],
    ['Show number', 'Shows the number and its expanded form.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [3, 4],
      start: [
        'Tap 1 hundred, 3 tens and 12 ones. Ask: “Can we write this number yet?” (Not with 12 in the ones.)',
        'Tap <b>Group 10</b>. Ten ones become 1 ten. Ask: “What is the number now?” (142.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Build and read', codes: { 3: ['B1.1', 'B1.5'], 4: ['B1.1'] },
          goal: 'Each column is a place. The disks in it make that digit.',
          ido: { 3: 'Say: “Watch me build 1352.” Tap 1 thousand, 3 hundreds, 5 tens and 2 ones. Read it: “one thousand three hundred fifty-two.”', 4: 'Say: “Watch me build 24 615.” Tap 2 ten thousands, 4 thousands, 6 hundreds, 1 ten and 5 ones. Read it aloud.' },
          wedo: { 3: 'Build 2080 together. Ask: “Which columns stay empty?”', 4: 'Build 30 406 together. Ask: “Which columns stay empty?”' },
          youdo: { 3: 'The child builds 1709 and 2460 with Show number off, then checks.', 4: 'The child builds 15 030 and 9999 + 1 = 10 000 (with Group 10), then checks.' },
          ask: '“What does an empty column mean when we write the number?”'
        },
        {
          t: 'Group and break', codes: { 3: ['B1.5'], 4: ['B1.1'] },
          goal: 'Ten of one place make one of the next. Breaking does not change the number.',
          ido: 'Build 2 hundreds. Tap <b>Break one</b>, then a hundred: 10 tens. “1 hundred and 10 tens: still 200.”',
          wedo: 'Break a ten together, then Group 10 to put it back.',
          youdo: 'The child shows 340 in two ways (3 hundreds 4 tens; 2 hundreds 14 tens) and checks both with Show number.',
          ask: '“Did the number change? How do you know?”'
        },
        {
          t: 'Subtract by breaking', codes: { 3: ['B2.4'], 4: ['B2.4'] },
          goal: 'When a column has too few, break one from the next place.',
          ido: 'Build 302. “Take away 125. I need 5 ones but have 2.” Break a hundred, then a ten. Take away 1 hundred, 2 tens and 5 ones (177).',
          wedo: 'Do 410 − 236 together (174), writing each step on paper.',
          youdo: { 3: 'The child does 500 − 138 with the disks and on paper.', 4: 'The child does 4005 − 1267 with the disks and on paper.' },
          ask: '“Why did we break a hundred first?”'
        },
        {
          t: 'Tenths', codes: { 4: ['B1.7', 'B1.9'] },
          goal: 'Ten tenths make one whole.',
          ido: 'Tap 1 one and 7 tenths. “One and seven tenths: 1.7.” Tap 3 more tenths and Group 10: “10 tenths make 1. Now 2.”',
          wedo: 'Build 0.6 and 1.2 together. Ask which is more and why.',
          youdo: 'The child builds 3.4 and 0.9, says each as a fraction (34/10, 9/10) and orders them.',
          ask: '“How many tenths are in 2?”'
        }
      ],
      mistakes: [
        ['Writes 1 thousand, 0 hundreds, 5 tens as 15.', 'Point to the empty Hundreds column: “That is a 0.”'],
        ['Leaves 12 disks in one column and writes 12.', 'Group 10 first. Each place holds 9 at most when we write.'],
        ['Thinks 0.9 is more than 1.2.', 'Build both: one whole is 10 tenths.'],
        ['Breaks a disk and loses count.', 'Turn on Show number after each break to see the number did not change.']
      ]
    },
    {
      grades: [5, 7],
      start: [
        'Tap 1 ten thousand, 2 thousands and 3 tenths. Ask the child to read it: 12 000.3.',
        'Tap <b>× 10</b>. Every disk slides one place left. Ask: “What is it now?” (120 003.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Read big numbers', codes: { 5: ['B1.1'], 6: ['B1.1'], 7: ['B1.1'] },
          goal: 'Read big numbers in groups of three digits.',
          ido: { 5: 'Build 74 305. “74 thousand, 305.” Point to the space between the groups.', 6: 'Build 408 050. “408 thousand, 50.” Point to the space between the groups.', 7: 'Build 1 060 200. Turn on Show number and read the expanded form with powers of ten: 1 × 10⁶ + 6 × 10⁴ + 2 × 10².' },
          wedo: 'Build one number together from a newspaper or a sign, and read it aloud.',
          youdo: { 5: 'The child builds 60 090 and 99 999, reads them, and writes them with a space.', 6: 'The child builds 750 006 and 1 000 000 and reads them.', 7: 'The child builds 3 004 500 and writes its expanded form with powers of ten.' },
          ask: '“Where does the space go, and why?”'
        },
        {
          t: 'Decimals to thousandths', codes: { 5: ['B1.5'], 6: ['B1.4'], 7: ['B1.6'] },
          goal: 'Each place to the right is a tenth of the one before.',
          ido: { 5: 'Build 2.45: 2 ones, 4 tenths, 5 hundredths. Break a tenth: 10 hundredths. “Still 2.45.”', 6: 'Build 3.125. Break a hundredth into 10 thousandths. “Still 3.125.”', 7: 'Build 4.68. “To the nearest tenth: look at the hundredths. 8 is 5 or more, so 4.7.”' },
          wedo: { 5: 'Compare 0.7 and 0.65 together by building both.', 6: 'Compare 0.4 and 0.375 together by building both.', 7: 'Round 2.349 to the nearest hundredth together (2.35).' },
          youdo: { 5: 'The child orders 1.08, 1.8 and 1.18 by building them.', 6: 'The child orders 0.505, 0.55 and 0.5 by building them.', 7: 'The child rounds 6.052 and 9.996 to the nearest tenth and hundredth.' },
          ask: '“Is a longer decimal always bigger?”'
        },
        {
          t: '× 10 and ÷ 10', codes: { 5: ['B2.3'], 6: ['C1.4'], 7: ['B1.1'] },
          goal: 'Times 10 moves every digit one place left. Divide by 10 moves it right.',
          ido: 'Build 34.5. Tap <b>× 10</b>: 345. Tap <b>÷ 10</b> twice: 3.45. “The digits stay the same; their places move.”',
          wedo: { 5: 'Together: 56 ÷ 10 and 56 × 0.1. Same answer (5.6). “Times 0.1 is the same as divide by 10.”', 6: 'Together, make the pattern 4000, 400, 40, 4, 0.4, 0.04 with ÷ 10.', 7: 'Together: 2.7 × 10 × 10 × 10. Write it as 2.7 × 10³ (2700).' },
          youdo: { 5: 'The child does 7.2 × 10, 450 × 0.01 and 3 ÷ 10, then checks each with the disks.', 6: 'The child makes their own ÷ 10 pattern and says the rule.', 7: 'The child writes 52 000 as 5.2 × 10⁴ and checks it with × 10.' },
          ask: '“What happens to the decimal point?” (It stays; the digits move.)'
        },
        {
          t: 'Add and subtract decimals', codes: { 5: ['B2.4'], 6: ['B2.4'] },
          goal: 'Line up the places, then group or break as needed.',
          ido: 'Build 3.75 and add 1.48. Group 10 hundredths, then 10 tenths. “5.23.”',
          wedo: 'Do 6.2 − 2.85 together: break a tenth into hundredths first (3.35).',
          youdo: 'The child does 4.56 + 2.7 and 5 − 1.25 with the disks and on paper.',
          ask: '“Why do we line up the decimal points?”'
        }
      ],
      mistakes: [
        ['Thinks 0.65 is more than 0.7 because 65 is more than 7.', 'Build both: 7 tenths is 70 hundredths.'],
        ['Says × 10 “adds a zero”: 3.4 × 10 = 3.40.', 'Tap × 10 and watch each disk move one place left: 34.'],
        ['Writes 74 305 as 74305 or 74,305.', 'Use a space between groups of three digits.'],
        ['Adds 4.56 + 2.7 as 4.83.', 'Line up the places: 2.7 is 2 ones and 7 tenths.']
      ]
    }
  ]
});
