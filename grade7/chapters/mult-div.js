(function () {
  var A = Atlas, R = A.R, fr = A.fr, frs = A.frs, gcd = A.gcd, cl = A.clean;
  function plain(n, d) { return frs(n, d, true); }
  function dec(x) { return String(cl(x)); }
  function places(x) { var s = dec(x), i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; }
  var PL = ['whole number', 'tenth', 'hundredth', 'thousandth'];

  /* rounding: zoom in to the two neighbours at the chosen place */
  function roundPic(x, p) {
    var u = Math.pow(10, -p), lo = cl(Math.floor(cl(x / u)) * u), hi = cl(lo + u), half = cl(lo + u / 2), up = x >= half - 1e-12, W = 540, s = '';
    var sc = function (v) { return 50 + 440 * (v - lo) / u; };
    s += '<line x1="50" y1="70" x2="490" y2="70" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= 10; i++) { var tx = 50 + 44 * i; s += '<line x1="' + tx + '" y1="' + (i % 5 ? 64 : 58) + '" x2="' + tx + '" y2="' + (i % 5 ? 76 : 82) + '" style="stroke:var(--ink)" stroke-width="' + (i % 5 ? 1.5 : 2.5) + '"/>'; }
    [[50, lo, 'lower'], [270, half, 'halfway'], [490, hi, 'upper']].forEach(function (k) {
      s += '<text x="' + k[0] + '" y="106" text-anchor="middle" font-size="19" font-weight="700">' + dec(k[1]) + '</text><text x="' + k[0] + '" y="126" text-anchor="middle" font-size="15" class="t2">' + k[2] + '</text>';
    });
    s += '<rect x="' + (up ? 270 : 50) + '" y="60" width="220" height="20" style="fill:color-mix(in srgb,var(--se) 18%,transparent)"/>';
    var xx = sc(x);
    s += '<circle cx="' + xx + '" cy="70" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + Math.min(Math.max(xx, 40), 500) + '" y="40" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--se)">' + dec(x) + '</text>';
    s += '<circle cx="' + (up ? 490 : 50) + '" cy="70" r="14" fill="none" style="stroke:var(--se)" stroke-width="3.5"/>';
    return A.svg(W, 134, s, dec(x) + ' is between ' + dec(lo) + ' and ' + dec(hi) + '. Halfway is ' + dec(half) + '. It rounds to ' + dec(up ? hi : lo) + '.');
  }
  function roundTo(x, p) { var u = Math.pow(10, p); return cl(Math.floor(cl(x * u) + 0.5 + 1e-9) / u); }

  /* area model for a/b of c/d: columns show a/b, rows show c/d, the overlap is the product */
  function areaFr(a, b, c, d) {
    var S = 240, cw = S / b, rh = S / d, s = '';
    for (var r = 0; r < d; r++) for (var k = 0; k < b; k++) {
      var inA = k < a, inC = r < c;
      s += '<rect x="' + (60 + k * cw).toFixed(1) + '" y="' + (10 + r * rh).toFixed(1) + '" width="' + cw.toFixed(1) + '" height="' + rh.toFixed(1) + '" style="fill:' + (inA && inC ? 'var(--plum)' : inA ? 'color-mix(in srgb,var(--sb) 28%,var(--card))' : inC ? 'color-mix(in srgb,var(--se) 28%,var(--card))' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.2"/>';
    }
    s += '<rect x="60" y="10" width="' + S + '" height="' + S + '" fill="none" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<text x="' + (60 + a * cw / 2) + '" y="' + (S + 34) + '" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--sb)">' + a + '/' + b + '</text>';
    s += '<text x="30" y="' + (14 + c * rh / 2) + '" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--se)">' + c + '/' + d + '</text>';
    s += '<text x="' + (S + 80) + '" y="70" font-size="18">overlap:</text><text x="' + (S + 80) + '" y="98" font-size="22" font-weight="700" style="fill:var(--plum)">' + a * c + '/' + b * d + '</text>' +
      '<text x="' + (S + 80) + '" y="130" font-size="16" class="t2">' + a * c + ' of ' + b * d + ' small</text><text x="' + (S + 80) + '" y="150" font-size="16" class="t2">rectangles</text>';
    return A.svg(S + 210, S + 44, s, a + '/' + b + ' times ' + c + '/' + d + ': a square cut into ' + b + ' columns and ' + d + ' rows. The overlap is ' + a * c + ' of ' + b * d + ' small rectangles.');
  }
  /* division as measuring: how many pieces of size c/d fit into a/b */
  function measure(a, b, c, d) {
    var L = b * d / gcd(b, d), A1 = a * L / b, C1 = c * L / d, wholes = Math.max(1, Math.ceil(a / b)), W = Math.min(480, 480 / Math.max(1, a / b)), u = W / L, s = '';
    for (var w = 0; w < wholes; w++) s += '<rect x="' + (20 + w * W) + '" y="40" width="' + W + '" height="34" style="fill:var(--card);stroke:var(--ink2)" stroke-width="1.5" stroke-dasharray="4 3"/>';
    s += '<rect x="20" y="40" width="' + (A1 * u) + '" height="34" style="fill:color-mix(in srgb,var(--sb) 25%,var(--card));stroke:var(--sb)" stroke-width="2"/>';
    s += '<text x="20" y="28" font-size="22" font-weight="700" style="fill:var(--sb)">' + a + '/' + b + '</text>';
    var k = 0, x = 20;
    while (cl((k + 1) * C1) <= A1 + 1e-9) {
      s += '<rect x="' + (x + 1.5) + '" y="84" width="' + (C1 * u - 3) + '" height="28" rx="3" style="fill:var(--se)"/>';
      if (C1 * u > 26) s += '<text x="' + (x + C1 * u / 2) + '" y="104" text-anchor="middle" font-size="20" font-weight="700" style="fill:#fff">' + (k + 1) + '</text>';
      x += C1 * u; k++;
    }
    var rem = cl(A1 - k * C1);
    if (rem > 1e-9) s += '<rect x="' + (x + 1.5) + '" y="84" width="' + (rem * u - 3) + '" height="28" rx="3" style="fill:none;stroke:var(--se)" stroke-width="2" stroke-dasharray="4 3"/>';
    var q = A1 / C1;
    s += '<text x="20" y="142" font-size="22" font-weight="700">' + (rem > 1e-9 ? k + ' whole pieces of ' + c + '/' + d + ' and part of one more' : k + ' pieces of ' + c + '/' + d + ' fit exactly') + '</text>';
    return A.svg(Math.ceil(40 + wholes * W), 150, s, 'How many ' + c + '/' + d + 's fit into ' + a + '/' + b + '? ' + plain(A1, C1) + '.');
  }
  /* hundred grid: a tenths across, b tenths down */
  function grid(a, b) {
    var sz = 22, s = '';
    for (var r = 0; r < 10; r++) for (var c = 0; c < 10; c++) {
      var ia = c < a, ib = r < b;
      s += '<rect x="' + (40 + c * sz) + '" y="' + (8 + r * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:' + (ia && ib ? 'var(--plum)' : ia ? 'color-mix(in srgb,var(--sb) 25%,var(--card))' : ib ? 'color-mix(in srgb,var(--se) 25%,var(--card))' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1"/>';
    }
    s += '<rect x="40" y="8" width="220" height="220" fill="none" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + (40 + a * sz / 2) + '" y="252" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--sb)">' + dec(a / 10) + '</text>';
    s += '<text x="20" y="' + (12 + b * sz / 2) + '" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--se)">' + dec(b / 10) + '</text>';
    s += '<text x="290" y="90" font-size="18">overlap:</text><text x="290" y="120" font-size="24" font-weight="700" style="fill:var(--plum)">' + a * b + ' hundredths</text><text x="290" y="150" font-size="22" font-weight="700" style="fill:var(--plum)">= ' + dec(a * b / 100) + '</text>';
    return A.svg(520, 262, s, dec(a / 10) + ' times ' + dec(b / 10) + ' on a hundred grid. The overlap is ' + a * b + ' hundredths, ' + dec(a * b / 100) + '.');
  }
  /* jumps of size b from 0 to a along a number line */
  function jumps(a, b) {
    var n = Math.floor(cl(a / b) + 1e-9), top = Math.max(a, n * b), W = 540, s = '', sc = function (v) { return 30 + 480 * v / top; };
    s += '<line x1="30" y1="70" x2="510" y2="70" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= n; i++) {
      var x = sc(i * b);
      if (i) s += '<path d="M' + sc((i - 1) * b) + ' 70 Q' + (sc((i - 0.5) * b)) + ' 30 ' + x + ' 70" fill="none" style="stroke:var(--se)" stroke-width="2.5"/>';
      s += '<line x1="' + x + '" y1="62" x2="' + x + '" y2="78" style="stroke:var(--ink)" stroke-width="2"/>';
      if (n <= 12 || i % Math.ceil(n / 8) === 0 || i === n) s += '<text x="' + x + '" y="100" text-anchor="middle" font-size="16">' + dec(i * b) + '</text>';
    }
    s += '<text x="30" y="128" font-size="18" font-weight="700">' + n + ' jumps of ' + dec(b) + ' reach ' + dec(n * b) + '</text>';
    return A.svg(W, 136, s, dec(a) + ' divided by ' + dec(b) + ': ' + n + ' jumps of ' + dec(b) + '.');
  }
  /* the order of operations, worked one step at a time */
  var EXPR = [
    { e: '6 + 4 &times; 3', st: [['6 + <u>4 &times; 3</u>', 'Multiply first'], ['6 + 12', 'Then add'], ['18', '']] },
    { e: '(6 + 4) &times; 3', st: [['<u>(6 + 4)</u> &times; 3', 'Brackets first'], ['10 &times; 3', 'Then multiply'], ['30', '']] },
    { e: '20 &minus; 2<sup>3</sup> &divide; 4', st: [['20 &minus; <u>2<sup>3</sup></u> &divide; 4', 'Exponent first: 2 &times; 2 &times; 2'], ['20 &minus; <u>8 &divide; 4</u>', 'Then divide'], ['20 &minus; 2', 'Then subtract'], ['18', '']] },
    { e: '3 &times; (2.5 + 1.5) &minus; 0.5', st: [['3 &times; <u>(2.5 + 1.5)</u> &minus; 0.5', 'Brackets first'], ['<u>3 &times; 4</u> &minus; 0.5', 'Multiply'], ['12 &minus; 0.5', 'Subtract'], ['11.5', '']] },
    { e: '24 &divide; 6 &times; 2', st: [['<u>24 &divide; 6</u> &times; 2', '&divide; and &times; are equal: go left to right'], ['4 &times; 2', 'Multiply'], ['8', '']] },
    { e: '1/2 + 1/4 &times; 2', st: [['1/2 + <u>1/4 &times; 2</u>', 'Multiply first'], ['1/2 + 1/2', 'Then add'], ['1', '']] }
  ];

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    rdx: { title: 'round any decimal', html: 
      '<div class="ctrl"><label for="rdx">Number<input type="text" inputmode="decimal" id="rdx" value="12.648"></label><label for="rdp">Round to the nearest<select id="rdp"><option value="0">whole number</option><option value="1">tenth</option><option value="2" selected>hundredth</option></select></label></div>' +
      '<div class="fig" id="rdfig"></div><div class="out" id="rdout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['rdx', 'rdp'], function () {
          var x = parseFloat($('#rdx', root).value), p = +$('#rdp', root).value;
          if (isNaN(x) || x < 0 || x > 1e6) { $('#rdout', root).innerHTML = '<p>Type a number from 0 to 1 000 000.</p>'; $('#rdfig', root).innerHTML = ''; return; }
          var r = roundTo(x, p), dig = Math.floor(cl(x * Math.pow(10, p + 1))) % 10;
          $('#rdfig', root).innerHTML = roundPic(x, p);
          $('#rdout', root).innerHTML = '<p>Look at the digit after the ' + PL[p] + (p ? 's' : 's') + ' place: <b>' + dig + '</b>. ' + (dig >= 5 ? 'It is 5 or more, so round up.' : 'It is less than 5, so round down.') + '</p><p class="big2">' + dec(x) + ' &asymp; ' + r.toFixed(p) + '</p>';
        });
      } },
    mfao: { title: 'the area model', html: 
      '<div class="ctrl"><label for="mfa">Columns: <output id="mfao"></output><input type="range" id="mfa" min="1" max="8" value="2"></label><label for="mfb">out of <output id="mfbo"></output><input type="range" id="mfb" min="1" max="8" value="3"></label></div>' +
      '<div class="ctrl"><label for="mfc">Rows: <output id="mfco"></output><input type="range" id="mfc" min="1" max="8" value="3"></label><label for="mfd">out of <output id="mfdo"></output><input type="range" id="mfd" min="1" max="8" value="5"></label></div>' +
      '<div class="fig" id="mffig"></div><div class="out" id="mfout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['mfa', 'mfb', 'mfc', 'mfd'], function () {
          var b = +$('#mfb', root).value, d = +$('#mfd', root).value, a = Math.min(+$('#mfa', root).value, b), c = Math.min(+$('#mfc', root).value, d);
          $('#mfao', root).textContent = a; $('#mfbo', root).textContent = b; $('#mfco', root).textContent = c; $('#mfdo', root).textContent = d;
          $('#mffig', root).innerHTML = areaFr(a, b, c, d);
          $('#mfout', root).innerHTML = '<p class="big2">' + fr(a, b) + ' &times; ' + fr(c, d) + ' = ' + fr(a * c, b * d) + (frs(a * c, b * d) !== fr(a * c, b * d) ? ' = ' + frs(a * c, b * d) : '') + '</p>';
        });
      } },
    dva: { title: 'how many fit?', html: 
      '<div class="ctrl"><label for="dva">Start with<select id="dva"><option value="1,2">1/2</option><option value="3,4">3/4</option><option value="1,1">1</option><option value="3,2" selected>1 1/2</option><option value="2,1">2</option><option value="5,2">2 1/2</option></select></label>' +
      '<label for="dvb">Pieces of size<select id="dvb"><option value="1,2">1/2</option><option value="1,3">1/3</option><option value="1,4">1/4</option><option value="3,4" selected>3/4</option><option value="1,6">1/6</option><option value="2,3">2/3</option><option value="1,8">1/8</option></select></label></div>' +
      '<div class="fig" id="dvfig"></div><div class="out" id="dvout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['dva', 'dvb'], function () {
          var p = $('#dva', root).value.split(',').map(Number), q = $('#dvb', root).value.split(',').map(Number);
          $('#dvfig', root).innerHTML = measure(p[0], p[1], q[0], q[1]);
          $('#dvout', root).innerHTML = '<p class="big2">' + frs(p[0], p[1]) + ' &divide; ' + fr(q[0], q[1]) + ' = ' + frs(p[0], p[1]) + ' &times; ' + fr(q[1], q[0]) + ' = ' + frs(p[0] * q[1], p[1] * q[0]) + '</p>';
        });
      } },
    mdao: { title: 'tenths times tenths', html: 
      '<div class="ctrl"><label for="mda">First: <output id="mdao"></output><input type="range" id="mda" min="1" max="10" value="6"></label><label for="mdb">Second: <output id="mdbo"></output><input type="range" id="mdb" min="1" max="10" value="7"></label></div>' +
      '<div class="fig" id="mdfig"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['mda', 'mdb'], function () {
          var a = +$('#mda', root).value, b = +$('#mdb', root).value;
          $('#mdao', root).textContent = dec(a / 10); $('#mdbo', root).textContent = dec(b / 10);
          $('#mdfig', root).innerHTML = grid(a, b) + '<p class="big2" style="text-align:center">' + dec(a / 10) + ' &times; ' + dec(b / 10) + ' = ' + dec(a * b / 100) + '</p>';
        });
      } },
    ddb: { title: 'count the jumps', html: 
      '<div class="ctrl"><label for="ddb">Jump size<select id="ddb"><option>0.2</option><option selected>0.25</option><option>0.4</option><option>0.5</option><option>0.75</option><option>1.5</option></select></label><label for="ddn">Number of jumps: <output id="ddno"></output><input type="range" id="ddn" min="1" max="12" value="6"></label></div>' +
      '<div class="fig" id="ddfig"></div><div class="out" id="ddout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['ddb', 'ddn'], function () {
          var b = parseFloat($('#ddb', root).value), n = +$('#ddn', root).value, a = cl(b * n), k = places(b), m = Math.pow(10, k);
          $('#ddno', root).textContent = n;
          $('#ddfig', root).innerHTML = jumps(a, b);
          $('#ddout', root).innerHTML = '<p class="big2">' + dec(a) + ' &divide; ' + dec(b) + ' = ' + n + '</p><p>Multiply both by ' + m + ': ' + dec(a * m) + ' &divide; ' + dec(b * m) + ' = ' + n + '.</p>';
        });
      } },
    ooe: { title: 'one step at a time', html: 
      '<div class="ctrl"><label for="ooe">Expression<select id="ooe">' + EXPR.map(function (x, i) { return '<option value="' + i + '">' + x.e.replace(/<[^>]+>/g, '').replace(/&times;/g, '×').replace(/&divide;/g, '÷').replace(/&minus;/g, '−').replace(/23/, '2³') + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="btnrow"><button type="button" class="btn" id="oonext">Show the next step</button><button type="button" class="btn alt" id="oores">Start again</button></div>' +
      '<ol class="oo" id="ooout"></ol>',
      init: function (root) {
        var $ = A.$;
        var step = 0;
        function oo() {
          var x = EXPR[+$('#ooe', root).value];
          $('#ooout', root).innerHTML = x.st.slice(0, step + 1).map(function (s, i) { return '<li><span class="math big2" style="font-size:1.3rem">' + (i ? '= ' : '') + s[0] + '</span>' + (s[1] && i === step ? ' <span class="t2">&larr; ' + s[1] + '</span>' : '') + '</li>'; }).join('');
          $('#oonext', root).disabled = step >= x.st.length - 1;
        }
        $('#ooe', root).addEventListener('change', function () { step = 0; oo(); });
        $('#oonext', root).addEventListener('click', function () { step++; oo(); });
        $('#oores', root).addEventListener('click', function () { step = 0; oo(); });
        oo();
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  function fq(q, n, d, hint, explain) { return { q: q + ' Type a fraction, like 2/5.', type: 'num', answer: n / d, show: plain(n, d), kb: 'text', tol: 1e-6, hint: hint, explain: explain }; }
  function sel(h, id) { return String(K.v(h, id)); }

  var LESSONS = [
    { id: 'round', title: 'Rounding decimals', sub: 'Give a sensible, shorter answer.', concepts: [
      { id: 'closer', title: 'Which one is it closer to?', exp: ['B1.6'], skill: 'md-round',
        body: '<p>To round, find the two numbers it is <b>between</b> at the place you want. Then ask which one it is <b>closer to</b>. Exactly halfway rounds <b>up</b>.</p>',
        watch: K.slides([
          { say: 'Round 3.47 to the nearest tenth.', fig: eq('3.47 &rarr; nearest tenth') },
          { say: 'It is between 3.4 and 3.5. Halfway is 3.45.', fig: eq('3.4 &nbsp; &larr; 3.45 &rarr; &nbsp; 3.5') },
          { say: '3.47 is past halfway, so it is closer to 3.5.', fig: function () { return roundPic(3.47, 1); } },
          { say: '3.47 rounds to <b>3.5</b>.', fig: eq('3.47 &asymp; 3.5'), ms: 2200 }
        ]),
        try: lab('rdx', [
          { do: 'Round <b>12.648</b> to the nearest <b>tenth</b>.', goal: function (h) { return parseFloat(K.v(h, 'rdx')) === 12.648 && K.v(h, 'rdp') === 1; }, yes: '12.648 is between 12.6 and 12.7. Halfway is 12.65, and 12.648 is just below it, so it rounds to <b>12.6</b>.' },
          { do: 'Type a number that rounds <b>up</b> to <b>4.0</b> at the nearest tenth.', goal: function (h) { var x = parseFloat(K.v(h, 'rdx')); return K.v(h, 'rdp') === 1 && x >= 3.95 && x < 4; }, yes: 'Anything from 3.95 up to 4 rounds to 4.0.' },
          { do: 'Type a number <b>exactly halfway</b>, like 2.35, and round to the tenth.', goal: function (h) { var c = Math.round(parseFloat(K.v(h, 'rdx')) * 1000); return K.v(h, 'rdp') === 1 && c % 100 === 50 && Math.abs(parseFloat(K.v(h, 'rdx')) * 1000 - c) < 1e-6; }, yes: 'Exactly halfway rounds up.' }
        ]),
        key: '<p><b>Between which two? Which is closer? Halfway rounds up.</b></p>',
        mistake: '<p>Rounding the digit itself instead of the place: 3.47 to the nearest tenth written as 3.5 is right, but 3.47 &rarr; 3.40 or 4 is not. Name the two neighbours out loud first.</p>',
        check: [function () { return { q: 'Round 5.982 to the nearest tenth.', type: 'num', answer: 6, show: '6.0', hint: 'It is between 5.9 and 6.0. Halfway is 5.95.', explain: '5.982 is past 5.95, so it rounds up to 6.0.' }; }, K.ck('md-round', 1), K.ck('md-round', 2)] },
      { id: 'digit', title: 'The next-digit shortcut', exp: ['B1.6'], skill: 'md-round', hard: true,
        body: '<p>A shortcut: look at the <b>digit just to the right</b> of the place you are rounding to. <b>5 or more: round up. Less than 5: round down.</b></p>',
        watch: K.slides([
          { say: 'Round 14.065 to the nearest hundredth. The hundredths digit is 6.', fig: eq('14.0<u>6</u>5') },
          { say: 'Look at the digit to its right: 5.', fig: eq('14.06<b style="color:var(--se)">5</b>') },
          { say: '5 or more, so round up: the 6 becomes 7.', fig: eq('14.065 &asymp; 14.07') },
          { say: 'Watch out for 9s. 5.98 to the nearest tenth: the 9 goes up and carries. It becomes <b>6.0</b>.', fig: function () { return roundPic(5.98, 1); }, ms: 2800 }
        ]),
        ways: [
          { label: 'On a number line', html: '<div class="fig">' + roundPic(14.065, 2) + '</div><p>14.065 is exactly halfway between 14.06 and 14.07, so it rounds up.</p>' },
          { label: 'Rounding money', html: '<p>Money is rounded to the nearest cent (hundredth). $3.746 is between $3.74 and $3.75. The next digit is 6, so it rounds to <b>$3.75</b>.</p>' },
          { label: 'Rounding with 9s', html: '<p>When a 9 rounds up, it carries like counting: 2.97 to the nearest tenth goes from 2.9 up to <b>3.0</b>. Keep the zero to show you rounded to the tenth.</p>' }
        ],
        key: '<p><b>Look one digit to the right. 5 or more, round up.</b></p>',
        mistake: '<p>Looking at the last digit of the number instead of the digit right after the rounding place. In 2.349 to the tenth, look at the 4, not the 9.</p>',
        check: [function () { return mc('Round 14.065 to the nearest hundredth.', '14.07', ['14.06', '14.1', '14.00'], 'Look at the thousandths digit.', 'The thousandths digit is 5, so round up: 14.07.'); }, K.ck('md-round', 3), K.ck('md-round', 2)] }
    ] },
    { id: 'fxf', title: 'Multiplying fractions', sub: '"Of" means times.', concepts: [
      { id: 'of', title: 'A fraction of a fraction', exp: ['B2.8'], skill: 'md-fxf',
        body: '<p>In math, <b>"of" means times</b>. ' + fr(1, 2) + ' of ' + fr(3, 4) + ' is ' + fr(1, 2) + ' &times; ' + fr(3, 4) + '. An <b>area model</b> shows it: the overlap is the answer.</p>',
        watch: K.slides([
          { say: 'Find one half of three quarters.', fig: eq(fr(1, 2) + ' of ' + fr(3, 4)) },
          { say: 'The square is one whole. Three quarters is shaded in rows. One half is shaded in columns.', fig: function () { return areaFr(1, 2, 3, 4); } },
          { say: 'The overlap is 3 of the 8 small rectangles: <b>three eighths</b>.', fig: function () { return areaFr(1, 2, 3, 4) + eq(fr(1, 2) + ' &times; ' + fr(3, 4) + ' = ' + fr(3, 8)); }, ms: 2600 }
        ]),
        try: lab('mfao', [
          { do: 'Show <b>2/3 &times; 3/5</b>.', goal: function (h) { return K.v(h, 'mfa') === 2 && K.v(h, 'mfb') === 3 && K.v(h, 'mfc') === 3 && K.v(h, 'mfd') === 5; }, yes: 'The overlap is 6 of 15 rectangles: 6/15 = 2/5.' },
          { do: 'Make an overlap of exactly <b>1/4</b> of the square.', goal: function (h) { var a = Math.min(K.v(h, 'mfa'), K.v(h, 'mfb')), c = Math.min(K.v(h, 'mfc'), K.v(h, 'mfd')); return 4 * a * c === K.v(h, 'mfb') * K.v(h, 'mfd'); }, yes: 'For example 1/2 &times; 1/2 = 1/4.' }
        ]),
        key: '<p><b>"Of" means times.</b> The overlap in the area model is the product.</p>',
        mistake: '<p>Expecting the answer to be bigger. A fraction of a fraction (both less than 1) is <b>smaller</b> than either one.</p>',
        check: [function () { return fq('Multiply: ' + fr(3, 5) + ' &times; ' + fr(1, 2) + '.', 3, 10, 'Multiply the tops, then the bottoms.', fr('3 &times; 1', '5 &times; 2') + ' = ' + fr(3, 10) + '.'); }, K.ck('md-fxf', 1)] },
      { id: 'rule', title: 'Tops times tops, bottoms times bottoms', exp: ['B2.8'], skill: 'md-fxf',
        body: '<p>To multiply fractions, <b>multiply the tops and multiply the bottoms</b>. You do <b>not</b> need a common denominator. Then simplify.</p>',
        watch: K.slides([
          { say: 'Two thirds times four fifths.', fig: eq(fr(2, 3) + ' &times; ' + fr(4, 5)) },
          { say: 'Tops: 2 times 4 is 8.', fig: eq(fr('2 &times; 4', '?') ) },
          { say: 'Bottoms: 3 times 5 is 15.', fig: eq(fr('2 &times; 4', '3 &times; 5') + ' = ' + fr(8, 15)) },
          { say: 'The area model agrees: 8 of 15 rectangles.', fig: function () { return areaFr(2, 3, 4, 5); }, ms: 2400 }
        ]),
        key: '<p><b>Multiply the tops. Multiply the bottoms. Simplify.</b></p>',
        mistake: '<p>Finding a common denominator first (a habit from adding), then keeping it: 2/3 &times; 4/5 = 10/15 &times; 12/15 = 120/15. Remind: common denominators are for adding and subtracting.</p>',
        check: [function () { var o = fq('Multiply: ' + fr(2, 3) + ' &times; ' + fr(9, 10) + '. Simplify your answer.', 3, 5, 'Multiply tops and bottoms, then simplify.', fr(18, 30) + ' = ' + fr(3, 5) + '.'); o.accept = A.lowest(3, 5); return o; }, K.ck('md-fxf', 2), K.ck('md-fxf', 2)] },
      { id: 'ofwhole', title: 'A fraction of an amount', exp: ['B2.8'], skill: 'md-fxf',
        body: '<p>To find ' + fr(2, 3) + ' of 12, <b>divide by the bottom, multiply by the top</b>. 12 &divide; 3 = 4, and 2 &times; 4 = 8.</p>',
        watch: K.slides([
          { say: 'A class has 12 students. Two thirds walk to school. How many?', fig: eq(fr(2, 3) + ' of 12') },
          { say: 'Split 12 into 3 equal groups: 4 in each.', fig: eq('12 &divide; 3 = 4') },
          { say: 'Two of the groups: 2 times 4 is 8.', fig: eq('2 &times; 4 = 8') },
          { say: 'The rule gives the same: two thirds times 12 over 1 is 24 thirds, which is 8.', fig: eq(fr(2, 3) + ' &times; ' + fr(12, 1) + ' = ' + fr(24, 3) + ' = 8'), ms: 2600 }
        ]),
        key: '<p><b>Divide by the bottom, multiply by the top.</b></p>',
        mistake: '<p>Dividing by the top and multiplying by the bottom (12 &divide; 2 &times; 3 = 18). The answer must be less than 12, because 2/3 is less than 1.</p>',
        check: [K.ck('md-fxf', 3), function () { var w = R.pick([12, 15, 18, 20, 24, 30]), f = [[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [5, 6]].filter(function (x) { return w % x[1] === 0; }), p = R.pick(f), a = w * p[0] / p[1]; return { q: 'What is ' + fr(p[0], p[1]) + ' of ' + w + '?', type: 'num', answer: a, hint: 'Divide ' + w + ' by ' + p[1] + ', then multiply by ' + p[0] + '.', explain: w + ' &divide; ' + p[1] + ' = ' + w / p[1] + ', and &times; ' + p[0] + ' = ' + a + '.' }; }] }
    ] },
    { id: 'fdf', title: 'Dividing fractions', sub: 'Division asks: how many fit?', concepts: [
      { id: 'fit', title: 'How many fit?', exp: ['B2.8'], skill: 'md-fdf', hard: true,
        body: '<p>Division asks <b>"how many fit?"</b> ' + A.mixed(1, 1, 2) + ' &divide; ' + fr(1, 4) + ' asks: how many quarters fit into one and a half?</p>',
        watch: K.slides([
          { say: 'Start with one and a half.', fig: eq(A.mixed(1, 1, 2) + ' &divide; ' + fr(1, 4)) },
          { say: 'Lay quarter pieces under it, one at a time.', fig: function () { return measure(3, 2, 1, 4); } },
          { say: 'Six quarters fit exactly. So one and a half divided by one quarter is 6.', fig: eq(fr(3, 2) + ' &divide; ' + fr(1, 4) + ' = 6') },
          { say: 'The answer is <b>bigger</b> than what we started with, because the pieces are smaller than 1.', fig: eq('6 &gt; ' + A.mixed(1, 1, 2)), ms: 2600 }
        ]),
        try: lab('dva', [
          { do: 'How many <b>1/4</b> pieces fit into <b>2</b>?', goal: function (h) { return sel(h, 'dva') === '2,1' && sel(h, 'dvb') === '1,4'; }, yes: '8 quarters fit into 2.' },
          { do: 'Find a choice where the pieces do <b>not</b> fit exactly.', goal: function (h) { var p = sel(h, 'dva').split(',').map(Number), q = sel(h, 'dvb').split(',').map(Number); return (p[0] * q[1]) % (p[1] * q[0]) !== 0; }, yes: 'Then the answer is a mixed number: some whole pieces and part of one more.' }
        ]),
        ways: [
          { label: 'Count in a common unit', html: '<p>Write both in quarters: ' + A.mixed(1, 1, 2) + ' = ' + fr(6, 4) + '. How many 1-quarters are in 6 quarters? <b>6</b>. With a common denominator, just divide the tops.</p>' },
          { label: 'Think of scoops', html: '<p>How many ' + fr(1, 3) + '-cup scoops fill 2 cups? Each cup takes 3 scoops, so 2 cups take <b>6</b>.</p><div class="fig">' + measure(2, 1, 1, 3) + '</div>' },
          { label: 'Use multiplication', html: '<p>Division undoes multiplication. ? &times; ' + fr(1, 4) + ' = ' + A.mixed(1, 1, 2) + '. Since 6 &times; ' + fr(1, 4) + ' = ' + fr(6, 4) + ', the answer is 6.</p>' }
        ],
        key: '<p><b>Dividing by a fraction asks how many pieces of that size fit.</b></p>',
        mistake: '<p>Expecting division to always make smaller. Dividing by a number less than 1 gives a <b>bigger</b> answer.</p>',
        check: [function () { return { q: 'How many ' + fr(1, 3) + '-cup scoops are in 2 cups?', type: 'num', answer: 6, fig: measure(2, 1, 1, 3), hint: 'Each cup holds 3 thirds.', explain: '2 &divide; ' + fr(1, 3) + ' = 6.' }; }, K.ck('md-fdf', 1), K.ck('md-fdf', 1)] },
      { id: 'flip', title: 'Multiply by the reciprocal', exp: ['B2.8'], skill: 'md-fdf', hard: true,
        body: '<p>To divide by a fraction, <b>flip the second fraction and multiply</b>. The flipped fraction is called the <b>reciprocal</b>: the reciprocal of ' + fr(3, 4) + ' is ' + fr(4, 3) + '.</p>',
        watch: K.slides([
          { say: 'Five sixths divided by two thirds.', fig: eq(fr(5, 6) + ' &divide; ' + fr(2, 3)) },
          { say: 'Keep the first fraction. Change divide to times. Flip the second.', fig: eq(fr(5, 6) + ' &times; ' + fr(3, 2)) },
          { say: 'Multiply: 15 over 12.', fig: eq(fr(5, 6) + ' &times; ' + fr(3, 2) + ' = ' + fr(15, 12)) },
          { say: 'Simplify: 15 twelfths is <b>1 and one quarter</b>.', fig: eq(fr(15, 12) + ' = ' + A.mixed(1, 1, 4)), ms: 2400 }
        ]),
        ways: [
          { label: 'Why it works', html: '<p>Dividing by ' + fr(1, 4) + ' asks how many quarters fit. Every whole holds 4 quarters, so it is the same as multiplying by 4, which is ' + fr(4, 1) + ', the reciprocal.</p>' },
          { label: 'Common denominator', html: '<p>Another way: ' + fr(5, 6) + ' &divide; ' + fr(2, 3) + ' = ' + fr(5, 6) + ' &divide; ' + fr(4, 6) + '. How many 4-sixths fit in 5-sixths? 5 &divide; 4 = ' + A.mixed(1, 1, 4) + '. Same answer.</p>' }
        ],
        key: '<p><b>Keep, change, flip.</b> Keep the first, change &divide; to &times;, flip the second.</p>',
        mistake: '<p>Flipping the first fraction instead of the second, or flipping both. Only the divisor (the second number) is flipped.</p>',
        check: [function () { return { q: 'Divide: ' + fr(5, 6) + ' &divide; ' + fr(2, 3) + '. Type a fraction or mixed number.', type: 'num', answer: 1.25, show: '1 1/4', kb: 'text', tol: 1e-6, hint: 'Flip the second fraction and multiply.', explain: fr(5, 6) + ' &times; ' + fr(3, 2) + ' = ' + fr(15, 12) + ' = ' + A.mixed(1, 1, 4) + '.' }; }, K.ck('md-fdf', 2), K.ck('md-fdf', 3)] },
      { id: 'compare', title: 'Times or divide?', exp: ['B2.8'], skill: 'md-fdf',
        body: '<div class="vs"><div><b class="t">' + fr(1, 2) + ' &times; ' + fr(1, 4) + '</b><p>Half <b>of</b> a quarter.</p><p>= ' + fr(1, 8) + ' (smaller)</p></div><div><b class="t">' + fr(1, 2) + ' &divide; ' + fr(1, 4) + '</b><p>How many quarters <b>fit in</b> a half?</p><p>= 2 (bigger)</p></div></div>',
        watch: K.slides([
          { say: 'Half of a quarter: the overlap is one eighth.', fig: function () { return areaFr(1, 2, 1, 4); } },
          { say: 'How many quarters fit in a half? Two.', fig: function () { return measure(1, 2, 1, 4); } },
          { say: 'Times a fraction less than 1: smaller. Divide by it: bigger.', fig: eq(fr(1, 2) + ' &times; ' + fr(1, 4) + ' = ' + fr(1, 8) + ' &nbsp;&nbsp; ' + fr(1, 2) + ' &divide; ' + fr(1, 4) + ' = 2'), ms: 2600 }
        ]),
        key: '<p>With a number less than 1: <b>multiplying makes smaller, dividing makes bigger.</b></p>',
        mistake: '<p>Choosing the operation by keywords alone. Ask: "a part of something?" (multiply) or "how many fit?" (divide).</p>',
        check: [function () { return mc('Which is greater?', '6 &divide; ' + fr(1, 2), ['6 &times; ' + fr(1, 2), 'They are equal'], 'How many halves fit in 6? What is half of 6?', '6 &divide; ' + fr(1, 2) + ' = 12 and 6 &times; ' + fr(1, 2) + ' = 3.'); },
          function () { var n = R.int(2, 5); return mc('A ribbon is ' + n + ' m long. You cut it into pieces ' + fr(1, 4) + ' m long. Which shows the number of pieces?', n + ' &divide; ' + fr(1, 4), [n + ' &times; ' + fr(1, 4), fr(1, 4) + ' &divide; ' + n], '"How many pieces fit?" is division.', n + ' &divide; ' + fr(1, 4) + ' = ' + 4 * n + ' pieces.'); }] }
    ] },
    { id: 'dxd', title: 'Multiplying decimals', sub: 'Count the decimal places.', concepts: [
      { id: 'grid', title: 'Tenths times tenths', exp: ['B2.9'], skill: 'md-dxd',
        body: '<p>A hundred grid shows 0.3 &times; 0.4. Shade 3 tenths one way and 4 tenths the other. The overlap is 12 small squares: <b>12 hundredths</b>.</p>',
        watch: K.slides([
          { say: 'A hundred grid is one whole. Shade 3 tenths across and 4 tenths down.', fig: function () { return grid(3, 4); } },
          { say: 'The overlap is 12 small squares. Each one is a hundredth: 0.12.', fig: eq('0.3 &times; 0.4 = 0.12'), ms: 2600 }
        ]),
        try: lab('mdao', [
          { do: 'Show <b>0.6 &times; 0.7</b>.', goal: function (h) { return K.v(h, 'mda') === 6 && K.v(h, 'mdb') === 7; }, yes: '42 hundredths: 0.42.' },
          { do: 'Make the product exactly <b>0.24</b>.', goal: function (h) { return K.v(h, 'mda') * K.v(h, 'mdb') === 24; }, yes: '0.4 &times; 0.6 or 0.3 &times; 0.8 both work.' },
          { do: 'Set one number to <b>1</b>. What happens?', goal: function (h) { return K.v(h, 'mda') === 10 || K.v(h, 'mdb') === 10; }, yes: 'Times 1 leaves the other number the same.' }
        ]),
        key: '<p><b>Tenths times tenths gives hundredths.</b></p>',
        mistake: '<p>0.3 &times; 0.4 = 1.2 or 0.7. Two numbers less than 1 multiply to a <b>smaller</b> number.</p>',
        check: [function () { return { q: 'Multiply: 0.6 &times; 0.8', type: 'num', answer: 0.48, hint: '6 &times; 8 = 48 hundredths.', explain: '0.48.' }; }, K.ck('md-dxd', 1)] },
      { id: 'places', title: 'Count the decimal places', exp: ['B2.9'], skill: 'md-dxd',
        body: '<p>Multiply as if there were <b>no decimal points</b>. Then count the decimal places in both numbers. The answer has <b>that many</b> places.</p>',
        watch: K.slides([
          { say: '2.4 times 1.3.', fig: eq('2.4 &times; 1.3') },
          { say: 'Ignore the points: 24 times 13 is 312.', fig: eq('24 &times; 13 = 312') },
          { say: 'One decimal place plus one decimal place is two.', fig: eq('2.<u>4</u> &times; 1.<u>3</u> &rarr; 2 places') },
          { say: 'Put two places in 312: <b>3.12</b>. Estimate: about 2 times 1.5 is 3. It fits.', fig: eq('2.4 &times; 1.3 = 3.12'), ms: 2800 }
        ]),
        key: '<p><b>Multiply the whole numbers. Count the places. Put the point back.</b></p>',
        mistake: '<p>Lining up the decimal points as in adding. In multiplication, count places instead, and check with an estimate.</p>',
        check: [function () { return { q: 'Multiply: 3.2 &times; 0.15', type: 'num', answer: 0.48, hint: '32 &times; 15 = 480. Count the decimal places.', explain: '32 &times; 15 = 480. Three places: 0.480 = 0.48.' }; }, K.ck('md-dxd', 2), K.ck('md-dxd', 2)] },
      { id: 'estimate', title: 'Estimate to check', exp: ['B2.9', 'B1.6'], skill: 'md-dxd',
        body: '<p>Before you trust an answer, <b>estimate</b>. Round each number to something easy, multiply, and see if your answer is close.</p>',
        watch: K.slides([
          { say: 'Gas costs $1.48 a litre. How much for 2.5 L?', fig: eq('1.48 &times; 2.5') },
          { say: 'Estimate: about 1.50 times 2.5 is about 3.75.', fig: eq('&asymp; 1.50 &times; 2.5 = 3.75') },
          { say: '148 times 25 is 3700. Three places: 3.700.', fig: eq('148 &times; 25 = 3700 &rarr; 3.700') },
          { say: 'The cost is <b>$3.70</b>. Close to the estimate, so it makes sense.', fig: eq('$3.70 &asymp; $3.75 &#10003;'), ms: 2600 }
        ]),
        key: '<p><b>Estimate first.</b> If the answer is far from the estimate, the decimal point is probably in the wrong place.</p>',
        mistake: '<p>Accepting $37.00 or $0.37 without checking. An estimate catches a misplaced point every time.</p>',
        check: [K.ck('md-dxd', 3), function () { return mc('Which is the best estimate for 4.9 &times; 3.1?', 'about 15', ['about 1.5', 'about 150', 'about 8'], 'Round to 5 &times; 3.', '5 &times; 3 = 15.'); }] }
    ] },
    { id: 'ddd', title: 'Dividing decimals', sub: 'How many jumps fit?', concepts: [
      { id: 'jumps', title: 'Count the jumps', exp: ['B2.9'], skill: 'md-ddd',
        body: '<p>Dividing asks how many fit. 1.2 &divide; 0.3 asks: <b>how many jumps of 0.3 reach 1.2?</b></p>',
        watch: K.slides([
          { say: 'How many jumps of 0.3 reach 1.2?', fig: eq('1.2 &divide; 0.3') },
          { say: 'Two jumps reach 0.6.', fig: function () { return jumps(0.6, 0.3); } },
          { say: 'Four jumps reach 1.2.', fig: function () { return jumps(1.2, 0.3); } },
          { say: 'So 1.2 divided by 0.3 is <b>4</b>.', fig: eq('1.2 &divide; 0.3 = 4'), ms: 2200 }
        ]),
        try: lab('ddb', [
          { do: 'Show <b>1.5 &divide; 0.25</b>.', goal: function (h) { return K.v(h, 'ddb') === 0.25 && K.v(h, 'ddn') === 6; }, yes: '6 jumps of 0.25 reach 1.5.' },
          { do: 'Make the jumps reach exactly <b>3</b>.', goal: function (h) { return Math.abs(K.v(h, 'ddb') * K.v(h, 'ddn') - 3) < 1e-9; }, yes: function (h) { return '3 &divide; ' + K.v(h, 'ddb') + ' = ' + K.v(h, 'ddn') + '.'; } }
        ]),
        key: '<p><b>Dividing asks how many jumps of that size fit.</b></p>',
        mistake: '<p>Dividing the bigger number into the smaller: 1.2 &divide; 0.3 written as 0.25. Read it as "how many 0.3s in 1.2?"</p>',
        check: [K.ck('md-ddd', 1), K.ck('md-ddd', 1)] },
      { id: 'shift', title: 'Make the divisor a whole number', exp: ['B2.9'], skill: 'md-ddd', hard: true,
        body: '<p>Multiply <b>both</b> numbers by 10 (or 100) until you are dividing by a whole number. The answer does not change.</p>',
        watch: K.slides([
          { say: '4.5 divided by 0.15. Dividing by a decimal is hard.', fig: eq('4.5 &divide; 0.15') },
          { say: 'Multiply both by 100. 0.15 becomes 15.', fig: eq('4.5 &times; 100 = 450 &nbsp; 0.15 &times; 100 = 15') },
          { say: 'Now it is 450 divided by 15.', fig: eq('450 &divide; 15') },
          { say: 'The answer is <b>30</b>, the same for both.', fig: eq('4.5 &divide; 0.15 = 450 &divide; 15 = 30'), ms: 2400 }
        ]),
        ways: [
          { label: 'Like changing units', html: '<p>How many 15¢ stickers can you buy with $4.50? Change both to cents: 450¢ &divide; 15¢ = 30. Same as 4.5 &divide; 0.15.</p>' },
          { label: 'Share equally', html: '<p>If 12 cookies are shared among 3 people, each gets 4. If 120 are shared among 30, each still gets 4. Scaling both numbers the same way keeps the answer.</p>' },
          { label: 'Check by multiplying', html: '<p>30 &times; 0.15 = 4.5. It works, so 4.5 &divide; 0.15 = 30.</p>' }
        ],
        key: '<p><b>Scale both numbers by the same power of 10. Then divide.</b></p>',
        mistake: '<p>Moving the point in only one number (4.5 &divide; 15 = 0.3). Whatever you do to one, do to the other.</p>',
        check: [function () { return { q: 'Divide: 3.6 &divide; 0.4', type: 'num', answer: 9, hint: 'Multiply both by 10: 36 &divide; 4.', explain: '36 &divide; 4 = 9.' }; }, K.ck('md-ddd', 2), K.ck('md-ddd', 3)] }
    ] },
    { id: 'order', title: 'Order of operations', sub: 'Everyone gets the same answer.', concepts: [
      { id: 'bedmas', title: 'BEDMAS', exp: ['B2.1'], skill: 'md-order',
        body: '<p>When there is more than one operation, use the same order every time: <b>B</b>rackets, <b>E</b>xponents, <b>D</b>ivide and <b>M</b>ultiply, <b>A</b>dd and <b>S</b>ubtract.</p>',
        watch: K.slides([
          { say: '6 + 4 &times; 3. Multiply before adding.', fig: eq('6 + <u>4 &times; 3</u>') },
          { say: '6 + 12 is <b>18</b>.', fig: eq('6 + 12 = 18') },
          { say: 'With brackets, (6 + 4) &times; 3: brackets come first.', fig: eq('<u>(6 + 4)</u> &times; 3') },
          { say: '10 &times; 3 is <b>30</b>. Brackets changed the answer.', fig: eq('10 &times; 3 = 30'), ms: 2400 }
        ]),
        try: lab('ooe', [
          { do: 'Step through <b>20 &minus; 2&sup3; &divide; 4</b> to the end.', goal: function (h) { var b = h.querySelector('#oonext'); return K.v(h, 'ooe') === 2 && b && b.disabled; }, yes: 'Exponent, then divide, then subtract: 18.' },
          { do: 'Step through <b>24 &divide; 6 &times; 2</b>.', goal: function (h) { var b = h.querySelector('#oonext'); return K.v(h, 'ooe') === 4 && b && b.disabled; }, yes: 'Left to right: 4 &times; 2 = 8.' }
        ]),
        key: '<p><b>B, E, then D and M left to right, then A and S left to right.</b></p>',
        mistake: '<p>Working strictly left to right: 6 + 4 &times; 3 = 30. Underline the first operation to do before writing anything.</p>',
        check: [K.ck('md-order', 1), K.ck('md-order', 1), K.ck('md-order', 2)] },
      { id: 'leftright', title: 'Equal partners go left to right', exp: ['B2.1'], skill: 'md-order', hard: true,
        body: '<p>Divide and multiply are <b>equal partners</b>. So are add and subtract. When partners meet, <b>go left to right</b>.</p>',
        watch: K.slides([
          { say: '24 &divide; 6 &times; 2. Divide and multiply are partners.', fig: eq('24 &divide; 6 &times; 2') },
          { say: 'Go left to right: 24 &divide; 6 first, which is 4.', fig: eq('<u>24 &divide; 6</u> &times; 2 = 4 &times; 2') },
          { say: '4 &times; 2 is <b>8</b>. Not 2!', fig: eq('= 8'), ms: 2200 }
        ]),
        ways: [
          { label: 'Turn it into one kind', html: '<p>Dividing by 6 is multiplying by ' + fr(1, 6) + '. So 24 &divide; 6 &times; 2 = 24 &times; ' + fr(1, 6) + ' &times; 2 = 8. All multiplication: any order works.</p>' },
          { label: 'Subtract and add', html: '<p>10 &minus; 3 + 2: left to right gives 7 + 2 = 9. Doing the add first gives 10 &minus; 5 = 5, which is wrong. Think of it as 10, take away 3, then add 2.</p>' }
        ],
        key: '<p><b>D and M are partners; A and S are partners. Partners go left to right.</b></p>',
        mistake: '<p>Reading BEDMAS as "M before D always" or "A before S always". Point out that they are on the same step.</p>',
        check: [function () { return { q: 'Evaluate: 18 &divide; (2 + 4) &times; 3', type: 'num', answer: 9, hint: 'Brackets first. Then divide and multiply left to right.', explain: '18 &divide; 6 &times; 3 = 3 &times; 3 = 9.' }; }, K.ck('md-order', 2), K.ck('md-order', 2)] },
      { id: 'story', title: 'Multi-step problems', exp: ['B2.1', 'B2.9'], skill: 'md-order',
        body: '<p>Many real problems are several steps written as one expression. Write it out, then follow the order of operations.</p>',
        watch: K.slides([
          { say: 'You buy 3 notebooks at $2.50 each and pay with a $10 bill. What is your change?', fig: eq('10 &minus; 3 &times; 2.50') },
          { say: 'Multiply first: 3 &times; 2.50 is 7.50.', fig: eq('10 &minus; 7.50') },
          { say: 'Then subtract: your change is <b>$2.50</b>.', fig: eq('= $2.50'), ms: 2200 }
        ]),
        key: '<p><b>Write the expression, then use BEDMAS.</b> Brackets can make the order clear.</p>',
        mistake: '<p>Subtracting first: 10 &minus; 3 = 7, then 7 &times; 2.50 = $17.50 in change from $10. Ask: does the answer make sense?</p>',
        check: [K.ck('md-order', 3), K.ck('md-order', 3)] }
    ] }
  ];


  A.register('mult-div', {
    lessons: LESSONS,

    quiz: [
      { q: 'Round 14.065 to the nearest hundredth.', type: 'mc', options: ['14.06', '14.07', '14.1', '14.00'], answer: 1, hint: 'Look at the thousandths digit.', explain: 'The thousandths digit is 5, so round the hundredths up: 14.07.' },
      { q: 'Multiply: ' + fr(2, 3) + ' &times; ' + fr(9, 10) + '. Type a fraction in simplest form.', type: 'num', answer: 0.6, show: '3/5', kb: 'text', accept: A.lowest(3, 5), hint: 'Multiply tops and bottoms, then simplify.', explain: fr(18, 30) + ' = ' + fr(3, 5) + '.' },
      { q: 'How many ' + fr(1, 3) + '-cup scoops are in 2 cups?', type: 'num', answer: 6, fig: measure(2, 1, 1, 3), hint: 'Each cup holds 3 thirds.', explain: '2 &divide; ' + fr(1, 3) + ' = 2 &times; 3 = 6 scoops.' },
      { q: 'Divide: ' + fr(5, 6) + ' &divide; ' + fr(2, 3) + '. Type a fraction or mixed number.', type: 'num', answer: 1.25, show: '1 1/4', kb: 'text', hint: 'Flip the second fraction and multiply.', explain: fr(5, 6) + ' &times; ' + fr(3, 2) + ' = ' + fr(15, 12) + ' = ' + A.mixed(1, 1, 4) + '.' },
      { q: 'Multiply: 3.2 &times; 0.15', type: 'num', answer: 0.48, hint: '32 &times; 15 = 480. Count the decimal places.', explain: '32 &times; 15 = 480. Three decimal places: 0.480 = 0.48.' },
      { q: 'Divide: 7.5 &divide; 0.25', type: 'num', answer: 30, hint: 'Multiply both by 100.', explain: '750 &divide; 25 = 30.' },
      { q: 'Evaluate: 5 + 3 &times; 2<sup>2</sup> &minus; 4', type: 'num', answer: 13, hint: 'Exponent first, then multiply, then add and subtract left to right.', explain: '2<sup>2</sup> = 4. 3 &times; 4 = 12. 5 + 12 &minus; 4 = 13.' }
    ],

    practice: [
      { id: 'md-round', name: 'Round decimals', code: 'B1.6', gen: function (lv) {
        var p = lv === 1 ? R.int(0, 1) : R.int(0, 2), dp = Math.min(3, p + R.int(1, 2)), x = cl(R.int(1, lv === 3 ? 999 : 99) + R.int(1, Math.pow(10, dp) - 1) / Math.pow(10, dp));
        if (lv === 3 && R.int(0, 1)) { x = cl(Math.floor(x * Math.pow(10, p)) / Math.pow(10, p) + 0.95 * Math.pow(10, -p) + (p < 2 ? 0.001 : 0.0001) * R.int(1, 4)); dp = places(x); }
        var r = roundTo(x, p), dig = Math.floor(cl(x * Math.pow(10, p + 1))) % 10, lo = cl(Math.floor(cl(x * Math.pow(10, p))) / Math.pow(10, p));
        return { q: 'Round ' + dec(x) + ' to the nearest ' + PL[p] + '.', type: 'num', answer: r, show: r.toFixed(p), fig: lv === 1 ? roundPic(x, p) : '',
          hint: 'Look at the digit just to the right of the ' + PL[p] + (p ? 's' : 's') + ' place.',
          steps: [dec(x) + ' is between ' + lo.toFixed(p) + ' and ' + cl(lo + Math.pow(10, -p)).toFixed(p) + '.', 'The next digit is ' + dig + '. ' + (dig >= 5 ? '5 or more: round up.' : 'Less than 5: round down.'), 'Answer: ' + r.toFixed(p) + '.'],
          explain: dec(x) + ' rounds to ' + r.toFixed(p) + '.' };
      } },
      { id: 'md-fxf', name: 'Multiply fractions', code: 'B2.8', gen: function (lv) {
        var a, b, c, d;
        if (lv === 1) { b = R.int(2, 6); d = R.int(2, 6); a = R.int(1, b - 1); c = R.int(1, d - 1); }
        else { b = R.int(2, 10); d = R.int(2, 10); a = R.int(1, b - 1); c = R.int(1, d - 1); }
        var N = a * c, D = b * d;
        if (lv === 3 && R.int(0, 1)) {
          var w = R.pick([12, 15, 18, 20, 24, 30, 36, 40]), f = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [5, 6]].filter(function (x) { return w % x[1] === 0; }), pf = R.pick(f);
          var ans = w * pf[0] / pf[1], thing = R.pick(['students in a class', 'kilometres on a bike trip', 'dollars of savings', 'apples in a box']);
          return { q: 'What is ' + fr(pf[0], pf[1]) + ' of ' + w + ' ' + thing + '?', type: 'num', answer: ans,
            hint: '"Of" means times. Find ' + fr(1, pf[1]) + ' of ' + w + ' first.',
            steps: ['"Of" means &times;: ' + fr(pf[0], pf[1]) + ' &times; ' + w + '.', fr(1, pf[1]) + ' of ' + w + ' is ' + w + ' &divide; ' + pf[1] + ' = ' + w / pf[1] + '.', pf[0] + ' &times; ' + w / pf[1] + ' = ' + ans + '.'],
            explain: fr(pf[0], pf[1]) + ' of ' + w + ' = ' + ans + '.' };
        }
        return { q: 'Multiply: ' + fr(a, b) + ' &times; ' + fr(c, d) + '. Type a fraction.', type: 'num', answer: N / D, show: plain(N, D), kb: 'text', tol: 1e-6, fig: lv === 1 ? areaFr(a, b, c, d) : '',
          hint: 'Multiply the tops. Multiply the bottoms. No common denominator needed.',
          steps: ['Tops: ' + a + ' &times; ' + c + ' = ' + N + '.', 'Bottoms: ' + b + ' &times; ' + d + ' = ' + D + '.', fr(N, D) + (gcd(N, D) > 1 ? ' = ' + frs(N, D) + ' in simplest form.' : '.')],
          explain: fr(a, b) + ' &times; ' + fr(c, d) + ' = ' + frs(N, D) + '.' };
      } },
      { id: 'md-fdf', name: 'Divide fractions', code: 'B2.8', gen: function (lv) {
        var a, b, c, d;
        if (lv === 1) { a = R.int(1, 4); b = 1; c = 1; d = R.int(2, 6); }
        else if (lv === 2) { b = R.int(2, 8); a = R.int(1, b - 1); c = 1; d = R.int(2, 8); if (R.int(0, 1)) { d = b * R.int(2, 3); } }
        else { b = R.int(2, 9); a = R.int(1, 2 * b); d = R.int(2, 9); c = R.int(1, d - 1); if (gcd(a, b) > 1) { var g = gcd(a, b); a /= g; b /= g; } if (b === 1 && a === 1) a = 3; }
        var N = a * d, D = b * c;
        var lhs = b === 1 ? String(a) : frs(a, b);
        return { q: 'Divide: ' + lhs + ' &divide; ' + fr(c, d) + '. Type a whole number, fraction or mixed number.', type: 'num', answer: N / D, show: plain(N, D), kb: 'text', tol: 1e-6,
          fig: lv === 1 && a <= 3 ? measure(a, b, c, d) : '',
          hint: lv === 1 ? 'How many pieces of ' + fr(c, d) + ' fit in ' + lhs + '? Each whole holds ' + d + '.' : 'Flip ' + fr(c, d) + ' to ' + fr(d, c) + ' and multiply.',
          steps: ['Flip the second fraction: the reciprocal of ' + fr(c, d) + ' is ' + fr(d, c) + '.', lhs + ' &times; ' + fr(d, c) + ' = ' + fr(N, D) + '.', 'Simplify: ' + frs(N, D) + '.'],
          explain: lhs + ' &divide; ' + fr(c, d) + ' = ' + frs(N, D) + '.' };
      } },
      { id: 'md-dxd', name: 'Multiply decimals', code: 'B2.9', gen: function (lv) {
        var x, y;
        if (lv === 1) { x = R.int(1, 9) / 10; y = R.int(1, 9) / 10; }
        else if (lv === 2) { x = R.int(11, 99) / 10; y = R.int(1, 9) / 10; }
        else { x = R.int(101, 999) / 100; y = R.int(11, 99) / 10; if (R.int(0, 1)) { var price = R.int(105, 299) / 100, L = R.int(11, 59) / 10; return money(price, L); } }
        x = cl(x); y = cl(y);
        var px = places(x), py = places(y), ix = Math.round(x * Math.pow(10, px)), iy = Math.round(y * Math.pow(10, py)), p = cl(x * y);
        return { q: 'Multiply: ' + dec(x) + ' &times; ' + dec(y), type: 'num', answer: p, fig: lv === 1 ? grid(Math.round(x * 10), Math.round(y * 10)) : '',
          hint: 'Multiply ' + ix + ' &times; ' + iy + ', then count the decimal places.',
          steps: ['Ignore the decimal points: ' + ix + ' &times; ' + iy + ' = ' + ix * iy + '.', 'Decimal places: ' + px + ' + ' + py + ' = ' + (px + py) + '.', 'Put ' + (px + py) + ' decimal places in ' + ix * iy + ': ' + dec(p) + '.'],
          explain: dec(x) + ' &times; ' + dec(y) + ' = ' + dec(p) + '.' };
        function money(pr, L) {
          var c = Math.round(cl(pr * L) * 100) / 100, exact = cl(pr * L);
          return { q: 'Gas costs $' + pr.toFixed(2) + ' per litre. How much do ' + dec(L) + ' L cost? Round to the nearest cent.', type: 'num', unit: '$', answer: c, tol: 0.0051,
            hint: 'Multiply ' + pr.toFixed(2) + ' &times; ' + dec(L) + ', then round to two decimal places.',
            steps: [Math.round(pr * 100) + ' &times; ' + Math.round(L * 10) + ' = ' + Math.round(pr * 100) * Math.round(L * 10) + '.', 'Three decimal places: ' + exact.toFixed(3) + '.', 'Round to the nearest cent: $' + c.toFixed(2) + '.'],
            explain: '$' + pr.toFixed(2) + ' &times; ' + dec(L) + ' = $' + exact.toFixed(3) + ', about $' + c.toFixed(2) + '.' };
        }
      } },
      { id: 'md-ddd', name: 'Divide decimals', code: 'B2.9', gen: function (lv) {
        var b, n;
        if (lv === 1) { b = R.int(1, 9) / 10; n = R.int(2, 9); }
        else if (lv === 2) { b = R.pick([0.2, 0.25, 0.4, 0.5, 0.3, 0.6, 0.8, 1.2, 1.5]); n = R.int(3, 16); }
        else { b = R.pick([0.04, 0.05, 0.12, 0.15, 0.25, 0.35, 0.45, 2.5, 1.25]); n = R.int(4, 40); }
        var a = cl(b * n), k = Math.max(places(a), places(b)), m = Math.pow(10, places(b));
        var ctx = lv === 3 && R.int(0, 1);
        return { q: ctx ? 'A ' + dec(a) + ' m ribbon is cut into pieces ' + dec(b) + ' m long. How many pieces?' : 'Divide: ' + dec(a) + ' &divide; ' + dec(b), type: 'num', answer: n,
          fig: lv === 1 ? jumps(a, b) : '',
          hint: 'Multiply both numbers by ' + m + ' so you divide by a whole number.',
          steps: ['Multiply both by ' + m + ': ' + dec(a * m) + ' &divide; ' + dec(b * m) + '.', dec(b * m) + ' &times; ' + n + ' = ' + dec(a * m) + '.', 'So the answer is ' + n + '.'],
          explain: dec(a) + ' &divide; ' + dec(b) + ' = ' + n + '. Check: ' + n + ' &times; ' + dec(b) + ' = ' + dec(a) + '.' };
      } },
      { id: 'md-order', name: 'Order of operations', code: 'B2.1', gen: function (lv) {
        var a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9), d = R.int(1, 9), t = R.int(0, 2), q, ans, steps;
        if (lv === 1) {
          if (t === 0) { q = a + ' + ' + b + ' &times; ' + c; ans = a + b * c; steps = ['Multiply first: ' + b + ' &times; ' + c + ' = ' + b * c + '.', 'Then add: ' + a + ' + ' + b * c + ' = ' + ans + '.']; }
          else if (t === 1) { q = '(' + a + ' + ' + b + ') &times; ' + c; ans = (a + b) * c; steps = ['Brackets first: ' + a + ' + ' + b + ' = ' + (a + b) + '.', 'Then multiply: ' + (a + b) + ' &times; ' + c + ' = ' + ans + '.']; }
          else { var big = b * c + R.int(0, 9); q = big + ' &minus; ' + b + ' &times; ' + c; ans = big - b * c; steps = ['Multiply first: ' + b + ' &times; ' + c + ' = ' + b * c + '.', 'Then subtract: ' + big + ' &minus; ' + b * c + ' = ' + ans + '.']; }
        } else if (lv === 2) {
          if (t === 0) { var p = a * b; q = p + ' &divide; ' + a + ' + ' + c + ' &times; ' + d; ans = b + c * d; steps = ['Divide: ' + p + ' &divide; ' + a + ' = ' + b + '.', 'Multiply: ' + c + ' &times; ' + d + ' = ' + c * d + '.', 'Add: ' + b + ' + ' + c * d + ' = ' + ans + '.']; }
          else if (t === 1) { var e2 = R.int(2, 3), bb = R.int(2, 4); q = c + ' + ' + bb + '<sup>' + e2 + '</sup> &times; ' + d; ans = c + Math.pow(bb, e2) * d; steps = ['Exponent: ' + bb + '<sup>' + e2 + '</sup> = ' + Math.pow(bb, e2) + '.', 'Multiply: ' + Math.pow(bb, e2) + ' &times; ' + d + ' = ' + Math.pow(bb, e2) * d + '.', 'Add: ' + c + ' + ' + Math.pow(bb, e2) * d + ' = ' + ans + '.']; }
          else { var m2 = a * c; q = m2 + ' &divide; ' + a + ' &times; ' + b; ans = c * b; steps = ['&divide; and &times; are equal, so go left to right.', m2 + ' &divide; ' + a + ' = ' + c + '.', c + ' &times; ' + b + ' = ' + ans + '.']; }
        } else {
          if (t === 0) { var x = R.int(1, 9) / 2; q = '2 &times; (' + dec(x) + ' + ' + a + ') &minus; ' + b; ans = cl(2 * (x + a) - b); steps = ['Brackets: ' + dec(x) + ' + ' + a + ' = ' + dec(x + a) + '.', 'Multiply: 2 &times; ' + dec(x + a) + ' = ' + dec(2 * (x + a)) + '.', 'Subtract: ' + dec(2 * (x + a)) + ' &minus; ' + b + ' = ' + dec(ans) + '.']; }
          else if (t === 1) { var n2 = R.int(2, 5), price = R.pick([1.25, 2.5, 3.75, 4.5, 0.75]), bill = R.pick([10, 20]); if (n2 * price >= bill) n2 = 2; q = 'You buy ' + n2 + ' items at $' + price.toFixed(2) + ' each and pay with $' + bill + '. Write and evaluate ' + bill + ' &minus; ' + n2 + ' &times; ' + price.toFixed(2) + '. What is your change?'; ans = cl(bill - n2 * price); steps = ['Multiply first: ' + n2 + ' &times; ' + price.toFixed(2) + ' = ' + (n2 * price).toFixed(2) + '.', 'Subtract: ' + bill + ' &minus; ' + (n2 * price).toFixed(2) + ' = ' + ans.toFixed(2) + '.']; return { q: q, type: 'num', unit: '$', answer: ans, hint: 'Multiply before you subtract.', steps: steps, explain: 'Your change is $' + ans.toFixed(2) + '.' }; }
          else { var s1 = R.int(2, 5); q = '(' + (a + s1) + ' &minus; ' + s1 + ')<sup>2</sup> &divide; ' + a + ' + ' + d; ans = a + d; steps = ['Brackets: ' + (a + s1) + ' &minus; ' + s1 + ' = ' + a + '.', 'Exponent: ' + a + '<sup>2</sup> = ' + a * a + '.', 'Divide: ' + a * a + ' &divide; ' + a + ' = ' + a + '. Add: ' + a + ' + ' + d + ' = ' + ans + '.']; }
        }
        return { q: 'Evaluate: <span class="math">' + q + '</span>', type: 'num', answer: ans,
          hint: 'BEDMAS: brackets, exponents, then divide and multiply left to right, then add and subtract left to right.', steps: steps, explain: 'The answer is ' + dec(ans) + '.' };
      } }
    ]
  });
})();
