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

  A.register('money', {
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
})();
