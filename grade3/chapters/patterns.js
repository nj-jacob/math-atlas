(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var SH = { A: 'circle', B: 'square', C: 'triangle', D: 'star' }, ACT = { A: 'clap', B: 'snap', C: 'stomp', D: 'tap' };
  function glyph(k, x, y, r) {
    if (k === 'A') return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:var(--sb);stroke:var(--ink)" stroke-width="2"/>';
    if (k === 'B') return '<rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + 2 * r + '" height="' + 2 * r + '" rx="3" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    if (k === 'C') return '<polygon points="' + x + ',' + (y - r) + ' ' + (x + r) + ',' + (y + r * 0.85) + ' ' + (x - r) + ',' + (y + r * 0.85) + '" style="fill:var(--sf);stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
    var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push((x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1)); }
    return '<polygon points="' + p.join(' ') + '" style="fill:var(--sd);stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
  }
  /* a row of shapes. core: string like "ABB"; n items; mark: index for a question mark; boxes: outline each core */
  function row(core, n, mark, boxes, label) {
    var per = Math.min(n, 8), gap = 52, s = '', rows = Math.ceil(n / per);
    for (var i = 0; i < n; i++) {
      var x = 30 + (i % per) * gap, y = 34 + Math.floor(i / per) * 74;
      if (i === mark) s += '<rect x="' + (x - 22) + '" y="' + (y - 22) + '" width="44" height="44" rx="8" style="fill:color-mix(in srgb,var(--hi) 30%,var(--card));stroke:var(--ink)" stroke-width="2" stroke-dasharray="5 4"/><text x="' + x + '" y="' + (y + 9) + '" text-anchor="middle" font-size="26" font-weight="800">?</text>';
      else s += glyph(core.charAt(i % core.length), x, y, 18);
      s += '<text x="' + x + '" y="' + (y + 40) + '" text-anchor="middle" font-size="14" class="t2">' + (i + 1) + '</text>';
    }
    if (boxes) for (var c = 0; c * core.length < n; c++) {
      var st = c * core.length, en = Math.min(n, st + core.length) - 1;
      if (Math.floor(st / per) !== Math.floor(en / per)) continue;
      var x0 = 30 + (st % per) * gap - 25, x1 = 30 + (en % per) * gap + 25, yy = 34 + Math.floor(st / per) * 74;
      s += '<rect x="' + x0 + '" y="' + (yy - 26) + '" width="' + (x1 - x0) + '" height="52" rx="10" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/>';
    }
    var lab = label || 'Pattern: ' + Array.apply(null, Array(n)).map(function (_, i) { return i === mark ? 'missing' : SH[core.charAt(i % core.length)]; }).join(', ');
    return A.svg(per * gap + 12, rows * 74 + 4, s, lab);
  }
  /* towers of dots for a growing pattern */
  function towers(vals) {
    var max = Math.max.apply(null, vals), u = Math.min(14, 190 / Math.max(1, max)), w = Math.min(60, 520 / vals.length), s = '';
    vals.forEach(function (v, i) {
      var x = 20 + i * w;
      for (var k = 0; k < v; k++) s += '<rect x="' + (x + 6) + '" y="' + (200 - (k + 1) * u) + '" width="' + (w - 12) + '" height="' + (u - 1.5) + '" rx="2" style="fill:' + (k < vals[0] ? 'var(--strand)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="' + (u > 6 ? 1 : 0) + '"/>';
      s += '<text x="' + (x + w / 2) + '" y="222" text-anchor="middle" font-size="18" class="tb">' + v + '</text>';
    });
    return A.svg(Math.max(200, 30 + vals.length * w), 230, s, 'Growing pattern: ' + vals.join(', '));
  }
  /* a 10 by 10 grid with the robot's path */
  function robot(prog, label) {
    var sz = 40, s = '', x = 1, y = 8, dir = 0, path = [[x, y]], DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0], off = false, steps = 0;
    prog.forEach(function (c) {
      if (c[0] === 'move') for (var i = 0; i < c[1]; i++) { x += DX[dir]; y += DY[dir]; steps++; if (x < 0 || x > 9 || y < 0 || y > 9) off = true; path.push([x, y]); }
      else dir = (dir + (c[0] === 'right' ? 1 : 3)) % 4;
    });
    for (var i = 0; i <= 10; i++) s += '<line x1="' + (4 + i * sz) + '" y1="4" x2="' + (4 + i * sz) + '" y2="' + (4 + 10 * sz) + '" style="stroke:var(--line)" stroke-width="1.5"/><line x1="4" y1="' + (4 + i * sz) + '" x2="' + (4 + 10 * sz) + '" y2="' + (4 + i * sz) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    var C = function (v) { return 4 + v * sz + sz / 2; };
    s += '<polyline points="' + path.map(function (p) { return C(Math.max(-0.4, Math.min(9.4, p[0]))) + ',' + C(Math.max(-0.4, Math.min(9.4, p[1]))); }).join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
    s += '<circle cx="' + C(1) + '" cy="' + C(8) + '" r="9" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>';
    var ex = C(Math.max(0, Math.min(9, x))), ey = C(Math.max(0, Math.min(9, y))), rot = dir * 90;
    s += '<g transform="translate(' + ex + ' ' + ey + ') rotate(' + rot + ')"><polygon points="0,-16 13,12 0,5 -13,12" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/></g>';
    return { svg: A.svg(10 * sz + 8, 10 * sz + 8, s, label || 'Robot path on a grid'), steps: steps, off: off, x: x, y: y };
  }
  function evalE(a, op, b) { return op === '+' ? a + b : op === '-' ? a - b : op === 'x' ? a * b : b ? a / b : NaN; }
  function showOp(op) { return op === '+' ? '+' : op === '-' ? '&minus;' : op === 'x' ? '&times;' : '&divide;'; }

  A.register('patterns', {
    html:
'<section class="sec"><h2><span class="n">1</span>Repeating patterns</h2>' +
'<p>A <b>repeating pattern</b> has a part that repeats over and over. That part is called the <b>core</b>. Find the core and you can tell what comes next, or what comes far ahead.</p>' +
'<div class="lab"><span class="lt">Try it: find the core</span>' +
'<div class="ctrl"><label for="rpc">Core<select id="rpc"><option value="AB">circle, square</option><option value="ABB" selected>circle, square, square</option><option value="AAB">circle, circle, square</option><option value="ABC">circle, square, triangle</option><option value="ABCD">circle, square, triangle, star</option></select></label>' +
'<label for="rpp">Which position? <output id="rppo"></output><input type="range" id="rpp" min="1" max="40" value="14"></label></div>' +
'<div class="fig" id="rpfig"></div><div class="out" id="rpout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The same pattern can be shown in many ways. Circle, square, square is the same as A, B, B, and the same as clap, snap, snap.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>The core is circle, square, triangle. It has 3 shapes. Position 9 ends the third core, so it is a <b>triangle</b>.</p><div class="fig">' + row('ABC', 9, -1, true) + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Patterns that grow</h2>' +
'<p>Some patterns repeat an <b>operation</b>, like "add 3" each time. The pattern rule tells you where to start and what to do: start at 2, add 3. That gives 2, 5, 8, 11, 14.</p>' +
'<div class="lab"><span class="lt">Try it: make a pattern rule</span>' +
'<div class="ctrl"><label for="grs">Start at<input type="number" id="grs" min="0" max="50" value="2"></label>' +
'<label for="gro">Each time<select id="gro"><option value="1">add</option><option value="-1">take away</option></select></label>' +
'<label for="grb">This much<input type="number" id="grb" min="1" max="10" value="3"></label></div>' +
'<div class="fig" id="grfig"></div><div class="tbl" id="grtbl"></div><div class="out" id="grout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Patterns work with big numbers too. 125, 225, 325, 425: the rule is start at 125, add 100. Only the hundreds digit changes.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find the rule: 40, 35, 30, 25. Each number is 5 less. The rule is <b>start at 40, take away 5</b>. Next comes 20.</p></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Variables: a letter for a number</h2>' +
'<p>A <b>variable</b> is a letter or a box that stands for a number. In <span class="math">n + 4 = 10</span>, the letter n stands for 6, because 6 + 4 = 10. In a rule, n can stand for any number you put in.</p>' +
'<div class="lab"><span class="lt">Try it: the number machine</span>' +
'<div class="ctrl"><label for="nmr">Rule<select id="nmr"><option value="+,5">n + 5</option><option value="+,10">n + 10</option><option value="-,3">n &minus; 3</option><option value="x,2" selected>2 &times; n</option><option value="x,5">5 &times; n</option><option value="x,10">10 &times; n</option></select></label>' +
'<label for="nmn">Put in n = <output id="nmno"></output><input type="range" id="nmn" min="3" max="10" value="4"></label></div>' +
'<div class="fig" id="nmfig"></div><div class="tbl" id="nmtbl"></div><div class="out" id="nmout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a letter is always the same number. In one question n might be 6. In the next question, n can be a different number.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find n: <span class="math">n + 8 = 15</span>. Think: what plus 8 makes 15? Count up from 8 to 15: that is 7. So <b>n = 7</b>.</p></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Equal or not equal?</h2>' +
'<p>Two expressions can look different but have the same value. <span class="math">4 &times; 5</span> and <span class="math">2 &times; 10</span> are both 20, so <span class="math">4 &times; 5 = 2 &times; 10</span> is true. If the values are different, use &ne;, which means "is not equal to".</p>' +
'<div class="lab"><span class="lt">Try it: compare two sides</span>' +
'<div class="ctrl"><label for="eqa">Left<input type="number" id="eqa" min="0" max="100" value="4"></label><label for="eqo">&nbsp;<select id="eqo" aria-label="Left operation"><option value="+">+</option><option value="-">&minus;</option><option value="x" selected>&times;</option><option value="/">&divide;</option></select></label><label for="eqb">&nbsp;<input type="number" id="eqb" min="0" max="100" value="5" aria-label="Left second number"></label></div>' +
'<div class="ctrl"><label for="eqc">Right<input type="number" id="eqc" min="0" max="100" value="2"></label><label for="eqp">&nbsp;<select id="eqp" aria-label="Right operation"><option value="+">+</option><option value="-">&minus;</option><option value="x" selected>&times;</option><option value="/">&divide;</option></select></label><label for="eqd">&nbsp;<input type="number" id="eqd" min="0" max="100" value="10" aria-label="Right second number"></label></div>' +
'<div class="out" id="eqout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Work out each side first. Then compare the two answers.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Is <span class="math">30 &divide; 5 = 3 + 3</span> true? Left: 30 &divide; 5 = 6. Right: 3 + 3 = 6. Both are 6, so it is <b>true</b>.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Coding a robot</h2>' +
'<p><b>Code</b> is a list of steps a computer follows in order. Steps that come one after another are <b>sequential</b>. A <b>repeat</b> (or loop) does the same steps many times, so the code is shorter. Two things that happen at the same time, like music playing while a robot moves, are <b>concurrent</b>.</p>' +
'<div class="lab"><span class="lt">Try it: change the code</span>' +
'<pre class="mono" id="cdcode"></pre>' +
'<div class="ctrl"><label for="cdr">Repeat<select id="cdr"><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option></select></label>' +
'<label for="cdm">Move<select id="cdm"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option></select></label>' +
'<label for="cdt">Then turn<select id="cdt"><option value="right" selected>right</option><option value="left">left</option></select></label></div>' +
'<div class="fig" id="cdfig"></div><div class="out" id="cdout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Changing one number in a loop changes the whole result. Repeat 4 times "move 3, turn right" draws a square. Change the 3 to 5 and you get a bigger square.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>This code: move 2, turn right, move 2, turn right, move 2, turn right, move 2. It is the same as: repeat 4 times [move 2, turn right]. The robot moves <b>8 steps</b> in all.</p></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'What comes next?', fig: row('AB', 7, 6), options: ['circle', 'square'], answer: 0, why: 'The core is circle, square. Position 7 starts a new core.' },
        { q: 'What is the core?', fig: row('AAB', 9, -1), options: ['circle, square', 'circle, circle, square', 'circle, circle'], answer: 1, why: 'Look for the part that repeats: circle, circle, square, then it starts again.' },
        { q: 'Which pattern is the same as circle, square, square?', options: ['A, B, B', 'A, A, B', 'A, B, C'], answer: 0, why: 'Give each shape a letter: circle is A, square is B.' }
      ],
      s2: [
        { q: 'What comes next? <span class="math">3, 7, 11, 15, ___</span>', options: ['17', '19', '20'], answer: 1, why: 'Each number is 4 more. 15 + 4 = 19.' },
        { q: 'What is the rule? <span class="math">50, 45, 40, 35</span>', options: ['Start at 50, add 5', 'Start at 50, take away 5', 'Start at 35, take away 5'], answer: 1, why: 'The numbers get smaller by 5 each time, starting at 50.' },
        { q: 'Start at 210 and add 100 each time. What is the third number?', options: ['230', '310', '410'], answer: 2, why: '210, 310, 410. The third number is 410.' }
      ],
      s3: [
        { q: 'Find n: <span class="math">n + 5 = 12</span>', options: ['5', '7', '17'], answer: 1, why: 'What plus 5 makes 12? Count up from 5 to 12.' },
        { q: 'The rule is n + 10. What comes out when n = 6?', options: ['16', '60', '4'], answer: 0, why: 'Put 6 in place of n: 6 + 10 = 16.' },
        { q: 'Find the box: <span class="math">5 &times; &#9633; = 30</span>', options: ['5', '6', '25'], answer: 1, why: '5 times what is 30? Count by 5s to 30: 6 jumps.' }
      ],
      s4: [
        { q: 'Is <span class="math">2 &times; 5 = 5 + 5</span> true?', options: ['True', 'False'], answer: 0, why: 'Left: 10. Right: 10. They are equal.' },
        { q: 'Is <span class="math">20 &divide; 2 = 20 &minus; 2</span> true?', options: ['True', 'False'], answer: 1, why: 'Left: 10. Right: 18. They are not equal.' },
        { q: 'Which is equal to <span class="math">10 &times; 3</span>?', options: ['5 &times; 6', '10 + 3', '3 &times; 3'], answer: 0, why: '10 &times; 3 = 30. 5 &times; 6 = 30 too.' }
      ],
      s5: [
        { q: 'Code: move 2, move 3, move 1. How many steps does the robot move?', options: ['5', '6', '7'], answer: 1, why: 'Add the moves in order: 2 + 3 + 1.' },
        { q: 'Code: repeat 3 times [move 4]. How many steps?', options: ['7', '12', '34'], answer: 1, why: 'The loop runs 3 times. 3 &times; 4 = 12.' },
        { q: 'Change the code from repeat 3 times [move 4] to repeat 5 times [move 4]. How many steps now?', options: ['12', '20', '9'], answer: 1, why: '5 &times; 4 = 20.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function rp() {
        var core = $('#rpc', root).value, p = +$('#rpp', root).value, L = core.length, k = core.charAt((p - 1) % L);
        $('#rppo', root).textContent = p;
        var n = Math.min(20, Math.max(L * 3, Math.ceil(Math.min(p, 20) / L) * L));
        $('#rpfig', root).innerHTML = row(core, n, -1, true);
        var full = Math.floor((p - 1) / L), at = (p - 1) % L + 1;
        $('#rpout', root).innerHTML = '<p><span class="big">Position ' + p + ': ' + SH[k] + '</span></p>' +
          '<p>The core has ' + L + ' shapes. ' + (full ? full + ' full core' + (full > 1 ? 's' : '') + ' come before it (' + full * L + ' shapes). ' : '') + 'Position ' + p + ' is shape ' + at + ' of the core.</p>' +
          '<p><b>As letters:</b> ' + core.split('').join(', ') + ' &nbsp;<b>As actions:</b> ' + core.split('').map(function (c) { return ACT[c]; }).join(', ') + '</p>';
      }
      A.bind(root, ['rpc', 'rpp'], rp);
      function gr() {
        var st = clamp($('#grs', root).value, 0, 50), sg = +$('#gro', root).value, b = clamp($('#grb', root).value, 1, 10), vals = [];
        for (var i = 0; i < 8; i++) { var v = st + sg * b * i; if (v < 0) break; vals.push(v); }
        $('#grfig', root).innerHTML = towers(vals);
        $('#grtbl', root).innerHTML = '<table><tbody><tr><th class="l">Position</th>' + vals.map(function (_, i) { return '<td>' + (i + 1) + '</td>'; }).join('') + '</tr><tr><th class="l">Number</th>' + vals.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr></tbody></table>';
        var tenth = st + sg * b * 9;
        $('#grout', root).innerHTML = '<p><span class="big">' + vals.join(', ') + (vals.length === 8 ? ', ...' : '') + '</span></p><p>Rule: start at ' + st + ', ' + (sg > 0 ? 'add ' : 'take away ') + b + ' each time.' +
          (tenth >= 0 ? ' Prediction: the 10th number is ' + st + (sg > 0 ? ' + ' : ' &minus; ') + '9 &times; ' + b + ' = ' + tenth + '.' : ' The pattern reaches 0 or below before the 10th number, so it stops.') + '</p>';
      }
      A.bind(root, ['grs', 'gro', 'grb'], gr);
      function nm() {
        var r = $('#nmr', root).value.split(','), op = r[0], k = +r[1], n = +$('#nmn', root).value;
        var f = function (v) { return op === '+' ? v + k : op === '-' ? v - k : v * k; }, txt = op === 'x' ? k + ' &times; n' : 'n ' + showOp(op) + ' ' + k;
        $('#nmno', root).textContent = n;
        var s = '<rect x="10" y="40" width="90" height="60" rx="10" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><text x="55" y="80" text-anchor="middle" font-size="28" class="tb">' + n + '</text><text x="55" y="28" text-anchor="middle" font-size="16" class="t2">in: n</text>' +
          '<path d="M104 70 H170" style="stroke:var(--ink)" stroke-width="3"/><polygon points="170,62 184,70 170,78" style="fill:var(--ink)"/>' +
          '<rect x="190" y="22" width="180" height="96" rx="16" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="3"/><text x="280" y="80" text-anchor="middle" font-size="28" class="tb">' + txt.replace('&times;', '×').replace('&minus;', '−') + '</text>' +
          '<path d="M374 70 H440" style="stroke:var(--ink)" stroke-width="3"/><polygon points="440,62 454,70 440,78" style="fill:var(--ink)"/>' +
          '<rect x="460" y="40" width="90" height="60" rx="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5"/><text x="505" y="80" text-anchor="middle" font-size="28" font-weight="800" style="fill:#13203a">' + f(n) + '</text><text x="505" y="28" text-anchor="middle" font-size="16" class="t2">out</text>';
        $('#nmfig', root).innerHTML = A.svg(560, 130, s, 'Number machine: put in ' + n + ', rule ' + txt.replace('&times;', 'times').replace('&minus;', 'minus') + ', get out ' + f(n));
        var ins = [3, 4, 5, 6, 7, 8, 9, 10];
        $('#nmtbl', root).innerHTML = '<table><tbody><tr><th class="l">n</th>' + ins.map(function (v) { return '<td' + (v === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + v + '</td>'; }).join('') + '</tr><tr><th class="l">' + txt + '</th>' + ins.map(function (v) { return '<td' + (v === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + f(v) + '</td>'; }).join('') + '</tr></tbody></table>';
        $('#nmout', root).innerHTML = '<p>When n = ' + n + ', ' + txt.replace('n', n) + ' = <b>' + f(n) + '</b>.</p>';
      }
      A.bind(root, ['nmr', 'nmn'], nm);
      function eq() {
        var a = clamp($('#eqa', root).value, 0, 100), b = clamp($('#eqb', root).value, 0, 100), c = clamp($('#eqc', root).value, 0, 100), d = clamp($('#eqd', root).value, 0, 100), o = $('#eqo', root).value, p = $('#eqp', root).value;
        var L = evalE(a, o, b), Rv = evalE(c, p, d);
        function sh(v, x, op, y) { if (isNaN(v)) return 'You cannot divide by 0.'; if (v < 0) return x + ' ' + showOp(op) + ' ' + y + ' goes below 0. Grade 3 uses whole numbers, so try other numbers.'; if (v !== Math.floor(v)) return x + ' ' + showOp(op) + ' ' + y + ' does not come out even. Try numbers that divide evenly.'; return null; }
        var pr = sh(L, a, o, b) || sh(Rv, c, p, d);
        if (pr) { $('#eqout', root).innerHTML = '<p>' + pr + '</p>'; return; }
        var same = L === Rv;
        $('#eqout', root).innerHTML = '<p><span class="big">' + a + ' ' + showOp(o) + ' ' + b + ' ' + (same ? '=' : '&ne;') + ' ' + c + ' ' + showOp(p) + ' ' + d + '</span></p><p>Left side: ' + L + '. Right side: ' + Rv + '. ' + (same ? 'Both sides are the same, so the equation is <b>true</b>.' : 'The values are different, so they are <b>not equal</b>.') + '</p>';
      }
      A.bind(root, ['eqa', 'eqb', 'eqc', 'eqd', 'eqo', 'eqp'], eq);
      function cd() {
        var r = +$('#cdr', root).value, m = +$('#cdm', root).value, t = $('#cdt', root).value, prog = [];
        for (var i = 0; i < r; i++) { prog.push(['move', m]); prog.push([t]); }
        $('#cdcode', root).textContent = 'when start\n  repeat ' + r + ' times\n    move ' + m + ' steps\n    turn ' + t + '\n  end repeat';
        var res = robot(prog, 'Robot path: repeat ' + r + ' times, move ' + m + ', turn ' + t);
        $('#cdfig', root).innerHTML = res.svg;
        var shape = r >= 4 ? 'a closed square' + (r > 4 ? ', then it goes around again' : '') : r === 1 ? 'one straight line' : 'part of a square';
        $('#cdout', root).innerHTML = '<p><span class="big">' + r + ' &times; ' + m + ' = ' + r * m + ' steps</span></p><p>The loop runs ' + r + ' time' + (r > 1 ? 's' : '') + '. The path makes ' + shape + '.' + (res.off ? ' Part of the path goes off the grid. Try smaller moves.' : '') + '</p>';
      }
      A.bind(root, ['cdr', 'cdm', 'cdt'], cd);
    },

    quiz: [
      { q: 'This pattern keeps going. What is the 10th shape?', type: 'mc', options: ['circle', 'square'], answer: 0, fig: row('ABB', 6, -1, true),
        hint: 'The core has 3 shapes. Count on by cores: 3, 6, 9. What comes at position 10?', explain: 'Positions 1 to 9 are 3 full cores. Position 10 starts a new core, so it is a circle.' },
      { q: 'What comes next? <span class="math">6, 11, 16, 21, ___</span>', type: 'num', answer: 26,
        hint: 'How much bigger is each number?', explain: 'The rule is start at 6, add 5. 21 + 5 = 26.' },
      { q: 'Which rule makes <span class="math">300, 250, 200, 150</span>?', type: 'mc', options: ['Start at 300, add 50', 'Start at 300, take away 50', 'Start at 150, add 50', 'Start at 300, take away 100'], answer: 1,
        hint: 'Is the pattern getting bigger or smaller? By how much?', explain: 'It starts at 300 and gets 50 smaller each time.' },
      { q: 'Find n: <span class="math">n &minus; 7 = 13</span>', type: 'num', answer: 20,
        hint: 'What number, take away 7, leaves 13? Try adding 13 + 7.', explain: '20 &minus; 7 = 13, so n = 20.' },
      { q: 'Which equation is true?', type: 'mc', options: ['5 &times; 4 = 10 + 10', '6 &times; 2 = 6 + 2', '40 &divide; 10 = 40 &minus; 10', '3 + 3 = 3 &times; 3'], answer: 0,
        hint: 'Work out both sides of each one.', explain: '5 &times; 4 = 20 and 10 + 10 = 20.' },
      { q: 'A table follows the rule 2 &times; n. When n = 8, what is the output?', type: 'num', answer: 16,
        hint: 'Put 8 in place of n.', explain: '2 &times; 8 = 16.' },
      { q: 'Code: repeat 4 times [move 5, turn right]. How many steps does the robot move in all?', type: 'num', answer: 20, fig: robot([['move', 5], ['right'], ['move', 5], ['right'], ['move', 5], ['right'], ['move', 5], ['right']], 'Robot path: a square with sides of 5').svg,
        hint: 'The loop runs 4 times. Each time the robot moves 5.', explain: '4 &times; 5 = 20 steps.' }
    ],

    practice: [
      { id: 'pt-repeat', name: 'Repeating patterns', code: 'C1.3', gen: function (lv) {
        var core = lv === 1 ? R.pick(['AB', 'ABC']) : R.pick(['ABB', 'AAB', 'ABC', 'AABB', 'ABCD', 'ABBC']), L = core.length;
        var uniq = []; core.split('').forEach(function (c) { if (uniq.indexOf(c) < 0) uniq.push(c); });
        if (lv < 3) {
          var n = L * 2 + R.int(0, L - 1), ans = SH[core.charAt(n % L)];
          var o = R.mc(ans, uniq.map(function (c) { return SH[c]; }).filter(function (x) { return x !== ans; }));
          return { q: 'What comes next?', type: 'mc', options: o.options, answer: o.answer, fig: row(core, n + 1, n, false),
            hint: 'Find the part that repeats. Where in that part is the missing shape?',
            steps: ['The core is ' + core.split('').map(function (c) { return SH[c]; }).join(', ') + '. It has ' + L + ' shapes.', 'Position ' + (n + 1) + ' is shape ' + (n % L + 1) + ' of the core.', 'That is a ' + ans + '.'],
            explain: 'The next shape is a ' + ans + '.' };
        }
        var p = R.int(L * 3 + 1, 30), a2 = SH[core.charAt((p - 1) % L)];
        var o2 = R.mc(a2, uniq.map(function (c) { return SH[c]; }).filter(function (x) { return x !== a2; }));
        return { q: 'This pattern keeps going. What is shape number ' + p + '?', type: 'mc', options: o2.options, answer: o2.answer, fig: row(core, L * 2, -1, true),
          hint: 'The core has ' + L + ' shapes. Count by ' + L + 's to get close to ' + p + '.',
          steps: ['The core has ' + L + ' shapes.', Math.floor((p - 1) / L) + ' full cores make ' + Math.floor((p - 1) / L) * L + ' shapes.', 'Shape ' + p + ' is shape ' + ((p - 1) % L + 1) + ' of the next core: a ' + a2 + '.'],
          explain: 'Shape ' + p + ' is a ' + a2 + '.' };
      } },
      { id: 'pt-grow', name: 'Pattern rules', code: 'C1.3', gen: function (lv) {
        var st = lv === 3 ? R.int(1, 5) * 100 + R.pick([0, 25, 50]) : R.int(1, 30), b = lv === 3 ? R.pick([10, 50, 100]) : R.int(2, lv === 1 ? 5 : 10), sg = lv === 1 ? 1 : R.pick([1, -1]);
        if (sg < 0) st += 4 * b;
        var vals = []; for (var i = 0; i < 5; i++) vals.push(st + sg * b * i);
        var miss = lv === 2 ? R.int(1, 3) : 4, ans = vals[miss];
        var list = vals.map(function (v, i) { return i === miss ? '___' : v; }).join(', ');
        return { q: 'Find the missing number: <span class="math">' + list + '</span>', type: 'num', answer: ans,
          fig: lv === 1 ? towers(vals.slice(0, 4)) : '',
          hint: 'How much does the pattern change each time? Is it getting bigger or smaller?',
          steps: ['Compare two numbers next to each other. The pattern ' + (sg > 0 ? 'adds ' : 'takes away ') + b + ' each time.', 'The rule is start at ' + st + ', ' + (sg > 0 ? 'add ' : 'take away ') + b + '.', 'The missing number is ' + ans + '.'],
          explain: vals.join(', ') + '.' };
      } },
      { id: 'pt-var', name: 'Find the variable', code: 'C2.1', gen: function (lv) {
        var n, k, eq, steps;
        if (lv === 1) { n = R.int(2, 20); k = R.int(2, 20); eq = 'n + ' + k + ' = ' + (n + k); steps = ['What plus ' + k + ' makes ' + (n + k) + '?', 'Count up from ' + k + ' to ' + (n + k) + ', or work out ' + (n + k) + ' &minus; ' + k + '.', 'n = ' + n + '. Check: ' + n + ' + ' + k + ' = ' + (n + k) + '.']; }
        else if (lv === 2) { n = R.int(10, 60); k = R.int(2, 9); eq = 'n &minus; ' + k + ' = ' + (n - k); steps = ['What number, take away ' + k + ', leaves ' + (n - k) + '?', 'Add back: ' + (n - k) + ' + ' + k + '.', 'n = ' + n + '. Check: ' + n + ' &minus; ' + k + ' = ' + (n - k) + '.']; }
        else { k = R.pick([2, 5, 10]); n = R.int(2, 10); eq = k + ' &times; n = ' + k * n; steps = [k + ' times what is ' + k * n + '?', 'Count by ' + k + 's to ' + k * n + ' and count the jumps.', 'n = ' + n + '. Check: ' + k + ' &times; ' + n + ' = ' + k * n + '.']; }
        return { q: 'Find n: <span class="math">' + eq + '</span>', type: 'num', answer: n, hint: 'Think of the related fact. Then check by putting your number in for n.', steps: steps, explain: 'n = ' + n + '.' };
      } },
      { id: 'pt-table', name: 'Tables of values', code: 'C1.2', gen: function (lv) {
        var rules = [['+', R.int(2, 10)], ['x', R.pick([2, 5, 10])], ['-', R.int(1, 3)]], r = lv === 1 ? rules[0] : R.pick(rules), op = r[0], k = r[1];
        var f = function (v) { return op === '+' ? v + k : op === '-' ? v - k : v * k; }, txt = op === 'x' ? k + ' &times; n' : 'n ' + showOp(op) + ' ' + k;
        var ins = [], st = R.int(4, 6); for (var i = 0; i < 4; i++) ins.push(st + i);
        if (lv === 3) {
          var wrongs = [['+', k + 1], ['x', k === 2 ? 5 : 2], ['+', Math.max(1, f(ins[0]) - ins[0] + 2)], ['-', 1]].map(function (w) { return w[0] === 'x' ? w[1] + ' &times; n' : 'n ' + showOp(w[0]) + ' ' + w[1]; });
          var tbl = '<div class="tbl"><table><tbody><tr><th class="l">n</th>' + ins.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr><tr><th class="l">out</th>' + ins.map(function (v) { return '<td>' + f(v) + '</td>'; }).join('') + '</tr></tbody></table></div>';
          var good = wrongs.filter(function (w) { return w !== txt && !ins.every(function (v) { var m = w.match(/(\d+) &times; n|n (\+|&minus;) (\d+)/); var val = m[1] ? +m[1] * v : m[2] === '+' ? v + +m[3] : v - +m[3]; return val === f(v); }); });
          var o = R.mc(txt, good);
          return { q: 'Which rule matches the table?', type: 'mc', options: o.options, answer: o.answer, fig: tbl,
            hint: 'Try each rule on the first column. Then check it on another column.',
            steps: ['When n = ' + ins[0] + ', the output is ' + f(ins[0]) + '.', 'Try ' + txt + ': ' + txt.replace('n', ins[0]) + ' = ' + f(ins[0]) + '. It works.', 'Check another column: ' + txt.replace('n', ins[2]) + ' = ' + f(ins[2]) + '. It works too.'],
            explain: 'The rule is ' + txt + '.' };
        }
        var m2 = R.int(1, 3), tbl2 = '<div class="tbl"><table><tbody><tr><th class="l">n</th>' + ins.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr><tr><th class="l">' + txt + '</th>' + ins.map(function (v, i) { return '<td>' + (i === m2 ? '?' : f(v)) + '</td>'; }).join('') + '</tr></tbody></table></div>';
        return { q: 'The rule is <span class="math">' + txt + '</span>. What is the output when n = ' + ins[m2] + '?', type: 'num', answer: f(ins[m2]), fig: tbl2,
          hint: 'Put ' + ins[m2] + ' in place of n.',
          steps: ['The rule is ' + txt + '.', 'Put in n = ' + ins[m2] + ': ' + txt.replace('n', ins[m2]) + '.', 'That is ' + f(ins[m2]) + '.'],
          explain: txt.replace('n', ins[m2]) + ' = ' + f(ins[m2]) + '.' };
      } },
      { id: 'pt-equal', name: 'Equal or not', code: 'C2.2', gen: function (lv) {
        function ex(target) {
          var forms = [];
          for (var a = 1; a <= 10; a++) { if (target % a === 0 && target / a <= 10) forms.push([a, 'x', target / a]); if (a < target) forms.push([a, '+', target - a]); forms.push([target + a, '-', a]); if (target * a <= 100) forms.push([target * a, '/', a]); }
          return R.pick(forms.filter(function (f) { return lv > 1 || f[1] === '+' || f[1] === 'x'; }));
        }
        function txt(e) { return e[0] + ' ' + showOp(e[1]) + ' ' + e[2]; }
        var t = R.pick([10, 12, 15, 20, 24, 30, 40]);
        if (lv < 3) {
          var l = ex(t), same = R.int(0, 1), r = ex(same ? t : t + R.pick([-2, -1, 1, 2]));
          var lv2 = evalE(l[0], l[1], l[2]), rv = evalE(r[0], r[1], r[2]);
          var o = R.mc(lv2 === rv ? 'True' : 'False', ['True', 'False']);
          return { q: 'Is <span class="math">' + txt(l) + ' = ' + txt(r) + '</span> true?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Work out each side. Then compare.', steps: ['Left: ' + txt(l) + ' = ' + lv2 + '.', 'Right: ' + txt(r) + ' = ' + rv + '.', lv2 === rv ? 'They match, so it is true.' : lv2 + ' is not ' + rv + ', so it is false.'],
            explain: txt(l) + ' = ' + lv2 + ' and ' + txt(r) + ' = ' + rv + '.' };
        }
        var base = ex(t), right = ex(t), tries = 0;
        while (txt(right) === txt(base) && tries++ < 20) right = ex(t);
        var wr = [ex(t + 1), ex(t - 1), ex(t + 2)].map(txt).filter(function (w) { return w !== txt(right); });
        var o3 = R.mc(txt(right), wr);
        return { q: 'Which is equal to <span class="math">' + txt(base) + '</span>?', type: 'mc', options: o3.options, answer: o3.answer,
          hint: 'Work out ' + txt(base) + ' first. Then find a choice with the same value.',
          steps: [txt(base) + ' = ' + t + '.', 'Work out each choice.', txt(right) + ' = ' + t + ', so it is equal.'],
          explain: 'Both are ' + t + '.' };
      } },
      { id: 'pt-code', name: 'Read code', code: 'C3.2', gen: function (lv) {
        if (lv === 1) {
          var mv = [R.int(1, 5), R.int(1, 5), R.int(1, 5)];
          return { q: 'Code: move ' + mv.join(', move ') + '. How many steps does the robot move in all?', type: 'num', answer: mv[0] + mv[1] + mv[2],
            hint: 'The steps run in order. Add the moves.', steps: ['The code is sequential: one move after another.', 'Add: ' + mv.join(' + ') + '.', 'That is ' + (mv[0] + mv[1] + mv[2]) + ' steps.'], explain: mv.join(' + ') + ' = ' + (mv[0] + mv[1] + mv[2]) + '.' };
        }
        var r = R.int(2, 5), m = R.int(2, 5);
        if (lv === 2) return { q: 'Code: repeat ' + r + ' times [move ' + m + ', turn right]. How many steps does the robot move in all?', type: 'num', answer: r * m,
          fig: robot((function () { var p = []; for (var i = 0; i < r; i++) { p.push(['move', m]); p.push(['right']); } return p; })(), 'Robot path: repeat ' + r + ' times, move ' + m).svg,
          hint: 'The loop runs ' + r + ' times. How many steps each time?', steps: ['Each time through the loop, the robot moves ' + m + '.', 'The loop runs ' + r + ' times.', r + ' &times; ' + m + ' = ' + r * m + '.'], explain: r + ' &times; ' + m + ' = ' + r * m + ' steps.' };
        var r2 = r === 5 ? 2 : r + R.int(1, 5 - r);
        return { q: 'The code says repeat ' + r + ' times [move ' + m + ']. You change it to repeat ' + r2 + ' times [move ' + m + ']. How many steps does the robot move now?', type: 'num', answer: r2 * m,
          hint: 'Only the number of repeats changed. Use the new number.', steps: ['The new loop runs ' + r2 + ' times.', 'Each time the robot moves ' + m + '.', r2 + ' &times; ' + m + ' = ' + r2 * m + '.'], explain: 'Now it moves ' + r2 * m + ' steps instead of ' + r * m + '.' };
      } }
    ]
  });
})();
