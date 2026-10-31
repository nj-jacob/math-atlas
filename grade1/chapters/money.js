(function () {
  var A = Atlas, R = A.R;
  /* Canadian money up to $50. v is the value in cents. d is the coin diameter in mm (bills are drawn the same size). */
  var M = {
    nickel: { n: 'nickel', v: 5, lab: '5', say: '5 cents', d: 21.2, c: '#c9ccd3', animal: 'beaver' },
    dime: { n: 'dime', v: 10, lab: '10', say: '10 cents', d: 18.0, c: '#c9ccd3', animal: 'sailing ship' },
    quarter: { n: 'quarter', v: 25, lab: '25', say: '25 cents', d: 23.9, c: '#c9ccd3', animal: 'caribou' },
    fifty: { n: '50-cent coin', v: 50, lab: '50', say: '50 cents', d: 27.1, c: '#c9ccd3', animal: 'coat of arms' },
    loonie: { n: 'loonie', v: 100, lab: '1', say: '1 dollar', d: 26.5, c: '#d8b13a', animal: 'loon' },
    toonie: { n: 'toonie', v: 200, lab: '2', say: '2 dollars', d: 28.0, c: '#c9ccd3', animal: 'polar bear' },
    b5: { n: '$5 bill', v: 500, lab: '5', say: '5 dollars', c: '#3d7fd6', bill: 1 },
    b10: { n: '$10 bill', v: 1000, lab: '10', say: '10 dollars', c: '#8c4fc8', bill: 1 },
    b20: { n: '$20 bill', v: 2000, lab: '20', say: '20 dollars', c: '#3f9a5a', bill: 1 },
    b50: { n: '$50 bill', v: 5000, lab: '50', say: '50 dollars', c: '#d0443a', bill: 1 }
  };
  var COINS = ['nickel', 'dime', 'quarter', 'fifty', 'loonie', 'toonie'], BILLS = ['b5', 'b10', 'b20', 'b50'], ALL = COINS.concat(BILLS);
  function price(k) { var m = M[k]; return m.v < 100 ? m.v + '¢' : '$' + m.v / 100; }
  /* one coin or bill. Coins are drawn to scale with each other: 3.2 px per mm. */
  function money(k, x, y) {
    var m = M[k], s = '';
    if (m.bill) {
      s += '<rect x="' + (x - 70) + '" y="' + (y - 34) + '" width="140" height="68" rx="6" style="fill:' + m.c + '" stroke="rgba(0,0,0,.45)" stroke-width="2"/>';
      s += '<rect x="' + (x - 62) + '" y="' + (y - 26) + '" width="124" height="52" rx="4" style="fill:none;stroke:rgba(255,255,255,.55)" stroke-width="2"/>';
      s += '<circle cx="' + (x + 30) + '" cy="' + y + '" r="16" style="fill:rgba(255,255,255,.35)"/>';
      s += '<text x="' + (x - 44) + '" y="' + (y + 10) + '" text-anchor="middle" font-size="26" font-weight="700" style="fill:#fff;font-family:var(--display)">' + m.lab + '</text>';
      s += '<text x="' + (x + 48) + '" y="' + (y - 14) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:#fff">' + m.lab + '</text>';
      return s;
    }
    var r = m.d * 1.6, st = 'stroke="rgba(0,0,0,.5)" stroke-width="2"';
    if (k === 'loonie') {
      var p = []; for (var i = 0; i < 11; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 11; p.push((x + r * Math.cos(a)).toFixed(1) + ' ' + (y + r * Math.sin(a)).toFixed(1)); }
      s += '<path d="M' + p.join('L') + 'Z" style="fill:' + m.c + '" ' + st + '/>';
    } else if (k === 'toonie') {
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:#c9ccd3" ' + st + '/><circle cx="' + x + '" cy="' + y + '" r="' + r * 0.62 + '" style="fill:#d8b13a" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>';
    } else {
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + m.c + '" ' + st + '/><circle cx="' + x + '" cy="' + y + '" r="' + (r - 4) + '" style="fill:none;stroke:rgba(0,0,0,.2)" stroke-width="1.5"/>';
    }
    s += '<text x="' + x + '" y="' + (y + r * 0.3) + '" text-anchor="middle" font-size="' + (r * 0.8).toFixed(0) + '" font-weight="700" style="fill:#3a3a44;font-family:var(--display)">' + m.lab + '</text>';
    return s;
  }
  function one(k, o) {
    o = o || {};
    var m = M[k], w = m.bill ? 148 : 100, h = m.bill ? 76 : 100;
    return A.svg(w, h + (o.cap ? 26 : 0), money(k, w / 2, h / 2) + (o.cap ? '<text x="' + w / 2 + '" y="' + (h + 20) + '" text-anchor="middle" font-size="17" class="tb">' + o.cap + '</text>' : ''), o.label || 'a ' + m.n + (o.cap ? '' : ''));
  }
  function row(keys, caps) {
    return '<div class="vrow">' + keys.map(function (k) { return '<figure>' + one(k) + '<figcaption>' + (caps ? caps(k) : '') + '</figcaption></figure>'; }).join('') + '</div>';
  }
  function article(k) { return /^[aeiou]/.test(M[k].n) ? 'an' : 'a'; }

  function qName(lv) {
    var pool = lv === 1 ? ['nickel', 'dime', 'quarter', 'loonie', 'toonie'] : lv === 2 ? COINS.concat(['b5', 'b10']) : ALL;
    var k = R.pick(pool), wrong = R.shuffle(pool.filter(function (x) { return x !== k; })).slice(0, 2);
    if (R.int(0, 1)) {
      var opts = R.shuffle([k].concat(wrong));
      return { q: 'Which one is ' + article(k) + ' <b>' + M[k].n + '</b>?', type: 'mc', options: opts.map(function (x) { return one(x); }), answer: opts.indexOf(k),
        hint: 'A ' + M[k].n + ' is worth ' + M[k].say + '. Look for ' + (M[k].bill ? 'the bill with ' + M[k].lab + ' on it.' : 'the number ' + M[k].lab + ' on the coin.'), steps: ['A ' + M[k].n + ' is worth ' + M[k].say + '.', 'Look at the number on each one' + (k === 'loonie' ? ', and look for the gold coin with 11 sides' : k === 'toonie' ? ', and look for the coin with a gold centre' : '') + '.', 'The ' + M[k].n + ' is the one that shows ' + M[k].lab + '.'], explain: 'The ' + M[k].n + ' shows ' + M[k].lab + '. It is worth ' + M[k].say + '.' };
    }
    var o = R.mc(M[k].n, wrong.map(function (x) { return M[x].n; }));
    return { q: 'What is this called?', type: 'mc', options: o.options, answer: o.answer, fig: one(k),
      hint: 'Read the number on it. It tells the value.', steps: ['Read the number: ' + M[k].lab + '.', 'It is worth ' + M[k].say + '.', 'That is ' + article(k) + ' ' + M[k].n + '.'], explain: 'This is ' + article(k) + ' ' + M[k].n + '. It is worth ' + M[k].say + '.' };
  }
  function qValue(lv) {
    var pool = lv === 1 ? ['nickel', 'dime', 'quarter', 'loonie', 'toonie'] : lv === 2 ? COINS : ALL;
    var k = R.pick(pool), o = R.mc(price(k), R.shuffle(pool.filter(function (x) { return x !== k; })).slice(0, 2).map(price));
    return { q: 'How much is ' + article(k) + ' <b>' + M[k].n + '</b> worth?', type: 'mc', options: o.options, answer: o.answer, fig: lv < 3 ? one(k) : '',
      hint: 'Look at the number on it.', steps: ['Find the number on the ' + M[k].n + ': ' + M[k].lab + '.', M[k].v < 100 ? 'Coins worth less than a dollar are counted in cents. The sign ¢ means cents.' : 'This one is counted in dollars. The sign $ means dollars.', 'A ' + M[k].n + ' is worth ' + price(k) + '.'], explain: 'A ' + M[k].n + ' is worth ' + M[k].say + ': ' + price(k) + '.' };
  }
  function qCompare(lv) {
    var pool = lv === 1 ? ['nickel', 'dime', 'quarter', 'loonie', 'toonie'] : lv === 2 ? COINS : ALL, a, b;
    if (lv === 2 && R.int(0, 1)) { a = 'nickel'; b = 'dime'; }
    else { a = R.pick(pool); do { b = R.pick(pool); } while (b === a); }
    if (R.int(0, 1)) { var t = a; a = b; b = t; }
    var more = R.int(0, 1), ans = (M[a].v > M[b].v) === !!more ? a : b;
    return { q: 'Which is worth <b>' + (more ? 'more' : 'less') + '</b>?', type: 'mc', options: [one(a), one(b)], answer: ans === a ? 0 : 1,
      hint: 'Do not go by size. Read the value on each one.', steps: ['A ' + M[a].n + ' is worth ' + price(a) + '.', 'A ' + M[b].n + ' is worth ' + price(b) + '.', 'The ' + M[ans].n + ' is worth ' + (more ? 'more' : 'less') + '.'], explain: 'The ' + M[ans].n + ' (' + price(ans) + ') is worth ' + (more ? 'more' : 'less') + ' than the ' + M[ans === a ? b : a].n + ' (' + price(ans === a ? b : a) + ').' };
  }
  function qOrder(lv) {
    var pool = lv === 1 ? ['nickel', 'dime', 'quarter', 'loonie', 'toonie'] : lv === 2 ? COINS : ALL, ks = R.shuffle(pool).slice(0, 3);
    var s = ks.slice().sort(function (x, y) { return M[x].v - M[y].v; }), right = s.map(function (k) { return M[k].n; }).join(', ');
    var wr = [s.slice().reverse(), [s[1], s[0], s[2]], [s[0], s[2], s[1]], ks].map(function (l) { return l.map(function (k) { return M[k].n; }).join(', '); }).filter(function (x) { return x !== right; });
    var o = R.mc(right, R.shuffle(wr).slice(0, 2));
    return { q: 'Which list goes from <b>least to greatest</b> value?', type: 'mc', options: o.options, answer: o.answer, wide: true, fig: row(ks, function (k) { return M[k].n; }),
      hint: 'Write the value of each one. Then find the smallest.', steps: ['Values: ' + ks.map(function (k) { return M[k].n + ' ' + price(k); }).join(', ') + '.', 'The least is the ' + M[s[0]].n + '. The greatest is the ' + M[s[2]].n + '.', 'Least to greatest: ' + right + '.'], explain: 'Least to greatest: ' + s.map(function (k) { return M[k].n + ' (' + price(k) + ')'; }).join(', ') + '.' };
  }

  var CH = 'money';
  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters[CH].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  function mk(k, cap) { return { id: k, html: one(k) + (cap ? '<span>' + cap + '</span>' : ''), label: M[k].n }; }

  var LESSONS = [
    { id: 'coins', title: 'Canadian coins', sub: 'Name each coin and its value.', concepts: [
      { id: 'names', title: 'Name the coins', exp: ['F1.1'], skill: 'f-name',
        body: '<p>Canada has these coins. Look for the <b>number</b>, the <b>colour</b> and the <b>animal</b>.</p>',
        watch: { tool: 'g1stage', steps: COINS.map(function (k) { return { say: 'The <b>' + M[k].n + '</b>: worth ' + M[k].say + '. Look for the ' + M[k].animal + '.', act: function (t) { return t.show(one(k)); }, ms: 1400 }; }) },
        try: { tool: 'g1pick', opts: { multi: false, items: ['nickel', 'dime', 'quarter', 'loonie', 'toonie'].map(function (k) { return mk(k); }) }, tasks: [
          { do: 'Tap the <b>loonie</b>.', goal: function (s) { return s.picked[0] === 'loonie'; }, yes: 'The loonie is gold and has 11 sides. It is worth 1 dollar.' },
          { do: 'Tap the <b>quarter</b>.', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'quarter'; }, yes: 'The quarter is worth 25 cents.' },
          { do: 'Tap the <b>toonie</b>.', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'toonie'; }, yes: 'The toonie has a gold centre and is worth 2 dollars.' }
        ] },
        key: '<p>Nickel 5¢, dime 10¢, quarter 25¢, loonie $1, toonie $2.</p>',
        check: [P('f-name', 1), P('f-name', 2)] },
      { id: 'cents', title: 'Cents and dollars', exp: ['F1.1'], skill: 'f-value',
        body: '<p>Small coins are counted in <b>cents</b>: <b>¢</b>. The loonie and toonie, and all bills, are counted in <b>dollars</b>: <b>$</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'A dime is worth <b>10¢</b>, ten cents.', act: function (t) { return t.show(one('dime', { cap: '10¢' })); }, ms: 1400 },
          { say: 'A loonie is worth <b>$1</b>, one dollar.', act: function (t) { return t.show(one('loonie', { cap: '$1' })); }, ms: 1400 },
          { say: 'One dollar is the same as 100 cents. Dollars are worth more.', ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: '5', html: '<span class="big">5¢</span>' }, { id: '50', html: '<span class="big">50¢</span>' }, { id: '2', html: '<span class="big">$2</span>' }] }, tasks: [
          { do: 'How much is a <b>nickel</b> worth?<div class="fig">' + one('nickel') + '</div>', goal: function (s) { return s.picked[0] === '5'; }, yes: 'A nickel is worth 5 cents.' }
        ] },
        key: '<p><b>¢</b> means cents. <b>$</b> means dollars.</p>',
        check: [P('f-value', 1), P('f-value', 2)] }
    ] },

    { id: 'bills', title: 'Canadian bills', sub: 'Each bill has its own colour.', concepts: [
      { id: 'colours', title: 'Bills and their colours', exp: ['F1.1'], skill: 'f-name',
        body: '<p>Bills are paper money. Each one has its own <b>colour</b>: $5 blue, $10 purple, $20 green, $50 red.</p>',
        watch: { tool: 'g1stage', steps: BILLS.map(function (k) { return { say: 'The <b>' + M[k].n + '</b> is ' + { b5: 'blue', b10: 'purple', b20: 'green', b50: 'red' }[k] + '.', act: function (t) { return t.show(one(k)); }, ms: 1300 }; }) },
        try: { tool: 'g1pick', opts: { multi: false, items: BILLS.map(function (k) { return mk(k); }) }, tasks: [
          { do: 'Tap the <b>$20 bill</b>.', goal: function (s) { return s.picked[0] === 'b20'; }, yes: 'The $20 bill is green.' },
          { do: 'Tap the bill worth the <b>most</b>.', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'b50'; }, yes: 'The $50 bill is worth the most.' }
        ] },
        key: '<p>Read the <b>number</b> on a bill to know its value.</p>',
        check: [P('f-name', 3), P('f-value', 3)] }
    ] },

    { id: 'size', title: 'Size is not value', sub: 'Read the number.', concepts: [
      { id: 'dime', title: 'The small dime is worth more', exp: ['F1.1'], skill: 'f-compare', hard: true,
        body: '<p>A bigger coin is <b>not</b> always worth more. The dime is the smallest coin, but it is worth <b>10¢</b>. The bigger nickel is worth only 5¢.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'A nickel and a dime. Which is bigger?', act: function (t) { return t.show(row(['nickel', 'dime'], function (k) { return M[k].n; })); }, ms: 1500 },
          { say: 'The nickel is bigger.', ms: 1100 },
          { say: 'Now read the numbers: 5 and 10. The <b>dime</b> is worth more.', act: function (t) { return t.show(row(['nickel', 'dime'], function (k) { return M[k].n + ': ' + price(k); })); }, ms: 2000 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [mk('dime'), mk('nickel')] }, tasks: [
          { do: 'Tap the coin worth <b>more</b>.', goal: function (s) { return s.picked[0] === 'dime'; }, yes: 'The dime, 10¢. Small, but worth more.' }
        ] },
        ways: [
          { label: 'Read, do not look', html: '<p>Every coin has its value written on it. Always read the number. Never go by size.</p>' },
          { label: 'Ten and five', html: '<p>1 dime buys the same as 2 nickels. 10¢ = 5¢ + 5¢.</p>' + row(['dime', 'nickel', 'nickel'], function (k) { return price(k); }) }
        ],
        mistake: '<p>Choosing the nickel over the dime because it is bigger. Practise with real coins: "Read the number, not the size."</p>',
        key: '<p>Read the <b>number</b>, not the size.</p>',
        check: [P('f-compare', 1), P('f-compare', 2)] }
    ] },

    { id: 'order', title: 'Least to greatest', sub: 'Put money in order.', concepts: [
      { id: 'order', title: 'Put money in order', exp: ['F1.1'], skill: 'f-order',
        body: '<p>To put money in order, read each value. Start with the <b>least</b>. End with the <b>greatest</b>.</p>',
        watch: { tool: 'g1pick', opts: { items: ['quarter', 'loonie', 'dime'].map(function (k) { return mk(k, price(k)); }) }, steps: [
          { say: 'A quarter, a loonie and a dime. Least first.', ms: 1400 },
          { say: 'The dime: 10¢.', act: function (t) { return t.pick('dime'); }, ms: 800 },
          { say: 'The quarter: 25¢.', act: function (t) { return t.pick('quarter'); }, ms: 800 },
          { say: 'The loonie: $1. Least to greatest: <b>dime, quarter, loonie</b>.', act: function (t) { return t.pick('loonie'); }, ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { items: ['toonie', 'nickel', 'b5', 'quarter'].map(function (k) { return mk(k); }), readout: function (s) { return s.n ? '<p>Your order: <b>' + s.picked.map(function (k) { return M[k].n; }).join(', ') + '</b></p>' : '<p class="t2">Tap from least to greatest.</p>'; } }, tasks: [
          { do: 'Tap from <b>least to greatest</b>. Tap again to undo.', goal: function (s) { return s.picked.join() === 'nickel,quarter,toonie,b5'; }, yes: 'Nickel 5¢, quarter 25¢, toonie $2, $5 bill.' }
        ] },
        key: '<p>Least first, greatest last. <b>Every bill is worth more than every coin.</b></p>',
        check: [P('f-order', 1), P('f-order', 2)] }
    ] }
  ];

  A.register('money', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Canadian coins</h2>' +
'<p>Canada has these coins. The number on each coin tells its value. <b>¢</b> means cents. <b>$</b> means dollars.</p>' +
row(COINS, function (k) { return M[k].n + ': ' + price(k); }) +
'<div class="tbl"><table><thead><tr><th class="l">Coin</th><th>Value</th><th class="l">Look for</th></tr></thead><tbody>' + COINS.map(function (k) { return '<tr><td class="l">' + M[k].n + '</td><td>' + price(k) + '</td><td class="l">' + { nickel: 'silver, a beaver', dime: 'small and silver, a sailing ship', quarter: 'silver, a caribou', fifty: 'big and silver, rare', loonie: 'gold, 11 sides, a loon', toonie: 'silver with a gold centre, a polar bear' }[k] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
'<div class="eg"><b class="t">Watch me</b><p>This coin is gold and has 11 sides. It has a loon on it. It is a <b>loonie</b>. It is worth 1 dollar: $1.</p><div class="fig">' + one('loonie') + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Canada stopped using pennies in 2013, so you will not need them.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Canadian bills</h2>' +
'<p>Bills are paper money. Each bill has its own colour.</p>' +
row(BILLS, function (k) { return M[k].n + ': ' + { b5: 'blue', b10: 'purple', b20: 'green', b50: 'red' }[k]; }) +
'<div class="eg"><b class="t">Watch me</b><p>This bill is green and shows 20. It is a <b>$20 bill</b>. It is worth 20 dollars.</p><div class="fig">' + one('b20') + '</div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Size is not value</h2>' +
'<p>A bigger coin is <b>not</b> always worth more. Read the number to know its value.</p>' +
'<div class="vrow"><figure>' + one('nickel') + '<figcaption>nickel: bigger, worth 5¢</figcaption></figure><figure>' + one('dime') + '<figcaption>dime: smaller, worth 10¢</figcaption></figure></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>The dime is the smallest coin, but it is worth <b>more</b> than a nickel. 10¢ is more than 5¢.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>Which is worth more, a quarter or a loonie?</p><ol><li>A quarter is worth 25¢.</li><li>A loonie is worth $1. One dollar is the same as 100¢.</li><li>100¢ is more than 25¢, so the <b>loonie</b> is worth more.</li></ol></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Least to greatest</h2>' +
'<p>Here is all our money in order, from the <b>least</b> value to the <b>greatest</b>.</p>' +
'<div class="fig">' + A.svg(360, 284, ALL.map(function (k, i) { var r = Math.floor(i / 5), x = 36 + (i % 5) * 72, y0 = r * 146; return '<text x="' + x + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="21" class="tb">' + price(k) + '</text><line x1="' + x + '" y1="' + (y0 + 30) + '" x2="' + x + '" y2="' + (y0 + 46) + '" style="stroke:var(--ink)" stroke-width="2"/>' + '<rect x="' + (x - 14) + '" y="' + (y0 + 110 - (i + 1) * 6) + '" width="28" height="' + (i + 1) * 6 + '" rx="3" style="fill:' + (M[k].bill ? M[k].c : '#b9bcc4') + '"/>'; }).join('') + '<line x1="10" y1="38" x2="350" y2="38" style="stroke:var(--ink)" stroke-width="2"/><line x1="10" y1="184" x2="350" y2="184" style="stroke:var(--ink)" stroke-width="2"/><text x="10" y="134" font-size="19" class="t2">least</text><text x="350" y="280" text-anchor="end" font-size="19" class="t2">greatest</text>', 'Money from least to greatest value: ' + ALL.map(function (k) { return M[k].n; }).join(', ')) + '</div>' +
'<div class="lab"><span class="lt">Try it: compare two</span><div class="ctrl"><label for="mc1">First<select id="mc1">' + ALL.map(function (k) { return '<option value="' + k + '"' + (k === 'dime' ? ' selected' : '') + '>' + M[k].n + '</option>'; }).join('') + '</select></label>' +
'<label for="mc2">Second<select id="mc2">' + ALL.map(function (k) { return '<option value="' + k + '"' + (k === 'nickel' ? ' selected' : '') + '>' + M[k].n + '</option>'; }).join('') + '</select></label></div>' +
'<div id="mcfig"></div><div class="out" id="mcout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Every bill is worth more than every coin.</p></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function mc() {
        var a = $('#mc1', root).value, b = $('#mc2', root).value;
        $('#mcfig', root).innerHTML = '<div class="vrow"><figure>' + one(a) + '<figcaption>' + M[a].n + ': ' + price(a) + '</figcaption></figure><figure>' + one(b) + '<figcaption>' + M[b].n + ': ' + price(b) + '</figcaption></figure></div>';
        $('#mcout', root).innerHTML = a === b ? 'They are worth the <b>same</b>.' : 'The <b>' + M[M[a].v > M[b].v ? a : b].n + '</b> is worth more. ' + (!M[a].bill && !M[b].bill && (M[a].d > M[b].d) !== (M[a].v > M[b].v) ? 'Notice: the smaller coin is worth more here.' : '');
      }
      $('#mc1', root).addEventListener('change', mc); $('#mc2', root).addEventListener('change', mc); mc();
    },

    checks: [
      [function () { return qName(1); }, function () { return qValue(1); }, function () { return qName(2); }],
      [function () { return qName(3); }, function () { return qValue(3); }, function () { return qName(3); }],
      [function () { return qCompare(1); }, function () { return qCompare(2); }, function () { return qCompare(2); }],
      [function () { return qOrder(1); }, function () { return qCompare(3); }, function () { return qOrder(2); }]
    ],

    quiz: [
      { q: 'What is this called?', type: 'mc', options: ['nickel', 'quarter', 'toonie'], answer: 1, fig: one('quarter'),
        hint: 'Read the number on it.', explain: 'This coin shows 25. It is a quarter, worth 25¢.' },
      { q: 'How much is a <b>toonie</b> worth?', type: 'mc', options: ['$1', '$2', '25¢'], answer: 1,
        hint: 'Toonie sounds like "two".', explain: 'A toonie is worth 2 dollars: $2.' },
      { q: 'Which one is a <b>loonie</b>?', type: 'mc', options: [one('toonie'), one('fifty'), one('loonie')], answer: 2,
        hint: 'A loonie is gold and has 11 sides.', explain: 'The gold coin with 11 sides and a 1 on it is the loonie.' },
      { q: 'Which is worth <b>more</b>?', type: 'mc', options: [one('nickel'), one('dime')], answer: 1,
        hint: 'Do not go by size. Read the numbers.', explain: 'The dime is worth 10¢ and the nickel 5¢. The smaller dime is worth more.' },
      { q: 'What colour is the <b>$10 bill</b>?', type: 'mc', options: ['blue', 'purple', 'green', 'red'], answer: 1,
        hint: '$5 is blue, $20 is green, $50 is red.', explain: 'The $10 bill is purple.' },
      { q: 'Which is worth <b>less</b>?', type: 'mc', options: [one('b5'), one('toonie')], answer: 1,
        hint: 'Every bill is worth more than every coin.', explain: 'A toonie is $2 and the $5 bill is $5. The toonie is worth less.' },
      { q: 'Which list goes from <b>least to greatest</b> value?', type: 'mc', options: ['loonie, dime, quarter', 'dime, quarter, loonie', 'quarter, dime, loonie'], answer: 1, wide: true,
        hint: 'Dime 10¢, quarter 25¢, loonie $1.', explain: '10¢, then 25¢, then $1: dime, quarter, loonie.' }
    ],

    practice: [
      { id: 'f-name', name: 'Name the coin or bill', code: 'F1.1', gen: qName },
      { id: 'f-value', name: 'How much is it worth?', code: 'F1.1', gen: qValue },
      { id: 'f-compare', name: 'Worth more, worth less', code: 'F1.1', gen: qCompare },
      { id: 'f-order', name: 'Least to greatest', code: 'F1.1', gen: qOrder }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ---------- */
  var G = window.G1, nm = A.Q ? A.Q.name : function () { return 'Ava'; };
  function poolFor(lv) { return lv === 1 ? ['nickel', 'dime', 'quarter', 'loonie', 'toonie'] : lv === 2 ? COINS : ALL; }
  function some(lv, k) { return R.shuffle(poolFor(lv)).slice(0, k); }
  var SHAPES = {
    'f-name': [
      [1, 'match', function (lv) {
        var ks = some(lv, 3);
        return { q: 'Match each one to its name.', type: 'match', pairs: ks.map(function (k) { return [one(k), M[k].n]; }),
          hint: 'Look at the number, the colour and the picture.', steps: ['The loonie is gold with a loon. The toonie has two colours.'],
          explain: ks.map(function (k) { return 'the ' + M[k].n + ' shows ' + M[k].lab; }).join('. ') + '.', meta: { k: 'g1-mname-match' } };
      }],
      [1, 'tap', function (lv) {
        var ks = some(lv, 3), k = R.pick(ks);
        return { q: 'Tap the <b>' + M[k].n + '</b>.', type: 'tap', tiles: ks.map(function (x) { return one(x); }), answer: ks.indexOf(k), answerText: 'the ' + M[k].n,
          hint: 'The ' + M[k].n + ' shows ' + M[k].lab + '.', steps: ['Look for the number ' + M[k].lab + '.'],
          explain: 'The ' + M[k].n + ' is worth ' + M[k].say + '.', meta: { k: 'g1-mname-tap' } };
      }],
      [2, 'mistake', function (lv) {
        var ks = some(lv, 2), k = ks[0], who = nm(), truth = !R.int(0, 2), said = truth ? k : ks[1];
        var right = 'This is ' + article(k) + ' ' + M[k].n + '. It is worth ' + M[k].say + '.';
        return G.tf(who + ' says this is ' + article(said) + ' <b>' + M[said].n + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['Every silver coin is a dime.', 'The biggest coin is always the loonie.', 'Coins and bills have the same names.'], { k: 'g1-mname-tf' },
          { fig: one(k), hint: 'Look at the number on it.' });
      }],
      [3, 'pick', function () {
        var ks = R.shuffle(COINS).slice(0, 2).concat(R.shuffle(BILLS).slice(0, 2)), want = R.pick(['coin', 'bill']);
        ks = R.shuffle(ks);
        var ans = []; ks.forEach(function (k, j) { if (!!M[k].bill === (want === 'bill')) ans.push(j); });
        return { q: 'Pick every <b>' + want + '</b>.', type: 'pick', options: ks.map(function (k) { return one(k); }), answer: ans,
          hint: 'Coins are round. Bills are flat rectangles.', steps: ['Look at the shape of each one.'],
          explain: 'Bills are rectangles. Coins are round.', meta: { k: 'g1-mname-pick' } };
      }]
    ],
    'f-value': [
      [1, 'match', function (lv) {
        var ks = some(lv, 3);
        return { q: 'Match each one to what it is worth.', type: 'match', pairs: ks.map(function (k) { return [one(k), price(k)]; }),
          hint: 'The number tells the value. Coins with 1 or 2 are dollars.', steps: ['A loonie is $1. A toonie is $2.'],
          explain: ks.map(function (k) { return 'the ' + M[k].n + ' is ' + price(k); }).join('. ') + '.', meta: { k: 'g1-mval-match' } };
      }],
      [1, 'tap', function (lv) {
        var ks = some(lv, 3), k = R.pick(ks);
        return { q: 'Tap the one worth <b>' + price(k) + '</b>.', type: 'tap', tiles: ks.map(function (x) { return one(x); }), answer: ks.indexOf(k), answerText: 'the ' + M[k].n,
          hint: 'Look at the number on each one.', steps: [price(k) + ' is the ' + M[k].n + '.'],
          explain: 'The ' + M[k].n + ' is worth ' + price(k) + '.', meta: { k: 'g1-mval-tap' } };
      }],
      [2, 'mistake', function () {
        var k = R.pick(['nickel', 'dime']), who = nm(), truth = !R.int(0, 2), said = truth ? k : (k === 'nickel' ? 'dime' : 'nickel');
        var right = 'A ' + M[k].n + ' is worth ' + price(k) + '. Size does not tell the value.';
        return G.tf(who + ' says a <b>' + M[k].n + '</b> is worth <b>' + price(said) + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['Bigger coins are always worth more.', 'All silver coins are worth the same.', 'A coin is worth its size in mm.'], { k: 'g1-mval-tf' },
          { fig: row(['nickel', 'dime'], function (x) { return M[x].n; }), hint: 'Read the number on the coin.' });
      }]
    ],
    'f-compare': [
      [1, 'mistake', function (lv) {
        var a = 'nickel', b = 'dime', who = nm(), truth = R.int(0, 1), x = truth ? b : a, y = truth ? a : b;
        if (lv > 1) { var ks = some(lv, 2); x = ks[0]; y = ks[1]; truth = M[x].v > M[y].v; }
        var big = M[x].v > M[y].v ? x : y, small = big === x ? y : x;
        var right = 'The ' + M[big].n + ' is worth ' + price(big) + ' and the ' + M[small].n + ' is worth ' + price(small) + '.';
        return G.tf(who + ' says the <b>' + M[x].n + '</b> is worth more than the <b>' + M[y].n + '</b>. True or false: ' + who + ' is right.', !!truth, right,
          ['The bigger coin is always worth more.', 'Gold coins are always worth less.', 'They are worth the same.'], { k: 'g1-mcmp-tf' },
          { fig: row([x, y], function (k) { return M[k].n; }), hint: 'Compare the values, not the sizes.' });
      }],
      [1, 'pick', function (lv) {
        var base = R.pick(lv === 1 ? ['dime', 'quarter'] : ['dime', 'quarter', 'loonie']), ks;
        do { ks = some(lv, 4).filter(function (k) { return k !== base; }).slice(0, 4); } while (ks.length < 3 || ks.every(function (k) { return M[k].v > M[base].v; }) || !ks.some(function (k) { return M[k].v > M[base].v; }));
        var ans = []; ks.forEach(function (k, j) { if (M[k].v > M[base].v) ans.push(j); });
        return { q: 'Pick every one worth <b>more</b> than ' + article(base) + ' <b>' + M[base].n + '</b>.', type: 'pick', options: ks.map(function (k) { return one(k); }), answer: ans,
          hint: 'The ' + M[base].n + ' is worth ' + price(base) + '.', steps: ['Read the value of each one.', 'Is it more than ' + price(base) + '?'],
          explain: 'More than ' + price(base) + ': ' + ans.map(function (j) { return M[ks[j]].n; }).join(', ') + '.', meta: { k: 'g1-mcmp-pick' } };
      }],
      [2, 'story', function (lv) {
        var p = A.Q ? A.Q.two() : ['Ava', 'Kai'], ks = some(lv, 2), more = R.int(0, 1), win = (M[ks[0]].v > M[ks[1]].v) === !!more ? 0 : 1;
        var o = R.mc(p[win], [p[1 - win]]);
        return { q: p[0] + ' has ' + article(ks[0]) + ' ' + M[ks[0]].n + '. ' + p[1] + ' has ' + article(ks[1]) + ' ' + M[ks[1]].n + '. Who has <b>' + (more ? 'more' : 'less') + '</b> money?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'What is each one worth?', steps: ['A ' + M[ks[0]].n + ' is ' + price(ks[0]) + '. A ' + M[ks[1]].n + ' is ' + price(ks[1]) + '.'],
          explain: p[win] + ' has ' + (more ? 'more' : 'less') + '.', meta: { k: 'g1-mcmp-story' } };
      }]
    ],
    'f-order': [
      [1, 'order', function (lv) {
        var ks = some(lv, 3).sort(function (x, y) { return M[x].v - M[y].v; });
        return { q: 'Put them in order from <b>least to greatest</b> value.', type: 'order', items: ks.map(function (k) { return one(k); }), first: 'least', last: 'greatest',
          hint: 'Read the value of each one. Cents are less than dollars.', steps: ['The least is the ' + M[ks[0]].n + ' (' + price(ks[0]) + ').'],
          explain: ks.map(function (k) { return M[k].n + ' (' + price(k) + ')'; }).join(', ') + '.', meta: { k: 'g1-morder-order' } };
      }],
      [1, 'tap', function (lv) {
        var ks = some(lv, 3), most = R.int(0, 1), pickK = ks.slice().sort(function (x, y) { return most ? M[y].v - M[x].v : M[x].v - M[y].v; })[0];
        return { q: 'Tap the one worth the <b>' + (most ? 'most' : 'least') + '</b>.', type: 'tap', tiles: ks.map(function (k) { return one(k); }), answer: ks.indexOf(pickK), answerText: 'the ' + M[pickK].n,
          hint: 'Read the value of each one.', steps: ['The values are ' + ks.map(price).join(', ') + '.'],
          explain: 'The ' + M[pickK].n + ' is worth the ' + (most ? 'most' : 'least') + ': ' + price(pickK) + '.', meta: { k: 'g1-morder-tap' } };
      }],
      [2, 'mistake', function (lv) {
        var ks = some(lv, 3), s = ks.slice().sort(function (x, y) { return M[x].v - M[y].v; }), who = nm(), truth = !R.int(0, 2), shown = truth ? s : [s[1], s[0], s[2]];
        var right = 'From least to greatest: ' + s.map(function (k) { return M[k].n + ' (' + price(k) + ')'; }).join(', ') + '.';
        return G.tf(who + ' put these from least to greatest value: <b>' + shown.map(function (k) { return M[k].n; }).join(', ') + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['Smaller coins always come first.', 'Coins always come after bills.', 'Order by colour.'], { k: 'g1-morder-tf' },
          { hint: 'Read the value of each one.' });
      }]
    ]
  };
  G.shapes(CH, SHAPES);
})();
