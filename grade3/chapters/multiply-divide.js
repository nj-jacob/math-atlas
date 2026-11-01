(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var DOT = 'var(--strand)', DOT2 = 'var(--hi)';

  /* g plates with n counters on each */
  function groups(g, n, label) {
    var per = g > 5 ? 5 : g, rows = Math.ceil(g / per), pw = 104, ph = 104, s = '';
    for (var i = 0; i < g; i++) {
      var cx = 8 + (i % per) * (pw + 6) + pw / 2, cy = 8 + Math.floor(i / per) * (ph + 6) + ph / 2;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (pw / 2) + '" style="fill:color-mix(in srgb,var(--strand) 8%,var(--card));stroke:var(--strand)" stroke-width="2.5"/>';
      var cols = n <= 4 ? 2 : n <= 9 ? 3 : 4, r = n <= 4 ? 13 : n <= 9 ? 11 : 9, gap = r * 2.4, w = (Math.min(n, cols) - 1) * gap, hh = (Math.ceil(n / cols) - 1) * gap;
      for (var k = 0; k < n; k++) s += '<circle cx="' + (cx - w / 2 + (k % cols) * gap) + '" cy="' + (cy - hh / 2 + Math.floor(k / cols) * gap) + '" r="' + r + '" style="fill:' + DOT2 + ';stroke:var(--ink)" stroke-width="1.5"/>';
    }
    return A.svg(per * (pw + 6) + 10, rows * (ph + 6) + 10, s, label || g + ' groups of ' + n);
  }
  /* r rows by c columns of dots. split: draw a line after that many rows */
  function array(r, c, split, label) {
    var gap = Math.min(38, 360 / Math.max(r, c)), rad = gap * 0.36, s = '', top = 30, left = 40;
    for (var i = 0; i < r; i++) for (var j = 0; j < c; j++) s += '<circle cx="' + (left + j * gap + gap / 2) + '" cy="' + (top + i * gap + gap / 2) + '" r="' + rad + '" style="fill:' + (split && i >= split ? DOT2 : DOT) + ';stroke:var(--ink)" stroke-width="1"/>';
    s += '<text x="' + (left + c * gap / 2) + '" y="20" text-anchor="middle" font-size="18" class="tb">' + c + ' in each row</text>';
    s += '<text x="' + (left - 10) + '" y="' + (top + r * gap / 2 + 6) + '" text-anchor="end" font-size="18" class="tb">' + r + '</text>';
    if (split && split < r) s += '<line x1="' + (left - 4) + '" y1="' + (top + split * gap) + '" x2="' + (left + c * gap + 4) + '" y2="' + (top + split * gap) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="6 4"/>';
    return A.svg(Math.max(240, left + c * gap + 10), top + r * gap + 8, s, label || r + ' rows of ' + c);
  }
  /* 1 to 100 with the multiples of k shaded */
  function chart100(k) {
    var sz = 46, s = '';
    for (var i = 1; i <= 100; i++) {
      var x = 4 + ((i - 1) % 10) * sz, y = 4 + Math.floor((i - 1) / 10) * sz, on = i % k === 0;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:' + (on ? 'color-mix(in srgb,var(--strand) 70%,var(--card))' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1.5"/>' +
        '<text x="' + (x + sz / 2) + '" y="' + (y + sz / 2 + 7) + '" text-anchor="middle" font-size="19"' + (on ? ' font-weight="700" style="fill:#fff"' : ' class="t2"') + '>' + i + '</text>';
    }
    return A.svg(sz * 10 + 8, sz * 10 + 8, s, 'Hundred chart with the multiples of ' + k + ' shaded');
  }
  /* deal total counters onto k plates; leftovers below */
  function share(total, k) {
    var each = Math.floor(total / k), left = total - each * k;
    var s = groups(k, each, 'Share ' + total + ' among ' + k + ': ' + each + ' each' + (left ? ', ' + left + ' left over' : ''));
    if (left) {
      var t = '';
      for (var i = 0; i < left; i++) t += '<circle cx="' + (20 + i * 30) + '" cy="20" r="11" style="fill:var(--bad);stroke:var(--ink)" stroke-width="1.5"/>';
      s += '<p class="t2" style="text-align:center;margin:.3em 0 0">Left over:</p>' + A.svg(Math.max(60, left * 30 + 10), 40, t, left + ' left over');
    }
    return s;
  }
  var THINGS = {
    2: [['bike', 'bikes', 'wheel', 'wheels'], ['pair of socks', 'pairs of socks', 'sock', 'socks'], ['person', 'people', 'eye', 'eyes']],
    5: [['hand', 'hands', 'finger', 'fingers'], ['star', 'stars', 'point', 'points'], ['nickel', 'nickels', 'cent', 'cents']],
    10: [['dime', 'dimes', 'cent', 'cents'], ['ten-pack of pencils', 'ten-packs of pencils', 'pencil', 'pencils'], ['row of a hundred chart', 'rows of a hundred chart', 'square', 'squares']]
  };
  function ratioFig(k, n, label) {
    var s = '', w = 110;
    for (var i = 0; i < n; i++) {
      var x = 6 + (i % 5) * w, y = 6 + Math.floor(i / 5) * 72;
      s += '<rect x="' + x + '" y="' + y + '" width="' + (w - 10) + '" height="62" rx="10" style="fill:color-mix(in srgb,var(--strand) 10%,var(--card));stroke:var(--strand)" stroke-width="2"/>';
      for (var j = 0; j < k; j++) s += '<circle cx="' + (x + 14 + (j % 5) * 18) + '" cy="' + (y + 20 + Math.floor(j / 5) * 22) + '" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1"/>';
    }
    return A.svg(5 * w + 8, Math.ceil(n / 5) * 72 + 8, s, label);
  }

  /* ---------- Lessons: one idea per screen ---------- */
  var CH = 'multiply-divide';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function cap(t) { return t ? '<p class="g3-sym" style="font-size:1.1rem;color:var(--ink)">' + t + '</p>' : ''; }
  /* plates that can hold different amounts while dealing, with a pile still to share */
  function plates(counts, pile, label) {
    var k = counts.length, per = k > 5 ? 5 : k, pw = 96, s = '';
    for (var i = 0; i < k; i++) {
      var cx = 8 + (i % per) * (pw + 6) + pw / 2, cy = 8 + Math.floor(i / per) * (pw + 6) + pw / 2, n = counts[i];
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + pw / 2 + '" style="fill:color-mix(in srgb,var(--strand) 8%,var(--card));stroke:var(--strand)" stroke-width="2.5"/>';
      var cols = n <= 4 ? 2 : n <= 9 ? 3 : 4, r = n <= 4 ? 12 : n <= 9 ? 10 : 8, gap = r * 2.4, w = (Math.min(n, cols) - 1) * gap, hh = (Math.ceil(n / cols) - 1) * gap;
      for (var j = 0; j < n; j++) s += '<circle cx="' + (cx - w / 2 + (j % cols) * gap) + '" cy="' + (cy - hh / 2 + Math.floor(j / cols) * gap) + '" r="' + r + '" style="fill:' + DOT2 + ';stroke:var(--ink)" stroke-width="1.5"/>';
    }
    var rows = k ? Math.ceil(k / per) : 0, top = rows * (pw + 6) + 14, W = per * (pw + 6) + 10, pr = Math.max(1, Math.ceil(pile / 12));
    if (pile) {
      s += '<text x="8" y="' + (top + 16) + '" font-size="17" class="t2">Still to share: ' + pile + '</text>';
      for (var q = 0; q < pile; q++) s += '<circle cx="' + (18 + (q % 12) * 26) + '" cy="' + (top + 36 + Math.floor(q / 12) * 26) + '" r="10" style="fill:' + DOT2 + ';stroke:var(--ink)" stroke-width="1.5" opacity=".75"/>';
    }
    return A.svg(Math.max(W, pile ? 330 : 0), top + (pile ? 30 + pr * 26 : 0), s, label || k + ' plates');
  }
  function dealCounts(total, k, dealt) { var c = []; for (var i = 0; i < k; i++) c.push(Math.floor(dealt / k) + (i < dealt % k ? 1 : 0)); return c; }
  function dealView(s) { return '<div>' + plates(dealCounts(s.total, s.k, s.dealt), s.total - s.dealt) + cap(s.say) + '</div>'; }
  function bagView(s) { return '<div>' + (s.bags ? groups(s.bags, s.size, s.bags + ' bags of ' + s.size) : '') + (s.total - s.bags * s.size ? plates([], s.total - s.bags * s.size) : '') + cap(s.say) + '</div>'; }
  function groupView(s) { return '<div>' + groups(s.g, s.n) + cap(s.say) + '</div>'; }
  function factView(s) { return '<div>' + chart100(s.k) + cap(s.say) + '</div>'; }
  function arrView(s) { return '<div>' + array(s.r, s.c, s.sp || 0) + cap(s.say) + '</div>'; }
  function famView(s) {
    var f = [s.a + ' &times; ' + s.b + ' = ' + s.a * s.b, s.b + ' &times; ' + s.a + ' = ' + s.a * s.b, s.a * s.b + ' &divide; ' + s.a + ' = ' + s.b, s.a * s.b + ' &divide; ' + s.b + ' = ' + s.a];
    return '<div>' + array(s.a, s.b, 0, s.a + ' rows of ' + s.b) + '<div class="tbl"><table><tbody><tr>' + f.map(function (x, i) { return '<td class="math"' + (i < s.k ? '' : ' style="opacity:.15"') + '>' + x + '</td>'; }).slice(0, 2).join('') + '</tr><tr>' + f.map(function (x, i) { return '<td class="math"' + (i < s.k ? '' : ' style="opacity:.15"') + '>' + x + '</td>'; }).slice(2).join('') + '</tr></tbody></table></div>' + cap(s.say) + '</div>';
  }
  function ratioView(s) {
    var th = THINGS[s.k][s.t || 0], h = '<table><tbody><tr><th class="l">' + th[1].charAt(0).toUpperCase() + th[1].slice(1) + '</th>', h2 = '<tr><th class="l">' + th[3].charAt(0).toUpperCase() + th[3].slice(1) + '</th>';
    for (var i = 1; i <= s.n; i++) { var on = i === s.n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : ''; h += '<td' + on + '>' + i + '</td>'; h2 += '<td' + on + '>' + i * s.k + '</td>'; }
    return '<div>' + ratioFig(s.k, s.n, s.n + ' ' + (s.n === 1 ? th[0] : th[1]) + ', ' + s.k + ' ' + th[3] + ' each') + '<div class="tbl">' + h + '</tr>' + h2 + '</tr></tbody></table></div>' + cap(s.say) + '</div>';
  }
  function addList(g, n) { var a = []; for (var i = 0; i < g; i++) a.push(n); return a.join(' + '); }
  function chartOf(k) { var l = []; for (var i = 1; i <= 10; i++) l.push(k * i); return l; }

  var LESSONS = [
    { id: 'groups', title: 'Equal groups', sub: 'Multiplying is adding equal groups.', concepts: [
      { id: 'equal', title: 'What equal groups are', exp: ['B2.6'], skill: 'md-groups',
        body: '<p>Groups are <b>equal</b> when each one has the same number. 3 plates with 4 grapes on each is 3 equal groups of 4.</p>',
        watch: { mount: G3.view(groupView, { g: 1, n: 4, say: '1 group of 4' }), steps: [
          { say: 'One plate with 4 grapes.', ms: 1200 },
          { say: 'Add another plate of 4. Each plate has the same number.', act: function (t) { return t.set({ g: 2, say: '2 groups of 4: 4 + 4 = 8' }, 1500); } },
          { say: 'One more plate of 4.', act: function (t) { return t.set({ g: 3, say: '3 groups of 4: 4 + 4 + 4 = 12' }, 1500); } },
          { say: '3 equal groups of 4 make <b>12</b>.', ms: 1800 }
        ] },
        example: { mount: G3.view(groupView, { g: 1, n: 5, say: '1 group of 5' }), steps: [
          { say: 'My turn. I put 5 grapes on one plate.', ms: 1300 },
          { say: 'I add another plate of 5. Each plate has the same number.', act: function (t) { return t.set({ g: 2, say: '2 groups of 5: 5 + 5 = 10' }, 1500); } },
          { say: 'I add two more plates of 5.', act: function (t) { return t.set({ g: 4, say: '4 groups of 5: 5 + 5 + 5 + 5 = 20' }, 1600); } },
          { say: '4 equal groups of 5 make <b>20</b>. Every group has the same number.', ms: 2000 }
        ] },
        try: { mount: G3.play({ state: { g: 2, n: 2 }, draw: function (s) { return groups(s.g, s.n); },
          sliders: [{ key: 'g', label: 'Number of groups', min: 1, max: 10 }, { key: 'n', label: 'In each group', min: 1, max: 10 }],
          info: function (s) { return s.g + ' group' + (s.g > 1 ? 's' : '') + ' of ' + s.n + ': ' + addList(s.g, s.n) + ' = <b>' + s.g * s.n + '</b>'; },
          tasks: [{ do: 'Make <b>4 groups of 3</b>.', goal: function (s) { return s.g === 4 && s.n === 3; }, yes: '4 groups of 3 is 12.' },
            { do: 'Make <b>12</b> again, with a different number of groups.', goal: function (s) { return s.g * s.n === 12 && !(s.g === 4 && s.n === 3); }, yes: function (s) { return s.g + ' groups of ' + s.n + ' is also 12.'; } }] }), do: '' },
        key: '<p>Equal groups: <b>every group has the same number</b>.</p>',
        check: [TU('s1', 0), SK('md-groups', 1)] },

      { id: 'times', title: 'The times sign', exp: ['B2.6'], skill: 'md-groups',
        body: '<p><span class="math">3 &times; 4</span> means "3 groups of 4". The first number is how many groups. The second is how many in each group.</p>',
        watch: { mount: G3.view(groupView, { g: 5, n: 2, say: '5 groups of 2' }), steps: [
          { say: '5 plates with 2 on each.', ms: 1300 },
          { say: 'Add them: 2 + 2 + 2 + 2 + 2 = 10.', act: function (t) { return t.set({ say: '2 + 2 + 2 + 2 + 2 = 10' }, 1800); } },
          { say: 'A short way to write it: <b>5 &times; 2 = 10</b>.', act: function (t) { return t.set({ say: '5 &times; 2 = 10' }, 2000); } }
        ] },
        example: { mount: G3.view(groupView, { g: 4, n: 3, say: '4 groups of 3' }), steps: [
          { say: 'My turn. I see 4 plates with 3 on each.', ms: 1300 },
          { say: 'I add them: 3 + 3 + 3 + 3 = 12.', act: function (t) { return t.set({ say: '3 + 3 + 3 + 3 = 12' }, 1800); } },
          { say: 'The short way to write it is <b>4 &times; 3 = 12</b>. That means 4 groups of 3.', act: function (t) { return t.set({ say: '4 &times; 3 = 12' }, 2200); } }
        ] },
        try: { tool: 'counters', opts: { n: 6, controls: ['pairs'], arrange: 'scatter' }, tasks: [
          { do: 'Show <b>5 &times; 2</b>: make 10 counters, then pair them up.', goal: function (s) { return s.n === 10 && s.mode === 'pairs'; }, yes: '5 pairs: 5 groups of 2 is 10.' }
        ] },
        key: '<p><b>3 &times; 4 means 3 groups of 4.</b></p>',
        mistake: '<p>Adding the two numbers (3 &times; 4 = 7). Ask: "How many groups? How many in each?" and have the child draw it.</p>',
        check: [TU('s1', 1), TU('s1', 2), SK('md-groups', 2)] }
    ] },

    { id: 'arrays', title: 'Arrays', sub: 'Equal rows make multiplying easy to see.', concepts: [
      { id: 'rows', title: 'Rows and columns', exp: ['B2.6'], skill: 'md-array',
        body: '<p>An <b>array</b> puts things in equal rows. 3 rows of 5 is <span class="math">3 &times; 5</span>. Count by 5s, one row at a time.</p>',
        watch: { mount: G3.view(arrView, { r: 1, c: 5, say: '5' }), steps: [
          { say: 'One row of 5.', ms: 1200 },
          { say: 'Another row of 5: 10.', act: function (t) { return t.set({ r: 2, say: '5, 10' }, 1300); } },
          { say: 'A third row: 15.', act: function (t) { return t.set({ r: 3, say: '5, 10, 15' }, 1300); } },
          { say: '3 rows of 5: <b>3 &times; 5 = 15</b>.', act: function (t) { return t.set({ say: '3 &times; 5 = 15' }, 2000); } }
        ] },
        example: { mount: G3.view(arrView, { r: 1, c: 6, say: '6' }), steps: [
          { say: 'My turn. I make one row of 6.', ms: 1200 },
          { say: 'I add a second row: 12.', act: function (t) { return t.set({ r: 2, say: '6, 12' }, 1300); } },
          { say: 'Two more rows: 18, 24.', act: function (t) { return t.seq([{ r: 3, say: '6, 12, 18' }, { r: 4, say: '6, 12, 18, 24' }], 900); } },
          { say: '4 rows with 6 in each row: <b>4 &times; 6 = 24</b>.', act: function (t) { return t.set({ say: '4 &times; 6 = 24' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { r: 2, c: 3 }, draw: function (s) { return array(s.r, s.c); },
          sliders: [{ key: 'r', label: 'Rows', min: 1, max: 10 }, { key: 'c', label: 'In each row', min: 1, max: 10 }],
          info: function (s) { return s.r + ' rows of ' + s.c + ': <b>' + s.r + ' &times; ' + s.c + ' = ' + s.r * s.c + '</b>'; },
          tasks: [{ do: 'Build an array for <b>4 &times; 6</b>.', goal: function (s) { return s.r === 4 && s.c === 6; }, yes: '4 rows of 6 is 24.' },
            { do: 'Build an array with <b>20</b> dots.', goal: function (s) { return s.r * s.c === 20; }, yes: function (s) { return s.r + ' &times; ' + s.c + ' = 20.'; } }] }), do: '' },
        key: '<p>Rows &times; how many in each row.</p>',
        check: [TU('s2', 0), SK('md-array', 1)] },

      { id: 'turn', title: 'Turn-around facts', exp: ['B2.1', 'B2.6'], skill: 'md-array',
        body: '<p>Turn an array on its side. 4 rows of 6 becomes 6 rows of 4. It is the <b>same dots</b>, so <span class="math">4 &times; 6 = 6 &times; 4</span>.</p>',
        watch: { mount: G3.view(arrView, { r: 2, c: 5, say: '2 &times; 5 = 10' }), steps: [
          { say: '2 rows of 5 is 10.', ms: 1500 },
          { say: 'Turn it on its side.', act: function (t) { return t.set({ r: 5, c: 2, say: '5 &times; 2 = 10' }, 1600); } },
          { say: 'Now it is 5 rows of 2. Still 10 dots. <b>2 &times; 5 = 5 &times; 2</b>.', ms: 2000 }
        ] },
        example: { mount: G3.view(arrView, { r: 3, c: 6, say: '3 &times; 6 = 18' }), steps: [
          { say: 'My turn. 3 rows of 6 is 18.', ms: 1500 },
          { say: 'I turn it on its side.', act: function (t) { return t.set({ r: 6, c: 3, say: '6 &times; 3 = 18' }, 1600); } },
          { say: 'Now it is 6 rows of 3. Still 18 dots. <b>3 &times; 6 = 6 &times; 3</b>. Same answer.', ms: 2200 }
        ] },
        try: { mount: G3.play({ state: { r: 3, c: 7 }, draw: function (s) { return array(s.r, s.c); },
          buttons: [{ label: 'Turn it on its side', act: function (s) { var x = s.r; s.r = s.c; s.c = x; s.turned = (s.turned || 0) + 1; } }],
          info: function (s) { return '<b>' + s.r + ' &times; ' + s.c + ' = ' + s.r * s.c + '</b>'; },
          tasks: [{ do: 'This is 3 &times; 7. <b>Turn it</b> to see 7 &times; 3.', goal: function (s) { return s.r === 7 && s.c === 3; }, yes: 'Same 21 dots. 3 &times; 7 = 7 &times; 3 = 21.' }] }), do: '' },
        key: '<p>Turn it around: <b>same answer</b>.</p>',
        check: [TU('s2', 1), SK('md-array', 1)] },

      { id: 'split', title: 'Split a hard fact', exp: ['B2.1', 'B2.6'], skill: 'md-array', hard: true,
        body: '<p>A big array can be <b>split</b> into two smaller ones you know. 7 &times; 4 is 5 &times; 4 and 2 &times; 4. Add the parts: 20 + 8 = 28.</p>',
        watch: { mount: G3.view(arrView, { r: 7, c: 4, sp: 0, say: '7 &times; 4 = ?' }), steps: [
          { say: '7 rows of 4. That is a hard fact.', ms: 1300 },
          { say: 'Split after 5 rows.', act: function (t) { return t.set({ sp: 5, say: '5 &times; 4 and 2 &times; 4' }, 1600); } },
          { say: 'The top is 5 &times; 4 = 20. The bottom is 2 &times; 4 = 8.', act: function (t) { return t.set({ say: '20 and 8' }, 1800); } },
          { say: 'Add the parts: 20 + 8 = <b>28</b>. So 7 &times; 4 = 28.', act: function (t) { return t.set({ say: '7 &times; 4 = 28' }, 2000); } }
        ] },
        example: { mount: G3.view(arrView, { r: 8, c: 3, sp: 0, say: '8 &times; 3 = ?' }), steps: [
          { say: 'My turn. 8 rows of 3. That is a hard fact for me.', ms: 1400 },
          { say: 'I split it after 5 rows.', act: function (t) { return t.set({ sp: 5, say: '5 &times; 3 and 3 &times; 3' }, 1600); } },
          { say: 'The top is 5 &times; 3 = 15. The bottom is 3 &times; 3 = 9.', act: function (t) { return t.set({ say: '15 and 9' }, 1800); } },
          { say: 'I add the parts: 15 + 9 = <b>24</b>. So 8 &times; 3 = 24.', act: function (t) { return t.set({ say: '8 &times; 3 = 24' }, 2000); } }
        ] },
        ways: [
          { label: 'Add one more group', html: '<p>Know 5 &times; 6 = 30? Then 6 &times; 6 is one more group of 6: 30 + 6 = <b>36</b>.</p><div class="fig">' + array(6, 6, 5, '6 rows of 6, split after 5') + '</div>' },
          { label: 'Double a fact', html: '<p>4 &times; 7 is double 2 &times; 7. 2 &times; 7 = 14, and 14 + 14 = <b>28</b>.</p><div class="fig">' + array(4, 7, 2, '4 rows of 7, split in half') + '</div>' },
          { label: 'With groups', html: '<p>7 groups of 4 is 5 groups of 4 plus 2 groups of 4.</p><div class="fig">' + groups(7, 4) + '</div>' }
        ],
        try: { mount: G3.play({ state: { r: 8, c: 5, sp: 0 }, draw: function (s) { return array(s.r, s.c, s.sp); },
          sliders: [{ key: 'sp', label: 'Split after row', min: 0, max: 7 }],
          info: function (s) { return s.sp ? 'Top: ' + s.sp + ' &times; 5 = ' + s.sp * 5 + '. Bottom: ' + (8 - s.sp) + ' &times; 5 = ' + (8 - s.sp) * 5 + '. Together: <b>' + 40 + '</b>' : 'Move the slider to split 8 &times; 5.'; },
          tasks: [{ do: 'Split <b>8 &times; 5</b> into two facts you know.', goal: function (s) { return s.sp > 0; }, yes: function (s) { return s.sp * 5 + ' + ' + (8 - s.sp) * 5 + ' = 40. Any split gives the same total.'; } },
            { do: 'Now split it into <b>two equal halves</b>.', reset: false, goal: function (s) { return s.sp === 4; }, yes: '4 &times; 5 = 20, twice: 20 + 20 = 40.' }] }), do: '' },
        key: '<p><b>Split it, find each part, add the parts.</b></p>',
        mistake: '<p>Finding only one part and forgetting the other, or adding the row numbers instead of the parts. Point to each part and say its fact aloud together.</p>',
        check: [TU('s2', 2), SK('md-array', 3)] }
    ] },

    { id: 'facts', title: 'Facts of 2, 5 and 10', sub: 'Skip count to learn them by heart.', concepts: [
      { id: 'skip', title: 'Skip count to multiply', exp: ['B2.2'], skill: 'md-facts',
        body: '<p><span class="math">5 &times; 7 = 7 &times; 5</span>, so count by 5s seven times: 5, 10, 15, 20, 25, 30, 35.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 50, tick: 1, every: 5, start: 0 }, steps: [
          { say: '5 &times; 7 is the same as 7 &times; 5. Start at 0 and jump by 5, seven times.', ms: 1600 },
          { say: '5, 10, 15, 20, 25, 30, 35.', act: function (t) { return t.jumps(5, 7, 280); } },
          { say: '7 jumps of 5 land on <b>35</b>. So 5 &times; 7 = 35.', act: function (t) { return t.mark(35, '35'); }, ms: 2000 }
        ] },
        example: { tool: 'numberline', opts: { min: 0, max: 50, tick: 1, every: 5, start: 0 }, steps: [
          { say: 'My turn. 4 &times; 6 is the same as 6 &times; 4. I start at 0 and jump by 4, six times.', ms: 1700 },
          { say: '4, 8, 12, 16, 20, 24.', act: function (t) { return t.jumps(4, 6, 300); } },
          { say: '6 jumps of 4 land on <b>24</b>. So 4 &times; 6 = 24.', act: function (t) { return t.mark(24, '24'); }, ms: 2000 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 100, tick: 5, every: 10, start: 0, step: [2, 5, 10] }, tasks: [
          { do: 'Find <b>2 &times; 8</b>. It is the same as 8 &times; 2: jump by 2, eight times.', goal: function (s) { return s.at === 16; }, yes: '8 jumps of 2: 16.' },
          { do: 'Now find <b>10 &times; 6</b>. Start again from 0.', goal: function (s) { return s.at === 60; }, yes: '6 jumps of 10: 6 &times; 10 = 10 &times; 6 = 60.' }
        ] },
        key: '<p>Turn it around if it helps. Count by one number, <b>the other number of times</b>.</p>',
        check: [TU('s3', 0), TU('s3', 1), SK('md-facts', 1)] },

      { id: 'patterns', title: 'Patterns in the facts', exp: ['B2.2'], skill: 'md-facts',
        body: '<p>Each set of facts has a pattern. Facts of 2 are <b>even</b>. Facts of 5 end in <b>5 or 0</b>. Facts of 10 end in <b>0</b>.</p>',
        watch: { mount: G3.view(factView, { k: 2, say: 'Facts of 2' }), steps: [
          { say: 'Facts of 2: every second number. They are the even numbers.', ms: 2000 },
          { say: 'Facts of 5: two columns, ending in 5 or 0.', act: function (t) { return t.set({ k: 5, say: 'Facts of 5' }, 2000); } },
          { say: 'Facts of 10: only the last column. They all end in 0.', act: function (t) { return t.set({ k: 10, say: 'Facts of 10' }, 2000); } }
        ] },
        example: { mount: G3.view(factView, { k: 2, say: 'Facts of 2' }), steps: [
          { say: 'My turn. Is 70 a fact of 2, of 5 or of 10? 70 is even, so it is a fact of 2.', ms: 2200 },
          { say: '70 ends in 0, so it is a fact of 5.', act: function (t) { return t.set({ k: 5, say: 'Facts of 5' }, 1800); } },
          { say: 'It ends in 0, so it is a fact of 10 too.', act: function (t) { return t.set({ k: 10, say: 'Facts of 10' }, 1800); } },
          { say: 'Now 35. It ends in 5, so it is a fact of 5. It is odd, so it is not a fact of 2 or 10.', act: function (t) { return t.set({ k: 5, say: 'Facts of 5' }, 2200); } }
        ] },
        try: { tool: 'hundred', opts: {}, tasks: [
          { do: 'Tap all the facts of 10 on the chart: 10, 20, 30 and on to 100.', goal: function (s) { return s.lit.length === 10 && s.lit.every(function (n) { return n % 10 === 0; }); }, yes: 'They make one straight column. Every one ends in 0.' }
        ] },
        key: '<p>2s: even. 5s: end in 5 or 0. 10s: end in 0.</p>',
        check: [TU('s3', 2), SK('md-facts', 2)] },

      { id: 'missing', title: 'Find the missing number', exp: ['B2.2'], skill: 'md-facts', hard: true,
        body: '<p>In <span class="math">5 &times; ___ = 30</span>, count by 5s until you reach 30. <b>Count the jumps.</b> That is the missing number.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 40, tick: 1, every: 5, start: 0 }, steps: [
          { say: '5 &times; ___ = 30. Count by 5s to 30.', ms: 1300 },
          { say: '5, 10, 15, 20, 25, 30.', act: function (t) { return t.jumps(5, 6, 300); } },
          { say: 'That was 6 jumps of 5: 6 &times; 5 = 30. Turn it around: <b>5 &times; 6 = 30</b>.', ms: 2200 }
        ] },
        example: { tool: 'numberline', opts: { min: 0, max: 40, tick: 1, every: 5, start: 0 }, steps: [
          { say: 'My turn. 4 &times; ___ = 32. I count by 4s to 32.', ms: 1400 },
          { say: '4, 8, 12, 16, 20, 24, 28, 32.', act: function (t) { return t.jumps(4, 8, 280); } },
          { say: 'I count my jumps: 8 jumps of 4. 8 &times; 4 = 4 &times; 8, so <b>4 &times; 8 = 32</b>.', ms: 2200 }
        ] },
        ways: [
          { label: 'Use the chart', html: '<p>Read across the row of 5s until you find 30. It is under the 6.</p><div class="tbl"><table><thead><tr><th>&times;</th>' + [1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<th>' + i + '</th>'; }).join('') + '</tr></thead><tbody><tr><th>5</th>' + [1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<td' + (i === 6 ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + 5 * i + '</td>'; }).join('') + '</tr></tbody></table></div>' },
          { label: 'Make groups', html: '<p>Put 30 counters into groups of 5. How many groups? 6.</p><div class="fig">' + groups(6, 5) + '</div>' },
          { label: 'Think of division', html: '<p>5 &times; ___ = 30 asks the same thing as <span class="math">30 &divide; 5</span>. Both are <b>6</b>.</p>' }
        ],
        try: { tool: 'numberline', opts: { min: 0, max: 100, tick: 5, every: 10, start: 0, step: [2, 5, 10] }, tasks: [
          { do: 'Find the missing number: <span class="math">10 &times; ___ = 70</span>. Jump to 70 by 10s and count the jumps.', goal: function (s) { return s.at === 70; }, yes: '7 jumps. 10 &times; 7 = 70.' }
        ] },
        key: '<p>Count by the number to the answer. <b>The number of jumps is missing.</b></p>',
        mistake: '<p>Writing the last number said (30) instead of the number of jumps (6). Have the child hold up one finger for each jump.</p>',
        check: [SK('md-facts', 3), SK('md-facts', 3)] }
    ] },

    { id: 'divide', title: 'Dividing', sub: 'Share fairly, or make groups.', concepts: [
      { id: 'share', title: 'Share fairly', exp: ['B2.6'], skill: 'md-divide',
        body: '<p><b>Dividing</b> can mean sharing fairly. To share 12 among 3, deal them out one at a time until none are left. <span class="math">12 &divide; 3 = 4</span>.</p>',
        watch: { mount: G3.view(dealView, { total: 12, k: 3, dealt: 0, say: '' }), steps: [
          { say: '12 grapes to share among 3 plates.', ms: 1300 },
          { say: 'Deal one to each plate, round and round.', act: function (t) { var p = []; for (var i = 1; i <= 12; i++) p.push({ dealt: i }); return t.seq(p, 260); } },
          { say: 'Each plate has 4. <b>12 &divide; 3 = 4</b>.', act: function (t) { return t.set({ say: '12 &divide; 3 = 4' }, 2000); } }
        ] },
        example: { mount: G3.view(dealView, { total: 15, k: 5, dealt: 0, say: '' }), steps: [
          { say: 'My turn. I share 15 grapes among 5 plates.', ms: 1300 },
          { say: 'I deal one to each plate, round and round, until none are left.', act: function (t) { var p = []; for (var i = 1; i <= 15; i++) p.push({ dealt: i }); return t.seq(p, 220); } },
          { say: 'Each plate has 3. <b>15 &divide; 5 = 3</b>.', act: function (t) { return t.set({ say: '15 &divide; 5 = 3' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { total: 15, k: 3, dealt: 0 }, draw: function (s) { return plates(dealCounts(s.total, s.k, s.dealt), s.total - s.dealt); },
          buttons: [{ label: 'Deal one to each', act: function (s) { s.dealt = Math.min(s.total, s.dealt + s.k); } }, { label: 'Start over', act: function (s) { s.dealt = 0; } }],
          info: function (s) { return s.dealt < s.total ? 'Each plate has ' + Math.floor(s.dealt / s.k) + ' so far.' : '<b>' + s.total + ' &divide; ' + s.k + ' = ' + s.total / s.k + '</b>'; },
          tasks: [{ do: 'Share <b>15</b> among <b>3</b> plates. Deal until none are left.', goal: function (s) { return s.dealt === 15; }, yes: 'Each plate has 5. 15 &divide; 3 = 5.' },
            { do: 'Now share <b>20</b> among <b>4</b>.', setup: function (s) { s.total = 20; s.k = 4; }, goal: function (s) { return s.dealt === 20; }, yes: 'Each plate has 5. 20 &divide; 4 = 5.' }] }), do: '' },
        key: '<p>Share fairly: <b>deal one to each until none are left.</b></p>',
        mistake: '<p>Groups that are not equal. When you share 12 among 3, each group must get the same number: 4, 4 and 4. 5, 4 and 3 is not fair.</p>',
        check: [TU('s4', 0), SK('md-divide', 1)] },

      { id: 'group', title: 'How many groups?', exp: ['B2.6'], skill: 'md-divide',
        body: '<p>Dividing can also mean making groups. "How many bags of 5 in 20?" Take away 5 at a time and count the bags. <span class="math">20 &divide; 5 = 4</span>.</p>',
        watch: { mount: G3.view(bagView, { total: 20, size: 5, bags: 0, say: '' }), steps: [
          { say: '20 stickers. Each bag holds 5.', ms: 1300 },
          { say: 'Fill bags of 5 until none are left.', act: function (t) { return t.seq([{ bags: 1 }, { bags: 2 }, { bags: 3 }, { bags: 4 }], 650); } },
          { say: '4 bags. <b>20 &divide; 5 = 4</b>.', act: function (t) { return t.set({ say: '20 &divide; 5 = 4' }, 2000); } }
        ] },
        example: { mount: G3.view(bagView, { total: 24, size: 6, bags: 0, say: '' }), steps: [
          { say: 'My turn. I have 24 stickers. Each bag holds 6.', ms: 1300 },
          { say: 'I fill bags of 6 until none are left.', act: function (t) { return t.seq([{ bags: 1 }, { bags: 2 }, { bags: 3 }, { bags: 4 }], 650); } },
          { say: 'I count the bags: 4. <b>24 &divide; 6 = 4</b>.', act: function (t) { return t.set({ say: '24 &divide; 6 = 4' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { total: 18, size: 2, bags: 0 }, draw: function (s) { return bagView(s); },
          buttons: [{ label: 'Fill a bag', act: function (s) { if ((s.bags + 1) * s.size <= s.total) s.bags++; } }, { label: 'Start over', act: function (s) { s.bags = 0; } }],
          info: function (s) { return s.bags + ' bag' + (s.bags === 1 ? '' : 's') + ' of ' + s.size + (s.bags * s.size === s.total ? '. <b>' + s.total + ' &divide; ' + s.size + ' = ' + s.bags + '</b>' : ''); },
          tasks: [{ do: 'How many bags of <b>2</b> can you fill from <b>18</b>?', goal: function (s) { return s.bags * s.size === s.total; }, yes: '9 bags. 18 &divide; 2 = 9.' },
            { do: 'How many bags of <b>10</b> from <b>50</b>?', setup: function (s) { s.total = 50; s.size = 10; }, goal: function (s) { return s.bags * s.size === s.total; }, yes: '5 bags. 50 &divide; 10 = 5.' }] }), do: '' },
        key: '<p>Make groups: <b>take away the group size until none are left, then count the groups.</b></p>',
        check: [TU('s4', 1), SK('md-divide', 3)] },

      { id: 'think', title: 'Think multiplication', exp: ['B2.1', 'B2.2'], skill: 'md-divide', hard: true,
        body: '<p>To divide, think of a times fact. <span class="math">40 &divide; 10</span> asks: <b>10 times what is 40?</b> 10 &times; 4 = 40, so the answer is 4.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 50, tick: 5, every: 10, start: 0 }, steps: [
          { say: '40 &divide; 10. Think: 10 times what is 40?', ms: 1500 },
          { say: 'Count by 10s to 40.', act: function (t) { return t.jumps(10, 4, 320); } },
          { say: '4 jumps. 10 &times; 4 = 40, so <b>40 &divide; 10 = 4</b>.', ms: 2000 }
        ] },
        example: { tool: 'numberline', opts: { min: 0, max: 50, tick: 5, every: 10, start: 0 }, steps: [
          { say: 'My turn. 30 &divide; 5. I think: 5 times what is 30?', ms: 1500 },
          { say: 'I count by 5s to 30.', act: function (t) { return t.jumps(5, 6, 300); } },
          { say: '6 jumps. 5 &times; 6 = 30, so <b>30 &divide; 5 = 6</b>.', ms: 2000 }
        ] },
        ways: [
          { label: 'Share it', html: '<p>Share 40 among 10 people. Each gets 4.</p><div class="fig">' + groups(10, 4) + '</div>' },
          { label: 'With dimes', html: '<p>How many dimes make 40&cent;? 10&cent;, 20&cent;, 30&cent;, 40&cent;: <b>4 dimes</b>.</p>' },
          { label: 'In an array', html: '<p>40 dots in rows of 10 make 4 rows.</p><div class="fig">' + array(4, 10) + '</div>' }
        ],
        key: '<p>Divide: <b>ask "times what?"</b></p>',
        mistake: '<p>Subtracting instead of dividing (40 &divide; 10 = 30). Read it as "how many 10s are in 40?"</p>',
        check: [TU('s4', 2), SK('md-divide', 2)] }
    ] },

    { id: 'family', title: 'Fact families', sub: 'Multiplying and dividing are linked.', concepts: [
      { id: 'four', title: 'One array, four facts', exp: ['B2.1'], skill: 'md-family',
        body: '<p>One array gives <b>four facts</b>: two times facts and two division facts. They use the same three numbers.</p>',
        watch: { mount: G3.view(famView, { a: 4, b: 5, k: 0, say: '4 rows of 5' }), steps: [
          { say: '4 rows of 5: 20 dots.', ms: 1300 },
          { say: '4 &times; 5 = 20.', act: function (t) { return t.set({ k: 1, say: '' }, 1300); } },
          { say: 'Turned around: 5 &times; 4 = 20.', act: function (t) { return t.set({ k: 2 }, 1300); } },
          { say: 'Share 20 into 4 rows: 5 in each. 20 &divide; 4 = 5.', act: function (t) { return t.set({ k: 3 }, 1500); } },
          { say: 'Share 20 into 5 columns: 4 in each. 20 &divide; 5 = 4.', act: function (t) { return t.set({ k: 4, say: 'The fact family of 4, 5 and 20' }, 2200); } }
        ] },
        example: { mount: G3.view(famView, { a: 3, b: 6, k: 0, say: '3 rows of 6' }), steps: [
          { say: 'My turn. 3 rows of 6 make 18 dots.', ms: 1300 },
          { say: 'My first fact: 3 &times; 6 = 18.', act: function (t) { return t.set({ k: 1, say: '' }, 1300); } },
          { say: 'I turn it around: 6 &times; 3 = 18.', act: function (t) { return t.set({ k: 2 }, 1300); } },
          { say: 'I share 18 into 3 rows: 6 in each. 18 &divide; 3 = 6.', act: function (t) { return t.set({ k: 3 }, 1500); } },
          { say: 'I share 18 into 6 columns: 3 in each. 18 &divide; 6 = 3. Same three numbers, four facts.', act: function (t) { return t.set({ k: 4, say: 'The fact family of 3, 6 and 18' }, 2200); } }
        ] },
        try: { mount: G3.play({ state: { a: 3, b: 10, k: 4 }, draw: famView,
          sliders: [{ key: 'a', label: 'Rows', min: 2, max: 10 }, { key: 'b', label: 'In each row', min: 2, max: 10 }],
          tasks: [{ do: 'Show the fact family for <b>2, 5 and 10</b>.', goal: function (s) { return (s.a === 2 && s.b === 5) || (s.a === 5 && s.b === 2); }, yes: '2 &times; 5 = 10, 5 &times; 2 = 10, 10 &divide; 2 = 5, 10 &divide; 5 = 2.' }] }), do: '' },
        key: '<p>Same three numbers, <b>four facts</b>.</p>',
        check: [TU('s5', 0), SK('md-family', 1)] },

      { id: 'check', title: 'Check a division', exp: ['B2.1'], skill: 'md-family', hard: true,
        body: '<p>Use a times fact to <b>check</b> a division. If <span class="math">30 &divide; 5 = 6</span>, then 6 &times; 5 should be 30. It is, so the answer is right.</p>',
        watch: { mount: G3.view(groupView, { g: 6, n: 5, say: 'Jo says 35 &divide; 5 = 6' }), steps: [
          { say: 'Jo says 35 &divide; 5 = 6. Check it.', ms: 1500 },
          { say: '6 groups of 5 is 30, not 35. Jo is wrong.', act: function (t) { return t.set({ say: '6 &times; 5 = 30' }, 1800); } },
          { say: 'Add one more group: 7 groups of 5 is 35. <b>35 &divide; 5 = 7</b>.', act: function (t) { return t.set({ g: 7, say: '7 &times; 5 = 35' }, 2000); } }
        ] },
        example: { mount: G3.view(groupView, { g: 5, n: 4, say: 'Ali says 24 &divide; 4 = 5' }), steps: [
          { say: 'My turn. Ali says 24 &divide; 4 = 5. I check: answer &times; divisor = total.', ms: 1800 },
          { say: '5 groups of 4 is 20, not 24. So Ali is wrong.', act: function (t) { return t.set({ say: '5 &times; 4 = 20' }, 1800); } },
          { say: 'I add one more group: 6 groups of 4 is 24. <b>24 &divide; 4 = 6</b>.', act: function (t) { return t.set({ g: 6, say: '6 &times; 4 = 24' }, 2000); } }
        ] },
        ways: [
          { label: 'Count by the divisor', html: '<p>Count by 5s: 5, 10, 15, 20, 25, 30, 35. That is 7, not 6.</p>' },
          { label: 'Turn it around', html: '<p>Read the division backwards as a times fact: answer &times; 5 = 35? 6 &times; 5 = 30. 7 &times; 5 = 35. The answer is 7.</p>' }
        ],
        key: '<p>Check: <b>answer &times; divisor = total</b>.</p>',
        mistake: '<p>Checking with the wrong operation (adding 6 + 5). The check is always a times fact using the same three numbers.</p>',
        check: [TU('s5', 1), TU('s5', 2), SK('md-family', 3)] }
    ] },

    { id: 'scale', title: 'Scaling up', sub: 'For every 1, there are 2, 5 or 10.', concepts: [
      { id: 'ratio', title: 'For every 1, there are...', exp: ['B2.9'], skill: 'md-scale',
        body: '<p>Some things always come in the same amounts. 1 bike has 2 wheels. 1 hand has 5 fingers. 1 dime is 10 cents. Each new one adds the same amount again.</p>',
        watch: { mount: G3.view(ratioView, { k: 5, n: 1, say: '1 hand, 5 fingers' }), steps: [
          { say: '1 hand has 5 fingers.', ms: 1300 },
          { say: 'Each new hand adds 5 more fingers.', act: function (t) { return t.seq([{ n: 2, say: '2 hands: 10' }, { n: 3, say: '3 hands: 15' }, { n: 4, say: '4 hands: 20' }], 900); } },
          { say: '4 hands have <b>20 fingers</b>. 4 &times; 5 = 20.', act: function (t) { return t.set({ say: '4 &times; 5 = 20' }, 2000); } }
        ] },
        example: { mount: G3.view(ratioView, { k: 2, n: 1, say: '1 bike, 2 wheels' }), steps: [
          { say: 'My turn. 1 bike has 2 wheels.', ms: 1300 },
          { say: 'Each new bike adds 2 more wheels.', act: function (t) { return t.seq([{ n: 2, say: '2 bikes: 4' }, { n: 3, say: '3 bikes: 6' }, { n: 4, say: '4 bikes: 8' }, { n: 5, say: '5 bikes: 10' }], 800); } },
          { say: '5 bikes have <b>10 wheels</b>. For every 1 bike there are 2 wheels, so I multiply by 2: 5 &times; 2 = 10.', act: function (t) { return t.set({ say: '5 &times; 2 = 10' }, 2200); } }
        ] },
        try: { mount: G3.play({ state: { k: 2, n: 1 }, draw: ratioView,
          selects: [{ key: 'k', label: 'For every 1, there are', options: [[2, '2 (bikes and wheels)'], [5, '5 (hands and fingers)'], [10, '10 (dimes and cents)']] }],
          sliders: [{ key: 'n', label: 'How many', min: 1, max: 10 }],
          info: function (s) { var th = THINGS[s.k][0]; return '<b>' + s.n + ' ' + (s.n === 1 ? th[0] : th[1]) + ' &rarr; ' + s.n * s.k + ' ' + th[3] + '</b>'; },
          tasks: [{ do: 'How many wheels do <b>6 bikes</b> have? Show it.', goal: function (s) { return s.k === 2 && s.n === 6; }, yes: '6 &times; 2 = 12 wheels.' },
            { do: 'Show <b>8 dimes</b>. How many cents?', goal: function (s) { return s.k === 10 && s.n === 8; }, yes: '8 &times; 10 = 80 cents.' }] }), do: '' },
        key: '<p>For every 1 there are k: <b>multiply by k</b>.</p>',
        check: [TU('s6', 0), TU('s6', 1), SK('md-scale', 1)] },

      { id: 'back', title: 'Work backwards', exp: ['B2.9'], skill: 'md-scale', hard: true,
        body: '<p>Sometimes you know the big amount. 70 cents in dimes: how many dimes? Count by 10s to 70 and <b>count the jumps</b>.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 80, tick: 10, every: 10, start: 0 }, steps: [
          { say: '70 cents in dimes. How many dimes?', ms: 1300 },
          { say: 'Each dime is 10 cents. Count by 10s to 70.', act: function (t) { return t.jumps(10, 7, 280); } },
          { say: '7 jumps, so <b>7 dimes</b>. 70 &divide; 10 = 7.', ms: 2000 }
        ] },
        example: { tool: 'numberline', opts: { min: 0, max: 40, tick: 1, every: 5, start: 0 }, steps: [
          { say: 'My turn. I have 35 cents in nickels. How many nickels?', ms: 1400 },
          { say: 'Each nickel is 5 cents. I count by 5s to 35.', act: function (t) { return t.jumps(5, 7, 280); } },
          { say: 'I count the jumps: 7. So I have <b>7 nickels</b>. 35 &divide; 5 = 7.', ms: 2000 }
        ] },
        ways: [
          { label: 'Use a table', html: '<div class="tbl"><table><tbody><tr><th class="l">Dimes</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td style="background:color-mix(in srgb,var(--hi) 45%,var(--card))">7</td></tr><tr><th class="l">Cents</th><td>10</td><td>20</td><td>30</td><td>40</td><td>50</td><td>60</td><td style="background:color-mix(in srgb,var(--hi) 45%,var(--card))">70</td></tr></tbody></table></div><p>Find 70 in the cents row. Look up: <b>7</b> dimes.</p>' },
          { label: 'Make groups', html: '<p>Put 15 fingers into hands of 5: 3 hands.</p><div class="fig">' + groups(3, 5) + '</div>' }
        ],
        try: { tool: 'numberline', opts: { min: 0, max: 50, tick: 1, every: 5, start: 0, step: [2, 5, 10] }, tasks: [
          { do: '16 wheels. How many bikes? Jump by 2s to 16 and count the jumps.', goal: function (s) { return s.at === 16; }, yes: '8 jumps, so 8 bikes.' }
        ] },
        key: '<p>Know the total? <b>Count by k to it and count the jumps.</b></p>',
        mistake: '<p>Multiplying again (70 &times; 10) when the question asks how many groups. Ask: "Do we know one group, or the total?"</p>',
        check: [TU('s6', 2), SK('md-scale', 3)] }
    ] }
  ];

  A.register('multiply-divide', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Equal groups</h2>' +
'<p><b>Multiplying</b> is a fast way to add equal groups. <span class="math">3 &times; 4</span> means "3 groups of 4". You can add 4 + 4 + 4, or say 3 &times; 4 = 12.</p>' +
'<div class="lab"><span class="lt">Try it: make equal groups</span>' +
'<div class="ctrl"><label for="egg">Number of groups: <output id="eggo"></output><input type="range" id="egg" min="1" max="10" value="3"></label>' +
'<label for="egn">In each group: <output id="egno"></output><input type="range" id="egn" min="1" max="10" value="4"></label></div>' +
'<div class="fig" id="egfig"></div><div class="out" id="egout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The groups must be <b>equal</b>. 3 groups of 4 is 12. If one group had 5, it would not be 3 &times; 4.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>There are 5 plates with 2 grapes on each. 5 groups of 2: 2 + 2 + 2 + 2 + 2 = 10, so <b>5 &times; 2 = 10</b>.</p><div class="fig">' + groups(5, 2) + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Arrays and turn-around facts</h2>' +
'<p>An <b>array</b> puts things in equal rows. 4 rows of 6 is <span class="math">4 &times; 6 = 24</span>. Turn the array on its side and you get 6 rows of 4. It is the same number of dots, so <span class="math">6 &times; 4 = 24</span> too.</p>' +
'<div class="lab"><span class="lt">Try it: build and split an array</span>' +
'<div class="ctrl"><label for="arr">Rows: <output id="arro"></output><input type="range" id="arr" min="1" max="10" value="4"></label>' +
'<label for="arc">In each row: <output id="arco"></output><input type="range" id="arc" min="1" max="10" value="6"></label>' +
'<label for="ars">Split after row: <output id="arso"></output><input type="range" id="ars" min="0" max="9" value="0"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="arturn">Turn it on its side</button></div>' +
'<div class="fig" id="arfig"></div><div class="out" id="arout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>You can split a hard fact into two easier ones. 7 &times; 4 is 5 &times; 4 plus 2 &times; 4. That is 20 + 8 = 28.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>How many dots? 3 rows of 5. Count by 5s: 5, 10, 15. <b>3 &times; 5 = 15</b>.</p><div class="fig">' + array(3, 5) + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Facts of 2, 5 and 10</h2>' +
'<p>Learn these facts by heart. Skip counting helps: count by 2s, by 5s or by 10s.</p>' +
'<div class="lab"><span class="lt">Try it: find the pattern</span>' +
'<div class="ctrl"><label for="hck">Show the multiples of<select id="hck"><option value="2">2</option><option value="5" selected>5</option><option value="10">10</option></select></label></div>' +
'<div class="fig" id="hcfig"></div><div class="out" id="hcout" aria-live="polite"></div></div>' +
'<div class="tbl"><table><thead><tr><th>&times;</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr></thead><tbody>' +
[2, 5, 10].map(function (k) { var r = '<tr><th>' + k + '</th>'; for (var i = 1; i <= 10; i++) r += '<td>' + k * i + '</td>'; return r + '</tr>'; }).join('') + '</tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Facts of 2 are all even. Facts of 5 end in 5 or 0. Facts of 10 end in 0.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find 5 &times; 7. It is the same as 7 &times; 5, so count by 5s seven times: 5, 10, 15, 20, 25, 30, 35. <b>5 &times; 7 = 35</b>.</p></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Dividing: sharing and grouping</h2>' +
'<p><b>Dividing</b> splits a total into equal groups. <span class="math">12 &divide; 3</span> can mean "share 12 among 3" (each gets 4). It can also mean "how many groups of 3 are in 12?" (4 groups).</p>' +
'<div class="lab"><span class="lt">Try it: share fairly</span>' +
'<div class="ctrl"><label for="shn">Things to share<input type="number" id="shn" min="0" max="100" value="12"></label>' +
'<label for="shk">Number of groups: <output id="shko"></output><input type="range" id="shk" min="1" max="10" value="3"></label></div>' +
'<div class="fig" id="shfig"></div><div class="out" id="shout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Groups that are not equal. When you share 12 among 3, each group must get the same number: 4, 4 and 4. 5, 4 and 3 is not fair.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>20 stickers go into bags of 5. How many bags? Take away 5 at a time: 20, 15, 10, 5, 0. That is 4 bags, so <b>20 &divide; 5 = 4</b>.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Fact families</h2>' +
'<p>Multiplying and dividing are linked. One array gives four facts. This is a <b>fact family</b>.</p>' +
'<div class="fig">' + array(4, 5, 0, '4 rows of 5 dots: 4 times 5 is 20') + '</div>' +
'<div class="tbl"><table><tbody><tr><td class="math">4 &times; 5 = 20</td><td class="math">5 &times; 4 = 20</td></tr><tr><td class="math">20 &divide; 4 = 5</td><td class="math">20 &divide; 5 = 4</td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Use a multiplication fact to check a division. If 30 &divide; 5 = 6, then 6 &times; 5 should be 30. It is, so the answer is right.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find 40 &divide; 10. Think: 10 times what is 40? 10 &times; 4 = 40, so <b>40 &divide; 10 = 4</b>.</p></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Scaling up: 1 to 2, 1 to 5, 1 to 10</h2>' +
'<p>Some things always come in the same amounts. 1 bike has 2 wheels. 1 hand has 5 fingers. 1 dime is worth 10 cents. If you know one, you can find many.</p>' +
'<div class="lab"><span class="lt">Try it: scale up</span>' +
'<div class="ctrl"><label for="rtk">For every 1, there are<select id="rtk"><option value="2">2 (bikes and wheels)</option><option value="5" selected>5 (hands and fingers)</option><option value="10">10 (dimes and cents)</option></select></label>' +
'<label for="rtn">How many: <output id="rtno"></output><input type="range" id="rtn" min="1" max="10" value="4"></label></div>' +
'<div class="fig" id="rtfig"></div><div class="tbl" id="rttbl"></div><div class="out" id="rtout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>When the first amount goes up by 1, the second goes up by 2, 5 or 10 each time. It is skip counting.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A box has 6 dimes. How many cents? 1 dime is 10 cents, so 6 dimes are 6 &times; 10 = <b>60 cents</b>.</p></div>' +
'<div class="yt" data-yt="s6"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'Which picture shows <span class="math">2 &times; 3</span>?', options: ['2 groups of 3', '3 groups of 3', '2 groups of 2'], answer: 0, why: 'The first number tells how many groups. The second tells how many in each group.' },
        { q: 'Which addition matches <span class="math">4 &times; 5</span>?', options: ['4 + 5', '5 + 5 + 5 + 5', '4 + 4 + 4'], answer: 1, why: '4 &times; 5 means 4 groups of 5. Add 5 four times.' },
        { q: 'There are 3 boxes with 10 crayons in each. How many crayons?', options: ['13', '30', '310'], answer: 1, why: '3 groups of 10: 10, 20, 30.' }
      ],
      s2: [
        { q: 'An array has 2 rows of 7. How many dots?', fig: array(2, 7), options: ['9', '14', '27'], answer: 1, why: 'Count by 7s twice: 7, 14. Or 2 &times; 7.' },
        { q: '<span class="math">3 &times; 8 = 24</span>. What is <span class="math">8 &times; 3</span>?', options: ['11', '24', '38'], answer: 1, why: 'Turn the array on its side. It is the same number of dots.' },
        { q: 'Split 6 &times; 5 into 5 &times; 5 and 1 &times; 5. What is 6 &times; 5?', options: ['25', '30', '11'], answer: 1, why: '5 &times; 5 = 25 and 1 &times; 5 = 5. 25 + 5 = 30.' }
      ],
      s3: [
        { q: 'What is <span class="math">2 &times; 9</span>?', options: ['11', '18', '29'], answer: 1, why: 'Double 9: 9 + 9.' },
        { q: 'What is <span class="math">10 &times; 7</span>?', options: ['17', '70', '107'], answer: 1, why: '7 tens make 70. Facts of 10 end in 0.' },
        { q: 'Which number can be a fact of 5?', options: ['32', '45', '51'], answer: 1, why: 'Facts of 5 end in 5 or 0.' }
      ],
      s4: [
        { q: 'Share 15 crackers among 3 friends. How many does each get?', options: ['3', '5', '12'], answer: 1, why: 'Deal them out one at a time. Or think: 3 times what is 15?' },
        { q: 'How many groups of 2 are in 16?', options: ['8', '14', '18'], answer: 0, why: 'Count by 2s to 16: that is 8 jumps.' },
        { q: 'What is <span class="math">50 &divide; 10</span>?', options: ['5', '40', '500'], answer: 0, why: '10 times what is 50? 10 &times; 5 = 50.' }
      ],
      s5: [
        { q: 'Which fact is in the family of <span class="math">2 &times; 6 = 12</span>?', options: ['12 &divide; 6 = 2', '12 &minus; 6 = 6', '6 + 2 = 8'], answer: 0, why: 'A fact family uses the same three numbers with &times; and &divide;.' },
        { q: '<span class="math">5 &times; 9 = 45</span>. What is <span class="math">45 &divide; 5</span>?', options: ['9', '40', '50'], answer: 0, why: 'Use the multiplication fact: 5 times 9 is 45.' },
        { q: 'Jo says <span class="math">35 &divide; 5 = 6</span>. Check: what is 6 &times; 5?', options: ['30, so Jo is wrong', '35, so Jo is right'], answer: 0, why: '6 &times; 5 = 30, not 35. The answer is 7, because 7 &times; 5 = 35.' }
      ],
      s6: [
        { q: '1 bike has 2 wheels. How many wheels do 6 bikes have?', options: ['8', '12', '62'], answer: 1, why: 'Count by 2s six times: 6 &times; 2 = 12.' },
        { q: '1 star has 5 points. How many points do 3 stars have?', options: ['8', '15', '35'], answer: 1, why: 'Count by 5s three times: 5, 10, 15.' },
        { q: 'You have 70 cents in dimes. How many dimes?', options: ['7', '60', '70'], answer: 0, why: 'Each dime is 10 cents. 10, 20, 30, 40, 50, 60, 70 is 7 dimes.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function eg() {
        var g = +$('#egg', root).value, n = +$('#egn', root).value;
        $('#eggo', root).textContent = g; $('#egno', root).textContent = n;
        $('#egfig', root).innerHTML = groups(g, n);
        var add = []; for (var i = 0; i < g; i++) add.push(n);
        $('#egout', root).innerHTML = '<p><span class="big">' + g + ' &times; ' + n + ' = ' + g * n + '</span></p><p>' + g + ' group' + (g > 1 ? 's' : '') + ' of ' + n + ': ' + add.join(' + ') + ' = ' + g * n + '</p>';
      }
      A.bind(root, ['egg', 'egn'], eg);
      function ar() {
        var r = +$('#arr', root).value, c = +$('#arc', root).value, sp = +$('#ars', root).value;
        $('#ars', root).max = Math.max(0, r - 1);
        if (sp >= r) { sp = 0; $('#ars', root).value = 0; }
        $('#arro', root).textContent = r; $('#arco', root).textContent = c; $('#arso', root).textContent = sp ? sp : 'no split';
        $('#arfig', root).innerHTML = array(r, c, sp);
        $('#arout', root).innerHTML = '<p><span class="big">' + r + ' &times; ' + c + ' = ' + r * c + '</span> &nbsp; and ' + c + ' &times; ' + r + ' = ' + r * c + '</p>' +
          (sp ? '<p>Split: <b>' + sp + ' &times; ' + c + '</b> = ' + sp * c + ' and <b>' + (r - sp) + ' &times; ' + c + '</b> = ' + (r - sp) * c + '. ' + sp * c + ' + ' + (r - sp) * c + ' = ' + r * c + '.</p>' : '<p class="t2">Move the split slider to break the array into two easier facts.</p>');
      }
      A.bind(root, ['arr', 'arc', 'ars'], ar);
      $('#arturn', root).addEventListener('click', function () { var r = $('#arr', root).value; $('#arr', root).value = $('#arc', root).value; $('#arc', root).value = r; $('#ars', root).value = 0; ar(); });
      function hc() {
        var k = +$('#hck', root).value;
        $('#hcfig', root).innerHTML = chart100(k);
        var first = []; for (var i = 1; i <= 10; i++) first.push(k * i);
        $('#hcout', root).innerHTML = '<p><b>Facts of ' + k + ':</b> ' + first.join(', ') + '</p><p>' +
          (k === 2 ? 'Every second number is shaded. They are the even numbers. They end in 0, 2, 4, 6 or 8.' : k === 5 ? 'Two columns are shaded. Every multiple of 5 ends in 5 or 0.' : 'Only the last column is shaded. Every multiple of 10 ends in 0.') + '</p>';
      }
      A.bind(root, ['hck'], hc);
      function sh() {
        var n = clamp($('#shn', root).value, 0, 100), k = +$('#shk', root).value, each = Math.floor(n / k), left = n - each * k;
        $('#shko', root).textContent = k;
        $('#shfig', root).innerHTML = share(n, k);
        $('#shout', root).innerHTML = left ? '<p><span class="big">' + n + ' shared among ' + k + ': ' + each + ' each, ' + left + ' left over</span></p><p>' + n + ' does not split into ' + k + ' equal groups with nothing left. ' + each + ' &times; ' + k + ' = ' + each * k + ', and ' + left + ' more ' + (left === 1 ? 'is' : 'are') + ' left.</p>' :
          '<p><span class="big">' + n + ' &divide; ' + k + ' = ' + each + '</span></p><p>Each group gets ' + each + '. Check: ' + each + ' &times; ' + k + ' = ' + n + '.</p>';
      }
      A.bind(root, ['shn', 'shk'], sh);
      function rt() {
        var k = +$('#rtk', root).value, n = +$('#rtn', root).value, th = THINGS[k][0];
        $('#rtno', root).textContent = n;
        $('#rtfig', root).innerHTML = ratioFig(k, n, n + ' ' + (n === 1 ? th[0] : th[1]) + ', ' + k + ' ' + th[3] + ' each');
        var h = '<table><tbody><tr><th class="l">' + th[1].charAt(0).toUpperCase() + th[1].slice(1) + '</th>', h2 = '<tr><th class="l">' + th[3].charAt(0).toUpperCase() + th[3].slice(1) + '</th>';
        for (var i = 1; i <= n; i++) { h += '<td' + (i === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + i + '</td>'; h2 += '<td' + (i === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + i * k + '</td>'; }
        $('#rttbl', root).innerHTML = h + '</tr>' + h2 + '</tr></tbody></table>';
        $('#rtout', root).innerHTML = '<p><span class="big">' + n + ' ' + (n === 1 ? th[0] : th[1]) + ' &rarr; ' + n * k + ' ' + th[3] + '</span></p><p>1 ' + th[0] + ' has ' + k + ' ' + th[3] + ', so ' + n + ' &times; ' + k + ' = ' + n * k + '.</p>';
      }
      A.bind(root, ['rtk', 'rtn'], rt);
    },

    quiz: [
      { q: 'How many counters are there?', type: 'num', answer: 18, fig: groups(3, 6, '3 groups of 6'),
        hint: 'Count the groups and how many are in each one.', explain: '3 groups of 6: 6 + 6 + 6 = 18. 3 &times; 6 = 18.' },
      { q: 'Which multiplication matches this array?', type: 'mc', options: ['4 &times; 7', '4 + 7', '3 &times; 7', '7 &times; 7'], answer: 0, fig: array(4, 7),
        hint: 'Count the rows. Count how many are in each row.', explain: '4 rows with 7 in each row: 4 &times; 7 = 28.' },
      { q: 'What is <span class="math">5 &times; 8</span>?', type: 'num', answer: 40,
        hint: 'Count by 5s eight times.', explain: '5, 10, 15, 20, 25, 30, 35, 40. 5 &times; 8 = 40.' },
      { q: 'Share 24 muffins equally on 4 plates. How many muffins go on each plate?', type: 'num', answer: 6,
        hint: 'Think: 4 times what is 24?', explain: '24 &divide; 4 = 6, because 4 &times; 6 = 24.' },
      { q: 'Which fact is <b>not</b> in the same family as <span class="math">3 &times; 10 = 30</span>?', type: 'mc', options: ['10 &times; 3 = 30', '30 &divide; 3 = 10', '30 &divide; 10 = 3', '30 &minus; 10 = 20'], answer: 3,
        hint: 'A fact family uses only &times; and &divide; with 3, 10 and 30.', explain: '30 &minus; 10 = 20 uses subtraction and the number 20, so it is not in the family.' },
      { q: '1 hand has 5 fingers. How many fingers are on 9 hands?', type: 'num', answer: 45,
        hint: 'Count by 5s nine times, or think 9 &times; 5.', explain: '9 &times; 5 = 45.' },
      { q: 'Use <span class="math">5 &times; 6 = 30</span> and <span class="math">2 &times; 6 = 12</span> to find <span class="math">7 &times; 6</span>.', type: 'num', answer: 42, fig: array(7, 6, 5, '7 rows of 6, split after 5 rows'),
        hint: '7 rows is 5 rows plus 2 rows. Add the two parts.', explain: '30 + 12 = 42, so 7 &times; 6 = 42.' }
    ],

    practice: [
      { id: 'md-groups', name: 'Equal groups', code: 'B2.6', gen: function (lv) {
        var g = R.int(2, lv === 1 ? 5 : lv === 2 ? 6 : 9), n = lv === 1 ? R.pick([2, 5, 10]) : R.int(2, lv === 2 ? 6 : 9);
        var add = []; for (var i = 0; i < g; i++) add.push(n);
        return { q: lv === 3 ? 'What is <b>' + g + ' groups of ' + n + '</b>?' : 'How many counters are there?', type: 'num', answer: g * n,
          fig: lv === 3 ? '' : groups(g, n, g + ' groups of ' + n),
          hint: 'There are ' + g + ' groups with ' + n + ' in each. Skip count by ' + n + '.',
          steps: [g + ' groups of ' + n + ' is ' + g + ' &times; ' + n + '.', 'Add ' + n + ' ' + g + ' times: ' + add.join(' + ') + '.', 'That is ' + g * n + '.' + (lv === 3 ? '<div class="fig">' + groups(g, n) + '</div>' : '')],
          explain: g + ' &times; ' + n + ' = ' + g * n + '.' };
      } },
      { id: 'md-facts', name: 'Facts of 2, 5 and 10', code: 'B2.2', gen: function (lv) {
        var k = lv === 1 ? R.pick([2, 10]) : R.pick([2, 5, 10, 5]), n = R.int(1, 10), first = R.int(0, 1);
        var a = first ? k : n, b = first ? n : k, list = []; for (var i = 1; i <= n; i++) list.push(k * i);
        if (lv === 3) {
          return { q: 'Find the missing number: <span class="math">' + a + ' &times; ___ = ' + a * b + '</span>', type: 'num', answer: b,
            hint: 'Count by ' + a + 's until you reach ' + a * b + '. How many jumps?', steps: ['Count by ' + a + 's: ' + (function () { var l = []; for (var j = 1; j <= b; j++) l.push(a * j); return l.join(', '); })() + '.', 'That is ' + b + ' jumps of ' + a + ': ' + b + ' &times; ' + a + ' = ' + a * b + '.', 'Turn it around: ' + a + ' &times; ' + b + ' = ' + a * b + ', so the missing number is ' + b + '.'],
            explain: a + ' &times; ' + b + ' = ' + a * b + '.' };
        }
        return { q: 'What is <span class="math">' + a + ' &times; ' + b + '</span>?', type: 'num', answer: a * b,
          hint: 'Skip count by ' + k + ', ' + n + ' time' + (n > 1 ? 's' : '') + '.',
          steps: ['This is a fact of ' + k + '.' + (a === k && a !== b ? ' ' + a + ' &times; ' + b + ' = ' + b + ' &times; ' + a + '.' : ''), 'Count by ' + k + 's ' + n + ' time' + (n > 1 ? 's' : '') + ': ' + list.join(', ') + '.', a + ' &times; ' + b + ' = ' + a * b + '.'],
          explain: a + ' &times; ' + b + ' = ' + a * b + '.' };
      } },
      { id: 'md-array', name: 'Arrays', code: 'B2.6', gen: function (lv) {
        var r = R.int(2, lv === 1 ? 5 : 9), c = lv === 1 ? R.pick([2, 5, 10]) : R.int(3, 9);
        if (lv === 3) {
          var sp = R.int(1, r - 1 || 1); if (r < 2) r = 2;
          sp = Math.min(sp, r - 1);
          return { q: 'Split the array to find <span class="math">' + r + ' &times; ' + c + '</span>. What is ' + r + ' &times; ' + c + '?', type: 'num', answer: r * c, fig: array(r, c, sp, r + ' rows of ' + c + ', split after ' + sp + ' rows'),
            hint: 'Find the top part and the bottom part, then add.',
            steps: ['Top part: ' + sp + ' &times; ' + c + ' = ' + sp * c + '.', 'Bottom part: ' + (r - sp) + ' &times; ' + c + ' = ' + (r - sp) * c + '.', sp * c + ' + ' + (r - sp) * c + ' = ' + r * c + '.'],
            explain: r + ' &times; ' + c + ' = ' + r * c + '.' };
        }
        return { q: 'How many dots are in this array?', type: 'num', answer: r * c, fig: array(r, c, 0, r + ' rows of ' + c),
          hint: 'Count the rows. Then count by the number in each row.',
          steps: ['There are ' + r + ' rows with ' + c + ' in each row.', 'That is ' + r + ' &times; ' + c + '.', 'Count by ' + c + 's ' + r + ' times: ' + r * c + '.'],
          explain: r + ' &times; ' + c + ' = ' + r * c + '.' };
      } },
      { id: 'md-divide', name: 'Divide by sharing or grouping', code: 'B2.6', gen: function (lv) {
        var k = lv === 1 ? R.int(2, 5) : R.int(2, 10), each = R.int(2, lv === 1 ? 5 : 10), n = k * each;
        if (lv === 1) return { q: 'Share ' + n + ' marbles equally among ' + k + ' friends. How many does each friend get?', type: 'num', answer: each,
          fig: groups(k, 0, k + ' empty plates'), hint: 'Deal the marbles out one at a time onto the ' + k + ' plates.',
          steps: ['Give each friend 1, then 1 more, and so on.', 'Stop when all ' + n + ' are used.', 'Each friend gets ' + each + '.<div class="fig">' + groups(k, each) + '</div>'],
          explain: n + ' &divide; ' + k + ' = ' + each + ', because ' + k + ' &times; ' + each + ' = ' + n + '.' };
        if (lv === 2) return { q: 'What is <span class="math">' + n + ' &divide; ' + k + '</span>?', type: 'num', answer: each,
          hint: 'Think of the times fact: ' + k + ' times what is ' + n + '?',
          steps: ['Ask: ' + k + ' &times; ? = ' + n + '.', 'Count by ' + k + 's to ' + n + '. Count the jumps.', k + ' &times; ' + each + ' = ' + n + ', so ' + n + ' &divide; ' + k + ' = ' + each + '.'],
          explain: n + ' &divide; ' + k + ' = ' + each + '.' };
        return { q: 'There are ' + n + ' cookies. Each bag holds ' + k + ' cookies. How many bags can be filled?', type: 'num', answer: each,
          hint: 'How many groups of ' + k + ' are in ' + n + '?',
          steps: ['This is grouping: take away ' + k + ' at a time.', 'Count by ' + k + 's to ' + n + ': that is ' + each + ' jumps.', n + ' &divide; ' + k + ' = ' + each + ' bags.'],
          explain: n + ' &divide; ' + k + ' = ' + each + '. Check: ' + each + ' &times; ' + k + ' = ' + n + '.' };
      } },
      { id: 'md-family', name: 'Fact families', code: 'B2.1', gen: function (lv) {
        var a = R.int(2, lv === 1 ? 5 : 10), b = R.pick([2, 5, 10]), p = a * b;
        if (a === b) a = a === 10 ? 5 : a + 1, p = a * b;
        if (lv < 3) {
          var o = R.mc(p + ' &divide; ' + a + ' = ' + b, [p + ' &minus; ' + a + ' = ' + (p - a), a + ' + ' + b + ' = ' + (a + b), p + ' &divide; ' + b + ' = ' + (a + 1)]);
          return { q: 'Which fact is in the same family as <span class="math">' + a + ' &times; ' + b + ' = ' + p + '</span>?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'A fact family uses the same three numbers, with &times; and &divide;.',
            steps: ['The numbers are ' + a + ', ' + b + ' and ' + p + '.', 'The family: ' + a + ' &times; ' + b + ' = ' + p + ', ' + b + ' &times; ' + a + ' = ' + p + ', ' + p + ' &divide; ' + a + ' = ' + b + ', ' + p + ' &divide; ' + b + ' = ' + a + '.', 'The matching choice is ' + p + ' &divide; ' + a + ' = ' + b + '.'],
            explain: p + ' &divide; ' + a + ' = ' + b + ' uses the same three numbers.' };
        }
        return { q: 'Use <span class="math">' + a + ' &times; ' + b + ' = ' + p + '</span> to find <span class="math">' + p + ' &divide; ' + b + '</span>.', type: 'num', answer: a,
          hint: b + ' times what is ' + p + '?',
          steps: ['Division asks: ' + b + ' &times; ? = ' + p + '.', 'You know ' + a + ' &times; ' + b + ' = ' + p + '.', 'So ' + p + ' &divide; ' + b + ' = ' + a + '.'],
          explain: p + ' &divide; ' + b + ' = ' + a + '.' };
      } },
      { id: 'md-scale', name: 'Scale up by 2, 5 or 10', code: 'B2.9', gen: function (lv) {
        var k = lv === 1 ? 2 : lv === 2 ? 5 : R.pick([2, 5, 10]), th = R.pick(THINGS[k]), n = R.int(2, 10);
        if (lv === 3 && R.int(0, 1)) {
          return { q: 'You have ' + n * k + ' ' + th[3] + '. 1 ' + th[0] + ' has ' + k + ' ' + th[3] + '. How many ' + th[1] + ' is that?', type: 'num', answer: n,
            hint: 'Count by ' + k + 's until you reach ' + n * k + '.',
            steps: ['Each ' + th[0] + ' has ' + k + ' ' + th[3] + '.', 'Count by ' + k + 's to ' + n * k + ': that is ' + n + ' jumps.', 'So there are ' + n + ' ' + th[1] + '.'],
            explain: n * k + ' &divide; ' + k + ' = ' + n + '.' };
        }
        return { q: '1 ' + th[0] + ' has ' + k + ' ' + th[3] + '. How many ' + th[3] + ' do ' + n + ' ' + th[1] + ' have?', type: 'num', answer: n * k,
          fig: lv === 1 ? ratioFig(k, n, n + ' ' + th[1] + ' with ' + k + ' each') : '',
          hint: 'Each ' + th[0] + ' adds ' + k + ' more. Skip count by ' + k + '.',
          steps: ['1 ' + th[0] + ' &rarr; ' + k + ' ' + th[3] + '.', n + ' ' + th[1] + ' &rarr; ' + n + ' &times; ' + k + '.', n + ' &times; ' + k + ' = ' + n * k + '.'],
          explain: n + ' &times; ' + k + ' = ' + n * k + ' ' + th[3] + '.' };
      } }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ----------
     Each practice skill keeps its first way of asking ("plain") and adds new shapes.
     Shapes unlock with the level, so level 1 stays gentle. q.meta is read by the automatic answer checks. */
  var Q = A.Q;
  if (Q) (function () {
    var nm = Q.name, X = ' &times; ', D = ' &divide; ';
    function why(right, wrong) { var o = R.mc(right, wrong); return { options: o.options, answer: o.answer }; }
    /* three different [rows, per] pairs: the right one first, then near misses */
    function nearSets(a, b) {
      var out = [[a, b]], cand = R.shuffle([[a, b + 1], [a + 1, b], [a, b - 1], [a - 1, b], [b, a]]);
      cand.forEach(function (p) { if (out.length < 3 && p[0] >= 1 && p[1] >= 1 && !out.some(function (o) { return o[0] === p[0] && o[1] === p[1]; })) out.push(p); });
      return R.shuffle(out);
    }
    function idx(set, a, b) { for (var i = 0; i < set.length; i++) if (set[i][0] === a && set[i][1] === b) return i; return -1; }
    function skips(k, n) { var l = []; for (var i = 1; i <= n; i++) l.push(k * i); return l.join(', '); }

    var SHAPES = {
      'md-groups': [
        [1, 'tap', function (lv) {
          var g = R.int(2, lv === 1 ? 4 : 5), n = R.int(2, lv === 1 ? 5 : 6), set = nearSets(g, n);
          return { q: 'Tap the picture that shows <b>' + g + ' groups of ' + n + '</b>.', type: 'tap', tiles: set.map(function (p) { return groups(p[0], p[1]); }), answer: idx(set, g, n), answerText: 'the ' + g + ' plates with ' + n + ' on each',
            hint: 'Count the plates first. You need ' + g + '. Then check there are ' + n + ' on each.', steps: [g + ' groups means ' + g + ' plates.', 'Each plate must have ' + n + '.'],
            explain: g + ' plates with ' + n + ' on each is ' + g + X + n + ' = ' + g * n + '.', meta: { k: 'grp-tap', g: g, n: n, set: set } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), g = R.int(2, lv === 1 ? 5 : 9), n = lv === 1 ? R.pick([2, 5, 10]) : R.int(2, 9);
          var c = R.pick([['boxes', 'crayons'], ['bags', 'apples'], ['vases', 'flowers'], ['shelves', 'books'], ['teams', 'players']]);
          return { q: who + ' has ' + g + ' ' + c[0] + '. Each one has ' + n + ' ' + c[1] + '. How many ' + c[1] + ' are there in all?', type: 'num', answer: g * n,
            hint: 'There are ' + g + ' equal groups of ' + n + '. Skip count by ' + n + '.', steps: [g + ' groups of ' + n + ' is ' + g + X + n + '.', 'Count by ' + n + 's: ' + skips(n, g) + '.'],
            explain: g + X + n + ' = ' + g * n + ' ' + c[1] + '.', meta: { k: 'grp-story', g: g, n: n } };
        }],
        [1, 'match', function (lv) {
          var pairs = [], seen = {};
          while (pairs.length < 3) {
            var g = R.int(2, lv === 1 ? 5 : 7), n = lv === 1 ? R.pick([2, 5, 10]) : R.int(2, 7);
            if (seen[g * n] || seen[g + ',' + n]) continue; seen[g * n] = 1; seen[g + ',' + n] = 1;
            pairs.push([g + ' groups of ' + n, String(g * n)]);
          }
          return { q: 'Match each set of equal groups to its total.', type: 'match', pairs: pairs,
            hint: 'Skip count by the number in each group.', steps: ['3 groups of 5 is 5, 10, 15.'],
            explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'grp-match', pairs: pairs } };
        }],
        [2, 'mistake', function (lv) {
          var g = R.int(3, 6), n = R.int(3, 7), who = nm(), truth = !R.int(0, 2), said = truth ? g * n : g + n;
          var right = g + ' groups of ' + n + ' means ' + n + ' added ' + g + ' times: ' + g + X + n + ' = ' + g * n + '.';
          return { q: who + ' says ' + g + ' groups of ' + n + ' make <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: groups(g, n),
            why: why(right, ['Groups of means add the two numbers.', 'Count only the plates.', 'Count one plate and stop.']),
            hint: 'Count the counters on all the plates.', steps: [right], explain: right, meta: { k: 'grp-tf', g: g, n: n, said: said } };
        }]
      ],
      'md-facts': [
        [1, 'line', function (lv) {
          var k = lv === 1 ? R.pick([2, 10]) : R.pick([2, 5, 10]), n = R.int(2, lv === 1 ? 6 : 10);
          return { q: 'Count by ' + k + 's, <b>' + n + ' times</b>, starting at 0. Put the marker where you land. That shows ' + n + X + k + '.', type: 'line', min: 0, max: k * 10, tick: k, every: k === 2 ? 4 : k === 5 ? 10 : 20, snap: k, answer: k * n,
            hint: 'Each jump is ' + k + '. Make ' + n + ' jumps.', steps: ['Count: ' + skips(k, n) + '.', 'You land on ' + k * n + '.'],
            explain: n + X + k + ' = ' + k * n + '.', meta: { k: 'fact-line', f: k, n: n } };
        }],
        [1, 'fill', function (lv) {
          var k = lv === 1 ? R.pick([2, 5, 10]) : R.pick([2, 5, 10]), start = lv === 1 ? 1 : R.int(1, 5), seq = [];
          for (var i = 0; i < 5; i++) seq.push(k * (start + i));
          var gaps = lv === 1 ? [2, 4] : [1, 3], txt = seq.map(function (v, i) { return gaps.indexOf(i) >= 0 ? '[[]]' : String(v); }).join(', ');
          return { q: 'Count by ' + k + 's. Fill in the missing numbers.', type: 'fill', fill: '<span class="math">' + txt + '</span>', answers: gaps.map(function (i) { return seq[i]; }),
            hint: 'Add ' + k + ' each time.', steps: ['The numbers go up by ' + k + '.', 'The full count is ' + seq.join(', ') + '.'],
            explain: seq.join(', ') + '.', meta: { k: 'fact-fill', f: k } };
        }],
        [1, 'match', function (lv) {
          var k = lv === 1 ? R.pick([2, 10]) : R.pick([2, 5, 10]), ns = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 3);
          var pairs = ns.map(function (n) { return [n + X + k, String(n * k)]; });
          return { q: 'Match each fact to its answer.', type: 'match', pairs: pairs,
            hint: 'Skip count by ' + k + '.', steps: ['Count by ' + k + 's: ' + skips(k, 10) + '.'],
            explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'fact-match', pairs: pairs } };
        }],
        [2, 'pick', function (lv) {
          var k = R.pick([2, 5, 10]), opts = [], seen = {};
          while (opts.length < 5) {
            var good = opts.length < 2, v = good ? k * R.int(1, 10) : R.int(3, k * 10);
            if (!good && v % k === 0) continue;
            if (seen[v]) continue; seen[v] = 1; opts.push(v);
          }
          opts = R.shuffle(opts);
          var ans = []; opts.forEach(function (v, j) { if (v % k === 0) ans.push(j); });
          return { q: 'Pick every number you say when you count by <b>' + k + 's</b>.', type: 'pick', options: opts.map(String), answer: ans,
            hint: k === 2 ? 'Counting by 2s gives even numbers.' : k === 5 ? 'Counting by 5s ends in 0 or 5.' : 'Counting by 10s ends in 0.', steps: ['Count: ' + skips(k, 10) + '.'],
            explain: ans.map(function (j) { return opts[j]; }).join(' and ') + ' are in the count by ' + k + 's.', meta: { k: 'fact-pick', f: k } };
        }],
        [2, 'mistake', function (lv) {
          var k = R.pick([2, 5, 10]), n = R.int(3, 10), who = nm(), truth = !R.int(0, 2), said = truth ? k * n : k * n + R.pick([k, -k]);
          var right = 'Count by ' + k + 's, ' + n + ' times: ' + skips(k, n) + '. So ' + n + X + k + ' = ' + k * n + '.';
          return { q: who + ' says <span class="math">' + n + X + k + ' = ' + said + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Add ' + n + ' and ' + k + '.', 'Count by ' + k + 's and stop one early.', 'Any number that ends in 0 is right.']),
            hint: 'Skip count by ' + k + ', and keep track of how many jumps.', steps: [right], explain: right, meta: { k: 'fact-tf', a: n, b: k, said: said } };
        }]
      ],
      'md-array': [
        [1, 'tap', function (lv) {
          var r = R.int(2, lv === 1 ? 4 : 6), c = R.int(3, lv === 1 ? 5 : 7), set = nearSets(r, c);
          return { q: 'Tap the array with <b>' + r + ' rows of ' + c + '</b>.', type: 'tap', tiles: set.map(function (p) { return array(p[0], p[1], 0, p[0] + ' rows of ' + p[1]).replace(/<text[^>]*>[^<]*<\/text>/g, ''); }), answer: idx(set, r, c), answerText: 'the array with ' + r + ' rows and ' + c + ' in each row',
            hint: 'Rows go across. Count the rows first.', steps: ['Count the rows going down. You need ' + r + '.', 'Then count the dots in one row. You need ' + c + '.'],
            explain: r + ' rows of ' + c + ' is ' + r + X + c + ' = ' + r * c + '.', meta: { k: 'arr-tap', r: r, c: c, set: set } };
        }],
        [1, 'fill', function (lv) {
          var r = R.int(2, lv === 1 ? 5 : 8), c = lv === 1 ? R.pick([2, 5, 10]) : R.int(3, 9);
          return { q: 'Look at the array. Fill in the blanks.', type: 'fill', fig: array(r, c, 0, r + ' rows of ' + c).replace(/<text[^>]*>[^<]*<\/text>/g, ''), fill: '[[]] rows of [[]] is <span class="math">' + r + X + c + ' = [[]]</span>', answers: [r, c, r * c],
            hint: 'Count the rows going down. Count the dots in one row.', steps: ['There are ' + r + ' rows.', 'Each row has ' + c + ' dots.', r + X + c + ' = ' + r * c + '.'],
            explain: r + ' rows of ' + c + ' = ' + r * c + '.', meta: { k: 'arr-fill', r: r, c: c } };
        }],
        [1, 'story', function (lv) {
          var r = R.int(2, lv === 1 ? 5 : 9), c = lv === 1 ? R.pick([2, 5, 10]) : R.int(3, 9), who = nm();
          var t = R.pick(['The gym has ' + r + ' rows of chairs with ' + c + ' chairs in each row. How many chairs are there?',
            who + ' plants a garden with ' + r + ' rows of ' + c + ' carrots. How many carrots are planted?',
            'A muffin tray has ' + r + ' rows with ' + c + ' muffins in each row. How many muffins fit?']);
          return { q: t, type: 'num', answer: r * c,
            hint: 'Rows of the same size make an array. Multiply rows by the number in each row.', steps: [r + ' rows of ' + c + ' is ' + r + X + c + '.', 'Count by ' + c + 's: ' + skips(c, r) + '.'],
            explain: r + X + c + ' = ' + r * c + '.', meta: { k: 'arr-story', r: r, c: c } };
        }],
        [2, 'mistake', function (lv) {
          var r = R.int(3, 6), c = R.int(4, 8), who = nm(), kind = R.int(0, 2), said = kind === 0 ? r * c : kind === 1 ? r + c : r * (c - 1);
          var right = 'There are ' + r + ' rows with ' + c + ' in each, so ' + r + X + c + ' = ' + r * c + '.';
          return { q: who + ' says this array has <b>' + said + '</b> dots. True or false: ' + who + ' is right.', type: 'tf', answer: said === r * c, fig: array(r, c, 0),
            why: why(right, ['Add the number of rows and the number in each row.', 'Count one row and one column, then add.', 'Arrays always have 10 in a row.']),
            hint: 'Multiply the number of rows by the number in each row.', steps: [right], explain: right, meta: { k: 'arr-tf', r: r, c: c, said: said } };
        }]
      ],
      'md-divide': [
        [1, 'story', function (lv) {
          var who = nm(), k = R.int(2, lv === 1 ? 5 : 9), each = R.int(2, lv === 1 ? 5 : 9), n = k * each;
          var c = R.pick(['grapes', 'stickers', 'crackers', 'marbles']);
          return { q: who + ' shares ' + n + ' ' + c + ' equally among ' + k + ' friends. How many ' + c + ' does each friend get?', type: 'num', answer: each,
            hint: 'Deal them out one at a time, or think: ' + k + ' times what is ' + n + '?', steps: ['Ask: ' + k + X + '? = ' + n + '.', k + X + each + ' = ' + n + '.', 'Each friend gets ' + each + '.'],
            explain: n + D + k + ' = ' + each + '.', meta: { k: 'div-story', n: n, k2: k } };
        }],
        [1, 'tap', function (lv) {
          var k = R.int(2, lv === 1 ? 4 : 5), each = R.int(2, lv === 1 ? 4 : 6), n = k * each;
          var set = R.shuffle([[k, each], [k, each + 1], [k + 1, each]]);
          return { q: '<b>' + n + '</b> counters are shared fairly on <b>' + k + '</b> plates. Tap the picture that shows it.', type: 'tap', tiles: set.map(function (p) { return groups(p[0], p[1]); }), answer: idx(set, k, each), answerText: k + ' plates with ' + each + ' on each',
            hint: 'Look for ' + k + ' plates first. Then check the total is ' + n + '.', steps: [n + D + k + ' = ' + each + '.', 'So each of the ' + k + ' plates has ' + each + '.'],
            explain: n + ' shared on ' + k + ' plates is ' + each + ' on each.', meta: { k: 'div-tap', n: n, k2: k, set: set } };
        }],
        [1, 'which', function (lv) {
          var who = nm(), a = R.int(2, lv === 1 ? 5 : 9), b = R.int(2, lv === 1 ? 5 : 9), kind = R.pick(['share', 'group', 'times']);
          var t = { share: who + ' puts ' + a * b + ' pencils into ' + a + ' cups, the same number in each. How many pencils go in each cup?',
            group: 'There are ' + a * b + ' players. Each team has ' + b + ' players. How many teams are there?',
            times: who + ' buys ' + a + ' packs of yogurt. Each pack has ' + b + ' cups. How many cups is that?' }[kind];
          var d = kind === 'group' ? b : a, ans = kind === 'times' ? 0 : 1;
          var opts = kind === 'times' ? ['Multiply: ' + a + X + b, 'Add: ' + a + ' + ' + b] : ['Multiply: ' + a * b + X + d, 'Divide: ' + a * b + D + d];
          return { q: t + ' <b>Which way solves it?</b>', type: 'mc', options: opts, answer: ans,
            hint: kind === 'times' ? 'You know how many groups and how many in each. You want the total.' : 'You know the total. You want ' + (kind === 'share' ? 'how many in each group.' : 'how many groups.'),
            steps: [kind === 'times' ? 'Equal groups put together: multiply.' : 'Split a total into equal groups: divide.', opts[ans].split(': ')[1] + ' = ' + (kind === 'times' ? a * b : kind === 'group' ? a : b) + '.'],
            explain: opts[ans] + '.', meta: { k: 'div-which', kind: kind } };
        }],
        [2, 'mistake', function (lv) {
          var k = R.int(2, 9), each = R.int(2, 9), n = k * each, who = nm(), truth = !R.int(0, 2), said = truth ? each : each + R.pick([1, -1, 2]);
          var right = 'Check with multiplication: ' + k + X + said + ' = ' + k * said + (truth ? '. That is ' + n + '.' : ', not ' + n + '.');
          return { q: who + ' says <span class="math">' + n + D + k + ' = ' + said + '</span>. Check it with multiplication. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Division answers are always smaller than 10.', 'Check by adding ' + k + ' and ' + said + '.', 'Check by subtracting ' + k + ' from ' + n + '.']),
            hint: k + ' times ' + said + ' should make ' + n + '.', steps: [right], explain: right, meta: { k: 'div-tf', n: n, k2: k, said: said } };
        }]
      ],
      'md-family': [
        [1, 'pick', function (lv) {
          var a = R.int(2, lv === 1 ? 5 : 9), b = R.pick([2, 5, 10]);
          if (a === b) a = a === 2 ? 3 : a - 1;
          var p = a * b, good = R.shuffle([a + X + b + ' = ' + p, b + X + a + ' = ' + p, p + D + a + ' = ' + b, p + D + b + ' = ' + a]).slice(0, 3);
          var bad = R.shuffle([a + ' + ' + b + ' = ' + (a + b), p + D + a + ' = ' + (b + 1), a + X + (b + 1) + ' = ' + a * (b + 1)]).slice(0, 2);
          var opts = R.shuffle(good.concat(bad)), ans = []; opts.forEach(function (o, j) { if (good.indexOf(o) >= 0) ans.push(j); });
          return { q: 'Pick every fact in the same family as <span class="math">' + a + X + b + ' = ' + p + '</span>.', type: 'pick', options: opts, answer: ans,
            hint: 'Family facts use the same three numbers: ' + a + ', ' + b + ' and ' + p + '. They are all true.', steps: ['Each one must use ' + a + ', ' + b + ' and ' + p + ', with &times; or &divide;.'],
            explain: 'The family of ' + a + ', ' + b + ' and ' + p + ': ' + a + X + b + ', ' + b + X + a + ', ' + p + D + a + ', ' + p + D + b + '.', meta: { k: 'fam-pick', a: a, b: b, opts: opts } };
        }],
        [1, 'fill', function (lv) {
          var a = R.int(2, lv === 1 ? 5 : 9), b = R.pick([2, 5, 10]); if (a === b) a++;
          var p = a * b;
          return { q: 'Complete the fact family for ' + a + ', ' + b + ' and ' + p + '.', type: 'fill', fill: '<span class="math">' + b + X + a + ' = [[]]</span><br><span class="math">' + p + D + a + ' = [[]]</span><br><span class="math">' + p + D + b + ' = [[]]</span>', answers: [p, b, a],
            hint: 'Start with the multiplication you know: ' + a + X + b + ' = ' + p + '.', steps: ['Turn it around: ' + b + X + a + ' = ' + p + '.', 'Divide the total by one number to get the other.'],
            explain: b + X + a + ' = ' + p + ', ' + p + D + a + ' = ' + b + ', ' + p + D + b + ' = ' + a + '.', meta: { k: 'fam-fill', a: a, b: b } };
        }],
        [1, 'match', function (lv) {
          var pairs = [], seen = {};
          while (pairs.length < 3) {
            var a = R.int(2, lv === 1 ? 5 : 9), b = R.pick([2, 5, 10]), p = a * b;
            if (a === b || seen[p]) continue; seen[p] = 1;
            pairs.push([p + D + b, b + X + a + ' = ' + p]);
          }
          return { q: 'Match each division to the times fact that helps you solve it.', type: 'match', pairs: pairs,
            hint: 'Find the times fact with the same total and the same number you divide by.', steps: ['To find 20 &divide; 5, think: 5 &times; ? = 20.'],
            explain: pairs.map(function (x) { return x[0] + ': ' + x[1]; }).join('. ') + '.', meta: { k: 'fam-match', pairs: pairs } };
        }],
        [2, 'mistake', function (lv) {
          var a = R.int(3, 9), b = R.pick([2, 5, 10]); if (a === b) a++;
          var p = a * b, who = nm(), truth = !R.int(0, 2), said = truth ? a : b;
          var right = 'Think ' + b + X + '? = ' + p + '. The answer is ' + a + ', because ' + b + X + a + ' = ' + p + '.';
          return { q: who + ' knows <span class="math">' + a + X + b + ' = ' + p + '</span>. ' + who + ' says <span class="math">' + p + D + b + ' = ' + said + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: said * b === p,
            why: why(right, ['The answer to a division is the number you divide by.', 'Dividing by ' + b + ' gives ' + b + '.', 'The biggest number is always the answer.']),
            hint: b + ' times what makes ' + p + '?', steps: [right], explain: right, meta: { k: 'fam-tf', p: p, d: b, said: said } };
        }]
      ],
      'md-scale': [
        [1, 'fill', function (lv) {
          var k = lv === 1 ? 2 : R.pick([2, 5, 10]), th = R.pick(THINGS[k]), ns = lv === 1 ? [2, 3, 4] : [2, R.int(3, 5), R.int(6, 10)];
          var rows = '1 ' + th[0] + ' &rarr; ' + k + ' ' + th[3] + ns.map(function (n) { return '<br>' + n + ' ' + th[1] + ' &rarr; [[]] ' + th[3]; }).join('');
          return { q: 'Fill in the table.', type: 'fill', fill: rows, answers: ns.map(function (n) { return n * k; }),
            hint: 'For every 1 ' + th[0] + ', there are ' + k + ' ' + th[3] + '. Count by ' + k + 's.', steps: ns.map(function (n) { return n + X + k + ' = ' + n * k + '.'; }),
            explain: 'Each ' + th[0] + ' adds ' + k + ' more ' + th[3] + '.', meta: { k: 'scale-fill', f: k, ns: ns } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), k = lv === 1 ? R.pick([2, 5]) : R.pick([2, 5, 10]), n = R.int(2, lv === 1 ? 6 : 10);
          var c = R.pick([['pack', 'packs', 'juice boxes'], ['box', 'boxes', 'markers'], ['bag', 'bags', 'buns']]);
          return { q: 'For every 1 ' + c[0] + ', there are ' + k + ' ' + c[2] + '. ' + who + ' buys ' + n + ' ' + c[1] + '. How many ' + c[2] + ' is that?', type: 'num', answer: n * k,
            hint: 'Each ' + c[0] + ' adds ' + k + '. Count by ' + k + 's, ' + n + ' times.', steps: ['Count by ' + k + 's: ' + skips(k, n) + '.'],
            explain: n + X + k + ' = ' + n * k + ' ' + c[2] + '.', meta: { k: 'scale-story', f: k, n: n } };
        }],
        [1, 'match', function (lv) {
          var k = lv === 1 ? 2 : R.pick([5, 10]), th = R.pick(THINGS[k]), ns = R.shuffle([2, 3, 4, 5, 6, 7]).slice(0, 3);
          var pairs = ns.map(function (n) { return [n + ' ' + th[1], n * k + ' ' + th[3]]; });
          return { q: '1 ' + th[0] + ' has ' + k + ' ' + th[3] + '. Match each one.', type: 'match', pairs: pairs,
            hint: 'Count by ' + k + 's for each one.', steps: ['3 ' + th[1] + ' have 3' + X + k + ' = ' + 3 * k + ' ' + th[3] + '.'],
            explain: pairs.map(function (x) { return x[0] + ': ' + x[1]; }).join('. ') + '.', meta: { k: 'scale-match', f: k, pairs: pairs } };
        }],
        [2, 'mistake', function (lv) {
          var k = R.pick([2, 5, 10]), th = R.pick(THINGS[k]), n = R.int(3, 9), who = nm(), truth = !R.int(0, 2), said = truth ? n * k : n + k;
          var right = 'Each ' + th[0] + ' has ' + k + ' ' + th[3] + ', so ' + n + ' ' + th[1] + ' have ' + n + X + k + ' = ' + n * k + '.';
          return { q: '1 ' + th[0] + ' has ' + k + ' ' + th[3] + '. ' + who + ' says ' + n + ' ' + th[1] + ' have <b>' + said + '</b> ' + th[3] + '. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Add ' + n + ' and ' + k + '.', 'Each new ' + th[0] + ' adds 1 more.', 'The number stays the same.']),
            hint: 'Count by ' + k + 's, ' + n + ' times.', steps: [right], explain: right, meta: { k: 'scale-tf', f: k, n: n, said: said } };
        }]
      ]
    };
    Q.shapes(CH, SHAPES);
  })();
})();
