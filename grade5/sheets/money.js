/* Grade 5 Money and Finances: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/money.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: F1.1 ways money moves (cash, debit, credit, transfers); F1.2 totals with 13% HST, cash rounding and
   change; F1.3 a balanced budget; F1.4 interest and debt; F1.5 unit rates and the better buy; F1.6 taxes and the three
   levels of government. The answer checks are in tests/verify/sheets.js: sums with dollars and percents are worked
   out (20.00 × 13% = 2.60), a cash total must round to the nearest 5 cents, a way to pay comes from how the money
   moves (pick.pay), a level of government from the service (pick.gov), and the better buy from the price for one. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* money as it is written: two decimal places */
  function M(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  var WAYS = ['cash', 'debit', 'credit', 'e-transfer'], LEVELS = ['federal', 'provincial', 'municipal'];
  function PW(q, how) { var way = how.cash ? 'cash' : how.from === 'own' ? 'debit' : how.from === 'bank' ? 'credit' : 'e-transfer'; return { q: q, pick: { opts: WAYS, ans: WAYS.indexOf(way), pay: how } }; }
  /* debit: what is left in the account */
  function DB(have, spend) { return { q: 'You have $' + M(have) + ' in your account. You pay $' + M(spend) + ' by debit. How much is left?', eq: ['$ []'], a: [M(have - spend)], calc: M(have) + ' − ' + M(spend) }; }
  /* 13% HST on a whole-dollar subtotal, then the total */
  function HT(p) { return { eq: [M(p) + ' × 13% = []', M(p) + ' + [] = []'], a: [M(p * 0.13), M(p * 0.13), M(p * 1.13)] }; }
  /* 13% as 10% and 3% */
  function TT(p) { return { q: '13% of $' + M(p) + ':', eq: [M(p) + ' × 10% = []', M(p) + ' × 3% = []', '[] + [] = []'], a: [M(p * 0.1), M(p * 0.03), M(p * 0.1), M(p * 0.03), M(p * 0.13)] }; }
  /* a cash total rounded to the nearest 5 cents */
  function RC(v) { return { eq: ['$' + M(v) + ' rounds to []'], a: [M(Math.round(v / 0.05) * 0.05)], round: 0.05 }; }
  /* round the cash total first, then the change */
  function RP(v, paid) { var r = M(Math.round(v / 0.05) * 0.05); return { q: 'Cash total $' + M(v) + '. Paid with $' + paid + '.', eq: ['$' + M(v) + ' rounds to []', M(paid) + ' − [] = []'], a: [r, r, M(paid - r)], round: 0.05 }; }
  /* change: count up from the cost to the money paid */
  function CH(cost, paid) { return { q: 'Cost $' + M(cost) + '. Paid $' + M(paid) + '.', eq: [M(paid) + ' − ' + M(cost) + ' = []'], a: [M(paid - cost)] }; }
  function CU(cost, mid, paid) { return { q: 'Count up from $' + M(cost) + ' to $' + M(paid) + '.', eq: [M(cost) + ' + [] = ' + M(mid), M(mid) + ' + [] = ' + M(paid)], a: [M(mid - cost), M(paid - mid)] }; }
  /* a budget: what is left for wants; is it balanced? */
  function BW(inc, save, needs) { return { q: 'Income $' + inc + '. Savings $' + save + '. Needs $' + needs + '. Wants?', eq: [inc + ' − ' + save + ' − ' + needs + ' = []'], a: [inc - save - needs] }; }
  function BAL(inc, save, needs, wants) { var ok = save + needs + wants === inc; return { q: 'Income $' + inc + ': savings $' + save + ', needs $' + needs + ', wants $' + wants + '. Balanced?', eq: [save + ' + ' + needs + ' + ' + wants + ' ? ' + inc], pick: { opts: ['yes', 'no'], ans: ok ? 0 : 1 }, pickLast: true, tf: save + ' + ' + needs + ' + ' + wants + ' = ' + inc }; }
  /* interest for one month, then what is owed */
  function IN(p, r) { return { q: 'Owe $' + p + '. Interest ' + r + '% a month.', eq: [p + ' × ' + r + '% = []', p + ' + [] = []'], a: [p * r / 100, p * r / 100, p + p * r / 100] }; }
  /* the price for one */
  function UR(price, n, what) { return { q: n + ' ' + what + ' for $' + M(price) + '. Price for one?', eq: [M(price) + ' ÷ ' + n + ' = []'], a: [M(price / n)] }; }
  function BB(a, b, what) {
    var ua = a[1] / a[0], ub = b[1] / b[0], u = what.length < 3 ? ' ' + what : '';
    return { q: 'Better buy: ' + a[0] + ' ' + what + ' for $' + M(a[1]) + ' or ' + b[0] + ' ' + what + ' for $' + M(b[1]) + '?', pick: { opts: [a[0] + u + ' for $' + M(a[1]), b[0] + u + ' for $' + M(b[1])], ans: ua < ub ? 0 : 1, less: [M(a[1]) + ' / ' + a[0], M(b[1]) + ' / ' + b[0]] }, wide: true };
  }
  function GV(service) {
    var L = { passports: 0, 'the armed forces': 0, 'national parks': 0, 'coins and bills': 0, 'mail delivery': 0, hospitals: 1, schools: 1, highways: 1, "driver's licences": 1, 'health cards': 1 };
    return { q: 'Who runs ' + service + '?', pick: { opts: LEVELS, ans: L[service] != null ? L[service] : 2, gov: service } };
  }
  function story(q, unit, ans, calc) { return { q: q, eq: [unit === '$' ? '$ []' : '[] ' + unit], a: [ans], calc: calc }; }

  S.register('money', { code: 'MO', ideas: {
    pay: {
      watch: 'thinking a card or phone payment is free because no cash changes hands. Every way spends real money.',
      goal: 'I can tell how money moves when I pay.',
      learn: {
        show: { eq: ['debit: mine, now', 'credit: pay back later'] },
        together: [PW('{a} hands over a $10 bill.', { cash: true }), DB(50, 30)],
        cue: 'Whose money moves, and when?',
        own: [PW('The bank pays the store now. {b} pays the bank back next month.', { from: 'bank' }), DB(80, 25)]
      },
      p1: {
        items: [PW('Money leaves {b}\'s own account right away.', { from: 'own' }), PW('{a} sends $20 from one bank account to {b}\'s account by phone.', { accounts: true }),
          PW('{b} pays with a toonie and a quarter.', { cash: true }), PW('The bank pays now. {a} owes the bank later.', { from: 'bank' }),
          PW('{b} taps a card, and $6 leaves {b}\'s account at once.', { from: 'own' }), PW('A neighbour pays {a} for shovelling by sending money to {a}\'s account.', { accounts: true })]
      },
      p2: {
        items: [DB(45.5, 12.75), DB(120, 64.3), DB(18.25, 9.5),
          story('{b} buys a $30 jacket on credit and pays back $10. How much is still owed?', '$', 20, '30 − 10'),
          story('{a} has $75 in the bank and pays $28.40 by debit. How much is left?', '$', '46.60', '75 − 28.40'),
          story('A $60 bike helmet goes on a credit card. {b} pays $15 a month. How many months to pay it all?', 'months', 4, '60 ÷ 15')]
      },
      p3: {
        items: [story('{b} had $40 in the bank. Grandma sends $25 by e-transfer. {b} then spends $18 by debit. How much is left?', '$', 47, '40 + 25 − 18'),
          story('{a} earns $12 a week, paid into the bank. After 5 weeks {a} pays $35 by debit. How much is left?', '$', 25, '12 × 5 − 35'),
          PW('{b} gets paid by direct deposit: the money goes straight into the account.', { accounts: true }), PW('{a} buys a game now and will pay the card bill next month.', { from: 'bank' })]
      },
      think: {
        items: [{ q: '{b} says paying with a card is free because no cash is used. What is wrong?', lines: { n: 3, key: 'A card still spends real money: debit takes it from your account now, and credit must be paid back.' } },
          { q: 'How are debit and credit different?', lines: { n: 3, key: 'Debit spends your own money right away. Credit spends the bank\'s money, and you pay it back later, maybe with interest.' } },
          DB(100, 37.85)]
      }
    },

    hst: {
      watch: 'forgetting the tax and bringing only the shelf price. Subtotal + 13% HST = total.',
      goal: 'I can add 13% HST to a price.',
      learn: {
        show: { eq: ['20.00 × 13% = 2.60', '20.00 + 2.60 = 22.60'] },
        together: [HT(40)],
        cue: 'Find the tax, then add it on.',
        own: [HT(30)]
      },
      p1: {
        show: { eq: ['13% = 10% + 3%'] },
        items: [TT(20), TT(50), TT(10), TT(70)]
      },
      p2: {
        items: [HT(10), HT(60), HT(25), HT(80)]
      },
      p3: {
        items: [story('A $15 cap and a $25 shirt. What is the total with 13% HST?', '$', '45.20', '(15 + 25) + (15 + 25) × 13%'),
          story('Two $9 books and a $2 card. What is the total with 13% HST?', '$', '22.60', '(9 + 9 + 2) + (9 + 9 + 2) × 13%'),
          { q: 'About how much is 13% HST on $24.99?', pick: { opts: ['$0.25', '$3.25', '$13.00'], ans: 1, est: '24.99 × 13%' }, wide: true },
          story('{b} has $50. Shoes cost $44 before 13% HST. How much is left after paying?', '$', '0.28', '50 − (44 + 44 × 13%)')]
      },
      think: {
        items: [{ q: '{b} brings exactly $20 for a $20 game. What will go wrong?', lines: { n: 3, key: 'The HST adds 13%: $2.60. The total is $22.60, so $20 is not enough.' } },
          { q: 'How can you find 13% of $40 in your head?', lines: { n: 3, key: '10% is $4.00 and 3% is $1.20, so 13% is $5.20.' } },
          HT(90)]
      }
    },

    cash: {
      watch: 'rounding a card total (only cash rounds), or slips when finding change. Count up from the price.',
      goal: 'I can round a cash total and count up the change.',
      learn: {
        show: { eq: ['$4.97 rounds to $4.95', '$4.95 + $0.05 = $5.00', '$5.00 + $5.00 = $10.00'] },
        together: [RC(3.42), CU(3.40, 4.00, 5.00)],
        cue: 'Round to the nearest 5 cents. Then count up.',
        own: [RC(7.38), CU(7.40, 8.00, 10.00)]
      },
      p1: {
        show: { eq: ['ends in 1, 2, 6, 7: down', 'ends in 3, 4, 8, 9: up'] },
        items: [RC(2.31), RC(5.68), RC(9.04), RC(1.97), RC(6.43), RC(8.12)]
      },
      p2: {
        items: [CH(4.95, 10), CH(3.40, 5), CH(12.85, 20), CH(7.15, 10), CU(6.65, 7.00, 10.00), CU(13.20, 14.00, 20.00)]
      },
      p3: {
        items: [RP(8.67, 10), RP(14.92, 20),
          RC(19.99), RC(0.62)]
      },
      think: {
        items: [{ q: '{b} paid $7.38 by card and the store charged $7.40. Is that right? Why?', lines: { n: 3, key: 'No. Only cash totals round. A card pays the exact $7.38.' } },
          { q: 'Why does Canada round cash totals?', lines: { n: 2, key: 'There are no pennies, so cash can only make amounts in 5 cents.' } },
          RC(11.06)]
      }
    },

    budget: {
      watch: 'spending first and saving whatever is left, which is usually nothing. Save first.',
      goal: 'I can make a balanced budget.',
      learn: {
        show: { eq: ['10 + 15 + 15 = 40'], cap: 'savings + needs + wants = income' },
        together: [BW(60, 15, 25), BAL(40, 10, 15, 15)],
        cue: 'Every dollar gets a job.',
        own: [BW(80, 20, 35), BAL(50, 10, 25, 20)]
      },
      p1: {
        items: [BW(30, 5, 15), BW(100, 25, 40), BW(45, 10, 20), BW(72, 12, 30), BW(55, 15, 25), BW(90, 30, 35)]
      },
      p2: {
        items: [BAL(60, 15, 25, 20), BAL(70, 20, 30, 25), BAL(36, 6, 18, 12), BAL(100, 20, 50, 20),
          { q: 'Save 10% of $80.', eq: ['80 × 10% = []'], a: [8] }, { q: 'Save 25% of $60.', eq: ['60 × 25% = []'], a: [15] }]
      },
      p3: {
        items: [story('{b} saves $8 a week for a $120 bike. How many weeks?', 'weeks', 15, '120 ÷ 8'),
          story('{a} earns $45 and saves 20% of it. How much is saved?', '$', 9, '45 × 20%'),
          story('Income $50. Needs $22 and savings $10. {b} wants a $20 game. How much is short?', '$', 2, '22 + 10 + 20 − 50'),
          BAL(84, 21, 42, 21)]
      },
      think: {
        items: [{ q: '{b} spends first and saves what is left. What can go wrong?', lines: { n: 3, key: 'Often nothing is left to save. Save first, the day the money comes in.' } },
          { q: 'Name one need and one want.', lines: { n: 2, key: 'A need: food, a winter coat, bus fare. A want: a game, a treat, a new phone case.' } },
          BW(65, 15, 30)]
      }
    },

    interest: {
      watch: 'paying only a little and thinking the debt is nearly gone. Interest is added to what is still owed.',
      goal: 'I can show how interest makes debt grow.',
      learn: {
        show: { eq: ['100 × 2% = 2', '100 + 2 = 102'] },
        together: [IN(200, 2)],
        cue: 'Interest is added to what you still owe.',
        own: [IN(300, 2)]
      },
      p1: {
        items: [IN(100, 3), IN(50, 2), IN(400, 1), IN(250, 2)]
      },
      p2: {
        items: [story('{b} owes $200. 2% interest is added, then {b} pays $104. How much is still owed?', '$', 100, '200 + 200 × 2% − 104'),
          story('{a} owes $100. 2% is added, then {a} pays $52. How much is still owed?', '$', 50, '100 + 100 × 2% − 52'),
          story('{b} owes $50. 2% is added. How much is owed now?', '$', 51, '50 + 50 × 2%'),
          story('{a} owes $500 at 1% a month. How much interest is added in the first month?', '$', 5, '500 × 1%')]
      },
      p3: {
        items: [{ q: 'Owe $200 at 2% a month. Month 1:', eq: ['200 × 2% = []', '200 + [] = []'], a: [4, 4, 204] },
          { q: 'Pay $104. Month 2:', eq: ['204 − 104 = []', '100 × 2% = []'], a: [100, 2] },
          { q: 'Owe $102. Pay $52. Month 3:', eq: ['102 − 52 = []', '50 × 2% = []'], a: [50, 1] },
          story('The interest was $4, then $2, then $1. How much interest in all?', '$', 7, '4 + 2 + 1'),
          { q: 'Both debts grow by 2% a month: one is $300, the other $100. Which adds less interest this month?', pick: { opts: ['$300 debt', '$100 debt'], ans: 1, less: ['300 × 2%', '100 × 2%'] }, wide: true }]
      },
      think: {
        items: [{ q: 'Why does paying more each month cost less in the end?', lines: { n: 3, key: 'Interest is worked out on what you still owe. Paying more makes that smaller sooner, so less interest is added.' } },
          { q: 'Name a good reason to borrow money.', lines: { n: 2, key: 'A big need, like a home or school, that you can pay back.' } },
          IN(150, 2)]
      }
    },

    'unit-rate': {
      watch: 'thinking the bigger package is always cheaper. Work out both prices for one.',
      goal: 'I can find the better buy.',
      learn: {
        show: { eq: ['3.90 ÷ 6 = 0.65', '5.90 ÷ 10 = 0.59'] },
        together: [UR(5, 4, 'muffins'), BB([4, 5], [6, 6.6], 'muffins')],
        cue: 'Divide the price by the amount. Lower is better.',
        own: [UR(6.6, 6, 'muffins'), BB([2, 3], [3, 4.8], 'L')]
      },
      p1: {
        items: [UR(3.6, 4, 'apples'), UR(7.5, 5, 'pens'), UR(9.6, 8, 'bars'), UR(4.5, 3, 'L'), UR(12, 10, 'stickers'), UR(2.4, 6, 'buns')]
      },
      p2: {
        items: [BB([6, 3.9], [10, 5.9], 'bars'), BB([2, 3], [3, 4.8], 'L'), BB([5, 4], [8, 6], 'pens'), BB([3, 2.7], [4, 3.2], 'cans')]
      },
      p3: {
        items: [story('A 500 g bag of rice costs $4.00. 500 g is 5 lots of 100 g. What is the price for 100 g?', '$', '0.80', '4.00 ÷ 5'),
          BB([4, 6], [6, 8.4], '{many}'),
          story('A 12-pack of juice is $6.00. A single box is $0.65. How much is saved on 12 boxes with the pack?', '$', '1.80', '12 × 0.65 − 6.00')]
      },
      think: {
        items: [{ q: '{b} says the biggest box is always the better buy. Is that right?', lines: { n: 3, key: 'No. Work out the price for one of each. Sometimes the smaller size costs less for one.' } },
          { q: 'When is the better buy not the best choice?', lines: { n: 2, key: 'When you will not use it all before it goes bad, or cannot pay for it now.' } },
          UR(8.4, 7, 'tickets')]
      }
    },

    levels: {
      watch: 'mixing up which level runs which service. Link each to something nearby.',
      goal: 'I can tell which level of government runs a service.',
      learn: {
        show: { eq: ['federal: Canada', 'provincial: Ontario', 'municipal: your town'] },
        together: [GV('passports'), GV('libraries')],
        cue: 'Country, province or town?',
        own: [GV('schools'), GV('garbage pickup')]
      },
      p1: {
        items: [GV('hospitals'), GV('national parks'), GV('local parks'), GV('highways'), GV('fire trucks'), GV('the armed forces')]
      },
      p2: {
        items: [GV("driver's licences"), GV('city buses'), GV('coins and bills'), GV('health cards'), GV('mail delivery'), GV('snow ploughs on your street')]
      },
      p3: {
        show: { eq: ['Canada: 5%', 'Ontario: 8%'] },
        items: [{ q: 'On a $20.00 game:', eq: ['20.00 × 5% = []', '20.00 × 8% = []'], a: ['1.00', '1.60'] },
          { q: 'On a $50.00 coat:', eq: ['50.00 × 5% = []', '50.00 × 8% = []'], a: ['2.50', '4.00'] },
          { q: 'On a $10.00 book:', eq: ['10.00 × 5% = []', '10.00 × 8% = []'], a: ['0.50', '0.80'] },
          { q: 'On a $40.00 lamp:', eq: ['40.00 × 5% = []', '40.00 × 8% = []'], a: ['2.00', '3.20'] }]
      },
      think: {
        items: [{ q: 'Why do we pay taxes?', lines: { n: 3, key: 'To pay for things too costly for one family alone, like roads, schools and hospitals.' } },
          { q: 'Name one service near you and the level that runs it.', lines: { n: 2, key: 'For example: the library (municipal), my school (provincial), my passport (federal).' } },
          GV('schools')]
      }
    }
  } });
})();
