/* Grade 3 Money: Making Change: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/money.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made
   at random. Theme words: {a} {b} names.
   Ontario 2020 (the code the lessons name): F1.1 coins and bills, cash rounding, and making change to $1 and from bills.
   The answer checks are in tests/verify/sheets.js: sums and stories are worked out, a cash total rounds to the nearest
   5¢ (round), an estimate to the nearest 10¢, and change in the fewest coins takes the biggest coin that fits (fewest). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function story(q, unit, ans, calc) { return { q: q, eq: [unit === '$' ? '$ []' : '[] ' + unit], a: [ans], calc: calc }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  function sum(l) { return l.reduce(function (s, v) { return s + v; }, 0); }
  /* coins to count, in cents */
  function CN(list, q) { return { q: q || 'How much?', pic: ['coins', { list: list }], eq: ['[] ¢'], a: [sum(list)] }; }
  /* a cash total rounded to the nearest 5¢ */
  function RD(t) { return { eq: [t + '¢ rounds to [] ¢'], a: [Math.round(t / 5) * 5], round: 5 }; }
  /* count up from the price to what was paid (cents) */
  function UP(p, paid) { return { q: 'Cost ' + p + '¢. Paid ' + (paid === 100 ? '$1' : paid + '¢') + '.', eq: [p + '¢ + [] ¢ = ' + paid + '¢'], a: [paid - p] }; }
  /* two prices, the cash total, and the change from $1 */
  function TW(x, y) { var t = x + y, r = Math.round(t / 5) * 5; return { q: x + '¢ and ' + y + '¢. Paid $1.', eq: [x + ' + ' + y + ' = [] ¢', '[] ¢ rounds to [] ¢', '100 − [] = [] ¢'], a: [t, t, r, r, 100 - r], round: 5 }; }
  /* change in the fewest coins */
  var QDN = [25, 10, 5];
  function FW(amt) { var left = amt; return { q: 'Change: ' + amt + '¢. Use the fewest coins.', eq: ['[] quarters', '[] dimes', '[] nickels'], a: QDN.map(function (c) { var k = Math.floor(left / c); left -= k * c; return k; }), fewest: { amt: amt, coins: QDN } }; }
  /* count up from a whole-dollar price to a bill */
  function BL(p, bill) { return { q: 'Cost $' + p + '. Paid $' + bill + '.', eq: ['$' + p + ' + $ [] = $' + bill], a: [bill - p] }; }
  /* take away to find the change, then check by adding */
  function SB(p, bill) { return { eq: ['$' + bill + ' − $' + p + ' = $ []', '$' + p + ' + $ [] = $' + bill], a: [bill - p, bill - p] }; }
  /* estimate the change from $1: the price to the nearest 10¢ */
  function ES(p) { var r = Math.round(p / 10) * 10; return { q: 'Cost ' + p + '¢. About how much change from $1?', eq: [p + '¢ is about [] ¢', '100 − [] = [] ¢'], a: [r, r, 100 - r], round: 10 }; }
  /* is there enough money? */
  function OK(have, p) { var t = sum(p); return { q: 'You have ' + have + '¢. Can you buy ' + p.map(function (v) { return v + '¢'; }).join(' and ') + '?', eq: [p.join(' + ') + ' = [] ¢'], a: [t], pick: { opts: ['yes', 'no'], ans: t <= have ? 0 : 1 }, pickLast: true, tf: p.join(' + ') + ' < ' + (have + 1) }; }

  S.register('money', { code: 'MO', ideas: {

    count: {
      watch: 'counting the coins instead of their values (5 coins: "5¢"). Sort first, then count by each coin\'s value.',
      goal: 'I can count coins, biggest first.',
      learn: {
        show: { pic: ['coins', { list: [25, 25, 10, 10, 5] }], cap: '25, 50, 60, 70, 75', eq: ['25 + 25 + 10 + 10 + 5 = 75¢'] },
        together: [CN([25, 10, 5]), CN([25, 25, 25, 10])],
        cue: 'Biggest coins first. Count on by each coin\'s value.',
        own: [CN([10, 10, 5, 5]), CN([25, 10, 10, 10])]
      },
      p1: {
        show: { pic: ['coins', { list: [25, 10, 10] }], cap: '25, 35, 45', eq: ['45¢'] },
        items: [CN([10, 10, 10]), CN([25, 5]), CN([25, 25, 5]), CN([10, 5, 5, 5]), CN([25, 10, 10, 5]), CN([100, 10])]
      },
      p2: {
        items: [CN([25, 25, 25, 25]), CN([100, 25, 25, 10]), CN([200, 25, 10]), CN([25, 25, 10, 10, 10, 5]),
          { eq: ['3 × 25 = [] ¢'], a: [75] }, { eq: ['4 × 10 + 5 = [] ¢'], a: [45] }]
      },
      p3: {
        items: [CN([200, 100, 25, 25, 5]), CN([100, 100, 10, 10, 10]), { eq: ['2 × 25 + 3 × 10 = [] ¢'], a: [80] }, { eq: ['3 × 25 + 2 × 10 + 5 = [] ¢'], a: [100], wide: true },
          TF('3 × 25 + 2 × 10 + 5 = 100', true), { q: 'Draw coins that make 60¢ with 3 coins.', draw: { h: 50, key: '2 quarters and 1 dime.' } }]
      },
      think: {
        items: [{ q: '{b} has 5 coins and says that is 5¢. What went wrong?', lines: { n: 3, key: '{b} counted the coins. Count each coin\'s value: a dime is 10¢, a quarter 25¢.' } },
          { q: 'Show 50¢ two ways with coins.', draw: { h: 60, key: 'For example: 2 quarters; or 5 dimes; or 1 quarter, 2 dimes and 1 nickel.' } },
          { q: 'Why do we count the biggest coins first?', lines: { n: 2, key: 'It is easier to count on by 25s, then 10s, then 5s.' } },
          CN([25, 25, 25, 10, 5, 5])]
      }
    },

    round: {
      watch: 'rounding to the nearest 10¢ (47¢ to 50¢). Cash rounds to the nearest 5¢; a card pays the exact total.',
      goal: 'I can round a cash total to the nearest 5¢.',
      learn: {
        show: { cap: 'No pennies: 43¢ is closer to 45¢', eq: ['43¢ rounds to 45¢'] },
        together: [RD(47), RD(61)],
        cue: 'Find the closest 5¢: the number ending in 0 or 5.',
        own: [RD(48), RD(52), RD(74)]
      },
      p1: {
        show: { cap: '64¢: 1 step to 65¢', eq: ['64¢ rounds to 65¢'] },
        items: [RD(41), RD(39), RD(56), RD(63), RD(82), RD(97)]
      },
      p2: {
        items: [RD(23), RD(77), RD(88), RD(14),
          { q: '35¢ and 28¢, paid in cash.', eq: ['35 + 28 = [] ¢', '[] ¢ rounds to [] ¢'], a: [63, 63, 65], round: 5 },
          { q: '42¢ and 39¢, paid in cash.', eq: ['42 + 39 = [] ¢', '[] ¢ rounds to [] ¢'], a: [81, 81, 80], round: 5 }]
      },
      p3: {
        items: [RD(91), RD(66), RD(19),
          { q: '24¢ and 45¢, paid in cash.', eq: ['24 + 45 = [] ¢', '[] ¢ rounds to [] ¢'], a: [69, 69, 70], round: 5 },
          { q: '18¢, 31¢ and 22¢, paid in cash.', eq: ['18 + 31 + 22 = [] ¢', '[] ¢ rounds to [] ¢'], a: [71, 71, 70], round: 5, wide: true },
          { q: 'A 62¢ total, paid by card. What do you pay?', eq: ['[] ¢'], a: [62], calc: '62' }]
      },
      think: {
        items: [{ q: '{b} rounds 47¢ to 50¢. What went wrong?', lines: { n: 3, key: 'Cash rounds to the nearest 5¢: 47¢ is closer to 45¢.' } },
          { q: 'Why does a card total not round?', lines: { n: 2, key: 'A card pays the exact amount. Only cash needs coins.' } },
          { q: 'Write 3 totals that round to 60¢.', lines: { n: 2, key: '58¢, 59¢, 61¢ or 62¢ (and 60¢).' } },
          RD(33)]
      }
    },

    countup: {
      watch: 'subtracting digit by digit (100 − 65 = 45), or giving the price as the change. Count up: "65, 75, one dollar."',
      goal: 'I can count up to make change from $1.',
      learn: {
        show: { pic: ['coins', { list: [10, 25] }], cap: '65¢, then 75¢, then $1', eq: ['65¢ + 35¢ = 100¢'] },
        together: [UP(75, 100), UP(40, 100)],
        cue: 'Start at the price. Count up to what was paid.',
        own: [UP(90, 100), UP(55, 100), UP(30, 100)]
      },
      p1: {
        show: { cap: '85¢: a dime, then a nickel', eq: ['85¢ + 15¢ = 100¢'] },
        items: [UP(80, 100), UP(95, 100), UP(50, 100), UP(70, 100), UP(45, 100), UP(60, 100)]
      },
      p2: {
        items: [UP(35, 100), UP(15, 100), UP(65, 100), UP(20, 100),
          story('A pencil costs 85¢. {a} pays $1 (100¢). What is the change?', '¢', 15, '100 − 85'), story('A juice box costs 55¢. {b} pays $1 (100¢). What is the change?', '¢', 45, '100 − 55')]
      },
      p3: {
        items: [UP(5, 100), UP(10, 100), UP(35, 50), UP(15, 75),
          story('An eraser costs 40¢. {a} pays $1 (100¢). What is the change?', '¢', 60, '100 − 40'), TF('65 + 45 = 100', false)]
      },
      think: {
        items: [{ q: '{b} says the change from $1 for 65¢ is 45¢. What went wrong?', lines: { n: 3, key: 'Count up: 65, 75, 100. The change is 35¢.' } },
          { q: 'Draw the coins you would count up with: 40¢ to $1.', draw: { h: 60, key: 'A dime to 50¢, then 2 quarters to $1: 60¢.' } },
          { q: 'How can you check change?', lines: { n: 2, key: 'Add the change to the price. It should make what was paid.' } },
          UP(25, 100)]
      }
    },

    two: {
      watch: 'finding the change from the exact total, or forgetting an item. Add, round, then count up.',
      goal: 'I can add two prices and find the change from $1.',
      learn: {
        show: { cap: 'Add, round, count up', eq: ['35 + 28 = 63¢', '63¢ rounds to 65¢', '100 − 65 = 35¢'] },
        together: [TW(42, 39), TW(25, 30)],
        cue: 'Add the prices. Round the cash total. Then count up to $1.',
        own: [TW(45, 30), TW(18, 26)]
      },
      p1: {
        show: { cap: '40¢ and 35¢', eq: ['40 + 35 = 75¢', '100 − 75 = 25¢'] },
        items: [TW(20, 30), TW(45, 25), TW(15, 35), TW(50, 40)]
      },
      p2: {
        items: [TW(33, 41), TW(27, 22), TW(36, 38), TW(12, 49)]
      },
      p3: {
        items: [TW(28, 44), TW(51, 37), TW(19, 23), TW(46, 46)]
      },
      think: {
        items: [{ q: '{b} buys a 42¢ muffin and a 39¢ juice with cash and pays $1. {b} expects 19¢ change. What went wrong?', lines: { n: 3, key: '81¢ rounds to 80¢ in cash, so the change is 20¢.' } },
          { q: 'Why do we add before we round?', lines: { n: 2, key: 'Only the cash total rounds, not each price.' } },
          { q: 'Find two prices that total 75¢.', lines: { n: 2, key: 'For example: 40¢ and 35¢.' } },
          TW(34, 24)]
      }
    },

    give: {
      watch: 'giving many small coins, or too many dimes when a quarter fits. Ask: "Does a quarter fit? Another one?"',
      goal: 'I can give change with the fewest coins.',
      learn: {
        show: { pic: ['coins', { list: [25, 25, 25, 10] }], cap: '85¢: 3 quarters, then a dime', eq: ['75 + 10 = 85¢'] },
        together: [FW(45), FW(60)],
        cue: 'Quarters while they fit, then dimes, then nickels.',
        own: [FW(35), FW(90)]
      },
      p1: {
        show: { pic: ['coins', { list: [25, 10, 10] }], cap: '45¢: 1 quarter, 2 dimes', eq: ['25 + 20 = 45¢'] },
        items: [FW(30), FW(50), FW(15), FW(70)]
      },
      p2: {
        items: [FW(55), FW(80), FW(65), FW(40)]
      },
      p3: {
        items: [FW(95), FW(20), FW(85), FW(75)]
      },
      think: {
        items: [{ q: '{b} gives 45¢ change as 9 nickels. Is that the fewest coins?', lines: { n: 3, key: 'No. 1 quarter and 2 dimes: 3 coins.' } },
          { q: 'Why start with quarters?', lines: { n: 2, key: 'The biggest coin that fits uses the fewest coins.' } },
          { q: 'Draw the fewest coins for 70¢.', draw: { h: 50, key: '2 quarters and 2 dimes.' } },
          FW(60)]
      }
    },

    bill: {
      watch: 'adding the price and the bill ($6 + $10 = $16). Ask: "Can the change be more than you paid?"',
      goal: 'I can count up from a price to a bill.',
      learn: {
        show: { pic: ['coins', { list: [200, 500] }], cap: '$13, a toonie to $15, a $5 bill to $20', eq: ['$13 + $7 = $20'] },
        together: [BL(6, 10), BL(17, 20)],
        cue: 'Count up from the price to the bill.',
        own: [BL(8, 10), BL(14, 20), BL(3, 5)]
      },
      p1: {
        show: { cap: '$6, then $8, then $10', eq: ['$6 + $4 = $10'] },
        items: [BL(7, 10), BL(2, 5), BL(15, 20), BL(9, 10), BL(11, 20), BL(4, 10)]
      },
      p2: {
        items: [BL(12, 20), BL(18, 20), BL(35, 50), BL(26, 50),
          story('A book costs $13. {a} pays with $20. What is the change?', '$', 7, '20 − 13'), story('A kite costs $6. {b} pays with $10. What is the change?', '$', 4, '10 − 6')]
      },
      p3: {
        items: [BL(42, 50), BL(9, 20), BL(31, 50), BL(64, 100),
          story('A cap costs $17. {a} pays with $20. What is the change?', '$', 3, '20 − 17'), TF('$6 + $16 = $10', false)]
      },
      think: {
        items: [{ q: '{b} says the change from $10 for a $6 kite is $16. What went wrong?', lines: { n: 3, key: '{b} added. Count up from $6 to $10: $4.' } },
          { q: 'Draw the bills and coins to count up from $13 to $20.', draw: { h: 60, key: 'A toonie to $15, then a $5 bill to $20: $7.' } },
          { q: 'Can the change be more than the bill you paid with? Why?', lines: { n: 2, key: 'No. The change is part of what you paid.' } },
          BL(27, 50)]
      }
    },

    subtract: {
      watch: 'subtracting the smaller digit from the bigger ($50 − $27 = $37). Take away the tens, then the ones, and check by adding.',
      goal: 'I can subtract to find the change, and check by adding.',
      learn: {
        show: { cap: '$20 for a $13 game', eq: ['$20 − $13 = $7', '$13 + $7 = $20'] },
        together: [SB(27, 50), SB(8, 20)],
        cue: 'Subtract the price from the bill. Add to check.',
        own: [SB(15, 20), SB(36, 50)]
      },
      p1: {
        show: { cap: '$10 for a $4 book', eq: ['$10 − $4 = $6'] },
        items: [SB(3, 10), SB(12, 20), SB(45, 50), SB(6, 20)]
      },
      p2: {
        items: [SB(23, 50), SB(17, 20), SB(58, 100), SB(39, 50)]
      },
      p3: {
        items: [SB(64, 100), SB(81, 100), SB(46, 50), SB(29, 100)]
      },
      think: {
        items: [{ q: '{b} says $50 − $27 = $37. What went wrong?', lines: { n: 3, key: '{b} took 0 from 7. Regroup: $50 − $27 = $23. Check: $27 + $23 = $50.' } },
          { q: 'Why is adding a good check?', lines: { n: 2, key: 'Price plus change must make the bill.' } },
          { q: '{a} buys a $13 game and a $4 book with $20. What is the change?', eq: ['$ []'], a: [3], calc: '20 − 13 − 4' },
          SB(19, 50)]
      }
    },

    est: {
      watch: 'giving the exact change when asked for an estimate, or not noticing a change far from it. Ask: "Is this close?"',
      goal: 'I can estimate change and check it makes sense.',
      learn: {
        show: { cap: '68¢ is about 70¢', eq: ['68¢ is about 70¢', '100 − 70 = 30¢'] },
        together: [ES(23), ES(52)],
        cue: 'Round the price to the nearest 10¢. Then find the change.',
        own: [ES(81), ES(37)]
      },
      p1: {
        show: { cap: '41¢ is about 40¢', eq: ['about 60¢ change'] },
        items: [ES(29), ES(62), ES(18), ES(74)]
      },
      p2: {
        items: [ES(46), ES(13), ES(88), ES(57)]
      },
      p3: {
        items: [ES(33), ES(91), ES(66), ES(24)]
      },
      think: {
        items: [{ q: 'An eraser costs 23¢. {b} gets 57¢ change from $1. Does that make sense?', lines: { n: 3, key: 'No. About 80¢ is right (exactly 77¢). 57¢ is far from it.' } },
          { q: 'When is an estimate enough?', lines: { n: 2, key: 'When you only need to know about how much, like if you have enough.' } },
          { q: 'Find the exact change for 68¢ from $1.', eq: ['100 − 68 = [] ¢'], a: [32] },
          ES(72)]
      }
    },

    mix: {
      watch: 'adding every pair of numbers, even for change or "how much more". Ask: "Putting money together, or finding a gap?"',
      goal: 'I can tell a total, a change and a how-much-more story apart.',
      learn: {
        show: { cap: 'Together: add. A gap: subtract.', eq: ['total: $8 + $6 = $14', 'change: $10 − $8 = $2'] },
        together: [story('A book is $8 and a kite is $6. How much for both?', '$', 14, '8 + 6'), story('{a} has 30¢. A muffin is 45¢. How much more is needed?', '¢', 15, '45 − 30')],
        cue: 'Putting money together: add. Finding a gap or change: subtract.',
        own: [story('{b} pays $10 for an $8 book. What is the change?', '$', 2, '10 − 8'), OK(80, [35, 40]), OK(50, [25, 30])]
      },
      p1: {
        show: { cap: 'How much more: the gap', eq: ['$8 − $6 = $2'] },
        items: [story('A ball is $5 and a bat is $9. How much for both?', '$', 14, '5 + 9'), story('{a} has $6. A game is $10. How much more is needed?', '$', 4, '10 − 6'),
          story('{b} pays $20 for a $15 shirt. What is the change?', '$', 5, '20 − 15'), OK(90, [45, 40]), OK(60, [35, 30]),
          story('A pen is 35¢ and a pad is 50¢. How much for both?', '¢', 85, '35 + 50')]
      },
      p2: {
        items: [story('{a} has 55¢. A snack is 80¢. How much more is needed?', '¢', 25, '80 − 55'), story('{b} pays $50 for a $32 hat. What is the change?', '$', 18, '50 − 32'),
          story('Skates are $35 and a helmet is $28. How much for both?', '$', 63, '35 + 28'), OK(100, [55, 40]), OK(75, [40, 45]),
          story('{a} saved $13. A book is $20. How much more is needed?', '$', 7, '20 − 13')]
      },
      p3: {
        items: [story('{b} buys a $12 book and a $6 pen with $20. What is the change?', '$', 2, '20 − 12 − 6'), story('{a} has $25. A game is $40. How much more is needed?', '$', 15, '40 − 25'),
          story('A 45¢ apple and a 35¢ juice. How much for both?', '¢', 80, '45 + 35'), OK(95, [50, 45]), OK(70, [35, 40]),
          story('{b} has $9 and earns $6 more. A kite is $20. How much more is needed?', '$', 5, '20 − 9 − 6')]
      },
      think: {
        items: [{ q: '{a} has 30¢. A muffin is 45¢. {b} says {a} needs 75¢ more. What went wrong?', lines: { n: 3, key: '{b} added. The gap is 45 − 30 = 15¢.' } },
          { q: 'Write a "how much more" story about $10 and $7.', lines: { n: 3, key: 'For example: {a} has $7. A book is $10. {a} needs $3 more.' } },
          { q: 'Which words tell you to add? To subtract?', lines: { n: 3, key: 'Add: both, in all, altogether. Subtract: change, how much more, left.' } },
          OK(60, [25, 40])]
      }
    }
  } });
})();
