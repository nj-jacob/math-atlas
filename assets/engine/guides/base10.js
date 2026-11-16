/* Teaching guide: Place value blocks (Toolbox tool 'base10', Grades 1 to 6). Format: see assets/engine/guide.js. */
AtlasGuide.add('base10', {
  what: 'Blocks that show what each digit is worth: a one, a ten (10 ones), a hundred (10 tens) and a thousand (10 hundreds).',
  keys: [
    ['Tray', 'Tap a block, or drag it onto the mat.'],
    ['Take away', 'Drag a block off the mat.'],
    ['Snap', 'With 10 ones on the mat, <b>Snap 10 ones into a ten</b> appears. Dragging a one into Tens does the same.'],
    ['Break', '<b>Break a ten</b> turns a ten into 10 ones. Dragging a ten into Ones does the same.'],
    ['Show number', 'Shows the number on the mat. Leave it off while the child works it out, then turn it on to check.'],
    ['Tap to count', '<b>Whole blocks</b>: tap the blocks one by one to count them. <b>Small squares</b>: tap the squares inside a ten or a hundred to number them.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 2],
      start: [
        'Tap one ten and three ones from the tray. Say: “One ten and three ones. Thirteen.”',
        'Drag the ten into the Ones column. It breaks into 10 ones. Ask: “How many now?” (Still 13.)',
        'Turn on <b>Show number</b> to check together. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Build a number', codes: { 1: ['B1.1', 'B1.2'], 2: ['B1.1'] },
          goal: 'Show a number with tens and ones.',
          ido: 'Say: “Watch me make 34. The 3 means 3 tens.” Drag 3 tens into Tens. “The 4 means 4 ones.” Drag 4 ones into Ones. Count: “10, 20, 30, 31, 32, 33, 34.”',
          wedo: 'Say 25. Ask: “How many tens? How many ones?” The child drags; you point to each column as you count together. If a column is wrong: “Show me the 2. Which column is it in?”',
          youdo: { 1: 'Say 41, 17 and 30. The child builds each one and counts it aloud, then turns on Show number to check.', 2: 'Say 41, 126 and 205. The child builds each one and counts it aloud, then turns on Show number to check.' },
          ask: '“Which is worth more, a ten or a one? How do you know?”'
        },
        {
          t: 'Read the mat', codes: { 1: ['B1.1'], 2: ['B1.1'] },
          goal: 'Say the number the blocks show.',
          ido: 'Put 46 on the mat. Point and count the tens: “10, 20, 30, 40.” Then count on the ones: “41, 42, 43, 44, 45, 46.”',
          wedo: 'Add a ten. “Count the tens with me first.” Then count on the ones together (56).',
          youdo: 'Build three numbers with Show number off. The child says each one, then turns Show number on to check.',
          ask: '“Why do we count the tens first?”',
          mat: { t: 4, o: 6 }, matLabel: 'Put 46 on the mat'
        },
        {
          t: 'Ten ones make a ten', codes: { 1: ['B1.2'], 2: ['B1.1'] },
          goal: 'Ten ones can be swapped for one ten. The number stays the same.',
          ido: 'Put 13 ones on the mat and count them aloud. Tap <b>Snap 10 ones into a ten</b>. “Ten ones made one ten. One ten and three ones: still 13.”',
          wedo: 'Drag the ten into Ones to break it. Count together: still 13. Snap it back.',
          youdo: { 1: 'Tap 17 ones onto the mat. The child snaps a ten and says the number.', 2: 'Tap 17 ones onto the mat. The child snaps a ten and says the number. Then 12 tens: 10 of them snap into a hundred (120).' },
          ask: '“Did the number change when the blocks changed?”',
          mat: { o: 13 }, matLabel: 'Put 13 ones on the mat'
        },
        {
          t: 'Ten more, ten less', codes: { 1: ['B1.2'], 2: ['B2.3'] },
          goal: 'Adding or taking away a ten changes only the tens.',
          ido: 'Put 25 on the mat. Add one ten. “25, ten more is 35. Only the tens changed.”',
          wedo: 'Take a ten off. Together: “35, ten less is 25.” Do 45 and 15 the same way.',
          youdo: 'Say a number. The child builds it, then shows ten more and ten less, saying each number before checking with Show number.',
          ask: '“What stays the same when we add a ten?”',
          mat: { t: 2, o: 5 }, matLabel: 'Put 25 on the mat'
        },
        {
          t: 'Which is more?', codes: { 1: ['B1.3'], 2: ['B1.2'] },
          goal: 'Compare the tens first. If the tens are the same, compare the ones.',
          ido: 'Build 32. Think aloud: “3 tens. 23 has only 2 tens, so 32 is more.” Write 32 > 23 on paper.',
          wedo: 'Build 27, then talk about 29. “Same tens. Look at the ones.” Agree together which is more.',
          youdo: 'Give two numbers (41 and 14, then 38 and 35). The child builds the first, says which is more and why, then builds the second to check.',
          ask: '“Which column do you look at first? Why?”'
        },
        {
          t: 'Add and take away', codes: { 1: ['B2.4'], 2: ['B2.4'] },
          goal: 'Join blocks to add, take blocks away to subtract, and snap or break a ten when needed.',
          ido: 'Build 18. Add 7 ones. “15 ones: I can snap a ten.” Snap. “2 tens and 5 ones: 18 + 7 = 25.”',
          wedo: 'Build 23. “Take away 8.” There are only 3 ones, so break a ten together, then take 8 ones away (15).',
          youdo: { 1: '26 + 9, then 31 − 6. The child builds, says the answer, then checks with Show number.', 2: '47 + 35, then 62 − 28. The child builds, says the answer, then checks with Show number.' },
          ask: '“Why did we need to break a ten?”'
        }
      ],
      mistakes: [
        ['Counts each ten as 1.', 'Point to the 10 small squares inside a ten. Count the tens by 10s: “10, 20, 30.”'],
        ['Reads 4 tens and 6 ones as 64.', 'Say the tens first, and point to the Tens column as you say it.'],
        ['Writes 2 tens and 13 ones as 213.', 'Snap 10 ones into a ten first. When we write a number, each column holds 9 at most.'],
        ['Starts counting with the ones and gets lost.', 'Always start with the biggest blocks.']
      ]
    },
    {
      grades: [3, 4],
      start: [
        'Tap 1 hundred, 2 tens and 4 ones. Say: “One hundred, two tens, four ones: 124.”',
        'Drag the hundred into Tens. It breaks into 10 tens. Ask: “What number is it now?” (Still 124: 12 tens and 4 ones.)',
        'Turn on <b>Show number</b> to check together. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Build a number', codes: { 3: ['B1.1', 'B1.5'], 4: ['B1.1'] },
          goal: 'Show a number with thousands, hundreds, tens and ones.',
          ido: 'Say: “Watch me build 347.” Drag 3 hundreds, 4 tens and 7 ones, saying “300, 340, 347” as you go.',
          wedo: 'Say 305. Ask: “How many tens?” (None.) “The empty Tens column is the zero.” Build it together.',
          youdo: { 3: 'Say 520, 418 and 609. The child builds each one with Show number off, then checks.', 4: 'Say 2365, 4070 and 1006. The child builds each one with Show number off, then checks.' },
          ask: '“What does the 0 in 305 tell you?”'
        },
        {
          t: 'Same number, other ways', codes: { 3: ['B1.1', 'B1.5'], 4: ['B1.1'] },
          goal: 'Breaking a block shows the same number a new way.',
          ido: 'Put 347 on the mat. Tap <b>Break a hundred</b>. “2 hundreds, 14 tens, 7 ones. Still 347.” Write 200 + 140 + 7.',
          wedo: 'Break a ten together. Write the new way: 200 + 130 + 17. Check with Show number.',
          youdo: { 3: 'The child shows 256 two different ways and writes each one.', 4: 'The child shows 1450 two different ways (one of them 14 hundreds and 5 tens) and writes each one.' },
          ask: '“Is 2 hundreds and 14 tens more, less or the same as 3 hundreds and 4 tens?”',
          mat: { h: 3, t: 4, o: 7 }, matLabel: 'Put 347 on the mat'
        },
        {
          t: 'Compare and order', codes: { 3: ['B1.2'], 4: ['B1.2'] },
          goal: 'Compare the biggest place first.',
          ido: 'Build 412, then think aloud about 398: “412 has 4 hundreds, 398 has only 3. So 412 is more, even though 398 has bigger tens and ones.”',
          wedo: 'Build 563 and talk through 536 together: same hundreds, so look at the tens.',
          youdo: { 3: 'Order 709, 790 and 97. The child builds each one, then writes them from least to greatest.', 4: 'Order 3048, 3408, 3084 and 984. The child builds each one, then writes them from least to greatest.' },
          ask: { 3: '“Why is 97 the smallest, even though it has a 9?”', 4: '“Why is 984 the smallest, even though it has a 9?”' }
        },
        {
          t: 'Round to the nearest hundred', codes: { 3: ['B1.3'], 4: ['B1.3'] },
          goal: 'Look only at the next place down: 5 or more rounds up.',
          ido: 'Put 347 on the mat. “It is between 300 and 400. Look at the tens: 4 tens is less than 5. 347 rounds to 300.”',
          wedo: 'Add 2 tens (367). Together: “6 tens, 5 or more, so 400.”',
          youdo: { 3: 'Round 251, 649 and 805 to the nearest hundred. The child points to the blocks that decide and says why.', 4: 'Round 649 and 805 to the nearest hundred, then 2650 and 4321 to the nearest thousand. The child points to the blocks that decide and says why.' },
          ask: '“Which blocks do you look at to round to the nearest hundred?”',
          mat: { h: 3, t: 4, o: 7 }, matLabel: 'Put 347 on the mat'
        },
        {
          t: 'Add with regrouping', codes: { 3: ['B2.4'], 4: ['B2.4'] },
          goal: 'The blocks show why we carry a 1 in the written method.',
          ido: 'Build 158, then add 267. “15 ones: snap a ten.” “12 tens: snap a hundred.” “4 hundreds, 2 tens, 5 ones: 425.” Write the sum in columns beside it and point to each carried 1.',
          wedo: 'Do 276 + 145 together: the child snaps, you write each step on paper (421).',
          youdo: { 3: '349 + 283. The child builds and writes at the same time, then checks with Show number.', 4: '1475 + 2368. The child builds and writes at the same time, then checks with Show number.' },
          ask: '“Where did the little 1 come from? What is it worth?”'
        },
        {
          t: 'Subtract by breaking', codes: { 3: ['B2.4'], 4: ['B2.4'] },
          goal: 'When there are not enough to take away, break a bigger block.',
          ido: 'Put 403 on the mat. “Take away 158. I need 8 ones but have 3, and there are no tens to break.” Break a hundred, then a ten. Take away 1 hundred, 5 tens and 8 ones (245).',
          wedo: 'Do 520 − 236 together: the child breaks, you write each step (284).',
          youdo: { 3: '600 − 274. The child builds, breaks and writes, then checks with Show number.', 4: '5003 − 1268. The child builds, breaks and writes, then checks with Show number.' },
          ask: '“Why did we break a hundred before a ten?”',
          mat: { h: 4, o: 3 }, matLabel: 'Put 403 on the mat'
        },
        {
          t: 'Times 10 and 100', codes: { 4: ['B2.3'] },
          goal: 'Times 10 makes every block 10 times bigger: each one moves one place to the left.',
          ido: 'Put 23 on the mat. “Times 10: each one becomes a ten, each ten becomes a hundred.” Swap them: 2 hundreds and 3 tens. “23 × 10 = 230.”',
          wedo: 'Do 45 × 10 together. Then 45 × 100: each block moves two places (4500).',
          youdo: 'The child shows 36 × 10 and 7 × 100, says each answer, then checks with Show number.',
          ask: '“What happened to each digit?”',
          mat: { t: 2, o: 3 }, matLabel: 'Put 23 on the mat'
        }
      ],
      mistakes: [
        ['Writes 305 as 35.', 'Point to the empty Tens column: “Nothing here means 0 tens.”'],
        ['Adds 158 + 267 and gets 3115.', 'Show that 15 ones must become 1 ten and 5 ones. One digit in each column.'],
        ['Takes the smaller digit from the bigger one: 403 − 158 = 355.', 'Build 403 and try to take 8 ones. A block has to be broken first.'],
        ['Rounds 347 to 400 because of the 7.', 'Cover the ones with a hand. Only the tens decide.']
      ]
    },
    {
      grades: [5, 6],
      start: [
        'Tap 2 thousands, 4 hundreds, 8 tens and 7 ones. Ask the child to read it: 2487.',
        'Drag a thousand into Hundreds. It breaks into 10 hundreds. Ask: “What is it now?” (Still 2487.)',
        'Turn on <b>Show number</b> to check. Numbers past 9999 and decimals are in <b>Place value disks</b>.'
      ],
      lessons: [
        {
          t: 'Each place is 10 of the next', codes: { 5: ['B1.1'], 6: ['B1.1'] },
          goal: 'Every place is worth 10 of the place to its right. The same rule goes on to a million.',
          ido: 'Put a thousand on the mat. Break it: 10 hundreds. Break a hundred: 10 tens. “Each place is 10 times the one to its right.”',
          wedo: 'Together, use the blocks to work out how many hundreds make 1000 (10) and how many tens (100).',
          youdo: 'The child says what 10 thousands would make (10 000) and what 10 of those would make (100 000). Then open <b>Place value disks</b> to build numbers past 9999.',
          ask: '“How many thousands make 100 000?”',
          mat: { k: 1 }, matLabel: 'Put 1000 on the mat'
        },
        {
          t: 'Explain the carries', codes: { 5: ['B2.4'], 6: ['B2.4'] },
          goal: 'The blocks explain each carry in written addition.',
          ido: 'Write 2487 + 1365 in columns. Build 2487 and add 1365. Snap at each place and point to the carried 1 on paper (3852).',
          wedo: 'Do 3658 + 2475 together: the child snaps, you write (6133).',
          youdo: 'The child writes 1789 + 2546, builds only the places that regroup, and says what each carry is worth.',
          ask: '“The 1 you carried into the hundreds: what is it worth?”'
        },
        {
          t: 'Subtract across zeros', codes: { 5: ['B2.4'], 6: ['B2.4'] },
          goal: 'Break one block at a time until there are enough to take away.',
          ido: 'Put 3004 on the mat. “Take away 1268. Not enough ones, and no tens or hundreds.” Break a thousand, a hundred, then a ten, writing the new digits above 3004 as you go: 2, 9, 9, 14 (1736).',
          wedo: 'Do 5000 − 2347 together (2653).',
          youdo: 'The child writes 4002 − 1575 on paper, then builds it to check each step.',
          ask: '“Why is the hundreds digit 9 after breaking?”',
          mat: { k: 3, o: 4 }, matLabel: 'Put 3004 on the mat'
        }
      ],
      mistakes: [
        ['3004 − 1268 = 2264 (takes the smaller digit from the bigger one in each place).', 'Build 3004. There are no tens or hundreds to take from, so a thousand must be broken first.'],
        ['Breaks a block but does not change the digit on paper.', 'Say and write each change as the block breaks: “3 thousands becomes 2.”'],
        ['Carries 12 instead of 1.', 'Snap 10 ones into a ten: only that one ten moves to the next place.']
      ]
    }
  ]
});
