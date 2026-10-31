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

  A.register('money', {
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
})();
