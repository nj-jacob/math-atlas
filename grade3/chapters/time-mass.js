(function () {
  var A = Atlas, R = A.R;
  function pad(m) { return (m < 10 ? '0' : '') + m; }
  function nxt(h) { return h === 12 ? 1 : h + 1; }
  function words(h, m) {
    if (m === 0) return h + " o'clock";
    if (m === 15) return 'quarter past ' + h;
    if (m === 30) return 'half past ' + h;
    if (m === 45) return 'quarter to ' + nxt(h);
    if (m < 30) return m + ' minute' + (m === 1 ? '' : 's') + ' past ' + h;
    return (60 - m) + ' minute' + (60 - m === 1 ? '' : 's') + ' to ' + nxt(h);
  }
  /* analog clock. Hands point by angle from 12, going clockwise. */
  function clock(h, m, opt) {
    opt = opt || {};
    var cx = 150, cy = 150, r = 120, s = '', i, a;
    function pt(deg, L) { a = deg * Math.PI / 180; return [(cx + L * Math.sin(a)).toFixed(2), (cy - L * Math.cos(a)).toFixed(2)]; }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="6"/>';
    for (i = 0; i < 60; i++) { var p1 = pt(i * 6, r - 4), p2 = pt(i * 6, i % 5 ? r - 11 : r - 18); s += '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] + '" style="stroke:var(--ink)" stroke-width="' + (i % 5 ? 1.5 : 4) + '"/>'; }
    for (i = 1; i <= 12; i++) { var p = pt(i * 30, r - 44); s += '<text x="' + p[0] + '" y="' + (+p[1] + 8) + '" text-anchor="middle" font-size="23" class="tb">' + i + '</text>'; }
    if (opt.fives) for (i = 1; i <= 12; i++) { var q = pt(i * 30, r + 20); s += '<text x="' + q[0] + '" y="' + (+q[1] + 6) + '" text-anchor="middle" font-size="15" style="fill:var(--strand)" class="tb">' + pad(i * 5 % 60) + '</text>'; }
    var hp = pt((h % 12) * 30 + m / 2, 62), mp = pt(m * 6, 94);
    s += '<line class="hh" x1="' + cx + '" y1="' + cy + '" x2="' + hp[0] + '" y2="' + hp[1] + '" style="stroke:var(--ink)" stroke-width="11" stroke-linecap="round"/>';
    s += '<line class="mh" x1="' + cx + '" y1="' + cy + '" x2="' + mp[0] + '" y2="' + mp[1] + '" style="stroke:var(--sb)" stroke-width="6" stroke-linecap="round"/>';
    if (opt.sec !== undefined) { var sp = pt(opt.sec * 6, 104); s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + sp[0] + '" y2="' + sp[1] + '" style="stroke:var(--bad)" stroke-width="2.5" stroke-linecap="round"/>'; }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="8" style="fill:var(--ink)"/>';
    var pad0 = opt.fives ? 0 : 0;
    return A.svg(300 + pad0, 300, s, opt.label || 'An analog clock. The short hour hand and the long minute hand.');
  }
  function digital(h, m, sec) {
    var t = h + ':' + pad(m) + (sec !== undefined ? ':' + pad(sec) : '');
    return A.svg(260, 92, '<rect x="4" y="4" width="252" height="84" rx="14" style="fill:var(--ink)"/><text x="130" y="65" text-anchor="middle" font-size="50" font-family="ui-monospace,Menlo,Consolas,monospace" font-weight="700" style="fill:var(--hi)">' + t + '</text>', 'A digital clock showing ' + t);
  }
  /* pan balance. tilt > 0 means the left side is lower. */
  var THING = { apple: ['apple', 'var(--bad)'], book: ['book', 'var(--sb)'], shoe: ['shoe', 'var(--sc)'], pencil: ['pencil', 'var(--hi)'], orange: ['orange', 'var(--se)'], mug: ['mug', 'var(--sd)'] };
  function thing(k, x, y) {
    var c = THING[k][1];
    if (k === 'apple' || k === 'orange') return '<circle cx="' + x + '" cy="' + (y - 22) + '" r="22" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5"/>' + (k === 'apple' ? '<path d="M' + x + ' ' + (y - 44) + ' q2 -10 9 -12" fill="none" style="stroke:var(--ink)" stroke-width="3"/>' : '');
    if (k === 'book') return '<rect x="' + (x - 34) + '" y="' + (y - 22) + '" width="68" height="22" rx="3" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5"/><line x1="' + (x - 28) + '" y1="' + (y - 6) + '" x2="' + (x + 28) + '" y2="' + (y - 6) + '" style="stroke:var(--card)" stroke-width="2"/>';
    if (k === 'shoe') return '<path d="M' + (x - 34) + ' ' + y + ' v-30 h22 q4 14 22 16 q24 4 24 14 z" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
    if (k === 'pencil') return '<rect x="' + (x - 34) + '" y="' + (y - 12) + '" width="56" height="12" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2"/><polygon points="' + (x + 22) + ',' + (y - 12) + ' ' + (x + 36) + ',' + (y - 6) + ' ' + (x + 22) + ',' + y + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    return '<path d="M' + (x - 22) + ' ' + (y - 40) + ' h40 v34 q0 6 -6 6 h-28 q-6 0 -6 -6 z" style="fill:' + c + ';stroke:var(--ink)" stroke-width="2.5"/><path d="M' + (x + 18) + ' ' + (y - 32) + ' q16 0 16 12 q0 12 -16 12" fill="none" style="stroke:var(--ink)" stroke-width="3"/>';
  }
  function balance(left, cubes, tilt, label) {
    var px = 230, py = 92, L = 160, s = '', deg = Math.max(-12, Math.min(12, tilt)), a = deg * Math.PI / 180;
    var lx = px - L * Math.cos(a), ly = py + L * Math.sin(a), rx = px + L * Math.cos(a), ry = py - L * Math.sin(a);
    s += '<polygon points="' + (px - 60) + ',300 ' + (px + 60) + ',300 ' + (px + 14) + ',270 ' + (px - 14) + ',270" style="fill:var(--ink2)"/><rect x="' + (px - 8) + '" y="' + py + '" width="16" height="180" style="fill:var(--ink2)"/>';
    s += '<line x1="' + lx.toFixed(1) + '" y1="' + ly.toFixed(1) + '" x2="' + rx.toFixed(1) + '" y2="' + ry.toFixed(1) + '" style="stroke:var(--ink)" stroke-width="10" stroke-linecap="round"/><circle cx="' + px + '" cy="' + py + '" r="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="3"/>';
    s += '<polygon points="' + (px - 9) + ',' + (py - 30) + ' ' + (px + 9) + ',' + (py - 30) + ' ' + px + ',' + (py - 12) + '" style="fill:' + (Math.abs(tilt) < 0.5 ? 'var(--good)' : 'var(--bad)') + '"/>';
    function pan(x, y, inner) {
      var by = y + 74;
      return '<line x1="' + x + '" y1="' + y + '" x2="' + (x - 62) + '" y2="' + by + '" style="stroke:var(--ink2)" stroke-width="2"/><line x1="' + x + '" y1="' + y + '" x2="' + (x + 62) + '" y2="' + by + '" style="stroke:var(--ink2)" stroke-width="2"/>' +
        inner(x, by) + '<path d="M' + (x - 72) + ' ' + by + ' h144 q-10 20 -40 20 h-64 q-30 0 -40 -20z" style="fill:var(--ink2)"/>';
    }
    s += pan(lx, ly, function (x, by) {
      if (typeof left === 'string') return thing(left, x, by);
      var t = ''; for (var i = 0; i < left.length; i++) t += thing(left[i], x - (left.length - 1) * 24 + i * 48, by); return t;
    });
    s += pan(rx, ry, function (x, by) {
      var t = '', per = 6, sz = 18;
      for (var i = 0; i < cubes; i++) { var col = i % per, row = Math.floor(i / per); t += '<rect class="cube" x="' + (x - per * sz / 2 + col * sz) + '" y="' + (by - (row + 1) * sz) + '" width="' + (sz - 2) + '" height="' + (sz - 2) + '" rx="2" style="fill:var(--sd);stroke:var(--ink)" stroke-width="1.5"/>'; }
      return t;
    });
    return A.svg(460, 310, s, label);
  }
  /* jug that holds cap cups, with fill f cups */
  function jug(cap, f, label) {
    var x = 70, top = 30, H = 240, W = 150, s = '', lvl = Math.min(f, cap) / cap * H, i;
    if (f > cap) s += '<path d="M' + (x + W) + ' ' + top + ' q18 4 16 40 q-2 30 6 60" fill="none" style="stroke:var(--sb)" stroke-width="7" stroke-linecap="round" opacity=".7"/><ellipse cx="' + (x + W + 30) + '" cy="' + (top + H + 6) + '" rx="40" ry="8" style="fill:var(--sb)" opacity=".5"/>';
    s += '<rect x="' + x + '" y="' + (top + H - lvl) + '" width="' + W + '" height="' + lvl + '" style="fill:color-mix(in srgb,var(--sb) 55%,var(--card))"/>';
    s += '<path d="M' + x + ' ' + top + ' V' + (top + H) + ' H' + (x + W) + ' V' + top + '" fill="none" style="stroke:var(--ink)" stroke-width="5" stroke-linejoin="round"/>';
    s += '<path d="M' + x + ' ' + (top + 30) + ' q-40 0 -40 50 q0 50 40 50" fill="none" style="stroke:var(--ink)" stroke-width="6"/>';
    for (i = 1; i <= cap; i++) { var y = top + H - i * H / cap; s += '<line x1="' + (x + W - 26) + '" y1="' + y + '" x2="' + (x + W) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="2"/><text x="' + (x + W + 8) + '" y="' + (y + 6) + '" font-size="16" class="t2">' + i + '</text>'; }
    return A.svg(330, 290, s, label || 'A jug that holds ' + cap + ' cups');
  }
  var OBJ = { apple: 9, book: 23, shoe: 15, pencil: 2, orange: 11, mug: 18 };

  /* ---------- Lessons: one idea per screen ---------- */
  var CH = 'time-mass';
  function TU(s, i) { return function () { return G3.turn(A.chapters[CH].turns[s][i])(); }; }
  function SK(id, lv) { return G3.skill(CH, id, lv); }
  function cap(t) { return t ? '<p class="g3-sym" style="font-size:1.1rem;color:var(--ink)">' + t + '</p>' : ''; }
  function hm(t) { return [Math.floor(t / 60) % 12 || 12, t % 60]; }
  function clockView(s) { var x = hm(s.t); return '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center">' + clock(x[0], x[1], { fives: s.fives, sec: s.sec, label: 'Clock showing ' + x[0] + ':' + pad(x[1]) }) + (s.dig ? digital(x[0], x[1], s.sec) : '') + '</div>' + cap(s.say); }
  var clockButtons = [['&minus; 1 hour', -60], ['&minus; 5 min', -5], ['+ 5 min', 5], ['+ 1 hour', 60]].map(function (b) { return { label: b[0], act: function (s) { s.t = ((s.t + b[1]) % 720 + 720) % 720; } }; });
  function balView(s) { var d = OBJ[s.k] - s.c; return '<div>' + balance(s.k, s.c, d > 0 ? Math.min(12, 3 + d) : d < 0 ? Math.max(-12, d - 3) : 0, 'Pan balance: a ' + s.k + ' and ' + s.c + ' cubes') + cap(s.say) + '</div>'; }
  function jugView(s) { return '<div>' + jug(s.size || 8, s.p) + cap(s.say) + '</div>'; }
  function levelView(s) { return '<div>' + balance(s.k, OBJ[s.k], 0, 'A level balance: ' + s.k + ' and ' + OBJ[s.k] + ' cubes') + cap(s.say) + '</div>'; }

  var LESSONS = [
    { id: 'clock', title: 'Reading a clock', sub: 'The short hand and the long hand.', concepts: [
      { id: 'hands', title: 'Two hands', exp: ['E2.6'], skill: 'tm-read',
        body: '<p>The <b>short hand</b> shows the hour. The <b>long hand</b> shows the minutes. When the long hand points to 12, it is exactly the hour: <b>o\'clock</b>.</p>',
        watch: { mount: G3.view(clockView, { t: 180, fives: false, dig: true, say: '3 o\'clock' }), steps: [
          { say: 'The short hand is on 3. The long hand is on 12. It is <b>3:00</b>.', ms: 2000 },
          { say: 'In one hour the long hand goes all the way around.', act: function (t) { var p = []; for (var m = 5; m <= 60; m += 5) p.push({ t: 180 + m, say: m === 60 ? '4 o\'clock' : '' }); return t.seq(p, 260); } },
          { say: 'The short hand moved to 4. It is <b>4:00</b>. One hour = 60 minutes.', ms: 2000 }
        ] },
        example: { mount: G3.view(clockView, { t: 420, fives: false, dig: true, say: '7 o\'clock' }), steps: [
          { say: 'My turn. The short hand is on 7. The long hand is on 12. It is <b>7:00</b>.', ms: 2000 },
          { say: 'I watch one hour pass. The long hand goes all the way around.', act: function (t) { var p = []; for (var m = 5; m <= 60; m += 5) p.push({ t: 420 + m, say: m === 60 ? '8 o\'clock' : '' }); return t.seq(p, 260); } },
          { say: 'Now the short hand is on 8. It is <b>8:00</b>. The short hand shows the hour. The long hand shows the minutes.', ms: 2400 }
        ] },
        try: { mount: G3.play({ state: { t: 120, fives: false, dig: false }, draw: clockView, buttons: clockButtons,
          tasks: [{ do: 'Set the clock to <b>9 o\'clock</b>.', goal: function (s) { return s.t === 540; }, yes: 'Short hand on 9, long hand on 12.' }] }), do: '' },
        key: '<p>Short hand: <b>hour</b>. Long hand: <b>minutes</b>.</p>',
        mistake: '<p>Mixing up the hands (reading 3:00 as 12:15). Say "short is hour" every time before reading.</p>',
        check: [TU('s1', 0), TU('s1', 2), SK('tm-read', 1)] },

      { id: 'fives', title: 'Count the minutes by 5s', exp: ['E2.6'], skill: 'tm-read',
        body: '<p>The long hand moves <b>5 minutes</b> from one number to the next. Count by 5s to find the minutes. On the 6, it is 30 minutes past.</p>',
        watch: { mount: G3.view(clockView, { t: 240, fives: true, dig: true, say: '' }), steps: [
          { say: 'It is 4 o\'clock. Watch the long hand.', ms: 1400 },
          { say: 'Count by 5s: 5, 10, 15, 20, 25, 30.', act: function (t) { var p = []; for (var m = 5; m <= 30; m += 5) p.push({ t: 240 + m, say: String(m) }); return t.seq(p, 600); } },
          { say: 'The long hand is on the 6. It is <b>4:30</b>, half past 4.', act: function (t) { return t.set({ say: '4:30' }, 2000); } }
        ] },
        example: { mount: G3.view(clockView, { t: 120, fives: true, dig: true, say: '' }), steps: [
          { say: 'My turn. It is 2 o\'clock. I watch the long hand.', ms: 1400 },
          { say: 'I count by 5s: 5, 10, 15, 20, 25, 30, 35, 40, 45.', act: function (t) { var p = []; for (var m = 5; m <= 45; m += 5) p.push({ t: 120 + m, say: String(m) }); return t.seq(p, 500); } },
          { say: 'The long hand is on the 9. It is <b>2:45</b>.', act: function (t) { return t.set({ say: '2:45' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { t: 180, fives: true, dig: true }, draw: clockView, buttons: clockButtons,
          tasks: [{ do: 'Set the clock to <b>7:15</b>.', goal: function (s) { return s.t === 435; }, yes: 'Long hand on 3: 5, 10, 15.' },
            { do: 'Set it to <b>10:40</b>.', goal: function (s) { return s.t === 640; }, yes: 'Long hand on 8: count by 5s to 40.' }] }), do: '' },
        key: '<p>Long hand: <b>count by 5s</b>.</p>',
        check: [TU('s1', 1), SK('tm-read', 2)] },

      { id: 'past', title: 'Past and to', exp: ['E2.6'], skill: 'tm-words', hard: true,
        body: '<p>We also say the time in words. 15 minutes past is <b>quarter past</b>. 30 is <b>half past</b>. 45 is <b>quarter to</b> the next hour. The short hand is between two numbers: read the one it has <b>passed</b>.</p>',
        watch: { mount: G3.view(clockView, { t: 495, fives: true, dig: true, say: 'quarter past 8' }), steps: [
          { say: '8:15. The long hand has gone a quarter of the way around: <b>quarter past 8</b>.', ms: 2000 },
          { say: '8:30: halfway around. <b>Half past 8</b>.', act: function (t) { return t.set({ t: 510, say: 'half past 8' }, 2000); } },
          { say: '8:45: 15 minutes before 9. <b>Quarter to 9</b>. The short hand is almost at 9, but it has passed only the 8.', act: function (t) { return t.set({ t: 525, say: 'quarter to 9' }, 2400); } }
        ] },
        example: { mount: G3.view(clockView, { t: 375, fives: true, dig: true, say: 'quarter past 6' }), steps: [
          { say: 'My turn. 6:15. The long hand has gone a quarter of the way around: <b>quarter past 6</b>.', ms: 2100 },
          { say: '6:30: halfway around. <b>Half past 6</b>.', act: function (t) { return t.set({ t: 390, say: 'half past 6' }, 2000); } },
          { say: '6:45: 15 minutes before 7. <b>Quarter to 7</b>. The short hand is near the 7, but it has only passed the 6.', act: function (t) { return t.set({ t: 405, say: 'quarter to 7' }, 2400); } }
        ] },
        ways: [
          { label: 'Cut the clock', html: '<p>Think of the clock as a pizza cut into 4 quarters. Each quarter is 15 minutes.</p><div class="fig">' + clock(3, 15, { label: 'Clock at quarter past 3' }) + '</div>' },
          { label: 'Count back', html: '<p>Quarter to 9: 60 &minus; 15 = 45, so it is 45 minutes past 8: <b>8:45</b>.</p>' }
        ],
        try: { mount: G3.play({ state: { t: 360, fives: true, dig: false }, draw: clockView, buttons: clockButtons,
          info: function (s) { var x = hm(s.t); return 'Say it: <b>' + words(x[0], x[1]) + '</b>'; },
          tasks: [{ do: 'Show <b>quarter to 7</b>.', goal: function (s) { return s.t === 405; }, yes: 'Quarter to 7 is 6:45.' }] }), do: '' },
        key: '<p>:15 quarter past. :30 half past. :45 <b>quarter to the next hour</b>.</p>',
        mistake: '<p>Reading the hour the short hand is closest to, instead of the one it has passed (calling 8:45 "9:45"). Ask: "Which number has it already passed?"</p>',
        check: [SK('tm-words', 1), SK('tm-words', 2)] }
    ] },

    { id: 'digital', title: 'Digital time and seconds', sub: 'Numbers on a screen, and very short times.', concepts: [
      { id: 'screen', title: 'Digital clocks', exp: ['E2.6'], skill: 'tm-words',
        body: '<p>A <b>digital clock</b> shows the hour, a colon, then the minutes. <b>3:05</b> is 5 minutes past 3. The 0 matters.</p>',
        watch: { mount: G3.view(clockView, { t: 185, fives: true, dig: true, say: '3:05' }), steps: [
          { say: '3:05. The hour is 3. The minutes are 05: five minutes past.', ms: 2000 },
          { say: '3:50 is very different: 50 minutes past 3.', act: function (t) { return t.set({ t: 230, say: '3:50' }, 2000); } },
          { say: 'Half past 2 is <b>2:30</b>.', act: function (t) { return t.set({ t: 150, say: '2:30' }, 2000); } }
        ] },
        example: { mount: G3.view(clockView, { t: 550, fives: true, dig: true, say: '9:10' }), steps: [
          { say: 'My turn. 9:10. The hour is 9. The minutes are 10.', ms: 1800 },
          { say: '9:01 is different: only 1 minute past 9. The 0 keeps two digits for the minutes.', act: function (t) { return t.set({ t: 541, say: '9:01' }, 2200); } },
          { say: 'Quarter past 11 is <b>11:15</b>.', act: function (t) { return t.set({ t: 675, say: '11:15' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { t: 60, fives: true, dig: true }, draw: clockView, buttons: clockButtons,
          tasks: [{ do: 'Make the digital clock show <b>11:05</b>.', goal: function (s) { return s.t === 665; }, yes: '5 minutes past 11.' }] }), do: '' },
        key: '<p>Hour, colon, <b>two-digit minutes</b>.</p>',
        mistake: '<p>Reading 3:05 as "3:50" or "3 and 5 hours". The 0 matters: 3:05 is 5 minutes past 3.</p>',
        check: [TU('s2', 0), SK('tm-words', 3)] },

      { id: 'seconds', title: 'Seconds, minutes and hours', exp: ['E2.6'], skill: 'tm-units',
        body: '<p>A <b>second</b> is very short: one clap. <b>60 seconds</b> make 1 minute. <b>60 minutes</b> make 1 hour. A timer counts down to zero.</p>',
        watch: { mount: G3.view(clockView, { t: 120, fives: false, dig: true, sec: 0, say: '' }), steps: [
          { say: 'The thin red hand counts seconds.', act: function (t) { var p = []; for (var s = 5; s <= 60; s += 5) p.push({ sec: s % 60, say: s + ' seconds' }); return t.seq(p, 300); } },
          { say: '60 seconds: once around. The long hand moved <b>1 minute</b>.', act: function (t) { return t.set({ t: 121, sec: 0, say: '60 seconds = 1 minute' }, 2200); } }
        ] },
        example: { mount: G3.view(clockView, { t: 300, fives: false, dig: true, sec: 0, say: '' }), steps: [
          { say: 'My turn. How many seconds are in 2 minutes? I watch the thin red hand.', ms: 1600 },
          { say: 'Once around is 60 seconds. The long hand moves 1 minute.', act: function (t) { return t.seq([{ sec: 15 }, { sec: 30 }, { sec: 45 }, { t: 301, sec: 0, say: '60 seconds' }], 450); } },
          { say: 'Around again: 60 more seconds. Now it is 2 minutes.', act: function (t) { return t.seq([{ sec: 15 }, { sec: 30 }, { sec: 45 }, { t: 302, sec: 0, say: '120 seconds' }], 450); } },
          { say: '60 + 60 = 120. <b>2 minutes = 120 seconds</b>.', act: function (t) { return t.set({ say: '2 minutes = 120 seconds' }, 2000); } }
        ] },
        ways: [
          { label: 'How long?', html: '<div class="tbl"><table><tbody><tr><td class="l">1 second</td><td class="l">a clap</td></tr><tr><td class="l">1 minute</td><td class="l">washing your hands well, 3 times</td></tr><tr><td class="l">1 hour</td><td class="l">a long swimming lesson</td></tr></tbody></table></div>' }
        ],
        try: { mount: G3.play({ state: { s: 75 }, draw: function (s) { return digital(Math.floor(s.s / 60), s.s % 60); },
          sliders: [{ key: 's', label: 'Timer', min: 10, max: 180, step: 5, fmt: function (v) { return v + ' seconds'; } }],
          info: function (s) { var m = Math.floor(s.s / 60), r = s.s % 60; return s.s + ' seconds = ' + (m ? m + ' minute' + (m > 1 ? 's' : '') + (r ? ' and ' + r + ' seconds' : '') : r + ' seconds'); },
          tasks: [{ do: 'Set the timer to exactly <b>2 minutes</b>.', goal: function (s) { return s.s === 120; }, yes: '2 &times; 60 = 120 seconds.' }] }), do: '' },
        key: '<p>60 seconds = 1 minute. <b>60 minutes = 1 hour.</b></p>',
        check: [TU('s2', 1), TU('s2', 2), SK('tm-units', 1), SK('tm-units', 2)] }
    ] },

    { id: 'mass', title: 'Mass', sub: 'How heavy, with a pan balance.', concepts: [
      { id: 'balance', title: 'Use a pan balance', exp: ['E2.4'], skill: 'tm-mass',
        body: '<p><b>Mass</b> is how heavy something is. On a <b>pan balance</b>, the heavier side goes <b>down</b>. When it is level, the masses are equal.</p>',
        watch: { mount: G3.view(balView, { k: 'apple', c: 0, say: '' }), steps: [
          { say: 'An apple on one side. The apple side goes down.', ms: 1500 },
          { say: 'Add cubes one at a time.', act: function (t) { var p = []; for (var i = 1; i <= 9; i++) p.push({ c: i }); return t.seq(p, 300); } },
          { say: 'Level! The apple has a mass of <b>9 cubes</b>.', act: function (t) { return t.set({ say: 'Apple = 9 cubes' }, 2000); } }
        ] },
        example: { mount: G3.view(balView, { k: 'orange', c: 0, say: '' }), steps: [
          { say: 'My turn. I put an orange on one side. That side goes down because it is heavier.', ms: 1700 },
          { say: 'I add cubes one at a time.', act: function (t) { var p = []; for (var i = 1; i <= 11; i++) p.push({ c: i }); return t.seq(p, 280); } },
          { say: 'Level! The orange has a mass of <b>11 cubes</b>. Level means equal.', act: function (t) { return t.set({ say: 'Orange = 11 cubes' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { k: 'shoe', c: 0 }, draw: balView,
          selects: [{ key: 'k', label: 'Object', options: Object.keys(OBJ).map(function (k) { return [k, k]; }), change: function (s) { s.c = 0; } }],
          buttons: [{ label: '+ 1 cube', act: function (s) { if (s.c < 30) s.c++; } }, { label: '+ 5 cubes', act: function (s) { s.c = Math.min(30, s.c + 5); } }, { label: '&minus; 1 cube', act: function (s) { if (s.c) s.c--; } }],
          info: function (s) { var d = OBJ[s.k] - s.c; return d > 0 ? 'The ' + s.k + ' is heavier. Add cubes.' : d < 0 ? 'The cubes are heavier. Take some away.' : '<b>Level!</b> The ' + s.k + ' is ' + OBJ[s.k] + ' cubes.'; },
          tasks: [{ do: 'Find the mass of the <b>shoe</b> in cubes.', goal: function (s) { return s.k === 'shoe' && s.c === OBJ.shoe; }, yes: 'The shoe balances 15 cubes.' }] }), do: '' },
        key: '<p>Heavier side goes <b>down</b>. Level means <b>equal</b>.</p>',
        check: [TU('s3', 0), TU('s3', 2), SK('tm-mass', 1)] },

      { id: 'compare', title: 'Bigger is not always heavier', exp: ['E2.4'], skill: 'tm-mass', hard: true,
        body: '<p>A big pillow can be lighter than a small rock. To compare masses, measure each one with the same unit, then <b>compare the counts</b>.</p>',
        watch: { mount: G3.view(levelView, { k: 'shoe', say: 'Shoe: 15 cubes' }), steps: [
          { say: 'The shoe balances 15 cubes.', ms: 1600 },
          { say: 'The mug is smaller, but it balances 18 cubes.', act: function (t) { return t.set({ k: 'mug', say: 'Mug: 18 cubes' }, 1800); } },
          { say: '18 is more than 15. The <b>mug is heavier</b>, even though it is smaller.', act: function (t) { return t.set({ say: '18 &gt; 15' }, 2000); } }
        ] },
        example: { mount: G3.view(levelView, { k: 'apple', say: 'Apple: 9 cubes' }), steps: [
          { say: 'My turn. An apple and an orange look about the same size. I measure the apple: 9 cubes.', ms: 1900 },
          { say: 'I measure the orange: 11 cubes.', act: function (t) { return t.set({ k: 'orange', say: 'Orange: 11 cubes' }, 1800); } },
          { say: 'I compare the counts. 11 is more than 9, so the <b>orange is heavier</b>.', act: function (t) { return t.set({ say: '11 &gt; 9' }, 2000); } }
        ] },
        ways: [
          { label: 'Hold them', html: '<p>Hold one object in each hand. Which hand goes down? Then check with a balance, because hands can be fooled.</p>' },
          { label: 'Mass is not capacity', html: '<div class="vs"><div><b class="t">Mass</b><p>How <b>heavy</b>. Use a balance.</p></div><div><b class="t">Capacity</b><p>How much it <b>holds</b>. Use cups.</p></div></div>' }
        ],
        key: '<p>Measure both, then <b>compare the counts</b>.</p>',
        mistake: '<p>Choosing the bigger object as heavier without measuring. Always check with the balance.</p>',
        check: [TU('s3', 1), SK('tm-mass', 2), SK('tm-mass', 3)] }
    ] },

    { id: 'capacity', title: 'Capacity', sub: 'How much a container holds.', concepts: [
      { id: 'fill', title: 'Count the cups', exp: ['E2.3'], skill: 'tm-cap',
        body: '<p><b>Capacity</b> is how much a container can hold. Fill it with cups of water and <b>count the cups</b>.</p>',
        watch: { mount: G3.view(jugView, { p: 0, say: '' }), steps: [
          { say: 'Pour full cups into the jug.', act: function (t) { var p = []; for (var i = 1; i <= 8; i++) p.push({ p: i, say: i + ' cup' + (i > 1 ? 's' : '') }); return t.seq(p, 450); } },
          { say: 'Full to the top. The jug holds <b>8 cups</b>.', act: function (t) { return t.set({ say: 'The jug holds 8 cups' }, 2000); } }
        ] },
        example: { mount: G3.view(jugView, { size: 6, p: 0, say: '' }), steps: [
          { say: 'My turn. I pour full cups into a smaller jug.', act: function (t) { var p = []; for (var i = 1; i <= 6; i++) p.push({ p: i, say: i + ' cup' + (i > 1 ? 's' : '') }); return t.seq(p, 450); } },
          { say: 'Full to the top. This jug holds <b>6 cups</b>.', act: function (t) { return t.set({ say: 'The jug holds 6 cups' }, 2000); } }
        ] },
        try: { mount: G3.play({ state: { p: 0, n: 0 }, draw: jugView,
          buttons: [{ label: 'Pour one cup', act: function (s) { if (s.p < 8) { s.p++; s.n++; } } }, { label: 'Empty the jug', act: function (s) { s.p = 0; s.n = 0; } }],
          info: function (s) { return s.p === 8 ? '<b>Full!</b> ' + s.n + ' cups.' : s.n + ' cup' + (s.n === 1 ? '' : 's') + ' poured.'; },
          tasks: [{ do: 'Fill the jug to the top. How many cups does it hold?', goal: function (s) { return s.p === 8; }, yes: 'It holds 8 cups.' }] }), do: '' },
        key: '<p>Capacity: <b>how many cups fill it</b>.</p>',
        check: [TU('s4', 2), SK('tm-cap', 1)] },

      { id: 'accurate', title: 'Fill carefully', exp: ['E2.3'], skill: 'tm-cap', hard: true,
        body: '<p>To be accurate, fill each cup <b>to the top</b>, and fill the container <b>right to the top</b> without spilling. Half-full cups or spills make the count too high. Stopping early makes it too low.</p>',
        watch: { mount: G3.view(jugView, { p: 0, say: '' }), steps: [
          { say: 'Pour half-full cups.', act: function (t) { var p = []; for (var i = 1; i <= 16; i++) p.push({ p: i / 2, say: i + ' half cups' }); return t.seq(p, 250); } },
          { say: 'It took 16 half-full cups. That count is <b>too high</b>: the jug holds 8 full cups.', act: function (t) { return t.set({ say: '16 is too high' }, 2000); } },
          { say: 'Keep pouring past the top and it spills. That count is too high as well.', act: function (t) { return t.set({ p: 9, say: 'Spilled!' }, 2000); } }
        ] },
        example: { mount: G3.view(jugView, { size: 6, p: 0, say: '' }), steps: [
          { say: 'My turn. I pour 5 full cups and stop. The jug is not full, so 5 is too low.', act: function (t) { var p = []; for (var i = 1; i <= 5; i++) p.push({ p: i, say: i + ' cup' + (i > 1 ? 's' : '') }); return t.seq(p, 400); } },
          { say: 'I pour one more full cup. Now it is full to the top, with no spills.', act: function (t) { return t.set({ p: 6, say: '6 cups' }, 1800); } },
          { say: 'The jug holds <b>6 cups</b>. Full cups, full jug, no spills.', ms: 2000 }
        ] },
        ways: [
          { label: 'Bigger containers', html: '<p>A jug holds 4 cups. A pot holds 3 jugs. Count 4 cups, 3 times: 4, 8, 12. The pot holds <b>12 cups</b>.</p>' },
          { label: 'Different scoops', html: '<p>A bowl holds 6 big scoops or 12 small scoops. Smaller scoop, bigger count. The bowl did not change.</p>' }
        ],
        try: { mount: G3.play({ state: { p: 0, n: 0, sz: 1 }, draw: jugView,
          selects: [{ key: 'sz', label: 'Each cup is', options: [[1, 'full to the top'], [0.5, 'only half full']], change: function (s) { s.p = 0; s.n = 0; } }],
          buttons: [{ label: 'Pour one cup', act: function (s) { if (s.p <= 8) { s.p += s.sz; s.n++; } } }, { label: 'Empty the jug', act: function (s) { s.p = 0; s.n = 0; } }],
          info: function (s) { return s.p > 8 ? 'Spilled! Too high a count.' : s.p === 8 ? '<b>Full</b> with ' + s.n + ' cups.' + (s.sz < 1 ? ' Too high: half-full cups.' : '') : s.n + ' cups poured.'; },
          tasks: [{ do: 'Fill the jug with <b>half-full cups</b>. How many did it take?', goal: function (s) { return s.sz === 0.5 && s.p === 8; }, yes: '16 half-full cups. Double the true count of 8.' }] }), do: '' },
        key: '<p>Full cups, full container, <b>no spills</b>.</p>',
        mistake: '<p>Half-full cups make the count too high, because you need more of them. Stopping before the top makes the count too low. Spilling over the top makes it too high.</p>',
        check: [TU('s4', 0), TU('s4', 1), SK('tm-cap', 2)] }
    ] }
  ];

  A.register('time-mass', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Reading a clock</h2>' +
'<p>An <b>analog clock</b> has two hands. The <b>short hand</b> shows the hour. The <b>long hand</b> shows the minutes. The long hand moves 5 minutes from one number to the next, so count by 5s: 5, 10, 15 and so on. One hour has <b>60 minutes</b>.</p>' +
'<div class="lab"><span class="lt">Try it: set the clock</span>' +
'<div class="btnrow"><button type="button" class="btn alt" data-ck="-60">&minus; 1 hour</button><button type="button" class="btn alt" data-ck="-5">&minus; 5 min</button><button type="button" class="btn alt" data-ck="1">+ 1 min</button><button type="button" class="btn alt" data-ck="5">+ 5 min</button><button type="button" class="btn alt" data-ck="60">+ 1 hour</button></div>' +
'<div class="ctrl"><label for="ckf" style="display:flex;align-items:center;gap:8px;flex-direction:row"><input type="checkbox" id="ckf" checked style="width:22px;height:22px;margin:0"> Show minute numbers</label></div>' +
'<div class="fig" id="ckfig"></div><div class="out" id="ckout" aria-live="polite"></div></div>' +
'<div class="vs"><div><b class="t">Short hand</b><p>Shows the <b>hour</b>. It moves slowly.</p></div><div><b class="t">Long hand</b><p>Shows the <b>minutes</b>. Count by 5s.</p></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Read the short hand first: it gives the hour. If it is between two numbers, use the number it has just passed. Then count the long hand by 5s.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>The short hand has just passed the 4. The long hand is on the 6. Count by 5s to the 6: 5, 10, 15, 20, 25, 30. The time is <b>4:30</b>, or half past 4.</p><div class="fig">' + clock(4, 30, { label: 'Clock showing 4:30. The hour hand is halfway between 4 and 5. The minute hand points to 6.' }) + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Digital clocks, seconds and timers</h2>' +
'<p>A <b>digital clock</b> shows the time with numbers. The number before the colon is the hour. The two numbers after it are the minutes. A <b>second</b> is very short, about the time it takes to say "one hippopotamus". 60 seconds make 1 minute. A <b>timer</b> counts down to zero.</p>' +
'<div class="tbl"><table><thead><tr><th>Unit</th><th>About how long</th></tr></thead><tbody>' +
'<tr><td class="l">1 second</td><td class="l">a clap of your hands</td></tr><tr><td class="l">1 minute = 60 seconds</td><td class="l">washing your hands well, 3 times</td></tr><tr><td class="l">1 hour = 60 minutes</td><td class="l">a long swimming lesson</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: run a timer</span>' +
'<div class="ctrl"><label for="tmr">Timer: <output id="tmro"></output><input type="range" id="tmr" min="10" max="120" step="5" value="75"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="tmgo">Start</button><button type="button" class="btn alt" id="tmrs">Reset</button></div>' +
'<div class="fig" id="tmfig"></div><div class="out" id="tmout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Reading 3:05 as "3 and 5 hours" or as "3:50". The 0 matters: 3:05 is 5 minutes past 3. 3:50 is 50 minutes past 3.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Quarter to 9 means 15 minutes before 9. 60 &minus; 15 = 45, so it is 45 minutes past 8. The digital clock shows <b>8:45</b>.</p><div class="fig">' + digital(8, 45) + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Mass with a pan balance</h2>' +
'<p><b>Mass</b> is how heavy something is. A <b>pan balance</b> compares masses. The heavier side goes <b>down</b>. When both sides are level, the masses are equal. We can measure mass by counting how many cubes balance an object.</p>' +
'<div class="lab"><span class="lt">Try it: balance with cubes</span>' +
'<div class="ctrl"><label for="bo">Object<select id="bo"><option value="apple">apple</option><option value="pencil">pencil</option><option value="orange">orange</option><option value="shoe">shoe</option><option value="mug">mug</option><option value="book">book</option></select></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-bc="1">+ 1 cube</button><button type="button" class="btn alt" data-bc="5">+ 5 cubes</button><button type="button" class="btn alt" data-bc="-1">&minus; 1 cube</button><button type="button" class="btn alt" data-bc="0">Empty</button></div>' +
'<div class="fig" id="bfig"></div><div class="out" id="bout" aria-live="polite"></div></div>' +
'<div class="vs"><div><b class="t">Mass</b><p>How <b>heavy</b> it is. Use a pan balance.</p></div><div><b class="t">Not capacity</b><p>Capacity is how much it <b>holds</b>. Use cups.</p></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Bigger is not always heavier. A big pillow can be lighter than a small rock. Use a balance to check.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>The balance is level with an apple on one side and 9 cubes on the other. So the apple has a mass of <b>9 cubes</b>.</p><div class="fig">' + balance('apple', 9, 0, 'A level pan balance. An apple on the left and 9 cubes on the right.') + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Capacity: how much it holds</h2>' +
'<p><b>Capacity</b> is how much a container can hold. We can measure it by counting cups of water, or scoops of rice. To be accurate, fill each cup <b>to the top</b>, and fill the container <b>right to the top</b> without spilling.</p>' +
'<div class="lab"><span class="lt">Try it: fill the jug</span>' +
'<div class="ctrl"><label for="jm">Each cup is<select id="jm"><option value="1">full to the top</option><option value="0.5">only half full</option></select></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="jp">Pour one cup</button><button type="button" class="btn alt" id="je">Empty the jug</button></div>' +
'<div class="fig" id="jfig"></div><div class="out" id="jout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Half-full cups make the count too <b>high</b>, because you need more of them. Stopping before the top makes the count too <b>low</b>. Spilling over the top makes it too <b>high</b>.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A jug holds 4 cups. A pot holds 3 jugs. Count 4 cups, 3 times: 4, 8, 12. The pot holds <b>12 cups</b>.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'What time is it?', fig: clock(7, 0, { label: 'Clock showing 7:00' }), options: ['7:00', '12:07', '7:12'], answer: 0, why: 'The short hand is on 7. The long hand is on 12, which means 0 minutes.' },
        { q: 'The long hand points to 3. How many minutes past the hour is it?', options: ['3', '15', '30'], answer: 1, why: 'Count by 5s to the 3: 5, 10, 15.' },
        { q: 'How many minutes are in 1 hour?', options: ['30', '60', '100'], answer: 1, why: 'The long hand goes all the way around once: 60 minutes.' }
      ],
      s2: [
        { q: 'Half past 2 on a digital clock is:', options: ['2:30', '2:50', '3:30'], answer: 0, why: 'Half an hour is 30 minutes. 30 minutes past 2.' },
        { q: '1 minute = ___ seconds', options: ['10', '60', '100'], answer: 1, why: 'There are 60 seconds in a minute.' },
        { q: 'Which takes about 1 second?', options: ['a clap', 'eating lunch', 'a school day'], answer: 0, why: 'A clap is very quick.' }
      ],
      s3: [
        { q: 'On a pan balance, the heavier side goes:', options: ['down', 'up', 'sideways'], answer: 0, why: 'More mass pulls that pan down.' },
        { q: 'A shoe balances 15 cubes. A mug balances 18 cubes. Which is heavier?', options: ['the shoe', 'the mug', 'they are the same'], answer: 1, why: '18 cubes is more than 15 cubes.' },
        { q: 'A balance is level. What does that tell you?', options: ['the masses are equal', 'the left is heavier', 'the right is bigger'], answer: 0, why: 'Level means neither side is heavier.' }
      ],
      s4: [
        { q: 'Ava used half-full cups to fill a pot. Her count is:', options: ['too high', 'too low', 'just right'], answer: 0, why: 'Each cup holds less, so she needs more cups.' },
        { q: 'Water spilled over the top as Ben filled the jug. His count is:', options: ['too high', 'too low', 'just right'], answer: 0, why: 'He counted water that did not stay in the jug.' },
        { q: 'A bottle holds 5 cups. A bowl holds 3 cups. Which holds more?', options: ['the bottle', 'the bowl', 'they hold the same'], answer: 0, why: '5 cups is more than 3 cups.' }
      ]
    },

    init: function (root) {
      var $ = A.$, t = 3 * 60 + 25;
      function ck() {
        var h = Math.floor(t / 60) % 12 || 12, m = t % 60;
        $('#ckfig', root).innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center">' + clock(h, m, { fives: $('#ckf', root).checked, label: 'Clock showing ' + h + ':' + pad(m) }).replace('viewBox="0 0 300 300"', 'viewBox="-24 -24 348 348"') + digital(h, m) + '</div>';
        $('#ckout', root).innerHTML = '<p><span class="big">' + h + ':' + pad(m) + '</span></p><p>Say it: <b>' + words(h, m) + '</b>. The short hand ' + (m === 0 ? 'is on the ' + h : 'has passed the ' + h) + '. The long hand shows ' + m + ' minute' + (m === 1 ? '' : 's') + '.</p>';
      }
      root.querySelectorAll('[data-ck]').forEach(function (b) { b.addEventListener('click', function () { t = ((t + +b.getAttribute('data-ck')) % 720 + 720) % 720; ck(); }); });
      A.bind(root, ['ckf'], ck);
      var left = 0, run = null;
      function tdraw() {
        var tot = +$('#tmr', root).value, m = Math.floor(left / 60), s = left % 60, frac = tot ? left / tot : 0, r = 90, cx = 110, cy = 110;
        $('#tmro', root).textContent = Math.floor(tot / 60) + ':' + pad(tot % 60);
        var a = frac * 2 * Math.PI, x = cx + r * Math.sin(a), y = cy - r * Math.cos(a), arc = frac >= 0.999 ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:color-mix(in srgb,var(--strand) 45%,var(--card))"/>' : frac > 0 ? '<path d="M' + cx + ' ' + cy + ' V' + (cy - r) + ' A' + r + ' ' + r + ' 0 ' + (frac > 0.5 ? 1 : 0) + ' 1 ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' Z" style="fill:color-mix(in srgb,var(--strand) 45%,var(--card))"/>' : '';
        $('#tmfig', root).innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center">' + A.svg(220, 220, '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 6) + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="5"/>' + arc, 'Timer dial. ' + left + ' seconds left.') + digital(m, s) + '</div>';
        $('#tmout', root).innerHTML = '<p><span class="big">' + left + ' seconds left</span></p><p>' + (left >= 60 ? m + ' minute' + (m > 1 ? 's' : '') + ' and ' + s + ' seconds is ' + m + ' &times; 60 + ' + s + ' = ' + left + ' seconds.' : left ? 'Less than 1 minute.' : 'Time is up!') + '</p>';
        $('#tmgo', root).textContent = run ? 'Pause' : 'Start';
      }
      function stop() { if (run) clearInterval(run); run = null; }
      $('#tmr', root).addEventListener('input', function () { stop(); left = +$('#tmr', root).value; tdraw(); });
      $('#tmgo', root).addEventListener('click', function () {
        if (run) { stop(); tdraw(); return; }
        if (!left) left = +$('#tmr', root).value;
        run = setInterval(function () { if (!root.isConnected || !document.body.contains(root)) { stop(); return; } left = Math.max(0, left - 1); if (!left) stop(); tdraw(); }, 1000);
        tdraw();
      });
      $('#tmrs', root).addEventListener('click', function () { stop(); left = +$('#tmr', root).value; tdraw(); });
      left = +$('#tmr', root).value; tdraw();
      var cubes = 4;
      function bl() {
        var k = $('#bo', root).value, w = OBJ[k], d = w - cubes;
        $('#bfig', root).innerHTML = balance(k, cubes, d > 0 ? Math.min(12, 3 + d) : d < 0 ? Math.max(-12, d - 3) : 0, 'Pan balance: a ' + k + ' on the left and ' + cubes + ' cubes on the right. ' + (d > 0 ? 'The ' + k + ' side is lower.' : d < 0 ? 'The cube side is lower.' : 'The balance is level.'));
        $('#bout', root).innerHTML = d > 0 ? '<p><span class="big">' + cubes + ' cube' + (cubes === 1 ? '' : 's') + '</span></p><p>The ' + k + ' side is lower, so the ' + k + ' is heavier than ' + cubes + ' cube' + (cubes === 1 ? '' : 's') + '. Add cubes.</p>' :
          d < 0 ? '<p><span class="big">' + cubes + ' cubes</span></p><p>The cube side is lower, so the cubes are heavier. Take some away.</p>' :
          '<p><span class="big">Level!</span></p><p>The ' + k + ' has a mass of about <b>' + w + ' cubes</b>.</p>';
      }
      root.querySelectorAll('[data-bc]').forEach(function (b) { b.addEventListener('click', function () { var v = +b.getAttribute('data-bc'); cubes = v ? Math.max(0, Math.min(30, cubes + v)) : 0; bl(); }); });
      $('#bo', root).addEventListener('change', function () { cubes = 0; bl(); });
      bl();
      var poured = 0, cups = 0;
      function jg() {
        var size = +$('#jm', root).value, cap = 8;
        $('#jfig', root).innerHTML = jug(cap, poured, 'A jug that holds 8 full cups. It has ' + poured + ' cups of water in it.');
        var msg;
        if (poured > cap) msg = 'Spilled! Water went over the top. The cups you counted for the spill make the count too high.';
        else if (poured === cap) msg = size === 1 ? 'Full! It took <b>' + cups + ' full cups</b>. The jug holds 8 cups.' : 'Full! It took <b>' + cups + ' half-full cups</b>. That count is too high: the jug really holds 8 full cups.';
        else msg = cups ? 'Not full yet. If you stop now, your count of ' + cups + ' will be too low.' : 'The jug is empty. Pour a cup.';
        $('#jout', root).innerHTML = '<p><span class="big">' + cups + ' cup' + (cups === 1 ? '' : 's') + ' poured</span></p><p>' + msg + '</p>';
        $('#jp', root).disabled = poured > cap;
      }
      $('#jp', root).addEventListener('click', function () { poured += +$('#jm', root).value; cups++; jg(); });
      $('#je', root).addEventListener('click', function () { poured = 0; cups = 0; jg(); });
      $('#jm', root).addEventListener('change', function () { poured = 0; cups = 0; jg(); });
      jg();
    },

    quiz: [
      { q: 'What time does this clock show?', type: 'mc', options: ['4:30', '6:20', '5:30', '4:06'], answer: 0, fig: clock(4, 30, { label: 'Clock: hour hand halfway between 4 and 5, minute hand on 6' }),
        hint: 'The short hand has passed the 4. Count the long hand by 5s.', explain: 'The hour is 4. The long hand on the 6 is 30 minutes. 4:30.' },
      { q: 'Which digital time means quarter to 9?', type: 'mc', options: ['8:45', '9:15', '9:45', '8:15'], answer: 0, hint: 'Quarter to 9 is 15 minutes before 9.', explain: '15 minutes before 9:00 is 8:45.' },
      { q: '1 minute = ___ seconds', type: 'num', answer: 60, unit: 'seconds', hint: 'The second hand goes all the way around once in 1 minute.', explain: '1 minute = 60 seconds.' },
      { q: 'Which unit would you use to time how long you sleep at night?', type: 'mc', options: ['seconds', 'minutes', 'hours'], answer: 2, hint: 'Is it short or very long?', explain: 'A night of sleep is about 10 hours, so use hours.' },
      { q: 'A pencil case balances 15 cubes. A lunch box balances 22 cubes. Which is heavier?', type: 'mc', options: ['the lunch box', 'the pencil case', 'they are the same'], answer: 0, hint: 'More cubes means more mass.', explain: '22 cubes is more than 15 cubes, so the lunch box is heavier.' },
      { q: 'Lin fills a pot using cups that are only half full. Her count is:', type: 'mc', options: ['too high', 'too low', 'just right'], answer: 0, hint: 'Does she need more cups or fewer?', explain: 'Each cup holds less water, so she needs more cups. The count is too high.' },
      { q: 'A jug holds 4 cups. A pot holds 3 jugs. How many cups does the pot hold?', type: 'num', answer: 12, unit: 'cups', hint: 'Count 4 cups, 3 times.', explain: '4 + 4 + 4 = 12 cups.' }
    ],

    practice: [
      { id: 'tm-read', name: 'Read a clock', code: 'E2.6', gen: function (lv) {
        var h = R.int(1, 12), m = lv === 1 ? R.pick([0, 30]) : lv === 2 ? R.int(0, 11) * 5 : R.int(0, 59);
        if (lv === 3 && m % 5 === 0) m = (m + R.int(1, 4)) % 60;
        var right = h + ':' + pad(m), wr = [nxt(h) + ':' + pad(m), (Math.round(m / 5) % 12 || 12) + ':' + pad((h % 12) * 5), h + ':' + pad((m + 5) % 60), (h === 1 ? 12 : h - 1) + ':' + pad(m)];
        var o = R.mc(right, wr), mk = m % 5 ? 'The long hand is ' + (m % 5) + ' small marks past ' + (Math.floor(m / 5) * 5) + ' minutes, so ' + m + '.' : 'Count the long hand by 5s: ' + m + ' minutes.';
        return { q: 'What time does the clock show?', type: 'mc', options: o.options, answer: o.answer, fig: clock(h, m, { fives: lv === 1, label: 'An analog clock' }),
          hint: 'Short hand first for the hour. If it is between two numbers, use the one it has passed.',
          steps: ['The short hand ' + (m === 0 ? 'is on' : 'has just passed') + ' the ' + h + '. The hour is ' + h + '.', mk, 'The time is ' + right + ', ' + words(h, m) + '.'], explain: 'It is ' + right + ', ' + words(h, m) + '.' };
      } },
      { id: 'tm-words', name: 'Time in words', code: 'E2.6', gen: function (lv) {
        var h = R.int(1, 12), m = lv === 1 ? R.pick([0, 30]) : lv === 2 ? R.pick([15, 30, 45]) : R.pick([5, 10, 20, 25, 35, 40, 50, 55]);
        var right = h + ':' + pad(m), w = words(h, m);
        var o = R.mc(right, [nxt(h) + ':' + pad(m), h + ':' + pad(60 - m === 60 ? 15 : 60 - m), nxt(h) + ':' + pad((60 - m) % 60), h + ':' + pad((m + 15) % 60), (h === 1 ? 12 : h - 1) + ':' + pad(m)]);
        return { q: 'Which digital time means <b>' + w + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? clock(h, m, { label: 'An analog clock showing the time' }) : '',
          hint: m > 30 ? '"To" means before the next hour. Subtract from 60.' : '"Past" means after the hour.',
          steps: [m > 30 ? '"' + w + '" is ' + (60 - m) + ' minutes before ' + nxt(h) + ':00.' : 'Start at ' + h + ':00.', m > 30 ? '60 &minus; ' + (60 - m) + ' = ' + m + ', so it is ' + m + ' minutes past ' + h + '.' : 'Go ' + m + ' minutes past ' + h + '.', 'The digital clock shows ' + right + '.'], explain: w + ' is ' + right + '.' };
      } },
      { id: 'tm-units', name: 'Seconds, minutes, hours', code: 'E2.6', gen: function (lv) {
        if (lv === 1) {
          var T = [['blink your eyes', 'seconds'], ['tie your shoes', 'seconds'], ['clap 5 times', 'seconds'], ['brush your teeth', 'minutes'], ['eat lunch', 'minutes'], ['have recess', 'minutes'], ['bake cookies', 'minutes'], ['spend a school day', 'hours'], ['sleep at night', 'hours'], ['drive from Toronto to Montréal', 'hours']], e = R.pick(T), U = ['seconds', 'minutes', 'hours'];
          return { q: 'Which unit would you use to time how long it takes to <b>' + e[0] + '</b>?', type: 'mc', options: U, answer: U.indexOf(e[1]),
            hint: 'A second is a clap. A minute is washing your hands 3 times. An hour is a long lesson.', steps: ['Picture doing it.', 'Is it as short as a clap, a few minutes, or most of a day?', 'Use ' + e[1] + '.'], explain: 'Use ' + e[1] + '.' };
        }
        var k = R.int(0, lv === 2 ? 1 : 2), a = R.int(2, 5), b = R.pick([10, 15, 20, 30, 45]), q, ans, st;
        if (k === 0) { q = a + ' minutes = ___ seconds'; ans = a * 60; st = '1 minute = 60 seconds. ' + a + ' &times; 60 = ' + ans + '.'; }
        else if (k === 1) { q = a + ' hours = ___ minutes'; ans = a * 60; st = '1 hour = 60 minutes. ' + a + ' &times; 60 = ' + ans + '.'; }
        else { a = R.int(1, 2); q = a + ' minute' + (a > 1 ? 's' : '') + ' ' + b + ' seconds = ___ seconds'; ans = a * 60 + b; st = a + ' &times; 60 = ' + a * 60 + '. Add ' + b + ': ' + ans + '.'; }
        return { q: q, type: 'num', answer: ans, unit: /___ seconds/.test(q) ? 'seconds' : 'minutes',
          hint: 'Each minute is 60 seconds. Each hour is 60 minutes.', steps: ['Use 60 for each bigger unit.', st, q.replace('___', ans) + '.'], explain: q.replace('___', ans) + '.' };
      } },
      { id: 'tm-mass', name: 'Mass with a balance', code: 'E2.4', gen: function (lv) {
        var ks = Object.keys(OBJ), nm = function (k) { return THING[k][0]; };
        if (lv === 1) {
          var k = R.pick(ks), n = R.int(3, 16);
          return { q: 'The balance is level. What is the mass of the ' + nm(k) + ' in cubes?', type: 'num', answer: n, unit: 'cubes', fig: balance(k, n, 0, 'A level pan balance. ' + G3.an(nm(k)) + ' on the left and ' + n + ' cubes on the right.'),
            hint: 'Level means equal. Count the cubes in rows of 6.', steps: ['The balance is level, so both sides have the same mass.', 'Count the cubes: rows of 6, then the extras.', 'The ' + nm(k) + ' has a mass of ' + n + ' cubes.'], explain: 'Level means equal: ' + n + ' cubes.' };
        }
        if (lv === 2) {
          var p = R.shuffle(ks).slice(0, 2), x = R.int(5, 20), y = R.int(5, 20);
          while (y === x) y = R.int(5, 20);
          var heavy = x > y ? p[0] : p[1], ask = R.int(0, 1) ? 'heavier' : 'lighter', ans = ask === 'heavier' ? heavy : (heavy === p[0] ? p[1] : p[0]);
          var o = R.mc('the ' + nm(ans), ['the ' + nm(ans === p[0] ? p[1] : p[0]), 'they are the same']);
          return { q: G3.an(nm(p[0]), true) + ' balances ' + x + ' cubes. ' + G3.an(nm(p[1]), true) + ' balances ' + y + ' cubes. Which is ' + ask + '?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'More cubes means more mass.', steps: ['Compare ' + x + ' and ' + y + '.', Math.max(x, y) + ' is more, so the ' + nm(heavy) + ' is heavier.', 'The ' + ask + ' one is the ' + nm(ans) + '.'], explain: 'The ' + nm(ans) + ' is ' + ask + '.' };
        }
        if (R.int(0, 1)) {
          var c = R.int(2, 4), each = R.int(3, 9);
          return { q: c + ' apples balance ' + c * each + ' cubes. The apples are all the same. What is the mass of 1 apple?', type: 'num', answer: each, unit: 'cubes',
            hint: 'Share the cubes equally among the apples.', steps: [c * each + ' cubes balance ' + c + ' apples.', c * each + ' &divide; ' + c + ' = ' + each + '.', '1 apple balances ' + each + ' cubes.'], explain: c * each + ' &divide; ' + c + ' = ' + each + ' cubes.' };
        }
        var tr = R.shuffle(['book', 'shoe', 'mug', 'apple']).slice(0, 3), ask2 = R.int(0, 1) ? 'heaviest' : 'lightest';
        var o2 = R.mc('the ' + (ask2 === 'heaviest' ? tr[0] : tr[2]), ['the ' + tr[1], 'the ' + (ask2 === 'heaviest' ? tr[2] : tr[0])]);
        return { q: 'The ' + tr[0] + ' is heavier than the ' + tr[1] + '. The ' + tr[1] + ' is heavier than the ' + tr[2] + '. Which is the ' + ask2 + '?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Put them in order from heaviest to lightest.', steps: ['Order: ' + tr[0] + ', then ' + tr[1] + ', then ' + tr[2] + '.', 'The heaviest is first. The lightest is last.', 'The ' + ask2 + ' is the ' + (ask2 === 'heaviest' ? tr[0] : tr[2]) + '.'], explain: 'Heaviest to lightest: ' + tr.join(', ') + '.' };
      } },
      { id: 'tm-cap', name: 'Capacity', code: 'E2.3', gen: function (lv) {
        var nmz = R.pick(['Ava', 'Ben', 'Raj', 'Mei', 'Sam']);
        if (lv === 3 || (lv === 2 && R.int(0, 1))) {
          var M = [['uses cups that are only half full', 'too high', 'Each cup holds less, so more cups are needed.'], ['stops pouring before the pot is full', 'too low', 'The pot could hold more than was counted.'], ['lets water spill over the top of the pot', 'too high', 'Some counted water did not stay in the pot.'], ['fills each cup to the top and fills the pot right to the top', 'just right', 'Every cup is full and the pot is exactly full.']][R.int(0, 3)];
          var opts = ['too high', 'too low', 'just right'];
          return { q: nmz + ' measures how many cups a pot holds, and ' + M[0] + '. The count is:', type: 'mc', options: opts, answer: opts.indexOf(M[1]),
            hint: 'Think: does this need more cups, or fewer, than the true amount?', steps: ['Picture each cup going into the pot.', M[2], 'So the count is ' + M[1] + '.'], explain: M[2] + ' The count is ' + M[1] + '.' };
        }
        if (lv === 1) {
          var a = R.int(2, 10), b = R.int(2, 10); while (a === b) b = R.int(2, 10);
          var cs = R.shuffle(['vase', 'bottle', 'bowl', 'jug', 'pot']).slice(0, 2), mo = a > b ? cs[0] : cs[1];
          var o = R.mc('the ' + mo, ['the ' + (mo === cs[0] ? cs[1] : cs[0]), 'they hold the same']);
          return { q: 'A ' + cs[0] + ' holds ' + a + ' cups. A ' + cs[1] + ' holds ' + b + ' cups. Which holds more?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'More cups means more capacity.', steps: ['Compare ' + a + ' cups and ' + b + ' cups.', Math.max(a, b) + ' is more.', 'The ' + mo + ' holds more.'], explain: 'The ' + mo + ' holds ' + Math.max(a, b) + ' cups, which is more.' };
        }
        var j = R.int(2, 5), p = R.int(2, 5);
        return { q: 'A jug holds ' + j + ' cups. A pot holds ' + p + ' jugs. How many cups does the pot hold?', type: 'num', answer: j * p, unit: 'cups',
          hint: 'Count ' + j + ' cups, ' + p + ' times.', steps: ['Each jug is ' + j + ' cups.', 'Skip count by ' + j + ', ' + p + ' times: ' + Array.apply(null, Array(p)).map(function (_, i) { return j * (i + 1); }).join(', ') + '.', 'The pot holds ' + j * p + ' cups.'], explain: p + ' &times; ' + j + ' = ' + j * p + ' cups.' };
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
    function t2(h, m) { return h + ':' + pad(m); }
    function minsFor(lv) { return lv === 1 ? R.pick([0, 30]) : lv === 2 ? R.int(0, 11) * 5 : R.int(0, 59); }
    function small(h, m) { return clock(h, m, { label: 'A clock' }).replace('width="300"', 'width="190"'); }
    /* three clocks with different times: the right one and near misses */
    function clockSet(h, m) {
      var set = [[h, m]], cand = R.shuffle([[nxt(h), m], [h, (m + 30) % 60], [(m / 5) % 12 || 12, (h % 12) * 5]]);
      cand.forEach(function (c) { if (set.length < 3 && !set.some(function (s) { return s[0] === c[0] && s[1] === c[1]; })) set.push(c); });
      return R.shuffle(set);
    }
    var ACTS = [['blink your eyes', 'seconds'], ['tie your shoes', 'seconds'], ['clap 5 times', 'seconds'], ['brush your teeth', 'minutes'], ['eat lunch', 'minutes'], ['have recess', 'minutes'], ['spend a school day', 'hours'], ['sleep at night', 'hours'], ['drive from Toronto to Montréal', 'hours']];
    var SEC = { seconds: 1, second: 1, minutes: 60, minute: 60, hours: 3600, hour: 3600 };

    var SHAPES = {
      'tm-read': [
        [1, 'tap', function (lv) {
          var h = R.int(1, 12), m = minsFor(lv === 3 ? 2 : lv), set = clockSet(h, m), k = 0;
          set.forEach(function (s, j) { if (s[0] === h && s[1] === m) k = j; });
          return { q: 'Tap the clock that shows <b>' + t2(h, m) + '</b>.', type: 'tap', tiles: set.map(function (s) { return small(s[0], s[1]); }), answer: k, answerText: 'the clock showing ' + t2(h, m),
            hint: 'Check the short hand for the hour first. Then the long hand for the minutes.', steps: ['At ' + t2(h, m) + ', the short hand is ' + (m ? 'just past the ' : 'on the ') + h + '.', 'The long hand points to ' + (m ? m + ' minutes' : 'the 12') + '.'],
            explain: t2(h, m) + ' is ' + words(h, m) + '.', meta: { k: 'clock-tap', h: h, m: m } };
        }],
        [1, 'fill', function (lv) {
          var h = R.int(1, 12), m = minsFor(lv);
          return { q: 'Read the clock. Fill in the blanks.', type: 'fill', fig: clock(h, m, { fives: lv === 1 }), fill: 'The hour is [[]]. The minutes are [[]].', answers: [h, m],
            hint: 'The short hand shows the hour. Count the long hand by 5s for the minutes.', steps: ['The short hand ' + (m ? 'has passed' : 'is on') + ' the ' + h + '.', 'The long hand shows ' + m + ' minutes.'],
            explain: 'It is ' + t2(h, m) + '.', meta: { k: 'clock-fill' } };
        }],
        [1, 'tf', function (lv) {
          var h = R.int(1, 12), m = lv === 1 ? R.pick([0, 30]) : R.int(1, 11) * 5, who = nm(), truth = !R.int(0, 1);
          var swap = m ? [(m / 5) % 12 || 12, (h % 12) * 5] : [nxt(h), 0], said = truth ? t2(h, m) : t2(swap[0], swap[1]);
          if (said === t2(h, m)) said = t2(nxt(h), m);
          var right = 'The short hand shows the hour, ' + h + '. The long hand shows ' + m + ' minutes. It is ' + t2(h, m) + '.';
          return { q: who + ' says this clock shows <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: said === t2(h, m), fig: clock(h, m),
            why: why(right, ['The long hand shows the hour.', 'Read the number each hand is closest to, in any order.', 'The minutes are the number the long hand points to.']),
            hint: 'Which hand is short? Which is long?', steps: [right], explain: right, meta: { k: 'clock-tf', said: said } };
        }]
      ],
      'tm-words': [
        [1, 'match', function (lv) {
          var ms = lv === 1 ? [0, 30, 15] : R.shuffle([15, 30, 45, 10, 20, 40, 50]).slice(0, 3), hs = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 3);
          var pairs = ms.map(function (m, i) { return [words(hs[i], m), t2(hs[i], m)]; });
          return { q: 'Match each time in words to its digital time.', type: 'match', pairs: pairs,
            hint: '"Past" is after the hour. "To" is before the next hour.', steps: ['Quarter past is 15 minutes. Half past is 30. Quarter to is 45 minutes past the hour before.'],
            explain: pairs.map(function (p) { return p[0] + ' is ' + p[1]; }).join('. ') + '.', meta: { k: 'time-match' } };
        }],
        [1, 'tap', function (lv) {
          var h = R.int(1, 11), m = lv === 1 ? R.pick([0, 30]) : R.pick([15, 30, 45]), set = clockSet(h, m), k = 0;
          set.forEach(function (s, j) { if (s[0] === h && s[1] === m) k = j; });
          return { q: 'Tap the clock that shows <b>' + words(h, m) + '</b>.', type: 'tap', tiles: set.map(function (s) { return small(s[0], s[1]); }), answer: k, answerText: 'the clock showing ' + t2(h, m),
            hint: m === 45 ? 'Quarter to ' + nxt(h) + ' means 15 minutes before ' + nxt(h) + ':00.' : 'Find the hour first, then the minutes.', steps: [words(h, m) + ' is ' + t2(h, m) + '.'],
            explain: words(h, m) + ' is ' + t2(h, m) + '.', meta: { k: 'time-tap', said: words(h, m) } };
        }],
        [1, 'order', function (lv) {
          var base = R.int(7, 9), list = [], seen = {};
          while (list.length < (lv === 1 ? 3 : 4)) { var h = base + R.int(0, 2), m = R.pick(lv === 1 ? [0, 30] : [0, 15, 30, 45]), v = h * 60 + m; if (seen[v]) continue; seen[v] = 1; list.push([v, R.int(0, 1) ? words(h, m) : t2(h, m)]); }
          list.sort(function (a, b) { return a[0] - b[0]; });
          return { q: 'These things happen in the morning. Put the times in order from <b>earliest to latest</b>.', type: 'order', items: list.map(function (x) { return x[1]; }), first: 'earliest', last: 'latest',
            hint: 'Change the times in words to digital times first.', steps: list.map(function (x) { return x[1] + ' = ' + t2(Math.floor(x[0] / 60), x[0] % 60) + '.'; }),
            explain: list.map(function (x) { return x[1]; }).join(', ') + '.', meta: { k: 'time-order' } };
        }],
        [2, 'mistake', function (lv) {
          var h = R.int(1, 11), who = nm(), truth = !R.int(0, 2), said = truth ? t2(h, 45) : t2(nxt(h), 45);
          var right = 'Quarter to ' + nxt(h) + ' is 15 minutes before ' + nxt(h) + ':00. That is ' + t2(h, 45) + '.';
          return { q: who + ' says <b>quarter to ' + nxt(h) + '</b> is <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Quarter to ' + nxt(h) + ' is after ' + nxt(h) + ':00.', 'Quarter means 25 minutes.', 'Quarter to and quarter past are the same time.']),
            hint: '"To" means before the hour.', steps: [right], explain: right, meta: { k: 'time-tf', w: 'quarter to ' + nxt(h), said: said } };
        }]
      ],
      'tm-units': [
        [1, 'match', function (lv) {
          var pairs = ['seconds', 'minutes', 'hours'].map(function (u) { return [R.pick(ACTS.filter(function (a) { return a[1] === u; }))[0], u]; });
          return { q: 'Match each activity to the best unit for timing it.', type: 'match', pairs: pairs,
            hint: 'A second is a clap. A minute is washing your hands 3 times. An hour is a long lesson.', steps: pairs.map(function (p) { return 'To ' + p[0] + ': ' + p[1] + '.'; }),
            explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'tunit-match' } };
        }],
        [1, 'pick', function (lv) {
          var u = R.pick(['seconds', 'minutes', 'hours']), good = R.shuffle(ACTS.filter(function (a) { return a[1] === u; })).slice(0, 2), bad = R.shuffle(ACTS.filter(function (a) { return a[1] !== u; })).slice(0, 3);
          var opts = R.shuffle(good.concat(bad)), ans = []; opts.forEach(function (a, j) { if (a[1] === u) ans.push(j); });
          return { q: 'Pick every activity you would time in <b>' + u + '</b>.', type: 'pick', options: opts.map(function (a) { return a[0]; }), answer: ans,
            hint: 'Picture doing each one.', steps: opts.map(function (a) { return a[0].charAt(0).toUpperCase() + a[0].slice(1) + ': ' + a[1] + '.'; }),
            explain: ans.map(function (j) { return opts[j][0]; }).join(' and ') + ' take ' + u + '.', meta: { k: 'tunit-pick', u: u } };
        }],
        [1, 'tf', function (lv) {
          var big = R.pick(['minute', 'hour']), small2 = big === 'minute' ? 'seconds' : 'minutes', a = lv === 1 ? 1 : R.int(2, 4), truth = !R.int(0, 1), said = truth ? a * 60 : a * 100;
          var right = '1 ' + big + ' = 60 ' + small2 + (a > 1 ? ', so ' + a + ' ' + big + 's = ' + a * 60 + ' ' + small2 : '') + '.';
          return { q: 'True or false: <b>' + a + ' ' + big + (a > 1 ? 's' : '') + ' = ' + said + ' ' + small2 + '</b>', type: 'tf', answer: truth,
            why: why(right, ['Time works like metres: 100 in each.', '1 ' + big + ' = 10 ' + small2 + '.', 'Time units cannot be changed.']),
            hint: 'How many ' + small2 + ' are in 1 ' + big + '?', steps: [right], explain: right, meta: { k: 'tunit-tf', a: a, big: big, small: small2, said: said } };
        }],
        [2, 'order', function (lv) {
          var opts = R.shuffle([['30 seconds', 30], ['1 minute', 60], ['90 seconds', 90], ['5 minutes', 300], ['1 hour', 3600], ['2 hours', 7200], ['45 minutes', 2700]]).slice(0, 4).sort(function (a, b) { return a[1] - b[1]; });
          return { q: 'Put these from <b>shortest to longest</b>.', type: 'order', items: opts.map(function (o) { return o[0]; }), first: 'shortest', last: 'longest',
            hint: '60 seconds = 1 minute. 60 minutes = 1 hour.', steps: ['Change each one to seconds or minutes to compare.'],
            explain: opts.map(function (o) { return o[0]; }).join(', ') + '.', meta: { k: 'tunit-order' } };
        }]
      ],
      'tm-mass': [
        [1, 'tf', function (lv) {
          var ks = Object.keys(OBJ), k = R.pick(ks), c = OBJ[k] + R.pick([-4, -2, 3, 5]);
          if (c < 1) c = OBJ[k] + 3;
          var d = OBJ[k] - c, ask = R.pick(['heavier', 'lighter']), truth = ask === 'heavier' ? d > 0 : d < 0;
          var right = 'The side that goes down is heavier. ' + (d > 0 ? 'The ' + THING[k][0] + ' side is down, so the ' + THING[k][0] + ' is heavier.' : 'The cube side is down, so the cubes are heavier.');
          return { q: 'True or false: the ' + THING[k][0] + ' is <b>' + ask + '</b> than the cubes.', type: 'tf', answer: truth, fig: balance(k, c, d > 0 ? Math.min(12, 3 + d) : Math.max(-12, d - 3), 'Pan balance: ' + G3.an(THING[k][0]) + ' and ' + c + ' cubes'),
            why: why(right, ['The side that goes up is heavier.', 'A level balance means one side is heavier.', 'More cubes always means lighter.']),
            hint: 'Which side is lower?', steps: [right], explain: right, meta: { k: 'mass-tf', obj: k, c: c, ask: ask } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), a = R.int(8, 25), b = R.int(3, a - 2), c = R.pick([['lunch bag', 'pencil case'], ['backpack', 'water bottle'], ['library book', 'notebook']]);
          return { q: who + "'s " + c[0] + ' balances ' + a + ' cubes. ' + who + "'s " + c[1] + ' balances ' + b + ' cubes. How many cubes heavier is the ' + c[0] + '?', type: 'num', answer: a - b, unit: 'cubes',
            hint: 'Compare the two masses. Subtract.', steps: [a + ' &minus; ' + b + ' = ' + (a - b) + '.'],
            explain: 'The ' + c[0] + ' is ' + (a - b) + ' cubes heavier.', meta: { k: 'mass-num', a: a, b: b } };
        }],
        [1, 'order', function (lv) {
          var ks = R.shuffle(Object.keys(OBJ)).slice(0, lv === 1 ? 3 : 4), sorted = ks.slice().sort(function (a, b) { return OBJ[a] - OBJ[b]; });
          return { q: 'On a balance: ' + ks.map(function (k) { return 'the ' + THING[k][0] + ' balances ' + OBJ[k] + ' cubes'; }).join(', ') + '. Put them in order from <b>lightest to heaviest</b>.', type: 'order', items: sorted.map(function (k) { return THING[k][0]; }), first: 'lightest', last: 'heaviest',
            hint: 'Fewer cubes means lighter.', steps: ['Compare the cube counts: ' + sorted.map(function (k) { return OBJ[k]; }).join(', ') + '.'],
            explain: sorted.map(function (k) { return THING[k][0]; }).join(', ') + '.', meta: { k: 'mass-order' } };
        }],
        [2, 'mistake', function (lv) {
          var who = nm(), big = R.int(4, 8), rock = R.int(12, 20), sayBig = !R.int(0, 2) ? false : true;
          var right = 'The rock balances more cubes (' + rock + ' is more than ' + big + '), so the rock is heavier. Bigger is not always heavier.';
          return { q: 'A big box of popcorn balances ' + big + ' cubes. A small rock balances ' + rock + ' cubes. ' + who + ' says the <b>' + (sayBig ? 'popcorn' : 'rock') + '</b> is heavier. True or false: ' + who + ' is right.', type: 'tf', answer: !sayBig,
            why: why(right, ['Bigger things are always heavier.', 'Small things have no mass.', 'You cannot compare different objects.']),
            hint: 'Compare the cubes, not the size.', steps: [right], explain: right, meta: { k: 'mass-tf2', a: big, b: rock, said: sayBig ? 'a' : 'b' } };
        }]
      ],
      'tm-cap': [
        [1, 'tap', function (lv) {
          var f = R.int(2, 7), set = R.shuffle([f, f === 7 ? f - 2 : f + 1, f === 2 ? f + 2 : f - 1]);
          return { q: 'Each jug holds 8 cups. Tap the jug with <b>' + f + ' cups</b> of water.', type: 'tap', tiles: set.map(function (v) { return jug(8, v).replace('width="330"', 'width="200"'); }), answer: set.indexOf(f), answerText: 'the jug filled to ' + f,
            hint: 'Read the marks on the side of each jug.', steps: ['Find the jug where the water reaches the ' + f + ' mark.'],
            explain: 'That jug holds ' + f + ' cups of water.', meta: { k: 'cap-tap', f: f } };
        }],
        [1, 'story', function (lv) {
          var who = nm(), a = R.int(5, 12), b = R.int(2, a - 1), c = R.pick([['water bottle', 'small jar'], ['bucket', 'bowl'], ['watering can', 'mug']]);
          return { q: who + ' fills a ' + c[0] + ' with ' + a + ' cups of water and a ' + c[1] + ' with ' + b + ' cups. How many more cups does the ' + c[0] + ' hold?', type: 'num', answer: a - b, unit: 'cups',
            hint: 'Compare the cups. Subtract.', steps: [a + ' &minus; ' + b + ' = ' + (a - b) + '.'],
            explain: 'The ' + c[0] + ' holds ' + (a - b) + ' more cups.', meta: { k: 'cap-num', a: a, b: b } };
        }],
        [1, 'order', function (lv) {
          var names = R.shuffle(['vase', 'bottle', 'bowl', 'jug', 'pot']).slice(0, lv === 1 ? 3 : 4), vals = R.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, names.length);
          var list = names.map(function (n, i) { return [n, vals[i]]; }), sorted = list.slice().sort(function (a, b) { return a[1] - b[1]; });
          return { q: list.map(function (x) { return 'The ' + x[0] + ' holds ' + x[1] + ' cups.'; }).join(' ') + ' Put them in order from <b>least to most</b>.', type: 'order', items: sorted.map(function (x) { return x[0]; }), first: 'least', last: 'most',
            hint: 'More cups means more capacity.', steps: ['Compare: ' + sorted.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') + '.'],
            explain: sorted.map(function (x) { return x[0]; }).join(', ') + '.', meta: { k: 'cap-order' } };
        }],
        [2, 'mistake', function (lv) {
          var who = nm(), M = R.pick([['used cups that were only half full', 'too high'], ['stopped pouring before the pot was full', 'too low'], ['let water spill over the top', 'too high']]), truth = !R.int(0, 1), said = truth ? M[1] : (M[1] === 'too high' ? 'too low' : 'too high');
          var right = M[1] === 'too high' ? 'More cups were counted than the pot really holds, so the count is too high.' : 'The pot could hold more than was counted, so the count is too low.';
          return { q: who + ' counted how many cups fill a pot, but ' + M[0] + '. ' + who + ' says the count is <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(right, ['Any way of pouring gives the right count.', 'Half-full cups make the count too low.', 'Spilling makes the count too low.']),
            hint: 'Does this need more cups or fewer than the true amount?', steps: [right], explain: right, meta: { k: 'cap-tf', how: M[0], said: said } };
        }]
      ]
    };
    Q.shapes(CH, SHAPES);
  })();
})();
