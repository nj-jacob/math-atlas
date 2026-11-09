/* Grade 6 Money and Finances: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/money.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: F1.1 ways to pay and their good points and risks; F1.2 earning and saving goals and a plan to reach
   them; F1.3 what helps and what gets in the way; F1.4 interest on savings and on credit, and bank fees; F1.5 trading,
   lending, borrowing and donating. The answer checks are in tests/verify/sheets.js: a way to pay comes from how the
   money moves (pick.pay), a goal's length from how far away it is (pick.span), the cheaper plan from its costs
   (pick.less), a way of sharing from what moves and whether it comes back (pick.dist), and every sum with dollars
   and percents is worked out (500 × 3% = 15). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function M(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function story(q, unit, ans, calc) { return { q: q, eq: [unit === '$' ? '$ []' : '[] ' + unit], a: [ans], calc: calc }; }
  var WAYS = ['cash', 'debit', 'credit', 'gift card'];
  function PW(q, how) { var way = how.cash ? 'cash' : how.gift ? 'gift card' : how.from === 'own' ? 'debit' : 'credit'; return { q: q, pick: { opts: WAYS, ans: WAYS.indexOf(way), pay: how }, wide: true }; }
  /* a goal days away: short-term or long-term */
  function SP(q, days) { return { q: q, pick: { opts: ['short-term', 'long-term'], ans: days < 90 ? 0 : 1, span: { days: days } } }; }
  /* weeks to save: what is left, then divided by the saving each week */
  function WK(cost, have, per) { return { q: 'Goal $' + cost + '. Have $' + have + '. Save $' + per + ' a week.', eq: [cost + ' − ' + have + ' = []', '[] ÷ ' + per + ' = [] weeks'], a: [cost - have, cost - have, (cost - have) / per] }; }
  /* simple interest for t years, then the total */
  function SI(p, r, t) { var i = p * r * t / 100; return { q: '$' + p + ' at ' + r + '% a year for ' + t + ' year' + (t > 1 ? 's' : '') + '.', eq: [p + ' × ' + r + '% × ' + t + ' = []', p + ' + [] = []'], a: [i, i, p + i], wide: true }; }
  function ONE(p, r) { return { eq: [p + ' × ' + r + '% = []'], a: [p * r / 100] }; }
  /* two bank plans for n transactions a month, one with a fee for each and one flat: which costs less? */
  function PL(n, a, b) {
    return { q: n + ' transactions a month. Plan A: $' + M(a[0]) + ' a month + $' + M(a[1]) + ' each. Plan B: $' + M(b) + ' a month, nothing more.',
      pick: { opts: ['Plan A', 'Plan B'], ans: a[0] + n * a[1] < b ? 0 : 1, less: [a[0] + ' + ' + n + ' × ' + a[1], String(b)] }, wide: true };
  }
  function PC(n, f, each) { return { eq: [M(f) + ' + ' + n + ' × ' + M(each) + ' = $ []'], a: [M(f + n * each)] }; }
  /* trade, lend, borrow or donate */
  var DIST = ['trade', 'lend', 'borrow', 'donate'];
  function DS(q, how) { var way = how.swap ? 'trade' : how.give && how.back ? 'lend' : how.get && how.back ? 'borrow' : 'donate'; return { q: q, pick: { opts: DIST, ans: DIST.indexOf(way), dist: how }, wide: true }; }

  S.register('money', { code: 'MO', ideas: {

    methods: {
      watch: 'thinking a card is free money. Debit, credit and gift cards all spend real money.',
      goal: 'I can choose a way to pay and say why.',
      learn: {
        show: { cap: 'credit: the bank pays now, and you pay it back later', eq: ['debit: my money, now'] },
        together: [PW('{a} pays with a $20 bill.', { cash: true }), PW('$12 leaves {b}\'s own account right away.', { from: 'own' })],
        cue: 'Whose money moves, and when?',
        own: [PW('A card that works only at one store, already paid for.', { gift: true }), PW('The bank pays now. {a} pays the bank next month.', { from: 'bank' })]
      },
      p1: {
        show: { cap: 'a gift card is paid for already and works at one store', eq: ['$20 card, $13 spent: $7 left'] },
        items: [PW('{b} taps a card and $8 leaves {b}\'s account at once.', { from: 'own' }), PW('{a} pays with two toonies and a loonie.', { cash: true }),
          PW('The bank pays the store. {b} owes the bank.', { from: 'bank' }), PW('{a} uses a card from a birthday that works at one store.', { gift: true })]
      },
      p2: {
        items: [story('{a} has $45.00 in an account and pays $18.75 by debit. How much is left?', '$', '26.25', '45.00 − 18.75'),
          story('A $20 gift card buys a $13.50 book. How much is left on the card?', '$', '6.50', '20 − 13.50'),
          { q: 'Give one good point and one risk of paying with cash.', lines: { n: 2, key: 'Good: you see exactly what you spend. Risk: it can be lost or stolen.' } },
          { q: 'Give one good point and one risk of paying by debit.', lines: { n: 2, key: 'Good: no cash to carry. Risk: you can spend more than you planned.' } }]
      },
      p3: {
        items: [PW('The bank pays for a $300 bike now. {b} pays it back over 3 months.', { from: 'bank' }),
          story('{a} buys a $3.75 drink with a $5 bill. How much change?', '$', '1.25', '5 − 3.75'),
          { q: 'Which way would you pay for a snack at a market with no card reader? Why?', lines: { n: 2, key: 'Cash, because it works without a card reader.' } },
          { q: 'Which way would you pay online for a game? Why?', lines: { n: 2, key: 'A gift card or debit, so you spend only money you have.' } }]
      },
      think: {
        items: [{ q: '{b} says paying by card is free because no money changes hands. What would you say?', lines: { n: 3, key: 'The money still leaves an account, now (debit) or later (credit).' } },
          { q: 'Why might a store not accept cheques any more?', lines: { n: 2, key: 'They are slow, and the money might not be in the account.' } },
          PW('{a} uses a card, and the bank sends a bill at the end of the month.', { from: 'bank' })]
      }
    },

    credit: {
      watch: 'treating credit like your own money. Credit is a loan; paid late, it costs interest.',
      goal: 'I can compare debit and credit, and find the cost of interest.',
      learn: {
        show: { cap: '$200 on credit at 20% a year, unpaid for a year', eq: ['200 × 20% = 40', 'owe $240'] },
        together: [ONE(300, 20), ONE(150, 20)],
        cue: 'Debit: your money now. Credit: the bank\'s money, paid back later.',
        own: [ONE(500, 19), ONE(80, 25)]
      },
      p1: {
        show: { eq: ['10% of 200 = 20, so 20% = 40'] },
        items: [ONE(100, 20), ONE(400, 20), ONE(250, 20), ONE(1000, 19), ONE(60, 25), ONE(750, 20)]
      },
      p2: {
        items: [SI(200, 20, 1), SI(600, 20, 1),
          { q: 'You pay the whole credit bill on time. How much interest?', lines: { n: 1, key: '$0. Interest is only on what is left unpaid.' } },
          { q: 'When is credit a good choice? When is it risky?', lines: { n: 3, key: 'Good: you can pay the whole bill on time. Risky: you cannot pay it all, and interest grows.' } }]
      },
      p3: {
        items: [SI(500, 20, 2),
          story('A $1200 laptop on credit at 20% a year, unpaid for 1 year. How much is owed?', '$', 1440, '1200 + 1200 × 20%'),
          story('{b} pays $50 a month on a $300 credit bill with no interest. How many months?', 'months', 6, '300 ÷ 50'),
          { q: 'Why does a store sometimes offer "buy now, pay later"?', lines: { n: 2, key: 'To make you buy more now. If you pay late, you pay interest or fees.' } }]
      },
      think: {
        items: [{ q: '{b} says credit is better than debit because you can spend more. Is that wise?', lines: { n: 3, key: 'No. Credit money must be paid back, often with interest. Spend only what you can pay back.' } },
          { q: 'Why do banks charge interest on credit?', lines: { n: 2, key: 'You are using their money. Interest is the cost of borrowing it.' } },
          ONE(450, 20)]
      }
    },

    kinds: {
      watch: 'mixing up goal lengths. Days or weeks: short-term. Months or years: long-term.',
      goal: 'I can describe earning and saving goals, short-term and long-term.',
      learn: {
        show: { cap: 'earning goal: make money; saving goal: keep money for later', eq: ['3 weeks: short-term'] },
        together: [SP('Save $20 for a movie in 3 weeks.', 21), SP('Save $600 for a bike in 1 year.', 365)],
        cue: 'How far away is it? Days or weeks, or months or years?',
        own: [SP('Earn $40 shovelling snow this weekend.', 3), SP('Save for college in 6 years.', 2190)]
      },
      p1: {
        show: { cap: 'days or weeks away', eq: ['short-term'] },
        items: [SP('Buy a $15 gift in 10 days.', 10), SP('Save $1000 for a trip in 2 years.', 730), SP('Earn $30 babysitting in 2 weeks.', 14),
          SP('Save $400 for a phone in 8 months.', 240),
          { q: 'Is "earn $50 mowing lawns" an earning or a saving goal?', lines: { n: 1, key: 'An earning goal: it is about making money.' } }]
      },
      p2: {
        items: [SP('Save $5 a week for a $25 book.', 35), SP('Save $50 a month for a $900 keyboard.', 540),
          { q: 'Write a short-term saving goal for yourself.', lines: { n: 2, key: 'For example: save $12 for a puzzle in 4 weeks.' } },
          { q: 'Write a long-term earning goal.', lines: { n: 2, key: 'For example: earn $300 over the summer selling crafts.' } }]
      },
      p3: {
        items: [SP('Save $2 a day for 30 days.', 30), SP('Save for a canoe trip next summer, 10 months away.', 300),
          { q: 'Why is it useful to split a long-term goal into short-term steps?', lines: { n: 3, key: 'Small steps are easier to reach and track, and keep you going.' } }]
      },
      think: {
        items: [{ q: 'A goal: "Save money." Why is that hard to reach? Make it better.', lines: { n: 3, key: 'It has no amount or date. Better: save $60 for skates by March 1.' } },
          { q: 'How can an earning goal help a saving goal?', lines: { n: 2, key: 'Money you earn can go into savings, so you reach the saving goal sooner.' } },
          SP('Save $10 a week for 6 weeks.', 42)]
      }
    },

    plan: {
      watch: 'forgetting the money you already have. Take it away first, then divide.',
      goal: 'I can make a plan to reach a saving goal.',
      learn: {
        show: { cap: 'goal $90, have $30, save $15 a week', eq: ['90 − 30 = 60', '60 ÷ 15 = 4 weeks'] },
        together: [WK(50, 10, 8)],
        cue: 'Take away what you have. Divide by what you save each week.',
        own: [WK(120, 40, 20), WK(75, 15, 12)]
      },
      p1: {
        show: { cap: 'if it does not divide evenly, round up', eq: ['50 ÷ 15 ≈ 3.3, so 4 weeks'] },
        items: [WK(60, 20, 10), WK(100, 25, 15), WK(45, 0, 9), WK(200, 80, 30)]
      },
      p2: {
        items: [WK(150, 30, 24), WK(320, 50, 45),
          story('{a} needs $84 in 6 weeks and has $0. How much each week?', '$', 14, '84 ÷ 6'),
          story('{b} saves $7 a week for 9 weeks. How much in all?', '$', 63, '7 × 9')]
      },
      p3: {
        items: [WK(500, 140, 40),
          story('{a} earns $12 a week and saves $6 of it. How many weeks to save $96?', 'weeks', 16, '96 ÷ 6'),
          { q: 'Goal $70. Save $15 a week. How many weeks? Explain the rounding.', lines: { n: 2, key: '70 ÷ 15 is 4.67, so 5 weeks: 4 weeks is only $60.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} has $20 and needs $80. {b} saves $10 a week and says 8 weeks. What went wrong?', lines: { n: 3, key: '{b} forgot the $20. 80 − 20 = 60, and 60 ÷ 10 = 6 weeks.' } },
          { q: 'Make a plan to save for something you want. Show the steps.', lines: { n: 3, key: 'For example: $45 game, have $5, save $8 a week: 40 ÷ 8 = 5 weeks.' } },
          WK(90, 18, 12)]
      }
    },

    helps: {
      watch: 'buying on impulse. Waiting a day before a want helps you stick to the goal.',
      goal: 'I can tell what helps a goal and what gets in the way.',
      learn: {
        show: { cap: 'helps: a budget, saving first. Gets in the way: impulse buys, surprise costs.', eq: ['$15 − $5 = $10 a week'] },
        together: [story('{a} saves $15 a week for a $90 jacket, but spends $5 of it on snacks. How many weeks now?', 'weeks', 9, '90 ÷ (15 − 5)')],
        cue: 'Needs before wants. Save first, then spend.',
        own: [story('{b} saves $20 a week for $100, then has a $20 surprise cost. How many weeks now?', 'weeks', 6, '(100 + 20) ÷ 20'),
          { q: 'Name one thing that helps you save.', lines: { n: 1, key: 'For example: a budget, saving first, or comparing prices.' } }]
      },
      p1: {
        show: { cap: 'wait a day before you buy a want', eq: ['needs before wants'] },
        items: [story('{a} saves $12 a week for a $60 game. How many weeks?', 'weeks', 5, '60 ÷ 12'),
          story('{a} saves $12 a week but spends $2 of it. How many weeks for $60?', 'weeks', 6, '60 ÷ (12 − 2)'),
          { q: 'Name two things that get in the way of saving.', lines: { n: 2, key: 'For example: impulse buys, peer pressure, surprise costs.' } }]
      },
      p2: {
        items: [story('A $40 surprise bill takes from {b}\'s $150 savings. How much is left?', '$', 110, '150 − 40'),
          story('{a} compares prices and saves $3 on each of 4 items. How much saved?', '$', 12, '3 × 4'),
          { q: 'Your friends all buy a new $70 jacket. You do not need one. What could you do?', lines: { n: 3, key: 'Keep to the plan: wait, think if it is a need, and keep saving for the goal.' } }]
      },
      p3: {
        items: [story('{b} earns $25 a week. Needs cost $10 and {b} saves $8. How much is left for wants?', '$', 7, '25 − 10 − 8'),
          { q: 'Sort: food, a new game, a winter coat, a treat. Needs first.', lines: { n: 2, key: 'Needs: food, a winter coat. Wants: a new game, a treat.' }, wide: true },
          { q: 'Why is it smart to keep some savings for surprises?', lines: { n: 2, key: 'Surprise costs will not stop your goal, and you will not need to borrow.' } }]
      },
      think: {
        items: [{ q: '{b} keeps buying small snacks and cannot save. What would you suggest?', lines: { n: 3, key: 'Track spending, save first each week, and bring snacks from home.' } },
          { q: 'How can a budget help you reach a goal?', lines: { n: 2, key: 'It shows where money goes, so you can plan what to save.' } },
          story('{a} saves $9 a week and spends $3 of it. How many weeks to save $54?', 'weeks', 9, '54 ÷ (9 − 3)')]
      }
    },

    simple: {
      watch: 'adding the rate instead of the interest. 3% of $500 is $15, not $3.',
      goal: 'I can find simple interest.',
      learn: {
        show: { cap: '$500 at 3% a year for 2 years', eq: ['500 × 3% × 2 = 30', 'total $530'] },
        together: [SI(200, 5, 1)],
        cue: 'Amount × rate × years. Add it on for the total.',
        own: [SI(400, 2, 3), ONE(1000, 4)]
      },
      p1: {
        show: { eq: ['1% of 300 = 3, so 2% = 6'] },
        items: [ONE(100, 3), ONE(600, 2), ONE(250, 4), ONE(800, 5), SI(300, 2, 2), SI(1000, 3, 1)]
      },
      p2: {
        items: [SI(500, 4, 3), SI(2000, 2, 5), ONE(150, 6),
          story('{a} borrows $400 at 5% a year for 2 years. How much interest?', '$', 40, '400 × 5% × 2')]
      },
      p3: {
        items: [SI(1500, 3, 4),
          story('Which earns more: $600 at 3% for 2 years, or $600 at 2% for 3 years? Interest of the first:', '$', 36, '600 × 3% × 2'),
          story('$800 at 2.5% for 1 year. How much interest?', '$', 20, '800 × 2.5%'),
          { q: 'When does the bank pay you interest? When do you pay it?', lines: { n: 2, key: 'The bank pays you on savings. You pay when you borrow or use credit.' } }]
      },
      think: {
        items: [{ q: '{b} says 3% of $500 is $3. What went wrong?', lines: { n: 3, key: '3% means 3 for every 100. $500 has 5 hundreds: 5 × 3 = $15.' } },
          { q: 'Why does saving early help?', lines: { n: 2, key: 'Money saved for longer earns more interest.' } },
          SI(250, 4, 2)]
      }
    },

    fees: {
      watch: 'choosing the lowest monthly fee. Count every fee for how you use it.',
      goal: 'I can compare bank fees and choose a plan.',
      learn: {
        show: { cap: '$4 a month + $0.50 for each of 10 transactions', eq: ['4.00 + 10 × 0.50 = $9.00'] },
        together: [PC(12, 3, 0.75)],
        cue: 'Monthly fee + each fee × how many. Then compare.',
        own: [PC(20, 5, 0.25), PL(8, [2, 1], 9)]
      },
      p1: {
        show: { eq: ['few transactions: a pay-each plan', 'many: a flat plan'] },
        items: [PC(6, 2, 1), PC(15, 4, 0.5), PL(4, [3, 1], 10), PL(25, [3, 0.5], 12)]
      },
      p2: {
        items: [PC(30, 1, 0.25), PL(16, [4, 0.5], 10),
          story('An ATM fee is $2.50. {a} uses it 6 times a month. Fees?', '$', 15, '2.50 × 6'),
          story('A late fee is $35. {b} pays late 2 times in a year. Fees?', '$', 70, '35 × 2')]
      },
      p3: {
        items: [PL(15, [5, 0.4], 12), PL(40, [6, 0.25], 15),
          { q: 'How could {a} pay fewer bank fees?', lines: { n: 2, key: 'Choose the plan that fits how often {a} uses it, avoid other banks\' ATMs, and pay on time.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} picked Plan A because its monthly fee is lowest. Why might that be a mistake?', lines: { n: 3, key: 'With many transactions, the fee for each one can add up to more than a flat plan.' } },
          { q: 'Name three kinds of bank fees.', lines: { n: 2, key: 'A monthly fee, a transaction fee, an ATM fee, a late fee.' } },
          PL(5, [2, 0.8], 8)]
      }
    },

    ways: {
      watch: 'mixing up lending and borrowing. You lend what is yours; you borrow what is someone else\'s.',
      goal: 'I can tell trading, lending, borrowing and donating apart.',
      learn: {
        show: { cap: 'trade: a swap. Lend: mine, it comes back. Borrow: theirs, I give it back. Donate: nothing comes back.' },
        together: [DS('{a} swaps a hockey card for {b}\'s comic.', { swap: true }), DS('{b} lets {a} use a tent and gets it back next week.', { give: true, back: true })],
        cue: 'What moves? Does it come back?',
        own: [DS('{a} uses {b}\'s skates and returns them Sunday.', { get: true, back: true }), DS('{b} gives winter coats to a shelter.', { give: true })]
      },
      p1: {
        show: { eq: ['a library book: borrowed'] },
        items: [DS('{a} gives $10 to a food bank.', { give: true }), DS('{b} borrows a bike from a neighbour for the weekend.', { get: true, back: true }),
          DS('{a} lets a friend use a calculator for the test.', { give: true, back: true }), DS('Two friends swap books they have read.', { swap: true })]
      },
      p2: {
        items: [DS('A community shares a snowblower: {a} uses it and brings it back.', { get: true, back: true }),
          DS('{b} trades 3 hours of yard work for a used bike.', { swap: true }),
          story('{a} lends {b} $20. {b} pays back $5 a week. How many weeks?', 'weeks', 4, '20 ÷ 5'),
          { q: 'Give one good point and one risk of lending money to a friend.', lines: { n: 2, key: 'Good: you help a friend. Risk: you might not get it back, and it can hurt the friendship.' } }]
      },
      p3: {
        items: [DS('A family gives food to a community fridge.', { give: true }),
          story('A tool library lends a drill for $2 a day. {a} keeps it 3 days. Cost?', '$', 6, '2 × 3'),
          { q: 'Many First Nations communities share food from a hunt. Which way of sharing is that? Why does it help?', lines: { n: 3, key: 'Donating or sharing: everyone gets food, and the community looks after each other.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says borrowing and lending are the same. Explain the difference.', lines: { n: 3, key: 'Lending: you give your thing and get it back. Borrowing: you use someone else\'s and give it back.' } },
          { q: 'Why might a town share tools instead of each family buying them?', lines: { n: 3, key: 'It saves money and space, and tools that are rarely used get used more.' } },
          DS('{a} lets {b} use a sled and gets it back.', { give: true, back: true })]
      }
    }
  } });
})();
