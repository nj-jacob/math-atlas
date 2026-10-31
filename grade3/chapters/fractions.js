(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var ONE = { 2: 'half', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 8: 'eighth', 10: 'tenth' };
  var MANY = { 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths' };
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  function fr(n, d) { return '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function said(n, d) { return NUMW[n] + ' ' + (n === 1 ? ONE[d] : MANY[d]); }
  function mixed(w, n, d) { return n === 0 ? String(w) : w === 0 ? fr(n, d) : w + ' and ' + fr(n, d); }
  var FILL = 'var(--strand)', EMPTY = 'var(--card)';

  function bar(n, d, w, label) {
    w = w || 480;
    var s = '', cw = w / d;
    for (var i = 0; i < d; i++) s += '<rect x="' + (4 + i * cw) + '" y="4" width="' + cw + '" height="54" style="fill:' + (i < n ? FILL : EMPTY) + ';stroke:var(--ink)" stroke-width="2.5"/>';
    return A.svg(w + 8, 62, s, label || n + ' of ' + d + ' equal parts shaded');
  }
  function pie(n, d, r, label) {
    r = r || 90;
    var cx = r + 6, cy = r + 6, s = '';
    for (var i = 0; i < d; i++) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      s += '<path d="M' + cx + ' ' + cy + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z" style="fill:' + (i < n ? FILL : EMPTY) + ';stroke:var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
    }
    if (d === 1) s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + (n ? FILL : EMPTY) + ';stroke:var(--ink)" stroke-width="2.5"/>';
    return A.svg(2 * r + 12, 2 * r + 12, s, label || n + ' of ' + d + ' equal parts shaded');
  }
  function rectGrid(n, d, label) {
    var cols = d === 6 ? 3 : d === 8 ? 4 : d === 10 ? 5 : d, rows = d / cols, cw = 260 / cols, ch = 150 / rows, s = '';
    for (var i = 0; i < d; i++) s += '<rect x="' + (4 + (i % cols) * cw) + '" y="' + (4 + Math.floor(i / cols) * ch) + '" width="' + cw + '" height="' + ch + '" style="fill:' + (i < n ? FILL : EMPTY) + ';stroke:var(--ink)" stroke-width="2.5"/>';
    return A.svg(268, 158, s, label || n + ' of ' + d + ' equal parts shaded');
  }
  function shape(kind, n, d, label) { return kind === 'pie' ? pie(n, d, 90, label) : kind === 'grid' ? rectGrid(n, d, label) : bar(n, d, 480, label); }
  /* items shared among k people: whole bars each, then the leftover bars cut into k pieces */
  function shareFig(items, k) {
    var each = Math.floor(items / k), left = items - each * k, bw = 64, s = '', rowH = 52, lx = 96;
    var pieceW = bw / k, W = Math.max(380, lx + each * (bw + 8) + left * (pieceW + 4) + 20);
    for (var p = 0; p < k; p++) {
      var y = 6 + p * rowH;
      s += '<text x="6" y="' + (y + 28) + '" font-size="17" class="tb">Person ' + (p + 1) + '</text>';
      for (var i = 0; i < each; i++) s += '<rect x="' + (lx + i * (bw + 8)) + '" y="' + (y + 6) + '" width="' + bw + '" height="34" rx="5" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
      var x = lx + each * (bw + 8) + (each ? 6 : 0);
      for (var j = 0; j < left; j++) s += '<rect x="' + (x + j * (pieceW + 4)) + '" y="' + (y + 6) + '" width="' + pieceW + '" height="34" rx="3" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/>';
    }
    return A.svg(W, k * rowH + 8, s, items + ' bars shared among ' + k + ' people: each gets ' + each + ' whole' + (left ? ' and ' + left + ' piece' + (left > 1 ? 's' : '') + ' of size 1 ' + ONE[k] : ''));
  }
  /* jumps of 1/d on a number line from 0 to 2 */
  function unitLine(n, d) {
    var x0 = 30, x1 = 530, top = Math.max(2, Math.ceil(n / d)), s = '';
    var X = function (v) { return x0 + (x1 - x0) * v / (top * d); };
    s += '<line x1="' + x0 + '" y1="80" x2="' + x1 + '" y2="80" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= top * d; i++) {
      var whole = i % d === 0;
      s += '<line x1="' + X(i) + '" y1="' + (whole ? 66 : 72) + '" x2="' + X(i) + '" y2="' + (whole ? 94 : 88) + '" style="stroke:var(--ink)" stroke-width="' + (whole ? 3 : 2) + '"/>';
      if (whole) s += '<text x="' + X(i) + '" y="118" text-anchor="middle" font-size="22" class="tb">' + i / d + '</text>';
    }
    for (var k = 1; k <= n; k++) s += '<path d="M' + X(k - 1) + ' 76 Q' + ((X(k - 1) + X(k)) / 2) + ' ' + (76 - Math.min(44, (X(k) - X(k - 1)) * 0.9)) + ' ' + X(k) + ' 76" fill="none" style="stroke:var(--strand)" stroke-width="3"/>';
    if (n) s += '<circle cx="' + X(n) + '" cy="80" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(560, 126, s, n + ' jumps of one ' + ONE[d] + ' on a number line');
  }

  A.register('fractions', {
    html:
'<section class="sec"><h2><span class="n">1</span>Equal parts</h2>' +
'<p>A <b>fraction</b> names equal parts of a whole. The bottom number says how many equal parts the whole is cut into. The top number says how many parts we mean.</p>' +
'<div class="vrow"><figure><figcaption>' + fr(3, 4) + ' three fourths</figcaption>' + pie(3, 4, 60) + '</figure><figure><figcaption>' + fr(1, 2) + ' one half</figcaption>' + pie(1, 2, 60) + '</figure><figure><figcaption>' + fr(2, 3) + ' two thirds</figcaption>' + pie(2, 3, 60) + '</figure></div>' +
'<div class="lab"><span class="lt">Try it: cut and shade</span>' +
'<div class="ctrl"><label for="fsk">Shape<select id="fsk"><option value="bar">bar</option><option value="pie" selected>circle</option><option value="grid">rectangle</option></select></label>' +
'<label for="fsd">Equal parts<select id="fsd"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>8</option><option>10</option></select></label>' +
'<label for="fsn">Shaded: <output id="fsno"></output><input type="range" id="fsn" min="0" max="4" value="3"></label></div>' +
'<div class="fig" id="fsfig"></div><div class="out" id="fsout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Parts that are not equal. This shape has 2 parts, but they are not the same size. So the shaded part is <b>not</b> one half.</p>' +
'<div class="fig">' + A.svg(268, 70, '<rect x="4" y="4" width="180" height="60" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2.5"/><rect x="184" y="4" width="80" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>', 'A bar cut into a big part and a small part') + '</div></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A bar is cut into 5 equal parts. 2 parts are shaded. That is ' + fr(2, 5) + ', two fifths.</p><div class="fig">' + bar(2, 5) + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Fair sharing</h2>' +
'<p>To share fairly, everyone gets the same amount. First hand out whole things. If some are left, cut each one into equal pieces, one piece for each person.</p>' +
'<div class="lab"><span class="lt">Try it: share granola bars</span>' +
'<div class="ctrl"><label for="fbi">Bars: <output id="fbio"></output><input type="range" id="fbi" min="1" max="20" value="7"></label>' +
'<label for="fbk">People<select id="fbk"><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option><option>8</option><option>10</option></select></label></div>' +
'<div class="fig" id="fbfig"></div><div class="out" id="fbout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>When you share among 3 people, cut leftovers into <b>thirds</b>. Among 4 people, cut into <b>fourths</b>. The number of people tells you the size of the pieces.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Share 5 bars among 2 people. Each gets 2 whole bars. 1 bar is left, so cut it in half. Each person gets <b>2 and ' + fr(1, 2) + '</b> bars.</p><div class="fig">' + shareFig(5, 2) + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Counting unit fractions</h2>' +
'<p>A <b>unit fraction</b> is one piece, like ' + fr(1, 4) + '. Other fractions are made by counting unit fractions. ' + fr(3, 4) + ' is ' + fr(1, 4) + ' + ' + fr(1, 4) + ' + ' + fr(1, 4) + '. The top number counts the pieces.</p>' +
'<div class="lab"><span class="lt">Try it: count the pieces</span>' +
'<div class="ctrl"><label for="ucd">Piece size<select id="ucd"><option value="2">halves</option><option value="3">thirds</option><option value="4" selected>fourths</option><option value="5">fifths</option><option value="6">sixths</option><option value="8">eighths</option><option value="10">tenths</option></select></label>' +
'<label for="ucn">Pieces: <output id="ucno"></output><input type="range" id="ucn" min="0" max="20" value="3"></label></div>' +
'<div class="fig" id="ucfig"></div><div class="fig" id="ucbars"></div><div class="out" id="ucout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>When you count as many pieces as the bottom number, you have one whole. ' + fr(4, 4) + ' = 1. ' + fr(6, 6) + ' = 1.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Count fifths: ' + fr(1, 5) + ', ' + fr(2, 5) + ', ' + fr(3, 5) + ', ' + fr(4, 5) + ', ' + fr(5, 5) + '. Five fifths make <b>1 whole</b>.</p><div class="fig">' + unitLine(5, 5) + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Same amount, different names</h2>' +
'<p>Some fractions are the same size. Cut each half into 2 pieces and you get fourths. ' + fr(1, 2) + ' is the same amount as ' + fr(2, 4) + '. These are <b>equivalent fractions</b>.</p>' +
'<div class="lab"><span class="lt">Try it: line up the bars</span>' +
'<div class="ctrl"><label for="eqf">Family<select id="eqf"><option value="2,4,8">halves, fourths, eighths</option><option value="3,6">thirds and sixths</option><option value="5,10">fifths and tenths</option></select></label>' +
'<label for="eqn">Shade: <output id="eqno"></output><input type="range" id="eqn" min="0" max="2" value="1"></label></div>' +
'<div class="fig" id="eqfig"></div><div class="out" id="eqout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking ' + fr(1, 8) + ' is bigger than ' + fr(1, 4) + ' because 8 is bigger than 4. More pieces means <b>smaller</b> pieces.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Is ' + fr(1, 3) + ' the same as ' + fr(2, 6) + '? Line up the bars. The shaded parts end at the same place, so <b>yes</b>.</p><div class="fig">' + bar(1, 3) + bar(2, 6) + '</div></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Groups of halves, thirds and fourths</h2>' +
'<p>Sometimes we have many small pieces. 2 halves make 1 whole. So 6 halves make 3 wholes. You can find the wholes by making groups.</p>' +
'<div class="lab"><span class="lt">Try it: put the pieces together</span>' +
'<div class="ctrl"><label for="gpd">Piece<select id="gpd"><option value="2" selected>one half</option><option value="3">one third</option><option value="4">one fourth</option></select></label>' +
'<label for="gpn">How many pieces: <output id="gpno"></output><input type="range" id="gpn" min="1" max="12" value="6"></label></div>' +
'<div class="fig" id="gpfig"></div><div class="out" id="gpout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Group the pieces by the bottom number. Halves in groups of 2. Thirds in groups of 3. Fourths in groups of 4.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A recipe uses ' + fr(1, 4) + ' cup of oats for each batch. How many cups for 8 batches? 8 fourths, in groups of 4, make <b>2 cups</b>.</p></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'What fraction is shaded?', fig: bar(1, 4, 300), options: [fr(1, 4), fr(1, 3), fr(4, 1)], answer: 0, why: 'Count all the equal parts for the bottom number: 4. Count the shaded parts for the top number: 1.' },
        { q: 'What fraction is shaded?', fig: pie(5, 6, 60), options: [fr(5, 6), fr(6, 5), fr(1, 6)], answer: 0, why: 'There are 6 equal parts. 5 are shaded.' },
        { q: 'Is this shape cut into fourths?', fig: A.svg(268, 70, '<rect x="4" y="4" width="40" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><rect x="44" y="4" width="100" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><rect x="144" y="4" width="60" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/><rect x="204" y="4" width="60" height="60" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>', 'A bar cut into 4 parts of different sizes'), options: ['Yes', 'No'], answer: 1, why: 'There are 4 parts, but they are not equal. Fourths must be the same size.' }
      ],
      s2: [
        { q: 'Share 6 bars among 3 people. How many does each get?', options: ['2', '3', '2 and ' + fr(1, 3)], answer: 0, why: '6 shares evenly: 3 &times; 2 = 6. Nothing is left to cut.' },
        { q: 'Share 3 bars between 2 people. How much does each get?', options: ['1', '1 and ' + fr(1, 2), '2'], answer: 1, why: 'Each gets 1 whole. 1 bar is left, so cut it in half.' },
        { q: 'Share 1 pizza among 4 people. How much does each get?', options: [fr(1, 4), fr(1, 2), '4'], answer: 0, why: 'Cut the pizza into 4 equal pieces. Each person gets 1 of the 4.' }
      ],
      s3: [
        { q: fr(1, 3) + ' + ' + fr(1, 3) + ' = ?', options: [fr(2, 3), fr(2, 6), fr(1, 6)], answer: 0, why: 'Count the thirds: 1 third, 2 thirds. The size of the pieces does not change.' },
        { q: 'How many ' + fr(1, 8) + ' pieces make ' + fr(5, 8) + '?', options: ['5', '8', '13'], answer: 0, why: 'The top number counts the pieces.' },
        { q: fr(3, 3) + ' is the same as:', options: ['1', '3', '0'], answer: 0, why: '3 thirds fill the whole.' }
      ],
      s4: [
        { q: fr(1, 2) + ' = ___ eighths', options: ['2', '4', '8'], answer: 1, why: 'Each half is cut into 4 eighths.' },
        { q: 'Which is equal to ' + fr(2, 5) + '?', options: [fr(4, 10), fr(2, 10), fr(5, 10)], answer: 0, why: 'Each fifth is 2 tenths. 2 fifths are 4 tenths.' },
        { q: 'Which piece is bigger?', options: [fr(1, 3), fr(1, 6)], answer: 0, why: 'Cutting a whole into 3 pieces makes bigger pieces than cutting it into 6.' }
      ],
      s5: [
        { q: 'How many wholes are 4 halves?', options: ['2', '4', '8'], answer: 0, why: 'Make groups of 2 halves. 4 halves make 2 groups.' },
        { q: 'How many wholes are 9 thirds?', options: ['3', '6', '9'], answer: 0, why: 'Make groups of 3 thirds. 9 thirds make 3 groups.' },
        { q: '5 fourths is:', options: ['1 and ' + fr(1, 4), '5', '1'], answer: 0, why: '4 fourths make 1 whole. 1 fourth is left.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function fs() {
        var k = $('#fsk', root).value, d = +$('#fsd', root).value, sl = $('#fsn', root);
        sl.max = d; if (+sl.value > d) sl.value = d;
        var n = +sl.value;
        $('#fsno', root).textContent = n;
        $('#fsfig', root).innerHTML = shape(k, n, d);
        $('#fsout', root).innerHTML = '<p><span class="big">' + fr(n, d) + '</span> &nbsp; ' + said(n, d) + '</p><p>' + d + ' equal parts. ' + n + ' shaded. ' + (d - n) + ' not shaded, which is ' + fr(d - n, d) + '.' + (n === d ? ' All the parts are shaded: ' + fr(d, d) + ' = 1 whole.' : '') + '</p>';
      }
      A.bind(root, ['fsk', 'fsd', 'fsn'], fs);
      function fb() {
        var items = +$('#fbi', root).value, k = +$('#fbk', root).value, each = Math.floor(items / k), left = items - each * k;
        $('#fbio', root).textContent = items;
        $('#fbfig', root).innerHTML = shareFig(items, k);
        $('#fbout', root).innerHTML = '<p><span class="big">Each person gets ' + mixed(each, left, k) + ' bar' + (each + left / k > 1 ? 's' : '') + '</span></p><p>' +
          (each ? 'First, each person gets ' + each + ' whole bar' + (each > 1 ? 's' : '') + '. ' : 'There are fewer bars than people, so no one gets a whole bar. ') +
          (left ? left + ' bar' + (left > 1 ? 's are' : ' is') + ' left. Cut ' + (left > 1 ? 'each one' : 'it') + ' into ' + MANY[k] + '. Each person gets ' + said(left, k) + '.' : 'Nothing is left over.') + '</p>';
      }
      A.bind(root, ['fbi', 'fbk'], fb);
      function uc() {
        var d = +$('#ucd', root).value, sl = $('#ucn', root);
        sl.max = 2 * d; if (+sl.value > 2 * d) sl.value = 2 * d;
        var n = +sl.value, w = Math.floor(n / d), r = n % d, parts = [];
        $('#ucno', root).textContent = n;
        for (var i = 0; i < Math.min(n, 6); i++) parts.push(fr(1, d));
        $('#ucfig', root).innerHTML = unitLine(n, d);
        var bars = '';
        for (var b = 0; b < Math.max(1, Math.ceil(n / d)); b++) bars += bar(Math.min(d, Math.max(0, n - b * d)), d, 300);
        $('#ucbars', root).innerHTML = bars;
        $('#ucout', root).innerHTML = '<p><span class="big">' + (n ? (n <= 6 ? parts.join(' + ') : n + ' &times; ' + fr(1, d)) + ' = ' + fr(n, d) : '0 pieces') + '</span></p><p>' + said(n, d) + (n >= d ? ' = ' + mixed(w, r, d) + (w === 1 && !r ? ' whole' : ' wholes') : '') + '.</p>';
      }
      A.bind(root, ['ucd', 'ucn'], uc);
      function eq() {
        var fam = $('#eqf', root).value.split(',').map(Number), base = fam[0], sl = $('#eqn', root);
        sl.max = base; if (+sl.value > base) sl.value = base;
        var n = +sl.value, h = '', names = [];
        $('#eqno', root).textContent = n + ' ' + (n === 1 ? ONE[base] : MANY[base]);
        fam.forEach(function (d) { var m = n * d / base; h += '<p class="t2" style="margin:.2em 0;text-align:center">' + fr(m, d) + ' ' + said(m, d) + '</p>' + bar(m, d, 400); names.push(fr(m, d)); });
        $('#eqfig', root).innerHTML = h;
        $('#eqout', root).innerHTML = '<p><span class="big">' + names.join(' = ') + '</span></p><p>The shaded parts line up, so these fractions are equal. Each ' + ONE[base] + ' is cut into ' + fam.slice(1).map(function (d) { return d / base + ' ' + MANY[d]; }).join(' or ') + '.</p>';
      }
      A.bind(root, ['eqf', 'eqn'], eq);
      function gp() {
        var d = +$('#gpd', root).value, n = +$('#gpn', root).value, w = Math.floor(n / d), r = n % d;
        $('#gpno', root).textContent = n;
        var s = '', size = 70, x = 6;
        for (var g = 0; g < Math.ceil(n / d); g++) {
          var cnt = Math.min(d, n - g * d);
          s += pieSlice(x, cnt, d, size); x += 2 * size + 24;
        }
        function pieSlice(x0, c, dd, r0) {
          var cx = x0 + r0, cy = r0 + 6, t = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r0 + '" style="fill:none;stroke:var(--line)" stroke-width="2" stroke-dasharray="5 4"/>';
          for (var i = 0; i < c; i++) {
            var a0 = -Math.PI / 2 + i * 2 * Math.PI / dd, a1 = a0 + 2 * Math.PI / dd;
            t += '<path d="M' + cx + ' ' + cy + ' L' + (cx + r0 * Math.cos(a0)).toFixed(1) + ' ' + (cy + r0 * Math.sin(a0)).toFixed(1) + ' A' + r0 + ' ' + r0 + ' 0 0 1 ' + (cx + r0 * Math.cos(a1)).toFixed(1) + ' ' + (cy + r0 * Math.sin(a1)).toFixed(1) + ' Z" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/>';
          }
          return t;
        }
        var W = Math.max(200, x);
        $('#gpfig', root).innerHTML = A.svg(W, 2 * size + 12, s, n + ' ' + MANY[d] + ' grouped into wholes');
        $('#gpout', root).innerHTML = '<p><span class="big">' + n + ' ' + (n === 1 ? ONE[d] : MANY[d]) + ' = ' + mixed(w, r, d) + '</span></p><p>' + (w ? w + ' full group' + (w > 1 ? 's' : '') + ' of ' + d + ' make ' + w + ' whole' + (w > 1 ? 's' : '') + '. ' : 'There are not enough pieces for a whole yet. ') + (r ? said(r, d) + ' left over.' : '') + '</p>';
      }
      A.bind(root, ['gpd', 'gpn'], gp);
    },

    quiz: [
      { q: 'What fraction of the circle is shaded?', type: 'mc', options: [fr(3, 8), fr(5, 8), fr(3, 5), fr(8, 3)], answer: 0, fig: pie(3, 8, 70),
        hint: 'Count all the equal parts. Then count the shaded parts.', explain: '3 of the 8 equal parts are shaded: ' + fr(3, 8) + '.' },
      { q: 'Share 7 sandwiches equally among 2 people. How much does each person get?', type: 'mc', options: ['3', '3 and ' + fr(1, 2), '4', '3 and ' + fr(1, 7)], answer: 1, fig: shareFig(7, 2),
        hint: 'Hand out whole sandwiches first. Cut the leftover one.', explain: 'Each gets 3 whole. The last one is cut in half: 3 and ' + fr(1, 2) + '.' },
      { q: 'Which is the same as ' + fr(1, 6) + ' + ' + fr(1, 6) + ' + ' + fr(1, 6) + ' + ' + fr(1, 6) + '?', type: 'mc', options: [fr(4, 6), fr(4, 24), fr(1, 24), fr(6, 4)], answer: 0,
        hint: 'Count the sixths.', explain: '4 pieces of one sixth make ' + fr(4, 6) + '.' },
      { q: fr(3, 4) + ' = ___ eighths. What number goes in the blank?', type: 'num', answer: 6, fig: bar(3, 4, 400, '3 of 4 parts shaded') + bar(0, 8, 400, 'A bar cut into 8 parts'),
        hint: 'Each fourth is 2 eighths.', explain: '3 fourths = 6 eighths.' },
      { q: 'Which piece is the smallest?', type: 'mc', options: [fr(1, 2), fr(1, 5), fr(1, 10), fr(1, 3)], answer: 2,
        hint: 'The more pieces a whole is cut into, the smaller each one is.', explain: fr(1, 10) + ' is a whole cut into 10 pieces, the most, so it is the smallest.' },
      { q: 'A muffin recipe uses ' + fr(1, 3) + ' cup of milk. How many cups of milk do 6 batches use?', type: 'num', answer: 2,
        hint: 'Make groups of 3 thirds.', explain: '6 thirds make 2 groups of 3 thirds, so 2 cups.' },
      { q: 'Share 4 pizzas among 3 friends. How much does each friend get?', type: 'mc', options: ['1 and ' + fr(1, 3), '1 and ' + fr(1, 4), fr(3, 4), '1'], answer: 0,
        hint: 'Each friend gets 1 whole pizza first. How many are left, and how many people share them?', explain: 'Each gets 1 whole. 1 pizza is left, cut into thirds: 1 and ' + fr(1, 3) + '.' }
    ],

    practice: [
      { id: 'fr-name', name: 'Name the fraction', code: 'B1.6', gen: function (lv) {
        var d = lv === 1 ? R.pick([2, 4]) : R.pick([2, 3, 4, 5, 6, 8, 10]), n = R.int(1, d - 1), kind = R.pick(['bar', 'pie', 'grid']), not = lv === 3;
        var ans = not ? d - n : n;
        var o = R.mc(fr(ans, d), [fr(d - ans === ans ? ans + 1 : d - ans, d), fr(d, ans), fr(ans, d + 1), fr(ans, n + (d - n) + 2)]);
        return { q: 'What fraction is ' + (not ? '<b>not</b> shaded' : 'shaded') + '?', type: 'mc', options: o.options, answer: o.answer, fig: shape(kind, n, d, n + ' of ' + d + ' equal parts shaded'),
          hint: 'The bottom number is how many equal parts in all. The top number is how many parts ' + (not ? 'are not shaded' : 'are shaded') + '.',
          steps: ['Count all the equal parts: ' + d + '. That is the bottom number.', 'Count the parts that are ' + (not ? 'not shaded' : 'shaded') + ': ' + ans + '. That is the top number.', 'The fraction is ' + fr(ans, d) + ', ' + said(ans, d) + '.'],
          explain: fr(ans, d) + ' is ' + (not ? 'not shaded' : 'shaded') + '.' };
      } },
      { id: 'fr-share', name: 'Fair shares', code: 'B1.6', gen: function (lv) {
        var k = lv === 1 ? 2 : lv === 2 ? R.pick([3, 4]) : R.pick([3, 4, 5, 6, 8, 10]), items;
        do { items = R.int(1, lv === 1 ? 9 : 20); } while (items % k === 0);
        var w = Math.floor(items / k), l = items - w * k;
        var right = mixed(w, l, k), seen = {}, wrong = [];
        seen[(w + l / k).toFixed(6)] = 1;
        [[w + 1, 0, k], [w, l, k === 10 ? 8 : k === 8 ? 10 : k + 1], [w, 0, k], [w + 1, l, k], [w, 1, k === 2 ? 3 : 2]].forEach(function (c) {
          var v = (c[0] + c[1] / c[2]).toFixed(6);
          if (!seen[v] && (c[0] || c[1]) && c[1] < c[2]) { seen[v] = 1; wrong.push(mixed(c[0], c[1], c[2])); }
        });
        var o = R.mc(right, wrong);
        return { q: 'Share ' + items + ' granola bars equally among ' + k + ' people. How much does each person get?', type: 'mc', options: o.options, answer: o.answer,
          fig: lv < 3 ? '' : '',
          hint: 'Hand out whole bars first. Then cut each leftover bar into ' + MANY[k] + '.',
          steps: [k + ' &times; ' + w + ' = ' + w * k + ', so each person gets ' + w + ' whole bar' + (w === 1 ? '' : 's') + '.', items + ' &minus; ' + w * k + ' = ' + l + ' bar' + (l > 1 ? 's' : '') + ' left. Cut ' + (l > 1 ? 'each' : 'it') + ' into ' + MANY[k] + '.', 'Each person gets ' + said(l, k) + ' more, so ' + right + '.<div class="fig">' + shareFig(items, k) + '</div>'],
          explain: 'Each person gets ' + right + '.' };
      } },
      { id: 'fr-unit', name: 'Count unit fractions', code: 'B2.8', gen: function (lv) {
        var d = R.pick([2, 3, 4, 5, 6, 8, 10]), n = lv === 3 ? R.int(d + 1, 2 * d - 1) : R.int(2, d);
        if (lv === 1) {
          var parts = []; for (var i = 0; i < n; i++) parts.push(fr(1, d));
          var o = R.mc(fr(n, d), [fr(n, d * n), fr(1, d * n), fr(d, n)].filter(function (x) { return x !== fr(n, d); }));
          return { q: parts.join(' + ') + ' = ?', type: 'mc', options: o.options, answer: o.answer, fig: unitLine(n, d),
            hint: 'Count the pieces. They are all ' + MANY[d] + '.', steps: ['Every piece is one ' + ONE[d] + '.', 'There are ' + n + ' pieces.', n + ' ' + MANY[d] + ' is ' + fr(n, d) + '.'], explain: 'The answer is ' + fr(n, d) + '.' };
        }
        if (lv === 2) return { q: 'How many ' + fr(1, d) + ' pieces make ' + fr(n, d) + '?', type: 'num', answer: n,
          hint: 'The top number counts the pieces.', steps: ['The bottom number, ' + d + ', tells the size: ' + MANY[d] + '.', 'The top number, ' + n + ', counts them.', 'So ' + n + ' pieces.'], explain: fr(n, d) + ' is ' + n + ' pieces of ' + fr(1, d) + '.' };
        return { q: fr(n, d) + ' = 1 and how many ' + MANY[d] + '?', type: 'num', answer: n - d, fig: unitLine(n, d),
          hint: d + ' ' + MANY[d] + ' make 1 whole. How many are left?', steps: ['Take ' + d + ' ' + MANY[d] + ' to make 1 whole.', n + ' &minus; ' + d + ' = ' + (n - d) + '.', fr(n, d) + ' = 1 and ' + fr(n - d, d) + '.'], explain: fr(n, d) + ' = 1 and ' + fr(n - d, d) + '.' };
      } },
      { id: 'fr-equiv', name: 'Equivalent fractions', code: 'B1.7', gen: function (lv) {
        var pairs = lv === 1 ? [[2, 4], [2, 8], [4, 8]] : [[2, 4], [2, 8], [4, 8], [3, 6], [5, 10]];
        var pr = R.pick(pairs), a = pr[0], b = pr[1], n = R.int(1, a - 1), m = n * b / a;
        if (lv < 3) return { q: fr(n, a) + ' = ___ ' + MANY[b] + '. What number goes in the blank?', type: 'num', answer: m,
          fig: lv === 1 ? bar(n, a, 400) + bar(m, b, 400) : '',
          hint: 'Each ' + ONE[a] + ' is ' + b / a + ' ' + MANY[b] + '.',
          steps: ['1 ' + ONE[a] + ' = ' + b / a + ' ' + MANY[b] + '.', n + ' ' + (n === 1 ? ONE[a] : MANY[a]) + ' = ' + n + ' &times; ' + b / a + ' ' + MANY[b] + '.', 'That is ' + m + ' ' + MANY[b] + '.<div class="fig">' + bar(n, a, 400) + bar(m, b, 400) + '</div>'],
          explain: fr(n, a) + ' = ' + fr(m, b) + '.' };
        var wrong = [fr(n, b), fr(m + 1, b), fr(m, b * 2 > 10 ? b - 1 : b * 2)].filter(function (x) { return x !== fr(m, b); });
        var o = R.mc(fr(m, b), wrong);
        return { q: 'Which fraction is equal to ' + fr(n, a) + '?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Picture the bars. Cut each ' + ONE[a] + ' into equal smaller pieces.',
          steps: ['Each ' + ONE[a] + ' can be cut into ' + b / a + ' ' + MANY[b] + '.', n + ' ' + (n === 1 ? ONE[a] : MANY[a]) + ' become ' + m + ' ' + MANY[b] + '.', 'So ' + fr(n, a) + ' = ' + fr(m, b) + '.<div class="fig">' + bar(n, a, 400) + bar(m, b, 400) + '</div>'],
          explain: fr(n, a) + ' = ' + fr(m, b) + '.' };
      } },
      { id: 'fr-groups', name: 'Groups of halves, thirds and fourths', code: 'B2.7', gen: function (lv) {
        var d = lv === 1 ? 2 : R.pick([2, 3, 4]), w = R.int(1, lv === 3 ? 4 : 5), n = w * d;
        if (lv === 3) {
          var thing = R.pick([['A recipe uses', 'cup of flour', 'batches', 'cups of flour'], ['Each lap is', 'kilometre', 'laps', 'kilometres'], ['Each glass holds', 'litre', 'glasses', 'litres']]);
          return { q: thing[0] + ' ' + fr(1, d) + ' ' + thing[1] + '. How many ' + thing[3] + ' for ' + n + ' ' + thing[2] + '?', type: 'num', answer: w,
            hint: 'You have ' + n + ' ' + MANY[d] + '. Make groups of ' + d + '.',
            steps: [n + ' ' + thing[2] + ' means ' + n + ' ' + MANY[d] + '.', d + ' ' + MANY[d] + ' make 1 whole.', n + ' &divide; ' + d + ' = ' + w + '.'],
            explain: n + ' ' + MANY[d] + ' = ' + w + ' wholes.' };
        }
        return { q: 'How many wholes are ' + n + ' ' + MANY[d] + '?', type: 'num', answer: w,
          hint: 'Put the ' + MANY[d] + ' in groups of ' + d + '. Each group is 1 whole.',
          steps: [d + ' ' + MANY[d] + ' make 1 whole.', 'Count by ' + d + 's to ' + n + ': that is ' + w + ' groups.', n + ' ' + MANY[d] + ' = ' + w + ' wholes.'],
          explain: n + ' ' + MANY[d] + ' = ' + w + ' whole' + (w > 1 ? 's' : '') + '.' };
      } }
    ]
  });
})();
