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

  /* ---------- question shapes (more ways to ask each skill; checks in tests/verify/grade8.js) ---------- */
  var K = window.K8;
  var SHAPES = {
    'mo-exchange': [
      [1, 'fill', function (lv) {
        var r = R.pick(RATES.slice(0, 3)), amt = R.int(2, 40) * 5, cad = c2(amt * r[2]);
        return { q: 'Convert ' + amt + ' ' + r[1] + ' to Canadian dollars. 1 ' + r[1] + ' = $' + r[2] + ' CAD' + EX + '.', type: 'fill', fill: amt + ' &times; ' + r[2] + ' = $[[]] CAD', answers: [cad], tol: 0.011, fig: exFig(amt, r),
          hint: 'Foreign to CAD: multiply by the rate.', steps: [amt + ' &times; ' + r[2] + ' = ' + m(cad) + '.'], explain: amt + ' ' + r[1] + ' is ' + m(cad) + ' CAD.', meta: { k: 'me-fill', amt: amt, rate: r[2] } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), r = R.pick(RATES.slice(0, 3)), amt = R.int(2, 20) * 10, truth = R.int(0, 1), said = truth ? c2(amt * r[2]) : c2(amt / r[2]);
        return K.tf({ q: '1 ' + r[1] + ' = $' + r[2] + ' CAD' + EX + '. ' + who + ' says ' + amt + ' ' + r[1] + ' is <b>' + m(said) + ' CAD</b>. True or false?', truth: truth,
          right: 'One ' + r[1] + ' is worth more than $1 CAD, so multiply: ' + amt + ' &times; ' + r[2] + ' = ' + m(amt * r[2]) + '.', wrong: ['Always divide by the rate.', 'The amount stays the same in any currency.'],
          hint: 'Is one ' + r[1] + ' worth more or less than one Canadian dollar?', meta: { k: 'me-tf', amt: amt, rate: r[2], said: said } });
      }],
      [1, 'way', function (lv) {
        var who = K.name(), r = R.pick(RATES.slice(0, 3)), c = R.int(2, 40) * 10;
        return K.pick1({ q: who + ' trades <b>$' + c + ' CAD</b> for ' + r[0] + 's. 1 ' + r[1] + ' = $' + r[2] + ' CAD' + EX + '. Which way finds how many ' + r[1] + ' ' + who + ' gets?', right: c + ' &divide; ' + r[2], wrong: [c + ' &times; ' + r[2], c + ' &minus; ' + r[2], r[2] + ' &divide; ' + c],
          hint: 'Each ' + r[1] + ' costs $' + r[2] + '. How many of them fit into $' + c + '?', steps: ['CAD to foreign: divide by the rate.', c + ' &divide; ' + r[2] + ' &asymp; ' + c2(c / r[2]) + ' ' + r[1] + '.'], explain: 'Divide: about ' + A.fmt(c2(c / r[2]).toFixed(2)) + ' ' + r[1] + '.', meta: { k: 'me-way', c: c, rate: r[2] } });
      }]
    ],
    'mo-budget': [
      [1, 'line', function (lv) {
        var items = [['Phone', R.int(4, 10) * 5], ['Transit', R.int(4, 12) * 5], ['Fun', R.int(2, 8) * 5]], tot = items.reduce(function (a, it) { return a + it[1]; }, 0), inc = tot + R.int(1, 10) * 5;
        return { q: 'Income is $' + inc + ' a month. Expenses: ' + items.map(function (it) { return it[0].toLowerCase() + ' $' + it[1]; }).join(', ') + '. Place the surplus on the line.', type: 'line', min: 0, max: 60, tick: 5, every: 10, snap: 5, answer: inc - tot, unit: 'dollars', label: function (v) { return '$' + v; },
          hint: 'Add the expenses. Take that away from the income.', steps: ['Expenses: ' + tot + '.', inc + ' &minus; ' + tot + ' = ' + (inc - tot) + '.'], explain: 'The surplus is ' + m(inc - tot) + '.', meta: { k: 'mb-line', inc: inc, costs: items.map(function (it) { return it[1]; }) } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), items = R.shuffle(['Phone', 'Transit', 'Food', 'Fun']).slice(0, 3).map(function (nm) { return [nm, R.int(3, 20) * 5]; }), tot = items.reduce(function (a, it) { return a + it[1]; }, 0), inc = tot + R.pick([-1, 1]) * R.int(1, 8) * 5, truth = inc >= tot;
        return K.tf({ q: 'Income is $' + inc + ' a month. Expenses: ' + items.map(function (it) { return it[0].toLowerCase() + ' $' + it[1]; }).join(', ') + '. ' + who + ' says this budget has money left over. True or false?', truth: truth,
          right: 'Expenses add to $' + tot + '. ' + (inc >= tot ? 'Income is more, so there is a surplus of ' + m(inc - tot) + '.' : 'That is more than the income, so there is a deficit of ' + m(tot - inc) + '.'), wrong: ['A budget always has money left over.', 'Only the biggest expense matters.'],
          hint: 'Add up the expenses first.', meta: { k: 'mb-tf', inc: inc, costs: items.map(function (it) { return it[1]; }) } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), w = R.pick([15, 20, 25, 30, 40]), goal = R.int(8, 40) * 10, what = R.pick(['a new bike', 'hockey camp', 'a tablet', 'concert tickets']), weeks = Math.ceil(goal / w);
        return { q: who + ' earns <b>$' + w + '</b> a week babysitting and saves all of it for ' + what + ' that costs <b>$' + goal + '</b>. How many weeks until ' + who + ' has enough?', type: 'num', answer: weeks, unit: 'weeks',
          hint: 'Divide the cost by the weekly savings. If it does not come out even, round up.', steps: [goal + ' &divide; ' + w + ' &asymp; ' + Math.round(goal / w * 100) / 100 + '.', 'Round up: ' + weeks + ' weeks.'], explain: 'After ' + weeks + ' weeks ' + who + ' has $' + weeks * w + ', which is enough.', meta: { k: 'mb-story', w: w, goal: goal } };
      }]
    ],
    'mo-tax': [
      [1, 'tap', function (lv) {
        var p = R.pick([R.int(2, 19), R.int(21, 60)]) * 5, t = [c2(p * 0.13), p + 13, c2(p * 1.3), c2(p * 0.013)], tiles = R.shuffle(t);
        return { q: 'How much 13% HST is charged on a $' + p + ' item? Tap it.', type: 'tap', tiles: tiles.map(m), answer: tiles.indexOf(t[0]), answerText: m(t[0]),
          hint: '13% = 0.13. Multiply the price by 0.13.', steps: [p + ' &times; 0.13 = ' + m(p * 0.13) + '.'], explain: 'The HST is ' + m(p * 0.13) + '.', meta: { k: 'mt-tap', p: p } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), p = R.pick([R.int(4, 19), R.int(21, 60)]) * 5, truth = R.int(0, 1), said = truth ? c2(p * 1.13) : p + 13;
        return K.tf({ q: 'An item costs $' + p + '. ' + who + ' says the total with 13% HST is <b>' + m(said) + '</b>. True or false?', truth: truth,
          right: '13% of $' + p + ' is ' + m(p * 0.13) + ', so the total is ' + m(p * 1.13) + '.', wrong: ['13% HST means add $13.', 'HST is already in every price tag.'],
          hint: '13% is 13 cents for every dollar, not 13 dollars.', meta: { k: 'mt-tf', p: p, said: said } });
      }],
      [1, 'fill', function (lv) {
        var p = R.int(4, 60) * 5 - R.pick([0, 0.01, 0.05]), tax = c2(p * 0.13);
        return { q: 'Find the total cost of a $' + p.toFixed(2) + ' item with 13% HST.', type: 'fill', fill: 'HST: $[[]] &nbsp; Total: $[[]]', answers: [tax, c2(p + tax)], tol: 0.011,
          hint: 'HST = price &times; 0.13. Then add it to the price.', steps: [p.toFixed(2) + ' &times; 0.13 &asymp; ' + m(tax) + '.', p.toFixed(2) + ' + ' + tax.toFixed(2) + ' = ' + m(p + tax) + '.'], explain: 'Total: ' + m(p + tax) + '.', meta: { k: 'mt-fill', p: p } };
      }],
      [2, 'way', function (lv) {
        var pre = R.pick([R.int(5, 49), R.int(51, 100)]) * 2, tot = c2(pre * 1.13);
        return K.pick1({ q: 'A receipt total is <b>$' + tot.toFixed(2) + '</b>, including 13% HST. Which way finds the price before tax?', right: tot.toFixed(2) + ' &divide; 1.13', wrong: [tot.toFixed(2) + ' &times; 0.87', tot.toFixed(2) + ' &minus; 13', tot.toFixed(2) + ' &times; 1.13'],
          hint: 'The total is 113% of the price. Undo multiplying by 1.13.', steps: ['Total = price &times; 1.13, so price = total &divide; 1.13.'], explain: tot.toFixed(2) + ' &divide; 1.13 = ' + m(pre) + '.', meta: { k: 'mt-way', pre: pre } });
      }]
    ],
    'mo-interest': [
      [1, 'fill', function (lv) {
        var P = R.int(2, 50) * 100, r = R.int(2, 8), t = R.int(1, 5);
        return { q: 'Find the simple interest on $' + A.fmt(P) + ' at ' + r + '% a year for ' + t + ' year' + (t > 1 ? 's' : '') + '.', type: 'fill', fill: 'I = ' + A.fmt(P) + ' &times; ' + r / 100 + ' &times; ' + t + ' = $[[]]', answers: [P * r * t / 100], tol: 0.011,
          hint: 'I = P &times; r &times; t.', steps: [A.fmt(P) + ' &times; ' + r / 100 + ' = ' + P * r / 100 + ' a year.', 'Times ' + t + ' = ' + P * r * t / 100 + '.'], explain: 'The interest is ' + m(P * r * t / 100) + '.', meta: { k: 'mi-fill', P: P, r: r, t: t } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), P = R.int(2, 20) * 100, r = R.int(2, 8), t = R.pick([1, 2, 3, 5]), cmp = P * Math.pow(1 + r / 100, t), simp = P * (1 + r / 100 * t);
        return K.tf({ q: '$' + A.fmt(P) + ' is saved at ' + r + '% a year for ' + t + ' year' + (t > 1 ? 's' : '') + '. ' + who + ' says compound interest gives <b>more</b> than simple interest here. True or false?', truth: cmp - simp > 0.005,
          right: t === 1 ? 'In the first year both earn the same: ' + m(P * r / 100) + '. Compound interest only pulls ahead after the first year.' : 'Compound: ' + m(cmp) + '. Simple: ' + m(simp) + '. Compound earns interest on interest, so it gives more.', wrong: ['Compound interest always gives more, from day one.', 'Simple interest always gives more.'],
          hint: 'In year 1, is there any interest yet to earn interest on?', meta: { k: 'mi-tf', P: P, r: r, t: t } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), P = R.int(2, 20) * 100, r = R.pick([2, 3, 4, 5]), t = R.int(2, 5);
        return money({ q: who + ' puts <b>$' + A.fmt(P) + '</b> of birthday money into a GIC that pays <b>' + r + '%</b> simple interest a year. How much will it be worth after <b>' + t + ' years</b>?', answer: P * (1 + r * t / 100),
          hint: 'Find the interest (P &times; r &times; t), then add it to what ' + who + ' put in.', steps: ['Interest: ' + A.fmt(P) + ' &times; ' + r / 100 + ' &times; ' + t + ' = ' + m(P * r * t / 100) + '.', 'Total: ' + A.fmt(P) + ' + ' + P * r * t / 100 + ' = ' + m(P * (1 + r * t / 100)) + '.'], explain: 'It will be worth ' + m(P * (1 + r * t / 100)) + '.', meta: { k: 'mi-story', P: P, r: r, t: t } });
      }],
      [2, 'order', function (lv) {
        return K.until(function () {
          var list = [0, 1, 2].map(function () { var P = R.int(5, 30) * 100, r = R.int(2, 8), t = R.int(1, 5); return [P, r, t, P * r * t / 100]; });
          if (new Set(list.map(function (x) { return x[3]; })).size < 3) return null;
          list.sort(function (a, b) { return a[3] - b[3]; });
          return { q: 'Put these savings in order of the simple interest they earn, least to most.', type: 'order', items: list.map(function (x) { return '$' + A.fmt(x[0]) + ' at ' + x[1] + '% for ' + x[2] + ' yr'; }), first: 'least', last: 'most',
            hint: 'Work out P &times; r &times; t for each.', steps: list.map(function (x) { return A.fmt(x[0]) + ' &times; ' + x[1] / 100 + ' &times; ' + x[2] + ' = ' + m(x[3]); }), explain: 'Interest: ' + list.map(function (x) { return m(x[3]); }).join(', ') + '.', meta: { k: 'mi-order' } };
        });
      }]
    ],
    'mo-value': [
      [1, 'tap', function (lv) {
        return K.until(function () {
          var offers = [3, 4, 6].map(function (q) { return [q, c2(q * R.int(60, 160) / 100)]; }), unit = offers.map(function (o) { return o[1] / o[0]; }), lo = Math.min.apply(null, unit);
          if (unit.filter(function (u) { return Math.abs(u - lo) < 0.01; }).length > 1) return null;
          var tiles = R.shuffle(offers).map(function (o) { return o[0] + ' for $' + o[1].toFixed(2); }), best = offers[unit.indexOf(lo)];
          return { q: 'Juice boxes come in three packs. Tap the best value.', type: 'tap', tiles: tiles, answer: tiles.indexOf(best[0] + ' for $' + best[1].toFixed(2)), answerText: best[0] + ' for $' + best[1].toFixed(2),
            hint: 'Find the cost of one juice box in each pack.', steps: offers.map(function (o) { return '$' + o[1].toFixed(2) + ' &divide; ' + o[0] + ' &asymp; ' + m(o[1] / o[0]) + ' each.'; }), explain: 'The lowest cost for one box is the best value.', meta: { k: 'mu-tap' } };
        });
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), P = R.int(4, 30) * 10, a = R.pick([10, 20, 25]), b = R.pick([10, 20]), truth = R.int(0, 1), said = truth ? c2(P * (1 - a / 100) * (1 - b / 100)) : c2(P * (1 - (a + b) / 100));
        return K.tf({ q: 'A $' + P + ' coat is ' + a + '% off, and then a coupon takes another ' + b + '% off the sale price. ' + who + ' says the final price is <b>' + m(said) + '</b>. True or false?', truth: truth,
          right: 'Two discounts in a row: ' + P + ' &times; ' + (1 - a / 100) + ' &times; ' + (1 - b / 100) + ' = ' + m(P * (1 - a / 100) * (1 - b / 100)) + '. That is not the same as ' + (a + b) + '% off.', wrong: ['Add the two percents and take that much off.', 'The second discount is taken off the original price.'],
          hint: 'The second discount is a percent of the sale price, not the original.', meta: { k: 'mu-tf', P: P, a: a, b: b, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), P = R.int(10, 60) * 5, off = R.pick([5, 10]), pc = R.pick([10, 15, 20]), save = P * pc / 100;
        if (save === off) P += 10, save = P * pc / 100;
        var right = save > off ? pc + '% off' : '$' + off + ' off';
        return K.pick1({ q: who + ' wants a $' + P + ' pair of shoes. One coupon gives <b>$' + off + ' off</b>. Another gives <b>' + pc + '% off</b>. Which saves more?', right: right, wrong: [save > off ? '$' + off + ' off' : pc + '% off'],
          hint: 'Work out ' + pc + '% of $' + P + ' and compare it with $' + off + '.', steps: [pc + '% of ' + P + ' = ' + m(save) + '.', 'Compare with $' + off + '.'], explain: pc + '% off saves ' + m(save) + '; the other saves $' + off + '. ' + right + ' saves more.', meta: { k: 'mu-story', P: P, off: off, pc: pc } });
      }]
    ],
    'mo-credit': [
      [1, 'fill', function (lv) {
        var mA = R.int(5, 12) * 5, up = R.int(0, 6) * 50, term = R.pick([12, 24]);
        return { q: 'A phone contract is $' + mA + ' a month for ' + term + ' months, plus $' + up + ' up front. Find the total cost.', type: 'fill', fill: mA + ' &times; ' + term + ' = $[[]], plus ' + up + ' = $[[]]', answers: [mA * term, mA * term + up],
          hint: 'Monthly cost times months, then add the up-front cost.', steps: [mA + ' &times; ' + term + ' = ' + mA * term + '.', mA * term + ' + ' + up + ' = ' + (mA * term + up) + '.'], explain: 'The total is ' + m(mA * term + up) + '.', meta: { k: 'mk-fill', mA: mA, term: term, up: up } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), bal = R.int(4, 40) * 50, rate = R.pick([12, 18, 24]), truth = R.int(0, 1), said = truth ? c2(bal * rate / 1200) : c2(bal * rate / 100);
        return K.tf({ q: 'A credit card charges ' + rate + '% a year. ' + who + ' leaves $' + A.fmt(bal) + ' unpaid and says one month of interest is <b>' + m(said) + '</b>. True or false?', truth: truth,
          right: rate + '% is the yearly rate. One month is 1/12 of that: ' + A.fmt(bal) + ' &times; ' + rate / 100 + ' &divide; 12 = ' + m(bal * rate / 1200) + '.', wrong: ['The yearly rate is charged every month.', 'There is no interest in the first month.'],
          hint: 'Is ' + rate + '% for a month or for a year?', meta: { k: 'mk-tf', bal: bal, rate: rate, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), a = R.int(5, 9) * 5, b = a + R.int(1, 3) * 5, upA = R.int(2, 8) * 100, term = 24, totA = a * term + upA, totB = b * term;
        if (totA === totB) upA += 50, totA = a * term + upA;
        var right = totA < totB ? 'Plan A' : 'Plan B';
        return K.pick1({ q: who + ' compares two 24-month phone plans. <b>Plan A:</b> $' + a + ' a month plus $' + upA + ' up front. <b>Plan B:</b> $' + b + ' a month, nothing up front. Which costs less in total?', right: right, wrong: [right === 'Plan A' ? 'Plan B' : 'Plan A'],
          hint: 'Find the total for each plan over 24 months.', steps: ['A: ' + a + ' &times; 24 + ' + upA + ' = ' + totA + '.', 'B: ' + b + ' &times; 24 = ' + totB + '.'], explain: right + ' costs less: ' + m(Math.min(totA, totB)) + ' vs ' + m(Math.max(totA, totB)) + '.', meta: { k: 'mk-story', a: a, b: b, upA: upA } });
      }]
    ]
  };
  K.shapes('money', SHAPES);
})();
