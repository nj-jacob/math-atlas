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

  A.register('length-time', {
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
})();
