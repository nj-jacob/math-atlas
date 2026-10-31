(function () {
  var A = Atlas, R = A.R, cl = A.clean, fr = A.fr, frs = A.frs, gcd = A.gcd, fmt = A.fmt;
  function dec(x) { return String(cl(x)); }
  function money(x) { return '$' + x.toFixed(2); }

  /* hundred grid with n squares shaded (n can have one decimal) */
  function hgrid(n) {
    var sz = 22, s = '', full = Math.floor(n), part = n - full;
    for (var i = 0; i < 100; i++) {
      var x = 2 + (i % 10) * sz, y = 2 + Math.floor(i / 10) * sz;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:' + (i < full ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1"/>';
      if (i === full && part > 0) s += '<rect x="' + x + '" y="' + y + '" width="' + (sz * part).toFixed(1) + '" height="' + sz + '" style="fill:var(--strand);opacity:.6"/>';
    }
    s += '<rect x="2" y="2" width="220" height="220" fill="none" style="stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(224, 224, s, n + ' of 100 squares shaded');
  }
  /* a bar split into d parts with n shaded, with a 0% to 100% scale underneath */
  function pbar(n, d) {
    var W = 500, s = '', cw = W / d;
    for (var i = 0; i < d; i++) s += '<rect x="' + (20 + i * cw).toFixed(1) + '" y="6" width="' + cw.toFixed(1) + '" height="36" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
    s += '<line x1="20" y1="54" x2="' + (20 + W) + '" y2="54" style="stroke:var(--ink2)" stroke-width="2"/>';
    for (var p = 0; p <= 100; p += 10) { var x = 20 + W * p / 100; s += '<line x1="' + x + '" y1="50" x2="' + x + '" y2="' + (p % 50 ? 58 : 62) + '" style="stroke:var(--ink2)" stroke-width="1.5"/>'; if (p % 50 === 0) s += '<text x="' + x + '" y="80" text-anchor="middle" font-size="16" class="t2">' + p + '%</text>'; }
    var px = 20 + W * Math.min(n / d, 1);
    s += '<line x1="' + px + '" y1="2" x2="' + px + '" y2="64" style="stroke:var(--se)" stroke-width="3"/><text x="' + Math.min(Math.max(px, 50), 490) + '" y="98" text-anchor="middle" font-size="18" font-weight="700" style="fill:var(--se)">' + dec(Math.round(n / d * 1000) / 10) + '%</text>';
    return A.svg(W + 40, 104, s, n + ' of ' + d + ' parts is ' + dec(Math.round(n / d * 1000) / 10) + ' percent');
  }
  /* bar model of a percent change: the whole, and the part added or taken away */
  function change(n, p, up) {
    var W = 380 / (up ? Math.max(1, 1 + p / 100) : 1), s = '', part = W * p / 100;
    s += '<text x="0" y="28" font-size="17" font-weight="700">Start</text><rect x="70" y="6" width="' + W + '" height="34" style="fill:color-mix(in srgb,var(--strand) 30%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>' +
      '<text x="' + (70 + W / 2) + '" y="29" text-anchor="middle" font-size="17" font-weight="700">' + fmt(n) + ' (100%)</text>';
    if (up) {
      s += '<text x="0" y="78" font-size="17" font-weight="700">New</text><rect x="70" y="56" width="' + W + '" height="34" style="fill:color-mix(in srgb,var(--strand) 30%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>' +
        '<rect x="' + (70 + W) + '" y="56" width="' + part + '" height="34" style="fill:var(--se);stroke:var(--ink)" stroke-width="1.5"/>' +
        (part > 60 ? '<text x="' + (70 + W + part / 2) + '" y="79" text-anchor="middle" font-size="16" font-weight="700" style="fill:#fff">+' + p + '%</text>' : '<text x="' + (74 + W + part) + '" y="79" font-size="16" font-weight="700" style="fill:var(--se)">+' + p + '%</text>');
    } else {
      s += '<text x="0" y="78" font-size="17" font-weight="700">New</text><rect x="70" y="56" width="' + (W - part) + '" height="34" style="fill:color-mix(in srgb,var(--strand) 30%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>' +
        '<rect x="' + (70 + W - part) + '" y="56" width="' + part + '" height="34" style="fill:none;stroke:var(--se)" stroke-width="2.5" stroke-dasharray="5 4"/>' +
        (part > 60 ? '<text x="' + (70 + W - part / 2) + '" y="79" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--se)">&minus;' + p + '%</text>' : '');
    }
    return A.svg(Math.ceil(110 + W + (up ? part : 0) + 50), 96, s, (up ? 'Increase ' : 'Decrease ') + n + ' by ' + p + ' percent');
  }
  /* double number line for a ratio a : b, up to k groups */
  function dline(a, b, k, la, lb, hl) {
    var W = 540, s = '', sc = function (i) { return 96 + 414 * i / k; };
    s += '<text x="0" y="51" font-size="16" font-weight="700" style="fill:var(--sb)">' + la + '</text><text x="0" y="85" font-size="16" font-weight="700" style="fill:var(--se)">' + lb + '</text>';
    s += '<line x1="96" y1="46" x2="510" y2="46" style="stroke:var(--sb)" stroke-width="3"/><line x1="96" y1="80" x2="510" y2="80" style="stroke:var(--se)" stroke-width="3"/>';
    for (var i = 0; i <= k; i++) {
      var x = sc(i), on = i === hl;
      if (on) s += '<rect x="' + (x - 30) + '" y="12" width="60" height="98" rx="6" style="fill:color-mix(in srgb,var(--hi) 35%,transparent)"/>';
      s += '<line x1="' + x + '" y1="40" x2="' + x + '" y2="52" style="stroke:var(--sb)" stroke-width="2"/><line x1="' + x + '" y1="74" x2="' + x + '" y2="86" style="stroke:var(--se)" stroke-width="2"/>' +
        '<text x="' + x + '" y="32" text-anchor="middle" font-size="17"' + (on ? ' font-weight="700"' : '') + '>' + dec(a * i) + '</text><text x="' + x + '" y="106" text-anchor="middle" font-size="17"' + (on ? ' font-weight="700"' : '') + '>' + dec(b * i) + '</text>';
    }
    return A.svg(W, 116, s, 'Double number line. ' + la + ' ' + a + ' goes with ' + lb + ' ' + b + ', up to ' + a * k + ' and ' + b * k + '.');
  }
  /* graph of one or two lines y = m x + c for x from 0 to X */
  function graph(lines, X, Y, xl, yl) {
    var W = 520, H = 280, x0 = 60, y0 = 240, s = '', sx = function (x) { return x0 + (W - x0 - 20) * x / X; }, sy = function (y) { return y0 - (y0 - 16) * y / Y; };
    for (var i = 0; i <= 5; i++) {
      var gx = sx(X * i / 5), gy = sy(Y * i / 5);
      s += '<line x1="' + gx + '" y1="16" x2="' + gx + '" y2="' + y0 + '" style="stroke:var(--line)"/><line x1="' + x0 + '" y1="' + gy + '" x2="' + (W - 20) + '" y2="' + gy + '" style="stroke:var(--line)"/>' +
        '<text x="' + gx + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="15">' + dec(X * i / 5) + '</text><text x="' + (x0 - 8) + '" y="' + (gy + 5) + '" text-anchor="end" font-size="15">' + dec(Y * i / 5) + '</text>';
    }
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 20) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x0 + '" y1="16" x2="' + x0 + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + ((x0 + W) / 2) + '" y="' + (y0 + 40) + '" text-anchor="middle" font-size="16" class="t2">' + xl + '</text><text x="14" y="' + (y0 / 2) + '" text-anchor="middle" font-size="16" class="t2" transform="rotate(-90 14 ' + (y0 / 2) + ')">' + yl + '</text>';
    lines.forEach(function (L) {
      s += '<line x1="' + sx(0) + '" y1="' + sy(L.c) + '" x2="' + sx(X) + '" y2="' + sy(L.c + L.m * X) + '" style="stroke:' + L.col + '" stroke-width="4"/>';
      s += '<circle cx="' + sx(0) + '" cy="' + sy(L.c) + '" r="6" style="fill:' + L.col + '"/>';
      s += '<text x="' + (sx(X) - 6) + '" y="' + (sy(L.c + L.m * X) - 10) + '" text-anchor="end" font-size="16" font-weight="700" style="fill:' + L.col + '">' + L.lab + '</text>';
    });
    return A.svg(W, H + 20, s, lines.map(function (L) { return L.lab + ': starts at ' + L.c + ', goes up ' + L.m + ' each step'; }).join('. '));
  }
  var EQ = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [1, 10], [3, 10], [1, 20], [1, 25], [1, 50], [1, 100]];
  function pctOf(n, d) { return cl(n / d * 100); }

  A.register('percent-ratio', {
    html:
'<section class="sec"><h2><span class="n">1</span>Fractions, decimals and percents</h2>' +
'<p><b>Percent</b> means "out of 100". 35% is 35 out of 100. That is the same amount as ' + fr(35, 100) + ' and as 0.35. Three names, one amount.</p>' +
'<div class="lab"><span class="lt">Try it: shade the grid</span>' +
'<div class="ctrl"><label for="hgr">Squares shaded: <output id="hgo"></output><input type="range" id="hgr" min="0" max="100" value="35"></label></div>' +
'<div class="row2"><div class="fig" id="hgfig"></div><div class="out" id="hgout"></div></div></div>' +
'<h3>Equivalents to know by heart</h3><p>These come up all the time. Learn them like times tables.</p>' +
'<div class="tbl"><table><thead><tr><th>Fraction</th><th>Decimal</th><th>Percent</th><th>Fraction</th><th>Decimal</th><th>Percent</th></tr></thead><tbody>' +
'<tr><td>' + fr(1, 2) + '</td><td>0.5</td><td>50%</td><td>' + fr(1, 5) + '</td><td>0.2</td><td>20%</td></tr>' +
'<tr><td>' + fr(1, 4) + '</td><td>0.25</td><td>25%</td><td>' + fr(1, 10) + '</td><td>0.1</td><td>10%</td></tr>' +
'<tr><td>' + fr(3, 4) + '</td><td>0.75</td><td>75%</td><td>' + fr(1, 20) + '</td><td>0.05</td><td>5%</td></tr>' +
'<tr><td>' + fr(1, 3) + '</td><td>0.333...</td><td>about 33.3%</td><td>' + fr(1, 8) + '</td><td>0.125</td><td>12.5%</td></tr>' +
'<tr><td>' + fr(2, 3) + '</td><td>0.666...</td><td>about 66.7%</td><td>' + fr(1, 100) + '</td><td>0.01</td><td>1%</td></tr></tbody></table></div>' +
A.yt({ q: 'Which is equal to 0.2?', type: 'mc', options: ['2%', fr(1, 2), '20%', fr(1, 20)], answer: 2, hint: '0.2 is 2 tenths, which is 20 hundredths.', explain: '0.2 = ' + fr(20, 100) + ' = 20% = ' + fr(1, 5) + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Converting any fraction</h2>' +
'<p>A fraction bar means divide. To change a fraction to a decimal, divide the top by the bottom. Then multiply by 100 to get the percent.</p>' +
'<div class="eg"><b class="t">Worked example</b><p class="math" style="font-size:1.15rem">' + fr(3, 8) + ' = 3 &divide; 8 = 0.375 = 37.5%</p><div class="fig">' + pbar(3, 8) + '</div></div>' +
'<div class="vs"><div><b class="t">Decimal to percent</b><p>&times; 100: move the point 2 places <b>right</b>.</p><p>0.375 &rarr; 37.5%</p></div><div><b class="t">Percent to decimal</b><p>&divide; 100: move the point 2 places <b>left</b>.</p><p>8% &rarr; 0.08 (not 0.8)</p></div></div>' +
'<div class="lab"><span class="lt">Try it: any fraction as a percent</span>' +
'<div class="ctrl"><label for="cvn">Top<input type="number" id="cvn" min="0" max="40" value="5"></label><label for="cvd">Bottom<input type="number" id="cvd" min="1" max="40" value="8"></label></div>' +
'<div class="fig" id="cvfig"></div><div class="out" id="cvout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>5% is 0.05, not 0.5. A one-digit percent needs a zero after the decimal point.</p></div>' +
A.yt({ q: 'Write ' + fr(7, 20) + ' as a percent.', answer: 35, unit: '%', hint: 'Multiply top and bottom by 5 to get hundredths.', explain: fr(7, 20) + ' = ' + fr(35, 100) + ' = 35%.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Quick percent changes in your head</h2>' +
'<p>A few percents are easy to find mentally. Build the others from them.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Percent</th><th class="l">How to find it</th><th>Of 240</th></tr></thead><tbody>' +
'<tr><td class="l">100%</td><td class="l">the whole amount</td><td>240</td></tr><tr><td class="l">50%</td><td class="l">half: &divide; 2</td><td>120</td></tr><tr><td class="l">25%</td><td class="l">a quarter: &divide; 4, or half of 50%</td><td>60</td></tr>' +
'<tr><td class="l">10%</td><td class="l">&divide; 10</td><td>24</td></tr><tr><td class="l">5%</td><td class="l">half of 10%</td><td>12</td></tr><tr><td class="l">1%</td><td class="l">&divide; 100</td><td>2.4</td></tr></tbody></table></div>' +
'<p>To <b>increase</b> by a percent, add that part on. To <b>decrease</b>, take it away.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>A $80 jacket is 25% off. 25% of 80 is 80 &divide; 4 = 20. New price: 80 &minus; 20 = <b>$60</b>.</p><div class="fig">' + change(80, 25, false) + '</div></div>' +
'<div class="lab"><span class="lt">Try it: increase or decrease</span>' +
'<div class="ctrl"><label for="pcn">Start number<input type="number" id="pcn" min="1" max="10000" value="60"></label><label for="pcp">Percent<select id="pcp"><option>1</option><option>5</option><option selected>10</option><option>25</option><option>50</option><option>100</option></select></label>' +
'<label for="pcu">Change<select id="pcu"><option value="1">increase</option><option value="0">decrease</option></select></label></div>' +
'<div class="fig" id="pcfig"></div><div class="out" id="pcout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Increasing by 100% <b>doubles</b> a number. Decreasing by 100% leaves <b>zero</b>.</p></div>' +
A.yt({ q: 'Increase 70 by 5%.', answer: 73.5, hint: '10% of 70 is 7. 5% is half of that.', explain: '5% of 70 = 3.5. 70 + 3.5 = 73.5.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Ratios and rates</h2>' +
'<p>A <b>ratio</b> compares two amounts of the same kind: 2 cups of juice to 3 cups of water is <b>2 : 3</b>. A <b>rate</b> compares different kinds: 150 km in 2 h, or $4 for 500 g.</p>' +
'<div class="fig">' + dline(2, 3, 5, 'Juice', 'Water', 3) + '</div>' +
'<p>A double number line keeps the two amounts lined up. Each jump adds another 2 cups of juice and 3 cups of water. For 6 cups of juice you need 9 cups of water.</p>' +
'<div class="key"><b class="t">Key idea: the unit rate</b><p>A <b>unit rate</b> is the amount for 1. $4.20 for 6 muffins is 4.20 &divide; 6 = <b>$0.70 per muffin</b>. Unit rates make fair comparisons easy.</p></div>' +
'<div class="eg"><b class="t">Worked example: the better buy</b><p>Cereal A: 500 g for $4.50. Cereal B: 750 g for $6.00.</p><p>A: 4.50 &divide; 5 = $0.90 per 100 g. B: 6.00 &divide; 7.5 = $0.80 per 100 g. <b>B is the better buy.</b></p></div>' +
'<div class="lab"><span class="lt">Try it: compare two sizes</span>' +
'<div class="ctrl"><label for="bua">Size A (g)<input type="number" id="bua" min="50" max="5000" value="500"></label><label for="bupa">Price A ($)<input type="number" id="bupa" min="0.1" max="100" step="0.01" value="4.50"></label></div>' +
'<div class="ctrl"><label for="bub">Size B (g)<input type="number" id="bub" min="50" max="5000" value="750"></label><label for="bupb">Price B ($)<input type="number" id="bupb" min="0.1" max="100" step="0.01" value="6.00"></label></div>' +
'<div class="out" id="buout"></div></div>' +
A.yt({ q: 'A car goes 240 km in 3 h. What is its speed in km per hour?', answer: 80, unit: 'km/h', hint: 'Find the distance for 1 hour.', explain: '240 &divide; 3 = 80 km/h.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Proportional or not?</h2>' +
'<p>Two amounts are <b>proportional</b> if one is always the same multiple of the other. Double one and the other doubles. On a graph, the points make a straight line that starts at <b>0</b>.</p>' +
'<div class="fig">' + graph([{ m: 2, c: 0, col: 'var(--sb)', lab: 'Per km: $2/km' }, { m: 1.5, c: 4, col: 'var(--se)', lab: 'Taxi: $4 + $1.50/km' }], 10, 25, 'distance (km)', 'cost ($)') + '</div>' +
'<div class="vs"><div><b class="t">Proportional</b><p>Bike rental: $2 per km. 0 km costs $0. 5 km costs $10, 10 km costs $20.</p><p>Line starts at 0.</p></div><div><b class="t">Not proportional</b><p>Taxi: $4 to start, then $1.50 per km. 10 km costs $19, not twice the cost of 5 km ($11.50).</p><p>Line starts at 4.</p></div></div>' +
'<div class="eg"><b class="t">Worked example: solve a proportion</b><p>3 kg of apples cost $7.50. How much do 5 kg cost? Unit rate: 7.50 &divide; 3 = $2.50 per kg. 5 kg: 5 &times; 2.50 = <b>$12.50</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: change the start fee</span>' +
'<div class="ctrl"><label for="ppm">Cost per km: <output id="ppmo"></output><input type="range" id="ppm" min="0.5" max="3" step="0.5" value="1.5"></label><label for="ppc">Start fee: <output id="ppco"></output><input type="range" id="ppc" min="0" max="8" value="4"></label></div>' +
'<div class="fig" id="ppfig"></div><div class="out" id="ppout"></div></div>' +
A.yt({ q: 'Which situation is proportional?', type: 'mc', options: ['A gym: $20 to join, then $10 a month', 'Notebooks at $3 each', 'A phone plan: $15 a month plus $0.10 a text'], answer: 1, hint: 'Which one costs $0 when you buy nothing?', explain: 'Notebooks: 0 cost $0, 1 costs $3, 2 cost $6. Always 3 times. The others have a starting fee.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.bind(root, ['hgr'], function () {
        var n = +$('#hgr', root).value, g = gcd(n, 100) || 100;
        $('#hgo', root).textContent = n;
        $('#hgfig', root).innerHTML = hgrid(n);
        $('#hgout', root).innerHTML = '<p class="big2">' + n + '%</p><p><b>Fraction:</b> ' + fr(n, 100) + (g > 1 && n ? ' = ' + frs(n, 100) : '') + '</p><p><b>Decimal:</b> ' + dec(n / 100) + '</p><p><b>In words:</b> ' + n + ' out of every 100.</p>';
      });
      A.bind(root, ['cvn', 'cvd'], function () {
        var n = Math.max(0, Math.min(40, parseInt($('#cvn', root).value, 10) || 0)), d = Math.max(1, Math.min(40, parseInt($('#cvd', root).value, 10) || 1)), x = n / d;
        var dstr = Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-9 ? dec(x) : x.toFixed(4) + '...';
        $('#cvfig', root).innerHTML = n <= d ? pbar(n, d) : '<p class="t2">More than one whole: more than 100%.</p>';
        $('#cvout', root).innerHTML = '<p class="big2">' + fr(n, d) + ' = ' + n + ' &divide; ' + d + ' = ' + dstr + '</p><p>As a percent: ' + dstr.replace('...', '') + ' &times; 100 = <b>' + (dstr.indexOf('...') > 0 ? 'about ' + (Math.round(x * 1000) / 10) : dec(x * 100)) + '%</b></p>';
      });
      A.bind(root, ['pcn', 'pcp', 'pcu'], function () {
        var n = Math.max(1, Math.min(10000, parseFloat($('#pcn', root).value) || 1)), p = +$('#pcp', root).value, up = $('#pcu', root).value === '1', part = cl(n * p / 100), res = cl(up ? n + part : n - part);
        var how = { 1: n + ' &divide; 100', 5: 'half of 10%: ' + dec(n / 10) + ' &divide; 2', 10: n + ' &divide; 10', 25: n + ' &divide; 4', 50: n + ' &divide; 2', 100: 'the whole number' }[p];
        $('#pcfig', root).innerHTML = change(n, p, up);
        $('#pcout', root).innerHTML = '<p>' + p + '% of ' + fmt(n) + ' = ' + how + ' = <b>' + fmt(part) + '</b></p><p class="big2">' + fmt(n) + (up ? ' + ' : ' &minus; ') + fmt(part) + ' = ' + fmt(res) + '</p>';
      });
      A.bind(root, ['bua', 'bupa', 'bub', 'bupb'], function () {
        var a = parseFloat($('#bua', root).value) || 1, pa = parseFloat($('#bupa', root).value) || 0, b = parseFloat($('#bub', root).value) || 1, pb = parseFloat($('#bupb', root).value) || 0;
        var ua = pa / a * 100, ub = pb / b * 100;
        $('#buout', root).innerHTML = '<p><b>A:</b> $' + pa.toFixed(2) + ' &divide; ' + dec(a / 100) + ' = <b>$' + ua.toFixed(2) + ' per 100 g</b></p><p><b>B:</b> $' + pb.toFixed(2) + ' &divide; ' + dec(b / 100) + ' = <b>$' + ub.toFixed(2) + ' per 100 g</b></p>' +
          '<p class="big2">' + (Math.abs(ua - ub) < 0.005 ? 'Same value' : (ua < ub ? 'A' : 'B') + ' is the better buy') + '</p>';
      });
      A.bind(root, ['ppm', 'ppc'], function () {
        var m = +$('#ppm', root).value, c = +$('#ppc', root).value;
        $('#ppmo', root).textContent = '$' + m.toFixed(2); $('#ppco', root).textContent = '$' + c;
        $('#ppfig', root).innerHTML = graph([{ m: m, c: c, col: c ? 'var(--se)' : 'var(--sb)', lab: '$' + c + ' + $' + m.toFixed(2) + '/km' }], 10, 40, 'distance (km)', 'cost ($)');
        var c5 = c + 5 * m, c10 = c + 10 * m;
        $('#ppout', root).innerHTML = '<p>5 km costs $' + c5.toFixed(2) + '. 10 km costs $' + c10.toFixed(2) + '.</p><p class="big2">' + (c === 0 ? 'Proportional' : 'Not proportional') + '</p><p>' + (c === 0 ? 'Double the distance, double the cost. The line starts at 0.' : 'Double the distance does not double the cost ($' + (2 * c5).toFixed(2) + ' &ne; $' + c10.toFixed(2) + '), because of the $' + c + ' start fee.') + '</p>';
      });
    },

    quiz: [
      { q: 'Which is <b>not</b> equal to the others?', type: 'mc', options: [fr(3, 5), '0.6', '60%', '0.06'], answer: 3, hint: 'Change each to a percent.', explain: fr(3, 5) + ' = 0.6 = 60%. But 0.06 = 6%.' },
      { q: 'Write ' + fr(5, 8) + ' as a percent.', type: 'num', answer: 62.5, unit: '%', hint: 'Divide 5 by 8, then multiply by 100.', explain: '5 &divide; 8 = 0.625 = 62.5%.' },
      { q: 'What is 25% of 360?', type: 'num', answer: 90, hint: '25% is one quarter.', explain: '360 &divide; 4 = 90.' },
      { q: 'A $45 game is on sale for 10% off. What is the sale price?', type: 'num', unit: '$', answer: 40.5, hint: '10% of 45 is 4.50.', explain: '45 &minus; 4.50 = $40.50.' },
      { q: 'A recipe uses 2 cups of flour for every 3 eggs. How many cups of flour for 12 eggs?', type: 'num', answer: 8, unit: 'cups', fig: dline(2, 3, 4, 'Flour', 'Eggs', 4), hint: '12 eggs is how many groups of 3?', explain: '12 &divide; 3 = 4 groups. 4 &times; 2 = 8 cups.' },
      { q: 'Which is the better buy?', type: 'mc', options: ['6 L of milk for $7.98', '4 L of milk for $5.56', 'They cost the same per litre'], answer: 0, hint: 'Find the price for 1 L of each.', explain: '7.98 &divide; 6 = $1.33 per litre. 5.56 &divide; 4 = $1.39 per litre. The 6 L is cheaper per litre.' },
      { q: 'A plumber charges $60 to come and $45 per hour. Is the cost proportional to the time?', type: 'mc', options: ['Yes, because the cost goes up by $45 each hour', 'No, because 0 hours still costs $60', 'Yes, because it is a straight line'], answer: 1, hint: 'What does 0 hours cost?', explain: 'A proportional cost would be $0 for 0 hours. The $60 call fee means it is not proportional.' }
    ],

    practice: [
      { id: 'pr-fdp', name: 'Convert fractions, decimals, percents', code: 'B1.7', gen: function (lv) {
        var t = R.int(0, 2), n, d;
        if (lv === 1) { var e = R.pick(EQ.slice(0, 9).concat([[1, 10], [7, 10], [9, 10], [1, 20]]).filter(function (q) { return q[1] % 3; })); n = e[0]; d = e[1]; }
        else if (lv === 2) { d = R.pick([4, 5, 10, 20, 25, 50]); n = R.int(1, d - 1); }
        else { d = R.pick([8, 16, 40, 80, 200, 125]); n = R.int(1, d - 1); if (d === 125 || d === 200) n = R.int(1, 30); }
        var p = pctOf(n, d), x = cl(n / d);
        if (t === 0) return { q: 'Write ' + fr(n, d) + ' as a percent.', type: 'num', answer: p, unit: '%', tol: 1e-6, fig: lv === 1 ? hgrid(p) : '',
          hint: 'Divide ' + n + ' by ' + d + ', then multiply by 100.', steps: [n + ' &divide; ' + d + ' = ' + dec(x) + '.', dec(x) + ' &times; 100 = ' + dec(p) + '.', 'So ' + fr(n, d) + ' = ' + dec(p) + '%.'], explain: fr(n, d) + ' = ' + dec(x) + ' = ' + dec(p) + '%.' };
        if (t === 1) return { q: 'Write ' + dec(p) + '% as a decimal.', type: 'num', answer: x,
          hint: 'Divide by 100: move the decimal point 2 places left.', steps: ['Percent means out of 100.', dec(p) + ' &divide; 100: move the point 2 places left.', dec(p) + '% = ' + dec(x) + '.'], explain: dec(p) + '% = ' + dec(x) + '.' };
        var P = Math.pow(10, (dec(x).split('.')[1] || '').length);
        var o = R.mc(frs(n, d), [frs(n * 10 === Math.round(n * 10) ? n : n, d * 10), fr(Math.round(p), 10).replace(/<span>10<\/span>/, '<span>10</span>'), fr(d, n * 2 > d ? n : n + 1)].filter(function (v) { return v !== frs(n, d); }));
        return { q: 'Which fraction in simplest form equals ' + dec(x) + '?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Read ' + dec(x) + ' as a fraction: ' + dec(x) + ' = ' + fr(Math.round(x * P), P) + '. Then simplify.',
          steps: [dec(x) + ' = ' + fr(Math.round(x * P), P) + '.', 'The GCF of ' + Math.round(x * P) + ' and ' + fmt(P) + ' is ' + gcd(Math.round(x * P), P) + '.', 'Simplest form: ' + frs(n, d) + '.'], explain: dec(x) + ' = ' + frs(n, d) + '.' };
      } },
      { id: 'pr-facts', name: 'Equivalents to know', code: 'B2.2', gen: function (lv) {
        var pool = lv === 1 ? EQ.slice(0, 5).concat([[1, 10], [1, 5]]) : EQ, e = R.pick(pool), p = pctOf(e[0], e[1]), x = cl(e[0] / e[1]);
        var ps = function (v) { return Math.abs(v - Math.round(v * 10) / 10) < 1e-9 ? dec(v) + '%' : 'about ' + (Math.round(v * 10) / 10) + '%'; };
        var others = R.shuffle(EQ.filter(function (f) { return f[0] / f[1] !== e[0] / e[1]; })).slice(0, 3);
        if (R.int(0, 1)) {
          var o = R.mc(ps(p), others.map(function (f) { return ps(pctOf(f[0], f[1])); }).concat([dec(e[0] * 10 + e[1]) + '%']));
          return { q: 'What percent is ' + fr(e[0], e[1]) + '?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Picture ' + fr(e[0], e[1]) + ' of a hundred grid.', steps: ['Think: what part of 100 is ' + fr(e[0], e[1]) + '?', '100 &times; ' + fr(e[0], e[1]) + ' = ' + dec(Math.round(p * 10) / 10) + '.', fr(e[0], e[1]) + ' = ' + ps(p) + '.'], explain: fr(e[0], e[1]) + ' = ' + (e[1] === 3 ? '0.' + (e[0] === 1 ? '333' : '666') + '...' : dec(x)) + ' = ' + ps(p) + '.' };
        }
        var o2 = R.mc(fr(e[0], e[1]), others.map(function (f) { return fr(f[0], f[1]); }));
        return { q: 'Which fraction equals ' + ps(p).replace('about ', '') + (e[1] === 3 ? ' (rounded)' : '') + '?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Change each fraction to a percent in your head.', steps: ['Go through the equivalents you know.', fr(e[0], e[1]) + ' = ' + ps(p) + '.', 'So the answer is ' + fr(e[0], e[1]) + '.'], explain: ps(p) + ' is ' + fr(e[0], e[1]) + '.' };
      } },
      { id: 'pr-mental', name: 'Percent increase and decrease', code: 'B2.3', gen: function (lv) {
        var p = lv === 1 ? R.pick([10, 50, 100]) : R.pick([1, 5, 10, 25, 50, 100]), n = lv === 1 ? R.int(2, 30) * 10 : R.int(4, 80) * (p === 25 ? 4 : p === 5 || p === 1 ? 20 : 10);
        var up = R.int(0, 1) === 1;
        if (p === 100 && !up) up = true;
        var part = cl(n * p / 100), res = cl(up ? n + part : n - part);
        var how = { 1: n + ' &divide; 100 = ' + dec(part), 5: '10% is ' + dec(n / 10) + ', and half of that is ' + dec(part), 10: n + ' &divide; 10 = ' + dec(part), 25: n + ' &divide; 4 = ' + dec(part), 50: n + ' &divide; 2 = ' + dec(part), 100: '100% is all of it: ' + n }[p];
        if (lv === 3) {
          var item = R.pick(['jacket', 'bike', 'pair of skates', 'video game']), q;
          q = up ? 'The price of a $' + n + ' ' + item + ' goes up ' + p + '%. What is the new price?' : 'A $' + n + ' ' + item + ' is ' + p + '% off. What is the sale price?';
          return { q: q, type: 'num', unit: '$', answer: res, fig: change(n, p, up), hint: 'Find ' + p + '% of ' + n + ' first, then ' + (up ? 'add it on.' : 'take it away.'),
            steps: [p + '% of ' + n + ': ' + how + '.', (up ? n + ' + ' : n + ' &minus; ') + dec(part) + ' = ' + dec(res) + '.'], explain: 'The ' + (up ? 'new' : 'sale') + ' price is $' + res.toFixed(2) + '.' };
        }
        return { q: (up ? 'Increase ' : 'Decrease ') + n + ' by ' + p + '%.', type: 'num', answer: res, fig: lv === 1 ? change(n, p, up) : '',
          hint: 'Find ' + p + '% of ' + n + ' first.', steps: [p + '% of ' + n + ': ' + how + '.', (up ? 'Add it: ' + n + ' + ' : 'Subtract it: ' + n + ' &minus; ') + dec(part) + ' = ' + dec(res) + '.'], explain: n + (up ? ' increased' : ' decreased') + ' by ' + p + '% is ' + dec(res) + '.' };
      } },
      { id: 'pr-unit', name: 'Unit rates and better buys', code: 'B2.10', gen: function (lv) {
        if (lv === 3) {
          var u1 = R.int(60, 140) / 100, u2 = u1 + R.pick([-1, 1]) * R.int(4, 15) / 100, q1 = R.pick([2, 3, 4, 5]), q2 = R.pick([6, 8, 10, 12]), p1 = cl(Math.round(u1 * q1 * 100) / 100), p2 = cl(Math.round(u2 * q2 * 100) / 100);
          var r1 = p1 / q1, r2 = p2 / q2, best = r1 < r2 ? 0 : 1, unit = R.pick(['cans of juice', 'granola bars', 'L of water']);
          var o = R.mc(best ? q2 + ' ' + unit + ' for $' + p2.toFixed(2) : q1 + ' ' + unit + ' for $' + p1.toFixed(2), [best ? q1 + ' ' + unit + ' for $' + p1.toFixed(2) : q2 + ' ' + unit + ' for $' + p2.toFixed(2)]);
          return { q: 'Which is the better buy?', type: 'mc', options: o.options, answer: o.answer, hint: 'Find the price of 1 for each.',
            steps: ['$' + p1.toFixed(2) + ' &divide; ' + q1 + ' = $' + (Math.round(r1 * 1000) / 1000) + ' each.', '$' + p2.toFixed(2) + ' &divide; ' + q2 + ' = $' + (Math.round(r2 * 1000) / 1000) + ' each.', 'The lower unit price is the better buy.'],
            explain: 'Unit prices: $' + r1.toFixed(3) + ' and $' + r2.toFixed(3) + '. The ' + (best ? q2 : q1) + '-pack is cheaper for each one.' };
        }
        var k = R.int(2, 9), u = lv === 1 ? R.int(2, 15) : R.int(11, 99) / 10 * (R.int(0, 1) ? 10 : 1), tot = cl(u * k);
        var ctx = R.pick([['A car travels ' + dec(tot) + ' km in ' + k + ' h. What is its speed?', 'km/h'], ['A tap fills ' + dec(tot) + ' L in ' + k + ' min. How many litres per minute?', 'L/min'], [k + ' tickets cost $' + tot.toFixed(2) + '. What does one ticket cost?', '$']]);
        return { q: ctx[0], type: 'num', answer: cl(u), unit: ctx[1], hint: 'Divide to find the amount for 1.',
          steps: ['A unit rate is the amount for 1.', 'Divide: ' + (ctx[1] === '$' ? tot.toFixed(2) : dec(tot)) + ' &divide; ' + k + '.', '= ' + dec(u) + '.'], explain: dec(tot) + ' &divide; ' + k + ' = ' + dec(u) + (ctx[1] === '$' ? '' : ' ' + ctx[1]) + '.' };
      } },
      { id: 'pr-prop', name: 'Solve proportions', code: 'B2.10', gen: function (lv) {
        var a = R.int(2, 6), b = R.int(2, 9), k = R.int(2, lv === 1 ? 5 : 9), t;
        if (a === b) b++;
        if (lv === 3) {
          var u = R.int(15, 60) / 10, q1 = R.int(2, 5), q2 = R.int(6, 12), p1 = cl(u * q1), p2 = cl(u * q2), thing = R.pick(['kg of apples', 'm of fabric', 'L of paint']);
          return { q: q1 + ' ' + thing + ' cost $' + p1.toFixed(2) + '. How much do ' + q2 + ' ' + thing + ' cost?', type: 'num', unit: '$', answer: p2, hint: 'Find the cost of 1 first.',
            steps: ['Unit rate: $' + p1.toFixed(2) + ' &divide; ' + q1 + ' = $' + u.toFixed(2) + ' each.', q2 + ' &times; $' + u.toFixed(2) + ' = $' + p2.toFixed(2) + '.'], explain: q2 + ' cost $' + p2.toFixed(2) + '.' };
        }
        var ctx = R.pick([['cups of rice', 'cups of water', 'Rice', 'Water'], ['red tiles', 'blue tiles', 'Red', 'Blue'], ['teachers', 'students', 'Teachers', 'Students']]);
        if (ctx[0] === 'teachers') { a = 1; b = R.int(6, 12); }
        return { q: 'The ratio of ' + ctx[0] + ' to ' + ctx[1] + ' is ' + a + ' : ' + b + '. If there are ' + a * k + ' ' + ctx[0] + ', how many ' + ctx[1] + ' are there?', type: 'num', answer: b * k,
          fig: lv === 1 ? dline(a, b, k, ctx[2], ctx[3], k) : '',
          hint: a * k + ' is ' + a + ' times what?', steps: [a * k + ' &divide; ' + a + ' = ' + k + ', so there are ' + k + ' groups.', 'Each group has ' + b + ' ' + ctx[1] + '.', k + ' &times; ' + b + ' = ' + b * k + '.'],
          explain: a + ' : ' + b + ' = ' + a * k + ' : ' + b * k + '.' };
      } },
      { id: 'pr-isprop', name: 'Proportional or not', code: 'B2.10', gen: function (lv) {
        var m = R.int(2, 9), c = R.int(2, 12), yes = R.int(0, 1) === 1, xs = [1, 2, 3, 4], ys = xs.map(function (x) { return m * x + (yes ? 0 : c); });
        if (lv < 3) {
          var o = R.mc(yes ? 'Proportional' : 'Not proportional', [yes ? 'Not proportional' : 'Proportional']);
          var tbl = '<div class="tbl"><table><tbody><tr><th>Hours</th>' + xs.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr><tr><th>Pay ($)</th>' + ys.map(function (y) { return '<td>' + y + '</td>'; }).join('') + '</tr></tbody></table></div>';
          return { q: 'Is the pay proportional to the hours?', type: 'mc', options: o.options, answer: o.answer, fig: tbl,
            hint: 'Divide each pay by its hours. Are the answers all the same?',
            steps: ['Pay &divide; hours: ' + xs.map(function (x, i) { return dec(ys[i] / x); }).join(', ') + '.', yes ? 'They are all the same, ' + m + ', so pay = ' + m + ' &times; hours.' : 'They are not the same. There is a fixed $' + c + ' added.', yes ? 'Proportional.' : 'Not proportional.'],
            explain: yes ? 'Pay is always ' + m + ' times the hours.' : 'Pay = ' + m + ' &times; hours + ' + c + '. With 0 hours you would still get $' + c + '.' };
        }
        var opts = [['A $' + c + ' entry fee plus $' + m + ' a ride', false], ['$' + m + ' per kilogram', true], ['A $' + c + ' monthly fee plus $' + m + ' per hour', false], [m + ' km every hour at a steady speed', true], ['$' + c + ' to rent skates, whatever the time', false]];
        var right = R.pick(opts.filter(function (o) { return o[1]; })), wrong = R.shuffle(opts.filter(function (o) { return !o[1]; })).slice(0, 2).map(function (o) { return o[0]; });
        var o3 = R.mc(right[0], wrong);
        return { q: 'Which situation is proportional?', type: 'mc', options: o3.options, answer: o3.answer,
          hint: 'In a proportional situation, 0 of something costs or gives 0, and doubling one doubles the other.',
          steps: ['Ask: what does 0 cost or give?', 'A fixed fee or a flat price means it is not proportional.', 'Only "' + right[0] + '" is always the same multiple.'], explain: right[0] + ' is proportional.' };
      } }
    ]
  });
})();
