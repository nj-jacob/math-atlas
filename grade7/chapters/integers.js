(function () {
  var A = Atlas, R = A.R, cl = A.clean, fr = A.fr;
  function sg(n) { return n < 0 ? '&minus;' + (-n) : String(n); }
  function sgp(n) { return n < 0 ? '(&minus;' + (-n) + ')' : String(n); }
  function dec(x) { x = cl(x); return x < 0 ? '&minus;' + (-x) : String(x); }

  /* a thermometer from -30 to 30 with the temperature t */
  function thermo(t, t2) {
    var s = '', y = function (v) { return 230 - (v + 30) * 3.5; };
    s += '<rect x="70" y="' + (y(30) - 6) + '" width="26" height="' + (y(-30) - y(30) + 12) + '" rx="13" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    s += '<circle cx="83" cy="' + (y(-30) + 22) + '" r="20" style="fill:' + (t < 0 ? 'var(--sc)' : 'var(--bad)') + ';stroke:var(--ink)" stroke-width="2"/>';
    s += '<rect x="76" y="' + y(t) + '" width="14" height="' + (y(-30) - y(t) + 10) + '" style="fill:' + (t < 0 ? 'var(--sc)' : 'var(--bad)') + '"/>';
    for (var v = -30; v <= 30; v += 5) {
      s += '<line x1="96" y1="' + y(v) + '" x2="' + (v % 10 ? 104 : 110) + '" y2="' + y(v) + '" style="stroke:var(--ink)" stroke-width="' + (v ? 1.5 : 3) + '"/>';
      if (v % 10 === 0) s += '<text x="116" y="' + (y(v) + 6) + '" font-size="17"' + (v ? '' : ' font-weight="700"') + '>' + sg(v) + '</text>';
    }
    s += '<line x1="40" y1="' + y(0) + '" x2="150" y2="' + y(0) + '" style="stroke:var(--ink2)" stroke-dasharray="4 4"/><text x="152" y="' + (y(0) + 5) + '" font-size="15" class="t2">freezing</text>';
    s += '<text x="64" y="' + (y(t) + 6) + '" text-anchor="end" font-size="20" font-weight="700" style="fill:' + (t < 0 ? 'var(--sc)' : 'var(--bad)') + '">' + sg(t) + '&deg;C</text>';
    if (t2 !== undefined) s += '<circle cx="83" cy="' + y(t2) + '" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="64" y="' + (y(t2) + 6) + '" text-anchor="end" font-size="18" font-weight="700">' + sg(t2) + '&deg;C</text>';
    return A.svg(230, 280, s, 'Thermometer showing ' + sg(t).replace('&minus;', 'minus ') + ' degrees Celsius');
  }
  /* integer number line from a to b with marked points and optional arrows [{from, to, col}] */
  function iline(a, b, marks, arrows, alt) {
    var W = 540, x0 = 24, x1 = W - 24, n = b - a, s = '', sc = function (v) { return x0 + (x1 - x0) * (v - a) / n; }, top = 26 + (arrows ? arrows.length * 28 : 0);
    s += '<line x1="' + x0 + '" y1="' + top + '" x2="' + x1 + '" y2="' + top + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    var every = n <= 20 ? 1 : n <= 40 ? 2 : 5;
    for (var v = a; v <= b; v++) {
      var x = sc(v);
      s += '<line x1="' + x + '" y1="' + (top - (v ? 6 : 10)) + '" x2="' + x + '" y2="' + (top + (v ? 6 : 10)) + '" style="stroke:var(--ink)" stroke-width="' + (v ? 1.5 : 3) + '"/>';
      if (v % every === 0) s += '<text x="' + x + '" y="' + (top + 28) + '" text-anchor="middle" font-size="' + (n <= 20 ? 16 : 15) + '"' + (v ? '' : ' font-weight="700"') + ' style="fill:' + (v < 0 ? 'var(--sc)' : v > 0 ? 'var(--bad)' : 'var(--ink)') + '">' + sg(v) + '</text>';
    }
    (arrows || []).forEach(function (ar, i) {
      var y = top - 22 - i * 28, xa = sc(ar.from), xb = sc(ar.to);
      s += '<line x1="' + xa + '" y1="' + y + '" x2="' + xb + '" y2="' + y + '" style="stroke:' + ar.col + '" stroke-width="4" marker-end="url(#' + ar.id + ')"/>' +
        '<defs><marker id="' + ar.id + '" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:' + ar.col + '"/></marker></defs>';
      if (ar.lab) s += '<text x="' + (xa + xb) / 2 + '" y="' + (y - 7) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:' + ar.col + '">' + ar.lab + '</text>';
    });
    (marks || []).forEach(function (m) {
      s += '<circle cx="' + sc(m.v) + '" cy="' + top + '" r="8" style="fill:' + (m.col || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      if (m.lab) s += '<text x="' + sc(m.v) + '" y="' + (top + 52) + '" text-anchor="middle" font-size="17" font-weight="700">' + m.lab + '</text>';
    });
    var hasLab = (marks || []).some(function (m) { return m.lab; });
    return A.svg(W, top + (hasLab ? 60 : 38), s, alt || 'Number line from ' + a + ' to ' + b);
  }
  /* positive (yellow) and negative (red) chips; zero pairs are boxed */
  function chips(a, b, alt) {
    var pos = Math.max(a, 0) + Math.max(b, 0), neg = Math.max(-a, 0) + Math.max(-b, 0), pairs = Math.min(pos, neg), s = '', r = 15, gap = 36;
    var cols = Math.max(pos, neg, 1);
    function chip(x, y, p, faded) {
      return '<g' + (faded ? ' opacity=".35"' : '') + '><circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + (p ? 'var(--hi)' : 'var(--bad)') + ';stroke:var(--ink)" stroke-width="1.5"/>' +
        '<text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" font-size="22" font-weight="700" style="fill:' + (p ? '#24201d' : '#fff') + '">' + (p ? '+' : '&minus;') + '</text></g>';
    }
    for (var i = 0; i < pos; i++) s += chip(24 + i * gap, 26, true, i < pairs);
    for (var j = 0; j < neg; j++) s += chip(24 + j * gap, 70, false, j < pairs);
    if (pairs) s += '<rect x="4" y="6" width="' + (pairs * gap + 4) + '" height="86" rx="8" fill="none" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="5 4"/>' +
      '<text x="' + (4 + pairs * gap / 2) + '" y="114" text-anchor="middle" font-size="16" class="t2">' + pairs + ' zero pair' + (pairs > 1 ? 's' : '') + '</text>';
    return A.svg(Math.max(200, cols * gap + 16), pairs ? 122 : 98, s, alt || pos + ' positive chips and ' + neg + ' negative chips. ' + pairs + ' zero pairs cancel.');
  }
  /* a pattern as dots on a vertical scale */
  function patt(terms) {
    var lo = Math.min(0, Math.min.apply(null, terms)), hi = Math.max(0, Math.max.apply(null, terms)), H = 200, s = '', W = Math.max(300, terms.length * 60 + 60);
    if (hi === lo) hi = lo + 1;
    var y = function (v) { return 14 + H * (hi - v) / (hi - lo); };
    s += '<line x1="40" y1="' + y(0) + '" x2="' + (W - 10) + '" y2="' + y(0) + '" style="stroke:var(--ink)" stroke-width="2"/><text x="34" y="' + (y(0) + 5) + '" text-anchor="end" font-size="16" font-weight="700">0</text>';
    terms.forEach(function (t, i) {
      var x = 70 + i * 60;
      s += '<line x1="' + x + '" y1="' + y(0) + '" x2="' + x + '" y2="' + y(t) + '" style="stroke:' + (t < 0 ? 'var(--sc)' : 'var(--bad)') + '" stroke-width="10"/>' +
        '<circle cx="' + x + '" cy="' + y(t) + '" r="6" style="fill:var(--ink)"/>' +
        '<text x="' + x + '" y="' + (t < 0 ? y(t) + 24 : y(t) - 10) + '" text-anchor="middle" font-size="17" font-weight="700">' + sg(t) + '</text>';
    });
    return A.svg(W, H + 40, s, 'Pattern: ' + terms.join(', '));
  }

  A.register('integers', {
    html:
'<section class="sec"><h2><span class="n">1</span>Numbers below zero</h2>' +
'<p><b>Integers</b> are the whole numbers, their <b>opposites</b>, and zero: ..., &minus;3, &minus;2, &minus;1, 0, 1, 2, 3, ... Negative numbers are below zero. You see them on a thermometer in a Canadian winter.</p>' +
'<div class="row2"><div class="fig">' + thermo(-12) + '</div><div><div class="facts" style="grid-template-columns:1fr">' +
'<div><b>&minus;12&deg;C</b><small>a cold January day in Ottawa</small></div><div><b>&minus;86 m</b><small>below sea level, the lowest point in North America</small></div><div><b>&minus;$20</b><small>you owe $20</small></div></div></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Two numbers the same distance from zero, on opposite sides, are <b>opposites</b>. The opposite of 7 is &minus;7. The opposite of &minus;7 is 7. A number and its opposite add to 0.</p></div>' +
'<div class="lab"><span class="lt">Try it: move the temperature</span>' +
'<div class="ctrl"><label for="thr">Temperature: <output id="tho"></output><input type="range" id="thr" min="-30" max="30" value="-8"></label></div>' +
'<div class="row2"><div class="fig" id="thfig"></div><div class="out" id="thout"></div></div></div>' +
A.yt({ q: 'What is the opposite of &minus;15?', answer: 15, kb: 'text', hint: 'Same distance from zero, other side.', explain: '&minus;15 is 15 below zero. Its opposite is 15 above zero: 15.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Comparing and ordering</h2>' +
'<p>On a number line, numbers get <b>bigger to the right</b> and smaller to the left. So &minus;8 is less than &minus;3, even though 8 is more than 3.</p>' +
'<div class="fig">' + iline(-10, 5, [{ v: -8, lab: '&minus;8', col: 'var(--sc)' }, { v: -3, lab: '&minus;3', col: 'var(--bad)' }]) + '</div>' +
'<div class="vs"><div><b class="t">Positive numbers</b><p>8 &gt; 3</p><p>Further from zero means bigger.</p></div><div><b class="t">Negative numbers</b><p>&minus;8 &lt; &minus;3</p><p>Further from zero means <b>smaller</b>. &minus;8&deg;C is colder.</p></div></div>' +
'<p>This works for negative fractions and decimals too. These are all <b>rational numbers</b>: &minus;2.5 is halfway between &minus;3 and &minus;2. &minus;' + fr(3, 4) + ' is between &minus;1 and 0.</p>' +
'<div class="lab"><span class="lt">Try it: put numbers in order</span>' +
'<div class="ctrl"><label for="ordn">Type numbers separated by commas<input type="text" id="ordn" value="-2.5, 1/2, -3/4, 1.2, -1" style="width:16em"></label></div>' +
'<div class="fig" id="ordfig"></div><div class="out" id="ordout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Order from least to greatest: 0.4, &minus;1.2, &minus;' + fr(1, 2) + ', &minus;2. On the line from left to right: <b>&minus;2, &minus;1.2, &minus;' + fr(1, 2) + ', 0.4</b>.</p></div>' +
A.yt({ q: 'Which is greater?', type: 'mc', options: ['&minus;4.5', '&minus;4.05', 'They are equal'], answer: 1, hint: 'Which one is closer to zero?', explain: '&minus;4.05 is closer to zero, so it is further right on the line. &minus;4.05 &gt; &minus;4.5.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Adding integers with chips</h2>' +
'<p>Use yellow chips for +1 and red chips for &minus;1. A yellow and a red together make a <b>zero pair</b>, because 1 + (&minus;1) = 0. Remove the zero pairs. What is left is the answer.</p>' +
'<div class="eg"><b class="t">Worked example</b><p class="math">5 + (&minus;3)</p><div class="fig">' + chips(5, -3) + '</div><p>Three zero pairs cancel. Two yellow chips are left: 5 + (&minus;3) = <b>2</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: add with chips</span>' +
'<div class="ctrl"><label for="cha">First: <output id="chao"></output><input type="range" id="cha" min="-10" max="10" value="-6"></label><label for="chb">Second: <output id="chbo"></output><input type="range" id="chb" min="-10" max="10" value="4"></label></div>' +
'<div class="fig" id="chfig"></div><div class="out" id="chout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p><b>Same signs:</b> add the sizes and keep the sign. &minus;4 + (&minus;3) = &minus;7.<br><b>Different signs:</b> subtract the sizes, and keep the sign of the bigger size. &minus;6 + 4 = &minus;2.</p></div>' +
A.yt({ q: 'Add: &minus;7 + 3', answer: -4, kb: 'text', hint: 'Three zero pairs cancel. What colour is left, and how many?', explain: '3 zero pairs cancel and 4 red chips are left: &minus;4.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Subtracting integers</h2>' +
'<p>On a number line, adding a positive moves <b>right</b>, and adding a negative moves <b>left</b>. Subtracting does the <b>opposite</b>.</p>' +
'<div class="key"><b class="t">Key idea: subtracting is adding the opposite</b><p class="math" style="font-size:1.2rem">3 &minus; 5 = 3 + (&minus;5) = &minus;2 &nbsp;&nbsp;&nbsp; 3 &minus; (&minus;5) = 3 + 5 = 8</p></div>' +
'<div class="fig">' + iline(-4, 9, [{ v: 3, col: 'var(--hi)' }, { v: 8, lab: '8', col: 'var(--bad)' }], [{ from: 3, to: 8, col: 'var(--sd)', id: 'ia1', lab: '&minus; (&minus;5) is + 5' }], 'Start at 3. Subtracting negative 5 is adding 5, so move 5 right to 8.') + '</div>' +
'<p>Subtraction also finds the <b>difference</b>, or distance, between two numbers. From &minus;12&deg;C at night to 4&deg;C at noon, the temperature rose 4 &minus; (&minus;12) = 16 degrees.</p>' +
'<div class="lab"><span class="lt">Try it: move along the line</span>' +
'<div class="ctrl"><label for="sba">Start: <output id="sbao"></output><input type="range" id="sba" min="-10" max="10" value="-2"></label><label for="sbop">Operation<select id="sbop"><option value="1">add (+)</option><option value="-1" selected>subtract (&minus;)</option></select></label>' +
'<label for="sbb">Number: <output id="sbbo"></output><input type="range" id="sbb" min="-10" max="10" value="-6"></label></div>' +
'<div class="fig" id="sbfig"></div><div class="out" id="sbout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Two negative signs side by side do not cancel when adding. &minus;3 + (&minus;5) = &minus;8. They only turn into a plus when you <b>subtract</b> a negative: &minus;3 &minus; (&minus;5) = &minus;3 + 5 = 2.</p></div>' +
A.yt({ q: 'Subtract: &minus;4 &minus; (&minus;9)', answer: 5, kb: 'text', hint: 'Change it to adding the opposite: &minus;4 + 9.', explain: '&minus;4 &minus; (&minus;9) = &minus;4 + 9 = 5.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Integer patterns</h2>' +
'<p>A pattern can go below zero. Start at 7 and keep adding &minus;3: 7, 4, 1, &minus;2, &minus;5, ... Each term is 3 less than the one before.</p>' +
'<div class="fig">' + patt([7, 4, 1, -2, -5, -8]) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>A diver starts at the surface (0 m) and goes down 4 m every minute. Depths: 0, &minus;4, &minus;8, &minus;12, ... After 6 minutes she is at 6 &times; (&minus;4) = <b>&minus;24 m</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: build a pattern</span>' +
'<div class="ctrl"><label for="pta">Start: <output id="ptao"></output><input type="range" id="pta" min="-10" max="10" value="5"></label><label for="ptd">Add each time: <output id="ptdo"></output><input type="range" id="ptd" min="-5" max="5" value="-2"></label></div>' +
'<div class="fig" id="ptfig"></div><div class="out" id="ptout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Integer patterns help you check rules. Look down this list: 3 &minus; 1 = 2, 3 &minus; 0 = 3, 3 &minus; (&minus;1) = 4, 3 &minus; (&minus;2) = 5. As the number subtracted goes down by 1, the answer goes <b>up</b> by 1. That is why subtracting a negative makes the answer bigger.</p></div>' +
A.yt({ q: 'What comes next? 10, 6, 2, &minus;2, ...', answer: -6, kb: 'text', hint: 'How much does it change each time?', explain: 'Each term is 4 less: &minus;2 &minus; 4 = &minus;6.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.bind(root, ['thr'], function () {
        var t = +$('#thr', root).value;
        $('#tho', root).innerHTML = sg(t) + '&deg;C';
        $('#thfig', root).innerHTML = thermo(t, -t !== t ? -t : undefined);
        $('#thout', root).innerHTML = '<p class="big2">' + sg(t) + '&deg;C</p><p>' + (t < 0 ? (-t) + ' degrees <b>below</b> zero.' : t > 0 ? t + ' degrees <b>above</b> zero.' : 'Water freezes at 0&deg;C.') + '</p>' +
          (t ? '<p>Its opposite is <b>' + sg(-t) + '&deg;C</b> (the yellow dot). ' + sg(t) + ' + ' + sgp(-t) + ' = 0.</p>' : '');
      });
      A.bind(root, ['ordn'], function () {
        var raw = $('#ordn', root).value.split(','), vals = [];
        raw.forEach(function (r) { r = r.trim(); if (!r) return; var v = A.parseNum(r); if (!isNaN(v) && Math.abs(v) <= 20) vals.push({ v: v, t: r.replace(/^-/, '&minus;').replace(/−/, '&minus;') }); });
        if (!vals.length) { $('#ordfig', root).innerHTML = ''; $('#ordout', root).innerHTML = '<p>Type numbers between &minus;20 and 20.</p>'; return; }
        vals.sort(function (a, b) { return a.v - b.v; });
        var lo = Math.min(-1, Math.floor(vals[0].v) - 1), hi = Math.max(1, Math.ceil(vals[vals.length - 1].v) + 1);
        var W = 540, sc = function (v) { return 24 + 492 * (v - lo) / (hi - lo); }, s = '';
        s += '<line x1="24" y1="30" x2="516" y2="30" style="stroke:var(--ink)" stroke-width="2.5"/>';
        for (var v = lo; v <= hi; v++) if ((hi - lo) <= 20 || v % 2 === 0) s += '<line x1="' + sc(v) + '" y1="22" x2="' + sc(v) + '" y2="38" style="stroke:var(--ink)" stroke-width="' + (v ? 1.5 : 3) + '"/><text x="' + sc(v) + '" y="58" text-anchor="middle" font-size="15">' + sg(v) + '</text>';
        vals.forEach(function (o, i) { s += '<circle cx="' + sc(o.v) + '" cy="30" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + sc(o.v) + '" y="' + (84 + (i % 2) * 22) + '" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--se)">' + o.t + '</text>'; });
        $('#ordfig', root).innerHTML = A.svg(W, 114, s, 'Numbers on a line: ' + vals.map(function (o) { return o.t; }).join(', '));
        $('#ordout', root).innerHTML = '<p><b>Least to greatest:</b> ' + vals.map(function (o) { return o.t; }).join(', ') + '</p>';
      });
      A.bind(root, ['cha', 'chb'], function () {
        var a = +$('#cha', root).value, b = +$('#chb', root).value, s = a + b;
        $('#chao', root).innerHTML = sg(a); $('#chbo', root).innerHTML = sg(b);
        $('#chfig', root).innerHTML = chips(a, b);
        $('#chout', root).innerHTML = '<p class="big2">' + sg(a) + ' + ' + sgp(b) + ' = ' + sg(s) + '</p><p>' + (s === 0 ? 'Every chip is in a zero pair. Nothing is left.' : 'After removing zero pairs, ' + Math.abs(s) + ' ' + (s > 0 ? 'yellow' : 'red') + ' chip' + (Math.abs(s) > 1 ? 's are' : ' is') + ' left.') + '</p>';
      });
      A.bind(root, ['sba', 'sbop', 'sbb'], function () {
        var a = +$('#sba', root).value, op = +$('#sbop', root).value, b = +$('#sbb', root).value, mv = op * b, res = a + mv;
        $('#sbao', root).innerHTML = sg(a); $('#sbbo', root).innerHTML = sg(b);
        $('#sbfig', root).innerHTML = iline(-20, 20, [{ v: a, col: 'var(--hi)' }, { v: res, lab: sg(res), col: 'var(--se)' }], mv ? [{ from: a, to: res, col: mv > 0 ? 'var(--sd)' : 'var(--sc)', id: 'ia2', lab: (mv > 0 ? 'right ' : 'left ') + Math.abs(mv) }] : []);
        $('#sbout', root).innerHTML = '<p class="big2">' + sg(a) + (op > 0 ? ' + ' : ' &minus; ') + sgp(b) + (op < 0 ? ' = ' + sg(a) + ' + ' + sgp(-b) : '') + ' = ' + sg(res) + '</p>' +
          '<p>' + (mv === 0 ? 'Adding or subtracting 0 does not move you.' : (op < 0 ? 'Subtracting ' + sg(b) + ' is the same as adding ' + sg(-b) + '. ' : '') + 'Move ' + Math.abs(mv) + ' to the ' + (mv > 0 ? 'right' : 'left') + '.') + '</p>';
      });
      A.bind(root, ['pta', 'ptd'], function () {
        var a = +$('#pta', root).value, d = +$('#ptd', root).value, t = [];
        $('#ptao', root).innerHTML = sg(a); $('#ptdo', root).innerHTML = sg(d);
        for (var i = 0; i < 7; i++) t.push(a + i * d);
        $('#ptfig', root).innerHTML = patt(t);
        $('#ptout', root).innerHTML = '<p><b>Terms:</b> ' + t.map(sg).join(', ') + ', ...</p><p><b>Rule:</b> start at ' + sg(a) + ' and add ' + sgp(d) + ' each time. Term 10 is ' + sg(a) + ' + 9 &times; ' + sgp(d) + ' = ' + sg(a + 9 * d) + '.</p>';
      });
    },

    quiz: [
      { q: 'The temperature is &minus;6&deg;C. Which temperature is colder?', type: 'mc', options: ['&minus;2&deg;C', '0&deg;C', '&minus;9&deg;C', '3&deg;C'], answer: 2, hint: 'Colder means further below zero, further left on the line.', explain: '&minus;9 is further below zero than &minus;6, so &minus;9&deg;C is colder.' },
      { q: 'Which list is in order from least to greatest?', type: 'mc', options: ['&minus;0.5, &minus;1.5, 1, &minus;2', '&minus;2, &minus;1.5, &minus;0.5, 1', '&minus;0.5, 1, &minus;1.5, &minus;2', '1, &minus;0.5, &minus;1.5, &minus;2'], answer: 1, hint: 'Least is furthest left on a number line.', explain: 'From left to right: &minus;2, &minus;1.5, &minus;0.5, 1.' },
      { q: 'Add: &minus;8 + 5', type: 'num', answer: -3, kb: 'text', fig: chips(-8, 5), hint: 'Five zero pairs cancel. What is left?', explain: '5 zero pairs cancel and 3 red chips are left: &minus;3.' },
      { q: 'Add: &minus;6 + (&minus;7)', type: 'num', answer: -13, kb: 'text', hint: 'Same signs: add the sizes and keep the sign.', explain: '6 + 7 = 13, and both are negative: &minus;13.' },
      { q: 'Subtract: 2 &minus; (&minus;9)', type: 'num', answer: 11, kb: 'text', hint: 'Subtracting a negative is adding the opposite.', explain: '2 &minus; (&minus;9) = 2 + 9 = 11.' },
      { q: 'At 6 a.m. it was &minus;14&deg;C. By noon it was 3&deg;C. How many degrees did the temperature rise?', type: 'num', answer: 17, unit: '&deg;C', hint: 'Find the distance from &minus;14 to 3: 3 &minus; (&minus;14).', explain: '14 degrees up to zero, then 3 more: 3 &minus; (&minus;14) = 17 degrees.' },
      { q: 'What is the 8th term of the pattern 9, 6, 3, 0, &minus;3, ...?', type: 'num', answer: -12, kb: 'text', hint: 'Each term is 3 less. Keep going to the 8th term.', explain: '9, 6, 3, 0, &minus;3, &minus;6, &minus;9, &minus;12. Or 9 + 7 &times; (&minus;3) = &minus;12.' }
    ],

    practice: [
      { id: 'in-compare', name: 'Compare and order', code: 'B1.3', gen: function (lv) {
        if (lv === 3) {
          var pool = [], seen = {};
          while (pool.length < 4) {
            var t = R.int(0, 2), v, s;
            if (t === 0) { v = R.int(-9, 9); s = sg(v); }
            else if (t === 1) { v = cl(R.int(-49, 49) / 10); s = dec(v); }
            else { var d = R.pick([2, 4, 5]), n = R.int(-2 * d, 2 * d); if (n % d === 0) n++; v = n / d; s = (n < 0 ? '&minus;' : '') + fr(Math.abs(n), d); }
            if (!seen[v]) { seen[v] = 1; pool.push({ v: v, s: s }); }
          }
          var sorted = pool.slice().sort(function (a, b) { return a.v - b.v; }), show = function (l) { return l.map(function (o) { return o.s; }).join(', '); };
          var wrong = [show(sorted.slice().reverse()), show(sorted.slice().sort(function (a, b) { return Math.abs(a.v) - Math.abs(b.v); })), show(R.shuffle(sorted))];
          var o = R.mc(show(sorted), wrong);
          return { q: 'Which list is in order from least to greatest?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Picture a number line. Negatives further from zero are smaller.',
            steps: ['Negatives come first, starting with the one furthest from zero.', 'Write each as a decimal if it helps: ' + pool.map(function (o) { return o.s + ' = ' + dec(o.v); }).join(', ') + '.', 'Least to greatest: ' + show(sorted) + '.'],
            explain: show(sorted) + '.' };
        }
        var a, b;
        do { a = lv === 1 ? R.int(-10, 10) : cl(R.int(-99, 99) / 10); b = lv === 1 ? R.int(-10, 10) : (R.int(0, 1) ? cl(-a + R.pick([-0.5, 0.5, 0])) : cl(R.int(-99, 99) / 10)); } while (a === b || (lv === 1 && a >= 0 && b >= 0));
        var big = Math.max(a, b), o2 = R.mc(dec(big), [dec(Math.min(a, b)), 'They are equal']);
        return { q: 'Which is greater?', type: 'mc', options: o2.options, answer: o2.answer, fig: lv === 1 ? iline(-10, 10, [{ v: a, col: 'var(--sb)' }, { v: b, col: 'var(--se)' }]) : '',
          hint: 'The number further right on a number line is greater.',
          steps: ['Place both on a number line.', dec(big) + ' is further to the right.', 'So ' + dec(big) + ' &gt; ' + dec(Math.min(a, b)) + '.'],
          explain: dec(big) + ' is greater than ' + dec(Math.min(a, b)) + '.' };
      } },
      { id: 'in-add', name: 'Add integers', code: 'B2.4', gen: function (lv) {
        var a = R.int(-9, 9), b = R.int(-9, 9);
        if (lv === 1) { a = R.int(1, 9) * (R.int(0, 1) ? 1 : -1); b = -Math.sign(a) * R.int(1, 9); }
        if (lv === 3) { a = R.int(-60, 60); b = R.int(-60, 60); }
        if (!a) a = -4; if (!b) b = 7;
        var s = a + b, same = a * b > 0;
        return { q: 'Add: ' + sg(a) + ' + ' + sgp(b), type: 'num', answer: s, kb: 'text', fig: lv === 1 ? chips(a, b) : '',
          hint: same ? 'Same signs: add the sizes and keep the sign.' : 'Different signs: subtract the sizes and keep the sign of the bigger size.',
          steps: same ? ['Both are ' + (a > 0 ? 'positive' : 'negative') + '.', 'Add the sizes: ' + Math.abs(a) + ' + ' + Math.abs(b) + ' = ' + Math.abs(s) + '.', 'Keep the sign: ' + sg(s) + '.']
            : ['The signs are different. ' + Math.min(Math.abs(a), Math.abs(b)) + ' zero pairs cancel.', 'Subtract the sizes: ' + Math.max(Math.abs(a), Math.abs(b)) + ' &minus; ' + Math.min(Math.abs(a), Math.abs(b)) + ' = ' + Math.abs(s) + '.', s === 0 ? 'Nothing is left: 0.' : 'The bigger size is ' + (Math.abs(a) > Math.abs(b) ? sg(a) : sg(b)) + ', so the answer is ' + sg(s) + '.'],
          explain: sg(a) + ' + ' + sgp(b) + ' = ' + sg(s) + '.' };
      } },
      { id: 'in-sub', name: 'Subtract integers', code: 'B2.4', gen: function (lv) {
        var a = R.int(-9, 9), b = R.int(-9, -1);
        if (lv === 1) { a = R.int(0, 9); b = R.int(a + 1, 15); }
        if (lv === 3) { a = R.int(-40, 40); b = R.int(-40, 40); if (!b) b = -13; }
        var r = a - b;
        return { q: 'Subtract: ' + sg(a) + ' &minus; ' + sgp(b), type: 'num', answer: r, kb: 'text',
          fig: lv < 3 ? iline(Math.min(a, r, 0) - 1, Math.max(a, r, 0) + 1, [{ v: a, col: 'var(--hi)' }]) : '',
          hint: 'Change it to adding the opposite: ' + sg(a) + ' + ' + sgp(-b) + '.',
          steps: ['Subtracting ' + sg(b) + ' is the same as adding ' + sg(-b) + '.', sg(a) + ' &minus; ' + sgp(b) + ' = ' + sg(a) + ' + ' + sgp(-b) + '.', 'Add: ' + sg(r) + '.'],
          explain: sg(a) + ' &minus; ' + sgp(b) + ' = ' + sg(r) + '.' };
      } },
      { id: 'in-word', name: 'Integers in real life', code: 'B2.4', gen: function (lv) {
        var t = R.int(0, 2);
        if (t === 0) {
          var lo = -R.int(lv === 1 ? 2 : 5, lv === 3 ? 30 : 15), hi = R.int(lv === 1 ? 1 : -4, 12);
          if (hi <= lo) hi = lo + R.int(3, 10);
          return { q: 'Overnight it was ' + sg(lo) + '&deg;C. In the afternoon it was ' + sg(hi) + '&deg;C. How many degrees did it warm up?', type: 'num', answer: hi - lo, unit: '&deg;C',
            fig: lv === 1 ? thermo(hi, lo) : '', hint: 'Find the difference: ' + sg(hi) + ' &minus; ' + sgp(lo) + '.',
            steps: ['Rise = later &minus; earlier = ' + sg(hi) + ' &minus; ' + sgp(lo) + '.', 'Subtracting a negative is adding: ' + sg(hi) + ' + ' + (-lo) + '.', '= ' + (hi - lo) + ' degrees.'],
            explain: 'It warmed up ' + (hi - lo) + ' degrees.' };
        }
        if (t === 1) {
          var bal = R.int(-30, 40), sp = R.int(10, 60), dep = lv > 1 ? R.int(5, 30) : 0;
          var end = bal - sp + dep;
          return { q: 'Sam\'s balance is ' + (bal < 0 ? '&minus;$' + (-bal) : '$' + bal) + '. He spends $' + sp + (dep ? ' and then earns $' + dep : '') + '. What is his balance now? (Use a negative number if he owes money.)', type: 'num', answer: end, kb: 'text',
            hint: 'Spending is subtracting. Earning is adding.',
            steps: ['Start: ' + sg(bal) + '.', 'Spend $' + sp + ': ' + sg(bal) + ' &minus; ' + sp + ' = ' + sg(bal - sp) + '.', dep ? 'Earn $' + dep + ': ' + sg(bal - sp) + ' + ' + dep + ' = ' + sg(end) + '.' : 'Balance: ' + sg(end) + '.'],
            explain: 'The balance is ' + (end < 0 ? '&minus;$' + (-end) + ', so he owes $' + (-end) : '$' + end) + '.' };
        }
        var d1 = -R.int(5, 40), up = R.int(3, 30), dn = lv > 1 ? R.int(3, 25) : 0, e = d1 + up - dn;
        return { q: 'A submarine is at ' + sg(d1) + ' m. It rises ' + up + ' m' + (dn ? ', then dives ' + dn + ' m' : '') + '. What is its depth now? (Below sea level is negative.)', type: 'num', answer: e, kb: 'text', unit: 'm',
          hint: 'Rising is adding. Diving is subtracting.',
          steps: ['Start at ' + sg(d1) + '.', 'Rise ' + up + ': ' + sg(d1) + ' + ' + up + ' = ' + sg(d1 + up) + '.', dn ? 'Dive ' + dn + ': ' + sg(d1 + up) + ' &minus; ' + dn + ' = ' + sg(e) + '.' : 'Depth: ' + sg(e) + ' m.'],
          explain: 'It is at ' + sg(e) + ' m.' };
      } },
      { id: 'in-pattern', name: 'Integer patterns', code: 'C1.4', gen: function (lv) {
        var a = R.int(-10, 15), d = R.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        if (lv === 1 && d > 0) d = -d;
        var t = [a, a + d, a + 2 * d, a + 3 * d];
        if (lv === 3) {
          var k = R.int(8, 15), v = a + (k - 1) * d;
          return { q: 'What is term ' + k + ' of the pattern ' + t.map(sg).join(', ') + ', ...?', type: 'num', answer: v, kb: 'text',
            hint: 'From term 1 to term ' + k + ' there are ' + (k - 1) + ' jumps of ' + sgp(d) + '.',
            steps: ['Each term changes by ' + sgp(d) + '.', 'Term ' + k + ' = ' + sg(a) + ' + ' + (k - 1) + ' &times; ' + sgp(d) + '.', '= ' + sg(a) + ' + ' + sgp((k - 1) * d) + ' = ' + sg(v) + '.'],
            explain: 'Term ' + k + ' is ' + sg(v) + '.' };
        }
        return { q: 'What comes next? ' + t.map(sg).join(', ') + ', ...', type: 'num', answer: a + 4 * d, kb: 'text', fig: lv === 1 ? patt(t) : '',
          hint: 'Find the change from one term to the next.',
          steps: ['From ' + sg(t[0]) + ' to ' + sg(t[1]) + ' is a change of ' + sgp(d) + '.', 'It is the same each time.', sg(t[3]) + ' + ' + sgp(d) + ' = ' + sg(a + 4 * d) + '.'],
          explain: 'The next term is ' + sg(a + 4 * d) + '.' };
      } }
    ]
  });
})();
