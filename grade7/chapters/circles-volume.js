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

  A.register('circles-volume', {
    html:
'<section class="sec"><h2><span class="n">1</span>Radius, diameter and circumference</h2>' +
'<div class="fig">' + parts() + '</div>' +
'<p>The <b>diameter</b> is 2 radii: <span class="math">d = 2 &times; r</span>. If you roll any circle out flat, its <b>circumference</b> is always a little more than 3 diameters. The exact number is called <b>pi</b> (&#960;), about <b>3.14</b>.</p>' +
'<div class="fig">' + unroll(1.6) + '</div>' +
'<div class="key"><b class="t">Key idea</b><p class="math" style="font-size:1.2rem">C = &#960; &times; d &nbsp;&nbsp; or &nbsp;&nbsp; C = 2 &times; &#960; &times; r</p><p>In this chapter we use &#960; &asymp; 3.14 and round answers to one decimal place.</p></div>' +
'<div class="lab"><span class="lt">Try it: roll out a circle</span>' +
'<div class="ctrl"><label for="ucr">Radius: <output id="ucro"></output><input type="range" id="ucr" min="0.5" max="3" step="0.5" value="1.5"></label></div>' +
'<div class="fig" id="ucfig"></div><div class="out" id="ucout"></div></div>' +
A.yt({ q: 'A bike wheel has a diameter of 60 cm. How far does it roll in one turn? Use &#960; &asymp; 3.14.', answer: 188.4, tol: 0.3, unit: 'cm', hint: 'One turn rolls out one circumference: &#960; &times; d.', explain: '3.14 &times; 60 = 188.4 cm.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Constructing circles</h2>' +
'<p>To draw a circle with a <b>compass</b>, open it to the radius, put the point on the centre, and turn the pencil all the way around.</p>' +
'<div class="fig">' + compass() + '</div>' +
'<ol><li><b>Given the radius</b>: open the compass to that length.</li><li><b>Given the diameter</b>: halve it to get the radius first.</li><li><b>Given the circumference</b>: divide by &#960; to get the diameter, then halve it.</li></ol>' +
'<div class="eg"><b class="t">Worked example</b><p>Draw a circle with a circumference of 25.12 cm. Diameter: 25.12 &divide; 3.14 = 8 cm. Radius: 4 cm. Open the compass to 4 cm.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Opening the compass to the diameter. The compass width is the <b>radius</b>, the distance from the centre to the edge.</p></div>' +
A.yt({ q: 'A circle has a circumference of 31.4 cm. What radius should you set your compass to?', answer: 5, unit: 'cm', hint: 'Diameter = 31.4 &divide; 3.14. Then halve it.', explain: '31.4 &divide; 3.14 = 10 cm across, so the radius is 5 cm.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Area of a circle</h2>' +
'<p>Cut a circle into equal slices and lay them top to bottom. They make a shape that is almost a parallelogram. Its base is half the circumference, &#960;r, and its height is the radius, r.</p>' +
'<div class="lab"><span class="lt">Try it: cut more slices</span>' +
'<div class="ctrl"><label for="slc">Number of slices: <output id="slco"></output><input type="range" id="slc" min="4" max="32" step="2" value="12"></label></div>' +
'<div class="fig" id="slfig"></div><p class="t2" style="margin:0">The more slices, the closer it gets to a perfect parallelogram.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Area of a parallelogram = base &times; height = &#960;r &times; r.</p><p class="math" style="font-size:1.2rem">A = &#960; &times; r &times; r = &#960;r<sup>2</sup></p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A round rug has a diameter of 2 m. Radius: 1 m. Area = 3.14 &times; 1 &times; 1 = <b>3.14 m&sup2;</b>.</p><p>A pizza with radius 15 cm: 3.14 &times; 15 &times; 15 = 3.14 &times; 225 = <b>706.5 cm&sup2;</b>.</p></div>' +
'<div class="vs"><div><b class="t">Circumference</b><p>Distance <b>around</b>. Units: cm, m.</p><p>C = 2&#960;r</p></div><div><b class="t">Area</b><p>Space <b>inside</b>. Units: cm&sup2;, m&sup2;.</p><p>A = &#960;r<sup>2</sup></p></div></div>' +
A.yt({ q: 'Find the area of a circle with radius 10 cm. Use &#960; &asymp; 3.14.', answer: 314, unit: 'cm&sup2;', tol: 0.6, hint: 'r<sup>2</sup> = 10 &times; 10 = 100.', explain: '3.14 &times; 100 = 314 cm&sup2;.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Volume, capacity and metric units</h2>' +
'<p><b>Volume</b> is how much space an object takes up. <b>Capacity</b> is how much a container can hold. They are linked by one fact:</p>' +
'<div class="key"><b class="t">Key idea</b><p class="math" style="font-size:1.2rem">1 cm&sup3; = 1 mL &nbsp;&nbsp;&nbsp; 1000 cm&sup3; = 1 L</p><p>A cube 10 cm on each side holds exactly 1 litre.</p></div>' +
'<div class="fig">' + A.svg(380, 190, A.draw.prism(30, 170, 120, 120, 120, 10, 10, 10, 2) + '<text x="230" y="70" font-size="17" font-weight="700">10 cm &times; 10 cm &times; 10 cm</text><text x="230" y="96" font-size="17">= 1000 cm&sup3;</text><text x="230" y="122" font-size="17" font-weight="700" style="fill:var(--se)">= 1 L</text>', 'A cube 10 cm on each side has a volume of 1000 cubic centimetres, which holds 1 litre.') + '</div>' +
'<p>To convert units, remember how many small units are in one big unit. Area and volume grow faster, because you multiply in 2 or 3 directions.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Length</th><th class="l">Area</th><th class="l">Volume</th></tr></thead><tbody>' +
'<tr><td class="l">1 cm = 10 mm</td><td class="l">1 cm&sup2; = 100 mm&sup2;</td><td class="l">1 cm&sup3; = 1000 mm&sup3;</td></tr>' +
'<tr><td class="l">1 m = 100 cm</td><td class="l">1 m&sup2; = 10 000 cm&sup2;</td><td class="l">1 m&sup3; = 1 000 000 cm&sup3;</td></tr>' +
'<tr><td class="l">1 km = 1000 m</td><td class="l">1 km&sup2; = 1 000 000 m&sup2;</td><td class="l">1 m&sup3; = 1000 L</td></tr></tbody></table></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>1 m&sup2; is not 100 cm&sup2;. A square 1 m on each side is 100 cm by 100 cm, which is 10 000 cm&sup2;.</p></div>' +
A.yt({ q: 'A fish tank is 50 cm long, 30 cm wide and 40 cm high. How many litres does it hold?', answer: 60, unit: 'L', hint: 'Volume in cm&sup3;, then divide by 1000.', explain: '50 &times; 30 &times; 40 = 60 000 cm&sup3; = 60 000 mL = 60 L.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Volume of prisms and cylinders</h2>' +
'<p>A prism or cylinder is the same shape all the way up. Picture the base as one thin layer. Stack layers until you reach the height.</p>' +
'<div class="key"><b class="t">Key idea</b><p class="math" style="font-size:1.2rem">Volume = area of the base &times; height</p><p>Cylinder: V = &#960;r<sup>2</sup> &times; h. Rectangular prism: V = l &times; w &times; h. Triangular prism: V = (b &times; h<sub>triangle</sub> &divide; 2) &times; length.</p></div>' +
'<div class="lab"><span class="lt">Try it: fill a can</span>' +
'<div class="ctrl"><label for="vcr">Radius (cm): <output id="vcro"></output><input type="range" id="vcr" min="1" max="8" value="4"></label><label for="vch">Height (cm): <output id="vcho"></output><input type="range" id="vch" min="1" max="20" value="10"></label></div>' +
'<div class="row2"><div class="fig" id="vcfig"></div><div class="out" id="vcout"></div></div></div>' +
'<div class="eg"><b class="t">Worked example: working backwards</b><p>A cereal box has a volume of 3600 cm&sup3; and a base area of 150 cm&sup2;. How tall is it?</p><p>Volume = base &times; height, so height = volume &divide; base = 3600 &divide; 150 = <b>24 cm</b>.</p></div>' +
A.yt({ q: 'A cylinder has a base area of 50 cm&sup2; and a height of 12 cm. What is its volume?', answer: 600, unit: 'cm&sup3;', hint: 'Base area &times; height.', explain: '50 &times; 12 = 600 cm&sup3;.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Surface area of a cylinder</h2>' +
'<p><b>Surface area</b> is the total area of all the outside surfaces, like the paper needed to wrap it. Open a cylinder out into a <b>net</b>: two circles and a rectangle. The rectangle wraps all the way around, so its length is the circumference.</p>' +
'<div class="key"><b class="t">Key idea</b><p class="math">SA = 2 circles + rectangle = 2 &times; &#960;r<sup>2</sup> + (2&#960;r) &times; h</p></div>' +
'<div class="lab"><span class="lt">Try it: open the can</span>' +
'<div class="ctrl"><label for="sar">Radius (cm): <output id="saro"></output><input type="range" id="sar" min="1" max="10" value="3"></label><label for="sah">Height (cm): <output id="saho"></output><input type="range" id="sah" min="1" max="20" value="10"></label></div>' +
'<div class="fig" id="safig"></div><div class="out" id="saout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A can has radius 4 cm and height 10 cm.</p><p>Two circles: 2 &times; 3.14 &times; 16 = 100.48 cm&sup2;. Rectangle: (2 &times; 3.14 &times; 4) &times; 10 = 25.12 &times; 10 = 251.2 cm&sup2;. Total: <b>351.68 cm&sup2;</b>, about 351.7 cm&sup2;.</p></div>' +
A.yt({ q: 'A label covers only the curved side of a can with radius 5 cm and height 12 cm. What is the area of the label?', answer: 376.8, tol: 0.8, unit: 'cm&sup2;', hint: 'The label is the rectangle: circumference &times; height.', explain: 'C = 2 &times; 3.14 &times; 5 = 31.4 cm. 31.4 &times; 12 = 376.8 cm&sup2;.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.bind(root, ['ucr'], function () {
        var r = +$('#ucr', root).value, d = 2 * r, C = PI * d;
        $('#ucro', root).textContent = r + ' cm';
        $('#ucfig', root).innerHTML = unroll(r);
        $('#ucout', root).innerHTML = '<p>Radius ' + r + ' cm, so diameter ' + d + ' cm.</p><p class="big2">C = 3.14 &times; ' + d + ' = ' + r2(C) + ' cm</p><p>Three diameters make ' + 3 * d + ' cm. The circumference is ' + r2(C - 3 * d) + ' cm more.</p>';
      });
      A.bind(root, ['slc'], function () { var n = +$('#slc', root).value; $('#slco', root).textContent = n; $('#slfig', root).innerHTML = slices(n); });
      A.bind(root, ['vcr', 'vch'], function () {
        var r = +$('#vcr', root).value, h = +$('#vch', root).value, B = PI * r * r, V = B * h;
        $('#vcro', root).textContent = r; $('#vcho', root).textContent = h;
        $('#vcfig', root).innerHTML = stack('cyl', r, 0, h);
        $('#vcout', root).innerHTML = '<p>Base area = 3.14 &times; ' + r + ' &times; ' + r + ' = ' + r2(B) + ' cm&sup2;</p><p class="big2">V = ' + r2(B) + ' &times; ' + h + ' = ' + dec(r2(V)) + ' cm&sup3;</p><p>That holds about ' + dec(Math.round(V)) + ' mL, or ' + r2(V / 1000) + ' L.</p>';
      });
      A.bind(root, ['sar', 'sah'], function () {
        var r = +$('#sar', root).value, h = +$('#sah', root).value, circ = PI * r * r, C = 2 * PI * r, rect = C * h, SA = 2 * circ + rect;
        $('#saro', root).textContent = r; $('#saho', root).textContent = h;
        $('#safig', root).innerHTML = net(r, h);
        $('#saout', root).innerHTML = '<div class="tbl"><table><tbody><tr><td class="l">Two circles</td><td class="l">2 &times; 3.14 &times; ' + r + '<sup>2</sup> = ' + r2(2 * circ) + ' cm&sup2;</td></tr><tr><td class="l">Rectangle</td><td class="l">' + r2(C) + ' &times; ' + h + ' = ' + r2(rect) + ' cm&sup2;</td></tr><tr><td class="l"><b>Total</b></td><td class="l"><b>' + dec(r2(SA)) + ' cm&sup2;</b></td></tr></tbody></table></div>';
      });
    },

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
