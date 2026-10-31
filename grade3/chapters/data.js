(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var ATTR = {
    even: ['Even', function (n) { return n % 2 === 0; }],
    gt15: ['Greater than 15', function (n) { return n > 15; }],
    m5: ['Multiple of 5', function (n) { return n % 5 === 0; }],
    lt10: ['Less than 10', function (n) { return n < 10; }],
    odd: ['Odd', function (n) { return n % 2 === 1; }],
    gt10: ['Greater than 10', function (n) { return n > 10; }]
  };
  var NUMS = [3, 6, 8, 10, 12, 15, 17, 20, 22, 25, 27, 30];

  function venn(nums, a, b) {
    var fa = ATTR[a][1], fb = ATTR[b][1], s = '', reg = { a: [], b: [], ab: [], none: [] };
    nums.forEach(function (n) { var x = fa(n), y = fb(n); reg[x && y ? 'ab' : x ? 'a' : y ? 'b' : 'none'].push(n); });
    s += '<rect x="4" y="4" width="552" height="292" rx="14" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
    s += '<circle cx="210" cy="150" r="118" style="fill:color-mix(in srgb,var(--sb) 16%,transparent);stroke:var(--sb)" stroke-width="3"/>';
    s += '<circle cx="350" cy="150" r="118" style="fill:color-mix(in srgb,var(--se) 16%,transparent);stroke:var(--se)" stroke-width="3"/>';
    s += '<text x="150" y="26" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--sb)">' + ATTR[a][0] + '</text><text x="410" y="26" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--se)">' + ATTR[b][0] + '</text>';
    function place(list, cx, cy, cols) { var t = ''; list.forEach(function (n, i) { t += '<text x="' + (cx + ((i % cols) - (Math.min(list.length, cols) - 1) / 2) * 42) + '" y="' + (cy + Math.floor(i / cols) * 32) + '" text-anchor="middle" font-size="25" class="tb">' + n + '</text>'; }); return t; }
    s += place(reg.a, 160, 120, 3) + place(reg.ab, 280, 120, 1) + place(reg.b, 400, 120, 3) + place(reg.none, 280, 290, 8);
    return { svg: A.svg(560, 300, s, 'Venn diagram. ' + ATTR[a][0] + ' only: ' + (reg.a.join(', ') || 'none') + '. Both: ' + (reg.ab.join(', ') || 'none') + '. ' + ATTR[b][0] + ' only: ' + (reg.b.join(', ') || 'none') + '. Neither: ' + (reg.none.join(', ') || 'none') + '.'), reg: reg };
  }
  function carroll(nums, a, b) {
    var fa = ATTR[a][1], fb = ATTR[b][1], cell = function (x, y) { return nums.filter(function (n) { return fa(n) === x && fb(n) === y; }).join(', ') || '&ndash;'; };
    return '<div class="tbl"><table><thead><tr><th></th><th>' + ATTR[b][0] + '</th><th>Not ' + ATTR[b][0].toLowerCase() + '</th></tr></thead><tbody>' +
      '<tr><th class="l">' + ATTR[a][0] + '</th><td>' + cell(true, true) + '</td><td>' + cell(true, false) + '</td></tr>' +
      '<tr><th class="l">Not ' + ATTR[a][0].toLowerCase() + '</th><td>' + cell(false, true) + '</td><td>' + cell(false, false) + '</td></tr></tbody></table></div>';
  }
  function icon(x, y, part) {
    var r = 15;
    if (part >= 1) return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/><circle cx="' + (x - 5) + '" cy="' + (y - 3) + '" r="2.2" style="fill:#fff"/><circle cx="' + (x + 5) + '" cy="' + (y - 3) + '" r="2.2" style="fill:#fff"/><path d="M' + (x - 6) + ' ' + (y + 5) + ' Q' + x + ' ' + (y + 10) + ' ' + (x + 6) + ' ' + (y + 5) + '" fill="none" stroke="#fff" stroke-width="2"/>';
    var w = 2 * r * part;
    return '<clipPath id="cp' + x + '_' + y + '"><rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + w + '" height="' + 2 * r + '"/></clipPath><g clip-path="url(#cp' + x + '_' + y + ')">' + icon(x, y, 1) + '</g><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" style="stroke:var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>';
  }
  /* pictograph. data: [[name, count]], key: how many each picture stands for */
  function picto(title, data, key, src) {
    var maxP = Math.max.apply(null, data.map(function (d) { return Math.ceil(d[1] / key); })), W = Math.max(380, 170 + maxP * 36);
    var s = '<text x="' + W / 2 + '" y="24" text-anchor="middle" font-size="20" font-weight="700" style="font-family:var(--display)">' + title + '</text>', y = 56, uid = Math.random().toString(36).slice(2, 6);
    data.forEach(function (d) {
      s += '<text x="110" y="' + (y + 6) + '" text-anchor="end" font-size="18" class="tb">' + d[0] + '</text>';
      var full = Math.floor(d[1] / key), part = (d[1] % key) / key;
      for (var i = 0; i < full; i++) s += icon(140 + i * 36, y, 1);
      if (part) s += icon(140 + full * 36, y, part).replace(/cp(\d)/g, 'cp' + uid + '$1');
      y += 42;
    });
    s += icon(150, y + 4, 1) + '<text x="174" y="' + (y + 11) + '" font-size="18">= ' + key + ' ' + (key === 1 ? 'vote' : 'votes') + '</text>';
    if (src) s += '<text x="' + (W - 8) + '" y="' + (y + 40) + '" text-anchor="end" font-size="16" class="t2">Source: ' + src + '</text>';
    return A.svg(W, y + (src ? 50 : 24), s, 'Pictograph: ' + title + '. ' + data.map(function (d) { return d[0] + ' ' + d[1]; }).join(', ') + '. Each picture means ' + key + '.');
  }
  /* bar graph with a scale */
  function bars(title, data, step, src, ylab) {
    var max = Math.max.apply(null, data.map(function (d) { return d[1]; })), top = Math.max(step, Math.ceil(max / step) * step), H = 220, x0 = 70, W = 470, bw = W / data.length, s = '';
    s += '<text x="300" y="22" text-anchor="middle" font-size="20" font-weight="700" style="font-family:var(--display)">' + title + '</text>';
    for (var v = 0; v <= top; v += step) {
      var y = 260 - H * v / top;
      s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + W) + '" y2="' + y + '" style="stroke:var(--line)" stroke-width="1.5"/><text x="' + (x0 - 8) + '" y="' + (y + 6) + '" text-anchor="end" font-size="16">' + v + '</text>';
    }
    data.forEach(function (d, i) {
      var h = H * d[1] / top, x = x0 + i * bw + bw * 0.18;
      s += '<rect x="' + x + '" y="' + (260 - h) + '" width="' + bw * 0.64 + '" height="' + h + '" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>' +
        '<text x="' + (x + bw * 0.32) + '" y="284" text-anchor="middle" font-size="17" class="tb">' + d[0] + '</text>';
    });
    s += '<line x1="' + x0 + '" y1="260" x2="' + (x0 + W) + '" y2="260" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="' + x0 + '" y1="260" x2="' + x0 + '" y2="36" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<text x="18" y="150" text-anchor="middle" font-size="16" class="t2" transform="rotate(-90 18 150)">' + (ylab || 'Number of votes') + '</text>';
    if (src) s += '<text x="540" y="306" text-anchor="end" font-size="16" class="t2">Source: ' + src + '</text>';
    return A.svg(560, 312, s, 'Bar graph: ' + title + '. ' + data.map(function (d) { return d[0] + ' ' + d[1]; }).join(', ') + '. The scale counts by ' + step + '.');
  }
  function tally(n) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var g = Math.floor(i / 5), k = i % 5, x = 6 + g * 46 + k * 8;
      s += k === 4 ? '<line x1="' + (x - 34) + '" y1="28" x2="' + (x + 2) + '" y2="8" style="stroke:var(--ink)" stroke-width="2.5"/>' : '<line x1="' + x + '" y1="6" x2="' + x + '" y2="32" style="stroke:var(--ink)" stroke-width="2.5"/>';
    }
    return A.svg(Math.max(40, Math.ceil(n / 5) * 46 + 8), 38, s, n + ' tally marks');
  }
  function towerFig(vals, mean) {
    var u = 20, w = 70, s = '', base = 230;
    vals.forEach(function (v, i) {
      for (var k = 0; k < v; k++) s += '<rect x="' + (20 + i * w) + '" y="' + (base - (k + 1) * u) + '" width="' + (w - 18) + '" height="' + (u - 2) + '" rx="3" style="fill:' + (k < mean ? 'var(--strand)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="1.2"/>';
      s += '<text x="' + (20 + i * w + (w - 18) / 2) + '" y="' + (base + 22) + '" text-anchor="middle" font-size="18" class="tb">' + v + '</text>';
    });
    var my = base - mean * u;
    s += '<line x1="10" y1="' + my + '" x2="' + (20 + vals.length * w) + '" y2="' + my + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="7 5"/>';
    return A.svg(Math.max(300, 30 + vals.length * w), base + 30, s, 'Towers of ' + vals.join(', ') + ' cubes, with a line at ' + mean);
  }
  function spinner(red, blue, label) {
    var n = red + blue, r = 90, cx = 100, cy = 100, s = '';
    if (!n) return A.svg(200, 200, '<circle cx="100" cy="100" r="90" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>', 'An empty spinner');
    for (var i = 0; i < n; i++) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n, col = i < red ? 'var(--bad)' : 'var(--sb)';
      s += n === 1 ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2.5"/>' :
        '<path d="M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + ' Z" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2.5"/>';
    }
    s += '<line x1="100" y1="100" x2="100" y2="30" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="8" style="fill:var(--ink)"/>';
    return A.svg(200, 200, s, label || 'Spinner with ' + red + ' red and ' + blue + ' blue equal parts');
  }
  function likely(fav, total) { return fav === 0 ? 'impossible' : fav === total ? 'certain' : fav * 2 === total ? 'equally likely' : fav * 2 < total ? 'unlikely' : 'likely'; }
  var SETS = {
    sport: { t: 'Favourite sport', src: 'Room 12 survey', d: [['Hockey', 12], ['Soccer', 9], ['Swim', 6], ['Basketball', 4]] },
    fruit: { t: 'Favourite fruit', src: 'Grade 3 survey', d: [['Apple', 8], ['Banana', 5], ['Grapes', 10], ['Orange', 3]] },
    pets: { t: 'Pets at home', src: 'Class interviews', d: [['Dog', 14], ['Cat', 10], ['Fish', 4], ['None', 7]] }
  };

  /* ---------- Lessons: one idea per screen ---------- */
  var CH = 'data';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function cap(t) { return t ? '<p class="g3-sym" style="font-size:1.1rem;color:var(--ink)">' + t + '</p>' : ''; }
  var SORTQ = [20, 3, 12, 17, 8, 25, 30, 6];
  function region(n, a, b) { var x = ATTR[a][1](n), y = ATTR[b][1](n); return x && y ? 'ab' : x ? 'a' : y ? 'b' : 'none'; }
  var SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];
  function survey(v) {
    return '<div class="tbl"><table><thead><tr><th class="l">Season</th><th class="l">Tally</th><th>Frequency</th></tr></thead><tbody>' + SEASONS.map(function (n, i) { return '<tr><td class="l">' + n + '</td><td class="l">' + (v[i] ? tally(v[i]) : '') + '</td><td>' + v[i] + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function modeOf(v) { var c = {}, best = 0, m = []; v.forEach(function (x) { c[x] = (c[x] || 0) + 1; best = Math.max(best, c[x]); }); Object.keys(c).forEach(function (k) { if (c[k] === best && best > 1) m.push(+k); }); return m.sort(function (a, b) { return a - b; }); }
  function vals5(s) { return [s.x0, s.x1, s.x2, s.x3, s.x4]; }
  function dotRow(v, hi) {
    var s = '', sorted = v.slice().sort(function (a, b) { return a - b; });
    sorted.forEach(function (x, i) { var on = hi && hi.indexOf(x) >= 0; s += '<rect x="' + (6 + i * 58) + '" y="6" width="50" height="50" rx="10" style="fill:' + (on ? 'var(--hi)' : 'var(--card)') + ';stroke:' + (on ? 'var(--ink)' : 'var(--line)') + '" stroke-width="2.5"/><text x="' + (31 + i * 58) + '" y="40" text-anchor="middle" font-size="24" class="tb">' + x + '</text>'; });
    return A.svg(sorted.length * 58 + 8, 62, s, 'Values in order: ' + sorted.join(', '));
  }

  var LESSONS = [
    { id: 'sort', title: 'Sorting with diagrams', sub: 'Sort by attributes.', concepts: [
      { id: 'venn', title: 'Venn diagrams', exp: ['D1.1'], skill: 'dt-venn',
        body: '<p>A <b>Venn diagram</b> sorts things with circles. Each circle is an <b>attribute</b>, like "even". Things that fit both go in the <b>overlap</b>. Things that fit neither go outside.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + venn(SORTQ.slice(0, s.k), 'even', 'gt15').svg + cap(s.say) + '</div>'; }, { k: 0, say: '' }), steps: [
          { say: 'Two circles: "Even" and "Greater than 15".', ms: 1500 },
          { say: '20 is even and greater than 15. It goes in the overlap.', act: function (t) { return t.set({ k: 1, say: '20: both' }, 1800); } },
          { say: '3 is neither, so it goes outside. 12 is even only. 17 is greater than 15 only.', act: function (t) { return t.seq([{ k: 2, say: '3: neither' }, { k: 3, say: '12: even only' }, { k: 4, say: '17: greater than 15 only' }], 1100); } },
          { say: 'Ask two questions for each number: <b>Even? Greater than 15?</b>', ms: 2000 }
        ] },
        try: { mount: G3.play({ state: { i: 0, note: '' }, draw: function (s) { return venn(SORTQ.slice(0, s.i), 'even', 'gt15').svg; },
          buttons: [['a', 'Even only'], ['b', 'Greater than 15 only'], ['ab', 'Both'], ['none', 'Neither']].map(function (r) { return { label: r[1], act: function (s) { if (s.i >= SORTQ.length) return; var n = SORTQ[s.i]; if (region(n, 'even', 'gt15') === r[0]) { s.i++; s.note = ''; } else s.note = 'Not quite. Is ' + n + ' even? Is it greater than 15?'; } }; }),
          info: function (s) { return s.i < SORTQ.length ? (s.note || '') + ' Where does <b class="big">' + SORTQ[s.i] + '</b> go?' : 'All sorted.'; },
          tasks: [{ do: 'Sort each number into the right place.', goal: function (s) { return s.i === SORTQ.length; }, yes: 'Every number is in its place.' }] }), do: '' },
        key: '<p>Ask <b>one question per circle</b>. Yes to both? The overlap.</p>',
        mistake: '<p>Putting a number that fits both circles in only one of them. Ask both questions every time.</p>',
        check: [TU('s1', 0), TU('s1', 1), TU('s1', 2), SK('dt-venn', 1)] },

      { id: 'carroll', title: 'Carroll and tree diagrams', exp: ['D1.1'], skill: 'dt-venn', hard: true,
        body: '<p>A <b>Carroll diagram</b> sorts with a table: one attribute for the rows, one for the columns. A <b>tree diagram</b> asks yes or no questions, one attribute at a time.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + (s.t === 'v' ? venn(NUMS, 'even', 'gt15').svg : carroll(NUMS, 'even', 'gt15')) + cap(s.say) + '</div>'; }, { t: 'v', say: 'A Venn diagram' }), steps: [
          { say: 'Here are 12 numbers in a Venn diagram.', ms: 1500 },
          { say: 'The same sort in a Carroll diagram. The overlap becomes the top-left box.', act: function (t) { return t.set({ t: 'c', say: 'The same sort as a table' }, 2200); } }
        ] },
        ways: [
          { label: 'Tree diagram', html: '<p>Is 22 even? <b>Yes</b>. Is it greater than 15? <b>Yes</b>. Is it a multiple of 5? <b>No</b>. Each question is one branch. Three questions sort by three attributes.</p>' },
          { label: 'Match the boxes', html: '<div class="tbl"><table><tbody><tr><td><b>Both</b> (overlap)</td><td>Even, not greater than 15</td></tr><tr><td>Greater than 15, not even</td><td><b>Neither</b> (outside)</td></tr></tbody></table></div>' }
        ],
        try: { mount: G3.play({ state: { a: 'even', b: 'gt15', t: 'carroll' }, draw: function (s) { return s.t === 'venn' ? venn(NUMS, s.a, s.b).svg : carroll(NUMS, s.a, s.b); },
          selects: [{ key: 'a', label: 'First attribute', options: [['even', 'Even'], ['odd', 'Odd'], ['lt10', 'Less than 10']] }, { key: 'b', label: 'Second attribute', options: [['gt15', 'Greater than 15'], ['m5', 'Multiple of 5']] }, { key: 't', label: 'Diagram', options: [['venn', 'Venn'], ['carroll', 'Carroll']] }],
          tasks: [{ do: 'Sort by <b>Odd</b> and <b>Multiple of 5</b> in a Carroll diagram.', goal: function (s) { return s.a === 'odd' && s.b === 'm5' && s.t === 'carroll'; }, yes: '15 and 25 are odd multiples of 5.' }] }), do: '' },
        key: '<p>Rows: one attribute. Columns: the other.</p>',
        check: [SK('dt-venn', 2), SK('dt-venn', 3)] }
    ] },

    { id: 'collect', title: 'Collecting data', sub: 'Ask, watch or test, then keep count.', concepts: [
      { id: 'kinds', title: 'Kinds of data', exp: ['D1.2'], skill: 'dt-picto',
        body: '<p>To answer a question, collect <b>data</b>. Data in words, like "apple", is <b>qualitative</b>. Data in numbers, like "8 cm tall", is <b>quantitative</b>.</p>',
        watch: { mount: G3.view(function (s) { var rows = [['What is your favourite fruit?', 'apple, grapes', 'words: qualitative'], ['How tall is your plant?', '8 cm, 12 cm', 'numbers: quantitative'], ['How many pets do you have?', '0, 2, 1', 'numbers: quantitative']].slice(0, s.k); return '<div class="tbl"><table><thead><tr><th class="l">Question</th><th class="l">Answers</th><th class="l">Kind of data</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td class="l">' + r[0] + '</td><td class="l">' + r[1] + '</td><td class="l"><b>' + r[2] + '</b></td></tr>'; }).join('') + '</tbody></table></div>' + cap(s.say); }, { k: 0, say: '' }), steps: [
          { say: 'Ask a question. Look at the answers.', act: function (t) { return t.set({ k: 1 }, 1600); } },
          { say: 'Measure something: the answers are numbers.', act: function (t) { return t.set({ k: 2 }, 1600); } },
          { say: 'Count something: numbers again. <b>Words: qualitative. Numbers: quantitative.</b>', act: function (t) { return t.set({ k: 3 }, 2000); } }
        ] },
        key: '<p>Words: <b>qualitative</b>. Numbers: <b>quantitative</b>.</p>',
        check: [TU('s2', 1), G3.turn({ q: 'You ask "What is your favourite colour?" The answers are:', options: ['qualitative data', 'quantitative data'], answer: 0, why: 'The answers are words, like "blue".' })] },

      { id: 'tally', title: 'Tally marks and tables', exp: ['D1.2'], skill: 'dt-picto',
        body: '<p>Keep count with <b>tally marks</b>. Every fifth mark crosses the other four, so you can count by 5s. A <b>frequency table</b> shows how many of each.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + tally(s.n) + cap(s.say) + '</div>'; }, { n: 0, say: '' }), steps: [
          { say: 'One mark for each vote.', act: function (t) { return t.seq([{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }], 450); } },
          { say: 'The fifth mark crosses the other four.', act: function (t) { return t.set({ n: 5, say: '5' }, 1300); } },
          { say: 'Keep going: 5, 10, then 11, 12, 13. <b>13 votes</b>.', act: function (t) { var p = []; for (var i = 6; i <= 13; i++) p.push({ n: i, say: i > 10 ? '10, ' + i : String(i) }); return t.seq(p, 380); } }
        ] },
        try: { mount: G3.play({ state: { v: [0, 0, 0, 0] }, draw: function (s) { return survey(s.v); },
          buttons: SEASONS.map(function (n, i) { return { label: n, act: function (s) { if (s.v[i] < 30) s.v[i]++; } }; }).concat([{ label: 'Start over', act: function (s) { s.v = [0, 0, 0, 0]; } }]),
          info: function (s) { var t = s.v.reduce(function (x, y) { return x + y; }, 0); return t + ' vote' + (t === 1 ? '' : 's') + ' in all.'; },
          tasks: [{ do: 'Record this survey: <b>Winter 3, Spring 2, Summer 7, Fall 5</b>.', goal: function (s) { return s.v.join() === '3,2,7,5'; }, yes: 'Summer has a group of 5 and 2 more: 7.' }] }), do: '' },
        key: '<p>Count tallies <b>by 5s, then by 1s</b>.</p>',
        mistake: '<p>Counting a tally of 5 as 4. The slanted mark is the fifth one. A tally of 3 groups of 5 and 2 more is 17.</p>',
        check: [TU('s2', 0), TU('s2', 2)] }
    ] },

    { id: 'graphs', title: 'Pictographs and bar graphs', sub: 'Read the key and the scale.', concepts: [
      { id: 'picto', title: 'Read a pictograph', exp: ['D1.3', 'D1.5'], skill: 'dt-picto',
        body: '<p>In a <b>pictograph</b>, one picture can stand for more than one. The <b>key</b> tells you how many. Half a picture is half that many.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + picto('Favourite activity', [['Swim', s.v]], 2, s.src ? 'Room 12 survey' : '') + cap(s.say) + '</div>'; }, { v: 0, src: false, say: '' }), steps: [
          { say: 'The key says 1 picture = 2 votes.', ms: 1500 },
          { say: 'Count by 2s: 2, 4, 6.', act: function (t) { return t.seq([{ v: 2, say: '2' }, { v: 4, say: '4' }, { v: 6, say: '6' }], 700); } },
          { say: 'Half a picture is half of 2, which is 1. Swim has <b>7 votes</b>.', act: function (t) { return t.set({ v: 7, say: '6 + 1 = 7', src: true }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { set: 'fruit', k: 2 }, draw: function (s) { var d = SETS[s.set]; return picto(d.t, d.d, s.k, d.src); },
          selects: [{ key: 'set', label: 'Data', options: [['sport', 'Favourite sport'], ['fruit', 'Favourite fruit'], ['pets', 'Pets at home']] }, { key: 'k', label: '1 picture =', options: [[1, '1'], [2, '2'], [5, '5']] }],
          tasks: [{ do: 'Change the key so <b>Pets at home</b> uses the fewest pictures.', goal: function (s) { return s.set === 'pets' && s.k === 5; }, yes: 'With a key of 5, Dog (14) is 2 pictures and part of one.' }] }), do: '' },
        key: '<p>Read the <b>key</b> first. Count by it.</p>',
        mistake: '<p>Counting pictures instead of votes. Point to the key and count by it out loud.</p>',
        check: [TU('s3', 0), TU('s3', 1), SK('dt-picto', 1)] },

      { id: 'bar', title: 'Read a bar graph', exp: ['D1.3', 'D1.5'], skill: 'dt-bar', hard: true,
        body: '<p>In a <b>bar graph</b>, read the <b>scale</b> on the side. It might count by 1s, 2s, 5s or 10s. A bar between two lines is between those numbers. Every graph needs a title, labels and a source.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + bars('Favourite sport', SETS.sport.d, s.c, 'Room 12 survey') + cap(s.say) + '</div>'; }, { c: 2, say: 'Scale counts by 2' }), steps: [
          { say: 'This scale counts by 2. Hockey reaches 12.', ms: 1800 },
          { say: 'Soccer stops halfway between 8 and 10. That is 9.', act: function (t) { return t.set({ say: 'Soccer: 9' }, 1800); } },
          { say: 'Change the scale to count by 5. Same data, the bars look the same, but the lines change.', act: function (t) { return t.set({ c: 5, say: 'Scale counts by 5' }, 2000); } }
        ] },
        ways: [
          { label: 'Compare two bars', html: '<p>How many more chose Hockey than Swim? Read both: 12 and 6. Subtract: 12 &minus; 6 = <b>6</b>.</p>' },
          { label: 'Same data, two graphs', html: '<div class="fig">' + picto('Favourite sport', SETS.sport.d, 2) + '</div><p>The pictograph and the bar graph show the same votes.</p>' }
        ],
        try: { mount: G3.play({ state: { set: 'sport', c: 2 }, draw: function (s) { var d = SETS[s.set]; return bars(d.t, d.d, s.c, d.src); },
          selects: [{ key: 'set', label: 'Data', options: [['sport', 'Favourite sport'], ['fruit', 'Favourite fruit'], ['pets', 'Pets at home']] }, { key: 'c', label: 'Scale counts by', options: [[1, '1'], [2, '2'], [5, '5'], [10, '10']] }],
          tasks: [{ do: 'Show <b>Pets at home</b> with a scale that counts by <b>5</b>. Read the Cat bar.', goal: function (s) { return s.set === 'pets' && s.c === 5; }, yes: 'Cat reaches the 10 line exactly: 10.' }] }), do: '' },
        key: '<p>Read the <b>scale</b>. Between lines? Find the middle.</p>',
        mistake: '<p>Assuming every line is 1. Ask: "What does the scale count by?"</p>',
        check: [TU('s3', 2), SK('dt-bar', 1), SK('dt-bar', 2)] }
    ] },

    { id: 'average', title: 'Mode and mean', sub: 'Most common, and fair share.', concepts: [
      { id: 'mode', title: 'The mode', exp: ['D1.4'], skill: 'dt-mode',
        body: '<p>The <b>mode</b> is the value that shows up most often. Put the values in order to spot it. A set can have one mode, more than one, or none.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + (s.sorted ? dotRow(s.v, s.hi) : A.svg(s.v.length * 58 + 8, 62, s.v.map(function (x, i) { return '<rect x="' + (6 + i * 58) + '" y="6" width="50" height="50" rx="10" style="fill:var(--card);stroke:var(--line)" stroke-width="2.5"/><text x="' + (31 + i * 58) + '" y="40" text-anchor="middle" font-size="24" class="tb">' + x + '</text>'; }).join(''), 'Values: ' + s.v.join(', '))) + cap(s.say) + '</div>'; }, { v: [4, 7, 2, 7, 4, 7], sorted: false, hi: null, say: '' }), steps: [
          { say: '4, 7, 2, 7, 4, 7. Which shows up most?', ms: 1600 },
          { say: 'Put them in order.', act: function (t) { return t.set({ sorted: true }, 1500); } },
          { say: '7 shows up 3 times. The mode is <b>7</b>.', act: function (t) { return t.set({ hi: [7], say: 'Mode: 7' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { x0: 3, x1: 5, x2: 5, x3: 8, x4: 9 }, draw: function (s) { return dotRow(vals5(s), modeOf(vals5(s))); },
          sliders: [0, 1, 2, 3, 4].map(function (i) { return { key: 'x' + i, label: 'Value ' + (i + 1), min: 1, max: 9 }; }),
          info: function (s) { var m = modeOf(vals5(s)); return m.length ? 'Mode: <b>' + m.join(' and ') + '</b>' : '<b>No mode</b>: every value shows up once.'; },
          tasks: [{ do: 'Change the values so there is <b>no mode</b>.', goal: function (s) { return modeOf(vals5(s)).length === 0; }, yes: 'Every value is different, so no mode.' },
            { do: 'Now make <b>two modes</b>.', reset: false, goal: function (s) { return modeOf(vals5(s)).length === 2; }, yes: function (s) { return 'Modes: ' + modeOf(vals5(s)).join(' and ') + '.'; } }] }), do: '' },
        key: '<p>Mode: <b>the most common value</b>.</p>',
        check: [TU('s4', 0), TU('s4', 2), SK('dt-mode', 1)] },

      { id: 'mean', title: 'The mean: a fair share', exp: ['D1.4'], skill: 'dt-mean', hard: true,
        body: '<p>The <b>mean</b> is a fair share. Move cubes until all the towers are the same height. That height is the mean. Or: <b>add all the values, then divide</b> by how many there are.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + towerFig(s.v, 5) + cap(s.say) + '</div>'; }, { v: [3, 7, 4, 6], say: '3, 7, 4, 6' }), steps: [
          { say: 'Four towers: 3, 7, 4 and 6 cubes.', ms: 1500 },
          { say: 'Move a cube from the tallest to the shortest.', act: function (t) { return t.set({ v: [4, 6, 4, 6], say: '4, 6, 4, 6' }, 1400); } },
          { say: 'And again.', act: function (t) { return t.set({ v: [5, 5, 5, 5], say: '5, 5, 5, 5' }, 1400); } },
          { say: 'All 5. The mean is <b>5</b>. Check: 3 + 7 + 4 + 6 = 20, and 20 &divide; 4 = 5.', ms: 2200 }
        ] },
        ways: [
          { label: 'Add, then share', html: '<p>4, 6 and 8 books. 4 + 6 + 8 = 18. Share among 3: 18 &divide; 3 = <b>6</b>.</p><div class="fig">' + towerFig([4, 6, 8], 6) + '</div>' },
          { label: 'Balance it out', html: '<p>8 is 2 more than 6, and 4 is 2 less. They balance out at 6.</p>' }
        ],
        try: { mount: G3.play({ state: { a: 2, b: 8, c: 5 }, draw: function (s) { var sum = s.a + s.b + s.c; return towerFig([s.a, s.b, s.c], sum % 3 ? sum / 3 : sum / 3); },
          sliders: [{ key: 'a', label: 'Tower 1', min: 1, max: 9 }, { key: 'b', label: 'Tower 2', min: 1, max: 9 }, { key: 'c', label: 'Tower 3', min: 1, max: 9 }],
          info: function (s) { var sum = s.a + s.b + s.c; return s.a + ' + ' + s.b + ' + ' + s.c + ' = ' + sum + '. ' + (sum % 3 ? sum + ' does not share evenly by 3.' : 'Mean: <b>' + sum / 3 + '</b>'); },
          tasks: [{ do: 'Move one cube at a time until all 3 towers are level.', goal: function (s) { return s.a === 5 && s.b === 5 && s.c === 5; }, yes: 'All 5. The mean of 2, 8 and 5 is 5.' }] }), do: '' },
        key: '<p>Mean: <b>add, then divide by how many</b>.</p>',
        mistake: '<p>Mixing up mean and mode. Mode = most common. Mean = fair share. In 2, 2, 8 the mode is 2, but the mean is 12 &divide; 3 = 4.</p>',
        check: [TU('s4', 1), SK('dt-mean', 1), SK('dt-mean', 2)] }
    ] },

    { id: 'chance', title: 'How likely is it?', sub: 'From impossible to certain.', concepts: [
      { id: 'words', title: 'Words for chance', exp: ['D2.1'], skill: 'dt-chance',
        body: '<p>We say how likely something is with words: <b>impossible</b>, <b>unlikely</b>, <b>equally likely</b>, <b>likely</b>, <b>certain</b>.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + spinner(s.r, s.b) + cap(s.say) + '</div>'; }, { r: 0, b: 4, say: '' }), steps: [
          { say: 'No red parts. Red is <b>impossible</b>.', act: function (t) { return t.set({ say: 'Red: impossible' }, 1600); } },
          { say: '1 red, 3 blue. Red is <b>unlikely</b>.', act: function (t) { return t.set({ r: 1, b: 3, say: 'Red: unlikely' }, 1600); } },
          { say: '2 red, 2 blue. <b>Equally likely</b>.', act: function (t) { return t.set({ r: 2, b: 2, say: 'Equally likely' }, 1600); } },
          { say: '3 red, 1 blue. Red is <b>likely</b>.', act: function (t) { return t.set({ r: 3, b: 1, say: 'Red: likely' }, 1600); } },
          { say: 'All red. Red is <b>certain</b>.', act: function (t) { return t.set({ r: 4, b: 0, say: 'Red: certain' }, 1800); } }
        ] },
        try: { mount: G3.play({ state: { r: 2, b: 3 }, draw: function (s) { return spinner(s.r, s.b); },
          sliders: [{ key: 'r', label: 'Red parts', min: 0, max: 8 }, { key: 'b', label: 'Blue parts', min: 0, max: 8 }],
          info: function (s) { return s.r + s.b ? 'Red is <b>' + likely(s.r, s.r + s.b) + '</b>. Blue is <b>' + likely(s.b, s.r + s.b) + '</b>.' : 'Add some parts.'; },
          tasks: [{ do: 'Make <b>blue certain</b>.', goal: function (s) { return s.b > 0 && s.r === 0; }, yes: 'All blue: blue is certain, red is impossible.' },
            { do: 'Make red and blue <b>equally likely</b>.', reset: false, goal: function (s) { return s.r > 0 && s.r === s.b; }, yes: 'Same number of parts: equally likely.' }] }), do: '' },
        key: '<p>Impossible, unlikely, equally likely, likely, certain.</p>',
        check: [TU('s5', 0), TU('s5', 1), SK('dt-chance', 1)] },

      { id: 'test', title: 'Predict, then test', exp: ['D2.1', 'D2.2'], skill: 'dt-chance', hard: true,
        body: '<p>Make a <b>prediction</b>, then collect data to test it. The results change a little each time, but the more likely outcome usually wins.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + spinner(1, 3) + (s.c ? bars('20 spins', [['Red', s.c[0]], ['Blue', s.c[1]]], 2, 'Our spins', 'Number of spins') : '') + cap(s.say) + '</div>'; }, { c: null, say: 'Predict: blue is likely.' }), steps: [
          { say: '1 red, 3 blue. Predict: blue is likely.', ms: 1500 },
          { say: 'Spin 20 times: 6 red, 14 blue.', act: function (t) { return t.set({ c: [6, 14], say: '6 red, 14 blue' }, 1800); } },
          { say: 'Spin 20 more: 4 red, 16 blue. Different, but <b>blue wins both times</b>.', act: function (t) { return t.set({ c: [4, 16], say: '4 red, 16 blue' }, 2200); } }
        ] },
        ways: [
          { label: 'A bag of cubes', html: '<p>9 green and 1 yellow cube. Pick one, put it back, 10 times. You will get mostly green, but maybe a yellow or two.</p>' },
          { label: 'Different groups', html: '<p>If one class picks hockey most, another class might pick soccer. Data from a different group can come out differently.</p>' }
        ],
        try: { mount: G3.play({ state: { r: 1, b: 4, c: null, n: 0 }, draw: function (s) { return spinner(s.r, s.b) + (s.c ? bars('20 spins', [['Red', s.c[0]], ['Blue', s.c[1]]], 2, 'Your spins', 'Number of spins') : ''); },
          sliders: [{ key: 'r', label: 'Red parts', min: 0, max: 8 }, { key: 'b', label: 'Blue parts', min: 0, max: 8 }],
          buttons: [{ label: 'Spin 20 times', act: function (s) { if (!(s.r + s.b)) return; var c = [0, 0]; for (var i = 0; i < 20; i++) c[Math.random() * (s.r + s.b) < s.r ? 0 : 1]++; s.c = c; s.n++; } }],
          info: function (s) { return s.c ? s.c[0] + ' red, ' + s.c[1] + ' blue.' : 'Predict first: which colour will win?'; },
          tasks: [{ do: 'Make red <b>likely</b>, then spin 20 times. Was your prediction right?', goal: function (s) { return s.r > s.b && s.b > 0 && s.c; }, yes: function (s) { return s.c[0] > s.c[1] ? 'Red won, as predicted.' : 'Blue won this time. That can happen. Spin again.'; } }] }), do: '' },
        key: '<p>Predict, test, <b>compare</b>.</p>',
        mistake: '<p>Thinking "likely" means "always". A likely outcome can still lose sometimes. Spin a few rounds together.</p>',
        check: [TU('s5', 2), SK('dt-chance', 2), SK('dt-chance', 3)] }
    ] }
  ];

  A.register('data', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Sorting with diagrams</h2>' +
'<p>We can sort things by their <b>attributes</b>, like "even" or "greater than 15". A <b>Venn diagram</b> uses circles. Things that fit both go where the circles overlap. A <b>Carroll diagram</b> uses a table with rows and columns.</p>' +
'<div class="lab"><span class="lt">Try it: sort 12 numbers</span>' +
'<p class="t2" style="margin:.2em 0">Numbers: ' + NUMS.join(', ') + '</p>' +
'<div class="ctrl"><label for="vna">First attribute<select id="vna"><option value="even" selected>Even</option><option value="odd">Odd</option><option value="lt10">Less than 10</option></select></label>' +
'<label for="vnb">Second attribute<select id="vnb"><option value="gt15" selected>Greater than 15</option><option value="m5">Multiple of 5</option></select></label>' +
'<label for="vnt">Diagram<select id="vnt"><option value="venn">Venn</option><option value="carroll">Carroll</option></select></label></div>' +
'<div class="fig" id="vnfig"></div><div class="out" id="vnout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To sort by three attributes, use a <b>tree diagram</b>. Each branch asks a yes or no question, one attribute at a time.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Where does 20 go in the Venn diagram for "Even" and "Greater than 15"? 20 is even. 20 is greater than 15. It fits both, so it goes in the <b>middle</b>, where the circles overlap.</p></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Collecting data and tallies</h2>' +
'<p>To answer a question, collect <b>data</b>. You can ask people (an interview), watch (an observation), or test (an experiment). Data in words, like "apple", is <b>qualitative</b>. Data in numbers, like "8 cm tall", is <b>quantitative</b>.</p>' +
'<p>Keep count with <b>tally marks</b>. Every fifth mark crosses the other four, so you can count by 5s. A <b>frequency table</b> shows how many of each.</p>' +
'<div class="lab"><span class="lt">Try it: run a class survey</span>' +
'<p style="margin:.2em 0">Question: <b>What is your favourite season?</b> Tap to add a vote.</p>' +
'<div class="btnrow"><button type="button" class="btn alt" data-v="0">Winter</button><button type="button" class="btn alt" data-v="1">Spring</button><button type="button" class="btn alt" data-v="2">Summer</button><button type="button" class="btn alt" data-v="3">Fall</button><button type="button" class="btn alt" id="svreset">Start over</button></div>' +
'<div class="tbl" id="svtbl"></div><div class="fig" id="svfig"></div><div class="out" id="svout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting a tally of 5 as 4. The slanted mark is the fifth one. A tally of 3 groups of 5 and 2 more is 17.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Read this tally: two groups of 5 and 3 more. Count by 5s: 5, 10, then 11, 12, 13. That is <b>13</b>.</p><div class="fig">' + tally(13) + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Pictographs and bar graphs</h2>' +
'<p>Graphs show data as a picture. In a <b>pictograph</b>, one picture can stand for more than one, like 2 votes. Check the <b>key</b>. In a <b>bar graph</b>, read the <b>scale</b> on the side. It might count by 1s, 2s, 5s or 10s. Every graph needs a <b>title</b>, <b>labels</b> and a <b>source</b>, which tells where the data came from.</p>' +
'<div class="lab"><span class="lt">Try it: change the key and the scale</span>' +
'<div class="ctrl"><label for="gds">Data<select id="gds"><option value="sport">Favourite sport</option><option value="fruit">Favourite fruit</option><option value="pets">Pets at home</option></select></label>' +
'<label for="gdk">Pictograph key: 1 picture =<select id="gdk"><option>1</option><option selected>2</option><option>5</option></select></label>' +
'<label for="gdc">Bar graph scale counts by<select id="gdc"><option>1</option><option selected>2</option><option>5</option><option>10</option></select></label></div>' +
'<div class="fig" id="gdpic"></div><div class="fig" id="gdbar"></div><div class="out" id="gdout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The same data can look different when the key or scale changes. Always read the key or scale before you count.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>The key says 1 picture = 2 votes. Swim has 3 pictures and half a picture. Count by 2s: 2, 4, 6. Half a picture is half of 2, which is 1. Swim has <b>7 votes</b>.</p><div class="fig">' + picto('Favourite activity', [['Swim', 7]], 2) + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Mean and mode</h2>' +
'<p>The <b>mode</b> is the value that shows up most often. A data set can have one mode, more than one mode, or no mode.</p>' +
'<p>The <b>mean</b> is a fair share. Imagine making all the towers the same height by moving cubes. The height they all end up at is the mean. To find it, add all the values, then divide by how many values there are.</p>' +
'<div class="lab"><span class="lt">Try it: level the towers</span>' +
'<div class="ctrl"><label for="mt1">Tower 1: <output id="mt1o"></output><input type="range" id="mt1" min="1" max="9" value="3"></label><label for="mt2">Tower 2: <output id="mt2o"></output><input type="range" id="mt2" min="1" max="9" value="7"></label>' +
'<label for="mt3">Tower 3: <output id="mt3o"></output><input type="range" id="mt3" min="1" max="9" value="4"></label><label for="mt4">Tower 4: <output id="mt4o"></output><input type="range" id="mt4" min="1" max="9" value="6"></label></div>' +
'<div class="fig" id="mtfig"></div><div class="out" id="mtout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up mean and mode. Mode = most common. Mean = fair share. In 2, 2, 8 the mode is 2, but the mean is 12 &divide; 3 = 4.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Three friends read 4, 6 and 8 books. Add: 4 + 6 + 8 = 18. Share among 3: 18 &divide; 3 = 6. The mean is <b>6 books</b>. Every value is different, so there is <b>no mode</b>.</p><div class="fig">' + towerFig([4, 6, 8], 6) + '</div></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>How likely is it?</h2>' +
'<p>We use words to say how likely something is: <b>impossible</b>, <b>unlikely</b>, <b>equally likely</b>, <b>likely</b>, <b>certain</b>. If something is impossible, its opposite is certain.</p>' +
'<div class="lab"><span class="lt">Try it: build a spinner</span>' +
'<div class="ctrl"><label for="spr">Red parts: <output id="spro"></output><input type="range" id="spr" min="0" max="8" value="3"></label><label for="spb">Blue parts: <output id="spbo"></output><input type="range" id="spb" min="0" max="8" value="5"></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="spgo">Spin 20 times</button></div>' +
'<div class="fig" id="spfig"></div><div class="out" id="spout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Data from a different group can come out differently. If one class has a mode of "hockey", another class might have "soccer". Make a prediction, then collect data to test it.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A bag has 9 green cubes and 1 yellow cube. Picking green is <b>likely</b>. Picking yellow is <b>unlikely</b>. Picking purple is <b>impossible</b>.</p></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'Where does 12 go? Circles: "Even" and "Greater than 15".', options: ['Even only', 'Greater than 15 only', 'Both', 'Neither'], answer: 0, why: '12 is even, but 12 is not greater than 15.' },
        { q: 'Where does 17 go? Circles: "Even" and "Greater than 15".', options: ['Even only', 'Greater than 15 only', 'Both', 'Neither'], answer: 1, why: '17 is odd, and 17 is greater than 15.' },
        { q: 'Where does 7 go? Circles: "Even" and "Greater than 15".', options: ['Even only', 'Greater than 15 only', 'Both', 'Neither'], answer: 3, why: '7 is odd and less than 15, so it goes outside both circles.' }
      ],
      s2: [
        { q: 'How many does this tally show?', fig: tally(8), options: ['5', '8', '9'], answer: 1, why: 'One group of 5, then 3 more: 5, 6, 7, 8.' },
        { q: 'Which question gives quantitative data?', options: ['What is your favourite colour?', 'How many pets do you have?', 'What is your favourite game?'], answer: 1, why: 'Quantitative data is numbers. The answer to "how many" is a number.' },
        { q: 'How many does this tally show?', fig: tally(15), options: ['13', '15', '18'], answer: 1, why: 'Three groups of 5: 5, 10, 15.' }
      ],
      s3: [
        { q: 'Key: 1 picture = 2 votes. Soccer has 4 pictures. How many votes?', options: ['4', '6', '8'], answer: 2, why: 'Count by 2s for each picture: 2, 4, 6, 8.' },
        { q: 'Key: 1 picture = 2 votes. Swim has 3 and a half pictures. How many votes?', options: ['6', '7', '8'], answer: 1, why: '3 pictures are 6 votes. Half a picture is 1 vote. 6 + 1 = 7.' },
        { q: 'A bar ends halfway between 10 and 20 on the scale. What does it show?', options: ['12', '15', '18'], answer: 1, why: 'Halfway between 10 and 20 is 15.' }
      ],
      s4: [
        { q: 'What is the mode of 3, 5, 5, 6, 9?', options: ['5', '6', '9'], answer: 0, why: '5 shows up twice. Every other value shows up once.' },
        { q: 'What is the mean of 2, 4, 6?', options: ['4', '6', '12'], answer: 0, why: 'Add: 2 + 4 + 6 = 12. Share among 3: 12 &divide; 3 = 4.' },
        { q: 'Does 1, 4, 7, 8 have a mode?', options: ['Yes, 4', 'Yes, 8', 'No mode'], answer: 2, why: 'Each value shows up only once, so there is no mode.' }
      ],
      s5: [
        { q: 'A spinner is all blue. Spinning blue is:', options: ['certain', 'likely', 'impossible'], answer: 0, why: 'Every part is blue, so it must land on blue.' },
        { q: 'A spinner has 1 red part and 1 blue part, the same size. Spinning red is:', options: ['unlikely', 'equally likely', 'certain'], answer: 1, why: 'Red and blue have the same amount of space.' },
        { q: 'A bag has 2 red and 8 blue cubes. Picking red is:', options: ['likely', 'unlikely', 'impossible'], answer: 1, why: 'There are fewer red cubes than blue cubes, but red is still possible.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function vn() {
        var a = $('#vna', root).value, b = $('#vnb', root).value, t = $('#vnt', root).value;
        var v = venn(NUMS, a, b);
        $('#vnfig', root).innerHTML = t === 'venn' ? v.svg : carroll(NUMS, a, b);
        $('#vnout', root).innerHTML = '<p><b>Both:</b> ' + (v.reg.ab.join(', ') || 'none') + '. <b>' + ATTR[a][0] + ' only:</b> ' + (v.reg.a.join(', ') || 'none') + '. <b>' + ATTR[b][0] + ' only:</b> ' + (v.reg.b.join(', ') || 'none') + '. <b>Neither:</b> ' + (v.reg.none.join(', ') || 'none') + '.</p>';
      }
      A.bind(root, ['vna', 'vnb', 'vnt'], vn);
      var votes = [3, 5, 8, 6], names = ['Winter', 'Spring', 'Summer', 'Fall'];
      function sv() {
        $('#svtbl', root).innerHTML = '<table><thead><tr><th class="l">Season</th><th class="l">Tally</th><th>Frequency</th></tr></thead><tbody>' + names.map(function (n, i) { return '<tr><td class="l">' + n + '</td><td class="l">' + tally(votes[i]) + '</td><td>' + votes[i] + '</td></tr>'; }).join('') + '</tbody></table>';
        var tot = votes.reduce(function (x, y) { return x + y; }, 0), mx = Math.max.apply(null, votes), top = names.filter(function (n, i) { return votes[i] === mx && mx > 0; });
        $('#svfig', root).innerHTML = tot ? bars('Favourite season', names.map(function (n, i) { return [n, votes[i]]; }), mx > 20 ? 5 : mx > 10 ? 2 : 1, 'Our class survey') : '';
        $('#svout', root).innerHTML = '<p>' + tot + ' votes in all.' + (top.length ? ' Most votes: <b>' + top.join(' and ') + '</b> (' + mx + ').' : '') + '</p>';
      }
      root.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-v'); if (votes[i] < 40) votes[i]++; sv(); }); });
      $('#svreset', root).addEventListener('click', function () { votes = [0, 0, 0, 0]; sv(); });
      sv();
      function gd() {
        var d = SETS[$('#gds', root).value], k = +$('#gdk', root).value, c = +$('#gdc', root).value;
        $('#gdpic', root).innerHTML = picto(d.t, d.d, k, d.src);
        $('#gdbar', root).innerHTML = bars(d.t, d.d, c, d.src);
        var first = d.d[0], pics = first[1] / k;
        $('#gdout', root).innerHTML = '<p>' + first[0] + ' has ' + first[1] + ' votes. With a key of ' + k + ', that is ' + (pics === Math.floor(pics) ? pics : Math.floor(pics) + ' and a part') + ' picture' + (pics === 1 ? '' : 's') + '.' +
          (first[1] % k ? ' A part of a picture stands for ' + first[1] % k + ' vote' + (first[1] % k > 1 ? 's' : '') + '.' : '') + ' Most votes: <b>' + d.d.slice().sort(function (x, y) { return y[1] - x[1]; })[0][0] + '</b>.</p>';
      }
      A.bind(root, ['gds', 'gdk', 'gdc'], gd);
      function mt() {
        var v = [1, 2, 3, 4].map(function (i) { var x = +$('#mt' + i, root).value; $('#mt' + i + 'o', root).textContent = x; return x; });
        var sum = v.reduce(function (x, y) { return x + y; }, 0), q = Math.floor(sum / 4), r = sum % 4, cnt = {}, best = 0, modes = [];
        v.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; best = Math.max(best, cnt[x]); });
        Object.keys(cnt).forEach(function (k) { if (cnt[k] === best && best > 1) modes.push(+k); });
        $('#mtfig', root).innerHTML = towerFig(v, r ? sum / 4 : q);
        $('#mtout', root).innerHTML = '<p><b>Mean:</b> ' + v.join(' + ') + ' = ' + sum + '. ' + sum + ' &divide; 4 = ' + (r ? q + ' with ' + r + ' left over, so the mean is between ' + q + ' and ' + (q + 1) : '<span class="big">' + q + '</span>') + '.</p>' +
          '<p><b>Mode:</b> ' + (modes.length ? modes.sort(function (a, b) { return a - b; }).join(' and ') + (modes.length > 1 ? ' (two modes)' : '') : 'no mode, because no value shows up more than once') + '.</p>';
      }
      A.bind(root, ['mt1', 'mt2', 'mt3', 'mt4'], mt);
      var spins = null;
      function sp() {
        var r = +$('#spr', root).value, b = +$('#spb', root).value;
        $('#spro', root).textContent = r; $('#spbo', root).textContent = b;
        $('#spgo', root).disabled = r + b === 0;
        $('#spfig', root).innerHTML = spinner(r, b);
        var msg = r + b === 0 ? 'Add some parts to the spinner.' : 'Landing on red is <b>' + likely(r, r + b) + '</b>. Landing on blue is <b>' + likely(b, r + b) + '</b>.';
        $('#spout', root).innerHTML = '<p>' + msg + '</p>' + (spins ? '<p>Last 20 spins: <b>' + spins[0] + ' red</b> and <b>' + spins[1] + ' blue</b>. Spin again and the counts change a little, but the more likely colour usually wins.</p>' : '');
      }
      A.bind(root, ['spr', 'spb'], function () { spins = null; sp(); });
      $('#spgo', root).addEventListener('click', function () {
        var r = +$('#spr', root).value, b = +$('#spb', root).value, c = [0, 0];
        for (var i = 0; i < 20; i++) c[Math.random() * (r + b) < r ? 0 : 1]++;
        spins = c; sp();
      });
    },

    quiz: [
      { q: 'Where does 25 go? Circles: "Odd" and "Multiple of 5".', type: 'mc', options: ['Odd only', 'Multiple of 5 only', 'Both', 'Neither'], answer: 2,
        hint: 'Is 25 odd? Is 25 a multiple of 5?', explain: '25 is odd and it is a multiple of 5, so it goes where the circles overlap.' },
      { q: 'How many votes did Grapes get?', type: 'num', answer: 10, fig: picto('Favourite fruit', [['Apple', 8], ['Banana', 5], ['Grapes', 10], ['Orange', 3]], 2, 'Grade 3 survey'),
        hint: 'Each picture means 2 votes. Count by 2s.', explain: 'Grapes has 5 pictures: 2, 4, 6, 8, 10.' },
      { q: 'How many more people chose Hockey than Swim?', type: 'num', answer: 6, fig: bars('Favourite sport', [['Hockey', 12], ['Soccer', 9], ['Swim', 6], ['Basketball', 4]], 2, 'Room 12 survey'),
        hint: 'Read both bars on the scale. Then subtract.', explain: 'Hockey is 12 and Swim is 6. 12 &minus; 6 = 6.' },
      { q: 'What is the mode of 4, 7, 7, 2, 7, 4?', type: 'num', answer: 7,
        hint: 'Which number shows up the most times?', explain: '7 shows up 3 times. That is more than any other value.' },
      { q: 'Four plants grew 3 cm, 5 cm, 6 cm and 10 cm. What is the mean?', type: 'num', answer: 6, unit: 'cm',
        hint: 'Add the four values, then share by 4.', explain: '3 + 5 + 6 + 10 = 24. 24 &divide; 4 = 6 cm.' },
      { q: 'This spinner has 1 red part and 3 blue parts. Landing on red is:', type: 'mc', options: ['impossible', 'unlikely', 'equally likely', 'likely'], answer: 1, fig: spinner(1, 3),
        hint: 'Is there more red or more blue?', explain: 'Red takes up less of the spinner than blue, so red is unlikely, but it can happen.' },
      { q: 'Which is <b>quantitative</b> data?', type: 'mc', options: ['Favourite colours', 'Heights of plants in cm', 'Names of pets', 'Kinds of trees'], answer: 1,
        hint: 'Quantitative data is numbers you can measure or count.', explain: 'Heights in centimetres are numbers.' }
    ],

    practice: [
      { id: 'dt-venn', name: 'Venn and Carroll diagrams', code: 'D1.1', gen: function (lv) {
        var pairs = [['even', 'gt15'], ['odd', 'm5'], ['lt10', 'm5'], ['even', 'gt10']], pr = R.pick(pairs), a = pr[0], b = pr[1], n = R.int(1, lv === 1 ? 20 : 30);
        var fa = ATTR[a][1](n), fb = ATTR[b][1](n), right = fa && fb ? 'Both' : fa ? ATTR[a][0] + ' only' : fb ? ATTR[b][0] + ' only' : 'Neither';
        var opts = [ATTR[a][0] + ' only', ATTR[b][0] + ' only', 'Both', 'Neither'];
        return { q: 'Where does <b>' + n + '</b> go? Circles: "' + ATTR[a][0] + '" and "' + ATTR[b][0] + '".', type: 'mc', options: opts, answer: opts.indexOf(right),
          fig: lv === 1 ? venn([], a, b).svg : '',
          hint: 'Ask two questions. Is ' + n + ' ' + ATTR[a][0].toLowerCase() + '? Is it ' + ATTR[b][0].toLowerCase() + '?',
          steps: ['Is ' + n + ' ' + ATTR[a][0].toLowerCase() + '? ' + (fa ? 'Yes.' : 'No.'), 'Is ' + n + ' ' + ATTR[b][0].toLowerCase() + '? ' + (fb ? 'Yes.' : 'No.'), 'So it goes in: ' + right + '.'],
          explain: n + ' goes in: ' + right + '.' };
      } },
      { id: 'dt-picto', name: 'Read a pictograph', code: 'D1.3', gen: function (lv) {
        var key = lv === 1 ? 2 : R.pick([2, 5, 10]), names = R.pick([['Hockey', 'Soccer', 'Swim', 'Skating'], ['Apple', 'Pear', 'Plum', 'Kiwi'], ['Bus', 'Car', 'Walk', 'Bike']]);
        var data = names.map(function (n) { return [n, key * R.int(1, 6) + (key === 2 && lv > 1 && R.int(0, 1) ? 1 : 0)]; });
        var t = 'How we ' + (names[0] === 'Bus' ? 'get to school' : 'voted'), i = R.int(0, 3), j = (i + R.int(1, 3)) % 4;
        var fig = picto(t, data, key, 'Class survey');
        if (lv === 3) {
          var hi = data[i][1] >= data[j][1] ? i : j, lo = hi === i ? j : i;
          if (data[hi][1] === data[lo][1]) data[hi][1] += key, fig = picto(t, data, key, 'Class survey');
          return { q: 'How many more chose ' + data[hi][0] + ' than ' + data[lo][0] + '?', type: 'num', answer: data[hi][1] - data[lo][1], fig: fig,
            hint: 'Find each number using the key. Then subtract.', steps: ['Each picture means ' + key + '.', data[hi][0] + ': ' + data[hi][1] + '. ' + data[lo][0] + ': ' + data[lo][1] + '.', data[hi][1] + ' &minus; ' + data[lo][1] + ' = ' + (data[hi][1] - data[lo][1]) + '.'],
            explain: (data[hi][1] - data[lo][1]) + ' more chose ' + data[hi][0] + '.' };
        }
        return { q: 'How many chose ' + data[i][0] + '?', type: 'num', answer: data[i][1], fig: fig,
          hint: 'Read the key first. Each picture means ' + key + '.',
          steps: ['The key says 1 picture = ' + key + '.', data[i][0] + ' has ' + Math.floor(data[i][1] / key) + ' whole picture' + (Math.floor(data[i][1] / key) === 1 ? '' : 's') + (data[i][1] % key ? ' and a half picture' : '') + '.', 'Count by ' + key + 's' + (data[i][1] % key ? ' and add 1 for the half' : '') + ': ' + data[i][1] + '.'],
          explain: data[i][0] + ' got ' + data[i][1] + '.' };
      } },
      { id: 'dt-bar', name: 'Read a bar graph', code: 'D1.5', gen: function (lv) {
        var step = lv === 1 ? 1 : R.pick([2, 5]), names = R.pick([['Red', 'Blue', 'Green', 'Yellow'], ['Mon', 'Tue', 'Wed', 'Thu'], ['Cats', 'Dogs', 'Fish', 'Birds']]);
        var data = names.map(function (n) { return [n, step * R.int(1, lv === 1 ? 8 : 9)]; }), i = R.int(0, 3);
        var t = names[0] === 'Mon' ? 'Books read each day' : names[0] === 'Red' ? 'Favourite colour' : 'Favourite pet', fig = bars(t, data, step, 'Class survey');
        if (lv === 3) {
          var tot = data.reduce(function (x, d) { return x + d[1]; }, 0);
          return { q: 'How many votes are there in all?', type: 'num', answer: tot, fig: fig, hint: 'Read every bar. Then add them up.',
            steps: ['The scale counts by ' + step + '.', 'The bars show ' + data.map(function (d) { return d[1]; }).join(', ') + '.', 'Add: ' + data.map(function (d) { return d[1]; }).join(' + ') + ' = ' + tot + '.'], explain: 'There are ' + tot + ' votes in all.' };
        }
        return { q: 'What does the bar for ' + data[i][0] + ' show?', type: 'num', answer: data[i][1], fig: fig,
          hint: 'Find the top of the bar. Look across to the scale. The scale counts by ' + step + '.',
          steps: ['The scale counts by ' + step + '.', 'Follow the top of the ' + data[i][0] + ' bar across to the scale.', 'It lines up with ' + data[i][1] + '.'],
          explain: 'The ' + data[i][0] + ' bar shows ' + data[i][1] + '.' };
      } },
      { id: 'dt-mode', name: 'Find the mode', code: 'D1.4', gen: function (lv) {
        var m = R.int(1, 12), list = [m, m], n = lv === 1 ? 5 : 7;
        if (lv > 1) list.push(m);
        var others = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(function (x) { return x !== m; }));
        var k = 0;
        while (list.length < n) { list.push(others[k]); if (lv === 3 && k === 0 && list.length < n) list.push(others[k]); k++; }
        list = R.shuffle(list);
        var sorted = list.slice().sort(function (a, b) { return a - b; });
        return { q: 'What is the mode of <span class="math">' + list.join(', ') + '</span>?', type: 'num', answer: m,
          hint: 'Put the numbers in order. Look for the one that shows up most often.',
          steps: ['In order: ' + sorted.join(', ') + '.', m + ' shows up ' + list.filter(function (x) { return x === m; }).length + ' times. No other number shows up that often.', 'The mode is ' + m + '.'],
          explain: 'The mode is ' + m + '.' };
      } },
      { id: 'dt-mean', name: 'Find the mean', code: 'D1.4', gen: function (lv) {
        var n = lv === 1 ? 2 : lv === 2 ? 3 : R.pick([4, 5]), mean = R.int(2, 9), list = [];
        for (var i = 0; i < n; i++) list.push(mean);
        for (var t = 0; t < n * 2; t++) { var a = R.int(0, n - 1), b = R.int(0, n - 1), d = R.int(1, 3); if (a !== b && list[a] - d >= 1 && list[b] + d <= 15) { list[a] -= d; list[b] += d; } }
        var sum = list.reduce(function (x, y) { return x + y; }, 0);
        return { q: 'What is the mean of <span class="math">' + list.join(', ') + '</span>?', type: 'num', answer: mean,
          fig: lv === 1 ? towerFig(list, mean) : '',
          hint: 'Add all the values. Then divide by how many values there are (' + n + ').',
          steps: ['Add: ' + list.join(' + ') + ' = ' + sum + '.', 'There are ' + n + ' values.', sum + ' &divide; ' + n + ' = ' + mean + '.<div class="fig">' + towerFig(list, mean) + '</div>'],
          explain: 'The mean is ' + mean + '.' };
      } },
      { id: 'dt-chance', name: 'How likely?', code: 'D2.1', gen: function (lv) {
        var tot = R.int(4, 10), fav = lv === 1 ? R.pick([0, tot]) : lv === 2 ? R.pick([R.int(1, Math.floor((tot - 1) / 2)), R.int(Math.ceil((tot + 1) / 2), tot - 1)]) : R.pick([0, tot, R.int(1, tot - 1), tot % 2 ? 1 : tot / 2]);
        var colour = R.pick(['red', 'green', 'yellow']), other = colour === 'red' ? 'blue' : 'red', ans = likely(fav, tot), opts = ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'];
        return { q: 'A bag has ' + fav + ' ' + colour + ' cube' + (fav === 1 ? '' : 's') + ' and ' + (tot - fav) + ' ' + other + ' cube' + (tot - fav === 1 ? '' : 's') + '. Picking ' + colour + ' without looking is:', type: 'mc', options: opts, answer: opts.indexOf(ans),
          fig: spinner(fav, tot - fav, fav + ' ' + colour + ' and ' + (tot - fav) + ' ' + other).replace(/var\(--bad\)/g, colour === 'red' ? 'var(--bad)' : colour === 'green' ? 'var(--sd)' : 'var(--hi)').replace(/var\(--sb\)/g, other === 'red' ? 'var(--bad)' : 'var(--sb)'),
          hint: 'Compare the number of ' + colour + ' cubes with the number of ' + other + ' cubes.',
          steps: ['There are ' + fav + ' ' + colour + ' out of ' + tot + ' cubes.', fav === 0 ? 'There are no ' + colour + ' cubes at all.' : fav === tot ? 'Every cube is ' + colour + '.' : fav * 2 === tot ? 'Half the cubes are ' + colour + '.' : fav * 2 < tot ? 'Fewer than half are ' + colour + '.' : 'More than half are ' + colour + '.', 'So picking ' + colour + ' is ' + ans + '.'],
          explain: 'Picking ' + colour + ' is ' + ans + '.' };
      } }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ----------
     Each practice skill keeps its first way of asking ("plain") and adds new shapes.
     Shapes unlock with the level, so level 1 stays gentle. q.meta is read by the automatic answer checks. */
  var Q = A.Q;
  if (Q) (function () {
    var nm = Q.name;
    function why(right, wrong) { var o = R.mc(right, wrong); return { options: o.options, answer: o.answer }; }
    var PAIRS = [['even', 'gt15'], ['odd', 'm5'], ['lt10', 'm5'], ['even', 'gt10']];
    function where(n, a, b) { var r = region(n, a, b); return r === 'ab' ? 'Both' : r === 'a' ? ATTR[a][0] + ' only' : r === 'b' ? ATTR[b][0] + ' only' : 'Neither'; }
    /* four categories with different counts, so "most" and "order" questions have one answer */
    function survey4(step, top) {
      var names = R.pick([['Hockey', 'Soccer', 'Swim', 'Skating'], ['Apple', 'Pear', 'Plum', 'Kiwi'], ['Bus', 'Car', 'Walk', 'Bike'], ['Red', 'Blue', 'Green', 'Yellow']]);
      var vals = R.shuffle(Array.apply(null, Array(top)).map(function (_, i) { return (i + 1) * step; })).slice(0, 4);
      return names.map(function (n, i) { return [n, vals[i]]; });
    }
    function sum(v) { return v.reduce(function (a, b) { return a + b; }, 0); }
    function meanList(n, mean) {
      var list = []; for (var i = 0; i < n; i++) list.push(mean);
      for (var t = 0; t < n * 2; t++) { var a = R.int(0, n - 1), b = R.int(0, n - 1), d = R.int(1, 3); if (a !== b && list[a] - d >= 1 && list[b] + d <= 15) { list[a] -= d; list[b] += d; } }
      return list;
    }
    function modeList(n) {
      var m = R.int(1, 12), list = [m, m, m].slice(0, n > 5 ? 3 : 2), others = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(function (x) { return x !== m; }));
      for (var k = 0; list.length < n; k++) list.push(others[k]);
      return { m: m, list: R.shuffle(list) };
    }
    function bag(red, blue) { return red + ' red and ' + blue + ' blue'; }

    var SHAPES = {
      'dt-venn': [
        [1, 'pick', function (lv) {
          var pr = R.pick(PAIRS), a = pr[0], b = pr[1], opts = [], ans = [];
          var pool = R.shuffle(Array.apply(null, Array(30)).map(function (_, i) { return i + 1; }));
          var both = pool.filter(function (n) { return region(n, a, b) === 'ab'; }).slice(0, 2), rest = pool.filter(function (n) { return region(n, a, b) !== 'ab'; }).slice(0, 3);
          opts = R.shuffle(both.concat(rest));
          opts.forEach(function (n, j) { if (region(n, a, b) === 'ab') ans.push(j); });
          return { q: 'Pick every number that goes in the middle, where the circles overlap: <b>' + ATTR[a][0].toLowerCase() + '</b> and <b>' + ATTR[b][0].toLowerCase() + '</b>.', type: 'pick', options: opts.map(String), answer: ans, fig: lv === 1 ? venn([], a, b).svg : '',
            hint: 'A number in the middle must fit both labels.', steps: ['Check each number twice: is it ' + ATTR[a][0].toLowerCase() + '? Is it ' + ATTR[b][0].toLowerCase() + '?', 'Pick only the ones with two yeses.'],
            explain: ans.map(function (j) { return opts[j]; }).join(' and ') + ' fit both.', meta: { k: 'venn-pick', a: ATTR[a][0], b: ATTR[b][0] } };
        }],
        [1, 'match', function (lv) {
          var pr = R.pick(PAIRS), a = pr[0], b = pr[1], pairs = [], seen = {}, pool = R.shuffle(Array.apply(null, Array(30)).map(function (_, i) { return i + 1; }));
          pool.forEach(function (n) { var w = where(n, a, b); if (pairs.length < 3 && !seen[w]) { seen[w] = 1; pairs.push([String(n), w]); } });
          return { q: 'The circles are "' + ATTR[a][0] + '" and "' + ATTR[b][0] + '". Match each number to where it goes.', type: 'match', pairs: pairs, fig: venn([], a, b).svg,
            hint: 'Ask two questions about each number.', steps: ['Fits both labels: Both. Fits one: that one only. Fits none: Neither.'],
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'venn-match', a: ATTR[a][0], b: ATTR[b][0] } };
        }],
        [1, 'tf', function (lv) {
          var pr = R.pick(PAIRS), a = pr[0], b = pr[1], n = R.int(1, 30), real = where(n, a, b), truth = !R.int(0, 1);
          var said = truth ? real : R.pick(['Both', ATTR[a][0] + ' only', ATTR[b][0] + ' only', 'Neither'].filter(function (x) { return x !== real; }));
          var right = n + ' is ' + (ATTR[a][1](n) ? '' : 'not ') + ATTR[a][0].toLowerCase() + ' and ' + (ATTR[b][1](n) ? '' : 'not ') + ATTR[b][0].toLowerCase() + ', so it goes in: ' + real + '.';
          return { q: 'The circles are "' + ATTR[a][0] + '" and "' + ATTR[b][0] + '". True or false: <b>' + n + '</b> goes in <b>' + said + '</b>.', type: 'tf', answer: truth,
            why: why(right, ['Every number goes in the middle.', 'Numbers bigger than 10 go in Neither.', 'A number can only fit one label.']),
            hint: 'Ask two questions about ' + n + '.', steps: [right], explain: right, meta: { k: 'venn-tf', n: n, a: ATTR[a][0], b: ATTR[b][0], said: said } };
        }],
        [2, 'mistake', function (lv) {
          var pr = R.pick(PAIRS), a = pr[0], b = pr[1], pool = R.shuffle(Array.apply(null, Array(30)).map(function (_, i) { return i + 1; })).filter(function (n) { return region(n, a, b) === 'ab'; });
          var n = pool[0], who = nm(), said = R.int(0, 2) ? ATTR[a][0] + ' only' : 'Both';
          var right = n + ' is ' + ATTR[a][0].toLowerCase() + ' and also ' + ATTR[b][0].toLowerCase() + ', so it goes in the middle: Both.';
          return { q: who + ' put <b>' + n + '</b> in "' + said + '". The circles are "' + ATTR[a][0] + '" and "' + ATTR[b][0] + '". True or false: ' + who + ' is right.', type: 'tf', answer: said === 'Both',
            why: why(right, ['Once a number fits one label, you can stop checking.', 'The middle is only for numbers that fit neither label.', n + ' is too big for the middle.']),
            hint: 'Does ' + n + ' fit the other label too?', steps: [right], explain: right, meta: { k: 'venn-tf', n: n, a: ATTR[a][0], b: ATTR[b][0], said: said } };
        }]
      ],
      'dt-picto': [
        [1, 'fill', function (lv) {
          var key = lv === 1 ? 2 : R.pick([2, 5, 10]), data = survey4(key, 6), i = R.int(0, 2), j = R.int(i + 1, 3);
          return { q: 'Use the key. Fill in the blanks.', type: 'fill', fig: picto('How we voted', data, key, 'Class survey'), fill: data[i][0] + ': [[]] votes<br>' + data[j][0] + ': [[]] votes', answers: [data[i][1], data[j][1]],
            hint: 'Each picture means ' + key + '. Count by ' + key + 's.', steps: [data[i][0] + ' has ' + data[i][1] / key + ' pictures: ' + data[i][1] + '.', data[j][0] + ' has ' + data[j][1] / key + ' pictures: ' + data[j][1] + '.'],
            explain: data[i][0] + ': ' + data[i][1] + '. ' + data[j][0] + ': ' + data[j][1] + '.', meta: { k: 'picto-fill' } };
        }],
        [1, 'order', function (lv) {
          var key = lv === 1 ? 2 : R.pick([2, 5, 10]), data = survey4(key, 6), sorted = data.slice().sort(function (x, y) { return y[1] - x[1]; });
          return { q: 'Put the choices in order from <b>most votes to fewest</b>.', type: 'order', items: sorted.map(function (d) { return d[0]; }), first: 'most', last: 'fewest', fig: picto('How we voted', data, key, 'Class survey'),
            hint: 'More pictures means more votes.', steps: ['Count the pictures in each row.', 'Order: ' + sorted.map(function (d) { return d[0] + ' (' + d[1] + ')'; }).join(', ') + '.'],
            explain: sorted.map(function (d) { return d[0]; }).join(', ') + '.', meta: { k: 'picto-order' } };
        }],
        [1, 'pick', function (lv) {
          var key = lv === 1 ? 2 : R.pick([2, 5]), data = survey4(key, 6), vals = data.map(function (d) { return d[1]; }).sort(function (a, b) { return a - b; }), lim = vals[1] + (vals[2] - vals[1] > key ? key : 0);
          if (lim >= vals[2]) lim = vals[1];
          var ans = []; data.forEach(function (d, j) { if (d[1] > lim) ans.push(j); });
          return { q: 'Pick every choice that got <b>more than ' + lim + '</b> votes.', type: 'pick', options: data.map(function (d) { return d[0]; }), answer: ans, fig: picto('How we voted', data, key, 'Class survey'),
            hint: 'Each picture means ' + key + '. ' + lim + ' votes is ' + lim / key + ' pictures.', steps: ['Find the rows with more than ' + lim / key + ' pictures.'],
            explain: ans.map(function (j) { return data[j][0]; }).join(' and ') + ' got more than ' + lim + '.', meta: { k: 'picto-pick', lim: lim } };
        }],
        [2, 'mistake', function (lv) {
          var key = R.pick([2, 5, 10]), data = survey4(key, 6), i = R.int(0, 3), who = nm(), truth = !R.int(0, 2), said = truth ? data[i][1] : data[i][1] / key;
          var right = 'Each picture means ' + key + '. ' + data[i][0] + ' has ' + data[i][1] / key + ' pictures, so ' + data[i][1] + ' votes.';
          return { q: who + ' says ' + data[i][0] + ' got <b>' + said + '</b> votes. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: picto('How we voted', data, key, 'Class survey'),
            why: why(right, ['Each picture means 1 vote.', 'Count the pictures and add ' + key + '.', 'The key only matters for the first row.']),
            hint: 'Read the key first.', steps: [right], explain: right, meta: { k: 'picto-tf', name: data[i][0], said: said } };
        }]
      ],
      'dt-bar': [
        [1, 'order', function (lv) {
          var step = lv === 1 ? 1 : R.pick([2, 5]), data = survey4(step, 8), sorted = data.slice().sort(function (x, y) { return y[1] - x[1]; });
          return { q: 'Put the bars in order from <b>tallest to shortest</b>.', type: 'order', items: sorted.map(function (d) { return d[0]; }), first: 'tallest', last: 'shortest', fig: bars('Our survey', data, step, 'Class survey'),
            hint: 'Compare the tops of the bars.', steps: ['Read each bar: ' + data.map(function (d) { return d[0] + ' ' + d[1]; }).join(', ') + '.'],
            explain: sorted.map(function (d) { return d[0]; }).join(', ') + '.', meta: { k: 'bar-order' } };
        }],
        [1, 'match', function (lv) {
          var step = lv === 1 ? 1 : R.pick([2, 5]), data = survey4(step, 8), pick3 = R.shuffle([0, 1, 2, 3]).slice(0, 3);
          var pairs = pick3.map(function (i) { return [data[i][0], String(data[i][1])]; });
          return { q: 'Match each bar to the number it shows.', type: 'match', pairs: pairs, fig: bars('Our survey', data, step, 'Class survey'),
            hint: 'Look across from the top of each bar to the scale. The scale counts by ' + step + '.', steps: ['Follow each bar top across to the scale.'],
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'bar-match' } };
        }],
        [2, 'mistake', function (lv) {
          var step = R.pick([2, 5]), data = survey4(step, 8), i = R.int(0, 3), j = (i + R.int(1, 3)) % 4, hi = data[i][1] > data[j][1] ? i : j, lo = hi === i ? j : i;
          var diff = data[hi][1] - data[lo][1], who = nm(), truth = !R.int(0, 2), said = truth ? diff : diff / step;
          if (said === diff && !truth) said = diff + step;
          var right = data[hi][0] + ' shows ' + data[hi][1] + ' and ' + data[lo][0] + ' shows ' + data[lo][1] + '. ' + data[hi][1] + ' &minus; ' + data[lo][1] + ' = ' + diff + '.';
          return { q: who + ' says ' + data[hi][0] + ' has <b>' + said + '</b> more votes than ' + data[lo][0] + '. True or false: ' + who + ' is right.', type: 'tf', answer: said === diff, fig: bars('Our survey', data, step, 'Class survey'),
            why: why(right, ['Count the grid lines between the bars. Each line is 1.', 'Add the two bars.', 'The taller bar always has 10 more.']),
            hint: 'Read both bars on the scale. Then subtract.', steps: [right], explain: right, meta: { k: 'bar-tf', a: data[hi][0], b: data[lo][0], said: said } };
        }]
      ],
      'dt-mode': [
        [1, 'tf', function (lv) {
          var o = modeList(lv === 1 ? 5 : 7), truth = !R.int(0, 1), said = truth ? o.m : R.pick(o.list.filter(function (x) { return x !== o.m; }));
          var right = o.m + ' shows up most often, so the mode is ' + o.m + '.';
          return { q: 'True or false: the mode of <span class="math">' + o.list.join(', ') + '</span> is <b>' + said + '</b>.', type: 'tf', answer: truth,
            why: why(right, ['The mode is the biggest number.', 'The mode is the middle number in the list.', 'The mode is the last number.']),
            hint: 'Which number shows up most often?', steps: [right], explain: right, meta: { k: 'mode-tf', list: o.list, said: said } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), o = modeList(lv === 1 ? 5 : 7), c = R.pick(['how many pets they have', 'how many books they read this week', 'their shoe size', 'how many cousins they have']);
          if (c === 'how many pets they have') o.list = o.list.map(function (x) { return x % 6; }), o.m = o.m % 6;
          var counts = {}; o.list.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
          var best = Math.max.apply(null, Object.keys(counts).map(function (k) { return counts[k]; })), tops = Object.keys(counts).filter(function (k) { return counts[k] === best; });
          if (tops.length > 1) return SHAPES['dt-mode'][0][2](lv);
          return { q: who + ' asked friends ' + c + '. The answers were <span class="math">' + o.list.join(', ') + '</span>. What is the mode?', type: 'num', answer: +tops[0],
            hint: 'Put the answers in order. Which one shows up most?', steps: ['In order: ' + o.list.slice().sort(function (a, b) { return a - b; }).join(', ') + '.', tops[0] + ' shows up ' + best + ' times.'],
            explain: 'The mode is ' + tops[0] + '.', meta: { k: 'mode-num', list: o.list } };
        }],
        [1, 'match', function (lv) {
          var pairs = [], seen = {};
          while (pairs.length < 3) { var o = modeList(5); if (seen[o.m]) continue; seen[o.m] = 1; pairs.push([o.list.join(', '), String(o.m)]); }
          return { q: 'Match each list to its mode.', type: 'match', pairs: pairs,
            hint: 'Find the number that shows up most in each list.', steps: ['Look for the repeated number in each list.'],
            explain: pairs.map(function (p) { return p[0] + ': mode ' + p[1]; }).join('. ') + '.', meta: { k: 'mode-match' } };
        }],
        [2, 'mistake', function (lv) {
          var o = modeList(7), who = nm(), big = Math.max.apply(null, o.list);
          if (big === o.m) return SHAPES['dt-mode'][0][2](lv);
          var truth = !R.int(0, 2), said = truth ? o.m : big, right = 'The mode is the value that shows up most often: ' + o.m + '.';
          return { q: who + ' says the mode of <span class="math">' + o.list.join(', ') + '</span> is <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['The mode is the biggest value.', 'The mode is how many values there are.', 'The mode is the first value.']),
            hint: 'Count how many times each value shows up.', steps: [right], explain: right, meta: { k: 'mode-tf', list: o.list, said: said } };
        }]
      ],
      'dt-mean': [
        [1, 'fill', function (lv) {
          var n = lv === 1 ? 2 : lv === 2 ? 3 : 4, mean = R.int(2, 9), list = meanList(n, mean), s = sum(list);
          return { q: 'Find the mean of <span class="math">' + list.join(', ') + '</span>. Fill in the blanks.', type: 'fill', fill: 'Add them all: [[]]<br>Share equally among ' + n + ': [[]]', answers: [s, mean], fig: lv === 1 ? towerFig(list, mean) : '',
            hint: 'Add first. Then divide by ' + n + '.', steps: [list.join(' + ') + ' = ' + s + '.', s + ' &divide; ' + n + ' = ' + mean + '.'],
            explain: 'The mean is ' + mean + '.', meta: { k: 'mean-fill', list: list } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), n = lv === 1 ? 2 : lv === 2 ? 3 : 4, mean = R.int(2, 9), list = meanList(n, mean);
          var c = R.pick(['goals in each game', 'books read each week', 'laps swum each day']);
          return { q: who + ' counted ' + c + ': <span class="math">' + list.join(', ') + '</span>. What is the mean?', type: 'num', answer: mean,
            hint: 'Add them all. Then share the total equally.', steps: [list.join(' + ') + ' = ' + sum(list) + '.', sum(list) + ' &divide; ' + n + ' = ' + mean + '.'],
            explain: 'The mean is ' + mean + '.', meta: { k: 'mean-num', list: list } };
        }],
        [1, 'tf', function (lv) {
          var n = lv === 1 ? 2 : 3, mean = R.int(2, 9), list = meanList(n, mean), truth = !R.int(0, 1), said = truth ? mean : mean + R.pick([1, -1]);
          var right = list.join(' + ') + ' = ' + sum(list) + '. ' + sum(list) + ' &divide; ' + n + ' = ' + mean + '.';
          return { q: 'True or false: the mean of <span class="math">' + list.join(', ') + '</span> is <b>' + said + '</b>.', type: 'tf', answer: truth,
            why: why(right, ['The mean is the biggest value.', 'The mean is the total.', 'The mean is the value that shows up most.']),
            hint: 'Add, then share equally.', steps: [right], explain: right, meta: { k: 'mean-tf', list: list, said: said } };
        }],
        [2, 'mistake', function (lv) {
          var n = R.pick([2, 3]), mean = R.int(2, 6), list = meanList(n, mean), who = nm(), truth = !R.int(0, 2), said = truth ? mean : sum(list);
          var right = 'Add to get ' + sum(list) + ', then share among ' + n + ': ' + sum(list) + ' &divide; ' + n + ' = ' + mean + '.';
          return { q: who + ' says the mean of <span class="math">' + list.join(', ') + '</span> is <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['The mean is the total, so you stop after adding.', 'Divide the total by 2 every time.', 'The mean is the first value.']),
            hint: 'Did ' + who + ' share the total equally?', steps: [right], explain: right, meta: { k: 'mean-tf', list: list, said: said } };
        }]
      ],
      'dt-chance': [
        [1, 'match', function (lv) {
          var tot = R.int(4, 8), mid = tot % 2 ? null : tot / 2, cand = R.shuffle([[0, tot], [tot, 0], [1, tot - 1], [tot - 1, 1]].concat(mid ? [[mid, mid]] : []));
          var pairs = [], seen = {};
          cand.forEach(function (c) { var w = likely(c[0], tot); if (pairs.length < 3 && !seen[w]) { seen[w] = 1; pairs.push([bag(c[0], c[1]), w]); } });
          return { q: 'A cube is picked without looking. Match each bag to how likely it is to pick <b>red</b>.', type: 'match', pairs: pairs,
            hint: 'Compare the red cubes with all the cubes.', steps: ['No red: impossible. All red: certain. Half red: equally likely.'],
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'chance-match' } };
        }],
        [1, 'order', function (lv) {
          var tot = R.pick([4, 6, 8]), reds = R.shuffle(Array.apply(null, Array(tot + 1)).map(function (_, i) { return i; })).slice(0, lv === 1 ? 3 : 4).sort(function (a, b) { return a - b; });
          return { q: 'Each bag has ' + tot + ' cubes. Put the bags in order from <b>least likely to most likely</b> to pick red.', type: 'order', items: reds.map(function (r) { return bag(r, tot - r); }), first: 'least likely', last: 'most likely',
            hint: 'More red cubes makes red more likely.', steps: ['All bags have ' + tot + ' cubes, so compare the red cubes.'],
            explain: 'Fewest red to most red.', meta: { k: 'chance-order' } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), tot = R.int(4, 10), fav = lv === 1 ? R.pick([0, tot]) : R.int(0, tot), opts = ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'], ans = likely(fav, tot);
          var c = R.pick([['marbles', 'green'], ['socks', 'black'], ['crayons', 'blue']]);
          return { q: who + ' has a drawer with ' + fav + ' ' + c[1] + ' ' + c[0] + ' and ' + (tot - fav) + ' white ' + c[0] + '. ' + who + ' takes one without looking. Getting ' + c[1] + ' is:', type: 'mc', options: opts, answer: opts.indexOf(ans),
            hint: 'Compare the ' + c[1] + ' ' + c[0] + ' with all the ' + c[0] + '.', steps: [fav + ' of ' + tot + ' are ' + c[1] + '.', 'So getting ' + c[1] + ' is ' + ans + '.'],
            explain: 'Getting ' + c[1] + ' is ' + ans + '.', meta: { k: 'chance-mc', fav: fav, tot: tot } };
        }],
        [2, 'mistake', function (lv) {
          var h = R.int(2, 5), who = nm(), word = R.pick(['likely', 'equally likely']);
          var right = 'Half the cubes are red, so red is equally likely.';
          return { q: 'A bag has ' + bag(h, h) + ' cubes. ' + who + ' says picking red is <b>' + word + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: word === 'equally likely',
            why: why(right, ['Red is always likely.', 'Red is unlikely because there are blue cubes too.', 'Red is certain because there are red cubes.']),
            hint: 'Compare red and blue.', steps: [right], explain: right, meta: { k: 'chance-tf', red: h, blue: h, said: word } };
        }]
      ]
    };
    var ch = A.chapters[CH];
    ch.quizFresh = true;
    ch.practice.forEach(function (sk) {
      var plain = sk.gen, extra = SHAPES[sk.id] || [];
      sk.shapes = ['plain'].concat(extra.map(function (s) { return s[1]; }));
      sk.gen = function (lv) { return Q.vary(sk.id, lv, [[1, 'plain', plain]].concat(extra)); };
    });
    ch._shapes = SHAPES;
  })();
})();
