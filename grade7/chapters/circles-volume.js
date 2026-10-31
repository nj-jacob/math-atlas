(function () {
  var A = Atlas, R = A.R, cl = A.clean, fmt = A.fmt, PI = 3.14;
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function dec(x) { return fmt(cl(x)); }
  function tolFor(x) { return Math.max(0.11, Math.abs(x) * 0.005); }

  /* a circle with radius and diameter labelled */
  function parts(r) {
    var s = '', R0 = 80, cx = 110, cy = 100;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R0 + '" style="fill:color-mix(in srgb,var(--strand) 10%,var(--card));stroke:var(--strand)" stroke-width="4"/>';
    s += '<line x1="' + (cx - R0) + '" y1="' + cy + '" x2="' + (cx + R0) + '" y2="' + cy + '" style="stroke:var(--se)" stroke-width="3"/><text x="' + cx + '" y="' + (cy + 24) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--se)">diameter</text>';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R0 * 0.6) + '" y2="' + (cy - R0 * 0.8) + '" style="stroke:var(--sb)" stroke-width="3"/><text x="' + (cx + 34) + '" y="' + (cy - 30) + '" font-size="16" font-weight="700" style="fill:var(--sb)">radius</text>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" style="fill:var(--ink)"/><text x="' + (cx - 8) + '" y="' + (cy - 8) + '" text-anchor="end" font-size="15">centre</text>';
    s += '<text x="' + (cx + R0 + 12) + '" y="' + (cy + 60) + '" font-size="16" font-weight="700" style="fill:var(--strand)">circumference</text><text x="' + (cx + R0 + 12) + '" y="' + (cy + 80) + '" font-size="15" class="t2">(the distance around)</text>';
    return A.svg(360, 200, s, 'A circle. The radius goes from the centre to the edge. The diameter goes all the way across through the centre. The circumference is the distance around.');
  }
  /* a wheel unrolled: the circumference is just over 3 diameters */
  function unroll(r) {
    var u = Math.min(26, 480 / (2 * Math.PI * r) * 1), d = 2 * r * u, C = Math.PI * d, s = '', y = 150;
    s += '<circle cx="' + (20 + d / 2) + '" cy="' + (y - d / 2) + '" r="' + d / 2 + '" style="fill:none;stroke:var(--strand)" stroke-width="3"/>';
    s += '<line x1="20" y1="' + (y - d / 2) + '" x2="' + (20 + d) + '" y2="' + (y - d / 2) + '" style="stroke:var(--se)" stroke-width="3"/>';
    s += '<line x1="20" y1="' + y + '" x2="' + (20 + C) + '" y2="' + y + '" style="stroke:var(--strand)" stroke-width="5"/>';
    for (var i = 0; i < 3; i++) s += '<rect x="' + (20 + i * d) + '" y="' + (y + 8) + '" width="' + d + '" height="14" style="fill:color-mix(in srgb,var(--se) ' + (40 + i * 15) + '%,var(--card));stroke:var(--se)" stroke-width="1.5"/><text x="' + (20 + i * d + d / 2) + '" y="' + (y + 42) + '" text-anchor="middle" font-size="15" style="fill:var(--se)">d</text>';
    s += '<rect x="' + (20 + 3 * d) + '" y="' + (y + 8) + '" width="' + (C - 3 * d) + '" height="14" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/><text x="' + (20 + 3 * d + 4) + '" y="' + (y + 42) + '" font-size="14">a bit more</text>';
    return A.svg(Math.ceil(40 + C + 60), y + 50, s, 'A circle rolled out flat. Its circumference is 3 diameters and a bit more: about 3.14 diameters.');
  }
  /* circle cut into n slices and rearranged into a near-parallelogram */
  function slices(n) {
    var r = 70, s = '', cx = 80, cy = 90, step = 2 * Math.PI / n;
    for (var i = 0; i < n; i++) {
      var a = i * step - Math.PI / 2, b = a + step;
      s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(b)).toFixed(1) + ' ' + (cy + r * Math.sin(b)).toFixed(1) + ' Z" style="fill:' + (i < n / 2 ? 'var(--sb)' : 'var(--se)') + ';stroke:var(--card)" stroke-width="1.5"/>';
    }
    var w = Math.PI * r / (n / 2), x0 = 190, yb = cy + r / 2 + 10, half = n / 2;
    for (var k = 0; k < half; k++) {
      var x = x0 + k * w;
      s += '<path d="M' + x + ' ' + yb + ' L' + (x + w / 2) + ' ' + (yb - r) + ' L' + (x + w) + ' ' + yb + ' Z" style="fill:var(--sb);stroke:var(--card)" stroke-width="1.5"/>';
      s += '<path d="M' + (x + w / 2) + ' ' + (yb - r) + ' L' + (x + w) + ' ' + yb + ' L' + (x + w * 1.5) + ' ' + (yb - r) + ' Z" style="fill:var(--se);stroke:var(--card)" stroke-width="1.5"/>';
    }
    var end = x0 + half * w + w / 2;
    s += '<line x1="' + x0 + '" y1="' + (yb + 14) + '" x2="' + (x0 + half * w) + '" y2="' + (yb + 14) + '" style="stroke:var(--ink)" stroke-width="2"/><text x="' + (x0 + half * w / 2) + '" y="' + (yb + 38) + '" text-anchor="middle" font-size="21" font-weight="700">half the circumference = &#960;r</text>';
    s += '<line x1="' + (end + 10) + '" y1="' + yb + '" x2="' + (end + 10) + '" y2="' + (yb - r) + '" style="stroke:var(--ink)" stroke-width="2"/><text x="' + (end + 16) + '" y="' + (yb - r / 2 + 6) + '" font-size="22" font-weight="700">r</text>';
    return A.svg(Math.ceil(end + 40), yb + 48, s, 'A circle cut into ' + n + ' slices. Rearranged, the slices make a shape close to a parallelogram with base pi r and height r.');
  }
  /* a cylinder or prism showing one layer of the base, stacked h times */
  function stack(kind, a, b, h) {
    var s = '', u = Math.min(14, 150 / Math.max(h, 1)), layers = Math.min(h, 14), W = 300;
    for (var i = 0; i < layers; i++) {
      var y = 190 - i * u;
      if (kind === 'cyl') s += '<ellipse cx="120" cy="' + y + '" rx="' + Math.min(90, a * 12) + '" ry="' + Math.min(26, a * 3.5) + '" style="fill:color-mix(in srgb,var(--strand) ' + (20 + i * 4) + '%,var(--card));stroke:var(--strand)" stroke-width="1.5"/>';
      else s += '<polygon points="' + [40, y, 40 + Math.min(150, a * 14), y, 40 + Math.min(150, a * 14) + Math.min(60, b * 6), y - Math.min(40, b * 4), 40 + Math.min(60, b * 6), y - Math.min(40, b * 4)].join(',') + '" style="fill:color-mix(in srgb,var(--strand) ' + (20 + i * 4) + '%,var(--card));stroke:var(--strand)" stroke-width="1.5"/>';
    }
    s += '<text x="250" y="' + (200 - layers * u / 2) + '" font-size="16" font-weight="700">' + h + ' layer' + (h > 1 ? 's' : '') + '</text>';
    return A.svg(W + 40, 236, s, 'The base area, stacked in ' + h + ' layers');
  }
  /* net of a cylinder: two circles and a rectangle */
  function net(r, h) {
    var C = 2 * PI * r, sc = Math.min(4.2 / Math.max(1, r / 6), 380 / C, 120 / (h + 2 * r)), rr = r * sc, w = C * sc, hh = h * sc, x0 = 20, s = '', y0 = 10 + 2 * rr;
    s += '<circle cx="' + (x0 + w / 2) + '" cy="' + (y0 - rr) + '" r="' + rr + '" style="fill:color-mix(in srgb,var(--se) 30%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + hh + '" style="fill:color-mix(in srgb,var(--sb) 25%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
    s += '<circle cx="' + (x0 + w / 2) + '" cy="' + (y0 + hh + rr) + '" r="' + rr + '" style="fill:color-mix(in srgb,var(--se) 30%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + (x0 + w / 2) + '" y="' + (y0 + hh / 2 + 6) + '" text-anchor="middle" font-size="16" font-weight="700">length = circumference = ' + r1(C) + '</text>';
    s += '<text x="' + (x0 + w + 8) + '" y="' + (y0 + hh / 2 + 6) + '" font-size="16" font-weight="700">h = ' + h + '</text>';
    s += '<line x1="' + (x0 + w / 2) + '" y1="' + (y0 - rr) + '" x2="' + (x0 + w / 2 + rr) + '" y2="' + (y0 - rr) + '" style="stroke:var(--ink)" stroke-width="2"/><text x="' + (x0 + w / 2 + rr + 6) + '" y="' + (y0 - rr + 6) + '" font-size="16" font-weight="700">r = ' + r + '</text>';
    return A.svg(Math.ceil(x0 + w + 90), Math.ceil(y0 + hh + 2 * rr + 10), s, 'Net of a cylinder: two circles of radius ' + r + ' and a rectangle ' + r1(C) + ' long and ' + h + ' high');
  }
  function compass() {
    var s = '<circle cx="150" cy="120" r="70" style="fill:none;stroke:var(--strand)" stroke-width="2.5" stroke-dasharray="300 140"/>' +
      '<line x1="150" y1="120" x2="185" y2="30" style="stroke:var(--ink)" stroke-width="4"/><line x1="185" y1="30" x2="220" y2="120" style="stroke:var(--ink)" stroke-width="4"/>' +
      '<circle cx="185" cy="30" r="7" style="fill:var(--ink2)"/><path d="M146 112 L150 124 L154 112 Z" style="fill:var(--ink)"/><path d="M216 112 L220 124 L224 112 Z" style="fill:var(--se)"/>' +
      '<line x1="150" y1="140" x2="220" y2="140" style="stroke:var(--se)" stroke-width="2"/><text x="185" y="160" text-anchor="middle" font-size="15" style="fill:var(--se)">radius</text>' +
      '<text x="20" y="40" font-size="15">point on</text><text x="20" y="58" font-size="15">the centre</text><text x="250" y="40" font-size="15">pencil draws</text><text x="250" y="58" font-size="15">the circle</text>';
    return A.svg(340, 170, s, 'A compass. The point sits on the centre. The pencil is set one radius away and turned to draw the circle.');
  }

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    ucro: { title: 'roll out a circle', html:
      '<div class="ctrl"><label for="ucr">Radius: <output id="ucro"></output><input type="range" id="ucr" min="0.5" max="3" step="0.5" value="1.5"></label></div>' +
      '<div class="fig" id="ucfig"></div><div class="out" id="ucout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['ucr'], function () {
          var r = +$('#ucr', root).value, d = 2 * r, C = PI * d;
          $('#ucro', root).textContent = r + ' cm';
          $('#ucfig', root).innerHTML = unroll(r);
          $('#ucout', root).innerHTML = '<p>Radius ' + r + ' cm, so diameter ' + d + ' cm.</p><p class="big2">C = 3.14 &times; ' + d + ' = ' + r2(C) + ' cm</p><p>Three diameters make ' + 3 * d + ' cm. The circumference is ' + r2(C - 3 * d) + ' cm more.</p>';
        });
      } },
    slco: { title: 'cut more slices', html:
      '<div class="ctrl"><label for="slc">Number of slices: <output id="slco"></output><input type="range" id="slc" min="4" max="32" step="2" value="12"></label></div>' +
      '<div class="fig" id="slfig"></div><p class="t2" style="margin:0">The more slices, the closer it gets to a perfect parallelogram.</p>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['slc'], function () { var n = +$('#slc', root).value; $('#slco', root).textContent = n; $('#slfig', root).innerHTML = slices(n); });
      } },
    vcro: { title: 'fill a can', html:
      '<div class="ctrl"><label for="vcr">Radius (cm): <output id="vcro"></output><input type="range" id="vcr" min="1" max="8" value="4"></label><label for="vch">Height (cm): <output id="vcho"></output><input type="range" id="vch" min="1" max="20" value="10"></label></div>' +
      '<div class="row2"><div class="fig" id="vcfig"></div><div class="out" id="vcout"></div></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['vcr', 'vch'], function () {
          var r = +$('#vcr', root).value, h = +$('#vch', root).value, B = PI * r * r, V = B * h;
          $('#vcro', root).textContent = r; $('#vcho', root).textContent = h;
          $('#vcfig', root).innerHTML = stack('cyl', r, 0, h);
          $('#vcout', root).innerHTML = '<p>Base area = 3.14 &times; ' + r + ' &times; ' + r + ' = ' + r2(B) + ' cm&sup2;</p><p class="big2">V = ' + r2(B) + ' &times; ' + h + ' = ' + dec(r2(V)) + ' cm&sup3;</p><p>That holds about ' + dec(Math.round(V)) + ' mL, or ' + r2(V / 1000) + ' L.</p>';
        });
      } },
    saro: { title: 'open the can', html:
      '<div class="ctrl"><label for="sar">Radius (cm): <output id="saro"></output><input type="range" id="sar" min="1" max="10" value="3"></label><label for="sah">Height (cm): <output id="saho"></output><input type="range" id="sah" min="1" max="20" value="10"></label></div>' +
      '<div class="fig" id="safig"></div><div class="out" id="saout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['sar', 'sah'], function () {
          var r = +$('#sar', root).value, h = +$('#sah', root).value, circ = PI * r * r, C = 2 * PI * r, rect = C * h, SA = 2 * circ + rect;
          $('#saro', root).textContent = r; $('#saho', root).textContent = h;
          $('#safig', root).innerHTML = net(r, h);
          $('#saout', root).innerHTML = '<div class="tbl"><table><tbody><tr><td class="l">Two circles</td><td class="l">2 &times; 3.14 &times; ' + r + '<sup>2</sup> = ' + r2(2 * circ) + ' cm&sup2;</td></tr><tr><td class="l">Rectangle</td><td class="l">' + r2(C) + ' &times; ' + h + ' = ' + r2(rect) + ' cm&sup2;</td></tr><tr><td class="l"><b>Total</b></td><td class="l"><b>' + dec(r2(SA)) + ' cm&sup2;</b></td></tr></tbody></table></div>';
        });
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  var LITRE = A.svg(380, 190, A.draw.prism(30, 170, 120, 120, 120, 10, 10, 10, 2) + '<text x="230" y="70" font-size="17" font-weight="700">10 cm &times; 10 cm &times; 10 cm</text><text x="230" y="96" font-size="17">= 1000 cm&sup3;</text><text x="230" y="122" font-size="17" font-weight="700" style="fill:var(--se)">= 1 L</text>', 'A cube 10 cm on each side has a volume of 1000 cubic centimetres, which holds 1 litre.');

  var LESSONS = [
    { id: 'circle', title: 'Around a circle', sub: 'Radius, diameter and circumference.', concepts: [
      { id: 'parts', title: 'Radius and diameter', exp: ['E2.3'], skill: 'cv-circ',
        body: '<p>The <b>radius</b> goes from the centre to the edge. The <b>diameter</b> goes all the way across, through the centre. <span class="math">d = 2 &times; r</span>.</p>',
        watch: K.slides([
          { say: 'Every point on a circle is the same distance from the centre.', fig: function () { return parts(); } },
          { say: 'That distance is the <b>radius</b>.', fig: function () { return parts(); } },
          { say: 'Two radii, end to end through the centre, make the <b>diameter</b>.', fig: eq('d = 2 &times; r &nbsp;&nbsp; r = d &divide; 2'), ms: 2400 }
        ]),
        key: '<p><b>Diameter = 2 radii.</b> Radius = half the diameter.</p>',
        mistake: '<p>Using the diameter where the radius is needed (or the other way round). Ask: centre to edge, or all the way across?</p>',
        check: [function () { var r = R.int(3, 40); return { q: 'A circle has a diameter of ' + 2 * r + ' cm. What is its radius?', type: 'num', answer: r, unit: 'cm', hint: 'The radius is half the diameter.', explain: 2 * r + ' &divide; 2 = ' + r + ' cm.' }; }, function () { var r = R.int(2, 25); return { q: 'A circle has a radius of ' + r + ' m. What is its diameter?', type: 'num', answer: 2 * r, unit: 'm', hint: 'Two radii make a diameter.', explain: '2 &times; ' + r + ' = ' + 2 * r + ' m.' }; }] },
      { id: 'pi', title: 'Circumference and pi', exp: ['E2.3', 'E2.4'], skill: 'cv-circ', hard: true,
        body: '<p>Roll any circle out flat, and its <b>circumference</b> is a little more than 3 diameters. That number is <b>pi</b> (&#960;), about <b>3.14</b>. <span class="math">C = &#960; &times; d = 2&#960;r</span>.</p>',
        watch: K.slides([
          { say: 'Mark a point on a circle and roll it along a line for one full turn.', fig: function () { return unroll(1.6); } },
          { say: 'The distance it rolls is the circumference.', fig: function () { return unroll(1.6); } },
          { say: 'It always fits a little more than 3 diameters: about 3.14 of them.', fig: eq('C &divide; d = &#960; &asymp; 3.14') },
          { say: 'So C = &#960; &times; d. A wheel 60 cm across rolls 3.14 &times; 60 = 188.4 cm in one turn.', fig: eq('3.14 &times; 60 = 188.4 cm'), ms: 2800 }
        ]),
        try: lab('ucro', [
          { do: 'Roll out a circle with radius <b>2</b>.', goal: function (h) { return K.v(h, 'ucr') === 2; }, yes: 'd = 4, so C = 3.14 × 4 = 12.56.' },
          { do: 'Find the circle whose circumference is about <b>18.8</b>.', goal: function (h) { return K.v(h, 'ucr') === 3; }, yes: 'Radius 3: C = 2 × 3.14 × 3 = 18.84.' }
        ]),
        ways: [
          { label: 'With string', html: '<p>Wrap a string around a can, then lay it along a ruler. Measure the can across. Divide: you will get about 3.1 every time, whatever the size of the can.</p>' },
          { label: 'Estimate first', html: '<p>&#960; is a bit more than 3, so the circumference is a bit more than 3 diameters. A 10 cm plate: a bit more than 30 cm (31.4 cm).</p>' }
        ],
        key: '<p><b>C = &#960; &times; d.</b> Use &#960; &asymp; 3.14 and round to one decimal place.</p>',
        mistake: '<p>Multiplying the radius by &#960; and forgetting to double it. Write d = 2r first.</p>',
        check: [function () { return { q: 'A bike wheel has a diameter of 60 cm. How far does it roll in one turn? Use &#960; &asymp; 3.14.', type: 'num', answer: 188.4, tol: 0.3, unit: 'cm', hint: 'One turn rolls out one circumference: &#960; &times; d.', explain: '3.14 &times; 60 = 188.4 cm.' }; }, K.ck('cv-circ', 1), K.ck('cv-circ', 2)] },
      { id: 'compass', title: 'Draw a circle with a compass', exp: ['E2.4'], skill: 'cv-circ',
        body: '<p>Open the compass to the <b>radius</b>, put the point on the centre, and turn the pencil all the way around.</p>',
        watch: K.slides([
          { say: 'Open the compass to the radius.', fig: function () { return compass(); } },
          { say: 'Given the diameter? Halve it to get the radius.', fig: eq('d = 8 cm &rarr; r = 4 cm') },
          { say: 'Given the circumference? Divide by &#960; for the diameter, then halve it. 25.12 &divide; 3.14 = 8, so r = 4.', fig: eq('C = 25.12 &rarr; d = 8 &rarr; r = 4'), ms: 2800 }
        ]),
        key: '<p><b>The compass width is the radius.</b></p>',
        mistake: '<p>Opening the compass to the diameter, which draws a circle twice as wide.</p>',
        check: [function () { return { q: 'A circle has a circumference of 31.4 cm. What radius should you set your compass to?', type: 'num', answer: 5, unit: 'cm', hint: 'Diameter = 31.4 &divide; 3.14. Then halve it.', explain: '10 cm across, so the radius is 5 cm.' }; }, K.ck('cv-circ', 3)] }
    ] },
    { id: 'area', title: 'Area of a circle', sub: 'Slice it into a parallelogram.', concepts: [
      { id: 'slices', title: 'Why the area is πr²', exp: ['E2.5'], skill: 'cv-area', hard: true,
        body: '<p>Cut a circle into equal slices and lay them top to bottom. They make almost a parallelogram, with base &#960;r and height r. So <span class="math">A = &#960;r &times; r = &#960;r<sup>2</sup></span>.</p>',
        watch: K.slides([
          { say: 'Cut a circle into 8 slices and lay them top to bottom.', fig: function () { return slices(8); } },
          { say: 'With 16 slices it looks more like a parallelogram.', fig: function () { return slices(16); } },
          { say: 'With 32, almost perfect. The base is half the circumference, &#960;r. The height is the radius, r.', fig: function () { return slices(32); } },
          { say: 'Area = base &times; height = &#960;r &times; r = &#960;r&sup2;.', fig: eq('A = &#960;r<sup>2</sup>'), ms: 2600 }
        ]),
        try: lab('slco', [
          { do: 'Cut the circle into the <b>most</b> slices you can.', goal: function (h) { return K.v(h, 'slc') === 32; }, yes: 'The more slices, the closer to a parallelogram.' }
        ]),
        ways: [
          { label: 'Squares on the radius', html: '<p>Draw a square on the radius: its area is r&sup2;. The circle holds a bit more than 3 of those squares: about 3.14 of them. So A = &#960;r&sup2;.</p>' },
          { label: 'Count grid squares', html: '<p>Draw a circle with radius 10 on grid paper and count the squares inside. You will get about 314: 3.14 &times; 10 &times; 10.</p>' }
        ],
        key: '<p><b>A = &#960; &times; r &times; r.</b></p>',
        mistake: '<p>Computing &#960; &times; r &times; 2 (the circumference idea) instead of &#960; &times; r &times; r.</p>',
        check: [function () { return { q: 'Find the area of a circle with radius 10 cm. Use &#960; &asymp; 3.14.', type: 'num', answer: 314, unit: 'cm&sup2;', tol: 0.6, hint: 'r<sup>2</sup> = 10 &times; 10 = 100.', explain: '3.14 &times; 100 = 314 cm&sup2;.' }; }, K.ck('cv-area', 1), K.ck('cv-area', 2)] },
      { id: 'around', title: 'Around or inside?', exp: ['E2.3', 'E2.5'], skill: 'cv-area',
        body: '<div class="vs"><div><b class="t">Circumference</b><p>Distance <b>around</b>. Units: cm, m.</p><p>C = 2&#960;r</p></div><div><b class="t">Area</b><p>Space <b>inside</b>. Units: cm&sup2;, m&sup2;.</p><p>A = &#960;r<sup>2</sup></p></div></div>',
        watch: K.slides([
          { say: 'A round rug, diameter 2 m. Edging tape goes <b>around</b>: circumference.', fig: eq('C = 3.14 &times; 2 = 6.28 m') },
          { say: 'The rug covers the floor <b>inside</b>: area. Radius 1 m.', fig: eq('A = 3.14 &times; 1 &times; 1 = 3.14 m<sup>2</sup>') },
          { say: 'A pizza with radius 15 cm: 3.14 &times; 225 = 706.5 cm&sup2; of pizza.', fig: eq('A = 3.14 &times; 15 &times; 15 = 706.5 cm<sup>2</sup>'), ms: 2600 }
        ]),
        key: '<p><b>Around: circumference, plain units. Inside: area, square units.</b></p>',
        mistake: '<p>Answering an area question in cm, or a fence question in m&sup2;. Check what is being measured.</p>',
        check: [function () { return mc('You want to put a fence around a round garden. What do you need to find?', 'Circumference', ['Area', 'Volume'], 'A fence goes around the edge.', 'Around the edge: circumference.'); }, K.ck('cv-area', 3)] }
    ] },
    { id: 'units', title: 'Volume, capacity and units', sub: 'cm³, mL and L.', concepts: [
      { id: 'litre', title: 'A litre is a 10 cm cube', exp: ['E2.1'], skill: 'cv-units',
        body: '<p><b>Volume</b> is how much space something takes up. <b>Capacity</b> is how much a container holds. <b>1 cm&sup3; = 1 mL</b>, and <b>1000 cm&sup3; = 1 L</b>.</p>',
        watch: K.slides([
          { say: 'A cube 1 cm on each side is 1 cm&sup3;. It holds 1 mL of water.', fig: eq('1 cm<sup>3</sup> = 1 mL') },
          { say: 'A cube 10 cm on each side: 10 &times; 10 &times; 10 = 1000 cm&sup3;.', fig: LITRE },
          { say: 'It holds exactly 1 litre.', fig: eq('1000 cm<sup>3</sup> = 1000 mL = 1 L') },
          { say: 'A fish tank 50 by 30 by 40 cm: 60 000 cm&sup3;, which is 60 L.', fig: eq('60 000 cm<sup>3</sup> &divide; 1000 = 60 L'), ms: 2800 }
        ]),
        key: '<p><b>1 cm&sup3; = 1 mL. 1000 cm&sup3; = 1 L.</b></p>',
        mistake: '<p>Forgetting to divide by 1000 to get litres, or dividing by 100.</p>',
        check: [function () { return { q: 'A fish tank is 50 cm long, 30 cm wide and 40 cm high. How many litres does it hold?', type: 'num', answer: 60, unit: 'L', hint: 'Volume in cm&sup3;, then divide by 1000.', explain: '60 000 cm&sup3; = 60 L.' }; }, K.ck('cv-units', 1)] },
      { id: 'convert', title: 'Square and cubic units', exp: ['E2.2'], skill: 'cv-units', hard: true,
        body: '<p>Area and volume units grow faster than length, because you multiply in 2 or 3 directions. 1 m = 100 cm, so 1 m&sup2; = 100 &times; 100 = <b>10 000 cm&sup2;</b>.</p>',
        watch: K.slides([
          { say: '1 cm = 10 mm.', fig: eq('1 cm = 10 mm') },
          { say: 'A 1 cm square is 10 mm by 10 mm: 100 mm&sup2;.', fig: eq('1 cm<sup>2</sup> = 10 &times; 10 = 100 mm<sup>2</sup>') },
          { say: 'A 1 cm cube is 10 by 10 by 10: 1000 mm&sup3;.', fig: eq('1 cm<sup>3</sup> = 10 &times; 10 &times; 10 = 1000 mm<sup>3</sup>') },
          { say: 'With metres: 1 m&sup2; = 10 000 cm&sup2;, and 1 m&sup3; = 1 000 000 cm&sup3;.', fig: eq('1 m<sup>2</sup> = 10 000 cm<sup>2</sup>'), ms: 2800 }
        ]),
        ways: [
          { label: 'Draw it', html: '<p>Draw a 1 m square and split each side into 100 cm. You get a 100 by 100 grid: 10 000 small squares.</p>' },
          { label: 'Square the factor', html: '<p>Length factor 100 (m to cm). Area: 100<sup>2</sup> = 10 000. Volume: 100<sup>3</sup> = 1 000 000.</p>' }
        ],
        key: '<p><b>Square the length factor for area. Cube it for volume.</b></p>',
        mistake: '<p>1 m&sup2; = 100 cm&sup2;. Draw the square to see why it is 10 000.</p>',
        check: [K.ck('cv-units', 2), K.ck('cv-units', 3)] }
    ] },
    { id: 'volume', title: 'Volume of prisms and cylinders', sub: 'Stack the base.', concepts: [
      { id: 'layers', title: 'Base area times height', exp: ['E2.7'], skill: 'cv-vol',
        body: '<p>A prism or cylinder is the same shape all the way up. Picture the base as one thin layer, and stack layers to the height. <span class="math">V = area of base &times; height</span>.</p>',
        watch: K.slides([
          { say: 'A can with radius 4 cm. Its base is a circle: 3.14 &times; 16 = 50.24 cm&sup2;.', fig: function () { return stack('cyl', 4, 0, 1); } },
          { say: 'Stack layers 1 cm thick, one for each centimetre of height.', fig: function () { return stack('cyl', 4, 0, 5); } },
          { say: '10 layers: 10 &times; 50.24 = 502.4 cm&sup3;.', fig: function () { return stack('cyl', 4, 0, 10); } },
          { say: 'Volume = base area &times; height. It works for every prism and cylinder.', fig: eq('V = &#960;r<sup>2</sup> &times; h'), ms: 2400 }
        ]),
        try: lab('vcro', [
          { do: 'Make a can that holds about <b>1 litre</b> (1000 cm&sup3;).', goal: function (h) { var r = K.v(h, 'vcr'), hh = K.v(h, 'vch'), v = 3.14 * r * r * hh; return v > 900 && v < 1100; }, yes: 'Close to 1000 cm³: about 1 L.' },
          { do: 'Double the height. What happens to the volume?', goal: function (h) { return K.v(h, 'vch') === 20; }, yes: 'Twice as many layers: twice the volume.' }
        ]),
        key: '<p><b>Volume = area of the base &times; height.</b></p>',
        mistake: '<p>Using the area of a side face instead of the base, or forgetting to square the radius.</p>',
        check: [function () { return { q: 'A cylinder has a base area of 50 cm&sup2; and a height of 12 cm. What is its volume?', type: 'num', answer: 600, unit: 'cm&sup3;', hint: 'Base area &times; height.', explain: '50 &times; 12 = 600 cm&sup3;.' }; }, K.ck('cv-vol', 1), K.ck('cv-vol', 2)] },
      { id: 'back', title: 'Work backwards', exp: ['E2.7'], skill: 'cv-miss',
        body: '<p>If you know the volume and the base, divide to find the height: <span class="math">height = volume &divide; base area</span>.</p>',
        watch: K.slides([
          { say: 'A cereal box holds 3600 cm&sup3;. Its base is 150 cm&sup2;. How tall is it?', fig: eq('3600 = 150 &times; h') },
          { say: 'Divide the volume by the base: 3600 &divide; 150.', fig: eq('h = 3600 &divide; 150') },
          { say: 'The box is <b>24 cm</b> tall.', fig: eq('h = 24 cm'), ms: 2200 }
        ]),
        key: '<p><b>Missing height: volume &divide; base. Missing base: volume &divide; height.</b></p>',
        mistake: '<p>Multiplying again instead of dividing.</p>',
        check: [K.ck('cv-miss', 1), K.ck('cv-miss', 2)] }
    ] },
    { id: 'surface', title: 'Surface area of a cylinder', sub: 'Open the can.', concepts: [
      { id: 'net', title: 'Two circles and a rectangle', exp: ['E2.6'], skill: 'cv-sa', hard: true,
        body: '<p><b>Surface area</b> is the total area of the outside, like the paper to wrap it. Open a cylinder into a <b>net</b>: two circles and a rectangle. The rectangle\'s length is the circumference.</p>',
        watch: K.slides([
          { say: 'A can with radius 4 cm and height 10 cm. Cut off the top and bottom and unroll the side.', fig: function () { return net(4, 10); } },
          { say: 'Two circles: 2 &times; 3.14 &times; 16 = 100.48 cm&sup2;.', fig: eq('2 &times; &#960;r<sup>2</sup> = 100.48') },
          { say: 'The rectangle is the circumference by the height: 25.12 &times; 10 = 251.2 cm&sup2;.', fig: eq('2&#960;r &times; h = 251.2') },
          { say: 'Total: 100.48 + 251.2 = 351.68, about <b>351.7 cm&sup2;</b>.', fig: eq('SA &asymp; 351.7 cm<sup>2</sup>'), ms: 2600 }
        ]),
        try: lab('saro', [
          { do: 'Open a can with radius <b>4</b> and height <b>10</b>.', goal: function (h) { return K.v(h, 'sar') === 4 && K.v(h, 'sah') === 10; }, yes: 'About 351.7 cm².' },
          { do: 'Make the <b>rectangle</b> bigger than both circles together.', goal: function (h) { var r = K.v(h, 'sar'), hh = K.v(h, 'sah'); return 2 * Math.PI * r * hh > 2 * Math.PI * r * r; }, yes: 'That happens whenever the height is more than the radius.' }
        ]),
        ways: [
          { label: 'A label', html: '<p>A soup can label is the rectangle. Peel it off: it is as long as the can is around (the circumference) and as tall as the can.</p>' },
          { label: 'No lid?', html: '<p>A cup has only one circle. Its surface area is &#960;r&sup2; + 2&#960;r &times; h.</p>' }
        ],
        key: '<p><b>SA = 2&#960;r&sup2; + 2&#960;r &times; h.</b></p>',
        mistake: '<p>Using the diameter for the rectangle\'s length, or forgetting one of the circles.</p>',
        check: [function () { return { q: 'A label covers only the curved side of a can with radius 5 cm and height 12 cm. What is the area of the label?', type: 'num', answer: 376.8, tol: 0.8, unit: 'cm&sup2;', hint: 'The label is the rectangle: circumference &times; height.', explain: '31.4 &times; 12 = 376.8 cm&sup2;.' }; }, K.ck('cv-sa', 1), K.ck('cv-sa', 2)] }
    ] }
  ];


  A.register('circles-volume', {
    lessons: LESSONS,

    quiz: [
      { q: 'A circle has a radius of 9 cm. What is its circumference? Use &#960; &asymp; 3.14.', type: 'num', answer: 56.52, tol: 0.2, unit: 'cm', hint: 'C = 2 &times; &#960; &times; r.', explain: '2 &times; 3.14 &times; 9 = 56.52 cm.' },
      { q: 'A circular track has a circumference of 62.8 m. What is its diameter?', type: 'num', answer: 20, unit: 'm', hint: 'd = C &divide; &#960;.', explain: '62.8 &divide; 3.14 = 20 m.' },
      { q: 'What is the area of a circle with a diameter of 12 cm? Use &#960; &asymp; 3.14.', type: 'num', answer: 113.04, tol: 0.4, unit: 'cm&sup2;', hint: 'Find the radius first: half of 12.', explain: 'r = 6. 3.14 &times; 6 &times; 6 = 3.14 &times; 36 = 113.04 cm&sup2;.' },
      { q: 'A juice box holds 250 mL. What is its volume in cm&sup3;?', type: 'num', answer: 250, unit: 'cm&sup3;', hint: '1 mL = 1 cm&sup3;.', explain: '250 mL = 250 cm&sup3;.' },
      { q: 'A garden is 3.5 m&sup2;. How many cm&sup2; is that?', type: 'num', answer: 35000, unit: 'cm&sup2;', hint: '1 m&sup2; = 10 000 cm&sup2;.', explain: '3.5 &times; 10 000 = 35 000 cm&sup2;.' },
      { q: 'A can has a radius of 3 cm and a height of 10 cm. What is its volume? Use &#960; &asymp; 3.14.', type: 'num', answer: 282.6, tol: 0.8, unit: 'cm&sup3;', fig: stack('cyl', 3, 0, 10), hint: 'Base area = &#960;r<sup>2</sup>. Then multiply by the height.', explain: '3.14 &times; 9 = 28.26 cm&sup2;. 28.26 &times; 10 = 282.6 cm&sup3;.' },
      { q: 'What is the surface area of a cylinder with radius 2 cm and height 5 cm? Use &#960; &asymp; 3.14.', type: 'num', answer: 87.92, tol: 0.3, unit: 'cm&sup2;', fig: net(2, 5), hint: 'Two circles plus a rectangle that is the circumference long.', explain: 'Circles: 2 &times; 3.14 &times; 4 = 25.12. Rectangle: 12.56 &times; 5 = 62.8. Total: 87.92 cm&sup2;.' }
    ],

    practice: [
      { id: 'cv-circ', name: 'Circumference', code: 'E2.3, E2.4', gen: function (lv) {
        var r = R.int(1, lv === 1 ? 10 : 25), d = 2 * r, C = cl(PI * d);
        if (lv === 3) {
          var giveC = R.int(0, 1);
          return { q: 'A circle has a circumference of ' + dec(C) + ' cm. What is its ' + (giveC ? 'radius' : 'diameter') + '?', type: 'num', answer: giveC ? r : d, unit: 'cm', tol: 0.05,
            hint: 'Diameter = C &divide; 3.14.', steps: ['d = ' + dec(C) + ' &divide; 3.14 = ' + d + ' cm.', giveC ? 'r = ' + d + ' &divide; 2 = ' + r + ' cm.' : 'So the diameter is ' + d + ' cm.'], explain: (giveC ? 'The radius is ' + r : 'The diameter is ' + d) + ' cm.' };
        }
        var useD = lv === 2 && R.int(0, 1);
        return { q: 'A circle has a ' + (useD ? 'diameter of ' + d : 'radius of ' + r) + ' cm. What is its circumference? Use &#960; &asymp; 3.14.', type: 'num', answer: C, unit: 'cm', tol: tolFor(C),
          fig: lv === 1 ? parts() : '', hint: 'C = &#960; &times; d. ' + (useD ? '' : 'Double the radius to get d.'),
          steps: [useD ? 'd = ' + d + ' cm.' : 'd = 2 &times; ' + r + ' = ' + d + ' cm.', 'C = 3.14 &times; ' + d + '.', '= ' + dec(C) + ' cm.'], explain: 'C = 3.14 &times; ' + d + ' = ' + dec(C) + ' cm.' };
      } },
      { id: 'cv-area', name: 'Area of a circle', code: 'E2.5', gen: function (lv) {
        var r = R.int(1, lv === 1 ? 10 : 20), A1 = cl(PI * r * r), giveD = lv > 1 && R.int(0, 1);
        if (lv === 3 && R.int(0, 1)) {
          var half = cl(A1 / 2);
          return { q: 'A semicircle (half a circle) has a radius of ' + r + ' m. What is its area? Round to one decimal place.', type: 'num', answer: r1(half), unit: 'm&sup2;', tol: tolFor(half),
            hint: 'Find the area of the whole circle, then halve it.', steps: ['Whole circle: 3.14 &times; ' + r + ' &times; ' + r + ' = ' + dec(A1) + ' m&sup2;.', 'Half: ' + dec(A1) + ' &divide; 2 = ' + dec(half) + ' m&sup2;.'], explain: 'The semicircle is about ' + r1(half) + ' m&sup2;.' };
        }
        return { q: 'Find the area of a circle with a ' + (giveD ? 'diameter of ' + 2 * r : 'radius of ' + r) + ' cm. Use &#960; &asymp; 3.14.', type: 'num', answer: A1, unit: 'cm&sup2;', tol: tolFor(A1),
          hint: 'A = &#960; &times; r &times; r.' + (giveD ? ' Halve the diameter first.' : ''),
          steps: [giveD ? 'r = ' + 2 * r + ' &divide; 2 = ' + r + ' cm.' : 'r = ' + r + ' cm.', 'r<sup>2</sup> = ' + r + ' &times; ' + r + ' = ' + r * r + '.', 'A = 3.14 &times; ' + r * r + ' = ' + dec(A1) + ' cm&sup2;.'], explain: 'The area is ' + dec(A1) + ' cm&sup2;.' };
      } },
      { id: 'cv-units', name: 'Metric conversions', code: 'E2.1, E2.2', gen: function (lv) {
        var list = lv === 1 ? [['m', 'cm', 100], ['cm', 'mm', 10], ['km', 'm', 1000], ['L', 'mL', 1000], ['cm&sup3;', 'mL', 1]]
          : lv === 2 ? [['m&sup2;', 'cm&sup2;', 10000], ['cm&sup2;', 'mm&sup2;', 100], ['L', 'cm&sup3;', 1000], ['m&sup3;', 'L', 1000], ['m', 'mm', 1000]]
            : [['m&sup3;', 'cm&sup3;', 1000000], ['cm&sup2;', 'm&sup2;', 0.0001], ['mL', 'L', 0.001], ['cm&sup3;', 'L', 0.001], ['mm', 'm', 0.001]];
        var u = R.pick(list), v = lv === 3 ? R.pick([R.int(2, 90) / 10, R.int(150, 9000)]) : R.int(2, 40) / (R.int(0, 1) ? 1 : 2);
        if (u[2] < 1) v = R.int(1, 99) * (u[2] === 0.0001 ? 500 : 50);
        var ans = cl(v * u[2]);
        var why = { 100: '1 m = 100 cm', 10: '1 cm = 10 mm', 1000: u[0] === 'L' ? '1 L = 1000 mL (or 1000 cm&sup3;)' : u[0] === 'km' ? '1 km = 1000 m' : u[0] === 'm&sup3;' ? '1 m&sup3; = 1000 L' : '1 m = 1000 mm', 1: '1 cm&sup3; = 1 mL', 10000: '1 m&sup2; = 100 cm &times; 100 cm = 10 000 cm&sup2;', 1000000: '1 m&sup3; = 100 &times; 100 &times; 100 = 1 000 000 cm&sup3;', 0.0001: '10 000 cm&sup2; = 1 m&sup2;', 0.001: u[0] === 'mm' ? '1000 mm = 1 m' : '1000 mL = 1 L (and 1000 cm&sup3; = 1 L)' }[u[2]];
        if (u[0] === 'cm&sup2;' && u[1] === 'mm&sup2;') why = '1 cm&sup2; = 10 mm &times; 10 mm = 100 mm&sup2;';
        return { q: 'Convert ' + dec(v) + ' ' + u[0] + ' to ' + u[1] + '.', type: 'num', answer: ans, unit: u[1], tol: Math.abs(ans) * 1e-9 + 1e-9,
          hint: 'Use: ' + why + '. ' + (u[2] >= 1 ? 'Big unit to small unit: multiply.' : 'Small unit to big unit: divide.'),
          steps: [why + '.', (u[2] >= 1 ? 'Multiply: ' + dec(v) + ' &times; ' + fmt(u[2]) : 'Divide: ' + dec(v) + ' &divide; ' + fmt(Math.round(1 / u[2]))) + '.', '= ' + dec(ans) + ' ' + u[1] + '.'],
          explain: dec(v) + ' ' + u[0] + ' = ' + dec(ans) + ' ' + u[1] + '.' };
      } },
      { id: 'cv-vol', name: 'Volume of prisms and cylinders', code: 'E2.7', gen: function (lv) {
        if (lv === 1) {
          var l = R.int(2, 12), w = R.int(2, 10), h = R.int(2, 10), V = l * w * h;
          return { q: 'A box is ' + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm high. What is its volume?', type: 'num', answer: V, unit: 'cm&sup3;', fig: stack('box', l, w, h),
            hint: 'Base area (' + l + ' &times; ' + w + ') times height.', steps: ['Base area = ' + l + ' &times; ' + w + ' = ' + l * w + ' cm&sup2;.', 'Volume = ' + l * w + ' &times; ' + h + ' = ' + V + ' cm&sup3;.'], explain: 'V = ' + V + ' cm&sup3;.' };
        }
        if (lv === 2 && R.int(0, 1)) {
          var b = R.int(2, 12) * 2, th = R.int(2, 10), L = R.int(3, 15), base = b * th / 2, V2 = base * L;
          return { q: 'A triangular prism has a triangle base with base ' + b + ' cm and height ' + th + ' cm. The prism is ' + L + ' cm long. What is its volume?', type: 'num', answer: V2, unit: 'cm&sup3;',
            hint: 'Area of the triangle = base &times; height &divide; 2. Then multiply by the length.', steps: ['Triangle area = ' + b + ' &times; ' + th + ' &divide; 2 = ' + base + ' cm&sup2;.', 'Volume = ' + base + ' &times; ' + L + ' = ' + V2 + ' cm&sup3;.'], explain: 'V = ' + V2 + ' cm&sup3;.' };
        }
        var r = R.int(1, 10), hh = R.int(2, 20), B = cl(PI * r * r), V3 = cl(B * hh);
        return { q: 'A cylinder has a radius of ' + r + ' cm and a height of ' + hh + ' cm. What is its volume? Use &#960; &asymp; 3.14.', type: 'num', answer: V3, unit: 'cm&sup3;', tol: tolFor(V3),
          fig: lv === 2 ? stack('cyl', r, 0, hh) : '', hint: 'Base area = &#960;r<sup>2</sup>. Then multiply by the height.',
          steps: ['Base area = 3.14 &times; ' + r + ' &times; ' + r + ' = ' + dec(B) + ' cm&sup2;.', 'Volume = ' + dec(B) + ' &times; ' + hh + ' = ' + dec(V3) + ' cm&sup3;.'], explain: 'V = ' + dec(V3) + ' cm&sup3;.' };
      } },
      { id: 'cv-miss', name: 'Find a missing measurement', code: 'E2.7', gen: function (lv) {
        var B = R.int(lv === 1 ? 2 : 12, lv === 1 ? 20 : 150), h = R.int(2, lv === 3 ? 40 : 15), V = B * h, findH = R.int(0, 1);
        if (lv === 3 && R.int(0, 1)) {
          var r = R.int(2, 6), Bc = cl(PI * r * r), Vc = cl(Bc * h);
          return { q: 'A cylinder holds ' + dec(Vc) + ' cm&sup3;. Its radius is ' + r + ' cm. How tall is it? Use &#960; &asymp; 3.14.', type: 'num', answer: h, unit: 'cm', tol: 0.05,
            hint: 'Find the base area first, then height = volume &divide; base area.', steps: ['Base area = 3.14 &times; ' + r * r + ' = ' + dec(Bc) + ' cm&sup2;.', 'Height = ' + dec(Vc) + ' &divide; ' + dec(Bc) + ' = ' + h + ' cm.'], explain: 'The cylinder is ' + h + ' cm tall.' };
        }
        return { q: findH ? 'A prism has a volume of ' + fmt(V) + ' cm&sup3; and a base area of ' + B + ' cm&sup2;. What is its height?' : 'A prism has a volume of ' + fmt(V) + ' cm&sup3; and a height of ' + h + ' cm. What is the area of its base?',
          type: 'num', answer: findH ? h : B, unit: findH ? 'cm' : 'cm&sup2;',
          hint: 'Volume = base area &times; height, so divide the volume by the one you know.', steps: ['Volume = base area &times; height.', findH ? 'Height = ' + fmt(V) + ' &divide; ' + B + '.' : 'Base area = ' + fmt(V) + ' &divide; ' + h + '.', '= ' + (findH ? h + ' cm' : B + ' cm&sup2;') + '.'],
          explain: B + ' &times; ' + h + ' = ' + fmt(V) + ', so the ' + (findH ? 'height is ' + h + ' cm' : 'base area is ' + B + ' cm&sup2;') + '.' };
      } },
      { id: 'cv-sa', name: 'Surface area of a cylinder', code: 'E2.6', gen: function (lv) {
        var r = R.int(1, lv === 1 ? 5 : 10), h = R.int(2, 15), circ = cl(PI * r * r), C = cl(2 * PI * r), rect = cl(C * h), SA = cl(2 * circ + rect);
        if (lv === 1) return { q: 'A cylinder has radius ' + r + ' cm and height ' + h + ' cm. What is the area of the rectangle in its net? Use &#960; &asymp; 3.14.', type: 'num', answer: rect, unit: 'cm&sup2;', tol: tolFor(rect), fig: net(r, h),
          hint: 'The rectangle is the circumference long and the height high.', steps: ['Length = circumference = 2 &times; 3.14 &times; ' + r + ' = ' + dec(C) + ' cm.', 'Area = ' + dec(C) + ' &times; ' + h + ' = ' + dec(rect) + ' cm&sup2;.'], explain: 'The rectangle is ' + dec(rect) + ' cm&sup2;.' };
        var open = lv === 3 && R.int(0, 1), tot = open ? cl(circ + rect) : SA;
        return { q: (open ? 'A cylinder-shaped cup with no lid' : 'A closed cylinder') + ' has radius ' + r + ' cm and height ' + h + ' cm. What is its surface area? Use &#960; &asymp; 3.14.', type: 'num', answer: tot, unit: 'cm&sup2;', tol: tolFor(tot), fig: lv === 2 ? net(r, h) : '',
          hint: open ? 'No lid means only one circle, plus the rectangle.' : 'Two circles plus the rectangle.',
          steps: ['One circle = 3.14 &times; ' + r + ' &times; ' + r + ' = ' + dec(circ) + ' cm&sup2;.' + (open ? ' The cup has only one.' : ' Two circles: ' + dec(2 * circ) + ' cm&sup2;.'), 'Rectangle = (2 &times; 3.14 &times; ' + r + ') &times; ' + h + ' = ' + dec(C) + ' &times; ' + h + ' = ' + dec(rect) + ' cm&sup2;.', 'Total = ' + dec(tot) + ' cm&sup2;.'],
          explain: 'SA = ' + dec(tot) + ' cm&sup2;.' };
      } }
    ]
  });
})();
