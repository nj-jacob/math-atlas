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

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    hgo: { title: 'shade the grid', html: 
      '<div class="ctrl"><label for="hgr">Squares shaded: <output id="hgo"></output><input type="range" id="hgr" min="0" max="100" value="35"></label></div>' +
      '<div class="row2"><div class="fig" id="hgfig"></div><div class="out" id="hgout"></div></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['hgr'], function () {
          var n = +$('#hgr', root).value, g = gcd(n, 100) || 100;
          $('#hgo', root).textContent = n;
          $('#hgfig', root).innerHTML = hgrid(n);
          $('#hgout', root).innerHTML = '<p class="big2">' + n + '%</p><p><b>Fraction:</b> ' + fr(n, 100) + (g > 1 && n ? ' = ' + frs(n, 100) : '') + '</p><p><b>Decimal:</b> ' + dec(n / 100) + '</p><p><b>In words:</b> ' + n + ' out of every 100.</p>';
        });
      } },
    cvn: { title: 'any fraction as a percent', html: 
      '<div class="ctrl"><label for="cvn">Top<input type="number" id="cvn" min="0" max="40" value="5"></label><label for="cvd">Bottom<input type="number" id="cvd" min="1" max="40" value="8"></label></div>' +
      '<div class="fig" id="cvfig"></div><div class="out" id="cvout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['cvn', 'cvd'], function () {
          var n = Math.max(0, Math.min(40, parseInt($('#cvn', root).value, 10) || 0)), d = Math.max(1, Math.min(40, parseInt($('#cvd', root).value, 10) || 1)), x = n / d;
          var dstr = Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-9 ? dec(x) : x.toFixed(4) + '...';
          $('#cvfig', root).innerHTML = n <= d ? pbar(n, d) : '<p class="t2">More than one whole: more than 100%.</p>';
          $('#cvout', root).innerHTML = '<p class="big2">' + fr(n, d) + ' = ' + n + ' &divide; ' + d + ' = ' + dstr + '</p><p>As a percent: ' + dstr.replace('...', '') + ' &times; 100 = <b>' + (dstr.indexOf('...') > 0 ? 'about ' + (Math.round(x * 1000) / 10) : dec(x * 100)) + '%</b></p>';
        });
      } },
    pcn: { title: 'increase or decrease', html: 
      '<div class="ctrl"><label for="pcn">Start number<input type="number" id="pcn" min="1" max="10000" value="60"></label><label for="pcp">Percent<select id="pcp"><option>1</option><option>5</option><option selected>10</option><option>25</option><option>50</option><option>100</option></select></label>' +
      '<label for="pcu">Change<select id="pcu"><option value="1">increase</option><option value="0">decrease</option></select></label></div>' +
      '<div class="fig" id="pcfig"></div><div class="out" id="pcout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['pcn', 'pcp', 'pcu'], function () {
          var n = Math.max(1, Math.min(10000, parseFloat($('#pcn', root).value) || 1)), p = +$('#pcp', root).value, up = $('#pcu', root).value === '1', part = cl(n * p / 100), res = cl(up ? n + part : n - part);
          var how = { 1: n + ' &divide; 100', 5: 'half of 10%: ' + dec(n / 10) + ' &divide; 2', 10: n + ' &divide; 10', 25: n + ' &divide; 4', 50: n + ' &divide; 2', 100: 'the whole number' }[p];
          $('#pcfig', root).innerHTML = change(n, p, up);
          $('#pcout', root).innerHTML = '<p>' + p + '% of ' + fmt(n) + ' = ' + how + ' = <b>' + fmt(part) + '</b></p><p class="big2">' + fmt(n) + (up ? ' + ' : ' &minus; ') + fmt(part) + ' = ' + fmt(res) + '</p>';
        });
      } },
    bua: { title: 'compare two sizes', html: 
      '<div class="ctrl"><label for="bua">Size A (g)<input type="number" id="bua" min="50" max="5000" value="500"></label><label for="bupa">Price A ($)<input type="number" id="bupa" min="0.1" max="100" step="0.01" value="4.50"></label></div>' +
      '<div class="ctrl"><label for="bub">Size B (g)<input type="number" id="bub" min="50" max="5000" value="750"></label><label for="bupb">Price B ($)<input type="number" id="bupb" min="0.1" max="100" step="0.01" value="6.00"></label></div>' +
      '<div class="out" id="buout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['bua', 'bupa', 'bub', 'bupb'], function () {
          var a = parseFloat($('#bua', root).value) || 1, pa = parseFloat($('#bupa', root).value) || 0, b = parseFloat($('#bub', root).value) || 1, pb = parseFloat($('#bupb', root).value) || 0;
          var ua = pa / a * 100, ub = pb / b * 100;
          $('#buout', root).innerHTML = '<p><b>A:</b> $' + pa.toFixed(2) + ' &divide; ' + dec(a / 100) + ' = <b>$' + ua.toFixed(2) + ' per 100 g</b></p><p><b>B:</b> $' + pb.toFixed(2) + ' &divide; ' + dec(b / 100) + ' = <b>$' + ub.toFixed(2) + ' per 100 g</b></p>' +
            '<p class="big2">' + (Math.abs(ua - ub) < 0.005 ? 'Same value' : (ua < ub ? 'A' : 'B') + ' is the better buy') + '</p>';
        });
      } },
    ppmo: { title: 'change the start fee', html: 
      '<div class="ctrl"><label for="ppm">Cost per km: <output id="ppmo"></output><input type="range" id="ppm" min="0.5" max="3" step="0.5" value="1.5"></label><label for="ppc">Start fee: <output id="ppco"></output><input type="range" id="ppc" min="0" max="8" value="4"></label></div>' +
      '<div class="fig" id="ppfig"></div><div class="out" id="ppout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['ppm', 'ppc'], function () {
          var m = +$('#ppm', root).value, c = +$('#ppc', root).value;
          $('#ppmo', root).textContent = '$' + m.toFixed(2); $('#ppco', root).textContent = '$' + c;
          $('#ppfig', root).innerHTML = graph([{ m: m, c: c, col: c ? 'var(--se)' : 'var(--sb)', lab: '$' + c + ' + $' + m.toFixed(2) + '/km' }], 10, 40, 'distance (km)', 'cost ($)');
          var c5 = c + 5 * m, c10 = c + 10 * m;
          $('#ppout', root).innerHTML = '<p>5 km costs $' + c5.toFixed(2) + '. 10 km costs $' + c10.toFixed(2) + '.</p><p class="big2">' + (c === 0 ? 'Proportional' : 'Not proportional') + '</p><p>' + (c === 0 ? 'Double the distance, double the cost. The line starts at 0.' : 'Double the distance does not double the cost ($' + (2 * c5).toFixed(2) + ' &ne; $' + c10.toFixed(2) + '), because of the $' + c + ' start fee.') + '</p>';
        });
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  function tbl(rows) { return '<div class="tbl"><table><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i ? '' : ' class="l"') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }

  var LESSONS = [
    { id: 'fdp', title: 'Fractions, decimals and percents', sub: 'Three names for one amount.', concepts: [
      { id: 'hundred', title: 'Percent means out of 100', exp: ['B1.7'], skill: 'pr-fdp',
        body: '<p><b>Percent</b> means "out of 100". 35% is 35 out of 100: the same amount as ' + fr(35, 100) + ' and as 0.35.</p>',
        watch: K.slides([
          { say: 'A hundred grid is one whole: 100 small squares.', fig: function () { return hgrid(0); } },
          { say: 'Shade 35 squares. That is 35 out of 100.', fig: function () { return hgrid(35); } },
          { say: 'As a fraction: 35 hundredths. As a decimal: 0.35. As a percent: 35%.', fig: eq(fr(35, 100) + ' = 0.35 = 35%') },
          { say: 'Shade all 100 squares and you have 100%: one whole.', fig: function () { return hgrid(100); }, ms: 2400 }
        ]),
        try: lab('hgo', [
          { do: 'Shade <b>40%</b> of the grid.', goal: function (h) { return K.v(h, 'hgr') === 40; }, yes: '40% = 0.4 = 40/100 = 2/5.' },
          { do: 'Shade <b>one quarter</b> of the grid.', goal: function (h) { return K.v(h, 'hgr') === 25; }, yes: '1/4 = 25/100 = 25%.' },
          { do: 'Shade <b>0.05</b> of the grid.', goal: function (h) { return K.v(h, 'hgr') === 5; }, yes: '0.05 is 5 hundredths: 5%, not 50%.' }
        ]),
        key: '<p><b>Percent means out of 100.</b> ' + fr(35, 100) + ' = 0.35 = 35%.</p>',
        mistake: '<p>Writing 0.2 as 2%. 0.2 is 2 tenths, which is 20 hundredths: 20%.</p>',
        check: [function () { return mc('Which is equal to 0.2?', '20%', ['2%', fr(1, 2), fr(1, 20)], '0.2 is 2 tenths, which is 20 hundredths.', '0.2 = ' + fr(20, 100) + ' = 20%.', hgrid(20)); }, K.ck('pr-fdp', 1)] },
      { id: 'facts', title: 'Equivalents to know', exp: ['B2.2'], skill: 'pr-facts',
        body: '<p>Some equivalents come up all the time. Learn them like times tables.</p>' + tbl([[fr(1, 2), '0.5', '50%'], [fr(1, 4), '0.25', '25%'], [fr(3, 4), '0.75', '75%'], [fr(1, 5), '0.2', '20%'], [fr(1, 10), '0.1', '10%'], [fr(1, 3), '0.333...', 'about 33.3%']]),
        watch: K.slides([
          { say: 'One half is 50 out of 100: 50%.', fig: function () { return hgrid(50); } },
          { say: 'One quarter is 25 out of 100: 25%.', fig: function () { return hgrid(25); } },
          { say: 'One fifth is 20 out of 100: 20%.', fig: function () { return hgrid(20); } },
          { say: 'One tenth is 10%. One twentieth is 5%.', fig: function () { return hgrid(10); } },
          { say: 'One third does not fit evenly: about 33.3%.', fig: function () { return hgrid(33.3); }, ms: 2400 }
        ]),
        key: '<p><b>½ = 50%, ¼ = 25%, ⅕ = 20%, ⅒ = 10%.</b> Build the rest from these.</p>',
        mistake: '<p>Thinking ⅓ = 30% or ⅕ = 5%. Link each one to the hundred grid.</p>',
        check: [K.ck('pr-facts', 1), K.ck('pr-facts', 1), K.ck('pr-facts', 2)] }
    ] },
    { id: 'convert', title: 'Converting', sub: 'Any fraction as a decimal and a percent.', concepts: [
      { id: 'divide', title: 'Divide top by bottom', exp: ['B1.7'], skill: 'pr-fdp',
        body: '<p>A fraction bar means <b>divide</b>. Divide the top by the bottom to get a decimal. Then multiply by 100 to get the percent.</p>',
        watch: K.slides([
          { say: 'Three eighths as a percent.', fig: function () { return pbar(3, 8); } },
          { say: 'Divide: 3 &divide; 8 = 0.375.', fig: eq(fr(3, 8) + ' = 3 &divide; 8 = 0.375') },
          { say: 'Multiply by 100: 37.5%.', fig: eq('0.375 &times; 100 = 37.5%') },
          { say: 'The bar agrees: the shaded part reaches 37.5% of the way.', fig: function () { return pbar(3, 8); }, ms: 2400 }
        ]),
        try: lab('cvn', [
          { do: 'Change <b>7/20</b> to a percent.', goal: function (h) { return +K.v(h, 'cvn') === 7 && +K.v(h, 'cvd') === 20; }, yes: '7 ÷ 20 = 0.35 = 35%.' },
          { do: 'Find a fraction that equals <b>60%</b>.', goal: function (h) { var n = +K.v(h, 'cvn'), d = +K.v(h, 'cvd'); return d > 0 && Math.abs(n / d - 0.6) < 1e-9; }, yes: 'For example 3/5 or 6/10.' },
          { do: 'Find a fraction <b>more than 100%</b>.', goal: function (h) { var n = +K.v(h, 'cvn'), d = +K.v(h, 'cvd'); return d > 0 && n > d; }, yes: 'When the top is bigger than the bottom, it is more than one whole.' }
        ]),
        key: '<p><b>Top &divide; bottom gives the decimal. &times; 100 gives the percent.</b></p>',
        mistake: '<p>Dividing the bottom by the top (8 &divide; 3). The fraction bar reads "top divided by bottom".</p>',
        check: [function () { return { q: 'Write ' + fr(7, 20) + ' as a percent.', type: 'num', answer: 35, unit: '%', hint: 'Multiply top and bottom by 5 to get hundredths.', explain: fr(7, 20) + ' = ' + fr(35, 100) + ' = 35%.' }; }, K.ck('pr-fdp', 2), K.ck('pr-fdp', 2)] },
      { id: 'point', title: 'Move the point two places', exp: ['B1.7'], skill: 'pr-fdp', hard: true,
        body: '<div class="vs"><div><b class="t">Decimal to percent</b><p>&times; 100: move the point 2 places <b>right</b>.</p><p>0.375 &rarr; 37.5%</p></div><div><b class="t">Percent to decimal</b><p>&divide; 100: move the point 2 places <b>left</b>.</p><p>8% &rarr; 0.08</p></div></div>',
        watch: K.slides([
          { say: '0.375 to a percent: move the point 2 places right.', fig: eq('0.375 &rarr; 03.75 &rarr; 037.5 = <b>37.5%</b>') },
          { say: '8% to a decimal: 8 is really 8.0. Move the point 2 places left.', fig: eq('8.0% &rarr; 0.80 &rarr; <b>0.08</b>') },
          { say: 'A one-digit percent needs a zero after the point: 5% is 0.05, not 0.5.', fig: eq('5% = 0.05 &nbsp;&nbsp; 50% = 0.5'), ms: 2800 }
        ]),
        ways: [
          { label: 'Think hundredths', html: '<p>8% is 8 hundredths. In a place value chart, 8 hundredths is 0.08: 0 ones, 0 tenths, 8 hundredths.</p>' },
          { label: 'Use money', html: '<p>A dollar is 100 cents. 8% of a dollar is 8¢, which is $0.08. 50% of a dollar is 50¢, $0.50.</p>' },
          { label: 'Check with a picture', html: '<p>5% is 5 squares of the hundred grid; 0.5 would be half the grid. They are clearly different.</p><div class="vrow"><figure><figcaption>5%</figcaption>' + hgrid(5) + '</figure><figure><figcaption>0.5 = 50%</figcaption>' + hgrid(50) + '</figure></div>' }
        ],
        key: '<p><b>Decimal &rarr; percent: point 2 right. Percent &rarr; decimal: point 2 left.</b></p>',
        mistake: '<p>Writing 5% as 0.5, or moving the point the wrong way. Ask: is 5% less than half? Then the decimal must be less than 0.5.</p>',
        check: [function () { return mc('Which decimal equals 8%?', '0.08', ['0.8', '8.0', '0.008'], 'Percent to decimal: move the point 2 places left.', '8% = 8 hundredths = 0.08.'); }, function () { var d = R.int(1, 99) / 1000 * 10, p = Math.round(d * 1000) / 10; return { q: 'Write ' + String(Math.round(d * 1000) / 1000) + ' as a percent.', type: 'num', answer: p, unit: '%', hint: 'Move the point 2 places right.', explain: String(Math.round(d * 1000) / 1000) + ' &times; 100 = ' + p + '%.' }; }, K.ck('pr-fdp', 3)] }
    ] },
    { id: 'change', title: 'Percent changes', sub: 'Find percents in your head.', concepts: [
      { id: 'mental', title: 'Build from 10%', exp: ['B2.3'], skill: 'pr-mental',
        body: '<p>Some percents are easy to find in your head. <b>10%: divide by 10.</b> Build the others from it.</p>' + tbl([['100%', 'the whole', '240'], ['50%', '&divide; 2', '120'], ['25%', '&divide; 4', '60'], ['10%', '&divide; 10', '24'], ['5%', 'half of 10%', '12'], ['1%', '&divide; 100', '2.4']]),
        watch: K.slides([
          { say: 'Find 15% of 240.', fig: eq('15% of 240') },
          { say: '10% of 240: divide by 10. That is 24.', fig: eq('10% = 24') },
          { say: '5% is half of 10%: 12.', fig: eq('5% = 12') },
          { say: '15% = 10% + 5% = 24 + 12 = <b>36</b>.', fig: eq('15% = 24 + 12 = 36'), ms: 2400 }
        ]),
        key: '<p><b>Find 10% first.</b> Halve it for 5%, double it for 20%, add pieces for the rest.</p>',
        mistake: '<p>Dividing by the percent: 15% of 240 as 240 &divide; 15. Only 10% means divide by 10 (and 50% means divide by 2).</p>',
        check: [function () { var n = R.pick([40, 60, 80, 120, 160, 240, 300]); return { q: 'What is 15% of ' + n + '?', type: 'num', answer: n * 0.15, hint: '10% of ' + n + ' is ' + n / 10 + '. 5% is half of that.', explain: n / 10 + ' + ' + n / 20 + ' = ' + n * 0.15 + '.' }; }, K.ck('pr-mental', 1)] },
      { id: 'incdec', title: 'Increase and decrease', exp: ['B2.3'], skill: 'pr-mental', hard: true,
        body: '<p>To <b>increase</b> by a percent, add that part on. To <b>decrease</b>, take it away.</p>',
        watch: K.slides([
          { say: 'An $80 jacket is 25% off.', fig: function () { return change(80, 25, false); } },
          { say: '25% of 80 is 80 &divide; 4 = 20.', fig: eq('25% of $80 = $20') },
          { say: 'Take it away: 80 &minus; 20 = <b>$60</b>.', fig: eq('$80 &minus; $20 = $60') },
          { say: 'Increase works the other way: 60 increased by 10% is 60 + 6 = 66.', fig: function () { return change(60, 10, true); }, ms: 2600 }
        ]),
        try: lab('pcn', [
          { do: 'Decrease <b>80</b> by <b>25%</b>.', goal: function (h) { return +K.v(h, 'pcn') === 80 && K.v(h, 'pcp') === 25 && K.v(h, 'pcu') === 0; }, yes: '25% of 80 is 20. 80 − 20 = 60.' },
          { do: 'Make a number <b>double</b>.', goal: function (h) { return K.v(h, 'pcp') === 100 && K.v(h, 'pcu') === 1; }, yes: 'Increasing by 100% doubles a number.' },
          { do: 'Make the answer <b>zero</b>.', goal: function (h) { return K.v(h, 'pcp') === 100 && K.v(h, 'pcu') === 0; }, yes: 'Decreasing by 100% leaves nothing.' }
        ]),
        ways: [
          { label: 'Find what is left', html: '<p>25% off means you pay 75%. 75% of 80 = 3 quarters of 80 = 60. One step instead of two.</p>' },
          { label: 'Bar model', html: '<div class="fig">' + change(80, 25, false) + '</div><p>The dashed part is the 25% taken away.</p>' },
          { label: 'Shopping', html: '<p>Tax in Ontario is 13%. A $20 item: 10% is $2, 1% is $0.20, so 3% is $0.60. 13% is $2.60. Total $22.60.</p>' }
        ],
        key: '<p><b>Find the percent part. Add it for an increase, take it away for a decrease.</b></p>',
        mistake: '<p>Stopping at the part: answering $20 when asked for the sale price of an $80 jacket at 25% off. Ask: is that what you pay, or what you save?</p>',
        check: [function () { return { q: 'Increase 70 by 5%.', type: 'num', answer: 73.5, hint: '10% of 70 is 7. 5% is half of that.', explain: '5% of 70 = 3.5. 70 + 3.5 = 73.5.' }; }, K.ck('pr-mental', 2), K.ck('pr-mental', 3)] }
    ] },
    { id: 'ratio', title: 'Ratios and rates', sub: 'Compare two amounts.', concepts: [
      { id: 'ratio', title: 'Ratios', exp: ['B2.10'], skill: 'pr-prop',
        body: '<p>A <b>ratio</b> compares two amounts of the same kind: 2 cups of juice to 3 cups of water is <b>2 : 3</b>. A double number line keeps them lined up.</p>',
        watch: K.slides([
          { say: 'Punch: 2 cups of juice for every 3 cups of water.', fig: function () { return dline(2, 3, 1, 'Juice', 'Water', 1); } },
          { say: 'A second batch: 4 cups of juice and 6 of water.', fig: function () { return dline(2, 3, 2, 'Juice', 'Water', 2); } },
          { say: 'Keep going. Each jump adds 2 juice and 3 water.', fig: function () { return dline(2, 3, 5, 'Juice', 'Water', 5); } },
          { say: 'For 6 cups of juice, you need <b>9 cups of water</b>.', fig: function () { return dline(2, 3, 5, 'Juice', 'Water', 3); }, ms: 2400 }
        ]),
        key: '<p><b>Equivalent ratios: multiply both parts by the same number.</b> 2 : 3 = 4 : 6 = 6 : 9.</p>',
        mistake: '<p>Adding the same amount to both parts: 2 : 3 becomes 6 : 7. The punch would taste different. Multiply, do not add.</p>',
        check: [function () { var a = R.int(1, 4), b = R.int(a + 1, 6), k = R.int(2, 5); return { q: 'A recipe uses ' + a + ' cup' + (a > 1 ? 's' : '') + ' of juice for ' + b + ' cups of water. How much water for ' + a * k + ' cups of juice?', type: 'num', answer: b * k, hint: a + ' was multiplied by ' + k + '. Do the same to ' + b + '.', explain: b + ' &times; ' + k + ' = ' + b * k + ' cups.' }; }, K.ck('pr-prop', 1)] },
      { id: 'unit', title: 'Unit rates and the better buy', exp: ['B2.10'], skill: 'pr-unit', hard: true,
        body: '<p>A <b>rate</b> compares different kinds: 150 km in 2 h. A <b>unit rate</b> is the amount for 1: 75 km per hour. Unit rates make fair comparisons easy.</p>',
        watch: K.slides([
          { say: 'Cereal A: 500 g for $4.50. Cereal B: 750 g for $6.00. Which is the better buy?', fig: eq('A: 500 g, $4.50 &nbsp;&nbsp; B: 750 g, $6.00') },
          { say: 'Find the price for the same amount, 100 g. A: 4.50 &divide; 5 = $0.90.', fig: eq('A: $0.90 per 100 g') },
          { say: 'B: 6.00 &divide; 7.5 = $0.80.', fig: eq('B: $0.80 per 100 g') },
          { say: 'B costs less for the same amount. <b>B is the better buy.</b>', fig: eq('$0.80 &lt; $0.90 &rarr; B'), ms: 2400 }
        ]),
        try: lab('bua', [
          { do: 'Make the two sizes <b>exactly as good</b> as each other.', goal: function (h) { var a = +K.v(h, 'bua'), pa = +K.v(h, 'bupa'), b = +K.v(h, 'bub'), pb = +K.v(h, 'bupb'); return a > 0 && b > 0 && Math.abs(pa / a - pb / b) < 1e-9; }, yes: 'Same unit price: neither is a better buy.' },
          { do: 'Now make <b>size A</b> the better buy.', goal: function (h) { var a = +K.v(h, 'bua'), pa = +K.v(h, 'bupa'), b = +K.v(h, 'bub'), pb = +K.v(h, 'bupb'); return a > 0 && b > 0 && pa / a < pb / b - 1e-9; }, yes: 'A costs less per 100 g.' }
        ]),
        ways: [
          { label: 'Find the amount for $1', html: '<p>A: 500 g &divide; 4.50 &asymp; 111 g per dollar. B: 750 g &divide; 6 = 125 g per dollar. More grams per dollar is better: B.</p>' },
          { label: 'Scale to the same size', html: '<p>1500 g of A is 3 boxes: $13.50. 1500 g of B is 2 boxes: $12.00. B is cheaper for the same amount.</p>' }
        ],
        key: '<p><b>Unit rate = amount &divide; number of units.</b> Compare unit rates to find the better buy.</p>',
        mistake: '<p>Choosing the cheaper package without looking at size. Compare price for the <b>same</b> amount.</p>',
        check: [function () { return { q: 'A car goes 240 km in 3 h. What is its speed in km per hour?', type: 'num', answer: 80, unit: 'km/h', hint: 'Find the distance for 1 hour.', explain: '240 &divide; 3 = 80 km/h.' }; }, K.ck('pr-unit', 1), K.ck('pr-unit', 2)] }
    ] },
    { id: 'prop', title: 'Proportional situations', sub: 'Double one, double the other.', concepts: [
      { id: 'isprop', title: 'Proportional or not?', exp: ['B2.10'], skill: 'pr-isprop', hard: true,
        body: '<p>Two amounts are <b>proportional</b> if one is always the same multiple of the other. On a graph, the points make a straight line that <b>starts at 0</b>.</p>',
        watch: K.slides([
          { say: 'Bike rental: $2 per km. 0 km costs $0.', fig: function () { return graph([{ m: 2, c: 0, col: 'var(--sb)', lab: '$2/km' }], 10, 25, 'distance (km)', 'cost ($)'); } },
          { say: '5 km costs $10, 10 km costs $20. Double the distance, double the cost: proportional.', fig: eq('5 km &rarr; $10 &nbsp;&nbsp; 10 km &rarr; $20') },
          { say: 'Taxi: $4 to start, then $1.50 per km. Its line starts at 4.', fig: function () { return graph([{ m: 2, c: 0, col: 'var(--sb)', lab: '$2/km' }, { m: 1.5, c: 4, col: 'var(--se)', lab: '$4 + $1.50/km' }], 10, 25, 'distance (km)', 'cost ($)'); } },
          { say: '5 km costs $11.50, but 10 km costs $19, not double. <b>Not proportional.</b>', fig: eq('5 km &rarr; $11.50 &nbsp;&nbsp; 10 km &rarr; $19'), ms: 2800 }
        ]),
        try: lab('ppmo', [
          { do: 'Make the taxi <b>proportional</b>.', goal: function (h) { return K.v(h, 'ppc') === 0; }, yes: 'With no start fee, the line starts at 0: proportional.' },
          { do: 'Make a taxi that costs <b>$10 for 4 km</b>.', goal: function (h) { return Math.abs(K.v(h, 'ppc') + 4 * K.v(h, 'ppm') - 10) < 1e-9; }, yes: 'Start fee + 4 × cost per km = $10.' }
        ]),
        ways: [
          { label: 'Make a table', html: tbl([['km', '0', '5', '10'], ['Bike', '$0', '$10', '$20'], ['Taxi', '$4', '$11.50', '$19']]) + '<p>Bike: cost &divide; km is always 2. Taxi: 11.50 &divide; 5 = 2.30 but 19 &divide; 10 = 1.90. Not constant, so not proportional.</p>' },
          { label: 'Ask about zero', html: '<p>What does nothing cost? If buying 0 still costs something (a joining fee, a start fee), it is not proportional.</p>' }
        ],
        key: '<p><b>Proportional: same multiple every time, and 0 goes with 0.</b></p>',
        mistake: '<p>Thinking any straight line is proportional. It must also pass through 0.</p>',
        check: [function () { return mc('Which situation is proportional?', 'Notebooks at $3 each', ['A gym: $20 to join, then $10 a month', 'A phone plan: $15 a month plus $0.10 a text'], 'Which one costs $0 when you buy nothing?', 'Notebooks: always 3 times the number. The others have a fee.'); }, K.ck('pr-isprop', 1), K.ck('pr-isprop', 2)] },
      { id: 'solve', title: 'Solve a proportion', exp: ['B2.10'], skill: 'pr-prop',
        body: '<p>To solve a proportion, find the <b>unit rate</b>, then multiply.</p>',
        watch: K.slides([
          { say: '3 kg of apples cost $7.50. How much do 5 kg cost?', fig: eq('3 kg &rarr; $7.50 &nbsp;&nbsp; 5 kg &rarr; ?') },
          { say: 'Unit rate: 7.50 &divide; 3 = $2.50 per kg.', fig: eq('1 kg &rarr; $2.50') },
          { say: '5 kg: 5 &times; 2.50 = <b>$12.50</b>.', fig: eq('5 kg &rarr; $12.50'), ms: 2400 }
        ]),
        key: '<p><b>Find the amount for 1. Then multiply.</b></p>',
        mistake: '<p>Adding instead of scaling: 3 kg is $7.50, so 5 kg is $9.50 ("2 more"). Ask: is the price per kg the same?</p>',
        check: [K.ck('pr-prop', 2), K.ck('pr-prop', 3)] }
    ] }
  ];


  A.register('percent-ratio', {
    lessons: LESSONS,

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

  /* ---------- question shapes: more ways to practise each skill ---------- */
  var BENCH = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [1, 25]];
  function pc(f) { return cl(f[0] / f[1] * 100); }
  function pts(a, b, ks) { return ks.map(function (k) { return '(' + a * k + ', ' + b * k + ')'; }); }
  K.shapes('percent-ratio', {
    'pr-fdp': [
      [1, 'match', function () {
        var fs = R.shuffle(BENCH).slice(0, 3), pairs = fs.map(function (f) { return [fr(f[0], f[1]), dec(pc(f)) + '%']; });
        return { q: 'Match each fraction to its percent.', type: 'match', pairs: pairs,
          hint: 'Make the bottom 100. The top is then the percent.', steps: ['For example, ' + fr(3, 5) + ' = ' + fr(60, 100) + ' = 60%.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'pr-fp-match', fs: fs } };
      }],
      [1, 'fill', function () {
        var p = R.int(1, 99), x = cl(p / 100);
        return { q: 'Fill in the blanks.', type: 'fill', fill: '<span class="math">' + dec(x) + ' = </span>[[]]<span class="math">% = </span>[[]]<span class="math"> / 100</span>', answers: [p, p],
          fig: hgrid(p), hint: 'Percent means "out of 100". Move the decimal point two places right.', steps: [dec(x) + ' = ' + p + ' hundredths.', 'That is ' + p + '% and ' + p + '/100.'],
          explain: dec(x) + ' = ' + p + '% = ' + fr(p, 100) + '.', meta: { k: 'pr-dp-fill', x: x } };
      }],
      [1, 'line', function () {
        var f = R.pick(BENCH.filter(function (b) { return pc(b) % 5 === 0; }));
        return { q: 'This line goes from 0% to 100%. Place <span class="math">' + fr(f[0], f[1]) + '</span>.', type: 'line', min: 0, max: 100, tick: 5, every: 25, snap: 5, answer: pc(f), label: function (v) { return v + '%'; },
          hint: 'Change ' + fr(f[0], f[1]) + ' to a percent first.', steps: [fr(f[0], f[1]) + ' = ' + fr(pc(f), 100) + ' = ' + pc(f) + '%.'],
          explain: fr(f[0], f[1]) + ' = ' + pc(f) + '%.', meta: { k: 'pr-f-line', f: f } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), f = R.pick(BENCH.filter(function (b) { return b[0] * 10 + b[1] !== pc(b); })), truth = R.int(0, 1), said = truth ? pc(f) : f[0] * 10 + f[1];
        var right = fr(f[0], f[1]) + ' = ' + fr(pc(f), 100) + ', which is ' + pc(f) + '%.';
        return { q: who + ' says <span class="math">' + fr(f[0], f[1]) + ' = ' + said + '%</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Put the top and bottom digits side by side to get the percent.', 'The percent is always the bottom number.']),
          hint: 'Make the bottom 100.', steps: [right], explain: right, meta: { k: 'pr-fp-tf', f: f, said: said } };
      }]
    ],
    'pr-facts': [
      [1, 'match', function () {
        var fs = R.shuffle([[1, 2], [1, 4], [3, 4], [1, 5], [1, 10]]).slice(0, 4), pairs = fs.map(function (f) { return [fr(f[0], f[1]), pc(f) + '%']; });
        return { q: 'Match the fractions you should know by heart to their percents.', type: 'match', pairs: pairs,
          hint: 'One half is 50%. One quarter is half of that.', steps: [fr(1, 2) + ' = 50%, ' + fr(1, 4) + ' = 25%, ' + fr(1, 5) + ' = 20%, ' + fr(1, 10) + ' = 10%.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'pr-fp-match', fs: fs } };
      }],
      [1, 'pick', function () {
        var f = R.pick([[1, 2], [1, 4], [3, 4], [1, 5], [1, 10]]), p = pc(f), v = p / 100;
        var right = [fr(f[0] * 2, f[1] * 2), dec(v)], wrong = [dec(v / 10), fr(f[1], f[0]), dec(p), fr(f[0], f[1] + 1)];
        var items = R.shuffle(right.map(function (t) { return [t, 1]; }).concat(R.shuffle(wrong).slice(0, 3).map(function (t) { return [t, 0]; })));
        var vals = items.map(function (it) { return it[0]; });
        return { q: 'Pick every one that equals <b>' + p + '%</b>.', type: 'pick', options: vals, answer: K.picks(items, function (it) { return it[1]; }),
          hint: p + '% means ' + p + ' out of 100.', steps: [p + '% = ' + fr(f[0], f[1]) + ' = ' + dec(v) + '.'],
          explain: p + '% = ' + fr(f[0], f[1]) + ' = ' + fr(f[0] * 2, f[1] * 2) + ' = ' + dec(v) + '.', meta: { k: 'pr-pick-eq', p: p } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), f = R.pick([[1, 5], [1, 4], [3, 4], [1, 20]]), truth = R.int(0, 1), said = truth ? pc(f) : f[1];
        var right = fr(f[0], f[1]) + ' = ' + pc(f) + '%.';
        return { q: who + ' says <span class="math">' + fr(f[0], f[1]) + ' = ' + said + '%</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['The bottom number is the percent.', 'Every fraction with a 1 on top is 10%.']),
          hint: 'How many of these parts make 100%?', steps: [right], explain: right, meta: { k: 'pr-fp-tf', f: f, said: said } };
      }]
    ],
    'pr-mental': [
      [1, 'fill', function (lv) {
        var n = R.int(2, 40) * 10, k = R.pick(lv === 1 ? [2, 3, 5] : [2, 3, 4, 5, 6, 7, 8, 9]);
        return { q: 'Build from 10%. Fill in the blanks.', type: 'fill', fill: '10% of ' + n + ' = [[]], so ' + 10 * k + '% of ' + n + ' = [[]]', answers: [n / 10, n / 10 * k],
          hint: '10% is one tenth. Divide by 10.', steps: ['10% of ' + n + ' = ' + n / 10 + '.', 10 * k + '% is ' + k + ' times as much: ' + n / 10 * k + '.'],
          explain: 10 * k + '% of ' + n + ' = ' + n / 10 * k + '.', meta: { k: 'pr-10-fill', n: n, p: 10 * k } };
      }],
      [1, 'story', function () {
        var who = K.name(), price = R.int(2, 20) * 10, p = R.pick([10, 20, 25, 30, 40, 50]), it = R.pick(['hockey stick', 'winter jacket', 'backpack', 'pair of skates']), sale = cl(price * (100 - p) / 100);
        return { q: 'A ' + it + ' costs <b>$' + price + '</b>. It is <b>' + p + '% off</b>. What is the sale price?', type: 'num', unit: '$', answer: sale,
          hint: 'Find ' + p + '% of $' + price + ', then take it away.', steps: [p + '% of ' + price + ' = ' + dec(price * p / 100) + '.', price + ' &minus; ' + dec(price * p / 100) + ' = ' + dec(sale) + '.'],
          explain: 'The sale price is ' + money(sale) + '.', meta: { k: 'pr-sale-story', price: price, p: p } };
      }],
      [1, 'which', function () {
        var p = R.pick([5, 10, 15, 20, 25, 30, 40]), up = R.int(0, 1), n = R.int(2, 20) * 10;
        var right = 'Multiply by ' + dec(1 + (up ? p : -p) / 100), o = R.mc(right, ['Multiply by ' + dec(1 + (up ? -p : p) / 100), 'Multiply by ' + dec(p / 100), 'Add ' + p]);
        return { q: 'Which way? To ' + (up ? 'increase' : 'decrease') + ' ' + n + ' by ' + p + '% in one step, what do you do?', type: 'mc', options: o.options, answer: o.answer,
          hint: (up ? 'You keep 100% and add ' : 'You keep 100% and take away ') + p + '%.', steps: [(up ? '100% + ' : '100% &minus; ') + p + '% = ' + (up ? 100 + p : 100 - p) + '% = ' + dec(1 + (up ? p : -p) / 100) + '.'],
          explain: n + ' &times; ' + dec(1 + (up ? p : -p) / 100) + ' = ' + dec(n * (1 + (up ? p : -p) / 100)) + '.', meta: { k: 'pr-mult-which', p: p, up: up } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), n = R.pick([30, 40, 60, 80, 120]), p = R.pick([10, 20, 25, 50]), truth = R.int(0, 1), said = truth ? n * (100 - p) / 100 : n - p;
        var right = p + '% of $' + n + ' is $' + dec(n * p / 100) + ', so the price is $' + dec(n * (100 - p) / 100) + '.';
        return { q: 'A $' + n + ' game is ' + p + '% off. ' + who + ' says it now costs <b>$' + dec(said) + '</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, [p + '% off means take $' + p + ' off.', 'Percent off is always half price.']),
          hint: 'Find ' + p + '% of ' + n + ' first.', steps: [right], explain: right, meta: { k: 'pr-off-tf', n: n, p: p, said: said } };
      }]
    ],
    'pr-unit': [
      [1, 'tap', function () {
        return K.retry(function () {
          var it = R.pick(['granola bars', 'juice boxes', 'muffins', 'pencils']), packs = K.uniq(3, function () { var c = R.pick([4, 5, 6, 8, 10, 12]); return [c, cl(c * R.int(40, 120) / 100)]; }, function (p) { return p[0]; });
          var unit = packs.map(function (p) { return p[1] / p[0]; }), best = unit.indexOf(Math.min.apply(null, unit));
          if (unit.filter(function (u) { return Math.abs(u - unit[best]) < 0.005; }).length > 1) return null;
          return { q: 'Tap the better buy for ' + it + '.', type: 'tap', tiles: packs.map(function (p) { return p[0] + ' for ' + money(p[1]); }), answer: best, answerText: packs[best][0] + ' for ' + money(packs[best][1]),
            hint: 'Find the price of one in each pack.', steps: packs.map(function (p) { return money(p[1]) + ' &divide; ' + p[0] + ' &asymp; ' + money(p[1] / p[0]) + ' each.'; }),
            explain: packs[best][0] + ' for ' + money(packs[best][1]) + ' has the lowest price for one.', meta: { k: 'pr-best-tap', packs: packs } };
        });
      }],
      [1, 'story', function () {
        var who = K.name(), h = R.int(2, 6), r = R.int(6, 11) * 10, km = h * r;
        return { q: who + '\'s family drives <b>' + km + ' km</b> in <b>' + h + ' hours</b> on the Trans-Canada Highway. What is their speed in kilometres per hour?', type: 'num', unit: 'km/h', answer: r,
          hint: 'Divide the distance by the hours.', steps: [km + ' &divide; ' + h + ' = ' + r + '.'],
          explain: 'They drive ' + r + ' km each hour.', meta: { k: 'pr-rate-story', km: km, h: h } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), s = R.int(4, 6), b = s * 2, ps = cl(s * R.int(50, 90) / 100), pb = cl(ps * 2 + R.pick([-0.6, 0.6])), big = pb / b < ps / s;
        var right = 'Small: ' + money(ps) + ' &divide; ' + s + ' = ' + money(ps / s) + ' each. Big: ' + money(pb) + ' &divide; ' + b + ' = ' + money(pb / b) + ' each. The ' + (big ? 'big' : 'small') + ' pack is the better buy.';
        return { q: 'A pack of ' + s + ' costs ' + money(ps) + '. A pack of ' + b + ' costs ' + money(pb) + '. ' + who + ' says the <b>big</b> pack is the better buy, because big packs always are. True or false?', type: 'tf', answer: big,
          why: K.why(right, ['Bigger packs are always the better buy.', 'The cheaper pack is always the better buy.']),
          hint: 'Find the price of one in each pack.', steps: [right], explain: right, meta: { k: 'pr-pack-tf', s: [s, ps], b: [b, pb] } };
      }]
    ],
    'pr-prop': [
      [1, 'fill', function () {
        var a = R.int(1, 9), b = R.int(1, 9), k = R.int(2, 6); while (b === a) b = R.int(1, 9);
        return { q: 'Fill in the blank to make the ratios equivalent.', type: 'fill', fill: '<span class="math">' + a + ' : ' + b + ' = ' + a * k + ' : </span>[[]]', answers: [b * k],
          hint: 'What was ' + a + ' multiplied by?', steps: [a + ' &times; ' + k + ' = ' + a * k + '.', 'Do the same to ' + b + ': ' + b * k + '.'],
          explain: a + ' : ' + b + ' = ' + a * k + ' : ' + b * k + '.', meta: { k: 'pr-ratio-fill', a: a, b: b, A: a * k } };
      }],
      [1, 'match', function () {
        var base = K.uniq(3, function () { var a = R.int(1, 5), b = R.int(2, 7); return a === b ? [1, 2] : [a, b]; }, function (r) { var g = gcd(r[0], r[1]); return r[0] / g + ':' + r[1] / g; });
        var ks = base.map(function () { return R.int(2, 5); }), pairs = base.map(function (r, i) { return [r[0] + ' : ' + r[1], r[0] * ks[i] + ' : ' + r[1] * ks[i]]; });
        return { q: 'Match each ratio to an equivalent ratio.', type: 'match', pairs: pairs,
          hint: 'Multiply both parts by the same number.', steps: ['2 : 3 = 4 : 6 = 6 : 9.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'pr-ratio-match' } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a = R.int(2, 6), b = R.int(3, 9), k = R.int(2, 3), d = a * k - a; while (b === a) b = R.int(3, 9);
        var truth = R.int(0, 1), said = truth ? b * k : b + d;
        var right = 'Equivalent ratios multiply both parts by the same number: ' + a + ' &times; ' + k + ' = ' + a * k + ', so ' + b + ' &times; ' + k + ' = ' + b * k + '.';
        return { q: who + ' says <span class="math">' + a + ' : ' + b + ' = ' + a * k + ' : ' + said + '</span>. True or false?', type: 'tf', answer: said === b * k,
          why: K.why(right, ['Add the same number to both parts.', 'Any two ratios with bigger numbers are equivalent.']),
          hint: 'Did ' + who + ' multiply or add?', steps: [right], explain: right, meta: { k: 'pr-ratio-tf', a: a, b: b, A: a * k, said: said } };
      }]
    ],
    'pr-isprop': [
      [1, 'tap', function () {
        var r = R.int(2, 6), c = R.int(1, 5), tables = R.shuffle([[r, 0], [r, c], [r + 1, -1]]);
        var at = tables.findIndex(function (t) { return t[1] === 0; });
        var show = function (t) { return [1, 2, 3].map(function (x) { return x + ' &rarr; ' + (t[0] * x + t[1]); }).join('<br>'); };
        return { q: 'Each card shows the cost for 1, 2 and 3 tickets. Tap the one that is <b>proportional</b>.', type: 'tap', tiles: tables.map(show), answer: at, answerText: '1 → ' + r + ', 2 → ' + 2 * r + ', 3 → ' + 3 * r,
          hint: 'Proportional: double the tickets, double the cost.', steps: ['Divide the cost by the tickets for each row. In a proportional table it is always the same.'],
          explain: 'Only 1 &rarr; ' + r + ', 2 &rarr; ' + 2 * r + ', 3 &rarr; ' + 3 * r + ' keeps the same rate, ' + r + ' per ticket.', meta: { k: 'pr-prop-tap', tables: tables } };
      }],
      [1, 'pick', function () {
        return K.retry(function () {
          var a = R.int(1, 5), b = R.int(2, 9); if (a === b) return null;
          var opts = K.uniq(5, function () { return R.int(0, 1) ? [a * R.int(2, 6), b * R.int(2, 6)] : (function (k) { return [a * k, b * k]; })(R.int(2, 8)); }, String);
          var ans = K.picks(opts, function (p) { return p[0] * b === p[1] * a; });
          if (!ans) return null;
          return { q: 'A recipe uses <b>' + a + ' cups of flour for every ' + b + ' cups of oats</b>. Pick every mix that keeps the same ratio (flour, oats).', type: 'pick', options: opts.map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }), answer: ans,
            hint: 'Both numbers must be multiplied by the same number.', steps: ['Check: is flour &divide; ' + a + ' the same as oats &divide; ' + b + '?'],
            explain: ans.map(function (j) { return '(' + opts[j][0] + ', ' + opts[j][1] + ')'; }).join(', ') + ' keep the ratio ' + a + ' : ' + b + '.', meta: { k: 'pr-prop-pick', a: a, b: b, opts: opts } };
        });
      }],
      [2, 'mistake', function () {
        var who = K.name(), per = R.int(2, 4), base = R.int(0, 1) ? 0 : R.int(3, 5);
        var right = base ? 'There is a starting fee, so 0 km does not cost $0. It is not proportional.' : 'It costs $' + per + ' for every kilometre and $0 for 0 km, so it is proportional.';
        return { q: 'A bike rental costs ' + (base ? '$' + base + ' to start plus ' : '') + '$' + per + ' per kilometre. ' + who + ' says the cost is <b>proportional</b> to the distance. True or false?', type: 'tf', answer: !base,
          why: K.why(right, ['Any cost that goes up with distance is proportional.', 'Costs are never proportional.']),
          hint: 'What does 0 km cost?', steps: [right], explain: right, meta: { k: 'pr-fee-tf', base: base } };
      }]
    ]
  });
})();
