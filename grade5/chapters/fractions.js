(function () {
  var A = Atlas;
  function bar(n, d, y, w, h, label) {
    var s = '', cw = w / d;
    for (var i = 0; i < d; i++) {
      s += '<rect x="' + (10 + i * cw) + '" y="' + y + '" width="' + cw + '" height="' + h + '" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="' + (d > 40 ? 0.5 : 2) + '"/>';
    }
    return s;
  }
  function dec(n, d) {
    var r = d / A.gcd(n, d) || d;
    if (n === 0) return { t: '0', exact: true };
    var g = A.gcd(n, d), rd = d / g;
    while (rd % 2 === 0) rd /= 2;
    while (rd % 5 === 0) rd /= 5;
    var exact = rd === 1, v = n / d;
    return { t: exact ? String(parseFloat(v.toFixed(4))) : v.toFixed(3), exact: exact };
  }
  function mixed(n, d) {
    var w = Math.floor(n / d), r = n % d;
    if (r === 0) return String(w);
    return (w ? w + ' ' : '') + r + '/' + d;
  }

  var R = A.R, D = A.draw;
  /* circles side by side, each with a caption */
  function pies(list, r) {
    return '<div class="pies">' + list.map(function (p) { return '<figure>' + D.pie(p[0], p[1], r || 42, null, p[3]) + '<figcaption>' + p[2] + '</figcaption></figure>'; }).join('') + '</div>';
  }
  function rep(c, k) { var a = []; for (var i = 0; i < k; i++) a.push(c); return a; }
  /* the same bar cut into 4 equal parts and into 4 unequal parts */
  function fairUnfair() {
    var s = '', eq = [0, 0.25, 0.5, 0.75, 1], un = [0, 0.12, 0.45, 0.62, 1];
    [[eq, 10, 'Equal parts: each one is 1/4', 'var(--good)', '&#10003;'], [un, 70, 'Unequal parts: not quarters', 'var(--bad)', '&#10007;']].forEach(function (r) {
      for (var i = 0; i < 4; i++) s += '<rect x="' + (10 + 300 * r[0][i]) + '" y="' + r[1] + '" width="' + (300 * (r[0][i + 1] - r[0][i])) + '" height="34" style="fill:' + (i === 0 ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
      s += '<text x="322" y="' + (r[1] + 25) + '" font-size="24" font-weight="800" style="fill:' + r[3] + '">' + r[4] + '</text><text x="348" y="' + (r[1] + 23) + '" font-size="15">' + r[2] + '</text>';
    });
    return A.svg(560, 112, s, 'A bar cut into 4 equal parts is cut into quarters. A bar cut into 4 unequal parts is not.');
  }
  function lcm(a, b) { return a * b / A.gcd(a, b); }
  A.register('fractions', {
    html:
'<section class="sec"><h2><span class="n">1</span>One amount, three names</h2>' +
'<p>A fraction names equal parts of a whole. The <b>denominator</b> (bottom) says how many equal parts. The <b>numerator</b> (top) says how many you have. The same amount can also be a <b>decimal</b> or a <b>percent</b>, which means "out of 100".</p>' +
'<div class="lab"><span class="lt">Try it: fraction bar</span>' +
'<div class="ctrl"><label for="fd">Parts in the whole<select id="fd"><option>2</option><option>3</option><option>4</option><option selected>5</option><option>6</option><option>8</option><option>10</option><option>12</option><option>20</option><option>25</option><option>100</option></select></label>' +
'<label for="fn">Parts shaded: <output id="fno"></output><input type="range" id="fn" min="0" max="5" value="3"></label></div>' +
'<p class="t2" style="margin:.4em 0 0;font-size:.9rem">Three pictures of the same fraction: a bar, a circle and a point on a number line.</p>' +
'<div class="fig" id="fbar"></div><div class="models" id="fmod"></div><div class="out" id="fout"></div></div>' +
'<div class="eg"><p><b>Example.</b> A pizza is cut into 8 equal slices and you eat 3. You ate 3/8 of the pizza. The 8 tells the size of each slice. The 3 tells how many slices.</p>' + pies([[3, 8, '3/8 eaten'], [5, 8, '5/8 left']]) + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>The parts must be equal in size. A pizza cut into 8 uneven pieces is not cut into eighths.</p><div class="fig">' + fairUnfair() + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Equivalent fractions</h2>' +
'<p>Equivalent fractions have different names but the same size. Multiply or divide the top and bottom by the <b>same</b> number and the fraction keeps its value.</p>' +
'<div class="lab"><span class="lt">Try it: make an equivalent fraction</span>' +
'<div class="ctrl"><label for="en">Top<input type="number" id="en" min="1" max="11" value="2"></label>' +
'<label for="ed">Bottom<select id="ed"><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option><option>8</option><option>10</option><option>12</option></select></label>' +
'<label for="ek">Multiply top and bottom by: <output id="eko"></output><input type="range" id="ek" min="1" max="6" value="2"></label></div>' +
'<div class="fig" id="ebar"></div><div class="out" id="eout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To write a fraction in <b>simplest form</b>, divide the top and bottom by their biggest common factor. 6/8 divided by 2 is 3/4. Fewer, bigger pieces cover the same length.</p>' +
'<div class="fig">' + D.fbars([{ n: 6, d: 8 }, { n: 3, d: 4 }], { mark: 0.75, w: 440 }) + '</div></div>' +
'<div class="eg"><p><b>Example.</b> 3/4 = ?/12. 4 &times; 3 = 12, so multiply the top by 3 too: 3 &times; 3 = 9. So 3/4 = <b>9/12</b>.</p>' +
'<div class="fig">' + D.fbars([{ n: 3, d: 4 }, { n: 9, d: 12 }], { mark: 0.75, w: 440 }) + '</div><p class="t2">Each quarter splits into 3 twelfths. The shaded length does not change.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Improper fractions and mixed numbers</h2>' +
'<p>When the top is bigger than the bottom, you have more than one whole. 11/4 is an <b>improper fraction</b>. It can also be written as a <b>mixed number</b>: 2 whole bars and 3 quarters, or 2&nbsp;3/4.</p>' +
'<div class="lab"><span class="lt">Try it: wholes and parts</span>' +
'<div class="ctrl"><label for="md">Each whole is split into<select id="md"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>8</option><option>10</option></select></label>' +
'<label for="mn">Parts shaded: <output id="mno"></output><input type="range" id="mn" min="1" max="40" value="11"></label></div>' +
'<div class="fig" id="mbar"></div><div class="out" id="mout"></div></div>' +
'<div class="eg"><p><b>Example.</b> 7 thirds fill 2 whole bars and 1 more third.</p>' +
'<div class="fig">' + D.fbars([{ n: 7, d: 3, label: '7/3' }], { unit: 140, w: 560 }) + '</div>' +
'<div class="fig">' + D.fline(3, 3, [{ v: 7 / 3, label: '7/3 = 2 1/3' }], 'Number line from 0 to 3 in thirds with 7/3 marked') + '</div>' +
'<p>Mixed to improper: 2&nbsp;1/3 = (2 &times; 3 + 1)/3 = <b>7/3</b>.</p><p>Improper to mixed: 7 &divide; 3 = 2 remainder 1, so 7/3 = <b>2&nbsp;1/3</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Writing 7/3 as 2&nbsp;1/7. The leftover piece is still a third, so it stays over 3: 7/3 = 2&nbsp;1/3.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Comparing fractions</h2>' +
'<ul><li><b>Same denominator:</b> the bigger top is bigger. 5/8 &gt; 3/8.</li>' +
'<li><b>Same numerator:</b> the smaller bottom is bigger, because the pieces are bigger. 1/3 &gt; 1/5.</li>' +
'<li><b>Use a benchmark:</b> compare to 0, 1/2 and 1. 3/8 is less than 1/2 (which is 4/8).</li>' +
'<li><b>Otherwise:</b> rewrite both with a common denominator. 5/8 vs 3/4: 3/4 = 6/8, so 3/4 is greater.</li></ul>' +
'<div class="lab"><span class="lt">Try it: compare two fractions</span>' +
'<div class="ctrl"><label for="ca">First top<input type="number" id="ca" min="0" max="12" value="5"></label>' +
'<label for="cb">First bottom<select id="cb"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option selected>8</option><option>10</option><option>12</option></select></label>' +
'<label for="cc">Second top<input type="number" id="cc" min="0" max="12" value="3"></label>' +
'<label for="cd">Second bottom<select id="cd"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>8</option><option>10</option><option>12</option></select></label></div>' +
'<div class="fig" id="cfig"></div><div class="fig" id="cline"></div><div class="out" id="cout"></div></div>' +
'<div class="eg"><p><b>Example.</b> Order 2/3, 1/2 and 5/6 from least to greatest. In sixths they are 4/6, 3/6 and 5/6. So the order is <b>1/2, 2/3, 5/6</b>.</p>' +
'<div class="fig">' + D.fbars([{ n: 3, d: 6, label: '1/2' }, { n: 4, d: 6, label: '2/3' }, { n: 5, d: 6, label: '5/6' }], { w: 440 }) + '</div><p class="t2">All three bars are cut into sixths, so you can count the shaded pieces.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking 1/8 is bigger than 1/4 because 8 is bigger than 4. Eighths are smaller pieces, so 1/8 &lt; 1/4.</p>' + pies([[1, 8, '1/8: small slice'], [1, 4, '1/4: bigger slice']], 40) + '</div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Adding and subtracting like fractions</h2>' +
'<p>When two fractions have the <b>same denominator</b>, the pieces are the same size. Add or subtract the tops. The bottom stays the same, because the size of the pieces does not change.</p>' +
'<div class="eg"><p><b>Example.</b> <span class="math">3/8 + 4/8 = 7/8</span>. 3 eighths and 4 eighths make 7 eighths.</p>' +
'<div class="fig">' + D.fbars([{ n: 7, d: 8, label: '7/8', cols: rep('var(--strand)', 3).concat(rep('var(--hi)', 4)) }], { w: 440 }) + '</div>' +
'<p class="t2">Blue: 3/8. Yellow: 4/8. Every piece is still one eighth.</p><p class="math">7/5 &minus; 3/5 = 4/5</p></div>' +
'<div class="lab"><span class="lt">Try it: same-size pieces</span>' +
'<div class="ctrl"><label for="ad">Pieces in each whole<select id="ad"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>8</option><option>10</option><option>12</option></select></label>' +
'<label for="an">First top: <output id="ano"></output><input type="range" id="an" min="0" max="12" value="3"></label>' +
'<label for="ao">Operation<select id="ao"><option value="+">add</option><option value="-">subtract</option></select></label>' +
'<label for="bn">Second top: <output id="bno"></output><input type="range" id="bn" min="0" max="12" value="2"></label></div>' +
'<div class="fig" id="afig"></div><div class="out" id="aout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the bottoms. 1/4 + 2/4 is not 3/8. Three quarters is 3/4, and the pieces are still quarters. The bars show that 3/8 is much less.</p>' +
'<div class="fig">' + D.fbars([{ n: 3, d: 4, label: '3/4', cols: ['var(--strand)', 'var(--hi)', 'var(--hi)'] }, { n: 3, d: 8, label: '3/8', col: 'var(--bad)' }], { w: 440 }) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Whole numbers and unit fractions</h2>' +
'<p>A <b>unit fraction</b> has 1 on top, like 1/3 or 1/8. You can multiply a whole number by one, or divide a whole number by one.</p>' +
'<ul><li><b>3 &times; 1/4</b> means 3 groups of one quarter. That is 3/4.</li>' +
'<li><b>3 &divide; 1/4</b> means "how many quarters fit in 3 wholes?" Each whole has 4 quarters, so the answer is 12.</li></ul>' +
'<div class="lab"><span class="lt">Try it: groups of a unit fraction</span>' +
'<div class="ctrl"><label for="uw">Whole number: <output id="uwo"></output><input type="range" id="uw" min="1" max="9" value="3"></label>' +
'<label for="uo">Operation<select id="uo"><option value="x">&times; (groups of)</option><option value="d">&divide; (how many fit)</option></select></label>' +
'<label for="ud">Unit fraction<select id="ud"><option value="2">1/2</option><option value="3">1/3</option><option value="4" selected>1/4</option><option value="5">1/5</option><option value="6">1/6</option><option value="8">1/8</option><option value="10">1/10</option><option value="12">1/12</option></select></label></div>' +
'<div class="fig" id="ufig"></div><div class="out" id="uout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Dividing by a unit fraction gives a <b>bigger</b> number. 2 &divide; 1/5 = 10, because ten fifths fit in two wholes.</p></div>' +
'<div class="eg"><p><b>Example.</b> 5 &times; 1/3 = 5/3 = 1&nbsp;2/3.</p>' +
'<div class="fig">' + D.fbars([{ n: 5, d: 3, label: '5 &times; 1/3' }], { lw: 100, unit: 180, w: 500 }) + '</div>' +
'<p>And 2 &divide; 1/3 = 6, because each whole holds 3 thirds.</p>' +
'<div class="fig">' + D.fbars([{ n: 6, d: 3, label: '2 wholes', cols: ['var(--strand)', 'var(--hi)', 'var(--strand)', 'var(--hi)', 'var(--strand)', 'var(--hi)'] }], { lw: 100, unit: 180, w: 500 }) + '</div><p class="t2">Count the pieces: 6 thirds.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function f1() {
        var d = parseInt($('#fd', root).value, 10), r = $('#fn', root);
        r.max = d;
        var n = Math.min(parseInt(r.value, 10), d);
        r.value = n;
        $('#fno', root).textContent = n + ' of ' + d;
        $('#fbar', root).innerHTML = A.svg(540, 56, bar(n, d, 8, 520, 40), n + ' of ' + d + ' parts shaded');
        $('#fmod', root).innerHTML = '<figure>' + D.pie(n, d, 50) + '<figcaption>circle</figcaption></figure><figure>' + D.fline(1, d <= 25 ? d : 10, [{ v: n / d, label: n + '/' + d }], 'Number line from 0 to 1 with ' + n + '/' + d + ' marked', 380) + '<figcaption>number line</figcaption></figure>';
        var dc = dec(n, d), pc = n * 100 / d, pexact = Number.isInteger(pc);
        $('#fout', root).innerHTML = '<p><span class="big">' + n + '/' + d + '</span> &nbsp;=&nbsp; <span class="big">' + (dc.exact ? '' : '&#8776; ') + dc.t + '</span> &nbsp;=&nbsp; <span class="big">' + (pexact ? '' : '&#8776; ') + (pexact ? pc : pc.toFixed(1)) + '%</span></p>' +
          (dc.exact ? '' : '<p>This one never ends as a decimal, so the numbers are rounded.</p>');
      }
      A.bind(root, ['fd', 'fn'], f1);

      function f2() {
        var d = parseInt($('#ed', root).value, 10), nn = $('#en', root);
        var n = Math.max(1, Math.min(d - 1, parseInt(nn.value, 10) || 1));
        var k = parseInt($('#ek', root).value, 10);
        $('#eko', root).textContent = '× ' + k;
        var s = bar(n, d, 4, 520, 34) + bar(n * k, d * k, 50, 520, 34);
        $('#ebar', root).innerHTML = A.svg(540, 92, s, n + '/' + d + ' and ' + (n * k) + '/' + (d * k) + ' have equal shaded length');
        var g = A.gcd(n * k, d * k);
        $('#eout', root).innerHTML = '<p><span class="big">' + n + '/' + d + ' = ' + (n * k) + '/' + (d * k) + '</span></p>' +
          '<p>Top and bottom were both multiplied by ' + k + '. Simplest form of ' + (n * k) + '/' + (d * k) + ' is ' + ((n * k) / g) + '/' + ((d * k) / g) + '.</p>';
      }
      A.bind(root, ['en', 'ed', 'ek'], f2);

      function f3() {
        var d = parseInt($('#md', root).value, 10), r = $('#mn', root);
        r.max = d * 5;
        var n = Math.min(parseInt(r.value, 10), d * 5);
        $('#mno', root).textContent = n + '/' + d;
        var whole = Math.ceil(n / d), cw = 520 / 5 / 1, s = '';
        var bw = 100;
        for (var b = 0; b < whole; b++) {
          var filled = Math.max(0, Math.min(d, n - b * d)), px = 10 + b * 105;
          for (var i = 0; i < d; i++) s += '<rect x="' + (px + i * bw / d) + '" y="10" width="' + (bw / d) + '" height="36" style="fill:' + (i < filled ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
        }
        $('#mbar', root).innerHTML = A.svg(540, 56, s, n + '/' + d + ' drawn as bars');
        var w = Math.floor(n / d), rem = n % d;
        $('#mout', root).innerHTML = '<p><span class="big">' + n + '/' + d + ' = ' + mixed(n, d).replace(' ', '&nbsp;') + '</span></p>' +
          '<p>' + (w ? w + ' whole' + (w > 1 ? 's' : '') : '') + (w && rem ? ' and ' : '') + (rem ? rem + '/' + d : '') + (n < d ? ' (less than one whole)' : '') + '.</p>';
      }
      A.bind(root, ['md', 'mn'], f3);

      function wholes(parts, d, colourOf, maxW) {
        var count = Math.max(1, Math.ceil(parts.length / d)), bw = Math.min(150, (maxW - 10) / count - 6), sw = '';
        for (var w = 0; w < count; w++) {
          var px = 6 + w * (bw + 6);
          for (var i = 0; i < d; i++) {
            var k = w * d + i;
            sw += '<rect x="' + (px + i * bw / d) + '" y="6" width="' + (bw / d) + '" height="36" style="fill:' + (k < parts.length ? colourOf(parts[k]) : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
            if (parts[k] === 'x') sw += '<line x1="' + (px + i * bw / d + 2) + '" y1="10" x2="' + (px + (i + 1) * bw / d - 2) + '" y2="38" style="stroke:var(--bad)" stroke-width="3"/>';
          }
        }
        return sw;
      }
      function f4() {
        var d = +$('#ad', root).value, ra = $('#an', root), rb = $('#bn', root), op = $('#ao', root).value;
        ra.max = 2 * d; rb.max = 2 * d;
        var a = Math.min(+ra.value, 2 * d), b = Math.min(+rb.value, 2 * d);
        $('#ano', root).textContent = a + '/' + d; $('#bno', root).textContent = b + '/' + d;
        var o = $('#aout', root), f = $('#afig', root);
        if (op === '-' && b > a) { f.innerHTML = ''; o.innerHTML = '<p>The second fraction is bigger than the first. Make the first one bigger, or switch to add.</p>'; return; }
        var r = op === '+' ? a + b : a - b, parts = [], i;
        for (i = 0; i < a; i++) parts.push(op === '-' && i >= a - b ? 'x' : 'a');
        if (op === '+') for (i = 0; i < b; i++) parts.push('b');
        f.innerHTML = A.svg(540, 48, wholes(parts, d, function (t) { return t === 'b' ? 'var(--hi)' : t === 'x' ? 'color-mix(in srgb,var(--bad) 18%,var(--card))' : 'var(--strand)'; }, 540),
          op === '+' ? a + ' blue and ' + b + ' yellow pieces of size 1/' + d : a + ' pieces with ' + b + ' crossed out');
        var g = r ? A.gcd(r, d) : 1;
        o.innerHTML = '<p><span class="big">' + a + '/' + d + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '/' + d + ' = ' + r + '/' + d + '</span></p>' +
          '<p>' + (op === '+' ? a + ' pieces and ' + b + ' more pieces make ' + r + ' pieces.' : a + ' pieces take away ' + b + ' pieces leaves ' + r + ' pieces.') + ' Each piece is still 1/' + d + '.</p>' +
          (r && g > 1 ? '<p>Simplest form: ' + (r / g) + '/' + (d / g) + '.</p>' : '') +
          (r > d ? '<p>As a mixed number: ' + mixed(r, d).replace(' ', '&nbsp;') + '.</p>' : '');
      }
      A.bind(root, ['ad', 'an', 'ao', 'bn'], f4);

      function cmp() {
        var b = +$('#cb', root).value, d = +$('#cd', root).value;
        var a = Math.max(0, Math.min(b, parseInt($('#ca', root).value, 10) || 0)), c = Math.max(0, Math.min(d, parseInt($('#cc', root).value, 10) || 0));
        var L = lcm(b, d);
        $('#cfig', root).innerHTML = D.fbars([{ n: a, d: b }, { n: c, d: d, col: 'var(--hi)' }], { w: 480 });
        $('#cline', root).innerHTML = D.fline(1, L <= 24 ? L : 2, [{ v: a / b, label: a + '/' + b, col: 'var(--strand)' }, { v: c / d, label: c + '/' + d, up: false }], 'Number line from 0 to 1 with ' + a + '/' + b + ' and ' + c + '/' + d, 480);
        var x = a * L / b, y = c * L / d, sym = x > y ? '&gt;' : x < y ? '&lt;' : '=';
        $('#cout', root).innerHTML = '<p><span class="big">' + a + '/' + b + ' ' + sym + ' ' + c + '/' + d + '</span></p><p>' +
          (b === d ? 'Same size pieces, so compare the tops: ' + a + ' and ' + c + '.' : 'Cut both into ' + L + ' equal pieces: ' + a + '/' + b + ' = ' + x + '/' + L + ' and ' + c + '/' + d + ' = ' + y + '/' + L + '.') +
          (x === y ? ' They are the same size.' : ' The longer bar, and the point further right, is the greater fraction.') + '</p>' +
          '<p class="t2" style="font-size:.9rem">Tops can go up to the bottom number (one whole).</p>';
      }
      A.bind(root, ['ca', 'cb', 'cc', 'cd'], cmp);

      function f5() {
        var w = +$('#uw', root).value, d = +$('#ud', root).value, op = $('#uo', root).value, parts = [], i;
        $('#uwo', root).textContent = w;
        if (op === 'x') {
          for (i = 0; i < w; i++) parts.push('a');
          $('#ufig', root).innerHTML = A.svg(540, 48, wholes(parts, d, function () { return 'var(--strand)'; }, 540), w + ' pieces of size 1/' + d);
          $('#uout', root).innerHTML = '<p><span class="big">' + w + ' &times; 1/' + d + ' = ' + w + '/' + d + '</span></p><p>' + w + ' groups of one ' + (d === 2 ? 'half' : '1/' + d + ' piece') + ' is ' + w + ' pieces.' +
            (w >= d ? ' That is ' + mixed(w, d).replace(' ', '&nbsp;') + '.' : '') + '</p>';
        } else {
          var tot = w * d;
          for (i = 0; i < tot; i++) parts.push(i % 2 ? 'b' : 'a');
          $('#ufig', root).innerHTML = A.svg(540, 48, wholes(parts, d, function (t) { return t === 'b' ? 'var(--hi)' : 'var(--strand)'; }, 540), w + ' wholes, each cut into ' + d + ' pieces');
          $('#uout', root).innerHTML = '<p><span class="big">' + w + ' &divide; 1/' + d + ' = ' + tot + '</span></p><p>Each whole holds ' + d + ' pieces of size 1/' + d + '. ' + w + ' wholes hold ' + w + ' &times; ' + d + ' = ' + tot + ' pieces.</p>';
        }
      }
      A.bind(root, ['uw', 'uo', 'ud'], f5);
    },

    quiz: [
      { q: 'Which fraction is equivalent to 2/3?', type: 'mc', options: ['3/4', '4/6', '2/6', '5/6'], answer: 1, fig: D.fbars([{ n: 2, d: 3 }], { w: 400 }), hint: 'What could the 2 and the 3 both be multiplied by?', explain: 'Multiplying top and bottom by 2 gives 4/6.' },
      { q: 'Write 7/4 as a mixed number.', type: 'mc', options: ['1 1/4', '1 3/4', '2 1/4', '3 4/7'], answer: 1, fig: D.fbars([{ n: 7, d: 4, label: '7/4' }], { unit: 200, w: 560 }), hint: '7 &divide; 4 = 1 remainder 3.', explain: '7 &divide; 4 is 1 with 3 left over, so 1&nbsp;3/4.' },
      { q: 'Write 2&nbsp;1/3 as an improper fraction.', type: 'mc', options: ['3/7', '6/3', '7/3', '5/3'], answer: 2, hint: '2 wholes is 6 thirds.', explain: '2 &times; 3 + 1 = 7, so 7/3.' },
      { q: 'Which is greater, 5/8 or 3/4?', type: 'mc', options: ['5/8', '3/4', 'They are equal'], answer: 1, fig: D.fbars([{ n: 5, d: 8 }, { n: 3, d: 4, col: 'var(--hi)' }], { w: 440 }), hint: 'Write 3/4 in eighths.', explain: '3/4 = 6/8, and 6/8 is more than 5/8.' },
      { q: 'What is 3/8 + 4/8?', type: 'mc', options: ['7/16', '7/8', '1/8', '12/8'], answer: 1, fig: D.fbars([{ n: 7, d: 8, label: '?', cols: rep('var(--strand)', 3).concat(rep('var(--hi)', 4)) }], { w: 440 }), hint: 'The pieces are all eighths. Count the pieces.', explain: '3 eighths + 4 eighths = 7 eighths, or 7/8.' },
      { q: 'What is <span class="math">4 &times; 1/5</span>?', type: 'mc', options: ['4/5', '1/20', '20', '5/4'], answer: 0, hint: '4 groups of one fifth.', explain: '4 groups of 1/5 is 4 fifths, or 4/5.' },
      { q: 'A ribbon is 3 m long. How many pieces 1/2 m long can you cut from it?', type: 'num', answer: 6, unit: 'pieces', fig: D.fline(3, 2, [], 'A 3 metre ribbon drawn as a number line with a mark every half metre'), hint: 'How many halves are in one metre? Then in 3 metres?', explain: '3 &divide; 1/2 = 6, because each metre gives 2 halves.' }
    ],

    quick: ['fr-name', 'fr-equiv', 'fr-mixed', 'fr-compare', 'fr-add', 'fr-unit'],

    practice: [
      { id: 'fr-name', name: 'Name the fraction', code: 'B1.3', gen: function (lv) {
        var d, n, fig, q, ans, wrong, steps;
        if (lv < 3) {
          d = lv === 1 ? R.int(2, 10) : R.pick([3, 4, 5, 6, 8, 10, 12]); n = R.int(1, d - 1);
          fig = lv === 1 ? A.draw.bar(n, d, 400) : A.draw.pie(n, d, 60);
          q = 'What fraction of the ' + (lv === 1 ? 'bar' : 'circle') + ' is shaded?';
          ans = n + '/' + d;
          wrong = [(d - n) + '/' + d, n + '/' + (d - n), d + '/' + n, n + '/' + (d + 1)].filter(function (w) { var t = w.split('/'); return +t[1] > 0 && +t[0] * d !== n * +t[1]; });
          steps = ['Count all the equal parts: ' + d + '. That is the bottom number.', 'Count the shaded parts: ' + n + '. That is the top number.', 'The shaded fraction is ' + ans + '.'];
        } else {
          d = R.pick([2, 3, 4, 5, 6, 8]); n = R.int(1, 2 * d - 1); if (n === d) n++;
          fig = A.draw.fline(2, d, [{ v: n / d }], 'Number line from 0 to 2 with a point marked');
          q = 'What fraction does the yellow point show?';
          ans = n + '/' + d;
          wrong = [n + '/' + (2 * d), (n + 1) + '/' + d, (n - 1 || n + 2) + '/' + d, n + '/' + (d + 1)];
          steps = ['Look between 0 and 1. It is cut into ' + d + ' equal jumps, so each jump is 1/' + d + '.', 'Count the jumps from 0 to the point: ' + n + '.', 'The point is at ' + ans + (n > d ? ', which is ' + mixed(n, d) + '' : '') + '. Do not count all the jumps to 2.'];
        }
        var o = R.mc(ans, wrong);
        return { q: q, type: 'mc', options: o.options, answer: o.answer, fig: fig,
          hint: lv < 3 ? 'The bottom number is how many equal parts in all. The top is how many are shaded.' : 'How many jumps make one whole? Count jumps from 0.',
          steps: steps, explain: 'The answer is ' + ans + '.' };
      } },
      { id: 'fr-equiv', name: 'Equivalent fractions', code: 'B1.3', gen: function (lv) {
        var ds = [2, 3, 4, 5, 6], d = R.pick(ds), n = R.int(1, d - 1), k = lv === 1 ? 2 : R.int(2, lv === 2 ? 4 : 3);
        if (d * k > 12) k = 2;
        if (lv < 3) {
          var askTop = lv === 1 || R.int(0, 1);
          return { q: 'Fill in the missing number: <span class="math">' + n + '/' + d + ' = ' + (askTop ? '?' : n * k) + '/' + (askTop ? d * k : '?') + '</span>', type: 'num', answer: askTop ? n * k : d * k,
            fig: A.draw.bar(n, d, 360) + A.draw.bar(n * k, d * k, 360),
            hint: 'What was the ' + (askTop ? 'bottom' : 'top') + ' number multiplied by? Do the same to the other number.',
            steps: [(askTop ? d + ' became ' + d * k : n + ' became ' + n * k) + ', so it was multiplied by ' + k + '.', 'Multiply the other number by ' + k + ' too.', (askTop ? n + ' &times; ' + k + ' = ' + n * k : d + ' &times; ' + k + ' = ' + d * k) + '.'],
            explain: n + '/' + d + ' = ' + n * k + '/' + d * k + '. Both parts were multiplied by ' + k + '.' };
        }
        var N = n * k, D = d * k, g = A.gcd(n, d), sn = n / g, sd = d / g;
        var o = R.mc(sn + '/' + sd, [N / 2 + '/' + D, (sn + 1) + '/' + sd, sn + '/' + (sd + 1), (N - 1) + '/' + (D - 1)].filter(function (x) { return x.indexOf('.') < 0 && x !== sn + '/' + sd; }));
        return { q: 'Write <span class="math">' + N + '/' + D + '</span> in simplest form.', type: 'mc', options: o.options, answer: o.answer,
          fig: A.draw.fbars([{ n: N, d: D }, { n: sn, d: sd, label: '?', col: 'var(--hi)' }], { w: 440, mark: n / d }),
          hint: 'Find the biggest number that divides both ' + N + ' and ' + D + '.',
          steps: ['The biggest number that divides ' + N + ' and ' + D + ' is ' + A.gcd(N, D) + '.', N + ' &divide; ' + A.gcd(N, D) + ' = ' + sn + ' and ' + D + ' &divide; ' + A.gcd(N, D) + ' = ' + sd + '.', 'So ' + N + '/' + D + ' = ' + sn + '/' + sd + '.'],
          explain: N + '/' + D + ' = ' + sn + '/' + sd + '.' };
      } },
      { id: 'fr-mixed', name: 'Mixed numbers and improper fractions', code: 'B1.3', gen: function (lv) {
        var d = lv === 1 ? R.pick([2, 3, 4]) : R.pick([3, 4, 5, 6, 8]), w = R.int(1, lv === 3 ? 5 : 2), r = R.int(1, d - 1), N = w * d + r;
        var toMixed = lv === 1 ? true : R.int(0, 1) === 1;
        if (toMixed) {
          var o = R.mc(w + ' ' + r + '/' + d, [(w + 1) + ' ' + r + '/' + d, r + ' ' + w + '/' + d, w + ' ' + (d - r) + '/' + d, (w - 1 > 0 ? w - 1 : w + 2) + ' ' + r + '/' + d]);
          return { q: 'Write <span class="math">' + N + '/' + d + '</span> as a mixed number.', type: 'mc', options: o.options, answer: o.answer,
            fig: lv < 3 ? A.draw.fbars([{ n: N, d: d, label: N + '/' + d }], { unit: Math.min(200, 480 / (w + 1)), w: 560 }) : '',
            hint: 'How many groups of ' + d + ' fit in ' + N + '? What is left over?',
            steps: [N + ' &divide; ' + d + ' = ' + w + ' remainder ' + r + '.', 'The ' + w + ' is the number of wholes. The remainder ' + r + ' is the number of pieces left.', 'So ' + N + '/' + d + ' = ' + w + ' ' + r + '/' + d + '.'],
            explain: N + '/' + d + ' = ' + w + '&nbsp;' + r + '/' + d + '.' };
        }
        var o2 = R.mc(N + '/' + d, [(w + r) + '/' + d, (w * r + d) + '/' + d, (w * d) + '/' + d, (N + 1) + '/' + d]);
        return { q: 'Write <span class="math">' + w + '&nbsp;' + r + '/' + d + '</span> as an improper fraction.', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Each whole has ' + d + ' pieces. How many pieces are in ' + w + ' wholes?',
          fig: lv < 3 ? A.draw.fline(w + 1, d, [{ v: N / d, label: w + ' ' + r + '/' + d }]) : '',
          steps: [w + ' wholes = ' + w + ' &times; ' + d + ' = ' + w * d + ' pieces.', 'Add the ' + r + ' extra pieces: ' + w * d + ' + ' + r + ' = ' + N + '.', 'So ' + w + ' ' + r + '/' + d + ' = ' + N + '/' + d + '.'],
          explain: w + ' &times; ' + d + ' + ' + r + ' = ' + N + ', so ' + N + '/' + d + '.' };
      } },
      { id: 'fr-compare', name: 'Compare fractions', code: 'B1.4', gen: function (lv) {
        var a, b, c, d, why;
        if (lv === 1) { d = R.pick([5, 6, 8, 10, 12]); b = d; a = R.int(1, d - 1); c = R.int(1, d - 1); while (c === a) c = R.int(1, d - 1); why = 'The pieces are the same size, so more pieces is more.'; }
        else if (lv === 2) { a = c = R.int(1, 3); b = R.pick([4, 5, 6]); d = R.pick([8, 10, 12]); why = 'The tops are the same. Smaller pieces (bigger bottom) means less.'; }
        else { b = R.pick([2, 3, 4, 6]); d = b * 2; a = R.int(1, b - 1); c = R.int(1, d - 1); while (c === 2 * a) c = R.int(1, d - 1); why = 'Rewrite ' + a + '/' + b + ' as ' + (2 * a) + '/' + d + ' so both use the same size pieces.'; }
        var big = a / b > c / d ? a + '/' + b : c + '/' + d;
        var o = R.mc(big, [a / b > c / d ? c + '/' + d : a + '/' + b, 'They are equal']);
        return { q: 'Which is greater: <span class="math">' + a + '/' + b + '</span> or <span class="math">' + c + '/' + d + '</span>?', type: 'mc', options: o.options, answer: o.answer,
          fig: A.draw.fbars([{ n: a, d: b }, { n: c, d: d, col: 'var(--hi)' }], { w: 440 }) + (lv === 3 ? A.draw.fline(1, d, [{ v: a / b, label: a + '/' + b, col: 'var(--strand)' }, { v: c / d, label: c + '/' + d, up: false }], null, 440) : ''), hint: lv === 1 ? 'Compare the tops.' : lv === 2 ? 'Which has bigger pieces?' : 'Rewrite one fraction so the bottoms match.',
          steps: [why, 'Compare the shaded lengths in the bars.', big + ' is greater.'], explain: why + ' ' + big + ' is greater.' };
      } },
      { id: 'fr-add', name: 'Add and subtract like fractions', code: 'B2.5', gen: function (lv) {
        var d = R.pick([4, 5, 6, 8, 10, 12]), a, b, op = lv === 1 ? '+' : R.pick(['+', '-']);
        if (lv === 1) { a = R.int(1, d - 2); b = R.int(1, d - 1 - a); }
        else if (lv === 2) { a = R.int(2, d - 1); b = R.int(1, a - 1); if (op === '+') b = R.int(1, d - a); }
        else { a = R.int(d - 2, d + 4); b = R.int(2, d - 1); if (op === '-' && b >= a) a = b + R.int(1, 3); }
        var r = op === '+' ? a + b : a - b;
        var o = R.mc(r + '/' + d, [r + '/' + (2 * d), (op === '+' ? Math.abs(a - b) : a + b) + '/' + d, (r + 1) + '/' + d]);
        var ctx = lv === 3 && op === '+' ? 'Jo ran ' + a + '/' + d + ' km before lunch and ' + b + '/' + d + ' km after. How far did Jo run in all?' : 'What is <span class="math">' + a + '/' + d + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '/' + d + '</span>?';
        var cols = [], i;
        for (i = 0; i < (op === '+' ? a + b : a); i++) cols.push(op === '+' ? (i < a ? 'var(--strand)' : 'var(--hi)') : (i < a - b ? 'var(--strand)' : 'color-mix(in srgb,var(--bad) 30%,var(--card))'));
        return { q: ctx, type: 'mc', options: o.options, answer: o.answer,
          fig: lv < 3 ? A.draw.fbars([{ n: cols.length, d: d, label: op === '+' ? a + '/' + d + '+' + b + '/' + d : a + '/' + d, cols: cols }], { lw: 90, unit: cols.length > d ? 220 : 400, w: 560 }) + (op === '-' ? '<p class="t2" style="text-align:center;font-size:.9rem">The pale pieces are the ' + b + ' taken away.</p>' : '') : '',
          hint: 'The pieces are all 1/' + d + '. Count pieces and keep the bottom the same.',
          steps: ['Every piece is 1/' + d + '.', a + ' pieces ' + (op === '+' ? 'plus ' : 'take away ') + b + ' pieces = ' + r + ' pieces.', 'The answer is ' + r + '/' + d + (r > d ? ', which is ' + mixed(r, d) : '') + '.'],
          explain: a + '/' + d + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '/' + d + ' = ' + r + '/' + d + (r > d ? ' = ' + mixed(r, d) : '') + '. The denominator stays ' + d + '.' };
      } },
      { id: 'fr-unit', name: 'Multiply and divide by unit fractions', code: 'B2.8', gen: function (lv) {
        var w = R.int(2, 9), d = R.pick([2, 3, 4, 5, 6, 8]), mul = lv === 1 ? true : lv === 2 ? false : R.int(0, 1) === 1;
        if (mul) {
          var o = R.mc(w + '/' + d, ['1/' + (w * d), String(w * d), d + '/' + w]);
          return { q: lv === 3 ? 'Each muffin uses 1/' + d + ' cup of oats. How much oats do ' + w + ' muffins use?' : 'What is <span class="math">' + w + ' &times; 1/' + d + '</span>?', type: 'mc', options: o.options, answer: o.answer,
            fig: A.draw.wholes(w, d), hint: 'Think of ' + w + ' groups of one 1/' + d + ' piece.',
            steps: ['Each group is one piece of size 1/' + d + '.', w + ' groups make ' + w + ' pieces.', 'So the answer is ' + w + '/' + d + (lv === 3 ? ' cup' : '') + '.'],
            explain: w + ' &times; 1/' + d + ' = ' + w + '/' + d + '.' };
        }
        return { q: lv === 3 ? 'A pizza place cuts each pizza into pieces that are 1/' + d + ' of a pizza. How many pieces come from ' + w + ' pizzas?' : 'What is <span class="math">' + w + ' &divide; 1/' + d + '</span>?', type: 'num', answer: w * d,
          fig: A.draw.bar(d, d, 300, 'One whole cut into ' + d + ' pieces'), hint: 'How many 1/' + d + ' pieces fit in one whole? Then in ' + w + ' wholes?',
          steps: ['One whole holds ' + d + ' pieces of size 1/' + d + '.', w + ' wholes hold ' + w + ' &times; ' + d + ' pieces.', w + ' &times; ' + d + ' = ' + w * d + '.'],
          explain: w + ' &divide; 1/' + d + ' = ' + w * d + '.' };
      } }
    ]
  });
})();
