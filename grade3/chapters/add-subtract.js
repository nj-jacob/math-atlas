(function () {
  var A = Atlas, R = A.R;
  var uid = 0;
  function mid(b) { uid++; return b + uid; }
  function dg(n) { return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000)]; }
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var PN = ['ones', 'tens', 'hundreds', 'thousands'];

  /* the column method, with regrouping marks. Addition: carries above. Subtraction: crossed-out digits with new values above. */
  function column(a, b, op, k) {
    if (k == null) k = 9;
    var da = dg(a), db = dg(b), res = op === '+' ? a + b : a - b, dr = dg(res), cols = res >= 1000 || a >= 1000 ? 4 : 3;
    var cw = 84, x0 = 220 - cw * cols / 2 + 30, s = '', top = da.slice(), changed = [0, 0, 0, 0], carry = [0, 0, 0, 0], p;
    if (op === '+') { var c = 0; for (p = 0; p < 4; p++) { var t = da[p] + db[p] + c; c = t >= 10 ? 1 : 0; if (c && p < 3) carry[p + 1] = 1; } }
    else for (p = 0; p < 3; p++) if (top[p] < db[p]) { top[p] += 10; top[p + 1] -= 1; changed[p] = 1; changed[p + 1] = 1; }
    for (p = 0; p < 4; p++) if (top[p] < 0) top[p] += 10;
    function X(i) { return x0 + cw * (cols - 1 - i) + cw / 2; }
    for (p = 0; p < cols; p++) {
      s += '<rect x="' + (X(p) - cw / 2 + 3) + '" y="2" width="' + (cw - 6) + '" height="24" rx="6" style="fill:var(--p' + p + ')"/>' +
        '<text x="' + X(p) + '" y="19" text-anchor="middle" font-size="15" font-weight="700" style="fill:' + (p ? '#fff' : '#13203a') + '">' + PN[p] + '</text>';
      var showA = p < String(a).length, showB = p < String(b).length, showR = p < String(res).length;
      if (op === '+' && carry[p] && p <= k) s += '<text x="' + X(p) + '" y="52" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--bad)">1</text>';
      if (op === '-' && changed[p] && showA && (p < k || (p === k && top[p] >= 10) || (p === k + 0 && changed[p - 1]))) {
        s += '<text x="' + X(p) + '" y="52" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--bad)">' + top[p] + '</text>';
      }
      if (showA) {
        s += '<text x="' + X(p) + '" y="92" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display)' + (op === '-' && changed[p] ? ';fill:var(--ink2)' : '') + '">' + da[p] + '</text>';
        if (op === '-' && changed[p] && (p < k || (p === k && top[p] >= 10) || changed[p - 1] && p <= k)) s += '<line x1="' + (X(p) - 14) + '" y1="88" x2="' + (X(p) + 14) + '" y2="70" style="stroke:var(--bad)" stroke-width="3"/>';
      }
      if (showB) s += '<text x="' + X(p) + '" y="136" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display)">' + db[p] + '</text>';
      if (showR && p < k) s += '<text x="' + X(p) + '" y="190" text-anchor="middle" font-size="36" font-weight="700" style="font-family:var(--display);fill:var(--p' + p + ')">' + dr[p] + '</text>';
    }
    s += '<text x="' + (X(cols - 1) - cw / 2 - 14) + '" y="136" text-anchor="middle" font-size="36" font-weight="700">' + (op === '+' ? '+' : '&minus;') + '</text>';
    s += '<line x1="' + (X(cols - 1) - cw / 2 - 30) + '" y1="150" x2="' + (X(0) + cw / 2) + '" y2="150" style="stroke:var(--ink)" stroke-width="3"/>';
    return A.svg(440, 202, s, a + (op === '+' ? ' plus ' : ' minus ') + b + ' in columns equals ' + res);
  }
  /* an open number line: not to scale, one jump per place */
  function jumps(start, parts, op) {
    var vals = [start], i;
    parts.forEach(function (p) { vals.push(vals[vals.length - 1] + (op === '+' ? p : -p)); });
    var w = parts.map(function (p) { return Math.max(70, Math.sqrt(p) * 14); }), tot = w.reduce(function (x, y) { return x + y; }, 0);
    var k = 470 / tot, xs = [op === '+' ? 40 : 520];
    w.forEach(function (ww) { xs.push(xs[xs.length - 1] + (op === '+' ? 1 : -1) * ww * k); });
    var s = '<line x1="20" y1="96" x2="540" y2="96" style="stroke:var(--ink)" stroke-width="3"/>';
    for (i = 0; i < vals.length; i++) {
      s += '<line x1="' + xs[i] + '" y1="88" x2="' + xs[i] + '" y2="104" style="stroke:var(--ink)" stroke-width="2.5"/>' +
        '<text x="' + xs[i] + '" y="128" text-anchor="middle" font-size="20" class="tb"' + (i === vals.length - 1 ? ' style="fill:var(--accent)"' : '') + '>' + vals[i] + '</text>';
      if (i) {
        var xa = xs[i - 1], h = Math.min(60, Math.abs(xs[i] - xa) * 0.5 + 12), col = parts[i - 1] >= 100 ? 2 : parts[i - 1] >= 10 ? 1 : 0;
        s += '<path d="M' + xa + ' 92 Q' + ((xa + xs[i]) / 2) + ' ' + (92 - h * 2) + ' ' + xs[i] + ' 92" fill="none" style="stroke:var(--p' + col + ')" stroke-width="3"/>' +
          '<text x="' + ((xa + xs[i]) / 2) + '" y="' + (92 - h - 6) + '" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--p' + col + ')">' + (op === '+' ? '+' : '&minus;') + parts[i - 1] + '</text>';
      }
    }
    s += '<circle cx="' + xs[0] + '" cy="96" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 136, s, 'Open number line: start at ' + start + ', ' + parts.map(function (p) { return (op === '+' ? 'add ' : 'take away ') + p; }).join(', then ') + ', to land on ' + vals[vals.length - 1]);
  }
  function splitPlaces(n) { var d = dg(n), out = []; if (d[2] || d[3]) out.push(d[3] * 1000 + d[2] * 100); if (d[1]) out.push(d[1] * 10); if (d[0]) out.push(d[0]); return out; }
  /* a pan balance with an expression on each side */
  function balance(left, right, ok) {
    var tilt = ok ? 0 : 8, s = '';
    s += '<polygon points="280,170 250,210 310,210" style="fill:var(--ink2)"/><line x1="280" y1="60" x2="280" y2="172" style="stroke:var(--ink2)" stroke-width="6"/>';
    s += '<g transform="rotate(' + tilt + ' 280 60)"><line x1="90" y1="60" x2="470" y2="60" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>';
    [[110, left], [450, right]].forEach(function (pn) {
      s += '<line x1="' + pn[0] + '" y1="60" x2="' + (pn[0] - 60) + '" y2="120" style="stroke:var(--ink2)" stroke-width="2"/><line x1="' + pn[0] + '" y1="60" x2="' + (pn[0] + 60) + '" y2="120" style="stroke:var(--ink2)" stroke-width="2"/>' +
        '<path d="M' + (pn[0] - 80) + ' 120 H' + (pn[0] + 80) + ' Q' + pn[0] + ' 160 ' + (pn[0] - 80) + ' 120Z" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="2.5"/>' +
        '<text x="' + pn[0] + '" y="110" text-anchor="middle" font-size="24" font-weight="700" style="font-family:var(--display)">' + pn[1] + '</text>';
    });
    s += '</g><circle cx="280" cy="60" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 216, s, 'Balance: ' + left.replace(/<[^>]+>/g, '') + ' on the left, ' + right.replace(/<[^>]+>/g, '') + ' on the right. ' + (ok ? 'It is level.' : 'It is not level.'));
  }
  function regroupText(a, b, op) {
    var da = dg(a), db = dg(b), out = [], p;
    if (op === '+') {
      var c = 0;
      for (p = 0; p < 3; p++) {
        var t = da[p] + db[p] + c;
        out.push('<b class="c' + p + 't">' + PN[p] + '</b>: ' + da[p] + ' + ' + db[p] + (c ? ' + 1' : '') + ' = ' + t + (t >= 10 ? '. That is 10 or more, so write ' + (t - 10) + ' and carry 1 to the ' + PN[p + 1] + '.' : '.'));
        c = t >= 10 ? 1 : 0;
        if (p === 2 && c) out.push('<b class="c3t">thousands</b>: write the carried 1.');
      }
    } else {
      var top = da.slice();
      for (p = 0; p < 3; p++) {
        if (top[p] < 0) { top[p] += 10; }
        if (top[p] < db[p]) {
          var from = top[p + 1] > 0 ? 'trade 1 ' + PN[p + 1].slice(0, -1) + ' for 10 ' + PN[p] : 'there are no ' + PN[p + 1] + ', so trade 1 hundred for 10 tens first, then 1 ten for 10 ones';
          out.push('<b class="c' + p + 't">' + PN[p] + '</b>: ' + top[p] + ' is less than ' + db[p] + ', so ' + from + '. Now ' + (top[p] + 10) + ' &minus; ' + db[p] + ' = ' + (top[p] + 10 - db[p]) + '.');
          top[p] += 10; top[p + 1] -= 1;
        } else out.push('<b class="c' + p + 't">' + PN[p] + '</b>: ' + top[p] + ' &minus; ' + db[p] + ' = ' + (top[p] - db[p]) + '.');
      }
    }
    return out;
  }

  /* ---------- Lessons: one idea per screen ---------- */
  var CH = 'add-subtract';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function colView(s) { return '<div>' + column(s.a, s.b, s.op, s.k) + (s.say ? '<p class="g3-sym" style="font-size:1.05rem;color:var(--ink)">' + s.say + '</p>' : '') + '</div>'; }
  function jumpView(s) { return jumps(s.start, s.parts.slice(0, s.k), s.op); }
  function balView(s) { return balance(s.l, s.r, s.ok); }
  function storyView(s) { return '<div>' + (s.k ? column(s.a, s.b, s.op, s.k) : '') + '<p class="g3-sym" style="font-size:1.05rem;color:var(--ink)">' + s.say + '</p></div>'; }

  var LESSONS = [
    { id: 'add', title: 'Adding with regrouping', sub: 'When the ones make 10 or more, trade them for a ten.', concepts: [
      { id: 'blocks', title: 'Add with blocks', exp: ['B2.4', 'B2.5'], skill: 'as-add',
        body: '<p>To add, put both numbers together. If you get <b>10 or more ones</b>, group 10 of them into a ten.</p>',
        watch: { tool: 'base10', opts: { t: 4, o: 7 }, steps: [
          { say: 'This is 47. Let\'s add 25.', ms: 1200 },
          { say: 'Add 2 tens and 5 ones.', act: function (t) { return t.add('t', 2, 350).then(function () { return t.add('o', 5, 260); }); } },
          { say: 'Now there are 12 ones. That is more than 9.', act: function (t) { return t.lightKind('o', 160); }, ms: 700 },
          { say: 'Group 10 ones into a ten.', act: function (t) { t.clearLit(); return t.group('o'); } },
          { say: '7 tens and 2 ones. <b>47 + 25 = 72</b>.', ms: 2000 }
        ] },
        example: { tool: 'base10', opts: { t: 3, o: 6 }, steps: [
          { say: 'My turn. This is 36. I will add 47.', ms: 1300 },
          { say: 'First I add 4 tens and 7 ones.', act: function (t) { return t.add('t', 4, 350).then(function () { return t.add('o', 7, 260); }); } },
          { say: 'I count the ones: 6 + 7 = 13. That is more than 9.', act: function (t) { return t.lightKind('o', 160); }, ms: 700 },
          { say: 'So I group 10 ones into 1 ten.', act: function (t) { t.clearLit(); return t.group('o'); } },
          { say: 'Now I have 8 tens and 3 ones. <b>36 + 47 = 83</b>.', ms: 2000 }
        ] },
        try: { tool: 'base10', opts: { controls: true, t: 3, o: 8 }, tasks: [
          { do: 'This is 38. <b>Add 26</b> with the + buttons, then group the ones.', goal: function (s) { return s.value === 64 && s.o < 10; }, yes: '38 + 26 = 64. 14 ones became 1 ten and 4 ones.' },
          { do: 'Build <b>156</b>, then add <b>75</b>. Group whenever you can.', setup: function (t) { t.set(1, 5, 6); }, reset: false, goal: function (s) { return s.value === 231 && s.o < 10 && s.t < 10; }, yes: '156 + 75 = 231. You grouped ones into a ten and tens into a hundred.' }
        ] },
        key: '<p><b>10 ones make 1 ten.</b> Group them so each place has 9 or fewer.</p>',
        check: [TU('s1', 0), SK('as-add', 1)] },

      { id: 'columns', title: 'Add in columns', exp: ['B2.4', 'B2.5'], skill: 'as-add', hard: true,
        body: '<p>Line up the digits so ones are under ones and tens are under tens. Add the <b>ones first</b>. If they make 10 or more, write the ones and <b>carry</b> 1 to the tens.</p>',
        watch: { mount: G3.view(colView, { a: 358, b: 276, op: '+', k: 0, say: '358 + 276. Line up the places.' }), steps: [
          { say: 'Line up the places. Start with the ones.', ms: 1200 },
          { say: 'Ones: 8 + 6 = 14. Write 4, carry 1 ten.', act: function (t) { return t.set({ k: 1, say: '8 + 6 = 14: write 4, carry 1' }, 1800); } },
          { say: 'Tens: 5 + 7 + 1 = 13. Write 3, carry 1 hundred.', act: function (t) { return t.set({ k: 2, say: '5 + 7 + 1 = 13: write 3, carry 1' }, 1800); } },
          { say: 'Hundreds: 3 + 2 + 1 = 6. <b>358 + 276 = 634</b>.', act: function (t) { return t.set({ k: 3, say: '3 + 2 + 1 = 6' }, 2200); } }
        ] },
        example: { mount: G3.view(colView, { a: 467, b: 285, op: '+', k: 0, say: '467 + 285' }), steps: [
          { say: 'My turn. I will add 467 + 285. I line up the places and start with the ones.', ms: 1500 },
          { say: 'Ones: 7 + 5 = 12. I write 2 and carry 1 ten.', act: function (t) { return t.set({ k: 1, say: '7 + 5 = 12: write 2, carry 1' }, 1800); } },
          { say: 'Tens: 6 + 8 + 1 = 15. I write 5 and carry 1 hundred.', act: function (t) { return t.set({ k: 2, say: '6 + 8 + 1 = 15: write 5, carry 1' }, 1800); } },
          { say: 'Hundreds: 4 + 2 + 1 = 7. <b>467 + 285 = 752</b>.', act: function (t) { return t.set({ k: 3, say: '4 + 2 + 1 = 7' }, 2000); } },
          { say: 'Ones first. 10 or more? I write the ones and carry 1.', ms: 1800 }
        ] },
        ways: [
          { label: 'Add each place separately', html: '<p>Split both numbers into places and add each part.</p><p class="math">300 + 200 = 500</p><p class="math">50 + 70 = 120</p><p class="math">8 + 6 = 14</p><p class="math"><b>500 + 120 + 14 = 634</b></p>' },
          { label: 'On a number line', html: '<p>Start at 358 and jump by each part of 276.</p><div class="fig">' + jumps(358, [200, 70, 6], '+') + '</div>' },
          { label: 'With blocks', html: '<p>Build both numbers. 14 ones: group 10 into a ten. 13 tens: group 10 into a hundred. You end with 6 hundreds, 3 tens, 4 ones.</p>', tool: 'base10', opts: { controls: true, h: 3, t: 5, o: 8 } }
        ],
        try: { mount: G3.play({ state: { a: 245, b: 168, k: 0 }, buttons: [{ label: 'Next place', act: function (s) { if (s.k < 3) s.k++; } }, { label: 'Start over', act: function (s) { s.k = 0; } }],
          sliders: [{ key: 'a', label: 'Top number', min: 100, max: 599 }, { key: 'b', label: 'Bottom number', min: 100, max: 399 }],
          draw: function (s) { return column(s.a, s.b, '+', s.k); },
          info: function (s) { var r = regroupText(s.a, s.b, '+'); return s.k ? r[s.k - 1] : 'Press <b>Next place</b> to add the ones.'; },
          tasks: [{ do: 'Add <b>245 + 168</b> one place at a time.', goal: function (s) { return s.k === 3 && s.a === 245 && s.b === 168; }, yes: '245 + 168 = 413. Two carries.' },
            { do: 'Pick your own numbers and add them, place by place.', goal: function (s) { return s.k === 3 && !(s.a === 245 && s.b === 168); }, yes: function (s) { return s.a + ' + ' + s.b + ' = ' + (s.a + s.b) + '.'; } }] }), do: '' },
        key: '<p>Ones first. 10 or more? Write the ones, carry 1.</p>',
        mistake: '<p>Writing the whole 14 in the ones place, or forgetting to add the carried 1. Ask the child to say "14 is 1 ten and 4 ones" before writing.</p>',
        check: [TU('s1', 1), TU('s1', 2), SK('as-add', 2)] }
    ] },

    { id: 'sub', title: 'Subtracting with regrouping', sub: 'When there are not enough ones, trade a ten.', concepts: [
      { id: 'trade', title: 'Trade a ten to subtract', exp: ['B2.4', 'B2.5'], skill: 'as-sub',
        body: '<p>To take away 7 ones when you only have 2, <b>break a ten</b> into 10 ones first. Now you have enough.</p>',
        watch: { tool: 'base10', opts: { t: 5, o: 2 }, steps: [
          { say: 'This is 52. Take away 17.', ms: 1200 },
          { say: 'We need to take 7 ones, but there are only 2.', act: function (t) { return t.lightKind('o', 300); }, ms: 800 },
          { say: 'Break a ten into 10 ones. Now there are 12 ones.', act: function (t) { t.clearLit(); return t.split('t'); } },
          { say: 'Take away 7 ones and 1 ten.', act: function (t) { return t.remove('o', 7, 160).then(function () { return t.remove('t', 1, 300); }); } },
          { say: '3 tens and 5 ones are left. <b>52 &minus; 17 = 35</b>.', ms: 2000 }
        ] },
        example: { tool: 'base10', opts: { t: 4, o: 3 }, steps: [
          { say: 'My turn. This is 43. I will take away 18.', ms: 1300 },
          { say: 'I need to take 8 ones, but there are only 3.', act: function (t) { return t.lightKind('o', 300); }, ms: 800 },
          { say: 'So I break 1 ten into 10 ones. Now there are 13 ones.', act: function (t) { t.clearLit(); return t.split('t'); } },
          { say: 'I take away 8 ones, then 1 ten.', act: function (t) { return t.remove('o', 8).then(function () { return t.remove('t', 1); }); } },
          { say: '2 tens and 5 ones are left. <b>43 &minus; 18 = 25</b>.', ms: 2000 }
        ] },
        try: { tool: 'base10', opts: { controls: true, t: 6, o: 3 }, tasks: [
          { do: 'This is 63. <b>Take away 28</b>. Break a ten when you need more ones.', goal: function (s) { return s.value === 35; }, yes: '63 &minus; 28 = 35.' },
          { do: 'Build <b>304</b>, then take away <b>126</b>.', setup: function (t) { t.set(3, 0, 4); }, reset: false, goal: function (s) { return s.value === 178; }, yes: '304 &minus; 126 = 178. You had to break a hundred first, because there were no tens.' }
        ] },
        key: '<p>Not enough? <b>Break 1 ten into 10 ones.</b></p>',
        check: [TU('s2', 0), TU('s2', 1), SK('as-sub', 1)] },

      { id: 'columns', title: 'Subtract in columns', exp: ['B2.4', 'B2.5'], skill: 'as-sub', hard: true,
        body: '<p>Line up the places and start with the <b>ones</b>. If the top digit is smaller, trade 1 from the next place: cross it out and write one less, then put 10 more in this place.</p>',
        watch: { mount: G3.view(colView, { a: 532, b: 278, op: '-', k: 0, say: '532 &minus; 278' }), steps: [
          { say: 'Ones: 2 is less than 8. Trade a ten: 3 tens become 2, and 2 ones become 12.', act: function (t) { return t.set({ k: 1, say: '12 &minus; 8 = 4' }, 2200); } },
          { say: 'Tens: 2 is less than 7. Trade a hundred: 5 becomes 4, and 2 tens become 12.', act: function (t) { return t.set({ k: 2, say: '12 &minus; 7 = 5' }, 2200); } },
          { say: 'Hundreds: 4 &minus; 2 = 2. <b>532 &minus; 278 = 254</b>.', act: function (t) { return t.set({ k: 3, say: '4 &minus; 2 = 2' }, 2000); } },
          { say: 'Check by adding: 254 + 278 = 532.', ms: 1800 }
        ] },
        example: { mount: G3.view(colView, { a: 624, b: 357, op: '-', k: 0, say: '624 &minus; 357' }), steps: [
          { say: 'My turn. I will work out 624 &minus; 357. I start with the ones.', ms: 1400 },
          { say: 'Ones: 4 is less than 7. I trade a ten: 2 tens become 1, and 4 ones become 14.', act: function (t) { return t.set({ k: 1, say: '14 &minus; 7 = 7' }, 2200); } },
          { say: 'Tens: 1 is less than 5. I trade a hundred: 6 becomes 5, and 1 ten becomes 11.', act: function (t) { return t.set({ k: 2, say: '11 &minus; 5 = 6' }, 2200); } },
          { say: 'Hundreds: 5 &minus; 3 = 2. <b>624 &minus; 357 = 267</b>.', act: function (t) { return t.set({ k: 3, say: '5 &minus; 3 = 2' }, 2000); } },
          { say: 'I check by adding: 267 + 357 = 624. It is right.', ms: 1800 }
        ] },
        ways: [
          { label: 'Count up instead', html: '<p>Start at 278 and count up to 532. Big jumps first.</p><div class="fig">' + jumps(278, [2, 20, 200, 32], '+') + '</div><p>2 + 20 + 200 + 32 = <b>254</b>.</p>' },
          { label: 'Take away in parts', html: '<p>Take away 278 one place at a time.</p><div class="fig">' + jumps(532, [200, 70, 8], '-') + '</div>' },
          { label: 'With blocks', html: '<p>Build 532. You cannot take 8 ones from 2, so break a ten. You cannot take 7 tens from 2, so break a hundred.</p>', tool: 'base10', opts: { controls: true, h: 5, t: 3, o: 2 } }
        ],
        try: { mount: G3.play({ state: { a: 423, b: 156, k: 0 }, buttons: [{ label: 'Next place', act: function (s) { if (s.k < 3) s.k++; } }, { label: 'Start over', act: function (s) { s.k = 0; } }],
          sliders: [{ key: 'a', label: 'Top number', min: 400, max: 999 }, { key: 'b', label: 'Take away', min: 100, max: 399 }],
          draw: function (s) { return column(s.a, s.b, '-', s.k); },
          info: function (s) { var r = regroupText(s.a, s.b, '-'); return s.k ? r[s.k - 1] : 'Press <b>Next place</b> to start with the ones.'; },
          tasks: [{ do: 'Work out <b>423 &minus; 156</b>, one place at a time.', goal: function (s) { return s.k === 3 && s.a === 423 && s.b === 156; }, yes: '423 &minus; 156 = 267.' }] }), do: '' },
        key: '<p>Top digit too small? Trade 1 from the place to its left.</p>',
        mistake: '<p>Taking the smaller digit from the bigger one, whichever is on top. In 52 &minus; 17 some children do 7 &minus; 2 = 5 and get 45. Ask: "Do we have 7 ones to take away?"</p>',
        check: [TU('s2', 2), SK('as-sub', 2)] }
    ] },

    { id: 'mental', title: 'Mental math', sub: 'Jump in friendly steps.', concepts: [
      { id: 'jump', title: 'Jump on a number line', exp: ['B2.3'], skill: 'as-mental',
        body: '<p>To add in your head, split the second number into hundreds, tens and ones, and <b>jump</b> one part at a time.</p>',
        watch: { mount: G3.view(jumpView, { start: 346, parts: [200, 30, 5], op: '+', k: 0 }), steps: [
          { say: 'Start at 346. Add 235.', ms: 1200 },
          { say: 'Jump 200: 546.', act: function (t) { return t.set({ k: 1 }, 1300); } },
          { say: 'Jump 30: 576.', act: function (t) { return t.set({ k: 2 }, 1300); } },
          { say: 'Jump 5: <b>581</b>. So 346 + 235 = 581.', act: function (t) { return t.set({ k: 3 }, 2000); } }
        ] },
        example: { mount: G3.view(jumpView, { start: 418, parts: [100, 40, 7], op: '+', k: 0 }), steps: [
          { say: 'My turn. I start at 418 and add 147. I split 147 into 100, 40 and 7.', ms: 1600 },
          { say: 'I jump 100: 518.', act: function (t) { return t.set({ k: 1 }, 1300); } },
          { say: 'I jump 40: 558.', act: function (t) { return t.set({ k: 2 }, 1300); } },
          { say: 'I jump 7: <b>565</b>. So 418 + 147 = 565.', act: function (t) { return t.set({ k: 3 }, 2000); } }
        ] },
        try: { tool: 'numberline', opts: { min: 200, max: 500, tick: 10, every: 50, start: 230, step: [100, 10] }, tasks: [
          { do: 'Start at 230. Add <b>140</b> with jumps of 100 and 10.', goal: function (s) { return s.at === 370; }, yes: '230 + 100 = 330, then 4 jumps of 10: 370.' }
        ] },
        key: '<p>Split the number. Jump hundreds, then tens, then ones.</p>',
        check: [TU('s3', 0), SK('as-mental', 1)] },

      { id: 'friendly', title: 'Use a friendly number', exp: ['B2.3'], skill: 'as-mental', hard: true,
        body: '<p>Numbers like 99 or 198 are close to a <b>friendly number</b>. To add 99, add 100, then take back 1.</p>',
        watch: { mount: G3.view(jumpView, { start: 245, parts: [100, 1], op: '+', k: 0, back: true }), steps: [
          { say: '245 + 99. 99 is almost 100.', ms: 1300 },
          { say: 'Add 100: 345.', act: function (t) { return t.set({ k: 1 }, 1400); } },
          { say: 'That was 1 too many. Take back 1: <b>344</b>.', act: function (t) { return t.set({ parts: [100], k: 1, start: 245, op: '+' }).then(function () { return t.set({ start: 345, parts: [1], op: '-', k: 1 }, 2000); }); } }
        ] },
        example: { mount: G3.view(jumpView, { start: 368, parts: [100], op: '+', k: 0 }), steps: [
          { say: 'My turn. I will add 368 + 98. 98 is almost 100.', ms: 1400 },
          { say: 'I add 100 instead: 468.', act: function (t) { return t.set({ k: 1 }, 1400); } },
          { say: '100 is 2 more than 98. So I take back 2: <b>466</b>.', act: function (t) { return t.set({ start: 468, parts: [2], op: '-', k: 1 }, 2000); } },
          { say: '368 + 98 = 466. I used a friendly number, then fixed the difference.', ms: 2000 }
        ] },
        ways: [
          { label: 'Make a ten first', html: '<p>To add 38 + 7, take 2 from the 7 to make 40, then add the 5 left: 45.</p>' },
          { label: 'With money', html: '<p>Something costs $99. Pay $100 and get $1 back. Adding $99 is the same as adding $100 and taking away $1.</p>' }
        ],
        key: '<p>Round to a friendly number, then fix the difference.</p>',
        mistake: '<p>Adding 100 and forgetting to take back the extra 1. Ask: "Did we add too much? By how much?"</p>',
        check: [TU('s3', 1), TU('s3', 2), SK('as-mental', 2)] }
    ] },

    { id: 'estimate', title: 'Estimate and check', sub: 'Is the answer about right?', concepts: [
      { id: 'round', title: 'Estimate by rounding', exp: ['B2.3'], skill: 'as-estimate',
        body: '<p>To <b>estimate</b>, round each number to a friendly number, then add or subtract. 312 + 487 is about 300 + 500 = <b>800</b>.</p>',
        watch: { tool: 'numberline', opts: { min: 200, max: 600, tick: 10, every: 100, start: 312 }, steps: [
          { say: '312 is close to 300.', act: function (t) { return t.mark(312, '312').then(function () { return t.moveTo(300); }); } },
          { say: '487 is close to 500.', act: function (t) { return t.mark(487, '487').then(function () { return t.moveTo(500); }); } },
          { say: '300 + 500 = 800. The exact answer, 799, is very close.', ms: 2200 }
        ] },
        example: { tool: 'numberline', opts: { min: 100, max: 500, tick: 10, every: 100, start: 178 }, steps: [
          { say: 'My turn. I will estimate 178 + 421.', ms: 1200 },
          { say: '178 is close to 200.', act: function (t) { return t.mark(178, '178').then(function () { return t.moveTo(200); }); } },
          { say: '421 is close to 400.', act: function (t) { return t.mark(421, '421').then(function () { return t.moveTo(400); }); } },
          { say: 'I add the rounded numbers: 200 + 400 = 600. The exact answer, 599, is very close.', ms: 2200 }
        ] },
        key: '<p>Round, then calculate. The estimate tells you <b>about</b> how big.</p>',
        mistake: '<p>Using the estimate as the answer. An estimate is a check, not the answer.</p>',
        check: [TU('s4', 0), TU('s4', 2), SK('as-estimate', 1)] },

      { id: 'sense', title: 'Does the answer make sense?', exp: ['B2.3'], skill: 'as-estimate',
        body: '<p>After you calculate, compare with your estimate. If the answer is far away, check your work again.</p>',
        watch: { mount: G3.view(function (s) { return '<div>' + column(612, 298, '-', 3).replace(/>314</, '>' + s.ans + '<') + '<p class="g3-sym" style="font-size:1.05rem;color:var(--ink)">' + s.say + '</p></div>'; }, { ans: 314, say: '' }), steps: [
          { say: 'Mia worked out 612 &minus; 298.', ms: 1200 },
          { say: 'Estimate: 600 &minus; 300 = 300.', act: function (t) { return t.set({ say: 'Estimate: 600 &minus; 300 = 300' }, 1600); } },
          { say: 'Her answer is 314. That is close to 300, so it makes sense.', act: function (t) { return t.set({ say: '314 is close to 300. It makes sense.' }, 2000); } }
        ] },
        example: { mount: G3.view(colView, { a: 512, b: 296, op: '-', k: 3, say: 'Sam got 216.' }), steps: [
          { say: 'My turn. Sam worked out 512 &minus; 296 and got 216. I check if that makes sense.', ms: 1800 },
          { say: 'I round: 512 is close to 500, and 296 is close to 300.', act: function (t) { return t.set({ say: 'Estimate: 500 &minus; 300' }, 1600); } },
          { say: '500 &minus; 300 = 200.', act: function (t) { return t.set({ say: 'Estimate: 500 &minus; 300 = 200' }, 1400); } },
          { say: '216 is close to 200, so the answer makes sense.', ms: 2000 }
        ] },
        key: '<p>Close to the estimate? Good. Far away? Check again.</p>',
        check: [TU('s4', 1), SK('as-estimate', 2)] }
    ] },

    { id: 'equal', title: 'Equal sides and word problems', sub: 'The equal sign means both sides are the same.', concepts: [
      { id: 'balance', title: 'Both sides are equal', exp: ['C2.3'], skill: 'as-equal', hard: true,
        body: '<p>The <b>=</b> sign means "is the same as". Both sides must have the same value, like a balance that is level.</p>',
        watch: { mount: G3.view(balView, { l: '200 + 50', r: '150 + ?', ok: false }), steps: [
          { say: 'The left side is 200 + 50 = 250.', ms: 1500 },
          { say: 'The right side has 150 and a missing number.', ms: 1400 },
          { say: 'Try 50: 150 + 50 = 200. Not level.', act: function (t) { return t.set({ r: '150 + 50' }, 1600); } },
          { say: 'Try 100: 150 + 100 = 250. Level! The missing number is <b>100</b>.', act: function (t) { return t.set({ r: '150 + 100', ok: true }, 2200); } }
        ] },
        example: { mount: G3.view(balView, { l: '300 + 40', r: '? + 90', ok: false }), steps: [
          { say: 'My turn. The left side is 300 + 40 = 340.', ms: 1500 },
          { say: 'The right side has a missing number and 90. It must make 340 too.', ms: 1600 },
          { say: 'I think: what plus 90 makes 340? 340 &minus; 90 = 250.', ms: 1800 },
          { say: 'I check: 250 + 90 = 340. Level! The missing number is <b>250</b>. Both sides have the same value.', act: function (t) { return t.set({ r: '250 + 90', ok: true }, 2200); } }
        ] },
        ways: [
          { label: 'Work out one side first', html: '<p>Find the value of the full side: 200 + 50 = 250. Then ask: 150 plus what makes 250? Count up from 150: <b>100</b>.</p>' },
          { label: 'Move some across', html: '<p>Take 50 from the 200 and give it to the 50. 200 + 50 = 150 + 100. The total does not change.</p>' }
        ],
        try: { mount: G3.play({ state: { x: 40 }, sliders: [{ key: 'x', label: 'Missing number', min: 0, max: 200, step: 10 }],
          draw: function (s) { return balance('320 + 80', '300 + ' + s.x, 300 + s.x === 400); },
          info: function (s) { return '320 + 80 = 400. 300 + ' + s.x + ' = ' + (300 + s.x) + '.'; },
          tasks: [{ do: 'Make the balance level.', goal: function (s) { return s.x === 100; }, yes: '320 + 80 = 300 + 100. Both sides are 400.' }] }), do: '' },
        key: '<p><b>=</b> means both sides have the same value.</p>',
        mistake: '<p>Reading = as "the answer is". In 400 + 30 = ___ + 10 some children write 430. Have them check that both sides match.</p>',
        check: [TU('s5', 0), TU('s5', 1), TU('s5', 2), SK('as-equal', 1)] },

      { id: 'word', title: 'Solve word problems', exp: ['B2.5'], skill: 'as-word',
        body: '<p>Read the story and ask: are things being <b>joined</b> (add), or is something <b>taken away</b> or <b>compared</b> (subtract)? Then estimate, solve, and check.</p>',
        watch: { mount: G3.view(storyView, { a: 325, b: 148, op: '+', k: 0, say: 'A library has 325 books. It gets 148 more. How many now?' }), steps: [
          { say: 'More books are joined to the library. That means <b>add</b>.', ms: 1800 },
          { say: 'Estimate: 300 + 150 = 450.', act: function (t) { return t.set({ say: 'Estimate: 300 + 150 = 450' }, 1600); } },
          { say: 'Add in columns.', act: function (t) { return t.set({ k: 3, say: '325 + 148 = 473' }, 2000); } },
          { say: '473 is close to 450. The library has <b>473 books</b>.', ms: 2000 }
        ] },
        example: { mount: G3.view(storyView, { a: 615, b: 192, op: '-', k: 0, say: 'A farm has 615 eggs. It sells 192. How many eggs are left?' }), steps: [
          { say: 'My turn. Some eggs are taken away. That means I <b>subtract</b>.', ms: 1800 },
          { say: 'I estimate: 600 &minus; 200 = 400.', act: function (t) { return t.set({ say: 'Estimate: 600 &minus; 200 = 400' }, 1600); } },
          { say: 'I subtract in columns.', act: function (t) { return t.set({ k: 3, say: '615 &minus; 192 = 423' }, 2000); } },
          { say: '423 is close to 400. The farm has <b>423 eggs</b> left.', ms: 2000 }
        ] },
        key: '<p>Joining: add. Taking away or comparing: subtract.</p>',
        check: [SK('as-word', 1), SK('as-word', 2)] }
    ] }
  ];

  A.register('add-subtract', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Adding with blocks and columns</h2>' +
'<p>To add, put the blocks together. If you get <b>10 or more</b> of one kind, trade 10 of them for 1 of the next bigger kind. This is called <b>regrouping</b>.</p>' +
'<p>The column method does the same thing with digits. Line up the places. Add the ones first, then the tens, then the hundreds.</p>' +
'<div class="lab"><span class="lt">Try it: add in columns</span>' +
'<div class="ctrl"><label for="ada">First number<input type="number" id="ada" min="0" max="999" value="368"></label><label for="adb">Second number<input type="number" id="adb" min="0" max="999" value="257"></label></div>' +
'<div class="vrow" id="adblk"></div><div class="fig" id="adcol"></div><div class="out" id="adout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Always start with the <b>ones</b>. Then a carried 1 has a place to go.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Add 245 + 138. Ones: 5 + 8 = 13. Write 3, carry 1 ten. Tens: 4 + 3 + 1 = 8. Hundreds: 2 + 1 = 3. The answer is <b>383</b>.</p><div class="fig">' + column(245, 138, '+') + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Subtracting with blocks and columns</h2>' +
'<p>To subtract, take blocks away. If there are not enough of one kind, trade 1 bigger block for 10 smaller ones first. Then take away.</p>' +
'<div class="lab"><span class="lt">Try it: subtract in columns</span>' +
'<div class="ctrl"><label for="sba">Start with<input type="number" id="sba" min="0" max="1000" value="503"></label><label for="sbb">Take away<input type="number" id="sbb" min="0" max="1000" value="267"></label></div>' +
'<div class="vrow" id="sbblk"></div><div class="fig" id="sbcol"></div><div class="out" id="sbout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Taking the smaller digit from the bigger one, whichever is on top. In 52 &minus; 17, you cannot do 7 &minus; 2. Trade a ten: 12 &minus; 7 = 5 ones. The answer is 35, not 45.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Subtract 400 &minus; 156. There are no ones or tens to take from. Trade 1 hundred for 10 tens, then 1 ten for 10 ones. Now 10 &minus; 6 = 4, 9 &minus; 5 = 4, 3 &minus; 1 = 2. The answer is <b>244</b>.</p><div class="fig">' + column(400, 156, '-') + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Mental math: jump on a number line</h2>' +
'<p>You can add or subtract in your head by making jumps. Keep the first number whole. Jump by the hundreds, then the tens, then the ones.</p>' +
'<div class="lab"><span class="lt">Try it: make the jumps</span>' +
'<div class="ctrl"><label for="jma">Start at<input type="number" id="jma" min="0" max="1000" value="246"></label>' +
'<label for="jmo">Do<select id="jmo"><option value="+">add</option><option value="-">take away</option></select></label>' +
'<label for="jmb">This much<input type="number" id="jmb" min="0" max="1000" value="132"></label></div>' +
'<div class="fig" id="jmfig"></div><div class="out" id="jmout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Friendly numbers make mental math easy. To add 99, add 100 and then take away 1. 245 + 99 = 345 &minus; 1 = <b>344</b>.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find 500 &minus; 270 by counting up. From 270, jump 30 to reach 300. Then jump 200 to reach 500. 30 + 200 = <b>230</b>.</p><div class="fig">' + jumps(270, [30, 200], '+') + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Estimate first, then check</h2>' +
'<p>An <b>estimate</b> is a close answer that is easy to find. Round each number, then add or subtract. If your exact answer is far from the estimate, check your work.</p>' +
'<div class="lab"><span class="lt">Try it: estimate and compare</span>' +
'<div class="ctrl"><label for="esa">First number<input type="number" id="esa" min="0" max="999" value="487"></label>' +
'<label for="eso">Do<select id="eso"><option value="+">add</option><option value="-">subtract</option></select></label>' +
'<label for="esb">Second number<input type="number" id="esb" min="0" max="999" value="312"></label>' +
'<label for="esr">Round to the nearest<select id="esr"><option value="10">ten</option><option value="100" selected>hundred</option></select></label></div>' +
'<div class="fig" id="esfig"></div><div class="out" id="esout" aria-live="polite"></div></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Sam says 389 + 204 = 893. Estimate: 400 + 200 = 600. 893 is far from 600, so Sam should check. The real answer is <b>593</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Using the estimate as the answer. An estimate tells you <b>about</b> how big the answer is. You still work out the exact answer.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Both sides are equal</h2>' +
'<p>The <b>=</b> sign means "is the same as". The two sides of an equation balance, like a pan balance. <span class="math">300 + 250 = 500 + 50</span> is true, because both sides are 550.</p>' +
'<div class="lab"><span class="lt">Try it: balance the two sides</span>' +
'<div class="ctrl"><label for="bla">Left side: first number<input type="number" id="bla" min="0" max="500" value="300"></label><label for="blb">Left side: second number<input type="number" id="blb" min="0" max="500" value="250"></label>' +
'<label for="blc">Right side: first number<input type="number" id="blc" min="0" max="1000" value="500"></label></div>' +
'<div class="fig" id="blfig"></div><div class="out" id="blout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>If you take some from one part and give it to the other part, the total stays the same. 398 + 245 = 400 + 243.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find the missing number: <span class="math">120 + 80 = 150 + ___</span>. The left side is 200. 150 + 50 = 200, so the missing number is <b>50</b>.</p><div class="fig">' + balance('120 + 80', '150 + 50', true) + '</div></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'Add the ones first: <span class="math">47 + 25</span>. What is 7 + 5?', options: ['2', '12', '72'], answer: 1, why: 'Add just the ones digits: 7 + 5.' },
        { q: '7 + 5 = 12 ones. What do you write in the ones place?', options: ['1', '2', '12'], answer: 1, why: '12 ones is 1 ten and 2 ones. Write the 2 and carry the 1 ten.' },
        { q: 'What is <span class="math">47 + 25</span>?', options: ['62', '72', '612'], answer: 1, why: 'Tens: 4 + 2 + the carried 1 = 7. Ones: 2. The answer is 72.' }
      ],
      s2: [
        { q: 'In <span class="math">52 &minus; 17</span>, can you take 7 ones from 2 ones?', options: ['Yes', 'No'], answer: 1, why: '2 is less than 7. You need to trade a ten first.' },
        { q: 'Trade 1 ten for 10 ones. Now you have how many ones?', options: ['10', '12', '20'], answer: 1, why: 'You had 2 ones. 10 more makes 12.' },
        { q: 'What is <span class="math">52 &minus; 17</span>?', options: ['35', '45', '25'], answer: 0, why: 'Ones: 12 &minus; 7 = 5. Tens: 4 &minus; 1 = 3. The answer is 35.' }
      ],
      s3: [
        { q: 'What is <span class="math">460 + 300</span>?', options: ['490', '760', '763'], answer: 1, why: 'Add 3 hundreds. Only the hundreds digit changes: 4 + 3 = 7.' },
        { q: 'What is <span class="math">245 + 99</span>?', options: ['334', '344', '345'], answer: 1, why: 'Add 100 to get 345, then take away 1.' },
        { q: 'Count up from 680 to 700. How far is it?', options: ['20', '30', '120'], answer: 0, why: '680, 690, 700. That is 2 jumps of 10.' }
      ],
      s4: [
        { q: 'Round to the nearest hundred, then add: <span class="math">312 + 487</span>. What is the estimate?', options: ['700', '800', '900'], answer: 1, why: '312 rounds to 300. 487 rounds to 500. 300 + 500 = 800.' },
        { q: 'Mia says <span class="math">612 &minus; 298 = 414</span>. Estimate: 600 &minus; 300 = 300. Is her answer reasonable?', options: ['Yes', 'No, check it'], answer: 1, why: '414 is far from 300. The real answer is 314.' },
        { q: 'Which is the best estimate for <span class="math">49 + 32</span>?', options: ['50 + 30 = 80', '40 + 30 = 70', '50 + 40 = 90'], answer: 0, why: 'Round each number to the nearest ten: 49 rounds to 50, 32 rounds to 30.' }
      ],
      s5: [
        { q: 'Is <span class="math">200 + 50 = 150 + 100</span> true?', options: ['True', 'False'], answer: 0, why: 'Work out each side: 200 + 50 = 250 and 150 + 100 = 250.' },
        { q: 'Find the missing number: <span class="math">400 + 30 = 420 + ___</span>', options: ['10', '20', '30'], answer: 0, why: 'The left side is 430. 420 + 10 = 430.' },
        { q: 'Is <span class="math">90 + 15 = 100 + 15</span> true?', options: ['True', 'False'], answer: 1, why: 'The left side is 105. The right side is 115. They are not equal.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function addW() {
        var a = clamp($('#ada', root).value, 0, 999), b = clamp($('#adb', root).value, 0, 999);
        if (a + b > 1000) b = 1000 - a;
        $('#adblk', root).innerHTML = '<figure><figcaption>' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure><figure><figcaption>+ ' + b + '</figcaption>' + A.draw.blocks(b, 'Blocks for ' + b, 330, 4) + '</figure>' +
          '<figure><figcaption>Together: ' + (a + b) + '</figcaption>' + A.draw.blocks(a + b, 'Blocks for ' + (a + b), 330, 4) + '</figure>';
        $('#adcol', root).innerHTML = column(a, b, '+');
        $('#adout', root).innerHTML = '<p><span class="big">' + a + ' + ' + b + ' = ' + (a + b) + '</span></p><ol>' + regroupText(a, b, '+').map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol>' +
          (+$('#adb', root).value > b ? '<p class="t2">This chapter keeps totals up to 1000, so the second number was set to ' + b + '.</p>' : '');
      }
      A.bind(root, ['ada', 'adb'], addW);
      function subW() {
        var a = clamp($('#sba', root).value, 0, 1000), b = clamp($('#sbb', root).value, 0, 1000), note = '';
        if (b > a) { note = '<p class="t2">You cannot take away more than you have here, so the numbers were swapped.</p>'; var t = a; a = b; b = t; }
        var res = a - b;
        $('#sbblk', root).innerHTML = '<figure><figcaption>Start: ' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure><figure><figcaption>Left after taking ' + b + ': ' + res + '</figcaption>' + A.draw.blocks(res, 'Blocks for ' + res, 330, 4) + '</figure>';
        $('#sbcol', root).innerHTML = column(a, b, '-');
        $('#sbout', root).innerHTML = '<p><span class="big">' + a + ' &minus; ' + b + ' = ' + res + '</span></p><ol>' + regroupText(a, b, '-').map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol>' +
          '<p class="t2">Check: ' + res + ' + ' + b + ' = ' + a + '.</p>' + note;
      }
      A.bind(root, ['sba', 'sbb'], subW);
      function jm() {
        var a = clamp($('#jma', root).value, 0, 1000), op = $('#jmo', root).value, b = clamp($('#jmb', root).value, 0, 1000), note = '';
        if (op === '+' && a + b > 1000) { b = 1000 - a; note = 'To stay at 1000 or less, the jump was set to ' + b + '. '; }
        if (op === '-' && b > a) { b = a; note = 'You cannot go below 0 here, so the jump was set to ' + b + '. '; }
        var parts = splitPlaces(b);
        if (!parts.length) { $('#jmfig', root).innerHTML = ''; $('#jmout', root).innerHTML = '<p>' + note + 'There is nothing to jump. ' + a + (op === '+' ? ' + 0 = ' : ' &minus; 0 = ') + a + '.</p>'; return; }
        var res = op === '+' ? a + b : a - b;
        $('#jmfig', root).innerHTML = jumps(a, parts, op);
        $('#jmout', root).innerHTML = '<p><span class="big">' + a + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + ' = ' + res + '</span></p><p>' + note + 'Split ' + b + ' into ' + parts.join(' + ') + '. Make one jump for each part.</p>';
      }
      A.bind(root, ['jma', 'jmo', 'jmb'], jm);
      function es() {
        var a = clamp($('#esa', root).value, 0, 999), b = clamp($('#esb', root).value, 0, 999), op = $('#eso', root).value, p = +$('#esr', root).value;
        if (op === '-' && b > a) { var t = a; a = b; b = t; }
        var ra = Math.floor((a + p / 2) / p) * p, rb = Math.floor((b + p / 2) / p) * p, est = op === '+' ? ra + rb : ra - rb, ex = op === '+' ? a + b : a - b, sym = op === '+' ? '+' : '&minus;';
        var hi = Math.max(est, ex, 100), top = Math.ceil(hi / 100) * 100 + 100, s = '';
        s += '<line x1="30" y1="60" x2="530" y2="60" style="stroke:var(--ink)" stroke-width="2.5"/>';
        for (var v = 0; v <= top; v += 100) { var x = 30 + 500 * v / top; s += '<line x1="' + x + '" y1="52" x2="' + x + '" y2="68" style="stroke:var(--ink)" stroke-width="2"/>' + (top <= 1200 || v % 200 === 0 ? '<text x="' + x + '" y="88" text-anchor="middle" font-size="16">' + v + '</text>' : ''); }
        var xe = 30 + 500 * est / top, xx = 30 + 500 * ex / top;
        s += '<circle cx="' + xe + '" cy="60" r="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + xe + '" y="34" text-anchor="middle" font-size="17" class="tb">estimate ' + est + '</text>';
        s += '<circle cx="' + xx + '" cy="60" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/><text x="' + xx + '" y="' + (Math.abs(xx - xe) < 110 ? 112 : 34) + '" text-anchor="middle" font-size="17" class="tb">exact ' + ex + '</text>';
        $('#esfig', root).innerHTML = A.svg(560, 118, s, 'Number line: the estimate ' + est + ' and the exact answer ' + ex);
        $('#esout', root).innerHTML = '<p>Round: ' + a + ' &#8776; ' + ra + ' and ' + b + ' &#8776; ' + rb + '.</p><p><b>Estimate:</b> ' + ra + ' ' + sym + ' ' + rb + ' = <b>' + est + '</b>. <b>Exact:</b> ' + a + ' ' + sym + ' ' + b + ' = <b>' + ex + '</b>.</p><p>They are ' + Math.abs(est - ex) + ' apart.</p>';
      }
      A.bind(root, ['esa', 'esb', 'eso', 'esr'], es);
      function bl() {
        var a = clamp($('#bla', root).value, 0, 500), b = clamp($('#blb', root).value, 0, 500), c = clamp($('#blc', root).value, 0, 1000), tot = a + b, m = tot - c;
        if (m < 0) {
          $('#blfig', root).innerHTML = balance(a + ' + ' + b, c + ' + ?', false);
          $('#blout', root).innerHTML = '<p>The left side is ' + tot + '. The right side already has ' + c + ', which is more than ' + tot + '. No whole number can balance it. Try a smaller number on the right.</p>';
          return;
        }
        $('#blfig', root).innerHTML = balance(a + ' + ' + b, c + ' + <tspan style="fill:var(--accent)">' + m + '</tspan>', true);
        $('#blout', root).innerHTML = '<p><span class="big">' + a + ' + ' + b + ' = ' + c + ' + ' + m + '</span></p><p>The left side is ' + tot + '. ' + c + ' + ' + m + ' = ' + tot + ', so the missing number is <b>' + m + '</b>.</p>';
      }
      A.bind(root, ['bla', 'blb', 'blc'], bl);
    },

    quiz: [
      { q: 'What is <span class="math">356 + 278</span>?', type: 'num', answer: 634,
        hint: 'Add the ones first: 6 + 8 = 14. Write 4 and carry 1.', explain: 'Ones: 14, write 4 carry 1. Tens: 5 + 7 + 1 = 13, write 3 carry 1. Hundreds: 3 + 2 + 1 = 6. The answer is 634.' },
      { q: 'What is <span class="math">700 &minus; 245</span>?', type: 'num', answer: 455,
        hint: 'There are no tens or ones in 700. Trade 1 hundred for 10 tens, then 1 ten for 10 ones.', explain: '700 becomes 6 hundreds, 9 tens, 10 ones. 10 &minus; 5 = 5, 9 &minus; 4 = 5, 6 &minus; 2 = 4. The answer is 455.' },
      { q: 'Which jumps show <span class="math">325 + 140</span>?', type: 'mc', options: ['325 &rarr; 425 &rarr; 465', '325 &rarr; 340 &rarr; 465', '325 &rarr; 365 &rarr; 375'], answer: 0, fig: jumps(325, [100, 40], '+'),
        hint: 'Split 140 into 100 and 40. Jump 100 first.', explain: '325 + 100 = 425. 425 + 40 = 465.' },
      { q: 'What is <span class="math">399 + 250</span>? Use a friendly number.', type: 'num', answer: 649,
        hint: '399 is 1 less than 400. Add 400 + 250, then take away 1.', explain: '400 + 250 = 650. 650 &minus; 1 = 649.' },
      { q: 'Round each number to the nearest hundred to estimate <span class="math">612 + 291</span>.', type: 'mc', options: ['800', '900', '1000', '903'], answer: 1,
        hint: '612 rounds to 600. What does 291 round to?', explain: '600 + 300 = 900. The exact answer, 903, is close.' },
      { q: 'Find the missing number: <span class="math">250 + 150 = 300 + ___</span>', type: 'num', answer: 100, fig: balance('250 + 150', '300 + ?', true),
        hint: 'Work out the left side first.', explain: 'The left side is 400. 300 + 100 = 400.' },
      { q: 'A school library has 834 books. 258 books are signed out. How many books are still on the shelves?', type: 'num', answer: 576,
        hint: 'Books on the shelves = all the books &minus; the books signed out.', explain: '834 &minus; 258 = 576. Check: 576 + 258 = 834.' }
    ],

    practice: [
      { id: 'as-add', name: 'Add in columns', code: 'B2.5', gen: function (lv) {
        var a, b, ok = false;
        while (!ok) {
          a = R.int(lv === 1 ? 20 : 100, lv === 1 ? 599 : 699); b = R.int(lv === 1 ? 10 : 100, 1000 - a);
          var da = dg(a), db = dg(b), c0 = da[0] + db[0] >= 10, c1 = da[1] + db[1] + (c0 ? 1 : 0) >= 10;
          ok = lv === 1 ? !c0 && !c1 : lv === 2 ? (c0 !== c1) : (c0 && c1);
          if (a + b > 1000) ok = false;
        }
        var st = regroupText(a, b, '+');
        return { q: 'What is <span class="math">' + a + ' + ' + b + '</span>?', type: 'num', answer: a + b,
          fig: lv === 1 ? '<div class="vrow"><figure><figcaption>' + a + '</figcaption>' + A.draw.blocks(a, 'Blocks for ' + a, 330, 4) + '</figure><figure><figcaption>+ ' + b + '</figcaption>' + A.draw.blocks(b, 'Blocks for ' + b, 330, 4) + '</figure></div>' : '',
          hint: 'Line up the places. Add the ones first. If you get 10 or more, carry 1 to the next place.',
          steps: st.concat(['The answer is ' + (a + b) + '.<div class="fig">' + column(a, b, '+') + '</div>']),
          explain: a + ' + ' + b + ' = ' + (a + b) + '.' };
      } },
      { id: 'as-sub', name: 'Subtract in columns', code: 'B2.5', gen: function (lv) {
        var a, b, ok = false;
        while (!ok) {
          if (lv === 3) { a = R.int(1, 9) * 100 + R.pick([0, R.int(1, 9)]) ; if (a % 100 >= 10) a = Math.floor(a / 100) * 100 + R.int(0, 9); }
          else a = R.int(lv === 1 ? 30 : 120, 999);
          b = R.int(10, a - 1);
          var da = dg(a), db = dg(b), bo0 = da[0] < db[0], bo1 = da[1] - (bo0 ? 1 : 0) < db[1];
          ok = lv === 1 ? !bo0 && !bo1 : lv === 2 ? (bo0 !== bo1) : (bo0 && bo1 && da[1] === 0);
        }
        return { q: 'What is <span class="math">' + a + ' &minus; ' + b + '</span>?', type: 'num', answer: a - b,
          fig: lv === 1 ? A.draw.blocks(a, 'Blocks for ' + a, 540, 5) : '',
          hint: lv === 3 ? 'There are no tens to trade. Trade 1 hundred for 10 tens first, then 1 ten for 10 ones.' : 'Start with the ones. If the top digit is smaller, trade 1 from the next place first.',
          steps: regroupText(a, b, '-').concat(['The answer is ' + (a - b) + '. Check: ' + (a - b) + ' + ' + b + ' = ' + a + '.<div class="fig">' + column(a, b, '-') + '</div>']),
          explain: a + ' &minus; ' + b + ' = ' + (a - b) + '.' };
      } },
      { id: 'as-mental', name: 'Mental math', code: 'B2.3', gen: function (lv) {
        var a, b, op = R.pick(['+', '-']), hint, steps;
        if (lv === 1) {
          var unit = R.pick([10, 100]);
          b = R.int(1, unit === 10 ? 9 : 4) * unit;
          a = R.int(1, 50) * 10 + R.int(0, 9);
          if (op === '+' && a + b > 1000) op = '-';
          if (op === '-' && b > a) op = '+';
          hint = 'Only the ' + (unit === 10 ? 'tens' : 'hundreds') + ' digit should change' + (unit === 10 ? ', unless you pass a hundred.' : '.');
          steps = ['Split nothing: ' + b + ' is all ' + (unit === 10 ? 'tens' : 'hundreds') + '.', 'Jump ' + (op === '+' ? 'forward ' : 'back ') + b + ' from ' + a + '.', 'You land on ' + (op === '+' ? a + b : a - b) + '.<div class="fig">' + jumps(a, [b], op) + '</div>'];
        } else if (lv === 2) {
          var near = R.pick([99, 199, 299, 98, 101, 201]);
          a = R.int(12, 60) * 10 + R.int(0, 9); b = near; op = '+';
          if (a + b > 1000) a = R.int(100, 400);
          var fr = Math.round(near / 100) * 100, diff = fr - near;
          hint = b + ' is close to ' + fr + '. Add ' + fr + ', then fix it.';
          steps = [b + ' is ' + (diff > 0 ? diff + ' less than ' : -diff + ' more than ') + fr + '.', a + ' + ' + fr + ' = ' + (a + fr) + '.', (diff > 0 ? 'Take away ' + diff : 'Add ' + (-diff)) + ': ' + (a + b) + '.'];
        } else {
          b = R.int(11, 60) * 10 + R.pick([0, 0, 5]); a = R.pick([500, 600, 700, 800, 900, 1000]); op = '-';
          if (b >= a) b = a - R.int(11, 40) * 5;
          var nh = Math.ceil(b / 100) * 100;
          hint = 'Count up from ' + b + ' to ' + a + '. Jump to the next hundred first.';
          steps = ['From ' + b + ', jump ' + (nh - b) + ' to reach ' + nh + '.', 'From ' + nh + ', jump ' + (a - nh) + ' to reach ' + a + '.', (nh - b) + ' + ' + (a - nh) + ' = ' + (a - b) + '.<div class="fig">' + jumps(b, [nh - b, a - nh].filter(function (x) { return x; }), '+') + '</div>'];
        }
        var res = op === '+' ? a + b : a - b;
        return { q: 'Use mental math: <span class="math">' + a + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + '</span>', type: 'num', answer: res, hint: hint, steps: steps,
          explain: a + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b + ' = ' + res + '.' };
      } },
      { id: 'as-estimate', name: 'Estimate by rounding', code: 'B2.3', gen: function (lv) {
        var p = lv === 1 ? 10 : 100, a = lv === 1 ? R.int(11, 89) : R.int(110, 690), b = lv === 1 ? R.int(11, 89) : R.int(110, 1000 - a - 10), op = lv === 3 ? '-' : '+';
        if (op === '-' && b > a) { var t = a; a = b; b = t; }
        if (lv === 1 && op === '+' && (a % 10 === 5 || b % 10 === 5)) a += 1;
        var ra = Math.floor((a + p / 2) / p) * p, rb = Math.floor((b + p / 2) / p) * p, est = op === '+' ? ra + rb : ra - rb;
        var o = R.mc(est, [est + p, est - p, op === '+' ? a + b : a - b].filter(function (v) { return v !== est && v >= 0; }));
        var nm = p === 10 ? 'ten' : 'hundred', sym = op === '+' ? '+' : '&minus;';
        return { q: 'Round each number to the nearest ' + nm + ' to estimate <span class="math">' + a + ' ' + sym + ' ' + b + '</span>.', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Round ' + a + ' first. Then round ' + b + '. Then ' + (op === '+' ? 'add' : 'subtract') + '.',
          steps: [a + ' rounds to ' + ra + '.', b + ' rounds to ' + rb + '.', ra + ' ' + sym + ' ' + rb + ' = ' + est + '.'],
          explain: 'The estimate is ' + est + '. The exact answer is ' + (op === '+' ? a + b : a - b) + ', which is close.' };
      } },
      { id: 'as-equal', name: 'Missing number to balance', code: 'C2.3', gen: function (lv) {
        var a, b, c, m, left, right;
        if (lv < 3) {
          a = R.int(1, lv === 1 ? 5 : 40) * (lv === 1 ? 100 : 10); b = R.int(1, lv === 1 ? 4 : 30) * (lv === 1 ? 100 : 10);
          c = R.int(1, Math.max(1, Math.floor((a + b) / 10) - 1)) * 10; m = a + b - c;
          left = a + ' + ' + b; right = c + ' + ___';
        } else {
          a = R.int(30, 90) * 10; b = R.int(1, Math.floor(a / 10) - 1) * 10; c = R.int(a - b + 10, 990); m = c - (a - b);
          left = a + ' &minus; ' + b; right = c + ' &minus; ___';
        }
        return { q: 'Find the missing number: <span class="math">' + left + ' = ' + right + '</span>', type: 'num', answer: m,
          fig: balance(left, right.replace('___', '?'), true),
          hint: 'Work out the left side first. Then ask what the right side needs to match it.',
          steps: ['The left side is ' + (lv < 3 ? a + b : a - b) + '.', lv < 3 ? c + ' + ? = ' + (a + b) + '. Count up from ' + c + ' to ' + (a + b) + '.' : c + ' &minus; ? = ' + (a - b) + '. Take away from ' + c + ' until you reach ' + (a - b) + '.', 'The missing number is ' + m + '.'],
          explain: left + ' = ' + right.replace('___', m) + '. Both sides are ' + (lv < 3 ? a + b : a - b) + '.' };
      } },
      { id: 'as-word', name: 'Word problems', code: 'B2.5', gen: function (lv) {
        var T = [
          { op: '+', t: function (a, b) { return 'A school has ' + a + ' students. ' + b + ' more students join. How many students are there now?'; } },
          { op: '+', t: function (a, b) { return 'Ava read ' + a + ' pages in May and ' + b + ' pages in June. How many pages did she read in all?'; } },
          { op: '-', t: function (a, b) { return 'A farm had ' + a + ' apples. It sold ' + b + ' apples. How many apples are left?'; } },
          { op: '-', t: function (a, b) { return 'A hike is ' + a + ' metres long. Leo has walked ' + b + ' metres. How many metres are left to walk?'; } },
          { op: '-', t: function (a, b) { return 'Box A holds ' + a + ' beads. Box B holds ' + b + ' beads. How many more beads are in Box A?'; } }
        ];
        var tp = R.pick(T), a, b;
        if (tp.op === '+') { a = R.int(lv === 1 ? 100 : 150, lv === 1 ? 500 : 700); b = R.int(lv === 1 ? 100 : 120, 1000 - a); if (lv === 1) { a = Math.floor(a / 10) * 10; b = Math.floor(b / 10) * 10 + R.int(0, 9 - a % 10); } }
        else { a = R.int(lv === 1 ? 300 : 400, 1000); b = R.int(lv === 1 ? 100 : 150, a - 50); if (lv === 1) b = Math.floor(b / 100) * 100 + Math.min(a % 100, R.int(0, 99)); }
        if (b < 1) b = 1;
        if (tp.op === '+' && a + b > 1000) b = 1000 - a;
        var res = tp.op === '+' ? a + b : a - b, sym = tp.op === '+' ? '+' : '&minus;';
        return { q: tp.t(a, b), type: 'num', answer: res,
          hint: tp.op === '+' ? 'Things are being put together, so add.' : 'Something is taken away or compared, so subtract.',
          steps: ['Decide: ' + (tp.op === '+' ? 'put together, so add.' : 'take away or compare, so subtract.'), 'Write it: ' + a + ' ' + sym + ' ' + b + '.', a + ' ' + sym + ' ' + b + ' = ' + res + '.'],
          explain: a + ' ' + sym + ' ' + b + ' = ' + res + '.' };
      } }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ----------
     Each practice skill keeps its first way of asking ("plain") and adds new shapes.
     Shapes unlock with the level, so level 1 stays gentle. q.meta is read by the automatic answer checks. */
  var Q = A.Q;
  if (Q) (function () {
    var nm = Q.name, M = '&minus;';
    function why(right, wrong) { var o = R.mc(right, wrong); return { options: o.options, answer: o.answer }; }
    function sym(op) { return op === '+' ? '+' : M; }
    function calc(a, b, op) { return op === '+' ? a + b : a - b; }
    /* a pair with no carrying (gentle) or with carrying, sum at most 999 */
    function addPair(lv) {
      for (;;) {
        var a = R.int(lv === 1 ? 110 : 120, 700), b = R.int(lv === 1 ? 101 : 110, 999 - a), da = dg(a), db = dg(b);
        var c0 = da[0] + db[0] >= 10, c1 = da[1] + db[1] + (c0 ? 1 : 0) >= 10;
        if (a + b <= 999 && (lv === 1 ? !c0 && !c1 : (c0 || c1))) return [a, b];
      }
    }
    /* a pair with no trading (gentle) or with trading */
    function subPair(lv) {
      for (;;) {
        var a = R.int(lv === 1 ? 200 : 300, 999), b = R.int(lv === 1 ? 101 : 110, a - 20), da = dg(a), db = dg(b);
        var t0 = da[0] < db[0], t1 = da[1] - (t0 ? 1 : 0) < db[1];
        if (lv === 1 ? !t0 && !t1 : (t0 || t1)) return [a, b];
      }
    }
    /* the classic slip: subtract the smaller digit from the bigger one in every column */
    function flipSub(a, b) { var da = dg(a), db = dg(b); return Math.abs(da[2] - db[2]) * 100 + Math.abs(da[1] - db[1]) * 10 + Math.abs(da[0] - db[0]); }
    /* add without carrying: each column keeps only its ones digit */
    function noCarry(a, b) { var da = dg(a), db = dg(b); return ((da[2] + db[2]) % 10) * 100 + ((da[1] + db[1]) % 10) * 10 + (da[0] + db[0]) % 10; }
    function rnd(v, p) { return Math.floor((v + p / 2) / p) * p; }

    var SHAPES = {
      'as-add': [
        [1, 'story', function (lv) {
          var ab = addPair(lv), a = ab[0], b = ab[1], who = nm();
          var c = R.pick([['beads', 'has', 'red beads', 'blue beads'], ['hockey cards', 'has', 'hockey cards in one album', 'in another'], ['steps', 'walked', 'steps before lunch', 'steps after lunch'], ['cans', 'collected', 'cans on Monday', 'cans on Tuesday']]);
          return { q: who + ' ' + c[1] + ' ' + a + ' ' + c[2] + ' and ' + b + ' ' + c[3] + '. How many ' + c[0] + ' is that in all?', type: 'num', answer: a + b,
            hint: '"In all" means put them together, so add.', steps: ['Add: ' + a + ' + ' + b + '.', 'Ones, then tens, then hundreds.', a + ' + ' + b + ' = ' + (a + b) + '.'],
            explain: a + ' + ' + b + ' = ' + (a + b) + ' ' + c[0] + '.', meta: { k: 'add-story', a: a, b: b } };
        }],
        [1, 'build', function (lv) {
          var ab = addPair(lv), a = ab[0], b = ab[1];
          return { q: 'Work out <span class="math">' + a + ' + ' + b + '</span>. Show the answer with base-ten blocks.', type: 'build', tool: 'base10', answer: a + b,
            hint: 'Put the flats together, then the rods, then the small cubes.', steps: [Math.floor(a / 100) + ' + ' + Math.floor(b / 100) + ' hundreds, ' + dg(a)[1] + ' + ' + dg(b)[1] + ' tens, ' + dg(a)[0] + ' + ' + dg(b)[0] + ' ones.', 'Ten ones make a ten. Ten tens make a hundred.', 'The total is ' + (a + b) + '.'],
            explain: a + ' + ' + b + ' = ' + (a + b) + '.', meta: { k: 'add-build', a: a, b: b } };
        }],
        [1, 'fill', function (lv) {
          var ab = addPair(lv), a = ab[0], b = ab[1], p = R.int(0, 2), s = String(a), i = 2 - p;
          var shown = s.slice(0, i) + '[[]]' + s.slice(i + 1);
          return { q: 'One digit is missing. Fill it in.', type: 'fill', fill: '<span class="math">' + shown + ' + ' + b + ' = ' + (a + b) + '</span>', answers: [+s.charAt(i)],
            hint: 'Look at the ' + PN[p] + ' column. What plus ' + dg(b)[p] + ' gives the ' + PN[p] + ' digit of the answer?', steps: ['Work one column at a time.', 'Remember any carry from the column to the right.', 'The missing digit is ' + s.charAt(i) + '.'],
            explain: a + ' + ' + b + ' = ' + (a + b) + '.', meta: { k: 'add-fill', b: b, sum: a + b } };
        }],
        [2, 'mistake', function (lv) {
          var ab = addPair(2), a = ab[0], b = ab[1], who = nm(), truth = !R.int(0, 2), said = truth ? a + b : noCarry(a, b);
          var right = 'Ten or more in a column means you carry 1 to the next place. ' + a + ' + ' + b + ' = ' + (a + b) + '.';
          return { q: who + ' added <span class="math">' + a + ' + ' + b + '</span> and got <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['When a column makes 10 or more, write only the ones digit and forget the rest.', 'Add the hundreds first, so the carry does not matter.', 'You only carry when you subtract.']),
            hint: 'Add the ones first. Do they make 10 or more?', steps: [right], explain: right, meta: { k: 'add-tf', a: a, b: b, said: said } };
        }]
      ],
      'as-sub': [
        [1, 'story', function (lv) {
          var ab = subPair(lv), a = ab[0], b = ab[1], who = nm();
          var c = R.pick([['stickers', 'had', 'gave away'], ['pages', 'has a book with', 'has read'], ['litres of water', 'had a tank with', 'used'], ['tickets', 'had', 'sold']]);
          var t = c[0] === 'pages' ? who + ' ' + c[1] + ' ' + a + ' pages. ' + who + ' ' + c[2] + ' ' + b + ' of them. How many pages are left to read?'
            : who + ' ' + c[1] + ' ' + a + ' ' + c[0] + '. ' + who + ' ' + c[2] + ' ' + b + '. How many ' + c[0] + ' are left?';
          return { q: t, type: 'num', answer: a - b,
            hint: '"Left" means take away, so subtract.', steps: ['Subtract: ' + a + ' ' + M + ' ' + b + '.', 'Start with the ones. Trade if the top digit is smaller.', 'Check: ' + (a - b) + ' + ' + b + ' = ' + a + '.'],
            explain: a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.', meta: { k: 'sub-story', a: a, b: b } };
        }],
        [1, 'match', function (lv) {
          var pairs = [], seen = {};
          while (pairs.length < 3) {
            var ab = subPair(lv), r = ab[0] - ab[1];
            if (seen[r]) continue; seen[r] = 1;
            pairs.push([ab[0] + ' ' + M + ' ' + ab[1], String(r)]);
          }
          return { q: 'Match each subtraction to its answer.', type: 'match', pairs: pairs,
            hint: 'Work out one at a time. The ones digits can help you match quickly.', steps: ['Subtract the ones first. Look for an answer with that ones digit.'],
            explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'sub-match', pairs: pairs } };
        }],
        [1, 'check', function (lv) {
          var ab = subPair(lv), a = ab[0], b = ab[1], who = nm(), truth = !R.int(0, 1), said = truth ? a - b : a - b + R.pick([10, -10, 100]);
          var right = 'Check by adding: ' + said + ' + ' + b + ' = ' + (said + b) + (truth ? ', which is ' + a + '.' : ', not ' + a + '.');
          return { q: who + ' says <span class="math">' + a + ' ' + M + ' ' + b + ' = ' + said + '</span>. Check it by adding. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['The answer looks about right, so it must be right.', 'You can only check a subtraction by doing it again.', 'Add ' + a + ' + ' + b + ' to check it.']),
            hint: 'If ' + a + ' ' + M + ' ' + b + ' = ' + said + ', then ' + said + ' + ' + b + ' should make ' + a + '.', steps: [right], explain: right, meta: { k: 'sub-tf', a: a, b: b, said: said } };
        }],
        [2, 'mistake', function (lv) {
          var ab, a, b;
          do { ab = subPair(2); a = ab[0]; b = ab[1]; } while (flipSub(a, b) === a - b);
          var who = nm(), truth = !R.int(0, 2), said = truth ? a - b : flipSub(a, b);
          var right = 'When the top digit is smaller, trade 1 from the next place. ' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.';
          return { q: who + ' worked out <span class="math">' + a + ' ' + M + ' ' + b + '</span> and got <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['In each column, take the smaller digit from the bigger one.', 'The bottom number can go on top if it is easier.', 'You never need to trade when you subtract.']),
            hint: 'Look at the ones column. Is the top digit smaller than the bottom digit?', steps: [right], explain: right, meta: { k: 'sub-tf', a: a, b: b, said: said } };
        }]
      ],
      'as-mental': [
        [1, 'line', function (lv) {
          var unit = R.pick([10, 100]), k = R.int(1, unit === 10 ? 5 : 3), b = k * unit, op = R.pick(['+', '-']);
          var lo = unit === 10 ? R.int(1, 7) * 100 : 0, hi = unit === 10 ? lo + 100 : 1000, a;
          if (unit === 10) a = op === '+' ? lo + R.int(0, 10 - k) * 10 : lo + R.int(k, 10) * 10;
          else a = op === '+' ? R.int(0, 10 - k) * 100 : R.int(k, 10) * 100;
          var ans = calc(a, b, op);
          return { q: 'Start at <b>' + a + '</b>. Jump ' + (op === '+' ? 'forward' : 'back') + ' <b>' + b + '</b>. Where do you land? Put the marker there.', type: 'line', min: lo, max: hi, tick: unit, every: unit === 10 ? 50 : 100, snap: unit, answer: ans,
            hint: 'Each mark is ' + unit + '. Count ' + k + ' mark' + (k > 1 ? 's' : '') + ' ' + (op === '+' ? 'to the right.' : 'to the left.'), steps: [a + ' ' + sym(op) + ' ' + b + '.', 'Only the ' + (unit === 10 ? 'tens' : 'hundreds') + ' digit changes.', 'You land on ' + ans + '.'],
            explain: a + ' ' + sym(op) + ' ' + b + ' = ' + ans + '.', meta: { k: 'mental-line', a: a, b: b, op: op } };
        }],
        [1, 'match', function (lv) {
          var base = R.int(2, 7) * 100 + R.int(1, 8) * 10 + R.int(1, 9), list = R.shuffle([['+', 10], ['-', 10], ['+', 100], ['-', 100]]).slice(0, 3);
          var pairs = list.map(function (x) { return [base + ' ' + sym(x[0]) + ' ' + x[1], String(calc(base, x[1], x[0]))]; });
          return { q: 'Match each one to its answer. Use mental math.', type: 'match', pairs: pairs,
            hint: 'Adding or taking away 10 changes the tens digit. 100 changes the hundreds digit.', steps: ['Look at which digit changes, and which way.'],
            explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'mental-match', pairs: pairs } };
        }],
        [2, 'which', function (lv) {
          var near = R.pick([99, 199, 299, 98, 198, 101, 201]), a = R.int(12, 50) * 10 + R.int(1, 9), fr = Math.round(near / 100) * 100, d = fr - near;
          var right = d > 0 ? 'Add ' + fr + ', then take away ' + d : 'Add ' + fr + ', then add ' + (-d);
          var wrong = [d > 0 ? 'Add ' + fr + ', then add ' + d : 'Add ' + fr + ', then take away ' + (-d), 'Add ' + (fr + 100) + ', then take away ' + Math.abs(d), 'Add ' + fr + ' only'];
          var o = R.mc(right, wrong);
          return { q: 'Which way is the quickest and still right for <span class="math">' + a + ' + ' + near + '</span>?', type: 'mc', options: o.options, answer: o.answer,
            hint: near + ' is close to ' + fr + '. Is it a little less or a little more?', steps: [near + ' is ' + Math.abs(d) + (d > 0 ? ' less than ' : ' more than ') + fr + '.', 'So: ' + right.toLowerCase() + '.', a + ' + ' + near + ' = ' + (a + near) + '.'],
            explain: right + '. ' + a + ' + ' + near + ' = ' + (a + near) + '.', meta: { k: 'mental-which', b: near } };
        }],
        [2, 'mistake', function (lv) {
          var near = R.pick([99, 199, 299]), a = R.int(12, 50) * 10 + R.int(1, 9), fr = near + 1, who = nm(), truth = !R.int(0, 2), said = truth ? a + near : a + fr + 1;
          var right = near + ' is 1 less than ' + fr + '. Add ' + fr + ', then take away 1: ' + (a + near) + '.';
          return { q: who + ' says <span class="math">' + a + ' + ' + near + ' = ' + said + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, [near + ' is 1 less than ' + fr + ', so add ' + fr + ' and then add 1 more.', 'You cannot use a friendly number when you add.', 'Round both numbers and add them.']),
            hint: 'Add ' + fr + ' first. Then fix it.', steps: [right], explain: right, meta: { k: 'mental-tf', a: a, b: near, said: said } };
        }]
      ],
      'as-estimate': [
        [1, 'match', function (lv) {
          var p = lv === 1 ? 10 : 100, pairs = [], seen = {};
          while (pairs.length < 3) {
            var a = p === 10 ? R.int(11, 89) : R.int(110, 590), b = p === 10 ? R.int(11, 89) : R.int(110, 390);
            if (a % p === p / 2 || b % p === p / 2) continue;
            var est = rnd(a, p) + rnd(b, p);
            if (seen[est]) continue; seen[est] = 1;
            pairs.push([a + ' + ' + b, String(est)]);
          }
          return { q: 'Round each number to the nearest ' + (p === 10 ? 'ten' : 'hundred') + '. Match each sum to its estimate.', type: 'match', pairs: pairs,
            hint: 'Round both numbers first, then add the rounded numbers.', steps: ['Look at the ' + (p === 10 ? 'ones' : 'tens') + ' digit to round: 5 or more rounds up.'],
            explain: pairs.map(function (x) { return x[0] + ' is about ' + x[1]; }).join('. ') + '.', meta: { k: 'est-match', p: p, pairs: pairs } };
        }],
        [1, 'story', function (lv) {
          var p = lv === 1 ? 10 : 100, a, b;
          do { a = p === 10 ? R.int(21, 89) : R.int(120, 580); b = p === 10 ? R.int(11, 89) : R.int(110, 380); } while (a % p === p / 2 || b % p === p / 2);
          var who = nm(), est = rnd(a, p) + rnd(b, p), c = R.pick([['km', 'drove', 'kilometres on Saturday', 'kilometres on Sunday', 'kilometres'], ['', 'picked', 'apples in the morning', 'apples in the afternoon', 'apples'], ['', 'counted', 'cars on one street', 'cars on another', 'cars']]);
          var o = R.mc(est, [est + p, est - p, a + b]);
          return { q: who + "'s family " + c[1] + ' ' + a + ' ' + c[2] + ' and ' + b + ' ' + c[3] + '. About how many ' + c[4] + ' is that? Round to the nearest ' + (p === 10 ? 'ten' : 'hundred') + '.', type: 'mc', options: o.options, answer: o.answer,
            hint: '"About" means estimate. Round each number first.', steps: [a + ' rounds to ' + rnd(a, p) + '.', b + ' rounds to ' + rnd(b, p) + '.', rnd(a, p) + ' + ' + rnd(b, p) + ' = ' + est + '.'],
            explain: 'About ' + est + '. The exact answer, ' + (a + b) + ', is close.', meta: { k: 'est-mc', a: a, b: b, p: p } };
        }],
        [1, 'pick', function (lv) {
          var lim = R.pick([500, 600, 700]), opts = [], pairs = [], seen = {};
          while (opts.length < 4) {
            var big = opts.length < 2, a = R.int(110, lim - 200), b = big ? R.int(lim - a + 120, Math.min(990 - a, lim - a + 300)) : R.int(Math.max(10, lim - a - 300), lim - a - 120);
            if (b < 10 || seen[a + b]) continue; seen[a + b] = 1;
            pairs.push([a, b]); opts.push(a + ' + ' + b);
          }
          var order = R.shuffle([0, 1, 2, 3]); opts = order.map(function (j) { return opts[j]; }); pairs = order.map(function (j) { return pairs[j]; });
          var ans = []; pairs.forEach(function (x, j) { if (x[0] + x[1] > lim) ans.push(j); });
          return { q: 'Estimate. Pick every sum that is <b>more than ' + lim + '</b>.', type: 'pick', options: opts, answer: ans,
            hint: 'Round each number to the nearest hundred and add. You do not need the exact answer.', steps: ['Round, add, and compare with ' + lim + '.'],
            explain: ans.map(function (j) { return opts[j]; }).join(' and ') + ' are more than ' + lim + '.', meta: { k: 'est-pick', lim: lim, pairs: pairs } };
        }],
        [2, 'sense', function (lv) {
          var a = R.int(110, 590), b = R.int(110, 390), op = lv === 3 && a > b ? '-' : '+', who = nm(), ex = calc(a, b, op), truth = !R.int(0, 1), said = truth ? ex : ex + R.pick([200, -200, 300]);
          if (said < 0) said = ex + 200;
          var e = calc(rnd(a, 100), rnd(b, 100), op);
          var right = 'The estimate is ' + rnd(a, 100) + ' ' + sym(op) + ' ' + rnd(b, 100) + ' = ' + e + '. ' + said + (truth ? ' is close to it.' : ' is far from it.');
          return { q: who + ' says <span class="math">' + a + ' ' + sym(op) + ' ' + b + ' = ' + said + '</span>. Use an estimate. Does that make sense?', type: 'tf', answer: truth,
            why: why(right, ['Big numbers always give a big answer.', 'An estimate cannot tell you if an answer is wrong.', 'Only the ones digits matter.']),
            hint: 'Round both numbers to the nearest hundred first.', steps: [right], explain: right + ' The exact answer is ' + ex + '.', meta: { k: 'est-tf', a: a, b: b, op: op, said: said } };
        }]
      ],
      'as-equal': [
        [1, 'tf', function (lv) {
          var a = R.int(1, 5) * 100, b = R.int(1, 4) * 100, c = R.int(1, Math.floor((a + b) / 100) - 1) * 100, truth = !R.int(0, 1), d = a + b - c + (truth ? 0 : R.pick([100, -100]));
          if (d <= 0) { d = a + b - c; truth = true; }
          var right = 'The left side is ' + (a + b) + '. The right side is ' + (c + d) + '. ' + (truth ? 'They are equal.' : 'They are not equal.');
          return { q: 'True or false: <span class="math">' + a + ' + ' + b + ' = ' + c + ' + ' + d + '</span>', type: 'tf', answer: truth,
            why: why(right, ['Both sides use two numbers, so they are equal.', 'The equal sign means "the answer comes next".', 'The sides are equal if they share a number.']),
            hint: 'Work out each side on its own. Then compare.', steps: [right], explain: right, meta: { k: 'eq-tf', l: [a, b], r: [c, d] } };
        }],
        [1, 'pick', function (lv) {
          var t = R.int(lv === 1 ? 3 : 4, 9) * 100, step = lv === 1 ? 100 : 10, opts = [], seen = {};
          while (opts.length < 5) {
            var good = opts.length < 2, a = R.int(1, t / step - 1) * step, b = t - a + (good ? 0 : R.pick([step, -step, 2 * step]));
            if (b <= 0 || seen[a + '+' + b]) continue; seen[a + '+' + b] = 1;
            opts.push(a + ' + ' + b);
          }
          opts = R.shuffle(opts);
          var ans = []; opts.forEach(function (o, j) { var n = o.split(' + '); if (+n[0] + +n[1] === t) ans.push(j); });
          return { q: 'Pick every one that is equal to <b>' + t + '</b>.', type: 'pick', options: opts, answer: ans,
            hint: 'Add each pair. Keep the ones that make ' + t + '.', steps: ['More than one can be right.'],
            explain: ans.map(function (j) { return opts[j]; }).join(' and ') + ' make ' + t + '.', meta: { k: 'eq-pick', t: t, opts: opts } };
        }],
        [1, 'match', function (lv) {
          var step = lv === 1 ? 100 : 10, pairs = [], seen = {};
          while (pairs.length < 3) {
            var t = R.int(lv === 1 ? 5 : 20, lv === 1 ? 9 : 90) * step;
            if (seen[t]) continue; seen[t] = 1;
            var a = R.int(1, t / step - 1) * step, c;
            do { c = R.int(1, t / step - 1) * step; } while (c === a || c === t - a);
            pairs.push([a + ' + ' + (t - a), c + ' + ' + (t - c)]);
          }
          return { q: 'Match the two sides that are equal.', type: 'match', pairs: pairs,
            hint: 'Work out each side. Equal sides make the same total.', steps: ['Find the total of each card, then pair the same totals.'],
            explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'eq-match', pairs: pairs } };
        }],
        [2, 'fill', function (lv) {
          var a = R.int(10, 50) * 10, b = R.int(5, 40) * 10, c = R.int(5, Math.floor((a + b) / 10) - 1) * 10, m = a + b - c;
          return { q: 'Fill in the missing number so both sides are equal.', type: 'fill', fill: '<span class="math">[[]] + ' + c + ' = ' + a + ' + ' + b + '</span>', answers: [m], fig: balance('? + ' + c, a + ' + ' + b, true),
            hint: 'Work out the side you know first.', steps: [a + ' + ' + b + ' = ' + (a + b) + '.', '? + ' + c + ' = ' + (a + b) + '.', 'The missing number is ' + m + '.'],
            explain: m + ' + ' + c + ' = ' + a + ' + ' + b + '. Both sides are ' + (a + b) + '.', meta: { k: 'eq-fill' } };
        }]
      ],
      'as-word': [
        [1, 'which', function (lv) {
          var who = nm(), a = R.int(3, 6) * 100 + R.int(10, 90), b = R.int(1, 2) * 100 + R.int(10, 90), kind = R.pick(['join', 'take', 'compare', 'join']);
          var t = { join: who + ' has ' + a + ' hockey cards. A friend gives ' + who + ' ' + b + ' more. How many cards does ' + who + ' have now?',
            take: 'A bakery made ' + a + ' muffins. It sold ' + b + ' of them. How many muffins are left?',
            compare: 'The red team scored ' + a + ' points. The blue team scored ' + b + ' points. How many more points did the red team score?' }[kind];
          var opts = ['Add: ' + a + ' + ' + b, 'Subtract: ' + a + ' ' + M + ' ' + b], ans = kind === 'join' ? 0 : 1;
          return { q: t + ' <b>Which way solves it?</b>', type: 'mc', options: opts, answer: ans,
            hint: kind === 'join' ? 'Are things being put together?' : kind === 'take' ? 'Is something taken away?' : '"How many more" compares two amounts.',
            steps: [kind === 'join' ? 'Putting together means add.' : kind === 'take' ? 'Taking away means subtract.' : 'Comparing means subtract the smaller from the bigger.', 'The answer is ' + calc(a, b, ans ? '-' : '+') + '.'],
            explain: opts[ans] + ' = ' + calc(a, b, ans ? '-' : '+') + '.', meta: { k: 'word-which', kind: kind } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), a = R.int(3, 8) * 100 + R.int(0, 9) * 10, b = R.int(1, 2) * 100 + R.int(1, 9) * 10, op = R.pick(['+', '-']);
          if (op === '+' && a + b > 999) op = '-';
          var t = op === '+' ? who + ' cycled ' + a + ' metres to the park and ' + b + ' metres to the library. How far did ' + who + ' cycle?'
            : 'A trail is ' + a + ' metres long. ' + who + ' has walked ' + b + ' metres. How many metres are left?';
          return { q: t, type: 'num', answer: calc(a, b, op), unit: 'm',
            hint: op === '+' ? 'Put the two distances together.' : 'Take the part walked away from the whole trail.', steps: ['Write it: ' + a + ' ' + sym(op) + ' ' + b + '.', a + ' ' + sym(op) + ' ' + b + ' = ' + calc(a, b, op) + '.'],
            explain: a + ' ' + sym(op) + ' ' + b + ' = ' + calc(a, b, op) + ' metres.', meta: { k: 'word-num', a: a, b: b, op: op } };
        }],
        [2, 'fill', function (lv) {
          var who = nm(), a = R.int(4, 9) * 100 + R.int(10, 99), b = R.int(1, 3) * 100 + R.int(10, 99);
          var t = R.pick([who + ' saved ' + a + ' cents. ' + who + ' spent ' + b + ' cents on a snack.', 'A hall has ' + a + ' chairs. ' + b + ' chairs are stacked away.', 'A tree farm planted ' + a + ' trees. Wind knocked down ' + b + '.']);
          return { q: t + ' Fill in the number sentence that tells how many are left.', type: 'fill', fill: '<span class="math">[[]] ' + M + ' [[]] = [[]]</span>', answers: [a, b, a - b],
            hint: 'Start with the whole amount. Take away the part that went.', steps: ['The whole is ' + a + '.', 'Take away ' + b + '.', a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.'],
            explain: a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.', meta: { k: 'word-fill', a: a, b: b } };
        }],
        [2, 'mistake', function (lv) {
          var who = nm(), a = R.int(5, 9) * 100 + R.int(10, 99), b = R.int(1, 3) * 100 + R.int(10, 99), truth = !R.int(0, 2), said = truth ? a - b : a + b;
          var right = '"How many more" compares two amounts, so subtract: ' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.';
          return { q: 'A school collected ' + a + ' cans. Another school collected ' + b + '. How many more cans did the first school collect? ' + who + ' says <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['"More" always means add.', 'Add both schools, because it asks about both.', 'Subtract the bigger number from the smaller one.']),
            hint: 'Does the question put the cans together, or compare them?', steps: [right], explain: right, meta: { k: 'word-tf', a: a, b: b, said: said } };
        }]
      ]
    };
    Atlas.Q.shapes('add-subtract', SHAPES);
  })();
})();
