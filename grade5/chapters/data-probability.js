(function () {
  var A = Atlas;
  var COLORS = { R: '#d64545', B: '#2f6fdb', G: '#2e9d55' }, NAMES = { R: 'Red', B: 'Blue', G: 'Green' };
  var R = A.R;
  /* stacked bar svg: groups = [{name, parts:[n...]}], cols = colours, pct = show as percent */
  function stacked(groups, cats, cols, pct) {
    var W = 470, s = '', maxT = Math.max.apply(null, groups.map(function (g) { return g.parts.reduce(function (x, y) { return x + y; }, 0); }));
    var top = pct ? 100 : Math.max(5, Math.ceil(maxT / 5) * 5), H = 200;
    for (var i = 0; i <= 5; i++) {
      var y = 220 - i * H / 5;
      s += '<line x1="56" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" style="stroke:var(--line)"/><text x="50" y="' + (y + 4) + '" text-anchor="end" font-size="15" class="t2">' + (top * i / 5) + (pct ? '%' : '') + '</text>';
    }
    groups.forEach(function (g, k) {
      var tot = g.parts.reduce(function (x, y) { return x + y; }, 0), y = 220, x = 80 + k * 130;
      g.parts.forEach(function (n, j) {
        var v = pct ? (tot ? n / tot * 100 : 0) : n, h = v / top * H;
        if (h > 0) {
          s += '<rect x="' + x + '" y="' + (y - h) + '" width="80" height="' + h + '" style="fill:' + cols[j] + ';stroke:var(--card)" stroke-width="1.5"/>';
          if (h >= 16) s += '<text x="' + (x + 40) + '" y="' + (y - h / 2 + 5) + '" text-anchor="middle" class="tb" font-size="16" style="fill:#fff">' + (pct ? Math.round(v) + '%' : n) + '</text>';
        }
        y -= h;
      });
      s += '<text x="' + (x + 40) + '" y="242" text-anchor="middle" font-size="16">' + g.name + '</text>';
    });
    s += '<line x1="56" y1="220" x2="' + (W - 10) + '" y2="220" style="stroke:var(--ink)" stroke-width="2"/>';
    cats.forEach(function (c, j) { s += '<rect x="' + (W - 92) + '" y="' + (20 + j * 24) + '" width="15" height="15" style="fill:' + cols[j] + '"/><text x="' + (W - 72) + '" y="' + (33 + j * 24) + '" font-size="15">' + c + '</text>'; });
    return A.svg(W, 250, s, 'Stacked-bar graph');
  }
  Atlas.stacked = stacked;
  var SB = ['#2f6fdb', '#2e9d55', '#c85a08'];
  /* tot people as dots, n of them filled */
  function people(n, tot) {
    var per = tot > 50 ? 20 : 10, s = '';
    for (var i = 0; i < tot; i++) s += '<circle cx="' + (14 + (i % per) * 24) + '" cy="' + (14 + Math.floor(i / per) * 24) + '" r="9" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
    return A.svg(per * 24 + 6, Math.ceil(tot / per) * 24 + 6, s, n + ' of ' + tot + ' dots filled');
  }
  /* line plot: an X for each value, stacked; optional marks [{v, label, col}] below the line */
  function dotplot(data, marks) {
    var lo = Math.floor(Math.min.apply(null, data)), hi = Math.ceil(Math.max.apply(null, data));
    if (hi - lo < 4) hi = lo + 4;
    var W = 540, X = function (v) { return 30 + (W - 60) * (v - lo) / (hi - lo); }, cnt = {}, s = '', top = 0;
    data.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; top = Math.max(top, cnt[v]); });
    var base = 26 + top * 24, seen = {};
    data.slice().sort(function (a, b) { return a - b; }).forEach(function (v) {
      seen[v] = (seen[v] || 0) + 1;
      var x = X(v), y = base - 14 - (seen[v] - 1) * 24;
      s += '<circle cx="' + x + '" cy="' + y + '" r="10" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>';
    });
    s += '<line x1="20" y1="' + base + '" x2="' + (W - 20) + '" y2="' + base + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    var step = hi - lo > 12 ? Math.ceil((hi - lo) / 10) : 1;
    for (var v = lo; v <= hi; v += step) s += '<line x1="' + X(v) + '" y1="' + (base - 6) + '" x2="' + X(v) + '" y2="' + (base + 6) + '" style="stroke:var(--ink)" stroke-width="2"/><text x="' + X(v) + '" y="' + (base + 24) + '" text-anchor="middle" font-size="16">' + v + '</text>';
    (marks || []).forEach(function (m, i) {
      var x = X(m.v), y = base + 44 + i * 22;
      s += '<path d="M' + x + ' ' + (base + 30 + i * 22) + ' l-6 9 h12z" style="fill:' + m.col + '"/><text x="' + (x + 10) + '" y="' + (y + 4) + '" font-size="16" font-weight="700" style="fill:' + m.col + '">' + m.label + '</text>';
    });
    return A.svg(W, base + 40 + (marks ? marks.length * 22 : 0), s, 'Line plot of ' + data.join(', '));
  }
  /* two bars drawn from a scale that starts at z */
  function misBars(a, b, z, title) {
    var s = '', H = 150, top = Math.max(a, b) + 2;
    [[a, 'A'], [b, 'B']].forEach(function (p, i) {
      var h = H * (p[0] - z) / (top - z), x = 70 + i * 90;
      s += '<rect x="' + x + '" y="' + (170 - h) + '" width="60" height="' + h + '" style="fill:' + (i ? 'var(--hi)' : 'var(--strand)') + ';stroke:var(--ink)" stroke-width="1.5"/><text x="' + (x + 30) + '" y="' + (164 - h) + '" text-anchor="middle" font-size="17" font-weight="700">' + p[0] + '</text><text x="' + (x + 30) + '" y="192" text-anchor="middle" font-size="16">' + p[1] + '</text>';
    });
    s += '<line x1="56" y1="170" x2="250" y2="170" style="stroke:var(--ink)" stroke-width="2"/><line x1="56" y1="20" x2="56" y2="170" style="stroke:var(--ink)" stroke-width="2"/><text x="50" y="175" text-anchor="end" font-size="16" style="fill:var(--bad)" font-weight="700">' + z + '</text><text x="150" y="14" text-anchor="middle" font-size="15" font-weight="700">' + title + '</text>';
    return A.svg(260, 200, s, 'Bars for ' + a + ' and ' + b + ' with the scale starting at ' + z);
  }
  /* four small graph types */
  function thumbs() {
    var g = function (inner, name, use) { return '<figure>' + A.svg(150, 110, '<rect x="1" y="1" width="148" height="108" rx="8" style="fill:var(--card);stroke:var(--line)"/>' + inner, name) + '<figcaption><b>' + name + '</b><br>' + use + '</figcaption></figure>'; };
    var bar = [40, 70, 55, 85].map(function (h, i) { return '<rect x="' + (20 + i * 30) + '" y="' + (98 - h) + '" width="22" height="' + h + '" style="fill:var(--strand)"/>'; }).join('');
    var st = [[30, 25, 20], [40, 20, 30]].map(function (b, i) { var y = 98, o = ''; b.forEach(function (h, j) { o += '<rect x="' + (35 + i * 50) + '" y="' + (y - h) + '" width="32" height="' + h + '" style="fill:' + SB[j] + '"/>'; y -= h; }); return o; }).join('');
    var pts = [70, 55, 62, 40, 30, 20], ln = '<polyline points="' + pts.map(function (y, i) { return (18 + i * 23) + ',' + y; }).join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="3"/>' + pts.map(function (y, i) { return '<circle cx="' + (18 + i * 23) + '" cy="' + y + '" r="4" style="fill:var(--strand)"/>'; }).join('');
    var pic = [3, 5, 2].map(function (n, r) { var o = ''; for (var i = 0; i < n; i++) o += '<circle cx="' + (24 + i * 24) + '" cy="' + (26 + r * 30) + '" r="9" style="fill:var(--hi);stroke:var(--ink)"/>'; return o; }).join('');
    return '<div class="pies thumbs">' + g(bar, 'Bar graph', 'compare categories') + g(st, 'Stacked bar', 'parts and the whole') + g(ln, 'Broken line', 'change over time') + g(pic, 'Pictograph', 'quick picture') + '</div>';
  }
  /* marbles in a bag */
  function marbles(r, b) {
    var s = '<path d="M30 30 Q20 130 110 132 Q200 130 190 30 Z" style="fill:color-mix(in srgb,var(--ink) 6%,var(--card));stroke:var(--ink2)" stroke-width="2.5"/>';
    for (var i = 0; i < r + b; i++) s += '<circle cx="' + (60 + (i % 4) * 34) + '" cy="' + (60 + Math.floor(i / 4) * 32) + '" r="13" style="fill:' + (i < r ? '#d64545' : '#2f6fdb') + ';stroke:var(--ink)" stroke-width="1.5"/>';
    return A.svg(220, 140, s, 'A bag with ' + r + ' red and ' + b + ' blue marbles');
  }
  /* probability line with a point */
  function pline(v, label) {
    var s = '<line x1="30" y1="40" x2="530" y2="40" style="stroke:var(--ink)" stroke-width="3"/>';
    [[0, '0'], [0.5, '1/2'], [1, '1']].forEach(function (t) { var x = 30 + 500 * t[0]; s += '<line x1="' + x + '" y1="30" x2="' + x + '" y2="50" style="stroke:var(--ink)" stroke-width="3"/><text x="' + x + '" y="74" text-anchor="middle" font-size="17" font-weight="700">' + t[1] + '</text>'; });
    if (v !== null) s += '<circle cx="' + (30 + 500 * v) + '" cy="40" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + (30 + 500 * v) + '" y="20" text-anchor="middle" font-size="17" font-weight="700">' + label + '</text>';
    return A.svg(560, 82, s, 'Probability line from 0 to 1' + (v !== null ? ' with ' + label + ' marked' : ''));
  }
  /* a row of coin results */
  function coins(seq) {
    return A.svg(seq.length * 46 + 6, 50, seq.split('').map(function (c, i) { return '<circle cx="' + (26 + i * 46) + '" cy="25" r="19" style="fill:' + (c === 'H' ? '#e8b400' : '#b9c3d3') + ';stroke:var(--ink)" stroke-width="1.5"/><text x="' + (26 + i * 46) + '" y="32" text-anchor="middle" font-size="19" font-weight="800" style="fill:#13203a">' + c + '</text>'; }).join(''), 'Coin results: ' + seq);
  }
  /* 12 classes, 5 students picked at random from each */
  function classes() {
    var s = '';
    for (var c = 0; c < 12; c++) {
      var cx = 6 + (c % 6) * 92, cy = 6 + Math.floor(c / 6) * 74, pick = R.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]).slice(0, 5);
      s += '<rect x="' + cx + '" y="' + cy + '" width="86" height="68" rx="6" style="fill:var(--card);stroke:var(--line)" stroke-width="1.5"/>';
      for (var i = 0; i < 25; i++) s += '<circle cx="' + (cx + 11 + (i % 5) * 16) + '" cy="' + (cy + 10 + Math.floor(i / 5) * 12) + '" r="5" style="fill:' + (pick.indexOf(i) >= 0 ? 'var(--strand)' : 'var(--line)') + '"/>';
    }
    return A.svg(560, 156, s, '12 classes of 25 students. 5 students picked at random in each class are filled in.');
  }


  /* ---------- Lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = A.kit;
  function P(id, lv) { return K.P('data-probability', id, lv); }
  function an(svg) { return '<div class="g5-anim">' + svg + '</div>'; }
  /* 100 students, 40 green; picked ones get a ring */
  function crowd(pick) {
    var s = '';
    for (var i = 0; i < 100; i++) {
      var x = 14 + (i % 20) * 26, y = 14 + Math.floor(i / 20) * 26, on = pick && pick.indexOf(i) >= 0;
      s += '<circle cx="' + x + '" cy="' + y + '" r="9" style="fill:' + (i % 5 < 2 ? 'var(--good)' : 'var(--line)') + ';stroke:' + (on ? 'var(--ink)' : 'none') + '" stroke-width="3"/>';
    }
    return A.svg(530, 136, s, '100 students, 40 of them green' + (pick ? ', ' + pick.length + ' picked' : ''));
  }
  var RAND = [3, 8, 11, 17, 22, 26, 30, 35, 41, 47, 52, 58, 61, 66, 72, 77, 80, 86, 93, 97];
  var TEAM = [0, 1, 5, 6, 10, 11, 15, 16, 20, 21, 25, 26, 30, 31, 35, 36, 40, 41, 45, 46];
  var LESSONS = [
    { id: 'sample', title: 'Samples and populations', sub: 'Asking some to learn about all.', concepts: [
      { id: 'sample', title: 'A fair sample', exp: ['D1.1'], skill: 'da-sample', hard: true,
        body: '<p>The <b>population</b> is the whole group. A <b>sample</b> is a smaller group you ask. A good sample is <b>representative</b>: it looks like the whole population.</p>',
        watch: K.watch([
          { say: '100 students. 40 of them (green) like basketball best.', fig: an(crowd()) },
          { say: 'Pick 20 students at random from everywhere.', fig: an(crowd(RAND)) },
          { say: '8 of the 20 are green: 40%. The sample matches the school.', fig: an(crowd(RAND)) },
          { say: 'Now ask only the team and its fans. All 20 are green: 100%. That sample is <b>biased</b>.', fig: an(crowd(TEAM)), ms: 2600 }
        ]),
        example: K.watch([
          { say: 'My turn. I want to know how many of these 100 students like basketball best. I cannot ask everyone, so I ask a sample of 10.', fig: an(crowd()), ms: 2400 },
          { say: 'I pick 10 students at random, from every part of the school.', fig: an(crowd([5, 9, 14, 23, 38, 45, 56, 64, 79, 91])), ms: 1800 },
          { say: '4 of my 10 are green: 40%. That matches the whole school.', fig: an(crowd([5, 9, 14, 23, 38, 45, 56, 64, 79, 91])), ms: 1800 },
          { say: 'If I asked only 10 fans at a basketball game, all 10 would be green: 100%. That sample is <b>biased</b>. A fair sample is picked at random from every part.', fig: an(crowd([50, 51, 55, 56, 60, 61, 65, 66, 70, 71])), ms: 2800 }
        ]),
        try: K.widget('data-probability', 0, 'Good. Take a few random samples. They are close to 40%, but not always exact.'),
        ways: [
          { label: 'Soup', html: '<p>To taste soup, you stir it and taste one spoonful. The spoonful is the sample. Stirring makes it fair.</p>' },
          { label: 'Whole school', html: '<p>Pick 5 students at random from each of the 12 classes. Every part of the school is in the sample.</p><div class="fig">' + classes() + '</div>' }
        ],
        key: '<p>A sample should be <b>picked at random from every part</b> of the population.</p>',
        mistake: '<p>Asking only friends or one group, which gives a <b>biased</b> sample. Ask the child "who did we leave out?"</p>',
        check: [P('da-sample', 1), P('da-sample', 2)] }
    ] },

    { id: 'relfreq', title: 'Relative frequency', sub: 'Compare to the total.', concepts: [
      { id: 'relfreq', title: 'Out of the total', exp: ['D1.2'], skill: 'da-rel',
        body: '<p><b>Frequency</b> is how many times something happens. <b>Relative frequency</b> compares it to the total, as a fraction, decimal or percent.</p>',
        watch: K.watch([
          { say: '20 students chose a sport.', fig: an(people(0, 20)) },
          { say: '8 chose soccer. The frequency is 8.', fig: an(people(8, 20)) },
          { say: 'The relative frequency is 8 out of 20: 8/20.', fig: an(A.draw.fbars([{ n: 8, d: 20, label: '8/20' }], { w: 440 })) },
          { say: '8/20 = 40/100 = <b>0.4 = 40%</b>.', fig: an(A.draw.fbars([{ n: 8, d: 20, label: '40%' }], { w: 440 })), ms: 2200 }
        ]),
        example: K.watch([
          { say: 'My turn. 25 students chose a favourite fruit.', fig: an(people(0, 25)) },
          { say: '15 chose apples. The frequency is 15.', fig: an(people(15, 25)) },
          { say: 'The relative frequency compares the count to the total: 15 out of 25, or 15/25.', fig: an(A.draw.fbars([{ n: 15, d: 25, label: '15/25' }], { w: 440 })), ms: 2000 },
          { say: 'I make the bottom 100: 15/25 = 60/100 = <b>0.6 = 60%</b>.', fig: an(A.draw.fbars([{ n: 15, d: 25, label: '60%' }], { w: 440 })), ms: 2200 }
        ]),
        try: K.widget('data-probability', 1, 'Nice. Check that the relative frequencies add up to 1.'),
        key: '<p>Relative frequency = <b>count &divide; total</b>. They always add up to 1, or 100%.</p>',
        mistake: '<p>Dividing by the wrong total, or by another count. Ask "out of how many in all?"</p>',
        check: [P('da-rel', 1), P('da-rel', 2)] }
    ] },

    { id: 'graphs', title: 'Graphs', sub: 'Choose, read and question them.', concepts: [
      { id: 'choose', title: 'Choosing a graph', exp: ['D1.3', 'D1.4'], skill: 'da-graph',
        body: '<p>Different graphs suit different data. Every graph needs a <b>title</b>, <b>labels</b>, a sensible <b>scale</b> and a <b>source</b>.</p>',
        watch: K.watch([
          { say: 'Bar graph: compare categories. Stacked bar: parts of a whole. Broken line: change over time.', fig: thumbs() },
          { say: 'How do two classes get to school? A stacked bar shows each class split into walk, bus and car.', fig: an(stacked([{ name: 'Class A', parts: [10, 8, 6] }, { name: 'Class B', parts: [6, 12, 4] }], ['walk', 'bus', 'car'], SB)) },
          { say: 'As percents, each bar is 100%. Now classes of different sizes compare fairly.', fig: an(stacked([{ name: 'Class A', parts: [10, 8, 6] }, { name: 'Class B', parts: [6, 12, 4] }], ['walk', 'bus', 'car'], SB, true)), ms: 2600 }
        ]),
        example: K.watch([
          { say: 'My turn. I will pick a graph for each question. First I look at the three kinds.', fig: thumbs(), ms: 1800 },
          { say: 'Question: how many students chose pizza, soup or salad? I am comparing categories, so I pick a <b>bar graph</b>.', fig: thumbs(), ms: 2200 },
          { say: 'Question: what part of each class walks, bikes or takes the bus? That is parts of a whole, so I pick a <b>stacked bar</b>.', fig: an(stacked([{ name: 'Class C', parts: [12, 5, 8] }, { name: 'Class D', parts: [9, 9, 2] }], ['walk', 'bike', 'bus'], SB)), ms: 2400 },
          { say: 'Last, I check it has a title, labels, a scale and a source.', fig: an(stacked([{ name: 'Class C', parts: [12, 5, 8] }, { name: 'Class D', parts: [9, 9, 2] }], ['walk', 'bike', 'bus'], SB)), ms: 2200 }
        ]),
        try: K.widget('data-probability', 2, 'Good. Switch to percents and compare the bus parts.'),
        key: '<p>Bar: compare. Stacked bar: parts of a whole. Line: change over time. Always add title, labels, scale and source.</p>',
        mistake: '<p>Leaving off the source or the labels. Before the child finishes a graph, check the four must-haves together.</p>',
        check: [P('da-graph', 1), P('da-graph', 2)] },

      { id: 'misleading', title: 'Graphs that mislead', exp: ['D1.6'], skill: 'da-graph', hard: true,
        body: '<p>A graph can use true numbers and still mislead. Check where the <b>scale starts</b>.</p>',
        watch: K.watch([
          { say: 'Two scores: 94 and 98, on a scale that starts at 0. They look almost the same.', fig: an(misBars(94, 98, 0, 'Scale from 0')) },
          { say: 'Start the scale at 80.', fig: an(misBars(94, 98, 80, 'Scale from 80')) },
          { say: 'Start it at 90. Now B looks twice as tall, but 98 is not twice 94.', fig: an(misBars(94, 98, 90, 'Scale from 90')), ms: 2600 }
        ]),
        example: K.watch([
          { say: 'My turn. Team A scored 50 points and team B scored 55. On a scale from 0, they look close.', fig: an(misBars(50, 55, 0, 'Scale from 0')), ms: 2000 },
          { say: 'Here is the same data on a scale that starts at 45. B looks twice as tall as A.', fig: an(misBars(50, 55, 45, 'Scale from 45')), ms: 2000 },
          { say: 'I check the scale. It starts at 45, not 0. 55 is only 5 more than 50, not twice as much.', fig: an(misBars(50, 55, 45, 'Scale from 45')), ms: 2200 },
          { say: 'Before I trust a graph, I check its <b>title, labels, scale and source</b>.', fig: an(misBars(50, 55, 0, 'Scale from 0')), ms: 2200 }
        ]),
        try: K.widget('data-probability', 3, 'Nice. The numbers never change. Only the picture does.'),
        ways: [
          { label: 'Side by side', html: '<div class="pies"><figure>' + misBars(94, 98, 90, 'Scale from 90') + '<figcaption>misleading</figcaption></figure><figure>' + misBars(94, 98, 0, 'Scale from 0') + '<figcaption>honest</figcaption></figure></div>' },
          { label: 'Checklist', html: '<p>Does the scale start at 0? Are the gaps even? Are there labels and a source? Are pictures the same size?</p>' }
        ],
        key: '<p>Before you trust a graph, check its <b>title, labels, scale and source</b>.</p>',
        mistake: '<p>Comparing bar heights without reading the scale. Cover the bars and compare the numbers first.</p>',
        check: [P('da-graph', 3), P('da-graph', 2)] }
    ] },

    { id: 'average', title: 'Mean, median and mode', sub: 'Describing data with one number.', concepts: [
      { id: 'mmm', title: 'Mean, median and mode', exp: ['D1.5'], skill: 'da-mmm', hard: true,
        body: '<p><b>Mean</b>: the fair share. <b>Median</b>: the middle value in order. <b>Mode</b>: the most common value.</p>',
        watch: K.watch([
          { say: 'Data: 3, 5, 5, 7, 10.', fig: an(dotplot([3, 5, 5, 7, 10])) },
          { say: 'In order, the middle value is 5: the <b>median</b>. 5 appears twice: the <b>mode</b>.', fig: an(dotplot([3, 5, 5, 7, 10], [{ v: 5, label: 'median and mode: 5', col: 'var(--pm1)' }])) },
          { say: 'Add them: 30. Share equally among 5 values: 30 &divide; 5 = 6, the <b>mean</b>.', fig: an(dotplot([3, 5, 5, 7, 10], [{ v: 5, label: 'median and mode: 5', col: 'var(--pm1)' }, { v: 6, label: 'mean: 6', col: 'var(--strand)' }])) },
          { say: 'One big value pulls the mean. For 2, 4, 5, 9, 20 the mean is 8 but the median is 5.', fig: an(dotplot([2, 4, 5, 9, 20], [{ v: 5, label: 'median 5', col: 'var(--pm1)' }, { v: 8, label: 'mean 8', col: 'var(--strand)' }])), ms: 2800 }
        ]),
        example: K.watch([
          { say: 'My turn. Data: 2, 4, 4, 6, 9. They are already in order.', fig: an(dotplot([2, 4, 4, 6, 9])), ms: 1600 },
          { say: 'The middle value is 4: the <b>median</b>. 4 appears twice: the <b>mode</b>.', fig: an(dotplot([2, 4, 4, 6, 9], [{ v: 4, label: 'median and mode: 4', col: 'var(--pm1)' }])), ms: 2000 },
          { say: 'I add them: 2 + 4 + 4 + 6 + 9 = 25. I share it among 5 values: 25 &divide; 5 = 5, the <b>mean</b>.', fig: an(dotplot([2, 4, 4, 6, 9], [{ v: 4, label: 'median and mode: 4', col: 'var(--pm1)' }, { v: 5, label: 'mean: 5', col: 'var(--strand)' }])), ms: 2400 },
          { say: 'The <b>range</b> is biggest minus smallest: 9 &minus; 2 = 7.', fig: an(dotplot([2, 4, 4, 6, 9], [{ v: 4, label: 'median and mode: 4', col: 'var(--pm1)' }, { v: 5, label: 'mean: 5', col: 'var(--strand)' }])), ms: 2200 }
        ]),
        try: K.widget('data-probability', 4, 'Good. Add one very big number and watch the mean move.'),
        ways: [
          { label: 'Fair share', html: '<p>Mean: 3 friends have 2, 4 and 9 stickers. Pool them (15) and share equally: 5 each.</p>' },
          { label: 'Line up', html: '<p>Median: line the values up from smallest to biggest and point to the middle one. With two middles, take the number halfway between.</p>' },
          { label: 'Most popular', html: '<p>Mode: the value that shows up most. There can be no mode, or more than one.</p>' }
        ],
        key: '<p>Mean = total &divide; how many. Median = middle in order. Mode = most often. Range = biggest &minus; smallest.</p>',
        mistake: '<p>Finding the median without putting the data in order first, or dividing the total by the wrong count. Have the child order the data and count the values aloud.</p>',
        check: [P('da-mmm', 1), P('da-mmm', 2)] }
    ] },

    { id: 'prob', title: 'Probability', sub: 'How likely is it?', concepts: [
      { id: 'chance', title: 'Probability as a fraction', exp: ['D2.1'], skill: 'da-prob',
        body: '<p><b>Probability</b> runs from 0 (impossible) to 1 (certain). Probability = ways it can happen &divide; equally likely outcomes.</p>',
        watch: K.watch([
          { say: 'A bag has 3 red and 5 blue marbles.', fig: an(marbles(3, 5)) },
          { say: '8 marbles in all, so 8 equally likely outcomes.', fig: an(marbles(3, 5)) },
          { say: '3 ways to get red: P(red) = <b>3/8</b>.', fig: an(pline(3 / 8, '3/8')) },
          { say: '3/8 is less than 1/2, so red is <b>unlikely</b>.', fig: an(pline(3 / 8, '3/8')), ms: 2200 }
        ]),
        example: K.watch([
          { say: 'My turn. A bag has 4 red and 2 blue marbles. What is the probability of red?', fig: an(marbles(4, 2)), ms: 1800 },
          { say: 'I count all the outcomes: 6 marbles, all equally likely.', fig: an(marbles(4, 2)) },
          { say: 'There are 4 ways to get red. P(red) = ways &divide; all outcomes = <b>4/6</b>.', fig: an(pline(4 / 6, '4/6')), ms: 2000 },
          { say: '4/6 is more than 1/2, so red is <b>likely</b>.', fig: an(pline(4 / 6, '4/6')), ms: 2200 }
        ]),
        try: K.widget('data-probability', 5, 'Nice. Make red certain, then impossible.'),
        key: '<p>P = <b>ways it can happen &divide; all equally likely outcomes</b>.</p>',
        mistake: '<p>Comparing red to blue (3/5) instead of red to all (3/8). Ask "how many marbles in the whole bag?"</p>',
        check: [P('da-prob', 1), P('da-prob', 2)] },

      { id: 'experiment', title: 'Expected and actual results', exp: ['D2.2'], skill: 'da-exp', hard: true,
        body: '<p><b>Theoretical</b> probability is what should happen. <b>Experimental</b> results are what did happen. With more trials, they usually get closer.</p>',
        watch: K.watch([
          { say: 'A coin should land heads half the time: 1/2.', fig: an(pline(0.5, '1/2')) },
          { say: 'Flip it 10 times: 7 heads. That is 7/10, not 5/10.', fig: an(coins('HTHHHTHHTH')) },
          { say: 'That does not mean the coin is unfair. Small samples wobble.', fig: an(pline(0.7, '7/10')) },
          { say: 'Over 1000 flips the share of heads gets much closer to 1/2.', fig: an(pline(0.51, '510/1000')), ms: 2400 }
        ]),
        example: K.watch([
          { say: 'My turn. A number cube has 6 faces. The chance of rolling a 6 is 1/6.', fig: an(pline(1 / 6, '1/6')), ms: 1800 },
          { say: 'I roll it 12 times and get a 6 four times. That is 4/12, not the 2/12 I expected.', fig: an(pline(4 / 12, '4/12')), ms: 2200 },
          { say: 'That does not mean the cube is unfair. Small samples wobble.', fig: an(pline(4 / 12, '4/12')), ms: 1800 },
          { say: 'With 600 rolls I get 102 sixes. That is much closer to 1/6. More trials usually bring results closer.', fig: an(pline(102 / 600, '102/600')), ms: 2600 }
        ]),
        try: K.widget('data-probability', 5, 'Good. Spin 100 a few times and compare to the expected fractions.'),
        ways: [
          { label: 'Spinner', html: '<p>A spinner with 3 equal sections should land on each about 1/3 of the time. In 9 spins you might get 4, 3 and 2. In 900 spins, each will be close to 300.</p>' },
          { label: 'Weather', html: '<p>"30% chance of rain" does not promise dry weather. It means that on days like this, it rains about 3 days in 10.</p>' }
        ],
        key: '<p>Experimental results are <b>rarely exact</b>. More trials usually bring them closer to the theoretical probability.</p>',
        mistake: '<p>Deciding a coin or spinner is unfair after only a few tries. Run more trials together and watch the results settle.</p>',
        check: [P('da-exp', 1), P('da-exp', 2)] }
    ] }
  ];
  A.register('data-probability', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Samples and populations</h2>' +
'<p>The <b>population</b> is the whole group you want to know about, like every student in your school. Asking everyone takes a long time, so we often ask a <b>sample</b>: a smaller group from the population. A good sample is <b>representative</b>: it is like the whole population.</p>' +
'<div class="lab"><span class="lt">Try it: take a sample</span>' +
'<p style="margin-top:0">100 students. 40 of them (green) like basketball best. Pick a sample and see what it says.</p>' +
'<div class="ctrl"><label for="ssz">Sample size: <output id="sszo"></output><input type="range" id="ssz" min="5" max="50" step="5" value="20"></label>' +
'<label for="sty">How the sample is picked<select id="sty"><option value="r">at random</option><option value="b">only the team and its fans</option></select></label>' +
'<button type="button" class="btn" id="sgo">Take a sample</button></div>' +
'<div class="fig" id="sgfig"></div><div class="out" id="sgout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Asking only people who are like you. A sample of your friends, or of one team, is <b>biased</b>. Its results can be far from the truth.</p></div>' +
'<div class="eg"><p><b>Example.</b> To find the favourite lunch at a school of 300 students, survey 5 students picked at random from each of the 12 classes. That is a sample of 60 students from every part of the school.</p><div class="fig">' + classes() + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Relative-frequency tables</h2>' +
'<p>A <b>frequency</b> is how many times something happens. A <b>relative frequency</b> compares that to the total. It can be a fraction, a decimal or a percent. Relative frequency lets you compare groups of different sizes.</p>' +
'<div class="lab"><span class="lt">Try it: build the table</span>' +
'<div class="ctrl" id="rfin"></div><div class="tbl" id="rftbl"></div><div class="out" id="rfout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The relative frequencies always add up to 1, or 100%. If they do not, check your counting.</p></div>' +
'<div class="eg"><p><b>Example.</b> 20 students chose a sport and 8 chose soccer. The relative frequency of soccer is 8/20 = 0.4 = <b>40%</b>.</p><div class="fig">' + people(8, 20) + '</div><div class="fig">' + A.draw.fbars([{ n: 8, d: 20, label: '8/20' }], { w: 440 }) + '</div><p class="t2">8 of the 20 dots, or 40% of the bar.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Choosing a graph</h2>' +
thumbs() +
'<p>Every graph needs a <b>title</b>, <b>labels</b> on both axes, a sensible <b>scale</b>, and a <b>source</b> that says where the data came from.</p>' +
'<div class="lab"><span class="lt">Try it: stacked-bar graph</span>' +
'<p style="margin-top:0">How students get to school, in two classes.</p>' +
'<div class="ctrl" id="sbin"></div><div class="ctrl"><label for="sbm">Show<select id="sbm"><option value="n">counts</option><option value="p">percents (each bar = 100%)</option></select></label></div>' +
'<div class="fig" id="sbfig"></div><div class="out" id="sbout"></div></div>' +
'<div class="eg"><p><b>Example.</b> To compare how two classes get to school, a stacked-bar graph shows each class as one bar, split into walk, bus and car.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Leaving off the source. Readers need to know where the data came from to decide whether to trust it.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Misleading graphs and infographics</h2>' +
'<p>A graph can tell the truth with the numbers and still mislead. Watch for a scale that does not start at 0, uneven gaps on the scale, missing labels, and pictures of different sizes.</p>' +
'<div class="lab"><span class="lt">Try it: move the start of the scale</span>' +
'<div class="ctrl"><label for="mz">Scale starts at: <output id="mzo"></output><input type="range" id="mz" min="0" max="90" step="10" value="0"></label></div>' +
'<div class="fig" id="mfig"></div><div class="out" id="mout"></div></div>' +
'<p>An <b>infographic</b> tells a story about data on one page. It mixes graphs, tables, short facts and pictures. A good one has a clear title, a source, and one main message.</p>' +
'<div class="eg"><p><b>Example.</b> A scale starts at 90. Bars for 94 and 98 make one look twice as tall as the other. With the scale starting at 0, they look almost the same.</p><div class="pies"><figure>' + misBars(94, 98, 90, 'Scale from 90') + '<figcaption>misleading</figcaption></figure><figure>' + misBars(94, 98, 0, 'Scale from 0') + '<figcaption>honest</figcaption></figure></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Before you trust a graph, check its title, labels, scale and source.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Mean, median and mode</h2>' +
'<div class="fig">' + dotplot([3, 5, 5, 7, 10], [{ v: 5, label: 'median and mode: 5', col: 'var(--pm1)' }, { v: 6, label: 'mean: 6 (the balance point)', col: 'var(--strand)' }]) + '</div>' +
'<ul><li><b>Mean:</b> the fair share. Add everything, then divide by how many numbers there are.</li>' +
'<li><b>Median:</b> the middle number when the data is in order. With two middle numbers, take the number halfway between.</li>' +
'<li><b>Mode:</b> the number that shows up most often. There can be no mode, or more than one.</li>' +
'<li><b>Range:</b> biggest minus smallest.</li></ul>' +
'<p>The data can include decimals, like race times in seconds: 12.4, 13.1, 12.9.</p>' +
'<div class="lab"><span class="lt">Try it: your own data</span>' +
'<div class="ctrl"><label for="ds">Numbers, separated by commas<input type="text" id="ds" value="4, 8, 6, 10, 7, 6" autocomplete="off" style="width:min(22em,100%)"></label></div>' +
'<div class="fig" id="dfig"></div><div class="out" id="dout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>One very big or very small number pulls the mean toward it. The median stays in the middle. For 2, 4, 5, 9, 20 the mean is 8 but the median is 5.</p><div class="fig">' + dotplot([2, 4, 5, 9, 20], [{ v: 5, label: 'median 5', col: 'var(--pm1)' }, { v: 8, label: 'mean 8, pulled toward 20', col: 'var(--strand)' }]) + '</div></div>' +
'<div class="eg"><p><b>Example.</b> Data: 3, 5, 5, 7, 10. Mean: 30 &divide; 5 = 6. Median: 5. Mode: 5. Range: 10 &minus; 3 = 7.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Probability</h2>' +
'<p><b>Probability</b> measures how likely an event is, from 0 (impossible) to 1 (certain). Write it as a fraction:</p>' +
'<p style="text-align:center"><b>probability = number of ways it can happen &divide; number of equally likely outcomes</b></p>' +
'<div class="fig">' + A.svg(520, 96,
  '<line x1="30" y1="40" x2="490" y2="40" style="stroke:var(--ink)" stroke-width="3"/>' +
  [[30, '0', 'impossible'], [260, '1/2', 'equally likely'], [490, '1', 'certain']].map(function (t) {
    return '<line x1="' + t[0] + '" y1="30" x2="' + t[0] + '" y2="50" style="stroke:var(--ink)" stroke-width="3"/><text x="' + t[0] + '" y="72" text-anchor="middle" class="tb">' + t[1] + '</text><text x="' + Math.min(Math.max(t[0], 50), 470) + '" y="90" text-anchor="middle" class="t2" font-size="15">' + t[2] + '</text>';
  }).join('') + '<text x="145" y="26" text-anchor="middle" class="t2" font-size="15">unlikely</text><text x="375" y="26" text-anchor="middle" class="t2" font-size="15">likely</text>', 'Probability number line from 0 to 1') + '</div>' +
'<div class="lab"><span class="lt">Try it: design a spinner</span>' +
'<div class="ctrl"><label for="sr">Red sections<select id="sr"><option>0</option><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option></select></label>' +
'<label for="sb">Blue sections<select id="sb"><option>0</option><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></label>' +
'<label for="sg">Green sections<select id="sg"><option>0</option><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option></select></label></div>' +
'<div class="ctrl"><button type="button" class="btn" id="sp1">Spin 1</button><button type="button" class="btn" id="sp10">Spin 10</button><button type="button" class="btn" id="sp100">Spin 100</button><button type="button" class="btn alt" id="sp0">Clear</button></div>' +
'<div class="fig" id="sfig"></div><div class="tbl" id="stbl"></div><p id="snote"></p></div>' +
'<p>The more times you spin, the closer the experimental results usually get to the theoretical probability, but they are rarely exactly equal.</p>' +
'<div class="eg"><p><b>Example.</b> A bag has 3 red and 5 blue marbles. The probability of red is 3/8. That is less than 1/2, so red is unlikely.</p><div class="fig">' + marbles(3, 5) + '</div><div class="fig">' + pline(3 / 8, '3/8') + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Expecting results to match exactly. A coin flipped 10 times can land heads 7 times. That does not mean the coin is unfair.</p><div class="fig">' + coins('HTHHHTHHTH') + '</div><p class="t2">7 heads in 10 flips. Over 1000 flips, the share of heads gets much closer to 1/2.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      /* sampling */
      var pop = [];
      for (var i = 0; i < 100; i++) pop.push(i < 40);
      pop = R.shuffle(pop);
      var picked = [];
      function sdraw() {
        var n = +$('#ssz', root).value, s0 = '';
        $('#sszo', root).textContent = n;
        for (var i = 0; i < 100; i++) {
          var x = 14 + (i % 20) * 22, y = 14 + Math.floor(i / 20) * 22, on = picked.indexOf(i) >= 0;
          s0 += '<circle cx="' + x + '" cy="' + y + '" r="8" style="fill:' + (pop[i] ? 'var(--strand)' : 'var(--card)') + ';stroke:' + (on ? 'var(--bad)' : 'var(--ink)') + '" stroke-width="' + (on ? 4 : 1.2) + '"/>';
        }
        $('#sgfig', root).innerHTML = A.svg(450, 118, s0, '100 students, 40 shaded green. Students in the sample have a thick red ring.');
        if (!picked.length) { $('#sgout', root).innerHTML = '<p>Press <b>Take a sample</b>.</p>'; return; }
        var yes = picked.filter(function (i) { return pop[i]; }).length;
        $('#sgout', root).innerHTML = '<p><span class="big">' + yes + ' of ' + picked.length + ' = ' + Math.round(yes / picked.length * 100) + '%</span> of the sample like basketball best.</p>' +
          '<p>The real answer for all 100 students is 40%. ' + ($('#sty', root).value === 'b' ? 'This sample is biased, so it is far too high.' : 'A random sample is usually close. Bigger samples are usually closer.') + '</p>';
      }
      function take() {
        var n = +$('#ssz', root).value, ids = [];
        for (var i = 0; i < 100; i++) ids.push(i);
        if ($('#sty', root).value === 'b') {
          var fans = ids.filter(function (i) { return pop[i]; }), rest = ids.filter(function (i) { return !pop[i]; });
          var nf = Math.min(fans.length, Math.round(n * 0.85));
          picked = R.shuffle(fans).slice(0, nf).concat(R.shuffle(rest).slice(0, n - nf));
        } else picked = R.shuffle(ids).slice(0, n);
        sdraw();
      }
      $('#sgo', root).addEventListener('click', take);
      $('#ssz', root).addEventListener('input', function () { picked = []; sdraw(); });
      $('#sty', root).addEventListener('change', function () { picked = []; sdraw(); });
      sdraw();

      /* relative frequency */
      var rc = ['Soccer', 'Hockey', 'Swimming', 'Other'], rv = [8, 6, 4, 2], inp = '';
      rc.forEach(function (c, i) { inp += '<label for="rf' + i + '">' + c + '<input type="number" id="rf' + i + '" min="0" max="100" value="' + rv[i] + '"></label>'; });
      $('#rfin', root).innerHTML = inp;
      function rf() {
        var v = rc.map(function (c, i) { return Math.max(0, Math.min(100, parseInt($('#rf' + i, root).value, 10) || 0)); }), tot = v.reduce(function (x, y) { return x + y; }, 0);
        if (!tot) { $('#rftbl', root).innerHTML = ''; $('#rfout', root).innerHTML = '<p>Enter at least one count.</p>'; return; }
        var t = '<table><thead><tr><th class="l">Sport</th><th>Frequency</th><th>Fraction</th><th>Decimal</th><th>Percent</th></tr></thead><tbody>';
        v.forEach(function (n, i) {
          var d = n / tot;
          t += '<tr><td class="l">' + rc[i] + '</td><td>' + n + '</td><td>' + n + '/' + tot + '</td><td>' + (Math.round(d * 100) / 100).toFixed(2) + '</td><td>' + (Math.round(d * 1000) / 10) + '%</td></tr>';
        });
        $('#rftbl', root).innerHTML = t + '<tr><th class="l">Total</th><th>' + tot + '</th><th>' + tot + '/' + tot + '</th><th>1.00</th><th>100%</th></tr></tbody></table>';
        var exact = v.every(function (n) { return (n * 100) % tot === 0; });
        $('#rfout', root).innerHTML = exact ? '<p>The relative frequencies add up to exactly 1, or 100%.</p>' : '<p>Some decimals and percents are rounded, so the column may not add up to exactly 100.</p>';
      }
      A.bind(root, ['rf0', 'rf1', 'rf2', 'rf3'], rf);

      /* stacked bar */
      var sc = ['Walk', 'Bus', 'Car'], sv = [[12, 8, 6], [5, 14, 9]], si = '';
      ['Class A', 'Class B'].forEach(function (g, k) { sc.forEach(function (c, j) { si += '<label for="sb' + k + j + '">' + g + ': ' + c + '<input type="number" id="sb' + k + j + '" min="0" max="40" value="' + sv[k][j] + '"></label>'; }); });
      $('#sbin', root).innerHTML = si;
      function sb() {
        var g = [0, 1].map(function (k) { return { name: k ? 'Class B' : 'Class A', parts: [0, 1, 2].map(function (j) { return Math.max(0, Math.min(40, parseInt($('#sb' + k + j, root).value, 10) || 0)); }) }; });
        var pct = $('#sbm', root).value === 'p';
        $('#sbfig', root).innerHTML = stacked(g, sc, SB, pct) + '<p class="t2" style="font-size:.85rem;text-align:center;margin:0">Title: How we get to school. Source: class survey.</p>';
        var t0 = g[0].parts.reduce(function (x, y) { return x + y; }, 0), t1 = g[1].parts.reduce(function (x, y) { return x + y; }, 0);
        $('#sbout', root).innerHTML = '<p>Class A has ' + t0 + ' students and Class B has ' + t1 + '. ' + (pct ? 'As percents, each bar is the same height, so you can compare the parts fairly even when class sizes differ.' : 'Bar heights show the class sizes. Switch to percents to compare the classes fairly.') + '</p>';
      }
      A.bind(root, ['sb00', 'sb01', 'sb02', 'sb10', 'sb11', 'sb12', 'sbm'], sb);

      /* misleading scale */
      function mis() {
        var z = +$('#mz', root).value, v = [96, 100], names = ['Brand A', 'Brand B'], s0 = '', H = 180;
        $('#mzo', root).textContent = z;
        for (var i = 0; i <= 5; i++) {
          var val = z + (100 - z) * i / 5, y = 200 - i * H / 5;
          s0 += '<line x1="56" y1="' + y + '" x2="320" y2="' + y + '" style="stroke:var(--line)"/><text x="50" y="' + (y + 4) + '" text-anchor="end" font-size="12" class="t2">' + Math.round(val) + '</text>';
        }
        v.forEach(function (n, k) {
          var h = (n - z) / (100 - z) * H, x = 90 + k * 120;
          s0 += '<rect x="' + x + '" y="' + (200 - h) + '" width="70" height="' + h + '" style="fill:var(--strand)"/><text x="' + (x + 35) + '" y="' + (195 - h) + '" text-anchor="middle" class="tb" font-size="13">' + n + '</text><text x="' + (x + 35) + '" y="218" text-anchor="middle" font-size="13">' + names[k] + '</text>';
        });
        s0 += '<line x1="56" y1="200" x2="320" y2="200" style="stroke:var(--ink)" stroke-width="2"/><text x="190" y="14" text-anchor="middle" class="tb" font-size="13">Battery life (hours)</text>';
        $('#mfig', root).innerHTML = A.svg(330, 226, s0, 'Bar graph with the scale starting at ' + z);
        var ratio = (100 - z) / (96 - z);
        $('#mout', root).innerHTML = '<p>The real difference is only 4 hours out of about 100. ' + (z === 0 ? 'With the scale starting at 0, the bars look almost the same, which is honest.' : 'With the scale starting at ' + z + ', Brand B&rsquo;s bar looks ' + (Math.round(ratio * 10) / 10) + ' times as tall. That is misleading.') + '</p>';
      }
      A.bind(root, ['mz'], mis);

      /* mean / median / mode */
      function stats() {
        var raw = $('#ds', root).value.split(/[,\s]+/).filter(Boolean).map(Number), o = $('#dout', root), f = $('#dfig', root);
        if (raw.length < 1 || raw.length > 20 || raw.some(function (x) { return isNaN(x) || x < 0 || x > 1000; })) {
          f.innerHTML = ''; o.innerHTML = '<p>Type 1 to 20 numbers between 0 and 1000, separated by commas.</p>'; return;
        }
        var a = raw.slice().sort(function (x, y) { return x - y; }), n = a.length;
        var sum = a.reduce(function (x, y) { return x + y; }, 0), mean = sum / n;
        var med = n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
        var cnt = {}, best = 0;
        a.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; best = Math.max(best, cnt[x]); });
        var modes = Object.keys(cnt).filter(function (k) { return cnt[k] === best; });
        var modeTxt = best === 1 ? 'no mode (every number appears once)' : modes.join(' and ');
        function r(x) { return String(Math.round(x * 100) / 100); }
        var allInt = a.every(function (x) { return Number.isInteger(x); }) && a[n - 1] <= 30;
        if (allInt) {
          var mxv = a[n - 1], w = Math.max(300, (mxv + 2) * 22), s = '', top = best;
          for (var i = 0; i <= mxv; i++) {
            var x = 20 + i * 20 + 10;
            s += '<text x="' + x + '" y="' + (top * 18 + 40) + '" text-anchor="middle" font-size="12">' + i + '</text>';
            for (var k = 0; k < (cnt[i] || 0); k++) s += '<circle cx="' + x + '" cy="' + (top * 18 + 10 - k * 18) + '" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>';
          }
          s += '<line x1="20" y1="' + (top * 18 + 22) + '" x2="' + (20 + (mxv + 1) * 20 + 10) + '" y2="' + (top * 18 + 22) + '" style="stroke:var(--ink)" stroke-width="2"/>';
          f.innerHTML = A.svg(Math.max(300, 60 + (mxv + 1) * 20), top * 18 + 48, s, 'Dot plot of the data');
        } else f.innerHTML = '';
        o.innerHTML = '<p>In order: <span class="math">' + a.join(', ') + '</span></p>' +
          '<p><b>Mean</b> = ' + sum + ' &divide; ' + n + ' = <b>' + r(mean) + '</b> &nbsp; <b>Median</b> = <b>' + r(med) + '</b> &nbsp; <b>Mode</b> = <b>' + modeTxt + '</b> &nbsp; <b>Range</b> = ' + r(a[n - 1] - a[0]) + '</p>';
      }
      A.bind(root, ['ds'], stats);

      /* spinner */
      var tally = { R: 0, B: 0, G: 0 }, total = 0, last = -1;
      function secs() {
        var arr = [];
        ['R', 'B', 'G'].forEach(function (c) {
          var n = +$('#s' + c.toLowerCase(), root).value;
          for (var i = 0; i < n; i++) arr.push(c);
        });
        return arr;
      }
      function draw() {
        var arr = secs(), N = arr.length, s = '', cx = 100, cy = 100, rr = 90;
        if (N === 0) { $('#sfig', root).innerHTML = '<p>Add at least one section.</p>'; $('#stbl', root).innerHTML = ''; return; }
        if (N === 1) s += '<circle cx="100" cy="100" r="90" style="fill:' + COLORS[arr[0]] + ';stroke:var(--ink)" stroke-width="3"/><text x="100" y="108" text-anchor="middle" font-size="26" class="tb" style="fill:#fff">' + arr[0] + '</text>';
        else arr.forEach(function (c, i) {
          var a0 = (-90 + i * 360 / N) * Math.PI / 180, a1 = (-90 + (i + 1) * 360 / N) * Math.PI / 180, am = (a0 + a1) / 2;
          var p = 'M' + cx + ',' + cy + ' L' + (cx + rr * Math.cos(a0)) + ',' + (cy + rr * Math.sin(a0)) + ' A' + rr + ',' + rr + ' 0 0 1 ' + (cx + rr * Math.cos(a1)) + ',' + (cy + rr * Math.sin(a1)) + ' Z';
          s += '<path d="' + p + '" style="fill:' + COLORS[c] + ';stroke:' + (i === last ? 'var(--hi)' : 'var(--ink)') + '" stroke-width="' + (i === last ? 6 : 2) + '"/>' +
            '<text x="' + (cx + 60 * Math.cos(am)) + '" y="' + (cy + 60 * Math.sin(am) + 6) + '" text-anchor="middle" class="tb" font-size="18" style="fill:#fff">' + c + '</text>';
        });
        $('#sfig', root).innerHTML = A.svg(200, 200, s, 'Spinner with ' + N + ' equal sections');
        var t = '<table><thead><tr><th class="l">Colour</th><th>Theoretical</th><th>Spins</th><th>Experimental</th></tr></thead><tbody>';
        ['R', 'B', 'G'].forEach(function (c) {
          var n = arr.filter(function (x) { return x === c; }).length, g = n ? A.gcd(n, N) : 1;
          t += '<tr><td class="l"><b>' + NAMES[c] + '</b></td><td>' + n + '/' + N + (n && g > 1 ? ' = ' + (n / g) + '/' + (N / g) : '') + '</td><td>' + tally[c] + '</td><td>' + tally[c] + '/' + total + (total ? ' &#8776; ' + (Math.round(tally[c] / total * 100) / 100).toFixed(2) : '') + '</td></tr>';
        });
        $('#stbl', root).innerHTML = t + '</tbody></table>';
        $('#snote', root).innerHTML = total ? 'Total spins: <b>' + total + '</b>. The yellow outline marks the latest result.' : 'Press a Spin button to start.';
      }
      function spin(times) {
        var arr = secs(); if (!arr.length) return;
        for (var i = 0; i < times; i++) { last = Math.floor(Math.random() * arr.length); tally[arr[last]]++; total++; }
        draw();
      }
      function reset() { tally = { R: 0, B: 0, G: 0 }; total = 0; last = -1; draw(); }
      ['sr', 'sb', 'sg'].forEach(function (id) { $('#' + id, root).addEventListener('change', reset); });
      $('#sp1', root).addEventListener('click', function () { spin(1); });
      $('#sp10', root).addEventListener('click', function () { spin(10); });
      $('#sp100', root).addEventListener('click', function () { spin(100); });
      $('#sp0', root).addEventListener('click', reset);
      draw();
    },

    quiz: [
      { q: 'A school wants to know which lunch students like best. Which sample is most likely to be representative?', type: 'mc', options: ['The 20 students in the pizza club', '5 students picked at random from every class', 'The teachers', 'Only the Grade 8 students'], answer: 1, hint: 'A good sample is like the whole school.', explain: 'Picking at random from every class gives every student a fair chance to be asked.' },
      { q: 'In a survey of 25 students, 10 chose soccer. What is the relative frequency of soccer as a percent?', type: 'num', answer: 40, unit: '%', fig: people(10, 25), hint: 'Write 10/25 as a fraction out of 100.', explain: '10/25 = 40/100 = 40%.' },
      { q: 'Which graph is best for showing how the temperature changed over one week?', type: 'mc', options: ['Broken-line graph', 'Stacked-bar graph', 'Pictograph', 'Tally chart'], answer: 0, fig: thumbs(), hint: 'The data changes over time.', explain: 'A broken-line graph shows change over time.' },
      { q: 'Find the mean: <span class="math">4, 8, 6, 10, 7</span>', type: 'num', answer: 7, fig: dotplot([4, 8, 6, 10, 7]), hint: 'Add them up, then divide by 5.', explain: '35 &divide; 5 = 7.' },
      { q: 'Find the median: <span class="math">12.5, 11.8, 13.2, 12.1, 14.0</span>', type: 'num', answer: 12.5, hint: 'Put the numbers in order first.', explain: 'In order: 11.8, 12.1, 12.5, 13.2, 14.0. The middle number is 12.5.' },
      { q: 'A spinner has 8 equal sections and 3 are red. What is the probability of landing on red?', type: 'mc', options: ['3/5', '3/8', '5/8', '1/3'], answer: 1, fig: A.draw.pie(3, 8, 56, 'Spinner with 8 sections, 3 red', '#d64545'), hint: 'Red sections over all sections.', explain: '3 red out of 8 sections is 3/8.' },
      { q: 'You roll a standard die 60 times. About how many times would you expect to roll a 3?', type: 'num', answer: 10, unit: 'times', hint: 'The probability of a 3 is 1/6.', explain: '1/6 of 60 is 10. The real count will often be a little more or less.' }
    ],

    quick: ['da-sample', 'da-rel', 'da-graph', 'da-graph', 'da-mmm', 'da-prob'],

    practice: [
      { id: 'da-sample', name: 'Samples and populations', code: 'D1.1', gen: function (lv) {
        var topic = R.pick([['which after-school club to add', 'students at the school'], ['the most popular fruit for snack day', 'students at the school'], ['how people in town get to work', 'adults in the town']]);
        var good = lv === 1 ? 'People picked at random from all the ' + topic[1] : R.pick(['Every 10th name on a list of all the ' + topic[1], 'People picked at random from all the ' + topic[1]]);
        var bad = ['Only your close friends', 'Only people who are already in one club', 'Only people at one bus stop at 8 a.m.', 'Only the first 3 people you see'];
        var o = R.mc(good, R.shuffle(bad));
        return { q: 'You want to know ' + topic[0] + '. The population is all the ' + topic[1] + '. Which sample is most likely to be <b>representative</b>?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'A representative sample gives everyone in the population a fair chance to be picked.',
          steps: ['The population is all the ' + topic[1] + '.', 'A sample is biased if it only includes one kind of person.', 'The best choice is: ' + good.toLowerCase() + '.'],
          explain: 'Choosing fairly from the whole population makes the sample most like the population.' };
      } },
      { id: 'da-rel', name: 'Relative frequency', code: 'D1.2', gen: function (lv) {
        var tot = R.pick(lv === 1 ? [10, 20, 50, 100] : [20, 25, 50]), n = R.int(1, tot - 1);
        var pct = n * 100 / tot, asDec = lv === 3;
        var cat = R.pick(['chose apples', 'walk to school', 'have a pet', 'play an instrument']);
        return { q: 'In a survey of ' + tot + ' students, ' + n + ' ' + cat + '. What is the relative frequency as a ' + (asDec ? 'decimal' : 'percent') + '?', type: 'num', answer: asDec ? A.clean(pct / 100) : pct, unit: asDec ? '' : '%',
          fig: tot <= 50 ? people(n, tot) : A.draw.grid(n, 16), hint: 'Start with the fraction ' + n + '/' + tot + '. Make it out of 100.',
          steps: ['Relative frequency = ' + n + '/' + tot + '.', 'Multiply top and bottom by ' + A.clean(100 / tot) + ' to get ' + pct + '/100.', pct + '/100 = ' + (asDec ? A.clean(pct / 100) : pct + '%') + '.'],
          explain: n + '/' + tot + ' = ' + pct + '/100 = ' + A.clean(pct / 100) + ' = ' + pct + '%.' };
      } },
      { id: 'da-graph', name: 'Read graphs, spot misleading ones', code: 'D1.3, D1.6', gen: function (lv) {
        if (lv < 3) {
          var g = [{ name: 'Gr 5', parts: [R.int(3, 12), R.int(3, 12), R.int(3, 12)] }, { name: 'Gr 6', parts: [R.int(3, 12), R.int(3, 12), R.int(3, 12)] }];
          var ask = R.int(0, 1), part = R.int(0, 2), cats = ['Walk', 'Bus', 'Car'], tot = g[ask].parts.reduce(function (x, y) { return x + y; }, 0);
          var whole = lv === 2;
          return { q: whole ? 'How many students in ' + g[ask].name + ' were surveyed in all?' : 'How many students in ' + g[ask].name + ' come by <b>' + cats[part].toLowerCase() + '</b>?', type: 'num', answer: whole ? tot : g[ask].parts[part],
            fig: stacked(g, cats, SB, false), hint: whole ? 'The whole bar is the total. Add its parts.' : 'Find the ' + cats[part] + ' part of the ' + g[ask].name + ' bar. The number is written on it.',
            steps: whole ? ['The ' + g[ask].name + ' bar has parts ' + g[ask].parts.join(', ') + '.', 'Add them: ' + g[ask].parts.join(' + ') + '.', 'Total: ' + tot + '.'] : ['Find the ' + g[ask].name + ' bar.', 'Find the colour for ' + cats[part] + ' in the key.', 'That part is ' + g[ask].parts[part] + '.'],
            explain: whole ? g[ask].parts.join(' + ') + ' = ' + tot + '.' : g[ask].name + ', ' + cats[part] + ': ' + g[ask].parts[part] + '.' };
        }
        var z = R.pick([50, 80, 90]), o = R.mc('The scale starts at ' + z + ', so a small difference looks big', ['The bars are the wrong colour', 'The title is too long', 'There are only two bars']);
        return { q: 'A graph shows two bars, 94 and 98. The bar for 98 looks about three times as tall. Its scale starts at ' + z + '. What makes the graph misleading?', type: 'mc', options: o.options, answer: o.answer,
          fig: misBars(94, 98, z, 'Scale from ' + z), hint: 'Look at where the scale begins.', steps: ['The real difference is 98 &minus; 94 = 4.', 'The bars are drawn from ' + z + ', not from 0, so only the tops are shown.', 'That makes a small difference look large.'],
          explain: 'Starting the scale above 0 exaggerates differences.' };
      } },
      { id: 'da-mmm', name: 'Mean, median and mode', code: 'D1.5', gen: function (lv) {
        var kind = lv === 1 ? R.pick(['median', 'mode']) : R.pick(['mean', 'median', 'mean']), n = lv === 3 ? 4 : 5, d = [];
        if (kind === 'mean') { var m = R.int(5, 20), p1 = R.int(1, 4), p2 = R.int(1, 4); d = R.shuffle(n === 5 ? [m + p1, m - p1, m + p2, m - p2, m] : [m + p1, m - p1, m + p2, m - p2]); }
        else for (var j = 0; j < n; j++) d.push(R.int(1, 30));
        if (kind === 'mode') { d[1] = d[3] = d[0]; }
        if (lv === 3 && kind === 'median') d = d.map(function (x) { return x / 10 + R.int(10, 12); }).map(A.clean);
        var srt = d.slice().sort(function (x, y) { return x - y; }), sum = A.clean(d.reduce(function (x, y) { return x + y; }, 0)), ans;
        if (kind === 'mean') ans = A.clean(sum / n);
        else if (kind === 'median') ans = n % 2 ? srt[(n - 1) / 2] : A.clean((srt[n / 2 - 1] + srt[n / 2]) / 2);
        else ans = d[0];
        var steps = kind === 'mean' ? ['Add all the numbers: ' + d.join(' + ') + ' = ' + sum + '.', 'There are ' + n + ' numbers.', sum + ' &divide; ' + n + ' = ' + ans + '.'] :
          kind === 'median' ? ['Put them in order: ' + srt.join(', ') + '.', n % 2 ? 'The middle number is the 3rd one.' : 'There are two middle numbers: ' + srt[n / 2 - 1] + ' and ' + srt[n / 2] + '.', n % 2 ? 'The median is ' + ans + '.' : 'Halfway between them is ' + ans + '.'] :
          ['Count how many times each number appears.', d[0] + ' appears ' + d.filter(function (x) { return x === d[0]; }).length + ' times, more than any other number.', 'The mode is ' + d[0] + '.'];
        return { q: 'Find the <b>' + kind + '</b>: <span class="math">' + d.join(', ') + '</span>', type: 'num', answer: ans,
          fig: lv < 3 || kind !== 'median' ? dotplot(d) : '', hint: kind === 'mean' ? 'Add them up, then divide by how many there are. On the plot, the mean is the balance point.' : kind === 'median' ? 'Put the numbers in order first.' : 'Which number appears most often?',
          steps: steps, explain: 'The ' + kind + ' is ' + ans + '.' };
      } },
      { id: 'da-prob', name: 'Probability as a fraction', code: 'D2.1', gen: function (lv) {
        var tot = R.pick([4, 5, 6, 8, 10, 12]), k = R.int(1, tot - 1), col = R.pick(['red', 'green', 'yellow']);
        if (lv === 3) {
          var o3 = R.mc(k * 2 < tot ? 'unlikely' : k * 2 > tot ? 'likely' : 'equally likely', ['impossible', 'certain', 'unlikely', 'likely', 'equally likely']);
          return { q: 'A bag has ' + tot + ' marbles. ' + k + ' are ' + col + '. Where does "pick a ' + col + ' marble" go on the probability line?', type: 'mc', options: o3.options, answer: o3.answer,
            fig: (col === 'red' && tot <= 12 ? marbles(k, tot - k) : '') + pline(null),
            hint: 'Compare ' + k + '/' + tot + ' with 1/2.', steps: ['The probability is ' + k + '/' + tot + '.', '1/2 of ' + tot + ' is ' + tot / 2 + '.', k + (k * 2 < tot ? ' is less than ' : k * 2 > tot ? ' is more than ' : ' equals ') + tot / 2 + ', so it is ' + o3.options[o3.answer] + '.'],
            explain: k + '/' + tot + ' is ' + (k * 2 < tot ? 'less than' : k * 2 > tot ? 'more than' : 'equal to') + ' 1/2.' };
        }
        var o = R.mc(k + '/' + tot, [(tot - k) + '/' + tot, k + '/' + (tot - k), '1/' + tot]);
        return { q: 'A spinner has ' + tot + ' equal sections. ' + k + ' are shaded. What is the probability of landing on a shaded section?', type: 'mc', options: o.options, answer: o.answer,
          fig: spinner(k, tot), hint: 'Shaded sections over all sections.',
          steps: ['Count the shaded sections: ' + k + '.', 'Count all the sections: ' + tot + '.', 'Probability = ' + k + '/' + tot + '.'], explain: k + ' out of ' + tot + ' equally likely sections: ' + k + '/' + tot + '.' };
      } },
      { id: 'da-exp', name: 'Theoretical and experimental', code: 'D2.2', gen: function (lv) {
        if (lv < 3) {
          var sides = R.pick([2, 4, 6]), trials = sides * R.int(5, 20), what = sides === 2 ? 'getting heads when you flip a coin' : 'rolling a 1 on a ' + sides + '-sided die';
          return { q: 'The probability of ' + what + ' is 1/' + sides + '. If you try ' + trials + ' times, about how many times would you expect it to happen?', type: 'num', answer: trials / sides,
            hint: 'Find 1/' + sides + ' of ' + trials + '.', steps: ['The probability is 1/' + sides + '.', '1/' + sides + ' of ' + trials + ' is ' + trials + ' &divide; ' + sides + '.', trials + ' &divide; ' + sides + ' = ' + trials / sides + '.'],
            explain: 'About ' + trials / sides + ' times. The real result will often be a little more or less.' };
        }
        var n = R.pick([20, 50, 100]), got = Math.round(n / 2) + R.pick([-6, -4, 4, 6]);
        var o = R.mc(got + '/' + n, ['1/2', (n - got) + '/' + n, got + '/' + (n - got)]);
        var nh = Math.round(got * 20 / n), seqc = R.shuffle('HHHHHHHHHHHHHHHHHHHH'.slice(0, nh).split('').concat('TTTTTTTTTTTTTTTTTTTT'.slice(0, 20 - nh).split(''))).join('');
        return { fig: n === 20 ? coins(seqc.slice(0, 10)) + coins(seqc.slice(10)) : '', q: 'You flip a coin ' + n + ' times and get heads ' + got + ' times. What is the <b>experimental</b> probability of heads?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Experimental probability uses what actually happened.', steps: ['Experimental probability = times it happened &divide; number of tries.', 'Heads happened ' + got + ' times in ' + n + ' tries.', 'So it is ' + got + '/' + n + '. The theoretical probability is 1/2.'],
          explain: got + '/' + n + '. It is close to, but not the same as, the theoretical 1/2.' };
      } }
    ]
  });

  /* ---------- more ways to ask each practice skill (docs/QUESTIONS.md); answer checks in tests/verify/grade5.js ---------- */
  var nm = function () { return A.Q.name(); };
  function mth(x) { return '<span class="math">' + x + '</span>'; }
  /* a spinner with tot equal sections, k of them shaded */
  function spinner(k, tot, r) {
    r = r || 62;
    var s = '', c = r + 8;
    for (var i = 0; i < tot; i++) {
      var a0 = (-90 + i * 360 / tot) * Math.PI / 180, a1 = (-90 + (i + 1) * 360 / tot) * Math.PI / 180;
      s += '<path d="M' + c + ',' + c + ' L' + (c + r * Math.cos(a0)) + ',' + (c + r * Math.sin(a0)) + ' A' + r + ',' + r + ' 0 0 1 ' + (c + r * Math.cos(a1)) + ',' + (c + r * Math.sin(a1)) + ' Z" style="fill:' + (i < k ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
    }
    return A.svg(2 * c, 2 * c, s, 'Spinner with ' + k + ' of ' + tot + ' sections shaded');
  }
  /* a bar graph whose bars can be tapped (data-hit = the bar's index) */
  function vbars(vals, names, title) {
    var top = Math.ceil(Math.max.apply(null, vals) / 5) * 5, W = 70 + vals.length * 80, s = '';
    for (var t = 0; t <= top; t += 5) { var y = 170 - t / top * 140; s += '<line x1="50" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" style="stroke:var(--line)"/><text x="44" y="' + (y + 5) + '" text-anchor="end" font-size="13" class="t2">' + t + '</text>'; }
    vals.forEach(function (v, i) {
      var h = v / top * 140, x = 64 + i * 80;
      s += '<g data-hit="' + i + '" aria-label="' + names[i] + ': ' + v + '"><rect x="' + x + '" y="' + (170 - h) + '" width="56" height="' + h + '" rx="4" style="fill:' + SB[i % 3] + '"/>' +
        '<text x="' + (x + 28) + '" y="192" text-anchor="middle" font-size="14">' + names[i] + '</text></g>';
    });
    s += '<line x1="50" y1="170" x2="' + (W - 10) + '" y2="170" style="stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(W, 200, s, (title || 'Bar graph') + ': ' + names.map(function (n, i) { return n + ' ' + vals[i]; }).join(', '));
  }
  /* k different whole numbers from lo to hi, at least gap apart so bars are easy to tell apart */
  function distinctVals(k, lo, hi, gap) { var v = []; while (v.length < k) { var x = R.int(lo, hi); if (v.every(function (y) { return Math.abs(x - y) >= (gap || 1); })) v.push(x); } return v; }
  var FOODS = ['Apples', 'Grapes', 'Pears', 'Kiwis'];
  var SHAPES = {
    'da-sample': [
      [1, 'pick', function (lv) {
        var who = 'students at the school', good = ['People picked at random from all the ' + who, 'Every 10th name on a list of all the ' + who], bad = ['Only your close friends', 'Only the players on one team', 'Only the first 3 people you see'];
        var opts = R.shuffle(good.slice(0, R.int(1, 2)).concat(bad));
        return K.pick('You want to know the favourite lunch of all the ' + who + '. Pick every sample that is <b>representative</b>.', opts, function (o) { return good.indexOf(o) >= 0; }, String, {
          hint: 'A fair sample gives everyone a chance to be picked.', steps: ['Ask: could anyone at the school be picked?', 'A sample that leaves groups out is biased.'],
          explain: 'Picking at random, or every 10th name from the full list, gives everyone a chance.', meta: { k: 'g5da-pick' } });
      }],
      [1, 'mistake', function (lv) {
        var who = nm(), truth = !R.int(0, 2), plan = truth ? 'picking 30 names at random from the whole school list' : R.pick(['asking only the hockey team', 'asking only friends in the same class', 'asking only the students at the library at lunch']);
        var right = 'A representative sample gives every student a fair chance to be picked. Picking at random from the whole school list does that.';
        return K.tf(who, 'that ' + plan + ' is a good way to learn what the whole school thinks.', truth, right,
          ['Any group of students is fine.', 'Asking friends is best because they answer honestly.', 'A bigger group is always fair, even if it leaves people out.'],
          { hint: 'Could every student be picked?', meta: { k: 'g5da-tf', plan: plan } });
      }],
      [1, 'match', function (lv) {
        var pairs = [['Population', 'Everyone you want to learn about'], ['Sample', 'The group you actually ask'], ['Biased sample', 'A sample that leaves some groups out']];
        if (lv > 1) pairs.push(['Random sample', 'Everyone has the same chance to be picked']);
        return { q: 'Match each word to what it means.', type: 'match', pairs: pairs,
          hint: 'The population is the whole group. The sample is part of it.', steps: ['Population: the whole group.', 'Sample: the part you ask.'],
          explain: pairs.map(function (p) { return p[0] + ': ' + p[1].toLowerCase(); }).join('. ') + '.', meta: { k: 'g5da-match' } };
      }],
      [2, 'story', function (lv) {
        var who = nm(), pop = R.int(3, 9) * 100 + R.int(0, 9) * 10, n = R.int(2, 6) * 10;
        return { q: who + '\'s school has ' + pop + ' students. ' + who + ' asks ' + n + ' of them about a new club. How many people are in the <b>sample</b>?', type: 'num', answer: n,
          hint: 'The sample is the people who were actually asked.', steps: ['The population is all ' + pop + ' students.', 'The sample is the ' + n + ' students ' + who + ' asked.'],
          explain: 'The sample has ' + n + ' people.', meta: { k: 'g5da-story' } };
      }]
    ],
    'da-rel': [
      [1, 'fill', function (lv) {
        var tot = R.pick([10, 20, 25, 50]), n = R.int(1, tot - 1), k = 100 / tot;
        return { q: n + ' of ' + tot + ' students walk to school. Fill in the blanks.', type: 'fill', fill: (n + '/' + tot + ' = [[]]/100') + '<br>' + ('= [[]]%'), answers: [n * k, n * k],
          fig: lv === 1 ? people(n, tot) : '', hint: 'What times ' + tot + ' makes 100?', steps: [tot + ' &times; ' + k + ' = 100.', n + ' &times; ' + k + ' = ' + n * k + ', so ' + n * k + '/100 = ' + n * k + '%.'],
          explain: n + '/' + tot + ' = ' + n * k + '%.', meta: { k: 'g5da-relfill' } };
      }],
      [1, 'tap', function (lv) {
        var tot = R.pick([10, 20, 25, 50]), n = R.int(1, tot - 1), pct = n * 100 / tot, set = [pct];
        [n, 100 - pct, pct + 10 <= 99 ? pct + 10 : pct - 10].forEach(function (v) { if (set.indexOf(v) < 0 && set.length < 3) set.push(v); });
        set = R.shuffle(set);
        return { q: 'In a survey, ' + n + ' of ' + tot + ' students have a pet. Tap the hundred grid that shows this relative frequency.', type: 'tap', tiles: set.map(function (v) { return A.draw.grid(v, 9); }), answer: set.indexOf(pct), answerText: 'the grid with ' + pct + ' squares shaded',
          hint: 'Make ' + n + '/' + tot + ' out of 100.', steps: [n + '/' + tot + ' = ' + pct + '/100.', 'Look for ' + pct + ' shaded squares.'],
          explain: n + '/' + tot + ' = ' + pct + '%.', meta: { k: 'g5da-reltap' } };
      }],
      [1, 'story', function (lv) {
        var a = R.pick([10, 20, 25]), b = R.pick([20, 25, 50]), x, y;
        do { x = R.int(2, a - 1); y = R.int(2, b - 1); } while (x * b === y * a);
        var rooms = ['Room 12', 'Room 14'];
        return { q: 'In Room 12, ' + x + ' of ' + a + ' students play an instrument. In Room 14, ' + y + ' of ' + b + ' do. Which room has the greater relative frequency?', type: 'mc', options: rooms, answer: x / a > y / b ? 0 : 1,
          hint: 'Change both to percents, then compare.', steps: ['Room 12: ' + x + '/' + a + ' = ' + x * 100 / a + '%.', 'Room 14: ' + y + '/' + b + ' = ' + y * 100 / b + '%.'],
          explain: (x / a > y / b ? 'Room 12' : 'Room 14') + ' has the greater relative frequency.', meta: { k: 'g5da-relstory' } };
      }],
      [2, 'mistake', function (lv) {
        var tot = R.pick([20, 25, 50]), n = R.int(1, tot - 1), who = nm(), truth = !R.int(0, 2), said = truth ? n * 100 / tot : n;
        var right = n + '/' + tot + ' = ' + n * 100 / tot + '/100, so the relative frequency is ' + n * 100 / tot + '%.';
        return K.tf(who, n + ' out of ' + tot + ' is <b>' + said + '%</b>.', truth, right,
          ['A count is always the same as a percent.', 'Percent means out of ' + tot + '.', 'Divide ' + tot + ' by ' + n + '.'],
          { hint: 'Percent means out of 100. Is the total 100?', meta: { k: 'g5da-reltf', said: said } });
      }]
    ],
    'da-graph': [
      [1, 'tap', function (lv) {
        var vals = distinctVals(4, 3, lv === 1 ? 18 : 25, lv === 1 ? 3 : 2), most = !R.int(0, 1) || lv === 1, best = vals.indexOf(most ? Math.max.apply(null, vals) : Math.min.apply(null, vals));
        return { q: 'Students voted for their favourite fruit. Tap the bar for the <b>' + (most ? 'most' : 'least') + ' popular</b> fruit.', type: 'tap', pic: vbars(vals, FOODS, 'Favourite fruit'), answer: String(best), answerText: FOODS[best],
          hint: (most ? 'The tallest' : 'The shortest') + ' bar has the ' + (most ? 'most' : 'fewest') + ' votes.', steps: ['Compare the heights of the bars.', FOODS[best] + ' has ' + vals[best] + ' votes.'],
          explain: FOODS[best] + ' is the ' + (most ? 'most' : 'least') + ' popular, with ' + vals[best] + ' votes.', meta: { k: 'g5da-tap', vals: vals, most: most } };
      }],
      [1, 'fill', function (lv) {
        var p = [R.int(3, 12), R.int(3, 12), R.int(3, 12)], q2 = [R.int(3, 12), R.int(3, 12), R.int(3, 12)], cats = ['Walk', 'Bus', 'Car'];
        return { q: 'Read the Gr 5 bar. Fill in each part.', type: 'fill', fig: stacked([{ name: 'Gr 5', parts: p }, { name: 'Gr 6', parts: q2 }], cats, SB, false), fill: 'Walk: [[]]<br>Bus: [[]]<br>Car: [[]]<br>Total: [[]]', answers: p.concat([p[0] + p[1] + p[2]]),
          hint: 'Each part of the bar has its number on it. The total is all the parts added.', steps: ['Use the key to match colours to Walk, Bus and Car.', 'Add the parts for the total: ' + p.join(' + ') + ' = ' + (p[0] + p[1] + p[2]) + '.'],
          explain: 'Gr 5: ' + p.join(', ') + ', total ' + (p[0] + p[1] + p[2]) + '.', meta: { k: 'g5da-fill', parts: p } };
      }],
      [1, 'mistake', function (lv) {
        var z = R.pick([80, 90]), a = R.int(91, 95), b = a + R.int(2, 4), who = nm();
        var right = 'The real difference is only ' + (b - a) + '. The scale starts at ' + z + ', not 0, so the bar for ' + b + ' only looks much taller.';
        return K.tf(who, 'the graph shows that ' + b + ' is about three times as many as ' + a + '.', false, right,
          ['A taller bar always means many times more.', 'The scale does not matter.', 'Graphs always start at 0.'],
          { fig: misBars(a, b, z, 'Scale from ' + z), hint: 'Look at where the scale begins.', meta: { k: 'g5da-graphtf', a: a, b: b } });
      }],
      [2, 'order', function (lv) {
        var vals = distinctVals(4, 3, 25, 2), idx = [0, 1, 2, 3].sort(function (i, j) { return vals[j] - vals[i]; });
        return { q: 'Order the fruits from <b>most to least</b> popular.', type: 'order', fig: vbars(vals, FOODS, 'Favourite fruit'), items: idx.map(function (i) { return FOODS[i]; }), first: 'most', last: 'least',
          hint: 'Start with the tallest bar.', steps: ['Read the value of each bar.', 'Put them from biggest to smallest.'],
          explain: 'From most to least: ' + idx.map(function (i) { return FOODS[i] + ' (' + vals[i] + ')'; }).join(', ') + '.', meta: { k: 'g5da-order', vals: vals } };
      }]
    ],
    'da-mmm': [
      [1, 'fill', function (lv) {
        var n = lv === 1 ? 3 : 5, m = R.int(5, 15), d, last;
        do { d = []; for (var i = 0; i < n - 1; i++) d.push(m + R.int(-3, 3)); last = m * n - d.reduce(function (x, y) { return x + y; }, 0); } while (last < 1 || Math.abs(last - m) > 6);
        d.push(last);
        return { q: 'Find the <b>mean</b> of ' + mth(d.join(', ')) + '. Fill in the blanks.', type: 'fill', fill: 'Total: [[]]<br>Mean: [[]] &divide; ' + n + ' = [[]]', answers: [m * n, m * n, m],
          fig: dotplot(d), hint: 'Add them all. Then share the total equally among ' + n + '.', steps: [d.join(' + ') + ' = ' + m * n + '.', m * n + ' &divide; ' + n + ' = ' + m + '.'],
          explain: 'The mean is ' + m + '.', meta: { k: 'g5da-mmmfill', d: d } };
      }],
      [1, 'tap', function (lv) {
        var d = R.shuffle(distinctVals(5, 1, lv === 1 ? 20 : 60)), srt = d.slice().sort(function (a, b) { return a - b; });
        return { q: 'Tap the <b>median</b> of these numbers.', type: 'tap', tiles: d.map(function (v) { return '<span class="math" style="font-size:1.3em">' + v + '</span>'; }), answer: d.indexOf(srt[2]), answerText: String(srt[2]),
          hint: 'Put the numbers in order first.', steps: ['In order: ' + srt.join(', ') + '.', 'The middle one is ' + srt[2] + '.'],
          explain: 'The median is ' + srt[2] + '.', meta: { k: 'g5da-mmmtap' } };
      }],
      [1, 'mistake', function (lv) {
        var d = R.shuffle(distinctVals(5, 1, 30)), srt = d.slice().sort(function (a, b) { return a - b; }), who = nm();
        while (d[2] === srt[2]) d = R.shuffle(d);
        var truth = !R.int(0, 2), said = truth ? srt[2] : d[2];
        var right = 'Put the numbers in order first: ' + srt.join(', ') + '. The middle one is ' + srt[2] + '.';
        return K.tf(who, 'the median of ' + mth(d.join(', ')) + ' is <b>' + said + '</b>.', truth, right,
          ['The median is the middle number as the list is written.', 'The median is the biggest number.', 'The median is the one that shows up most.'],
          { hint: 'What do you do before finding the middle?', meta: { k: 'g5da-mmmtf', d: d, said: said } });
      }],
      [2, 'match', function (lv) {
        var d, mean, med, mode, t = 0;
        do { var a = R.int(2, 9); d = [a, a, a + R.int(2, 5), a + R.int(6, 9), a + R.int(10, 14)]; var s = d.reduce(function (x, y) { return x + y; }, 0); mean = s / 5; med = d[2]; mode = a; } while ((mean % 1 || new Set([mean, med, mode]).size < 3) && t++ < 100);
        if (mean % 1) { d = [3, 3, 6, 10, 13]; mean = 7; med = 6; mode = 3; }
        return { q: 'For ' + mth(R.shuffle(d).join(', ')) + ', match each word to its value.', type: 'match', pairs: [['Mean', String(mean)], ['Median', String(med)], ['Mode', String(mode)]],
          hint: 'Mean: add and share. Median: the middle in order. Mode: the most common.', steps: ['In order: ' + d.join(', ') + '.', 'Mean: ' + d.join(' + ') + ' = ' + mean * 5 + ', &divide; 5 = ' + mean + '.', 'Median: ' + med + '. Mode: ' + mode + '.'],
          explain: 'Mean ' + mean + ', median ' + med + ', mode ' + mode + '.', meta: { k: 'g5da-mmmmatch' } };
      }]
    ],
    'da-prob': [
      [1, 'tap', function (lv) {
        var tot = R.pick([6, 8, 10, 12]), k = R.int(1, tot - 1);
        if (k * 2 === tot) k--;
        var set = R.shuffle([[k, tot - k], [tot - k, k], [k, tot - k + 2]]);
        return { q: 'Tap the bag where the probability of picking <b>red</b> is <b>' + k + '/' + tot + '</b>.', type: 'tap', tiles: set.map(function (x) { return marbles(x[0], x[1]); }), answer: set.map(String).indexOf(String([k, tot - k])), answerText: 'the bag with ' + k + ' red of ' + tot,
          hint: 'Count the red marbles and all the marbles.', steps: ['You need ' + k + ' red marbles.', 'You need ' + tot + ' marbles in all.'],
          explain: k + ' red out of ' + tot + ' marbles is ' + k + '/' + tot + '.', meta: { k: 'g5da-probtap' } };
      }],
      [1, 'line', function (lv) {
        var tot = R.pick(lv === 1 ? [2, 4, 5] : [4, 5, 6, 8, 10]), k = R.int(0, tot);
        return { q: 'A spinner has ' + tot + ' equal sections. ' + k + ' are shaded. Mark the probability of landing on shaded.', type: 'line', min: 0, max: 1, tick: 1 / tot, every: 1, snap: 1 / tot, answer: k / tot, tol: 1e-4, hideValue: true,
          fig: spinner(k, tot, 50), hint: 'The probability is shaded sections over all sections. 0 is impossible and 1 is certain.', steps: ['The probability is ' + k + '/' + tot + '.', 'The line is cut into ' + tot + ' equal jumps. Count ' + k + ' jumps from 0.'],
          explain: 'The probability is ' + k + '/' + tot + (k === 0 ? ': impossible.' : k === tot ? ': certain.' : '.'), meta: { k: 'g5da-probline', k2: k, tot: tot } };
      }],
      [1, 'pick', function (lv) {
        var tot = R.pick([8, 10, 12]), cols = ['red', 'blue', 'green', 'yellow'], cnt;
        do { cnt = []; var left = tot; for (var i = 0; i < 3; i++) { var c = R.int(1, left - (3 - i)); cnt.push(c); left -= c; } cnt.push(left); } while (!cnt.some(function (c) { return c * 4 > tot; }));
        return K.pick('A bag has ' + cnt.map(function (c, j) { return c + ' ' + cols[j]; }).join(', ') + ' marbles. Pick every colour with a probability <b>greater than 1/4</b>.', [0, 1, 2, 3], function (j) { return cnt[j] * 4 > tot; }, function (j) { return cols[j]; }, {
          hint: '1/4 of ' + tot + ' is ' + tot / 4 + '. Which colours have more than that?', steps: cnt.map(function (c, j) { return cols[j] + ': ' + c + '/' + tot + '.'; }),
          explain: 'The probabilities are ' + cnt.map(function (c, j) { return cols[j] + ' ' + c + '/' + tot; }).join(', ') + '.', meta: { k: 'g5da-probpick' } });
      }],
      [2, 'mistake', function (lv) {
        var tot = R.pick([6, 8, 10, 12]), k = R.int(1, tot - 1), who = nm(), truth = !R.int(0, 2), said = truth ? k + '/' + tot : k + '/' + (tot - k);
        if (!truth && k === tot - k) k = Math.max(1, k - 1), said = k + '/' + (tot - k);
        var right = 'Probability is shaded sections over all ' + tot + ' sections: ' + k + '/' + tot + '.';
        return K.tf(who, 'the probability of landing on shaded is <b>' + said + '</b>.', truth, right,
          ['Compare shaded to unshaded.', 'Probability is always 1/2 for two colours.', 'Count only the white sections.'],
          { fig: spinner(k, tot), hint: 'The bottom number is all the sections.', meta: { k: 'g5da-probtf', k2: k, tot: tot, said: said } });
      }]
    ],
    'da-exp': [
      [1, 'fill', function (lv) {
        var rolls = 6 * R.int(3, lv === 1 ? 10 : 30);
        return { q: 'You roll a fair 6-sided die <b>' + rolls + '</b> times. About how many times would you expect each? Fill in the blanks.', type: 'fill', fill: 'a 4: about [[]] times<br>an even number: about [[]] times', answers: [rolls / 6, rolls / 2],
          hint: 'A 4 is 1 of 6 sides. Even numbers are 3 of 6 sides.', steps: ['1/6 of ' + rolls + ' = ' + rolls / 6 + '.', '3/6 = 1/2 of ' + rolls + ' = ' + rolls / 2 + '.'],
          explain: 'Expect about ' + rolls / 6 + ' fours and ' + rolls / 2 + ' even numbers.', meta: { k: 'g5da-expfill' } };
      }],
      [1, 'mistake', function (lv) {
        var who = nm(), n = R.pick([10, 20]), h = n / 2 + R.int(2, 4);
        var right = 'A fair coin always has a theoretical probability of 1/2. ' + h + '/' + n + ' is the experimental result, which can be a little different.';
        return K.tf(who, 'after getting ' + h + ' heads in ' + n + ' flips, the theoretical probability of heads is now <b>' + h + '/' + n + '</b>.', false, right,
          ['Experiments change the theoretical probability.', 'The coin has learned to land on heads.', 'The next flip must be tails.'],
          { hint: 'Does flipping a coin change the coin?', meta: { k: 'g5da-exptf' } });
      }],
      [1, 'story', function (lv) {
        var who = nm(), n = R.pick([20, 30, 40, 50]), got = R.int(2, Math.floor(n / 3)), face = R.int(1, 6);
        return { q: who + ' rolled a die ' + n + ' times and got a ' + face + ' on ' + got + ' of them. What is the experimental probability of rolling a ' + face + '?', type: 'fill', fill: ('[[]]/' + n), answers: [got],
          hint: 'Use what actually happened: times it happened over the number of rolls.', steps: ['It happened ' + got + ' times.', 'There were ' + n + ' rolls.'],
          explain: 'The experimental probability is ' + got + '/' + n + '. The theoretical probability is 1/6.', meta: { k: 'g5da-expstory' } };
      }],
      [2, 'match', function (lv) {
        var k = R.pick([1, 3]), pairs = [['Heads on a coin', '1/2'], ['A 5 on a 6-sided die', '1/6'], [k === 1 ? 'Shaded, with 1 of 4 sections shaded' : 'Shaded, with 3 of 4 sections shaded', k + '/4']];
        if (lv === 3) pairs.push(['A 7 on a 6-sided die', '0']);
        return { q: 'Match each event to its theoretical probability.', type: 'match', pairs: pairs,
          hint: 'Count the ways it can happen. Count all the equally likely results.', steps: ['A coin has 2 sides. A die has 6 faces. The spinner has 4 sections.'],
          explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'g5da-expmatch' } };
      }]
    ]
  };
  Atlas.Q.shapes('data-probability', SHAPES);
})();
