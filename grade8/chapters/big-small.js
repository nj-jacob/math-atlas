(function () {
  var A = Atlas, R = A.R;

  /* move the decimal point of a decimal string k places right (k < 0: left). Exact, no floating point. */
  function shift(str, k) {
    str = String(str);
    var neg = str.charAt(0) === '-';
    if (neg) str = str.slice(1);
    var p = str.split('.'), ip = p[0], fp = p[1] || '', digs = ip + fp, pos = ip.length + k, out;
    if (pos <= 0) out = '0.' + new Array(-pos + 1).join('0') + digs;
    else if (pos >= digs.length) out = digs + new Array(pos - digs.length + 1).join('0');
    else out = digs.slice(0, pos) + '.' + digs.slice(pos);
    out = out.replace(/^0+(?=\d)/, '');
    if (out.indexOf('.') >= 0) out = out.replace(/0+$/, '').replace(/\.$/, '');
    return (neg ? '-' : '') + (out || '0');
  }
  A.shiftDec = shift;
  function F(str) { return A.fmt(str); }
  /* a × 10^e written out in full */
  function std(a, e) { return shift(String(a), e); }
  var SUP = function (e) { return '10<sup>' + String(e).replace('-', '&minus;') + '</sup>'; };
  function sci(a, e) { return A.sci(a, e); }
  /* split a standard-form string into coefficient and exponent */
  function toSci(str) {
    var n = parseFloat(str), e = Math.floor(Math.log10(n));
    var a = shift(str, -e);
    if (parseFloat(a) >= 10) { e++; a = shift(str, -e); }
    if (parseFloat(a) < 1) { e--; a = shift(str, -e); }
    return { a: a, e: e };
  }

  var WORDS = { '-12': 'one trillionth', '-9': 'one billionth', '-6': 'one millionth', '-3': 'one thousandth', '-2': 'one hundredth', '-1': 'one tenth', 0: 'one', 1: 'ten', 2: 'one hundred', 3: 'one thousand', 6: 'one million', 9: 'one billion', 12: 'one trillion' };
  /* landmarks in metres, for the size strip */
  var MARKS = [
    [-9, 'DNA strand is about 2 nm wide', 2], [-7, 'flu virus, about 100 nm', 1], [-6, 'bacterium, about 1 &micro;m', 1], [-5, 'human hair, about 0.07 mm', 7],
    [-4, 'sheet of paper, about 0.1 mm thick', 1], [-3, 'grain of sand, about 1 mm', 1], [0, 'a doorway, about 1 m wide', 1], [2, 'CN Tower, about 553 m tall', 5.53],
    [3, '10 minute walk, about 1 km', 1], [6, '10 hour highway drive, about 1000 km', 1], [7, 'Earth, about 12 742 km across', 1.2742]
  ];

  /* the ladder of powers: each step right is × 10 */
  function ladder() {
    var s = '', n = 7, w = 56, x0 = 8, base = 136;
    s += '<defs><marker id="bsa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    for (var i = 0; i < n; i++) {
      var e = i - 3, h = 16 + i * 13, x = x0 + i * w, y = base - h, cx = x + (w - 6) / 2;
      var tint = e < 0 ? 'var(--accent)' : 'var(--strand)';
      s += '<rect x="' + x + '" y="' + y + '" width="' + (w - 6) + '" height="' + h + '" rx="2" style="fill:color-mix(in srgb,' + tint + ' ' + (14 + Math.abs(e) * 10) + '%,var(--card));stroke:' + tint + '" stroke-width="1.5"/>';
      s += '<text x="' + cx + '" y="' + (y - 8) + '" text-anchor="middle" font-size="19" class="serif" font-weight="600">10<tspan dy="-8" font-size="14">' + (e < 0 ? '−' + -e : e) + '</tspan></text>';
      s += '<text x="' + cx + '" y="' + (base + 22) + '" text-anchor="middle" font-size="' + (i === 0 ? 15 : 17) + '" class="tb">' + F(std('1', e)) + '</text>';
    }
    s += '<line x1="4" y1="' + base + '" x2="396" y2="' + base + '" style="stroke:var(--ink)" stroke-width="1.5"/>';
    s += '<line x1="30" y1="190" x2="370" y2="190" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#bsa)"/><text x="200" y="182" text-anchor="middle" font-size="17" class="t2">step right: &#215; 10</text>';
    s += '<line x1="370" y1="206" x2="30" y2="206" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#bsa)"/><text x="200" y="228" text-anchor="middle" font-size="17" class="t2">step left: &#247; 10</text>';
    return A.svg(400, 236, s, 'Powers of ten from 10 to the power negative 3, which is 0.001, up to 10 to the power 3, which is 1000. Each step to the right multiplies by 10. Each step to the left divides by 10.');
  }

  /* place chart showing each digit sliding k places, using only the columns needed */
  var PNAME = { 5: '100 000s', '-5': '10⁻⁵', '-6': '10⁻⁶', 4: '10 000s', 3: '1000s', 2: '100s', 1: '10s', 0: '1s', '-1': '0.1s', '-2': '0.01s', '-3': '0.001s', '-4': '0.0001s' };
  function places(v) {
    var p = v.split('.'), out = {}, ip = p[0].replace('-', ''), fp = p[1] || '';
    for (var i = 0; i < ip.length; i++) out[ip.length - 1 - i] = ip.charAt(i);
    for (var j = 0; j < fp.length; j++) out[-(j + 1)] = fp.charAt(j);
    if (ip === '0' && fp) delete out[0];
    return out;
  }
  function slide(str, k, label) {
    var res = shift(str, k), a = places(str), b = places(res), keys = Object.keys(a).concat(Object.keys(b)).map(Number);
    var hi = Math.max(0, Math.max.apply(null, keys)), lo = Math.min(-1, Math.min.apply(null, keys));
    var cw = 52, x0 = 6, s = '', ncol = hi - lo + 1, W = x0 * 2 + ncol * cw;
    function X(p) { return x0 + (hi - p) * cw; }
    s += '<defs><marker id="bsb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>';
    for (var p = hi; p >= lo; p--) {
      s += '<rect x="' + X(p) + '" y="4" width="' + cw + '" height="26" style="fill:color-mix(in srgb,var(--strand) ' + (p >= 0 ? 18 : 7) + '%,var(--card));stroke:var(--line)"/>' +
        '<text x="' + (X(p) + cw / 2) + '" y="22" text-anchor="middle" font-size="' + (PNAME[p].length > 5 ? 13 : 16) + '" class="t2">' + PNAME[p] + '</text>';
      [[30, a], [118, b]].forEach(function (r) {
        s += '<rect x="' + X(p) + '" y="' + r[0] + '" width="' + cw + '" height="44" style="fill:var(--card);stroke:var(--line)"/>';
        if (r[1][p] !== undefined) s += '<text x="' + (X(p) + cw / 2) + '" y="' + (r[0] + 32) + '" text-anchor="middle" font-size="28" class="serif" font-weight="600">' + r[1][p] + '</text>';
      });
    }
    [30, 118].forEach(function (y) { s += '<circle cx="' + X(-1) + '" cy="' + (y + 38) + '" r="4.5" style="fill:var(--accent)"/>'; });
    Object.keys(a).forEach(function (p) {
      p = +p;
      s += '<line x1="' + (X(p) + cw / 2) + '" y1="76" x2="' + (X(p + k) + cw / 2) + '" y2="114" style="stroke:var(--accent)" stroke-width="1.8" marker-end="url(#bsb)"/>';
    });
    if (label) s += '<text x="' + (W / 2) + '" y="186" text-anchor="middle" font-size="16" class="t2">' + label + '</text>';
    return A.svg(W, label ? 194 : 166, s,
      F(str) + ' becomes ' + F(res) + '. Every digit moves ' + Math.abs(k) + ' place' + (Math.abs(k) > 1 ? 's' : '') + ' to the ' + (k > 0 ? 'left' : 'right') + '. The decimal point stays where it is.');
  }

  /* anatomy of a number in scientific notation */
  function anatomy() {
    var s = '<text x="200" y="74" text-anchor="middle" font-size="56" class="serif" font-weight="600">' +
      '<tspan style="fill:var(--strand)">3.8</tspan><tspan> &#215; </tspan><tspan>10</tspan><tspan dy="-26" font-size="34" style="fill:var(--accent)">7</tspan></text>';
    s += '<path d="M64 88 v10 h88 v-10" fill="none" style="stroke:var(--strand)" stroke-width="2"/><text x="108" y="120" text-anchor="middle" font-size="17" class="tb" style="fill:var(--strand)">from 1 to</text><text x="108" y="140" text-anchor="middle" font-size="17" class="tb" style="fill:var(--strand)">less than 10</text>';
    s += '<path d="M232 88 v10 h62 v-10" fill="none" style="stroke:var(--ink2)" stroke-width="2"/><text x="263" y="120" text-anchor="middle" font-size="17" class="t2">always 10</text>';
    s += '<line x1="318" y1="38" x2="318" y2="100" style="stroke:var(--accent)" stroke-width="2"/><text x="350" y="120" text-anchor="middle" font-size="17" class="tb" style="fill:var(--accent)">places the</text><text x="350" y="140" text-anchor="middle" font-size="17" class="tb" style="fill:var(--accent)">point moves</text>';
    s += '<text x="200" y="178" text-anchor="middle" font-size="19">= 38 000 000</text><text x="200" y="200" text-anchor="middle" font-size="15" class="t2">about how many people lived in Canada in 2021</text>';
    return A.svg(400, 208, s, '3.8 times 10 to the power 7. The 3.8 is at least 1 and less than 10. The base is always 10. The exponent 7 says how many places the decimal point moves. It equals 38 000 000.');
  }
  /* decimal point hops for converting a number, with numbered arcs */
  function hops(str, label) {
    var t = toSci(str), digits = str.replace('.', ''), e = t.e, s = '', cw = 28;
    var ip = str.split('.')[0], start = ip.length, firstNZ = digits.search(/[1-9]/), end = firstNZ + 1;
    var n = digits.length, W = Math.max(320, n * cw + 40), x0 = W / 2 - n * cw / 2;
    for (var i = 0; i < n; i++) s += '<text x="' + (x0 + i * cw + cw / 2) + '" y="70" text-anchor="middle" font-size="32" class="serif" font-weight="600"' + (i === firstNZ ? ' style="fill:var(--strand)"' : '') + '>' + digits.charAt(i) + '</text>';
    function px(k) { return x0 + k * cw; }
    s += '<circle cx="' + px(start) + '" cy="72" r="4.5" style="fill:var(--ink2)"/><text x="' + px(start) + '" y="96" text-anchor="middle" font-size="15" class="t2">start</text>';
    s += '<circle cx="' + px(end) + '" cy="72" r="5.5" style="fill:var(--accent)"/>';
    var dir = end > start ? 1 : -1;
    for (var k = start; k !== end; k += dir) {
      var a = px(k), b = px(k + dir), m = (a + b) / 2;
      s += '<path d="M' + a + ' 38 Q' + m + ' 14 ' + b + ' 38" fill="none" style="stroke:var(--accent)" stroke-width="1.8"/>' +
        '<text x="' + m + '" y="20" text-anchor="middle" font-size="15" class="tb" style="fill:var(--accent)">' + Math.abs(k + dir - start) + '</text>';
    }
    s += '<text x="' + W / 2 + '" y="128" text-anchor="middle" font-size="20">' + F(str) + ' = ' + t.a + ' &#215; 10<tspan dy="-8" font-size="14">' + (e < 0 ? '−' + -e : e) + '</tspan></text>';
    return A.svg(W, 138, s, label || F(str) + ' equals ' + t.a + ' times 10 to the power ' + e + '. The decimal point moves ' + Math.abs(e) + ' places.');
  }

  var PRE = [['tera', 'T', 12], ['giga', 'G', 9], ['mega', 'M', 6], ['kilo', 'k', 3], ['(base unit)', '', 0], ['milli', 'm', -3], ['micro', '&micro;', -6], ['nano', 'n', -9], ['pico', 'p', -12]];
  function prefixStairs() {
    var s = '', rh = 38, ex = { 12: '2 TB hard drive', 9: '128 GB phone', 6: '3 MW wind turbine', 3: '5 km walk', 0: 'one metre', '-3': '2 mm raindrop', '-6': '1 &micro;m bacterium', '-9': '2 nm DNA strand', '-12': '100 pm atom' };
    PRE.forEach(function (p, i) {
      var y = 4 + i * rh, w = 18 + (p[2] + 12) * 4.2, col = p[2] < 0 ? 'var(--accent)' : p[2] > 0 ? 'var(--strand)' : 'var(--ink2)';
      s += '<rect x="0" y="' + y + '" width="' + w + '" height="' + (rh - 6) + '" rx="2" style="fill:color-mix(in srgb,' + col + ' ' + (12 + Math.abs(p[2]) * 2.5) + '%,var(--card));stroke:' + col + '" stroke-width="1"/>';
      s += '<text x="8" y="' + (y + 23) + '" font-size="18" class="tb">' + (p[1] || '&#8212;') + '</text>';
      s += '<text x="' + (w + 8) + '" y="' + (y + 22) + '" font-size="17"><tspan class="tb">' + p[0].replace('(base unit)', 'base unit') + '</tspan> &#160;10<tspan dy="-7" font-size="12">' + (p[2] < 0 ? '−' + -p[2] : p[2]) + '</tspan><tspan dy="7" class="t2"> &#160;' + ex[p[2]] + '</tspan></text>';
    });
    return A.svg(400, PRE.length * rh + 4, s, 'Metric prefixes from largest to smallest. Tera, 10 to the 12. Giga, 10 to the 9. Mega, 10 to the 6. Kilo, 10 to the 3. The base unit. Milli, 10 to the negative 3. Micro, 10 to the negative 6. Nano, 10 to the negative 9. Pico, 10 to the negative 12. Each step is 1000 times the one below it.');
  }
  /* log strip: where a size sits from 10^-9 to 10^8, with landmarks */
  function strip(a, e) {
    var lo = -9, hi = 8, x0 = 16, x1 = 384, s = '';
    function X(v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }
    s += '<line x1="' + x0 + '" y1="62" x2="' + x1 + '" y2="62" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var k = lo; k <= hi; k++) {
      s += '<line x1="' + X(k) + '" y1="' + (k % 3 ? 58 : 54) + '" x2="' + X(k) + '" y2="' + (k % 3 ? 66 : 70) + '" style="stroke:var(--ink)" stroke-width="1.5"/>';
      if (k % 3 === 0) s += '<text x="' + X(k) + '" y="90" text-anchor="middle" font-size="16">10<tspan dy="-7" font-size="12">' + (k < 0 ? '−' + -k : k) + '</tspan></text>';
    }
    s += '<text x="' + x0 + '" y="114" font-size="15" class="t2">tiny</text><text x="' + x1 + '" y="114" text-anchor="end" font-size="15" class="t2">huge</text><text x="200" y="114" text-anchor="middle" font-size="15" class="t2">metres</text>';
    var v = Math.log10(a) + e, best = null;
    MARKS.forEach(function (m) { var mv = Math.log10(m[2]) + m[0]; if (!best || Math.abs(mv - v) < Math.abs(best.v - v)) best = { v: mv, t: m[1] }; });
    var mx = X(Math.max(lo, Math.min(hi, v)));
    s += '<path d="M' + mx + ' 54 l-8 -13 h16 z" style="fill:var(--accent)"/>';
    s += '<text x="' + Math.max(70, Math.min(330, mx)) + '" y="30" text-anchor="middle" font-size="18" class="tb">' + a + ' &#215; 10<tspan dy="-7" font-size="13">' + (e < 0 ? '−' + -e : e) + '</tspan><tspan dy="7"> m</tspan></text>';
    return { svg: A.svg(400, 122, s, 'A size scale from 10 to the negative 9 metres to 10 to the 8 metres, with a marker at ' + a + ' times 10 to the ' + e + ' metres.'), near: best.t };
  }
  /* a log line with two values marked, for comparing */
  function compareLine(list) {
    var lo = Infinity, hi = -Infinity;
    list.forEach(function (p) { var v = Math.log10(p.a) + p.e; lo = Math.min(lo, Math.floor(v)); hi = Math.max(hi, Math.ceil(v)); });
    if (hi - lo < 2) hi = lo + 2;
    var x0 = 24, x1 = 376, s = '';
    function X(v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }
    s += '<line x1="' + x0 + '" y1="76" x2="' + x1 + '" y2="76" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var k = lo; k <= hi; k++) s += '<line x1="' + X(k) + '" y1="68" x2="' + X(k) + '" y2="84" style="stroke:var(--ink)" stroke-width="2"/><text x="' + X(k) + '" y="106" text-anchor="middle" font-size="16">10<tspan dy="-7" font-size="12">' + (k < 0 ? '−' + -k : k) + '</tspan></text>';
    var xs = list.map(function (p) { return X(Math.log10(p.a) + p.e); });
    list.forEach(function (p, i) {
      var x = xs[i], y = i % 2 ? 46 : 22, near = list.length === 2 && Math.abs(xs[0] - xs[1]) < 110, lft = near && x <= xs[1 - i];
      s += '<line x1="' + x + '" y1="' + (y + 6) + '" x2="' + x + '" y2="72" style="stroke:' + (i ? 'var(--accent)' : 'var(--strand)') + '" stroke-width="2"/><circle cx="' + x + '" cy="76" r="6" style="fill:' + (i ? 'var(--accent)' : 'var(--strand)') + '"/>' +
        (p.t ? (near ? '<text x="' + Math.max(110, Math.min(290, x)) + '" dx="' + (lft ? -8 : 8) + '" y="' + y + '" text-anchor="' + (lft ? 'end' : 'start') + '" font-size="17" class="tb">' : '<text x="' + Math.max(60, Math.min(340, x)) + '" y="' + y + '" text-anchor="middle" font-size="17" class="tb">') + p.t + '</text>' : '');
    });
    return A.svg(400, 114, s, 'Number line in powers of ten with the values marked. Further right is bigger.');
  }

  /* ---------------- lesson ---------------- */
  var html =
'<section class="sec"><h2><span class="n">1</span>Powers of ten</h2>' +
'<p>A <b>power of ten</b> is 10 multiplied by itself some number of times. The small raised number is the <b>exponent</b>. It counts the tens.</p>' +
'<div class="fig">' + ladder() + '</div>' +
'<ul class="steplist"><li>A positive exponent says how many times to <b>multiply</b> by 10. 10<sup>3</sup> = 10 &times; 10 &times; 10 = 1000.</li>' +
'<li>10<sup>0</sup> = 1. You have not multiplied by any tens yet.</li>' +
'<li>A negative exponent says how many times to <b>divide</b> 1 by 10. 10<sup>&minus;2</sup> = 1 &divide; 10 &divide; 10 = 0.01.</li></ul>' +
'<div class="eg"><b class="t">Worked example</b><p>Write 10<sup>4</sup> in standard form.</p><ol><li>The exponent is 4, so multiply four tens: 10 &times; 10 &times; 10 &times; 10.</li><li>Each 10 adds one zero after the 1.</li><li>10<sup>4</sup> = 10 000.</li></ol></div>' +
A.yt({ q: 'Write 10<sup>5</sup> in standard form.', a: 100000, back: 'Go back to step 2 of the example. The exponent 5 means five zeros after the 1.', ok: '10<sup>5</sup> is a 1 followed by five zeros: 100 000.' }) +
'<div class="key"><b class="t">Key idea</b><p>For a positive exponent, count zeros after the 1. For a negative exponent, count places after the decimal point: 10<sup>&minus;3</sup> = 0.001 has the 1 in the third place.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Multiplying and dividing by 10, 100 and 1000</h2>' +
'<p>When you multiply by 10, every digit moves <b>one place to the left</b>, so it is worth 10 times as much. Dividing by 10 moves every digit one place to the right. The decimal point stays still.</p>' +
'<div class="fig">' + slide('3.47', 2) + '</div><p class="t2" style="text-align:center;margin-top:0">3.47 &#215; 100 = 347. Every digit moves 2 places left.</p>' +
'<div class="tbl"><table><thead><tr><th>Multiply or divide by</th><th>Digits move</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td>&times; 10</td><td>1 place left</td><td class="l math">0.6 &times; 10 = 6</td></tr><tr><td>&times; 100</td><td>2 places left</td><td class="l math">3.47 &times; 100 = 347</td></tr>' +
'<tr><td>&times; 1000</td><td>3 places left</td><td class="l math">0.068 &times; 1000 = 68</td></tr><tr><td>&divide; 10</td><td>1 place right</td><td class="l math">45 &divide; 10 = 4.5</td></tr>' +
'<tr><td>&divide; 100</td><td>2 places right</td><td class="l math">7 &divide; 100 = 0.07</td></tr><tr><td>&divide; 1000</td><td>3 places right</td><td class="l math">52 &divide; 1000 = 0.052</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: the place slider</span>' +
'<div class="ctrl"><label for="shn">Number<input type="text" inputmode="decimal" id="shn" value="25.6"></label>' +
'<label for="sho">Operation<select id="sho"><option value="1">&#215; 10</option><option value="2">&#215; 100</option><option value="3" selected>&#215; 1000</option><option value="-1">&#247; 10</option><option value="-2">&#247; 100</option><option value="-3">&#247; 1000</option></select></label></div>' +
'<div class="fig" id="shfig"></div><div class="out" id="shout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>"To multiply by 10, add a zero." That only works for whole numbers. 2.5 &times; 10 is <b>25</b>, not 2.50. Move the digits instead.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out 4.5 &divide; 100.</p><ol><li>Dividing by 100 moves every digit 2 places right.</li><li>The 4 moves from ones to hundredths. The 5 moves from tenths to thousandths.</li><li>Fill the empty tenths place with 0: 4.5 &divide; 100 = 0.045.</li></ol></div>' +
A.yt({ q: 'Work out 0.38 &times; 1000.', a: 380, back: 'Look at the table: &times; 1000 moves every digit 3 places left. The 3 goes from tenths to hundreds.', ok: 'The 3 moves to hundreds and the 8 to tens, with a 0 in the ones place: 380.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Scientific notation for big numbers</h2>' +
'<p>Scientists write very big numbers in a short form called <b>scientific notation</b>: a number from 1 up to (but not including) 10, times a power of ten.</p>' +
'<div class="fig">' + anatomy() + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Write 5 600 000 in scientific notation.</p><ol><li>Put the decimal point after the first non-zero digit: 5.6</li><li>Count how many places the point moved from the end of the number: 6 places left.</li><li>Moving left makes the exponent positive: 5 600 000 = 5.6 &times; 10<sup>6</sup>.</li></ol>' +
'<div class="fig">' + hops('5600000') + '</div></div>' +
A.yt({ q: 'Write 72 000 in scientific notation.', opts: ['7.2 &times; 10<sup>4</sup>', '72 &times; 10<sup>3</sup>', '7.2 &times; 10<sup>3</sup>', '0.72 &times; 10<sup>5</sup>'], a: 0, back: 'Go back to step 1: the first part must be at least 1 and less than 10. Then count the places the point moved.', ok: 'The point moves 4 places, from after the last 0 to after the 7: 7.2 &times; 10<sup>4</sup>.' }) +
'<div class="key"><b class="t">Key idea</b><p>To go back to standard form, move the point to the right as many places as the exponent says: 2.04 &times; 10<sup>5</sup> = 204 000.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Very small numbers</h2>' +
'<p>Very small numbers use a <b>negative exponent</b>. The point moves to the right to reach the first non-zero digit.</p>' +
'<div class="fig">' + hops('0.00007', 'The decimal point in 0.000 07 hops 5 places right to sit after the 7. So 0.000 07 equals 7 times 10 to the power negative 5.') + '</div>' +
'<p>A human hair is about 0.000 07 m wide. That is 7 &times; 10<sup>&minus;5</sup> m.</p>' +
'<div class="mistake"><b class="t">Common mistake</b><p>A negative exponent does <b>not</b> make a negative number. 10<sup>&minus;3</sup> = 0.001. It is small, but still more than zero.</p></div>' +
'<div class="lab"><span class="lt">Try it: build a size</span>' +
'<div class="ctrl"><label for="sca">First part: <output id="scao"></output><input type="range" id="sca" min="10" max="99" value="35"></label>' +
'<label for="sce">Exponent: <output id="sceo"></output><input type="range" id="sce" min="-9" max="8" value="-6"></label></div>' +
'<div class="fig" id="scfig"></div><div class="out" id="scout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Write 3.1 &times; 10<sup>&minus;4</sup> in standard form.</p><ol><li>The exponent is &minus;4, so move the point 4 places left.</li><li>3.1 &rarr; 0.31 &rarr; 0.031 &rarr; 0.0031 &rarr; 0.000 31.</li><li>3.1 &times; 10<sup>&minus;4</sup> = 0.000 31.</li></ol></div>' +
A.yt({ q: 'Write 0.0042 in scientific notation. What is the exponent?', a: -3, back: 'Count the hops: the point has to move right until it sits after the 4. Moving right gives a negative exponent.', ok: 'The point hops 3 places right to give 4.2, so 0.0042 = 4.2 &times; 10<sup>&minus;3</sup>.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Metric prefixes from pico to tera</h2>' +
'<p>A metric prefix is a short way to write a power of ten in front of a unit. The big steps below each go up by <b>1000</b>.</p>' +
'<div class="fig">' + prefixStairs() + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">Prefix</th><th>Symbol</th><th>Means</th><th class="l">In standard form</th></tr></thead><tbody>' +
PRE.map(function (p) { return p[2] ? '<tr><td class="l">' + p[0] + '</td><td>' + p[1] + '</td><td>' + SUP(p[2]) + '</td><td class="l math">' + F(std('1', p[2])) + '</td></tr>' : ''; }).join('') + '</tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: convert units</span>' +
'<div class="ctrl"><label for="pcv">Amount<input type="text" inputmode="decimal" id="pcv" value="3"></label>' +
'<label for="pcf">From<select id="pcf"></select></label><label for="pct">To<select id="pct"></select></label>' +
'<label for="pcu">Unit<select id="pcu"><option value="m">metres (m)</option><option value="g">grams (g)</option><option value="B">bytes (B)</option><option value="W">watts (W)</option></select></label></div>' +
'<div class="out" id="pcout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A phone has 3 GB of free space. How many MB is that?</p><ol><li>Giga is 10<sup>9</sup>. Mega is 10<sup>6</sup>. That is 3 steps of ten apart, so 1 GB = 1000 MB.</li><li>Going to a smaller unit means more of them, so multiply: 3 &times; 1000.</li><li>3 GB = 3000 MB.</li></ol></div>' +
A.yt({ q: 'A wind farm makes 5 MW of power. How many kW is that?', a: 5000, unit: 'kW', back: 'Use the stairs: mega is one big step above kilo, and each big step is 1000. A smaller unit means more of them, so multiply.', ok: '1 MW = 1000 kW, so 5 MW = 5 &times; 1000 = 5000 kW.' }) +
'<div class="key"><b class="t">Key idea</b><p>Going to a <b>smaller</b> unit, the number gets <b>bigger</b>. Going to a bigger unit, the number gets smaller. Check that your answer makes sense.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Comparing very large and very small numbers</h2>' +
'<p>To compare numbers in scientific notation, look at the <b>exponents first</b>. The bigger exponent wins. Only if the exponents match do you compare the first parts.</p>' +
'<div class="fig">' + compareLine([{ a: 4.5, e: 6, t: '4.5 &#215; 10⁶' }, { a: 9.1, e: 5, t: '9.1 &#215; 10⁵' }]) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Which is bigger: 4.5 &times; 10<sup>6</sup> or 9.1 &times; 10<sup>5</sup>?</p><ol><li>Compare exponents: 6 is bigger than 5.</li><li>So 4.5 &times; 10<sup>6</sup> is bigger, even though 9.1 is bigger than 4.5.</li><li>Check: 4 500 000 &gt; 910 000.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>For negative exponents, closer to zero is bigger. &minus;3 is bigger than &minus;5, so 2 &times; 10<sup>&minus;3</sup> (0.002) is bigger than 8 &times; 10<sup>&minus;5</sup> (0.000 08).</p></div>' +
A.yt({ q: 'Which is smaller?', opts: ['6 &times; 10<sup>&minus;7</sup>', '2 &times; 10<sup>&minus;6</sup>'], a: 0, back: 'Compare the exponents first. Which of &minus;7 and &minus;6 is further below zero?', ok: '&minus;7 is less than &minus;6, so 6 &times; 10<sup>&minus;7</sup> = 0.000 000 6 is the smaller one.' }) +
'</section>';

  /* ---------------- practice ---------------- */
  function supE(e) { return '10<sup>' + (e < 0 ? '&minus;' + -e : e) + '</sup>'; }
  function coef(lv) { var c = lv === 1 ? R.int(1, 9) : R.int(11, 99) / 10; if (lv === 3 && R.int(0, 1)) c = R.int(101, 999) / 100; return String(c); }
  var practice = [
    { id: 'bs-pow', name: 'Powers of ten', code: 'B1.1', gen: function (lv) {
      var e;
      if (lv === 1) {
        e = R.int(2, 7);
        return { q: 'Write ' + supE(e) + ' in standard form.', type: 'num', answer: Math.pow(10, e), show: F(std('1', e)),
          hint: 'The exponent ' + e + ' tells you how many zeros come after the 1.', steps: ['The exponent is ' + e + '.', 'Write a 1 and then ' + e + ' zeros.', supE(e) + ' = ' + F(std('1', e)) + '.'], explain: supE(e) + ' is 1 followed by ' + e + ' zeros.' };
      }
      if (lv === 2) {
        e = -R.int(1, 5);
        var right = F(std('1', e)), wrong = [F(std('1', e - 1)), F(std('1', e + 1)), '&minus;' + F(std('1', -e)), F(std('1', -e))];
        var o = R.mc(right, wrong);
        return { q: 'Which number equals ' + supE(e) + '?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'A negative exponent means divide 1 by 10 that many times. It is small but not negative.', steps: ['Start at 1.', 'Divide by 10 a total of ' + -e + ' time' + (e < -1 ? 's' : '') + '.', 'The 1 ends up in place ' + -e + ' after the decimal point: ' + right + '.'], explain: supE(e) + ' = ' + right + '. It has its 1 in place ' + -e + ' after the point.' };
      }
      e = R.pick([-6, -5, -4, -3, 4, 5, 6, 8, 9]);
      return { q: 'Write ' + F(std('1', e)) + ' as a power of ten. What is the exponent?', type: 'num', answer: e,
        fig: e < 0 ? hops(std('1', e)) : '', hint: e > 0 ? 'Count the zeros after the 1.' : 'Count the places after the decimal point, up to and including the 1. The exponent is negative.',
        steps: [e > 0 ? 'There are ' + e + ' zeros after the 1.' : 'The 1 is in place ' + -e + ' after the decimal point.', 'So the number is ' + supE(e) + '.'], explain: F(std('1', e)) + ' = ' + supE(e) + '.' };
    } },
    { id: 'bs-shift', name: '&times; and &divide; by 10, 100, 1000', code: 'B2.3', gen: function (lv) {
      var k = R.pick([1, 2, 3]) * (lv === 1 ? 1 : R.pick([1, -1])), n;
      if (lv === 1) n = String(R.int(2, 99));
      else if (lv === 2) n = String(R.int(11, 999) / 10);
      else n = String(R.int(101, 9999) / 1000);
      var res = shift(n, k), op = (k > 0 ? '&times; ' : '&divide; ') + F(std('1', Math.abs(k)));
      if (lv === 3 && R.int(0, 1)) {
        /* multiply by 0.1, 0.01 or 0.001 */
        k = -R.pick([1, 2, 3]); res = shift(n, k); op = '&times; ' + std('1', k);
        return { q: 'Work out <span class="math">' + n + ' ' + op + '</span>.', type: 'num', answer: parseFloat(res), show: F(res), fig: slide(n, k),
          hint: '&times; ' + std('1', k) + ' is the same as &divide; ' + F(std('1', -k)) + '. Move every digit ' + -k + ' place' + (k < -1 ? 's' : '') + ' right.',
          steps: ['&times; ' + std('1', k) + ' means &divide; ' + F(std('1', -k)) + '.', 'Move every digit ' + -k + ' place' + (k < -1 ? 's' : '') + ' to the right. Use zeros to fill empty places before the first digit.', n + ' ' + op + ' = ' + F(res) + '.'], explain: 'Multiplying by ' + std('1', k) + ' moves the digits ' + -k + ' place' + (k < -1 ? 's' : '') + ' right, giving ' + F(res) + '.' };
      }
      return { q: 'Work out <span class="math">' + F(n) + ' ' + op + '</span>.', type: 'num', answer: parseFloat(res), show: F(res), fig: lv === 1 ? '' : slide(n, k),
        hint: (k > 0 ? 'Multiplying' : 'Dividing') + ' by ' + F(std('1', Math.abs(k))) + ' moves every digit ' + Math.abs(k) + ' place' + (Math.abs(k) > 1 ? 's' : '') + ' to the ' + (k > 0 ? 'left' : 'right') + '.',
        steps: [F(std('1', Math.abs(k))) + ' has ' + Math.abs(k) + ' zero' + (Math.abs(k) > 1 ? 's' : '') + ', so every digit moves ' + Math.abs(k) + ' place' + (Math.abs(k) > 1 ? 's' : '') + '.', (k > 0 ? 'Multiplying makes it bigger: move left.' : 'Dividing makes it smaller: move right.') + ' The decimal point stays still.', 'Fill empty places with zeros: ' + F(n) + ' ' + op + ' = ' + F(res) + '.'],
        explain: F(n) + ' ' + op + ' = ' + F(res) + '.' };
    } },
    { id: 'bs-sci-big', name: 'Scientific notation: big numbers', code: 'B1.1', gen: function (lv) {
      var c = coef(lv), e = R.int(lv === 1 ? 3 : 4, lv === 3 ? 11 : 8), n = std(c, e);
      if (lv === 2 || (lv === 3 && R.int(0, 1))) {
        return { q: 'Write ' + sci(c, e) + ' in standard form.', type: 'num', answer: parseFloat(n), show: F(n),
          hint: 'The exponent is ' + e + '. Move the decimal point ' + e + ' places to the right, adding zeros as you go.',
          steps: ['Start with ' + c + '.', 'Move the point ' + e + ' places right. Add zeros when you run out of digits.', sci(c, e) + ' = ' + F(n) + '.'], explain: 'Moving the point ' + e + ' places right gives ' + F(n) + '.' };
      }
      var t = toSci(n);
      var o = R.mc(sci(t.a, t.e), [sci(t.a, t.e - 1), sci(t.a, t.e + 1), sci(shift(t.a, 1), t.e - 1), sci(shift(t.a, -1), t.e + 1)]);
      return { q: 'Write <span class="math">' + F(n) + '</span> in scientific notation.', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? hops(n) : '',
        hint: 'The first part must be at least 1 and less than 10. Then count how many places the point moved.',
        steps: ['Put the point after the first digit: ' + t.a + '.', 'Count the places from there to the end of the number: ' + t.e + '.', F(n) + ' = ' + sci(t.a, t.e) + '.'], explain: F(n) + ' = ' + sci(t.a, t.e) + '. The point moved ' + t.e + ' places.' };
    } },
    { id: 'bs-sci-small', name: 'Scientific notation: small numbers', code: 'B1.1', gen: function (lv) {
      var c = coef(lv), e = -R.int(lv === 1 ? 2 : 3, lv === 3 ? 9 : 6), n = std(c, e);
      if (lv === 1) {
        return { q: 'Write <span class="math">' + F(n) + '</span> in scientific notation. What is the exponent?', type: 'num', answer: e, fig: hops(n),
          hint: 'Count the hops in the picture. Moving the point to the right gives a negative exponent.', steps: ['The point hops right until it sits after the ' + c.charAt(0) + '.', 'It hops ' + -e + ' places.', 'Right means negative: the exponent is ' + e + '.'],
          explain: F(n) + ' = ' + sci(c, e) + '.' };
      }
      if (lv === 2 && R.int(0, 1)) {
        return { q: 'Write ' + sci(c, e) + ' in standard form.', type: 'num', answer: parseFloat(n), show: F(n),
          hint: 'The exponent is ' + e + '. Move the point ' + -e + ' places to the left.', steps: ['Start with ' + c + '.', 'Move the point ' + -e + ' places left, filling with zeros.', sci(c, e) + ' = ' + F(n) + '.'], explain: 'Moving the point ' + -e + ' places left gives ' + F(n) + '.' };
      }
      var o = R.mc(sci(c, e), [sci(c, -e), sci(c, e + 1), sci(c, e - 1), sci('&minus;' + c, -e)]);
      return { q: 'Write <span class="math">' + F(n) + '</span> in scientific notation.', type: 'mc', options: o.options, answer: o.answer,
        hint: 'Small numbers have a negative exponent. Count the places the point moves to get past the first non-zero digit.',
        steps: ['The first non-zero digit is ' + c.charAt(0) + '. Put the point after it: ' + c + '.', 'The point moved ' + -e + ' places to the right.', 'So the exponent is ' + e + ': ' + sci(c, e) + '.'], explain: F(n) + ' = ' + sci(c, e) + '.' };
    } },
    { id: 'bs-prefix', name: 'Metric prefixes', code: 'E2.1', gen: function (lv) {
      var units = ['m', 'g', 'W', 'B'], u = R.pick(units), list = PRE.filter(function (p) { return Math.abs(p[2]) <= (lv === 1 ? 6 : 12); });
      var a = R.pick(list), b;
      do { b = R.pick(list); } while (b === a || Math.abs(a[2] - b[2]) > (lv === 1 ? 3 : lv === 2 ? 6 : 9));
      if (u === 'B') { list = PRE.slice(0, 5); a = R.pick(list); do { b = R.pick(list); } while (b === a); }
      var v = lv === 1 ? String(R.int(2, 9)) : lv === 2 ? String(R.int(15, 95) / 10) : String(R.int(101, 999) / 100);
      var res = shift(v, a[2] - b[2]), ua = (a[1] || '') + u, ub = (b[1] || '') + u, k = a[2] - b[2];
      return { q: 'Convert <span class="math">' + v + ' ' + ua + '</span> to <b>' + ub + '</b>.', type: 'num', answer: parseFloat(res), show: F(res) + ' ' + ub, unit: ub,
        hint: a[0] + ' is 10<sup>' + A.neg(a[2]) + '</sup> and ' + b[0] + ' is 10<sup>' + A.neg(b[2]) + '</sup>. ' + (k > 0 ? 'You are going to a smaller unit, so the number gets bigger.' : 'You are going to a bigger unit, so the number gets smaller.'),
        steps: ['Find the gap between the exponents: ' + A.neg(a[2]) + ' and ' + A.neg(b[2]) + ' are ' + Math.abs(k) + ' apart.', 'So 1 ' + ua + ' = ' + F(std('1', k)) + ' ' + ub + '.', (k > 0 ? 'Multiply' : 'Divide') + ' by ' + F(std('1', Math.abs(k))) + ': ' + v + ' ' + ua + ' = ' + F(res) + ' ' + ub + '.'],
        explain: '1 ' + ua + ' = ' + F(std('1', k)) + ' ' + ub + ', so ' + v + ' ' + ua + ' = ' + F(res) + ' ' + ub + '.' };
    } },
    { id: 'bs-compare', name: 'Compare and order', code: 'B1.1', gen: function (lv) {
      var p = [], i, n = lv === 3 ? 4 : 2, sgn = lv === 1 ? 1 : R.pick([1, -1]);
      while (p.length < n) {
        var e = sgn * R.int(lv === 1 ? 2 : 3, 8), c = String(R.int(11, 99) / 10);
        if (lv > 1 && p.length) e = R.pick([p[0].e, p[0].e + 1, p[0].e - 1]);
        var key = c + '|' + e, v = parseFloat(std(c, e));
        if (p.some(function (x) { return x.v === v; })) continue;
        p.push({ a: c, e: e, v: v });
      }
      if (lv < 3) {
        var big = p[0].v > p[1].v ? 0 : 1, ask = R.pick(['bigger', 'smaller']), ans = ask === 'bigger' ? big : 1 - big;
        var opts = p.map(function (x) { return sci(x.a, x.e); });
        return { q: 'Which number is <b>' + ask + '</b>?', type: 'mc', options: opts, answer: ans, fig: compareLine(p.map(function (x) { return { a: +x.a, e: x.e, t: '' }; })),
          hint: p[0].e === p[1].e ? 'The exponents match, so compare the first parts.' : 'Compare the exponents first. The bigger exponent means the bigger number.',
          steps: ['Exponents: ' + A.neg(p[0].e) + ' and ' + A.neg(p[1].e) + '.', p[0].e === p[1].e ? 'They are equal, so compare ' + p[0].a + ' and ' + p[1].a + '.' : 'The bigger exponent is ' + A.neg(Math.max(p[0].e, p[1].e)) + '.', 'In standard form: ' + F(std(p[0].a, p[0].e)) + ' and ' + F(std(p[1].a, p[1].e)) + '.'],
          explain: sci(p[ans].a, p[ans].e) + ' = ' + F(std(p[ans].a, p[ans].e)) + ' is ' + ask + '.' };
      }
      var sorted = p.slice().sort(function (x, y) { return x.v - y.v; }), right = sorted.map(function (x) { return sci(x.a, x.e); }).join(', ');
      var w1 = p.slice().sort(function (x, y) { return x.e - y.e || 0; }).map(function (x) { return sci(x.a, x.e); }).join(', ');
      var w2 = p.slice().sort(function (x, y) { return +x.a - +y.a; }).map(function (x) { return sci(x.a, x.e); }).join(', ');
      var w3 = sorted.slice().reverse().map(function (x) { return sci(x.a, x.e); }).join(', ');
      var o = R.mc(right, [w2, w3, w1, R.shuffle(sorted).map(function (x) { return sci(x.a, x.e); }).join(', ')]);
      return { q: 'Put these in order from <b>least to greatest</b>: ' + R.shuffle(p).map(function (x) { return sci(x.a, x.e); }).join('; '), type: 'mc', options: o.options, answer: o.answer,
        hint: 'Sort by exponent first. Only use the first parts to break a tie.', steps: ['Group by exponent, smallest exponent first.', 'Inside a group with the same exponent, the smaller first part comes first.', 'Order: ' + right + '.'],
        explain: 'In standard form: ' + sorted.map(function (x) { return F(std(x.a, x.e)); }).join(' &lt; ') + '.' };
    } }
  ];

  /* ---------------- chapter quiz ---------------- */
  var quiz = [
    { q: 'What is 10<sup>6</sup> in standard form?', type: 'mc', options: ['60', '100 000', '1 000 000', '10 000 000'], answer: 2,
      hint: 'Count six zeros after the 1.', explain: '10<sup>6</sup> = 10 &times; 10 &times; 10 &times; 10 &times; 10 &times; 10 = 1 000 000, one million.' },
    { q: 'Work out 0.075 &times; 1000.', type: 'num', answer: 75,
      hint: '&times; 1000 moves every digit 3 places left.', explain: 'The 7 moves from hundredths to tens and the 5 from thousandths to ones: 75.' },
    { q: 'Work out 6.2 &divide; 100.', type: 'num', answer: 0.062,
      hint: '&divide; 100 moves every digit 2 places right. Fill empty places with 0.', explain: 'The 6 moves to hundredths and the 2 to thousandths: 0.062.' },
    { q: 'Light travels about 300 000 000 m in one second. Which is this in scientific notation?', type: 'mc', options: ['3 &times; 10<sup>8</sup>', '3 &times; 10<sup>9</sup>', '30 &times; 10<sup>7</sup>', '3 &times; 10<sup>&minus;8</sup>'], answer: 0,
      hint: 'The first part must be from 1 to less than 10. Count the zeros after the 3.', explain: 'There are 8 zeros after the 3, so 300 000 000 = 3 &times; 10<sup>8</sup>. 30 &times; 10<sup>7</sup> has the same value but is not in scientific notation.' },
    { q: 'A red blood cell is about 8 &times; 10<sup>&minus;6</sup> m across. Write this in standard form.', type: 'num', answer: 0.000008, unit: 'm',
      hint: 'The exponent is &minus;6, so move the point 6 places left.', explain: '8 &times; 10<sup>&minus;6</sup> = 0.000 008 m. That is 8 micrometres.' },
    { q: 'A video file is 2.5 GB. How many MB is it?', type: 'num', answer: 2500, unit: 'MB',
      hint: '1 GB = 1000 MB. Going to a smaller unit, the number gets bigger.', explain: '2.5 &times; 1000 = 2500 MB.' },
    { q: 'Which list is in order from least to greatest?', type: 'mc', answer: 1,
      options: ['5 &times; 10<sup>&minus;2</sup>, 3 &times; 10<sup>&minus;4</sup>, 9 &times; 10<sup>1</sup>', '3 &times; 10<sup>&minus;4</sup>, 5 &times; 10<sup>&minus;2</sup>, 9 &times; 10<sup>1</sup>', '9 &times; 10<sup>1</sup>, 5 &times; 10<sup>&minus;2</sup>, 3 &times; 10<sup>&minus;4</sup>', '3 &times; 10<sup>&minus;4</sup>, 9 &times; 10<sup>1</sup>, 5 &times; 10<sup>&minus;2</sup>'],
      hint: 'Sort by exponent: &minus;4 is the smallest, then &minus;2, then 1.', explain: 'In standard form: 0.0003 &lt; 0.05 &lt; 90.' }
  ];

  A.register('big-small', {
    fx: { shift: shift, F: F, std: std, sci: sci, toSci: toSci, ladder: ladder, places: places, slide: slide, anatomy: anatomy, hops: hops, prefixStairs: prefixStairs, strip: strip, compareLine: compareLine, supE: supE, coef: coef },
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      /* place slider */
      A.bind(root, ['shn', 'sho'], function () {
        var raw = $('#shn').value.replace(/\s/g, ''), k = +$('#sho').value, ok = /^\d{1,5}(\.\d{1,4})?$/.test(raw);
        if (!ok) { $('#shfig').innerHTML = ''; $('#shout').innerHTML = 'Type a number with up to 5 digits before the point and up to 4 after, like 25.6.'; return; }
        raw = shift(raw, 0);
        var res = shift(raw, k), fits = parseFloat(res) < 100000 && (res.split('.')[1] || '').length <= 4 && raw !== '0';
        $('#shfig').innerHTML = fits ? slide(raw, k) : '';
        $('#shout').innerHTML = '<span class="big">' + F(raw) + ' ' + (k > 0 ? '&times; ' : '&divide; ') + F(std('1', Math.abs(k))) + ' = ' + F(res) + '</span><br>Every digit moves ' + Math.abs(k) + ' place' + (Math.abs(k) > 1 ? 's' : '') + ' to the ' + (k > 0 ? 'left' : 'right') + '.' + (fits ? '' : ' <span class="t2">(Too wide for the chart, so only the answer is shown.)</span>');
      });
      /* size builder */
      A.bind(root, ['sca', 'sce'], function () {
        var a = (+$('#sca').value / 10).toFixed(1), e = +$('#sce').value, st = strip(+a, e);
        $('#scao').textContent = a; $('#sceo').textContent = e < 0 ? '−' + -e : e;
        $('#scfig').innerHTML = st.svg;
        $('#scout').innerHTML = '<span class="big">' + sci(a, e) + ' m = ' + F(std(a, e)) + ' m</span><br>Close to: ' + st.near + '.' +
          (e < 0 ? '<br>The exponent is negative, so the point moves ' + -e + ' place' + (e < -1 ? 's' : '') + ' left.' : e > 0 ? '<br>The point moves ' + e + ' place' + (e > 1 ? 's' : '') + ' right.' : '<br>10<sup>0</sup> = 1, so the number stays the same.');
      });
      /* prefix converter */
      var opts = PRE.map(function (p) { return '<option value="' + p[2] + '">' + p[0] + (p[1] ? ' (' + p[1].replace('&micro;', 'µ') + ')' : '') + '</option>'; }).join('');
      $('#pcf').innerHTML = opts; $('#pct').innerHTML = opts;
      $('#pcf').value = '9'; $('#pct').value = '6'; $('#pcu').value = 'B';
      A.bind(root, ['pcv', 'pcf', 'pct', 'pcu'], function () {
        var raw = $('#pcv').value.replace(/\s/g, ''), f = +$('#pcf').value, t = +$('#pct').value, u = $('#pcu').value;
        var pf = PRE.filter(function (p) { return p[2] === f; })[0], pt = PRE.filter(function (p) { return p[2] === t; })[0];
        if (!/^\d{1,6}(\.\d{1,6})?$/.test(raw)) { $('#pcout').innerHTML = 'Type an amount, like 3 or 2.5.'; return; }
        var k = f - t, res = shift(raw, k), ua = pf[1] + u, ub = pt[1] + u;
        $('#pcout').innerHTML = '<span class="big">' + F(shift(raw, 0)) + ' ' + ua + ' = ' + F(res) + ' ' + ub + '</span><br>' +
          (k === 0 ? 'Same unit, so nothing changes.' : '1 ' + ua + ' = ' + F(std('1', k)) + ' ' + ub + '. ' + (k > 0 ? 'Smaller unit, so the number gets bigger: multiply by ' : 'Bigger unit, so the number gets smaller: divide by ') + F(std('1', Math.abs(k))) + '.') +
          (u === 'B' && (f < 0 || t < 0) ? '<br><span class="t2">Note: nobody uses bytes smaller than one byte. This one is just for practice.</span>' : '');
      });
    }
  });

  /* ---------- question shapes (more ways to ask each skill; checks in tests/verify/grade8.js) ---------- */
  var K = window.K8;
  /* powers written with superscript characters, so they read the same in answers and reveals */
  var SUP = { '-': '\u207b', 0: '\u2070', 1: '\u00b9', 2: '\u00b2', 3: '\u00b3', 4: '\u2074', 5: '\u2075', 6: '\u2076', 7: '\u2077', 8: '\u2078', 9: '\u2079' };
  function supU(e) { return '10' + String(e).split('').map(function (c) { return SUP[c]; }).join(''); }
  function sciU(a, e) { return a + ' &times; ' + supU(e); }
  function exps(n, a, b) { var out = []; while (out.length < n) { var e = R.int(a, b); if (out.indexOf(e) < 0) out.push(e); } return out; }
  function sciTrio(sign) {
    var out = [], seen = {};
    while (out.length < 3) { var c = String(R.int(11, 99) / 10), e = sign * R.int(2, 7), v = c + '|' + e; if (!seen[parseFloat(std(c, e))]) { seen[parseFloat(std(c, e))] = 1; out.push({ a: c, e: e, v: parseFloat(std(c, e)) }); } }
    return out;
  }
  var STORY_BIG = [['The CN Tower gets about', 'visitors a year'], ['A maple syrup farm in Quebec taps about', 'litres of sap a year'], ['A city library lends out about', 'books a year'], ['A hydro dam makes about', 'kilowatt-hours a day']];
  var STORY_SMALL = [['A grain of pollen is about', 'm wide'], ['A raindrop has a mass of about', 'kg'], ['A strand of spider silk is about', 'm thick'], ['A dust speck has a mass of about', 'g']];
  var SHAPES = {
    'bs-pow': [
      [1, 'match', function (lv) {
        var es = exps(3, lv === 1 ? 1 : -4, 6);
        return { q: 'Match each power of ten to its value.', type: 'match', pairs: es.map(function (e) { return [supU(e), F(std('1', e))]; }),
          hint: 'A positive exponent counts zeros after the 1. A negative one counts places after the point.', steps: ['For example, ' + supU(es[0]) + ' = ' + F(std('1', es[0])) + '.'], explain: es.map(function (e) { return supU(e) + ' = ' + F(std('1', e)); }).join(', ') + '.', meta: { k: 'bp-match' } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), e = R.int(2, 6), truth = R.int(0, 1), said = truth ? Math.pow(10, e) : 10 * e;
        return K.tf({ q: who + ' says <span class="math">' + supU(e) + ' = ' + F(String(said)) + '</span>. True or false?', truth: truth,
          right: supU(e) + ' means ' + e + ' tens multiplied together, which is ' + F(std('1', e)) + '.', wrong: [supU(e) + ' means 10 &times; ' + e + '.', supU(e) + ' means 10 + ' + e + '.'],
          hint: 'The exponent says how many tens to multiply.', meta: { k: 'bp-tf', e: e, said: said } });
      }],
      [1, 'order', function (lv) {
        var es = exps(lv === 1 ? 3 : 4, lv === 1 ? 1 : -5, 7).sort(function (a, b) { return a - b; });
        return { q: 'Put these in order, least to greatest.', type: 'order', items: es.map(supU), first: 'least', last: 'greatest',
          hint: 'The bigger the exponent, the bigger the number. Negative exponents give numbers less than 1.', steps: es.map(function (e) { return supU(e) + ' = ' + F(std('1', e)); }), explain: es.map(supU).join(' &lt; ') + '.', meta: { k: 'bp-order' } };
      }],
      [2, 'pick', function (lv) {
        return K.until(function () {
          var es = exps(5, -6, 6);
          return K.pickAll({ q: 'Pick every number that is <b>less than 1</b>.', opts: es.map(function (e) { return [supU(e), e < 0]; }), hint: 'Which exponents make a number smaller than 1?', steps: ['10<sup>0</sup> = 1. Negative exponents give numbers less than 1.'], explain: 'The ones with a negative exponent are less than 1.', meta: { k: 'bp-pick' } });
        });
      }]
    ],
    'bs-shift': [
      [1, 'match', function (lv) {
        var n = String(lv === 1 ? R.int(2, 99) : R.int(11, 999) / 10), ks = R.shuffle([1, 2, 3]);
        return { q: 'Match each one to its answer.', type: 'match', pairs: ks.map(function (k) { return [F(n) + ' &times; ' + std('1', k), F(shift(n, k))]; }),
          hint: 'Each zero moves the digits one place left.', steps: ['&times; 10: one place. &times; 100: two places. &times; 1000: three places.'], explain: ks.map(function (k) { return F(n) + ' &times; ' + std('1', k) + ' = ' + F(shift(n, k)); }).join('. ') + '.', meta: { k: 'bh-match' } };
      }],
      [1, 'story', function (lv) {
        var who = K.name(), k = R.pick([1, 2, 3]), c = R.pick([['pencils', 'box', 'boxes'], ['granola bars', 'case', 'cases'], ['stickers', 'sheet', 'sheets']]), n = R.int(2, 48);
        return { q: who + ' orders <b>' + std('1', k) + ' ' + c[2] + '</b> of ' + c[0] + ' for the school. Each ' + c[1] + ' has <b>' + n + '</b>. How many ' + c[0] + ' is that?', type: 'num', answer: n * Math.pow(10, k), show: F(shift(String(n), k)),
          hint: 'Multiply ' + n + ' by ' + std('1', k) + '.', steps: [n + ' &times; ' + std('1', k) + ': move the digits ' + k + ' place' + (k > 1 ? 's' : '') + ' left.', 'That is ' + F(shift(String(n), k)) + ' ' + c[0] + '.'], explain: n + ' &times; ' + std('1', k) + ' = ' + F(shift(String(n), k)) + '.', meta: { k: 'bh-story', n: n, k2: k } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), n = String((R.int(1, 9) * 10 + R.int(1, 9)) / 10), k = R.pick([2, 3]), truth = R.int(0, 1), said = truth ? F(shift(n, k)) : n + std('1', k).slice(1);
        return K.tf({ q: who + ' says <span class="math">' + n + ' &times; ' + std('1', k) + ' = ' + said + '</span>. True or false?', truth: truth,
          right: 'Every digit moves ' + k + ' places left, so ' + n + ' &times; ' + std('1', k) + ' = ' + F(shift(n, k)) + '.', wrong: ['To multiply by ' + std('1', k) + ', just write ' + (k === 2 ? 'two' : 'three') + ' zeros on the end.', 'Multiplying a decimal by ' + std('1', k) + ' does not change it.'],
          hint: 'Adding zeros after a decimal does not change its value.', meta: { k: 'bh-tf', n: +n, k2: k, said: said } });
      }],
      [2, 'fill', function (lv) {
        var n = String(R.int(11, 999) / 10), k = R.pick([1, 2, 3]);
        return { q: 'What number goes in the blank?', type: 'fill', fill: '<span class="math">' + F(n) + ' &divide; [[]] = ' + F(shift(n, -k)) + '</span>', answers: [Math.pow(10, k)],
          hint: 'How many places did the digits move to the right?', steps: ['The digits moved ' + k + ' place' + (k > 1 ? 's' : '') + ' right.', 'So it was divided by ' + std('1', k) + '.'], explain: F(n) + ' &divide; ' + std('1', k) + ' = ' + F(shift(n, -k)) + '.', meta: { k: 'bh-fill', n: +n, r: +shift(n, -k) } };
      }]
    ],
    'bs-sci-big': [
      [1, 'tap', function (lv) {
        var c = coef(2), e = R.int(3, 8), t = [sciU(c, e), sciU(shift(c, 1), e - 1), sciU(shift(c, -1), e + 1)], tiles = R.shuffle(t);
        return { q: 'These all show ' + F(std(c, e)) + '. Tap the one written in proper <b>scientific notation</b>.', type: 'tap', tiles: tiles, answer: tiles.indexOf(t[0]), answerText: t[0],
          hint: 'The first part must be at least 1 and less than 10.', steps: [c + ' is between 1 and 10, so ' + t[0] + ' is in scientific notation.'], explain: F(std(c, e)) + ' = ' + t[0] + '.', meta: { k: 'bb-tap' } };
      }],
      [1, 'story', function (lv) {
        var s = R.pick(STORY_BIG), c = coef(2), e = R.int(4, 8), num = std(c, e);
        return { q: s[0] + ' <b>' + F(num) + '</b> ' + s[1] + '. Write it in scientific notation.', type: 'fill', fill: '<span class="math">' + c + ' &times; 10<sup>[[]]</sup></span>', answers: [e],
          hint: 'Count how many places the point moves to sit after the first digit.', steps: ['Put the point after the first digit: ' + c + '.', 'It moved ' + e + ' places, so the exponent is ' + e + '.'], explain: F(num) + ' = ' + sciU(c, e) + '.', meta: { k: 'bb-story', c: +c, n: +num } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), c = coef(2), e = R.int(4, 8), num = std(c, e), truth = R.int(0, 1), se = truth ? e : e + R.pick([-1, 1]);
        return K.tf({ q: who + ' says <span class="math">' + F(num) + ' = </span>' + sciU(c, se) + '. True or false?', truth: truth,
          right: 'From ' + c + ', the point moves ' + e + ' places to give ' + F(num) + ', so it is ' + sciU(c, e) + '.', wrong: ['The exponent is the number of digits in the number.', 'The exponent is the number of zeros at the end.'],
          hint: 'Count the places the point moves, not the digits.', meta: { k: 'bb-tf', c: +c, e: se, n: +num } });
      }],
      [2, 'match', function (lv) {
        var list = sciTrio(1);
        return { q: 'Match each number to its scientific notation.', type: 'match', pairs: list.map(function (x) { return [F(std(x.a, x.e)), sciU(x.a, x.e)]; }),
          hint: 'Count the places after the first digit.', steps: ['The exponent is how many places the point moves.'], explain: list.map(function (x) { return F(std(x.a, x.e)) + ' = ' + sciU(x.a, x.e); }).join('. ') + '.', meta: { k: 'bb-match' } };
      }]
    ],
    'bs-sci-small': [
      [1, 'tap', function (lv) {
        var c = coef(2), e = -R.int(2, 6), t = [sciU(c, e), sciU(shift(c, 1), e - 1), sciU(shift(c, -1), e + 1)], tiles = R.shuffle(t);
        return { q: 'These all show ' + F(std(c, e)) + '. Tap the one written in proper <b>scientific notation</b>.', type: 'tap', tiles: tiles, answer: tiles.indexOf(t[0]), answerText: t[0],
          hint: 'The first part must be at least 1 and less than 10.', steps: [c + ' is between 1 and 10, so ' + t[0] + ' is in scientific notation.'], explain: F(std(c, e)) + ' = ' + t[0] + '.', meta: { k: 'bb-tap' } };
      }],
      [1, 'story', function (lv) {
        var s = R.pick(STORY_SMALL), c = String(R.int(1, 9)), e = -R.int(3, 6), num = std(c, e);
        return { q: s[0] + ' <b>' + F(num) + '</b> ' + s[1] + '. Write it in scientific notation.', type: 'fill', fill: '<span class="math">' + c + ' &times; 10<sup>[[]]</sup></span>', answers: [e],
          hint: 'The number is less than 1, so the exponent is negative. Count the hops to get past the ' + c + '.', steps: ['The point hops ' + -e + ' places right to sit after the ' + c + '.', 'Right means negative: the exponent is ' + e + '.'], explain: F(num) + ' = ' + sciU(c, e) + '.', meta: { k: 'bb-story', c: +c, n: +num } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), c = coef(2), e = -R.int(2, 6), num = std(c, e), truth = R.int(0, 1), se = truth ? e : -e;
        return K.tf({ q: who + ' says <span class="math">' + F(num) + ' = </span>' + sciU(c, se) + '. True or false?', truth: truth,
          right: F(num) + ' is less than 1, so the exponent is negative: ' + sciU(c, e) + '.', wrong: ['Exponents are always positive.', 'The exponent counts the zeros after the point, so it is positive.'],
          hint: 'Is ' + F(num) + ' bigger or smaller than 1?', meta: { k: 'bb-tf', c: +c, e: se, n: +num } });
      }],
      [2, 'match', function (lv) {
        var list = sciTrio(-1);
        return { q: 'Match each number to its scientific notation.', type: 'match', pairs: list.map(function (x) { return [F(std(x.a, x.e)), sciU(x.a, x.e)]; }),
          hint: 'Count the hops to get past the first non-zero digit.', steps: ['Small numbers have negative exponents.'], explain: list.map(function (x) { return F(std(x.a, x.e)) + ' = ' + sciU(x.a, x.e); }).join('. ') + '.', meta: { k: 'bb-match' } };
      }]
    ],
    'bs-prefix': [
      [1, 'match', function (lv) {
        var list = R.shuffle(PRE.filter(function (p) { return p[2] !== 0 && Math.abs(p[2]) <= (lv === 1 ? 6 : 12); })).slice(0, 3);
        return { q: 'Match each prefix to its power of ten.', type: 'match', pairs: list.map(function (p) { return [p[0] + ' (' + p[1] + ')', supU(p[2])]; }),
          hint: 'Big prefixes: kilo, mega, giga, tera. Small ones: milli, micro, nano, pico.', steps: ['Each step on the prefix stairs is 3 powers of ten.'], explain: list.map(function (p) { return p[0] + ' = ' + supU(p[2]); }).join(', ') + '.', meta: { k: 'bx-match' } };
      }],
      [1, 'order', function (lv) {
        var u = R.pick(['m', 'g', 'W']), list = R.shuffle(PRE.filter(function (p) { return Math.abs(p[2]) <= (lv === 1 ? 6 : 12); })).slice(0, lv === 1 ? 3 : 4).sort(function (a, b) { return a[2] - b[2]; });
        return { q: 'Put these units in order, smallest to largest.', type: 'order', items: list.map(function (p) { return '1 ' + p[1] + u; }), first: 'smallest', last: 'largest',
          hint: 'Use the prefix stairs: pico, nano, micro, milli, base, kilo, mega, giga, tera.', steps: list.map(function (p) { return '1 ' + p[1] + u + ' = ' + supU(p[2]) + ' ' + u; }), explain: list.map(function (p) { return p[1] + u; }).join(' &lt; ') + '.', meta: { k: 'bx-order' } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), u = R.pick(['m', 'g']), big = R.pick(PRE.filter(function (p) { return p[2] === 3 || p[2] === 6; })), truth = R.int(0, 1), said = truth ? Math.pow(10, big[2]) : Math.pow(10, big[2] - 1);
        return K.tf({ q: who + ' says <span class="math">1 ' + big[1] + u + ' = ' + F(String(said)) + ' ' + u + '</span>. True or false?', truth: truth,
          right: big[0] + ' means 10<sup>' + big[2] + '</sup>, so 1 ' + big[1] + u + ' = ' + F(String(Math.pow(10, big[2]))) + ' ' + u + '.', wrong: [big[0] + ' always means 100.', 'Each prefix is 10 times the one before.'],
          hint: 'What power of ten does ' + big[0] + ' stand for?', meta: { k: 'bx-tf', from: big[1] + u, to: u, said: said } });
      }],
      [2, 'story', function (lv) {
        var who = K.name(), g = R.pick([32, 64, 128, 256]);
        return { q: who + '\'s phone has <b>' + g + ' GB</b> of storage. How many <b>MB</b> is that?', type: 'num', answer: g * 1000, show: F(String(g * 1000)), unit: 'MB',
          hint: 'Giga is 10<sup>9</sup> and mega is 10<sup>6</sup>: 3 steps apart.', steps: ['1 GB = 1000 MB.', g + ' &times; 1000 = ' + F(String(g * 1000)) + ' MB.'], explain: g + ' GB = ' + F(String(g * 1000)) + ' MB.', meta: { k: 'bx-story', from: 'GB', to: 'MB', v: g } };
      }]
    ],
    'bs-compare': [
      [1, 'tap', function (lv) {
        var list = sciTrio(lv === 1 ? 1 : R.pick([1, -1])), big = list.slice().sort(function (a, b) { return b.v - a.v; })[0], tiles = list.map(function (x) { return sciU(x.a, x.e); });
        return { q: 'Tap the <b>biggest</b> number.', type: 'tap', tiles: tiles, answer: list.indexOf(big), answerText: sciU(big.a, big.e),
          hint: 'Compare the exponents first.', steps: ['The biggest exponent wins. If two match, compare the first parts.'], explain: sciU(big.a, big.e) + ' = ' + F(std(big.a, big.e)) + ' is the biggest.', meta: { k: 'bc-tap' } };
      }],
      [1, 'order', function (lv) {
        var list = sciTrio(lv === 1 ? 1 : R.pick([1, -1])).sort(function (a, b) { return a.v - b.v; });
        return { q: 'Put these in order, least to greatest.', type: 'order', items: list.map(function (x) { return sciU(x.a, x.e); }), first: 'least', last: 'greatest',
          hint: 'Sort by exponent first. Use the first parts only to break a tie.', steps: list.map(function (x) { return sciU(x.a, x.e) + ' = ' + F(std(x.a, x.e)); }), explain: 'In order: ' + list.map(function (x) { return F(std(x.a, x.e)); }).join(' &lt; ') + '.', meta: { k: 'bc-order' } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), e = R.int(3, 7), a = String(R.int(51, 99) / 10), b = String(R.int(11, 49) / 10), truth = R.int(0, 1);
        var x = { a: a, e: e }, y = { a: b, e: truth ? e : e + 1 };
        return K.tf({ q: who + ' says ' + sciU(x.a, x.e) + ' is bigger than ' + sciU(y.a, y.e) + ', because ' + a + ' is bigger than ' + b + '. True or false?', truth: truth,
          right: truth ? 'The exponents are the same, so compare the first parts: ' + a + ' &gt; ' + b + '.' : 'Compare the exponents first. ' + sciU(y.a, y.e) + ' = ' + F(std(y.a, y.e)) + ' is bigger than ' + F(std(x.a, x.e)) + '.',
          wrong: ['The bigger first part always means the bigger number.', 'They are equal because both are in scientific notation.'],
          hint: 'Write both in standard form.', meta: { k: 'bc-tf', a: +x.a, e: x.e, b: +y.a, f: y.e } });
      }]
    ]
  };
  Atlas.Q.shapes('big-small', SHAPES);
})();
