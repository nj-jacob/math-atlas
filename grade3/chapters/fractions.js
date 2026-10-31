(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var ONE = { 2: 'half', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 8: 'eighth', 10: 'tenth' };
  var MANY = { 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths' };
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  function fr(n, d) { return '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function said(n, d) { return NUMW[n] + ' ' + (n === 1 ? ONE[d] : MANY[d]); }
  function mixed(w, n, d) { return n === 0 ? String(w) : w === 0 ? fr(n, d) : w + ' and ' + fr(n, d); }
  var FILL = 'var(--strand)', EMPTY = 'var(--card)';

  function bar(n, d, w, label) {
    w = w || 480;
    var s = '', cw = w / d;
    for (var i = 0; i < d; i++) s += '<rect x="' + (4 + i * cw) + '" y="4" width="' + cw + '" height="54" style="fill:' + (i < n ? FILL : EMPTY) + ';stroke:var(--ink)" stroke-width="2.5"/>';
    return A.svg(w + 8, 62, s, label || n + ' of ' + d + ' equal parts shaded');
  }
  function pie(n, d, r, label) {
    r = r || 90;
    var cx = r + 6, cy = r + 6, s = '';
    for (var i = 0; i < d; i++) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      s += '<path d="M' + cx + ' ' + cy + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z" style="fill:' + (i < n ? FILL : EMPTY) + ';stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
    }
    if (d === 1) s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + (n ? FILL : EMPTY) + ';stroke:var(--ink)" stroke-width="2.5"/>';
    return A.svg(2 * r + 12, 2 * r + 12, s, label || n + ' of ' + d + ' equal parts shaded');
  }
  function rectGrid(n, d, label) {
    var cols = d === 6 ? 3 : d === 8 ? 4 : d === 10 ? 5 : d, rows = d / cols, cw = 260 / cols, ch = 150 / rows, s = '';
    for (var i = 0; i < d; i++) s += '<rect x="' + (4 + (i % cols) * cw) + '" y="' + (4 + Math.floor(i / cols) * ch) + '" width="' + cw + '" height="' + ch + '" style="fill:' + (i < n ? FILL : EMPTY) + ';stroke:var(--ink)" stroke-width="2.5"/>';
    return A.svg(268, 158, s, label || n + ' of ' + d + ' equal parts shaded');
  }
  function shape(kind, n, d, label) { return kind === 'pie' ? pie(n, d, 90, label) : kind === 'grid' ? rectGrid(n, d, label) : bar(n, d, 480, label); }
  /* items shared among k people: whole bars each, then the leftover bars cut into k pieces */
  function shareFig(items, k) {
    var each = Math.floor(items / k), left = items - each * k, bw = 64, s = '', rowH = 52, lx = 96;
    var pieceW = bw / k, W = Math.max(380, lx + each * (bw + 8) + left * (pieceW + 4) + 20);
    for (var p = 0; p < k; p++) {
      var y = 6 + p * rowH;
      s += '<text x="6" y="' + (y + 28) + '" font-size="17" class="tb">Person ' + (p + 1) + '</text>';
      for (var i = 0; i < each; i++) s += '<rect x="' + (lx + i * (bw + 8)) + '" y="' + (y + 6) + '" width="' + bw + '" height="34" rx="5" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
      var x = lx + each * (bw + 8) + (each ? 6 : 0);
      for (var j = 0; j < left; j++) s += '<rect x="' + (x + j * (pieceW + 4)) + '" y="' + (y + 6) + '" width="' + pieceW + '" height="34" rx="3" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/>';
    }
    return A.svg(W, k * rowH + 8, s, items + ' bars shared among ' + k + ' people: each gets ' + each + ' whole' + (left ? ' and ' + left + ' piece' + (left > 1 ? 's' : '') + ' of size 1 ' + ONE[k] : ''));
  }
  /* jumps of 1/d on a number line from 0 to 2 */
  function unitLine(n, d) {
    var x0 = 30, x1 = 530, top = Math.max(2, Math.ceil(n / d)), s = '';
    var X = function (v) { return x0 + (x1 - x0) * v / (top * d); };
    s += '<line x1="' + x0 + '" y1="80" x2="' + x1 + '" y2="80" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= top * d; i++) {
      var whole = i % d === 0;
      s += '<line x1="' + X(i) + '" y1="' + (whole ? 66 : 72) + '" x2="' + X(i) + '" y2="' + (whole ? 94 : 88) + '" style="stroke:var(--ink)" stroke-width="' + (whole ? 3 : 2) + '"/>';
      if (whole) s += '<text x="' + X(i) + '" y="118" text-anchor="middle" font-size="22" class="tb">' + i / d + '</text>';
    }
    for (var k = 1; k <= n; k++) s += '<path d="M' + X(k - 1) + ' 76 Q' + ((X(k - 1) + X(k)) / 2) + ' ' + (76 - Math.min(44, (X(k) - X(k - 1)) * 0.9)) + ' ' + X(k) + ' 76" fill="none" style="stroke:var(--strand)" stroke-width="3"/>';
    if (n) s += '<circle cx="' + X(n) + '" cy="80" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 126, s, n + ' jumps of one ' + ONE[d] + ' on a number line');
  }

  /* ---------- Lessons: one idea per screen ---------- */
  var CH = 'fractions';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function cap(t) { return t ? '<p class="g3-sym" style="font-size:1.1rem;color:var(--ink)">' + t + '</p>' : ''; }
  /* n pieces of size 1/d, grouped into wholes (dashed circles) */
  function groupFig(n, d) {
    var s = '', r0 = 62, x = 6;
    for (var g = 0; g < Math.max(1, Math.ceil(n / d)); g++) {
      var c = Math.min(d, n - g * d), cx = x + r0, cy = r0 + 6;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r0 + '" style="fill:none;stroke:var(--line)" stroke-width="2" stroke-dasharray="5 4"/>';
      for (var i = 0; i < c; i++) {
        var a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d;
        s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + r0 * Math.cos(a0)).toFixed(1) + ' ' + (cy + r0 * Math.sin(a0)).toFixed(1) + ' A' + r0 + ' ' + r0 + ' 0 0 1 ' + (cx + r0 * Math.cos(a1)).toFixed(1) + ' ' + (cy + r0 * Math.sin(a1)).toFixed(1) + ' Z" style="fill:' + (c === d ? 'var(--strand)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      }
      x += 2 * r0 + 20;
    }
    return A.svg(Math.max(200, x), 2 * r0 + 12, s, n + ' ' + (n === 1 ? ONE[d] : MANY[d]) + ' grouped into wholes');
  }
  function groupText(n, d) { var w = Math.floor(n / d), r = n % d; return '<b>' + n + ' ' + (n === 1 ? ONE[d] : MANY[d]) + ' = ' + mixed(w, r, d) + '</b>' + (w ? ' (' + w + ' whole' + (w > 1 ? 's' : '') + (r ? ' and ' + said(r, d) : '') + ')' : ''); }
  function unitView(s) { return '<div>' + unitLine(s.n, s.d) + (s.bars ? bar(Math.min(s.n, s.d), s.d, 300) + (s.n > s.d ? bar(s.n - s.d, s.d, 300) : '') : '') + cap(s.say) + '</div>'; }
  /* fair share in stages: wholes handed out, then the leftovers, then the leftovers cut */
  function shareView(s) {
    var h = '';
    if (s.stage === 0) h = '<p class="t2" style="text-align:center">' + s.items + ' bars to share among ' + s.k + '</p>' + A.svg(s.items * 72 + 8, 46, (function () { var t = ''; for (var i = 0; i < s.items; i++) t += '<rect x="' + (4 + i * 72) + '" y="6" width="64" height="34" rx="5" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>'; return t; })(), s.items + ' bars');
    else {
      var w = Math.floor(s.items / s.k), l = s.items - w * s.k;
      h = shareFig(s.stage === 1 ? w * s.k : s.items, s.k);
      if (s.stage === 1 && l) h += '<p class="t2" style="text-align:center;margin:.4em 0 0">Left over: ' + l + '</p>' + A.svg(l * 72 + 8, 46, (function () { var t = ''; for (var i = 0; i < l; i++) t += '<rect x="' + (4 + i * 72) + '" y="6" width="64" height="34" rx="5" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/>'; return t; })(), l + ' bars left over');
    }
    return '<div>' + h + cap(s.say) + '</div>';
  }
  function eqPair(s) { return '<div>' + bar(s.n1, s.d1, 400) + '<div style="height:.4em"></div>' + bar(s.n2, s.d2, 400) + cap(s.say) + '</div>'; }

  var LESSONS = [
    { id: 'parts', title: 'Equal parts', sub: 'A fraction names equal parts of a whole.', concepts: [
      { id: 'equal', title: 'Parts must be equal', exp: ['B1.6'], skill: 'fr-name',
        body: '<p>To make a fraction, cut the whole into <b>equal parts</b>. Every part must be the same size.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + (s.eq ? bar(1, 2, 400) : A.svg(408, 62, '<rect x="4" y="4" width="280" height="54" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2.5"/><rect x="284" y="4" width="120" height="54" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>', 'A bar cut into a big part and a small part')) + cap(s.say) + '</div>'; }, { eq: false, say: 'Is this one half?' }), steps: [
          { say: 'This bar has 2 parts. Is the shaded part one half?', ms: 1800 },
          { say: 'No. The parts are not the same size. One is much bigger.', act: function (t) { return t.set({ say: 'Not equal: not halves' }, 1800); } },
          { say: 'Cut it into 2 <b>equal</b> parts. Now each part is one half.', act: function (t) { return t.set({ eq: true, say: 'Equal parts: ' + fr(1, 2) + ' is shaded' }, 2000); } }
        ] },
        try: { tool: 'fractions', opts: { parts: 1, choices: [1, 2, 3, 4, 6, 8] }, tasks: [
          { do: 'Cut the bar into <b>4 equal parts</b>. Shade one of them.', goal: function (s) { return s[0].d === 4 && s[0].n === 1; }, yes: 'One of 4 equal parts: one fourth.' },
          { do: 'Cut it into <b>thirds</b> and shade them all.', goal: function (s) { return s[0].d === 3 && s[0].n === 3; }, yes: 'Three thirds: the whole bar.' }
        ] },
        key: '<p>A fraction needs <b>equal parts</b>.</p>',
        mistake: '<p>Calling any one of 2 parts "a half", even when the parts are different sizes. Ask: "Are the parts the same size?" before naming a fraction.</p>',
        check: [TU('s1', 2), SK('fr-name', 1)] },

      { id: 'name', title: 'Top and bottom numbers', exp: ['B1.6'], skill: 'fr-name',
        body: '<p>The <b>bottom</b> number says how many equal parts in all. The <b>top</b> number says how many parts we mean. ' + fr(3, 4) + ' is three of four equal parts.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + shape(s.kind, s.n, s.d) + cap(s.say) + '</div>'; }, { kind: 'pie', n: 0, d: 4, say: '4 equal parts' }), steps: [
          { say: 'The circle is cut into 4 equal parts. 4 is the bottom number.', ms: 1700 },
          { say: 'Shade 1, 2, 3 parts. 3 is the top number.', act: function (t) { return t.seq([{ n: 1 }, { n: 2 }, { n: 3, say: fr(3, 4) + ' three fourths' }], 600); } },
          { say: 'The same idea on a bar: <b>' + fr(3, 4) + '</b>.', act: function (t) { return t.set({ kind: 'bar' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { kind: 'grid', d: 6, n: 2 }, draw: function (s) { return shape(s.kind, s.n, s.d); },
          selects: [{ key: 'kind', label: 'Shape', options: [['bar', 'bar'], ['pie', 'circle'], ['grid', 'rectangle']] }, { key: 'd', label: 'Equal parts', options: [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [8, '8'], [10, '10']], change: function (s) { if (s.n > s.d) s.n = s.d; } }],
          sliders: [{ key: 'n', label: 'Shaded', min: 0, max: 10 }],
          info: function (s) { return s.n > s.d ? 'There are only ' + s.d + ' parts.' : '<span class="big">' + fr(s.n, s.d) + '</span> ' + said(s.n, s.d); },
          tasks: [{ do: 'Show <b>' + fr(5, 8) + '</b>.', goal: function (s) { return s.d === 8 && s.n === 5; }, yes: '5 of 8 equal parts: five eighths.' },
            { do: 'Show <b>' + fr(2, 5) + '</b> on a circle.', goal: function (s) { return s.d === 5 && s.n === 2 && s.kind === 'pie'; }, yes: 'Two fifths.' }] }), do: '' },
        key: '<p>Bottom: <b>parts in all</b>. Top: <b>parts we mean</b>.</p>',
        mistake: '<p>Flipping the numbers (writing 4 over 3). Point and say: "How many in all? That goes on the bottom."</p>',
        check: [TU('s1', 0), TU('s1', 1), SK('fr-name', 2)] }
    ] },

    { id: 'share', title: 'Fair sharing', sub: 'Everyone gets the same amount.', concepts: [
      { id: 'wholes', title: 'Hand out wholes first', exp: ['B1.6'], skill: 'fr-share',
        body: '<p>To share fairly, first give everyone the <b>same number of whole things</b>. Sometimes nothing is left over.</p>',
        watch: { mount: G3.view(shareView, { items: 6, k: 3, stage: 0, say: '' }), steps: [
          { say: '6 granola bars for 3 people.', ms: 1400 },
          { say: 'Hand them out one at a time. Each person gets 2.', act: function (t) { return t.set({ stage: 2, say: 'Each gets 2' }, 1800); } },
          { say: 'Nothing is left over. 6 shared among 3 is <b>2 each</b>.', ms: 1800 }
        ] },
        try: { mount: G3.play({ state: { items: 4, k: 2 }, draw: function (s) { return shareFig(s.items, s.k); },
          sliders: [{ key: 'items', label: 'Bars', min: 1, max: 20 }],
          selects: [{ key: 'k', label: 'People', options: [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [8, '8'], [10, '10']] }],
          info: function (s) { var w = Math.floor(s.items / s.k), l = s.items - w * s.k; return 'Each person gets <b>' + mixed(w, l, s.k) + '</b>' + (l ? '' : '. Nothing left over.'); },
          tasks: [{ do: 'Share <b>12 bars</b> among <b>4 people</b>.', goal: function (s) { return s.items === 12 && s.k === 4; }, yes: '3 whole bars each, with none left.' }] }), do: '' },
        key: '<p>Fair share: <b>everyone gets the same</b>.</p>',
        check: [TU('s2', 0), SK('fr-share', 1)] },

      { id: 'cut', title: 'Cut the leftovers', exp: ['B1.6'], skill: 'fr-share', hard: true,
        body: '<p>If some are left over, cut each leftover into <b>as many pieces as there are people</b>. 3 people? Cut into thirds.</p>',
        watch: { mount: G3.view(shareView, { items: 5, k: 2, stage: 0, say: '' }), steps: [
          { say: '5 bars for 2 people.', ms: 1400 },
          { say: 'Each person gets 2 whole bars. 1 bar is left.', act: function (t) { return t.set({ stage: 1, say: '2 each, 1 left over' }, 2000); } },
          { say: '2 people, so cut the last bar in half. Each gets <b>2 and ' + fr(1, 2) + '</b>.', act: function (t) { return t.set({ stage: 2, say: '2 and ' + fr(1, 2) + ' each' }, 2200); } }
        ] },
        ways: [
          { label: 'One pizza', html: '<p>1 pizza for 4 people: cut it into 4 equal slices. Each gets ' + fr(1, 4) + '.</p><div class="fig">' + pie(1, 4, 70) + '</div>' },
          { label: 'Count the people', html: '<p>The number of people is the bottom number. 2 people: halves. 3 people: thirds. 4 people: fourths.</p>' },
          { label: 'Divide first', html: '<p>7 bars among 3: 3 &times; 2 = 6, so 2 each. 1 left, cut into thirds: <b>2 and ' + fr(1, 3) + '</b>.</p><div class="fig">' + shareFig(7, 3) + '</div>' }
        ],
        try: { mount: G3.play({ state: { items: 7, k: 2 }, draw: function (s) { return shareFig(s.items, s.k); },
          sliders: [{ key: 'items', label: 'Bars', min: 1, max: 20 }],
          selects: [{ key: 'k', label: 'People', options: [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [8, '8'], [10, '10']] }],
          info: function (s) { var w = Math.floor(s.items / s.k), l = s.items - w * s.k; return 'Each person gets <b>' + mixed(w, l, s.k) + '</b>' + (l ? ': ' + (w ? w + ' whole and ' : '') + said(l, s.k) : ''); },
          tasks: [{ do: 'Share <b>4 bars</b> among <b>3 people</b>. How much each?', goal: function (s) { return s.items === 4 && s.k === 3; }, yes: '1 whole and ' + fr(1, 3) + ' each.' },
            { do: 'Find a way where each person gets <b>' + fr(1, 2) + '</b> bar and no wholes.', goal: function (s) { return s.items * 2 === s.k; }, yes: function (s) { return s.items + ' bar' + (s.items > 1 ? 's' : '') + ' among ' + s.k + ' people: half each.'; } }] }), do: '' },
        key: '<p>Leftovers: <b>cut into as many pieces as people</b>.</p>',
        mistake: '<p>Cutting the leftover by the number of bars instead of the number of people. Ask: "How many people need a piece?"</p>',
        check: [TU('s2', 1), TU('s2', 2), SK('fr-share', 2)] }
    ] },

    { id: 'unit', title: 'Unit fractions', sub: 'Count pieces to make a fraction.', concepts: [
      { id: 'count', title: 'Count the pieces', exp: ['B2.8'], skill: 'fr-unit',
        body: '<p>A <b>unit fraction</b> is one piece, like ' + fr(1, 5) + '. Count unit fractions to make others: ' + fr(1, 5) + ', ' + fr(2, 5) + ', ' + fr(3, 5) + '. The top number counts the pieces.</p>',
        watch: { mount: G3.view(unitView, { n: 0, d: 5, bars: true, say: 'Count fifths' }), steps: [
          { say: 'Each jump is one fifth.', ms: 1300 },
          { say: 'One fifth, two fifths, three fifths.', act: function (t) { return t.seq([{ n: 1, say: fr(1, 5) }, { n: 2, say: fr(1, 5) + ' + ' + fr(1, 5) + ' = ' + fr(2, 5) }, { n: 3, say: fr(1, 5) + ' + ' + fr(1, 5) + ' + ' + fr(1, 5) + ' = ' + fr(3, 5) }], 1100); } },
          { say: '3 pieces of one fifth make <b>' + fr(3, 5) + '</b>.', ms: 1800 }
        ] },
        try: { tool: 'fractions', opts: { parts: 6, choices: [2, 3, 4, 5, 6, 8, 10] }, tasks: [
          { do: 'Shade <b>' + fr(4, 6) + '</b>, one sixth at a time.', goal: function (s) { return s[0].d === 6 && s[0].n === 4; }, yes: 'Four sixths: ' + fr(1, 6) + ' four times.' },
          { do: 'Cut into eighths and shade <b>' + fr(3, 8) + '</b>.', goal: function (s) { return s[0].d === 8 && s[0].n === 3; }, yes: 'Three eighths.' }
        ] },
        key: '<p>The <b>top number counts</b> the unit pieces.</p>',
        mistake: '<p>Adding the bottoms too (' + fr(1, 3) + ' + ' + fr(1, 3) + ' = ' + fr(2, 6) + '). The size of the piece does not change when you count more of them.</p>',
        check: [TU('s3', 0), TU('s3', 1), SK('fr-unit', 1)] },

      { id: 'whole', title: 'One whole and more', exp: ['B2.8'], skill: 'fr-unit', hard: true,
        body: '<p>Count as many pieces as the bottom number and you have <b>one whole</b>: ' + fr(4, 4) + ' = 1. Keep counting and you go past 1: ' + fr(5, 4) + ' is 1 and ' + fr(1, 4) + '.</p>',
        watch: { mount: G3.view(unitView, { n: 0, d: 4, bars: true, say: 'Count fourths' }), steps: [
          { say: 'Count fourths.', act: function (t) { return t.seq([{ n: 1, say: fr(1, 4) }, { n: 2, say: fr(2, 4) }, { n: 3, say: fr(3, 4) }], 800); } },
          { say: 'Four fourths fill the whole. ' + fr(4, 4) + ' = 1.', act: function (t) { return t.set({ n: 4, say: fr(4, 4) + ' = 1' }, 1800); } },
          { say: 'One more fourth: <b>' + fr(5, 4) + ' = 1 and ' + fr(1, 4) + '</b>.', act: function (t) { return t.set({ n: 5, say: fr(5, 4) + ' = 1 and ' + fr(1, 4) }, 2000); } }
        ] },
        ways: [
          { label: 'With pizzas', html: '<p>4 slices of a pizza cut into fourths is a whole pizza. One more slice comes from a second pizza.</p><div class="fig">' + groupFig(5, 4) + '</div>' },
          { label: 'Take out the whole', html: '<p>' + fr(7, 5) + ': take 5 fifths to make 1 whole. 7 &minus; 5 = 2 fifths are left. So ' + fr(7, 5) + ' = 1 and ' + fr(2, 5) + '.</p>' },
          { label: 'On a number line', html: '<div class="fig">' + unitLine(7, 5) + '</div><p>The fifth jump lands on 1. Two more jumps go past it.</p>' }
        ],
        try: { mount: G3.play({ state: { d: 3, n: 2, bars: true }, draw: unitView,
          selects: [{ key: 'd', label: 'Piece size', options: [[2, 'halves'], [3, 'thirds'], [4, 'fourths'], [5, 'fifths'], [6, 'sixths'], [8, 'eighths'], [10, 'tenths']], change: function (s) { if (s.n > 2 * s.d) s.n = 2 * s.d; } }],
          sliders: [{ key: 'n', label: 'Pieces', min: 0, max: 20 }],
          info: function (s) { return s.n > 2 * s.d ? 'Try fewer pieces.' : '<span class="big">' + fr(s.n, s.d) + '</span> ' + (s.n >= s.d ? '= ' + mixed(Math.floor(s.n / s.d), s.n % s.d, s.d) : said(s.n, s.d)); },
          tasks: [{ do: 'Show <b>one whole</b> made of thirds.', goal: function (s) { return s.d === 3 && s.n === 3; }, yes: fr(3, 3) + ' = 1.' },
            { do: 'Show <b>1 and ' + fr(3, 6) + '</b>.', goal: function (s) { return s.d === 6 && s.n === 9; }, yes: fr(9, 6) + ' = 1 and ' + fr(3, 6) + '.' }] }), do: '' },
        key: '<p>Top = bottom: <b>one whole</b>.</p>',
        mistake: '<p>Thinking a fraction can never be more than 1. Count past the whole on the number line together.</p>',
        check: [TU('s3', 2), SK('fr-unit', 3)] }
    ] },

    { id: 'equiv', title: 'Comparing fractions', sub: 'Size of pieces, and same amounts with different names.', concepts: [
      { id: 'size', title: 'More pieces, smaller pieces', exp: ['B1.7'], skill: 'fr-equiv',
        body: '<p>The more equal pieces a whole is cut into, the <b>smaller</b> each piece is. ' + fr(1, 8) + ' is smaller than ' + fr(1, 4) + '.</p>',
        watch: { tool: 'fractions', opts: { wall: [2, 4, 8] }, steps: [
          { say: 'Three bars, the same size. Halves, fourths and eighths.', ms: 1500 },
          { say: 'Shade one half.', act: function (t) { return t.shade(1, 0); } },
          { say: 'Shade one fourth. It is smaller.', act: function (t) { return t.shade(1, 1); } },
          { say: 'Shade one eighth. Smaller again. <b>More pieces, smaller pieces.</b>', act: function (t) { return t.shade(1, 2); }, ms: 2000 }
        ] },
        try: { tool: 'fractions', opts: { wall: [2, 3, 6, 10] }, tasks: [
          { do: 'Shade <b>one piece in every bar</b>. Which piece is the smallest?', goal: function (s) { return s.every(function (r) { return r.n === 1; }); }, yes: 'One tenth is the smallest: the whole is cut into the most pieces.' }
        ] },
        key: '<p><b>More pieces, smaller pieces.</b></p>',
        mistake: '<p>Thinking ' + fr(1, 8) + ' is bigger than ' + fr(1, 4) + ' because 8 is bigger than 4. Use the bars side by side.</p>',
        check: [TU('s4', 2), SK('fr-equiv', 1)] },

      { id: 'same', title: 'Same amount, different names', exp: ['B1.7'], skill: 'fr-equiv', hard: true,
        body: '<p>Cut each half into 2 pieces and you get fourths. ' + fr(1, 2) + ' is the <b>same amount</b> as ' + fr(2, 4) + '. These are <b>equivalent fractions</b>.</p>',
        watch: { mount: G3.view(eqPair, { n1: 1, d1: 2, n2: 0, d2: 2, say: fr(1, 2) }), steps: [
          { say: 'One half of a bar.', ms: 1300 },
          { say: 'Cut each half into 2 pieces.', act: function (t) { return t.set({ d2: 4, n2: 0, say: 'Fourths' }, 1400); } },
          { say: 'Shade the same amount: 2 fourths.', act: function (t) { return t.seq([{ n2: 1 }, { n2: 2, say: fr(1, 2) + ' = ' + fr(2, 4) }], 700); } },
          { say: 'The shaded parts end at the same place. <b>' + fr(1, 2) + ' = ' + fr(2, 4) + '</b>.', ms: 2000 }
        ] },
        ways: [
          { label: 'On a circle', html: '<div class="vrow"><figure><figcaption>' + fr(1, 3) + '</figcaption>' + pie(1, 3, 56) + '</figure><figure><figcaption>' + fr(2, 6) + '</figcaption>' + pie(2, 6, 56) + '</figure></div><p>Same amount of the circle.</p>' },
          { label: 'Share a sandwich', html: '<p>Eat one half of a sandwich, or cut it into fourths and eat 2. You ate the same amount.</p>' },
          { label: 'Fraction strips', html: '<p>Shade the top strip, then shade the bottom strip to the same place.</p>', tool: 'fractions', opts: { wall: [5, 10] } }
        ],
        try: { tool: 'fractions', opts: { wall: [2, 4, 8] }, tasks: [
          { do: 'Shade <b>one half</b> on top. Then shade the <b>fourths</b> that match it.', goal: function (s) { return s[0].n === 1 && s[1].n === 2; }, yes: fr(1, 2) + ' = ' + fr(2, 4) + '.' },
          { do: 'Now shade the <b>eighths</b> that match too.', reset: false, goal: function (s) { return s[0].n === 1 && s[1].n === 2 && s[2].n === 4; }, yes: fr(1, 2) + ' = ' + fr(2, 4) + ' = ' + fr(4, 8) + '.' }
        ] },
        key: '<p>Line them up: <b>same end, same amount</b>.</p>',
        mistake: '<p>Shading the right number of pieces but not lining them up from the left, so the bars look different. Shade from the left edge each time.</p>',
        check: [TU('s4', 0), TU('s4', 1), SK('fr-equiv', 2)] }
    ] },

    { id: 'groups', title: 'Groups of halves, thirds and fourths', sub: 'Put small pieces together into wholes.', concepts: [
      { id: 'make', title: 'Make wholes', exp: ['B2.7'], skill: 'fr-groups',
        body: '<p>2 halves make 1 whole. 3 thirds make 1 whole. 4 fourths make 1 whole. To count wholes, <b>group the pieces by the bottom number</b>.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + groupFig(s.n, 2) + cap(s.say) + '</div>'; }, { n: 1, say: fr(1, 2) }), steps: [
          { say: 'Add halves one at a time.', act: function (t) { return t.seq([{ n: 2, say: '2 halves = 1 whole' }, { n: 3, say: '3 halves' }, { n: 4, say: '4 halves = 2 wholes' }, { n: 5, say: '5 halves' }, { n: 6, say: '6 halves = 3 wholes' }], 800); } },
          { say: 'Every 2 halves make a whole. <b>6 halves = 3 wholes</b>.', ms: 2000 }
        ] },
        try: { mount: G3.play({ state: { d: 2, n: 3 }, draw: function (s) { return groupFig(s.n, s.d); },
          selects: [{ key: 'd', label: 'Piece', options: [[2, 'one half'], [3, 'one third'], [4, 'one fourth']] }],
          sliders: [{ key: 'n', label: 'How many pieces', min: 1, max: 12 }],
          info: function (s) { return groupText(s.n, s.d); },
          tasks: [{ do: 'How many wholes are <b>8 fourths</b>? Show it.', goal: function (s) { return s.d === 4 && s.n === 8; }, yes: '8 fourths = 2 wholes.' },
            { do: 'Show <b>3 wholes</b> made of thirds.', goal: function (s) { return s.d === 3 && s.n === 9; }, yes: '9 thirds = 3 wholes.' }] }), do: '' },
        key: '<p>Group by the bottom number. <b>Each group is 1 whole.</b></p>',
        check: [TU('s5', 0), TU('s5', 1), SK('fr-groups', 1)] },

      { id: 'recipe', title: 'Solve problems with pieces', exp: ['B2.7'], skill: 'fr-groups', hard: true,
        body: '<p>A recipe uses ' + fr(1, 4) + ' cup of oats for each batch. For 8 batches, you need 8 fourths. Group them by 4: <b>2 cups</b>.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + groupFig(s.n, 4) + cap(s.say) + '</div>'; }, { n: 0, say: fr(1, 4) + ' cup each batch' }), steps: [
          { say: 'Each batch uses ' + fr(1, 4) + ' cup.', ms: 1300 },
          { say: 'Add one fourth for each batch.', act: function (t) { var p = []; for (var i = 1; i <= 8; i++) p.push({ n: i, say: i + ' batch' + (i > 1 ? 'es' : '') }); return t.seq(p, 420); } },
          { say: '8 fourths in groups of 4 make <b>2 cups</b>.', act: function (t) { return t.set({ say: '8 fourths = 2 cups' }, 2000); } }
        ] },
        ways: [
          { label: 'Skip count', html: '<p>4 batches use 1 cup. 8 batches use 2 cups. Count by 4s: 4, 8.</p>' },
          { label: 'Use division', html: '<p>8 fourths &divide; 4 fourths in a cup = <b>2 cups</b>.</p>' },
          { label: 'Make a table', html: '<div class="tbl"><table><tbody><tr><th class="l">Batches</th><td>4</td><td>8</td><td>12</td></tr><tr><th class="l">Cups</th><td>1</td><td>2</td><td>3</td></tr></tbody></table></div>' }
        ],
        try: { mount: G3.play({ state: { d: 3, n: 1 }, draw: function (s) { return groupFig(s.n, s.d); },
          selects: [{ key: 'd', label: 'Each glass holds', options: [[2, 'one half litre'], [3, 'one third litre'], [4, 'one fourth litre']] }],
          sliders: [{ key: 'n', label: 'Glasses', min: 1, max: 12 }],
          info: function (s) { var w = Math.floor(s.n / s.d), r = s.n % s.d; return s.n + ' glass' + (s.n > 1 ? 'es' : '') + ' of ' + fr(1, s.d) + ' litre = <b>' + mixed(w, r, s.d) + ' litre' + (s.n > s.d ? 's' : '') + '</b>'; },
          tasks: [{ do: 'Each glass holds ' + fr(1, 3) + ' litre. How many litres in <b>6 glasses</b>?', goal: function (s) { return s.d === 3 && s.n === 6; }, yes: '6 thirds = 2 litres.' }] }), do: '' },
        key: '<p>Count the pieces, then <b>group by the bottom number</b>.</p>',
        mistake: '<p>Answering with the number of pieces (8) instead of the number of wholes (2). Ask: "How many full cups is that?"</p>',
        check: [TU('s5', 2), SK('fr-groups', 3)] }
    ] }
  ];

  A.register('fractions', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Equal parts</h2>' +
'<p>A <b>fraction</b> names equal parts of a whole. The bottom number says how many equal parts the whole is cut into. The top number says how many parts we mean.</p>' +
'<div class="vrow"><figure><figcaption>' + fr(3, 4) + ' three fourths</figcaption>' + pie(3, 4, 60) + '</figure><figure><figcaption>' + fr(1, 2) + ' one half</figcaption>' + pie(1, 2, 60) + '</figure><figure><figcaption>' + fr(2, 3) + ' two thirds</figcaption>' + pie(2, 3, 60) + '</figure></div>' +
'<div class="lab"><span class="lt">Try it: cut and shade</span>' +
'<div class="ctrl"><label for="fsk">Shape<select id="fsk"><option value="bar">bar</option><option value="pie" selected>circle</option><option value="grid">rectangle</option></select></label>' +
'<label for="fsd">Equal parts<select id="fsd"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>8</option><option>10</option></select></label>' +
'<label for="fsn">Shaded: <output id="fsno"></output><input type="range" id="fsn" min="0" max="4" value="3"></label></div>' +
'<div class="fig" id="fsfig"></div><div class="out" id="fsout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Parts that are not equal. This shape has 2 parts, but they are not the same size. So the shaded part is <b>not</b> one half.</p>' +
'<div class="fig">' + A.svg(268, 70, '<rect x="4" y="4" width="180" height="60" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2.5"/><rect x="184" y="4" width="80" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>', 'A bar cut into a big part and a small part') + '</div></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A bar is cut into 5 equal parts. 2 parts are shaded. That is ' + fr(2, 5) + ', two fifths.</p><div class="fig">' + bar(2, 5) + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Fair sharing</h2>' +
'<p>To share fairly, everyone gets the same amount. First hand out whole things. If some are left, cut each one into equal pieces, one piece for each person.</p>' +
'<div class="lab"><span class="lt">Try it: share granola bars</span>' +
'<div class="ctrl"><label for="fbi">Bars: <output id="fbio"></output><input type="range" id="fbi" min="1" max="20" value="7"></label>' +
'<label for="fbk">People<select id="fbk"><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option><option>8</option><option>10</option></select></label></div>' +
'<div class="fig" id="fbfig"></div><div class="out" id="fbout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>When you share among 3 people, cut leftovers into <b>thirds</b>. Among 4 people, cut into <b>fourths</b>. The number of people tells you the size of the pieces.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Share 5 bars among 2 people. Each gets 2 whole bars. 1 bar is left, so cut it in half. Each person gets <b>2 and ' + fr(1, 2) + '</b> bars.</p><div class="fig">' + shareFig(5, 2) + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Counting unit fractions</h2>' +
'<p>A <b>unit fraction</b> is one piece, like ' + fr(1, 4) + '. Other fractions are made by counting unit fractions. ' + fr(3, 4) + ' is ' + fr(1, 4) + ' + ' + fr(1, 4) + ' + ' + fr(1, 4) + '. The top number counts the pieces.</p>' +
'<div class="lab"><span class="lt">Try it: count the pieces</span>' +
'<div class="ctrl"><label for="ucd">Piece size<select id="ucd"><option value="2">halves</option><option value="3">thirds</option><option value="4" selected>fourths</option><option value="5">fifths</option><option value="6">sixths</option><option value="8">eighths</option><option value="10">tenths</option></select></label>' +
'<label for="ucn">Pieces: <output id="ucno"></output><input type="range" id="ucn" min="0" max="20" value="3"></label></div>' +
'<div class="fig" id="ucfig"></div><div class="fig" id="ucbars"></div><div class="out" id="ucout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>When you count as many pieces as the bottom number, you have one whole. ' + fr(4, 4) + ' = 1. ' + fr(6, 6) + ' = 1.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Count fifths: ' + fr(1, 5) + ', ' + fr(2, 5) + ', ' + fr(3, 5) + ', ' + fr(4, 5) + ', ' + fr(5, 5) + '. Five fifths make <b>1 whole</b>.</p><div class="fig">' + unitLine(5, 5) + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Same amount, different names</h2>' +
'<p>Some fractions are the same size. Cut each half into 2 pieces and you get fourths. ' + fr(1, 2) + ' is the same amount as ' + fr(2, 4) + '. These are <b>equivalent fractions</b>.</p>' +
'<div class="lab"><span class="lt">Try it: line up the bars</span>' +
'<div class="ctrl"><label for="eqf">Family<select id="eqf"><option value="2,4,8">halves, fourths, eighths</option><option value="3,6">thirds and sixths</option><option value="5,10">fifths and tenths</option></select></label>' +
'<label for="eqn">Shade: <output id="eqno"></output><input type="range" id="eqn" min="0" max="2" value="1"></label></div>' +
'<div class="fig" id="eqfig"></div><div class="out" id="eqout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking ' + fr(1, 8) + ' is bigger than ' + fr(1, 4) + ' because 8 is bigger than 4. More pieces means <b>smaller</b> pieces.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Is ' + fr(1, 3) + ' the same as ' + fr(2, 6) + '? Line up the bars. The shaded parts end at the same place, so <b>yes</b>.</p><div class="fig">' + bar(1, 3) + bar(2, 6) + '</div></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Groups of halves, thirds and fourths</h2>' +
'<p>Sometimes we have many small pieces. 2 halves make 1 whole. So 6 halves make 3 wholes. You can find the wholes by making groups.</p>' +
'<div class="lab"><span class="lt">Try it: put the pieces together</span>' +
'<div class="ctrl"><label for="gpd">Piece<select id="gpd"><option value="2" selected>one half</option><option value="3">one third</option><option value="4">one fourth</option></select></label>' +
'<label for="gpn">How many pieces: <output id="gpno"></output><input type="range" id="gpn" min="1" max="12" value="6"></label></div>' +
'<div class="fig" id="gpfig"></div><div class="out" id="gpout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Group the pieces by the bottom number. Halves in groups of 2. Thirds in groups of 3. Fourths in groups of 4.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A recipe uses ' + fr(1, 4) + ' cup of oats for each batch. How many cups for 8 batches? 8 fourths, in groups of 4, make <b>2 cups</b>.</p></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'What fraction is shaded?', fig: bar(1, 4, 300), options: [fr(1, 4), fr(1, 3), fr(4, 1)], answer: 0, why: 'Count all the equal parts for the bottom number: 4. Count the shaded parts for the top number: 1.' },
        { q: 'What fraction is shaded?', fig: pie(5, 6, 60), options: [fr(5, 6), fr(6, 5), fr(1, 6)], answer: 0, why: 'There are 6 equal parts. 5 are shaded.' },
        { q: 'Is this shape cut into fourths?', fig: A.svg(268, 70, '<rect x="4" y="4" width="40" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><rect x="44" y="4" width="100" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><rect x="144" y="4" width="60" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><rect x="204" y="4" width="60" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>', 'A bar cut into 4 parts of different sizes'), options: ['Yes', 'No'], answer: 1, why: 'There are 4 parts, but they are not equal. Fourths must be the same size.' }
      ],
      s2: [
        { q: 'Share 6 bars among 3 people. How many does each get?', options: ['2', '3', '2 and ' + fr(1, 3)], answer: 0, why: '6 shares evenly: 3 &times; 2 = 6. Nothing is left to cut.' },
        { q: 'Share 3 bars between 2 people. How much does each get?', options: ['1', '1 and ' + fr(1, 2), '2'], answer: 1, why: 'Each gets 1 whole. 1 bar is left, so cut it in half.' },
        { q: 'Share 1 pizza among 4 people. How much does each get?', options: [fr(1, 4), fr(1, 2), '4'], answer: 0, why: 'Cut the pizza into 4 equal pieces. Each person gets 1 of the 4.' }
      ],
      s3: [
        { q: fr(1, 3) + ' + ' + fr(1, 3) + ' = ?', options: [fr(2, 3), fr(2, 6), fr(1, 6)], answer: 0, why: 'Count the thirds: 1 third, 2 thirds. The size of the pieces does not change.' },
        { q: 'How many ' + fr(1, 8) + ' pieces make ' + fr(5, 8) + '?', options: ['5', '8', '13'], answer: 0, why: 'The top number counts the pieces.' },
        { q: fr(3, 3) + ' is the same as:', options: ['1', '3', '0'], answer: 0, why: '3 thirds fill the whole.' }
      ],
      s4: [
        { q: fr(1, 2) + ' = ___ eighths', options: ['2', '4', '8'], answer: 1, why: 'Each half is cut into 4 eighths.' },
        { q: 'Which is equal to ' + fr(2, 5) + '?', options: [fr(4, 10), fr(2, 10), fr(5, 10)], answer: 0, why: 'Each fifth is 2 tenths. 2 fifths are 4 tenths.' },
        { q: 'Which piece is bigger?', options: [fr(1, 3), fr(1, 6)], answer: 0, why: 'Cutting a whole into 3 pieces makes bigger pieces than cutting it into 6.' }
      ],
      s5: [
        { q: 'How many wholes are 4 halves?', options: ['2', '4', '8'], answer: 0, why: 'Make groups of 2 halves. 4 halves make 2 groups.' },
        { q: 'How many wholes are 9 thirds?', options: ['3', '6', '9'], answer: 0, why: 'Make groups of 3 thirds. 9 thirds make 3 groups.' },
        { q: '5 fourths is:', options: ['1 and ' + fr(1, 4), '5', '1'], answer: 0, why: '4 fourths make 1 whole. 1 fourth is left.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function fs() {
        var k = $('#fsk', root).value, d = +$('#fsd', root).value, sl = $('#fsn', root);
        sl.max = d; if (+sl.value > d) sl.value = d;
        var n = +sl.value;
        $('#fsno', root).textContent = n;
        $('#fsfig', root).innerHTML = shape(k, n, d);
        $('#fsout', root).innerHTML = '<p><span class="big">' + fr(n, d) + '</span> &nbsp; ' + said(n, d) + '</p><p>' + d + ' equal parts. ' + n + ' shaded. ' + (d - n) + ' not shaded, which is ' + fr(d - n, d) + '.' + (n === d ? ' All the parts are shaded: ' + fr(d, d) + ' = 1 whole.' : '') + '</p>';
      }
      A.bind(root, ['fsk', 'fsd', 'fsn'], fs);
      function fb() {
        var items = +$('#fbi', root).value, k = +$('#fbk', root).value, each = Math.floor(items / k), left = items - each * k;
        $('#fbio', root).textContent = items;
        $('#fbfig', root).innerHTML = shareFig(items, k);
        $('#fbout', root).innerHTML = '<p><span class="big">Each person gets ' + mixed(each, left, k) + ' bar' + (each + left / k > 1 ? 's' : '') + '</span></p><p>' +
          (each ? 'First, each person gets ' + each + ' whole bar' + (each > 1 ? 's' : '') + '. ' : 'There are fewer bars than people, so no one gets a whole bar. ') +
          (left ? left + ' bar' + (left > 1 ? 's are' : ' is') + ' left. Cut ' + (left > 1 ? 'each one' : 'it') + ' into ' + MANY[k] + '. Each person gets ' + said(left, k) + '.' : 'Nothing is left over.') + '</p>';
      }
      A.bind(root, ['fbi', 'fbk'], fb);
      function uc() {
        var d = +$('#ucd', root).value, sl = $('#ucn', root);
        sl.max = 2 * d; if (+sl.value > 2 * d) sl.value = 2 * d;
        var n = +sl.value, w = Math.floor(n / d), r = n % d, parts = [];
        $('#ucno', root).textContent = n;
        for (var i = 0; i < Math.min(n, 6); i++) parts.push(fr(1, d));
        $('#ucfig', root).innerHTML = unitLine(n, d);
        var bars = '';
        for (var b = 0; b < Math.max(1, Math.ceil(n / d)); b++) bars += bar(Math.min(d, Math.max(0, n - b * d)), d, 300);
        $('#ucbars', root).innerHTML = bars;
        $('#ucout', root).innerHTML = '<p><span class="big">' + (n ? (n <= 6 ? parts.join(' + ') : n + ' &times; ' + fr(1, d)) + ' = ' + fr(n, d) : '0 pieces') + '</span></p><p>' + said(n, d) + (n >= d ? ' = ' + mixed(w, r, d) + (w === 1 && !r ? ' whole' : ' wholes') : '') + '.</p>';
      }
      A.bind(root, ['ucd', 'ucn'], uc);
      function eq() {
        var fam = $('#eqf', root).value.split(',').map(Number), base = fam[0], sl = $('#eqn', root);
        sl.max = base; if (+sl.value > base) sl.value = base;
        var n = +sl.value, h = '', names = [];
        $('#eqno', root).textContent = n + ' ' + (n === 1 ? ONE[base] : MANY[base]);
        fam.forEach(function (d) { var m = n * d / base; h += '<p class="t2" style="margin:.2em 0;text-align:center">' + fr(m, d) + ' ' + said(m, d) + '</p>' + bar(m, d, 400); names.push(fr(m, d)); });
        $('#eqfig', root).innerHTML = h;
        $('#eqout', root).innerHTML = '<p><span class="big">' + names.join(' = ') + '</span></p><p>The shaded parts line up, so these fractions are equal. Each ' + ONE[base] + ' is cut into ' + fam.slice(1).map(function (d) { return d / base + ' ' + MANY[d]; }).join(' or ') + '.</p>';
      }
      A.bind(root, ['eqf', 'eqn'], eq);
      function gp() {
        var d = +$('#gpd', root).value, n = +$('#gpn', root).value, w = Math.floor(n / d), r = n % d;
        $('#gpno', root).textContent = n;
        var s = '', size = 70, x = 6;
        for (var g = 0; g < Math.ceil(n / d); g++) {
          var cnt = Math.min(d, n - g * d);
          s += pieSlice(x, cnt, d, size); x += 2 * size + 24;
        }
        function pieSlice(x0, c, dd, r0) {
          var cx = x0 + r0, cy = r0 + 6, t = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r0 + '" style="fill:none;stroke:var(--line)" stroke-width="2" stroke-dasharray="5 4"/>';
          for (var i = 0; i < c; i++) {
            var a0 = -Math.PI / 2 + i * 2 * Math.PI / dd, a1 = a0 + 2 * Math.PI / dd;
            t += '<path d="M' + cx + ' ' + cy + ' L' + (cx + r0 * Math.cos(a0)).toFixed(1) + ' ' + (cy + r0 * Math.sin(a0)).toFixed(1) + ' A' + r0 + ' ' + r0 + ' 0 0 1 ' + (cx + r0 * Math.cos(a1)).toFixed(1) + ' ' + (cy + r0 * Math.sin(a1)).toFixed(1) + ' Z" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/>';
          }
          return t;
        }
        var W = Math.max(200, x);
        $('#gpfig', root).innerHTML = A.svg(W, 2 * size + 12, s, n + ' ' + MANY[d] + ' grouped into wholes');
        $('#gpout', root).innerHTML = '<p><span class="big">' + n + ' ' + (n === 1 ? ONE[d] : MANY[d]) + ' = ' + mixed(w, r, d) + '</span></p><p>' + (w ? w + ' full group' + (w > 1 ? 's' : '') + ' of ' + d + ' make ' + w + ' whole' + (w > 1 ? 's' : '') + '. ' : 'There are not enough pieces for a whole yet. ') + (r ? said(r, d) + ' left over.' : '') + '</p>';
      }
      A.bind(root, ['gpd', 'gpn'], gp);
    },

    quiz: [
      { q: 'What fraction of the circle is shaded?', type: 'mc', options: [fr(3, 8), fr(5, 8), fr(3, 5), fr(8, 3)], answer: 0, fig: pie(3, 8, 70),
        hint: 'Count all the equal parts. Then count the shaded parts.', explain: '3 of the 8 equal parts are shaded: ' + fr(3, 8) + '.' },
      { q: 'Share 7 sandwiches equally among 2 people. How much does each person get?', type: 'mc', options: ['3', '3 and ' + fr(1, 2), '4', '3 and ' + fr(1, 7)], answer: 1, fig: shareFig(7, 2),
        hint: 'Hand out whole sandwiches first. Cut the leftover one.', explain: 'Each gets 3 whole. The last one is cut in half: 3 and ' + fr(1, 2) + '.' },
      { q: 'Which is the same as ' + fr(1, 6) + ' + ' + fr(1, 6) + ' + ' + fr(1, 6) + ' + ' + fr(1, 6) + '?', type: 'mc', options: [fr(4, 6), fr(4, 24), fr(1, 24), fr(6, 4)], answer: 0,
        hint: 'Count the sixths.', explain: '4 pieces of one sixth make ' + fr(4, 6) + '.' },
      { q: fr(3, 4) + ' = ___ eighths. What number goes in the blank?', type: 'num', answer: 6, fig: bar(3, 4, 400, '3 of 4 parts shaded') + bar(0, 8, 400, 'A bar cut into 8 parts'),
        hint: 'Each fourth is 2 eighths.', explain: '3 fourths = 6 eighths.' },
      { q: 'Which piece is the smallest?', type: 'mc', options: [fr(1, 2), fr(1, 5), fr(1, 10), fr(1, 3)], answer: 2,
        hint: 'The more pieces a whole is cut into, the smaller each one is.', explain: fr(1, 10) + ' is a whole cut into 10 pieces, the most, so it is the smallest.' },
      { q: 'A muffin recipe uses ' + fr(1, 3) + ' cup of milk. How many cups of milk do 6 batches use?', type: 'num', answer: 2,
        hint: 'Make groups of 3 thirds.', explain: '6 thirds make 2 groups of 3 thirds, so 2 cups.' },
      { q: 'Share 4 pizzas among 3 friends. How much does each friend get?', type: 'mc', options: ['1 and ' + fr(1, 3), '1 and ' + fr(1, 4), fr(3, 4), '1'], answer: 0,
        hint: 'Each friend gets 1 whole pizza first. How many are left, and how many people share them?', explain: 'Each gets 1 whole. 1 pizza is left, cut into thirds: 1 and ' + fr(1, 3) + '.' }
    ],

    practice: [
      { id: 'fr-name', name: 'Name the fraction', code: 'B1.6', gen: function (lv) {
        var d = lv === 1 ? R.pick([2, 4]) : R.pick([2, 3, 4, 5, 6, 8, 10]), n = R.int(1, d - 1), kind = R.pick(['bar', 'pie', 'grid']), not = lv === 3;
        var ans = not ? d - n : n;
        var o = R.mc(fr(ans, d), [fr(d - ans === ans ? ans + 1 : d - ans, d), fr(d, ans), fr(ans, d + 1), fr(ans, n + (d - n) + 2)]);
        return { q: 'What fraction is ' + (not ? '<b>not</b> shaded' : 'shaded') + '?', type: 'mc', options: o.options, answer: o.answer, fig: shape(kind, n, d, n + ' of ' + d + ' equal parts shaded'),
          hint: 'The bottom number is how many equal parts in all. The top number is how many parts ' + (not ? 'are not shaded' : 'are shaded') + '.',
          steps: ['Count all the equal parts: ' + d + '. That is the bottom number.', 'Count the parts that are ' + (not ? 'not shaded' : 'shaded') + ': ' + ans + '. That is the top number.', 'The fraction is ' + fr(ans, d) + ', ' + said(ans, d) + '.'],
          explain: fr(ans, d) + ' is ' + (not ? 'not shaded' : 'shaded') + '.' };
      } },
      { id: 'fr-share', name: 'Fair shares', code: 'B1.6', gen: function (lv) {
        var k = lv === 1 ? 2 : lv === 2 ? R.pick([3, 4]) : R.pick([3, 4, 5, 6, 8, 10]), items;
        do { items = R.int(1, lv === 1 ? 9 : 20); } while (items % k === 0);
        var w = Math.floor(items / k), l = items - w * k;
        var right = mixed(w, l, k), seen = {}, wrong = [];
        seen[(w + l / k).toFixed(6)] = 1;
        [[w + 1, 0, k], [w, l, k === 10 ? 8 : k === 8 ? 10 : k + 1], [w, 0, k], [w + 1, l, k], [w, 1, k === 2 ? 3 : 2]].forEach(function (c) {
          var v = (c[0] + c[1] / c[2]).toFixed(6);
          if (!seen[v] && (c[0] || c[1]) && c[1] < c[2]) { seen[v] = 1; wrong.push(mixed(c[0], c[1], c[2])); }
        });
        var o = R.mc(right, wrong);
        return { q: 'Share ' + items + ' granola bars equally among ' + k + ' people. How much does each person get?', type: 'mc', options: o.options, answer: o.answer,
          fig: lv < 3 ? '' : '',
          hint: 'Hand out whole bars first. Then cut each leftover bar into ' + MANY[k] + '.',
          steps: [k + ' &times; ' + w + ' = ' + w * k + ', so each person gets ' + w + ' whole bar' + (w === 1 ? '' : 's') + '.', items + ' &minus; ' + w * k + ' = ' + l + ' bar' + (l > 1 ? 's' : '') + ' left. Cut ' + (l > 1 ? 'each' : 'it') + ' into ' + MANY[k] + '.', 'Each person gets ' + said(l, k) + ' more, so ' + right + '.<div class="fig">' + shareFig(items, k) + '</div>'],
          explain: 'Each person gets ' + right + '.' };
      } },
      { id: 'fr-unit', name: 'Count unit fractions', code: 'B2.8', gen: function (lv) {
        var d = R.pick([2, 3, 4, 5, 6, 8, 10]), n = lv === 3 ? R.int(d + 1, 2 * d - 1) : R.int(2, d);
        if (lv === 1) {
          var parts = []; for (var i = 0; i < n; i++) parts.push(fr(1, d));
          var o = R.mc(fr(n, d), [fr(n, d * n), fr(1, d * n), fr(d, n)].filter(function (x) { return x !== fr(n, d); }));
          return { q: parts.join(' + ') + ' = ?', type: 'mc', options: o.options, answer: o.answer, fig: unitLine(n, d),
            hint: 'Count the pieces. They are all ' + MANY[d] + '.', steps: ['Every piece is one ' + ONE[d] + '.', 'There are ' + n + ' pieces.', n + ' ' + MANY[d] + ' is ' + fr(n, d) + '.'], explain: 'The answer is ' + fr(n, d) + '.' };
        }
        if (lv === 2) return { q: 'How many ' + fr(1, d) + ' pieces make ' + fr(n, d) + '?', type: 'num', answer: n,
          hint: 'The top number counts the pieces.', steps: ['The bottom number, ' + d + ', tells the size: ' + MANY[d] + '.', 'The top number, ' + n + ', counts them.', 'So ' + n + ' pieces.'], explain: fr(n, d) + ' is ' + n + ' pieces of ' + fr(1, d) + '.' };
        return { q: fr(n, d) + ' = 1 and how many ' + MANY[d] + '?', type: 'num', answer: n - d, fig: unitLine(n, d),
          hint: d + ' ' + MANY[d] + ' make 1 whole. How many are left?', steps: ['Take ' + d + ' ' + MANY[d] + ' to make 1 whole.', n + ' &minus; ' + d + ' = ' + (n - d) + '.', fr(n, d) + ' = 1 and ' + fr(n - d, d) + '.'], explain: fr(n, d) + ' = 1 and ' + fr(n - d, d) + '.' };
      } },
      { id: 'fr-equiv', name: 'Equivalent fractions', code: 'B1.7', gen: function (lv) {
        var pairs = lv === 1 ? [[2, 4], [2, 8], [4, 8]] : [[2, 4], [2, 8], [4, 8], [3, 6], [5, 10]];
        var pr = R.pick(pairs), a = pr[0], b = pr[1], n = R.int(1, a - 1), m = n * b / a;
        if (lv < 3) return { q: fr(n, a) + ' = ___ ' + MANY[b] + '. What number goes in the blank?', type: 'num', answer: m,
          fig: lv === 1 ? bar(n, a, 400) + bar(m, b, 400) : '',
          hint: 'Each ' + ONE[a] + ' is ' + b / a + ' ' + MANY[b] + '.',
          steps: ['1 ' + ONE[a] + ' = ' + b / a + ' ' + MANY[b] + '.', n + ' ' + (n === 1 ? ONE[a] : MANY[a]) + ' = ' + n + ' &times; ' + b / a + ' ' + MANY[b] + '.', 'That is ' + m + ' ' + MANY[b] + '.<div class="fig">' + bar(n, a, 400) + bar(m, b, 400) + '</div>'],
          explain: fr(n, a) + ' = ' + fr(m, b) + '.' };
        var wrong = [fr(n, b), fr(m + 1, b), fr(m, b * 2 > 10 ? b - 1 : b * 2)].filter(function (x) { return x !== fr(m, b); });
        var o = R.mc(fr(m, b), wrong);
        return { q: 'Which fraction is equal to ' + fr(n, a) + '?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Picture the bars. Cut each ' + ONE[a] + ' into equal smaller pieces.',
          steps: ['Each ' + ONE[a] + ' can be cut into ' + b / a + ' ' + MANY[b] + '.', n + ' ' + (n === 1 ? ONE[a] : MANY[a]) + ' become ' + m + ' ' + MANY[b] + '.', 'So ' + fr(n, a) + ' = ' + fr(m, b) + '.<div class="fig">' + bar(n, a, 400) + bar(m, b, 400) + '</div>'],
          explain: fr(n, a) + ' = ' + fr(m, b) + '.' };
      } },
      { id: 'fr-groups', name: 'Groups of halves, thirds and fourths', code: 'B2.7', gen: function (lv) {
        var d = lv === 1 ? 2 : R.pick([2, 3, 4]), w = R.int(1, lv === 3 ? 4 : 5), n = w * d;
        if (lv === 3) {
          var thing = R.pick([['A recipe uses', 'cup of flour', 'batches', 'cups of flour'], ['Each lap is', 'kilometre', 'laps', 'kilometres'], ['Each glass holds', 'litre', 'glasses', 'litres']]);
          return { q: thing[0] + ' ' + fr(1, d) + ' ' + thing[1] + '. How many ' + thing[3] + ' for ' + n + ' ' + thing[2] + '?', type: 'num', answer: w,
            hint: 'You have ' + n + ' ' + MANY[d] + '. Make groups of ' + d + '.',
            steps: [n + ' ' + thing[2] + ' means ' + n + ' ' + MANY[d] + '.', d + ' ' + MANY[d] + ' make 1 whole.', n + ' &divide; ' + d + ' = ' + w + '.'],
            explain: n + ' ' + MANY[d] + ' = ' + w + ' wholes.' };
        }
        return { q: 'How many wholes are ' + n + ' ' + MANY[d] + '?', type: 'num', answer: w,
          hint: 'Put the ' + MANY[d] + ' in groups of ' + d + '. Each group is 1 whole.',
          steps: [d + ' ' + MANY[d] + ' make 1 whole.', 'Count by ' + d + 's to ' + n + ': that is ' + w + ' groups.', n + ' ' + MANY[d] + ' = ' + w + ' wholes.'],
          explain: n + ' ' + MANY[d] + ' = ' + w + ' whole' + (w > 1 ? 's' : '') + '.' };
      } }
    ]
  });
})();
