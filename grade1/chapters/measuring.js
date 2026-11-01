(function () {
  var A = Atlas, R = A.R;
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  /* calendars show this year, so the dates never go out of date */
  var YR = new Date().getFullYear();
  function dayOf(m, d) { return DAYS[new Date(YR, m, d).getDay()]; }
  /* three day names for a choice: the day before, the day of the date, the day after (gap days apart) */
  function near(m, d, gap) { var i = DAYS.indexOf(dayOf(m, d)); return [DAYS[(i + 7 - gap) % 7], DAYS[i], DAYS[(i + gap) % 7]]; }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var SEASON = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'fall', 'fall', 'fall', 'winter'];
  var COLS = ['#e04b3a', '#2c68cf', '#2f9a4c', '#8441bd', '#ee7d24'];
  /* ribbons drawn next to a row of cubes. items: [{n, c, name, off}] */
  function ribbons(items, o) {
    o = o || {};
    var u = 26, s = '', y = 10, maxN = 0;
    items.forEach(function (it) { maxN = Math.max(maxN, it.n + (it.off || 0)); });
    items.forEach(function (it) {
      var x0 = 90 + (it.off || 0) * u;
      s += '<text x="82" y="' + (y + 21) + '" text-anchor="end" font-size="18" class="tb">' + it.name + '</text>';
      s += '<rect x="' + x0 + '" y="' + (y + 4) + '" width="' + it.n * u + '" height="24" rx="6" style="fill:' + it.c + '" stroke="rgba(0,0,0,.4)" stroke-width="2"/>';
      if (o.cubes) for (var i = 0; i < it.n; i++) s += '<rect x="' + (x0 + i * u + 1) + '" y="' + (y + 32) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="3" style="fill:var(--p0)" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/>';
      y += o.cubes ? 66 : 42;
    });
    if (!items.some(function (it) { return it.off; })) s += '<line x1="90" y1="4" x2="90" y2="' + (y - 4) + '" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="4 4"/>';
    return A.svg(100 + maxN * u, y, s, o.label || items.map(function (it) { return 'The ' + it.name + ' ribbon is ' + it.n + ' cubes long'; }).join('. ') + (items.some(function (it) { return it.off; }) ? '. The ribbons do not start at the same place.' : '. The ribbons start at the same place.'));
  }
  /* a shape made of grid squares. cells: list of [x, y] */
  function gridShape(cells, c, title) {
    var u = 26, s = '', W = 0, H = 0;
    cells.forEach(function (p) { W = Math.max(W, p[0] + 1); H = Math.max(H, p[1] + 1); });
    for (var i = 0; i <= Math.max(W, 4); i++) for (var j = 0; j <= Math.max(H, 3); j++) if (i < Math.max(W, 4) && j < Math.max(H, 3)) s += '<rect x="' + (4 + i * u) + '" y="' + (4 + j * u) + '" width="' + u + '" height="' + u + '" style="fill:none;stroke:var(--line)" stroke-width="1"/>';
    cells.forEach(function (p) { s += '<rect x="' + (4 + p[0] * u) + '" y="' + (4 + p[1] * u) + '" width="' + u + '" height="' + u + '" style="fill:' + c + '" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>'; });
    return A.svg(8 + Math.max(W, 4) * u, 8 + Math.max(H, 3) * u, s, title + ': a shape that covers ' + cells.length + ' squares');
  }
  function blob(n) {
    var cells = [[0, 0]], key = { '0,0': 1 };
    while (cells.length < n) {
      var p = R.pick(cells), d = R.pick([[1, 0], [0, 1], [-1, 0], [0, -1]]), q = [p[0] + d[0], p[1] + d[1]];
      if (q[0] < 0 || q[1] < 0 || q[0] > 5 || q[1] > 3 || key[q]) continue;
      key[q] = 1; cells.push(q);
    }
    return cells;
  }
  /* a pan balance with an object on each side. heavy: 'L', 'R' or '=' */
  function scale(lk, rk, heavy) {
    var t = heavy === 'L' ? -9 : heavy === 'R' ? 9 : 0, cx = 170, cy = 50, rad = t * Math.PI / 180, s = '';
    s += '<path d="M' + (cx - 26) + ' 170H' + (cx + 26) + 'L' + cx + ' 52Z" style="fill:var(--line);stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
    s += '<line x1="' + (cx - 130 * Math.cos(rad)) + '" y1="' + (cy - 130 * Math.sin(rad)) + '" x2="' + (cx + 130 * Math.cos(rad)) + '" y2="' + (cy + 130 * Math.sin(rad)) + '" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/>';
    [[-1, lk], [1, rk]].forEach(function (sd) {
      var px = cx + sd[0] * 125 * Math.cos(rad), py = cy + sd[0] * 125 * Math.sin(rad);
      s += '<line x1="' + px + '" y1="' + py + '" x2="' + px + '" y2="' + (py + 34) + '" style="stroke:var(--ink2)" stroke-width="2"/>';
      s += '<path d="M' + (px - 46) + ' ' + (py + 34) + 'H' + (px + 46) + 'Q' + px + ' ' + (py + 64) + ' ' + (px - 46) + ' ' + (py + 34) + 'Z" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
      s += OBJ[sd[1]].draw(px, py + 14);
    });
    return A.svg(340, 175, s, 'A balance with the ' + OBJ[lk].n + ' on the left and the ' + OBJ[rk].n + ' on the right. ' + (heavy === '=' ? 'It is level.' : 'It tips down on the ' + (heavy === 'L' ? 'left' : 'right') + '.'));
  }
  var OBJ = {
    rock: { n: 'rock', draw: function (x, y) { return '<path d="M' + (x - 26) + ' ' + (y + 18) + 'Q' + (x - 30) + ' ' + (y - 8) + ' ' + (x - 6) + ' ' + (y - 14) + 'Q' + (x + 24) + ' ' + (y - 16) + ' ' + (x + 28) + ' ' + (y + 18) + 'Z" style="fill:#8b8f99" stroke="rgba(0,0,0,.5)" stroke-width="2"/>'; } },
    feather: { n: 'feather', draw: function (x, y) { return '<path d="M' + (x - 28) + ' ' + (y + 16) + 'Q' + (x - 4) + ' ' + (y - 24) + ' ' + (x + 28) + ' ' + (y - 10) + 'Q' + (x + 4) + ' ' + (y + 14) + ' ' + (x - 28) + ' ' + (y + 16) + 'Z" style="fill:#e8eef7" stroke="rgba(0,0,0,.45)" stroke-width="2"/><line x1="' + (x - 30) + '" y1="' + (y + 18) + '" x2="' + (x + 22) + '" y2="' + (y - 8) + '" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>'; } },
    apple: { n: 'apple', draw: function (x, y) { return A.icon('apple', x, y, 42); } },
    book: { n: 'book', draw: function (x, y) { return '<rect x="' + (x - 26) + '" y="' + (y - 12) + '" width="52" height="30" rx="3" style="fill:#2c68cf" stroke="rgba(0,0,0,.5)" stroke-width="2"/><rect x="' + (x - 22) + '" y="' + (y + 10) + '" width="44" height="5" style="fill:#fff"/>'; } },
    pencil: { n: 'pencil', draw: function (x, y) { return '<path d="M' + (x - 30) + ' ' + (y + 6) + 'H' + (x + 20) + 'L' + (x + 32) + ' ' + (y + 11) + 'L' + (x + 20) + ' ' + (y + 16) + 'H' + (x - 30) + 'Z" style="fill:#f2bd24" stroke="rgba(0,0,0,.5)" stroke-width="2"/>'; } },
    ball: { n: 'ball', draw: function (x, y) { return A.icon('ball', x, y, 40); } },
    pumpkin: { n: 'pumpkin', draw: function (x, y) { return '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="30" ry="22" style="fill:#ee7d24" stroke="rgba(0,0,0,.5)" stroke-width="2"/><path d="M' + x + ' ' + (y - 20) + 'v-8" stroke="#3d7a2a" stroke-width="5"/><path d="M' + (x - 10) + ' ' + (y - 18) + 'Q' + x + ' ' + (y + 2) + ' ' + (x - 10) + ' ' + (y + 22) + 'M' + (x + 10) + ' ' + (y - 18) + 'Q' + x + ' ' + (y + 2) + ' ' + (x + 10) + ' ' + (y + 22) + '" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2"/>'; } }
  };
  /* real-life order from light to heavy, used to make sensible balances */
  var HEAVY = ['feather', 'pencil', 'apple', 'ball', 'book', 'rock', 'pumpkin'];
  /* containers: how many cups of water each holds */
  function jugs(list) {
    var s = '', x = 6;
    list.forEach(function (it) {
      var h = 30 + it.cups * 14, w = 64, y0 = 196;
      s += '<path d="M' + x + ' ' + (y0 - h) + 'V' + y0 + 'H' + (x + w) + 'V' + (y0 - h) + '" style="fill:color-mix(in srgb,#5aa9e6 25%,var(--card));stroke:var(--ink)" stroke-width="3"/>';
      for (var i = 0; i < it.cups; i++) s += '<rect x="' + (x + 3) + '" y="' + (y0 - 14 * (i + 1) + 1) + '" width="' + (w - 6) + '" height="12" style="fill:#5aa9e6;opacity:.85"/>';
      s += '<text x="' + (x + w / 2) + '" y="' + (y0 + 26) + '" text-anchor="middle" font-size="19" class="tb">' + it.name + '</text>';
      x += w + 34;
    });
    return A.svg(x - 24, 230, s, list.map(function (it) { return it.name + ' holds ' + it.cups + ' cups'; }).join('. '));
  }
  /* a month calendar page */
  function calendar(y, m, mark) {
    var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate(), c = 46, s = '';
    s += '<text x="' + (7 * c / 2 + 4) + '" y="26" text-anchor="middle" font-size="22" class="tb">' + MONTHS[m] + ' ' + y + '</text>';
    DAYS.forEach(function (d, i) { s += '<text x="' + (4 + i * c + c / 2) + '" y="56" text-anchor="middle" font-size="16" class="tb t2">' + d.slice(0, 3) + '</text>'; });
    for (var d = 1; d <= days; d++) {
      var k = first + d - 1, x = 4 + (k % 7) * c, yy = 64 + Math.floor(k / 7) * c;
      s += '<rect x="' + x + '" y="' + yy + '" width="' + c + '" height="' + c + '" style="fill:' + (d === mark ? 'var(--hi)' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1.5"/><text x="' + (x + c / 2) + '" y="' + (yy + 29) + '" text-anchor="middle" font-size="18" class="tb">' + d + '</text>';
    }
    var rows = Math.ceil((first + days) / 7);
    return A.svg(7 * c + 8, 68 + rows * c, s, 'Calendar for ' + MONTHS[m] + ' ' + y + '. The 1st is a ' + DAYS[first] + '. It has ' + days + ' days.' + (mark ? ' The ' + mark + ' is marked.' : ''));
  }

  function qAttr(lv) {
    var bank = [
      ['Which bag is <b>heavier</b>?', 'mass'], ['Which pencil is <b>longer</b>?', 'length'], ['Which jug <b>holds more</b> water?', 'capacity'], ['Which rug <b>covers more</b> floor?', 'area'],
      ['How <b>tall</b> is the door?', 'length'], ['How much juice fits in the bottle?', 'capacity'], ['Which watermelon weighs the most?', 'mass'], ['How much of the table does the placemat cover?', 'area'],
      ['How wide is this corner? Is it a square corner?', 'angle']
    ];
    var it = R.pick(lv === 1 ? bank.slice(0, 4) : lv === 2 ? bank.slice(0, 8) : bank);
    var all = ['length', 'mass', 'capacity', 'area'].concat(lv === 3 ? ['angle'] : []), o = R.mc(it[1], R.shuffle(all.filter(function (x) { return x !== it[1]; })).slice(0, 3));
    var what = { length: 'how long or tall something is', mass: 'how heavy something is', capacity: 'how much something holds', area: 'how much surface something covers', angle: 'how wide a corner or turn is' };
    return { q: it[0] + ' What are we measuring?', type: 'mc', options: o.options, answer: o.answer,
      hint: 'Length is how long. Mass is how heavy. Capacity is how much it holds. Area is how much it covers.', steps: ['Read the question. What does it ask about?', 'It asks ' + what[it[1]] + '.', 'That is ' + it[1] + '.'], explain: it[1].charAt(0).toUpperCase() + it[1].slice(1) + ' is ' + what[it[1]] + '.' };
  }
  function qLength(lv) {
    var names = R.shuffle(['red', 'blue', 'green', 'purple']), k = lv === 3 ? 3 : 2, ns = R.shuffle([3, 4, 5, 6, 7, 8, 9]).slice(0, k);
    var items = ns.map(function (n, i) { return { n: n, c: COLS[['red', 'blue', 'green', 'purple'].indexOf(names[i])], name: names[i] }; });
    if (lv === 1 && R.int(0, 2) === 0) {
      var it = items[0];
      return { q: 'How many cubes long is the ' + it.name + ' ribbon?', type: 'num', answer: it.n, fig: ribbons([it], { cubes: true }),
        hint: 'Count the cubes under the ribbon, one at a time.', steps: ['Start at the left end of the ribbon.', 'Count each cube under it.', 'The ribbon is ' + it.n + ' cubes long.'], explain: 'The ' + it.name + ' ribbon is ' + it.n + ' cubes long.' };
    }
    var longer = R.int(0, 1), pickIt = items.slice().sort(function (a, b) { return longer ? b.n - a.n : a.n - b.n; })[0];
    var o = { options: items.map(function (i) { return i.name; }), answer: items.indexOf(pickIt) };
    return { q: 'Which ribbon is the <b>' + (longer ? (k > 2 ? 'longest' : 'longer') : (k > 2 ? 'shortest' : 'shorter')) + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: ribbons(items, { cubes: lv > 1 }),
      hint: 'The ribbons start at the same place. Look at where each one ends.', steps: ['Check: all the ribbons start at the same line.', 'Look at the other ends. ' + (lv > 1 ? 'Count the cubes: ' + items.map(function (i) { return i.name + ' ' + i.n; }).join(', ') + '.' : ''), 'The ' + pickIt.name + ' ribbon is ' + (longer ? 'longest' : 'shortest') + '.'],
      explain: 'The ' + pickIt.name + ' ribbon is ' + pickIt.n + ' cubes long. It is the ' + (longer ? (k > 2 ? 'longest' : 'longer') : (k > 2 ? 'shortest' : 'shorter')) + '.' };
  }
  function qArea(lv) {
    var a = lv === 1 ? R.int(3, 6) : R.int(5, 10), b;
    do { b = lv === 1 ? R.int(7, 12) : a + R.pick([-2, -1, 1, 2]); } while (b === a || b < 2);
    if (lv === 3) {
      var cells = blob(a);
      return { q: 'How many squares does this shape cover?', type: 'num', answer: a, fig: gridShape(cells, '#2f9a4c', 'Green shape'),
        hint: 'Count each coloured square once. Mark them in your head as you go.', steps: ['Start at the top left square.', 'Count across each row, then go to the next row.', 'The shape covers ' + a + ' squares.'], explain: 'The shape covers ' + a + ' squares. That is its area.' };
    }
    var more = R.int(0, 1), pick = more ? (a > b ? 'red' : 'blue') : (a < b ? 'red' : 'blue');
    return { q: 'Which shape covers <b>' + (more ? 'more' : 'less') + '</b> space?', type: 'mc', options: ['red', 'blue'], answer: pick === 'red' ? 0 : 1,
      fig: '<div class="vrow"><figure>' + gridShape(blob(a), '#e04b3a', 'Red shape') + '<figcaption>red</figcaption></figure><figure>' + gridShape(blob(b), '#2c68cf', 'Blue shape') + '<figcaption>blue</figcaption></figure></div>',
      hint: 'Count the squares in each shape.', steps: ['Count the red squares: ' + a + '.', 'Count the blue squares: ' + b + '.', pick.charAt(0).toUpperCase() + pick.slice(1) + ' covers ' + (more ? 'more' : 'less') + '.'], explain: 'Red covers ' + a + ' squares and blue covers ' + b + '. The ' + pick + ' shape covers ' + (more ? 'more' : 'less') + '.' };
  }
  function qMass(lv) {
    var p = R.shuffle(HEAVY.slice()).slice(0, 3).sort(function (x, y) { return HEAVY.indexOf(x) - HEAVY.indexOf(y); });
    if (lv < 3) {
      var a = p[0], b = p[2], flip = R.int(0, 1), L = flip ? b : a, Rr = flip ? a : b, heavy = flip ? 'L' : 'R', askH = lv === 1 ? 1 : R.int(0, 1);
      var ans = askH ? (heavy === 'L' ? L : Rr) : (heavy === 'L' ? Rr : L);
      return { q: 'Look at the balance. Which is <b>' + (askH ? 'heavier' : 'lighter') + '</b>?', type: 'mc', options: [OBJ[L].n, OBJ[Rr].n], answer: ans === L ? 0 : 1, fig: scale(L, Rr, heavy),
        hint: 'The heavier side goes down.', steps: ['Look at which side of the balance is lower.', 'The lower side has the heavier object.', 'The ' + OBJ[ans].n + ' is ' + (askH ? 'heavier' : 'lighter') + '.'], explain: 'The balance goes down on the ' + OBJ[heavy === 'L' ? L : Rr].n + ' side, so the ' + OBJ[heavy === 'L' ? L : Rr].n + ' is heavier.' };
    }
    var f = '<div class="vrow"><figure>' + scale(p[1], p[0], 'L') + '</figure><figure>' + scale(p[2], p[1], 'L') + '</figure></div>';
    return { q: 'Look at both balances. Which is the <b>heaviest</b>?', type: 'mc', options: R.shuffle(p.map(function (k) { return OBJ[k].n; })), answer: -1, fig: f, _h: OBJ[p[2]].n,
      hint: 'The ' + OBJ[p[1]].n + ' is in both pictures. What is heavier than it?', steps: ['First balance: the ' + OBJ[p[1]].n + ' is heavier than the ' + OBJ[p[0]].n + '.', 'Second balance: the ' + OBJ[p[2]].n + ' is heavier than the ' + OBJ[p[1]].n + '.', 'So the ' + OBJ[p[2]].n + ' is the heaviest.'], explain: 'Order from heaviest: ' + OBJ[p[2]].n + ', ' + OBJ[p[1]].n + ', ' + OBJ[p[0]].n + '.' };
  }
  function fixMass(q) { if (q.answer === -1) { q.answer = q.options.indexOf(q._h); delete q._h; } return q; }
  function qCap(lv) {
    var names = R.shuffle(['A', 'B', 'C']), k = lv === 3 ? 3 : 2, cups = R.shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, k);
    var list = cups.map(function (c, i) { return { cups: c, name: names[i] }; }).sort(function (x, y) { return x.name < y.name ? -1 : 1; });
    if (lv === 1 && R.int(0, 1)) return { q: 'Each blue band is one cup of water. How many cups does jug ' + list[0].name + ' hold?', type: 'num', answer: list[0].cups, fig: jugs([list[0]]),
      hint: 'Count the blue bands from the bottom up.', steps: ['Each band is one cup.', 'Count from the bottom: ' + Array.apply(null, Array(list[0].cups)).map(function (_, i) { return i + 1; }).join(', ') + '.', 'Jug ' + list[0].name + ' holds ' + list[0].cups + ' cups.'], explain: 'Jug ' + list[0].name + ' holds ' + list[0].cups + ' cups.' };
    var more = R.int(0, 1), best = list.slice().sort(function (x, y) { return more ? y.cups - x.cups : x.cups - y.cups; })[0];
    return { q: 'Each blue band is one cup of water. Which jug holds the <b>' + (more ? 'most' : 'least') + '</b>?', type: 'mc', options: list.map(function (l) { return 'Jug ' + l.name; }), answer: list.indexOf(best), fig: jugs(list),
      hint: 'Count the cups in each jug.', steps: ['Count the cups: ' + list.map(function (l) { return l.name + ' holds ' + l.cups; }).join(', ') + '.', 'Find the ' + (more ? 'biggest' : 'smallest') + ' number.', 'Jug ' + best.name + ' holds the ' + (more ? 'most' : 'least') + '.'], explain: 'Jug ' + best.name + ' holds ' + best.cups + ' cups, the ' + (more ? 'most' : 'least') + '.' };
  }
  function qCal(lv) {
    if (lv === 1) {
      var t = R.pick(['after', 'before']), i = R.int(0, 6), ans = DAYS[(i + (t === 'after' ? 1 : 6)) % 7];
      var o = R.mc(ans, R.shuffle(DAYS.filter(function (d) { return d !== ans && d !== DAYS[i]; })).slice(0, 2));
      return { q: 'What day comes <b>' + t + '</b> ' + DAYS[i] + '?', type: 'mc', options: o.options, answer: o.answer,
        hint: 'Say the days of the week in order: Sunday, Monday, Tuesday...', steps: ['Say the days in order: ' + DAYS.join(', ') + '.', 'Find ' + DAYS[i] + '.', 'The day ' + t + ' it is ' + ans + '.'], explain: ans + ' comes ' + t + ' ' + DAYS[i] + '.' };
    }
    if (lv === 2) {
      var kind = R.pick(['month', 'season', 'count']);
      if (kind === 'count') { var w = R.pick([['days in a week', 7], ['months in a year', 12], ['seasons in a year', 4]]); return { q: 'How many ' + w[0] + '?', type: 'num', answer: w[1], hint: 'Say them in order and count.', steps: ['Say them in order.', 'Count as you go.', 'There are ' + w[1] + ' ' + w[0] + '.'], explain: 'There are ' + w[1] + ' ' + w[0] + '.' }; }
      if (kind === 'month') { var m = R.int(0, 11), ans2 = MONTHS[(m + 1) % 12], o2 = R.mc(ans2, R.shuffle(MONTHS.filter(function (x) { return x !== ans2 && x !== MONTHS[m]; })).slice(0, 2)); return { q: 'What month comes after <b>' + MONTHS[m] + '</b>?', type: 'mc', options: o2.options, answer: o2.answer, hint: 'Say the months in order, starting with January.', steps: ['Say the months: January, February, March...', 'Find ' + MONTHS[m] + '.', 'Next comes ' + ans2 + '.'], explain: ans2 + ' comes after ' + MONTHS[m] + '.' }; }
      var ev = R.pick([['snow falls and we build snowmen', 'winter'], ['leaves change colour and fall off the trees', 'fall'], ['flowers start to grow and the snow melts', 'spring'], ['it is hot and school is out', 'summer']]);
      var o3 = R.mc(ev[1], ['winter', 'spring', 'summer', 'fall'].filter(function (x) { return x !== ev[1]; }));
      return { q: 'In Ontario, which season is it when ' + ev[0] + '?', type: 'mc', options: o3.options, answer: o3.answer, hint: 'The seasons go winter, spring, summer, fall.', steps: ['Think about the weather in each season.', 'Which season matches: ' + ev[0] + '?', 'It is ' + ev[1] + '.'], explain: 'In Ontario, ' + ev[0] + ' in ' + ev[1] + '.' };
    }
    var yr = YR, mo = R.int(0, 11), first = new Date(yr, mo, 1).getDay(), days = new Date(yr, mo + 1, 0).getDate(), d = R.int(2, days);
    var dayName = DAYS[(first + d - 1) % 7], o4 = R.mc(dayName, R.shuffle(DAYS.filter(function (x) { return x !== dayName; })).slice(0, 2));
    return { q: 'Look at the calendar. What day of the week is <b>' + MONTHS[mo] + ' ' + d + '</b>?', type: 'mc', options: o4.options, answer: o4.answer, fig: calendar(yr, mo),
      hint: 'Find ' + d + ' on the calendar. Look up to the top of its column.', steps: ['Find the number ' + d + '.', 'Go straight up its column to the day name at the top.', MONTHS[mo] + ' ' + d + ' is a ' + dayName + '.'], explain: MONTHS[mo] + ' ' + d + ', ' + yr + ' is a ' + dayName + '.' };
  }

  var CH = 'measuring';
  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters[CH].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  /* "Try it": measure a pencil with cubes. Tap + to add a cube under it. */
  function cubeTrain(len) {
    return { do: 'Measure the pencil with cubes. Add cubes until the train is <b>as long as the pencil</b>, end to end.', mount: function (host, done) {
      var n = 0, u = 30;
      function draw() {
        var s = '<line x1="10" y1="6" x2="10" y2="96" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="4 4"/>' +
          '<path d="M10 22H' + (10 + len * u - 16) + 'L' + (10 + len * u) + ' 32L' + (10 + len * u - 16) + ' 42H10Z" style="fill:#f2bd24" stroke="rgba(0,0,0,.45)" stroke-width="2"/>';
        for (var i = 0; i < n; i++) s += '<rect x="' + (11 + i * u) + '" y="58" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="4" style="fill:var(--p1)" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/>';
        A.$('.fig', host).innerHTML = A.svg(Math.max(len, n) * u + 30, 100, s, 'A pencil and a train of ' + n + ' cubes');
        A.$('.mp-read', host).innerHTML = '<p>Cubes: <span class="mp-num">' + n + '</span></p>';
        if (n === len) done('The pencil is ' + len + ' cubes long.');
      }
      host.innerHTML = '<div class="mp-acts"><button type="button" class="mp-act" data-a="-">&minus; 1 cube</button><button type="button" class="mp-act" data-a="+">+ 1 cube</button></div><div class="fig g1-frame"></div><div class="mp-read" aria-live="polite"></div>';
      A.$('.mp-acts', host).addEventListener('click', function (e) { var b = e.target.closest('.mp-act'); if (!b) return; n = Math.max(0, Math.min(12, n + (b.getAttribute('data-a') === '+' ? 1 : -1))); draw(); });
      draw();
    } };
  }
  /* "Try it": tap squares on a grid to cover them */
  function cover(goal) {
    return { do: 'Make a shape that covers <b>' + goal + ' squares</b>. Tap squares to colour them.', mount: function (host, done) {
      var on = {};
      function draw() {
        var k = Object.keys(on).length, h = '<div class="g1-grid">';
        for (var i = 0; i < 24; i++) h += '<button type="button" data-i="' + i + '" class="' + (on[i] ? 'on' : '') + '" aria-pressed="' + !!on[i] + '" aria-label="Square ' + (i + 1) + '"></button>';
        host.innerHTML = h + '</div><div class="mp-read" aria-live="polite"><p>Squares covered: <span class="mp-num">' + k + '</span></p></div>';
        if (k === goal) done('Your shape covers ' + goal + ' squares. That is its area.');
      }
      host.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (!b) return; var i = b.getAttribute('data-i'); if (on[i]) delete on[i]; else on[i] = 1; draw(); });
      draw();
    } };
  }

  var LESSONS = [
    { id: 'what', title: 'What can we measure?', sub: 'Length, area, mass and capacity.', concepts: [
      { id: 'attr', title: 'Four things to measure', exp: ['E2.1'], skill: 'm-attr',
        body: '<p>We can measure different things about the same object. <b>Length</b>: how long. <b>Area</b>: how much it covers. <b>Mass</b>: how heavy. <b>Capacity</b>: how much it holds.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: '<b>Length</b>: how long is the ribbon?', act: function (t) { return t.show(ribbons([{ n: 6, c: COLS[0], name: 'ribbon' }])); }, ms: 1300 },
          { say: '<b>Area</b>: how much of the table does it cover?', act: function (t) { return t.show(gridShape([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], '#2f9a4c', 'A mat')); }, ms: 1300 },
          { say: '<b>Mass</b>: how heavy is it?', act: function (t) { return t.show(scale('rock', 'feather', 'L')); }, ms: 1300 },
          { say: '<b>Capacity</b>: how much does it hold?', act: function (t) { return t.show(jugs([{ cups: 5, name: 'jug' }])); }, ms: 1500 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. "How long is the bench?" I ask: is it about long, covers, heavy or holds?', act: function (t) { return t.show(ribbons([{ n: 5, c: COLS[2], name: 'bench' }])); }, ms: 1900 },
          { say: 'It asks how long. So we measure <b>length</b>.', ms: 1400 },
          { say: '"How much juice fits in the cup?" It asks what the cup holds.', act: function (t) { return t.show(jugs([{ cups: 3, name: 'cup' }])); }, ms: 1700 },
          { say: 'Holds means <b>capacity</b>. Long, covers, heavy, holds: length, area, mass, capacity.', ms: 2000 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: 'l', html: '<span>Length</span>' }, { id: 'a', html: '<span>Area</span>' }, { id: 'm', html: '<span>Mass</span>' }, { id: 'c', html: '<span>Capacity</span>' }] }, tasks: [
          { do: '"How much water fits in the bathtub?" What are we measuring?', goal: function (s) { return s.picked[0] === 'c'; }, yes: 'How much it holds is capacity.' },
          { do: '"Which backpack is heavier?" What are we measuring?', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'm'; }, yes: 'How heavy is mass.' }
        ] },
        key: '<p>Length, area, mass, capacity: <b>long, covers, heavy, holds</b>.</p>',
        check: [P('m-attr', 1), P('m-attr', 2)] }
    ] },

    { id: 'length', title: 'Longer and shorter', sub: 'Line up the ends.', concepts: [
      { id: 'line-up', title: 'Line up the ends', exp: ['E2.2'], skill: 'm-length', hard: true,
        body: '<p>To compare length, line up the <b>ends</b> on the same starting line. Then look at the other ends.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Which ribbon is longer? The ends are not lined up.', act: function (t) { return t.show(ribbons([{ n: 5, c: COLS[0], name: 'red', off: 3 }, { n: 7, c: COLS[1], name: 'blue' }])); }, ms: 1800 },
          { say: 'The red one looks longer. But is it?', ms: 1300 },
          { say: 'Line up the ends. Now we can see: <b>blue is longer</b>.', act: function (t) { return t.show(ribbons([{ n: 5, c: COLS[0], name: 'red' }, { n: 7, c: COLS[1], name: 'blue' }])); }, ms: 2000 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. Which ribbon is longer? The ends are not lined up.', act: function (t) { return t.show(ribbons([{ n: 4, c: COLS[2], name: 'green', off: 3 }, { n: 6, c: COLS[3], name: 'purple' }])); }, ms: 1800 },
          { say: 'Green sticks out further. But it starts further along, so I cannot tell yet.', ms: 1700 },
          { say: 'I line up the starts at the dashed line.', act: function (t) { return t.show(ribbons([{ n: 4, c: COLS[2], name: 'green' }, { n: 6, c: COLS[3], name: 'purple' }])); }, ms: 1500 },
          { say: 'Now I compare the ends. <b>Purple is longer</b>.', ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, cols: 1, items: [{ id: 'g', html: ribbons([{ n: 6, c: COLS[2], name: 'green' }]) }, { id: 'p', html: ribbons([{ n: 8, c: COLS[3], name: 'purple' }]) }, { id: 'o', html: ribbons([{ n: 4, c: COLS[4], name: 'orange' }]) }] }, tasks: [
          { do: 'All the ribbons start at the dashed line. Tap the <b>longest</b>.', goal: function (s) { return s.picked[0] === 'p'; }, yes: 'Purple reaches furthest, so it is longest.' }
        ] },
        ways: [{ label: 'Try with string', html: '<p>Cut two pieces of string. Hold the ends together in one hand and pull both straight. The one that sticks out further is longer.</p>' }],
        mistake: '<p>Judging length by where the ends finish when the starts are not lined up. Always line up the start.</p>',
        key: '<p>Line up the <b>start</b>. Then compare the <b>end</b>.</p>',
        check: [P('m-length', 1), P('m-length', 2)] },
      { id: 'cubes', title: 'Measure with cubes', exp: ['E2.2'], skill: 'm-length',
        body: '<p>We can measure length by counting cubes laid <b>end to end</b>, with no gaps.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'How long is the red ribbon? Lay cubes under it.', act: function (t) { return t.show(ribbons([{ n: 7, c: COLS[0], name: 'red' }])); }, ms: 1300 },
          { say: 'End to end, no gaps: 7 cubes.', act: function (t) { return t.show(ribbons([{ n: 7, c: COLS[0], name: 'red' }], { cubes: true })); }, ms: 1500 },
          { say: 'The ribbon is <b>7 cubes long</b>.', ms: 1600 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. How long is the blue ribbon?', act: function (t) { return t.show(ribbons([{ n: 5, c: COLS[1], name: 'blue' }])); }, ms: 1300 },
          { say: 'I lay cubes under it, end to end, with no gaps: 1, 2, 3, 4, 5.', act: function (t) { return t.show(ribbons([{ n: 5, c: COLS[1], name: 'blue' }], { cubes: true })); }, ms: 1800 },
          { say: 'The ribbon is <b>5 cubes long</b>.', ms: 1700 }
        ] },
        try: cubeTrain(6),
        key: '<p>Cubes go <b>end to end</b>, with no gaps and no overlaps.</p>',
        check: [P('m-length', 2), P('m-length', 3)] }
    ] },

    { id: 'area', title: 'Covers more, covers less', sub: 'Count the squares.', concepts: [
      { id: 'squares', title: 'Count the squares', exp: ['E2.2'], skill: 'm-area',
        body: '<p><b>Area</b> is how much space a shape covers. Count the squares to compare. More squares means it <b>covers more</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Red covers 5 squares.', act: function (t) { return t.show(gridShape([[0, 0], [1, 0], [2, 0], [3, 0], [0, 1]], '#e04b3a', 'Red shape')); }, ms: 1400 },
          { say: 'Blue covers 6 squares.', act: function (t) { return t.show(gridShape([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]], '#2c68cf', 'Blue shape')); }, ms: 1400 },
          { say: '6 is more than 5, so blue <b>covers more</b>, even though red looks longer.', ms: 2000 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. Which covers more? Green is long. I count its squares: 6.', act: function (t) { return t.show(gridShape([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]], '#2f9a4c', 'Green shape')); }, ms: 1800 },
          { say: 'Purple is short. I count its squares: 8.', act: function (t) { return t.show(gridShape([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3], [1, 3]], '#8441bd', 'Purple shape')); }, ms: 1800 },
          { say: '8 is more than 6. Purple <b>covers more</b>, even though green looks longer.', ms: 2000 }
        ] },
        try: cover(6),
        key: '<p>More squares, <b>more area</b>.</p>',
        check: [P('m-area', 1), P('m-area', 2)] }
    ] },

    { id: 'mass', title: 'Heavier and lighter', sub: 'The heavier side goes down.', concepts: [
      { id: 'balance', title: 'Use a balance', exp: ['E2.2'], skill: 'm-mass',
        body: '<p>A <b>balance</b> compares mass. The heavier side goes <b>down</b>. The lighter side goes up.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'An apple and a book.', act: function (t) { return t.show(scale('apple', 'book', '=')); }, ms: 1200 },
          { say: 'The book side goes down. The <b>book is heavier</b>.', act: function (t) { return t.show(scale('apple', 'book', 'R')); }, ms: 1800 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. Which is heavier, the pencil or the apple? I put one on each side.', act: function (t) { return t.show(scale('pencil', 'apple', '=')); }, ms: 1700 },
          { say: 'I let go. The apple side goes down.', act: function (t) { return t.show(scale('pencil', 'apple', 'R')); }, ms: 1500 },
          { say: 'Down is heavier: the <b>apple is heavier</b>. Up is lighter: the pencil is lighter.', ms: 2000 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: 'p', html: OBJ.pumpkin.draw ? A.svg(80, 60, OBJ.pumpkin.draw(40, 30), 'a pumpkin') + '<span>pumpkin</span>' : '' }, { id: 'b', html: A.svg(80, 60, OBJ.ball.draw(40, 30), 'a ball') + '<span>ball</span>' }] }, tasks: [
          { do: 'Look at the balance. Which is <b>heavier</b>?<div class="fig">' + scale('ball', 'pumpkin', 'R') + '</div>', goal: function (s) { return s.picked[0] === 'p'; }, yes: 'The pumpkin side is down, so the pumpkin is heavier.' }
        ] },
        key: '<p>Down is <b>heavier</b>. Up is <b>lighter</b>.</p>',
        check: [P('m-mass', 1), P('m-mass', 2)] },
      { id: 'big', title: 'Bigger is not always heavier', exp: ['E2.2'], skill: 'm-mass', hard: true,
        body: '<p>A big pillow can be lighter than a small rock. You cannot tell mass just by looking at size.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'A big ball and a small rock.', act: function (t) { return t.show(scale('ball', 'rock', '=')); }, ms: 1300 },
          { say: 'The rock side goes down. The small rock is <b>heavier</b>.', act: function (t) { return t.show(scale('ball', 'rock', 'R')); }, ms: 2000 }
        ] },
        ways: [{ label: 'Hold them', html: '<p>Hold one thing in each hand. Which hand is pulled down more? Try a pillow and a can of soup.</p>' }],
        mistake: '<p>Choosing the bigger object as heavier. Let the child feel both in their hands.</p>',
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. The feather looks bigger than the apple. Is it heavier?', act: function (t) { return t.show(scale('feather', 'apple', '=')); }, ms: 1700 },
          { say: 'I do not guess with my eyes. I use the balance.', ms: 1400 },
          { say: 'The apple side goes down. The small apple is <b>heavier</b>.', act: function (t) { return t.show(scale('feather', 'apple', 'R')); }, ms: 1800 }
        ] },
        key: '<p>Use a balance or your hands, <b>not your eyes</b>.</p>',
        check: [P('m-mass', 3), P('m-mass', 2)] }
    ] },

    { id: 'cap', title: 'Holds more, holds less', sub: 'Fill with the same cup.', concepts: [
      { id: 'cups', title: 'Count the cups', exp: ['E2.2'], skill: 'm-cap',
        body: '<p><b>Capacity</b> is how much a container holds. Fill each one with the <b>same cup</b> and count.</p>',
        watch: { tool: 'g1stage', steps: [0, 1, 2, 3, 4, 5, 6, 7].map(function (c) { return { say: c < 7 ? 'Pour in cup ' + (c + 1) + '.' : 'Jug A holds 4 cups. Jug B holds 7. <b>B holds more</b>.', act: function (t) { return t.show(jugs([{ cups: Math.min(c + 1, 4), name: 'A' }, { cups: Math.min(c + 1, 7), name: 'B' }])); }, ms: c === 7 ? 1800 : 500 }; }) },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. Which jug holds more, C or D? I fill both with the same small cup. Cup 1.', act: function (t) { return t.show(jugs([{ cups: 1, name: 'C' }, { cups: 1, name: 'D' }])); }, ms: 1700 },
          { say: 'Cup 2, cup 3. Jug D is full.', act: function (t) { return t.show(jugs([{ cups: 3, name: 'C' }, { cups: 3, name: 'D' }])); }, ms: 1500 },
          { say: 'Jug C still has room. Cup 4, cup 5. Now jug C is full too.', act: function (t) { return t.show(jugs([{ cups: 5, name: 'C' }, { cups: 3, name: 'D' }])); }, ms: 1700 },
          { say: 'C holds 5 cups. D holds 3 cups. <b>C holds more</b>. I used the same size cup for both.', ms: 2000 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: 'a', html: jugs([{ cups: 6, name: 'A' }]) }, { id: 'b', html: jugs([{ cups: 3, name: 'B' }]) }] }, tasks: [
          { do: 'Which holds <b>less</b>?', goal: function (s) { return s.picked[0] === 'b'; }, yes: 'B holds 3 cups. A holds 6. B holds less.' }
        ] },
        key: '<p>Always use the <b>same size cup</b>.</p>',
        check: [P('m-cap', 1), P('m-cap', 2)] }
    ] },

    { id: 'cal', title: 'The calendar', sub: 'Days, months and seasons.', concepts: [
      { id: 'week', title: 'Days of the week', exp: ['E2.3'], skill: 'm-cal',
        body: '<p>A <b>week</b> has 7 days: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday. Then it starts again.</p>',
        watch: { tool: 'g1strip', opts: { tap: false, slots: 7, tray: DAYS.map(function (d) { return { id: d, html: '<b>' + d.slice(0, 3) + '</b>', label: d }; }) }, steps: DAYS.map(function (d, i) { return { say: i === 6 ? 'Saturday. That is 7 days. Then Sunday comes again.' : d + '.', act: function (t) { return t.add(d); }, ms: i === 6 ? 1800 : 450 }; }) },
        example: { tool: 'g1strip', opts: { tap: false, slots: 5, start: ['Wednesday', 'Thursday', 'Friday'], tray: DAYS.map(function (d) { return { id: d, html: '<b>' + d.slice(0, 3) + '</b>', label: d }; }) }, steps: [
          { say: 'My turn. What day comes after Friday? I say the days in order: Wednesday, Thursday, Friday ...', ms: 1900 },
          { say: 'After Friday comes <b>Saturday</b>.', act: function (t) { return t.add('Saturday'); }, ms: 1200 },
          { say: 'Saturday is the last day of the week. Then the week starts again with <b>Sunday</b>.', act: function (t) { return t.add('Sunday'); }, ms: 1800 },
          { say: '7 days make 1 week. Then it starts again.', ms: 1600 }
        ] },
        try: { tool: 'g1strip', opts: { max: 7, tray: R.shuffle(DAYS.slice()).map(function (d) { return { id: d, html: '<b>' + d.slice(0, 3) + '</b>', label: d }; }) }, tasks: [
          { do: 'Put the days in order. Start with <b>Sunday</b>.', goal: function (s) { return s.seq.join() === DAYS.join(); }, yes: 'Sunday to Saturday: 7 days.' }
        ] },
        key: '<p>7 days make <b>1 week</b>.</p>',
        check: [P('m-cal', 1), P('m-cal', 1)] },
      { id: 'months', title: 'Months and seasons', exp: ['E2.3'], skill: 'm-cal',
        body: '<p>A <b>year</b> has 12 months. Canada has 4 seasons: <b>winter, spring, summer, fall</b>.</p>' +
          '<div class="tbl"><table><thead><tr><th class="l">Season</th><th class="l">Months (mostly)</th></tr></thead><tbody><tr><td class="l">Winter</td><td class="l">December, January, February</td></tr><tr><td class="l">Spring</td><td class="l">March, April, May</td></tr><tr><td class="l">Summer</td><td class="l">June, July, August</td></tr><tr><td class="l">Fall</td><td class="l">September, October, November</td></tr></tbody></table></div>',
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. Jay has a birthday in April. Which season is that?', act: function (t) { return t.show('<p class="big">April</p>'); }, ms: 1500 },
          { say: 'I find April in the seasons table. March, April and May are mostly <b>spring</b>.', act: function (t) { return t.show('<p class="big">March, April, May: spring</p>'); }, ms: 1900 },
          { say: 'So the birthday is in spring.', ms: 1300 },
          { say: 'New Year\'s Day is in January. December, January and February are <b>winter</b>. 12 months, 4 seasons.', act: function (t) { return t.show('<p class="big">December, January, February: winter</p>'); }, ms: 2200 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: ['winter', 'spring', 'summer', 'fall'].map(function (k) { return { id: k, html: '<span>' + k + '</span>' }; }) }, tasks: [
          { do: 'Canada Day is <b>July 1</b>. Which season is it?', goal: function (s) { return s.picked[0] === 'summer'; }, yes: 'July is in summer.' },
          { do: 'Halloween is <b>October 31</b>. Which season?', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'fall'; }, yes: 'October is in the fall.' }
        ] },
        key: '<p>12 months, <b>4 seasons</b>.</p>',
        check: [P('m-cal', 2), P('m-cal', 2)] },
      { id: 'read', title: 'Read a calendar', exp: ['E2.3'], skill: 'm-cal',
        body: '<p>To find the day for a date, find the number, then look <b>up its column</b> to the day name at the top.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'What day is July 1, ' + YR + '?', act: function (t) { return t.show(calendar(YR, 6)); }, ms: 1400 },
          { say: 'Find the 1.', act: function (t) { return t.show(calendar(YR, 6, 1)); }, ms: 1200 },
          { say: 'Look up its column: <b>' + dayOf(6, 1) + '</b>. Canada Day ' + YR + ' is on a ' + dayOf(6, 1) + '.', ms: 2000 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. What day is December 25, ' + YR + '?', act: function (t) { return t.show(calendar(YR, 11)); }, ms: 1400 },
          { say: 'I find the 25.', act: function (t) { return t.show(calendar(YR, 11, 25)); }, ms: 1200 },
          { say: 'I look up its column to the top: <b>' + dayOf(11, 25).slice(0, 3) + '</b>. December 25, ' + YR + ' is a <b>' + dayOf(11, 25) + '</b>.', ms: 2000 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: near(10, 11, 2).map(function (d) { return { id: d, html: '<span>' + d + '</span>' }; }) }, tasks: [
          { do: 'Remembrance Day is <b>November 11</b>. What day is it in ' + YR + '?<div class="fig">' + calendar(YR, 10, 11) + '</div>', goal: function (s) { return s.picked[0] === dayOf(10, 11); }, yes: 'November 11, ' + YR + ' is a ' + dayOf(10, 11) + '.' }
        ] },
        key: '<p>Find the date, then look <b>up</b> to the day.</p>',
        check: [P('m-cal', 3), P('m-cal', 3)] }
    ] }
  ];

  A.register('measuring', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>What can we measure?</h2>' +
'<p>We can measure different things about the same object.</p>' +
'<div class="facts"><div>' + A.svg(52, 52, '<rect x="4" y="22" width="44" height="10" rx="3" style="fill:#f2bd24" stroke="rgba(0,0,0,.4)" stroke-width="2"/>', 'a pencil') + '<span><b>Length</b><small>how long or tall</small></span></div>' +
'<div>' + A.svg(52, 52, '<rect x="6" y="6" width="40" height="40" style="fill:#2f9a4c;opacity:.8" stroke="rgba(0,0,0,.4)" stroke-width="2"/><path d="M6 19H46M6 32H46M19 6V46M32 6V46" stroke="rgba(0,0,0,.3)"/>', 'squares covering a space') + '<span><b>Area</b><small>how much space it covers</small></span></div>' +
'<div>' + A.svg(52, 52, '<path d="M8 44Q6 22 22 18Q42 14 46 44Z" style="fill:#8b8f99" stroke="rgba(0,0,0,.5)" stroke-width="2"/>', 'a rock') + '<span><b>Mass</b><small>how heavy</small></span></div>' +
'<div>' + A.svg(52, 52, '<path d="M10 8V46H42V8" fill="none" stroke="var(--ink)" stroke-width="3"/><rect x="12" y="22" width="28" height="22" style="fill:#5aa9e6"/>', 'a jug of water') + '<span><b>Capacity</b><small>how much it holds</small></span></div>' +
'<div>' + A.svg(52, 52, '<path d="M8 44H46M8 44V8" fill="none" stroke="var(--ink)" stroke-width="4"/><rect x="8" y="34" width="10" height="10" fill="none" stroke="var(--accent)" stroke-width="2"/>', 'a square corner') + '<span><b>Angle</b><small>how wide a corner or turn is</small></span></div></div>' +
'<div class="eg"><b class="t">Watch me</b><p>A book has a length (how long it is), an area (how much of the desk it covers), and a mass (how heavy it is). Its corners are square corners.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Longer and shorter</h2>' +
'<p>To compare length, line up the <b>ends</b> on the same starting line. Then look at the other ends.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + ribbons([{ n: 7, c: COLS[0], name: 'red' }, { n: 5, c: COLS[1], name: 'blue' }], { cubes: true }) + '</div><p>Both ribbons start at the line. The red one goes further. Red is 7 cubes. Blue is 5 cubes. Red is <b>longer</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>If the ends are not lined up, a short ribbon can <b>look</b> longer. Always line up the start.</p><div class="fig">' + ribbons([{ n: 5, c: COLS[1], name: 'blue', off: 3 }, { n: 7, c: COLS[0], name: 'red' }]) + '</div></div>' +
'<div class="lab"><span class="lt">Try it: compare two ribbons</span><div class="row2">' + A.stepHtml('rb1', 'Red ribbon (cubes)', 6) + A.stepHtml('rb2', 'Blue ribbon (cubes)', 4) + '</div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="rbline" aria-pressed="true">Ends lined up: yes</button></div>' +
'<div class="fig" id="rbfig"></div><div class="out" id="rbout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Covers more, covers less</h2>' +
'<p><b>Area</b> is how much space a shape covers. Count the squares to compare.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="vrow"><figure>' + gridShape([[0, 0], [1, 0], [2, 0], [3, 0], [0, 1]], '#e04b3a', 'Red shape') + '<figcaption>red: 5 squares</figcaption></figure><figure>' + gridShape([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]], '#2c68cf', 'Blue shape') + '<figcaption>blue: 6 squares</figcaption></figure></div><p>Red covers 5 squares. Blue covers 6 squares. Blue covers <b>more</b>, even though red is longer.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Heavier and lighter</h2>' +
'<p>A <b>balance</b> compares mass. The heavier side goes <b>down</b>. The lighter side goes up.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + scale('rock', 'feather', 'L') + '</div><p>The rock side is down. The rock is <b>heavier</b>. The feather is lighter.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><div class="vrow"><figure>' + scale('book', 'apple', 'L') + '</figure><figure>' + scale('pumpkin', 'book', 'L') + '</figure></div><ol><li>The book is heavier than the apple.</li><li>The pumpkin is heavier than the book.</li><li>So from heaviest to lightest: <b>pumpkin, book, apple</b>.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Bigger is not always heavier. A big pillow can be lighter than a small rock.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Holds more, holds less</h2>' +
'<p><b>Capacity</b> is how much a container holds. To compare, fill each one with the same cup and count.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + jugs([{ cups: 4, name: 'A' }, { cups: 7, name: 'B' }]) + '</div><p>Jug A holds 4 cups. Jug B holds 7 cups. Jug B <b>holds more</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Always use the same size cup. If the cups are different sizes, the counts do not compare fairly.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>The calendar</h2>' +
'<p>A <b>week</b> has 7 days. A <b>year</b> has 12 months. Canada has 4 seasons: winter, spring, summer and fall.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Season</th><th class="l">Months (mostly)</th></tr></thead><tbody><tr><td class="l">Winter</td><td class="l">December, January, February</td></tr><tr><td class="l">Spring</td><td class="l">March, April, May</td></tr><tr><td class="l">Summer</td><td class="l">June, July, August</td></tr><tr><td class="l">Fall</td><td class="l">September, October, November</td></tr></tbody></table></div>' +
'<p>Some special days: New Year\'s Day is January 1. Canada Day is July 1. Remembrance Day is November 11.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + calendar(YR, 6, 1) + '</div><p>To find what day July 1 is, I find the 1 and look up its column. It says ' + dayOf(6, 1).slice(0, 3) + '. Canada Day ' + YR + ' is on a <b>' + dayOf(6, 1) + '</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: read a calendar</span><div class="ctrl"><label for="calm">Month<select id="calm">' + MONTHS.map(function (m, i) { return '<option value="' + i + '"' + (i === 9 ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select></label></div>' + A.stepHtml('cald', 'Date', 31) +
'<div class="fig" id="calfig"></div><div class="out" id="calout"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$, ra = 6, rb = 4, lined = true;
      function rib() {
        var items = [{ n: ra, c: COLS[0], name: 'red' }, { n: rb, c: COLS[1], name: 'blue', off: lined ? 0 : 3 }];
        $('#rbfig', root).innerHTML = ribbons(items, { cubes: lined });
        $('#rbout', root).innerHTML = lined ? (ra === rb ? 'They are the <b>same length</b>: ' + ra + ' cubes.' : 'The <b>' + (ra > rb ? 'red' : 'blue') + '</b> ribbon is longer, by ' + Math.abs(ra - rb) + ' cube' + (Math.abs(ra - rb) > 1 ? 's' : '') + '.') : 'The ends are not lined up, so you cannot tell by looking. Line them up first.';
      }
      A.stepper(root, 'rb1', 1, 10, function (n) { ra = n; rib(); });
      A.stepper(root, 'rb2', 1, 10, function (n) { rb = n; rib(); });
      $('#rbline', root).addEventListener('click', function () { lined = !lined; this.setAttribute('aria-pressed', String(lined)); this.textContent = 'Ends lined up: ' + (lined ? 'yes' : 'no'); rib(); });
      var cd;
      function cal() {
        var m = +$('#calm', root).value, days = new Date(YR, m + 1, 0).getDate();
        if (cd && cd.get() > days) { cd.set(days); return; }
        var d = cd ? cd.get() : 31, wd = dayOf(m, d);
        $('#calfig', root).innerHTML = calendar(YR, m, d);
        $('#calout', root).innerHTML = '<b>' + MONTHS[m] + ' ' + d + ', ' + YR + '</b> is a <b>' + wd + '</b>. ' + MONTHS[m] + ' has ' + days + ' days. It is in ' + SEASON[m] + ' (mostly).';
      }
      cd = A.stepper(root, 'cald', 1, 31, function () { cal(); });
      $('#calm', root).addEventListener('change', cal);
      cal();
    },

    checks: [
      [function () { return qAttr(1); }, function () { return qAttr(1); }, function () { return qAttr(2); }],
      [function () { return qLength(1); }, function () { return qLength(2); }, function () { return qLength(2); }],
      [function () { return qArea(1); }, function () { return qArea(2); }, function () { return qArea(3); }],
      [function () { return fixMass(qMass(1)); }, function () { return fixMass(qMass(2)); }, function () { return fixMass(qMass(3)); }],
      [function () { return qCap(1); }, function () { return qCap(2); }, function () { return qCap(2); }],
      [function () { return qCal(1); }, function () { return qCal(2); }, function () { return qCal(3); }]
    ],

    quiz: [
      { q: 'Which jug <b>holds more</b> water? What are we measuring?', type: 'mc', options: ['length', 'mass', 'capacity', 'area'], answer: 2,
        hint: 'Holding is about how much fits inside.', explain: 'How much a container holds is its capacity.' },
      { q: 'Which ribbon is the <b>longest</b>?', type: 'mc', options: ['red', 'blue', 'green'], answer: 2, fig: ribbons([{ n: 6, c: COLS[0], name: 'red' }, { n: 4, c: COLS[1], name: 'blue' }, { n: 8, c: COLS[2], name: 'green' }], { cubes: true }),
        hint: 'The ends are lined up. Which goes furthest?', explain: 'Green is 8 cubes, the longest.' },
      { q: 'How many squares does this shape cover?', type: 'num', answer: 7, fig: gridShape([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, 2]], '#2f9a4c', 'Green shape'),
        hint: 'Count row by row.', explain: '3 + 3 + 1 = 7 squares.' },
      { q: 'Look at the balance. Which is <b>heavier</b>?', type: 'mc', options: ['pencil', 'book'], answer: 1, fig: scale('pencil', 'book', 'R'),
        hint: 'The heavier side goes down.', explain: 'The book side is down, so the book is heavier.' },
      { q: 'Each blue band is one cup. Which jug holds the <b>least</b>?', type: 'mc', options: ['Jug A', 'Jug B', 'Jug C'], answer: 1, fig: jugs([{ cups: 5, name: 'A' }, { cups: 3, name: 'B' }, { cups: 6, name: 'C' }]),
        hint: 'Count the cups in each jug.', explain: 'A holds 5, B holds 3, C holds 6. B holds the least.' },
      { q: 'What month comes after <b>April</b>?', type: 'mc', options: ['March', 'May', 'June'], answer: 1,
        hint: 'January, February, March, April...', explain: 'May comes after April.' },
      { q: 'Look at the calendar. What day of the week is <b>November 11</b>?', type: 'mc', options: near(10, 11, 1), answer: 1, fig: calendar(YR, 10, 0),
        hint: 'Find 11 and look up its column.', explain: 'Remembrance Day, November 11, ' + YR + ', is a ' + dayOf(10, 11) + '.' }
    ],

    practice: [
      { id: 'm-attr', name: 'What are we measuring?', code: 'E2.1', gen: qAttr },
      { id: 'm-length', name: 'Longer and shorter', code: 'E2.2', gen: qLength },
      { id: 'm-area', name: 'Covers more', code: 'E2.2', gen: qArea },
      { id: 'm-mass', name: 'Heavier and lighter', code: 'E2.2', gen: function (lv) { return fixMass(qMass(lv)); } },
      { id: 'm-cap', name: 'Holds more', code: 'E2.2', gen: qCap },
      { id: 'm-cal', name: 'The calendar', code: 'E2.3', gen: qCal }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ---------- */
  var G = window.G1, nm = A.Q ? A.Q.name : function () { return 'Ava'; };
  var ASK = [['Which bag is heavier?', 'mass'], ['Which pencil is longer?', 'length'], ['Which jug holds more water?', 'capacity'], ['Which rug covers more floor?', 'area'],
    ['How tall is the door?', 'length'], ['How much juice fits in the bottle?', 'capacity'], ['Which watermelon weighs the most?', 'mass'], ['How much of the table does the placemat cover?', 'area']];
  var COLNAME = ['red', 'blue', 'green', 'purple'];
  function someRibbons(k, lv) {
    var ns = R.shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, k), names = R.shuffle(COLNAME).slice(0, k);
    return ns.map(function (n, i) { return { n: n, c: COLS[COLNAME.indexOf(names[i])], name: names[i] }; });
  }
  function sizes(k, lo, hi) { var v = []; while (v.length < k) { var x = R.int(lo, hi); if (v.indexOf(x) < 0) v.push(x); } return v; }
  var SHAPES = {
    'm-attr': [
      [1, 'match', function () {
        var byKind = {}; R.shuffle(ASK).forEach(function (a) { if (!byKind[a[1]]) byKind[a[1]] = a; });
        var list = R.shuffle(Object.keys(byKind)).slice(0, 3).map(function (k) { return byKind[k]; });
        return { q: 'What does each question measure? Match them.', type: 'match', pairs: list.map(function (a) { return [a[0], a[1]]; }),
          hint: 'Heavy is mass. Long or tall is length. Holds is capacity. Covers is area.', steps: ['Look for the measuring word in each question.'],
          explain: list.map(function (a) { return '"' + a[0] + '" is about ' + a[1]; }).join('. ') + '.', meta: { k: 'g1-attr-match' } };
      }],
      [1, 'pick', function () {
        var want = R.pick(['length', 'mass', 'capacity', 'area']), good = R.shuffle(ASK.filter(function (a) { return a[1] === want; })), bad = R.shuffle(ASK.filter(function (a) { return a[1] !== want; })).slice(0, 2), all = R.shuffle(good.concat(bad));
        var ans = []; all.forEach(function (a, j) { if (a[1] === want) ans.push(j); });
        return { q: 'Pick every question about <b>' + want + '</b>.', type: 'pick', options: all.map(function (a) { return a[0]; }), answer: ans,
          hint: { length: 'Length is how long or tall.', mass: 'Mass is how heavy.', capacity: 'Capacity is how much it holds.', area: 'Area is how much it covers.' }[want], steps: ['Look for the measuring word in each question.'],
          explain: ans.map(function (j) { return '"' + all[j][0] + '"'; }).join(' and ') + ' ' + (ans.length > 1 ? 'are' : 'is') + ' about ' + want + '.', meta: { k: 'g1-attr-pick' } };
      }],
      [2, 'mistake', function () {
        var a = R.pick(ASK), who = nm(), truth = !R.int(0, 2), said = truth ? a[1] : R.pick(['length', 'mass', 'capacity', 'area'].filter(function (x) { return x !== a[1]; }));
        var right = '"' + a[0] + '" is about ' + a[1] + '.';
        return G.tf(who + ' says "' + a[0] + '" is about <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['Every question is about length.', 'Big things are always about mass.', 'Capacity and area are the same.'], { k: 'g1-attr-tf' },
          { hint: 'Find the measuring word.' });
      }]
    ],
    'm-length': [
      [1, 'tap', function (lv) {
        var items = someRibbons(lv === 1 ? 2 : 3), longest = R.int(0, 1), best = items.slice().sort(function (a, b) { return longest ? b.n - a.n : a.n - b.n; })[0];
        return { q: 'Tap the <b>' + (longest ? 'longest' : 'shortest') + '</b> ribbon.', type: 'tap', tiles: items.map(function (it) { return ribbons([{ n: it.n, c: it.c, name: it.name }], { label: 'The ' + it.name + ' ribbon' }); }), answer: items.indexOf(best), answerText: 'the ' + best.name + ' ribbon',
          hint: 'The ribbons all start at the dashed line. Which one ends ' + (longest ? 'furthest' : 'soonest') + '?', steps: ['Line up the ends. Compare where they stop.'],
          explain: 'The ' + best.name + ' ribbon is the ' + (longest ? 'longest' : 'shortest') + '.', meta: { k: 'g1-len-tap' } };
      }],
      [1, 'line', function (lv) {
        var it = someRibbons(1)[0];
        return { q: 'How many cubes long is the ' + it.name + ' ribbon? Put the marker on that number.', type: 'line', min: 0, max: 10, tick: 1, every: 1, snap: 1, answer: it.n, fig: ribbons([it], { cubes: true }),
          hint: 'Count the cubes under the ribbon.', steps: ['Count the cubes: ' + it.n + '.'],
          explain: 'The ribbon is ' + it.n + ' cubes long.', meta: { k: 'g1-len-line' } };
      }],
      [2, 'order', function (lv) {
        var items = someRibbons(3), sorted = items.slice().sort(function (a, b) { return a.n - b.n; });
        return { q: 'Put the ribbons in order from <b>shortest to longest</b>.', type: 'order', items: sorted.map(function (it) { return it.name; }), first: 'shortest', last: 'longest', fig: ribbons(items, { cubes: lv === 2 }),
          hint: 'They all start at the dashed line. Compare where they end.', steps: ['The shortest is ' + sorted[0].name + '.'],
          explain: sorted.map(function (it) { return it.name + ' (' + it.n + ')'; }).join(', ') + '.', meta: { k: 'g1-len-order' } };
      }],
      [2, 'mistake', function () {
        var a = R.int(4, 6), b = a + R.int(1, 2), names = R.shuffle(COLNAME).slice(0, 2), who = nm();
        var items = [{ n: a, c: COLS[COLNAME.indexOf(names[0])], name: names[0], off: 3 }, { n: b, c: COLS[COLNAME.indexOf(names[1])], name: names[1], off: 0 }];
        var right = 'The ' + names[1] + ' ribbon is longer. It is ' + b + ' cubes long, and the ' + names[0] + ' one is ' + a + '. The ' + names[0] + ' one just starts further along.';
        return G.tf('The ribbons do not start at the same place. ' + who + ' says the <b>' + names[0] + '</b> ribbon is longer because it reaches further. True or false: ' + who + ' is right.', false, right,
          ['The ribbon that reaches further is always longer.', 'Ribbons that start later are longer.', 'You cannot compare ribbons.'], { k: 'g1-len-tf' },
          { fig: ribbons(items, { cubes: true }), hint: 'Count the cubes under each ribbon.' });
      }]
    ],
    'm-area': [
      [1, 'tap', function (lv) {
        var ns = sizes(3, 3, lv === 1 ? 10 : 9), more = R.int(0, 1), ans = more ? Math.max.apply(null, ns) : Math.min.apply(null, ns), cols = ['#e04b3a', '#2c68cf', '#2f9a4c'];
        return { q: 'Tap the shape that covers the <b>' + (more ? 'most' : 'fewest') + '</b> squares.', type: 'tap', tiles: ns.map(function (n, i) { return gridShape(blob(n), cols[i], 'A shape'); }), answer: ns.indexOf(ans), answerText: 'the shape with ' + ans + ' squares',
          hint: 'Count the coloured squares in each shape.', steps: ['Count each shape: ' + ns.join(', ') + '.'],
          explain: 'That shape covers ' + ans + ' squares.', meta: { k: 'g1-area-tap' } };
      }],
      [1, 'mistake', function (lv) {
        var a = R.int(4, 6), b = a + R.int(2, 3), who = nm();
        var long = []; for (var i = 0; i < a; i++) long.push([i, 0]);
        var tall = []; for (var j = 0; j < b; j++) tall.push([j % 3, Math.floor(j / 3)]);
        var right = 'Count the squares: the red shape covers ' + a + ' and the blue shape covers ' + b + '. Blue covers more.';
        return G.tf(who + ' says the <b>red</b> shape covers more because it is longer. True or false: ' + who + ' is right.', false, right,
          ['Longer shapes always cover more.', 'Taller shapes always cover less.', 'You cannot count squares.'], { k: 'g1-area-tf' },
          { fig: '<div class="vrow"><figure>' + gridShape(long, '#e04b3a', 'Red shape') + '<figcaption>red</figcaption></figure><figure>' + gridShape(tall, '#2c68cf', 'Blue shape') + '<figcaption>blue</figcaption></figure></div>', hint: 'Count the squares in each shape.' });
      }],
      [2, 'order', function () {
        var ns = sizes(3, 3, 10).sort(function (a, b) { return a - b; }), cols = ['#e04b3a', '#2c68cf', '#2f9a4c'];
        return { q: 'Put the shapes in order from <b>covers least</b> to <b>covers most</b>.', type: 'order', items: ns.map(function (n, i) { return gridShape(blob(n), cols[i], 'A shape'); }), first: 'least', last: 'most',
          hint: 'Count the coloured squares in each shape.', steps: ['The shapes cover ' + ns.join(', ') + ' squares.'],
          explain: ns.join(', ') + ' squares, from least to most.', meta: { k: 'g1-area-order' } };
      }]
    ],
    'm-mass': [
      [1, 'tap', function (lv) {
        var p = R.shuffle(HEAVY.slice()).slice(0, 2).sort(function (x, y) { return HEAVY.indexOf(x) - HEAVY.indexOf(y); }), flip = R.int(0, 1), L = flip ? p[1] : p[0], Rr = flip ? p[0] : p[1], heavier = R.int(0, 1);
        var ans = heavier ? p[1] : p[0];
        return { q: 'Look at the balance. Tap the <b>' + (heavier ? 'heavier' : 'lighter') + '</b> one.', type: 'tap', fig: scale(L, Rr, flip ? 'L' : 'R'), tiles: [L, Rr].map(function (k) { return A.svg(80, 60, OBJ[k].draw(40, 30), 'the ' + OBJ[k].n); }), answer: ans === L ? 0 : 1, answerText: 'the ' + OBJ[ans].n,
          hint: 'The heavier side goes down.', steps: ['Which side is lower? That one is heavier.'],
          explain: 'The ' + OBJ[p[1]].n + ' is heavier. The ' + OBJ[p[0]].n + ' is lighter.', meta: { k: 'g1-mass-tap' } };
      }],
      [1, 'mistake', function () {
        var p = R.shuffle(HEAVY.slice()).slice(0, 2).sort(function (x, y) { return HEAVY.indexOf(x) - HEAVY.indexOf(y); }), flip = R.int(0, 1), L = flip ? p[1] : p[0], Rr = flip ? p[0] : p[1], who = nm(), truth = !R.int(0, 2);
        var said = truth ? p[1] : p[0];
        var right = 'The side with the ' + OBJ[p[1]].n + ' goes down, so the ' + OBJ[p[1]].n + ' is heavier.';
        return G.tf(who + ' says the <b>' + OBJ[said].n + '</b> is heavier. True or false: ' + who + ' is right.', truth, right,
          ['The side that goes up is heavier.', 'Bigger things are always heavier.', 'A balance cannot show heavier.'], { k: 'g1-mass-tf' },
          { fig: scale(L, Rr, flip ? 'L' : 'R'), hint: 'The heavier side goes down.' });
      }],
      [2, 'order', function () {
        var p = R.shuffle(['feather', 'apple', 'book', 'pumpkin']).slice(0, 3).sort(function (x, y) { return HEAVY.indexOf(x) - HEAVY.indexOf(y); });
        return { q: 'Put these in order from <b>lightest to heaviest</b>.', type: 'order', items: p.map(function (k) { return OBJ[k].n; }), first: 'lightest', last: 'heaviest',
          hint: 'Picture holding each one in your hand.', steps: ['The lightest is the ' + OBJ[p[0]].n + '.'],
          explain: p.map(function (k) { return OBJ[k].n; }).join(', ') + '.', meta: { k: 'g1-mass-order' } };
      }]
    ],
    'm-cap': [
      [1, 'tap', function (lv) {
        var cups = sizes(lv === 1 ? 2 : 3, 2, 8), most = R.int(0, 1), ans = most ? Math.max.apply(null, cups) : Math.min.apply(null, cups), names = ['A', 'B', 'C'];
        return { q: 'Each blue band is one cup. Tap the jug that holds the <b>' + (most ? 'most' : 'least') + '</b>.', type: 'tap', tiles: cups.map(function (c, i) { return jugs([{ cups: c, name: names[i] }]); }), answer: cups.indexOf(ans), answerText: 'jug ' + names[cups.indexOf(ans)],
          hint: 'Count the blue bands in each jug.', steps: ['The jugs hold ' + cups.join(', ') + ' cups.'],
          explain: 'Jug ' + names[cups.indexOf(ans)] + ' holds ' + ans + ' cups, the ' + (most ? 'most' : 'least') + '.', meta: { k: 'g1-cap-tap' } };
      }],
      [1, 'fill', function () {
        var cups = sizes(2, 2, 8);
        return { q: 'Each blue band is one cup. Fill in the blanks.', type: 'fill', fig: jugs([{ cups: cups[0], name: 'A' }, { cups: cups[1], name: 'B' }]), fill: 'Jug A holds [[]] cups. Jug B holds [[]] cups.', answers: cups,
          hint: 'Count the blue bands in each jug.', steps: ['Jug A: ' + cups[0] + '. Jug B: ' + cups[1] + '.'],
          explain: 'Jug A holds ' + cups[0] + ' cups and jug B holds ' + cups[1] + '.', meta: { k: 'g1-cap-fill' } };
      }],
      [2, 'mistake', function () {
        var cups = sizes(2, 2, 8), who = nm(), truth = !R.int(0, 2), more = cups[0] > cups[1] ? 'A' : 'B', said = truth ? more : (more === 'A' ? 'B' : 'A');
        var right = 'Jug ' + more + ' holds ' + Math.max.apply(null, cups) + ' cups, so it holds more.';
        return G.tf(who + ' says jug <b>' + said + '</b> holds more. True or false: ' + who + ' is right.', truth, right,
          ['The jug on the left always holds more.', 'All jugs hold the same.', 'Fewer bands means more water.'], { k: 'g1-cap-tf' },
          { fig: jugs([{ cups: cups[0], name: 'A' }, { cups: cups[1], name: 'B' }]), hint: 'Count the bands.' });
      }]
    ],
    'm-cal': [
      [1, 'order', function () {
        var i = R.int(0, 6), list = [0, 1, 2, 3].map(function (k) { return DAYS[(i + k) % 7]; });
        return { q: 'Put the days in order. Start with <b>' + list[0] + '</b>.', type: 'order', items: list, hint: 'Say the days of the week: Sunday, Monday, Tuesday...', steps: ['Start with ' + list[0] + '.'],
          explain: list.join(', ') + '.', meta: { k: 'g1-cal-order' } };
      }],
      [1, 'match', function () {
        var by = { winter: [11, 0, 1], spring: [2, 3, 4], summer: [5, 6, 7], fall: [8, 9, 10] }, seasons = R.shuffle(Object.keys(by)).slice(0, 3);
        return { q: 'In Ontario, which season is each month in? Match them.', type: 'match', pairs: seasons.map(function (s) { return [MONTHS[R.pick(by[s])], s]; }),
          hint: 'Winter is cold and snowy. Summer is hot.', steps: ['December to February is winter. March to May is spring. June to August is summer. September to November is fall.'],
          explain: 'Each month belongs to one season.', meta: { k: 'g1-cal-match' } };
      }],
      [2, 'fill', function () {
        var yr = YR, mo = R.int(0, 11), dn = R.int(0, 6), days = new Date(yr, mo + 1, 0).getDate(), count = 0;
        for (var d = 1; d <= days; d++) if (new Date(yr, mo, d).getDay() === dn) count++;
        return { q: 'Look at the calendar. Fill in the blanks.', type: 'fill', fig: calendar(yr, mo), fill: MONTHS[mo] + ' has [[]] days. [[]] of them are ' + DAYS[dn] + 's.', answers: [days, count],
          hint: 'The last number is how many days. Count down the ' + DAYS[dn] + ' column.', steps: ['The last day is ' + days + '.', 'Count the ' + DAYS[dn] + 's: ' + count + '.'],
          explain: MONTHS[mo] + ' ' + yr + ' has ' + days + ' days and ' + count + ' ' + DAYS[dn] + 's.', meta: { k: 'g1-cal-fill', yr: yr, mo: mo } };
      }],
      [2, 'mistake', function () {
        var i = R.int(0, 6), after = R.int(0, 1), right = DAYS[(i + (after ? 1 : 6)) % 7], who = nm(), truth = !R.int(0, 2), said = truth ? right : DAYS[(i + (after ? 2 : 5)) % 7];
        var why = right + ' comes just ' + (after ? 'after ' : 'before ') + DAYS[i] + '.';
        return G.tf(who + ' says <b>' + said + '</b> comes just ' + (after ? 'after' : 'before') + ' ' + DAYS[i] + '. True or false: ' + who + ' is right.', truth, why,
          ['The days go in any order.', 'Weekends come in the middle of the week.', 'Every day comes after Sunday.'], { k: 'g1-cal-tf' },
          { hint: 'Say the days of the week in order.' });
      }]
    ]
  };
  Atlas.Q.shapes(CH, SHAPES);
})();
