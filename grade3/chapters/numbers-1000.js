(function () {
  var A = Atlas, R = A.R;
  var ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function words(n) {
    if (n === 1000) return 'one thousand';
    if (n === 0) return 'zero';
    var s = '';
    if (n >= 100) { s += ones[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
    if (n >= 20) { s += tens[Math.floor(n / 10)]; if (n % 10) s += '-' + ones[n % 10]; }
    else if (n > 0) s += ones[n];
    return s;
  }
  var heads = ['Ones', 'Tens', 'Hundreds', 'Thousands'];
  var uid = 0;
  function mid(base) { uid++; return base + uid; }
  function plural(k, p) { return k + ' ' + (k === 1 ? A.PLACE1[p] : A.PLACES[p]); }
  function digitsOf(n) { return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000)]; }

  /* a tiny picture of d blocks of one place, for inside a chart column */
  function mini(d, p) {
    if (!d) return '';
    var s = '', col = A.pc(p), i;
    if (p === 3) s = A.draw.prism(6, 36, 26, 22, 26, 3, 3, 3, 3);
    else if (p === 2) for (i = 0; i < d; i++) s += '<rect x="' + (2 + (i % 3) * 13) + '" y="' + (2 + Math.floor(i / 3) * 13) + '" width="11" height="11" rx="1" style="fill:' + col + '" stroke="rgba(0,0,0,.45)"/>';
    else if (p === 1) for (i = 0; i < d; i++) s += '<rect x="' + (1 + i * 4.3) + '" y="2" width="3.4" height="36" style="fill:' + col + '" stroke="rgba(0,0,0,.45)" stroke-width=".8"/>';
    else for (i = 0; i < d; i++) s += '<rect x="' + (5 + (i % 3) * 11) + '" y="' + (5 + Math.floor(i / 3) * 11) + '" width="8" height="8" style="fill:' + col + '" stroke="rgba(0,0,0,.45)"/>';
    return A.svg(40, 40, s, plural(d, p));
  }
  /* place value chart: coloured headings, the digit, small blocks, and its value. o.cols, o.hl (column index), o.vals */
  function chart(n, o) {
    o = o || {};
    var s = String(n), cols = o.cols || Math.max(3, s.length);
    while (s.length < cols) s = '0' + s;
    var lead = cols - String(n).length, h = '<div class="pv" style="max-width:' + (cols * 104) + 'px;margin:8px auto">';
    for (var i = 0; i < cols; i++) {
      var p = cols - 1 - i, d = +s.charAt(i), dim = i < lead && !(i === cols - 1);
      h += '<div' + (i === o.hl ? ' class="on"' : '') + '><span class="h c' + p + '"><span class="lg">' + heads[p] + '</span><span class="sm">' + heads[p] + '</span></span><span class="d' + (dim ? ' dim' : '') + '">' + d + '</span>' +
        (o.dots === false ? '' : '<span class="dk">' + (dim ? '' : mini(d, p)) + '</span>') +
        (o.vals ? '<span class="v">' + (dim || !d ? '' : A.fmt(d * Math.pow(10, p))) + '</span>' : '') + '</div>';
    }
    return h + '</div>';
  }
  /* each coloured digit drops down to the value it stands for */
  function expanded(n) {
    var s = String(n), len = s.length, cw = Math.min(130, 520 / len), x0 = 280 - cw * len / 2, id = mid('exa'), out = '';
    out += '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    for (var i = 0; i < len; i++) {
      var p = len - 1 - i, d = +s.charAt(i), cx = x0 + cw * (i + 0.5), val = d * Math.pow(10, p);
      out += '<text x="' + cx + '" y="46" text-anchor="middle" font-size="46" font-weight="800" style="font-family:var(--display);fill:var(--p' + p + ')">' + d + '</text>' +
        '<line x1="' + cx + '" y1="56" x2="' + cx + '" y2="84" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#' + id + ')"/>' +
        '<rect x="' + (cx - cw / 2 + 10) + '" y="90" width="' + (cw - 20) + '" height="38" rx="8" style="fill:' + (d ? 'color-mix(in srgb,var(--p' + p + ') 16%,var(--card))' : 'var(--card)') + ';stroke:var(--p' + p + ')" stroke-width="2.5"' + (d ? '' : ' stroke-dasharray="5 4"') + '/>' +
        '<text x="' + cx + '" y="118" text-anchor="middle" font-size="24" font-weight="700"' + (d ? '' : ' class="t2"') + '>' + A.fmt(val) + '</text>' +
        '<text x="' + cx + '" y="154" text-anchor="middle" font-size="18" class="t2">' + plural(d, p) + '</text>';
      if (i < len - 1) out += '<text x="' + (cx + cw / 2) + '" y="118" text-anchor="middle" font-size="24" font-weight="700">+</text>';
    }
    return A.svg(560, 164, out, A.fmt(n) + ' in expanded form');
  }
  /* a hill over a number line: halfway is the top, and the number rolls to the side it is on */
  function hill(n, p) {
    var lo = Math.floor(n / p) * p, hi = lo + p, t = (n - lo) / p, up = n - lo >= p / 2, id = mid('rha');
    var x = 40 + 480 * t, y = 100 - 150 * t * (1 - t), s = '';
    s += '<path d="M40 100 Q280 -50 520 100" fill="none" style="stroke:var(--line)" stroke-width="10" stroke-linecap="round"/>';
    s += '<line x1="280" y1="25" x2="280" y2="132" style="stroke:var(--ink2)" stroke-dasharray="4 4" stroke-width="1.5"/>';
    s += '<line x1="40" y1="132" x2="520" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var i = 0; i <= 10; i++) {
      var tx = 40 + 48 * i;
      s += '<line x1="' + tx + '" y1="' + (i % 5 ? 126 : 122) + '" x2="' + tx + '" y2="' + (i % 5 ? 138 : 142) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    }
    [[40, lo, 'lower'], [280, lo + p / 2, 'halfway'], [520, hi, 'upper']].forEach(function (k) {
      s += '<text x="' + k[0] + '" y="166" text-anchor="middle" font-size="21" class="tb">' + A.fmt(k[1]) + '</text><text x="' + k[0] + '" y="186" text-anchor="middle" class="t2" font-size="16">' + k[2] + '</text>';
    });
    if (n !== lo) {
      var ex = up ? 500 : 60;
      s += '<path d="M' + x + ' ' + (y - 16) + ' Q' + ((x + ex) / 2) + ' ' + (Math.min(y, 80) - 30) + ' ' + ex + ' 86" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#' + id + ')"/>';
    }
    s = '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>' + s;
    s += '<circle cx="' + (n === lo ? 40 : up ? 520 : 40) + '" cy="132" r="11" style="fill:none;stroke:var(--accent)" stroke-width="4"/>';
    s += '<circle cx="' + x + '" cy="' + (y - 9) + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + Math.min(Math.max(x, 60), 500) + '" y="' + (y - 26) + '" text-anchor="middle" font-size="21" class="tb">' + A.fmt(n) + '</text>';
    return A.svg(560, 194, s, A.fmt(n) + ' on a hill between ' + lo + ' and ' + hi + '. It rounds to ' + (n === lo ? lo : up ? hi : lo) + '.');
  }
  /* 1 cube, 10 make a rod, 10 rods make a flat, 10 flats make a big cube */
  function stairs() {
    var P = A.draw.prism, s = '', u = 8, base = 150, id = mid('sta');
    s += '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    function arrow(x1, x2, y) {
      return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#' + id + ')"/>' +
        '<text x="' + ((x1 + x2) / 2) + '" y="' + (y - 8) + '" text-anchor="middle" font-size="18" class="tb">10 make</text>';
    }
    function lab(x, y, a, b, p) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="26" font-weight="800" style="fill:var(--p' + p + ')">' + a + '</text>' +
        '<text x="' + x + '" y="' + (y + 24) + '" text-anchor="middle" font-size="19" class="t2">' + b + '</text>';
    }
    s += P(34, base, u, u, u, 1, 1, 1, 0) + lab(40, base + 30, '1', 'one', 0) + arrow(56, 104, base - 40);
    s += P(120, base, u, u, 10 * u, 1, 1, 10, 1) + lab(126, base + 30, '10', 'ten', 1) + arrow(140, 196, base - 40);
    s += P(206, base, 10 * u, u, 10 * u, 10, 1, 10, 2) + lab(248, base + 30, '100', 'hundred', 2) + arrow(298, 352, base - 40);
    s += P(366, base, 10 * u, 10 * u, 10 * u, 10, 10, 10, 3) + lab(422, base + 30, '1000', 'thousand', 3);
    return A.svg(560, 214, s, 'Base-ten blocks. A small cube is one. 10 cubes make a rod, which is ten. 10 rods make a flat, which is one hundred. 10 flats make a big cube, which is one thousand.');
  }
  /* the blocks for a number, one coloured column per place. c = [ones, tens, hundreds] */
  function columns(c) {
    var B = A.draw.block, s = '', u = 5, colW = [180, 160, 90], x0 = [0, 180, 340], top = 34, maxY = 0;
    for (var q = 2; q >= 0; q--) {
      var x = x0[2 - q], w = colW[2 - q];
      s += '<rect x="' + (x + 2) + '" y="2" width="' + (w - 8) + '" height="26" rx="6" style="fill:var(--p' + q + ')"/>' +
        '<text x="' + (x + 2 + (w - 8) / 2) + '" y="20" text-anchor="middle" font-size="16" font-weight="700" style="fill:' + (q ? '#fff' : '#13203a') + '">' + plural(c[q], q) + '</text>';
      for (var i = 0; i < c[q]; i++) {
        var bx, by;
        if (q === 2) { bx = x + 4 + (i % 3) * 58; by = top + 54 + Math.floor(i / 3) * 59; }
        else if (q === 1) { bx = x + 4 + (i % 10) * 15; by = top + 54 + Math.floor(i / 10) * 60; }
        else { bx = x + 6 + (i % 5) * 15; by = top + 10 + Math.floor(i / 5) * 15; }
        s += B(bx, by, q, u).svg;
        maxY = Math.max(maxY, by);
      }
    }
    return A.svg(430, Math.max(80, maxY + 8), s, plural(c[2], 2) + ', ' + plural(c[1], 1) + ' and ' + plural(c[0], 0));
  }
  /* hops on a number line. vals: the numbers landed on, in order. miss: index shown as a question mark */
  function hops(vals, miss) {
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), x0 = 40, x1 = 520, s = '';
    var X = function (v) { return hi === lo ? 280 : x0 + (x1 - x0) * (v - lo) / (hi - lo); };
    s += '<line x1="' + (x0 - 18) + '" y1="80" x2="' + (x1 + 18) + '" y2="80" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i < vals.length; i++) {
      var x = X(vals[i]);
      s += '<line x1="' + x + '" y1="72" x2="' + x + '" y2="88" style="stroke:var(--ink)" stroke-width="2"/>';
      if (i === miss) s += '<rect x="' + (x - 24) + '" y="94" width="48" height="28" rx="5" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/><text x="' + x + '" y="115" text-anchor="middle" font-size="20" font-weight="800" style="fill:#13203a">?</text>';
      else s += '<text x="' + x + '" y="114" text-anchor="middle" font-size="' + (vals.length > 8 ? 17 : 21) + '" class="tb">' + vals[i] + '</text>';
      if (i) {
        var xa = X(vals[i - 1]), d = vals[i] - vals[i - 1], top = 80 - Math.min(46, Math.abs(x - xa) * 0.55 + 10);
        s += '<path d="M' + xa + ' 76 Q' + ((xa + x) / 2) + ' ' + top + ' ' + x + ' 76" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/>' +
          '<circle cx="' + x + '" cy="80" r="5" style="fill:var(--strand)"/>';
        if (vals.length <= 11) s += '<text x="' + ((xa + x) / 2) + '" y="' + ((top + 76) / 2 - 6) + '" text-anchor="middle" font-size="' + (vals.length > 8 ? 14 : 17) + '" class="t2">' + (d > 0 ? '+' : '&minus;') + Math.abs(d) + '</text>';
      }
    }
    s += '<circle cx="' + X(vals[0]) + '" cy="80" r="6" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 128, s, 'Number line counting ' + vals.map(function (v, i) { return i === miss ? 'a missing number' : v; }).join(', '));
  }
  /* 100 squares, each worth 10, filled up to n */
  function thousand(n) {
    var sz = 26, s = '', full = Math.floor(n / 10), part = (n % 10) / 10;
    for (var i = 0; i < 100; i++) {
      var x = 50 + (i % 10) * sz, y = 6 + Math.floor(i / 10) * sz;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1"/>';
      if (i < full) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (sz - 3) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--p1)"/>';
      else if (i === full && part > 0) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + ((sz - 3) * part).toFixed(1) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--p1);opacity:.55"/>';
    }
    for (var r = 1; r <= 10; r++) s += '<text x="44" y="' + (6 + r * sz - 8) + '" text-anchor="end" font-size="12" class="t2">' + r * 100 + '</text>';
    s += '<rect x="330" y="10" width="20" height="20" rx="2" style="fill:var(--p1)"/><text x="358" y="25" font-size="15">= 10</text>' +
      '<text x="330" y="58" font-size="15">1 row = 100</text><text x="330" y="80" font-size="15">100 squares = 1000</text>';
    return A.svg(480, 270, s, n + ' shown as ' + full + (part ? ' and a part' : '') + ' of 100 squares, each worth 10');
  }
  var icons = {
    cal: '<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="5" y="8" width="34" height="30" rx="4" style="fill:var(--card);stroke:var(--strand)" stroke-width="2.5"/><rect x="5" y="8" width="34" height="9" rx="3" style="fill:var(--strand)"/><g style="fill:var(--strand)"><rect x="11" y="22" width="5" height="5"/><rect x="20" y="22" width="5" height="5"/><rect x="29" y="22" width="5" height="5"/><rect x="11" y="30" width="5" height="5"/><rect x="20" y="30" width="5" height="5"/></g></svg>',
    paper: '<svg viewBox="0 0 44 44" aria-hidden="true"><g style="fill:var(--card);stroke:var(--strand)" stroke-width="2"><rect x="10" y="16" width="26" height="22" rx="2"/><rect x="8" y="12" width="26" height="22" rx="2"/><rect x="6" y="8" width="26" height="22" rx="2"/></g></svg>',
    path: '<svg viewBox="0 0 44 44" aria-hidden="true"><path d="M6 38 C14 30 30 32 24 22 S28 8 38 6" fill="none" style="stroke:var(--strand)" stroke-width="3" stroke-dasharray="4 3"/><circle cx="6" cy="38" r="4" style="fill:var(--hi);stroke:var(--ink)"/><circle cx="38" cy="6" r="4" style="fill:var(--strand)"/></svg>'
  };
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }

  A.register('numbers-1000', {
    html:
'<section class="sec"><h2><span class="n">1</span>Ones, tens and hundreds</h2>' +
'<p>We count things in groups of ten. Ten small cubes make one <b>rod</b>. Ten rods make one <b>flat</b>. Ten flats make one <b>big cube</b>.</p>' +
'<div class="fig">' + stairs() + '</div>' +
'<p>Each place has its own colour. Follow the colour from the blocks to the chart to the digit.</p>' +
'<div class="legend"><span><i style="background:var(--p3)"></i>thousands</span><span><i style="background:var(--p2)"></i>hundreds</span><span><i style="background:var(--p1)"></i>tens</span><span><i style="background:var(--p0)"></i>ones</span></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' +
'<div class="steprow">' +
'<div class="stepper"><span class="sl c2t">Hundreds</span><button type="button" class="btn alt" data-sub="2" aria-label="Take away one hundred">&minus;</button><output id="bh">0</output><button type="button" class="btn alt" data-add="2" aria-label="Add one hundred">+</button></div>' +
'<div class="stepper"><span class="sl c1t">Tens</span><button type="button" class="btn alt" data-sub="1" aria-label="Take away one ten">&minus;</button><output id="bt">0</output><button type="button" class="btn alt" data-add="1" aria-label="Add one ten">+</button></div>' +
'<div class="stepper"><span class="sl c0t">Ones</span><button type="button" class="btn alt" data-sub="0" aria-label="Take away one">&minus;</button><output id="bo">0</output><button type="button" class="btn alt" data-add="0" aria-label="Add one">+</button></div>' +
'</div>' +
'<div class="ctrl"><label for="bn">Or type a number (0 to 1000)<input type="number" id="bn" min="0" max="1000" value="243"></label></div>' +
'<div class="fig" id="bfig"></div><div id="bchart"></div><div class="out" id="bout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>A digit\'s <b>place</b> tells you what it is worth. In 243, the 2 means 2 hundreds, the 4 means 4 tens, and the 3 means 3 ones.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>What number is 5 flats, 0 rods and 7 cubes?</p><div class="fig">' + A.draw.blocks(507, '5 flats and 7 small cubes', 540, 6) + '</div>' +
'<p>5 hundreds, 0 tens, 7 ones. There are no tens, so write 0 in the tens place: <b>507</b>.</p></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Three ways to write a number</h2>' +
'<p>You can write the same number in three ways. Follow each coloured digit down to what it is worth.</p>' +
'<div class="fig">' + expanded(386) + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">Way</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l">Standard form</td><td class="l math">386</td></tr>' +
'<tr><td class="l">Expanded form</td><td class="l math">300 + 80 + 6</td></tr>' +
'<tr><td class="l">Word form</td><td class="l">three hundred eighty-six</td></tr></tbody></table></div>' +
'<p>To <b>decompose</b> a number means to break it into parts. You can trade 1 flat for 10 rods, or 1 rod for 10 cubes. The number stays the same.</p>' +
'<div class="lab"><span class="lt">Try it: trade blocks</span>' +
'<div class="ctrl"><label for="trn">Start number (100 to 999)<input type="number" id="trn" min="100" max="999" value="234"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-tr="2">Trade 1 hundred for 10 tens</button><button type="button" class="btn alt" data-tr="1">Trade 1 ten for 10 ones</button></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-gr="1">Trade 10 tens for 1 hundred</button><button type="button" class="btn alt" data-gr="0">Trade 10 ones for 1 ten</button></div>' +
'<div class="fig" id="trfig"></div><div class="out" id="trout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Leaving out the zero. Three hundred five is <b>305</b>, not 35. The 0 keeps the tens place open, so the 3 stays in the hundreds place.</p>' +
'<div class="fig">' + chart(305, { vals: true, hl: 1 }) + '</div></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Write 400 + 20 + 9 in standard form. 4 hundreds, 2 tens, 9 ones: <b>429</b>.</p></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Skip counting to 1000</h2>' +
'<p>Skip counting means jumping by the same amount each time. Counting by 50s, 100s and 200s gets you to 1000 fast.</p>' +
'<div class="lab"><span class="lt">Try it: jump along the number line</span>' +
'<div class="ctrl"><label for="skb">Count by<select id="skb"><option value="10">10s</option><option value="50" selected>50s</option><option value="100">100s</option><option value="200">200s</option></select></label>' +
'<label for="sks">Start at<input type="number" id="sks" min="0" max="1000" step="10" value="0"></label>' +
'<label for="skd">Direction<select id="skd"><option value="1">Forward</option><option value="-1">Backward</option></select></label></div>' +
'<div class="fig" id="skfig"></div><div class="out" id="skout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>By 100s, only the hundreds digit changes: 300, 400, 500. By 50s, you land on a hundred every second jump: 300, 350, 400, 450.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Count by 200s from 0. Five jumps reach 1000.</p><div class="fig">' + hops([0, 200, 400, 600, 800, 1000]) + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Comparing and ordering</h2>' +
'<p>To compare two numbers, line them up by place. Start at the <b>left</b>, with the hundreds. The first place where the digits are different tells you which number is greater.</p>' +
'<p>The symbol opens toward the greater number. <span class="math">452 &gt; 425</span> means "452 is greater than 425". <span class="math">425 &lt; 452</span> means "425 is less than 452".</p>' +
'<div class="lab"><span class="lt">Try it: compare place by place</span>' +
'<div class="ctrl"><label for="cpa">First number<input type="number" id="cpa" min="0" max="1000" value="452"></label>' +
'<label for="cpb">Second number<input type="number" id="cpb" min="0" max="1000" value="425"></label></div>' +
'<div class="vrow" id="cpblocks"></div><div id="cpchart"></div><div class="fig" id="cpline"></div><div class="out" id="cpout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Looking at the ones first. 601 is greater than 598, even though 1 is less than 8. The hundreds decide first: 6 hundreds is more than 5 hundreds.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Put 318, 381, 138 in order from least to greatest. Compare the hundreds: 1, 3, 3. Then compare the tens of 318 and 381: 1 ten is less than 8 tens.</p><div class="fig" id="ordfig"></div>' +
'<p>Least to greatest: <b>138, 318, 381</b>.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Rounding to the nearest ten or hundred</h2>' +
'<p>Rounding finds a nearby "friendly" number that is easy to use. Picture a hill between two friendly numbers. The top of the hill is halfway. Past the top, the number rolls <b>up</b>. Before the top, it rolls back <b>down</b>. Right on the top, it rolls up.</p>' +
'<div class="lab"><span class="lt">Try it: roll over the hill</span>' +
'<div class="ctrl"><label for="rn">Number (0 to 1000)<input type="number" id="rn" min="0" max="1000" value="267"></label>' +
'<label for="rp">Round to the nearest<select id="rp"><option value="10">ten</option><option value="100" selected>hundred</option></select></label></div>' +
'<div class="fig" id="rline"></div><div class="out" id="rout" aria-live="polite"></div></div>' +
'<p>Without the hill, look at the digit just to the <b>right</b> of the place you round to. 5 or more: round up. Less than 5: round down.</p>' +
'<div class="eg"><b class="t">Watch first</b><p>Round 267 to the nearest hundred. It is between 200 and 300. The tens digit is 6, so round up: <b>300</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Rounding 950 to the nearest hundred and getting 900. 950 is exactly halfway between 900 and 1000, and halfway rounds up, so the answer is <b>1000</b>.</p>' +
'<div class="fig">' + hill(950, 100) + '</div></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>How big is 1000?</h2>' +
'<p>Numbers to 1000 are all around us. They count days, pages, people and steps.</p>' +
'<div class="facts"><div>' + icons.cal + '<span><b>365</b><small>days in a year</small></span></div>' +
'<div>' + icons.paper + '<span><b>500</b><small>sheets in a pack of printer paper</small></span></div>' +
'<div>' + icons.path + '<span><b>1000</b><small>metres in 1 kilometre</small></span></div></div>' +
'<div class="lab"><span class="lt">Try it: fill the thousand grid</span>' +
'<div class="ctrl"><label for="hkp">Pick one<select id="hkp"><option value="365">Days in a year: 365</option><option value="500">Sheets in a pack: 500</option><option value="250">A school with 250 students</option><option value="1000">Metres in a kilometre: 1000</option></select></label>' +
'<label for="hkn">Or type a number (0 to 1000)<input type="number" id="hkn" min="0" max="1000" value="365"></label></div>' +
'<div class="fig" id="hkfig"></div><div class="out" id="hkout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>1000 is 10 hundreds. It is also 100 tens, and 1000 ones.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A year has 365 days. That fills 3 rows of the grid (300) and 6 and a half more squares (65). It is a bit more than one third of 1000.</p></div>' +
'<div class="yt" data-yt="s6"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'What does the 5 in <span class="math">352</span> mean?', options: ['5 ones', '5 tens', '5 hundreds'], answer: 1, why: 'The 5 is the middle digit. The middle place is the tens.' },
        { q: 'What number do these blocks show?', fig: A.draw.blocks(240, '2 flats and 4 rods', 540, 5), options: ['24', '204', '240'], answer: 2, why: '2 flats are 2 hundreds and 4 rods are 4 tens. There are no small cubes, so the ones digit is 0.' },
        { q: 'Do these blocks show 325?', fig: A.draw.blocks(352, '3 flats, 5 rods and 2 small cubes', 540, 5), options: ['Yes', 'No'], answer: 1, why: 'Count the rods. There are 5 rods, which is 5 tens. 325 would have only 2 rods. These blocks show 352.' }
      ],
      s2: [
        { q: 'Write <span class="math">500 + 7</span> in standard form.', options: ['57', '507', '570'], answer: 1, why: '5 hundreds, 0 tens, 7 ones. The 0 holds the tens place.' },
        { q: 'Which is the word form of <span class="math">640</span>?', options: ['six hundred four', 'six hundred forty', 'sixty-four'], answer: 1, why: 'Say the hundreds: six hundred. Then the last two digits, 40: forty.' },
        { q: '1 hundred can be traded for how many tens?', options: ['1', '10', '100'], answer: 1, why: 'A flat is made of 10 rods. Each rod is a ten.' }
      ],
      s3: [
        { q: 'Count by 100s. <span class="math">300, 400, 500, ___</span>', options: ['501', '510', '600'], answer: 2, why: 'Each jump adds 1 hundred. Only the hundreds digit changes.' },
        { q: 'Count by 50s. <span class="math">650, 700, ___</span>', options: ['705', '750', '800'], answer: 1, why: 'Each jump adds 50. 700 + 50 = 750.' },
        { q: 'Count by 200s backward. <span class="math">1000, 800, ___</span>', options: ['600', '700', '780'], answer: 0, why: 'Each jump takes away 200. 800 &minus; 200 = 600.' }
      ],
      s4: [
        { q: 'Which is greater: <span class="math">719</span> or <span class="math">791</span>?', options: ['719', '791'], answer: 1, why: 'The hundreds are the same. Compare the tens: 1 ten and 9 tens.' },
        { q: 'Which symbol goes in the box? <span class="math">406 &#9633; 460</span>', options: ['&lt;', '&gt;', '='], answer: 0, why: 'Same hundreds. Compare the tens: 0 tens is less than 6 tens. The symbol opens toward the greater number.' },
        { q: 'Which number is the least?', options: ['299', '302', '290'], answer: 2, why: 'Compare the hundreds first. 302 has 3 hundreds, so it is not least. Then compare 299 and 290 by the ones.' }
      ],
      s5: [
        { q: 'Round <span class="math">74</span> to the nearest ten.', options: ['70', '75', '80'], answer: 0, why: '74 is between 70 and 80. The ones digit is 4, which is less than 5.' },
        { q: 'Round <span class="math">451</span> to the nearest hundred.', options: ['400', '450', '500'], answer: 2, why: '451 is between 400 and 500. Look at the tens digit. It is 5, and 5 or more rounds up.' },
        { q: 'Round <span class="math">995</span> to the nearest ten.', options: ['990', '1000', '900'], answer: 1, why: '995 is between 990 and 1000. The ones digit is 5, so round up.' }
      ],
      s6: [
        { q: 'How many hundreds make 1000?', options: ['10', '100', '1000'], answer: 0, why: '10 flats make the big cube. Each flat is a hundred.' },
        { q: 'How many tens make 1000?', options: ['10', '100', '1000'], answer: 1, why: 'Each square on the grid is a ten, and there are 100 squares.' },
        { q: 'Which is closer to 1000?', options: ['365', '900'], answer: 1, why: '900 needs only 100 more to reach 1000. 365 needs 635 more.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      /* section 1: build a number. c = [ones, tens, hundreds, thousands] */
      var c = digitsOf(243), msg = '';
      function total() { return c[0] + c[1] * 10 + c[2] * 100 + c[3] * 1000; }
      function build() {
        var n = total();
        $('#bh', root).textContent = c[2]; $('#bt', root).textContent = c[1]; $('#bo', root).textContent = c[0];
        $('#bn', root).value = n;
        $('#bfig', root).innerHTML = A.draw.blocks(n, 'Base-ten blocks showing ' + n, 540, 6);
        $('#bchart', root).innerHTML = chart(n, { cols: n === 1000 ? 4 : 3, vals: true });
        var parts = [];
        for (var p = 3; p >= 0; p--) if (c[p]) parts.push('<b class="c' + p + 't">' + c[p] * Math.pow(10, p) + '</b>');
        $('#bout', root).innerHTML = '<p><span class="big">' + n + '</span> &nbsp;' + words(n) + '</p><p><b>Expanded form:</b> <span class="math">' + (parts.join(' + ') || '0') + '</span></p>' + (msg ? '<p class="lvmsg">' + msg + '</p>' : '');
        root.querySelectorAll('[data-add]').forEach(function (b) { b.disabled = n + Math.pow(10, +b.getAttribute('data-add')) > 1000; });
        root.querySelectorAll('[data-sub]').forEach(function (b) { b.disabled = n - Math.pow(10, +b.getAttribute('data-sub')) < 0; });
        msg = '';
      }
      root.querySelectorAll('[data-add]').forEach(function (b) {
        b.addEventListener('click', function () {
          var p = +b.getAttribute('data-add');
          if (total() + Math.pow(10, p) > 1000) return;
          c[p]++;
          var said = [];
          for (var q = 0; q < 3; q++) if (c[q] >= 10) { c[q] -= 10; c[q + 1]++; said.push('10 ' + A.PLACES[q] + ' were grouped into 1 ' + A.PLACE1[q + 1]); }
          if (said.length) msg = said.join(', then ') + '.';
          build();
        });
      });
      root.querySelectorAll('[data-sub]').forEach(function (b) {
        b.addEventListener('click', function () {
          var p = +b.getAttribute('data-sub');
          if (total() - Math.pow(10, p) < 0) return;
          if (!c[p]) {
            var q = p;
            while (!c[q]) q++;
            var said2 = [];
            while (q > p) { c[q]--; c[q - 1] += 10; said2.push('1 ' + A.PLACE1[q] + ' was broken into 10 ' + A.PLACES[q - 1]); q--; }
            msg = 'There were no ' + A.PLACES[p] + ' to take away, so ' + said2.join(', then ') + '.';
          }
          c[p]--;
          build();
        });
      });
      $('#bn', root).addEventListener('input', function () { c = digitsOf(clamp(this.value, 0, 1000)); build(); });
      build();

      /* section 2: trade blocks. t = [ones, tens, hundreds] */
      var t = [0, 0, 0], MAX = 30;
      function trStart() { t = digitsOf(clamp($('#trn', root).value, 100, 999)).slice(0, 3); tr(); }
      function tr() {
        var n = t[0] + t[1] * 10 + t[2] * 100;
        $('#trfig', root).innerHTML = columns(t);
        var parts = [];
        for (var k = 2; k >= 0; k--) if (t[k]) parts.push('<b class="c' + k + 't">' + plural(t[k], k) + '</b>');
        $('#trout', root).innerHTML = '<p>' + parts.join(' + ') + ' = <span class="big">' + n + '</span></p><p class="t2">Same number, different blocks.</p>';
        root.querySelectorAll('[data-tr]').forEach(function (b) { var p = +b.getAttribute('data-tr'); b.disabled = t[p] < 1 || t[p - 1] + 10 > MAX; });
        root.querySelectorAll('[data-gr]').forEach(function (b) { b.disabled = t[+b.getAttribute('data-gr')] < 10; });
      }
      root.querySelectorAll('[data-tr]').forEach(function (b) { b.addEventListener('click', function () { var p = +b.getAttribute('data-tr'); if (t[p] > 0 && t[p - 1] + 10 <= MAX) { t[p]--; t[p - 1] += 10; tr(); } }); });
      root.querySelectorAll('[data-gr]').forEach(function (b) { b.addEventListener('click', function () { var p = +b.getAttribute('data-gr'); if (t[p] >= 10) { t[p] -= 10; t[p + 1]++; tr(); } }); });
      A.bind(root, ['trn'], trStart);

      /* section 3: skip counting */
      function sk() {
        var by = +$('#skb', root).value, dir = +$('#skd', root).value, st = clamp($('#sks', root).value, 0, 1000);
        var vals = [st];
        while (vals.length < 11) { var nx = vals[vals.length - 1] + dir * by; if (nx < 0 || nx > 1000) break; vals.push(nx); }
        if (vals.length < 2) {
          $('#skfig', root).innerHTML = '';
          $('#skout', root).innerHTML = '<p>From ' + st + ' there is no room to jump ' + (dir > 0 ? 'forward' : 'backward') + ' by ' + by + ' and stay between 0 and 1000. Try another start.</p>';
          return;
        }
        $('#skfig', root).innerHTML = hops(vals);
        $('#skout', root).innerHTML = '<p><span class="big">' + vals.join(', ') + '</span></p><p>' + (vals.length - 1) + ' jumps of ' + by + ' ' + (dir > 0 ? 'forward' : 'backward') + ' from ' + st + ' land on ' + vals[vals.length - 1] + '.</p>';
      }
      A.bind(root, ['skb', 'sks', 'skd'], sk);

      /* section 4: compare */
      function cp() {
        var a = clamp($('#cpa', root).value, 0, 1000), b = clamp($('#cpb', root).value, 0, 1000);
        var cols = a === 1000 || b === 1000 ? 4 : 3, sa = String(a), sb = String(b);
        while (sa.length < cols) sa = '0' + sa;
        while (sb.length < cols) sb = '0' + sb;
        var diff = -1;
        for (var i = 0; i < cols; i++) if (sa.charAt(i) !== sb.charAt(i)) { diff = i; break; }
        $('#cpblocks', root).innerHTML = '<figure><figcaption>First: ' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure>' +
          '<figure><figcaption>Second: ' + b + '</figcaption>' + A.draw.blocks(b, 'Blocks for ' + b, 330, 4) + '</figure>';
        $('#cpchart', root).innerHTML = '<p class="t2" style="margin:.3em 0 0;font-size:.9rem">First number</p>' + chart(a, { cols: cols, hl: diff, dots: false }) +
          '<p class="t2" style="margin:.3em 0 0;font-size:.9rem">Second number</p>' + chart(b, { cols: cols, hl: diff, dots: false });
        var lo = Math.min(a, b), hi = Math.max(a, b), step = hi - lo > 200 ? 100 : hi - lo > 20 ? 10 : 1;
        var L = Math.floor(lo / step) * step, H = Math.ceil(hi / step) * step;
        if (H === L) H = L + step;
        while ((H - L) / step > 10) { step *= 2; L = Math.floor(lo / step) * step; H = Math.ceil(hi / step) * step; if (H === L) H = L + step; }
        var x0 = 30, x1 = 530, s = '<line x1="' + x0 + '" y1="44" x2="' + x1 + '" y2="44" style="stroke:var(--ink)" stroke-width="2"/>';
        for (var v = L; v <= H; v += step) {
          var x = x0 + (x1 - x0) * (v - L) / (H - L);
          s += '<line x1="' + x + '" y1="37" x2="' + x + '" y2="51" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="70" text-anchor="middle" font-size="13">' + v + '</text>';
        }
        [[a, 'var(--strand)', 'first'], [b, 'var(--hi)', 'second']].forEach(function (pt, k) {
          var x = x0 + (x1 - x0) * (pt[0] - L) / (H - L);
          s += '<circle cx="' + x + '" cy="44" r="8" style="fill:' + pt[1] + ';stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="' + (k ? 14 : 28) + '" text-anchor="middle" class="tb" font-size="13">' + pt[2] + '</text>';
        });
        $('#cpline', root).innerHTML = A.svg(560, 78, s, 'Number line showing ' + a + ' and ' + b);
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=', said = a > b ? 'is greater than' : a < b ? 'is less than' : 'is equal to';
        var pn = ['thousands', 'hundreds', 'tens', 'ones'].slice(4 - cols);
        $('#cpout', root).innerHTML = '<p><span class="big">' + a + ' ' + sym + ' ' + b + '</span> &nbsp;' + a + ' ' + said + ' ' + b + '.</p><p>' +
          (diff < 0 ? 'Every digit matches, so the numbers are equal.' : 'The first different place is the <b>' + pn[diff] + '</b>: ' + sa.charAt(diff) + ' and ' + sb.charAt(diff) + '. On the number line, the greater number is further right.') + '</p>';
      }
      A.bind(root, ['cpa', 'cpb'], cp);
      (function () {
        var pts = [318, 381, 138], s = '<line x1="30" y1="46" x2="530" y2="46" style="stroke:var(--ink)" stroke-width="2"/>';
        for (var v = 100; v <= 400; v += 50) {
          var x = 30 + 500 * (v - 100) / 300;
          s += '<line x1="' + x + '" y1="38" x2="' + x + '" y2="54" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="74" text-anchor="middle" font-size="13">' + v + '</text>';
        }
        pts.forEach(function (p) {
          var x = 30 + 500 * (p - 100) / 300;
          s += '<circle cx="' + x + '" cy="46" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="26" text-anchor="middle" font-size="14" class="tb">' + p + '</text>';
        });
        $('#ordfig', root).innerHTML = A.svg(560, 82, s, 'Number line from 100 to 400 with 138, 318 and 381 marked from left to right');
      })();

      /* section 5: rounding */
      function rd() {
        var n = clamp($('#rn', root).value, 0, 1000), p = +$('#rp', root).value;
        var lo = Math.floor(n / p) * p, hi = lo + p, res = n - lo >= p / 2 ? hi : lo, dg = Math.floor((n % p) / (p / 10));
        $('#rline', root).innerHTML = hill(n, p);
        var s = String(n), pi = s.length - 1 - (p === 100 ? 2 : 1), shown = '';
        for (var i = 0; i < s.length; i++) {
          var ch = s.charAt(i);
          shown += i === pi ? '<span style="outline:2px solid var(--accent);border-radius:3px;padding:0 2px">' + ch + '</span>' :
            i === pi + 1 ? '<span style="text-decoration:underline 3px var(--hi);text-underline-offset:4px">' + ch + '</span>' : ch;
        }
        var nm = p === 10 ? 'ten' : 'hundred';
        var why = n === lo ? n + ' is already a ' + nm + ' number, so it stays ' + n + '.' :
          n + ' is between ' + lo + ' and ' + hi + '. The digit to the right of the ' + nm + 's place is <b>' + dg + '</b>, which is ' + (dg >= 5 ? '5 or more, so round <b>up</b> to ' + hi + '.' : 'less than 5, so round <b>down</b> to ' + lo + '.');
        $('#rout', root).innerHTML = '<p><span class="big">' + (pi >= 0 ? shown : n) + ' &#8776; ' + res + '</span></p><p>' + why + '</p>' +
          (pi >= 0 ? '<p class="t2" style="font-size:.9rem">Boxed: the place you round to. Underlined: the digit that decides.</p>' : '');
      }
      A.bind(root, ['rn', 'rp'], rd);

      /* section 6: thousand grid */
      function hk(fromSelect) {
        if (fromSelect) $('#hkn', root).value = $('#hkp', root).value;
        var n = clamp($('#hkn', root).value, 0, 1000), full = Math.floor(n / 10), part = n % 10;
        $('#hkfig', root).innerHTML = thousand(n);
        var size = n === 1000 ? 'all of 1000' : n >= 900 ? 'almost all of 1000' : n >= 450 && n <= 550 ? 'about half of 1000' : n >= 230 && n <= 270 ? 'about a quarter of 1000' : n >= 90 && n <= 110 ? 'about a tenth of 1000' : '';
        $('#hkout', root).innerHTML = '<p><span class="big">' + n + '</span> fills ' + full + ' square' + (full === 1 ? '' : 's') + (part ? ' and part of one more' : '') + (size ? ': ' + size : '') + '.</p>';
      }
      $('#hkp', root).addEventListener('change', function () { hk(true); });
      $('#hkn', root).addEventListener('input', function () { hk(false); });
      hk(false);
    },

    quiz: [
      { q: 'What is the value of the digit 4 in <span class="math">482</span>?', type: 'mc', options: ['4', '40', '400', '482'], answer: 2, fig: chart(482, { hl: 0 }),
        hint: 'Look at the chart. Which place is the 4 in?', explain: 'The 4 is in the hundreds place, so it is worth 400.' },
      { q: 'What number do these blocks show?', type: 'num', answer: 365, fig: A.draw.blocks(365, '3 flats, 6 rods and 5 small cubes', 540, 6),
        hint: 'Flats are hundreds, rods are tens, small cubes are ones. Count each kind.', explain: '3 hundreds, 6 tens and 5 ones make 365.' },
      { q: 'Which number is <b>six hundred seven</b>?', type: 'mc', options: ['67', '607', '670', '6007'], answer: 1,
        hint: 'There are no tens. What digit goes in the tens place?', explain: '6 hundreds, 0 tens, 7 ones: 607.' },
      { q: 'Count by 50s. What comes next? <span class="math">350, 400, 450, ___</span>', type: 'num', answer: 500, fig: hops([350, 400, 450, 500], 3),
        hint: 'Add 50 to 450.', explain: '450 + 50 = 500.' },
      { q: 'Which number is greater: <span class="math">509</span> or <span class="math">590</span>?', type: 'mc', options: ['509', '590', 'They are equal'], answer: 1, fig: chart(509, { hl: 1, dots: false }) + chart(590, { hl: 1, dots: false }),
        hint: 'The hundreds are the same. Compare the tens next.', explain: 'Both have 5 hundreds. 590 has 9 tens and 509 has 0 tens, so 590 is greater.' },
      { q: 'Round <span class="math">247</span> to the nearest hundred.', type: 'mc', options: ['200', '240', '250', '300'], answer: 0, fig: hill(247, 100),
        hint: 'Is the yellow ball before or past the top of the hill?', explain: '247 is between 200 and 300. The tens digit is 4, which is less than 5, so round down to 200.' },
      { q: 'What number is 3 hundreds, 14 tens and 2 ones?', type: 'num', answer: 442, fig: A.draw.pile([2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], '3 flats, 14 rods and 2 small cubes', 540, 5),
        hint: '10 of the 14 tens make 1 more hundred.', explain: '14 tens is 140. 300 + 140 + 2 = 442.' }
    ],

    practice: [
      { id: 'n3-value', name: 'Value of a digit', code: 'B1.5', gen: function (lv) {
        var n = R.int(101, 999), s = String(n), i = R.int(0, 2);
        while (s.charAt(i) === '0') i = R.int(0, 2);
        var dgt = +s.charAt(i), place = 2 - i, val = dgt * Math.pow(10, place);
        if (lv === 3) {
          var k = R.pick([1, 2]), tot = Math.floor(n / Math.pow(10, k));
          return { q: 'How many <b>' + A.PLACES[k] + '</b> are in <span class="math">' + n + '</span> in all?', type: 'num', answer: tot,
            fig: A.draw.blocks(n, 'Base-ten blocks showing ' + n, 540, 5),
            hint: k === 1 ? 'Each flat is 10 tens. Count the tens in the flats, then add the rods.' : 'Each flat is 1 hundred. Count the flats.',
            steps: k === 1 ? ['There are ' + plural(Math.floor(n / 100), 2) + '. Each hundred is 10 tens, so that is ' + Math.floor(n / 100) * 10 + ' tens.', 'Add the ' + plural(Math.floor(n / 10) % 10, 1) + ' from the rods.', Math.floor(n / 100) * 10 + ' + ' + (Math.floor(n / 10) % 10) + ' = ' + tot + ' tens. A quick way: cover the ones digit and read ' + tot + '.'] :
              ['Count the flats. Each flat is 1 hundred.', 'There are ' + tot + ' flats.', 'So there are ' + tot + ' hundreds in ' + n + '.'],
            explain: n + ' = ' + tot + ' ' + A.PLACES[k] + ' + ' + (n % Math.pow(10, k)) + '.' };
        }
        var wrong = [dgt, dgt * Math.pow(10, place + 1), dgt * Math.pow(10, Math.max(0, place - 1)), n].filter(function (v) { return v !== val; });
        var o = R.mc(val, wrong);
        return { q: 'What is the value of the <b>' + dgt + '</b> in <span class="math">' + s.slice(0, i) + '<u>' + dgt + '</u>' + s.slice(i + 1) + '</span>?',
          type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? chart(n, { hl: i }) : A.draw.blocks(n, 'Base-ten blocks showing ' + n, 540, 5),
          hint: lv === 1 ? 'Find the underlined digit in the chart. Read the name of its place.' : 'Is the underlined digit counting flats, rods or small cubes?',
          steps: ['The underlined ' + dgt + ' is in the <b>' + A.PLACES[place] + '</b> place.', (place ? 'One ' + A.PLACE1[place] + ' is ' + Math.pow(10, place) + '.' : 'Each one is worth 1.'), dgt + ' ' + A.PLACES[place] + ' = ' + val + '.<div class="fig">' + chart(n, { hl: i, vals: true }) + '</div>'],
          explain: 'The ' + dgt + ' is in the ' + A.PLACES[place] + ' place, so it is worth ' + val + '.' };
      } },
      { id: 'n3-blocks', name: 'Read base-ten blocks', code: 'B1.1', gen: function (lv) {
        var c = [R.int(0, 9), R.int(0, 9), R.int(1, lv === 1 ? 5 : 9)];
        if (lv === 2) c[R.int(0, 1)] = 0;
        var n = c[0] + c[1] * 10 + c[2] * 100;
        if (lv < 3) {
          var miss = [];
          if (!c[1]) miss.push('rods');
          if (!c[0]) miss.push('small cubes');
          return { q: 'What number do these blocks show?', type: 'num', answer: n, fig: A.draw.blocks(n, plural(c[2], 2) + ', ' + plural(c[1], 1) + ', ' + plural(c[0], 0), 540, 6),
            hint: 'Flats are hundreds, rods are tens, small cubes are ones.' + (miss.length ? ' A kind of block that is missing gets a 0.' : ''),
            steps: ['Count the flats: ' + c[2] + '. That is ' + plural(c[2], 2) + '.', 'Count the rods: ' + c[1] + '. Count the small cubes: ' + c[0] + '.' + (miss.length ? ' There are no ' + miss.join(' and no ') + ', so write 0 there.' : ''), 'Write one digit for each place: ' + n + '.<div class="fig">' + chart(n, { vals: true }) + '</div>'],
            explain: plural(c[2], 2) + ', ' + plural(c[1], 1) + ' and ' + plural(c[0], 0) + ' make ' + n + '.' };
        }
        /* level 3: one place has 10 or more, and the blocks are mixed up */
        var k = R.pick([0, 1]), cc = c.slice();
        if (cc[k + 1] < 1) cc[k + 1] = 1;
        n = cc[0] + cc[1] * 10 + cc[2] * 100;
        cc[k + 1]--; cc[k] += 10;
        var items = [];
        for (var p = 0; p < 3; p++) for (var j = 0; j < cc[p]; j++) items.push(p);
        items = R.shuffle(items);
        return { q: 'What number do these blocks show? They are mixed up, and one kind has 10 or more.', type: 'num', answer: n,
          fig: A.draw.pile(items, plural(cc[2], 2) + ', ' + plural(cc[1], 1) + ' and ' + plural(cc[0], 0) + ', mixed up', 540, 5),
          hint: 'Count each kind of block. Ten ' + A.PLACES[k] + ' make 1 ' + A.PLACE1[k + 1] + '.',
          steps: ['Count each kind: ' + plural(cc[2], 2) + ', ' + plural(cc[1], 1) + ', ' + plural(cc[0], 0) + '.', 'Trade 10 ' + A.PLACES[k] + ' for 1 ' + A.PLACE1[k + 1] + '. Now there are ' + plural(Math.floor(n / 100), 2) + ', ' + plural(Math.floor(n / 10) % 10, 1) + ', ' + plural(n % 10, 0) + '.', 'Write the digits: ' + n + '.'],
          explain: cc[2] * 100 + ' + ' + cc[1] * 10 + ' + ' + cc[0] + ' = ' + n + '.' };
      } },
      { id: 'n3-forms', name: 'Expanded and standard form', code: 'B1.1', gen: function (lv) {
        var h = R.int(1, 9), t = R.int(lv === 1 ? 1 : 0, 9), o = R.int(lv === 1 ? 1 : 0, 9);
        if (lv === 2 && t && o) R.pick([function () { t = 0; }, function () { o = 0; }])();
        var n = h * 100 + t * 10 + o;
        if (lv === 3 && R.int(0, 1)) {
          /* more than 9 tens or ones, written as place names */
          var t2 = t + 10, extra = h > 1 ? 1 : 0, h2 = h - extra;
          if (!extra) { t2 = t; }
          var o2 = o, nn = h2 * 100 + t2 * 10 + o2;
          if (!extra) { o2 = o + 10 > 19 ? o : o + 10; nn = h2 * 100 + t2 * 10 + o2; }
          return { q: 'What number is <b>' + plural(h2, 2) + ', ' + plural(t2, 1) + ' and ' + plural(o2, 0) + '</b>?', type: 'num', answer: nn,
            hint: 'Find the value of each part, then add. Ten of a place make 1 of the next place.',
            steps: [plural(h2, 2) + ' = ' + h2 * 100 + '. ' + plural(t2, 1) + ' = ' + t2 * 10 + '. ' + plural(o2, 0) + ' = ' + o2 + '.', 'Add: ' + h2 * 100 + ' + ' + t2 * 10 + ' + ' + o2 + '.', 'The number is ' + nn + '.'],
            explain: h2 * 100 + ' + ' + t2 * 10 + ' + ' + o2 + ' = ' + nn + '.' };
        }
        var parts = [h * 100, t * 10, o].filter(function (v) { return v; });
        if (lv === 3) parts = R.shuffle(parts);
        return { q: 'Write in standard form: <span class="math">' + parts.join(' + ') + '</span>', type: 'num', answer: n,
          fig: lv < 3 ? A.draw.blocks(n, 'Base-ten blocks showing ' + n, 540, 5) : '',
          hint: lv === 3 ? 'The parts are mixed up. Put the hundreds first, then tens, then ones.' : 'Put each part in its place. A place with nothing gets a 0.',
          steps: ['Sort the parts from biggest to smallest: ' + [h * 100, t * 10, o].filter(function (v) { return v; }).join(' + ') + '.', 'Write a digit for hundreds, tens and ones. Write 0 for a missing place.', 'The number is ' + n + '.<div class="fig">' + expanded(n) + '</div>'],
          explain: parts.join(' + ') + ' = ' + n + '.' };
      } },
      { id: 'n3-words', name: 'Numbers in words', code: 'B1.1', gen: function (lv) {
        var h = R.int(1, 9), t = R.int(0, 9), o = R.int(0, 9);
        if (lv >= 2 && R.int(0, 1)) t = 0;
        if (lv === 1 && !t) t = R.int(2, 9);
        var n = h * 100 + t * 10 + o;
        var wrong = [h * 10 + o, h * 100 + o * 10 + t, h * 1000 + t * 10 + o, h * 100 + (t + 1) % 10 * 10 + o].filter(function (w) { return w !== n && w > 0 && w <= 9999; });
        var steps = ['The hundreds part: "' + ones[h] + ' hundred" is ' + h * 100 + '.', 'The rest: ' + (n % 100 ? '"' + words(n % 100) + '" is ' + (n % 100) + (t === 0 ? '. There are no tens, so the tens digit is 0.' : '.') : 'nothing, so the tens and ones are 0.'), 'Together: ' + words(n) + ' is ' + n + '.<div class="fig">' + chart(n, { vals: true }) + '</div>'];
        if (lv === 3) {
          var o2 = R.mc(words(n), wrong.filter(function (w) { return w <= 1000; }).concat([h * 100 + t]).filter(function (w) { return w !== n; }).map(words));
          return { q: 'Which is the word form of <span class="math">' + n + '</span>?', type: 'mc', options: o2.options, answer: o2.answer,
            fig: chart(n, { dots: false }), hint: 'Say the hundreds first. Then say the last two digits.', steps: steps, explain: n + ' is ' + words(n) + '.' };
        }
        var oo = R.mc(A.fmt(n), wrong.map(A.fmt));
        return { q: 'Which number is <b>' + words(n) + '</b>?', type: 'mc', options: oo.options, answer: oo.answer,
          hint: 'Write the hundreds digit first. Then the tens, then the ones. Use 0 for an empty place.', steps: steps, explain: words(n) + ' is ' + n + '.' };
      } },
      { id: 'n3-skip', name: 'Skip counting', code: 'B1.4', gen: function (lv) {
        var by = lv === 1 ? R.pick([10, 100]) : R.pick([50, 100, 200]), dir = lv === 3 && R.int(0, 1) ? -1 : 1;
        var start = lv === 1 ? R.int(0, 5) * by : lv === 2 ? R.int(0, 6) * 50 : R.int(1, 40) * 10;
        if (dir < 0) start = R.int(5, 10) * 100 - (by === 200 ? 0 : R.pick([0, 50]));
        var vals = [start];
        for (var i = 0; i < 4; i++) vals.push(vals[vals.length - 1] + dir * by);
        if (vals[4] > 1000 || vals[4] < 0) { dir = 1; start = 0; vals = [0, by, 2 * by, 3 * by, 4 * by]; }
        var miss = lv === 3 ? R.int(1, 3) : 4, ans = vals[miss];
        var shownList = vals.map(function (v, k) { return k === miss ? '___' : v; }).join(', ');
        return { q: (lv === 3 ? 'Find the missing number. ' : 'What comes next? ') + 'Count by ' + by + 's' + (dir < 0 ? ' backward' : '') + ': <span class="math">' + shownList + '</span>', type: 'num', answer: ans,
          fig: lv < 3 ? hops(vals, miss) : '',
          hint: (dir < 0 ? 'Take away ' : 'Add ') + by + ' to the number ' + (miss === 4 ? 'before the blank.' : 'before the blank. Check it with the number after.'),
          steps: ['Each jump is ' + (dir < 0 ? 'back ' : '') + by + '.', 'The number before the blank is ' + vals[miss - 1] + '. ' + vals[miss - 1] + (dir < 0 ? ' &minus; ' : ' + ') + by + ' = ' + ans + '.', 'The answer is ' + ans + '.<div class="fig">' + hops(vals) + '</div>'],
          explain: vals.join(', ') + '.' };
      } },
      { id: 'n3-compare', name: 'Compare and order', code: 'B1.2', gen: function (lv) {
        if (lv < 3) {
          var a = R.int(100, 999), b;
          if (lv === 1) { do { b = R.int(100, 999); } while (Math.floor(b / 100) === Math.floor(a / 100)); }
          else { do { b = Math.floor(a / 100) * 100 + R.int(0, 99); } while (b === a); }
          var sym = a > b ? '&gt;' : '&lt;', o = R.mc(sym, ['&gt;', '&lt;', '=']);
          var sa = String(a), sb = String(b), d0 = 0;
          while (sa.charAt(d0) === sb.charAt(d0)) d0++;
          var pn = ['hundreds', 'tens', 'ones'][d0];
          return { q: 'Which symbol goes in the box? <span class="math">' + a + ' &#9633; ' + b + '</span>', type: 'mc', options: o.options, answer: o.answer,
            fig: '<div class="vrow"><figure><figcaption>' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure><figure><figcaption>' + b + '</figcaption>' + A.draw.blocks(b, 'Blocks for ' + b, 330, 4) + '</figure></div>',
            hint: 'Compare the hundreds first. If they match, compare the tens.',
            steps: ['Line the numbers up by place.', 'Start at the left. The first different digits are in the ' + pn + ' place: ' + sa.charAt(d0) + ' and ' + sb.charAt(d0) + '.<div class="fig">' + chart(a, { hl: d0, dots: false }) + chart(b, { hl: d0, dots: false }) + '</div>', 'The bigger digit wins, so ' + a + ' ' + sym + ' ' + b + '.'],
            explain: a + ' ' + sym + ' ' + b + '. The symbol opens toward the greater number.' };
        }
        var hd = R.int(1, 8), nums = [];
        while (nums.length < 3) { var v = (hd + R.int(0, 1)) * 100 + R.int(0, 9) * 10 + R.int(0, 9); if (nums.indexOf(v) < 0) nums.push(v); }
        var big = R.int(0, 1);
        var sorted = nums.slice().sort(function (x, y) { return big ? y - x : x - y; });
        var right = sorted.join(', ');
        var w = [[sorted[1], sorted[0], sorted[2]], [sorted[0], sorted[2], sorted[1]], sorted.slice().reverse()].map(function (l) { return l.join(', '); });
        var o2 = R.mc(right, w);
        return { q: 'Put <span class="math">' + R.shuffle(nums).join(', ') + '</span> in order from <b>' + (big ? 'greatest to least' : 'least to greatest') + '</b>.', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Compare the hundreds first, then the tens, then the ones.',
          steps: ['Look at the hundreds digits first.', 'If two numbers have the same hundreds, compare their tens.', (big ? 'Greatest to least: ' : 'Least to greatest: ') + right + '.'],
          explain: 'In order: ' + right + '.' };
      } },
      { id: 'n3-round', name: 'Round to the nearest ten or hundred', code: 'B1.3', gen: function (lv) {
        var p = lv === 1 ? 10 : lv === 2 ? 100 : R.pick([10, 100]), n;
        if (lv === 1) n = R.int(11, 99);
        else n = R.int(101, 999);
        if (lv === 3) n = p === 100 ? R.pick([R.int(90, 99) * 10 + R.int(0, 9), R.int(1, 9) * 100 + 50, R.int(951, 999)]) : R.int(10, 99) * 10 + R.pick([5, R.int(1, 9)]);
        if (n % p === 0) n += p === 10 ? 3 : 30;
        n = Math.min(n, 999);
        var lo = Math.floor(n / p) * p, hi = lo + p, ans = n - lo >= p / 2 ? hi : lo, dg = Math.floor((n % p) / (p / 10)), nm = p === 10 ? 'ten' : 'hundred';
        var o = R.mc(ans, [ans === hi ? lo : hi, Math.round(n / (p / 10)) * (p / 10), ans + p].filter(function (v) { return v !== ans && v >= 0; }));
        return { q: 'Round <span class="math">' + n + '</span> to the nearest <b>' + nm + '</b>.', type: 'mc', options: o.options, answer: o.answer,
          fig: lv < 3 ? hill(n, p) : '', hint: lv < 3 ? 'Is the yellow ball before or past the top of the hill?' : 'Find the ' + nm + 's on either side. Then look at the digit to the right of the ' + nm + 's place.',
          steps: [n + ' is between ' + lo + ' and ' + hi + '.', 'The digit to the right of the ' + nm + 's place is ' + dg + '.', (dg >= 5 ? '5 or more rounds up, to ' + hi + '.' : 'Less than 5 rounds down, to ' + lo + '.') + '<div class="fig">' + hill(n, p) + '</div>'],
          explain: n + ' rounds to ' + ans + '.' };
      } }
    ]
  });
})();
