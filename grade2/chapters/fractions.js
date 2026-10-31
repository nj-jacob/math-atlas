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

  A.register('fractions', {
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
})();
