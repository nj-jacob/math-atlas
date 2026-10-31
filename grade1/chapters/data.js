(function () {
  var A = Atlas, R = A.R;
  var TOPICS = [
    { t: 'Our favourite fruit', cats: [['apples', 'apple'], ['oranges', 'ball'], ['bananas', 'leaf'], ['grapes', 'flower']], unit: 'children' },
    { t: 'How we get to school', cats: [['walk', 'sock'], ['car', 'car'], ['bus', 'cube'], ['bike', 'ball']], unit: 'children' },
    { t: 'Our favourite season', cats: [['winter', 'star'], ['spring', 'flower'], ['summer', 'ball'], ['fall', 'leaf']], unit: 'children' },
    { t: 'Pets at home', cats: [['dog', 'ball'], ['cat', 'star'], ['fish', 'fish'], ['no pet', 'cube']], unit: 'children' }
  ];
  var TEACH = ['Ms. Lee', 'Mr. Singh', 'Mme Roy', 'Ms. Chen'];
  /* tally marks for n: groups of 5 with a line across */
  function tally(n, x, y) {
    var s = '', g = 0;
    for (var i = 0; i < n; i++) {
      var k = i % 5, gx = x + Math.floor(i / 5) * 46;
      if (k < 4) s += '<line x1="' + (gx + k * 9) + '" y1="' + y + '" x2="' + (gx + k * 9) + '" y2="' + (y + 26) + '" style="stroke:var(--ink)" stroke-width="3" stroke-linecap="round"/>';
      else s += '<line x1="' + (gx - 5) + '" y1="' + (y + 22) + '" x2="' + (gx + 32) + '" y2="' + (y + 4) + '" style="stroke:var(--accent)" stroke-width="3" stroke-linecap="round"/>';
      g++;
    }
    return s;
  }
  function tallyPic(n) { return A.svg(Math.max(60, Math.ceil(n / 5) * 46 + 10), 36, tally(n, 8, 5), n + ' tally marks'); }
  function tallyTable(cats, counts, title) {
    var h = '<div class="tbl"><table><caption>' + title + '</caption><thead><tr><th class="l">Choice</th><th class="l">Tally</th><th>Total</th></tr></thead><tbody>';
    cats.forEach(function (c, i) { h += '<tr><td class="l">' + c[0] + '</td><td class="l">' + tallyPic(counts[i]) + '</td><td>' + counts[i] + '</td></tr>'; });
    return h + '</tbody></table></div>';
  }
  /* a pictograph: one picture for each child */
  function picto(topic, counts, src, o) {
    o = o || {};
    var z = 28, lw = 96, s = '', y = 36, maxN = Math.max.apply(null, counts.concat([1]));
    s += '<text x="4" y="22" font-size="20" class="tb">' + topic.t + '</text>';
    topic.cats.forEach(function (c, i) {
      s += '<text x="' + (lw - 8) + '" y="' + (y + z / 2 + 6) + '" text-anchor="end" font-size="18" class="tb">' + c[0] + '</text>';
      s += '<line x1="' + lw + '" y1="' + (y - 3) + '" x2="' + lw + '" y2="' + (y + z + 3) + '" style="stroke:var(--ink2)" stroke-width="2"/>';
      for (var j = 0; j < counts[i]; j++) s += A.icon(c[1], lw + 8 + j * (z + 4) + z / 2, y + z / 2, z);
      y += z + 10;
    });
    s += '<text x="4" y="' + (y + 16) + '" font-size="18" class="t2">Each picture is 1 child.</text><text x="4" y="' + (y + 40) + '" font-size="18" class="t2">Data from ' + src + '.</text>';
    var W = Math.max(lw + 12 + maxN * (z + 4), 380);
    return A.svg(W, y + 48, s, 'Pictograph: ' + topic.t + '. ' + topic.cats.map(function (c, i) { return c[0] + ' ' + counts[i]; }).join(', ') + '. Data from ' + src + '.');
  }
  function makeData(lv, k) {
    var topic = R.pick(TOPICS), counts, ok;
    do { counts = topic.cats.slice(0, k || 4).map(function () { return R.int(1, lv === 1 ? 6 : 9); }); ok = new Set(counts).size === counts.length; } while (!ok);
    return { topic: { t: topic.t, cats: topic.cats.slice(0, k || 4) }, counts: counts, src: TEACH[R.int(0, 3)] + '\'s class' };
  }
  /* things to sort: colour and kind */
  var SORTS = [
    { rule: 'by colour', a: 'red', b: 'blue' }, { rule: 'by shape', a: 'circles', b: 'squares' }, { rule: 'by size', a: 'big', b: 'small' }
  ];
  function sortPic(rule) {
    var items = [];
    for (var i = 0; i < 8; i++) items.push({ col: R.pick(['#e04b3a', '#2c68cf']), sh: R.pick(['c', 's']), big: R.int(0, 1) });
    /* make sure every rule sees both kinds in each group, so only one rule fits */
    items[0] = { col: '#e04b3a', sh: 'c', big: 1 }; items[1] = { col: '#e04b3a', sh: 's', big: 0 }; items[2] = { col: '#2c68cf', sh: 'c', big: 0 }; items[3] = { col: '#2c68cf', sh: 's', big: 1 };
    var key = rule === 'by colour' ? function (it) { return it.col === '#e04b3a'; } : rule === 'by shape' ? function (it) { return it.sh === 'c'; } : function (it) { return it.big === 1; };
    function draw(list) {
      var s = '', x = 10;
      list.forEach(function (it) { var z = it.big ? 40 : 22; s += it.sh === 'c' ? '<circle cx="' + (x + 20) + '" cy="40" r="' + z / 2 + '" style="fill:' + it.col + '" stroke="rgba(0,0,0,.45)" stroke-width="2"/>' : '<rect x="' + (x + 20 - z / 2) + '" y="' + (40 - z / 2) + '" width="' + z + '" height="' + z + '" style="fill:' + it.col + '" stroke="rgba(0,0,0,.45)" stroke-width="2"/>'; x += 46; });
      return { s: s, w: x + 6 };
    }
    var g1 = draw(items.filter(key)), g2 = draw(items.filter(function (it) { return !key(it); }));
    var d = function (it) { return (it.big ? 'big ' : 'small ') + (it.col === '#e04b3a' ? 'red ' : 'blue ') + (it.sh === 'c' ? 'circle' : 'square'); };
    return '<div class="vrow"><figure>' + A.svg(g1.w, 80, '<rect x="2" y="2" width="' + (g1.w - 4) + '" height="76" rx="30" style="fill:none;stroke:var(--strand)" stroke-width="3"/>' + g1.s, 'Group 1: ' + items.filter(key).map(d).join(', ')) + '<figcaption>Group 1</figcaption></figure>' +
      '<figure>' + A.svg(g2.w, 80, '<rect x="2" y="2" width="' + (g2.w - 4) + '" height="76" rx="30" style="fill:none;stroke:var(--strand)" stroke-width="3"/>' + g2.s, 'Group 2: ' + items.filter(function (it) { return !key(it); }).map(d).join(', ')) + '<figcaption>Group 2</figcaption></figure></div>';
  }
  /* a bag of counters for chance */
  function bag(red, blue) {
    var s = '<path d="M30 40Q20 150 40 170H180Q200 150 190 40Z" style="fill:#d9a066;stroke:#7a4b2a" stroke-width="3"/><path d="M30 40Q110 20 190 40" fill="none" stroke="#7a4b2a" stroke-width="5"/>', i = 0;
    for (var k = 0; k < red + blue; k++) { var x = 60 + (k % 5) * 25, y = 70 + Math.floor(k / 5) * 26; s += '<circle cx="' + x + '" cy="' + y + '" r="10" style="fill:' + (k < red ? '#e04b3a' : '#2c68cf') + '" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/>'; i++; }
    return A.svg(220, 180, s, 'A bag with ' + red + ' red and ' + blue + ' blue counters');
  }

  function qSort(lv) {
    var r = lv === 1 ? R.pick(SORTS.slice(0, 2)) : R.pick(SORTS);
    var opts = SORTS.map(function (x) { return x.rule; });
    return { q: 'These shapes were sorted into two groups. What is the <b>sorting rule</b>?', type: 'mc', options: opts, answer: opts.indexOf(r.rule), fig: sortPic(r.rule), wide: true,
      hint: 'Look for something that is the same for every shape in group 1, and different in group 2.', steps: ['Look at group 1. What do all of them share?', 'Check group 2. None of them have that.', 'The rule is: sort ' + r.rule + '.'], explain: 'Every shape in group 1 is ' + r.a + ' and every shape in group 2 is ' + r.b + '. They were sorted ' + r.rule + '.' };
  }
  function qTally(lv) {
    var n = lv === 1 ? R.int(1, 5) : lv === 2 ? R.int(6, 14) : R.int(15, 24), g = Math.floor(n / 5), o = n % 5;
    return { q: 'How many do these tally marks show?', type: 'num', answer: n, fig: tallyPic(n),
      hint: 'Each bundle with a line across is 5. Count the bundles by 5s, then count on the single marks.',
      steps: ['Each bundle is 5. There ' + (g === 1 ? 'is 1 bundle' : 'are ' + g + ' bundles') + '.', g ? 'Count by 5s: ' + Array.apply(null, Array(g)).map(function (_, i) { return 5 * (i + 1); }).join(', ') + '.' : 'There are no full bundles.', o ? 'Count on ' + o + ' more: ' + Array.apply(null, Array(o)).map(function (_, i) { return 5 * g + i + 1; }).join(', ') + '. Total: ' + n + '.' : 'No single marks. Total: ' + n + '.'],
      explain: 'The tally shows ' + n + '.' };
  }
  function qGraph(lv) {
    var d = makeData(lv), cats = d.topic.cats.map(function (c) { return c[0]; }), fig = picto(d.topic, d.counts, d.src);
    if (lv === 1) {
      var i = R.int(0, 3);
      return { q: 'How many children chose <b>' + cats[i] + '</b>?', type: 'num', answer: d.counts[i], fig: fig,
        hint: 'Find the ' + cats[i] + ' row. Count the pictures in it.', steps: ['Find the row labelled ' + cats[i] + '.', 'Count the pictures. Each one is 1 child.', d.counts[i] + ' children chose ' + cats[i] + '.'], explain: d.counts[i] + ' children chose ' + cats[i] + '.' };
    }
    if (lv === 2) {
      var most = R.int(0, 1), v = most ? Math.max.apply(null, d.counts) : Math.min.apply(null, d.counts), ans = cats[d.counts.indexOf(v)];
      return { q: 'Which was chosen the <b>' + (most ? 'most' : 'least') + '</b>?', type: 'mc', options: cats.slice(), answer: cats.indexOf(ans), fig: fig,
        hint: 'Find the ' + (most ? 'longest' : 'shortest') + ' row of pictures.', steps: ['Count each row: ' + cats.map(function (c, j) { return c + ' ' + d.counts[j]; }).join(', ') + '.', 'Find the ' + (most ? 'biggest' : 'smallest') + ' number: ' + v + '.', ans + ' was chosen the ' + (most ? 'most' : 'least') + '.'], explain: ans + ' has ' + v + ', the ' + (most ? 'most' : 'least') + '.' };
    }
    var a = R.int(0, 3), b; do { b = R.int(0, 3); } while (b === a);
    if (d.counts[a] < d.counts[b]) { var t = a; a = b; b = t; }
    if (R.int(0, 1)) {
      var tot = d.counts.reduce(function (x, y) { return x + y; }, 0);
      return { q: 'How many children answered <b>altogether</b>?', type: 'num', answer: tot, fig: fig,
        hint: 'Add the numbers for every row.', steps: ['Count each row: ' + d.counts.join(', ') + '.', 'Add them: ' + d.counts.join(' + ') + '.', 'That is ' + tot + ' children.'], explain: d.counts.join(' + ') + ' = ' + tot + '.' };
    }
    return { q: 'How many <b>more</b> children chose ' + cats[a] + ' than ' + cats[b] + '?', type: 'num', answer: d.counts[a] - d.counts[b], fig: fig,
      hint: 'Line up the two rows. How many pictures in the ' + cats[a] + ' row have no partner?', steps: [cats[a] + ': ' + d.counts[a] + '. ' + cats[b] + ': ' + d.counts[b] + '.', 'Count up from ' + d.counts[b] + ' to ' + d.counts[a] + ', or subtract.', d.counts[a] + ' &minus; ' + d.counts[b] + ' = ' + (d.counts[a] - d.counts[b]) + '.'], explain: (d.counts[a] - d.counts[b]) + ' more children chose ' + cats[a] + '.' };
  }
  function qOrder(lv) {
    var d = makeData(lv, lv === 1 ? 3 : 4), cats = d.topic.cats.map(function (c) { return c[0]; });
    var idx = cats.map(function (_, i) { return i; }).sort(function (x, y) { return d.counts[y] - d.counts[x]; });
    var right = idx.map(function (i) { return cats[i]; }).join(', '), wrongs = [];
    while (wrongs.length < 2) { var w = R.shuffle(cats).join(', '); if (w !== right && wrongs.indexOf(w) < 0) wrongs.push(w); }
    var o = R.mc(right, wrongs.concat([idx.slice().reverse().map(function (i) { return cats[i]; }).join(', ')]).filter(function (x) { return x !== right; }).slice(0, 2));
    var fig = lv === 3 ? tallyTable(d.topic.cats, d.counts, d.topic.t) : picto(d.topic, d.counts, d.src);
    return { q: 'Which list goes from <b>most to least</b> chosen?', type: 'mc', options: o.options, answer: o.answer, wide: true, fig: fig,
      hint: 'Find the most chosen first. Then the next most.', steps: ['Count each: ' + cats.map(function (c, j) { return c + ' ' + d.counts[j]; }).join(', ') + '.', 'Put the biggest number first and the smallest last.', 'Most to least: ' + right + '.'], explain: 'Most to least: ' + idx.map(function (i) { return cats[i] + ' (' + d.counts[i] + ')'; }).join(', ') + '.' };
  }
  function qChance(lv) {
    var red, blue, ask = R.pick(['red', 'blue']), ans;
    var kind = lv === 1 ? R.pick(['certain', 'impossible']) : R.pick(['certain', 'impossible', 'possible']);
    if (kind === 'possible') { red = R.int(1, 6); blue = R.int(1, 6); }
    else if (kind === 'certain') { red = ask === 'red' ? R.int(3, 9) : 0; blue = ask === 'blue' ? R.int(3, 9) : 0; }
    else { red = ask === 'red' ? 0 : R.int(3, 9); blue = ask === 'blue' ? 0 : R.int(3, 9); }
    if (lv === 3 && R.int(0, 1)) {
      var ev = R.pick([['The sun will rise tomorrow.', 'certain'], ['It will snow in Ontario in January.', 'possible'], ['A cat will drive a bus to school.', 'impossible'], ['You will roll a 7 on a number cube with 1 to 6 on it.', 'impossible'], ['It will rain this week.', 'possible'], ['Tomorrow will come after today.', 'certain']]);
      return { q: 'Is this <b>impossible</b>, <b>possible</b> or <b>certain</b>? ' + ev[0], type: 'mc', options: ['impossible', 'possible', 'certain'], answer: ['impossible', 'possible', 'certain'].indexOf(ev[1]),
        hint: 'Certain means it will happen for sure. Impossible means it can never happen. Possible means it might.', steps: ['Ask: could it happen?', 'If it can never happen, it is impossible. If it will for sure, it is certain.', 'This one is ' + ev[1] + '.'], explain: '"' + ev[0] + '" is ' + ev[1] + '.' };
    }
    return { q: 'You pick one counter from the bag without looking. Getting <b>' + ask + '</b> is...', type: 'mc', options: ['impossible', 'possible', 'certain'], answer: ['impossible', 'possible', 'certain'].indexOf(kind), fig: bag(red, blue),
      hint: 'Are there any ' + ask + ' counters? Are there any other colours?', steps: ['Count: ' + red + ' red and ' + blue + ' blue.', kind === 'impossible' ? 'There are no ' + ask + ' counters.' : kind === 'certain' ? 'Every counter is ' + ask + '.' : 'Some are ' + ask + ' and some are not.', 'So getting ' + ask + ' is ' + kind + '.'],
      explain: kind === 'impossible' ? 'There are no ' + ask + ' counters, so it is impossible.' : kind === 'certain' ? 'All the counters are ' + ask + ', so it is certain.' : 'There are ' + ask + ' counters and other counters, so it is possible but not certain.' };
  }

  var demo = { t: 'Our favourite fruit', cats: TOPICS[0].cats };
  var CH = 'data';
  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters[CH].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  var SH8 = [['#e04b3a', 'c', 1], ['#2c68cf', 's', 0], ['#e04b3a', 's', 1], ['#2c68cf', 'c', 1], ['#e04b3a', 'c', 0], ['#2c68cf', 's', 1]];
  function shp(it, i) { var z = it[2] ? 44 : 26, s = it[1] === 'c' ? '<circle cx="26" cy="26" r="' + z / 2 + '" style="fill:' + it[0] + '" stroke="rgba(0,0,0,.45)" stroke-width="2"/>' : '<rect x="' + (26 - z / 2) + '" y="' + (26 - z / 2) + '" width="' + z + '" height="' + z + '" rx="3" style="fill:' + it[0] + '" stroke="rgba(0,0,0,.45)" stroke-width="2"/>'; return { id: 's' + i, html: A.svg(52, 52, s, (it[2] ? 'big ' : 'small ') + (it[0] === '#e04b3a' ? 'red ' : 'blue ') + (it[1] === 'c' ? 'circle' : 'square')) }; }
  /* "Try it": a survey. Tap an answer to add a tally mark; the table and the picture graph grow. */
  function survey(goal) {
    return { do: 'Ask people: <b>"What is your favourite fruit?"</b> Tap their answer each time. Collect <b>' + goal + '</b> answers.', mount: function (host, done) {
      var votes = demo.cats.map(function () { return 0; });
      host.innerHTML = '<div class="btnrow">' + demo.cats.map(function (c, i) { return '<button type="button" class="btn alt" data-i="' + i + '">' + c[0] + '</button>'; }).join('') + '</div><div class="tt"></div><div class="fig g1-frame"></div>';
      function draw() {
        var tot = votes.reduce(function (a, b) { return a + b; }, 0);
        A.$('.tt', host).innerHTML = tallyTable(demo.cats, votes, 'Our favourite fruit');
        A.$('.fig', host).innerHTML = tot ? picto(demo, votes, 'my survey') : '';
        if (tot === goal) done('You collected ' + goal + ' answers. Your tally table and picture graph show the same data.');
      }
      A.$$('[data-i]', host).forEach(function (b) { b.addEventListener('click', function () { votes[+b.getAttribute('data-i')]++; draw(); }); });
      draw();
    } };
  }

  var LESSONS = [
    { id: 'sort', title: 'Sorting', sub: 'Groups that are alike.', concepts: [
      { id: 'rule', title: 'A sorting rule', exp: ['D1.1'], skill: 'd-sort',
        body: '<p>To <b>sort</b>, put things into groups that are alike in one way. The way we choose is the <b>sorting rule</b>.</p>',
        watch: { tool: 'g1pick', opts: { items: SH8.map(shp) }, steps: [
          { say: 'Sorting rule: <b>red</b>.', ms: 1200 },
          { say: 'Red circle. Red.', act: function (t) { return t.pick('s0'); }, ms: 600 },
          { say: 'Red square, small red circle. Red, red.', act: function (t) { return t.pick('s2').then(function () { return t.pick('s4'); }); }, ms: 900 },
          { say: 'Shape and size do not matter for this rule. Only colour.', ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { items: SH8.map(shp) }, tasks: [
          { do: 'Sort by shape. Tap every <b>square</b>, big or small, red or blue.', goal: function (s) { return s.n === 3 && ['s1', 's2', 's5'].every(function (k) { return s.picked.indexOf(k) >= 0; }); }, yes: 'Those are all the squares.' },
          { do: 'Now sort the same shapes by size. Tap every <b>big</b> one.', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.n === 4 && ['s0', 's2', 's3', 's5'].every(function (k) { return s.picked.indexOf(k) >= 0; }); }, yes: 'Same shapes, a different rule, different groups.' }
        ] },
        key: '<p>The same things can be sorted <b>many ways</b>. Say your rule.</p>',
        check: [P('d-sort', 1), P('d-sort', 2)] }
    ] },

    { id: 'tally', title: 'Tally tables', sub: 'One line for each answer.', concepts: [
      { id: 'marks', title: 'Tally marks', exp: ['D1.2'], skill: 'd-tally',
        body: '<p>A <b>tally</b> is a quick way to count. Make one line for each answer. The 5th line goes <b>across</b> the first 4 to make a bundle of 5.</p>',
        watch: { tool: 'g1stage', steps: [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return { say: n === 5 ? 'The 5th line goes <b>across</b>. A bundle of 5.' : n === 8 ? 'Count the bundle as 5, then 6, 7, 8. <b>8</b> tallies.' : String(n) + '.', act: function (t) { return t.show(tallyPic(n)); }, ms: n === 5 ? 1500 : n === 8 ? 1800 : 450 }; }) },
        try: survey(8),
        key: '<p>Count tally bundles by <b>5s</b>, then count on.</p>',
        check: [P('d-tally', 1), P('d-tally', 2)] }
    ] },

    { id: 'graph', title: 'Picture graphs', sub: 'One picture for each answer.', concepts: [
      { id: 'picto', title: 'Make a picture graph', exp: ['D1.3'], skill: 'd-graph',
        body: '<p>A <b>pictograph</b> uses pictures to show data. Each picture is 1 answer. A good graph has a <b>title</b>, <b>labels</b> and a <b>source</b> (where the data came from).</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Ms. Lee\'s class voted. Start with a title and labels.', act: function (t) { return t.show(picto(demo, [0, 0, 0, 0], 'Ms. Lee\'s class')); }, ms: 1500 },
          { say: 'One apple picture for each child who picked apples: 7.', act: function (t) { return t.show(picto(demo, [7, 0, 0, 0], 'Ms. Lee\'s class')); }, ms: 1300 },
          { say: 'Then the others: oranges 3, bananas 5, grapes 2.', act: function (t) { return t.show(picto(demo, [7, 3, 5, 2], 'Ms. Lee\'s class')); }, ms: 1800 }
        ] },
        try: survey(10),
        mistake: '<p>Pictures that are different sizes or spread out make a short row look long. Line them up from the same start, one per space.</p>',
        key: '<p>One picture for <b>each answer</b>, lined up from the same start.</p>',
        check: [P('d-graph', 1), P('d-graph', 2)] },
      { id: 'read', title: 'Read a graph', exp: ['D1.4', 'D1.5'], skill: 'd-order',
        body: '<p>We can ask questions about a graph. Which is the <b>most</b>? The <b>least</b>? How many <b>more</b>?</p><div class="fig">' + picto(demo, [7, 3, 5, 2], 'Ms. Lee\'s class') + '</div>',
        watch: { tool: 'g1stage', steps: [
          { say: 'The longest row is apples: <b>most</b>, 7.', act: function (t) { return t.show(picto(demo, [7, 3, 5, 2], 'Ms. Lee\'s class')); }, ms: 1600 },
          { say: 'The shortest row is grapes: <b>least</b>, 2.', ms: 1500 },
          { say: 'Apples 7, bananas 5. Apples has <b>2 more</b>.', ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: demo.cats.map(function (c) { return { id: c[0], html: '<span>' + c[0] + '</span>' }; }) }, tasks: [
          { do: 'Which fruit did the <b>fewest</b> children pick?', goal: function (s) { return s.picked[0] === 'grapes'; }, yes: 'Grapes: only 2.' },
          { do: 'Which fruit did <b>5</b> children pick?', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'bananas'; }, yes: 'Bananas: 5.' }
        ] },
        key: '<p>Longest row: <b>most</b>. Shortest row: <b>least</b>.</p>',
        check: [P('d-graph', 3), P('d-order', 1), P('d-order', 2)] }
    ] },

    { id: 'chance', title: 'Impossible, possible, certain', sub: 'Will it happen?', concepts: [
      { id: 'words', title: 'Certain, possible, impossible', exp: ['D2.1'], skill: 'd-chance',
        body: '<p><b>Certain</b>: it will happen for sure. <b>Possible</b>: it might happen. <b>Impossible</b>: it cannot happen.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'All red counters. Picking red is <b>certain</b>.', act: function (t) { return t.show(bag(6, 0)); }, ms: 1600 },
          { say: 'Some red, some blue. Picking red is <b>possible</b>.', act: function (t) { return t.show(bag(3, 3)); }, ms: 1600 },
          { say: 'No red at all. Picking red is <b>impossible</b>.', act: function (t) { return t.show(bag(0, 6)); }, ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [['c', 'certain'], ['p', 'possible'], ['i', 'impossible']].map(function (x) { return { id: x[0], html: '<span>' + x[1] + '</span>' }; }) }, tasks: [
          { do: '"A dog will fly to the moon."', goal: function (s) { return s.picked[0] === 'i'; }, yes: 'Dogs cannot fly. Impossible.' },
          { do: '"It will rain tomorrow."', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'p'; }, yes: 'It might rain, or it might not. Possible.' },
          { do: '"Tomorrow will come after today."', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'c'; }, yes: 'That always happens. Certain.' }
        ] },
        mistake: '<p>Calling things that are unlikely "impossible". Ask: "Could it ever happen, even once?"</p>',
        key: '<p><b>Will</b> happen, <b>might</b> happen, <b>cannot</b> happen.</p>',
        check: [P('d-chance', 1), P('d-chance', 2)] }
    ] }
  ];

  A.register('data', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Sorting</h2>' +
'<p>To <b>sort</b>, we put things into groups that are alike in one way. The way we choose is the <b>sorting rule</b>.</p>' +
'<div class="lab"><span class="lt">Try it: sort the same shapes three ways</span><div class="btnrow" role="group" aria-label="Sort by"><button type="button" class="btn" data-sort="by colour">By colour</button><button type="button" class="btn alt" data-sort="by shape">By shape</button><button type="button" class="btn alt" data-sort="by size">By size</button></div><div id="sofig"></div><div class="out" id="soout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The same things can be sorted in different ways. Always say your sorting rule.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Tally tables</h2>' +
'<p>A <b>tally</b> is a quick way to count. Make one line for each answer. The 5th line goes <b>across</b> the first 4 to make a bundle of 5.</p>' +
'<div class="vrow"><figure>' + tallyPic(4) + '<figcaption>4</figcaption></figure><figure>' + tallyPic(5) + '<figcaption>5</figcaption></figure><figure>' + tallyPic(12) + '<figcaption>12: 5, 10, 11, 12</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>I asked my class, "What is your favourite fruit?" I made one tally mark for each answer.</p>' + tallyTable(demo.cats, [7, 3, 5, 2], 'Our favourite fruit') + '<p>Apples has a bundle of 5 and 2 more: 7.</p></div>' +
'<div class="lab"><span class="lt">Try it: take a survey</span><p class="noread" style="margin-top:0">Ask people at home: "What is your favourite fruit?" Tap their answer.</p><div class="btnrow" id="tvbtns">' + demo.cats.map(function (c, i) { return '<button type="button" class="btn alt" data-v="' + i + '">' + c[0] + '</button>'; }).join('') + '<button type="button" class="btn alt" id="tvclr">Clear</button></div>' +
'<div id="tvtab"></div><div class="fig" id="tvpic"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Picture graphs</h2>' +
'<p>A <b>pictograph</b> uses pictures to show data. Each picture is 1 answer. A good graph has a <b>title</b>, <b>labels</b> and says where the data came from (the <b>source</b>).</p>' +
'<div class="fig">' + picto(demo, [7, 3, 5, 2], 'Ms. Lee\'s class') + '</div>' +
'<p>A <b>concrete graph</b> is the same idea with real things. Children can line up in rows, or put a block in the row for their answer.</p>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Line the pictures up from the same starting line, one picture in each space. If some pictures are bigger or spread out, a short row can look long.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Reading graphs</h2>' +
'<p>We can ask and answer questions about a graph. Which is the most? The least? How many more? How many altogether?</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + picto(demo, [7, 3, 5, 2], 'Ms. Lee\'s class') + '</div><ul><li><b>Most:</b> apples, 7.</li><li><b>Least:</b> grapes, 2.</li><li><b>Most to least:</b> apples, bananas, oranges, grapes.</li><li><b>How many more</b> chose apples than bananas? 7 &minus; 5 = 2.</li><li><b>Altogether:</b> 7 + 3 + 5 + 2 = 17 children.</li></ul>' +
'<p>The class could decide: "Let\'s bring apples for snack. Most of us like them."</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>If we asked another class of the same size, the counts would probably <b>not</b> be exactly the same. They might be close. Make a prediction, then check.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Impossible, possible, certain</h2>' +
'<p><b>Certain</b> means it will happen for sure. <b>Impossible</b> means it cannot happen. <b>Possible</b> means it might happen.</p>' +
'<div class="vrow"><figure>' + bag(6, 0) + '<figcaption>Red is certain</figcaption></figure><figure>' + bag(3, 3) + '<figcaption>Red is possible</figcaption></figure><figure>' + bag(0, 6) + '<figcaption>Red is impossible</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>"A dog will fly to the moon." That cannot happen: <b>impossible</b>.</p><p>"It will rain tomorrow." It might, or it might not: <b>possible</b>.</p><p>"Tomorrow will come after today." That will happen for sure: <b>certain</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: fill the bag</span><div class="row2">' + A.stepHtml('cb1', 'Red counters', 3) + A.stepHtml('cb2', 'Blue counters', 3) + '</div><div class="fig" id="cbfig"></div><div class="out" id="cbout"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function so(rule) {
        $('#sofig', root).innerHTML = sortPic(rule);
        $('#soout', root).innerHTML = 'Sorting rule: <b>' + rule + '</b>. ' + { 'by colour': 'Red in one group, blue in the other.', 'by shape': 'Circles in one group, squares in the other.', 'by size': 'Big in one group, small in the other.' }[rule];
      }
      A.$$('[data-sort]', root).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-sort') === 'by colour'));
        b.addEventListener('click', function () { A.$$('[data-sort]', root).forEach(function (x) { x.classList.toggle('alt', x !== b); x.setAttribute('aria-pressed', String(x === b)); }); so(b.getAttribute('data-sort')); });
      });
      so('by colour');
      var votes = [0, 0, 0, 0];
      function tv() {
        $('#tvtab', root).innerHTML = tallyTable(demo.cats, votes, 'Our favourite fruit');
        var tot = votes.reduce(function (a, b) { return a + b; }, 0);
        $('#tvpic', root).innerHTML = tot ? picto(demo, votes, 'my survey') : '<p class="t2">Your picture graph will appear here.</p>';
      }
      A.$$('#tvbtns [data-v]', root).forEach(function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-v'); if (votes[i] < 15) votes[i]++; tv(); }); });
      $('#tvclr', root).addEventListener('click', function () { votes = [0, 0, 0, 0]; tv(); });
      tv();
      var r = 3, bl = 3;
      function cb() {
        $('#cbfig', root).innerHTML = bag(r, bl);
        var w = function (n, o) { return !n ? 'impossible' : !o ? 'certain' : 'possible'; };
        $('#cbout', root).innerHTML = r + bl ? 'Picking <b>red</b> is <b>' + w(r, bl) + '</b>. Picking <b>blue</b> is <b>' + w(bl, r) + '</b>.' + (r && bl ? (r > bl ? ' Red is more likely.' : bl > r ? ' Blue is more likely.' : ' They are equally likely.') : '') : 'The bag is empty. Add some counters.';
      }
      A.stepper(root, 'cb1', 0, 10, function (n) { r = n; cb(); });
      A.stepper(root, 'cb2', 0, 10, function (n) { bl = n; cb(); });
    },

    checks: [
      [function () { return qSort(1); }, function () { return qSort(2); }, function () { return qSort(2); }],
      [function () { return qTally(1); }, function () { return qTally(2); }, function () { return qTally(2); }],
      [function () { return qGraph(1); }, function () { return qGraph(1); }, function () { return qGraph(2); }],
      [function () { return qGraph(2); }, function () { return qOrder(1); }, function () { return qGraph(3); }],
      [function () { return qChance(1); }, function () { return qChance(2); }, function () { return qChance(3); }]
    ],

    quiz: [
      { q: 'How many do these tally marks show?', type: 'num', answer: 13, fig: tallyPic(13),
        hint: 'Count the bundles by 5s, then count on.', explain: '5, 10, then 11, 12, 13.' },
      { q: 'How many children chose <b>bus</b>?', type: 'num', answer: 6, fig: picto(TOPICS[1], [4, 2, 6, 3], 'Mr. Singh\'s class'),
        hint: 'Count the pictures in the bus row.', explain: '6 pictures, so 6 children.' },
      { q: 'Which was chosen the <b>least</b>?', type: 'mc', options: ['walk', 'car', 'bus', 'bike'], answer: 1, fig: picto(TOPICS[1], [4, 2, 6, 3], 'Mr. Singh\'s class'),
        hint: 'Find the shortest row.', explain: 'Car has 2, the fewest.' },
      { q: 'How many <b>more</b> children chose bus than walk?', type: 'num', answer: 2, fig: picto(TOPICS[1], [4, 2, 6, 3], 'Mr. Singh\'s class'),
        hint: 'Bus is 6, walk is 4.', explain: '6 &minus; 4 = 2 more.' },
      { q: 'Which list goes from <b>most to least</b> chosen?', type: 'mc', options: ['bus, walk, bike, car', 'car, bike, walk, bus', 'walk, car, bus, bike'], answer: 0, wide: true, fig: picto(TOPICS[1], [4, 2, 6, 3], 'Mr. Singh\'s class'),
        hint: 'Bus 6, walk 4, bike 3, car 2.', explain: 'Most to least: bus 6, walk 4, bike 3, car 2.' },
      { q: 'These shapes were sorted into two groups. What is the <b>sorting rule</b>?', type: 'mc', options: ['by colour', 'by shape', 'by size'], answer: 1, wide: true,
        fig: '<div class="vrow"><figure>' + A.svg(150, 80, '<circle cx="30" cy="40" r="20" style="fill:#e04b3a" stroke="rgba(0,0,0,.45)" stroke-width="2"/><circle cx="76" cy="40" r="11" style="fill:#2c68cf" stroke="rgba(0,0,0,.45)" stroke-width="2"/><circle cx="120" cy="40" r="20" style="fill:#2c68cf" stroke="rgba(0,0,0,.45)" stroke-width="2"/>', 'Group 1: big red circle, small blue circle, big blue circle') + '<figcaption>Group 1</figcaption></figure><figure>' + A.svg(150, 80, '<rect x="10" y="20" width="40" height="40" style="fill:#2c68cf" stroke="rgba(0,0,0,.45)" stroke-width="2"/><rect x="65" y="29" width="22" height="22" style="fill:#e04b3a" stroke="rgba(0,0,0,.45)" stroke-width="2"/><rect x="100" y="20" width="40" height="40" style="fill:#e04b3a" stroke="rgba(0,0,0,.45)" stroke-width="2"/>', 'Group 2: big blue square, small red square, big red square') + '<figcaption>Group 2</figcaption></figure></div>',
        hint: 'Both groups have red and blue, and big and small. What is different?', explain: 'Group 1 is all circles and group 2 is all squares. They were sorted by shape.' },
      { q: 'A bag has only blue counters. You pick one without looking. Getting <b>red</b> is...', type: 'mc', options: ['impossible', 'possible', 'certain'], answer: 0, fig: bag(0, 7),
        hint: 'Are there any red counters?', explain: 'There are no red counters, so getting red is impossible.' }
    ],

    practice: [
      { id: 'd-sort', name: 'Sorting rules', code: 'D1.1', gen: qSort },
      { id: 'd-tally', name: 'Read tally marks', code: 'D1.2', gen: qTally },
      { id: 'd-graph', name: 'Read a picture graph', code: 'D1.3, D1.5', gen: qGraph },
      { id: 'd-order', name: 'Most to least', code: 'D1.4', gen: qOrder },
      { id: 'd-chance', name: 'Impossible, possible, certain', code: 'D2.1', gen: qChance }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ---------- */
  var G = window.G1, nm = A.Q ? A.Q.name : function () { return 'Ava'; };
  /* one thing to sort: red or blue, circle or square, big or small */
  function thing(col, sh, big) {
    var c = col === 'red' ? '#e04b3a' : '#2c68cf', r = big ? 24 : 13, st = 'style="fill:' + c + '" stroke="rgba(0,0,0,.45)" stroke-width="2"';
    return A.svg(60, 60, sh === 'circle' ? '<circle cx="30" cy="30" r="' + r + '" ' + st + '/>' : '<rect x="' + (30 - r) + '" y="' + (30 - r) + '" width="' + 2 * r + '" height="' + 2 * r + '" rx="3" ' + st + '/>', 'a ' + (big ? 'big' : 'small') + ' ' + col + ' ' + sh);
  }
  function things(k) {
    var all = []; ['red', 'blue'].forEach(function (c) { ['circle', 'square'].forEach(function (s) { [1, 0].forEach(function (b) { all.push([c, s, b]); }); }); });
    return R.shuffle(all).slice(0, k);
  }
  function chanceOf(red, blue) { return red && blue ? 'possible' : red ? 'certain' : 'impossible'; }
  var SHAPES = {
    'd-sort': [
      [1, 'pick', function (lv) {
        var by = lv === 1 ? 'colour' : R.pick(['colour', 'shape']), want = by === 'colour' ? R.pick(['red', 'blue']) : R.pick(['circle', 'square']), list = things(5);
        var fits = function (t) { return by === 'colour' ? t[0] === want : t[1] === want; };
        if (!list.some(fits) || list.every(fits)) list = by === 'colour' ? [['red', 'circle', 1], ['blue', 'square', 0], ['red', 'square', 0], ['blue', 'circle', 1]] : [['red', 'circle', 1], ['blue', 'square', 0], ['red', 'square', 1], ['blue', 'circle', 0]];
        var ans = []; list.forEach(function (t, j) { if (fits(t)) ans.push(j); });
        return { q: 'Sort ' + (by === 'colour' ? 'by colour' : 'by shape') + '. Pick every <b>' + want + '</b> one.', type: 'pick', options: list.map(function (t) { return thing(t[0], t[1], t[2]); }), answer: ans,
          hint: 'Look only at the ' + by + '. Size does not matter here.', steps: ['Check each one: is it ' + want + '?'],
          explain: 'Every ' + want + ' one goes in that group.', meta: { k: 'g1-sort-pick' } };
      }],
      [1, 'tap', function (lv) {
        var by = lv === 1 ? 'colour' : R.pick(['colour', 'shape']), a = by === 'colour' ? R.pick(['red', 'blue']) : R.pick(['circle', 'square']), b = by === 'colour' ? (a === 'red' ? 'blue' : 'red') : (a === 'circle' ? 'square' : 'circle');
        var list = [0, 1, 2].map(function () { return by === 'colour' ? [a, R.pick(['circle', 'square']), R.int(0, 1)] : [R.pick(['red', 'blue']), a, R.int(0, 1)]; });
        list.push(by === 'colour' ? [b, R.pick(['circle', 'square']), R.int(0, 1)] : [R.pick(['red', 'blue']), b, R.int(0, 1)]);
        var odd = list[3]; list = R.shuffle(list);
        return { q: 'These are sorted by <b>' + by + '</b>. Tap the one that does <b>not</b> belong.', type: 'tap', tiles: list.map(function (t) { return thing(t[0], t[1], t[2]); }), answer: list.indexOf(odd), answerText: 'the ' + (by === 'colour' ? odd[0] : odd[1]) + ' one',
          hint: 'Look only at the ' + by + '.', steps: ['Three are ' + a + '. One is ' + b + '.'],
          explain: 'The ' + b + ' one does not belong with the ' + a + ' ones.', meta: { k: 'g1-sort-tap', by: by } };
      }],
      [2, 'match', function () {
        var list = things(3);
        while (new Set(list.map(function (t) { return t.join(); })).size < 3) list = things(3);
        return { q: 'Match each one to its name.', type: 'match', pairs: list.map(function (t) { return [thing(t[0], t[1], t[2]), (t[2] ? 'big ' : 'small ') + t[0] + ' ' + t[1]]; }),
          hint: 'Look at the size, the colour and the shape.', steps: ['Name each one: size, colour, shape.'],
          explain: 'Each one has a size, a colour and a shape.', meta: { k: 'g1-sort-match' } };
      }]
    ],
    'd-tally': [
      [1, 'tap', function (lv) {
        var n = lv === 1 ? R.int(2, 6) : lv === 2 ? R.int(6, 14) : R.int(15, 24), set = R.shuffle(G.near(n, 3, 1, 25, lv === 1 ? [1, -1, 2] : [1, -1, 5, -5]));
        return { q: 'Tap the tally marks that show <b>' + n + '</b>.', type: 'tap', tiles: set.map(tallyPic), answer: set.indexOf(n), answerText: n + ' tally marks',
          hint: 'Each bundle with a line across is 5. Count by 5s, then count on.', steps: [n + ' is ' + Math.floor(n / 5) + ' bundles of 5 and ' + n % 5 + ' more.'],
          explain: Math.floor(n / 5) + ' bundles of 5 and ' + n % 5 + ' more make ' + n + '.', meta: { k: 'g1-tally-tap' } };
      }],
      [1, 'match', function (lv) {
        var lo = lv === 1 ? 1 : 6, hi = lv === 1 ? 7 : 20, v = [];
        while (v.length < 3) { var x = R.int(lo, hi); if (v.indexOf(x) < 0) v.push(x); }
        return { q: 'Match the tally marks to their numbers.', type: 'match', pairs: v.map(function (x) { return [tallyPic(x), String(x)]; }),
          hint: 'Each bundle is 5.', steps: ['Count the bundles by 5s, then count on the single marks.'],
          explain: v.join(', ') + '.', meta: { k: 'g1-tally-match' } };
      }],
      [2, 'fill', function (lv) {
        var n = lv === 2 ? R.int(6, 14) : R.int(15, 24);
        return { q: 'Fill in the blanks.', type: 'fill', fig: tallyPic(n), fill: '[[]] bundles of 5 and [[]] more make [[]].', answers: [Math.floor(n / 5), n % 5, n],
          hint: 'A bundle is 5 marks with a line across.', steps: ['Count the bundles. Then the single marks.'],
          explain: Math.floor(n / 5) + ' fives and ' + n % 5 + ' more make ' + n + '.', meta: { k: 'g1-tally-fill' } };
      }]
    ],
    'd-graph': [
      [1, 'fill', function (lv) {
        var d = makeData(lv), i = R.int(0, 2), j = i + 1, cats = d.topic.cats;
        return { q: 'Look at the picture graph. Fill in the blanks.', type: 'fill', fig: picto(d.topic, d.counts, d.src), fill: '[[]] children chose ' + cats[i][0] + '. [[]] children chose ' + cats[j][0] + '.', answers: [d.counts[i], d.counts[j]],
          hint: 'Each picture is 1 child. Count the pictures in each row.', steps: ['Count the ' + cats[i][0] + ' row: ' + d.counts[i] + '.', 'Count the ' + cats[j][0] + ' row: ' + d.counts[j] + '.'],
          explain: d.counts[i] + ' chose ' + cats[i][0] + ' and ' + d.counts[j] + ' chose ' + cats[j][0] + '.', meta: { k: 'g1-graph-fill' } };
      }],
      [1, 'mistake', function (lv) {
        var d = makeData(lv), a = R.int(0, 3), b; do { b = R.int(0, 3); } while (b === a);
        var cats = d.topic.cats, who = nm(), truth = d.counts[a] > d.counts[b];
        var big = truth ? a : b, small = truth ? b : a;
        var right = cats[big][0] + ' has ' + d.counts[big] + ' and ' + cats[small][0] + ' has ' + d.counts[small] + ', so more chose ' + cats[big][0] + '.';
        return G.tf(who + ' says more children chose <b>' + cats[a][0] + '</b> than <b>' + cats[b][0] + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['The top row always has the most.', 'Bigger pictures mean more children.', 'The last row always has the most.'], { k: 'g1-graph-tf' },
          { fig: picto(d.topic, d.counts, d.src), hint: 'Count the pictures in both rows.' });
      }],
      [2, 'story', function (lv) {
        var d = makeData(lv), i = R.int(0, 3), k = R.int(1, 3), cats = d.topic.cats;
        return { q: (d.src.charAt(0).toUpperCase() + d.src.slice(1)) + ' made this graph. Then ' + k + ' more children chose <b>' + cats[i][0] + '</b>. How many chose ' + cats[i][0] + ' now?', type: 'num', answer: d.counts[i] + k, fig: picto(d.topic, d.counts, d.src),
          hint: 'Count the ' + cats[i][0] + ' row. Then add ' + k + '.', steps: ['The graph shows ' + d.counts[i] + '.', d.counts[i] + ' + ' + k + ' = ' + (d.counts[i] + k) + '.'],
          explain: d.counts[i] + ' + ' + k + ' = ' + (d.counts[i] + k) + '.', meta: { k: 'g1-graph-story' } };
      }]
    ],
    'd-order': [
      [1, 'order', function (lv) {
        var d = makeData(lv, 3), cats = d.topic.cats.map(function (c) { return c[0]; }), idx = [0, 1, 2].sort(function (x, y) { return d.counts[y] - d.counts[x]; });
        return { q: 'Put the choices in order from <b>most to least</b>.', type: 'order', items: idx.map(function (i) { return cats[i]; }), first: 'most', last: 'least', fig: picto(d.topic, d.counts, d.src),
          hint: 'Count each row. The longest row is the most.', steps: ['The rows have ' + d.counts.join(', ') + '.'],
          explain: idx.map(function (i) { return cats[i] + ' (' + d.counts[i] + ')'; }).join(', ') + '.', meta: { k: 'g1-dorder-order' } };
      }],
      [1, 'pick', function (lv) {
        var d, x;
        do { d = makeData(lv); x = R.int(3, 6); } while (d.counts.every(function (c) { return c > x; }) || d.counts.every(function (c) { return c <= x; }));
        var cats = d.topic.cats.map(function (c) { return c[0]; }), ans = []; d.counts.forEach(function (c, j) { if (c > x) ans.push(j); });
        return { q: 'Pick every choice that <b>more than ' + x + '</b> children chose.', type: 'pick', options: cats, answer: ans, fig: picto(d.topic, d.counts, d.src),
          hint: 'Count each row. Is it more than ' + x + '?', steps: ['The rows have ' + d.counts.join(', ') + '.'],
          explain: ans.map(function (j) { return cats[j]; }).join(', ') + '.', meta: { k: 'g1-dorder-pick' } };
      }],
      [2, 'mistake', function (lv) {
        var d = makeData(lv), cats = d.topic.cats.map(function (c) { return c[0]; }), least = d.counts.indexOf(Math.min.apply(null, d.counts)), who = nm(), truth = !R.int(0, 2);
        var said = truth ? least : R.pick([0, 1, 2, 3].filter(function (j) { return j !== least; }));
        var right = cats[least] + ' has the fewest: ' + d.counts[least] + '.';
        return G.tf(who + ' says <b>' + cats[said] + '</b> was chosen the least. True or false: ' + who + ' is right.', truth, right,
          ['The last row is always the least.', 'The shortest word is the least.', 'Every choice is the same.'], { k: 'g1-dorder-tf' },
          { fig: picto(d.topic, d.counts, d.src), hint: 'Find the shortest row.' });
      }]
    ],
    'd-chance': [
      [1, 'tap', function (lv) {
        var want = R.pick(lv === 1 ? ['certain', 'impossible'] : ['certain', 'impossible', 'possible']), n = R.int(4, 8);
        var bags = R.shuffle([[n, 0], [0, n], [R.int(2, 4), R.int(2, 4)]]), ans = bags.map(function (b) { return chanceOf(b[0], b[1]); }).indexOf(want);
        return { q: 'Tap the bag where picking <b>red</b> is <b>' + want + '</b>.', type: 'tap', tiles: bags.map(function (b) { return bag(b[0], b[1]); }), answer: ans, answerText: 'the bag with ' + bags[ans][0] + ' red and ' + bags[ans][1] + ' blue',
          hint: 'Certain: all red. Impossible: no red. Possible: some red.', steps: ['Look at the counters in each bag.'],
          explain: { certain: 'All red: you are sure to get red.', impossible: 'No red: you cannot get red.', possible: 'Some red: you might get red.' }[want], meta: { k: 'g1-chance-tap' } };
      }],
      [1, 'match', function () {
        var n = R.int(4, 7), bags = [[n, 0], [0, n], [R.int(2, 4), R.int(2, 4)]];
        return { q: 'You pick one counter without looking. Match each bag to how likely <b>red</b> is.', type: 'match', pairs: bags.map(function (b) { return [bag(b[0], b[1]), chanceOf(b[0], b[1])]; }),
          hint: 'All red is certain. No red is impossible. Some red is possible.', steps: ['Look for red in each bag.'],
          explain: 'All red is certain. No red is impossible. Some red is possible.', meta: { k: 'g1-chance-match' } };
      }],
      [2, 'mistake', function () {
        var red = R.int(0, 5), blue = red ? R.int(0, 5) : R.int(3, 6), ask = R.pick(['red', 'blue']), real = ask === 'red' ? chanceOf(red, blue) : chanceOf(blue, red);
        if (!red && !blue) blue = 3;
        real = ask === 'red' ? chanceOf(red, blue) : chanceOf(blue, red);
        var who = nm(), truth = !R.int(0, 2), said = truth ? real : R.pick(['impossible', 'possible', 'certain'].filter(function (x) { return x !== real; }));
        var right = 'The bag has ' + red + ' red and ' + blue + ' blue, so getting ' + ask + ' is ' + real + '.';
        return G.tf(who + ' says getting <b>' + ask + '</b> from this bag is <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['Every colour is always possible.', 'Nothing is ever certain.', 'More counters means impossible.'], { k: 'g1-chance-tf' },
          { fig: bag(red, blue), hint: 'Look for ' + ask + ' counters in the bag.' });
      }]
    ]
  };
  Atlas.Q.shapes(CH, SHAPES);
})();
