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

  A.register('mult-div', {
    html:
'<section class="sec"><h2><span class="n">1</span>Rounding decimals</h2>' +
'<p>To round, find the two numbers it is between at the place you want. Then ask: which one is it closer to? Exactly halfway rounds <b>up</b>.</p>' +
'<div class="fig">' + roundPic(3.47, 1) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Round 3.47 to the nearest tenth. It is between 3.4 and 3.5. Halfway is 3.45. 3.47 is past halfway, so it rounds to <b>3.5</b>.</p><p>Short cut: look at the digit just to the right of the tenths, the 7. It is 5 or more, so round up.</p></div>' +
'<div class="lab"><span class="lt">Try it: round any decimal</span>' +
'<div class="ctrl"><label for="rdx">Number<input type="text" inputmode="decimal" id="rdx" value="12.648"></label><label for="rdp">Round to the nearest<select id="rdp"><option value="0">whole number</option><option value="1">tenth</option><option value="2" selected>hundredth</option></select></label></div>' +
'<div class="fig" id="rdfig"></div><div class="out" id="rdout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>We round to give a sensible answer. Money is rounded to the hundredth (the nearest cent). A runner\'s time might be rounded to the tenth of a second.</p></div>' +
A.yt({ q: 'Round 5.982 to the nearest tenth.', answer: 6, show: '6.0', hint: 'It is between 5.9 and 6.0. Halfway is 5.95.', explain: '5.982 is past 5.95, so it rounds up to 6.0.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Multiplying fractions</h2>' +
'<p>In math, <b>"of" means times</b>. ' + fr(1, 2) + ' of ' + fr(3, 4) + ' means ' + fr(1, 2) + ' &times; ' + fr(3, 4) + '. An <b>area model</b> shows it: shade one fraction in columns and the other in rows. The overlap is the answer.</p>' +
'<div class="fig">' + areaFr(1, 2, 3, 4) + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>Multiply the tops. Multiply the bottoms. ' + fr(2, 3) + ' &times; ' + fr(4, 5) + ' = ' + fr('2 &times; 4', '3 &times; 5') + ' = ' + fr(8, 15) + '. You do <b>not</b> need a common denominator.</p></div>' +
'<div class="lab"><span class="lt">Try it: the area model</span>' +
'<div class="ctrl"><label for="mfa">Columns: <output id="mfao"></output><input type="range" id="mfa" min="1" max="8" value="2"></label><label for="mfb">out of <output id="mfbo"></output><input type="range" id="mfb" min="1" max="8" value="3"></label></div>' +
'<div class="ctrl"><label for="mfc">Rows: <output id="mfco"></output><input type="range" id="mfc" min="1" max="8" value="3"></label><label for="mfd">out of <output id="mfdo"></output><input type="range" id="mfd" min="1" max="8" value="5"></label></div>' +
'<div class="fig" id="mffig"></div><div class="out" id="mfout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A recipe needs ' + fr(3, 4) + ' cup of flour. You make ' + fr(2, 3) + ' of the recipe. How much flour?</p><p class="math">' + fr(2, 3) + ' &times; ' + fr(3, 4) + ' = ' + fr(6, 12) + ' = ' + fr(1, 2) + ' cup</p></div>' +
A.yt({ q: 'Multiply: ' + fr(3, 5) + ' &times; ' + fr(1, 2) + '. Type a fraction.', answer: 0.3, show: '3/10', kb: 'text', hint: 'Multiply the tops, then the bottoms.', explain: fr('3 &times; 1', '5 &times; 2') + ' = ' + fr(3, 10) + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Dividing fractions</h2>' +
'<p>Division asks <b>"how many fit?"</b>. ' + A.mixed(1, 1, 2) + ' &divide; ' + fr(1, 4) + ' asks: how many quarters fit into one and a half?</p>' +
'<div class="fig">' + measure(3, 2, 1, 4) + '</div>' +
'<p>Six quarters fit, so ' + fr(3, 2) + ' &divide; ' + fr(1, 4) + ' = 6. Notice that the answer is <b>bigger</b> than what you started with. That happens when you divide by a number less than 1.</p>' +
'<div class="key"><b class="t">Key idea: multiply by the reciprocal</b><p>To divide by a fraction, flip the second fraction and multiply. The flipped fraction is the <b>reciprocal</b>.</p><p class="math">' + fr(3, 2) + ' &divide; ' + fr(1, 4) + ' = ' + fr(3, 2) + ' &times; ' + fr(4, 1) + ' = ' + fr(12, 2) + ' = 6</p></div>' +
'<div class="vs"><div><b class="t">Multiply: ' + fr(1, 2) + ' &times; ' + fr(1, 4) + '</b><p>Half <b>of</b> a quarter.</p><p>= ' + fr(1, 8) + ' (smaller)</p></div><div><b class="t">Divide: ' + fr(1, 2) + ' &divide; ' + fr(1, 4) + '</b><p>How many quarters <b>fit in</b> a half?</p><p>= 2 (bigger)</p></div></div>' +
'<div class="lab"><span class="lt">Try it: how many fit?</span>' +
'<div class="ctrl"><label for="dva">Start with<select id="dva"><option value="1,2">1/2</option><option value="3,4">3/4</option><option value="1,1">1</option><option value="3,2" selected>1 1/2</option><option value="2,1">2</option><option value="5,2">2 1/2</option></select></label>' +
'<label for="dvb">Pieces of size<select id="dvb"><option value="1,2">1/2</option><option value="1,3">1/3</option><option value="1,4">1/4</option><option value="3,4" selected>3/4</option><option value="1,6">1/6</option><option value="2,3">2/3</option><option value="1,8">1/8</option></select></label></div>' +
'<div class="fig" id="dvfig"></div><div class="out" id="dvout"></div></div>' +
A.yt({ q: 'Divide: 3 &divide; ' + fr(3, 4) + '.', answer: 4, hint: 'How many three-quarter pieces fit into 3? Or flip and multiply: 3 &times; ' + fr(4, 3) + '.', explain: '3 &times; ' + fr(4, 3) + ' = ' + fr(12, 3) + ' = 4. Four pieces of ' + fr(3, 4) + ' make 3.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Multiplying decimals</h2>' +
'<p>A hundred grid shows ' + '0.3 &times; 0.4. Shade 3 tenths one way and 4 tenths the other. The overlap is 12 small squares, which is 12 hundredths.</p>' +
'<div class="fig">' + grid(3, 4) + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>Multiply as if there were no decimal points. Then count the decimal places in the two numbers. The answer has that many decimal places.</p><p class="math">2.4 &times; 1.3: 24 &times; 13 = 312. One place + one place = two places. Answer: 3.12</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Gas costs $1.48 per litre. How much for 2.5 L? 148 &times; 25 = 3700. Two places + one place = three places: 3.700. Cost: <b>$3.70</b>.</p><p>Estimate to check: about $1.50 &times; 2.5 is about $3.75. Close.</p></div>' +
'<div class="lab"><span class="lt">Try it: tenths times tenths</span>' +
'<div class="ctrl"><label for="mda">First: <output id="mdao"></output><input type="range" id="mda" min="1" max="10" value="6"></label><label for="mdb">Second: <output id="mdbo"></output><input type="range" id="mdb" min="1" max="10" value="7"></label></div>' +
'<div class="fig" id="mdfig"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>0.3 &times; 0.4 is not 1.2 and not 0.7. Multiplying two numbers less than 1 gives a <b>smaller</b> number: 0.12.</p></div>' +
A.yt({ q: 'Multiply: 0.6 &times; 0.8', answer: 0.48, hint: '6 &times; 8 = 48. How many decimal places in total?', explain: '6 &times; 8 = 48, and there are two decimal places in total: 0.48.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Dividing decimals</h2>' +
'<p>Dividing asks how many fit. 1.2 &divide; 0.3 asks: how many jumps of 0.3 reach 1.2?</p>' +
'<div class="fig">' + jumps(1.2, 0.3) + '</div>' +
'<div class="key"><b class="t">Key idea: make the divisor a whole number</b><p>Multiply <b>both</b> numbers by 10 (or 100) until you divide by a whole number. The answer does not change.</p><p class="math">1.2 &divide; 0.3 = 12 &divide; 3 = 4 &nbsp;&nbsp; 4.5 &divide; 0.15 = 450 &divide; 15 = 30</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A 2.4 m board is cut into pieces 0.6 m long. How many pieces? 2.4 &divide; 0.6 = 24 &divide; 6 = <b>4 pieces</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: count the jumps</span>' +
'<div class="ctrl"><label for="ddb">Jump size<select id="ddb"><option>0.2</option><option selected>0.25</option><option>0.4</option><option>0.5</option><option>0.75</option><option>1.5</option></select></label><label for="ddn">Number of jumps: <output id="ddno"></output><input type="range" id="ddn" min="1" max="12" value="6"></label></div>' +
'<div class="fig" id="ddfig"></div><div class="out" id="ddout"></div></div>' +
A.yt({ q: 'Divide: 3.6 &divide; 0.4', answer: 9, hint: 'Multiply both by 10: 36 &divide; 4.', explain: '3.6 &divide; 0.4 = 36 &divide; 4 = 9.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Order of operations</h2>' +
'<p>When a question has more than one operation, everyone must do them in the same order, or we get different answers. Remember <b>BEDMAS</b>:</p>' +
'<div class="tbl"><table><tbody><tr><td><b>B</b></td><td class="l">Brackets first</td></tr><tr><td><b>E</b></td><td class="l">Exponents</td></tr><tr><td><b>D M</b></td><td class="l">Divide and multiply, left to right</td></tr><tr><td><b>A S</b></td><td class="l">Add and subtract, left to right</td></tr></tbody></table></div>' +
'<div class="vs"><div><b class="t">6 + 4 &times; 3</b><p>Multiply first: 6 + 12 = <b>18</b></p></div><div><b class="t">(6 + 4) &times; 3</b><p>Brackets first: 10 &times; 3 = <b>30</b></p></div></div>' +
'<div class="lab"><span class="lt">Try it: one step at a time</span>' +
'<div class="ctrl"><label for="ooe">Expression<select id="ooe">' + EXPR.map(function (x, i) { return '<option value="' + i + '">' + x.e.replace(/<[^>]+>/g, '').replace(/&times;/g, '×').replace(/&divide;/g, '÷').replace(/&minus;/g, '−').replace(/23/, '2³') + '</option>'; }).join('') + '</select></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="oonext">Show the next step</button><button type="button" class="btn alt" id="oores">Start again</button></div>' +
'<ol class="oo" id="ooout"></ol></div>' +
'<div class="eg"><b class="t">Worked example: a multi-step problem</b><p>You buy 3 notebooks at $2.50 each and pay with a $10 bill. Change: 10 &minus; 3 &times; 2.50 = 10 &minus; 7.50 = <b>$2.50</b>. Multiply before subtracting.</p></div>' +
A.yt({ q: 'Evaluate: 18 &divide; (2 + 4) &times; 3', answer: 9, hint: 'Brackets first. Then divide and multiply from left to right.', explain: '18 &divide; 6 &times; 3 = 3 &times; 3 = 9.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.bind(root, ['rdx', 'rdp'], function () {
        var x = parseFloat($('#rdx', root).value), p = +$('#rdp', root).value;
        if (isNaN(x) || x < 0 || x > 1e6) { $('#rdout', root).innerHTML = '<p>Type a number from 0 to 1 000 000.</p>'; $('#rdfig', root).innerHTML = ''; return; }
        var r = roundTo(x, p), dig = Math.floor(cl(x * Math.pow(10, p + 1))) % 10;
        $('#rdfig', root).innerHTML = roundPic(x, p);
        $('#rdout', root).innerHTML = '<p>Look at the digit after the ' + PL[p] + (p ? 's' : 's') + ' place: <b>' + dig + '</b>. ' + (dig >= 5 ? 'It is 5 or more, so round up.' : 'It is less than 5, so round down.') + '</p><p class="big2">' + dec(x) + ' &asymp; ' + r.toFixed(p) + '</p>';
      });
      A.bind(root, ['mfa', 'mfb', 'mfc', 'mfd'], function () {
        var b = +$('#mfb', root).value, d = +$('#mfd', root).value, a = Math.min(+$('#mfa', root).value, b), c = Math.min(+$('#mfc', root).value, d);
        $('#mfao', root).textContent = a; $('#mfbo', root).textContent = b; $('#mfco', root).textContent = c; $('#mfdo', root).textContent = d;
        $('#mffig', root).innerHTML = areaFr(a, b, c, d);
        $('#mfout', root).innerHTML = '<p class="big2">' + fr(a, b) + ' &times; ' + fr(c, d) + ' = ' + fr(a * c, b * d) + (frs(a * c, b * d) !== fr(a * c, b * d) ? ' = ' + frs(a * c, b * d) : '') + '</p>';
      });
      A.bind(root, ['dva', 'dvb'], function () {
        var p = $('#dva', root).value.split(',').map(Number), q = $('#dvb', root).value.split(',').map(Number);
        $('#dvfig', root).innerHTML = measure(p[0], p[1], q[0], q[1]);
        $('#dvout', root).innerHTML = '<p class="big2">' + frs(p[0], p[1]) + ' &divide; ' + fr(q[0], q[1]) + ' = ' + frs(p[0], p[1]) + ' &times; ' + fr(q[1], q[0]) + ' = ' + frs(p[0] * q[1], p[1] * q[0]) + '</p>';
      });
      A.bind(root, ['mda', 'mdb'], function () {
        var a = +$('#mda', root).value, b = +$('#mdb', root).value;
        $('#mdao', root).textContent = dec(a / 10); $('#mdbo', root).textContent = dec(b / 10);
        $('#mdfig', root).innerHTML = grid(a, b) + '<p class="big2" style="text-align:center">' + dec(a / 10) + ' &times; ' + dec(b / 10) + ' = ' + dec(a * b / 100) + '</p>';
      });
      A.bind(root, ['ddb', 'ddn'], function () {
        var b = parseFloat($('#ddb', root).value), n = +$('#ddn', root).value, a = cl(b * n), k = places(b), m = Math.pow(10, k);
        $('#ddno', root).textContent = n;
        $('#ddfig', root).innerHTML = jumps(a, b);
        $('#ddout', root).innerHTML = '<p class="big2">' + dec(a) + ' &divide; ' + dec(b) + ' = ' + n + '</p><p>Multiply both by ' + m + ': ' + dec(a * m) + ' &divide; ' + dec(b * m) + ' = ' + n + '.</p>';
      });
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
    },

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
