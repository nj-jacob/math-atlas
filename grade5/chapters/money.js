(function () {
  var A = Atlas, R = A.R;
  function cents(v) { var n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : Math.round(n * 100); }
  /* Canadian cash rounding: to the nearest 5 cents; 1,2,6,7 round down; 3,4,8,9 round up */
  function cash(c) { return Math.round(c / 5) * 5; }
  /* Ontario HST is 13% */
  function hst(c) { return Math.round(c * 13 / 100); }
  var M = A.money;
  function txt(x, y, t, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 17) + '"' + (o.c ? ' style="fill:' + o.c + '"' : '') + ' class="' + (o.cl || 'tb') + '">' + t + '</text>'; }
  function arr(x1, y1, x2, y2, col) {
    var a = Math.atan2(y2 - y1, x2 - x1), c = col || 'var(--ink)';
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + (x2 - 8 * Math.cos(a)).toFixed(1) + '" y2="' + (y2 - 8 * Math.sin(a)).toFixed(1) + '" style="stroke:' + c + '" stroke-width="3"/>' +
      '<path d="M' + x2 + ' ' + y2 + ' L' + (x2 - 12 * Math.cos(a) + 7 * Math.sin(a)).toFixed(1) + ' ' + (y2 - 12 * Math.sin(a) - 7 * Math.cos(a)).toFixed(1) + ' L' + (x2 - 12 * Math.cos(a) - 7 * Math.sin(a)).toFixed(1) + ' ' + (y2 - 12 * Math.sin(a) + 7 * Math.cos(a)).toFixed(1) + ' z" style="fill:' + c + '"/>';
  }
  function card(x, y, col, word) {
    return '<rect x="' + x + '" y="' + y + '" width="96" height="60" rx="8" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2"/><rect x="' + (x + 10) + '" y="' + (y + 16) + '" width="18" height="14" rx="3" style="fill:#f2c94c;stroke:var(--ink)" stroke-width="1"/>' +
      txt(x + 48, y + 52, word, { s: 13, c: '#fff' });
  }
  /* pictures for each way to pay */
  var PAY = {
    cash: function () { return '<rect x="10" y="22" width="92" height="48" rx="4" style="fill:#bfe3c5;stroke:var(--ink)" stroke-width="2"/><circle cx="56" cy="46" r="13" style="fill:none;stroke:#2b7a3d" stroke-width="2"/>' + txt(56, 52, '$', { s: 16, c: '#2b7a3d' }) + '<circle cx="112" cy="70" r="18" style="fill:#e6c35c;stroke:var(--ink)" stroke-width="2"/>' + txt(112, 76, '$2', { s: 14 }); },
    debit: function () { return card(22, 22, '#2563c9', 'DEBIT'); },
    credit: function () { return card(22, 22, '#7a3fc4', 'CREDIT'); },
    etransfer: function () { return '<rect x="20" y="8" width="44" height="78" rx="8" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>' + txt(42, 54, '$', { s: 22, c: 'var(--good)' }) + arr(70, 47, 104, 47, 'var(--good)') + '<path d="M108 66 h30 M110 66 v-22 M120 66 v-22 M130 66 v-22 M106 44 l17 -12 l17 12 z" style="fill:none;stroke:var(--ink)" stroke-width="2.5"/>'; },
    deposit: function () { return '<rect x="10" y="22" width="40" height="62" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><path d="M18 32 h8 M32 32 h8 M18 46 h8 M32 46 h8 M18 60 h8 M32 60 h8" style="stroke:var(--ink2)" stroke-width="4"/>' + arr(56, 52, 92, 52, 'var(--good)') + '<path d="M98 84 h40 M102 84 v-28 M114 84 v-28 M126 84 v-28 M138 84 v-28 M96 56 l22 -16 l22 16 z" style="fill:none;stroke:var(--ink)" stroke-width="2.5"/>'; },
    cheque: function () { return '<rect x="8" y="20" width="124" height="58" rx="3" style="fill:#fdf6e3;stroke:var(--ink)" stroke-width="2"/><path d="M18 36 h60 M18 50 h104 M80 66 q8 -10 14 0 t14 0 t12 -4" style="fill:none;stroke:var(--ink2)" stroke-width="2"/>'; }
  };
  function payIcon(k) { return A.svg(150, 92, PAY[k](), 'Picture of ' + k); }
  function payGallery() {
    var f = function (k, name, how, watch) { return '<figure>' + payIcon(k) + '<figcaption><b>' + name + '</b><br>' + how + '<br><span style="color:var(--bad)">' + watch + '</span></figcaption></figure>'; };
    return '<div class="pies thumbs">' + f('cash', 'Cash', 'hand over bills and coins', 'easy to lose; rounds to 5&cent;') + f('debit', 'Debit card or tap', 'comes out of your own account', 'only spend what you have') +
      f('credit', 'Credit card', 'the bank lends it to you', 'unpaid amounts grow with interest') + f('etransfer', 'E-transfer', 'phone or computer to a bank account', 'check the name and amount') +
      f('deposit', 'Direct deposit', 'pay goes straight to a worker&rsquo;s account', 'check the amount') + f('cheque', 'Cheque', 'a signed paper tells a bank to pay', 'slow, less common now') + '</div>';
  }
  /* a chain of boxes joined by labelled arrows: nodes [[title, sub, colour]], labels between them */
  function flow(nodes, labels) {
    var bw = 98, gap = 34, s = '';
    nodes.forEach(function (n, i) {
      var x = 4 + i * (bw + gap);
      s += '<rect x="' + x + '" y="30" width="' + bw + '" height="56" rx="10" style="fill:color-mix(in srgb,' + (n[2] || 'var(--strand)') + ' 18%,var(--card));stroke:' + (n[2] || 'var(--strand)') + '" stroke-width="2.5"/>' + txt(x + bw / 2, 54, n[0], { s: 15 }) + (n[1] ? txt(x + bw / 2, 75, n[1], { s: 13, cl: 't2' }) : '');
      if (i < nodes.length - 1) s += arr(x + bw + 4, 58, x + bw + gap - 4, 58) + txt(x + bw + gap / 2, 20, labels[i], { s: 15, c: 'var(--strand)' });
    });
    return A.svg(nodes.length * (bw + gap) - gap + 8, 94, s, nodes.map(function (n) { return n[0]; }).join(' to '));
  }
  function debitCredit() {
    var s = txt(0, 22, 'Debit', { a: 'start', c: '#2563c9' }) + '<rect x="70" y="6" width="96" height="26" rx="6" style="fill:color-mix(in srgb,#2563c9 18%,var(--card));stroke:#2563c9" stroke-width="2"/>' + txt(118, 24, 'your money', { s: 13 }) + arr(170, 19, 222, 19) + txt(260, 24, 'store', { s: 15 }) + txt(196, 50, 'today', { s: 13, cl: 't2' }) +
      txt(0, 92, 'Credit', { a: 'start', c: '#7a3fc4' }) + '<rect x="70" y="76" width="96" height="26" rx="6" style="fill:color-mix(in srgb,#7a3fc4 18%,var(--card));stroke:#7a3fc4" stroke-width="2"/>' + txt(118, 94, 'bank&rsquo;s money', { s: 13 }) + arr(170, 89, 222, 89) + txt(260, 94, 'store', { s: 15 }) + txt(196, 120, 'today', { s: 13, cl: 't2' }) +
      '<path d="M118 106 v34 h-0" style="stroke:none"/>' + txt(0, 150, 'Later: you pay the bank back + interest', { a: 'start', s: 15, c: 'var(--bad)' });
    return A.svg(300, 160, s, 'Debit uses your money today. Credit uses the bank’s money today, and you pay it back later with interest.');
  }
  /* a till receipt: rows [[label, cents, bold]] */
  function receipt(rows, title) {
    var s = '', y = 34, W = 260;
    rows.forEach(function (r) {
      if (r[2]) { s += '<line x1="16" y1="' + (y - 18) + '" x2="' + (W - 16) + '" y2="' + (y - 18) + '" style="stroke:var(--ink2)" stroke-width="1.5" stroke-dasharray="4 3"/>'; }
      s += txt(18, y, r[0], { a: 'start', s: 16, cl: r[2] ? 'tb' : 't2' }) + txt(W - 18, y, typeof r[1] === 'number' ? M(r[1]) : r[1], { a: 'end', s: 16, c: r[3] || null });
      y += 28;
    });
    return A.svg(W, y + 4, '<path d="M4 4 H' + (W - 4) + ' V' + (y - 6) + ' l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 l-12 -8 l-12 8 V4 z" style="fill:#fffdf6;stroke:var(--ink2)" stroke-width="1.5"/>' + s, title || 'Receipt');
  }
  /* cash rounding: the cents between two nickels */
  function cashLine(c) {
    var lo = c - c % 5, s = '', x0 = 40, u = 56;
    for (var k = 0; k <= 5; k++) {
      var x = x0 + k * u, big = k === 0 || k === 5;
      s += '<line x1="' + x + '" y1="' + (big ? 44 : 52) + '" x2="' + x + '" y2="68" style="stroke:var(--ink)" stroke-width="' + (big ? 3 : 1.5) + '"/>';
      if (big) s += txt(x, 92, M(lo + k), { s: 16 });
      else s += txt(x, 90, (lo + k) % 100 % 10 + '&cent;', { s: 15, cl: 't2' });
    }
    s += '<line x1="' + x0 + '" y1="60" x2="' + (x0 + 5 * u) + '" y2="60" style="stroke:var(--ink)" stroke-width="2"/>';
    var off = c % 5, xc = x0 + off * u, to = off <= 2 ? x0 : x0 + 5 * u;
    s += '<circle cx="' + xc + '" cy="60" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>' + txt(xc, 34, M(c), { s: 15 });
    if (off) s += '<path d="M' + xc + ' 48 Q' + ((xc + to) / 2) + ' ' + 10 + ' ' + to + ' 40" style="fill:none;stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="5 4"/>';
    return A.svg(x0 * 2 + 5 * u, 100, s, M(c) + ' on a line between ' + M(lo) + ' and ' + M(lo + 5));
  }
  /* counting up from the price to the bill */
  function countUp(p, g) {
    var mid = Math.ceil(p / 100) * 100, nodes = [[M(p), 'price', 'var(--ink2)']], labels = [];
    if (mid !== p && mid < g) { nodes.push([M(mid), '', 'var(--ink2)']); labels.push('+ ' + M(mid - p)); }
    nodes.push([M(g), 'bill', 'var(--good)']); labels.push('+ ' + M(g - (nodes.length > 2 ? mid : p)));
    return flow(nodes, labels);
  }
  /* a budget bar: income split into needs, savings and wants */
  function budgetBar(inc, v, hide) {
    var W = 340, x = 10, s = '', cols = ['var(--se)', 'var(--sd)', 'var(--sf)'], names = ['Needs', 'Savings', 'Wants'];
    s += txt(x + W / 2, 18, 'Income $' + inc, { s: 16 }) + '<path d="M' + x + ' 30 v-6 H' + (x + W) + ' v6" style="fill:none;stroke:var(--ink)" stroke-width="2"/>';
    v.forEach(function (n, i) {
      var w = n / inc * W;
      s += '<rect x="' + x.toFixed(1) + '" y="34" width="' + w.toFixed(1) + '" height="34" style="fill:' + (i === hide ? 'none' : cols[i]) + ';stroke:' + (i === hide ? cols[i] : 'var(--card)') + '" stroke-width="' + (i === hide ? 2.5 : 2) + '"' + (i === hide ? ' stroke-dasharray="6 4"' : '') + '/>';
      if (w > 40) s += txt(x + w / 2, 57, i === hide ? '?' : '$' + n, { s: 16, c: i === hide ? cols[i] : '#fff' });
      x += w;
    });
    names.forEach(function (n, i) { s += '<rect x="' + (14 + i * 116) + '" y="80" width="14" height="14" style="fill:' + cols[i] + '"/>' + txt(34 + i * 116, 93, n + (i === hide ? ' ?' : ' $' + v[i]), { a: 'start', s: 14 }); });
    return A.svg(W + 20, 102, s, 'Budget: income $' + inc + ' split into needs, savings and wants');
  }
  /* bars of money owed: [[label, cents, colour]] */
  function oweBars(list) {
    var mx = Math.max.apply(null, list.map(function (r) { return r[1]; })), s = '', bw = 62, g = 22;
    list.forEach(function (r, i) {
      var h = r[1] / mx * 110, x = 10 + i * (bw + g);
      s += '<rect x="' + x + '" y="' + (136 - h) + '" width="' + bw + '" height="' + h + '" style="fill:' + (r[2] || 'var(--sb)') + '"/>' + txt(x + bw / 2, 130 - h, M(r[1]).replace('.00', ''), { s: 15 }) + txt(x + bw / 2, 156, r[0], { s: 13, cl: 't2' });
    });
    s += '<line x1="4" y1="136" x2="' + (list.length * (bw + g)) + '" y2="136" style="stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(list.length * (bw + g) + 4, 164, s, 'Money owed: ' + list.map(function (r) { return r[0] + ' ' + M(r[1]); }).join(', '));
  }
  /* n items in a row, with the total price and the price of one */
  function items(n, total, kind, showEach) {
    var s = '', w = Math.min(34, 300 / n - 6);
    for (var i = 0; i < n; i++) {
      var x = 10 + i * (w + 6);
      s += kind === 'muffin' ? '<path d="M' + (x + 3) + ' 40 h' + (w - 6) + ' l-3 28 h-' + (w - 12) + ' z" style="fill:#c98a4b;stroke:var(--ink)" stroke-width="1.5"/><path d="M' + x + ' 42 a' + w / 2 + ' ' + w / 2.4 + ' 0 0 1 ' + w + ' 0 z" style="fill:#8a4f24;stroke:var(--ink)" stroke-width="1.5"/>'
        : '<rect x="' + x + '" y="24" width="' + w + '" height="44" rx="4" style="fill:#e3b55a;stroke:var(--ink)" stroke-width="1.5"/>';
    }
    var W = 10 + n * (w + 6) + 4;
    s += '<path d="M10 78 v6 H' + (W - 10) + ' v-6" style="fill:none;stroke:var(--ink)" stroke-width="2"/>' + txt(W / 2, 104, n + ' for ' + M(total), { s: 16 }) + (showEach ? txt(W / 2, 128, M(total / n) + ' each', { s: 16, c: 'var(--strand)' }) : '');
    return A.svg(Math.max(W, 140), showEach ? 136 : 112, s, n + ' items for ' + M(total));
  }
  /* two packages drawn by size */
  function packs(list, unit) {
    var mx = Math.max.apply(null, list.map(function (r) { return r[0]; })), s = '', x = 10;
    list.forEach(function (r, i) {
      var h = 40 + r[0] / mx * 90, w = 80;
      s += '<rect x="' + x + '" y="' + (140 - h) + '" width="' + w + '" height="' + h + '" rx="6" style="fill:' + (i ? 'color-mix(in srgb,var(--hi) 60%,var(--card))' : 'color-mix(in srgb,var(--strand) 25%,var(--card))') + ';stroke:var(--ink)" stroke-width="2"/>' +
        txt(x + w / 2, 140 - h / 2, r[0] + ' ' + unit, { s: 15 }) + txt(x + w / 2, 162, M(r[1]), { s: 17 }) + txt(x + w / 2, 184, r[2] || '', { s: 14, cl: 't2' });
      x += w + 70;
    });
    return A.svg(x - 50, 192, s, list.map(function (r) { return r[0] + ' ' + unit + ' for ' + M(r[1]); }).join(' and '));
  }
  /* Canada holds Ontario, which holds your town */
  function levels(hi) {
    var L = [['Federal: Canada', 'passports, armed forces, national parks', '#d1356b'], ['Provincial: Ontario', 'hospitals, schools, highways', '#1f6fd1'], ['Municipal: your town', 'parks, libraries, garbage pickup', '#2b9a48']], s = '';
    L.forEach(function (r, i) {
      var x = 4 + i * 16, y = 4 + i * 64, on = hi === undefined || hi === i;
      s += '<rect x="' + x + '" y="' + y + '" width="' + (372 - i * 32) + '" height="' + (206 - i * 74) + '" rx="12" style="fill:color-mix(in srgb,' + r[2] + ' ' + (on ? 14 : 4) + '%,var(--card));stroke:' + r[2] + ';opacity:' + (on ? 1 : 0.45) + '" stroke-width="' + (hi === i ? 4 : 2.5) + '"/>' +
        txt(x + 14, y + 24, r[0], { a: 'start', s: 16, c: r[2] }) + txt(x + 14, y + 46, r[1], { a: 'start', s: 14, cl: 't2' });
    });
    return A.svg(380, 214, s, 'Three levels of government: federal (Canada) contains provincial (Ontario) contains municipal (your town)');
  }
  /* the 13% HST split 5% federal and 8% Ontario */
  function hstSplit(price) {
    var W = 330, u = W / 13, s = '';
    s += '<rect x="10" y="30" width="' + 5 * u + '" height="36" style="fill:#d1356b"/><rect x="' + (10 + 5 * u) + '" y="30" width="' + 8 * u + '" height="36" style="fill:#1f6fd1"/>' +
      txt(10 + 2.5 * u, 54, '5%', { c: '#fff' }) + txt(10 + 9 * u, 54, '8%', { c: '#fff' }) + txt(10 + W / 2, 20, 'HST 13% of ' + M(price) + ' = ' + M(hst(price)), { s: 15 }) +
      txt(10 + 2.5 * u, 88, 'Canada ' + M(price * 5 / 100), { s: 14 }) + txt(10 + 9 * u, 88, 'Ontario ' + M(price * 8 / 100), { s: 14 });
    return A.svg(W + 20, 96, s, 'HST split: 5% to Canada and 8% to Ontario');
  }

  A.fig = A.fig || {};
  A.fig.hstSplit = hstSplit; A.fig.cashLine = cashLine;


  /* ---------- Lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = A.kit;
  function P(id, lv) { return K.P('money', id, lv); }
  function an(svg) { return '<div class="g5-anim">' + svg + '</div>'; }
  function payPair(a, b) { return '<div class="pies thumbs g5-anim">' + [a, b].map(function (k) { return '<figure>' + payIcon(k[0]) + '<figcaption><b>' + k[1] + '</b><br>' + k[2] + '</figcaption></figure>'; }).join('') + '</div>'; }
  var LESSONS = [
    { id: 'moves', title: 'How money moves', sub: 'Cash, cards and transfers.', concepts: [
      { id: 'pay', title: 'Ways to pay', exp: ['F1.1'], skill: 'mo-pay',
        body: '<p>Money moves in many ways. Some use bills and coins. Most move numbers between bank accounts. Every way still spends <b>real money</b>.</p>',
        watch: K.watch([
          { say: 'Cash: you hand over bills and coins.', fig: payPair(['cash', 'Cash', 'bills and coins'], ['cheque', 'Cheque', 'a signed paper']) },
          { say: 'Debit: money leaves your own account right away.', fig: payPair(['debit', 'Debit card or tap', 'your own money'], ['credit', 'Credit card', 'the bank lends it']) },
          { say: 'Credit: the bank pays now, and you pay the bank back later with interest.', fig: an(debitCredit()) },
          { say: 'E-transfers and direct deposits move money between accounts with no cash at all.', fig: an(flow([['Neighbour', 'pays $20', 'var(--ink2)'], ['Maya&rsquo;s bank', 'gets $20', 'var(--good)'], ['Store', 'debit $8', 'var(--bad)']], ['e-transfer', 'debit card'])), ms: 2400 }
        ]),
        try: { tool: 'coins', opts: { set: [5, 10, 25, 100, 200, 500, 1000, 2000] }, tasks: [
          { do: 'Pay exactly <b>$12.35</b> in cash, using as few bills and coins as you can.', goal: function (s) { return s.total === 1235 && s.n <= 5; }, yes: 'Yes. $10 + $2 + 25¢ + 10¢.' }
        ] },
        key: '<p>Debit spends <b>your money now</b>. Credit spends <b>the bank\'s money now</b>, and you pay it back later.</p>',
        mistake: '<p>Thinking a card or phone payment is "free" because no cash changes hands. Look at a bank statement together to show the money leaving.</p>',
        check: [P('mo-pay', 1), P('mo-pay', 2)] }
    ] },

    { id: 'tax', title: 'Shopping with sales tax', sub: 'Subtotal, HST, total and change.', concepts: [
      { id: 'hst', title: 'Add the 13% HST', exp: ['F1.2'], skill: 'mo-tax', hard: true,
        body: '<p>In Ontario most things have a sales tax called <b>HST</b>, which is <b>13%</b> of the price. Add the prices, find the tax, then add it on.</p>',
        watch: K.watch([
          { say: 'A $20.00 book. The subtotal is $20.00.', fig: an(receipt([['Book', 2000], ['Subtotal', 2000, 1]], 'Receipt')) },
          { say: '10% of $20.00 is easy: move the decimal point one place left. $2.00.', fig: an(receipt([['Book', 2000], ['10%', 200]], 'Receipt')) },
          { say: '3% more is $0.60. So 13% is $2.60.', fig: an(receipt([['Book', 2000], ['10%', 200], ['3%', 60], ['HST 13%', 260, 1, 'var(--bad)']], 'Receipt')) },
          { say: 'Total at the till: <b>$22.60</b>.', fig: an(receipt([['Book', 2000], ['HST 13%', 260, 0, 'var(--bad)'], ['Total', 2260, 1]], 'Receipt')), ms: 2200 }
        ]),
        try: K.widget('money', 0, 'Nice. Switch to cash and watch the total round to the nearest 5 cents.'),
        ways: [
          { label: 'Where tax goes', html: '<div class="fig">' + hstSplit(2000) + '</div><p>5% goes to Canada and 8% to Ontario.</p>' },
          { label: 'Estimate', html: '<p>13% is a bit more than a tenth. For $24.99, think $25: a tenth is $2.50, plus a bit, about $3.25. The total is about $28.</p>' }
        ],
        key: '<p><b>Subtotal + 13% HST = total.</b> 13% = 10% + 3%.</p>',
        mistake: '<p>Forgetting the tax and bringing exactly the shelf price. Before shopping, estimate the total with tax together.</p>',
        check: [P('mo-tax', 1), P('mo-tax', 2)] },

      { id: 'cash', title: 'Cash rounding and change', exp: ['F1.2'], skill: 'mo-tax', hard: true,
        body: '<p>Canada has no pennies. A <b>cash</b> total rounds to the nearest 5 cents. Find change by <b>counting up</b> from the price.</p>',
        watch: K.watch([
          { say: 'A cash total of $4.97 sits between $4.95 and $5.00.', fig: an(cashLine(497)) },
          { say: 'It is 2&cent; from $4.95 and 3&cent; from $5.00, so it rounds to <b>$4.95</b>.', fig: an(cashLine(497)) },
          { say: 'You pay with a $10 bill. Count up: $4.95 + $0.05 = $5.00.', fig: an(countUp(495, 1000)) },
          { say: 'Then $5.00 more to $10.00. Change: <b>$5.05</b>.', fig: an(countUp(495, 1000)), ms: 2200 }
        ]),
        try: { tool: 'coins', opts: { set: [5, 10, 25, 100, 200, 500] }, tasks: [
          { do: 'The total is $4.95 and you paid $10.00. Put the <b>change</b> on the mat.', goal: function (s) { return s.total === 505; }, yes: 'Yes. $5.05 in change.' },
          { do: 'Now a cash total of $7.38, rounded. Pay it exactly.', goal: function (s) { return s.total === 740; }, yes: 'Yes. $7.38 rounds up to $7.40.' }
        ] },
        key: '<p>Cash: ends in 1, 2, 6, 7 round <b>down</b>. 3, 4, 8, 9 round <b>up</b>. Count up to find change.</p>',
        mistake: '<p>Rounding card totals (only cash rounds), or subtracting with errors when finding change. Practise counting up with real coins.</p>',
        check: [P('mo-tax', 2), P('mo-tax', 3)] }
    ] },

    { id: 'budget', title: 'Making a budget', sub: 'Every dollar gets a job.', concepts: [
      { id: 'budget', title: 'Needs, savings and wants', exp: ['F1.3'], skill: 'mo-budget',
        body: '<p>A <b>budget</b> plans money coming in (<b>income</b>) and going out (<b>expenses</b>). Needs first, then savings, then wants. It is <b>balanced</b> when every dollar has a job.</p>',
        watch: K.watch([
          { say: 'Income this month: $40.', fig: an(flow([['Income', '$40', 'var(--ink2)']], [])) },
          { say: 'Pay yourself first: $10 into savings.', fig: an(flow([['Income', '$40', 'var(--ink2)'], ['1. Savings', '$10', 'var(--sd)']], ['first'])) },
          { say: 'Needs take $15.', fig: an(budgetBar(40, [15, 10, 15], 2)) },
          { say: 'That leaves $15 for wants. 15 + 10 + 15 = 40: <b>balanced</b>.', fig: an(budgetBar(40, [15, 10, 15])), ms: 2400 }
        ]),
        try: K.widget('money', 1, 'Good. Make the plan add up exactly to the income.'),
        key: '<p><b>Needs + savings + wants = income.</b> Save first, then spend what is left.</p>',
        mistake: '<p>Spending first and saving "whatever is left", which is usually nothing. Set the savings aside the day money comes in.</p>',
        check: [P('mo-budget', 1), P('mo-budget', 2)] }
    ] },

    { id: 'credit', title: 'Credit and debt', sub: 'Borrowing costs extra.', concepts: [
      { id: 'interest', title: 'Interest makes debt grow', exp: ['F1.4'], skill: 'mo-credit', hard: true,
        body: '<p><b>Credit</b> is borrowing now and paying back later. <b>Debt</b> is what you still owe. <b>Interest</b> is the extra you pay for borrowing.</p>',
        watch: K.watch([
          { say: 'You borrow $100 on a card that adds 2% each month.', fig: an(oweBars([['borrow', 10000]])) },
          { say: 'After one month, 2% is added: you owe $102.', fig: an(oweBars([['borrow', 10000], ['+2%', 10200, 'var(--bad)']])) },
          { say: 'You pay $52. You still owe $50.', fig: an(oweBars([['borrow', 10000], ['+2%', 10200, 'var(--bad)'], ['pay $52', 5000, 'var(--good)']])) },
          { say: 'Next month 2% of $50 is added: $51. Pay more each month, and you pay less interest in total.', fig: an(oweBars([['borrow', 10000], ['+2%', 10200, 'var(--bad)'], ['pay $52', 5000, 'var(--good)'], ['+2%', 5100, 'var(--bad)']])), ms: 2600 }
        ]),
        try: K.widget('money', 2, 'Nice. Compare paying $20 a month to paying $100 a month.'),
        ways: [
          { label: 'Borrowing a bike', html: '<p>A friend lends you a bike, but you must give it back with a full tank of air and a clean chain. Interest is that "extra" for borrowing.</p>' },
          { label: 'Good uses', html: '<p>Borrowing helps for big needs, like a home or school. It always costs extra, so borrow only what you can pay back.</p>' }
        ],
        key: '<p>Interest is added to what you <b>still owe</b>. Paying more, sooner, costs less.</p>',
        mistake: '<p>Paying only the smallest amount and thinking the debt is nearly gone. Use the try-it to compare total interest for small and big payments.</p>',
        check: [P('mo-credit', 1), P('mo-credit', 2)] }
    ] },

    { id: 'best-buy', title: 'Finding the better buy', sub: 'Compare unit rates.', concepts: [
      { id: 'unit-rate', title: 'Price for one unit', exp: ['F1.5'], skill: 'mo-unit', hard: true,
        body: '<p>A <b>unit rate</b> is the price for one unit: one item, one gram or one litre. Divide the price by the amount. The lower unit rate is the better value.</p>',
        watch: K.watch([
          { say: '6 granola bars for $3.90.', fig: an(items(6, 390, 'bar')) },
          { say: '$3.90 &divide; 6 = <b>$0.65</b> each.', fig: an(items(6, 390, 'bar', 1)) },
          { say: '10 bars for $5.90: $5.90 &divide; 10 = <b>$0.59</b> each.', fig: an(items(10, 590, 'bar', 1)) },
          { say: '$0.59 is less than $0.65, so the 10-pack is the better buy, if you will eat them all.', fig: '<div class="pies g5-anim">' + items(6, 390, 'bar', 1) + items(10, 590, 'bar', 1) + '</div>', ms: 2600 }
        ]),
        try: K.widget('money', 3, 'Good. Try a case where the smaller size wins.'),
        ways: [
          { label: 'Same amount', html: '<p>Make the amounts match. 500 g for $4.00 is $8.00 per kg. 750 g for $5.25 is $7.00 per kg. The 750 g bag is cheaper per kilogram.</p>' },
          { label: 'Bigger is not always better', html: '<div class="fig">' + packs([[2, 300, '$1.50 per L'], [3, 480, '$1.60 per L']], 'L') + '</div><p>Here the 2 L bottle wins.</p>' }
        ],
        key: '<p><b>Unit rate = price &divide; amount.</b> Lower is better value.</p>',
        mistake: '<p>Assuming the bigger package is always cheaper. Work out both unit rates before deciding, and ask whether you will use it all.</p>',
        check: [P('mo-unit', 1), P('mo-unit', 2)] }
    ] },

    { id: 'gov', title: 'Taxes and community services', sub: 'What taxes pay for.', concepts: [
      { id: 'levels', title: 'Three levels of government', exp: ['F1.6'], skill: 'mo-gov',
        body: '<p>Governments collect <b>taxes</b> and use them for services everyone shares. Canada has three main levels: federal, provincial and municipal.</p>',
        watch: K.watch([
          { say: 'Federal: Canada. Passports, armed forces, national parks.', fig: an(levels(0)) },
          { say: 'Provincial: Ontario. Hospitals, schools, highways.', fig: an(levels(1)) },
          { say: 'Municipal: your town. Parks, libraries, garbage pickup.', fig: an(levels(2)) },
          { say: 'The 13% HST is shared: 5% to Canada and 8% to Ontario.', fig: an(hstSplit(1000)), ms: 2400 }
        ]),
        key: '<p>Taxes pay for things too costly for one family alone: <b>roads, schools, hospitals</b>.</p>',
        mistake: '<p>Mixing up which level runs which service. Link each one to something nearby: your library (town), your school (Ontario), your passport (Canada).</p>',
        check: [P('mo-gov', 1), P('mo-gov', 2)] }
    ] }
  ];
  A.register('money', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>How money moves</h2>' +
'<p>Money moves between people, businesses and organizations in many ways. Some use real bills and coins. Most move numbers between bank accounts.</p>' +
payGallery() +
'<div class="key"><b class="t">Key idea</b><p>Paying by card or phone still spends real money. With debit it leaves your account right away. With credit you owe it later.</p><div class="fig">' + debitCredit() + '</div></div>' +
'<div class="eg"><p><b>Example.</b> Maya earns $20 shovelling snow. Her neighbour sends it by e-transfer to Maya&rsquo;s bank account. Later Maya spends some of it with a debit card.</p><div class="fig">' + flow([['Neighbour', 'pays $20', 'var(--ink2)'], ['Maya&rsquo;s bank', 'account', 'var(--good)'], ['Store', 'gets paid', 'var(--ink2)']], ['e-transfer', 'debit card']) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Shopping with sales tax</h2>' +
'<p>In Ontario most things you buy have a sales tax called <b>HST</b>, which is <b>13%</b> of the price. Add the prices to get the <b>subtotal</b>, find the tax, then add it to get the <b>total</b>. If you pay with cash, the total rounds to the nearest 5 cents, because Canada no longer makes pennies.</p>' +
'<div class="eg"><p><b>Estimate 13% quickly:</b> 10% is easy (move the decimal point one place left), then add a little more. For $20.00: 10% is $2.00, and 3% is $0.60, so the tax is $2.60.</p><div class="fig">' + receipt([['Book', 2000], ['10% of $20.00', 200], ['3% of $20.00', 60], ['HST 13%', 260, 1], ['Total', 2260, 1]], 'Receipt: $20.00 plus $2.60 HST is $22.60') + '</div></div>' +
'<div class="lab"><span class="lt">Try it: checkout</span>' +
'<div class="ctrl"><label for="p1">Notebook ($)<input type="number" id="p1" min="0" max="500" step="0.01" value="3.49"></label><label for="q1">How many<input type="number" id="q1" min="0" max="20" value="2"></label></div>' +
'<div class="ctrl"><label for="p2">Backpack ($)<input type="number" id="p2" min="0" max="500" step="0.01" value="24.99"></label><label for="q2">How many<input type="number" id="q2" min="0" max="20" value="1"></label></div>' +
'<div class="ctrl"><label for="pp">Pay with<select id="pp"><option value="card">card</option><option value="cash">cash</option></select></label><label for="pg">Amount given ($)<input type="number" id="pg" min="0" max="1000" step="0.01" value="40"></label></div>' +
'<div class="fig" id="pfig"></div><div class="out" id="pout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Forgetting the tax. A $24.99 backpack costs $28.24 at the till in Ontario.</p><div class="fig">' + receipt([['Backpack', 2499], ['HST 13%', 325, 0, 'var(--bad)'], ['Total', 2824, 1]], 'Receipt: $24.99 plus $3.25 HST is $28.24') + '</div></div>' +
'<div class="eg"><p><b>Example: cash rounding.</b> A total of $4.97 is 2&cent; above $4.95 and 3&cent; below $5.00. It rounds to the closer one: <b>$4.95</b>. Totals ending in 1, 2, 6 or 7 cents round down. Totals ending in 3, 4, 8 or 9 cents round up.</p><div class="fig">' + cashLine(497) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Making a budget</h2>' +
'<p>A <b>budget</b> is a plan for money coming in (<b>income</b>) and money going out (<b>expenses</b>). <b>Needs</b> come first: things you must have. Then <b>savings</b>, then <b>wants</b>. A budget is <b>balanced</b> when every dollar has a job and you do not plan to spend more than you earn.</p>' +
'<div class="lab"><span class="lt">Try it: plan a month</span>' +
'<div class="ctrl"><label for="bi">Income this month ($)<input type="number" id="bi" min="1" max="1000" step="1" value="60"></label>' +
'<label for="bn">Needs: <output id="bno"></output><input type="range" id="bn" min="0" max="60" step="1" value="20"></label>' +
'<label for="bs">Savings: <output id="bso"></output><input type="range" id="bs" min="0" max="60" step="1" value="15"></label>' +
'<label for="bw">Wants: <output id="bwo"></output><input type="range" id="bw" min="0" max="60" step="1" value="20"></label></div>' +
'<div class="bar-h" id="bbar" style="margin:8px 0"></div><div class="out" id="bout"></div></div>' +
'<div class="eg"><p><b>Example.</b> Income $40. Needs $15, savings $10, wants $15. 15 + 10 + 15 = 40, so the budget is <b>balanced</b>.</p><div class="fig">' + budgetBar(40, [15, 10, 15]) + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Pay yourself first. Set savings aside as soon as money comes in, then spend what is left.</p><div class="fig">' + flow([['Income', 'comes in', 'var(--ink2)'], ['1. Savings', 'set aside', 'var(--sd)'], ['2. Needs', 'then wants', 'var(--se)']], ['first', 'then']) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Credit and debt</h2>' +
'<p><b>Credit</b> means borrowing money now and paying it back later. <b>Debt</b> is the money you still owe. Lenders charge <b>interest</b>, an extra amount for borrowing. The longer you take to pay, the more interest you pay.</p>' +
'<div class="lab"><span class="lt">Try it: pay off a credit card</span>' +
'<div class="ctrl"><label for="cb">Amount borrowed ($)<select id="cb"><option>100</option><option selected>300</option><option>500</option></select></label>' +
'<label for="cp">Pay each month ($)<select id="cp"><option>20</option><option selected>50</option><option>100</option><option>150</option></select></label></div>' +
'<p class="t2" style="font-size:.9rem;margin:.2em 0">Interest: 2% of what you still owe is added each month.</p>' +
'<div class="fig" id="cfig"></div><div class="out" id="cout"></div></div>' +
'<div class="eg"><p><b>Example.</b> You borrow $100 on a card that adds 2% interest each month. After one month you owe $102. If you pay $52, you still owe $50, and next month 2% of $50 ($1) is added.</p><div class="fig">' + oweBars([['borrow', 10000], ['+2%', 10200, 'var(--bad)'], ['pay $52', 5000], ['+2%', 5100, 'var(--bad)']]) + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Paying more each month gets you out of debt faster and costs less in total. Borrowing is a tool. It helps for big needs, but it always costs extra.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Finding the better buy</h2>' +
'<p>A <b>unit rate</b> is the price for one unit, like one gram, one litre or one item. Divide the price by the amount. The lower unit rate is the better value, if you will use it all.</p>' +
'<div class="lab"><span class="lt">Try it: compare two sizes</span>' +
'<div class="row2"><div class="ctrl"><label for="u1">Size A price ($)<input type="number" id="u1" min="0.01" step="0.01" value="4.00"></label><label for="g1">Size A grams<input type="number" id="g1" min="1" value="500"></label></div>' +
'<div class="ctrl"><label for="u2">Size B price ($)<input type="number" id="u2" min="0.01" step="0.01" value="5.25"></label><label for="g2">Size B grams<input type="number" id="g2" min="1" value="750"></label></div></div>' +
'<div class="fig" id="ufig"></div><div class="out" id="uout"></div></div>' +
'<div class="eg"><p><b>Example.</b> 6 granola bars for $3.90 cost $0.65 each. 10 bars for $5.90 cost $0.59 each. The 10-pack is the better buy.</p><div class="pies">' + items(6, 390, 'bar', 1) + items(10, 590, 'bar', 1) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking the bigger package is always cheaper. Check the unit rate. Sometimes the small size wins.</p><div class="fig">' + packs([[2, 300, '$1.50 per L'], [3, 480, '$1.60 per L']], 'L') + '</div><p class="cap">Here the smaller bottle costs less per litre.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Taxes and community services</h2>' +
'<p>Governments collect <b>taxes</b> and use the money to provide services everyone shares. Canada has three main levels of government. Each one sits inside the one above it.</p><div class="fig">' + levels() + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">Level</th><th class="l">Some taxes it collects</th><th class="l">Some services it pays for</th></tr></thead><tbody>' +
'<tr><td class="l">Federal (Canada)</td><td class="l">Income tax, the 5% federal part of HST</td><td class="l">Armed forces, national parks, passports, payments to families</td></tr>' +
'<tr><td class="l">Provincial (Ontario)</td><td class="l">Income tax, the 8% provincial part of HST</td><td class="l">Hospitals and health care, schools, provincial highways</td></tr>' +
'<tr><td class="l">Municipal (your city or town)</td><td class="l">Property tax</td><td class="l">Local roads, parks, libraries, garbage pickup, fire services, public transit</td></tr></tbody></table></div>' +
'<p>The 13% HST is shared: 5% goes to the federal government and 8% to Ontario.</p>' +
'<div class="eg"><p><b>Example.</b> A $10.00 game in Ontario has $1.30 of HST. $0.50 goes to the federal government and $0.80 goes to Ontario.</p><div class="fig">' + hstSplit(1000) + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Taxes pay for things that would cost too much for one family alone, like roads, schools and hospitals.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function shop() {
        var a = cents($('#p1', root).value) * Math.max(0, +$('#q1', root).value || 0), b = cents($('#p2', root).value) * Math.max(0, +$('#q2', root).value || 0);
        var sub = a + b, tax = hst(sub), tot = sub + tax, isCash = $('#pp', root).value === 'cash', pay = isCash ? cash(tot) : tot, given = cents($('#pg', root).value);
        var est = Math.round(sub / 100) * 100, estTax = Math.round(est * 0.1) + Math.round(est * 0.03);
        var h = '<div class="tbl"><table><tbody>' +
          '<tr><td class="l">Notebooks</td><td>' + M(a) + '</td></tr><tr><td class="l">Backpacks</td><td>' + M(b) + '</td></tr>' +
          '<tr><th class="l">Subtotal</th><th>' + M(sub) + '</th></tr><tr><td class="l">HST 13%</td><td>' + M(tax) + '</td></tr>' +
          '<tr><th class="l">Total</th><th>' + M(tot) + '</th></tr>' + (isCash ? '<tr><td class="l">Cash total (nearest 5&cent;)</td><td><b>' + M(pay) + '</b></td></tr>' : '') + '</tbody></table></div>';
        h += '<p>Estimate: about ' + M(est) + ' + ' + M(estTax) + ' tax = ' + M(est + estTax) + '.</p>';
        h += given >= pay ? '<p><span class="big">Change: ' + M(given) + ' &minus; ' + M(pay) + ' = ' + M(given - pay) + '</span></p>' : '<p>' + M(given) + ' is not enough. You need ' + M(pay) + '.</p>';
        $('#pout', root).innerHTML = h;
        $('#pfig', root).innerHTML = isCash && tot % 5 ? cashLine(tot) : '';
      }
      A.bind(root, ['p1', 'q1', 'p2', 'q2', 'pp', 'pg'], shop);

      function bud() {
        var inc = Math.max(1, Math.min(1000, +$('#bi', root).value || 1));
        ['bn', 'bs', 'bw'].forEach(function (id) { $('#' + id, root).max = inc; });
        var v = [+$('#bn', root).value, +$('#bs', root).value, +$('#bw', root).value];
        $('#bno', root).textContent = '$' + v[0]; $('#bso', root).textContent = '$' + v[1]; $('#bwo', root).textContent = '$' + v[2];
        var tot = v[0] + v[1] + v[2], left = inc - tot, cols = ['var(--se)', 'var(--sd)', 'var(--sf)'];
        $('#bbar', root).innerHTML = v.map(function (n, i) { return '<i style="width:' + (n / Math.max(inc, tot) * 100) + '%;background:' + cols[i] + '"></i>'; }).join('');
        $('#bout', root).innerHTML = '<p><b style="color:var(--se)">Needs $' + v[0] + '</b> &nbsp; <b style="color:var(--sd)">Savings $' + v[1] + '</b> &nbsp; <b style="color:var(--sf)">Wants $' + v[2] + '</b></p>' +
          '<p>' + (left === 0 ? '<b style="color:var(--good)">Balanced.</b> Every dollar has a job.' : left > 0 ? 'You still have <b>$' + left + '</b> to give a job.' : '<b style="color:var(--bad)">Over budget by $' + (-left) + '.</b> Lower one of the amounts.') +
          ' Savings are ' + Math.round(v[1] / inc * 100) + '% of income.</p>';
      }
      A.bind(root, ['bi', 'bn', 'bs', 'bw'], bud);

      function cred() {
        var owe = +$('#cb', root).value * 100, pay = +$('#cp', root).value * 100, rows = [], paid = 0, m = 0;
        while (owe > 0 && m < 60) {
          m++;
          var int = Math.round(owe * 2 / 100);
          owe += int;
          var p = Math.min(pay, owe);
          owe -= p; paid += p;
          rows.push({ m: m, int: int, pay: p, owe: owe });
        }
        var start = +$('#cb', root).value * 100, s = '', W = 360, bw = Math.min(40, (W - 20) / rows.length - 4);
        rows.forEach(function (r, i) {
          var h = r.owe / start * 110;
          s += '<rect x="' + (14 + i * (bw + 4)) + '" y="' + (130 - h) + '" width="' + bw + '" height="' + h + '" style="fill:var(--strand)"/>';
          if (rows.length <= 12 || i % 2 === 0) s += '<text x="' + (14 + i * (bw + 4) + bw / 2) + '" y="150" text-anchor="middle" font-size="15" class="t2">' + r.m + '</text>';
        });
        s += '<line x1="10" y1="130" x2="' + W + '" y2="130" style="stroke:var(--ink)" stroke-width="2"/><text x="10" y="14" font-size="15" class="t2">Still owed after each month</text><text x="10" y="168" font-size="14" class="t2">month</text>';
        $('#cfig', root).innerHTML = A.svg(W, 172, s, 'Bar graph of money still owed each month');
        var intTot = paid - start;
        $('#cout', root).innerHTML = '<p><span class="big">' + m + ' months to pay off</span></p><p>You pay ' + M(paid) + ' in total for ' + M(start) + ' of things. The extra ' + M(intTot) + ' is interest.</p>' +
          '<p>Month 1: interest ' + M(rows[0].int) + ', you pay ' + M(rows[0].pay) + ', still owed ' + M(rows[0].owe) + '.</p>';
      }
      A.bind(root, ['cb', 'cp'], cred);

      function un() {
        var p1 = cents($('#u1', root).value), q1 = +$('#g1', root).value, p2 = cents($('#u2', root).value), q2 = +$('#g2', root).value, o = $('#uout', root);
        if (!(q1 > 0) || !(q2 > 0) || !p1 || !p2) { $('#ufig', root).innerHTML = ''; o.innerHTML = '<p>Enter both prices and sizes.</p>'; return; }
        var u1 = p1 / q1 * 100, u2 = p2 / q2 * 100, mx = Math.max(u1, u2);
        function f(c) { return '$' + (c / 100).toFixed(2); }
        var s = txt(0, 26, 'A', { a: 'start' }) + '<rect x="24" y="8" width="' + (u1 / mx * 220) + '" height="26" style="fill:var(--strand)"/>' + txt(30 + u1 / mx * 220, 27, f(u1), { a: 'start', s: 16 }) +
          txt(0, 66, 'B', { a: 'start' }) + '<rect x="24" y="48" width="' + (u2 / mx * 220) + '" height="26" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1"/>' + txt(30 + u2 / mx * 220, 67, f(u2), { a: 'start', s: 16 }) + txt(24, 98, 'price per 100 g (shorter is cheaper)', { a: 'start', s: 14, cl: 't2' });
        $('#ufig', root).innerHTML = A.svg(340, 106, s, 'Bars comparing the price per 100 g');
        o.innerHTML = '<p>Size A: ' + M(p1) + ' &divide; ' + q1 + ' g &times; 100 = <b>' + f(u1) + ' per 100 g</b></p><p>Size B: ' + M(p2) + ' &divide; ' + q2 + ' g &times; 100 = <b>' + f(u2) + ' per 100 g</b></p>' +
          '<p><span class="big">' + (Math.abs(u1 - u2) < 0.005 ? 'Same unit rate.' : u1 < u2 ? 'Size A is the better buy.' : 'Size B is the better buy.') + '</span></p>';
      }
      A.bind(root, ['u1', 'g1', 'u2', 'g2'], un);
    },

    quiz: [
      { q: 'Which way to pay takes money straight out of your own bank account?', type: 'mc', options: ['Credit card', 'Debit card', 'Cash', 'A loan'], answer: 1, hint: 'One of these uses money you already have in the bank.', explain: 'A debit card spends money from your own account right away.' },
      { q: 'A book costs $20.00. Ontario HST is 13%. What is the total cost?', type: 'num', answer: 22.6, unit: '$', hint: '10% of $20 is $2.00. 3% is $0.60.', explain: 'Tax is $2.60, so the total is $22.60.' },
      { q: 'A cash total comes to $4.97. What do you pay in cash?', fig: cashLine(497), type: 'mc', options: ['$4.95', '$5.00', '$4.90', '$4.97'], answer: 0, hint: 'Round to the nearest 5 cents. Is 97 closer to 95 or to 100?', explain: '97&cent; is 2&cent; from 95 and 3&cent; from 100, so it rounds down to $4.95.' },
      { q: 'Your income is $50 a month. Needs cost $20 and you save $12. How much is left for wants in a balanced budget?', fig: budgetBar(50, [20, 12, 18], 2), type: 'num', answer: 18, unit: '$', hint: 'Subtract needs and savings from income.', explain: '50 &minus; 20 &minus; 12 = 18.' },
      { q: 'You owe $200 on a credit card that adds 2% interest each month. How much interest is added in the first month?', type: 'num', answer: 4, unit: '$', hint: '1% of $200 is $2.', explain: '2% of $200 is $4.' },
      { q: 'Which is the better buy: 500 g for $4.00, or 750 g for $5.25?', fig: packs([[500, 400], [750, 525]], 'g'), type: 'mc', options: ['500 g for $4.00', '750 g for $5.25', 'They cost the same per gram'], answer: 1, hint: 'Find the price per 100 g for each.', explain: '$4.00 &divide; 5 = $0.80 per 100 g, and $5.25 &divide; 7.5 = $0.70 per 100 g.' },
      { q: 'Which level of government uses property tax to pay for local parks and garbage pickup?', type: 'mc', options: ['Federal', 'Provincial', 'Municipal'], answer: 2, hint: 'Think about which government runs your city or town.', explain: 'Municipal governments collect property tax and run local services.' }
    ],

    quick: ['mo-pay', 'mo-tax', 'mo-budget', 'mo-credit', 'mo-unit', 'mo-gov'],

    practice: [
      { id: 'mo-pay', name: 'Ways money moves', code: 'F1.1', gen: function (lv) {
        var qs = [
          ['Which way to pay means you are <b>borrowing</b> money?', 'Credit card', ['Debit card', 'Cash', 'E-transfer']],
          ['Which way to pay takes money straight from your own bank account at a store?', 'Debit card', ['Credit card', 'A cheque from a friend', 'Gift card from a store']],
          ['Your aunt wants to send you $20 from her phone to your bank account. What is she using?', 'E-transfer', ['Credit card', 'Cash', 'Direct deposit']],
          ['A company puts a worker&rsquo;s pay straight into their bank account. What is this called?', 'Direct deposit', ['E-transfer', 'Credit', 'A cheque']],
          ['Which way to pay rounds the total to the nearest 5 cents?', 'Cash', ['Debit card', 'Credit card', 'E-transfer']],
          ['What should you check before sending an e-transfer?', 'The name and the amount', ['The colour of the app', 'The time of day', 'Nothing, it can always be undone']]
        ];
        var q = lv === 1 ? R.pick(qs.slice(0, 2)) : R.pick(qs), o = R.mc(q[1], q[2]);
        return { q: q[0], type: 'mc', options: o.options, answer: o.answer, hint: 'Think about whose money is used, and when.',
          steps: ['Cash and debit use money you already have. Credit is borrowed.', 'E-transfers and direct deposits move money between bank accounts.', 'The answer is: ' + q[1] + '.' + payIcon({ 'Credit card': 'credit', 'Debit card': 'debit', 'E-transfer': 'etransfer', 'Direct deposit': 'deposit', 'Cash': 'cash' }[q[1]] || 'etransfer')], explain: q[1] + '.' };
      } },
      { id: 'mo-tax', name: 'Totals, tax and change', code: 'F1.2', gen: function (lv) {
        if (lv === 1) {
          var p = R.int(150, 1900), g = p < 500 ? 500 : p < 1000 ? 1000 : 2000;
          return { q: 'You buy something for ' + M(p) + ' and pay with a ' + M(g).replace('.00', '') + ' bill. How much change do you get?', type: 'num', answer: A.clean((g - p) / 100), unit: '$',
            hint: 'Count up from ' + M(p) + ' to ' + M(g) + '.', steps: ['Change = amount given &minus; price. Count up:' + countUp(p, g), M(g) + ' &minus; ' + M(p) + '.', '= ' + M(g - p) + '.'], explain: M(g) + ' &minus; ' + M(p) + ' = ' + M(g - p) + '.' };
        }
        if (lv === 2) {
          var base = R.pick([1000, 2000, 3000, 4000, 5000, 10000]), tax = hst(base);
          return { q: 'An item costs ' + M(base) + '. Ontario HST is 13%. What is the total cost?', type: 'num', answer: A.clean((base + tax) / 100), unit: '$', hint: 'Find 10% and 3%, then add them to the price.',
            steps: ['10% of ' + M(base) + ' is ' + M(base / 10) + '.', '3% is ' + M(base * 3 / 100) + ', so the tax is ' + M(tax) + '.', M(base) + ' + ' + M(tax) + ' = ' + M(base + tax) + '.' + receipt([['Item', base], ['HST 13%', tax], ['Total', base + tax, 1]])], explain: 'Total: ' + M(base + tax) + '.' };
        }
        var a = R.int(2, 9) * 100 + R.pick([49, 99, 25, 75]), n = R.int(2, 3), b = R.int(5, 19) * 100 + R.pick([0, 49, 99]), sub = a * n + b, t = hst(sub), tot = sub + t;
        return { q: 'You buy ' + n + ' items at ' + M(a) + ' each and one item at ' + M(b) + '. With 13% HST, what is the total? (Pay by card.)', type: 'num', answer: A.clean(tot / 100), unit: '$', tol: 0.011,
          hint: 'Subtotal first. Then the tax is 13% of the subtotal, rounded to the nearest cent.',
          steps: ['Subtotal: ' + n + ' &times; ' + M(a) + ' + ' + M(b) + ' = ' + M(sub) + '.', 'Tax: 13% of ' + M(sub) + ' = $' + (sub * 0.13 / 100).toFixed(3) + ', rounded to the nearest cent: ' + M(t) + '.', 'Total: ' + M(sub) + ' + ' + M(t) + ' = ' + M(tot) + '.' + receipt([[n + ' &times; ' + M(a), a * n], ['1 &times; ' + M(b), b], ['Subtotal', sub, 1], ['HST 13%', t], ['Total', tot, 1]])], explain: 'The total is ' + M(tot) + '.' };
      } },
      { id: 'mo-budget', name: 'Budgets', code: 'F1.3', gen: function (lv) {
        var inc = R.int(4, 20) * 10, need = R.int(1, 4) * 5, save = R.int(1, 4) * 5;
        if (need + save >= inc) inc = need + save + 20;
        if (lv < 3) return { q: 'Your income is $' + inc + ' this month. Needs cost $' + need + ' and you plan to save $' + save + '. How much can go to wants so the budget is balanced?', fig: budgetBar(inc, [need, save, inc - need - save], 2), type: 'num', answer: inc - need - save, unit: '$',
          hint: 'Income minus needs minus savings.', steps: ['Start with income: $' + inc + '.', 'Take away needs and savings: $' + need + ' + $' + save + ' = $' + (need + save) + '.', '$' + inc + ' &minus; $' + (need + save) + ' = $' + (inc - need - save) + '.'], explain: 'Wants: $' + (inc - need - save) + '.' };
        var pct = R.pick([10, 20, 25, 50]), inc2 = R.pick([40, 60, 80, 100, 120, 200]);
        return { q: 'You want to save ' + pct + '% of your $' + inc2 + ' monthly income. How much do you save each month?', type: 'num', answer: inc2 * pct / 100, unit: '$',
          hint: pct === 10 ? '10% is one tenth.' : pct === 25 ? '25% is one quarter.' : pct === 50 ? '50% is one half.' : '20% is two tenths.',
          steps: [pct + '% means ' + pct + ' out of 100.', pct + '% = ' + ({ 10: '1/10', 20: '2/10', 25: '1/4', 50: '1/2' })[pct] + '.', ({ 10: '1/10', 20: '2/10', 25: '1/4', 50: '1/2' })[pct] + ' of $' + inc2 + ' = $' + inc2 * pct / 100 + '.'], explain: '$' + inc2 * pct / 100 + ' each month.' };
      } },
      { id: 'mo-credit', name: 'Credit and debt', code: 'F1.4', gen: function (lv) {
        if (lv === 1) {
          var qs = [['What is <b>debt</b>?', 'Money you owe and still have to pay back', ['Money you have saved', 'Money a store gives you for free', 'The price of an item']],
            ['What is <b>interest</b> on a credit card?', 'An extra amount you pay for borrowing', ['A discount for paying late', 'The money in your savings', 'A type of sales tax']],
            ['Which choice usually costs <b>less</b> in total?', 'Paying off a credit card quickly', ['Paying only a little each month', 'Never paying it back', 'Borrowing more']]];
          var q = R.pick(qs), o = R.mc(q[1], q[2]);
          return { q: q[0], type: 'mc', options: o.options, answer: o.answer, hint: 'Credit means borrowing.', steps: ['Credit is borrowed money.', 'Lenders charge interest, an extra amount, for borrowing.', 'The answer is: ' + q[1].toLowerCase() + '.'], explain: q[1] + '.' };
        }
        var owe = R.pick([100, 150, 200, 250, 300, 400, 500]), r = lv === 2 ? R.pick([1, 2]) : 2;
        if (lv === 2) return { q: 'You owe $' + owe + ' on a credit card. It adds ' + r + '% interest each month. How much interest is added in one month?', type: 'num', answer: A.clean(owe * r / 100), unit: '$',
          hint: '1% of $' + owe + ' is $' + A.clean(owe / 100) + '.', steps: ['1% of $' + owe + ' = $' + A.clean(owe / 100) + '.', r + '% = ' + r + ' &times; $' + A.clean(owe / 100) + '.', '= $' + A.clean(owe * r / 100) + '.'], explain: r + '% of $' + owe + ' is ' + M(owe * r) + '.' };
        var pay = R.pick([50, 100]), int1 = owe * 2 / 100, after = owe + int1 - pay;
        return { q: 'You owe $' + owe + '. The card adds 2% interest, then you pay $' + pay + '. How much do you still owe after the first month?', type: 'num', answer: A.clean(after), unit: '$',
          hint: 'First add the interest, then subtract your payment.', steps: ['Interest: 2% of $' + owe + ' = $' + A.clean(int1) + '.', 'Owed with interest: $' + owe + ' + $' + A.clean(int1) + ' = $' + A.clean(owe + int1) + '.', 'After paying $' + pay + ': ' + M((owe + int1 - pay) * 100) + '.' + oweBars([['owed', owe * 100], ['+2%', (owe + int1) * 100, 'var(--bad)'], ['pay $' + pay, after * 100]])], explain: 'You still owe ' + M(after * 100) + '.' };
      } },
      { id: 'mo-unit', name: 'Unit rates and best value', code: 'F1.5', gen: function (lv) {
        var n = R.int(2, 8), each = R.int(5, 40) * 5, tot = n * each;
        if (lv === 1) return { q: n + ' muffins cost ' + M(tot) + '. What is the price of one muffin?', fig: items(n, tot, 'muffin'), type: 'num', answer: A.clean(each / 100), unit: '$', hint: 'Divide the total price by ' + n + '.',
          steps: ['Unit rate = price &divide; number of items.', M(tot) + ' &divide; ' + n + '.', '= ' + M(each) + ' per muffin.'], explain: M(tot) + ' &divide; ' + n + ' = ' + M(each) + '.' };
        var s1 = R.pick([2, 4, 5]), s2 = s1 * R.pick([2, 3]), u1 = R.int(100, 300), u2 = u1 + R.pick([-1, 1]) * R.int(10, 40);
        var p1 = s1 * u1, p2 = s2 * u2, better = u1 < u2 ? 'A' : 'B';
        var unitName = R.pick([['L of juice', 'L'], ['kg of rice', 'kg']]);
        var o = R.mc('Pack ' + better, ['Pack ' + (better === 'A' ? 'B' : 'A'), 'They are the same value']);
        return { q: 'Pack A: ' + s1 + ' ' + unitName[0] + ' for ' + M(p1) + '. Pack B: ' + s2 + ' ' + unitName[0] + ' for ' + M(p2) + '. Which is the better value?', fig: packs([[s1, p1, 'Pack A'], [s2, p2, 'Pack B']], unitName[1]), type: 'mc', options: o.options, answer: o.answer,
          hint: 'Find the price for 1 ' + unitName[1] + ' in each pack.', steps: ['A: ' + M(p1) + ' &divide; ' + s1 + ' = ' + M(u1) + ' per ' + unitName[1] + '.', 'B: ' + M(p2) + ' &divide; ' + s2 + ' = ' + M(u2) + ' per ' + unitName[1] + '.', 'The lower unit rate is pack ' + better + '.'],
          explain: 'Pack ' + better + ' costs less per ' + unitName[1] + '.' };
      } },
      { id: 'mo-gov', name: 'Taxes and services', code: 'F1.6', gen: function (lv) {
        var qs = [['local parks and libraries', 'Municipal'], ['garbage pickup', 'Municipal'], ['hospitals and health care in Ontario', 'Provincial'], ['public schools in Ontario', 'Provincial'], ['the Canadian Armed Forces', 'Federal'], ['passports', 'Federal'], ['national parks like Banff', 'Federal'], ['fire services in your town', 'Municipal']];
        if (lv === 3) {
          var o3 = R.mc('8%', ['5%', '13%', '3%']);
          return { q: 'Ontario&rsquo;s 13% HST is split between two governments. What part goes to the province of Ontario?', type: 'mc', options: o3.options, answer: o3.answer, hint: 'The federal part is 5%.',
            steps: ['HST = federal part + provincial part.', 'The federal part is 5%.', '13% &minus; 5% = 8% for Ontario.' + hstSplit(1000)], explain: '5% federal + 8% provincial = 13%.' };
        }
        var q = R.pick(qs), o = R.mc(q[1], ['Federal', 'Provincial', 'Municipal']);
        return { q: 'Which level of government is mainly responsible for <b>' + q[0] + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Municipal is your city or town. Provincial is Ontario. Federal is all of Canada.',
          steps: ['Federal: things for all of Canada. Provincial: things for Ontario. Municipal: things for your city or town.', 'For ' + q[0] + ', it is the ' + q[1].toLowerCase() + ' government.' + levels(['Federal', 'Provincial', 'Municipal'].indexOf(q[1])), 'The answer is ' + q[1] + '.'], explain: q[1] + '.' };
      } }
    ]
  });
})();
