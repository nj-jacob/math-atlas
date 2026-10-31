(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var SH = { A: 'circle', B: 'square', C: 'triangle', D: 'star' }, ACT = { A: 'clap', B: 'snap', C: 'stomp', D: 'tap' };
  function glyph(k, x, y, r) {
    if (k === 'A') return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:var(--sb);stroke:var(--ink)" stroke-width="2"/>';
    if (k === 'B') return '<rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + 2 * r + '" height="' + 2 * r + '" rx="3" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    if (k === 'C') return '<polygon points="' + x + ',' + (y - r) + ' ' + (x + r) + ',' + (y + r * 0.85) + ' ' + (x - r) + ',' + (y + r * 0.85) + '" style="fill:var(--sf);stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
    var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push((x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1)); }
    return '<polygon points="' + p.join(' ') + '" style="fill:var(--sd);stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
  }
  /* a row of shapes. core: string like "ABB"; n items; mark: index for a question mark; boxes: outline each core */
  function row(core, n, mark, boxes, label) {
    var per = Math.min(n, 8), gap = 52, s = '', rows = Math.ceil(n / per);
    for (var i = 0; i < n; i++) {
      var x = 30 + (i % per) * gap, y = 34 + Math.floor(i / per) * 74;
      if (i === mark) s += '<rect x="' + (x - 22) + '" y="' + (y - 22) + '" width="44" height="44" rx="8" style="fill:color-mix(in srgb,var(--hi) 30%,var(--card));stroke:var(--ink)" stroke-width="2" stroke-dasharray="5 4"/><text x="' + x + '" y="' + (y + 9) + '" text-anchor="middle" font-size="26" font-weight="800">?</text>';
      else s += glyph(core.charAt(i % core.length), x, y, 18);
      s += '<text x="' + x + '" y="' + (y + 40) + '" text-anchor="middle" font-size="14" class="t2">' + (i + 1) + '</text>';
    }
    if (boxes) for (var c = 0; c * core.length < n; c++) {
      var st = c * core.length, en = Math.min(n, st + core.length) - 1;
      if (Math.floor(st / per) !== Math.floor(en / per)) continue;
      var x0 = 30 + (st % per) * gap - 25, x1 = 30 + (en % per) * gap + 25, yy = 34 + Math.floor(st / per) * 74;
      s += '<rect x="' + x0 + '" y="' + (yy - 26) + '" width="' + (x1 - x0) + '" height="52" rx="10" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/>';
    }
    var lab = label || 'Pattern: ' + Array.apply(null, Array(n)).map(function (_, i) { return i === mark ? 'missing' : SH[core.charAt(i % core.length)]; }).join(', ');
    return A.svg(per * gap + 12, rows * 74 + 4, s, lab);
  }
  /* towers of dots for a growing pattern */
  function towers(vals) {
    var max = Math.max.apply(null, vals), u = Math.min(14, 190 / Math.max(1, max)), w = Math.min(60, 520 / vals.length), s = '';
    vals.forEach(function (v, i) {
      var x = 20 + i * w;
      for (var k = 0; k < v; k++) s += '<rect x="' + (x + 6) + '" y="' + (200 - (k + 1) * u) + '" width="' + (w - 12) + '" height="' + (u - 1.5) + '" rx="2" style="fill:' + (k < vals[0] ? 'var(--strand)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="' + (u > 6 ? 1 : 0) + '"/>';
      s += '<text x="' + (x + w / 2) + '" y="222" text-anchor="middle" font-size="18" class="tb">' + v + '</text>';
    });
    return A.svg(Math.max(200, 30 + vals.length * w), 230, s, 'Growing pattern: ' + vals.join(', '));
  }
  /* a 10 by 10 grid with the robot's path */
  function robot(prog, label) {
    var sz = 40, s = '', x = 1, y = 8, dir = 0, path = [[x, y]], DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0], off = false, steps = 0;
    prog.forEach(function (c) {
      if (c[0] === 'move') for (var i = 0; i < c[1]; i++) { x += DX[dir]; y += DY[dir]; steps++; if (x < 0 || x > 9 || y < 0 || y > 9) off = true; path.push([x, y]); }
      else dir = (dir + (c[0] === 'right' ? 1 : 3)) % 4;
    });
    for (var i = 0; i <= 10; i++) s += '<line x1="' + (4 + i * sz) + '" y1="4" x2="' + (4 + i * sz) + '" y2="' + (4 + 10 * sz) + '" style="stroke:var(--line)" stroke-width="1.5"/><line x1="4" y1="' + (4 + i * sz) + '" x2="' + (4 + 10 * sz) + '" y2="' + (4 + i * sz) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    var C = function (v) { return 4 + v * sz + sz / 2; };
    s += '<polyline points="' + path.map(function (p) { return C(Math.max(-0.4, Math.min(9.4, p[0]))) + ',' + C(Math.max(-0.4, Math.min(9.4, p[1]))); }).join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
    s += '<circle cx="' + C(1) + '" cy="' + C(8) + '" r="9" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>';
    var ex = C(Math.max(0, Math.min(9, x))), ey = C(Math.max(0, Math.min(9, y))), rot = dir * 90;
    s += '<g transform="translate(' + ex + ' ' + ey + ') rotate(' + rot + ')"><polygon points="0,-16 13,12 0,5 -13,12" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/></g>';
    return { svg: A.svg(10 * sz + 8, 10 * sz + 8, s, label || 'Robot path on a grid'), steps: steps, off: off, x: x, y: y };
  }
  function evalE(a, op, b) { return op === '+' ? a + b : op === '-' ? a - b : op === 'x' ? a * b : b ? a / b : NaN; }
  function showOp(op) { return op === '+' ? '+' : op === '-' ? '&minus;' : op === 'x' ? '&times;' : '&divide;'; }

  /* ---------- Lessons: one idea per screen ---------- */
  var CH = 'patterns';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function cap(t) { return t ? '<p class="g3-sym" style="font-size:1.1rem;color:var(--ink)">' + t + '</p>' : ''; }
  function ruleText(op, k) { return op === 'x' ? k + ' &times; n' : 'n ' + showOp(op) + ' ' + k; }
  function ruleOut(op, k, v) { return op === '+' ? v + k : op === '-' ? v - k : v * k; }
  /* number machine: n goes in, the rule works, the answer comes out */
  function machine(op, k, n, hide) {
    var txt = ruleText(op, k), out = hide ? '?' : ruleOut(op, k, n);
    var s = '<rect x="10" y="40" width="90" height="60" rx="10" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><text x="55" y="80" text-anchor="middle" font-size="28" class="tb">' + n + '</text><text x="55" y="28" text-anchor="middle" font-size="16" class="t2">in: n</text>' +
      '<path d="M104 70 H170" style="stroke:var(--ink)" stroke-width="3"/><polygon points="170,62 184,70 170,78" style="fill:var(--ink)"/>' +
      '<rect x="190" y="22" width="180" height="96" rx="16" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="3"/><text x="280" y="80" text-anchor="middle" font-size="28" class="tb">' + txt.replace('&times;', '×').replace('&minus;', '−') + '</text>' +
      '<path d="M374 70 H440" style="stroke:var(--ink)" stroke-width="3"/><polygon points="440,62 454,70 440,78" style="fill:var(--ink)"/>' +
      '<rect x="460" y="40" width="90" height="60" rx="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5"/><text x="505" y="80" text-anchor="middle" font-size="28" font-weight="800" style="fill:#13203a">' + out + '</text><text x="505" y="28" text-anchor="middle" font-size="16" class="t2">out</text>';
    return A.svg(560, 130, s, 'Number machine: put in ' + n + ', rule ' + txt.replace('&times;', 'times').replace('&minus;', 'minus') + ', get out ' + out);
  }
  function machineTable(op, k, upto) {
    var ins = [3, 4, 5, 6, 7, 8, 9, 10].slice(0, upto || 8);
    return '<div class="tbl"><table><tbody><tr><th class="l">n</th>' + ins.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr><tr><th class="l">' + ruleText(op, k) + '</th>' + ins.map(function (v) { return '<td>' + ruleOut(op, k, v) + '</td>'; }).join('') + '</tr></tbody></table></div>';
  }
  /* a pan balance: tips toward the heavier side, level when equal */
  function balance(lt, lv, rt, rv, show) {
    var tilt = lv === rv ? 0 : lv > rv ? -8 : 8, s = '';
    s += '<polygon points="280,200 254,240 306,240" style="fill:var(--line);stroke:var(--ink)" stroke-width="2"/>';
    s += '<g transform="rotate(' + (-tilt) + ' 280 200)"><line x1="90" y1="200" x2="470" y2="200" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>' +
      '<rect x="30" y="140" width="130" height="56" rx="10" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--strand)" stroke-width="2.5"/><text x="95" y="177" text-anchor="middle" font-size="24" class="tb">' + lt + '</text>' +
      '<rect x="400" y="140" width="130" height="56" rx="10" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--strand)" stroke-width="2.5"/><text x="465" y="177" text-anchor="middle" font-size="24" class="tb">' + rt + '</text>' +
      (show ? '<text x="95" y="128" text-anchor="middle" font-size="20" class="t2">= ' + lv + '</text><text x="465" y="128" text-anchor="middle" font-size="20" class="t2">= ' + rv + '</text>' : '') + '</g>';
    if (show) s += '<text x="280" y="60" text-anchor="middle" font-size="34" font-weight="800" style="fill:' + (lv === rv ? 'var(--good)' : 'var(--bad)') + '">' + (lv === rv ? '=' : '≠') + '</text>';
    return A.svg(560, 250, s, lt.replace(/×/g, 'times') + (show ? (lv === rv ? ' equals ' : ' does not equal ') : ' and ') + rt.replace(/×/g, 'times'));
  }
  function balView(s) { return '<div>' + balance(s.lt, s.lv, s.rt, s.rv, s.show) + cap(s.say) + '</div>'; }
  var STAR = [4, 5];
  function withStar(svg) { var cx = 4 + STAR[0] * 40 + 20, cy = 4 + STAR[1] * 40 + 20, p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 7 : 16; p.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); } return svg.replace('</svg>', '<polygon points="' + p.join(' ') + '" style="fill:var(--sd);stroke:var(--ink)" stroke-width="2" opacity=".9"/></svg>'); }
  function progText(prog) { return prog.length ? prog.map(function (c) { return c[0] === 'move' ? 'move ' + c[1] : 'turn ' + c[0]; }).join(', ') : '(no code yet)'; }
  function loopProg(r, m, t) { var p = []; for (var i = 0; i < r; i++) { p.push(['move', m]); p.push([t || 'right']); } return p; }
  /* two things happening at the same time: robot steps and music on a timeline */
  function concView(s) {
    var acts = ['move 2', 'turn right', 'move 2', 'turn right'], w = 110, sv = '';
    sv += '<text x="6" y="44" font-size="17" class="tb">Robot</text><text x="6" y="110" font-size="17" class="tb">Music</text>';
    acts.forEach(function (a, i) { var on = i < s.t; sv += '<rect x="' + (80 + i * w) + '" y="20" width="' + (w - 8) + '" height="40" rx="8" style="fill:' + (on ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--strand)" stroke-width="2"/><text x="' + (80 + i * w + (w - 8) / 2) + '" y="46" text-anchor="middle" font-size="16"' + (on ? ' style="fill:#fff" font-weight="700"' : ' class="t2"') + '>' + a + '</text>'; });
    if (s.music && s.t) sv += '<rect x="80" y="86" width="' + (Math.max(0, s.t) * w - 8) + '" height="40" rx="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>' + (s.t ? '<text x="' + (80 + s.t * w / 2) + '" y="112" text-anchor="middle" font-size="16" class="tb">&#9835; playing</text>' : '');
    sv += '<line x1="' + (80 + s.t * w - 4) + '" y1="10" x2="' + (80 + s.t * w - 4) + '" y2="136" style="stroke:var(--bad)" stroke-width="3"/>';
    return '<div>' + A.svg(80 + 4 * w + 10, 142, sv, 'A timeline: the robot moves while music plays') + cap(s.say) + '</div>';
  }

  var LESSONS = [
    { id: 'repeat', title: 'Repeating patterns', sub: 'Find the part that repeats.', concepts: [
      { id: 'core', title: 'Find the core', exp: ['C1.1', 'C1.3'], skill: 'pt-repeat',
        body: '<p>A <b>repeating pattern</b> has a part that repeats over and over. That part is the <b>core</b>. Find the core and you know what comes next.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + row('ABB', s.n, -1, s.box) + cap(s.say) + '</div>'; }, { n: 3, box: false, say: '' }), steps: [
          { say: 'Circle, square, square.', ms: 1300 },
          { say: 'Then it starts again.', act: function (t) { return t.seq([{ n: 4 }, { n: 5 }, { n: 6 }, { n: 7 }, { n: 8 }, { n: 9 }], 420); } },
          { say: 'Box each part that repeats. The core is <b>circle, square, square</b>.', act: function (t) { return t.set({ box: true, say: 'Core: circle, square, square' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { core: 'AB', n: 6, box: false }, draw: function (s) { return row(s.core, s.n, -1, s.box); },
          selects: [{ key: 'core', label: 'Core', options: [['AB', 'circle, square'], ['ABB', 'circle, square, square'], ['AAB', 'circle, circle, square'], ['ABC', 'circle, square, triangle'], ['ABCD', 'circle, square, triangle, star']] }],
          buttons: [{ label: 'Add one more', act: function (s) { if (s.n < 16) s.n++; } }, { label: 'Show the cores', act: function (s) { s.box = !s.box; } }],
          info: function (s) { return 'Next comes a <b>' + SH[s.core.charAt(s.n % s.core.length)] + '</b>.'; },
          tasks: [{ do: 'Make the pattern <b>circle, square, triangle</b>, and show its cores.', goal: function (s) { return s.core === 'ABC' && s.box; }, yes: 'The core has 3 shapes.' }] }), do: '' },
        key: '<p>The core is <b>the part that repeats</b>.</p>',
        check: [TU('s1', 0), TU('s1', 1), SK('pt-repeat', 1)] },

      { id: 'forms', title: 'Same pattern, new look', exp: ['C1.2'], skill: 'pt-repeat',
        body: '<p>The same pattern can be shown in different ways. Circle, square, square is the same as <b>A, B, B</b>, and the same as <b>clap, snap, snap</b>.</p>',
        watch: { mount: G3.view(function (s) { var core = 'ABB', n = 6, list = []; for (var i = 0; i < n; i++) list.push(s.form === 'L' ? core.charAt(i % 3) : ACT[core.charAt(i % 3)]); return '<div>' + row(core, n, -1, true) + (s.form ? '<p class="g3-sym" style="font-size:1.3rem;color:var(--ink)">' + list.join(', ') + '</p>' : '') + cap(s.say) + '</div>'; }, { form: '', say: '' }), steps: [
          { say: 'Circle, square, square.', ms: 1300 },
          { say: 'As letters: A, B, B.', act: function (t) { return t.set({ form: 'L' }, 1600); } },
          { say: 'As actions: clap, snap, snap. <b>Same pattern.</b>', act: function (t) { return t.set({ form: 'A' }, 2000); } }
        ] },
        key: '<p>Same core, <b>same pattern</b>, even if it looks different.</p>',
        mistake: '<p>Matching the shapes instead of the structure. A, A, B is not the same as A, B, B. Say the core out loud with letters.</p>',
        check: [TU('s1', 2), SK('pt-repeat', 2)] },

      { id: 'ahead', title: 'Predict far ahead', exp: ['C1.3'], skill: 'pt-repeat', hard: true,
        body: '<p>To find a shape far ahead, count by the <b>length of the core</b>. With a core of 3, positions 3, 6, 9 end a core. Position 10 starts a new one.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + row('ABC', s.n, s.mark, true) + cap(s.say) + '</div>'; }, { n: 9, mark: -1, say: 'What is at position 10?' }), steps: [
          { say: 'The core is circle, square, triangle. 3 shapes.', ms: 1500 },
          { say: 'Count by 3s: positions 3, 6, 9 end a core.', act: function (t) { return t.set({ say: '3, 6, 9' }, 1600); } },
          { say: 'Position 10 starts a new core, so it is a <b>circle</b>.', act: function (t) { return t.set({ n: 10, say: 'Position 10: circle' }, 2000); } }
        ] },
        ways: [
          { label: 'Use a table', html: '<div class="tbl"><table><tbody><tr><th class="l">circle</th><td>1</td><td>4</td><td>7</td><td style="background:color-mix(in srgb,var(--hi) 45%,var(--card))">10</td></tr><tr><th class="l">square</th><td>2</td><td>5</td><td>8</td><td>11</td></tr><tr><th class="l">triangle</th><td>3</td><td>6</td><td>9</td><td>12</td></tr></tbody></table></div><p>Each row counts by 3. Find 10: it is in the circle row.</p>' },
          { label: 'Keep going', html: '<p>Draw or say the pattern until you reach the position. It is slower, but it always works.</p><div class="fig">' + row('ABC', 10, -1, true) + '</div>' }
        ],
        try: { mount: G3.play({ state: { core: 'ABB', p: 5 }, draw: function (s) { var L = s.core.length, n = Math.min(16, Math.max(L * 2, Math.ceil(Math.min(s.p, 16) / L) * L)); return row(s.core, n, -1, true); },
          sliders: [{ key: 'p', label: 'Position', min: 1, max: 40 }],
          info: function (s) { return 'Position ' + s.p + ': <b>' + SH[s.core.charAt((s.p - 1) % 3)] + '</b>. ' + (Math.floor((s.p - 1) / 3) ? Math.floor((s.p - 1) / 3) + ' full cores come before it.' : ''); },
          tasks: [{ do: 'The core is circle, square, square. Find a position past 20 that is a <b>circle</b>.', goal: function (s) { return s.p > 20 && (s.p - 1) % 3 === 0; }, yes: function (s) { return 'Position ' + s.p + ' is a circle: one more than a multiple of 3.'; } }] }), do: '' },
        key: '<p>Count on <b>by the core length</b>.</p>',
        mistake: '<p>Counting single shapes and losing track. Have the child count whole cores first ("3, 6, 9"), then the last few.</p>',
        check: [SK('pt-repeat', 3), SK('pt-repeat', 3)] }
    ] },

    { id: 'grow', title: 'Patterns that grow', sub: 'Repeat an operation each time.', concepts: [
      { id: 'rule', title: 'Use a pattern rule', exp: ['C1.1', 'C1.3'], skill: 'pt-grow',
        body: '<p>A <b>pattern rule</b> tells where to start and what to do each time. Start at 2, add 3: <b>2, 5, 8, 11, 14</b>.</p>',
        watch: { mount: G3.view(function (s) { var v = []; for (var i = 0; i < s.n; i++) v.push(2 + 3 * i); return '<div>' + towers(v) + cap(v.join(', ')) + '</div>'; }, { n: 1 }), steps: [
          { say: 'Start at 2.', ms: 1200 },
          { say: 'Add 3 each time.', act: function (t) { return t.seq([{ n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }], 800); } },
          { say: 'The rule <b>start at 2, add 3</b> gives 2, 5, 8, 11, 14.', ms: 2000 }
        ] },
        try: { mount: G3.play({ state: { st: 1, b: 2, sg: 1 }, draw: function (s) { var v = []; for (var i = 0; i < 6; i++) { var x = s.st + s.sg * s.b * i; if (x < 0) break; v.push(x); } return towers(v) + '<p class="g3-sym" style="font-size:1.2rem;color:var(--ink)">' + v.join(', ') + '</p>'; },
          sliders: [{ key: 'st', label: 'Start at', min: 0, max: 40 }, { key: 'b', label: 'This much', min: 1, max: 10 }],
          selects: [{ key: 'sg', label: 'Each time', options: [[1, 'add'], [-1, 'take away']] }],
          tasks: [{ do: 'Make the pattern <b>5, 10, 15, 20</b>.', goal: function (s) { return s.st === 5 && s.b === 5 && s.sg === 1; }, yes: 'Start at 5, add 5.' },
            { do: 'Make <b>30, 26, 22, 18</b>.', goal: function (s) { return s.st === 30 && s.b === 4 && s.sg === -1; }, yes: 'Start at 30, take away 4.' }] }), do: '' },
        key: '<p>Rule: <b>start at ___, add (or take away) ___ each time</b>.</p>',
        check: [TU('s2', 0), TU('s2', 2), SK('pt-grow', 1)] },

      { id: 'find', title: 'Find the rule', exp: ['C1.3', 'C1.4'], skill: 'pt-grow', hard: true,
        body: '<p>To find a rule, look at <b>how much each number changes</b>. 40, 35, 30, 25: each is 5 less. Start at 40, take away 5.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 50, tick: 1, every: 5, start: 40, marks: [{ v: 40, t: '40' }, { v: 35, t: '35' }, { v: 30, t: '30' }, { v: 25, t: '25' }] }, steps: [
          { say: '40, 35, 30, 25. How does it change?', ms: 1500 },
          { say: 'Each jump goes back 5.', act: function (t) { return t.jumps(-5, 3, 350); } },
          { say: 'Rule: <b>start at 40, take away 5</b>. Next is 20.', act: function (t) { return t.jumps(-5, 1).then(function () { return t.mark(20, '20'); }); }, ms: 1800 }
        ] },
        ways: [
          { label: 'Hundreds patterns', html: '<p>125, 225, 325, 425. Only the hundreds digit changes. Rule: start at 125, <b>add 100</b>.</p>' },
          { label: 'Write the change', html: '<p class="math">40 &rarr; 35 &rarr; 30 &rarr; 25</p><p class="math">&minus;5 &nbsp; &minus;5 &nbsp; &minus;5</p><p>The same change every time is the rule.</p>' }
        ],
        try: { tool: 'numberline', opts: { min: 100, max: 1000, tick: 50, every: 100, start: 150, step: [50, 100] }, tasks: [
          { do: 'The rule is start at 150, <b>add 100</b>. Jump to the 4th number.', goal: function (s) { return s.at === 450; }, yes: '150, 250, 350, 450.' }
        ] },
        key: '<p>Find <b>the same change</b> each time.</p>',
        mistake: '<p>Looking at only the first two numbers. Check the change between every pair.</p>',
        check: [TU('s2', 1), SK('pt-grow', 2), SK('pt-grow', 3)] }
    ] },

    { id: 'vars', title: 'Variables', sub: 'A letter that stands for a number.', concepts: [
      { id: 'letter', title: 'A letter for a number', exp: ['C2.1'], skill: 'pt-var',
        body: '<p>A <b>variable</b> is a letter or a box that stands for a number. In <span class="math">n + 4 = 10</span>, n is 6, because 6 + 4 = 10.</p>',
        watch: { mount: G3.view(balView, { lt: 'n + 4', lv: 0, rt: '10', rv: 10, show: false, say: 'n + 4 = 10' }), steps: [
          { say: 'n + 4 = 10. What number is n?', ms: 1500 },
          { say: 'Think: what plus 4 makes 10? Count up from 4 to 10: 6.', act: function (t) { return t.set({ say: '4 + 6 = 10' }, 1800); } },
          { say: 'Put 6 in place of n. Both sides are 10. <b>n = 6</b>.', act: function (t) { return t.set({ lt: '6 + 4', lv: 10, show: true, say: 'n = 6' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { n: 3 }, draw: function (s) { return balance(s.n + ' + 8', s.n + 8, '15', 15, true); },
          sliders: [{ key: 'n', label: 'Try n =', min: 0, max: 15 }],
          info: function (s) { return s.n + 8 === 15 ? '<b>n = 7</b>. Both sides are 15.' : s.n + ' + 8 = ' + (s.n + 8) + (s.n + 8 > 15 ? ', too much.' : ', not enough.'); },
          tasks: [{ do: 'Find n: <span class="math">n + 8 = 15</span>. Balance the scale.', goal: function (s) { return s.n === 7; }, yes: 'n = 7, because 7 + 8 = 15.' }] }), do: '' },
        key: '<p>A letter <b>stands for a number</b>. Find the number that makes it true.</p>',
        mistake: '<p>Thinking a letter is always the same number. In one question n might be 6. In the next question, n can be a different number.</p>',
        check: [TU('s3', 0), TU('s3', 2), SK('pt-var', 1)] },

      { id: 'machine', title: 'Number machines and tables', exp: ['C2.1', 'C1.2'], skill: 'pt-table', hard: true,
        body: '<p>In a rule like <span class="math">n + 10</span>, n can be <b>any number</b> you put in. A table shows what comes out for each number.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + machine('x', 2, s.n, s.hide) + (s.tbl ? machineTable('x', 2, s.n - 2) : '') + cap(s.say) + '</div>'; }, { n: 3, hide: true, tbl: false, say: '' }), steps: [
          { say: 'The rule is 2 &times; n. Put in 3.', ms: 1500 },
          { say: '2 &times; 3 = 6 comes out.', act: function (t) { return t.set({ hide: false, tbl: true }, 1600); } },
          { say: 'Put in 4, 5, 6. Each answer goes in the table.', act: function (t) { return t.seq([{ n: 4 }, { n: 5 }, { n: 6 }], 1000); } },
          { say: 'The table shows the rule: <b>out = 2 &times; n</b>.', ms: 2000 }
        ] },
        ways: [
          { label: 'Find the rule from a table', html: machineTable('+', 5, 5) + '<p>Each number out is 5 more than n. The rule is <b>n + 5</b>.</p>' },
          { label: 'Fill in a box', html: '<p>A box works like a letter: <span class="math">5 &times; &#9633; = 30</span>. Count by 5s to 30: 6 jumps. The box is <b>6</b>.</p>' }
        ],
        try: { mount: G3.play({ state: { r: '+,10', n: 4 }, draw: function (s) { var r = s.r.split(','); return machine(r[0], +r[1], s.n) + machineTable(r[0], +r[1]); },
          selects: [{ key: 'r', label: 'Rule', options: [['+,5', 'n + 5'], ['+,10', 'n + 10'], ['-,3', 'n &minus; 3'], ['x,2', '2 &times; n'], ['x,5', '5 &times; n'], ['x,10', '10 &times; n']] }],
          sliders: [{ key: 'n', label: 'Put in n =', min: 3, max: 10 }],
          tasks: [{ do: 'Find a rule and an n that give out <b>50</b>.', goal: function (s) { var r = s.r.split(','); return ruleOut(r[0], +r[1], s.n) === 50; }, yes: function (s) { var r = s.r.split(','); return ruleText(r[0], +r[1]).replace('n', s.n) + ' = 50.'; } }] }), do: '' },
        key: '<p>Put the number <b>in place of n</b>, then work it out.</p>',
        mistake: '<p>Writing n and the number side by side (2n read as "twenty-something"). Always say "2 times n".</p>',
        check: [TU('s3', 1), SK('pt-table', 1), SK('pt-table', 2)] }
    ] },

    { id: 'equal', title: 'Equal or not equal', sub: 'Work out both sides, then compare.', concepts: [
      { id: 'sides', title: 'Both sides the same', exp: ['C2.2', 'C2.3'], skill: 'pt-equal',
        body: '<p>Two expressions can look different but have the same value. <span class="math">4 &times; 5</span> and <span class="math">2 &times; 10</span> are both 20, so they are <b>equal</b>.</p>',
        watch: { mount: G3.view(balView, { lt: '4 × 5', lv: 20, rt: '2 × 10', rv: 20, show: false, say: '' }), steps: [
          { say: 'Is 4 &times; 5 equal to 2 &times; 10?', ms: 1500 },
          { say: 'Work out each side: 20 and 20.', act: function (t) { return t.set({ show: true, say: '20 = 20' }, 1800); } },
          { say: 'The scale balances. <b>4 &times; 5 = 2 &times; 10</b>.', ms: 2000 }
        ] },
        try: { mount: G3.play({ state: { a: 3, b: 4 }, draw: function (s) { return balance('6 × 2', 12, s.a + ' × ' + s.b, s.a * s.b, true); },
          sliders: [{ key: 'a', label: 'Right: first number', min: 1, max: 12 }, { key: 'b', label: 'Right: second number', min: 1, max: 12 }],
          tasks: [{ do: 'Make the right side equal to <b>6 &times; 2</b>, without using 6 or 2.', goal: function (s) { return s.a * s.b === 12 && [s.a, s.b].indexOf(6) < 0 && [s.a, s.b].indexOf(2) < 0; }, yes: function (s) { return s.a + ' &times; ' + s.b + ' = 12 too.'; } }] }), do: '' },
        key: '<p>Work out <b>each side</b>. Same value? Equal.</p>',
        check: [TU('s4', 0), TU('s4', 2), SK('pt-equal', 1)] },

      { id: 'not', title: 'Not equal', exp: ['C2.2'], skill: 'pt-equal', hard: true,
        body: '<p>If the two sides have different values, they are <b>not equal</b>. We write &ne;. <span class="math">20 &divide; 2 &ne; 20 &minus; 2</span>, because 10 is not 18.</p>',
        watch: { mount: G3.view(balView, { lt: '20 ÷ 2', lv: 10, rt: '20 − 2', rv: 18, show: false, say: '' }), steps: [
          { say: '20 &divide; 2 and 20 &minus; 2 look alike. Are they equal?', ms: 1600 },
          { say: 'Left: 10. Right: 18.', act: function (t) { return t.set({ show: true, say: '10 and 18' }, 1800); } },
          { say: 'The scale tips. <b>20 &divide; 2 &ne; 20 &minus; 2</b>.', ms: 2000 }
        ] },
        ways: [
          { label: 'With counters', html: '<p>20 &divide; 2 is 20 counters in 2 groups: 10 in each. 20 &minus; 2 is 20 counters with 2 taken away: 18 left.</p>' },
          { label: 'Find the missing number', html: '<p>To make <span class="math">3 + 5 = 2 + &#9633;</span> true, the right side must also be 8. 2 + 6 = 8, so the box is <b>6</b>.</p>' }
        ],
        try: { mount: G3.play({ state: { k: 2 }, draw: function (s) { return balance('3 + 5', 8, '2 + ' + s.k, 2 + s.k, true); },
          sliders: [{ key: 'k', label: 'Box', min: 0, max: 12 }],
          tasks: [{ do: 'Make <span class="math">3 + 5 = 2 + &#9633;</span> true.', goal: function (s) { return s.k === 6; }, yes: '2 + 6 = 8, the same as 3 + 5.' }] }), do: '' },
        key: '<p>Different values: <b>&ne; (not equal)</b>.</p>',
        mistake: '<p>Deciding by how it looks (same numbers, so equal). Always work out both sides first.</p>',
        check: [TU('s4', 1), SK('pt-equal', 2), SK('pt-equal', 3)] }
    ] },

    { id: 'code', title: 'Coding', sub: 'Steps in order, loops, and things at the same time.', concepts: [
      { id: 'steps', title: 'Steps in order', exp: ['C3.1', 'C3.2'], skill: 'pt-code',
        body: '<p><b>Code</b> is a list of steps a computer follows <b>in order</b>. Steps that come one after another are <b>sequential</b>.</p>',
        watch: { mount: G3.view(function (s) { var p = [['move', 3], ['right'], ['move', 3]].slice(0, s.k); return '<div>' + withStar(robot(p).svg) + '<pre class="mono">' + progText(p) + '</pre>' + cap(s.say) + '</div>'; }, { k: 0, say: '' }), steps: [
          { say: 'Get the robot to the star.', ms: 1400 },
          { say: 'Step 1: move 3.', act: function (t) { return t.set({ k: 1 }, 1300); } },
          { say: 'Step 2: turn right.', act: function (t) { return t.set({ k: 2 }, 1300); } },
          { say: 'Step 3: move 3. It reached the star. <b>Order matters.</b>', act: function (t) { return t.set({ k: 3 }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { prog: [] }, draw: function (s) { return withStar(robot(s.prog).svg) + '<pre class="mono">' + progText(s.prog) + '</pre>'; },
          buttons: [{ label: 'Move 1', act: function (s) { var l = s.prog[s.prog.length - 1]; if (l && l[0] === 'move') l[1]++; else s.prog.push(['move', 1]); } }, { label: 'Turn right', act: function (s) { s.prog.push(['right']); } }, { label: 'Turn left', act: function (s) { s.prog.push(['left']); } }, { label: 'Undo', act: function (s) { var l = s.prog[s.prog.length - 1]; if (l && l[0] === 'move' && l[1] > 1) l[1]--; else s.prog.pop(); } }],
          info: function (s) { var r = robot(s.prog); return r.off ? 'The robot went off the grid. Press Undo.' : r.steps + ' steps so far.'; },
          tasks: [{ do: 'Write code to get the robot <b>to the star</b>.', goal: function (s) { var r = robot(s.prog); return r.x === STAR[0] && r.y === STAR[1] && !r.off; }, yes: function (s) { return 'Your code: ' + progText(s.prog) + '.'; } }] }), do: '' },
        key: '<p>Code runs <b>one step at a time, in order</b>.</p>',
        check: [TU('s5', 0), SK('pt-code', 1)] },

      { id: 'loop', title: 'Repeat loops', exp: ['C3.1', 'C3.2'], skill: 'pt-code', hard: true,
        body: '<p>A <b>repeat</b> (or loop) does the same steps many times, so the code is shorter. Repeat 4 times [move 3, turn right] draws a square.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + robot(loopProg(s.k, 3)).svg + '<pre class="mono">repeat 4 times\n  move 3\n  turn right\nend repeat</pre>' + cap(s.say) + '</div>'; }, { k: 0, say: '' }), steps: [
          { say: 'The loop runs 4 times.', ms: 1300 },
          { say: 'Each time: move 3, turn right.', act: function (t) { return t.seq([{ k: 1, say: 'Time 1' }, { k: 2, say: 'Time 2' }, { k: 3, say: 'Time 3' }, { k: 4, say: 'Time 4' }], 900); } },
          { say: 'A square. 4 &times; 3 = <b>12 steps</b>.', act: function (t) { return t.set({ say: '4 &times; 3 = 12 steps' }, 2000); } }
        ] },
        ways: [
          { label: 'Write it out long', html: '<pre class="mono">move 3, turn right,\nmove 3, turn right,\nmove 3, turn right,\nmove 3, turn right</pre><p>Same result, but 8 lines instead of a short loop.</p>' },
          { label: 'Multiply', html: '<p>Steps in all = times repeated &times; steps each time. Repeat 5 times [move 2] is 5 &times; 2 = <b>10</b>.</p>' }
        ],
        try: { mount: G3.play({ state: { r: 2, m: 2, t: 'right' }, draw: function (s) { return robot(loopProg(s.r, s.m, s.t)).svg + '<pre class="mono">repeat ' + s.r + ' times\n  move ' + s.m + '\n  turn ' + s.t + '\nend repeat</pre>'; },
          selects: [{ key: 'r', label: 'Repeat', options: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']] }, { key: 'm', label: 'Move', options: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']] }, { key: 't', label: 'Then turn', options: [['right', 'right'], ['left', 'left']] }],
          info: function (s) { var r = robot(loopProg(s.r, s.m, s.t)); return s.r + ' &times; ' + s.m + ' = <b>' + s.r * s.m + ' steps</b>' + (r.off ? '. Part of the path is off the grid.' : ''); },
          tasks: [{ do: 'Change the code to draw a square with sides of <b>5</b>.', goal: function (s) { return s.r === 4 && s.m === 5; }, yes: '4 &times; 5 = 20 steps.' },
            { do: 'Make the robot move <b>15 steps</b> in all.', goal: function (s) { return s.r * s.m === 15; }, yes: function (s) { return s.r + ' &times; ' + s.m + ' = 15.'; } }] }), do: '' },
        key: '<p>Loop: <b>times &times; steps each time</b>.</p>',
        mistake: '<p>Counting the loop once and forgetting it repeats. Trace the path with a finger and count each lap.</p>',
        check: [TU('s5', 1), TU('s5', 2), SK('pt-code', 2), SK('pt-code', 3)] },

      { id: 'together', title: 'At the same time', exp: ['C3.1', 'C3.2'], skill: 'pt-code',
        body: '<p>Some events happen <b>at the same time</b>, like music playing while a robot moves. These are <b>concurrent</b> events.</p>',
        watch: { mount: G3.view(concView, { t: 0, music: true, say: '' }), steps: [
          { say: 'Two lines of code start together: the robot and the music.', ms: 1600 },
          { say: 'The robot does its steps one at a time. The music keeps playing.', act: function (t) { return t.seq([{ t: 1 }, { t: 2 }, { t: 3 }, { t: 4 }], 900); } },
          { say: 'Both happened <b>at the same time</b>. They are concurrent.', ms: 2000 }
        ] },
        key: '<p>Sequential: <b>one after another</b>. Concurrent: <b>at the same time</b>.</p>',
        check: [G3.turn({ q: 'A robot moves while a light flashes. These events are:', options: ['concurrent', 'sequential'], answer: 0, why: 'They happen at the same time.' }), G3.turn({ q: 'Move 2, then turn, then move 3. These steps are:', options: ['sequential', 'concurrent'], answer: 0, why: 'They happen one after another, in order.' })] }
    ] }
  ];

  A.register('patterns', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Repeating patterns</h2>' +
'<p>A <b>repeating pattern</b> has a part that repeats over and over. That part is called the <b>core</b>. Find the core and you can tell what comes next, or what comes far ahead.</p>' +
'<div class="lab"><span class="lt">Try it: find the core</span>' +
'<div class="ctrl"><label for="rpc">Core<select id="rpc"><option value="AB">circle, square</option><option value="ABB" selected>circle, square, square</option><option value="AAB">circle, circle, square</option><option value="ABC">circle, square, triangle</option><option value="ABCD">circle, square, triangle, star</option></select></label>' +
'<label for="rpp">Which position? <output id="rppo"></output><input type="range" id="rpp" min="1" max="40" value="14"></label></div>' +
'<div class="fig" id="rpfig"></div><div class="out" id="rpout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The same pattern can be shown in many ways. Circle, square, square is the same as A, B, B, and the same as clap, snap, snap.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>The core is circle, square, triangle. It has 3 shapes. Position 9 ends the third core, so it is a <b>triangle</b>.</p><div class="fig">' + row('ABC', 9, -1, true) + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Patterns that grow</h2>' +
'<p>Some patterns repeat an <b>operation</b>, like "add 3" each time. The pattern rule tells you where to start and what to do: start at 2, add 3. That gives 2, 5, 8, 11, 14.</p>' +
'<div class="lab"><span class="lt">Try it: make a pattern rule</span>' +
'<div class="ctrl"><label for="grs">Start at<input type="number" id="grs" min="0" max="50" value="2"></label>' +
'<label for="gro">Each time<select id="gro"><option value="1">add</option><option value="-1">take away</option></select></label>' +
'<label for="grb">This much<input type="number" id="grb" min="1" max="10" value="3"></label></div>' +
'<div class="fig" id="grfig"></div><div class="tbl" id="grtbl"></div><div class="out" id="grout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Patterns work with big numbers too. 125, 225, 325, 425: the rule is start at 125, add 100. Only the hundreds digit changes.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find the rule: 40, 35, 30, 25. Each number is 5 less. The rule is <b>start at 40, take away 5</b>. Next comes 20.</p></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Variables: a letter for a number</h2>' +
'<p>A <b>variable</b> is a letter or a box that stands for a number. In <span class="math">n + 4 = 10</span>, the letter n stands for 6, because 6 + 4 = 10. In a rule, n can stand for any number you put in.</p>' +
'<div class="lab"><span class="lt">Try it: the number machine</span>' +
'<div class="ctrl"><label for="nmr">Rule<select id="nmr"><option value="+,5">n + 5</option><option value="+,10">n + 10</option><option value="-,3">n &minus; 3</option><option value="x,2" selected>2 &times; n</option><option value="x,5">5 &times; n</option><option value="x,10">10 &times; n</option></select></label>' +
'<label for="nmn">Put in n = <output id="nmno"></output><input type="range" id="nmn" min="3" max="10" value="4"></label></div>' +
'<div class="fig" id="nmfig"></div><div class="tbl" id="nmtbl"></div><div class="out" id="nmout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a letter is always the same number. In one question n might be 6. In the next question, n can be a different number.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find n: <span class="math">n + 8 = 15</span>. Think: what plus 8 makes 15? Count up from 8 to 15: that is 7. So <b>n = 7</b>.</p></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Equal or not equal?</h2>' +
'<p>Two expressions can look different but have the same value. <span class="math">4 &times; 5</span> and <span class="math">2 &times; 10</span> are both 20, so <span class="math">4 &times; 5 = 2 &times; 10</span> is true. If the values are different, use &ne;, which means "is not equal to".</p>' +
'<div class="lab"><span class="lt">Try it: compare two sides</span>' +
'<div class="ctrl"><label for="eqa">Left<input type="number" id="eqa" min="0" max="100" value="4"></label><label for="eqo">&nbsp;<select id="eqo" aria-label="Left operation"><option value="+">+</option><option value="-">&minus;</option><option value="x" selected>&times;</option><option value="/">&divide;</option></select></label><label for="eqb">&nbsp;<input type="number" id="eqb" min="0" max="100" value="5" aria-label="Left second number"></label></div>' +
'<div class="ctrl"><label for="eqc">Right<input type="number" id="eqc" min="0" max="100" value="2"></label><label for="eqp">&nbsp;<select id="eqp" aria-label="Right operation"><option value="+">+</option><option value="-">&minus;</option><option value="x" selected>&times;</option><option value="/">&divide;</option></select></label><label for="eqd">&nbsp;<input type="number" id="eqd" min="0" max="100" value="10" aria-label="Right second number"></label></div>' +
'<div class="out" id="eqout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Work out each side first. Then compare the two answers.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Is <span class="math">30 &divide; 5 = 3 + 3</span> true? Left: 30 &divide; 5 = 6. Right: 3 + 3 = 6. Both are 6, so it is <b>true</b>.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Coding a robot</h2>' +
'<p><b>Code</b> is a list of steps a computer follows in order. Steps that come one after another are <b>sequential</b>. A <b>repeat</b> (or loop) does the same steps many times, so the code is shorter. Two things that happen at the same time, like music playing while a robot moves, are <b>concurrent</b>.</p>' +
'<div class="lab"><span class="lt">Try it: change the code</span>' +
'<pre class="mono" id="cdcode"></pre>' +
'<div class="ctrl"><label for="cdr">Repeat<select id="cdr"><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option></select></label>' +
'<label for="cdm">Move<select id="cdm"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option></select></label>' +
'<label for="cdt">Then turn<select id="cdt"><option value="right" selected>right</option><option value="left">left</option></select></label></div>' +
'<div class="fig" id="cdfig"></div><div class="out" id="cdout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Changing one number in a loop changes the whole result. Repeat 4 times "move 3, turn right" draws a square. Change the 3 to 5 and you get a bigger square.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>This code: move 2, turn right, move 2, turn right, move 2, turn right, move 2. It is the same as: repeat 4 times [move 2, turn right]. The robot moves <b>8 steps</b> in all.</p></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'What comes next?', fig: row('AB', 7, 6), options: ['circle', 'square'], answer: 0, why: 'The core is circle, square. Position 7 starts a new core.' },
        { q: 'What is the core?', fig: row('AAB', 9, -1), options: ['circle, square', 'circle, circle, square', 'circle, circle'], answer: 1, why: 'Look for the part that repeats: circle, circle, square, then it starts again.' },
        { q: 'Which pattern is the same as circle, square, square?', options: ['A, B, B', 'A, A, B', 'A, B, C'], answer: 0, why: 'Give each shape a letter: circle is A, square is B.' }
      ],
      s2: [
        { q: 'What comes next? <span class="math">3, 7, 11, 15, ___</span>', options: ['17', '19', '20'], answer: 1, why: 'Each number is 4 more. 15 + 4 = 19.' },
        { q: 'What is the rule? <span class="math">50, 45, 40, 35</span>', options: ['Start at 50, add 5', 'Start at 50, take away 5', 'Start at 35, take away 5'], answer: 1, why: 'The numbers get smaller by 5 each time, starting at 50.' },
        { q: 'Start at 210 and add 100 each time. What is the third number?', options: ['230', '310', '410'], answer: 2, why: '210, 310, 410. The third number is 410.' }
      ],
      s3: [
        { q: 'Find n: <span class="math">n + 5 = 12</span>', options: ['5', '7', '17'], answer: 1, why: 'What plus 5 makes 12? Count up from 5 to 12.' },
        { q: 'The rule is n + 10. What comes out when n = 6?', options: ['16', '60', '4'], answer: 0, why: 'Put 6 in place of n: 6 + 10 = 16.' },
        { q: 'Find the box: <span class="math">5 &times; &#9633; = 30</span>', options: ['5', '6', '25'], answer: 1, why: '5 times what is 30? Count by 5s to 30: 6 jumps.' }
      ],
      s4: [
        { q: 'Is <span class="math">2 &times; 5 = 5 + 5</span> true?', options: ['True', 'False'], answer: 0, why: 'Left: 10. Right: 10. They are equal.' },
        { q: 'Is <span class="math">20 &divide; 2 = 20 &minus; 2</span> true?', options: ['True', 'False'], answer: 1, why: 'Left: 10. Right: 18. They are not equal.' },
        { q: 'Which is equal to <span class="math">10 &times; 3</span>?', options: ['5 &times; 6', '10 + 3', '3 &times; 3'], answer: 0, why: '10 &times; 3 = 30. 5 &times; 6 = 30 too.' }
      ],
      s5: [
        { q: 'Code: move 2, move 3, move 1. How many steps does the robot move?', options: ['5', '6', '7'], answer: 1, why: 'Add the moves in order: 2 + 3 + 1.' },
        { q: 'Code: repeat 3 times [move 4]. How many steps?', options: ['7', '12', '34'], answer: 1, why: 'The loop runs 3 times. 3 &times; 4 = 12.' },
        { q: 'Change the code from repeat 3 times [move 4] to repeat 5 times [move 4]. How many steps now?', options: ['12', '20', '9'], answer: 1, why: '5 &times; 4 = 20.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function rp() {
        var core = $('#rpc', root).value, p = +$('#rpp', root).value, L = core.length, k = core.charAt((p - 1) % L);
        $('#rppo', root).textContent = p;
        var n = Math.min(20, Math.max(L * 3, Math.ceil(Math.min(p, 20) / L) * L));
        $('#rpfig', root).innerHTML = row(core, n, -1, true);
        var full = Math.floor((p - 1) / L), at = (p - 1) % L + 1;
        $('#rpout', root).innerHTML = '<p><span class="big">Position ' + p + ': ' + SH[k] + '</span></p>' +
          '<p>The core has ' + L + ' shapes. ' + (full ? full + ' full core' + (full > 1 ? 's' : '') + ' come before it (' + full * L + ' shapes). ' : '') + 'Position ' + p + ' is shape ' + at + ' of the core.</p>' +
          '<p><b>As letters:</b> ' + core.split('').join(', ') + ' &nbsp;<b>As actions:</b> ' + core.split('').map(function (c) { return ACT[c]; }).join(', ') + '</p>';
      }
      A.bind(root, ['rpc', 'rpp'], rp);
      function gr() {
        var st = clamp($('#grs', root).value, 0, 50), sg = +$('#gro', root).value, b = clamp($('#grb', root).value, 1, 10), vals = [];
        for (var i = 0; i < 8; i++) { var v = st + sg * b * i; if (v < 0) break; vals.push(v); }
        $('#grfig', root).innerHTML = towers(vals);
        $('#grtbl', root).innerHTML = '<table><tbody><tr><th class="l">Position</th>' + vals.map(function (_, i) { return '<td>' + (i + 1) + '</td>'; }).join('') + '</tr><tr><th class="l">Number</th>' + vals.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr></tbody></table>';
        var tenth = st + sg * b * 9;
        $('#grout', root).innerHTML = '<p><span class="big">' + vals.join(', ') + (vals.length === 8 ? ', ...' : '') + '</span></p><p>Rule: start at ' + st + ', ' + (sg > 0 ? 'add ' : 'take away ') + b + ' each time.' +
          (tenth >= 0 ? ' Prediction: the 10th number is ' + st + (sg > 0 ? ' + ' : ' &minus; ') + '9 &times; ' + b + ' = ' + tenth + '.' : ' The pattern reaches 0 or below before the 10th number, so it stops.') + '</p>';
      }
      A.bind(root, ['grs', 'gro', 'grb'], gr);
      function nm() {
        var r = $('#nmr', root).value.split(','), op = r[0], k = +r[1], n = +$('#nmn', root).value;
        var f = function (v) { return op === '+' ? v + k : op === '-' ? v - k : v * k; }, txt = op === 'x' ? k + ' &times; n' : 'n ' + showOp(op) + ' ' + k;
        $('#nmno', root).textContent = n;
        var s = '<rect x="10" y="40" width="90" height="60" rx="10" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><text x="55" y="80" text-anchor="middle" font-size="28" class="tb">' + n + '</text><text x="55" y="28" text-anchor="middle" font-size="16" class="t2">in: n</text>' +
          '<path d="M104 70 H170" style="stroke:var(--ink)" stroke-width="3"/><polygon points="170,62 184,70 170,78" style="fill:var(--ink)"/>' +
          '<rect x="190" y="22" width="180" height="96" rx="16" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="3"/><text x="280" y="80" text-anchor="middle" font-size="28" class="tb">' + txt.replace('&times;', '×').replace('&minus;', '−') + '</text>' +
          '<path d="M374 70 H440" style="stroke:var(--ink)" stroke-width="3"/><polygon points="440,62 454,70 440,78" style="fill:var(--ink)"/>' +
          '<rect x="460" y="40" width="90" height="60" rx="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5"/><text x="505" y="80" text-anchor="middle" font-size="28" font-weight="800" style="fill:#13203a">' + f(n) + '</text><text x="505" y="28" text-anchor="middle" font-size="16" class="t2">out</text>';
        $('#nmfig', root).innerHTML = A.svg(560, 130, s, 'Number machine: put in ' + n + ', rule ' + txt.replace('&times;', 'times').replace('&minus;', 'minus') + ', get out ' + f(n));
        var ins = [3, 4, 5, 6, 7, 8, 9, 10];
        $('#nmtbl', root).innerHTML = '<table><tbody><tr><th class="l">n</th>' + ins.map(function (v) { return '<td' + (v === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + v + '</td>'; }).join('') + '</tr><tr><th class="l">' + txt + '</th>' + ins.map(function (v) { return '<td' + (v === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + f(v) + '</td>'; }).join('') + '</tr></tbody></table>';
        $('#nmout', root).innerHTML = '<p>When n = ' + n + ', ' + txt.replace('n', n) + ' = <b>' + f(n) + '</b>.</p>';
      }
      A.bind(root, ['nmr', 'nmn'], nm);
      function eq() {
        var a = clamp($('#eqa', root).value, 0, 100), b = clamp($('#eqb', root).value, 0, 100), c = clamp($('#eqc', root).value, 0, 100), d = clamp($('#eqd', root).value, 0, 100), o = $('#eqo', root).value, p = $('#eqp', root).value;
        var L = evalE(a, o, b), Rv = evalE(c, p, d);
        function sh(v, x, op, y) { if (isNaN(v)) return 'You cannot divide by 0.'; if (v < 0) return x + ' ' + showOp(op) + ' ' + y + ' goes below 0. Grade 3 uses whole numbers, so try other numbers.'; if (v !== Math.floor(v)) return x + ' ' + showOp(op) + ' ' + y + ' does not come out even. Try numbers that divide evenly.'; return null; }
        var pr = sh(L, a, o, b) || sh(Rv, c, p, d);
        if (pr) { $('#eqout', root).innerHTML = '<p>' + pr + '</p>'; return; }
        var same = L === Rv;
        $('#eqout', root).innerHTML = '<p><span class="big">' + a + ' ' + showOp(o) + ' ' + b + ' ' + (same ? '=' : '&ne;') + ' ' + c + ' ' + showOp(p) + ' ' + d + '</span></p><p>Left side: ' + L + '. Right side: ' + Rv + '. ' + (same ? 'Both sides are the same, so the equation is <b>true</b>.' : 'The values are different, so they are <b>not equal</b>.') + '</p>';
      }
      A.bind(root, ['eqa', 'eqb', 'eqc', 'eqd', 'eqo', 'eqp'], eq);
      function cd() {
        var r = +$('#cdr', root).value, m = +$('#cdm', root).value, t = $('#cdt', root).value, prog = [];
        for (var i = 0; i < r; i++) { prog.push(['move', m]); prog.push([t]); }
        $('#cdcode', root).textContent = 'when start\n  repeat ' + r + ' times\n    move ' + m + ' steps\n    turn ' + t + '\n  end repeat';
        var res = robot(prog, 'Robot path: repeat ' + r + ' times, move ' + m + ', turn ' + t);
        $('#cdfig', root).innerHTML = res.svg;
        var shape = r >= 4 ? 'a closed square' + (r > 4 ? ', then it goes around again' : '') : r === 1 ? 'one straight line' : 'part of a square';
        $('#cdout', root).innerHTML = '<p><span class="big">' + r + ' &times; ' + m + ' = ' + r * m + ' steps</span></p><p>The loop runs ' + r + ' time' + (r > 1 ? 's' : '') + '. The path makes ' + shape + '.' + (res.off ? ' Part of the path goes off the grid. Try smaller moves.' : '') + '</p>';
      }
      A.bind(root, ['cdr', 'cdm', 'cdt'], cd);
    },

    quiz: [
      { q: 'This pattern keeps going. What is the 10th shape?', type: 'mc', options: ['circle', 'square'], answer: 0, fig: row('ABB', 6, -1, true),
        hint: 'The core has 3 shapes. Count on by cores: 3, 6, 9. What comes at position 10?', explain: 'Positions 1 to 9 are 3 full cores. Position 10 starts a new core, so it is a circle.' },
      { q: 'What comes next? <span class="math">6, 11, 16, 21, ___</span>', type: 'num', answer: 26,
        hint: 'How much bigger is each number?', explain: 'The rule is start at 6, add 5. 21 + 5 = 26.' },
      { q: 'Which rule makes <span class="math">300, 250, 200, 150</span>?', type: 'mc', options: ['Start at 300, add 50', 'Start at 300, take away 50', 'Start at 150, add 50', 'Start at 300, take away 100'], answer: 1,
        hint: 'Is the pattern getting bigger or smaller? By how much?', explain: 'It starts at 300 and gets 50 smaller each time.' },
      { q: 'Find n: <span class="math">n &minus; 7 = 13</span>', type: 'num', answer: 20,
        hint: 'What number, take away 7, leaves 13? Try adding 13 + 7.', explain: '20 &minus; 7 = 13, so n = 20.' },
      { q: 'Which equation is true?', type: 'mc', options: ['5 &times; 4 = 10 + 10', '6 &times; 2 = 6 + 2', '40 &divide; 10 = 40 &minus; 10', '3 + 3 = 3 &times; 3'], answer: 0,
        hint: 'Work out both sides of each one.', explain: '5 &times; 4 = 20 and 10 + 10 = 20.' },
      { q: 'A table follows the rule 2 &times; n. When n = 8, what is the output?', type: 'num', answer: 16,
        hint: 'Put 8 in place of n.', explain: '2 &times; 8 = 16.' },
      { q: 'Code: repeat 4 times [move 5, turn right]. How many steps does the robot move in all?', type: 'num', answer: 20, fig: robot([['move', 5], ['right'], ['move', 5], ['right'], ['move', 5], ['right'], ['move', 5], ['right']], 'Robot path: a square with sides of 5').svg,
        hint: 'The loop runs 4 times. Each time the robot moves 5.', explain: '4 &times; 5 = 20 steps.' }
    ],

    practice: [
      { id: 'pt-repeat', name: 'Repeating patterns', code: 'C1.3', gen: function (lv) {
        var core = lv === 1 ? R.pick(['AB', 'ABC']) : R.pick(['ABB', 'AAB', 'ABC', 'AABB', 'ABCD', 'ABBC']), L = core.length;
        var uniq = []; core.split('').forEach(function (c) { if (uniq.indexOf(c) < 0) uniq.push(c); });
        if (lv < 3) {
          var n = L * 2 + R.int(0, L - 1), ans = SH[core.charAt(n % L)];
          var o = R.mc(ans, uniq.map(function (c) { return SH[c]; }).filter(function (x) { return x !== ans; }));
          return { q: 'What comes next?', type: 'mc', options: o.options, answer: o.answer, fig: row(core, n + 1, n, false),
            hint: 'Find the part that repeats. Where in that part is the missing shape?',
            steps: ['The core is ' + core.split('').map(function (c) { return SH[c]; }).join(', ') + '. It has ' + L + ' shapes.', 'Position ' + (n + 1) + ' is shape ' + (n % L + 1) + ' of the core.', 'That is a ' + ans + '.'],
            explain: 'The next shape is a ' + ans + '.' };
        }
        var p = R.int(L * 3 + 1, 30), a2 = SH[core.charAt((p - 1) % L)];
        var o2 = R.mc(a2, uniq.map(function (c) { return SH[c]; }).filter(function (x) { return x !== a2; }));
        return { q: 'This pattern keeps going. What is shape number ' + p + '?', type: 'mc', options: o2.options, answer: o2.answer, fig: row(core, L * 2, -1, true),
          hint: 'The core has ' + L + ' shapes. Count by ' + L + 's to get close to ' + p + '.',
          steps: ['The core has ' + L + ' shapes.', Math.floor((p - 1) / L) + ' full cores make ' + Math.floor((p - 1) / L) * L + ' shapes.', 'Shape ' + p + ' is shape ' + ((p - 1) % L + 1) + ' of the next core: a ' + a2 + '.'],
          explain: 'Shape ' + p + ' is a ' + a2 + '.' };
      } },
      { id: 'pt-grow', name: 'Pattern rules', code: 'C1.3', gen: function (lv) {
        var st = lv === 3 ? R.int(1, 5) * 100 + R.pick([0, 25, 50]) : R.int(1, 30), b = lv === 3 ? R.pick([10, 50, 100]) : R.int(2, lv === 1 ? 5 : 10), sg = lv === 1 ? 1 : R.pick([1, -1]);
        if (sg < 0) st += 4 * b;
        var vals = []; for (var i = 0; i < 5; i++) vals.push(st + sg * b * i);
        var miss = lv === 2 ? R.int(1, 3) : 4, ans = vals[miss];
        var list = vals.map(function (v, i) { return i === miss ? '___' : v; }).join(', ');
        return { q: 'Find the missing number: <span class="math">' + list + '</span>', type: 'num', answer: ans,
          fig: lv === 1 ? towers(vals.slice(0, 4)) : '',
          hint: 'How much does the pattern change each time? Is it getting bigger or smaller?',
          steps: ['Compare two numbers next to each other. The pattern ' + (sg > 0 ? 'adds ' : 'takes away ') + b + ' each time.', 'The rule is start at ' + st + ', ' + (sg > 0 ? 'add ' : 'take away ') + b + '.', 'The missing number is ' + ans + '.'],
          explain: vals.join(', ') + '.' };
      } },
      { id: 'pt-var', name: 'Find the variable', code: 'C2.1', gen: function (lv) {
        var n, k, eq, steps;
        if (lv === 1) { n = R.int(2, 20); k = R.int(2, 20); eq = 'n + ' + k + ' = ' + (n + k); steps = ['What plus ' + k + ' makes ' + (n + k) + '?', 'Count up from ' + k + ' to ' + (n + k) + ', or work out ' + (n + k) + ' &minus; ' + k + '.', 'n = ' + n + '. Check: ' + n + ' + ' + k + ' = ' + (n + k) + '.']; }
        else if (lv === 2) { n = R.int(10, 60); k = R.int(2, 9); eq = 'n &minus; ' + k + ' = ' + (n - k); steps = ['What number, take away ' + k + ', leaves ' + (n - k) + '?', 'Add back: ' + (n - k) + ' + ' + k + '.', 'n = ' + n + '. Check: ' + n + ' &minus; ' + k + ' = ' + (n - k) + '.']; }
        else { k = R.pick([2, 5, 10]); n = R.int(2, 10); eq = k + ' &times; n = ' + k * n; steps = [k + ' times what is ' + k * n + '?', 'Count by ' + k + 's to ' + k * n + ' and count the jumps.', 'n = ' + n + '. Check: ' + k + ' &times; ' + n + ' = ' + k * n + '.']; }
        return { q: 'Find n: <span class="math">' + eq + '</span>', type: 'num', answer: n, hint: 'Think of the related fact. Then check by putting your number in for n.', steps: steps, explain: 'n = ' + n + '.' };
      } },
      { id: 'pt-table', name: 'Tables of values', code: 'C1.2', gen: function (lv) {
        var rules = [['+', R.int(2, 10)], ['x', R.pick([2, 5, 10])], ['-', R.int(1, 3)]], r = lv === 1 ? rules[0] : R.pick(rules), op = r[0], k = r[1];
        var f = function (v) { return op === '+' ? v + k : op === '-' ? v - k : v * k; }, txt = op === 'x' ? k + ' &times; n' : 'n ' + showOp(op) + ' ' + k;
        var ins = [], st = R.int(4, 6); for (var i = 0; i < 4; i++) ins.push(st + i);
        if (lv === 3) {
          var wrongs = [['+', k + 1], ['x', k === 2 ? 5 : 2], ['+', Math.max(1, f(ins[0]) - ins[0] + 2)], ['-', 1]].map(function (w) { return w[0] === 'x' ? w[1] + ' &times; n' : 'n ' + showOp(w[0]) + ' ' + w[1]; });
          var tbl = '<div class="tbl"><table><tbody><tr><th class="l">n</th>' + ins.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr><tr><th class="l">out</th>' + ins.map(function (v) { return '<td>' + f(v) + '</td>'; }).join('') + '</tr></tbody></table></div>';
          var good = wrongs.filter(function (w) { return w !== txt && !ins.every(function (v) { var m = w.match(/(\d+) &times; n|n (\+|&minus;) (\d+)/); var val = m[1] ? +m[1] * v : m[2] === '+' ? v + +m[3] : v - +m[3]; return val === f(v); }); });
          var o = R.mc(txt, good);
          return { q: 'Which rule matches the table?', type: 'mc', options: o.options, answer: o.answer, fig: tbl,
            hint: 'Try each rule on the first column. Then check it on another column.',
            steps: ['When n = ' + ins[0] + ', the output is ' + f(ins[0]) + '.', 'Try ' + txt + ': ' + txt.replace('n', ins[0]) + ' = ' + f(ins[0]) + '. It works.', 'Check another column: ' + txt.replace('n', ins[2]) + ' = ' + f(ins[2]) + '. It works too.'],
            explain: 'The rule is ' + txt + '.' };
        }
        var m2 = R.int(1, 3), tbl2 = '<div class="tbl"><table><tbody><tr><th class="l">n</th>' + ins.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr><tr><th class="l">' + txt + '</th>' + ins.map(function (v, i) { return '<td>' + (i === m2 ? '?' : f(v)) + '</td>'; }).join('') + '</tr></tbody></table></div>';
        return { q: 'The rule is <span class="math">' + txt + '</span>. What is the output when n = ' + ins[m2] + '?', type: 'num', answer: f(ins[m2]), fig: tbl2,
          hint: 'Put ' + ins[m2] + ' in place of n.',
          steps: ['The rule is ' + txt + '.', 'Put in n = ' + ins[m2] + ': ' + txt.replace('n', ins[m2]) + '.', 'That is ' + f(ins[m2]) + '.'],
          explain: txt.replace('n', ins[m2]) + ' = ' + f(ins[m2]) + '.' };
      } },
      { id: 'pt-equal', name: 'Equal or not', code: 'C2.2', gen: function (lv) {
        function ex(target) {
          var forms = [];
          for (var a = 1; a <= 10; a++) { if (target % a === 0 && target / a <= 10) forms.push([a, 'x', target / a]); if (a < target) forms.push([a, '+', target - a]); forms.push([target + a, '-', a]); if (target * a <= 100) forms.push([target * a, '/', a]); }
          return R.pick(forms.filter(function (f) { return lv > 1 || f[1] === '+' || f[1] === 'x'; }));
        }
        function txt(e) { return e[0] + ' ' + showOp(e[1]) + ' ' + e[2]; }
        var t = R.pick([10, 12, 15, 20, 24, 30, 40]);
        if (lv < 3) {
          var l = ex(t), same = R.int(0, 1), r = ex(same ? t : t + R.pick([-2, -1, 1, 2]));
          var lv2 = evalE(l[0], l[1], l[2]), rv = evalE(r[0], r[1], r[2]);
          var o = R.mc(lv2 === rv ? 'True' : 'False', ['True', 'False']);
          return { q: 'Is <span class="math">' + txt(l) + ' = ' + txt(r) + '</span> true?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Work out each side. Then compare.', steps: ['Left: ' + txt(l) + ' = ' + lv2 + '.', 'Right: ' + txt(r) + ' = ' + rv + '.', lv2 === rv ? 'They match, so it is true.' : lv2 + ' is not ' + rv + ', so it is false.'],
            explain: txt(l) + ' = ' + lv2 + ' and ' + txt(r) + ' = ' + rv + '.' };
        }
        var base = ex(t), right = ex(t), tries = 0;
        while (txt(right) === txt(base) && tries++ < 20) right = ex(t);
        var wr = [ex(t + 1), ex(t - 1), ex(t + 2)].map(txt).filter(function (w) { return w !== txt(right); });
        var o3 = R.mc(txt(right), wr);
        return { q: 'Which is equal to <span class="math">' + txt(base) + '</span>?', type: 'mc', options: o3.options, answer: o3.answer,
          hint: 'Work out ' + txt(base) + ' first. Then find a choice with the same value.',
          steps: [txt(base) + ' = ' + t + '.', 'Work out each choice.', txt(right) + ' = ' + t + ', so it is equal.'],
          explain: 'Both are ' + t + '.' };
      } },
      { id: 'pt-code', name: 'Read code', code: 'C3.2', gen: function (lv) {
        if (lv === 1) {
          var mv = [R.int(1, 5), R.int(1, 5), R.int(1, 5)];
          return { q: 'Code: move ' + mv.join(', move ') + '. How many steps does the robot move in all?', type: 'num', answer: mv[0] + mv[1] + mv[2],
            hint: 'The steps run in order. Add the moves.', steps: ['The code is sequential: one move after another.', 'Add: ' + mv.join(' + ') + '.', 'That is ' + (mv[0] + mv[1] + mv[2]) + ' steps.'], explain: mv.join(' + ') + ' = ' + (mv[0] + mv[1] + mv[2]) + '.' };
        }
        var r = R.int(2, 5), m = R.int(2, 5);
        if (lv === 2) return { q: 'Code: repeat ' + r + ' times [move ' + m + ', turn right]. How many steps does the robot move in all?', type: 'num', answer: r * m,
          fig: robot((function () { var p = []; for (var i = 0; i < r; i++) { p.push(['move', m]); p.push(['right']); } return p; })(), 'Robot path: repeat ' + r + ' times, move ' + m).svg,
          hint: 'The loop runs ' + r + ' times. How many steps each time?', steps: ['Each time through the loop, the robot moves ' + m + '.', 'The loop runs ' + r + ' times.', r + ' &times; ' + m + ' = ' + r * m + '.'], explain: r + ' &times; ' + m + ' = ' + r * m + ' steps.' };
        var r2 = r === 5 ? 2 : r + R.int(1, 5 - r);
        return { q: 'The code says repeat ' + r + ' times [move ' + m + ']. You change it to repeat ' + r2 + ' times [move ' + m + ']. How many steps does the robot move now?', type: 'num', answer: r2 * m,
          hint: 'Only the number of repeats changed. Use the new number.', steps: ['The new loop runs ' + r2 + ' times.', 'Each time the robot moves ' + m + '.', r2 + ' &times; ' + m + ' = ' + r2 * m + '.'], explain: 'Now it moves ' + r2 * m + ' steps instead of ' + r * m + '.' };
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
    function cores(lv) { return lv === 1 ? ['AB', 'ABC'] : ['ABB', 'AAB', 'ABC', 'AABB', 'ABCD']; }
    function coreText(core) { return core.split('').map(function (c) { return SH[c]; }).join(', '); }
    function seq(st, b, n) { var v = []; for (var i = 0; i < n; i++) v.push(st + b * i); return v; }
    function ruleOf(st, b) { return 'Start at ' + st + ', ' + (b > 0 ? 'add ' + b : 'take away ' + (-b)); }
    /* an equation with one unknown n, written for a child */
    function eqn(kind, n, k) { return kind === '+' ? 'n + ' + k + ' = ' + (n + k) : kind === '-' ? 'n &minus; ' + k + ' = ' + (n - k) : k + ' &times; n = ' + k * n; }
    function ex(e) { return e[0] + ' ' + showOp(e[1]) + ' ' + e[2]; }
    /* a single-step expression worth t, using + and &times; at level 1 and all four operations later */
    function exprFor(t, lv) {
      var forms = [];
      for (var a = 1; a <= 10; a++) { if (a < t) forms.push([a, '+', t - a]); if (t % a === 0 && t / a <= 10 && a > 1) forms.push([a, 'x', t / a]); if (lv > 1) { forms.push([t + a, '-', a]); if (t * a <= 60 && a > 1) forms.push([t * a, '/', a]); } }
      return R.pick(forms);
    }
    function codeText(c) { return c.r ? 'repeat ' + c.r + ' times [move ' + c.m + ']' : 'move ' + c.moves.join(', move '); }
    function codeSteps(c) { return c.r ? c.r * c.m : c.moves.reduce(function (a, b) { return a + b; }, 0); }

    var SHAPES = {
      'pt-repeat': [
        [1, 'order', function (lv) {
          var core = R.pick(lv === 1 ? cores(1) : ['ABC', 'ABCD']), L = core.length, shown = L * 2 - R.int(0, L - 1), next = [];
          for (var i = 0; i < L; i++) next.push(SH[core.charAt((shown + i) % L)]);
          return { q: 'Tap the cards in order to show the next ' + L + ' shapes.', type: 'order', items: next, first: 'next', fig: row(core, shown, -1, false),
            hint: 'Find the part that repeats. Where did the pattern stop?', steps: ['The core is ' + coreText(core) + '.', 'The pattern stopped after a ' + SH[core.charAt((shown - 1) % L)] + '.', 'Next: ' + next.join(', ') + '.'],
            explain: 'Next come ' + next.join(', ') + '.', meta: { k: 'rep-order', core: core, from: shown } };
        }],
        [1, 'tf', function (lv) {
          var core = R.pick(cores(lv)), L = core.length, p = R.int(L * 2 + 1, lv === 1 ? 12 : 20), real = SH[core.charAt((p - 1) % L)];
          var truth = !R.int(0, 1), others = core.split('').map(function (c) { return SH[c]; }).filter(function (x) { return x !== real; }), sayd = truth ? real : R.pick(others);
          var right = 'The core has ' + L + ' shapes. Shape ' + p + ' is shape ' + ((p - 1) % L + 1) + ' of a core: a ' + real + '.';
          return { q: 'The pattern keeps going. True or false: shape number <b>' + p + '</b> is a <b>' + sayd + '</b>.', type: 'tf', answer: truth, fig: row(core, L * 2, -1, true),
            why: why(right, ['The shape at ' + p + ' is always the first shape.', 'Patterns change after 10 shapes.', 'Count only the circles.']),
            hint: 'Count by ' + L + 's to get close to ' + p + '.', steps: [right], explain: right, meta: { k: 'rep-tf', core: core, p: p, said: sayd } };
        }],
        [1, 'fill', function (lv) {
          var core = R.pick(cores(lv)), L = core.length, total = L * (lv === 1 ? 3 : 4), per = core.split('').filter(function (c) { return c === 'A'; }).length;
          return { q: 'Look at the pattern. Fill in the blanks.', type: 'fill', fig: row(core, L * 2, -1, true), fill: 'The core has [[]] shapes. In the first ' + total + ' shapes there are [[]] circles.', answers: [L, per * total / L],
            hint: 'Find the part that repeats. How many circles are in one core?', steps: ['The core is ' + coreText(core) + ': ' + L + ' shapes.', 'One core has ' + per + ' circle' + (per > 1 ? 's' : '') + '.', total + ' shapes is ' + total / L + ' cores, so ' + per * total / L + ' circles.'],
            explain: 'The core has ' + L + ' shapes, and there are ' + per * total / L + ' circles.', meta: { k: 'rep-fill', core: core, total: total } };
        }],
        [2, 'mistake', function (lv) {
          var core = R.pick(['ABB', 'AAB', 'AABB', 'ABBC']), who = nm(), truth = !R.int(0, 2), sc = truth ? core : core.replace(/(.)\1/, '$1');
          var right = 'The part that repeats is ' + coreText(core) + '.';
          return { q: who + ' says the core of this pattern is <b>' + coreText(sc) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: row(core, core.length * 3, -1, false),
            why: why(right, ['Every shape that shows up once is the core.', 'The core is always two shapes.', 'The core is the first three shapes.']),
            hint: 'Find the smallest part that repeats over and over.', steps: [right], explain: right, meta: { k: 'rep-core', core: core, said: sc } };
        }]
      ],
      'pt-grow': [
        [1, 'fill', function (lv) {
          var b = R.int(2, lv === 1 ? 5 : 10) * (lv === 1 ? 1 : R.pick([1, -1])), st = b > 0 ? R.int(1, 20) : R.int(60, 90), v = seq(st, b, 6), gaps = lv === 1 ? [3, 5] : [1, 4];
          return { q: 'Find the missing numbers.', type: 'fill', fill: '<span class="math">' + v.map(function (x, i) { return gaps.indexOf(i) >= 0 ? '[[]]' : x; }).join(', ') + '</span>', answers: gaps.map(function (i) { return v[i]; }),
            hint: 'How much does it change each time?', steps: ['The rule is: ' + ruleOf(st, b).toLowerCase() + '.', 'The full pattern is ' + v.join(', ') + '.'],
            explain: v.join(', ') + '.', meta: { k: 'grow-fill' } };
        }],
        [1, 'line', function (lv) {
          var b = R.pick(lv === 1 ? [2, 5, 10] : [3, 4, 5, 10]), st = R.int(0, 3) * b, j = R.int(3, 5), max = Math.ceil((st + b * 5) / 10) * 10;
          return { q: ruleOf(st, b) + '. Put the marker on the <b>' + ['', '', '', 'third', 'fourth', 'fifth'][j] + '</b> number.', type: 'line', min: 0, max: max, tick: b, every: b * 2, snap: b, answer: st + b * (j - 1),
            hint: 'The first number is ' + st + '. Each jump adds ' + b + '.', steps: ['The pattern is ' + seq(st, b, j).join(', ') + '.', 'The ' + ['', '', '', 'third', 'fourth', 'fifth'][j] + ' number is ' + (st + b * (j - 1)) + '.'],
            explain: seq(st, b, j).join(', ') + '.', meta: { k: 'grow-line', st: st, b: b, j: j } };
        }],
        [1, 'which', function (lv) {
          var b = R.int(2, lv === 1 ? 5 : 9) * (lv === 1 ? 1 : R.pick([1, -1])), st = b > 0 ? R.int(2, 20) : R.int(50, 90), v = seq(st, b, 4);
          var o = R.mc(ruleOf(st, b), [ruleOf(st, b > 0 ? b + 1 : b - 1), ruleOf(st + b, b), ruleOf(st, -b)]);
          return { q: 'Which rule makes this pattern? <span class="math">' + v.join(', ') + ', &hellip;</span>', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Look at the first number. Then find the change from one number to the next.', steps: ['The first number is ' + st + '.', 'Each number is ' + Math.abs(b) + (b > 0 ? ' more' : ' less') + ' than the one before.'],
            explain: 'The rule is: ' + ruleOf(st, b).toLowerCase() + '.', meta: { k: 'grow-which', v: v } };
        }],
        [2, 'mistake', function (lv) {
          var b = R.int(2, 10) * R.pick([1, -1]), st = b > 0 ? R.int(1, 30) : R.int(60, 90), v = seq(st, b, 4), who = nm(), truth = !R.int(0, 2), said = truth ? st + 4 * b : st + 4 * b + R.pick([1, -1]) * (Math.abs(b) > 2 ? 2 : 1);
          var right = 'The pattern ' + (b > 0 ? 'adds ' : 'takes away ') + Math.abs(b) + ' each time. ' + v[3] + (b > 0 ? ' + ' : ' &minus; ') + Math.abs(b) + ' = ' + (st + 4 * b) + '.';
          return { q: who + ' says the next number in <span class="math">' + v.join(', ') + '</span> is <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Add the first two numbers to get the next one.', 'Patterns always go up by 1 at the end.', 'The next number is the same as the first.']),
            hint: 'Find the change from one number to the next.', steps: [right], explain: right, meta: { k: 'grow-tf', v: v, said: said } };
        }]
      ],
      'pt-var': [
        [1, 'match', function (lv) {
          var kinds = lv === 1 ? ['+'] : ['+', '-', 'x'], pairs = [], seen = {};
          while (pairs.length < 3) {
            var kd = R.pick(kinds), k = kd === 'x' ? R.pick([2, 5, 10]) : R.int(2, 9), n = R.int(kd === '-' ? k + 1 : 2, kd === 'x' ? 10 : 20);
            if (seen[n]) continue; seen[n] = 1;
            pairs.push(['<span class="math">' + eqn(kd, n, k) + '</span>', 'n = ' + n]);
          }
          return { q: 'Match each equation to its value of n.', type: 'match', pairs: pairs,
            hint: 'Try each value in place of n. Does the equation work?', steps: ['For n + 4 = 9, ask: what plus 4 makes 9? It is 5.'],
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'var-match' } };
        }],
        [1, 'tf', function (lv) {
          var kd = lv === 1 ? '+' : R.pick(['+', '-', 'x']), k = kd === 'x' ? R.pick([2, 5, 10]) : R.int(2, 12), n = R.int(kd === '-' ? k + 1 : 2, kd === 'x' ? 10 : 25), truth = !R.int(0, 1), sn = truth ? n : n + R.pick([1, 2, -1]);
          var right = 'Put ' + sn + ' in for n. ' + (truth ? 'Both sides match, so n = ' + n + '.' : 'The sides do not match. The right value is n = ' + n + '.');
          return { q: 'True or false: <b>n = ' + sn + '</b> makes <span class="math">' + eqn(kd, n, k) + '</span> true.', type: 'tf', answer: truth,
            why: why(right, ['n is always the biggest number.', 'n is always 1.', 'You cannot check what n is.']),
            hint: 'Put ' + sn + ' in place of n and work it out.', steps: [right, 'n = ' + n + '.'], explain: 'n = ' + n + '.', meta: { k: 'var-tf', eq: eqn(kd, n, k), n: sn } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), k = R.int(3, 9), n = R.int(4, lv === 1 ? 12 : 30);
          return { q: who + ' has some stickers. ' + who + ' gets ' + k + ' more and now has ' + (n + k) + '. So <span class="math">n + ' + k + ' = ' + (n + k) + '</span>. How many stickers did ' + who + ' have at first?', type: 'num', answer: n,
            hint: 'n is the number at first. What plus ' + k + ' makes ' + (n + k) + '?', steps: [(n + k) + ' &minus; ' + k + ' = ' + n + '.', 'Check: ' + n + ' + ' + k + ' = ' + (n + k) + '.'],
            explain: 'n = ' + n + '. ' + who + ' had ' + n + ' stickers.', meta: { k: 'var-num', eq: 'n + ' + k + ' = ' + (n + k) } };
        }],
        [2, 'mistake', function (lv) {
          var k = R.int(3, 9), n = R.int(5, 20), who = nm(), truth = !R.int(0, 2), sn = truth ? n : n + 2 * k;
          var right = 'n + ' + k + ' = ' + (n + k) + ', so n = ' + (n + k) + ' &minus; ' + k + ' = ' + n + '.';
          return { q: who + ' says n = <b>' + sn + '</b> in <span class="math">n + ' + k + ' = ' + (n + k) + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Add ' + k + ' and ' + (n + k) + ' to find n.', 'n is the number after the equal sign.', 'n is the same as ' + k + '.']),
            hint: 'Check by putting the number in for n.', steps: [right], explain: right, meta: { k: 'var-tf', eq: 'n + ' + k + ' = ' + (n + k), n: sn } };
        }]
      ],
      'pt-table': [
        [1, 'fill', function (lv) {
          var op = lv === 1 ? '+' : R.pick(['+', 'x', '-']), k = op === 'x' ? R.pick([2, 5, 10]) : op === '-' ? R.int(1, 3) : R.int(2, 9), ins = R.shuffle([4, 5, 6, 7, 8, 9]).slice(0, 2).sort(function (a, b) { return a - b; });
          return { q: 'The rule is <span class="math">' + ruleText(op, k) + '</span>. Fill in the outputs.', type: 'fill', fill: 'n = ' + ins[0] + ' &rarr; [[]]<br>n = ' + ins[1] + ' &rarr; [[]]', answers: ins.map(function (v) { return ruleOut(op, k, v); }), fig: machine(op, k, ins[0], true),
            hint: 'Put each number in place of n.', steps: ins.map(function (v) { return ruleText(op, k).replace('n', v) + ' = ' + ruleOut(op, k, v) + '.'; }),
            explain: ins.map(function (v) { return ruleText(op, k).replace('n', v) + ' = ' + ruleOut(op, k, v); }).join('. ') + '.', meta: { k: 'tbl-fill', op: op, k2: k, ins: ins } };
        }],
        [1, 'match', function (lv) {
          var op = lv === 1 ? '+' : R.pick(['+', 'x']), k = op === 'x' ? R.pick([2, 5, 10]) : R.int(2, 9), ins = R.shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, 3);
          var pairs = ins.map(function (v) { return ['n = ' + v, String(ruleOut(op, k, v))]; });
          return { q: 'The rule is <span class="math">' + ruleText(op, k) + '</span>. Match each input to its output.', type: 'match', pairs: pairs,
            hint: 'Put each number in place of n.', steps: ['For n = ' + ins[0] + ': ' + ruleText(op, k).replace('n', ins[0]) + ' = ' + ruleOut(op, k, ins[0]) + '.'],
            explain: pairs.map(function (p) { return p[0] + ' gives ' + p[1]; }).join('. ') + '.', meta: { k: 'tbl-match', op: op, k2: k } };
        }],
        [2, 'mistake', function (lv) {
          var k = R.int(3, 9), v = R.int(3, 9), who = nm(), truth = !R.int(0, 2), said = truth ? v + k : v * k;
          var right = 'The rule adds ' + k + '. ' + v + ' + ' + k + ' = ' + (v + k) + '.';
          return { q: 'The rule is <span class="math">n + ' + k + '</span>. ' + who + ' says the output for n = ' + v + ' is <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['n + ' + k + ' means ' + k + ' groups of n.', 'The output is always bigger than 20.', 'The input and the output are always the same.']),
            hint: 'Put ' + v + ' in place of n.', steps: [right], explain: right, meta: { k: 'tbl-tf', op: '+', k2: k, v: v, said: said } };
        }]
      ],
      'pt-equal': [
        [1, 'pick', function (lv) {
          var t = R.pick([10, 12, 15, 20, 24]), opts = [], seen = {};
          while (opts.length < 5) {
            var good = opts.length < 2, e = exprFor(good ? t : t + R.pick([-2, -1, 1, 2]), lv), s = ex(e);
            if (seen[s]) continue; seen[s] = 1; opts.push(s);
          }
          opts = R.shuffle(opts);
          var ans = []; opts.forEach(function (o, j) { if (evalE.apply(null, parse(o)) === t) ans.push(j); });
          return { q: 'Pick every one that is equal to <b>' + t + '</b>.', type: 'pick', options: opts, answer: ans,
            hint: 'Work out each one. Keep the ones that make ' + t + '.', steps: ['More than one can be right.'],
            explain: ans.map(function (j) { return opts[j]; }).join(' and ') + ' are equal to ' + t + '.', meta: { k: 'peq-pick', t: t } };
        }],
        [1, 'match', function (lv) {
          var ts = R.shuffle([8, 10, 12, 15, 16, 18, 20, 24]).slice(0, 3), pairs = ts.map(function (t) { var a = exprFor(t, lv), b; do { b = exprFor(t, lv); } while (ex(a) === ex(b)); return [ex(a), ex(b)]; });
          return { q: 'Match the two sides that are equal.', type: 'match', pairs: pairs,
            hint: 'Work out each card. Equal cards have the same value.', steps: ['Find the value of each card, then pair the same values.'],
            explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'peq-match' } };
        }],
        [1, 'fill', function (lv) {
          var t = R.pick([10, 12, 15, 20]), l = exprFor(t, lv), b = R.int(1, t - 1);
          return { q: 'Fill in the missing number so both sides are equal.', type: 'fill', fill: '<span class="math">' + ex(l) + ' = [[]] + ' + b + '</span>', answers: [t - b],
            hint: 'Work out ' + ex(l) + ' first.', steps: [ex(l) + ' = ' + t + '.', '? + ' + b + ' = ' + t + ', so the missing number is ' + (t - b) + '.'],
            explain: ex(l) + ' = ' + (t - b) + ' + ' + b + '. Both sides are ' + t + '.', meta: { k: 'peq-fill' } };
        }],
        [2, 'mistake', function (lv) {
          var a = R.int(3, 9), b = R.int(3, 9), c = R.int(1, Math.min(a, b) - 1), who = nm(), truth = !R.int(0, 2);
          var r = truth ? (a + b - c) + ' + ' + c : (a + b) + ' + ' + c, rv = truth ? a + b : a + b + c;
          var right = 'The equal sign means both sides have the same value. The left side is ' + (a + b) + '. The right side is ' + rv + '.';
          return { q: who + ' writes <span class="math">' + a + ' + ' + b + ' = ' + r + '</span> and says it is true. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['The equal sign means "write the answer next".', 'It is true because ' + (a + b) + ' is right after the equal sign.', 'Both sides have a plus sign, so they are equal.']),
            hint: 'Work out each side on its own.', steps: [right], explain: right, meta: { k: 'peq-tf', l: a + ' + ' + b, r: r } };
        }]
      ],
      'pt-code': [
        [1, 'match', function (lv) {
          var pairs = [], seen = {};
          while (pairs.length < 3) {
            var c = lv === 1 || !R.int(0, 1) ? { moves: [R.int(1, 5), R.int(1, 5)] } : { r: R.int(2, 4), m: R.int(2, 5) }, n = codeSteps(c);
            if (seen[n]) continue; seen[n] = 1;
            pairs.push([codeText(c), n + ' steps']);
          }
          return { q: 'Match each code to the number of steps the robot moves.', type: 'match', pairs: pairs,
            hint: 'Add the moves. A loop repeats its moves.', steps: ['move 2, move 3 is 5 steps. repeat 3 times [move 2] is 6 steps.'],
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'code-match' } };
        }],
        [1, 'fill', function (lv) {
          var r = R.int(2, lv === 1 ? 3 : 5), m = R.int(2, 6), long = [];
          for (var i = 0; i < r; i++) long.push(m);
          return { q: 'Write this code as a loop: <b>' + codeText({ moves: long }) + '</b>.', type: 'fill', fill: 'repeat [[]] times [move [[]]]', answers: [r, m],
            hint: 'How many times does the same move happen?', steps: ['The move is move ' + m + '.', 'It happens ' + r + ' times.'],
            explain: 'repeat ' + r + ' times [move ' + m + '].', meta: { k: 'code-fill', moves: long } };
        }],
        [1, 'tf', function (lv) {
          var c = lv === 1 ? { moves: [R.int(1, 5), R.int(1, 5), R.int(1, 5)] } : { r: R.int(2, 5), m: R.int(2, 5) }, n = codeSteps(c), who = nm(), truth = !R.int(0, 1);
          var said = truth ? n : c.r && c.r + c.m !== n ? c.r + c.m : n + R.pick([1, -1]);
          var right = c.r ? 'The loop runs ' + c.r + ' times and moves ' + c.m + ' each time: ' + c.r + ' &times; ' + c.m + ' = ' + n + '.' : 'Add the moves: ' + c.moves.join(' + ') + ' = ' + n + '.';
          return { q: 'Code: <b>' + codeText(c) + '</b>. ' + who + ' says the robot moves <b>' + said + '</b> steps. True or false: ' + who + ' is right.', type: 'tf', answer: said === n,
            why: why(right, ['Count only the first move.', 'A loop runs only once.', 'Add the number of repeats to the move.']),
            hint: c.r ? 'The moves inside the loop happen ' + c.r + ' times.' : 'The moves happen one after another.', steps: [right], explain: right, meta: { k: 'code-tf', said: said } };
        }],
        [2, 'which', function (lv) {
          var t = R.pick([6, 8, 10, 12, 15]), fs = [], seen = {};
          for (var r = 2; r <= 5; r++) if (t % r === 0) fs.push({ r: r, m: t / r });
          var right = R.pick(fs), wrong = [{ r: right.r, m: right.m + 1 }, { r: right.r + 1, m: right.m }, { moves: [right.r, right.m] }].filter(function (c) { return codeSteps(c) !== t; });
          var o = R.mc(codeText(right), wrong.map(codeText));
          return { q: 'Which code moves the robot exactly <b>' + t + '</b> steps?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Work out the steps for each code. A loop multiplies.', steps: [codeText(right) + ' moves ' + right.r + ' &times; ' + right.m + ' = ' + t + ' steps.'],
            explain: codeText(right) + ' moves ' + t + ' steps.', meta: { k: 'code-which', t: t } };
        }]
      ]
    };
    /* reads "12 &times; 3" or "12 × 3" back into [a, op, b] */
    function parse(s) { var t = s.replace(/<[^>]+>/g, '').replace('&times;', 'x').replace('&divide;', '/').replace('&minus;', '-').split(' '); return [+t[0], t[1], +t[2]]; }
    Q.shapes(CH, SHAPES);
  })();
})();
