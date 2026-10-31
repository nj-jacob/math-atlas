(function () {
  var A = Atlas, R = A.R;
  /* ruler: 0 to 10 cm, with a pencil mm long */
  var U = 3.8;
  function ruler(mm, label) {
    var x0 = 20, s = '';
    if (mm) {
      var end = x0 + mm * U, tip = Math.min(22, mm * U * 0.4);
      s += '<rect x="' + x0 + '" y="18" width="' + (end - tip - x0) + '" height="28" rx="4" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2.5"/>';
      s += '<polygon points="' + (end - tip) + ',18 ' + end + ',32 ' + (end - tip) + ',46" style="fill:color-mix(in srgb,var(--hi) 40%,var(--card));stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
      s += '<line x1="' + end + '" y1="48" x2="' + end + '" y2="70" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="4 3"/>';
    }
    s += '<rect x="8" y="70" width="404" height="64" rx="6" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
    for (var i = 0; i <= 100; i++) {
      var h = i % 10 === 0 ? 26 : i % 5 === 0 ? 17 : 9, x = x0 + i * U;
      s += '<line x1="' + x + '" y1="70" x2="' + x + '" y2="' + (70 + h) + '" style="stroke:var(--ink)" stroke-width="' + (i % 10 === 0 ? 2 : 1) + '"/>';
      if (i % 10 === 0) s += '<text x="' + x + '" y="124" text-anchor="middle" font-size="21" class="tb">' + i / 10 + '</text>';
    }
    s += '<text x="405" y="96" text-anchor="end" font-size="15" class="t2">cm</text>';
    return A.svg(430, 140, s, label || 'A ruler from 0 to 10 cm');
  }
  /* the unit ladder: km, m, cm, mm */
  function ladder() {
    var B = [['km', 'kilometre', 'var(--sd)'], ['m', 'metre', 'var(--sc)'], ['cm', 'centimetre', 'var(--sb)'], ['mm', 'millimetre', 'var(--se)']], L = ['1 km = 1000 m', '1 m = 100 cm', '1 cm = 10 mm'], s = '';
    B.forEach(function (b, i) {
      var y = 8 + i * 74;
      s += '<rect x="10" y="' + y + '" width="150" height="52" rx="12" style="fill:color-mix(in srgb,' + b[2] + ' 22%,var(--card));stroke:' + b[2] + '" stroke-width="3"/>';
      s += '<text x="85" y="' + (y + 34) + '" text-anchor="middle" font-size="24" class="tb">' + b[0] + '</text>';
      s += '<text x="176" y="' + (y + 33) + '" font-size="18" class="t2">' + b[1] + '</text>';
      if (i < 3) s += '<path d="M85 ' + (y + 54) + ' v16" style="stroke:var(--ink)" stroke-width="2.5"/><polygon points="79,' + (y + 64) + ' 91,' + (y + 64) + ' 85,' + (y + 72) + '" style="fill:var(--ink)"/>' +
        '<text x="300" y="' + (y + 70) + '" text-anchor="middle" font-size="18" class="tb" style="fill:var(--strand)">' + L[i] + '</text>';
    });
    return A.svg(400, 304, s, 'Units from biggest to smallest: kilometre, metre, centimetre, millimetre. 1 km = 1000 m. 1 m = 100 cm. 1 cm = 10 mm.');
  }
  /* a ribbon len cm long, measured with units u cm long (16 px per cm) */
  function ribbon(len, u, label) {
    var c = Math.min(34, 400 / len), x0 = 14, s = '', n = Math.floor(len / u);
    s += '<rect x="' + x0 + '" y="10" width="' + len * c + '" height="30" rx="4" style="fill:var(--sd)" opacity=".75"/>';
    s += '<text x="' + (x0 + len * c / 2) + '" y="31" text-anchor="middle" font-size="16" class="tb" style="fill:#fff">ribbon: ' + len + ' cm</text>';
    for (var i = 0; i < n; i++) {
      s += '<rect x="' + (x0 + i * u * c) + '" y="50" width="' + u * c + '" height="30" rx="5" style="fill:color-mix(in srgb,' + (i % 2 ? 'var(--sb)' : 'var(--se)') + ' 35%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
      if (u * c >= 18) s += '<text x="' + (x0 + (i + 0.5) * u * c) + '" y="71" text-anchor="middle" font-size="' + (u * c >= 26 ? 17 : 13) + '" class="tb">' + (i + 1) + '</text>';
    }
    return A.svg(x0 * 2 + len * c, 90, s, label || 'A ribbon ' + len + ' cm long, measured with ' + n + ' units that are each ' + u + ' cm long');
  }
  /* rectangle l by w on a cm grid with side labels */
  function rect(l, w, label, opt) {
    opt = opt || {};
    var c = Math.min(38, 300 / Math.max(l, w)), x0 = 56, y0 = 36, s = '', i;
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + l * c + '" height="' + w * c + '" style="fill:color-mix(in srgb,var(--strand) ' + (opt.fill ? 30 : 12) + '%,var(--card))"/>';
    for (i = 1; i < l; i++) s += '<line x1="' + (x0 + i * c) + '" y1="' + y0 + '" x2="' + (x0 + i * c) + '" y2="' + (y0 + w * c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    for (i = 1; i < w; i++) s += '<line x1="' + x0 + '" y1="' + (y0 + i * c) + '" x2="' + (x0 + l * c) + '" y2="' + (y0 + i * c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + l * c + '" height="' + w * c + '" fill="none" style="stroke:' + (opt.fill ? 'var(--ink)' : 'var(--bad)') + '" stroke-width="' + (opt.fill ? 3 : 5) + '"/>';
    if (!opt.nolab) {
      s += '<text x="' + (x0 + l * c / 2) + '" y="' + (y0 - 10) + '" text-anchor="middle" font-size="19" class="tb">' + l + ' cm</text>';
      s += '<text x="' + (x0 + l * c / 2) + '" y="' + (y0 + w * c + 26) + '" text-anchor="middle" font-size="19" class="tb">' + l + ' cm</text>';
      s += '<text x="' + (x0 - 8) + '" y="' + (y0 + w * c / 2 + 6) + '" text-anchor="end" font-size="19" class="tb">' + w + ' cm</text>';
      s += '<text x="' + (x0 + l * c + 8) + '" y="' + (y0 + w * c / 2 + 6) + '" font-size="19" class="tb">' + w + ' cm</text>';
    }
    return A.svg(x0 * 2 + l * c + 10, y0 + w * c + 40, s, label || 'Rectangle ' + l + ' cm by ' + w + ' cm');
  }
  /* a polygon with labelled sides */
  function poly(sides, label) {
    var n = sides.length, r = 105, s = '', P = [], i, off = n === 4 ? 0.5 : 0;
    for (i = 0; i < n; i++) { var a = -Math.PI / 2 + (i + off) * 2 * Math.PI / n; P.push([r * Math.cos(a) * 1.3, r * Math.sin(a)]); }
    var minX = Math.min.apply(null, P.map(function (p) { return p[0]; })), minY = Math.min.apply(null, P.map(function (p) { return p[1]; })), maxX = Math.max.apply(null, P.map(function (p) { return p[0]; })), maxY = Math.max.apply(null, P.map(function (p) { return p[1]; }));
    var dx0 = 70 - minX, dy0 = 40 - minY, cx = dx0 + (minX + maxX) / 2, cy = dy0 + (minY + maxY) / 2;
    P = P.map(function (p) { return [Math.round(p[0] + dx0), Math.round(p[1] + dy0)]; });
    s += '<polygon points="' + P.map(function (p) { return p.join(','); }).join(' ') + '" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--bad)" stroke-width="5" stroke-linejoin="round"/>';
    for (i = 0; i < n; i++) {
      var p = P[i], q = P[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = mx - cx, dy = my - cy, d = Math.sqrt(dx * dx + dy * dy) || 1;
      s += '<text x="' + Math.round(mx + dx / d * 34) + '" y="' + Math.round(my + dy / d * 24 + 7) + '" text-anchor="middle" font-size="22" class="tb">' + sides[i] + ' cm</text>';
    }
    return A.svg(Math.round(maxX - minX + 140), Math.round(maxY - minY + 80), s, label || 'A shape with sides ' + sides.join(' cm, ') + ' cm');
  }
  /* a shape on a grid. rows: [start, length] from the top. tiles: cells covered */
  function shape(rows, opt) {
    opt = opt || {};
    var c = opt.c || 40, cols = 0, s = '', x0 = 10, y0 = 10;
    rows.forEach(function (r) { cols = Math.max(cols, r[0] + r[1]); });
    for (var y = 0; y < rows.length; y++) for (var x = 0; x < cols; x++) s += '<rect x="' + (x0 + x * c) + '" y="' + (y0 + y * c) + '" width="' + c + '" height="' + c + '" fill="none" style="stroke:var(--line)" stroke-width="1"/>';
    rows.forEach(function (r, y) {
      for (var x = r[0]; x < r[0] + r[1]; x++) s += '<rect x="' + (x0 + x * c) + '" y="' + (y0 + y * c) + '" width="' + c + '" height="' + c + '" style="fill:color-mix(in srgb,' + (opt.col || 'var(--strand)') + ' 38%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
    });
    return A.svg(x0 * 2 + cols * c, y0 * 2 + rows.length * c, s, opt.label || 'Shape on a square grid with rows of ' + rows.map(function (r) { return r[1]; }).join(', ') + ' squares');
  }
  function rowsArea(rows) { return rows.reduce(function (t, r) { return t + r[1]; }, 0); }
  /* gaps and overlaps on a 4 by 3 rectangle */
  function gapFig(mode) {
    var c = 60, x0 = 12, y0 = 12, s = '', n = 0, xs, ys, t;
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + 4 * c + '" height="' + 3 * c + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="3"/>';
    if (mode === 'fit') { xs = [0, 1, 2, 3]; ys = [0, 1, 2]; t = 1; }
    else if (mode === 'gap') { xs = [0.1, 1.35, 2.6]; ys = [0.1, 1.35]; t = 0.8; }
    else { xs = [0, 0.75, 1.5, 2.25, 3]; ys = [0, 0.75, 1.5, 2]; t = 1; }
    ys.forEach(function (y) { xs.forEach(function (x) { n++;
      s += '<rect x="' + (x0 + x * c + 2) + '" y="' + (y0 + y * c + 2) + '" width="' + (t * c - 4) + '" height="' + (t * c - 4) + '" rx="4" style="fill:color-mix(in srgb,var(--sb) ' + (mode === 'over' ? 30 : 45) + '%,transparent);stroke:var(--sb)" stroke-width="2"/>'; }); });
    return { n: n, svg: A.svg(4 * c + 24, 3 * c + 24, s, mode === 'fit' ? 'A 4 by 3 rectangle covered with 12 tiles, no gaps or overlaps' : mode === 'gap' ? 'The same rectangle with ' + n + ' tiles and gaps between them' : 'The same rectangle with ' + n + ' tiles that overlap') };
  }
  /* a circle of radius 2 cm on a cm grid, for estimating */
  function circleFig() {
    var c = 46, x0 = 14, s = '', cx = x0 + 3 * c, cy = x0 + 3 * c;
    for (var i = 0; i <= 6; i++) s += '<line x1="' + (x0 + i * c) + '" y1="' + x0 + '" x2="' + (x0 + i * c) + '" y2="' + (x0 + 6 * c) + '" style="stroke:var(--line)" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + (x0 + i * c) + '" x2="' + (x0 + 6 * c) + '" y2="' + (x0 + i * c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    [[2, 2], [3, 2], [2, 3], [3, 3]].forEach(function (p) { s += '<rect x="' + (x0 + p[0] * c) + '" y="' + (x0 + p[1] * c) + '" width="' + c + '" height="' + c + '" style="fill:color-mix(in srgb,var(--sd) 45%,var(--card))"/>'; });
    [[1, 2], [1, 3], [4, 2], [4, 3], [2, 1], [3, 1], [2, 4], [3, 4]].forEach(function (p) { s += '<rect x="' + (x0 + p[0] * c) + '" y="' + (x0 + p[1] * c) + '" width="' + c + '" height="' + c + '" style="fill:color-mix(in srgb,var(--hi) 55%,var(--card))"/>'; });
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + 2 * c + '" fill="none" style="stroke:var(--ink)" stroke-width="4"/>';
    return A.svg(6 * c + 28, 6 * c + 28, s, 'A circle drawn on a centimetre grid. 4 squares inside are full. 8 squares are more than half full. 4 corner squares are less than half full.');
  }

  var SHAPES = { rect: [[0, 4], [0, 4], [0, 4]], ell: [[0, 2], [0, 2], [0, 5], [0, 5]], tee: [[0, 5], [0, 5], [1, 3], [1, 3]], step: [[0, 1], [0, 2], [0, 3], [0, 4]] };

  A.register('length-area', {
    html:
'<section class="sec"><h2><span class="n">1</span>Units of length</h2>' +
'<p>We measure length in <b>metric units</b>. From smallest to biggest they are the <b>millimetre</b> (mm), <b>centimetre</b> (cm), <b>metre</b> (m) and <b>kilometre</b> (km). Each step up is a bigger unit, so you need fewer of them.</p>' +
'<div class="fig">' + ladder() + '</div>' +
'<div class="tbl"><table><thead><tr><th>Unit</th><th>About as long as</th></tr></thead><tbody>' +
'<tr><td class="l">1 mm</td><td class="l">the thickness of a dime</td></tr><tr><td class="l">1 cm</td><td class="l">the width of your smallest fingernail</td></tr>' +
'<tr><td class="l">1 m</td><td class="l">one big step, or the width of a door</td></tr><tr><td class="l">1 km</td><td class="l">a 15-minute walk</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: measure a pencil</span>' +
'<div class="ctrl"><label for="ru">Pencil length: <output id="ruo"></output><input type="range" id="ru" min="20" max="100" value="73"></label></div>' +
'<div class="fig" id="rufig"></div><div class="out" id="ruout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Every centimetre on a ruler has 10 small marks. Each small step is 1 millimetre. 10 mm = 1 cm.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>How many centimetres are in 3 m? 1 m = 100 cm. 3 m is 3 hundreds. 3 m = <b>300 cm</b>.</p></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Different units, same length</h2>' +
'<p>You can measure the same thing with different units. Small units give a big count. Big units give a small count. The length of the object does not change.</p>' +
'<div class="lab"><span class="lt">Try it: measure the ribbon</span>' +
'<div class="ctrl"><label for="rbu">Unit size<select id="rbu"><option value="1">1 cm cubes</option><option value="2">2 cm erasers</option><option value="3">3 cm paper clips</option><option value="4" selected>4 cm sticks</option><option value="6">6 cm crayons</option><option value="8">8 cm straws</option><option value="12">12 cm pencils</option></select></label></div>' +
'<div class="fig" id="rbfig"></div><div class="out" id="rbout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a bigger count means a longer object. 24 cubes and 2 pencils can measure the same ribbon. Always say the unit with the number.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A desk is 10 hand spans long. Each span is 12 cm. 10 &times; 12 = 120, so the desk is <b>120 cm</b>, a bit more than 1 m.</p></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Perimeter: the distance around</h2>' +
'<p>The <b>perimeter</b> is the total length around the outside of a shape. Add the lengths of all the sides. For a curved shape, wrap a string around it, then straighten the string along a ruler.</p>' +
'<div class="lab"><span class="lt">Try it: change the rectangle</span>' +
'<div class="ctrl"><label for="pl">Length: <output id="plo"></output><input type="range" id="pl" min="1" max="9" value="5"></label><label for="pw">Width: <output id="pwo"></output><input type="range" id="pw" min="1" max="9" value="3"></label></div>' +
'<div class="fig" id="pfig"></div><div class="out" id="pout" aria-live="polite"></div>' +
'<p class="t2" id="pgoal" style="margin:.3em 0 0"></p></div>' +
'<div class="key"><b class="t">Key idea</b><p>A rectangle has two pairs of matching sides. Add length and width, then double it. 5 + 3 = 8, and 8 + 8 = 16.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A triangle has sides of 4 cm, 5 cm and 6 cm. Add them: 4 + 5 + 6 = <b>15 cm</b>.</p><div class="fig">' + poly([4, 5, 6]) + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Area: covering a shape</h2>' +
'<p>The <b>area</b> is how much space a flat shape covers. To measure it, cover the shape with units that are all the same, like square tiles, and count them. The tiles must not leave <b>gaps</b> and must not <b>overlap</b>.</p>' +
'<div class="lab"><span class="lt">Try it: cover the shape</span>' +
'<div class="ctrl"><label for="ars">Shape<select id="ars"><option value="rect">rectangle</option><option value="ell">L shape</option><option value="tee">T shape</option><option value="step">steps</option></select></label></div>' +
'<p class="t2" style="margin:.2em 0">Tap a square to put a tile on it. Tap again to take it off.</p>' +
'<div class="fig" id="arfig"></div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="arall">Cover it all</button><button type="button" class="btn alt" id="arclr">Clear tiles</button></div>' +
'<div class="out" id="arout" aria-live="polite"></div></div>' +
'<div class="lab"><span class="lt">Try it: gaps and overlaps</span>' +
'<div class="btnrow"><button type="button" class="btn alt" data-gm="fit" aria-pressed="true">Tiles fit</button><button type="button" class="btn alt" data-gm="gap" aria-pressed="false">Gaps</button><button type="button" class="btn alt" data-gm="over" aria-pressed="false">Overlaps</button></div>' +
'<div class="fig" id="gmfig"></div><div class="out" id="gmout" aria-live="polite"></div></div>' +
'<div class="vs"><div><b class="t">Perimeter</b><p>The distance <b>around</b> the edge. Measured in cm or m.</p></div><div><b class="t">Not area</b><p>Area is the space <b>inside</b>. Measured in squares: cm&sup2; or m&sup2;.</p></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Gaps make the count too <b>low</b>. Overlaps make the count too <b>high</b>. Only tiles that fit edge to edge give the true area.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>This shape has rows of 4, 4 and 2 squares. Count row by row: 4 + 4 + 2 = <b>10 square units</b>.</p><div class="fig">' + shape([[0, 4], [0, 4], [0, 2]]) + '</div></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Square centimetres and square metres</h2>' +
'<p>A <b>square centimetre</b> (cm&sup2;) is a square with sides of 1 cm. It is about the size of your fingernail. A <b>square metre</b> (m&sup2;) is a square with sides of 1 m. Four children can stand on one. Use cm&sup2; for small things like a sticky note. Use m&sup2; for big things like a floor.</p>' +
'<div class="lab"><span class="lt">Try it: same area, different shapes</span>' +
'<div class="ctrl"><label for="sa">Area: <output id="sao"></output><input type="range" id="sa" min="4" max="24" value="12"></label></div>' +
'<div class="fig" id="safig"></div><div class="out" id="saout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Different shapes can have the same area. A 2 by 6 rectangle and a 3 by 4 rectangle both cover 12 cm&sup2;.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Estimate the area of a circle. Count the <b>full</b> squares: 4 (green). Count squares that are <b>more than half</b> full as 1 each: 8 (yellow). Leave out the small corner bits. 4 + 8 = 12, so the area is <b>about 12 cm&sup2;</b>.</p><div class="fig">' + circleFig() + '</div></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: '1 cm = ___ mm', options: ['10', '100', '1000'], answer: 0, why: 'Each centimetre has 10 small millimetre marks.' },
        { q: 'Which unit would you use for the length of a soccer field?', options: ['mm', 'cm', 'm'], answer: 2, why: 'A soccer field is many big steps long, so use metres.' },
        { q: '2 km = ___ m', options: ['200', '2000', '20'], answer: 1, why: '1 km = 1000 m, so 2 km = 2000 m.' }
      ],
      s2: [
        { q: 'A stick is measured with 1 cm cubes, then 2 cm cubes. Which count is bigger?', options: ['the 1 cm count', 'the 2 cm count', 'they are the same'], answer: 0, why: 'Smaller units fit more times, so the count is bigger.' },
        { q: 'A rope is 12 cm. How many 3 cm paper clips long is it?', options: ['3', '4', '6'], answer: 1, why: '3 + 3 + 3 + 3 = 12, so 4 clips.' },
        { q: 'Mia says her shelf is 9 long. What is missing?', options: ['the unit', 'a bigger number', 'nothing'], answer: 0, why: 'Say 9 what: 9 cm, 9 m or 9 hand spans.' }
      ],
      s3: [
        { q: 'What is the perimeter of a 4 cm by 2 cm rectangle?', fig: rect(4, 2), options: ['8 cm', '12 cm', '6 cm'], answer: 1, why: '4 + 2 + 4 + 2 = 12.' },
        { q: 'A square has sides of 3 cm. What is its perimeter?', options: ['9 cm', '12 cm', '6 cm'], answer: 1, why: 'A square has 4 equal sides. 3 + 3 + 3 + 3 = 12.' },
        { q: 'How do you measure around a round plate?', options: ['wrap a string around it, then measure the string', 'measure straight across', 'count its corners'], answer: 0, why: 'A string bends around the curve. Then you can lay it flat on a ruler.' }
      ],
      s4: [
        { q: 'What is the area of this shape?', fig: shape([[0, 3], [0, 3]]), options: ['5 square units', '6 square units', '10 square units'], answer: 1, why: 'Two rows of 3 squares. 3 + 3 = 6.' },
        { q: 'Sam left gaps between his tiles. His count is:', options: ['too low', 'too high', 'just right'], answer: 0, why: 'Gaps mean part of the shape was not counted.' },
        { q: 'Lee let her tiles overlap. Her count is:', options: ['too low', 'too high', 'just right'], answer: 1, why: 'Overlaps count some parts twice.' }
      ],
      s5: [
        { q: 'Which would you measure in m²?', options: ['a classroom floor', 'a stamp', 'a cracker'], answer: 0, why: 'A floor is big. Square metres are for big areas.' },
        { q: 'Which rectangle has the same area as 2 by 6?', options: ['3 by 4', '2 by 5', '4 by 4'], answer: 0, why: '2 × 6 = 12 and 3 × 4 = 12.' },
        { q: 'A square centimetre is about the size of:', options: ['a fingernail', 'a door', 'a desk'], answer: 0, why: 'It is a square 1 cm on each side, very small.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function ru() {
        var mm = +$('#ru', root).value, c = Math.floor(mm / 10), r = mm % 10;
        $('#ruo', root).textContent = mm + ' mm';
        $('#rufig', root).innerHTML = ruler(mm, 'A pencil ' + mm + ' mm long on a ruler');
        $('#ruout', root).innerHTML = '<p><span class="big">' + mm + ' mm</span></p><p>' + (r ? c + ' cm and ' + r + ' mm. It is between ' + c + ' cm and ' + (c + 1) + ' cm. To the nearest cm it is about ' + (r >= 5 ? c + 1 : c) + ' cm.' : 'Exactly ' + c + ' cm, because ' + c + ' &times; 10 = ' + mm + '.') + '</p>';
      }
      A.bind(root, ['ru'], ru);
      var tried = {};
      function rb() {
        var u = +$('#rbu', root).value, n = 24 / u, opt = $('#rbu', root).selectedOptions[0].textContent.replace(/^\d+ cm /, '');
        tried[u] = n;
        $('#rbfig', root).innerHTML = ribbon(24, u);
        var list = Object.keys(tried).map(Number).sort(function (a, b) { return a - b; }).map(function (k) { return k + ' cm units: ' + tried[k]; }).join('. ');
        $('#rbout', root).innerHTML = '<p><span class="big">' + n + ' ' + opt + '</span></p><p>' + n + ' &times; ' + u + ' = 24, so the ribbon is still 24 cm. ' + (u === 1 ? 'Tiny units, big count.' : u >= 8 ? 'Big units, small count.' : 'Try a bigger or smaller unit.') + '</p><p class="t2">Your counts so far: ' + list + '.</p>';
      }
      A.bind(root, ['rbu'], rb);
      var found = {};
      function pm() {
        var l = +$('#pl', root).value, w = +$('#pw', root).value, p = 2 * (l + w);
        $('#plo', root).textContent = l + ' cm'; $('#pwo', root).textContent = w + ' cm';
        $('#pfig', root).innerHTML = rect(l, w);
        $('#pout', root).innerHTML = '<p><span class="big">Perimeter ' + p + ' cm</span></p><p>' + l + ' + ' + w + ' + ' + l + ' + ' + w + ' = ' + p + ' cm.</p>';
        if (p === 16) found[Math.min(l, w) + ' by ' + Math.max(l, w)] = 1;
        var f = Object.keys(found);
        $('#pgoal', root).innerHTML = '<b>Challenge:</b> make rectangles with a perimeter of 16 cm. ' + (f.length ? 'You found ' + f.length + ' of 4: ' + f.join(', ') + ' cm.' : 'You found 0 of 4.') + (f.length === 4 ? ' All found!' : '');
      }
      A.bind(root, ['pl', 'pw'], pm);
      var tiles = {};
      function cells() { var out = []; SHAPES[$('#ars', root).value].forEach(function (r, y) { for (var x = r[0]; x < r[0] + r[1]; x++) out.push(x + ',' + y); }); return out; }
      function ar() {
        var k = $('#ars', root).value, rows = SHAPES[k], c = 60, cols = 0, s = '', all = cells(), n = 0;
        rows.forEach(function (r) { cols = Math.max(cols, r[0] + r[1]); });
        rows.forEach(function (r, y) { for (var x = r[0]; x < r[0] + r[1]; x++) {
          var on = tiles[x + ',' + y]; if (on) n++;
          s += '<g class="tap" tabindex="0" role="button" data-c="' + x + ',' + y + '" aria-label="Square in row ' + (y + 1) + ', column ' + (x + 1) + (on ? ', tiled' : ', empty') + '">' +
            '<rect x="' + (8 + x * c) + '" y="' + (8 + y * c) + '" width="' + c + '" height="' + c + '" style="fill:var(--card);stroke:var(--ink)" stroke-width="2" stroke-dasharray="5 4"/>' +
            (on ? '<rect x="' + (11 + x * c) + '" y="' + (11 + y * c) + '" width="' + (c - 6) + '" height="' + (c - 6) + '" rx="5" style="fill:color-mix(in srgb,var(--strand) 60%,var(--card));stroke:var(--ink)" stroke-width="2"/><text x="' + (8 + x * c + c / 2) + '" y="' + (8 + y * c + c / 2 + 6) + '" text-anchor="middle" font-size="17" class="tb">' + n + '</text>' : '') + '</g>';
        } });
        $('#arfig', root).innerHTML = A.svg(16 + cols * c, 16 + rows.length * c, s, 'A shape of ' + all.length + ' squares. ' + n + ' have tiles.');
        var gaps = all.length - n;
        $('#arout', root).innerHTML = gaps ? '<p><span class="big">' + n + ' tile' + (n === 1 ? '' : 's') + '</span></p><p>' + gaps + ' gap' + (gaps === 1 ? '' : 's') + ' left. Keep covering. A gap means part of the area is not counted yet.</p>' :
          '<p><span class="big">Area = ' + n + ' square units</span></p><p>Covered with no gaps and no overlaps. Count row by row: ' + rows.map(function (r) { return r[1]; }).join(' + ') + ' = ' + n + '.</p>';
        $('#arfig', root).querySelectorAll('[data-c]').forEach(function (g) {
          function t() { var key = g.getAttribute('data-c'); tiles[key] = !tiles[key]; ar(); var f = $('#arfig [data-c="' + key + '"]', root); if (f) f.focus(); }
          g.addEventListener('click', t);
          g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
        });
      }
      $('#ars', root).addEventListener('change', function () { tiles = {}; ar(); });
      $('#arall', root).addEventListener('click', function () { cells().forEach(function (k) { tiles[k] = true; }); ar(); });
      $('#arclr', root).addEventListener('click', function () { tiles = {}; ar(); });
      ar();
      function gm(mode) {
        var g = gapFig(mode);
        $('#gmfig', root).innerHTML = g.svg;
        root.querySelectorAll('[data-gm]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-gm') === mode)); });
        $('#gmout', root).innerHTML = '<p><span class="big">' + g.n + ' tiles</span></p><p>' + (mode === 'fit' ? 'The tiles fit edge to edge. The true area is 12 square units.' : mode === 'gap' ? 'Only ' + g.n + ' tiles fit with gaps. The count is too low. The real area is 12.' : g.n + ' tiles that overlap. The count is too high. The real area is still 12.') + '</p>';
      }
      root.querySelectorAll('[data-gm]').forEach(function (b) { b.addEventListener('click', function () { gm(b.getAttribute('data-gm')); }); });
      gm('fit');
      function sa() {
        var a = +$('#sa', root).value, list = [], c = a > 12 ? 13 : 22, s = '', y = 8, W = 0;
        for (var w = 1; w * w <= a; w++) if (a % w === 0) list.push([w, a / w]);
        $('#sao', root).textContent = a + ' cm²';
        list.forEach(function (p, i) {
          var col = ['var(--sb)', 'var(--sc)', 'var(--sd)', 'var(--se)', 'var(--sf)'][i % 5];
          for (var r = 0; r < p[0]; r++) for (var k = 0; k < p[1]; k++) s += '<rect x="' + (8 + k * c) + '" y="' + (y + r * c) + '" width="' + c + '" height="' + c + '" style="fill:color-mix(in srgb,' + col + ' 40%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>';
          s += '<text x="' + (16 + p[1] * c) + '" y="' + (y + p[0] * c / 2 + 6) + '" font-size="17" class="tb">' + p[0] + ' by ' + p[1] + '</text>';
          W = Math.max(W, 100 + p[1] * c); y += p[0] * c + 14;
        });
        $('#safig', root).innerHTML = A.svg(W, y, s, 'Rectangles with an area of ' + a + ' square centimetres: ' + list.map(function (p) { return p[0] + ' by ' + p[1]; }).join(', '));
        $('#saout', root).innerHTML = '<p><span class="big">' + list.length + ' rectangle' + (list.length > 1 ? 's' : '') + ' with ' + a + ' cm&sup2;</span></p><p>Each one covers ' + a + ' squares. Their perimeters are different: ' + list.map(function (p) { return p[0] + ' by ' + p[1] + ' has ' + 2 * (p[0] + p[1]) + ' cm'; }).join('; ') + '.</p>' +
          (list.length === 1 ? '<p class="t2">Only one rectangle! Try a number like 12, 16 or 24.</p>' : '');
      }
      A.bind(root, ['sa'], sa);
    },

    quiz: [
      { q: '4 cm = ___ mm', type: 'num', answer: 40, unit: 'mm', hint: 'Each centimetre has 10 millimetres.', explain: '4 &times; 10 = 40, so 4 cm = 40 mm.' },
      { q: 'Which unit would you use for the distance from Toronto to Ottawa?', type: 'mc', options: ['mm', 'cm', 'm', 'km'], answer: 3, hint: 'It takes hours to drive there.', explain: 'Long distances between cities use kilometres.' },
      { q: 'What is the perimeter of this rectangle?', type: 'num', answer: 16, unit: 'cm', fig: rect(6, 2), hint: 'Add all four sides.', explain: '6 + 2 + 6 + 2 = 16 cm.' },
      { q: 'What is the area of this shape?', type: 'num', answer: 11, unit: 'square units', fig: shape([[0, 3], [0, 3], [0, 3], [0, 2]]), hint: 'Count row by row.', explain: '3 + 3 + 3 + 2 = 11 square units.' },
      { q: 'A pencil is 6 erasers long or 4 paper clips long. Which is true?', type: 'mc', options: ['The pencil is the same length both times.', 'The pencil is longer with erasers.', 'The paper clips are shorter than the erasers.', 'One count must be wrong.'], answer: 0,
        hint: 'Did the pencil change, or did the unit change?', explain: 'The pencil stays the same. A paper clip is longer than an eraser, so fewer fit.' },
      { q: 'Kim covers a shape with tiles but leaves gaps. Her count is:', type: 'mc', options: ['too low', 'too high', 'just right'], answer: 0, hint: 'Is every part of the shape covered and counted?', explain: 'Gaps leave parts uncounted, so the count is too low.' },
      { q: 'Which rectangle has the same area as a 3 cm by 4 cm rectangle?', type: 'mc', options: ['2 cm by 6 cm', '2 cm by 5 cm', '3 cm by 5 cm', '4 cm by 4 cm'], answer: 0, hint: 'Find the area of each: rows times columns.', explain: '3 &times; 4 = 12 and 2 &times; 6 = 12. Same area, different shape.' }
    ],

    practice: [
      { id: 'la-convert', name: 'Change units', code: 'E2.2', gen: function (lv) {
        var F = { mm: 1, cm: 10, m: 1000, km: 1000000 }, a, from, to, b = 0, from2;
        if (lv === 1) { var t = R.pick([['cm', 'mm'], ['m', 'cm']]); from = t[0]; to = t[1]; a = R.int(1, 9); }
        else if (lv === 2) { var k = R.int(0, 2); if (k === 0) { from = 'km'; to = 'm'; a = R.int(1, 9); } else if (k === 1) { from = 'mm'; to = 'cm'; a = R.int(2, 9) * 10; } else { from = 'cm'; to = 'm'; a = R.int(2, 9) * 100; } }
        else { if (R.int(0, 1)) { from = 'm'; from2 = 'cm'; to = 'cm'; a = R.int(1, 5); b = R.int(1, 19) * 5; } else { from = 'cm'; from2 = 'mm'; to = 'mm'; a = R.int(1, 9); b = R.int(1, 9); } }
        var ans = (a * F[from] + (from2 ? b * F[from2] : 0)) / F[to], big = F[from] > F[to], f = big ? F[from] / F[to] : F[to] / F[from];
        var qs = a + ' ' + from + (from2 ? ' ' + b + ' ' + from2 : '') + ' = ___ ' + to;
        return { q: qs, type: 'num', answer: ans, unit: to, fig: lv === 1 && from === 'cm' ? ruler(a * 10, 'A pencil ' + a + ' cm long on a ruler') : '',
          hint: '1 ' + (big ? from : to) + ' = ' + f + ' ' + (big ? to : from) + '.',
          steps: ['1 ' + (big ? from : to) + ' = ' + f + ' ' + (big ? to : from) + '.', big ? a + ' &times; ' + f + ' = ' + a * f + '.' + (from2 ? ' Then add the ' + b + ' ' + from2 + ': ' + a * f + ' + ' + b + ' = ' + ans + '.' : '') : a + ' &divide; ' + f + ' = ' + ans + '.', qs.replace('___', ans) + '.'],
          explain: qs.replace('___', ans) + '.' };
      } },
      { id: 'la-unit', name: 'Pick the best unit', code: 'E2.2', gen: function (lv) {
        var UN = ['mm', 'cm', 'm', 'km'];
        if (lv < 3) {
          var O = [['the length of an ant', 'mm'], ['the thickness of a coin', 'mm'], ['the length of a grain of rice', 'mm'], ['the length of a pencil', 'cm'], ['the width of a book', 'cm'], ['the length of your hand', 'cm'], ['the height of a door', 'm'], ['the length of a classroom', 'm'], ['the length of a school bus', 'm'], ['the length of a hockey rink', 'm'], ['the distance from Toronto to Ottawa', 'km'], ['the distance of a bike ride to the next town', 'km']], o = R.pick(lv === 1 ? O.filter(function (x) { return x[1] !== 'mm'; }) : O);
          return { q: 'Which unit would you use to measure <b>' + o[0] + '</b>?', type: 'mc', options: UN, answer: UN.indexOf(o[1]),
            hint: 'Think of the benchmarks: mm is a dime\'s thickness, cm is a fingernail, m is a big step, km is a 15-minute walk.',
            steps: ['Picture the object.', 'Compare it to a dime, a fingernail, a big step, and a long walk.', 'The best unit is ' + o[1] + '.'], explain: 'Use ' + o[1] + ' for ' + o[0] + '.' };
        }
        var E = [['a new pencil', 19, 'cm'], ['a door from top to bottom', 2, 'm'], ['a paper clip', 3, 'cm'], ['a grain of rice', 5, 'mm'], ['a car', 4, 'm'], ['a ladybug', 7, 'mm'], ['a walk around a big park', 2, 'km'], ['a fork', 18, 'cm']], e = R.pick(E);
        var opts = UN.map(function (u) { return e[1] + ' ' + u; });
        return { q: 'About how long is <b>' + e[0] + '</b>?', type: 'mc', options: opts, answer: UN.indexOf(e[2]),
          hint: 'Try each one in your head. Which one makes sense?', steps: ['Picture ' + e[1] + ' of each unit.', 'Only one is a sensible size.', e[0].charAt(0).toUpperCase() + e[0].slice(1) + ' is about ' + e[1] + ' ' + e[2] + '.'], explain: 'About ' + e[1] + ' ' + e[2] + '.' };
      } },
      { id: 'la-count', name: 'Units of different sizes', code: 'E2.5', gen: function (lv) {
        if (lv === 3 && R.int(0, 1)) {
          var a = R.int(4, 12) * 2, b = R.int(2, Math.floor(a / 2) - 1), nm = R.shuffle(['Ana', 'Ben', 'Raj', 'Mei']);
          var o = R.mc(nm[1] + '\'s unit', ['They are the same', nm[0] + '\'s unit']);
          return { q: nm[0] + ' measures a desk and gets ' + a + ' units. ' + nm[1] + ' measures the same desk and gets ' + b + ' units. Whose unit is longer?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Bigger units fit fewer times.', steps: ['The desk is the same length both times.', 'Fewer units means each unit is longer.', b + ' is less than ' + a + ', so ' + nm[1] + '\'s unit is longer.'], explain: nm[1] + ' needed fewer units, so each unit is longer.' };
        }
        var u = R.pick(lv === 1 ? [2, 3, 4, 6] : [3, 4, 5, 6, 8]), n = lv === 1 ? R.int(2, 6) : R.int(3, 9), L = u * n;
        if (lv === 3) return { q: 'A table is ' + n + ' hand spans long. Each hand span is ' + u + ' cm. How long is the table?', type: 'num', answer: L, unit: 'cm',
          hint: 'Add ' + u + ' cm, ' + n + ' times.', steps: [n + ' spans of ' + u + ' cm each.', n + ' &times; ' + u + ' = ' + L + '.', 'The table is ' + L + ' cm long.'], explain: n + ' &times; ' + u + ' = ' + L + ' cm.' };
        return { q: 'A ribbon is ' + L + ' cm long. How many ' + u + ' cm sticks long is it?', type: 'num', answer: n, unit: 'sticks', fig: lv === 1 ? ribbon(L, u, 'A ribbon ' + L + ' cm long with sticks of ' + u + ' cm under it') : '',
          hint: 'Skip count by ' + u + ' until you reach ' + L + '.', steps: ['Each stick is ' + u + ' cm.', 'Skip count: ' + Array.apply(null, Array(n)).map(function (_, i) { return u * (i + 1); }).join(', ') + '.', 'That is ' + n + ' sticks.'], explain: n + ' &times; ' + u + ' = ' + L + ', so ' + n + ' sticks.' };
      } },
      { id: 'la-perim', name: 'Perimeter', code: 'E2.1', gen: function (lv) {
        if (lv === 1) {
          var l = R.int(2, 8), w = R.int(1, 6), p = 2 * (l + w);
          return { q: 'What is the perimeter of this rectangle?', type: 'num', answer: p, unit: 'cm', fig: rect(l, w),
            hint: 'Add all four sides, not just two.', steps: ['The sides are ' + l + ', ' + w + ', ' + l + ' and ' + w + ' cm.', l + ' + ' + w + ' + ' + l + ' + ' + w + ' = ' + p + '.', 'The perimeter is ' + p + ' cm.'], explain: l + ' + ' + w + ' + ' + l + ' + ' + w + ' = ' + p + ' cm.' };
        }
        if (lv === 2) {
          var n = R.pick([3, 5]), sides = [], mx; do { sides = []; for (var i = 0; i < n; i++) sides.push(R.int(2, 9)); mx = Math.max.apply(null, sides); } while (mx * 2 >= sides.reduce(function (a, b) { return a + b; }, 0));
          var t = sides.reduce(function (a, b) { return a + b; }, 0);
          return { q: 'What is the perimeter of this shape?', type: 'num', answer: t, unit: 'cm', fig: poly(sides),
            hint: 'There are ' + n + ' sides. Add them all.', steps: ['The sides are ' + sides.join(', ') + ' cm.', sides.join(' + ') + ' = ' + t + '.', 'The perimeter is ' + t + ' cm.'], explain: sides.join(' + ') + ' = ' + t + ' cm.' };
        }
        if (R.int(0, 2) === 0) {
          var sq = R.int(2, 9);
          return { q: 'A square has a perimeter of ' + 4 * sq + ' cm. How long is each side?', type: 'num', answer: sq, unit: 'cm',
            hint: 'A square has 4 equal sides.', steps: ['4 equal sides make ' + 4 * sq + ' cm.', 'Share ' + 4 * sq + ' into 4 equal parts: ' + 4 * sq + ' &divide; 4 = ' + sq + '.', 'Each side is ' + sq + ' cm.'], explain: 4 * sq + ' &divide; 4 = ' + sq + ' cm.' };
        }
        var a = R.int(2, 9), b = R.int(1, 8), P = 2 * (a + b);
        return { q: 'A rectangle has a perimeter of ' + P + ' cm. One side is ' + a + ' cm long. How long is the side next to it?', type: 'num', answer: b, unit: 'cm',
          hint: 'Half the perimeter is one length plus one width.', steps: ['Half of ' + P + ' is ' + P / 2 + '. That is one length and one width.', P / 2 + ' &minus; ' + a + ' = ' + b + '.', 'The other side is ' + b + ' cm.'], explain: P / 2 + ' &minus; ' + a + ' = ' + b + ' cm. Check: ' + a + ' + ' + b + ' + ' + a + ' + ' + b + ' = ' + P + '.' };
      } },
      { id: 'la-area', name: 'Area by counting squares', code: 'E2.9', gen: function (lv) {
        var rows = [], i, n;
        if (lv === 1) { var w = R.int(2, 5), h = R.int(2, 4); for (i = 0; i < h; i++) rows.push([0, w]); }
        else if (lv === 2) { n = R.int(3, 4); var s0 = R.int(3, 5); for (i = 0; i < n; i++) rows.push([0, i < n - 1 || R.int(0, 1) ? s0 : R.int(1, s0 - 1)]); if (rowsArea(rows) === s0 * n) rows[0] = [0, R.int(1, s0 - 1)]; }
        else {
          var a = R.int(2, 6), b = R.int(2, 6);
          if (R.int(0, 1)) return { q: 'A rectangle is ' + a + ' cm by ' + b + ' cm. It is covered with 1 cm squares. What is its area?', type: 'num', answer: a * b, unit: 'cm²',
            hint: 'There are ' + b + ' rows of ' + a + ' squares.', steps: [b + ' rows, each with ' + a + ' squares.', b + ' &times; ' + a + ' = ' + a * b + '.', 'The area is ' + a * b + ' cm&sup2;.'], explain: b + ' &times; ' + a + ' = ' + a * b + ' cm&sup2;.' };
          n = R.int(3, 5); for (i = 0; i < n; i++) { var st, ln, pv = rows[i - 1]; do { st = R.int(0, 2); ln = R.int(1, 5 - st); } while (pv && (st > pv[0] + pv[1] - 1 || st + ln - 1 < pv[0])); rows.push([st, ln]); }
        }
        var ar = rowsArea(rows), lab = rows.map(function (r) { return r[1]; });
        return { q: 'What is the area of this shape? Each square is 1 square unit.', type: 'num', answer: ar, unit: 'square units', fig: shape(rows),
          hint: 'Count row by row, then add.', steps: ['Count each row: ' + lab.join(', ') + '.', lab.join(' + ') + ' = ' + ar + '.', 'The area is ' + ar + ' square units.'], explain: lab.join(' + ') + ' = ' + ar + ' square units.' };
      } },
      { id: 'la-gaps', name: 'Gaps, overlaps and same area', code: 'E2.8', gen: function (lv) {
        var nm = R.pick(['Kim', 'Omar', 'Lia', 'Tom', 'Zara']), thing = R.pick(['sticky notes', 'square tiles', 'playing cards', 'paper squares']), k = lv === 1 ? R.int(0, 1) : lv === 2 ? R.int(0, 2) : R.int(0, 3);
        if (k === 3) {
          var n = R.int(6, 15), o3 = R.mc('They have the same area', ['Shape A', 'Shape B']);
          return { q: 'Shape A is made of ' + n + ' squares in a long row. Shape B is made of the same ' + n + ' squares in an L shape. Which shape has more area?', type: 'mc', options: o3.options, answer: o3.answer,
            hint: 'Count the squares in each shape.', steps: ['Both shapes use ' + n + ' squares.', 'Moving squares changes the shape, not how many there are.', 'They have the same area.'], explain: 'Both cover ' + n + ' squares. Different shapes can have the same area.' };
        }
        var M = [['leaves gaps between the ' + thing, 'too low', 'Gaps leave parts of the shape uncounted.'], ['lets the ' + thing + ' overlap', 'too high', 'Overlaps count some parts twice.'], ['places the ' + thing + ' edge to edge with no gaps and no overlaps', 'just right', 'Every part is covered exactly once.']][k];
        var o = ['too low', 'too high', 'just right'];
        return { q: nm + ' covers a desk with ' + thing + ' and ' + M[0] + '. The count for the area is:', type: 'mc', options: o, answer: o.indexOf(M[1]),
          hint: 'Is every part covered? Is any part covered twice?', steps: ['Look at how the units were placed.', M[2], 'The count is ' + M[1] + '.'], explain: M[2] + ' So the count is ' + M[1] + '.' };
      } }
    ]
  });
})();
