(function () {
  var A = Atlas, R = A.R;
  /* Canadian coins and bills. Values in cents. No pennies: prices end in 0 or 5. */
  var C = {
    5: { name: 'nickel', r: 23, lab: '5¢', fill: '#c9ced6', ring: '#8d949e' },
    10: { name: 'dime', r: 20, lab: '10¢', fill: '#d4d8de', ring: '#8d949e' },
    25: { name: 'quarter', r: 27, lab: '25¢', fill: '#c3c8d0', ring: '#7d848e' },
    100: { name: 'loonie', r: 30, lab: '$1', fill: '#e2b84a', ring: '#a37f1c', sides: 11 },
    200: { name: 'toonie', r: 32, lab: '$2', fill: '#e2b84a', ring: '#9aa1ab', two: true },
    500: { name: '$5 bill', bill: '#4f86c6', lab: '$5' }, 1000: { name: '$10 bill', bill: '#8a5ab5', lab: '$10' }, 2000: { name: '$20 bill', bill: '#3f9a5c', lab: '$20' }
  };
  function money(v) { return v >= 100 && v % 100 === 0 ? '$' + v / 100 : v < 100 ? v + '¢' : '$' + Math.floor(v / 100) + ' and ' + (v % 100) + '¢'; }
  function coin(v, x, y) {
    var c = C[v], s = '';
    if (c.bill) return '<g class="coin c' + v + '"><rect x="' + x + '" y="' + (y - 30) + '" width="112" height="60" rx="6" style="fill:' + c.bill + ';stroke:var(--ink)" stroke-width="2"/><rect x="' + (x + 6) + '" y="' + (y - 24) + '" width="100" height="48" rx="4" fill="none" stroke="#fff" stroke-width="1.5" opacity=".6"/><text x="' + (x + 56) + '" y="' + (y + 9) + '" text-anchor="middle" font-size="24" font-weight="700" fill="#fff">' + c.lab + '</text></g>';
    var cx = x + c.r;
    if (c.sides) { var p = []; for (var i = 0; i < c.sides; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / c.sides; p.push((cx + c.r * Math.cos(a)).toFixed(1) + ',' + (y + c.r * Math.sin(a)).toFixed(1)); } s += '<polygon points="' + p.join(' ') + '" style="fill:' + c.fill + ';stroke:' + c.ring + '" stroke-width="3"/>'; }
    else if (c.two) s += '<circle cx="' + cx + '" cy="' + y + '" r="' + c.r + '" style="fill:' + c.ring + ';stroke:#6c737c" stroke-width="2"/><circle cx="' + cx + '" cy="' + y + '" r="' + (c.r - 9) + '" style="fill:' + c.fill + '"/>';
    else s += '<circle cx="' + cx + '" cy="' + y + '" r="' + c.r + '" style="fill:' + c.fill + ';stroke:' + c.ring + '" stroke-width="3"/>';
    return '<g class="coin c' + v + '">' + s + '<text x="' + cx + '" y="' + (y + 7) + '" text-anchor="middle" font-size="' + (c.r < 22 ? 15 : 18) + '" font-weight="700" fill="#2a2420">' + c.lab + '</text></g>';
  }
  function wid(v) { return C[v].bill ? 112 : C[v].r * 2; }
  /* a row of coins and bills, biggest first, wrapping at W */
  function coins(list, label, W) {
    W = W || 420;
    var l = list.slice().sort(function (a, b) { return b - a; }), x = 8, y = 40, s = '', rowH = 0;
    l.forEach(function (v) { var w = wid(v); if (x + w > W - 8) { x = 8; y += rowH + 10; rowH = 0; } rowH = Math.max(rowH, C[v].bill ? 60 : C[v].r * 2); s += coin(v, x, y + (C[v].bill ? 0 : 0)); x += w + 10; });
    if (!l.length) s = '<text x="10" y="44" font-size="17" class="t2">No coins yet</text>';
    var cnt = {}; l.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; });
    return A.svg(W, y + 40, s, label || 'Money: ' + (Object.keys(cnt).sort(function (a, b) { return b - a; }).map(function (v) { return cnt[v] + ' ' + C[v].name + (cnt[v] > 1 ? 's' : ''); }).join(', ') || 'none'));
  }
  /* the fewest coins or bills for an amount */
  function make(v, set) {
    set = set || [2000, 1000, 500, 200, 100, 25, 10, 5];
    var out = []; set.forEach(function (d) { while (v >= d) { out.push(d); v -= d; } }); return out;
  }
  function sumOf(l) { return l.reduce(function (a, b) { return a + b; }, 0); }
  function listName(l) {
    var cnt = {}, k; l.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; });
    k = Object.keys(cnt).map(Number).sort(function (a, b) { return b - a; });
    var parts = k.map(function (v) { return cnt[v] + ' ' + C[v].name + (cnt[v] > 1 ? 's' : ''); });
    return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0];
  }
  /* count up from price to paid on a number line, smallest coins first */
  function countUp(price, paid, label) {
    var ch = make(paid - price).reverse(), W = 440, x0 = 34, x1 = 400, s = '', cur = price, i;
    function X(v) { return x0 + (v - price) / (paid - price) * (x1 - x0); }
    s += '<line x1="' + x0 + '" y1="110" x2="' + x1 + '" y2="110" style="stroke:var(--ink)" stroke-width="3"/>';
    var marks = [price], hops = [];
    ch.forEach(function (d) { hops.push([cur, cur + d, d]); cur += d; marks.push(cur); });
    hops.forEach(function (h, j) {
      var a = X(h[0]), b = X(h[1]), m = (a + b) / 2, ht = Math.min(60, 18 + (b - a) * 0.35);
      s += '<path d="M' + a.toFixed(1) + ' 106 Q' + m.toFixed(1) + ' ' + (106 - ht * 2).toFixed(1) + ' ' + b.toFixed(1) + ' 106" fill="none" style="stroke:var(--strand)" stroke-width="3"/>';
      s += '<text x="' + m.toFixed(1) + '" y="' + (100 - ht).toFixed(1) + '" text-anchor="middle" font-size="' + (b - a < 50 ? 16 : 20) + '" class="tb" style="fill:var(--strand)">+' + money(h[2]) + '</text>';
    });
    marks.forEach(function (v, j) {
      var x = X(v); s += '<line x1="' + x.toFixed(1) + '" y1="100" x2="' + x.toFixed(1) + '" y2="120" style="stroke:var(--ink)" stroke-width="3"/>';
      s += '<text x="' + x.toFixed(1) + '" y="' + (j % 2 && marks.length > 3 ? 168 : 144) + '" text-anchor="middle" font-size="20" class="tb">' + money(v) + '</text>';
    });
    return A.svg(W, 178, s, label || 'Count up from ' + money(price) + ' to ' + money(paid) + ': ' + marks.map(money).join(', '));
  }
  var ITEMS = ['an apple', 'a juice box', 'a pencil', 'an eraser', 'a granola bar', 'a sticker', 'a banana', 'a muffin'];
  var BIG = ['a book', 'a ball', 'a puzzle', 'a toy car', 'a kite', 'a T-shirt', 'a board game', 'a water bottle'];

  /* ---------- Lessons: one idea per screen ---------- */
  var CH = 'money';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function cap(t) { return t ? '<p class="g3-sym" style="font-size:1.1rem;color:var(--ink)">' + t + '</p>' : ''; }
  /* change handed back one coin at a time, counting up from the price */
  function changeView(s) {
    var ch = make(s.paid - s.price).reverse(), got = ch.slice(0, s.k), at = s.price + sumOf(got);
    return '<div>' + (s.line ? countUp(s.price, s.paid) : '') + coins(got, got.length ? 'Change so far: ' + listName(got) : 'No change yet') + cap(s.say || (s.k ? 'Count up: ' + [money(s.price)].concat(got.map(function (d, i) { return money(s.price + sumOf(got.slice(0, i + 1))); })).join(', ') : 'Price ' + money(s.price) + ', paid ' + money(s.paid))) + '</div>';
  }
  function steps(price, paid, last) {
    var ch = make(paid - price).reverse(), out = [{ say: 'The price is ' + money(price) + '. You pay ' + money(paid) + '. Count up to ' + money(paid) + '.', ms: 1800 }];
    ch.forEach(function (d, i) { var to = price + sumOf(ch.slice(0, i + 1)); out.push({ say: 'Add a ' + C[d].name + ': ' + money(to) + '.', act: function (t) { return t.set({ k: i + 1 }, 1300); } }); });
    out.push({ say: last, act: function (t) { return t.set({ line: true }, 2000); } });
    return out;
  }

  var LESSONS = [
    { id: 'coins', title: 'Coins and bills', sub: 'Canadian money, and how to count it.', concepts: [
      { id: 'names', title: 'Know your money', exp: ['F1.1'], skill: 'mn-count',
        body: '<p>Canadian coins: <b>nickel</b> (5¢), <b>dime</b> (10¢), <b>quarter</b> (25¢), <b>loonie</b> ($1), <b>toonie</b> ($2). Bills: $5, $10, $20, $50, $100. 100 cents make 1 dollar. There are no pennies, so cash prices end in 0 or 5.</p>',
        watch: { tool: 'coins', opts: { set: [5, 10, 25, 100, 200] }, steps: [
          { say: 'A nickel is 5¢.', act: function (t) { return t.add(5); }, ms: 900 },
          { say: 'A dime is 10¢. It is smaller than a nickel, but worth more.', act: function (t) { return t.add(10); }, ms: 1300 },
          { say: 'A quarter is 25¢.', act: function (t) { return t.add(25); }, ms: 900 },
          { say: 'A loonie is $1, and a toonie is $2.', act: function (t) { return t.add(100).then(function () { return t.add(200); }); }, ms: 1500 }
        ] },
        try: { tool: 'coins', opts: { set: [5, 10, 25, 100, 200] }, tasks: [
          { do: 'Put out a <b>toonie</b> and a <b>quarter</b>.', goal: function (s) { return s.n === 2 && s.total === 225; }, yes: '$2.25.' }
        ] },
        key: '<p>Nickel 5¢, dime 10¢, quarter 25¢, <b>loonie $1, toonie $2</b>.</p>',
        mistake: '<p>Thinking bigger coins are worth more. The dime is the smallest coin but worth more than the nickel.</p>',
        check: [TU('s1', 0), TU('s1', 2)] },

      { id: 'count', title: 'Count from the biggest', exp: ['F1.1'], skill: 'mn-count',
        body: '<p>Sort the coins and start with the <b>biggest</b>. Count on: quarters by 25s, dimes by 10s, nickels by 5s.</p>',
        watch: { tool: 'coins', opts: { start: [5, 25, 10, 25] }, steps: [
          { say: 'Four coins, all mixed up.', ms: 1300 },
          { say: 'Sort them, biggest first.', act: function (t) { return t.sort(); }, ms: 900 },
          { say: 'Count on: 25, 50, 60, 65. That is <b>65¢</b>.', act: function (t) { return t.countAll(); }, ms: 2000 }
        ] },
        try: { tool: 'coins', opts: { set: [5, 10, 25, 100, 200] }, tasks: [
          { do: 'Make <b>65¢</b>.', goal: function (s) { return s.total === 65; }, yes: '65¢.' },
          { do: 'Make <b>$3.40</b>.', goal: function (s) { return s.total === 340; }, yes: '$3.40.' }
        ] },
        key: '<p><b>Biggest first</b>, then count on.</p>',
        check: [TU('s1', 1), SK('mn-count', 1), SK('mn-count', 2)] },

      { id: 'make', title: 'Many ways to make an amount', exp: ['F1.1'], skill: 'mn-make', hard: true,
        body: '<p>The same amount can be made with different coins. 50¢ is 2 quarters, or 5 dimes, or 1 quarter, 2 dimes and 1 nickel. The <b>fewest coins</b> uses the biggest coins first.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + coins(s.l) + cap(s.say) + '</div>'; }, { l: [25, 25], say: '2 quarters: 50¢' }), steps: [
          { say: '2 quarters: 50¢.', ms: 1500 },
          { say: '5 dimes: also 50¢.', act: function (t) { return t.set({ l: [10, 10, 10, 10, 10], say: '5 dimes: 50¢' }, 1600); } },
          { say: 'A quarter, 2 dimes and a nickel: 50¢ again.', act: function (t) { return t.set({ l: [25, 10, 10, 5], say: '25 + 10 + 10 + 5 = 50¢' }, 1800); } },
          { say: 'Same amount, different coins. The fewest is <b>2 quarters</b>.', ms: 1800 }
        ] },
        ways: [
          { label: 'Biggest first', html: '<p>To make 85¢ with the fewest coins: take quarters while you can (25, 50, 75), then a dime (85).</p><div class="fig">' + coins([25, 25, 25, 10]) + '</div>' },
          { label: 'Trade', html: '<p>2 dimes and a nickel make a quarter. 5 nickels make a quarter too. Trading keeps the amount the same.</p>' }
        ],
        try: { tool: 'coins', opts: { set: [5, 10, 25] }, tasks: [
          { do: 'Make <b>75¢</b> using only dimes and nickels.', goal: function (s) { return s.total === 75 && s.items.indexOf(25) < 0; }, yes: function (s) { return s.n + ' coins.'; } },
          { do: 'Now make <b>75¢</b> with the <b>fewest</b> coins.', goal: function (s) { return s.total === 75 && s.n === 3; }, yes: '3 quarters.' }
        ] },
        key: '<p>Same amount, <b>many ways</b>. Fewest: biggest coins first.</p>',
        mistake: '<p>Counting the number of coins instead of their value (5 coins means 5¢). Ask: "What is each coin worth?"</p>',
        check: [SK('mn-make', 1), SK('mn-make', 2)] }
    ] },

    { id: 'dollar', title: 'Change from a dollar', sub: 'Count up from the price.', concepts: [
      { id: 'countup', title: 'Count up to $1', exp: ['F1.1'], skill: 'mn-cents',
        body: '<p><b>Change</b> is the money you get back when you pay more than the price. To find it, <b>count up</b> from the price to what you paid. Small coins first, to reach a friendly number.</p>',
        watch: { mount: G3.view(changeView, { price: 65, paid: 100, k: 0, line: false }), steps: steps(65, 100, 'The change is 10¢ + 25¢ = <b>35¢</b>.') },
        try: { mount: G3.play({ state: { price: 80, paid: 100, k: 0, line: false }, draw: changeView,
          sliders: [{ key: 'price', label: 'Price', min: 5, max: 95, step: 5, fmt: function (v) { return v + '¢'; } }],
          buttons: [{ label: 'Give the next coin', act: function (s) { if (s.k < make(s.paid - s.price).length) s.k++; } }, { label: 'Start over', act: function (s) { s.k = 0; } }],
          info: function (s) { return s.k === make(s.paid - s.price).length ? 'Change: <b>' + money(s.paid - s.price) + '</b>' : ''; },
          tasks: [{ do: 'A pencil costs <b>80¢</b>. You pay $1. Count up the change.', goal: function (s) { return s.price === 80 && s.k === make(20).length; }, yes: '2 dimes: 20¢.' },
            { do: 'Pick your own price and count up the change.', goal: function (s) { return s.price !== 80 && s.k === make(s.paid - s.price).length; }, yes: function (s) { return money(s.price) + ' + ' + money(s.paid - s.price) + ' = $1.'; } }] }), do: '' },
        key: '<p>Change: <b>count up from the price</b>.</p>',
        mistake: '<p>Forgetting that $1 = 100¢. Change from $1 is 100 minus the price.</p>',
        check: [TU('s2', 0), TU('s2', 1), SK('mn-cents', 1)] },

      { id: 'give', title: 'Give the change', exp: ['F1.1'], skill: 'mn-cents', hard: true,
        body: '<p>Now be the cashier. Work out the change, then <b>hand over coins</b> that make it. $1 is 100¢, so change from $1 is <b>100 minus the price</b>.</p>',
        watch: { mount: G3.view(changeView, { price: 45, paid: 100, k: 0, line: false }), steps: steps(45, 100, '45 + 55 = 100. The change is <b>55¢</b>.') },
        ways: [
          { label: 'Subtract', html: '<p class="math">100 &minus; 45 = 55</p><p>So the change is 55¢.</p>' },
          { label: 'Make 100', html: '<p>What goes with 45 to make 100? 45 + 5 = 50, and 50 + 50 = 100. 5 + 50 = <b>55¢</b>.</p>' }
        ],
        try: { tool: 'coins', opts: { set: [5, 10, 25] }, tasks: [
          { do: 'A juice box costs <b>65¢</b>. The customer pays $1. Give the change.', goal: function (s) { return s.total === 35; }, yes: '35¢ change.' },
          { do: 'A muffin costs <b>55¢</b>. Give the change from $1.', goal: function (s) { return s.total === 45; }, yes: '45¢ change.' }
        ] },
        key: '<p>Change from $1 = <b>100 &minus; price</b>.</p>',
        check: [TU('s2', 2), SK('mn-cents', 2), SK('mn-cents', 3)] }
    ] },

    { id: 'bills', title: 'Change from a bill', sub: 'Whole dollars.', concepts: [
      { id: 'bill', title: 'Pay with a bill', exp: ['F1.1'], skill: 'mn-dollars',
        body: '<p>For whole-dollar prices, count up the same way with loonies, toonies and bills.</p>',
        watch: { mount: G3.view(changeView, { price: 1300, paid: 2000, k: 0, line: false }), steps: steps(1300, 2000, 'The change is $2 + $5 = <b>$7</b>.') },
        try: { mount: G3.play({ state: { price: 600, paid: 1000, k: 0, line: false }, draw: changeView,
          sliders: [{ key: 'price', label: 'Price', min: 100, max: 1900, step: 100, fmt: function (v) { return '$' + v / 100; } }],
          selects: [{ key: 'paid', label: 'You pay with', options: [[500, 'a $5 bill'], [1000, 'a $10 bill'], [2000, 'a $20 bill']], change: function (s) { s.k = 0; } }],
          buttons: [{ label: 'Give the next coin or bill', act: function (s) { if (s.paid > s.price && s.k < make(s.paid - s.price).length) s.k++; } }, { label: 'Start over', act: function (s) { s.k = 0; } }],
          info: function (s) { return s.paid <= s.price ? 'That bill is not enough. Pick a bigger one.' : s.k === make(s.paid - s.price).length ? 'Change: <b>' + money(s.paid - s.price) + '</b>' : ''; },
          tasks: [{ do: 'A book costs <b>$6</b>. Pay with <b>$10</b>. Count up the change.', goal: function (s) { return s.price === 600 && s.paid === 1000 && s.k === make(400).length; }, yes: '$4 change: 2 toonies.' }] }), do: '' },
        key: '<p>Count up <b>to the bill</b>.</p>',
        check: [TU('s3', 0), TU('s3', 1), SK('mn-dollars', 1)] },

      { id: 'subtract', title: 'Count up or subtract', exp: ['F1.1'], skill: 'mn-dollars', hard: true,
        body: '<p>Counting up and subtracting give the same answer. <b>$10 &minus; $7 = $3</b>, and $7 + $3 = $10.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 20, tick: 1, every: 5, start: 7 }, steps: [
          { say: 'A toy costs $7. You pay $10.', act: function (t) { return t.mark(10, '$10'); }, ms: 1300 },
          { say: 'Count up: $8, $9, $10. 3 jumps.', act: function (t) { return t.jumps(1, 3, 350); } },
          { say: 'Or subtract: 10 &minus; 7 = 3. Both give <b>$3</b>.', ms: 2000 }
        ] },
        ways: [
          { label: 'Use a fact', html: '<p>15 + 5 = 20, so $20 &minus; $15 = <b>$5</b>.</p>' },
          { label: 'With bills', html: '<p>Pay $20 for a $12 game. $12 + $3 = $15, then $15 + $5 = $20. $3 + $5 = <b>$8</b>.</p><div class="fig">' + countUp(1200, 2000) + '</div>' }
        ],
        key: '<p>Count up <b>or</b> subtract: same change.</p>',
        mistake: '<p>Adding the price and the bill ($6 + $10 = $16). Ask: "Do you get back more than you paid?"</p>',
        check: [TU('s3', 2), SK('mn-dollars', 2), SK('mn-dollars', 3)] }
    ] },

    { id: 'estimate', title: 'Estimating', sub: 'About how much, and is it enough?', concepts: [
      { id: 'round', title: 'Estimate the change', exp: ['F1.1'], skill: 'mn-estimate',
        body: '<p>Round the price to a friendly number, like 25¢, 50¢ or 75¢. Then find the change. The estimate tells you if the real change <b>makes sense</b>.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 100, tick: 5, every: 25, start: 70 }, steps: [
          { say: 'A muffin costs 70¢. You pay $1.', ms: 1400 },
          { say: '70 is close to 75: 3 quarters.', act: function (t) { return t.moveTo(75); }, ms: 1200 },
          { say: 'One more quarter makes $1. About <b>25¢</b> change. The exact change, 30¢, is close.', act: function (t) { return t.jumps(25, 1); }, ms: 2000 }
        ] },
        key: '<p>Round to <b>quarters</b>, then count up.</p>',
        check: [TU('s4', 0), SK('mn-estimate', 1)] },

      { id: 'enough', title: 'Do I have enough?', exp: ['F1.1'], skill: 'mn-estimate', hard: true,
        body: '<p>Before you pay, add the prices roughly. If they come to <b>less than what you have</b>, you have enough.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + coins([1000], 'A $10 bill') + cap(s.say) + '</div>'; }, { say: 'You have $10' }), steps: [
          { say: 'You have $10. A puzzle is $4 and a ball is $5.', ms: 1600 },
          { say: 'Add: 4 + 5 = 9.', act: function (t) { return t.set({ say: '$4 + $5 = $9' }, 1500); } },
          { say: '9 is less than 10. <b>Enough</b>, with $1 left.', act: function (t) { return t.set({ say: '$9 &lt; $10: enough' }, 2000); } }
        ] },
        ways: [
          { label: 'Round up', html: '<p>Prices $3.75 and $4.80? Round up to $4 and $5: $9. If $9 is enough, the real total is enough too.</p>' },
          { label: 'Take away as you go', html: '<p>$10, spend $4: $6 left. Spend $5: $1 left. Still not below zero, so enough.</p>' }
        ],
        try: { mount: G3.play({ state: { a: 4, b: 3 }, draw: function (s) { return coins([1000], 'A $10 bill') + '<p class="g3-sym" style="font-size:1.2rem;color:var(--ink)">$' + s.a + ' + $' + s.b + ' = $' + (s.a + s.b) + '</p>'; },
          sliders: [{ key: 'a', label: 'First item', min: 1, max: 9, fmt: function (v) { return '$' + v; } }, { key: 'b', label: 'Second item', min: 1, max: 9, fmt: function (v) { return '$' + v; } }],
          info: function (s) { var t = s.a + s.b; return t <= 10 ? '<b>Enough</b>: $' + (10 - t) + ' left.' : '<b>Not enough</b>: $' + (t - 10) + ' short.'; },
          tasks: [{ do: 'Choose two items that cost <b>exactly $10</b> together.', goal: function (s) { return s.a + s.b === 10; }, yes: 'Exactly enough, with $0 left.' },
            { do: 'Now choose two items you <b>cannot</b> afford.', reset: false, goal: function (s) { return s.a + s.b > 10; }, yes: function (s) { return '$' + (s.a + s.b) + ' is more than $10.'; } }] }), do: '' },
        key: '<p>Total <b>less than or equal to</b> what you have? Enough.</p>',
        mistake: '<p>Comparing only one price to the money. Add all the prices first.</p>',
        check: [TU('s4', 1), TU('s4', 2), SK('mn-estimate', 2)] }
    ] }
  ];

  A.register('money', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Canadian coins and bills</h2>' +
'<p>In Canada we use these coins: the <b>nickel</b> (5¢), <b>dime</b> (10¢), <b>quarter</b> (25¢), <b>loonie</b> ($1) and <b>toonie</b> ($2). 100 cents make 1 dollar. Bills come in $5, $10, $20, $50 and $100. Canada no longer uses pennies, so cash prices end in 0 or 5.</p>' +
'<div class="fig">' + coins([5, 10, 25, 100, 200], 'A nickel, a dime, a quarter, a loonie and a toonie') + '</div>' +
'<div class="fig">' + coins([500, 1000, 2000], 'A $5 bill, a $10 bill and a $20 bill') + '</div>' +
'<div class="lab"><span class="lt">Try it: count the coins</span>' +
'<div class="btnrow"><button type="button" class="btn alt" data-add="5">+ nickel</button><button type="button" class="btn alt" data-add="10">+ dime</button><button type="button" class="btn alt" data-add="25">+ quarter</button><button type="button" class="btn alt" data-add="100">+ loonie</button><button type="button" class="btn alt" data-add="200">+ toonie</button><button type="button" class="btn alt" data-add="0">Clear</button></div>' +
'<div class="fig" id="cfig"></div><div class="out" id="cout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Sort the coins and start with the biggest. Count on: quarters by 25s, dimes by 10s, nickels by 5s.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>2 quarters, 1 dime and 1 nickel. Start with the biggest: 25, 50. Then the dime: 60. Then the nickel: 65. That is <b>65¢</b>.</p><div class="fig">' + coins([25, 25, 10, 5]) + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Change from a dollar</h2>' +
'<p><b>Change</b> is the money you get back when you pay more than the price. To find it, <b>count up</b> from the price to the amount you paid. Use small coins first to reach a friendly number, then bigger coins.</p>' +
'<div class="lab"><span class="lt">Try it: pay with a loonie</span>' +
'<div class="ctrl"><label for="cp">Price: <output id="cpo"></output><input type="range" id="cp" min="5" max="95" step="5" value="65"></label></div>' +
'<div class="fig" id="cpfig"></div><div class="out" id="cpout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a dollar is 10 dimes plus more, or forgetting that $1 = 100¢. Change from $1 is 100 minus the price.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>An apple costs 65¢. You pay $1. Count up: 65 and a dime is 75. 75 and a quarter is 100. The change is 10¢ + 25¢ = <b>35¢</b>.</p><div class="fig">' + countUp(65, 100) + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Change from a bill</h2>' +
'<p>For prices in whole dollars, count up the same way with loonies, toonies and bills. You can also subtract: paid minus price.</p>' +
'<div class="lab"><span class="lt">Try it: pay with a bill</span>' +
'<div class="ctrl"><label for="bp">Price: <output id="bpo"></output><input type="range" id="bp" min="1" max="19" value="7"></label><label for="bb">You pay with<select id="bb"><option value="5">a $5 bill</option><option value="10" selected>a $10 bill</option><option value="20">a $20 bill</option></select></label></div>' +
'<div class="fig" id="bpfig"></div><div class="out" id="bpout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Counting up and subtracting give the same answer. $10 &minus; $7 = $3, and 7 + 3 = 10.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A kite costs $13. You pay with $20. Count up: $13 + $2 = $15. $15 + $5 = $20. The change is <b>$7</b>.</p><div class="fig">' + countUp(1300, 2000) + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Estimating change</h2>' +
'<p>To <b>estimate</b>, round the price to a friendly number first, like a number of quarters: 25¢, 50¢ or 75¢. Then find the change. An estimate helps you check that the change you get makes sense.</p>' +
'<div class="eg"><b class="t">Watch first</b><p>A muffin costs 70¢. 70 is close to 75, which is 3 quarters. You pay $1. One more quarter makes $1, so you should get <b>about 25¢</b> back. The exact change is 30¢, which is close.</p><div class="fig">' + coins([25, 25, 25], 'Three quarters make 75 cents') + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Before you pay, add the prices roughly. If they come to less than what you have, you have enough money.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>You have $10. A puzzle is $4 and a ball is $5. 4 + 5 = 9, which is less than 10. You have enough, with $1 left.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'Which coin is worth 10¢?', options: ['dime', 'nickel', 'quarter'], answer: 0, why: 'The dime is the smallest coin, but it is worth 10¢.' },
        { q: 'How much money is this?', fig: coins([25, 25, 25]), options: ['75¢', '25¢', '50¢'], answer: 0, why: 'Count by 25s: 25, 50, 75.' },
        { q: 'A toonie is worth:', options: ['$2', '$1', '25¢'], answer: 0, why: 'Toonie means "two". It is worth 2 dollars.' }
      ],
      s2: [
        { q: 'A pencil costs 80¢. You pay $1. What is the change?', options: ['20¢', '30¢', '80¢'], answer: 0, why: 'Count up from 80: 90, 100. That is 2 dimes, 20¢.' },
        { q: 'A sticker costs 75¢. You pay $1. What is the change?', options: ['25¢', '35¢', '75¢'], answer: 0, why: '75 and one quarter makes 100.' },
        { q: '$1 is the same as:', options: ['100¢', '10¢', '50¢'], answer: 0, why: '100 cents make 1 dollar.' }
      ],
      s3: [
        { q: 'A book costs $6. You pay with $10. What is the change?', options: ['$4', '$6', '$16'], answer: 0, why: 'Count up from 6 to 10: 4 dollars.' },
        { q: 'A ball costs $3. You pay with $5. What is the change?', options: ['$2', '$3', '$8'], answer: 0, why: '3 and a toonie makes 5.' },
        { q: 'A game costs $15. You pay with $20. What is the change?', options: ['$5', '$15', '$10'], answer: 0, why: '15 + 5 = 20.' }
      ],
      s4: [
        { q: 'A banana costs 45¢. You pay $1. About how much change?', options: ['about 50¢', 'about 25¢', 'about 75¢'], answer: 0, why: '45¢ is close to 50¢. 100 minus 50 is 50. (Exactly 55¢.)' },
        { q: 'You have $10. Items cost $6 and $3. Do you have enough?', options: ['yes', 'no'], answer: 0, why: '6 + 3 = 9, which is less than 10.' },
        { q: 'You have $5. Items cost $4 and $2. Do you have enough?', options: ['yes', 'no'], answer: 1, why: '4 + 2 = 6, which is more than 5.' }
      ]
    },

    init: function (root) {
      var $ = A.$, bag = [25, 10, 10];
      function cc() {
        var t = sumOf(bag), small = bag.filter(function (v) { return v < 100; }).sort(function (a, b) { return b - a; }), run = 0;
        $('#cfig', root).innerHTML = coins(bag);
        var steps = small.map(function (v) { run += v; return run; });
        $('#cout', root).innerHTML = '<p><span class="big">' + (t ? money(t) : '0¢') + '</span></p>' +
          (small.length ? '<p>Count the small coins, biggest first: ' + steps.join(', ') + '. That is ' + run + '¢' + (run >= 100 ? ', which is ' + money(run) : '') + '.</p>' : '') +
          (t - run ? '<p>The loonies and toonies make ' + money(t - run) + '.</p>' : '') + (bag.length >= 14 ? '<p class="t2">That is a lot of coins! Clear to start again.</p>' : '');
      }
      root.querySelectorAll('[data-add]').forEach(function (b) { b.addEventListener('click', function () { var v = +b.getAttribute('data-add'); if (!v) bag = []; else if (bag.length < 16) bag.push(v); cc(); }); });
      cc();
      function cp() {
        var p = +$('#cp', root).value, ch = 100 - p, it = ITEMS[(p / 5) % ITEMS.length];
        $('#cpo', root).textContent = p + '¢';
        var hop = make(ch).reverse(), run = p, path = hop.map(function (d) { run += d; return run; });
        $('#cpfig', root).innerHTML = countUp(p, 100) + coins(make(ch), 'Change: ' + listName(make(ch)));
        $('#cpout', root).innerHTML = '<p><span class="big">Change: ' + ch + '¢</span></p><p>' + it.charAt(0).toUpperCase() + it.slice(1) + ' costs ' + p + '¢. Count up from ' + p + ': ' + path.join(', ') + '. You get ' + listName(hop) + ' back. Check: 100 &minus; ' + p + ' = ' + ch + '.</p>';
      }
      A.bind(root, ['cp'], cp);
      function bp() {
        var p = +$('#bp', root).value, b = +$('#bb', root).value, it = BIG[p % BIG.length];
        $('#bpo', root).textContent = '$' + p;
        if (p >= b) {
          $('#bpfig', root).innerHTML = coins([b * 100], 'A $' + b + ' bill');
          $('#bpout', root).innerHTML = '<p><span class="big">' + (p === b ? 'No change' : 'Not enough') + '</span></p><p>' + (p === b ? 'The price is exactly $' + b + ', so there is no change.' : 'The price is $' + p + ', more than $' + b + '. Pick a bigger bill.') + '</p>';
          return;
        }
        var ch = b - p, hop = make(ch * 100).reverse(), run = p, path = hop.map(function (d) { run += d / 100; return '$' + run; });
        $('#bpfig', root).innerHTML = countUp(p * 100, b * 100) + coins(make(ch * 100), 'Change: ' + listName(make(ch * 100)));
        $('#bpout', root).innerHTML = '<p><span class="big">Change: $' + ch + '</span></p><p>' + it.charAt(0).toUpperCase() + it.slice(1) + ' costs $' + p + '. Count up from $' + p + ': ' + path.join(', ') + '. Check: ' + b + ' &minus; ' + p + ' = ' + ch + '.</p>';
      }
      A.bind(root, ['bp', 'bb'], bp);
    },

    quiz: [
      { q: 'How much money is this?', type: 'num', answer: 65, unit: '¢', fig: coins([25, 25, 10, 5]), hint: 'Start with the quarters. Count by 25s, then add the dime and the nickel.', explain: '25, 50, then 60, then 65. That is 65¢.' },
      { q: 'Which coin is worth 25¢?', type: 'mc', options: ['nickel', 'dime', 'quarter', 'loonie'], answer: 2, hint: 'It is the biggest silver coin.', explain: 'The quarter is worth 25¢. Four quarters make $1.' },
      { q: 'A juice box costs 70¢. You pay with a loonie. How much change do you get?', type: 'num', answer: 30, unit: '¢', hint: 'Count up from 70 to 100.', explain: '70, 80, 90, 100. That is 3 dimes, 30¢.' },
      { q: 'A book costs $6. You pay with a $10 bill. How much change do you get?', type: 'num', answer: 4, unit: '$', hint: 'Count up from 6 to 10.', explain: '$10 &minus; $6 = $4.' },
      { q: 'Which coins make 45¢?', type: 'mc', options: ['1 quarter and 2 dimes', '4 dimes', '1 quarter and 1 dime', '3 dimes and 1 nickel'], answer: 0, hint: 'Add up each choice.', explain: '25 + 10 + 10 = 45.' },
      { q: 'A granola bar costs 45¢. You pay $1. About how much change should you get?', type: 'mc', options: ['about 50¢', 'about 25¢', 'about 75¢'], answer: 0, hint: '45¢ is close to 50¢, which is 2 quarters.', explain: 'About 100 &minus; 50 = 50. The exact change is 55¢.' },
      { q: 'You buy a puzzle for $3 and a ball for $5. You pay with a $10 bill. How much change do you get?', type: 'num', answer: 2, unit: '$', hint: 'First add the prices.', explain: '$3 + $5 = $8. $10 &minus; $8 = $2.' }
    ],

    practice: [
      { id: 'mn-count', name: 'Count coins', code: 'F1.1', gen: function (lv) {
        var l = [], i, n;
        if (lv === 1) { var v = R.pick([5, 10, 25]); n = R.int(2, v === 25 ? 4 : 7); for (i = 0; i < n; i++) l.push(v); }
        else if (lv === 2) { var q = R.int(0, 3), d = R.int(0, 4), k = R.int(0, 3); for (i = 0; i < q; i++) l.push(25); for (i = 0; i < d; i++) l.push(10); for (i = 0; i < k; i++) l.push(5); if (l.length < 2 || sumOf(l) >= 100) l = [25, 10, 5, 5]; }
        else { var a = R.int(0, 3), b = R.int(0, 3); if (!a && !b) a = 2; for (i = 0; i < a; i++) l.push(200); for (i = 0; i < b; i++) l.push(100); }
        var t = sumOf(l), dol = lv === 3, srt = l.slice().sort(function (x, y) { return y - x; }), run = 0, path = srt.map(function (x) { run += x; return dol ? '$' + run / 100 : run; });
        return { q: 'How much money is this?', type: 'num', answer: dol ? t / 100 : t, unit: dol ? '$' : '¢', fig: coins(l),
          hint: dol ? 'Toonies are $2 each. Loonies are $1 each.' : 'Start with the biggest coin and count on.',
          steps: ['Sort the coins from biggest to smallest.', 'Count on: ' + path.join(', ') + '.', 'The total is ' + money(t) + '.'], explain: 'The total is ' + money(t) + '.' };
      } },
      { id: 'mn-make', name: 'Coins that make an amount', code: 'F1.1', gen: function (lv) {
        var tg = lv === 1 ? R.int(2, 9) * 10 : R.int(3, 19) * 5, right = make(tg, [25, 10, 5]);
        if (lv === 3 && right.length > 1) { /* a less obvious way: break one coin */ var j = right.indexOf(25) >= 0 ? right.indexOf(25) : right.indexOf(10); if (j >= 0) { var big = right.splice(j, 1)[0]; right = right.concat(big === 25 ? [10, 10, 5] : [5, 5]); } }
        var wrong = [], tries = 0;
        while (wrong.length < 3 && tries < 60) { tries++; var w = right.slice(); var op = R.int(0, 2), z = R.int(0, w.length - 1);
          if (op === 0) w.splice(z, 1); else if (op === 1) w.push(R.pick([5, 10, 25])); else w[z] = R.pick([5, 10, 25].filter(function (c) { return c !== w[z]; }));
          if (w.length && sumOf(w) !== tg && wrong.every(function (x) { return listName(x) !== listName(w); })) wrong.push(w); }
        var o = R.mc(listName(right), wrong.map(listName));
        return { q: 'Which coins make <b>' + tg + '¢</b>?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Add up each choice. Count quarters by 25s, dimes by 10s and nickels by 5s.',
          steps: ['Add the coins in each choice.', listName(right) + ': ' + right.slice().sort(function (a, b) { return b - a; }).join(' + ') + ' = ' + tg + '.', 'That choice makes ' + tg + '¢.'], explain: listName(right) + ' make ' + tg + '¢.' };
      } },
      { id: 'mn-cents', name: 'Change from a dollar', code: 'F1.1', gen: function (lv) {
        var it = R.pick(ITEMS), p, paid = 100, payTxt = 'a loonie';
        if (lv === 1) p = R.int(1, 9) * 10; else if (lv === 2) p = R.int(1, 19) * 5;
        else { var qn = R.int(2, 3); paid = qn * 25; payTxt = qn + ' quarters'; p = R.int(1, qn * 5 - 1) * 5; }
        var ch = paid - p, hop = make(ch).reverse(), run = p, path = hop.map(function (d) { run += d; return run; });
        return { q: it.charAt(0).toUpperCase() + it.slice(1) + ' costs ' + p + '¢. You pay with ' + payTxt + '. How much change do you get?', type: 'num', answer: ch, unit: '¢', fig: lv === 1 ? countUp(p, 100, 'A number line from ' + p + '¢ to $1') : '',
          hint: 'Count up from ' + p + '¢ to ' + paid + '¢.', steps: [payTxt.charAt(0).toUpperCase() + payTxt.slice(1) + ' is ' + paid + '¢.', 'Count up from ' + p + ': ' + path.join(', ') + '.', 'The change is ' + ch + '¢.'], explain: paid + ' &minus; ' + p + ' = ' + ch + '¢.' };
      } },
      { id: 'mn-dollars', name: 'Change from a bill', code: 'F1.1', gen: function (lv) {
        var b, p, p2 = 0, it = R.pick(BIG), it2;
        if (lv === 1) { b = R.pick([5, 10]); p = R.int(1, b - 1); }
        else if (lv === 2) { b = 20; p = R.int(3, 19); }
        else { b = R.pick([10, 20]); p = R.int(1, b / 2 - 1); p2 = R.int(1, b - p - 1); it2 = R.pick(BIG.filter(function (x) { return x !== it; })); }
        var tot = p + p2, ch = b - tot;
        var q = p2 ? 'You buy ' + it + ' for $' + p + ' and ' + it2 + ' for $' + p2 + '. You pay with a $' + b + ' bill. How much change do you get?' : it.charAt(0).toUpperCase() + it.slice(1) + ' costs $' + p + '. You pay with a $' + b + ' bill. How much change do you get?';
        return { q: q, type: 'num', answer: ch, unit: '$', fig: lv === 1 ? countUp(p * 100, b * 100, 'A number line from $' + p + ' to $' + b) : '',
          hint: p2 ? 'Add the prices first.' : 'Count up from $' + p + ' to $' + b + '.',
          steps: [p2 ? 'Add the prices: $' + p + ' + $' + p2 + ' = $' + tot + '.' : 'The price is $' + p + '.', 'Count up from $' + tot + ' to $' + b + ', or subtract: ' + b + ' &minus; ' + tot + ' = ' + ch + '.', 'The change is $' + ch + '.'], explain: '$' + b + ' &minus; $' + tot + ' = $' + ch + '.' };
      } },
      { id: 'mn-estimate', name: 'Estimate change', code: 'F1.1', gen: function (lv) {
        if (lv === 3 && R.int(0, 1)) {
          var have = R.pick([5, 10, 20]), a = R.int(1, have - 1), b = R.int(1, have - 1), ok = a + b <= have;
          return { q: 'You have $' + have + '. You want items that cost $' + a + ' and $' + b + '. Do you have enough money?', type: 'mc', options: ['yes', 'no'], answer: ok ? 0 : 1,
            hint: 'Add the prices. Compare with $' + have + '.', steps: ['$' + a + ' + $' + b + ' = $' + (a + b) + '.', '$' + (a + b) + (ok ? ' is not more than ' : ' is more than ') + '$' + have + '.', ok ? 'Yes, you have enough.' : 'No, you do not have enough.'], explain: '$' + a + ' + $' + b + ' = $' + (a + b) + (ok ? ', so yes.' : ', so no.') };
        }
        var p = R.pick([20, 30, 45, 55, 70, 80]); /* each is 5¢ from a number of quarters */
        var it = R.pick(ITEMS), rp = Math.round(p / 25) * 25, est = 100 - rp, ex = 100 - p;
        var o = R.mc('about ' + est + '¢', [25, 50, 75].filter(function (w) { return w !== est; }).map(function (w) { return 'about ' + w + '¢'; }));
        return { q: it.charAt(0).toUpperCase() + it.slice(1) + ' costs ' + p + '¢. You pay with $1. About how much change should you get?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Which is ' + p + '¢ closest to: 25¢, 50¢ or 75¢?', steps: [p + '¢ is close to ' + rp + '¢.', '100 &minus; ' + rp + ' = ' + est + '.', 'You should get about ' + est + '¢. (Exactly ' + ex + '¢.)'], explain: 'About ' + est + '¢. The exact change is ' + ex + '¢.' };
      } }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ----------
     Each practice skill keeps its first way of asking ("plain") and adds new shapes.
     Shapes unlock with the level, so level 1 stays gentle. q.meta is read by the automatic answer checks. */
  var Q = A.Q;
  if (Q) (function () {
    var nm = Q.name;
    function why(right, wrong) { var o = R.mc(right, wrong); return { options: o.options, answer: o.answer }; }
    function cap1(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
    /* a handful of quarters, dimes and nickels worth less than $1 */
    function handful(lv) {
      for (;;) {
        var l = [], n = R.int(2, lv === 1 ? 4 : 6);
        for (var i = 0; i < n; i++) l.push(R.pick(lv === 1 ? [10, 5] : [25, 10, 5]));
        if (sumOf(l) < 100) return l;
      }
    }
    var SHAPES = {
      'mn-count': [
        [1, 'tap', function (lv) {
          var set = [], seen = {};
          while (set.length < 3) { var l = handful(lv), t = sumOf(l); if (seen[t]) continue; seen[t] = 1; set.push(l); }
          var k = R.int(0, 2), t2 = sumOf(set[k]);
          return { q: 'Tap the coins that make <b>' + t2 + '¢</b>.', type: 'tap', tiles: set.map(function (l) { return coins(l, null, 260); }), answer: k, answerText: listName(set[k]),
            hint: 'Count each group from the biggest coin.', steps: [listName(set[k]) + ' make ' + t2 + '¢.'],
            explain: listName(set[k]) + ' make ' + t2 + '¢.', meta: { k: 'coin-tap', t: t2 } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), l = handful(lv), t = sumOf(l);
          return { q: who + ' finds ' + listName(l) + ' in a coat pocket. How much money is that?', type: 'num', answer: t, unit: '¢',
            hint: 'Quarters are 25¢, dimes are 10¢ and nickels are 5¢. Start with the biggest coins.', steps: ['Count on: ' + l.slice().sort(function (a, b) { return b - a; }).join(' + ') + ' = ' + t + '.'],
            explain: 'That is ' + t + '¢.', meta: { k: 'coin-num' } };
        }],
        [1, 'match', function (lv) {
          var pairs = [], seen = {};
          while (pairs.length < 3) { var l = handful(lv), t = sumOf(l); if (seen[t]) continue; seen[t] = 1; pairs.push([listName(l), t + '¢']); }
          return { q: 'Match each group of coins to how much it is worth.', type: 'match', pairs: pairs,
            hint: 'Count from the biggest coin.', steps: ['Quarters by 25s, dimes by 10s, nickels by 5s.'],
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'coin-match' } };
        }],
        [2, 'mistake', function (lv) {
          var l, t;
          do { l = handful(2); t = sumOf(l); } while (l.length * 10 === t);
          var who = nm(), truth = !R.int(0, 2), said = truth ? t : l.length * 10;
          var right = 'Each coin has its own value. ' + l.slice().sort(function (a, b) { return b - a; }).join(' + ') + ' = ' + t + '¢.';
          return { q: who + ' says these coins make <b>' + said + '¢</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: coins(l),
            why: why(right, ['Every coin is worth 10¢.', 'Bigger coins are always worth more.', 'Count the coins, then add a zero.']),
            hint: 'Read the value on each coin.', steps: [right], explain: right, meta: { k: 'coin-tf', said: said } };
        }]
      ],
      'mn-make': [
        [1, 'build', function (lv) {
          var tg = lv === 1 ? R.int(2, 9) * 10 : R.int(4, 19) * 5;
          return { q: 'Show <b>' + tg + '¢</b> with coins. Then press Check.', type: 'build', tool: 'coins', answer: tg,
            hint: 'Start with the biggest coin that fits. Then add smaller coins.', steps: ['One way: ' + listName(make(tg, [25, 10, 5])) + '.', 'Any coins that add up to ' + tg + '¢ are right.'],
            explain: listName(make(tg, [25, 10, 5])) + ' make ' + tg + '¢. Other coins can make it too.', meta: { k: 'make-build', tg: tg } };
        }],
        [1, 'pick', function (lv) {
          var tg = lv === 1 ? R.int(3, 9) * 10 : R.int(4, 19) * 5, good = [make(tg, [25, 10, 5]), make(tg, [10, 5])], opts = [], seen = {};
          if (lv === 1) good[0] = make(tg, [10]);
          good.forEach(function (g) { var n = listName(g); if (!seen[n]) { seen[n] = 1; opts.push(n); } });
          var tries = 0;
          while (opts.length < 4 && tries++ < 50) { var w = handful(lv), n2 = listName(w); if (sumOf(w) === tg || seen[n2]) continue; seen[n2] = 1; opts.push(n2); }
          opts = R.shuffle(opts);
          var ans = []; opts.forEach(function (o, j) { if (good.some(function (g) { return listName(g) === o; })) ans.push(j); });
          return { q: 'Pick every group of coins that makes <b>' + tg + '¢</b>.', type: 'pick', options: opts, answer: ans,
            hint: 'Add each group. There can be more than one way.', steps: ['Count each group from the biggest coin.'],
            explain: ans.map(function (j) { return opts[j]; }).join(' and ') + ' make ' + tg + '¢.', meta: { k: 'make-pick', tg: tg } };
        }],
        [1, 'fill', function (lv) {
          var tg = lv === 1 ? R.int(1, 9) * 10 + R.pick([0, 5]) : R.int(4, 19) * 5, f = make(tg, [25, 10, 5]), cnt = function (v) { return f.filter(function (x) { return x === v; }).length; };
          return { q: 'Make <b>' + tg + '¢</b> with the <b>fewest</b> coins. Fill in the blanks.', type: 'fill', fill: '[[]] quarters, [[]] dimes and [[]] nickels', answers: [cnt(25), cnt(10), cnt(5)],
            hint: 'Use as many quarters as you can. Then dimes. Then nickels.', steps: ['Quarters first: ' + cnt(25) + ' quarter' + (cnt(25) === 1 ? '' : 's') + ' is ' + cnt(25) * 25 + '¢.', 'Then ' + cnt(10) + ' dime' + (cnt(10) === 1 ? '' : 's') + ' and ' + cnt(5) + ' nickel' + (cnt(5) === 1 ? '' : 's') + '.'],
            explain: tg + '¢ = ' + listName(f) + '.', meta: { k: 'make-fill', tg: tg } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), l = handful(lv), tg = sumOf(l), price = tg + R.pick([0, 0, 5, -5]), ok = tg >= price, opts = ['yes', 'no'];
          return { q: who + ' has ' + listName(l) + '. A snack costs ' + price + '¢. Does ' + who + ' have enough?', type: 'mc', options: opts, answer: ok ? 0 : 1,
            hint: 'Count the coins. Compare with ' + price + '¢.', steps: ['The coins make ' + tg + '¢.', tg + '¢ is ' + (ok ? 'enough for ' : 'less than ') + price + '¢.'],
            explain: (ok ? 'Yes' : 'No') + ': the coins make ' + tg + '¢.', meta: { k: 'make-mc', price: price } };
        }],
        [2, 'mistake', function (lv) {
          var tg = R.int(6, 19) * 5, f = make(tg, [25, 10, 5]), who = nm(), truth = !R.int(0, 2), said = truth ? f : f.concat([5]);
          var right = listName(f) + ' make ' + tg + '¢.';
          return { q: who + ' says <b>' + listName(said) + '</b> make ' + tg + '¢. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Any coins can make any amount.', 'Count the coins, not their values.', 'A quarter is worth 20¢.']),
            hint: 'Add up the coins ' + who + ' named.', steps: [right], explain: right, meta: { k: 'make-tf', tg: tg, said: listName(said) } };
        }]
      ],
      'mn-cents': [
        [1, 'line', function (lv) {
          var p = lv === 1 ? R.int(1, 9) * 10 : R.int(1, 19) * 5, it = R.pick(ITEMS);
          return { q: cap1(it) + ' costs ' + p + '¢. You pay with a loonie ($1). Put the marker on the change you get.', type: 'line', min: 0, max: 100, tick: lv === 1 ? 10 : 5, every: lv === 1 ? 20 : 25, snap: lv === 1 ? 10 : 5, answer: 100 - p, hideValue: true, place: 'the change',
            label: function (v) { return v + '¢'; },
            hint: 'Count up from ' + p + '¢ to 100¢.', steps: ['A loonie is 100¢.', '100 &minus; ' + p + ' = ' + (100 - p) + '.'],
            explain: 'The change is ' + (100 - p) + '¢.', meta: { k: 'cents-line', p: p } };
        }],
        [1, 'match', function (lv) {
          var ps = R.shuffle(lv === 1 ? [10, 20, 30, 40, 60, 70, 80, 90] : [15, 35, 45, 55, 65, 85]).slice(0, 3);
          var pairs = ps.map(function (p) { return ['costs ' + p + '¢', (100 - p) + '¢ change']; });
          return { q: 'You pay with a loonie ($1) each time. Match each price to the change.', type: 'match', pairs: pairs,
            hint: 'Count up from the price to 100¢.', steps: ['A loonie is 100¢. Price + change = 100¢.'],
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'cents-match' } };
        }],
        [1, 'fill', function (lv) {
          var p = lv === 1 ? R.int(1, 9) * 10 : R.int(1, 19) * 5, it = R.pick(ITEMS);
          return { q: cap1(it) + ' costs ' + p + '¢. You pay with a loonie. Fill in the change.', type: 'fill', fill: '<span class="math">' + p + '¢ + [[]]¢ = 100¢</span>', answers: [100 - p], fig: lv === 1 ? countUp(p, 100) : '',
            hint: 'Count up from ' + p + '¢ to 100¢.', steps: ['100 &minus; ' + p + ' = ' + (100 - p) + '.'],
            explain: 'The change is ' + (100 - p) + '¢.', meta: { k: 'cents-fill' } };
        }],
        [2, 'mistake', function (lv) {
          var p = R.int(1, 9) * 10 + 5, who = nm(), truth = !R.int(0, 2), wrong = (10 - Math.floor(p / 10)) * 10 + 5, said = truth ? 100 - p : wrong;
          var right = 'Count up from ' + p + '¢: ' + (p + 5) + '¢, then on to 100¢. The change is ' + (100 - p) + '¢.';
          return { q: 'A sticker costs ' + p + '¢. You pay with a loonie. ' + who + ' says the change is <b>' + said + '¢</b>. True or false: ' + who + ' is right.', type: 'tf', answer: said === 100 - p,
            why: why(right, ['Subtract the tens, then keep the 5.', 'The change is always 50¢.', 'Add the price to 100.']),
            hint: 'Check: does the price plus the change make 100¢?', steps: [right], explain: right, meta: { k: 'cents-tf', p: p, said: said } };
        }]
      ],
      'mn-dollars': [
        [1, 'which', function (lv) {
          var b = R.pick(lv === 1 ? [5, 10] : [10, 20]), p = R.int(1, b - 1), it = R.pick(BIG);
          var opts = ['Subtract: $' + b + ' &minus; $' + p, 'Add: $' + b + ' + $' + p];
          return { q: cap1(it) + ' costs $' + p + '. You pay with a $' + b + ' bill. <b>Which way finds your change?</b>', type: 'mc', options: opts, answer: 0,
            hint: 'Change is what is left after you pay.', steps: ['Change = what you pay &minus; the price.', '$' + b + ' &minus; $' + p + ' = $' + (b - p) + '. You can also count up from $' + p + '.'],
            explain: 'Subtract (or count up): $' + (b - p) + ' change.', meta: { k: 'dol-which' } };
        }],
        [1, 'line', function (lv) {
          var b = R.pick(lv === 1 ? [5, 10] : [10, 20]), p = R.int(1, b - 1), it = R.pick(BIG);
          return { q: cap1(it) + ' costs $' + p + '. You pay with a $' + b + ' bill. Put the marker on the change you get.', type: 'line', min: 0, max: b, tick: 1, every: b === 20 ? 5 : b === 10 ? 2 : 1, snap: 1, answer: b - p, hideValue: true, place: 'the change',
            label: function (v) { return '$' + v; },
            hint: 'Count up from $' + p + ' to $' + b + '.', steps: ['$' + b + ' &minus; $' + p + ' = $' + (b - p) + '.'],
            explain: 'The change is $' + (b - p) + '.', meta: { k: 'dol-line', b: b, p: p } };
        }],
        [1, 'match', function (lv) {
          var b = lv === 1 ? 10 : 20, ps = R.shuffle(Array.apply(null, Array(b - 1)).map(function (_, i) { return i + 1; })).slice(0, 3);
          var pairs = ps.map(function (p) { return ['costs $' + p, '$' + (b - p) + ' change']; });
          return { q: 'You pay with a <b>$' + b + '</b> bill each time. Match each price to the change.', type: 'match', pairs: pairs,
            hint: 'Count up from the price to $' + b + '.', steps: ['Price + change = $' + b + '.'],
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'dol-match', b: b } };
        }],
        [2, 'mistake', function (lv) {
          var b = R.pick([10, 20]), p = R.int(2, b - 2), it = R.pick(BIG), who = nm(), truth = !R.int(0, 2), said = truth ? b - p : b + p;
          var right = 'Change is what is left: $' + b + ' &minus; $' + p + ' = $' + (b - p) + '.';
          return { q: cap1(it) + ' costs $' + p + '. ' + who + ' pays with a $' + b + ' bill and says the change is <b>$' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Add the price to the bill.', 'Change is the same as the price.', 'Change is always $1.']),
            hint: 'Can the change be more than the bill?', steps: [right], explain: right, meta: { k: 'dol-tf', b: b, p: p, said: said } };
        }]
      ],
      'mn-estimate': [
        [1, 'match', function (lv) {
          var near = R.shuffle([25, 50, 75]), pairs = near.map(function (n) { return [(n + R.pick([-5, 5])) + '¢', 'about ' + n + '¢']; });
          return { q: 'Match each price to the closest friendly amount.', type: 'match', pairs: pairs,
            hint: 'Friendly amounts are 25¢, 50¢ and 75¢. Which is each price closest to?', steps: ['A price 5¢ away from a friendly amount is close to it.'],
            explain: pairs.map(function (p) { return p[0] + ' is ' + p[1]; }).join('. ') + '.', meta: { k: 'est-near' } };
        }],
        [1, 'tf', function (lv) {
          var have = R.pick([5, 10, 20]), a = R.int(1, have - 1), b = R.int(1, have - 1), ok = a + b <= have;
          var right = '$' + a + ' + $' + b + ' = $' + (a + b) + (ok ? ', which is not more than $' + have + '.' : ', which is more than $' + have + '.');
          return { q: 'You have $' + have + '. True or false: you have enough to buy things that cost <b>$' + a + '</b> and <b>$' + b + '</b>.', type: 'tf', answer: ok,
            why: why(right, ['You only need to look at the bigger price.', 'Two things always cost more than $' + have + '.', 'You always have enough if each price is less than $' + have + '.']),
            hint: 'Add the prices first.', steps: [right], explain: right, meta: { k: 'est-enough', have: have, a: a, b: b } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), p = R.pick([20, 30, 45, 55, 70, 80]), it = R.pick(ITEMS), rp = Math.round(p / 25) * 25, est = 100 - rp;
          var o = R.mc('about ' + est + '¢', [25, 50, 75].filter(function (w) { return w !== est; }).map(function (w) { return 'about ' + w + '¢'; }));
          return { q: who + ' buys ' + it + ' for ' + p + '¢ at the school fair and pays with a loonie. About how much change should ' + who + ' get?', type: 'mc', options: o.options, answer: o.answer,
            hint: p + '¢ is close to which friendly amount: 25¢, 50¢ or 75¢?', steps: [p + '¢ is about ' + rp + '¢.', '100 &minus; ' + rp + ' = ' + est + '.'],
            explain: 'About ' + est + '¢. (Exactly ' + (100 - p) + '¢.)', meta: { k: 'est-change', p: p } };
        }],
        [2, 'mistake', function (lv) {
          var p = R.pick([20, 30, 45, 55, 70, 80]), who = nm(), rp = Math.round(p / 25) * 25, truth = !R.int(0, 2), said = truth ? 100 - rp : rp;
          if (!truth && said === 100 - rp) said = 100 - rp + 25;
          var right = p + '¢ is about ' + rp + '¢, so the change is about 100 &minus; ' + rp + ' = ' + (100 - rp) + '¢.';
          return { q: 'A muffin costs ' + p + '¢. You pay with a loonie. ' + who + ' says you should get <b>about ' + said + '¢</b> in change. True or false: ' + who + ' is right.', type: 'tf', answer: said === 100 - rp,
            why: why(right, ['The change is about the same as the price.', 'Change from a loonie is always about 50¢.', 'Round the price up to $1, so there is no change.']),
            hint: 'Round the price to 25¢, 50¢ or 75¢ first.', steps: [right], explain: right, meta: { k: 'est-tf2', p: p, said: said } };
        }]
      ]
    };
    var ch = A.chapters[CH];
    ch.quizFresh = true;
    ch.practice.forEach(function (sk) {
      var plain = sk.gen, extra = SHAPES[sk.id] || [];
      sk.shapes = ['plain'].concat(extra.map(function (s) { return s[1]; }));
      sk.gen = function (lv) { return Q.vary(sk.id, lv, [[1, 'plain', plain]].concat(extra)); };
    });
    ch._shapes = SHAPES;
  })();
})();
