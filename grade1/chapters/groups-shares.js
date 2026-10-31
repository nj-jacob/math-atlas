(function () {
  var A = Atlas, R = A.R;
  var FR = ['', 'one whole', 'one half', 'one third', 'one fourth', 'one fifth', 'one sixth', 'one seventh', 'one eighth', 'one ninth', 'one tenth'];
  var FRP = ['', 'wholes', 'halves', 'thirds', 'fourths', 'fifths', 'sixths', 'sevenths', 'eighths', 'ninths', 'tenths'];
  var PEOPLE = ['Mia', 'Leo', 'Ava', 'Noah', 'Zoe', 'Sam', 'Priya', 'Omar', 'Lily', 'Ben'];
  function cookie(x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:#c98a4b" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/><circle cx="' + (x - r * .35) + '" cy="' + (y - r * .2) + '" r="' + r * .14 + '" style="fill:#5a3416"/><circle cx="' + (x + r * .3) + '" cy="' + (y + r * .3) + '" r="' + r * .14 + '" style="fill:#5a3416"/><circle cx="' + (x + r * .25) + '" cy="' + (y - r * .35) + '" r="' + r * .12 + '" style="fill:#5a3416"/>'; }
  function halfCookie(x, y, r) { return '<path d="M' + (x - r) + ' ' + y + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y + 'Z" style="fill:#c98a4b" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/>'; }
  /* g plates with k cookies each. o.half: each plate has half a cookie instead */
  function plates(g, k, o) {
    o = o || {};
    var pw = 112, per = g === 4 ? 2 : Math.min(g, 3), s = '';
    for (var i = 0; i < g; i++) {
      var x = 6 + (i % per) * (pw + 10), y = 6 + Math.floor(i / per) * 92, cx = x + pw / 2;
      s += '<ellipse cx="' + cx + '" cy="' + (y + 42) + '" rx="' + pw / 2 + '" ry="38" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2"/><ellipse cx="' + cx + '" cy="' + (y + 42) + '" rx="' + (pw / 2 - 10) + '" ry="28" style="fill:none;stroke:var(--line)" stroke-width="2"/>';
      if (o.half) s += halfCookie(cx, y + 50, 18);
      for (var j = 0; j < k; j++) { var cxx = cx + (j % 3 - (Math.min(k, 3) - 1) / 2) * 26, cyy = y + 42 + (k > 3 ? (j < 3 ? -12 : 12) : 0); s += cookie(cxx, cyy, 11); }
      if (o.lab) s += '<text x="' + cx + '" y="' + (y + 98) + '" text-anchor="middle" font-size="21" class="tb">' + o.lab[i] + '</text>';
    }
    var H = Math.ceil(g / per) * 92 + (o.lab ? 14 : 0);
    return A.svg(per * (pw + 10) + 2, H, s, o.label || g + ' plates with ' + (o.half ? 'half a cookie' : k + ' cookie' + (k === 1 ? '' : 's')) + ' on each');
  }
  /* sharing n things among p people: dealt one at a time, leftovers off to the side, optional cut */
  function share(n, p, o) {
    o = o || {};
    var each = Math.floor(n / p), left = n % p, s = '', bw = p > 2 ? 96 : 120, names = o.names || [];
    for (var i = 0; i < p; i++) {
      var x = 4 + i * (bw + 8);
      s += '<rect x="' + x + '" y="4" width="' + bw + '" height="' + (34 + Math.ceil(Math.max(each, 1) / 3) * 30) + '" rx="12" style="fill:color-mix(in srgb,var(--strand) 7%,var(--card));stroke:var(--line)" stroke-width="2"/>';
      s += '<text x="' + (x + bw / 2) + '" y="26" text-anchor="middle" font-size="21" class="tb">' + (names[i] || 'Person ' + (i + 1)) + '</text>';
      for (var j = 0; j < each; j++) s += cookie(x + bw / 2 + (j % 3 - 1) * 28, 50 + Math.floor(j / 3) * 30, 12);
      if (o.cut && left && p === 2 && left === 1) s += halfCookie(x + bw / 2, 58 + Math.ceil(each / 3) * 30, 12);
    }
    var H = 46 + Math.ceil(Math.max(each, 1) / 3) * 30 + (o.cut ? 20 : 0), lx = 4 + p * (bw + 8);
    if (left && !o.cut) {
      s += '<text x="' + (lx + 40) + '" y="26" text-anchor="middle" font-size="21" class="t2">left over</text>';
      for (var k = 0; k < left; k++) s += cookie(lx + 40, 50 + k * 30, 12);
      H = Math.max(H, 50 + left * 30);
    }
    return A.svg(lx + (left && !o.cut ? 84 : 0), H, s, n + ' cookies shared by ' + p + ': ' + each + ' each' + (left ? (o.cut ? ' and the last one cut so each gets a part' : ', ' + left + ' left over') : ''));
  }
  /* a round pizza cut into n equal parts, the first k shaded. o.bad: cut into 2 unequal parts */
  function pizza(n, k, o) {
    o = o || {};
    var r = o.r || 60, cx = r + 6, cy = r + 6, s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:#f6d58e;stroke:#b5762e" stroke-width="5"/>';
    if (o.bad) {
      var x = cx + r * 0.42, dy = Math.sqrt(r * r - (x - cx) * (x - cx));
      s += '<path d="M' + x + ' ' + (cy - dy) + 'A' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (cy + dy) + 'Z" style="fill:var(--cA);opacity:.75"/><line x1="' + x + '" y1="' + (cy - dy) + '" x2="' + x + '" y2="' + (cy + dy) + '" style="stroke:var(--ink)" stroke-width="3"/>';
      return A.svg(2 * r + 12, 2 * r + 12, s, o.label || 'A pizza cut into 2 parts that are not the same size');
    }
    for (var i = 0; i < n; i++) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
      if (i < k && n > 1) s += '<path d="M' + cx + ' ' + cy + 'L' + (cx + r * Math.cos(a0)) + ' ' + (cy + r * Math.sin(a0)) + 'A' + r + ' ' + r + ' 0 ' + (n === 1 ? 1 : 0) + ' 1 ' + (cx + r * Math.cos(a1)) + ' ' + (cy + r * Math.sin(a1)) + 'Z" style="fill:var(--cA);opacity:.75"/>';
      if (n > 1) s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + r * Math.cos(a0)) + '" y2="' + (cy + r * Math.sin(a0)) + '" style="stroke:var(--ink)" stroke-width="3"/>';
    }
    if (n === 1 && k) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 2) + '" style="fill:var(--cA);opacity:.75"/>';
    return A.svg(2 * r + 12, 2 * r + 12, s, o.label || 'A pizza cut into ' + n + ' equal part' + (n > 1 ? 's' : '') + (k ? ', ' + k + ' shaded' : ''));
  }
  /* a rectangle (a sandwich or a bar) cut into n equal parts, k shaded. o.bad for unequal cuts */
  function bar(n, k, o) {
    o = o || {};
    var w = o.w || 200, h = o.h || 56, s = '', xs = [0];
    if (o.bad) xs = n === 2 ? [0, 0.3] : [0, 0.15, 0.45, 0.8];
    else for (var i = 1; i < n; i++) xs.push(i / n);
    xs.push(1);
    for (var j = 0; j < xs.length - 1; j++) s += '<rect x="' + (4 + xs[j] * w) + '" y="4" width="' + (xs[j + 1] - xs[j]) * w + '" height="' + h + '" style="fill:' + (j < k ? 'var(--cB)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2.5"/>';
    if (o.text) s += '<text x="' + (4 + w / 2) + '" y="' + (h + 30) + '" text-anchor="middle" font-size="18" class="tb">' + o.text + '</text>';
    return A.svg(w + 8, h + (o.text ? 38 : 8), s, o.label || 'A bar cut into ' + (xs.length - 1) + (o.bad ? ' parts that are not equal' : ' equal parts') + (k ? ', ' + k + ' shaded' : ''));
  }

  function qGroups(lv) {
    if (lv === 3 && R.int(0, 1)) {
      var w = R.int(1, 4), h = 2 * w;
      return { q: h + ' children each get <b>one half</b> of a sandwich. How many whole sandwiches are needed?', type: 'num', answer: w, fig: plates(h, 0, { half: true, label: h + ' plates, each with half a cookie' }).replace(/fill:#c98a4b/g, 'fill:#e9c886'),
        hint: '2 halves make 1 whole. Put the children in pairs.', steps: ['2 halves make 1 whole sandwich.', 'Make pairs of children: ' + h + ' children make ' + w + ' pair' + (w > 1 ? 's' : '') + '.', 'Each pair shares 1 sandwich, so ' + w + ' sandwich' + (w > 1 ? 'es are' : ' is') + ' needed.'],
        explain: h + ' halves make ' + w + ' whole' + (w > 1 ? 's' : '') + '.' };
    }
    var g, k;
    if (lv === 1) { g = 2; k = R.int(1, 5); } else { do { g = R.int(2, 5); k = R.int(1, 5); } while (g * k > 10); }
    var tot = g * k, list = []; for (var i = 1; i <= g; i++) list.push(i * k);
    return { q: 'There are ' + g + ' plates. Each plate has ' + k + ' cookie' + (k > 1 ? 's' : '') + '. How many cookies in all?', type: 'num', answer: tot, fig: plates(g, k),
      hint: 'Count the cookies plate by plate. Count on ' + k + ' for each plate.', steps: ['Each plate has ' + k + '.', 'Count plate by plate: ' + list.join(', ') + '.', 'There are ' + tot + ' cookies in all.'], explain: g + ' groups of ' + k + ' make ' + tot + '.' };
  }
  function qShare(lv) {
    var p = lv === 3 ? 4 : 2, rem = lv === 1 ? 0 : R.int(1, p === 2 ? 1 : 2), each = R.int(1, lv === 1 ? 5 : p === 2 ? 5 : 2), n = p * each + rem;
    var who = R.shuffle(PEOPLE).slice(0, p), askLeft = rem && R.int(0, 1);
    return { q: n + ' cookies are shared fairly by ' + (p === 2 ? who.join(' and ') : p + ' friends') + '. ' + (askLeft ? 'How many cookies are <b>left over</b>?' : 'How many <b>whole</b> cookies does each get?'), type: 'num', answer: askLeft ? rem : each,
      fig: lv < 3 ? A.svg(Math.min(n, 6) * 30 + 6, Math.ceil(n / 6) * 30 + 4, Array.apply(null, Array(n)).map(function (_, i) { return cookie(18 + (i % 6) * 30, 17 + Math.floor(i / 6) * 30, 12); }).join(''), n + ' cookies') : '',
      hint: 'Deal them out one at a time, like cards: one for ' + who[0] + ', one for ' + who[1] + (p > 2 ? ', and so on' : '') + '.',
      steps: ['Give out the cookies one at a time, round and round.', 'Stop when there are not enough for everyone to get one more.', 'Each gets ' + each + '. ' + (rem ? rem + ' ' + (rem === 1 ? 'is' : 'are') + ' left over.' : 'None are left over.') + '<div class="fig">' + share(n, p, { names: p === 2 ? who : null }) + '</div>'],
      explain: n + ' shared by ' + p + ' is ' + each + ' each' + (rem ? ', with ' + rem + ' left over' + (p === 2 ? '. The last one can be cut in half.' : '. Those could be cut into equal pieces.') : '.') };
  }
  function qHalf(lv) {
    var shape = R.pick(['pizza', 'bar']), right = R.int(0, 2);
    if (lv === 3) {
      var opts = ['Yes, they are the same', 'No, they are different'];
      return { q: 'Is one half of a sandwich the same amount as two fourths of the same sandwich?', type: 'mc', options: opts, answer: 0, wide: true,
        fig: '<div class="vrow"><figure>' + bar(2, 1, { w: 180, label: 'A sandwich cut in halves, one half shaded' }) + '<figcaption>one half</figcaption></figure><figure>' + bar(4, 2, { w: 180, label: 'The same sandwich cut in fourths, two fourths shaded' }) + '<figcaption>two fourths</figcaption></figure></div>',
        hint: 'Compare the yellow parts. Do they cover the same amount?', steps: ['Cut a sandwich in half.', 'Cut each half in half again. Now there are 4 equal parts: fourths.', 'Two fourths cover the same part as one half.'], explain: 'Two fourths and one half are the same amount of the same whole.' };
    }
    var n = lv === 1 ? 2 : 4, name = n === 2 ? 'halves' : 'fourths', pics = [], labels = ['A', 'B', 'C'];
    for (var i = 0; i < 3; i++) {
      var good = i === right, pic;
      if (good) pic = shape === 'pizza' ? pizza(n, 0, { r: 44 }) : bar(n, 0, { w: 130, h: 48 });
      else if (i === (right + 1) % 3) pic = shape === 'pizza' && n === 2 ? pizza(2, 0, { r: 44, bad: true }) : bar(n, 0, { w: 130, h: 48, bad: true });
      else pic = shape === 'pizza' ? pizza(n === 2 ? 3 : 3, 0, { r: 44 }) : bar(n === 2 ? 3 : 5, 0, { w: 130, h: 48 });
      pics.push(pic);
    }
    return { q: 'Which one is cut into <b>' + name + '</b>?', type: 'mc', options: pics, answer: right,
      hint: name === 'halves' ? 'Halves are 2 parts that are the same size.' : 'Fourths are 4 parts that are the same size.',
      steps: ['Count the parts in each picture.', 'Look for ' + n + ' parts.', 'Check that the ' + n + ' parts are the same size. Those are ' + name + '.'],
      explain: name.charAt(0).toUpperCase() + name.slice(1) + ' are ' + n + ' equal parts. Parts that are different sizes are not ' + name + '.', chk: { n: n, right: right } };
  }
  function qFourth(lv) {
    if (lv === 1) {
      var n = R.pick([2, 4]);
      return { q: 'A pizza is cut into ' + n + ' equal parts. What is each part called?', type: 'mc', options: R.shuffle(['one half', 'one fourth', 'one third']).slice(0), answer: -1, fig: pizza(n, 1, { r: 56 }), _n: n };
    }
    var p = R.pick([2, 4]), whole = R.int(1, 3), parts = p * whole;
    return { q: 'How many <b>' + FRP[p] + '</b> make ' + (whole === 1 ? '1 whole' : whole + ' wholes') + '?', type: 'num', answer: parts, fig: '<div class="vrow">' + Array.apply(null, Array(whole)).map(function () { return '<figure>' + pizza(p, 0, { r: 36 }) + '</figure>'; }).join('') + '</div>',
      hint: 'Count the ' + FRP[p] + ' in each whole: ' + p + '.', steps: ['Each whole has ' + p + ' ' + FRP[p] + '.', 'There ' + (whole === 1 ? 'is 1 whole' : 'are ' + whole + ' wholes') + '.', 'Count them all: ' + parts + ' ' + FRP[p] + '.'], explain: whole + ' whole' + (whole > 1 ? 's' : '') + ' is ' + parts + ' ' + FRP[p] + '.' };
  }
  function fixFourth(q) {
    if (q.answer !== -1) return q;
    var want = q._n === 2 ? 'one half' : 'one fourth';
    q.answer = q.options.indexOf(want);
    q.hint = 'Count the equal parts. ' + q._n + ' equal parts are called ' + FRP[q._n] + '.';
    q.steps = ['Count the parts: ' + q._n + '.', q._n + ' equal parts are called ' + FRP[q._n] + '.', 'So each part is ' + want + '.'];
    q.explain = 'When a whole is cut into ' + q._n + ' equal parts, each part is ' + want + '.';
    delete q._n;
    return q;
  }
  function qCompare(lv) {
    var a, b;
    if (lv === 1) { a = 2; b = R.pick([4, 3]); }
    else if (lv === 2) { a = R.int(2, 5); b = R.int(a + 1, 8); }
    else { a = R.int(3, 8); b = R.int(a + 1, 10); }
    if (R.int(0, 1)) { var t = a; a = b; b = t; }
    var askBig = R.int(0, 1), win = askBig ? Math.min(a, b) : Math.max(a, b);
    var opts = [FR[a], FR[b]];
    return { q: 'Which piece is <b>' + (askBig ? 'bigger' : 'smaller') + '</b>: ' + FR[a] + ' or ' + FR[b] + ' of the same pizza?', type: 'mc', options: opts, answer: opts.indexOf(FR[win]),
      fig: lv < 3 ? '<div class="vrow"><figure>' + pizza(a, 1, { r: 46 }) + '<figcaption>' + FR[a] + '</figcaption></figure><figure>' + pizza(b, 1, { r: 46 }) + '<figcaption>' + FR[b] + '</figcaption></figure></div>' : '', chk: { a: a, b: b, big: askBig },
      hint: 'More people sharing means smaller pieces.', steps: [FR[a] + ' means the pizza is shared by ' + a + '. ' + FR[b] + ' means it is shared by ' + b + '.', 'When more people share, each piece is smaller.', FR[win] + ' is ' + (askBig ? 'bigger' : 'smaller') + '.'],
      explain: 'Shared by ' + Math.min(a, b) + ', pieces are bigger than when shared by ' + Math.max(a, b) + '. So ' + FR[win] + ' is ' + (askBig ? 'bigger' : 'smaller') + '.' };
  }

  A.register('groups-shares', {
    html:
'<section class="sec"><h2><span class="n">1</span>Equal groups</h2>' +
'<p><b>Equal groups</b> have the same number in each group. To find how many in all, count group by group.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + plates(3, 2, { lab: ['2', '4', '6'] }) + '</div><p>There are 3 plates with 2 cookies on each. I count by 2s: 2, 4, 6. There are <b>6 cookies</b>.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>Are these equal groups?</p><div class="fig">' + plates(3, 0, { label: 'Three plates: 2 cookies, 3 cookies, 2 cookies' }).replace('</svg>', cookie(52, 48, 11) + cookie(78, 48, 11) + cookie(161, 48, 11) + cookie(187, 48, 11) + cookie(174, 30, 11) + cookie(296, 48, 11) + cookie(322, 48, 11) + '</svg>') + '</div><ol>' +
'<li>Count each plate: 2, 3, 2.</li><li>The middle plate has more.</li><li>These are <b>not</b> equal groups.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: make equal groups</span><div class="row2">' + A.stepHtml('eg1', 'Plates', 3) + A.stepHtml('eg2', 'Cookies on each', 2) + '</div>' +
'<div class="fig" id="egfig"></div><div class="out" id="egout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Sharing fairly</h2>' +
'<p>To <b>share fairly</b>, everyone gets the same amount. Give things out one at a time, round and round, like dealing cards.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Mia and Leo share 7 cookies. One for Mia, one for Leo, one for Mia, one for Leo...</p><div class="fig">' + share(7, 2, { names: ['Mia', 'Leo'] }) + '</div><p>Each gets <b>3 cookies</b>. There is <b>1 left over</b>.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>4 friends share 10 cookies.</p><ol><li>Deal one to each friend: that uses 4.</li><li>Deal again: that uses 8. Only 2 are left, not enough for everyone.</li><li>Each friend gets <b>2</b>, and <b>2 are left over</b>.<div class="fig">' + share(10, 4) + '</div></li></ol></div>' +
'<div class="lab"><span class="lt">Try it: share fairly</span><div class="row2">' + A.stepHtml('sh1', 'Cookies', 7) + A.stepHtml('sh2', 'People', 2) + '</div>' +
'<div class="fig" id="shfig"></div><div class="out" id="shout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Halves</h2>' +
'<p>When 2 people share 1 thing, we cut it into 2 <b>equal parts</b>. Each part is <b>one half</b>.</p>' +
'<div class="vrow"><figure>' + pizza(2, 1, { r: 50 }) + '<figcaption>Halves: 2 equal parts</figcaption></figure><figure>' + pizza(2, 0, { r: 50, bad: true }) + '<figcaption>Not halves: the parts are not equal</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Mia and Leo share 7 cookies. Each gets 3. The last cookie is cut in half. Each gets <b>3 and one half</b> cookies.</p><div class="fig">' + share(7, 2, { names: ['Mia', 'Leo'], cut: true }) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Any cut into 2 parts is not halves. The 2 parts must be the <b>same size</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>2 halves make 1 whole. If 4 children each get one half of a sandwich, you need 2 sandwiches.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Fourths</h2>' +
'<p>When 4 people share 1 thing, we cut it into 4 equal parts. Each part is <b>one fourth</b>. Some people say one quarter.</p>' +
'<div class="vrow"><figure>' + pizza(4, 1, { r: 50 }) + '<figcaption>one fourth</figcaption></figure><figure>' + bar(4, 1, { w: 180 }) + '<figcaption>one fourth</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>I cut a sandwich in half. Then I cut each half in half again. Now there are 4 equal parts. <b>Two fourths</b> cover the same part as <b>one half</b>.</p>' +
'<div class="vrow"><figure>' + bar(2, 1, { w: 180 }) + '<figcaption>one half</figcaption></figure><figure>' + bar(4, 2, { w: 180 }) + '<figcaption>two fourths</figcaption></figure></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>One half and two fourths of the same whole are the <b>same amount</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: halves and fourths</span><div class="btnrow" role="group" aria-label="Cut into"><button type="button" class="btn alt" data-cut="1">Whole</button><button type="button" class="btn" data-cut="2">Halves</button><button type="button" class="btn alt" data-cut="4">Fourths</button></div>' +
A.stepHtml('hf1', 'Parts to colour', 1) + '<div class="fig" id="hffig"></div><div class="out" id="hfout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>More sharers, smaller pieces</h2>' +
'<p>The same pizza can be shared by 2, 3, 4 or more people. The <b>more people</b> share, the <b>smaller</b> each piece is.</p>' +
'<div class="vrow"><figure>' + pizza(2, 1, { r: 40 }) + '<figcaption>shared by 2: one half</figcaption></figure><figure>' + pizza(3, 1, { r: 40 }) + '<figcaption>shared by 3: one third</figcaption></figure><figure>' + pizza(4, 1, { r: 40 }) + '<figcaption>shared by 4: one fourth</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Which is bigger, one third or one fifth? One third is shared by 3 people. One fifth is shared by 5 people. Fewer people means bigger pieces, so <b>one third is bigger</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>5 is more than 3, but one fifth is <b>smaller</b> than one third. More sharers make smaller pieces.</p></div>' +
'<div class="lab"><span class="lt">Try it: share one pizza</span>' + A.stepHtml('pz1', 'People sharing', 3) +
'<div class="fig" id="pzfig"></div><div class="out" id="pzout"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$, g = 3, k = 2, e1, e2;
      function eg() {
        var list = []; for (var i = 1; i <= g; i++) list.push(i * k);
        $('#egfig', root).innerHTML = plates(g, k, { lab: list });
        $('#egout', root).innerHTML = g + ' groups of ' + k + '. Count: ' + list.join(', ') + '. <span class="big">' + g * k + '</span> in all.';
      }
      e1 = A.stepper(root, 'eg1', 1, 5, function (n) { g = n; if (e2 && g * k > 10) { e2.set(Math.floor(10 / g)); return; } eg(); });
      e2 = A.stepper(root, 'eg2', 1, 5, function (n) { if (g * n > 10) { e2.set(Math.floor(10 / g)); return; } k = n; eg(); });
      var n = 7, p = 2;
      function sh() {
        var each = Math.floor(n / p), left = n % p;
        $('#shfig', root).innerHTML = share(n, p);
        $('#shout', root).innerHTML = n + ' shared by ' + p + ': each gets <span class="big">' + each + '</span>' + (left ? ', and ' + left + ' ' + (left === 1 ? 'is' : 'are') + ' left over.' + (p === 2 && left === 1 ? ' Cut it in half so each gets one half more.' : '') : '. None left over.');
      }
      A.stepper(root, 'sh1', 2, 12, function (v) { n = v; sh(); });
      A.stepper(root, 'sh2', 2, 4, function (v) { p = v; sh(); });
      var cut = 2, col = 1, hs;
      function hf() {
        col = Math.min(col, cut);
        $('#hffig', root).innerHTML = '<div class="vrow"><figure>' + pizza(cut, col, { r: 56 }) + '</figure><figure>' + bar(cut, col, { w: 200 }) + '</figure></div>';
        var name = cut === 1 ? 'whole' : FRP[cut];
        $('#hfout', root).innerHTML = cut === 1 ? (col ? 'One whole, all coloured.' : 'One whole, not cut.') : 'Cut into ' + cut + ' equal parts: ' + name + '. ' + (col ? col + ' coloured' + (cut === 4 && col === 2 ? ': two fourths, the same as one half.' : cut === 4 && col === 4 ? ': four fourths make one whole.' : cut === 2 && col === 2 ? ': two halves make one whole.' : '.') : '');
      }
      hs = A.stepper(root, 'hf1', 0, 4, function (v) { if (v > cut) { hs.set(cut); return; } col = v; hf(); });
      A.$$('[data-cut]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          cut = +b.getAttribute('data-cut');
          A.$$('[data-cut]', root).forEach(function (x) { x.classList.toggle('alt', x !== b); x.setAttribute('aria-pressed', String(x === b)); });
          if (hs.get() > cut) hs.set(cut); else hf();
        });
        b.setAttribute('aria-pressed', String(b.getAttribute('data-cut') === '2'));
      });
      A.stepper(root, 'pz1', 1, 10, function (v) {
        $('#pzfig', root).innerHTML = pizza(v, 1, { r: 70 });
        $('#pzout', root).innerHTML = v === 1 ? 'One person gets the whole pizza.' : 'Shared by ' + v + ': each piece is <b>' + FR[v] + '</b>. ' + (v > 2 ? 'That is smaller than ' + FR[v - 1] + '.' : 'Two halves make the whole.');
      });
    },

    checks: [
      [function () { return qGroups(1); }, function () { return qGroups(2); }, function () { return qGroups(2); }],
      [function () { return qShare(1); }, function () { return qShare(2); }, function () { return qShare(2); }],
      [function () { return qHalf(1); }, function () { return qHalf(1); }, function () { return qGroups(3); }],
      [function () { return fixFourth(qFourth(1)); }, function () { return qHalf(2); }, function () { return qHalf(3); }],
      [function () { return qCompare(1); }, function () { return qCompare(2); }, function () { return qCompare(2); }]
    ],

    quiz: [
      { q: 'There are 4 plates. Each plate has 2 cookies. How many cookies in all?', type: 'num', answer: 8, fig: plates(4, 2),
        hint: 'Count by 2s, one plate at a time.', explain: '2, 4, 6, 8. There are 8 cookies.' },
      { q: '9 cookies are shared fairly by 2 children. How many whole cookies does each get?', type: 'num', answer: 4,
        hint: 'Deal them out one at a time.', explain: 'Each gets 4, and 1 is left over. 4 + 4 + 1 = 9.' },
      { q: '10 cookies are shared fairly by 4 friends. How many are left over?', type: 'num', answer: 2,
        hint: 'Each friend gets 2. How many is that? How many are left?', explain: '4 friends get 2 each: 8 cookies. 10 &minus; 8 = 2 left over.' },
      { q: 'Which one is cut into <b>halves</b>?', type: 'mc', options: [pizza(2, 0, { r: 44, bad: true }), pizza(3, 0, { r: 44 }), pizza(2, 0, { r: 44 })], answer: 2,
        hint: 'Halves are 2 equal parts.', explain: 'The last one has 2 parts that are the same size.' },
      { q: 'Is one half of a pizza the same amount as two fourths of the same pizza?', type: 'mc', options: ['Yes', 'No'], answer: 0,
        fig: '<div class="vrow"><figure>' + pizza(2, 1, { r: 44 }) + '</figure><figure>' + pizza(4, 2, { r: 44 }) + '</figure></div>',
        hint: 'Compare the shaded parts.', explain: 'Two fourths cover the same part as one half.' },
      { q: '6 children each get one half of an orange. How many whole oranges are needed?', type: 'num', answer: 3,
        hint: '2 halves make 1 whole.', explain: '6 halves make 3 wholes.' },
      { q: 'Which piece is bigger: one third or one sixth of the same pizza?', type: 'mc', options: ['one third', 'one sixth'], answer: 0,
        hint: 'Fewer people sharing means bigger pieces.', explain: 'One third is shared by 3 people, one sixth by 6. Fewer sharers, bigger pieces: one third.' }
    ],

    practice: [
      { id: 'g-groups', name: 'Equal groups', code: 'B2.5', gen: qGroups },
      { id: 'g-share', name: 'Share fairly', code: 'B1.6', gen: qShare },
      { id: 'g-half', name: 'Halves and fourths', code: 'B1.6, B1.7', gen: qHalf },
      { id: 'g-parts', name: 'Name the parts', code: 'B1.7', gen: function (lv) { return fixFourth(qFourth(lv)); } },
      { id: 'g-compare', name: 'Bigger or smaller piece', code: 'B1.8', gen: qCompare }
    ]
  });
})();
