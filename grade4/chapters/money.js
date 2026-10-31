(function () {
  var A = Atlas, R = A.R;
  function $s(n) { return '$' + A.fmt(n); }
  function plural(w) { return /x$/.test(w) ? w + 'es' : w + 's'; }
  function an(w) { return (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w; }
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }

  /* ---------- drawings ---------- */
  var BILL = { 100: '#a77443', 50: '#c8483a', 20: '#3a8a52', 10: '#7d55b8', 5: '#3f73c4' };
  /* fewest bills and coins (whole dollars) */
  function parts(n) { var out = []; [100, 50, 20, 10, 5, 2, 1].forEach(function (v) { while (n >= v) { out.push(v); n -= v; } }); return out; }
  function cash(n, label) {
    var p = parts(n), x = 8, y = 8, s = '', rowH = 0, maxX = 0;
    p.forEach(function (v) {
      var w = v >= 5 ? 128 : 64;
      if (x + w > 452) { x = 8; y += rowH + 10; rowH = 0; }
      if (v >= 5) {
        s += '<rect x="' + x + '" y="' + y + '" width="120" height="62" rx="6" style="fill:' + BILL[v] + ';stroke:var(--ink)" stroke-width="2"/><rect x="' + (x + 6) + '" y="' + (y + 6) + '" width="108" height="50" rx="4" style="fill:none;stroke:#fff;stroke-opacity:.5" stroke-width="1.5"/>' +
          '<text x="' + (x + 60) + '" y="' + (y + 40) + '" text-anchor="middle" font-size="26" class="tb" style="fill:#fff">$' + v + '</text>';
        rowH = Math.max(rowH, 62);
      } else {
        var cx = x + 29, cy = y + 31;
        s += v === 2 ? '<circle cx="' + cx + '" cy="' + cy + '" r="29" style="fill:#c9ccd1;stroke:var(--ink)" stroke-width="2"/><circle cx="' + cx + '" cy="' + cy + '" r="18" style="fill:#d9b44a"/>' : '<circle cx="' + cx + '" cy="' + cy + '" r="27" style="fill:#d9b44a;stroke:var(--ink)" stroke-width="2"/>';
        s += '<text x="' + cx + '" y="' + (cy + 7) + '" text-anchor="middle" font-size="20" class="tb" style="fill:#2b2118">$' + v + '</text>';
        rowH = Math.max(rowH, 62);
      }
      x += w; maxX = Math.max(maxX, x);
    });
    return A.svg(Math.max(140, maxX + 4), y + rowH + 10, s, label || A.fmt(n) + ' dollars: ' + p.map(function (v) { return v >= 5 ? 'a $' + v + ' bill' : v === 2 ? 'a toonie' : 'a loonie'; }).join(', '));
  }
  function tags(items) {
    var s = '', x = 8, y = 8, maxX = 0;
    items.forEach(function (it) {
      if (x + 138 > 460) { x = 8; y += 98; }
      s += '<path d="M' + (x + 22) + ' ' + y + ' H' + (x + 130) + ' V' + (y + 86) + ' H' + (x + 22) + ' L' + x + ' ' + (y + 43) + ' Z" style="fill:color-mix(in srgb,var(--hi) 45%,var(--card));stroke:var(--ink)" stroke-width="2.5"/><circle cx="' + (x + 20) + '" cy="' + (y + 43) + '" r="5" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>' +
        '<text x="' + (x + 78) + '" y="' + (y + 34) + '" text-anchor="middle" font-size="18">' + it[0] + '</text><text x="' + (x + 78) + '" y="' + (y + 68) + '" text-anchor="middle" font-size="26" class="tb">' + $s(it[1]) + '</text>';
      x += 144; maxX = Math.max(maxX, x);
    });
    return A.svg(maxX, y + 96, s, 'Price tags: ' + items.map(function (it) { return it[0] + ' ' + it[1] + ' dollars'; }).join(', ') + '.');
  }
  /* counting up from a to b, with friendly jumps */
  function upJumps(a, b) {
    var out = [], t = a, nx;
    if (t % 10) { nx = Math.min(b, t - t % 10 + 10); out.push([t, nx]); t = nx; }
    if (b - t >= 10) { nx = t + Math.floor((b - t) / 10) * 10; out.push([t, nx]); t = nx; }
    if (b > t) out.push([t, b]);
    return out;
  }
  function countUp(a, b) {
    var J = upJumps(a, b), x0 = 36, x1 = 424, y = 110, xs = [x0], s = '';
    var ws = J.map(function (j) { return Math.max(100, (x1 - x0) * (j[1] - j[0]) / (b - a)); }), k = (x1 - x0) / ws.reduce(function (p, q) { return p + q; }, 0);
    ws.forEach(function (w) { xs.push(xs[xs.length - 1] + w * k); });
    s += '<line x1="' + (x0 - 14) + '" y1="' + y + '" x2="' + (x1 + 14) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="3"/>';
    J.forEach(function (j, i) {
      var p = xs[i], q = xs[i + 1], m = (p + q) / 2, top = y - Math.min(66, (q - p) * 0.45);
      s += '<path d="M' + (p + 4) + ' ' + (y - 4) + ' Q' + m + ' ' + (2 * top - y) + ' ' + (q - 4) + ' ' + (y - 4) + '" style="fill:none;stroke:var(--strand)" stroke-width="3"/>' +
        '<polygon points="' + (q - 4) + ',' + (y - 4) + ' ' + (q - 15) + ',' + (y - 13) + ' ' + (q - 9) + ',' + (y - 1) + '" style="fill:var(--strand)"/>' +
        '<text x="' + m + '" y="' + (top - 8) + '" text-anchor="middle" font-size="22" class="tb" style="fill:var(--strand)">+' + $s(j[1] - j[0]) + '</text>';
    });
    xs.forEach(function (x, i) {
      s += '<line x1="' + x + '" y1="' + (y - 10) + '" x2="' + x + '" y2="' + (y + 10) + '" style="stroke:var(--ink)" stroke-width="3"/><text x="' + x + '" y="' + (y + 36) + '" text-anchor="middle" font-size="22">' + $s(i ? J[i - 1][1] : a) + '</text>';
    });
    return A.svg(460, 160, s, 'Counting up from ' + a + ' dollars to ' + b + ' dollars: ' + J.map(function (j) { return 'plus ' + (j[1] - j[0]); }).join(', ') + '. Change: ' + (b - a) + ' dollars.');
  }
  function changeSteps(t, pay) {
    var J = upJumps(t, pay);
    return ['Count up from the total, ' + $s(t) + ', to the money paid, ' + $s(pay) + '.',
      J.map(function (j) { return $s(j[0]) + ' to ' + $s(j[1]) + ' is ' + $s(j[1] - j[0]); }).join('. ') + '.<div class="fig">' + countUp(t, pay) + '</div>',
      'Add the jumps: ' + J.map(function (j) { return $s(j[1] - j[0]); }).join(' + ') + ' = ' + $s(pay - t) + ' change.'];
  }
  /* earning flows into four choices */
  function jars(v) {
    v = v || {};
    var names = [['Spend', 'var(--btn)'], ['Save', 'var(--strand)'], ['Invest', '#3f73c4'], ['Donate', '#7d55b8']], s = '';
    s += '<rect x="140" y="4" width="180" height="48" rx="12" style="fill:color-mix(in srgb,var(--hi) 55%,var(--card));stroke:var(--ink)" stroke-width="2.5"/><text x="230" y="37" text-anchor="middle" font-size="24" class="tb">Earn' + (v.earn != null ? ' ' + $s(v.earn) : '') + '</text>';
    names.forEach(function (n, i) {
      var x = 6 + i * 113, cx = x + 51, amt = v[n[0].toLowerCase()], fillH = amt != null && v.earn ? 100 * amt / v.earn : 0;
      s += '<line x1="230" y1="52" x2="' + cx + '" y2="94" style="stroke:var(--ink)" stroke-width="2"/><polygon points="' + (cx - 7) + ',88 ' + cx + ',98 ' + (cx + 7) + ',88" style="fill:var(--ink)"/>';
      s += '<rect x="' + (x + 8) + '" y="100" width="86" height="12" rx="4" style="fill:var(--ink)"/>';
      if (fillH) s += '<rect x="' + (x + 4) + '" y="' + (214 - fillH) + '" width="94" height="' + fillH + '" style="fill:' + n[1] + ';fill-opacity:.35"/>';
      s += '<rect x="' + (x + 2) + '" y="112" width="98" height="104" rx="16" style="fill:none;stroke:var(--ink)" stroke-width="3"/>';
      s += '<text x="' + cx + '" y="146" text-anchor="middle" font-size="22" class="tb">' + n[0] + '</text>';
      if (amt != null) s += '<text x="' + cx + '" y="190" text-anchor="middle" font-size="26" class="tb">' + $s(amt) + '</text>';
    });
    return A.svg(460, 224, s, 'Money you earn can go four ways: spend, save, invest, donate' + (v.earn != null ? '. Earned ' + v.earn + ' dollars: spend ' + v.spend + ', save ' + v.save + ', invest ' + v.invest + ', donate ' + v.donate : '') + '.');
  }
  /* saving week by week toward a goal */
  function goalBar(goal, per, have) {
    have = have || 0;
    var weeks = Math.ceil((goal - have) / per), x0 = 20, W = 420, s = '', u = W / Math.max(goal, have + weeks * per);
    s += '<rect x="' + x0 + '" y="40" width="' + (goal * u) + '" height="46" rx="6" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>';
    if (have) s += '<rect x="' + x0 + '" y="40" width="' + have * u + '" height="46" style="fill:color-mix(in srgb,var(--hi) 70%,var(--card));stroke:var(--ink)" stroke-width="1"/>';
    for (var i = 0; i < weeks; i++) {
      var a = have + i * per, w = Math.min(per, goal - a);
      s += '<rect x="' + (x0 + a * u) + '" y="40" width="' + (w * u) + '" height="46" style="fill:color-mix(in srgb,var(--strand) ' + (i % 2 ? 30 : 50) + '%,var(--card));stroke:var(--ink)" stroke-width="1"/>';
      if (weeks <= 12) s += '<text x="' + (x0 + (a + w / 2) * u) + '" y="72" text-anchor="middle" font-size="' + (weeks > 8 ? 17 : 22) + '" class="tb">' + (i + 1) + '</text>';
    }
    s += '<text x="' + x0 + '" y="28" font-size="22">' + (have ? 'already have ' + $s(have) : '$0') + '</text><text x="' + (x0 + goal * u) + '" y="28" text-anchor="end" font-size="22" class="tb">goal ' + $s(goal) + '</text>';
    s += '<text x="' + x0 + '" y="116" font-size="21">Each part is one week of saving ' + $s(per) + '.</text>';
    return A.svg(460, 128, s, 'A bar to a goal of ' + goal + ' dollars' + (have ? ', starting with ' + have + ' dollars' : '') + ', filled ' + per + ' dollars a week. It takes ' + weeks + ' weeks.');
  }

  /* ---------- content data ---------- */
  var PAY = [
    ['cash', 'Bills and coins you hand over.', 'You can see exactly how much you have left.'],
    ['debit card', 'Takes money right away from your own bank account.', 'You can only spend money that is already in the account.'],
    ['credit card', 'Borrows money from a bank. You pay it back later.', 'If you do not pay it back on time, you pay extra (interest).'],
    ['gift card', 'Holds money to spend at one store or company.', 'It only works where it was bought for.'],
    ['phone or watch tap', 'A phone or watch linked to a debit or credit card.', 'It is still real money from the card behind it.'],
    ['e-transfer', 'Sends money from one bank account to another online.', 'Used to pay people, not usually in a store.']];
  var PAYQ = [
    ['Which way to pay takes money <b>right away</b> from your own bank account?', 'debit card'],
    ['Which way to pay <b>borrows</b> money that you must pay back later?', 'credit card'],
    ['Which way to pay only works at <b>one store or company</b>?', 'gift card'],
    ['Which way to pay uses <b>bills and coins</b>?', 'cash'],
    ['Which way would you use to send money to a friend\'s bank account <b>online</b>?', 'e-transfer']];
  var PAYS = [
    ['Grandma gave Ava a card for $25 to spend at the bookstore. How will Ava pay?', 'gift card', 'The card holds $25 for that bookstore only.'],
    ['Ben buys a $3 snack at a corner store that only takes bills and coins. How does he pay?', 'cash', 'The store only takes cash.'],
    ['Mom pays for groceries by tapping a card. The money leaves her bank account right away. Which card is it?', 'debit card', 'Money leaving the bank account right away means debit.'],
    ['Dad buys a fridge now and gets a bill to pay next month. How did he pay?', 'credit card', 'Paying later means the bank lent the money: credit.']];
  var CON = [
    ['Leo mows lawns and gets $15.', 'earning', 'Getting money for doing work is earning.'],
    ['Mia gives $5 to the food bank.', 'donating', 'Giving money to help others is donating.'],
    ['Sam buys a $12 video game.', 'spending', 'Using money to buy something is spending.'],
    ['Ana puts $10 in her piggy bank for a bike later.', 'saving', 'Keeping money to use later is saving.'],
    ['Raj buys a second lemonade jug so his stand can sell more and earn more.', 'investing', 'Using money now so it can grow into more money later is investing.'],
    ['Zoe gets paid $8 for walking a neighbour\'s dog.', 'earning', 'Getting money for doing work is earning.'],
    ['The class sends $40 from a bake sale to an animal shelter.', 'donating', 'Giving money to help others is donating.'],
    ['Eli keeps $20 in a bank account to pay for camp next summer.', 'saving', 'Keeping money to use later is saving.']];
  var GOODS = [['book', 5, 25], ['T-shirt', 8, 30], ['ball', 4, 20], ['puzzle', 6, 25], ['lunch box', 7, 22], ['hat', 9, 28], ['kite', 6, 35], ['art kit', 12, 45]];

  var gen = {
    pay: function (lv) {
      if (lv === 1) {
        var it = R.pick(PAYQ), o = R.mc(it[1], R.shuffle(['cash', 'debit card', 'credit card', 'gift card', 'e-transfer']).filter(function (x) { return x !== it[1]; }));
        var d = PAY.filter(function (p) { return p[0] === it[1]; })[0];
        return { q: it[0], type: 'mc', options: o.options, answer: o.answer, hint: 'Think about where the money comes from and when it leaves.', steps: [cap(it[1]) + ': ' + d[1]], explain: cap(it[1]) + ': ' + d[1] };
      }
      if (lv === 2) {
        var sc = R.pick(PAYS), o2 = R.mc(sc[1], R.shuffle(['cash', 'debit card', 'credit card', 'gift card']).filter(function (x) { return x !== sc[1]; }));
        return { q: sc[0], type: 'mc', options: o2.options, answer: o2.answer, hint: 'Look for clues: right away, later, one store, or bills and coins?', steps: [sc[2]], explain: sc[2] };
      }
      var F = R.pick([
        ['Which is <b>true</b> about a credit card?', 'You must pay the money back, and late payments cost extra.', ['It uses money that is already in your account.', 'It can only be used at one store.', 'The money is free and never paid back.']],
        ['Why might someone choose <b>cash</b> for small buys?', 'They can see exactly how much money they have left.', ['Cash is borrowed from the bank.', 'Cash only works at one store.', 'Cash costs extra interest.']],
        ['Which is <b>true</b> about a debit card?', 'You can only spend money that is already in your bank account.', ['You pay the money back next month.', 'It only works at one store.', 'It sends money by e-mail.']],
        ['Tapping a phone to pay uses...', 'real money from a card linked to the phone.', ['free money from the phone company.', 'money that never has to be paid.', 'points, not money.']]]);
      var o3 = R.mc(F[1], F[2]);
      return { q: F[0], type: 'mc', options: o3.options, answer: o3.answer, hint: 'Remember where the money comes from for each way to pay.', steps: [F[1]], explain: F[1] };
    },
    total: function (lv) {
      var n = lv === 1 ? 2 : lv === 2 ? 3 : 3, items = R.shuffle(GOODS).slice(0, n).map(function (g) { return [g[0], R.int(g[1], lv === 1 ? Math.min(g[2], 15) : g[2])]; });
      if (lv === 3 && R.int(0, 1)) {
        var t0 = items.reduce(function (p, it) { return p + it[1]; }, 0), est = items.map(function (it) { return Math.round(it[1] / 10) * 10; }), es = est.reduce(function (p, q) { return p + q; }, 0);
        var o = R.mc('about ' + $s(es), ['about ' + $s(es + 20), 'about ' + $s(Math.max(10, es - 20)), 'about ' + $s(es * 2)]);
        return { q: 'Estimate the total. Round each price to the nearest ten dollars.', type: 'mc', options: o.options, answer: o.answer, fig: tags(items),
          hint: 'Round each price to the nearest $10, then add.', steps: [items.map(function (it, i) { return $s(it[1]) + ' is about ' + $s(est[i]); }).join('. ') + '.', est.map($s).join(' + ') + ' = ' + $s(es) + '.', 'The exact total is ' + $s(t0) + ', which is close.'], explain: 'About ' + $s(es) + '. The exact total is ' + $s(t0) + '.' };
      }
      if (lv === 3) { var q = R.int(2, 4); items[0][1] = R.int(3, 9); }
      var tot = items.reduce(function (p, it, i) { return p + it[1] * (i === 0 && q ? q : 1); }, 0);
      var list = items.map(function (it, i) { return (i === 0 && q ? q + ' ' + plural(it[0]) : an(it[0])); });
      return { q: 'What is the total cost of ' + list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1] + '?', type: 'num', answer: tot, unit: '$', fig: tags(items),
        hint: q ? 'Multiply first: ' + q + ' &times; ' + $s(items[0][1]) + '. Then add the rest.' : 'Add the tens first, then the ones.',
        steps: (q ? [q + ' &times; ' + $s(items[0][1]) + ' = ' + $s(q * items[0][1]) + '.'] : []).concat(['Add: ' + items.map(function (it, i) { return $s(it[1] * (i === 0 && q ? q : 1)); }).join(' + ') + ' = ' + $s(tot) + '.', 'Check with an estimate: each price rounded to the nearest $10 gives about ' + $s(items.reduce(function (p, it, i) { return p + Math.round(it[1] * (i === 0 && q ? q : 1) / 10) * 10; }, 0)) + '.']),
        explain: 'The total is ' + $s(tot) + '.' };
    },
    change: function (lv) {
      var pay = lv === 1 ? R.pick([10, 20]) : lv === 2 ? R.pick([20, 50]) : R.pick([50, 100]), t;
      if (lv === 3) { var a = R.int(8, 30), b = R.int(6, Math.min(45, pay - a - 2)); t = a + b;
        return { q: 'You buy a game for ' + $s(a) + ' and a book for ' + $s(b) + '. You pay with ' + $s(pay) + '. How much change do you get?', type: 'num', answer: pay - t, unit: '$', fig: cash(pay, 'You pay with ' + pay + ' dollars.'),
          hint: 'Find the total first, then count up to ' + $s(pay) + '.', steps: ['Total: ' + $s(a) + ' + ' + $s(b) + ' = ' + $s(t) + '.'].concat(changeSteps(t, pay)), explain: 'Change: ' + $s(pay) + ' &minus; ' + $s(t) + ' = ' + $s(pay - t) + '.' }; }
      t = R.int(Math.max(1, pay - (lv === 1 ? 9 : 38)), pay - 1);
      return { q: 'Something costs ' + $s(t) + '. You pay with ' + $s(pay) + '. How much change do you get?', type: 'num', answer: pay - t, unit: '$', fig: cash(pay, 'You pay with ' + pay + ' dollars.'),
        hint: 'Count up from ' + $s(t) + ' to ' + $s(pay) + '.', steps: changeSteps(t, pay), explain: $s(t) + ' + ' + $s(pay - t) + ' = ' + $s(pay) + ', so the change is ' + $s(pay - t) + '.' };
    },
    con: function (lv) {
      if (lv === 3) {
        var F = R.pick([
          ['Before you <b>spend</b>, a good question to ask is:', 'Do I need it, or do I just want it?', ['How fast can I buy it?', 'Is the box a nice colour?', 'Will my friends notice?']],
          ['When you <b>donate</b>, an important thing to check is:', 'that the group really helps the cause you care about.', ['that the group has a nice logo.', 'that you give all your money.', 'that nobody else gives.']],
          ['A key idea about <b>investing</b> is:', 'it can grow your money, but you might also lose some.', ['it always doubles your money.', 'it means giving money away.', 'it is the same as spending.']],
          ['A smart way to <b>save</b> for something is to:', 'set a goal and save a bit each week.', ['spend first and save what is left, if any.', 'save only when you remember.', 'borrow money for it.']]]);
        var o3 = R.mc(F[1], F[2]);
        return { q: F[0], type: 'mc', options: o3.options, answer: o3.answer, hint: 'Think about which choice helps you make a careful decision.', steps: [F[1]], explain: F[1] };
      }
      var it = R.pick(CON), opts = lv === 1 ? ['earning', 'spending', 'saving', 'donating'] : ['earning', 'spending', 'saving', 'investing', 'donating'];
      if (opts.indexOf(it[1]) < 0) it = CON[0];
      var o = R.mc(it[1], R.shuffle(opts).filter(function (x) { return x !== it[1]; }));
      return { q: it[0] + ' What is this?', type: 'mc', options: o.options, answer: o.answer, hint: 'Is money coming in, going out to buy something, kept for later, given away, or used to grow more money?', steps: [it[2]], explain: it[2], fig: jars() };
    },
    save: function (lv) {
      var per = R.int(lv === 1 ? 2 : 3, lv === 1 ? 5 : 9), w = R.int(lv === 1 ? 2 : 4, lv === 1 ? 6 : 10), goal = per * w, have = 0, nm = R.pick(['Nora', 'Kai', 'Priya', 'Owen', 'Lea']), thing = R.pick(['a skateboard', 'a book set', 'a soccer ball', 'a board game', 'a paint set']);
      if (lv === 3) { goal = per * w + R.int(1, per - 1); have = R.int(2, 10); goal += have; }
      var wk = Math.ceil((goal - have) / per);
      return { q: nm + ' wants ' + thing + ' that costs ' + $s(goal) + '. ' + (have ? nm + ' already has ' + $s(have) + ' and saves ' : nm + ' saves ') + $s(per) + ' each week. How many weeks until ' + nm + ' has enough?', type: 'num', answer: wk, unit: 'weeks', fig: lv === 1 ? goalBar(goal, per, have) : '',
        hint: (have ? 'First find how much more is needed: ' + $s(goal) + ' &minus; ' + $s(have) + '. ' : '') + 'How many groups of ' + $s(per) + ' make ' + (have ? 'that' : $s(goal)) + '?' + (lv === 3 ? ' If there is a remainder, one more week is needed.' : ''),
        steps: (have ? ['Still needed: ' + $s(goal) + ' &minus; ' + $s(have) + ' = ' + $s(goal - have) + '.'] : []).concat([
          $s(goal - have) + ' &divide; ' + $s(per) + ' = ' + Math.floor((goal - have) / per) + ((goal - have) % per ? ' R ' + (goal - have) % per + '. The leftover means one more week.' : '.'),
          'It takes ' + wk + ' weeks.<div class="fig">' + goalBar(goal, per, have) + '</div>']),
        explain: wk + ' weeks: ' + wk + ' &times; ' + $s(per) + ' = ' + $s(wk * per) + (have ? ', plus ' + $s(have) + ' = ' + $s(wk * per + have) : '') + ', which is enough.' };
    },
    value: function (lv) {
      if (lv === 1) {
        var g = R.pick(GOODS), p1 = R.int(g[1] + 2, g[2]), p2 = p1 + R.pick([-3, -2, 2, 3, 4]);
        var o = R.mc(p1 < p2 ? 'Store A' : 'Store B', [p1 < p2 ? 'Store B' : 'Store A', 'They cost the same']);
        return { q: 'The same ' + g[0] + ' costs ' + $s(p1) + ' at Store A and ' + $s(p2) + ' at Store B. Which is the better price?', type: 'mc', options: o.options, answer: o.answer, fig: tags([['Store A', p1], ['Store B', p2]]),
          hint: 'For the same item, the lower price is the better deal.', steps: ['Compare ' + $s(p1) + ' and ' + $s(p2) + '.', 'Store ' + (p1 < p2 ? 'A' : 'B') + ' is ' + $s(Math.abs(p1 - p2)) + ' cheaper.'], explain: 'Store ' + (p1 < p2 ? 'A' : 'B') + ' saves ' + $s(Math.abs(p1 - p2)) + '.' };
      }
      if (lv === 2) {
        var n = R.pick([2, 3, 4, 5]), each = R.int(2, 6), packEach = each + R.pick([-1, 1]), pack = n * packEach, packBetter = packEach < each;
        var right = packBetter ? n + ' for ' + $s(pack) : $s(each) + ' each', o2 = R.mc(right, [packBetter ? $s(each) + ' each' : n + ' for ' + $s(pack), 'They cost the same']);
        return { q: 'Granola bars: a box of ' + n + ' for ' + $s(pack) + ', or ' + $s(each) + ' each. Which costs less for each bar?', type: 'mc', options: o2.options, answer: o2.answer, fig: tags([['box of ' + n, pack], ['one bar', each]]),
          hint: 'Find the cost of one bar in the box: ' + $s(pack) + ' &divide; ' + n + '.', steps: [$s(pack) + ' &divide; ' + n + ' = ' + $s(packEach) + ' for each bar in the box.', 'Compare ' + $s(packEach) + ' with ' + $s(each) + '.', right + ' costs less for each bar.'], explain: 'In the box, each bar is ' + $s(packEach) + '. Bought alone, each is ' + $s(each) + '. ' + (packBetter ? 'The box is the better buy, if you will eat them all.' : 'Buying them one at a time costs less here.') };
      }
      var price = R.int(20, 40), ship = R.int(4, 10), other = price + R.int(-3, ship + 4); if (other === price + ship) other++;
      var A1 = price + ship, best = A1 < other ? 'Online store' : 'Local store', o3 = R.mc(best, [best === 'Online store' ? 'Local store' : 'Online store', 'They cost the same']);
      return { q: 'Online: ' + $s(price) + ' plus ' + $s(ship) + ' shipping. Local store: ' + $s(other) + ' with no shipping. Which costs less in all?', type: 'mc', options: o3.options, answer: o3.answer,
        hint: 'Add the shipping to the online price first.', steps: ['Online total: ' + $s(price) + ' + ' + $s(ship) + ' = ' + $s(A1) + '.', 'Local total: ' + $s(other) + '.', best + ' costs less, by ' + $s(Math.abs(A1 - other)) + '.'], explain: 'Online costs ' + $s(A1) + ' in all; local costs ' + $s(other) + '. ' + best + ' is cheaper.' };
    }
  };

  var SHOP = [['book', 12], ['T-shirt', 15], ['ball', 8], ['puzzle', 19], ['snack', 3], ['kite', 24]];
  var DEALS = [
    ['Juice boxes', [['pack of 4', 8], ['one box', 3]], 'In the pack, each box is $8 &divide; 4 = $2. One box alone is $3. The pack is the better buy, if you will use all 4.'],
    ['Running shoes', [['Store A', 60], ['Store B', 45]], 'Same shoes, so the lower price is better: Store B saves $15. Check that they are the same brand and size.'],
    ['Headphones', [['Brand A', 12], ['Brand B', 30]], 'Brand A is cheaper, but read reviews. If A breaks in a month and B lasts years, B may be the better value.'],
    ['Pencil crayons', [['24 on sale', 12], ['12 regular', 15]], '24 for $12 means you get 2 crayons for every $1, so each one costs less than $1. 12 for $15 means each one costs more than $1. The sale box is the better buy, if you will use that many.']];

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  function payCard(p) { return '<div class="key" style="margin:6px 0"><p><b>' + cap(p[0]) + '</b>: ' + p[1] + '</p><p class="t2">' + p[2] + '</p></div>'; }

  var LESSONS = [
    { id: 'paying', title: 'Paying and change', sub: 'Ways to pay, totals, and counting up for change.', concepts: [
      { id: 'ways', title: 'Ways to pay', exp: ['F1.1'], skill: 'mo4-pay',
        body: '<p>We can pay with <b>cash</b>, a <b>debit card</b>, a <b>credit card</b>, a <b>gift card</b>, a phone tap or an <b>e-transfer</b>. They all move real money.</p>',
        watch: K.watch(PAY.map(function (p) { return [cap(p[0]) + '.', payCard(p), 2200]; })),
        example: K.watch([
          ['My turn. Nadia buys a $28 sweater. The money leaves her own bank account right away. How did she pay?', tags([['sweater', 28]]), 2200],
          ['I ask two questions. Where does the money come from? Her own account. When does it leave? Right away.', tags([['sweater', 28]]), 2400],
          ['Money from your own account, right away, means a <b>debit card</b>.', payCard(PAY[1]), 2200],
          ['If she had borrowed the money to pay back later, it would be a credit card.', payCard(PAY[2]), 2400]
        ]),
        key: '<p><b>Debit</b>: your money, right away. <b>Credit</b>: borrowed, pay it back later.</p>',
        mistake: '<p>Thinking a card or phone tap is "free" money. Point out that every tap comes from a bank account or a loan that must be paid back.</p>',
        check: [T('pay', 1), T('pay', 2), T('pay', 3)] },

      { id: 'totals', title: 'Find the total', exp: ['F1.2'], skill: 'mo4-total',
        body: '<p>Add the prices to find the <b>total</b>. Estimate first: round each price to the nearest $10.</p>',
        watch: K.watch([
          ['A book and a puzzle.', tags(SHOP.slice(0, 1).concat([SHOP[3]])), 1600],
          ['Estimate: $10 + $20 = $30. Exact: $12 + $19 = <b>$31</b>.', tags(SHOP.slice(0, 1).concat([SHOP[3]])) + cash(31), 2400]
        ]),
        try: K.lab({ controls: SHOP.map(function (it, i) { return { id: 'i' + i, label: cap(it[0]) + ' $' + it[1], type: 'toggle' }; }),
          render: function (s) { var pick = SHOP.filter(function (it, i) { return s['i' + i]; }); s.t = pick.reduce(function (p, it) { return p + it[1]; }, 0); return { fig: pick.length ? tags(pick) : '<p class="t2">Tap items to put them in the basket.</p>', out: '<p class="big">Total: ' + $s(s.t) + '</p>' + (s.t ? cash(s.t) : '') }; },
          tasks: [
            { do: 'Choose items that cost exactly <b>$20</b>.', goal: function (s) { return s.t === 20; }, yes: 'Exactly $20.' },
            { do: 'Now choose items that cost exactly <b>$50</b>.', goal: function (s) { return s.t === 50; }, yes: 'Exactly $50.' }
          ] }),
        example: K.watch([
          ['My turn. I will find the total for a kite and a ball.', tags([SHOP[5], SHOP[2]]), 1600],
          ['First I estimate. I round each price to the nearest $10: $24 is about $20, and $8 is about $10. $20 + $10 = $30.', tags([SHOP[5], SHOP[2]]), 2800],
          ['Now I add the exact prices: $24 + $8 = <b>$32</b>.', '<div>' + tags([SHOP[5], SHOP[2]]) + cash(32) + '</div>', 2200],
          ['$32 is close to my estimate of $30, so it makes sense.', '<div>' + tags([SHOP[5], SHOP[2]]) + cash(32) + '</div>', 2000]
        ]),
        key: '<p><b>Estimate, then add.</b> The total should be close to the estimate.</p>',
        check: [T('total', 1), T('total', 2), T('total', 3)] },

      { id: 'change', title: 'Count up for change', exp: ['F1.2'], skill: 'mo4-change', hard: true,
        body: '<p>To find change, <b>count up</b> from the price to the money you paid, like a cashier. Add the jumps.</p>',
        watch: K.watch([
          ['A $37 game. You pay with $50.', cash(50), 1800],
          ['Count up: $37 to $40 is $3. $40 to $50 is $10.', countUp(37, 50), 2400],
          ['$3 + $10 = <b>$13 change</b>.', countUp(37, 50) + cash(13), 2200]
        ]),
        try: K.lab({ controls: [{ id: 't', label: 'Price', min: 1, max: 99, value: 26, fmt: $s }, { id: 'p', label: 'You pay with', type: 'select', options: [['20', '$20'], ['50', '$50'], ['100', '$100']] }],
          render: function (s) { var p = +s.p; s.ok = s.t < p; if (!s.ok) return { fig: cash(p), out: '<p>That is not enough money. Pick a bigger bill.</p>' }; return { fig: countUp(s.t, p), out: '<p class="big">Change: ' + $s(p - s.t) + '</p>' + cash(p - s.t) }; },
          tasks: [
            { do: 'A toy costs <b>$37</b>. Pay with <b>$50</b>.', goal: function (s) { return s.t === 37 && s.p === '50'; }, yes: '$13 change.' },
            { do: 'Find a price that gives exactly <b>$25</b> change from $100.', goal: function (s) { return s.ok && s.p === '100' && s.t === 75; }, yes: '$75 + $25 = $100.' }
          ] }),
        ways: [
          { label: 'Subtract', html: '<p>Change = money paid &minus; price. $50 &minus; $37 = <b>$13</b>. Counting up and subtracting give the same answer.</p>' },
          { label: 'Hand it back', html: '<p>A cashier says: "$37 ... $38, $39, $40" (three loonies) "... and $50" (a $10 bill). The change is what was handed back: $13.</p>' }
        ],
        example: K.watch([
          ['My turn. A shirt costs $26. I pay with $40. How much change do I get?', cash(40), 1800],
          ['I count up from the price, like a cashier. $26 to $30 is $4.', countUp(26, 40), 2000],
          ['$30 to $40 is $10.', countUp(26, 40), 1600],
          ['I add the jumps: $4 + $10 = <b>$14 change</b>.', '<div>' + countUp(26, 40) + cash(14) + '</div>', 2400]
        ]),
        key: '<p><b>Count up from the price to the money paid.</b></p>',
        mistake: '<p>Subtracting the wrong way (37 &minus; 50) or forgetting the small first jump. Practise with real coins: say the amounts out loud while counting up.</p>',
        check: [T('change', 1), T('change', 2), T('change', 3)] }
    ] },

    { id: 'choices', title: 'Money choices', sub: 'Earn, spend, save, invest, donate.', concepts: [
      { id: 'five-ways', title: 'Where money goes', exp: ['F1.3'], skill: 'mo4-con',
        body: '<p>Money we <b>earn</b> can be <b>spent</b>, <b>saved</b> for later, <b>invested</b> so it can grow, or <b>donated</b> to help others.</p>',
        watch: K.watch([
          ['Leo earns $40 mowing lawns.', jars({ earn: 40 }), 1800],
          ['He spends $10, saves $20, invests $5 and donates $5.', jars({ earn: 40, spend: 10, save: 20, invest: 5, donate: 5 }), 2600]
        ]),
        try: K.lab({ controls: [['spend', 'Spend'], ['save', 'Save'], ['invest', 'Invest'], ['donate', 'Donate']].map(function (c) { return { id: c[0], label: c[1], min: 0, max: 40, step: 5, value: c[0] === 'spend' ? 40 : 0, fmt: $s }; }),
          render: function (s) { s.tot = s.spend + s.save + s.invest + s.donate; return { fig: jars({ earn: 40, spend: s.spend, save: s.save, invest: s.invest, donate: s.donate }), out: '<p>' + (s.tot === 40 ? 'All $40 has a job.' : s.tot < 40 ? $s(40 - s.tot) + ' still needs a job.' : 'That is ' + $s(s.tot - 40) + ' more than you earned.') + '</p>' }; },
          tasks: [{ do: 'Split $40: <b>save half</b>, <b>donate $5</b>, and use the rest however you like.', goal: function (s) { return s.tot === 40 && s.save === 20 && s.donate === 5; }, yes: 'Every dollar has a job, and half is saved.' }] }),
        example: K.watch([
          ['My turn. Ava earns $30 selling lemonade. Earning is money coming in.', jars({ earn: 30 }), 1800],
          ['She spends $5, saves $15 for a bike, invests $5 and donates $5.', jars({ earn: 30, spend: 5, save: 15, invest: 5, donate: 5 }), 2400],
          ['I check: 5 + 15 + 5 + 5 = 30. Earn comes in. Spend, save, invest and donate go out.', jars({ earn: 30, spend: 5, save: 15, invest: 5, donate: 5 }), 2600]
        ]),
        key: '<p><b>Earn</b> comes in. <b>Spend, save, invest, donate</b> go out.</p>',
        mistake: '<p>Mixing up saving and investing. Saving keeps money safe for later; investing uses money so it might grow, with some risk.</p>',
        check: [T('con', 1), T('con', 2), T('con', 3)] },

      { id: 'goal', title: 'Saving for a goal', exp: ['F1.4'], skill: 'mo4-save',
        body: '<p>Set a <b>goal</b>, then save the same amount each week. Divide to find how many weeks. A remainder means <b>one more week</b>.</p>',
        watch: K.watch([
          ['A $30 kite. Save $5 a week.', goalBar(30, 5), 1800],
          ['$30 &divide; $5 = <b>6 weeks</b>.', goalBar(30, 5), 1800],
          ['A $32 kite? 6 weeks gives $30: not enough. <b>7 weeks</b>.', goalBar(32, 5), 2400]
        ]),
        try: K.lab({ controls: [{ id: 'g', label: 'Goal', min: 10, max: 60, step: 1, value: 20, fmt: $s }, { id: 'p', label: 'Save each week', min: 1, max: 10, value: 4, fmt: $s }, { id: 'h', label: 'Already have', min: 0, max: 9, value: 0, fmt: $s }],
          render: function (s) { s.w = Math.max(0, Math.ceil((s.g - s.h) / s.p)); return { fig: goalBar(s.g, s.p, s.h), out: '<p class="big">' + s.w + ' week' + (s.w === 1 ? '' : 's') + '</p>' }; },
          tasks: [
            { do: 'Plan for a <b>$45</b> game, saving <b>$5</b> a week, starting with nothing.', goal: function (s) { return s.g === 45 && s.p === 5 && s.h === 0; }, yes: '9 weeks.' },
            { do: 'Same game, but you already have <b>$6</b>. How many weeks now?', goal: function (s) { return s.g === 45 && s.p === 5 && s.h === 6; }, yes: '$39 more: 7 R4, so 8 weeks.' }
          ] }),
        example: K.watch([
          ['My turn. A skateboard costs $45. I save $10 a week. How many weeks will it take?', goalBar(45, 10), 2000],
          ['I divide: $45 &divide; $10 = 4 R5. After 4 weeks I have $40.', goalBar(45, 10), 2000],
          ['$40 is not enough. The leftover $5 needs one more week: <b>5 weeks</b>.', goalBar(45, 10), 2400]
        ]),
        key: '<p><b>Still needed &divide; amount each week.</b> Leftover? Add a week.</p>',
        check: [T('save', 1), T('save', 2), T('save', 3)] },

    ] },

    { id: 'smart', title: 'Smart buying', sub: 'Needs, wants and good value.', concepts: [
      { id: 'needs', title: 'Needs and wants', exp: ['F1.3'], skill: 'mo4-con',
        body: '<p>A <b>need</b> is something you must have, like food or a winter coat. A <b>want</b> is nice to have. Before you spend, ask: <b>"Do I need it, or do I just want it?"</b></p>',
        watch: K.watch([
          ['Winter boots for a Canadian winter: a <b>need</b>.', tags([['winter boots', 45]]), 2000],
          ['A second video game: a <b>want</b>. It can wait, or be saved for.', tags([['video game', 30]]), 2200],
          ['Needs first. Then decide which wants are worth saving for.', tags([['winter boots', 45], ['video game', 30]]), 2200]
        ]),
        example: K.watch([
          ['My turn. I will sort lunch for school and a new phone case. I ask: "Do I need it, or do I just want it?"', tags([['lunch', 6], ['phone case', 20]]), 2400],
          ['I must eat, so lunch is a <b>need</b>.', tags([['lunch', 6]]), 1800],
          ['My old phone case still works, so a new one is a <b>want</b>.', tags([['phone case', 20]]), 2000],
          ['Needs first. Then I can decide if the want is worth saving for.', tags([['lunch', 6], ['phone case', 20]]), 2200]
        ]),
        key: '<p><b>Needs first, then wants.</b></p>',
        check: [T('con', 3), T('con', 3)] },

      { id: 'value', title: 'Good value', exp: ['F1.5'], skill: 'mo4-value', hard: true,
        body: '<p>The cheapest price is not always the best value. Compare the <b>price for one</b>, add <b>extra costs</b> like shipping, and think about <b>quality</b>.</p>',
        watch: K.watch(DEALS.map(function (d) { return [d[2], '<p class="tb">' + d[0] + '</p>' + tags(d[1]), 3200]; })),
        ways: [
          { label: 'Price for one', html: '<p>A pack of 4 for $8: $8 &divide; 4 = $2 each. One alone for $3. The pack is cheaper per item, <b>if</b> you will use all 4.</p>' },
          { label: 'Total cost', html: '<p>Online $30 + $8 shipping = $38. Local store $35. The local store costs less in all.</p>' }
        ],
        example: K.watch([
          ['My turn. A board game costs $40 online or $45 at a store. Which is the better value?', tags([['online', 40], ['store', 45]]), 2000],
          ['Online looks cheaper. But I check for extra costs: shipping is $8.', tags([['online', 40], ['shipping', 8], ['store', 45]]), 2000],
          ['The full cost online is $40 + $8 = $48. The store is $45.', tags([['online total', 48], ['store', 45]]), 2000],
          ['The store is the better value. It saves $3. I compare the full cost.', tags([['online total', 48], ['store', 45]]), 2400]
        ]),
        key: '<p>Compare <b>the same amount</b> and <b>the full cost</b>. Then think: will it last?</p>',
        mistake: '<p>Picking the biggest pack or the lowest sticker price without checking cost per item, shipping, or whether it will all get used.</p>',
        check: [T('value', 1), T('value', 2), T('value', 3)] }
    ] }
  ];

  A.register('money', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Ways to pay</h2>' +
'<p>There are many ways to pay for things. Each one gets money from a different place.</p>' +
'<div class="fig">' + cash(188, 'Canadian money: bills of 100, 50, 20, 10 and 5 dollars, a toonie (2 dollars) and a loonie (1 dollar).') + '</div>' +
'<p>Canadian bills: $5 (blue), $10 (purple), $20 (green), $50 (red), $100 (brown). Coins: the <b>toonie</b> is $2 and the <b>loonie</b> is $1.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Way to pay</th><th class="l">How it works</th><th class="l">Good to know</th></tr></thead><tbody>' +
PAY.map(function (p) { return '<tr><td class="l"><b>' + p[0] + '</b></td><td class="l">' + p[1] + '</td><td class="l">' + p[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a card is free money. A debit card spends money already in your account. A credit card is borrowed money that must be paid back.</p></div>' +
A.yt({ gen: function () { return gen.pay(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Totals and change</h2>' +
'<p>To find a <b>total</b>, add the prices. Estimate first by rounding each price to the nearest $10, so you know about what to expect.</p>' +
'<p>To find <b>change</b>, count up from the total to the money you paid. Jump to the next $10 first, then by tens.</p>' +
'<div class="lab"><span class="lt">Try it: go shopping</span>' +
'<div class="btnrow">' + SHOP.map(function (s, i) { return '<button type="button" class="btn alt" data-shop="' + i + '" aria-pressed="false">' + s[0] + ' ' + $s(s[1]) + '</button>'; }).join('') + '</div>' +
'<div class="ctrl"><label for="mpay">Pay with:<select id="mpay"><option value="20">$20</option><option value="50" selected>$50</option><option value="100">$100</option></select></label></div>' +
'<div class="fig" id="mshfig"></div><div class="out" id="mshout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A book is $12 and a puzzle is $19. You pay with $50. What is your change?</p><ol><li>Estimate: $10 + $20 = $30.</li><li>Total: $12 + $19 = $31.</li><li>Count up from $31 to $50: $31 to $40 is $9. $40 to $50 is $10.</li><li>Change: $9 + $10 = <b>$19</b>.</li></ol><div class="fig">' + countUp(31, 50) + '</div></div>' +
A.yt({ gen: function () { return gen.change(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Earn, spend, save, invest, donate</h2>' +
'<p>When you <b>earn</b> money, you choose what to do with it.</p>' +
'<div class="fig">' + jars() + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">Word</th><th class="l">Meaning</th><th class="l">Think about</th></tr></thead><tbody>' +
'<tr><td class="l"><b>earn</b></td><td class="l">get money for work</td><td class="l">What jobs can I do? How long will it take?</td></tr>' +
'<tr><td class="l"><b>spend</b></td><td class="l">use money to buy things</td><td class="l">Do I need it or want it? Is it a fair price?</td></tr>' +
'<tr><td class="l"><b>save</b></td><td class="l">keep money for later</td><td class="l">What is my goal? How much each week?</td></tr>' +
'<tr><td class="l"><b>invest</b></td><td class="l">use money so it can grow into more</td><td class="l">It may grow, but it may also lose some.</td></tr>' +
'<tr><td class="l"><b>donate</b></td><td class="l">give money to help others</td><td class="l">Which cause matters to me? Does the group really help?</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: plan $20 a week</span>' +
'<div class="ctrl"><label for="mjs">Save: <output id="mjso"></output><input type="range" id="mjs" min="0" max="20" value="8"></label><label for="mjd">Donate: <output id="mjdo"></output><input type="range" id="mjd" min="0" max="10" value="2"></label></div>' +
'<div class="fig" id="mjfig"></div><div class="out" id="mjout"></div></div>' +
A.yt({ gen: function () { return gen.con(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Spending and saving</h2>' +
'<p>Spending and saving pull against each other. <b>Every dollar you spend now is a dollar you cannot save.</b> Saving a little each week adds up to something bigger later.</p>' +
'<p>People make different choices. One person saves for a bike. Another spends on swimming lessons. A family may need money for food and rent first. What matters is having a plan that fits your needs and goals.</p>' +
'<div class="lab"><span class="lt">Try it: save for a goal</span>' +
'<div class="ctrl"><label for="mgg">Goal: <output id="mggo"></output><input type="range" id="mgg" min="10" max="120" step="5" value="45"></label><label for="mgp">Save each week: <output id="mgpo"></output><input type="range" id="mgp" min="1" max="20" value="5"></label></div>' +
'<div class="fig" id="mgfig"></div><div class="out" id="mgout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Weeks needed = goal &divide; amount saved each week. If there is a remainder, add one more week.</p></div>' +
A.yt({ gen: function () { return gen.save(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Is it a good buy?</h2>' +
'<p>A good buy is a fair price for something you will really use. Ways to check:</p>' +
'<ul><li><b>Compare prices</b> at different stores or websites.</li><li><b>Compare per item</b>: a pack can be cheaper for each item, but only if you use them all.</li><li><b>Add the extras</b>, like shipping.</li><li><b>Check quality</b>: read reviews or ask someone. Cheap things that break fast are not a good buy.</li><li><b>Need or want?</b> Wait a day before buying something you only want.</li></ul>' +
'<div class="lab"><span class="lt">Try it: compare two deals</span>' +
'<div class="ctrl"><label for="mdl">Deal:<select id="mdl">' + DEALS.map(function (d, i) { return '<option value="' + i + '">' + d[0] + '</option>'; }).join('') + '</select></label></div>' +
'<div class="fig" id="mdfig"></div><div class="btnrow"><button type="button" class="btn" id="mdbtn">Show the thinking</button></div><div class="out" id="mdout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking the biggest pack is always the best deal. Work out the price for one item, and think about whether you will use them all.</p></div>' +
A.yt({ gen: function () { return gen.value(2); } }) +
'</section>',

    init: function (root) {
      var $ = A.$, on = {};
      function shop() {
        var pay = +$('#mpay', root).value, pick = SHOP.filter(function (s, i) { return on[i]; }), t = pick.reduce(function (p, s) { return p + s[1]; }, 0), est = pick.reduce(function (p, s) { return p + Math.round(s[1] / 10) * 10; }, 0);
        A.$$('[data-shop]', root).forEach(function (b) { var k = on[b.getAttribute('data-shop')]; b.setAttribute('aria-pressed', String(!!k)); b.classList.toggle('alt', !k); });
        if (!pick.length) { $('#mshfig', root).innerHTML = ''; $('#mshout', root).innerHTML = '<p>Tap items to put them in your cart.</p>'; return; }
        $('#mshfig', root).innerHTML = tags(pick) + (t < pay ? countUp(t, pay) : '');
        $('#mshout', root).innerHTML = '<p>Estimate: about ' + $s(est) + '. Exact total: <span class="big">' + $s(t) + '</span>.</p>' +
          (t < pay ? '<p>Count up from ' + $s(t) + ' to ' + $s(pay) + ': your change is <b>' + $s(pay - t) + '</b>.</p>' : t === pay ? '<p>That is exactly ' + $s(pay) + '. No change.</p>' : '<p>' + $s(pay) + ' is not enough. You need ' + $s(t - pay) + ' more, or take something out.</p>');
      }
      A.$$('[data-shop]', root).forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-shop'); on[k] = !on[k]; shop(); }); });
      on[0] = on[1] = true;
      A.bind(root, ['mpay'], shop);
      A.bind(root, ['mjs', 'mjd'], function () {
        var sv = +$('#mjs', root).value, dn = +$('#mjd', root).value;
        if (sv + dn > 20) { dn = 20 - sv; $('#mjd', root).value = dn; }
        var sp = 20 - sv - dn;
        $('#mjso', root).textContent = $s(sv); $('#mjdo', root).textContent = $s(dn);
        $('#mjfig', root).innerHTML = jars({ earn: 20, spend: sp, save: sv, invest: 0, donate: dn });
        $('#mjout', root).innerHTML = '<p>Spend ' + $s(sp) + ', save ' + $s(sv) + ', donate ' + $s(dn) + '. That adds up to $20.</p><p>After 10 weeks you would have saved <span class="big">' + $s(sv * 10) + '</span> and given ' + $s(dn * 10) + '.</p>';
      });
      A.bind(root, ['mgg', 'mgp'], function () {
        var g = +$('#mgg', root).value, p = +$('#mgp', root).value, w = Math.ceil(g / p);
        $('#mggo', root).textContent = $s(g); $('#mgpo', root).textContent = $s(p);
        $('#mgfig', root).innerHTML = goalBar(g, p, 0);
        $('#mgout', root).innerHTML = '<p>' + $s(g) + ' &divide; ' + $s(p) + ' = ' + Math.floor(g / p) + (g % p ? ' R ' + g % p + ', so one more week' : '') + '. It takes <span class="big">' + w + ' week' + (w === 1 ? '' : 's') + '</span>.</p>' + (p < 20 ? '<p>Saving ' + $s(p + 1) + ' a week would take ' + Math.ceil(g / (p + 1)) + ' weeks.</p>' : '');
      });
      function dl(show) {
        var d = DEALS[+$('#mdl', root).value];
        $('#mdfig', root).innerHTML = tags(d[1]);
        $('#mdout', root).innerHTML = show ? '<p>' + d[2] + '</p>' : '<p>Which is the better buy? Think, then press the button.</p>';
      }
      $('#mdl', root).addEventListener('change', function () { dl(false); });
      $('#mdbtn', root).addEventListener('click', function () { dl(true); });
      dl(false);
    },

    quiz: [
      { q: 'Which way to pay takes money right away from your own bank account?', type: 'mc', options: ['credit card', 'debit card', 'gift card', 'cash'], answer: 1, hint: 'One card spends money you already have. One borrows.', explain: 'A debit card takes money right away from your bank account.' },
      { q: 'What is the total cost of a $14 book, a $23 game and an $8 ball?', type: 'num', answer: 45, unit: '$', fig: tags([['book', 14], ['game', 23], ['ball', 8]]), hint: 'Add the tens, then the ones: 10 + 20 and 4 + 3 + 8.', explain: '$14 + $23 + $8 = $45.' },
      { q: 'You buy something for $37 and pay with $50. How much change do you get?', type: 'num', answer: 13, unit: '$', fig: cash(50, 'A 50 dollar bill.'), hint: 'Count up from $37 to $40, then to $50.', explain: '$37 to $40 is $3, $40 to $50 is $10. Change: $13.' },
      { q: 'Sam gets $10 for walking a neighbour\'s dog. What is this?', type: 'mc', options: ['spending', 'earning', 'donating', 'investing'], answer: 1, hint: 'Is money coming in or going out?', explain: 'Getting money for work is earning.' },
      { q: 'Nora saves $6 each week. How many weeks will it take to save $42?', type: 'num', answer: 7, unit: 'weeks', hint: 'How many groups of 6 make 42?', explain: '42 &divide; 6 = 7 weeks.' },
      { q: 'Juice boxes: a pack of 4 for $8, or $3 each. Which costs less for each box?', type: 'mc', options: ['buying one at a time', 'the pack of 4', 'they cost the same'], answer: 1, hint: 'Find the cost of one box in the pack: $8 &divide; 4.', explain: 'In the pack each box is $2, which is less than $3.' },
      { q: 'Which is the best reason to wait before buying something?', type: 'mc', options: ['Because waiting makes prices go up', 'Because stores close at night', 'To check if you really need it and if the price is fair', 'To spend more later'], answer: 2, hint: 'Think about smart buying.', explain: 'Waiting gives you time to think about need and to compare prices.' }
    ],

    practice: [
      { id: 'mo4-pay', name: 'Ways to pay', code: 'F1.1', gen: gen.pay },
      { id: 'mo4-total', name: 'Totals', code: 'F1.2', gen: gen.total },
      { id: 'mo4-change', name: 'Making change', code: 'F1.2', gen: gen.change },
      { id: 'mo4-con', name: 'Earn, spend, save, invest, donate', code: 'F1.3', gen: gen.con },
      { id: 'mo4-save', name: 'Saving for a goal', code: 'F1.4', gen: gen.save },
      { id: 'mo4-value', name: 'Good value', code: 'F1.5', gen: gen.value }
    ]
  });

  /* ---------- More ways to ask (question shapes; see docs/QUESTIONS.md) ----------
     Whole dollars only. q.meta holds the facts that tests/verify/grade4.js uses to work each answer out again. */
  var why = K.why, who = A.Q && A.Q.name;
  var PAYFACTS = [['A debit card uses money that is already in your bank account.', true], ['A credit card borrows money that you pay back later.', true], ['A gift card works at any store.', false],
    ['Tapping a phone to pay is free money.', false], ['Paying a credit card late costs extra.', true], ['Cash comes out of your bank account each time you spend it.', false]];
  var SHAPES = {
    'mo4-pay': [
      [1, 'match', function () {
        var ps = R.shuffle(PAY).slice(0, 3), pairs = ps.map(function (p) { return [cap(p[0]), p[1]]; });
        return { q: 'Match each way to pay to what it does.', type: 'match', pairs: pairs, hint: 'Where does the money come from? When does it leave?',
          steps: ['Debit: right away from your account. Credit: borrowed, paid back later. Gift card: one store. Cash: bills and coins.'], explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join(' '), meta: { k: 'mo4-pay-match', pairs: pairs } };
      }],
      [1, 'mistake', function () {
        var f = R.pick(PAYFACTS), p = who();
        var right = f[1] ? 'That is right: ' + f[0].charAt(0).toLowerCase() + f[0].slice(1) : 'That is not right. ' + { 'A gift card works at any store.': 'A gift card only works at one store or company.', 'Tapping a phone to pay is free money.': 'Tapping uses real money from the card linked to the phone.', 'Cash comes out of your bank account each time you spend it.': 'Cash is bills and coins you already have in your hand.' }[f[0]];
        return { q: p + ' says: "' + f[0] + '" True or false: ' + p + ' is right.', type: 'tf', answer: f[1],
          why: why(right, ['All ways to pay work the same way.', 'Cards never use real money.', 'You never have to pay for things bought with a card.']),
          hint: 'Think about where the money comes from.', steps: [right], explain: right, meta: { k: 'mo4-pay-tf', fact: f[0] } };
      }],
      [2, 'pick', function () {
        var opts = R.shuffle(['cash', 'loonies and toonies', 'debit card', 'credit card', 'e-transfer']).slice(0, 4);
        if (!opts.some(function (o) { return /cash|loonies/.test(o); })) opts[0] = 'cash';
        var ans = opts.map(function (o, j) { return /cash|loonies/.test(o) ? -1 : j; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every way to pay that does <b>not</b> use bills or coins.', type: 'pick', options: opts.map(cap), answer: ans, hint: 'Which ones send money from a bank account or card?',
          steps: ['Cash, loonies and toonies are bills and coins.', 'Cards and e-transfers move money without bills or coins.'], explain: 'These do not use bills or coins: ' + ans.map(function (j) { return opts[j]; }).join(', ') + '.', meta: { k: 'mo4-pay-pick' } };
      }]
    ],
    'mo4-total': [
      [1, 'fill', function (lv) {
        var items = R.shuffle(GOODS).slice(0, 2).map(function (g) { return [g[0], R.int(g[1], lv === 1 ? Math.min(g[2], 15) : g[2])]; });
        return { q: 'Find the total cost.', type: 'fill', fill: $s(items[0][1]) + ' + ' + $s(items[1][1]) + ' = $[[]]', answers: [items[0][1] + items[1][1]], fig: tags(items),
          hint: 'Add the tens, then the ones.', steps: [$s(items[0][1]) + ' + ' + $s(items[1][1]) + ' = ' + $s(items[0][1] + items[1][1]) + '.'], explain: 'The total is ' + $s(items[0][1] + items[1][1]) + '.', meta: { k: 'mo4-total-fill', items: items } };
      }],
      [1, 'story', function (lv) {
        var p = who(), n = R.int(2, lv === 1 ? 3 : 5), each = R.int(2, lv === 1 ? 5 : 9), cap2 = R.int(6, 25);
        return { q: p + ' buys <b>' + n + '</b> packs of hockey cards at <b>$' + each + '</b> each and a cap for <b>$' + cap2 + '</b>. What is the total cost?', type: 'num', answer: n * each + cap2, unit: '$',
          hint: 'Multiply for the cards first. Then add the cap.', steps: [n + ' &times; $' + each + ' = $' + n * each + '.', '$' + n * each + ' + $' + cap2 + ' = $' + (n * each + cap2) + '.'],
          explain: 'The total is $' + (n * each + cap2) + '.', meta: { k: 'mo4-total-story' } };
      }],
      [2, 'mistake', function () {
        var items = R.shuffle(GOODS).slice(0, 3).map(function (g) { return [g[0], R.int(g[1], g[2])]; }), t = items.reduce(function (s, it) { return s + it[1]; }, 0), p = who(), truth = !R.int(0, 2);
        var said = truth ? t : t - items[2][1];
        var right = 'Add all three prices: ' + items.map(function (it) { return $s(it[1]); }).join(' + ') + ' = ' + $s(t) + '.';
        return { q: p + ' buys all three things and says the total is <b>' + $s(said) + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: tags(items),
          why: why(right, ['You only add the two biggest prices.', 'The total is the most expensive price.', 'Round every price down to find the total.']), hint: 'Add every price.', steps: [right], explain: right, meta: { k: 'mo4-total-tf', items: items, said: said } };
      }]
    ],
    'mo4-change': [
      [1, 'line', function (lv) {
        var pay = lv === 1 ? 10 : 20, t = R.int(pay - (lv === 1 ? 9 : 15), pay - 1);
        return { q: 'A snack costs <b>' + $s(t) + '</b>. You pay with <b>' + $s(pay) + '</b>. Count up, then place your change on the line.', type: 'line', min: 0, max: pay, tick: 1, every: 5, snap: 1, answer: pay - t, tol: 0, label: function (v) { return '$' + v; },
          fig: countUp(t, pay), hint: 'Count up from ' + $s(t) + ' to ' + $s(pay) + '.', steps: changeSteps(t, pay), explain: 'The change is ' + $s(pay - t) + '.', meta: { k: 'mo4-change-line', t: t, pay: pay } };
      }],
      [1, 'fill', function (lv) {
        var pay = lv === 1 ? 20 : R.pick([50, 100]), t = R.int(pay / 2, pay - 3);
        if (t % 10 === 0) t += 3;
        var ten = Math.ceil(t / 10) * 10;
        return { q: 'Something costs ' + $s(t) + '. You pay with ' + $s(pay) + '. Count up to find the change.', type: 'fill', fill: $s(t) + ' + $[[]] = ' + $s(ten) + '<br>' + $s(ten) + ' + $[[]] = ' + $s(pay) + '<br>Change: $[[]]', answers: [ten - t, pay - ten, pay - t],
          hint: 'Jump to the next ten first.', steps: changeSteps(t, pay), explain: 'The change is ' + $s(pay - t) + '.', meta: { k: 'mo4-change-fill', t: t, pay: pay } };
      }],
      [2, 'mistake', function () {
        var pay = R.pick([20, 50]), t = R.int(pay / 2, pay - 2), p = who(), truth = !R.int(0, 2), said = truth ? pay - t : pay - t + R.pick([-1, 1, 10]);
        if (said <= 0) said = pay - t + 1;
        var right = 'Count up from ' + $s(t) + ' to ' + $s(pay) + ': that is ' + $s(pay - t) + '.';
        return { q: 'A toy costs ' + $s(t) + '. ' + p + ' pays with ' + $s(pay) + ' and says the change should be <b>' + $s(said) + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: cash(pay, 'Paid with ' + pay + ' dollars'),
          why: why(right, ['Change is the price plus what you paid.', 'Change is always $10.', 'You get back the price of the toy.']), hint: 'Check: price + change should equal what was paid.', steps: [right], explain: right, meta: { k: 'mo4-change-tf', t: t, pay: pay, said: said } };
      }]
    ],
    'mo4-con': [
      [1, 'match', function () {
        var seen = {}, pairs = [];
        R.shuffle(CON).forEach(function (c) { if (pairs.length < 3 && !seen[c[1]]) { seen[c[1]] = 1; pairs.push([c[0], cap(c[1])]); } });
        return { q: 'Match each example to the money word.', type: 'match', pairs: pairs, hint: 'Is money coming in, going out, kept for later, given away, or used to grow more?',
          steps: ['Earn: get money for work. Spend: buy. Save: keep for later. Donate: give to help. Invest: use money so it can grow.'], explain: pairs.map(function (p) { return p[0] + ' ' + p[1] + '.'; }).join(' '), meta: { k: 'mo4-con-match', pairs: pairs } };
      }],
      [1, 'mistake', function () {
        var c = R.pick(CON), p = who(), truth = !R.int(0, 1), said = truth ? c[1] : R.pick(['earning', 'spending', 'saving', 'donating'].filter(function (x) { return x !== c[1]; }));
        return { q: c[0] + ' ' + p + ' says this is <b>' + said + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(c[2], ['Any time money moves, it is spending.', 'Saving means giving money away.', 'Earning means buying something you want.']), hint: 'Is the money coming in, going out, kept, given, or grown?', steps: [c[2]], explain: c[2], meta: { k: 'mo4-con-tf', text: c[0], said: said } };
      }],
      [2, 'pick', function () {
        var want = R.pick(['saving', 'earning', 'donating']), opts = R.shuffle(CON).slice(0, 5);
        if (!opts.some(function (c) { return c[1] === want; })) opts[0] = CON.filter(function (c) { return c[1] === want; })[0];
        var ans = opts.map(function (c, j) { return c[1] === want ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every example of <b>' + want + '</b>.', type: 'pick', options: opts.map(function (c) { return c[0]; }), answer: ans, hint: { saving: 'Saving keeps money for later.', earning: 'Earning gets money for work.', donating: 'Donating gives money to help others.' }[want],
          steps: ['Read each one. Ask where the money goes.'], explain: 'These are ' + want + ': ' + ans.map(function (j) { return opts[j][0]; }).join(' '), meta: { k: 'mo4-con-pick', want: want } };
      }]
    ],
    'mo4-save': [
      [1, 'line', function (lv) {
        var p = who(), per = R.int(2, lv === 1 ? 5 : 9), w = R.int(2, lv === 1 ? 6 : 10);
        return { q: p + ' saves <b>$' + per + '</b> each week. Place how much ' + p + ' has after <b>' + w + ' weeks</b>.', type: 'line', min: 0, max: per * 10, tick: per, every: per * 5, snap: per, answer: per * w, tol: 0, label: function (v) { return '$' + v; },
          hint: 'Each jump is $' + per + '. Make ' + w + ' jumps.', steps: [w + ' &times; $' + per + ' = $' + per * w + '.'], explain: p + ' has $' + per * w + ' after ' + w + ' weeks.', meta: { k: 'mo4-save-line', per: per, w: w } };
      }],
      [1, 'fill', function () {
        var per = R.int(3, 9), p = who();
        return { q: p + ' saves <b>$' + per + '</b> each week. Fill in the savings table.', type: 'fill', fill: '<div class="tbl"><table><tr><th>Week</th><td>1</td><td>2</td><td>3</td><td>5</td></tr><tr><th>Saved ($)</th><td>' + per + '</td><td>[[]]</td><td>[[]]</td><td>[[]]</td></tr></table></div>', answers: [2 * per, 3 * per, 5 * per],
          hint: 'Each week adds $' + per + '.', steps: ['Week 2: $' + 2 * per + '. Week 3: $' + 3 * per + '.', 'Week 5: 5 &times; $' + per + ' = $' + 5 * per + '.'], explain: 'Savings grow by $' + per + ' each week.', meta: { k: 'mo4-save-fill', per: per } };
      }],
      [2, 'mistake', function () {
        var per = R.int(3, 9), w = R.int(3, 8), goal = per * w + R.int(1, per - 1), p = who(), truth = !R.int(0, 1), said = truth ? w + 1 : w;
        var right = '$' + goal + ' &divide; $' + per + ' = ' + w + ' R ' + (goal - per * w) + '. After ' + w + ' weeks there is still $' + (goal - per * w) + ' to go, so it takes ' + (w + 1) + ' weeks.';
        return { q: 'A board game costs <b>$' + goal + '</b>. ' + p + ' saves <b>$' + per + '</b> each week and says it will take <b>' + said + ' weeks</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: goalBar(goal, per, 0),
          why: why(right, ['You can leave the leftover dollars out.', 'Saving always takes 10 weeks.', 'Divide the price by 10.']), hint: 'Is there a remainder? It still needs a week.', steps: [right], explain: right, meta: { k: 'mo4-save-tf', goal: goal, per: per, said: said } };
      }]
    ],
    'mo4-value': [
      [1, 'tap', function () {
        var g = R.pick(GOODS), ps = [];
        while (ps.length < 3) { var v = R.int(g[1] + 2, g[2] + 3); if (ps.indexOf(v) < 0) ps.push(v); }
        var best = Math.min.apply(null, ps), names = ['Store A', 'Store B', 'Store C'];
        return { q: 'The same ' + g[0] + ' is sold at three stores. Tap the <b>best price</b>.', type: 'tap', tiles: ps.map(function (v, i) { return tags([[names[i], v]]); }), answer: ps.indexOf(best), answerText: names[ps.indexOf(best)] + ', ' + $s(best),
          hint: 'For the same item, the lowest price is the best deal.', steps: ['Compare ' + ps.map($s).join(', ') + '.'], explain: names[ps.indexOf(best)] + ' has the lowest price, ' + $s(best) + '.', meta: { k: 'mo4-value-tap', ps: ps } };
      }],
      [1, 'fill', function () {
        var n = R.pick([2, 3, 4, 5]), each = R.int(2, 7);
        return { q: 'A box of <b>' + n + '</b> juice boxes costs <b>$' + n * each + '</b>. How much is each juice box?', type: 'fill', fill: '$' + n * each + ' &divide; ' + n + ' = $[[]] each', answers: [each],
          hint: 'Share the price equally among the ' + n + ' juice boxes.', steps: [n + ' &times; $' + each + ' = $' + n * each + '.'], explain: 'Each juice box costs $' + each + '.', meta: { k: 'mo4-value-fill' } };
      }],
      [2, 'mistake', function () {
        var price = R.int(20, 40), ship = R.int(4, 10), other = price + R.int(1, ship - 1), p = who(), saysOnline = !R.int(0, 1), onlineBest = price + ship < other;
        var right = 'Online costs ' + $s(price) + ' + ' + $s(ship) + ' = ' + $s(price + ship) + ' in all. The local store costs ' + $s(other) + '.';
        return { q: 'Online: ' + $s(price) + ' plus ' + $s(ship) + ' shipping. Local store: ' + $s(other) + '. ' + p + ' says the <b>' + (saysOnline ? 'online store' : 'local store') + '</b> costs less in all. True or false: ' + p + ' is right.', type: 'tf', answer: saysOnline === onlineBest,
          why: why(right, ['Shipping is free, so leave it out.', 'Online is always cheaper.', 'The store with the bigger sign is cheaper.']), hint: 'Add the shipping first.', steps: [right], explain: right, meta: { k: 'mo4-value-tf', price: price, ship: ship, other: other, saysOnline: saysOnline } };
      }]
    ]
  };
  Atlas.Q.shapes('money', SHAPES);
})();
