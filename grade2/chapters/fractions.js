(function () {
  var A = Atlas, R = A.R, D = A.draw;
  var NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  var ONE = { 2: 'half', 3: 'third', 4: 'fourth', 6: 'sixth' }, MANY = { 2: 'halves', 3: 'thirds', 4: 'fourths', 6: 'sixths' };
  /* "one third", "two sixths" */
  function fw(k, d) { return NUM[k] + ' ' + (k === 1 ? ONE[d] : MANY[d]); }
  /* each sharer's share of n things among s sharers, in words */
  function shareWords(n, s) {
    var w = Math.floor(n / s), r = n % s;
    if (!r) return w + ' whole' + (w === 1 ? '' : 's');
    return (w ? w + ' whole' + (w === 1 ? '' : 's') + ' and ' : '') + fw(r, s);
  }
  A.fw = fw;
  var SC = ['var(--sb)', 'var(--se)', 'var(--sd)', 'var(--sc)', 'var(--sf)', 'var(--p0)'];
  /* a rectangle cut into d parts. shade: number of parts shaded, or an array of colours. uneven: draw unequal cuts */
  function rect(d, shade, w, uneven, label) {
    w = w || 300;
    var h = 56, s = '', xs = [0];
    if (uneven) xs = [0, 0.18, 0.55, 0.78].slice(0, d).concat([1]).filter(function (v, i, a) { return a.indexOf(v) === i; });
    else for (var i = 1; i <= d; i++) xs.push(i / d);
    for (var j = 0; j < xs.length - 1; j++) {
      var col = Array.isArray(shade) ? shade[j] || 'var(--card)' : j < (shade || 0) ? 'var(--strand)' : 'var(--card)';
      s += '<rect x="' + (4 + xs[j] * (w - 8)).toFixed(1) + '" y="4" width="' + ((xs[j + 1] - xs[j]) * (w - 8)).toFixed(1) + '" height="' + h + '" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2.5"/>';
    }
    return A.svg(w, h + 8, s, label || 'A bar cut into ' + (xs.length - 1) + (uneven ? ' unequal' : ' equal') + ' parts');
  }
  function pie(d, shade, r, label) { return D.pie(shade || 0, d, r || 50, label || 'A circle cut into ' + d + ' equal parts, ' + (shade || 0) + ' shaded'); }
  /* n granola bars shared among s friends: whole bars dealt first, the rest cut into s pieces */
  function dealBars(n, s) {
    var w = Math.floor(n / s), r = n % s, bw = 230, bh = 40, gap = 12, out = '', y = 4;
    var cols = 2, rows = Math.ceil(n / cols);
    for (var i = 0; i < n; i++) {
      var x = 4 + (i % cols) * (bw + 18), yy = 4 + Math.floor(i / cols) * (bh + gap);
      if (i < w * s) out += '<rect x="' + x + '" y="' + yy + '" width="' + bw + '" height="' + bh + '" rx="6" style="fill:' + SC[i % s] + ';stroke:var(--ink)" stroke-width="2"/>';
      else for (var k = 0; k < s; k++) out += '<rect x="' + (x + k * bw / s).toFixed(1) + '" y="' + yy + '" width="' + (bw / s).toFixed(1) + '" height="' + bh + '" style="fill:' + SC[k] + ';stroke:var(--ink)" stroke-width="2"/>';
    }
    y = 4 + rows * (bh + gap) + 4;
    for (var f = 0; f < s; f++) {
      var lx = 4 + (f % 3) * 156, ly = y + Math.floor(f / 3) * 30;
      out += '<rect x="' + lx + '" y="' + ly + '" width="22" height="22" rx="4" style="fill:' + SC[f] + '" stroke="rgba(0,0,0,.4)"/><text x="' + (lx + 30) + '" y="' + (ly + 18) + '" font-size="18">friend ' + (f + 1) + '</text>';
    }
    return A.svg(2 * bw + 26, y + Math.ceil(s / 3) * 30 + 4, out, n + ' bars shared by ' + s + ' friends. Each friend gets ' + shareWords(n, s) + '.');
  }
  /* thirds above sixths, k thirds shaded and 2k sixths shaded */
  function thirdsSixths(k) {
    var W = 420, s = '';
    s += '<text x="0" y="36" font-size="18" font-weight="700">thirds</text><text x="0" y="104" font-size="18" font-weight="700">sixths</text>';
    var x0 = 80, w = W - x0 - 4;
    for (var i = 0; i < 3; i++) s += '<rect x="' + (x0 + i * w / 3).toFixed(1) + '" y="8" width="' + (w / 3).toFixed(1) + '" height="46" style="fill:' + (i < k ? 'var(--sc)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2.5"/>';
    for (var j = 0; j < 6; j++) s += '<rect x="' + (x0 + j * w / 6).toFixed(1) + '" y="76" width="' + (w / 6).toFixed(1) + '" height="46" style="fill:' + (j < 2 * k ? 'var(--sd)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2.5"/>';
    if (k) s += '<line x1="' + (x0 + k * w / 3) + '" y1="2" x2="' + (x0 + k * w / 3) + '" y2="128" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="6 4"/>';
    return A.svg(W, 132, s, fw(k, 3) + ' and ' + fw(2 * k, 6) + ' of the same bar cover the same amount');
  }

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'fractions';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  /* one bar cut into halves, thirds, fourths and sixths, one part shaded in each (rows: how many to show) */
  function ladder(rows) {
    var s = '', list = [2, 3, 4, 6].slice(0, rows || 4);
    list.forEach(function (d, r) {
      s += '<text x="0" y="' + (r * 62 + 36) + '" font-size="19" font-weight="700">' + MANY[d] + '</text>';
      for (var i = 0; i < d; i++) s += '<rect x="' + (90 + i * 326 / d).toFixed(1) + '" y="' + (r * 62 + 8) + '" width="' + (326 / d).toFixed(1) + '" height="46" style="fill:' + (i === 0 ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2.5"/>';
    });
    return A.svg(420, list.length * 62 + 4, s, 'The same bar cut into ' + list.map(function (d) { return MANY[d]; }).join(', ') + '. One part of each is shaded.');
  }
  function plainBars(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<rect x="' + (4 + (i % 2) * 248) + '" y="' + (4 + Math.floor(i / 2) * 52) + '" width="230" height="40" rx="6" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(486, Math.ceil(n / 2) * 52 + 4, s, n + ' whole bars');
  }
  var cutLab = K.lab(
    '<div class="ctrl"><label for="cd">Number of sharers<select id="cd"><option>2</option><option>3</option><option selected>4</option><option>6</option></select></label><label for="ck">Parts to shade: <output id="cko">1</output><input type="range" id="ck" min="0" max="4" value="1"></label></div><div class="vrow" id="cfig"></div><div class="out" id="cout"></div>',
    function (root, done) {
      var $ = A.$;
      A.bind(root, ['cd', 'ck'], function () {
        var d = +$('#cd', root).value, kEl = $('#ck', root);
        kEl.max = d;
        var k = Math.min(+kEl.value, d); kEl.value = k;
        $('#cko', root).textContent = k;
        $('#cfig', root).innerHTML = '<figure>' + pie(d, k, 60) + '</figure><figure>' + rect(d, k, 300, false, 'A bar cut into ' + d + ' equal parts, ' + k + ' shaded') + '</figure>';
        $('#cout', root).innerHTML = '<p>' + d + ' equal parts are called <b>' + MANY[d] + '</b>. Shaded: <span class="big">' + (k ? fw(k, d) : 'nothing') + '</span>' + (k === d ? ', which is <b>one whole</b>.' : '.') + '</p>';
        if (d === 6 && k === 2) done('Yes. Two sixths are shaded.');
      });
    }, 'Cut the shape into <b>sixths</b>. Then shade <b>two sixths</b>.');
  var dealLab = K.lab(
    '<div class="ctrl"><label for="dn">Bars: <output id="dno">3</output><input type="range" id="dn" min="1" max="10" value="3"></label><label for="ds">Friends<select id="ds"><option>2</option><option>3</option><option selected>4</option><option>6</option></select></label></div><div class="fig" id="dfig"></div><div class="out" id="dout"></div>',
    function (root, done) {
      var $ = A.$;
      A.bind(root, ['dn', 'ds'], function () {
        var n = +$('#dn', root).value, s = +$('#ds', root).value, w = Math.floor(n / s), r = n % s;
        $('#dno', root).textContent = n;
        $('#dfig', root).innerHTML = dealBars(n, s);
        $('#dout', root).innerHTML = '<p>Each friend gets <span class="big">' + shareWords(n, s) + '</span>.</p><p class="t2">' + (w ? w * s + ' bars are shared out whole: ' + w + ' each. ' : 'Not enough bars for a whole one each. ') + (r ? r + ' bar' + (r > 1 ? 's are' : ' is') + ' cut into ' + MANY[s] + '.' : 'Nothing is left over.') + '</p>';
        if (n === 5 && s === 4) done('Yes. 5 bars for 4 friends: 1 whole and one fourth each.');
      });
    }, 'Share <b>5 bars</b> among <b>4 friends</b>. How much does each friend get?');
  var tsLab = K.lab(
    '<div class="ctrl"><label for="tk">Thirds shaded: <output id="tko">0</output><input type="range" id="tk" min="0" max="3" value="0"></label></div><div class="fig" id="tfig"></div><div class="out" id="tout"></div>',
    function (root, done) {
      var $ = A.$;
      A.bind(root, ['tk'], function () {
        var k = +$('#tk', root).value;
        $('#tko', root).textContent = k;
        $('#tfig', root).innerHTML = thirdsSixths(k);
        $('#tout', root).innerHTML = '<p><span class="big">' + (k ? fw(k, 3) + ' = ' + fw(2 * k, 6) : 'zero thirds = zero sixths') + '</span></p><p class="t2">Every third is the same as two sixths.</p>';
        if (k === 2) done('Yes. Two thirds covers the same as four sixths.');
      });
    }, 'Shade <b>two thirds</b>. How many sixths cover the same amount?');
  var LESSONS = [
    { id: 'fair', title: 'Fair shares', sub: 'Equal parts and their names.', concepts: [
      { id: 'equal', title: 'Fair shares are equal parts', exp: ['B1.6'], skill: 'r2-fair',
        body: '<p>A <b>fair share</b> means every part is the <b>same size</b>. Parts that are different sizes are not fair.</p>',
        watch: K.clip([
          ['4 friends share a granola bar.', rect(1, 0, 300, false, 'A whole bar')],
          ['Cut like this, some pieces are big and some are small. Not fair.', rect(4, 0, 300, true)],
          ['Cut like this, every piece is the same size. <b>Fair shares</b>.', rect(4, 0, 300), 2000]
        ]),
        key: '<p>Fair shares: <b>all parts the same size</b>.</p>',
        check: [T('fair'), P('r2-fair', 1)] },
      { id: 'names', title: 'Names of equal parts', exp: ['B1.6'], skill: 'r2-name',
        body: '<p>The number of equal parts gives the name. 2 parts are <b>halves</b>. 3 parts are <b>thirds</b>. 4 parts are <b>fourths</b>. 6 parts are <b>sixths</b>.</p>',
        watch: K.clip([
          ['2 equal parts: halves. One part is <b>one half</b>.', pie(2, 1, 60)],
          ['3 equal parts: thirds. One part is <b>one third</b>.', pie(3, 1, 60)],
          ['4 equal parts: fourths. One part is <b>one fourth</b>.', pie(4, 1, 60)],
          ['6 equal parts: sixths. Two parts are <b>two sixths</b>.', pie(6, 2, 60), 2000]
        ]),
        try: cutLab,
        key: '<p>Count the equal parts to get the name. Count the shaded parts to say how many.</p>',
        mistake: '<p>Naming the parts by the shaded count only ("two" instead of "two sixths"). Ask two questions: how many parts in all, and how many are shaded?</p>',
        check: [T('name'), P('r2-name', 1)] },
      { id: 'whole', title: 'All the parts make a whole', exp: ['B1.6'], skill: 'r2-name',
        body: '<p>All the equal parts together make <b>one whole</b>. 2 halves make a whole. 3 thirds make a whole. 6 sixths make a whole.</p>',
        watch: K.clip([
          ['One sixth.', pie(6, 1, 60)],
          ['Three sixths.', pie(6, 3, 60)],
          ['Six sixths: the <b>whole</b> circle.', pie(6, 6, 60), 2000]
        ]),
        try: { tool: 'fractions', opts: { choices: [2, 3, 4, 6], words: true }, tasks: [
          { do: 'Cut the strip into <b>fourths</b>. Then tap parts until you have shaded <b>one whole</b>.', goal: function (s) { return s[0].d === 4 && s[0].n === 4; }, yes: 'Four fourths make one whole.' },
          { do: 'Now cut it into <b>sixths</b> and shade one whole.', goal: function (s) { return s[0].d === 6 && s[0].n === 6; }, yes: 'Six sixths make one whole.' }
        ] },
        key: '<p>All the parts = one whole.</p>',
        check: [function () { var d = R.pick([2, 3, 4, 6]); return { q: 'How many <b>' + MANY[d] + '</b> make one whole?', type: 'num', answer: d, fig: pie(d, d, 50, 'A circle in ' + d + ' equal parts, all shaded'), hint: 'Count all the equal parts in the circle.', explain: d + ' ' + MANY[d] + ' make one whole.' }; }] }
    ] },
    { id: 'size', title: 'Bigger and smaller shares', sub: 'More sharers, smaller pieces.', concepts: [
      { id: 'smaller', title: 'More sharers, smaller shares', exp: ['B1.6'], skill: 'r2-compare', hard: true,
        body: '<p>When one thing is shared by <b>more</b> people, each piece is <b>smaller</b>. One half is bigger than one sixth.</p>',
        watch: K.clip([
          ['Cut a bar into halves.', ladder(1)],
          ['The same bar in thirds. Each piece is smaller.', ladder(2)],
          ['Fourths. Smaller again.', ladder(3)],
          ['Sixths: the smallest. <b>More pieces means smaller pieces.</b>', ladder(4), 2200]
        ]),
        ways: [
          { label: 'Share a pizza', html: '<p>If 2 friends share a pizza, each gets a big slice. If 6 friends share the same pizza, each gets a small slice.</p><div class="vrow"><figure>' + pie(2, 1, 50) + '<figcaption>2 friends</figcaption></figure><figure>' + pie(6, 1, 50) + '<figcaption>6 friends</figcaption></figure></div>' },
          { label: 'Fraction strips', html: '<p>Each strip is the same whole. Tap one part on each strip and compare the sizes.</p>', tool: 'fractions', opts: { wall: [2, 3, 4, 6], words: true } },
          { label: 'This, not that', html: K.vs('One third is <b>bigger</b> than one sixth. Fewer sharers, bigger pieces.', 'One sixth is not bigger just because 6 is bigger than 3.') }
        ],
        key: '<p>More sharers: <b>smaller</b> pieces.</p>',
        mistake: '<p>Thinking one sixth is bigger because 6 is bigger than 3. Cut two paper strips, one in thirds and one in sixths, and lay one piece of each side by side.</p>',
        check: [T('bigger'), P('r2-compare', 1)] }
    ] },
    { id: 'several', title: 'Sharing more than one thing', sub: 'Wholes first, then cut the rest.', concepts: [
      { id: 'deal', title: 'Wholes first, then cut the rest', exp: ['B1.6'], skill: 'r2-share', hard: true,
        body: '<p>To share several things, first give out <b>whole</b> ones. Then cut each leftover into equal parts, one part for each sharer.</p>',
        watch: K.clip([
          ['4 granola bars for 3 friends.', plainBars(4)],
          ['Give each friend 1 whole bar. 1 bar is left.', dealBars(3, 3)],
          ['Cut the last bar into 3 equal parts: thirds.', dealBars(4, 3)],
          ['Each friend gets <b>1 whole and one third</b>.', dealBars(4, 3), 2200]
        ]),
        try: dealLab,
        ways: [
          { label: 'Draw it', html: '<p>Draw the bars. Draw a line from each bar to a friend. When there are not enough bars for everyone, cut the rest into as many parts as there are friends.</p>' },
          { label: 'With 2 friends', html: '<p>5 sandwiches for 2 friends: 2 whole each, and the last one is cut in half. Each gets <b>2 wholes and one half</b>.</p>' + dealBars(5, 2) }
        ],
        key: '<p>Wholes first. Then cut each leftover into one part per sharer.</p>',
        check: [T('deal'), P('r2-share', 1)] },
      { id: 'fewer', title: 'Fewer things than sharers', exp: ['B1.6'], skill: 'r2-share',
        body: '<p>If there are fewer things than sharers, nobody gets a whole one. Cut <b>every</b> thing into equal parts. 2 muffins for 3 friends: each gets <b>two thirds</b>.</p>',
        watch: K.clip([
          ['2 muffins for 3 friends. Not enough for one each.', dealBars(2, 3).replace(/style="fill:var\(--s[a-z]\)/g, 'style="fill:var(--card)')],
          ['Cut each muffin into thirds.', dealBars(2, 3)],
          ['Each friend gets one third from each muffin: <b>two thirds</b>.', dealBars(2, 3), 2200]
        ]),
        key: '<p>Each friend gets one part from every thing.</p>',
        check: [P('r2-share', 2), P('r2-share', 2)] }
    ] },
    { id: 'same', title: 'One third and two sixths', sub: 'Different names, same amount.', concepts: [
      { id: 'thirdsix', title: 'One third equals two sixths', exp: ['B1.7'], skill: 'r2-thirds', hard: true,
        body: '<p>Cut a bar into thirds. Then cut each third in half. Now there are 6 parts: sixths. <b>One third covers the same amount as two sixths.</b></p>',
        watch: K.clip([
          ['A bar cut into thirds. One third is shaded.', thirdsSixths(1).replace(/<rect[^>]*y="76"[^>]*\/>/g, '').replace('<text x="0" y="104" font-size="18" font-weight="700">sixths</text>', '')],
          ['The same bar cut into sixths, just below.', thirdsSixths(1)],
          ['One third and two sixths end at the same line. <b>Same amount.</b>', thirdsSixths(1), 2200]
        ]),
        try: tsLab,
        ways: [
          { label: 'Pizza', html: '<p>Mia gets one third of a pizza. Jon gets two sixths of the same pizza. They get the same amount. Jon just has more, smaller slices.</p><div class="vrow"><figure>' + pie(3, 1, 50) + '<figcaption>Mia: one third</figcaption></figure><figure>' + pie(6, 2, 50) + '<figcaption>Jon: two sixths</figcaption></figure></div>' },
          { label: 'Fraction strips', html: '<p>Tap parts to shade them. Shade one third on the top strip, then shade sixths below until they line up.</p>', tool: 'fractions', opts: { wall: [1, 3, 6], words: true } },
          { label: 'Fold paper', html: '<p>Fold a paper strip into 3 equal parts and colour one. Fold every part in half. Count the small parts that are coloured: <b>two sixths</b>.</p>' },
          { label: 'Sharing', html: '<p>2 pizzas shared by 6 friends: two sixths each. 1 pizza shared by 3 friends: one third each. Both groups get the same amount.</p>' }
        ],
        key: '<p><b>One third = two sixths</b> of the same whole.</p>',
        mistake: '<p>Saying two sixths is more because 2 is more than 1. Line up the two bars and check where each share ends.</p>',
        check: [T('same'), P('r2-thirds', 1)] }
    ] },
    { id: 'compare', title: 'Compare fair shares', sub: 'Who gets more?', concepts: [
      { id: 'cmp', title: 'Who gets more?', exp: ['B1.6'], skill: 'r2-compare',
        body: '<p>To compare two sharing problems, draw both. Same things, more sharers: each share is smaller. Same sharers, more things: each share is bigger.</p>',
        watch: K.clip([
          ['Group A: 3 friends share 2 pancakes.', dealBars(2, 3)],
          ['Group B: 6 friends share 2 pancakes.', dealBars(2, 6)],
          ['A gets two thirds each. B gets two sixths each. Thirds are bigger, so <b>group A</b> gets more.', '<div class="vrow"><figure>' + dealBars(2, 3) + '<figcaption>A</figcaption></figure><figure>' + dealBars(2, 6) + '<figcaption>B</figcaption></figure></div>', 2400]
        ]),
        key: '<p>Draw both. Then compare the shares.</p>',
        check: [T('cmp'), P('r2-compare', 3)] }
    ] }
  ];

  A.register('fractions', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Fair shares are equal parts</h2>' +
'<p>In math, a <b>fair share</b> means every part is the <b>same size</b>. Parts that are different sizes are not fair shares.</p>' +
'<div class="vrow"><figure>' + rect(4, 0, 260) + '<figcaption>Fair: 4 equal parts</figcaption></figure><figure>' + rect(4, 0, 260, true) + '<figcaption>Not fair: the parts are different sizes</figcaption></figure></div>' +
'<div class="yt" data-yt="fair"></div>' +
'<p>Each kind of equal part has a name.</p>' +
'<div class="vrow"><figure>' + pie(2, 1, 44) + '<figcaption>2 parts: halves<br>one half shaded</figcaption></figure><figure>' + pie(3, 1, 44) + '<figcaption>3 parts: thirds<br>one third shaded</figcaption></figure><figure>' + pie(4, 1, 44) + '<figcaption>4 parts: fourths<br>one fourth shaded</figcaption></figure><figure>' + pie(6, 1, 44) + '<figcaption>6 parts: sixths<br>one sixth shaded</figcaption></figure></div>' +
'<div class="yt" data-yt="name"></div>' +
'<div class="lab"><span class="lt">Try it: cut into equal parts</span>' +
'<div class="ctrl"><label for="cd">Number of sharers<select id="cd"><option>2</option><option selected>3</option><option>4</option><option>6</option></select></label><label for="ck">Parts to shade: <output id="cko">1</output><input type="range" id="ck" min="0" max="3" value="1"></label></div>' +
'<div class="vrow" id="cfig"></div><div class="out" id="cout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The number of equal parts gives the name. 3 equal parts are thirds. It takes all 3 thirds to make one whole.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>More sharers, smaller shares</h2>' +
'<p>When one thing is shared by <b>more</b> people, each piece is <b>smaller</b>.</p>' +
'<div class="fig">' + A.svg(420, 252, (function () {
  var s = '';
  [2, 3, 4, 6].forEach(function (d, r) {
    s += '<text x="0" y="' + (r * 62 + 36) + '" font-size="18" font-weight="700">' + MANY[d] + '</text>';
    for (var i = 0; i < d; i++) s += '<rect x="' + (90 + i * 326 / d).toFixed(1) + '" y="' + (r * 62 + 8) + '" width="' + (326 / d).toFixed(1) + '" height="46" style="fill:' + (i === 0 ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2.5"/>';
  });
  return s;
})(), 'The same bar cut into halves, thirds, fourths and sixths. One half is the biggest piece. One sixth is the smallest.') + '</div>' +
'<div class="eg"><b class="t">Watch me</b><p>Which is bigger, one third or one sixth of the same bar? Thirds are 3 pieces and sixths are 6 pieces. More pieces means smaller pieces. So <b>one third is bigger</b>.</p></div>' +
'<div class="vs"><div><b class="t">This</b><p>One third is <b>bigger</b> than one sixth. Fewer sharers, bigger pieces.</p></div><div><b class="t">Not that</b><p>One sixth is not bigger just because 6 is bigger than 3.</p></div></div>' +
'<div class="yt" data-yt="bigger"></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking one sixth is bigger because 6 is bigger than 3. It is the other way around. The more people share, the less each one gets.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Sharing more than one thing</h2>' +
'<p>To share several things, first give out <b>whole</b> ones. Then cut each leftover into equal parts, one part for each sharer.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>4 granola bars shared by 3 friends. Each friend gets 1 whole bar. 1 bar is left. I cut it into 3 equal parts, so each friend also gets one third. Each friend gets <b>1 whole and one third</b>.</p><div class="fig">' + dealBars(4, 3) + '</div></div>' +
'<div class="yt" data-yt="deal"></div>' +
'<div class="lab"><span class="lt">Try it: share granola bars</span>' +
'<div class="ctrl"><label for="dn">Bars: <output id="dno">5</output><input type="range" id="dn" min="1" max="10" value="5"></label><label for="ds">Friends<select id="ds"><option>2</option><option>3</option><option selected>4</option><option>6</option></select></label></div>' +
'<div class="fig" id="dfig"></div><div class="out" id="dout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Each leftover bar is cut into as many parts as there are friends. With 4 friends, cut it into fourths.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>One third and two sixths</h2>' +
'<p>Cut a bar into thirds. Then cut each third in half. Now there are 6 parts: sixths. <b>One third covers the same amount as two sixths.</b></p>' +
'<div class="fig">' + thirdsSixths(1) + '</div>' +
'<div class="eg"><b class="t">Watch me</b><p>Mia gets one third of a pizza. Jon gets two sixths of the same pizza. They get the <b>same amount</b>. Jon just has more, smaller slices.</p>' +
'<div class="vrow"><figure>' + pie(3, 1, 50, 'A pizza in thirds, one third shaded') + '<figcaption>Mia: one third</figcaption></figure><figure>' + pie(6, 2, 50, 'A pizza in sixths, two sixths shaded') + '<figcaption>Jon: two sixths</figcaption></figure></div></div>' +
'<div class="yt" data-yt="same"></div>' +
'<div class="lab"><span class="lt">Try it: thirds and sixths</span>' +
'<div class="ctrl"><label for="tk">Thirds shaded: <output id="tko">2</output><input type="range" id="tk" min="0" max="3" value="2"></label></div>' +
'<div class="fig" id="tfig"></div><div class="out" id="tout"></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Compare fair shares</h2>' +
'<p>To compare two sharing problems, draw both. Then look at who gets more.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Group A: 3 friends share 2 pancakes. Group B: 6 friends share 2 pancakes. In group A, each friend gets two thirds. In group B, each friend gets two sixths. Thirds are bigger than sixths, so friends in <b>group A get more</b>.</p>' +
'<div class="vrow"><figure>' + dealBars(2, 3) + '<figcaption>Group A</figcaption></figure><figure>' + dealBars(2, 6) + '<figcaption>Group B</figcaption></figure></div></div>' +
'<div class="yt" data-yt="cmp"></div>' +
'<div class="key"><b class="t">Key idea</b><p>Same things, more sharers: each share is smaller. Same sharers, more things: each share is bigger.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function c() {
        var d = +$('#cd', root).value, kEl = $('#ck', root);
        kEl.max = d;
        var k = Math.min(+kEl.value, d);
        kEl.value = k;
        $('#cko', root).textContent = k;
        $('#cfig', root).innerHTML = '<figure>' + pie(d, k, 60) + '</figure><figure>' + rect(d, k, 300, false, 'A bar cut into ' + d + ' equal parts, ' + k + ' shaded') + '</figure>';
        $('#cout', root).innerHTML = '<p>' + d + ' equal parts are called <b>' + MANY[d] + '</b>. Shaded: <span class="big">' + (k ? fw(k, d) : 'nothing') + '</span>' + (k === d ? ', which is <b>one whole</b>.' : '.') + '</p>';
      }
      A.bind(root, ['cd', 'ck'], c);
      function d() {
        var n = +$('#dn', root).value, s = +$('#ds', root).value;
        $('#dno', root).textContent = n;
        $('#dfig', root).innerHTML = dealBars(n, s);
        var w = Math.floor(n / s), r = n % s;
        $('#dout', root).innerHTML = '<p>Each friend gets <span class="big">' + shareWords(n, s) + '</span>.</p><p class="t2">' +
          (w ? w * s + ' bars are shared out whole: ' + w + ' each. ' : 'There are not enough bars for each friend to get a whole one. ') +
          (r ? r + ' bar' + (r > 1 ? 's are' : ' is') + ' cut into ' + MANY[s] + '. Each friend gets one ' + ONE[s] + ' from each cut bar.' : 'Nothing is left over.') + '</p>';
      }
      A.bind(root, ['dn', 'ds'], d);
      function t() {
        var k = +$('#tk', root).value;
        $('#tko', root).textContent = k;
        $('#tfig', root).innerHTML = thirdsSixths(k);
        $('#tout', root).innerHTML = '<p><span class="big">' + (k ? fw(k, 3) + ' = ' + fw(2 * k, 6) : 'zero thirds = zero sixths') + '</span></p><p class="t2">Every third is the same as two sixths.</p>';
      }
      A.bind(root, ['tk'], t);
    },

    turns: {
      fair: function () { var uneven = R.int(0, 1), d = R.pick([3, 4]); return { q: 'Is this bar cut into <b>equal</b> parts?', type: 'mc', options: ['Yes, equal parts', 'No, not equal'], answer: uneven, fig: rect(d, 0, 300, !!uneven), hint: 'Look at the width of each part. Are they all the same?', explain: uneven ? 'The parts are different sizes, so they are not equal.' : 'All the parts are the same size.' }; },
      name: function () { var d = R.pick([2, 3, 4, 6]), o = R.mc(MANY[d], [MANY[2], MANY[3], MANY[4], MANY[6]]); return { q: 'This circle is cut into equal parts. What are the parts called?', type: 'mc', options: o.options, answer: o.answer, fig: pie(d, 0, 56), hint: 'Count the parts. 2 parts are halves, 3 are thirds, 4 are fourths, 6 are sixths.', explain: 'There are ' + d + ' equal parts, so they are ' + MANY[d] + '.' }; },
      bigger: function () { var ds = R.shuffle([2, 3, 4, 6]).slice(0, 2), big = Math.min(ds[0], ds[1]); var o = R.mc('one ' + ONE[big], ['one ' + ONE[Math.max(ds[0], ds[1])]]); return { q: 'Which is bigger: <b>one ' + ONE[ds[0]] + '</b> or <b>one ' + ONE[ds[1]] + '</b> of the same bar?', type: 'mc', options: o.options, answer: o.answer, hint: 'Which one cuts the bar into fewer pieces? Fewer pieces are bigger.', explain: 'One ' + ONE[big] + ' is bigger. ' + MANY[big].charAt(0).toUpperCase() + MANY[big].slice(1) + ' cut the bar into fewer pieces.' }; },
      deal: function () { var s = R.pick([2, 3, 4]), n = s + 1; var right = shareWords(n, s), o = R.mc(right, [shareWords(n + 1, s), '1 whole', fw(1, s)]); return { q: n + ' bars shared by ' + s + ' friends. How much does each friend get?', type: 'mc', options: o.options, answer: o.answer, fig: dealBars(n, s), hint: 'Each friend gets one whole bar first. Then the last bar is cut into ' + s + ' equal parts.', explain: 'Each gets ' + right + '.' }; },
      same: function () { var o = R.mc('the same amount', ['one third is more', 'two sixths is more']); return { q: 'Which is more of the same bar: one third or two sixths?', type: 'mc', options: o.options, answer: o.answer, fig: thirdsSixths(1), hint: 'Look at where the dashed line is. Do the two shaded parts end in the same place?', explain: 'One third and two sixths cover the same amount.' }; },
      cmp: function () { var n = R.int(1, 3), a = R.pick([2, 3]), b = a === 2 ? R.pick([4, 6]) : 6; var o = R.mc(a + ' friends sharing', [b + ' friends sharing', 'They get the same']); return { q: 'Who gets more: one of <b>' + a + ' friends</b> sharing ' + n + ' pizza' + (n > 1 ? 's' : '') + ', or one of <b>' + b + ' friends</b> sharing ' + n + ' pizza' + (n > 1 ? 's' : '') + '?', type: 'mc', options: o.options, answer: o.answer, hint: 'The same pizzas, but more friends. Does each share get bigger or smaller?', explain: 'Fewer friends sharing means bigger shares. Each of the ' + a + ' friends gets ' + shareWords(n, a) + ', and each of the ' + b + ' friends gets ' + shareWords(n, b) + '.' }; }
    },

    quiz: [
      { q: 'This pizza is cut into equal parts. What is one part called?', type: 'mc', options: ['one half', 'one third', 'one fourth', 'one sixth'], answer: 2, fig: pie(4, 1, 56), hint: 'Count the equal parts.', explain: 'There are 4 equal parts, so one part is one fourth.' },
      { q: 'Which bar is cut into <b>fair shares</b>?', type: 'mc', options: [rect(3, 0, 200, true), rect(3, 0, 200, false), rect(4, 0, 200, true)], answer: 1, hint: 'Fair shares are all the same size.', explain: 'Only the middle bar has 3 parts that are all the same size.' },
      { q: 'Which piece is bigger?', type: 'mc', options: ['one half', 'one sixth'], answer: 0, hint: 'Halves cut a thing into 2 pieces. Sixths cut it into 6 pieces.', explain: 'Fewer pieces are bigger. One half is bigger than one sixth.' },
      { q: '5 sandwiches are shared equally by 2 friends. How much does each friend get?', type: 'mc', options: ['2 wholes', '2 wholes and one half', '3 wholes', '5 halves and one whole'], answer: 1, fig: dealBars(5, 2), hint: 'Give out whole sandwiches first. Then cut the one left over into 2 equal parts.', explain: 'Each friend gets 2 whole sandwiches. The last one is cut in half. Each gets 2 wholes and one half.' },
      { q: '2 muffins are shared equally by 3 friends. How much does each friend get?', type: 'mc', options: ['one third', 'two thirds', '1 whole', 'two halves'], answer: 1, fig: dealBars(2, 3), hint: 'There are not enough for each to get a whole one. Cut each muffin into 3 parts.', explain: 'Each muffin is cut into thirds. Each friend gets one third from each muffin: two thirds.' },
      { q: 'Ana eats one third of a pie. Sam eats two sixths of the same kind of pie. Who eats more?', type: 'mc', options: ['Ana', 'Sam', 'They eat the same amount'], answer: 2, fig: thirdsSixths(1), hint: 'Look at the drawing. Does one third end where two sixths end?', explain: 'One third and two sixths are the same amount.' },
      { q: 'How many sixths make one whole?', type: 'num', answer: 6, fig: pie(6, 6, 50, 'A circle cut into 6 equal parts, all shaded'), hint: 'Count the parts it takes to fill the whole circle.', explain: '6 sixths make one whole.' }
    ],

    practice: [
      { id: 'r2-name', name: 'Name the parts', code: 'B1.6', gen: function (lv) {
        var d = R.pick(lv === 1 ? [2, 4] : [2, 3, 4, 6]), k = lv === 1 ? 1 : R.int(1, d - 1);
        var right = fw(k, d), wrong = [fw(k, d === 6 ? 4 : 6), fw(Math.min(k + 1, d), d), fw(d - k === k ? Math.max(1, k - 1) : d - k, d)].filter(function (x) { return x !== right; });
        var o = R.mc(right, wrong);
        return { q: 'How much is shaded?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 3 ? rect(d, k, 320, false, 'A bar cut into ' + d + ' equal parts, ' + k + ' shaded') : pie(d, k, 56), hint: 'Count all the equal parts to get the name. Then count the shaded parts.',
          steps: ['There are ' + d + ' equal parts, so they are ' + MANY[d] + '.', k + ' part' + (k > 1 ? 's are' : ' is') + ' shaded.', 'The shaded amount is ' + right + '.'], explain: right + ' is shaded.' };
      } },
      { id: 'r2-fair', name: 'Fair or not fair', code: 'B1.6', gen: function (lv) {
        var d = R.pick([3, 4]), fair = R.int(0, 1), fig = fair ? (R.int(0, 1) ? pie(d, 0, 56) : rect(d, 0, 300)) : rect(d, 0, 300, true);
        return { q: 'Is this cut into fair shares for ' + d + ' people?', type: 'mc', options: ['Yes, fair shares', 'No, not fair'], answer: fair ? 0 : 1, fig: fig, hint: 'Fair shares are all the same size. Compare the parts.',
          steps: ['Look at each part.', fair ? 'Every part is the same size.' : 'Some parts are bigger than others.', fair ? 'So they are fair shares.' : 'So they are not fair shares.'], explain: fair ? 'All the parts are equal.' : 'The parts are different sizes, so the shares are not fair.' };
      } },
      { id: 'r2-compare', name: 'Which share is bigger?', code: 'B1.6', gen: function (lv) {
        var ds = R.shuffle([2, 3, 4, 6]).slice(0, 2), big = Math.min(ds[0], ds[1]), small = Math.max(ds[0], ds[1]);
        if (lv === 3) {
          var n = R.int(1, 3), o3 = R.mc('one of ' + big + ' friends', ['one of ' + small + ' friends', 'the same']);
          return { q: n + ' pizza' + (n > 1 ? 's are' : ' is') + ' shared by ' + big + ' friends. ' + n + ' pizza' + (n > 1 ? 's are' : ' is') + ' shared by ' + small + ' friends. Who gets more?', type: 'mc', options: o3.options, answer: o3.answer, hint: 'Same number of pizzas. Fewer friends sharing means bigger shares.', steps: ['The pizzas are the same.', big + ' friends is fewer than ' + small + ' friends.', 'Fewer friends get bigger shares: ' + shareWords(n, big) + ' compared with ' + shareWords(n, small) + '.'], explain: 'One of ' + big + ' friends gets more.' };
        }
        var o = R.mc('one ' + ONE[big], ['one ' + ONE[small]]);
        return { q: 'Which is bigger: one ' + ONE[ds[0]] + ' or one ' + ONE[ds[1]] + ' of the same thing?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? '<div class="vrow"><figure>' + rect(ds[0], 1, 240, false, 'one ' + ONE[ds[0]]) + '<figcaption>one ' + ONE[ds[0]] + '</figcaption></figure><figure>' + rect(ds[1], 1, 240, false, 'one ' + ONE[ds[1]]) + '<figcaption>one ' + ONE[ds[1]] + '</figcaption></figure></div>' : '',
          hint: 'More pieces means smaller pieces.', steps: [MANY[big] + ' cut the thing into ' + big + ' pieces.', MANY[small] + ' cut it into ' + small + ' pieces.', 'Fewer pieces are bigger, so one ' + ONE[big] + ' is bigger.'], explain: 'One ' + ONE[big] + ' is bigger than one ' + ONE[small] + '.' };
      } },
      { id: 'r2-share', name: 'Share several things', code: 'B1.6', gen: function (lv) {
        var s = lv === 1 ? 2 : R.pick([2, 3, 4, 6]), n;
        if (lv === 1) n = R.pick([3, 5, 7, 9]);
        else if (lv === 2) n = s * R.int(1, Math.floor(10 / s)) + 1;
        else { n = R.int(1, 10); if (n % s === 0) n = Math.max(1, n - 1); }
        if (n > 10) n = s + 1;
        var right = shareWords(n, s), wrong = [shareWords(n + 1, s), shareWords(Math.max(1, n - 1), s), (Math.floor(n / s) + 1) + (Math.floor(n / s) ? ' wholes' : ' whole'), fw(n % s || 1, s)].filter(function (x) { return x !== right; });
        var o = R.mc(right, wrong);
        return { q: n + ' bars are shared equally by ' + s + ' friends. How much does each friend get?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? dealBars(n, s) : '', hint: 'Give out whole bars first. Cut each leftover bar into ' + s + ' equal parts.',
          steps: ['Whole bars first: each friend gets ' + Math.floor(n / s) + '.', n % s + ' bar' + (n % s === 1 ? ' is' : 's are') + ' left. Cut each into ' + MANY[s] + '.', 'Each friend gets ' + right + '.<div class="fig">' + dealBars(n, s) + '</div>'], explain: 'Each friend gets ' + right + '.' };
      } },
      { id: 'r2-thirds', name: 'Thirds and sixths', code: 'B1.7', gen: function (lv) {
        var k = lv === 1 ? 1 : R.int(1, 2);
        if (lv === 3) {
          var o3 = R.mc(fw(2 * k, 6), [fw(k, 6), fw(k + 1, 6), fw(2 * k + 1, 6)]);
          return { q: 'Kim eats ' + fw(k, 3) + ' of a cake. How many sixths of the same cake is that?', type: 'mc', options: o3.options, answer: o3.answer, hint: 'Each third is the same as two sixths.', steps: ['Cut each third in half to make sixths.', 'Each third becomes 2 sixths.', fw(k, 3) + ' = ' + fw(2 * k, 6) + '.<div class="fig">' + thirdsSixths(k) + '</div>'], explain: fw(k, 3) + ' is ' + fw(2 * k, 6) + '.' };
        }
        var o = R.mc('the same', [fw(k, 3) + ' is more', fw(2 * k, 6) + ' is more']);
        return { q: 'Which is more of the same bar: ' + fw(k, 3) + ' or ' + fw(2 * k, 6) + '?', type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? thirdsSixths(k) : '', hint: 'Cut each third in half. How many sixths is that?',
          steps: ['Each third cut in half makes 2 sixths.', fw(k, 3) + ' becomes ' + fw(2 * k, 6) + '.', 'So they are the same amount.<div class="fig">' + thirdsSixths(k) + '</div>'], explain: fw(k, 3) + ' and ' + fw(2 * k, 6) + ' are the same.' };
      } }
    ]
  });
  /* ---------- more ways to ask each practice skill (answer checks: tests/verify/grade2.js) ---------- */
  var why = K.why, who = K.who;
  /* [parts shaded, parts in all] pairs, no two the same amount */
  function partSet(num, den, lv) {
    var set = [[num, den]], tries = 0;
    while (set.length < 3 && tries++ < 50) {
      var d = R.pick(lv === 1 ? [2, 3, 4] : [2, 3, 4, 6]), n = R.int(1, d - 1);
      if (!set.some(function (p) { return p[0] * d === n * p[1]; })) set.push([n, d]);
    }
    return R.shuffle(set);
  }
  function unitBar(d) { return rect(d, 1, 220, false, 'A bar cut into ' + d + ' equal parts, 1 shaded'); }
  Atlas.Q.shapes(CH, {
    'r2-name': [
      [1, 'tap', function (lv) {
        var den = R.pick(lv === 1 ? [2, 4] : [2, 3, 4, 6]), num = lv === 1 ? 1 : R.int(1, den - 1), set = partSet(num, den, lv);
        return { q: 'Tap the circle with <b>' + fw(num, den) + '</b> shaded.', type: 'tap', tiles: set.map(function (p) { return pie(p[1], p[0], 44); }),
          answer: set.findIndex(function (p) { return p[0] === num && p[1] === den; }), answerText: 'the circle cut into ' + MANY[den] + ' with ' + num + ' shaded',
          hint: MANY[den] + ' means ' + den + ' equal parts. Find a circle with ' + den + ' parts.', steps: ['Look for a circle cut into ' + den + ' equal parts.', 'Then check that ' + num + ' part' + (num > 1 ? 's are' : ' is') + ' shaded.'],
          explain: fw(num, den) + ' is ' + num + ' of ' + den + ' equal parts.', meta: { k: 'r2-name-tap', set: set } };
      }],
      [1, 'match', function (lv) {
        var set = partSet(lv === 1 ? 1 : R.int(1, 2), lv === 1 ? R.pick([2, 4]) : R.pick([3, 4, 6]), lv);
        var p = set.map(function (x) { return [pie(x[1], x[0], 36), fw(x[0], x[1])]; });
        return { q: 'Match each circle to how much is shaded.', type: 'match', pairs: p,
          hint: 'Count all the parts for the name. Count the shaded parts for the number.', steps: ['A circle cut into 4 equal parts with 1 shaded shows one fourth.'],
          explain: set.map(function (x) { return x[1] + ' parts with ' + x[0] + ' shaded is ' + fw(x[0], x[1]); }).join('. ') + '.', meta: { k: 'r2-name-match' } };
      }],
      [2, 'mistake', function (lv) {
        var pairs = [[1, 3], [1, 4], [2, 6], [1, 6], [2, 3]], c = R.pick(pairs), num = c[0], den = c[1], name = who(), truth = !R.int(0, 2);
        var said = truth ? fw(num, den) : (ONE[den - num] ? fw(num, den - num) : fw(den - num, den));
        var right = 'There are ' + den + ' equal parts and ' + num + ' shaded, so it is ' + fw(num, den) + '.';
        return { q: name + ' says <b>' + said + '</b> of this circle is shaded. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: pie(den, num, 56),
          why: why(right, ['Count only the parts that are not shaded.', 'Bigger numbers always mean bigger parts.', 'Count the shaded parts and the unshaded parts as two groups.']),
          hint: 'Count all the equal parts. Then count the shaded ones.', steps: [right], explain: right, meta: { k: 'r2-name-tf' } };
      }]
    ],
    'r2-fair': [
      [1, 'tap', function (lv) {
        var d = R.pick([3, 4]), set = R.shuffle([[d, 0], [d, 1], [d === 3 ? 4 : 3, 0]]);
        return { q: 'Tap the bar cut into <b>fair shares for ' + d + ' people</b>.', type: 'tap', tiles: set.map(function (x) { return rect(x[0], 0, 200, !!x[1]); }),
          answer: set.findIndex(function (x) { return x[0] === d && !x[1]; }), answerText: 'the bar with ' + d + ' parts that are all the same size',
          hint: 'You need ' + d + ' parts, and every part the same size.', steps: ['Count the parts in each bar.', 'Then check that the parts are all the same size.'],
          explain: 'Fair shares for ' + d + ' people means ' + d + ' parts that are all the same size.', meta: { k: 'r2-fair-tap', d: d } };
      }],
      [1, 'mistake', function (lv) {
        var d = R.pick([3, 4]), fair = !R.int(0, 1), name = who();
        var right = fair ? 'All ' + d + ' parts are the same size.' : 'The parts are not the same size, so the shares are not fair.';
        return { q: name + ' says this bar is cut into fair shares because it has ' + d + ' parts. True or false: it is cut into fair shares.', type: 'tf', answer: fair, fig: rect(d, 0, 300, !fair),
          why: why(right, ['Any bar with ' + d + ' parts is fair.', 'Fair shares are always halves.', 'Bigger parts are fairer.']),
          hint: 'Having ' + d + ' parts is not enough. Are the parts the same size?', steps: [right], explain: right, meta: { k: 'r2-fair-tf' } };
      }],
      [2, 'pick', function (lv) {
        var list = [[3, 0], [4, 0], [2, 0], [3, 1], [4, 1]], set = R.shuffle(list).slice(0, 4);
        if (!set.some(function (x) { return !x[1]; })) set[0] = [6, 0];
        if (set.every(function (x) { return !x[1]; })) set[0] = [3, 1];
        set = R.shuffle(set);
        return { q: 'Pick every bar that is cut into <b>fair shares</b>.', type: 'pick', options: set.map(function (x) { return rect(x[0], 0, 200, !!x[1]); }),
          answer: set.map(function (x, j) { return x[1] ? -1 : j; }).filter(function (j) { return j >= 0; }),
          hint: 'Fair shares are all the same size. Compare the parts in each bar.', steps: ['Look at each bar on its own.', 'Keep the bars where every part is the same size.'],
          explain: 'Fair shares are equal parts. The bars with parts of different sizes are not fair.', meta: { k: 'r2-fair-pick' } };
      }]
    ],
    'r2-compare': [
      [1, 'tap', function (lv) {
        var set = R.shuffle([2, 3, 4, 6]).slice(0, lv === 1 ? 2 : 3), big = Math.min.apply(null, set);
        return { q: 'Each bar is the same size. Tap the bar with the <b>biggest</b> shaded part.', type: 'tap', tiles: set.map(unitBar), answer: set.indexOf(big), answerText: 'one ' + ONE[big],
          hint: 'Fewer parts means bigger parts.', steps: ['Count the parts in each bar.', 'The bar with the fewest parts has the biggest part: ' + MANY[big] + '.'],
          explain: 'One ' + ONE[big] + ' is the biggest, because that bar is cut into the fewest parts.', meta: { k: 'r2-cmp-tap' } };
      }],
      [1, 'mistake', function (lv) {
        var ds = R.shuffle([2, 3, 4, 6]).slice(0, 2), name = who(), truth = ds[0] < ds[1];
        var big = Math.min(ds[0], ds[1]), small = Math.max(ds[0], ds[1]);
        var right = 'One ' + ONE[big] + ' is bigger. The thing is cut into fewer parts, so each part is bigger.';
        return { q: name + ' says <b>one ' + ONE[ds[0]] + '</b> of a sandwich is bigger than one ' + ONE[ds[1]] + ' of the same sandwich. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          fig: lv === 1 ? '<div class="vrow">' + unitBar(ds[0]) + unitBar(ds[1]) + '</div>' : '',
          why: why(right, ['One ' + ONE[small] + ' is bigger, because ' + small + ' is more than ' + big + '.', 'They are the same, because both are one part.', 'You cannot tell without a ruler.']),
          hint: 'More parts means smaller parts.', steps: [right], explain: right, meta: { k: 'r2-cmp-tf' } };
      }],
      [2, 'order', function (lv) {
        var ds = R.shuffle([2, 3, 4, 6]).slice(0, lv === 2 ? 3 : 4).sort(function (a, b) { return a - b; });
        return { q: 'These are parts of the same pizza. Put them in order from <b>biggest to smallest</b>.', type: 'order', items: ds.map(function (d) { return 'one ' + ONE[d]; }), first: 'biggest', last: 'smallest',
          hint: 'The fewer the parts, the bigger each part.', steps: ['Halves are the biggest parts, then thirds, then fourths, then sixths.'],
          explain: ds.map(function (d) { return 'one ' + ONE[d]; }).join(', then ') + '.', meta: { k: 'r2-cmp-order' } };
      }]
    ],
    'r2-share': [
      [1, 'story', function (lv) {
        var name = who(), s = lv === 1 ? 2 : R.pick([2, 3, 4]), w = R.int(1, 3), n = s * w + R.int(1, s - 1), c = R.pick(['pancakes', 'granola bars', 'sandwiches', 'muffins']);
        return { q: name + ' shares ' + n + ' ' + c + ' equally with ' + (s === 2 ? '1 friend' : (s - 1) + ' friends') + '. That is ' + s + ' people. How many <b>whole</b> ' + c + ' does each person get?', type: 'num', answer: w,
          fig: lv === 1 ? dealBars(n, s) : '', hint: 'Give out whole ones first, one to each person, until there are not enough to go around.',
          steps: ['Each round gives out ' + s + '.', 'After ' + w + ' rounds, ' + (n - s * w) + ' ' + (n - s * w === 1 ? 'is' : 'are') + ' left. That is not enough for everyone to get one more whole.'],
          explain: 'Each person gets ' + w + ' whole ' + c + '. The rest are cut into ' + MANY[s] + '.', meta: { k: 'r2-share-story' } };
      }],
      [1, 'mistake', function (lv) {
        var s = lv === 1 ? 2 : R.pick([2, 3, 4]), w = R.int(1, 3), n = s * w + R.int(1, s - 1), name = who(), truth = !R.int(0, 2);
        var said = truth ? shareWords(n, s) : w + ' whole' + (w === 1 ? '' : 's'), right = 'Each friend gets ' + shareWords(n, s) + '. The leftover bars are cut into ' + MANY[s] + '.';
        return { q: n + ' bars are shared equally by ' + s + ' friends. ' + name + ' says each friend gets <b>' + said + '</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: lv === 1 ? dealBars(n, s) : '',
          why: why(right, ['The leftover bars are thrown away.', 'Each friend gets one more whole bar.', 'Only one friend gets the leftover bars.']),
          hint: 'Whole bars first. Then share the leftover bars too.', steps: [right], explain: right, meta: { k: 'r2-share-tf' } };
      }],
      [2, 'match', function (lv) {
        var s = R.pick([2, 3, 4]), seen = {}, p = [];
        while (p.length < 3) { var n = R.int(s + 1, 10); var t = shareWords(n, s); if (seen[t]) continue; seen[t] = 1; p.push([n + ' bars for ' + s + ' friends', t]); }
        return { q: 'Match each sharing to what each friend gets.', type: 'match', pairs: p,
          hint: 'Give out whole bars first. Then cut the leftover bars into ' + MANY[s] + '.', steps: ['5 bars for 2 friends: 2 wholes each, and the last bar is cut in half.'],
          explain: p.map(function (x) { return x[0] + ': ' + x[1]; }).join('. ') + '.', meta: { k: 'r2-share-match' } };
      }]
    ],
    'r2-thirds': [
      [1, 'match', function (lv) {
        var p = R.shuffle([[fw(1, 3), fw(2, 6)], [fw(2, 3), fw(4, 6)], [fw(3, 3), fw(6, 6)], [fw(1, 2), fw(3, 6)]]).slice(0, 3);
        return { q: 'Match the amounts that are the same.', type: 'match', pairs: p, fig: lv === 1 ? thirdsSixths(1) : '',
          hint: 'Each third is the same as two sixths.', steps: ['Cut each third in half to make sixths.', 'So one third is two sixths.'],
          explain: p.map(function (x) { return x[0] + ' is ' + x[1]; }).join('. ') + '.', meta: { k: 'r2-thirds-match' } };
      }],
      [1, 'mistake', function (lv) {
        var c = lv === 1 ? 1 : R.int(1, 2), name = who(), truth = !R.int(0, 1), x = truth ? 2 * c : R.pick([c, 2 * c + 1]);
        var right = 'Each third is two sixths, so ' + fw(c, 3) + ' is ' + fw(2 * c, 6) + '.';
        return { q: name + ' says <b>' + fw(c, 3) + '</b> and <b>' + fw(x, 6) + '</b> of the same bar are the same amount. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: lv === 1 ? thirdsSixths(c) : '',
          why: why(right, ['Thirds and sixths can never be the same.', 'The same number of parts is always the same amount.', 'Sixths are bigger than thirds.']),
          hint: 'Cut each third in half. How many sixths is that?', steps: [right], explain: right, meta: { k: 'r2-thirds-tf' } };
      }],
      [2, 'pick', function (lv) {
        var half = !R.int(0, 1), target = half ? 'one half' : 'one whole';
        var opts = half ? [fw(2, 4), fw(3, 6), fw(1, 3), fw(2, 6), fw(3, 4)] : [fw(2, 2), fw(3, 3), fw(6, 6), fw(2, 3), fw(5, 6)];
        opts = R.shuffle(opts);
        var ok = half ? [fw(2, 4), fw(3, 6)] : [fw(2, 2), fw(3, 3), fw(6, 6)];
        return { q: 'Pick every amount that is the same as <b>' + target + '</b> of a bar.', type: 'pick', options: opts, answer: opts.map(function (o, j) { return ok.indexOf(o) >= 0 ? j : -1; }).filter(function (j) { return j >= 0; }),
          hint: half ? 'One half is half of all the parts.' : 'One whole means every part.', steps: [half ? 'Two fourths is 2 of 4 parts, half of them. Three sixths is 3 of 6 parts, half of them.' : 'Two halves, three thirds and six sixths each use all the parts.'],
          explain: ok.join(', ') + ' are the same as ' + target + '.', meta: { k: 'r2-thirds-pick' } };
      }]
    ]
  });
})();
