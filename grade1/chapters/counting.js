(function () {
  var A = Atlas, R = A.R, W = A.word;
  var KINDS = ['apple', 'star', 'fish', 'flower', 'ball', 'leaf', 'car'];

  /* everyday pictures for "numbers all around us" */
  function bus(n) {
    return A.svg(120, 80, '<rect x="6" y="12" width="108" height="50" rx="10" style="fill:#f2bd24" stroke="rgba(0,0,0,.45)" stroke-width="2"/>' +
      '<rect x="14" y="20" width="20" height="16" rx="3" style="fill:#cfe6f7"/><rect x="40" y="20" width="20" height="16" rx="3" style="fill:#cfe6f7"/><rect x="66" y="20" width="20" height="16" rx="3" style="fill:#cfe6f7"/>' +
      '<rect x="90" y="18" width="18" height="18" rx="3" style="fill:#fff" stroke="#2a2633" stroke-width="1.5"/><text x="99" y="33" text-anchor="middle" font-size="16" font-weight="700" style="fill:#2a2633">' + n + '</text>' +
      '<circle cx="30" cy="64" r="9" style="fill:#2a2633"/><circle cx="92" cy="64" r="9" style="fill:#2a2633"/>', 'A school bus with the number ' + n + ' on it');
  }
  function shirt(n) {
    return A.svg(100, 90, '<path d="M30 8L12 18L2 38L18 44L22 36V86H78V36L82 44L98 38L88 18L70 8Q50 22 30 8Z" style="fill:#2c68cf" stroke="rgba(0,0,0,.45)" stroke-width="2" stroke-linejoin="round"/>' +
      '<text x="50" y="70" text-anchor="middle" font-size="32" font-weight="700" style="fill:#fff;font-family:var(--display)">' + n + '</text>', 'A hockey shirt with the number ' + n + ' on the back');
  }
  function cake(n) {
    var s = '<rect x="10" y="44" width="100" height="36" rx="6" style="fill:#e05aa0" stroke="rgba(0,0,0,.4)" stroke-width="2"/><rect x="10" y="44" width="100" height="10" rx="5" style="fill:#fff"/>';
    for (var i = 0; i < n; i++) {
      var x = 20 + i * (80 / Math.max(1, n - 1));
      s += '<rect x="' + (x - 3) + '" y="22" width="6" height="22" rx="2" style="fill:#2c68cf"/><path d="M' + x + ' 10Q' + (x + 5) + ' 17 ' + x + ' 21Q' + (x - 5) + ' 17 ' + x + ' 10Z" style="fill:#f2bd24"/>';
    }
    return A.svg(120, 84, s, 'A birthday cake with ' + n + ' candles');
  }
  function door(n) {
    return A.svg(100, 90, '<path d="M8 40L50 6L92 40Z" style="fill:#c9432a" stroke="rgba(0,0,0,.4)" stroke-width="2" stroke-linejoin="round"/><rect x="16" y="40" width="68" height="46" style="fill:#f4e3c7" stroke="rgba(0,0,0,.4)" stroke-width="2"/>' +
      '<rect x="40" y="56" width="20" height="30" style="fill:#7a4b2a"/><rect x="58" y="44" width="22" height="14" rx="2" style="fill:#fff" stroke="#2a2633" stroke-width="1.5"/><text x="69" y="56" text-anchor="middle" font-size="12" font-weight="700" style="fill:#2a2633">' + n + '</text>', 'A house with the number ' + n + ' beside the door');
  }

  /* objects in a line with small numbers under each, to show touch-and-count */
  function counted(kind, n, upto) {
    var sz = 34, gap = 8, per = 10, s = '';
    for (var i = 0; i < n; i++) {
      var x = 4 + (i % per) * (sz + gap) + (i % per >= 5 ? 10 : 0) + sz / 2, y = 4 + Math.floor(i / per) * (sz + 34) + sz / 2;
      s += A.icon(kind, x, y, sz);
      if (i < upto) s += '<text x="' + x + '" y="' + (y + sz / 2 + 22) + '" text-anchor="middle" font-size="19" class="tb" style="fill:' + (i === upto - 1 ? 'var(--accent)' : 'var(--ink)') + '">' + (i + 1) + '</text>';
    }
    var cols = Math.min(n, per);
    return A.svg(4 + cols * (sz + gap) + (cols > 5 ? 10 : 0), Math.ceil(n / per) * (sz + 34) + 6, s, A.nm(kind, n) + (upto ? ', counted 1 to ' + upto : ''));
  }

  /* pictures for skip counting: pairs of socks, hands, full ten frames */
  function groupsPic(by, groups) {
    if (by === 10) return A.draw.frames(groups * 10, { r: 2, c: 20, label: groups + ' full ten frames' });
    var kind = by === 2 ? 'sock' : 'hand', sz = 30, s = '', gw = by === 2 ? 2 * sz + 4 : sz + 10, per = by === 2 ? 5 : 6, x, y;
    for (var g = 0; g < groups; g++) {
      x = 6 + (g % per) * (gw + 12); y = 6 + Math.floor(g / per) * (sz + 34);
      s += '<rect x="' + (x - 3) + '" y="' + (y - 3) + '" width="' + (gw + 6) + '" height="' + (sz + 6) + '" rx="10" style="fill:none;stroke:var(--line)" stroke-width="2"/>';
      if (by === 2) s += A.icon('sock', x + sz / 2, y + sz / 2, sz) + A.icon('sock', x + sz * 1.5 + 4, y + sz / 2, sz);
      else s += A.icon('hand', x + gw / 2, y + sz / 2, sz);
      s += '<text x="' + (x + gw / 2) + '" y="' + (y + sz + 25) + '" text-anchor="middle" font-size="19" class="tb" style="fill:var(--accent)">' + (by * (g + 1)) + '</text>';
    }
    var cols = Math.min(groups, per);
    return A.svg(Math.max(60, 8 + cols * (gw + 12)), Math.ceil(groups / per) * (sz + 34) + 8, s, groups + (by === 2 ? ' pairs of socks' : ' hands') + ', counted by ' + by + 's to ' + by * groups);
  }

  function skipList(by, start, len) { var a = []; for (var i = 0; i < len; i++) a.push(start + by * i); return a; }

  /* ---------- practice question makers (also used in Your turn boxes) ---------- */
  function qCount(lv) {
    var kind = R.pick(KINDS), n = lv === 1 ? R.int(3, 10) : lv === 2 ? R.int(11, 20) : R.int(21, 40);
    var fig = lv === 3 ? A.draw.frames(n, { c: 22, label: n + ' counters in ten frames' }) : A.draw.row(kind, n, { per: 10, group: 5, s: 30 });
    var what = lv === 3 ? 'counters' : A.NAMES[kind][1];
    return { q: 'How many ' + what + ' are there?', type: 'num', answer: n, fig: fig,
      hint: lv === 3 ? 'Count the full ten frames by 10s first: 10, 20... then count on the extra ones.' : 'Touch each one once and say one number. The last number you say is how many.',
      steps: lv === 3 ? ['There ' + (Math.floor(n / 10) === 1 ? 'is 1 full frame' : 'are ' + Math.floor(n / 10) + ' full frames') + '. Count by 10s: ' + skipList(10, 10, Math.floor(n / 10)).join(', ') + '.', 'Now count on the ' + n % 10 + ' extra: ' + (n % 10 ? skipList(1, Math.floor(n / 10) * 10 + 1, n % 10).join(', ') : 'there are none') + '.', 'There are ' + n + ' counters.']
        : ['Start at the first one on the left. Say "1".', 'Move along the row. Say one number for each one. Count the first group of 5, then keep going.', 'The last number you say is ' + n + '. There are ' + n + '.'],
      explain: 'There are ' + n + '. The last number you say when you count tells how many.' };
  }
  function qFrame(lv) {
    var n = lv === 1 ? R.int(1, 10) : lv === 2 ? R.int(11, 20) : R.int(21, 50);
    var fig = A.draw.frames(n, { c: lv === 3 ? 20 : 26 }), tens = Math.floor(n / 10), ones = n % 10;
    var steps = n <= 10 ? (n > 5 ? ['The top row is full. That is 5.', 'Count on the bottom row: ' + skipList(1, 6, n - 5).join(', ') + '.', 'The frame shows ' + n + '.'] : n === 5 ? ['The top row is full.', 'The bottom row is empty.', 'A full row is 5. The frame shows 5.'] : ['The top row has ' + n + '.', 'There are ' + (10 - n) + ' empty boxes.', 'The frame shows ' + n + '.'])
      : ['Each full frame is 10. Count them by 10s: ' + skipList(10, 10, tens).join(', ') + '.', 'Count on the extra counters: ' + (ones ? skipList(1, tens * 10 + 1, ones).join(', ') : 'there are none') + '.', 'The frames show ' + n + '.'];
    var base = { fig: fig, hint: n <= 10 ? 'A full row is 5. Start at 5 and count on.' : 'A full frame is 10. Count the full frames first.', steps: steps, explain: 'The frames show ' + (tens ? tens + ' ten' + (tens > 1 ? 's' : '') + (ones ? ' and ' + ones + ' more' : '') : ones) + ': ' + n + '.' };
    if (lv === 3) return Object.assign({ q: 'What number do the ten frames show?', type: 'num', answer: n }, base);
    var o = R.mc(n, [n + 1, n - 1, n + 2, n - 2, n + 5, n - 5].filter(function (v) { return v >= 0 && v <= 50 && v !== n; }).sort(function () { return Math.random() - 0.5; }));
    return Object.assign({ q: 'What number does the ten frame show?', type: 'mc', options: o.options, answer: o.answer }, base);
  }
  function qWords(lv) {
    var n, wrong, q;
    if (lv === 1) {
      n = R.int(0, 10);
      wrong = [n + 1, n - 1, n + 2].filter(function (v) { return v >= 0 && v <= 12; }).map(W);
      var o = R.mc(W(n), wrong);
      return { q: 'Which word is the number <span class="big">' + n + '</span>?', type: 'mc', options: o.options, answer: o.answer, fig: A.draw.frames(n, { c: 22, min: 1 }),
        hint: 'Say the number out loud. Which word sounds the same?', steps: ['Look at the ten frame. Count the counters: ' + n + '.', 'Say the number out loud.', 'The word is "' + W(n) + '".'], explain: n + ' is "' + W(n) + '".' };
    }
    if (lv === 2) {
      n = R.int(13, 19);
      var t = n % 10;
      wrong = [t * 10, n + 1, n - 1].filter(function (v) { return v > 0 && v <= 50 && v !== n; });
      var o2 = R.mc(n, wrong);
      return { q: 'Which number is <b>' + W(n) + '</b>?', type: 'mc', options: o2.options, answer: o2.answer,
        hint: '"Teen" means ten and some more. ' + W(n) + ' is 10 and ' + t + '.',
        steps: ['Listen to the word: ' + W(n) + '. It ends in "teen".', '"Teen" numbers are 10 and some more. ' + W(n) + ' is 10 and ' + t + '.', '10 and ' + t + ' is written ' + n + '. A 1 for the ten, then a ' + t + '.'],
        explain: W(n) + ' is 10 and ' + t + ', so it is ' + n + '. Do not mix it up with ' + W(t * 10) + ', which is ' + t * 10 + '.' };
    }
    n = R.int(21, 50);
    var tn = Math.floor(n / 10), on = n % 10;
    wrong = [on ? on * 10 + tn : n + 1, tn * 10 + (on + 1) % 10, n + 10 <= 50 ? n + 10 : n - 10].filter(function (v) { return v > 0 && v <= 59 && v !== n; });
    var o3 = R.mc(n, wrong);
    return { q: 'Which number is <b>' + W(n) + '</b>?', type: 'mc', options: o3.options, answer: o3.answer,
      hint: 'The first part of the word tells the tens. ' + W(tn * 10) + ' is ' + tn * 10 + '.',
      steps: ['Split the word: "' + W(tn * 10) + '"' + (on ? ' and "' + W(on) + '"' : '') + '.', W(tn * 10) + ' is ' + tn + ' tens, so the first digit is ' + tn + '.', on ? W(on) + ' is the ones, so the last digit is ' + on + '. The number is ' + n + '.' : 'There are no extra ones, so the last digit is 0. The number is ' + n + '.'],
      explain: W(n) + ' is ' + n + '.' };
  }
  function qNext(lv) {
    if (lv === 1) {
      var n = R.int(1, 19), after = R.int(0, 1);
      var ans = after ? n + 1 : n - 1;
      if (ans < 1) { after = 1; ans = n + 1; }
      return { q: 'What number comes just <b>' + (after ? 'after' : 'before') + '</b> ' + n + '?', type: 'num', answer: ans, fig: A.draw.nl(Math.max(0, n - 5), Math.max(0, n - 5) + 10, { mark: n }),
        hint: after ? 'After means one more. Count on one from ' + n + '.' : 'Before means one less. Count back one from ' + n + '.',
        steps: ['Find ' + n + ' on the number line. It has the yellow dot.', after ? 'Step one jump to the right. That is one more.' : 'Step one jump to the left. That is one less.', 'You land on ' + ans + '.'], explain: ans + ' comes just ' + (after ? 'after' : 'before') + ' ' + n + '.' };
    }
    if (lv === 2) {
      var m = R.pick([R.int(20, 49), R.int(2, 4) * 10 - 1, R.int(2, 5) * 10]), af = R.int(0, 1);
      if (m === 50) af = 0;
      var a2 = af ? m + 1 : m - 1;
      return { q: 'What number comes just <b>' + (af ? 'after' : 'before') + '</b> ' + m + '?', type: 'num', answer: a2,
        fig: A.chart({ from: Math.min(31, Math.floor((Math.min(m, a2) - 1) / 10) * 10 + 1), to: Math.min(50, Math.min(31, Math.floor((Math.min(m, a2) - 1) / 10) * 10 + 1) + 19), cls: (function () { var c = {}; c[m] = 'c'; return c; })(), hide: [a2] }),
        hint: af ? 'One more than ' + m + '. On the chart, look one box to the right' + (m % 10 === 9 ? '. After a 9 comes the next ten.' : '.') : 'One less than ' + m + '. On the chart, look one box to the left' + (m % 10 === 0 ? ', at the end of the row above.' : '.'),
        steps: ['Find ' + m + ' on the chart. It is yellow.', af ? 'Move one box to the right' + (m % 10 === 0 ? ', which is the start of the next row' : '') + '.' : 'Move one box to the left' + (m % 10 === 1 ? ', which is the end of the row above' : '') + '.', 'The number there is ' + a2 + '.'], explain: a2 + ' comes just ' + (af ? 'after' : 'before') + ' ' + m + '.' };
    }
    var st = R.int(5, 40), k = R.int(2, 5), end = st + k;
    var hops = [];
    for (var i = 0; i < k; i++) hops.push([st + i, st + i + 1]);
    return { q: 'Start at <b>' + st + '</b>. Count on <b>' + k + '</b> more. Where do you land?', type: 'num', answer: end,
      fig: A.draw.nl(st - 2, st + 8, { mark: st }),
      hint: 'Say ' + st + ' in your head. Then count on ' + k + ', putting up one finger for each number.',
      steps: ['Start at ' + st + '. Do not count it again.', 'Count on ' + k + ': ' + skipList(1, st + 1, k).join(', ') + '.<div class="fig">' + A.draw.nl(st - 2, st + 8, { mark: st, hops: hops }) + '</div>', 'You land on ' + end + '.'],
      explain: 'Counting on ' + k + ' from ' + st + ' lands on ' + end + '.' };
  }
  function qSkip(lv) {
    var by = lv === 1 ? 10 : lv === 2 ? 5 : R.pick([2, 5, 10]);
    if (lv === 3 && by !== 2 && R.int(0, 1)) by = 2;
    var maxStart = Math.floor((50 - by * 3) / by), start = by * R.int(1, Math.max(1, Math.min(maxStart, by === 2 ? 20 : 6)));
    var seq = skipList(by, start, 4), ansI = lv === 3 ? R.int(1, 3) : 3, ans = seq[ansI];
    var shown = seq.map(function (v, i) { return i === ansI ? '<b class="blank">?</b>' : v; }).join(', ');
    if (lv < 3 && R.int(0, 2) === 0) {
      var g = by === 10 ? R.int(2, 4) : R.int(3, 7), tot = g * by;
      return { q: 'Count by ' + by + 's. How many ' + (by === 10 ? 'counters' : by === 2 ? 'socks' : 'fingers') + ' in all?', type: 'num', answer: tot, fig: groupsPic(by, g).replace(/<text[^>]*>\d+<\/text>/g, ''),
        hint: 'Each group has ' + by + '. Say ' + skipList(by, by, 2).join(', ') + '... one number for each group.',
        steps: ['Each group is ' + by + '.', 'Point to each group and count by ' + by + 's: ' + skipList(by, by, g).join(', ') + '.', 'There are ' + tot + ' in all.'],
        explain: g + ' groups of ' + by + ' make ' + tot + '. Counting by ' + by + 's: ' + skipList(by, by, g).join(', ') + '.' };
    }
    var hl = {}; seq.forEach(function (v, i) { if (i !== ansI) hl[v] = 'b'; });
    return { q: 'Count by ' + by + 's. What number is missing? <span class="math">' + shown + '</span>', type: 'num', answer: ans,
      hint: 'Each number is ' + by + ' more than the one before. Start at ' + seq[ansI - 1] + ' and count on ' + by + '.',
      steps: ['Look at the numbers you know: they go up by ' + by + ' each time.', 'The number before the gap is ' + seq[ansI - 1] + '.', seq[ansI - 1] + ' and ' + by + ' more is ' + ans + '.<div class="fig">' + A.chart({ cls: (function () { hl[ans] = 'a'; return hl; })() }) + '</div>'],
      explain: 'Counting by ' + by + 's: ' + seq.join(', ') + '. The missing number is ' + ans + '.' };
  }
  function qEst(lv) {
    var set = lv === 1 ? [5, 20, 50] : lv === 2 ? [10, 20, 30, 40] : [15, 20, 25, 30, 35, 40, 45];
    var c = R.pick(set.slice(lv === 1 ? 0 : 1, set.length - (lv === 3 ? 1 : 0))), n = Math.max(3, c + R.int(-2, 2));
    var others = set.filter(function (v) { return v !== c; });
    if (lv === 3) others = others.filter(function (v) { return Math.abs(v - c) <= 10; });
    var opts = R.shuffle(others).slice(0, 2).concat([c]).sort(function (a, b) { return a - b; });
    var labels = opts.map(function (v) { return 'about ' + v; });
    var o = { options: labels, answer: opts.indexOf(c) };
    var seed = R.int(1, 99999), kind = R.pick(['apple', 'star', 'flower', 'leaf']);
    return { q: 'Do not count every one. Which is the best <b>estimate</b>?', type: 'mc', options: o.options, answer: o.answer,
      fig: A.draw.scatter(n, seed, { kind: kind, w: 340, h: 200, r: n > 30 ? 9 : 11, label: 'A group of ' + A.NAMES[kind][1] + ' spread out' }), chk: { n: n, opts: opts },
      hint: 'Picture what 10 looks like. About how many groups of 10 could you make?',
      steps: ['Find a group of about 10 in the picture.', 'Guess how many groups like that would fit.', 'There are ' + n + ', so "about ' + c + '" is the closest estimate.'],
      explain: 'There are ' + n + '. "About ' + c + '" is closest. An estimate does not have to be exact. It just has to be close.' };
  }

  A.register('counting', {
    html:
'<section class="sec"><h2><span class="n">1</span>Numbers tell how many</h2>' +
'<p>We use numbers every day. Most of the time a number tells <b>how many</b>.</p>' +
'<div class="vrow"><figure>' + cake(6) + '<figcaption>6 candles: how many</figcaption></figure><figure>' + A.draw.row('apple', 3, { s: 34 }) + '<figcaption>3 apples: how many</figcaption></figure>' +
'<figure>' + bus(5) + '<figcaption>Bus 5: a name</figcaption></figure><figure>' + shirt(23) + '<figcaption>Number 23: a name</figcaption></figure></div>' +
'<p>Some numbers are a <b>name</b>. Bus 5 does not have 5 of anything. The number just tells you which bus it is.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>I count the apples. I touch each apple <b>once</b> and say one number.</p>' +
'<div class="fig">' + counted('apple', 7, 7) + '</div><p>The last number I say is <b>7</b>. So there are 7 apples.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>How many stars?</p><div class="fig">' + A.draw.row('star', 5, { s: 34 }) + '</div><ol>' +
'<li>Put your finger on the first star. Say "1".</li><li>Move to the next star. Say "2". Keep going: 3, 4, 5.</li><li>You said 5 last. There are <b>5 stars</b>.</li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>Touch each thing once. The <b>last number</b> you say tells how many.</p></div>' +
'<div class="lab"><span class="lt">Try it: count with me</span>' + A.stepHtml('cn1', 'How many apples?', 4) +
'<div class="fig" id="cnfig"></div><div class="out" id="cnout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Ten frames</h2>' +
'<p>A <b>ten frame</b> has 10 boxes: 2 rows of 5. We fill the top row first.</p>' +
'<div class="vrow"><figure>' + A.draw.frames(5, { c: 26 }) + '<figcaption>A full row is 5</figcaption></figure><figure>' + A.draw.frames(10, { c: 26 }) + '<figcaption>A full frame is 10</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.frames(8, { c: 30 }) + '</div><p>The top row is full. That is 5. There are 3 more on the bottom. I count on: 6, 7, 8. The frame shows <b>8</b>.</p><p>I can also see 2 empty boxes. 10 take away 2 is 8.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><div class="fig">' + A.draw.frames(14, { c: 26 }) + '</div><ol>' +
'<li>One frame is full. A full frame is <b>10</b>.</li><li>Count on the others: 11, 12, 13, 14.</li><li>The frames show <b>14</b>. We say "fourteen".</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p><b>Fourteen</b> and <b>forty</b> sound alike. Fourteen is 14: one ten and 4 more. Forty is 40: four full tens.</p>' +
'<div class="vrow"><figure>' + A.draw.frames(14, { c: 14, r: 2 }) + '<figcaption>fourteen: 14</figcaption></figure><figure>' + A.draw.frames(40, { c: 14, r: 2 }) + '<figcaption>forty: 40</figcaption></figure></div></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' + A.stepHtml('tf1', 'Counters', 8) +
'<div class="ctrl"><label for="tfr">Or slide (0 to 50)<input type="range" id="tfr" min="0" max="50" value="8"></label></div>' +
'<div class="fig" id="tffig"></div><div class="out" id="tfout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Counting to 50</h2>' +
'<p>The <b>number chart</b> shows the numbers in order. Each row ends with a ten: 10, 20, 30, 40, 50.</p>' +
'<div class="fig">' + A.chart({ cls: { 10: 'b', 20: 'b', 30: 'b', 40: 'b', 50: 'b' }, label: 'Number chart from 1 to 50. The last number in each row is 10, 20, 30, 40, 50.' }) + '</div>' +
'<p>Going <b>right</b> is one more. Going <b>left</b> is one less.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>I <b>count on</b> from 8. I say 8 in my head, then count 3 more: 9, 10, 11. I land on <b>11</b>.</p><div class="fig">' + A.draw.nl(5, 15, { mark: 8, hops: [[8, 9], [9, 10], [10, 11]] }) + '</div></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What comes after 29?</p><ol><li>Find 29 on the chart. It is near the end of a row.</li><li>Go one more to the right. The row ends at 30.</li><li>After 29 comes <b>30</b>.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>After 29 comes 30, not "twenty-ten". When the ones get to 9, the next number starts a new ten.</p></div>' +
'<div class="lab"><span class="lt">Try it: one more, one less</span>' + A.stepHtml('ch1', 'Pick a number', 23) +
'<div class="fig" id="chfig"></div><div class="out" id="chout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Skip counting by 2s, 5s and 10s</h2>' +
'<p><b>Skip counting</b> is a fast way to count big groups. You say only some of the numbers.</p>' +
'<div class="vrow"><figure>' + groupsPic(2, 3) + '<figcaption>By 2s: 2, 4, 6</figcaption></figure><figure>' + groupsPic(5, 3) + '<figcaption>By 5s: 5, 10, 15</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Each full ten frame is 10. I count by 10s: 10, 20, 30. That is <b>30</b> counters.</p><div class="fig">' + groupsPic(10, 3) + '</div></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>How many fingers on 4 hands?</p><div class="fig">' + groupsPic(5, 4).replace(/<text[^>]*>\d+<\/text>/g, '') + '</div><ol>' +
'<li>Each hand has 5 fingers. We count by 5s.</li><li>Point to each hand: 5, 10, 15, 20.</li><li>There are <b>20</b> fingers.</li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>Skip counting gives the same answer as counting by 1s. It is just faster.</p></div>' +
'<div class="lab"><span class="lt">Try it: skip count on the chart</span>' +
'<div class="btnrow" role="group" aria-label="Count by"><button type="button" class="btn alt" data-by="2" aria-pressed="false">By 2s</button><button type="button" class="btn alt" data-by="5" aria-pressed="true">By 5s</button><button type="button" class="btn alt" data-by="10" aria-pressed="false">By 10s</button></div>' +
'<div class="btnrow"><button type="button" class="btn" id="skn">Next jump</button><button type="button" class="btn alt" id="skr">Start again</button></div>' +
'<div class="fig" id="skfig"></div><div class="out" id="skout" aria-live="polite"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Estimate, then count</h2>' +
'<p>An <b>estimate</b> is a smart guess about how many. You do not count every one.</p>' +
'<p>A good trick: picture a group of 10. Then think, "How many groups of 10 could I make?"</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.scatter(22, 4242, { kind: 'leaf', w: 340, h: 180, label: '22 leaves spread out' }) + '</div><p>About 10 leaves fill the left half. The right half looks about the same. My estimate is <b>about 20</b>.</p><p>Now I count to check: there are 22. My estimate was close.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>An estimate does not have to be exact. A close estimate is a good estimate.</p></div>' +
'<div class="lab"><span class="lt">Try it: estimate, then check</span><p class="noread" style="margin-top:0">Look at the picture. Pick your estimate. Then press <b>Count to check</b>.</p>' +
'<div class="fig" id="esfig"></div>' +
'<div class="ctrl"><label for="esr">My estimate: <output id="eso">20</output><input type="range" id="esr" min="0" max="50" step="5" value="20"></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="esc">Count to check</button><button type="button" class="btn alt" id="esn">New picture</button></div>' +
'<div class="out" id="esout" aria-live="polite"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      /* 1: count with me */
      A.stepper(root, 'cn1', 1, 20, function (n) {
        $('#cnfig', root).innerHTML = counted('apple', n, n);
        $('#cnout', root).innerHTML = 'Touch and count: ' + (n <= 12 ? skipList(1, 1, n).join(', ') : '1, 2, 3 ... ' + n) + '. There are <span class="big">' + n + '</span> apples. We write <b>' + n + '</b> and say "' + W(n) + '".';
      });
      /* 2: ten frames */
      var tfr = $('#tfr', root);
      var tf = A.stepper(root, 'tf1', 0, 50, function (n) {
        tfr.value = n;
        var t = Math.floor(n / 10), o = n % 10;
        $('#tffig', root).innerHTML = A.draw.frames(n, { c: 24, min: 10 });
        $('#tfout', root).innerHTML = '<span class="big">' + n + '</span> &nbsp;"' + W(n) + '"<br>' +
          (n < 10 ? (n >= 5 ? 'A full row of 5 and ' + (n - 5) + ' more.' : n + ' in the top row.') + ' ' + (10 - n) + ' empty to make 10.'
            : t + ' full frame' + (t > 1 ? 's' : '') + ' (' + skipList(10, 10, t).join(', ') + ')' + (o ? ' and ' + o + ' more' : '') + '.');
      });
      tfr.addEventListener('input', function () { tf.set(+tfr.value); });
      /* 3: one more, one less */
      A.stepper(root, 'ch1', 1, 50, function (n) {
        var c = {}; c[n] = 'c'; if (n > 1) c[n - 1] = 'b'; if (n < 50) c[n + 1] = 'b';
        $('#chfig', root).innerHTML = A.chart({ cls: c, label: 'Number chart with ' + n + ' marked' });
        $('#chout', root).innerHTML = (n > 1 ? 'One less than ' + n + ' is <b>' + (n - 1) + '</b>. ' : '') + (n < 50 ? 'One more than ' + n + ' is <b>' + (n + 1) + '</b>.' : '50 is the last number on this chart.');
      });
      /* 4: skip counting */
      var by = 5, at = 0;
      function sk() {
        var c = {};
        for (var v = by; v <= at; v += by) c[v] = 'a';
        var seq = skipList(by, by, at / by);
        $('#skfig', root).innerHTML = A.chart({ cls: c, label: 'Number chart with counting by ' + by + 's marked up to ' + at });
        $('#skout', root).innerHTML = at ? 'Counting by ' + by + 's: <b>' + seq.join(', ') + '</b>' + (at + by > 50 ? '. That is as far as 50 goes.' : '') : 'Press <b>Next jump</b> to count by ' + by + 's.';
        $('#skn', root).disabled = at + by > 50;
      }
      A.$$('[data-by]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          by = +b.getAttribute('data-by'); at = 0;
          A.$$('[data-by]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); x.classList.toggle('alt', x !== b); });
          sk();
        });
      });
      A.$$('[data-by]', root).forEach(function (x) { x.classList.toggle('alt', x.getAttribute('data-by') !== '5'); });
      $('#skn', root).addEventListener('click', function () { if (at + by <= 50) { at += by; sk(); if (A.store('auto') === '1') A.speak(String(at)); } });
      $('#skr', root).addEventListener('click', function () { at = 0; sk(); });
      sk();
      /* 5: estimate */
      var en = 0, es = 0, kind = 'flower', checked = false;
      function newPic() {
        en = R.int(8, 48); es = R.int(1, 99999); kind = R.pick(['apple', 'flower', 'star', 'leaf']); checked = false;
        $('#esfig', root).innerHTML = A.draw.scatter(en, es, { kind: kind, w: 340, h: 200, r: en > 30 ? 9 : 11, label: 'A group of ' + A.NAMES[kind][1] + ' to estimate' });
        $('#esout', root).innerHTML = '';
      }
      var esr = $('#esr', root);
      esr.addEventListener('input', function () { $('#eso', root).textContent = esr.value; });
      $('#esc', root).addEventListener('click', function () {
        var g = +esr.value, d = Math.abs(g - en);
        $('#esfig', root).innerHTML = A.draw.frames(en, { c: 20, label: en + ' ' + A.NAMES[kind][1] + ' put in ten frames' });
        $('#esout', root).innerHTML = 'Put in ten frames, there are <span class="big">' + en + '</span>. Count by 10s, then on: ' + (Math.floor(en / 10) ? skipList(10, 10, Math.floor(en / 10)).join(', ') : '') + (en % 10 ? (Math.floor(en / 10) ? ', then ' : '') + skipList(1, Math.floor(en / 10) * 10 + 1, en % 10).join(', ') : '') + '.<br>' +
          'Your estimate was ' + g + '. ' + (d === 0 ? 'Exactly right.' : 'That is ' + d + ' away. ' + (d <= 5 ? 'A close estimate.' : d <= 10 ? 'Fairly close. Try picturing groups of 10.' : 'Next time, picture a group of 10 and see how many groups fit.'));
      });
      $('#esn', root).addEventListener('click', newPic);
      newPic();
    },

    checks: [
      [function () { return qCount(1); }, function () { return qCount(1); }, {
        q: 'Which one tells <b>how many</b>?', type: 'mc', options: ['Bus number 7', '7 candles on a cake', 'Jersey number 7'], answer: 1, wide: true,
        hint: 'Which one has 7 things you could count?', explain: 'You can count 7 candles. The bus and the jersey use 7 as a name.' }],
      [function () { return qFrame(1); }, function () { return qFrame(1); }, function () { return qFrame(2); }],
      [function () { return qNext(1); }, function () { return qNext(2); }, function () { return qNext(3); }],
      [function () { return qSkip(1); }, function () { return qSkip(2); }, function () { return qSkip(2); }],
      [function () { return qEst(1); }, function () { return qEst(1); }, function () { return qEst(2); }]
    ],

    quiz: [
      { q: 'How many fish?', type: 'num', answer: 9, fig: A.draw.row('fish', 9, { per: 10, group: 5, s: 32 }),
        hint: 'Touch each fish once. Count the first 5, then keep going.', explain: 'There are 9 fish. 5 in the first group and 4 more.' },
      { q: 'What number do the ten frames show?', type: 'mc', options: ['16', '61', '6', '15'], answer: 0, fig: A.draw.frames(16, { c: 24 }),
        hint: 'A full frame is 10. Count on from 10.', explain: 'One full frame is 10, and 6 more: 11, 12, 13, 14, 15, 16. That is 16.' },
      { q: 'Which number is <b>forty-three</b>?', type: 'mc', options: ['34', '43', '403', '13'], answer: 1,
        hint: 'Forty is 4 tens. Then three more.', explain: 'Forty is 40, and three more is 43.' },
      { q: 'What number comes just after <b>39</b>?', type: 'num', answer: 40,
        hint: 'After a 9, the next number starts a new ten.', explain: 'After 39 comes 40.' },
      { q: 'Count by 5s. What number is missing? <span class="math">15, 20, <b class="blank">?</b>, 30</span>', type: 'num', answer: 25,
        hint: 'Each number is 5 more than the one before. What is 20 and 5 more?', explain: '15, 20, 25, 30. 20 and 5 more is 25.' },
      { q: 'Count the socks by 2s. How many socks in all?', type: 'num', answer: 12, fig: groupsPic(2, 6).replace(/<text[^>]*>\d+<\/text>/g, ''),
        hint: 'Each pair is 2. Say 2, 4, 6... one number for each pair.', explain: '6 pairs: 2, 4, 6, 8, 10, 12. There are 12 socks.' },
      { q: 'About how many stars? Do not count them all.', type: 'mc', options: ['about 5', 'about 30', 'about 100'], answer: 1, fig: A.draw.scatter(31, 2024, { kind: 'star', w: 340, h: 200, r: 9, label: 'A group of stars spread out' }),
        hint: 'Picture a group of 10 stars. About how many groups of 10 are there?', explain: 'There are 31 stars, so "about 30" is the best estimate.' }
    ],

    practice: [
      { id: 'c-count', name: 'Count the objects', code: 'B1.1', gen: qCount },
      { id: 'c-frames', name: 'Read ten frames', code: 'B1.1', gen: qFrame },
      { id: 'c-words', name: 'Number words', code: 'B1.1', gen: qWords },
      { id: 'c-next', name: 'Before, after, count on', code: 'B1.5', gen: qNext },
      { id: 'c-skip', name: 'Skip count by 2s, 5s, 10s', code: 'B1.5', gen: qSkip },
      { id: 'c-est', name: 'Estimate how many', code: 'B1.4', gen: qEst }
    ]
  });
})();
