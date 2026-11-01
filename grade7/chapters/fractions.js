(function () {
  var A = Atlas, R = A.R, fr = A.fr, frs = A.frs, gcd = A.gcd;
  function lcm(a, b) { return a / gcd(a, b) * b; }
  var COL = ['var(--sb)', 'var(--se)', 'var(--sd)', 'var(--sc)'];

  /* a bar d parts long with n shaded. Bars wider than one whole wrap into several wholes. */
  function bar(n, d, o) {
    o = o || {};
    var W = o.w || 420, col = o.col || 'var(--strand)', wholes = Math.max(1, Math.ceil(n / d)), bw = Math.min(W, (540 - 10 * (wholes - 1)) / wholes), cw = bw / d, s = '';
    for (var k = 0; k < wholes; k++) for (var i = 0; i < d; i++) {
      var idx = k * d + i, x = 2 + k * (bw + 10) + i * cw;
      s += '<rect x="' + x.toFixed(1) + '" y="2" width="' + cw.toFixed(1) + '" height="38" style="fill:' + (idx < n ? col : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
    }
    if (o.lab) s += '<text x="' + (wholes * (bw + 10)) + '" y="28" font-size="19" font-weight="700">' + o.lab + '</text>';
    return A.svg(Math.ceil(wholes * (bw + 10) + (o.lab ? 70 : 0)), 44, s, o.alt || n + ' of ' + d + ' equal parts shaded');
  }
  /* several fraction bars stacked to the same length, labelled on the left */
  function stack(list, alt) {
    var W = 400, s = '', y = 4;
    list.forEach(function (f, r) {
      var cw = W / f[1];
      s += '<text x="0" y="' + (y + 27) + '" font-size="19" font-weight="700">' + f[0] + '/' + f[1] + '</text>';
      for (var i = 0; i < f[1]; i++) s += '<rect x="' + (64 + i * cw).toFixed(1) + '" y="' + y + '" width="' + cw.toFixed(1) + '" height="36" style="fill:' + (i < f[0] ? (f[2] || COL[r % 4]) : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
      y += 46;
    });
    var end = list[0][0] / list[0][1];
    if (list.every(function (f) { return Math.abs(f[0] / f[1] - end) < 1e-9; }))
      s += '<line x1="' + (64 + W * end) + '" y1="0" x2="' + (64 + W * end) + '" y2="' + y + '" style="stroke:var(--se)" stroke-width="3" stroke-dasharray="6 4"/>';
    return A.svg(W + 70, y, s, alt || list.map(function (f) { return f[0] + '/' + f[1]; }).join(', '));
  }
  /* a number line from a to b with ticks every 1/d, labels as fractions, and marked points [{v, lab, col}] */
  function fline(a, b, d, marks, alt, every) {
    var W = 540, x0 = 26, x1 = W - 26, n = Math.round((b - a) * d), s = '', sc = function (v) { return x0 + (x1 - x0) * (v - a) / (b - a); };
    every = every || 1;
    s += '<line x1="' + x0 + '" y1="54" x2="' + x1 + '" y2="54" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= n; i++) {
      var v = a + i / d, x = sc(v), whole = Math.abs(v - Math.round(v)) < 1e-9;
      s += '<line x1="' + x + '" y1="' + (whole ? 42 : 46) + '" x2="' + x + '" y2="' + (whole ? 66 : 62) + '" style="stroke:var(--ink)" stroke-width="' + (whole ? 2.5 : 1.5) + '"/>';
      if (whole) s += '<text x="' + x + '" y="88" text-anchor="middle" font-size="19" font-weight="700">' + Math.round(v) + '</text>';
      else if (i % every === 0 && (x1 - x0) / n >= 36) s += '<text x="' + x + '" y="86" text-anchor="middle" font-size="17" class="t2">' + Math.round((v - Math.floor(v)) * d + Math.floor(v) * d) + '/' + d + '</text>';
    }
    var close = marks && marks.length > 1 && Math.abs(sc(marks[0].v) - sc(marks[1].v)) < 56;
    (marks || []).forEach(function (m, k) {
      var x = sc(m.v), lx = Math.min(Math.max(x, 30), W - 30);
      if (close) lx += (k ? 1 : -1) * 26 * (sc(marks[1].v) >= sc(marks[0].v) ? 1 : -1);
      s += '<circle cx="' + x + '" cy="54" r="8" style="fill:' + (m.col || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      if (m.lab) s += '<text x="' + lx + '" y="28" text-anchor="middle" font-size="18" font-weight="700" style="fill:' + (m.col || 'var(--ink)') + '">' + m.lab + '</text>';
    });
    return A.svg(W, 96, s, alt || 'Number line from ' + a + ' to ' + b);
  }
  function simp(n, d) { var g = gcd(n, d); return [n / g, d / g]; }
  function plain(n, d) { return frs(n, d, true); }
  function txt(n, d) { return n + '/' + d; }

  /* addition picture: both fractions cut into the common denominator, then joined */
  function addPic(a, b, c, d, minus) {
    var L = lcm(b, d), A1 = a * L / b, C1 = c * L / d, res = minus ? A1 - C1 : A1 + C1;
    var rows = [[a, b, 'var(--sb)'], [A1, L, 'var(--sb)'], [c, d, 'var(--se)'], [C1, L, 'var(--se)']];
    var W = Math.max(1, Math.ceil(Math.max(a / b, c / d, res / L))) > 1 ? 240 : 360, s = '', y = 4;
    var labs = [a + '/' + b, '= ' + A1 + '/' + L, c + '/' + d, '= ' + C1 + '/' + L];
    rows.forEach(function (r, k) {
      var wholes = Math.max(1, Math.ceil(r[0] / r[1])), cw = W / r[1];
      s += '<text x="0" y="' + (y + 24) + '" font-size="18" font-weight="700">' + labs[k] + '</text>';
      for (var w = 0; w < wholes; w++) for (var i = 0; i < r[1]; i++) {
        var idx = w * r[1] + i;
        s += '<rect x="' + (80 + w * (W + 10) + i * cw).toFixed(1) + '" y="' + y + '" width="' + cw.toFixed(1) + '" height="32" style="fill:' + (idx < r[0] ? r[2] : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.2"' + (k % 2 === 0 ? ' opacity=".55"' : '') + '/>';
      }
      y += k % 2 ? 50 : 40;
    });
    var wh = Math.max(1, Math.ceil(res / L)), cw2 = W / L;
    s += '<text x="0" y="' + (y + 24) + '" font-size="18" font-weight="700">' + (minus ? 'Left' : 'Total') + '</text>';
    for (var w2 = 0; w2 < wh; w2++) for (var j = 0; j < L; j++) {
      var id2 = w2 * L + j, colr = minus ? 'var(--sb)' : (id2 < A1 ? 'var(--sb)' : 'var(--se)');
      s += '<rect x="' + (80 + w2 * (W + 10) + j * cw2).toFixed(1) + '" y="' + y + '" width="' + cw2.toFixed(1) + '" height="34" style="fill:' + (id2 < res ? colr : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.2"/>';
    }
    y += 40;
    var maxW = 80 + Math.max(Math.ceil(Math.max(a / b, c / d, res / L, 1)), 1) * (W + 10);
    return A.svg(Math.ceil(maxW), y, s, a + '/' + b + (minus ? ' minus ' : ' plus ') + c + '/' + d + '. Both are cut into ' + L + 'ths: ' + A1 + '/' + L + (minus ? ' minus ' : ' plus ') + C1 + '/' + L + ' = ' + res + '/' + L + '.');
  }
  /* zoom in on the gap between two fractions */
  function zoom(a, b, c, d) {
    var L = lcm(b, d), k = 1;
    while (Math.abs(c * L / d - a * L / b) * k < 2) k++;
    var D = L * k, lo = a * D / b, hi = c * D / d, s = '', W = 540;
    s += fline(0, 1, D > 24 ? 1 : D, [{ v: a / b, lab: a + '/' + b, col: 'var(--sb)' }, { v: c / d, lab: c + '/' + d, col: 'var(--se)' }], '', D > 24 ? 1 : 1).replace(/^<svg[^>]*>|<\/svg>$/g, '');
    var x0 = 26 + 488 * a / b, x1 = 26 + 488 * c / d;
    s += '<path d="M' + x0 + ' 62 L60 128 M' + x1 + ' 62 L' + (W - 60) + ' 128" style="stroke:var(--ink2)" stroke-dasharray="4 4" fill="none"/>';
    var n = hi - lo, sc = function (i) { return 60 + (W - 120) * i / n; }, inner = '';
    inner += '<line x1="60" y1="150" x2="' + (W - 60) + '" y2="150" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= n; i++) {
      var end = i === 0 || i === n;
      inner += '<line x1="' + sc(i) + '" y1="140" x2="' + sc(i) + '" y2="160" style="stroke:var(--ink)" stroke-width="2"/>';
      inner += '<text x="' + sc(i) + '" y="184" text-anchor="middle" font-size="17" font-weight="700" style="fill:' + (end ? (i ? 'var(--se)' : 'var(--sb)') : 'var(--se)') + '">' + (lo + i) + '/' + D + '</text>';
      if (!end) inner += '<circle cx="' + sc(i) + '" cy="150" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    }
    s += inner;
    return { svg: A.svg(W, 196, s, 'Zoom in between ' + a + '/' + b + ' and ' + c + '/' + d + '. Written as ' + lo + '/' + D + ' and ' + hi + '/' + D + ', the fractions in between are ' + Array.apply(null, Array(n - 1)).map(function (_, i) { return (lo + i + 1) + '/' + D; }).join(', ') + '.'), lo: lo, hi: hi, D: D };
  }

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    eqno: { title: 'cut the pieces smaller', html: 
      '<div class="ctrl"><label for="eqn">Top (numerator): <output id="eqno"></output><input type="range" id="eqn" min="1" max="9" value="3"></label>' +
      '<label for="eqd">Bottom (denominator): <output id="eqdo"></output><input type="range" id="eqd" min="2" max="10" value="4"></label>' +
      '<label for="eqk">Cut each piece into: <output id="eqko"></output><input type="range" id="eqk" min="1" max="5" value="2"></label></div>' +
      '<div class="fig" id="eqfig"></div><div class="out" id="eqout"></div>',
      init: function (root) {
        var $ = A.$;
        function num(id, lo, hi, def) { var v = parseInt($('#' + id, root).value, 10); if (isNaN(v)) v = def; return Math.max(lo, Math.min(hi, v)); }
        A.bind(root, ['eqn', 'eqd', 'eqk'], function () {
          var d = +$('#eqd', root).value, n = Math.min(+$('#eqn', root).value, d), k = +$('#eqk', root).value;
          $('#eqno', root).textContent = n; $('#eqdo', root).textContent = d; $('#eqko', root).textContent = k;
          $('#eqfig', root).innerHTML = stack([[n, d, 'var(--sb)'], [n * k, d * k, 'var(--se)']]);
          $('#eqout', root).innerHTML = '<p class="big2">' + fr(n, d) + ' = ' + fr(n + ' &times; ' + k, d + ' &times; ' + k) + ' = ' + fr(n * k, d * k) + '</p><p>Each piece was cut into ' + k + '. There are ' + k + ' times as many pieces, each ' + k + ' times smaller, so the amount is the same.</p>';
        });
      } },
    smn: { title: 'simplify any fraction', html: 
      '<div class="ctrl"><label for="smn">Top<input type="number" id="smn" min="1" max="144" value="24"></label><label for="smd">Bottom<input type="number" id="smd" min="2" max="144" value="36"></label></div>' +
      '<div class="out" id="smout"></div><div class="fig" id="smfig"></div>',
      init: function (root) {
        var $ = A.$;
        function num(id, lo, hi, def) { var v = parseInt($('#' + id, root).value, 10); if (isNaN(v)) v = def; return Math.max(lo, Math.min(hi, v)); }
        A.bind(root, ['smn', 'smd'], function () {
          var n = num('smn', 1, 144, 1), d = num('smd', 2, 144, 2), g = gcd(n, d);
          $('#smout', root).innerHTML = '<p>GCF of ' + n + ' and ' + d + ' is <b>' + g + '</b>.</p><p class="big2">' + fr(n, d) + ' = ' + fr(n + ' &divide; ' + g, d + ' &divide; ' + g) + ' = ' + fr(n / g, d / g) + '</p>' +
            (g === 1 ? '<p>The GCF is 1, so ' + n + '/' + d + ' is already in simplest form.</p>' : '') + (n > d ? '<p>As a mixed number: ' + frs(n, d) + '.</p>' : '');
          $('#smfig', root).innerHTML = d <= 48 && n <= 2 * d ? stack([[n, d, 'var(--sb)'], [n / g, d / g, 'var(--se)']]) : '<p class="t2">(Pictures are drawn for bottoms up to 48.)</p>';
        });
      } },
    cpa: { title: 'compare two fractions', html: 
      '<div class="ctrl"><label for="cpa">First: top<input type="number" id="cpa" min="0" max="20" value="5"></label><label for="cpb">bottom<input type="number" id="cpb" min="1" max="12" value="6"></label>' +
      '<label for="cpc">Second: top<input type="number" id="cpc" min="0" max="20" value="7"></label><label for="cpd">bottom<input type="number" id="cpd" min="1" max="12" value="9"></label></div>' +
      '<div class="fig" id="cpfig"></div><div class="out" id="cpout"></div>',
      init: function (root) {
        var $ = A.$;
        function num(id, lo, hi, def) { var v = parseInt($('#' + id, root).value, 10); if (isNaN(v)) v = def; return Math.max(lo, Math.min(hi, v)); }
        A.bind(root, ['cpa', 'cpb', 'cpc', 'cpd'], function () {
          var a = num('cpa', 0, 20, 0), b = num('cpb', 1, 12, 1), c = num('cpc', 0, 20, 0), d = num('cpd', 1, 12, 1), L = lcm(b, d);
          var x = a * L / b, y = c * L / d, top = Math.max(1, Math.ceil(Math.max(a / b, c / d)));
          $('#cpfig', root).innerHTML = fline(0, top, L <= 24 / top ? L : 1, [{ v: a / b, lab: a + '/' + b, col: 'var(--sb)' }, { v: c / d, lab: c + '/' + d, col: 'var(--se)' }]);
          $('#cpout', root).innerHTML = '<p>Common denominator: ' + L + '. ' + fr(a, b) + ' = ' + fr(x, L) + ' and ' + fr(c, d) + ' = ' + fr(y, L) + '.</p><p class="big2">' + fr(a, b) + (x > y ? ' &gt; ' : x < y ? ' &lt; ' : ' = ') + fr(c, d) + '</p>' +
            (x === y ? '<p>They are equivalent.</p>' : '<p>The one further right on the line is greater.</p>');
        });
      } },
    zma: { title: 'zoom in on the gap', html: 
      '<div class="ctrl"><label for="zma">First fraction<select id="zma"><option value="1,4">1/4</option><option value="1,3" selected>1/3</option><option value="2,5">2/5</option><option value="1,2">1/2</option><option value="3,5">3/5</option></select></label>' +
      '<label for="zmb">Second fraction<select id="zmb"><option value="1,2" selected>1/2</option><option value="3,5">3/5</option><option value="2,3">2/3</option><option value="3,4">3/4</option><option value="4,5">4/5</option></select></label></div>' +
      '<div class="fig" id="zmfig"></div><div class="out" id="zmout"></div>',
      init: function (root) {
        var $ = A.$;
        function num(id, lo, hi, def) { var v = parseInt($('#' + id, root).value, 10); if (isNaN(v)) v = def; return Math.max(lo, Math.min(hi, v)); }
        A.bind(root, ['zma', 'zmb'], function () {
          var p = $('#zma', root).value.split(',').map(Number), q = $('#zmb', root).value.split(',').map(Number);
          if (p[0] / p[1] > q[0] / q[1]) { var t = p; p = q; q = t; }
          if (p[0] / p[1] === q[0] / q[1]) { $('#zmfig', root).innerHTML = ''; $('#zmout', root).innerHTML = '<p>Pick two different fractions.</p>'; return; }
          var z = zoom(p[0], p[1], q[0], q[1]);
          $('#zmfig', root).innerHTML = z.svg;
          var mids = []; for (var i = z.lo + 1; i < z.hi; i++) mids.push(frs(i, z.D));
          $('#zmout', root).innerHTML = '<p>In ' + z.D + 'ths: ' + fr(p[0], p[1]) + ' = ' + fr(z.lo, z.D) + ' and ' + fr(q[0], q[1]) + ' = ' + fr(z.hi, z.D) + '.</p><p>In between: ' + mids.join(', ') + '</p>';
        });
      } },
    ada: { title: 'add two fractions', html: 
      '<div class="ctrl"><label for="ada">Top<input type="number" id="ada" min="0" max="12" value="2"></label><label for="adb">Bottom<input type="number" id="adb" min="2" max="12" value="3"></label><span class="big2">+</span>' +
      '<label for="adc">Top<input type="number" id="adc" min="0" max="12" value="3"></label><label for="add">Bottom<input type="number" id="add" min="2" max="12" value="4"></label></div>' +
      '<div class="out" id="adout"></div><div class="fig" id="adfig"></div>',
      init: function (root) {
        var $ = A.$;
        function num(id, lo, hi, def) { var v = parseInt($('#' + id, root).value, 10); if (isNaN(v)) v = def; return Math.max(lo, Math.min(hi, v)); }
        A.bind(root, ['ada', 'adb', 'adc', 'add'], function () {
          var a = num('ada', 0, 12, 0), b = num('adb', 2, 12, 2), c = num('adc', 0, 12, 0), d = num('add', 2, 12, 2), L = lcm(b, d), s = a * L / b + c * L / d;
          $('#adout', root).innerHTML = '<p class="big2">' + fr(a, b) + ' + ' + fr(c, d) + ' = ' + fr(a * L / b, L) + ' + ' + fr(c * L / d, L) + ' = ' + fr(s, L) + (frs(s, L) !== fr(s, L) ? ' = ' + frs(s, L) : '') + '</p>';
          $('#adfig', root).innerHTML = L <= 60 && s / L <= 3 ? addPic(a, b, c, d) : '<p class="t2">(The picture is shown for answers up to 3.)</p>';
        });
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  function fq(q, n, d, hint, explain) { return { q: q + ' Type a fraction, like 2/5.', type: 'num', answer: n / d, show: frs(n, d, true), kb: 'text', tol: 1e-6, hint: hint, explain: explain }; }
  function rows(s) { return s.map(function (r) { return r.n; }); }
  function sum(s) { return s.reduce(function (t, r) { return t + r.n; }, 0); }
  /* a decimal number line from lo to hi in steps, with marked points */
  function dline(lo, hi, step, marks) {
    var W = 540, x0 = 30, x1 = W - 30, n = Math.round((hi - lo) / step), s = '', sc = function (v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); };
    var dp = String(step).split('.')[1] ? String(step).split('.')[1].length : 0;
    s += '<line x1="' + x0 + '" y1="54" x2="' + x1 + '" y2="54" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= n; i++) {
      var v = lo + i * step, x = sc(v), end = i === 0 || i === n;
      s += '<line x1="' + x + '" y1="' + (end ? 42 : 46) + '" x2="' + x + '" y2="' + (end ? 66 : 62) + '" style="stroke:var(--ink)" stroke-width="' + (end ? 2.5 : 1.5) + '"/>';
      if (end || (n <= 10 && i % 5 === 0)) s += '<text x="' + x + '" y="88" text-anchor="middle" font-size="18" font-weight="700">' + String(+v.toFixed(dp)) + '</text>';
    }
    (marks || []).forEach(function (m) {
      s += '<circle cx="' + sc(m.v) + '" cy="54" r="8" style="fill:' + (m.col || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      if (m.lab) s += '<text x="' + Math.min(Math.max(sc(m.v), 30), W - 30) + '" y="28" text-anchor="middle" font-size="18" font-weight="700">' + m.lab + '</text>';
    });
    return A.svg(W, 96, s, 'Number line from ' + lo + ' to ' + hi);
  }

  var LESSONS = [
    { id: 'equiv', title: 'Equivalent fractions', sub: 'Different names for the same amount.', concepts: [
      { id: 'same', title: 'Same amount, different names', exp: ['B1.4'], skill: 'fr-equiv',
        body: '<p><b>Equivalent fractions</b> name the same amount. ' + fr(2, 3) + ', ' + fr(4, 6) + ' and ' + fr(8, 12) + ' all cover the same length of a bar.</p>',
        watch: K.slides([
          { say: 'Here is a bar cut into 3 equal parts. 2 are shaded: two thirds.', fig: function () { return stack([[2, 3, 'var(--sb)']]); } },
          { say: 'Cut every third in half. Now there are 6 parts, and 4 are shaded.', fig: function () { return stack([[2, 3, 'var(--sb)'], [4, 6, 'var(--se)']]); } },
          { say: 'Cut again. 12 parts, 8 shaded.', fig: function () { return stack([[2, 3, 'var(--sb)'], [4, 6, 'var(--se)'], [8, 12, 'var(--sd)']]); } },
          { say: 'The dashed line shows the shaded length never changed. ' + fr(2, 3) + ' = ' + fr(4, 6) + ' = ' + fr(8, 12) + '.', fig: function () { return stack([[2, 3, 'var(--sb)'], [4, 6, 'var(--se)'], [8, 12, 'var(--sd)']]); }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. Here is a bar cut into 4 equal parts. 3 are shaded: three quarters.', fig: function () { return stack([[3, 4, 'var(--sb)']]); } },
          { say: 'I cut every quarter in half. Now there are 8 parts, and 6 are shaded.', fig: function () { return stack([[3, 4, 'var(--sb)'], [6, 8, 'var(--se)']]); } },
          { say: 'Next I cut every quarter into 3 instead. Now there are 12 parts, and 9 are shaded.', fig: function () { return stack([[3, 4, 'var(--sb)'], [6, 8, 'var(--se)'], [9, 12, 'var(--sd)']]); } },
          { say: 'The shaded length never changed. ' + fr(3, 4) + ' = ' + fr(6, 8) + ' = ' + fr(9, 12) + '. They cover the same amount.', fig: function () { return stack([[3, 4, 'var(--sb)'], [6, 8, 'var(--se)'], [9, 12, 'var(--sd)']]); }, ms: 2600 }
        ]),
        try: { tool: 'fractions', opts: { wall: [3, 6, 12] }, tasks: [
          { do: 'Shade <b>2/3</b> in the top strip.', goal: function (s) { return s[0].n === 2; }, yes: 'Two thirds shaded.' },
          { reset: false, do: 'Now shade the <b>same length</b> in the sixths strip.', goal: function (s) { return s[0].n === 2 && s[1].n === 4; }, yes: '4/6 covers the same length as 2/3.' },
          { reset: false, do: 'And in the twelfths strip.', goal: function (s) { return s[0].n === 2 && s[1].n === 4 && s[2].n === 8; }, yes: '2/3 = 4/6 = 8/12.' }
        ] },
        key: '<p>Equivalent fractions <b>cover the same amount</b>. The pieces are smaller, but there are more of them.</p>',
        mistake: '<p>Thinking 8/12 is bigger than 2/3 because the numbers are bigger. Put the bars side by side and compare lengths.</p>',
        check: [function () { return mc('Which fraction is equivalent to ' + fr(3, 4) + '?', fr(6, 8), [fr(3, 8), fr(4, 5), fr(6, 4)], 'Cut each quarter into 2 pieces.', fr(3, 4) + ' = ' + fr(6, 8) + '. Each quarter became 2 eighths.', stack([[3, 4, 'var(--sb)'], [6, 8, 'var(--se)']])); }, K.ck('fr-equiv', 1)] },
      { id: 'rule', title: 'Multiply the top and the bottom', exp: ['B1.4'], skill: 'fr-equiv',
        body: '<p>To make an equivalent fraction, <b>multiply the top and the bottom by the same number</b>.</p>',
        watch: K.slides([
          { say: 'Start with three fifths.', fig: function () { return stack([[3, 5, 'var(--sb)']]) + eq(fr(3, 5)); } },
          { say: 'Cut each fifth into 4. The bottom is multiplied by 4.', fig: function () { return stack([[3, 5, 'var(--sb)'], [12, 20, 'var(--se)']]) + eq(fr(3, 5) + ' = ' + fr('?', '5 &times; 4')); } },
          { say: 'Each shaded piece became 4 pieces too, so the top is multiplied by 4.', fig: function () { return stack([[3, 5, 'var(--sb)'], [12, 20, 'var(--se)']]) + eq(fr(3, 5) + ' = ' + fr('3 &times; 4', '5 &times; 4')); } },
          { say: 'Three fifths equals twelve twentieths.', fig: function () { return stack([[3, 5, 'var(--sb)'], [12, 20, 'var(--se)']]) + eq(fr(3, 5) + ' = ' + fr(12, 20)); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find a fraction equal to ' + fr(2, 7) + ' with 21 on the bottom.', fig: function () { return stack([[2, 7, 'var(--sb)']]) + eq(fr(2, 7) + ' = ' + fr('?', 21)); } },
          { say: '7 &times; 3 = 21. So I cut each seventh into 3. The bottom is multiplied by 3.', fig: function () { return stack([[2, 7, 'var(--sb)'], [6, 21, 'var(--se)']]) + eq(fr(2, 7) + ' = ' + fr('?', '7 &times; 3')); } },
          { say: 'Each shaded piece became 3 pieces, so I multiply the top by 3 too.', fig: function () { return stack([[2, 7, 'var(--sb)'], [6, 21, 'var(--se)']]) + eq(fr(2, 7) + ' = ' + fr('2 &times; 3', '7 &times; 3')); } },
          { say: 'So ' + fr(2, 7) + ' = ' + fr(6, 21) + '. Whatever I do to the bottom, I do to the top.', fig: function () { return stack([[2, 7, 'var(--sb)'], [6, 21, 'var(--se)']]) + eq(fr(2, 7) + ' = ' + fr(6, 21)); }, ms: 2400 }
        ]),
        try: lab('eqno', [
          { do: 'Show <b>3/4</b> cut so that there are <b>12</b> parts.', goal: function (h) { return K.v(h, 'eqn') === 3 && K.v(h, 'eqd') === 4 && K.v(h, 'eqk') === 3; }, yes: '3/4 = 9/12. Both parts were multiplied by 3.' },
          { do: 'Make a fraction equal to <b>2/5</b> with a bottom of <b>10</b>.', goal: function (h) { return K.v(h, 'eqn') === 2 && K.v(h, 'eqd') === 5 && K.v(h, 'eqk') === 2; }, yes: '2/5 = 4/10.' },
          { do: 'Make <b>15</b> pieces in the bottom bar, from any fraction.', goal: function (h) { return K.v(h, 'eqd') * K.v(h, 'eqk') === 15; }, yes: function (h) { return 'Yes. ' + K.v(h, 'eqd') + ' &times; ' + K.v(h, 'eqk') + ' = 15.'; } }
        ]),
        key: '<p><b>Whatever you do to the bottom, do to the top.</b> Multiply both by the same number.</p>',
        mistake: '<p>Adding the same number to top and bottom: 3/5 is not 4/6. Only multiplying or dividing keeps the amount the same. Draw both bars to show it.</p>',
        check: [function () { return { q: 'Fill in the missing number: ' + fr(3, 5) + ' = ' + fr('?', 20), type: 'num', answer: 12, hint: '5 times what is 20? Do the same to the top.', explain: '5 &times; 4 = 20, so 3 &times; 4 = 12.' }; }, K.ck('fr-equiv', 1), K.ck('fr-equiv', 2)] }
    ] },
    { id: 'simplify', title: 'Simplifying', sub: 'Write a fraction with the smallest numbers.', concepts: [
      { id: 'gcf', title: 'Divide by the GCF', exp: ['B1.4'], skill: 'fr-simplify', hard: true,
        body: '<p>To <b>simplify</b>, divide the top and the bottom by a common factor. Divide by the <b>greatest common factor (GCF)</b> and you reach <b>simplest form</b> in one step.</p>',
        watch: K.slides([
          { say: 'Simplify 18 twenty-fourths.', fig: function () { return stack([[18, 24, 'var(--sb)']]) + eq(fr(18, 24)); } },
          { say: 'Find the GCF. Factors of 18 and 24 in common: 1, 2, 3 and 6. The greatest is 6.', fig: eq('GCF of 18 and 24 = <b>6</b>') },
          { say: 'Divide the top and the bottom by 6.', fig: function () { return eq(fr(18, 24) + ' = ' + fr('18 &divide; 6', '24 &divide; 6')); } },
          { say: 'Every 6 small pieces join into 1 big piece. 18 twenty-fourths is <b>three quarters</b>.', fig: function () { return stack([[18, 24, 'var(--sb)'], [3, 4, 'var(--se)']]) + eq(fr(18, 24) + ' = ' + fr(3, 4)); }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will simplify ' + fr(20, 32) + '.', fig: function () { return stack([[20, 32, 'var(--sb)']]) + eq(fr(20, 32)); } },
          { say: 'First I find the GCF. 20 and 32 both divide by 1, 2 and 4. The greatest is 4.', fig: eq('GCF of 20 and 32 = <b>4</b>') },
          { say: 'I divide the top and the bottom by 4.', fig: eq(fr(20, 32) + ' = ' + fr('20 &divide; 4', '32 &divide; 4')) },
          { say: 'Every 4 small pieces join into 1 bigger piece. So ' + fr(20, 32) + ' = <b>' + fr(5, 8) + '</b>, in simplest form.', fig: function () { return stack([[20, 32, 'var(--sb)'], [5, 8, 'var(--se)']]) + eq(fr(20, 32) + ' = ' + fr(5, 8)); }, ms: 2600 }
        ]),
        try: lab('smn', [
          { do: 'Type <b>18</b> on top and <b>24</b> on the bottom.', goal: function (h) { return +K.v(h, 'smn') === 18 && +K.v(h, 'smd') === 24; }, yes: 'GCF 6, so 18/24 = 3/4.' },
          { do: 'Find a fraction that simplifies to <b>2/3</b>.', goal: function (h) { var n = +K.v(h, 'smn'), d = +K.v(h, 'smd'); return n > 2 && n * 3 === d * 2; }, yes: function (h) { return 'Yes. ' + K.v(h, 'smn') + '/' + K.v(h, 'smd') + ' = 2/3.'; } },
          { do: 'Find a fraction that is <b>already</b> in simplest form (GCF 1).', goal: function (h) { var n = +K.v(h, 'smn'), d = +K.v(h, 'smd'); return n > 0 && d > 1 && gcd(n, d) === 1; }, yes: 'When the GCF is 1, the fraction cannot be simplified.' }
        ]),
        ways: [
          { label: 'Divide in small steps', html: '<p>You do not have to find the GCF first. Divide by any common factor, then keep going until nothing more works.</p>' + eq(fr(18, 24) + ' &rarr; &divide;2 &rarr; ' + fr(9, 12) + ' &rarr; &divide;3 &rarr; ' + fr(3, 4)) + '<p>Using the GCF just gets there in one step.</p>' },
          { label: 'Group the pieces', html: '<p>Simplifying is the opposite of cutting pieces smaller. It glues small pieces into bigger ones.</p><div class="fig">' + stack([[6, 8, 'var(--sb)'], [3, 4, 'var(--se)']]) + '</div><p>Glue every 2 eighths into 1 quarter: 6 eighths become 3 quarters.</p>' },
          { label: 'Prime factors', html: '<p>Write the top and bottom as prime factors and cross out the shared ones.</p>' + eq(fr('2 &times; 3 &times; 3', '2 &times; 2 &times; 2 &times; 3') + ' = ' + fr(3, 4)) + '<p>One 2 and one 3 are shared (2 &times; 3 = 6, the GCF).</p>' }
        ],
        key: '<p><b>Divide the top and the bottom by the GCF.</b> The answer is in simplest form.</p>',
        mistake: '<p>Dividing only the top (18/24 becomes 3/24), or subtracting the same number from both. Remind: same operation to both parts, only multiply or divide.</p>',
        check: [function () { var o = fq('Simplify ' + fr(20, 30) + '.', 2, 3, 'The GCF of 20 and 30 is 10.', '20 &divide; 10 = 2 and 30 &divide; 10 = 3.'); o.accept = A.lowest(2, 3); return o; }, K.ck('fr-simplify', 1), K.ck('fr-simplify', 2)] },
      { id: 'simplest', title: 'Is it in simplest form?', exp: ['B1.4'], skill: 'fr-simplify',
        body: '<p>A fraction is in <b>simplest form</b> when the only number that divides both the top and the bottom is 1.</p>',
        watch: K.slides([
          { say: 'Is 9 fifteenths in simplest form? 3 divides 9 and 15, so no.', fig: eq(fr(9, 15) + ' &rarr; both divide by 3 &rarr; ' + fr(3, 5)) },
          { say: 'Is 3 fifths in simplest form? Only 1 divides 3 and 5. Yes.', fig: eq(fr(3, 5) + ': GCF = 1 &#10003;') },
          { say: '8 ninths: 8 is 2 &times; 2 &times; 2 and 9 is 3 &times; 3. Nothing shared, so it is already simplest.', fig: eq(fr(8, 9) + ': GCF = 1 &#10003;'), ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. Is ' + fr(14, 21) + ' in simplest form? 7 divides 14 and 21. So no: it simplifies to ' + fr(2, 3) + '.', fig: eq(fr(14, 21) + ' &rarr; both divide by 7 &rarr; ' + fr(2, 3)) },
          { say: 'Is ' + fr(4, 9) + ' in simplest form? 4 is 2 &times; 2 and 9 is 3 &times; 3. They share nothing, so the GCF is 1. Yes.', fig: eq(fr(4, 9) + ': GCF = 1 &#10003;') },
          { say: 'Is ' + fr(10, 25) + '? 5 divides both, so no: it is ' + fr(2, 5) + '. GCF = 1 means simplest form.', fig: eq(fr(10, 25) + ' &rarr; both divide by 5 &rarr; ' + fr(2, 5)), ms: 2600 }
        ]),
        key: '<p><b>GCF = 1 means simplest form.</b> If any number bigger than 1 divides both, keep simplifying.</p>',
        mistake: '<p>Thinking a fraction with big numbers cannot be simple (8/9 is simplest) or one with small numbers always is (2/4 is not).</p>',
        check: [function () {
          var list = [[2, 4], [3, 9], [6, 8], [5, 10], [4, 6], [10, 15]], good = R.pick([[3, 8], [5, 9], [4, 7], [7, 10], [8, 15]]), w = R.shuffle(list).slice(0, 3);
          return mc('Which fraction is in simplest form?', fr(good[0], good[1]), w.map(function (f) { return fr(f[0], f[1]); }), 'Look for a number bigger than 1 that divides both the top and bottom.', 'Only 1 divides both ' + good[0] + ' and ' + good[1] + '.');
        }, K.ck('fr-simplify', 2)] }
    ] },
    { id: 'compare', title: 'Comparing and ordering', sub: 'Which fraction is greater?', concepts: [
      { id: 'samepart', title: 'Same bottom or same top', exp: ['B1.3', 'B1.4'], skill: 'fr-compare',
        body: '<div class="vs"><div><b class="t">Same bottom</b><p>' + fr(5, 8) + ' &gt; ' + fr(3, 8) + '</p><p>Same size pieces: more pieces wins.</p></div><div><b class="t">Same top</b><p>' + fr(3, 4) + ' &gt; ' + fr(3, 8) + '</p><p>Same number of pieces: bigger pieces win.</p></div></div>',
        watch: K.slides([
          { say: 'Five eighths and three eighths. The pieces are the same size.', fig: function () { return stack([[5, 8, 'var(--sb)'], [3, 8, 'var(--se)']]); } },
          { say: 'So 5 pieces is more than 3 pieces: ' + fr(5, 8) + ' &gt; ' + fr(3, 8) + '.', fig: function () { return stack([[5, 8, 'var(--sb)'], [3, 8, 'var(--se)']]) + eq(fr(5, 8) + ' &gt; ' + fr(3, 8)); } },
          { say: 'Now three quarters and three eighths. Both have 3 pieces.', fig: function () { return stack([[3, 4, 'var(--sb)'], [3, 8, 'var(--se)']]); } },
          { say: 'Quarters are bigger pieces than eighths, so ' + fr(3, 4) + ' &gt; ' + fr(3, 8) + '.', fig: function () { return stack([[3, 4, 'var(--sb)'], [3, 8, 'var(--se)']]) + eq(fr(3, 4) + ' &gt; ' + fr(3, 8)); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. Which is greater, ' + fr(4, 7) + ' or ' + fr(6, 7) + '? The bottoms are the same, so the pieces are the same size.', fig: function () { return stack([[4, 7, 'var(--sb)'], [6, 7, 'var(--se)']]); } },
          { say: '6 pieces is more than 4 pieces. So ' + fr(6, 7) + ' &gt; ' + fr(4, 7) + '.', fig: function () { return stack([[4, 7, 'var(--sb)'], [6, 7, 'var(--se)']]) + eq(fr(6, 7) + ' &gt; ' + fr(4, 7)); } },
          { say: 'Next, ' + fr(2, 3) + ' and ' + fr(2, 9) + '. The tops are the same: 2 pieces each.', fig: function () { return stack([[2, 3, 'var(--sb)'], [2, 9, 'var(--se)']]); } },
          { say: 'Thirds are bigger pieces than ninths. So ' + fr(2, 3) + ' &gt; ' + fr(2, 9) + '. Same top: the smaller bottom wins.', fig: function () { return stack([[2, 3, 'var(--sb)'], [2, 9, 'var(--se)']]) + eq(fr(2, 3) + ' &gt; ' + fr(2, 9)); }, ms: 2400 }
        ]),
        try: { tool: 'fractions', opts: { wall: [4, 8] }, tasks: [
          { do: 'Shade <b>3/4</b> and <b>3/8</b>. Which is longer?', goal: function (s) { return s[0].n === 3 && s[1].n === 3; }, yes: '3/4 is longer: quarters are bigger pieces.' },
          { reset: false, do: 'Change the eighths strip so it matches 3/4 exactly.', goal: function (s) { return s[0].n === 3 && s[1].n === 6; }, yes: '6/8 = 3/4.' }
        ] },
        key: '<p><b>Same bottom: bigger top wins. Same top: smaller bottom wins</b> (the pieces are bigger).</p>',
        mistake: '<p>Choosing 3/8 over 3/4 because 8 is bigger than 4. A bigger bottom means smaller pieces.</p>',
        check: [K.ck('fr-compare', 1), K.ck('fr-compare', 1)] },
      { id: 'common', title: 'Use a common denominator', exp: ['B1.3', 'B1.4'], skill: 'fr-compare', hard: true,
        body: '<p>When both the tops and the bottoms are different, rewrite both fractions with a <b>common denominator</b>. The LCM of the bottoms works well.</p>',
        watch: K.slides([
          { say: 'Which is greater, two thirds or three fifths?', fig: function () { return stack([[2, 3, 'var(--sb)'], [3, 5, 'var(--se)']]); } },
          { say: 'The LCM of 3 and 5 is 15. Cut both bars into fifteenths.', fig: function () { return stack([[10, 15, 'var(--sb)'], [9, 15, 'var(--se)']]); } },
          { say: 'Two thirds is ten fifteenths. Three fifths is nine fifteenths.', fig: function () { return eq(fr(2, 3) + ' = ' + fr(10, 15) + ' &nbsp; ' + fr(3, 5) + ' = ' + fr(9, 15)); } },
          { say: '10 is more than 9, so <b>two thirds is greater</b>.', fig: function () { return stack([[10, 15, 'var(--sb)'], [9, 15, 'var(--se)']]) + eq(fr(2, 3) + ' &gt; ' + fr(3, 5)); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. Which is greater, ' + fr(3, 4) + ' or ' + fr(5, 6) + '?', fig: function () { return stack([[3, 4, 'var(--sb)'], [5, 6, 'var(--se)']]); } },
          { say: 'First I find a common denominator. The LCM of 4 and 6 is 12, so I cut both bars into twelfths.', fig: function () { return stack([[9, 12, 'var(--sb)'], [10, 12, 'var(--se)']]); } },
          { say: fr(3, 4) + ' is ' + fr(9, 12) + '. ' + fr(5, 6) + ' is ' + fr(10, 12) + '.', fig: eq(fr(3, 4) + ' = ' + fr(9, 12) + ' &nbsp; ' + fr(5, 6) + ' = ' + fr(10, 12)) },
          { say: 'Now I compare the tops. 10 is more than 9, so <b>' + fr(5, 6) + ' is greater</b>.', fig: function () { return stack([[9, 12, 'var(--sb)'], [10, 12, 'var(--se)']]) + eq(fr(5, 6) + ' &gt; ' + fr(3, 4)); }, ms: 2400 }
        ]),
        try: lab('cpa', [
          { do: 'Compare <b>2/3</b> and <b>3/5</b>.', goal: function (h) { return +K.v(h, 'cpa') === 2 && +K.v(h, 'cpb') === 3 && +K.v(h, 'cpc') === 3 && +K.v(h, 'cpd') === 5; }, yes: 'In fifteenths: 10/15 &gt; 9/15.' },
          { do: 'Find two <b>different-looking</b> fractions that are equal.', goal: function (h) { var a = +K.v(h, 'cpa'), b = +K.v(h, 'cpb'), c = +K.v(h, 'cpc'), d = +K.v(h, 'cpd'); return b > 0 && d > 0 && b !== d && a * d === b * c && a > 0; }, yes: 'Equal fractions land on the same point.' }
        ]),
        ways: [
          { label: 'On a number line', html: '<p>Put both on a number line. The one further right is greater.</p><div class="fig">' + fline(0, 1, 15, [{ v: 3 / 5, lab: '3/5', col: 'var(--se)' }, { v: 2 / 3, lab: '2/3', col: 'var(--sb)' }], '3/5 and 2/3 on a number line', 5) + '</div>' },
          { label: 'Change to decimals', html: '<p>Divide top by bottom. ' + fr(2, 3) + ' = 2 &divide; 3 &asymp; 0.67 and ' + fr(3, 5) + ' = 3 &divide; 5 = 0.6. 0.67 &gt; 0.6.</p>' },
          { label: 'How far from 1?', html: '<p>' + fr(2, 3) + ' is ' + fr(1, 3) + ' away from 1. ' + fr(3, 5) + ' is ' + fr(2, 5) + ' away. ' + fr(1, 3) + ' is less than ' + fr(2, 5) + ', so ' + fr(2, 3) + ' is closer to 1 and greater.</p>' }
        ],
        key: '<p><b>Rewrite with a common denominator, then compare the tops.</b></p>',
        mistake: '<p>Comparing only the tops (3/5 &gt; 2/3 because 3 &gt; 2) or only the bottoms. Both parts matter until the bottoms match.</p>',
        check: [function () { return mc('Which is greater?', fr(3, 4), [fr(5, 8), 'They are equal'], 'Write ' + fr(3, 4) + ' in eighths.', fr(3, 4) + ' = ' + fr(6, 8) + ', more than ' + fr(5, 8) + '.'); }, K.ck('fr-compare', 2), K.ck('fr-compare', 2)] },
      { id: 'half', title: 'Check against one half', exp: ['B1.3'], skill: 'fr-compare',
        body: '<p>A quick check: is each fraction <b>more or less than ' + fr(1, 2) + '</b>? If the top is less than half the bottom, the fraction is less than a half.</p>',
        watch: K.slides([
          { say: 'Three sevenths: half of 7 is 3.5. 3 is less, so three sevenths is <b>less than a half</b>.', fig: function () { return fline(0, 1, 7, [{ v: 3 / 7, lab: '3/7', col: 'var(--sb)' }, { v: 0.5, lab: '1/2', col: 'var(--hi)' }]); } },
          { say: 'Five ninths: half of 9 is 4.5. 5 is more, so five ninths is <b>more than a half</b>.', fig: function () { return fline(0, 1, 9, [{ v: 0.5, lab: '1/2', col: 'var(--hi)' }, { v: 5 / 9, lab: '5/9', col: 'var(--se)' }]); } },
          { say: 'So three sevenths is less than five ninths. No common denominator needed.', fig: eq(fr(3, 7) + ' &lt; ' + fr(1, 2) + ' &lt; ' + fr(5, 9)), ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. Which is greater, ' + fr(4, 9) + ' or ' + fr(3, 5) + '? I check each one against one half.', fig: eq(fr(4, 9) + ' &nbsp; or &nbsp; ' + fr(3, 5)) },
          { say: fr(4, 9) + ': half of 9 is 4.5. 4 is less, so ' + fr(4, 9) + ' is <b>less than a half</b>.', fig: function () { return fline(0, 1, 9, [{ v: 4 / 9, lab: '4/9', col: 'var(--sb)' }, { v: 0.5, lab: '1/2', col: 'var(--hi)' }]); } },
          { say: fr(3, 5) + ': half of 5 is 2.5. 3 is more, so ' + fr(3, 5) + ' is <b>more than a half</b>.', fig: function () { return fline(0, 1, 5, [{ v: 0.5, lab: '1/2', col: 'var(--hi)' }, { v: 3 / 5, lab: '3/5', col: 'var(--se)' }]); } },
          { say: 'So ' + fr(4, 9) + ' &lt; ' + fr(1, 2) + ' &lt; ' + fr(3, 5) + '. ' + fr(3, 5) + ' is greater.', fig: eq(fr(4, 9) + ' &lt; ' + fr(1, 2) + ' &lt; ' + fr(3, 5)), ms: 2600 }
        ]),
        key: '<p><b>Compare the top with half the bottom.</b> Less: under ' + fr(1, 2) + '. More: over ' + fr(1, 2) + '.</p>',
        mistake: '<p>Using this check when both fractions are on the same side of 1/2. Then it does not decide; use a common denominator.</p>',
        check: [function () {
          var d1 = R.int(5, 12), n1 = R.int(1, Math.ceil(d1 / 2) - 1), d2 = R.int(5, 12), n2 = R.int(Math.floor(d2 / 2) + 1, d2 - 1), lo = fr(n1, d1), hi = fr(n2, d2);
          return mc('Which is greater: ' + lo + ' or ' + hi + '?', hi, [lo, 'They are equal'], 'Is each one more or less than a half?', lo + ' is less than a half and ' + hi + ' is more than a half.');
        }, function () {
          var d = R.int(5, 12), n = R.int(1, d - 1); if (2 * n === d) n = n + 1 < d ? n + 1 : n - 1;
          return mc('Is ' + fr(n, d) + ' more or less than ' + fr(1, 2) + '?', 2 * n > d ? 'More than a half' : 'Less than a half', [2 * n > d ? 'Less than a half' : 'More than a half', 'Exactly a half'], 'Half of ' + d + ' is ' + d / 2 + '.', 'Half of ' + d + ' is ' + d / 2 + ', and ' + n + ' is ' + (2 * n > d ? 'more' : 'less') + '.');
        }] },
      { id: 'order', title: 'Put fractions in order', exp: ['B1.3'], skill: 'fr-compare',
        body: '<p>To order three or more fractions, give them <b>all the same denominator</b>, then order the tops.</p>',
        watch: K.slides([
          { say: 'Order one half, three eighths and three quarters.', fig: eq(fr(1, 2) + ', ' + fr(3, 8) + ', ' + fr(3, 4)) },
          { say: 'All three can be written in eighths.', fig: eq(fr(4, 8) + ', ' + fr(3, 8) + ', ' + fr(6, 8)) },
          { say: 'Order the tops: 3, 4, 6.', fig: function () { return stack([[3, 8, 'var(--se)'], [4, 8, 'var(--sb)'], [6, 8, 'var(--sd)']]); } },
          { say: 'Least to greatest: three eighths, one half, three quarters.', fig: function () { return fline(0, 1, 8, [{ v: 3 / 8, lab: '3/8', col: 'var(--se)' }, { v: 0.5, lab: '1/2', col: 'var(--sb)' }, { v: 0.75, lab: '3/4', col: 'var(--sd)' }]); }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will put ' + fr(2, 3) + ', ' + fr(5, 6) + ' and ' + fr(7, 12) + ' in order, least to greatest.', fig: eq(fr(2, 3) + ', ' + fr(5, 6) + ', ' + fr(7, 12)) },
          { say: 'First I write them all with the same denominator, twelfths.', fig: eq(fr(8, 12) + ', ' + fr(10, 12) + ', ' + fr(7, 12)) },
          { say: 'Now I order the tops: 7, 8, 10.', fig: function () { return stack([[7, 12, 'var(--se)'], [8, 12, 'var(--sb)'], [10, 12, 'var(--sd)']]); } },
          { say: 'Least to greatest: ' + fr(7, 12) + ', ' + fr(2, 3) + ', ' + fr(5, 6) + '.', fig: function () { return fline(0, 1, 12, [{ v: 7 / 12, lab: '7/12', col: 'var(--se)' }, { v: 2 / 3, lab: '2/3', col: 'var(--sb)' }, { v: 5 / 6, lab: '5/6', col: 'var(--sd)' }], '', 2); }, ms: 2600 }
        ]),
        key: '<p><b>Same denominator for all, then order the tops.</b></p>',
        mistake: '<p>Ordering by the bottoms alone (3/8 last because 8 is biggest).</p>',
        check: [K.ck('fr-compare', 3), K.ck('fr-compare', 3)] }
    ] },
    { id: 'between', title: 'Numbers in between', sub: 'There is always another number in the gap.', concepts: [
      { id: 'zoom', title: 'Zoom in on the gap', exp: ['B1.5'], skill: 'fr-between', hard: true,
        body: '<p>Between any two different fractions there is <b>always</b> another fraction. Give them a common denominator. If there is no gap, cut the pieces smaller.</p>',
        watch: K.slides([
          { say: 'Find a fraction between one third and one half.', fig: function () { return fline(0, 1, 6, [{ v: 1 / 3, lab: '1/3', col: 'var(--sb)' }, { v: 0.5, lab: '1/2', col: 'var(--se)' }]); } },
          { say: 'In sixths they are 2/6 and 3/6. They are next to each other. No gap yet.', fig: eq(fr(1, 3) + ' = ' + fr(2, 6) + ' &nbsp; ' + fr(1, 2) + ' = ' + fr(3, 6)) },
          { say: 'Cut smaller, into twelfths: 4/12 and 6/12.', fig: eq(fr(4, 12) + ' &nbsp; ? &nbsp; ' + fr(6, 12)) },
          { say: 'Now <b>5/12</b> fits in between.', fig: function () { return zoom(1, 3, 1, 2).svg; }, ms: 2800 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find a fraction between ' + fr(2, 5) + ' and ' + fr(1, 2) + '.', fig: function () { return fline(0, 1, 10, [{ v: 0.4, lab: '2/5', col: 'var(--sb)' }, { v: 0.5, lab: '1/2', col: 'var(--se)' }]); } },
          { say: 'First a common denominator. In tenths they are ' + fr(4, 10) + ' and ' + fr(5, 10) + '. They are next to each other. No gap yet.', fig: eq(fr(2, 5) + ' = ' + fr(4, 10) + ' &nbsp; ' + fr(1, 2) + ' = ' + fr(5, 10)) },
          { say: 'So I cut the pieces smaller, into twentieths: ' + fr(8, 20) + ' and ' + fr(10, 20) + '.', fig: eq(fr(8, 20) + ' &nbsp; ? &nbsp; ' + fr(10, 20)) },
          { say: 'Now <b>' + fr(9, 20) + '</b> fits in between.', fig: function () { return zoom(2, 5, 1, 2).svg; }, ms: 2800 }
        ]),
        try: lab('zma', [
          { do: 'Zoom in between <b>1/3</b> and <b>1/2</b>.', goal: function (h) { return K.v(h, 'zma') === '1,3' && K.v(h, 'zmb') === '1,2'; }, yes: 'In twelfths: 5/12 is between.' },
          { do: 'Try <b>1/2</b> and <b>3/5</b>. What denominator does it need?', goal: function (h) { return K.v(h, 'zma') === '1,2' && K.v(h, 'zmb') === '3,5'; }, yes: 'Tenths are next to each other (5/10, 6/10), so it uses twentieths: 11/20.' },
          { do: 'Find a pair with <b>more than one</b> fraction in between.', goal: function (h) { var p = String(K.v(h, 'zma')).split(',').map(Number), q = String(K.v(h, 'zmb')).split(',').map(Number); if (p[0] * q[1] === q[0] * p[1]) return false; if (p[0] / p[1] > q[0] / q[1]) { var t = p; p = q; q = t; } var z = zoom(p[0], p[1], q[0], q[1]); return z.hi - z.lo > 2; }, yes: 'The wider the gap, the more fractions fit.' }
        ]),
        ways: [
          { label: 'Use decimals', html: '<p>' + fr(1, 3) + ' &asymp; 0.33 and ' + fr(1, 2) + ' = 0.5. Any decimal between, like 0.4, works. 0.4 = ' + fr(2, 5) + '.</p>' },
          { label: 'Add tops and bottoms', html: '<p>A shortcut: add the tops and add the bottoms. ' + fr(1, 3) + ' and ' + fr(1, 2) + ' give ' + fr('1 + 1', '3 + 2') + ' = ' + fr(2, 5) + ', which is always between the two. (This trick only finds a number between. It is not how to add fractions.)</p>' },
          { label: 'Double the bottoms', html: '<p>Double everything: ' + fr(1, 3) + ' = ' + fr(2, 6) + ' and ' + fr(1, 2) + ' = ' + fr(3, 6) + '. Double again: ' + fr(4, 12) + ' and ' + fr(6, 12) + '. Keep doubling until a gap opens.</p>' }
        ],
        key: '<p><b>Common denominator. No gap? Cut the pieces smaller.</b></p>',
        mistake: '<p>Saying there is nothing between 2/6 and 3/6. There are always fractions between; the pieces just need to be smaller.</p>',
        check: [function () { return mc('Which fraction is between ' + fr(2, 5) + ' and ' + fr(1, 2) + '?', fr(9, 20), [fr(3, 10), fr(11, 20), fr(3, 5)], 'Write both in twentieths.', fr(2, 5) + ' = ' + fr(8, 20) + ' and ' + fr(1, 2) + ' = ' + fr(10, 20) + '.'); }, K.ck('fr-between', 1), K.ck('fr-between', 3)] },
      { id: 'decimals', title: 'Decimals in between', exp: ['B1.5'], skill: 'fr-between',
        body: '<p>Decimals work the same way. Add a zero to cut the pieces 10 times smaller. Between 0.3 and 0.4 are 0.31, 0.32, ... 0.39.</p>',
        watch: K.slides([
          { say: 'What is between 0.3 and 0.4?', fig: function () { return dline(0.3, 0.4, 0.1, [{ v: 0.3, col: 'var(--sb)' }, { v: 0.4, col: 'var(--se)' }]); } },
          { say: 'Write them as hundredths: 0.30 and 0.40. Ten small steps appear.', fig: function () { return dline(0.3, 0.4, 0.01, [{ v: 0.3, col: 'var(--sb)' }, { v: 0.4, col: 'var(--se)' }]); } },
          { say: '0.35 is halfway. 0.31 to 0.39 are all between.', fig: function () { return dline(0.3, 0.4, 0.01, [{ v: 0.35, lab: '0.35' }]); } },
          { say: 'Zoom again: between 0.35 and 0.36 is <b>0.355</b>.', fig: function () { return dline(0.35, 0.36, 0.001, [{ v: 0.355, lab: '0.355' }]); }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find decimals between 0.7 and 0.8.', fig: function () { return dline(0.7, 0.8, 0.1, [{ v: 0.7, col: 'var(--sb)' }, { v: 0.8, col: 'var(--se)' }]); } },
          { say: 'I add a zero to both: 0.70 and 0.80. Now I can see ten small steps.', fig: function () { return dline(0.7, 0.8, 0.01, [{ v: 0.7, col: 'var(--sb)' }, { v: 0.8, col: 'var(--se)' }]); } },
          { say: '0.71, 0.72, and so on up to 0.79 are all between. 0.75 is halfway.', fig: function () { return dline(0.7, 0.8, 0.01, [{ v: 0.75, lab: '0.75' }]); } },
          { say: 'I can zoom in again. Between 0.72 and 0.73 is <b>0.725</b>.', fig: function () { return dline(0.72, 0.73, 0.001, [{ v: 0.725, lab: '0.725' }]); }, ms: 2600 }
        ]),
        key: '<p><b>Add a zero to both, then look between.</b> 0.6 and 0.7 become 0.60 and 0.70.</p>',
        mistake: '<p>Thinking 0.35 is bigger than 0.4 because 35 is bigger than 4. Line up the places: 0.35 and 0.40.</p>',
        check: [function () { return mc('Which number is between 0.6 and 0.7?', '0.65', ['0.06', '0.71', '0.7'], 'Write both as hundredths: 0.60 and 0.70.', '0.60 &lt; 0.65 &lt; 0.70.'); }, K.ck('fr-between', 2)] }
    ] },
    { id: 'add', title: 'Adding fractions', sub: 'Add pieces of the same size.', concepts: [
      { id: 'addsame', title: 'Add pieces of the same size', exp: ['B2.5'], skill: 'fr-add',
        body: '<p>When the bottoms match, the pieces are the same size. <b>Add the tops and keep the bottom.</b></p>',
        watch: K.slides([
          { say: 'Three eighths plus two eighths.', fig: function () { return stack([[3, 8, 'var(--sb)'], [2, 8, 'var(--se)']]); } },
          { say: 'Slide the pieces together: 3 eighths and 2 more eighths.', fig: function () { return addPic(3, 8, 2, 8); } },
          { say: '3 + 2 = 5 pieces. They are still eighths: five eighths.', fig: eq(fr(3, 8) + ' + ' + fr(2, 8) + ' = ' + fr(5, 8)), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will add ' + fr(2, 9) + ' + ' + fr(5, 9) + '.', fig: function () { return stack([[2, 9, 'var(--sb)'], [5, 9, 'var(--se)']]); } },
          { say: 'The pieces are the same size: ninths. I join them together.', fig: function () { return addPic(2, 9, 5, 9); } },
          { say: '2 + 5 = 7 pieces. They are still ninths, so the answer is ' + fr(7, 9) + '. Same bottom: I add the tops and keep the bottom.', fig: eq(fr(2, 9) + ' + ' + fr(5, 9) + ' = ' + fr(7, 9)), ms: 2600 }
        ]),
        try: { tool: 'fractions', opts: { wall: [8, 8, 8] }, tasks: [
          { do: 'Shade <b>3/8</b> in the first strip and <b>2/8</b> in the second.', goal: function (s) { var r = rows(s); return r[0] === 3 && r[1] === 2; }, yes: 'Now show the total in the third strip.' },
          { reset: false, do: 'Shade the <b>total</b> in the third strip.', goal: function (s) { var r = rows(s); return r[0] === 3 && r[1] === 2 && r[2] === 5; }, yes: '3/8 + 2/8 = 5/8.' }
        ] },
        key: '<p><b>Same bottom: add the tops, keep the bottom.</b></p>',
        mistake: '<p>Adding the bottoms too: 3/8 + 2/8 = 5/16. The pieces do not change size when you put them together.</p>',
        check: [function () { var d = R.int(5, 12), a = R.int(1, d - 2), b = R.int(1, d - 1 - a); return fq('Add: ' + fr(a, d) + ' + ' + fr(b, d) + '.', a + b, d, 'Same bottom: add the tops.', a + ' + ' + b + ' = ' + (a + b) + ', so ' + fr(a + b, d) + (gcd(a + b, d) > 1 ? ' = ' + frs(a + b, d) : '') + '.'); }, K.ck('fr-add', 1)] },
      { id: 'unlike', title: 'Different bottoms', exp: ['B2.5'], skill: 'fr-add', hard: true,
        body: '<p>You can only add pieces of the same size. If the bottoms are different, <b>rewrite both with a common denominator first</b>.</p>',
        watch: K.slides([
          { say: 'One half plus one third. Halves and thirds are different sizes.', fig: function () { return stack([[1, 2, 'var(--sb)'], [1, 3, 'var(--se)']]); } },
          { say: 'The LCM of 2 and 3 is 6. Cut both into sixths.', fig: function () { return addPic(1, 2, 1, 3); } },
          { say: 'One half is 3 sixths. One third is 2 sixths.', fig: eq(fr(1, 2) + ' + ' + fr(1, 3) + ' = ' + fr(3, 6) + ' + ' + fr(2, 6)) },
          { say: '3 + 2 = 5. The total is <b>five sixths</b>.', fig: eq(fr(1, 2) + ' + ' + fr(1, 3) + ' = ' + fr(5, 6)), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will add ' + fr(1, 4) + ' + ' + fr(2, 3) + '. Quarters and thirds are different sizes.', fig: function () { return stack([[1, 4, 'var(--sb)'], [2, 3, 'var(--se)']]); } },
          { say: 'First I find a common denominator. The LCM of 4 and 3 is 12, so I cut both into twelfths.', fig: function () { return addPic(1, 4, 2, 3); } },
          { say: fr(1, 4) + ' is ' + fr(3, 12) + '. ' + fr(2, 3) + ' is ' + fr(8, 12) + '.', fig: eq(fr(1, 4) + ' + ' + fr(2, 3) + ' = ' + fr(3, 12) + ' + ' + fr(8, 12)) },
          { say: 'Now I add the tops and keep the bottom: 3 + 8 = 11. The total is <b>' + fr(11, 12) + '</b>.', fig: eq(fr(1, 4) + ' + ' + fr(2, 3) + ' = ' + fr(11, 12)), ms: 2400 }
        ]),
        try: lab('ada', [
          { do: 'Add <b>1/2 + 1/3</b>.', goal: function (h) { return +K.v(h, 'ada') === 1 && +K.v(h, 'adb') === 2 && +K.v(h, 'adc') === 1 && +K.v(h, 'add') === 3; }, yes: '3/6 + 2/6 = 5/6.' },
          { do: 'Find two fractions with different bottoms that add to <b>exactly 1</b>.', goal: function (h) { var a = +K.v(h, 'ada'), b = +K.v(h, 'adb'), c = +K.v(h, 'adc'), d = +K.v(h, 'add'); return b !== d && b > 1 && d > 1 && a * d + c * b === b * d; }, yes: 'The pieces fill exactly one whole.' },
          { do: 'Make a total <b>more than 1</b>.', goal: function (h) { var a = +K.v(h, 'ada'), b = +K.v(h, 'adb'), c = +K.v(h, 'adc'), d = +K.v(h, 'add'); return b > 1 && d > 1 && a * d + c * b > b * d; }, yes: 'The answer can be written as a mixed number.' }
        ]),
        ways: [
          { label: 'Fraction strips', html: '<p>Shade 1/2 on the halves strip and 1/3 on the thirds strip. Then shade the same total on the sixths strip.</p>', tool: 'fractions', opts: { wall: [2, 3, 6] } },
          { label: 'Use money', html: '<p>Think of a dollar. ' + fr(1, 2) + ' of a dollar is 50¢ and ' + fr(1, 4) + ' is 25¢. Together 75¢, which is ' + fr(3, 4) + ' of a dollar. Cents are a common denominator of 100.</p>' },
          { label: 'Check it makes sense', html: '<p>' + fr(1, 2) + ' + ' + fr(1, 3) + ' must be <b>more than ' + fr(1, 2) + '</b>. Adding the bottoms gives ' + fr(2, 5) + ', which is less than ' + fr(1, 2) + ', so that cannot be right.</p>' }
        ],
        key: '<p><b>Common denominator first. Then add the tops and keep the bottom.</b></p>',
        mistake: '<p>Adding tops and bottoms: 1/2 + 1/3 = 2/5. Ask: is 2/5 more than 1/2? It is not, so it cannot be the total.</p>',
        check: [function () { return fq('Add: ' + fr(2, 5) + ' + ' + fr(3, 10) + '.', 7, 10, 'Write ' + fr(2, 5) + ' in tenths first.', fr(2, 5) + ' = ' + fr(4, 10) + '. ' + fr(4, 10) + ' + ' + fr(3, 10) + ' = ' + fr(7, 10) + '.'); }, K.ck('fr-add', 2), K.ck('fr-add', 2)] },
      { id: 'mixed', title: 'Add mixed numbers', exp: ['B2.5'], skill: 'fr-add',
        body: '<p>A <b>mixed number</b> like ' + A.mixed(2, 1, 4) + ' is a whole number and a fraction. To add mixed numbers, <b>add the wholes, add the fractions</b>, then tidy up.</p>',
        watch: K.slides([
          { say: 'One and three quarters plus two and a half.', fig: eq(A.mixed(1, 3, 4) + ' + ' + A.mixed(2, 1, 2)) },
          { say: 'Wholes: 1 + 2 = 3.', fig: eq('1 + 2 = 3') },
          { say: 'Fractions: three quarters plus two quarters is five quarters.', fig: function () { return addPic(3, 4, 1, 2) + eq(fr(3, 4) + ' + ' + fr(2, 4) + ' = ' + fr(5, 4)); } },
          { say: 'Five quarters is 1 and one quarter. So the total is 3 + 1 and one quarter: <b>4 and one quarter</b>.', fig: eq('3 + ' + A.mixed(1, 1, 4) + ' = ' + A.mixed(4, 1, 4)), ms: 2800 }
        ]),
        example: K.slides([
          { say: 'My turn. I will add ' + A.mixed(2, 2, 3) + ' + ' + A.mixed(1, 1, 2) + '.', fig: eq(A.mixed(2, 2, 3) + ' + ' + A.mixed(1, 1, 2)) },
          { say: 'First, wholes with wholes: 2 + 1 = 3.', fig: eq('2 + 1 = 3') },
          { say: 'Next, fractions with fractions. In sixths: ' + fr(4, 6) + ' + ' + fr(3, 6) + ' = ' + fr(7, 6) + '.', fig: function () { return addPic(2, 3, 1, 2) + eq(fr(2, 3) + ' + ' + fr(1, 2) + ' = ' + fr(4, 6) + ' + ' + fr(3, 6) + ' = ' + fr(7, 6)); } },
          { say: fr(7, 6) + ' is more than 1. It is ' + A.mixed(1, 1, 6) + ', so I carry a whole: 3 + ' + A.mixed(1, 1, 6) + ' = <b>' + A.mixed(4, 1, 6) + '</b>.', fig: eq('3 + ' + A.mixed(1, 1, 6) + ' = ' + A.mixed(4, 1, 6)), ms: 2800 }
        ]),
        key: '<p><b>Wholes with wholes, fractions with fractions.</b> If the fraction part is more than 1, carry a whole.</p>',
        mistake: '<p>Leaving the answer as 3 5/4. Five quarters is more than a whole, so carry 1: 4 1/4.</p>',
        check: [K.ck('fr-add', 3), function () { return { q: 'Mia ran ' + fr(3, 4) + ' km on Monday and ' + fr(5, 6) + ' km on Tuesday. How far in total? Type a fraction or mixed number.', type: 'num', answer: 19 / 12, show: '1 7/12', kb: 'text', tol: 1e-6, hint: 'Use twelfths.', explain: fr(9, 12) + ' + ' + fr(10, 12) + ' = ' + fr(19, 12) + ' = ' + A.mixed(1, 7, 12) + ' km.' }; }] }
    ] },
    { id: 'sub', title: 'Subtracting fractions', sub: 'Take away pieces of the same size.', concepts: [
      { id: 'take', title: 'Subtract fractions', exp: ['B2.5'], skill: 'fr-sub',
        body: '<p>Subtracting works the same way: <b>common denominator first, then subtract the tops</b>.</p>',
        watch: K.slides([
          { say: 'Five sixths take away one quarter.', fig: function () { return stack([[5, 6, 'var(--sb)'], [1, 4, 'var(--se)']]); } },
          { say: 'The LCM of 6 and 4 is 12. Five sixths is 10 twelfths. One quarter is 3 twelfths.', fig: eq(fr(10, 12) + ' &minus; ' + fr(3, 12)) },
          { say: 'Take 3 twelfths away from 10 twelfths.', fig: function () { return addPic(5, 6, 1, 4, true); } },
          { say: '7 twelfths are left.', fig: eq(fr(5, 6) + ' &minus; ' + fr(1, 4) + ' = ' + fr(7, 12)), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will work out ' + fr(3, 4) + ' &minus; ' + fr(2, 5) + '.', fig: function () { return stack([[3, 4, 'var(--sb)'], [2, 5, 'var(--se)']]); } },
          { say: 'First a common denominator. The LCM of 4 and 5 is 20. ' + fr(3, 4) + ' is ' + fr(15, 20) + '. ' + fr(2, 5) + ' is ' + fr(8, 20) + '.', fig: eq(fr(15, 20) + ' &minus; ' + fr(8, 20)) },
          { say: 'I take 8 twentieths away from 15 twentieths.', fig: function () { return addPic(3, 4, 2, 5, true); } },
          { say: '15 &minus; 8 = 7. So ' + fr(7, 20) + ' is left.', fig: eq(fr(3, 4) + ' &minus; ' + fr(2, 5) + ' = ' + fr(7, 20)) },
          { say: 'I check by adding back: ' + fr(7, 20) + ' + ' + fr(8, 20) + ' = ' + fr(15, 20) + '. It works.', fig: eq(fr(7, 20) + ' + ' + fr(8, 20) + ' = ' + fr(15, 20) + ' &#10003;'), ms: 2400 }
        ]),
        try: { tool: 'fractions', opts: { wall: [12] }, tasks: [
          { do: 'Shade <b>10/12</b>. That is 5/6.', goal: function (s) { return s[0].n === 10; }, yes: 'Now take away 1/4, which is 3/12.' },
          { reset: false, do: 'Take away <b>3/12</b> by tapping shaded parts.', goal: function (s) { return s[0].n === 7; }, yes: '10/12 &minus; 3/12 = 7/12.' }
        ] },
        key: '<p><b>Common denominator first. Then subtract the tops and keep the bottom.</b></p>',
        mistake: '<p>Subtracting the bottoms: 5/6 &minus; 1/4 = 4/2. Check by adding back: the answer plus 1/4 must give 5/6.</p>',
        check: [function () { return fq('Subtract: ' + fr(7, 8) + ' &minus; ' + fr(1, 2) + '.', 3, 8, fr(1, 2) + ' is how many eighths?', fr(1, 2) + ' = ' + fr(4, 8) + '. ' + fr(7, 8) + ' &minus; ' + fr(4, 8) + ' = ' + fr(3, 8) + '.'); }, K.ck('fr-sub', 1), K.ck('fr-sub', 2)] },
      { id: 'borrow', title: 'Borrow a whole', exp: ['B2.5'], skill: 'fr-sub', hard: true,
        body: '<p>In ' + A.mixed(2, 1, 4) + ' &minus; ' + fr(3, 4) + ' you cannot take 3 quarters from 1 quarter. <b>Break one whole into quarters</b> first.</p>',
        watch: K.slides([
          { say: 'Two and one quarter. Take away three quarters.', fig: function () { return bar(9, 4, { col: 'var(--sb)' }); } },
          { say: 'Only 1 quarter is loose. Break one whole into 4 quarters.', fig: eq(A.mixed(2, 1, 4) + ' = 1 + ' + fr(4, 4) + ' + ' + fr(1, 4) + ' = ' + A.mixed(1, 5, 4)) },
          { say: 'Now take 3 quarters from 5 quarters. 2 quarters are left.', fig: function () { return bar(6, 4, { col: 'var(--sb)' }) + eq(A.mixed(1, 5, 4) + ' &minus; ' + fr(3, 4) + ' = ' + A.mixed(1, 2, 4)); } },
          { say: 'Two quarters is one half. The answer is <b>one and a half</b>.', fig: eq(A.mixed(1, 2, 4) + ' = ' + A.mixed(1, 1, 2)), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will work out ' + A.mixed(3, 1, 5) + ' &minus; ' + fr(4, 5) + '.', fig: function () { return bar(16, 5, { col: 'var(--sb)' }); } },
          { say: 'Only 1 fifth is loose. That is not enough pieces, so I break one whole into 5 fifths.', fig: eq(A.mixed(3, 1, 5) + ' = 2 + ' + fr(5, 5) + ' + ' + fr(1, 5) + ' = ' + A.mixed(2, 6, 5)) },
          { say: 'Now I take 4 fifths from 6 fifths. 2 fifths are left.', fig: function () { return bar(12, 5, { col: 'var(--sb)' }) + eq(A.mixed(2, 6, 5) + ' &minus; ' + fr(4, 5) + ' = ' + A.mixed(2, 2, 5)); } },
          { say: 'So the answer is <b>' + A.mixed(2, 2, 5) + '</b>. I check by adding back: ' + A.mixed(2, 2, 5) + ' + ' + fr(4, 5) + ' = ' + A.mixed(2, 6, 5) + ' = ' + A.mixed(3, 1, 5) + '.', fig: eq(A.mixed(2, 2, 5) + ' + ' + fr(4, 5) + ' = ' + A.mixed(3, 1, 5) + ' &#10003;'), ms: 2600 }
        ]),
        try: { tool: 'fractions', opts: { wall: [4, 4, 4] }, tasks: [
          { do: 'Show <b>2 1/4</b>: two full strips and 1 quarter.', goal: function (s) { var r = rows(s).slice().sort(); return sum(s) === 9 && r.join() === '1,4,4'; }, yes: '2 1/4 is 9 quarters.' },
          { reset: false, do: 'Take away <b>3/4</b>. You will need to break into a full strip.', goal: function (s) { return sum(s) === 6; }, yes: '6 quarters = 1 2/4 = 1 1/2.' }
        ] },
        ways: [
          { label: 'Change to improper fractions', html: '<p>Write everything in quarters: ' + A.mixed(2, 1, 4) + ' = ' + fr(9, 4) + '. Then ' + fr(9, 4) + ' &minus; ' + fr(3, 4) + ' = ' + fr(6, 4) + ' = ' + A.mixed(1, 1, 2) + '.</p>' },
          { label: 'Count up', html: '<p>Start at ' + fr(3, 4) + ' and count up to ' + A.mixed(2, 1, 4) + '. ' + fr(3, 4) + ' to 1 is ' + fr(1, 4) + '. 1 to 2 is 1. 2 to ' + A.mixed(2, 1, 4) + ' is ' + fr(1, 4) + '. Total: ' + A.mixed(1, 2, 4) + ' = ' + A.mixed(1, 1, 2) + '.</p><div class="fig">' + fline(0, 3, 4, [{ v: 0.75, lab: '3/4', col: 'var(--se)' }, { v: 2.25, lab: '2 1/4', col: 'var(--sb)' }]) + '</div>' },
          { label: 'Like making change', html: '<p>It is like paying with a loonie when you only have a quarter loose: break the dollar into 4 quarters, then pay.</p>' }
        ],
        key: '<p><b>Not enough pieces? Break one whole into pieces.</b> Check by adding back.</p>',
        mistake: '<p>Subtracting the smaller fraction from the larger one (3/4 &minus; 1/4) and getting 2 2/4. Have the student add back to check.</p>',
        check: [function () { return { q: 'Subtract: ' + A.mixed(3, 1, 3) + ' &minus; ' + A.mixed(1, 2, 3) + '. Type a fraction or mixed number, like 1 1/2.', type: 'num', answer: 5 / 3, show: '1 2/3', kb: 'text', tol: 1e-6, hint: 'Break one whole into thirds: ' + A.mixed(3, 1, 3) + ' = ' + A.mixed(2, 4, 3) + '.', explain: A.mixed(2, 4, 3) + ' &minus; ' + A.mixed(1, 2, 3) + ' = ' + A.mixed(1, 2, 3) + '.' }; }, K.ck('fr-sub', 3), K.ck('fr-sub', 3)] }
    ] }
  ];


  A.register('fractions', {
    lessons: LESSONS,

    quiz: [
      { q: 'Fill in the missing number: ' + fr(4, 7) + ' = ' + fr('?', 35), type: 'num', answer: 20, hint: '7 times what makes 35? Do the same to the top.', explain: '7 &times; 5 = 35, so 4 &times; 5 = 20.' },
      { q: 'Which fraction is ' + fr(24, 40) + ' in simplest form?', type: 'mc', options: [fr(12, 20), fr(6, 10), fr(3, 5), fr(4, 5)], answer: 2, hint: 'Find the GCF of 24 and 40.', explain: 'The GCF is 8. 24 &divide; 8 = 3 and 40 &divide; 8 = 5, so ' + fr(3, 5) + '. The other equal ones are not in simplest form.' },
      { q: 'Which list is in order from least to greatest?', type: 'mc', options: [fr(1, 2) + ', ' + fr(3, 8) + ', ' + fr(3, 4), fr(3, 8) + ', ' + fr(1, 2) + ', ' + fr(3, 4), fr(3, 4) + ', ' + fr(1, 2) + ', ' + fr(3, 8), fr(3, 8) + ', ' + fr(3, 4) + ', ' + fr(1, 2)], answer: 1, hint: 'Write all three in eighths.', explain: 'In eighths they are 4/8, 3/8 and 6/8. In order: 3/8, 4/8 (= 1/2), 6/8 (= 3/4).' },
      { q: 'Which fraction is between ' + fr(2, 5) + ' and ' + fr(1, 2) + '?', type: 'mc', options: [fr(3, 10), fr(9, 20), fr(11, 20), fr(3, 5)], answer: 1, hint: 'Write both in twentieths.', explain: fr(2, 5) + ' = ' + fr(8, 20) + ' and ' + fr(1, 2) + ' = ' + fr(10, 20) + '. ' + fr(9, 20) + ' is between them.' },
      { q: 'Add: ' + fr(1, 4) + ' + ' + fr(2, 3) + '. Type a fraction.', type: 'num', answer: 11 / 12, show: '11/12', kb: 'text', hint: 'The common denominator of 4 and 3 is 12.', explain: fr(3, 12) + ' + ' + fr(8, 12) + ' = ' + fr(11, 12) + '.' },
      { q: 'Subtract: ' + A.mixed(3, 1, 3) + ' &minus; ' + A.mixed(1, 2, 3) + '. Type a fraction or mixed number, like 1 1/2.', type: 'num', answer: 5 / 3, show: '1 2/3', kb: 'text', hint: 'Break one whole into thirds: ' + A.mixed(3, 1, 3) + ' = ' + A.mixed(2, 4, 3) + '.', explain: A.mixed(2, 4, 3) + ' &minus; ' + A.mixed(1, 2, 3) + ' = ' + A.mixed(1, 2, 3) + '.' },
      { q: 'Mia ran ' + fr(3, 4) + ' km on Monday and ' + fr(5, 6) + ' km on Tuesday. How far did she run in total? Type a fraction or mixed number.', type: 'num', answer: 19 / 12, show: '1 7/12 km', kb: 'text', hint: 'Use twelfths: ' + fr(3, 4) + ' = ' + fr(9, 12) + ' and ' + fr(5, 6) + ' = ' + fr(10, 12) + '.', explain: fr(9, 12) + ' + ' + fr(10, 12) + ' = ' + fr(19, 12) + ' = ' + A.mixed(1, 7, 12) + ' km.' }
    ],

    practice: [
      { id: 'fr-equiv', name: 'Equivalent fractions', code: 'B1.4', gen: function (lv) {
        var d = R.int(2, lv === 1 ? 6 : 12), n = R.int(1, d - 1), k = R.int(2, lv === 1 ? 4 : 9), top = R.int(0, 1);
        if (lv === 3) { var g = gcd(n, d); n /= g; d /= g; if (d === 1) { n = 1; d = 2; } }
        var bigN = n * k, bigD = d * k, ask = lv === 3 && R.int(0, 1) ? 'small' : 'big';
        if (ask === 'small') {
          return { q: 'Fill in the missing number: ' + fr(bigN, bigD) + ' = ' + (top ? fr('?', d) : fr(n, '?')), type: 'num', answer: top ? n : d,
            hint: 'What was ' + (top ? bigD : bigN) + ' divided by to get ' + (top ? d : n) + '? Divide the other number the same way.',
            steps: [(top ? bigD + ' &divide; ' + k + ' = ' + d : bigN + ' &divide; ' + k + ' = ' + n) + '.', 'Do the same to the other part: ' + (top ? bigN + ' &divide; ' + k + ' = ' + n : bigD + ' &divide; ' + k + ' = ' + d) + '.', 'So ' + fr(bigN, bigD) + ' = ' + fr(n, d) + '.'],
            explain: 'Both parts were divided by ' + k + '.' };
        }
        return { q: 'Fill in the missing number: ' + fr(n, d) + ' = ' + (top ? fr('?', bigD) : fr(bigN, '?')), type: 'num', answer: top ? bigN : bigD,
          fig: lv === 1 ? stack([[n, d, 'var(--sb)'], [bigN, bigD, 'var(--se)']]) : '',
          hint: 'What was ' + (top ? d : n) + ' multiplied by to get ' + (top ? bigD : bigN) + '? Do the same to the other part.',
          steps: [(top ? d + ' &times; ' + k + ' = ' + bigD : n + ' &times; ' + k + ' = ' + bigN) + '.', 'Do the same to the other part: ' + (top ? n + ' &times; ' + k + ' = ' + bigN : d + ' &times; ' + k + ' = ' + bigD) + '.', 'So ' + fr(n, d) + ' = ' + fr(bigN, bigD) + '.'],
          explain: 'Both parts were multiplied by ' + k + '.' };
      } },
      { id: 'fr-simplify', name: 'Simplify fractions', code: 'B1.4', gen: function (lv) {
        var d, n, k;
        do { d = R.int(2, lv === 1 ? 8 : 12); n = R.int(1, lv === 3 ? 2 * d : d - 1); } while (gcd(n, d) !== 1 || n === d);
        k = lv === 1 ? R.int(2, 5) : R.int(3, 12);
        var N = n * k, D = d * k, G = gcd(N, D);
        if (lv === 1) {
          var o = R.mc(fr(n, d), [fr(N / 2 === Math.floor(N / 2) && D % 2 === 0 && G > 2 ? N / 2 : n + 1, N / 2 === Math.floor(N / 2) && D % 2 === 0 && G > 2 ? D / 2 : d), fr(N - (k - 1), D), fr(n, d + 1), fr(d, n)]);
          return { q: 'Which is ' + fr(N, D) + ' in simplest form?', type: 'mc', options: o.options, answer: o.answer, fig: stack([[N, D, 'var(--sb)'], [n, d, 'var(--se)']]),
            hint: 'Find the biggest number that divides ' + N + ' and ' + D + '.',
            steps: ['The GCF of ' + N + ' and ' + D + ' is ' + G + '.', N + ' &divide; ' + G + ' = ' + n + ' and ' + D + ' &divide; ' + G + ' = ' + d + '.', 'Simplest form: ' + fr(n, d) + '.'], explain: fr(N, D) + ' = ' + fr(n, d) + '.' };
        }
        return { q: 'Simplify ' + fr(N, D) + (n > d ? '. Type a fraction like 7/4 or a mixed number like 1 3/4.' : '. Type it as a fraction, like 2/5.'), type: 'num', answer: n / d, show: n > d ? n + '/' + d + ' or ' + plain(n, d) : n + '/' + d, kb: 'text', accept: A.lowest(n, d),
          hint: 'Divide the top and bottom by the GCF of ' + N + ' and ' + D + '.',
          steps: ['Factors of ' + N + ' and ' + D + ' in common include ' + G + '. It is the greatest.', N + ' &divide; ' + G + ' = ' + n + ' and ' + D + ' &divide; ' + G + ' = ' + d + '.', 'Simplest form: ' + fr(n, d) + (n > d ? ' = ' + frs(n, d) : '') + '.'],
          explain: 'The GCF is ' + G + ', so ' + fr(N, D) + ' = ' + fr(n, d) + '.' };
      } },
      { id: 'fr-compare', name: 'Compare and order fractions', code: 'B1.3, B1.4', gen: function (lv) {
        function rnd() { var d = R.int(2, 12), n = R.int(1, lv === 3 ? 2 * d : d - 1); return [n, d]; }
        if (lv === 3) {
          var fs = [], vals = {};
          while (fs.length < 3) { var f = rnd(), v = f[0] / f[1]; if (!vals[v.toFixed(6)]) { vals[v.toFixed(6)] = 1; fs.push(f); } }
          var sorted = fs.slice().sort(function (a, b) { return a[0] / a[1] - b[0] / b[1]; });
          var show = function (l) { return l.map(function (f) { return fr(f[0], f[1]); }).join(', '); };
          var perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(function (p) { return show(p.map(function (i) { return sorted[i]; })); });
          var o = R.mc(perms[0], R.shuffle(perms.slice(1)));
          var L = sorted.reduce(function (a, f) { return lcm(a, f[1]); }, 1);
          return { q: 'Which list is in order from least to greatest?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Write all three with the same denominator, ' + L + ', or compare each to 1/2 and 1.',
            steps: ['Common denominator: ' + L + '.', fs.map(function (f) { return fr(f[0], f[1]) + ' = ' + fr(f[0] * L / f[1], L); }).join(', ') + '.', 'Order the tops: ' + show(sorted) + '.'],
            explain: 'Least to greatest: ' + show(sorted) + '.' };
        }
        var a, b;
        do {
          var d0 = R.int(3, 12);
          if (lv === 1) {
            if (R.int(0, 1)) { a = [R.int(1, d0 - 1), d0]; b = [R.int(1, d0 - 1), d0]; }
            else { var n0 = R.int(1, 4); a = [n0, R.int(n0 + 1, 12)]; b = [n0, R.int(n0 + 1, 12)]; }
          } else { a = [R.int(1, d0 - 1), d0]; var d1 = R.int(2, 12); b = [R.int(1, d1 - 1), d1]; }
        } while (a[0] * b[1] === b[0] * a[1] || (lv === 2 && a[1] === b[1]));
        var L2 = lcm(a[1], b[1]), x = a[0] * L2 / a[1], y = b[0] * L2 / b[1], big = x > y ? a : b, sm = x > y ? b : a;
        var o2 = R.mc(fr(big[0], big[1]), [fr(sm[0], sm[1]), 'They are equal']);
        return { q: 'Which is greater?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: a[1] === b[1] ? 'Same size pieces: compare the tops.' : a[0] === b[0] ? 'Same number of pieces: which pieces are bigger?' : 'Rewrite both with the denominator ' + L2 + '.',
          steps: [fr(a[0], a[1]) + ' = ' + fr(x, L2) + ' and ' + fr(b[0], b[1]) + ' = ' + fr(y, L2) + '.', 'Compare the tops: ' + Math.max(x, y) + ' &gt; ' + Math.min(x, y) + '.', fr(big[0], big[1]) + ' is greater.<div class="fig">' + fline(0, Math.max(1, Math.ceil(Math.max(x, y) / L2)), 1, [{ v: a[0] / a[1], lab: a[0] + '/' + a[1], col: 'var(--sb)' }, { v: b[0] / b[1], lab: b[0] + '/' + b[1], col: 'var(--se)' }]) + '</div>'],
          explain: fr(big[0], big[1]) + ' = ' + fr(Math.max(x, y), L2) + ' is more than ' + fr(sm[0], sm[1]) + ' = ' + fr(Math.min(x, y), L2) + '.' };
      } },
      { id: 'fr-between', name: 'A number in between', code: 'B1.5', gen: function (lv) {
        if (lv === 2 && R.int(0, 1)) {
          var t = R.int(1, 8), h = R.int(0, 9), lo = t / 10 + h / 100, hi = lo + 0.01;
          var mid = (lo * 1000 + R.int(1, 9)) / 1000, f = function (v) { return String(Math.round(v * 1000) / 1000); };
          var o0 = R.mc(f(mid), [f(lo - 0.01 + 0.001 * R.int(1, 9)), f(hi + 0.001 * R.int(1, 9)), f(lo / 10)]);
          return { q: 'Which decimal is between ' + f(lo) + ' and ' + f(hi) + '?', type: 'mc', options: o0.options, answer: o0.answer,
            hint: 'Write both with three decimal places: ' + lo.toFixed(3) + ' and ' + hi.toFixed(3) + '.',
            steps: ['Add a zero so both have thousandths: ' + lo.toFixed(3) + ' and ' + hi.toFixed(3) + '.', 'Any number from ' + (lo + 0.001).toFixed(3) + ' to ' + (hi - 0.001).toFixed(3) + ' fits.', f(mid) + ' is one of them.'],
            explain: lo.toFixed(3) + ' &lt; ' + mid.toFixed(3) + ' &lt; ' + hi.toFixed(3) + '.' };
        }
        if (lv === 1) {
          var dd = R.int(5, 12), a = R.int(1, dd - 3), c = a + R.int(2, 3), m = R.int(a + 1, c - 1);
          var o1 = R.mc(fr(m, dd), [fr(a - 1 > 0 ? a - 1 : c + 1, dd), fr(c + 1, dd), fr(m, dd + 3)].filter(function (x) { return x !== fr(m, dd); }));
          return { q: 'Which fraction is between ' + fr(a, dd) + ' and ' + fr(c, dd) + '?', type: 'mc', options: o1.options, answer: o1.answer,
            fig: fline(0, 1, dd, [{ v: a / dd, col: 'var(--sb)', lab: a + '/' + dd }, { v: c / dd, col: 'var(--se)', lab: c + '/' + dd }]),
            hint: 'The denominators are the same. Look for a top between ' + a + ' and ' + c + '.',
            steps: ['Same denominator, ' + dd + ', so compare the tops.', 'A top between ' + a + ' and ' + c + ' works, like ' + m + '.', 'Answer: ' + fr(m, dd) + '.'], explain: a + ' &lt; ' + m + ' &lt; ' + c + ', so ' + fr(m, dd) + ' is between.' };
        }
        var p, q;
        do { p = [R.int(1, 5), R.int(2, 8)]; q = [R.int(1, 7), R.int(2, 8)]; } while (p[0] >= p[1] || q[0] >= q[1] || p[0] / p[1] >= q[0] / q[1] || q[0] / q[1] - p[0] / p[1] > 0.3);
        var z = zoom(p[0], p[1], q[0], q[1]), pick = R.int(z.lo + 1, z.hi - 1), ans = frs(pick, z.D);
        var lov = p[0] / p[1], hiv = q[0] / q[1], wrong = [];
        [[z.lo - 1, z.D], [z.hi + 1, z.D], [p[0] + q[0], p[1] + q[1] + 3], [z.hi + 2, z.D], [p[0], q[1] + p[1]]].forEach(function (w) {
          var v = w[0] / w[1];
          if (w[0] > 0 && (v <= lov || v >= hiv) && wrong.indexOf(frs(w[0], w[1])) < 0 && frs(w[0], w[1]) !== ans) wrong.push(frs(w[0], w[1]));
        });
        var o3 = R.mc(ans, wrong);
        return { q: 'Which fraction is between ' + fr(p[0], p[1]) + ' and ' + fr(q[0], q[1]) + '?', type: 'mc', options: o3.options, answer: o3.answer,
          hint: 'Rewrite both with the denominator ' + z.D + '.',
          steps: ['Rewrite with the denominator ' + z.D + ': ' + fr(z.lo, z.D) + ' and ' + fr(z.hi, z.D) + '.', (z.hi - z.lo === 2 ? (z.lo + 1) + ' is the only top that fits.' : 'Any top from ' + (z.lo + 1) + ' to ' + (z.hi - 1) + ' fits.') + '<div class="fig">' + z.svg + '</div>', ans + ' = ' + fr(pick, z.D) + ' is between them.'],
          explain: fr(z.lo, z.D) + ' &lt; ' + fr(pick, z.D) + ' &lt; ' + fr(z.hi, z.D) + '.' };
      } },
      { id: 'fr-add', name: 'Add fractions', code: 'B2.5', gen: function (lv) {
        var a, b, c, d, w1 = 0, w2 = 0;
        if (lv === 1) { b = R.int(3, 10); d = b * R.pick([1, 2]); if (d > 12) d = b; a = R.int(1, b - 1); c = R.int(1, d - 1); }
        else { do { b = R.int(2, 10); d = R.int(2, 10); } while (b === d || lcm(b, d) > 40); a = R.int(1, b - 1); c = R.int(1, d - 1); }
        if (lv === 3) { w1 = R.int(1, 3); w2 = R.int(1, 2); }
        var L = lcm(b, d), x = a * L / b, y = c * L / d, N = (w1 + w2) * L + x + y;
        var q = lv === 3 ? 'Add: ' + A.mixed(w1, a, b) + ' + ' + A.mixed(w2, c, d) + '. Type a mixed number like 3 1/4, or a fraction.' : 'Add: ' + fr(a, b) + ' + ' + fr(c, d) + '. Type a fraction or mixed number.';
        var steps = ['Common denominator: ' + L + '. ' + fr(a, b) + ' = ' + fr(x, L) + ' and ' + fr(c, d) + ' = ' + fr(y, L) + '.'];
        if (lv === 3) steps.push('Add the wholes: ' + w1 + ' + ' + w2 + ' = ' + (w1 + w2) + '. Add the fractions: ' + fr(x, L) + ' + ' + fr(y, L) + ' = ' + fr(x + y, L) + '.');
        else steps.push('Add the tops: ' + x + ' + ' + y + ' = ' + (x + y) + '. Keep the bottom: ' + fr(x + y, L) + '.');
        steps.push('Simplify: ' + frs(N, L) + '.');
        return { q: q, type: 'num', answer: N / L, show: plain(N, L), kb: 'text', tol: 1e-6, fig: lv === 1 ? addPic(a, b, c, d) : '',
          hint: b === d ? 'The pieces are the same size. Add the tops.' : 'Write both fractions with the denominator ' + L + ' first.', steps: steps,
          explain: 'The total is ' + frs(N, L) + '.' };
      } },
      { id: 'fr-sub', name: 'Subtract fractions', code: 'B2.5', gen: function (lv) {
        var a, b, c, d, w1 = 0, w2 = 0, L, x, y;
        do {
          if (lv === 1) { b = R.int(3, 10); d = b * R.pick([1, 2]); if (d > 12) d = b; } else { do { b = R.int(2, 10); d = R.int(2, 10); } while (b === d || lcm(b, d) > 40); }
          a = R.int(1, b - 1); c = R.int(1, d - 1); L = lcm(b, d); x = a * L / b; y = c * L / d;
          if (lv === 3) { w1 = R.int(2, 4); w2 = R.int(0, w1 - 1); }
        } while (lv < 3 ? x <= y : (w1 * L + x) <= (w2 * L + y) || x >= y);
        var N = (w1 - w2) * L + x - y;
        var q = lv === 3 ? 'Subtract: ' + A.mixed(w1, a, b) + ' &minus; ' + A.mixed(w2, c, d) + '. Type a mixed number or fraction.' : 'Subtract: ' + fr(a, b) + ' &minus; ' + fr(c, d) + '. Type a fraction.';
        var steps = ['Common denominator: ' + L + '. ' + fr(a, b) + ' = ' + fr(x, L) + ' and ' + fr(c, d) + ' = ' + fr(y, L) + '.'];
        if (lv === 3) steps.push(fr(x, L) + ' is less than ' + fr(y, L) + ', so borrow a whole: ' + A.mixed(w1, x, L) + ' = ' + A.mixed(w1 - 1, x + L, L) + '.', 'Subtract the wholes and the fractions: ' + (w1 - 1 - w2) + ' and ' + fr(x + L - y, L) + '.');
        else steps.push('Subtract the tops: ' + x + ' &minus; ' + y + ' = ' + (x - y) + '.');
        steps.push('Answer in simplest form: ' + frs(N, L) + '.');
        return { q: q, type: 'num', answer: N / L, show: plain(N, L), kb: 'text', tol: 1e-6, fig: lv === 1 ? addPic(a, b, c, d, true) : '',
          hint: lv === 3 ? 'The second fraction is bigger than the first. Borrow 1 whole as ' + L + '/' + L + '.' : 'Write both with the denominator ' + L + ', then subtract the tops.', steps: steps,
          explain: 'The answer is ' + frs(N, L) + '. Check: add it back to ' + (lv === 3 ? A.mixed(w2, c, d) : fr(c, d)) + '.' };
      } }
    ]
  });

  /* ---------- question shapes: more ways to practise each skill ---------- */
  function sl(n, d) { return n + '/' + d; } /* a fraction on one line, for number line labels */
  function frac(maxD) { var d = R.int(2, maxD); return [R.int(1, d - 1), d]; }
  function val(f) { return f[0] / f[1]; }
  Atlas.Q.shapes('fractions', {
    'fr-equiv': [
      [1, 'fill', function (lv) {
        var d = R.int(2, lv === 1 ? 6 : 12), n = R.int(1, d - 1), k = R.int(2, lv === 1 ? 4 : 8);
        return { q: 'Fill in the missing numerator.', type: 'fill', fill: '<span class="math">' + fr(n, d) + ' = </span>[[]] <span class="math">/ ' + d * k + '</span>', answers: [n * k],
          fig: lv === 1 ? stack([[n, d, 'var(--sb)'], [n * k, d * k, 'var(--se)']]) : '',
          hint: 'What do you multiply ' + d + ' by to get ' + d * k + '? Do the same to the top.', steps: [d + ' &times; ' + k + ' = ' + d * k + '.', n + ' &times; ' + k + ' = ' + n * k + '.'],
          explain: fr(n, d) + ' = ' + fr(n * k, d * k) + '.', meta: { k: 'fr-equiv-fill', n: n, d: d, D: d * k } };
      }],
      [1, 'match', function (lv) {
        var base = K.uniq(3, function () { var f = frac(lv === 1 ? 6 : 10), g = gcd(f[0], f[1]); return [f[0] / g, f[1] / g]; }, val);
        var ks = base.map(function () { return R.int(2, 4); }), pairs = base.map(function (f, i) { return [fr(f[0], f[1]), fr(f[0] * ks[i], f[1] * ks[i])]; });
        return { q: 'Match each fraction to an equivalent fraction.', type: 'match', pairs: pairs,
          hint: 'Equivalent fractions multiply the top and the bottom by the same number.', steps: ['Look at the bottoms: which one is a multiple of which?'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'fr-equiv-match', pairs: base.map(function (f, i) { return [f, [f[0] * ks[i], f[1] * ks[i]]]; }) } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), d = R.int(3, 9), n = R.int(1, d - 1), k = R.int(2, 4), truth = R.int(0, 1), t = truth ? [n * k, d * k] : [n + k, d + k];
        var right = 'To make an equivalent fraction, multiply the top and the bottom by the same number. ' + fr(n, d) + ' = ' + fr(n * k, d * k) + '.';
        return { q: who + ' says <span class="math">' + fr(n, d) + ' = ' + fr(t[0], t[1]) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Adding the same number to the top and the bottom keeps the fraction the same.', 'Two fractions are equal only when their bottoms match.']),
          hint: 'Did ' + who + ' multiply or add?', steps: [right], explain: right, meta: { k: 'fr-equiv-tf', a: [n, d], b: t } };
      }]
    ],
    'fr-simplify': [
      [1, 'tap', function () {
        return K.retry(function () {
          var tiles = K.uniq(4, function () { var f = frac(12); if (gcd(f[0], f[1]) === 1) { var k = R.int(2, 3); f = [f[0] * k, f[1] * k]; } return f; }, function (f) { return f.join('/'); });
          var at = R.int(0, 3), s = frac(9); while (gcd(s[0], s[1]) !== 1) s = frac(9);
          tiles[at] = s;
          if (tiles.filter(function (f) { return gcd(f[0], f[1]) === 1; }).length !== 1 || new Set(tiles.map(String)).size !== 4) return null;
          return { q: 'Tap the fraction that is in <b>simplest form</b>.', type: 'tap', tiles: tiles.map(function (f) { return fr(f[0], f[1]); }), answer: at, answerText: f2(s),
            hint: 'In simplest form, the top and bottom have no common factor except 1.', steps: ['Check each fraction: can you divide the top and the bottom by the same number?'],
            explain: fr(s[0], s[1]) + ' cannot be simplified. Each of the others can.', meta: { k: 'fr-simplest-tap', tiles: tiles } };
        });
      }],
      [1, 'fill', function (lv) {
        var n, d; do { d = R.int(2, lv === 1 ? 8 : 12); n = R.int(1, d - 1); } while (gcd(n, d) !== 1);
        var k = R.int(2, lv === 1 ? 5 : 9);
        return { q: 'Simplify <span class="math">' + fr(n * k, d * k) + '</span>. Fill in the top and the bottom.', type: 'fill', fill: '<span class="math">' + fr(n * k, d * k) + ' = </span>[[]] <span class="math">/</span> [[]]', answers: [n, d],
          hint: 'Find the greatest common factor of ' + n * k + ' and ' + d * k + '.', steps: ['The GCF is ' + k + '.', n * k + ' &divide; ' + k + ' = ' + n + ' and ' + d * k + ' &divide; ' + k + ' = ' + d + '.'],
          explain: fr(n * k, d * k) + ' = ' + fr(n, d) + ' in simplest form.', meta: { k: 'fr-simplify-fill', n: n * k, d: d * k } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), n, d; do { d = R.int(3, 9); n = R.int(1, d - 1); } while (gcd(n, d) !== 1);
        var k = R.pick([4, 6, 8, 9]), p = k === 9 ? 3 : 2, truth = R.int(0, 1), said = truth ? [n, d] : [n * k / p, d * k / p];
        var right = 'The GCF of ' + n * k + ' and ' + d * k + ' is ' + k + '. Dividing both by ' + k + ' gives ' + fr(n, d) + '.';
        return { q: who + ' says <span class="math">' + fr(n * k, d * k) + '</span> in simplest form is <span class="math">' + fr(said[0], said[1]) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Dividing the top and bottom by any common factor always gives simplest form.', 'A fraction is in simplest form when its bottom is less than 10.']),
          hint: 'Can ' + fr(said[0], said[1]) + ' be simplified any more?', steps: [right], explain: right, meta: { k: 'fr-simplify-tf', f: [n * k, d * k], said: said } };
      }]
    ],
    'fr-compare': [
      [1, 'order', function (lv) {
        var list = K.uniq(lv === 1 ? 3 : 4, function () { return frac(lv === 1 ? 8 : 12); }, val).sort(function (x, y) { return val(x) - val(y); });
        return { q: 'Put the fractions in order from <b>least</b> to <b>greatest</b>.', type: 'order', items: list.map(function (f) { return fr(f[0], f[1]); }), first: 'least', last: 'greatest',
          hint: 'Compare each one with 0, one half and 1. Or use a common denominator.', steps: ['Close to 0, near one half, or close to 1?', 'For two that are close, use a common denominator.'],
          explain: 'In order: ' + list.map(function (f) { return fr(f[0], f[1]); }).join(', ') + '.', meta: { k: 'fr-order', list: list } };
      }],
      [1, 'line', function () {
        var d = R.pick([2, 4, 5, 8, 10]), n = R.int(1, d - 1);
        return { q: 'Place <span class="math">' + fr(n, d) + '</span> on the number line.', type: 'line', min: 0, max: 1, tick: 1 / d, every: 1, snap: 1 / d, tol: 0.25 / d, answer: n / d, label: function (v) { return v === 0 || v === 1 ? String(v) : sl(Math.round(v * d), d); },
          hint: 'The line from 0 to 1 is cut into ' + d + ' equal parts.', steps: ['Count ' + n + ' parts from 0.'],
          explain: fr(n, d) + ' is ' + n + ' of the ' + d + ' equal parts from 0 to 1.', meta: { k: 'fr-line', n: n, d: d } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a = R.int(2, 6), b;
        do { b = R.int(2, 9); } while (b === a);
        var n = R.int(1, Math.min(a, b) - 1);
        var big = Math.max(a, b), small = Math.min(a, b);
        var claim = R.int(0, 1) ? [n, big, n, small] : [n, small, n, big]; /* claim: first > second */
        var truth = claim[1] < claim[3];
        var right = 'The tops are the same, so compare the piece sizes. ' + fr(1, big) + ' is smaller than ' + fr(1, small) + '. So ' + fr(n, small) + ' is greater.';
        return { q: who + ' says <span class="math">' + fr(claim[0], claim[1]) + ' &gt; ' + fr(claim[2], claim[3]) + '</span>. True or false?', type: 'tf', answer: truth,
          why: K.why(right, ['A bigger bottom number means a bigger fraction.', 'They are equal because the tops are the same.']),
          hint: 'Same tops: which pieces are bigger?', steps: [right], explain: right, meta: { k: 'fr-cmp-tf', a: [claim[0], claim[1]], b: [claim[2], claim[3]] } };
      }]
    ],
    'fr-between': [
      [1, 'pick', function () {
        return K.retry(function () {
          var d = R.int(6, 12), lo = R.int(1, d - 5), hi = lo + R.int(3, 4);
          var opts = K.uniq(5, function () { return [R.int(1, d - 1), d]; }, val).sort(function (x, y) { return x[0] - y[0]; });
          var ans = K.picks(opts, function (f) { return f[0] > lo && f[0] < hi; });
          if (!ans) return null;
          return { q: 'Pick every fraction between <span class="math">' + fr(lo, d) + '</span> and <span class="math">' + fr(hi, d) + '</span>.', type: 'pick', options: opts.map(function (f) { return fr(f[0], f[1]); }), answer: ans,
            hint: 'The bottoms are all ' + d + '. Compare the tops.', steps: ['A fraction is between them when its top is between ' + lo + ' and ' + hi + '.'],
            explain: ans.map(function (j) { return fr(opts[j][0], d); }).join(', ') + ' are between ' + fr(lo, d) + ' and ' + fr(hi, d) + '.', meta: { k: 'fr-between-pick', lo: [lo, d], hi: [hi, d], opts: opts } };
        });
      }],
      [1, 'tap', function () {
        return K.retry(function () {
          var p, q; do { p = frac(6); q = frac(6); } while (val(p) >= val(q) || val(q) - val(p) < 0.15);
          var D = lcm(p[1], q[1]) * 2, inside = null;
          for (var t = Math.floor(val(p) * D) + 1; t < val(q) * D; t++) { if (t / D > val(p) && t / D < val(q)) { inside = [t, D]; break; } }
          if (!inside) return null;
          var g = gcd(inside[0], inside[1]); inside = [inside[0] / g, inside[1] / g];
          var outs = K.uniq(3, function () { var f = frac(12); return f; }, val).filter(function (f) { return !(val(f) > val(p) && val(f) < val(q)) && val(f) !== val(inside); });
          if (outs.length < 3) return null;
          var tiles = R.shuffle([inside].concat(outs));
          return { q: 'Tap the fraction that is between <span class="math">' + fr(p[0], p[1]) + '</span> and <span class="math">' + fr(q[0], q[1]) + '</span>.', type: 'tap', tiles: tiles.map(function (f) { return fr(f[0], f[1]); }), answer: tiles.indexOf(inside), answerText: f2(inside),
            hint: 'Write the fractions with a common denominator, then compare.', steps: ['Use the denominator ' + D + ': ' + fr(p[0] * D / p[1], D) + ' and ' + fr(q[0] * D / q[1], D) + '.'],
            explain: fr(inside[0], inside[1]) + ' is between them.', meta: { k: 'fr-between-tap', p: p, q: q, tiles: tiles } };
        });
      }],
      [2, 'mistake', function () {
        var who = K.name(), d = R.int(3, 8), n = R.int(1, d - 2);
        var right = 'Write both with a bigger denominator: ' + fr(n, d) + ' = ' + fr(2 * n, 2 * d) + ' and ' + fr(n + 1, d) + ' = ' + fr(2 * n + 2, 2 * d) + '. ' + fr(2 * n + 1, 2 * d) + ' is between them.';
        return { q: who + ' says there is <b>no</b> fraction between <span class="math">' + fr(n, d) + '</span> and <span class="math">' + fr(n + 1, d) + '</span>, because the tops are next to each other. True or false?', type: 'tf', answer: false,
          why: K.why(right, ['There is nothing between two numbers whose tops are next to each other.', 'Only whole numbers can be between two fractions.']),
          hint: 'Try doubling the top and the bottom of both.', steps: [right], explain: right, meta: { k: 'fr-between-tf', lo: [n, d], hi: [n + 1, d], mid: [2 * n + 1, 2 * d] } };
      }]
    ],
    'fr-add': [
      [1, 'which', function () {
        var b = R.int(2, 10), d = R.int(0, 1) ? b : R.int(2, 10), a = R.int(1, b - 1), c = R.int(1, d - 1), same = b === d;
        var A1 = 'Add the tops and keep the bottom', A2 = 'Find a common denominator first', A3 = 'Add the tops and add the bottoms';
        var o = R.mc(same ? A1 : A2, [same ? A2 : A1, A3]);
        return { q: 'Which way? What is the right first step to add <span class="math">' + fr(a, b) + ' + ' + fr(c, d) + '</span>?', type: 'mc', options: o.options, answer: o.answer,
          hint: same ? 'Are the pieces already the same size?' : 'The pieces are different sizes.', steps: [same ? 'The bottoms match, so the pieces are the same size. Just add the tops.' : 'The bottoms are different. Rename both fractions with a common denominator first.'],
          explain: same ? 'Same bottoms: add the tops and keep the bottom.' : 'Different bottoms: find a common denominator, then add the tops.', meta: { k: 'fr-add-which', b: b, d: d } };
      }],
      [1, 'fill', function (lv) {
        var b, d; do { b = R.int(2, lv === 1 ? 6 : 10); d = R.int(2, lv === 1 ? 6 : 10); } while (b === d || lcm(b, d) > 30);
        var a = R.int(1, b - 1), c = R.int(1, d - 1), L = lcm(b, d);
        return { q: 'Fill in the blanks to add <span class="math">' + fr(a, b) + ' + ' + fr(c, d) + '</span>.', type: 'fill',
          fill: '<span class="math">' + fr(a, b) + ' = </span>[[]]<span class="math"> / ' + L + '</span><br><span class="math">' + fr(c, d) + ' = </span>[[]]<span class="math"> / ' + L + '</span><br><span class="math">' + fr(a, b) + ' + ' + fr(c, d) + ' = </span>[[]]<span class="math"> / ' + L + '</span>', answers: [a * L / b, c * L / d, a * L / b + c * L / d],
          hint: 'Rename each fraction with the bottom ' + L + '.', steps: [fr(a, b) + ' = ' + fr(a * L / b, L) + '.', fr(c, d) + ' = ' + fr(c * L / d, L) + '.', 'Add the tops.'],
          explain: fr(a * L / b, L) + ' + ' + fr(c * L / d, L) + ' = ' + fr(a * L / b + c * L / d, L) + '.', meta: { k: 'fr-add-fill', a: [a, b], c: [c, d], L: L } };
      }],
      [1, 'story', function (lv) {
        var two = K.two(), b, d; do { b = R.pick([2, 3, 4, 6, 8]); d = R.pick([2, 3, 4, 6, 8]); } while (lv > 1 && b === d);
        var a = R.int(1, b - 1), c = R.int(1, d - 1), L = lcm(b, d), N = a * L / b + c * L / d;
        var it = R.pick([['of a pizza', 'ate', 'How much of the pizza did they eat altogether?'], ['of the lawn', 'mowed', 'How much of the lawn did they mow altogether?'], ['of a hiking trail', 'walked', 'How much of the trail did they walk altogether?']]);
        return { q: two[0] + ' ' + it[1] + ' ' + fr(a, b) + ' ' + it[0] + ' and ' + two[1] + ' ' + it[1] + ' ' + fr(c, d) + '. ' + it[2] + ' Type a fraction.', type: 'num', answer: N / L, show: plain(N, L), kb: 'text', tol: 1e-6,
          hint: 'Add the two fractions. Use a common denominator.', steps: ['Common denominator: ' + L + '.', fr(a * L / b, L) + ' + ' + fr(c * L / d, L) + ' = ' + fr(N, L) + '.'],
          explain: 'Altogether: ' + frs(N, L) + '.', meta: { k: 'fr-add-story', a: [a, b], c: [c, d] } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), b, d; do { b = R.int(2, 6); d = R.int(2, 6); } while (b === d);
        var a = R.int(1, b - 1), c = R.int(1, d - 1), L = lcm(b, d), N = a * L / b + c * L / d, g = gcd(N, L), truth = R.int(0, 1), said = truth ? [N / g, L / g] : [a + c, b + d];
        var right = 'Use a common denominator: ' + fr(a * L / b, L) + ' + ' + fr(c * L / d, L) + ' = ' + frs(N, L) + '.';
        return { q: who + ' says <span class="math">' + fr(a, b) + ' + ' + fr(c, d) + ' = ' + fr(said[0], said[1]) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Add the tops and add the bottoms.', 'The answer must have the bigger of the two bottoms.']),
          hint: 'Is the answer bigger than each fraction on its own?', steps: [right], explain: right, meta: { k: 'fr-add-tf', a: [a, b], c: [c, d], said: said } };
      }]
    ],
    'fr-sub': [
      [1, 'which', function () {
        var who = K.name(), b, d, a, c;
        do { b = R.pick([2, 3, 4, 6, 8]); d = R.pick([2, 3, 4, 6, 8]); a = R.int(1, b - 1); c = R.int(1, d - 1); } while (a / b <= c / d || a / b + c / d > 1);
        var st = R.pick([
          ['sub', who + ' had ' + fr(a, b) + ' of a tank of gas, then used ' + fr(c, d) + ' of a tank. How much is left?'],
          ['add', who + ' painted ' + fr(a, b) + ' of a fence on Saturday and ' + fr(c, d) + ' of it on Sunday. How much is painted?'],
          ['sub', 'A jug holds ' + fr(a, b) + ' L of juice. ' + who + ' pours out ' + fr(c, d) + ' L. How much is in the jug now?'],
          ['add', who + ' read ' + fr(a, b) + ' of a book, then ' + fr(c, d) + ' of it more. How much has ' + who + ' read?']]);
        var o = R.mc(st[0] === 'sub' ? 'Subtract' : 'Add', [st[0] === 'sub' ? 'Add' : 'Subtract', 'Multiply', 'Divide']);
        return { q: 'Which way? ' + st[1] + ' Pick the operation.', type: 'mc', options: o.options, answer: o.answer,
          hint: st[0] === 'sub' ? 'Something is taken away.' : 'Two amounts are put together.', steps: [st[0] === 'sub' ? 'Taking away means subtract.' : 'Putting together means add.'],
          explain: (st[0] === 'sub' ? 'Subtract: ' + fr(a, b) + ' &minus; ' + fr(c, d) : 'Add: ' + fr(a, b) + ' + ' + fr(c, d)) + '.', meta: { k: 'fr-op-which', op: st[0] } };
      }],
      [1, 'fill', function (lv) {
        var b, d, a, c, L; do { b = R.int(2, lv === 1 ? 6 : 10); d = R.int(2, lv === 1 ? 6 : 10); a = R.int(1, b - 1); c = R.int(1, d - 1); L = lcm(b, d); } while (b === d || L > 30 || a / b <= c / d);
        return { q: 'Fill in the blanks to subtract <span class="math">' + fr(a, b) + ' &minus; ' + fr(c, d) + '</span>.', type: 'fill',
          fill: '<span class="math">' + fr(a, b) + ' = </span>[[]]<span class="math"> / ' + L + '</span><br><span class="math">' + fr(c, d) + ' = </span>[[]]<span class="math"> / ' + L + '</span><br><span class="math">' + fr(a, b) + ' &minus; ' + fr(c, d) + ' = </span>[[]]<span class="math"> / ' + L + '</span>', answers: [a * L / b, c * L / d, a * L / b - c * L / d],
          hint: 'Rename each fraction with the bottom ' + L + '.', steps: [fr(a, b) + ' = ' + fr(a * L / b, L) + '.', fr(c, d) + ' = ' + fr(c * L / d, L) + '.', 'Subtract the tops.'],
          explain: fr(a * L / b, L) + ' &minus; ' + fr(c * L / d, L) + ' = ' + fr(a * L / b - c * L / d, L) + '.', meta: { k: 'fr-sub-fill', a: [a, b], c: [c, d], L: L } };
      }],
      [1, 'story', function () {
        var who = K.name(), b, d, a, c; do { b = R.pick([2, 3, 4, 5, 6, 8]); d = R.pick([2, 3, 4, 6, 8, 10]); a = R.int(1, b - 1); c = R.int(1, d - 1); } while (a / b <= c / d);
        var L = lcm(b, d), N = a * L / b - c * L / d;
        var it = R.pick([['m of ribbon', 'cuts off'], ['L of milk', 'uses'], ['kg of flour', 'bakes with']]);
        return { q: who + ' has ' + fr(a, b) + ' ' + it[0] + ' and ' + it[1] + ' ' + fr(c, d) + ' ' + it[0].split(' ')[0] + '. How much is left? Type a fraction.', type: 'num', answer: N / L, show: plain(N, L), kb: 'text', tol: 1e-6,
          hint: 'Subtract. Use a common denominator.', steps: ['Common denominator: ' + L + '.', fr(a * L / b, L) + ' &minus; ' + fr(c * L / d, L) + ' = ' + fr(N, L) + '.'],
          explain: frs(N, L) + ' ' + it[0].split(' ')[0] + ' is left.', meta: { k: 'fr-sub-story', a: [a, b], c: [c, d] } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), b, d, a, c; do { b = R.int(2, 8); d = R.int(2, 8); a = R.int(1, b - 1); c = R.int(1, d - 1); } while (b === d || a / b <= c / d || a <= c || b <= d);
        var L = lcm(b, d), N = a * L / b - c * L / d, g = gcd(N, L), truth = R.int(0, 1), said = truth ? [N / g, L / g] : [a - c, b - d];
        var right = 'Use a common denominator: ' + fr(a * L / b, L) + ' &minus; ' + fr(c * L / d, L) + ' = ' + frs(N, L) + '.';
        return { q: who + ' says <span class="math">' + fr(a, b) + ' &minus; ' + fr(c, d) + ' = ' + fr(said[0], said[1]) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Subtract the tops and subtract the bottoms.', 'Keep the first bottom and subtract the tops.']),
          hint: 'Rename both with a common denominator, then check.', steps: [right], explain: right, meta: { k: 'fr-sub-tf', a: [a, b], c: [c, d], said: said } };
      }]
    ]
  });
  function f2(f) { return f[0] + '/' + f[1]; }
})();
