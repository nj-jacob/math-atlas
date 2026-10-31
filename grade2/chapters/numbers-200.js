(function () {
  var A = Atlas, R = A.R, D = A.draw;
  var ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function words(n) {
    if (n === 0) return 'zero';
    var s = '';
    if (n >= 100) { s = ones[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
    if (n >= 20) { s += tens[Math.floor(n / 10)]; if (n % 10) s += '-' + ones[n % 10]; }
    else if (n > 0) s += ones[n];
    return s;
  }
  A.words = words;
  function hto(n) { return [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10]; }
  function pl(k, one, many) { return k + ' ' + (k === 1 ? one : many); }
  function htoWords(n) { var d = hto(n); return pl(d[0], 'hundred', 'hundreds') + ', ' + pl(d[1], 'ten', 'tens') + ', ' + pl(d[2], 'one', 'ones'); }
  /* hundreds, tens, ones table with coloured headings */
  function table(n, hl) {
    var d = hto(n), names = ['Hundreds', 'Tens', 'Ones'], h = '<div class="pvt" role="img" aria-label="' + htoWords(n) + '">';
    for (var i = 0; i < 3; i++) h += '<div' + (i === hl ? ' class="on"' : '') + '><span class="h c' + (2 - i) + '">' + names[i] + '</span><span class="d c' + (2 - i) + 't">' + d[i] + '</span></div>';
    return h + '</div>';
  }
  function expanded(n) {
    var d = hto(n), parts = [];
    if (d[0]) parts.push('<b class="c2t">' + d[0] * 100 + '</b>');
    if (d[1]) parts.push('<b class="c1t">' + d[1] * 10 + '</b>');
    if (d[2]) parts.push('<b class="c0t">' + d[2] + '</b>');
    return parts.join(' + ') || '0';
  }
  /* 1 hundred = 10 tens = 100 ones */
  function same100() {
    var s = '', u = 8;
    s += D.base10(1, 0, 0, { u: u }).replace(/<svg[^>]*>|<\/svg>/g, '');
    var t = D.base10(0, 10, 0, { u: u }).replace(/<svg[^>]*>|<\/svg>/g, '');
    s += '<g transform="translate(118,0)">' + t + '</g>';
    var o = '';
    for (var i = 0; i < 100; i++) o += D.rr(340 + (i % 10) * 8.6, 4 + Math.floor(i / 10) * 8.6, 7, 7, 1.5, 'var(--p0)', 'stroke="rgba(0,0,0,.35)" stroke-width="1"');
    s += o;
    s += '<text x="44" y="112" text-anchor="middle" font-size="15" class="tb">1 hundred</text><text x="196" y="112" text-anchor="middle" font-size="15" class="tb">10 tens</text><text x="382" y="112" text-anchor="middle" font-size="15" class="tb">100 ones</text>';
    s += '<text x="98" y="52" text-anchor="middle" font-size="26" class="tb">=</text><text x="316" y="52" text-anchor="middle" font-size="26" class="tb">=</text>';
    return A.svg(440, 120, s, '1 hundred flat is the same as 10 ten rods, which is the same as 100 one cubes');
  }
  /* dots scattered on a grid, with a seed so a picture stays the same */
  function rng(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }
  function scatter(n, seed, group) {
    var W = 520, H = 230, cols = 26, rows = 11, cw = W / cols, ch = H / rows, cells = [], rnd = rng(seed), s = '';
    for (var i = 0; i < cols * rows; i++) cells.push(i);
    for (var j = cells.length - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)), t = cells[j]; cells[j] = cells[k]; cells[k] = t; }
    var pick = cells.slice(0, n);
    if (group) pick.sort(function (a, b) { return (a % cols) - (b % cols) || a - b; });
    pick.forEach(function (c, i) {
      var x = (c % cols) * cw + cw / 2 + (rnd() - 0.5) * cw * 0.4, y = Math.floor(c / cols) * ch + ch / 2 + (rnd() - 0.5) * ch * 0.4;
      var g = Math.floor(i / 10), full = Math.floor(n / 10);
      var col = group ? (g < full ? (g % 2 ? 'var(--p1)' : 'var(--strand)') : 'var(--p0)') : 'var(--strand)';
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6.5" style="fill:' + col + '" stroke="rgba(0,0,0,.4)" stroke-width="1"/>';
    });
    return A.svg(W, H, '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="14" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>' + s,
      group ? n + ' dots, coloured in groups of ten: ' + Math.floor(n / 10) + ' tens and ' + n % 10 + ' left over' : 'A picture of many dots');
  }
  /* the same number of dots lined up in rows of ten, with the running count at the end of each row */
  function rows10(n) {
    var r = 7, g = 19, s = '', per = n > 100 ? 2 : 1, blockW = 10 * g + 70;
    for (var i = 0; i < n; i++) {
      var row = Math.floor(i / 10), blk = Math.floor(row / 10), rr = row % 10, c = i % 10;
      var x = 14 + blk * blockW + c * g + (c >= 5 ? 6 : 0), y = 14 + rr * g;
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + (row * 10 + 10 <= n ? (row % 2 ? 'var(--p1)' : 'var(--strand)') : 'var(--p0)') + '" stroke="rgba(0,0,0,.4)" stroke-width="1"/>';
      if (c === 9 || i === n - 1) s += '<text x="' + (x + 16) + '" y="' + (y + 6) + '" font-size="17" font-weight="700">' + (i + 1) + '</text>';
    }
    var rowsUsed = Math.min(10, Math.ceil(n / 10));
    return A.svg(per * blockW, rowsUsed * g + 12, s, n + ' dots in rows of ten: ' + Math.floor(n / 10) + ' full rows and ' + n % 10 + ' more');
  }
  /* pairs: items in two rows so partners line up */
  function pairs(n, kind) {
    var r = 12, gap = 32, s = '', cols = Math.ceil(n / 2);
    for (var i = 0; i < n; i++) {
      var c = Math.floor(i / 2), row = i % 2, x = 20 + c * gap, y = 20 + row * gap;
      s += A.THING[kind || 'cube'](x, y, r, row ? 'var(--p1)' : 'var(--strand)');
    }
    if (n % 2) s += '<circle cx="' + (20 + (cols - 1) * gap) + '" cy="' + (20 + gap) + '" r="' + (r + 2) + '" fill="none" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="4 3"/>';
    return A.svg(Math.max(60, cols * gap + 10), 2 * gap + 10, s, n + ' blocks in pairs. ' + (n % 2 ? 'One has no partner, so ' + n + ' is odd.' : 'Every block has a partner, so ' + n + ' is even.'));
  }

  function blocksQ(lv) {
    var h, t, o;
    if (lv === 1) { h = 0; t = R.int(1, 9); o = R.int(0, 9); }
    else if (lv === 2) { h = 1; t = R.int(0, 9); o = R.int(0, 9); if (R.int(0, 4) === 0) h = 2, t = 0, o = 0; }
    else { h = R.int(0, 1); t = R.int(2, 9); o = R.int(10, 15); }
    var n = h * 100 + t * 10 + o;
    var lab = (h ? pl(h, 'hundred flat', 'hundred flats') + ', ' : '') + pl(t, 'ten rod', 'ten rods') + ' and ' + pl(o, 'one cube', 'one cubes');
    return { q: 'What number do these blocks show?' + (lv === 3 ? ' Watch the ones.' : ''), type: 'num', answer: n, fig: D.base10(h, t, o, { label: lab }),
      hint: lv === 3 ? 'There are ' + o + ' ones. Ten ones make one more ten.' : 'Count by tens for the rods first: 10, 20, 30 and so on. Then count on the ones.',
      steps: [(h ? 'The flat is 100. ' : '') + 'Count the rods by tens: ' + (function () { var a = []; for (var i = 1; i <= t; i++) a.push(h * 100 + i * 10); return a.join(', '); })() + '.',
        'Count on the ' + o + ' ones' + (lv === 3 ? ' (that is 1 ten and ' + (o - 10) + ' more)' : '') + '.', 'The blocks show ' + n + '.'],
      explain: lab + ' make ' + n + '.' };
  }

  A.register('numbers-200', {
    html:
'<section class="sec"><h2><span class="n">1</span>Hundreds, tens and ones</h2>' +
'<p>We use <b>ten digits</b> to write every number: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.</p>' +
'<p>Ten ones make <b>one ten</b>. Ten tens make <b>one hundred</b>.</p>' +
'<div class="fig">' + same100() + '</div>' +
'<div class="legend"><span><i style="background:var(--p2)"></i>hundreds are blue</span><span><i style="background:var(--p1)"></i>tens are green</span><span><i style="background:var(--p0)"></i>ones are yellow</span></div>' +
'<div class="eg"><b class="t">Watch me</b><p>This is 1 hundred, 4 tens and 7 ones. I count: 100, 110, 120, 130, 140, then 141, 142, 143, 144, 145, 146, 147. The number is <b>147</b>.</p>' +
'<div class="fig">' + D.base10(1, 4, 7, {}) + '</div>' + table(147) + '<p>We say "one hundred forty-seven". We write <span class="math">' + expanded(147) + '</span>.</p></div>' +
'<div class="yt" data-yt="read"></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' +
'<div class="ctrl">' +
'<div><span class="t2" style="font-size:.9rem;font-weight:600">Hundreds</span><div class="step"><button type="button" class="btn alt" data-bd="2" data-s="-1" aria-label="One less hundred">&minus;</button><b id="bh">1</b><button type="button" class="btn alt" data-bd="2" data-s="1" aria-label="One more hundred">+</button></div></div>' +
'<div><span class="t2" style="font-size:.9rem;font-weight:600">Tens</span><div class="step"><button type="button" class="btn alt" data-bd="1" data-s="-1" aria-label="One less ten">&minus;</button><b id="bt">2</b><button type="button" class="btn alt" data-bd="1" data-s="1" aria-label="One more ten">+</button></div></div>' +
'<div><span class="t2" style="font-size:.9rem;font-weight:600">Ones</span><div class="step"><button type="button" class="btn alt" data-bd="0" data-s="-1" aria-label="One less one">&minus;</button><b id="bo">5</b><button type="button" class="btn alt" data-bd="0" data-s="1" aria-label="One more one">+</button></div></div>' +
'</div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="mk10">Trade 10 ones for 1 ten</button><button type="button" class="btn alt" id="mk100">Trade 10 tens for 1 hundred</button></div>' +
'<div class="fig" id="bfig"></div><div id="btab"></div><div class="out" id="bout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The <b>place</b> of a digit tells what it is worth. In 147, the 1 means 1 hundred, the 4 means 4 tens, and the 7 means 7 ones.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Writing "one hundred seven" as 1007. There are no tens, so a <b>0</b> holds the tens place: <b>107</b>.</p>' + table(107, 1) + '</div>' +
'<h3>Where we see numbers</h3><div class="facts">' +
'<div>' + A.svg(48, 48, '<rect x="3" y="12" width="42" height="26" rx="6" style="fill:var(--hi)" stroke="rgba(0,0,0,.4)"/><rect x="8" y="16" width="10" height="9" rx="2" style="fill:var(--card)"/><rect x="21" y="16" width="10" height="9" rx="2" style="fill:var(--card)"/><circle cx="12" cy="40" r="4" fill="#2b2118"/><circle cx="36" cy="40" r="4" fill="#2b2118"/>') + '<span><b>Bus 120</b><small>a number used as a name</small></span></div>' +
'<div>' + A.svg(48, 48, '<rect x="8" y="4" width="32" height="40" rx="4" style="fill:var(--strand)"/><rect x="12" y="8" width="24" height="32" rx="2" style="fill:var(--card)"/><line x1="16" y1="16" x2="32" y2="16" style="stroke:var(--line)" stroke-width="2"/><line x1="16" y1="22" x2="32" y2="22" style="stroke:var(--line)" stroke-width="2"/>') + '<span><b>150 pages</b><small>a number that counts</small></span></div>' +
'<div>' + A.svg(48, 48, '<rect x="4" y="8" width="40" height="34" rx="6" style="fill:var(--card);stroke:var(--strand)" stroke-width="3"/><rect x="4" y="8" width="40" height="10" rx="4" style="fill:var(--strand)"/><text x="24" y="37" text-anchor="middle" font-size="15" font-weight="700">100</text>') + '<span><b>Day 100</b><small>a number that puts things in order</small></span></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Compare and order</h2>' +
'<p>To find the <b>greater</b> number, compare the biggest place first. Look at the hundreds. If they are the same, look at the tens. If the tens are the same, look at the ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Which is greater, 126 or 162? Both have 1 hundred. Now the tens: 2 tens and 6 tens. 6 tens is more. So <b>162 is greater than 126</b>.</p>' +
'<div class="vrow"><figure><figcaption>126</figcaption>' + D.num10(126, { u: 7 }) + '</figure><figure><figcaption>162</figcaption>' + D.num10(162, { u: 7 }) + '</figure></div></div>' +
'<div class="yt" data-yt="greater"></div>' +
'<p>We can use symbols. <span class="math"><b>&gt;</b></span> means "is greater than". <span class="math"><b>&lt;</b></span> means "is less than". The open side of the symbol always faces the greater number.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">162 &gt; 126</span> &nbsp; 162 is greater than 126.</p><p><span class="big">126 &lt; 162</span> &nbsp; 126 is less than 162.</p></div>' +
'<div class="yt" data-yt="symbol"></div>' +
'<div class="lab"><span class="lt">Try it: compare two numbers</span>' +
'<div class="ctrl"><label for="ca">First number (0 to 200)<input type="number" id="ca" min="0" max="200" value="98"></label><label for="cb">Second number (0 to 200)<input type="number" id="cb" min="0" max="200" value="102"></label></div>' +
'<div class="vrow" id="cfig"></div><div class="fig" id="cline"></div><div class="out" id="cout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking 98 is greater than 102 because 9 is a big digit. 102 has a hundred and 98 does not, so <b>102 is greater</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>To put numbers <b>in order</b>, find the least one first, then the next, and so on. On a number line, numbers get greater as you move right.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Skip counting to 200</h2>' +
'<p><b>Skip counting</b> means counting by the same jump each time. It is faster than counting by ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Count by 25s, like counting quarters: 25, 50, 75, 100. Four quarters make 100 cents.</p>' +
'<div class="fig">' + D.hops({ min: 0, max: 100, tick: 5, every: 25, hops: [{ a: 0, b: 25, t: '+25' }, { a: 25, b: 50, t: '+25' }, { a: 50, b: 75, t: '+25' }, { a: 75, b: 100, t: '+25' }], id: 'h25', label: 'Jumps of 25 from 0 to 100: 25, 50, 75, 100' }) + '</div>' +
'<div class="fig">' + D.wallet([25, 25, 25, 25], { label: 'Four quarters' }) + '</div></div>' +
'<div class="yt" data-yt="skip"></div>' +
'<div class="lab"><span class="lt">Try it: skip count</span>' +
'<div class="ctrl"><label for="sk">Count by<select id="sk"><option>2</option><option>5</option><option>10</option><option selected>20</option><option>25</option><option>50</option></select></label>' +
'<label for="ss">Start at<input type="number" id="ss" min="0" max="190" value="0"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Count by</th><th class="l">From 0</th></tr></thead><tbody>' +
'<tr><td>20s</td><td class="l">20, 40, 60, 80, 100, 120, 140, 160, 180, 200</td></tr>' +
'<tr><td>25s</td><td class="l">25, 50, 75, 100, 125, 150, 175, 200</td></tr>' +
'<tr><td>50s</td><td class="l">50, 100, 150, 200</td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Counting by 20s is like counting by 2s, with a zero on the end: 2, 4, 6 and 20, 40, 60.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Estimate, then count</h2>' +
'<p>To <b>estimate</b> is to make a smart guess about how many. First look at a small group, like 10. Then ask: how many groups of 10 could fit?</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Here are some dots. One group of 10 takes up a small patch. About 6 patches like that are filled, so I estimate <b>about 60</b>. Then I count in tens to check: 6 tens and 3 more is <b>63</b>. My estimate was close.</p>' +
'<div class="vrow"><figure>' + scatter(63, 7, false) + '<figcaption>Estimate first</figcaption></figure><figure>' + rows10(63) + '<figcaption>Then line them up in tens</figcaption></figure></div></div>' +
'<div class="yt" data-yt="est"></div>' +
'<div class="lab"><span class="lt">Try it: estimate, then check</span>' +
'<div class="btnrow"><button type="button" class="btn alt" id="enew">New picture</button></div>' +
'<div class="fig" id="efig"></div>' +
'<div class="ctrl"><label for="eg">My estimate: <output id="ego">50</output><input type="range" id="eg" min="0" max="200" step="5" value="50"></label><button type="button" class="btn" id="echk">Count in tens to check</button></div>' +
'<div class="out" id="eout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>An estimate does not have to be exact. A good estimate is <b>close</b>. Counting in groups of 10 checks it.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Even and odd</h2>' +
'<p>Put things into <b>pairs</b>, two by two. If every one has a partner, the number is <b>even</b>.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>8 blocks. Every block has a partner. 8 is <b>even</b>.</p><div class="fig">' + pairs(8) + '</div></div>' +
'<div class="yt" data-yt="even1"></div>' +
'<p>If one is left over with no partner, the number is <b>odd</b>.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>7 blocks. One block has no partner. 7 is <b>odd</b>.</p><div class="fig">' + pairs(7) + '</div></div>' +
'<div class="yt" data-yt="even2"></div>' +
'<div class="lab"><span class="lt">Try it: make pairs</span>' +
'<div class="ctrl"><label for="ev">How many blocks: <output id="evo">11</output><input type="range" id="ev" min="1" max="30" value="11"></label></div>' +
'<div class="fig" id="evfig"></div><div class="out" id="evout"></div></div>' +
'<p>For big numbers, look only at the <b>ones digit</b>.</p>' +
'<div class="tbl"><table><thead><tr><th>Even numbers end in</th><th>Odd numbers end in</th></tr></thead><tbody><tr><td class="big">0, 2, 4, 6, 8</td><td class="big">1, 3, 5, 7, 9</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Is 136 even or odd? The ones digit is 6. 6 is even, so <b>136 is even</b>.</p></div>' +
'<div class="yt" data-yt="even3"></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Looking at the first digit. 31 starts with 3, but it ends in 1, so 31 is odd. 54 starts with 5, but ends in 4, so 54 is even. Only the ones digit decides.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      /* build a number */
      var c = [5, 2, 1];
      function build() {
        var n = c[2] * 100 + c[1] * 10 + c[0];
        $('#bh', root).textContent = c[2]; $('#bt', root).textContent = c[1]; $('#bo', root).textContent = c[0];
        $('#bfig', root).innerHTML = D.base10(c[2], c[1], c[0], {});
        var tidy = c[0] < 10 && c[1] < 10;
        $('#btab', root).innerHTML = tidy ? table(n) : '';
        $('#bout', root).innerHTML = '<p><span class="big">' + n + '</span> &nbsp; ' + words(n) + '</p>' +
          (tidy ? '<p>' + htoWords(n) + ' &nbsp; <span class="math">' + expanded(n) + '</span></p>' :
            '<p>' + pl(c[2], 'hundred', 'hundreds') + ', ' + pl(c[1], 'ten', 'tens') + ', ' + pl(c[0], 'one', 'ones') + '. A place has 10 or more. Use a trade button to tidy it up.</p>');
        root.querySelectorAll('[data-bd]').forEach(function (b) {
          var p = +b.getAttribute('data-bd'), s = +b.getAttribute('data-s');
          b.disabled = s < 0 ? c[p] === 0 : n + Math.pow(10, p) > 200 || c[p] >= (p === 2 ? 2 : 19);
        });
        $('#mk10', root).disabled = c[0] < 10;
        $('#mk100', root).disabled = c[1] < 10;
      }
      root.querySelectorAll('[data-bd]').forEach(function (b) {
        b.addEventListener('click', function () { c[+b.getAttribute('data-bd')] += +b.getAttribute('data-s'); build(); });
      });
      $('#mk10', root).addEventListener('click', function () { c[0] -= 10; c[1] += 1; build(); });
      $('#mk100', root).addEventListener('click', function () { c[1] -= 10; c[2] += 1; build(); });
      build();

      /* compare */
      function cmp() {
        var a = Math.max(0, Math.min(200, parseInt($('#ca', root).value, 10) || 0));
        var b = Math.max(0, Math.min(200, parseInt($('#cb', root).value, 10) || 0));
        $('#cfig', root).innerHTML = '<figure><figcaption>' + a + '</figcaption>' + D.num10(a, { u: 6 }) + '</figure><figure><figcaption>' + b + '</figcaption>' + D.num10(b, { u: 6 }) + '</figure>';
        $('#cline', root).innerHTML = D.hops({ min: 0, max: 200, tick: 10, every: 50, id: 'hc', marks: [{ v: a, t: String(a), col: 'var(--strand)', up: true, dy: Math.abs(a - b) < 25 && a < b ? -22 : 0 }, { v: b, t: String(b), col: 'var(--hi)', up: true, dy: Math.abs(a - b) < 25 && b < a ? -22 : 0 }], y: 92, label: a + ' and ' + b + ' on a number line from 0 to 200' });
        var da = hto(a), db = hto(b), k = 0, nm = ['hundreds', 'tens', 'ones'];
        while (k < 3 && da[k] === db[k]) k++;
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=', word = a > b ? 'is greater than' : a < b ? 'is less than' : 'is equal to';
        $('#cout', root).innerHTML = '<p><span class="big">' + a + ' ' + sym + ' ' + b + '</span> &nbsp; ' + a + ' ' + word + ' ' + b + '.</p><p>' +
          (k === 3 ? 'Every place is the same, so they are equal.' : 'The first place that is different is the <b>' + nm[k] + '</b>: ' + da[k] + ' and ' + db[k] + '.') + '</p>';
      }
      A.bind(root, ['ca', 'cb'], cmp);

      /* skip count */
      function skip() {
        var k = +$('#sk', root).value, st = Math.max(0, Math.min(190, parseInt($('#ss', root).value, 10) || 0)), list = [], hops = [];
        for (var v = st; v <= 200 && list.length < 41; v += k) list.push(v);
        for (var i = 1; i < list.length && i <= 12; i++) hops.push({ a: list[i - 1], b: list[i], t: list.length <= 9 ? '+' + k : '' });
        var lo = Math.floor(st / 10) * 10, hi = Math.min(200, Math.max(lo + 20, Math.ceil(list[Math.min(list.length - 1, 12)] / 10) * 10));
        var tick = hi - lo <= 40 ? 1 : hi - lo <= 100 ? 5 : 10, every = hi - lo <= 40 ? 5 : hi - lo <= 100 ? 10 : 50;
        $('#sfig', root).innerHTML = D.hops({ min: lo, max: hi, tick: tick, every: every, hops: hops, marks: [{ v: st, col: 'var(--hi)' }], id: 'hs', label: 'Jumps of ' + k + ' starting at ' + st });
        $('#sout', root).innerHTML = '<p>' + list.slice(0, 41).map(function (v, i) { return i === 0 ? '<b>' + v + '</b>' : v; }).join(', ') + (list[list.length - 1] + k <= 200 ? ', &hellip;' : '') + '</p>' +
          '<p class="t2">' + (list.length > 13 ? 'The drawing shows the first 12 jumps. ' : '') + 'Each jump adds ' + k + '.' + (st % k ? ' You did not start at a jump of ' + k + ', so the numbers are not the ones in the table. The jump is still ' + k + '.' : '') + '</p>';
      }
      A.bind(root, ['sk', 'ss'], skip);

      /* estimate */
      var en = 0, seed = 1;
      function eNew() { en = R.int(25, 190); seed = R.int(1, 9999); $('#efig', root).innerHTML = scatter(en, seed, false); $('#eout', root).innerHTML = ''; }
      $('#eg', root).addEventListener('input', function () { $('#ego', root).textContent = this.value; });
      $('#enew', root).addEventListener('click', eNew);
      $('#echk', root).addEventListener('click', function () {
        var g = +$('#eg', root).value, off = Math.abs(g - en);
        $('#efig', root).innerHTML = '<div class="vrow"><figure>' + scatter(en, seed, false) + '</figure><figure>' + rows10(en) + '<figcaption>The same dots, lined up in tens</figcaption></figure></div>';
        $('#eout', root).innerHTML = '<p>There are <span class="big">' + en + '</span> dots: ' + pl(Math.floor(en / 10), 'ten', 'tens') + ' and ' + pl(en % 10, 'one', 'ones') + '. Each row is 10.</p><p>Your estimate, ' + g + ', is ' + off + ' away. ' +
          (off <= 15 ? 'That is a close estimate.' : off <= 35 ? 'That is fairly close. Look at a group of 10 first next time.' : 'That is far away. Picture one group of 10, then count how many groups could fit.') + '</p>';
      });
      eNew();

      /* even and odd */
      function ev() {
        var n = +$('#ev', root).value;
        $('#evo', root).textContent = n;
        $('#evfig', root).innerHTML = pairs(n);
        $('#evout', root).innerHTML = '<p><span class="big">' + n + ' is ' + (n % 2 ? 'odd' : 'even') + '.</span> ' +
          (n % 2 ? pl(Math.floor(n / 2), 'pair', 'pairs') + ' and 1 left over.' : pl(n / 2, 'pair', 'pairs') + ', none left over.') + ' It ends in ' + n % 10 + '.</p>';
      }
      A.bind(root, ['ev'], ev);
    },

    turns: {
      read: function () { return blocksQ(R.pick([1, 2])); },
      greater: function () {
        var a = R.int(100, 190), b = a + R.pick([-1, 1]) * R.pick([1, 2, 3, 10, 20, 30]);
        if (b > 200 || b < 0 || b === a) b = a - 10;
        var o = R.mc(String(Math.max(a, b)), [String(Math.min(a, b))]);
        return { q: 'Which number is greater?', type: 'mc', options: o.options, answer: o.answer, hint: 'Both have the same hundreds. Look at the tens next. If the tens are the same, look at the ones.', explain: Math.max(a, b) + ' is greater than ' + Math.min(a, b) + '.' };
      },
      symbol: function () {
        var a = R.int(40, 200), b = R.int(40, 200);
        while (b === a) b = R.int(40, 200);
        var sym = a > b ? '&gt;' : '&lt;';
        return { q: 'Which symbol makes this true? <span class="math big">' + a + ' &#9633; ' + b + '</span>', type: 'mc', options: ['&gt;', '&lt;'], answer: a > b ? 0 : 1,
          hint: 'First decide which number is greater. The open side faces the greater number.', explain: a + ' ' + sym + ' ' + b + '. ' + a + (a > b ? ' is greater than ' : ' is less than ') + b + '.' };
      },
      skip: function () {
        var k = R.pick([20, 25, 50]), st = k * R.int(0, 2), seq = [st, st + k, st + 2 * k, st + 3 * k];
        return { q: 'What comes next? <span class="math big">' + seq.join(', ') + ', ___</span>', type: 'num', answer: st + 4 * k, hint: 'How much bigger is each number than the one before? Add that again.', explain: 'Each jump is ' + k + '. ' + seq[3] + ' + ' + k + ' = ' + (st + 4 * k) + '.' };
      },
      est: function () {
        var n = R.pick([18, 22, 41, 47, 78, 83, 115, 142]), choices = [10, 20, 50, 80, 120, 150, 200];
        var best = choices.reduce(function (a, b) { return Math.abs(b - n) < Math.abs(a - n) ? b : a; });
        var wrong = choices.filter(function (c) { return Math.abs(c - n) > 25; });
        var o = R.mc(String(best), R.shuffle(wrong).slice(0, 2).map(String));
        return { q: 'About how many dots? Choose the best estimate.', type: 'mc', options: o.options, answer: o.answer, fig: scatter(n, n * 3, false),
          hint: 'Picture one group of 10 dots. About how many groups like that fill the picture?', explain: 'There are ' + n + ' dots, so about ' + best + ' is the best estimate.' };
      },
      even1: function () {
        var n = 2 * R.int(2, 7);
        return { q: 'These ' + n + ' blocks are in pairs. How many pairs are there?', type: 'num', answer: n / 2, fig: pairs(n, 'cube'),
          hint: 'A pair is a column of two blocks, one blue and one green. Count the columns.', explain: 'There are ' + n / 2 + ' pairs, and every block has a partner. So ' + n + ' is even.' };
      },
      even2: function () {
        var n = R.int(3, 15), fig = pairs(n).replace(/aria-label="[^"]*"/, 'aria-label="' + n + ' blocks in pairs"');
        return { q: 'Is this number of blocks even or odd?', type: 'mc', options: ['Even', 'Odd'], answer: n % 2, fig: fig,
          hint: 'Look at the last column. Is there a block with no partner?', explain: n + ' is ' + (n % 2 ? 'odd. One block has no partner.' : 'even. Every block has a partner.') };
      },
      even3: function () {
        var n = R.int(21, 199);
        return { q: 'Is <span class="math big">' + n + '</span> even or odd?', type: 'mc', options: ['Even', 'Odd'], answer: n % 2,
          hint: 'Look only at the ones digit, the last one. Is it 0, 2, 4, 6 or 8?', explain: 'The ones digit is ' + n % 10 + ', so ' + n + ' is ' + (n % 2 ? 'odd' : 'even') + '.' };
      }
    },

    quiz: [
      { q: 'What number do these blocks show?', type: 'num', answer: 134, fig: D.base10(1, 3, 4, {}),
        hint: 'The flat is 100. Count the rods by tens after that: 110, 120, 130. Then count on the ones.', explain: '1 hundred, 3 tens and 4 ones make 134.' },
      { q: 'Which number is <b>one hundred six</b>?', type: 'mc', options: ['16', '106', '160', '1006'], answer: 1,
        hint: 'There is 1 hundred, no tens and 6 ones. What holds the empty tens place?', explain: 'One hundred six is 1 hundred, 0 tens and 6 ones: 106.' },
      { q: 'In <span class="math">185</span>, what is the 8 worth?', type: 'mc', options: ['8', '80', '800', '18'], answer: 1, fig: table(185, 1),
        hint: 'Which place is the 8 in? Look at the colour of its column.', explain: 'The 8 is in the tens place. 8 tens is 80.' },
      { q: 'Which is true?', type: 'mc', options: ['97 &gt; 112', '112 &lt; 97', '97 &lt; 112', '97 = 112'], answer: 2,
        hint: 'Which number has a hundred? That one is greater. The open side faces it.', explain: '112 has a hundred and 97 does not. 97 is less than 112: 97 &lt; 112.' },
      { q: 'Count by 25s. What is missing? <span class="math">100, 125, ___, 175, 200</span>', type: 'num', answer: 150,
        hint: 'Each jump adds 25. What is 125 + 25?', explain: '125 + 25 = 150.' },
      { q: 'About how many dots are there?', type: 'mc', options: ['about 10', 'about 50', 'about 150'], answer: 1, fig: scatter(52, 11, false),
        hint: 'Picture one group of 10 dots. Could you fit about 5 groups, or about 15?', explain: 'There are 52 dots, so about 50 is the best estimate.' },
      { q: 'Which number is <b>odd</b>?', type: 'mc', options: ['64', '120', '38', '151'], answer: 3,
        hint: 'Look at the ones digit of each number. Odd numbers end in 1, 3, 5, 7 or 9.', explain: '151 ends in 1, so it is odd. The others end in 4, 0 and 8, so they are even.' }
    ],

    practice: [
      { id: 'n2-blocks', name: 'Read the blocks', code: 'B1.1', gen: blocksQ },
      { id: 'n2-place', name: 'What a digit is worth', code: 'B1.1', gen: function (lv) {
        var n = R.int(lv === 1 ? 21 : 101, lv === 1 ? 99 : 199), d = hto(n);
        if (lv === 1) {
          var o = R.mc(String(d[1]), [String(d[2]), String(d[1] * 10), String(n)]);
          return { q: 'How many <b>tens</b> are in <span class="math big">' + n + '</span>?', type: 'mc', options: o.options, answer: o.answer, fig: D.num10(n, {}),
            hint: 'Count the green rods. Each rod is one ten.', steps: ['The tens digit is the one on the left: ' + d[1] + '.', 'Count the rods to check: there are ' + d[1] + '.'], explain: n + ' has ' + d[1] + ' tens and ' + d[2] + ' ones.' };
        }
        if (lv === 2) {
          var parts = [100]; if (d[1]) parts.push(d[1] * 10); if (d[2]) parts.push(d[2]);
          return { q: 'Write the number: <span class="math big">' + parts.join(' + ') + '</span>', type: 'num', answer: n, fig: '',
            hint: 'Put 1 in the hundreds place. Then the tens, then the ones. An empty place gets a 0.',
            steps: ['100 means 1 hundred.', (d[1] ? d[1] * 10 + ' means ' + d[1] + ' tens.' : 'There are no tens, so write 0 in the tens place.'), (d[2] ? d[2] + ' means ' + d[2] + ' ones.' : 'There are no ones, so write 0 in the ones place.'), 'The number is ' + n + '.' + table(n)],
            explain: parts.join(' + ') + ' = ' + n + '.' };
        }
        return { q: 'Fill in the missing part: <span class="math big">' + n + ' = 100 + ___ + ' + d[2] + '</span>', type: 'num', answer: d[1] * 10,
          hint: 'What is the tens digit of ' + n + '? A tens digit of ' + d[1] + ' means ' + d[1] + ' tens.',
          steps: ['The tens digit of ' + n + ' is ' + d[1] + '.', d[1] + ' tens is ' + d[1] * 10 + '.', 'Check: 100 + ' + d[1] * 10 + ' + ' + d[2] + ' = ' + n + '.'], explain: n + ' = 100 + ' + d[1] * 10 + ' + ' + d[2] + '.' };
      } },
      { id: 'n2-words', name: 'Number words', code: 'B1.1', gen: function (lv) {
        var n = lv === 1 ? R.int(13, 99) : R.pick([R.int(101, 109), R.int(110, 199), R.int(110, 199), 200]);
        var d = hto(n), wrong = [];
        if (n >= 100) wrong.push(String(100 + d[2] * 10 + d[1]), '1' + (d[1] ? d[1] * 10 + d[2] : '00' + d[2]), String(d[1] * 10 + d[2]));
        else wrong.push(String(d[2] * 10 + d[1]), d[1] + '0' + d[2], String(n + 10));
        wrong = wrong.filter(function (w) { return w !== String(n) && +w > 0; });
        if (lv === 3) {
          var ws = [String(100 + d[2] * 10 + d[1]), String(n + 10 > 200 ? n - 10 : n + 10), String(n - 100 + 10)].filter(function (w) { return +w !== n && +w > 0; }).map(function (w) { return words(+w); });
          var o3 = R.mc(words(n), ws);
          return { q: 'How do we say <span class="math big">' + n + '</span>?', type: 'mc', options: o3.options, answer: o3.answer, fig: table(n),
            hint: 'Say the hundreds first, then the tens and ones together.', steps: ['The 1 in the hundreds place says "one hundred".', 'Then read the last two digits, ' + (n % 100) + ', as "' + (n % 100 ? words(n % 100) : 'nothing more') + '".', 'Together: ' + words(n) + '.'], explain: n + ' is ' + words(n) + '.' };
        }
        var o = R.mc(String(n), wrong);
        return { q: 'Which number is <b>' + words(n) + '</b>?', type: 'mc', options: o.options, answer: o.answer,
          hint: n >= 100 ? 'Write 1 for the hundred, then a digit for the tens and a digit for the ones. Use 0 for an empty place.' : 'The first word tells the tens. The second word tells the ones.',
          steps: [n >= 100 ? '"One hundred" is a 1 in the hundreds place.' : '"' + (n < 20 ? words(n) : tens[d[1]]) + '" tells the tens: ' + d[1] + '.', 'The rest tells the tens and ones: ' + d[1] + ' tens and ' + d[2] + ' ones.', 'The number is ' + n + '.' + table(n)],
          explain: words(n) + ' is ' + n + '.' };
      } },
      { id: 'n2-compare', name: 'Compare and order', code: 'B1.2', gen: function (lv) {
        if (lv < 3) {
          var a, b;
          if (lv === 1) { a = R.int(10, 99); b = R.int(10, 99); }
          else { a = R.int(60, 200); b = R.pick([a + R.pick([-1, 1]) * R.pick([1, 10, 20]), R.int(60, 200), String(a).split('').reverse().join('') * 1]); }
          if (b === a || b > 200 || b < 0) b = a > 100 ? a - 11 : a + 11;
          var sym = a > b ? '&gt;' : '&lt;';
          return { q: 'Which symbol makes this true? <span class="math big">' + a + ' &#9633; ' + b + '</span>', type: 'mc', options: ['&gt;', '&lt;', '='], answer: a > b ? 0 : 1,
            fig: '<div class="vrow"><figure><figcaption>' + a + '</figcaption>' + D.num10(a, { u: 5 }) + '</figure><figure><figcaption>' + b + '</figcaption>' + D.num10(b, { u: 5 }) + '</figure></div>',
            hint: 'Compare the biggest place first. Then decide: the open side faces the greater number.',
            steps: ['Look at the hundreds, then the tens, then the ones.', (a > b ? a + ' is greater.' : b + ' is greater.'), 'The open side faces ' + Math.max(a, b) + ': ' + a + ' ' + sym + ' ' + b + '.'],
            explain: a + ' ' + sym + ' ' + b + '.' };
        }
        var nums = R.shuffle([R.int(30, 99), R.int(100, 140), R.int(141, 200)]);
        while (nums[0] === nums[1]) nums[1]++;
        var up = nums.slice().sort(function (x, y) { return x - y; });
        var o = R.mc(up.join(', '), [up.slice().reverse().join(', '), [up[1], up[0], up[2]].join(', '), [up[0], up[2], up[1]].join(', ')]);
        return { q: 'Put <span class="math">' + nums.join(', ') + '</span> in order from <b>least to greatest</b>.', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Find the least number first. A number with no hundreds is less than one with hundreds.',
          steps: ['The least number is ' + up[0] + '.', 'Next is ' + up[1] + ', then ' + up[2] + '.', D.hops({ min: 0, max: 200, tick: 10, every: 50, id: 'ho', marks: up.map(function (v, i) { return { v: v, t: String(v), up: i % 2 === 0 }; }), bottom: 62 })],
          explain: 'From least to greatest: ' + up.join(', ') + '.' };
      } },
      { id: 'n2-skip', name: 'Skip counting', code: 'B1.4', gen: function (lv) {
        var k = lv === 1 ? R.pick([2, 5, 10]) : R.pick([20, 25, 50]), st = lv === 3 ? R.pick([k === 25 ? 75 : k === 50 ? 50 : 40, 100, k * R.int(1, 3)]) : k * R.int(0, 3);
        if (lv === 3 && k === 20) st = R.pick([10, 30, 50]) + 100 * R.int(0, 1);
        var seq = [];
        for (var i = 0; i < 5; i++) seq.push(st + i * k);
        if (seq[4] > 200) { st = 0; seq = [0, k, 2 * k, 3 * k, 4 * k]; }
        var miss = lv === 1 ? 4 : R.int(1, 4), shown = seq.map(function (v, i) { return i === miss ? '___' : v; });
        var hops = [];
        for (var j = 1; j < 5; j++) hops.push({ a: seq[j - 1], b: seq[j], t: '+' + k });
        return { q: 'Count by ' + k + 's. What number is missing? <span class="math big">' + shown.join(', ') + '</span>', type: 'num', answer: seq[miss],
          fig: lv === 1 ? D.hops({ min: Math.floor(seq[0] / 10) * 10, max: Math.ceil(seq[4] / 10) * 10, tick: k < 10 ? 1 : 5, every: k < 10 ? 5 : 10, id: 'hk', hops: hops.slice(0, miss - 1).concat([]), marks: [] }) : '',
          hint: 'Each jump adds ' + k + '. Start at the number before the gap and add ' + k + '.',
          steps: ['The numbers go up by ' + k + ' each time.', 'The number before the gap is ' + seq[miss - 1] + '.', seq[miss - 1] + ' + ' + k + ' = ' + seq[miss] + '.'],
          explain: seq[miss - 1] + ' + ' + k + ' = ' + seq[miss] + '. The full count is ' + seq.join(', ') + '.' };
      } },
      { id: 'n2-estimate', name: 'Estimate how many', code: 'B1.3', gen: function (lv) {
        var n = lv === 1 ? R.int(15, 45) : lv === 2 ? R.int(45, 120) : R.int(120, 195), choices = lv === 1 ? [10, 20, 30, 40, 50, 100] : [20, 50, 80, 100, 150, 200];
        var best = choices.reduce(function (a, b) { return Math.abs(b - n) < Math.abs(a - n) ? b : a; });
        var wrong = R.shuffle(choices.filter(function (c) { return Math.abs(c - n) >= (lv === 1 ? 12 : 30); })).slice(0, 2);
        var o = R.mc(String(best), wrong.map(String)), sd = R.int(1, 9999);
        return { q: 'About how many dots? Choose the best estimate.', type: 'mc', options: o.options, answer: o.answer, fig: scatter(n, sd, false),
          hint: 'Picture a group of 10 dots. About how many groups like that are in the picture?',
          steps: ['Look at one small patch of about 10 dots.', 'About ' + Math.round(n / 10) + ' patches like that fill the picture.', 'Here are the same dots lined up in tens. There are ' + n + '.<div class="fig">' + rows10(n) + '</div>'],
          explain: 'There are ' + n + ' dots. ' + best + ' is the closest estimate.' };
      } },
      { id: 'n2-evenodd', name: 'Even or odd', code: 'B1.5', gen: function (lv) {
        if (lv === 1) {
          var m = R.int(3, 16);
          return { q: 'Is this number of blocks even or odd?', type: 'mc', options: ['Even', 'Odd'], answer: m % 2, fig: pairs(m).replace(/aria-label="[^"]*"/, 'aria-label="' + m + ' blocks in pairs"'),
            hint: 'Does every block have a partner?', steps: ['Look at each column of two.', m % 2 ? 'The last block has no partner.' : 'Every block has a partner.', m + ' is ' + (m % 2 ? 'odd.' : 'even.')], explain: m + ' is ' + (m % 2 ? 'odd' : 'even') + '.' };
        }
        if (lv === 2) {
          var n = R.int(20, 199);
          return { q: 'Is <span class="math big">' + n + '</span> even or odd?', type: 'mc', options: ['Even', 'Odd'], answer: n % 2,
            hint: 'Only the ones digit decides. Is it 0, 2, 4, 6 or 8?', steps: ['The ones digit of ' + n + ' is ' + n % 10 + '.', n % 10 + ' is ' + (n % 2 ? 'odd' : 'even') + '.', 'So ' + n + ' is ' + (n % 2 ? 'odd.' : 'even.')], explain: n + ' ends in ' + n % 10 + ', so it is ' + (n % 2 ? 'odd' : 'even') + '.' };
        }
        var want = R.pick(['even', 'odd']), list = [], r = want === 'even' ? 0 : 1;
        list.push(2 * R.int(20, 99) + r);
        while (list.length < 4) { var x = 2 * R.int(10, 99) + 1 - r; if (list.indexOf(x) < 0) list.push(x); }
        var o = R.mc(String(list[0]), list.slice(1).map(String));
        return { q: 'Which number is <b>' + want + '</b>?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Look at the ones digit of each number. ' + (want === 'even' ? 'Even numbers end in 0, 2, 4, 6 or 8.' : 'Odd numbers end in 1, 3, 5, 7 or 9.'),
          steps: ['Cover all but the last digit of each number.', 'The ones digits are ' + list.map(function (v) { return v % 10; }).join(', ') + '.', 'Only ' + list[0] + ' ends in an ' + want + ' digit.'],
          explain: list[0] + ' ends in ' + list[0] % 10 + ', so it is ' + want + '.' };
      } }
    ]
  });
})();
