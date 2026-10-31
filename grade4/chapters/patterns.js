(function () {
  var A = Atlas, R = A.R;
  var SH = {
    c: function (x, y, s, col) { return '<circle cx="' + (x + s / 2) + '" cy="' + (y + s / 2) + '" r="' + (s * 0.42) + '" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2"/>'; },
    s: function (x, y, s, col) { return '<rect x="' + (x + s * 0.1) + '" y="' + (y + s * 0.1) + '" width="' + (s * 0.8) + '" height="' + (s * 0.8) + '" rx="3" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2"/>'; },
    t: function (x, y, s, col) { return '<polygon points="' + (x + s / 2) + ',' + (y + s * 0.08) + ' ' + (x + s * 0.92) + ',' + (y + s * 0.9) + ' ' + (x + s * 0.08) + ',' + (y + s * 0.9) + '" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>'; }
  };
  var COL = { c: 'var(--strand)', s: 'var(--btn)', t: 'var(--hi)' }, WORD = { c: 'circle', s: 'square', t: 'triangle' };
  /* a row of shapes; the last k are shown as empty boxes with "?" */
  function shapeRow(list, k, label) {
    var s = '', g = 46;
    list.forEach(function (sh, i) {
      var x = 4 + i * g;
      if (i >= list.length - (k || 0)) s += '<rect x="' + (x + 3) + '" y="7" width="' + (g - 10) + '" height="' + (g - 10) + '" rx="8" style="fill:none;stroke:var(--ink2)" stroke-width="2" stroke-dasharray="5 4"/><text x="' + (x + g / 2 - 2) + '" y="' + (g / 2 + 10) + '" text-anchor="middle" font-size="22" class="tb">?</text>';
      else s += SH[sh](x, 4, g - 6, COL[sh]);
    });
    return A.svg(8 + list.length * g, g + 4, s, label || 'A row of shapes: ' + list.map(function (x) { return WORD[x]; }).join(', '));
  }
  /* growing tile pattern: figure n has start + add*(n-1) tiles, stacked in columns of up to 5 */
  function figures(start, add, count, hideLast) {
    var s = '', u = 16, x = 6, H = 0, items = [];
    for (var n = 1; n <= count; n++) {
      var tiles = start + add * (n - 1), cols = Math.ceil(tiles / 5), w = Math.max(cols * u, 40);
      items.push({ n: n, tiles: tiles, x: x, cols: cols });
      H = Math.max(H, Math.min(tiles, 5) * u);
      x += w + 22;
    }
    var base = H + 10;
    items.forEach(function (it) {
      var hide = hideLast && it.n === count;
      if (hide) s += '<rect x="' + it.x + '" y="' + (base - 5 * u) + '" width="' + Math.max(it.cols * u, 40) + '" height="' + 5 * u + '" rx="8" style="fill:none;stroke:var(--ink2)" stroke-width="2" stroke-dasharray="5 4"/><text x="' + (it.x + Math.max(it.cols * u, 40) / 2) + '" y="' + (base - 2.5 * u + 8) + '" text-anchor="middle" font-size="22" class="tb">?</text>';
      else for (var i = 0; i < it.tiles; i++) {
        var c = Math.floor(i / 5), r = i % 5, isNew = it.n > 1 && i >= start + add * (it.n - 2);
        s += '<rect x="' + (it.x + c * u) + '" y="' + (base - (r + 1) * u) + '" width="' + (u - 1) + '" height="' + (u - 1) + '" rx="2" style="fill:' + (isNew ? 'var(--btn)' : 'var(--strand)') + ';stroke:var(--ink)" stroke-width="1"/>';
      }
      s += '<text x="' + (it.x + Math.max(it.cols * u, 40) / 2) + '" y="' + (base + 24) + '" text-anchor="middle" font-size="16" class="t2">fig. ' + it.n + '</text>';
    });
    return A.svg(Math.max(120, x - 16), base + 32, s, 'Growing pattern of tiles: ' + items.map(function (it) { return hideLast && it.n === count ? 'figure ' + it.n + ' hidden' : it.tiles; }).join(', '));
  }
  function table(start, add, n, hideFrom) {
    var h = '<div class="tbl"><table><thead><tr><th class="l">Figure number</th>';
    for (var i = 1; i <= n; i++) h += '<th>' + i + '</th>';
    h += '</tr></thead><tbody><tr><th class="l">Number of tiles</th>';
    for (var j = 1; j <= n; j++) h += '<td>' + (hideFrom && j >= hideFrom ? '?' : start + add * (j - 1)) + '</td>';
    return h + '</tr></tbody></table></div>';
  }
  function graph(v, label) {
    var mx = Math.max.apply(null, v), top = Math.max(5, Math.ceil(mx / 5) * 5), W = 420, H = 210, s = '', bw = (W - 80) / Math.max(1, v.length - 1);
    for (var i = 0; i <= 5; i++) {
      var y = 170 - i * 30;
      s += '<line x1="50" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" style="stroke:var(--line)"/><text x="44" y="' + (y + 5) + '" text-anchor="end" font-size="16" class="t2">' + A.clean(top * i / 5) + '</text>';
    }
    v.forEach(function (n, k) {
      var x = 70 + k * bw, y = 170 - (n / top) * 150;
      s += '<circle cx="' + x + '" cy="' + y + '" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/><text x="' + x + '" y="192" text-anchor="middle" font-size="16">' + (k + 1) + '</text>';
    });
    s += '<line x1="50" y1="170" x2="' + (W - 10) + '" y2="170" style="stroke:var(--ink)" stroke-width="2"/><text x="' + (W / 2 + 20) + '" y="210" text-anchor="middle" font-size="15" class="t2">figure number</text>';
    return A.svg(W, H + 4, s, label || 'Graph of the pattern: ' + v.join(', '));
  }
  /* pan balance: left side shows expression, right a number; tilts by the difference */
  function balance(leftTxt, rightTxt, diff) {
    var tilt = Math.max(-12, Math.min(12, -diff * 2)), s = '', cx = 230;
    s += '<polygon points="' + (cx - 26) + ',196 ' + (cx + 26) + ',196 ' + cx + ',120" style="fill:color-mix(in srgb,var(--ink) 20%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
    s += '<g transform="rotate(' + tilt + ' ' + cx + ' 120)"><line x1="' + (cx - 180) + '" y1="120" x2="' + (cx + 180) + '" y2="120" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>';
    [[-160, leftTxt], [160, rightTxt]].forEach(function (p) {
      var x = cx + p[0];
      s += '<line x1="' + x + '" y1="120" x2="' + x + '" y2="78" style="stroke:var(--ink2)" stroke-width="2"/>' +
        '<rect x="' + (x - 70) + '" y="40" width="140" height="40" rx="10" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--strand)" stroke-width="2.5"/>' +
        '<text x="' + x + '" y="68" text-anchor="middle" font-size="21" class="tb" transform="rotate(' + (-tilt) + ' ' + x + ' 60)">' + p[1] + '</text>';
    });
    s += '</g><circle cx="' + cx + '" cy="120" r="6" style="fill:var(--ink)"/>';
    return A.svg(460, 204, s, 'Pan balance. Left: ' + leftTxt + '. Right: ' + rightTxt + '. ' + (diff === 0 ? 'It is level.' : diff > 0 ? 'The left side is heavier.' : 'The right side is heavier.'));
  }
  /* number line 0..20 with solution dots */
  function solLine(sols, max, label) {
    max = max || 20;
    var x0 = 24, x1 = 536, s = '<line x1="' + x0 + '" y1="40" x2="' + x1 + '" y2="40" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= max; i++) {
      var x = x0 + (x1 - x0) * i / max, on = sols.indexOf(i) >= 0;
      s += '<line x1="' + x + '" y1="32" x2="' + x + '" y2="48" style="stroke:var(--ink)" stroke-width="1.5"/>' + (i % (max > 20 ? 5 : 2) === 0 || on ? '<text x="' + x + '" y="74" text-anchor="middle" font-size="18"' + (on ? ' class="tb"' : ' class="t2"') + '>' + i + '</text>' : '');
      if (on) s += '<circle cx="' + x + '" cy="40" r="8" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>';
    }
    return A.svg(560, 80, s, label || 'Number line with the solutions ' + sols.join(', ') + ' marked');
  }
  /* tiny robot language. A program is a list of: 'F' (forward 1), 'R' (turn right), 'L' (turn left), or {rep: n, body: [...]} */
  function run(prog) {
    var x = 0, y = 0, d = 0, path = [[0, 0]], fwd = 0;
    var DX = [1, 0, -1, 0], DY = [0, 1, 0, -1]; /* y grows downward on screen */
    function go(list) {
      list.forEach(function (st) {
        if (st === 'F') { x += DX[d]; y += DY[d]; fwd++; path.push([x, y]); }
        else if (st === 'R') d = (d + 1) % 4;
        else if (st === 'L') d = (d + 3) % 4;
        else for (var i = 0; i < st.rep; i++) go(st.body);
      });
    }
    go(prog);
    return { path: path, fwd: fwd, x: x, y: y, d: d };
  }
  function codeText(prog, ind) {
    ind = ind || '';
    var out = [], i = 0;
    while (i < prog.length) {
      var st = prog[i];
      if (st === 'F') { var k = 0; while (prog[i] === 'F') { k++; i++; } out.push(ind + 'move forward ' + k); continue; }
      if (st === 'R') out.push(ind + 'turn right');
      else if (st === 'L') out.push(ind + 'turn left');
      else out.push(ind + 'repeat ' + st.rep + ' times:\n' + codeText(st.body, ind + '    '));
      i++;
    }
    return out.join('\n');
  }
  function fwd(n) { var a = []; for (var i = 0; i < n; i++) a.push('F'); return a; }
  function robotPic(prog, label) {
    var r = run(prog), xs = r.path.map(function (p) { return p[0]; }), ys = r.path.map(function (p) { return p[1]; });
    var minx = Math.min(0, Math.min.apply(null, xs)), maxx = Math.max(4, Math.max.apply(null, xs)), miny = Math.min(0, Math.min.apply(null, ys)), maxy = Math.max(3, Math.max.apply(null, ys));
    var cols = maxx - minx + 1, rows = maxy - miny + 1, u = Math.min(40, 420 / cols, 280 / rows), s = '', ox = 10, oy = 10;
    for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) s += '<rect x="' + (ox + i * u) + '" y="' + (oy + j * u) + '" width="' + u + '" height="' + u + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1"/>';
    function P(p) { return (ox + (p[0] - minx + 0.5) * u).toFixed(1) + ',' + (oy + (p[1] - miny + 0.5) * u).toFixed(1); }
    s += '<polyline points="' + r.path.map(P).join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
    var st = P(r.path[0]).split(','), en = P(r.path[r.path.length - 1]).split(',');
    s += '<circle cx="' + st[0] + '" cy="' + st[1] + '" r="' + (u * 0.28) + '" style="fill:var(--accent);stroke:var(--ink)" stroke-width="2"/>';
    var ang = [0, 90, 180, 270][r.d];
    s += '<g transform="translate(' + en[0] + ',' + en[1] + ') rotate(' + ang + ')"><polygon points="' + (u * 0.38) + ',0 ' + (-u * 0.28) + ',' + (-u * 0.3) + ' ' + (-u * 0.28) + ',' + (u * 0.3) + '" style="fill:var(--btn);stroke:var(--ink)" stroke-width="2"/></g>';
    return A.svg(Math.ceil(ox * 2 + cols * u), Math.ceil(oy * 2 + rows * u), s, label || 'The robot path. Green dot is the start. The orange arrow is where the robot ends, pointing the way it faces.');
  }

  var gen = {
    next: function (lv) {
      if (lv === 1) {
        var cores = [['c', 's'], ['c', 's', 't'], ['c', 'c', 's'], ['t', 's', 's']], core = R.pick(cores), list = [];
        for (var i = 0; i < core.length * 3 + 1; i++) list.push(core[i % core.length]);
        var ans = list[list.length - 1], o = R.mc(WORD[ans], ['circle', 'square', 'triangle']);
        return { q: 'This pattern repeats. What shape comes next?', type: 'mc', options: o.options, answer: o.answer, fig: shapeRow(list, 1),
          hint: 'Find the core: the part that repeats. Then say the pattern out loud.', steps: ['The core is ' + core.map(function (x) { return WORD[x]; }).join(', ') + '. It repeats.', 'The pattern so far ends partway through a core.', 'Next comes a ' + WORD[ans] + '.'], explain: 'The core repeats, so the next shape is a ' + WORD[ans] + '.' };
      }
      var start = R.int(1, lv === 2 ? 5 : 12), add = R.int(2, lv === 2 ? 5 : 9), n = lv === 2 ? 4 : R.int(8, 12), v = start + add * (n - 1);
      return { q: lv === 2 ? 'How many tiles will figure 4 have?' : 'The pattern starts at ' + start + ' and adds ' + add + ' each time: ' + [0, 1, 2, 3].map(function (k) { return start + add * k; }).join(', ') + ', ... What is figure ' + n + '?', type: 'num', answer: v,
        fig: lv === 2 ? figures(start, add, 4, true) : '', hint: 'Each figure adds ' + add + ' tiles. Count on by ' + add + 's.',
        steps: ['The pattern rule: start at ' + start + ', add ' + add + ' each time.', 'Figure 1 is ' + start + '. To get to figure ' + n + ', add ' + add + ' a total of ' + (n - 1) + ' times.', start + ' + ' + (n - 1) + ' &times; ' + add + ' = ' + start + ' + ' + (n - 1) * add + ' = ' + v + '.' + table(start, add, Math.min(n, 8))],
        explain: 'Figure ' + n + ' has ' + v + '.' };
    },
    rule: function (lv) {
      var start = R.int(2, 15), add = R.int(2, 9), vals = [0, 1, 2, 3, 4].map(function (k) { return start + add * k; });
      if (lv === 3) {
        var miss = R.int(1, 3), shown = vals.map(function (x, i) { return i === miss ? '&#9633;' : x; });
        return { q: 'Find the missing number: ' + shown.join(', '), type: 'num', answer: vals[miss],
          hint: 'Find how much the pattern grows between two numbers you can see.', steps: ['Look at two numbers side by side to find the rule: add ' + add + '.', 'The number before the box is ' + vals[miss - 1] + '. ' + vals[miss - 1] + ' + ' + add + ' = ' + vals[miss] + '.', 'Check with the next number: ' + vals[miss] + ' + ' + add + ' = ' + vals[miss + 1] + '.'], explain: 'The missing number is ' + vals[miss] + '.' };
      }
      var right = 'Start at ' + start + ' and add ' + add + ' each time', o = R.mc(right, ['Start at ' + start + ' and add ' + (add + 1) + ' each time', 'Start at ' + add + ' and add ' + start + ' each time', 'Start at ' + start + ' and multiply by ' + add + ' each time']);
      return { q: 'Which rule makes this pattern?' + (lv === 1 ? '' : ' ' + vals.join(', ')), type: 'mc', options: o.options, answer: o.answer,
        fig: lv === 1 ? table(start, add, 5) : '', hint: 'What is the first number? How much does it grow each time?', steps: ['The first number is ' + start + '.', 'Subtract neighbours: ' + vals[1] + ' &minus; ' + vals[0] + ' = ' + add + '. It grows by ' + add + ' each time.', right + '.'], explain: right + '.' };
    },
    dec: function (lv) {
      var st = lv === 1 ? R.int(1, 5) : R.int(1, 20), step = lv === 1 ? R.int(1, 3) : R.int(2, 5), vals = [0, 1, 2, 3, 4].map(function (k) { return st + step * k; });
      if (lv === 1 && R.int(0, 1)) {
        var s25 = R.pick([25, 50, 250]), b0 = R.int(1, 8) * s25, wv = [0, 1, 2, 3].map(function (k) { return b0 + s25 * k; });
        return { q: 'What comes next? ' + wv.map(A.fmt).join(', ') + ', &#9633;', type: 'num', answer: b0 + 4 * s25, hint: 'Find how much it grows each time.', steps: ['The pattern adds ' + s25 + ' each time.', A.fmt(wv[3]) + ' + ' + s25 + ' = ' + A.fmt(b0 + 4 * s25) + '.'], explain: 'Next is ' + A.fmt(b0 + 4 * s25) + '.' };
      }
      var shown = vals.slice(0, 4).map(function (t) { return (t / 10).toFixed(1); });
      if (lv === 3) {
        return { q: 'This pattern counts back. What comes next? ' + vals.slice().reverse().slice(0, 4).map(function (t) { return (t / 10).toFixed(1); }).join(', ') + ', &#9633;', type: 'num', answer: vals[0] / 10,
          hint: 'Each step takes away ' + (step / 10).toFixed(1) + ', which is ' + step + ' tenths.', steps: ['The pattern subtracts ' + (step / 10).toFixed(1) + ' each time.', (vals[1] / 10).toFixed(1) + ' &minus; ' + (step / 10).toFixed(1) + ' = ' + (vals[0] / 10).toFixed(1) + '.'], explain: 'Next is ' + (vals[0] / 10).toFixed(1) + '.' };
      }
      return { q: 'What comes next? ' + shown.join(', ') + ', &#9633;', type: 'num', answer: vals[4] / 10,
        hint: 'Think in tenths. Each step adds ' + step + ' tenths.', steps: ['Each step adds ' + (step / 10).toFixed(1) + ' (' + step + ' tenths).', shown[3] + ' + ' + (step / 10).toFixed(1) + ' = ' + (vals[4] / 10).toFixed(1) + '.'], explain: 'Next is ' + (vals[4] / 10).toFixed(1) + '.' };
    },
    solve: function (lv) {
      var x, a, b, q, steps, sym = R.pick(['&#9633;', 'n', 'a', '&#9733;']);
      if (lv === 1) { x = R.int(2, 20); a = R.int(3, 20); b = x + a; q = sym + ' + ' + a + ' = ' + b; steps = ['What number plus ' + a + ' makes ' + b + '?', 'Undo the adding: ' + b + ' &minus; ' + a + ' = ' + x + '.', 'Check: ' + x + ' + ' + a + ' = ' + b + '. It balances.']; }
      else if (lv === 2) {
        if (R.int(0, 1)) { x = R.int(15, 50); a = R.int(3, x - 5); b = x - a; q = sym + ' &minus; ' + a + ' = ' + b; steps = ['What number, take away ' + a + ', leaves ' + b + '?', 'Undo the subtracting: ' + b + ' + ' + a + ' = ' + x + '.', 'Check: ' + x + ' &minus; ' + a + ' = ' + b + '.']; }
        else { x = R.int(5, 30); a = R.int(5, 20); b = x + a; q = a + ' + ' + sym + ' = ' + b; steps = ['What number added to ' + a + ' makes ' + b + '?', b + ' &minus; ' + a + ' = ' + x + '.', 'Check: ' + a + ' + ' + x + ' = ' + b + '.']; }
      } else { a = R.int(2, 9); x = R.int(2, Math.floor(50 / a)); b = a * x; q = a + ' &times; ' + sym + ' = ' + b; steps = ['What number times ' + a + ' makes ' + b + '?', 'Undo the multiplying: ' + b + ' &divide; ' + a + ' = ' + x + '.', 'Check: ' + a + ' &times; ' + x + ' = ' + b + '.']; }
      return { q: 'Solve: <span class="math">' + q + '</span>. What is ' + sym + '?', type: 'num', answer: x, fig: lv === 1 ? balance(sym + ' + ' + a, String(b), 0) : '',
        hint: 'Do the opposite. Adding is undone by subtracting. Multiplying is undone by dividing.', steps: steps, explain: sym + ' = ' + x + '. ' + steps[steps.length - 1] };
    },
    ineq: function (lv) {
      var a = R.int(2, 9), b = R.int(a + 3, 20), op = lv === 1 ? '&lt;' : R.pick(['&lt;', '&gt;']);
      var sols = []; for (var v = 0; v <= 20; v++) if (op === '&lt;' ? v + a < b : v + a > b) sols.push(v);
      if (lv === 3) {
        var cnt = sols.filter(function (v) { return v <= 20; }).length;
        return { q: 'How many whole numbers from 0 to 20 make this true? <span class="math">n + ' + a + ' ' + op + ' ' + b + '</span>', type: 'num', answer: cnt,
          hint: 'First find the number that makes both sides equal: n = ' + (b - a) + '. Then decide which side of it works.', steps: ['If n + ' + a + ' = ' + b + ', then n = ' + (b - a) + '.', 'The sign is ' + (op === '&lt;' ? '"less than", so n must be less than ' + (b - a) : '"greater than", so n must be greater than ' + (b - a)) + '.', 'Count them: ' + cnt + ' numbers.<div class="fig">' + solLine(sols) + '</div>'], explain: cnt + ' whole numbers work.' };
      }
      var good = op === '&lt;' ? R.int(0, b - a - 1) : R.int(b - a + 1, 20), bad = op === '&lt;' ? R.int(b - a, 20) : R.int(0, b - a);
      var o = R.mc(String(good), [String(bad), String(b - a), String(op === '&lt;' ? b : 20 + 1)].filter(function (x) { return x !== String(good); }));
      return { q: 'Which value of n makes this true? <span class="math">n + ' + a + ' ' + op + ' ' + b + '</span>', type: 'mc', options: o.options, answer: o.answer,
        hint: 'Try each answer. Put it in place of n and see if the statement is true.', steps: ['n + ' + a + ' = ' + b + ' when n = ' + (b - a) + '. That one is not ' + (op === '&lt;' ? 'less' : 'greater') + ', it is equal.', 'Try ' + good + ': ' + good + ' + ' + a + ' = ' + (good + a) + ', which is ' + (op === '&lt;' ? 'less than' : 'greater than') + ' ' + b + '. True.'], explain: good + ' + ' + a + ' = ' + (good + a) + ' ' + op + ' ' + b + '.' };
    },
    code: function (lv) {
      if (lv === 1) {
        var k = R.int(2, 6), t = R.int(2, 4), prog = [{ rep: t, body: fwd(k) }];
        return { q: 'How many squares does the robot move in all?<span class="mono">' + codeText(prog) + '</span>', type: 'num', answer: k * t,
          hint: 'The line inside the loop runs ' + t + ' times.', steps: ['The loop runs ' + t + ' times.', 'Each time the robot moves ' + k + '.', t + ' &times; ' + k + ' = ' + k * t + '.<div class="fig">' + robotPic(prog) + '</div>'], explain: t + ' &times; ' + k + ' = ' + k * t + ' squares.' };
      }
      if (lv === 2) {
        var side = R.int(2, 5), sq = [{ rep: 4, body: fwd(side).concat(['R']) }], pick = R.pick([3, 4, 5].filter(function (x) { return x !== 4; }));
        var o = R.mc('4', ['3', '5', String(side)].filter(function (x) { return x !== '4'; }));
        return { q: 'This code should draw a closed square. What number goes in the box?<span class="mono">repeat &#9633; times:\n    move forward ' + side + '\n    turn right</span>', type: 'mc', options: o.options, answer: o.answer,
          hint: 'A square has 4 sides. Each time through the loop draws one side.', steps: ['Each loop draws one side, then turns.', 'A square has 4 sides, so repeat 4 times.<div class="fig">' + robotPic(sq) + '</div>'], explain: 'Repeat 4 times: one side each time.' };
      }
      var inner = R.int(2, 4), outer = R.int(2, 4), mv = R.int(1, 3), np = [{ rep: outer, body: [{ rep: inner, body: fwd(mv) }, 'R'] }];
      return { q: 'This code has a loop inside a loop (a <b>nested</b> loop). How many squares does the robot move in all?<span class="mono">' + codeText(np) + '</span>', type: 'num', answer: outer * inner * mv,
        hint: 'The inside loop moves ' + inner + ' &times; ' + mv + ' each time it runs. The outside loop runs it ' + outer + ' times.', steps: ['Inside loop: ' + inner + ' &times; ' + mv + ' = ' + inner * mv + ' squares.', 'Outside loop runs that ' + outer + ' times: ' + outer + ' &times; ' + inner * mv + ' = ' + outer * inner * mv + '.<div class="fig">' + robotPic(np) + '</div>'], explain: outer * inner * mv + ' squares in all.' };
    }
  };

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  function rep(core, n) { var l = []; for (var i = 0; i < n; i++) l.push(core[i % core.length]); return l; }
  /* tappable number line 0 to 20 */
  function tapLine(st) {
    var s = '<line x1="20" y1="44" x2="540" y2="44" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= 20; i++) {
      var x = 20 + 26 * i, on = st.lit[i];
      s += '<g data-k="' + i + '"><rect x="' + (x - 13) + '" y="14" width="26" height="76" fill="transparent"/><circle cx="' + x + '" cy="44" r="' + (on ? 10 : 6) + '" style="fill:' + (on ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/><text x="' + x + '" y="80" text-anchor="middle" font-size="16"' + (on ? ' class="tb"' : ' class="t2"') + '>' + i + '</text></g>';
    }
    return A.svg(560, 92, s, 'Number line from 0 to 20. Tap numbers to mark them.');
  }
  var EQS = [['n + 5', 12, function (n) { return n + 5; }], ['n &minus; 4', 9, function (n) { return n - 4; }], ['3 &times; n', 18, function (n) { return 3 * n; }]];

  var LESSONS = [
    { id: 'patterns', title: 'Repeating and growing', sub: 'A core that repeats, or the same amount added.', concepts: [
      { id: 'repeat', title: 'Repeating patterns', exp: ['C1.1'], skill: 'pa4-next',
        body: '<p>A <b>repeating pattern</b> has a <b>core</b>: the part that repeats again and again.</p>',
        watch: K.watch([
          ['The core: circle, square, triangle.', shapeRow(['c', 's', 't']), 1600],
          ['It repeats.', shapeRow(rep(['c', 's', 't'], 6)), 1400],
          ['And repeats. What comes next? Say it: circle, square, triangle, circle, square ... <b>triangle</b>.', shapeRow(rep(['c', 's', 't'], 9)), 2400]
        ]),
        try: K.lab({ controls: [
          { id: 'ac', label: '+ circle', type: 'action', act: function (s) { s.l.push('c'); }, can: function (s) { return s.l.length < 11; } },
          { id: 'as', label: '+ square', type: 'action', act: function (s) { s.l.push('s'); }, can: function (s) { return s.l.length < 11; } },
          { id: 'at', label: '+ triangle', type: 'action', act: function (s) { s.l.push('t'); }, can: function (s) { return s.l.length < 11; } },
          { id: 'un', label: 'Undo', type: 'action', act: function (s) { s.l.pop(); }, can: function (s) { return s.l.length > 0; } }],
          init: function (s) { s.l = []; },
          render: function (s) { s.k = s.l.join(''); return { fig: s.l.length ? shapeRow(s.l) : '<p class="t2">Add shapes to build a pattern.</p>', out: '' }; },
          tasks: [
            { do: 'Build the core <b>circle, square, square</b> three times.', goal: function (s) { return s.k === 'csscsscss'; }, yes: 'The core repeats 3 times.' },
            { do: 'Keep going: add the next <b>two</b> shapes.', goal: function (s) { return s.k === 'csscsscsscs'; }, yes: 'Circle, square: the core starts again.' }
          ] }),
        key: '<p><b>Find the core, then say the pattern out loud.</b></p>',
        check: [T('next', 1), T('next', 1)] },

      { id: 'grow', title: 'Growing patterns', exp: ['C1.1', 'C1.3'], skill: 'pa4-next',
        body: '<p>A <b>growing pattern</b> adds the <b>same amount</b> each time. The orange tiles are the new ones.</p>',
        watch: K.watch([1, 2, 3, 4].map(function (n) { return [n === 1 ? 'Figure 1: 3 tiles.' : n === 4 ? 'Figure 4: 9 tiles. <b>Start at 3, add 2</b> each time.' : 'Add 2 tiles: ' + (1 + 2 * n) + '.', figures(3, 2, n), n === 4 ? 2200 : 1300]; })),
        try: K.lab({ controls: [{ id: 'st', label: 'Figure 1 has', min: 1, max: 10, value: 3 }, { id: 'ad', label: 'Add each time', min: 1, max: 6, value: 2 }],
          render: function (s) { s.f4 = s.st + 3 * s.ad; return { fig: figures(s.st, s.ad, 4), out: '<p class="math">' + [0, 1, 2, 3].map(function (k) { return s.st + s.ad * k; }).join(', ') + ', ...</p>' }; },
          tasks: [
            { do: 'Make the pattern <b>4, 7, 10, 13</b>.', goal: function (s) { return s.st === 4 && s.ad === 3; }, yes: 'Start at 4, add 3.' },
            { do: 'Make figure 4 have exactly <b>20</b> tiles.', goal: function (s) { return s.f4 === 20; }, yes: function (s) { return 'Start at ' + s.st + ', add ' + s.ad + ': ' + s.st + ' + 3 &times; ' + s.ad + ' = 20.'; } }
          ] }),
        key: '<p>Growing pattern: <b>the same number of new tiles each time</b>.</p>',
        check: [T('next', 2), T('next', 2)] }
    ] },

    { id: 'rules', title: 'Pattern rules', sub: 'Tables, graphs and predictions.', concepts: [
      { id: 'table', title: 'Tables and predictions', exp: ['C1.2', 'C1.3'], skill: 'pa4-rule', hard: true,
        body: '<p>A <b>table of values</b> lists each figure and its number. The <b>pattern rule</b> says how to make it: "start at 3, add 2 each time". Use it to predict far ahead.</p>',
        watch: K.watch([
          ['The table for start at 3, add 2.', table(3, 2, 5), 1800],
          ['The same numbers as a graph: the points climb by the same step.', table(3, 2, 5) + graph([3, 5, 7, 9, 11]), 2200],
          ['Figure 10? From figure 1 to 10 is <b>9 steps</b>. 3 + 9 &times; 2 = <b>21</b>.', graph([3, 5, 7, 9, 11, 13, 15, 17, 19, 21]), 2600]
        ]),
        try: K.lab({ controls: [
          { id: 'st', label: 'Start at', type: 'number', min: 0, max: 20, value: 3 }, { id: 'ad', label: 'Add each time', type: 'number', min: 1, max: 10, value: 2 }, { id: 'n', label: 'Predict figure', type: 'number', min: 1, max: 50, value: 10 }],
          render: function (s) { var v = s.st + s.ad * (s.n - 1); return { fig: table(s.st, s.ad, 5) + graph([0, 1, 2, 3, 4].map(function (k) { return s.st + s.ad * k; })), out: '<p>Figure ' + s.n + ': ' + s.st + ' + ' + (s.n - 1) + ' &times; ' + s.ad + ' = <span class="big">' + v + '</span></p>' }; },
          tasks: [
            { do: 'Start at 5, add 4. Predict <b>figure 20</b>.', goal: function (s) { return s.st === 5 && s.ad === 4 && s.n === 20; }, yes: '5 + 19 &times; 4 = 81.' }
          ] }),
        ways: [
          { label: 'Count the steps', html: '<p>Figure 1 is the start. Every figure after it is one more step. Figure 10 is <b>9 steps</b> past figure 1: 3 + 9 &times; 2 = 21.</p>' },
          { label: 'Keep counting on', html: '<p>Count on by 2s from 3: 3, 5, 7, 9, 11, 13, 15, 17, 19, <b>21</b>. Ten numbers: figure 10 is 21. Slower, but it proves the rule.</p>' }
        ],
        key: '<p>Figure n = <b>start + (n &minus; 1) steps</b>.</p>',
        mistake: '<p>Multiplying the figure number by the step (10 &times; 2 = 20), forgetting the start. Ask: "How many steps are there from figure 1 to figure 10?"</p>',
        check: [T('rule', 1), T('rule', 2), T('next', 3)] },

      { id: 'missing', title: 'Missing terms', exp: ['C1.3'], skill: 'pa4-rule',
        body: '<p>To find a missing number, find the rule from two numbers <b>side by side</b>.</p>',
        watch: K.watch([
          ['5, 9, &#9633;, 17, 21.', '<p class="math big">5, 9, &#9633;, 17, 21</p>', 1600],
          ['9 &minus; 5 = 4. The rule adds 4.', '<p class="math big">5, 9, &#9633;, 17, 21</p><p class="math">+4 each time</p>', 1800],
          ['9 + 4 = <b>13</b>. Check: 13 + 4 = 17.', '<p class="math big">5, 9, <b>13</b>, 17, 21</p><p class="math">+4 each time</p>', 2000]
        ]),
        key: '<p><b>Subtract two neighbours to find the step.</b> Check with the next number.</p>',
        check: [T('rule', 3), T('rule', 3)] },

      { id: 'tenths', title: 'Patterns with tenths', exp: ['C1.4'], skill: 'pa4-dec',
        body: '<p>0.2, 0.4, 0.6, 0.8 ... adds 2 tenths each time. <b>Think in tenths</b>: 2, 4, 6, 8 tenths.</p>',
        watch: K.watch([
          ['0.2, 0.4, 0.6, 0.8 ...', '<p class="math big">0.2, 0.4, 0.6, 0.8, &#9633;</p>', 1600],
          ['In tenths: 2, 4, 6, 8. Next: 10 tenths.', '<p class="math big">2, 4, 6, 8, 10 tenths</p>', 1800],
          ['10 tenths is 1 whole: <b>1.0</b>.', '<p class="math big">0.2, 0.4, 0.6, 0.8, <b>1.0</b></p>', 2000]
        ]),
        key: '<p><b>Think in tenths.</b> 10 tenths make 1 whole.</p>',
        mistake: '<p>Going 0.8, 0.9, 0.10 (writing 10 tenths as 0.10). 10 tenths is 1.0.</p>',
        check: [T('dec', 1), T('dec', 2), T('dec', 3)] }
    ] },

    { id: 'equations', title: 'Equations and inequalities', sub: 'Keep it balanced.', concepts: [
      { id: 'balance', title: 'Keep it balanced', exp: ['C2.1', 'C2.2'], skill: 'pa4-solve',
        body: '<p>An equation is like a balance: <b>both sides are equal</b>. n + 5 = 12 asks: what number makes the sides level?</p>',
        watch: K.watch([
          ['n + 5 = 12. Try n = 4: 9 is lighter than 12.', balance('4 + 5', '12', -3), 1800],
          ['Try n = 9: 14 is too heavy.', balance('9 + 5', '12', 2), 1800],
          ['Try n = 7: 12 = 12. Level! <b>n = 7</b>.', balance('7 + 5', '12', 0), 2000]
        ]),
        try: K.lab({ controls: [{ id: 'e', label: 'Equation', type: 'select', options: EQS.map(function (q, i) { return [String(i), q[0] + ' = ' + q[1]]; }) }, { id: 'n', label: 'n', min: 0, max: 20, value: 0 }],
          render: function (s) { var q = EQS[+s.e], v = q[2](s.n); s.ok = v === q[1]; return { fig: balance(q[0].replace('n', s.n), String(q[1]), v - q[1]), out: '<p>' + (s.ok ? '<b>Level.</b> n = ' + s.n : v < q[1] ? 'Too light.' : 'Too heavy.') + '</p>' }; },
          tasks: [
            { do: 'Make <b>n + 5 = 12</b> level.', setup: function (api) { api.set('e', '0'); }, goal: function (s) { return s.e === '0' && s.ok; }, yes: 'n = 7.' },
            { do: 'Make <b>n &minus; 4 = 9</b> level.', setup: function (api) { api.set('e', '1'); }, goal: function (s) { return s.e === '1' && s.ok; }, yes: 'n = 13.' },
            { do: 'Make <b>3 &times; n = 18</b> level.', setup: function (api) { api.set('e', '2'); }, goal: function (s) { return s.e === '2' && s.ok; }, yes: 'n = 6.' }
          ] }),
        key: '<p>The answer makes <b>both sides equal</b>.</p>',
        check: [T('solve', 1), T('solve', 1)] },

      { id: 'undo', title: 'Undo it', exp: ['C2.2'], skill: 'pa4-solve', hard: true,
        body: '<p>To solve, <b>do the opposite</b>. Adding is undone by subtracting. Multiplying is undone by dividing.</p>',
        watch: K.watch([
          ['4 &times; n = 28.', balance('4 &times; n', '28', 0), 1600],
          ['Undo the &times; 4: divide. 28 &divide; 4 = 7.', '<p class="math big">n = 28 &divide; 4 = 7</p>', 2000],
          ['Check: 4 &times; 7 = 28. <b>n = 7</b>.', balance('4 &times; 7', '28', 0), 2000]
        ]),
        ways: [
          { label: 'Think of the fact', html: '<p>4 &times; n = 28: "4 times what is 28?" You know 4 &times; 7 = 28, so n = 7.</p>' },
          { label: 'Guess and check', html: '<p>Try n = 5: 4 &times; 5 = 20, too small. Try 8: 32, too big. Try 7: 28. Yes.</p>' },
          { label: 'Bar model', html: '<p>n &minus; 4 = 9 means n is a whole made of 4 and 9. So n = 9 + 4 = <b>13</b>.</p>' }
        ],
        key: '<p><b>Do the opposite operation.</b> Then check.</p>',
        mistake: '<p>Doing the same operation instead of the opposite (n &minus; 4 = 9, so n = 5). The check catches it: 5 &minus; 4 is not 9.</p>',
        check: [T('solve', 2), T('solve', 3)] },

      { id: 'ineq', title: 'Inequalities', exp: ['C2.3'], skill: 'pa4-ineq',
        body: '<p>n + 4 &lt; 11 has <b>many</b> answers: every number that makes the left side smaller than 11.</p>',
        watch: K.watch([
          ['n + 4 &lt; 11. First, when are they equal? n = 7.', solLine([7], 20), 1800],
          ['7 is not less, so it does not count. Smaller numbers do: 0 to 6.', solLine([0, 1, 2, 3, 4, 5, 6], 20), 2200]
        ]),
        try: K.tap({ render: tapLine, label: function (st) { return '<p>' + st.order.length + ' number' + (st.order.length === 1 ? '' : 's') + ' marked</p>'; },
          tasks: [
            { do: 'Tap <b>every</b> whole number that makes <b>n + 3 &lt; 9</b> true.', goal: function (st) { var k = Object.keys(st.lit).map(Number).sort(function (a, b) { return a - b; }); return k.join() === '0,1,2,3,4,5'; }, yes: '0 to 5. At 6 the two sides are equal.' }
          ] }),
        key: '<p>Find where the sides are <b>equal</b>, then go the way the sign points.</p>',
        check: [T('ineq', 1), T('ineq', 2), T('ineq', 3)] }
    ] },

    { id: 'coding', title: 'Coding', sub: 'Loops repeat steps.', concepts: [
      { id: 'loops', title: 'Loops', exp: ['C3.1', 'C3.2'], skill: 'pa4-code',
        body: '<p>A <b>loop</b> repeats the steps inside it. "repeat 4 times: move forward 3, turn right" draws a square.</p>',
        watch: K.watch([1, 2, 3, 4].map(function (t) { var p = [{ rep: t, body: fwd(3).concat(['R']) }]; return [t === 4 ? 'Four times: a closed <b>square</b>.' : 'Loop ' + t + ': forward 3, turn right.', robotPic(p) + '<pre class="mono">' + codeText([{ rep: t, body: fwd(3).concat(['R']) }]) + '</pre>', t === 4 ? 2200 : 1400]; })),
        try: K.lab({ controls: [{ id: 'k', label: 'Move forward', min: 1, max: 5, value: 2 }, { id: 't', label: 'Repeat', min: 1, max: 6, value: 2 }, { id: 'r', label: 'Turn right after', type: 'toggle', value: true }],
          render: function (s) { var p = [{ rep: s.t, body: fwd(s.k).concat(s.r ? ['R'] : []) }]; return { fig: robotPic(p), out: '<pre class="mono">' + codeText(p) + '</pre><p>Moves: ' + s.t + ' &times; ' + s.k + ' = <b>' + s.t * s.k + '</b> squares</p>' }; },
          tasks: [
            { do: 'Draw a closed <b>square with sides of 3</b>.', goal: function (s) { return s.r && s.k === 3 && s.t === 4; }, yes: 'Repeat 4 times: forward 3, turn right.' },
            { do: 'Move <b>12 squares in a straight line</b> using the loop.', goal: function (s) { return !s.r && s.k * s.t === 12; }, yes: function (s) { return s.t + ' &times; ' + s.k + ' = 12, no turns.'; } }
          ] }),
        key: '<p><b>A loop runs its steps again and again.</b> Total = times &times; steps inside.</p>',
        check: [T('code', 1), T('code', 2)] },

      { id: 'nested', title: 'A loop inside a loop', exp: ['C3.1', 'C3.2'], skill: 'pa4-code', hard: true,
        body: '<p>A <b>nested loop</b> is a loop inside a loop. The inside loop runs fully, <b>every time</b> the outside loop runs once.</p>',
        watch: K.watch([1, 2, 3].map(function (t) { var p = [{ rep: t, body: [{ rep: 2, body: fwd(2) }, 'R'] }]; return [t === 3 ? 'Outside loop 3 times. Moves: 3 &times; 2 &times; 2 = <b>12</b>.' : 'Outside loop ' + t + ': inside loop moves 2, twice. Then turn.', robotPic(p) + '<pre class="mono">' + codeText([{ rep: 3, body: [{ rep: 2, body: fwd(2) }, 'R'] }]) + '</pre>', t === 3 ? 2400 : 1600]; })),
        ways: [
          { label: 'Unroll it', html: '<p>Write out what the computer does: move 2, move 2, turn; move 2, move 2, turn; move 2, move 2, turn. Count the moves: <b>12</b>.</p>' },
          { label: 'Multiply', html: '<p>Inside: 2 &times; 2 = 4 moves. Outside runs it 3 times: 3 &times; 4 = <b>12</b>.</p>' }
        ],
        key: '<p>Nested loop total = <b>outside times &times; inside total</b>.</p>',
        mistake: '<p>Adding the repeat numbers (3 + 2) instead of multiplying. Have your child "be the robot" and step it out.</p>',
        check: [T('code', 3), T('code', 3)] }
    ] }
  ];

  A.register('patterns', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Repeating and growing patterns</h2>' +
'<p>A <b>repeating pattern</b> has a <b>core</b> that repeats again and again. A <b>growing pattern</b> gets bigger by the same amount each time.</p>' +
'<div class="vrow"><figure><figcaption>Repeating: the core is circle, square, triangle</figcaption>' + shapeRow(['c', 's', 't', 'c', 's', 't', 'c', 's', 't']) + '</figure></div>' +
'<div class="vrow"><figure><figcaption>Growing: 2 more tiles each time</figcaption>' + figures(3, 2, 4) + '</figure></div>' +
'<p>Patterns are all around us: days of the week repeat, and a stack of chairs grows by the same height each time a chair is added.</p>' +
'<div class="lab"><span class="lt">Try it: build a growing pattern</span>' +
'<div class="ctrl"><label for="pgs">Figure 1 has: <output id="pgso"></output><input type="range" id="pgs" min="1" max="10" value="3"></label><label for="pga">Add each time: <output id="pgao"></output><input type="range" id="pga" min="1" max="6" value="2"></label></div>' +
'<div class="fig" id="pgfig"></div><div class="out" id="pgout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>In a growing pattern, the new tiles are the same number each time. The orange tiles show what was added.</p></div>' +
A.yt({ gen: function () { return gen.next(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Tables, graphs and pattern rules</h2>' +
'<p>A <b>table of values</b> lists each figure number and its value. A <b>graph</b> shows the same numbers as points. The <b>pattern rule</b> tells how to make the pattern: "start at 3 and add 2 each time".</p>' +
'<div class="lab"><span class="lt">Try it: table, graph and prediction</span>' +
'<div class="ctrl"><label for="pts">Start at<input type="number" id="pts" min="0" max="20" value="3"></label><label for="pta">Add each time<input type="number" id="pta" min="1" max="10" value="2"></label><label for="ptn">Predict figure<input type="number" id="ptn" min="1" max="50" value="10"></label></div>' +
'<div id="pttbl"></div><div class="fig" id="ptgraph"></div><div class="out" id="ptout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Figure 1 has 3 tiles, and each figure adds 2. How many tiles in figure 10? From figure 1 to figure 10 is 9 steps. 9 &times; 2 = 18. 3 + 18 = <b>21 tiles</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Multiplying the figure number by the step: 10 &times; 2 = 20. That forgets the start. Count the steps from figure 1: there are 9.</p></div>' +
A.yt({ gen: function () { return gen.rule(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Number patterns with tenths</h2>' +
'<p>Patterns work with decimals too. 0.2, 0.4, 0.6, 0.8, 1.0 ... adds 2 tenths each time. Think in tenths: 2, 4, 6, 8, 10 tenths.</p>' +
'<div class="lab"><span class="lt">Try it: jump by tenths</span>' +
'<div class="ctrl"><label for="pds">Start at<select id="pds">' + [0, 1, 2, 3, 5].map(function (t) { return '<option value="' + t + '">' + (t / 10).toFixed(1) + '</option>'; }).join('') + '</select></label><label for="pdj">Jump by<select id="pdj">' + [1, 2, 3, 4, 5].map(function (t) { return '<option value="' + t + '"' + (t === 3 ? ' selected' : '') + '>' + (t / 10).toFixed(1) + '</option>'; }).join('') + '</select></label></div>' +
'<div class="fig" id="pdfig"></div><div class="out" id="pdout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>After 0.9 comes 1.0, not 0.10. Ten tenths make one whole.</p></div>' +
A.yt({ gen: function () { return gen.dec(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Symbols and equations</h2>' +
'<p>A symbol like &#9633;, n or &#9733; can stand for a number we do not know yet. It is called a <b>variable</b>. An <b>equation</b> says two sides are equal, like a pan balance that is level.</p>' +
'<p>To solve, <b>do the opposite</b>. In &#9633; + 17 = 42, undo "+ 17" by subtracting: 42 &minus; 17 = 25. Then <b>check</b>: 25 + 17 = 42.</p>' +
'<div class="lab"><span class="lt">Try it: balance the scale</span>' +
'<div class="ctrl"><label for="pbe">Equation<select id="pbe"><option value="a,17,42">n + 17 = 42</option><option value="s,12,30">n &minus; 12 = 30</option><option value="m,6,48">6 &times; n = 48</option><option value="a,28,50">n + 28 = 50</option></select></label><label for="pbg">Try a value for n<input type="number" id="pbg" min="0" max="60" value="20"></label></div>' +
'<div class="fig" id="pbfig"></div><div class="out" id="pbout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding when you should subtract. In n + 17 = 42, n is <b>less</b> than 42, so the answer cannot be 59.</p></div>' +
A.yt({ gen: function () { return gen.solve(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Inequalities</h2>' +
'<p>An <b>inequality</b> uses &lt; or &gt;. It can have many answers. For n + 5 &lt; 12, any whole number less than 7 works: 0, 1, 2, 3, 4, 5, 6.</p>' +
'<p>The steps are the same each time: <b>find the "equal" number first</b> (n + 5 = 12 when n = 7), then <b>decide which side works</b>.</p>' +
'<div class="lab"><span class="lt">Try it: graph the answers</span>' +
'<div class="ctrl"><label for="pia">n +<input type="number" id="pia" min="0" max="15" value="5"></label><label for="pio">Sign<select id="pio"><option value="lt">&lt; (less than)</option><option value="gt">&gt; (greater than)</option></select></label><label for="pib">Number<input type="number" id="pib" min="0" max="20" value="12"></label></div>' +
'<div class="fig" id="pifig"></div><div class="out" id="piout"></div></div>' +
A.yt({ gen: function () { return gen.ineq(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Coding: steps, loops and nested loops</h2>' +
'<p>Code is a list of steps. A computer does them <b>in order</b> (sequential). A <b>loop</b> repeats steps. A <b>nested loop</b> is a loop inside a loop. Some programs also run two things <b>at the same time</b> (concurrent), like music playing while a character moves.</p>' +
'<div class="lab"><span class="lt">Try it: program the robot</span>' +
'<div class="ctrl"><label for="pcr">Outer loop: repeat<input type="number" id="pcr" min="1" max="6" value="4"></label><label for="pci">Inner loop: repeat<input type="number" id="pci" min="1" max="4" value="1"></label><label for="pcf">Move forward<input type="number" id="pcf" min="1" max="5" value="3"></label><label for="pct">Then turn<select id="pct"><option value="R">right</option><option value="L">left</option><option value="">no turn</option></select></label></div>' +
'<div class="row2"><div><span class="mono" id="pccode"></span></div><div class="fig" id="pcfig"></div></div><div class="out" id="pcout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>To draw a square with sides of 3: "repeat 4 times: move forward 3, turn right". Without the loop, you would write 8 lines. The loop does it in 3.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>To find the total in a loop, multiply: steps in the loop &times; number of repeats. For a nested loop, multiply all the repeats together.</p></div>' +
A.yt({ gen: function () { return gen.code(1); } }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function iv(id, lo, hi) { return Math.max(lo, Math.min(hi, parseInt($('#' + id, root).value, 10) || 0)); }
      function pg() {
        var s = +$('#pgs', root).value, a = +$('#pga', root).value;
        $('#pgso', root).textContent = s; $('#pgao', root).textContent = a;
        $('#pgfig', root).innerHTML = figures(s, a, 4);
        $('#pgout', root).innerHTML = '<p>Tiles: ' + [0, 1, 2, 3].map(function (k) { return s + a * k; }).join(', ') + ', ...</p><p><b>Rule:</b> start at ' + s + ' and add ' + a + ' each time.</p>';
      }
      A.bind(root, ['pgs', 'pga'], pg);
      function pt() {
        var s = iv('pts', 0, 20), a = iv('pta', 1, 10), n = iv('ptn', 1, 50), v = [];
        for (var k = 0; k < 6; k++) v.push(s + a * k);
        $('#pttbl', root).innerHTML = table(s, a, 6);
        $('#ptgraph', root).innerHTML = graph(v);
        $('#ptout', root).innerHTML = '<p><b>Rule:</b> start at ' + s + ', add ' + a + ' each time. The points go up by the same amount, so they make a straight line.</p><p><b>Figure ' + n + ':</b> ' + s + ' + ' + (n - 1) + ' &times; ' + a + ' = <span class="big">' + (s + a * (n - 1)) + '</span></p>';
      }
      A.bind(root, ['pts', 'pta', 'ptn'], pt);
      function pd() {
        var s = +$('#pds', root).value, j = +$('#pdj', root).value, list = [], marks = '', W = 560, x0 = 24, x1 = 536, max = Math.ceil((s + j * 7) / 10) * 10, sv = '';
        for (var k = 0; k < 8; k++) list.push(s + j * k);
        sv += '<line x1="' + x0 + '" y1="70" x2="' + x1 + '" y2="70" style="stroke:var(--ink)" stroke-width="3"/>';
        for (var t = 0; t <= max; t++) { var x = x0 + (x1 - x0) * t / max, wh = t % 10 === 0; sv += '<line x1="' + x + '" y1="' + (wh ? 58 : 64) + '" x2="' + x + '" y2="' + (wh ? 82 : 76) + '" style="stroke:var(--ink)" stroke-width="' + (wh ? 3 : 1) + '"/>' + (wh ? '<text x="' + x + '" y="104" text-anchor="middle" font-size="20" class="tb">' + t / 10 + '</text>' : ''); }
        for (var i = 1; i < list.length; i++) {
          var xa = x0 + (x1 - x0) * list[i - 1] / max, xb = x0 + (x1 - x0) * list[i] / max;
          sv += '<path d="M' + xa + ' 66 Q' + ((xa + xb) / 2) + ' 30 ' + xb + ' 66" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/>';
        }
        list.forEach(function (t) { var x = x0 + (x1 - x0) * t / max; sv += '<circle cx="' + x + '" cy="70" r="6" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/>'; });
        $('#pdfig', root).innerHTML = A.svg(W, 112, sv, 'Number line counting by ' + (j / 10).toFixed(1) + ' from ' + (s / 10).toFixed(1));
        $('#pdout', root).innerHTML = '<p class="math" style="white-space:normal;font-size:1.15rem">' + list.map(function (t) { return (t / 10).toFixed(1); }).join(', ') + ', ...</p><p>Rule: start at ' + (s / 10).toFixed(1) + ' and add ' + (j / 10).toFixed(1) + ' (' + j + ' tenth' + (j > 1 ? 's' : '') + ') each time.</p>';
      }
      A.bind(root, ['pds', 'pdj'], pd);
      function pb() {
        var e = $('#pbe', root).value.split(','), a = +e[1], b = +e[2], g = iv('pbg', 0, 60), left, lv, sol;
        if (e[0] === 'a') { left = g + ' + ' + a; lv = g + a; sol = b - a; }
        else if (e[0] === 's') { left = g + ' &minus; ' + a; lv = g - a; sol = b + a; }
        else { left = a + ' &times; ' + g; lv = a * g; sol = b / a; }
        $('#pbfig', root).innerHTML = balance(left, String(b), lv - b);
        $('#pbout', root).innerHTML = '<p>Left side: ' + left + ' = <b>' + lv + '</b>. Right side: <b>' + b + '</b>.</p><p>' + (lv === b ? '<b class="okc">Level. n = ' + g + ' is the solution.</b>' : lv > b ? 'The left side is too heavy. Try a smaller value.' : 'The left side is too light. Try a bigger value.') + '</p>' +
          '<p class="t2">Do the opposite to solve it straight away: n = ' + (e[0] === 'a' ? b + ' &minus; ' + a : e[0] === 's' ? b + ' + ' + a : b + ' &divide; ' + a) + ' = ' + sol + '.</p>';
      }
      A.bind(root, ['pbe', 'pbg'], pb);
      function pi() {
        var a = iv('pia', 0, 15), b = iv('pib', 0, 20), op = $('#pio', root).value, sols = [];
        for (var v = 0; v <= 20; v++) if (op === 'lt' ? v + a < b : v + a > b) sols.push(v);
        $('#pifig', root).innerHTML = solLine(sols);
        var sym = op === 'lt' ? '&lt;' : '&gt;';
        $('#piout', root).innerHTML = '<p><span class="big">n + ' + a + ' ' + sym + ' ' + b + '</span></p><p>' + (b - a >= 0 ? 'Equal when n = ' + (b - a) + '. ' : '') + (sols.length ? 'Whole numbers from 0 to 20 that work: ' + (sols.length > 8 ? sols[0] + ', ' + sols[1] + ', ... , ' + sols[sols.length - 1] : sols.join(', ')) + ' (' + sols.length + ' in all).' : 'No whole number from 0 to 20 works.') + '</p>' +
          (sols.length ? '<p class="t2">Check one: ' + sols[0] + ' + ' + a + ' = ' + (sols[0] + a) + ', and ' + (sols[0] + a) + ' ' + sym + ' ' + b + '. True.</p>' : '');
      }
      A.bind(root, ['pia', 'pio', 'pib'], pi);
      function pc() {
        var o = iv('pcr', 1, 6), inn = iv('pci', 1, 4), f = iv('pcf', 1, 5), t = $('#pct', root).value;
        var body = [{ rep: inn, body: fwd(f) }];
        if (inn === 1) body = fwd(f);
        if (t) body = body.concat([t]);
        var prog = [{ rep: o, body: body }], r = run(prog);
        $('#pccode', root).textContent = codeText(prog);
        $('#pcfig', root).innerHTML = robotPic(prog);
        $('#pcout', root).innerHTML = '<p>The robot moves ' + o + (inn > 1 ? ' &times; ' + inn : '') + ' &times; ' + f + ' = <b>' + r.fwd + '</b> squares in all.' + (r.x === 0 && r.y === 0 ? ' It ends back where it started.' : '') + '</p>';
      }
      A.bind(root, ['pcr', 'pci', 'pcf', 'pct'], pc);
    },

    quiz: [
      { q: 'This pattern repeats. What shape comes next?', type: 'mc', fig: shapeRow(['c', 'c', 's', 'c', 'c', 's', 'c', 'c', 's']), options: ['square', 'triangle', 'circle'], answer: 2, hint: 'The core is circle, circle, square.', explain: 'After the last square, the core starts again with a circle.' },
      { q: 'Figure 1 has 4 tiles. Each figure adds 3 tiles. How many tiles in figure 6?', type: 'num', answer: 19, fig: figures(4, 3, 3), hint: 'From figure 1 to figure 6 is 5 steps of 3.', explain: '4 + 5 &times; 3 = 4 + 15 = 19.' },
      { q: 'Which rule makes the pattern 7, 12, 17, 22, 27?', type: 'mc', options: ['Start at 5 and add 7 each time', 'Start at 7 and add 7 each time', 'Start at 7 and add 5 each time', 'Start at 7 and multiply by 5'], answer: 2, hint: 'What is the first number? What is the difference between neighbours?', explain: 'It starts at 7, and 12 &minus; 7 = 5.' },
      { q: 'What comes next? 0.4, 0.7, 1.0, 1.3, &#9633;', type: 'num', answer: 1.6, hint: 'Each step adds 3 tenths.', explain: '1.3 + 0.3 = 1.6.' },
      { q: 'Solve: <span class="math">n + 17 = 42</span>', type: 'num', answer: 25, hint: 'Undo the + 17 by subtracting 17 from 42.', explain: '42 &minus; 17 = 25. Check: 25 + 17 = 42.' },
      { q: 'Which value of n makes <span class="math">n + 6 &lt; 10</span> true?', type: 'mc', options: ['3', '4', '5', '10'], answer: 0, hint: 'n + 6 = 10 when n = 4. You need less than that.', explain: '3 + 6 = 9, and 9 &lt; 10.' },
      { q: 'How many squares does the robot move in all?<span class="mono">repeat 3 times:\n    repeat 2 times:\n        move forward 2\n    turn left</span>', type: 'num', answer: 12, hint: 'Inner loop: 2 &times; 2. Outer loop runs that 3 times.', explain: '3 &times; 2 &times; 2 = 12 squares.' }
    ],

    practice: [
      { id: 'pa4-next', name: 'Extend a pattern', code: 'C1.1, C1.3', gen: gen.next },
      { id: 'pa4-rule', name: 'Pattern rules and missing terms', code: 'C1.2, C1.3', gen: gen.rule },
      { id: 'pa4-dec', name: 'Number and decimal patterns', code: 'C1.4', gen: gen.dec },
      { id: 'pa4-solve', name: 'Solve equations', code: 'C2.1, C2.2', gen: gen.solve },
      { id: 'pa4-ineq', name: 'Inequalities', code: 'C2.3', gen: gen.ineq },
      { id: 'pa4-code', name: 'Read and change code', code: 'C3.1, C3.2', gen: gen.code }
    ]
  });
})();
