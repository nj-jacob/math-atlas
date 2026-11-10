/* Grade 2 Money: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the lessons
   in chapters/money.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names.
   Ontario 2020: F1.1 the value of Canadian coins and bills, counting collections to 200¢ and bills to $200, and different
   ways to make the same amount.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function sum(l) { return l.reduce(function (s, v) { return s + v; }, 0); }
  var NAME = { 5: 'nickel', 10: 'dime', 25: 'quarter', 100: 'loonie', 200: 'toonie' };
  /* coins to count, in cents (or bills, in dollars) */
  function CN(list, q) { return { q: q || 'How much?', pic: ['coins', { list: list }], eq: ['[] ¢'], a: [sum(list)] }; }
  function BL(list, q) { return { q: q || 'How much?', pic: ['coins', { list: list }], eq: ['$[]'], a: [sum(list) / 100] }; }
  /* the name of a coin */
  function NM(v) { var o = v < 100 ? ['nickel', 'dime', 'quarter'] : ['loonie', 'toonie']; return { q: 'Name the coin.', pic: ['coins', { list: [v] }], pick: { opts: o, ans: o.indexOf(NAME[v]), coinName: v } }; }
  /* how many cents a coin is worth */
  function VL(name, v) { return { eq: ['1 ' + name + ' = [] ¢'], a: [v], coins: true }; }
  /* which coin is worth the most */
  function MOST(opts) { var v = opts.map(function (n) { return { nickel: 5, dime: 10, quarter: 25, loonie: 100, toonie: 200 }[n]; }); return { q: 'Which is worth the most?', pick: { opts: opts, ans: v.indexOf(Math.max.apply(null, v)), coinMost: true } }; }
  /* a sum of coin values, written out biggest first */
  function SM(list) { var s = list.slice().sort(function (x, y) { return y - x; }); return { eq: [s.join('¢ + ') + '¢ = [] ¢'], a: [sum(s)], wide: s.length > 4 }; }
  function story(q, unit, ans, calc) { return { q: q, eq: [unit === '$' ? '$[]' : '[] ' + unit], a: [ans], calc: calc }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st, coins: true }; }
  /* compare two amounts of coins: <, > or = */
  function CM(l, r, a) { return { q: 'Write <, > or =.', eq: [l + ' [] ' + r], a: [a], coins: true }; }

  S.register('money', { code: 'MO', ideas: {

    names: {
      watch: 'mixing up the nickel and the dime. Name the coin, then say its value.',
      goal: 'I can name coins and their values.',
      learn: {
        show: { pic: ['coins', { list: [5, 10, 25, 100, 200] }], cap: 'nickel, dime, quarter, loonie, toonie', eq: ['5¢, 10¢, 25¢, $1, $2'] },
        together: [NM(10), NM(25)],
        cue: 'Say the name and the value together: dime, 10 cents.',
        own: [NM(5), NM(200), VL('dime', 10), VL('quarter', 25)]
      },
      p1: {
        show: { cap: '100 cents is 1 dollar', eq: ['100¢ = $1'] },
        items: [NM(100), NM(10), VL('nickel', 5), VL('loonie', 100), VL('toonie', 200), NM(25)]
      },
      p2: {
        items: [CN([10, 10]), CN([5, 5, 5]), CN([25, 25]), CN([100, 100]),
          { q: 'Draw a coin worth 25¢.', draw: { h: 40, key: ['coins', { list: [25] }] } }, { q: 'Draw a coin worth $2.', draw: { h: 40, key: ['coins', { list: [200] }] } }]
      },
      p3: {
        items: [TF('1 loonie = 100¢', true), TF('1 toonie = 100¢', false), TF('2 nickels = 1 dime', true), TF('1 quarter = 20¢', false)]
      },
      think: {
        items: [{ q: '{a} calls the 10¢ coin a nickel. What would you tell {a}?', lines: { n: 2, key: 'The 10¢ coin is a dime. The nickel is 5¢.' } },
          { q: 'Why do you think the $1 coin is called a loonie?', lines: { n: 2, key: 'It has a loon on it.' } },
          { q: 'Which coins could you use to pay for something that costs 15¢?', lines: { n: 2, key: 'For example: a dime and a nickel, or 3 nickels.' } },
          { q: 'Draw the coin you think is most useful. Why?', draw: { h: 60, key: 'Answers will vary.' } }]
      }
    },

    size: {
      watch: 'thinking bigger coins are worth more. A dime is small but worth more than a nickel.',
      goal: 'I can tell value is not the same as size.',
      learn: {
        show: { pic: ['coins', { list: [5, 10] }], cap: 'The dime is smaller', eq: ['10¢ is more than 5¢'] },
        together: [MOST(['nickel', 'dime']), MOST(['dime', 'quarter', 'nickel'])],
        cue: 'Look at the value, not the size.',
        own: [MOST(['loonie', 'quarter']), MOST(['toonie', 'loonie', 'dime']), MOST(['nickel', 'quarter']), MOST(['dime', 'nickel', 'loonie'])]
      },
      p1: {
        show: { cap: 'The nickel is bigger than the dime', eq: ['the dime is worth more'] },
        items: [MOST(['nickel', 'dime', 'quarter']), MOST(['quarter', 'loonie']), MOST(['dime', 'nickel']), MOST(['toonie', 'quarter', 'loonie']),
          { eq: ['5 [] 10'], a: ['<'] }, { eq: ['25 [] 10'], a: ['>'] }]
      },
      p2: {
        items: [CN([5, 5]), CN([10]), CM('2 nickels', '1 dime', '='), CM('3 dimes', '1 quarter', '>'), CM('1 quarter', '3 nickels', '>'), CM('4 nickels', '1 quarter', '<')]
      },
      p3: {
        items: [CN([10, 10, 10]), CN([25, 5]), CM('4 nickels', '2 dimes', '='), CM('1 loonie', '3 quarters', '>'),
          { q: '{a} has 4 nickels. {b} has 2 dimes. Who has more?', lines: { n: 2, key: 'The same: both have 20¢.' } }, { q: '{b} has 1 quarter. {a} has 3 nickels. Who has more?', lines: { n: 2, key: '{b}: 25¢ is more than 15¢.' } }]
      },
      think: {
        items: [{ q: '{b} says the nickel is worth more because it is bigger. What would you tell {b}?', lines: { n: 2, key: 'Size does not show value. The dime is 10¢, the nickel 5¢.' } },
          { q: 'Would you rather have 5 nickels or 1 quarter? Why?', lines: { n: 2, key: 'They are the same: 25¢. Either is fine.' } },
          { q: 'Can fewer coins be worth more? Give an example.', lines: { n: 2, key: 'Yes: 1 quarter (25¢) is more than 3 nickels (15¢).' } },
          { q: 'Draw two coins: the smaller one worth more.', draw: { h: 50, key: 'A dime and a nickel.' } }]
      }
    },

    biggest: {
      watch: 'counting coins in the order they lie. Put the coin worth the most first, then skip count.',
      goal: 'I can count coins, biggest first.',
      learn: {
        show: { pic: ['coins', { list: [25, 25, 10, 5] }], cap: '25, 50, 60, 65', eq: ['65¢'] },
        together: [CN([10, 25, 5]), CN([5, 10, 10, 25])],
        cue: 'Sort the coins: biggest value first. Then count on.',
        own: [CN([25, 10, 10]), CN([5, 25, 5]), SM([10, 25, 5, 5]), SM([25, 25, 10])]
      },
      p1: {
        show: { cap: '10, 20, 25, 30', eq: ['2 dimes and 2 nickels = 30¢'] },
        items: [CN([10, 10, 5]), CN([25, 5, 5]), CN([25, 10]), CN([10, 5, 10, 5]), CN([25, 25, 5]), CN([10, 10, 10, 10])]
      },
      p2: {
        items: [CN([100, 25, 10]), CN([25, 25, 25, 10]), CN([100, 10, 5, 5]), SM([5, 10, 25, 25, 10]),
          { q: '{a} has a quarter, 2 dimes and a nickel. How much?', eq: ['1 quarter + 2 dimes + 1 nickel = [] ¢'], a: [50], coins: true, wide: true }, { q: '{b} has 3 quarters and a dime. How much?', eq: ['3 quarters + 1 dime = [] ¢'], a: [85], coins: true, wide: true }]
      },
      p3: {
        items: [CN([100, 100, 25, 10]), CN([200, 25, 25, 10, 5]), { q: '{a} has 3 dimes and 4 nickels. How much?', eq: ['3 dimes + 4 nickels = [] ¢'], a: [50], coins: true, wide: true },
          { q: '{b} counted 5, 10, 35, 45 for a nickel, a nickel, a quarter and a dime. Is that right? Is there an easier order?', lines: { n: 2, key: 'Yes, 45¢. Easier: 25, 35, 40, 45.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why count the quarters first?', lines: { n: 2, key: 'Big jumps first, then small ones: fewer steps.' } },
          { q: '{a} counted every coin as 1. What went wrong?', lines: { n: 2, key: 'Each coin has its own value. Count by the value.' } },
          { q: 'Draw coins worth 40¢ in two different ways.', draw: { h: 60, key: 'For example: 4 dimes, or a quarter, a dime and a nickel.' } },
          { q: 'What coins could make 100¢?', lines: { n: 2, key: 'For example: 4 quarters, a loonie, or 10 dimes.' } }]
      }
    },

    ways: {
      watch: 'thinking there is only one way. The same amount can be made with different coins.',
      goal: 'I can make the same amount in different ways.',
      learn: {
        show: { pic: ['row', { list: [['coins', { list: [25, 25] }], ['coins', { list: [10, 10, 10, 10, 10] }]], gap: 24 }], cap: '2 quarters, or 5 dimes', eq: ['both 50¢'] },
        together: [CN([25, 10, 10, 5]), CN([10, 10, 10, 10, 5, 5])],
        cue: 'Count each way. Same total: same amount.',
        own: [CN([25, 5, 5, 5, 5, 5]), CN([10, 10, 10, 10, 10]), { eq: ['2 quarters = [] dimes'], a: [5], coins: true }, { eq: ['1 dime = [] nickels'], a: [2], coins: true }]
      },
      p1: {
        show: { cap: '1 quarter = 2 dimes and 1 nickel', eq: ['25¢ = 10¢ + 10¢ + 5¢'] },
        items: [{ eq: ['1 quarter = [] nickels'], a: [5], coins: true }, { eq: ['1 quarter = 2 dimes + [] nickel'], a: [1], coins: true, wide: true },
          { eq: ['4 dimes = [] nickels'], a: [8], coins: true }, { eq: ['50¢ = [] quarters'], a: [2], coins: true }, { eq: ['30¢ = [] dimes'], a: [3], coins: true }, { eq: ['20¢ = [] nickels'], a: [4], coins: true }]
      },
      p2: {
        items: [{ q: 'Show 50¢ two ways.', draw: { h: 50, key: 'For example: 2 quarters; 5 dimes.' } }, { q: 'Show 35¢ two ways.', draw: { h: 50, key: 'For example: a quarter and a dime; 3 dimes and a nickel.' } },
          { eq: ['1 quarter + 1 nickel = [] dimes'], a: [3], coins: true, wide: true }, { eq: ['3 dimes + 2 nickels = [] ¢'], a: [40], coins: true, wide: true }]
      },
      p3: {
        items: [{ q: 'Show 75¢ with the fewest coins.', lines: { n: 1, key: '3 quarters.' } }, { q: 'Show 75¢ with no quarters.', lines: { n: 1, key: 'For example: 7 dimes and a nickel.' } },
          { eq: ['2 quarters + 3 dimes + 4 nickels = [] ¢'], a: [100], coins: true, wide: true },
          { q: 'Find 3 ways to make 30¢.', lines: { n: 3, key: '3 dimes; a quarter and a nickel; 6 nickels.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} has 5 dimes. {b} has 2 quarters. {a} says, "I have more." Is that right?', lines: { n: 2, key: 'No. Both have 50¢.' } },
          { q: 'Why might a store want you to use fewer coins?', lines: { n: 2, key: 'Fewer coins are quicker to count.' } },
          { q: 'Draw 60¢ with exactly 3 coins.', draw: { h: 50, key: '2 quarters and a dime.' } },
          { q: 'How many ways can you make 15¢?', lines: { n: 2, key: '3 ways: a dime and a nickel; 3 nickels; (and 15 pennies, which Canada no longer uses).' } }]
      }
    },

    trade: {
      watch: 'trading 4 quarters for $4. 4 quarters make one dollar.',
      goal: 'I can trade quarters, loonies and toonies.',
      learn: {
        show: { pic: ['coins', { list: [25, 25, 25, 25] }], cap: '25, 50, 75, 100', eq: ['4 quarters = $1'] },
        together: [{ eq: ['2 loonies = [] toonie'], a: [1], coins: true }, { eq: ['8 quarters = [] loonies'], a: [2], coins: true }],
        cue: '4 quarters make a loonie. 2 loonies make a toonie.',
        own: [{ eq: ['1 toonie = [] quarters'], a: [8], coins: true }, { eq: ['3 loonies = [] quarters'], a: [12], coins: true }, BL([100, 25, 25, 25, 25]), BL([200, 100])]
      },
      p1: {
        show: { cap: '2 loonies make a toonie', eq: ['$1 + $1 = $2'] },
        items: [{ eq: ['4 quarters = [] loonie'], a: [1], coins: true }, { eq: ['2 toonies = [] loonies'], a: [4], coins: true }, { eq: ['1 loonie = [] dimes'], a: [10], coins: true },
          BL([200, 200]), BL([100, 100, 100]), BL([200, 100, 25, 25, 25, 25])]
      },
      p2: {
        items: [{ eq: ['1 toonie + 4 quarters = [] loonies'], a: [3], coins: true, wide: true }, { eq: ['2 toonies + 1 loonie = [] loonies'], a: [5], coins: true, wide: true },
          { q: '{a} trades 6 quarters for loonies.', eq: ['6 quarters = [] loonie + [] quarters'], a: [1, 2], coins: true, wide: true }, { q: '{b} has 3 toonies.', eq: ['3 toonies = [] loonies'], a: [6], coins: true }]
      },
      p3: {
        items: [{ eq: ['10 quarters = [] loonies + [] quarters'], a: [2, 2], coins: true, wide: true }, { eq: ['2 toonies + 2 quarters = [] ¢'], a: [450], coins: true, wide: true },
          { q: '{a} has a toonie, a loonie and 2 quarters. How much?', eq: ['1 toonie + 1 loonie + 2 quarters = [] ¢'], a: [350], coins: true, wide: true }]
      },
      think: {
        items: [{ q: 'Why are 4 quarters worth the same as a loonie?', lines: { n: 2, key: '25 + 25 + 25 + 25 = 100¢ = $1.' } },
          { q: '{b} says 2 toonies are worth $2. What went wrong?', lines: { n: 2, key: 'Each toonie is $2, so 2 toonies are $4.' } },
          { q: 'Draw $3 in coins two ways.', draw: { h: 60, key: 'For example: a toonie and a loonie; 3 loonies.' } },
          { q: 'Why does Canada have a $2 coin?', lines: { n: 2, key: 'It is easier to carry than lots of loonies, and lasts longer than a bill.' } }]
      }
    },

    countb: {
      watch: 'counting bills as 1 each. Count by each bill\'s value, biggest first.',
      goal: 'I can count bills.',
      learn: {
        show: { pic: ['coins', { list: [2000, 1000, 500] }], cap: '20, 30, 35', eq: ['$35'] },
        together: [BL([1000, 1000, 500]), BL([2000, 500, 500])],
        cue: 'Biggest bill first. Skip count by its value.',
        own: [BL([5000, 1000]), BL([2000, 2000, 1000]), BL([10000, 2000, 500]), BL([500, 500, 500])]
      },
      p1: {
        show: { cap: '$5, $10, $20, $50 and $100', eq: ['$10 + $5 = $15'] },
        items: [BL([1000, 500]), BL([2000, 1000]), BL([5000, 2000, 500]), BL([1000, 1000, 1000]), BL([10000, 5000]), BL([2000, 2000, 2000])]
      },
      p2: {
        items: [BL([10000, 2000, 1000, 500]), BL([5000, 5000, 2000]), story('{a} has a $20 bill and a $10 bill. How much?', '$', 30, '20 + 10'), { q: '{b} has three $5 bills. How much?', eq: ['3 $5 bills = $[]'], a: [15], coins: true }]
      },
      p3: {
        items: [BL([10000, 5000, 2000, 1000, 500]), BL([5000, 2000, 2000, 1000, 500, 500]), story('{a} has $50, $20 and $5. How much?', '$', 75, '50 + 20 + 5'),
          { q: 'Show $45 with bills.', lines: { n: 1, key: 'For example: $20, $20 and $5.' } }]
      },
      think: {
        items: [{ q: '{a} counted 3 bills as $3. What went wrong?', lines: { n: 2, key: 'Each bill has its own value. Count by $5, $10 or $20.' } },
          { q: 'Which bill would you use to buy something for $8? Why?', lines: { n: 2, key: 'A $10 bill: $5 is not enough.' } },
          { q: 'Draw bills that make $60.', draw: { h: 60, key: 'For example: $50 and $10.' } },
          { q: 'Why do we use bills for bigger amounts?', lines: { n: 2, key: 'It would take too many coins.' } }]
      }
    },

    sameb: {
      watch: 'thinking more bills means more money. Count the value.',
      goal: 'I can make the same amount with bills in different ways.',
      learn: {
        show: { pic: ['row', { list: [['coins', { list: [5000, 5000] }], ['coins', { list: [2000, 2000, 2000, 2000, 2000] }]], gap: 20 }], cap: '2 fifties, or 5 twenties', eq: ['both $100'] },
        together: [{ eq: ['$20 = [] $10 bills'], a: [2], coins: true }, { eq: ['$50 = [] $10 bills'], a: [5], coins: true }],
        cue: 'Count each way. Same total: same amount.',
        own: [{ eq: ['$100 = [] $20 bills'], a: [5], coins: true }, { eq: ['$10 = [] $5 bills'], a: [2], coins: true }, { eq: ['$50 = $20 + $20 + $[]'], a: [10] }, { eq: ['$100 = $50 + $20 + $[]'], a: [30] }]
      },
      p1: {
        show: { cap: '$20 = $10 + $10', eq: ['$20 = $5 + $5 + $10'] },
        items: [{ eq: ['$100 = [] $50 bills'], a: [2], coins: true }, { eq: ['$20 = [] $5 bills'], a: [4], coins: true }, { eq: ['$40 = [] $20 bills'], a: [2], coins: true },
          { eq: ['$30 = $20 + $[]'], a: [10] }, { eq: ['$75 = $50 + $20 + $[]'], a: [5] }, { eq: ['$60 = $50 + $[]'], a: [10] }]
      },
      p2: {
        items: [{ q: 'Show $50 two ways.', draw: { h: 50, key: 'For example: one $50; two $20 and one $10.' } }, { q: 'Show $35 two ways.', draw: { h: 50, key: 'For example: $20, $10, $5; seven $5.' } },
          { eq: ['$100 = $20 + $20 + $20 + $20 + $[]'], a: [20], wide: true }]
      },
      p3: {
        items: [{ q: 'Make $100 with the fewest bills.', lines: { n: 1, key: 'One $100 bill.' } }, { q: 'Make $100 with no $50 or $100 bills.', lines: { n: 1, key: 'For example: five $20 bills.' } },
          { q: '{a} has two $20 bills. {b} has four $10 bills. Who has more?', eq: ['2 $20 bills [] 4 $10 bills'], a: ['='], coins: true, wide: true }, { eq: ['$200 = [] $50 bills'], a: [4], coins: true }]
      },
      think: {
        items: [{ q: '{b} has 10 bills. {a} has 1 bill. Must {b} have more money?', lines: { n: 2, key: 'No. 10 $5 bills is $50; one $100 bill is more.' } },
          { q: 'Why might a store want you to pay with fewer bills?', lines: { n: 2, key: 'Fewer bills are quicker to count.' } },
          { q: 'Draw $25 in bills two ways.', draw: { h: 60, key: '$20 and $5; five $5.' } },
          { q: 'How are counting coins and counting bills alike?', lines: { n: 2, key: 'Both are counted by value, biggest first.' } }]
      }
    }
  } });
})();
