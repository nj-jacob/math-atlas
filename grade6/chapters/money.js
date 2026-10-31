(function () {
  var A = Atlas, R = A.R, fmt = A.fmt;
  function cl(x) { return Math.round(x * 100) / 100; }
  function m(x) { x = cl(x); var s = x.toFixed(2), p = s.split('.'); return '$' + fmt(+p[0]) + '.' + p[1]; }
  var TXT = 'style="paint-order:stroke;stroke:var(--card);stroke-width:4px"';

  /* savings bars: one bar per week, goal line */
  function saveChart(goal, have, per) {
    var weeks = Math.max(1, Math.ceil(Math.max(0, goal - have) / per)), n = Math.min(weeks, 26), W = 520, H = 250, x0 = 70, y0 = 200, top = Math.max(goal, have + per * n) * 1.08, s = '', bw = (W - x0 - 14) / (n + 1);
    function Y(v) { return y0 - (y0 - 22) * v / top; }
    for (var g = 0; g <= 4; g++) { var v = top * g / 4; s += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + (W - 8) + '" y2="' + Y(v) + '" style="stroke:var(--line)"/><text x="' + (x0 - 8) + '" y="' + (Y(v) + 6) + '" text-anchor="end" font-size="19">$' + fmt(Math.round(v)) + '</text>'; }
    for (var i = 0; i <= n; i++) {
      var amt = Math.min(have + per * i, Math.max(goal, have)), x = x0 + 4 + i * bw;
      s += '<rect x="' + x + '" y="' + Y(amt) + '" width="' + Math.max(2, bw - 3) + '" height="' + (y0 - Y(amt)) + '" style="fill:' + (amt >= goal ? 'var(--good)' : 'color-mix(in srgb,var(--strand) 70%,var(--card))') + '"/>';
      if (n <= 12 || i % Math.ceil(n / 8) === 0) s += '<text x="' + (x + bw / 2) + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="19">' + i + '</text>';
    }
    s += '<line x1="' + x0 + '" y1="' + Y(goal) + '" x2="' + (W - 8) + '" y2="' + Y(goal) + '" style="stroke:var(--hi)" stroke-width="3" stroke-dasharray="8 5"/><text x="' + (W - 10) + '" y="' + (Y(goal) - 7) + '" text-anchor="end" font-size="18" font-weight="800" ' + TXT + '>goal ' + m(goal) + '</text>';
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 8) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/><text x="' + ((x0 + W) / 2) + '" y="' + (y0 + 46) + '" text-anchor="middle" font-size="19" class="t2">week</text>';
    return A.svg(W, H, s, 'Savings growing from ' + m(have) + ' by ' + m(per) + ' a week. The goal of ' + m(goal) + ' is reached in week ' + weeks + '.');
  }
  /* simple interest: stacked bars, principal + interest for each year */
  function intChart(p, r, t, loan) {
    var W = 520, H = 250, x0 = 80, y0 = 200, tot = p + p * r * t / 100, top = Math.max(1, tot) * 1.1, s = '', bw = Math.min(70, (W - x0 - 20) / (t + 1));
    function Y(v) { return y0 - (y0 - 20) * v / top; }
    for (var g = 0; g <= 4; g++) { var v = top * g / 4; s += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + (W - 8) + '" y2="' + Y(v) + '" style="stroke:var(--line)"/><text x="' + (x0 - 8) + '" y="' + (Y(v) + 6) + '" text-anchor="end" font-size="19">$' + fmt(Math.round(v)) + '</text>'; }
    for (var i = 0; i <= t; i++) {
      var x = x0 + 10 + i * (bw + 6), it = p * r * i / 100;
      s += '<rect x="' + x + '" y="' + Y(p) + '" width="' + bw + '" height="' + (y0 - Y(p)) + '" style="fill:color-mix(in srgb,var(--strand) 60%,var(--card))"/>';
      if (it > 0) s += '<rect x="' + x + '" y="' + Y(p + it) + '" width="' + bw + '" height="' + (Y(p) - Y(p + it)) + '" style="fill:' + (loan ? 'var(--bad)' : 'var(--good)') + '"/>';
      if (t <= 6 || i % 2 === 0) s += '<text x="' + (x + bw / 2) + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="19">' + i + '</text>';
    }
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 8) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/><text x="' + ((x0 + W) / 2) + '" y="' + (y0 + 46) + '" text-anchor="middle" font-size="19" class="t2">years</text>';
    return A.svg(W, H, s, (loan ? 'Amount owed on a loan of ' : 'Savings of ') + m(p) + ' at ' + r + '% simple interest for ' + t + ' years. Total ' + m(tot) + '.');
  }
  /* account plans: cost against number of transactions */
  var PLANS = [{ n: 'Plan A', d: '$4.00 a month, unlimited', f: function (k) { return 4; } }, { n: 'Plan B', d: '$0.50 for each transaction', f: function (k) { return 0.5 * k; } }, { n: 'Plan C', d: '$1.50 a month, 10 free, then $1.00 each', f: function (k) { return 1.5 + Math.max(0, k - 10); } }];
  function planChart(k) {
    var W = 520, H = 250, x0 = 64, y0 = 200, mx = 30, top = 22, s = '', cols = ['var(--strand)', 'var(--hi)', 'var(--ink2)'];
    function X(v) { return x0 + (W - x0 - 20) * v / mx; } function Y(v) { return y0 - (y0 - 20) * Math.min(v, top) / top; }
    for (var g = 0; g <= top; g += 5) s += '<line x1="' + x0 + '" y1="' + Y(g) + '" x2="' + (W - 14) + '" y2="' + Y(g) + '" style="stroke:var(--line)"/><text x="' + (x0 - 8) + '" y="' + (Y(g) + 6) + '" text-anchor="end" font-size="19">$' + g + '</text>';
    for (g = 0; g <= mx; g += 5) s += '<text x="' + X(g) + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="19">' + g + '</text>';
    PLANS.forEach(function (p, i) {
      var pts = []; for (var j = 0; j <= mx; j++) pts.push(X(j) + ',' + Y(p.f(j)));
      s += '<polyline points="' + pts.join(' ') + '" fill="none" style="stroke:' + cols[i] + '" stroke-width="3.5"' + (i === 2 ? ' stroke-dasharray="9 5"' : '') + '/>';
      s += '<circle cx="' + X(Math.min(k, mx)) + '" cy="' + Y(p.f(k)) + '" r="6" style="fill:' + cols[i] + ';stroke:var(--ink)"/>';
    });
    s += '<line x1="' + X(Math.min(k, mx)) + '" y1="20" x2="' + X(Math.min(k, mx)) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-dasharray="3 4"/>';
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 14) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/><text x="' + ((x0 + W) / 2) + '" y="' + (y0 + 46) + '" text-anchor="middle" font-size="19" class="t2">transactions in a month</text>';
    return A.svg(W, H, s, 'Monthly cost of three bank plans for 0 to 30 transactions. At ' + k + ': ' + PLANS.map(function (p) { return p.n + ' ' + m(p.f(k)); }).join(', '));
  }
  function legend() { return '<p class="t2" style="margin:.2em 0"><span style="color:var(--strand);font-weight:800">&#9644; Plan A</span> &nbsp; <span style="color:var(--hi);font-weight:800">&#9644; Plan B</span> &nbsp; <span style="color:var(--ink2);font-weight:800">&#9476; Plan C</span></p>'; }

  /* concept question banks: [question, right, wrong...] */
  var PAY = [
    ['You want to buy a $3 snack at a small shop that has no card machine. How can you pay?', 'cash', 'credit card', 'e-transfer', 'debit card'],
    ['Which way to pay uses <b>borrowed</b> money that you must pay back later?', 'credit card', 'debit card', 'cash', 'prepaid card'],
    ['Which way to pay takes money <b>straight out of your bank account</b>?', 'debit card', 'credit card', 'gift card', 'buy now, pay later'],
    ['You want to send $20 to your cousin in another city today. What works best?', 'e-transfer', 'cash', 'a gift card for your favourite store', 'buy now, pay later'],
    ['What is a <b>disadvantage</b> of a credit card?', 'interest is charged if you do not pay the full amount on time', 'you must carry lots of coins', 'it only works in one store', 'it can never be used online'],
    ['What is an <b>advantage</b> of cash?', 'you cannot spend more than you have with you', 'it is safe if you lose it', 'it works for online shopping', 'it builds a credit history'],
    ['What is a <b>disadvantage</b> of a gift card?', 'it may only work at one store', 'it charges interest every month', 'it is a loan from a bank', 'it can never be lost'],
    ['What is an <b>advantage</b> of paying by tapping your phone?', 'it is quick and your card number stays hidden', 'it works when the battery is dead', 'it has no spending limits at all', 'it earns interest for you'],
    ['What is a <b>disadvantage</b> of "buy now, pay later"?', 'missing a payment can add late fees', 'you pay the whole price right away', 'it only works with cash', 'it takes money from your savings first'],
    ['Which is the best way to stick to a $50 budget at the mall?', 'bring $50 in cash or a $50 prepaid card', 'a credit card with a $1000 limit', 'buy now, pay later', 'borrow from a friend as you go']
  ];
  var GOAL = [
    ['Saving $200 for a new bike by summer is&hellip;', 'a saving goal', 'an earning goal', 'a donation', 'a loan'],
    ['Making $150 by mowing lawns this summer is&hellip;', 'an earning goal', 'a saving goal', 'a loan', 'a trade'],
    ['Which is a <b>short-term</b> goal?', 'saving $20 for a gift next week', 'saving for college', 'saving to buy a car', 'saving for retirement'],
    ['Which is a <b>long-term</b> goal?', 'saving for college', 'buying lunch tomorrow', 'saving $10 for a movie this weekend', 'buying a card for a birthday next week'],
    ['Which is a <b>need</b>?', 'a warm winter coat', 'a third video game', 'a designer phone case', 'concert tickets'],
    ['Which is a <b>want</b>?', 'the newest phone', 'healthy food', 'a place to live', 'winter boots'],
    ['Which <b>helps</b> you reach a saving goal?', 'putting money aside each week before you spend', 'buying things on impulse', 'not tracking your spending', 'using a credit card you cannot pay off'],
    ['Which can <b>get in the way</b> of a saving goal?', 'an unexpected cost, like fixing a broken phone', 'making a budget', 'comparing prices before you buy', 'saving part of every allowance'],
    ['Your friends keep asking you to buy snacks after school, so your savings grow slowly. This is&hellip;', 'peer pressure that slows down your goal', 'an earning goal', 'a way to earn interest', 'a long-term goal'],
    ['What is a good <b>first step</b> toward a saving goal?', 'decide how much you need and by what date', 'spend first, then save what is left', 'borrow the full amount', 'stop keeping track']
  ];
  var WAYS = ['trading', 'lending', 'borrowing', 'donating'];
  var SHARE = [
    ['You give your old skates to a friend, and they give you their skateboard.', 'trading'],
    ['You let your neighbour use your bike for a week. Then they give it back. You are&hellip;', 'lending'],
    ['Your sister gives you $20 and you promise to pay it back next month. You are&hellip;', 'borrowing'],
    ['You give $10 to a food bank and expect nothing back.', 'donating'],
    ['Your class swaps used books at a book swap.', 'trading'],
    ['A library lets you take a book home for three weeks. The library is&hellip;', 'lending'],
    ['A family gets a loan from a bank to buy a car. The family is&hellip;', 'borrowing'],
    ['You spend Saturday volunteering at a community garden.', 'donating'],
    ['A bank gives a family money for a car, to be paid back with interest. The bank is&hellip;', 'lending'],
    ['You give your extra pencils to a classmate who has none.', 'donating']
  ];
  var SHARE3 = [
    ['When you borrow money from a bank, who usually pays the interest?', 'the borrower', 'the lender', 'nobody', 'the government'],
    ['Why does a bank pay you interest on your savings?', 'it uses your money to make loans to other people', 'it is a gift that never changes', 'it is a fee you pay the bank', 'it is a donation to you'],
    ['A friend asks to borrow $30. What is a fair thing to agree on first?', 'when and how it will be paid back', 'that it never needs to be paid back', 'that you will pay interest to them', 'nothing, just hand it over'],
    ['Which is a way to share a resource that is <b>not</b> money?', 'donating your time as a volunteer', 'a bank loan', 'paying interest', 'a monthly account fee']
  ];
  function bankQ(b, lvl) {
    var x = R.pick(b), o = R.mc(x[1], R.shuffle(x.slice(2)));
    return { x: x, o: o };
  }

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var CH = 'money', g = G6.g, lab = G6.lab, play = G6.play;
  function card(t, sub, col, plain) {
    var o = '<rect x="10" y="10" width="300" height="180" rx="18" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2"/>' +
      (plain ? '' : '<rect x="34" y="62" width="46" height="36" rx="6" style="fill:#f4d27a;stroke:#9a7a2a" stroke-width="1.5"/><path d="M34 80 H80 M57 62 V98" style="stroke:#9a7a2a" stroke-width="1.2"/>') +
      '<text x="34" y="46" font-size="22" font-weight="800" style="fill:#fff;paint-order:stroke;stroke:rgba(0,0,0,.28);stroke-width:2px">' + t + '</text>' +
      '<text x="34" y="168" font-size="16" style="fill:#fff;paint-order:stroke;stroke:rgba(0,0,0,.28);stroke-width:2px">' + sub + '</text>';
    return A.svg(320, 200, o, t + ': ' + sub);
  }
  var LESSONS = [
    { id: 'pay', title: 'Ways to pay', sub: 'pick the right one', concepts: [
      { id: 'methods', title: 'Ways to pay', exp: ['F1.1'], skill: 'mo-pay',
        body: '<p>Each way to pay has <b>advantages</b> (good points) and <b>disadvantages</b> (risks or costs). Pick the one that fits the situation.</p>',
        watch: play([
          ['Cash: works almost everywhere in person. But it can be lost, and it does not work online.', card('Cash', 'You can see exactly what is left.', 'var(--good)', 1)],
          ['Debit card: takes money straight from your bank account.', card('Debit card', 'Your own money, no cash to carry.', 'var(--strand)')],
          ['Prepaid or gift card: a set amount. Good for a budget, but may only work at one store.', card('Prepaid card', 'Spend only what is loaded.', 'var(--hi)')],
          ['E-transfer: send money to a person. Hard to undo if sent to the wrong person.', card('E-transfer', 'Check the name before you send.', 'var(--ink2)')],
          ['Buy now, pay later: smaller payments, but late fees add up.', card('Buy now, pay later', 'Easy to owe too much.', 'var(--bad)')]
        ]),
        key: '<p>Ask: whose money is it, where can I use it, and what can go wrong?</p>',
        check: [{ q: 'You want to buy a $3 snack at a shop with no card machine. How can you pay?', type: 'mc', options: ['credit card', 'cash', 'e-transfer', 'debit card'], answer: 1, hint: 'No card machine.', explain: 'Cash.' }, g(CH, 'mo-pay', 1), g(CH, 'mo-pay', 2)] },
      { id: 'credit', title: 'Debit or credit?', exp: ['F1.1', 'F1.4'], skill: 'mo-pay', hard: true,
        body: '<p><b>Debit</b> uses <b>your</b> money. <b>Credit</b> uses the <b>bank&rsquo;s</b> money, which you pay back later. If you pay late, you pay <b>interest</b>, often about 20% a year.</p>',
        watch: play([
          ['Maya buys a $200 jacket on a credit card.', intChart(200, 20, 0, true), '$200'],
          ['She does not pay it back for a year. 20% of $200 is $40 of interest.', intChart(200, 20, 1, true), '$200 + $40'],
          ['The jacket really cost her $240.', intChart(200, 20, 1, true), '$240']
        ]),
        ways: [{ label: 'Side by side', html: '<div class="tbl"><table><thead><tr><th class="l"></th><th class="l">Debit</th><th class="l">Credit</th></tr></thead><tbody><tr><td class="l">Whose money?</td><td class="l">yours</td><td class="l">the bank&rsquo;s</td></tr><tr><td class="l">Pay when?</td><td class="l">right away</td><td class="l">at the end of the month</td></tr><tr><td class="l">Pay late?</td><td class="l">not possible</td><td class="l">interest charged</td></tr></tbody></table></div>' }],
        key: '<p>Credit is a loan. Pay the full bill on time and it costs nothing extra.</p>',
        check: [{ q: 'Which way to pay is a loan that you must pay back?', type: 'mc', options: ['debit card', 'credit card', 'cash', 'prepaid card'], answer: 1, hint: 'Whose money is it?', explain: 'A credit card uses the bank&rsquo;s money.' }, g(CH, 'mo-pay', 3)] }
    ] },
    { id: 'goals', title: 'Financial goals', sub: 'plan it, track it', concepts: [
      { id: 'kinds', title: 'Kinds of goals', exp: ['F1.2'], skill: 'mo-needs',
        body: '<p>An <b>earning goal</b> is about making money. A <b>saving goal</b> is about keeping money for later. Goals can be <b>short-term</b> (days or weeks) or <b>long-term</b> (months or years).</p>',
        watch: play([
          ['Make $150 walking dogs this summer.', card('Earning goal', 'Making money.', 'var(--strand)', 1)],
          ['Keep $300 for a bike.', card('Saving goal', 'Keeping money for later.', 'var(--good)', 1)],
          ['$20 for a gift next week: short-term. Saving for college: long-term.', card('Short or long?', 'Weeks or years.', 'var(--hi)', 1)]
        ]),
        key: '<p>Name the goal, the amount and the date.</p>',
        check: [{ q: 'Making $150 by mowing lawns this summer is&hellip;', type: 'mc', options: ['a saving goal', 'an earning goal', 'a loan', 'a trade'], answer: 1, hint: 'Making money or keeping it?', explain: 'Making money: an earning goal.' }, g(CH, 'mo-needs', 1), g(CH, 'mo-needs', 1)] },
      { id: 'plan', title: 'Plan a saving goal', exp: ['F1.2'], skill: 'mo-goal',
        body: '<p>Subtract what you already have. Divide what is left by what you save each week. If it does not divide evenly, round <b>up</b>.</p>',
        watch: play([
          ['A $360 bike. Sam has $60 and saves $25 a week.', saveChart(360, 60, 25)],
          ['Still needed: 360 − 60 = $300.', saveChart(360, 60, 25), '$300'],
          ['300 ÷ 25 = 12 weeks. The bars reach the goal line in week 12.', saveChart(360, 60, 25), '12 weeks']
        ]),
        try: lab(CH, 0, 'Set up a plan that reaches the goal in exactly <b>10 weeks</b>.', function (h) { var gl = +h.querySelector('#sg').value || 1, hv = +h.querySelector('#sh').value || 0, p = +h.querySelector('#sp').value || 1; return hv < gl && Math.ceil((gl - hv) / p - 1e-9) === 10; }, 'Yes: 10 weeks.'),
        key: '<p>(Goal &minus; saved) &divide; each week. Round up.</p>',
        mistake: '<p>Forgetting the money already saved. Subtract it before dividing.</p>',
        check: [{ q: 'You want a $120 game. You save $15 a week and have nothing saved. How many weeks?', type: 'num', unit: 'weeks', answer: 8, hint: '120 &divide; 15.', explain: '8 weeks.' }, g(CH, 'mo-goal', 1), g(CH, 'mo-goal', 2)] },
      { id: 'helps', title: 'What helps and what gets in the way', exp: ['F1.3'], skill: 'mo-needs', hard: true,
        body: '<p>A budget, saving first and comparing prices <b>help</b>. Buying on impulse, peer pressure and unexpected costs <b>get in the way</b>. Pay for <b>needs</b> (food, shelter, warm clothes) before <b>wants</b>.</p>',
        watch: play([
          ['Leo saves $20 a week for a $300 tablet.', saveChart(300, 0, 20), '15 weeks'],
          ['After 5 weeks he has $100. Then his phone screen cracks: a $60 repair.', '<p class="g6-big">$100 − $60 = $40</p>', 'Unexpected cost'],
          ['He still needs 300 − 40 = $260. That is 13 more weeks.', saveChart(300, 40, 20), '13 more weeks']
        ]),
        ways: [{ label: 'Needs or wants', html: '<div class="tbl"><table><thead><tr><th class="l">Item</th><th class="l">Need or want?</th></tr></thead><tbody><tr><td class="l">winter boots</td><td class="l">need</td></tr><tr><td class="l">a second pair of brand-name boots</td><td class="l">want</td></tr><tr><td class="l">groceries</td><td class="l">need</td></tr><tr><td class="l">take-out every night</td><td class="l">want</td></tr></tbody></table></div>' },
          { label: 'Pay yourself first', html: '<p>When you get money, put the savings aside <b>before</b> you spend anything. What is left is for spending.</p>' }],
        key: '<p>Save first, track spending, needs before wants.</p>',
        check: [{ q: 'Which one helps you reach a saving goal?', type: 'mc', options: ['buying on impulse', 'tracking your spending', 'ignoring your budget', 'a credit card you cannot pay off'], answer: 1, hint: 'Which gives you more control?', explain: 'Tracking your spending.' }, g(CH, 'mo-needs', 2), g(CH, 'mo-needs', 3)] }
    ] },
    { id: 'interest', title: 'Interest and fees', sub: 'the cost of using money', concepts: [
      { id: 'simple', title: 'Simple interest', exp: ['F1.4'], skill: 'mo-interest',
        body: '<p><b>Interest</b> is the cost of using someone else&rsquo;s money, given as a <b>percent per year</b>. Save, and the bank pays <b>you</b>. Borrow, and <b>you</b> pay. Simple interest is the same amount every year.</p>',
        watch: play([
          ['Ali saves $400 at 3% a year.', intChart(400, 3, 0, false), '$400'],
          ['Year 1: 3% of 400 = $12.', intChart(400, 3, 1, false), '+ $12'],
          ['Year 2: another $12. Total interest $24, so $424 in the account.', intChart(400, 3, 2, false), '$424']
        ]),
        try: lab(CH, 1, 'Make a <b>loan</b> where you pay exactly <b>$50</b> in interest.', function (h) { var p = Math.max(0, Math.min(10000, +h.querySelector('#ip').value || 0)); return h.querySelector('#ik').value === 'l' && Math.abs(p * +h.querySelector('#ir').value * +h.querySelector('#it').value / 100 - 50) < 1e-9; }, 'Yes: $50 of interest.'),
        key: '<p>One year: rate &times; amount. Then times the years. Total = amount + interest.</p>',
        mistake: '<p>Giving only the interest when the question asks for the total paid back.</p>',
        check: [{ q: 'You borrow $200 at 10% simple interest a year for 2 years. How much do you pay back in total?', type: 'num', unit: '$', answer: 240, hint: '$20 a year.', explain: '200 + 40 = $240.' }, g(CH, 'mo-interest', 1), g(CH, 'mo-interest', 2)] },
      { id: 'fees', title: 'Bank fees and plans', exp: ['F1.4'], skill: 'mo-fees', hard: true,
        body: '<p><b>Fees</b> are charges for a service: a monthly fee, a fee for each transaction, an ATM fee, a late fee. Banks offer plans. The cheapest plan depends on how you use it.</p>',
        watch: play([
          ['Plan A: $4 a month. Plan B: 50¢ each time. Plan C: $1.50 a month, 10 free, then $1 each.', legend() + planChart(5)],
          ['5 transactions: B costs $2.50, C costs $1.50. C is cheapest.', legend() + planChart(5), 'C wins'],
          ['20 transactions: A is still $4. B is $10, C is $11.50.', legend() + planChart(20), 'A wins']
        ]),
        try: lab(CH, 2, 'Find a number of transactions where <b>Plan A</b> is the cheapest.', function (h) { return +h.querySelector('#pk').value >= 13; }, 'Yes: with lots of transactions, the flat fee wins.'),
        key: '<p>Work out each plan for your number of transactions. Then compare.</p>',
        check: [{ q: 'An ATM charges a $2.50 fee. You use it 6 times this month. How much do you pay in fees?', type: 'num', unit: '$', answer: 15, hint: '6 &times; $2.50.', explain: '$15.00.' }, g(CH, 'mo-fees', 1), g(CH, 'mo-fees', 2)] }
    ] },
    { id: 'share', title: 'Sharing resources', sub: 'trade, lend, borrow, donate', concepts: [
      { id: 'ways', title: 'Trade, lend, borrow, donate', exp: ['F1.5'], skill: 'mo-share',
        body: '<p><b>Trading</b>: a swap. <b>Lending</b>: let someone use what is yours and get it back. <b>Borrowing</b>: use what is someone else&rsquo;s and give it back. <b>Donating</b>: give and expect nothing back.</p>',
        watch: play([
          ['Your comic for a friend&rsquo;s card game.', card('Trading', 'A swap, now.', 'var(--strand)', 1)],
          ['Jo lets Kim use $10. Jo is lending. Kim is borrowing.', card('Lending and borrowing', 'One event, two sides. The owner lends.', 'var(--hi)', 1)],
          ['A bank lends Kim $50 at 6%. Kim pays back $53.', card('Borrowing from a bank', '$50 + $3 interest.', 'var(--ink2)', 1)],
          ['Giving to a food bank, or volunteering your time.', card('Donating', 'Nothing comes back.', 'var(--good)', 1)]
        ]),
        key: '<p>Ask: whose is it, and does it come back?</p>',
        check: [{ q: 'You let a friend use your calculator for a test, and they give it back. You are&hellip;', type: 'mc', options: ['trading', 'lending', 'borrowing', 'donating'], answer: 1, hint: 'It is yours and it comes back.', explain: 'Lending.' }, g(CH, 'mo-share', 1), g(CH, 'mo-share', 2), g(CH, 'mo-share', 3)] }
    ] }
  ];
  A.register('money', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Ways to pay</h2>' +
'<p>There are many ways to pay for things. Each one has <b>advantages</b> (good points) and <b>disadvantages</b> (risks or costs). Choose the one that fits the situation.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Method</th><th class="l">Advantages</th><th class="l">Disadvantages</th></tr></thead><tbody>' +
'<tr><td class="l"><b>Cash</b></td><td class="l">accepted almost everywhere in person; easy to see what is left</td><td class="l">can be lost or stolen; not for online shopping</td></tr>' +
'<tr><td class="l"><b>Debit card</b></td><td class="l">takes money straight from your bank account; no cash to carry</td><td class="l">some accounts charge fees; you can lose track without checking</td></tr>' +
'<tr><td class="l"><b>Credit card</b></td><td class="l">buy now and pay at the end of the month; works online</td><td class="l">it is <b>borrowed</b> money; high interest (often about 20% a year) if you do not pay in full</td></tr>' +
'<tr><td class="l"><b>Prepaid or gift card</b></td><td class="l">a set amount, good for a budget</td><td class="l">may only work at one store; can be lost</td></tr>' +
'<tr><td class="l"><b>Tap with a phone</b></td><td class="l">fast; your card number stays hidden</td><td class="l">needs a charged phone; easy to overspend</td></tr>' +
'<tr><td class="l"><b>E-transfer</b></td><td class="l">send money to a person from your bank account</td><td class="l">hard to undo if sent to the wrong person; watch for scams</td></tr>' +
'<tr><td class="l"><b>Buy now, pay later</b></td><td class="l">split a price into smaller payments</td><td class="l">late fees; easy to owe too much</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Maya buys a $200 jacket on a credit card that charges 20% interest a year. She does not pay it back for a whole year.</p><p>20% of $200 = 0.20 &times; 200 = <b>$40</b> of interest. The jacket really cost her $240.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Debit uses <b>your</b> money. Credit uses the <b>bank&rsquo;s</b> money, and you pay extra if you are late paying it back.</p></div>' +
A.yt({ q: 'Which way to pay is a loan that you must pay back?', type: 'mc', options: ['debit card', 'credit card', 'cash', 'prepaid card'], answer: 1,
  hint: 'Which one uses the bank&rsquo;s money instead of your own?', explain: 'A credit card lends you the bank&rsquo;s money. If you do not pay it back on time, you pay interest.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Setting financial goals</h2>' +
'<p>A <b>financial goal</b> is something you plan to do with money. An <b>earning goal</b> is about making money (for example, $150 from walking dogs). A <b>saving goal</b> is about keeping money for later (for example, $300 for a bike).</p>' +
'<p>Goals can be <b>short-term</b> (days or weeks) or <b>long-term</b> (months or years). Steps that work:</p>' +
'<ol><li>Name the goal, the amount and the date.</li><li>Work out how much to save each week.</li><li>Track your progress.</li><li>Adjust if something changes.</li></ol>' +
'<div class="lab"><span class="lt">Try it: plan a saving goal</span>' +
'<div class="ctrl"><label for="sg">Goal ($)<input type="number" id="sg" min="1" max="5000" value="360" style="width:6em"></label><label for="sh">Saved now ($)<input type="number" id="sh" min="0" max="5000" value="60" style="width:6em"></label><label for="sp">Save each week ($)<input type="number" id="sp" min="1" max="500" value="25" style="width:6em"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A bike costs $360. Sam has $60 and saves $25 a week. How many weeks?</p><p>Still needed: 360 &minus; 60 = $300. Weeks: 300 &divide; 25 = <b>12 weeks</b>.</p><p>If the answer is not a whole number, round <b>up</b>. With $40 a week: 300 &divide; 40 = 7.5, so Sam needs <b>8 weeks</b>. After 7 weeks he would still be short.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Forgetting the money you already have. Subtract what you have saved <b>before</b> you divide.</p></div>' +
A.yt({ q: 'You want a $120 game. You save $15 a week and have nothing saved yet. How many weeks will it take?', type: 'num', answer: 8, unit: 'weeks',
  hint: 'Divide the goal by the amount you save each week.', explain: '120 &divide; 15 = 8 weeks.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>What helps and what gets in the way</h2>' +
'<p>Many things affect whether you reach a goal. Some you can control, and some you cannot.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Helps</th><th class="l">Gets in the way</th></tr></thead><tbody>' +
'<tr><td class="l">a budget: a plan for what you earn and spend</td><td class="l">buying on impulse (without planning)</td></tr>' +
'<tr><td class="l">saving first, as soon as you get money</td><td class="l">unexpected costs, like a broken phone</td></tr>' +
'<tr><td class="l">comparing prices and waiting for sales</td><td class="l">ads and peer pressure</td></tr>' +
'<tr><td class="l">tracking every dollar you spend</td><td class="l">losing a job or getting less allowance</td></tr>' +
'<tr><td class="l">extra earning, like a summer job</td><td class="l">fees and interest on money you owe</td></tr></tbody></table></div>' +
'<p><b>Needs</b> are things you must have to live safely: food, shelter, warm clothes. <b>Wants</b> are nice to have. Paying for needs first keeps a budget healthy.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Item</th><th class="l">Need or want?</th><th class="l">Why</th></tr></thead><tbody>' +
'<tr><td class="l">winter boots</td><td class="l">need</td><td class="l">you must stay warm and safe in a Canadian winter</td></tr>' +
'<tr><td class="l">a second pair of brand-name boots</td><td class="l">want</td><td class="l">you already have boots that work</td></tr>' +
'<tr><td class="l">groceries for the week</td><td class="l">need</td><td class="l">you must eat</td></tr>' +
'<tr><td class="l">take-out every night</td><td class="l">want</td><td class="l">cheaper food meets the same need</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Leo saves $20 a week for a $300 tablet. In week 5 his phone screen cracks and the repair costs $60.</p><p>After 5 weeks he had $100. After the repair: 100 &minus; 60 = $40. He still needs 300 &minus; 40 = $260, which is 260 &divide; 20 = 13 more weeks. An emergency fund (a small amount kept aside) would have protected his goal.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Pay yourself first: put your savings aside <b>before</b> you spend anything.</p></div>' +
A.yt({ q: 'Which one <b>helps</b> you reach a saving goal?', type: 'mc', options: ['buying things on impulse', 'tracking your spending', 'ignoring your budget', 'a credit card you cannot pay off'], answer: 1,
  hint: 'Which choice gives you more control of your money?', explain: 'Tracking your spending shows where your money goes, so you can cut back and save more.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Interest and fees</h2>' +
'<p><b>Interest</b> is the cost of using someone else&rsquo;s money. It is usually given as a <b>percent per year</b>, called the <b>interest rate</b>.</p>' +
'<ul><li>When you <b>save</b> in a bank account, the bank pays <b>you</b> interest.</li><li>When you <b>borrow</b> (a loan or a credit card), <b>you</b> pay interest.</li></ul>' +
'<p>Savings accounts usually pay a low rate (often 0.5% to 5%). Credit cards usually charge a high rate (often about 20%). This page uses <b>simple interest</b>: the same amount each year. Many real accounts use <b>compound interest</b>, which also earns interest on the interest.</p>' +
'<div class="lab"><span class="lt">Try it: watch interest grow</span>' +
'<div class="ctrl"><label for="ip">Amount ($)<input type="number" id="ip" min="0" max="10000" value="500" style="width:6em"></label><label for="ir">Rate <output id="irv">4%</output><input type="range" id="ir" min="0" max="30" value="4"></label><label for="it">Years <output id="itv">3</output><input type="range" id="it" min="1" max="10" value="3"></label><label for="ik">Type<select id="ik"><option value="s">savings (you earn)</option><option value="l">loan (you pay)</option></select></label></div>' +
'<div class="fig" id="ifig"></div><div class="out" id="iout"></div></div>' +
'<p><b>Fees</b> are charges for a service. Common ones: a monthly account fee, a fee for each transaction, an ATM fee for using another bank&rsquo;s machine, a late-payment fee, a yearly credit card fee, and a fee when a payment bounces because there is not enough money (NSF fee).</p>' +
'<div class="lab"><span class="lt">Try it: choose a bank plan</span>' +
'<div class="ctrl"><label for="pk">Transactions a month <output id="pkv">12</output><input type="range" id="pk" min="0" max="30" value="12"></label></div>' + legend() +
'<div class="fig" id="pfig"></div><div class="out" id="pout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Ali puts $400 in a savings account that pays 3% simple interest a year. How much interest after 2 years?</p><p>One year: 3% of 400 = 0.03 &times; 400 = $12. Two years: 2 &times; 12 = <b>$24</b>. Total in the account: 400 + 24 = $424.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Giving only the interest when the question asks for the total. On a loan, the total you pay back is the amount borrowed <b>plus</b> the interest.</p></div>' +
A.yt({ q: 'You borrow $200 at 10% simple interest a year for 2 years. How much do you pay back in total?', type: 'num', answer: 240, unit: '$',
  hint: 'Find the interest for one year, then two years, then add the $200.', explain: '10% of 200 = $20 a year. 2 years: $40. Total: 200 + 40 = $240.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Trading, lending, borrowing and donating</h2>' +
'<p>People and organizations share money and other resources (things, time, skills) in different ways.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Way</th><th class="l">What happens</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l"><b>Trading</b></td><td class="l">swap one thing for another</td><td class="l">your comic book for a friend&rsquo;s card game</td></tr>' +
'<tr><td class="l"><b>Lending</b></td><td class="l">let someone use something, and get it back</td><td class="l">a bank lends money; a library lends books</td></tr>' +
'<tr><td class="l"><b>Borrowing</b></td><td class="l">use something that belongs to someone else, and give it back</td><td class="l">a family borrows money for a house (a mortgage)</td></tr>' +
'<tr><td class="l"><b>Donating</b></td><td class="l">give money, things or time and expect nothing back</td><td class="l">giving to a food bank; volunteering</td></tr></tbody></table></div>' +
'<div class="vs"><b class="t">Lending or borrowing?</b><p>It is one event seen from two sides. When Jo lends Kim $10, <b>Jo is lending</b> and <b>Kim is borrowing</b>. Ask: whose money is it? The owner lends. The other person borrows.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Kim borrows $50 from a bank at 6% a year for one year. Kim pays back 50 + 0.06 &times; 50 = 50 + 3 = <b>$53</b>. Borrowing $50 from a parent with no interest would cost only $50, but it is still a promise to pay back.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Lending and borrowing come with a promise to return. Donating has no promise to return. Trading is a swap now.</p></div>' +
A.yt({ q: 'You let a friend use your calculator for a test, and they give it back after. You are&hellip;', type: 'mc', options: ['trading', 'lending', 'borrowing', 'donating'], answer: 1,
  hint: 'It is your calculator, and you get it back.', explain: 'The owner who gets it back is lending. Your friend is borrowing.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function sv() {
        var g = Math.max(1, Math.min(5000, +$('#sg', root).value || 1)), h = Math.max(0, Math.min(5000, +$('#sh', root).value || 0)), p = Math.max(1, Math.min(500, +$('#sp', root).value || 1));
        if (h >= g) { $('#sfig', root).innerHTML = ''; $('#sout', root).innerHTML = '<p class="big">Goal reached already!</p><p>You have ' + m(h) + ' and the goal is ' + m(g) + '.</p>'; return; }
        var need = g - h, wk = Math.ceil(need / p - 1e-9), exact = need % p === 0;
        $('#sfig', root).innerHTML = saveChart(g, h, p);
        $('#sout', root).innerHTML = '<p>Still needed: ' + m(g) + ' &minus; ' + m(h) + ' = <b>' + m(need) + '</b>.</p><p>' + m(need) + ' &divide; ' + m(p) + ' = ' + fmt(cl(need / p)) + (exact ? '' : ', so round up') + '.</p><p class="big">' + wk + ' week' + (wk === 1 ? '' : 's') + (wk > 52 ? ' (more than a year)' : '') + '</p>' + (wk > 26 ? '<p class="t2">The chart shows the first 26 weeks.</p>' : '');
      }
      A.bind(root, ['sg', 'sh', 'sp'], sv);
      function iv() {
        var p = Math.max(0, Math.min(10000, +$('#ip', root).value || 0)), r = +$('#ir', root).value, t = +$('#it', root).value, loan = $('#ik', root).value === 'l', one = cl(p * r / 100), all = cl(one * t);
        $('#irv', root).textContent = r + '%'; $('#itv', root).textContent = t;
        $('#ifig', root).innerHTML = intChart(p, r, t, loan);
        $('#iout', root).innerHTML = '<p>One year: ' + r + '% of ' + m(p) + ' = ' + (r / 100) + ' &times; ' + fmt(p) + ' = <b>' + m(one) + '</b>.</p><p>' + t + ' year' + (t === 1 ? '' : 's') + ': ' + t + ' &times; ' + m(one) + ' = <b>' + m(all) + '</b> ' + (loan ? 'paid in interest' : 'earned') + '.</p><p class="big">' + (loan ? 'Pay back ' : 'Account total ') + m(p + all) + '</p><p class="t2">' + (loan ? 'Red is the extra you pay for borrowing.' : 'Green is the interest the bank pays you.') + '</p>';
      }
      A.bind(root, ['ip', 'ir', 'it', 'ik'], iv);
      function pv() {
        var k = +$('#pk', root).value, c = PLANS.map(function (p) { return p.f(k); }), lo = Math.min.apply(null, c), best = PLANS.filter(function (p, i) { return c[i] === lo; }).map(function (p) { return p.n; });
        $('#pkv', root).textContent = k;
        $('#pfig', root).innerHTML = planChart(k);
        $('#pout', root).innerHTML = '<div class="tbl"><table><tbody>' + PLANS.map(function (p, i) { return '<tr><th class="l">' + p.n + '</th><td class="l">' + p.d + '</td><td>' + m(c[i]) + '</td></tr>'; }).join('') + '</tbody></table></div><p class="big">Cheapest: ' + best.join(' and ') + '</p><p class="t2">Few transactions: pay per use. Many transactions: a flat fee wins.</p>';
      }
      A.bind(root, ['pk'], pv);
    },

    quiz: [
      { q: 'Which way to pay uses money you <b>borrow</b>?', type: 'mc', options: ['debit card', 'cash', 'credit card', 'gift card'], answer: 2,
        hint: 'Which one is paid back to the bank later?', explain: 'A credit card lends you the bank&rsquo;s money until you pay the bill.' },
      { q: 'You want a $96 jacket. You have $36 and save $12 a week. How many weeks will it take?', type: 'num', answer: 5, unit: 'weeks',
        hint: 'First subtract what you have. Then divide by the weekly amount.', explain: '96 &minus; 36 = 60, and 60 &divide; 12 = 5 weeks.' },
      { q: 'You have $400 in a savings account that pays 3% simple interest a year. How much interest do you earn in 1 year?', type: 'num', answer: 12, unit: '$', tol: 0.005,
        hint: 'Find 3% of 400. 1% of 400 is 4.', explain: '1% of 400 is $4, so 3% is 3 &times; 4 = $12.' },
      { q: 'You borrow $300 at 5% simple interest a year for 2 years. How much do you pay back in total?', type: 'num', answer: 330, unit: '$', tol: 0.005,
        hint: 'Interest for 1 year, then 2 years, then add the amount borrowed.', explain: '5% of 300 = $15 a year. 2 years: $30. Total: 300 + 30 = $330.' },
      { q: 'An ATM charges a $2.50 fee. You use it 6 times this month. How much do you pay in fees?', type: 'num', answer: 15, unit: '$', tol: 0.005,
        hint: 'Multiply the fee by the number of times.', explain: '6 &times; $2.50 = $15.00.' },
      { q: 'A library lets you take a book home for 3 weeks. The library is&hellip;', type: 'mc', options: ['trading', 'lending', 'borrowing', 'donating'], answer: 1,
        hint: 'The library owns the book and gets it back.', explain: 'The owner who gets it back is lending. You are borrowing.' },
      { q: 'Which can <b>get in the way</b> of a saving goal?', type: 'mc', options: ['making a budget', 'comparing prices', 'buying on impulse', 'saving first'], answer: 2,
        hint: 'Which one happens without a plan?', explain: 'Impulse buying spends money you planned to save.' }
    ],

    practice: [
      { id: 'mo-pay', name: 'Ways to pay', code: 'F1.1', gen: function (lv) {
        var b = PAY.slice(lv === 1 ? 0 : lv === 2 ? 2 : 4, lv === 1 ? 5 : lv === 2 ? 8 : 10), r = bankQ(b);
        return { q: r.x[0], type: 'mc', options: r.o.options, answer: r.o.answer, v: { right: r.x[1] },
          hint: 'Ask: whose money is it (yours or borrowed)? Is it in person or online? What could go wrong?', steps: ['Think about where the money comes from and what it costs.', 'Look at each choice and rule out the ones that do not fit.', 'The best answer: ' + r.x[1] + '.'], explain: 'Answer: ' + r.x[1] + '.' };
      } },
      { id: 'mo-goal', name: 'Saving goals', code: 'F1.2', gen: function (lv) {
        var per, have = 0, goal, w = R.int(3, 12), q, item = R.pick(['a bike', 'a game console', 'a pair of skates', 'a tablet', 'a guitar', 'a tent for camping']), extra = '';
        if (lv === 1) { per = R.pick([5, 10, 15, 20, 25]); goal = per * w; q = 'You want ' + item + ' that costs ' + m(goal) + '. You save ' + m(per) + ' each week and have nothing saved yet. How many weeks will it take?'; }
        else if (lv === 2) { per = R.pick([10, 15, 20, 25, 30]); have = R.int(1, 9) * 5; goal = have + per * (w - 1) + R.int(1, per / 5) * 5; q = 'You want ' + item + ' that costs ' + m(goal) + '. You have ' + m(have) + ' and save ' + m(per) + ' each week. How many weeks will it take?'; }
        else if (R.int(0, 1)) { var al = R.int(5, 15) * 2; per = al / 2; have = R.int(0, 6) * 5; goal = have + per * (w - 1) + R.int(1, per); extra = 'You get ' + m(al) + ' a week and save half of it. '; q = extra + 'You have ' + m(have) + '. How many weeks until you have ' + m(goal) + ' for ' + item + '?'; }
        else { var e = R.pick([8, 10, 12, 15]), n = R.int(2, 4); per = e * n; have = R.int(0, 6) * 5; goal = have + per * (w - 1) + R.int(1, per); extra = 'You earn ' + m(e) + ' for each dog walk and do ' + n + ' walks a week. You save it all. '; q = extra + 'You have ' + m(have) + '. How many weeks until you have ' + m(goal) + ' for ' + item + '?'; }
        var need = goal - have, wk = Math.ceil(need / per - 1e-9), st = [];
        if (extra) st.push('Saved each week: ' + m(per) + '.');
        if (have) st.push('Still needed: ' + m(goal) + ' &minus; ' + m(have) + ' = ' + m(need) + '.');
        st.push(m(need) + ' &divide; ' + m(per) + ' = ' + fmt(cl(need / per)) + (need % per ? ', so round up to ' + wk : '') + ' weeks.<div class="fig">' + saveChart(goal, have, per) + '</div>');
        if (st.length < 3) st.unshift('Divide the amount you need by the amount you save each week.');
        return { q: q, type: 'num', answer: wk, unit: 'weeks', v: { goal: goal, have: have, per: per },
          hint: have ? 'Subtract what you have first. Then divide. Round up if it is not a whole number.' : 'Divide the cost by the weekly amount.', steps: st, explain: 'It takes ' + wk + ' weeks.' };
      } },
      { id: 'mo-needs', name: 'Goals, needs and wants', code: 'F1.3', gen: function (lv) {
        var b = GOAL.slice(lv === 1 ? 0 : lv === 2 ? 2 : 6, lv === 1 ? 6 : lv === 2 ? 8 : 10), r = bankQ(b);
        return { q: r.x[0], type: 'mc', options: r.o.options, answer: r.o.answer, v: { right: r.x[1] },
          hint: 'Earning = making money. Saving = keeping it. Need = must have. Want = nice to have.', steps: ['Read each choice carefully.', 'Use the definitions: earning or saving, short or long term, need or want, helps or hurts.', 'The answer: ' + r.x[1] + '.'], explain: 'Answer: ' + r.x[1] + '.' };
      } },
      { id: 'mo-interest', name: 'Simple interest', code: 'F1.4', gen: function (lv) {
        var p, r, t = 1, total = false, loan = R.int(0, 1) === 1;
        if (lv === 1) { p = R.int(2, 50) * 10; r = 10; }
        else if (lv === 2) { p = R.int(1, 20) * 50; r = R.pick([2, 3, 4, 5, 6, 8, 12, 15, 20]); }
        else { p = R.int(1, 20) * 100; r = R.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]); t = R.int(2, 5); total = true; }
        var one = cl(p * r / 100), it = cl(one * t), ans = total ? cl(p + it) : it;
        var q = loan ? 'You borrow ' + m(p) + ' at ' + r + '% simple interest a year' + (t > 1 ? ' for ' + t + ' years' : '') + '. ' + (total ? 'How much do you pay back in total?' : 'How much interest do you pay in 1 year?')
          : 'You save ' + m(p) + ' in an account that pays ' + r + '% simple interest a year. ' + (total ? 'How much is in the account after ' + t + ' years?' : 'How much interest do you earn in 1 year?');
        var st = [r + '% of ' + m(p) + ': ' + (r === 10 ? 'move the decimal one place left' : '1% is ' + m(p / 100) + ', so ' + r + '% is ' + r + ' &times; ' + m(p / 100)) + ' = ' + m(one) + '.'];
        if (t > 1) st.push(t + ' years: ' + t + ' &times; ' + m(one) + ' = ' + m(it) + '.');
        st.push(total ? 'Total: ' + m(p) + ' + ' + m(it) + ' = ' + m(ans) + '.' : 'The interest is ' + m(ans) + '.');
        if (st.length < 3) st.unshift('Interest for one year = rate &times; amount.');
        return { q: q, type: 'num', answer: ans, unit: '$', tol: 0.005, fig: lv === 3 ? intChart(p, r, t, loan) : '', v: { p: p, r: r, t: t, total: total },
          hint: total ? 'Find one year of interest, multiply by the years, then add the starting amount.' : 'Find ' + r + '% of ' + m(p) + '. Start with 1%' + (r === 10 ? ' or 10%' : '') + '.', steps: st, explain: 'The answer is ' + m(ans) + '.' };
      } },
      { id: 'mo-fees', name: 'Bank fees', code: 'F1.4', gen: function (lv) {
        var v, q, ans, st, type = 'num', o;
        if (lv === 1) {
          if (R.int(0, 1)) { var f = R.pick([1.5, 2, 2.5, 3]), n = R.int(2, 8); ans = cl(f * n); v = { kind: 'atm', f: f, n: n }; q = 'An ATM charges a ' + m(f) + ' fee each time. You use it ' + n + ' times. How much do you pay in fees?'; st = ['Each use costs ' + m(f) + '.', n + ' &times; ' + m(f) + ' = ' + m(ans) + '.', 'Tip: using your own bank&rsquo;s machine is often free.']; }
          else { var mf = R.pick([3, 4, 5, 6, 9, 12]); ans = mf * 12; v = { kind: 'year', f: mf }; q = 'A bank account has a ' + m(mf) + ' fee every month. How much is that in one year?'; st = ['A year has 12 months.', '12 &times; ' + m(mf) + ' = ' + m(ans) + '.', 'Small monthly fees add up over a year.']; }
        } else if (lv === 2) {
          if (R.int(0, 1)) { var c = R.pick([0.5, 0.75, 1]), k = R.int(5, 30); ans = cl(c * k); v = { kind: 'per', c: c, k: k }; q = 'A plan charges ' + m(c) + ' for each transaction. You make ' + k + ' transactions this month. What is the cost?'; st = ['Each transaction costs ' + m(c) + '.', k + ' &times; ' + m(c) + ' = ' + m(ans) + '.', 'The monthly cost is ' + m(ans) + '.']; }
          else { var b = R.pick([1, 1.5, 2]), fr = R.pick([5, 10, 15]), c2 = R.pick([0.5, 1]), k2 = fr + R.int(1, 15); ans = cl(b + c2 * (k2 - fr)); v = { kind: 'free', b: b, fr: fr, c: c2, k: k2 }; q = 'A plan costs ' + m(b) + ' a month. The first ' + fr + ' transactions are free, then each one costs ' + m(c2) + '. What do ' + k2 + ' transactions cost in a month?'; st = ['Transactions that are not free: ' + k2 + ' &minus; ' + fr + ' = ' + (k2 - fr) + '.', (k2 - fr) + ' &times; ' + m(c2) + ' = ' + m(c2 * (k2 - fr)) + '.', 'Add the monthly cost: ' + m(b) + ' + ' + m(c2 * (k2 - fr)) + ' = ' + m(ans) + '.']; }
        } else {
          var F = R.pick([4, 5, 6]), c3 = R.pick([0.5, 0.75, 1]), k3; do { k3 = R.int(3, 25); } while (Math.abs(c3 * k3 - F) < 0.01);
          var bc = cl(c3 * k3), right = bc < F ? 'Plan B' : 'Plan A'; type = 'mc'; o = R.mc(right, [right === 'Plan A' ? 'Plan B' : 'Plan A', 'They cost the same']);
          v = { kind: 'cmp', F: F, c: c3, k: k3, right: right }; ans = o.answer;
          q = 'Plan A costs ' + m(F) + ' a month with unlimited transactions. Plan B costs ' + m(c3) + ' per transaction. You make ' + k3 + ' transactions a month. Which plan is cheaper?';
          st = ['Plan A: ' + m(F) + '.', 'Plan B: ' + k3 + ' &times; ' + m(c3) + ' = ' + m(bc) + '.', right + ' is cheaper (' + m(Math.min(F, bc)) + ' instead of ' + m(Math.max(F, bc)) + ').'];
        }
        var r = { q: q, type: type, v: v, hint: lv === 3 ? 'Work out the cost of each plan for this many transactions.' : 'Multiply the fee by how many times you pay it.', steps: st };
        if (type === 'mc') { r.options = o.options; r.answer = o.answer; r.explain = v.right + ' is cheaper.'; }
        else { r.answer = ans; r.unit = '$'; r.tol = 0.005; r.explain = 'The fees are ' + m(ans) + '.'; }
        return r;
      } },
      { id: 'mo-share', name: 'Trade, lend, borrow, donate', code: 'F1.5', gen: function (lv) {
        if (lv === 3 && R.int(0, 1)) {
          var r3 = bankQ(SHARE3);
          return { q: r3.x[0], type: 'mc', options: r3.o.options, answer: r3.o.answer, v: { right: r3.x[1] }, hint: 'Lenders own the money. Borrowers use it and pay it back, often with interest.', steps: ['Who owns the money or resource?', 'Who uses it, and is it returned?', 'The answer: ' + r3.x[1] + '.'], explain: 'Answer: ' + r3.x[1] + '.' };
        }
        var x = R.pick(lv === 1 ? SHARE.slice(0, 5) : SHARE), o = R.mc(x[1], WAYS.filter(function (w) { return w !== x[1]; }));
        return { q: x[0], type: 'mc', options: o.options, answer: o.answer, v: { right: x[1] },
          hint: 'Swap = trading. Given back later = lending (owner) or borrowing (user). Nothing back = donating.', steps: ['Is something swapped, returned later, or given away?', { trading: 'Two things are swapped now: trading.', lending: 'The owner lets someone use it and gets it back: lending.', borrowing: 'Someone uses what belongs to another and gives it back: borrowing.', donating: 'It is given away with nothing back: donating.' }[x[1]], 'The answer is ' + x[1] + '.'], explain: 'This is ' + x[1] + '.' };
      } }
    ]
  });
  /* ---------- practice shapes: more ways to ask each skill (docs/QUESTIONS.md). Answer checks: tests/verify/grade6.js ---------- */
  (function () {
    var KIT = A.Q, why = G6.why, nm = KIT.name, OPS = ['Add', 'Subtract', 'Multiply', 'Divide'];
    var PAYWAY = { cash: 'coins and bills you carry with you', 'debit card': 'takes money straight from your bank account', 'credit card': 'borrowed money that you pay back later',
      'e-transfer': 'sends money online from your bank account', 'gift card': 'spends only the money loaded on it, often at one store' };
    var BORROWED = ['credit card', 'buy now, pay later'], FROMBANK = ['debit card', 'e-transfer'], ALLPAY = ['cash', 'debit card', 'credit card', 'e-transfer', 'gift card', 'buy now, pay later'];
    var NEEDS = ['a warm winter coat', 'healthy food', 'a place to live', 'winter boots', 'clean water'], WANTS = ['the newest phone', 'a third video game', 'concert tickets', 'a designer phone case', 'a new skateboard'];
    var WHEN = ['saving $10 for a movie this weekend', 'saving $40 for a gift next month', 'saving $300 for a bike next summer', 'saving for college'];
    /* who acts, and what happens to the thing: swap, returned, or given away */
    var ACTS = [
      ['Ali swaps a hockey card for a friend’s comic book. Ali is&hellip;', { swap: 1 }], ['Two classmates exchange lunches. They are&hellip;', { swap: 1 }],
      ['Mia lets her cousin use her tent for a weekend, and he brings it back. Mia is&hellip;', { returned: 1, owner: 1 }], ['A bank gives a family money for a house, to be paid back with interest. The bank is&hellip;', { returned: 1, owner: 1 }],
      ['Sam uses his neighbour’s ladder and will give it back on Friday. Sam is&hellip;', { returned: 1, owner: 0 }], ['Leah gets $15 from her dad and will pay it back next week. Leah is&hellip;', { returned: 1, owner: 0 }],
      ['Noah gives his old coat to a shelter and expects nothing back. Noah is&hellip;', {}], ['Priya spends Saturday helping at a food bank. Priya is&hellip;', {}]
    ];
    function way(a) { return a.swap ? 'trading' : a.returned ? (a.owner ? 'lending' : 'borrowing') : 'donating'; }
    function picked(list) { var l = R.shuffle(list); return { options: l.map(function (x) { return x[0]; }), answer: l.map(function (x, j) { return x[1] ? j : -1; }).filter(function (j) { return j >= 0; }) }; }
    function goalNums() { var per = R.pick([5, 10, 15, 20, 25]), have = R.int(1, 6) * 5, w = R.int(3, 12), goal = have + per * (w - 1) + R.int(1, per / 5) * 5; return { per: per, have: have, goal: goal, wk: Math.ceil((goal - have) / per) }; }
    var SHAPES = {
      'mo-pay': [
        [1, 'match', function () {
          var ks = R.shuffle(Object.keys(PAYWAY)).slice(0, 3);
          return { q: 'Match each way to pay to what it does.', type: 'match', pairs: ks.map(function (k) { return [k.charAt(0).toUpperCase() + k.slice(1), PAYWAY[k]]; }),
            hint: 'Whose money is it? Where does it come from?', steps: ks.map(function (k) { return k + ': ' + PAYWAY[k] + '.'; }), explain: 'Each way to pay moves money differently.', meta: { k: 'g6-pay-match' } };
        }],
        [1, 'pick', function () {
          var ask = R.pick([['uses <b>borrowed</b> money', BORROWED, 'borrowed'], ['takes money <b>from your bank account</b>', FROMBANK, 'bank']]), o = picked(ALLPAY.map(function (p) { return [p, ask[1].indexOf(p) >= 0]; }));
          return { q: 'Pick every way to pay that ' + ask[0] + '.', type: 'pick', options: o.options, answer: o.answer,
            hint: 'Think about where the money comes from.', steps: ['These do: ' + ask[1].join(' and ') + '.'], explain: ask[1].join(' and ') + '.', meta: { k: 'g6-pay-pick', ask: ask[2] } };
        }],
        [1, 'mistake', function () {
          var p = R.pick(ALLPAY), who = nm(), truth = BORROWED.indexOf(p) >= 0;
          return { q: who + ' says paying with a <b>' + p + '</b> uses borrowed money that must be paid back. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(truth ? 'A ' + p + ' lets you spend money now and pay it back later.' : 'A ' + p + ' uses money that is already yours.', ['Every card uses borrowed money.', 'Only cash is real money.']),
            hint: 'Is the money already yours?', steps: [truth ? 'It is borrowed.' : 'It is your own money.'], explain: truth ? 'True: it is borrowed.' : 'False: it is your own money.', meta: { k: 'g6-pay-tf', p: p } };
        }]
      ],
      'mo-goal': [
        [1, 'line', function () {
          var per = R.pick([5, 10, 20, 25]), w = R.int(2, 15), goal = per * w;
          return { q: 'A ' + R.pick(['bike', 'tent', 'guitar']) + ' costs ' + m(goal) + '. You save ' + m(per) + ' each week. Place the number of weeks it takes on the line.', type: 'line', min: 0, max: 20, tick: 1, every: 5, snap: 1, answer: w,
            hint: 'Divide the cost by what you save each week.', steps: [m(goal) + ' &divide; ' + m(per) + ' = ' + w + '.'], explain: w + ' weeks.', meta: { k: 'g6-goal-line', goal: goal, have: 0, per: per } };
        }],
        [1, 'fill', function () {
          var g0 = goalNums();
          return { q: 'A game console costs ' + m(g0.goal) + '. You have ' + m(g0.have) + ' and save ' + m(g0.per) + ' each week.', type: 'fill', fill: 'Still needed: $[[]] &nbsp; Weeks: [[]]', answers: [g0.goal - g0.have, g0.wk],
            hint: 'Subtract first. Then divide and round up.', steps: [m(g0.goal) + ' &minus; ' + m(g0.have) + ' = ' + m(g0.goal - g0.have) + '.', m(g0.goal - g0.have) + ' &divide; ' + m(g0.per) + ' is ' + fmt(cl((g0.goal - g0.have) / g0.per)) + ', so ' + g0.wk + ' weeks.'], explain: g0.wk + ' weeks.', meta: { k: 'g6-goal-fill', goal: g0.goal, have: g0.have, per: g0.per } };
        }],
        [1, 'mistake', function () {
          var g0 = goalNums(), who = nm(), truth = !R.int(0, 2), said = truth ? g0.wk : Math.ceil(g0.goal / g0.per);
          if (!truth && said === g0.wk) said = g0.wk + 1;
          return { q: 'Skates cost ' + m(g0.goal) + '. You have ' + m(g0.have) + ' and save ' + m(g0.per) + ' each week. ' + who + ' says it takes <b>' + said + ' weeks</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('You still need ' + m(g0.goal - g0.have) + '. At ' + m(g0.per) + ' a week that takes ' + g0.wk + ' weeks.', ['Divide the full price by the weekly amount.', 'Round down to a whole number of weeks.']),
            hint: 'Take away what you already have first.', steps: [m(g0.goal) + ' &minus; ' + m(g0.have) + ' = ' + m(g0.goal - g0.have) + '.', 'Weeks: ' + g0.wk + '.'], explain: g0.wk + ' weeks.', meta: { k: 'g6-goal-tf', goal: g0.goal, have: g0.have, per: g0.per, said: said } };
        }]
      ],
      'mo-needs': [
        [1, 'pick', function () {
          var o = picked(R.shuffle(NEEDS).slice(0, 2).map(function (x) { return [x, 1]; }).concat(R.shuffle(WANTS).slice(0, 3).map(function (x) { return [x]; })));
          return { q: 'Pick every <b>need</b>.', type: 'pick', options: o.options, answer: o.answer,
            hint: 'A need is something you must have to live safely and healthily.', steps: ['Needs: ' + o.answer.map(function (j) { return o.options[j]; }).join(' and ') + '.'], explain: 'The others are wants: nice to have.', meta: { k: 'g6-needs-pick' } };
        }],
        [1, 'mistake', function () {
          var isNeed = !R.int(0, 1), item = R.pick(isNeed ? NEEDS : WANTS), said = R.pick(['need', 'want']), who = nm();
          return { q: who + ' says <b>' + item + '</b> is a <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: (said === 'need') === isNeed,
            why: why(isNeed ? 'You must have ' + item + ' to live safely, so it is a need.' : 'You can live well without ' + item + ', so it is a want.', ['Anything that costs a lot is a need.', 'Anything you really like is a need.']),
            hint: 'Could you live safely and healthily without it?', steps: [item + ' is a ' + (isNeed ? 'need' : 'want') + '.'], explain: 'It is a ' + (isNeed ? 'need' : 'want') + '.', meta: { k: 'g6-needs-tf', item: item, said: said } };
        }],
        [1, 'order', function () {
          return { q: 'Put these saving goals in order from <b>shortest</b> term to longest term.', type: 'order', items: WHEN.slice(), first: 'shortest', last: 'longest',
            hint: 'How soon is each one needed?', steps: ['This weekend, next month, next summer, then years away.'], explain: 'Short-term goals come soon. Long-term goals take years.', meta: { k: 'g6-needs-order' } };
        }]
      ],
      'mo-interest': [
        [1, 'fill', function () {
          var p = R.int(1, 20) * 50, r = R.pick([2, 3, 4, 5, 6, 8]);
          return { q: 'You save ' + m(p) + ' at ' + r + '% simple interest a year. Find one year of interest.', type: 'fill', fill: '1% of ' + m(p) + ' = $[[]] &nbsp; ' + r + '% = $[[]]', answers: [cl(p / 100), cl(p * r / 100)],
            hint: '1% is one hundredth: divide by 100.', steps: [m(p) + ' &divide; 100 = ' + m(p / 100) + '.', r + ' &times; ' + m(p / 100) + ' = ' + m(p * r / 100) + '.'], explain: m(p * r / 100) + ' of interest.', meta: { k: 'g6-intr-fill', p: p, r: r } };
        }],
        [1, 'way', function () {
          var p = R.int(2, 20) * 100, r = R.pick([2, 4, 5]), t = R.int(2, 5), one = p * r / 100;
          return R.int(0, 1) ? { q: 'You earn ' + m(one) + ' of simple interest each year. How much interest do you earn in ' + t + ' years? Which way do you solve it?', type: 'mc', options: OPS.slice(), answer: 2, hint: 'The same amount comes every year.', steps: [t + ' groups of ' + m(one) + ': multiply.'], explain: 'Multiply: ' + t + ' &times; ' + m(one) + ' = ' + m(one * t) + '.', meta: { k: 'g6-intr-way' } }
            : { q: 'You saved ' + m(p) + ' and earned ' + m(one) + ' interest. How much is in the account now? Which way do you solve it?', type: 'mc', options: OPS.slice(), answer: 0, hint: 'The interest joins your savings.', steps: ['Savings and interest together: add.'], explain: 'Add: ' + m(p) + ' + ' + m(one) + ' = ' + m(p + one) + '.', meta: { k: 'g6-intr-way' } };
        }],
        [1, 'mistake', function () {
          var p = R.int(1, 20) * 100, r = R.pick([2, 3, 4, 5, 6, 8]), t = R.int(2, 4), who = nm(), truth = !R.int(0, 2), said = truth ? p * r * t / 100 : p * r / 100;
          return { q: 'You borrow ' + m(p) + ' at ' + r + '% simple interest a year for ' + t + ' years. ' + who + ' says the interest is <b>' + m(said) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('One year is ' + m(p * r / 100) + '. For ' + t + ' years: ' + t + ' &times; ' + m(p * r / 100) + ' = ' + m(p * r * t / 100) + '.', ['Simple interest is charged only once.', 'The interest is ' + r + ' dollars.']),
            hint: 'Find one year first. How many years are there?', steps: [r + '% of ' + m(p) + ' = ' + m(p * r / 100) + '.', t + ' &times; ' + m(p * r / 100) + ' = ' + m(p * r * t / 100) + '.'], explain: m(p * r * t / 100) + '.', meta: { k: 'g6-intr-tf', p: p, r: r, t: t, said: said } };
        }]
      ],
      'mo-fees': [
        [1, 'line', function () {
          var f = R.pick([1.5, 2, 2.5, 3]), n = R.int(2, 4);
          return { q: 'An ATM charges ' + m(f) + ' each time you use it. You use it ' + n + ' times. Place the total fees, in dollars, on the line.', type: 'line', min: 0, max: 15, tick: 0.5, every: 5, snap: 0.5, answer: f * n,
            hint: n + ' groups of ' + m(f) + '.', steps: [n + ' &times; ' + m(f) + ' = ' + m(f * n) + '.'], explain: 'The fees are ' + m(f * n) + '.', meta: { k: 'g6-fee-line', f: f, n: n } };
        }],
        [1, 'mistake', function () {
          var mf = R.pick([3, 4, 5, 6, 9, 12]), who = nm(), truth = !R.int(0, 2), said = truth ? mf * 12 : mf * 10;
          return { q: 'An account charges ' + m(mf) + ' every month. ' + who + ' says that is <b>' + m(said) + '</b> in one year. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('A year has 12 months: 12 &times; ' + m(mf) + ' = ' + m(mf * 12) + '.', ['A year has 10 months.', 'A fee is only charged once a year.']),
            hint: 'How many months are in a year?', steps: ['12 &times; ' + m(mf) + ' = ' + m(mf * 12) + '.'], explain: m(mf * 12) + ' a year.', meta: { k: 'g6-fee-tf', f: mf, said: said } };
        }],
        [1, 'way', function () {
          var fr = R.pick([5, 10, 15]), k = fr + R.int(2, 12);
          return { q: 'A plan gives you ' + fr + ' free transactions a month. You make ' + k + '. To find how many you pay for, which way do you solve it?', type: 'mc', options: OPS.slice(), answer: 1,
            hint: 'Take the free ones away.', steps: [k + ' &minus; ' + fr + ' = ' + (k - fr) + ' paid transactions.'], explain: 'Subtract: ' + (k - fr) + ' are paid.', meta: { k: 'g6-fee-way' } };
        }]
      ],
      'mo-share': [
        [1, 'match', function () {
          var ws = R.shuffle(['trading', 'lending', 'borrowing', 'donating']).slice(0, 3), xs = ws.map(function (w) { return R.pick(ACTS.filter(function (a) { return way(a[1]) === w; })); });
          return { q: 'Match each story to what is happening.', type: 'match', pairs: xs.map(function (x) { return [x[0], way(x[1])]; }),
            hint: 'Swapped: trading. Given back later: lending or borrowing. Nothing back: donating.', steps: xs.map(function (x) { return way(x[1]) + '.'; }), explain: 'Ask who owns it and whether it comes back.', meta: { k: 'g6-share-match', acts: xs.map(function (x) { return x[1]; }) } };
        }],
        [1, 'mistake', function () {
          var x = R.pick(ACTS), right = way(x[1]), who = nm(), truth = !R.int(0, 2), said = truth ? right : R.pick(['trading', 'lending', 'borrowing', 'donating'].filter(function (w) { return w !== right; }));
          var last = x[0].match(/^(.*\.) ([^.]*) (is|are)&hellip;$/);
          return { q: last[1] + ' ' + who + ' says ' + last[2].replace(/^Th/, 'th') + ' ' + last[3] + ' <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('This is ' + right + '.', ['Lending and borrowing mean the same thing.', 'Any gift is a trade.']),
            hint: 'Is it swapped, given back, or given away?', steps: ['It is ' + right + '.'], explain: 'It is ' + right + '.', meta: { k: 'g6-share-tf', act: x[1], said: said } };
        }],
        [2, 'pick', function () {
          var w = R.pick(['trading', 'donating']), list = R.shuffle(ACTS).slice(0, 6);
          while (!list.some(function (a) { return way(a[1]) === w; })) list = R.shuffle(ACTS).slice(0, 6);
          var shown = list.map(function (a) { return [a[0].replace(/ [^.]*&hellip;$/, ''), way(a[1]) === w, a[1]]; }), l = R.shuffle(shown);
          return { q: 'Pick every story that shows <b>' + w + '</b>.', type: 'pick', options: l.map(function (x) { return x[0]; }), answer: l.map(function (x, j) { return x[1] ? j : -1; }).filter(function (j) { return j >= 0; }),
            hint: w === 'trading' ? 'Two things are swapped.' : 'Something is given away with nothing back.', steps: ['Look at what happens to the thing.'], explain: 'Those stories show ' + w + '.', meta: { k: 'g6-share-pick', want: w, acts: l.map(function (x) { return x[2]; }) } };
        }]
      ]
    };
    Atlas.Q.shapes(CH, SHAPES);
  })();
})();
