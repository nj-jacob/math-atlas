(function () {
  var A = Atlas, R = A.R, N = A.neg;
  function cl(x) { return parseFloat(x.toPrecision(10)); }
  /* "5x − 4" style; v is the variable */
  function ex(a, b, v) {
    v = v || 'x';
    var s = a === 0 ? '' : a === 1 ? v : a === -1 ? '&minus;' + v : N(a) + v;
    if (b === 0) return s || '0';
    if (!s) return N(b);
    return s + (b < 0 ? ' &minus; ' + Math.abs(b) : ' + ' + b);
  }
  function rule(m, b) { return 't = ' + ex(m, b, 'n'); }
  function P(n) { return n < 0 ? '(' + N(n) + ')' : String(n); }

  /* figures 1 to 4 of a tile pattern: b starting tiles (accent) plus m tiles per figure (strand) */
  function tiles(m, b, count) {
    count = count || 4;
    var u = 13, s = '', x = 6, H = 0, cols = Math.max(1, m);
    for (var n = 1; n <= count; n++) {
      var tot = m * n + b, colH = Math.ceil(Math.max(b, 1) / cols), y0 = 8, k = 0;
      /* starting tiles in a block at the bottom, growth tiles stacked above in rows of m */
      var rows = [], i;
      for (i = 0; i < b; i++) rows.push(0);
      for (i = 0; i < m * n; i++) rows.push(1);
      var perRow = Math.max(2, cols), nrows = Math.ceil(rows.length / perRow);
      H = Math.max(H, nrows * u);
      rows.forEach(function (t, j) {
        var cx = x + (j % perRow) * u, cy = 8 + (nrows - 1 - Math.floor(j / perRow)) * u;
        s += '<rect x="' + cx + '" y="' + cy + '" width="' + (u - 1.5) + '" height="' + (u - 1.5) + '" rx="1.5" style="fill:' + (t ? 'var(--strand)' : 'var(--accent)') + '"/>';
      });
      s += '<text x="' + (x + perRow * u / 2) + '" y="__Y__" text-anchor="middle" font-size="16" class="tb">Fig. ' + n + '</text><text x="' + (x + perRow * u / 2) + '" y="__Y2__" text-anchor="middle" font-size="16" class="t2">' + tot + ' tiles</text>';
      x += perRow * u + 26;
    }
    var Y = 8 + H + 22;
    s = s.split('__Y__').join(Y).split('__Y2__').join(Y + 20);
    return A.svg(Math.max(x, 200), Y + 28, s, 'A tile pattern. Figure 1 has ' + (m + b) + ' tiles. Each figure adds ' + m + ' purple tiles to ' + b + ' orange starting tiles.');
  }
  /* table of values plus graph for t = m n + b, n = 0..5 (or 1..5) */
  function graph(lines, from) {
    from = from || 0;
    var x0 = 46, y0 = 196, W = 340, H = 180, s = '', lo = 0, hi = 0;
    lines.forEach(function (L) { for (var n = from; n <= 6; n++) { var v = L.m * n + L.b; lo = Math.min(lo, v); hi = Math.max(hi, v); } });
    var step = hi - lo > 60 ? 20 : hi - lo > 24 ? 10 : hi - lo > 12 ? 4 : 2;
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step; if (hi === lo) hi = lo + step;
    function X(n) { return x0 + W * n / 6; } function Y(v) { return y0 - H * (v - lo) / (hi - lo); }
    for (var v = lo; v <= hi; v += step) s += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + (x0 + W) + '" y2="' + Y(v) + '" style="stroke:var(--line)"/><text x="' + (x0 - 8) + '" y="' + (Y(v) + 5) + '" text-anchor="end" font-size="15">' + (v < 0 ? '−' + -v : v) + '</text>';
    for (var n = 0; n <= 6; n++) s += '<text x="' + X(n) + '" y="' + (y0 + 20) + '" text-anchor="middle" font-size="15">' + n + '</text>';
    s += '<line x1="' + x0 + '" y1="' + Y(Math.max(lo, 0)) + '" x2="' + (x0 + W) + '" y2="' + Y(Math.max(lo, 0)) + '" style="stroke:var(--ink)" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + (y0 - H) + '" x2="' + x0 + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="1.5"/>';
    s += '<text x="' + (x0 + W / 2) + '" y="' + (y0 + 40) + '" text-anchor="middle" font-size="15" class="t2">figure number n</text>';
    lines.forEach(function (L, i) {
      var col = i ? 'var(--accent)' : 'var(--strand)', pts = [];
      for (var n = from; n <= 6; n++) pts.push(X(n) + ',' + Y(L.m * n + L.b));
      s += '<polyline points="' + pts.join(' ') + '" fill="none" style="stroke:' + col + '" stroke-width="2" stroke-dasharray="' + (i ? '6 4' : '0') + '"/>';
      for (var k = from; k <= 6; k++) s += '<circle cx="' + X(k) + '" cy="' + Y(L.m * k + L.b) + '" r="4.5" style="fill:' + col + '"/>';
      s += '<text x="' + (x0 + W - 4) + '" y="' + Math.max(16, Math.min(y0 - 8, Y(L.m * 6 + L.b) + (i || L.m * 6 + L.b >= hi - (hi - lo) * 0.08 ? 22 : -10))) + '" text-anchor="end" font-size="16" class="tb" style="fill:' + col + '">' + rule(L.m, L.b) + '</text>';
    });
    return A.svg(400, y0 + 48, s, 'Graph of ' + lines.map(function (L) { return rule(L.m, L.b).replace(/&minus;/g, 'minus'); }).join(' and ') + ' for n from ' + from + ' to 6. The points lie on a straight line.');
  }
  function table(m, b, from, to) {
    var h = '<div class="tbl"><table><thead><tr><th class="l">Figure n</th>', r = '<tr><th class="l">Term t</th>';
    for (var n = from; n <= to; n++) { h += '<th>' + n + '</th>'; r += '<td>' + N(m * n + b) + '</td>'; }
    return h + '</tr></thead><tbody>' + r + '</tr></tbody></table></div>';
  }
  /* algebra tiles: x tiles are long bars, units are squares. positive = colour, negative = red outline */
  function algTiles(groups, label) {
    var s = '', x = 6, y = 10;
    groups.forEach(function (g, gi) {
      if (g.gap) { s += '<text x="' + (x + 6) + '" y="' + (y + 34) + '" font-size="24" class="tb">' + g.gap + '</text>'; x += 30; return; }
      for (var i = 0; i < Math.abs(g.x || 0); i++) {
        var neg = g.x < 0;
        s += '<rect x="' + x + '" y="' + y + '" width="16" height="48" rx="2" style="fill:' + (neg ? 'color-mix(in srgb,var(--bad) 15%,var(--card))' : 'color-mix(in srgb,var(--sc) 70%,var(--card))') + ';stroke:' + (neg ? 'var(--bad)' : 'var(--sc)') + '" stroke-width="1.5"/><text x="' + (x + 8) + '" y="' + (y + 30) + '" text-anchor="middle" font-size="15" class="tb"' + (neg ? ' style="fill:var(--bad)"' : '') + '>' + (neg ? '−x' : 'x') + '</text>';
        x += 20;
        if (g.cross && i < g.cross) s += '<line x1="' + (x - 22) + '" y1="' + (y - 2) + '" x2="' + (x - 2) + '" y2="' + (y + 50) + '" style="stroke:var(--ink2)" stroke-width="2"/>';
      }
      for (var j = 0; j < Math.abs(g.u || 0); j++) {
        var ng = g.u < 0, uy = y + 32 - (j % 2) * 18, ux = x + Math.floor(j / 2) * 18;
        s += '<rect x="' + ux + '" y="' + uy + '" width="15" height="15" rx="2" style="fill:' + (ng ? 'color-mix(in srgb,var(--bad) 15%,var(--card))' : 'var(--hi)') + ';stroke:' + (ng ? 'var(--bad)' : '#7a5a00') + '" stroke-width="1.5"/>';
      }
      x += Math.ceil(Math.abs(g.u || 0) / 2) * 18 + 12;
    });
    return A.svg(Math.max(200, x), 70, s, label);
  }
  /* balance: left and right expressions as text in pans */
  function balance(left, right, note) {
    var s = '<path d="M200 150 l-24 34 h48 z" style="fill:var(--ink2)"/><line x1="40" y1="96" x2="360" y2="96" style="stroke:var(--ink)" stroke-width="4" stroke-linecap="round"/><line x1="200" y1="96" x2="200" y2="150" style="stroke:var(--ink)" stroke-width="4"/>';
    [[110, left], [290, right]].forEach(function (p) {
      s += '<line x1="' + (p[0] - 60) + '" y1="96" x2="' + (p[0] - 72) + '" y2="54" style="stroke:var(--ink2)" stroke-width="1.5"/><line x1="' + (p[0] + 60) + '" y1="96" x2="' + (p[0] + 72) + '" y2="54" style="stroke:var(--ink2)" stroke-width="1.5"/>' +
        '<path d="M' + (p[0] - 84) + ' 54 h168 q-10 22 -84 22 q-74 0 -84 -22z" style="fill:color-mix(in srgb,var(--sc) 14%,var(--card));stroke:var(--sc)" stroke-width="1.5"/>' +
        '<text x="' + p[0] + '" y="42" text-anchor="middle" font-size="22" class="serif" font-weight="600">' + p[1] + '</text>';
    });
    if (note) s += '<text x="200" y="210" text-anchor="middle" font-size="16" class="t2">' + note + '</text>';
    return A.svg(400, note ? 218 : 192, s, 'A balance. Left side: ' + left.replace(/<[^>]+>/g, '') + '. Right side: ' + right.replace(/<[^>]+>/g, '') + '. ' + (note || ''));
  }
  /* number line for an inequality x op k */
  function ineqLine(op, k, lo, hi) {
    lo = lo === undefined ? k - 6 : lo; hi = hi === undefined ? k + 6 : hi;
    var x0 = 20, x1 = 380, s = '';
    function X(v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }
    s += '<defs><marker id="iqa" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>';
    s += '<line x1="' + x0 + '" y1="50" x2="' + x1 + '" y2="50" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var v = lo; v <= hi; v++) s += '<line x1="' + X(v) + '" y1="44" x2="' + X(v) + '" y2="56" style="stroke:var(--ink)" stroke-width="1.5"/>' + ((hi - lo <= 14 || v % 2 === 0) ? '<text x="' + X(v) + '" y="78" text-anchor="middle" font-size="16"' + (v === k ? ' class="tb"' : '') + '>' + (v < 0 ? '−' + -v : v) + '</text>' : '');
    var right = op === '>' || op === '>=', closed = op === '<=' || op === '>=';
    s += '<line x1="' + X(k) + '" y1="34" x2="' + (right ? x1 - 4 : x0 + 4) + '" y2="34" style="stroke:var(--accent)" stroke-width="5" marker-end="url(#iqa)"/>';
    s += '<circle cx="' + X(k) + '" cy="34" r="8" style="fill:' + (closed ? 'var(--accent)' : 'var(--card)') + ';stroke:var(--accent)" stroke-width="3"/>';
    var sym = { '<': '&lt;', '>': '&gt;', '<=': '&#8804;', '>=': '&#8805;' }[op];
    return A.svg(400, 88, s, 'Number line showing x ' + { '<': 'less than', '>': 'greater than', '<=': 'less than or equal to', '>=': 'greater than or equal to' }[op] + ' ' + k + '. The circle at ' + k + ' is ' + (closed ? 'filled, so ' + k + ' is included' : 'open, so ' + k + ' is not included') + '.');
  }
  var SYM = { '<': '&lt;', '>': '&gt;', '<=': '&#8804;', '>=': '&#8805;' }, FLIP = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };

  var EQS = [
    { t: '3x + 4 = 19', s: [['3x + 4', '19', 'Start. Both sides balance.'], ['3x', '15', 'Take 4 from both sides.'], ['x', '5', 'Divide both sides by 3.']], v: 'Check: 3 &times; 5 + 4 = 19. &#10003;' },
    { t: '5x &minus; 3 = 2x + 9', s: [['5x &minus; 3', '2x + 9', 'Start.'], ['3x &minus; 3', '9', 'Take 2x from both sides.'], ['3x', '12', 'Add 3 to both sides.'], ['x', '4', 'Divide both sides by 3.']], v: 'Check: 5 &times; 4 &minus; 3 = 17 and 2 &times; 4 + 9 = 17. &#10003;' },
    { t: '&minus;2x + 7 = 15', s: [['&minus;2x + 7', '15', 'Start.'], ['&minus;2x', '8', 'Take 7 from both sides.'], ['x', '&minus;4', 'Divide both sides by &minus;2.']], v: 'Check: &minus;2 &times; (&minus;4) + 7 = 8 + 7 = 15. &#10003;' },
    { t: '0.5x + 1.2 = 3.7', s: [['0.5x + 1.2', '3.7', 'Start.'], ['0.5x', '2.5', 'Take 1.2 from both sides.'], ['x', '5', 'Divide both sides by 0.5.']], v: 'Check: 0.5 &times; 5 + 1.2 = 2.5 + 1.2 = 3.7. &#10003;' }
  ];

  var html =
'<section class="sec"><h2><span class="n">1</span>Linear growing and shrinking patterns</h2>' +
'<p>In a <b>linear pattern</b>, the terms change by the same amount every step. That amount is the <b>constant rate</b>. The value at figure 0, before any steps, is the <b>initial value</b>.</p>' +
'<div class="fig">' + tiles(3, 2) + '</div>' + table(3, 2, 0, 5) +
'<div class="eg"><b class="t">Worked example</b><p>Describe the tile pattern above.</p><ol><li>Each figure adds 3 purple tiles. The constant rate is 3.</li><li>Go back one step from figure 1: 5 &minus; 3 = 2. The initial value is 2 (the orange tiles).</li><li>The rule is t = 3n + 2. On a graph the points make a straight line.</li></ol></div>' +
A.yt({ q: 'A pattern goes 5, 8, 11, 14, &hellip; What is its constant rate?', a: 3, back: 'Go back to step 1: find how much the terms change each step. Subtract one term from the next.', ok: '8 &minus; 5 = 3, 11 &minus; 8 = 3, 14 &minus; 11 = 3. The rate is 3.' }) +
'<div class="lab"><span class="lt">Try it: build a pattern</span>' +
'<div class="ctrl"><label for="pm">Constant rate: <output id="pmo"></output><input type="range" id="pm" min="-4" max="5" value="3"></label><label for="pb">Initial value: <output id="pbo"></output><input type="range" id="pb" min="0" max="24" value="2"></label></div>' +
'<div class="fig" id="ptiles"></div><div id="ptable"></div><div class="fig" id="pgraph"></div><div class="out" id="pout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Two linear patterns can be compared by their rate and their initial value. A bigger rate makes a steeper line. A bigger initial value starts the line higher. A negative rate makes a <b>shrinking</b> pattern that slopes down.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Using a pattern rule</h2>' +
'<p>The rule <span class="math">t = 3n + 2</span> gives any term t from its figure number n. Use it to jump ahead without drawing every figure, or work backwards to find which figure has a given number of tiles.</p>' +
'<div class="fig">' + graph([{ m: 3, b: 2 }, { m: -4, b: 30 }]) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>For t = 3n + 2, how many tiles are in figure 50? Which figure has 62 tiles?</p><ol><li>Replace n with 50: t = 3 &times; 50 + 2 = 152 tiles.</li><li>For 62 tiles, write the equation 3n + 2 = 62.</li><li>Take 2 from both sides: 3n = 60. Divide by 3: n = 20. Figure 20 has 62 tiles.</li></ol></div>' +
'<div class="eg"><b class="t">Worked example: shrinking</b><p>A pattern goes 26, 22, 18, 14, &hellip; for figures 1, 2, 3, 4. Find the rule.</p><ol><li>The rate is &minus;4 (it drops 4 each step).</li><li>Initial value: one step back from 26 is 26 + 4 = 30.</li><li>The rule is t = &minus;4n + 30, or t = 30 &minus; 4n. The dashed line in the graph shows it.</li></ol></div>' +
A.yt({ q: 'For t = 4n + 3, what is term 25?', a: 103, back: 'Go back to step 1: replace n with 25, multiply first, then add.', ok: '4 &times; 25 + 3 = 100 + 3 = 103.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>The rate is not the first term. In 5, 8, 11, &hellip; the rule is t = 3n + 2, not t = 5n. Check your rule with figure 1: 3 &times; 1 + 2 = 5. &#10003;</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Collecting like terms</h2>' +
'<p><b>Like terms</b> have the same variable part. 3x and &minus;5x are like terms. 3x and 3 are not. You can add or subtract like terms only.</p>' +
'<div class="fig">' + algTiles([{ x: 3, u: 5 }, { gap: '+' }, { x: 2, u: -7 }], 'Algebra tiles for 3x plus 5 plus 2x minus 7. There are 5 x tiles, 5 positive unit tiles and 7 negative unit tiles.') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Simplify (3x + 5) + (2x &minus; 7).</p><ol><li>Group like terms: 3x + 2x and 5 + (&minus;7).</li><li>x tiles: 3 + 2 = 5, so 5x.</li><li>Unit tiles: 5 + (&minus;7) = &minus;2. Five zero pairs cancel, two negatives are left.</li><li>Answer: 5x &minus; 2.</li></ol></div>' +
'<div class="fig">' + algTiles([{ x: 5 }, { gap: '+' }, { u: 5 }, { u: -7 }], 'The same tiles after collecting: 5 x tiles, and 5 positive units with 7 negative units, which leaves 2 negative units. So 5x minus 2.') + '</div>' +
A.yt({ q: 'Simplify 4x &minus; 6 + x + 2.', opts: ['5x &minus; 4', '4x &minus; 4', '5x &minus; 8', '&minus;x'], a: 0, back: 'Go back to step 1: put the x terms together and the number terms together. Remember x means 1x.', ok: '4x + x = 5x and &minus;6 + 2 = &minus;4. So 5x &minus; 4.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>5x &minus; 2 does not simplify to 3x. An x tile and a unit tile are different shapes. They cannot combine.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Evaluating expressions</h2>' +
'<p>To <b>evaluate</b> an expression, replace each variable with its value, in brackets, then follow BEDMAS.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Evaluate 3a<sup>2</sup> &minus; 2b when a = &minus;2 and b = 1.5.</p><ol><li>Substitute with brackets: 3(&minus;2)<sup>2</sup> &minus; 2(1.5).</li><li>Exponent first: (&minus;2)<sup>2</sup> = 4.</li><li>Multiply: 3 &times; 4 = 12 and 2 &times; 1.5 = 3.</li><li>Subtract: 12 &minus; 3 = 9.</li></ol></div>' +
A.yt({ q: 'Evaluate 2.5x &minus; 4 when x = &minus;2.', a: -9, show: '&minus;9', back: 'Go back to step 1: put &minus;2 in brackets in place of x. Multiply before you subtract.', ok: '2.5 &times; (&minus;2) = &minus;5, and &minus;5 &minus; 4 = &minus;9.' }) +
'<div class="key"><b class="t">Key idea</b><p>Brackets around a negative value protect its sign. Without them, &minus;2<sup>2</sup> would wrongly become &minus;4 instead of 4.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Solving equations</h2>' +
'<p>An equation is a balance. Whatever you do to one side, do the same to the other, so it stays balanced. Undo operations in reverse order until the variable is alone. Then <b>check</b> by substituting.</p>' +
'<div class="lab"><span class="lt">Try it: balance step by step</span>' +
'<div class="ctrl"><label for="eqs">Equation<select id="eqs">' + EQS.map(function (e, i) { return '<option value="' + i + '">' + e.t.replace(/&minus;/g, '−') + '</option>'; }).join('') + '</select></label></div>' +
'<div class="fig" id="eqfig"></div><div class="out" id="eqout"></div><div class="btnrow"><button type="button" class="btn alt" id="eqprev">Back a step</button><button type="button" class="btn" id="eqnext">Next step</button></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Solve 5x &minus; 3 = 2x + 9.</p><ol><li>Get the x terms on one side: subtract 2x from both sides. 3x &minus; 3 = 9.</li><li>Undo the &minus;3: add 3 to both sides. 3x = 12.</li><li>Undo the &times; 3: divide both sides by 3. x = 4.</li><li>Check: left 5(4) &minus; 3 = 17, right 2(4) + 9 = 17. &#10003;</li></ol></div>' +
A.yt({ q: 'Solve 4x + 6 = &minus;10.', a: -4, show: '&minus;4', back: 'Undo in reverse order, as in steps 2 and 3: first take 6 from both sides, then divide both sides by 4.', ok: '4x = &minus;16, so x = &minus;4. Check: 4(&minus;4) + 6 = &minus;10. &#10003;' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>When you move a term, you must do the opposite operation to <b>both</b> sides. Taking 2x from only the left side breaks the balance.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Inequalities</h2>' +
'<p>An <b>inequality</b> like x &lt; 5 has many solutions. We graph them on a number line. An open circle means the number is not included (&lt; or &gt;). A filled circle means it is included (&#8804; or &#8805;).</p>' +
'<div class="fig">' + ineqLine('<', 5, -1, 11) + '</div>' +
'<p>Solve an inequality like an equation, with one extra rule: when you <b>multiply or divide by a negative</b>, flip the sign.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Solve &minus;2x + 1 &#8805; 9 and graph it.</p><ol><li>Take 1 from both sides: &minus;2x &#8805; 8.</li><li>Divide both sides by &minus;2 and <b>flip</b> the sign: x &#8804; &minus;4.</li><li>Check with a value in the solution, x = &minus;5: &minus;2(&minus;5) + 1 = 11, and 11 &#8805; 9. &#10003;</li></ol>' +
'<div class="fig">' + ineqLine('<=', -4, -10, 2) + '</div></div>' +
'<div class="lab"><span class="lt">Try it: graph an inequality</span>' +
'<div class="ctrl"><label for="iqo">Sign<select id="iqo"><option value="<">x &lt;</option><option value="<=">x &#8804;</option><option value=">">x &gt;</option><option value=">=">x &#8805;</option></select></label><label for="iqk">Number: <output id="iqko"></output><input type="range" id="iqk" min="-8" max="8" value="3"></label></div>' +
'<div class="fig" id="iqfig"></div><div class="out" id="iqout"></div></div>' +
A.yt({ q: 'Solve 3x &minus; 2 &gt; 7.', opts: ['x &gt; 3', 'x &lt; 3', 'x &gt; 5/3', 'x = 3'], a: 0, back: 'Solve like an equation: add 2 to both sides, then divide by 3. You divided by a positive, so the sign stays the same.', ok: '3x &gt; 9, so x &gt; 3. Check x = 4: 3(4) &minus; 2 = 10 &gt; 7. &#10003;' }) +
'</section>';

  var practice = [
    { id: 'al-pattern', name: 'Rate and initial value', code: 'C1.1', gen: function (lv) {
      var m = lv === 1 ? R.int(2, 6) : R.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), b = lv === 1 ? R.int(1, 6) : R.int(-5, 20);
      if (m < 0) b = R.int(20, 40);
      if (lv === 3) { m = R.pick([0.5, 1.5, 2.5, -0.5, -1.5]); b = R.int(2, 10) + (m < 0 ? 10 : 0); }
      var terms = [1, 2, 3, 4].map(function (n) { return cl(m * n + b); }), ask = R.int(0, 1);
      if (lv === 1 && ask === 0) return { q: 'The pattern goes ' + terms.join(', ') + ', &hellip; for figures 1, 2, 3, 4. What is the next term?', type: 'num', answer: cl(m * 5 + b), show: N(cl(m * 5 + b)), fig: tiles(m, b),
        hint: 'Find how much it changes each step, then add that to ' + terms[3] + '.', steps: ['Each step adds ' + m + '.', 'Next term: ' + terms[3] + ' + ' + m + ' = ' + (m * 5 + b) + '.'], explain: 'The next term is ' + (m * 5 + b) + '.' };
      if (ask === 0) return { q: 'The pattern goes ' + terms.map(N).join(', ') + ', &hellip; for figures 1, 2, 3, 4. What is the <b>initial value</b> (the term for figure 0)?', type: 'num', answer: b, show: N(b),
        hint: 'Go one step backwards from figure 1: undo the constant rate.', steps: ['Constant rate: ' + N(terms[1]) + ' &minus; ' + P(terms[0]) + ' = ' + N(m) + '.', 'Figure 0 is one step before figure 1: ' + N(terms[0]) + ' &minus; ' + P(m) + ' = ' + N(b) + '.'], explain: 'The initial value is ' + N(b) + '.' };
      return { q: 'The pattern goes ' + terms.map(N).join(', ') + ', &hellip; What is the <b>constant rate</b>?', type: 'num', answer: m, show: N(m),
        hint: 'Subtract each term from the next one. A shrinking pattern has a negative rate.', steps: ['Second minus first: ' + N(terms[1]) + ' &minus; ' + P(terms[0]) + ' = ' + N(m) + '.', 'It is the same every step, so the rate is ' + N(m) + '.'], explain: 'The rate is ' + N(m) + '.' };
    } },
    { id: 'al-rule', name: 'Use a pattern rule', code: 'C1.3', gen: function (lv) {
      var m = R.int(2, 9) * (lv === 3 && R.int(0, 1) ? -1 : 1), b = R.int(-6, 15), n = R.int(10, lv === 1 ? 30 : 80);
      if (lv === 3) { var t = m * n + b;
        return { q: 'A pattern has the rule ' + rule(m, b) + '. Which figure number n has a term of ' + N(t) + '?', type: 'num', answer: n,
          hint: 'Write the equation ' + ex(m, b, 'n') + ' = ' + N(t) + ' and solve for n.', steps: ['Equation: ' + ex(m, b, 'n') + ' = ' + N(t) + '.', (b < 0 ? 'Add ' + -b : 'Subtract ' + b) + ' on both sides: ' + N(m) + 'n = ' + N(t - b) + '.', 'Divide by ' + N(m) + ': n = ' + n + '.'], explain: 'Figure ' + n + ' has ' + N(t) + '.' }; }
      var t2 = m * n + b;
      if (lv === 2 && R.int(0, 1)) {
        var terms = [1, 2, 3].map(function (k) { return m * k + b; });
        return { q: 'The pattern goes ' + terms.map(N).join(', ') + ', &hellip; What is term ' + n + '?', type: 'num', answer: t2, show: N(t2),
          hint: 'Find the rule first: rate &times; n + initial value. Then put n = ' + n + '.', steps: ['Rate: ' + m + '. Initial value: ' + N(terms[0]) + ' &minus; ' + m + ' = ' + N(b) + '.', 'Rule: ' + rule(m, b) + '.', 't = ' + m + ' &times; ' + n + (b < 0 ? ' &minus; ' + -b : ' + ' + b) + ' = ' + N(t2) + '.'], explain: 'Term ' + n + ' is ' + N(t2) + '.' };
      }
      return { q: 'A pattern has the rule ' + rule(m, b) + '. What is term ' + n + '?', type: 'num', answer: t2, show: N(t2),
        hint: 'Replace n with ' + n + '. Multiply first, then add or subtract.', steps: ['t = ' + m + ' &times; ' + n + (b < 0 ? ' &minus; ' + -b : ' + ' + b) + '.', m + ' &times; ' + n + ' = ' + m * n + '.', 't = ' + N(t2) + '.'], explain: 'Term ' + n + ' is ' + N(t2) + '.' };
    } },
    { id: 'al-like', name: 'Collect like terms', code: 'C2.1', gen: function (lv) {
      var a = R.int(1, 7), b = R.int(-9, 9), c = R.int(lv === 1 ? 1 : -6, 6), d = R.int(-9, 9), sub = lv === 3 && R.int(0, 1);
      if (c === 0) c = 2;
      var q = sub ? '(' + ex(a, b) + ') &minus; (' + ex(c, d) + ')' : '(' + ex(a, b) + ') + (' + ex(c, d) + ')', X = sub ? a - c : a + c, U = sub ? b - d : b + d;
      if (lv === 1) q = ex(a, b) + ' + ' + ex(c, d).replace(/^&minus;/, '(&minus;') + (c < 0 ? ')' : '');
      var right = ex(X, U), w = [ex(a + c, b - d), ex(X, -U), ex(X + U, 0), ex(a * c, b + d), ex(X, U + 1)];
      var o = R.mc(right, w.filter(function (z) { return z !== right; }));
      return { q: 'Simplify <span class="math">' + q + '</span>.', type: 'mc', options: o.options, answer: o.answer,
        fig: lv === 1 ? algTiles([{ x: a, u: b }, { gap: '+' }, { x: c, u: d }], 'Algebra tiles for the two expressions.') : '',
        hint: sub ? 'Subtracting a bracket changes the sign of every term inside it.' : 'Add the x terms together, then the number terms together.',
        steps: [sub ? 'Remove the brackets: ' + ex(a, b) + ' &minus; ' + ex(c, 0) + (d === 0 ? '' : (d > 0 ? ' &minus; ' + d : ' + ' + -d)) + '.' : 'Group: (' + a + 'x + ' + P(c) + 'x) and (' + N(b) + ' + ' + P(d) + ').', 'x terms: ' + N(X) + 'x. Numbers: ' + N(U) + '.', 'Answer: ' + right + '.'], explain: 'The simplified form is ' + right + '.' };
    } },
    { id: 'al-eval', name: 'Evaluate expressions', code: 'C2.2', gen: function (lv) {
      var x = lv === 1 ? R.int(-6, 6) : lv === 2 ? R.pick([-3, -2, -1.5, -0.5, 0.5, 1.5, 2.5]) : R.pick([-2, -1.5, 0.5, 1.2, -0.4]);
      var a = R.int(2, 6), b = R.int(-9, 9), v, q, st;
      if (lv < 3) { v = cl(a * x + b); q = ex(a, b) + ' when x = ' + N(x); st = ['Substitute: ' + a + '(' + N(x) + ')' + (b < 0 ? ' &minus; ' + -b : ' + ' + b) + '.', 'Multiply: ' + a + ' &times; ' + P(x) + ' = ' + N(cl(a * x)) + '.', (b < 0 ? 'Subtract ' + -b : 'Add ' + b) + ': ' + N(v) + '.']; }
      else { v = cl(a * x * x - b * x); q = a + 'x<sup>2</sup> ' + (b < 0 ? '+ ' + -b : '&minus; ' + b) + 'x when x = ' + N(x); st = ['Substitute: ' + a + '(' + N(x) + ')<sup>2</sup> ' + (b < 0 ? '+ ' + -b : '&minus; ' + b) + '(' + N(x) + ').', 'Exponent: (' + N(x) + ')<sup>2</sup> = ' + cl(x * x) + '. Then ' + a + ' &times; ' + cl(x * x) + ' = ' + cl(a * x * x) + '.', 'Other term: ' + N(cl(-b * x)) + '. Total: ' + N(v) + '.']; }
      return { q: 'Evaluate <span class="math">' + q + '</span>.', type: 'num', answer: v, show: N(v), hint: 'Put the value in brackets in place of x. Then use BEDMAS.', steps: st, explain: 'The value is ' + N(v) + '.' };
    } },
    { id: 'al-solve', name: 'Solve equations', code: 'C2.3', gen: function (lv) {
      var x = lv === 1 ? R.int(1, 12) : R.int(-9, 9), a = R.int(2, 9) * (lv > 1 && R.int(0, 1) ? -1 : 1), b = R.int(-15, 15), c, q, st;
      if (x === 0) x = 3;
      if (lv < 3) { c = a * x + b; q = ex(a, b) + ' = ' + N(c);
        st = [(b < 0 ? 'Add ' + -b : 'Subtract ' + b) + ' on both sides: ' + N(a) + 'x = ' + N(c - b) + '.', 'Divide both sides by ' + N(a) + ': x = ' + N(x) + '.', 'Check: ' + N(a) + ' &times; ' + P(x) + (b < 0 ? ' &minus; ' + -b : ' + ' + b) + ' = ' + N(c) + '. &#10003;'];
        if (lv === 1) { a = Math.abs(a); c = a * x + b; q = ex(a, b) + ' = ' + N(c); st[0] = (b < 0 ? 'Add ' + -b : 'Subtract ' + b) + ' on both sides: ' + a + 'x = ' + N(c - b) + '.'; st[1] = 'Divide both sides by ' + a + ': x = ' + x + '.'; st[2] = 'Check: ' + a + ' &times; ' + x + (b < 0 ? ' &minus; ' + -b : ' + ' + b) + ' = ' + N(c) + '. &#10003;'; }
      } else {
        var dcm = R.int(0, 1);
        if (dcm) { var p = R.pick([0.5, 1.5, 2.5, 0.2]), k = R.pick([1.2, 0.8, 3.5, -2.4]); x = R.int(-6, 8) || 2; c = cl(p * x + k); q = p + 'x ' + (k < 0 ? '&minus; ' + -k : '+ ' + k) + ' = ' + N(c);
          st = [(k < 0 ? 'Add ' + -k : 'Subtract ' + k) + ' on both sides: ' + p + 'x = ' + N(cl(c - k)) + '.', 'Divide both sides by ' + p + ': x = ' + N(x) + '.', 'Check by substituting x = ' + N(x) + '.']; }
        else { var e = R.int(1, a > 0 ? a - 1 : 8); if (e === a) e = a - 1; var d = (a - e) * x + b; q = ex(a, b) + ' = ' + ex(e, d);
          if (a - e === 0) { e = a + 1; d = (a - e) * x + b; q = ex(a, b) + ' = ' + ex(e, d); }
          st = ['Subtract ' + ex(e, 0) + ' from both sides: ' + ex(a - e, b) + ' = ' + N(d) + '.', (b < 0 ? 'Add ' + -b : 'Subtract ' + b) + ' on both sides: ' + ex(a - e, 0) + ' = ' + N(d - b) + '.', 'Divide by ' + N(a - e) + ': x = ' + N(x) + '. Check both sides.']; }
      }
      return { q: 'Solve <span class="math">' + q + '</span>.', type: 'num', answer: x, show: N(x), hint: 'Undo operations in reverse order. Do the same thing to both sides.', steps: st, explain: 'x = ' + N(x) + '.' };
    } },
    { id: 'al-ineq', name: 'Solve inequalities', code: 'C2.4', gen: function (lv) {
      var ops = ['<', '>', '<=', '>='], op = R.pick(ops), k = R.int(-6, 6), a = lv === 1 ? 1 : R.int(2, 5) * (lv === 3 ? -1 : 1), b = R.int(-8, 8);
      var c = a * k + b, sol = a < 0 ? FLIP[op] : op;
      var q = ex(a, b) + ' ' + SYM[op] + ' ' + N(c), right = 'x ' + SYM[sol] + ' ' + N(k);
      var o = R.mc(right, ['x ' + SYM[FLIP[sol]] + ' ' + N(k), 'x ' + SYM[sol] + ' ' + N(-k), 'x ' + SYM[op === sol ? FLIP[op] : op] + ' ' + N(k), 'x = ' + N(k)]);
      return { q: 'Solve <span class="math">' + q + '</span>.', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? '' : '',
        hint: a < 0 ? 'You will divide by a negative number. Remember to flip the sign.' : 'Solve it like an equation. You only flip the sign when you multiply or divide by a negative.',
        steps: [(b < 0 ? 'Add ' + -b : b ? 'Subtract ' + b : 'Nothing to add or subtract') + ': ' + ex(a, 0) + ' ' + SYM[op] + ' ' + N(c - b) + '.', a === 1 ? 'x is already alone.' : 'Divide by ' + N(a) + (a < 0 ? ' and flip the sign' : '') + ': ' + right + '.', 'Graph it:<div class="fig">' + ineqLine(sol, k) + '</div>'],
        explain: 'The solution is ' + right + '.' };
    } }
  ];

  var quiz = [
    { q: 'A pattern goes 7, 11, 15, 19, &hellip; for figures 1, 2, 3, 4. Which rule fits?', type: 'mc', options: ['t = 4n + 3', 't = 7n + 4', 't = 4n + 7', 't = 3n + 4'], answer: 0, hint: 'The rate is 4. Go back one step from 7 to find the initial value.', explain: 'Rate 4, initial value 7 &minus; 4 = 3. Check figure 1: 4 + 3 = 7. &#10003;' },
    { q: 'For t = 60 &minus; 5n, which figure number has a term of 15?', type: 'num', answer: 9, hint: 'Solve 60 &minus; 5n = 15.', explain: '60 &minus; 5n = 15, so 5n = 45 and n = 9.' },
    { q: 'Simplify (6x &minus; 4) &minus; (2x + 3).', type: 'mc', options: ['4x &minus; 7', '4x &minus; 1', '8x &minus; 1', '4x + 7'], answer: 0, hint: 'Subtracting the bracket changes the sign of both 2x and 3.', explain: '6x &minus; 4 &minus; 2x &minus; 3 = 4x &minus; 7.' },
    { q: 'Evaluate 4m &minus; m<sup>2</sup> when m = &minus;3.', type: 'num', answer: -21, hint: 'Put &minus;3 in brackets: 4(&minus;3) &minus; (&minus;3)<sup>2</sup>.', explain: '4(&minus;3) = &minus;12 and (&minus;3)<sup>2</sup> = 9. &minus;12 &minus; 9 = &minus;21.' },
    { q: 'Solve 7x &minus; 5 = 3x + 11.', type: 'num', answer: 4, hint: 'Subtract 3x from both sides first.', explain: '4x &minus; 5 = 11, so 4x = 16 and x = 4. Check: 23 = 23. &#10003;' },
    { q: 'Solve 1.5x + 2.4 = 9.9.', type: 'num', answer: 5, hint: 'Subtract 2.4, then divide by 1.5.', explain: '1.5x = 7.5, so x = 5.' },
    { q: 'Solve &minus;4x &lt; 12.', type: 'mc', options: ['x &gt; &minus;3', 'x &lt; &minus;3', 'x &gt; 3', 'x &lt; 3'], answer: 0, hint: 'Dividing by a negative flips the sign.', explain: 'Divide by &minus;4 and flip: x &gt; &minus;3. Check x = 0: 0 &lt; 12. &#10003;' }
  ];

  A.register('algebra', {
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      A.bind(root, ['pm', 'pb'], function () {
        var m = +$('#pm').value, b = +$('#pb').value;
        $('#pmo').textContent = m < 0 ? '−' + -m : m; $('#pbo').textContent = b;
        $('#ptiles').innerHTML = m > 0 ? tiles(m, b) : '<p class="t2">Tiles are only drawn for growing patterns. Look at the table and graph.</p>';
        $('#ptable').innerHTML = table(m, b, 0, 6);
        $('#pgraph').innerHTML = graph([{ m: m, b: b }]);
        $('#pout').innerHTML = '<span class="big">' + rule(m, b) + '</span><br>' + (m > 0 ? 'Growing: up ' + m + ' each figure.' : m < 0 ? 'Shrinking: down ' + -m + ' each figure.' : 'Rate 0: every term is the same, a flat line.') + ' Starts at ' + b + ' for figure 0.';
      });
      var cur = 0, step = 0;
      function drawEq() {
        var e = EQS[cur], s = e.s[step];
        $('#eqfig').innerHTML = balance(s[0], s[1]);
        $('#eqout').innerHTML = '<b>Step ' + (step + 1) + ' of ' + e.s.length + ':</b> ' + s[2] + (step === e.s.length - 1 ? '<br>' + e.v : '');
        $('#eqprev').disabled = step === 0; $('#eqnext').disabled = step === e.s.length - 1;
      }
      $('#eqs').addEventListener('change', function () { cur = +$('#eqs').value; step = 0; drawEq(); });
      $('#eqnext').addEventListener('click', function () { if (step < EQS[cur].s.length - 1) step++; drawEq(); });
      $('#eqprev').addEventListener('click', function () { if (step > 0) step--; drawEq(); });
      drawEq();
      A.bind(root, ['iqo', 'iqk'], function () {
        var op = $('#iqo').value, k = +$('#iqk').value, closed = op.length > 1;
        $('#iqko').textContent = k < 0 ? '−' + k * -1 : k;
        $('#iqfig').innerHTML = ineqLine(op, k, -10, 10);
        var test = op.charAt(0) === '<' ? k - 1 : k + 1;
        $('#iqout').innerHTML = '<span class="big">x ' + SYM[op] + ' ' + N(k) + '</span><br>' + (closed ? 'Filled circle: ' + N(k) + ' is a solution.' : 'Open circle: ' + N(k) + ' itself is not a solution.') + ' For example, x = ' + N(test) + ' works.';
      });
    }
  });
})();
