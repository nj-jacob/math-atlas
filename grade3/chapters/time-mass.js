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

  A.register('time-mass', {
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
          return { q: 'The balance is level. What is the mass of the ' + nm(k) + ' in cubes?', type: 'num', answer: n, unit: 'cubes', fig: balance(k, n, 0, 'A level pan balance. A ' + nm(k) + ' on the left and ' + n + ' cubes on the right.'),
            hint: 'Level means equal. Count the cubes in rows of 6.', steps: ['The balance is level, so both sides have the same mass.', 'Count the cubes: rows of 6, then the extras.', 'The ' + nm(k) + ' has a mass of ' + n + ' cubes.'], explain: 'Level means equal: ' + n + ' cubes.' };
        }
        if (lv === 2) {
          var p = R.shuffle(ks).slice(0, 2), x = R.int(5, 20), y = R.int(5, 20);
          while (y === x) y = R.int(5, 20);
          var heavy = x > y ? p[0] : p[1], ask = R.int(0, 1) ? 'heavier' : 'lighter', ans = ask === 'heavier' ? heavy : (heavy === p[0] ? p[1] : p[0]);
          var o = R.mc('the ' + nm(ans), ['the ' + nm(ans === p[0] ? p[1] : p[0]), 'they are the same']);
          return { q: 'A ' + nm(p[0]) + ' balances ' + x + ' cubes. A ' + nm(p[1]) + ' balances ' + y + ' cubes. Which is ' + ask + '?', type: 'mc', options: o.options, answer: o.answer,
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
})();
