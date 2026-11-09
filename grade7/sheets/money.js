/* Grade 7 Money and Finance: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/money.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random, so a sheet
   always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: F1.1 exchange rates and converting currencies; F1.2 reliable sources of financial information; F1.3 a
   budget plan and how long to reach a goal; F1.4 what influences a financial decision; F1.5 simple and compound
   interest; F1.6 compare savings accounts and loans by interest and fees. Rates used: 1 USD = $1.38 CAD, 1 EUR = $1.50
   CAD, 1 GBP = $1.75 CAD (examples only; real rates change every day). The answer checks are in tests/verify/sheets.js:
   every sum is worked out again, a story's numbers must be in the question, and weeks to a goal are rounded up. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function rd(x) { return Math.round(x * 100) / 100; }
  function M(x) { return x.toFixed(2); }
  var RATE = { USD: 1.38, EUR: 1.5, GBP: 1.75 }, RS = { USD: '1.38', EUR: '1.50', GBP: '1.75' };
  /* to Canadian dollars: multiply by the rate; from Canadian dollars: divide by it */
  function TO(n, c) { return { q: n + ' ' + c + ' in CAD (1 ' + c + ' = $' + RS[c] + ')', eq: [n + ' × ' + RS[c] + ' = $ []'], a: [rd(n * RATE[c])] }; }
  function FROM(n, c) { return { q: '$' + n + ' CAD in ' + c + ' (1 ' + c + ' = $' + RS[c] + ')', eq: [n + ' ÷ ' + RS[c] + ' = [] ' + c], a: [rd(n / RATE[c])] }; }
  /* simple interest: I = P × r × t */
  function SI(p, r, t) { return { q: '$' + p + ' at ' + r + '% for ' + t + ' year' + (t > 1 ? 's' : ''), eq: [p + ' × ' + (r / 100) + ' × ' + t + ' = $ []'], a: [rd(p * r / 100 * t)], wide: true }; }
  /* compound interest, one year at a time */
  function CI(p, r, years) {
    var rows = [], a = [], v = p, f = String(1 + r / 100);
    for (var i = 0; i < years; i++) { rows.push((i ? '[]' : p) + ' × ' + f + ' = []'); if (i) a.push(rd(v)); v = rd(v * (1 + r / 100)); a.push(v); }
    return { q: '$' + p + ' at ' + r + '% a year, compounded', eq: rows, a: a, wide: true };
  }
  /* weeks to save for a goal: divide, then round up */
  function WK(goal, per) { return { q: 'Goal $' + goal + ', saving $' + per + ' a week. How many weeks?', eq: [goal + ' ÷ ' + per + ' = []', '[] weeks'], a: [goal / per, Math.ceil(goal / per - 1e-9)], up: goal + ' ÷ ' + per }; }
  function story(q, unit, ans, calc, more) { var it = { q: q, eq: [unit === '$' ? '$ []' : '[] ' + unit], a: [ans], calc: calc, wide: true }; return more ? Object.assign(it, more) : it; }

  S.register('money', { code: 'MO', ideas: {

    tocad: {
      watch: 'dividing when converting to Canadian dollars. One US dollar is worth more than one Canadian dollar, so the Canadian amount should be bigger.',
      goal: 'I can change other money to Canadian dollars.',
      learn: {
        show: { cap: '50 USD, at 1 USD = $1.38 CAD', eq: ['50 × 1.38 = $69.00'] },
        together: [TO(20, 'USD'), TO(40, 'EUR')],
        cue: 'To Canadian dollars: multiply by the rate.',
        own: [TO(100, 'GBP'), TO(15, 'USD'), TO(60, 'EUR')]
      },
      p1: {
        show: { eq: ['10 EUR × 1.50 = $15.00 CAD'] },
        items: [TO(10, 'USD'), TO(25, 'USD'), TO(8, 'EUR'), TO(30, 'EUR'), TO(4, 'GBP'), TO(12, 'GBP')]
      },
      p2: {
        items: [TO(250, 'USD'), TO(75, 'EUR'), TO(36, 'GBP'), TO(1000, 'USD'),
          { q: 'Which costs more: a 40 USD jacket or a 35 EUR jacket? (1 USD = $1.38, 1 EUR = $1.50)', pick: { opts: ['40 USD', '35 EUR'], ans: 0, more: ['40 × 1.38', '35 × 1.50'] }, wide: true }]
      },
      p3: {
        items: [story('{a} buys a 120 USD bike in the USA. 1 USD = $1.38 CAD. What is that in Canadian dollars?', '$', 165.6, '120 × 1.38'),
          story('A hotel in London costs 90 GBP a night for 3 nights. 1 GBP = $1.75 CAD. Total in Canadian dollars?', '$', 472.5, '90 × 3 × 1.75'),
          story('A museum ticket in Paris is 18 EUR. 1 EUR = $1.50 CAD. In Canadian dollars?', '$', 27, '18 × 1.50')]
      },
      think: {
        items: [{ q: '{b} changed 50 USD to CAD by dividing: 50 ÷ 1.38. What went wrong?', lines: { n: 3, key: '1 USD is worth more than $1 CAD, so the Canadian amount must be bigger: 50 × 1.38 = $69.' } },
          { q: 'Why do exchange rates change from day to day?', lines: { n: 2, key: 'They depend on trade, the economy and how much people want each currency.' } },
          TO(200, 'EUR')]
      }
    },

    fromcad: {
      watch: 'multiplying both ways. Ask: is each foreign unit worth more than a Canadian dollar? Then you get fewer of them.',
      goal: 'I can change Canadian dollars to other money.',
      learn: {
        show: { cap: '$150 CAD, at 1 EUR = $1.50 CAD', eq: ['150 ÷ 1.50 = 100 EUR'] },
        together: [FROM(69, 'USD'), FROM(30, 'EUR')],
        cue: 'From Canadian dollars: divide by the rate.',
        own: [FROM(175, 'GBP'), FROM(138, 'USD'), FROM(45, 'EUR')]
      },
      p1: {
        show: { eq: ['$35 CAD ÷ 1.75 = 20 GBP'] },
        items: [FROM(27.6, 'USD'), FROM(60, 'EUR'), FROM(70, 'GBP'), FROM(276, 'USD'), FROM(300, 'EUR'), FROM(14, 'GBP')]
      },
      p2: {
        items: [FROM(690, 'USD'), FROM(150, 'EUR'), FROM(87.5, 'GBP'), FROM(1500, 'EUR'), FROM(1380, 'USD'), FROM(350, 'GBP')]
      },
      p3: {
        items: [story('{a} takes $690 CAD on a trip to the USA. 1 USD = $1.38 CAD. How many US dollars?', 'USD', 500, '690 ÷ 1.38'),
          story('{b} has $210 CAD for a trip to France. 1 EUR = $1.50 CAD. How many euros?', 'EUR', 140, '210 ÷ 1.50'),
          story('A trip to England costs $2 100 CAD. 1 GBP = $1.75 CAD. How many pounds?', 'GBP', 1200, '2100 ÷ 1.75')]
      },
      think: {
        items: [{ q: '{a} changed $150 CAD to euros by multiplying: 150 × 1.50 = 225 EUR. What went wrong?', lines: { n: 3, key: 'A euro is worth more than a Canadian dollar, so you get fewer euros: 150 ÷ 1.50 = 100 EUR.' } },
          { q: 'How can you check a conversion?', lines: { n: 2, key: 'Convert back: 100 EUR × 1.50 = $150 CAD.' } },
          FROM(345, 'USD')]
      }
    },

    banks: {
      watch: 'choosing the lower rate without adding the fee. Compare the totals.',
      goal: 'I can compare exchange rates and fees.',
      learn: {
        show: { cap: '100 USD at $1.38 + $5 fee', eq: ['100 × 1.38 + 5 = $143.00'] },
        together: [{ q: '200 USD: rate $1.40, fee $2', eq: ['200 × 1.40 + 2 = $ []'], a: [282] }, { q: '200 USD: rate $1.38, fee $8', eq: ['200 × 1.38 + 8 = $ []'], a: [284] }],
        cue: 'Total = amount × rate + fees.',
        own: [{ q: '100 EUR: rate $1.52, no fee', eq: ['100 × 1.52 = $ []'], a: [152] }, { q: '100 EUR: rate $1.48, fee $3', eq: ['100 × 1.48 + 3 = $ []'], a: [151] }]
      },
      p1: {
        show: { cap: 'the better deal', eq: ['the lower total'] },
        items: [{ q: '50 USD: rate $1.40, fee $3', eq: ['50 × 1.40 + 3 = $ []'], a: [73] }, { q: '50 USD: rate $1.38, fee $5', eq: ['50 × 1.38 + 5 = $ []'], a: [74] },
          { q: '300 EUR: rate $1.52, fee $0', eq: ['300 × 1.52 + 0 = $ []'], a: [456] }, { q: '300 EUR: rate $1.50, fee $4.50', eq: ['300 × 1.50 + 4.50 = $ []'], a: [454.5], wide: true }]
      },
      p2: {
        items: [{ q: 'Buying 400 USD. Bank A: $1.37 + $10 fee. Bank B: $1.40, no fee. Which costs less?', pick: { opts: ['Bank A', 'Bank B'], ans: 0, less: ['400 × 1.37 + 10', '400 × 1.40'] }, wide: true },
          { q: 'Buying 50 USD. Bank A: $1.37 + $10 fee. Bank B: $1.40, no fee. Which costs less?', pick: { opts: ['Bank A', 'Bank B'], ans: 1, less: ['50 × 1.37 + 10', '50 × 1.40'] }, wide: true },
          { q: 'Buying 200 GBP. Kiosk: $1.80, no fee. Bank: $1.75 + $6 fee. Which costs less?', pick: { opts: ['Kiosk', 'Bank'], ans: 1, less: ['200 × 1.80', '200 × 1.75 + 6'] }, wide: true }]
      },
      p3: {
        items: [story('An airport kiosk sells 100 EUR at $1.60 each plus a $7 fee. A bank sells them at $1.50 each with no fee. How much do you save at the bank?', '$', 17, '100 × 1.60 + 7 − 100 × 1.50'),
          { q: 'Why can a fee matter more for a small amount than a big one?', lines: { n: 3, key: 'A fixed fee is a bigger share of a small amount. For a big amount, the rate matters more.' } }]
      },
      think: {
        items: [{ q: '{b} picked the bank with the lowest rate but paid more. How?', lines: { n: 3, key: 'That bank charged a fee. Rate × amount + fee was bigger than at the other bank.' } },
          { q: 'Where can you find exchange rates you can trust?', lines: { n: 2, key: 'The Bank of Canada website or your own bank, and compare more than one.' } }]
      }
    },

    plan: {
      watch: 'using income instead of savings to count weeks. Only what is saved goes toward the goal.',
      goal: 'I can make a budget: income, expenses and savings.',
      learn: {
        show: { cap: 'a week: earn $60, spend $35', eq: ['savings = 60 − 35 = $25'] },
        together: [{ q: 'Earn $80, spend $45.', eq: ['80 − 45 = $ []'], a: [35] }, { q: 'Earn $120, spend $30 + $25 + $15.', eq: ['120 − 30 − 25 − 15 = $ []'], a: [50], wide: true }],
        cue: 'Savings = income − expenses.',
        own: [{ q: 'Earn $55, spend $20 + $12.', eq: ['55 − 20 − 12 = $ []'], a: [23] }, { q: 'Earn $200, spend $75 + $40.', eq: ['200 − 75 − 40 = $ []'], a: [85] }]
      },
      p1: {
        show: { eq: ['income − expenses = savings'] },
        items: [{ q: 'Earn $40, spend $15.', eq: ['40 − 15 = $ []'], a: [25] }, { q: 'Earn $95, spend $60.', eq: ['95 − 60 = $ []'], a: [35] },
          { q: 'Earn $150, spend $48 + $27.', eq: ['150 − 48 − 27 = $ []'], a: [75] }, { q: 'Earn $72.50, spend $18.25.', eq: ['72.50 − 18.25 = $ []'], a: [54.25] }]
      },
      p2: {
        items: [story('{a} babysits 4 hours a week at $15 an hour and spends $22 on a phone plan. How much is saved each week?', '$', 38, '4 × 15 − 22'),
          story('{b} earns $12 a week in allowance and $25 for cutting grass. Spending is $18. How much is saved?', '$', 19, '12 + 25 − 18'),
          story('A family earns $5 200 a month. Rent $1 800, food $900, other $1 650. How much is saved?', '$', 850, '5200 − 1800 − 900 − 1650')]
      },
      p3: {
        items: [{ q: 'Plan a monthly budget for $100: needs, wants and savings. Show the amounts.', draw: { h: 150, key: 'For example: needs $50, wants $30, savings $20. The three must add to $100.' }, wide: true },
          { q: 'Why plan to save first, before spending?', lines: { n: 2, key: 'So savings do not get left to whatever is left over.' } }]
      },
      think: {
        items: [{ q: '{a} earns $60 a week and saves $25. {a} says $180 takes 3 weeks. What went wrong?', lines: { n: 3, key: 'Only the $25 saved counts: 180 ÷ 25 = 7.2, so 8 weeks.' } },
          { q: 'Name a need and a want in a budget.', lines: { n: 2, key: 'For example, a need: a bus pass. A want: a video game.' } }]
      }
    },

    goal: {
      watch: 'rounding 7.5 weeks down to 7. After 7 weeks the money is still short, so round up.',
      goal: 'I can work out how long it takes to reach a savings goal.',
      learn: {
        show: { cap: '$180 goal, $24 a week', eq: ['180 ÷ 24 = 7.5', '8 weeks'] },
        together: [WK(150, 20), WK(96, 12)],
        cue: 'Needed ÷ saved per week, then round up.',
        own: [WK(200, 32), WK(64, 8)]
      },
      p1: {
        show: { eq: ['5.2 weeks → 6 weeks'] },
        items: [WK(120, 15), WK(250, 40), WK(90, 25), WK(300, 40)]
      },
      p2: {
        items: [WK(480, 64), WK(75, 8), WK(1000, 80),
          story('{a} has $40 and wants a $220 bike. {a} saves $25 a week. How many weeks?', 'weeks', 8, '(220 − 40) ÷ 25', { up: '(220 − 40) ÷ 25', calc: null })]
      },
      p3: {
        items: [story('{b} wants $360 for a trip. {b} has $60 and saves $35 a week. How many weeks?', 'weeks', 9, '(360 − 60) ÷ 35', { up: '(360 − 60) ÷ 35', calc: null }),
          story('To reach $500 in 10 weeks, how much must be saved each week?', '$', 50, '500 ÷ 10'),
          story('{a} saves $18 a week. After 12 weeks, how much is saved?', '$', 216, '18 × 12')]
      },
      think: {
        items: [{ q: '{b} found 180 ÷ 24 = 7.5 and said 7 weeks. What went wrong?', lines: { n: 3, key: 'After 7 weeks only $168 is saved. Round up: 8 weeks.' } },
          { q: 'Name two ways to reach a goal sooner.', lines: { n: 2, key: 'Save more each week, or spend less, or earn more.' } }]
      }
    },

    sources: {
      watch: 'trusting one review or ad. Look for at least two sources that agree.',
      goal: 'I can judge if a source of money information is reliable.',
      learn: {
        show: { cap: 'ask: who wrote it? can I check it? are they selling?' },
        together: [{ q: 'A bank website lists its account fees. Is this a good source for the fees? Why?', lines: { n: 2, key: 'Yes, for its own fees. It is the bank\'s official information, but compare other banks too.' } },
          { q: 'An ad says "Best savings rate in Canada!" What should you check?', lines: { n: 2, key: 'Compare rates from other banks or a government site.' } }],
        cue: 'Check it, compare it, and ask who gains.',
        own: [{ q: 'A friend says a game is a great deal. How can you check?', lines: { n: 2, key: 'Look up the price in other stores and read reviews from more than one place.' } },
          { q: 'Which is more reliable: one online comment or a government website? Why?', lines: { n: 2, key: 'The government website: it is official and can be checked.' } }]
      },
      p1: {
        show: { eq: ['two sources that agree'] },
        items: [{ q: 'Name two reliable places to find the interest rate of a savings account.', lines: { n: 2, key: 'The bank\'s own website and a comparison from the Financial Consumer Agency of Canada.' } },
          { q: 'A video says "Double your money in a week!" Is it reliable? Why?', lines: { n: 2, key: 'No. It promises too much and is likely selling something.' } },
          { q: 'Why should you check the date on financial information?', lines: { n: 2, key: 'Rates and prices change. Old information may be wrong now.' } }]
      },
      p2: {
        items: [{ q: 'Three stores sell the same headphones: $79, $85 and $129. One site says $129 is "a steal". What do you think?', lines: { n: 3, key: 'It is not a deal: two other stores sell it for less. That site may be trying to sell.' } },
          { q: 'How much more is $129 than the lowest price?', eq: ['129 − 79 = $ []'], a: [50] }]
      },
      p3: {
        items: [{ q: 'Make a checklist of 3 questions to ask about any money information.', lines: { n: 3, key: 'Who wrote it? Can I check it in another place? Are they trying to sell me something?' } }]
      },
      think: {
        items: [{ q: '{a} bought something because of one five-star review. What should {a} do next time?', lines: { n: 3, key: 'Read several reviews from different places and compare prices before buying.' } },
          { q: 'Why might an ad leave out the fees?', lines: { n: 2, key: 'To make the deal look better than it is.' } }]
      }
    },

    influence: {
      watch: 'seeing advertising or friends as the reason to buy, not as influences to notice.',
      goal: 'I can name what influences a money choice.',
      learn: {
        show: { cap: 'Do I need it? Can I afford it? Is there a better price or time?' },
        together: [{ q: 'Name one personal influence and one from society on buying a phone.', lines: { n: 2, key: 'Personal: what I need it for, my savings. Society: ads, what friends have.' } },
          { q: 'A $60 game is 25% off this week only. What is the sale price?', eq: ['60 − 60 × 25% = $ []'], a: [45] }],
        cue: 'Notice the influence. Then decide.',
        own: [{ q: 'How might a "limited time" sign change a choice?', lines: { n: 2, key: 'It rushes people, so they may buy without thinking it through.' } },
          { q: 'A $90 jacket is 30% off. Sale price?', eq: ['90 − 90 × 30% = $ []'], a: [63] }]
      },
      p1: {
        show: { cap: 'influences: needs, values, friends, ads, prices, the economy' },
        items: [{ q: 'How can friends influence what you spend?', lines: { n: 2, key: 'Wanting what they have, or splitting costs on outings.' } },
          { q: 'How can your values influence a choice?', lines: { n: 2, key: 'Choosing a used or local item to help the environment or community, even if it costs more.' } },
          { q: 'A bundle is $45 for 3 items. Each item alone is $14. Which is cheaper?', pick: { opts: ['bundle', 'separately'], ans: 1, less: ['45', '3 × 14'] }, wide: true }]
      },
      p2: {
        items: [{ q: 'Prices go up 4% this year. A $250 bike now costs how much?', eq: ['250 + 250 × 4% = $ []'], a: [260] },
          { q: 'How can rising prices change what a family buys?', lines: { n: 2, key: 'They may buy less, wait for sales, or choose cheaper brands.' } },
          { q: 'Ad: "Only 3 left!" How does this influence buyers?', lines: { n: 2, key: 'It makes people fear missing out, so they buy fast.' } }]
      },
      p3: {
        items: [{ q: '{a} wants $200 sneakers because a famous athlete wears them. Write two questions {a} should ask first.', lines: { n: 3, key: 'Do I need them? Can I afford them? Are there similar shoes for less?' } },
          { q: 'A $200 pair is 15% off. A similar pair is $150. Which costs less?', pick: { opts: ['$200 pair on sale', '$150 pair'], ans: 1, less: ['200 − 200 × 15%', '150'] }, wide: true }]
      },
      think: {
        items: [{ q: 'Describe a time an ad or a friend influenced something you wanted.', lines: { n: 3, key: 'Answers will vary: name the influence and whether the choice was a good one.' } },
          { q: 'Why is it smart to wait a day before a big purchase?', lines: { n: 2, key: 'It gives time to compare and check if it is a need or a want.' } }]
      }
    },

    simple: {
      watch: 'using 3 instead of 0.03 for the rate, which gives a huge answer. Write the rate as a decimal.',
      goal: 'I can work out simple interest.',
      learn: {
        show: { cap: '$800 at 3% for 2 years', eq: ['I = 800 × 0.03 × 2 = $48'] },
        together: [SI(500, 4, 1), SI(1000, 2, 3)],
        cue: 'I = P × r × t, rate as a decimal.',
        own: [SI(200, 5, 2), SI(1500, 3, 4)]
      },
      p1: {
        show: { eq: ['4% = 0.04', '0.5% = 0.005'] },
        items: [SI(100, 6, 1), SI(400, 5, 3), SI(2000, 1, 5), SI(750, 4, 2)]
      },
      p2: {
        items: [SI(1200, 2.5, 2), SI(5000, 3.5, 1), SI(600, 4, 6),
          story('{a} puts $300 in a savings account at 2% simple interest for 4 years. How much interest?', '$', 24, '300 × 2% × 4')]
      },
      p3: {
        items: [story('{b} borrows $2 000 at 6% simple interest for 3 years. How much is paid back in all?', '$', 2360, '2000 + 2000 × 6% × 3'),
          story('$800 earns $64 simple interest in 2 years. What is the yearly rate as a decimal?', '', 0.04, '64 ÷ 800 ÷ 2'),
          story('$1 000 at 5% simple interest. How many years to earn $150?', 'years', 3, '150 ÷ (1000 × 5%)')]
      },
      think: {
        items: [{ q: '{b} found the interest on $800 at 3% for 1 year as 800 × 3 = $2 400. What went wrong?', lines: { n: 3, key: '3% is 0.03. 800 × 0.03 = $24. Ask: does $2 400 make sense on $800?' } },
          { q: 'Does simple interest earn interest on interest?', lines: { n: 2, key: 'No. It is always worked out on the starting amount.' } }]
      }
    },

    compound: {
      watch: 'thinking a high rate is always good. It depends on whether you are saving or borrowing.',
      goal: 'I can see how compound interest grows.',
      learn: {
        show: { cap: '$1000 at 5% a year', eq: ['1000 × 1.05 = 1050', '1050 × 1.05 = 1102.50'] },
        together: [CI(1000, 10, 2)],
        cue: 'Each year: multiply the new total.',
        own: [CI(500, 4, 2)]
      },
      p1: {
        show: { cap: 'compound: interest on interest', eq: ['1000 × 1.05 × 1.05'] },
        items: [CI(200, 10, 3), CI(2000, 3, 2), CI(500, 10, 2), CI(1000, 5, 2)]
      },
      p2: {
        items: [CI(1000, 6, 2), { q: '$1000 at 6% simple interest for 2 years. Total?', eq: ['1000 + 1000 × 0.06 × 2 = $ []'], a: [1120], wide: true },
          { q: 'Which earns more on $1000 after 2 years at 6% (compound: × 1.06 each year)?', pick: { opts: ['simple', 'compound'], ans: 1, more: ['1000 + 1000 × 6% × 2', '1000 × 1.06 × 1.06'] }, wide: true }]
      },
      p3: {
        items: [{ q: 'A $500 debt grows at 20% a year, compounded. What is owed after 2 years?', eq: ['500 × 1.2 = []', '[] × 1.2 = []'], a: [600, 600, 720], wide: true },
          { q: 'Why is it wise to start saving early, and to pay off debt quickly?', lines: { n: 3, key: 'Compound interest grows faster over time: savings grow more, and debt grows more.' } }]
      },
      think: {
        items: [{ q: '{a} says a 20% rate is great. When is it good and when is it bad?', lines: { n: 3, key: 'Good when saving (you earn it). Bad when borrowing (you pay it).' } },
          { q: 'Why does compound interest grow faster than simple interest?', lines: { n: 2, key: 'Each year the interest is added, so next year earns interest on a bigger amount.' } }]
      }
    },

    accounts: {
      watch: 'choosing by rate alone and forgetting monthly fees.',
      goal: 'I can compare savings accounts.',
      learn: {
        show: { cap: '$1000 for a year, 3% interest, $2 a month fee', eq: ['30 − 24 = $6 gain'] },
        together: [{ q: '$2000 at 2%, no fee', eq: ['2000 × 0.02 = $ []'], a: [40] }, { q: '$2000 at 3%, $3 a month fee', eq: ['2000 × 0.03 − 12 × 3 = $ []'], a: [24], wide: true }],
        cue: 'Gain = interest − fees.',
        own: [{ q: '$500 at 4%, $1 a month fee', eq: ['500 × 0.04 − 12 × 1 = $ []'], a: [8], wide: true }, { q: '$500 at 1.5%, no fee', eq: ['500 × 0.015 = $ []'], a: [7.5] }]
      },
      p1: {
        show: { cap: 'fees for a year', eq: ['12 × the monthly fee'] },
        items: [{ q: '$1000 at 2.5%, no fee', eq: ['1000 × 0.025 = $ []'], a: [25] }, { q: '$1000 at 4%, $1.50 a month', eq: ['1000 × 0.04 − 12 × 1.50 = $ []'], a: [22], wide: true },
          { q: 'For $1000 over 12 months: 2.5% with no fee, or 4% with $1.50 a month?', pick: { opts: ['2.5%, no fee', '4%, $1.50 a month'], ans: 0, more: ['1000 × 2.5%', '1000 × 4% − 12 × 1.50'] }, wide: true }]
      },
      p2: {
        items: [{ q: 'For $5000 over 12 months: A is 2.5% with no fee; B is 4% with $1.50 a month. Which gains more?', pick: { opts: ['A', 'B'], ans: 1, more: ['5000 × 2.5%', '5000 × 4% − 12 × 1.50'] }, wide: true },
          { q: 'B for $5000:', eq: ['5000 × 0.04 − 12 × 1.50 = $ []'], a: [182], wide: true },
          { q: 'Why can the better account change with the amount saved?', lines: { n: 2, key: 'The fee stays the same, but interest grows with the amount. For big amounts the rate matters more.' } }]
      },
      p3: {
        items: [{ q: 'Name two other things to compare in a savings account.', lines: { n: 2, key: 'Minimum balance, how many free withdrawals, whether it is insured (CDIC), online access.' } },
          story('An account pays 3% a year with a $4 monthly fee. What is the gain on $3 000 for a year (12 months)?', '$', 42, '3000 × 3% − 12 × 4', { know: [] })]
      },
      think: {
        items: [{ q: '{b} chose the account with the highest rate and lost money. How?', lines: { n: 3, key: 'Its fees were more than the interest on a small balance.' } },
          { q: 'Why do banks charge fees?', lines: { n: 2, key: 'To pay for services such as tellers, cards and machines.' } }]
      }
    },

    loans: {
      watch: 'picking the lower rate without adding the fee. For a loan, pick the least you pay in all.',
      goal: 'I can compare the cost of loans.',
      learn: {
        show: { cap: 'borrow $1000 for 1 year at 8% + $25 fee', eq: ['80 + 25 = $105 cost'] },
        together: [{ q: '$2000 for 1 year at 6%, $50 fee', eq: ['2000 × 0.06 + 50 = $ []'], a: [170], wide: true }, { q: '$2000 for 1 year at 9%, no fee', eq: ['2000 × 0.09 = $ []'], a: [180] }],
        cue: 'Cost = interest + fees.',
        own: [{ q: '$500 for 2 years at 5%, $20 fee', eq: ['500 × 0.05 × 2 + 20 = $ []'], a: [70], wide: true }, { q: '$500 for 2 years at 7%, no fee', eq: ['500 × 0.07 × 2 = $ []'], a: [70], wide: true }]
      },
      p1: {
        show: { cap: 'cost of a loan', eq: ['interest + fees'] },
        items: [{ q: '$1500 for 1 year at 10%, no fee', eq: ['1500 × 0.10 = $ []'], a: [150] }, { q: '$1500 for 1 year at 7%, $30 fee', eq: ['1500 × 0.07 + 30 = $ []'], a: [135], wide: true },
          { q: 'Borrow $1500 for 1 year: 10% with no fee, or 7% with a $30 fee?', pick: { opts: ['10%, no fee', '7%, $30 fee'], ans: 1, less: ['1500 × 10%', '1500 × 7% + 30'] }, wide: true }]
      },
      p2: {
        items: [{ q: 'Borrow $400 for 1 year. A: 12%, no fee. B: 8% + $20 fee. Which costs less?', pick: { opts: ['A', 'B'], ans: 0, less: ['400 × 12%', '400 × 8% + 20'] }, wide: true },
          story('A credit card charges 20% a year. {a} owes $600 for a year. How much interest?', '$', 120, '600 × 20%'),
          story('A phone costs $900. A plan charges $40 a month for 24 months instead. How much more is the plan?', '$', 60, '40 × 24 − 900')]
      },
      p3: {
        items: [{ q: 'Why is it costly to pay only the minimum on a credit card?', lines: { n: 3, key: 'Interest keeps adding to what is owed, often at a high rate, so the debt lasts longer and costs more.' } },
          story('A $1 200 loan at 5% simple interest for 3 years has a $40 fee. What is the total cost?', '$', 220, '1200 × 5% × 3 + 40')]
      },
      think: {
        items: [{ q: '{b} picked the loan with the lower rate but paid more. How?', lines: { n: 3, key: 'The fee made its total cost higher. Add interest and fees before choosing.' } },
          { q: 'When can borrowing be a good choice?', lines: { n: 2, key: 'For something important you can pay back, like education, at a low cost.' } }]
      }
    }
  } });
})();
