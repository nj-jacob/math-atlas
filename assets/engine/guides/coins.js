/* Teaching guide: Money (Toolbox tool 'coins', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('coins', {
  what: 'Canadian coins and bills to count, trade and spend, with a shop, a budget, interest and exchange in older grades.',
  keys: [
    ['Count', 'Tap coins and bills onto the mat. Sort, Fewest coins and Break the biggest show the same amount other ways.'],
    ['Shop', 'Grade 3 and up: price tags, a cart, money paid and the change; HST and cash rounding from Grade 5.'],
    ['Budget', 'Grade 5 and up: earn, spend, save and donate each week.'],
    ['Interest', 'Grade 6 and up: simple interest year by year (compound too in Grade 8).'],
    ['Exchange', 'Grade 7 and up: Canadian dollars to other money and back, at sample rates.'],
    ['Show number', 'Shows the total.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'Tap a loonie, two quarters, a dime and a nickel. Ask: “How much is this?”',
        'Tap <b>Sort</b> and count again from the biggest coin: “$1, $1.25, $1.50, $1.60, $1.65.”',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Name the coins', codes: { 1: ['F1.1'], 2: ['F1.1'] },
          goal: 'Each coin has a name and a value. Size does not tell the value.',
          ido: 'Tap a nickel and a dime. “The dime is smaller, but it is worth more: 10¢.”',
          wedo: 'Together, name each coin and bill in the tray.',
          youdo: 'The child sorts the coins from least to most value.',
          ask: '“Which coin is worth the most? How do you know?”'
        },
        {
          t: 'Count a collection', codes: { 1: ['F1.1'], 2: ['F1.1'], 3: ['F1.1'] },
          goal: 'Start with the biggest coin and count on.',
          ido: 'Tap 2 dimes and 3 nickels. Sort. “10, 20, 25, 30, 35¢.”',
          wedo: { 1: 'Together, count 1 quarter and 2 dimes (45¢).', 2: 'Together, count $5, a toonie and 3 quarters ($7.75).', 3: 'Together, count $10, $5, a loonie and 2 quarters ($16.50).' },
          youdo: { 1: 'The child makes 30¢ and 50¢.', 2: 'The child makes $1.40 and $12.', 3: 'The child makes $8.65 and $23.10.' },
          ask: '“Why start with the biggest coin?”'
        },
        {
          t: 'Same amount, other ways', codes: { 1: ['F1.1'], 2: ['F1.1'], 3: ['F1.1'] },
          goal: 'The same amount can be made with different coins.',
          ido: 'Tap a loonie. Tap <b>Break the biggest</b>: 4 quarters. “Still $1.”',
          wedo: 'Together, make 50¢ two ways.',
          youdo: { 1: 'The child makes $2 three ways, then taps Fewest coins.', 2: 'The child makes $2 three ways, then taps Fewest coins.', 3: 'The child makes $1.35 in change with the fewest coins, then checks with Fewest coins.' },
          ask: '“Which way uses the fewest coins?”'
        },
        {
          t: 'Count up for change', codes: { 3: ['F1.1'] },
          goal: 'Count up from the price to the money paid.',
          ido: 'In <b>Shop</b>, buy something for 25¢ with $1. “25 to 50, 50 to 75, 75 to $1: 75¢ change.”',
          wedo: 'Together, buy something for $3 with a $5 bill ($2 change).',
          youdo: 'The child buys two things and works out the change before tapping.',
          ask: '“How can you check the change?”'
        }
      ],
      mistakes: [
        ['Thinks a nickel is worth more than a dime because it is bigger.', 'Read the number on the coin.'],
        ['Counts every coin as 1.', 'Say each coin’s value as you count.'],
        ['Starts with the small coins and loses track.', 'Sort first: biggest to smallest.'],
        ['Subtracts wrongly for change.', 'Count up from the price instead.']
      ]
    },
    {
      grades: [4, 6],
      start: [
        'In <b>Shop</b>, put two things in the cart. Ask: “About how much will it cost?”',
        'Pay with a bill. Ask: “How much change?”',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Total and change', codes: { 4: ['F1.2'], 5: ['F1.2'] },
          goal: 'Add the prices, then count up to what you paid.',
          ido: { 4: 'Buy a $7 and a $9 item with a $20 bill. “$16. Count up: $4 change.”', 5: 'Buy a $2.15 snack. Add HST: $2.43. In cash it rounds to $2.45. Pay $5: “$2.55 change.”' },
          wedo: 'Together, buy three things and find the change.',
          youdo: 'The child plans what to buy with $20 and works out the change in their head.',
          ask: '“Why does cash round to 5¢?”'
        },
        {
          t: 'Is it a good buy?', codes: { 4: ['F1.5'], 5: ['F1.5'] },
          goal: 'Compare prices for the same amount.',
          ido: 'Write two offers on paper: 4 for $6 or 6 for $8. “$1.50 each or $1.33 each. The second is the better buy.”',
          wedo: 'Together, compare two shop items and decide which is the better buy.',
          youdo: 'The child finds the cost of one for 3 for $4.50 ($1.50) and compares it with $1.40 each.',
          ask: '“Is the cheapest always the best choice?”'
        },
        {
          t: 'Spend, save, give', codes: { 4: ['F1.3'], 5: ['F1.3'], 6: ['F1.2'] },
          goal: 'A plan shares money between spending, saving and giving.',
          ido: { 4: 'Count out $20 and split it on the mat: $10 to spend, $8 to save, $2 to give.', 5: 'In <b>Budget</b>, earn $15 a week. Plan spend, save and donate so it balances.', 6: 'In <b>Budget</b>, set a goal of $120 at $8 a week. “15 weeks.”' },
          wedo: 'Together, change one part and see how the plan changes.',
          youdo: 'The child makes their own plan for a goal and says how long it will take.',
          ask: '“What would you give up to reach the goal sooner?”'
        },
        {
          t: 'Help or hurdle', codes: { 6: ['F1.3'] },
          goal: 'Some things help a goal, some get in the way.',
          ido: 'In <b>Budget</b>, save $8 a week for $120. Add a $16 cost in week 3. “Two more weeks to the goal.”',
          wedo: 'Together, add a birthday gift of $20 and see how much sooner the goal comes.',
          youdo: 'The child lists two things that would help and two that would get in the way of their own goal.',
          ask: '“What could you do if something gets in the way?”'
        },
        {
          t: 'Interest', codes: { 6: ['F1.4'] },
          goal: 'Interest is money paid for using money.',
          ido: 'In <b>Interest</b>, put $500 at 4% for 3 years. “$20 a year: $60.”',
          wedo: 'Together, change the rate to 2% and compare.',
          youdo: 'The child finds the interest on $200 at 5% for 4 years ($40).',
          ask: '“Is interest good or bad? When?”'
        }
      ],
      mistakes: [
        ['Forgets HST when adding the total.', 'Add 13% after the prices.'],
        ['Rounds $2.43 down to $2.40 in cash.', '3 and up rounds to 5: $2.45.'],
        ['Thinks the bigger pack is always cheaper.', 'Work out the price of one.'],
        ['Adds interest to the rate instead of the money.', '4% of $500 is $20, not $504.']
      ]
    },
    {
      grades: [7, 8],
      start: [
        'In <b>Exchange</b>, change $50 CAD to US dollars. Ask: “More or fewer dollars?”',
        'Change it back. Ask: “Why might you get less back in real life?” (Fees.)',
        'Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Exchange rates', codes: { 7: ['F1.1'], 8: ['F1.1'] },
          goal: 'The rate says how much of one money buys another.',
          ido: 'Change $50 CAD at the sample rate: 36 USD. “Each Canadian dollar buys 0.72 US dollars.”',
          wedo: 'Together, change $100 CAD to euros and back.',
          youdo: 'The child plans a $300 CAD trip budget in another currency.',
          ask: '“What happens to the trip if the rate goes down?”'
        },
        {
          t: 'Simple and compound interest', codes: { 7: ['F1.5'], 8: ['F1.4'] },
          goal: 'Compound interest earns interest on interest.',
          ido: { 7: 'In <b>Interest</b>, $500 at 4% for 3 years: $60 simple interest. “Borrowing costs this much too.”', 8: 'In <b>Interest</b>, $500 at 4% for 3 years: simple $60, compound $62.43. “Compound grows faster.”' },
          wedo: 'Together, change the years to 10 and compare.',
          youdo: 'The child finds which earns more in 5 years: 3% compound or 3.5% simple.',
          ask: '“Why does compound interest grow faster?”'
        },
        {
          t: 'Track a budget', codes: { 7: ['F1.3'], 8: ['F1.3'] },
          goal: 'A budget lists money in and money out, and balances.',
          ido: 'In <b>Budget</b>, set income and costs for a month. “In equals out plus savings.”',
          wedo: 'Together, add an unexpected cost and adjust the plan.',
          youdo: 'The child builds a budget for a longer goal and changes it when something goes wrong.',
          ask: '“Which cost would you cut first? Why?”'
        }
      ],
      mistakes: [
        ['Multiplies when the rate needs dividing.', 'Check: does the answer make sense? More or fewer?'],
        ['Thinks compound and simple interest are the same.', 'Compare them year by year in Interest.'],
        ['Forgets fees when exchanging.', 'Real banks pay a little less than the rate.'],
        ['Budgets that do not balance.', 'Money in must equal money out plus savings.']
      ]
    }
  ]
});
