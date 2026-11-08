/* Grade 4 Money: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/money.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: F1.1 ways to pay; F1.2 totals of whole-dollar prices and change by counting up, with mental math;
   F1.3 earning, spending, saving, investing and donating, and needs and wants; F1.4 saving for a goal; F1.5 good
   value. The answer checks are in tests/verify/sheets.js: sums and stories are worked out, an estimate rounds each
   price first (est), a way to pay comes from how the money moves (pick.pay), a money choice from where the money goes
   (pick.con), a need or a want from a fixed list (pick.need), weeks to a goal round up (rem), and the better buy from
   the price for one or the full cost (pick.less). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function story(q, ans, calc, unit) { return { q: q, eq: [unit ? '[] ' + unit : '$ []'], a: [ans], calc: calc }; }
  /* a way to pay, from how the money moves */
  var WAYS = ['cash', 'debit', 'credit', 'e-transfer'], GIFT = ['cash', 'debit', 'gift card', 'credit'];
  function PW(q, how) {
    var way = how.cash ? 'cash' : how.gift ? 'gift card' : how.from === 'own' ? 'debit' : how.from === 'bank' ? 'credit' : 'e-transfer', opts = how.gift ? GIFT : WAYS;
    return { q: q, pick: { opts: opts, ans: opts.indexOf(way), pay: how } };
  }
  /* add whole-dollar prices; estimate first by rounding each to the nearest $10 */
  function TOT(p) { return { eq: [p.map(function (v) { return '$' + v; }).join(' + ') + ' = $ []'], a: [p.reduce(function (s, v) { return s + v; }, 0)] }; }
  function EST(x, y) { return { q: 'Estimate: $' + x + ' + $' + y + '.', eq: [x + ' + ' + y + ' is about []'], a: [Math.round(x / 10) * 10 + Math.round(y / 10) * 10], est: 10 }; }
  /* is there enough money? */
  function OK(have, p) { var t = p.reduce(function (s, v) { return s + v; }, 0); return { q: 'You have $' + have + '. Can you buy ' + p.map(function (v) { return '$' + v; }).join(' and ') + '?', eq: [p.join(' + ') + ' = []'], a: [t], pick: { opts: ['yes', 'no'], ans: t <= have ? 0 : 1 }, pickLast: true, tf: p.join(' + ') + ' < ' + (have + 1) }; }
  /* change: take away, or count up to the next ten and then to what was paid */
  function CH(cost, paid) { return { q: 'Cost $' + cost + '. Paid $' + paid + '.', eq: [paid + ' − ' + cost + ' = $ []'], a: [paid - cost] }; }
  function CU(cost, paid) { var mid = Math.ceil((cost + 1) / 10) * 10; return { q: 'Count up from $' + cost + ' to $' + paid + '.', eq: [cost + ' + [] = ' + mid, mid + ' + [] = ' + paid, '[] + [] = $ []'], a: [mid - cost, paid - mid, mid - cost, paid - mid, paid - cost] }; }
  /* where money goes: earn, spend, save, invest, donate */
  function CON(q, how, opts) {
    var it = how.in ? 'earn' : how.buy ? 'spend' : how.keep ? 'save' : how.grow ? 'invest' : 'donate';
    opts = opts || ['earn', 'spend', 'save', 'invest', 'donate'];
    return { q: q, pick: { opts: opts, ans: opts.indexOf(it), con: how } };
  }
  /* a need or a want */
  function NW(thing) { var NEED = ['a winter coat', 'boots for snow', 'food for dinner', 'medicine', 'a toothbrush', 'bus fare to school', 'mittens', 'milk', 'glasses to see the board'];
    return { q: cap(thing), pick: { opts: ['need', 'want'], ans: NEED.indexOf(thing) >= 0 ? 0 : 1, need: thing } }; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) + '.'; }
  /* weeks to save for a goal: a remainder needs one more week */
  function GL(goal, per) { return { q: 'Goal $' + goal + '. Save $' + per + ' a week. How many weeks?', eq: [goal + ' ÷ ' + per + ' = [] R []', '[] weeks'], a: [Math.floor(goal / per), goal % per, Math.ceil(goal / per)], rem: 'up' }; }
  /* the better buy: the price for one, or the cost with shipping */
  function BB(a, b, what) { return { q: 'Better buy: ' + a[0] + ' ' + what + ' for $' + a[1] + ' or ' + b[0] + ' ' + what + ' for $' + b[1] + '?', pick: { opts: [a[0] + ' for $' + a[1], b[0] + ' for $' + b[1]], ans: a[1] / a[0] < b[1] / b[0] ? 0 : 1, less: [a[1] + ' / ' + a[0], b[1] + ' / ' + b[0]] } }; }
  function SH(a, b, ship) { return { q: 'Store A: $' + a + ', free shipping. Store B: $' + b + ' plus $' + ship + ' shipping. Which costs less?', pick: { opts: ['Store A', 'Store B'], ans: a < b + ship ? 0 : 1, less: [String(a), b + ' + ' + ship] } }; }
  function UR(n, price, what) { return story(n + ' ' + what + ' cost $' + price + '. What is the price for one?', price / n, price + ' ÷ ' + n); }

  S.register('money', { code: 'MO', ideas: {

    ways: {
      watch: 'thinking a card or a phone tap is free money. Every way to pay spends real money, now or later.',
      goal: 'I can tell how money moves when I pay.',
      learn: {
        show: { cap: 'Ask: whose money, and when?', eq: ['debit: mine, now', 'credit: pay back later'] },
        together: [PW('{a} pays with a $10 bill.', { cash: true }), PW('Money leaves {b}\'s own bank account right away.', { from: 'own' })],
        cue: 'Whose money moves, and when?',
        own: [PW('The bank pays the store now. {a} pays the bank back next month.', { from: 'bank' }), PW('{a} pays with a card that only works at one store.', { gift: true })]
      },
      p1: {
        items: [PW('{a} pays with two toonies and a loonie.', { cash: true }), PW('{b} taps a card, and $6 leaves {b}\'s account at once.', { from: 'own' }),
          PW('{a} borrows from the bank with a card and pays it back later.', { from: 'bank' }), PW('A neighbour pays {b} for raking leaves by sending money to {b}\'s account.', { accounts: true }),
          PW('{b} got a card from a birthday that can be spent only at the bookstore.', { gift: true }), PW('{a} hands over a $20 bill.', { cash: true })]
      },
      p2: {
        items: [story('{a} has $40 in the bank and pays $25 by debit. How much is left?', 15, '40 − 25'),
          story('{b} has a $30 gift card and buys a $12 book. How much is left on the card?', 18, '30 − 12'),
          story('{a} buys a $45 jacket on credit and pays back $15 a month. How many months?', 3, '45 ÷ 15', 'months'),
          story('Grandpa sends {b} $20 by e-transfer. {b} had $35. How much now?', 55, '35 + 20'),
          PW('{b} pays for skates now and pays the card bill next month.', { from: 'bank' }), PW('{a} pays for lunch with money from {a}\'s own account.', { from: 'own' })]
      },
      p3: {
        items: [story('{b} had $60 in the bank. Then {b} paid $14 and $22 by debit. How much is left?', 24, '60 − 14 − 22'),
          story('{a} earns $8 a week, paid into the bank. After 4 weeks {a} pays $19 by debit. How much is left?', 13, '8 × 4 − 19'),
          story('{b} has a $25 gift card. {b} buys 3 snacks at $4 each. How much is left on the card?', 13, '25 − 3 × 4'),
          PW('{a}\'s pay goes straight into {a}\'s bank account from work.', { accounts: true })]
      },
      think: {
        items: [{ q: '{b} says tapping a card is free because no cash is used. What is wrong?', lines: { n: 3, key: 'The money is real: debit takes it from your account now, and credit must be paid back.' } },
          { q: 'How are debit and credit different?', lines: { n: 3, key: 'Debit spends your own money right away. Credit borrows money that you pay back later.' } },
          { q: 'Why might someone pay with cash at a market?', lines: { n: 2, key: 'For example: a small stand may not take cards, and cash helps you see what you spend.' } }]
      }
    },

    totals: {
      watch: 'adding without checking. Estimate first by rounding each price to the nearest $10; the total should be close.',
      goal: 'I can find the total cost.',
      learn: {
        show: { cap: 'Round each price to the nearest $10 first', eq: ['$38 + $47 is about $90'] },
        together: [EST(38, 47), TOT([38, 47])],
        cue: 'Estimate first. Then add. Is the total close?',
        own: [EST(23, 58), TOT([23, 58]), TOT([14, 9, 6])]
      },
      p1: {
        items: [TOT([12, 9]), TOT([25, 17]), TOT([8, 15, 6]), TOT([34, 28]), EST(42, 19), EST(66, 27)]
      },
      p2: {
        items: [story('3 books at $7 each and a $5 bookmark. Total?', 26, '3 × 7 + 5'),
          story('A $29 helmet and 2 water bottles at $6 each. Total?', 41, '29 + 2 × 6'),
          story('4 movie tickets at $12 each. Total?', 48, '4 × 12'),
          TOT([45, 18, 9]), TOT([56, 27, 14]), EST(71, 18)]
      },
      p3: {
        items: [OK(50, [28, 19]), OK(40, [26, 17]), OK(100, [48, 39, 15]),
          story('{a} buys 2 shirts at $15 each and pants for $32. Total?', 62, '2 × 15 + 32')]
      },
      think: {
        items: [{ q: '{b} adds $38 and $47 and gets $715. How could an estimate help?', lines: { n: 3, key: '$40 + $50 is about $90, so $715 is far off. The total is $85.' } },
          { q: 'You have $30. Name three things you could buy with prices that add to $30 or less.', lines: { n: 3, key: 'For example: $12 + $10 + $7 = $29.' } },
          EST(55, 34)]
      }
    },

    change: {
      watch: 'subtracting with mistakes when making change. Count up from the price: to the next ten, then to what was paid.',
      goal: 'I can count up to find the change.',
      learn: {
        show: { cap: 'Cost $26. Paid $50. Count up', eq: ['26 + 4 = 30', '30 + 20 = 50', 'change: $24'] },
        together: [CU(26, 50), CH(13, 20)],
        cue: 'Count up to the next ten, then to what was paid. Add the jumps.',
        own: [CU(37, 50), CH(8, 20)]
      },
      p1: {
        items: [CH(14, 20), CH(6, 10), CH(31, 50), CU(17, 50), CU(43, 100), CU(64, 100)]
      },
      p2: {
        items: [story('A $17 kite. {a} pays with a $20 bill. What is the change?', 3, '20 − 17'),
          story('A $56 game. {b} pays with a $100 bill. What is the change?', 44, '100 − 56'),
          { q: 'A $12 hat and $15 mitts. Paid $50.', eq: ['12 + 15 = []', '50 − [] = $ []'], a: [27, 27, 23] },
          CU(28, 50), CU(72, 100), CH(39, 50)]
      },
      p3: {
        items: [story('{a} got $6 change from $20. What did it cost?', 14, '20 − 6'),
          { q: '{b} paid $50 for a $32 coat and got $28 back. Is that right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '50 − 32 = 28' },
          { q: 'Three snacks at $4 each. Paid $20.', eq: ['3 × 4 = []', '20 − [] = $ []'], a: [12, 12, 8] },
          CU(85, 100)]
      },
      think: {
        items: [{ q: 'Why does counting up from the price work for change?', lines: { n: 3, key: 'Change is how far the price is from what you paid; counting up finds that gap.' } },
          { q: '{a} paid $20 for a $13 book and got $8 back. What should {a} say?', lines: { n: 2, key: 'The change should be $7 (13 + 7 = 20), so $1 too much was given.' } },
          CU(47, 100)]
      }
    },

    'five-ways': {
      watch: 'mixing up saving and investing. Saving keeps money safe for later; investing uses money so it might grow, with some risk.',
      goal: 'I can tell earning, spending, saving, investing and donating apart.',
      learn: {
        show: { cap: 'Earning brings money in. Spending, saving, investing and donating use it.', eq: ['in: earn'] },
        together: [CON('{a} is paid $10 for walking a dog.', { in: true }), CON('{b} buys a sandwich.', { buy: true })],
        cue: 'Comes in, bought, kept for later, put to grow, or given?',
        own: [CON('{a} puts $5 in a jar for a bike.', { keep: true }), CON('{b} gives $3 to the food bank.', { give: true }),
          CON('{a}\'s family buys part of a company, hoping it grows.', { grow: true }), story('{b} earns $30. {b} saves $10 and donates $5. How much is left to spend?', 15, '30 − 10 − 5')]
      },
      p1: {
        items: [CON('{b} sells lemonade and takes in $12.', { in: true }), CON('{a} pays for a movie ticket.', { buy: true }), CON('{b} keeps $20 in a bank account for next summer.', { keep: true }),
          CON('{a} gives $5 to an animal shelter.', { give: true }), CON('{b} puts money in an account that pays interest so it can grow.', { grow: true }), CON('{a} gets $15 for shovelling snow.', { in: true })]
      },
      p2: {
        items: [story('{a} earns $8 a day for 5 days. How much is earned?', 40, '8 × 5'),
          story('{b} earns $25 a week for 3 weeks. How much is earned?', 75, '25 × 3'),
          story('{a} has $50. {a} spends $18 and donates $7. How much is kept?', 25, '50 − 18 − 7'),
          story('{b} saves $6 a week for 8 weeks. How much is saved?', 48, '6 × 8'),
          CON('{a} drops coins in a donation box for the hospital.', { give: true }), CON('{b} buys a pair of skates.', { buy: true })]
      },
      p3: {
        items: [story('{a} earns $60. {a} saves $20, invests $10 and donates $5. How much is left to spend?', 25, '60 − 20 − 10 − 5'),
          story('{b} gets $12 a week. {b} saves $4 each week. How much is saved in 6 weeks?', 24, '4 × 6'),
          CON('{a} puts $100 into a fund that may go up or down.', { grow: true }), CON('{b} keeps birthday money in a piggy bank.', { keep: true })]
      },
      think: {
        items: [{ q: 'How are saving and investing different?', lines: { n: 3, key: 'Saving keeps money safe for later. Investing puts money where it might grow, but it could also go down.' } },
          { q: 'Why might someone donate money?', lines: { n: 2, key: 'For example: to help people, animals or the community.' } },
          { q: 'You earn $20. Make a plan to spend, save and donate. Show that it adds to $20.', lines: { n: 3, key: 'For example: spend $10, save $8, donate $2: 10 + 8 + 2 = 20.' } }]
      }
    },

    goal: {
      watch: 'leaving out the last week when there is a remainder. The leftover dollars still need one more week.',
      goal: 'I can work out how long it takes to save for a goal.',
      learn: {
        show: { cap: '$20 goal, $6 a week: 3 weeks makes $18, still $2 short', eq: ['20 ÷ 6 = 3 R 2: 4 weeks'] },
        together: [GL(20, 6), story('Goal $24. Save $4 a week. How many weeks?', 6, '24 ÷ 4', 'weeks')],
        cue: 'Divide. A remainder means one more week.',
        own: [GL(30, 7), story('Save $5 a week for 9 weeks. How much in all?', 45, '5 × 9')]
      },
      p1: {
        items: [story('Goal $36. Save $9 a week. How many weeks?', 4, '36 ÷ 9', 'weeks'), story('Goal $40. Save $8 a week. How many weeks?', 5, '40 ÷ 8', 'weeks'),
          GL(25, 4), GL(50, 8), story('Save $6 a week for 7 weeks. How much in all?', 42, '6 × 7'), story('Save $3 a week for 10 weeks. How much in all?', 30, '3 × 10')]
      },
      p2: {
        items: [GL(45, 7), GL(60, 9), story('{a} wants a $45 game and has $9. {a} saves $6 a week. How many weeks?', 6, '(45 − 9) ÷ 6', 'weeks'),
          story('{b} wants $80 skates and has $20. {b} saves $10 a week. How many weeks?', 6, '(80 − 20) ÷ 10', 'weeks'),
          GL(35, 4), GL(52, 10)]
      },
      p3: {
        items: [GL(75, 8), story('{a} saves $7 a week. After how many weeks will {a} have $56?', 8, '56 ÷ 7', 'weeks'),
          story('{b} needs $90 in 6 weeks. How much must {b} save each week?', 15, '90 ÷ 6'),
          { q: '{a} needs $50 and saves $8 a week. {a} says 6 weeks is enough. Is that right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '6 × 8 > 49' }]
      },
      think: {
        items: [{ q: '{b} works out 20 ÷ 6 = 3 R 2 and says 3 weeks. What would you tell {b}?', lines: { n: 3, key: 'After 3 weeks {b} has $18, still $2 short. It takes 4 weeks.' } },
          { q: 'How could {a} reach a goal sooner?', lines: { n: 2, key: 'Save more each week, or earn extra money.' } },
          { q: 'Pick a goal under $50. Plan how much to save each week, and how many weeks.', lines: { n: 3, key: 'For example: $42 goal, $7 a week, 6 weeks.' } }]
      }
    },

    needs: {
      watch: 'calling something a need because you really want it. Ask: could I be safe and healthy without it?',
      goal: 'I can tell needs from wants.',
      learn: {
        show: { cap: 'Needs first, then wants', eq: ['need: must have', 'want: nice to have'] },
        together: [NW('a winter coat'), NW('a video game')],
        cue: 'Could you be safe and healthy without it?',
        own: [NW('medicine'), NW('candy'), NW('boots for snow'), NW('a new phone case')]
      },
      p1: {
        items: [NW('food for dinner'), NW('a movie ticket'), NW('a toothbrush'), NW('stickers'), NW('mittens'), NW('a toy car')]
      },
      p2: {
        items: [story('{a} has $30. Boots cost $22 (a need). How much is left for wants?', 8, '30 − 22'),
          story('{b} has $40. A coat costs $35 and a game costs $15. After the need, how much is left?', 5, '40 − 35'),
          NW('bus fare to school'), NW('a concert ticket'), NW('milk'), NW('a second hockey stick')]
      },
      p3: {
        items: [story('{a} gets $25. Needs: $8 lunch and $6 bus fare. How much is left for wants?', 11, '25 − 8 − 6'),
          { q: '{b} has $20. Needs cost $12. Can {b} also buy a $10 want?', eq: ['12 + 10 = []'], a: [22], pick: { opts: ['yes', 'no'], ans: 1 }, pickLast: true, tf: '12 + 10 < 21' },
          NW('glasses to see the board'), NW('a fancy water bottle')]
      },
      think: {
        items: [{ q: 'Can something be a need for one person and a want for another? Give an example.', lines: { n: 3, key: 'Yes. For example: a bike may be a need to get to work, but a want for fun.' } },
          { q: 'Why pay for needs first?', lines: { n: 2, key: 'Needs keep you safe and healthy. Wants can wait.' } },
          { q: 'List two needs and two wants for a winter day.', lines: { n: 3, key: 'For example: needs: a warm coat, food; wants: hot chocolate, a sled.' } }]
      }
    },

    value: {
      watch: 'choosing the lowest price on the tag. Compare the price for one, and add costs like shipping.',
      goal: 'I can find the better buy.',
      learn: {
        show: { cap: '3 for $6 is $2 each; 2 for $5 is more each', eq: ['6 ÷ 3 = 2'] },
        together: [UR(3, 6, 'juice boxes'), BB([3, 6], [2, 5], 'pens')],
        cue: 'Find the price for one. Add any extra costs.',
        own: [UR(4, 12, 'muffins'), SH(24, 19, 7)]
      },
      p1: {
        items: [UR(2, 8, 'notebooks'), UR(5, 10, 'pencils'), UR(4, 20, 'tickets'), BB([2, 6], [4, 10], 'apples'), BB([5, 15], [3, 12], 'markers'), SH(30, 26, 6)]
      },
      p2: {
        items: [BB([6, 18], [4, 16], 'bagels'), BB([10, 20], [3, 9], 'stickers'), SH(45, 40, 3), SH(18, 12, 8),
          story('Shoes cost $40 plus $9 shipping. What is the full cost?', 49, '40 + 9'),
          story('A pack of 6 granola bars is $12. What is the price for one?', 2, '12 ÷ 6')]
      },
      p3: {
        items: [BB([8, 24], [5, 20], 'cans of soup'), SH(60, 52, 10),
          story('{a} needs 12 batteries. A pack of 4 costs $6. How much for 12?', 18, '12 ÷ 4 × 6'),
          story('A $20 ball lasts 2 years. A $8 ball lasts 1 year. Over 2 years, how much does the $8 ball cost?', 16, '8 × 2')]
      },
      think: {
        items: [{ q: 'Why is the lowest price not always the best buy?', lines: { n: 3, key: 'Shipping can add cost, a pack may hold fewer, and something cheap may break sooner.' } },
          { q: '{b} buys 10 erasers for $5 but needs only 2. Was it a good buy?', lines: { n: 3, key: 'Maybe not: {b} spent $5 on things {b} does not need. Buying 2 might cost less.' } },
          BB([4, 10], [6, 12], 'yogurts')]
      }
    }
  } });
})();
