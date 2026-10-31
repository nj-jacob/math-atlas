(function () {
  var A = Atlas, R = A.R, F = A.fmt;
  function c2(x) { return Math.round(x * 100) / 100; }
  function m(x) { return '$' + c2(x).toFixed(2); }
  function cl(x) { return parseFloat(x.toPrecision(10)); }
  function pct(x) { return F(String(cl(x))) + '%'; }

  /* percent as hundred grids: each full grid is 100%; below 1% one square is zoomed into tenths */
  function grids(p) {
    var full = Math.floor(p / 100), part = cl(p - full * 100), n = full + (part > 0 ? 1 : 0), sz = 9, gw = sz * 10, gap = 14, s = '';
    n = Math.max(n, 1);
    var perRow = Math.min(n, 3), W = perRow * gw + (perRow - 1) * gap + 8;
    for (var g = 0; g < n; g++) {
      var gx = 4 + (g % 3) * (gw + gap), gy = 4 + Math.floor(g / 3) * (gw + gap), fill = g < full ? 100 : part;
      for (var i = 0; i < 100; i++) {
        var x = gx + (i % 10) * sz, y = gy + Math.floor(i / 10) * sz, on = i < Math.floor(fill), frac = i === Math.floor(fill) ? fill - Math.floor(fill) : 0;
        s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:' + (on ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--line)" stroke-width=".8"/>';
        if (frac > 0) s += '<rect x="' + x + '" y="' + y + '" width="' + (sz * frac).toFixed(2) + '" height="' + sz + '" style="fill:var(--accent)"/>';
      }
      s += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + gw + '" fill="none" style="stroke:var(--ink)" stroke-width="1.5"/>';
    }
    var H = Math.ceil(n / 3) * (gw + gap) + 4, extra = '';
    if (p < 1) {
      /* zoom into the first square: 10 strips of 0.1% */
      var zx = W + 30, zs = 120, tenths = Math.round(p * 10);
      extra += '<line x1="' + (4 + sz) + '" y1="4" x2="' + zx + '" y2="4" style="stroke:var(--ink2)" stroke-dasharray="3 3"/><line x1="' + (4 + sz) + '" y1="' + (4 + sz) + '" x2="' + zx + '" y2="' + (4 + zs) + '" style="stroke:var(--ink2)" stroke-dasharray="3 3"/>';
      for (var t = 0; t < 10; t++) extra += '<rect x="' + (zx + t * zs / 10) + '" y="4" width="' + zs / 10 + '" height="' + zs + '" style="fill:' + (t < tenths ? 'var(--accent)' : 'var(--card)') + ';stroke:var(--ink2)" stroke-width="1"/>';
      extra += '<text x="' + (zx + zs / 2) + '" y="' + (zs + 26) + '" text-anchor="middle" font-size="16">1 square = 1%</text><text x="' + (zx + zs / 2) + '" y="' + (zs + 46) + '" text-anchor="middle" font-size="16">1 strip = 0.1%</text>';
      W = zx + zs + 6; H = Math.max(H, zs + 52);
    }
    return A.svg(W, H, s + extra, pct(p) + ' shown on hundred grids. Each grid is 100 percent.' + (full ? ' ' + full + ' full grid' + (full > 1 ? 's' : '') + '.' : '') + (p < 1 ? ' Less than one square is shaded. The zoomed square is cut into 10 strips of 0.1 percent each.' : ''));
  }
  /* bar model for percent change: original 100% and new amount */
  function changeBar(orig, p, up) {
    var nw = up ? orig * (1 + p / 100) : orig * (1 - p / 100), max = Math.max(orig, nw), x0 = 70, W = 310, s = '';
    function w(v) { return W * v / max; }
    s += '<text x="' + (x0 - 8) + '" y="34" text-anchor="end" font-size="16" class="tb">before</text><rect x="' + x0 + '" y="14" width="' + w(orig) + '" height="30" style="fill:color-mix(in srgb,var(--strand) 35%,var(--card));stroke:var(--strand)"/>';
    s += '<text x="' + (x0 + w(orig) / 2) + '" y="35" text-anchor="middle" font-size="16" class="tb">100% = ' + m(orig) + '</text>';
    s += '<text x="' + (x0 - 8) + '" y="88" text-anchor="end" font-size="16" class="tb">after</text>';
    if (up) {
      s += '<rect x="' + x0 + '" y="68" width="' + w(orig) + '" height="30" style="fill:color-mix(in srgb,var(--strand) 35%,var(--card));stroke:var(--strand)"/><rect x="' + (x0 + w(orig)) + '" y="68" width="' + (w(nw) - w(orig)) + '" height="30" style="fill:color-mix(in srgb,var(--accent) 55%,var(--card));stroke:var(--accent)"/>';
      s += '<text x="' + (x0 + w(orig) + (w(nw) - w(orig)) / 2) + '" y="122" text-anchor="middle" font-size="15" style="fill:var(--accent)" class="tb">+' + pct(p) + '</text>';
    } else {
      s += '<rect x="' + x0 + '" y="68" width="' + w(nw) + '" height="30" style="fill:color-mix(in srgb,var(--strand) 35%,var(--card));stroke:var(--strand)"/><rect x="' + (x0 + w(nw)) + '" y="68" width="' + (w(orig) - w(nw)) + '" height="30" style="fill:none;stroke:var(--accent)" stroke-dasharray="4 3"/>';
      s += '<text x="' + Math.min(x0 + w(nw) + (w(orig) - w(nw)) / 2, 370) + '" y="122" text-anchor="middle" font-size="15" style="fill:var(--accent)" class="tb">&#8722;' + pct(p) + '</text>';
    }
    s += '<text x="' + (x0 + Math.min(w(nw), w(orig)) / 2) + '" y="89" text-anchor="middle" font-size="16" class="tb">' + pct(up ? 100 + p : 100 - p) + ' = ' + m(nw) + '</text>';
    return A.svg(400, 130, s, 'Bar model. Before: ' + m(orig) + ' is 100 percent. After a ' + (up ? 'rise' : 'drop') + ' of ' + p + ' percent, the new amount is ' + pct(up ? 100 + p : 100 - p) + ' of the original, which is ' + m(nw) + '.');
  }
  /* double number line for a proportion a:b = c:x */
  function dnl(a, b, c, top, bot, k) {
    var x0 = 30, x1 = 380, s = '', maxT = Math.max(a, c) * 1.1;
    top = top.replace(/<sup>2<\/sup>/g, '²'); bot = bot.replace(/<sup>2<\/sup>/g, '²');
    function X(v) { return x0 + (x1 - x0) * v / maxT; }
    s += '<text x="' + x0 + '" y="18" font-size="15" class="t2">' + top + '</text><text x="' + x0 + '" y="130" font-size="15" class="t2">' + bot + '</text>';
    s += '<line x1="' + x0 + '" y1="46" x2="' + x1 + '" y2="46" style="stroke:var(--strand)" stroke-width="2.5"/><line x1="' + x0 + '" y1="94" x2="' + x1 + '" y2="94" style="stroke:var(--accent)" stroke-width="2.5"/>';
    var pts = [[0, 0], [a, b], [c, cl(c * b / a)]];
    if (k) pts.splice(1, 0, [1, cl(b / a)]);
    pts.forEach(function (p, i) {
      var x = X(p[0]), last = i === pts.length - 1;
      s += '<line x1="' + x + '" y1="38" x2="' + x + '" y2="102" style="stroke:var(--ink2)" stroke-width="1.5"' + (i ? '' : '') + '/>' +
        '<text x="' + x + '" y="34" text-anchor="middle" font-size="17" class="tb">' + F(String(p[0])) + '</text>' +
        '<text x="' + x + '" y="118" text-anchor="middle" font-size="17" class="tb"' + (last ? ' style="fill:var(--accent)"' : '') + '>' + (last ? '?' : F(String(p[1]))) + '</text>';
    });
    s += '<text x="' + X((a + c) / 2) + '" y="74" text-anchor="middle" font-size="16" class="t2">&#215; ' + F(String(cl(c / a))) + ' on both lines</text>';
    return A.svg(400, 136, s, 'Double number line. ' + a + ' ' + top + ' goes with ' + b + ' ' + bot + '. Multiply both by ' + cl(c / a) + ' to find what goes with ' + c + '.');
  }
  /* unit price comparison bars */
  function unitBars(items) {
    var max = Math.max.apply(null, items.map(function (x) { return x.u; })), s = '', best = Math.min.apply(null, items.map(function (x) { return x.u; }));
    items.forEach(function (it, i) {
      var y = 10 + i * 56, w = 170 * it.u / max, win = it.u === best;
      s += '<text x="4" y="' + (y + 18) + '" font-size="16" class="tb">' + it.t + '</text>';
      s += '<rect x="4" y="' + (y + 26) + '" width="' + w + '" height="22" style="fill:' + (win ? 'color-mix(in srgb,var(--good) 45%,var(--card))' : 'color-mix(in srgb,var(--ink2) 25%,var(--card))') + ';stroke:' + (win ? 'var(--good)' : 'var(--ink2)') + '"/>';
      s += '<text x="' + (w + 12) + '" y="' + (y + 43) + '" font-size="16"' + (win ? ' class="tb"' : '') + '>' + it.l + (win ? ' &#10003; lower' : '') + '</text>';
    });
    return A.svg(400, 10 + items.length * 56, s, items.map(function (x) { return x.t + ' costs ' + x.l; }).join('. ') + '.');
  }

  var html =
'<section class="sec"><h2><span class="n">1</span>Percents above 100% and below 1%</h2>' +
'<p><b>Percent</b> means "out of 100". One full grid of 100 squares is 100%, the whole. More than one grid is <b>more than 100%</b>. Less than one square is <b>less than 1%</b>.</p>' +
'<div class="vrow"><figure><figcaption>135% = 1.35</figcaption>' + grids(135) + '</figure><figure><figcaption>0.4% = 0.004</figcaption>' + grids(0.4) + '</figure></div>' +
'<div class="tbl"><table><thead><tr><th>Percent</th><th>Decimal</th><th>Fraction</th></tr></thead><tbody>' +
'<tr><td>250%</td><td>2.5</td><td>5/2</td></tr><tr><td>135%</td><td>1.35</td><td>27/20</td></tr><tr><td>100%</td><td>1</td><td>1</td></tr><tr><td>12.5%</td><td>0.125</td><td>1/8</td></tr><tr><td>1%</td><td>0.01</td><td>1/100</td></tr><tr><td>0.4%</td><td>0.004</td><td>1/250</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Write 0.4% as a decimal and as a fraction.</p><ol><li>Percent means divide by 100. Move the digits 2 places right: 0.4 &divide; 100 = 0.004.</li><li>0.004 is 4 thousandths: ' + A.fr(4, 1000) + '.</li><li>Simplify: ' + A.fr(4, 1000) + ' = ' + A.fr(1, 250) + '.</li></ol></div>' +
A.yt({ q: 'Write 0.6% as a decimal.', a: 0.006, show: '0.006', back: 'Go back to step 1: percent means divide by 100. Move each digit 2 places to the right.', ok: '0.6 &divide; 100 = 0.006.' }) +
'<div class="lab"><span class="lt">Try it: percent on grids</span>' +
'<div class="ctrl"><label for="pgv">Percent<input type="number" id="pgv" min="0.1" max="300" step="0.1" value="135"></label></div>' +
'<div class="fig" id="pgfig"></div><div class="out" id="pgout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>0.5% is not one half. It is half of <b>one percent</b>: 0.005. One half is 50%.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Percent of an amount and percent change</h2>' +
'<p>To find a percent of an amount, change the percent to a decimal and multiply. For a change, use a <b>multiplier</b>: an increase of 13% means multiply by 1.13; a decrease of 15% means multiply by 0.85.</p>' +
'<div class="fig">' + changeBar(64, 15, false) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A jacket costs $64. It is 15% off. Then 13% HST is added. What do you pay?</p><ol><li>15% off leaves 85%: 64 &times; 0.85 = $54.40.</li><li>Adding 13% makes 113%: 54.40 &times; 1.13 = 61.472.</li><li>Round to the cent: you pay $61.47.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: increase or decrease</span>' +
'<div class="ctrl"><label for="pco">Starting amount ($)<input type="number" id="pco" min="1" max="1000" value="64"></label><label for="pcp">Percent<input type="number" id="pcp" min="0" max="200" value="15"></label>' +
'<label for="pcd">Change<select id="pcd"><option value="down">decrease</option><option value="up">increase</option></select></label></div>' +
'<div class="fig" id="pcfig"></div><div class="out" id="pcout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A plant grew from 40 cm to 58 cm. What was the percent increase?</p><ol><li>Change: 58 &minus; 40 = 18 cm.</li><li>Compare to the <b>original</b>: 18 &divide; 40 = 0.45.</li><li>0.45 = 45%. The plant grew 45%.</li></ol></div>' +
A.yt({ q: 'What is 250% of 18?', a: 45, back: 'Change 250% to a decimal first (divide by 100), then multiply by 18.', ok: '250% = 2.5, and 2.5 &times; 18 = 45.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Percent change is always compared to the <b>starting</b> amount. From 40 to 58 is 18 &divide; 40 = 45%, not 18 &divide; 58.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Ratios and proportions</h2>' +
'<p>A <b>proportion</b> says two ratios are equal. To find a missing value, find what you multiply by on one side and do the same on the other.</p>' +
'<div class="fig">' + dnl(3, 2, 7.5, 'cups of flour', 'cups of sugar') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A recipe uses 3 cups of flour for every 2 cups of sugar. How much sugar goes with 7.5 cups of flour?</p><ol><li>Write the proportion: 3 : 2 = 7.5 : ?</li><li>Flour went from 3 to 7.5, so it was multiplied by 7.5 &divide; 3 = 2.5.</li><li>Do the same to sugar: 2 &times; 2.5 = 5 cups.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: scale a ratio</span>' +
'<div class="ctrl"><label for="rpa">Flour (cups)<input type="number" id="rpa" min="1" max="20" step="0.5" value="3"></label><label for="rpb">Sugar (cups)<input type="number" id="rpb" min="1" max="20" step="0.5" value="2"></label><label for="rpc">New flour<input type="number" id="rpc" min="0.5" max="40" step="0.5" value="7.5"></label></div>' +
'<div class="fig" id="rpfig"></div><div class="out" id="rpout"></div></div>' +
A.yt({ q: 'Solve: 4 : 10 = ? : 25', a: 10, back: 'Go back to step 2: what do you multiply 10 by to get 25? Do the same to 4.', ok: '10 &times; 2.5 = 25, so 4 &times; 2.5 = 10.' }) +
'<div class="key"><b class="t">Key idea</b><p>Check that the situation really is proportional. Doubling the flour doubles the sugar. But doubling the number of people at a party does not double the time it takes to set up.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Rates and unit rates</h2>' +
'<p>A <b>rate</b> compares two different units, like km per hour or dollars per litre. A <b>unit rate</b> is the amount for exactly 1 unit. Unit rates make fair comparisons.</p>' +
'<div class="fig">' + unitBars([{ t: '750 g for $4.29', u: 4.29 / 7.5, l: '$0.57 per 100 g' }, { t: '1.2 kg for $6.49', u: 6.49 / 12, l: '$0.54 per 100 g' }]) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Which is the better buy: 750 g of cereal for $4.29, or 1.2 kg for $6.49?</p><ol><li>Use the same unit: 1.2 kg = 1200 g.</li><li>Price per 100 g: 4.29 &divide; 7.5 &asymp; $0.572 and 6.49 &divide; 12 &asymp; $0.541.</li><li>The 1.2 kg box costs less per 100 g, so it is the better buy (if you will use it all).</li></ol></div>' +
A.yt({ q: 'A 6 L jug of milk costs $8.70. What is the price per litre?', a: 1.45, unit: '$/L', show: '$1.45', back: 'A unit rate is the price for 1 unit. Divide the price by the number of litres.', ok: '8.70 &divide; 6 = $1.45 per litre.' }) +
'<div class="key"><b class="t">Key idea</b><p>Speed is a rate too. A car that goes 210 km in 2.5 h travels 210 &divide; 2.5 = 84 km/h.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Multi-step problems and order of operations</h2>' +
'<p>When a calculation has several steps, use the order of operations, often called <b>BEDMAS</b> in Canada:</p>' +
'<ul class="steplist"><li><b>B</b>rackets</li><li><b>E</b>xponents</li><li><b>D</b>ivision and <b>M</b>ultiplication, left to right</li><li><b>A</b>ddition and <b>S</b>ubtraction, left to right</li></ul>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out 2.5 + 3 &times; (4 &minus; 1.5)<sup>2</sup> &divide; 5.</p><ol><li>Brackets: 4 &minus; 1.5 = 2.5.</li><li>Exponent: 2.5<sup>2</sup> = 6.25.</li><li>Multiply and divide, left to right: 3 &times; 6.25 = 18.75, then 18.75 &divide; 5 = 3.75.</li><li>Add: 2.5 + 3.75 = 6.25.</li></ol></div>' +
A.yt({ q: 'Work out (&minus;2 + 5) &times; 1.5 &minus; 4 &divide; 0.5.', a: -3.5, show: '&minus;3.5', back: 'Go in BEDMAS order: brackets first, then the &times; and the &divide;, and subtract last.', ok: '(3) &times; 1.5 = 4.5 and 4 &divide; 0.5 = 8. Then 4.5 &minus; 8 = &minus;3.5.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>D and M have equal rank, as do A and S. Work left to right: 12 &divide; 3 &times; 2 = 4 &times; 2 = 8, not 12 &divide; 6 = 2.</p></div>' +
'</section>';

  var practice = [
    { id: 'pr-convert', name: 'Percent, decimal, fraction', code: 'B1.4', gen: function (lv) {
      var p, kind = R.int(0, 1);
      if (lv === 1) p = R.pick([5, 10, 20, 25, 40, 50, 75, 80]);
      else if (lv === 2) p = R.pick([110, 125, 150, 175, 200, 240, 300, 0.5, 0.2, 0.8]);
      else p = R.pick([0.25, 0.75, 0.05, 0.125, 112.5, 137.5, 0.35, 260]);
      var dec = cl(p / 100);
      if (kind === 0) return { q: 'Write <b>' + pct(p) + '</b> as a decimal.', type: 'num', answer: dec, show: F(String(dec)), fig: lv < 3 && p <= 300 ? grids(p) : '',
        hint: 'Percent means out of 100. Divide by 100: move every digit 2 places right.', steps: ['Divide ' + p + ' by 100.', 'Move the digits 2 places to the right.', pct(p) + ' = ' + F(String(dec)) + '.'], explain: pct(p) + ' = ' + F(String(dec)) + '.' };
      return { q: 'Write <b>' + F(String(dec)) + '</b> as a percent.', type: 'num', answer: p, unit: '%', show: pct(p),
        hint: 'Multiply by 100: move every digit 2 places left.', steps: ['Multiply ' + F(String(dec)) + ' by 100.', 'Move the digits 2 places to the left.', F(String(dec)) + ' = ' + pct(p) + '.'], explain: F(String(dec)) + ' = ' + pct(p) + '.' };
    } },
    { id: 'pr-of', name: 'Percent of an amount', code: 'B1.4', gen: function (lv) {
      var p = lv === 1 ? R.pick([10, 20, 25, 50, 75]) : lv === 2 ? R.pick([15, 35, 120, 150, 250]) : R.pick([0.5, 2.5, 12.5, 175, 0.8]);
      var n = lv === 1 ? R.int(2, 20) * 4 : R.int(4, 80) * 10, a = cl(p / 100 * n);
      return { q: 'What is <b>' + pct(p) + '</b> of ' + F(String(n)) + '?', type: 'num', answer: a, show: F(String(a)),
        hint: 'Change ' + pct(p) + ' to a decimal, then multiply by ' + n + '.', steps: [pct(p) + ' = ' + cl(p / 100) + '.', cl(p / 100) + ' &times; ' + F(String(n)) + ' = ' + F(String(a)) + '.', 'Check: ' + (p > 100 ? 'more than 100%, so the answer is more than ' + n + '.' : p < 1 ? 'less than 1%, so the answer is less than 1% of ' + n + ', which is ' + cl(n / 100) + '.' : 'less than 100%, so the answer is less than ' + n + '.')],
        explain: pct(p) + ' of ' + n + ' = ' + F(String(a)) + '.' };
    } },
    { id: 'pr-change', name: 'Percent change and tax', code: 'B2.1', gen: function (lv) {
      var price = R.int(12, 160), p = R.pick([10, 15, 20, 25, 30, 40]), t;
      if (lv === 1) { var up = R.int(0, 1), nw = c2(price * (up ? 1 + p / 100 : 1 - p / 100));
        return { q: 'A $' + price + ' item ' + (up ? 'goes up' : 'is on sale for') + ' ' + p + '%' + (up ? '' : ' off') + '. What is the new price?', type: 'num', unit: '$', answer: nw, tol: 0.005, show: m(nw), fig: changeBar(price, p, up),
          hint: (up ? 'An increase of ' + p + '% means multiply by ' + cl(1 + p / 100) : p + '% off leaves ' + (100 - p) + '%, so multiply by ' + cl(1 - p / 100)) + '.', steps: [(up ? '100% + ' + p + '% = ' + (100 + p) + '%' : '100% &minus; ' + p + '% = ' + (100 - p) + '%') + '.', price + ' &times; ' + cl(up ? 1 + p / 100 : 1 - p / 100) + ' = ' + nw + '.', 'The new price is ' + m(nw) + '.'], explain: 'The new price is ' + m(nw) + '.' }; }
      if (lv === 2) { var o = R.int(4, 40) * 5, d = R.pick([10, 20, 25, 30, 40, 50, 60, 75]), u2 = R.int(0, 1), n2 = u2 ? o * (1 + d / 100) : o * (1 - d / 100);
        t = u2 ? 'grew from' : 'dropped from';
        return { q: 'A population ' + t + ' ' + o + ' to ' + cl(n2) + '. What was the percent ' + (u2 ? 'increase' : 'decrease') + '?', type: 'num', unit: '%', answer: d, show: d + '%',
          hint: 'Find the change, then divide by the starting amount.', steps: ['Change: ' + Math.abs(cl(n2 - o)) + '.', 'Divide by the starting amount: ' + Math.abs(cl(n2 - o)) + ' &divide; ' + o + ' = ' + d / 100 + '.', d / 100 + ' = ' + d + '%.'], explain: Math.abs(cl(n2 - o)) + ' &divide; ' + o + ' = ' + d + '%.' }; }
      var after = c2(price * (1 - p / 100)), tot = c2(after * 1.13);
      return { q: 'A $' + price + ' game is ' + p + '% off. Then 13% HST is added. What is the total? Round to the cent.', type: 'num', unit: '$', answer: tot, tol: 0.011, show: m(tot),
        hint: 'Two multipliers: first &times; ' + cl(1 - p / 100) + ' for the sale, then &times; 1.13 for the tax.', steps: ['Sale price: ' + price + ' &times; ' + cl(1 - p / 100) + ' = ' + m(after) + '.', 'Add tax: ' + after.toFixed(2) + ' &times; 1.13 = ' + cl(after * 1.13) + '.', 'Round to the cent: ' + m(tot) + '.'], explain: 'Total: ' + m(tot) + '.' };
    } },
    { id: 'pr-prop', name: 'Solve a proportion', code: 'B2.8', gen: function (lv) {
      var a = R.int(2, 9), b = R.int(2, 9), k = lv === 1 ? R.int(2, 6) : lv === 2 ? R.pick([1.5, 2.5, 3.5, 4]) : R.pick([1.5, 2.5, 0.5, 1.25, 2.4]);
      while (a === b) b++;
      var c = cl(a * k), x = cl(b * k);
      var ctx = R.pick([['cups of rice', 'cups of water'], ['cm on the map', 'km on the ground'], ['red tiles', 'blue tiles'], ['L of paint', 'm' + '<sup>2</sup> covered']]);
      if (lv === 3 && R.int(0, 1)) return { q: 'Solve for <i>n</i>: <span class="math">' + A.fr(a, b) + ' = ' + A.fr(c, '<i>n</i>') + '</span>', type: 'num', answer: x, show: F(String(x)),
        hint: 'What do you multiply ' + a + ' by to get ' + c + '? Multiply ' + b + ' by the same.', steps: ['Top: ' + a + ' &times; ' + k + ' = ' + c + '.', 'Bottom: ' + b + ' &times; ' + k + ' = ' + x + '.', '<i>n</i> = ' + x + '. Check: ' + c + ' &divide; ' + x + ' = ' + a + ' &divide; ' + b + '.'], explain: '<i>n</i> = ' + x + '.' };
      return { q: 'The ratio of ' + ctx[0] + ' to ' + ctx[1] + ' is ' + a + ' : ' + b + '. How many ' + ctx[1] + ' go with ' + c + ' ' + ctx[0] + '?', type: 'num', answer: x, show: F(String(x)), fig: lv === 1 ? dnl(a, b, c, ctx[0], ctx[1]) : '',
        hint: 'Find what ' + a + ' was multiplied by to get ' + c + '. Multiply ' + b + ' by the same number.', steps: [a + ' &times; ? = ' + c + '. The multiplier is ' + c + ' &divide; ' + a + ' = ' + k + '.', b + ' &times; ' + k + ' = ' + x + '.', 'Answer: ' + x + ' ' + ctx[1] + '.'], explain: a + ' : ' + b + ' = ' + c + ' : ' + x + '.' };
    } },
    { id: 'pr-rate', name: 'Unit rates and best buys', code: 'B2.8', gen: function (lv) {
      if (lv === 1) { var q = R.int(2, 12), u = R.int(11, 99) / 10 * 1, tot = c2(q * u);
        return { q: q + ' L of juice cost $' + tot.toFixed(2) + '. What is the price per litre?', type: 'num', unit: '$', answer: c2(tot / q), tol: 0.006, show: m(tot / q),
          hint: 'Divide the cost by the number of litres.', steps: ['Price for 1 L = cost &divide; litres.', tot.toFixed(2) + ' &divide; ' + q + ' = ' + c2(tot / q).toFixed(2) + '.', 'Unit rate: ' + m(tot / q) + ' per L.'], explain: m(tot / q) + ' per litre.' }; }
      if (lv === 2) { var h = R.pick([2, 2.5, 3, 4, 1.5]), sp = R.int(8, 24) * 5, d = cl(sp * h);
        return { q: 'A train travels ' + d + ' km in ' + h + ' h. What is its average speed in km/h?', type: 'num', unit: 'km/h', answer: sp, tol: 0.05, show: F(String(c2(sp))) + ' km/h',
          hint: 'Speed = distance &divide; time.', steps: ['Speed = ' + d + ' &divide; ' + h + '.', '= ' + c2(sp) + ' km/h.'], explain: d + ' &divide; ' + h + ' = ' + c2(sp) + ' km/h.' }; }
      var g1 = R.pick([300, 400, 500, 750]), g2 = R.pick([1000, 1200, 1500, 2000]), p1 = R.int(250, 600) / 100, p2;
      do { p2 = R.int(500, 1500) / 100; } while (Math.abs(p1 / g1 - p2 / g2) < 0.00003 || Math.abs(p1 / g1 - p2 / g2) * 100 < 0.01);
      var u1 = p1 / g1 * 100, u2 = p2 / g2 * 100, best = u1 < u2 ? 0 : 1;
      var opts = [g1 + ' g for $' + p1.toFixed(2), (g2 / 1000) + ' kg for $' + p2.toFixed(2)];
      return { q: 'Which is the better buy?', type: 'mc', options: opts, answer: best, fig: unitBars([{ t: opts[0], u: u1, l: '' }, { t: opts[1], u: u2, l: '' }]).replace(/ &#10003; lower/, '').replace(/style="fill:color-mix\(in srgb,var\(--good\) 45%,var\(--card\)\);stroke:var\(--good\)"/, 'style="fill:color-mix(in srgb,var(--ink2) 25%,var(--card));stroke:var(--ink2)"'),
        hint: 'Change kg to g, then find the price per 100 g for each.', steps: [(g2 / 1000) + ' kg = ' + g2 + ' g.', 'Per 100 g: $' + p1.toFixed(2) + ' &divide; ' + g1 / 100 + ' &asymp; $' + u1.toFixed(3) + ' and $' + p2.toFixed(2) + ' &divide; ' + g2 / 100 + ' &asymp; $' + u2.toFixed(3) + '.', 'The lower unit price wins: ' + opts[best] + '.'], explain: 'Per 100 g: $' + u1.toFixed(3) + ' vs $' + u2.toFixed(3) + '. ' + opts[best] + ' is the better buy.' };
    } },
    { id: 'pr-order', name: 'Order of operations', code: 'B2.1', gen: function (lv) {
      var a = R.int(2, 9), b = R.int(2, 6), c = R.int(1, 5), d = R.pick([0.5, 1.5, 2.5]), v, q, st;
      var t = lv === 1 ? R.int(0, 1) : lv === 2 ? R.int(1, 3) : R.int(3, 5);
      if (t === 0) { v = a + b * c; q = a + ' + ' + b + ' &times; ' + c; st = ['Multiply first: ' + b + ' &times; ' + c + ' = ' + b * c + '.', 'Then add: ' + a + ' + ' + b * c + ' = ' + v + '.']; }
      else if (t === 1) { v = (a + b) * c; q = '(' + a + ' + ' + b + ') &times; ' + c; st = ['Brackets: ' + a + ' + ' + b + ' = ' + (a + b) + '.', 'Multiply: ' + (a + b) + ' &times; ' + c + ' = ' + v + '.']; }
      else if (t === 2) { var e = b * c * 2; v = e / b * 2; q = e + ' &divide; ' + b + ' &times; 2'; st = ['&divide; and &times; have equal rank: go left to right.', e + ' &divide; ' + b + ' = ' + e / b + ', then &times; 2 = ' + v + '.']; }
      else if (t === 3) { v = cl(a + d * d * b); q = a + ' + ' + d + '<sup>2</sup> &times; ' + b; st = ['Exponent: ' + d + '<sup>2</sup> = ' + cl(d * d) + '.', 'Multiply: ' + cl(d * d) + ' &times; ' + b + ' = ' + cl(d * d * b) + '.', 'Add: ' + a + ' + ' + cl(d * d * b) + ' = ' + v + '.']; }
      else if (t === 4) { v = cl((c - a) * d - b); q = '(' + c + ' &minus; ' + a + ') &times; ' + d + ' &minus; ' + b; st = ['Brackets: ' + c + ' &minus; ' + a + ' = ' + A.neg(c - a) + '.', 'Multiply: ' + A.neg(c - a) + ' &times; ' + d + ' = ' + A.neg(cl((c - a) * d)) + '.', 'Subtract: ' + A.neg(cl((c - a) * d)) + ' &minus; ' + b + ' = ' + A.neg(v) + '.']; }
      else { v = cl(a * 2 / 0.5 - (b - c) * (b - c)); q = a * 2 + ' &divide; 0.5 &minus; (' + b + ' &minus; ' + c + ')<sup>2</sup>'; st = ['Brackets: ' + b + ' &minus; ' + c + ' = ' + (b - c) + '.', 'Exponent: ' + A.neg(b - c) + '<sup>2</sup> = ' + (b - c) * (b - c) + '.', 'Divide: ' + a * 2 + ' &divide; 0.5 = ' + a * 4 + '.', 'Subtract: ' + a * 4 + ' &minus; ' + (b - c) * (b - c) + ' = ' + A.neg(v) + '.']; }
      return { q: 'Work out <span class="math">' + q + '</span>.', type: 'num', answer: v, show: A.neg(v),
        hint: 'BEDMAS: brackets, exponents, then &divide; and &times; left to right, then + and &minus;.', steps: st, explain: 'The answer is ' + A.neg(v) + '.' };
    } }
  ];

  var quiz = [
    { q: 'Write 0.3% as a decimal.', type: 'mc', options: ['0.003', '0.03', '0.3', '3'], answer: 0, hint: 'Divide by 100: move the digits 2 places right.', explain: '0.3 &divide; 100 = 0.003.' },
    { q: 'What is 140% of 35?', type: 'num', answer: 49, hint: '140% = 1.4.', explain: '1.4 &times; 35 = 49. More than 100%, so the answer is more than 35.' },
    { q: 'A bike costs $380. It is 25% off. What is the sale price?', type: 'num', unit: '$', answer: 285, tol: 0.005, show: '$285.00', hint: '25% off leaves 75%. Multiply by 0.75.', explain: '380 &times; 0.75 = $285.' },
    { q: 'A town grew from 12 000 to 15 000 people. What was the percent increase?', type: 'num', unit: '%', answer: 25, hint: 'Change &divide; starting amount.', explain: '3000 &divide; 12 000 = 0.25 = 25%.' },
    { q: 'A map scale is 2 cm : 5 km. Two towns are 9 cm apart on the map. How far apart are they?', type: 'num', unit: 'km', answer: 22.5, hint: '2 was multiplied by 4.5 to get 9. Do the same to 5.', explain: '9 &divide; 2 = 4.5, and 5 &times; 4.5 = 22.5 km.' },
    { q: 'Which is the better buy?', type: 'mc', options: ['12 eggs for $4.20', '30 eggs for $9.90'], answer: 1, hint: 'Find the price per egg for each.', explain: '4.20 &divide; 12 = $0.35 per egg. 9.90 &divide; 30 = $0.33 per egg. The 30-pack is cheaper per egg.' },
    { q: 'Work out 18 &divide; (4 &minus; 1) &times; 0.5<sup>2</sup>.', type: 'num', answer: 1.5, hint: 'Brackets, then the exponent, then &divide; and &times; left to right.', explain: '4 &minus; 1 = 3; 0.5<sup>2</sup> = 0.25; 18 &divide; 3 = 6; 6 &times; 0.25 = 1.5.' }
  ];

  A.register('percent-ratio', {
    fx: { c2: c2, m: m, cl: cl, pct: pct, grids: grids, changeBar: changeBar, dnl: dnl, unitBars: unitBars },
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      A.bind(root, ['pgv'], function () {
        var p = +$('#pgv').value;
        if (!(p >= 0.1 && p <= 300)) { $('#pgfig').innerHTML = ''; $('#pgout').innerHTML = 'Type a percent from 0.1 to 300.'; return; }
        p = Math.round(p * 10) / 10;
        $('#pgfig').innerHTML = grids(p);
        var dec = cl(p / 100);
        $('#pgout').innerHTML = '<span class="big">' + pct(p) + ' = ' + F(String(dec)) + '</span><br>' + (p > 100 ? 'More than one whole: ' + Math.floor(p / 100) + ' full grid' + (p >= 200 ? 's' : '') + ' and some more.' : p < 1 ? 'Less than one square of the grid.' : p === 100 ? 'Exactly one whole.' : 'Part of one whole.');
      });
      A.bind(root, ['pco', 'pcp', 'pcd'], function () {
        var o = +$('#pco').value, p = +$('#pcp').value, up = $('#pcd').value === 'up';
        if (!(o > 0 && o <= 10000) || !(p >= 0 && p <= 200) || (!up && p > 100)) { $('#pcfig').innerHTML = ''; $('#pcout').innerHTML = 'Use an amount above 0 and a percent from 0 to 200 (a decrease can be at most 100%).'; return; }
        var mult = cl(up ? 1 + p / 100 : 1 - p / 100), nw = o * mult;
        $('#pcfig').innerHTML = changeBar(o, p, up);
        $('#pcout').innerHTML = '<span class="big">' + m(o) + ' &times; ' + mult + ' = ' + m(nw) + '</span><br>' + (up ? '100% + ' + p + '% = ' + pct(100 + p) : '100% &minus; ' + p + '% = ' + pct(100 - p)) + ', so the multiplier is ' + mult + '.';
      });
      A.bind(root, ['rpa', 'rpb', 'rpc'], function () {
        var a = +$('#rpa').value, b = +$('#rpb').value, c = +$('#rpc').value;
        if (!(a > 0 && b > 0 && c > 0) || a > 100 || b > 100 || c > 200) { $('#rpfig').innerHTML = ''; $('#rpout').innerHTML = 'Use positive amounts up to 100.'; return; }
        var x = cl(c * b / a);
        $('#rpfig').innerHTML = dnl(a, b, c, 'cups of flour', 'cups of sugar');
        $('#rpout').innerHTML = '<span class="big">' + a + ' : ' + b + ' = ' + c + ' : ' + F(String(c2(x))) + '</span><br>Multiplier: ' + c + ' &divide; ' + a + ' = ' + c2(c / a) + (cl(c / a) !== c2(c / a) ? '&hellip;' : '') + '. Sugar: ' + b + ' &times; ' + c2(c / a) + (cl(c / a) !== c2(c / a) ? '&hellip;' : '') + ' &asymp; ' + c2(x) + ' cups.';
      });
    }
  });

  /* ---------- question shapes (more ways to ask each skill; checks in tests/verify/grade8.js) ---------- */
  var K = window.K8;
  function distinct(n, gen) { var out = [], seen = {}; for (var i = 0; out.length < n && i < 200; i++) { var v = gen(); if (!seen[v]) { seen[v] = 1; out.push(v); } } return out; }
  var SHAPES = {
    'pr-convert': [
      [1, 'match', function (lv) {
        var ps = distinct(3, function () { return lv === 1 ? R.pick([5, 10, 20, 25, 40, 50, 75, 80]) : R.pick([0.5, 2.5, 12.5, 110, 125, 150, 175, 35]); });
        return { q: 'Match each percent to its decimal.', type: 'match', pairs: ps.map(function (p) { return [pct(p), F(String(cl(p / 100)))]; }),
          hint: 'Percent means out of 100: divide by 100.', steps: ['Move the digits 2 places to the right.'], explain: ps.map(function (p) { return pct(p) + ' = ' + cl(p / 100); }).join(', ') + '.', meta: { k: 'pc-match' } };
      }],
      [1, 'line', function (lv) {
        var p = R.int(1, 19) * 5;
        return { q: 'Place <b>' + p + '%</b> on the number line.', type: 'line', min: 0, max: 1, tick: 0.05, every: 0.25, snap: 0.05, answer: cl(p / 100),
          hint: '100% is the whole, at 1. 50% is halfway.', steps: [p + '% = ' + cl(p / 100) + '.', 'Count ' + p / 5 + ' small steps of 0.05 from 0.'], explain: p + '% = ' + cl(p / 100) + '.', meta: { k: 'pc-line', p: p } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), p = R.pick([2, 3, 4, 5, 6, 7, 8, 9]), truth = R.int(0, 1), said = truth ? cl(p / 100) : cl(p / 10);
        return K.tf({ q: who + ' says <b>' + p + '% = ' + said + '</b>. True or false?', truth: truth,
          right: p + '% means ' + p + ' out of 100, which is ' + cl(p / 100) + '.', wrong: ['Put a decimal point in front of the number.', p + '% means ' + p + ' out of 10.'],
          hint: 'Divide by 100, not by 10.', meta: { k: 'pc-tf', p: p, said: said } });
      }],
      [2, 'order', function (lv) {
        return K.until(function () {
          var base = R.int(3, 8) * 10, items = [[base + '%', base / 100], [String(cl((base + R.int(1, 4)) / 100)), 0], [R.pick([[1, 2], [3, 4], [2, 5], [3, 5], [7, 10], [4, 5]]), 0]];
          items[1][1] = +items[1][0]; var f = items[2][0]; items[2] = [f[0] + '/' + f[1], f[0] / f[1]];
          if (Math.abs(items[2][1] - items[0][1]) < 0.001 || Math.abs(items[2][1] - items[1][1]) < 0.001) return null;
          items.sort(function (a, b) { return a[1] - b[1]; });
          return { q: 'Put these in order, least to greatest.', type: 'order', items: items.map(function (x) { return x[0]; }), first: 'least', last: 'greatest',
            hint: 'Change them all to decimals first.', steps: items.map(function (x) { return x[0] + ' = ' + cl(x[1]); }), explain: items.map(function (x) { return x[0]; }).join(' &lt; ') + '.', meta: { k: 'pc-order' } };
        });
      }]
    ],
    'pr-of': [
      [1, 'story', function (lv) {
        var who = K.name(), p = R.pick([10, 20, 25, 50, 75]), n = R.int(2, 9) * 4 * (p === 10 || p === 20 ? 5 : 1);
        return { q: 'There are <b>' + n + '</b> students in ' + who + '\'s grade. <b>' + p + '%</b> of them take the bus. How many take the bus?', type: 'num', answer: cl(p / 100 * n),
          hint: p + '% = ' + cl(p / 100) + '. Multiply by ' + n + '.', steps: [cl(p / 100) + ' &times; ' + n + ' = ' + cl(p / 100 * n) + '.'], explain: p + '% of ' + n + ' = ' + cl(p / 100 * n) + ' students.', meta: { k: 'po-story', p: p, n: n } };
      }],
      [1, 'fill', function (lv) {
        var n = R.int(2, 40) * 10, k = R.pick([2, 3, 4, 6, 7, 9]);
        return { q: 'Use 10% to find ' + k * 10 + '%.', type: 'fill', fill: '10% of ' + n + ' = [[]], so ' + k * 10 + '% of ' + n + ' = [[]]', answers: [n / 10, n / 10 * k],
          hint: '10% is one tenth: divide by 10.', steps: ['10% of ' + n + ' = ' + n / 10 + '.', k * 10 + '% is ' + k + ' times as much: ' + n / 10 * k + '.'], explain: k * 10 + '% of ' + n + ' = ' + n / 10 * k + '.', meta: { k: 'po-fill', n: n, p: k * 10 } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), p = R.pick([110, 120, 125, 150, 200, 40, 60, 75]), n = R.int(2, 20) * 20, more = p > 100, claim = R.int(0, 1);
        return K.tf({ q: who + ' says ' + p + '% of ' + n + ' is <b>' + (claim ? 'more' : 'less') + '</b> than ' + n + '. True or false?', truth: claim ? more : !more,
          right: p + '% is ' + (more ? 'more' : 'less') + ' than 100%, so ' + p + '% of ' + n + ' = ' + cl(p / 100 * n) + ' is ' + (more ? 'more' : 'less') + ' than ' + n + '.', wrong: ['A percent of a number is always less than the number.', 'A percent of a number is always more than the number.'],
          hint: 'Compare ' + p + '% with 100%.', meta: { k: 'po-tf', p: p, n: n, more: !!claim } });
      }],
      [2, 'match', function (lv) {
        var n = R.int(2, 20) * 20, ps = distinct(3, function () { return R.pick([5, 10, 15, 25, 50, 75, 120, 150]); });
        return { q: 'Match each percent of ' + n + ' to its value.', type: 'match', pairs: ps.map(function (p) { return [p + '% of ' + n, F(String(cl(p / 100 * n)))]; }),
          hint: 'Change each percent to a decimal and multiply.', steps: ['10% of ' + n + ' is ' + n / 10 + '. Build the others from it.'], explain: ps.map(function (p) { return p + '% of ' + n + ' = ' + cl(p / 100 * n); }).join(', ') + '.', meta: { k: 'po-match' } };
      }]
    ],
    'pr-change': [
      [1, 'way', function (lv) {
        var price = R.pick([R.int(4, 19), R.int(21, 30)]) * 5, p = R.pick([10, 15, 20, 25, 30, 40]), keep = cl(1 - p / 100);
        return K.pick1({ q: 'A $' + price + ' jacket is <b>' + p + '% off</b>. Which way finds the sale price?', right: price + ' &times; ' + keep, wrong: [price + ' &times; ' + cl(p / 100), price + ' &minus; ' + p, price + ' &times; ' + cl(1 + p / 100)],
          hint: p + '% off leaves ' + (100 - p) + '% of the price.', steps: ['100% &minus; ' + p + '% = ' + (100 - p) + '% = ' + keep + '.', 'Sale price = ' + price + ' &times; ' + keep + ' = ' + m(price * keep) + '.'], explain: 'Multiply by ' + keep + ': ' + m(price * keep) + '.', meta: { k: 'pg-way', price: price, p: p } });
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), price = R.pick([R.int(4, 19), R.int(21, 30)]) * 5, p = R.pick([10, 20, 25, 50]), right = c2(price * (1 + p / 100)), truth = R.int(0, 1), said = truth ? right : price + p;
        return K.tf({ q: 'A $' + price + ' bike goes up by ' + p + '%. ' + who + ' says the new price is <b>' + m(said) + '</b>. True or false?', truth: truth,
          right: p + '% of $' + price + ' is ' + m(price * p / 100) + ', so the new price is ' + m(right) + '.', wrong: ['Add ' + p + ' dollars, because it is ' + p + '%.', 'A percent increase never changes the price much.'],
          hint: 'Find ' + p + '% of ' + price + ' first.', meta: { k: 'pg-tf', price: price, p: p, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), price = R.int(20, 180), what = R.pick(['hockey skates', 'a winter coat', 'a backpack', 'headphones']), tax = c2(price * 0.13);
        return { q: who + ' buys ' + what + ' for <b>$' + price + '</b> in Ontario. HST is <b>13%</b>. How much is the tax? Round to the cent.', type: 'num', unit: '$', answer: tax, tol: 0.006, show: m(tax),
          hint: '13% = 0.13. Multiply.', steps: [price + ' &times; 0.13 = ' + cl(price * 0.13) + '.', 'The tax is ' + m(tax) + '.'], explain: 'Tax: ' + m(tax) + '.', meta: { k: 'pg-story', price: price } };
      }],
      [2, 'fill', function (lv) {
        var p = R.pick([5, 10, 15, 20, 25, 30, 35, 40, 60]), up = R.int(0, 1), mult = cl(up ? 1 + p / 100 : 1 - p / 100);
        return { q: 'What do you multiply by?', type: 'fill', fill: 'A ' + p + '% ' + (up ? 'increase' : 'decrease') + ': multiply by [[]]', answers: [mult], tol: 0.001,
          hint: up ? '100% + ' + p + '%.' : '100% &minus; ' + p + '%.', steps: [(up ? 100 + p : 100 - p) + '% = ' + mult + '.'], explain: 'Multiply by ' + mult + '.', meta: { k: 'pg-fill', p: p, up: !!up } };
      }]
    ],
    'pr-prop': [
      [1, 'fill', function (lv) {
        var a = R.int(2, 9), b = R.int(2, 9), k = R.int(2, 6);
        while (a === b) b++;
        return { q: 'Fill in the missing number.', type: 'fill', fill: '<span class="math">' + a + ' : ' + b + ' = ' + a * k + ' : [[]]</span>', answers: [b * k],
          hint: 'What was ' + a + ' multiplied by? Do the same to ' + b + '.', steps: [a + ' &times; ' + k + ' = ' + a * k + '.', b + ' &times; ' + k + ' = ' + b * k + '.'], explain: a + ' : ' + b + ' = ' + a * k + ' : ' + b * k + '.', meta: { k: 'pp-fill', a: a, b: b, c: a * k } };
      }],
      [1, 'story', function (lv) {
        var who = K.name(), a = R.int(2, 5), b = R.int(3, 8), k = R.int(2, 5);
        while (a === b) b++;
        return { q: who + ' mixes <b>' + a + ' scoops</b> of iced tea powder with <b>' + b + ' cups</b> of water. How many cups of water go with <b>' + a * k + ' scoops</b>?', type: 'num', answer: b * k, unit: 'cups',
          hint: a * k + ' scoops is ' + k + ' times as many.', steps: [a + ' &times; ' + k + ' = ' + a * k + '.', b + ' &times; ' + k + ' = ' + b * k + ' cups.'], explain: a + ' : ' + b + ' = ' + a * k + ' : ' + b * k + '.', meta: { k: 'pp-story', a: a, b: b, c: a * k } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), a = R.int(2, 6), b = R.int(3, 9), k = R.int(2, 4);
        while (a === b) b++;
        var c = a * k, truth = R.int(0, 1), said = truth ? b * k : b + (c - a);
        return K.tf({ q: 'The ratio is ' + a + ' : ' + b + '. ' + who + ' says ' + c + ' : ' + said + ' is the same ratio, because ' + (truth ? 'both parts were multiplied by ' + k : a + ' and ' + b + ' both went up by ' + (c - a)) + '. True or false?', truth: truth,
          right: 'Equal ratios multiply both parts by the same number: ' + a + ' : ' + b + ' = ' + c + ' : ' + b * k + '.', wrong: ['Equal ratios add the same number to both parts.', 'Any two ratios with the same first part are equal.'],
          hint: 'Multiply, do not add.', meta: { k: 'pp-tf', a: a, b: b, c: c, said: said } });
      }],
      [2, 'pick', function (lv) {
        return K.until(function () {
          var a = R.int(2, 6), b = R.int(3, 9);
          if (a === b || A.gcd(a, b) > 1) return null;
          var opts = [2, 3, 5].map(function (k) { return [a * k + ' : ' + b * k, true]; }).concat([[(a + 2) + ' : ' + (b + 2), false], [b + ' : ' + a, false], [a * 2 + ' : ' + (b * 2 + 1), false]]);
          return K.pickAll({ q: 'Pick every ratio equal to <b>' + a + ' : ' + b + '</b>.', opts: R.shuffle(opts).slice(0, 5), hint: 'Is each one ' + a + ' : ' + b + ' with both parts multiplied by the same number?', steps: ['Divide both parts by the same number to see if you get back to ' + a + ' : ' + b + '.'], explain: 'Equal ratios multiply both parts by the same number.', meta: { k: 'pp-pick', a: a, b: b } });
        });
      }]
    ],
    'pr-rate': [
      [1, 'tap', function (lv) {
        return K.until(function () {
          var item = R.pick(['granola bars', 'juice boxes', 'apples']), offers = distinct(3, function () { return R.pick([4, 5, 6, 8, 10, 12]); }).map(function (q) { return [q, c2(q * (R.int(40, 120) / 100))]; });
          var unit = offers.map(function (o) { return o[1] / o[0]; }), lo = Math.min.apply(null, unit);
          if (unit.filter(function (u) { return Math.abs(u - lo) < 0.005; }).length > 1) return null;
          var tiles = offers.map(function (o) { return o[0] + ' for $' + o[1].toFixed(2); });
          return { q: 'Which pack of ' + item + ' is the best buy? Tap it.', type: 'tap', tiles: tiles, answer: unit.indexOf(lo), answerText: tiles[unit.indexOf(lo)],
            hint: 'Find the price of one item in each pack.', steps: offers.map(function (o) { return '$' + o[1].toFixed(2) + ' &divide; ' + o[0] + ' &asymp; $' + (o[1] / o[0]).toFixed(3) + ' each.'; }), explain: 'The lowest price for one is the best buy.', meta: { k: 'pa-tap' } };
        });
      }],
      [1, 'fill', function (lv) {
        var q = R.int(2, 8), u = R.int(105, 495) / 100, tot = c2(q * u);
        u = c2(tot / q); tot = c2(u * q);
        return { q: 'Find the unit price.', type: 'fill', fill: q + ' L of milk cost $' + tot.toFixed(2) + ', so 1 L costs $[[]]', answers: [u], tol: 0.006,
          hint: 'Divide the cost by the number of litres.', steps: [tot.toFixed(2) + ' &divide; ' + q + ' = ' + u.toFixed(2) + '.'], explain: '1 L costs ' + m(u) + '.', meta: { k: 'pa-fill', q: q, tot: tot } };
      }],
      [1, 'mistake', function (lv) {
        return K.until(function () {
          var who = K.name(), s1 = R.pick([300, 400, 500]), s2 = s1 * 2, p1 = R.int(200, 500) / 100, p2 = c2(p1 * 2 + R.pick([-1, 1]) * R.int(20, 90) / 100), big = p2 / s2 < p1 / s1;
          if (Math.abs(p2 / s2 - p1 / s1) < 0.0001) return null;
          return K.tf({ q: 'Cereal comes as ' + s1 + ' g for $' + p1.toFixed(2) + ' or ' + s2 + ' g for $' + p2.toFixed(2) + '. ' + who + ' says the bigger box is the better buy, because bigger is always cheaper. Is the bigger box the better buy here?', truth: big,
            right: 'Per 100 g: $' + (p1 / s1 * 100).toFixed(3) + ' vs $' + (p2 / s2 * 100).toFixed(3) + '. The ' + (big ? 'bigger' : 'smaller') + ' box costs less per 100 g.', wrong: ['Bigger packages are always the better buy.', 'The cheaper price tag is always the better buy.'],
            hint: 'Compare the price for the same amount, like 100 g.', meta: { k: 'pa-tf', s1: s1, p1: p1, s2: s2, p2: p2 } });
        });
      }],
      [2, 'order', function (lv) {
        return K.until(function () {
          var offers = distinct(3, function () { return R.pick([2, 3, 4, 5, 6]); }).map(function (h) { return [h, R.int(12, 30) * 5 * h]; });
          var sp = offers.map(function (o) { return o[1] / o[0]; });
          if (new Set(sp).size < 3) return null;
          offers.sort(function (a, b) { return a[1] / a[0] - b[1] / b[0]; });
          return { q: 'Three trains. Put them in order of speed, slowest to fastest.', type: 'order', items: offers.map(function (o) { return o[1] + ' km in ' + o[0] + ' h'; }), first: 'slowest', last: 'fastest',
            hint: 'Find the speed of each: distance &divide; time.', steps: offers.map(function (o) { return o[1] + ' &divide; ' + o[0] + ' = ' + o[1] / o[0] + ' km/h.'; }), explain: 'Speeds: ' + offers.map(function (o) { return o[1] / o[0]; }).join(', ') + ' km/h.', meta: { k: 'pa-order' } };
        });
      }]
    ],
    'pr-order': [
      [1, 'which', function (lv) {
        var a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 5), br = R.int(0, 1), ex = br ? '(' + a + ' + ' + b + ') &times; ' + c : a + ' + ' + b + ' &times; ' + c;
        return K.pick1({ q: 'In <span class="math">' + ex + '</span>, what do you do first?', right: br ? 'Add ' + a + ' + ' + b + ' in the brackets' : 'Multiply ' + b + ' &times; ' + c, wrong: br ? ['Multiply ' + b + ' &times; ' + c, 'Multiply ' + a + ' &times; ' + c] : ['Add ' + a + ' + ' + b, 'Work left to right'],
          hint: 'BEDMAS: brackets first, then &times; and &divide;, then + and &minus;.', steps: [br ? 'Brackets come first.' : 'There are no brackets, so multiply before you add.'], explain: ex.replace(/&times;/g, '&times;') + ' = ' + (br ? (a + b) * c : a + b * c) + '.', meta: { k: 'pq-first', ex: ex } });
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 5), ex = a + ' + ' + b + ' &times; ' + c, truth = R.int(0, 1), said = truth ? a + b * c : (a + b) * c;
        return K.tf({ q: who + ' says <span class="math">' + ex + ' = ' + said + '</span>. True or false?', truth: truth,
          right: 'Multiply first: ' + b + ' &times; ' + c + ' = ' + b * c + '. Then add ' + a + ': ' + (a + b * c) + '.', wrong: ['Always work left to right.', 'Add first because + comes first.'],
          hint: 'Which comes first in BEDMAS: + or &times;?', meta: { k: 'pq-tf', ex: ex, said: said } });
      }],
      [1, 'fill', function (lv) {
        var a = R.int(10, 30), b = R.int(2, 6), c = R.int(2, 5);
        return { q: 'Work it out one step at a time.', type: 'fill', fill: '<span class="math">' + a + ' &minus; ' + b + ' &times; ' + c + ' = ' + a + ' &minus; [[]] = [[]]</span>', answers: [b * c, a - b * c],
          hint: 'Multiply before you subtract.', steps: [b + ' &times; ' + c + ' = ' + b * c + '.', a + ' &minus; ' + b * c + ' = ' + (a - b * c) + '.'], explain: 'The answer is ' + A.neg(a - b * c) + '.', meta: { k: 'pq-fill', a: a, b: b, c: c } };
      }],
      [2, 'order', function (lv) {
        return K.until(function () {
          var list = [], seen = {};
          for (var i = 0; i < 3; i++) {
            var a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 5), t = R.int(0, 2), ex = [a + ' + ' + b + ' &times; ' + c, '(' + a + ' + ' + b + ') &times; ' + c, a * b + ' &divide; ' + b + ' &times; ' + c][t], v = [a + b * c, (a + b) * c, a * c][t];
            if (seen[v]) return null; seen[v] = 1; list.push([ex, v]);
          }
          list.sort(function (x, y) { return x[1] - y[1]; });
          return { q: 'Put these in order of value, least to greatest.', type: 'order', items: list.map(function (x) { return x[0]; }), first: 'least', last: 'greatest',
            hint: 'Use BEDMAS to work out each one.', steps: list.map(function (x) { return x[0] + ' = ' + x[1]; }), explain: 'In order: ' + list.map(function (x) { return x[1]; }).join(', ') + '.', meta: { k: 'pq-order' } };
        });
      }]
    ]
  };
  Atlas.Q.shapes('percent-ratio', SHAPES);
})();
