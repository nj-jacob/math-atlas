/* Grade 8 Money: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/money.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names. Amounts are in Canadian dollars; HST in Ontario is 13%.
   Ontario 2020: F1.1 exchange rates and ways to pay; F1.2 planning for a big purchase, with tax; F1.3 budgets that
   balance, fixed and variable costs; F1.4 simple and compound interest; F1.5 comparing prices and deals; F1.6 credit and
   the total cost of contracts. The answer checks are in tests/verify/sheets.js: every story sum is worked out again from
   the numbers in the question, a budget's surplus or deficit follows income minus spending (budget), a cost is fixed or
   variable by its kind (cost), and the better buy has the least cost per unit (less). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var Q = S.q;
  function ST(q, calc, unit, dp) { var v = S.calc(calc); return { q: q, eq: ['[]' + (unit ? ' ' + unit : '')], a: [dp != null ? +v.toFixed(dp) : v], calc: calc, dp: dp }; }
  function BU(inc, out) { var d = inc - out; return { q: 'Income $' + S.fmt(inc) + ', spending $' + S.fmt(out) + '.', eq: [S.fmt(inc) + ' − ' + S.fmt(out) + ' = []'], a: [d], pick: { opts: ['surplus', 'balanced', 'deficit'], ans: d > 0 ? 0 : d < 0 ? 2 : 1, budget: [inc, out] }, pickLast: true }; }
  function FX(cost) { var f = ['rent', 'phone plan', 'car insurance', 'internet', 'loan payment', 'gym membership', 'streaming plan', 'bus pass'].indexOf(cost) >= 0; return { q: cost.charAt(0).toUpperCase() + cost.slice(1) + '.', pick: { opts: ['fixed', 'variable'], ans: f ? 0 : 1, cost: cost } }; }
  /* the better buy: the least price per unit */
  function BUY(names, prices, sizes, unit) {
    var per = prices.map(function (p, i) { return p + ' ÷ ' + sizes[i]; }), v = per.map(S.calc);
    return { q: names.map(function (n, i) { return n + ': $' + prices[i].toFixed(2) + ' for ' + sizes[i] + ' ' + unit; }).join('. ') + '. Better buy?',
      eq: per.map(function (e) { return '$' + e + ' ≈ []'; }), a: v.map(function (x) { return +x.toFixed(3); }),
      pick: { opts: names, ans: v.indexOf(Math.min.apply(null, v)), less: per }, pickLast: true, wide: true };
  }

  S.register('money', { code: 'MO', ideas: {

    convert: {
      watch: 'multiplying when you should divide. Check: is the answer more or fewer dollars than you started with?',
      goal: 'I can convert between currencies with an exchange rate.',
      learn: {
        show: { cap: 'US$1 = CA$1.37', eq: ['US$50 × 1.37 = CA$68.50'] },
        together: [ST('US$1 = CA$1.37. How many Canadian dollars is US$80?', '80 × 1.37', 'CAD')],
        cue: 'Foreign to Canadian: × the rate. Canadian to foreign: ÷ the rate.',
        own: [ST('US$1 = CA$1.37. How many CAD is US$200?', '200 × 1.37', 'CAD'), ST('€1 = CA$1.50. How many euros is CA$300?', '300 ÷ 1.50', 'euros')]
      },
      p1: {
        show: { eq: ['CA$137 ÷ 1.37 = US$100'] },
        items: [ST('US$1 = CA$1.37. CAD for US$10?', '10 × 1.37', 'CAD'), ST('US$1 = CA$1.37. CAD for US$45?', '45 × 1.37', 'CAD'),
          ST('€1 = CA$1.50. CAD for €60?', '60 × 1.50', 'CAD'), ST('€1 = CA$1.50. Euros for CA$90?', '90 ÷ 1.50', 'euros'),
          ST('£1 = CA$1.75. CAD for £40?', '40 × 1.75', 'CAD'), ST('£1 = CA$1.75. Pounds for CA$140?', '140 ÷ 1.75', 'pounds')]
      },
      p2: {
        items: [ST('¥1 = CA$0.009. CAD for ¥5000?', '5000 × 0.009', 'CAD'), ST('MX$1 = CA$0.08. CAD for MX$750?', '750 × 0.08', 'CAD'),
          ST('US$1 = CA$1.36. A US$24.99 game costs how much in CAD, to the cent?', '24.99 × 1.36', 'CAD', 2),
          ST('US$1 = CA$1.36. How many US$ for CA$170?', '170 ÷ 1.36', 'USD'),
          ST('€1 = CA$1.48. A €12.50 museum ticket in CAD?', '12.50 × 1.48', 'CAD')]
      },
      p3: {
        items: [ST('A jacket is US$120 in a US shop and CA$155 here. US$1 = CA$1.37. How much more is the US one in CAD?', '120 × 1.37 − 155', 'CAD'),
          ST('{a} changed CA$500 to euros at €1 = CA$1.50 and spent €250. How many euros are left?', '500 ÷ 1.50 − 250', 'euros', 2),
          ST('A bank sells US$1 for CA$1.40 and buys it back for CA$1.32. {a} buys US$100, then sells it back. CAD lost?', '100 × 1.40 − 100 × 1.32', 'CAD')]
      },
      think: {
        items: [{ q: 'Why do exchange rates change?', lines: { n: 2, key: 'Trade, travel and the economy change how much each currency is wanted.' } },
          { q: 'How can you check a conversion quickly?', lines: { n: 2, key: 'Round: US$1 is about CA$1.40, so US$50 is about CA$70.' } },
          ST('US$1 = CA$1.37. CAD for US$35?', '35 × 1.37', 'CAD'),
          { q: 'Why is an online price in US$ not the price you pay?', lines: { n: 2, key: 'It must be converted to CAD, and there may be fees, shipping and tax.' } }]
      }
    },

    pay: {
      watch: 'forgetting the fee. A small percent fee adds up on every purchase.',
      goal: 'I can compare ways to pay and their fees.',
      learn: {
        show: { cap: 'a 2.5% fee on a $200 purchase', eq: ['2.5% of 200 = $5'] },
        together: [ST('A card charges a 2.5% fee on foreign purchases. The fee on $80?', '2.5% of 80', 'dollars')],
        cue: 'Find the fee, then add it to the price.',
        own: [ST('A $3 fee for each ATM use. 5 uses?', '5 × 3', 'dollars'), ST('A 3% fee on $250. Total paid?', '250 + 3% of 250', 'dollars')]
      },
      p1: {
        show: { eq: ['$120 + 2.5% of 120', '= $123'] },
        items: [ST('A 2.5% fee on $60?', '2.5% of 60', 'dollars'), ST('A 1.5% fee on $400?', '1.5% of 400', 'dollars'),
          ST('A $2.50 fee for each e-transfer. 8 transfers?', '8 × 2.50', 'dollars'), ST('A 2% fee on a $45 payment. Total?', '45 + 2% of 45', 'dollars')]
      },
      p2: {
        items: [ST('Debit: $0 fee. Credit: 2.5% fee on a $360 trip. Savings with debit?', '2.5% of 360', 'dollars'),
          ST('A card: $120 a year. Another: free, but a 3% fee. {a} spends $3000 a year. Fees on the free card?', '3% of 3000', 'dollars'),
          ST('Prepaid card: $5 to buy, then $1.50 a month. Cost for 12 months?', '5 + 12 × 1.50', 'dollars')]
      },
      p3: {
        items: [ST('A $450 trip paid in US$: the bank adds 2.5%. Fee in CAD?', '2.5% of 450', 'dollars'),
          ST('{a} uses an ATM 3 times a week at $2.75. Cost for 4 weeks?', '3 × 4 × 2.75', 'dollars'),
          ST('A bank account costs $16.95 a month. Cost over 12 months?', '16.95 × 12', 'dollars'),
          { q: 'Card A: no fee, 2.5% on foreign buys. Card B: $65 a year, no foreign fee. {a} spends $2000 abroad. Which costs less?', eq: ['Card A fee: []'], a: [50], calc: '2.5% of 2000', pick: { opts: ['Card A', 'Card B'], ans: 0, less: ['2.5% of 2000', '65'] }, pickLast: true, wide: true }]
      },
      think: {
        items: [{ q: 'Name two ways to pay and one good point of each.', lines: { n: 3, key: 'For example cash: no fees; debit: comes straight from your account; credit: safe online, builds a credit history.' } },
          { q: 'Why might a store add a fee for credit?', lines: { n: 2, key: 'The card company charges the store a percent of each sale.' } },
          ST('A 1.75% fee on $800?', '1.75% of 800', 'dollars'),
          { q: 'How can you avoid ATM fees?', lines: { n: 2, key: 'Use your own bank\'s machines, or take out more cash less often.' } }]
      }
    },

    balance: {
      watch: 'calling a budget balanced because the totals are close. Balanced means income equals spending exactly.',
      goal: 'I can tell if a budget has a surplus, is balanced, or has a deficit.',
      learn: {
        show: { cap: 'money in minus money out', eq: ['2400 − 2250 = 150: surplus'] },
        together: [BU(1800, 1950)],
        cue: 'More in than out: surplus. Less: deficit. The same: balanced.',
        own: [BU(3200, 3200), BU(2650, 2480)]
      },
      p1: {
        show: { eq: ['1500 − 1620 = −120: deficit'] },
        items: [BU(500, 420), BU(1200, 1350), BU(980, 980), BU(4100, 3875)]
      },
      p2: {
        items: [{ q: 'Monthly budget. Total spending?', pic: ['tbl', { head: ['Item', 'Cost ($)'], rows: [['Rent', 1450], ['Food', 520], ['Bus pass', 128], ['Phone', 65], ['Other', 210]] }], eq: ['[] dollars'], a: [2373], calc: '1450 + 520 + 128 + 65 + 210' },
          BU(2500, 2373), BU(3000, 3125),
          ST('A deficit of $40 a month. How much over 12 months?', '12 × 40', 'dollars')]
      },
      p3: {
        items: [{ q: 'Income $2800. Spending is shown. Surplus or deficit, and how much?', pic: ['tbl', { head: ['Item', 'Cost ($)'], rows: [['Rent', 1600], ['Food', 650], ['Car', 420], ['Fun', 180]] }], eq: ['2800 − 1600 − 650 − 420 − 180 = []'], a: [-50], wide: true },
          ST('To fix a $50 deficit, {a} cuts fun spending by 30% of $180. Is that enough? The new surplus:', '30% of 180 − 50', 'dollars'),
          BU(3650, 3650)]
      },
      think: {
        items: [{ q: 'Give two ways to fix a deficit.', lines: { n: 2, key: 'Spend less (cut a variable cost) or earn more.' } },
          { q: 'What would you do with a surplus?', lines: { n: 2, key: 'For example save it, pay off debt, or give some away.' } },
          BU(2100, 2230),
          { q: 'Why is a budget a plan, not just a list?', lines: { n: 2, key: 'It decides ahead where money will go, so you can meet goals.' } }]
      }
    },

    fixed: {
      watch: 'calling every bill fixed. A fixed cost is the same every month; a variable one changes.',
      goal: 'I can sort fixed and variable costs.',
      learn: {
        show: { cap: 'rent is the same each month; groceries change', eq: ['fixed + variable = total'] },
        together: [FX('rent'), FX('groceries')],
        cue: 'Same amount every month? Fixed. Changes? Variable.',
        own: [FX('internet'), FX('gas for the car'), ST('Fixed $1600 and variable $740. Total?', '1600 + 740', 'dollars')]
      },
      p1: {
        show: { eq: ['phone plan: fixed', 'eating out: variable'] },
        items: [FX('bus pass'), FX('eating out'), FX('car insurance'), FX('clothing'), FX('streaming plan'), FX('electricity')]
      },
      p2: {
        items: [FX('gym membership'), FX('gifts'), FX('loan payment'),
          ST('Fixed costs: rent $1500, phone $60, internet $70. Total fixed?', '1500 + 60 + 70', 'dollars'),
          ST('Groceries for 3 months were $560, $610 and $585. Mean monthly cost?', '(560 + 610 + 585) ÷ 3', 'dollars')]
      },
      p3: {
        items: [ST('Income $2900. Fixed costs $1850. How much is left for variable costs?', '2900 − 1850', 'dollars'),
          ST('Variable costs rise 8% from $900. New amount?', '900 + 8% of 900', 'dollars'),
          ST('{a} cuts eating out from $240 to $150 a month. Savings over 12 months?', '12 × (240 − 150)', 'dollars')]
      },
      think: {
        items: [{ q: 'Which costs are easier to cut? Why?', lines: { n: 2, key: 'Variable ones: you choose how much to spend each month.' } },
          { q: 'Is a phone bill always fixed? Explain.', lines: { n: 2, key: 'A plan is fixed, but extra data or calls can make it vary.' } },
          FX('rent'),
          { q: 'Why plan fixed costs first?', lines: { n: 2, key: 'They must be paid every month, so they come before choices.' } }]
      }
    },

    hst: {
      watch: 'adding 13 dollars, not 13 percent. HST is 13% of the price.',
      goal: 'I can add HST to a price.',
      learn: {
        show: { cap: 'in Ontario HST is 13%', eq: ['$40 × 1.13 = $45.20'] },
        together: [ST('A $60 game plus 13% HST. Total?', '60 + 13% of 60', 'dollars')],
        cue: 'Price × 1.13 gives the price with HST.',
        own: [ST('13% HST on $25?', '13% of 25', 'dollars'), ST('A $200 bike plus 13% HST. Total?', '200 × (1 + 13%)', 'dollars')]
      },
      p1: {
        show: { eq: ['13% of 80 = 10.40', '80 + 10.40 = 90.40'] },
        items: [ST('13% HST on $100?', '13% of 100', 'dollars'), ST('13% HST on $50?', '13% of 50', 'dollars'), ST('$30 plus 13% HST?', '30 + 13% of 30', 'dollars'),
          ST('$150 plus 13% HST?', '150 + 13% of 150', 'dollars'), ST('$12 plus 13% HST?', '12 × (1 + 13%)', 'dollars', 2), ST('$9.99 plus 13% HST, to the cent?', '9.99 × (1 + 13%)', 'dollars', 2)]
      },
      p2: {
        items: [ST('A $899 laptop plus 13% HST. Total, to the cent?', '899 × (1 + 13%)', 'dollars', 2),
          ST('Shoes $85, socks $12. With 13% HST?', '(85 + 12) × (1 + 13%)', 'dollars', 2),
          ST('A $1250 couch, 20% off, then 13% HST. Total?', '1250 × (1 − 20%) × (1 + 13%)', 'dollars'),
          ST('The total with 13% HST is $56.50. Price before tax?', '56.50 ÷ (1 + 13%)', 'dollars')]
      },
      p3: {
        items: [ST('With 13% HST, the total is $339. Price before tax?', '339 ÷ (1 + 13%)', 'dollars'),
          ST('A $24 000 car plus 13% HST. Total?', '24000 × (1 + 13%)', 'dollars'),
          ST('3 shirts at $14.99 plus 13% HST, to the cent?', '3 × 14.99 × (1 + 13%)', 'dollars', 2)]
      },
      think: {
        items: [{ q: 'Why is × 1.13 the same as adding 13%?', lines: { n: 2, key: '1 is the price and 0.13 is the tax: price + 13% of price.' } },
          { q: 'Does it matter if the discount or the tax comes first?', lines: { n: 2, key: 'No: both are multiplying, and the order of × does not change the answer.' } },
          ST('$45 plus 13% HST?', '45 + 13% of 45', 'dollars'),
          { q: 'What does HST pay for?', lines: { n: 2, key: 'Government services like roads, schools and health care.' } }]
      }
    },

    goal: {
      exp: ['F1.2', 'F1.3'],
      watch: 'forgetting the tax in the goal. Plan for the total with HST.',
      goal: 'I can plan how to save for a big purchase.',
      learn: {
        show: { cap: 'a $400 bike with HST is $452; save $40 a week', eq: ['452 ÷ 40 = 11.3: 12 weeks'] },
        together: [ST('A $300 phone plus 13% HST. How much to save?', '300 × (1 + 13%)', 'dollars')],
        cue: 'Goal with tax − saved so far ÷ saving each week. Round weeks up.',
        own: [ST('Goal $339, saved $99, $30 a week. Weeks?', '(339 − 99) ÷ 30', 'weeks'), ST('{a} earns $15 an hour and saves 40%. Saved per hour?', '40% of 15', 'dollars')]
      },
      p1: {
        show: { eq: ['(goal − saved) ÷ per week'] },
        items: [ST('Goal $500, saved $140, $45 a week. Weeks?', '(500 − 140) ÷ 45', 'weeks'), ST('Goal $1200 in 24 weeks. Per week?', '1200 ÷ 24', 'dollars'),
          ST('Goal $678 with HST. $56.50 a week. Weeks?', '678 ÷ 56.50', 'weeks'), ST('{a} saves $35 a week for 16 weeks. Total?', '35 × 16', 'dollars')]
      },
      p2: {
        items: [ST('A $750 trip plus 13% HST. {a} has $200 and saves $50 a week. Weeks, rounded up?', '(750 × (1 + 13%) − 200) ÷ 50', 'weeks', 0),
          ST('{a} earns $420 a month and saves 25%. Months to save $840?', '840 ÷ (25% of 420)', 'months'),
          ST('A goal of $2400 in 12 months. Per month?', '2400 ÷ 12', 'dollars')]
      },
      p3: {
        items: [ST('A $1100 laptop plus 13% HST. {a} has $343 and saves $80 a week. Weeks?', '(1100 × (1 + 13%) − 343) ÷ 80', 'weeks'),
          ST('Saving $25 a week from week 1. Week 30 total?', '25 × 30', 'dollars'),
          ST('A 6-month goal of $1500. {a} has saved $420 after 2 months. Per month for the other 4?', '(1500 − 420) ÷ 4', 'dollars')]
      },
      think: {
        items: [{ q: 'Why round weeks up, not down?', lines: { n: 2, key: 'Rounding down leaves you short of the goal.' } },
          { q: 'Plan a big purchase: item, price with tax, and a saving plan.', lines: { n: 3, key: 'For example a $250 bike: $282.50 with tax; $30 a week for 10 weeks.' } },
          ST('Goal $904, $113 a week. Weeks?', '904 ÷ 113', 'weeks'),
          { q: 'Saving or borrowing for a goal: which is cheaper? Why?', lines: { n: 2, key: 'Saving: borrowing adds interest.' } }]
      }
    },

    simple: {
      watch: 'adding the rate as dollars. Interest = principal × rate × years.',
      goal: 'I can find simple interest.',
      learn: {
        show: { cap: '$500 at 4% a year for 3 years', eq: ['500 × 4% × 3 = $60'] },
        together: [ST('$800 at 5% a year for 2 years. Interest?', '800 × 5% × 2', 'dollars')],
        cue: 'I = P × r × t. Then add it to P for the total.',
        own: [ST('$1000 at 3% for 4 years. Interest?', '1000 × 3% × 4', 'dollars'), ST('$600 at 2% for 5 years. Total?', '600 + 600 × 2% × 5', 'dollars')]
      },
      p1: {
        show: { eq: ['total = P + I'] },
        items: [ST('$200 at 5% for 1 year. Interest?', '200 × 5% × 1', 'dollars'), ST('$1500 at 4% for 2 years. Interest?', '1500 × 4% × 2', 'dollars'),
          ST('$750 at 6% for 3 years. Interest?', '750 × 6% × 3', 'dollars'), ST('$2000 at 2.5% for 4 years. Interest?', '2000 × 2.5% × 4', 'dollars'),
          ST('$400 at 3% for 5 years. Total?', '400 + 400 × 3% × 5', 'dollars')]
      },
      p2: {
        items: [ST('$5000 at 3.5% for 6 years. Interest?', '5000 × 3.5% × 6', 'dollars'), ST('$1200 at 4% for 6 months (0.5 years). Interest?', '1200 × 4% × 0.5', 'dollars'),
          ST('A $3000 loan at 7% for 2 years. Total to repay?', '3000 + 3000 × 7% × 2', 'dollars'),
          ST('$900 earned $108 interest in 4 years. Rate?', '108 ÷ (900 × 4) × 100', '%')]
      },
      p3: {
        items: [ST('$2500 earned $300 at 4%. How many years?', '300 ÷ (2500 × 4%)', 'years'),
          ST('Interest of $90 at 3% for 2 years. The principal?', '90 ÷ (3% × 2)', 'dollars'),
          ST('$10 000 at 2.75% for 3 years. Total?', '10000 + 10000 × 2.75% × 3', 'dollars')]
      },
      think: {
        items: [{ q: 'Why does a longer time earn more interest?', lines: { n: 2, key: 'Interest is earned again each year, so more years add more.' } },
          { q: 'When do you pay interest instead of earning it?', lines: { n: 2, key: 'When you borrow: a loan or a credit card balance.' } },
          ST('$350 at 4% for 3 years. Interest?', '350 × 4% × 3', 'dollars'),
          { q: 'What does "principal" mean?', lines: { n: 1, key: 'The amount first saved or borrowed.' } }]
      }
    },

    compound: {
      watch: 'working out the interest on the first amount only. Each year earns interest on the new total.',
      goal: 'I can find compound interest.',
      learn: {
        show: { cap: '$1000 at 5% for 2 years', eq: ['1000 × 1.05 × 1.05 = $1102.50'] },
        together: [ST('$500 at 10% compounded yearly. After 2 years?', '500 × (1 + 10%)²', 'dollars')],
        cue: 'Multiply by (1 + rate) once for each year.',
        own: [ST('$200 at 5% compounded yearly. After 2 years?', '200 × (1 + 5%)²', 'dollars'), ST('$1000 at 3% compounded yearly. After 3 years, to the cent?', '1000 × (1 + 3%)³', 'dollars', 2)]
      },
      p1: {
        show: { eq: ['P × (1 + r)ⁿ'] },
        items: [ST('$100 at 10% for 2 years?', '100 × (1 + 10%)²', 'dollars'), ST('$400 at 5% for 2 years?', '400 × (1 + 5%)²', 'dollars'),
          ST('$1000 at 10% for 3 years?', '1000 × (1 + 10%)³', 'dollars'), ST('$2000 at 4% for 2 years?', '2000 × (1 + 4%)²', 'dollars'),
          ST('$800 at 2% for 2 years?', '800 × (1 + 2%)²', 'dollars', 2)]
      },
      p2: {
        items: [ST('$5000 at 4% for 3 years, to the cent?', '5000 × (1 + 4%)³', 'dollars', 2),
          ST('$1000 at 5% for 2 years. Compound minus simple interest?', '1000 × (1 + 5%)² − (1000 + 1000 × 5% × 2)', 'dollars'),
          ST('$300 at 6% for 2 years. Interest earned?', '300 × (1 + 6%)² − 300', 'dollars', 2)]
      },
      p3: {
        items: [ST('$10 000 at 5% for 4 years, to the cent?', '10000 × (1 + 5%)⁴', 'dollars', 2),
          ST('A $1500 credit card balance at 20% a year, unpaid for 2 years. What is owed?', '1500 × (1 + 20%)²', 'dollars'),
          ST('$2500 at 3% for 5 years, to the cent?', '2500 × (1 + 3%)⁵', 'dollars', 2)]
      },
      think: {
        items: [{ q: 'Why does compound interest grow faster than simple interest?', lines: { n: 3, key: 'Each year earns interest on the interest from before, so the amount grows more each year.' } },
          { q: 'Why start saving early?', lines: { n: 2, key: 'More years of compounding make the money grow much more.' } },
          ST('$600 at 10% for 2 years?', '600 × (1 + 10%)²', 'dollars'),
          { q: 'Why is compound interest bad on a debt?', lines: { n: 2, key: 'The debt grows on itself, faster every year.' } }]
      }
    },

    unit: {
      watch: 'picking the cheaper total price. Compare price per unit.',
      goal: 'I can find unit prices to compare.',
      learn: {
        show: { cap: '$4.50 for 3 L: price ÷ amount', eq: ['$4.50 ÷ 3 = $1.50 a litre'] },
        together: [BUY(['A', 'B'], [3.60, 5.00], [4, 5], 'kg')],
        cue: 'Price ÷ amount. The lower unit price is the better buy.',
        own: [BUY(['Small', 'Big'], [2.40, 6.00], [200, 600], 'g')]
      },
      p1: {
        show: { eq: ['$6.00 ÷ 12 = $0.50 each'] },
        items: [ST('$7.50 for 5 L. Price per litre?', '7.50 ÷ 5', 'dollars'), ST('$12 for 8 muffins. Per muffin?', '12 ÷ 8', 'dollars'),
          BUY(['A', 'B'], [4.00, 9.00], [2, 5], 'kg'), BUY(['A', 'B'], [2.70, 4.80], [9, 12], 'pens')]
      },
      p2: {
        items: [BUY(['Box', 'Bag'], [6.30, 4.95], [700, 500], 'g'), BUY(['A', 'B'], [24.00, 39.00], [8, 12], 'kg'),
          ST('$3.29 for 500 g. Price per kg?', '3.29 ÷ 500 × 1000', 'dollars')]
      },
      p3: {
        items: [BUY(['A', 'B'], [5.49, 8.99], [750, 1250], 'mL'), BUY(['Pack', 'Single'], [11.88, 1.15], [12, 1], 'cans'),
          ST('Rice: $18 for 8 kg. How much for 3 kg at the same unit price?', '18 ÷ 8 × 3', 'dollars')]
      },
      think: {
        items: [{ q: 'Is the bigger package always the better buy?', lines: { n: 2, key: 'No. Check the unit price, and whether you will use it all before it spoils.' } },
          { q: 'Why do stores show the unit price on shelf tags?', lines: { n: 2, key: 'So shoppers can compare sizes fairly.' } },
          ST('$2.85 for 3 cans. Per can?', '2.85 ÷ 3', 'dollars'),
          { q: 'Give a reason to buy the higher unit price.', lines: { n: 1, key: 'For example you need only a little, or it is better quality.' } }]
      }
    },

    deals: {
      watch: 'adding two discounts together. 20% off, then 10% off is not 30% off.',
      goal: 'I can work out sales, deals and points.',
      learn: {
        show: { cap: '25% off $80', eq: ['80 × (1 − 25%) = $60'] },
        together: [ST('A $120 coat is 30% off. Sale price?', '120 × (1 − 30%)', 'dollars')],
        cue: 'Find the price each item really costs. Then compare.',
        own: [ST('Buy 2, get 1 free: $9 each. Price per item for 3?', '2 × 9 ÷ 3', 'dollars'), ST('$80, 20% off, then 10% off the sale price?', '80 × (1 − 20%) × (1 − 10%)', 'dollars')]
      },
      p1: {
        show: { eq: ['buy 3 for the price of 2', '= 1/3 off each'] },
        items: [ST('$45, 20% off. Sale price?', '45 × (1 − 20%)', 'dollars'), ST('$250, 15% off. Sale price?', '250 × (1 − 15%)', 'dollars'),
          ST('$60, 40% off. Savings?', '40% of 60', 'dollars'), ST('Buy 1, get 1 half price: $30 each. Cost of 2?', '30 + 30 ÷ 2', 'dollars'),
          ST('10 points for each $1. Points for $45?', '45 × 10', 'points')]
      },
      p2: {
        items: [ST('$200, 25% off, then 10% off. Final price?', '200 × (1 − 25%) × (1 − 10%)', 'dollars'),
          ST('1000 points = $1. {a} has 25 000 points. Worth?', '25000 ÷ 1000', 'dollars'),
          ST('A $90 jacket is 30% off, plus 13% HST. Total?', '90 × (1 − 30%) × (1 + 13%)', 'dollars', 2),
          ST('Store A: $40 with 25% off. Store B: $36. How much cheaper is A?', '36 − 40 × (1 − 25%)', 'dollars')]
      },
      p3: {
        items: [ST('A $56 item is on sale for $42. What percent off?', '(56 − 42) ÷ 56 × 100', '%'),
          ST('Buy 3, get the 4th free: $12.50 each. Price per item for 4?', '3 × 12.50 ÷ 4', 'dollars', 3),
          ST('Points: 15 per $1, and 1000 points = $1. Spend $400. Points worth?', '400 × 15 ÷ 1000', 'dollars')]
      },
      think: {
        items: [{ q: 'Why is 20% off then 10% off less than 30% off?', lines: { n: 3, key: 'The 10% comes off the lower sale price, so it is a smaller amount.' } },
          { q: 'When is a deal not a good deal?', lines: { n: 2, key: 'When you buy things you do not need, or the "sale" price is not lower than elsewhere.' } },
          ST('$35, 20% off?', '35 × (1 − 20%)', 'dollars'),
          { q: 'Are loyalty points free money? Explain.', lines: { n: 2, key: 'Not really: they are worth little per dollar and may make you spend more.' } }]
      }
    },

    card: {
      watch: 'paying only the minimum and thinking the rest is free. Interest is charged on the balance left.',
      goal: 'I can see how credit card interest adds up.',
      learn: {
        show: { cap: '19.99% a year is about 1.67% a month', eq: ['1.67% of $500 = $8.35'] },
        together: [ST('A $600 balance, 2% interest a month. Interest for one month?', '2% of 600', 'dollars')],
        cue: 'Interest is charged on the balance you do not pay off.',
        own: [ST('20% a year, over 12 months. About what percent a month, to 2 decimal places?', '20 ÷ 12', '%', 2), ST('$1000 at 1.5% a month. Interest?', '1.5% of 1000', 'dollars')]
      },
      p1: {
        show: { eq: ['pay in full: no interest'] },
        items: [ST('$300 balance, 2% a month. Interest?', '2% of 300', 'dollars'), ST('$850, 1.5% a month. Interest?', '1.5% of 850', 'dollars'),
          ST('$400 balance; $100 is paid. 2% interest on the rest?', '2% of (400 − 100)', 'dollars'), ST('Minimum payment: 3% of $1200?', '3% of 1200', 'dollars')]
      },
      p2: {
        items: [ST('$2000 at 2% a month, no payments. After 2 months?', '2000 × (1 + 2%)²', 'dollars'),
          ST('A $500 phone on a card at 20% a year, paid after a year. Total?', '500 × (1 + 20%)', 'dollars'),
          ST('$1500 balance. Pay $1500 now, or $50 a month for 36 months. How much more is the second?', '50 × 36 − 1500', 'dollars')]
      },
      p3: {
        items: [ST('$900 at 1.75% a month. One month of interest, to the cent?', '1.75% of 900', 'dollars', 2),
          ST('$3000 at 2% a month, no payments, for 3 months, to the cent?', '3000 × (1 + 2%)³', 'dollars', 2),
          ST('A store card: 29.99% a year, over 12 months. About what percent a month, to 2 decimal places?', '29.99 ÷ 12', '%', 2)]
      },
      think: {
        items: [{ q: 'How can you use a credit card with no interest?', lines: { n: 2, key: 'Pay the full balance by the due date every month.' } },
          { q: 'Why is paying only the minimum costly?', lines: { n: 3, key: 'Most of the balance stays, and interest is charged on it every month, for years.' } },
          ST('$700 at 2% a month. Interest?', '2% of 700', 'dollars'),
          { q: 'Give one good reason to have a credit card.', lines: { n: 1, key: 'For example to build a credit history or pay safely online.' } }]
      }
    },

    contract: {
      watch: 'looking only at the monthly price. Add every payment and fee for the total cost.',
      goal: 'I can find the total cost of a contract.',
      learn: {
        show: { cap: '$45 a month for 24 months, plus $100 up front', eq: ['24 × 45 + 100 = $1180'] },
        together: [ST('A phone: $0 down, $55 a month for 24 months. Total?', '55 × 24', 'dollars')],
        cue: 'Monthly × months + any fees.',
        own: [ST('A gym: $60 to join, $35 a month for 12 months. Total?', '60 + 35 × 12', 'dollars'), ST('A $1200 TV: $110 a month for 12 months. Extra paid?', '110 × 12 − 1200', 'dollars')]
      },
      p1: {
        show: { eq: ['extra = total − cash price'] },
        items: [ST('$30 a month for 24 months?', '30 × 24', 'dollars'), ST('$200 down, then $25 a month for 18 months?', '200 + 25 × 18', 'dollars'),
          ST('Internet: $65 a month for 24 months, plus $50 setup?', '65 × 24 + 50', 'dollars'), ST('A $900 bike: $80 a month for 12 months. Extra?', '80 × 12 − 900', 'dollars')]
      },
      p2: {
        items: [ST('Plan A: $40 a month, 24 months. Plan B: $500 phone plus $25 a month, 24 months. Difference?', '(500 + 25 × 24) − 40 × 24', 'dollars'),
          ST('A car lease: $2000 down, $350 a month for 36 months. Total?', '2000 + 350 × 36', 'dollars'),
          ST('Cancel a $50-a-month contract after 10 of 24 months: fee is 25% of what is left. Fee?', '25% of 50 × (24 − 10)', 'dollars')]
      },
      p3: {
        items: [ST('A $1800 laptop: pay now with 5% off, or $160 a month for 12 months. Savings by paying now?', '160 × 12 − 1800 × (1 − 5%)', 'dollars'),
          ST('A 36-month plan at $72 a month with HST of 13% on each payment. Total?', '72 × (1 + 13%) × 36', 'dollars', 2),
          ST('A $3600 loan repaid at $165 a month for 24 months. Interest paid?', '165 × 24 − 3600', 'dollars')]
      },
      think: {
        items: [{ q: 'What should you read before you sign a contract?', lines: { n: 3, key: 'The total cost, the length, fees for ending early, and what happens if you miss a payment.' } },
          { q: 'Why can "$0 down" cost more?', lines: { n: 2, key: 'The price is spread into payments, often with interest or fees.' } },
          ST('$48 a month for 24 months plus $75 fee?', '48 × 24 + 75', 'dollars'),
          { q: 'Give a reason to choose a contract over paying cash.', lines: { n: 2, key: 'For example you need it now and cannot save first, and the total extra is small.' } }]
      }
    }

  } });
})();
