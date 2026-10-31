(function () {
  var A = Atlas, R = A.R, cl = A.clean;
  function dec(x) { x = cl(x); return x < 0 ? '&minus;' + (-x) : String(x); }
  function term(m, v) { return (m === 1 ? '' : dec(m)) + '<i>' + v + '</i>'; }
  function expr(m, c, v) { v = v || 'n'; return term(m, v) + (c ? (c > 0 ? ' + ' + dec(c) : ' &minus; ' + dec(-c)) : ''); }

  /* tile figures for a linear growing pattern: c tiles to start, plus m per term */
  function tiles(m, c, k) {
    var sz = 13, s = '', x = 6, maxH = 0, H;
    for (var n = 1; n <= k; n++) {
      var tot = c + m * n, cols = Math.max(1, Math.ceil(tot / 6)), w = cols * sz;
      for (var i = 0; i < tot; i++) {
        var col = Math.floor(i / 6), row = i % 6, isStart = i < c;
        s += '<rect x="' + (x + col * sz) + '" y="' + (6 + (5 - row) * sz) + '" width="' + (sz - 1.5) + '" height="' + (sz - 1.5) + '" style="fill:' + (isStart ? 'var(--se)' : 'var(--sb)') + '"/>';
      }
      s += '<text x="' + (x + w / 2) + '" y="112" text-anchor="middle" font-size="16">term ' + n + '</text><text x="' + (x + w / 2) + '" y="132" text-anchor="middle" font-size="17" font-weight="700">' + tot + '</text>';
      x += Math.max(w, 50) + 22;
    }
    return A.svg(Math.ceil(x), 140, s, 'Tile pattern: ' + c + ' starting tiles in orange, and ' + m + ' blue tiles added for each term. Terms: ' + Array.apply(null, Array(k)).map(function (_, i) { return c + m * (i + 1); }).join(', '));
  }
  /* points of a pattern on a graph */
  function pgraph(pats, k) {
    var W = 520, H = 250, x0 = 56, y0 = 210, top = 0, s = '';
    pats.forEach(function (p) { top = Math.max(top, p.c + p.m * k); });
    top = Math.ceil(top / 5) * 5 || 5;
    var sx = function (n) { return x0 + (W - x0 - 30) * n / k; }, sy = function (v) { return y0 - (y0 - 16) * v / top; };
    for (var i = 0; i <= 5; i++) { var gy = sy(top * i / 5); s += '<line x1="' + x0 + '" y1="' + gy + '" x2="' + (W - 20) + '" y2="' + gy + '" style="stroke:var(--line)"/><text x="' + (x0 - 8) + '" y="' + (gy + 5) + '" text-anchor="end" font-size="15">' + dec(top * i / 5) + '</text>'; }
    for (var n = 0; n <= k; n++) s += '<text x="' + sx(n) + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="15">' + n + '</text>';
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 20) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x0 + '" y1="14" x2="' + x0 + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + ((x0 + W) / 2) + '" y="' + (y0 + 40) + '" text-anchor="middle" font-size="15" class="t2">term number</text>';
    pats.forEach(function (p) {
      s += '<line x1="' + sx(0) + '" y1="' + sy(p.c) + '" x2="' + sx(k) + '" y2="' + sy(p.c + p.m * k) + '" style="stroke:' + p.col + '" stroke-width="1.5" stroke-dasharray="5 4"/>';
      for (var n = 0; n <= k; n++) s += '<circle cx="' + sx(n) + '" cy="' + sy(p.c + p.m * n) + '" r="' + (n ? 5 : 6) + '" style="fill:' + (n ? p.col : 'var(--card)') + ';stroke:' + p.col + '" stroke-width="2"/>';
      s += '<text x="' + (sx(k) + 4) + '" y="' + (sy(p.c + p.m * k) - 10) + '" text-anchor="end" font-size="16" font-weight="700" style="fill:' + p.col + '">' + p.lab + '</text>';
    });
    return A.svg(W, H + 10, s, pats.map(function (p) { return p.lab + ': initial value ' + p.c + ', rate ' + p.m; }).join('. '));
  }
  /* algebra tiles: a x-tiles and b unit tiles, red if negative */
  function atiles(a, b, v) {
    var s = '', x = 4;
    for (var i = 0; i < Math.abs(a); i++) { s += '<rect x="' + x + '" y="6" width="22" height="64" rx="3" style="fill:' + (a > 0 ? 'var(--sd)' : 'var(--bad)') + ';stroke:var(--ink)" stroke-width="1.5"/><text x="' + (x + 11) + '" y="44" text-anchor="middle" font-size="17" font-style="italic" font-weight="700" style="fill:#fff">' + (v || 'x') + '</text>'; x += 28; }
    if (a && b) x += 14;
    for (var j = 0; j < Math.abs(b); j++) { s += '<rect x="' + (x + (j % 2) * 24) + '" y="' + (6 + Math.floor(j / 2) * 0 + (j % 2 ? 0 : 0)) + '" width="20" height="20" rx="2" style="fill:' + (b > 0 ? 'var(--hi)' : 'var(--bad)') + ';stroke:var(--ink)" stroke-width="1.5" transform="translate(0,' + (Math.floor(j / 2) % 3 * 24) + ')"/>'; if (j % 6 === 5 || j === Math.abs(b) - 1) x += 50; }
    return A.svg(Math.max(60, x + 4), 78, s, Math.abs(a) + ' ' + (v || 'x') + '-tiles' + (b ? ' and ' + Math.abs(b) + ' unit tiles' : ''));
  }
  /* a balance: left has a boxes of x and b weights, right has c weights */
  function balance(a, b, c, label) {
    var s = '', W = 540;
    s += '<polygon points="270,170 250,200 290,200" style="fill:var(--ink2)"/><line x1="40" y1="170" x2="500" y2="170" style="stroke:var(--ink)" stroke-width="5"/>';
    s += '<line x1="40" y1="170" x2="40" y2="200" style="stroke:var(--ink)" stroke-width="2"/><line x1="500" y1="170" x2="500" y2="200" style="stroke:var(--ink)" stroke-width="2"/>';
    var x = 30;
    for (var i = 0; i < a; i++) { s += '<rect x="' + x + '" y="120" width="40" height="48" rx="4" style="fill:var(--sc);stroke:var(--ink)" stroke-width="1.5"/><text x="' + (x + 20) + '" y="152" text-anchor="middle" font-size="22" font-style="italic" font-weight="700" style="fill:#fff">x</text>'; x += 46; }
    var wb = String(dec(b)).length > 2 ? 64 : 46;
    if (b) { s += '<rect x="' + (x + 6) + '" y="128" width="' + wb + '" height="40" rx="20" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/><text x="' + (x + 6 + wb / 2) + '" y="155" text-anchor="middle" font-size="18" font-weight="700" style="fill:#24201d">' + dec(b) + '</text>'; }
    var wc = String(dec(c)).length > 2 ? 72 : 56;
    s += '<rect x="' + (470 - wc + 30) + '" y="122" width="' + wc + '" height="46" rx="23" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/><text x="' + (470 + 30 - wc / 2) + '" y="152" text-anchor="middle" font-size="20" font-weight="700" style="fill:#24201d">' + dec(c) + '</text>';
    s += '<text x="270" y="40" text-anchor="middle" font-size="22" font-weight="700">' + (label || (a > 1 ? a : '') + 'x' + (b ? ' + ' + dec(b) : '') + ' = ' + dec(c)) + '</text>';
    return A.svg(W, 206, s, 'A balance. Left: ' + a + ' boxes of x' + (b ? ' and ' + b : '') + '. Right: ' + c + '. Both sides weigh the same.');
  }
  /* inequality on a number line: x < v, x <= v, x > v or x >= v */
  function ineqLine(op, v, lo, hi) {
    lo = lo === undefined ? v - 6 : lo; hi = hi === undefined ? v + 6 : hi;
    var W = 540, sc = function (t) { return 26 + 488 * (t - lo) / (hi - lo); }, s = '', right = op.charAt(0) === '>', closed = op.length > 1;
    s += '<line x1="20" y1="40" x2="520" y2="40" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var t = lo; t <= hi; t++) s += '<line x1="' + sc(t) + '" y1="32" x2="' + sc(t) + '" y2="48" style="stroke:var(--ink)" stroke-width="1.5"/><text x="' + sc(t) + '" y="72" text-anchor="middle" font-size="16">' + dec(t) + '</text>';
    s += '<defs><marker id="iqa" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--se)"/></marker></defs>';
    s += '<line x1="' + sc(v) + '" y1="40" x2="' + (right ? 510 : 30) + '" y2="40" style="stroke:var(--se)" stroke-width="6" marker-end="url(#iqa)"/>';
    s += '<circle cx="' + sc(v) + '" cy="40" r="9" style="fill:' + (closed ? 'var(--se)' : 'var(--card)') + ';stroke:var(--se)" stroke-width="3"/>';
    return A.svg(W, 80, s, 'Number line: x ' + { '<': 'less than', '<=': 'less than or equal to', '>': 'greater than', '>=': 'greater than or equal to' }[op] + ' ' + v + '. ' + (closed ? 'Closed' : 'Open') + ' dot at ' + v + '.');
  }
  var OPS = { '<': '&lt;', '<=': '&le;', '>': '&gt;', '>=': '&ge;' };

  /* tiny code runner for the coding section */
  function runCode(start, step, times) {
    var rows = [], total = start;
    for (var i = 1; i <= times; i++) { total = cl(total + step); rows.push([i, total]); }
    return rows;
  }

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    pgmo: { title: 'build and compare two patterns', html: 
      '<div class="ctrl"><label for="pgm">Pattern A rate: <output id="pgmo"></output><input type="range" id="pgm" min="1" max="6" value="2"></label><label for="pgc">Pattern A initial value: <output id="pgco"></output><input type="range" id="pgc" min="0" max="10" value="3"></label></div>' +
      '<div class="ctrl"><label for="pgm2">Pattern B rate: <output id="pgm2o"></output><input type="range" id="pgm2" min="1" max="6" value="4"></label><label for="pgc2">Pattern B initial value: <output id="pgc2o"></output><input type="range" id="pgc2" min="0" max="10" value="0"></label></div>' +
      '<div class="fig" id="pgtiles"></div><div class="fig" id="pggraph"></div><div class="out" id="pgout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['pgm', 'pgc', 'pgm2', 'pgc2'], function () {
          var m = +$('#pgm', root).value, c = +$('#pgc', root).value, m2 = +$('#pgm2', root).value, c2 = +$('#pgc2', root).value;
          $('#pgmo', root).textContent = m; $('#pgco', root).textContent = c; $('#pgm2o', root).textContent = m2; $('#pgc2o', root).textContent = c2;
          $('#pgtiles', root).innerHTML = '<p class="t2" style="margin:0">Pattern A</p>' + tiles(m, c, 4);
          $('#pggraph', root).innerHTML = pgraph([{ m: m, c: c, col: 'var(--sb)', lab: 'A: ' + m + 'n + ' + c }, { m: m2, c: c2, col: 'var(--se)', lab: 'B: ' + m2 + 'n + ' + c2 }], 8);
          var meet = m === m2 ? null : (c2 - c) / (m - m2), msg;
          if (m === m2) msg = c === c2 ? 'They are the same pattern.' : 'Same rate, so they never meet. ' + (c > c2 ? 'A' : 'B') + ' stays ' + Math.abs(c - c2) + ' ahead.';
          else if (meet < 0) msg = (c >= c2 && m > m2 ? 'A' : 'B') + ' is ahead from the start and grows faster, so it stays ahead.';
          else if (meet === 0) msg = 'They start together, then ' + (m > m2 ? 'A' : 'B') + ' pulls ahead.';
          else msg = (Math.abs(meet - Math.round(meet)) < 1e-9 ? 'They are equal at term ' + meet + '.' : 'They cross between term ' + Math.floor(meet) + ' and term ' + Math.ceil(meet) + '.') + ' After that, ' + (m > m2 ? 'A' : 'B') + ' is bigger because it grows faster.';
          $('#pgout', root).innerHTML = '<p><b>A:</b> ' + expr(m, c) + ' &nbsp; <b>B:</b> ' + expr(m2, c2) + '</p><p>' + msg + '</p>';
        });
      } },
    ltao: { title: 'combine tiles', html: 
      '<div class="ctrl"><label for="lta">First: <output id="ltao"></output><input type="range" id="lta" min="1" max="9" value="6"></label><label for="ltop">Operation<select id="ltop"><option value="1">+</option><option value="-1" selected>&minus;</option></select></label><label for="ltb">Second: <output id="ltbo"></output><input type="range" id="ltb" min="1" max="9" value="2"></label></div>' +
      '<div class="fig" id="ltfig"></div><div class="out" id="ltout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['lta', 'ltop', 'ltb'], function () {
          var a = +$('#lta', root).value, op = +$('#ltop', root).value, b = +$('#ltb', root).value, r = a + op * b;
          $('#ltao', root).innerHTML = a + '<i>x</i>'; $('#ltbo', root).innerHTML = b + '<i>x</i>';
          $('#ltfig', root).innerHTML = '<div class="vrow"><figure><figcaption>' + a + '<i>x</i></figcaption>' + atiles(a, 0) + '</figure><figure><figcaption>' + (op > 0 ? '+ ' : '&minus; ') + b + '<i>x</i></figcaption>' + atiles(op * b, 0) + '</figure><figure><figcaption>= ' + (r === 0 ? '0' : r === 1 ? '<i>x</i>' : r === -1 ? '&minus;<i>x</i>' : dec(r) + '<i>x</i>') + '</figcaption>' + (r ? atiles(r, 0) : '<p class="t2">(nothing left)</p>') + '</figure></div>';
          $('#ltout', root).innerHTML = '<p class="big2">' + a + '<i>x</i> ' + (op > 0 ? '+' : '&minus;') + ' ' + b + '<i>x</i> = ' + (r === 1 ? '' : r === -1 ? '&minus;' : dec(r)) + (r ? '<i>x</i>' : '') + '</p>' + (op < 0 && b > a ? '<p>Red tiles are negative: you took away more than you had.</p>' : '');
        });
      } },
    evx: { title: 'change the value of n', html: 
      '<div class="ctrl"><label for="evx">Expression<select id="evx"><option value="3,2">3n + 2</option><option value="2.5,1">2.5n + 1</option><option value="4,-3" selected>4n &minus; 3</option><option value="0.5,6">0.5n + 6</option></select></label><label for="evn"><i>n</i> = <output id="evno"></output><input type="range" id="evn" min="0" max="12" step="0.5" value="5"></label></div>' +
      '<div class="out" id="evout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['evx', 'evn'], function () {
          var p = $('#evx', root).value.split(',').map(Number), n = +$('#evn', root).value, v = cl(p[0] * n + p[1]);
          $('#evno', root).textContent = dec(n);
          $('#evout', root).innerHTML = '<p class="big2">' + expr(p[0], p[1]) + '</p><p class="big2">= ' + dec(p[0]) + ' &times; ' + dec(n) + (p[1] > 0 ? ' + ' + p[1] : ' &minus; ' + (-p[1])) + ' = ' + dec(p[0] * n) + (p[1] > 0 ? ' + ' + p[1] : ' &minus; ' + (-p[1])) + ' = ' + dec(v) + '</p>';
        });
      } },
    eqao: { title: 'balance and solve', html: 
      '<div class="ctrl"><label for="eqa">Boxes of x: <output id="eqao"></output><input type="range" id="eqa" min="1" max="5" value="2"></label><label for="eqx">Secret x: <output id="eqxo"></output><input type="range" id="eqx" min="1" max="12" value="7"></label><label for="eqb">Extra weight: <output id="eqbo"></output><input type="range" id="eqb" min="0" max="15" value="5"></label></div>' +
      '<div class="fig" id="eqfig"></div><div class="btnrow"><button type="button" class="btn" id="eqgo">Show the steps</button></div><div class="out" id="eqout"></div>',
      init: function (root) {
        var $ = A.$;
        function eq() {
          var a = +$('#eqa', root).value, x = +$('#eqx', root).value, b = +$('#eqb', root).value, c = a * x + b;
          $('#eqao', root).textContent = a; $('#eqxo', root).textContent = x; $('#eqbo', root).textContent = b;
          $('#eqfig', root).innerHTML = balance(a, b, c);
          $('#eqout', root).innerHTML = '<p>Can you find <i>x</i> before you look?</p>';
          return { a: a, b: b, c: c, x: x };
        }
        A.bind(root, ['eqa', 'eqx', 'eqb'], eq);
        $('#eqgo', root).addEventListener('click', function () {
          var e = eq(), st = [];
          if (e.b) st.push('Take ' + e.b + ' off both sides: ' + (e.a > 1 ? e.a : '') + '<i>x</i> = ' + e.c + ' &minus; ' + e.b + ' = ' + (e.c - e.b) + '.');
          if (e.a > 1) st.push('Split both sides into ' + e.a + ' equal groups: <i>x</i> = ' + (e.c - e.b) + ' &divide; ' + e.a + ' = ' + e.x + '.');
          st.push('Check: ' + (e.a > 1 ? e.a + ' &times; ' : '') + e.x + (e.b ? ' + ' + e.b : '') + ' = ' + e.c + '. It balances.');
          $('#eqout', root).innerHTML = '<ol>' + st.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol><p class="big2"><i>x</i> = ' + e.x + '</p>';
        });
      } },
    iqop: { title: 'graph an inequality', html: 
      '<div class="ctrl"><label for="iqop">x is<select id="iqop"><option value="<">less than (&lt;)</option><option value="<=">less than or equal (&le;)</option><option value=">" selected>greater than (&gt;)</option><option value=">=">greater than or equal (&ge;)</option></select></label><label for="iqv">this number: <output id="iqvo"></output><input type="range" id="iqv" min="-5" max="10" value="2"></label></div>' +
      '<div class="fig" id="iqfig"></div><div class="out" id="iqout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['iqop', 'iqv'], function () {
          var op = $('#iqop', root).value, v = +$('#iqv', root).value;
          $('#iqvo', root).textContent = dec(v);
          $('#iqfig', root).innerHTML = ineqLine(op, v);
          var whole = [];
          for (var t = v - 3; t <= v + 3; t++) { var ok = op === '<' ? t < v : op === '<=' ? t <= v : op === '>' ? t > v : t >= v; if (ok) whole.push(dec(t)); }
          $('#iqout', root).innerHTML = '<p class="big2"><i>x</i> ' + OPS[op] + ' ' + dec(v) + '</p><p>' + (op.length > 1 ? 'Closed dot: ' + dec(v) + ' is a solution.' : 'Open dot: ' + dec(v) + ' is not a solution.') + ' Some integer solutions: ' + whole.join(', ') + ', ...</p>';
        });
      } },
    cdso: { title: 'change the code and run it', html: 
      '<div class="ctrl"><label for="cds">total = <output id="cdso"></output><input type="range" id="cds" min="0" max="20" value="4"></label><label for="cdr">repeat ___ times: <output id="cdro"></output><input type="range" id="cdr" min="1" max="10" value="4"></label><label for="cdp">total = total + <output id="cdpo"></output><input type="range" id="cdp" min="-5" max="10" step="0.5" value="3"></label></div>' +
      '<span class="mono" id="cdcode"></span><div class="out" id="cdout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['cds', 'cdr', 'cdp'], function () {
          var s0 = +$('#cds', root).value, r = +$('#cdr', root).value, p = +$('#cdp', root).value, rows = runCode(s0, p, r);
          $('#cdso', root).textContent = s0; $('#cdro', root).textContent = r; $('#cdpo', root).textContent = dec(p);
          $('#cdcode', root).innerHTML = 'total = ' + s0 + '\nrepeat ' + r + ' times:\n    total = total ' + (p < 0 ? '&minus; ' + dec(-p) : '+ ' + dec(p)) + '\nshow total';
          $('#cdout', root).innerHTML = '<div class="tbl"><table><thead><tr><th>Time through the loop</th>' + rows.map(function (x) { return '<th>' + x[0] + '</th>'; }).join('') + '</tr></thead><tbody><tr><td>total</td>' + rows.map(function (x) { return '<td>' + dec(x[1]) + '</td>'; }).join('') + '</tr></tbody></table></div>' +
            '<p>The code shows <b class="big2">' + dec(rows[rows.length - 1][1]) + '</b>. That is ' + s0 + ' + ' + r + ' &times; ' + (p < 0 ? '(' + dec(p) + ')' : dec(p)) + '.</p>';
        });
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  function mono(t) { return '<span class="mono">' + t + '</span>'; }
  function addx(t, k, s, n) { var p = Promise.resolve(); for (var i = 0; i < n; i++) p = p.then(function () { return t.add(k, s); }); return p; }

  var LESSONS = [
    { id: 'patterns', title: 'Linear growing patterns', sub: 'The same amount added each time.', concepts: [
      { id: 'rate', title: 'Rate and initial value', exp: ['C1.1', 'C1.3'], skill: 'al-pattern',
        body: '<p>In a <b>linear growing pattern</b> the same amount is added each time: the <b>constant rate</b>. The value before the first term, at term 0, is the <b>initial value</b>.</p>',
        watch: K.slides([
          { say: 'Term 1 has 3 orange tiles and 2 blue tiles.', fig: function () { return tiles(2, 3, 1); } },
          { say: 'Each new term adds 2 more blue tiles.', fig: function () { return tiles(2, 3, 2); } },
          { say: 'The orange 3 never change. That is the initial value.', fig: function () { return tiles(2, 3, 4); } },
          { say: 'Rate: 2 each term. Initial value: 3.', fig: function () { return pgraph([{ m: 2, c: 3, col: 'var(--sc)', lab: '2n + 3' }], 6); }, ms: 2600 }
        ]),
        try: lab('pgmo', [
          { do: 'Make pattern A <b>start at 5</b> and <b>grow by 3</b>.', goal: function (h) { return K.v(h, 'pgm') === 3 && K.v(h, 'pgc') === 5; }, yes: 'Rule: 3n + 5.' },
          { do: 'Make A and B <b>equal at term 2</b>.', goal: function (h) { return K.v(h, 'pgm') * 2 + K.v(h, 'pgc') === K.v(h, 'pgm2') * 2 + K.v(h, 'pgc2') && K.v(h, 'pgm') !== K.v(h, 'pgm2'); }, yes: 'The lines cross at term 2.' }
        ]),
        key: '<p><b>Rate: what is added each time. Initial value: where it starts, at term 0.</b></p>',
        mistake: '<p>Taking term 1 as the initial value. Term 1 is 5 tiles, but the initial value is 3: go back one step.</p>',
        check: [K.ck('al-pattern', 1), K.ck('al-pattern', 1)] },
      { id: 'rule', title: 'The pattern rule', exp: ['C1.3'], skill: 'al-pattern', hard: true,
        body: '<p>The rule is <span class="math">rate &times; <i>n</i> + initial value</span>, where <i>n</i> is the term number. The pattern above is ' + expr(2, 3) + '.</p>',
        watch: K.slides([
          { say: 'Rule: 2n + 3. Term 10: replace n with 10.', fig: eq('2 &times; 10 + 3 = <b>23</b>') },
          { say: 'Which term has 51 tiles? Write the equation.', fig: eq('2<i>n</i> + 3 = 51') },
          { say: 'Take 3 away: 2n = 48. Divide by 2: n = 24.', fig: eq('2<i>n</i> = 48 &nbsp; <i>n</i> = 24') },
          { say: 'Term <b>24</b> has 51 tiles.', fig: eq('2 &times; 24 + 3 = 51 &#10003;'), ms: 2400 }
        ]),
        ways: [
          { label: 'Use a table', html: '<div class="tbl"><table><tbody><tr><td class="l">term <i>n</i></td><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><td class="l">tiles</td><td>3</td><td>5</td><td>7</td><td>9</td></tr></tbody></table></div><p>Going across, it adds 2 each time (the rate). At term 0 it is 3 (the initial value). So the rule is 2<i>n</i> + 3.</p>' },
          { label: 'Picture the tiles', html: '<div class="fig">' + tiles(2, 3, 3) + '</div><p>Every term has the 3 orange tiles, plus 2 blue tiles for each term number: 2<i>n</i> + 3.</p>' }
        ],
        key: '<p><b>Term = rate &times; <i>n</i> + initial value.</b></p>',
        mistake: '<p>Writing the rule as <i>n</i> + 2 (counting up by 2 from term 1). Check the rule against two terms before using it.</p>',
        check: [function () { return { q: 'A pattern has the rule 5<i>n</i> + 2. What is term 8?', type: 'num', answer: 42, hint: 'Replace <i>n</i> with 8.', explain: '5 &times; 8 + 2 = 42.' }; }, K.ck('al-pattern', 2), K.ck('al-pattern', 3)] },
      { id: 'compare', title: 'Compare two patterns', exp: ['C1.3'], skill: 'al-pattern',
        body: '<p>On a graph, the <b>rate</b> is how steep the line is and the <b>initial value</b> is where it starts. A steeper pattern always catches up in the end.</p>',
        watch: K.slides([
          { say: 'A starts at 8 and grows by 2. B starts at 2 and grows by 4.', fig: function () { return pgraph([{ m: 2, c: 8, col: 'var(--sb)', lab: 'A: 2n + 8' }, { m: 4, c: 2, col: 'var(--se)', lab: 'B: 4n + 2' }], 6); } },
          { say: 'At term 3 they are equal: 14 and 14.', fig: eq('2 &times; 3 + 8 = 14 &nbsp; 4 &times; 3 + 2 = 14') },
          { say: 'After that, B is bigger, because it grows faster.', fig: function () { return pgraph([{ m: 2, c: 8, col: 'var(--sb)', lab: 'A: 2n + 8' }, { m: 4, c: 2, col: 'var(--se)', lab: 'B: 4n + 2' }], 6); }, ms: 2400 }
        ]),
        key: '<p><b>Bigger start wins early. Bigger rate wins in the end.</b></p>',
        mistake: '<p>Deciding which is bigger from the first term only. Ask what happens at term 10 or 100.</p>',
        check: [function () { return mc('Pattern A: 3<i>n</i> + 10. Pattern B: 5<i>n</i>. Which is bigger at term 20?', 'B', ['A', 'They are equal'], 'Work out both at <i>n</i> = 20.', 'A: 70. B: 100.'); }] }
    ] },
    { id: 'like', title: 'Like terms', sub: 'Add apples to apples.', concepts: [
      { id: 'combine', title: 'Combine like terms', exp: ['C2.1'], skill: 'al-like',
        body: '<p>A <b>variable</b> is a letter that stands for a number. <b>Like terms</b> have the same variable. You can add or subtract them: 3<i>x</i> + 2<i>x</i> = 5<i>x</i>.</p>',
        watch: { tool: 'tiles', opts: {}, steps: [
          { say: '3<i>x</i>: three <i>x</i>-tiles.', act: function (t) { return addx(t, 'x', 1, 3); }, ms: 700 },
          { say: 'Plus 2<i>x</i>: two more.', act: function (t) { return addx(t, 'x', 1, 2); }, ms: 700 },
          { say: 'Altogether, 5<i>x</i>.', act: null, ms: 1200 },
          { say: 'Add 4 unit tiles. They are not <i>x</i>-tiles, so they stay separate: 5<i>x</i> + 4.', act: function (t) { return addx(t, 'one', 1, 4); }, ms: 2400 }
        ] },
        try: { tool: 'tiles', opts: {}, tasks: [
          { do: 'Build <b>4<i>x</i> + 3</b>.', goal: function (s) { return s.x === 4 && s.one === 3; }, yes: '4 <i>x</i>-tiles and 3 unit tiles. They cannot be combined.' },
          { do: 'Now take away 1 <i>x</i>-tile. What is left?', reset: false, goal: function (s) { return s.x === 3 && s.one === 3; }, yes: '3<i>x</i> + 3.' }
        ] },
        ways: [
          { label: 'Apples and bananas', html: '<p>3 apples + 2 apples = 5 apples. But 3 apples + 4 bananas stays 3 apples + 4 bananas. In the same way, 3<i>x</i> + 4 cannot become 7<i>x</i>.</p>' },
          { label: 'Try a number', html: '<p>Let <i>x</i> = 10. 3<i>x</i> + 2<i>x</i> = 30 + 20 = 50, and 5<i>x</i> = 50. It matches.</p>' }
        ],
        hard: true,
        key: '<p><b>Only like terms combine.</b> Add or subtract the numbers in front; keep the variable.</p>',
        mistake: '<p>Combining unlike terms (4<i>a</i> + 7 = 11<i>a</i>) or multiplying the variables (3<i>x</i> + 2<i>x</i> = 5<i>x</i><sup>2</sup>).</p>',
        check: [K.ck('al-like', 1), K.ck('al-like', 1)] },
      { id: 'lone', title: 'Subtract like terms', exp: ['C2.1'], skill: 'al-like',
        body: '<p>Subtracting works the same way. 6<i>x</i> &minus; 2<i>x</i> = 4<i>x</i>. A lone <i>x</i> means <b>1<i>x</i></b>.</p>',
        watch: K.slides([
          { say: '6<i>x</i> take away 2<i>x</i>.', fig: function () { return atiles(6, 0); } },
          { say: 'Take 2 tiles away: 4 are left.', fig: function () { return atiles(4, 0); } },
          { say: '5<i>x</i> &minus; <i>x</i>: the lone <i>x</i> is one tile. 4<i>x</i> are left, not 5.', fig: eq('5<i>x</i> &minus; <i>x</i> = 4<i>x</i>'), ms: 2600 }
        ]),
        try: lab('ltao', [
          { do: 'Show <b>5<i>x</i> &minus; 1<i>x</i></b>.', goal: function (h) { return K.v(h, 'lta') === 5 && K.v(h, 'ltop') === -1 && K.v(h, 'ltb') === 1; }, yes: '5<i>x</i> − <i>x</i> = 4<i>x</i>.' },
          { do: 'Make the answer <b>zero</b>.', goal: function (h) { return K.v(h, 'ltop') === -1 && K.v(h, 'lta') === K.v(h, 'ltb'); }, yes: 'Anything minus itself is 0.' }
        ]),
        key: '<p><b><i>x</i> means 1<i>x</i>.</b> Subtract the numbers in front.</p>',
        mistake: '<p>5<i>x</i> &minus; <i>x</i> = 5: the lone <i>x</i> taken as nothing, or the <i>x</i> dropped.</p>',
        check: [function () { return { q: 'Simplify 9<i>y</i> &minus; 4<i>y</i>. How many <i>y</i> are left? (Type the number in front of <i>y</i>.)', type: 'num', answer: 5, hint: '9 of something take away 4 of the same thing.', explain: '9<i>y</i> &minus; 4<i>y</i> = 5<i>y</i>.' }; }, K.ck('al-like', 2), K.ck('al-like', 3)] }
    ] },
    { id: 'eval', title: 'Evaluating expressions', sub: 'Replace the variable with a number.', concepts: [
      { id: 'sub', title: 'Replace the variable', exp: ['C2.2'], skill: 'al-eval',
        body: '<p>To <b>evaluate</b> an expression, replace the variable with its value. 3<i>n</i> means 3 &times; <i>n</i>, so write the times sign.</p>',
        watch: K.slides([
          { say: 'Evaluate 4n &minus; 2.5 when n = 3.', fig: eq('4<i>n</i> &minus; 2.5, &nbsp; <i>n</i> = 3') },
          { say: 'Replace n with 3, and write the times sign.', fig: eq('4 &times; 3 &minus; 2.5') },
          { say: 'Multiply first: 12. Then subtract: <b>9.5</b>.', fig: eq('12 &minus; 2.5 = 9.5'), ms: 2400 }
        ]),
        try: lab('evx', [
          { do: 'Evaluate <b>3n + 2</b> when <b>n = 4</b>.', goal: function (h) { return K.v(h, 'evx') === '3,2' && K.v(h, 'evn') === 4; }, yes: '3 × 4 + 2 = 14.' },
          { do: 'Find a value of n that makes <b>4n &minus; 3</b> equal <b>17</b>.', goal: function (h) { return K.v(h, 'evx') === '4,-3' && K.v(h, 'evn') === 5; }, yes: '4 × 5 − 3 = 17.' }
        ]),
        key: '<p><b>Replace, write the times sign, then use BEDMAS.</b></p>',
        mistake: '<p>3<i>n</i> with <i>n</i> = 4 written as 34. Insist on "3 &times; 4".</p>',
        check: [function () { return { q: 'Evaluate 6 + 2<i>k</i> when <i>k</i> = 1.5.', type: 'num', answer: 9, hint: 'Multiply first: 2 &times; 1.5.', explain: '2 &times; 1.5 = 3, and 6 + 3 = 9.' }; }, K.ck('al-eval', 1), K.ck('al-eval', 2)] }
    ] },
    { id: 'solve', title: 'Solving equations', sub: 'Keep the balance.', concepts: [
      { id: 'balance', title: 'An equation is a balance', exp: ['C2.3'], skill: 'al-solve', hard: true,
        body: '<p>An <b>equation</b> is like a balance: both sides weigh the same. Do the <b>same thing to both sides</b> until <i>x</i> is alone.</p>',
        watch: K.slides([
          { say: '3 boxes of x and a 4 on the left. 19 on the right. It balances.', fig: function () { return balance(3, 4, 19); } },
          { say: 'Take 4 off both sides. Still balanced: 3 boxes weigh 15.', fig: function () { return balance(3, 0, 15, '3x = 15'); } },
          { say: 'Split both sides into 3 equal groups: one box weighs 5.', fig: function () { return balance(1, 0, 5, 'x = 5'); } },
          { say: 'Check: 3 &times; 5 + 4 = 19. It balances.', fig: eq('3 &times; 5 + 4 = 19 &#10003;'), ms: 2400 }
        ]),
        try: lab('eqao', [
          { do: 'Set up <b>2x + 5 = 19</b>, then press <b>Show the steps</b>.', goal: function (h) { return K.v(h, 'eqa') === 2 && K.v(h, 'eqb') === 5 && K.v(h, 'eqx') === 7 && /x = 7|x<\/i> = 7/.test(h.querySelector('#eqout').innerHTML); }, yes: 'Take 5 off: 2x = 14. Split in 2: x = 7.' },
          { do: 'Make a balance where <b>x = 12</b> and there are <b>4 boxes</b>. Solve it in your head first.', goal: function (h) { return K.v(h, 'eqa') === 4 && K.v(h, 'eqx') === 12; }, yes: 'Undo the adding, then undo the multiplying.' }
        ]),
        ways: [
          { label: 'Undo in reverse', html: '<p>Think of what happened to <i>x</i>: it was multiplied by 3, then 4 was added, giving 19. Undo in reverse order: subtract 4 (15), then divide by 3 (5).</p>' },
          { label: 'Guess and check', html: '<p>Try <i>x</i> = 4: 3 &times; 4 + 4 = 16, too small. Try 5: 19. Found it. Good for checking, but slow for bigger numbers.</p>' },
          { label: 'Cover up', html: '<p>3<i>x</i> + 4 = 19. Cover 3<i>x</i>: what plus 4 is 19? 15. So 3<i>x</i> = 15. What times 3 is 15? 5.</p>' }
        ],
        key: '<p><b>Same to both sides. Undo adding first, then undo multiplying. Check.</b></p>',
        mistake: '<p>Doing something to one side only (3<i>x</i> = 19 &minus; 4 is fine, but 3<i>x</i> + 4 &minus; 4 = 19 forgets the right side). Always check by substituting.</p>',
        check: [function () { return { q: 'Solve: 5<i>x</i> &minus; 3 = 27. What is <i>x</i>?', type: 'num', answer: 6, hint: 'Add 3 to both sides first.', explain: '5<i>x</i> = 30, so <i>x</i> = 6.' }; }, K.ck('al-solve', 1), K.ck('al-solve', 2)] },
      { id: 'more', title: 'Combine first, then solve', exp: ['C2.3'], skill: 'al-solve',
        body: '<p>If an equation has <b>more than one <i>x</i> term</b>, combine like terms first. Decimals work the same way.</p>',
        watch: K.slides([
          { say: '2x + 3 + x = 18. There are two x terms.', fig: eq('2<i>x</i> + 3 + <i>x</i> = 18') },
          { say: 'Combine them: 3x + 3 = 18.', fig: eq('3<i>x</i> + 3 = 18') },
          { say: 'Take 3 off both sides: 3x = 15. Divide by 3: x = 5.', fig: eq('3<i>x</i> = 15 &nbsp; <i>x</i> = 5') },
          { say: 'With decimals: 2x + 1.5 = 9.5 gives 2x = 8, so x = 4.', fig: eq('2<i>x</i> + 1.5 = 9.5 &rarr; <i>x</i> = 4'), ms: 2600 }
        ]),
        key: '<p><b>Tidy up (combine like terms), then solve.</b></p>',
        mistake: '<p>Forgetting the lone <i>x</i> when combining: 2<i>x</i> + <i>x</i> = 2<i>x</i>.</p>',
        check: [function () { return { q: 'Solve: 2<i>x</i> + 4 + 2<i>x</i> = 24. What is <i>x</i>?', type: 'num', answer: 5, hint: 'Combine: 4<i>x</i> + 4 = 24.', explain: '4<i>x</i> = 20, so <i>x</i> = 5.' }; }, K.ck('al-solve', 3)] }
    ] },
    { id: 'ineq', title: 'Inequalities', sub: 'Many solutions at once.', concepts: [
      { id: 'symbols', title: 'Show it on a number line', exp: ['C2.4'], skill: 'al-ineq',
        body: '<p>An <b>inequality</b> says one side is bigger or smaller. It has many solutions, so we show them on a number line. An <b>open dot</b> leaves the number out; a <b>closed dot</b> includes it.</p>',
        watch: K.slides([
          { say: 'x &gt; 2: every number bigger than 2. The open dot means 2 itself is not included.', fig: function () { return ineqLine('>', 2); } },
          { say: 'x &ge; 2: now 2 is included. The dot is closed.', fig: function () { return ineqLine('>=', 2); } },
          { say: 'x &lt; &minus;1: everything to the left of &minus;1.', fig: function () { return ineqLine('<', -1); }, ms: 2400 }
        ]),
        try: lab('iqop', [
          { do: 'Graph <b><i>x</i> &le; 4</b>.', goal: function (h) { return K.v(h, 'iqop') === '<=' && K.v(h, 'iqv') === 4; }, yes: 'Closed dot at 4, arrow to the left.' },
          { do: 'Graph an inequality where <b>0 is not a solution</b> but <b>1 is</b>.', goal: function (h) { var op = K.v(h, 'iqop'), v = K.v(h, 'iqv'), t = function (x) { return op === '<' ? x < v : op === '<=' ? x <= v : op === '>' ? x > v : x >= v; }; return !t(0) && t(1); }, yes: 'For example x > 0 or x ≥ 1.' }
        ]),
        key: '<p><b>Open dot: not included (&lt;, &gt;). Closed dot: included (&le;, &ge;).</b></p>',
        mistake: '<p>Mixing up the dots, or pointing the arrow the wrong way. Read it aloud: "x is greater than 2" means to the right.</p>',
        check: [K.ck('al-ineq', 1), K.ck('al-ineq', 1)] },
      { id: 'solveit', title: 'Solve an inequality', exp: ['C2.4'], skill: 'al-ineq', hard: true,
        body: '<p>Solve an inequality <b>like an equation</b>: do the same to both sides. Then check one value that works and one that does not.</p>',
        watch: K.slides([
          { say: 'You have $20. Tickets cost $6 and the bus costs $2. How many tickets?', fig: eq('6<i>t</i> + 2 &le; 20') },
          { say: 'Take 2 off both sides: 6t &le; 18.', fig: eq('6<i>t</i> &le; 18') },
          { say: 'Divide by 6: t &le; 3.', fig: function () { return ineqLine('<=', 3, -1, 8); } },
          { say: 'Check: t = 3 costs $20, fine. t = 4 costs $26, too much. You can buy 0 to 3 tickets.', fig: eq('<i>t</i> = 3: 20 &le; 20 &#10003; &nbsp; <i>t</i> = 4: 26 &le; 20 &#10007;'), ms: 3000 }
        ]),
        ways: [
          { label: 'Solve the equation first', html: '<p>Pretend it is 6<i>t</i> + 2 = 20: <i>t</i> = 3. Then ask: do bigger or smaller values work? Smaller ones cost less, so <i>t</i> &le; 3.</p>' },
          { label: 'Make a table', html: '<div class="tbl"><table><tbody><tr><td class="l"><i>t</i></td><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><td class="l">6<i>t</i> + 2</td><td>8</td><td>14</td><td>20</td><td>26</td></tr><tr><td class="l">&le; 20?</td><td>yes</td><td>yes</td><td>yes</td><td>no</td></tr></tbody></table></div>' }
        ],
        key: '<p><b>Solve like an equation, then test a value on each side.</b></p>',
        mistake: '<p>Treating the answer as one number (<i>t</i> = 3) instead of a range of values.</p>',
        check: [function () { return mc('Which value is a solution of 2<i>x</i> + 1 &gt; 9?', '5', ['2', '4', '0'], 'Solve: 2<i>x</i> &gt; 8, so <i>x</i> &gt; 4. Is 4 itself included?', '<i>x</i> &gt; 4, so 5 works. 4 does not: 9 &gt; 9 is false.'); }, K.ck('al-ineq', 2), K.ck('al-ineq', 3)] }
    ] },
    { id: 'code', title: 'Reading and changing code', sub: 'Loops and sub-programs.', concepts: [
      { id: 'loop', title: 'Loops', exp: ['C3.1', 'C3.2'], skill: 'al-code',
        body: '<p>Code is a list of instructions followed in order. A <b>loop</b> repeats instructions a set number of times. Loops make code shorter and easier to change.</p>',
        watch: K.slides([
          { say: 'Without a loop: add 3, four times. Long and repetitive.', fig: mono('total = 4\ntotal = total + 3\ntotal = total + 3\ntotal = total + 3\ntotal = total + 3\nshow total') },
          { say: 'With a loop: the same thing in 3 lines.', fig: mono('total = 4\nrepeat 4 times:\n    total = total + 3\nshow total') },
          { say: 'Trace it: 4, then 7, 10, 13, 16. It shows 16.', fig: eq('4 &rarr; 7 &rarr; 10 &rarr; 13 &rarr; 16') },
          { say: 'This code makes the pattern 3n + 4. To repeat 100 times, change one number.', fig: eq('3<i>n</i> + 4'), ms: 2600 }
        ]),
        try: lab('cdso', [
          { do: 'Change the code so it shows <b>25</b>.', goal: function (h) { return Math.abs(K.v(h, 'cds') + K.v(h, 'cdr') * K.v(h, 'cdp') - 25) < 1e-9; }, yes: 'Start + repeats × step = 25.' },
          { do: 'Make the total go <b>down</b> each time.', goal: function (h) { return K.v(h, 'cdp') < 0; }, yes: 'Adding a negative number makes it shrink.' }
        ]),
        key: '<p><b>A loop repeats the steps inside it.</b> Trace the value each time through.</p>',
        mistake: '<p>Running the loop once too many or too few times. Write a row for each pass, numbered 1 to the count.</p>',
        check: [function () { return { q: 'What does this code show?' + mono('x = 50\nrepeat 6 times:\n    x = x &minus; 4\nshow x'), type: 'num', answer: 26, hint: 'Take 4 away 6 times: 24 in total.', explain: '50 &minus; 24 = 26.' }; }, K.ck('al-code', 1), K.ck('al-code', 2)] },
      { id: 'subprog', title: 'Sub-programs', exp: ['C3.1', 'C3.2'], skill: 'al-code',
        body: '<p>A <b>sub-program</b> is a named set of steps you write once and use again. To change how it works, you change it in one place.</p>',
        watch: K.slides([
          { say: 'This sub-program adds 13% tax to a price.', fig: mono('define addTax(price):\n    return price + price &times; 0.13') },
          { say: 'Use it twice: for $20 and for $50.', fig: mono('show addTax(20)\nshow addTax(50)') },
          { say: '20 + 2.6 = 22.6, and 50 + 6.5 = 56.5.', fig: eq('22.6 &nbsp;&nbsp; 56.5') },
          { say: 'If the tax changes, edit one line and every use updates.', fig: mono('define addTax(price):\n    return price + price &times; <b>0.15</b>'), ms: 2600 }
        ]),
        key: '<p><b>Write it once, use it many times.</b></p>',
        mistake: '<p>Copying the same steps in many places. When one copy is fixed, the others stay wrong.</p>',
        check: [function () { return { q: 'What does this code show?' + mono('define double(n):\n    return n &times; 2\n\nshow double(7) + 1'), type: 'num', answer: 15, hint: 'double(7) is 14.', explain: '14 + 1 = 15.' }; }, K.ck('al-code', 3)] }
    ] }
  ];


  A.register('algebra', {
    lessons: LESSONS,

    quiz: [
      { q: 'A pattern starts at 5 (term 0) and goes up by 3 each term. Which expression gives term <i>n</i>?', type: 'mc', options: ['5<i>n</i> + 3', '3<i>n</i> + 5', '<i>n</i> + 8', '8<i>n</i>'], answer: 1, hint: 'The rate multiplies <i>n</i>. The initial value is added.', explain: 'Rate 3, initial value 5: 3<i>n</i> + 5.' },
      { q: 'The rule of a pattern is 4<i>n</i> + 1. Which term has the value 61?', type: 'num', answer: 15, hint: 'Solve 4<i>n</i> + 1 = 61.', explain: '4<i>n</i> = 60, so <i>n</i> = 15.' },
      { q: 'Simplify: 7<i>m</i> + 3<i>m</i> &minus; 2<i>m</i>', type: 'mc', options: ['8<i>m</i>', '12<i>m</i>', '8', '10<i>m</i> &minus; 2'], answer: 0, hint: 'All three are like terms. Work left to right.', explain: '7 + 3 &minus; 2 = 8, so 8<i>m</i>.' },
      { q: 'Evaluate 3<i>a</i> + 1.2 when <i>a</i> = 0.6.', type: 'num', answer: 3, hint: 'Multiply first: 3 &times; 0.6.', explain: '3 &times; 0.6 = 1.8, and 1.8 + 1.2 = 3.' },
      { q: 'Solve: 4<i>x</i> + 7 = 35', type: 'num', answer: 7, fig: balance(4, 7, 35), hint: 'Take 7 off both sides first.', explain: '4<i>x</i> = 28, so <i>x</i> = 7. Check: 4 &times; 7 + 7 = 35.' },
      { q: 'Which number line shows <i>x</i> &le; 2?', type: 'mc', options: [ineqLine('<', 2, -3, 7), ineqLine('<=', 2, -3, 7), ineqLine('>=', 2, -3, 7)], answer: 1, hint: '&le; means 2 is included. Which dot is filled in?', explain: 'Less than or equal to 2: a closed dot at 2 and an arrow to the left.' },
      { q: 'What does this code show?<span class="mono">n = 3\nrepeat 5 times:\n    n = n + 2.5\nshow n</span>', type: 'num', answer: 15.5, hint: 'Add 2.5 five times.', explain: '3 + 5 &times; 2.5 = 3 + 12.5 = 15.5.' }
    ],

    practice: [
      { id: 'al-pattern', name: 'Pattern rules', code: 'C1.1, C1.3', gen: function (lv) {
        var m = R.int(2, 7), c = R.int(0, 12), t = [1, 2, 3, 4].map(function (n) { return m * n + c; });
        if (lv === 1) {
          return { q: 'What comes next? ' + t.join(', ') + ', ...', type: 'num', answer: m * 5 + c, fig: m * 4 + c <= 36 ? tiles(m, c, 3) : '',
            hint: 'How much is added each time?', steps: ['Each term is ' + m + ' more than the one before.', t[3] + ' + ' + m + ' = ' + (t[3] + m) + '.'], explain: 'The rate is ' + m + ', so the next term is ' + (t[3] + m) + '.' };
        }
        if (lv === 2) {
          var o = R.mc(expr(m, c), [expr(c || 1, m), expr(m + c, 0), expr(m, c + m)]);
          return { q: 'The pattern goes ' + t.join(', ') + ', ... (term 1 is ' + t[0] + '). Which rule gives term <i>n</i>?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'The rate is what is added each time. Work back one step to find term 0.', steps: ['The rate is ' + m + ', so the rule starts ' + m + '<i>n</i>.', 'Term 0 is ' + t[0] + ' &minus; ' + m + ' = ' + c + '. That is the initial value.', 'Rule: ' + expr(m, c) + '. Check term 1: ' + m + ' + ' + c + ' = ' + t[0] + '.'],
            explain: 'Rate ' + m + ', initial value ' + c + ': ' + expr(m, c) + '.' };
        }
        var k = R.int(12, 40), v = m * k + c;
        if (R.int(0, 1)) return { q: 'A pattern has the rule ' + expr(m, c) + '. Which term has the value ' + v + '?', type: 'num', answer: k,
          hint: 'Solve ' + expr(m, c) + ' = ' + v + '.', steps: ['Write the equation: ' + expr(m, c) + ' = ' + v + '.', c ? 'Take ' + c + ' off both sides: ' + m + '<i>n</i> = ' + (v - c) + '.' : m + '<i>n</i> = ' + v + '.', 'Divide by ' + m + ': <i>n</i> = ' + k + '.'],
          explain: 'Term ' + k + ': ' + m + ' &times; ' + k + ' + ' + c + ' = ' + v + '.' };
        return { q: 'A pattern starts at ' + c + ' (term 0) and goes up ' + m + ' each term. What is term ' + k + '?', type: 'num', answer: v,
          hint: 'Use the rule ' + expr(m, c) + '.', steps: ['The rule is ' + expr(m, c) + '.', 'Replace <i>n</i> with ' + k + ': ' + m + ' &times; ' + k + ' + ' + c + '.', '= ' + v + '.'], explain: 'Term ' + k + ' is ' + v + '.' };
      } },
      { id: 'al-like', name: 'Like terms', code: 'C2.1', gen: function (lv) {
        var v = R.pick(['x', 'y', 'a', 'n', 'm']), a = R.int(2, 9), b = R.int(1, 9), c = R.int(1, 5), q, r, steps;
        if (lv === 1) { r = a + b; q = a + '<i>' + v + '</i> + ' + (b === 1 ? '' : b) + '<i>' + v + '</i>'; steps = ['Both terms have <i>' + v + '</i>, so they are like terms.', 'Add the numbers in front: ' + a + ' + ' + b + ' = ' + r + '.']; }
        else if (lv === 2) { if (b > a) { var t = a; a = b; b = t; } if (a === b) a++; r = a - b; q = a + '<i>' + v + '</i> &minus; ' + (b === 1 ? '' : b) + '<i>' + v + '</i>'; steps = ['Like terms: subtract the numbers in front.', a + ' &minus; ' + b + ' = ' + r + '.']; }
        else { r = a + b - c; if (r <= 0) { a += c; r = a + b - c; } q = a + '<i>' + v + '</i> + ' + b + '<i>' + v + '</i> &minus; ' + c + '<i>' + v + '</i>'; steps = ['All three are like terms.', 'Work left to right: ' + a + ' + ' + b + ' &minus; ' + c + ' = ' + r + '.']; }
        var ans = (r === 1 ? '' : r) + '<i>' + v + '</i>';
        steps.push('Answer: ' + ans + '.');
        var o = R.mc(ans, [String(r), (lv === 1 ? a * b : a + b) + '<i>' + v + '</i>', (r + 1) + '<i>' + v + '</i>', r + '<i>' + v + '</i><sup>2</sup>']);
        return { q: 'Simplify: ' + q, type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 && a + b <= 12 ? atiles(a, 0, v) : '',
          hint: 'Like terms: combine the numbers in front and keep the variable.', steps: steps, explain: q + ' = ' + ans + '.' };
      } },
      { id: 'al-eval', name: 'Evaluate expressions', code: 'C2.2', gen: function (lv) {
        var v = R.pick(['n', 'x', 'k', 't']), m = R.int(2, 9), c = R.int(1, 20), n = R.int(2, 12);
        if (lv === 2) { n = cl(R.int(1, 19) / 2); }
        if (lv === 3) { m = cl(R.int(11, 49) / 10); n = R.int(2, 10); c = cl(R.int(1, 30) / 2); }
        var sub = R.int(0, 1) && m * n > c, val = cl(sub ? m * n - c : m * n + c);
        var e = dec(m) + '<i>' + v + '</i> ' + (sub ? '&minus; ' : '+ ') + dec(c);
        return { q: 'Evaluate ' + e + ' when <i>' + v + '</i> = ' + dec(n) + '.', type: 'num', answer: val,
          hint: 'Replace <i>' + v + '</i> with ' + dec(n) + ' and multiply first.', steps: ['Replace the variable: ' + dec(m) + ' &times; ' + dec(n) + (sub ? ' &minus; ' : ' + ') + dec(c) + '.', 'Multiply: ' + dec(m) + ' &times; ' + dec(n) + ' = ' + dec(m * n) + '.', (sub ? 'Subtract: ' : 'Add: ') + dec(m * n) + (sub ? ' &minus; ' : ' + ') + dec(c) + ' = ' + dec(val) + '.'],
          explain: 'The value is ' + dec(val) + '.' };
      } },
      { id: 'al-solve', name: 'Solve equations', code: 'C2.3', gen: function (lv) {
        var a = R.int(2, 9), x = R.int(1, 12), b = R.int(1, 20), c, q, steps;
        if (lv === 1) { c = a * x; q = a + '<i>x</i> = ' + c; steps = [a + '<i>x</i> means ' + a + ' &times; <i>x</i>.', 'Divide both sides by ' + a + ': <i>x</i> = ' + c + ' &divide; ' + a + ' = ' + x + '.', 'Check: ' + a + ' &times; ' + x + ' = ' + c + '.'];
          return { q: 'Solve: ' + q, type: 'num', answer: x, fig: a <= 5 ? balance(a, 0, c) : '', hint: 'Divide both sides by ' + a + '.', steps: steps, explain: '<i>x</i> = ' + x + '.' }; }
        if (lv === 2) {
          var sub = R.int(0, 1) && a * x > b; c = sub ? a * x - b : a * x + b;
          q = a + '<i>x</i> ' + (sub ? '&minus; ' : '+ ') + b + ' = ' + c;
          steps = [(sub ? 'Add ' + b + ' to' : 'Take ' + b + ' off') + ' both sides: ' + a + '<i>x</i> = ' + a * x + '.', 'Divide both sides by ' + a + ': <i>x</i> = ' + x + '.', 'Check: ' + a + ' &times; ' + x + (sub ? ' &minus; ' : ' + ') + b + ' = ' + c + '.'];
          return { q: 'Solve: ' + q, type: 'num', answer: x, fig: !sub && a <= 5 ? balance(a, b, c) : '', hint: 'Undo the ' + (sub ? 'subtraction' : 'addition') + ' first.', steps: steps, explain: '<i>x</i> = ' + x + '.' };
        }
        if (R.int(0, 1)) {
          var p = R.int(1, a - 1), qq = a - p; c = a * x + b;
          q = p + '<i>x</i> + ' + b + ' + ' + (qq === 1 ? '' : qq) + '<i>x</i> = ' + c;
          steps = ['Combine like terms: ' + p + '<i>x</i> + ' + qq + '<i>x</i> = ' + a + '<i>x</i>. So ' + a + '<i>x</i> + ' + b + ' = ' + c + '.', 'Take ' + b + ' off both sides: ' + a + '<i>x</i> = ' + a * x + '.', 'Divide by ' + a + ': <i>x</i> = ' + x + '.'];
          return { q: 'Solve: ' + q, type: 'num', answer: x, hint: 'Combine the <i>x</i> terms first.', steps: steps, explain: '<i>x</i> = ' + x + '. Check: ' + p + ' &times; ' + x + ' + ' + b + ' + ' + qq + ' &times; ' + x + ' = ' + c + '.' };
        }
        var bd = cl(R.int(1, 30) / 2), xd = cl(R.int(1, 20) / 2), cd = cl(a * xd + bd);
        q = a + '<i>x</i> + ' + dec(bd) + ' = ' + dec(cd);
        steps = ['Take ' + dec(bd) + ' off both sides: ' + a + '<i>x</i> = ' + dec(a * xd) + '.', 'Divide by ' + a + ': <i>x</i> = ' + dec(xd) + '.', 'Check: ' + a + ' &times; ' + dec(xd) + ' + ' + dec(bd) + ' = ' + dec(cd) + '.'];
        return { q: 'Solve: ' + q, type: 'num', answer: xd, hint: 'Undo the + ' + dec(bd) + ' first.', steps: steps, explain: '<i>x</i> = ' + dec(xd) + '.' };
      } },
      { id: 'al-ineq', name: 'Inequalities', code: 'C2.4', gen: function (lv) {
        var ops = ['<', '<=', '>', '>='], op = R.pick(ops), v = R.int(-3, 8);
        if (lv === 1) {
          var o = R.mc(ineqLine(op, v, v - 5, v + 5), ops.filter(function (x) { return x !== op; }).map(function (x) { return ineqLine(x, v, v - 5, v + 5); }));
          return { q: 'Which number line shows <i>x</i> ' + OPS[op] + ' ' + dec(v) + '?', type: 'mc', options: o.options, answer: o.answer,
            hint: (op.length > 1 ? 'The line under the sign means ' + v + ' is included: closed dot.' : 'No line under the sign: ' + v + ' is not included, open dot.') + ' ' + (op.charAt(0) === '<' ? 'Less than points left.' : 'Greater than points right.'),
            steps: ['Dot: ' + (op.length > 1 ? 'closed (filled in), because ' + v + ' is included.' : 'open, because ' + v + ' is not included.'), 'Arrow: ' + (op.charAt(0) === '<' ? 'to the left, toward smaller numbers.' : 'to the right, toward bigger numbers.')],
            explain: '<i>x</i> ' + OPS[op] + ' ' + dec(v) + ': ' + (op.length > 1 ? 'closed' : 'open') + ' dot, arrow ' + (op.charAt(0) === '<' ? 'left' : 'right') + '.' };
        }
        var a = R.int(2, 6), b = R.int(1, 15), c = a * v + b;
        var lhs = a + '<i>x</i> + ' + b, ok = function (t) { var L = a * t + b; return op === '<' ? L < c : op === '<=' ? L <= c : op === '>' ? L > c : L >= c; };
        var cands = R.shuffle([v - 2, v - 1, v, v + 1, v + 2, v + 3, v - 3]), good = cands.filter(ok), bad = cands.filter(function (t) { return !ok(t); });
        var o2 = R.mc(dec(good[0]), bad.slice(0, 3).map(dec));
        return { q: 'Which value of <i>x</i> is a solution of ' + lhs + ' ' + OPS[op] + ' ' + dec(c) + '?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Solve it like an equation, then think about whether ' + dec(v) + ' itself is included.',
          steps: ['Take ' + b + ' off both sides: ' + a + '<i>x</i> ' + OPS[op] + ' ' + dec(c - b) + '.', 'Divide by ' + a + ': <i>x</i> ' + OPS[op] + ' ' + dec(v) + '.', dec(good[0]) + ' fits. Check: ' + a + ' &times; ' + dec(good[0]) + ' + ' + b + ' = ' + dec(a * good[0] + b) + ', and ' + dec(a * good[0] + b) + ' ' + OPS[op] + ' ' + dec(c) + ' is true.'],
          explain: 'The solutions are <i>x</i> ' + OPS[op] + ' ' + dec(v) + '.<div class="fig">' + ineqLine(op, v) + '</div>' };
      } },
      { id: 'al-code', name: 'Read code', code: 'C3.1, C3.2', gen: function (lv) {
        var s0 = R.int(0, 30), r = R.int(2, lv === 1 ? 5 : 9), p = lv === 3 ? cl(R.pick([-1, 1]) * R.int(1, 9) / 2) : R.int(1, 9) * (lv === 2 && R.int(0, 1) ? -1 : 1);
        if (lv === 3 && R.int(0, 1)) {
          var price = R.int(4, 20), n1 = R.int(2, 5);
          var code = 'define cost(n):\n    return n &times; ' + price + ' + 2\n\nshow cost(' + n1 + ')';
          return { q: 'What does this code show?<span class="mono">' + code + '</span>', type: 'num', answer: n1 * price + 2,
            hint: 'The sub-program uses n = ' + n1 + '.', steps: ['cost(' + n1 + ') runs the sub-program with n = ' + n1 + '.', n1 + ' &times; ' + price + ' + 2 = ' + (n1 * price) + ' + 2.', '= ' + (n1 * price + 2) + '.'],
            explain: 'It shows ' + (n1 * price + 2) + '.' };
        }
        var end = cl(s0 + r * p), code2 = 'total = ' + s0 + '\nrepeat ' + r + ' times:\n    total = total ' + (p < 0 ? '&minus; ' + dec(-p) : '+ ' + dec(p)) + '\nshow total';
        return { q: 'What does this code show?<span class="mono">' + code2 + '</span>', type: 'num', answer: end, kb: end < 0 ? 'text' : 'decimal',
          hint: 'The loop changes total by ' + dec(p) + ', ' + r + ' times.', steps: ['Start: total = ' + s0 + '.', 'The loop runs ' + r + ' times. Each time it changes by ' + dec(p) + ': ' + r + ' &times; ' + (p < 0 ? '(' + dec(p) + ')' : dec(p)) + ' = ' + dec(r * p) + '.', s0 + ' + ' + (r * p < 0 ? '(' + dec(r * p) + ')' : dec(r * p)) + ' = ' + dec(end) + '.'],
          explain: 'It shows ' + dec(end) + '.' };
      } }
    ]
  });

  /* ---------- question shapes: more ways to practise each skill ---------- */
  function holds(x, op, v) { return op === '<' ? x < v : op === '<=' ? x <= v : op === '>' ? x > v : x >= v; }
  function loop(s, d, k) { return 'total = ' + s + '\nrepeat ' + k + ' times:\n    total = total ' + (d < 0 ? '&minus; ' + (-d) : '+ ' + d) + '\nshow total'; }
  Atlas.Q.shapes('algebra', {
    'al-pattern': [
      [1, 'fill', function (lv) {
        var m = R.int(2, lv === 1 ? 5 : 9), c = R.int(0, 9), t = [1, 2, 3, 4].map(function (n) { return m * n + c; });
        return { q: 'The rule is ' + expr(m, c) + '. Fill in terms 5 and 6.', type: 'fill', fill: '<span class="math">' + t.join(', ') + ', </span>[[]], [[]]', answers: [m * 5 + c, m * 6 + c],
          fig: lv === 1 && m * 4 + c <= 36 ? tiles(m, c, 3) : '', hint: 'Each term adds ' + m + '.', steps: ['Term 5: ' + m + ' &times; 5 + ' + c + ' = ' + (5 * m + c) + '.', 'Term 6: add ' + m + ' more.'],
          explain: 'Terms 5 and 6 are ' + (5 * m + c) + ' and ' + (6 * m + c) + '.', meta: { k: 'al-pat-fill', m: m, c: c } };
      }],
      [1, 'match', function () {
        var rules = K.uniq(3, function () { return [R.int(2, 6), R.int(0, 8)]; }, function (r) { return r[0] + r[1]; }); /* different first terms, so no two patterns look alike */
        var pairs = rules.map(function (r) { return [[1, 2, 3].map(function (n) { return r[0] * n + r[1]; }).join(', ') + ', ...', expr(r[0], r[1])]; });
        return { q: 'Match each pattern (terms 1, 2, 3) to its rule.', type: 'match', pairs: pairs,
          hint: 'The rate is what is added each time. Then find the starting value at term 0.', steps: ['For 5, 8, 11: add 3 each time, and term 0 is 5 &minus; 3 = 2. Rule: 3<i>n</i> + 2.'],
          explain: pairs.map(function (p) { return p[0] + ' has the rule ' + p[1]; }).join('. ') + '.', meta: { k: 'al-pat-match', rules: rules } };
      }],
      [1, 'story', function () {
        var who = K.name(), c = R.int(2, 6) * 5, m = R.int(2, 9) * 5, k = R.int(3, 12);
        return { q: 'A climbing gym costs <b>$' + c + '</b> to join, plus <b>$' + m + '</b> each month. ' + who + ' joins and goes for <b>' + k + ' months</b>. What is the total cost?', type: 'num', unit: '$', answer: c + m * k,
          hint: 'The rule is ' + m + '<i>n</i> + ' + c + '.', steps: [m + ' &times; ' + k + ' = ' + m * k + '.', m * k + ' + ' + c + ' = ' + (m * k + c) + '.'],
          explain: 'Total: $' + (m * k + c) + '.', meta: { k: 'al-pat-story', c: c, m: m, n: k } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), m = R.int(2, 6), c = R.int(1, 9), t = [1, 2, 3].map(function (n) { return m * n + c; }), truth = R.int(0, 1), sc = truth ? c : t[0];
        var right = 'Term 0 comes before term 1: ' + t[0] + ' &minus; ' + m + ' = ' + c + '. So the rule is ' + expr(m, c) + '.';
        return { q: 'The pattern goes ' + t.join(', ') + ', ... (term 1 is ' + t[0] + '). ' + who + ' says the rule is <b>' + expr(m, sc) + '</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['The number added on is always the first term.', 'The rule is the first term times n.']),
          hint: 'Test the rule with n = 1.', steps: [right], explain: right, meta: { k: 'al-pat-tf', t: t, m: m, said: sc } };
      }]
    ],
    'al-like': [
      [1, 'pick', function () {
        return K.retry(function () {
          var v = R.pick(['x', 'y', 'n']), kinds = [v, v, v, R.pick(['x', 'y', 'n'].filter(function (u) { return u !== v; })), v + '2', ''];
          var opts = K.uniq(5, function () { return [R.int(1, 9), R.pick(kinds)]; }, function (t) { return t.join(); });
          var ans = K.picks(opts, function (t) { return t[1] === v; });
          if (!ans) return null;
          var show = function (t) { return t[1] === '' ? String(t[0]) : t[1].length > 1 ? (t[0] === 1 ? '' : t[0]) + '<i>' + t[1][0] + '</i><sup>2</sup>' : term(t[0], t[1]); };
          return { q: 'Pick every term that is a <b>like term</b> with <span class="math">' + term(R.int(2, 9), v) + '</span>.', type: 'pick', options: opts.map(show), answer: ans,
            hint: 'Like terms have the same variable, with the same exponent.', steps: ['Look only at the letter part. It must be exactly <i>' + v + '</i>.'],
            explain: 'The like terms are ' + ans.map(function (j) { return show(opts[j]); }).join(', ') + '.', meta: { k: 'al-like-pick', v: v, opts: opts } };
        });
      }],
      [1, 'fill', function (lv) {
        var v = R.pick(['x', 'y', 'n']), a = R.int(2, 9), b = R.int(1, lv === 1 ? 9 : 12), sub = lv > 1 && R.int(0, 1);
        if (sub && b >= a) b = R.int(1, a - 1);
        return { q: 'Combine the like terms.', type: 'fill', fill: '<span class="math">' + term(a, v) + (sub ? ' &minus; ' : ' + ') + term(b, v) + ' = </span>[[]]<span class="math"><i>' + v + '</i></span>', answers: [sub ? a - b : a + b],
          fig: !sub && a + b <= 12 ? atiles(a + b, 0, v) : '', hint: (sub ? 'Subtract' : 'Add') + ' the numbers in front. Keep the <i>' + v + '</i>.', steps: [a + (sub ? ' &minus; ' : ' + ') + b + ' = ' + (sub ? a - b : a + b) + '.'],
          explain: term(a, v) + (sub ? ' &minus; ' : ' + ') + term(b, v) + ' = ' + term(sub ? a - b : a + b, v) + '.', meta: { k: 'al-like-fill', a: a, b: sub ? -b : b } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a = R.int(2, 9), b = R.int(2, 9), like = R.int(0, 1);
        var right = like ? 'Both are <i>x</i> terms, so add the numbers: ' + term(a, 'x') + ' + ' + term(b, 'x') + ' = ' + term(a + b, 'x') + '.' : term(a, 'x') + ' and ' + b + ' are not like terms. ' + term(a, 'x') + ' + ' + b + ' cannot be simplified.';
        return { q: who + ' says <span class="math">' + term(a, 'x') + ' + ' + (like ? term(b, 'x') : b) + ' = ' + term(a + b, 'x') + '</span>. True or false?', type: 'tf', answer: !!like,
          why: K.why(right, ['You can always add the numbers you see.', 'Terms are like when they have the same number in front.']),
          hint: 'Are both of them <i>x</i> terms?', steps: [right], explain: right, meta: { k: 'al-like-tf', like: like } };
      }]
    ],
    'al-eval': [
      [1, 'match', function () {
        var n = R.int(2, 6), es = K.uniq(3, function () { return [R.int(2, 7), R.int(-5, 9)]; }, function (e) { return e[0] * n + e[1]; });
        var pairs = es.map(function (e) { return [expr(e[0], e[1]), dec(e[0] * n + e[1])]; });
        return { q: 'Let <i>n</i> = ' + n + '. Match each expression to its value.', type: 'match', pairs: pairs,
          hint: 'Replace <i>n</i> with ' + n + '. Multiply first, then add or subtract.', steps: ['For example, 3<i>n</i> + 1 = 3 &times; ' + n + ' + 1 = ' + (3 * n + 1) + '.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'al-eval-match', n: n, es: es } };
      }],
      [1, 'story', function () {
        var who = K.name(), b = R.int(3, 6), r = R.int(2, 4), km = R.int(3, 15);
        return { q: 'A taxi charges <b>$' + b + '</b> plus <b>$' + r + '</b> for every kilometre: ' + r + '<i>k</i> + ' + b + '. ' + who + ' rides <b>' + km + ' km</b>. What is the fare?', type: 'num', unit: '$', answer: r * km + b,
          hint: 'Replace <i>k</i> with ' + km + '.', steps: [r + ' &times; ' + km + ' = ' + r * km + '.', r * km + ' + ' + b + ' = ' + (r * km + b) + '.'],
          explain: 'The fare is $' + (r * km + b) + '.', meta: { k: 'al-eval-story', b: b, r: r, km: km } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a = R.int(2, 9), n = R.int(2, 9), truth = R.int(0, 1), said = truth ? a * n : +(String(a) + n);
        var right = term(a, 'n') + ' means ' + a + ' &times; <i>n</i>. With <i>n</i> = ' + n + ', it is ' + a + ' &times; ' + n + ' = ' + a * n + '.';
        return { q: who + ' says that when <i>n</i> = ' + n + ', <span class="math">' + term(a, 'n') + ' = ' + said + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Write the digits side by side: ' + a + ' and ' + n + ' make ' + a + n + '.', term(a, 'n') + ' means ' + a + ' + <i>n</i>.']),
          hint: 'What does a number right next to a letter mean?', steps: [right], explain: right, meta: { k: 'al-eval-tf', a: a, n: n, said: said } };
      }]
    ],
    'al-solve': [
      [1, 'line', function () {
        var a = R.int(1, 5), x = R.int(0, 20), b = R.int(0, 12), c = a * x + b;
        return { q: 'Solve <span class="math">' + expr(a, b, 'x') + ' = ' + c + '</span>. Place <i>x</i> on the number line.', type: 'line', min: 0, max: 20, tick: 1, every: 5, snap: 1, answer: x,
          hint: b ? 'Take away ' + b + ' from both sides first.' : 'Divide both sides by ' + a + '.', steps: (b ? [c + ' &minus; ' + b + ' = ' + (c - b) + '.'] : []).concat(a > 1 ? [(c - b) + ' &divide; ' + a + ' = ' + x + '.'] : []),
          explain: '<i>x</i> = ' + x + '. Check: ' + (a > 1 ? a + ' &times; ' + x : x) + (b ? ' + ' + b : '') + ' = ' + c + '.', meta: { k: 'al-solve-line', a: a, b: b, c: c } };
      }],
      [1, 'fill', function () {
        var a = R.int(2, 9), x = R.int(1, 12), b = R.int(1, 20), c = a * x + b;
        return { q: 'Solve in two steps. Fill in the blanks.', type: 'fill', fill: '<span class="math">' + expr(a, b, 'x') + ' = ' + c + '</span><br><span class="math">' + term(a, 'x') + ' = </span>[[]]<br><span class="math"><i>x</i> = </span>[[]]', answers: [c - b, x],
          fig: a <= 5 ? balance(a, b, c) : '', hint: 'Undo the + ' + b + ' first, then the &times; ' + a + '.', steps: ['Take ' + b + ' from both sides: ' + term(a, 'x') + ' = ' + (c - b) + '.', 'Divide both sides by ' + a + ': <i>x</i> = ' + x + '.'],
          explain: '<i>x</i> = ' + x + '.', meta: { k: 'al-solve-fill', a: a, b: b, c: c } };
      }],
      [1, 'story', function () {
        var who = K.name(), have = R.int(2, 10) * 5, per = R.int(2, 6) * 5, w = R.int(2, 10), goal = have + per * w, it = R.pick(['a new bike', 'a pair of skates', 'a tablet', 'a guitar']);
        return { q: who + ' has <b>$' + have + '</b> and saves <b>$' + per + '</b> a week for ' + it + ' that costs <b>$' + goal + '</b>. Solve ' + per + '<i>w</i> + ' + have + ' = ' + goal + ' to find the number of weeks.', type: 'num', unit: 'weeks', answer: w,
          hint: 'Take ' + have + ' from both sides, then divide by ' + per + '.', steps: [goal + ' &minus; ' + have + ' = ' + (goal - have) + '.', (goal - have) + ' &divide; ' + per + ' = ' + w + '.'],
          explain: who + ' needs ' + w + ' weeks.', meta: { k: 'al-solve-story', a: per, b: have, c: goal } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), b = R.int(2, 15), c = b + R.int(1, 20), truth = R.int(0, 1), said = truth ? c - b : c + b;
        var right = 'Undo + ' + b + ' by subtracting ' + b + ' from both sides: <i>x</i> = ' + c + ' &minus; ' + b + ' = ' + (c - b) + '.';
        return { q: 'To solve <span class="math"><i>x</i> + ' + b + ' = ' + c + '</span>, ' + who + ' gets <span class="math"><i>x</i> = ' + said + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Add ' + b + ' to both sides to get rid of it.', 'Move the ' + b + ' to the other side and keep its sign.']),
          hint: 'Check: put the answer back in the equation.', steps: [right], explain: right, meta: { k: 'al-solve-tf', b: b, c: c, said: said } };
      }]
    ],
    'al-ineq': [
      [1, 'pick', function () {
        return K.retry(function () {
          var op = R.pick(['<', '<=', '>', '>=']), v = R.int(-3, 8), opts = K.uniq(6, function () { return R.int(v - 4, v + 4); }).sort(function (a, b) { return a - b; });
          var ans = K.picks(opts, function (x) { return holds(x, op, v); });
          if (!ans || opts.indexOf(v) < 0) return null;
          return { q: 'Pick every value of <i>x</i> that makes <span class="math"><i>x</i> ' + OPS[op] + ' ' + dec(v) + '</span> true.', type: 'pick', options: opts.map(dec), answer: ans,
            fig: ineqLine(op, v), hint: op.length > 1 ? dec(v) + ' itself counts, because of the "or equal to".' : dec(v) + ' itself does not count.', steps: ['Test each value against ' + dec(v) + '.'],
            explain: ans.map(function (j) { return dec(opts[j]); }).join(', ') + ' make it true.', meta: { k: 'al-ineq-pick', op: op, v: v, opts: opts } };
        });
      }],
      [1, 'line', function () {
        var b = R.int(1, 9), c = b + R.int(1, 10), op = R.pick(['<', '>']);
        return { q: 'Solve <span class="math"><i>x</i> + ' + b + ' ' + OPS[op] + ' ' + c + '</span>. Place the boundary number for <i>x</i> on the line.', type: 'line', min: 0, max: 15, tick: 1, every: 5, snap: 1, answer: c - b,
          hint: 'Solve it like an equation: take ' + b + ' from both sides.', steps: [c + ' &minus; ' + b + ' = ' + (c - b) + '.', 'So <i>x</i> ' + OPS[op] + ' ' + (c - b) + '.'],
          explain: '<i>x</i> ' + OPS[op] + ' ' + (c - b) + '. The boundary is ' + (c - b) + '.', meta: { k: 'al-ineq-line', b: b, c: c } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), v = R.int(-2, 9), op = R.pick(['<', '<=', '>', '>=']);
        var right = op.length > 1 ? 'The "or equal to" part means ' + dec(v) + ' is a solution.' : dec(v) + ' ' + OPS[op] + ' ' + dec(v) + ' is false, so ' + dec(v) + ' is not a solution.';
        return { q: who + ' says <b>' + dec(v) + '</b> is a solution of <span class="math"><i>x</i> ' + OPS[op] + ' ' + dec(v) + '</span>. True or false?', type: 'tf', answer: op.length > 1,
          why: K.why(right, ['The boundary number is always a solution.', 'The boundary number is never a solution.'].filter(function (w, i) { return i !== (op.length > 1 ? 0 : 1); }).concat(['Only positive numbers can be solutions.'])),
          hint: 'Is there an "or equal to" line under the sign?', steps: [right], explain: right, meta: { k: 'al-ineq-tf', op: op, v: v } };
      }]
    ],
    'al-code': [
      [1, 'fill', function () {
        var s = R.int(0, 20), d = R.pick([-5, -3, -2, 2, 3, 4, 5, 10]), k = R.int(3, 6);
        return { q: 'Trace the code. What is <b>total</b> after the first and second times through the loop?<span class="mono">' + loop(s, d, k) + '</span>', type: 'fill', fill: 'After 1 time: [[]] &nbsp; After 2 times: [[]]', answers: [s + d, s + 2 * d],
          hint: 'Start at ' + s + '. Each time through, ' + (d < 0 ? 'take away ' + (-d) : 'add ' + d) + '.', steps: [s + (d < 0 ? ' &minus; ' + (-d) : ' + ' + d) + ' = ' + (s + d) + '.', (s + d) + (d < 0 ? ' &minus; ' + (-d) : ' + ' + d) + ' = ' + (s + 2 * d) + '.'],
          explain: 'After 1 time: ' + (s + d) + '. After 2 times: ' + (s + 2 * d) + '.', meta: { k: 'al-code-fill', s: s, d: d } };
      }],
      [1, 'story', function () {
        var who = K.name(), d = R.int(2, 9), k = R.int(3, 8), s = R.int(0, 10);
        return { q: who + ' codes a robot. It starts at <b>' + s + '</b> on a number line.<span class="mono">repeat ' + k + ' times:\n    move forward ' + d + '\nshow position</span>Where does the robot stop?', type: 'num', answer: s + k * d,
          hint: 'The loop moves ' + d + ', ' + k + ' times.', steps: [k + ' &times; ' + d + ' = ' + k * d + '.', s + ' + ' + k * d + ' = ' + (s + k * d) + '.'],
          explain: 'It stops at ' + (s + k * d) + '.', meta: { k: 'al-code-story', s: s, d: d, n: k } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), s = R.int(0, 20), d = R.int(2, 9), k = R.int(3, 7), truth = R.int(0, 1), said = truth ? s + k * d : s + d;
        var right = 'The loop runs ' + k + ' times, so it adds ' + d + ' a total of ' + k + ' times: ' + s + ' + ' + k * d + ' = ' + (s + k * d) + '.';
        return { q: who + ' says this code shows <b>' + said + '</b>.<span class="mono">' + loop(s, d, k) + '</span>True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['The line inside the loop runs once.', 'A loop only repeats the last line of the code.']),
          hint: 'How many times does the indented line run?', steps: [right], explain: right, meta: { k: 'al-code-tf', s: s, d: d, n: k, said: said } };
      }]
    ]
  });
})();
