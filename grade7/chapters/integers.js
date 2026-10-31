(function () {
  var A = Atlas, R = A.R, cl = A.clean, fr = A.fr;
  function sg(n) { return n < 0 ? '&minus;' + (-n) : String(n); }
  function sgp(n) { return n < 0 ? '(&minus;' + (-n) + ')' : String(n); }
  function dec(x) { x = cl(x); return x < 0 ? '&minus;' + (-x) : String(x); }

  /* a thermometer from -30 to 30 with the temperature t */
  function thermo(t, t2) {
    var s = '', y = function (v) { return 230 - (v + 30) * 3.5; };
    s += '<rect x="70" y="' + (y(30) - 6) + '" width="26" height="' + (y(-30) - y(30) + 12) + '" rx="13" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    s += '<circle cx="83" cy="' + (y(-30) + 22) + '" r="20" style="fill:' + (t < 0 ? 'var(--sb)' : 'var(--bad)') + ';stroke:var(--ink)" stroke-width="2"/>';
    s += '<rect x="76" y="' + y(t) + '" width="14" height="' + (y(-30) - y(t) + 10) + '" style="fill:' + (t < 0 ? 'var(--sb)' : 'var(--bad)') + '"/>';
    for (var v = -30; v <= 30; v += 5) {
      s += '<line x1="96" y1="' + y(v) + '" x2="' + (v % 10 ? 104 : 110) + '" y2="' + y(v) + '" style="stroke:var(--ink)" stroke-width="' + (v ? 1.5 : 3) + '"/>';
      if (v % 10 === 0) s += '<text x="116" y="' + (y(v) + 6) + '" font-size="17"' + (v ? '' : ' font-weight="700"') + '>' + sg(v) + '</text>';
    }
    s += '<line x1="40" y1="' + y(0) + '" x2="150" y2="' + y(0) + '" style="stroke:var(--ink2)" stroke-dasharray="4 4"/><text x="152" y="' + (y(0) + 5) + '" font-size="15" class="t2">freezing</text>';
    s += '<text x="64" y="' + (y(t) + 6) + '" text-anchor="end" font-size="20" font-weight="700" style="fill:' + (t < 0 ? 'var(--sb)' : 'var(--bad)') + '">' + sg(t) + '&deg;C</text>';
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
      if (v % every === 0) s += '<text x="' + x + '" y="' + (top + 28) + '" text-anchor="middle" font-size="' + (n <= 20 ? 16 : 15) + '"' + (v ? '' : ' font-weight="700"') + ' style="fill:' + (v < 0 ? 'var(--sb)' : v > 0 ? 'var(--bad)' : 'var(--ink)') + '">' + sg(v) + '</text>';
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
      s += '<line x1="' + x + '" y1="' + y(0) + '" x2="' + x + '" y2="' + y(t) + '" style="stroke:' + (t < 0 ? 'var(--sb)' : 'var(--bad)') + '" stroke-width="10"/>' +
        '<circle cx="' + x + '" cy="' + y(t) + '" r="6" style="fill:var(--ink)"/>' +
        '<text x="' + x + '" y="' + (t < 0 ? y(t) + 24 : y(t) - 10) + '" text-anchor="middle" font-size="17" font-weight="700">' + sg(t) + '</text>';
    });
    return A.svg(W, H + 40, s, 'Pattern: ' + terms.join(', '));
  }

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    tho: { title: 'move the temperature', html: 
      '<div class="ctrl"><label for="thr">Temperature: <output id="tho"></output><input type="range" id="thr" min="-30" max="30" value="-8"></label></div>' +
      '<div class="row2"><div class="fig" id="thfig"></div><div class="out" id="thout"></div></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['thr'], function () {
          var t = +$('#thr', root).value;
          $('#tho', root).innerHTML = sg(t) + '&deg;C';
          $('#thfig', root).innerHTML = thermo(t, -t !== t ? -t : undefined);
          $('#thout', root).innerHTML = '<p class="big2">' + sg(t) + '&deg;C</p><p>' + (t < 0 ? (-t) + ' degrees <b>below</b> zero.' : t > 0 ? t + ' degrees <b>above</b> zero.' : 'Water freezes at 0&deg;C.') + '</p>' +
            (t ? '<p>Its opposite is <b>' + sg(-t) + '&deg;C</b> (the yellow dot). ' + sg(t) + ' + ' + sgp(-t) + ' = 0.</p>' : '');
        });
      } },
    ordn: { title: 'put numbers in order', html: 
      '<div class="ctrl"><label for="ordn">Type numbers separated by commas<input type="text" id="ordn" value="-2.5, 1/2, -3/4, 1.2, -1" style="width:16em"></label></div>' +
      '<div class="fig" id="ordfig"></div><div class="out" id="ordout"></div>',
      init: function (root) {
        var $ = A.$;
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
      } },
    chao: { title: 'add with chips', html: 
      '<div class="ctrl"><label for="cha">First: <output id="chao"></output><input type="range" id="cha" min="-10" max="10" value="-6"></label><label for="chb">Second: <output id="chbo"></output><input type="range" id="chb" min="-10" max="10" value="4"></label></div>' +
      '<div class="fig" id="chfig"></div><div class="out" id="chout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['cha', 'chb'], function () {
          var a = +$('#cha', root).value, b = +$('#chb', root).value, s = a + b;
          $('#chao', root).innerHTML = sg(a); $('#chbo', root).innerHTML = sg(b);
          $('#chfig', root).innerHTML = chips(a, b);
          $('#chout', root).innerHTML = '<p class="big2">' + sg(a) + ' + ' + sgp(b) + ' = ' + sg(s) + '</p><p>' + (s === 0 ? 'Every chip is in a zero pair. Nothing is left.' : 'After removing zero pairs, ' + Math.abs(s) + ' ' + (s > 0 ? 'yellow' : 'red') + ' chip' + (Math.abs(s) > 1 ? 's are' : ' is') + ' left.') + '</p>';
        });
      } },
    sbao: { title: 'move along the line', html: 
      '<div class="ctrl"><label for="sba">Start: <output id="sbao"></output><input type="range" id="sba" min="-10" max="10" value="-2"></label><label for="sbop">Operation<select id="sbop"><option value="1">add (+)</option><option value="-1" selected>subtract (&minus;)</option></select></label>' +
      '<label for="sbb">Number: <output id="sbbo"></output><input type="range" id="sbb" min="-10" max="10" value="-6"></label></div>' +
      '<div class="fig" id="sbfig"></div><div class="out" id="sbout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['sba', 'sbop', 'sbb'], function () {
          var a = +$('#sba', root).value, op = +$('#sbop', root).value, b = +$('#sbb', root).value, mv = op * b, res = a + mv;
          $('#sbao', root).innerHTML = sg(a); $('#sbbo', root).innerHTML = sg(b);
          $('#sbfig', root).innerHTML = iline(-20, 20, [{ v: a, col: 'var(--hi)' }, { v: res, lab: sg(res), col: 'var(--se)' }], mv ? [{ from: a, to: res, col: mv > 0 ? 'var(--sd)' : 'var(--sb)', id: 'ia2', lab: (mv > 0 ? 'right ' : 'left ') + Math.abs(mv) }] : []);
          $('#sbout', root).innerHTML = '<p class="big2">' + sg(a) + (op > 0 ? ' + ' : ' &minus; ') + sgp(b) + (op < 0 ? ' = ' + sg(a) + ' + ' + sgp(-b) : '') + ' = ' + sg(res) + '</p>' +
            '<p>' + (mv === 0 ? 'Adding or subtracting 0 does not move you.' : (op < 0 ? 'Subtracting ' + sg(b) + ' is the same as adding ' + sg(-b) + '. ' : '') + 'Move ' + Math.abs(mv) + ' to the ' + (mv > 0 ? 'right' : 'left') + '.') + '</p>';
        });
      } },
    ptao: { title: 'build a pattern', html: 
      '<div class="ctrl"><label for="pta">Start: <output id="ptao"></output><input type="range" id="pta" min="-10" max="10" value="5"></label><label for="ptd">Add each time: <output id="ptdo"></output><input type="range" id="ptd" min="-5" max="5" value="-2"></label></div>' +
      '<div class="fig" id="ptfig"></div><div class="out" id="ptout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['pta', 'ptd'], function () {
          var a = +$('#pta', root).value, d = +$('#ptd', root).value, t = [];
          $('#ptao', root).innerHTML = sg(a); $('#ptdo', root).innerHTML = sg(d);
          for (var i = 0; i < 7; i++) t.push(a + i * d);
          $('#ptfig', root).innerHTML = patt(t);
          $('#ptout', root).innerHTML = '<p><b>Terms:</b> ' + t.map(sg).join(', ') + ', ...</p><p><b>Rule:</b> start at ' + sg(a) + ' and add ' + sgp(d) + ' each time. Term 10 is ' + sg(a) + ' + 9 &times; ' + sgp(d) + ' = ' + sg(a + 9 * d) + '.</p>';
        });
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  function nq(q, a, hint, explain) { return { q: q, type: 'num', answer: a, kb: 'text', hint: hint, explain: explain }; }
  /* add n tiles of one kind, one after another */
  function put(t, s, n) { var p = Promise.resolve(); for (var i = 0; i < n; i++) p = p.then(function () { return t.add('one', s); }); return p; }

  var LESSONS = [
    { id: 'below', title: 'Numbers below zero', sub: 'Integers and their opposites.', concepts: [
      { id: 'zero', title: 'Below zero', exp: ['B1.2'], skill: 'in-compare',
        body: '<p><b>Integers</b> are the whole numbers, their opposites, and zero: ..., &minus;3, &minus;2, &minus;1, 0, 1, 2, 3, ... Negative numbers are <b>below zero</b>.</p>',
        watch: K.slides([
          { say: 'On a spring day it is 12&deg;C: 12 degrees above zero.', fig: function () { return thermo(12); } },
          { say: 'Overnight it drops to 0&deg;C, where water freezes.', fig: function () { return thermo(0); } },
          { say: 'In January in Ottawa it can be &minus;12&deg;C: 12 degrees <b>below</b> zero.', fig: function () { return thermo(-12); } },
          { say: 'Negative numbers are everywhere: a debt of $20 is &minus;20, and 86 m below sea level is &minus;86 m.', fig: eq('&minus;$20 &nbsp;&nbsp; &minus;86 m &nbsp;&nbsp; &minus;12&deg;C'), ms: 2800 }
        ]),
        example: K.slides([
          { say: 'My turn. I will write each one as an integer. First: it is 5 degrees below zero.', fig: function () { return thermo(-5); } },
          { say: 'Below zero means negative. So it is &minus;5&deg;C.', fig: eq('5 below zero = &minus;5&deg;C') },
          { say: 'Next: a submarine is 40 m below sea level. Below means negative: &minus;40 m.', fig: eq('&minus;40 m') },
          { say: 'Last: I put $15 into my bank account. That is above zero: +15.', fig: eq('+$15') },
          { say: 'Negative means below zero. The minus sign tells me which side of zero.', fig: eq('&minus;5&deg;C &nbsp;&nbsp; &minus;40 m &nbsp;&nbsp; +$15'), ms: 2600 }
        ]),
        try: lab('tho', [
          { do: 'Set the temperature to <b>&minus;20&deg;C</b>.', goal: function (h) { return K.v(h, 'thr') === -20; }, yes: '20 degrees below zero. Its opposite is 20&deg;C.' },
          { do: 'Find a temperature that is <b>its own opposite</b>.', goal: function (h) { return K.v(h, 'thr') === 0; }, yes: 'Zero is neither positive nor negative. It is its own opposite.' }
        ]),
        key: '<p><b>Negative means below zero.</b> The minus sign tells you which side of zero.</p>',
        mistake: '<p>Reading &minus;12 as "12" and ignoring the sign. Ask: above or below zero?</p>',
        check: [function () { var t = R.int(3, 25); return mc('Which temperature is ' + t + ' degrees below zero?', '&minus;' + t + '&deg;C', [t + '&deg;C', '&minus;' + (t + 10) + '&deg;C', '0&deg;C'], 'Below zero means negative.', t + ' degrees below zero is &minus;' + t + '&deg;C.'); }, K.ck('in-compare', 1)] },
      { id: 'opposite', title: 'Opposites', exp: ['B1.2'], skill: 'in-compare',
        body: '<p>Two numbers the <b>same distance from zero</b>, on opposite sides, are <b>opposites</b>. The opposite of 7 is &minus;7. A number and its opposite add to 0.</p>',
        watch: { tool: 'numberline', opts: { min: -10, max: 10, start: 0, tap: false }, steps: [
          { say: 'Start at zero.', act: null, ms: 1000 },
          { say: 'Hop 7 to the right: 7.', act: function (t) { return t.hop(7, '+7'); }, ms: 900 },
          { say: 'Back to zero, and hop 7 to the left: &minus;7.', act: function (t) { return t.moveTo(0).then(function () { return t.hop(-7, '−7'); }); }, ms: 900 },
          { say: '7 and &minus;7 are the same distance from zero. They are opposites.', act: function (t) { return t.mark(7, '7'); }, ms: 2200 }
        ] },
        example: { tool: 'numberline', opts: { min: -10, max: 10, start: 0, tap: false }, steps: [
          { say: 'My turn. I will find the opposite of &minus;4. I start at zero.', act: null, ms: 1000 },
          { say: '&minus;4 is 4 hops to the left of zero.', act: function (t) { return t.hop(-4, '−4'); }, ms: 900 },
          { say: 'Back to zero. The opposite is the same distance on the other side: 4 hops to the right.', act: function (t) { return t.moveTo(0).then(function () { return t.hop(4, '+4'); }); }, ms: 900 },
          { say: 'So the opposite of &minus;4 is <b>4</b>. They are the same distance from zero.', act: function (t) { return t.mark(-4, '−4'); }, ms: 2200 }
        ] },
        key: '<p><b>Opposites: same distance from zero, other side.</b> 7 + (&minus;7) = 0.</p>',
        mistake: '<p>Thinking the opposite of &minus;5 is &minus;5 or 0. The opposite flips the side: 5.</p>',
        check: [function () { return nq('What is the opposite of &minus;15?', 15, 'Same distance from zero, other side.', 'The opposite of &minus;15 is 15.'); }, function () { var n = R.int(2, 40); return nq('What is ' + n + ' + (&minus;' + n + ')?', 0, 'A number and its opposite add to zero.', n + ' and &minus;' + n + ' are opposites, so they add to 0.'); }] }
    ] },
    { id: 'compare', title: 'Comparing and ordering', sub: 'Further right is greater.', concepts: [
      { id: 'right', title: 'Further right is greater', exp: ['B1.3'], skill: 'in-compare', hard: true,
        body: '<p>On a number line, numbers get <b>bigger to the right</b>. So &minus;8 is <b>less</b> than &minus;3, even though 8 is more than 3.</p>',
        watch: K.slides([
          { say: 'Here are &minus;8 and &minus;3 on a number line.', fig: function () { return iline(-10, 5, [{ v: -8, lab: '&minus;8', col: 'var(--sb)' }, { v: -3, lab: '&minus;3', col: 'var(--bad)' }]); } },
          { say: '&minus;3 is further right, so &minus;3 is greater.', fig: eq('&minus;3 &gt; &minus;8') },
          { say: 'Think of temperature: &minus;8&deg;C is colder than &minus;3&deg;C.', fig: function () { return thermo(-3, -8); } },
          { say: 'For negatives, further from zero means <b>smaller</b>.', fig: '<div class="vs"><div><b class="t">Positive</b><p>8 &gt; 3</p></div><div><b class="t">Negative</b><p>&minus;8 &lt; &minus;3</p></div></div>', ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. Which is greater, &minus;6 or &minus;2? I put them on a number line.', fig: function () { return iline(-10, 5, [{ v: -6, lab: '&minus;6', col: 'var(--sb)' }, { v: -2, lab: '&minus;2', col: 'var(--bad)' }]); } },
          { say: '&minus;2 is further right, so &minus;2 is greater.', fig: eq('&minus;2 &gt; &minus;6') },
          { say: 'I check with temperature: &minus;6&deg;C is colder than &minus;2&deg;C.', fig: function () { return thermo(-2, -6); } },
          { say: 'So &minus;6 &lt; &minus;2. For negatives, the one closer to zero is greater.', fig: eq('&minus;6 &lt; &minus;2'), ms: 2600 }
        ]),
        try: { tool: 'numberline', opts: { min: -10, max: 10, start: 0, step: [-1, 1] }, tasks: [
          { do: 'Move the marker to a number <b>less than &minus;6</b>.', goal: function (s) { return s.at < -6; }, yes: 'Further left is less.' },
          { do: 'Move to the number that is <b>3 greater</b> than &minus;5.', goal: function (s) { return s.at === -2; }, yes: '−5 + 3 = −2. Greater means move right.' }
        ] },
        ways: [
          { label: 'Temperature', html: '<p>Which is warmer, &minus;8&deg;C or &minus;3&deg;C? &minus;3&deg;C is warmer, so &minus;3 is greater.</p><div class="fig">' + thermo(-3, -8) + '</div>' },
          { label: 'Money', html: '<p>Owing $8 (&minus;8) is worse than owing $3 (&minus;3). The less you owe, the more you have: &minus;3 &gt; &minus;8.</p>' }
        ],
        key: '<p><b>Further right is greater.</b> For negatives, the one closer to zero is greater.</p>',
        mistake: '<p>Comparing the sizes without the signs: saying &minus;8 &gt; &minus;3 because 8 &gt; 3. Always picture the line.</p>',
        check: [function () { return mc('The temperature is &minus;6&deg;C. Which temperature is colder?', '&minus;9&deg;C', ['&minus;2&deg;C', '0&deg;C', '3&deg;C'], 'Colder means further below zero.', '&minus;9 is further left on the line than &minus;6.'); }, K.ck('in-compare', 1), K.ck('in-compare', 2)] },
      { id: 'rational', title: 'Negative fractions and decimals', exp: ['B1.2', 'B1.3'], skill: 'in-compare', hard: true,
        body: '<p>Fractions and decimals can be negative too. &minus;2.5 is halfway between &minus;3 and &minus;2. All of these are <b>rational numbers</b>.</p>',
        watch: K.slides([
          { say: '&minus;2.5 is halfway between &minus;3 and &minus;2.', fig: function () { return iline(-4, 2, [{ v: -2.5, lab: '&minus;2.5', col: 'var(--sb)' }]); } },
          { say: '&minus;' + fr(3, 4) + ' is between &minus;1 and 0, closer to &minus;1.', fig: function () { return iline(-4, 2, [{ v: -2.5, lab: '&minus;2.5', col: 'var(--sb)' }, { v: -0.75, lab: '&minus;3/4', col: 'var(--sb)' }]); } },
          { say: 'Order &minus;2, &minus;1.2, &minus;' + fr(1, 2) + ' and 0.4: read them left to right.', fig: function () { return iline(-3, 1, [{ v: -2, lab: '&minus;2' }, { v: -1.2, lab: '&minus;1.2' }, { v: -0.5, lab: '&minus;1/2' }, { v: 0.4, lab: '0.4' }]); }, ms: 2800 }
        ]),
        example: K.slides([
          { say: 'My turn. I will order 1.2, &minus;0.8, &minus;1.5 and &minus;' + fr(1, 4) + ' from least to greatest.', fig: eq('1.2, &nbsp;&minus;0.8, &nbsp;&minus;1.5, &nbsp;&minus;' + fr(1, 4)) },
          { say: 'First, &minus;1.5 is halfway between &minus;2 and &minus;1.', fig: function () { return iline(-3, 2, [{ v: -1.5, lab: '&minus;1.5', col: 'var(--sb)' }]); } },
          { say: '&minus;0.8 is between &minus;1 and 0, close to &minus;1. &minus;' + fr(1, 4) + ' is between &minus;1 and 0, close to 0.', fig: function () { return iline(-3, 2, [{ v: -1.5, lab: '&minus;1.5', col: 'var(--sb)' }, { v: -0.8, lab: '&minus;0.8', col: 'var(--sb)' }, { v: -0.25, lab: '&minus;1/4', col: 'var(--sb)' }]); } },
          { say: '1.2 is just past 1.', fig: function () { return iline(-3, 2, [{ v: -1.5, lab: '&minus;1.5', col: 'var(--sb)' }, { v: -0.8, lab: '&minus;0.8', col: 'var(--sb)' }, { v: -0.25, lab: '&minus;1/4', col: 'var(--sb)' }, { v: 1.2, lab: '1.2', col: 'var(--bad)' }]); } },
          { say: 'I read them left to right: &minus;1.5, &minus;0.8, &minus;' + fr(1, 4) + ', 1.2.', fig: eq('&minus;1.5 &lt; &minus;0.8 &lt; &minus;' + fr(1, 4) + ' &lt; 1.2'), ms: 2600 }
        ]),
        try: lab('ordn', [
          { do: 'Add <b>&minus;4.5</b> to the list. Where does it go?', goal: function (h) { return /(^|,)\s*[-−]4\.5\s*(,|$)/.test(K.v(h, 'ordn')); }, yes: '−4.5 is the least: furthest left.' },
          { do: 'Type <b>&minus;4.5</b> and <b>&minus;4.05</b>. Which is greater?', goal: function (h) { var v = K.v(h, 'ordn'); return /(^|,)\s*[-−]4\.5\s*(,|$)/.test(v) && /(^|,)\s*[-−]4\.05\s*(,|$)/.test(v); }, yes: '−4.05 is closer to zero, so it is greater.' }
        ]),
        ways: [
          { label: 'Ignore the sign, then flip', html: '<p>Compare 4.5 and 4.05: 4.5 is bigger. For the negatives, it flips: &minus;4.5 is <b>smaller</b> than &minus;4.05.</p>' },
          { label: 'Line up the places', html: '<p>Write &minus;4.50 and &minus;4.05. Both are past &minus;4. &minus;4.50 is 0.50 past it; &minus;4.05 is only 0.05 past it, so &minus;4.05 is closer to zero and greater.</p>' }
        ],
        key: '<p><b>Place them on the line, then read left to right.</b></p>',
        mistake: '<p>Thinking &minus;1/2 is less than &minus;1 because 2 is bigger. &minus;1/2 is halfway between &minus;1 and 0.</p>',
        check: [function () { return mc('Which is greater?', '&minus;4.05', ['&minus;4.5', 'They are equal'], 'Which one is closer to zero?', '&minus;4.05 is closer to zero.'); }, K.ck('in-compare', 3)] }
    ] },
    { id: 'add', title: 'Adding integers', sub: 'Zero pairs cancel out.', concepts: [
      { id: 'pairs', title: 'Zero pairs', exp: ['B2.4'], skill: 'in-add',
        body: '<p>Use a <b>positive tile</b> for +1 and a <b>negative tile</b> for &minus;1. One of each is a <b>zero pair</b>, because 1 + (&minus;1) = 0. Remove the zero pairs; what is left is the answer.</p>',
        watch: { tool: 'tiles', opts: { ones: true }, steps: [
          { say: '5 + (&minus;3). Put out 5 positive tiles.', act: function (t) { return put(t, 1, 5); }, ms: 600 },
          { say: 'Add 3 negative tiles.', act: function (t) { return put(t, -1, 3); }, ms: 800 },
          { say: 'Each positive and negative together make zero. Remove the zero pairs.', act: function (t) { return t.zeroPairs(); }, ms: 900 },
          { say: '2 positive tiles are left: 5 + (&minus;3) = <b>2</b>.', act: null, ms: 2200 }
        ] },
        example: { tool: 'tiles', opts: { ones: true }, steps: [
          { say: 'My turn. I will work out &minus;7 + 3. First I put out 7 negative tiles.', act: function (t) { return put(t, -1, 7); }, ms: 600 },
          { say: 'Then I add 3 positive tiles.', act: function (t) { return put(t, 1, 3); }, ms: 800 },
          { say: 'A positive and a negative make a zero pair. I remove the 3 zero pairs.', act: function (t) { return t.zeroPairs(); }, ms: 900 },
          { say: '4 negative tiles are left. So &minus;7 + 3 = <b>&minus;4</b>.', act: null, ms: 2200 }
        ] },
        try: { tool: 'tiles', opts: { ones: true }, tasks: [
          { do: 'Show <b>&minus;6 + 4</b>: 6 negative tiles and 4 positive. Then remove the zero pairs.', goal: function (s) { return s.one === -2 && s.n === 2; }, yes: '4 zero pairs cancel. −2 is left.' },
          { do: 'Make <b>zero</b> using exactly 10 tiles.', goal: function (s) { return s.one === 0 && s.n === 10; }, yes: '5 zero pairs: 5 + (−5) = 0.' }
        ] },
        key: '<p><b>Cancel the zero pairs. What is left is the answer.</b></p>',
        mistake: '<p>Counting all the tiles (6 + 4 = 10) instead of cancelling. Have the student physically pair and remove them.</p>',
        check: [function () { return nq('Add: &minus;7 + 3', -4, 'Three zero pairs cancel. What is left?', '3 zero pairs cancel and 4 negatives are left: &minus;4.'); }, K.ck('in-add', 1), K.ck('in-add', 1)] },
      { id: 'rule', title: 'Same signs, different signs', exp: ['B2.4'], skill: 'in-add', hard: true,
        body: '<p><b>Same signs:</b> add the sizes and keep the sign. <b>Different signs:</b> subtract the sizes and keep the sign of the bigger size.</p>',
        watch: K.slides([
          { say: '&minus;4 + (&minus;3): both negative. No zero pairs.', fig: function () { return chips(-4, -3); } },
          { say: 'Add the sizes, 4 + 3 = 7, and keep the sign: &minus;7.', fig: eq('&minus;4 + (&minus;3) = &minus;7') },
          { say: '&minus;6 + 4: different signs. 4 zero pairs cancel.', fig: function () { return chips(-6, 4); } },
          { say: 'Subtract the sizes, 6 &minus; 4 = 2. The negative was bigger, so &minus;2.', fig: eq('&minus;6 + 4 = &minus;2'), ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. First, &minus;5 + (&minus;2). Both are negative, so there are no zero pairs.', fig: function () { return chips(-5, -2); } },
          { say: 'Same signs: I add the sizes, 5 + 2 = 7, and keep the sign. The answer is &minus;7.', fig: eq('&minus;5 + (&minus;2) = &minus;7') },
          { say: 'Next, 3 + (&minus;8). The signs are different. 3 zero pairs cancel.', fig: function () { return chips(3, -8); } },
          { say: 'Different signs: I subtract the sizes, 8 &minus; 3 = 5. The negative was bigger, so the answer is <b>&minus;5</b>.', fig: eq('3 + (&minus;8) = &minus;5'), ms: 2600 }
        ]),
        try: lab('chao', [
          { do: 'Show <b>&minus;6 + 4</b>.', goal: function (h) { return K.v(h, 'cha') === -6 && K.v(h, 'chb') === 4; }, yes: 'Different signs: 6 − 4 = 2, and the negative is bigger: −2.' },
          { do: 'Find two <b>negative</b> numbers that add to <b>&minus;10</b>.', goal: function (h) { var a = K.v(h, 'cha'), b = K.v(h, 'chb'); return a < 0 && b < 0 && a + b === -10; }, yes: 'Same signs: add the sizes, keep the negative sign.' },
          { do: 'Make the answer <b>positive</b> with one negative number.', goal: function (h) { var a = K.v(h, 'cha'), b = K.v(h, 'chb'); return a * b < 0 && a + b > 0; }, yes: 'The positive size was bigger, so the answer is positive.' }
        ]),
        ways: [
          { label: 'On a number line', html: '<p>Start at &minus;6. Adding 4 moves 4 to the <b>right</b>. You land on &minus;2.</p><div class="fig">' + iline(-8, 2, [{ v: -6, col: 'var(--hi)' }, { v: -2, lab: '&minus;2', col: 'var(--se)' }], [{ from: -6, to: -2, col: 'var(--sd)', id: 'inw1', lab: '+ 4' }]) + '</div>' },
          { label: 'Money', html: '<p>You owe $6 (&minus;6) and earn $4 (+4). After paying, you still owe $2: &minus;2.</p>' },
          { label: 'Tug of war', html: '<p>6 pull left, 4 pull right. The left side wins by 2: &minus;2.</p>' }
        ],
        key: '<p><b>Same signs: add, keep the sign. Different signs: subtract, keep the sign of the bigger size.</b></p>',
        mistake: '<p>Mixing the rules: &minus;4 + (&minus;3) = 7 or &minus;6 + 4 = &minus;10. Go back to tiles until the rule makes sense.</p>',
        check: [function () { return nq('Add: &minus;6 + (&minus;7)', -13, 'Same signs: add the sizes and keep the sign.', '6 + 7 = 13, both negative: &minus;13.'); }, K.ck('in-add', 2), K.ck('in-add', 3)] }
    ] },
    { id: 'sub', title: 'Subtracting integers', sub: 'Add the opposite.', concepts: [
      { id: 'addopp', title: 'Subtracting is adding the opposite', exp: ['B2.4'], skill: 'in-sub', hard: true,
        body: '<p>Adding a positive moves <b>right</b>; adding a negative moves <b>left</b>. Subtracting does the <b>opposite</b>. So <b>subtracting a number is the same as adding its opposite</b>.</p>',
        watch: { tool: 'numberline', opts: { min: -10, max: 10, start: 3, tap: false }, steps: [
          { say: '3 &minus; 5. Start at 3.', act: null, ms: 1000 },
          { say: 'Subtract 5 means add &minus;5: move 5 left to &minus;2.', act: function (t) { return t.hop(-2, '−5'); }, ms: 1200 },
          { say: 'Now 3 &minus; (&minus;5). Start at 3 again.', act: function (t) { return t.clearHops().then(function () { return t.moveTo(3); }); }, ms: 800 },
          { say: 'Subtracting &minus;5 means adding 5: move 5 right to 8.', act: function (t) { return t.hop(8, '+5'); }, ms: 1200 },
          { say: '3 &minus; (&minus;5) = 3 + 5 = <b>8</b>.', act: null, ms: 2200 }
        ] },
        example: { tool: 'numberline', opts: { min: -10, max: 10, start: -2, tap: false }, steps: [
          { say: 'My turn. I will work out &minus;2 &minus; 6. I start at &minus;2.', act: null, ms: 1000 },
          { say: 'Subtracting 6 means adding &minus;6. I move 6 to the left, to &minus;8.', act: function (t) { return t.hop(-8, '−6'); }, ms: 1200 },
          { say: 'Now &minus;2 &minus; (&minus;6). I start at &minus;2 again.', act: function (t) { return t.clearHops().then(function () { return t.moveTo(-2); }); }, ms: 800 },
          { say: 'Subtracting &minus;6 means adding 6. I move 6 to the right, to 4.', act: function (t) { return t.hop(4, '+6'); }, ms: 1200 },
          { say: '&minus;2 &minus; (&minus;6) = &minus;2 + 6 = <b>4</b>. Subtract means add the opposite.', act: null, ms: 2200 }
        ] },
        try: lab('sbao', [
          { do: 'Show <b>&minus;2 &minus; (&minus;6)</b>.', goal: function (h) { return K.v(h, 'sba') === -2 && K.v(h, 'sbop') === -1 && K.v(h, 'sbb') === -6; }, yes: '−2 − (−6) = −2 + 6 = 4.' },
          { do: 'Now change it to <b>&minus;2 + 6</b>. Is the answer the same?', goal: function (h) { return K.v(h, 'sba') === -2 && K.v(h, 'sbop') === 1 && K.v(h, 'sbb') === 6; }, yes: 'Yes: subtracting −6 is adding 6.' },
          { do: 'Find a subtraction with an answer of <b>&minus;5</b>.', goal: function (h) { return K.v(h, 'sbop') === -1 && K.v(h, 'sba') - K.v(h, 'sbb') === -5; }, yes: 'Check it by adding the opposite.' }
        ]),
        ways: [
          { label: 'Chips: add zero pairs', html: '<p>For 3 &minus; (&minus;5), you need 5 negatives to take away, but there are none. Add 5 zero pairs (5 positive and 5 negative): the value is still 3. Now take away the 5 negatives. 8 positives are left.</p><div class="fig">' + chips(8, -5) + '</div>' },
          { label: 'The pattern', html: '<p>3 &minus; 2 = 1<br>3 &minus; 1 = 2<br>3 &minus; 0 = 3<br>3 &minus; (&minus;1) = 4<br>3 &minus; (&minus;2) = 5</p><p>Each time the number taken away goes down by 1, the answer goes up by 1.</p>' },
          { label: 'Taking away a debt', html: '<p>If someone takes away a $5 debt you owe, you are $5 better off. Subtracting &minus;5 is like adding 5.</p>' }
        ],
        key: '<p><b>Subtract = add the opposite.</b> 3 &minus; (&minus;5) = 3 + 5.</p>',
        mistake: '<p>Turning every pair of negatives into a plus. &minus;3 + (&minus;5) = &minus;8: there is no subtraction there, so nothing flips.</p>',
        check: [function () { return nq('Subtract: &minus;4 &minus; (&minus;9)', 5, 'Change it to adding the opposite: &minus;4 + 9.', '&minus;4 + 9 = 5.'); }, K.ck('in-sub', 1), K.ck('in-sub', 2)] },
      { id: 'diff', title: 'How far apart?', exp: ['B2.4'], skill: 'in-word',
        body: '<p>Subtraction also finds the <b>difference</b> between two numbers: how far apart they are on the line. Always do <b>bigger &minus; smaller</b>.</p>',
        watch: K.slides([
          { say: 'At night it was &minus;12&deg;C. At noon it was 4&deg;C. How much did it rise?', fig: function () { return thermo(4, -12); } },
          { say: 'From &minus;12 up to 0 is 12 degrees. From 0 up to 4 is 4 more.', fig: function () { return iline(-14, 6, [{ v: -12, lab: '&minus;12', col: 'var(--sb)' }, { v: 4, lab: '4', col: 'var(--bad)' }], [{ from: -12, to: 0, col: 'var(--sb)', id: 'idf1', lab: '12' }, { from: 0, to: 4, col: 'var(--bad)', id: 'idf2', lab: '4' }]); } },
          { say: 'Or subtract: 4 &minus; (&minus;12) = 4 + 12 = <b>16 degrees</b>.', fig: eq('4 &minus; (&minus;12) = 16'), ms: 2600 }
        ]),
        example: K.slides([
          { say: 'My turn. A diver is at &minus;15 m. A gull flies 20 m above the water. How far apart are they?', fig: function () { return iline(-20, 25, [{ v: -15, lab: '&minus;15', col: 'var(--sb)' }, { v: 20, lab: '20', col: 'var(--bad)' }]); } },
          { say: 'From &minus;15 up to 0 is 15 m. From 0 up to 20 is 20 m more.', fig: function () { return iline(-20, 25, [{ v: -15, lab: '&minus;15', col: 'var(--sb)' }, { v: 20, lab: '20', col: 'var(--bad)' }], [{ from: -15, to: 0, col: 'var(--sb)', id: 'iex1', lab: '15' }, { from: 0, to: 20, col: 'var(--bad)', id: 'iex2', lab: '20' }]); } },
          { say: 'Across zero, I add the two distances: 15 + 20 = 35 m.', fig: eq('15 + 20 = 35') },
          { say: 'I check by subtracting: 20 &minus; (&minus;15) = 20 + 15 = 35. They are <b>35 m</b> apart.', fig: eq('20 &minus; (&minus;15) = 35'), ms: 2600 }
        ]),
        key: '<p><b>Difference = bigger &minus; smaller.</b> Across zero, add the two distances from zero.</p>',
        mistake: '<p>Subtracting the sizes (12 &minus; 4 = 8) when the numbers are on opposite sides of zero. Draw the line and count across zero.</p>',
        check: [function () { return { q: 'At 6 a.m. it was &minus;14&deg;C. By noon it was 3&deg;C. How many degrees did the temperature rise?', type: 'num', answer: 17, hint: 'Find the distance from &minus;14 to 3.', explain: '3 &minus; (&minus;14) = 17 degrees.' }; }, K.ck('in-word', 1), K.ck('in-word', 2)] }
    ] },
    { id: 'pattern', title: 'Integer patterns', sub: 'Patterns that go below zero.', concepts: [
      { id: 'grow', title: 'Patterns below zero', exp: ['C1.4'], skill: 'in-pattern',
        body: '<p>A pattern can go below zero. Start at 7 and keep adding &minus;3: 7, 4, 1, &minus;2, &minus;5, ... Each term is 3 less than the one before.</p>',
        watch: K.slides([
          { say: 'Start at 7.', fig: function () { return patt([7]); } },
          { say: 'Add &minus;3 each time: 4, then 1.', fig: function () { return patt([7, 4, 1]); } },
          { say: 'Keep going below zero: &minus;2, &minus;5, &minus;8.', fig: function () { return patt([7, 4, 1, -2, -5, -8]); } },
          { say: 'The rule: start at 7, add &minus;3 each time.', fig: eq('7, 4, 1, &minus;2, &minus;5, &minus;8, ...'), ms: 2400 }
        ]),
        example: K.slides([
          { say: 'My turn. A pattern starts at 10 and adds &minus;4 each time. I will find the next terms.', fig: function () { return patt([10]); } },
          { say: '10 + (&minus;4) = 6. Then 6 + (&minus;4) = 2.', fig: function () { return patt([10, 6, 2]); } },
          { say: 'I keep going past zero: 2 + (&minus;4) = &minus;2, then &minus;6, then &minus;10.', fig: function () { return patt([10, 6, 2, -2, -6, -10]); } },
          { say: 'The pattern is 10, 6, 2, &minus;2, &minus;6, &minus;10. I find the change, then keep adding it, even past zero.', fig: eq('10, 6, 2, &minus;2, &minus;6, &minus;10, ...'), ms: 2600 }
        ]),
        try: lab('ptao', [
          { do: 'Build the pattern <b>5, 3, 1, &minus;1, ...</b>', goal: function (h) { return K.v(h, 'pta') === 5 && K.v(h, 'ptd') === -2; }, yes: 'Start at 5, add −2 each time.' },
          { do: 'Build a pattern that <b>starts below zero and goes up</b>.', goal: function (h) { return K.v(h, 'pta') < 0 && K.v(h, 'ptd') > 0; }, yes: 'Adding a positive moves it up.' }
        ]),
        key: '<p><b>Find the change from one term to the next.</b> Then keep adding it, even past zero.</p>',
        mistake: '<p>Stopping at zero, or switching to counting up after zero (1, 0, 1, 2). The change stays the same all the way.</p>',
        check: [function () { return nq('What comes next? 10, 6, 2, &minus;2, ...', -6, 'How much does it change each time?', 'Each term is 4 less: &minus;6.'); }, K.ck('in-pattern', 1), K.ck('in-pattern', 2)] },
      { id: 'term', title: 'Jump to any term', exp: ['C1.4'], skill: 'in-pattern',
        body: '<p>To find a term far away, use the rule. The 10th term of 9, 6, 3, ... is the start plus 9 changes: 9 + 9 &times; (&minus;3) = &minus;18.</p>',
        watch: K.slides([
          { say: 'A diver starts at the surface, 0 m, and goes down 4 m every minute.', fig: function () { return patt([0, -4, -8, -12]); } },
          { say: 'After 1 minute: &minus;4. After 2: &minus;8. After 3: &minus;12.', fig: eq('0, &minus;4, &minus;8, &minus;12, ...') },
          { say: 'After 6 minutes: 6 &times; (&minus;4) = <b>&minus;24 m</b>. No need to list every term.', fig: function () { return patt([0, -4, -8, -12, -16, -20, -24]); }, ms: 2800 }
        ]),
        example: K.slides([
          { say: 'My turn. It is 5&deg;C. The temperature drops 3 degrees every hour. What will it be after 8 hours?', fig: function () { return patt([5, 2, -1, -4]); } },
          { say: 'The start is 5. The change is &minus;3 each hour, and there are 8 steps.', fig: eq('term = start + steps &times; change') },
          { say: '8 &times; (&minus;3) = &minus;24. Then 5 + (&minus;24) = &minus;19.', fig: eq('5 + 8 &times; (&minus;3) = 5 + (&minus;24) = &minus;19') },
          { say: 'After 8 hours it is <b>&minus;19&deg;C</b>. I did not need to list every term.', fig: function () { return patt([5, 2, -1, -4, -7, -10, -13, -16, -19]); }, ms: 2800 }
        ]),
        key: '<p><b>Term = start + (number of steps) &times; change.</b></p>',
        mistake: '<p>Multiplying by the term number instead of the number of steps: the 10th term has 9 steps after the first.</p>',
        check: [function () { return nq('What is the 8th term of the pattern 9, 6, 3, 0, &minus;3, ...?', -12, 'Each term is 3 less. The 8th term is 7 steps after the first.', '9 + 7 &times; (&minus;3) = &minus;12.'); }, K.ck('in-pattern', 3)] }
    ] }
  ];


  A.register('integers', {
    lessons: LESSONS,

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

  /* ---------- question shapes: more ways to practise each skill ---------- */
  function nz(lo, hi) { var v = 0; while (!v) v = R.int(lo, hi); return v; }
  Atlas.Q.shapes('integers', {
    'in-compare': [
      [1, 'line', function () {
        var n = nz(-10, 10);
        return { q: 'Place <b>' + sg(n) + '</b> on the number line.', type: 'line', min: -10, max: 10, tick: 1, every: 5, snap: 1, answer: n,
          hint: n < 0 ? 'Negative numbers are to the left of 0.' : 'Positive numbers are to the right of 0.', steps: ['Start at 0. Count ' + Math.abs(n) + ' to the ' + (n < 0 ? 'left' : 'right') + '.'],
          explain: sg(n) + ' is ' + Math.abs(n) + ' to the ' + (n < 0 ? 'left' : 'right') + ' of 0.', meta: { k: 'in-line', n: n } };
      }],
      [1, 'order', function (lv) {
        var list = K.uniq(lv === 1 ? 4 : 5, function () { return R.int(-15, 15); }).sort(function (a, b) { return a - b; });
        return { q: 'Put these in order from <b>least</b> to <b>greatest</b>.', type: 'order', items: list.map(sg), first: 'least', last: 'greatest',
          hint: 'Picture a number line. Further left is less.', steps: ['The most negative number is the least.', 'Then work to the right.'],
          explain: 'In order: ' + list.map(sg).join(', ') + '.', meta: { k: 'in-order', list: list } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a = R.int(2, 15), b = R.int(1, 15); while (b === a) b = R.int(1, 15);
        var big = Math.max(a, b), small = Math.min(a, b), truth = R.int(0, 1), x = truth ? -small : -big, y = truth ? -big : -small;
        var right = 'On a number line, ' + sg(-small) + ' is to the right of ' + sg(-big) + ', so ' + sg(-small) + ' is greater.';
        return { q: who + ' says <span class="math">' + sg(x) + ' &gt; ' + sg(y) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['The number with more digits is greater.', sg(-big) + ' is greater because ' + big + ' is more than ' + small + '.']),
          hint: 'Which one is closer to 0?', steps: [right], explain: right, meta: { k: 'in-cmp-tf', x: x, y: y } };
      }]
    ],
    'in-add': [
      [1, 'line', function () {
        var a = nz(-8, 8), b = nz(-7, 7);
        return { q: 'Start at <b>' + sg(a) + '</b>. Add <b>' + sg(b) + '</b>. Place where you land.', type: 'line', min: -15, max: 15, tick: 1, every: 5, snap: 1, answer: a + b,
          hint: 'Adding a positive moves right. Adding a negative moves left.', steps: ['Start at ' + sg(a) + '.', 'Move ' + Math.abs(b) + ' to the ' + (b < 0 ? 'left' : 'right') + '.'],
          explain: sg(a) + ' + ' + sgp(b) + ' = ' + sg(a + b) + '.', meta: { k: 'in-add-line', a: a, b: b } };
      }],
      [1, 'story', function () {
        var who = K.name(), a = -R.int(2, 15), b = R.int(3, 20), t = R.int(0, 1);
        var q = t ? 'At 7 a.m. in Winnipeg it was <b>' + sg(a) + '&deg;C</b>. By noon it was <b>' + b + ' degrees warmer</b>. What was the temperature at noon?' : who + '\'s bank account was at <b>' + sg(a) + ' dollars</b>. ' + who + ' deposits <b>$' + b + '</b>. What is the balance now?';
        return { q: q + ' Use &minus; for a negative number.', type: 'num', answer: a + b, kb: 'text',
          hint: 'Start at ' + sg(a) + ' and move ' + b + ' up.', steps: [sg(a) + ' + ' + b + ' = ' + sg(a + b) + '.'],
          explain: sg(a) + ' + ' + b + ' = ' + sg(a + b) + '.', meta: { k: 'in-add-story', a: a, b: b } };
      }],
      [1, 'which', function () {
        var a = nz(-12, 12), b = nz(-12, 12); while (a + b === 0) b = nz(-12, 12);
        var ans = a + b > 0 ? 'Positive' : 'Negative', o = R.mc(ans, [ans === 'Positive' ? 'Negative' : 'Positive', 'Zero']);
        return { q: 'Before you add: will <span class="math">' + sg(a) + ' + ' + sgp(b) + '</span> be positive or negative?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Which number is further from 0? Its sign wins.', steps: [Math.sign(a) === Math.sign(b) ? 'Same signs: the answer keeps that sign.' : 'Different signs: the one further from 0 wins.'],
          explain: sg(a) + ' + ' + sgp(b) + ' = ' + sg(a + b) + ', which is ' + ans.toLowerCase() + '.', meta: { k: 'in-sign', a: a, b: b } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a = -R.int(2, 12), b = -R.int(2, 12), truth = R.int(0, 1), said = truth ? a + b : -(a + b);
        var right = 'Two negatives make a bigger negative: ' + sg(a) + ' + ' + sgp(b) + ' = ' + sg(a + b) + '.';
        return { q: who + ' says <span class="math">' + sg(a) + ' + ' + sgp(b) + ' = ' + sg(said) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Two negatives make a positive.', 'Adding always gives a bigger number.']),
          hint: 'Picture ' + Math.abs(a) + ' red chips and ' + Math.abs(b) + ' more red chips.', steps: [right], explain: right, meta: { k: 'in-add-tf', a: a, b: b, said: said } };
      }]
    ],
    'in-sub': [
      [1, 'fill', function () {
        var a = R.int(-9, 9), b = nz(-9, 9);
        return { q: 'Subtracting is adding the opposite. Fill in the blanks.', type: 'fill', fill: '<span class="math">' + sg(a) + ' &minus; ' + sgp(b) + ' = ' + sg(a) + ' + </span>[[]]<span class="math"> = </span>[[]]', answers: [-b, a - b],
          hint: 'The opposite of ' + sg(b) + ' is ' + sg(-b) + '.', steps: ['Change &minus; ' + sgp(b) + ' to + ' + sgp(-b) + '.', sg(a) + ' + ' + sgp(-b) + ' = ' + sg(a - b) + '.'],
          explain: sg(a) + ' &minus; ' + sgp(b) + ' = ' + sg(a - b) + '.', meta: { k: 'in-sub-fill', a: a, b: b } };
      }],
      [1, 'match', function () {
        var ps = K.uniq(3, function () { return [R.int(-9, 9), nz(-9, 9)]; }, function (p) { return p[0] - p[1]; });
        var pairs = ps.map(function (p) { return ['<span class="math">' + sg(p[0]) + ' &minus; ' + sgp(p[1]) + '</span>', sg(p[0] - p[1])]; });
        return { q: 'Match each subtraction to its answer.', type: 'match', pairs: pairs,
          hint: 'Add the opposite of the second number.', steps: ['3 &minus; (&minus;2) = 3 + 2 = 5.'],
          explain: ps.map(function (p) { return sg(p[0]) + ' &minus; ' + sgp(p[1]) + ' = ' + sg(p[0] - p[1]); }).join(', ') + '.', meta: { k: 'in-sub-match', ps: ps } };
      }],
      [1, 'story', function () {
        var lo = -R.int(3, 25), hi = R.int(1, 20), pl = R.pick([['Iqaluit', 'Vancouver'], ['Whitehorse', 'Toronto'], ['Yellowknife', 'Halifax']]);
        return { q: 'One morning it was <b>' + sg(lo) + '&deg;C</b> in ' + pl[0] + ' and <b>' + hi + '&deg;C</b> in ' + pl[1] + '. How many degrees warmer was ' + pl[1] + '?', type: 'num', answer: hi - lo, kb: 'text',
          hint: 'Subtract: warmer minus colder.', steps: [hi + ' &minus; ' + sgp(lo) + ' = ' + hi + ' + ' + (-lo) + ' = ' + (hi - lo) + '.'],
          explain: 'From ' + sg(lo) + ' up to 0 is ' + (-lo) + ' degrees, and 0 up to ' + hi + ' is ' + hi + ' more: ' + (hi - lo) + ' degrees.', meta: { k: 'in-sub-story', lo: lo, hi: hi } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a = R.int(1, 9), b = -R.int(1, 9), truth = R.int(0, 1), said = truth ? a - b : a + b;
        var right = 'Subtracting ' + sg(b) + ' is adding ' + (-b) + ': ' + a + ' &minus; ' + sgp(b) + ' = ' + a + ' + ' + (-b) + ' = ' + (a - b) + '.';
        return { q: who + ' says <span class="math">' + a + ' &minus; ' + sgp(b) + ' = ' + sg(said) + '</span>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['Subtracting always makes a number smaller.', 'Just ignore the negative sign.']),
          hint: 'What is the opposite of ' + sg(b) + '?', steps: [right], explain: right, meta: { k: 'in-sub-tf', a: a, b: b, said: said } };
      }]
    ],
    'in-word': [
      [1, 'which', function () {
        var who = K.name(), s = -R.int(2, 12), c = R.int(3, 10), up = R.int(0, 1);
        var q = up ? 'It was ' + sg(s) + '&deg;C. Then it got ' + c + ' degrees warmer.' : 'It was ' + sg(s) + '&deg;C. Then it got ' + c + ' degrees colder.';
        var right = up ? sg(s) + ' + ' + c : sg(s) + ' &minus; ' + c, o = R.mc(right, [up ? sg(s) + ' &minus; ' + c : sg(s) + ' + ' + c, sg(-s) + (up ? ' + ' : ' &minus; ') + c, c + ' &minus; ' + sgp(s)]);
        return { q: 'Which way? ' + q + ' Which number sentence gives the new temperature?', type: 'mc', options: o.options, answer: o.answer,
          hint: up ? 'Warmer means the number goes up.' : 'Colder means the number goes down.', steps: [up ? 'Warmer: add.' : 'Colder: subtract.'],
          explain: right + ' = ' + sg(up ? s + c : s - c) + '&deg;C.', meta: { k: 'in-word-which', s: s, c: c, up: up } };
      }],
      [1, 'line', function () {
        var who = K.name(), d = -R.int(5, 18), up = R.int(2, Math.min(12, -d + 4));
        return { q: who + ' is scuba diving at <b>' + sg(d) + ' m</b> (below sea level). ' + who + ' swims up <b>' + up + ' m</b>. Place ' + who + '\'s new depth on the line.', type: 'line', min: -20, max: 5, tick: 1, every: 5, snap: 1, answer: d + up,
          hint: 'Sea level is 0. Going up moves right on this line.', steps: [sg(d) + ' + ' + up + ' = ' + sg(d + up) + '.'],
          explain: who + ' is now at ' + sg(d + up) + ' m.', meta: { k: 'in-word-line', d: d, up: up } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), bal = -R.int(5, 30), dep = R.int(10, 50), truth = R.int(0, 1), said = truth ? bal + dep : bal - dep;
        var right = 'A deposit adds money: ' + sg(bal) + ' + ' + dep + ' = ' + sg(bal + dep) + '.';
        return { q: who + '\'s account shows <b>' + sg(bal) + ' dollars</b>. After a deposit of <b>$' + dep + '</b>, ' + who + ' says the balance is <b>' + sg(said) + ' dollars</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['A deposit makes a negative balance more negative.', 'The balance is just the deposit, $' + dep + '.']),
          hint: 'A deposit moves the balance up.', steps: [right], explain: right, meta: { k: 'in-word-tf', bal: bal, dep: dep, said: said } };
      }]
    ],
    'in-pattern': [
      [1, 'fill', function () {
        var a = R.int(-10, 15), d = R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), t = [0, 1, 2, 3].map(function (i) { return a + i * d; });
        return { q: 'Fill in the next two terms.', type: 'fill', fill: '<span class="math">' + t.map(sg).join(', ') + ', </span>[[]], [[]]', answers: [a + 4 * d, a + 5 * d],
          hint: 'What is added each time?', steps: ['Each term ' + (d > 0 ? 'adds ' + d : 'subtracts ' + (-d)) + '.'],
          explain: 'Next: ' + sg(a + 4 * d) + ', ' + sg(a + 5 * d) + '.', meta: { k: 'in-pat-fill', t: t } };
      }],
      [1, 'tap', function () {
        var a = R.int(-10, 10), d = R.pick([-4, -3, -2, 2, 3, 4]), t = [0, 1, 2, 3, 4].map(function (i) { return a + i * d; }), bad = R.int(1, 3);
        t[bad] += R.pick([-1, 1]);
        return { q: 'One term does not fit the pattern. Tap it.', type: 'tap', tiles: t.map(sg), answer: bad, answerText: sg(t[bad]),
          hint: 'Find the difference between the first two terms, and the last two.', steps: ['The pattern ' + (d > 0 ? 'adds ' + d : 'subtracts ' + (-d)) + ' each time.', 'The term should be ' + sg(a + bad * d) + '.'],
          explain: sg(t[bad]) + ' should be ' + sg(a + bad * d) + '.', meta: { k: 'in-pat-tap', t: t } };
      }],
      [2, 'mistake', function () {
        var who = K.name(), a = R.int(-5, 15), d = -R.int(2, 6), t = [0, 1, 2, 3].map(function (i) { return a + i * d; }), truth = R.int(0, 1), said = truth ? d : -d;
        var right = 'Each term is ' + (-d) + ' less than the one before, so the rule is subtract ' + (-d) + ' (add ' + sg(d) + ').';
        return { q: 'The pattern is <span class="math">' + t.map(sg).join(', ') + ', ...</span> ' + who + ' says the rule is <b>' + (said > 0 ? 'add ' + said : 'subtract ' + (-said)) + '</b>. True or false?', type: 'tf', answer: !!truth,
          why: K.why(right, ['The numbers are getting bigger, so the rule adds.', 'The rule is the first term.']),
          hint: 'Are the terms going up or down?', steps: [right], explain: right, meta: { k: 'in-pat-tf', t: t, said: said } };
      }]
    ]
  });
})();
