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

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    xcur: { title: 'convert money', html:
      '<div class="ctrl"><label for="xcur">Currency<select id="xcur">' + CUR.map(function (c, i) { return '<option value="' + i + '">' + c.n + ' (' + c.c + ')</option>'; }).join('') + '</select></label>' +
      '<label for="xamt">Amount: <output id="xamto"></output><input type="range" id="xamt" min="0" max="1000" step="10" value="200"></label>' +
      '<label for="xdir">Direction<select id="xdir"><option value="1">to Canadian dollars</option><option value="-1">from Canadian dollars</option></select></label></div>' +
      '<div class="fig" id="xfig"></div><div class="out" id="xout"></div>',
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
      } },
    bgoalo: { title: 'plan a savings goal', html:
      '<div class="ctrl"><label for="bgoal">Goal: <output id="bgoalo"></output><input type="range" id="bgoal" min="50" max="1000" step="10" value="210"></label>' +
      '<label for="bsave">Already saved: <output id="bsaveo"></output><input type="range" id="bsave" min="0" max="300" step="5" value="30"></label>' +
      '<label for="binc">Weekly income: <output id="binco"></output><input type="range" id="binc" min="0" max="100" step="5" value="40"></label>' +
      '<label for="bexp">Weekly spending: <output id="bexpo"></output><input type="range" id="bexp" min="0" max="100" step="5" value="25"></label></div>' +
      '<div class="fig" id="bfig"></div><div class="out" id="bout"></div>',
      init: function (root) {
        var $ = A.$;
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
      } },
    gpo: { title: 'watch savings grow', html:
      '<div class="ctrl"><label for="gp">Start: <output id="gpo"></output><input type="range" id="gp" min="100" max="5000" step="100" value="1000"></label>' +
      '<label for="gr">Rate: <output id="gro"></output><input type="range" id="gr" min="1" max="20" value="5"></label>' +
      '<label for="gy">Years: <output id="gyo"></output><input type="range" id="gy" min="1" max="20" value="10"></label></div>' +
      '<div class="fig" id="gfig"></div><div class="out" id="gout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['gp', 'gr', 'gy'], function () {
          var P = +$('#gp', root).value, r = +$('#gr', root).value, t = +$('#gy', root).value, si = P * r / 100 * t, co = P * Math.pow(1 + r / 100, t);
          $('#gpo', root).innerHTML = m0(P); $('#gro', root).innerHTML = r + '%'; $('#gyo', root).innerHTML = t;
          $('#gfig', root).innerHTML = growth(P, r, t);
          $('#gout', root).innerHTML = '<p><b>Simple interest</b> (red bars): I = ' + A.fmt(String(P)) + ' &times; ' + cl(r / 100) + ' &times; ' + t + ' = ' + m(si) + '. Total ' + m(P + si) + '.</p>' +
            '<p><b>Compound interest</b> (orange dots), added once a year: total ' + m(co) + '. That is ' + m(co - P - si) + ' more than simple interest.</p>';
        });
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  function tbl(head, rows) { return '<div class="tbl"><table><thead><tr>' + head.map(function (h, i) { return '<th' + (i ? '' : ' class="l"') + '>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i ? '' : ' class="l"') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
  var MAYA = [{ lab: 'Needs', v: 15, col: 'var(--sc)' }, { lab: 'Wants', v: 10, col: 'var(--se)' }, { lab: 'Save', v: 15, col: 'var(--good)' }];

  var LESSONS = [
    { id: 'exchange', title: 'Exchange rates', sub: 'Convert other money to Canadian dollars and back.', concepts: [
      { id: 'tocad', title: 'Other money to Canadian', exp: ['F1.1'], skill: 'mo-tocad',
        body: '<p>An <b>exchange rate</b> tells you how much one currency is worth in another. The rates here are <b>sample rates</b> for practice; real rates change every day. <b>Other money to Canadian: multiply by the rate.</b></p>',
        watch: K.slides([
          { say: 'Sample rate: 1 US dollar costs $1.38 Canadian.', fig: eq('1 USD = $1.38 CAD') },
          { say: 'You have 50 US dollars. Each one is worth $1.38 CAD.', fig: function () { return exch(50, CUR[0]); } },
          { say: '50 &times; 1.38 = $69.00 CAD.', fig: eq('50 &times; 1.38 = $69.00 CAD'), ms: 2400 }
        ]),
        try: lab('xcur', [
          { do: 'Convert <b>200 euros</b> to Canadian dollars.', goal: function (h) { return K.v(h, 'xcur') === 1 && K.v(h, 'xamt') === 200 && K.v(h, 'xdir') === 1; }, yes: '200 × 1.50 = $300.00 CAD.' },
          { do: 'Which currency gives the <b>most</b> Canadian dollars for the same amount?', goal: function (h) { return K.v(h, 'xcur') === 2 && K.v(h, 'xdir') === 1; }, yes: 'The British pound has the highest rate here: $1.75 each.' }
        ]),
        key: '<p><b>To Canadian dollars: multiply by the rate.</b></p>',
        mistake: '<p>Dividing when converting to Canadian dollars. One US dollar is worth more than one Canadian dollar, so the Canadian amount should be bigger.</p>',
        check: [function () { return { q: 'With the sample rate 1 EUR = $1.50 CAD, how many Canadian dollars is 40 EUR?', type: 'num', answer: 60, unit: '$', tol: 0.01, hint: 'Euros to Canadian: multiply by the rate.', explain: '40 &times; 1.50 = $60.00 CAD.' }; }, K.ck('mo-tocad', 1), K.ck('mo-tocad', 2)] },
      { id: 'fromcad', title: 'Canadian to other money', exp: ['F1.1'], skill: 'mo-fromcad', hard: true,
        body: '<p>Going the other way, <b>divide by the rate</b>. $69.00 CAD &divide; 1.38 = 50 USD.</p>',
        watch: K.slides([
          { say: 'You have $69 CAD and want US dollars. Each US dollar costs $1.38.', fig: eq('$69.00 &divide; 1.38') },
          { say: 'How many $1.38 pieces fit into $69? 50.', fig: eq('$69.00 &divide; 1.38 = 50 USD') },
          { say: 'Check it makes sense: a US dollar is worth more, so you get fewer of them.', fig: eq('50 USD &lt; 69 CAD &#10003;'), ms: 2600 }
        ]),
        ways: [
          { label: 'Undo the multiplying', html: '<p>To Canadian you multiply by 1.38. To go back, undo it: divide by 1.38.</p>' },
          { label: 'Estimate first', html: '<p>Each US dollar costs about $1.40. $70 &divide; 1.40 = 50. So about 50 USD.</p>' },
          { label: 'Cheaper money', html: '<p>A Mexican peso costs only $0.075. So $30 CAD buys a lot of pesos: 30 &divide; 0.075 = 400 pesos. Cheap currency: you get more of it.</p>' }
        ],
        key: '<p><b>From Canadian dollars: divide by the rate.</b> Check: is the answer sensible?</p>',
        mistake: '<p>Multiplying both ways. Ask: is each foreign unit worth more or less than a Canadian dollar? Then should I get more or fewer?</p>',
        check: [K.ck('mo-fromcad', 1), K.ck('mo-fromcad', 2), K.ck('mo-fromcad', 3)] },
      { id: 'banks', title: 'Compare rates and fees', exp: ['F1.1'], skill: 'mo-tocad',
        body: '<p>Banks sell foreign money at different rates, and some charge a fee. Work out the <b>total cost</b> at each.</p>',
        watch: K.slides([
          { say: 'You want 100 USD. Bank A sells at $1.41 each.', fig: eq('A: 100 &times; 1.41 = $141.00') },
          { say: 'Bank B sells at $1.37 each, plus a $3 fee.', fig: eq('B: 100 &times; 1.37 + 3 = $140.00') },
          { say: 'Bank B costs $1 less, even with the fee.', fig: eq('$140.00 &lt; $141.00'), ms: 2400 }
        ]),
        key: '<p><b>Total cost = amount &times; rate + fees.</b> Compare totals.</p>',
        mistake: '<p>Choosing the lower rate without adding the fee.</p>',
        check: [K.ck('mo-tocad', 3)] }
    ] },
    { id: 'budget', title: 'Budgets for big goals', sub: 'Plan, track and adjust.', concepts: [
      { id: 'plan', title: 'Income, expenses, savings', exp: ['F1.3'], skill: 'mo-budget',
        body: '<p>A <b>budget</b> is a plan for your money: what comes in (<b>income</b>), what goes out (<b>expenses</b>), and what you <b>save</b>.</p>',
        watch: K.slides([
          { say: 'Maya earns $40 a week babysitting.', fig: eq('Income: $40 a week') },
          { say: 'She spends $15 on needs and $10 on wants. She saves the rest: $15.', fig: function () { return split(MAYA); } },
          { say: 'She has $30 and wants a $210 bike. She still needs $180.', fig: eq('210 &minus; 30 = $180') },
          { say: 'At $15 a week: 180 &divide; 15 = <b>12 weeks</b>.', fig: function () { return plan(210, 30, 15); }, ms: 2800 }
        ]),
        key: '<p><b>Savings = income &minus; expenses.</b></p>',
        mistake: '<p>Using income instead of savings to count weeks: $180 &divide; $40. Only what is saved goes toward the goal.</p>',
        check: [K.ck('mo-budget', 1), K.ck('mo-budget', 2)] },
      { id: 'goal', title: 'How long to reach a goal', exp: ['F1.3'], skill: 'mo-budget', hard: true,
        body: '<p>Weeks to goal = money still needed &divide; savings per week. If it does not divide evenly, <b>round up</b>.</p>',
        watch: K.slides([
          { say: 'Leo needs $150 more. He saves $20 a week.', fig: eq('150 &divide; 20 = 7.5') },
          { say: 'After 7 weeks he has $140. Still $10 short.', fig: function () { return plan(150, 0, 20); } },
          { say: 'So he needs <b>8 weeks</b>. Round up.', fig: eq('7.5 &rarr; 8 weeks'), ms: 2400 }
        ]),
        try: lab('bgoalo', [
          { do: 'Reach the goal in <b>10 weeks or less</b>.', goal: function (h) { var need = K.v(h, 'bgoal') - K.v(h, 'bsave'), per = K.v(h, 'binc') - K.v(h, 'bexp'); return need <= 0 || (per > 0 && Math.ceil(need / per) <= 10); }, yes: 'Spending less or earning more speeds it up.' },
          { do: 'Make a plan that <b>never</b> reaches the goal. Why?', goal: function (h) { return K.v(h, 'binc') <= K.v(h, 'bexp') && K.v(h, 'bgoal') > K.v(h, 'bsave'); }, yes: 'If spending is as big as income, nothing is saved.' }
        ]),
        ways: [
          { label: 'Track and adjust', html: '<ol><li><b>Track</b>: each week, write what you earned, spent and saved.</li><li><b>Compare</b>: are you on plan?</li><li><b>Adjust</b>: spend less on wants, earn more, or move the date.</li></ol>' },
          { label: 'Count up', html: '<p>$20, $40, $60, ... $140 after 7 weeks, $160 after 8. The first total that reaches $150 is week 8.</p>' }
        ],
        key: '<p><b>Needed &divide; saved per week, then round up.</b></p>',
        mistake: '<p>Rounding 7.5 weeks down to 7. After 7 weeks the money is still short.</p>',
        check: [function () { return { q: 'Leo needs $150 more for a game console. He saves $20 a week. How many weeks until he has enough?', type: 'num', answer: 8, unit: 'weeks', hint: '150 &divide; 20 = 7.5. Can he buy it after 7 weeks?', explain: 'He needs 8 weeks.' }; }, K.ck('mo-budget', 3)] }
    ] },
    { id: 'choices', title: 'Good information and good choices', sub: 'Sources and influences.', concepts: [
      { id: 'sources', title: 'Reliable sources', exp: ['F1.2'], skill: 'mo-think',
        body: '<p>Before a big money decision, use <b>reliable sources</b>: accurate, up to date, and not just trying to sell you something.</p><div class="vs"><div><b class="t">More reliable</b><p>Bank and credit union websites</p><p>The Financial Consumer Agency of Canada</p><p>A trusted adult who has done it</p></div><div><b class="t">Less reliable</b><p>An ad saying "Best deal ever!"</p><p>A post from a stranger</p><p>A video paid for by the seller</p></div></div>',
        watch: K.slides([
          { say: 'You want a savings account. Where do you look?', fig: eq('Which source can I trust?') },
          { say: 'Ask: is it accurate and up to date? Can I check it?', fig: eq('accurate &middot; up to date &middot; checkable') },
          { say: 'Ask: is it trying to sell me something? Compare several sources.', fig: eq('compare, then decide'), ms: 2400 }
        ]),
        key: '<p><b>Trust sources you can check and compare. Be careful with anyone selling.</b></p>',
        mistake: '<p>Trusting one review or ad. Look for at least two sources that agree.</p>',
        check: [function () { return mc('Which is the most reliable place to learn about savings accounts?', 'The websites of several banks and credit unions', ['A pop-up ad', 'A comment on a video', 'A friend who guesses'], 'Which one gives facts you can check and compare?', 'Bank websites give facts you can compare.'); }, K.ck('mo-think', 1)] },
      { id: 'influence', title: 'What influences a choice', exp: ['F1.4'], skill: 'mo-think',
        body: tbl(['Factor', 'Effect'], [['Needs and wants', 'Needs come first; wants can wait.'], ['Friends and family', 'Wanting what friends have can lead to unplanned spending.'], ['Advertising', 'Ads make a want feel like a need.'], ['Inflation', 'The same money buys less over time.'], ['Values', 'You may pay more for local or fair products.'], ['Income changes', 'Less work means changing the budget.']]),
        watch: K.slides([
          { say: 'A new phone comes out. Your friends all have it.', fig: eq('Do I need it? Can I afford it? Better price or time?') },
          { say: 'Need or want? Your phone still works: it is a want.', fig: eq('want') },
          { say: 'Can you afford it? Is the price lower in a few months? Then decide.', fig: eq('wait, save, compare'), ms: 2400 }
        ]),
        key: '<p>Before spending ask: <b>Do I need it? Can I afford it? Is there a better price or a better time?</b></p>',
        mistake: '<p>Seeing advertising or friends as the reason to buy, not as influences to notice.</p>',
        check: [K.ck('mo-think', 2), K.ck('mo-think', 3)] }
    ] },
    { id: 'interest', title: 'Interest', sub: 'Money paid for using money.', concepts: [
      { id: 'simple', title: 'Simple interest', exp: ['F1.5'], skill: 'mo-interest',
        body: '<p><b>Interest</b> is money paid for using money. When you save, the bank pays you. When you borrow, you pay. <span class="math">I = P &times; r &times; t</span>: principal, rate as a decimal, time in years.</p>',
        watch: K.slides([
          { say: 'You save $400 at 3% a year for 2 years.', fig: eq('P = 400, r = 0.03, t = 2') },
          { say: 'One year: 400 &times; 0.03 = $12.', fig: eq('400 &times; 0.03 = $12') },
          { say: 'Two years: $12 &times; 2 = $24 interest.', fig: eq('I = 400 &times; 0.03 &times; 2 = $24') },
          { say: 'You end with $424.', fig: eq('400 + 24 = $424'), ms: 2200 }
        ]),
        key: '<p><b>I = P &times; r &times; t.</b> Write the rate as a decimal: 3% = 0.03.</p>',
        mistake: '<p>Using 3 instead of 0.03 for the rate, which gives $2400 interest. Ask: does that make sense?</p>',
        check: [function () { return { q: 'Find the simple interest on $600 at 5% a year for 3 years.', type: 'num', answer: 90, unit: '$', tol: 0.01, hint: 'I = 600 &times; 0.05 &times; 3.', explain: '30 a year, &times; 3 = $90.' }; }, K.ck('mo-interest', 1), K.ck('mo-interest', 2)] },
      { id: 'compound', title: 'Compound interest grows faster', exp: ['F1.5'], skill: 'mo-interest', hard: true,
        body: '<div class="vs"><div><b class="t">Simple</b><p>Interest only on the start amount. The same each year.</p></div><div><b class="t">Compound</b><p>Interest on the start <b>and</b> on past interest. It grows faster every year.</p></div></div>',
        watch: K.slides([
          { say: '$1000 at 5% a year. Year 1: both earn $50.', fig: eq('1000 &rarr; 1050') },
          { say: 'Year 2: simple earns $50 again. Compound earns 5% of $1050: $52.50.', fig: eq('simple 1100 &nbsp;&nbsp; compound 1102.50') },
          { say: 'Over 10 years the gap grows.', fig: function () { return growth(1000, 5, 10); } },
          { say: 'A high rate is good when you save, and bad when you borrow.', fig: eq('save: high rate &#10003; &nbsp;&nbsp; borrow: high rate &#10007;'), ms: 2600 }
        ]),
        try: lab('gpo', [
          { do: 'Find a plan where compound interest more than <b>doubles</b> $1000.', goal: function (h) { return K.v(h, 'gp') === 1000 && Math.pow(1 + K.v(h, 'gr') / 100, K.v(h, 'gy')) > 2; }, yes: 'Time and rate together make money grow fast.' },
          { do: 'Set <b>20%</b> for <b>5 years</b>, like an unpaid credit card.', goal: function (h) { return K.v(h, 'gr') === 20 && K.v(h, 'gy') === 5; }, yes: 'A debt at 20% grows quickly too, but against you.' }
        ]),
        ways: [
          { label: 'Snowball', html: '<p>Compound interest is like a snowball rolling downhill. The bigger it gets, the more snow it picks up each turn.</p>' },
          { label: 'Year by year', html: '<p>Multiply by 1.05 each year: 1000, 1050, 1102.50, 1157.63, ... Each year\'s interest is a bit more than the last.</p>' }
        ],
        key: '<p><b>Compound interest earns interest on interest.</b> Start early when saving; pay off quickly when borrowing.</p>',
        mistake: '<p>Thinking a high rate is always good. It depends on whether you are saving or borrowing.</p>',
        check: [function () { return mc('You owe $500 on a credit card at 20% a year. What happens if you pay nothing for 2 years?', 'You owe more than $700', ['You still owe $500', 'You owe exactly $600'], 'Interest is added each year, and next year\'s interest is on the bigger amount.', '500 &times; 1.2 = 600, then 600 &times; 1.2 = 720.'); }, K.ck('mo-interest', 3)] }
    ] },
    { id: 'compare', title: 'Comparing accounts and loans', sub: 'Rates and fees together.', concepts: [
      { id: 'accounts', title: 'Savings accounts', exp: ['F1.6'], skill: 'mo-compare', hard: true,
        body: '<p>Accounts offer different <b>rates</b> and <b>fees</b>. To compare, work out what <b>you gain</b>: interest minus fees.</p>',
        watch: K.slides([
          { say: 'You keep $800 for a year. Account A: 4%, with a $2 monthly fee.', fig: eq('A: 800 &times; 0.04 = $32, fees 12 &times; $2 = $24') },
          { say: 'A gains only $8.', fig: eq('A: 32 &minus; 24 = $8') },
          { say: 'Account B: 2%, no fee. It gains $16.', fig: eq('B: 800 &times; 0.02 = $16') },
          { say: 'The lower rate wins here. The fee ate A\'s interest.', fig: tbl(['Account', 'Gain'], [['A: 4%, $2/month', '$8'], ['B: 2%, no fee', '<b>$16</b>']]), ms: 2600 }
        ]),
        ways: [
          { label: 'With more money', html: '<p>With $5000 saved, A gains 200 &minus; 24 = $176 and B gains $100. Now A wins. The best account depends on how much you keep in it.</p>' },
          { label: 'Fees per year', html: '<p>Always turn a monthly fee into a yearly one first: $2 &times; 12 = $24. Then compare with a year of interest.</p>' }
        ],
        key: '<p><b>Gain = interest &minus; fees.</b> Pick the biggest gain for your amount.</p>',
        mistake: '<p>Choosing by rate alone and forgetting monthly fees.</p>',
        check: [function () { return mc('Account C pays 3% a year with a $1 monthly fee. Account D pays 1% with no fee. You keep $500 for a year. Which is better?', 'Account D', ['Account C', 'They are the same'], 'C: 500 &times; 0.03 minus 12 fees of $1. D: 500 &times; 0.01.', 'C gains 15 &minus; 12 = $3. D gains $5.'); }, K.ck('mo-compare', 1), K.ck('mo-compare', 2)] },
      { id: 'loans', title: 'Loans', exp: ['F1.6'], skill: 'mo-compare',
        body: '<p>For a loan, find the <b>total cost</b>: interest plus fees. Pick the <b>smallest</b>.</p>',
        watch: K.slides([
          { say: 'Borrow $1000 for 2 years. Loan X: 6%, no fee.', fig: eq('X: 1000 &times; 0.06 &times; 2 = $120') },
          { say: 'Loan Y: 4%, but a $50 fee.', fig: eq('Y: 1000 &times; 0.04 &times; 2 + 50 = $130') },
          { say: 'Loan X costs less, even with the higher rate.', fig: tbl(['Loan', 'Total cost'], [['X: 6%, no fee', '<b>$120</b>'], ['Y: 4%, $50 fee', '$130']]), ms: 2600 }
        ]),
        key: '<p><b>Total cost = interest + fees.</b> For borrowing, pick the least you pay.</p>',
        mistake: '<p>Picking the lower rate without adding the fee.</p>',
        check: [K.ck('mo-compare', 3)] }
    ] }
  ];


  A.register('money', {
    lessons: LESSONS,

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

  /* ---------- question shapes: more ways to practise each skill ---------- */
  var NEEDS = [['A warm winter coat', 1], ['Rent or a place to live', 1], ['Groceries for the week', 1], ['A bus pass to get to school', 1], ['A third pair of sneakers', 0], ['A new game skin', 0], ['Concert tickets', 0], ['A fancy phone case', 0]];
  var SRC = [['A bank&rsquo;s website', 1], ['The Financial Consumer Agency of Canada', 1], ['Comparing prices at several stores', 1], ['A pop-up ad for fast cash', 0], ['A video paid for by a lender', 0], ['A stranger&rsquo;s comment online', 0]];
  function cur3() { return R.pick(CUR.slice(0, 3)); }
  K.shapes('money', {
    'mo-tocad': [
      [1, 'which', function () {
        var c = cur3(), right = 'Multiply by ' + rs(c.r), o = R.mc(right, ['Divide by ' + rs(c.r), 'Add ' + rs(c.r)]);
        return { q: 'Which way? The rate is 1 ' + c.c + ' = $' + rs(c.r) + ' CAD. To change ' + c.n + ' into Canadian dollars, what do you do?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Each ' + c.one + ' is worth $' + rs(c.r) + ' CAD.', steps: ['10 ' + c.c + ' is 10 lots of $' + rs(c.r) + ', so multiply.'],
          explain: 'Multiply the ' + c.n + ' by ' + rs(c.r) + '.', meta: { k: 'mo-dir-which', to: 'CAD' } };
      }],
      [1, 'fill', function () {
        var c = cur3(), f = R.int(2, 40) * 5, cad = r2(f * c.r);
        return { q: 'Use the rate 1 ' + c.c + ' = $' + rs(c.r) + ' CAD. Fill in the blank.', type: 'fill', fill: fx(c, f) + ' = ' + f + ' &times; ' + rs(c.r) + ' = $[[]] CAD', answers: [cad], tol: 0.01, fig: exch(f, c),
          hint: 'Multiply ' + f + ' by ' + rs(c.r) + '.', steps: [f + ' &times; ' + rs(c.r) + ' = ' + cad.toFixed(2) + '.'],
          explain: fx(c, f) + ' = ' + m(cad) + ' CAD.', meta: { k: 'mo-to-fill', f: f, rate: c.r } };
      }],
      [1, 'story', function () {
        var who = K.name(), c = cur3(), f = R.int(2, 20) * 5, cad = r2(f * c.r);
        return { q: who + ' comes home from a trip with <b>' + fx(c, f) + '</b> left over. The bank rate is 1 ' + c.c + ' = $' + rs(c.r) + ' CAD. How many Canadian dollars is that?', type: 'num', unit: '$', answer: cad, tol: 0.01,
          hint: 'Multiply by the rate.', steps: [f + ' &times; ' + rs(c.r) + ' = ' + cad.toFixed(2) + '.'],
          explain: 'That is ' + m(cad) + ' CAD.', meta: { k: 'mo-to-story', f: f, rate: c.r } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), c = cur3(), f = R.int(4, 40) * 5, truth = R.int(0, 1), said = truth ? r2(f * c.r) : r2(f / c.r);
        var right = 'Each ' + c.one + ' is worth more than $1 CAD, so you get more Canadian dollars: ' + f + ' &times; ' + rs(c.r) + ' = ' + m(f * c.r) + '.';
        return { q: 'The rate is 1 ' + c.c + ' = $' + rs(c.r) + ' CAD. ' + who + ' says ' + fx(c, f) + ' is <b>' + m(said) + ' CAD</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['To get Canadian dollars, divide by the rate.', 'The amount stays the same in any currency.']),
          hint: 'Should the number of Canadian dollars be bigger or smaller?', steps: [right], explain: right, meta: { k: 'mo-to-tf', f: f, rate: c.r, said: said } };
      }]
    ],
    'mo-fromcad': [
      [1, 'which', function () {
        var c = cur3(), right = 'Divide by ' + rs(c.r), o = R.mc(right, ['Multiply by ' + rs(c.r), 'Take away ' + rs(c.r)]);
        return { q: 'Which way? The rate is 1 ' + c.c + ' = $' + rs(c.r) + ' CAD. To change Canadian dollars into ' + c.n + ', what do you do?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'How many lots of $' + rs(c.r) + ' fit in your Canadian dollars?', steps: ['"How many fit?" means divide.'],
          explain: 'Divide the Canadian dollars by ' + rs(c.r) + '.', meta: { k: 'mo-dir-which', to: 'other' } };
      }],
      [1, 'fill', function () {
        var c = cur3(), f = R.int(2, 40) * 5, cad = r2(f * c.r);
        return { q: 'Use the rate 1 ' + c.c + ' = $' + rs(c.r) + ' CAD. Fill in the blank.', type: 'fill', fill: m(cad) + ' CAD &divide; ' + rs(c.r) + ' = [[]] ' + c.c, answers: [f], tol: 0.01,
          hint: 'Divide by the rate.', steps: [cad.toFixed(2) + ' &divide; ' + rs(c.r) + ' = ' + f + '.'],
          explain: m(cad) + ' CAD buys ' + fx(c, f) + '.', meta: { k: 'mo-from-fill', cad: cad, rate: c.r } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), c = cur3(), f = R.int(4, 40) * 5, cad = r2(f * c.r), truth = R.int(0, 1), said = truth ? f : r2(cad * c.r);
        var right = 'Each ' + c.one + ' costs $' + rs(c.r) + ' CAD, so you get fewer of them: ' + cad.toFixed(2) + ' &divide; ' + rs(c.r) + ' = ' + f + ' ' + c.c + '.';
        return { q: 'The rate is 1 ' + c.c + ' = $' + rs(c.r) + ' CAD. ' + who + ' says ' + m(cad) + ' CAD buys <b>' + said + ' ' + c.c + '</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Multiply by the rate to get the other money.', 'You always get the same number of dollars back.']),
          hint: 'Should you get more or fewer ' + c.n + ' than Canadian dollars?', steps: [right], explain: right, meta: { k: 'mo-from-tf', cad: cad, rate: c.r, said: said } };
      }]
    ],
    'mo-budget': [
      [1, 'fill', function () {
        var per = R.pick([5, 10, 15, 20, 25]), n = R.int(3, 15), goal = per * n;
        return { q: 'A goal of ' + m0(goal) + ', saving ' + m0(per) + ' a week. Fill in the number of weeks.', type: 'fill', fill: m0(goal) + ' = ' + m0(per) + ' &times; [[]] weeks', answers: [n], fig: plan(goal, 0, per),
          hint: 'How many lots of ' + m0(per) + ' make ' + m0(goal) + '?', steps: [goal + ' &divide; ' + per + ' = ' + n + '.'],
          explain: 'It takes ' + n + ' weeks.', meta: { k: 'mo-weeks-fill', goal: goal, per: per } };
      }],
      [1, 'line', function () {
        var who = K.name(), per = R.pick([10, 15, 20, 25]), goal = per * R.int(3, 18) - R.pick([0, 5]), n = Math.ceil(goal / per);
        return { q: who + ' saves ' + m0(per) + ' a week for a ' + m0(goal) + ' goal. Place the number of weeks until there is enough.', type: 'line', min: 0, max: 20, tick: 1, every: 5, snap: 1, answer: n,
          hint: 'Count by ' + per + 's until you reach ' + goal + ' or more.', steps: [goal + ' &divide; ' + per + ' = ' + cl(goal / per) + '.', goal % per ? 'Round up: a part week is not enough, so ' + n + ' weeks.' : 'That is ' + n + ' weeks.'],
          explain: who + ' needs ' + n + ' weeks.', meta: { k: 'mo-weeks-line', goal: goal, per: per } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), per = R.pick([15, 20, 25, 30]), n = R.int(4, 10), goal = per * n - R.int(1, per - 1), truth = R.int(0, 1), said = truth ? n : n - 1;
        var right = per + ' &times; ' + (n - 1) + ' = ' + per * (n - 1) + ', which is not enough. ' + per + ' &times; ' + n + ' = ' + per * n + ' is. So it takes ' + n + ' weeks.';
        return { q: who + ' saves ' + m0(per) + ' a week for a ' + m0(goal) + ' goal and says it takes <b>' + said + ' weeks</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Always round down when you divide.', 'The number of weeks is the goal minus the savings.']),
          hint: 'Multiply to check: is there enough after that many weeks?', steps: [right], explain: right, meta: { k: 'mo-weeks-tf', goal: goal, per: per, said: said } };
      }]
    ],
    'mo-interest': [
      [1, 'fill', function () {
        var P = R.int(2, 20) * 100, r = R.int(2, 9);
        return { q: 'Find the simple interest on ' + m0(P) + ' at ' + r + '% for one year. Fill in the blanks.', type: 'fill', fill: '1% of ' + m0(P) + ' = $[[]], so ' + r + '% = $[[]]', answers: [P / 100, P * r / 100],
          hint: '1% is one hundredth: divide by 100.', steps: [P + ' &divide; 100 = ' + P / 100 + '.', P / 100 + ' &times; ' + r + ' = ' + P * r / 100 + '.'],
          explain: 'The interest is ' + m0(P * r / 100) + '.', meta: { k: 'mo-int-fill', P: P, r: r } };
      }],
      [1, 'story', function () {
        var who = K.name(), P = R.int(2, 20) * 100, r = R.int(2, 5), t = R.int(1, 4), I = P * r / 100 * t;
        return { q: who + ' puts <b>' + m0(P) + '</b> in a GIC that pays <b>' + r + '%</b> simple interest a year, for <b>' + t + ' year' + (t > 1 ? 's' : '') + '</b>. How much interest does ' + who + ' earn?', type: 'num', unit: '$', answer: I, tol: 0.01,
          hint: 'I = P &times; r &times; t.', steps: [r + '% of ' + P + ' = ' + P * r / 100 + ' a year.', P * r / 100 + ' &times; ' + t + ' = ' + I + '.'],
          explain: who + ' earns ' + m(I) + '.', meta: { k: 'mo-int-story', P: P, r: r, t: t } };
      }],
      [1, 'match', function () {
        var list = K.uniq(3, function () { return [R.int(1, 10) * 100, R.int(1, 6), R.int(1, 3)]; }, function (x) { return x[0] * x[1] * x[2]; });
        var pairs = list.map(function (x) { return [m0(x[0]) + ' at ' + x[1] + '% for ' + x[2] + ' yr', m0(x[0] * x[1] * x[2] / 100)]; });
        return { q: 'Match each savings plan to the simple interest it earns.', type: 'match', pairs: pairs,
          hint: 'Interest = amount &times; rate &times; years.', steps: ['$200 at 3% for 2 years: 200 &times; 0.03 &times; 2 = $12.'],
          explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'mo-int-match', list: list } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), P = R.int(2, 20) * 100, r = R.int(2, 8), t = R.int(2, 5), truth = R.int(0, 1), said = truth ? P * r / 100 * t : P * r / 100;
        var right = 'Simple interest is earned every year: ' + m0(P * r / 100) + ' &times; ' + t + ' = ' + m0(P * r / 100 * t) + '.';
        return { q: who + ' saves ' + m0(P) + ' at ' + r + '% simple interest for ' + t + ' years and says the interest is <b>' + m0(said) + '</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Interest is only paid in the first year.', 'Interest is the rate times the years, in dollars.']),
          hint: 'How many years is the money saved?', steps: [right], explain: right, meta: { k: 'mo-int-tf', P: P, r: r, t: t, said: said } };
      }]
    ],
    'mo-compare': [
      [1, 'tap', function () {
        return K.retry(function () {
          var S = R.int(5, 30) * 100, acc = K.uniq(3, function () { return [R.int(1, 6), R.pick([0, 0, 1, 2, 3])]; }, String);
          var net = acc.map(function (a) { return S * a[0] / 100 - 12 * a[1]; }), best = net.indexOf(Math.max.apply(null, net));
          if (net.filter(function (v) { return Math.abs(v - net[best]) < 0.005; }).length > 1) return null;
          return { q: 'You keep <b>' + m0(S) + '</b> in savings for a year. Tap the account that leaves you with the most money.', type: 'tap', tiles: acc.map(function (a) { return a[0] + '% a year<br>' + (a[1] ? m0(a[1]) + ' monthly fee' : 'no fee'); }), answer: best, answerText: acc[best][0] + '% a year, ' + (acc[best][1] ? m0(acc[best][1]) + ' monthly fee' : 'no fee'),
            hint: 'For each one: interest for the year, minus 12 monthly fees.', steps: acc.map(function (a, i) { return a[0] + '%: ' + m(S * a[0] / 100) + ' &minus; ' + m(12 * a[1]) + ' = ' + m(net[i]) + '.'; }),
            explain: 'The best one gains ' + m(net[best]) + ' in the year.', meta: { k: 'mo-acc-tap', S: S, acc: acc } };
        });
      }],
      [1, 'fill', function () {
        var S = R.int(5, 30) * 100, r = R.int(2, 6), fee = R.int(1, 3);
        return { q: 'An account pays ' + r + '% a year with a ' + m0(fee) + ' monthly fee. You keep ' + m0(S) + ' in it for a year. Fill in the blanks.', type: 'fill', fill: 'Interest $[[]] &nbsp; Fees for the year $[[]] &nbsp; Gain $[[]]', answers: [S * r / 100, 12 * fee, S * r / 100 - 12 * fee],
          hint: 'There are 12 monthly fees in a year.', steps: [r + '% of ' + S + ' = ' + S * r / 100 + '.', '12 &times; ' + fee + ' = ' + 12 * fee + '.', 'Gain: ' + S * r / 100 + ' &minus; ' + 12 * fee + ' = ' + (S * r / 100 - 12 * fee) + '.'],
          explain: 'You gain ' + m(S * r / 100 - 12 * fee) + '.', meta: { k: 'mo-acc-fill', S: S, r: r, fee: fee } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), S = R.int(3, 20) * 100, ra = R.int(3, 6), fee = R.int(1, 4), rb = R.int(1, ra - 1), ga = S * ra / 100 - 12 * fee, gb = S * rb / 100;
        var right = 'Account A gains ' + m(S * ra / 100) + ' &minus; ' + m(12 * fee) + ' = ' + m(ga) + '. Account B gains ' + m(gb) + '. So ' + (ga > gb ? 'A' : 'B') + ' is better.';
        return { q: 'You keep ' + m0(S) + ' for a year. Account A pays ' + ra + '% with a ' + m0(fee) + ' monthly fee. Account B pays ' + rb + '% with no fee. ' + who + ' says <b>A is better</b>, because its rate is higher. True or false?', type: 'tf', answer: ga > gb,
          why: K.why(right, ['A higher rate is always better.', 'Fees never matter for savings.']),
          hint: 'Take the fees away from the interest.', steps: [right], explain: right, meta: { k: 'mo-acc-tf', S: S, a: [ra, fee], b: [rb, 0] } };
      }]
    ],
    'mo-think': [
      [1, 'pick', function () {
        return K.retry(function () {
          var opts = R.shuffle(NEEDS).slice(0, 5), ans = K.picks(opts, function (x) { return x[1]; });
          if (!ans) return null;
          return { q: 'Pick every <b>need</b>. (The others are wants.)', type: 'pick', options: opts.map(function (x) { return x[0]; }), answer: ans,
            hint: 'A need is something you must have to live, stay safe or get to school.', steps: ['Ask: could I go without it?'],
            explain: 'Needs: ' + ans.map(function (j) { return opts[j][0].toLowerCase(); }).join(', ') + '.', meta: { k: 'mo-need-pick' } };
        });
      }],
      [1, 'tap', function () {
        var good = R.pick(SRC.filter(function (x) { return x[1]; })), bad = R.shuffle(SRC.filter(function (x) { return !x[1]; })), tiles = R.shuffle([good].concat(bad));
        return { q: 'Tap the most <b>reliable</b> source of money information.', type: 'tap', tiles: tiles.map(function (x) { return x[0]; }), answer: tiles.indexOf(good), answerText: good[0].replace(/&rsquo;/g, '’'),
          hint: 'Reliable sources check their facts and are not trying to sell you something.', steps: ['Cross out anything that is an ad or a stranger.'],
          explain: good[0] + ' gives facts without a sales pitch.', meta: { k: 'mo-src-tap' } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), it = R.pick(SRC);
        var right = it[1] ? it[0] + ' gives checked facts and is not selling you anything.' : it[0] + ' wants something from you, so check the facts elsewhere.';
        return { q: who + ' says <b>' + it[0].charAt(0).toLowerCase() + it[0].slice(1) + '</b> is a reliable source of money information. True or false?', type: 'tf', answer: !!it[1],
          why: K.why(right, ['Anything online is reliable.', 'Only ads tell you the real price.']),
          hint: 'Is it trying to sell you something?', steps: [right], explain: right, meta: { k: 'mo-src-tf' } };
      }]
    ]
  });
})();
