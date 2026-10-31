(function () {
  var A = Atlas, R = A.R, cl = A.clean;
  function r2(x) { return Math.round(x * 100) / 100; }
  function m(x) { return '$' + A.fmt(r2(x).toFixed(2)); }
  function m0(x) { return '$' + A.fmt(String(Math.round(x))); }
  /* sample rates: how many Canadian dollars one unit of the other currency costs */
  var CUR = [
    { c: 'USD', n: 'US dollars', one: 'US dollar', r: 1.38, sym: 'US$' },
    { c: 'EUR', n: 'euros', one: 'euro', r: 1.5, sym: '&euro;' },
    { c: 'GBP', n: 'British pounds', one: 'British pound', r: 1.75, sym: '&pound;' },
    { c: 'MXN', n: 'Mexican pesos', one: 'Mexican peso', r: 0.075, sym: 'MX$' },
    { c: 'JPY', n: 'Japanese yen', one: 'Japanese yen', r: 0.0092, sym: '&yen;' }
  ];
  function rs(r) { return r >= 0.1 ? r.toFixed(2) : String(r); }
  function fx(cur, x) { return cur.sym + A.fmt(cur.c === 'JPY' ? String(Math.round(x)) : r2(x).toFixed(2)); }

  /* two bars: the foreign amount and the same money in Canadian dollars */
  function exch(f, cur) {
    var cad = f * cur.r, s = '', L = 260, big = Math.max(f, cad, 1), w1 = L * f / big, w2 = L * cad / big;
    s += '<text x="8" y="36" font-size="22" font-weight="700">' + cur.c + '</text><rect x="70" y="14" width="' + Math.max(w1, 2) + '" height="34" style="fill:var(--sb);stroke:var(--ink)" stroke-width="1.5"/>' +
      '<text x="' + (78 + w1) + '" y="38" font-size="22" font-weight="700">' + fx(cur, f) + '</text>';
    s += '<text x="8" y="94" font-size="22" font-weight="700">CAD</text><rect x="70" y="72" width="' + Math.max(w2, 2) + '" height="34" style="fill:var(--se);stroke:var(--ink)" stroke-width="1.5"/>' +
      '<text x="' + (78 + w2) + '" y="96" font-size="22" font-weight="700">' + m(cad) + '</text>';
    s += '<text x="8" y="138" font-size="19" class="t2">Same value, different number of units.</text>';
    return A.svg(540, 146, s, fx(cur, f).replace(/&[a-z]+;/, '') + ' ' + cur.n + ' is worth ' + m(cad) + ' Canadian');
  }
  /* savings growing week by week toward a goal line */
  function plan(goal, start, per) {
    var n = per > 0 ? Math.max(0, Math.ceil((goal - start) / per)) : 0, show = per > 0 ? Math.min(n, 24) : 8, s = '';
    var top = Math.max(goal, start + Math.max(per, 0) * show) * 1.08, H = 190, y = function (v) { return 20 + H * (1 - v / top); }, bw = 460 / Math.max(show + 1, 6);
    for (var i = 0; i <= show; i++) {
      var v = per > 0 ? start + per * i : start, x = 70 + i * bw, done = v >= goal;
      s += '<rect x="' + (x + 2) + '" y="' + y(v) + '" width="' + (bw - 4) + '" height="' + (y(0) - y(v)) + '" style="fill:' + (done ? 'var(--good)' : 'var(--sf)') + ';stroke:var(--ink)" stroke-width="1"/>';
      if (show <= 12 || i % 4 === 0) s += '<text x="' + (x + bw / 2) + '" y="' + (y(0) + 20) + '" text-anchor="middle" font-size="18">' + i + '</text>';
    }
    s += '<line x1="66" y1="' + y(0) + '" x2="534" y2="' + y(0) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<line x1="66" y1="' + y(goal) + '" x2="534" y2="' + y(goal) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="8 5"/><text x="62" y="' + (y(goal) + 6) + '" text-anchor="end" font-size="19" font-weight="700" style="fill:var(--bad)">' + m0(goal) + '</text>';
    s += '<text x="300" y="' + (y(0) + 42) + '" text-anchor="middle" font-size="18" class="t2">week</text>';
    return A.svg(540, H + 70, s, per > 0 ? 'Savings start at ' + m0(start) + ' and grow ' + m(per) + ' each week. They reach the goal of ' + m0(goal) + ' after ' + n + ' weeks.' : 'Savings do not grow, so the goal is never reached.');
  }
  /* a stacked bar: where a weekly income goes */
  function split(parts) {
    var tot = parts.reduce(function (a, p) { return a + p.v; }, 0), x = 10, s = '';
    parts.forEach(function (p, i) {
      var w = 520 * p.v / tot;
      s += '<rect x="' + x + '" y="10" width="' + w + '" height="46" style="fill:' + p.col + ';stroke:var(--ink)" stroke-width="1.5"/>';
      s += '<text x="' + (x + w / 2) + '" y="' + (86 + (i % 2) * 26) + '" text-anchor="middle" font-size="20" font-weight="700">' + p.lab + ' ' + m0(p.v) + '</text>';
      x += w;
    });
    return A.svg(540, 124, s, 'Budget: ' + parts.map(function (p) { return p.lab + ' ' + m0(p.v); }).join(', '));
  }
  /* money in an account over the years: simple interest bars, compound interest dots */
  function growth(P, rate, yrs) {
    var top = P * Math.pow(1 + rate / 100, yrs) * 1.06, H = 200, s = '', y = function (v) { return 20 + H * (1 - v / top); }, bw = 440 / (yrs + 1);
    for (var i = 0; i <= yrs; i++) {
      var x = 90 + i * bw, si = P * (1 + rate / 100 * i), co = P * Math.pow(1 + rate / 100, i);
      s += '<rect x="' + (x + 3) + '" y="' + y(P) + '" width="' + (bw - 6) + '" height="' + (y(0) - y(P)) + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="1"/>';
      s += '<rect x="' + (x + 3) + '" y="' + y(si) + '" width="' + (bw - 6) + '" height="' + (y(P) - y(si)) + '" style="fill:var(--bad);stroke:var(--ink)" stroke-width="1"/>';
      s += '<circle cx="' + (x + bw / 2) + '" cy="' + y(co) + '" r="6" style="fill:var(--se);stroke:var(--ink)" stroke-width="1.5"/>';
      if (yrs <= 10 || i % 2 === 0) s += '<text x="' + (x + bw / 2) + '" y="' + (y(0) + 20) + '" text-anchor="middle" font-size="18">' + i + '</text>';
    }
    s += '<line x1="86" y1="' + y(0) + '" x2="534" y2="' + y(0) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="82" y="' + (y(P) + 6) + '" text-anchor="end" font-size="18">' + m0(P) + '</text><text x="82" y="' + (y(top / 1.06) + 6) + '" text-anchor="end" font-size="18" style="fill:var(--se)">' + m0(top / 1.06) + '</text>';
    s += '<text x="310" y="' + (y(0) + 42) + '" text-anchor="middle" font-size="18" class="t2">years</text>';
    return A.svg(540, H + 70, s, m0(P) + ' at ' + rate + '% for ' + yrs + ' years. Simple interest grows to ' + m(P * (1 + rate / 100 * yrs)) + '. Compound interest grows to ' + m(P * Math.pow(1 + rate / 100, yrs)) + '.');
  }

  A.register('money', {
    html:
'<section class="sec"><h2><span class="n">1</span>Exchange rates</h2>' +
'<p>Other countries use other money. An <b>exchange rate</b> tells you how much one currency is worth in another. Rates change every day. The rates in this chapter are <b>sample rates</b> for practice. For a real trip, look up today&rsquo;s rate from a bank.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Currency</th><th>1 unit costs (sample)</th></tr></thead><tbody>' +
CUR.map(function (c) { return '<tr><td class="l">1 ' + c.one + ' (' + c.c + ')</td><td>' + (c.r < 0.1 ? '$' + c.r : m(c.r)) + ' CAD</td></tr>'; }).join('') + '</tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p><b>Other money to Canadian:</b> multiply by the rate. 50 USD &times; 1.38 = $69.00 CAD.<br><b>Canadian to other money:</b> divide by the rate. $69.00 &divide; 1.38 = 50 USD.</p></div>' +
'<div class="fig">' + exch(50, CUR[0]) + '</div>' +
'<div class="lab"><span class="lt">Try it: convert money</span>' +
'<div class="ctrl"><label for="xcur">Currency<select id="xcur">' + CUR.map(function (c, i) { return '<option value="' + i + '">' + c.n + ' (' + c.c + ')</option>'; }).join('') + '</select></label>' +
'<label for="xamt">Amount: <output id="xamto"></output><input type="range" id="xamt" min="0" max="1000" step="10" value="200"></label>' +
'<label for="xdir">Direction<select id="xdir"><option value="1">to Canadian dollars</option><option value="-1">from Canadian dollars</option></select></label></div>' +
'<div class="fig" id="xfig"></div><div class="out" id="xout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Check that the answer makes sense. One US dollar is worth <b>more</b> than one Canadian dollar, so you get <b>fewer</b> US dollars than the Canadian dollars you hand over. If you got more, you multiplied when you should have divided.</p></div>' +
'<div class="eg"><b class="t">Worked example: compare rates</b><p>You want 100 USD. Bank A sells USD at $1.41 CAD each. Bank B sells them at $1.37 CAD each, with a $3 fee.</p><p>Bank A: 100 &times; 1.41 = $141.00. Bank B: 100 &times; 1.37 + 3 = $140.00. <b>Bank B costs $1 less.</b></p></div>' +
A.yt({ q: 'With the sample rate 1 EUR = $1.50 CAD, how many Canadian dollars is 40 EUR?', answer: 60, unit: '$', tol: 0.01, hint: 'Euros to Canadian: multiply by the rate.', explain: '40 &times; 1.50 = $60.00 CAD.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Budgets for big goals</h2>' +
'<p>A <b>budget</b> is a plan for your money: what comes in (<b>income</b>), what goes out (<b>expenses</b>), and what you <b>save</b>. A long-term goal, like a bike or a trip, can take months. A budget shows how long, and what to change if it is too slow.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Maya earns $40 a week babysitting. She spends $15 on needs and $10 on wants, and saves the rest.</p><div class="fig">' + split([{ lab: 'Needs', v: 15, col: 'var(--sc)' }, { lab: 'Wants', v: 10, col: 'var(--se)' }, { lab: 'Save', v: 15, col: 'var(--good)' }]) + '</div>' +
'<p>She has $30 saved and wants a $210 bike. She still needs 210 &minus; 30 = $180. At $15 a week: 180 &divide; 15 = <b>12 weeks</b>.</p></div>' +
'<div class="steps"><b class="t">Track and adjust</b><ol><li><b>Track</b>: each week, write what you earned, spent and saved.</li><li><b>Compare</b>: are you on plan? Did something cost more?</li><li><b>Adjust</b>: spend less on wants, earn a bit more, or move the date.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: plan a savings goal</span>' +
'<div class="ctrl"><label for="bgoal">Goal: <output id="bgoalo"></output><input type="range" id="bgoal" min="50" max="1000" step="10" value="210"></label>' +
'<label for="bsave">Already saved: <output id="bsaveo"></output><input type="range" id="bsave" min="0" max="300" step="5" value="30"></label>' +
'<label for="binc">Weekly income: <output id="binco"></output><input type="range" id="binc" min="0" max="100" step="5" value="40"></label>' +
'<label for="bexp">Weekly spending: <output id="bexpo"></output><input type="range" id="bexp" min="0" max="100" step="5" value="25"></label></div>' +
'<div class="fig" id="bfig"></div><div class="out" id="bout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Weeks to goal = money still needed &divide; savings per week. If it does not divide evenly, <b>round up</b>, because after the last full week you are still short.</p></div>' +
A.yt({ q: 'Leo needs $150 more for a game console. He saves $20 a week. How many weeks until he has enough?', answer: 8, unit: 'weeks', hint: '150 &divide; 20 = 7.5. Can he buy it after 7 weeks?', explain: '150 &divide; 20 = 7.5. After 7 weeks he has $140, still short. He needs <b>8 weeks</b>.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Good information and good choices</h2>' +
'<p>Before a big money decision, get information from <b>reliable sources</b>. A reliable source is accurate, up to date, and is not just trying to sell you something.</p>' +
'<div class="vs"><div><b class="t">More reliable</b><p>A bank or credit union website</p><p>The Financial Consumer Agency of Canada (a government agency)</p><p>A parent, teacher, or trusted adult who has done it</p><p>Price comparison of several stores</p></div><div><b class="t">Less reliable</b><p>An ad that says &ldquo;Best deal ever!&rdquo;</p><p>A social media post from a stranger</p><p>A video paid for by the seller</p><p>One review that you cannot check</p></div></div>' +
'<p>Many things <b>influence</b> money choices. Some are personal and some come from the world around you.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Factor</th><th class="l">How it can affect a choice</th></tr></thead><tbody>' +
'<tr><td class="l">Needs and wants</td><td class="l">Needs come first. Wants can wait or be cut.</td></tr>' +
'<tr><td class="l">Friends and family</td><td class="l">Wanting what friends have can lead to spending you did not plan.</td></tr>' +
'<tr><td class="l">Advertising</td><td class="l">Ads try to make a want feel like a need.</td></tr>' +
'<tr><td class="l">Prices going up (inflation)</td><td class="l">The same money buys less, so a goal may cost more later.</td></tr>' +
'<tr><td class="l">Values</td><td class="l">You may pay more for something made locally or made fairly.</td></tr>' +
'<tr><td class="l">Income changes</td><td class="l">Losing a job or getting fewer hours means changing the budget.</td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Ask three questions before you spend: <b>Do I need it? Can I afford it? Is there a better price or a better time?</b></p></div>' +
A.yt({ q: 'Which is the most reliable place to learn about savings accounts?', type: 'mc', options: ['A pop-up ad', 'The websites of several banks and credit unions', 'A comment on a video', 'A friend who guesses'], answer: 1, hint: 'Which one gives facts you can check and compare?', explain: 'Bank and credit union websites give the real rates and fees, and you can compare several.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Interest</h2>' +
'<p><b>Interest</b> is money paid for using money. When you <b>save</b>, the bank pays you interest. When you <b>borrow</b>, you pay the lender interest. The <b>interest rate</b> is a percent per year.</p>' +
'<div class="key"><b class="t">Simple interest</b><p class="math" style="font-size:1.2rem">I = P &times; r &times; t</p><p>P is the starting amount (principal), r is the rate as a decimal, and t is the time in years.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>You save $400 at 3% a year for 2 years.</p><p>I = 400 &times; 0.03 &times; 2 = <b>$24</b>. You end with 400 + 24 = $424.</p></div>' +
'<div class="vs"><div><b class="t">Simple interest</b><p>Interest only on the starting amount.</p><p>The same amount is added each year.</p></div><div><b class="t">Compound interest</b><p>Interest on the starting amount <b>and</b> on past interest.</p><p>It grows faster every year.</p></div></div>' +
'<div class="lab"><span class="lt">Try it: watch savings grow</span>' +
'<div class="ctrl"><label for="gp">Start: <output id="gpo"></output><input type="range" id="gp" min="100" max="5000" step="100" value="1000"></label>' +
'<label for="gr">Rate: <output id="gro"></output><input type="range" id="gr" min="1" max="20" value="5"></label>' +
'<label for="gy">Years: <output id="gyo"></output><input type="range" id="gy" min="1" max="20" value="10"></label></div>' +
'<div class="fig" id="gfig"></div><div class="out" id="gout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>A high rate is <b>good when you save</b> and <b>bad when you borrow</b>. A credit card at 20% a year can make a $500 purchase cost far more if you take a long time to pay it off.</p></div>' +
A.yt({ q: 'Find the simple interest on $600 at 5% a year for 3 years.', answer: 90, unit: '$', tol: 0.01, hint: 'I = 600 &times; 0.05 &times; 3.', explain: '600 &times; 0.05 = 30 a year. 30 &times; 3 = $90.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Comparing accounts and loans</h2>' +
'<p>Banks and credit unions offer different <b>rates</b> and <b>fees</b>. A fee is a fixed charge, like $4 a month. To find the best option, work out the <b>total</b> for your situation.</p>' +
'<div class="eg"><b class="t">Worked example: savings accounts</b><p>You will keep $800 in an account for 1 year.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Account</th><th>Interest</th><th>Fees</th><th>You gain</th></tr></thead><tbody>' +
'<tr><td class="l">A: 4% a year, $2 a month fee</td><td>$32</td><td>12 &times; $2 = $24</td><td>$8</td></tr>' +
'<tr><td class="l">B: 2% a year, no fee</td><td>$16</td><td>$0</td><td><b>$16</b></td></tr></tbody></table></div>' +
'<p>The higher rate is not the better deal here. The fee eats the interest. <b>Account B is better</b> for $800. With much more money saved, A could win.</p></div>' +
'<div class="eg"><b class="t">Worked example: loans</b><p>You borrow $1000 for 2 years.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Loan</th><th>Interest</th><th>Fee</th><th>Total cost</th></tr></thead><tbody>' +
'<tr><td class="l">X: 6% a year, no fee</td><td>1000 &times; 0.06 &times; 2 = $120</td><td>$0</td><td>$120</td></tr>' +
'<tr><td class="l">Y: 4% a year, $50 fee</td><td>1000 &times; 0.04 &times; 2 = $80</td><td>$50</td><td>$130</td></tr></tbody></table></div>' +
'<p><b>Loan X costs less</b>, even with the higher rate.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Compare the <b>total</b>: interest plus fees. For saving, pick the most you gain. For borrowing, pick the least you pay.</p></div>' +
A.yt({ q: 'Account C pays 3% a year with a $1 monthly fee. Account D pays 1% with no fee. You keep $500 for a year. Which is better?', type: 'mc', options: ['Account C', 'Account D', 'They are the same'], answer: 1, hint: 'C: interest 500 &times; 0.03, minus 12 fees of $1. D: 500 &times; 0.01.', explain: 'C: $15 &minus; $12 = $3. D: $5. Account D is better.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.bind(root, ['xcur', 'xamt', 'xdir'], function () {
        var cur = CUR[+$('#xcur', root).value], a = +$('#xamt', root).value, dir = +$('#xdir', root).value;
        if (cur.r < 0.1 && dir > 0) a *= 10;
        $('#xamto', root).innerHTML = dir > 0 ? A.fmt(String(a)) + ' ' + cur.c : m0(a) + ' CAD';
        var f = dir > 0 ? a : a / cur.r;
        $('#xfig', root).innerHTML = exch(f, cur);
        $('#xout', root).innerHTML = '<p class="big2">' + (dir > 0 ? fx(cur, a) + ' = ' + m(a * cur.r) + ' CAD' : m(a) + ' CAD = ' + fx(cur, f)) + '</p>' +
          '<p>' + (dir > 0 ? 'Multiply by the rate: ' + A.fmt(String(a)) + ' &times; ' + cur.r + ' = ' + A.fmt(r2(a * cur.r).toFixed(2)) + '.' : 'Divide by the rate: ' + A.fmt(String(a)) + ' &divide; ' + cur.r + ' = ' + (cur.c === 'JPY' ? A.fmt(String(Math.round(f))) : A.fmt(r2(f).toFixed(2))) + '.') +
          (cur.r < 0.1 && dir > 0 ? ' (The slider is times 10 for this currency, because each unit is worth little.)' : '') + '</p>';
      });
      A.bind(root, ['bgoal', 'bsave', 'binc', 'bexp'], function () {
        var g = +$('#bgoal', root).value, sv = +$('#bsave', root).value, inc = +$('#binc', root).value, ex = +$('#bexp', root).value, per = inc - ex;
        $('#bgoalo', root).innerHTML = m0(g); $('#bsaveo', root).innerHTML = m0(sv); $('#binco', root).innerHTML = m0(inc); $('#bexpo', root).innerHTML = m0(ex);
        $('#bfig', root).innerHTML = plan(g, sv, per);
        var need = Math.max(0, g - sv), wk = per > 0 ? Math.ceil(need / per) : 0, h;
        if (!need) h = '<p class="big2">Goal reached</p><p>You already have enough saved.</p>';
        else if (per <= 0) h = '<p class="big2">Never, at this rate</p><p>You spend ' + (per ? 'more than' : 'all of') + ' what you earn, so nothing is saved. <b>Adjust:</b> spend less or earn more.</p>';
        else h = '<p class="big2">' + wk + ' week' + (wk > 1 ? 's' : '') + '</p><p>You save ' + m0(inc) + ' &minus; ' + m0(ex) + ' = ' + m0(per) + ' a week. You need ' + m0(g) + ' &minus; ' + m0(sv) + ' = ' + m0(need) + '. ' + m0(need) + ' &divide; ' + m0(per) + (need % per ? ' = ' + cl(need / per) + ', round up to ' + wk : ' = ' + wk) + '.</p>' +
          (ex >= 5 ? '<p>If you cut spending by $5 a week: ' + Math.ceil(need / (per + 5)) + ' weeks.</p>' : '') + (wk > 24 ? '<p>The chart shows the first 24 weeks.</p>' : '');
        $('#bout', root).innerHTML = h;
      });
      A.bind(root, ['gp', 'gr', 'gy'], function () {
        var P = +$('#gp', root).value, r = +$('#gr', root).value, t = +$('#gy', root).value, si = P * r / 100 * t, co = P * Math.pow(1 + r / 100, t);
        $('#gpo', root).innerHTML = m0(P); $('#gro', root).innerHTML = r + '%'; $('#gyo', root).innerHTML = t;
        $('#gfig', root).innerHTML = growth(P, r, t);
        $('#gout', root).innerHTML = '<p><b>Simple interest</b> (red bars): I = ' + A.fmt(String(P)) + ' &times; ' + cl(r / 100) + ' &times; ' + t + ' = ' + m(si) + '. Total ' + m(P + si) + '.</p>' +
          '<p><b>Compound interest</b> (orange dots), added once a year: total ' + m(co) + '. That is ' + m(co - P - si) + ' more than simple interest.</p>';
      });
    },

    quiz: [
      { q: 'Use the sample rate 1 USD = $1.38 CAD. How many Canadian dollars is 50 USD?', type: 'num', answer: 69, unit: '$', tol: 0.01, hint: 'US dollars to Canadian: multiply by the rate.', explain: '50 &times; 1.38 = $69.00 CAD.' },
      { q: 'Use the sample rate 1 EUR = $1.50 CAD. You have $300 CAD. How many euros can you get?', type: 'num', answer: 200, unit: 'EUR', tol: 0.01, hint: 'Canadian to euros: divide by the rate.', explain: '300 &divide; 1.50 = 200 euros.' },
      { q: 'You want 200 USD. Bank A charges $1.40 CAD per USD. Bank B charges $1.37 CAD per USD plus a $5 fee. Which costs less?', type: 'mc', options: ['Bank A', 'Bank B', 'They cost the same'], answer: 1, hint: 'Work out the total for each: amount &times; rate, plus any fee.', explain: 'A: 200 &times; 1.40 = $280. B: 200 &times; 1.37 + 5 = $279. Bank B costs $1 less.' },
      { q: 'Priya wants a $240 tablet. She has $60 saved and saves $15 each week. How many weeks until she can buy it?', type: 'num', answer: 12, unit: 'weeks', fig: plan(240, 60, 15), hint: 'Money still needed &divide; savings per week.', explain: '240 &minus; 60 = 180. 180 &divide; 15 = 12 weeks.' },
      { q: 'Find the simple interest on $500 saved at 4% a year for 3 years.', type: 'num', answer: 60, unit: '$', tol: 0.01, hint: 'I = P &times; r &times; t, with r as a decimal.', explain: '500 &times; 0.04 &times; 3 = $60.' },
      { q: 'You borrow $1200 at 8% simple interest a year for 2 years. How much do you pay back in total?', type: 'num', answer: 1392, unit: '$', tol: 0.01, hint: 'Find the interest first, then add the amount borrowed.', explain: 'Interest: 1200 &times; 0.08 &times; 2 = $192. Total: 1200 + 192 = $1392.' },
      { q: 'An ad says &ldquo;Everyone has this phone. Buy now before it&rsquo;s gone!&rdquo; Which factor is the ad using?', type: 'mc', options: ['Pressure to fit in with others', 'A change in income', 'Prices going down', 'A reliable source of facts'], answer: 0, hint: '&ldquo;Everyone has this&rdquo; is about what other people do.', explain: 'The ad uses pressure to fit in, and a rush. Neither tells you if the phone is a good choice for you.' }
    ],

    practice: [
      { id: 'mo-tocad', name: 'Convert to Canadian dollars', code: 'F1.1', gen: function (lv) {
        var cur = R.pick(lv === 3 ? CUR.slice(3) : CUR.slice(0, 3)), rate = cur.r, f;
        if (lv === 1) { rate = R.pick([1.2, 1.4, 1.5, 1.6, 1.8]); f = R.int(1, 20) * 10; }
        else if (lv === 2) { rate = cl(cur.r + R.int(-6, 6) / 100); f = R.int(12, 480); }
        else f = cur.c === 'JPY' ? R.int(5, 90) * 1000 : R.int(10, 200) * 10;
        var cad = r2(f * rate);
        return { q: 'Use the rate 1 ' + cur.c + ' = $' + rs(rate) + ' CAD. How many Canadian dollars is ' + fx(cur, f) + ' (' + cur.n + ')?', type: 'num', answer: cad, unit: '$', tol: 0.01, fig: lv === 1 ? exch(f, { c: cur.c, n: cur.n, r: rate, sym: cur.sym }) : '',
          hint: 'Other money to Canadian: multiply by the rate.',
          steps: ['Each ' + cur.one + ' is worth $' + rs(rate) + ' CAD.', 'Multiply: ' + A.fmt(String(f)) + ' &times; ' + rate + '.', '= ' + m(cad) + ' CAD.'],
          explain: A.fmt(String(f)) + ' &times; ' + rate + ' = ' + m(cad) + ' CAD.' };
      } },
      { id: 'mo-fromcad', name: 'Convert from Canadian dollars', code: 'F1.1', gen: function (lv) {
        var cur = R.pick(CUR.slice(0, 3));
        if (lv === 3) {
          var amt = R.int(5, 30) * 10, ra = cl(cur.r + R.int(-4, 4) / 100), rb = cl(ra - R.int(1, 5) / 100), fee = R.int(1, 8), ca = r2(amt * ra), cb = r2(amt * rb + fee);
          if (Math.abs(ca - cb) < 0.005) fee += 1, cb = r2(amt * rb + fee);
          var best = ca < cb ? 'Bank A' : 'Bank B', o = R.mc(best, [ca < cb ? 'Bank B' : 'Bank A', 'They cost the same']);
          return { q: 'You want ' + amt + ' ' + cur.c + '. Bank A charges $' + rs(ra) + ' CAD per ' + cur.c + ' with no fee. Bank B charges $' + rs(rb) + ' CAD per ' + cur.c + ' plus a $' + fee + ' fee. Which costs less?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Total for each bank: amount &times; rate, plus any fee.',
            steps: ['Bank A: ' + amt + ' &times; ' + ra + ' = ' + m(ca) + '.', 'Bank B: ' + amt + ' &times; ' + rb + ' + ' + fee + ' = ' + m(cb) + '.', best + ' costs less, by ' + m(Math.abs(ca - cb)) + '.'],
            explain: 'A costs ' + m(ca) + ' and B costs ' + m(cb) + '. ' + best + ' is cheaper.' };
        }
        var rate, f, cad;
        if (lv === 1) { rate = R.pick([1.25, 1.5, 2]); f = R.int(2, 40) * 10; cad = r2(f * rate); }
        else { rate = cl(cur.r + R.int(-6, 6) / 100); cad = R.int(20, 900); f = r2(cad / rate); }
        return { q: 'Use the rate 1 ' + cur.c + ' = $' + rs(rate) + ' CAD. You have ' + m(cad) + ' CAD. How many ' + cur.n + ' can you get?' + (lv > 1 ? ' Round to the nearest cent.' : ''), type: 'num', answer: f, unit: cur.c, tol: lv > 1 ? 0.011 : 0.001,
          hint: 'Canadian to other money: divide by the rate. You should get fewer ' + cur.n + ' than Canadian dollars.',
          steps: ['Each ' + cur.one + ' costs $' + rs(rate) + '.', 'Divide: ' + A.fmt(r2(cad).toFixed(2)) + ' &divide; ' + rate + '.', '= ' + A.fmt(r2(f).toFixed(2)) + ' ' + cur.c + '.'],
          explain: A.fmt(r2(cad).toFixed(2)) + ' &divide; ' + rate + ' = ' + A.fmt(r2(f).toFixed(2)) + ' ' + cur.n + '.' };
      } },
      { id: 'mo-budget', name: 'Budget for a goal', code: 'F1.3', gen: function (lv) {
        var who = R.pick(['Ava', 'Jordan', 'Sam', 'Noor', 'Liam', 'Mei']), item = R.pick(['a bike', 'a guitar', 'a tablet', 'hockey skates', 'a school trip', 'headphones']);
        if (lv === 1) {
          var per = R.pick([5, 10, 15, 20, 25]), n = R.int(3, 15), goal = per * n;
          return { q: who + ' saves ' + m0(per) + ' each week for ' + item + ' that costs ' + m0(goal) + '. How many weeks will it take?', type: 'num', answer: n, unit: 'weeks', fig: plan(goal, 0, per),
            hint: 'Divide the cost by the savings per week.', steps: ['Cost: ' + m0(goal) + '. Savings: ' + m0(per) + ' a week.', m0(goal) + ' &divide; ' + m0(per) + ' = ' + n + '.', n + ' weeks.'], explain: goal + ' &divide; ' + per + ' = ' + n + ' weeks.' };
        }
        if (lv === 2) {
          var inc = R.int(6, 16) * 5, ex = R.int(1, inc / 5 - 2) * 5, s = inc - ex, start = R.int(0, 8) * 10, g = start + R.int(40, 400);
          var need = g - start, w = Math.ceil(need / s);
          return { q: who + ' earns ' + m0(inc) + ' a week and spends ' + m0(ex) + '. The rest is saved. ' + who + ' has ' + m0(start) + ' and wants ' + item + ' for ' + m0(g) + '. How many weeks until there is enough?', type: 'num', answer: w, unit: 'weeks',
            hint: 'Savings per week = income &minus; spending. Then divide the money still needed. Round up.',
            steps: ['Saves ' + inc + ' &minus; ' + ex + ' = ' + m0(s) + ' a week.', 'Still needs ' + g + ' &minus; ' + start + ' = ' + m0(need) + '.', need + ' &divide; ' + s + (need % s ? ' = ' + cl(need / s) + '. Round up: ' + w + ' weeks.' : ' = ' + w + ' weeks.')],
            explain: w + ' weeks.' };
        }
        var wk = R.int(4, 12), each = R.int(3, 25) * 5, st = R.int(0, 10) * 10, gl = st + wk * each;
        return { q: who + ' has ' + m0(st) + ' and wants ' + item + ' for ' + m0(gl) + ' in ' + wk + ' weeks. How much must be saved each week?', type: 'num', answer: each, unit: '$', tol: 0.01,
          hint: 'Find the money still needed, then share it over the weeks.',
          steps: ['Still needs ' + gl + ' &minus; ' + st + ' = ' + m0(gl - st) + '.', 'Share over ' + wk + ' weeks: ' + (gl - st) + ' &divide; ' + wk + '.', '= ' + m0(each) + ' a week.'],
          explain: m0(gl - st) + ' &divide; ' + wk + ' = ' + m0(each) + ' a week.' };
      } },
      { id: 'mo-interest', name: 'Simple interest', code: 'F1.5', gen: function (lv) {
        var P = lv === 1 ? R.int(1, 20) * 100 : R.int(4, 60) * 50, r = lv === 1 ? R.int(1, 10) : R.int(2, 12), t = lv === 1 ? 1 : R.int(2, 6), I = r2(P * r / 100 * t);
        var loan = lv === 3 && R.int(0, 1);
        if (lv === 3) {
          return { q: (loan ? 'You borrow ' + m0(P) + ' at ' + r + '% simple interest a year for ' + t + ' years. How much do you pay back in total?' : 'You save ' + m0(P) + ' at ' + r + '% simple interest a year for ' + t + ' years. How much is in the account at the end?'), type: 'num', answer: r2(P + I), unit: '$', tol: 0.01,
            hint: 'Find the interest with I = P &times; r &times; t. Then add it to the starting amount.',
            steps: ['r = ' + r + '% = ' + cl(r / 100) + '.', 'I = ' + P + ' &times; ' + cl(r / 100) + ' &times; ' + t + ' = ' + m(I) + '.', 'Total: ' + P + ' + ' + A.fmt(I.toFixed(2)) + ' = ' + m(P + I) + '.'],
            explain: 'Interest ' + m(I) + ', total ' + m(P + I) + '.' };
        }
        return { q: 'Find the simple interest on ' + m0(P) + ' at ' + r + '% a year for ' + t + ' year' + (t > 1 ? 's' : '') + '.', type: 'num', answer: I, unit: '$', tol: 0.01, fig: lv === 1 ? growth(P, r, 1) : '',
          hint: 'I = P &times; r &times; t. Write ' + r + '% as ' + cl(r / 100) + '.',
          steps: ['P = ' + P + ', r = ' + cl(r / 100) + ', t = ' + t + '.', 'One year: ' + P + ' &times; ' + cl(r / 100) + ' = ' + m(P * r / 100) + '.', t > 1 ? t + ' years: ' + A.fmt(r2(P * r / 100).toFixed(2)) + ' &times; ' + t + ' = ' + m(I) + '.' : 'Interest: ' + m(I) + '.'],
          explain: 'I = ' + m(I) + '.' };
      } },
      { id: 'mo-compare', name: 'Compare accounts and loans', code: 'F1.6', gen: function (lv) {
        if (lv === 1) {
          var P = R.int(2, 20) * 100, a = R.int(1, 6), b = a + R.int(1, 4), o = R.mc('The one at ' + b + '%', ['The one at ' + a + '%', 'They earn the same']);
          return { q: 'Two savings accounts have no fees. One pays ' + a + '% a year and the other pays ' + b + '% a year. You save ' + m0(P) + ' for a year. Which earns more?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'With no fees, a higher rate pays more interest when you save.',
            steps: [a + '%: ' + P + ' &times; ' + cl(a / 100) + ' = ' + m(P * a / 100) + '.', b + '%: ' + P + ' &times; ' + cl(b / 100) + ' = ' + m(P * b / 100) + '.', 'The ' + b + '% account earns more.'], explain: 'The ' + b + '% account earns ' + m(P * (b - a) / 100) + ' more.' };
        }
        if (lv === 2) {
          var S = R.int(4, 40) * 100, ra = R.int(3, 6), fe = R.int(1, 4), rb = R.int(1, ra - 1), ga = r2(S * ra / 100 - 12 * fe), gb = r2(S * rb / 100);
          if (ga === gb) S += 100, ga = r2(S * ra / 100 - 12 * fe), gb = r2(S * rb / 100);
          var best = ga > gb ? 'Account A' : 'Account B', o2 = R.mc(best, [ga > gb ? 'Account B' : 'Account A', 'They are the same']);
          return { q: 'You keep ' + m0(S) + ' in savings for a year. Account A pays ' + ra + '% a year with a ' + m0(fe) + ' monthly fee. Account B pays ' + rb + '% a year with no fee. Which is better?', type: 'mc', options: o2.options, answer: o2.answer,
            hint: 'For each account: interest minus a year of fees (12 months).',
            steps: ['A: ' + S + ' &times; ' + cl(ra / 100) + ' = ' + m(S * ra / 100) + ', minus 12 &times; ' + fe + ' = ' + m(12 * fe) + ' in fees. Gain: ' + m(ga) + '.', 'B: ' + S + ' &times; ' + cl(rb / 100) + ' = ' + m(gb) + '.', best + ' leaves you with more.'],
            explain: 'A gains ' + m(ga) + ' and B gains ' + m(gb) + '. ' + best + ' is better.' };
        }
        var L = R.int(4, 30) * 100, t = R.int(1, 4), x = R.int(5, 12), y = R.int(2, x - 1), fee = R.int(2, 15) * 10, cx = r2(L * x / 100 * t), cy = r2(L * y / 100 * t + fee);
        if (cx === cy) fee += 10, cy = r2(L * y / 100 * t + fee);
        var low = Math.min(cx, cy);
        return { q: 'You borrow ' + m0(L) + ' for ' + t + ' year' + (t > 1 ? 's' : '') + '. Loan X: ' + x + '% simple interest a year, no fee. Loan Y: ' + y + '% simple interest a year plus a ' + m0(fee) + ' fee. What is the total cost (interest plus fees) of the cheaper loan?', type: 'num', answer: low, unit: '$', tol: 0.01,
          hint: 'Find interest plus fee for each loan, then pick the smaller total.',
          steps: ['X: ' + L + ' &times; ' + cl(x / 100) + ' &times; ' + t + ' = ' + m(cx) + '.', 'Y: ' + L + ' &times; ' + cl(y / 100) + ' &times; ' + t + ' + ' + fee + ' = ' + m(cy) + '.', 'The cheaper one is Loan ' + (cx < cy ? 'X' : 'Y') + ': ' + m(low) + '.'],
          explain: 'Loan ' + (cx < cy ? 'X' : 'Y') + ' costs ' + m(low) + '.' };
      } },
      { id: 'mo-think', name: 'Sources and influences', code: 'F1.2', gen: function (lv) {
        var bank = [
          { q: 'Which is the most reliable source for today&rsquo;s exchange rate?', r: 'A bank&rsquo;s website', w: ['A friend&rsquo;s guess from last year', 'An old travel guide', 'A random social media post'], e: 'Rates change daily. A bank publishes the current rate.' },
          { q: 'Which is the most reliable way to check if a price is fair?', r: 'Compare prices at several stores', w: ['Trust the ad', 'Buy the first one you see', 'Ask the seller if it is a good deal'], e: 'Comparing several sellers gives you facts, not sales talk.' },
          { q: 'Which source is most reliable for learning about loans?', r: 'The Financial Consumer Agency of Canada website', w: ['A video paid for by a lender', 'A pop-up ad for fast cash', 'A comment from a stranger'], e: 'It is a government agency that explains loans without selling you one.' },
          { q: 'A store plays an ad: &ldquo;Sale ends in 1 hour!&rdquo; What is the ad trying to do?', r: 'Rush you so you do not think it over', w: ['Give you reliable facts', 'Help you save for a goal', 'Lower interest rates'], e: 'A countdown creates pressure. A good choice can wait a day.' },
          { q: 'Prices go up 5% this year. What happens to a savings goal?', r: 'It may cost more by the time you buy', w: ['It costs less', 'Nothing changes', 'Your savings grow by 5%'], e: 'When prices rise (inflation), the same item costs more later.' },
          { q: 'Ari&rsquo;s weekly hours at work are cut in half. What is the best first step?', r: 'Adjust the budget: cut wants or move the goal date', w: ['Keep spending the same', 'Borrow on a credit card', 'Stop tracking money'], e: 'When income drops, the budget has to change too.' },
          { q: 'Which is a personal factor in a money choice?', r: 'Your own values, like buying local', w: ['The bank&rsquo;s interest rate', 'Prices rising across Canada', 'The exchange rate'], e: 'Values come from you. Rates and prices come from the world around you.' },
          { q: 'Which is a need, not a want?', r: 'A warm winter coat', w: ['A third pair of sneakers', 'A new game skin', 'Concert tickets'], e: 'A warm coat is needed in a Canadian winter. The others are wants.' }
        ];
        var it = lv === 1 ? R.pick(bank.slice(0, 3)) : lv === 2 ? R.pick(bank.slice(3, 6)) : R.pick(bank), o = R.mc(it.r, it.w);
        return { q: it.q, type: 'mc', options: o.options, answer: o.answer, hint: 'Think: which choice gives checked facts, or puts your plan first?',
          steps: ['Cross out choices that are trying to sell or rush you.', 'Look for facts you can check, or what you really need.', 'Answer: ' + it.r + '.'], explain: it.e };
      } }
    ]
  });
})();
