(function () {
  var K = K8, A = Atlas, F = K.fx('percent-ratio'), C = 'percent-ratio', T = K.txt;

  K.lessons(C, [
    { id: 'pct', title: 'Percents beyond 0 to 100', sub: 'More than a whole, less than one square.', concepts: [
      { id: 'over', title: 'More than 100%', exp: ['B1.4'], skill: 'pr-convert',
        body: '<p><b>Percent</b> means "out of 100". One full grid of 100 squares is 100%, the whole. More than one grid is more than 100%. 135% = 1.35.</p>',
        watch: K.film([
          [F.grids(100), 'One full grid: 100%. That is 1 whole.'],
          [F.grids(135), '135%: one full grid and 35 more squares. As a decimal: 1.35.'],
          [F.grids(250), '250%: two and a half grids. 2.5 times the whole.', 2600]
        ]),
        example: K.film([
          [F.grids(140), 'My turn. I will write 140% as a decimal. First I picture it: one full grid and 40 more squares.'],
          [T(['140% = 140 ÷ 100']), 'Percent means out of 100, so I divide by 100.'],
          [T(['= 1.4']), '140 ÷ 100 = 1.4. That is 1 whole and 4 tenths.'],
          [T(['1.4 > 1 ✓']), 'I check: 140% is more than one full grid, and 1.4 is more than 1. <b>100% is one whole.</b>', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Show <b>250%</b> on the grids.', goal: function (g) { return g('pgv') === 250; }, yes: '250% = 2.5: two and a half wholes.' },
          { do: 'Show the percent that equals the decimal <b>1.8</b>.', goal: function (g) { return g('pgv') === 180; }, yes: '1.8 = 180%.' }] }),
        key: '<p>100% is <b>one whole</b>. Percent ÷ 100 = decimal.</p>',
        mistake: '<p>Thinking nothing can be more than 100%. A price can rise 150%; a plant can grow to 300% of its height.</p>',
        check: [K.chk(C, 'pr-convert', 1), K.mc('Write 175% as a decimal.', '1.75', ['17.5', '0.175', '175'], 'Percent means divide by 100.', '175 ÷ 100 = 1.75.')] },
      { id: 'under', title: 'Less than 1%', exp: ['B1.4'], skill: 'pr-convert', hard: true,
        body: '<p>Less than 1% is a part of <b>one square</b> of the grid. 0.4% = 0.004. Divide by 100: the digits move 2 places right.</p>',
        watch: K.film([
          [F.grids(1), '1%: one square out of 100. 0.01.'],
          [F.grids(0.4), '0.4%: just 4 tenths of one square. 0.004.'],
          [T(['0.4% = 0.4 ÷ 100', '= 0.004 = 1/250']), 'As a fraction: 4/1000 = 1/250.', 2600]
        ]),
        example: K.film([
          [F.grids(0.6), 'My turn. I will write 0.6% as a decimal and as a fraction. It is less than one square out of 100.'],
          [T(['0.6% = 0.6 ÷ 100']), 'First I divide by 100: I move the decimal point two places left.'],
          [T(['= 0.006']), '0.6 ÷ 100 = 0.006. Six thousandths.'],
          [T(['0.006 = 6/1000', '= 3/500']), 'As a fraction it is 6/1000. I simplify by dividing top and bottom by 2: 3/500.'],
          [T(['0.006 &lt; 0.01 ✓']), 'I check: 1% is 0.01, and my answer is smaller. <b>Under 1% means 0.00-something.</b>', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Show <b>half of one percent</b>.', goal: function (g) { return g('pgv') === 0.5; }, yes: '0.5% = 0.005. Not one half!' }] }),
        ways: [{ label: 'Money', html: '<p>1% of $1 is 1 cent. 0.5% of $1 is half a cent. Tiny.</p>' },
          { label: 'Out of 1000', html: '<p>0.4% is 0.4 out of 100, which is 4 out of 1000.</p>' }],
        key: '<p>Under 1% means <b>less than one square</b>: 0.00-something.</p>',
        mistake: '<p>Reading 0.5% as one half. One half is 50%. 0.5% is half of one percent.</p>',
        check: [K.chk(C, 'pr-convert', 2), K.chk(C, 'pr-convert', 3)] }
    ] },
    { id: 'of', title: 'Percent of an amount and change', sub: 'Multiply by a decimal.', concepts: [
      { id: 'of', title: 'Percent of an amount', exp: ['B1.4'], skill: 'pr-of',
        body: '<p>To find a percent of an amount, change the percent to a decimal and <b>multiply</b>. 25% of 48 = 0.25 × 48 = 12.</p>',
        watch: K.film([
          [T(['25% of 48']), 'Find 25% of 48.'],
          [T(['25% = 0.25']), 'Change the percent to a decimal.'],
          [T(['0.25 × 48 = 12']), 'Multiply: 12.'],
          [T(['250% of 18', '= 2.5 × 18 = 45']), 'Above 100% works the same way. The answer is bigger than 18.', 2600]
        ]),
        example: K.film([
          [T(['35% of 60']), 'My turn. I will find 35% of 60.'],
          [T(['35% = 0.35']), 'First I change the percent to a decimal: 35 ÷ 100 = 0.35.'],
          [T(['0.35 × 60 = 21']), 'Next I multiply: 0.35 × 60 = 21.'],
          [T(['10% of 60 = 6', '3.5 × 6 = 21 ✓']), 'I check with 10%: 10% of 60 is 6, and 35% is three and a half of those: 21. <b>Percent of = decimal × amount.</b>', 2800]
        ]),
        ways: [{ label: 'Friendly percents', html: '<p>10% is easy: move the point one place. 5% is half of that. 15% = 10% + 5%. 15% of $60 = $6 + $3 = $9.</p>' }],
        key: '<p>Percent of = <b>decimal × amount</b>.</p>',
        mistake: '<p>Dividing by the percent instead of multiplying. Estimate first: 25% is a quarter.</p>',
        check: [K.chk(C, 'pr-of', 1), K.chk(C, 'pr-of', 2)] },
      { id: 'multiplier', title: 'Increase and decrease', exp: ['B2.1', 'B1.4'], skill: 'pr-change', hard: true,
        body: '<p>Use a <b>multiplier</b>. A 15% decrease leaves 85%, so multiply by 0.85. A 13% increase makes 113%, so multiply by 1.13.</p>',
        watch: K.film([
          [F.changeBar(64, 15, false), 'A $64 jacket, 15% off. 100% − 15% = 85%.'],
          [T(['64 × 0.85 = 54.40']), 'Multiply by 0.85: $54.40.'],
          [F.changeBar(54.4, 13, true), 'Now add 13% HST: 100% + 13% = 113%.'],
          [T(['54.40 × 1.13 = 61.47']), 'Multiply by 1.13: $61.47.', 2600]
        ]),
        example: K.film([
          [F.changeBar(50, 30, false), 'My turn. A $50 game is 30% off. I will find the sale price. What is left is 100% − 30% = 70%.'],
          [T(['50 × 0.70 = 35']), 'So I multiply by 0.70: $35.'],
          [F.changeBar(35, 13, true), 'Next I add 13% HST. The new price is 100% + 13% = 113% of $35.'],
          [T(['35 × 1.13 = 39.55']), 'So I multiply by 1.13: $39.55.'],
          [T(['decrease: × 0.70', 'increase: × 1.13']), 'One multiplication for each change. Decrease: <b>× (1 − p)</b>. Increase: <b>× (1 + p)</b>.', 2600]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Show a <b>20% decrease</b> from <b>$80</b>.', goal: function (g) { return g('pco') === 80 && g('pcp') === 20 && g('pcd') === 'down'; }, yes: '80 × 0.8 = $64.' },
          { do: 'Now add <b>13% HST</b> to <b>$100</b>.', goal: function (g) { return g('pco') === 100 && g('pcp') === 13 && g('pcd') === 'up'; }, yes: '100 × 1.13 = $113.' }] }),
        ways: [{ label: 'Two steps', html: '<p>Find the change, then add or take it away. 15% of $64 is $9.60. $64 − $9.60 = $54.40. The multiplier does both steps at once.</p>' }],
        key: '<p>Decrease: <b>× (1 − p)</b>. Increase: <b>× (1 + p)</b>.</p>',
        mistake: '<p>Multiplying by 0.15 for a 15% discount. That gives the discount, not the new price.</p>',
        check: [K.chk(C, 'pr-change', 1), K.chk(C, 'pr-change', 2)] },
      { id: 'find', title: 'Finding the percent change', exp: ['B2.1'], skill: 'pr-change',
        body: '<p>Percent change = change ÷ <b>original</b> × 100.</p>',
        watch: K.film([
          [T(['40 cm → 58 cm']), 'A plant grew from 40 cm to 58 cm.'],
          [T(['change: 58 − 40 = 18']), 'Find the change: 18 cm.'],
          [T(['18 ÷ 40 = 0.45 = 45%']), 'Compare with the original: 45% increase.', 2600]
        ]),
        example: K.film([
          [T(['$16 → $20']), 'My turn. A movie ticket went from $16 to $20. I will find the percent increase.'],
          [T(['change: 20 − 16 = 4']), 'First I find the change: $4.'],
          [T(['4 ÷ 16 = 0.25']), 'Next I compare the change with the starting price, $16: 4 ÷ 16 = 0.25.'],
          [T(['0.25 = 25%']), 'As a percent, that is a <b>25% increase</b>.'],
          [T(['16 × 1.25 = 20 ✓']), 'I check: 16 × 1.25 = 20. Always divide by the <b>starting</b> amount.', 2400]
        ]),
        key: '<p>Always divide by the <b>starting</b> amount.</p>',
        mistake: '<p>Dividing by the new amount (18 ÷ 58). Ask: "What did we start with?"</p>',
        check: [K.num('A bike was $250. It is now $200. What is the percent decrease?', 20, 'Change ÷ original.', '50 ÷ 250 = 0.2 = 20%.', { unit: '%' }), K.chk(C, 'pr-change', 3)] }
    ] },
    { id: 'ratio', title: 'Ratios and proportions', sub: 'Scale both sides the same way.', concepts: [
      { id: 'scale', title: 'Solving a proportion', exp: ['B2.8'], skill: 'pr-prop',
        body: '<p>A <b>proportion</b> says two ratios are equal. Find what one side was multiplied by, and do the same to the other side.</p>',
        watch: K.film([
          [T(['3 : 2 = 7.5 : ?']), '3 cups of flour for every 2 cups of sugar. How much sugar for 7.5 cups of flour?'],
          [F.dnl(3, 2, 7.5, 'cups of flour', 'cups of sugar'), 'Flour went from 3 to 7.5: times 2.5.'],
          [T(['2 × 2.5 = 5']), 'Do the same to sugar: 5 cups.', 2600]
        ]),
        example: K.film([
          [T(['4 : 6 = 10 : ?']), 'My turn. A drink uses 4 scoops of mix for every 6 cups of water. I will find the water for 10 scoops.'],
          [F.dnl(4, 6, 10, 'scoops of mix', 'cups of water'), 'First I see how the mix changed: 4 to 10 is times 2.5.'],
          [T(['6 × 2.5 = 15']), 'Next I do the same to the water: 6 × 2.5 = 15 cups.'],
          [T(['4 : 6 = 10 : 15', '4/6 = 10/15 = 2/3 ✓']), 'I check that the ratios match: both are 2/3. <b>Whatever you do to one side, do to the other.</b>', 2600]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Keep 3 flour : 2 sugar. How much sugar for <b>12</b> cups of flour?', goal: function (g) { return g('rpa') === 3 && g('rpb') === 2 && g('rpc') === 12; }, yes: 'Times 4: 8 cups of sugar.' },
          { do: 'Set up <b>4 : 10 = ? : 25</b>. (Hint: put 10 as flour and 25 as new flour.)', goal: function (g) { return g('rpa') === 10 && g('rpb') === 4 && g('rpc') === 25; }, yes: '× 2.5, so ? = 10.' }] }),
        key: '<p>Whatever you do to one side, <b>do to the other</b>.</p>',
        mistake: '<p>Adding instead of multiplying: 3 → 7.5 is +4.5, so 2 → 6.5. Ratios scale by multiplying.</p>',
        check: [K.chk(C, 'pr-prop', 1), K.chk(C, 'pr-prop', 2)] },
      { id: 'proportional', title: 'Is it proportional?', exp: ['B2.8'], skill: 'pr-prop', hard: true,
        body: '<p>A situation is proportional when doubling one amount doubles the other. Recipes and prices usually are. Ages and setup times usually are not.</p>',
        watch: K.film([
          [T(['2 tickets: $18', '4 tickets: $36']), 'Double the tickets, double the cost: proportional.'],
          [T(['Bike: $10 fee + $5 an hour', '1 h: $15', '2 h: $20']), 'Double the hours does not double the cost, because of the fee. It is not proportional.', 2800]
        ]),
        example: K.film([
          [T(['3 kg: $7.50', '5 kg: $12.50']), 'My turn. I will check if the cost of rice is proportional to its mass.'],
          [T(['7.50 ÷ 3 = 2.50', '12.50 ÷ 5 = 2.50']), 'First I find the ratio for each row: $2.50 per kilogram both times. Same ratio, so it is proportional.'],
          [T(['1 GB: $25', '2 GB: $30']), 'Now a phone plan: $25 for 1 GB, and $30 for 2 GB.'],
          [T(['25 ÷ 1 = 25', '30 ÷ 2 = 15']), 'The ratios are $25 and $15 per GB. They are different, so it is not proportional. Double the data does not double the cost.'],
          [T(['rice: proportional', 'phone plan: not']), 'So the rice is proportional and the phone plan is not. <b>Proportional: the same ratio every time.</b>', 2600]
        ]),
        ways: [{ label: 'Same ratio test', html: '<p>Divide each pair. 18 ÷ 2 = 9 and 36 ÷ 4 = 9. Same ratio every time: proportional.</p>' }],
        key: '<p>Proportional: <b>same ratio</b> every time.</p>',
        mistake: '<p>Using a proportion where it does not fit, such as "a 10-year-old is 140 cm, so a 20-year-old is 280 cm".</p>',
        check: [K.mc('Which situation is proportional?', 'Cost of apples at $2.50 per kg', ['A person\'s height and age', 'Time to boil water and the number of pots', 'A taxi with a $4 starting fee'], 'Double one amount. Does the other double too?', 'Twice the apples cost twice as much. The taxi fee breaks proportion because of the $4 start.'), K.chk(C, 'pr-prop', 3)] }
    ] },
    { id: 'rate', title: 'Rates and unit rates', sub: 'The amount for exactly one unit.', concepts: [
      { id: 'unit', title: 'Unit rates', exp: ['B2.8'], skill: 'pr-rate',
        body: '<p>A <b>rate</b> compares two different units, like km per hour. A <b>unit rate</b> is the amount for exactly 1 unit: divide.</p>',
        watch: K.film([
          [T(['$8.70 for 6 L']), 'A 6 L jug of milk costs $8.70.'],
          [T(['8.70 ÷ 6 = 1.45', '$1.45 per litre']), 'Divide by 6 to get the price for 1 litre.'],
          [T(['210 km in 2.5 h', '210 ÷ 2.5 = 84 km/h']), 'Speed is a rate too: 84 km for each hour.', 2600]
        ]),
        example: K.film([
          [T(['$11.40 for 12 eggs']), 'My turn. A dozen eggs costs $11.40. I will find the price of one egg.'],
          [T(['11.40 ÷ 12']), 'A unit rate is the amount for 1. So I divide the total by 12.'],
          [T(['11.40 ÷ 12 = 0.95', '$0.95 per egg']), '11.40 ÷ 12 = 0.95. Each egg costs 95¢.'],
          [T(['0.95 × 12 = 11.40 ✓']), 'I check: 12 eggs at $0.95 is $11.40. <b>Unit rate = total ÷ number of units.</b>', 2600]
        ]),
        key: '<p>Unit rate = <b>total ÷ number of units</b>.</p>',
        mistake: '<p>Dividing the wrong way round (6 ÷ 8.70). Say the units: dollars per litre means dollars ÷ litres.</p>',
        check: [K.chk(C, 'pr-rate', 1), K.chk(C, 'pr-rate', 2)] },
      { id: 'best', title: 'The better buy', exp: ['B2.8', 'F1.1'], skill: 'pr-rate', hard: true,
        body: '<p>To compare packages, find the price for the <b>same amount</b> of each. Make the units match first.</p>',
        watch: K.film([
          [T(['750 g for $4.29', '1.2 kg for $6.49']), 'Which cereal is the better buy?'],
          [T(['1.2 kg = 1200 g']), 'Same units first.'],
          [F.unitBars([{ t: '750 g for $4.29', u: 4.29 / 7.5, l: '$0.57 per 100 g' }, { t: '1.2 kg for $6.49', u: 6.49 / 12, l: '$0.54 per 100 g' }]), 'Per 100 g: $0.57 and $0.54. The big box costs less per 100 g.', 2800]
        ]),
        example: K.film([
          [T(['650 g for $3.25', '1 kg for $4.70']), 'My turn. I will find the better buy of yogurt.'],
          [T(['1 kg = 1000 g']), 'First I use the same units: 1 kg = 1000 g.'],
          [T(['3.25 ÷ 6.5 = $0.50', '4.70 ÷ 10 = $0.47']), 'Next I find the price per 100 g. 650 g is 6.5 hundreds. 1000 g is 10 hundreds.'],
          [F.unitBars([{ t: '650 g for $3.25', u: 0.5, l: '$0.50 per 100 g' }, { t: '1 kg for $4.70', u: 0.47, l: '$0.47 per 100 g' }]), 'The 1 kg tub costs less per 100 g, so it is the <b>better buy</b>. Compare the price per same amount.', 2800]
        ]),
        ways: [{ label: 'Scale one up', html: '<p>Three 400 g bags = 1200 g. If one bag is $2.20, three cost $6.60. Compare with a 1200 g bag directly.</p>' }],
        key: '<p>Compare the <b>price per same amount</b>.</p>',
        mistake: '<p>Picking the lower sticker price. Ask: "How much do you get for that price?"</p>',
        check: [K.chk(C, 'pr-rate', 3), K.mc('Which is the better buy?', '2 L for $3.80', ['500 mL for $1.10'], 'Find the price per litre of each.', '2 L: $1.90/L. 500 mL: $2.20/L.')] }
    ] },
    { id: 'order', title: 'Several steps', sub: 'BEDMAS and multi-step problems.', concepts: [
      { id: 'bedmas', title: 'Order of operations', exp: ['B2.1'], skill: 'pr-order',
        body: '<p><b>BEDMAS</b>: Brackets, Exponents, Division and Multiplication left to right, Addition and Subtraction left to right.</p>',
        watch: K.film([
          [T(['2.5 + 3 × (4 − 1.5)² ÷ 5']), 'Where to start?'],
          [T(['brackets: 4 − 1.5 = 2.5', 'exponent: 2.5² = 6.25']), 'Brackets, then exponents.'],
          [T(['3 × 6.25 = 18.75', '18.75 ÷ 5 = 3.75']), 'Multiply and divide, left to right.'],
          [T(['2.5 + 3.75 = 6.25']), 'Add last: 6.25.', 2600]
        ]),
        example: K.film([
          [T(['12 − 8 ÷ 2² × 3']), 'My turn. I will work out 12 − 8 ÷ 2² × 3. There are no brackets, so I start with the exponent.'],
          [T(['2² = 4', '12 − 8 ÷ 4 × 3']), 'Exponent: 2² = 4.'],
          [T(['8 ÷ 4 = 2', '2 × 3 = 6']), 'Next I divide and multiply, left to right: 8 ÷ 4 = 2, then 2 × 3 = 6.'],
          [T(['12 − 6 = 6']), 'I subtract last: 12 − 6 = <b>6</b>. B E DM AS, and go left to right.', 2600]
        ]),
        key: '<p><b>B E DM AS</b>: D and M are equal rank, so are A and S. Go left to right.</p>',
        mistake: '<p>Always multiplying before dividing: 12 ÷ 3 × 2 is 8, not 2.</p>',
        check: [K.chk(C, 'pr-order', 1), K.chk(C, 'pr-order', 2)] },
      { id: 'multi', title: 'Multi-step problems', exp: ['B2.1', 'B1.4'], skill: 'pr-order', hard: true,
        body: '<p>Write each step on its own line. Name what each number means before moving on.</p>',
        watch: K.film([
          [T(['$80 shoes, 25% off, then 13% HST']), 'A real shopping problem.'],
          [T(['sale price: 80 × 0.75 = $60']), 'Step 1: the sale price.'],
          [T(['with tax: 60 × 1.13 = $67.80']), 'Step 2: add the tax. You pay $67.80.', 2600]
        ]),
        example: K.film([
          [T(['$60 jeans, 15% off', 'then 13% HST']), 'My turn. Jeans cost $60. They are 15% off, then 13% HST is added. I will find what I pay.'],
          [T(['sale price:', '60 × 0.85 = $51']), 'Step 1, the sale price. 100% − 15% = 85%, so 60 × 0.85 = $51. I label it.'],
          [T(['with tax:', '51 × 1.13 = $57.63']), 'Step 2, the tax. I use the sale price: 51 × 1.13 = $57.63.'],
          [T(['$57.63 &lt; $60 ✓']), 'I check: the discount was bigger than the tax, so I pay a little less than $60. One step per line, and <b>label</b> each result.', 2800]
        ]),
        ways: [{ label: 'One multiplier', html: '<p>80 × 0.75 × 1.13 = 67.80. Multipliers can be chained in one line.</p>' }],
        key: '<p>One step per line. <b>Label</b> each result.</p>',
        mistake: '<p>Adding the percents: 25% off and 13% tax is not "12% off". The tax is on the smaller sale price.</p>',
        check: [K.num('A $120 coat is 30% off. Then 13% HST is added. What do you pay?', 94.92, 'Sale price first, then tax.', '120 × 0.7 = 84. 84 × 1.13 = $94.92.', { unit: '$' }), K.chk(C, 'pr-order', 3)] }
    ] }
  ]);
})();