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

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7, $ = A.$;
  function num(host) { return parseInt(String(K.v(host, 'pfn') || '').replace(/[^0-9]/g, ''), 10) || 0; }
  var W = {
    read: { html: '<div class="ctrl"><label for="pfn">Type a number (0 to 999 999 999 999)<input type="text" inputmode="numeric" id="pfn" value="36 200 000"></label></div>' +
      '<div class="btnrow"><button type="button" class="btn alt" data-pf="41528680">Canada\'s population, 2025</button><button type="button" class="btn alt" data-pf="9984670">Area of Canada in km&sup2;</button><button type="button" class="btn alt" data-pf="1000000000">One billion</button></div>' +
      '<div id="pfchart"></div><div class="out" id="pfout"></div>',
      init: function (root) {
        function pf() {
          var n = Math.min(999999999999, num(root));
          $('#pfchart', root).innerHTML = perChart(n);
          var about = n >= 1e9 ? (Math.round(n / 1e8) / 10) + ' billion' : n >= 1e6 ? (Math.round(n / 1e5) / 10) + ' million' : '';
          $('#pfout', root).innerHTML = '<p><b>Standard form:</b> <span class="math">' + fmt(n) + '</span></p><p><b>In words:</b> ' + words(n) + '</p>' +
            '<p><b>Expanded form:</b> <span class="math" style="white-space:normal">' + expPow(n) + '</span></p>' + (about ? '<p><b>Rounded for the news:</b> about ' + about + '</p>' : '');
        }
        $('#pfn', root).addEventListener('input', pf);
        A.$$('[data-pf]', root).forEach(function (b) { b.addEventListener('click', function () { $('#pfn', root).value = fmt(+b.getAttribute('data-pf')); pf(); }); });
        pf();
      } },
    power: { html: '<div class="ctrl"><label for="pwb">Base: <output id="pwbo"></output><input type="range" id="pwb" min="1" max="12" value="2"></label>' +
      '<label for="pwe">Exponent: <output id="pweo"></output><input type="range" id="pwe" min="0" max="6" value="3"></label></div>' +
      '<div class="out" id="pwout"></div><div class="fig" id="pwfig"></div><div class="fig" id="pwpic"></div>',
      init: function (root) {
        A.bind(root, ['pwb', 'pwe'], function () {
          var b = +$('#pwb', root).value, e = +$('#pwe', root).value, v = Math.pow(b, e);
          $('#pwbo', root).textContent = b; $('#pweo', root).textContent = e;
          var rep = e === 0 ? '1' : e === 1 ? String(b) : Array(e + 1).join(b + ' &times; ').slice(0, -9);
          $('#pwout', root).innerHTML = '<p class="big2 math">' + pw(b, e) + ' = ' + rep + ' = ' + fmt(v) + '</p>' +
            (e === 0 ? '<p>An exponent of 0 always gives 1.</p>' : '<p>' + e + ' factor' + (e > 1 ? 's' : '') + ' of ' + b + ' multiplied together.</p>');
          $('#pwfig', root).innerHTML = chain(b, e);
          $('#pwpic', root).innerHTML = e === 2 && b > 1 ? sq(b) : e === 3 && b > 1 ? cube(b) : '';
        });
      } },
    squares: { html: '<div class="ctrl"><label for="sqn">Number of tiles: <output id="sqo"></output><input type="range" id="sqn" min="1" max="200" value="50"></label></div>' +
      '<div class="row2"><div class="fig" id="sqfig"></div><div><div class="out" id="sqout"></div><div class="fig" id="sqline"></div></div></div>',
      init: function (root) {
        A.bind(root, ['sqn'], function () {
          var N = +$('#sqn', root).value, s0 = Math.floor(Math.sqrt(N) + 1e-9), left = N - s0 * s0;
          $('#sqo', root).textContent = N;
          $('#sqfig', root).innerHTML = tiles(N);
          $('#sqout', root).innerHTML = left === 0
            ? '<p><b>' + N + ' is a perfect square.</b></p><p>' + s0 + ' &times; ' + s0 + ' = ' + N + ', so <span class="math">&radic;' + N + ' = ' + s0 + '</span>.</p>'
            : '<p><b>' + N + ' is not a perfect square.</b> ' + left + ' tile' + (left > 1 ? 's are' : ' is') + ' left over.</p><p>It is between ' + s0 * s0 + ' (' + s0 + ' &times; ' + s0 + ') and ' + (s0 + 1) * (s0 + 1) + ' (' + (s0 + 1) + ' &times; ' + (s0 + 1) + '), so &radic;' + N + ' is between ' + s0 + ' and ' + (s0 + 1) + '. It is about ' + (Math.round(Math.sqrt(N) * 10) / 10) + '.</p>';
          $('#sqline', root).innerHTML = rootLine(N);
        });
      } },
    gcf: { html: '<div class="ctrl"><label for="gca">First number (2 to 144)<input type="number" id="gca" min="2" max="144" value="48"></label><label for="gcb">Second number (2 to 144)<input type="number" id="gcb" min="2" max="144" value="60"></label></div>' +
      '<div class="out" id="gcout"></div><div class="fig" id="gcfig"></div>',
      init: function (root) {
        A.bind(root, ['gca', 'gcb'], function () {
          var a = Math.max(2, Math.min(144, parseInt($('#gca', root).value, 10) || 2)), b = Math.max(2, Math.min(144, parseInt($('#gcb', root).value, 10) || 2)), g = gcd(a, b);
          function chips(n) {
            return factors(n).map(function (f) { var c = a % f === 0 && b % f === 0; return '<span class="pill' + (f === g ? ' k7-hit' : '') + '" style="' + (c ? '' : 'opacity:.5;border-style:dashed') + '">' + f + '</span>'; }).join(' ');
          }
          $('#gcout', root).innerHTML = '<p><b>Factors of ' + a + ':</b> ' + chips(a) + '</p><p><b>Factors of ' + b + ':</b> ' + chips(b) + '</p>' +
            '<p>Solid chips are common factors. <b>GCF = <span class="big2">' + g + '</span></b>' + (g === 1 ? ' (nothing bigger than 1 divides both)' : '') + '</p>';
          var v = venn(a, b);
          $('#gcfig', root).innerHTML = v.svg + '<p class="t2" style="text-align:center;margin:0">Shared prime factors: ' + (v.both.length ? v.both.join(' &times; ') + ' = ' + g : 'none, so the GCF is 1') + '</p>';
        });
      } },
    lcm: { html: '<div class="ctrl"><label for="lca">First: <output id="lcao"></output><input type="range" id="lca" min="2" max="15" value="6"></label><label for="lcb">Second: <output id="lcbo"></output><input type="range" id="lcb" min="2" max="15" value="8"></label>' +
      '<label for="lcc">Third (0 = none): <output id="lcco"></output><input type="range" id="lcc" min="0" max="10" value="0"></label></div>' +
      '<div class="out" id="lcout"></div><div class="fig" id="lcfig"></div>',
      init: function (root) {
        A.bind(root, ['lca', 'lcb', 'lcc'], function () {
          var a = +$('#lca', root).value, b = +$('#lcb', root).value, c = +$('#lcc', root).value, nums = c ? [a, b, c] : [a, b];
          $('#lcao', root).textContent = a; $('#lcbo', root).textContent = b; $('#lcco', root).textContent = c || 'none';
          $('#lcout', root).innerHTML = '<p>LCM of ' + nums.join(', ') + ' = <span class="big2">' + nums.reduce(lcm) + '</span></p>';
          $('#lcfig', root).innerHTML = hops(nums);
        });
      } }
  };
  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }

  var LESSONS = [
    { id: 'big', title: 'Numbers to one billion', sub: 'Read and write very large numbers.', concepts: [
      { id: 'periods', title: 'Big numbers come in periods', exp: ['B1.1'], skill: 'pf-read',
        body: '<p>Big numbers are built in groups of three digits called <b>periods</b>: ones, thousands, millions and billions. Each period is <b>1000 times</b> the one before.</p>',
        watch: K.slides([
          { say: 'Start with a thousand small cubes in one big cube.', fig: billion },
          { say: 'Every number is split into periods of three digits, starting from the right.', fig: function () { return perChart(3405216789); } },
          { say: 'The <b>ones</b> period: 789.', fig: function () { return perChart(789); } },
          { say: 'The <b>thousands</b> period: 216 thousand.', fig: function () { return perChart(216789); } },
          { say: 'The <b>millions</b> period: 405 million.', fig: function () { return perChart(405216789); } },
          { say: 'The <b>billions</b> period: 3 billion. Each period is 1000 times bigger than the one to its right.', fig: function () { return perChart(3405216789); }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will read 2 718 054 306.', fig: function () { return perChart(2718054306); } },
          { say: 'First I split it into periods of three digits, starting from the right: 2 | 718 | 054 | 306.', fig: function () { return perChart(2718054306); } },
          { say: 'I start at the left. The billions period says 2: <b>two billion</b>.', fig: function () { return perChart(2718054306); } },
          { say: 'Next, the millions period: <b>seven hundred eighteen million</b>.', fig: function () { return perChart(2718054306); } },
          { say: 'Then the thousands: <b>fifty-four thousand</b>. Last, the ones: <b>three hundred six</b>.', fig: function () { return perChart(2718054306); } },
          { say: 'So it is two billion seven hundred eighteen million fifty-four thousand three hundred six. I read one period at a time, from the left.', fig: function () { return perChart(2718054306); }, ms: 2600 }
        ]),
        try: lab('read', [
          { do: 'Press <b>One billion</b>. How many periods does it fill?', goal: function (h) { return num(h) === 1e9; }, yes: 'One billion fills four periods: 1 000 000 000.' },
          { do: 'Type a number in the <b>millions</b>, like your city\'s population.', goal: function (h) { var n = num(h); return n >= 1e6 && n < 1e9; }, yes: function (h) { return 'Yes. ' + fmt(num(h)) + ' has a millions period.'; } },
          { do: 'Type any number of <b>one billion or more</b>.', goal: function (h) { return num(h) >= 1e9; }, yes: 'Yes. Now the billions period is full too.' }
        ]),
        key: '<p>Read a big number <b>one period at a time, from the left</b>. Say the number in the period, then the period name.</p>',
        mistake: '<p>Saying "ones" at the end, or reading digit by digit. The ones period has no name when you read it: 3 405 216 789 ends "...seven hundred eighty-nine".</p>',
        check: [function () { return mc('What is the value of the digit 7 in <span class="math">2 704 315 000</span>?', '700 000 000', ['7 000 000', '70 000 000', '7 000 000 000'], 'The 7 is in the millions period. Is it the ones, tens or hundreds digit of that period?', 'The 7 is the hundreds digit of the millions period: 700 000 000.'); }, K.ck('pf-read', 1), K.ck('pf-read', 2)] },
      { id: 'news', title: 'Big numbers in the news', exp: ['B1.1'], skill: 'pf-read',
        body: '<p>News stories often write big numbers as a <b>decimal and a word</b>: "36.2 million people". It is short and easy to read.</p>',
        watch: K.slides([
          { say: '36.2 million means 36 millions and 2 tenths of a million.', fig: eq('36.2 million') },
          { say: 'One million is 1 000 000. A tenth of a million is 100 000.', fig: eq('1 million = 1 000 000 &nbsp;&nbsp; 0.1 million = 100 000') },
          { say: '36 million is 36 000 000. 0.2 million is 200 000.', fig: eq('36 000 000 + 200 000') },
          { say: 'Together: <b>36 200 000</b>.', fig: function () { return perChart(36200000); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. A city has 4.7 million people. I will write that as a number.', fig: eq('4.7 million') },
          { say: 'One million is 1 000 000. So 4 million is 4 000 000.', fig: eq('4 million = 4 000 000') },
          { say: 'Next I do the 0.7. Seven tenths of a million is 700 000.', fig: eq('0.7 million = 700 000') },
          { say: 'I add the two parts: 4 000 000 + 700 000 = <b>4 700 000</b>.', fig: function () { return perChart(4700000); } },
          { say: 'I check with the rule: 4.7 &times; 1 000 000. I move the point 6 places right and get 4 700 000.', fig: eq('4.7 &times; 1 000 000 = 4 700 000'), ms: 2400 }
        ]),
        ways: [{ label: 'Move the decimal point', html: '<p>"Million" means &times; 1 000 000, which moves the decimal point <b>6 places right</b>.</p>' + eq('36.2 &rarr; 36.200000 &rarr; 36 200 000') },
          { label: 'Think of money', html: '<p>$2.5 million is two and a half million dollars: $2 000 000 plus half a million, $500 000. That is $2 500 000.</p>' }],
        hard: true,
        key: '<p><b>36.2 million = 36 200 000.</b> Multiply by 1 000 000: move the point 6 places right.</p>',
        mistake: '<p>Writing 36.2 million as 36 000 002 or 362 000 000. Ask: what is 0.2 of a million? (200 000)</p>',
        check: [K.ck('pf-read', 3), function () { var m = R.int(2, 40), d = R.int(1, 9); return { q: 'Write <b>' + m + '.' + d + ' million</b> in standard form.', type: 'num', answer: m * 1e6 + d * 1e5, hint: 'One tenth of a million is 100 000.', explain: m + ' 000 000 + ' + d + '00 000 = ' + fmt(m * 1e6 + d * 1e5) + '.' }; }] }
    ] },
    { id: 'powers', title: 'Powers', sub: 'A short way to write repeated multiplication.', concepts: [
      { id: 'base', title: 'Base and exponent', exp: ['B2.7'], skill: 'pf-power',
        body: '<p>A <b>power</b> is a number multiplied by itself again and again. In ' + pw(5, 3) + ', 5 is the <b>base</b> and 3 is the <b>exponent</b>. The exponent says how many 5s to multiply.</p>',
        watch: K.slides([
          { say: 'Here is the power 5 to the 3. The big 5 is the base. The small 3 is the exponent.', fig: eq('<span style="font-size:2.4rem">' + pw(5, 3) + '</span>') },
          { say: 'The exponent 3 means: write the base 3 times, with times signs.', fig: eq(pw(5, 3) + ' = 5 &times; 5 &times; 5') },
          { say: '5 times 5 is 25.', fig: eq(pw(5, 3) + ' = 25 &times; 5') },
          { say: '25 times 5 is 125. So 5 to the 3 is <b>125</b>.', fig: eq(pw(5, 3) + ' = <b>125</b>') },
          { say: 'Each step multiplies by the base again.', fig: function () { return chain(5, 3); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will work out ' + pw(3, 4) + '. The base is 3. The exponent is 4.', fig: eq('<span style="font-size:2.4rem">' + pw(3, 4) + '</span>') },
          { say: 'The exponent is 4, so I write the base 4 times, with times signs.', fig: eq(pw(3, 4) + ' = 3 &times; 3 &times; 3 &times; 3') },
          { say: 'First I do 3 &times; 3 = 9.', fig: eq(pw(3, 4) + ' = 9 &times; 3 &times; 3') },
          { say: 'Next I do 9 &times; 3 = 27.', fig: eq(pw(3, 4) + ' = 27 &times; 3') },
          { say: 'Last, 27 &times; 3 = 81. So ' + pw(3, 4) + ' = <b>81</b>. The exponent counts how many times the base is multiplied.', fig: function () { return chain(3, 4); }, ms: 2600 }
        ]),
        try: lab('power', [
          { do: 'Make <b>2<sup>5</sup></b>. What does it equal?', goal: function (h) { return K.v(h, 'pwb') === 2 && K.v(h, 'pwe') === 5; }, yes: '2 &times; 2 &times; 2 &times; 2 &times; 2 = 32.' },
          { do: 'Find a power that equals <b>81</b>.', goal: function (h) { return Math.pow(K.v(h, 'pwb'), K.v(h, 'pwe')) === 81; }, yes: function (h) { return 'Yes. ' + K.v(h, 'pwb') + ' to the ' + K.v(h, 'pwe') + ' is 81. (Both 3<sup>4</sup> and 9<sup>2</sup> work.)'; } },
          { do: 'Find a power bigger than <b>100 000</b>.', goal: function (h) { return Math.pow(K.v(h, 'pwb'), K.v(h, 'pwe')) > 100000; }, yes: 'Powers grow very fast.' }
        ]),
        key: '<p><b>The exponent counts how many times the base is multiplied.</b> ' + pw(5, 3) + ' = 5 &times; 5 &times; 5 = 125.</p>',
        mistake: '<p>Multiplying the base by the exponent: ' + pw(4, 3) + ' = 12. Have the student write the base out 3 times first: 4 &times; 4 &times; 4 = 64.</p>',
        check: [function () { return { q: 'Evaluate <span class="math">' + pw(2, 5) + '</span>.', type: 'num', answer: 32, hint: 'Multiply five 2s.', explain: '2 &times; 2 = 4, 8, 16, 32.' }; }, K.ck('pf-power', 1), K.ck('pf-power', 2)] },
      { id: 'notthis', title: 'Powers are not multiplication', exp: ['B2.7'], skill: 'pf-power', hard: true,
        body: '<p>' + pw(2, 3) + ' and 2 &times; 3 look alike but are different. One multiplies 2s. The other adds 2s.</p><div class="vs"><div><b class="t">This: 2<sup>3</sup></b><p>2 &times; 2 &times; 2 = <b>8</b></p><p>Three 2s multiplied.</p></div><div><b class="t">Not this: 2 &times; 3</b><p>2 + 2 + 2 = <b>6</b></p><p>Three 2s added.</p></div></div>',
        watch: K.slides([
          { say: '2 times 3 means three 2s <b>added</b>: 6.', fig: eq('2 &times; 3 = 2 + 2 + 2 = 6') },
          { say: '2 to the 3 means three 2s <b>multiplied</b>: 8.', fig: eq(pw(2, 3) + ' = 2 &times; 2 &times; 2 = 8') },
          { say: 'With bigger numbers the difference is huge. 10 times 4 is 40.', fig: eq('10 &times; 4 = 40') },
          { say: 'But 10 to the 4 is 10 000.', fig: eq(pw(10, 4) + ' = 10 &times; 10 &times; 10 &times; 10 = 10 000'), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. Is ' + pw(4, 3) + ' the same as 4 &times; 3? I will work out both.', fig: eq(pw(4, 3) + ' &nbsp; or &nbsp; 4 &times; 3') },
          { say: '4 &times; 3 means three 4s <b>added</b>: 4 + 4 + 4 = 12.', fig: eq('4 &times; 3 = 4 + 4 + 4 = 12') },
          { say: pw(4, 3) + ' means three 4s <b>multiplied</b>. First I do 4 &times; 4 = 16.', fig: eq(pw(4, 3) + ' = 4 &times; 4 &times; 4 = 16 &times; 4') },
          { say: 'Then 16 &times; 4 = 64. So ' + pw(4, 3) + ' = <b>64</b>, not 12.', fig: function () { return chain(4, 3); } },
          { say: 'Power: I multiply the base again and again. I never do base &times; exponent.', fig: eq(pw(4, 3) + ' = 64 &nbsp;&nbsp; 4 &times; 3 = 12'), ms: 2400 }
        ]),
        ways: [{ label: 'As a picture', html: '<p>' + pw(3, 2) + ' is a 3 by 3 square of tiles: 9. And ' + pw(3, 3) + ' is a 3 by 3 by 3 cube: 27.</p><div class="vrow"><figure><figcaption>3<sup>2</sup> = 9</figcaption>' + sq(3, 30) + '</figure><figure><figcaption>3<sup>3</sup> = 27</figcaption>' + cube(3, 90) + '</figure></div>' },
          { label: 'Powers of 1 and 0', html: '<p>Any number to the power 1 is itself: ' + pw(7, 1) + ' = 7. Any number (except 0) to the power 0 is 1: ' + pw(7, 0) + ' = 1. Look at the pattern: ' + pw(2, 3) + ' = 8, ' + pw(2, 2) + ' = 4, ' + pw(2, 1) + ' = 2, ' + pw(2, 0) + ' = 1. Each step down halves.</p>' }],
        key: '<p><b>Power: multiply the base again and again.</b> Not base &times; exponent.</p>',
        mistake: '<p>Answering 4<sup>2</sup> = 8 or 5<sup>3</sup> = 15. Ask the student to say it aloud: "four times four".</p>',
        check: [function () { var b = R.int(3, 6), e = R.pick([2, 3]); return mc('Which is equal to <span class="math">' + pw(b, e) + '</span>?', fmt(Math.pow(b, e)), [String(b * e), String(b + e), fmt(Math.pow(e, b))], 'Write the base out ' + e + ' times and multiply.', pw(b, e) + ' = ' + Array(e + 1).join(b + ' &times; ').slice(0, -9) + ' = ' + Math.pow(b, e) + '.'); }, K.ck('pf-power', 3)] }
    ] },
    { id: 'tens', title: 'Powers of ten', sub: 'The exponent counts the zeros.', concepts: [
      { id: 'zeros', title: 'The exponent counts the zeros', exp: ['B1.1', 'B2.7'], skill: 'pf-expand',
        body: '<p>Powers of ten are easy to read. ' + pw(10, 6) + ' is 1 followed by <b>6 zeros</b>: 1 000 000, one million.</p>',
        watch: K.slides([
          { say: '10 to the 1 is 10. One zero.', fig: eq(pw(10, 1) + ' = 10') },
          { say: '10 to the 2 is 10 times 10: 100. Two zeros.', fig: eq(pw(10, 2) + ' = 10 &times; 10 = 100') },
          { say: '10 to the 3 is 1000. Three zeros.', fig: eq(pw(10, 3) + ' = 1000') },
          { say: '10 to the 6 is one million. Six zeros.', fig: eq(pw(10, 6) + ' = 1 000 000') },
          { say: '10 to the 9 is one billion. Nine zeros.', fig: eq(pw(10, 9) + ' = 1 000 000 000'), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will write ' + pw(10, 5) + ' as a normal number.', fig: eq(pw(10, 5) + ' = ?') },
          { say: pw(10, 5) + ' is five 10s multiplied. Each 10 adds one more zero.', fig: eq(pw(10, 5) + ' = 10 &times; 10 &times; 10 &times; 10 &times; 10') },
          { say: 'The exponent is 5, so I write 1, then 5 zeros: <b>100 000</b>.', fig: eq(pw(10, 5) + ' = 100 000') },
          { say: 'I check: I count the zeros in 100 000. There are 5, the same as the exponent.', fig: function () { return chain(10, 5); }, ms: 2400 }
        ]),
        try: lab('power', [{ do: 'Set the base to <b>10</b>. Make one million.', goal: function (h) { return K.v(h, 'pwb') === 10 && K.v(h, 'pwe') === 6; }, yes: pw(10, 6) + ' = 1 000 000: six zeros.' }]),
        key: '<p><b>' + pw(10, 'n') + ' is 1 followed by n zeros.</b></p>',
        mistake: '<p>Counting the digits instead of the zeros: 1000 has 4 digits but only 3 zeros, so it is ' + pw(10, 3) + '.</p>',
        check: [K.ck('pf-expand', 1), function () { var k = R.int(4, 9); return { q: 'How many zeros does <span class="math">' + pw(10, k) + '</span> have in standard form?', type: 'num', answer: k, hint: 'The exponent counts the zeros.', explain: pw(10, k) + ' = ' + fmt(Math.pow(10, k)) + ': ' + k + ' zeros.' }; }] },
      { id: 'expanded', title: 'Expanded form with powers of ten', exp: ['B1.1'], skill: 'pf-expand', hard: true,
        body: '<p>In <b>expanded form</b>, each non-zero digit is written as <i>digit &times; a power of ten</i>. Zeros are skipped.</p>',
        watch: K.slides([
          { say: 'Take 307 020 050.', fig: function () { return perChart(307020050); } },
          { say: 'The 3 has 8 places after it. It is 3 times 10 to the 8.', fig: eq('3 &times; ' + pw(10, 8)) },
          { say: 'The 7 has 6 places after it: 7 times 10 to the 6.', fig: eq('3 &times; ' + pw(10, 8) + ' + 7 &times; ' + pw(10, 6)) },
          { say: 'Then 2 times 10 to the 4, and 5 times 10.', fig: eq('3 &times; ' + pw(10, 8) + ' + 7 &times; ' + pw(10, 6) + ' + 2 &times; ' + pw(10, 4) + ' + 5 &times; 10') },
          { say: 'The zeros are skipped. Each part matches one non-zero digit.', fig: function () { return perChart(307020050); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will write 50 400 900 in expanded form with powers of ten.', fig: function () { return perChart(50400900); } },
          { say: 'The 5 has 7 places after it. So it is 5 &times; ' + pw(10, 7) + '.', fig: eq('5 &times; ' + pw(10, 7)) },
          { say: 'The 4 has 5 places after it: 4 &times; ' + pw(10, 5) + '.', fig: eq('5 &times; ' + pw(10, 7) + ' + 4 &times; ' + pw(10, 5)) },
          { say: 'The 9 has 2 places after it: 9 &times; ' + pw(10, 2) + '. I skip all the zeros.', fig: eq('5 &times; ' + pw(10, 7) + ' + 4 &times; ' + pw(10, 5) + ' + 9 &times; ' + pw(10, 2)) },
          { say: 'Done. Each exponent is the number of places to the right of its digit.', fig: eq('50 400 900 = 5 &times; ' + pw(10, 7) + ' + 4 &times; ' + pw(10, 5) + ' + 9 &times; ' + pw(10, 2)), ms: 2600 }
        ]),
        try: lab('read', [{ do: 'Type <b>4 000 900 006</b>. Look at its expanded form.', goal: function (h) { return num(h) === 4000900006; }, yes: '4 &times; 10<sup>9</sup> + 9 &times; 10<sup>5</sup> + 6.' },
          { do: 'Type a number whose expanded form has exactly <b>two parts</b>.', goal: function (h) { var n = String(num(h)); return n !== '0' && n.replace(/0/g, '').length === 2; }, yes: 'Two non-zero digits make two parts.' }]),
        ways: [{ label: 'Count places to the right', html: '<p>For each digit, count how many digits come <b>after</b> it. That count is the exponent. In 5<u>0</u>400, the 5 has 4 digits after it, so it is 5 &times; 10<sup>4</sup>.</p>' },
          { label: 'Line up the parts', html: '<p>Write each part in standard form and stack them:</p><p class="math">300 000 000<br>&nbsp;&nbsp;&nbsp;7 000 000<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 000<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50</p><p>Add: 307 020 050.</p>' }],
        key: '<p><b>Exponent = number of places to the right of the digit.</b></p>',
        mistake: '<p>Using the place number counted from 1: writing the 3 in 307 020 050 as 3 &times; 10<sup>9</sup>. The ones place is 10<sup>0</sup>, not 10<sup>1</sup>.</p>',
        check: [function () { return { q: 'Write <span class="math">4 &times; ' + pw(10, 7) + ' + 9 &times; ' + pw(10, 3) + ' + 6</span> in standard form.', type: 'num', answer: 40009006, hint: 'Line the parts up by place value.', explain: '40 000 000 + 9000 + 6 = 40 009 006.' }; }, K.ck('pf-expand', 2), K.ck('pf-expand', 3)] }
    ] },
    { id: 'squares', title: 'Squares and square roots', sub: 'Tiles that make a square, and the side of that square.', concepts: [
      { id: 'perfect', title: 'Perfect squares', exp: ['B1.2'], skill: 'pf-root',
        body: '<p>A <b>perfect square</b> is a number of tiles that make a full square. 16 tiles make a 4 by 4 square, so 16 is a perfect square: 4 &times; 4 = 4<sup>2</sup> = 16.</p>',
        watch: K.slides([1, 2, 3, 4, 5].map(function (b) { return { say: b + ' by ' + b + ' makes ' + b * b + '.', fig: '<div class="vrow"><figure><figcaption>' + b + ' &times; ' + b + ' = ' + b * b + '</figcaption>' + sq(b, 30) + '</figure></div>', ms: 1300 }; })
          .concat([{ say: 'The perfect squares: 1, 4, 9, 16, 25, ... The gaps between them grow by 2 each time.', fig: eq('1, 4, 9, 16, 25, 36, 49, 64, 81, 100'), ms: 2600 }])),
        example: K.slides([
          { say: 'My turn. Is 49 a perfect square? I try to build a square with 49 tiles.', fig: eq('49 tiles') },
          { say: 'I try 6 by 6. That is 36 tiles. Too small.', fig: '<div class="vrow"><figure><figcaption>6 &times; 6 = 36</figcaption>' + sq(6, 26) + '</figure></div>' },
          { say: 'I try 7 by 7. That is 49 tiles. It uses them all.', fig: '<div class="vrow"><figure><figcaption>7 &times; 7 = 49</figcaption>' + sq(7, 26) + '</figure></div>' },
          { say: 'So <b>49 is a perfect square</b>. A perfect square is a whole number times itself: 7 &times; 7.', fig: eq('7 &times; 7 = 49'), ms: 2400 }
        ]),
        try: lab('squares', [
          { do: 'Find a perfect square <b>between 50 and 70</b>.', goal: function (h) { return K.v(h, 'sqn') === 64; }, yes: '64 = 8 &times; 8.' },
          { do: 'Find the biggest perfect square on the slider.', goal: function (h) { return K.v(h, 'sqn') === 196; }, yes: '196 = 14 &times; 14. (225 is past the end.)' }
        ]),
        key: '<p><b>A perfect square is a whole number times itself.</b></p>',
        mistake: '<p>Thinking 2 &times; 8 = 16 is why 16 is square. It is square because 4 &times; 4 = 16: the two sides must be equal.</p>',
        check: [K.ck('pf-root', 2), function () { return mc('Which number is a perfect square?', '64', ['48', '80', '96'], 'Try 7 &times; 7, 8 &times; 8, 9 &times; 9.', '64 = 8 &times; 8.'); }] },
      { id: 'root', title: 'Square roots', exp: ['B1.2'], skill: 'pf-root',
        body: '<p>The <b>square root</b> goes backwards. It is the side length of the square. <span class="math">&radic;16 = 4</span> because 4 &times; 4 = 16.</p>',
        watch: K.slides([
          { say: 'A square garden has an area of 81 square metres. How long is each side?', fig: '<div class="vrow"><figure><figcaption>Area 81 m&sup2;</figcaption>' + sq(9, 22) + '</figure></div>' },
          { say: 'We need a number that times itself makes 81.', fig: eq('? &times; ? = 81') },
          { say: '9 times 9 is 81. So the side is 9 metres.', fig: eq('9 &times; 9 = 81 &nbsp;&nbsp; &radic;81 = 9'), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. A square patio has an area of 144 square metres. I will find the length of each side.', fig: '<div class="vrow"><figure><figcaption>Area 144 m&sup2;</figcaption>' + sq(12, 16) + '</figure></div>' },
          { say: 'I need a number that times itself makes 144.', fig: eq('? &times; ? = 144') },
          { say: 'I try 10. 10 &times; 10 = 100. That is too small.', fig: eq('10 &times; 10 = 100 &nbsp; too small') },
          { say: 'I try 12. 12 &times; 12 = 144. Yes!', fig: eq('12 &times; 12 = 144') },
          { say: 'So &radic;144 = <b>12</b>. Each side is 12 metres.', fig: eq('&radic;144 = 12'), ms: 2400 }
        ]),
        key: '<p><b>&radic;n is the side of a square with area n.</b> &radic;81 = 9 because 9 &times; 9 = 81.</p>',
        mistake: '<p>Halving instead of rooting: &radic;16 = 8. Check by multiplying back: 8 &times; 8 = 64, not 16.</p>',
        check: [function () { return { q: 'A square tile has an area of 144 cm&sup2;. How long is one side?', type: 'num', answer: 12, unit: 'cm', hint: 'Which number times itself is 144?', explain: '12 &times; 12 = 144.' }; }, K.ck('pf-root', 1)] },
      { id: 'between', title: 'Roots between whole numbers', exp: ['B1.2'], skill: 'pf-root', hard: true,
        body: '<p>Most numbers are not perfect squares. Their square roots fall <b>between</b> two whole numbers. 50 is between 49 and 64, so &radic;50 is between 7 and 8.</p>',
        watch: K.slides([
          { say: 'Try to make a square with 50 tiles.', fig: function () { return tiles(50); } },
          { say: 'A 7 by 7 square uses 49. One tile is left over.', fig: function () { return tiles(50); } },
          { say: 'On a number line, 50 sits just past 49.', fig: function () { return rootLine(50); } },
          { say: 'So &radic;50 is between 7 and 8, very close to 7: about 7.1.', fig: eq('7 &times; 7 = 49 &lt; 50 &lt; 64 = 8 &times; 8'), ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find where &radic;30 is.', fig: eq('&radic;30 = ?') },
          { say: 'First I find the perfect squares on each side of 30: 5 &times; 5 = 25 and 6 &times; 6 = 36.', fig: eq('25 &lt; 30 &lt; 36') },
          { say: 'I build 30 tiles. A 5 by 5 square uses 25. 5 tiles are left over.', fig: function () { return tiles(30); } },
          { say: 'So &radic;30 is between <b>5 and 6</b>. 30 is about halfway from 25 to 36, so &radic;30 is about 5.5.', fig: function () { return rootLine(30); }, ms: 2600 }
        ]),
        try: lab('squares', [{ do: 'Set the slider to <b>30</b>. Between which two whole numbers is &radic;30?', goal: function (h) { return K.v(h, 'sqn') === 30; }, yes: '25 &lt; 30 &lt; 36, so &radic;30 is between 5 and 6.' }]),
        ways: [{ label: 'Squeeze it', html: '<p>List the squares until you pass the number: 1, 4, 9, 16, 25, <b>36</b>. 30 is between 25 and 36, so &radic;30 is between &radic;25 = 5 and &radic;36 = 6.</p>' },
          { label: 'Which is closer?', html: '<p>30 is 5 away from 25 and 6 away from 36, so &radic;30 is a bit closer to 5. It is about 5.5.</p>' }],
        key: '<p><b>Find the perfect squares on each side.</b> Their roots are the two whole numbers.</p>',
        mistake: '<p>Answering with the squares (25 and 36) instead of their roots (5 and 6).</p>',
        check: [K.ck('pf-root', 3)] }
    ] },
    { id: 'gcf', title: 'Factors and the GCF', sub: 'The biggest number that divides two numbers.', concepts: [
      { id: 'pairs', title: 'Factor pairs', exp: ['B2.6'], skill: 'pf-gcf',
        body: '<p>A <b>factor</b> divides a number with no remainder. Factors come in <b>pairs</b> that multiply to the number. A factor rainbow joins the pairs.</p>',
        watch: K.slides([
          { say: 'Factors of 36. Start with 1 times 36.', fig: eq('1 &times; 36') },
          { say: 'Then 2 times 18, 3 times 12, 4 times 9.', fig: eq('1 &times; 36 &nbsp; 2 &times; 18 &nbsp; 3 &times; 12 &nbsp; 4 &times; 9') },
          { say: '6 times 6 meets in the middle. Stop there.', fig: eq('1 &times; 36 &nbsp; 2 &times; 18 &nbsp; 3 &times; 12 &nbsp; 4 &times; 9 &nbsp; 6 &times; 6') },
          { say: 'The rainbow joins each pair.', fig: function () { return rainbow(36); }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find the factor pairs of 48. I start with 1 &times; 48.', fig: eq('1 &times; 48') },
          { say: 'I test 2, 3 and 4. They all go in: 2 &times; 24, 3 &times; 16, 4 &times; 12.', fig: eq('1 &times; 48 &nbsp; 2 &times; 24 &nbsp; 3 &times; 16 &nbsp; 4 &times; 12') },
          { say: '5 does not go into 48. 6 does: 6 &times; 8.', fig: eq('1 &times; 48 &nbsp; 2 &times; 24 &nbsp; 3 &times; 16 &nbsp; 4 &times; 12 &nbsp; 6 &times; 8') },
          { say: '7 does not go in. 8 is already in a pair, so I stop.', fig: eq('1 &times; 48 &nbsp; 2 &times; 24 &nbsp; 3 &times; 16 &nbsp; 4 &times; 12 &nbsp; 6 &times; 8') },
          { say: 'The factors of 48 are 1, 2, 3, 4, 6, 8, 12, 16, 24 and 48. Factors come in pairs.', fig: function () { return rainbow(48); }, ms: 2600 }
        ]),
        key: '<p><b>Factors come in pairs.</b> Test 1, 2, 3, ... until the pairs meet.</p>',
        mistake: '<p>Stopping too early and missing a pair, such as 4 &times; 9 for 36. The rainbow shows a gap when a pair is missing.</p>',
        check: [function () { var n = R.pick([24, 30, 36, 40, 48]), f = factors(n), bad = R.pick([5, 7, 9, 11].filter(function (x) { return n % x; })); return mc('Which is <b>not</b> a factor of ' + n + '?', String(bad), R.shuffle(f.filter(function (x) { return x > 1 && x < n; })).slice(0, 3).map(String), 'Does it divide ' + n + ' with no remainder?', n + ' &divide; ' + bad + ' has a remainder. Factors of ' + n + ': ' + f.join(', ') + '.'); }] },
      { id: 'gcf', title: 'The greatest common factor', exp: ['B2.6'], skill: 'pf-gcf',
        body: '<p>The <b>greatest common factor (GCF)</b> is the biggest number that divides <b>both</b> numbers. Use it to split things into equal groups with nothing left over.</p>',
        watch: K.slides([
          { say: 'GCF of 24 and 36. List the factors of 24.', fig: eq('24: 1, 2, 3, 4, 6, 8, 12, 24') },
          { say: 'List the factors of 36.', fig: eq('24: 1, 2, 3, 4, 6, 8, 12, 24<br>36: 1, 2, 3, 4, 6, 9, 12, 18, 36') },
          { say: 'The biggest number in both lists is <b>12</b>.', fig: eq('24: 1, 2, 3, 4, 6, 8, <b>12</b>, 24<br>36: 1, 2, 3, 4, 6, 9, <b>12</b>, 18, 36'), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find the GCF of 18 and 30. First I list the factors of 18.', fig: eq('18: 1, 2, 3, 6, 9, 18') },
          { say: 'Next I list the factors of 30.', fig: eq('18: 1, 2, 3, 6, 9, 18<br>30: 1, 2, 3, 5, 6, 10, 15, 30') },
          { say: 'I look for numbers in both lists: 1, 2, 3 and 6.', fig: eq('18: <b>1, 2, 3, 6</b>, 9, 18<br>30: <b>1, 2, 3</b>, 5, <b>6</b>, 10, 15, 30') },
          { say: 'The biggest one is <b>6</b>. So the GCF of 18 and 30 is 6.', fig: eq('GCF of 18 and 30 = 6'), ms: 2400 }
        ]),
        try: lab('gcf', [
          { do: 'Find two numbers with a GCF of <b>12</b>.', goal: function (h) { return gcd(+K.v(h, 'gca'), +K.v(h, 'gcb')) === 12; }, yes: 'Both are multiples of 12, and nothing bigger divides both.' },
          { do: 'Find two numbers with a GCF of <b>1</b>.', goal: function (h) { return gcd(+K.v(h, 'gca'), +K.v(h, 'gcb')) === 1; }, yes: 'They share no prime factor.' }
        ]),
        key: '<p><b>GCF: the biggest number that goes into both.</b></p>',
        mistake: '<p>Giving any common factor, like 6 for 24 and 36. Ask: is there a bigger one in both lists?</p>',
        check: [function () { return { q: 'What is the GCF of 18 and 30?', type: 'num', answer: 6, hint: 'Factors of 18: 1, 2, 3, 6, 9, 18. Which is biggest and also divides 30?', explain: '6 divides both, nothing bigger does.' }; }, K.ck('pf-gcf', 1), K.ck('pf-gcf', 2)] },
      { id: 'primes', title: 'GCF from prime factors', exp: ['B2.6'], skill: 'pf-gcf', hard: true,
        body: '<p>Every number is a product of <b>primes</b>. The GCF is the product of the primes the two numbers <b>share</b>.</p>',
        watch: K.slides([
          { say: '24 = 2 &times; 2 &times; 2 &times; 3. 36 = 2 &times; 2 &times; 3 &times; 3.', fig: eq('24 = 2 &times; 2 &times; 2 &times; 3<br>36 = 2 &times; 2 &times; 3 &times; 3') },
          { say: 'Put the shared primes in the middle of a Venn diagram.', fig: function () { return venn(24, 36).svg; } },
          { say: 'Multiply the shared primes: 2 &times; 2 &times; 3 = 12.', fig: eq('GCF = 2 &times; 2 &times; 3 = 12'), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find the GCF of 40 and 60. First I break each number into primes.', fig: eq('40 = 2 &times; 2 &times; 2 &times; 5<br>60 = 2 &times; 2 &times; 3 &times; 5') },
          { say: 'I put the primes they share in the middle: 2, 2 and 5.', fig: function () { return venn(40, 60).svg; } },
          { say: 'I multiply the shared primes: 2 &times; 2 &times; 5 = 20.', fig: eq('GCF = 2 &times; 2 &times; 5 = 20') },
          { say: 'I check: 40 &divide; 20 = 2 and 60 &divide; 20 = 3. So the GCF is <b>20</b>.', fig: eq('40 &divide; 20 = 2 &nbsp;&nbsp; 60 &divide; 20 = 3'), ms: 2400 }
        ]),
        ways: [{ label: 'Equal groups', html: '<p>24 pencils and 36 erasers go into identical kits with nothing left over. The most kits is the GCF, 12: each kit gets 2 pencils and 3 erasers.</p>' }],
        key: '<p><b>GCF = product of the shared prime factors.</b></p>',
        mistake: '<p>Multiplying all the primes of both numbers. That gives a multiple, not a factor.</p>',
        check: [K.ck('pf-gcf', 3)] }
    ] },
    { id: 'lcm', title: 'Multiples and the LCM', sub: 'The first place two skip counts meet.', concepts: [
      { id: 'lcm', title: 'The lowest common multiple', exp: ['B2.6'], skill: 'pf-lcm',
        body: '<p>A <b>multiple</b> is a number you land on when you skip count. The <b>lowest common multiple (LCM)</b> is the first number two skip counts <b>both</b> land on.</p>',
        watch: K.slides([
          { say: 'Skip count by 4: 4, 8, 12, 16 ...', fig: function () { return hops([4]); } },
          { say: 'Skip count by 6: 6, 12, 18 ...', fig: function () { return hops([4, 6]); } },
          { say: 'They first land together on 12. The LCM of 4 and 6 is <b>12</b>.', fig: function () { return hops([4, 6]); }, ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. I will find the LCM of 6 and 8.', fig: eq('LCM of 6 and 8 = ?') },
          { say: 'I skip count by the bigger number, 8: 8, 16, 24 ...', fig: function () { return hops([8]); } },
          { say: 'I check each one. Does 6 go into 8? No. Into 16? No. Into 24? Yes: 6 &times; 4 = 24.', fig: eq('8 &nbsp; 16 &nbsp; <b>24</b>') },
          { say: 'I can see it: 6s and 8s first land together on 24. The LCM is <b>24</b>.', fig: function () { return hops([6, 8]); }, ms: 2400 }
        ]),
        try: lab('lcm', [
          { do: 'Make two jumps that first meet at <b>24</b>.', goal: function (h) { var a = K.v(h, 'lca'), b = K.v(h, 'lcb'), c = K.v(h, 'lcc'); return [a, b].concat(c ? [c] : []).reduce(lcm) === 24; }, yes: 'Yes, the LCM is 24.' },
          { do: 'Add a third jump. Find three numbers with an LCM of <b>30</b>.', goal: function (h) { var c = K.v(h, 'lcc'); return c && [K.v(h, 'lca'), K.v(h, 'lcb'), c].reduce(lcm) === 30; }, yes: 'All three first meet at 30.' }
        ]),
        key: '<p><b>LCM: the smallest number both go into.</b> Skip count by the bigger number and check.</p>',
        mistake: '<p>Multiplying the two numbers every time: 4 &times; 6 = 24 is a common multiple, but 12 comes first.</p>',
        check: [function () { return { q: 'What is the LCM of 3, 4 and 6?', type: 'num', answer: 12, hint: 'Skip count by 6: 6, 12. Do 3 and 4 go into it?', explain: '12 divides by 3, 4 and 6.' }; }, K.ck('pf-lcm', 1), K.ck('pf-lcm', 2)] },
      { id: 'which', title: 'GCF or LCM?', exp: ['B2.6'], skill: 'pf-lcm', hard: true,
        body: '<p>Word problems need you to choose. <b>Splitting into groups</b> uses the GCF. <b>Lining things up</b> or "when together again" uses the LCM.</p><div class="vs"><div><b class="t">GCF: split up</b><p>Biggest number that goes <b>into</b> both. Never bigger than the smaller number.</p></div><div><b class="t">LCM: line up</b><p>Smallest number both go <b>into</b>. Never smaller than the bigger number.</p></div></div>',
        watch: K.slides([
          { say: 'Bus A leaves every 8 minutes. Bus B every 12. When do they leave together again?', fig: eq('8, 16, <b>24</b> &nbsp;&nbsp; 12, <b>24</b>') },
          { say: '"Together again" means line up: LCM. 24 minutes.', fig: function () { return hops([8, 12]); } },
          { say: '24 pencils and 36 erasers into identical kits. The most kits? That is splitting: GCF, 12.', fig: function () { return venn(24, 36).svg; }, ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. Hot dogs come in packs of 10. Buns come in packs of 8. I want the same number of each.', fig: eq('10, 20, 30, 40 &nbsp;&nbsp; 8, 16, 24, 32, 40') },
          { say: 'The two counts have to meet, so I need the LCM. They first meet at <b>40</b>.', fig: function () { return hops([8, 10]); } },
          { say: 'Next: 18 apples and 24 pears go into identical bags. What is the most bags I can make?', fig: eq('18 apples &nbsp;&nbsp; 24 pears') },
          { say: 'This is splitting into groups, so I need the GCF. They share the primes 2 and 3: 2 &times; 3 = <b>6</b> bags.', fig: function () { return venn(18, 24).svg; } },
          { say: 'Split into groups: GCF. Meet again: LCM.', fig: eq('split &rarr; GCF &nbsp;&nbsp; meet again &rarr; LCM'), ms: 2400 }
        ]),
        ways: [{ label: 'A quick test', html: '<p>Should the answer be <b>smaller</b> than the numbers (a share)? Use the GCF. <b>Bigger</b> (a time or amount you reach)? Use the LCM.</p>' }],
        key: '<p><b>Split into groups: GCF. Meet again: LCM.</b></p>',
        mistake: '<p>Using the GCF for a "when again" question. The answer would come before either event happens again.</p>',
        check: [K.ck('pf-lcm', 3), K.ck('pf-gcf', 3), function () { return mc('Hot dogs come in packs of 12 and buns in packs of 8. To have the same number of each, should you use the GCF or the LCM?', 'LCM', ['GCF'], 'Are you splitting something up, or lining two counts up?', 'You need a number both 12 and 8 go into: the LCM, 24.'); }] }
    ] }
  ];

  A.register('powers-factors', {
    lessons: LESSONS,

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
        do { m = R.int(1, 12); n = R.int(2, 12); } while (m === n || gcd(m, n) !== 1 || g * m > lim || g * n > lim || (lv === 3 && m < 2));
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

  /* ---------- question shapes: more ways to practise each skill ---------- */
  function isSq(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function bigNum(len) { var s = String(R.int(1, 9)); for (var i = 1; i < len; i++) s += R.int(0, 9); return +s; }
  function digitAt(n, e) { return Math.floor(n / Math.pow(10, e)) % 10; }
  var PLACE = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions', 'hundred millions', 'billions'];
  Atlas.Q.shapes('powers-factors', {
    'pf-read': [
      [1, 'tap', function () {
        return K.retry(function () {
          var e = R.int(3, 7), d = R.int(1, 9), at = R.int(0, 3);
          var set = K.uniq(4, function () { return bigNum(8); }).map(function (n, i) { var cur = digitAt(n, e), want = i === at ? d : cur === d ? d % 9 + 1 : cur; return n + (want - cur) * Math.pow(10, e); });
          var hits = K.picks(set, function (n) { return digitAt(n, e) === d; });
          if (!hits || hits.length !== 1 || new Set(set).size !== 4) return null;
          return { q: 'Tap the number with a <b>' + d + '</b> in the <b>' + PLACE[e] + '</b> place.', type: 'tap', tiles: set.map(function (n) { return '<span class="math">' + fmt(n) + '</span>'; }), answer: hits[0],
            hint: 'Count places from the right: ones, tens, hundreds, then the next period.', steps: ['The ' + PLACE[e] + ' place is ' + (e + 1) + ' digits from the right.', 'Check that digit in each number.'],
            explain: 'In ' + fmt(set[hits[0]]) + ', the ' + d + ' is in the ' + PLACE[e] + ' place, worth ' + fmt(d * Math.pow(10, e)) + '.', meta: { k: 'pf-read-tap', set: set, e: e, d: d } };
        });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), m = R.int(1, lv === 1 ? 9 : 99), t = R.int(0, 999), o = R.int(1, 999), n = m * 1e6 + t * 1e3 + o;
        var what = R.pick(['people visited a museum website', 'litres of water went through a town pipe', 'steps were counted by a school club', 'passengers flew through an airport']);
        return { q: who + ' reads that <b>' + m + ' million, ' + t + ' thousand, ' + o + '</b> ' + what + ' last year. Write the number in standard form.', type: 'num', answer: n,
          hint: 'Write each period as three digits: millions, then thousands, then ones.', steps: ['Millions: ' + m + '.', 'Thousands: ' + String(t + 1000).slice(1) + '.', 'Ones: ' + String(o + 1000).slice(1) + '.', 'Together: ' + fmt(n) + '.'],
          explain: m + ' million, ' + t + ' thousand, ' + o + ' is ' + fmt(n) + '.', meta: { k: 'pf-read-story', m: m, t: t, o: o } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), n = bigNum(R.int(8, 10)), e = R.int(4, String(n).length - 1), d = digitAt(n, e);
        while (!d) { n = bigNum(String(n).length); d = digitAt(n, e); }
        var truth = R.int(0, 1), said = truth ? d * Math.pow(10, e) : d * Math.pow(10, e + R.pick([-1, 1]));
        var right = 'The ' + d + ' is in the ' + PLACE[e] + ' place, so it is worth ' + fmt(d * Math.pow(10, e)) + '.';
        var shown = String(n), at = shown.length - 1 - e, h = '';
        for (var k = 0; k < shown.length; k++) h += (k && (shown.length - k) % 3 === 0 ? ' ' : '') + (k === at ? '<u><b>' + d + '</b></u>' : shown.charAt(k));
        return { q: who + ' says the underlined digit in <span class="math">' + h + '</span> is worth <b>' + fmt(said) + '</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['The digit is worth just ' + d + '.', 'Count places from the left to find its value.']),
          hint: 'Count places from the right of the number.', steps: [right], explain: right, meta: { k: 'pf-read-tf', n: n, e: e, said: said } };
      }]
    ],
    'pf-expand': [
      [1, 'match', function () {
        var ks = R.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), pairs = ks.map(function (k) { return [pw(10, k), fmt(Math.pow(10, k))]; });
        return { q: 'Match each power of ten to its standard form.', type: 'match', pairs: pairs,
          hint: 'The exponent counts the zeros after the 1.', steps: ['10<sup>3</sup> is 1 followed by 3 zeros: 1000.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'pf-pow10-match', ks: ks } };
      }],
      [1, 'fill', function (lv) {
        var e1 = R.int(5, 8), e2 = R.int(lv === 1 ? 2 : 1, e1 - 2), a = R.int(1, 9), b = R.int(1, 9), n = a * Math.pow(10, e1) + b * Math.pow(10, e2);
        return { q: 'Fill in the blanks to write <span class="math">' + fmt(n) + '</span> in expanded form.', type: 'fill', fill: '<span class="math">' + fmt(n) + ' = [[]] &times; ' + pw(10, e1) + ' + [[]] &times; ' + pw(10, e2) + '</span>', answers: [a, b],
          hint: 'Find the two non-zero digits. Which place is each one in?', steps: ['The ' + a + ' has ' + e1 + ' digits after it.', 'The ' + b + ' has ' + e2 + ' digits after it.'],
          explain: fmt(n) + ' = ' + a + ' &times; ' + pw(10, e1) + ' + ' + b + ' &times; ' + pw(10, e2) + '.', meta: { k: 'pf-expand-fill', n: n, e1: e1, e2: e2 } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), k = R.int(3, 9), truth = R.int(0, 1), said = truth ? Math.pow(10, k) : Math.pow(10, k - 1);
        var right = '10<sup>' + k + '</sup> is 1 followed by ' + k + ' zeros: ' + fmt(Math.pow(10, k)) + '.';
        return { q: who + ' says <span class="math">' + pw(10, k) + ' = ' + fmt(said) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['10<sup>' + k + '</sup> means 10 &times; ' + k + ' = ' + 10 * k + '.', 'The exponent counts all the digits, so there are ' + (k - 1) + ' zeros.']),
          hint: 'The exponent counts the zeros.', steps: [right], explain: right, meta: { k: 'pf-pow10-tf', e: k, said: said } };
      }]
    ],
    'pf-power': [
      [1, 'match', function (lv) {
        var list = K.uniq(3, function () { var b = R.int(2, lv === 1 ? 6 : 9), e = R.int(2, b > 5 ? 3 : 4); return [b, e]; }, function (p) { return Math.pow(p[0], p[1]); });
        var pairs = list.map(function (p) { return [pw(p[0], p[1]), fmt(Math.pow(p[0], p[1]))]; });
        return { q: 'Match each power to its value.', type: 'match', pairs: pairs,
          hint: 'Multiply the base by itself, as many times as the exponent says.', steps: ['3<sup>4</sup> = 3 &times; 3 &times; 3 &times; 3 = 81.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join(', ') + '.', meta: { k: 'pf-power-match', list: list } };
      }],
      [1, 'order', function () {
        var list = K.uniq(4, function () { var b = R.int(2, 9), e = R.int(2, b > 4 ? 3 : 5); return [b, e]; }, function (p) { return Math.pow(p[0], p[1]); });
        list.sort(function (x, y) { return Math.pow(x[0], x[1]) - Math.pow(y[0], y[1]); });
        return { q: 'Put these powers in order from <b>least</b> to <b>greatest</b>.', type: 'order', items: list.map(function (p) { return pw(p[0], p[1]); }), first: 'least', last: 'greatest',
          hint: 'Work out each power first. Do not compare the digits.', steps: list.map(function (p) { return pw(p[0], p[1]) + ' = ' + fmt(Math.pow(p[0], p[1])); }),
          explain: 'In order: ' + list.map(function (p) { return pw(p[0], p[1]) + ' (' + fmt(Math.pow(p[0], p[1])) + ')'; }).join(', ') + '.', meta: { k: 'pf-power-order', list: list } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), b = R.int(2, 9), e = R.int(2, 4), v = Math.pow(b, e), said = R.int(0, 1) ? v : b * e;
        var right = pw(b, e) + ' means ' + Array(e + 1).join(b + ' &times; ').slice(0, -9) + ' = ' + fmt(v) + '.';
        return { q: who + ' says <span class="math">' + pw(b, e) + ' = ' + fmt(said) + '</span>. True or false?', type: 'tf', answer: said === v,
          why: K.why(right, ['A power means base times exponent.', 'A power means base plus exponent.']),
          hint: 'Write the power as repeated multiplication.', steps: [right], explain: right, meta: { k: 'pf-power-tf', b: b, e: e, said: said } };
      }]
    ],
    'pf-root': [
      [1, 'pick', function () {
        return K.retry(function () {
          var opts = K.uniq(6, function () { return R.int(0, 1) ? Math.pow(R.int(2, 15), 2) : R.int(10, 200); });
          var ans = K.picks(opts, isSq);
          if (!ans) return null;
          return { q: 'Pick every <b>perfect square</b>.', type: 'pick', options: opts.map(String), answer: ans,
            hint: 'A perfect square is a whole number times itself, like 7 &times; 7 = 49.', steps: ['Think of the squares: 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.'],
            explain: ans.map(function (j) { return opts[j] + ' = ' + Math.sqrt(opts[j]) + '<sup>2</sup>'; }).join(', ') + '.', meta: { k: 'pf-sq-pick', opts: opts } };
        });
      }],
      [1, 'line', function () {
        var r = R.int(2, 14);
        return { q: 'Place <span class="math">&radic;' + r * r + '</span> on the number line.', type: 'line', min: 0, max: 15, tick: 1, every: 5, snap: 1, answer: r,
          hint: 'Which number times itself makes ' + r * r + '?', steps: [r + ' &times; ' + r + ' = ' + r * r + '.', 'So &radic;' + r * r + ' = ' + r + '.'],
          explain: '&radic;' + r * r + ' = ' + r + ', because ' + r + ' &times; ' + r + ' = ' + r * r + '.', meta: { k: 'pf-root-line', n: r * r } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), r = R.int(3, 15), n = r * r, truth = R.int(0, 1), said = truth ? r : n / 2;
        var right = r + ' &times; ' + r + ' = ' + n + ', so &radic;' + n + ' = ' + r + '.';
        return { q: who + ' says <span class="math">&radic;' + n + ' = ' + fmt(said) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['The square root is half the number.', 'The square root is the number times 2.']),
          hint: 'Check: multiply the answer by itself.', steps: [right], explain: right, meta: { k: 'pf-root-tf', n: n, said: said } };
      }]
    ],
    'pf-gcf': [
      [1, 'pick', function () {
        return K.retry(function () {
          var g = R.int(2, 6), a = g * R.int(2, 6), b = g * R.int(2, 6);
          if (a === b) return null;
          var opts = K.uniq(6, function () { return R.int(2, 12); }).sort(function (x, y) { return x - y; });
          var ans = K.picks(opts, function (v) { return a % v === 0 && b % v === 0; });
          if (!ans) return null;
          return { q: 'Pick every <b>common factor</b> of ' + a + ' and ' + b + '.', type: 'pick', options: opts.map(String), answer: ans,
            hint: 'A common factor divides both numbers with nothing left over.', steps: ['Factors of ' + a + ': ' + factors(a).join(', ') + '.', 'Factors of ' + b + ': ' + factors(b).join(', ') + '.'],
            explain: ans.map(function (j) { return opts[j]; }).join(', ') + ' divide both ' + a + ' and ' + b + '.', meta: { k: 'pf-cf-pick', a: a, b: b, opts: opts } };
        });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), g = R.int(2, lv === 1 ? 6 : 12), m, n;
        do { m = R.int(2, 7); n = R.int(2, 7); } while (m === n || gcd(m, n) !== 1);
        var a = g * m, b = g * n, it = R.pick([['granola bars', 'apples', 'snack bags'], ['red beads', 'blue beads', 'bracelets'], ['pencils', 'erasers', 'school kits'], ['hot dogs', 'juice boxes', 'picnic plates']]);
        return { q: who + ' has ' + a + ' ' + it[0] + ' and ' + b + ' ' + it[1] + '. ' + who + ' wants to make identical ' + it[2] + ', using all of them. What is the greatest number of ' + it[2] + ' ' + who + ' can make?', type: 'num', answer: g,
          hint: 'The number of ' + it[2] + ' must divide both ' + a + ' and ' + b + '. Find the greatest one that does.', steps: ['Factors of ' + a + ': ' + factors(a).join(', ') + '.', 'Factors of ' + b + ': ' + factors(b).join(', ') + '.', 'The greatest common factor is ' + g + '.'],
          explain: 'GCF(' + a + ', ' + b + ') = ' + g + ', so ' + g + ' ' + it[2] + ', each with ' + m + ' ' + it[0] + ' and ' + n + ' ' + it[1] + '.', meta: { k: 'pf-gcf-story', a: a, b: b } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), g = R.int(2, 8), m, n;
        do { m = R.int(2, 6); n = R.int(2, 6); } while (m === n || gcd(m, n) !== 1);
        var a = g * m, b = g * n, f = factors(g).filter(function (x) { return x > 1 && x < g; }), truth = R.int(0, 1) || !f.length, said = truth ? g : R.pick(f);
        var right = 'The common factors of ' + a + ' and ' + b + ' are ' + factors(g).join(', ') + '. The greatest is ' + g + '.';
        return { q: who + ' says the greatest common factor of ' + a + ' and ' + b + ' is <b>' + said + '</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Any common factor is the GCF.', 'The GCF is always the smaller number.']),
          hint: 'List the factors of both numbers.', steps: [right], explain: right, meta: { k: 'pf-gcf-tf', a: a, b: b, said: said } };
      }]
    ],
    'pf-lcm': [
      [1, 'pick', function () {
        return K.retry(function () {
          var a = R.int(2, 6), b = R.int(3, 8);
          if (a === b) return null;
          var L = lcm(a, b), opts = K.uniq(6, function () { return R.int(0, 2) ? L * R.int(1, 4) : R.int(6, 60); }).sort(function (x, y) { return x - y; });
          var ans = K.picks(opts, function (v) { return v % a === 0 && v % b === 0; });
          if (!ans) return null;
          return { q: 'Pick every <b>common multiple</b> of ' + a + ' and ' + b + '.', type: 'pick', options: opts.map(String), answer: ans,
            hint: 'A common multiple is in both times tables.', steps: ['The lowest common multiple is ' + L + '.', 'Every common multiple is a multiple of ' + L + '.'],
            explain: ans.map(function (j) { return opts[j]; }).join(', ') + ' are in both the ' + a + ' and the ' + b + ' times tables.', meta: { k: 'pf-cm-pick', a: a, b: b, opts: opts } };
        });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), a, b;
        do { a = R.int(2, lv === 1 ? 8 : 15); b = R.int(3, lv === 1 ? 10 : 20); } while (a === b || lcm(a, b) > 120 || lcm(a, b) === Math.max(a, b));
        var it = R.pick([['Bus A comes every ' + a + ' minutes', 'bus B every ' + b + ' minutes', 'Both buses are at the stop now. In how many minutes will they next be there together?'],
          ['One light blinks every ' + a + ' seconds', 'another every ' + b + ' seconds', 'They just blinked together. In how many seconds will they next blink together?'],
          ['Hot dogs come in packs of ' + a, 'buns in packs of ' + b, 'What is the smallest number of each ' + who + ' can buy to have the same number of hot dogs and buns?']]);
        return { q: it[0] + ', and ' + it[1] + '. ' + it[2], type: 'num', answer: lcm(a, b),
          hint: 'Count by ' + a + 's and by ' + b + 's. Find the first number in both lists.', steps: ['By ' + a + 's: ' + [1, 2, 3, 4, 5].map(function (i) { return a * i; }).join(', ') + ', ...', 'By ' + b + 's: ' + [1, 2, 3, 4, 5].map(function (i) { return b * i; }).join(', ') + ', ...', 'The first match is ' + lcm(a, b) + '.'],
          explain: 'The lowest common multiple of ' + a + ' and ' + b + ' is ' + lcm(a, b) + '.', meta: { k: 'pf-lcm-story', a: a, b: b } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a, b;
        do { a = R.int(2, 10); b = R.int(3, 12); } while (a === b || gcd(a, b) === 1 || a % b === 0 || b % a === 0);
        var truth = R.int(0, 1), said = truth ? lcm(a, b) : a * b;
        var right = 'Count by ' + Math.max(a, b) + 's: the first one that ' + Math.min(a, b) + ' also divides is ' + lcm(a, b) + '.';
        return { q: who + ' says the lowest common multiple of ' + a + ' and ' + b + ' is <b>' + said + '</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['The LCM is always the two numbers multiplied.', 'The LCM is the larger of the two numbers.']),
          hint: 'Is there a smaller number in both times tables?', steps: [right], explain: right, meta: { k: 'pf-lcm-tf', a: a, b: b, said: said } };
      }]
    ]
  });
})();
