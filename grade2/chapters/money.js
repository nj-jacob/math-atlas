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

  A.register('money', {
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
