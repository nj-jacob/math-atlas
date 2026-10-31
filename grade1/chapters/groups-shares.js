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

  var CH = 'groups-shares';
  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters[CH].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  /* "Try it": deal cookies onto plates one at a time. Tap a plate to give it the next cookie. */
  function dealer(n, p, msg) {
    return { do: 'Share <b>' + n + ' cookies</b> fairly between <b>' + p + ' plates</b>. Tap a plate to put a cookie on it.', mount: function (host, done) {
      var on = [], left = n, names = ['Mia', 'Leo', 'Ava', 'Sam'];
      for (var i = 0; i < p; i++) on.push(0);
      function draw() {
        host.innerHTML = '<p class="big">Cookies left to share: <b>' + left + '</b></p><div class="g1-cards" style="--cols:' + p + '">' + on.map(function (k, i) {
          var s = '';
          for (var j = 0; j < k; j++) s += cookie(18 + (j % 3) * 30, 18 + Math.floor(j / 3) * 30, 12);
          return '<button type="button" class="g1-card" data-i="' + i + '"' + (left ? '' : ' disabled') + '><span>' + names[i] + '</span>' + A.svg(96, 18 + Math.max(1, Math.ceil(k / 3)) * 30, s, names[i] + ' has ' + k) + '<b>' + k + '</b></button>';
        }).join('') + '</div><p class="t2">' + (left ? 'Give one to each person, then go round again.' : '') + '</p><button type="button" class="btn alt">Start again</button>';
        A.$$('.g1-card', host).forEach(function (b) { b.addEventListener('click', function () { if (!left) return; on[+b.getAttribute('data-i')]++; left--; draw(); Manip.bump(A.$$('.g1-card', host)[+b.getAttribute('data-i')], 'mp-pop'); check(); }); });
        A.$('.btn', host).addEventListener('click', function () { for (var i = 0; i < p; i++) on[i] = 0; left = n; draw(); });
      }
      function check() {
        if (left) return;
        var fair = on.every(function (k) { return k === on[0]; });
        A.$('.t2', host).innerHTML = fair ? 'Everyone has ' + on[0] + '. That is fair.' : 'Not fair yet: some plates have more. Press Start again.';
        if (fair) done(msg);
      }
      draw();
    } };
  }

  /* plates that do not all hold the same number */
  function uneq(ks) { return '<div class="vrow">' + ks.map(function (k) { return plates(1, k, { label: 'A plate with ' + k + ' cookies' }); }).join('') + '</div>'; }

  var LESSONS = [
    { id: 'groups', title: 'Equal groups', sub: 'The same number in each group.', concepts: [
      { id: 'equal', title: 'What equal groups are', exp: ['B2.5'], skill: 'g-groups',
        body: '<p><b>Equal groups</b> have the same number in each group. 3 plates with 2 cookies each are equal groups.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Are these equal groups? 2, 3 and 2 cookies.', act: function (t) { return t.show(uneq([2, 3, 2])); }, ms: 1600 },
          { say: 'No. One plate has more. They are <b>not equal</b>.', ms: 1400 },
          { say: 'Now every plate has 2. These are <b>equal groups</b>.', act: function (t) { return t.show(plates(3, 2)); }, ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, cols: 1, items: [{ id: 'y', html: plates(4, 3) }, { id: 'n', html: uneq([3, 1, 4, 3]) }] }, tasks: [
          { do: 'Tap the picture that shows <b>equal groups</b>.', goal: function (s) { return s.picked[0] === 'y'; }, yes: 'Yes. Every plate has 3 cookies.' }
        ] },
        key: '<p>Equal groups: <b>the same number</b> in each group.</p>',
        check: [P('g-groups', 1), P('g-groups', 1)] },
      { id: 'count', title: 'Count equal groups', exp: ['B2.5'], skill: 'g-groups',
        body: '<p>To count equal groups, <b>skip count</b>. 3 plates with 2 cookies: 2, 4, <b>6</b>.</p>',
        watch: { tool: 'counters', opts: { n: 10, arrange: 'pairs' }, steps: [
          { say: '5 groups of 2.', ms: 1200 },
          { say: 'Count by 2s: 2, 4, 6, 8, 10.', act: function (t) { return t.countAll(260); }, ms: 900 },
          { say: '5 groups of 2 make <b>10</b>.', ms: 1800 }
        ] },
        try: { tool: 'counters', opts: { n: 20, arrange: 'tens', controls: ['tens'], max: 50 }, tasks: [
          { do: 'Make <b>3 groups of 10</b>. Count by 10s.', goal: function (s) { return s.n === 30 && s.mode === 'tens'; }, yes: '10, 20, 30. 3 groups of 10 make 30.' }
        ] },
        key: '<p>Count equal groups by <b>skip counting</b>.</p>',
        check: [P('g-groups', 2), P('g-groups', 3)] }
    ] },

    { id: 'share', title: 'Sharing fairly', sub: 'Give one at a time.', concepts: [
      { id: 'deal', title: 'Deal one at a time', exp: ['B1.6'], skill: 'g-share',
        body: '<p>To <b>share fairly</b>, everyone gets the same amount. Give things out one at a time, round and round, like dealing cards.</p>',
        watch: { tool: 'g1stage', steps: [0, 1, 2, 3, 4, 5, 6].map(function (k) {
          return { say: k ? (k < 6 ? 'One for ' + (k % 2 ? 'Mia' : 'Leo') + '.' : 'Each gets <b>3</b>. That is fair.') : 'Mia and Leo share 6 cookies.', act: function (t) { return t.show(share(k, 2, { names: ['Mia', 'Leo'] })); }, ms: k === 6 ? 1800 : 700 };
        }) },
        try: dealer(9, 3, 'Fair: everyone has 3 cookies.'),
        key: '<p>Fair shares are <b>equal</b>. Give out one at a time.</p>',
        check: [P('g-share', 1), P('g-share', 1)] },
      { id: 'left', title: 'When some are left over', exp: ['B1.6'], skill: 'g-share', hard: true,
        body: '<p>Sometimes things do not share evenly. 7 cookies for 2 people: each gets 3, and <b>1 is left over</b>. We can cut it in half so each gets <b>3 and one half</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: '7 cookies for Mia and Leo. Deal them out.', act: function (t) { return t.show(share(6, 2, { names: ['Mia', 'Leo'] })); }, ms: 1500 },
          { say: 'Each has 3. One is <b>left over</b>.', act: function (t) { return t.show(share(7, 2, { names: ['Mia', 'Leo'] })); }, ms: 1700 },
          { say: 'Cut it in half. Each gets 3 and one half.', act: function (t) { return t.show(share(7, 2, { names: ['Mia', 'Leo'], cut: true })); }, ms: 2000 }
        ] },
        try: dealer(10, 3, 'Each has 3, and 1 cookie is left over.'),
        ways: [{ label: 'With counters', html: '<p>Put out 7 counters. Make 2 rows, one counter in each row at a time. The extra counter has no partner. It is left over.</p>', tool: 'counters', opts: { n: 7, arrange: 'pairs' } }],
        mistake: '<p>Giving the left-over item to one person. Ask: "Is that still fair?"</p>',
        key: '<p>If some are left over, they can be <b>cut</b> or <b>set aside</b>.</p>',
        check: [P('g-share', 2), P('g-share', 3)] }
    ] },

    { id: 'halves', title: 'Halves', sub: '2 equal parts.', concepts: [
      { id: 'half', title: 'One half', exp: ['B1.7'], skill: 'g-half',
        body: '<p>When 2 people share 1 thing, we cut it into <b>2 equal parts</b>. Each part is <b>one half</b>.</p>',
        watch: { tool: 'fractions', opts: { parts: 1, words: true }, steps: [
          { say: 'One whole sandwich.', ms: 1200 },
          { say: 'Cut it into 2 equal parts.', act: function (t) { return t.split(2); }, ms: 1000 },
          { say: 'Each part is <b>one half</b>.', act: function (t) { return t.shade(1); }, ms: 1400 },
          { say: 'Two halves make one whole.', act: function (t) { return t.shade(2); }, ms: 1800 }
        ] },
        try: { tool: 'fractions', opts: { parts: 1, choices: [1, 2, 4], words: true }, tasks: [
          { do: 'Cut the strip into <b>halves</b>. Then shade <b>one half</b>.', goal: function (s) { return s[0].d === 2 && s[0].n === 1; }, yes: 'Yes. One of 2 equal parts is one half.' }
        ] },
        key: '<p><b>One half</b> is one of <b>2 equal parts</b>.</p>',
        check: [P('g-half', 1), P('g-half', 1)] },
      { id: 'not-half', title: 'Halves must be equal', exp: ['B1.7'], skill: 'g-half', hard: true,
        body: '<p>Any cut into 2 parts is <b>not</b> halves. The 2 parts must be the <b>same size</b>.</p><div class="vrow"><figure>' + pizza(2, 1) + '<figcaption>halves</figcaption></figure><figure>' + pizza(2, 1, { bad: true }) + '<figcaption>not halves</figcaption></figure></div>',
        try: { tool: 'g1pick', opts: { items: [{ id: 'a', html: pizza(2, 0) }, { id: 'b', html: pizza(2, 0, { bad: true }) }, { id: 'c', html: bar(2, 0) }, { id: 'd', html: bar(2, 0, { bad: true }) }] }, tasks: [
          { do: 'Tap <b>every</b> one that is cut into halves.', goal: function (s) { return s.n === 2 && s.picked.indexOf('a') >= 0 && s.picked.indexOf('c') >= 0; }, yes: 'Yes. Those parts are the same size.' }
        ] },
        ways: [
          { label: 'Fold it', html: '<p>Fold a piece of paper so the edges match. The fold makes 2 halves. If the edges do not match, the parts are not halves.</p>' },
          { label: 'Ask: is it fair?', html: '<p>If you and a friend each got one part, would it be fair? If yes, it is halves.</p>' }
        ],
        mistake: '<p>Calling any 2-piece cut "halves". Ask: "Would that be fair if you shared it?"</p>',
        key: '<p>Halves are <b>2 equal parts</b>.</p>',
        check: [P('g-half', 2), P('g-half', 2)] }
    ] },

    { id: 'fourths', title: 'Fourths', sub: '4 equal parts.', concepts: [
      { id: 'fourth', title: 'One fourth', exp: ['B1.7'], skill: 'g-parts',
        body: '<p>When 4 people share 1 thing, we cut it into <b>4 equal parts</b>. Each part is <b>one fourth</b>. Some people say <b>one quarter</b>.</p>',
        watch: { tool: 'fractions', opts: { parts: 1, words: true }, steps: [
          { say: 'One whole.', ms: 1000 },
          { say: 'Cut it into 4 equal parts.', act: function (t) { return t.split(4); }, ms: 1000 },
          { say: 'Each part is <b>one fourth</b>.', act: function (t) { return t.shade(1); }, ms: 1400 },
          { say: 'Four fourths make one whole.', act: function (t) { return t.shade(4); }, ms: 1800 }
        ] },
        try: { tool: 'fractions', opts: { parts: 1, choices: [1, 2, 4], words: true }, tasks: [
          { do: 'Cut the strip into <b>fourths</b>. Shade <b>one fourth</b>.', goal: function (s) { return s[0].d === 4 && s[0].n === 1; }, yes: 'One of 4 equal parts is one fourth.' },
          { do: 'Now shade <b>three fourths</b>.', reset: false, goal: function (s) { return s[0].d === 4 && s[0].n === 3; }, yes: 'Three of the 4 equal parts: three fourths.' }
        ] },
        key: '<p><b>One fourth</b> is one of <b>4 equal parts</b>.</p>',
        check: [P('g-parts', 1), P('g-parts', 2)] },
      { id: 'two-fourths', title: 'One half is two fourths', exp: ['B1.7'], skill: 'g-parts',
        body: '<p>Cut each half in half again, and you get fourths. <b>One half</b> is the same amount as <b>two fourths</b>.</p>',
        watch: { tool: 'fractions', opts: { wall: [2, 4], words: true }, steps: [
          { say: 'The top strip is in halves. The bottom strip is in fourths.', ms: 1500 },
          { say: 'Shade one half.', act: function (t) { return t.shade(1, 0); }, ms: 900 },
          { say: 'Shade two fourths. They line up: <b>one half = two fourths</b>.', act: function (t) { return t.shade(2, 1); }, ms: 2000 }
        ] },
        try: { tool: 'fractions', opts: { wall: [2, 4], words: true }, tasks: [
          { do: 'Shade one half on the top strip. Then shade the same amount on the bottom strip.', goal: function (s) { return s[0].n === 1 && s[1].n === 2; }, yes: 'One half is two fourths.' }
        ] },
        key: '<p><b>One half = two fourths.</b></p>',
        check: [P('g-parts', 3), P('g-half', 3)] }
    ] },

    { id: 'size', title: 'More sharers, smaller pieces', sub: 'Halves are bigger than fourths.', concepts: [
      { id: 'smaller', title: 'More people, smaller pieces', exp: ['B1.8'], skill: 'g-compare', hard: true,
        body: '<p>The more people share one thing, the <b>smaller</b> each piece. A half is bigger than a fourth.</p>',
        watch: { tool: 'fractions', opts: { wall: [1, 2, 4], words: true }, steps: [
          { say: '1 person gets the whole thing.', act: function (t) { return t.shade(1, 0); }, ms: 1200 },
          { say: '2 people: each gets one half.', act: function (t) { return t.shade(1, 1); }, ms: 1200 },
          { say: '4 people: each gets one fourth. Smaller.', act: function (t) { return t.shade(1, 2); }, ms: 1400 },
          { say: 'More sharers, <b>smaller pieces</b>.', ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: 'h', html: pizza(2, 1) + '<span>shared by 2</span>' }, { id: 'f', html: pizza(4, 1) + '<span>shared by 4</span>' }] }, tasks: [
          { do: 'Which gives a <b>bigger</b> piece?', goal: function (s) { return s.picked[0] === 'h'; }, yes: 'Sharing with fewer people gives bigger pieces. One half is bigger than one fourth.' }
        ] },
        ways: [{ label: 'Think of a pizza', html: '<p>Would you rather share a pizza with 1 friend or with 3 friends? With 1 friend you get a bigger piece.</p>' }],
        mistake: '<p>Thinking one fourth is bigger than one half because 4 is bigger than 2. Show both pieces cut from the same size paper.</p>',
        key: '<p>More sharers, <b>smaller</b> pieces.</p>',
        check: [P('g-compare', 1), P('g-compare', 2)] }
    ] }
  ];

  A.register('groups-shares', {
    lessons: LESSONS,
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

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ---------- */
  var G = window.G1, nm = A.Q ? A.Q.name : function () { return R.pick(PEOPLE); };
  function groupSize(lv) { var g = lv === 1 ? 2 : R.int(2, 4), k = R.int(1, lv === 1 ? 5 : Math.floor(10 / g)); return [g, k]; }
  /* two plates side by side, for "is it fair?" */
  function twoPlates(a, b) { return '<div class="vrow">' + plates(1, a, { label: a + ' cookies' }) + plates(1, b, { label: b + ' cookies' }) + '</div>'; }
  var SHAPES = {
    'g-groups': [
      [1, 'tap', function (lv) {
        var p = groupSize(lv), g = p[0], k = p[1], set = R.shuffle([[g, k], [g, k === 1 ? 2 : k - 1], [g + 1, k]]);
        return { q: 'Tap the picture that shows <b>' + g + ' groups of ' + k + '</b>.', type: 'tap', tiles: set.map(function (x) { return plates(x[0], x[1]); }), answer: set.map(function (x) { return x.join(); }).indexOf(g + ',' + k), answerText: g + ' plates with ' + k + ' on each',
          hint: 'Count the plates. Then count the cookies on one plate.', steps: ['You want ' + g + ' plates.', 'Each plate needs ' + k + ' cookie' + (k > 1 ? 's' : '') + '.'],
          explain: g + ' groups of ' + k + ' make ' + g * k + '.', meta: { k: 'g1-groups-tap' } };
      }],
      [1, 'story', function (lv) {
        var p = groupSize(lv), g = p[0], k = p[1], c = R.pick([['bags', 'apples'], ['boxes', 'crayons'], ['nests', 'eggs'], ['vases', 'flowers']]);
        return { q: 'There are ' + g + ' ' + c[0] + '. Each has ' + k + ' ' + c[1] + '. How many ' + c[1] + ' in all?', type: 'num', answer: g * k,
          hint: 'Count by ' + k + 's, one number for each of the ' + c[0] + '.', steps: ['Add ' + k + ', ' + g + ' times.'],
          explain: g + ' groups of ' + k + ' make ' + g * k + '.', meta: { k: 'g1-groups-story' } };
      }],
      [2, 'fill', function (lv) {
        var p = groupSize(lv), g = Math.max(2, p[0]), k = Math.max(1, Math.min(p[1], Math.floor(10 / g))), blanks = [];
        for (var i = 0; i < g; i++) blanks.push('[[]]');
        var ans = blanks.map(function () { return k; }).concat([g * k]);
        return { q: 'Fill in the adding sentence for the picture.', type: 'fill', fig: plates(g, k), fill: blanks.join(' + ') + ' = [[]]', answers: ans,
          hint: 'Write how many are on each plate. Then add.', steps: ['Each plate has ' + k + '.', 'Add them: ' + ans.slice(0, g).join(' + ') + ' = ' + g * k + '.'],
          explain: ans.slice(0, g).join(' + ') + ' = ' + g * k + '.', meta: { k: 'g1-groups-fill' } };
      }]
    ],
    'g-share': [
      [1, 'tap', function (lv) {
        var each = R.int(2, lv === 1 ? 3 : 5), set = R.shuffle([[each, each], [each + 1, each - 1], [each - 1, each + 1]]);
        return { q: (each * 2) + ' cookies are shared by 2 friends. Tap the <b>fair</b> share.', type: 'tap', tiles: set.map(function (x) { return twoPlates(x[0], x[1]); }), answer: set.map(function (x) { return x[0] === x[1]; }).indexOf(true), answerText: each + ' cookies each',
          hint: 'Fair means each plate has the same number.', steps: ['Count the cookies on each plate.', 'Fair means both plates match.'],
          explain: 'Fair: ' + each + ' and ' + each + '.', meta: { k: 'g1-share-tap' } };
      }],
      [1, 'mistake', function (lv) {
        var n = R.int(2, 5) * 2 + (lv === 1 ? 0 : 1), each = Math.floor(n / 2), left = n % 2, who = nm(), truth = !R.int(0, 2), said = truth ? each : each + 1;
        var right = n + ' shared by 2 is ' + each + ' each' + (left ? ', with 1 left over.' : '.');
        return G.tf(who + ' shares ' + n + ' cookies fairly with a friend. ' + who + ' says each gets <b>' + said + '</b> whole cookies. True or false: ' + who + ' is right.', truth, right,
          ['The one who shares gets more.', 'Fair means everyone gets ' + n + '.', 'Leftovers go to one person.'], { k: 'g1-share-tf', n: n, said: said },
          { hint: 'Deal them out one at a time.' });
      }],
      [2, 'fill', function (lv) {
        var p = lv === 3 ? R.pick([2, 4]) : 2, each = R.int(1, 4), left = R.int(0, p - 1), n = p * each + left;
        return { q: n + ' cookies are shared fairly by ' + p + ' friends. Fill in the blanks.', type: 'fill', fill: 'Each gets [[]] whole cookies. [[]] left over.', answers: [each, left],
          hint: 'Deal them out one at a time.', steps: ['Give one to each friend, round and round.', 'Each gets ' + each + '. ' + left + ' left over.'],
          explain: n + ' shared by ' + p + ' is ' + each + ' each, with ' + left + ' left over.', meta: { k: 'g1-share-fill' } };
      }]
    ],
    'g-half': [
      [1, 'pick', function (lv) {
        var n = lv === 1 ? 2 : 4, m = n === 2 ? 4 : 2, all = [[bar(n, 0, { w: 120, h: 40 }), 1], [bar(n, 0, { w: 120, h: 40, bad: true }), 0], [bar(m, 0, { w: 120, h: 40 }), 1], [bar(m, 0, { w: 120, h: 40, bad: true }), 0]];
        all = R.shuffle(all);
        var opts = all.map(function (x) { return x[0]; }), ans = []; all.forEach(function (x, j) { if (x[1]) ans.push(j); });
        return { q: 'Pick every sandwich cut into <b>equal</b> parts.', type: 'pick', options: opts, answer: ans,
          hint: 'Equal parts are all the same size.', steps: ['Look at each part. Are they all the same size?'],
          explain: 'Equal parts are all the same size, however many there are.', meta: { k: 'g1-half-pick' } };
      }],
      [1, 'mistake', function (lv) {
        var n = lv === 1 ? 2 : 4, truth = !R.int(0, 2), who = nm(), name = n === 2 ? 'halves' : 'fourths';
        var right = truth ? 'There are ' + n + ' equal parts, so they are ' + name + '.' : 'The parts are not the same size, so they are not ' + name + '.';
        return G.tf(who + ' says this sandwich is cut into <b>' + name + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['Any ' + n + ' parts are ' + name + '.', 'Big parts are always ' + name + '.', 'The number of parts does not matter.'], { k: 'g1-half-tf' },
          { fig: bar(n, 0, { w: 200, h: 56, bad: !truth }), hint: name + ' must be equal parts.' });
      }],
      [2, 'match', function () {
        var list = R.shuffle([[1, 'one whole'], [2, 'halves'], [4, 'fourths']]);
        return { q: 'Match each sandwich to its name.', type: 'match', pairs: list.map(function (x) { return [bar(x[0], 0, { w: 120, h: 40 }), x[1]]; }),
          hint: 'Count the equal parts.', steps: ['2 equal parts are halves. 4 equal parts are fourths.'],
          explain: 'Not cut is one whole. 2 equal parts are halves. 4 equal parts are fourths.', meta: { k: 'g1-half-match' } };
      }]
    ],
    'g-parts': [
      [1, 'match', function () {
        var list = R.shuffle([[1, 'one whole'], [2, 'one half'], [4, 'one fourth']]);
        return { q: 'Match each shaded part to its name.', type: 'match', pairs: list.map(function (x) { return [pizza(x[0], 1, { r: 34 }), x[1]]; }),
          hint: 'Count the equal parts of each pizza.', steps: ['2 equal parts: each is one half. 4 equal parts: each is one fourth.'],
          explain: 'One of 2 equal parts is one half. One of 4 equal parts is one fourth.', meta: { k: 'g1-pname-match' } };
      }],
      [1, 'tap', function () {
        var want = R.pick([2, 4]), set = R.shuffle([[2, 1], [4, 1], [4, 2]]).filter(function (x) { return !(want === 2 && x[0] === 4 && x[1] === 2); });
        if (set.length < 3) set.push([1, 1]);
        set = R.shuffle(set);
        return { q: 'Tap the pizza with <b>' + FR[want] + '</b> shaded.', type: 'tap', tiles: set.map(function (x) { return pizza(x[0], x[1], { r: 40 }); }), answer: set.map(function (x) { return x.join(); }).indexOf(want + ',1'), answerText: 'the pizza cut into ' + want + ' with one part shaded',
          hint: FR[want] + ' is one of ' + want + ' equal parts.', steps: ['Count the parts of each pizza.', 'Find ' + want + ' parts with one shaded.'],
          explain: FR[want] + ' is one part out of ' + want + ' equal parts.', meta: { k: 'g1-pname-tap' } };
      }],
      [2, 'fill', function () {
        return { q: 'Fill in the blanks.', type: 'fill', fill: '[[]] halves make one whole. [[]] fourths make one whole.', answers: [2, 4], fig: '<div class="vrow">' + pizza(2, 2, { r: 34 }) + pizza(4, 4, { r: 34 }) + '</div>',
          hint: 'Count the equal parts in each whole pizza.', steps: ['A pizza cut in halves has 2 parts.', 'A pizza cut in fourths has 4 parts.'],
          explain: '2 halves make one whole. 4 fourths make one whole.', meta: { k: 'g1-pname-fill' } };
      }]
    ],
    'g-compare': [
      [1, 'tap', function (lv) {
        var a = 2, b = lv === 1 ? 4 : R.int(3, 6), big = R.int(0, 1), set = R.shuffle([a, b]), ans = big ? a : b;
        return { q: 'Both pizzas are the same size. Tap the <b>' + (big ? 'bigger' : 'smaller') + '</b> shaded piece.', type: 'tap', tiles: set.map(function (n) { return pizza(n, 1, { r: 44 }); }), answer: set.indexOf(ans), answerText: FR[ans],
          hint: 'More pieces means smaller pieces.', steps: ['Count the pieces in each pizza.', 'The pizza with fewer pieces has bigger pieces.'],
          explain: FR[2] + ' is bigger than ' + FR[b] + '.', meta: { k: 'g1-pcmp-tap' } };
      }],
      [1, 'mistake', function (lv) {
        var b = lv === 1 ? 4 : R.int(3, 8), who = nm(), truth = !R.int(0, 2), x = truth ? 2 : b, y = truth ? b : 2;
        var right = FR[2] + ' is bigger than ' + FR[b] + '. Fewer equal parts means bigger parts.';
        return G.tf(who + ' says <b>' + FR[x] + '</b> of a pizza is bigger than <b>' + FR[y] + '</b> of the same pizza. True or false: ' + who + ' is right.', truth, right,
          [b + ' is more than 2, so ' + FR[b] + ' is bigger.', 'All pieces are the same size.', 'The piece with the longer name is bigger.'], { k: 'g1-pcmp-tf' },
          { hint: 'Picture the pizza cut into 2, then into ' + b + '.' });
      }],
      [2, 'order', function (lv) {
        var ds = R.shuffle([2, 3, 4, 5, 6, 8]).slice(0, 3).sort(function (a, b) { return a - b; });
        return { q: 'Put the pieces of the same pizza in order from <b>biggest to smallest</b>.', type: 'order', items: ds.map(function (d) { return FR[d]; }), first: 'biggest', last: 'smallest',
          hint: 'Fewer parts means bigger parts.', steps: ['The fewest parts make the biggest piece: ' + FR[ds[0]] + '.'],
          explain: ds.map(function (d) { return FR[d]; }).join(', ') + '.', meta: { k: 'g1-pcmp-order' } };
      }]
    ]
  };
  G.shapes(CH, SHAPES);
})();
