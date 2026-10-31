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
        s += '<rect x="' + (x + col * sz) + '" y="' + (6 + (5 - row) * sz) + '" width="' + (sz - 1.5) + '" height="' + (sz - 1.5) + '" style="fill:' + (isStart ? 'var(--se)' : 'var(--sc)') + '"/>';
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

  A.register('algebra', {
    html:
'<section class="sec"><h2><span class="n">1</span>Linear growing patterns</h2>' +
'<p>A pattern can <b>repeat</b> (red, blue, red, blue), <b>grow</b> (3, 5, 7, 9) or <b>shrink</b> (20, 17, 14). In a <b>linear growing pattern</b> the same amount is added each time. That amount is the <b>constant rate</b>. The value before the first term, at term 0, is the <b>initial value</b>.</p>' +
'<div class="fig">' + tiles(2, 3, 4) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>This pattern starts with 3 orange tiles and adds 2 blue tiles each term. Rate: 2. Initial value: 3.</p>' +
'<p>The rule is <span class="math">' + expr(2, 3) + '</span>, where <i>n</i> is the term number. Term 10: 2 &times; 10 + 3 = <b>23 tiles</b>.</p>' +
'<p>Which term has 51 tiles? Solve 2<i>n</i> + 3 = 51. Take away 3: 2<i>n</i> = 48. Divide by 2: <i>n</i> = <b>24</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: build and compare two patterns</span>' +
'<div class="ctrl"><label for="pgm">Pattern A rate: <output id="pgmo"></output><input type="range" id="pgm" min="1" max="6" value="2"></label><label for="pgc">Pattern A initial value: <output id="pgco"></output><input type="range" id="pgc" min="0" max="10" value="3"></label></div>' +
'<div class="ctrl"><label for="pgm2">Pattern B rate: <output id="pgm2o"></output><input type="range" id="pgm2" min="1" max="6" value="4"></label><label for="pgc2">Pattern B initial value: <output id="pgc2o"></output><input type="range" id="pgc2" min="0" max="10" value="0"></label></div>' +
'<div class="fig" id="pgtiles"></div><div class="fig" id="pggraph"></div><div class="out" id="pgout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>On a graph, the <b>rate</b> is how steep the line is. The <b>initial value</b> is where it starts on the left (at term 0). A steeper pattern always catches up in the end.</p></div>' +
A.yt({ q: 'A pattern has the rule 5<i>n</i> + 2. What is term 8?', answer: 42, hint: 'Replace <i>n</i> with 8.', explain: '5 &times; 8 + 2 = 40 + 2 = 42.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Adding and subtracting like terms</h2>' +
'<p>A <b>variable</b> is a letter that stands for a number. <b>Like terms</b> have the same variable. You can add or subtract like terms, just as you add apples to apples.</p>' +
'<div class="eg"><b class="t">Worked example</b><p class="math" style="font-size:1.2rem">3<i>x</i> + 2<i>x</i> = 5<i>x</i></p><div class="vrow"><figure><figcaption>3<i>x</i></figcaption>' + atiles(3, 0) + '</figure><figure><figcaption>+ 2<i>x</i></figcaption>' + atiles(2, 0) + '</figure><figure><figcaption>= 5<i>x</i></figcaption>' + atiles(5, 0) + '</figure></div></div>' +
'<div class="vs"><div><b class="t">Like terms</b><p>4<i>a</i> and 7<i>a</i></p><p>4<i>a</i> + 7<i>a</i> = 11<i>a</i></p></div><div><b class="t">Not like terms</b><p>4<i>a</i> and 7</p><p>4<i>a</i> + 7 stays as it is. You cannot add a tile to a square.</p></div></div>' +
'<div class="lab"><span class="lt">Try it: combine tiles</span>' +
'<div class="ctrl"><label for="lta">First: <output id="ltao"></output><input type="range" id="lta" min="1" max="9" value="6"></label><label for="ltop">Operation<select id="ltop"><option value="1">+</option><option value="-1" selected>&minus;</option></select></label><label for="ltb">Second: <output id="ltbo"></output><input type="range" id="ltb" min="1" max="9" value="2"></label></div>' +
'<div class="fig" id="ltfig"></div><div class="out" id="ltout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>5<i>x</i> &minus; <i>x</i> is 4<i>x</i>, not 5. A lone <i>x</i> means 1<i>x</i>.</p></div>' +
A.yt({ q: 'Simplify 9<i>y</i> &minus; 4<i>y</i>. How many <i>y</i> are left? (Type the number in front of <i>y</i>.)', answer: 5, hint: '9 of something take away 4 of the same thing.', explain: '9<i>y</i> &minus; 4<i>y</i> = 5<i>y</i>.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Evaluating expressions</h2>' +
'<p>To <b>evaluate</b> an expression, replace the variable with its value. Then follow the order of operations. 3<i>n</i> means 3 &times; <i>n</i>.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Evaluate 4<i>n</i> &minus; 2.5 when <i>n</i> = 3.</p><p class="math">4 &times; 3 &minus; 2.5 = 12 &minus; 2.5 = <b>9.5</b></p></div>' +
'<div class="lab"><span class="lt">Try it: change the value of n</span>' +
'<div class="ctrl"><label for="evx">Expression<select id="evx"><option value="3,2">3n + 2</option><option value="2.5,1">2.5n + 1</option><option value="4,-3" selected>4n &minus; 3</option><option value="0.5,6">0.5n + 6</option></select></label><label for="evn"><i>n</i> = <output id="evno"></output><input type="range" id="evn" min="0" max="12" step="0.5" value="5"></label></div>' +
'<div class="out" id="evout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Write the multiplication sign when you replace the variable. 3<i>n</i> with <i>n</i> = 4 is 3 &times; 4 = 12, not 34.</p></div>' +
A.yt({ q: 'Evaluate 6 + 2<i>k</i> when <i>k</i> = 1.5.', answer: 9, hint: 'Multiply first: 2 &times; 1.5.', explain: '2 &times; 1.5 = 3, and 6 + 3 = 9.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Solving equations</h2>' +
'<p>An <b>equation</b> is like a balance: both sides weigh the same. To find <i>x</i>, do the same thing to both sides until <i>x</i> is alone. <b>Undo</b> the operations in reverse order.</p>' +
'<div class="fig">' + balance(3, 4, 19) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p class="math">3<i>x</i> + 4 = 19</p><p>Take 4 off both sides: 3<i>x</i> = 15. Split both sides into 3 equal groups: <i>x</i> = 5.</p><p><b>Check</b> by putting it back in: 3 &times; 5 + 4 = 19. It balances.</p></div>' +
'<div class="lab"><span class="lt">Try it: balance and solve</span>' +
'<div class="ctrl"><label for="eqa">Boxes of x: <output id="eqao"></output><input type="range" id="eqa" min="1" max="5" value="2"></label><label for="eqx">Secret x: <output id="eqxo"></output><input type="range" id="eqx" min="1" max="12" value="7"></label><label for="eqb">Extra weight: <output id="eqbo"></output><input type="range" id="eqb" min="0" max="15" value="5"></label></div>' +
'<div class="fig" id="eqfig"></div><div class="btnrow"><button type="button" class="btn" id="eqgo">Show the steps</button></div><div class="out" id="eqout"></div></div>' +
'<p>Some equations have <b>more than one term</b> with <i>x</i>. Combine like terms first. 2<i>x</i> + 3 + <i>x</i> = 18 becomes 3<i>x</i> + 3 = 18, so 3<i>x</i> = 15 and <i>x</i> = 5. Decimals work the same way: 2<i>x</i> + 1.5 = 9.5 gives 2<i>x</i> = 8, so <i>x</i> = 4.</p>' +
A.yt({ q: 'Solve: 5<i>x</i> &minus; 3 = 27. What is <i>x</i>?', answer: 6, hint: 'Undo the &minus; 3 first by adding 3 to both sides.', explain: '5<i>x</i> = 30, so <i>x</i> = 6. Check: 5 &times; 6 &minus; 3 = 27.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Inequalities</h2>' +
'<p>An <b>inequality</b> says one side is bigger or smaller. It has many solutions, so we show them on a number line.</p>' +
'<div class="tbl"><table><tbody><tr><td class="math">&lt;</td><td class="l">less than</td><td class="l">open dot: the number itself is not included</td></tr><tr><td class="math">&le;</td><td class="l">less than or equal to</td><td class="l">closed dot: the number is included</td></tr><tr><td class="math">&gt;</td><td class="l">greater than</td><td class="l">open dot</td></tr><tr><td class="math">&ge;</td><td class="l">greater than or equal to</td><td class="l">closed dot</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>You have $20. Movie tickets cost $6 and you need $2 for the bus. How many tickets can you buy? 6<i>t</i> + 2 &le; 20.</p><p>Solve like an equation: 6<i>t</i> &le; 18, so <i>t</i> &le; 3. You can buy 0, 1, 2 or 3 tickets.</p><div class="fig">' + ineqLine('<=', 3, -2, 8) + '</div>' +
'<p><b>Check</b> a value that works and one that does not: <i>t</i> = 3 gives 20 &le; 20, true. <i>t</i> = 4 gives 26 &le; 20, false.</p></div>' +
'<div class="lab"><span class="lt">Try it: graph an inequality</span>' +
'<div class="ctrl"><label for="iqop">x is<select id="iqop"><option value="<">less than (&lt;)</option><option value="<=">less than or equal (&le;)</option><option value=">" selected>greater than (&gt;)</option><option value=">=">greater than or equal (&ge;)</option></select></label><label for="iqv">this number: <output id="iqvo"></output><input type="range" id="iqv" min="-5" max="10" value="2"></label></div>' +
'<div class="fig" id="iqfig"></div><div class="out" id="iqout"></div></div>' +
A.yt({ q: 'Which value is a solution of 2<i>x</i> + 1 &gt; 9?', type: 'mc', options: ['2', '4', '5', '0'], answer: 2, hint: 'Solve: 2<i>x</i> &gt; 8, so <i>x</i> &gt; 4. Is 4 itself included?', explain: '<i>x</i> &gt; 4, so 5 works. 4 does not, because 2 &times; 4 + 1 = 9 is not greater than 9.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Reading and changing code</h2>' +
'<p>Code is a list of instructions a computer follows in order. A <b>loop</b> repeats instructions a set number of times (a <b>defined count</b>). A <b>sub-program</b> is a named set of steps you can use again. Loops make code <b>efficient</b>: shorter and easier to change.</p>' +
'<div class="row2"><div><p><b>Without a loop</b></p><span class="mono">total = 4\ntotal = total + 3\ntotal = total + 3\ntotal = total + 3\ntotal = total + 3\nshow total</span></div><div><p><b>With a loop</b></p><span class="mono">total = 4\nrepeat 4 times:\n    total = total + 3\nshow total</span></div></div>' +
'<p>Both show 16. The loop version is shorter, and to change 4 repeats into 100 you change one number. This code makes the pattern 3<i>n</i> + 4.</p>' +
'<div class="lab"><span class="lt">Try it: change the code and run it</span>' +
'<div class="ctrl"><label for="cds">total = <output id="cdso"></output><input type="range" id="cds" min="0" max="20" value="4"></label><label for="cdr">repeat ___ times: <output id="cdro"></output><input type="range" id="cdr" min="1" max="10" value="4"></label><label for="cdp">total = total + <output id="cdpo"></output><input type="range" id="cdp" min="-5" max="10" step="0.5" value="3"></label></div>' +
'<span class="mono" id="cdcode"></span><div class="out" id="cdout"></div></div>' +
'<div class="eg"><b class="t">Worked example: a sub-program</b><span class="mono">define addTax(price):\n    return price + price &times; 0.13\n\nshow addTax(20)\nshow addTax(50)</span><p>The sub-program is written once and used twice. It shows 22.6 and 56.5. To change the tax rate, you only change one line.</p></div>' +
A.yt({ q: 'What does this code show?<span class="mono">x = 50\nrepeat 6 times:\n    x = x &minus; 4\nshow x</span>', answer: 26, hint: 'Take 4 away 6 times: that is 24 in total.', explain: '50 &minus; 6 &times; 4 = 50 &minus; 24 = 26.' }) +
'</section>',

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
      A.bind(root, ['lta', 'ltop', 'ltb'], function () {
        var a = +$('#lta', root).value, op = +$('#ltop', root).value, b = +$('#ltb', root).value, r = a + op * b;
        $('#ltao', root).innerHTML = a + '<i>x</i>'; $('#ltbo', root).innerHTML = b + '<i>x</i>';
        $('#ltfig', root).innerHTML = '<div class="vrow"><figure><figcaption>' + a + '<i>x</i></figcaption>' + atiles(a, 0) + '</figure><figure><figcaption>' + (op > 0 ? '+ ' : '&minus; ') + b + '<i>x</i></figcaption>' + atiles(op * b, 0) + '</figure><figure><figcaption>= ' + (r === 0 ? '0' : r === 1 ? '<i>x</i>' : r === -1 ? '&minus;<i>x</i>' : dec(r) + '<i>x</i>') + '</figcaption>' + (r ? atiles(r, 0) : '<p class="t2">(nothing left)</p>') + '</figure></div>';
        $('#ltout', root).innerHTML = '<p class="big2">' + a + '<i>x</i> ' + (op > 0 ? '+' : '&minus;') + ' ' + b + '<i>x</i> = ' + (r === 1 ? '' : r === -1 ? '&minus;' : dec(r)) + (r ? '<i>x</i>' : '') + '</p>' + (op < 0 && b > a ? '<p>Red tiles are negative: you took away more than you had.</p>' : '');
      });
      A.bind(root, ['evx', 'evn'], function () {
        var p = $('#evx', root).value.split(',').map(Number), n = +$('#evn', root).value, v = cl(p[0] * n + p[1]);
        $('#evno', root).textContent = dec(n);
        $('#evout', root).innerHTML = '<p class="big2">' + expr(p[0], p[1]) + '</p><p class="big2">= ' + dec(p[0]) + ' &times; ' + dec(n) + (p[1] > 0 ? ' + ' + p[1] : ' &minus; ' + (-p[1])) + ' = ' + dec(p[0] * n) + (p[1] > 0 ? ' + ' + p[1] : ' &minus; ' + (-p[1])) + ' = ' + dec(v) + '</p>';
      });
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
      A.bind(root, ['iqop', 'iqv'], function () {
        var op = $('#iqop', root).value, v = +$('#iqv', root).value;
        $('#iqvo', root).textContent = dec(v);
        $('#iqfig', root).innerHTML = ineqLine(op, v);
        var whole = [];
        for (var t = v - 3; t <= v + 3; t++) { var ok = op === '<' ? t < v : op === '<=' ? t <= v : op === '>' ? t > v : t >= v; if (ok) whole.push(dec(t)); }
        $('#iqout', root).innerHTML = '<p class="big2"><i>x</i> ' + OPS[op] + ' ' + dec(v) + '</p><p>' + (op.length > 1 ? 'Closed dot: ' + dec(v) + ' is a solution.' : 'Open dot: ' + dec(v) + ' is not a solution.') + ' Some integer solutions: ' + whole.join(', ') + ', ...</p>';
      });
      A.bind(root, ['cds', 'cdr', 'cdp'], function () {
        var s0 = +$('#cds', root).value, r = +$('#cdr', root).value, p = +$('#cdp', root).value, rows = runCode(s0, p, r);
        $('#cdso', root).textContent = s0; $('#cdro', root).textContent = r; $('#cdpo', root).textContent = dec(p);
        $('#cdcode', root).innerHTML = 'total = ' + s0 + '\nrepeat ' + r + ' times:\n    total = total ' + (p < 0 ? '&minus; ' + dec(-p) : '+ ' + dec(p)) + '\nshow total';
        $('#cdout', root).innerHTML = '<div class="tbl"><table><thead><tr><th>Time through the loop</th>' + rows.map(function (x) { return '<th>' + x[0] + '</th>'; }).join('') + '</tr></thead><tbody><tr><td>total</td>' + rows.map(function (x) { return '<td>' + dec(x[1]) + '</td>'; }).join('') + '</tr></tbody></table></div>' +
          '<p>The code shows <b class="big2">' + dec(rows[rows.length - 1][1]) + '</b>. That is ' + s0 + ' + ' + r + ' &times; ' + (p < 0 ? '(' + dec(p) + ')' : dec(p)) + '.</p>';
      });
    },

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
})();
