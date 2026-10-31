(function () {
  var A = Atlas, R = A.R;
  var M = '&minus;';
  var PEOPLE = ['Mia', 'Leo', 'Ava', 'Noah', 'Zoe', 'Sam', 'Priya', 'Omar', 'Lily', 'Ben', 'Aiyana', 'Mei', 'Jack', 'Sofia'];
  function seq(a, n, step) { var o = []; for (var i = 0; i < n; i++) o.push(a + i * (step || 1)); return o; }
  function eqn(s) { return '<span class="math">' + s + '</span>'; }
  function tn(n) { return Math.floor(n / 10); }

  /* two ten frames: a red, then b yellow, with the first frame filled first (make a ten) */
  function makeTen(a, b) { return A.draw.frames(a, { b: b, c: 24, r: 2, min: 20 }); }
  /* number line jumps: first by tens, then by ones */
  function jumps(start, add, back) {
    var t = tn(add), o = add % 10, h = [], x = start, d = back ? -1 : 1;
    for (var i = 0; i < t; i++) { h.push([x, x + 10 * d, (back ? '−' : '+') + '10']); x += 10 * d; }
    for (var j = 0; j < o; j++) { h.push([x, x + d]); x += d; }
    var lo = Math.max(0, Math.min(start, x) - 2), hi = Math.min(50, Math.max(start, x) + 2);
    if (hi - lo < 10) { hi = Math.min(50, lo + 10); lo = Math.max(0, hi - 10); }
    return A.draw.nl(lo, hi, { mark: start, hops: h, lab: hi - lo > 12 ? 5 : 1, label: 'Number line: start at ' + start + ', jump ' + (back ? 'back ' : '') + add + ' to ' + x });
  }
  /* a balance: left and right pans with counters; tilts toward the heavier side */
  function balance(l, r, ltext, rtext) {
    var tilt = l === r ? 0 : l > r ? -8 : 8, s = '', cx = 220, cy = 60;
    s += '<path d="M' + (cx - 30) + ' 196H' + (cx + 30) + 'L' + cx + ' 62Z" style="fill:var(--line);stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
    s += '<g transform="rotate(' + tilt + ' ' + cx + ' ' + cy + ')"><line x1="' + (cx - 160) + '" y1="' + cy + '" x2="' + (cx + 160) + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/></g>';
    var rad = tilt * Math.PI / 180;
    [[-1, l, ltext], [1, r, rtext]].forEach(function (side) {
      var px = cx + side[0] * 150 * Math.cos(rad), py = cy + side[0] * 150 * Math.sin(rad);
      s += '<line x1="' + px + '" y1="' + py + '" x2="' + px + '" y2="' + (py + 40) + '" style="stroke:var(--ink2)" stroke-width="2"/>';
      s += '<path d="M' + (px - 62) + ' ' + (py + 40) + 'H' + (px + 62) + 'Q' + px + ' ' + (py + 80) + ' ' + (px - 62) + ' ' + (py + 40) + 'Z" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
      for (var i = 0; i < Math.min(side[1], 20); i++) s += A.draw.counter(px - 50 + (i % 10) * 11, py + 34 - Math.floor(i / 10) * 11, 5, 0);
      s += '<text x="' + px + '" y="' + (py + 108) + '" text-anchor="middle" font-size="22" class="tb">' + side[2] + '</text>';
    });
    return A.svg(440, 215, s, 'A balance. Left side ' + ltext + ', right side ' + rtext + '. ' + (l === r ? 'It is level: the sides are equal.' : 'It tips down on the ' + (l > r ? 'left' : 'right') + ' side, which is more.'));
  }

  function q20(lv) {
    var a, b, sub = lv === 3 && R.int(0, 1);
    if (lv === 1) { a = 9; b = R.int(2, 9); }
    else { a = R.int(6, 9); b = R.int(11 - a, 9); }
    if (R.int(0, 1) && !sub) { var t = a; a = b; b = t; }
    var c = a + b, big = Math.max(a, b), small = Math.min(a, b), need = 10 - big;
    if (sub) {
      return { q: 'What is ' + eqn(c + ' ' + M + ' ' + small) + '?', type: 'num', answer: big,
        hint: 'Take away to get to 10 first, then take away the rest.',
        steps: ['Split ' + small + ' into ' + (c - 10) + ' and ' + (small - (c - 10)) + '.', c + ' ' + M + ' ' + (c - 10) + ' = 10.', '10 ' + M + ' ' + (small - (c - 10)) + ' = ' + big + '. So ' + c + ' ' + M + ' ' + small + ' = ' + big + '.'],
        explain: c + ' ' + M + ' ' + small + ' = ' + big + '. Check: ' + big + ' + ' + small + ' = ' + c + '.' };
    }
    return { q: 'What is ' + eqn(a + ' + ' + b) + '?', type: 'num', answer: c, fig: lv < 3 ? makeTen(big, small) : '',
      hint: 'Make a ten. ' + big + ' needs ' + need + ' more to make 10.',
      steps: [big + ' needs ' + need + ' to make 10. Take ' + need + ' from the ' + small + '.', 'That leaves ' + (small - need) + '.', '10 + ' + (small - need) + ' = ' + c + '.'],
      explain: a + ' + ' + b + ' = ' + c + '. ' + big + ' + ' + need + ' makes 10, and ' + (small - need) + ' more is ' + c + '.' };
  }
  function qTens(lv) {
    var a, b, add = R.int(0, 1), ans;
    if (lv === 1) { a = R.int(1, 4) * 10; b = R.int(1, 5 - a / 10) * 10; if (!add) { a = R.int(2, 5) * 10; b = R.int(1, a / 10 - 1) * 10; } }
    else if (lv === 2) { a = R.int(1, 3) * 10 + R.int(1, 9); b = 10 * R.int(1, Math.min(2, tn(50 - a))); if (!add) { a = R.int(2, 4) * 10 + R.int(1, 9); b = 10 * R.int(1, tn(a) - 1); } }
    else { a = R.int(1, 2) * 10 + R.int(1, 5); b = R.int(1, 2) * 10; if (!add) { a = R.int(3, 4) * 10 + R.int(1, 9); b = R.int(1, 2) * 10; } }
    ans = add ? a + b : a - b;
    var k = b / 10;
    return { q: 'What is ' + eqn(a + ' ' + (add ? '+' : M) + ' ' + b) + '?', type: 'num', answer: ans,
      fig: lv < 3 ? A.draw.tens(tn(a), a % 10) : '',
      hint: 'Jump by tens: ' + (add ? 'add' : 'take away') + ' ' + k + ' ten' + (k > 1 ? 's' : '') + '. The ones stay the same.',
      steps: [a + ' is ' + tn(a) + ' tens and ' + a % 10 + ' ones. ' + b + ' is ' + k + ' ten' + (k > 1 ? 's' : '') + '.', (add ? 'Count on' : 'Count back') + ' by 10s from ' + a + ': ' + seq(a + (add ? 10 : -10), k, add ? 10 : -10).join(', ') + '.<div class="fig">' + jumps(a, b, !add) + '</div>', a + ' ' + (add ? '+' : M) + ' ' + b + ' = ' + ans + '.'],
      explain: a + ' ' + (add ? '+' : M) + ' ' + b + ' = ' + ans + '. Only the tens changed.' };
  }
  function qTwo(lv) {
    var a, b, add = lv === 1 ? 1 : lv === 2 ? 0 : R.int(0, 1), ans;
    if (lv < 3) {
      if (add) { a = R.int(1, 4) * 10 + R.int(0, 6); b = R.int(1, 9 - a % 10); }
      else { a = R.int(1, 4) * 10 + R.int(3, 9); b = R.int(1, a % 10); }
    } else if (add) { a = R.int(1, 3) * 10 + R.int(5, 9); b = R.int(10 - a % 10, 9); }
    else { a = R.int(2, 4) * 10 + R.int(1, 4); b = R.int(a % 10 + 1, 9); }
    ans = add ? a + b : a - b;
    var cross = tn(ans) !== tn(a), ten = add ? (tn(a) + 1) * 10 : tn(a) * 10;
    return { q: 'What is ' + eqn(a + ' ' + (add ? '+' : M) + ' ' + b) + '?', type: 'num', answer: ans,
      fig: lv < 3 ? A.draw.tens(tn(a), a % 10) : '',
      hint: cross ? (add ? 'Jump to the next ten first: ' + a + ' + ' + (ten - a) + ' = ' + ten + '. Then add the rest.' : 'Jump back to the ten first: ' + a + ' ' + M + ' ' + (a - ten) + ' = ' + ten + '. Then take away the rest.') : (add ? 'Add the ones: ' + a % 10 + ' + ' + b + '. The tens stay the same.' : 'Take away from the ones: ' + a % 10 + ' ' + M + ' ' + b + '. The tens stay the same.'),
      steps: cross ? [(add ? 'Jump to the next ten: ' + a + ' + ' + (ten - a) + ' = ' + ten + '.' : 'Jump back to the ten: ' + a + ' ' + M + ' ' + (a - ten) + ' = ' + ten + '.'), 'You still have ' + (add ? b - (ten - a) : b - (a - ten)) + ' to ' + (add ? 'add' : 'take away') + '.', ten + ' ' + (add ? '+' : M) + ' ' + (add ? b - (ten - a) : b - (a - ten)) + ' = ' + ans + '.<div class="fig">' + jumps(a, b, !add) + '</div>']
        : [a + ' is ' + tn(a) + ' tens and ' + a % 10 + ' ones.', (add ? a % 10 + ' + ' + b + ' = ' + (a % 10 + b) : a % 10 + ' ' + M + ' ' + b + ' = ' + (a % 10 - b)) + ' ones.', 'The tens stay ' + tn(a) + '. So the answer is ' + ans + '.'],
      explain: a + ' ' + (add ? '+' : M) + ' ' + b + ' = ' + ans + '.' };
  }
  function qStory(lv) {
    var who = R.pick(PEOPLE), other = R.pick(PEOPLE.filter(function (p) { return p !== who; })), type = lv === 1 ? R.pick(['join', 'take']) : lv === 2 ? R.pick(['join', 'take', 'whole']) : R.pick(['compare', 'start', 'whole']);
    var a, b;
    if (type === 'join') { a = R.int(10, 30); b = R.int(2, 9); if (lv === 1) b = R.int(1, 9 - a % 10 || 1); return story(who + ' has ' + a + ' stickers. ' + who + ' gets ' + b + ' more. How many stickers does ' + who + ' have now?', a + b, a + ' + ' + b, 'Getting more means adding.'); }
    if (type === 'take') { a = R.int(15, 40); b = R.int(2, 9); if (lv === 1) b = R.int(1, Math.max(1, a % 10)); return story('There are ' + a + ' crackers in a box. ' + who + ' eats ' + b + '. How many crackers are left?', a - b, a + ' ' + M + ' ' + b, 'Some are eaten, so we take away.'); }
    if (type === 'whole') { a = R.int(10, 25); b = R.int(10, 20); return story('A class has ' + a + ' girls and ' + b + ' boys. How many children are in the class?', a + b, a + ' + ' + b, 'Two parts make the whole, so we add.'); }
    if (type === 'compare') { a = R.int(12, 30); b = a + R.int(2, 12); return story(who + ' has ' + a + ' marbles. ' + other + ' has ' + b + ' marbles. How many <b>more</b> marbles does ' + other + ' have?', b - a, b + ' ' + M + ' ' + a, '"How many more" means find the difference. Count up from ' + a + ' to ' + b + ', or subtract.'); }
    a = R.int(10, 30); b = R.int(3, 15);
    return story(who + ' had some books. ' + who + ' got ' + b + ' more. Now ' + who + ' has ' + (a + b) + '. How many books did ' + who + ' have at the start?', a, (a + b) + ' ' + M + ' ' + b, 'You know the total and one part. Take the part away from the total.');
  }
  function story(text, ans, expr, why) {
    return { q: text, type: 'num', answer: ans, hint: why,
      steps: ['Read it again. Picture what happens.', why + ' Write it: ' + eqn(expr + ' = <b class="blank">?</b>') + '.', 'Solve it: ' + eqn(expr + ' = ' + ans) + '. Check that the answer makes sense.'],
      explain: eqn(expr + ' = ' + ans) + '.' };
  }
  function qEqual(lv) {
    var a, b, c, d;
    if (lv === 1) {
      a = R.int(1, 9); b = R.int(1, 10 - a); var right = R.int(0, 1), shown = right ? a + b : a + b + R.pick([-1, 1]);
      if (shown < 0) shown = a + b + 1;
      return { q: 'Is this true? ' + eqn(a + ' + ' + b + ' = ' + shown), type: 'mc', options: ['True', 'False'], answer: right ? 0 : 1,
        hint: 'Work out ' + a + ' + ' + b + '. Is it the same as ' + shown + '?', steps: [a + ' + ' + b + ' = ' + (a + b) + '.', 'Compare ' + (a + b) + ' with ' + shown + '.', (a + b) === shown ? 'They are the same, so it is true.' : 'They are not the same, so it is false.'],
        explain: a + ' + ' + b + ' is ' + (a + b) + ', so the sentence is ' + (right ? 'true' : 'false') + '.' };
    }
    if (lv === 2) {
      var tot = R.int(5, 12); a = R.int(1, tot - 1); b = tot - a; do { c = R.int(1, tot - 1); } while (c === a || c === b); d = tot - c;
      var same = R.int(0, 1); if (!same) d = d + R.pick([-1, 1]) || d + 1;
      return { q: 'Is this true? ' + eqn(a + ' + ' + b + ' = ' + c + ' + ' + d), type: 'mc', options: ['True', 'False'], answer: (a + b === c + d) ? 0 : 1,
        fig: balance(a + b, c + d, a + ' + ' + b, c + ' + ' + d),
        hint: 'Work out each side. The = sign means both sides are the same.', steps: ['Left side: ' + a + ' + ' + b + ' = ' + (a + b) + '.', 'Right side: ' + c + ' + ' + d + ' = ' + (c + d) + '.', (a + b === c + d) ? 'Both sides are ' + (a + b) + '. It is true.' : (a + b) + ' is not the same as ' + (c + d) + '. It is false.'],
        explain: a + ' + ' + b + ' = ' + (a + b) + ' and ' + c + ' + ' + d + ' = ' + (c + d) + '. ' + (a + b === c + d ? 'True.' : 'False.') };
    }
    var t2 = R.int(6, 15); a = R.int(1, Math.min(9, t2 - 1)); b = t2 - a; do { c = R.int(1, t2 - 1); } while (c === a); d = t2 - c;
    return { q: 'What number makes this true? ' + eqn(a + ' + ' + b + ' = ' + c + ' + <b class="blank">?</b>'), type: 'num', answer: d,
      fig: balance(t2, c, a + ' + ' + b, c + ' + ?'),
      hint: 'Find the left side first. Then make the right side the same.', steps: ['Left side: ' + a + ' + ' + b + ' = ' + t2 + '.', 'The right side must also be ' + t2 + '. It has ' + c + ' already.', c + ' + ' + d + ' = ' + t2 + '. The missing number is ' + d + '.'],
      explain: a + ' + ' + b + ' = ' + t2 + ' and ' + c + ' + ' + d + ' = ' + t2 + '. Both sides are equal.' };
  }

  A.register('add-sub-50', {
    html:
'<section class="sec"><h2><span class="n">1</span>Make a ten to add</h2>' +
'<p>To add numbers like ' + eqn('8 + 5') + ', first fill a ten. Ten and some more is easy to read.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + makeTen(8, 5) + '</div><p>8 needs 2 more to make 10. I take 2 from the 5. That leaves 3. ' + eqn('10 + 3 = 13') + '. So ' + eqn('8 + 5 = 13') + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ' + eqn('9 + 6') + '?</p><ol><li>9 needs 1 more to make 10.</li><li>Take 1 from the 6. That leaves 5.</li><li>' + eqn('10 + 5 = 15') + '. So ' + eqn('9 + 6 = 15') + '.</li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>Knowing the pairs that make 10 helps you add bigger numbers in your head.</p></div>' +
'<div class="lab"><span class="lt">Try it: make a ten</span><div class="row2">' + A.stepHtml('mk1', 'Red', 8) + A.stepHtml('mk2', 'Yellow', 5) + '</div>' +
'<div class="fig" id="mkfig"></div><div class="out" id="mkout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Adding bigger numbers</h2>' +
'<p>To add to a bigger number, jump by <b>tens</b> first, then by <b>ones</b>. Use a number line, blocks, or your head.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>' + eqn('23 + 14') + '. 14 is 1 ten and 4 ones. From 23, I jump 10 to 33. Then I jump 4 ones: 34, 35, 36, 37.</p><div class="fig">' + jumps(23, 14) + '</div><p>' + eqn('23 + 14 = 37') + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ' + eqn('27 + 5') + '?</p><ol><li>27 needs 3 more to get to the next ten, 30.</li><li>5 is 3 and 2. ' + eqn('27 + 3 = 30') + '.</li><li>Then ' + eqn('30 + 2 = 32') + '. So ' + eqn('27 + 5 = 32') + '.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: jump on the number line</span><div class="row2">' + A.stepHtml('jp1', 'Start at', 23) + A.stepHtml('jp2', 'Add', 14) + '</div>' +
'<div class="fig" id="jpfig"></div><div class="out" id="jpout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Subtracting bigger numbers</h2>' +
'<p>To subtract, jump <b>back</b>. Take away tens first, then ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>' + eqn('45 &minus; 12') + '. I jump back 10 to 35. Then back 2: 34, 33.</p><div class="fig">' + jumps(45, 12, true) + '</div><p>' + eqn('45 &minus; 12 = 33') + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ' + eqn('32 &minus; 5') + '?</p><ol><li>Jump back 2 to get to 30.</li><li>5 is 2 and 3. I still need to take away 3.</li><li>' + eqn('30 &minus; 3 = 27') + '. So ' + eqn('32 &minus; 5 = 27') + '.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>In ' + eqn('32 &minus; 5') + ', do not take 2 away from 5. You start with 32 and take away 5. The answer is less than 32: it is 27.</p></div>' +
'<div class="lab"><span class="lt">Try it: jump back</span><div class="row2">' + A.stepHtml('jb1', 'Start at', 45) + A.stepHtml('jb2', 'Take away', 12) + '</div>' +
'<div class="fig" id="jbfig"></div><div class="out" id="jbout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Story problems</h2>' +
'<p>Use the same 4 steps for every story problem.</p>' +
'<ol class="routine"><li><b>Read</b> it. Read it twice.</li><li><b>Picture</b> it. Draw it or use objects.</li><li><b>Write</b> the number sentence.</li><li><b>Solve and check.</b> Does the answer make sense?</li></ol>' +
'<div class="eg"><b class="t">Watch me</b><p>"Leo has 18 marbles. Mia has 25 marbles. How many more marbles does Mia have?"</p>' +
'<div class="fig">' + A.draw.nl(15, 30, { mark: 18, hops: [[18, 20, '+2'], [20, 25, '+5']], lab: 5 }) + '</div>' +
'<p>"How many more" means find the difference. I count up from 18 to 25: 2 to get to 20, then 5 more. That is 7. ' + eqn('25 &minus; 18 = 7') + '. Mia has 7 more.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>"In all" and "altogether" usually mean add. "Left" and "how many more" usually mean subtract. Always picture the story to be sure.</p></div>' +
'<div class="lab"><span class="lt">Try it: solve a story</span><div class="btnrow"><button type="button" class="btn" id="stn">New story</button></div>' +
'<div id="stq"></div><div class="btnrow"><button type="button" class="btn alt" id="sts">Show the next step</button></div><ol id="stl" class="wmsteps"></ol></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Is it equal?</h2>' +
'<p>The <b>=</b> sign means "<b>is the same as</b>". Both sides must have the same amount, like a balance that is level.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + balance(7, 7, '4 + 3', '5 + 2') + '</div><p>' + eqn('4 + 3') + ' is 7. ' + eqn('5 + 2') + ' is 7. Both sides are 7, so ' + eqn('4 + 3 = 5 + 2') + ' is <b>true</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>The = sign does not mean "the answer comes next". In ' + eqn('6 + 2 = <b class="blank">?</b> + 5') + ', the answer is not 8. Both sides must be 8, so the missing number is 3.</p></div>' +
'<div class="lab"><span class="lt">Try it: balance it</span><div class="row2">' + A.stepHtml('bl1', 'Left: first number', 4) + A.stepHtml('bl2', 'Left: second number', 3) + A.stepHtml('bl3', 'Right: first number', 5) + A.stepHtml('bl4', 'Right: second number', 1) + '</div>' +
'<div class="fig" id="blfig"></div><div class="out" id="blout"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      var a = 8, b = 5;
      function mk() {
        var big = Math.max(a, b), small = Math.min(a, b), need = 10 - big, c = a + b;
        $('#mkfig', root).innerHTML = makeTen(a, b);
        $('#mkout', root).innerHTML = '<span class="big">' + a + ' + ' + b + ' = ' + c + '</span><br>' + (c < 10 ? 'Not enough to make a ten.' : c === 10 ? 'Exactly one ten.' : big + ' needs ' + need + ' to make 10. ' + small + ' is ' + need + ' and ' + (small - need) + '. So 10 + ' + (small - need) + ' = ' + c + '.');
      }
      A.stepper(root, 'mk1', 1, 9, function (n) { a = n; mk(); });
      A.stepper(root, 'mk2', 1, 9, function (n) { b = n; mk(); });
      var s = 23, d = 14, j1, j2;
      function jp() { $('#jpfig', root).innerHTML = jumps(s, d); $('#jpout', root).innerHTML = '<span class="big">' + s + ' + ' + d + ' = ' + (s + d) + '</span><br>' + (tn(d) ? 'Jump ' + tn(d) + ' ten' + (tn(d) > 1 ? 's' : '') + ', then ' : 'Jump ') + d % 10 + ' one' + (d % 10 === 1 ? '' : 's') + '.'; }
      j1 = A.stepper(root, 'jp1', 0, 49, function (n) { s = n; if (j2 && s + d > 50) { j2.set(50 - s); return; } jp(); });
      j2 = A.stepper(root, 'jp2', 1, 30, function (n) { if (s + n > 50) { j2.set(50 - s); return; } d = n; jp(); });
      var bs = 45, bd = 12, k1, k2;
      function jb() { $('#jbfig', root).innerHTML = jumps(bs, bd, true); $('#jbout', root).innerHTML = '<span class="big">' + bs + ' &minus; ' + bd + ' = ' + (bs - bd) + '</span><br>' + (tn(bd) ? 'Jump back ' + tn(bd) + ' ten' + (tn(bd) > 1 ? 's' : '') + ', then ' : 'Jump back ') + bd % 10 + ' one' + (bd % 10 === 1 ? '' : 's') + '.'; }
      k1 = A.stepper(root, 'jb1', 1, 50, function (n) { bs = n; if (k2 && bd > bs) { k2.set(bs); return; } jb(); });
      k2 = A.stepper(root, 'jb2', 1, 30, function (n) { if (n > bs) { k2.set(bs); return; } bd = n; jb(); });
      var cur, k = 0;
      function newStory() {
        cur = qStory(R.int(1, 3)); k = 0;
        $('#stq', root).innerHTML = '<p class="qtext">' + cur.q + '</p>';
        $('#stl', root).innerHTML = '';
        $('#sts', root).disabled = false;
        $('#sts', root).textContent = 'Show the first step';
      }
      $('#sts', root).addEventListener('click', function () {
        if (k < cur.steps.length) { $('#stl', root).innerHTML += '<li>' + cur.steps[k] + (k === cur.steps.length - 1 ? ' The answer is <b>' + cur.answer + '</b>.' : '') + '</li>'; k++; }
        $('#sts', root).textContent = 'Show the next step';
        if (k >= cur.steps.length) $('#sts', root).disabled = true;
      });
      $('#stn', root).addEventListener('click', newStory);
      newStory();
      var v = [4, 3, 5, 1];
      function bl() {
        var l = v[0] + v[1], r = v[2] + v[3];
        $('#blfig', root).innerHTML = balance(l, r, v[0] + ' + ' + v[1], v[2] + ' + ' + v[3]);
        $('#blout', root).innerHTML = 'Left is ' + l + '. Right is ' + r + '. ' + (l === r ? '<b>Equal.</b> ' + eqn(v[0] + ' + ' + v[1] + ' = ' + v[2] + ' + ' + v[3]) + ' is true.' : '<b>Not equal.</b> The ' + (l > r ? 'left' : 'right') + ' side is more by ' + Math.abs(l - r) + '.');
      }
      ['bl1', 'bl2', 'bl3', 'bl4'].forEach(function (id, i) { A.stepper(root, id, 0, 10, function (n) { v[i] = n; bl(); }); });
    },

    checks: [
      [function () { return q20(1); }, function () { return q20(2); }, function () { return q20(2); }],
      [function () { return qTens(1); }, function () { return qTwo(1); }, function () { return qTens(2); }],
      [function () { return qTwo(2); }, function () { return qTens(2); }, function () { return qTwo(2); }],
      [function () { return qStory(1); }, function () { return qStory(2); }, function () { return qStory(2); }],
      [function () { return qEqual(1); }, function () { return qEqual(2); }, function () { return qEqual(3); }]
    ],

    quiz: [
      { q: 'What is ' + eqn('7 + 6') + '?', type: 'num', answer: 13, fig: makeTen(7, 6),
        hint: '7 needs 3 to make 10. Take 3 from the 6.', explain: '7 + 3 = 10, and 3 more is 13.' },
      { q: 'What is ' + eqn('30 + 20') + '?', type: 'num', answer: 50,
        hint: '3 tens and 2 tens.', explain: '3 tens and 2 tens is 5 tens: 50.' },
      { q: 'What is ' + eqn('24 + 5') + '?', type: 'num', answer: 29,
        hint: 'Add the ones: 4 + 5. The tens stay the same.', explain: '4 + 5 = 9 ones, and 2 tens. 29.' },
      { q: 'What is ' + eqn('36 &minus; 10') + '?', type: 'num', answer: 26,
        hint: 'Take away one ten. The ones stay 6.', explain: '3 tens take away 1 ten is 2 tens. 26.' },
      { q: 'There are 21 children on a bus. 6 more get on. How many children are on the bus now?', type: 'num', answer: 27,
        hint: 'More get on, so add. Start at 21, count on 6.', explain: '21 + 6 = 27.' },
      { q: 'Is this true? ' + eqn('5 + 4 = 6 + 3'), type: 'mc', options: ['True', 'False'], answer: 0, fig: balance(9, 9, '5 + 4', '6 + 3'),
        hint: 'Work out each side.', explain: 'Both sides are 9, so it is true.' },
      { q: 'What number makes this true? ' + eqn('6 + 2 = <b class="blank">?</b> + 5'), type: 'num', answer: 3, fig: balance(8, 5, '6 + 2', '? + 5'),
        hint: 'The left side is 8. What goes with 5 to make 8?', explain: '6 + 2 = 8, and 3 + 5 = 8. The missing number is 3.' }
    ],

    practice: [
      { id: 'b-20', name: 'Add and subtract to 20', code: 'B2.3', gen: q20 },
      { id: 'b-tens', name: 'Jump by tens', code: 'B2.4', gen: qTens },
      { id: 'b-two', name: 'Bigger numbers', code: 'B2.4', gen: qTwo },
      { id: 'b-story', name: 'Story problems to 50', code: 'B2.4', gen: qStory },
      { id: 'b-equal', name: 'Is it equal?', code: 'C2.2, C2.3', gen: qEqual }
    ]
  });
})();
