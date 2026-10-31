(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var DOT = 'var(--strand)', DOT2 = 'var(--hi)';

  /* g plates with n counters on each */
  function groups(g, n, label) {
    var per = g > 5 ? 5 : g, rows = Math.ceil(g / per), pw = 104, ph = 104, s = '';
    for (var i = 0; i < g; i++) {
      var cx = 8 + (i % per) * (pw + 6) + pw / 2, cy = 8 + Math.floor(i / per) * (ph + 6) + ph / 2;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (pw / 2) + '" style="fill:color-mix(in srgb,var(--strand) 8%,var(--card));stroke:var(--strand)" stroke-width="2.5"/>';
      var cols = n <= 4 ? 2 : n <= 9 ? 3 : 4, r = n <= 4 ? 13 : n <= 9 ? 11 : 9, gap = r * 2.4, w = (Math.min(n, cols) - 1) * gap, hh = (Math.ceil(n / cols) - 1) * gap;
      for (var k = 0; k < n; k++) s += '<circle cx="' + (cx - w / 2 + (k % cols) * gap) + '" cy="' + (cy - hh / 2 + Math.floor(k / cols) * gap) + '" r="' + r + '" style="fill:' + DOT2 + ';stroke:var(--ink)" stroke-width="1.5"/>';
    }
    return A.svg(per * (pw + 6) + 10, rows * (ph + 6) + 10, s, label || g + ' groups of ' + n);
  }
  /* r rows by c columns of dots. split: draw a line after that many rows */
  function array(r, c, split, label) {
    var gap = Math.min(38, 360 / Math.max(r, c)), rad = gap * 0.36, s = '', top = 30, left = 40;
    for (var i = 0; i < r; i++) for (var j = 0; j < c; j++) s += '<circle cx="' + (left + j * gap + gap / 2) + '" cy="' + (top + i * gap + gap / 2) + '" r="' + rad + '" style="fill:' + (split && i >= split ? DOT2 : DOT) + ';stroke:var(--ink)" stroke-width="1"/>';
    s += '<text x="' + (left + c * gap / 2) + '" y="20" text-anchor="middle" font-size="18" class="tb">' + c + ' in each row</text>';
    s += '<text x="' + (left - 10) + '" y="' + (top + r * gap / 2 + 6) + '" text-anchor="end" font-size="18" class="tb">' + r + '</text>';
    if (split && split < r) s += '<line x1="' + (left - 4) + '" y1="' + (top + split * gap) + '" x2="' + (left + c * gap + 4) + '" y2="' + (top + split * gap) + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="6 4"/>';
    return A.svg(Math.max(240, left + c * gap + 10), top + r * gap + 8, s, label || r + ' rows of ' + c);
  }
  /* 1 to 100 with the multiples of k shaded */
  function chart100(k) {
    var sz = 46, s = '';
    for (var i = 1; i <= 100; i++) {
      var x = 4 + ((i - 1) % 10) * sz, y = 4 + Math.floor((i - 1) / 10) * sz, on = i % k === 0;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:' + (on ? 'color-mix(in srgb,var(--strand) 70%,var(--card))' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1.5"/>' +
        '<text x="' + (x + sz / 2) + '" y="' + (y + sz / 2 + 7) + '" text-anchor="middle" font-size="19"' + (on ? ' font-weight="700" style="fill:#fff"' : ' class="t2"') + '>' + i + '</text>';
    }
    return A.svg(sz * 10 + 8, sz * 10 + 8, s, 'Hundred chart with the multiples of ' + k + ' shaded');
  }
  /* deal total counters onto k plates; leftovers below */
  function share(total, k) {
    var each = Math.floor(total / k), left = total - each * k;
    var s = groups(k, each, 'Share ' + total + ' among ' + k + ': ' + each + ' each' + (left ? ', ' + left + ' left over' : ''));
    if (left) {
      var t = '';
      for (var i = 0; i < left; i++) t += '<circle cx="' + (20 + i * 30) + '" cy="20" r="11" style="fill:var(--bad);stroke:var(--ink)" stroke-width="1.5"/>';
      s += '<p class="t2" style="text-align:center;margin:.3em 0 0">Left over:</p>' + A.svg(Math.max(60, left * 30 + 10), 40, t, left + ' left over');
    }
    return s;
  }
  var THINGS = {
    2: [['bike', 'bikes', 'wheel', 'wheels'], ['pair of socks', 'pairs of socks', 'sock', 'socks'], ['person', 'people', 'eye', 'eyes']],
    5: [['hand', 'hands', 'finger', 'fingers'], ['star', 'stars', 'point', 'points'], ['nickel', 'nickels', 'cent', 'cents']],
    10: [['dime', 'dimes', 'cent', 'cents'], ['ten-pack of pencils', 'ten-packs of pencils', 'pencil', 'pencils'], ['row of a hundred chart', 'rows of a hundred chart', 'square', 'squares']]
  };
  function ratioFig(k, n, label) {
    var s = '', w = 110;
    for (var i = 0; i < n; i++) {
      var x = 6 + (i % 5) * w, y = 6 + Math.floor(i / 5) * 72;
      s += '<rect x="' + x + '" y="' + y + '" width="' + (w - 10) + '" height="62" rx="10" style="fill:color-mix(in srgb,var(--strand) 10%,var(--card));stroke:var(--strand)" stroke-width="2"/>';
      for (var j = 0; j < k; j++) s += '<circle cx="' + (x + 14 + (j % 5) * 18) + '" cy="' + (y + 20 + Math.floor(j / 5) * 22) + '" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1"/>';
    }
    return A.svg(5 * w + 8, Math.ceil(n / 5) * 72 + 8, s, label);
  }

  A.register('multiply-divide', {
    html:
'<section class="sec"><h2><span class="n">1</span>Equal groups</h2>' +
'<p><b>Multiplying</b> is a fast way to add equal groups. <span class="math">3 &times; 4</span> means "3 groups of 4". You can add 4 + 4 + 4, or say 3 &times; 4 = 12.</p>' +
'<div class="lab"><span class="lt">Try it: make equal groups</span>' +
'<div class="ctrl"><label for="egg">Number of groups: <output id="eggo"></output><input type="range" id="egg" min="1" max="10" value="3"></label>' +
'<label for="egn">In each group: <output id="egno"></output><input type="range" id="egn" min="1" max="10" value="4"></label></div>' +
'<div class="fig" id="egfig"></div><div class="out" id="egout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The groups must be <b>equal</b>. 3 groups of 4 is 12. If one group had 5, it would not be 3 &times; 4.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>There are 5 plates with 2 grapes on each. 5 groups of 2: 2 + 2 + 2 + 2 + 2 = 10, so <b>5 &times; 2 = 10</b>.</p><div class="fig">' + groups(5, 2) + '</div></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Arrays and turn-around facts</h2>' +
'<p>An <b>array</b> puts things in equal rows. 4 rows of 6 is <span class="math">4 &times; 6 = 24</span>. Turn the array on its side and you get 6 rows of 4. It is the same number of dots, so <span class="math">6 &times; 4 = 24</span> too.</p>' +
'<div class="lab"><span class="lt">Try it: build and split an array</span>' +
'<div class="ctrl"><label for="arr">Rows: <output id="arro"></output><input type="range" id="arr" min="1" max="10" value="4"></label>' +
'<label for="arc">In each row: <output id="arco"></output><input type="range" id="arc" min="1" max="10" value="6"></label>' +
'<label for="ars">Split after row: <output id="arso"></output><input type="range" id="ars" min="0" max="9" value="0"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="arturn">Turn it on its side</button></div>' +
'<div class="fig" id="arfig"></div><div class="out" id="arout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>You can split a hard fact into two easier ones. 7 &times; 4 is 5 &times; 4 plus 2 &times; 4. That is 20 + 8 = 28.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>How many dots? 3 rows of 5. Count by 5s: 5, 10, 15. <b>3 &times; 5 = 15</b>.</p><div class="fig">' + array(3, 5) + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Facts of 2, 5 and 10</h2>' +
'<p>Learn these facts by heart. Skip counting helps: count by 2s, by 5s or by 10s.</p>' +
'<div class="lab"><span class="lt">Try it: find the pattern</span>' +
'<div class="ctrl"><label for="hck">Show the multiples of<select id="hck"><option value="2">2</option><option value="5" selected>5</option><option value="10">10</option></select></label></div>' +
'<div class="fig" id="hcfig"></div><div class="out" id="hcout" aria-live="polite"></div></div>' +
'<div class="tbl"><table><thead><tr><th>&times;</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr></thead><tbody>' +
[2, 5, 10].map(function (k) { var r = '<tr><th>' + k + '</th>'; for (var i = 1; i <= 10; i++) r += '<td>' + k * i + '</td>'; return r + '</tr>'; }).join('') + '</tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Facts of 2 are all even. Facts of 5 end in 5 or 0. Facts of 10 end in 0.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find 5 &times; 7. Count by 5s seven times: 5, 10, 15, 20, 25, 30, 35. <b>5 &times; 7 = 35</b>.</p></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Dividing: sharing and grouping</h2>' +
'<p><b>Dividing</b> splits a total into equal groups. <span class="math">12 &divide; 3</span> can mean "share 12 among 3" (each gets 4). It can also mean "how many groups of 3 are in 12?" (4 groups).</p>' +
'<div class="lab"><span class="lt">Try it: share fairly</span>' +
'<div class="ctrl"><label for="shn">Things to share<input type="number" id="shn" min="0" max="100" value="12"></label>' +
'<label for="shk">Number of groups: <output id="shko"></output><input type="range" id="shk" min="1" max="10" value="3"></label></div>' +
'<div class="fig" id="shfig"></div><div class="out" id="shout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Groups that are not equal. When you share 12 among 3, each group must get the same number: 4, 4 and 4. 5, 4 and 3 is not fair.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>20 stickers go into bags of 5. How many bags? Take away 5 at a time: 20, 15, 10, 5, 0. That is 4 bags, so <b>20 &divide; 5 = 4</b>.</p></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Fact families</h2>' +
'<p>Multiplying and dividing are linked. One array gives four facts. This is a <b>fact family</b>.</p>' +
'<div class="fig">' + array(4, 5, 0, '4 rows of 5 dots: 4 times 5 is 20') + '</div>' +
'<div class="tbl"><table><tbody><tr><td class="math">4 &times; 5 = 20</td><td class="math">5 &times; 4 = 20</td></tr><tr><td class="math">20 &divide; 4 = 5</td><td class="math">20 &divide; 5 = 4</td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Use a multiplication fact to check a division. If 30 &divide; 5 = 6, then 6 &times; 5 should be 30. It is, so the answer is right.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Find 40 &divide; 10. Think: 10 times what is 40? 10 &times; 4 = 40, so <b>40 &divide; 10 = 4</b>.</p></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Scaling up: 1 to 2, 1 to 5, 1 to 10</h2>' +
'<p>Some things always come in the same amounts. 1 bike has 2 wheels. 1 hand has 5 fingers. 1 dime is worth 10 cents. If you know one, you can find many.</p>' +
'<div class="lab"><span class="lt">Try it: scale up</span>' +
'<div class="ctrl"><label for="rtk">For every 1, there are<select id="rtk"><option value="2">2 (bikes and wheels)</option><option value="5" selected>5 (hands and fingers)</option><option value="10">10 (dimes and cents)</option></select></label>' +
'<label for="rtn">How many: <output id="rtno"></output><input type="range" id="rtn" min="1" max="10" value="4"></label></div>' +
'<div class="fig" id="rtfig"></div><div class="tbl" id="rttbl"></div><div class="out" id="rtout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>When the first amount goes up by 1, the second goes up by 2, 5 or 10 each time. It is skip counting.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A box has 6 dimes. How many cents? 1 dime is 10 cents, so 6 dimes are 6 &times; 10 = <b>60 cents</b>.</p></div>' +
'<div class="yt" data-yt="s6"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'Which picture shows <span class="math">2 &times; 3</span>?', options: ['2 groups of 3', '3 groups of 3', '2 groups of 2'], answer: 0, why: 'The first number tells how many groups. The second tells how many in each group.' },
        { q: 'Which addition matches <span class="math">4 &times; 5</span>?', options: ['4 + 5', '5 + 5 + 5 + 5', '4 + 4 + 4'], answer: 1, why: '4 &times; 5 means 4 groups of 5. Add 5 four times.' },
        { q: 'There are 3 boxes with 10 crayons in each. How many crayons?', options: ['13', '30', '310'], answer: 1, why: '3 groups of 10: 10, 20, 30.' }
      ],
      s2: [
        { q: 'An array has 2 rows of 7. How many dots?', fig: array(2, 7), options: ['9', '14', '27'], answer: 1, why: 'Count by 7s twice: 7, 14. Or 2 &times; 7.' },
        { q: '<span class="math">3 &times; 8 = 24</span>. What is <span class="math">8 &times; 3</span>?', options: ['11', '24', '38'], answer: 1, why: 'Turn the array on its side. It is the same number of dots.' },
        { q: 'Split 6 &times; 5 into 5 &times; 5 and 1 &times; 5. What is 6 &times; 5?', options: ['25', '30', '11'], answer: 1, why: '5 &times; 5 = 25 and 1 &times; 5 = 5. 25 + 5 = 30.' }
      ],
      s3: [
        { q: 'What is <span class="math">2 &times; 9</span>?', options: ['11', '18', '29'], answer: 1, why: 'Double 9: 9 + 9.' },
        { q: 'What is <span class="math">10 &times; 7</span>?', options: ['17', '70', '107'], answer: 1, why: '7 tens make 70. Facts of 10 end in 0.' },
        { q: 'Which number can be a fact of 5?', options: ['32', '45', '51'], answer: 1, why: 'Facts of 5 end in 5 or 0.' }
      ],
      s4: [
        { q: 'Share 15 crackers among 3 friends. How many does each get?', options: ['3', '5', '12'], answer: 1, why: 'Deal them out one at a time. Or think: 3 times what is 15?' },
        { q: 'How many groups of 2 are in 16?', options: ['8', '14', '18'], answer: 0, why: 'Count by 2s to 16: that is 8 jumps.' },
        { q: 'What is <span class="math">50 &divide; 10</span>?', options: ['5', '40', '500'], answer: 0, why: '10 times what is 50? 10 &times; 5 = 50.' }
      ],
      s5: [
        { q: 'Which fact is in the family of <span class="math">2 &times; 6 = 12</span>?', options: ['12 &divide; 6 = 2', '12 &minus; 6 = 6', '6 + 2 = 8'], answer: 0, why: 'A fact family uses the same three numbers with &times; and &divide;.' },
        { q: '<span class="math">5 &times; 9 = 45</span>. What is <span class="math">45 &divide; 5</span>?', options: ['9', '40', '50'], answer: 0, why: 'Use the multiplication fact: 5 times 9 is 45.' },
        { q: 'Jo says <span class="math">35 &divide; 5 = 6</span>. Check: what is 6 &times; 5?', options: ['30, so Jo is wrong', '35, so Jo is right'], answer: 0, why: '6 &times; 5 = 30, not 35. The answer is 7, because 7 &times; 5 = 35.' }
      ],
      s6: [
        { q: '1 bike has 2 wheels. How many wheels do 6 bikes have?', options: ['8', '12', '62'], answer: 1, why: 'Count by 2s six times: 6 &times; 2 = 12.' },
        { q: '1 star has 5 points. How many points do 3 stars have?', options: ['8', '15', '35'], answer: 1, why: 'Count by 5s three times: 5, 10, 15.' },
        { q: 'You have 70 cents in dimes. How many dimes?', options: ['7', '60', '70'], answer: 0, why: 'Each dime is 10 cents. 10, 20, 30, 40, 50, 60, 70 is 7 dimes.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function eg() {
        var g = +$('#egg', root).value, n = +$('#egn', root).value;
        $('#eggo', root).textContent = g; $('#egno', root).textContent = n;
        $('#egfig', root).innerHTML = groups(g, n);
        var add = []; for (var i = 0; i < g; i++) add.push(n);
        $('#egout', root).innerHTML = '<p><span class="big">' + g + ' &times; ' + n + ' = ' + g * n + '</span></p><p>' + g + ' group' + (g > 1 ? 's' : '') + ' of ' + n + ': ' + add.join(' + ') + ' = ' + g * n + '</p>';
      }
      A.bind(root, ['egg', 'egn'], eg);
      function ar() {
        var r = +$('#arr', root).value, c = +$('#arc', root).value, sp = +$('#ars', root).value;
        $('#ars', root).max = Math.max(0, r - 1);
        if (sp >= r) { sp = 0; $('#ars', root).value = 0; }
        $('#arro', root).textContent = r; $('#arco', root).textContent = c; $('#arso', root).textContent = sp ? sp : 'no split';
        $('#arfig', root).innerHTML = array(r, c, sp);
        $('#arout', root).innerHTML = '<p><span class="big">' + r + ' &times; ' + c + ' = ' + r * c + '</span> &nbsp; and ' + c + ' &times; ' + r + ' = ' + r * c + '</p>' +
          (sp ? '<p>Split: <b>' + sp + ' &times; ' + c + '</b> = ' + sp * c + ' and <b>' + (r - sp) + ' &times; ' + c + '</b> = ' + (r - sp) * c + '. ' + sp * c + ' + ' + (r - sp) * c + ' = ' + r * c + '.</p>' : '<p class="t2">Move the split slider to break the array into two easier facts.</p>');
      }
      A.bind(root, ['arr', 'arc', 'ars'], ar);
      $('#arturn', root).addEventListener('click', function () { var r = $('#arr', root).value; $('#arr', root).value = $('#arc', root).value; $('#arc', root).value = r; $('#ars', root).value = 0; ar(); });
      function hc() {
        var k = +$('#hck', root).value;
        $('#hcfig', root).innerHTML = chart100(k);
        var first = []; for (var i = 1; i <= 10; i++) first.push(k * i);
        $('#hcout', root).innerHTML = '<p><b>Facts of ' + k + ':</b> ' + first.join(', ') + '</p><p>' +
          (k === 2 ? 'Every second number is shaded. They are the even numbers. They end in 0, 2, 4, 6 or 8.' : k === 5 ? 'Two columns are shaded. Every multiple of 5 ends in 5 or 0.' : 'Only the last column is shaded. Every multiple of 10 ends in 0.') + '</p>';
      }
      A.bind(root, ['hck'], hc);
      function sh() {
        var n = clamp($('#shn', root).value, 0, 100), k = +$('#shk', root).value, each = Math.floor(n / k), left = n - each * k;
        $('#shko', root).textContent = k;
        $('#shfig', root).innerHTML = share(n, k);
        $('#shout', root).innerHTML = left ? '<p><span class="big">' + n + ' shared among ' + k + ': ' + each + ' each, ' + left + ' left over</span></p><p>' + n + ' does not split into ' + k + ' equal groups with nothing left. ' + each + ' &times; ' + k + ' = ' + each * k + ', and ' + left + ' more ' + (left === 1 ? 'is' : 'are') + ' left.</p>' :
          '<p><span class="big">' + n + ' &divide; ' + k + ' = ' + each + '</span></p><p>Each group gets ' + each + '. Check: ' + each + ' &times; ' + k + ' = ' + n + '.</p>';
      }
      A.bind(root, ['shn', 'shk'], sh);
      function rt() {
        var k = +$('#rtk', root).value, n = +$('#rtn', root).value, th = THINGS[k][0];
        $('#rtno', root).textContent = n;
        $('#rtfig', root).innerHTML = ratioFig(k, n, n + ' ' + (n === 1 ? th[0] : th[1]) + ', ' + k + ' ' + th[3] + ' each');
        var h = '<table><tbody><tr><th class="l">' + th[1].charAt(0).toUpperCase() + th[1].slice(1) + '</th>', h2 = '<tr><th class="l">' + th[3].charAt(0).toUpperCase() + th[3].slice(1) + '</th>';
        for (var i = 1; i <= n; i++) { h += '<td' + (i === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + i + '</td>'; h2 += '<td' + (i === n ? ' style="background:color-mix(in srgb,var(--hi) 45%,var(--card))"' : '') + '>' + i * k + '</td>'; }
        $('#rttbl', root).innerHTML = h + '</tr>' + h2 + '</tr></tbody></table>';
        $('#rtout', root).innerHTML = '<p><span class="big">' + n + ' ' + (n === 1 ? th[0] : th[1]) + ' &rarr; ' + n * k + ' ' + th[3] + '</span></p><p>1 ' + th[0] + ' has ' + k + ' ' + th[3] + ', so ' + n + ' &times; ' + k + ' = ' + n * k + '.</p>';
      }
      A.bind(root, ['rtk', 'rtn'], rt);
    },

    quiz: [
      { q: 'How many counters are there?', type: 'num', answer: 18, fig: groups(3, 6, '3 groups of 6'),
        hint: 'Count the groups and how many are in each one.', explain: '3 groups of 6: 6 + 6 + 6 = 18. 3 &times; 6 = 18.' },
      { q: 'Which multiplication matches this array?', type: 'mc', options: ['4 &times; 7', '4 + 7', '3 &times; 7', '7 &times; 7'], answer: 0, fig: array(4, 7),
        hint: 'Count the rows. Count how many are in each row.', explain: '4 rows with 7 in each row: 4 &times; 7 = 28.' },
      { q: 'What is <span class="math">5 &times; 8</span>?', type: 'num', answer: 40,
        hint: 'Count by 5s eight times.', explain: '5, 10, 15, 20, 25, 30, 35, 40. 5 &times; 8 = 40.' },
      { q: 'Share 24 muffins equally on 4 plates. How many muffins go on each plate?', type: 'num', answer: 6,
        hint: 'Think: 4 times what is 24?', explain: '24 &divide; 4 = 6, because 4 &times; 6 = 24.' },
      { q: 'Which fact is <b>not</b> in the same family as <span class="math">3 &times; 10 = 30</span>?', type: 'mc', options: ['10 &times; 3 = 30', '30 &divide; 3 = 10', '30 &divide; 10 = 3', '30 &minus; 10 = 20'], answer: 3,
        hint: 'A fact family uses only &times; and &divide; with 3, 10 and 30.', explain: '30 &minus; 10 = 20 uses subtraction and the number 20, so it is not in the family.' },
      { q: '1 hand has 5 fingers. How many fingers are on 9 hands?', type: 'num', answer: 45,
        hint: 'Count by 5s nine times, or think 9 &times; 5.', explain: '9 &times; 5 = 45.' },
      { q: 'Use <span class="math">5 &times; 6 = 30</span> and <span class="math">2 &times; 6 = 12</span> to find <span class="math">7 &times; 6</span>.', type: 'num', answer: 42, fig: array(7, 6, 5, '7 rows of 6, split after 5 rows'),
        hint: '7 rows is 5 rows plus 2 rows. Add the two parts.', explain: '30 + 12 = 42, so 7 &times; 6 = 42.' }
    ],

    practice: [
      { id: 'md-groups', name: 'Equal groups', code: 'B2.6', gen: function (lv) {
        var g = R.int(2, lv === 1 ? 5 : lv === 2 ? 6 : 9), n = lv === 1 ? R.pick([2, 5, 10]) : R.int(2, lv === 2 ? 6 : 9);
        var add = []; for (var i = 0; i < g; i++) add.push(n);
        return { q: lv === 3 ? 'What is <b>' + g + ' groups of ' + n + '</b>?' : 'How many counters are there?', type: 'num', answer: g * n,
          fig: lv === 3 ? '' : groups(g, n, g + ' groups of ' + n),
          hint: 'There are ' + g + ' groups with ' + n + ' in each. Skip count by ' + n + '.',
          steps: [g + ' groups of ' + n + ' is ' + g + ' &times; ' + n + '.', 'Add ' + n + ' ' + g + ' times: ' + add.join(' + ') + '.', 'That is ' + g * n + '.' + (lv === 3 ? '<div class="fig">' + groups(g, n) + '</div>' : '')],
          explain: g + ' &times; ' + n + ' = ' + g * n + '.' };
      } },
      { id: 'md-facts', name: 'Facts of 2, 5 and 10', code: 'B2.2', gen: function (lv) {
        var k = lv === 1 ? R.pick([2, 10]) : R.pick([2, 5, 10, 5]), n = R.int(1, 10), first = R.int(0, 1);
        var a = first ? k : n, b = first ? n : k, list = []; for (var i = 1; i <= n; i++) list.push(k * i);
        if (lv === 3) {
          return { q: 'Find the missing number: <span class="math">' + a + ' &times; ___ = ' + a * b + '</span>', type: 'num', answer: b,
            hint: 'Count by ' + a + 's until you reach ' + a * b + '. How many jumps?', steps: ['Count by ' + a + 's: ' + (function () { var l = []; for (var j = 1; j <= b; j++) l.push(a * j); return l.join(', '); })() + '.', 'That is ' + b + ' jumps.', a + ' &times; ' + b + ' = ' + a * b + ', so the missing number is ' + b + '.'],
            explain: a + ' &times; ' + b + ' = ' + a * b + '.' };
        }
        return { q: 'What is <span class="math">' + a + ' &times; ' + b + '</span>?', type: 'num', answer: a * b,
          hint: 'Skip count by ' + k + ', ' + n + ' time' + (n > 1 ? 's' : '') + '.',
          steps: ['This is a fact of ' + k + '.', 'Count by ' + k + 's ' + n + ' time' + (n > 1 ? 's' : '') + ': ' + list.join(', ') + '.', a + ' &times; ' + b + ' = ' + a * b + '.'],
          explain: a + ' &times; ' + b + ' = ' + a * b + '.' };
      } },
      { id: 'md-array', name: 'Arrays', code: 'B2.6', gen: function (lv) {
        var r = R.int(2, lv === 1 ? 5 : 9), c = lv === 1 ? R.pick([2, 5, 10]) : R.int(3, 9);
        if (lv === 3) {
          var sp = R.int(1, r - 1 || 1); if (r < 2) r = 2;
          sp = Math.min(sp, r - 1);
          return { q: 'Split the array to find <span class="math">' + r + ' &times; ' + c + '</span>. What is ' + r + ' &times; ' + c + '?', type: 'num', answer: r * c, fig: array(r, c, sp, r + ' rows of ' + c + ', split after ' + sp + ' rows'),
            hint: 'Find the top part and the bottom part, then add.',
            steps: ['Top part: ' + sp + ' &times; ' + c + ' = ' + sp * c + '.', 'Bottom part: ' + (r - sp) + ' &times; ' + c + ' = ' + (r - sp) * c + '.', sp * c + ' + ' + (r - sp) * c + ' = ' + r * c + '.'],
            explain: r + ' &times; ' + c + ' = ' + r * c + '.' };
        }
        return { q: 'How many dots are in this array?', type: 'num', answer: r * c, fig: array(r, c, 0, r + ' rows of ' + c),
          hint: 'Count the rows. Then count by the number in each row.',
          steps: ['There are ' + r + ' rows with ' + c + ' in each row.', 'That is ' + r + ' &times; ' + c + '.', 'Count by ' + c + 's ' + r + ' times: ' + r * c + '.'],
          explain: r + ' &times; ' + c + ' = ' + r * c + '.' };
      } },
      { id: 'md-divide', name: 'Divide by sharing or grouping', code: 'B2.6', gen: function (lv) {
        var k = lv === 1 ? R.int(2, 5) : R.int(2, 10), each = R.int(2, lv === 1 ? 5 : 10), n = k * each;
        if (lv === 1) return { q: 'Share ' + n + ' marbles equally among ' + k + ' friends. How many does each friend get?', type: 'num', answer: each,
          fig: groups(k, 0, k + ' empty plates'), hint: 'Deal the marbles out one at a time onto the ' + k + ' plates.',
          steps: ['Give each friend 1, then 1 more, and so on.', 'Stop when all ' + n + ' are used.', 'Each friend gets ' + each + '.<div class="fig">' + groups(k, each) + '</div>'],
          explain: n + ' &divide; ' + k + ' = ' + each + ', because ' + k + ' &times; ' + each + ' = ' + n + '.' };
        if (lv === 2) return { q: 'What is <span class="math">' + n + ' &divide; ' + k + '</span>?', type: 'num', answer: each,
          hint: 'Think of the times fact: ' + k + ' times what is ' + n + '?',
          steps: ['Ask: ' + k + ' &times; ? = ' + n + '.', 'Count by ' + k + 's to ' + n + '. Count the jumps.', k + ' &times; ' + each + ' = ' + n + ', so ' + n + ' &divide; ' + k + ' = ' + each + '.'],
          explain: n + ' &divide; ' + k + ' = ' + each + '.' };
        return { q: 'There are ' + n + ' cookies. Each bag holds ' + k + ' cookies. How many bags can be filled?', type: 'num', answer: each,
          hint: 'How many groups of ' + k + ' are in ' + n + '?',
          steps: ['This is grouping: take away ' + k + ' at a time.', 'Count by ' + k + 's to ' + n + ': that is ' + each + ' jumps.', n + ' &divide; ' + k + ' = ' + each + ' bags.'],
          explain: n + ' &divide; ' + k + ' = ' + each + '. Check: ' + each + ' &times; ' + k + ' = ' + n + '.' };
      } },
      { id: 'md-family', name: 'Fact families', code: 'B2.1', gen: function (lv) {
        var a = R.int(2, lv === 1 ? 5 : 10), b = R.pick([2, 5, 10]), p = a * b;
        if (a === b) a = a === 10 ? 5 : a + 1, p = a * b;
        if (lv < 3) {
          var o = R.mc(p + ' &divide; ' + a + ' = ' + b, [p + ' &minus; ' + a + ' = ' + (p - a), a + ' + ' + b + ' = ' + (a + b), p + ' &divide; ' + b + ' = ' + (a + 1)]);
          return { q: 'Which fact is in the same family as <span class="math">' + a + ' &times; ' + b + ' = ' + p + '</span>?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'A fact family uses the same three numbers, with &times; and &divide;.',
            steps: ['The numbers are ' + a + ', ' + b + ' and ' + p + '.', 'The family: ' + a + ' &times; ' + b + ' = ' + p + ', ' + b + ' &times; ' + a + ' = ' + p + ', ' + p + ' &divide; ' + a + ' = ' + b + ', ' + p + ' &divide; ' + b + ' = ' + a + '.', 'The matching choice is ' + p + ' &divide; ' + a + ' = ' + b + '.'],
            explain: p + ' &divide; ' + a + ' = ' + b + ' uses the same three numbers.' };
        }
        return { q: 'Use <span class="math">' + a + ' &times; ' + b + ' = ' + p + '</span> to find <span class="math">' + p + ' &divide; ' + b + '</span>.', type: 'num', answer: a,
          hint: b + ' times what is ' + p + '?',
          steps: ['Division asks: ' + b + ' &times; ? = ' + p + '.', 'You know ' + a + ' &times; ' + b + ' = ' + p + '.', 'So ' + p + ' &divide; ' + b + ' = ' + a + '.'],
          explain: p + ' &divide; ' + b + ' = ' + a + '.' };
      } },
      { id: 'md-scale', name: 'Scale up by 2, 5 or 10', code: 'B2.9', gen: function (lv) {
        var k = lv === 1 ? 2 : lv === 2 ? 5 : R.pick([2, 5, 10]), th = R.pick(THINGS[k]), n = R.int(2, 10);
        if (lv === 3 && R.int(0, 1)) {
          return { q: 'You have ' + n * k + ' ' + th[3] + '. 1 ' + th[0] + ' has ' + k + ' ' + th[3] + '. How many ' + th[1] + ' is that?', type: 'num', answer: n,
            hint: 'Count by ' + k + 's until you reach ' + n * k + '.',
            steps: ['Each ' + th[0] + ' has ' + k + ' ' + th[3] + '.', 'Count by ' + k + 's to ' + n * k + ': that is ' + n + ' jumps.', 'So there are ' + n + ' ' + th[1] + '.'],
            explain: n * k + ' &divide; ' + k + ' = ' + n + '.' };
        }
        return { q: '1 ' + th[0] + ' has ' + k + ' ' + th[3] + '. How many ' + th[3] + ' do ' + n + ' ' + th[1] + ' have?', type: 'num', answer: n * k,
          fig: lv === 1 ? ratioFig(k, n, n + ' ' + th[1] + ' with ' + k + ' each') : '',
          hint: 'Each ' + th[0] + ' adds ' + k + ' more. Skip count by ' + k + '.',
          steps: ['1 ' + th[0] + ' &rarr; ' + k + ' ' + th[3] + '.', n + ' ' + th[1] + ' &rarr; ' + n + ' &times; ' + k + '.', n + ' &times; ' + k + ' = ' + n * k + '.'],
          explain: n + ' &times; ' + k + ' = ' + n * k + ' ' + th[3] + '.' };
      } }
    ]
  });
})();
