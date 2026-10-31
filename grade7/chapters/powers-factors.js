(function () {
  var A = Atlas, R = A.R, fmt = A.fmt;
  var ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  var PER = ['ones', 'thousands', 'millions', 'billions'], SCALE = ['', 'thousand', 'million', 'billion'];
  function b1000(n) {
    var s = '';
    if (n >= 100) { s += ones[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
    if (n >= 20) { s += tens[Math.floor(n / 10)]; if (n % 10) s += '-' + ones[n % 10]; }
    else if (n > 0) s += ones[n];
    return s;
  }
  function words(n) {
    if (n === 0) return 'zero';
    var parts = [];
    for (var k = 3; k >= 0; k--) {
      var g = Math.floor(n / Math.pow(1000, k)) % 1000;
      if (g) parts.push(b1000(g) + (k ? ' ' + SCALE[k] : ''));
    }
    return parts.join(' ');
  }
  function pw(b, e) { return b + '<sup>' + e + '</sup>'; }
  function gcd(a, b) { return A.gcd(a, b); }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function factors(n) { var f = []; for (var i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; }
  function primes(n) { var p = [], d = 2; while (n > 1) { while (n % d === 0) { p.push(d); n /= d; } d++; } return p; }
  /* expanded form with powers of ten: 3 &times; 10^8 + ... */
  function expPow(n) {
    var s = String(n), out = [];
    for (var i = 0; i < s.length; i++) {
      var d = +s.charAt(i), e = s.length - 1 - i;
      if (d) out.push(e === 0 ? String(d) : e === 1 ? d + ' &times; 10' : d + ' &times; ' + pw(10, e));
    }
    return out.join(' + ') || '0';
  }

  /* ---- drawings ---- */
  /* a thousand cube, a million cube, a billion cube */
  function billion() {
    var P = A.draw.prism, s = '', B = 214;
    s += '<defs><marker id="pfar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    function arrow(x1, x2, y) {
      return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#pfar)"/>' +
        '<text x="' + (x1 + x2) / 2 + '" y="' + (y - 8) + '" text-anchor="middle" font-size="17" class="tb">&times; 1000</text>';
    }
    function lab(x, a, b) {
      return '<text x="' + x + '" y="' + (B + 24) + '" text-anchor="middle" font-size="18" font-weight="700">' + a + '</text>' +
        '<text x="' + x + '" y="' + (B + 44) + '" text-anchor="middle" font-size="16" class="t2">' + b + '</text>';
    }
    s += P(18, B, 36, 36, 36, 10, 10, 10, 0) + lab(44, '1000', 'one thousand');
    s += arrow(74, 132, B - 60);
    s += P(140, B, 80, 80, 80, 10, 10, 10, 2) + lab(196, '1 000 000', 'one million');
    s += arrow(262, 318, B - 60);
    s += P(330, B, 150, 150, 150, 10, 10, 10, 3) + lab(410, '1 000 000 000', 'one billion');
    return A.svg(560, B + 52, s, 'A thousand cube. 1000 of them make a million cube. 1000 million cubes make a billion cube.');
  }
  /* a period chart: billions, millions, thousands, ones */
  function perChart(n) {
    var s = String(n), lead = 12 - s.length, h = '<div class="per">';
    while (s.length < 12) s = '0' + s;
    for (var k = 3; k >= 0; k--) {
      var i = (3 - k) * 3, g = +s.substr(i, 3), dig = '';
      for (var j = 0; j < 3; j++) dig += '<span' + (i + j < lead ? ' class="dim"' : '') + '>' + s.charAt(i + j) + '</span>';
      h += '<div><span class="ph" style="background:var(--p' + k + ')">' + PER[k] + '</span><span class="pd" style="color:var(--p' + k + ')">' + dig + '</span>' +
        '<span class="pw">' + (i + 3 <= lead ? '' : g ? b1000(g) + (k ? ' ' + SCALE[k] : '') : '(say nothing)') + '</span></div>';
    }
    return h + '</div>';
  }
  /* a square of side b, or a cube of side b */
  function sq(b, sz, col) {
    sz = sz || Math.min(22, 200 / b);
    var s = '';
    for (var r = 0; r < b; r++) for (var c = 0; c < b; c++)
      s += '<rect x="' + (2 + c * sz) + '" y="' + (2 + r * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:' + (col || 'var(--strand)') + ';stroke:var(--card)" stroke-width="1.5"/>';
    return A.svg(Math.ceil(b * sz + 4), Math.ceil(b * sz + 4), s, b + ' by ' + b + ' square of ' + b * b + ' tiles');
  }
  function cube(b, size) {
    size = size || 110;
    var k = 0.42, s = A.draw.prism(4, size + size * k + 4, size, size, size, b, b, b, 4);
    return A.svg(Math.ceil(size + size * k + 8), Math.ceil(size + size * k + 8), s, b + ' by ' + b + ' by ' + b + ' cube of ' + b * b * b + ' small cubes');
  }
  /* repeated multiplication as a chain of boxes */
  function chain(b, e) {
    if (e === 0) return A.svg(300, 60, '<rect x="110" y="8" width="80" height="40" style="fill:var(--card);stroke:var(--strand)" stroke-width="2.5"/><text x="150" y="34" text-anchor="middle" font-size="18" font-weight="700">1</text>', b + ' to the power 0 is 1');
    var w = Math.min(84, 520 / e - 10), s = '';
    for (var i = 1; i <= e; i++) {
      var x = 6 + (i - 1) * (w + 12), v = Math.pow(b, i);
      s += '<rect x="' + x + '" y="22" width="' + w + '" height="40" style="fill:color-mix(in srgb,var(--strand) ' + Math.round(10 + 60 * i / e) + '%,var(--card));stroke:var(--strand)" stroke-width="2"/>' +
        '<text x="' + (x + w / 2) + '" y="47" text-anchor="middle" font-size="' + (fmt(v).length > 7 ? 12 : 15) + '" font-weight="700">' + fmt(v) + '</text>' +
        '<text x="' + (x + w / 2) + '" y="84" text-anchor="middle" font-size="16" class="t2">' + b + '<tspan dy="-7" font-size="11">' + i + '</tspan></text>';
      if (i > 1) s += '<text x="' + (x - 6) + '" y="16" text-anchor="middle" font-size="12" style="fill:var(--se)" font-weight="700">&times;' + b + '</text>';
    }
    return A.svg(Math.ceil(12 + e * (w + 12)), 92, s, 'Powers of ' + b + ' from 1 to ' + e + ': ' + Array.apply(null, Array(e)).map(function (_, i) { return fmt(Math.pow(b, i + 1)); }).join(', '));
  }
  /* N tiles arranged as the biggest square, with leftovers in orange */
  function tiles(N) {
    var s0 = Math.floor(Math.sqrt(N) + 1e-9), left = N - s0 * s0, sz = Math.min(20, 230 / (s0 + 1)), s = '';
    for (var r = 0; r < s0; r++) for (var c = 0; c < s0; c++)
      s += '<rect x="' + (2 + c * sz) + '" y="' + (2 + r * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:var(--strand);stroke:var(--card)" stroke-width="1"/>';
    for (var i = 0; i < left; i++) {
      var x = i < s0 ? s0 : i - s0, y = i < s0 ? i : s0;
      s += '<rect x="' + (2 + x * sz) + '" y="' + (2 + y * sz) + '" width="' + sz + '" height="' + sz + '" style="fill:var(--se);stroke:var(--card)" stroke-width="1"/>';
    }
    var W = (s0 + 1) * sz + 4;
    return A.svg(Math.ceil(W), Math.ceil(W), s, N + ' tiles. ' + s0 * s0 + ' make a ' + s0 + ' by ' + s0 + ' square' + (left ? ', and ' + left + ' are left over.' : ' with none left over.'));
  }
  /* a factor rainbow: each factor joined to its partner */
  function rainbow(n) {
    var f = factors(n), W = Math.max(300, f.length * 46), gap = (W - 40) / (f.length - 1 || 1), s = '';
    for (var i = 0; i < Math.floor(f.length / 2); i++) {
      var x1 = 20 + i * gap, x2 = 20 + (f.length - 1 - i) * gap, r = (x2 - x1) / 2;
      s += '<path d="M' + x1 + ' 120 A' + r + ' ' + Math.min(r, 100) + ' 0 0 1 ' + x2 + ' 120" fill="none" style="stroke:var(--p' + (i % 5) + ')" stroke-width="3"/>';
    }
    f.forEach(function (v, i) {
      s += '<circle cx="' + (20 + i * gap) + '" cy="132" r="15" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/><text x="' + (20 + i * gap) + '" y="137" text-anchor="middle" font-size="13" font-weight="700">' + v + '</text>';
    });
    return A.svg(W, 152, s, 'Factor rainbow for ' + n + ': ' + f.join(', ') + '. Each arc joins two factors that multiply to ' + n + '.');
  }
  /* Venn diagram of prime factors */
  function venn(a, b) {
    var pa = primes(a), pb = primes(b), both = [], la = pa.slice(), lb = [];
    pb.forEach(function (p) { var k = la.indexOf(p); if (k >= 0) { both.push(p); la.splice(k, 1); } else lb.push(p); });
    function list(arr, x) {
      return arr.length ? arr.map(function (p, i) { return '<text x="' + x + '" y="' + (78 + (i - (arr.length - 1) / 2) * 22) + '" text-anchor="middle" font-size="17" font-weight="700">' + p + '</text>'; }).join('') : '<text x="' + x + '" y="84" text-anchor="middle" font-size="13" class="t2">none</text>';
    }
    var s = '<circle cx="160" cy="80" r="70" style="fill:color-mix(in srgb,var(--sb) 14%,transparent);stroke:var(--sb)" stroke-width="2"/>' +
      '<circle cx="260" cy="80" r="70" style="fill:color-mix(in srgb,var(--se) 14%,transparent);stroke:var(--se)" stroke-width="2"/>' +
      '<text x="110" y="172" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--sb)">' + a + '</text><text x="310" y="172" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--se)">' + b + '</text>' +
      list(la, 125) + list(both, 210) + list(lb, 295);
    return { svg: A.svg(420, 178, s, 'Prime factors of ' + a + ' and ' + b + '. Shared: ' + (both.join(', ') || 'none') + '.'), both: both, la: la, lb: lb };
  }
  /* hops along number lines for 2 or 3 numbers, up to their LCM */
  function hops(nums) {
    var L = nums.reduce(lcm), W = 540, x0 = 40, x1 = W - 16, s = '', cols = ['var(--sb)', 'var(--se)', 'var(--sd)'];
    var sc = function (v) { return x0 + (x1 - x0) * v / L; };
    nums.forEach(function (n, r) {
      var y = 40 + r * 52;
      s += '<text x="4" y="' + (y + 6) + '" font-size="17" font-weight="700" style="fill:' + cols[r] + '">' + n + 's</text>' +
        '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" style="stroke:var(--line)" stroke-width="2"/>';
      for (var v = n; v <= L; v += n) {
        if (L / n <= 30) s += '<path d="M' + sc(v - n) + ' ' + y + ' Q' + sc(v - n / 2) + ' ' + (y - 24) + ' ' + sc(v) + ' ' + y + '" fill="none" style="stroke:' + cols[r] + '" stroke-width="2"/>';
        s += '<circle cx="' + sc(v) + '" cy="' + y + '" r="3.5" style="fill:' + cols[r] + '"/>';
        if (L / n <= 12 && v < L) s += '<text x="' + sc(v) + '" y="' + (y + 20) + '" text-anchor="middle" font-size="15" class="t2">' + v + '</text>';
      }
    });
    var h = 40 + nums.length * 52;
    s += '<line x1="' + sc(L) + '" y1="14" x2="' + sc(L) + '" y2="' + (h - 18) + '" style="stroke:var(--se)" stroke-width="3" stroke-dasharray="6 4"/>' +
      '<text x="' + (sc(L) - 6) + '" y="' + (h - 2) + '" text-anchor="end" font-size="17" font-weight="700" style="fill:var(--se)">They first meet at ' + L + '</text>';
    return A.svg(W, h + 4, s, 'Jumps of ' + nums.join(', ') + ' along number lines. They first land on the same number at ' + L + '.');
  }
  /* a square root between two whole numbers on a number line */
  function rootLine(N) {
    var s0 = Math.floor(Math.sqrt(N) + 1e-9);
    return A.draw.line(s0 - 1 < 0 ? 0 : s0 - 1, s0 + 2, 1, Math.sqrt(N), 'Number line. The square root of ' + N + ' is about ' + (Math.round(Math.sqrt(N) * 10) / 10) + ', between ' + s0 + ' and ' + (s0 + 1) + '.');
  }

  A.register('powers-factors', {
    html:
'<section class="sec"><h2><span class="n">1</span>Numbers up to one billion</h2>' +
'<p>Big numbers are built in groups of three digits called <b>periods</b>: ones, thousands, millions and billions. Each period is <b>1000 times</b> the one before.</p>' +
'<div class="fig">' + billion() + '</div>' +
'<div class="facts">' +
'<div><b>about 41 million</b><small>people live in Canada</small></div>' +
'<div><b>1 billion seconds</b><small>is about 32 years</small></div>' +
'<div><b>1 billion mm</b><small>is 1000 km, about Toronto to Thunder Bay by air</small></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Read a big number one period at a time, from the left. Say the number in the period, then the period name. Never say "ones".</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p><span class="math">3 405 216 789</span> is read <i>three billion four hundred five million two hundred sixteen thousand seven hundred eighty-nine</i>.</p>' + perChart(3405216789) + '</div>' +
'<div class="lab"><span class="lt">Try it: read any number</span>' +
'<div class="ctrl"><label for="pfn">Type a number (0 to 999 999 999 999)<input type="text" inputmode="numeric" id="pfn" value="36 200 000"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-pf="41528680">Canada\'s population, 2025</button><button type="button" class="btn alt" data-pf="9984670">Area of Canada in km&sup2;</button><button type="button" class="btn alt" data-pf="1000000000">One billion</button></div>' +
'<div id="pfchart"></div><div class="out" id="pfout"></div></div>' +
A.yt({ q: 'What is the value of the digit 7 in <span class="math">2 704 315 000</span>?', type: 'mc', options: ['7 000 000', '70 000 000', '700 000 000', '7 000 000 000'], answer: 2,
  hint: 'The 7 is in the millions period. Is it the ones, tens or hundreds digit of that period?', explain: 'The 7 is the hundreds digit of the millions period, so it is worth 700 million: 700 000 000.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Powers and exponents</h2>' +
'<p>A <b>power</b> is a short way to write the same number multiplied again and again. In <span class="math">' + pw(5, 3) + '</span>, 5 is the <b>base</b> and 3 is the <b>exponent</b>. The exponent says how many 5s to multiply.</p>' +
'<p class="math" style="font-size:1.3rem;text-align:center">' + pw(5, 3) + ' = 5 &times; 5 &times; 5 = 125</p>' +
'<div class="vrow"><figure><figcaption>3<sup>2</sup> = 9 is a square, "3 squared"</figcaption>' + sq(3, 30) + '</figure><figure><figcaption>3<sup>3</sup> = 27 is a cube, "3 cubed"</figcaption>' + cube(3, 90) + '</figure></div>' +
'<div class="vs"><div><b class="t">This: 2<sup>3</sup></b><p>2 &times; 2 &times; 2 = <b>8</b></p><p>Three 2s multiplied.</p></div><div><b class="t">Not this: 2 &times; 3</b><p>2 + 2 + 2 = <b>6</b></p><p>Three 2s added.</p></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Do not multiply the base by the exponent. <span class="math">' + pw(4, 3) + '</span> is 4 &times; 4 &times; 4 = 64, not 4 &times; 3 = 12.</p></div>' +
'<div class="lab"><span class="lt">Try it: watch a power grow</span>' +
'<div class="ctrl"><label for="pwb">Base: <output id="pwbo"></output><input type="range" id="pwb" min="1" max="12" value="2"></label>' +
'<label for="pwe">Exponent: <output id="pweo"></output><input type="range" id="pwe" min="0" max="6" value="3"></label></div>' +
'<div class="out" id="pwout"></div><div class="fig" id="pwfig"></div><div class="fig" id="pwpic"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Any number to the power 1 is itself: ' + pw(7, 1) + ' = 7. Any number (except 0) to the power 0 is 1: ' + pw(7, 0) + ' = 1.</p></div>' +
A.yt({ q: 'Evaluate <span class="math">' + pw(2, 5) + '</span>.', answer: 32, hint: 'Multiply five 2s: 2 &times; 2 &times; 2 &times; 2 &times; 2.', explain: '2 &times; 2 = 4, &times; 2 = 8, &times; 2 = 16, &times; 2 = 32.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Powers of ten and expanded form</h2>' +
'<p>Powers of ten are easy to read: the exponent is the <b>number of zeros</b>.</p>' +
'<div class="tbl"><table><thead><tr><th>Power</th><th>Standard form</th><th class="l">Name</th></tr></thead><tbody>' +
[[0, 'one'], [1, 'ten'], [2, 'hundred'], [3, 'thousand'], [4, 'ten thousand'], [5, 'hundred thousand'], [6, 'million'], [7, 'ten million'], [8, 'hundred million'], [9, 'billion']].map(function (r) {
  return '<tr><td class="math">' + pw(10, r[0]) + '</td><td class="math">' + fmt(Math.pow(10, r[0])) + '</td><td class="l">' + r[1] + '</td></tr>';
}).join('') + '</tbody></table></div>' +
'<p>We can use powers of ten to write a number in <b>expanded form</b>. Each non-zero digit becomes <i>digit &times; a power of ten</i>.</p>' +
'<div class="eg"><b class="t">Worked example</b><p><span class="math">307 020 050</span> = 3 &times; ' + pw(10, 8) + ' + 7 &times; ' + pw(10, 6) + ' + 2 &times; ' + pw(10, 4) + ' + 5 &times; 10</p>' +
'<p>The zeros are skipped. A digit in the hundred millions place gets ' + pw(10, 8) + ', because 100 000 000 has 8 zeros.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Big numbers in the news are often written as a decimal and a word: <b>36.2 million</b> = 36 200 000. Move 36.2 six places for "million" (' + pw(10, 6) + ').</p></div>' +
A.yt({ q: 'Write <span class="math">4 &times; ' + pw(10, 7) + ' + 9 &times; ' + pw(10, 3) + ' + 6</span> in standard form.', answer: 40009006,
  hint: '4 &times; ' + pw(10, 7) + ' is 4 followed by 7 zeros. Line up the parts by place value.', explain: '40 000 000 + 9000 + 6 = 40 009 006.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Perfect squares and square roots</h2>' +
'<p>A <b>perfect square</b> is a number of tiles that can make a full square. 16 tiles make a 4 by 4 square, so 16 is a perfect square.</p>' +
'<div class="vrow">' + [1, 2, 3, 4, 5].map(function (b) { return '<figure><figcaption>' + b + ' &times; ' + b + ' = ' + b * b + '</figcaption>' + sq(b, 16) + '</figure>'; }).join('') + '</div>' +
'<p>The <b>square root</b> goes backwards: it is the side length of the square. <span class="math">&radic;16 = 4</span> because 4 &times; 4 = 16.</p>' +
'<div class="lab"><span class="lt">Try it: can these tiles make a square?</span>' +
'<div class="ctrl"><label for="sqn">Number of tiles: <output id="sqo"></output><input type="range" id="sqn" min="1" max="200" value="50"></label></div>' +
'<div class="row2"><div class="fig" id="sqfig"></div><div><div class="out" id="sqout"></div><div class="fig" id="sqline"></div></div></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>If a number is not a perfect square, its square root is between two whole numbers. 50 is between 49 (7 &times; 7) and 64 (8 &times; 8), so &radic;50 is between 7 and 8, a bit more than 7.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A square garden has an area of 81 m&sup2;. How long is each side?</p><p>Side = &radic;81 = 9 m, because 9 &times; 9 = 81.</p></div>' +
A.yt({ q: 'A square tile has an area of 144 cm&sup2;. How long is one side?', answer: 12, unit: 'cm', hint: 'Which number times itself is 144?', explain: '12 &times; 12 = 144, so the side is &radic;144 = 12 cm.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Factors and the greatest common factor</h2>' +
'<p>A <b>factor</b> divides a number with no remainder. Factors come in pairs that multiply to the number. A <b>factor rainbow</b> joins the pairs.</p>' +
'<div class="fig">' + rainbow(36) + '</div>' +
'<p>The <b>greatest common factor (GCF)</b> of two numbers is the biggest number that is a factor of both. Use it to split things into equal groups with nothing left over.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>GCF of 24 and 36.</p><p>Factors of 24: 1, 2, 3, 4, 6, 8, <b>12</b>, 24<br>Factors of 36: 1, 2, 3, 4, 6, 9, <b>12</b>, 18, 36</p><p>The biggest one in both lists is <b>12</b>. Or use prime factors: the shared primes are 2, 2 and 3, and 2 &times; 2 &times; 3 = 12.</p>' +
'<div class="fig">' + venn(24, 36).svg + '</div></div>' +
'<div class="lab"><span class="lt">Try it: find the GCF</span>' +
'<div class="ctrl"><label for="gca">First number (2 to 144)<input type="number" id="gca" min="2" max="144" value="48"></label><label for="gcb">Second number (2 to 144)<input type="number" id="gcb" min="2" max="144" value="60"></label></div>' +
'<div class="out" id="gcout"></div><div class="fig" id="gcfig"></div></div>' +
A.yt({ q: 'What is the GCF of 18 and 30?', answer: 6, hint: 'List the factors of 18: 1, 2, 3, 6, 9, 18. Which is the biggest that also divides 30?', explain: '6 divides both: 18 = 6 &times; 3 and 30 = 6 &times; 5. Nothing bigger does.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Multiples and the lowest common multiple</h2>' +
'<p>A <b>multiple</b> is what you land on when you skip count: the multiples of 4 are 4, 8, 12, 16, ... The <b>lowest common multiple (LCM)</b> is the first number two skip counts both land on.</p>' +
'<div class="fig">' + hops([4, 6]) + '</div>' +
'<div class="vs"><div><b class="t">GCF: split up</b><p>Biggest number that goes <b>into</b> both.</p><p>GCF of 4 and 6 is <b>2</b>. It is never bigger than the smaller number.</p></div><div><b class="t">LCM: line up</b><p>Smallest number both go <b>into</b>.</p><p>LCM of 4 and 6 is <b>12</b>. It is never smaller than the bigger number.</p></div></div>' +
'<div class="lab"><span class="lt">Try it: when do the jumps meet?</span>' +
'<div class="ctrl"><label for="lca">First: <output id="lcao"></output><input type="range" id="lca" min="2" max="15" value="6"></label><label for="lcb">Second: <output id="lcbo"></output><input type="range" id="lcb" min="2" max="15" value="8"></label>' +
'<label for="lcc">Third (0 = none): <output id="lcco"></output><input type="range" id="lcc" min="0" max="10" value="0"></label></div>' +
'<div class="out" id="lcout"></div><div class="fig" id="lcfig"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Hot dogs come in packs of 12. Buns come in packs of 8. What is the fewest of each you can buy to have the same number?</p>' +
'<p>Multiples of 12: 12, <b>24</b>, 36. Multiples of 8: 8, 16, <b>24</b>. The LCM is 24: 2 packs of hot dogs and 3 packs of buns.</p></div>' +
A.yt({ q: 'What is the LCM of 3, 4 and 6?', answer: 12, hint: 'Skip count by the biggest number, 6: 6, 12, ... Which one do 3 and 4 also go into?', explain: '6 does not divide by 4. 12 divides by 3, 4 and 6, so the LCM is 12.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      /* section 1 */
      function pf() {
        var n = parseInt(String($('#pfn', root).value).replace(/[^0-9]/g, ''), 10);
        if (isNaN(n)) n = 0;
        n = Math.min(999999999999, n);
        $('#pfchart', root).innerHTML = perChart(n);
        var about = n >= 1e9 ? (Math.round(n / 1e8) / 10) + ' billion' : n >= 1e6 ? (Math.round(n / 1e5) / 10) + ' million' : '';
        $('#pfout', root).innerHTML = '<p><b>Standard form:</b> <span class="math">' + fmt(n) + '</span></p><p><b>In words:</b> ' + words(n) + '</p>' +
          '<p><b>Expanded form:</b> <span class="math" style="white-space:normal">' + expPow(n) + '</span></p>' + (about ? '<p><b>Rounded for the news:</b> about ' + about + '</p>' : '');
      }
      $('#pfn', root).addEventListener('input', pf);
      A.$$('[data-pf]', root).forEach(function (b) { b.addEventListener('click', function () { $('#pfn', root).value = fmt(+b.getAttribute('data-pf')); pf(); }); });
      pf();
      /* section 2 */
      A.bind(root, ['pwb', 'pwe'], function () {
        var b = +$('#pwb', root).value, e = +$('#pwe', root).value, v = Math.pow(b, e);
        $('#pwbo', root).textContent = b; $('#pweo', root).textContent = e;
        var rep = e === 0 ? '1' : e === 1 ? String(b) : Array(e + 1).join(b + ' &times; ').slice(0, -9);
        $('#pwout', root).innerHTML = '<p class="big2 math">' + pw(b, e) + ' = ' + rep + ' = ' + fmt(v) + '</p>' +
          (e === 0 ? '<p>An exponent of 0 always gives 1.</p>' : '<p>' + e + ' factor' + (e > 1 ? 's' : '') + ' of ' + b + ' multiplied together.</p>');
        $('#pwfig', root).innerHTML = chain(b, e);
        $('#pwpic', root).innerHTML = e === 2 && b > 1 ? sq(b) : e === 3 && b > 1 ? cube(b) : '';
      });
      /* section 4 */
      A.bind(root, ['sqn'], function () {
        var N = +$('#sqn', root).value, s0 = Math.floor(Math.sqrt(N) + 1e-9), left = N - s0 * s0;
        $('#sqo', root).textContent = N;
        $('#sqfig', root).innerHTML = tiles(N);
        $('#sqout', root).innerHTML = left === 0
          ? '<p><b>' + N + ' is a perfect square.</b></p><p>' + s0 + ' &times; ' + s0 + ' = ' + N + ', so <span class="math">&radic;' + N + ' = ' + s0 + '</span>.</p>'
          : '<p><b>' + N + ' is not a perfect square.</b> ' + left + ' tile' + (left > 1 ? 's are' : ' is') + ' left over.</p><p>It is between ' + s0 * s0 + ' (' + s0 + ' &times; ' + s0 + ') and ' + (s0 + 1) * (s0 + 1) + ' (' + (s0 + 1) + ' &times; ' + (s0 + 1) + '), so &radic;' + N + ' is between ' + s0 + ' and ' + (s0 + 1) + '. It is about ' + (Math.round(Math.sqrt(N) * 10) / 10) + '.</p>';
        $('#sqline', root).innerHTML = rootLine(N);
      });
      /* section 5 */
      A.bind(root, ['gca', 'gcb'], function () {
        var a = Math.max(2, Math.min(144, parseInt($('#gca', root).value, 10) || 2)), b = Math.max(2, Math.min(144, parseInt($('#gcb', root).value, 10) || 2)), g = gcd(a, b);
        var fb = factors(b);
        function chips(n) {
          return factors(n).map(function (f) { var c = fb.indexOf(f) >= 0 && n % f === 0 && b % f === 0 && a % f === 0; return '<span class="pill" style="' + (f === g ? 'background:var(--se);color:#fff;border-color:var(--se)' : c ? '' : 'opacity:.55;border-style:dashed') + '">' + f + '</span>'; }).join(' ');
        }
        $('#gcout', root).innerHTML = '<p><b>Factors of ' + a + ':</b> ' + chips(a) + '</p><p><b>Factors of ' + b + ':</b> ' + chips(b) + '</p>' +
          '<p>Solid chips are common factors. <b>GCF = <span class="big2">' + g + '</span></b>' + (g === 1 ? ' (nothing bigger than 1 divides both)' : '') + '</p>';
        var v = venn(a, b);
        $('#gcfig', root).innerHTML = v.svg + '<p class="t2" style="text-align:center;margin:0">Shared prime factors: ' + (v.both.length ? v.both.join(' &times; ') + ' = ' + g : 'none, so the GCF is 1') + '</p>';
      });
      /* section 6 */
      A.bind(root, ['lca', 'lcb', 'lcc'], function () {
        var a = +$('#lca', root).value, b = +$('#lcb', root).value, c = +$('#lcc', root).value, nums = c ? [a, b, c] : [a, b];
        $('#lcao', root).textContent = a; $('#lcbo', root).textContent = b; $('#lcco', root).textContent = c || 'none';
        var L = nums.reduce(lcm);
        $('#lcout', root).innerHTML = '<p>LCM of ' + nums.join(', ') + ' = <span class="big2">' + L + '</span></p>';
        $('#lcfig', root).innerHTML = hops(nums);
      });
    },

    quiz: [
      { q: 'What is the value of the digit 4 in <span class="math">3 405 216 789</span>?', type: 'mc', options: ['4 000 000', '40 000 000', '400 000 000', '4 000 000 000'], answer: 2,
        hint: 'Which period is the 4 in? Is it the hundreds, tens or ones digit of that period?', explain: 'The 4 is the hundreds digit of the millions period: 400 million = 400 000 000.' },
      { q: 'Write <span class="math">2 &times; ' + pw(10, 8) + ' + 6 &times; ' + pw(10, 6) + ' + 3 &times; ' + pw(10, 3) + ' + 5</span> in standard form.', type: 'num', answer: 206003005,
        hint: '2 &times; ' + pw(10, 8) + ' is 2 followed by 8 zeros. Add the parts.', explain: '200 000 000 + 6 000 000 + 3000 + 5 = 206 003 005.' },
      { q: 'Evaluate <span class="math">' + pw(3, 4) + '</span>.', type: 'num', answer: 81, fig: chain(3, 4),
        hint: 'Multiply four 3s. It is not 3 &times; 4.', explain: '3 &times; 3 &times; 3 &times; 3 = 9 &times; 9 = 81.' },
      { q: 'Which number is a perfect square?', type: 'mc', options: ['48', '64', '80', '96'], answer: 1,
        hint: 'Which one is a whole number times itself? Try 7 &times; 7, 8 &times; 8, 9 &times; 9.', explain: '64 = 8 &times; 8. The others are not a whole number times itself.' },
      { q: 'What is <span class="math">&radic;121</span>?', type: 'num', answer: 11,
        hint: 'Which number times itself is 121?', explain: '11 &times; 11 = 121, so &radic;121 = 11.' },
      { q: 'What is the GCF of 36 and 60?', type: 'num', answer: 12,
        hint: 'List the factors of 36. Which is the biggest that also divides 60?', explain: '36 = 12 &times; 3 and 60 = 12 &times; 5. Shared prime factors: 2 &times; 2 &times; 3 = 12.' },
      { q: 'Bus A leaves every 8 minutes. Bus B leaves every 12 minutes. Both leave at 7:00. How many minutes until they next leave together?', type: 'num', answer: 24, unit: 'min',
        hint: 'You need a number both 8 and 12 go into. Is it the GCF or the LCM?', explain: 'Multiples of 8: 8, 16, 24. Multiples of 12: 12, 24. The LCM is 24 minutes, at 7:24.' }
    ],

    practice: [
      { id: 'pf-read', name: 'Read big numbers', code: 'B1.1', gen: function (lv) {
        if (lv === 3) {
          if (R.int(0, 1)) {
            var m = R.int(2, 90), d = R.int(1, 9), n = m * 1e6 + d * 1e5;
            return { q: 'A news story says <b>' + m + '.' + d + ' million</b>. Write it in standard form.', type: 'num', answer: n,
              hint: 'One million is 1 000 000. ' + m + '.' + d + ' million is ' + m + ' million and ' + d + ' tenths of a million.',
              steps: [m + ' million = ' + fmt(m * 1e6) + '.', d + ' tenths of a million = ' + d + ' &times; 100 000 = ' + fmt(d * 1e5) + '.', 'Add: ' + fmt(n) + '.'],
              explain: m + '.' + d + ' million = ' + m + '.' + d + ' &times; ' + pw(10, 6) + ' = ' + fmt(n) + '.' };
          }
          var n2 = R.int(1000, 9999) * 1e6 + R.int(0, 999999), mil = Math.floor(n2 / 1e6);
          return { q: 'How many <b>millions</b> are in <span class="math">' + fmt(n2) + '</span>, counting all of them?', type: 'num', answer: mil,
            hint: 'Cover the thousands and ones periods (the last 6 digits). Read what is left.',
            steps: ['The last six digits are the thousands and ones periods.', 'Cover them. What is left is ' + fmt(mil) + '.', 'So there are ' + fmt(mil) + ' millions.'],
            explain: fmt(n2) + ' has ' + fmt(mil) + ' millions and ' + fmt(n2 % 1e6) + ' left over.' };
        }
        var len = lv === 1 ? 7 : R.int(9, 10), s = String(R.int(1, 9));
        for (var i = 1; i < len; i++) s += R.int(0, 9);
        var at = R.int(0, len - 2);
        while (s.charAt(at) === '0') at = R.int(0, len - 2);
        var dg = +s.charAt(at), e = len - 1 - at, val = dg * Math.pow(10, e), n3 = +s;
        var o = R.mc(fmt(val), [e + 1, e - 1, e + 2, e - 2].filter(function (x) { return x >= 0 && x <= 10; }).map(function (x) { return fmt(dg * Math.pow(10, x)); }));
        var perIdx = Math.floor(e / 3), inPer = ['ones', 'tens', 'hundreds'][e % 3];
        var shown = '';
        for (var k = 0; k < len; k++) shown += (k && (len - k) % 3 === 0 ? ' ' : '') + (k === at ? '<u><b>' + dg + '</b></u>' : s.charAt(k));
        return { q: 'What is the value of the underlined digit in <span class="math">' + shown + '</span>?',
          type: 'mc', options: o.options, answer: o.answer, fig: perChart(n3),
          hint: 'Find the digit in the chart. Which period is it in, and is it the ones, tens or hundreds digit of that period?',
          steps: ['The ' + dg + ' is in the <b>' + PER[perIdx] + '</b> period.', 'It is the ' + inPer + ' digit of that period, so it means ' + dg + ' ' + inPer.replace(/s$/, '') + (dg > 1 ? 's' : '') + ' of ' + (perIdx ? SCALE[perIdx] + 's' : 'ones') + '.', 'Value: ' + fmt(val) + '.'],
          explain: 'The ' + dg + ' is worth ' + fmt(val) + ' (' + dg + ' &times; ' + pw(10, e) + ').' };
      } },
      { id: 'pf-expand', name: 'Powers of ten and expanded form', code: 'B1.1, B2.7', gen: function (lv) {
        if (lv === 1) {
          var k = R.int(2, 9);
          if (R.int(0, 1)) return { q: 'Write <span class="math">' + pw(10, k) + '</span> in standard form.', type: 'num', answer: Math.pow(10, k),
            hint: 'The exponent tells you how many zeros follow the 1.', steps: ['The exponent is ' + k + '.', 'Write 1 and then ' + k + ' zeros: ' + fmt(Math.pow(10, k)) + '.'], explain: pw(10, k) + ' = ' + fmt(Math.pow(10, k)) + '.' };
          return { q: 'Write <span class="math">' + fmt(Math.pow(10, k)) + '</span> as a power of ten. Type the exponent only: 10<sup>?</sup>', type: 'num', answer: k,
            hint: 'Count the zeros.', steps: ['Count the zeros in ' + fmt(Math.pow(10, k)) + ': there are ' + k + '.', 'So it is 10<sup>' + k + '</sup>.'], explain: fmt(Math.pow(10, k)) + ' has ' + k + ' zeros, so it is 10<sup>' + k + '</sup>.' };
        }
        var len = R.int(7, 9), es = R.shuffle(Array.apply(null, Array(len)).map(function (_, i) { return i; }).slice(1)).slice(0, R.int(2, 3));
        es.push(len - 1);
        es = es.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return b - a; });
        var n = 0, parts = es.map(function (e) { var d = R.int(1, 9); n += d * Math.pow(10, e); return { d: d, e: e }; });
        var txt = function (ps) { return ps.map(function (p) { return p.e === 0 ? p.d : p.e === 1 ? p.d + ' &times; 10' : p.d + ' &times; ' + pw(10, p.e); }).join(' + '); };
        if (lv === 2) return { q: 'Write in standard form: <span class="math">' + txt(parts) + '</span>', type: 'num', answer: n,
          hint: 'Each part is the digit followed by as many zeros as the exponent.',
          steps: parts.map(function (p) { return p.d + ' &times; ' + pw(10, p.e) + ' = ' + fmt(p.d * Math.pow(10, p.e)); }).concat(['Add the parts. Places with no part get a 0: ' + fmt(n) + '.']),
          explain: 'The parts add to ' + fmt(n) + '.' };
        var shift = function (d) { return parts.map(function (p) { return { d: p.d, e: p.e + d }; }); };
        var o = R.mc(txt(parts), [txt(shift(1)), txt(shift(-1).filter(function (p) { return p.e >= 0; })), txt(parts.map(function (p, i) { return i === parts.length - 1 && es.indexOf(p.e + 1) < 0 ? { d: p.d, e: p.e + 1 } : p; }))].filter(function (t) { return t !== txt(parts); }));
        return { q: 'Which is <span class="math">' + fmt(n) + '</span> in expanded form?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'For each non-zero digit, count how many places are to its right. That is the exponent.',
          steps: ['The first digit, ' + parts[0].d + ', has ' + parts[0].e + ' places to its right, so it is ' + parts[0].d + ' &times; ' + pw(10, parts[0].e) + '.', 'Do the same for each non-zero digit and skip the zeros.', 'Result: ' + txt(parts) + '.'],
          explain: fmt(n) + ' = ' + txt(parts) + '.' };
      } },
      { id: 'pf-power', name: 'Evaluate powers', code: 'B2.7', gen: function (lv) {
        if (lv === 3) {
          var t = R.int(0, 2);
          if (t === 0) {
            var b = R.pick([2, 3, 5, 10]), e = b === 2 ? R.int(4, 7) : R.int(2, 4), v = Math.pow(b, e);
            return { q: 'Find the missing exponent: <span class="math">' + b + '<sup>?</sup> = ' + fmt(v) + '</span>', type: 'num', answer: e,
              hint: 'Keep multiplying by ' + b + ' and count how many ' + b + 's you used.', fig: chain(b, e).replace(/<text[^>]*class="t2"[^>]*>[^<]*<\/text>/g, ''),
              steps: ['Start with ' + b + ' and multiply by ' + b + ' until you reach ' + fmt(v) + '.', Array.apply(null, Array(e)).map(function (_, i) { return fmt(Math.pow(b, i + 1)); }).join(', ') + '.', 'You used ' + e + ' factors of ' + b + ', so the exponent is ' + e + '.'],
              explain: b + '<sup>' + e + '</sup> = ' + fmt(v) + '.' };
          }
          if (t === 1) {
            var a = R.int(2, 5), c = R.int(2, 5);
            while (a === c || (a === 2 && c === 4) || (a === 4 && c === 2)) c = R.int(2, 5);
            var A1 = Math.pow(a, c), B1 = Math.pow(c, a);
            var o = R.mc(A1 > B1 ? a + '<sup>' + c + '</sup>' : c + '<sup>' + a + '</sup>', [A1 > B1 ? c + '<sup>' + a + '</sup>' : a + '<sup>' + c + '</sup>', 'They are equal']);
            return { q: 'Which is greater: <span class="math">' + pw(a, c) + '</span> or <span class="math">' + pw(c, a) + '</span>?', type: 'mc', options: o.options, answer: o.answer,
              hint: 'Work out each power. Do not just compare the digits.',
              steps: [pw(a, c) + ' = ' + fmt(A1) + '.', pw(c, a) + ' = ' + fmt(B1) + '.', fmt(Math.max(A1, B1)) + ' is greater.'],
              explain: pw(a, c) + ' = ' + fmt(A1) + ' and ' + pw(c, a) + ' = ' + fmt(B1) + '.' };
          }
          var bb = R.int(2, 9), ee = R.int(3, 6), rep = Array(ee + 1).join(bb + ' &times; ').slice(0, -9);
          var o2 = R.mc(pw(bb, ee), [pw(ee, bb), bb + ' &times; ' + ee, pw(bb, ee + 1)]);
          return { q: 'Write as a power: <span class="math">' + rep + '</span>', type: 'mc', options: o2.options, answer: o2.answer,
            hint: 'The number being multiplied is the base. Count how many times it appears.',
            steps: ['The number multiplied is ' + bb + ', so the base is ' + bb + '.', 'It appears ' + ee + ' times, so the exponent is ' + ee + '.', 'Answer: ' + pw(bb, ee) + '.'],
            explain: ee + ' factors of ' + bb + ' is ' + pw(bb, ee) + '.' };
        }
        var b2 = lv === 1 ? R.int(2, 10) : R.int(2, 6), e2 = lv === 1 ? R.int(2, 3) : R.int(3, 5);
        if (lv === 2 && b2 >= 5) e2 = R.int(3, 4);
        var v2 = Math.pow(b2, e2), rep2 = Array(e2 + 1).join(b2 + ' &times; ').slice(0, -9);
        return { q: 'Evaluate <span class="math">' + pw(b2, e2) + '</span>.', type: 'num', answer: v2,
          fig: lv === 1 ? (e2 === 2 ? sq(b2) : cube(b2, 90)) : '',
          hint: 'Multiply ' + e2 + ' factors of ' + b2 + '. It is not ' + b2 + ' &times; ' + e2 + '.',
          steps: [pw(b2, e2) + ' = ' + rep2 + '.', 'Multiply from left to right: ' + Array.apply(null, Array(e2)).map(function (_, i) { return fmt(Math.pow(b2, i + 1)); }).join(', then ') + '.', 'Answer: ' + fmt(v2) + '.'],
          explain: rep2 + ' = ' + fmt(v2) + '.' };
      } },
      { id: 'pf-root', name: 'Perfect squares and square roots', code: 'B1.2', gen: function (lv) {
        if (lv === 1) {
          var s = R.int(2, 12);
          return { q: 'What is <span class="math">&radic;' + s * s + '</span>?', type: 'num', answer: s, fig: sq(s, Math.min(16, 180 / s)),
            hint: 'The square root is the side of a square with ' + s * s + ' tiles.',
            steps: ['Find a number that times itself makes ' + s * s + '.', s + ' &times; ' + s + ' = ' + s * s + '.', 'So &radic;' + s * s + ' = ' + s + '.'], explain: s + ' &times; ' + s + ' = ' + s * s + '.' };
        }
        if (lv === 2) {
          if (R.int(0, 1)) {
            var k = R.int(4, 15), sqv = k * k, wr = [sqv - 1, sqv + 2, sqv + k, sqv - k + 1, k * 2].filter(function (x) { return Math.sqrt(x) % 1 !== 0; });
            var o = R.mc(sqv, R.shuffle(wr).slice(0, 3));
            return { q: 'Which number is a perfect square?', type: 'mc', options: o.options, answer: o.answer,
              hint: 'A perfect square is a whole number times itself. Think of 4 &times; 4 up to 15 &times; 15.',
              steps: ['Check each number: is it a whole number times itself?', k + ' &times; ' + k + ' = ' + sqv + '.', 'So ' + sqv + ' is the perfect square.'], explain: sqv + ' = ' + k + ' &times; ' + k + '.' };
          }
          var side = R.int(3, 15);
          return { q: 'A square has an area of ' + side * side + ' cm&sup2;. How long is each side?', type: 'num', answer: side, unit: 'cm',
            hint: 'Area of a square = side &times; side. Which number times itself is ' + side * side + '?',
            steps: ['Side &times; side = ' + side * side + '.', side + ' &times; ' + side + ' = ' + side * side + '.', 'Each side is ' + side + ' cm.'], explain: '&radic;' + side * side + ' = ' + side + ', so each side is ' + side + ' cm.' };
        }
        var N = R.int(10, 220);
        while (Math.sqrt(N) % 1 === 0) N = R.int(10, 220);
        var s0 = Math.floor(Math.sqrt(N));
        var o3 = R.mc(s0 + ' and ' + (s0 + 1), [(s0 - 1) + ' and ' + s0, (s0 + 1) + ' and ' + (s0 + 2), Math.floor(N / 2) + ' and ' + (Math.floor(N / 2) + 1)]);
        return { q: '<span class="math">&radic;' + N + '</span> is between which two whole numbers?', type: 'mc', options: o3.options, answer: o3.answer,
          hint: 'Find the perfect squares just below and just above ' + N + '.',
          steps: ['Perfect square just below ' + N + ': ' + s0 + ' &times; ' + s0 + ' = ' + s0 * s0 + '.', 'Perfect square just above: ' + (s0 + 1) + ' &times; ' + (s0 + 1) + ' = ' + (s0 + 1) * (s0 + 1) + '.', 'So &radic;' + N + ' is between ' + s0 + ' and ' + (s0 + 1) + '.<div class="fig">' + rootLine(N) + '</div>'],
          explain: s0 * s0 + ' &lt; ' + N + ' &lt; ' + (s0 + 1) * (s0 + 1) + ', so &radic;' + N + ' is between ' + s0 + ' and ' + (s0 + 1) + '.' };
      } },
      { id: 'pf-gcf', name: 'Greatest common factor', code: 'B2.6', gen: function (lv) {
        var g = lv === 1 ? R.int(2, 6) : R.int(2, 12), m, n, lim = lv === 1 ? 40 : 144;
        do { m = R.int(1, 12); n = R.int(2, 12); } while (m === n || gcd(m, n) !== 1 || g * m > lim || g * n > lim);
        var a = g * m, b = g * n, G = gcd(a, b);
        var steps = ['Factors of ' + a + ': ' + factors(a).join(', ') + '.', 'Factors of ' + b + ': ' + factors(b).join(', ') + '.', 'The biggest number in both lists is ' + G + '.'];
        if (lv === 3) {
          var things = R.pick([['pencils', 'erasers', 'kits'], ['apples', 'granola bars', 'snack bags'], ['red beads', 'blue beads', 'bracelets'], ['boys', 'girls', 'teams']]);
          return { q: 'There are ' + a + ' ' + things[0] + ' and ' + b + ' ' + things[1] + '. They are shared into identical ' + things[2] + ' with nothing left over. What is the greatest number of ' + things[2] + ' you can make?', type: 'num', answer: G,
            hint: 'The number of ' + things[2] + ' must divide both ' + a + ' and ' + b + '. You want the greatest such number.',
            steps: ['The number of ' + things[2] + ' must be a factor of both ' + a + ' and ' + b + ', so this is a GCF question.'].concat(steps),
            explain: 'GCF(' + a + ', ' + b + ') = ' + G + '. Each of the ' + G + ' ' + things[2] + ' gets ' + a / G + ' ' + things[0] + ' and ' + b / G + ' ' + things[1] + '.' };
        }
        return { q: 'What is the GCF of ' + a + ' and ' + b + '?', type: 'num', answer: G, fig: lv === 1 ? '' : '',
          hint: 'List the factors of the smaller number, ' + Math.min(a, b) + '. Start with the biggest and check if it divides ' + Math.max(a, b) + '.',
          steps: steps, explain: a + ' = ' + G + ' &times; ' + a / G + ' and ' + b + ' = ' + G + ' &times; ' + b / G + '. Nothing bigger divides both.' };
      } },
      { id: 'pf-lcm', name: 'Lowest common multiple', code: 'B2.6', gen: function (lv) {
        var nums;
        if (lv === 1) { do { nums = [R.int(2, 10), R.int(2, 10)]; } while (nums[0] === nums[1]); }
        else if (lv === 2) {
          if (R.int(0, 1)) { do { nums = [R.int(4, 15), R.int(4, 15)]; } while (nums[0] === nums[1] || lcm(nums[0], nums[1]) > 120); }
          else { do { nums = [R.int(2, 6), R.int(2, 6), R.int(2, 8)]; } while (nums[0] === nums[1] || nums[1] === nums[2] || nums[0] === nums[2]); }
        } else { do { nums = [R.int(4, 15), R.int(4, 15)]; } while (nums[0] === nums[1] || lcm(nums[0], nums[1]) > 120); }
        var L = nums.reduce(lcm), big = Math.max.apply(null, nums), list = [];
        for (var v = big; v <= L; v += big) list.push(v);
        var steps = ['Skip count by the biggest number, ' + big + ': ' + list.join(', ') + '.', 'Stop at the first one that ' + nums.filter(function (x) { return x !== big; }).join(' and ') + ' also divide' + (nums.length > 2 ? '' : 's') + ' into.', 'That number is ' + L + '.'];
        if (lv === 3) {
          var ctx = R.pick([['Hot dogs come in packs of ' + nums[0] + ' and buns in packs of ' + nums[1] + '. What is the smallest number of hot dogs you can buy to have exactly the same number of buns?', ''],
            ['One light flashes every ' + nums[0] + ' seconds and another every ' + nums[1] + ' seconds. They flash together now. In how many seconds will they next flash together?', 's'],
            ['Cups come in stacks of ' + nums[0] + ' and plates in stacks of ' + nums[1] + '. What is the fewest of each you can buy to have the same number?', '']]);
          return { q: ctx[0], type: 'num', answer: L, unit: ctx[1], fig: hops(nums),
            hint: 'You need a number that both ' + nums[0] + ' and ' + nums[1] + ' go into. Is that the GCF or the LCM?',
            steps: ['Both amounts must reach the same number, so this is an LCM question.'].concat(steps),
            explain: 'LCM(' + nums.join(', ') + ') = ' + L + '.' };
        }
        return { q: 'What is the LCM of ' + nums.join(nums.length > 2 ? ', ' : ' and ').replace(/, (\d+)$/, ' and $1') + '?', type: 'num', answer: L, fig: lv === 1 ? hops(nums) : '',
          hint: 'Skip count by ' + big + '. Stop at the first number the other' + (nums.length > 2 ? 's' : '') + ' also go' + (nums.length > 2 ? '' : 'es') + ' into.', steps: steps,
          explain: L + ' is the first number that ' + nums.join(', ') + ' all divide into.' };
      } }
    ]
  });
})();
