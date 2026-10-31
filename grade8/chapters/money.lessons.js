(function () {
  var K = K8, A = Atlas, F = K.fx('money'), C = 'money', T = K.txt;
  var USD = ['US dollar', 'USD', 1.36];

  K.lessons(C, [
    { id: 'exchange', title: 'Other currencies', sub: 'Exchange rates and ways to pay.', concepts: [
      { id: 'convert', title: 'Exchange rates', exp: ['F1.1'], skill: 'mo-exchange',
        body: '<p>An <b>exchange rate</b> tells you what one unit of another currency is worth in Canadian dollars. Foreign to CAD: <b>multiply</b> by the rate. CAD to foreign: <b>divide</b>. (Rates here are examples; real rates change daily.)</p>',
        watch: K.film([
          [T(['1 USD = $1.36 CAD']), 'One US dollar is worth $1.36 Canadian.'],
          [F.exFig(40, USD), 'A 40 USD hoodie: 40 × 1.36 = $54.40 CAD.'],
          [T(['$100 CAD ÷ 1.36', '≈ 73.53 USD']), 'Going the other way, divide: $100 CAD buys about 73.53 USD.', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Convert <b>200 euros</b> with <b>no card fee</b>.', goal: function (g) { return g('exc') === 1 && g('exa') === 200 && g('exf') === 0; }, yes: '200 × 1.48 = $296.00 CAD.' },
          { do: 'Now convert <b>5 000 yen</b>.', goal: function (g) { return g('exc') === 4 && g('exa') === 50; }, yes: '5 000 × 0.0092 = $46.00 CAD. Lots of yen, not many dollars.' }] }),
        key: '<p>To CAD: <b>× rate</b>. From CAD: <b>÷ rate</b>.</p>',
        mistake: '<p>Multiplying when going from CAD to the other currency. Ask: "Should I end up with more units or fewer?"</p>',
        check: [K.chk(C, 'mo-exchange', 1), K.chk(C, 'mo-exchange', 2)] },
      { id: 'pay', title: 'Ways to pay and fees', exp: ['F1.1'], skill: 'mo-exchange', hard: true,
        body: '<p>Cash, debit, credit and prepaid cards all work abroad, but each has costs. Credit cards often add a <b>foreign transaction fee</b> of about 2.5%.</p>',
        watch: K.film([
          [T(['40 USD = $54.40']), 'The hoodie converts to $54.40.'],
          [T(['fee: 2.5% of 54.40 = $1.36']), 'The card adds 2.5%.'],
          [T(['total: $55.76']), 'You pay $55.76. Or in one step: 54.40 × 1.025.', 2600]
        ]),
        ways: [{ label: 'Compare the options', html: '<p><b>Cash:</b> no card fee, but exchange counters add a markup. <b>Debit:</b> your own money, but ATM fees. <b>Credit:</b> safe and accepted, but foreign fees and interest if unpaid. <b>Prepaid:</b> locks a rate, but loading fees.</p>' }],
        key: '<p>Convert, then add the <b>fee</b>.</p>',
        mistake: '<p>Forgetting the fee when comparing prices across the border.</p>',
        check: [K.chk(C, 'mo-exchange', 3), K.num('A 60 USD game at 1 USD = $1.36 CAD, with a 2.5% card fee. What do you pay in CAD?', 83.64, 'Convert, then multiply by 1.025.', '60 × 1.36 = 81.60. 81.60 × 1.025 = $83.64.', { unit: '$' })] }
    ] },
    { id: 'budget', title: 'Budgets that balance', sub: 'Money in, money out.', concepts: [
      { id: 'balance', title: 'Surplus, balanced, deficit', exp: ['F1.3'], skill: 'mo-budget',
        body: '<p>A <b>budget</b> plans money in (<b>income</b>) and money out (<b>expenses</b>). More in than out is a <b>surplus</b>. Equal is <b>balanced</b>. More out than in is a <b>deficit</b>.</p>',
        watch: K.film([
          [F.budgetFig(320, [['Phone', 35], ['Transit', 60], ['Food and fun', 180], ['Savings', 80]]), 'Maya earns $320 a month. Her plan adds to $355.'],
          [T(['355 − 320 = 35', 'deficit of $35']), 'She is $35 short: a deficit.'],
          [F.budgetFig(320, [['Phone', 35], ['Transit', 60], ['Food and fun', 145], ['Savings', 80]]), 'Spend $35 less on food and fun, and it balances.', 2800]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Keep the income at <b>$320</b> and make the budget <b>balance exactly</b>.', goal: function (g) { return g('bui') === 320 && 95 + g('buf') + g('bus') === 320; }, yes: 'Balanced: every dollar has a job.' },
          { do: 'Now make a <b>surplus of exactly $50</b>.', goal: function (g) { return g('bui') - (95 + g('buf') + g('bus')) === 50; }, yes: '$50 left over to save.' }] }),
        key: '<p>Income − expenses: <b>+ surplus, 0 balanced, − deficit</b>.</p>',
        mistake: '<p>Leaving savings out of the plan. Treat savings as an expense you pay to yourself.</p>',
        check: [K.chk(C, 'mo-budget', 1), K.chk(C, 'mo-budget', 2)] },
      { id: 'fixed', title: 'Fixed and variable', exp: ['F1.3'], skill: 'mo-budget',
        body: '<p><b>Fixed</b> expenses stay the same each month, like a phone plan. <b>Variable</b> expenses change, like food and fun. To fix a deficit, start with the variable ones.</p>',
        watch: K.film([
          [T(['fixed: phone $35, transit $60']), 'Fixed costs are hard to change quickly.'],
          [T(['variable: food, fun, clothes']), 'Variable costs are where you have choices.'],
          [T(['track every dollar for a month']), 'You cannot fix a budget until you know where the money goes.', 2600]
        ]),
        key: '<p>Cut <b>variable</b> costs first.</p>',
        mistake: '<p>Calling a cost fixed just because it happens often. Coffee every day is still variable.</p>',
        check: [K.chk(C, 'mo-budget', 3), K.mc('Which is a variable expense?', 'Snacks', ['Monthly phone plan', 'Bus pass', 'Music subscription'], 'Which one changes from month to month?', 'Snack spending changes; the others are set amounts.')] }
    ] },
    { id: 'tax', title: 'Tax and big goals', sub: 'HST and planning ahead.', concepts: [
      { id: 'hst', title: 'Adding HST', exp: ['F1.2'], skill: 'mo-tax',
        body: '<p>In Ontario, most purchases have <b>13% HST</b> added at the till. Multiply the price by 1.13 to get what you pay.</p>',
        watch: K.film([
          [T(['laptop: $1 200']), 'The shelf price is $1 200.'],
          [T(['HST: 1200 × 0.13 = $156']), '13% of 1200 is $156.'],
          [T(['total: 1200 × 1.13 = $1 356']), 'Or in one step: × 1.13.', 2600]
        ]),
        key: '<p>Price with HST = <b>price × 1.13</b>.</p>',
        mistake: '<p>Planning with the sticker price. In Ontario the shelf price usually does not include HST.</p>',
        check: [K.chk(C, 'mo-tax', 1), K.chk(C, 'mo-tax', 2)] },
      { id: 'goal', title: 'Saving for a goal', exp: ['F1.2', 'F1.3'], skill: 'mo-tax', hard: true,
        body: '<p>Find the total cost with tax, divide by what you can save each month, and <b>round up</b>. You cannot buy it until you have all of it.</p>',
        watch: K.film([
          [T(['$1 356 total', '$120 saved a month']), 'Sam can save $120 a month.'],
          [T(['1356 ÷ 120 = 11.3']), '11.3 months.'],
          [T(['round up: 12 months']), 'After 11 months Sam is still short, so it takes 12.', 2600]
        ]),
        ways: [{ label: 'Count up', html: '<p>After 11 months: 11 × 120 = $1 320. Not enough. After 12: $1 440. Enough.</p>' },
          { label: 'Take-home pay', html: '<p>A paycheque has deductions like income tax, so take-home pay is less than what you earn. Plan with the take-home amount.</p>' }],
        key: '<p>Months = total ÷ monthly savings, <b>rounded up</b>.</p>',
        mistake: '<p>Rounding 11.3 down to 11.</p>',
        check: [K.chk(C, 'mo-tax', 3), K.num('A $500 bike plus 13% HST. You save $60 a month. How many months until you can buy it?', 10, 'Total with tax, divide, round up.', '500 × 1.13 = 565. 565 ÷ 60 ≈ 9.4, so 10 months.')] }
    ] },
    { id: 'interest', title: 'Interest', sub: 'Money that grows, or debt that does.', concepts: [
      { id: 'simple', title: 'Simple interest', exp: ['F1.4'], skill: 'mo-interest',
        body: '<p><b>Simple interest</b> is paid on the starting amount only: I = P × r × t. P is the starting amount, r the yearly rate as a decimal, t the years.</p>',
        watch: K.film([
          [T(['$1 000 at 5% for 3 years']), 'Save $1 000 at 5% a year.'],
          [T(['I = 1000 × 0.05 × 3', '= $150']), 'Each year earns $50. Three years: $150.'],
          [T(['total: $1 150']), 'Start plus interest.', 2600]
        ]),
        key: '<p>I = <b>P × r × t</b>, with r as a decimal.</p>',
        mistake: '<p>Using 5 instead of 0.05 for the rate.</p>',
        check: [K.chk(C, 'mo-interest', 1), K.chk(C, 'mo-interest', 1)] },
      { id: 'compound', title: 'Compound interest', exp: ['F1.4'], skill: 'mo-interest', hard: true,
        body: '<p><b>Compound</b> interest is paid on the interest too. Each year, multiply by (1 + r): A = P(1 + r)<sup>t</sup>. Time makes the gap grow.</p>',
        watch: K.film([
          [T(['1000 × 1.05 = 1050']), 'Year 1: $1 050.'],
          [T(['1050 × 1.05 = 1102.50']), 'Year 2: interest on $1 050, not $1 000.'],
          [T(['1102.50 × 1.05 = 1157.63']), 'Year 3: $1 157.63, $7.63 more than simple.'],
          [F.growth(1000, 5, 30), 'Over 30 years, the compound curve pulls far ahead.', 2800]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Set <b>$1 000 at 5% for 30 years</b>. How big is the gap?', goal: function (g) { return g('inp') === 1000 && g('inr') === 5 && g('inn') === 30; }, yes: 'Compound gives about $4 322, simple $2 500.' },
          { do: 'Keep 10 years. Find a rate that about <b>doubles</b> the money.', goal: function (g) { var x = Math.pow(1 + g('inr') / 100, g('inn')); return g('inn') === 10 && x > 1.9 && x < 2.2; }, yes: 'About 7%: 72 ÷ 7 ≈ 10 years to double.' }] }),
        ways: [{ label: 'Rule of 72', html: '<p>72 ÷ rate ≈ years to double. At 6%, money doubles in about 12 years.</p>' },
          { label: 'Debt compounds too', html: '<p>An unpaid credit card balance at 20% grows the same way, against you.</p>' }],
        key: '<p>Compound: <b>× (1 + r) every year</b>.</p>',
        mistake: '<p>Multiplying by r instead of (1 + r), which gives only the interest, not the new total.</p>',
        check: [K.chk(C, 'mo-interest', 2), K.chk(C, 'mo-interest', 3)] }
    ] },
    { id: 'value', title: 'Getting good value', sub: 'The cheapest price is not always the best deal.', concepts: [
      { id: 'unit', title: 'Unit price', exp: ['F1.5'], skill: 'mo-value',
        body: '<p>Compare the <b>unit price</b>: the cost for the same amount, like per 100 g or per litre.</p>',
        watch: K.film([
          [T(['400 g for $4.80', '750 g for $7.13']), 'Which cereal is better value?'],
          [T(['4.80 ÷ 4 = $1.20 per 100 g', '7.13 ÷ 7.5 ≈ $0.95 per 100 g']), 'Price per 100 g for each box.'],
          [F.compare(['Small', 1.2, '$1.20 per 100 g'], ['Large', 0.95, '$0.95 per 100 g'], 'The large box costs less per 100 grams.'), 'The large box wins, if you will eat it all.', 2600]
        ]),
        key: '<p>Compare <b>price per same amount</b>.</p>',
        mistake: '<p>Choosing the lower sticker price without checking the size.</p>',
        check: [K.chk(C, 'mo-value', 1), K.chk(C, 'mo-value', 2)] },
      { id: 'deals', title: 'Sales, deals and points', exp: ['F1.5'], skill: 'mo-value',
        body: '<p>Sales, multi-buy deals, coupons and loyalty points can all save money, but only on things you were going to buy anyway.</p>',
        watch: K.film([
          [T(['buy 2, get 1 free', '$3 each']), '3 items for $6: $2 each.'],
          [T(['25% off $3', '= $2.25 each']), 'A 25% sale on one item: $2.25.'],
          [T(['need only 1?', 'the sale wins']), 'If you only need one, the multi-buy costs you more.', 2600]
        ]),
        key: '<p>A deal saves only on <b>things you need</b>.</p>',
        mistake: '<p>Buying extra because it is on sale. Spending less is the real saving.</p>',
        check: [K.chk(C, 'mo-value', 3), K.mc('Juice is $4 a bottle, or "buy 3 for $10". You need 2 bottles. What is cheapest?', 'Buy 2 for $8', ['Buy 3 for $10'], 'Compare what you actually pay for what you need.', '2 bottles cost $8, less than $10.')] }
    ] },
    { id: 'credit', title: 'Credit and contracts', sub: 'Borrowing costs, and the total price.', concepts: [
      { id: 'card', title: 'How credit cards work', exp: ['F1.6'], skill: 'mo-credit', hard: true,
        body: '<p>A credit card lets you borrow to pay. Pay the full balance by the due date and there is no interest. If not, interest is charged, often about 20% a year. Compare the rate, the annual fee and the rewards.</p>',
        watch: K.film([
          [T(['Card A: no fee, 0.5% back', 'Card B: $120 fee, 2% back']), 'Two cards. Which is better for $8 000 of spending a year?'],
          [T(['A: 8000 × 0.005 = $40', 'B: 8000 × 0.02 − 120 = $40']), 'They tie at $8 000.'],
          [F.cardFig(), 'Spend more and B wins; spend less and A wins.', 2800]
        ]),
        ways: [{ label: 'Carrying a balance', html: '<p>$1 000 left unpaid at 20% a year costs about $200 a year in interest. That wipes out any cash back.</p>' }],
        key: '<p>Pay in full: <b>no interest</b>. Then compare <b>fee vs rewards</b>.</p>',
        mistake: '<p>Choosing a card for its rewards while carrying a balance. The interest costs far more than the rewards.</p>',
        check: [K.chk(C, 'mo-credit', 1), K.chk(C, 'mo-credit', 2)] },
      { id: 'contract', title: 'The total cost of a contract', exp: ['F1.6'], skill: 'mo-credit',
        body: '<p>For any contract, find the <b>total cost</b> over the whole term: monthly cost × months, plus any up-front or end cost.</p>',
        watch: K.film([
          [T(['Plan A: $45 × 24, free phone', 'Plan B: $30 × 24 + $400']), 'Two phone plans for 24 months.'],
          [T(['A: 45 × 24 = $1 080', 'B: 720 + 400 = $1 120']), 'Add up each one.'],
          [T(['Plan A is $40 cheaper']), 'The lower monthly price was the more expensive plan.', 2600]
        ]),
        key: '<p>Total = <b>monthly × months + extras</b>.</p>',
        mistake: '<p>Comparing only the monthly price.</p>',
        check: [K.chk(C, 'mo-credit', 3), K.num('A gym costs $25 a month for 12 months plus a $50 sign-up fee. What is the total for the year?', 350, 'Monthly × 12, plus the fee.', '25 × 12 = 300. 300 + 50 = $350.', { unit: '$' })] }
    ] }
  ]);
})();