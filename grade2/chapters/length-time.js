(function () {
  var A = Atlas, R = A.R, D = A.draw, M = '&minus;';
  var PX = 30; /* pixels per centimetre in drawings */
  /* things to measure, all lengths in cm */
  var OBJ = {
    pencil: { n: 'pencil', cm: 18, col: 'var(--hi)' },
    crayon: { n: 'crayon', cm: 12, col: 'var(--bad)' },
    book: { n: 'book', cm: 24, col: 'var(--sb)' },
    ribbon: { n: 'ribbon', cm: 30, col: 'var(--sf)' }
  };
  var UNIT = {
    cube: { n: 'cube', many: 'cubes', cm: 2, col: 'var(--sd)' },
    clip: { n: 'paper clip', many: 'paper clips', cm: 3, col: 'var(--ink2)' },
    eraser: { n: 'eraser', many: 'erasers', cm: 6, col: 'var(--sf)' }
  };
  function objShape(kind, x, y, len, col) {
    if (kind === 'pencil' || kind === 'crayon') return '<path d="M' + x + ' ' + (y + 8) + 'h' + (len - 22) + 'l22 9l-22 9h' + -(len - 22) + 'z" style="fill:' + col + '" stroke="rgba(0,0,0,.55)" stroke-width="1.5"/><path d="M' + (x + len - 7) + ' ' + (y + 14) + 'l7 3l-7 3z" fill="#2b2118"/>';
    if (kind === 'book') return '<rect x="' + x + '" y="' + y + '" width="' + len + '" height="34" rx="3" style="fill:' + col + '" stroke="rgba(0,0,0,.55)" stroke-width="1.5"/><rect x="' + (x + 6) + '" y="' + (y + 6) + '" width="' + (len - 12) + '" height="4" fill="rgba(255,255,255,.6)"/>';
    return '<rect x="' + x + '" y="' + (y + 10) + '" width="' + len + '" height="14" rx="4" style="fill:' + col + '" stroke="rgba(0,0,0,.55)" stroke-width="1.5"/>';
  }
  function unitShape(kind, x, y, w) {
    if (kind === 'clip') return '<rect x="' + (x + 1) + '" y="' + (y + 3) + '" width="' + (w - 2) + '" height="14" rx="7" fill="none" style="stroke:var(--ink2)" stroke-width="2.5"/><rect x="' + (x + 5) + '" y="' + (y + 7) + '" width="' + (w - 12) + '" height="6" rx="3" fill="none" style="stroke:var(--ink2)" stroke-width="2"/>';
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="20" rx="3" style="fill:' + UNIT[kind].col + '" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/>';
  }
  /* an object with units laid end to end under it. scale px per cm */
  function measured(o, u, scale) {
    scale = scale || 15;
    var len = OBJ[o].cm * scale, n = OBJ[o].cm / UNIT[u].cm, w = UNIT[u].cm * scale, s = objShape(o, 6, 4, len, OBJ[o].col);
    for (var i = 0; i < n; i++) s += unitShape(u, 6 + i * w, 48, w);
    s += '<line x1="6" y1="40" x2="6" y2="74" style="stroke:var(--bad)" stroke-width="2" stroke-dasharray="4 3"/><line x1="' + (6 + len) + '" y1="0" x2="' + (6 + len) + '" y2="74" style="stroke:var(--bad)" stroke-width="2" stroke-dasharray="4 3"/>';
    return A.svg(len + 14, 78, s, 'A ' + OBJ[o].n + ' is ' + n + ' ' + (n === 1 ? UNIT[u].n : UNIT[u].many) + ' long');
  }
  /* centimetre ruler from 0 to max, with an object from a to a + len (in cm) */
  function ruler(max, a, len, kind, label) {
    var x0 = 16, s = '', W = x0 * 2 + max * PX;
    s += objShape(kind || 'crayon', x0 + a * PX, 4, len * PX, (OBJ[kind] || OBJ.crayon).col);
    s += '<rect x="4" y="46" width="' + (W - 8) + '" height="52" rx="6" style="fill:color-mix(in srgb,var(--hi) 45%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
    for (var i = 0; i <= max * 2; i++) {
      var x = x0 + i * PX / 2, big = i % 2 === 0;
      s += '<line x1="' + x + '" y1="46" x2="' + x + '" y2="' + (big ? 66 : 58) + '" style="stroke:var(--ink)" stroke-width="' + (big ? 2 : 1.2) + '"/>';
      if (big) s += '<text x="' + x + '" y="88" text-anchor="middle" font-size="17" font-weight="700">' + i / 2 + '</text>';
    }
    s += '<line x1="' + (x0 + a * PX) + '" y1="2" x2="' + (x0 + a * PX) + '" y2="66" style="stroke:var(--bad)" stroke-width="2" stroke-dasharray="4 3"/><line x1="' + (x0 + (a + len) * PX) + '" y1="2" x2="' + (x0 + (a + len) * PX) + '" y2="66" style="stroke:var(--bad)" stroke-width="2" stroke-dasharray="4 3"/>';
    return A.svg(W, 102, s, label || 'A ' + ((OBJ[kind] || OBJ.crayon).n) + ' on a ruler from ' + a + ' to ' + (a + len) + ' centimetres');
  }
  /* a clock face with the hour hand on h and the minute hand on m */
  function clock(h, m, r) {
    r = r || 60;
    var c = r + 4, s = '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="4"/>';
    for (var i = 1; i <= 12; i++) {
      var a = Math.PI * 2 * i / 12 - Math.PI / 2;
      s += '<text x="' + (c + (r - 14) * Math.cos(a)).toFixed(1) + '" y="' + (c + (r - 14) * Math.sin(a) + 6).toFixed(1) + '" text-anchor="middle" font-size="' + (r > 50 ? 16 : 13) + '" font-weight="700">' + i + '</text>';
    }
    var ha = Math.PI * 2 * ((h % 12) + m / 60) / 12 - Math.PI / 2, ma = Math.PI * 2 * m / 60 - Math.PI / 2;
    s += '<line x1="' + c + '" y1="' + c + '" x2="' + (c + r * 0.4 * Math.cos(ha)).toFixed(1) + '" y2="' + (c + r * 0.4 * Math.sin(ha)).toFixed(1) + '" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>';
    s += '<line x1="' + c + '" y1="' + c + '" x2="' + (c + (r - 27) * Math.cos(ma)).toFixed(1) + '" y2="' + (c + (r - 27) * Math.sin(ma)).toFixed(1) + '" style="stroke:var(--strand)" stroke-width="4" stroke-linecap="round"/>';
    s += '<circle cx="' + c + '" cy="' + c + '" r="5" style="fill:var(--ink)"/>';
    return A.svg(2 * c, 2 * c, s, 'A clock showing ' + h + (m ? ':' + ('0' + m).slice(-2) : ' o\'clock'));
  }
  function hourName(h) { h = ((h - 1) % 12) + 1; return h + ' o\'clock'; }
  var EVENTS = [['a sneeze', 'seconds'], ['tying a shoe', 'seconds'], ['a clap', 'seconds'], ['brushing your teeth', 'minutes'], ['eating a snack', 'minutes'], ['walking to the corner', 'minutes'], ['a school day', 'hours'], ['a long car trip', 'hours'], ['a night of sleep', 'hours']];

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'length-time';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  /* a thing (pencil if not given) with the first k units (cubes if not given) laid under it */
  function laying(k, gap, o, u) {
    o = o || 'pencil'; u = u || 'cube';
    var sc = 15, len = OBJ[o].cm * sc, w = UNIT[u].cm * sc, s = objShape(o, 6, 4, len, OBJ[o].col);
    for (var i = 0; i < k; i++) s += K.pop(unitShape(u, 6 + i * (w + (gap ? 6 : 0)), 48, w), i === k - 1 ? 0 : -9);
    s += '<line x1="6" y1="40" x2="6" y2="74" style="stroke:var(--bad)" stroke-width="2" stroke-dasharray="4 3"/><line x1="' + (6 + len) + '" y1="0" x2="' + (6 + len) + '" y2="74" style="stroke:var(--bad)" stroke-width="2" stroke-dasharray="4 3"/>';
    return A.svg(len + 14 + (gap ? 60 : 0), 78, s, 'A ' + OBJ[o].n + ' with ' + k + ' ' + (k === 1 ? UNIT[u].n : UNIT[u].many) + ' under it');
  }
  var layLab = K.lab('<div class="btnrow"><button type="button" class="btn" id="llad">Add a cube</button><button type="button" class="btn alt" id="llrm">Take one away</button></div><div class="fig llfig"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var k = 0, $ = A.$;
    function draw() {
      root.querySelector('.llfig').innerHTML = laying(k);
      root.querySelector('.out').innerHTML = k < 9 ? '<p><span class="big">' + k + '</span> cube' + (k === 1 ? '' : 's') + ' so far. ' + (k ? 'Not to the end yet.' : 'Start at the left end.') + '</p>' : '<p>The cubes reach the end. The pencil is <span class="big">9 cubes</span> long.</p>';
      $('#llad', root).disabled = k >= 9;
      if (k === 9) done('9 cubes, end to end, with no gaps. The pencil is 9 cubes long.');
    }
    $('#llad', root).addEventListener('click', function () { k++; draw(); });
    $('#llrm', root).addEventListener('click', function () { if (k) k--; draw(); });
    draw();
  }, 'Lay cubes under the pencil, end to end, until you reach the other end.');
  var unitLab = K.lab('<div class="ctrl"><label for="luo">Thing to measure<select id="luo"><option value="crayon">crayon</option><option value="pencil">pencil</option><option value="book" selected>book</option><option value="ribbon">ribbon</option></select></label><label for="luu">Unit<select id="luu"><option value="cube">cube</option><option value="clip">paper clip</option><option value="eraser">eraser</option></select></label></div><div class="fig lufig"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var $ = A.$, seen = {};
    A.bind(root, ['luo', 'luu'], function () {
      var o = $('#luo', root).value, k = $('#luu', root).value, n = OBJ[o].cm / UNIT[k].cm;
      seen[k] = 1;
      root.querySelector('.lufig').innerHTML = measured(o, k, o === 'ribbon' ? 15 : 16);
      root.querySelector('.out').innerHTML = '<p>The ' + OBJ[o].n + ' is <span class="big">' + n + ' ' + (n === 1 ? UNIT[k].n : UNIT[k].many) + '</span> long.</p><p class="t2">Cubes ' + OBJ[o].cm / 2 + ', paper clips ' + OBJ[o].cm / 3 + ', erasers ' + OBJ[o].cm / 6 + '.</p>';
      if (Object.keys(seen).length >= 2) done('Same thing, different unit, different count. The bigger the unit, the fewer you need.');
    });
  }, 'Measure the same thing with two different units.');
  /* choose cm or m for each thing */
  var cmLab = K.lab('<p class="lq"></p><div class="btnrow"><button type="button" class="btn alt" data-u="cm">centimetres (cm)</button><button type="button" class="btn alt" data-u="m">metres (m)</button></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var L = [['a pencil', 'cm', 'A pencil is short. About 18 cm.'], ['a hallway', 'm', 'A hallway is long. Many metres.'], ['an ant', 'cm', 'An ant is tiny. Less than 1 cm.'], ['a swimming pool', 'm', 'A pool is very long. About 25 m.'], ['a book', 'cm', 'A book is about 24 cm.']], i = 0;
    function q() { root.querySelector('.lq').innerHTML = i < L.length ? '<b>' + (i + 1) + ' of ' + L.length + ':</b> Measure <b>' + L[i][0] + '</b> in&hellip;' : '<b>All done.</b>'; }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-u]'); if (!b || i >= L.length) return;
      var ok = b.getAttribute('data-u') === L[i][1];
      root.querySelector('.out').innerHTML = '<p>' + (ok ? '<span class="big">Yes.</span> ' + L[i][2] : 'Think again. Is ' + L[i][0] + ' shorter or longer than a door is wide?') + '</p>';
      if (ok) { i++; q(); if (i === L.length) done('Short things in centimetres. Long things in metres.'); }
    });
    q();
  }, 'Pick the better unit for each thing.');
  /* read the end of the crayon on a ruler */
  function readLab(shift) {
    return K.lab('<div class="fig lrfig"></div><p class="lq"></p><div class="btnrow lrnums"></div><div class="out" aria-live="polite"></div>', function (root, done) {
      var a, l, got = 0;
      function fresh() {
        a = shift ? R.int(1, 4) : 0; l = R.int(3, 7);
        root.querySelector('.lrfig').innerHTML = ruler(12, a, l, 'crayon');
        root.querySelector('.lq').innerHTML = 'How long is the crayon? Tap the length in cm.';
        var opts = R.shuffle([l, a + l, l + 1, l - 1].filter(function (v, i, s) { return v > 0 && s.indexOf(v) === i; }));
        root.querySelector('.lrnums').innerHTML = opts.map(function (v) { return '<button type="button" class="btn alt" data-v="' + v + '">' + v + ' cm</button>'; }).join('');
      }
      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-v]'); if (!b) return;
        var v = +b.getAttribute('data-v'), out = root.querySelector('.out');
        if (v === l) { got++; out.innerHTML = '<p><span class="big">Yes, ' + l + ' cm.</span> ' + (a ? (a + l) + ' ' + M + ' ' + a + ' = ' + l + '.' : 'It starts at 0, so the end number is the length.') + '</p>'; if (got >= 2) done('Two right. You read the ruler the right way.'); fresh(); }
        else out.innerHTML = '<p>' + (v === a + l && a ? 'That is where it ends, but it starts at ' + a + ', not 0. Count the spaces between.' : 'Not quite. Look at where each end of the crayon lines up.') + '</p>';
      });
      fresh();
    }, shift ? 'The crayon does not start at 0. Find its length. Get two right.' : 'Read the length. Get two right.');
  }
  var slideLab = K.lab('<div class="ctrl"><label for="lra">Start at (cm): <output id="lrao">2</output><input type="range" id="lra" min="0" max="8" value="2"></label><label for="lrl">Crayon length (cm): <output id="lrlo">6</output><input type="range" id="lrl" min="2" max="7" value="6"></label></div><div class="fig lsfig"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var $ = A.$;
    A.bind(root, ['lra', 'lrl'], function () {
      var a = +$('#lra', root).value, l = +$('#lrl', root).value;
      $('#lrao', root).textContent = a; $('#lrlo', root).textContent = l;
      root.querySelector('.lsfig').innerHTML = ruler(15, a, l, 'crayon');
      root.querySelector('.out').innerHTML = '<p>Starts at <b>' + a + '</b>, ends at <b>' + (a + l) + '</b>. <span class="big">' + (a + l) + ' ' + M + ' ' + a + ' = ' + l + ' cm</span></p>' + (a ? '<p class="t2">The end reads ' + (a + l) + ', but the crayon is still ' + l + ' cm.</p>' : '<p class="t2">It starts at 0, so the end number is the length.</p>');
      done();
    });
  }, 'Slide the crayon along the ruler. Does its length change?');
  var timerLab = K.lab('<div class="btnrow"><button type="button" class="btn" id="ltgo">Start</button><button type="button" class="btn alt" id="ltstop" disabled>Stop</button></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var $ = A.$, t0 = 0;
    $('#ltgo', root).addEventListener('click', function () { t0 = Date.now(); this.disabled = true; $('#ltstop', root).disabled = false; root.querySelector('.out').innerHTML = '<p>Counting&hellip; press Stop at 10 seconds.</p>'; });
    $('#ltstop', root).addEventListener('click', function () {
      var s = Math.round((Date.now() - t0) / 100) / 10;
      $('#ltgo', root).disabled = false; this.disabled = true; $('#ltgo', root).textContent = 'Try again';
      root.querySelector('.out').innerHTML = '<p>You stopped at <span class="big">' + s + ' seconds</span>.</p><p>' + (Math.abs(s - 10) <= 1.5 ? 'Very close to 10 seconds.' : s < 10 ? 'A little early. Try counting "one Mississauga, two Mississauga".' : 'A little late. Try counting a bit faster.') + '</p>';
      done('A second is short. 60 of them make a minute.');
    });
  }, 'Press Start, close your eyes, and press Stop when you think 10 seconds have passed.');
  var hourLab = K.lab('<div class="ctrl"><label for="lts">Starts at<select id="lts"><option>8</option><option selected>9</option><option>10</option><option>11</option><option>12</option><option>1</option><option>2</option></select></label><label for="ltl">Hours it lasts: <output id="ltlo">3</output><input type="range" id="ltl" min="1" max="6" value="3"></label></div><div class="vrow lhfig"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var $ = A.$;
    A.bind(root, ['lts', 'ltl'], function () {
      var s = +$('#lts', root).value, l = +$('#ltl', root).value, e = ((s + l - 1) % 12) + 1, steps = [];
      $('#ltlo', root).textContent = l;
      root.querySelector('.lhfig').innerHTML = '<figure>' + clock(s, 0, 54) + '<figcaption>Start: ' + hourName(s) + '</figcaption></figure><figure>' + clock(e, 0, 54) + '<figcaption>End: ' + hourName(e) + '</figcaption></figure>';
      for (var i = 1; i <= l; i++) steps.push(hourName(s + i).replace(' o\'clock', ''));
      root.querySelector('.out').innerHTML = '<p>From ' + hourName(s) + ' to ' + hourName(e) + ' is <span class="big">' + l + ' hour' + (l > 1 ? 's' : '') + '</span>.</p><p class="t2">Count the jumps: ' + steps.join(', ') + '.</p>';
      done();
    });
  }, 'Pick a start time and how long it lasts. Count the jumps of the short hand.');
  var rulerEnd = function (a, l, hop) { return ruler(12, a, l, 'crayon').replace('</svg>', (hop || '') + '</svg>'); };
  function spaces(a, k) { var s = ''; for (var i = 0; i < k; i++) s += K.pop('<path d="M' + (16 + (a + i) * PX + 3) + ' 44 q' + (PX / 2 - 3) + ' -16 ' + (PX - 6) + ' 0" fill="none" style="stroke:var(--strand)" stroke-width="3"/>', i - k + 1); return s; }

  var LESSONS = [
    { id: 'units', title: 'Measure with units', sub: 'Lay units end to end.', concepts: [
      { id: 'endtoend', title: 'End to end, no gaps', exp: ['E2.1'], skill: 'l2-units',
        body: '<p>To measure a length, lay units of the <b>same size</b> end to end. No gaps and no overlaps. Then count them.</p>' + K.vs('Cubes touching, in a straight line, starting at the very end.', 'Gaps between cubes, or cubes that overlap.'),
        watch: K.clip([
          ['Start at the left end of the pencil.', laying(1)],
          ['Lay the next cube right against it. 2, 3, 4.', laying(4)],
          ['5, 6, 7, 8, 9. The cubes reach the end.', laying(9)],
          ['The pencil is <b>9 cubes</b> long.', laying(9), 2000]
        ]),
        example: K.clip([
          ['My turn. I will measure the crayon with paper clips. I start at the left end.', laying(1, false, 'crayon', 'clip')],
          ['I lay the next clip right against the first one. No gap: 2.', laying(2, false, 'crayon', 'clip')],
          ['3, 4. The clips reach the other end.', laying(4, false, 'crayon', 'clip')],
          ['The crayon is <b>4 paper clips</b> long.', laying(4, false, 'crayon', 'clip'), 2000]
        ]),
        try: layLab,
        key: '<p>Same-size units, end to end, no gaps, no overlaps. Count them.</p>',
        mistake: '<p>Leaving gaps or letting units overlap, so the count is wrong.</p>',
        check: [T('count'), P('l2-units', 1)] },
      { id: 'bigger', title: 'Bigger unit, fewer units', exp: ['E2.1'], skill: 'l2-units', hard: true,
        body: '<p>Measure the same thing with a <b>bigger</b> unit and you need <b>fewer</b> of them. The thing did not change. The unit did.</p>',
        watch: K.clip([
          ['The pencil in cubes: <b>9</b>.', measured('pencil', 'cube')],
          ['In paper clips: <b>6</b>.', measured('pencil', 'clip')],
          ['In erasers: <b>3</b>.', measured('pencil', 'eraser')],
          ['Same pencil. Bigger unit, fewer units.', measured('pencil', 'eraser'), 2000]
        ]),
        example: K.clip([
          ['My turn. I measure the book in cubes: <b>12</b>.', measured('book', 'cube')],
          ['Now I measure the same book in erasers: <b>4</b>.', measured('book', 'eraser')],
          ['The book did not change. Erasers are bigger, so I need fewer. Bigger unit, fewer units.', measured('book', 'eraser'), 2200]
        ]),
        try: unitLab,
        ways: [
          { label: 'Steps and giant steps', html: '<p>Walk across a room in tiny steps, then in giant steps. You take fewer giant steps. The room did not change size.</p>' },
          { label: 'This, not that', html: K.vs('3 erasers and 9 cubes can be the same length.', 'The bigger number always means the longer thing.') }
        ],
        key: '<p>Bigger unit: fewer of them. Smaller unit: more of them.</p>',
        mistake: '<p>Thinking 9 cubes must be longer than 3 erasers because 9 is more than 3.</p>',
        check: [P('l2-units', 2), P('l2-units', 3)] }
    ] },
    { id: 'cmm', title: 'Centimetres and metres', sub: 'Units everyone uses.', concepts: [
      { id: 'cm-m', title: 'Centimetres and metres', exp: ['E2.2'], skill: 'l2-cmm',
        body: '<p>Small lengths are measured in <b>centimetres (cm)</b>. Long lengths are measured in <b>metres (m)</b>. <span class="big">100 cm = 1 m</span></p>',
        watch: K.clip([
          ['A fingertip is about <b>1 cm</b> wide.', A.svg(200, 100, K.pop('<rect x="80" y="10" width="40" height="80" rx="20" style="fill:#f2c9a5" stroke="rgba(0,0,0,.4)"/><line x1="80" y1="96" x2="120" y2="96" style="stroke:var(--bad)" stroke-width="4"/>'), 'A fingertip, about 1 cm wide')],
          ['A door is about <b>1 m</b> wide.', A.svg(200, 140, K.pop('<rect x="50" y="6" width="100" height="120" rx="3" style="fill:#b07a4a" stroke="rgba(0,0,0,.45)"/><circle cx="136" cy="70" r="4" fill="#2b2118"/><line x1="50" y1="134" x2="150" y2="134" style="stroke:var(--bad)" stroke-width="4"/>'), 'A door, about 1 m wide')],
          ['100 fingertips fit across the door. <b>100 cm = 1 m</b>.', '<p class="math big">100 cm = 1 m</p>'],
          ['Short things: cm. Long things: m.', '<p class="math big">pencil: 18 cm &nbsp; classroom: 9 m</p>', 2000]
        ]),
        example: K.clip([
          ['My turn. Do I measure a spoon in cm or m? I think of a door. A spoon is much shorter than a door is wide.', '<p class="g2-big">spoon: cm or m?</p>', 2000],
          ['Short things use centimetres. A spoon is about <b>15 cm</b>.', '<p class="g2-big">spoon: 15 cm</p>'],
          ['Next: a school bus. It is much longer than a door. Long things use metres. A bus is about <b>12 m</b>.', '<p class="g2-big">school bus: 12 m</p>', 2200]
        ]),
        try: cmLab,
        key: '<p>Shorter than a door is wide: centimetres. Longer: metres.</p>',
        mistake: '<p>Writing a long distance in cm (a classroom is "9 cm"). Ask: does that make sense?</p>',
        check: [T('unit'), T('est'), P('l2-cmm', 1)] }
    ] },
    { id: 'ruler', title: 'Using a ruler', sub: 'Start at zero.', concepts: [
      { id: 'zero', title: 'Line up with 0', exp: ['E2.3'], skill: 'l2-ruler',
        body: '<p>Line up one end with the <b>0</b> on the ruler. Read the number at the other end. That is the length in centimetres.</p>',
        watch: K.clip([
          ['Line up the end of the crayon with 0.', rulerEnd(0, 9)],
          ['Look at the other end. It lines up with 9.', rulerEnd(0, 9, K.pop('<circle cx="' + (16 + 9 * PX) + '" cy="82" r="14" fill="none" style="stroke:var(--strand)" stroke-width="3"/>', 0))],
          ['The crayon is <b>9 cm</b> long.', rulerEnd(0, 9), 1800]
        ]),
        example: K.clip([
          ['My turn. How long is this crayon? I check that one end lines up with 0.', rulerEnd(0, 6)],
          ['I look at the other end. It lines up with 6.', rulerEnd(0, 6, K.pop('<circle cx="' + (16 + 6 * PX) + '" cy="82" r="14" fill="none" style="stroke:var(--strand)" stroke-width="3"/>', 0))],
          ['It starts at 0, so the end number is the length. The crayon is <b>6 cm</b> long.', rulerEnd(0, 6), 2000]
        ]),
        try: readLab(false),
        key: '<p>Start at 0. Read the end.</p>',
        check: [T('read'), P('l2-ruler', 1)] },
      { id: 'shift', title: 'When it does not start at 0', exp: ['E2.3'], skill: 'l2-ruler', hard: true,
        body: '<p>If the object does not start at 0, count the centimetre <b>spaces</b> between its ends, or subtract the start from the end.</p>',
        watch: K.clip([
          ['This crayon starts at 3 and ends at 10.', rulerEnd(3, 7)],
          ['Count the spaces: 1, 2, 3, 4.', rulerEnd(3, 7, spaces(3, 4))],
          ['5, 6, 7.', rulerEnd(3, 7, spaces(3, 7))],
          ['It is <b>7 cm</b>, not 10 cm. 10 &minus; 3 = 7.', rulerEnd(3, 7, spaces(3, 7)), 2200]
        ]),
        example: K.clip([
          ['My turn. This crayon starts at 2 and ends at 7. It does not start at 0.', rulerEnd(2, 5)],
          ['So I count the spaces between: 1, 2, 3.', rulerEnd(2, 5, spaces(2, 3))],
          ['4, 5.', rulerEnd(2, 5, spaces(2, 5))],
          ['It is <b>5 cm</b>, not 7 cm. I check: 7 &minus; 2 = 5.', rulerEnd(2, 5, spaces(2, 5)), 2200]
        ]),
        try: slideLab,
        ways: [
          { label: 'Hop the spaces', html: '<p>Hop from the start to the end. Count the hops. Start at 3 and hop 1 each time until you reach 10.</p>', tool: 'numberline', opts: { min: 0, max: 12, start: 3, step: [1] } },
          { label: 'Subtract', html: '<p>End number take away start number.</p><p class="math big">10 &minus; 3 = 7 cm</p>' },
          { label: 'Slide to 0', html: '<p>If you can, slide the object so one end sits on 0. Then read the other end.</p>' }
        ],
        key: '<p>Check where it starts. Count spaces, not marks.</p>',
        mistake: '<p>Reading only the end number when the object does not start at 0, or counting the tick marks instead of the spaces.</p>',
        check: [T('shift'), P('l2-ruler', 2)] },
      { id: 'practise', title: 'Read any ruler', exp: ['E2.3'], skill: 'l2-ruler',
        body: '<p>Now mix them up. First check where it starts. Then find the length.</p>',
        example: K.clip([
          ['My turn. First I check where the crayon starts. It starts at 4.', rulerEnd(4, 6)],
          ['It does not start at 0, so I count the spaces from 4 to the end: 1, 2, 3, 4, 5, 6.', rulerEnd(4, 6, spaces(4, 6)), 2000],
          ['The crayon is <b>6 cm</b> long. I check: it ends at 10, and 10 &minus; 4 = 6.', rulerEnd(4, 6, spaces(4, 6)), 2200]
        ]),
        try: readLab(true),
        key: '<p>Where does it start? Where does it end? How many spaces between?</p>',
        check: [P('l2-ruler', 2), P('l2-ruler', 3)] }
    ] },
    { id: 'time', title: 'Seconds, minutes, hours', sub: 'Units of time.', concepts: [
      { id: 'tunits', title: 'Pick a unit of time', exp: ['E2.4'], skill: 'l2-timeunit',
        body: '<p>We measure how long something takes in <b>seconds</b>, <b>minutes</b> and <b>hours</b>. 60 seconds make 1 minute. 60 minutes make 1 hour.</p>',
        watch: K.clip([
          ['A clap takes about 1 <b>second</b>.', '<p class="math big">clap: 1 second</p>'],
          ['Washing your hands takes about 1 <b>minute</b>. That is 60 seconds.', '<p class="math big">wash hands: 1 minute</p>'],
          ['A hockey game takes about 2 to 3 <b>hours</b>.', '<p class="math big">hockey game: 2 to 3 hours</p>'],
          ['Short: seconds. Longer: minutes. Longest: hours.', '<p class="math big">seconds &lt; minutes &lt; hours</p>', 2000]
        ]),
        example: K.clip([
          ['My turn. Which unit fits tying a shoe? I picture it. It is over very fast.', '<p class="g2-big">tying a shoe</p>'],
          ['So I use <b>seconds</b>. It takes about 10 seconds.', '<p class="g2-big">tying a shoe: about 10 seconds</p>'],
          ['Next: a night of sleep. That takes most of the night, so I use <b>hours</b>: about 10 hours.', '<p class="g2-big">a night of sleep: about 10 hours</p>', 2200]
        ]),
        try: timerLab,
        key: '<p>Pick the unit that gives a small, sensible number.</p>',
        mistake: '<p>Choosing hours for something quick, or seconds for something long.</p>',
        check: [T('tunit'), P('l2-timeunit', 1), P('l2-timeunit', 2)] }
    ] },
    { id: 'hours', title: 'How long did it take?', sub: 'Count the hours.', concepts: [
      { id: 'elapsed', title: 'Count the hours', exp: ['E2.4'], skill: 'l2-hours', hard: true,
        body: '<p>On a clock, the short hand points to the hour. Each time it moves to the next number, <b>1 hour</b> has passed. Count the jumps, not the starting hour.</p>',
        watch: K.clip([
          ['The party starts at 2 o\'clock.', clock(2, 0)],
          ['Jump to 3: <b>1 hour</b>.', clock(3, 0)],
          ['Jump to 4: <b>2 hours</b>.', clock(4, 0)],
          ['Jump to 5: <b>3 hours</b>. The party lasted 3 hours.', clock(5, 0), 2000]
        ]),
        example: K.clip([
          ['My turn. The swim lesson starts at 9 o\'clock and ends at 11 o\'clock. How long is it? I start at 9.', clock(9, 0)],
          ['I jump the short hand to 10. That is <b>1 hour</b>.', clock(10, 0)],
          ['I jump to 11. That is <b>2 hours</b>. I do not count the start.', clock(11, 0)],
          ['The swim lesson lasts <b>2 hours</b>.', clock(11, 0), 1800]
        ]),
        try: hourLab,
        ways: [
          { label: 'Hop on a line', html: '<p>Put the hours on a line. Start at 2 and hop to 5. Count the hops.</p>', tool: 'numberline', opts: { min: 0, max: 12, start: 2, step: [1] } },
          { label: 'Turn the clock', html: '<p>Start at 2 o\'clock. Press "+1 hour" and count each press until the clock shows 5 o\'clock.</p>', tool: 'clock', opts: { t: 840 } },
          { label: 'Use your fingers', html: '<p>Say the start hour with a closed fist. Put up one finger for each hour after it: 3, 4, 5. Three fingers: 3 hours.</p>' }
        ],
        key: '<p>Count the jumps from start to end.</p>',
        mistake: '<p>Counting the starting hour: 2, 3, 4, 5 is four numbers but only <b>3</b> hours.</p>',
        check: [T('hours'), P('l2-hours', 1), P('l2-hours', 2)] }
    ] }
  ];
  A.register('length-time', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Measure with units</h2>' +
'<p>To measure a length, lay small things of the <b>same size</b> end to end. No gaps and no overlaps. Then count them. Each small thing is a <b>unit</b>.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>I measure the pencil with cubes. I start at one end, with no gaps. The pencil is <b>9 cubes</b> long.</p><div class="fig">' + measured('pencil', 'cube') + '</div></div>' +
'<div class="yt" data-yt="count"></div>' +
'<p>A <b>bigger</b> unit means you need <b>fewer</b> of them. The same pencil is 9 cubes, but only 3 erasers.</p>' +
'<div class="fig">' + measured('pencil', 'eraser') + '</div>' +
'<div class="lab"><span class="lt">Try it: change the unit</span>' +
'<div class="ctrl"><label for="uo">Thing to measure<select id="uo"><option value="crayon">crayon</option><option value="pencil">pencil</option><option value="book" selected>book</option><option value="ribbon">ribbon</option></select></label><label for="uu">Unit<select id="uu"><option value="cube">cube</option><option value="clip">paper clip</option><option value="eraser">eraser</option></select></label></div>' +
'<div class="fig" id="ufig"></div><div class="out" id="uout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Leaving gaps between the units, or letting them overlap. Then the count is wrong. Units must touch end to end in a straight line.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Centimetres and metres</h2>' +
'<p>Everyone uses the same units so that measures can be shared. Small lengths are measured in <b>centimetres (cm)</b>. Long lengths are measured in <b>metres (m)</b>.</p>' +
'<div class="key"><b class="t">Key idea</b><p><span class="big">100 cm = 1 m</span> &nbsp; A metre is 100 centimetres laid end to end.</p></div>' +
'<div class="facts">' +
'<div>' + A.svg(48, 48, '<rect x="16" y="6" width="16" height="36" rx="8" style="fill:#f2c9a5" stroke="rgba(0,0,0,.4)"/><rect x="18" y="8" width="12" height="12" rx="5" fill="#fff" opacity=".8"/><line x1="18" y1="44" x2="30" y2="44" style="stroke:var(--bad)" stroke-width="3"/>') + '<span><b>about 1 cm</b><small>the width of your fingertip</small></span></div>' +
'<div>' + A.svg(48, 48, '<rect x="4" y="20" width="40" height="10" rx="2" style="fill:var(--hi)" stroke="rgba(0,0,0,.4)"/><line x1="12" y1="20" x2="12" y2="26" stroke="#2b2118"/><line x1="20" y1="20" x2="20" y2="26" stroke="#2b2118"/><line x1="28" y1="20" x2="28" y2="26" stroke="#2b2118"/><line x1="36" y1="20" x2="36" y2="26" stroke="#2b2118"/>') + '<span><b>about 15 cm</b><small>a short ruler</small></span></div>' +
'<div>' + A.svg(48, 48, '<rect x="12" y="4" width="24" height="42" rx="2" style="fill:#b07a4a" stroke="rgba(0,0,0,.45)"/><circle cx="31" cy="26" r="2" fill="#2b2118"/>') + '<span><b>about 1 m</b><small>the width of a door</small></span></div></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Should I measure a classroom in cm or m? A classroom is very long. I would need thousands of fingertips. I use <b>metres</b>. It is about 9 m long.</p></div>' +
'<div class="yt" data-yt="unit"></div>' +
'<div class="yt" data-yt="est"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Using a ruler</h2>' +
'<p>Line up one end of the object with the <b>0</b> on the ruler. Read the number at the other end. That is the length.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>The crayon starts at 0 and ends at 9. It is <b>9 cm</b> long.</p><div class="fig">' + ruler(12, 0, 9, 'crayon') + '</div></div>' +
'<div class="yt" data-yt="read"></div>' +
'<p>If the object does <b>not</b> start at 0, count the centimetres between the two ends, or subtract.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>This crayon starts at 3 and ends at 10. I count the spaces from 3 to 10: 7. Or I subtract: 10 ' + M + ' 3 = 7. It is <b>7 cm</b> long, not 10 cm.</p><div class="fig">' + ruler(12, 3, 7, 'crayon') + '</div></div>' +
'<div class="lab"><span class="lt">Try it: slide the crayon</span>' +
'<div class="ctrl"><label for="ra">Start at: <output id="rao">2</output> cm<input type="range" id="ra" min="0" max="8" value="2"></label><label for="rl">Crayon length: <output id="rlo">6</output> cm<input type="range" id="rl" min="2" max="7" value="6"></label></div>' +
'<div class="fig" id="rfig"></div><div class="out" id="rout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Reading only the number at the end when the object does not start at 0. Always check where it starts.</p></div>' +
'<div class="yt" data-yt="shift"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Seconds, minutes, hours</h2>' +
'<p>We measure how long something takes in <b>seconds</b>, <b>minutes</b> and <b>hours</b>.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Unit</th><th class="l">About how long</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l"><b>1 second</b></td><td class="l">one clap, or saying "one Mississauga"</td><td class="l">a sneeze takes about 1 second</td></tr>' +
'<tr><td class="l"><b>1 minute</b></td><td class="l">60 seconds</td><td class="l">washing your hands takes about 1 minute</td></tr>' +
'<tr><td class="l"><b>1 hour</b></td><td class="l">60 minutes</td><td class="l">a hockey game is about 2 to 3 hours</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Watch me</b><p>How long does it take to brush your teeth? Seconds are too short and hours are too long. It takes about 2 <b>minutes</b>.</p></div>' +
'<div class="yt" data-yt="tunit"></div>' +
'<div class="lab"><span class="lt">Try it: feel 10 seconds</span>' +
'<p class="t2" style="margin:0 0 6px">Press Start, close your eyes, and press Stop when you think 10 seconds have passed.</p>' +
'<div class="btnrow"><button type="button" class="btn" id="tgo">Start</button><button type="button" class="btn alt" id="tstop" disabled>Stop</button></div><div class="out" id="tout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>We can also use our own units, like claps or songs. "Cleaning up took 3 songs." But seconds, minutes and hours mean the same to everyone.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>How long did it take?</h2>' +
'<p>On a clock, the short hand points to the hour. When the short hand moves from one number to the next, <b>1 hour</b> has passed.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>The party started at 2 o\'clock and ended at 5 o\'clock. I count the hours: 3, 4, 5. That is <b>3 hours</b>.</p>' +
'<div class="vrow"><figure>' + clock(2, 0) + '<figcaption>Start: 2 o\'clock</figcaption></figure><figure>' + clock(5, 0) + '<figcaption>End: 5 o\'clock</figcaption></figure></div></div>' +
'<div class="yt" data-yt="hours"></div>' +
'<div class="lab"><span class="lt">Try it: count the hours</span>' +
'<div class="ctrl"><label for="ts">Starts at<select id="ts"><option>8</option><option selected>9</option><option>10</option><option>11</option><option>12</option><option>1</option><option>2</option></select></label><label for="tl">Hours it lasts: <output id="tlo">3</output><input type="range" id="tl" min="1" max="6" value="3"></label></div>' +
'<div class="vrow" id="tcfig"></div><div class="out" id="tcout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting the starting hour. From 2 o\'clock to 5 o\'clock, count the jumps: 2 to 3, 3 to 4, 4 to 5. That is 3 hours, not 4.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function u() {
        var o = $('#uo', root).value, k = $('#uu', root).value, n = OBJ[o].cm / UNIT[k].cm;
        $('#ufig', root).innerHTML = measured(o, k, o === 'ribbon' ? 15 : 16);
        $('#uout', root).innerHTML = '<p>The ' + OBJ[o].n + ' is <span class="big">' + n + ' ' + (n === 1 ? UNIT[k].n : UNIT[k].many) + '</span> long.</p><p class="t2">Cubes ' + OBJ[o].cm / 2 + ', paper clips ' + OBJ[o].cm / 3 + ', erasers ' + OBJ[o].cm / 6 + '. The bigger the unit, the fewer you need.</p>';
      }
      A.bind(root, ['uo', 'uu'], u);
      function r() {
        var a = +$('#ra', root).value, l = +$('#rl', root).value;
        $('#rao', root).textContent = a; $('#rlo', root).textContent = l;
        $('#rfig', root).innerHTML = ruler(15, a, l, 'crayon');
        $('#rout', root).innerHTML = '<p>Starts at <b>' + a + '</b>, ends at <b>' + (a + l) + '</b>.</p><p><span class="big">' + (a + l) + ' ' + M + ' ' + a + ' = ' + l + ' cm</span></p>' + (a ? '<p class="t2">The end reads ' + (a + l) + ', but the crayon is only ' + l + ' cm, because it starts at ' + a + '.</p>' : '<p class="t2">It starts at 0, so the end number is the length.</p>');
      }
      A.bind(root, ['ra', 'rl'], r);
      var t0 = 0;
      $('#tgo', root).addEventListener('click', function () { t0 = Date.now(); $('#tgo', root).disabled = true; $('#tstop', root).disabled = false; $('#tout', root).innerHTML = '<p>Counting&hellip; press Stop at 10 seconds.</p>'; });
      $('#tstop', root).addEventListener('click', function () {
        var s = Math.round((Date.now() - t0) / 100) / 10;
        $('#tgo', root).disabled = false; $('#tstop', root).disabled = true; $('#tgo', root).textContent = 'Try again';
        $('#tout', root).innerHTML = '<p>You stopped at <span class="big">' + s + ' seconds</span>.</p><p>' + (Math.abs(s - 10) <= 1.5 ? 'Very close to 10 seconds.' : s < 10 ? 'A little early. Try counting "one Mississauga, two Mississauga".' : 'A little late. Try counting a bit faster.') + '</p>';
      });
      function tc() {
        var s = +$('#ts', root).value, l = +$('#tl', root).value, e = ((s + l - 1) % 12) + 1;
        $('#tlo', root).textContent = l;
        $('#tcfig', root).innerHTML = '<figure>' + clock(s, 0, 54) + '<figcaption>Start: ' + hourName(s) + '</figcaption></figure><figure>' + clock(e, 0, 54) + '<figcaption>End: ' + hourName(e) + '</figcaption></figure>';
        var steps = []; for (var i = 1; i <= l; i++) steps.push(hourName(s + i).replace(' o\'clock', ''));
        $('#tcout', root).innerHTML = '<p>From ' + hourName(s) + ' to ' + hourName(e) + ' is <span class="big">' + l + ' hour' + (l > 1 ? 's' : '') + '</span>.</p><p class="t2">Count the jumps: ' + steps.join(', ') + '.</p>';
      }
      A.bind(root, ['ts', 'tl'], tc);
    },

    turns: {
      count: function () { var o = R.pick(['crayon', 'pencil', 'book']), u = R.pick(['cube', 'clip']), n = OBJ[o].cm / UNIT[u].cm; return { q: 'How many ' + UNIT[u].many + ' long is the ' + OBJ[o].n + '?', type: 'num', answer: n, fig: measured(o, u), hint: 'Count each ' + UNIT[u].n + ' under the ' + OBJ[o].n + ' once.', explain: 'The ' + OBJ[o].n + ' is ' + n + ' ' + UNIT[u].many + ' long.' }; },
      unit: function () { var t = R.pick([['a crayon', 'cm'], ['a hallway', 'm'], ['a leaf', 'cm'], ['a soccer field', 'm'], ['a spoon', 'cm'], ['a school bus', 'm']]); return { q: 'Would you measure <b>' + t[0] + '</b> in centimetres or metres?', type: 'mc', options: ['centimetres (cm)', 'metres (m)'], answer: t[1] === 'cm' ? 0 : 1, hint: 'Is it smaller than a door is wide (use cm), or bigger (use m)?', explain: t[0].charAt(0).toUpperCase() + t[0].slice(1) + ' is ' + (t[1] === 'cm' ? 'small, so use centimetres.' : 'long, so use metres.') }; },
      est: function () { var t = R.pick([['a paper clip', '3 cm', ['3 m', '30 cm', '100 cm']], ['a door', '2 m', ['2 cm', '20 cm', '20 m']], ['your hand', '12 cm', ['12 m', '1 cm', '100 m']]]), o = R.mc(t[1], t[2]); return { q: 'About how long is <b>' + t[0] + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Use benchmarks: a fingertip is about 1 cm, a door is about 1 m wide.', explain: t[0].charAt(0).toUpperCase() + t[0].slice(1) + ' is about ' + t[1] + '.' }; },
      read: function () { var l = R.int(3, 11); return { q: 'How long is the crayon?', type: 'num', answer: l, unit: 'cm', fig: ruler(12, 0, l, 'crayon'), hint: 'It starts at 0. Read the number at the other end.', explain: 'It starts at 0 and ends at ' + l + ', so it is ' + l + ' cm.' }; },
      shift: function () { var a = R.int(1, 5), l = R.int(3, 7); return { q: 'How long is the crayon?', type: 'num', answer: l, unit: 'cm', fig: ruler(12, a, l, 'crayon'), hint: 'It starts at ' + a + ', not 0. Count the centimetres from ' + a + ' to the end.', explain: (a + l) + ' ' + M + ' ' + a + ' = ' + l + ' cm.' }; },
      tunit: function () { var e = R.pick(EVENTS), o = R.mc(e[1], ['seconds', 'minutes', 'hours'].filter(function (x) { return x !== e[1]; })); return { q: 'Which unit would you use to say how long <b>' + e[0] + '</b> takes?', type: 'mc', options: o.options, answer: o.answer, hint: 'Is it over in a blink (seconds), in a few minutes, or does it last most of a day (hours)?', explain: e[0].charAt(0).toUpperCase() + e[0].slice(1) + ' takes ' + e[1] + '.' }; },
      hours: function () { var s = R.int(1, 8), l = R.int(2, 4); return { q: 'A game starts at ' + hourName(s) + ' and ends at ' + hourName(s + l) + '. How many hours does it last?', type: 'num', answer: l, unit: 'hours', fig: '<div class="vrow"><figure>' + clock(s, 0, 50) + '<figcaption>Start</figcaption></figure><figure>' + clock(s + l, 0, 50) + '<figcaption>End</figcaption></figure></div>', hint: 'Count the jumps of the short hand from ' + s + ' to ' + (((s + l - 1) % 12) + 1) + '. Do not count the start.', explain: 'From ' + hourName(s) + ' to ' + hourName(s + l) + ' is ' + l + ' hours.' }; }
    },

    quiz: [
      { q: 'A book is 8 erasers long. Would it be more or fewer cubes long? (A cube is smaller than an eraser.)', type: 'mc', options: ['more cubes', 'fewer cubes', 'the same number'], answer: 0, hint: 'Smaller units: do you need more of them, or fewer?', explain: 'Cubes are smaller, so you need more of them to cover the same length.' },
      { q: 'How many centimetres are in 1 metre?', type: 'num', answer: 100, unit: 'cm', hint: 'A metre stick has the numbers up to&hellip;', explain: '100 cm = 1 m.' },
      { q: 'Which is about 1 metre long?', type: 'mc', options: ['a fingertip', 'a pencil', 'the width of a door', 'a soccer field'], answer: 2, hint: 'A metre is 100 cm, a little longer than a big step.', explain: 'A door is about 1 m wide.' },
      { q: 'How long is the pencil?', type: 'num', answer: 8, unit: 'cm', fig: ruler(13, 2, 8, 'pencil'), hint: 'It does not start at 0. Where does it start? Where does it end?', explain: 'It starts at 2 and ends at 10. 10 &minus; 2 = 8 cm.' },
      { q: 'Which unit would you use for how long a movie lasts?', type: 'mc', options: ['seconds', 'hours', 'centimetres'], answer: 1, hint: 'A movie is much longer than a clap. And centimetres measure length, not time.', explain: 'A movie lasts about 2 hours.' },
      { q: 'School starts at 9 o\'clock. Lunch is at 12 o\'clock. How many hours is that?', type: 'num', answer: 3, unit: 'hours', fig: '<div class="vrow"><figure>' + clock(9, 0, 50) + '</figure><figure>' + clock(12, 0, 50) + '</figure></div>', hint: 'Count the jumps: 9 to 10, 10 to 11, 11 to 12.', explain: '9 to 12 is 3 hours.' },
      { q: 'How many seconds are in 1 minute?', type: 'num', answer: 60, unit: 'seconds', hint: 'It is the same as the number of minutes in an hour.', explain: '1 minute = 60 seconds.' }
    ],

    practice: [
      { id: 'l2-units', name: 'Measure with units', code: 'E2.1', gen: function (lv) {
        var o = R.pick(['crayon', 'pencil', 'book', 'ribbon']), u = R.pick(['cube', 'clip', 'eraser']), n = OBJ[o].cm / UNIT[u].cm;
        if (lv === 3) {
          var u2 = u === 'cube' ? 'eraser' : 'cube', bigger = UNIT[u2].cm > UNIT[u].cm;
          var o3 = R.mc(bigger ? 'fewer' : 'more', [bigger ? 'more' : 'fewer', 'the same']);
          return { q: 'The ' + OBJ[o].n + ' is ' + n + ' ' + (n === 1 ? UNIT[u].n : UNIT[u].many) + ' long. Measured in ' + UNIT[u2].many + ' (which are ' + (bigger ? 'bigger' : 'smaller') + '), would it be more or fewer?', type: 'mc', options: o3.options, answer: o3.answer, hint: 'Bigger units: fewer needed. Smaller units: more needed.', steps: [UNIT[u2].many + ' are ' + (bigger ? 'bigger' : 'smaller') + ' than ' + UNIT[u].many + '.', (bigger ? 'Bigger units cover more each, so you need fewer.' : 'Smaller units cover less each, so you need more.'), 'It is ' + OBJ[o].cm / UNIT[u2].cm + ' ' + UNIT[u2].many + '.<div class="fig">' + measured(o, u2) + '</div>'], explain: (bigger ? 'Fewer' : 'More') + ': ' + OBJ[o].cm / UNIT[u2].cm + ' ' + UNIT[u2].many + '.' };
        }
        return { q: 'How many ' + UNIT[u].many + ' long is the ' + OBJ[o].n + '?', type: 'num', answer: n, fig: measured(o, u), hint: 'Count each ' + UNIT[u].n + ' once, from one end to the other.', steps: ['Start at the left end.', 'Count each ' + UNIT[u].n + ': there are ' + n + '.'], explain: n + ' ' + UNIT[u].many + '.' };
      } },
      { id: 'l2-cmm', name: 'Centimetres or metres', code: 'E2.2', gen: function (lv) {
        var small = [['an eraser', 4], ['a crayon', 9], ['a spoon', 15], ['a leaf', 8], ['a sock', 20]], big = [['a hallway', 30], ['a school bus', 12], ['a swimming pool', 25], ['a classroom', 9], ['a soccer field', 100]];
        if (lv === 1) { var isS = R.int(0, 1), t = R.pick(isS ? small : big); return { q: 'Would you measure <b>' + t[0] + '</b> in centimetres or metres?', type: 'mc', options: ['centimetres (cm)', 'metres (m)'], answer: isS ? 0 : 1, hint: 'Smaller than a door is wide? Use cm. Bigger? Use m.', steps: ['Picture ' + t[0] + '.', 'Is it shorter than a door is wide?', isS ? 'Yes, so use centimetres.' : 'No, so use metres.'], explain: isS ? 'Use centimetres.' : 'Use metres.' }; }
        if (lv === 2) { var s2 = R.int(0, 1), t2 = R.pick(s2 ? small : big), right = t2[1] + (s2 ? ' cm' : ' m'), o = R.mc(right, [t2[1] + (s2 ? ' m' : ' cm'), (t2[1] * 10) + (s2 ? ' m' : ' cm')]); return { q: 'About how long is <b>' + t2[0] + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Think of a benchmark: fingertip about 1 cm, door about 1 m.', steps: ['Check the unit first: is it small (cm) or big (m)?', 'Then check the number makes sense.', t2[0].charAt(0).toUpperCase() + t2[0].slice(1) + ' is about ' + right + '.'], explain: 'About ' + right + '.' }; }
        var m = R.int(1, 2), extra = R.pick([0, 0, 50]);
        return { q: 'How many centimetres is <b>' + m + ' m' + (extra ? ' and ' + extra + ' cm' : '') + '</b>?', type: 'num', answer: 100 * m + extra, unit: 'cm', hint: 'Each metre is 100 cm.', steps: ['1 m = 100 cm.', m + ' m = ' + 100 * m + ' cm.', extra ? 100 * m + ' + ' + extra + ' = ' + (100 * m + extra) + ' cm.' : 'So it is ' + 100 * m + ' cm.'], explain: (100 * m + extra) + ' cm.' };
      } },
      { id: 'l2-ruler', name: 'Read a ruler', code: 'E2.3', gen: function (lv) {
        var a = lv === 1 ? 0 : R.int(1, 5), l = R.int(3, lv === 3 ? 8 : 7);
        if (lv === 3) { var o = R.mc(String(l) + ' cm', [String(a + l) + ' cm', String(l + 1) + ' cm', String(Math.max(1, l - 1)) + ' cm']); return { q: 'Sam says the pencil is ' + (a + l) + ' cm long. What is its real length?', type: 'mc', options: o.options, answer: o.answer, fig: ruler(13, a, l, 'pencil'), hint: 'Where does the pencil start? Sam read only the end.', steps: ['The pencil starts at ' + a + ', not 0.', 'It ends at ' + (a + l) + '.', (a + l) + ' ' + M + ' ' + a + ' = ' + l + ' cm.'], explain: l + ' cm. Sam forgot it starts at ' + a + '.' }; }
        return { q: 'How long is the crayon?', type: 'num', answer: l, unit: 'cm', fig: ruler(12, a, l, 'crayon'), hint: a ? 'It starts at ' + a + '. Count the centimetres from ' + a + ' to the end.' : 'It starts at 0. Read the number at the end.', steps: ['It starts at ' + a + '.', 'It ends at ' + (a + l) + '.', a ? (a + l) + ' ' + M + ' ' + a + ' = ' + l + ' cm.' : 'So it is ' + l + ' cm.'], explain: l + ' cm.' };
      } },
      { id: 'l2-timeunit', name: 'Units of time', code: 'E2.4', gen: function (lv) {
        if (lv === 3) { var k = R.pick([[1, 'minute', 60, 'seconds'], [1, 'hour', 60, 'minutes'], [2, 'minutes', 120, 'seconds'], [2, 'hours', 120, 'minutes']]); return { q: 'How many ' + k[3] + ' are in <b>' + k[0] + ' ' + k[1] + '</b>?', type: 'num', answer: k[2], unit: k[3], hint: '1 minute is 60 seconds. 1 hour is 60 minutes.', steps: ['1 ' + k[1].replace(/s$/, '') + ' = 60 ' + k[3] + '.', k[0] === 2 ? '2 of them: 60 + 60 = 120.' : 'So it is 60.'], explain: k[0] + ' ' + k[1] + ' = ' + k[2] + ' ' + k[3] + '.' }; }
        var e = R.pick(EVENTS), o = R.mc(e[1], ['seconds', 'minutes', 'hours'].filter(function (x) { return x !== e[1]; }));
        if (lv === 2) { var pair = R.shuffle(EVENTS.filter(function (x) { return x[1] !== e[1]; }))[0], longer = ['seconds', 'minutes', 'hours'].indexOf(e[1]) > ['seconds', 'minutes', 'hours'].indexOf(pair[1]) ? e : pair; var o2 = R.mc(longer[0], [longer === e ? pair[0] : e[0]]); return { q: 'Which takes <b>longer</b>?', type: 'mc', options: o2.options, answer: o2.answer, hint: 'Think of the unit for each: seconds, minutes or hours.', steps: [e[0] + ' takes ' + e[1] + '.', pair[0] + ' takes ' + pair[1] + '.', longer[0] + ' takes longer.'], explain: longer[0].charAt(0).toUpperCase() + longer[0].slice(1) + ' takes longer.' }; }
        return { q: 'Which unit fits how long <b>' + e[0] + '</b> takes?', type: 'mc', options: o.options, answer: o.answer, hint: 'Over in a blink? Seconds. A few minutes? Minutes. Most of a day? Hours.', steps: ['Picture ' + e[0] + '.', 'It takes ' + e[1] + '.'], explain: e[1].charAt(0).toUpperCase() + e[1].slice(1) + '.' };
      } },
      { id: 'l2-hours', name: 'How many hours?', code: 'E2.4', gen: function (lv) {
        var s = R.int(1, lv === 1 ? 6 : 11), l = R.int(1, lv === 1 ? 3 : 5);
        if (lv === 3) { var e = ((s + l - 1) % 12) + 1, w3 = [e + 1, e + 11, s, e + 2].map(hourName).filter(function (x, i, a) { return x !== hourName(e) && a.indexOf(x) === i; }).slice(0, 3), o3 = R.mc(hourName(e), w3); return { q: 'A trip starts at ' + hourName(s) + ' and lasts ' + l + ' hours. When does it end?', type: 'mc', options: o3.options, answer: o3.answer, hint: 'Move the short hand forward ' + l + ' numbers from ' + s + '.', steps: ['Start at ' + s + '.', 'Count forward ' + l + ' hours.', 'It ends at ' + hourName(e) + '.'], explain: hourName(s) + ' plus ' + l + ' hours is ' + hourName(e) + '.' }; }
        return { q: 'It starts at ' + hourName(s) + ' and ends at ' + hourName(s + l) + '. How many hours is that?', type: 'num', answer: l, unit: 'hours', fig: '<div class="vrow"><figure>' + clock(s, 0, 50) + '<figcaption>Start</figcaption></figure><figure>' + clock(s + l, 0, 50) + '<figcaption>End</figcaption></figure></div>', hint: 'Count the jumps of the short hand. Do not count the starting hour.', steps: ['Start at ' + s + '.', 'Jump one hour at a time to ' + (((s + l - 1) % 12) + 1) + '.', 'That is ' + l + ' jump' + (l > 1 ? 's' : '') + ': ' + l + ' hour' + (l > 1 ? 's' : '') + '.'], explain: l + ' hour' + (l > 1 ? 's' : '') + '.' };
      } }
    ]
  });
  /* ---------- more ways to ask each practice skill (answer checks: tests/verify/grade2.js) ---------- */
  var why = K.why, who = K.who, TIME = ['seconds', 'minutes', 'hours'];
  function cmText(cm) { return cm % 100 === 0 ? cm / 100 + ' m' : cm > 100 ? Math.floor(cm / 100) + ' m and ' + cm % 100 + ' cm' : cm + ' cm'; }
  /* one event for each unit of time, shortest first */
  function eventsByUnit() { return TIME.map(function (u) { return R.pick(EVENTS.filter(function (e) { return e[1] === u; })); }); }
  Atlas.Q.shapes(CH, {
    'l2-units': [
      [1, 'tap', function (lv) {
        var u = R.pick(['cube', 'eraser']), set = R.shuffle(['crayon', 'pencil', 'book', 'ribbon']).slice(0, 3), o = set[0], n = OBJ[o].cm / UNIT[u].cm;
        set = R.shuffle(set);
        return { q: 'Tap the thing that is <b>' + n + ' ' + (n === 1 ? UNIT[u].n : UNIT[u].many) + '</b> long.', type: 'tap', tiles: set.map(function (x) { return measured(x, u, 9); }), answer: set.indexOf(o), answerText: 'the ' + OBJ[o].n,
          hint: 'Count the ' + UNIT[u].many + ' under each thing.', steps: ['Count the ' + UNIT[u].many + ' under each one.', 'The ' + OBJ[o].n + ' has ' + n + '.'],
          explain: 'The ' + OBJ[o].n + ' is ' + n + ' ' + UNIT[u].many + ' long.', meta: { k: 'l2-units-tap' } };
      }],
      [1, 'match', function (lv) {
        var u = R.pick(['cube', 'eraser']), set = R.shuffle(['crayon', 'pencil', 'book', 'ribbon']).slice(0, 3);
        return { q: 'Match each thing to how many ' + UNIT[u].many + ' long it is.', type: 'match', pairs: set.map(function (x) { return [measured(x, u, 9), OBJ[x].cm / UNIT[u].cm + ' ' + UNIT[u].many]; }),
          hint: 'Count each ' + UNIT[u].n + ' once, from one end to the other.', steps: ['Count the ' + UNIT[u].many + ' under each thing.'],
          explain: set.map(function (x) { return 'The ' + OBJ[x].n + ' is ' + OBJ[x].cm / UNIT[u].cm + ' ' + UNIT[u].many; }).join('. ') + '.', meta: { k: 'l2-units-match' } };
      }],
      [2, 'mistake', function (lv) {
        var o = R.pick(['pencil', 'book', 'ribbon']), u = R.pick(['cube', 'eraser']), u2 = u === 'cube' ? 'eraser' : 'cube', n = OBJ[o].cm / UNIT[u].cm, name = who(), said = R.pick(['more', 'fewer']);
        var truth = (UNIT[u2].cm < UNIT[u].cm) === (said === 'more');
        var right = UNIT[u2].many + ' are ' + (UNIT[u2].cm < UNIT[u].cm ? 'smaller, so you need more' : 'bigger, so you need fewer') + ': ' + OBJ[o].cm / UNIT[u2].cm + ' ' + UNIT[u2].many + '.';
        return { q: 'The ' + OBJ[o].n + ' is ' + n + ' ' + UNIT[u].many + ' long. ' + name + ' says it would take <b>' + said + '</b> ' + UNIT[u2].many + '. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: measured(o, u),
          why: why(right, ['Any unit gives the same number.', 'Bigger units always give a bigger number.', 'You can only measure with cubes.']),
          hint: 'Bigger units: fewer needed. Smaller units: more needed.', steps: [right], explain: right, meta: { k: 'l2-units-tf' } };
      }]
    ],
    'l2-cmm': [
      [1, 'match', function (lv) {
        var p = R.shuffle([100, 200, 150, 300, 250].map(function (cm) { return [cmText(cm), cm + ' cm']; })).slice(0, 3);
        return { q: 'Match the lengths that are the same.', type: 'match', pairs: p,
          hint: '1 m is 100 cm.', steps: ['1 m = 100 cm, so 2 m = 200 cm.'], explain: p.map(function (x) { return x[0] + ' = ' + x[1]; }).join('. ') + '.', meta: { k: 'l2-cmm-match' } };
      }],
      [1, 'order', function (lv) {
        var set = R.shuffle([30, 80, 100, 150, 200, 300]).slice(0, lv === 1 ? 3 : 4).sort(function (a, b) { return a - b; });
        return { q: 'Put these lengths in order from <b>shortest</b> to longest.', type: 'order', items: set.map(cmText), first: 'shortest', last: 'longest',
          hint: 'Change metres to centimetres first. 1 m is 100 cm.', steps: ['1 m = 100 cm.', 'Compare them all in centimetres.'],
          explain: set.map(cmText).join(', ') + '.', meta: { k: 'l2-cmm-order' } };
      }],
      [2, 'mistake', function (lv) {
        var m = R.int(1, 3), c = R.pick([20, 50, 90]), name = who(), truth = R.int(0, 1) === 1, says = truth ? 'longer' : 'shorter';
        var right = m + ' m is ' + 100 * m + ' cm, which is longer than ' + c + ' cm.';
        return { q: name + ' says <b>' + m + ' m</b> is ' + says + ' than <b>' + c + ' cm</b>' + (truth ? '.' : ', because ' + m + ' is less than ' + c + '.') + ' True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Only the numbers matter, not the units.', 'Centimetres are longer than metres.', 'They are the same length.']),
          hint: 'Change metres to centimetres first.', steps: [right], explain: right, meta: { k: 'l2-cmm-tf' } };
      }]
    ],
    'l2-ruler': [
      [1, 'line', function (lv) {
        var a = lv === 1 ? 0 : R.int(1, 3), l = R.int(2, 12 - a);
        return { q: 'A crayon starts at <b>' + a + '</b> on a ruler and is <b>' + l + ' cm</b> long. Show where it ends.', type: 'line', min: 0, max: 12, tick: 1, every: 1, snap: 1, answer: a + l, unit: 'cm', hideValue: true,
          hint: 'Start at ' + a + ' and count ' + l + ' centimetres.', steps: ['Start at ' + a + '.', a + ' + ' + l + ' = ' + (a + l) + '.'],
          explain: 'It ends at ' + (a + l) + '.', meta: { k: 'l2-ruler-line' } };
      }],
      [1, 'tap', function (lv) {
        var a = lv === 1 ? 0 : R.int(1, 2), lens = R.shuffle([3, 4, 5, 6]).slice(0, 3), l = lens[0], set = R.shuffle(lens);
        return { q: 'Tap the crayon that is <b>' + l + ' cm</b> long.', type: 'tap', tiles: set.map(function (x) { return ruler(9, a, x, 'crayon'); }), answer: set.indexOf(l), answerText: 'the crayon from ' + a + ' to ' + (a + l),
          hint: a ? 'Each crayon starts at ' + a + '. Count from there.' : 'Each crayon starts at 0. Read the number at its end.', steps: ['Find where each crayon starts and ends.', 'Count the centimetres between.'],
          explain: 'From ' + a + ' to ' + (a + l) + ' is ' + l + ' cm.', meta: { k: 'l2-ruler-tap' } };
      }],
      [2, 'mistake', function (lv) {
        var a = R.int(1, 4), l = R.int(3, 7), name = who(), truth = !R.int(0, 2), said = truth ? l : a + l;
        var right = 'It starts at ' + a + ' and ends at ' + (a + l) + ', so it is ' + l + ' cm long.';
        return { q: name + ' says the pencil is <b>' + said + ' cm</b> long. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: ruler(12, a, l, 'pencil'),
          why: why(right, ['Read only the number at the end.', 'Count the marks, not the spaces.', 'Add the start and the end.']),
          hint: 'Where does the pencil start? Count from there.', steps: [right], explain: right, meta: { k: 'l2-ruler-tf' } };
      }]
    ],
    'l2-timeunit': [
      [1, 'match', function (lv) {
        var ev = eventsByUnit();
        return { q: 'Match each thing to the unit that fits how long it takes.', type: 'match', pairs: ev.map(function (e) { return [e[0], e[1]]; }),
          hint: 'Over in a blink? Seconds. A few minutes? Minutes. Most of a day? Hours.', steps: ['Picture each one happening.'],
          explain: ev.map(function (e) { return e[0] + ' takes ' + e[1]; }).join('. ') + '.', meta: { k: 'l2-tu-match' } };
      }],
      [1, 'order', function (lv) {
        var ev = eventsByUnit();
        return { q: 'Put these in order from <b>shortest</b> time to longest.', type: 'order', items: ev.map(function (e) { return e[0]; }), first: 'shortest', last: 'longest',
          hint: 'Seconds are short, minutes are longer, hours are longest.', steps: ['Think of the unit for each one.'],
          explain: ev.map(function (e) { return e[0] + ' (' + e[1] + ')'; }).join(', then ') + '.', meta: { k: 'l2-tu-order' } };
      }],
      [2, 'fill', function (lv) {
        var two = lv === 3;
        return { q: 'Fill in the missing numbers.', type: 'fill', fill: (two ? '2 minutes' : '1 minute') + ' = [[]] seconds. ' + (two ? '2 hours' : '1 hour') + ' = [[]] minutes.', answers: two ? [120, 120] : [60, 60],
          hint: '1 minute is 60 seconds. 1 hour is 60 minutes.', steps: ['1 minute = 60 seconds.', '1 hour = 60 minutes.'],
          explain: two ? '60 + 60 = 120 for both.' : 'Both are 60.', meta: { k: 'l2-tu-fill' } };
      }],
      [2, 'mistake', function (lv) {
        var big = R.pick(['minute', 'hour']), small = big === 'minute' ? 'seconds' : 'minutes', name = who(), truth = !R.int(0, 2), said = truth ? 60 : R.pick([100, 10, 30]);
        var right = '1 ' + big + ' is 60 ' + small + '.';
        return { q: name + ' says 1 ' + big + ' is <b>' + said + '</b> ' + small + '. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Time works like centimetres: 100 make the next unit.', 'Each unit is 10 of the one before.', 'It changes every day.']),
          hint: 'Think of a clock. How many minutes go around once?', steps: [right], explain: right, meta: { k: 'l2-tu-tf' } };
      }]
    ],
    'l2-hours': [
      [1, 'tap', function (lv) {
        var h = R.int(1, 12), set = [h], tries = 0;
        while (set.length < 3 && tries++ < 20) { var x = R.int(1, 12); if (set.indexOf(x) < 0) set.push(x); }
        set = R.shuffle(set);
        return { q: 'Tap the clock that shows <b>' + hourName(h) + '</b>.', type: 'tap', tiles: set.map(function (x) { return clock(x, 0, 46); }), answer: set.indexOf(h), answerText: 'the clock with the short hand on ' + h,
          hint: 'The long hand points to 12. The short hand shows the hour.', steps: ['Look at the short hand on each clock.', 'Find the one pointing to ' + h + '.'],
          explain: 'At ' + hourName(h) + ', the short hand points to ' + h + ' and the long hand to 12.', meta: { k: 'l2-hrs-tap' } };
      }],
      [1, 'fill', function (lv) {
        var s = R.int(1, lv === 1 ? 6 : 10), l = R.int(1, lv === 1 ? 3 : 12 - s);
        return { q: 'Read the clocks.', type: 'fill', fig: '<div class="vrow"><figure>' + clock(s, 0, 50) + '<figcaption>Start</figcaption></figure><figure>' + clock(s + l, 0, 50) + '<figcaption>End</figcaption></figure></div>',
          fill: 'It starts at [[]] o’clock and ends at [[]] o’clock. That is [[]] hours.', answers: [s, s + l, l],
          hint: 'Read each short hand. Then count the jumps from start to end.', steps: ['Start: ' + hourName(s) + '. End: ' + hourName(s + l) + '.', 'Count the jumps: ' + l + '.'],
          explain: 'From ' + hourName(s) + ' to ' + hourName(s + l) + ' is ' + l + ' hour' + (l > 1 ? 's' : '') + '.', meta: { k: 'l2-hrs-fill' } };
      }],
      [2, 'mistake', function (lv) {
        var s = R.int(8, 11), l = R.int(13 - s, 5), e = ((s + l - 1) % 12) + 1, name = who(), truth = !R.int(0, 2), said = truth ? l : Math.abs(s - e);
        var right = 'Count forward from ' + s + ': ' + l + ' jumps to reach ' + e + '. That is ' + l + ' hours.';
        return { q: 'A trip starts at ' + hourName(s) + ' and ends at ' + hourName(e) + '. ' + name + ' says it is <b>' + said + '</b> hours. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          fig: '<div class="vrow"><figure>' + clock(s, 0, 50) + '<figcaption>Start</figcaption></figure><figure>' + clock(e, 0, 50) + '<figcaption>End</figcaption></figure></div>',
          why: why(right, ['Take away the smaller number from the bigger one.', 'Count the starting hour too.', 'Time stops at 12.']),
          hint: 'Count forward from the start, going past 12 if you need to.', steps: [right], explain: right, meta: { k: 'l2-hrs-tf' } };
      }]
    ]
  });
})();
