(function () {
  var A = Atlas, R = A.R, D = A.draw, M = '&minus;';
  /* pattern pieces: each is a shape and a colour */
  var PIECE = {
    A: { k: 'circle', c: 'var(--sb)', n: 'blue circle' },
    B: { k: 'square', c: 'var(--hi)', n: 'yellow square' },
    C: { k: 'tri', c: 'var(--sd)', n: 'green triangle' },
    D: { k: 'diamond', c: 'var(--sf)', n: 'pink diamond' }
  };
  function shape(k, x, y, r, c) {
    if (k === 'circle') return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + c + '" stroke="rgba(0,0,0,.5)" stroke-width="1.8"/>';
    if (k === 'square') return '<rect x="' + (x - r * 0.88) + '" y="' + (y - r * 0.88) + '" width="' + r * 1.76 + '" height="' + r * 1.76 + '" rx="3" style="fill:' + c + '" stroke="rgba(0,0,0,.5)" stroke-width="1.8"/>';
    if (k === 'tri') return '<polygon points="' + x + ',' + (y - r) + ' ' + (x + r) + ',' + (y + r * 0.8) + ' ' + (x - r) + ',' + (y + r * 0.8) + '" style="fill:' + c + '" stroke="rgba(0,0,0,.5)" stroke-width="1.8" stroke-linejoin="round"/>';
    return '<polygon points="' + x + ',' + (y - r) + ' ' + (x + r * 0.8) + ',' + y + ' ' + x + ',' + (y + r) + ' ' + (x - r * 0.8) + ',' + y + '" style="fill:' + c + '" stroke="rgba(0,0,0,.5)" stroke-width="1.8" stroke-linejoin="round"/>';
  }
  /* a row of pattern pieces from a string like "ABBABB". '?' draws an empty box. core: draw brackets every core length */
  function row(str, core, label) {
    var g = 44, r = 16, s = '', n = str.length;
    for (var i = 0; i < n; i++) {
      var ch = str.charAt(i), x = 24 + i * g;
      if (ch === '?') s += '<rect x="' + (x - 18) + '" y="6" width="36" height="36" rx="8" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-dasharray="5 4"/><text x="' + x + '" y="33" text-anchor="middle" font-size="22" font-weight="800">?</text>';
      else s += shape(PIECE[ch].k, x, 24, r, PIECE[ch].c);
    }
    if (core) for (var j = 0; j * core < n; j++) {
      var x0 = 24 + j * core * g - 18, x1 = 24 + Math.min(n - 1, (j + 1) * core - 1) * g + 18;
      s += '<path d="M' + x0 + ' 50 v6 H' + x1 + ' v-6" fill="none" style="stroke:' + (j % 2 ? 'var(--ink2)' : 'var(--strand)') + '" stroke-width="2.5"/>';
    }
    return A.svg(n * g + 4, core ? 62 : 48, s, label || 'A pattern: ' + str.split('').map(function (c) { return c === '?' ? 'missing' : PIECE[c].n; }).join(', '));
  }
  function extend(core, n) { var s = ''; while (s.length < n) s += core; return s.slice(0, n); }
  /* hundred chart with chosen numbers coloured */
  function chart(set, max) {
    max = max || 100;
    var c = 46, s = '';
    for (var v = 1; v <= max; v++) {
      var i = v - 1, x = 2 + (i % 10) * c, y = 2 + Math.floor(i / 10) * c, on = set.indexOf(v) >= 0;
      s += '<rect x="' + x + '" y="' + y + '" width="' + c + '" height="' + c + '" style="fill:' + (on ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1.5"/>';
      s += '<text x="' + (x + c / 2) + '" y="' + (y + c / 2 + 7) + '" text-anchor="middle" font-size="19"' + (on ? ' style="fill:#fff;font-weight:800"' : '') + '>' + v + '</text>';
    }
    return A.svg(10 * c + 4, Math.ceil(max / 10) * c + 4, s, 'Hundred chart with ' + set.length + ' numbers coloured: ' + set.slice(0, 12).join(', ') + (set.length > 12 ? ' and more' : ''));
  }
  /* pan balance: left and right are text; tilt -1 left down, 0 level, 1 right down */
  function balance(left, right, tilt) {
    var W = 440, cx = W / 2, s = '', L = 170, dy = tilt * L * Math.sin(9 * Math.PI / 180);
    var lx = cx - L, rx = cx + L, ly = 70 - dy, ry = 70 + dy; /* tilt -1: left end goes down */
    s += '<polygon points="' + (cx - 30) + ',196 ' + (cx + 30) + ',196 ' + cx + ',74" style="fill:var(--ink2)"/>';
    s += '<line x1="' + lx + '" y1="' + ly + '" x2="' + rx + '" y2="' + ry + '" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>';
    s += '<circle cx="' + cx + '" cy="70" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    [[lx, ly, left], [rx, ry, right]].forEach(function (p) {
      s += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + (p[0] - 44) + '" y2="' + (p[1] + 46) + '" style="stroke:var(--ink2)" stroke-width="2"/><line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + (p[0] + 44) + '" y2="' + (p[1] + 46) + '" style="stroke:var(--ink2)" stroke-width="2"/>';
      s += '<path d="M' + (p[0] - 62) + ' ' + (p[1] + 46) + ' h124 q-6 30 -62 30 q-56 0 -62 -30z" style="fill:color-mix(in srgb,var(--strand) 20%,var(--card));stroke:var(--ink)" stroke-width="2.5"/>';
      s += '<text x="' + p[0] + '" y="' + (p[1] + 67) + '" text-anchor="middle" font-size="20" font-weight="800">' + p[2] + '</text>';
    });
    return A.svg(W, 200, s, 'A balance. Left side: ' + left + '. Right side: ' + right + '. ' + (tilt === 0 ? 'It is level, so both sides are equal.' : 'It tips down on the ' + (tilt < 0 ? 'left' : 'right') + ' side, which is heavier.'));
  }
  var CORES = ['AB', 'ABB', 'AAB', 'ABC', 'ABCD', 'AABB'];
  function nextQ(lv) {
    var core = lv === 1 ? R.pick(['AB', 'ABB', 'AAB']) : R.pick(CORES.slice(1));
    var letters = R.shuffle(['A', 'B', 'C', 'D']), map = {};
    'ABCD'.split('').forEach(function (k, i) { map[k] = letters[i]; });
    core = core.split('').map(function (c) { return map[c]; }).join('');
    var shown = lv === 3 ? 2 * core.length + R.int(0, core.length - 1) : 2 * core.length + R.int(0, core.length - 1);
    var full = extend(core, shown + 1), ans = full.charAt(shown);
    var uniq = core.split('').filter(function (v, i, a) { return a.indexOf(v) === i; });
    var opts = uniq.concat(R.shuffle(['A', 'B', 'C', 'D'].filter(function (x) { return uniq.indexOf(x) < 0; })).slice(0, Math.max(0, 3 - uniq.length)));
    var o = R.mc(PIECE[ans].n, opts.filter(function (x) { return x !== ans; }).map(function (x) { return PIECE[x].n; }));
    var str = full.slice(0, shown);
    if (lv === 3) {
      var gap = R.int(core.length, shown - 1), miss = str.charAt(gap);
      var o3 = R.mc(PIECE[miss].n, opts.filter(function (x) { return x !== miss; }).map(function (x) { return PIECE[x].n; }));
      return { q: 'What is missing from this pattern?', type: 'mc', options: o3.options, answer: o3.answer, fig: row(str.slice(0, gap) + '?' + str.slice(gap + 1)), hint: 'Find the part that repeats. Say it out loud. What goes in the gap?',
        steps: ['The part that repeats is: ' + core.split('').map(function (c) { return PIECE[c].n; }).join(', ') + '.', 'Say the pattern from the start and stop at the gap.', 'The gap is a ' + PIECE[miss].n + '.<div class="fig">' + row(str, core.length) + '</div>'], explain: 'The missing piece is a ' + PIECE[miss].n + '.' };
    }
    return { q: 'What comes next?', type: 'mc', options: o.options, answer: o.answer, fig: row(str + '?'), hint: 'Find the part that repeats. Where are you in it now?',
      steps: ['The part that repeats is: ' + core.split('').map(function (c) { return PIECE[c].n; }).join(', ') + '.', 'Mark each repeat.<div class="fig">' + row(str, core.length) + '</div>', 'The next piece is a ' + PIECE[ans].n + '.'], explain: 'The pattern repeats ' + core.split('').map(function (c) { return PIECE[c].n; }).join(', ') + ', so a ' + PIECE[ans].n + ' comes next.' };
  }

  A.register('patterns', {
    html:
'<section class="sec"><h2><span class="n">1</span>Repeating patterns</h2>' +
'<p>A <b>repeating pattern</b> has a part that repeats again and again. This part is called the <b>core</b>. Find the core, and you can tell what comes next.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Circle, square, square. Circle, square, square. The core is <b>circle, square, square</b>. It has 3 pieces. After circle, square, square comes a <b>circle</b>.</p><div class="fig">' + row('ABBABBABB', 3) + '</div></div>' +
'<div class="yt" data-yt="next"></div>' +
'<p>Patterns are all around us: tiles on a floor, beads on a bracelet, the days of the week.</p>' +
'<div class="fig">' + A.svg(440, 92, (function () { var s = ''; for (var i = 0; i < 10; i++) for (var j = 0; j < 2; j++) s += '<rect x="' + (4 + i * 43) + '" y="' + (4 + j * 43) + '" width="41" height="41" style="fill:' + ((i + j) % 2 ? 'var(--card)' : 'var(--strand)') + ';stroke:var(--ink)" stroke-width="1.5"/>'; return s; })(), 'Floor tiles in a checkerboard pattern: blue, white, blue, white') + '</div>' +
'<div class="lab"><span class="lt">Try it: build a pattern</span>' +
'<div class="ctrl"><label for="pc">Core<select id="pc"><option value="AB">circle, square</option><option value="ABB" selected>circle, square, square</option><option value="AAB">circle, circle, square</option><option value="ABC">circle, square, triangle</option><option value="AABB">circle, circle, square, square</option><option value="ABCD">circle, square, triangle, diamond</option></select></label>' +
'<label for="pn">Which place? <output id="pno">15</output><input type="range" id="pn" min="1" max="24" value="15"></label></div>' +
'<div class="fig" id="pfig"></div><div class="out" id="pout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Mark each core with a bracket. Then count in cores to find any place in the pattern.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Same pattern, new look</h2>' +
'<p>The same pattern can be shown in different ways: shapes, letters, numbers, or sounds. This is called <b>translating</b> a pattern.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + row('ABBABB') + '</div>' +
'<div class="tbl"><table><tbody><tr><td class="l">Letters</td><td class="big">A B B A B B</td></tr><tr><td class="l">Numbers</td><td class="big">1 2 2 1 2 2</td></tr><tr><td class="l">Sounds</td><td>clap, snap, snap, clap, snap, snap</td></tr></tbody></table></div>' +
'<p>All four show the same pattern: one thing, then two of another.</p></div>' +
'<div class="yt" data-yt="translate"></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Matching the shapes instead of the structure. A B B is "one, then two the same". Red, blue, blue and 5, 7, 7 are both A B B, even though they look different.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Number patterns</h2>' +
'<p>In a number pattern, the <b>rule</b> tells how to get the next number. "Start at 4. Add 5 each time." gives 4, 9, 14, 19, 24.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>What is the rule for 30, 28, 26, 24? Each number is 2 less than the one before. The rule is <b>start at 30, subtract 2 each time</b>. Next comes <b>22</b>.</p></div>' +
'<div class="yt" data-yt="rule"></div>' +
'<p>A hundred chart shows number patterns as pictures. Counting by 5s from 5 makes two straight columns.</p>' +
'<div class="lab"><span class="lt">Try it: a pattern on the hundred chart</span>' +
'<div class="ctrl"><label for="ns">Start at<input type="number" id="ns" min="1" max="99" value="3"></label><label for="nk">Add each time<select id="nk"><option>2</option><option>3</option><option>4</option><option selected>5</option><option>9</option><option>10</option><option>11</option></select></label></div>' +
'<div class="fig" id="nfig"></div><div class="out" id="nout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To find the rule, look at how much each number changes. If the numbers get bigger, the rule adds. If they get smaller, the rule subtracts.</p></div>' +
'<div class="yt" data-yt="missing"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Symbols for unknown numbers</h2>' +
'<p>A symbol like <span class="math big">&#9633;</span> or <span class="math big">?</span> can stand for a number we do not know yet.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">7 + &#9633; = 12</span> &nbsp; The box stands for a number. 7 plus what makes 12? 7 + 5 = 12, so the box is <b>5</b>.</p></div>' +
'<div class="yt" data-yt="box"></div>' +
'<div class="key"><b class="t">Key idea</b><p>In the same number sentence, the same symbol always stands for the same number. In &#9650; + &#9650; = 10, each triangle is 5.</p></div>' +
'<div class="yt" data-yt="same"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Equal sides</h2>' +
'<p>The equal sign <b>=</b> means "is the same as". Both sides must be worth the same amount, like a balance that is level.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">8 + 4 = 10 + &#9633;</span> &nbsp; The left side is 8 + 4 = 12. The right side must also be 12. 10 + 2 = 12, so the box is <b>2</b>.</p><div class="fig">' + balance('8 + 4', '10 + 2', 0) + '</div></div>' +
'<div class="yt" data-yt="balance"></div>' +
'<div class="lab"><span class="lt">Try it: make the balance level</span>' +
'<div class="ctrl"><label for="ba">Left: first number<input type="number" id="ba" min="0" max="50" value="9"></label><label for="bb">Left: second number<input type="number" id="bb" min="0" max="50" value="6"></label><label for="bc">Right: first number<input type="number" id="bc" min="0" max="50" value="10"></label><label for="bd">Right: your number<input type="number" id="bd" min="0" max="50" value="3"></label></div>' +
'<div class="fig" id="bfig"></div><div class="out" id="bout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking = means "write the answer next". In 8 + 4 = &#9633; + 5, the box is not 12. Both sides must equal 12, so the box is 7.</p></div>' +
'<div class="yt" data-yt="tf"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function p() {
        var core = $('#pc', root).value, n = +$('#pn', root).value;
        $('#pno', root).textContent = n;
        var len = Math.max(n, 2 * core.length), str = extend(core, len);
        $('#pfig', root).innerHTML = row(str, core.length);
        var k = (n - 1) % core.length, piece = PIECE[core.charAt(k)].n, full = Math.floor((n - 1) / core.length);
        $('#pout', root).innerHTML = '<p>Place ' + n + ' is a <span class="big">' + piece + '</span>.</p><p class="t2">The core has ' + core.length + ' pieces. ' + (full ? full + ' full core' + (full > 1 ? 's' : '') + ' come' + (full > 1 ? '' : 's') + ' first, then ' : 'It is ') + 'piece ' + (k + 1) + ' of the core.</p>';
      }
      A.bind(root, ['pc', 'pn'], p);
      function n() {
        var st = Math.max(1, Math.min(99, parseInt($('#ns', root).value, 10) || 1)), k = +$('#nk', root).value, set = [];
        for (var v = st; v <= 100; v += k) set.push(v);
        $('#nfig', root).innerHTML = chart(set);
        $('#nout', root).innerHTML = '<p><b>Rule:</b> start at ' + st + ', add ' + k + ' each time.</p><p>' + set.join(', ') + '</p><p class="t2">' +
          (k === 10 ? 'Adding 10 goes straight down a column.' : k === 9 ? 'Adding 9 moves down and one to the left.' : k === 11 ? 'Adding 11 moves down and one to the right.' : k === 5 ? 'Adding 5 makes two columns.' : k === 2 ? 'Adding 2 skips every other number.' : 'Look for the shape the coloured squares make.') + '</p>';
      }
      A.bind(root, ['ns', 'nk'], n);
      function b() {
        var g = function (id) { return Math.max(0, Math.min(50, parseInt($('#' + id, root).value, 10) || 0)); };
        var a = g('ba'), bb = g('bb'), c = g('bc'), d = g('bd'), L = a + bb, Rr = c + d;
        $('#bfig', root).innerHTML = balance(a + ' + ' + bb, c + ' + ' + d, L === Rr ? 0 : L > Rr ? -1 : 1);
        var need = L - c;
        $('#bout', root).innerHTML = '<p>Left side: ' + a + ' + ' + bb + ' = <b>' + L + '</b>. Right side: ' + c + ' + ' + d + ' = <b>' + Rr + '</b>.</p><p>' +
          (L === Rr ? '<span class="big">' + a + ' + ' + bb + ' = ' + c + ' + ' + d + '</span> &nbsp; Level! Both sides are ' + L + '.' :
            need >= 0 ? 'Not level yet. The right side needs to be ' + L + '. Try changing your number.' : 'The right side is already too heavy, even before your number. Lower its first number.') + '</p>';
      }
      A.bind(root, ['ba', 'bb', 'bc', 'bd'], b);
    },

    turns: {
      next: function () { return nextQ(1); },
      translate: function () {
        var cores = ['AB', 'ABB', 'AAB', 'ABC'], c = R.pick(cores);
        var num = function (core) { var m = {}, k = 1; return extend(core, 6).split('').map(function (x) { if (!m[x]) m[x] = k++; return m[x]; }).join(' '); };
        var right = num(c), others = cores.filter(function (x) { return x !== c; }).map(num);
        var o = R.mc(right, others);
        return { q: 'Which number pattern matches these shapes?', type: 'mc', options: o.options, answer: o.answer, fig: row(extend(c, 6)), hint: 'Give the first shape the number 1, the next new shape 2, and so on. Then write the numbers in order.', explain: 'The shapes follow the pattern ' + right + '.' };
      },
      rule: function () { var st = R.int(2, 30), k = R.pick([2, 3, 5, 10]), up = R.int(0, 1); if (!up) st = st + 5 * k; var seq = [0, 1, 2, 3].map(function (i) { return up ? st + i * k : st - i * k; }); var right = 'start at ' + st + ', ' + (up ? 'add ' : 'subtract ') + k + ' each time'; var o = R.mc(right, ['start at ' + st + ', ' + (up ? 'subtract ' : 'add ') + k + ' each time', 'start at ' + st + ', ' + (up ? 'add ' : 'subtract ') + (k + 1) + ' each time']); return { q: 'What is the rule? <span class="math big">' + seq.join(', ') + '</span>', type: 'mc', options: o.options, answer: o.answer, hint: 'How much does the number change from one to the next? Does it get bigger or smaller?', explain: 'Each number is ' + k + (up ? ' more' : ' less') + ' than the one before.' }; },
      missing: function () { var st = R.int(1, 20), k = R.pick([3, 4, 5, 10]), seq = [0, 1, 2, 3, 4].map(function (i) { return st + i * k; }), g = R.int(1, 3); return { q: 'What number is missing? <span class="math big">' + seq.map(function (v, i) { return i === g ? '___' : v; }).join(', ') + '</span>', type: 'num', answer: seq[g], hint: 'Find how much it goes up each time. Add that to the number before the gap.', explain: 'The rule adds ' + k + '. ' + seq[g - 1] + ' + ' + k + ' = ' + seq[g] + '.' }; },
      box: function () { var a = R.int(4, 12), b = R.int(3, 9); return { q: 'What number does the box stand for? <span class="math big">' + a + ' + &#9633; = ' + (a + b) + '</span>', type: 'num', answer: b, hint: 'Count up from ' + a + ' to ' + (a + b) + '.', explain: a + ' + ' + b + ' = ' + (a + b) + ', so the box is ' + b + '.' }; },
      same: function () { var n = R.int(2, 9); return { q: 'Each &#9650; is the same number. What is &#9650;? <span class="math big">&#9650; + &#9650; = ' + 2 * n + '</span>', type: 'num', answer: n, hint: 'Which number added to itself makes ' + 2 * n + '? Think of doubles.', explain: n + ' + ' + n + ' = ' + 2 * n + ', so &#9650; is ' + n + '.' }; },
      balance: function () { var a = R.int(5, 9), b = R.int(3, 9), c = 10, w = a + b; if (w <= c) b = c - a + R.int(1, 4), w = a + b; return { q: 'What number goes in the box? <span class="math big">' + a + ' + ' + b + ' = ' + c + ' + &#9633;</span>', type: 'num', answer: w - c, fig: balance(a + ' + ' + b, c + ' + ?', 0).replace('It is level, so both sides are equal.', 'It must be level.'), hint: 'First work out the left side: ' + a + ' + ' + b + '. The right side must be the same.', explain: a + ' + ' + b + ' = ' + w + ', and ' + c + ' + ' + (w - c) + ' = ' + w + '.' }; },
      tf: function () { var a = R.int(3, 9), b = R.int(3, 9), d = R.pick([0, 0, 1, -1]), c = a + 1, e = b - 1 + d; return { q: 'True or false? <span class="math big">' + a + ' + ' + b + ' = ' + c + ' + ' + e + '</span>', type: 'mc', options: ['True', 'False'], answer: d === 0 ? 0 : 1, hint: 'Work out each side. Are they the same?', explain: 'The left side is ' + (a + b) + '. The right side is ' + (c + e) + '. ' + (d === 0 ? 'They are the same, so it is true.' : 'They are different, so it is false.') }; }
    },

    quiz: [
      { q: 'What comes next?', type: 'mc', options: ['blue circle', 'yellow square', 'green triangle'], answer: 1, fig: row('ABBABBA?'), hint: 'The core is circle, square, square. Where are you in the core?', explain: 'The core is blue circle, yellow square, yellow square. After the circle comes a yellow square.' },
      { q: 'A pattern goes red, red, blue, red, red, blue. Which pattern is the same?', type: 'mc', options: ['A B A B A B', 'A A B A A B', 'A B B A B B', 'A B C A B C'], answer: 1, hint: 'Red, red, blue is "two the same, then one different".', explain: 'Red, red, blue is A A B, so the pattern is A A B A A B.' },
      { q: 'What is the 10th shape? Core: circle, square.', type: 'mc', options: ['circle', 'square'], answer: 1, fig: row('ABABAB', 2), hint: 'Every even place (2nd, 4th, 6th&hellip;) is a square.', explain: 'Circles are in places 1, 3, 5, 7, 9. Squares are in places 2, 4, 6, 8, 10. The 10th is a square.' },
      { q: 'What number is missing? <span class="math big">15, 20, ___, 30, 35</span>', type: 'num', answer: 25, hint: 'The rule adds 5 each time.', explain: '20 + 5 = 25.' },
      { q: 'What is the rule? <span class="math big">50, 40, 30, 20</span>', type: 'mc', options: ['start at 50, add 10', 'start at 50, subtract 10', 'start at 50, subtract 5', 'start at 20, add 10'], answer: 1, hint: 'Do the numbers get bigger or smaller? By how much?', explain: 'Each number is 10 less, so the rule is start at 50, subtract 10 each time.' },
      { q: 'What number goes in the box? <span class="math big">9 + 6 = &#9633; + 5</span>', type: 'num', answer: 10, fig: balance('9 + 6', '? + 5', 0).replace('It is level, so both sides are equal.', 'It must be level.'), hint: 'The left side is 9 + 6 = 15. What plus 5 makes 15?', explain: '9 + 6 = 15, and 10 + 5 = 15. The box is 10, not 15.' },
      { q: 'Which is <b>true</b>?', type: 'mc', options: ['6 + 4 = 5 + 5', '6 + 4 = 6 + 5', '7 + 3 = 7 + 4', '8 + 2 = 9 + 2'], answer: 0, hint: 'Work out both sides of each one.', explain: '6 + 4 = 10 and 5 + 5 = 10. Both sides are the same.' }
    ],

    practice: [
      { id: 'p2-repeat', name: 'Repeating patterns', code: 'C1.1, C1.3', gen: nextQ },
      { id: 'p2-translate', name: 'Translate a pattern', code: 'C1.2', gen: function (lv) {
        var cores = ['AB', 'ABB', 'AAB', 'ABC', 'AABB'], c = R.pick(lv === 1 ? cores.slice(0, 3) : cores);
        var lettersOf = function (core) { var m = {}, k = 0; return extend(core, 6).split('').map(function (x) { if (!m[x]) m[x] = 'ABCD'.charAt(k++); return m[x]; }).join(' '); };
        var numsOf = function (core) { return lettersOf(core).replace(/A/g, '1').replace(/B/g, '2').replace(/C/g, '3'); };
        var f = lv === 3 ? numsOf : lettersOf, right = f(c), wrong = cores.filter(function (x) { return f(x) !== right; }).map(f);
        var o = R.mc(right, wrong);
        var words = lv === 3 ? extend(c, 6).split('').map(function (x) { return { A: 'clap', B: 'stomp', C: 'snap' }[x]; }).join(', ') : '';
        return { q: lv === 3 ? 'Which number pattern matches the sounds? <b>' + words + '</b>' : 'Which letter pattern matches these shapes?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 3 ? '' : row(extend(c, 6)), hint: 'The first thing gets ' + (lv === 3 ? '1' : 'A') + '. The next new thing gets ' + (lv === 3 ? '2' : 'B') + '. Keep the same name for the same thing.',
          steps: ['Name the first thing ' + (lv === 3 ? '1' : 'A') + '.', 'Each time a new thing appears, give it the next ' + (lv === 3 ? 'number' : 'letter') + '.', 'The pattern is ' + right + '.'], explain: 'It translates to ' + right + '.' };
      } },
      { id: 'p2-number', name: 'Number patterns', code: 'C1.3, C1.4', gen: function (lv) {
        var k = lv === 1 ? R.pick([2, 5, 10]) : R.pick([3, 4, 5, 10, 11, 9]), up = lv === 3 ? R.int(0, 1) : 1, st = R.int(1, 30);
        if (!up) st = R.int(50, 99);
        var seq = [0, 1, 2, 3, 4].map(function (i) { return up ? st + i * k : st - i * k; });
        var g = lv === 1 ? 4 : R.int(1, 4);
        return { q: 'What number is missing? <span class="math big">' + seq.map(function (v, i) { return i === g ? '___' : v; }).join(', ') + '</span>', type: 'num', answer: seq[g], fig: lv === 1 ? chart(seq.slice(0, g)) : '', hint: 'How much does it change each time? ' + (up ? 'Add' : 'Subtract') + ' that to the number before the gap.',
          steps: ['Compare two numbers next to each other: ' + seq[g === 1 ? 2 : 0] + ' and ' + seq[g === 1 ? 3 : 1] + '.', 'The rule is: ' + (up ? 'add ' : 'subtract ') + k + ' each time.', seq[g - 1] + (up ? ' + ' : ' ' + M + ' ') + k + ' = ' + seq[g] + '.'], explain: 'The missing number is ' + seq[g] + '.' };
      } },
      { id: 'p2-symbol', name: 'Find the unknown', code: 'C2.1', gen: function (lv) {
        var a = R.int(3, lv === 1 ? 9 : 40), b = R.int(2, lv === 1 ? 9 : 30), w = a + b, sym = lv === 3 ? R.pick(['&#9650;', '?', '&#9733;']) : '&#9633;';
        if (lv === 3 && R.int(0, 1)) return { q: 'What number does ' + sym + ' stand for? <span class="math big">' + w + ' ' + M + ' ' + sym + ' = ' + a + '</span>', type: 'num', answer: b, hint: 'Think addition: ' + a + ' plus what makes ' + w + '?', steps: ['The whole is ' + w + '. One part is ' + a + '.', a + ' + ' + sym + ' = ' + w + '.', sym + ' is ' + b + '.'], explain: w + ' ' + M + ' ' + b + ' = ' + a + '.' };
        return { q: 'What number does ' + sym + ' stand for? <span class="math big">' + a + ' + ' + sym + ' = ' + w + '</span>', type: 'num', answer: b, hint: 'Count up from ' + a + ' to ' + w + '. Or subtract: ' + w + ' ' + M + ' ' + a + '.', steps: ['The symbol is a number we do not know yet.', a + ' plus that number makes ' + w + '.', w + ' ' + M + ' ' + a + ' = ' + b + ', so ' + sym + ' is ' + b + '.'], explain: a + ' + ' + b + ' = ' + w + '.' };
      } },
      { id: 'p2-equal', name: 'Make both sides equal', code: 'C2.2, C2.3', gen: function (lv) {
        if (lv === 1) {
          var a = R.int(2, 9), b = R.int(2, 9), d = R.pick([0, 1, -1]), c = a + 1, e = b - 1 + d;
          if (e < 0) e = 0, d = 1 - b;
          return { q: 'True or false? <span class="math big">' + a + ' + ' + b + ' = ' + c + ' + ' + e + '</span>', type: 'mc', options: ['True', 'False'], answer: a + b === c + e ? 0 : 1, hint: 'Work out each side. Are they the same?', steps: ['Left side: ' + a + ' + ' + b + ' = ' + (a + b) + '.', 'Right side: ' + c + ' + ' + e + ' = ' + (c + e) + '.', (a + b === c + e ? 'Same, so true.' : 'Different, so false.')], explain: (a + b === c + e ? 'Both sides are ' + (a + b) + '.' : (a + b) + ' is not the same as ' + (c + e) + '.') };
        }
        var x = R.int(5, lv === 2 ? 9 : 40), y = R.int(3, lv === 2 ? 9 : 40), tot = x + y, z = lv === 2 ? 10 : Math.max(0, Math.floor(tot / 10) * 10 - 10 * R.int(0, 1));
        if (z >= tot || z === 0) z = Math.max(1, tot - R.int(2, 7));
        var left = R.int(0, 1);
        return { q: 'What number goes in the box? <span class="math big">' + (left ? x + ' + ' + y + ' = ' + z + ' + &#9633;' : '&#9633; + ' + z + ' = ' + x + ' + ' + y) + '</span>', type: 'num', answer: tot - z, fig: lv === 2 ? balance(x + ' + ' + y, z + ' + ?', 0).replace('It is level, so both sides are equal.', 'It must be level.') : '', hint: 'Work out ' + x + ' + ' + y + ' first. The other side must be the same.',
          steps: [x + ' + ' + y + ' = ' + tot + '.', 'The other side must also be ' + tot + '.', z + ' + ' + (tot - z) + ' = ' + tot + ', so the box is ' + (tot - z) + '.'], explain: 'Both sides are ' + tot + '. The box is ' + (tot - z) + '.' };
      } }
    ]
  });
})();
