(function () {
  var A = Atlas, R = A.R;
  function c2(x) { return Math.round((x + 1e-9) * 100) / 100; }
  function m(x) { var v = c2(x); return (v < 0 ? '&minus;' : '') + '$' + A.fmt(Math.abs(v).toFixed(2)); }
  function mp(x) { var v = c2(x); return (v < 0 ? '−' : '') + '$' + A.fmt(Math.abs(v).toFixed(2)); }
  function money(o) { o.type = 'num'; o.unit = '$'; o.answer = c2(o.answer); o.tol = o.tol || 0.011; o.show = mp(o.answer); return o; }
  var RATES = [['US dollar', 'USD', 1.36], ['euro', 'EUR', 1.48], ['British pound', 'GBP', 1.72], ['Mexican peso', 'MXN', 0.075], ['Japanese yen', 'JPY', 0.0092]];
  var EX = ' (example rate for practice; real rates change every day)';

  /* exchange: two bars showing the same value in two currencies */
  function exFig(amt, r) {
    var cad = amt * r[2], mx = Math.max(amt, cad), s = '', W = 255;
    function bar(y, v, lab, col) { var w = Math.max(4, W * v / mx); return '<rect x="125" y="' + y + '" width="' + w.toFixed(1) + '" height="30" style="fill:color-mix(in srgb,' + col + ' 40%,var(--card));stroke:' + col + '" stroke-width="1.5"/><text x="117" y="' + (y + 21) + '" text-anchor="end" font-size="17" class="tb">' + lab + '</text>'; }
    s += bar(10, amt, A.fmt(amt) + ' ' + r[1], 'var(--sb)') + bar(56, cad, mp(cad), 'var(--strand)');
    s += '<text x="10" y="112" font-size="16" class="t2">1 ' + r[1] + ' = $' + r[2] + ' CAD, so multiply by ' + r[2] + '</text>';
    return A.svg(400, 122, s, A.fmt(amt) + ' ' + r[0] + 's is worth about ' + mp(cad) + ' Canadian at a rate of ' + r[2] + ' Canadian dollars each.');
  }
  /* budget: income bar above a stacked spending bar */
  function budgetFig(inc, items) {
    var tot = items.reduce(function (a, it) { return a + it[1]; }, 0), mx = Math.max(inc, tot, 1), W = 270, s = '', x = 110, cols = ['var(--sb)', 'var(--se)', 'var(--sc)', 'var(--sd)', 'var(--strand)'];
    s += '<rect x="110" y="10" width="' + (W * inc / mx).toFixed(1) + '" height="30" style="fill:color-mix(in srgb,var(--good) 35%,var(--card));stroke:var(--good)" stroke-width="1.5"/><text x="100" y="31" text-anchor="end" font-size="17" class="tb">Income</text>';
    items.forEach(function (it, i) {
      var w = W * it[1] / mx;
      s += '<rect x="' + x.toFixed(1) + '" y="56" width="' + w.toFixed(1) + '" height="30" style="fill:color-mix(in srgb,' + cols[i % 5] + ' 40%,var(--card));stroke:' + cols[i % 5] + '" stroke-width="1.5"/>';
      s += '<rect x="' + (10 + (i % 2) * 190) + '" y="' + (106 + Math.floor(i / 2) * 24) + '" width="14" height="14" style="fill:color-mix(in srgb,' + cols[i % 5] + ' 40%,var(--card));stroke:' + cols[i % 5] + '"/><text x="' + (30 + (i % 2) * 190) + '" y="' + (118 + Math.floor(i / 2) * 24) + '" font-size="15">' + it[0] + ' $' + it[1] + '</text>';
      x += w;
    });
    s += '<text x="100" y="77" text-anchor="end" font-size="17" class="tb">Spending</text>';
    var diff = inc - tot, ly = 106 + Math.ceil(items.length / 2) * 24 + 16;
    s += '<text x="10" y="' + ly + '" font-size="17" class="tb" style="fill:' + (diff >= 0 ? 'var(--good)' : 'var(--bad)') + '">' + (diff > 0 ? 'Surplus: ' + mp(diff) + ' left over' : diff === 0 ? 'Balanced: spending equals income' : 'Deficit: ' + mp(-diff) + ' short') + '</text>';
    return A.svg(400, ly + 10, s, 'Budget. Income ' + mp(inc) + '. Spending ' + mp(tot) + ': ' + items.map(function (it) { return it[0] + ' ' + it[1] + ' dollars'; }).join(', ') + '. ' + (diff >= 0 ? 'Surplus of ' + mp(diff) : 'Deficit of ' + mp(-diff)) + '.');
  }
  /* growth chart: simple vs compound over n years */
  function kf(v) { return v >= 10000 ? '$' + (v >= 100000 ? Math.round(v / 1000) : Math.round(v / 100) / 10) + 'k' : '$' + Math.round(v); }
  function growth(P, r, n) {
    var x0 = 62, x1 = 330, y0 = 200, y1 = 20, s = '', cmp = P * Math.pow(1 + r / 100, n), mx = cmp * 1.05;
    function X(t) { return x0 + (x1 - x0) * t / n; } function Y(v) { return y0 - (y0 - y1) * v / mx; }
    var stp = Math.pow(10, Math.floor(Math.log10(mx / 4))), mul = [1, 2, 2.5, 5, 10].filter(function (k) { return k * stp >= mx / 5; })[0]; stp *= mul;
    for (var v = 0; v <= mx; v += stp) { s += '<line x1="' + x0 + '" y1="' + Y(v).toFixed(1) + '" x2="' + x1 + '" y2="' + Y(v).toFixed(1) + '" style="stroke:var(--line)"/><text x="' + (x0 - 6) + '" y="' + (Y(v) + 5).toFixed(1) + '" text-anchor="end" font-size="14" class="t2">$' + (v >= 10000 ? A.fmt(Math.round(v / 1000)) + 'k' : Math.round(v)) + '</text>'; }
    var ps = [], pc = [], area = [];
    for (var t = 0; t <= n; t++) { ps.push(X(t).toFixed(1) + ',' + Y(P * (1 + r / 100 * t)).toFixed(1)); pc.push(X(t).toFixed(1) + ',' + Y(P * Math.pow(1 + r / 100, t)).toFixed(1)); }
    s += '<polygon points="' + pc.concat(ps.slice().reverse()).join(' ') + '" style="fill:color-mix(in srgb,var(--strand) 18%,transparent)"/>';
    s += '<polyline points="' + ps.join(' ') + '" fill="none" style="stroke:var(--sb)" stroke-width="3" stroke-dasharray="7 4"/><polyline points="' + pc.join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="3.5"/>';
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="1.5"/><text x="' + x0 + '" y="' + (y0 + 20) + '" text-anchor="middle" font-size="14" class="t2">0</text><text x="' + x1 + '" y="' + (y0 + 20) + '" text-anchor="middle" font-size="14" class="t2">' + n + ' yr</text>';
    var simp = P * (1 + r / 100 * n), yc = Y(cmp), ys = Y(simp); if (ys - yc < 20) ys = yc + 20;
    s += '<text x="' + (x1 + 6) + '" y="' + (yc + 5).toFixed(1) + '" font-size="15" class="tb" style="fill:var(--strand)">' + kf(cmp) + '</text><text x="' + (x1 + 6) + '" y="' + (ys + 5).toFixed(1) + '" font-size="15" class="tb" style="fill:var(--sb)">' + kf(simp) + '</text>';
    s += '<line x1="70" y1="236" x2="96" y2="236" style="stroke:var(--strand)" stroke-width="3.5"/><text x="102" y="241" font-size="15">compound</text><line x1="200" y1="236" x2="226" y2="236" style="stroke:var(--sb)" stroke-width="3" stroke-dasharray="7 4"/><text x="232" y="241" font-size="15">simple</text>';
    return A.svg(400, 250, s, 'Growth of ' + mp(P) + ' at ' + r + '% a year for ' + n + ' years. Simple interest grows in a straight line to ' + mp(simp) + '. Compound interest curves upward to ' + mp(cmp) + '.');
  }
  /* two-option comparison bars */
  function compare(a, b, unit) {
    var mx = Math.max(a[1], b[1]), s = '', W = 140;
    [a, b].forEach(function (o, i) {
      var y = 10 + i * 46, w = Math.max(4, W * o[1] / mx), best = o[1] === Math.min(a[1], b[1]);
      s += '<text x="100" y="' + (y + 21) + '" text-anchor="end" font-size="17" class="tb">' + o[0] + '</text><rect x="110" y="' + y + '" width="' + w.toFixed(1) + '" height="30" style="fill:color-mix(in srgb,' + (best ? 'var(--good)' : 'var(--accent)') + ' 35%,var(--card));stroke:' + (best ? 'var(--good)' : 'var(--accent)') + '" stroke-width="1.5"/><text x="' + (116 + w).toFixed(1) + '" y="' + (y + 21) + '" font-size="16">' + o[2] + '</text>';
    });
    return A.svg(400, 104, s, o2s(a) + '. ' + o2s(b) + '. ' + unit);
    function o2s(o) { return o[0] + ': ' + o[2]; }
  }

  /* net reward of two cards as spending grows */
  function cardFig() {
    var x0 = 62, x1 = 370, y0 = 180, y1 = 20, s = '', mx = 16000, lo = -120, hi = 200;
    function X(v) { return x0 + (x1 - x0) * v / mx; } function Y(v) { return y0 - (y0 - y1) * (v - lo) / (hi - lo); }
    [-100, 0, 100, 200].forEach(function (v) { s += '<line x1="' + x0 + '" y1="' + Y(v).toFixed(1) + '" x2="' + x1 + '" y2="' + Y(v).toFixed(1) + '" style="stroke:' + (v ? 'var(--line)' : 'var(--ink)') + '"/><text x="' + (x0 - 6) + '" y="' + (Y(v) + 5).toFixed(1) + '" text-anchor="end" font-size="14" class="t2">' + (v < 0 ? '−$' + -v : '$' + v) + '</text>'; });
    [0, 8000, 16000].forEach(function (v) { s += '<text x="' + X(v) + '" y="' + (y0 + 20) + '" text-anchor="middle" font-size="14" class="t2">$' + A.fmt(v) + '</text>'; });
    s += '<line x1="' + X(0) + '" y1="' + Y(0).toFixed(1) + '" x2="' + X(mx) + '" y2="' + Y(mx * 0.005).toFixed(1) + '" style="stroke:var(--sb)" stroke-width="3"/>';
    s += '<line x1="' + X(0) + '" y1="' + Y(-120).toFixed(1) + '" x2="' + X(mx) + '" y2="' + Y(mx * 0.02 - 120).toFixed(1) + '" style="stroke:var(--strand)" stroke-width="3.5"/>';
    s += '<circle cx="' + X(8000) + '" cy="' + Y(40).toFixed(1) + '" r="5" style="fill:var(--accent)"/><text x="' + (X(8000) + 10) + '" y="' + Y(-55).toFixed(1) + '" text-anchor="start" font-size="15" class="tb">tie at $8 000</text>';
    s += '<text x="' + (X(mx) - 4) + '" y="' + (Y(80) + 22).toFixed(1) + '" text-anchor="end" font-size="15" class="tb" style="fill:var(--sb)">Card A</text><text x="' + X(11000) + '" y="' + Y(140).toFixed(1) + '" text-anchor="end" font-size="15" class="tb" style="fill:var(--strand)">Card B</text>';
    s += '<text x="216" y="222" text-anchor="middle" font-size="15" class="t2">spending in a year</text>';
    return A.svg(400, 230, s, 'Net reward after fees for two cards as yearly spending grows from 0 to 16 000 dollars. Card A starts at 0 and rises slowly. Card B starts at minus 120 dollars and rises faster. They tie at 8000 dollars, 40 dollars each.');
  }

  var html =
'<section class="sec"><h2><span class="n">1</span>Other currencies and ways to pay</h2>' +
'<p>Each country has its own money. An <b>exchange rate</b> tells you what one unit is worth in Canadian dollars (CAD). The rates on this page are examples for practice. Real rates change every day.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Currency</th><th>1 unit in CAD</th></tr></thead><tbody>' + RATES.map(function (r) { return '<tr><td class="l">' + r[0] + ' (' + r[1] + ')</td><td>$' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
'<ul class="steplist"><li><b>Foreign to CAD:</b> multiply by the rate.</li><li><b>CAD to foreign:</b> divide by the rate.</li></ul>' +
'<div class="lab"><span class="lt">Try it: convert an amount</span>' +
'<div class="ctrl"><label for="exc">Currency<select id="exc">' + RATES.map(function (r, i) { return '<option value="' + i + '">' + r[0] + '</option>'; }).join('') + '</select></label>' +
'<label for="exa">Amount: <output id="exao"></output><input type="range" id="exa" min="10" max="500" step="10" value="100"></label>' +
'<label for="exf">Card fee: <output id="exfo"></output><input type="range" id="exf" min="0" max="3" step="0.5" value="2.5"></label></div>' +
'<div class="fig" id="exfig"></div><div class="out" id="exout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A hoodie costs 40 USD. At 1 USD = $1.36 CAD, what does it cost in Canadian dollars? Your credit card adds a 2.5% foreign transaction fee.</p><ol><li>Convert: 40 &times; 1.36 = $54.40.</li><li>Fee: 2.5% of 54.40 = 54.40 &times; 0.025 = $1.36.</li><li>Total: 54.40 + 1.36 = $55.76.</li></ol></div>' +
A.yt({ q: 'You have 50 USD. At 1 USD = $1.36 CAD, how much is it in Canadian dollars?', a: 68, unit: '$', show: '$68.00', back: 'Foreign to CAD: multiply by the rate.', ok: '50 &times; 1.36 = $68.00.' }) +
'<div class="tbl"><table><thead><tr><th class="l">Way to pay</th><th class="l">Good</th><th class="l">Watch out</th></tr></thead><tbody>' +
'<tr><td class="l">Cash</td><td class="l">Works anywhere, no card fee</td><td class="l">Can be lost or stolen; exchange counters charge a markup</td></tr>' +
'<tr><td class="l">Debit card</td><td class="l">Spends your own money</td><td class="l">ATM and conversion fees abroad</td></tr>' +
'<tr><td class="l">Credit card</td><td class="l">Safe, widely accepted, fraud protection</td><td class="l">Foreign fee (often about 2.5%); interest if not paid in full</td></tr>' +
'<tr><td class="l">Prepaid travel card</td><td class="l">Locks in a rate; spending limit</td><td class="l">Loading or inactivity fees</td></tr></tbody></table></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Budgets that balance</h2>' +
'<p>A <b>budget</b> is a plan for money coming in (<b>income</b>) and going out (<b>expenses</b>). <b>Fixed</b> expenses stay the same each month, like a phone plan. <b>Variable</b> expenses change, like food and fun.</p>' +
'<ul class="steplist"><li><b>Surplus:</b> income is more than spending. Save the extra.</li><li><b>Balanced:</b> they are equal.</li><li><b>Deficit:</b> spending is more than income. Something has to change.</li></ul>' +
'<div class="lab"><span class="lt">Try it: balance a monthly budget</span>' +
'<p class="t2" style="margin:.2rem 0 .6rem">Fixed: phone $35 and transit pass $60.</p>' +
'<div class="ctrl"><label for="bui">Income: <output id="buio"></output><input type="range" id="bui" min="0" max="600" step="5" value="320"></label><label for="buf">Food and fun: <output id="bufo"></output><input type="range" id="buf" min="0" max="400" step="5" value="150"></label><label for="bus">Savings: <output id="buso"></output><input type="range" id="bus" min="0" max="300" step="5" value="100"></label></div>' +
'<div class="fig" id="bufig"></div><div class="out" id="buout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Maya earns $320 a month. She spends $35 on her phone, $60 on transit, $180 on food and fun, and wants to save $80. Does her budget balance?</p><ol><li>Add the expenses: 35 + 60 + 180 + 80 = $355.</li><li>Compare: 355 is more than 320. That is a deficit of $35.</li><li>To balance, she could spend $35 less on food and fun, earn $35 more, or save less for now.</li></ol></div>' +
A.yt({ q: 'Income is $400. Expenses are $120, $85 and $150. What is the surplus?', a: 45, unit: '$', show: '$45.00', back: 'Go back to step 1: add the expenses, then subtract from income.', ok: '120 + 85 + 150 = 355, and 400 &minus; 355 = $45.' }) +
'<div class="key"><b class="t">Key idea</b><p>Track every dollar for a month, in a notebook, a spreadsheet or an app. You cannot fix a budget until you know where the money actually goes.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>A plan for a big goal, with tax</h2>' +
'<p>In Ontario, most purchases have <b>13% HST</b> (harmonized sales tax) added at the till. A long-term plan has to include it. Paycheques also have deductions such as income tax, so the money you take home is less than what you earn.</p>' +
'<div class="fig">' + A.svg(400, 170, '<rect x="100" y="8" width="200" height="154" style="fill:var(--card);stroke:var(--ink)" stroke-width="1.5"/><text x="200" y="34" text-anchor="middle" font-size="17" class="tb">RECEIPT</text><line x1="114" y1="46" x2="286" y2="46" style="stroke:var(--line)" stroke-dasharray="3 3"/><text x="114" y="72" font-size="17">Laptop</text><text x="286" y="72" text-anchor="end" font-size="17">$1200.00</text><text x="114" y="100" font-size="17">HST 13%</text><text x="286" y="100" text-anchor="end" font-size="17">$156.00</text><line x1="114" y1="114" x2="286" y2="114" style="stroke:var(--ink)"/><text x="114" y="142" font-size="18" class="tb">Total</text><text x="286" y="142" text-anchor="end" font-size="18" class="tb">$1356.00</text>', 'A receipt. Laptop 1200 dollars. HST at 13 percent, 156 dollars. Total 1356 dollars.') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Sam wants a $1 200 laptop. Sam can save $120 a month from a part-time job. How many months will it take?</p><ol><li>Add HST: 1200 &times; 0.13 = $156. Total: $1 356. (Or in one step: 1200 &times; 1.13.)</li><li>Months: 1356 &divide; 120 = 11.3.</li><li>11 months is not quite enough, so round <b>up</b>: 12 months.</li></ol></div>' +
A.yt({ q: 'A game costs $80 before tax. What is the total with 13% HST?', a: 90.4, unit: '$', show: '$90.40', back: 'Go back to step 1: multiply the price by 1.13.', ok: '80 &times; 1.13 = $90.40.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Planning with the sticker price. The shelf price in Ontario usually does not include HST, so the real cost is 13% higher.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Simple and compound interest</h2>' +
'<p><b>Interest</b> is money paid for using money. A bank pays you interest on savings. You pay interest on a loan or a credit card balance.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Type</th><th class="l">How it works</th><th class="l">Formula</th></tr></thead><tbody>' +
'<tr><td class="l">Simple</td><td class="l">Interest on the starting amount only</td><td class="l math">I = P &times; r &times; t</td></tr>' +
'<tr><td class="l">Compound</td><td class="l">Interest on the interest too</td><td class="l math">A = P(1 + r)<sup>t</sup></td></tr></tbody></table></div>' +
'<p class="t2">P is the starting amount (principal), r is the yearly rate as a decimal, t is the number of years, and A is the final amount.</p>' +
'<div class="lab"><span class="lt">Try it: watch the gap grow</span>' +
'<div class="ctrl"><label for="inp">Start: <output id="inpo"></output><input type="range" id="inp" min="100" max="5000" step="100" value="1000"></label><label for="inr">Rate: <output id="inro"></output><input type="range" id="inr" min="1" max="12" value="5"></label><label for="inn">Years: <output id="inno"></output><input type="range" id="inn" min="1" max="40" value="10"></label></div>' +
'<div class="fig" id="infig"></div><div class="out" id="inout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Put $1 000 in savings at 5% a year for 3 years. Compare simple and compound interest.</p><ol><li>Simple: I = 1000 &times; 0.05 &times; 3 = $150. Total $1 150.</li><li>Compound: 1000 &times; 1.05 = 1050, then 1050 &times; 1.05 = 1102.50, then 1102.50 &times; 1.05 = $1 157.63.</li><li>Compound earns $7.63 more, and the gap grows every year.</li></ol></div>' +
A.yt({ q: 'How much simple interest does $500 earn at 4% a year for 3 years?', a: 60, unit: '$', show: '$60.00', back: 'Use I = P &times; r &times; t with r = 0.04.', ok: '500 &times; 0.04 &times; 3 = $60.' }) +
'<div class="key"><b class="t">Key idea</b><p>Time is the strongest ingredient in compound interest. Starting to save early matters more than saving a lot later. It works against you too: unpaid debt compounds.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Getting good value</h2>' +
'<p>The cheapest price is not always the best value. Compare the <b>unit price</b>: the cost for the same amount (per 100 g, per litre, per item).</p>' +
'<div class="fig">' + compare(['Small', 1.2, '$1.20 per 100 g'], ['Large', 0.95, '$0.95 per 100 g'], 'The large box costs less per 100 grams.') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Cereal: a 400 g box costs $4.80 and a 750 g box costs $7.13. Which is better value?</p><ol><li>Small: 4.80 &divide; 4 = $1.20 per 100 g.</li><li>Large: 7.13 &divide; 7.5 &asymp; $0.95 per 100 g.</li><li>The large box is better value, <b>if</b> you will eat it before it goes stale.</li></ol></div>' +
A.yt({ q: 'Juice: 2 L for $3.50, or 3 L for $4.95. Which costs less per litre?', opts: ['3 L for $4.95', '2 L for $3.50', 'They are the same'], a: 0, back: 'Go back to step 1: divide each price by the number of litres.', ok: '3.50 &divide; 2 = $1.75 per L, and 4.95 &divide; 3 = $1.65 per L. The 3 L is cheaper per litre.' }) +
'<p><b>Other ways to save:</b> sales (a percent off), multi-buy deals (buy 2, get 1 free), coupons, and <b>loyalty programs</b> that give points you can trade for money off. Points are only worth it if you would shop there anyway.</p>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Buying more than you need because it is on sale. A deal only saves money on things you were going to buy.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Credit cards and contracts</h2>' +
'<p>A credit card lets you borrow to pay. If you pay the full balance by the due date, there is no interest. If not, interest is charged, often around 20% a year.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Compare</th><th class="l">What to look for</th></tr></thead><tbody><tr><td class="l">Interest rate</td><td class="l">Lower is better if you might carry a balance</td></tr><tr><td class="l">Annual fee</td><td class="l">A fixed cost every year</td></tr><tr><td class="l">Rewards</td><td class="l">Cash back or points, as a % of spending</td></tr></tbody></table></div>' +
'<div class="fig">' + cardFig() + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Card A has no fee and gives 0.5% cash back. Card B costs $120 a year and gives 2% back. Which is better for $8 000 of spending a year?</p><ol><li>Card A: 8000 &times; 0.005 = $40 back. Net: +$40.</li><li>Card B: 8000 &times; 0.02 = $160 back, minus the $120 fee. Net: +$40.</li><li>They tie at $8 000. Spend more and B wins; spend less and A wins.</li></ol></div>' +
A.yt({ q: 'A phone plan is $45 a month for 24 months with a free phone. Another is $30 a month for 24 months plus $400 for the phone. How much does the cheaper option cost in total?', a: 1080, unit: '$', show: '$1080.00', back: 'Find the total of each: monthly cost &times; 24, plus any up-front cost.', ok: '45 &times; 24 = $1 080, and 30 &times; 24 + 400 = $1 120. The $45 plan is cheaper.' }) +
'<div class="key"><b class="t">Key idea</b><p>For any contract, find the <b>total cost</b> over the whole term. A low monthly price can hide a big up-front or end-of-term cost.</p></div>' +
'</section>';

  var practice = [
    { id: 'mo-exchange', name: 'Exchange rates', code: 'F1.1', gen: function (lv) {
      var r = R.pick(RATES.slice(0, lv === 1 ? 3 : 5)), amt = r[2] < 0.1 ? R.int(2, 40) * 100 : R.int(2, 40) * 5;
      if (lv === 1) { var cad = amt * r[2];
        return money({ q: 'Convert ' + A.fmt(amt) + ' ' + r[1] + ' to Canadian dollars. 1 ' + r[1] + ' = $' + r[2] + ' CAD' + EX + '.', answer: cad, fig: exFig(amt, r),
          hint: 'Foreign to CAD: multiply by the rate.', steps: [A.fmt(amt) + ' &times; ' + r[2] + ' = ' + m(cad) + '.'], explain: A.fmt(amt) + ' ' + r[1] + ' is ' + m(cad) + ' CAD.' }); }
      if (lv === 2) { var c = R.int(2, 40) * 10, f = c / r[2];
        return { q: 'You exchange $' + c + ' CAD for ' + r[0] + 's. 1 ' + r[1] + ' = $' + r[2] + ' CAD' + EX + '. How many ' + r[1] + ' do you get? Round to two decimal places.', type: 'num', unit: r[1], answer: c2(f), tol: 0.011, show: A.fmt(c2(f).toFixed(2)) + ' ' + r[1],
          hint: 'CAD to foreign: divide by the rate.', steps: [c + ' &divide; ' + r[2] + ' &asymp; ' + A.fmt(c2(f).toFixed(2)) + '.', 'Check: ' + A.fmt(c2(f).toFixed(2)) + ' &times; ' + r[2] + ' is close to ' + c + '.'], explain: 'You get about ' + A.fmt(c2(f).toFixed(2)) + ' ' + r[1] + '.' }; }
      var fee = R.pick([2, 2.5, 3]), a3 = R.int(4, 60) * 5, base = a3 * RATES[0][2], tot = base * (1 + fee / 100);
      return money({ q: 'You buy something for ' + a3 + ' USD with a credit card. 1 USD = $1.36 CAD' + EX + '. The card adds a ' + fee + '% foreign transaction fee. What is the total in CAD? Round to the cent.', answer: tot,
        hint: 'Convert first, then add ' + fee + '% of that amount.', steps: [a3 + ' &times; 1.36 = ' + m(base) + '.', 'Fee: ' + m(base) + ' &times; ' + fee / 100 + ' = ' + m(base * fee / 100) + '.', 'Total: ' + m(tot) + '.'], explain: 'The total is ' + m(tot) + '.' });
    } },
    { id: 'mo-budget', name: 'Budgets', code: 'F1.3', gen: function (lv) {
      var names = ['Phone', 'Transit', 'Food', 'Fun', 'Clothes'], k = lv === 1 ? 3 : 4, items = R.shuffle(names).slice(0, k).map(function (nm) { return [nm, R.int(3, 20) * 5]; });
      var tot = items.reduce(function (a, it) { return a + it[1]; }, 0);
      if (lv === 1) { var inc = tot + R.int(1, 12) * 5;
        return money({ q: 'Income is $' + inc + ' a month. Expenses: ' + items.map(function (it) { return it[0].toLowerCase() + ' $' + it[1]; }).join(', ') + '. What is the surplus?', answer: inc - tot, fig: budgetFig(inc, items),
          hint: 'Add the expenses, then subtract from income.', steps: ['Expenses: ' + items.map(function (it) { return it[1]; }).join(' + ') + ' = ' + tot + '.', inc + ' &minus; ' + tot + ' = ' + (inc - tot) + '.'], explain: 'The surplus is ' + m(inc - tot) + '.' }); }
      if (lv === 2) { var inc2 = tot - R.int(1, 10) * 5, cut = tot - inc2;
        return money({ q: 'Income is $' + inc2 + ' a month. Expenses: ' + items.map(function (it) { return it[0].toLowerCase() + ' $' + it[1]; }).join(', ') + '. How much must be cut to balance the budget?', answer: cut, fig: budgetFig(inc2, items),
          hint: 'Find total spending. The cut is the difference between spending and income.', steps: ['Spending: ' + tot + '.', tot + ' &minus; ' + inc2 + ' = ' + cut + '.', 'Cutting $' + cut + ' makes spending equal income.'], explain: 'Cut ' + m(cut) + ' to balance.' }); }
      var goal = R.int(30, 150) * 10, save = R.int(4, 20) * 10, tax = R.int(0, 1), real = tax ? c2(goal * 1.13) : goal, mo = Math.ceil(real / save - 1e-9);
      return { q: 'You want to buy a $' + A.fmt(goal) + ' item' + (tax ? ' (plus 13% HST)' : '') + '. You save $' + save + ' a month. How many months until you can afford it?', type: 'num', unit: 'months', answer: mo,
        hint: (tax ? 'Add HST first (&times; 1.13). ' : '') + 'Divide by the monthly saving, then round <b>up</b>.', steps: (tax ? [A.fmt(goal) + ' &times; 1.13 = ' + m(real) + '.'] : []).concat([m(real) + ' &divide; ' + save + ' &asymp; ' + Math.round(real / save * 100) / 100 + '.', 'Round up to a whole month: ' + mo + '.']), explain: 'It takes ' + mo + ' months.' };
    } },
    { id: 'mo-tax', name: 'HST and take-home pay', code: 'F1.2', gen: function (lv) {
      var p = R.int(4, 120) * 5 - R.pick([0, 0.01, 0.05]);
      if (lv === 1) return money({ q: 'How much 13% HST is charged on a $' + p.toFixed(2) + ' item? Round to the cent.', answer: p * 0.13,
        hint: 'Multiply the price by 0.13.', steps: [p.toFixed(2) + ' &times; 0.13 = ' + m(p * 0.13) + '.'], explain: 'The HST is ' + m(p * 0.13) + '.' });
      if (lv === 2) return money({ q: 'What is the total cost of a $' + p.toFixed(2) + ' item with 13% HST? Round to the cent.', answer: p * 1.13,
        hint: 'Multiply by 1.13 (the price plus 13%).', steps: [p.toFixed(2) + ' &times; 1.13 = ' + m(p * 1.13) + '.', 'Check: the total should be a bit more than the price.'], explain: 'The total is ' + m(p * 1.13) + '.' });
      if (R.int(0, 1)) { var hr = R.pick([16.55, 17.2, 17.6, 18]), h = R.int(8, 20), ded = R.pick([10, 12, 15]), gross = hr * h, net = gross * (1 - ded / 100);
        return money({ q: 'You earn $' + hr.toFixed(2) + ' an hour and work ' + h + ' hours. About ' + ded + '% is taken off for income tax and other deductions. What is your take-home pay? Round to the cent.', answer: net,
          hint: 'Find gross pay (rate &times; hours), then keep ' + (100 - ded) + '% of it.', steps: ['Gross: ' + hr.toFixed(2) + ' &times; ' + h + ' = ' + m(gross) + '.', 'Keep ' + (100 - ded) + '%: ' + m(gross) + ' &times; ' + (100 - ded) / 100 + ' = ' + m(net) + '.'], explain: 'Take-home pay is ' + m(net) + '.' }); }
      var pre = R.int(10, 200) * 2, tot = c2(pre * 1.13);
      return money({ q: 'A receipt total is $' + tot.toFixed(2) + ', including 13% HST. What was the price before tax?', answer: pre,
        hint: 'The total is 113% of the price. Divide by 1.13.', steps: [tot.toFixed(2) + ' &divide; 1.13 = ' + m(pre) + '.', 'Check: ' + pre + ' &times; 1.13 = ' + tot.toFixed(2) + '.'], explain: 'The price before tax was ' + m(pre) + '.' });
    } },
    { id: 'mo-interest', name: 'Simple and compound interest', code: 'F1.4', gen: function (lv) {
      var P = R.int(2, 50) * 100, r = R.int(2, 8), t = lv === 1 ? R.int(1, 6) : R.int(2, 4);
      if (lv === 1) { var I = P * r / 100 * t;
        return money({ q: 'How much simple interest does $' + A.fmt(P) + ' earn at ' + r + '% a year for ' + t + ' year' + (t > 1 ? 's' : '') + '?', answer: I,
          hint: 'I = P &times; r &times; t, with r = ' + r / 100 + '.', steps: [A.fmt(P) + ' &times; ' + r / 100 + ' = ' + m(P * r / 100) + ' a year.', 'Times ' + t + ': ' + m(I) + '.'], explain: 'The interest is ' + m(I) + '.' }); }
      var amt = P, st = [];
      for (var y = 1; y <= t; y++) { var nx = c2(amt * (1 + r / 100)); st.push('Year ' + y + ': ' + m(amt) + ' &times; ' + (1 + r / 100) + ' = ' + m(nx) + '.'); amt = nx; }
      if (lv === 2) return money({ q: '$' + A.fmt(P) + ' earns ' + r + '% interest, compounded once a year. What is it worth after ' + t + ' years? Round to the cent.', answer: P * Math.pow(1 + r / 100, t), tol: 0.03, fig: growth(P, r, t),
        hint: 'Multiply by ' + (1 + r / 100) + ' once for each year. Or: P &times; ' + (1 + r / 100) + '<sup>' + t + '</sup>.', steps: st, explain: 'After ' + t + ' years: ' + m(P * Math.pow(1 + r / 100, t)) + '.' });
      var cmp = P * Math.pow(1 + r / 100, t), simp = P * (1 + r / 100 * t);
      return money({ q: '$' + A.fmt(P) + ' is saved at ' + r + '% a year for ' + t + ' years. How much more does compound interest give than simple interest? Round to the cent.', answer: cmp - simp, tol: 0.03, fig: growth(P, r, t),
        hint: 'Find both totals, then subtract.', steps: ['Simple: ' + A.fmt(P) + ' + ' + A.fmt(P) + ' &times; ' + r / 100 + ' &times; ' + t + ' = ' + m(simp) + '.', 'Compound: ' + A.fmt(P) + ' &times; ' + (1 + r / 100) + '<sup>' + t + '</sup> &asymp; ' + m(cmp) + '.', 'Difference: ' + m(cmp - simp) + '.'], explain: 'Compound gives ' + m(cmp - simp) + ' more.' });
    } },
    { id: 'mo-value', name: 'Best value', code: 'F1.5', gen: function (lv) {
      if (lv === 1) {
        var u1 = R.int(80, 200) / 100, u2 = u1 + R.pick([-1, 1]) * R.int(10, 40) / 100, q1 = R.pick([2, 4, 5]), q2 = R.pick([3, 6, 8]);
        if (u2 <= 0.3) u2 = u1 + 0.25;
        var p1 = c2(u1 * q1), p2 = c2(u2 * q2), up1 = p1 / q1, up2 = p2 / q2, best = up1 < up2 ? 0 : 1;
        var o = [q1 + ' for $' + p1.toFixed(2), q2 + ' for $' + p2.toFixed(2)];
        return { q: 'Granola bars: ' + o[0] + ' or ' + o[1] + '. Which costs less per bar?', type: 'mc', options: o, answer: best, fig: compare(['Pack of ' + q1, up1, m(up1) + ' each'], ['Pack of ' + q2, up2, m(up2) + ' each'], 'Cost per bar.'),
          hint: 'Divide each price by the number of bars.', steps: [p1.toFixed(2) + ' &divide; ' + q1 + ' &asymp; ' + m(up1) + ' each.', p2.toFixed(2) + ' &divide; ' + q2 + ' &asymp; ' + m(up2) + ' each.', 'The lower one is better value.'], explain: o[best] + ' is cheaper per bar.' };
      }
      if (lv === 2) { var pr = R.int(4, 60) * 5, off = R.pick([15, 20, 25, 30, 40]), sale = pr * (1 - off / 100), withTax = R.int(0, 1), ans = withTax ? sale * 1.13 : sale;
        return money({ q: 'A $' + pr + ' jacket is ' + off + '% off.' + (withTax ? ' Then 13% HST is added. What is the total? Round to the cent.' : ' What is the sale price?'), answer: ans,
          hint: off + '% off leaves ' + (100 - off) + '%. Multiply by ' + (100 - off) / 100 + (withTax ? ', then by 1.13.' : '.'), steps: [pr + ' &times; ' + (100 - off) / 100 + ' = ' + m(sale) + '.'].concat(withTax ? [m(sale) + ' &times; 1.13 = ' + m(ans) + '.'] : []), explain: 'You pay ' + m(ans) + '.' }); }
      var price = R.int(3, 9) + 0.99, pts = R.pick([10, 15, 20]), need = R.pick([1000, 2000]), worth = need === 1000 ? 1 : 2, spend = R.int(5, 40) * 10;
      if (R.int(0, 1)) {
        var a = price * 3 * (1 - 0.25), b = price * 2;
        return { q: 'Socks cost $' + price.toFixed(2) + ' a pair. Store A: 25% off when you buy 3 pairs. Store B: buy 2, get 1 free. Which is cheaper for 3 pairs?', type: 'mc', options: ['Store B', 'Store A', 'Same'], answer: 0,
          hint: 'Find the cost of 3 pairs at each store.', steps: ['A: 3 &times; ' + price.toFixed(2) + ' &times; 0.75 = ' + m(a) + '.', 'B: you pay for 2: ' + m(b) + '.', 'B is cheaper: buy 2 get 1 free is like 33% off.'], explain: 'Store B: ' + m(b) + ' vs ' + m(a) + '.' };
      }
      var earned = spend * pts, val = earned / need * worth;
      return money({ q: 'A loyalty card gives ' + pts + ' points per dollar. ' + A.fmt(need) + ' points are worth $' + worth + ' off. You spend $' + spend + '. What are your points worth?', answer: val,
        hint: 'Points earned = dollars &times; ' + pts + '. Then divide by ' + A.fmt(need) + ' and multiply by $' + worth + '.', steps: ['Points: ' + spend + ' &times; ' + pts + ' = ' + A.fmt(earned) + '.', A.fmt(earned) + ' &divide; ' + A.fmt(need) + ' &times; ' + worth + ' = ' + m(val) + '.', 'That is ' + Math.round(val / spend * 1000) / 10 + '% back.'], explain: 'Your points are worth ' + m(val) + '.' });
    } },
    { id: 'mo-credit', name: 'Credit and contracts', code: 'F1.6', gen: function (lv) {
      if (lv === 1) { var bal = R.int(4, 40) * 50, rate = R.pick([12, 18, 19.99, 24]), mi = bal * rate / 100 / 12;
        return money({ q: 'You leave $' + A.fmt(bal) + ' unpaid on a credit card that charges ' + rate + '% a year. About how much interest is charged for one month? Round to the cent.', answer: mi,
          hint: 'One month is 1/12 of a year. Find the yearly interest, then divide by 12.', steps: ['Yearly: ' + A.fmt(bal) + ' &times; ' + rate / 100 + ' = ' + m(bal * rate / 100) + '.', 'Monthly: &divide; 12 = ' + m(mi) + '.'], explain: 'About ' + m(mi) + ' in one month.' }); }
      if (lv === 2) { var mA = R.int(5, 12) * 5, up = R.int(0, 6) * 100, term = R.pick([12, 24]), totc = mA * term + up;
        return money({ q: 'A phone contract is $' + mA + ' a month for ' + term + ' months, plus $' + up + ' up front. What is the total cost?', answer: totc,
          hint: 'Monthly cost &times; months, plus the up-front cost.', steps: [mA + ' &times; ' + term + ' = ' + A.fmt(mA * term) + '.', 'Plus ' + up + ': ' + m(totc) + '.'], explain: 'The total is ' + m(totc) + '.' }); }
      var spend = R.int(3, 20) * 1000, fee = R.pick([79, 99, 120, 150]), ra = R.pick([0.5, 1]), rb = R.pick([2, 3]), na = spend * ra / 100, nb = spend * rb / 100 - fee;
      if (c2(na) === c2(nb)) spend += 1000, na = spend * ra / 100, nb = spend * rb / 100 - fee;
      var best = na > nb ? 0 : 1;
      return { q: 'You spend $' + A.fmt(spend) + ' a year on a card. Card A: no fee, ' + ra + '% cash back. Card B: $' + fee + ' fee, ' + rb + '% cash back. Which leaves you better off?', type: 'mc', options: ['Card A', 'Card B'], answer: best,
        hint: 'For each card: cash back minus the fee.', steps: ['A: ' + A.fmt(spend) + ' &times; ' + ra / 100 + ' = ' + m(na) + '.', 'B: ' + A.fmt(spend) + ' &times; ' + rb / 100 + ' &minus; ' + fee + ' = ' + m(nb) + '.', 'The bigger net amount wins.'], explain: (best ? 'Card B' : 'Card A') + ': ' + m(Math.max(na, nb)) + ' vs ' + m(Math.min(na, nb)) + '.' };
    } }
  ];

  var quiz = [
    { q: 'You have 200 EUR. At 1 EUR = $1.48 CAD (an example rate), how much is that in Canadian dollars?', type: 'num', unit: '$', answer: 296, tol: 0.005, show: '$296.00', hint: 'Foreign to CAD: multiply by the rate.', explain: '200 &times; 1.48 = $296.00.' },
    { q: 'Income is $450 a month. Expenses are $60, $140, $95 and $120. What is the surplus? (Type a negative number for a deficit.)', type: 'num', unit: '$', answer: 35, tol: 0.005, show: '$35.00', hint: 'Add the expenses, then subtract from income.', explain: '60 + 140 + 95 + 120 = 415, and 450 &minus; 415 = $35.' },
    { q: 'A bike costs $640 before tax. What is the total with 13% HST?', type: 'num', unit: '$', answer: 723.2, tol: 0.005, show: '$723.20', hint: 'Multiply by 1.13.', explain: '640 &times; 1.13 = $723.20.' },
    { q: 'How much simple interest does $2 000 earn at 3% a year for 4 years?', type: 'num', unit: '$', answer: 240, tol: 0.005, show: '$240.00', hint: 'I = P &times; r &times; t.', explain: '2000 &times; 0.03 &times; 4 = $240.' },
    { q: '$1 000 earns 10% interest, compounded yearly. What is it worth after 2 years?', type: 'num', unit: '$', answer: 1210, tol: 0.005, show: '$1210.00', hint: 'Multiply by 1.1 twice.', explain: '1000 &times; 1.1 = 1100, and 1100 &times; 1.1 = $1 210.' },
    { q: 'Rice: 2 kg for $5.40, or 5 kg for $12.50. Which is better value?', type: 'mc', options: ['5 kg for $12.50', '2 kg for $5.40', 'They are the same'], answer: 0, hint: 'Find the price per kilogram of each.', explain: '5.40 &divide; 2 = $2.70 per kg, and 12.50 &divide; 5 = $2.50 per kg. The 5 kg bag is better value.' },
    { q: 'You leave $600 unpaid on a card that charges 18% a year. About how much interest is charged for one month?', type: 'num', unit: '$', answer: 9, tol: 0.005, show: '$9.00', hint: 'Yearly interest &divide; 12.', explain: '600 &times; 0.18 = $108 a year. 108 &divide; 12 = $9 a month.' }
  ];

  A.register('money', {
    fx: { c2: c2, m: m, mp: mp, money: money, exFig: exFig, budgetFig: budgetFig, kf: kf, growth: growth, compare: compare, cardFig: cardFig },
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      A.bind(root, ['exc', 'exa', 'exf'], function () {
        var r = RATES[+$('#exc').value], amt = +$('#exa').value * (r[2] < 0.1 ? 100 : 1), fee = +$('#exf').value, cad = amt * r[2];
        $('#exao').textContent = A.fmt(amt) + ' ' + r[1]; $('#exfo').textContent = fee + '%';
        $('#exfig').innerHTML = exFig(amt, r);
        $('#exout').innerHTML = A.fmt(amt) + ' ' + r[1] + ' &times; ' + r[2] + ' = <b>' + m(cad) + ' CAD</b><br>With a ' + fee + '% card fee: ' + m(cad) + ' + ' + m(cad * fee / 100) + ' = <b>' + m(cad * (1 + fee / 100)) + '</b>' + (fee ? '' : '<br>No fee: some cards and cash avoid it.');
      });
      A.bind(root, ['bui', 'buf', 'bus'], function () {
        var inc = +$('#bui').value, f = +$('#buf').value, sv = +$('#bus').value, items = [['Phone', 35], ['Transit', 60], ['Food and fun', f], ['Savings', sv]];
        $('#buio').textContent = '$' + inc; $('#bufo').textContent = '$' + f; $('#buso').textContent = '$' + sv;
        $('#bufig').innerHTML = budgetFig(inc, items);
        var tot = 95 + f + sv, d = inc - tot;
        $('#buout').innerHTML = 'Spending: 35 + 60 + ' + f + ' + ' + sv + ' = <b>' + m(tot) + '</b>. ' + (d > 0 ? 'Surplus of ' + m(d) + '. You could save it.' : d === 0 ? 'Balanced exactly.' : 'Deficit of ' + m(-d) + '. Cut a variable expense or earn more.');
      });
      A.bind(root, ['inp', 'inr', 'inn'], function () {
        var P = +$('#inp').value, r = +$('#inr').value, n = +$('#inn').value, cmp = P * Math.pow(1 + r / 100, n), simp = P * (1 + r / 100 * n);
        $('#inpo').textContent = '$' + A.fmt(P); $('#inro').textContent = r + '%'; $('#inno').textContent = n;
        $('#infig').innerHTML = growth(P, r, n);
        $('#inout').innerHTML = 'Simple: ' + m(simp) + '<br>Compound: ' + m(cmp) + '<br>Compound earns <b>' + m(cmp - simp) + '</b> more. At ' + r + '%, money roughly doubles every ' + Math.round(72 / r * 10) / 10 + ' years (72 &divide; ' + r + ').';
      });
    }
  });
})();
