(function () {
  var A = Atlas, R = A.R, D = A.draw, M = '&minus;';
  var COLS = ['var(--strand)', 'var(--p1)', 'var(--se)', 'var(--sc)', 'var(--sf)', 'var(--p0)'];
  /* g plates with n things on each. Wraps after 4 plates. */
  function plates(g, n, kind, label) {
    var pw = 116, ph = 96, per = Math.min(g, 4), s = '';
    for (var i = 0; i < g; i++) {
      var px = 6 + (i % per) * (pw + 12), py = 6 + Math.floor(i / per) * (ph + 12);
      s += '<ellipse cx="' + (px + pw / 2) + '" cy="' + (py + ph / 2) + '" rx="' + pw / 2 + '" ry="' + ph / 2 + '" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2.5"/>';
      s += '<ellipse cx="' + (px + pw / 2) + '" cy="' + (py + ph / 2) + '" rx="' + (pw / 2 - 10) + '" ry="' + (ph / 2 - 9) + '" fill="none" style="stroke:var(--line)" stroke-width="1.5"/>';
      var cols = n <= 4 ? 2 : 3, r = n > 9 ? 8 : 10, gx = r * 2.5;
      for (var j = 0; j < n; j++) {
        var rows = Math.ceil(n / cols), cx = px + pw / 2 + ((j % cols) - (Math.min(cols, n) - 1) / 2) * gx, cy = py + ph / 2 + (Math.floor(j / cols) - (rows - 1) / 2) * gx;
        s += A.THING[kind || 'dot'](cx, cy, r, kind === 'dot' || !kind ? COLS[i % COLS.length] : undefined);
      }
    }
    var rowsP = Math.ceil(g / per);
    return A.svg(per * (pw + 12) + 2, rowsP * (ph + 12) + 2, s, label || g + ' plates with ' + n + ' on each plate');
  }
  /* sharing: items dealt into s boxes; left = leftovers shown below */
  function share(total, s, label) {
    var each = Math.floor(total / s), left = total % s, bw = 96, out = '', per = Math.min(s, 4);
    for (var i = 0; i < s; i++) {
      var bx = 6 + (i % per) * (bw + 12), by = 6 + Math.floor(i / per) * 120;
      out += D.rr(bx, by, bw, 106, 14, 'var(--card)', 'style="stroke:var(--ink2)" stroke-width="2.5"');
      out += '<text x="' + (bx + bw / 2) + '" y="' + (by + 100) + '" text-anchor="middle" font-size="16" class="t2">friend ' + (i + 1) + '</text>';
      for (var j = 0; j < each; j++) out += A.THING.dot(bx + 22 + (j % 3) * 26, by + 20 + Math.floor(j / 3) * 24, 9, COLS[0]);
    }
    var y0 = 6 + Math.ceil(s / per) * 120;
    if (left) {
      out += '<text x="6" y="' + (y0 + 22) + '" font-size="17" font-weight="700">Left over:</text>';
      for (var k = 0; k < left; k++) out += A.THING.dot(110 + k * 26, y0 + 16, 9, 'var(--bad)');
    }
    return A.svg(Math.max(per * (bw + 12) + 2, 240), y0 + (left ? 34 : 0), out, label || total + ' shared among ' + s + ': ' + each + ' each' + (left ? ', ' + left + ' left over' : ''));
  }
  /* pieces of size 1/d (d = 2 or 4) joined into wholes */
  function partsToWholes(n, d) {
    var r = 34, s = '', wholes = Math.ceil(n / d), gap = 2 * r + 18;
    for (var w = 0; w < wholes; w++) {
      var cx = 6 + r + w * gap, cy = 6 + r;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:var(--card);stroke:var(--line)" stroke-width="2" stroke-dasharray="5 4"/>';
      for (var i = 0; i < d; i++) {
        var k = w * d + i;
        if (k >= n) break;
        var a0 = -Math.PI / 2 + 2 * Math.PI * i / d, a1 = a0 + 2 * Math.PI / d;
        s += '<path d="M' + cx + ' ' + cy + 'L' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + 'Z" style="fill:' + (d === 2 ? 'var(--se)' : 'var(--sd)') + ';stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
      }
    }
    return A.svg(wholes * gap, 2 * r + 12, s, n + ' ' + (d === 2 ? 'halves' : 'fourths') + ' of a circle, put together into wholes');
  }
  function wholesText(n, d) {
    var w = Math.floor(n / d), p = n % d, nm = d === 2 ? ['half', 'halves'] : ['fourth', 'fourths'];
    var part = p === 0 ? '' : d === 2 ? 'a half' : p === 1 ? 'one fourth' : p === 2 ? 'two fourths (a half)' : 'three fourths';
    if (!w) return part;
    return w + ' whole' + (w > 1 ? 's' : '') + (part ? ' and ' + part : '');
  }
  function rep(g, n) { var a = []; for (var i = 0; i < g; i++) a.push(n); return a.join(' + '); }
  function skip(g, n) { var a = []; for (var i = 1; i <= g; i++) a.push(i * n); return a.join(', '); }

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'groups-sharing';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  /* plate builder: groups and how many in each */
  var plateLab = K.lab(
    '<div class="ctrl"><label for="gg">Groups: <output id="ggo">2</output><input type="range" id="gg" min="1" max="8" value="2"></label><label for="gn">In each group: <output id="gno">3</output><input type="range" id="gn" min="1" max="10" value="3"></label></div><div class="fig" id="gfig"></div><div class="out" id="gout"></div>',
    function (root, done) {
      var $ = A.$;
      A.bind(root, ['gg', 'gn'], function () {
        var gg = +$('#gg', root).value, n = +$('#gn', root).value;
        $('#ggo', root).textContent = gg; $('#gno', root).textContent = n;
        $('#gfig', root).innerHTML = plates(gg, n, 'dot');
        $('#gout', root).innerHTML = '<p><b>' + gg + ' group' + (gg > 1 ? 's' : '') + ' of ' + n + '</b></p><p class="math">' + rep(gg, n) + ' = <span class="big">' + gg * n + '</span></p><p class="t2">Skip count by ' + n + 's: ' + skip(gg, n) + '.</p>';
        if (gg === 4 && n === 5) done('Yes. 4 groups of 5: 5, 10, 15, 20.');
      });
    }, 'Make <b>4 groups of 5</b>. How many in all?');
  /* halves and fourths into wholes */
  var partsLab = K.lab(
    '<div class="ctrl"><label for="hn">How many parts: <output id="hno">3</output><input type="range" id="hn" min="1" max="12" value="3"></label><label for="hd">Each part is<select id="hd"><option value="2">one half</option><option value="4">one fourth</option></select></label></div><div class="fig" id="hfig"></div><div class="out" id="hout"></div>',
    function (root, done) {
      var $ = A.$;
      A.bind(root, ['hn', 'hd'], function () {
        var n = +$('#hn', root).value, d = +$('#hd', root).value;
        $('#hno', root).textContent = n;
        $('#hfig', root).innerHTML = partsToWholes(n, d);
        $('#hout', root).innerHTML = '<p>' + n + ' ' + (d === 2 ? (n === 1 ? 'half' : 'halves') : (n === 1 ? 'fourth' : 'fourths')) + ' make <span class="big">' + wholesText(n, d) + '</span>.</p>';
        if (n === 6 && d === 4) done('Yes. 6 fourths is 1 whole and two fourths: 1 and a half.');
      });
    }, 'Show <b>6 fourths</b>. How many wholes do they make?');
  /* deal things one round at a time */
  var dealLab = {
    do: 'Share <b>12 crackers</b> with <b>4 friends</b>. Press <b>Give one to each</b> until you cannot go around again.',
    mount: function (host, done) {
      host.innerHTML = '<div class="g2-lab"><div class="ctrl"><label for="dn">Things: <output id="dno">12</output><input type="range" id="dn" min="1" max="12" value="12"></label><label for="dk">Friends: <output id="dko">4</output><input type="range" id="dk" min="1" max="6" value="4"></label></div>' +
        '<div class="btnrow"><button type="button" class="btn" id="dgo">Give one to each</button><button type="button" class="btn alt" id="d0">Start again</button></div><div class="fig" id="dfig"></div><div class="out" id="dout" aria-live="polite"></div></div>';
      var $ = A.$, root = host, rounds = 0;
      function n() { return +$('#dn', root).value; }
      function k() { return +$('#dk', root).value; }
      function draw(anim) {
        var N = n(), Kf = k(), given = rounds * Kf, left = N - given;
        $('#dno', root).textContent = N; $('#dko', root).textContent = Kf;
        var bw = 96, per = Math.min(Kf, 3), s = '';
        for (var i = 0; i < Kf; i++) {
          var bx = 6 + (i % per) * (bw + 12), by = 6 + Math.floor(i / per) * 112;
          s += D.rr(bx, by, bw, 100, 14, 'var(--card)', 'style="stroke:var(--ink2)" stroke-width="2.5"') + '<text x="' + (bx + bw / 2) + '" y="' + (by + 92) + '" text-anchor="middle" font-size="17">friend ' + (i + 1) + '</text>';
          for (var j = 0; j < rounds; j++) { var dot = A.THING.dot(bx + 22 + (j % 3) * 26, by + 20 + Math.floor(j / 3) * 24, 9, COLS[0]); s += anim && j === rounds - 1 ? K.pop(dot, i) : dot; }
        }
        var y0 = 6 + Math.ceil(Kf / per) * 112;
        s += '<text x="6" y="' + (y0 + 22) + '" font-size="17" font-weight="700">Still to share: ' + left + '</text>';
        for (var m = 0; m < left; m++) s += A.THING.dot(190 + (m % 12) * 24, y0 + 16, 9, 'var(--se)');
        $('#dfig', root).innerHTML = '<div class="g2-fr' + (anim ? ' g2-in' : '') + '">' + A.svg(Math.max(per * (bw + 12), 190 + Math.min(left, 12) * 24 + 10), y0 + 34, s, Kf + ' friends, ' + rounds + ' each, ' + left + ' still to share') + '</div>';
        var canGo = left >= Kf;
        $('#dgo', root).disabled = !canGo;
        $('#dout', root).innerHTML = canGo ? '<p>Each friend has <b>' + rounds + '</b>.</p>' : '<p>Each friend gets <span class="big">' + rounds + '</span>' + (left ? ' and <b>' + left + ' ' + (left === 1 ? 'is' : 'are') + ' left over</b>. There are not enough to go around again.' : '. Nothing is left over.') + '</p>';
        if (!canGo && N === 12 && Kf === 4) done('Yes. 12 shared by 4 is 3 each.');
        else if (!canGo && rounds > 0 && (N !== 12 || Kf !== 4)) done('All shared out. Try 12 crackers with 4 friends too.');
      }
      $('#dgo', root).addEventListener('click', function () { if (n() - rounds * k() >= k()) { rounds++; draw(true); } });
      $('#d0', root).addEventListener('click', function () { rounds = 0; draw(false); });
      A.bind(root, ['dn', 'dk'], function () { rounds = 0; draw(false); });
    }
  };
  function dealt(r, s) { return share(r * s, s, r + ' each so far'); }
  var LESSONS = [
    { id: 'groups', title: 'Equal groups', sub: 'The same number in every group.', concepts: [
      { id: 'equal', title: 'Equal groups', exp: ['B2.5'], skill: 'g2-groups',
        body: '<p><b>Equal groups</b> all have the same number in them. To find how many in all, add the same number again and again, or <b>skip count</b>.</p>',
        watch: K.clip([
          ['One plate with 4 cookies.', plates(1, 4, 'dot')],
          ['Another plate with 4. That is 4, 8.', plates(2, 4, 'dot')],
          ['A third plate with 4: 4, 8, 12.', plates(3, 4, 'dot')],
          ['<b>3 groups of 4</b> is 4 + 4 + 4 = <b>12</b>.', '<p class="math big">4 + 4 + 4 = 12</p>' + plates(3, 4, 'dot'), 2200]
        ]),
        try: plateLab,
        key: '<p><b>3 groups of 4</b> means 4 + 4 + 4.</p>',
        mistake: '<p>Adding the number of groups to the number in each group (3 groups of 4 = 7). Have the child point to each plate and skip count: 4, 8, 12.</p>',
        check: [T('groups'), P('g2-groups', 1)] },
      { id: 'notequal', title: 'Are the groups equal?', exp: ['B2.5'], skill: 'g2-groups',
        body: '<p>Groups are equal only if <b>every</b> group has the same number. Check each group before you skip count.</p>',
        watch: K.clip([
          ['These plates have 5, 5 and 5. Every group is the same.', plates(3, 5, 'star')],
          ['These have 5, 3 and 5. The middle one is different.', (function () { var s = ''; [5, 3, 5].forEach(function (n, i) { var px = 6 + i * 128; s += '<ellipse cx="' + (px + 58) + '" cy="54" rx="58" ry="48" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2.5"/>'; for (var j = 0; j < n; j++) s += A.THING.star(px + 58 + ((j % 3) - 1) * 25, 54 + (Math.floor(j / 3) - 0.5) * 25, 10); }); return A.svg(386, 108, s, 'Groups of 5, 3 and 5'); })()],
          ['Only the first set is <b>equal groups</b>: 3 groups of 5.', plates(3, 5, 'star'), 2000]
        ]),
        key: '<p>Equal groups: <b>every</b> group has the same number.</p>',
        check: [T('equal'), T('equal')] },
      { id: 'array', title: 'Arrays: rows of equal groups', exp: ['B2.5'], skill: 'g2-groups',
        body: '<p>An <b>array</b> puts equal groups in rows. Each row is one group. An egg carton with 2 rows of 6 is 2 groups of 6: <b>12</b> eggs.</p>',
        watch: K.clip([
          ['One row of 6.', D.things(6, { kind: 'dot', cols: 6, r: 14 })],
          ['Two rows of 6.', D.things(12, { kind: 'dot', cols: 6, r: 14 })],
          ['6, 12. <b>2 groups of 6 is 12</b>.', D.things(12, { kind: 'dot', cols: 6, r: 14 }), 2000]
        ]),
        try: { tool: 'counters', opts: { n: 0, controls: ['tens'], max: 30 }, tasks: [
          { do: 'Make <b>3 rows of 5</b>: add counters until there are 15. Then press <b>Group in tens</b> to see 10 and 5.', goal: function (s) { return s.n === 15 && s.mode === 'tens'; }, yes: '3 groups of 5 is 15: one ten and 5 ones.' }
        ] },
        key: '<p>Count an array by rows: skip count by the number in a row.</p>',
        check: [function () { var r = R.int(2, 4), c = R.int(2, 6); return { q: 'How many dots are in this array?', type: 'num', answer: r * c, fig: D.things(r * c, { kind: 'dot', cols: c, r: 12 }), hint: 'Each row has ' + c + '. Skip count by ' + c + 's, once for each row.', steps: ['There are ' + r + ' rows of ' + c + '.', 'Skip count: ' + skip(r, c) + '.'], explain: r + ' groups of ' + c + ' is ' + r * c + '.' }; }, P('g2-groups', 2)] }
    ] },
    { id: 'parts', title: 'Groups of halves and fourths', sub: 'Put the parts back together.', concepts: [
      { id: 'halves', title: 'Groups of halves and fourths', exp: ['B2.5'], skill: 'g2-parts', hard: true,
        body: '<p>A group can be part of a thing. <b>2 halves</b> make 1 whole. <b>4 fourths</b> make 1 whole. To find how much in all, put the parts together into wholes.</p>',
        watch: K.clip([
          ['5 children each eat half an orange. Here is the first half.', partsToWholes(1, 2)],
          ['2 halves make 1 whole orange.', partsToWholes(2, 2)],
          ['4 halves make 2 whole oranges.', partsToWholes(4, 2)],
          ['5 halves make <b>2 and a half oranges</b>.', partsToWholes(5, 2), 2200]
        ]),
        try: partsLab,
        ways: [
          { label: 'Fraction strips', html: '<p>Tap parts to shade them. See how 2 halves or 4 fourths fill a whole strip.</p>', tool: 'fractions', opts: { wall: [1, 2, 4], words: true } },
          { label: 'Fold paper', html: '<p>Fold a paper circle in half: 2 halves. Fold it again: 4 fourths. Put 6 fourths on the table and push them together into circles. You fill 1 circle and half of another.</p>' + partsToWholes(6, 4) },
          { label: 'Count by twos', html: '<p>Halves: every 2 is a whole. Count the halves in twos: 2, 4, and 1 more. That is 2 wholes and a half.</p>' },
          { label: 'Use money', html: '<p>A quarter is one fourth of a dollar. 4 quarters make $1. 6 quarters make $1 and two quarters, which is <b>$1.50</b>.</p>' + D.wallet([25, 25, 25, 25, 25, 25], { W: 300 }) }
        ],
        key: '<p>Every 2 halves is a whole. Every 4 fourths is a whole.</p>',
        mistake: '<p>Counting halves as wholes ("5 halves is 5 oranges"). Have the child put two halves together with paper circles.</p>',
        check: [T('halves'), P('g2-parts', 1)] }
    ] },
    { id: 'share', title: 'Sharing equally', sub: 'One for you, one for you.', concepts: [
      { id: 'deal', title: 'Share one at a time', exp: ['B2.6'], skill: 'g2-share',
        body: '<p>To <b>share equally</b>, give one to each person, again and again, until there are not enough to go around. Every person gets the same number.</p>',
        watch: K.clip([
          ['12 grapes for 3 friends. Give one to each.', dealt(1, 3)],
          ['Again: one more to each.', dealt(2, 3)],
          ['Again.', dealt(3, 3)],
          ['And again. All 12 are shared. Each friend gets <b>4</b>.', dealt(4, 3), 2200]
        ]),
        try: dealLab,
        key: '<p>Share one at a time. Every share is the same.</p>',
        check: [T('share'), P('g2-share', 1)] },
      { id: 'leftover', title: 'When some are left over', exp: ['B2.6'], skill: 'g2-share',
        body: '<p>Sometimes things do not share out evenly. <b>10 shared by 4</b> is 2 each, with <b>2 left over</b>. We do not give extra to anyone.</p>',
        watch: K.clip([
          ['10 stickers for 4 friends. Give one to each, then again.', share(10, 4)],
          ['2 are left. That is not enough for 4 friends, so we stop.', share(10, 4)],
          ['Each gets <b>2</b>, and <b>2 are left over</b>.', '<p class="math big">10 shared by 4 = 2 each, 2 left</p>', 2200]
        ]),
        key: '<p>If there are not enough to go around, the rest are <b>left over</b>.</p>',
        mistake: '<p>Giving the leftovers to some people so that "nothing is left". Then the shares are not equal. Ask: "Does everyone have the same?"</p>',
        check: [P('g2-share', 2), P('g2-share', 2)] }
    ] },
    { id: 'howmany', title: 'How many groups?', sub: 'Take away one group at a time.', concepts: [
      { id: 'takeg', title: 'Take away equal groups', exp: ['B2.6', 'B2.1'], skill: 'g2-takeaway',
        body: '<p>Sometimes you know the size of each group and need to find <b>how many groups</b>. Take away one group at a time and count how many times.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 12, every: 3, start: 12 }, steps: [
          { say: '12 muffins go in boxes of 3. Start at 12.', ms: 1000 },
          { say: 'Take away 3: 9. That is 1 box.', act: function (t) { return t.hop(9, '&minus;3'); } },
          { say: '6. 2 boxes.', act: function (t) { return t.hop(6, '&minus;3'); } },
          { say: '3. 3 boxes.', act: function (t) { return t.hop(3, '&minus;3'); } },
          { say: '0. We took away 3 four times. <b>4 boxes</b>.', act: function (t) { return t.hop(0, '&minus;3'); }, ms: 2000 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 20, every: 5, start: 15, step: 5 }, tasks: [
          { do: '15 apples go into bags of 5. Press <b>Jump back</b> until you reach 0. How many jumps?', goal: function (s) { return s.at === 0; }, yes: function (s) { return '3 jumps of 5. So there are 3 bags.'; } }
        ] },
        key: '<p>Count how many times you take away the group. That is the number of groups.</p>',
        check: [T('takeg'), P('g2-takeaway', 1)] },
      { id: 'stories', title: 'Group and share stories', exp: ['B2.5', 'B2.6'], skill: 'g2-story',
        body: '<p>Ask: do I know the <b>number of groups</b>, the <b>size of each group</b>, or <b>how many in all</b>? Draw it to find the missing part.</p>',
        watch: K.clip([
          ['4 bags with 2 oranges in each. How many oranges? We know the groups and the size.', plates(4, 2, 'dot')],
          ['Skip count: 2, 4, 6, 8. <b>8 oranges</b>.', plates(4, 2, 'dot')],
          ['8 oranges shared by 2 friends. Now we know how many in all and the number of friends.', share(8, 2)],
          ['Each gets <b>4</b>.', share(8, 2), 2000]
        ]),
        key: '<p>Groups, sharing, adding and subtracting all fit together: 4 + 4 = 8, so 8 shared by 2 is 4.</p>',
        check: [P('g2-story', 1), P('g2-story', 2)] }
    ] }
  ];

  A.register('groups-sharing', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Equal groups</h2>' +
'<p><b>Equal groups</b> all have the same number in them. To find the total, add the same number again and again, or skip count.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>3 plates with 4 cookies on each. That is <b>3 groups of 4</b>. I skip count by 4s: 4, 8, 12. So there are <b>12</b> cookies. 4 + 4 + 4 = 12.</p><div class="fig">' + plates(3, 4, 'dot') + '</div></div>' +
'<div class="yt" data-yt="groups"></div>' +
'<div class="lab"><span class="lt">Try it: make equal groups</span>' +
'<div class="ctrl"><label for="gg">Groups: <output id="ggo">4</output><input type="range" id="gg" min="1" max="8" value="4"></label><label for="gn">In each group: <output id="gno">3</output><input type="range" id="gn" min="1" max="10" value="3"></label></div>' +
'<div class="fig" id="gfig"></div><div class="out" id="gout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>"Groups of" is a short way to say "add the same number again". 5 groups of 2 is 2 + 2 + 2 + 2 + 2 = 10.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Equal or not equal?</h2>' +
'<p>Groups are only equal if <b>every</b> group has the same number. Check each group before you skip count.</p>' +
'<div class="vrow"><figure>' + plates(3, 5, 'star') + '<figcaption>Equal: 3 groups of 5</figcaption></figure><figure>' + (function () {
  var s = '', sizes = [5, 3, 5];
  sizes.forEach(function (n, i) { var px = 6 + i * 128; s += '<ellipse cx="' + (px + 58) + '" cy="54" rx="58" ry="48" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2.5"/>'; for (var j = 0; j < n; j++) s += A.THING.star(px + 58 + ((j % 3) - 1) * 25, 42 + Math.floor(j / 3) * 25, 10); });
  return A.svg(386, 108, s, 'Not equal: the groups have 5, 3 and 5');
})() + '<figcaption>Not equal: 5, 3 and 5</figcaption></figure></div>' +
'<div class="yt" data-yt="equal"></div>' +
'<p>An <b>array</b> is equal groups in rows. Each row is one group.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>An egg carton has 2 rows of 6. That is 2 groups of 6. 6 + 6 = <b>12</b> eggs.</p><div class="fig">' + D.things(12, { kind: 'dot', cols: 6, r: 14, col: 'var(--card)' }).replace(/fill:var\(--card\)/g, 'fill:#f4ede1') + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the number of groups to the number in each group. 3 groups of 4 is not 3 + 4 = 7. It is 4 + 4 + 4 = 12.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Groups of halves and fourths</h2>' +
'<p>A group can be part of a thing. <b>2 halves</b> make 1 whole. <b>4 fourths</b> make 1 whole.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>5 children each eat <b>half</b> an orange. That is 5 groups of one half. I put the halves together: 2 halves, 2 halves, and 1 half. That is <b>2 and a half oranges</b>.</p><div class="fig">' + partsToWholes(5, 2) + '</div></div>' +
'<div class="yt" data-yt="halves"></div>' +
'<div class="lab"><span class="lt">Try it: put the parts together</span>' +
'<div class="ctrl"><label for="hn">How many parts: <output id="hno">6</output><input type="range" id="hn" min="1" max="12" value="6"></label><label for="hd">Each part is<select id="hd"><option value="2">one half</option><option value="4" selected>one fourth</option></select></label></div>' +
'<div class="fig" id="hfig"></div><div class="out" id="hout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Count the parts, then make wholes. Every 2 halves is a whole. Every 4 fourths is a whole.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Sharing equally</h2>' +
'<p>To <b>share equally</b>, give one to each person, again and again, until there are not enough to go around. Every person gets the same number.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>12 grapes shared by 3 friends. I give 1 to each friend, then 1 more to each, and keep going. Each friend gets <b>4</b>. Check: 4 + 4 + 4 = 12.</p><div class="fig">' + share(12, 3) + '</div></div>' +
'<div class="yt" data-yt="share"></div>' +
'<div class="lab"><span class="lt">Try it: share fairly</span>' +
'<div class="ctrl"><label for="sn">Things to share: <output id="sno">10</output><input type="range" id="sn" min="1" max="12" value="10"></label><label for="ss">Friends: <output id="sso">4</output><input type="range" id="ss" min="1" max="6" value="4"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Giving out extra so nothing is left over. Then the shares are not equal. If some are left over, say so: 10 shared by 4 is 2 each with 2 left over.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Making groups by taking away</h2>' +
'<p>Sometimes you know the size of each group and need to find <b>how many groups</b>. Take away one group at a time and count how many times.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>12 muffins go in boxes of 3. How many boxes? 12 ' + M + ' 3 = 9, 9 ' + M + ' 3 = 6, 6 ' + M + ' 3 = 3, 3 ' + M + ' 3 = 0. I took away 3 four times, so there are <b>4 boxes</b>.</p>' +
'<div class="fig">' + D.hops({ min: 0, max: 12, tick: 1, every: 3, id: 'hb', hops: [{ a: 12, b: 9, t: M + '3' }, { a: 9, b: 6, t: M + '3' }, { a: 6, b: 3, t: M + '3' }, { a: 3, b: 0, t: M + '3' }], marks: [{ v: 12, col: 'var(--hi)' }], label: 'Jumps back by 3 from 12 to 0: four jumps' }) + '</div></div>' +
'<div class="yt" data-yt="takeg"></div>' +
'<div class="key"><b class="t">Key idea</b><p>Equal groups, adding the same number, and taking away the same number all go together. 3 + 3 + 3 + 3 = 12, so 12 can be split into 4 groups of 3.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function g() {
        var gg = +$('#gg', root).value, n = +$('#gn', root).value;
        $('#ggo', root).textContent = gg; $('#gno', root).textContent = n;
        $('#gfig', root).innerHTML = plates(gg, n, 'dot');
        $('#gout', root).innerHTML = '<p><b>' + gg + ' group' + (gg > 1 ? 's' : '') + ' of ' + n + '</b></p><p class="math">' + rep(gg, n) + ' = <span class="big">' + gg * n + '</span></p><p class="t2">Skip count by ' + n + 's: ' + skip(gg, n) + '.</p>';
      }
      A.bind(root, ['gg', 'gn'], g);
      function h() {
        var n = +$('#hn', root).value, d = +$('#hd', root).value;
        $('#hno', root).textContent = n;
        $('#hfig', root).innerHTML = partsToWholes(n, d);
        $('#hout', root).innerHTML = '<p>' + n + ' ' + (d === 2 ? (n === 1 ? 'half' : 'halves') : (n === 1 ? 'fourth' : 'fourths')) + ' make <span class="big">' + wholesText(n, d) + '</span>.</p>';
      }
      A.bind(root, ['hn', 'hd'], h);
      function s() {
        var n = +$('#sn', root).value, k = +$('#ss', root).value, e = Math.floor(n / k), l = n % k;
        $('#sno', root).textContent = n; $('#sso', root).textContent = k;
        $('#sfig', root).innerHTML = share(n, k);
        $('#sout', root).innerHTML = '<p><span class="big">' + e + ' each</span>' + (l ? ' and <b>' + l + ' left over</b>.' : ', none left over.') + '</p><p class="t2">Check: ' + (e ? rep(k, e) : '0') + (l ? ' + ' + l : '') + ' = ' + n + '.</p>';
      }
      A.bind(root, ['sn', 'ss'], s);
    },

    turns: {
      groups: function () { var g = R.int(2, 5), n = R.pick([2, 5, 10, 3, 4]); return { q: 'How many in all? <b>' + g + ' groups of ' + n + '</b>', type: 'num', answer: g * n, fig: plates(g, n, 'dot'), hint: 'Skip count by ' + n + 's, once for each plate.', explain: rep(g, n) + ' = ' + g * n + '.' }; },
      equal: function () {
        var eq = R.int(0, 1), n = R.int(3, 5), sizes = [n, n, n];
        if (!eq) sizes[R.int(0, 2)] = n - 1;
        var s = '';
        sizes.forEach(function (k, i) { var px = 6 + i * 128; s += '<ellipse cx="' + (px + 58) + '" cy="54" rx="58" ry="48" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2.5"/>'; for (var j = 0; j < k; j++) s += A.THING.apple(px + 58 + ((j % 3) - 1) * 25, 42 + Math.floor(j / 3) * 25, 10); });
        return { q: 'Are these equal groups?', type: 'mc', options: ['Yes, equal', 'No, not equal'], answer: eq ? 0 : 1, fig: A.svg(386, 108, s, 'Three plates of apples'), hint: 'Count the apples on each plate. Do all the plates have the same number?', explain: 'The plates have ' + sizes.join(', ') + '. ' + (eq ? 'They are all the same, so the groups are equal.' : 'One is different, so the groups are not equal.') };
      },
      halves: function () { var n = R.int(3, 7), o = R.mc(wholesText(n, 2), [wholesText(n + 1, 2), wholesText(n * 2, 2)]); return { q: n + ' friends each have <b>half</b> a sandwich. How many whole sandwiches is that?', type: 'mc', options: o.options, answer: o.answer, fig: partsToWholes(n, 2), hint: 'Every 2 halves make 1 whole. Count the halves in pairs.', explain: n + ' halves make ' + wholesText(n, 2) + '.' }; },
      share: function () { var k = R.int(2, 4), e = R.int(2, 3), n = k * e; return { q: n + ' pencils are shared equally by ' + k + ' friends. How many does each friend get?', type: 'num', answer: e, fig: D.things(n, { kind: 'cube', cols: 12, r: 9 }), hint: 'Give 1 to each friend, then 1 more to each, until all ' + n + ' are gone. Count one friend\'s share.', explain: 'Each friend gets ' + e + '. Check: ' + rep(k, e) + ' = ' + n + '.' }; },
      takeg: function () { var k = R.pick([2, 3, 4, 5]), g = R.int(2, Math.floor(12 / k)), n = k * g; return { q: n + ' socks go into bags of ' + k + '. How many bags?', type: 'num', answer: g, hint: 'Take away ' + k + ' again and again until you reach 0. Count how many times.', explain: 'Taking away ' + k + ' from ' + n + ' happens ' + g + ' times, so ' + g + ' bags.' }; }
    },

    quiz: [
      { q: 'How many in all? <b>4 groups of 5</b>', type: 'num', answer: 20, fig: plates(4, 5, 'star'), hint: 'Skip count by 5s, four times.', explain: '5, 10, 15, 20. 5 + 5 + 5 + 5 = 20.' },
      { q: 'Which is the same as <b>3 groups of 6</b>?', type: 'mc', options: ['3 + 6', '6 + 6 + 6', '3 + 3 + 3', '6 + 3 + 6'], answer: 1, hint: 'Write the number in each group once for every group.', explain: '3 groups of 6 is 6 + 6 + 6 = 18.' },
      { q: '7 children each eat <b>half</b> an apple. How many whole apples do they eat?', type: 'mc', options: ['3 and a half', '7', '14', '3'], answer: 0, fig: partsToWholes(7, 2), hint: 'Two halves make a whole. How many pairs of halves are there?', explain: '7 halves is 3 pairs of halves and 1 more half: 3 and a half apples.' },
      { q: '8 fourths of a pizza make how many whole pizzas?', type: 'num', answer: 2, fig: partsToWholes(8, 4), hint: 'Every 4 fourths make one whole.', explain: '4 fourths + 4 fourths = 2 wholes.' },
      { q: '12 crackers are shared equally by 4 friends. How many does each friend get?', type: 'num', answer: 3, hint: 'Deal them out one at a time to 4 friends.', explain: 'Each friend gets 3. 3 + 3 + 3 + 3 = 12.' },
      { q: '11 marbles are shared equally by 2 friends. What happens?', type: 'mc', options: ['Each gets 5, and 1 is left over', 'Each gets 6', 'Each gets 5, and none are left', 'Each gets 4, and 3 are left over'], answer: 0, fig: share(11, 2), hint: 'Deal them out. Stop when there are not enough for everyone to get one more.', explain: '5 + 5 = 10, so each gets 5 and 1 marble is left over.' },
      { q: '10 shoes are put into pairs. How many pairs?', type: 'num', answer: 5, hint: 'Take away 2 again and again: 10, 8, 6&hellip; Count the jumps.', explain: '10 &minus; 2 &minus; 2 &minus; 2 &minus; 2 &minus; 2 = 0. That is 5 pairs.' }
    ],

    practice: [
      { id: 'g2-groups', name: 'Equal groups', code: 'B2.5', gen: function (lv) {
        var g = R.int(2, lv === 1 ? 4 : 6), n = lv === 1 ? R.pick([2, 5, 10]) : R.int(2, 6);
        if (lv === 3) {
          var o = R.mc(rep(g, n), [g + ' + ' + n, rep(g + 1, n), rep(g, n + 1)]);
          return { q: 'Which matches <b>' + g + ' groups of ' + n + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Write ' + n + ' once for each of the ' + g + ' groups.', steps: ['There are ' + g + ' groups.', 'Each group has ' + n + '.', 'So write ' + n + ', ' + g + ' times: ' + rep(g, n) + '.'], explain: g + ' groups of ' + n + ' is ' + rep(g, n) + ' = ' + g * n + '.' };
        }
        return { q: 'How many in all? <b>' + g + ' groups of ' + n + '</b>', type: 'num', answer: g * n, fig: plates(g, n, R.pick(['dot', 'apple', 'star'])), hint: 'Skip count by ' + n + 's, one count for each group.', steps: ['Each group has ' + n + '.', 'Skip count by ' + n + 's ' + g + ' times: ' + skip(g, n) + '.', 'There are ' + g * n + ' in all.'], explain: rep(g, n) + ' = ' + g * n + '.' };
      } },
      { id: 'g2-parts', name: 'Groups of halves and fourths', code: 'B2.5', gen: function (lv) {
        var d = lv === 1 ? 2 : lv === 2 ? R.pick([2, 4]) : 4, n = d === 2 ? R.int(2, 9) : R.int(lv === 3 ? 5 : 2, 12);
        var right = wholesText(n, d), wrong = [wholesText(n + 1, d), wholesText(n + 2, d), wholesText(Math.max(1, n - 1), d), String(n)].filter(function (x) { return x !== right; });
        var o = R.mc(right, wrong);
        return { q: n + ' ' + (d === 2 ? 'halves' : 'fourths') + ' of a pie. How much pie is that?', type: 'mc', options: o.options, answer: o.answer, fig: lv < 3 ? partsToWholes(n, d) : '', hint: 'Every ' + d + ' ' + (d === 2 ? 'halves' : 'fourths') + ' make 1 whole.',
          steps: ['Group the pieces in ' + d + 's. Each group of ' + d + ' is a whole.', 'There are ' + Math.floor(n / d) + ' full group' + (Math.floor(n / d) === 1 ? '' : 's') + (n % d ? ' and ' + n % d + ' more piece' + (n % d > 1 ? 's' : '') : '') + '.', 'That is ' + right + '.<div class="fig">' + partsToWholes(n, d) + '</div>'], explain: n + ' ' + (d === 2 ? 'halves' : 'fourths') + ' make ' + right + '.' };
      } },
      { id: 'g2-share', name: 'Sharing equally', code: 'B2.6', gen: function (lv) {
        var k = R.int(2, lv === 1 ? 3 : 4), e = R.int(1, Math.floor(12 / k)), left = lv === 3 ? R.int(1, k - 1) : 0, n = k * e + left;
        if (n > 12) { e = Math.floor((12 - left) / k); n = k * e + left; }
        if (lv === 3) {
          var o = R.mc(e + ' each, ' + left + ' left over', [(e + 1) + ' each, none left over', e + ' each, none left over', (e - 1 >= 0 ? e - 1 : e + 2) + ' each, ' + (left + k) + ' left over']);
          return { q: n + ' stickers are shared equally by ' + k + ' friends. What happens?', type: 'mc', options: o.options, answer: o.answer, hint: 'Deal them out one at a time. Stop when there are not enough for everyone.', steps: ['Give 1 to each of the ' + k + ' friends, again and again.', 'After ' + e + ' rounds, ' + k * e + ' are given out.', left + ' left over is not enough for everyone to get another.<div class="fig">' + share(n, k) + '</div>'], explain: 'Each friend gets ' + e + ' and ' + left + ' ' + (left === 1 ? 'is' : 'are') + ' left over.' };
        }
        return { q: n + ' cookies are shared equally by ' + k + ' friends. How many does each friend get?', type: 'num', answer: e, fig: lv === 1 ? D.things(n, { kind: 'dot', cols: 12, r: 9 }) : '', hint: 'Deal one at a time to each friend until all ' + n + ' are gone.', steps: ['Give 1 to each friend. Keep going.', 'Each round uses ' + k + ' cookies.', 'Each friend gets ' + e + '.<div class="fig">' + share(n, k) + '</div>'], explain: rep(k, e) + ' = ' + n + ', so each gets ' + e + '.' };
      } },
      { id: 'g2-takeaway', name: 'How many groups?', code: 'B2.6', gen: function (lv) {
        var k = lv === 1 ? 2 : R.int(2, 5), g = R.int(2, Math.floor(12 / k)), n = k * g, hs = [];
        for (var i = 0; i < g; i++) hs.push({ a: n - i * k, b: n - (i + 1) * k, t: M + k });
        return { q: n + ' crayons are packed in boxes of ' + k + '. How many boxes?', type: 'num', answer: g, fig: lv === 1 ? D.things(n, { kind: 'cube', cols: 12, r: 9 }) : '', hint: 'Take away ' + k + ' at a time until you reach 0. Count how many times.',
          steps: ['Start at ' + n + '. Take away ' + k + ' again and again.', 'You reach 0 after ' + g + ' jumps.<div class="fig">' + D.hops({ min: 0, max: n, tick: 1, every: k, id: 'hg', hops: hs, marks: [{ v: n, col: 'var(--hi)' }] }) + '</div>', 'So there are ' + g + ' boxes.'], explain: n + ' is ' + g + ' groups of ' + k + '.' };
      } },
      { id: 'g2-story', name: 'Group and share stories', code: 'B2.5, B2.6', gen: function (lv) {
        var kind = R.int(0, lv === 1 ? 0 : 2), g = R.int(2, 4), n = R.int(2, 3);
        if (kind === 0) return { q: 'There are ' + g + ' vases. Each vase has ' + n + ' flowers. How many flowers in all?', type: 'num', answer: g * n, hint: 'This is ' + g + ' groups of ' + n + '. Add ' + n + ' again and again.', steps: [g + ' groups of ' + n + '.', rep(g, n) + ' = ' + g * n + '.'], explain: rep(g, n) + ' = ' + g * n + ' flowers.' };
        if (kind === 1) return { q: g * n + ' children make teams of ' + n + '. How many teams?', type: 'num', answer: g, hint: 'Take away ' + n + ' at a time. Count the teams.', steps: ['Each team takes ' + n + ' children.', 'Count by ' + n + 's to ' + g * n + ': ' + skip(g, n) + '.', 'That is ' + g + ' teams.'], explain: g + ' teams of ' + n + ' make ' + g * n + '.' };
        return { q: g * n + ' stickers are shared equally by ' + g + ' friends. How many each?', type: 'num', answer: n, hint: 'Deal one to each of the ' + g + ' friends, again and again.', steps: ['Each round gives out ' + g + ' stickers.', 'After ' + n + ' rounds, all ' + g * n + ' are given out.', 'Each friend gets ' + n + '.'], explain: rep(g, n) + ' = ' + g * n + ', so ' + n + ' each.' };
      } }
    ]
  });
  /* ---------- more ways to ask each practice skill (answer checks: tests/verify/grade2.js) ---------- */
  var why = K.why, who = K.who;
  function grpPics(g, n) {
    var set = [[g, n], [n, g], [g, n + 1]].filter(function (p, i, a) { return a.findIndex(function (x) { return x[0] === p[0] && x[1] === p[1]; }) === i; });
    if (set.length < 3) set.push([g + 1, n]);
    return R.shuffle(set);
  }
  function pieceName(n, d) { return n + ' ' + (d === 2 ? (n === 1 ? 'half' : 'halves') : (n === 1 ? 'fourth' : 'fourths')); }
  K.shapes(CH, {
    'g2-groups': [
      [1, 'tap', function (lv) {
        var g = R.int(2, lv === 1 ? 3 : 4), n = R.int(2, 5); if (g === n) n++;
        var set = grpPics(g, n);
        return { q: 'Tap the picture that shows <b>' + g + ' groups of ' + n + '</b>.', type: 'tap', tiles: set.map(function (p) { return plates(p[0], p[1], 'dot', 'Plates'); }), answer: set.findIndex(function (p) { return p[0] === g && p[1] === n; }), answerText: g + ' plates with ' + n + ' on each',
          hint: 'Count the plates first. You need ' + g + '. Then check ' + n + ' on each.', steps: ['Count the plates: ' + g + '.', 'Count one plate: ' + n + '.'],
          explain: g + ' plates with ' + n + ' on each plate is ' + g + ' groups of ' + n + '.', meta: { k: 'g2-grp-tap', set: set, g: g, n: n } };
      }],
      [1, 'fill', function (lv) {
        var g = R.int(3, lv === 1 ? 4 : 5), n = lv === 1 ? R.pick([2, 5, 10]) : R.int(2, 6), blanks = [];
        for (var i = 2; i <= g; i++) blanks.push(i * n);
        return { q: 'Skip count to find <b>' + g + ' groups of ' + n + '</b>.', type: 'fill', fill: '<span class="math">' + n + ', ' + blanks.map(function () { return '[[]]'; }).join(', ') + '</span>', answers: blanks, fig: plates(g, n, 'dot'),
          hint: 'Count by ' + n + 's, once for each plate.', steps: ['Start at ' + n + '. Add ' + n + ' each time.'],
          explain: skip(g, n) + '. So ' + g + ' groups of ' + n + ' is ' + g * n + '.', meta: { k: 'g2-grp-fill', g: g, n: n } };
      }],
      [2, 'match', function (lv) {
        var p = [], seen = {};
        while (p.length < 3) { var g = R.int(2, 5), n = R.int(2, 5); if (seen[g * n]) continue; seen[g * n] = 1; p.push([g + ' groups of ' + n, String(g * n)]); }
        return { q: 'Match each set of groups to how many in all.', type: 'match', pairs: p,
          hint: 'Skip count by the number in each group.', steps: ['3 groups of 4: 4, 8, 12.'],
          explain: p.map(function (x) { return x[0] + ' is ' + x[1]; }).join('. ') + '.', meta: { k: 'g2-grp-match', pairs: p } };
      }],
      [2, 'mistake', function (lv) {
        var g = R.int(3, 5), n = R.int(3, 6), name = who(), truth = !R.int(0, 2), said = truth ? g * n : g + n;
        var right = g + ' groups of ' + n + ' is ' + rep(g, n) + ' = ' + g * n + '.';
        return { q: name + ' says <b>' + g + ' groups of ' + n + '</b> is ' + said + ' in all. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: plates(g, n, 'dot'),
          why: why(right, ['Add the number of groups and the number in a group.', 'Count only one group.', 'Count the plates.']),
          hint: 'Skip count by ' + n + 's, once for each group.', steps: [right], explain: right, meta: { k: 'g2-grp-tf', g: g, n: n, said: said } };
      }]
    ],
    'g2-parts': [
      [1, 'match', function (lv) {
        var d = lv === 1 ? 2 : R.pick([2, 4]), p = R.shuffle([1, 2, 3, 4]).slice(0, 3).map(function (w) { return [pieceName(w * d, d), w + ' whole' + (w > 1 ? 's' : '')]; });
        return { q: 'Match the pieces to the wholes they make.', type: 'match', pairs: p,
          hint: (d === 2 ? '2 halves' : '4 fourths') + ' make 1 whole.', steps: ['Count the pieces in ' + d + 's. Each ' + d + ' is one whole.'],
          explain: p.map(function (x) { return x[0] + ' make ' + x[1]; }).join('. ') + '.', meta: { k: 'g2-parts-match', pairs: p } };
      }],
      [1, 'tap', function (lv) {
        var d = lv === 1 ? 2 : 4, set = R.shuffle([1, 2, 3]).map(function (w) { return w * d; }), w = R.int(1, 3);
        return { q: 'Tap the picture that makes <b>' + w + ' whole' + (w > 1 ? 's' : '') + '</b>.', type: 'tap', tiles: set.map(function (n) { return partsToWholes(n, d); }), answer: set.indexOf(w * d), answerText: pieceName(w * d, d),
          hint: 'Count the full circles in each picture.', steps: [(d === 2 ? '2 halves' : '4 fourths') + ' make 1 whole circle.'],
          explain: pieceName(w * d, d) + ' make ' + w + ' whole' + (w > 1 ? 's' : '') + '.', meta: { k: 'g2-parts-tap', set: set, d: d, w: w } };
      }],
      [2, 'pick', function (lv) {
        var target = R.pick([2, 3]), opts = R.shuffle([[target * 2, 2], [target * 4, 4], [target * 2 + 1, 2], [target * 4 - 2, 4], [target, 2]]);
        var ans = opts.map(function (o, j) { return o[0] === target * o[1] ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every amount that makes exactly <b>' + target + ' wholes</b>.', type: 'pick', options: opts.map(function (o) { return pieceName(o[0], o[1]); }), answer: ans,
          hint: '2 halves make 1 whole. 4 fourths make 1 whole.', steps: [target + ' wholes is ' + target * 2 + ' halves or ' + target * 4 + ' fourths.'],
          explain: pieceName(target * 2, 2) + ' and ' + pieceName(target * 4, 4) + ' each make ' + target + ' wholes.', meta: { k: 'g2-parts-pick', opts: opts, target: target } };
      }],
      [3, 'mistake', function (lv) {
        var d = R.pick([2, 4]), w = R.int(2, 3), n = w * d, name = who(), truth = !R.int(0, 2), said = truth ? w : n;
        var right = (d === 2 ? '2 halves' : '4 fourths') + ' make 1 whole, so ' + pieceName(n, d) + ' make ' + w + ' wholes.';
        return { q: name + ' says ' + pieceName(n, d) + ' of a pie make <b>' + said + ' whole pies</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Every piece is a whole pie.', 'Halves and fourths are the same size.', 'You need 10 pieces for a whole.']),
          hint: 'How many ' + (d === 2 ? 'halves' : 'fourths') + ' make one whole?', steps: [right], explain: right, meta: { k: 'g2-parts-tf', n: n, d: d, said: said } };
      }]
    ],
    'g2-share': [
      [1, 'match', function (lv) {
        var p = [], seen = {};
        while (p.length < 3) { var k = R.int(2, lv === 1 ? 3 : 4), e = R.int(1, 5); if (seen[e]) continue; seen[e] = 1; p.push([k * e + ' shared by ' + k, e + ' each']); }
        return { q: 'Match each sharing to how many each person gets.', type: 'match', pairs: p,
          hint: 'Deal them out one at a time, or think: how many groups of the same size?', steps: ['12 shared by 3: 3 friends get 4 each, because 4 + 4 + 4 = 12.'],
          explain: p.map(function (x) { return x[0] + ': ' + x[1]; }).join('. ') + '.', meta: { k: 'g2-share-match', pairs: p } };
      }],
      [1, 'story', function (lv) {
        var name = who(), k = R.int(2, lv === 1 ? 3 : 4), e = R.int(2, Math.floor(12 / k)), n = k * e, c = R.pick(['grapes', 'crackers', 'stickers', 'maple cookies']);
        return { q: name + ' shares ' + n + ' ' + c + ' equally with ' + (k === 2 ? '1 friend' : (k - 1) + ' friends') + '. That is ' + k + ' people in all. How many ' + c + ' does each person get?', type: 'num', answer: e, fig: lv === 1 ? share(n, k, k + ' people') : '',
          hint: 'Deal one to each of the ' + k + ' people, again and again.', steps: ['Each round gives out ' + k + '.', 'After ' + e + ' rounds all ' + n + ' are gone.'],
          explain: n + ' shared by ' + k + ' is ' + e + ' each.', meta: { k: 'g2-share-story', n: n, per: k } };
      }],
      [2, 'mistake', function (lv) {
        var k = R.int(2, 4), e = R.int(2, 4), n = k * e, name = who(), truth = !R.int(0, 2), said = truth ? e : (e === k ? e + 1 : k);
        var right = 'Deal ' + n + ' into ' + k + ' equal groups. Each group gets ' + e + ', because ' + rep(k, e) + ' = ' + n + '.';
        return { q: name + ' shares ' + n + ' apples equally into ' + k + ' baskets and says each basket gets <b>' + said + '</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Each basket gets as many as there are baskets.', 'Each basket gets half of them.', 'Put all the apples in the first basket.']),
          hint: 'Check: does ' + said + ' in each of ' + k + ' baskets make ' + n + '?', steps: [right], explain: right, meta: { k: 'g2-share-tf', n: n, per: k, said: said } };
      }]
    ],
    'g2-takeaway': [
      [1, 'order', function (lv) {
        var k = lv === 1 ? 2 : R.int(2, 5), g = R.int(3, Math.min(5, Math.floor(15 / k))), seq = [];
        for (var i = g; i >= 0; i--) seq.push(i * k);
        return { q: 'Take away ' + k + ' at a time from ' + g * k + ' until you reach 0. Put the numbers in order.', type: 'order', items: seq.map(String), first: 'start', last: 'end',
          hint: 'Start at ' + g * k + '. Take away ' + k + ' each time.', steps: [g * k + ' &minus; ' + k + ' = ' + (g - 1) * k + '.'],
          explain: seq.join(', ') + '. That is ' + g + ' groups of ' + k + '.', meta: { k: 'g2-take-order', per: k, n: g * k } };
      }],
      [1, 'story', function (lv) {
        var name = who(), k = lv === 1 ? 2 : R.int(2, 5), g = R.int(2, Math.floor(12 / k)), n = k * g, c = R.pick([['apples', 'bag'], ['mittens', 'pair'], ['markers', 'cup'], ['pucks', 'bucket']]);
        if (c[0] === 'mittens') k = 2, n = k * g;
        return { q: name + ' has ' + n + ' ' + c[0] + ' and puts ' + k + ' in each ' + c[1] + '. How many ' + (c[1] === 'pair' ? 'pairs' : c[1] + 's') + '?', type: 'num', answer: n / k, fig: lv === 1 ? D.things(n, { kind: 'cube', cols: 12, r: 9 }) : '',
          hint: 'Take away ' + k + ' at a time. Count how many times.', steps: ['Count by ' + k + 's to ' + n + ': ' + skip(n / k, k) + '.'],
          explain: n + ' in groups of ' + k + ' makes ' + n / k + ' groups.', meta: { k: 'g2-take-story', n: n, per: k } };
      }],
      [2, 'mistake', function (lv) {
        var k = R.int(2, 5), g = R.int(2, 5), n = k * g, name = who(), truth = !R.int(0, 2), said = truth ? g : n - k;
        var right = 'Take away ' + k + ' at a time: ' + Array.apply(null, Array(g + 1)).map(function (_, i) { return n - i * k; }).join(', ') + '. That is ' + g + ' groups.';
        return { q: name + ' puts ' + n + ' crayons in boxes of ' + k + ' and says that makes <b>' + said + ' boxes</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Take away ' + k + ' just once.', 'The number of boxes is the number of crayons.', 'Add ' + k + ' to the number of crayons.']),
          hint: 'Take away ' + k + ' at a time. Count the jumps to 0.', steps: [right], explain: right, meta: { k: 'g2-take-tf', n: n, per: k, said: said } };
      }]
    ],
    'g2-story': [
      [1, 'which', function (lv) {
        var name = who(), g = R.int(2, 4), n = R.int(2, 5), kind = R.pick(['total', 'share']), q;
        if (kind === 'total') q = name + ' has ' + g + ' bags with ' + n + ' marbles in each bag. How many marbles in all?';
        else q = name + ' has ' + g * n + ' marbles to share equally into ' + g + ' bags. How many in each bag?';
        return { q: q + ' <b>Which way solves it?</b>', type: 'mc', options: ['Put equal groups together', 'Share out equally'], answer: kind === 'total' ? 0 : 1,
          hint: kind === 'total' ? 'Do you know how many in each group?' : 'Do you know the total, and need to split it?',
          steps: [kind === 'total' ? 'The groups are already made. Put them together: ' + rep(g, n) + ' = ' + g * n + '.' : 'Split the total into ' + g + ' equal groups: ' + n + ' each.'],
          explain: kind === 'total' ? g * n + ' marbles in all.' : n + ' in each bag.', meta: { k: 'g2-which', kind: kind } };
      }],
      [1, 'tap', function (lv) {
        var name = who(), g = R.int(2, 4), n = R.int(2, 5); if (g === n) n++;
        var set = grpPics(g, n);
        return { q: name + ' puts <b>' + n + '</b> strawberries on each of <b>' + g + '</b> plates. Tap the picture that shows it.', type: 'tap', tiles: set.map(function (p) { return plates(p[0], p[1], 'dot', 'Plates'); }), answer: set.findIndex(function (p) { return p[0] === g && p[1] === n; }), answerText: g + ' plates with ' + n + ' each',
          hint: 'Count the plates, then count one plate.', steps: ['You need ' + g + ' plates with ' + n + ' on each.'],
          explain: g + ' plates with ' + n + ' on each: ' + g * n + ' strawberries.', meta: { k: 'g2-story-tap', set: set, g: g, n: n } };
      }],
      [2, 'mistake', function (lv) {
        var g = R.int(3, 5), n = R.int(2, 4), name = who(), truth = !R.int(0, 2), said = truth ? g * n : g + n;
        var right = g + ' vases with ' + n + ' flowers each: ' + rep(g, n) + ' = ' + g * n + '.';
        return { q: 'There are ' + g + ' vases. Each vase has ' + n + ' flowers. ' + name + ' says there are <b>' + said + '</b> flowers in all. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Add the number of vases and the number of flowers.', 'Count the flowers in one vase.', 'There are as many flowers as vases.']),
          hint: 'Picture ' + g + ' vases. Skip count by ' + n + 's.', steps: [right], explain: right, meta: { k: 'g2-story-tf', g: g, n: n, said: said } };
      }]
    ]
  });
})();
