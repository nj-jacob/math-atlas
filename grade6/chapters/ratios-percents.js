(function () {
  var A = Atlas, R = A.R, gcd = A.gcd;
  var CA = 'var(--strand)', CB = 'var(--hi)';
  /* tiles: a of colour A then b of colour B, repeated k times as groups */
  function tiles(a, b, k, label) {
    k = k || 1;
    var u = 26, s = '', gw = (a + b) * u + 14, perRow = Math.max(1, Math.floor(520 / (gw + 8))), rows = Math.ceil(k / perRow);
    for (var g = 0; g < k; g++) {
      var gx = (g % perRow) * (gw + 8) + 4, gy = Math.floor(g / perRow) * (u + 22) + 4;
      s += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + (u + 14) + '" rx="7" fill="none" style="stroke:var(--line)" stroke-width="1.5"/>';
      for (var i = 0; i < a + b; i++) s += '<rect x="' + (gx + 7 + i * u) + '" y="' + (gy + 7) + '" width="' + (u - 4) + '" height="' + (u - 4) + '" rx="' + (i < a ? 3 : 11) + '" style="fill:' + (i < a ? CA : CB) + ';stroke:var(--ink)" stroke-width="1.2"/>';
    }
    return A.svg(Math.min(k, perRow) * (gw + 8) + 4, rows * (u + 22) + 2, s, label || k + ' groups of ' + a + ' squares and ' + b + ' circles');
  }
  /* double number line: top values a*i, bottom values b*i for i = 0..n; hl highlights index */
  function dnl(a, b, n, ta, tb, hl, hide) {
    var W = 560, x0 = 90, x1 = 540, s = '';
    s += '<text x="8" y="36" font-size="19" class="tb">' + ta + '</text><text x="8" y="96" font-size="19" class="tb">' + tb + '</text>';
    s += '<line x1="' + x0 + '" y1="44" x2="' + x1 + '" y2="44" style="stroke:var(--strand)" stroke-width="3"/><line x1="' + x0 + '" y1="76" x2="' + x1 + '" y2="76" style="stroke:var(--ink2)" stroke-width="3"/>';
    for (var i = 0; i <= n; i++) {
      var x = x0 + (x1 - x0) * i / n, on = i === hl;
      if (on) s += '<rect x="' + (x - 26) + '" y="8" width="52" height="104" rx="8" style="fill:color-mix(in srgb,var(--hi) 35%,transparent)"/>';
      s += '<line x1="' + x + '" y1="36" x2="' + x + '" y2="52" style="stroke:var(--strand)" stroke-width="2"/><line x1="' + x + '" y1="68" x2="' + x + '" y2="84" style="stroke:var(--ink2)" stroke-width="2"/>' +
        '<text x="' + x + '" y="28" text-anchor="middle" font-size="19" font-weight="700">' + (hide === 'a' && on ? '?' : A.fmt(a * i)) + '</text>' +
        '<text x="' + x + '" y="106" text-anchor="middle" font-size="19" font-weight="700">' + (hide === 'b' && on ? '?' : A.fmt(Math.round(b * i * 100) / 100)) + '</text>';
    }
    return A.svg(W, 116, s, 'Double number line: ' + ta + ' ' + a + ' matches ' + tb + ' ' + b + ', and each step adds the same again');
  }
  /* hundred grid with p squares shaded */
  function hgrid(p, size) {
    size = size || 22; var s = '';
    for (var i = 0; i < 100; i++) {
      var on = i < Math.floor(p), part = i === Math.floor(p) ? p % 1 : 0;
      s += '<rect x="' + (2 + (i % 10) * size) + '" y="' + (2 + Math.floor(i / 10) * size) + '" width="' + size + '" height="' + size + '" style="fill:' + (on ? 'color-mix(in srgb,var(--strand) 75%,var(--card))' : 'var(--card)') + ';stroke:var(--line)"/>';
      if (part) s += '<rect x="' + (2 + (i % 10) * size) + '" y="' + (2 + Math.floor(i / 10) * size) + '" width="' + size * part + '" height="' + size + '" style="fill:color-mix(in srgb,var(--strand) 75%,var(--card))"/>';
    }
    s += '<rect x="2" y="2" width="' + size * 10 + '" height="' + size * 10 + '" fill="none" style="stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(size * 10 + 4, size * 10 + 4, s, p + ' of 100 squares shaded: ' + p + '%');
  }
  /* percent bar: n split into 10 tens-of-percent, shading pct */
  function pbar(n, pct) {
    var W = 420, x0 = 20, s = '', cw = W / 10;
    for (var i = 0; i < 10; i++) {
      var x = x0 + i * cw, fillW = Math.max(0, Math.min(1, (pct - i * 10) / 10)) * cw;
      s += '<rect x="' + x + '" y="30" width="' + cw + '" height="44" style="fill:var(--card);stroke:var(--ink)" stroke-width="1.5"/>';
      if (fillW) s += '<rect x="' + x + '" y="30" width="' + fillW + '" height="44" style="fill:color-mix(in srgb,var(--strand) 70%,var(--card))"/>';
      s += '<text x="' + (x + cw / 2) + '" y="22" text-anchor="middle" font-size="15" class="t2">10%</text>';
    }
    for (var j = 0; j <= 10; j++) s += '<line x1="' + (x0 + j * cw) + '" y1="30" x2="' + (x0 + j * cw) + '" y2="74" style="stroke:var(--ink)" stroke-width="1.5"/>';
    s += '<text x="' + x0 + '" y="98" font-size="17" class="tb">0</text><text x="' + (x0 + W) + '" y="98" text-anchor="end" font-size="17" class="tb">' + A.fmt(n) + ' (100%)</text>';
    var px = x0 + W * pct / 100;
    s += '<line x1="' + px + '" y1="24" x2="' + px + '" y2="82" style="stroke:var(--bad)" stroke-width="3"/><text x="' + Math.max(70, Math.min(px, 390)) + '" y="116" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--bad)">' + pct + '% = ' + A.fmt(Math.round(n * pct) / 100) + '</text>';
    return A.svg(460, 124, s, pct + ' percent of ' + n + ' is ' + Math.round(n * pct) / 100);
  }
  function money(c) { return A.money(c); }
  function pctOf(p, n) { return Math.round(p * n) / 100; }
  function strat(p, n) {
    var t = n / 10, o = n / 100;
    var S = {
      50: ['50% is half.', 'Half of ' + A.fmt(n) + ' is ' + A.fmt(n / 2) + '.'],
      25: ['25% is a quarter: half of a half.', 'Half of ' + A.fmt(n) + ' is ' + A.fmt(n / 2) + '. Half again is ' + A.fmt(n / 4) + '.'],
      10: ['10% is one tenth: divide by 10.', A.fmt(n) + ' &divide; 10 = ' + A.fmt(t) + '.'],
      5: ['5% is half of 10%.', '10% is ' + A.fmt(t) + '. Half of that is ' + A.fmt(t / 2) + '.'],
      15: ['15% = 10% + 5%.', '10% is ' + A.fmt(t) + ', 5% is ' + A.fmt(t / 2) + '. Together: ' + A.fmt(t + t / 2) + '.'],
      1: ['1% is one hundredth: divide by 100.', A.fmt(n) + ' &divide; 100 = ' + A.fmt(o) + '.']
    };
    return S[p];
  }

  A.register('ratios-percents', {
    html:
'<section class="sec"><h2><span class="n">1</span>Ratios</h2>' +
'<p>A <b>ratio</b> compares two amounts. In this group there are 3 squares and 2 circles. The ratio of squares to circles is <b>3 to 2</b>, written 3:2. The order matters: circles to squares is 2:3.</p>' +
'<div class="fig">' + tiles(3, 2, 1, '3 squares and 2 circles') + '</div>' +
'<p>A ratio can compare a part to a part (3:2), or a part to the whole: 3 of the 5 shapes are squares, so 3:5, or ' + A.fr(3, 5) + ' of the shapes.</p>' +
'<p><b>Equivalent ratios</b> come from repeating the same group. Two groups have 6 squares and 4 circles, so 3:2 = 6:4. Three groups: 9:6.</p>' +
'<div class="fig">' + tiles(3, 2, 3, 'Three groups of 3 squares and 2 circles') + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>To make an equivalent ratio, multiply (or divide) <b>both</b> numbers by the same number. Adding the same number to both does not work.</p></div>' +
'<div class="lab"><span class="lt">Try it: build equal ratios</span>' +
'<div class="ctrl"><label for="ra">Squares in a group<input type="number" id="ra" min="1" max="6" value="2"></label><label for="rb">Circles in a group<input type="number" id="rb" min="1" max="6" value="3"></label><label for="rk">Number of groups: <output id="rko"></output><input type="range" id="rk" min="1" max="6" value="4"></label></div>' +
'<div class="fig" id="rfig"></div><div class="out" id="rout"></div></div>' +
A.yt({ q: 'A class has 12 girls and 10 boys. What is the ratio of boys to girls?', type: 'mc', options: ['12:10', '10:12', '10:22', '22:10'], answer: 1,
  hint: 'Say the rule: the order of the words is the order of the numbers. Boys first.', explain: 'Boys to girls is 10:12. (It is equivalent to 5:6.)' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Ratio tables and scaling</h2>' +
'<p>A <b>ratio table</b> or a <b>double number line</b> keeps two amounts matched as they grow. Every step adds the same amount to each line.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>A pancake recipe uses 2 cups of flour for every 3 eggs. How many eggs for 8 cups of flour?</p><div class="fig">' + dnl(2, 3, 4, 'flour', 'eggs', 4) + '</div>' +
'<p>8 is 2 &times; 4, so multiply the eggs by 4 too: 3 &times; 4 = <b>12 eggs</b>.</p></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Flour (cups)</th><td>2</td><td>4</td><td>6</td><td>8</td><td>10</td></tr></thead><tbody><tr><th class="l">Eggs</th><td>3</td><td>6</td><td>9</td><td><b>12</b></td><td>15</td></tr></tbody></table></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding instead of multiplying. From 2 cups to 8 cups is not "add 6 eggs". It is "4 times as much", so 4 times the eggs.</p></div>' +
A.yt({ q: 'Paint is mixed 1 can of blue for every 4 cans of white. How many cans of white for 6 cans of blue?', type: 'num', answer: 24,
  hint: 'Say the rule: multiply both by the same number. Blue went from 1 to 6.', explain: '1 &times; 6 = 6 blue, so 4 &times; 6 = 24 white.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Rates and unit rates</h2>' +
'<p>A <b>rate</b> compares two different kinds of things, like kilometres and hours, or dollars and items. A <b>unit rate</b> tells you how much for <b>one</b>: 80 km per hour, $1.25 per can.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>A car goes 240 km in 3 hours. Unit rate: 240 &divide; 3 = <b>80 km/h</b>. In 5 hours it would go 80 &times; 5 = 400 km.</p><div class="fig">' + dnl(80, 1, 5, 'km', 'hours', 1) + '</div></div>' +
'<p>Unit prices help you find the <b>better buy</b>: the one that costs less for each item, gram or litre.</p>' +
'<div class="lab"><span class="lt">Try it: which is the better buy?</span>' +
'<div class="ctrl"><label for="bap">Pack A price ($)<input type="number" id="bap" min="0.5" max="50" step="0.01" value="4.50"></label><label for="ban">Pack A count<input type="number" id="ban" min="1" max="48" value="6"></label></div>' +
'<div class="ctrl"><label for="bbp">Pack B price ($)<input type="number" id="bbp" min="0.5" max="50" step="0.01" value="9.60"></label><label for="bbn">Pack B count<input type="number" id="bbn" min="1" max="48" value="12"></label></div>' +
'<div class="fig" id="bfig"></div><div class="out" id="bout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Unit rate = total &divide; number of units. Compare unit rates to compare deals. The cheapest pack is not always the better buy.</p></div>' +
A.yt({ q: 'A 4-pack of juice costs $6.00. What is the price for one?', type: 'num', unit: '$', answer: 1.5,
  hint: 'Say the rule: total &divide; number of units.', explain: '$6.00 &divide; 4 = $1.50 each.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Percents</h2>' +
'<p><b>Percent</b> means "out of 100". 35% is 35 out of 100, which is ' + A.fr(35, 100) + ' or 0.35. A percent is a ratio to 100.</p>' +
'<div class="row2"><div class="fig">' + hgrid(35) + '</div><div><div class="tbl"><table><thead><tr><th>Fraction</th><th>Decimal</th><th>Percent</th></tr></thead><tbody>' +
'<tr><td>' + A.fr(1, 2) + '</td><td>0.5</td><td>50%</td></tr><tr><td>' + A.fr(1, 4) + '</td><td>0.25</td><td>25%</td></tr><tr><td>' + A.fr(3, 4) + '</td><td>0.75</td><td>75%</td></tr>' +
'<tr><td>' + A.fr(1, 10) + '</td><td>0.1</td><td>10%</td></tr><tr><td>' + A.fr(1, 20) + '</td><td>0.05</td><td>5%</td></tr><tr><td>' + A.fr(1, 100) + '</td><td>0.01</td><td>1%</td></tr></tbody></table></div></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To change a fraction to a percent, make the bottom 100. ' + A.fr(3, 5) + ' = ' + A.fr(60, 100) + ' = 60%. 100% is the whole amount.</p></div>' +
A.yt({ q: 'Write ' + A.fr(7, 20) + ' as a percent.', type: 'num', unit: '%', answer: 35,
  hint: 'Say the rule: make the bottom 100. 20 &times; 5 = 100.', explain: A.fr(7, 20) + ' = ' + A.fr(35, 100) + ' = 35%.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Percents in your head</h2>' +
'<p>A few percents are easy to find in your head. Build the others from them.</p>' +
'<div class="tbl"><table><thead><tr><th>Percent</th><th class="l">Strategy</th><th class="l">Of 80</th></tr></thead><tbody>' +
'<tr><td>50%</td><td class="l">half</td><td class="l">40</td></tr><tr><td>25%</td><td class="l">half of half</td><td class="l">20</td></tr>' +
'<tr><td>10%</td><td class="l">divide by 10</td><td class="l">8</td></tr><tr><td>5%</td><td class="l">half of 10%</td><td class="l">4</td></tr>' +
'<tr><td>15%</td><td class="l">10% + 5%</td><td class="l">8 + 4 = 12</td></tr><tr><td>1%</td><td class="l">divide by 100</td><td class="l">0.8</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: percent of a number</span>' +
'<div class="ctrl"><label for="pn">Number<input type="number" id="pn" min="10" max="1000" step="10" value="60"></label><label for="pp">Percent<select id="pp"><option>1</option><option>5</option><option selected>10</option><option>15</option><option>25</option><option>50</option></select></label></div>' +
'<div class="fig" id="pfig"></div><div class="out" id="pout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A tip of 15% on a $40 meal. 10% of 40 is 4. 5% is half of that, 2. 15% = 4 + 2 = <b>$6</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking 5% is "divide by 5". Dividing by 5 gives 20%. 5% is much smaller: half of 10%.</p></div>' +
A.yt({ q: 'What is 25% of 64?', type: 'num', answer: 16,
  hint: 'Say the strategy: 25% is half of a half.', explain: 'Half of 64 is 32. Half of 32 is 16.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function rt() {
        var a = Math.max(1, Math.min(6, parseInt($('#ra', root).value, 10) || 1)), b = Math.max(1, Math.min(6, parseInt($('#rb', root).value, 10) || 1)), k = +$('#rk', root).value;
        $('#rko', root).textContent = k;
        $('#rfig', root).innerHTML = tiles(a, b, k);
        var h = '<div class="tbl"><table><tbody><tr><th class="l">Squares</th>', i;
        for (i = 1; i <= k; i++) h += '<td' + (i === k ? ' style="font-weight:700"' : '') + '>' + a * i + '</td>';
        h += '</tr><tr><th class="l">Circles</th>';
        for (i = 1; i <= k; i++) h += '<td' + (i === k ? ' style="font-weight:700"' : '') + '>' + b * i + '</td>';
        var g = gcd(a, b);
        $('#rout', root).innerHTML = h + '</tr></tbody></table></div><p><span class="big">' + a + ':' + b + ' = ' + a * k + ':' + b * k + '</span></p><p>Squares to all shapes: ' + a * k + ':' + (a + b) * k + ', so ' + A.fr(a, a + b) + ' of the shapes are squares.' + (g > 1 ? ' Simplest form: ' + a / g + ':' + b / g + '.' : '') + '</p>';
      }
      A.bind(root, ['ra', 'rb', 'rk'], rt);
      function bb() {
        var ap = Math.max(50, Math.round((parseFloat($('#bap', root).value) || 0.5) * 100)), an = Math.max(1, parseInt($('#ban', root).value, 10) || 1), bp = Math.max(50, Math.round((parseFloat($('#bbp', root).value) || 0.5) * 100)), bn = Math.max(1, parseInt($('#bbn', root).value, 10) || 1);
        var ua = ap / an, ub = bp / bn, mx = Math.max(ua, ub), s = '';
        [['A', ua, an, ap], ['B', ub, bn, bp]].forEach(function (r, i) {
          var w = 300 * r[1] / mx, y = 10 + i * 56;
          s += '<text x="8" y="' + (y + 28) + '" font-size="20" font-weight="700">Pack ' + r[0] + '</text><rect x="90" y="' + y + '" width="' + w + '" height="40" rx="5" style="fill:' + (i ? CB : CA) + '"/>' +
            '<text x="' + (96 + w) + '" y="' + (y + 27) + '" font-size="20" class="tb">' + money(Math.round(r[1] * 100) / 100) + ' each</text>';
        });
        $('#bfig', root).innerHTML = A.svg(560, 122, s, 'Unit price of pack A and pack B');
        var diff = Math.abs(ua - ub) < 0.005;
        $('#bout', root).innerHTML = '<p>Pack A: ' + money(ap) + ' &divide; ' + an + ' = <b>' + money(Math.round(ua * 100) / 100) + '</b> each' + (Math.round(ua * 100) !== ua * 100 ? ' (rounded)' : '') + '</p><p>Pack B: ' + money(bp) + ' &divide; ' + bn + ' = <b>' + money(Math.round(ub * 100) / 100) + '</b> each</p>' +
          '<p><span class="big">' + (diff ? 'Same unit price' : 'Pack ' + (ua < ub ? 'A' : 'B') + ' is the better buy') + '</span></p>';
      }
      A.bind(root, ['bap', 'ban', 'bbp', 'bbn'], bb);
      function pc() {
        var n = Math.max(10, Math.min(1000, Math.round((parseInt($('#pn', root).value, 10) || 10) / 10) * 10)), p = +$('#pp', root).value, st = strat(p, n);
        $('#pfig', root).innerHTML = pbar(n, p);
        $('#pout', root).innerHTML = '<p><span class="big">' + p + '% of ' + A.fmt(n) + ' = ' + A.fmt(pctOf(p, n)) + '</span></p><p>' + st[0] + ' ' + st[1] + '</p>';
      }
      A.bind(root, ['pn', 'pp'], pc);
    },

    quiz: [
      { q: 'A bag has 5 red marbles and 7 blue marbles. What is the ratio of red marbles to <b>all</b> marbles?', type: 'mc', options: ['5:7', '7:5', '5:12', '12:5'], answer: 2, fig: tiles(5, 7, 1, '5 squares for red and 7 circles for blue'),
        hint: 'Find the total number of marbles first.', explain: '5 + 7 = 12 marbles in all, so red to all is 5:12.' },
      { q: 'Which ratio is equivalent to 4:6?', type: 'mc', options: ['6:8', '8:12', '5:7', '2:4'], answer: 1,
        hint: 'Multiply or divide both numbers by the same number.', explain: '4 &times; 2 = 8 and 6 &times; 2 = 12, so 4:6 = 8:12. Adding 2 to both (6:8) does not work.' },
      { q: 'A recipe uses 3 cups of rice for 5 people. How many cups for 20 people?', type: 'num', answer: 12, fig: dnl(3, 5, 4, 'cups', 'people', 4, 'a'),
        hint: '20 people is 4 times 5 people.', explain: '5 &times; 4 = 20, so 3 &times; 4 = 12 cups.' },
      { q: 'A cyclist rides 54 km in 3 hours. What is her speed in km per hour?', type: 'num', answer: 18, unit: 'km/h',
        hint: 'Divide the distance by the time.', explain: '54 &divide; 3 = 18 km/h.' },
      { q: 'Which is the better buy: 6 granola bars for $4.20, or 10 for $6.50?', type: 'mc', options: ['6 for $4.20', '10 for $6.50', 'They cost the same each'], answer: 1,
        hint: 'Find the price of one bar in each pack.', explain: '$4.20 &divide; 6 = $0.70 each. $6.50 &divide; 10 = $0.65 each. The 10-pack is the better buy.' },
      { q: 'What is 15% of 120?', type: 'num', answer: 18, fig: pbar(120, 15),
        hint: 'Find 10%, then 5%, then add.', explain: '10% of 120 is 12. 5% is 6. 12 + 6 = 18.' },
      { q: 'A $60 jacket is on sale for 25% off. How much do you save?', type: 'num', answer: 15, unit: '$',
        hint: '25% is a quarter.', explain: 'A quarter of $60 is $15. (The sale price is $45.)' }
    ],

    practice: [
      { id: 'rp-ratio', name: 'Equivalent ratios', code: 'B2.12', gen: function (lv) {
        var a = R.int(1, lv === 1 ? 4 : 9), b = R.int(1, lv === 1 ? 4 : 9); while (b === a) b = R.int(1, 9);
        var k = R.int(2, lv === 1 ? 4 : lv === 2 ? 6 : 12), ctx = R.pick([['cups of flour', 'cups of milk'], ['red tiles', 'blue tiles'], ['cans of blue paint', 'cans of white paint'], ['teachers', 'students']]);
        if (lv === 3) { var g = R.int(2, 6), A0 = a * g, B0 = b * g, k2 = R.int(2, 5);
          return { q: 'The ratio of ' + ctx[0] + ' to ' + ctx[1] + ' is ' + A0 + ':' + B0 + '. If there are ' + a * k2 + ' ' + ctx[0] + ', how many ' + ctx[1] + ' are there?', type: 'num', answer: b * k2, v: { a: A0, b: B0, x: a * k2 },
            hint: 'Simplify ' + A0 + ':' + B0 + ' first by dividing both by ' + g + '.', steps: [A0 + ':' + B0 + ' = ' + a + ':' + b + ' (both &divide; ' + g + ').', a + ' &times; ' + k2 + ' = ' + a * k2 + ', so multiply ' + b + ' by ' + k2 + ' too.', b + ' &times; ' + k2 + ' = ' + b * k2 + '.'],
            explain: A0 + ':' + B0 + ' = ' + a + ':' + b + ' = ' + a * k2 + ':' + b * k2 + '.' }; }
        return { q: 'The ratio of ' + ctx[0] + ' to ' + ctx[1] + ' is ' + a + ':' + b + '. How many ' + ctx[1] + ' go with ' + a * k + ' ' + ctx[0] + '?', type: 'num', answer: b * k, v: { a: a, b: b, x: a * k },
          fig: lv === 1 ? tiles(a, b, k) : dnl(a, b, k, ctx[0].split(' ').slice(-1)[0], ctx[1].split(' ').slice(-1)[0], k, 'b'),
          hint: 'How many times bigger is ' + a * k + ' than ' + a + '? Multiply ' + b + ' by the same.',
          steps: [a * k + ' &divide; ' + a + ' = ' + k + ', so it is ' + k + ' times as much.', 'Multiply the other number by ' + k + ' too: ' + b + ' &times; ' + k + '.', b + ' &times; ' + k + ' = ' + b * k + '.'],
          explain: a + ':' + b + ' = ' + a * k + ':' + b * k + '.' };
      } },
      { id: 'rp-part', name: 'Part-to-part and part-to-whole', code: 'B2.12', gen: function (lv) {
        var a = R.int(2, 9), b = R.int(2, 9); while (b === a) b = R.int(2, 9);
        var names = R.pick([['cats', 'dogs'], ['apples', 'oranges'], ['girls', 'boys'], ['red cars', 'white cars']]);
        if (lv === 3) { var k = R.int(2, 6), tot = (a + b) * k;
          return { q: 'The ratio of ' + names[0] + ' to ' + names[1] + ' is ' + a + ':' + b + '. There are ' + tot + ' in all. How many are ' + names[0] + '?', type: 'num', answer: a * k, v: { a: a, b: b, tot: tot },
            fig: tiles(a, b, 1), hint: 'Each group has ' + (a + b) + '. How many groups make ' + tot + '?',
            steps: ['One group has ' + a + ' + ' + b + ' = ' + (a + b) + '.', tot + ' &divide; ' + (a + b) + ' = ' + k + ' groups.', k + ' &times; ' + a + ' = ' + a * k + ' ' + names[0] + '.'],
            explain: k + ' groups of ' + (a + b) + '. ' + names[0] + ': ' + k + ' &times; ' + a + ' = ' + a * k + '.' }; }
        var askWhole = lv === 2, right = askWhole ? a + ':' + (a + b) : b + ':' + a;
        var o = R.mc(right, [a + ':' + b, b + ':' + (a + b), (a + b) + ':' + a, a + ':' + (a + b), b + ':' + a].filter(function (x) { return x !== right; }));
        return { q: 'There are ' + a + ' ' + names[0] + ' and ' + b + ' ' + names[1] + '. What is the ratio of ' + (askWhole ? names[0] + ' to <b>all</b> of them' : names[1] + ' to ' + names[0]) + '?', type: 'mc', options: o.options, answer: o.answer, v: { a: a, b: b, whole: askWhole },
          fig: tiles(a, b, 1), hint: askWhole ? 'Find the total first: ' + a + ' + ' + b + '.' : 'Write the numbers in the same order as the words.',
          steps: askWhole ? ['The whole is ' + a + ' + ' + b + ' = ' + (a + b) + '.', names[0] + ' first, then the whole.', a + ':' + (a + b) + '.'] : ['The words say ' + names[1] + ' first.', 'There are ' + b + ' ' + names[1] + ' and ' + a + ' ' + names[0] + '.', b + ':' + a + '.'],
          explain: 'The ratio is ' + right + '.' };
      } },
      { id: 'rp-rate', name: 'Unit rates', code: 'B2.12', gen: function (lv) {
        var u = lv === 1 ? R.int(2, 9) * 10 : R.int(12, 95), n = R.int(2, lv === 1 ? 5 : 8), ctx = R.pick([['km', 'hours', 'km/h', 'A train travels'], ['words', 'minutes', 'words per minute', 'Kai types'], ['L', 'minutes', 'L per minute', 'A tap fills']]);
        if (lv === 3) { var m = R.int(2, 9); while (m === n) m = R.int(2, 9);
          return { q: ctx[3] + ' ' + u * n + ' ' + ctx[0] + ' in ' + n + ' ' + ctx[1] + '. At the same rate, how many ' + ctx[0] + ' in ' + m + ' ' + ctx[1] + '?', type: 'num', answer: u * m, v: { tot: u * n, n: n, m: m },
            hint: 'Find the unit rate first: how many in 1 ' + ctx[1].slice(0, -1) + '?', steps: ['Unit rate: ' + u * n + ' &divide; ' + n + ' = ' + u + ' ' + ctx[2] + '.', 'Multiply by ' + m + ': ' + u + ' &times; ' + m + '.', u * m + ' ' + ctx[0] + '.'],
            explain: u + ' ' + ctx[2] + ' &times; ' + m + ' = ' + u * m + ' ' + ctx[0] + '.' }; }
        return { q: ctx[3] + ' ' + u * n + ' ' + ctx[0] + ' in ' + n + ' ' + ctx[1] + '. What is the unit rate in ' + ctx[2] + '?', type: 'num', answer: u, unit: ctx[2], v: { tot: u * n, n: n },
          fig: lv === 1 ? dnl(u, 1, n, ctx[0], ctx[1], 1, 'a') : '',
          hint: 'Divide ' + u * n + ' by ' + n + '.', steps: ['Unit rate means how much in 1 ' + ctx[1].slice(0, -1) + '.', u * n + ' &divide; ' + n + '.', '= ' + u + ' ' + ctx[2] + '.'], explain: u * n + ' &divide; ' + n + ' = ' + u + ' ' + ctx[2] + '.' };
      } },
      { id: 'rp-better', name: 'Better buy', code: 'B2.12', gen: function (lv) {
        var item = R.pick(['granola bars', 'juice boxes', 'pencils', 'bagels', 'yogurt cups']), na = R.pick([2, 3, 4, 5, 6]), nb = na * R.pick([2, 3]);
        var ua = R.int(lv === 1 ? 50 : 40, 150), ub = ua + R.pick([-1, 1]) * R.int(lv === 3 ? 2 : 5, lv === 3 ? 6 : 20);
        if (ub < 10) ub = ua + 8;
        var pa = ua * na, pb = ub * nb, right = ua < ub ? na + ' for ' + money(pa) : nb + ' for ' + money(pb);
        var o = { options: [na + ' for ' + money(pa), nb + ' for ' + money(pb)], answer: ua < ub ? 0 : 1 };
        return { q: 'Which is the better buy: ' + na + ' ' + item + ' for ' + money(pa) + ', or ' + nb + ' for ' + money(pb) + '?', type: 'mc', options: o.options, answer: o.answer, v: { na: na, pa: pa, nb: nb, pb: pb },
          hint: 'Find the price of one in each pack.', steps: [money(pa) + ' &divide; ' + na + ' = ' + money(ua) + ' each.', money(pb) + ' &divide; ' + nb + ' = ' + money(ub) + ' each.', 'The lower price for one is the better buy: ' + right + '.'],
          explain: money(ua) + ' each vs ' + money(ub) + ' each, so ' + right + ' is the better buy.' };
      } },
      { id: 'rp-pct', name: 'Percent of a number in your head', code: 'B2.3', gen: function (lv) {
        var p = R.pick(lv === 1 ? [50, 10, 25] : lv === 2 ? [5, 1, 25, 10] : [15, 5, 1, 15]), n = R.int(1, lv === 3 ? 30 : 20) * 20;
        if (p === 25) n = R.int(1, 25) * 4;
        var st = strat(p, n);
        return { q: 'What is ' + p + '% of ' + A.fmt(n) + '?', type: 'num', answer: pctOf(p, n), v: { p: p, n: n },
          fig: lv === 1 ? pbar(n, p) : '', hint: st[0], steps: [st[0], st[1], p + '% of ' + A.fmt(n) + ' is ' + A.fmt(pctOf(p, n)) + '.'], explain: st[1] };
      } },
      { id: 'rp-fdp', name: 'Fractions, decimals and percents', code: 'B2.12', gen: function (lv) {
        var f = R.pick(lv === 1 ? [[1, 2], [1, 4], [3, 4], [1, 10], [3, 10], [7, 10], [1, 5], [2, 5]] : [[3, 5], [4, 5], [1, 20], [7, 20], [9, 25], [3, 50], [11, 20], [17, 25], [1, 8], [3, 8]]);
        var pct = f[0] * 100 / f[1];
        if (lv === 3) { var o = R.mc(pct + '%', [f[0] + '%', (pct / 10) + '%', (100 - pct) + '%', (f[0] * 10) + '%'].filter(function (x) { return x !== pct + '%'; }));
          return { q: 'A team won ' + f[0] * 2 + ' of its ' + f[1] * 2 + ' games. What percent of its games did it win?', type: 'mc', options: o.options, answer: o.answer, v: { n: f[0] * 2, d: f[1] * 2 },
            hint: 'Write it as a fraction, then make the bottom 100.', steps: ['Won ' + f[0] * 2 + ' of ' + f[1] * 2 + ': ' + A.fr(f[0] * 2, f[1] * 2) + '.', 'Simplify and scale to hundredths: ' + A.fr(f[0], f[1]) + ' = ' + (pct === Math.round(pct) ? A.fr(pct, 100) : pct + ' out of 100') + '.', 'So ' + pct + '%.'], explain: A.fr(f[0] * 2, f[1] * 2) + ' = ' + pct + '%.' }; }
        return { q: 'Write ' + A.fr(f[0], f[1]) + ' as a percent.', type: 'num', unit: '%', answer: pct, fig: Number.isInteger(pct) ? '<div class="fig">' + hgrid(pct, 16) + '</div>' : '', v: { n: f[0], d: f[1] },
          hint: 'Make the bottom 100: multiply top and bottom by ' + 100 / f[1] + '.', steps: ['100 &divide; ' + f[1] + ' = ' + 100 / f[1] + '.', 'Multiply top and bottom by ' + 100 / f[1] + ': ' + A.fr(f[0] * 100 / f[1], 100) + '.', 'Out of 100 means percent: ' + pct + '%.'],
          explain: A.fr(f[0], f[1]) + ' = ' + A.fr(pct, 100) + ' = ' + pct + '%.' };
      } }
    ]
  });
})();
