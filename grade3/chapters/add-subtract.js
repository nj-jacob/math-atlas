(function () {
  var A = Atlas, R = A.R;
  var uid = 0;
  function mid(b) { uid++; return b + uid; }
  function dg(n) { return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000)]; }
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var PN = ['ones', 'tens', 'hundreds', 'thousands'];

  /* the column method, with regrouping marks. Addition: carries above. Subtraction: crossed-out digits with new values above. */
  function column(a, b, op) {
    var da = dg(a), db = dg(b), res = op === '+' ? a + b : a - b, dr = dg(res), cols = res >= 1000 || a >= 1000 ? 4 : 3;
    var cw = 84, x0 = 220 - cw * cols / 2 + 30, s = '', top = da.slice(), changed = [0, 0, 0, 0], carry = [0, 0, 0, 0], p;
    if (op === '+') { var c = 0; for (p = 0; p < 4; p++) { var t = da[p] + db[p] + c; c = t >= 10 ? 1 : 0; if (c && p < 3) carry[p + 1] = 1; } }
    else for (p = 0; p < 3; p++) if (top[p] < db[p]) { top[p] += 10; top[p + 1] -= 1; changed[p] = 1; changed[p + 1] = 1; }
    for (p = 0; p < 4; p++) if (top[p] < 0) top[p] += 10;
    function X(i) { return x0 + cw * (cols - 1 - i) + cw / 2; }
    for (p = 0; p < cols; p++) {
      s += '<rect x="' + (X(p) - cw / 2 + 3) + '" y="2" width="' + (cw - 6) + '" height="24" rx="6" style="fill:var(--p' + p + ')"/>' +
        '<text x="' + X(p) + '" y="19" text-anchor="middle" font-size="15" font-weight="700" style="fill:' + (p ? '#fff' : '#13203a') + '">' + PN[p] + '</text>';
      var showA = p < String(a).length, showB = p < String(b).length, showR = p < String(res).length;
      if (op === '+' && carry[p]) s += '<text x="' + X(p) + '" y="52" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--bad)">1</text>';
      if (op === '-' && changed[p] && showA) {
        s += '<text x="' + X(p) + '" y="52" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--bad)">' + top[p] + '</text>';
      }
      if (showA) {
        s += '<text x="' + X(p) + '" y="92" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display)' + (op === '-' && changed[p] ? ';fill:var(--ink2)' : '') + '">' + da[p] + '</text>';
        if (op === '-' && changed[p]) s += '<line x1="' + (X(p) - 14) + '" y1="88" x2="' + (X(p) + 14) + '" y2="70" style="stroke:var(--bad)" stroke-width="3"/>';
      }
      if (showB) s += '<text x="' + X(p) + '" y="136" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display)">' + db[p] + '</text>';
      if (showR) s += '<text x="' + X(p) + '" y="190" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display);fill:var(--p' + p + ')">' + dr[p] + '</text>';
    }
    s += '<text x="' + (X(cols - 1) - cw / 2 - 14) + '" y="136" text-anchor="middle" font-size="36" font-weight="700">' + (op === '+' ? '+' : '&minus;') + '</text>';
    s += '<line x1="' + (X(cols - 1) - cw / 2 - 30) + '" y1="150" x2="' + (X(0) + cw / 2) + '" y2="150" style="stroke:var(--ink)" stroke-width="3"/>';
    return A.svg(440, 202, s, a + (op === '+' ? ' plus ' : ' minus ') + b + ' in columns equals ' + res);
  }
  /* an open number line: not to scale, one jump per place */
  function jumps(start, parts, op) {
    var vals = [start], i;
    parts.forEach(function (p) { vals.push(vals[vals.length - 1] + (op === '+' ? p : -p)); });
    var w = parts.map(function (p) { return Math.max(70, Math.sqrt(p) * 14); }), tot = w.reduce(function (x, y) { return x + y; }, 0);
    var k = 470 / tot, xs = [op === '+' ? 40 : 520];
    w.forEach(function (ww) { xs.push(xs[xs.length - 1] + (op === '+' ? 1 : -1) * ww * k); });
    var s = '<line x1="20" y1="96" x2="540" y2="96" style="stroke:var(--ink)" stroke-width="3"/>';
    for (i = 0; i < vals.length; i++) {
      s += '<line x1="' + xs[i] + '" y1="88" x2="' + xs[i] + '" y2="104" style="stroke:var(--ink)" stroke-width="2.5"/>' +
        '<text x="' + xs[i] + '" y="128" text-anchor="middle" font-size="20" class="tb"' + (i === vals.length - 1 ? ' style="fill:var(--accent)"' : '') + '>' + vals[i] + '</text>';
      if (i) {
        var xa = xs[i - 1], h = Math.min(60, Math.abs(xs[i] - xa) * 0.5 + 12), col = parts[i - 1] >= 100 ? 2 : parts[i - 1] >= 10 ? 1 : 0;
        s += '<path d="M' + xa + ' 92 Q' + ((xa + xs[i]) / 2) + ' ' + (92 - h * 2) + ' ' + xs[i] + ' 92" fill="none" style="stroke:var(--p' + col + ')" stroke-width="3"/>' +
          '<text x="' + ((xa + xs[i]) / 2) + '" y="' + (92 - h - 6) + '" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--p' + col + ')">' + (op === '+' ? '+' : '&minus;') + parts[i - 1] + '</text>';
      }
    }
    s += '<circle cx="' + xs[0] + '" cy="96" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 136, s, 'Open number line: start at ' + start + ', ' + parts.map(function (p) { return (op === '+' ? 'add ' : 'take away ') + p; }).join(', then ') + ', to land on ' + vals[vals.length - 1]);
  }
  function splitPlaces(n) { var d = dg(n), out = []; if (d[2] || d[3]) out.push(d[3] * 1000 + d[2] * 100); if (d[1]) out.push(d[1] * 10); if (d[0]) out.push(d[0]); return out; }
  /* a pan balance with an expression on each side */
  function balance(left, right, ok) {
    var tilt = ok ? 0 : 8, s = '';
    s += '<polygon points="280,170 250,210 310,210" style="fill:var(--ink2)"/><line x1="280" y1="60" x2="280" y2="172" style="stroke:var(--ink2)" stroke-width="6"/>';
    s += '<g transform="rotate(' + tilt + ' 280 60)"><line x1="90" y1="60" x2="470" y2="60" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>';
    [[110, left], [450, right]].forEach(function (pn) {
      s += '<line x1="' + pn[0] + '" y1="60" x2="' + (pn[0] - 60) + '" y2="120" style="stroke:var(--ink2)" stroke-width="2"/><line x1="' + pn[0] + '" y1="60" x2="' + (pn[0] + 60) + '" y2="120" style="stroke:var(--ink2)" stroke-width="2"/>' +
        '<path d="M' + (pn[0] - 80) + ' 120 H' + (pn[0] + 80) + ' Q' + pn[0] + ' 160 ' + (pn[0] - 80) + ' 120Z" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="2.5"/>' +
        '<text x="' + pn[0] + '" y="110" text-anchor="middle" font-size="24" font-weight="700" style="font-family:var(--display)">' + pn[1] + '</text>';
    });
    s += '</g><circle cx="280" cy="60" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 216, s, 'Balance: ' + left.replace(/<[^>]+>/g, '') + ' on the left, ' + right.replace(/<[^>]+>/g, '') + ' on the right. ' + (ok ? 'It is level.' : 'It is not level.'));
  }
  function regroupText(a, b, op) {
    var da = dg(a), db = dg(b), out = [], p;
    if (op === '+') {
      var c = 0;
      for (p = 0; p < 3; p++) {
        var t = da[p] + db[p] + c;
        out.push('<b class="c' + p + 't">' + PN[p] + '</b>: ' + da[p] + ' + ' + db[p] + (c ? ' + 1' : '') + ' = ' + t + (t >= 10 ? '. That is 10 or more, so write ' + (t - 10) + ' and carry 1 to the ' + PN[p + 1] + '.' : '.'));
        c = t >= 10 ? 1 : 0;
        if (p === 2 && c) out.push('<b class="c3t">thousands</b>: write the carried 1.');
      }
    } else {
      var top = da.slice();
      for (p = 0; p < 3; p++) {
        if (top[p] < 0) { top[p] += 10; }
        if (top[p] < db[p]) {
          var from = top[p + 1] > 0 ? 'trade 1 ' + PN[p + 1].slice(0, -1) + ' for 10 ' + PN[p] : 'there are no ' + PN[p + 1] + ', so trade 1 hundred for 10 tens first, then 1 ten for 10 ones';
          out.push('<b class="c' + p + 't">' + PN[p] + '</b>: ' + top[p] + ' is less than ' + db[p] + ', so ' + from + '. Now ' + (top[p] + 10) + ' &minus; ' + db[p] + ' = ' + (top[p] + 10 - db[p]) + '.');
          top[p] += 10; top[p + 1] -= 1;
        } else out.push('<b class="c' + p + 't">' + PN[p] + '</b>: ' + top[p] + ' &minus; ' + db[p] + ' = ' + (top[p] - db[p]) + '.');
      }
    }
    return out;
  }

  A.register('add-subtract', {
    html:
'<section class="sec"><h2><span class="n">1</span>Adding with blocks and columns</h2>' +
'<p>To add, put the blocks together. If you get <b>10 or more</b> of one kind, trade 10 of them for 1 of the next bigger kind. This is called <b>regrouping</b>.</p>' +
'<p>The column method does the same thing with digits. Line up the places. Add the ones first, then the tens, then the hundreds.</p>' +
'<div class="lab"><span class="lt">Try it: add in columns</span>' +
'<div class="ctrl"><label for="ada">First number<input type="number" id="ada" min="0" max="999" value="368"></label><label for="adb">Second number<input type="number" id="adb" min="0" max="999" value="257"></label></div>' +
'<div class="vrow" id="adblk"></div><div class="fig" id="adcol"></div><div class="out" id="adout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Always start with the <b>ones</b>. Then a carried 1 has a place to go.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Add 245 + 138. Ones: 5 + 8 = 13. Write 3, carry 1 ten. Tens: 4 + 3 + 1 = 8. Hundreds: 2 + 1 = 3. The answer is <b>383</b>.</p><div class="fig">' + column(245, 138, '+') + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Subtracting with blocks and columns</h2>' +
'<p>To subtract, take blocks away. If there are not enough of one kind, trade 1 bigger block for 10 smaller ones first. Then take away.</p>' +
'<div class="lab"><span class="lt">Try it: subtract in columns</span>' +
'<div class="ctrl"><label for="sba">Start with<input type="number" id="sba" min="0" max="1000" value="503"></label><label for="sbb">Take away<input type="number" id="sbb" min="0" max="1000" value="267"></label></div>' +
'<div class="vrow" id="sbblk"></div><div class="fig" id="sbcol"></div><div class="out" id="sbout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Taking the smaller digit from the bigger one, whichever is on top. In 52 &minus; 17, you cannot do 7 &minus; 2. Trade a ten: 12 &minus; 7 = 5 ones. The answer is 35, not 45.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Subtract 400 &minus; 156. There are no ones or tens to take from. Trade 1 hundred for 10 tens, then 1 ten for 10 ones. Now 10 &minus; 6 = 4, 9 &minus; 5 = 4, 3 &minus; 1 = 2. The answer is <b>244</b>.</p><div class="fig">' + column(400, 156, '-') + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Mental math: jump on a number line</h2>' +
'<p>You can add or subtract in your head by making jumps. Keep the first number whole. Jump by the hundreds, then the tens, then the ones.</p>' +
'<div class="lab"><span class="lt">Try it: make the jumps</span>' +
'<div class="ctrl"><label for="jma">Start at<input type="number" id="jma" min="0" max="1000" value="246"></label>' +
'<label for="jmo">Do<select id="jmo"><option value="+">add</option><option value="-">take away</option></select></label>' +
'<label for="jmb">This much<input type="number" id="jmb" min="0" max="1000" value="132"></label></div>' +
'<div class="fig" id="jmfig"></div><div class="out" id="jmout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Friendly numbers make mental math easy. To add 99, add 100 and then take away 1. 245 + 99 = 345 &minus; 1 = <b>344</b>.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find 500 &minus; 270 by counting up. From 270, jump 30 to reach 300. Then jump 200 to reach 500. 30 + 200 = <b>230</b>.</p><div class="fig">' + jumps(270, [30, 200], '+') + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Estimate first, then check</h2>' +
'<p>An <b>estimate</b> is a close answer that is easy to find. Round each number, then add or subtract. If your exact answer is far from the estimate, check your work.</p>' +
'<div class="lab"><span class="lt">Try it: estimate and compare</span>' +
'<div class="ctrl"><label for="esa">First number<input type="number" id="esa" min="0" max="999" value="487"></label>' +
'<label for="eso">Do<select id="eso"><option value="+">add</option><option value="-">subtract</option></select></label>' +
'<label for="esb">Second number<input type="number" id="esb" min="0" max="999" value="312"></label>' +
'<label for="esr">Round to the nearest<select id="esr"><option value="10">ten</option><option value="100" selected>hundred</option></select></label></div>' +
'<div class="fig" id="esfig"></div><div class="out" id="esout" aria-live="polite"></div></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Sam says 389 + 204 = 893. Estimate: 400 + 200 = 600. 893 is far from 600, so Sam should check. The real answer is <b>593</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Using the estimate as the answer. An estimate tells you <b>about</b> how big the answer is. You still work out the exact answer.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Both sides are equal</h2>' +
'<p>The <b>=</b> sign means "is the same as". The two sides of an equation balance, like a pan balance. <span class="math">300 + 250 = 500 + 50</span> is true, because both sides are 550.</p>' +
'<div class="lab"><span class="lt">Try it: balance the two sides</span>' +
'<div class="ctrl"><label for="bla">Left side: first number<input type="number" id="bla" min="0" max="500" value="300"></label><label for="blb">Left side: second number<input type="number" id="blb" min="0" max="500" value="250"></label>' +
'<label for="blc">Right side: first number<input type="number" id="blc" min="0" max="1000" value="500"></label></div>' +
'<div class="fig" id="blfig"></div><div class="out" id="blout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>If you take some from one part and give it to the other part, the total stays the same. 398 + 245 = 400 + 243.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find the missing number: <span class="math">120 + 80 = 150 + ___</span>. The left side is 200. 150 + 50 = 200, so the missing number is <b>50</b>.</p><div class="fig">' + balance('120 + 80', '150 + 50', true) + '</div></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'Add the ones first: <span class="math">47 + 25</span>. What is 7 + 5?', options: ['2', '12', '72'], answer: 1, why: 'Add just the ones digits: 7 + 5.' },
        { q: '7 + 5 = 12 ones. What do you write in the ones place?', options: ['1', '2', '12'], answer: 1, why: '12 ones is 1 ten and 2 ones. Write the 2 and carry the 1 ten.' },
        { q: 'What is <span class="math">47 + 25</span>?', options: ['62', '72', '612'], answer: 1, why: 'Tens: 4 + 2 + the carried 1 = 7. Ones: 2. The answer is 72.' }
      ],
      s2: [
        { q: 'In <span class="math">52 &minus; 17</span>, can you take 7 ones from 2 ones?', options: ['Yes', 'No'], answer: 1, why: '2 is less than 7. You need to trade a ten first.' },
        { q: 'Trade 1 ten for 10 ones. Now you have how many ones?', options: ['10', '12', '20'], answer: 1, why: 'You had 2 ones. 10 more makes 12.' },
        { q: 'What is <span class="math">52 &minus; 17</span>?', options: ['35', '45', '25'], answer: 0, why: 'Ones: 12 &minus; 7 = 5. Tens: 4 &minus; 1 = 3. The answer is 35.' }
      ],
      s3: [
        { q: 'What is <span class="math">460 + 300</span>?', options: ['490', '760', '763'], answer: 1, why: 'Add 3 hundreds. Only the hundreds digit changes: 4 + 3 = 7.' },
        { q: 'What is <span class="math">245 + 99</span>?', options: ['334', '344', '345'], answer: 1, why: 'Add 100 to get 345, then take away 1.' },
        { q: 'Count up from 680 to 700. How far is it?', options: ['20', '30', '120'], answer: 0, why: '680, 690, 700. That is 2 jumps of 10.' }
      ],
      s4: [
        { q: 'Round to the nearest hundred, then add: <span class="math">312 + 487</span>. What is the estimate?', options: ['700', '800', '900'], answer: 1, why: '312 rounds to 300. 487 rounds to 500. 300 + 500 = 800.' },
        { q: 'Mia says <span class="math">612 &minus; 298 = 414</span>. Estimate: 600 &minus; 300 = 300. Is her answer reasonable?', options: ['Yes', 'No, check it'], answer: 1, why: '414 is far from 300. The real answer is 314.' },
        { q: 'Which is the best estimate for <span class="math">49 + 32</span>?', options: ['50 + 30 = 80', '40 + 30 = 70', '50 + 40 = 90'], answer: 0, why: 'Round each number to the nearest ten: 49 rounds to 50, 32 rounds to 30.' }
      ],
      s5: [
        { q: 'Is <span class="math">200 + 50 = 150 + 100</span> true?', options: ['True', 'False'], answer: 0, why: 'Work out each side: 200 + 50 = 250 and 150 + 100 = 250.' },
        { q: 'Find the missing number: <span class="math">400 + 30 = 420 + ___</span>', options: ['10', '20', '30'], answer: 0, why: 'The left side is 430. 420 + 10 = 430.' },
        { q: 'Is <span class="math">90 + 15 = 100 + 15</span> true?', options: ['True', 'False'], answer: 1, why: 'The left side is 105. The right side is 115. They are not equal.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function addW() {
        var a = clamp($('#ada', root).value, 0, 999), b = clamp($('#adb', root).value, 0, 999);
        if (a + b > 1000) b = 1000 - a;
        $('#adblk', root).innerHTML = '<figure><figcaption>' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure><figure><figcaption>+ ' + b + '</figcaption>' + A.draw.blocks(b, 'Blocks for ' + b, 330, 4) + '</figure>' +
          '<figure><figcaption>Together: ' + (a + b) + '</figcaption>' + A.draw.blocks(a + b, 'Blocks for ' + (a + b), 330, 4) + '</figure>';
        $('#adcol', root).innerHTML = column(a, b, '+');
        $('#adout', root).innerHTML = '<p><span class="big">' + a + ' + ' + b + ' = ' + (a + b) + '</span></p><ol>' + regroupText(a, b, '+').map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol>' +
          (+$('#adb', root).value > b ? '<p class="t2">This chapter keeps totals up to 1000, so the second number was set to ' + b + '.</p>' : '');
      }
      A.bind(root, ['ada', 'adb'], addW);
      function subW() {
        var a = clamp($('#sba', root).value, 0, 1000), b = clamp($('#sbb', root).value, 0, 1000), note = '';
        if (b > a) { note = '<p class="t2">You cannot take away more than you have here, so the numbers were swapped.</p>'; var t = a; a = b; b = t; }
        var res = a - b;
        $('#sbblk', root).innerHTML = '<figure><figcaption>Start: ' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure><figure><figcaption>Left after taking ' + b + ': ' + res + '</figcaption>' + A.draw.blocks(res, 'Blocks for ' + res, 330, 4) + '</figure>';
        $('#sbcol', root).innerHTML = column(a, b, '-');
        $('#sbout', root).innerHTML = '<p><span class="big">' + a + ' &minus; ' + b + ' = ' + res + '</span></p><ol>' + regroupText(a, b, '-').map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol>' +
          '<p class="t2">Check: ' + res + ' + ' + b + ' = ' + a + '.</p>' + note;
      }
      A.bind(root, ['sba', 'sbb'], subW);
      function jm() {
        var a = clamp($('#jma', root).value, 0, 1000), op = $('#jmo', root).value, b = clamp($('#jmb', root).value, 0, 1000), note = '';
        if (op === '+' && a + b > 1000) { b = 1000 - a; note = 'To stay at 1000 or less, the jump was set to ' + b + '. '; }
        if (op === '-' && b > a) { b = a; note = 'You cannot go below 0 here, so the jump was set to ' + b + '. '; }
        var parts = splitPlaces(b);
        if (!parts.length) { $('#jmfig', root).innerHTML = ''; $('#jmout', root).innerHTML = '<p>' + note + 'There is nothing to jump. ' + a + (op === '+' ? ' + 0 = ' : ' &minus; 0 = ') + a + '.</p>'; return; }
        var res = op === '+' ? a + b : a - b;
        $('#jmfig', root).innerHTML = jumps(a, parts, op);
        $('#jmout', root).innerHTML = '<p><span class="big">' + a + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + ' = ' + res + '</span></p><p>' + note + 'Split ' + b + ' into ' + parts.join(' + ') + '. Make one jump for each part.</p>';
      }
      A.bind(root, ['jma', 'jmo', 'jmb'], jm);
      function es() {
        var a = clamp($('#esa', root).value, 0, 999), b = clamp($('#esb', root).value, 0, 999), op = $('#eso', root).value, p = +$('#esr', root).value;
        if (op === '-' && b > a) { var t = a; a = b; b = t; }
        var ra = Math.floor((a + p / 2) / p) * p, rb = Math.floor((b + p / 2) / p) * p, est = op === '+' ? ra + rb : ra - rb, ex = op === '+' ? a + b : a - b, sym = op === '+' ? '+' : '&minus;';
        var hi = Math.max(est, ex, 100), top = Math.ceil(hi / 100) * 100 + 100, s = '';
        s += '<line x1="30" y1="60" x2="530" y2="60" style="stroke:var(--ink)" stroke-width="2.5"/>';
        for (var v = 0; v <= top; v += 100) { var x = 30 + 500 * v / top; s += '<line x1="' + x + '" y1="52" x2="' + x + '" y2="68" style="stroke:var(--ink)" stroke-width="2"/>' + (top <= 1200 || v % 200 === 0 ? '<text x="' + x + '" y="88" text-anchor="middle" font-size="16">' + v + '</text>' : ''); }
        var xe = 30 + 500 * est / top, xx = 30 + 500 * ex / top;
        s += '<circle cx="' + xe + '" cy="60" r="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + xe + '" y="34" text-anchor="middle" font-size="17" class="tb">estimate ' + est + '</text>';
        s += '<circle cx="' + xx + '" cy="60" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/><text x="' + xx + '" y="' + (Math.abs(xx - xe) < 110 ? 112 : 34) + '" text-anchor="middle" font-size="17" class="tb">exact ' + ex + '</text>';
        $('#esfig', root).innerHTML = A.svg(560, 118, s, 'Number line: the estimate ' + est + ' and the exact answer ' + ex);
        $('#esout', root).innerHTML = '<p>Round: ' + a + ' &#8776; ' + ra + ' and ' + b + ' &#8776; ' + rb + '.</p><p><b>Estimate:</b> ' + ra + ' ' + sym + ' ' + rb + ' = <b>' + est + '</b>. <b>Exact:</b> ' + a + ' ' + sym + ' ' + b + ' = <b>' + ex + '</b>.</p><p>They are ' + Math.abs(est - ex) + ' apart.</p>';
      }
      A.bind(root, ['esa', 'esb', 'eso', 'esr'], es);
      function bl() {
        var a = clamp($('#bla', root).value, 0, 500), b = clamp($('#blb', root).value, 0, 500), c = clamp($('#blc', root).value, 0, 1000), tot = a + b, m = tot - c;
        if (m < 0) {
          $('#blfig', root).innerHTML = balance(a + ' + ' + b, c + ' + ?', false);
          $('#blout', root).innerHTML = '<p>The left side is ' + tot + '. The right side already has ' + c + ', which is more than ' + tot + '. No whole number can balance it. Try a smaller number on the right.</p>';
          return;
        }
        $('#blfig', root).innerHTML = balance(a + ' + ' + b, c + ' + <tspan style="fill:var(--accent)">' + m + '</tspan>', true);
        $('#blout', root).innerHTML = '<p><span class="big">' + a + ' + ' + b + ' = ' + c + ' + ' + m + '</span></p><p>The left side is ' + tot + '. ' + c + ' + ' + m + ' = ' + tot + ', so the missing number is <b>' + m + '</b>.</p>';
      }
      A.bind(root, ['bla', 'blb', 'blc'], bl);
    },

    quiz: [
      { q: 'What is <span class="math">356 + 278</span>?', type: 'num', answer: 634,
        hint: 'Add the ones first: 6 + 8 = 14. Write 4 and carry 1.', explain: 'Ones: 14, write 4 carry 1. Tens: 5 + 7 + 1 = 13, write 3 carry 1. Hundreds: 3 + 2 + 1 = 6. The answer is 634.' },
      { q: 'What is <span class="math">700 &minus; 245</span>?', type: 'num', answer: 455,
        hint: 'There are no tens or ones in 700. Trade 1 hundred for 10 tens, then 1 ten for 10 ones.', explain: '700 becomes 6 hundreds, 9 tens, 10 ones. 10 &minus; 5 = 5, 9 &minus; 4 = 5, 6 &minus; 2 = 4. The answer is 455.' },
      { q: 'Which jumps show <span class="math">325 + 140</span>?', type: 'mc', options: ['325 &rarr; 425 &rarr; 465', '325 &rarr; 340 &rarr; 465', '325 &rarr; 365 &rarr; 375'], answer: 0, fig: jumps(325, [100, 40], '+'),
        hint: 'Split 140 into 100 and 40. Jump 100 first.', explain: '325 + 100 = 425. 425 + 40 = 465.' },
      { q: 'What is <span class="math">399 + 250</span>? Use a friendly number.', type: 'num', answer: 649,
        hint: '399 is 1 less than 400. Add 400 + 250, then take away 1.', explain: '400 + 250 = 650. 650 &minus; 1 = 649.' },
      { q: 'Round each number to the nearest hundred to estimate <span class="math">612 + 291</span>.', type: 'mc', options: ['800', '900', '1000', '903'], answer: 1,
        hint: '612 rounds to 600. What does 291 round to?', explain: '600 + 300 = 900. The exact answer, 903, is close.' },
      { q: 'Find the missing number: <span class="math">250 + 150 = 300 + ___</span>', type: 'num', answer: 100, fig: balance('250 + 150', '300 + ?', true),
        hint: 'Work out the left side first.', explain: 'The left side is 400. 300 + 100 = 400.' },
      { q: 'A school library has 834 books. 258 books are signed out. How many books are still on the shelves?', type: 'num', answer: 576,
        hint: 'Books on the shelves = all the books &minus; the books signed out.', explain: '834 &minus; 258 = 576. Check: 576 + 258 = 834.' }
    ],

    practice: [
      { id: 'as-add', name: 'Add in columns', code: 'B2.5', gen: function (lv) {
        var a, b, ok = false;
        while (!ok) {
          a = R.int(lv === 1 ? 20 : 100, lv === 1 ? 599 : 699); b = R.int(lv === 1 ? 10 : 100, 1000 - a);
          var da = dg(a), db = dg(b), c0 = da[0] + db[0] >= 10, c1 = da[1] + db[1] + (c0 ? 1 : 0) >= 10;
          ok = lv === 1 ? !c0 && !c1 : lv === 2 ? (c0 !== c1) : (c0 && c1);
          if (a + b > 1000) ok = false;
        }
        var st = regroupText(a, b, '+');
        return { q: 'What is <span class="math">' + a + ' + ' + b + '</span>?', type: 'num', answer: a + b,
          fig: lv === 1 ? '<div class="vrow"><figure><figcaption>' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure><figure><figcaption>+ ' + b + '</figcaption>' + A.draw.blocks(b, 'Blocks for ' + b, 330, 4) + '</figure></div>' : '',
          hint: 'Line up the places. Add the ones first. If you get 10 or more, carry 1 to the next place.',
          steps: st.concat(['The answer is ' + (a + b) + '.<div class="fig">' + column(a, b, '+') + '</div>']),
          explain: a + ' + ' + b + ' = ' + (a + b) + '.' };
      } },
      { id: 'as-sub', name: 'Subtract in columns', code: 'B2.5', gen: function (lv) {
        var a, b, ok = false;
        while (!ok) {
          if (lv === 3) { a = R.int(1, 9) * 100 + R.pick([0, R.int(1, 9)]) ; if (a % 100 >= 10) a = Math.floor(a / 100) * 100 + R.int(0, 9); }
          else a = R.int(lv === 1 ? 30 : 120, 999);
          b = R.int(10, a - 1);
          var da = dg(a), db = dg(b), bo0 = da[0] < db[0], bo1 = da[1] - (bo0 ? 1 : 0) < db[1];
          ok = lv === 1 ? !bo0 && !bo1 : lv === 2 ? (bo0 !== bo1) : (bo0 && bo1 && da[1] === 0);
        }
        return { q: 'What is <span class="math">' + a + ' &minus; ' + b + '</span>?', type: 'num', answer: a - b,
          fig: lv === 1 ? A.draw.blocks(a, 'Blocks for ' + a, 540, 5) : '',
          hint: lv === 3 ? 'There are no tens to trade. Trade 1 hundred for 10 tens first, then 1 ten for 10 ones.' : 'Start with the ones. If the top digit is smaller, trade 1 from the next place first.',
          steps: regroupText(a, b, '-').concat(['The answer is ' + (a - b) + '. Check: ' + (a - b) + ' + ' + b + ' = ' + a + '.<div class="fig">' + column(a, b, '-') + '</div>']),
          explain: a + ' &minus; ' + b + ' = ' + (a - b) + '.' };
      } },
      { id: 'as-mental', name: 'Mental math', code: 'B2.3', gen: function (lv) {
        var a, b, op = R.pick(['+', '-']), hint, steps;
        if (lv === 1) {
          var unit = R.pick([10, 100]);
          b = R.int(1, unit === 10 ? 9 : 4) * unit;
          a = R.int(1, 50) * 10 + R.int(0, 9);
          if (op === '+' && a + b > 1000) op = '-';
          if (op === '-' && b > a) op = '+';
          hint = 'Only the ' + (unit === 10 ? 'tens' : 'hundreds') + ' digit should change' + (unit === 10 ? ', unless you pass a hundred.' : '.');
          steps = ['Split nothing: ' + b + ' is all ' + (unit === 10 ? 'tens' : 'hundreds') + '.', 'Jump ' + (op === '+' ? 'forward ' : 'back ') + b + ' from ' + a + '.', 'You land on ' + (op === '+' ? a + b : a - b) + '.<div class="fig">' + jumps(a, [b], op) + '</div>'];
        } else if (lv === 2) {
          var near = R.pick([99, 199, 299, 98, 101, 201]);
          a = R.int(12, 60) * 10 + R.int(0, 9); b = near; op = '+';
          if (a + b > 1000) a = R.int(100, 400);
          var fr = Math.round(near / 100) * 100, diff = fr - near;
          hint = b + ' is close to ' + fr + '. Add ' + fr + ', then fix it.';
          steps = [b + ' is ' + (diff > 0 ? diff + ' less than ' : -diff + ' more than ') + fr + '.', a + ' + ' + fr + ' = ' + (a + fr) + '.', (diff > 0 ? 'Take away ' + diff : 'Add ' + (-diff)) + ': ' + (a + b) + '.'];
        } else {
          b = R.int(11, 60) * 10 + R.pick([0, 0, 5]); a = R.pick([500, 600, 700, 800, 900, 1000]); op = '-';
          if (b >= a) b = a - R.int(11, 40) * 5;
          var nh = Math.ceil(b / 100) * 100;
          hint = 'Count up from ' + b + ' to ' + a + '. Jump to the next hundred first.';
          steps = ['From ' + b + ', jump ' + (nh - b) + ' to reach ' + nh + '.', 'From ' + nh + ', jump ' + (a - nh) + ' to reach ' + a + '.', (nh - b) + ' + ' + (a - nh) + ' = ' + (a - b) + '.<div class="fig">' + jumps(b, [nh - b, a - nh].filter(function (x) { return x; }), '+') + '</div>'];
        }
        var res = op === '+' ? a + b : a - b;
        return { q: 'Use mental math: <span class="math">' + a + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '</span>', type: 'num', answer: res, hint: hint, steps: steps,
          explain: a + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + ' = ' + res + '.' };
      } },
      { id: 'as-estimate', name: 'Estimate by rounding', code: 'B2.3', gen: function (lv) {
        var p = lv === 1 ? 10 : 100, a = lv === 1 ? R.int(11, 89) : R.int(110, 690), b = lv === 1 ? R.int(11, 89) : R.int(110, 1000 - a - 10), op = lv === 3 ? '-' : '+';
        if (op === '-' && b > a) { var t = a; a = b; b = t; }
        if (lv === 1 && op === '+' && (a % 10 === 5 || b % 10 === 5)) a += 1;
        var ra = Math.floor((a + p / 2) / p) * p, rb = Math.floor((b + p / 2) / p) * p, est = op === '+' ? ra + rb : ra - rb;
        var o = R.mc(est, [est + p, est - p, op === '+' ? a + b : a - b].filter(function (v) { return v !== est && v >= 0; }));
        var nm = p === 10 ? 'ten' : 'hundred', sym = op === '+' ? '+' : '&minus;';
        return { q: 'Round each number to the nearest ' + nm + ' to estimate <span class="math">' + a + ' ' + sym + ' ' + b + '</span>.', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Round ' + a + ' first. Then round ' + b + '. Then ' + (op === '+' ? 'add' : 'subtract') + '.',
          steps: [a + ' rounds to ' + ra + '.', b + ' rounds to ' + rb + '.', ra + ' ' + sym + ' ' + rb + ' = ' + est + '.'],
          explain: 'The estimate is ' + est + '. The exact answer is ' + (op === '+' ? a + b : a - b) + ', which is close.' };
      } },
      { id: 'as-equal', name: 'Missing number to balance', code: 'C2.3', gen: function (lv) {
        var a, b, c, m, left, right;
        if (lv < 3) {
          a = R.int(1, lv === 1 ? 5 : 40) * (lv === 1 ? 100 : 10); b = R.int(1, lv === 1 ? 4 : 30) * (lv === 1 ? 100 : 10);
          c = R.int(1, Math.max(1, Math.floor((a + b) / 10) - 1)) * 10; m = a + b - c;
          left = a + ' + ' + b; right = c + ' + ___';
        } else {
          a = R.int(30, 90) * 10; b = R.int(1, Math.floor(a / 10) - 1) * 10; c = R.int(a - b + 10, 990); m = c - (a - b);
          left = a + ' &minus; ' + b; right = c + ' &minus; ___';
        }
        return { q: 'Find the missing number: <span class="math">' + left + ' = ' + right + '</span>', type: 'num', answer: m,
          fig: balance(left, right.replace('___', '?'), true),
          hint: 'Work out the left side first. Then ask what the right side needs to match it.',
          steps: ['The left side is ' + (lv < 3 ? a + b : a - b) + '.', lv < 3 ? c + ' + ? = ' + (a + b) + '. Count up from ' + c + ' to ' + (a + b) + '.' : c + ' &minus; ? = ' + (a - b) + '. Take away from ' + c + ' until you reach ' + (a - b) + '.', 'The missing number is ' + m + '.'],
          explain: left + ' = ' + right.replace('___', m) + '. Both sides are ' + (lv < 3 ? a + b : a - b) + '.' };
      } },
      { id: 'as-word', name: 'Word problems', code: 'B2.5', gen: function (lv) {
        var T = [
          { op: '+', t: function (a, b) { return 'A school has ' + a + ' students. ' + b + ' more students join. How many students are there now?'; } },
          { op: '+', t: function (a, b) { return 'Ava read ' + a + ' pages in May and ' + b + ' pages in June. How many pages did she read in all?'; } },
          { op: '-', t: function (a, b) { return 'A farm had ' + a + ' apples. It sold ' + b + ' apples. How many apples are left?'; } },
          { op: '-', t: function (a, b) { return 'A hike is ' + a + ' metres long. Leo has walked ' + b + ' metres. How many metres are left to walk?'; } },
          { op: '-', t: function (a, b) { return 'Box A holds ' + a + ' beads. Box B holds ' + b + ' beads. How many more beads are in Box A?'; } }
        ];
        var tp = R.pick(T), a, b;
        if (tp.op === '+') { a = R.int(lv === 1 ? 100 : 150, lv === 1 ? 500 : 700); b = R.int(lv === 1 ? 100 : 120, 1000 - a); if (lv === 1) { a = Math.floor(a / 10) * 10; b = Math.floor(b / 10) * 10 + R.int(0, 9 - a % 10); } }
        else { a = R.int(lv === 1 ? 300 : 400, 1000); b = R.int(lv === 1 ? 100 : 150, a - 50); if (lv === 1) b = Math.floor(b / 100) * 100 + Math.min(a % 100, R.int(0, 99)); }
        if (b < 1) b = 1;
        if (tp.op === '+' && a + b > 1000) b = 1000 - a;
        var res = tp.op === '+' ? a + b : a - b, sym = tp.op === '+' ? '+' : '&minus;';
        return { q: tp.t(a, b), type: 'num', answer: res,
          hint: tp.op === '+' ? 'Things are being put together, so add.' : 'Something is taken away or compared, so subtract.',
          steps: ['Decide: ' + (tp.op === '+' ? 'put together, so add.' : 'take away or compare, so subtract.'), 'Write it: ' + a + ' ' + sym + ' ' + b + '.', a + ' ' + sym + ' ' + b + ' = ' + res + '.'],
          explain: a + ' ' + sym + ' ' + b + ' = ' + res + '.' };
      } }
    ]
  });
})();
