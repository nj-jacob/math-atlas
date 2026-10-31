(function () {
  var A = Atlas, R = A.R, D = A.draw, CASH = A.CASH;
  var COINS = [5, 10, 25, 100, 200], BILLS = [100, 200, 500, 1000, 2000, 5000, 10000];
  function WAL(L, o) { o = o || {}; o.scale = 1.3; o.W = Math.round((o.W || 420) / 1.3); return D.wallet(L, o); }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  /* coin amounts in cents, bill amounts in dollars */
  function c(v) { return v + '¢'; }
  function d(v) { return '$' + v / 100; }
  /* "2 quarters, 1 dime" */
  function names(list) {
    var L = list.slice().sort(function (a, b) { return b - a; }), out = [];
    L.forEach(function (v, i) { if (L[i - 1] === v) return; var k = L.filter(function (x) { return x === v; }).length, n = CASH[v].n; out.push(k + ' ' + (k > 1 ? n + 's' : n)); });
    return out.join(', ');
  }
  /* running total, biggest first: "25, 50, 60, 65" */
  function run(list, fmt) {
    var L = list.slice().sort(function (a, b) { return b - a; }), t = 0;
    return L.map(function (v) { t += v; return fmt(t); }).join(', ');
  }
  function wallet(list, W) { return WAL(list, { W: W || 420 }); }
  function wbills(list) { return WAL(list, { W: 420, label: names(list) + '. Total ' + d(sum(list)) }); }
  function wcoins(list) { return WAL(list, { W: 420, label: names(list) + '. Total ' + c(sum(list)) }); }
  /* random coins from a set, total at most max */
  function randCoins(set, k, max) {
    var out = [];
    for (var i = 0; i < 40 && out.length < k; i++) { var v = R.pick(set); if (sum(out) + v <= max) out.push(v); }
    if (!out.length) out.push(set[0]);
    return out;
  }
  /* two different coin lists with the same total, for "same amount" questions */
  var SAME = {
    25: [[25], [10, 10, 5], [5, 5, 5, 5, 5], [10, 5, 5, 5]],
    50: [[25, 25], [10, 10, 10, 10, 10], [25, 10, 10, 5], [25, 5, 5, 5, 5, 5]],
    75: [[25, 25, 25], [25, 25, 10, 10, 5], [25, 10, 10, 10, 10, 10]],
    100: [[100], [25, 25, 25, 25], [25, 25, 25, 10, 10, 5], [25, 25, 10, 10, 10, 10, 10]],
    150: [[100, 25, 25], [25, 25, 25, 25, 25, 25], [100, 10, 10, 10, 10, 10]],
    200: [[200], [100, 100], [100, 25, 25, 25, 25], [25, 25, 25, 25, 25, 25, 25, 25]]
  };
  var SAMEB = {
    10000: [[10000], [5000, 5000], [2000, 2000, 2000, 2000, 2000], [5000, 2000, 2000, 1000]],
    5000: [[5000], [2000, 2000, 1000], [1000, 1000, 1000, 1000, 1000], [2000, 1000, 1000, 500, 500]],
    2000: [[2000], [1000, 1000], [1000, 500, 500], [500, 500, 500, 500]],
    20000: [[10000, 10000], [10000, 5000, 5000], [5000, 5000, 5000, 5000], [10000, 5000, 2000, 2000, 1000]]
  };

  /* coin or bill builder: denoms, ids prefix */
  function builder(pre, denoms) {
    return '<div class="ctrl pick" id="' + pre + 'st">' + denoms.map(function (v) {
      return '<div><span class="t2" style="font-size:.9rem;font-weight:600">' + CASH[v].n + ' (' + CASH[v].t + ')</span><div class="step"><button type="button" class="btn alt" data-v="' + v + '" data-s="-1" aria-label="Take away one ' + CASH[v].n + '">&minus;</button><b id="' + pre + v + '">0</b><button type="button" class="btn alt" data-v="' + v + '" data-s="1" aria-label="Add one ' + CASH[v].n + '">+</button></div></div>';
    }).join('') + '</div>';
  }

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'money';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  var BSET = [100, 200, 500, 1000, 2000, 5000, 10000];
  function add(v, say, ms) { return { say: say, act: function (t) { return t.add(v); }, ms: ms }; }
  function only(v) { return function (s) { return s.items.length && s.items.every(function (x) { return x === v; }); }; }
  /* which coin is worth more? */
  var sizeLab = K.lab('<p class="lq"></p><div class="btnrow lsz"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var Q = [[10, 5], [25, 100], [5, 25], [200, 100]], i = 0;
    function draw() {
      root.querySelector('.lq').innerHTML = i < Q.length ? '<b>' + (i + 1) + ' of ' + Q.length + ':</b> Tap the coin worth <b>more</b>.' : '<b>All done.</b>';
      root.querySelector('.lsz').innerHTML = i < Q.length ? Q[i].map(function (v) { return '<button type="button" class="btn alt" data-v="' + v + '" aria-label="' + CASH[v].n + '">' + WAL([v], { W: 90, label: 'a ' + CASH[v].n }) + '</button>'; }).join('') : '';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b || i >= Q.length) return;
      var v = +b.getAttribute('data-v'), hi = Math.max.apply(null, Q[i]), out = root.querySelector('.out');
      if (v === hi) { out.innerHTML = '<p><span class="big">Yes.</span> A ' + CASH[v].n + ' is ' + c(v) + '.</p>'; i++; draw(); if (i === Q.length) done('You went by value, not by size.'); }
      else out.innerHTML = '<p>A ' + CASH[v].n + ' is only ' + c(v) + '. A ' + CASH[hi].n + ' is ' + c(hi) + '.</p>';
    });
    draw();
  }, 'Pick the coin worth more. Do not go by size.');

  var LESSONS = [
    { id: 'coins', title: 'Canadian coins', sub: 'Names and values.', concepts: [
      { id: 'names', title: 'Know the coins', exp: ['F1.1'], skill: 'f2-coins',
        body: '<p>Canada uses five coins. Each has a value in <b>cents</b> (¢). 100 cents is 1 dollar.</p><div class="tbl"><table><thead><tr><th scope="col">Coin</th><th scope="col">Name</th><th scope="col">Value</th></tr></thead><tbody>' + COINS.map(function (v) { return '<tr><td>' + WAL([v], { W: 80, label: 'a ' + CASH[v].n }) + '</td><td><b>' + CASH[v].n + '</b></td><td>' + c(v) + (v >= 100 ? ' = ' + d(v) : '') + '</td></tr>'; }).join('') + '</tbody></table></div>',
        watch: { tool: 'coins', opts: {}, steps: [
          add(5, 'A <b>nickel</b>: 5¢.'),
          add(10, 'A <b>dime</b>: 10¢.'),
          add(25, 'A <b>quarter</b>: 25¢.'),
          add(100, 'A <b>loonie</b>: 100¢, or $1.'),
          add(200, 'A <b>toonie</b>: 200¢, or $2.', 2000)
        ] },
        try: { tool: 'coins', opts: {}, tasks: [
          { do: 'Put a <b>quarter</b> on the mat. Tap a coin to take it away.', goal: function (s) { return s.items.indexOf(25) >= 0; }, yes: 'A quarter is 25¢.' },
          { do: 'Clear the mat. Show <b>15¢</b> with 2 coins.', goal: function (s) { return s.total === 15 && s.n === 2; }, yes: 'A dime and a nickel: 10, 15.' }
        ] },
        key: '<p>Nickel 5¢, dime 10¢, quarter 25¢, loonie $1, toonie $2.</p>',
        mistake: '<p>Mixing up the nickel and the dime. Point to the animal: the beaver is on the nickel, the schooner (boat) is on the dime.</p>',
        check: [T('coin'), P('f2-coins', 1)] },
      { id: 'size', title: 'Size is not value', exp: ['F1.1'], skill: 'f2-coins', hard: true,
        body: '<p>A coin\'s size does not tell its value. A dime is smaller than a nickel, but worth more.</p>' + K.vs('Count a coin by its <b>value</b>: a dime is 10¢.', 'Go by size: the nickel is bigger, but it is only 5¢.'),
        watch: K.clip([
          ['A nickel and a dime.', WAL([5, 10], { W: 200, keep: true, label: 'A nickel and a dime' })],
          ['The nickel is <b>bigger</b>.', WAL([5], { W: 120, label: 'A nickel' }) + '<p class="math big">5¢</p>'],
          ['The dime is smaller, but worth <b>10¢</b>.', WAL([10], { W: 120, label: 'A dime' }) + '<p class="math big">10¢</p>'],
          ['Go by value, not size.', '<p class="math big">10¢ &gt; 5¢</p>', 2000]
        ]),
        try: sizeLab,
        ways: [
          { label: 'Say the value', html: '<p>Each time you pick up a coin, say its value out loud: "dime, ten". The name and value stick together.</p>' },
          { label: 'Real coins', html: '<p>Use real coins. Sort them by value into a row: nickel, dime, quarter, loonie, toonie. Notice the sizes do not line up the same way.</p>' }
        ],
        key: '<p>Value, not size.</p>',
        mistake: '<p>Thinking the nickel is worth more than the dime because it is bigger.</p>',
        check: [P('f2-coins', 2), P('f2-coins', 3)] }
    ] },
    { id: 'count', title: 'Counting coins', sub: 'Biggest first, then skip count.', concepts: [
      { id: 'biggest', title: 'Start with the biggest', exp: ['F1.1'], skill: 'f2-count', hard: true,
        body: '<p>To count coins, sort them so the coin worth the <b>most</b> comes first. Then skip count as you add each coin.</p>',
        watch: { tool: 'coins', opts: {}, steps: [
          add(5, 'Some coins, in a jumble.', 300),
          add(25, '', 300),
          add(10, '', 300),
          add(25, 'A nickel, two quarters and a dime.', 900),
          { say: 'Sort them: biggest first.', act: function (t) { return t.sort(); } },
          { say: 'Count on: 25, 50, 60, 65.', act: function (t) { return t.countAll(600); }, ms: 1400 },
          { say: 'The total is <b>65¢</b>.', ms: 1800 }
        ] },
        try: { tool: 'coins', opts: {}, tasks: [
          { do: 'Make <b>65¢</b>. Press "Count it" to check.', goal: function (s) { return s.total === 65; }, yes: '65¢. Biggest coin first makes it easy to count.' },
          { do: 'Clear the mat. Make <b>80¢</b> with exactly <b>4 coins</b>.', goal: function (s) { return s.total === 80 && s.n === 4; }, yes: '3 quarters and a nickel: 25, 50, 75, 80.' }
        ] },
        ways: [
          { label: 'Group the same coins', html: '<p>Put the quarters together, then the dimes, then the nickels. Count each group by its own skip count: 25s, then 10s, then 5s.</p><p class="math">25, 50 &rarr; 60 &rarr; 65</p>' },
          { label: 'Use a hundred chart', html: '<p>Start at 0. Jump 25 for each quarter, 10 for each dime and 5 for each nickel. Where you land is the total.</p>' }
        ],
        key: '<p>Biggest first. Count on by each coin\'s value.</p>',
        mistake: '<p>Counting every coin by 1s ("1, 2, 3, 4 coins") instead of counting their values.</p>',
        check: [T('count'), P('f2-count', 1), P('f2-count', 2)] }
    ] },
    { id: 'same', title: 'Same amount, different coins', sub: 'Many ways to make it.', concepts: [
      { id: 'ways', title: 'Many ways to make 50¢', exp: ['F1.1'], skill: 'f2-same',
        body: '<p>The same amount can be made with different coins. All of these are <b>50¢</b>.</p>',
        watch: K.clip(SAME[50].map(function (L, i) { return [(i ? 'Or ' : '') + names(L) + ': ' + run(L, c) + '.', WAL(L, { W: 300, label: names(L) + '. Total 50¢' }), i === 3 ? 2000 : 1600]; })),
        try: { tool: 'coins', opts: {}, tasks: [
          { do: 'Make <b>50¢</b> using only <b>dimes</b>.', goal: function (s) { return s.total === 50 && only(10)(s); }, yes: '5 dimes: 10, 20, 30, 40, 50.' },
          { do: 'Clear the mat. Make <b>50¢</b> another way, with a <b>quarter</b> in it.', goal: function (s) { return s.total === 50 && s.items.indexOf(25) >= 0; }, yes: 'Same amount, different coins.' }
        ] },
        key: '<p>Different coins can make the same amount.</p>',
        mistake: '<p>Thinking more coins means more money. 5 dimes and 2 quarters are both 50¢.</p>',
        check: [T('same'), P('f2-same', 1)] },
      { id: 'trade', title: 'Quarters, loonies, toonies', exp: ['F1.1'], skill: 'f2-same',
        body: '<p><b>4 quarters</b> make 100¢, the same as 1 loonie ($1). <b>2 loonies</b> make 1 toonie ($2).</p>',
        watch: { tool: 'coins', opts: {}, steps: [
          add(25, '25.', 300), add(25, '50.', 300), add(25, '75.', 300), add(25, '100. <b>4 quarters = $1</b>, the same as a loonie.', 1500),
          { say: '2 loonies make $2, the same as a toonie.', act: function (t) { t.reset(); return t.add(100); }, ms: 300 },
          add(100, '<b>2 loonies = 1 toonie</b>.', 1800)
        ] },
        try: { tool: 'coins', opts: {}, tasks: [
          { do: 'Make <b>$1</b> using only <b>quarters</b>.', goal: function (s) { return s.total === 100 && only(25)(s); }, yes: '4 quarters make $1.' },
          { do: 'Clear the mat. Make <b>$2</b> with just <b>one coin</b>.', goal: function (s) { return s.total === 200 && s.n === 1; }, yes: 'A toonie is $2.' }
        ] },
        key: '<p>4 quarters = $1. 2 loonies = $2.</p>',
        check: [P('f2-same', 2), P('f2-make', 1)] }
    ] },
    { id: 'bills', title: 'Dollars and bills', sub: 'Bigger amounts.', concepts: [
      { id: 'countb', title: 'Count bills', exp: ['F1.1'], skill: 'f2-bills',
        body: '<p>Bigger amounts use <b>dollars</b> ($). Canadian bills are $5, $10, $20, $50 and $100. Count bills the same way as coins: biggest first.</p>',
        watch: { tool: 'coins', opts: { set: BSET }, steps: [
          add(5000, 'A $50 bill.', 500), add(2000, '$20 makes 70.', 500), add(2000, 'Another $20 makes 90.', 500), add(500, '$5 makes 95.', 500), add(200, 'A toonie: 97.', 600),
          { say: 'Count on: 50, 70, 90, 95, 97. <b>$97</b>.', act: function (t) { return t.countAll(500); }, ms: 1800 }
        ] },
        try: { tool: 'coins', opts: { set: BSET }, tasks: [
          { do: 'Show <b>$35</b>.', goal: function (s) { return s.total === 3500; }, yes: '$35. Count on: 20, 30, 35, or another way.' },
          { do: 'Clear the mat. Show <b>$100</b> without a $100 bill.', goal: function (s) { return s.total === 10000 && s.items.indexOf(10000) < 0; }, yes: 'Same amount, different bills.' }
        ] },
        key: '<p>Count by the value on each bill, biggest first.</p>',
        mistake: '<p>Counting each bill as one dollar. A $20 bill is worth 20 dollars.</p>',
        check: [T('bills'), P('f2-bills', 1), P('f2-bills', 2)] },
      { id: 'sameb', title: 'Same amount with bills', exp: ['F1.1'], skill: 'f2-make', hard: true,
        body: '<p>Bills can make the same amount in different ways. All of these are <b>$100</b>.</p>',
        watch: K.clip(SAMEB[10000].map(function (L, i) { return [(i ? 'Or ' : '') + names(L) + ': ' + run(L, d) + '.', WAL(L, { W: 320, label: names(L) + '. Total $100' }), i === 3 ? 2200 : 1700]; })),
        try: { tool: 'coins', opts: { set: BSET }, tasks: [
          { do: 'Pay <b>$50</b> using only <b>$10 bills</b>.', goal: function (s) { return s.total === 5000 && only(1000)(s); }, yes: '5 tens make $50.' },
          { do: 'Clear the mat. Pay <b>$50</b> with exactly <b>3 bills</b>.', goal: function (s) { return s.total === 5000 && s.n === 3; }, yes: '$20, $20 and $10 make $50.' }
        ] },
        ways: [
          { label: 'Trade up', html: '<p>Two $5 bills are worth one $10. Two $10 bills are worth one $20. Five $10 bills are worth one $50. Trading keeps the amount the same.</p>' },
          { label: 'Count both piles', html: '<p>To check two piles match, count each one, biggest bill first. Same total: same amount.</p>' }
        ],
        key: '<p>Count it, and check. Different bills can make the same amount.</p>',
        mistake: '<p>Thinking more bills means more money. Five $10 bills and one $50 bill are both $50.</p>',
        check: [T('sameb'), P('f2-make', 2), P('f2-make', 3)] }
    ] }
  ];
  A.register('money', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Canadian coins</h2>' +
'<p>Canada uses five coins. Each coin has a value in <b>cents</b> (¢). 100 cents is the same as 1 dollar.</p>' +
'<div class="tbl"><table><thead><tr><th scope="col">Coin</th><th scope="col">Name</th><th scope="col">Value</th></tr></thead><tbody>' +
COINS.map(function (v) { return '<tr><td>' + WAL([v], { W: 80, label: 'a ' + CASH[v].n }) + '</td><td><b>' + CASH[v].n + '</b></td><td>' + c(v) + (v >= 100 ? ' = ' + d(v) : '') + '</td></tr>'; }).join('') +
'</tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Size does not tell value. A dime is smaller than a nickel, but a dime is worth more: 10¢ instead of 5¢.</p></div>' +
'<div class="vs"><div><b class="t">This</b><p>Count a coin by its <b>value</b>: a dime is 10¢.</p></div><div><b class="t">Not that</b><p>Do not go by size: the nickel is bigger, but it is only 5¢.</p></div></div>' +
'<div class="yt" data-yt="coin"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Counting coins</h2>' +
'<p>To count coins, start with the coin worth the <b>most</b>. Then skip count as you add each coin.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + wcoins([25, 25, 10, 5]) + '</div><p>I start with the quarters: 25, 50. Then the dime: 60. Then the nickel: 65. The total is <b>65¢</b>.</p></div>' +
'<div class="yt" data-yt="count"></div>' +
'<div class="lab"><span class="lt">Try it: count my coins</span>' +
'<p class="t2">Add coins up to 200¢. The counting is shown biggest coin first.</p>' +
builder('cc', COINS) +
'<div class="fig" id="ccfig"></div><div class="out" id="ccout"></div><button type="button" class="btn alt" id="cc0">Empty the purse</button></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting every coin by 1s, like "1, 2, 3 coins". Count the <b>value</b>: 25, 50, 60, 65.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Same amount, different coins</h2>' +
'<p>The same amount of money can be made in many ways. All of these are <b>50¢</b>.</p>' +
'<div class="vrow">' + SAME[50].map(function (L) { return '<figure>' + WAL(L, { W: 260, label: names(L) + '. Total 50¢' }) + '<figcaption>' + run(L, c) + '</figcaption></figure>'; }).join('') + '</div>' +
'<div class="eg"><b class="t">Watch me</b><p>Is 1 quarter and 3 dimes the same as 55¢? I count: 25, 35, 45, 55. Yes, it is <b>55¢</b>. So is 5 dimes and 1 nickel: 10, 20, 30, 40, 50, 55.</p></div>' +
'<div class="yt" data-yt="same"></div>' +
'<div class="lab"><span class="lt">Try it: make the amount</span>' +
'<div class="ctrl"><label for="mt">Make this amount<select id="mt"><option>25</option><option selected>50</option><option>75</option><option>100</option><option>150</option><option>200</option></select></label></div>' +
builder('mk', COINS) +
'<div class="fig" id="mkfig"></div><div class="out" id="mkout" aria-live="polite"></div><button type="button" class="btn alt" id="mk0">Start again</button></div>' +
'<div class="key"><b class="t">Key idea</b><p>4 quarters make 100¢. That is the same as 1 loonie, or $1. 2 loonies make 1 toonie, or $2.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Dollars and bills</h2>' +
'<p>Bigger amounts use <b>dollars</b> ($). The loonie is $1 and the toonie is $2. Canadian bills are $5, $10, $20, $50 and $100.</p>' +
'<div class="fig">' + WAL([500, 1000, 2000, 5000, 10000], { W: 420, keep: true, label: '$5, $10, $20, $50 and $100 bills' }) + '</div>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + wbills([5000, 2000, 2000, 500, 200]) + '</div><p>I start with the biggest: $50. Then $20 makes 70, another $20 makes 90. $5 makes 95. The toonie adds 2: <b>$97</b>.</p></div>' +
'<div class="yt" data-yt="bills"></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting each bill as one dollar. A $20 bill is worth 20 dollars, so count on by 20.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Same amount with bills</h2>' +
'<p>Bills can make the same amount in different ways too. All of these are <b>$100</b>.</p>' +
'<div class="vrow">' + SAMEB[10000].map(function (L) { return '<figure>' + WAL(L, { W: 320, label: names(L) + '. Total $100' }) + '<figcaption>' + run(L, d) + '</figcaption></figure>'; }).join('') + '</div>' +
'<div class="yt" data-yt="sameb"></div>' +
'<div class="lab"><span class="lt">Try it: pay with bills</span>' +
'<div class="ctrl"><label for="bt">Pay this amount<select id="bt"><option value="2000">$20</option><option value="3500">$35</option><option value="5000">$50</option><option value="10000" selected>$100</option><option value="15000">$150</option><option value="20000">$200</option></select></label></div>' +
builder('bk', [100, 200, 500, 1000, 2000, 5000, 10000]) +
'<div class="fig" id="bkfig"></div><div class="out" id="bkout" aria-live="polite"></div><button type="button" class="btn alt" id="bk0">Start again</button></div>' +
'<div class="key"><b class="t">Key idea</b><p>Before you pay, count. If you have too much, swap a big bill for smaller ones.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function setup(pre, denoms, cap, draw) {
        var have = {};
        denoms.forEach(function (v) { have[v] = 0; });
        function list() { var L = []; denoms.forEach(function (v) { for (var i = 0; i < have[v]; i++) L.push(v); }); return L; }
        $('#' + pre + 'st', root).addEventListener('click', function (e) {
          var b = e.target.closest('[data-v]'); if (!b) return;
          var v = +b.getAttribute('data-v'), s = +b.getAttribute('data-s'), tot = sum(list());
          if (s > 0 && tot + v > cap) { draw(list(), 'That would go over ' + (cap >= 1000 ? d(cap) : c(cap)) + '.'); return; }
          have[v] = Math.max(0, have[v] + s);
          $('#' + pre + v, root).textContent = have[v];
          draw(list());
        });
        $('#' + pre + '0', root).addEventListener('click', function () { denoms.forEach(function (v) { have[v] = 0; $('#' + pre + v, root).textContent = 0; }); draw([]); });
        return function () { draw(list()); };
      }
      var cc = setup('cc', COINS, 200, function (L, warn) {
        $('#ccfig', root).innerHTML = L.length ? wcoins(L) : '';
        $('#ccout', root).innerHTML = (L.length ? '<p>Count: ' + run(L, c) + '</p><p>Total: <span class="big">' + c(sum(L)) + '</span>' + (sum(L) >= 100 ? ' = ' + A.cents(sum(L)) : '') + '</p>' : '<p>The purse is empty. Press + to add a coin.</p>') + (warn ? '<p class="t2">' + warn + '</p>' : '');
      });
      cc();
      var mt = $('#mt', root);
      var mk = setup('mk', COINS, 400, function (L, warn) {
        var goal = +mt.value, t = sum(L);
        $('#mkfig', root).innerHTML = L.length ? wcoins(L) : '';
        $('#mkout', root).innerHTML = '<p>Goal: <b>' + c(goal) + '</b>. You have: <span class="big">' + c(t) + '</span></p><p>' +
          (t === goal ? '<b>That makes ' + c(goal) + '.</b> Can you find a different way? Press Start again.' : t < goal ? 'You need ' + c(goal - t) + ' more.' : 'That is ' + c(t - goal) + ' too much. Take a coin away.') + '</p>' + (warn ? '<p class="t2">' + warn + '</p>' : '');
      });
      mt.addEventListener('change', mk);
      mk();
      var bt = $('#bt', root);
      var bk = setup('bk', [100, 200, 500, 1000, 2000, 5000, 10000], 40000, function (L, warn) {
        var goal = +bt.value, t = sum(L);
        $('#bkfig', root).innerHTML = L.length ? wbills(L) : '';
        $('#bkout', root).innerHTML = '<p>Pay: <b>' + d(goal) + '</b>. You have: <span class="big">' + d(t) + '</span></p><p>' +
          (t === goal ? '<b>Exactly right.</b> Try another way to make ' + d(goal) + '.' : t < goal ? 'You need ' + d(goal - t) + ' more.' : 'That is ' + d(t - goal) + ' too much.') + '</p>' + (warn ? '<p class="t2">' + warn + '</p>' : '');
      });
      bt.addEventListener('change', bk);
      bk();
    },

    turns: {
      coin: function () { var v = R.pick(COINS), o = R.mc(c(v), COINS.filter(function (x) { return x !== v; }).map(c)); return { q: 'What is this coin worth?', type: 'mc', options: o.options, answer: o.answer, fig: WAL([v], { W: 80, label: 'a ' + CASH[v].n }), hint: 'Look at the table above. Find the coin with the same picture.', steps: ['This coin is a ' + CASH[v].n + '.', 'A ' + CASH[v].n + ' is worth ' + c(v) + '.'], explain: 'A ' + CASH[v].n + ' is worth ' + c(v) + '.' }; },
      count: function () { var L = randCoins([25, 10, 5], R.int(3, 5), 100), t = sum(L); return { q: 'How much money is this?', type: 'num', answer: t, unit: '¢', fig: wcoins(L), hint: 'Start with the biggest coins. Skip count.', steps: ['Biggest first: ' + names(L) + '.', 'Count on: ' + run(L, c) + '.'], explain: 'The total is ' + c(t) + '.' }; },
      same: function () {
        var amt = R.pick([25, 50, 75, 100]), ways = SAME[amt], right = R.pick(ways), wrongs = [right.concat([5]), right.length > 1 ? right.slice(1) : [10, 10], right.concat([10])];
        var o = R.mc(names(right), wrongs.map(names));
        return { q: 'Which coins make <b>' + c(amt) + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Count each choice, biggest coin first.', steps: [names(right) + ': ' + run(right, c) + '.', 'That is ' + c(amt) + '.'], explain: names(right) + ' make ' + c(amt) + '.' };
      },
      bills: function () { var L = randCoins([5000, 2000, 1000, 500, 200, 100], R.int(3, 4), 20000), t = sum(L); return { q: 'How much money is this?', type: 'num', answer: t / 100, unit: 'dollars', fig: wbills(L), hint: 'Start with the biggest bill. Count on by its value.', steps: ['Biggest first: ' + names(L) + '.', 'Count on: ' + run(L, d) + '.'], explain: 'The total is ' + d(t) + '.' }; },
      sameb: function () { var o = R.mc('Yes, both are $50', ['No, $20 bills make more', 'No, the $50 bill makes more']); return { q: 'Is two $20 bills and one $10 bill the same as one $50 bill?', type: 'mc', options: o.options, answer: o.answer, fig: '<div class="vrow"><figure>' + wbills([2000, 2000, 1000]) + '</figure><figure>' + wbills([5000]) + '</figure></div>', hint: 'Count the first group: 20, 40, then 50.', steps: ['20, 40, 50. The first group is $50.', 'The second group is one $50 bill.', 'They are the same.'], explain: 'Both groups are $50.' }; }
    },

    quiz: [
      { q: 'Which coin is worth <b>25¢</b>?', type: 'mc', options: ['nickel', 'dime', 'quarter', 'loonie'], answer: 2, hint: 'It is the biggest of the silver coins.', explain: 'A quarter is worth 25¢.' },
      { q: 'How much money is this?', type: 'num', answer: 85, unit: '¢', fig: wcoins([25, 25, 10, 10, 10, 5]), hint: 'Start with the quarters: 25, 50. Then count on by 10s, then 5.', explain: '25, 50, 60, 70, 80, 85. The total is 85¢.' },
      { q: 'How many quarters make 100¢?', type: 'num', answer: 4, hint: 'Count by 25s until you reach 100.', explain: '25, 50, 75, 100. That is 4 quarters.' },
      { q: 'Which coins make <b>40¢</b>?', type: 'mc', options: ['1 quarter and 1 dime', '1 quarter, 1 dime and 1 nickel', '3 dimes', '4 nickels'], answer: 1, hint: 'Count each choice.', explain: '25, 35, 40. A quarter, a dime and a nickel make 40¢.' },
      { q: 'How much money is this?', type: 'num', answer: 175, unit: '¢', fig: wcoins([100, 25, 25, 25]), hint: 'The loonie is 100¢. Then count on by 25s.', explain: '100, 125, 150, 175. The total is 175¢, which is $1.75.' },
      { q: 'How many dollars is this?', type: 'num', answer: 135, unit: 'dollars', fig: wbills([10000, 2000, 1000, 500]), hint: 'Start with $100. Count on 20, then 10, then 5.', explain: '100, 120, 130, 135. The total is $135.' },
      { q: 'Which is the same as <b>$20</b>?', type: 'mc', options: ['two $5 bills', 'two $10 bills', 'one $10 bill and one $5 bill', 'ten loonies and one $5 bill'], answer: 1, hint: 'Count each choice. Which one makes exactly 20?', explain: '$10 and $10 make $20.' }
    ],

    practice: [
      { id: 'f2-coins', name: 'Know the coins', code: 'F1.1', gen: function (lv) {
        var v = R.pick(COINS);
        if (lv === 3) { var big = R.pick([[100, 25, 4], [100, 10, 10], [100, 5, 20], [200, 100, 2], [50, 10, 5], [25, 5, 5], [200, 25, 8]]); return { q: 'How many <b>' + CASH[big[1]].n + 's</b> make <b>' + c(big[0]) + '</b>?', type: 'num', answer: big[2], hint: 'Skip count by ' + big[1] + ' until you reach ' + big[0] + '.', steps: ['Count by ' + big[1] + 's.', 'You reach ' + big[0] + ' after ' + big[2] + ' coins.'], explain: big[2] + ' ' + CASH[big[1]].n + 's make ' + c(big[0]) + '.' }; }
        if (lv === 2) { var o2 = R.mc(CASH[v].n, COINS.filter(function (x) { return x !== v; }).map(function (x) { return CASH[x].n; }).slice(0, 3)); return { q: 'Which coin is worth <b>' + c(v) + '</b>?', type: 'mc', options: o2.options, answer: o2.answer, hint: 'Nickel 5¢, dime 10¢, quarter 25¢, loonie 100¢, toonie 200¢.', steps: ['A ' + CASH[v].n + ' is worth ' + c(v) + '.'], explain: 'The ' + CASH[v].n + ' is worth ' + c(v) + '.' }; }
        var o = R.mc(c(v), COINS.filter(function (x) { return x !== v; }).map(c));
        return { q: 'What is this coin worth?', type: 'mc', options: o.options, answer: o.answer, fig: WAL([v], { W: 80, label: 'a ' + CASH[v].n }), hint: 'Read the number on the coin, or remember its name.', steps: ['This is a ' + CASH[v].n + '.', 'It is worth ' + c(v) + '.'], explain: 'A ' + CASH[v].n + ' is worth ' + c(v) + '.' };
      } },
      { id: 'f2-count', name: 'Count coins', code: 'F1.1', gen: function (lv) {
        var L = lv === 1 ? randCoins([10, 5], R.int(2, 5), 50) : lv === 2 ? randCoins([25, 10, 5], R.int(3, 5), 100) : randCoins([200, 100, 25, 10, 5], R.int(3, 6), 200), t = sum(L);
        return { q: 'How much money is this?', type: 'num', answer: t, unit: '¢', fig: wcoins(L), hint: 'Start with the coin worth the most. Skip count.', steps: ['Put the coins in order, biggest first: ' + names(L) + '.', 'Count on: ' + run(L, c) + '.', 'The total is ' + c(t) + '.'], explain: 'The total is ' + c(t) + '.' };
      } },
      { id: 'f2-same', name: 'Same amount, different coins', code: 'F1.1', gen: function (lv) {
        var amt = R.pick(lv === 1 ? [25, 50] : lv === 2 ? [50, 75, 100] : [100, 150, 200]), ways = R.shuffle(SAME[amt]), a = ways[0], b = ways[1];
        if (R.int(0, 1)) {
          var off = R.pick([5, 10, 25]), bad = b.concat([off]).sort(function (x, y) { return y - x; }), isSame = R.int(0, 1), show = isSame ? b : bad;
          var opts = ['Yes, they are the same', 'No, they are different'];
          return { q: 'Do these two groups have the <b>same</b> amount?', type: 'mc', options: opts, answer: isSame ? 0 : 1, fig: '<div class="vrow"><figure>' + wcoins(a) + '</figure><figure>' + wcoins(show) + '</figure></div>', hint: 'Count each group, biggest coin first.',
            steps: ['First group: ' + run(a, c) + '.', 'Second group: ' + run(show, c) + '.', isSame ? 'Both are ' + c(amt) + '.' : c(amt) + ' and ' + c(sum(show)) + ' are different.'], explain: isSame ? 'Both groups make ' + c(amt) + '.' : 'The groups make ' + c(amt) + ' and ' + c(sum(show)) + '.' };
        }
        var right = names(a), o = R.mc(right, [names(a.concat([5])), names(a.length > 1 ? a.slice(0, -1) : [10, 10]), names(a.concat([25]))].filter(function (x) { return x !== right; }));
        return { q: 'Which coins make <b>' + c(amt) + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Count each choice, biggest coin first.', steps: [right + ': ' + run(a, c) + '.', 'That is ' + c(amt) + '.'], explain: right + ' make ' + c(amt) + '.' };
      } },
      { id: 'f2-bills', name: 'Count dollars', code: 'F1.1', gen: function (lv) {
        var L = lv === 1 ? randCoins([200, 100, 500], R.int(2, 4), 1500) : lv === 2 ? randCoins([1000, 500, 200, 100], R.int(3, 4), 5000) : randCoins([10000, 5000, 2000, 1000, 500, 200], R.int(3, 5), 20000), t = sum(L);
        return { q: 'How many dollars is this?', type: 'num', answer: t / 100, unit: 'dollars', fig: wbills(L), hint: 'Start with the biggest. Count on by each one’s value.', steps: ['Biggest first: ' + names(L) + '.', 'Count on: ' + run(L, d) + '.', 'The total is ' + d(t) + '.'], explain: 'The total is ' + d(t) + '.' };
      } },
      { id: 'f2-make', name: 'Make an amount', code: 'F1.1', gen: function (lv) {
        if (lv === 3) {
          var goal = R.pick([2000, 5000, 10000, 15000, 20000]), have = randCoins([5000, 2000, 1000, 500], R.int(1, 3), goal - 500), need = goal - sum(have);
          return { q: 'You have the money below. How many <b>more dollars</b> do you need to make <b>' + d(goal) + '</b>?', type: 'num', answer: need / 100, unit: 'dollars', fig: wbills(have), hint: 'Count what you have. Then count up to ' + d(goal) + '.', steps: ['You have ' + d(sum(have)) + '.', 'Count up from ' + sum(have) / 100 + ' to ' + goal / 100 + '.', 'You need ' + d(need) + ' more.'], explain: d(goal) + ' − ' + d(sum(have)) + ' = ' + d(need) + '.' };
        }
        var g = lv === 1 ? R.pick([20, 30, 40, 50]) : R.pick([50, 75, 100, 125, 150]), set = lv === 1 ? [10, 5] : [25, 10, 5], h = randCoins(set, R.int(1, 3), g - 5), miss = g - sum(h);
        var coinsOk = COINS.filter(function (v) { return v === miss; });
        if (coinsOk.length) {
          var o = R.mc(CASH[miss].n, COINS.filter(function (v) { return v !== miss; }).map(function (v) { return CASH[v].n; }).slice(0, 3));
          return { q: 'You have the coins below. Which <b>one</b> coin will make <b>' + c(g) + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: wcoins(h), hint: 'Count what you have, then count up to ' + c(g) + '.', steps: ['You have ' + c(sum(h)) + '.', 'From ' + sum(h) + ' to ' + g + ' is ' + miss + '.', 'A ' + CASH[miss].n + ' is ' + c(miss) + '.'], explain: 'Add a ' + CASH[miss].n + ': ' + c(sum(h)) + ' + ' + c(miss) + ' = ' + c(g) + '.' };
        }
        return { q: 'You have the coins below. How many <b>more cents</b> do you need to make <b>' + c(g) + '</b>?', type: 'num', answer: miss, unit: '¢', fig: wcoins(h), hint: 'Count what you have, then count up to ' + c(g) + '.', steps: ['You have ' + c(sum(h)) + '.', 'Count up from ' + sum(h) + ' to ' + g + '.', 'You need ' + c(miss) + ' more.'], explain: c(g) + ' − ' + c(sum(h)) + ' = ' + c(miss) + '.' };
      } }
    ]
  });
})();
