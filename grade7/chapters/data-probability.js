(function () {
  var A = Atlas, R = A.R, cl = A.clean, fr = A.fr, frs = A.frs, gcd = A.gcd, fmt = A.fmt;
  function dec(x) { return String(cl(x)); }
  function plain(n, d) { return frs(n, d, true); }
  var PAL = ['var(--sb)', 'var(--se)', 'var(--sd)', 'var(--sc)', 'var(--sf)', 'var(--hi)'];

  /* circle graph. items [{lab, v}] */
  function pie(items, title, r) {
    r = r || 100;
    var tot = items.reduce(function (s, i) { return s + i.v; }, 0) || 1, a = -Math.PI / 2, cx = r + 10, cy = r + 34, s = '', ly = 50;
    if (title) s += '<text x="0" y="20" font-size="18" font-weight="700">' + title + '</text>';
    items.forEach(function (it, k) {
      var f = it.v / tot, b = a + f * 2 * Math.PI, col = PAL[k % PAL.length];
      if (f >= 0.9999) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + col + ';stroke:var(--card)" stroke-width="2"/>';
      else if (f > 0) s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (f > 0.5 ? 1 : 0) + ' 1 ' + (cx + r * Math.cos(b)).toFixed(1) + ' ' + (cy + r * Math.sin(b)).toFixed(1) + ' Z" style="fill:' + col + ';stroke:var(--card)" stroke-width="2"/>';
      if (f >= 0.07) { var m = (a + b) / 2; s += '<text x="' + (cx + r * 0.62 * Math.cos(m)).toFixed(1) + '" y="' + (cy + r * 0.62 * Math.sin(m) + 6).toFixed(1) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:' + (col === 'var(--hi)' ? '#24201d' : '#fff') + '">' + Math.round(f * 100) + '%</text>'; }
      s += '<rect x="' + (2 * r + 30) + '" y="' + (ly - 13) + '" width="16" height="16" style="fill:' + col + '"/><text x="' + (2 * r + 52) + '" y="' + ly + '" font-size="16">' + it.lab + ' (' + it.v + ')</text>';
      ly += 26; a = b;
    });
    return A.svg(2 * r + 230, Math.max(2 * r + 44, ly), s, (title ? title + '. ' : '') + 'Circle graph: ' + items.map(function (i) { return i.lab + ' ' + Math.round(i.v / tot * 100) + ' percent'; }).join(', '));
  }
  /* bar graph, with an optional y axis that does not start at 0 */
  function bars(items, y0, y1, title) {
    var W = 520, H = 230, x0 = 60, b0 = 200, s = '', bw = (W - x0 - 20) / items.length;
    var sy = function (v) { return b0 - (b0 - 20) * (v - y0) / (y1 - y0); };
    if (title) s += '<text x="' + x0 + '" y="14" font-size="16" font-weight="700">' + title + '</text>';
    for (var i = 0; i <= 5; i++) { var v = y0 + (y1 - y0) * i / 5, y = sy(v); s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" style="stroke:var(--line)"/><text x="' + (x0 - 6) + '" y="' + (y + 5) + '" text-anchor="end" font-size="15">' + dec(v) + '</text>'; }
    items.forEach(function (it, k) {
      var x = x0 + k * bw + bw * 0.18, top = sy(it.v);
      s += '<rect x="' + x + '" y="' + top + '" width="' + bw * 0.64 + '" height="' + (b0 - top) + '" style="fill:' + PAL[k % 5] + '"/>' +
        '<text x="' + (x + bw * 0.32) + '" y="' + (b0 + 22) + '" text-anchor="middle" font-size="15">' + it.lab + '</text>';
    });
    s += '<line x1="' + x0 + '" y1="' + b0 + '" x2="' + (W - 10) + '" y2="' + b0 + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x0 + '" y1="20" x2="' + x0 + '" y2="' + b0 + '" style="stroke:var(--ink)" stroke-width="2"/>';
    if (y0 > 0) s += '<path d="M' + (x0 - 8) + ' ' + (b0 - 14) + ' l16 -6 M' + (x0 - 8) + ' ' + (b0 - 6) + ' l16 -6" style="stroke:var(--bad)" stroke-width="2.5"/>';
    return A.svg(W, H + 6, s, (title || 'Bar graph') + ': ' + items.map(function (i) { return i.lab + ' ' + i.v; }).join(', ') + '. The axis starts at ' + y0 + '.');
  }
  /* dot plot with mean and median markers */
  function dotplot(data, lo, hi) {
    var W = 540, s = '', sc = function (v) { return 30 + 480 * (v - lo) / (hi - lo); }, cnt = {}, srt = data.slice().sort(function (a, b) { return a - b; });
    var mean = data.reduce(function (a, b) { return a + b; }, 0) / data.length, n = srt.length, med = n % 2 ? srt[(n - 1) / 2] : (srt[n / 2 - 1] + srt[n / 2]) / 2;
    s += '<line x1="20" y1="170" x2="520" y2="170" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var v = lo; v <= hi; v++) s += '<line x1="' + sc(v) + '" y1="164" x2="' + sc(v) + '" y2="176" style="stroke:var(--ink)" stroke-width="1.5"/>' + ((hi - lo <= 12 || v % 2 === 0) ? '<text x="' + sc(v) + '" y="196" text-anchor="middle" font-size="16">' + v + '</text>' : '');
    data.forEach(function (d) { cnt[d] = (cnt[d] || 0) + 1; s += '<circle cx="' + sc(d) + '" cy="' + (170 - cnt[d] * 18) + '" r="7.5" style="fill:var(--strand)"/>'; });
    s += '<line x1="' + sc(mean) + '" y1="20" x2="' + sc(mean) + '" y2="170" style="stroke:var(--se)" stroke-width="3"/><text x="' + sc(mean) + '" y="16" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--se)">mean ' + (Math.round(mean * 10) / 10) + '</text>';
    s += '<line x1="' + sc(med) + '" y1="40" x2="' + sc(med) + '" y2="170" style="stroke:var(--sc)" stroke-width="3" stroke-dasharray="6 4"/><text x="' + sc(med) + '" y="' + (Math.abs(sc(med) - sc(mean)) < 70 ? 216 : 36) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--sc)">median ' + dec(med) + '</text>';
    return A.svg(W, 222, s, 'Dot plot of ' + data.length + ' values. Mean ' + (Math.round(mean * 10) / 10) + ', median ' + dec(med) + '.');
  }
  function stats(data) {
    var srt = data.slice().sort(function (a, b) { return a - b; }), n = srt.length, sum = data.reduce(function (a, b) { return a + b; }, 0), cnt = {}, best = 0, modes = [];
    data.forEach(function (d) { cnt[d] = (cnt[d] || 0) + 1; best = Math.max(best, cnt[d]); });
    Object.keys(cnt).forEach(function (k) { if (cnt[k] === best && best > 1) modes.push(+k); });
    return { srt: srt, n: n, sum: sum, mean: sum / n, med: n % 2 ? srt[(n - 1) / 2] : (srt[n / 2 - 1] + srt[n / 2]) / 2, modes: modes.sort(function (a, b) { return a - b; }), range: srt[n - 1] - srt[0] };
  }
  /* tree diagram for two stages */
  function tree(a, b, la, lb, pa, pb) {
    var s = '', W = 540, rowsA = a.length, total = a.length * b.length, h = Math.max(200, total * 30 + 20), y = 20;
    var gap = (h - 20) / total;
    a.forEach(function (x, i) {
      var ya = 20 + gap * (i * b.length + (b.length - 1) / 2);
      s += '<line x1="20" y1="' + (h / 2) + '" x2="150" y2="' + ya + '" style="stroke:var(--sb)" stroke-width="2"/><text x="160" y="' + (ya + 6) + '" font-size="17" font-weight="700" style="fill:var(--sb)">' + x + '</text>';
      if (pa) s += '<text x="' + 70 + '" y="' + ((h / 2 + ya) / 2 - 4) + '" font-size="14" class="t2">' + pa[i] + '</text>';
      b.forEach(function (z, j) {
        var yb = 20 + gap * (i * b.length + j);
        s += '<line x1="' + (175 + x.length * 9) + '" y1="' + ya + '" x2="320" y2="' + yb + '" style="stroke:var(--se)" stroke-width="1.5"/><text x="328" y="' + (yb + 6) + '" font-size="16" font-weight="700" style="fill:var(--se)">' + z + '</text>' +
          '<text x="400" y="' + (yb + 6) + '" font-size="16">' + x + ', ' + z + '</text>';
        if (pb) s += '<text x="' + 250 + '" y="' + ((ya + yb) / 2 - 3) + '" font-size="13" class="t2">' + pb[i][j] + '</text>';
      });
    });
    return A.svg(W, h, s, 'Tree diagram: first ' + la + ' (' + a.join(', ') + '), then ' + lb + ' (' + b.join(', ') + '). ' + total + ' outcomes.');
  }
  /* a bag of marbles */
  function bag(r, b, g, gone) {
    var s = '<path d="M30 40 Q20 150 90 160 Q160 150 150 40 Z" style="fill:color-mix(in srgb,var(--ink) 6%,var(--card));stroke:var(--ink)" stroke-width="2"/>', list = [];
    for (var i = 0; i < r; i++) list.push('var(--bad)'); for (var j = 0; j < b; j++) list.push('var(--sc)'); for (var k = 0; k < (g || 0); k++) list.push('var(--sd)');
    list.forEach(function (c, i) { s += '<circle cx="' + (55 + (i % 4) * 22) + '" cy="' + (140 - Math.floor(i / 4) * 22) + '" r="10" style="fill:' + c + ';stroke:var(--ink)" stroke-width="1"' + (gone === i ? ' opacity=".2"' : '') + '/>'; });
    return A.svg(180, 170, s, 'A bag with ' + r + ' red' + ', ' + b + ' blue' + (g ? ' and ' + g + ' green' : '') + ' marbles');
  }

  /* ---------- interactive drawings used in "Try it" ---------- */
  var K = A.k7;
  var W = {
    pifig: { title: 'build a circle graph', html: 
      '<div class="ctrl">' + ['Soccer', 'Hockey', 'Basketball', 'Swimming'].map(function (l, i) { return '<label for="pi' + i + '">' + l + ': <output id="pi' + i + 'o"></output><input type="range" id="pi' + i + '" min="0" max="40" value="' + [14, 10, 8, 4][i] + '"></label>'; }).join('') + '</div>' +
      '<div class="fig" id="pifig"></div><div class="out" id="piout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['pi0', 'pi1', 'pi2', 'pi3'], function () {
          var labs = ['Soccer', 'Hockey', 'Basketball', 'Swimming'], items = labs.map(function (l, i) { var v = +$('#pi' + i, root).value; $('#pi' + i + 'o', root).textContent = v; return { lab: l, v: v }; });
          var tot = items.reduce(function (s, i) { return s + i.v; }, 0);
          if (!tot) { $('#pifig', root).innerHTML = ''; $('#piout', root).innerHTML = '<p>Add some votes.</p>'; return; }
          $('#pifig', root).innerHTML = pie(items, 'Favourite sport (' + tot + ' votes)');
          $('#piout', root).innerHTML = '<div class="tbl"><table><thead><tr><th class="l">Sport</th><th>Votes</th><th>Percent</th><th>Angle</th></tr></thead><tbody>' + items.map(function (i) { return '<tr><td class="l">' + i.lab + '</td><td>' + i.v + '</td><td>' + (Math.round(i.v / tot * 1000) / 10) + '%</td><td>' + (Math.round(i.v / tot * 3600) / 10) + '&deg;</td></tr>'; }).join('') + '<tr><td class="l"><b>Total</b></td><td><b>' + tot + '</b></td><td><b>100%</b></td><td><b>360&deg;</b></td></tr></tbody></table></div>';
        });
      } },
    dpv: { title: 'add and remove data', html: 
      '<div class="btnrow"><label for="dpv" class="sr">Value to add</label><input type="number" id="dpv" min="0" max="20" value="18"><button type="button" class="btn" id="dpadd">Add value</button><button type="button" class="btn alt" id="dprem">Remove last value</button><button type="button" class="btn alt" id="dpres">Reset</button></div>' +
      '<div class="fig" id="dpfig"></div><div class="out" id="dpout"></div>',
      init: function (root) {
        var $ = A.$;
        var base = [4, 5, 5, 6, 7, 7, 7, 8, 9], data = base.slice();
        function dp() {
          var st = stats(data);
          $('#dpfig', root).innerHTML = dotplot(data, 0, 20);
          $('#dpout', root).innerHTML = '<p>Data (' + st.n + ' values): ' + st.srt.join(', ') + '</p><div class="tbl"><table><tbody><tr><td class="l">Mean</td><td>' + st.sum + ' &divide; ' + st.n + ' = <b>' + (Math.round(st.mean * 100) / 100) + '</b></td></tr><tr><td class="l">Median</td><td><b>' + dec(st.med) + '</b></td></tr><tr><td class="l">Mode</td><td><b>' + (st.modes.join(' and ') || 'none') + '</b></td></tr><tr><td class="l">Range</td><td><b>' + st.range + '</b></td></tr></tbody></table></div>';
          $('#dprem', root).disabled = data.length <= 2;
        }
        $('#dpadd', root).addEventListener('click', function () { var v = Math.max(0, Math.min(20, Math.round(+$('#dpv', root).value || 0))); if (data.length < 25) data.push(v); dp(); });
        $('#dprem', root).addEventListener('click', function () { if (data.length > 2) data.pop(); dp(); });
        $('#dpres', root).addEventListener('click', function () { data = base.slice(); dp(); });
        dp();
      } },
    mlzo: { title: 'same data, two graphs', html: 
      '<div class="ctrl"><label for="mlz">Vertical axis starts at: <output id="mlzo"></output><input type="range" id="mlz" min="0" max="95" step="5" value="90"></label></div>' +
      '<div class="fig" id="mlfig"></div><div class="out" id="mlout"></div>',
      init: function (root) {
        var $ = A.$;
        A.bind(root, ['mlz'], function () {
          var z = +$('#mlz', root).value, it = [{ lab: 'Brand A', v: 96 }, { lab: 'Brand B', v: 98 }, { lab: 'Brand C', v: 97 }];
          $('#mlzo', root).textContent = z;
          $('#mlfig', root).innerHTML = bars(it, z, 100, 'Customers happy (%)');
          $('#mlout', root).innerHTML = z > 0 ? '<p>The axis starts at ' + z + ', so Brand B\'s bar looks ' + (Math.round((98 - z) / (96 - z) * 10) / 10) + ' times as tall as Brand A\'s. Really, 98% is only 2 points more than 96%.</p>' : '<p>With the axis at 0, you can see the three brands are almost the same.</p>';
        });
      } },
    mbr: { title: 'experiment with the bag of 3 red and 2 blue', html: 
      '<div class="ctrl"><label for="mbr">Put the first marble back?<select id="mbr"><option value="1">Yes (independent)</option><option value="0" selected>No (dependent)</option></select></label></div>' +
      '<div class="btnrow"><button type="button" class="btn" id="mb10">Pick two, 10 times</button><button type="button" class="btn" id="mb500">Pick two, 500 times</button><button type="button" class="btn alt" id="mbclr">Clear</button></div>' +
      '<div class="out" id="mbout"></div>',
      init: function (root) {
        var $ = A.$;
        var tally = { rr: 0, rb: 0, br: 0, bb: 0, n: 0 };
        function pick(n) {
          var back = $('#mbr', root).value === '1';
          for (var i = 0; i < n; i++) {
            var b = ['r', 'r', 'r', 'b', 'b'], k = R.int(0, 4), f = b[k];
            if (!back) b.splice(k, 1);
            var s2 = b[R.int(0, b.length - 1)];
            tally[f + s2]++; tally.n++;
          }
          show();
        }
        function show() {
          var back = $('#mbr', root).value === '1', th = back ? { rr: 9 / 25, rb: 6 / 25, br: 6 / 25, bb: 4 / 25 } : { rr: 6 / 20, rb: 6 / 20, br: 6 / 20, bb: 2 / 20 };
          var thS = back ? { rr: '9/25', rb: '6/25', br: '6/25', bb: '4/25' } : { rr: '6/20', rb: '6/20', br: '6/20', bb: '2/20' };
          var nm = { rr: 'red, red', rb: 'red, blue', br: 'blue, red', bb: 'blue, blue' };
          $('#mbout', root).innerHTML = '<div class="tbl"><table><thead><tr><th class="l">Outcome</th><th>Times</th><th>Experimental</th><th>Theoretical</th></tr></thead><tbody>' +
            ['rr', 'rb', 'br', 'bb'].map(function (k) { return '<tr><td class="l">' + nm[k] + '</td><td>' + tally[k] + '</td><td>' + (tally.n ? Math.round(tally[k] / tally.n * 100) + '%' : '&ndash;') + '</td><td>' + thS[k] + ' = ' + Math.round(th[k] * 100) + '%</td></tr>'; }).join('') +
            '</tbody></table></div><p>' + tally.n + ' trials so far.</p>';
        }
        $('#mb10', root).addEventListener('click', function () { pick(10); });
        $('#mb500', root).addEventListener('click', function () { pick(500); });
        $('#mbclr', root).addEventListener('click', function () { tally = { rr: 0, rb: 0, br: 0, bb: 0, n: 0 }; show(); });
        $('#mbr', root).addEventListener('change', function () { tally = { rr: 0, rb: 0, br: 0, bb: 0, n: 0 }; show(); });
        show();
      } },
  };

  function lab(w, tasks) { return K.lab(W[w].html, W[w].init, tasks); }
  function mc(q, right, wrong, hint, explain, fig) { var o = R.mc(right, wrong); return { q: q, type: 'mc', options: o.options, answer: o.answer, hint: hint, explain: explain, fig: fig || '' }; }
  function eq(t) { return '<p class="math k7-eq">' + t + '</p>'; }
  function tbl(rows) { return '<div class="tbl"><table><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i ? '' : ' class="l"') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
  var SCHOOL = [{ lab: 'Bus', v: 12 }, { lab: 'Walk', v: 9 }, { lab: 'Car', v: 6 }, { lab: 'Bike', v: 3 }];
  function out(h) { return (h.querySelector('#mbout') || {}).textContent || ''; }

  var LESSONS = [
    { id: 'kinds', title: 'Kinds of data', sub: 'Words, counts and measurements.', concepts: [
      { id: 'kinds', title: 'Qualitative, discrete, continuous', exp: ['D1.2'], skill: 'dp-type', hard: true,
        body: tbl([['<b>Qualitative</b>', 'words or categories', 'favourite sport'], ['<b>Discrete</b>', 'numbers you <b>count</b>', 'number of pets'], ['<b>Continuous</b>', 'numbers you <b>measure</b>', 'height, time']]),
        watch: K.slides([
          { say: 'Favourite sport: the answers are words. That is <b>qualitative</b> data.', fig: eq('soccer, hockey, swimming, ...') },
          { say: 'Number of pets: you count them. 0, 1, 2, 3. No 1.5 pets. That is <b>discrete</b>.', fig: eq('0, 1, 2, 3, ...') },
          { say: 'Time to run 100 m: you measure it. 14.37 s is possible. That is <b>continuous</b>.', fig: eq('14.37 s, 15.2 s, 13.98 s, ...'), ms: 2600 }
        ]),
        ways: [
          { label: 'Ask two questions', html: '<p>1. Is it a number? If not, it is qualitative.<br>2. Can it have any value in between, like 1.5 or 1.53? If yes, continuous. If only whole steps, discrete.</p>' },
          { label: 'Counted or measured?', html: '<p>Counted things (goals, siblings, cars) are discrete. Measured things (mass, length, time, temperature) are continuous.</p>' }
        ],
        key: '<p><b>Words: qualitative. Counted: discrete. Measured: continuous.</b></p>',
        mistake: '<p>Calling any number data "continuous". Number of siblings is a number, but it is counted, so it is discrete.</p>',
        check: [function () { return mc('The time it takes students to run 100 m is which kind of data?', 'Continuous', ['Qualitative', 'Discrete'], 'Is time counted or measured?', 'Time is measured and can be any value, so it is continuous.'); }, K.ck('dp-type', 1), K.ck('dp-type', 2)] },
      { id: 'percent', title: 'Compare groups with percents', exp: ['D1.1'], skill: 'dp-circle',
        body: '<p>Percents let you compare groups of <b>different sizes</b>. 360 out of 1200 is hard to picture; 30% is easy.</p>',
        watch: K.slides([
          { say: 'School A: 90 of 300 students bike. School B: 150 of 600.', fig: eq('A: 90 / 300 &nbsp;&nbsp; B: 150 / 600') },
          { say: 'B has more bikers. But B is also a bigger school.', fig: eq('150 &gt; 90, but 600 &gt; 300') },
          { say: 'A: 90 &divide; 300 = 30%. B: 150 &divide; 600 = 25%.', fig: eq('A: 30% &nbsp;&nbsp; B: 25%') },
          { say: 'School A has the <b>bigger share</b> of bikers.', fig: eq('30% &gt; 25%'), ms: 2400 }
        ]),
        key: '<p><b>To compare groups of different sizes, change to percents.</b></p>',
        mistake: '<p>Comparing the counts (150 &gt; 90) when the groups are different sizes.</p>',
        check: [K.ck('dp-circle', 1), function () { return mc('Team A won 12 of 20 games. Team B won 15 of 30. Which won a greater percent?', 'Team A', ['Team B', 'They are equal'], 'Change both to percents.', 'A: 60%. B: 50%.'); }] }
    ] },
    { id: 'circle', title: 'Circle graphs', sub: 'Parts of one whole.', concepts: [
      { id: 'slices', title: 'Slices are percents', exp: ['D1.3'], skill: 'dp-circle',
        body: '<p>A <b>circle graph</b> shows how a whole is split into parts. Each slice is a percent of the circle, and all the slices add to 100%.</p>',
        watch: K.slides([
          { say: '30 students say how they get to school.', fig: tbl([['Bus', '12'], ['Walk', '9'], ['Car', '6'], ['Bike', '3']]) },
          { say: 'Bus: 12 of 30 is 40%. Walk: 30%. Car: 20%. Bike: 10%.', fig: eq('40% + 30% + 20% + 10% = 100%') },
          { say: 'Each percent becomes a slice of the circle.', fig: function () { return pie(SCHOOL, 'How 30 students get to school'); }, ms: 2600 }
        ]),
        try: lab('pifig', [
          { do: 'Make <b>Soccer exactly half</b> of the circle.', goal: function (h) { var v = [0, 1, 2, 3].map(function (i) { return K.v(h, 'pi' + i); }); return v[0] > 0 && 2 * v[0] === v[0] + v[1] + v[2] + v[3]; }, yes: 'Half of the votes is 50%: a 180° slice.' },
          { do: 'Make all four sports <b>equal</b>.', goal: function (h) { var v = [0, 1, 2, 3].map(function (i) { return K.v(h, 'pi' + i); }); return v[0] > 0 && v.every(function (x) { return x === v[0]; }); }, yes: 'Four equal slices: 25% and 90° each.' }
        ]),
        key: '<p><b>Percents add to 100%. Use a circle graph only when the parts make one whole.</b></p>',
        mistake: '<p>Using a circle graph for data that is not parts of a whole (like temperatures each month).</p>',
        check: [K.ck('dp-circle', 1), K.ck('dp-circle', 2)] },
      { id: 'angles', title: 'From percent to angle', exp: ['D1.3'], skill: 'dp-circle', hard: true,
        body: '<p>A full circle is 360&deg;. So a slice that is <b>p%</b> of the circle has an angle of <b>p% of 360&deg;</b>. 1% is 3.6&deg;.</p>',
        watch: K.slides([
          { say: 'Bus is 40% of the class.', fig: function () { return pie(SCHOOL, ''); } },
          { say: '40% of 360&deg;: 0.4 &times; 360 = 144&deg;.', fig: eq('0.4 &times; 360&deg; = 144&deg;') },
          { say: 'Walk, 30%: 108&deg;. Car, 20%: 72&deg;. Bike, 10%: 36&deg;. Together: 360&deg;.', fig: eq('144 + 108 + 72 + 36 = 360'), ms: 2800 }
        ]),
        ways: [
          { label: 'Use fractions', html: '<p>25% is a quarter of the circle: 360 &divide; 4 = 90&deg;. 50% is half: 180&deg;. 10% is a tenth: 36&deg;.</p>' },
          { label: 'Skip the percent', html: '<p>12 of 30 students: ' + fr(12, 30) + ' of 360&deg; = 12 &times; 12 = 144&deg; (each student is 360 &divide; 30 = 12&deg;).</p>' }
        ],
        key: '<p><b>Angle = percent &times; 360&deg;.</b> All angles add to 360&deg;.</p>',
        mistake: '<p>Using the percent as the angle: a 40% slice drawn as 40&deg;.</p>',
        check: [function () { return { q: 'In a circle graph, a slice is 25% of the circle. What is its angle?', type: 'num', answer: 90, unit: '&deg;', hint: '25% is one quarter of 360&deg;.', explain: '0.25 &times; 360 = 90&deg;.' }; }, K.ck('dp-circle', 2), K.ck('dp-circle', 3)] }
    ] },
    { id: 'display', title: 'Showing data', sub: 'Choose the right graph and tell a story.', concepts: [
      { id: 'choose', title: 'Choose a graph', exp: ['D1.3'],
        body: tbl([['Bar graph', 'comparing categories'], ['Circle graph', 'parts of one whole'], ['Line graph', 'change over time'], ['Histogram', 'measured data in intervals'], ['Stem-and-leaf plot', 'a small set of numbers, keeping every value']]),
        watch: K.slides([
          { say: 'Favourite sports: compare categories with a <b>bar graph</b>.', fig: function () { return bars([{ lab: 'Soccer', v: 14 }, { lab: 'Hockey', v: 10 }, { lab: 'Swim', v: 4 }], 0, 15, 'Votes'); } },
          { say: 'How the class gets to school: parts of one whole. A <b>circle graph</b>.', fig: function () { return pie(SCHOOL, ''); } },
          { say: 'A puppy\'s mass each month: change over time. A <b>line graph</b>.', fig: eq('Jan &rarr; Feb &rarr; Mar &rarr; ...'), ms: 2400 }
        ]),
        key: '<p><b>Every graph needs a title, labels, a sensible scale and a source.</b></p>',
        mistake: '<p>Picking a graph by looks. Ask what the data is: categories, parts of a whole, or change over time?</p>',
        check: [function () { return mc('Which graph is best for showing how a puppy\'s mass changed each month for a year?', 'Line graph', ['Circle graph', 'Bar graph of favourite colours'], 'The data changes over time.', 'Change over time: a line graph.'); }, function () { return mc('Which graph is best for showing what percent of a budget goes to rent, food and fun?', 'Circle graph', ['Line graph', 'Stem-and-leaf plot'], 'The parts make one whole.', 'Parts of one whole: a circle graph.'); }] },
      { id: 'info', title: 'Infographics', exp: ['D1.4'],
        body: '<p>An <b>infographic</b> tells a story with data. It mixes a few graphs, one big headline number, short sentences and the source.</p>',
        watch: K.slides([
          { say: 'Start with a question: how does Room 7B get to school?', fig: eq('How does Room 7B get to school?') },
          { say: 'Pick the headline number: 70% come by bus or on foot.', fig: '<div class="info"><div class="ibig"><b>70%</b><span>come by bus or on foot</span></div></div>' },
          { say: 'Add a graph, one more fact, and the source.', fig: '<div class="info"><div class="ihead">Getting to school, Room 7B</div><div class="ibig"><b>70%</b><span>come by bus or on foot</span></div><div class="fig">' + pie(SCHOOL, '', 70) + '</div><div class="ibig"><b>1 in 10</b><span>bikes, even in winter</span></div><p class="isrc">Source: class survey of 30 students, October</p></div>', ms: 3000 }
        ]),
        key: '<p><b>Question, headline number, 2 or 3 displays, source.</b></p>',
        mistake: '<p>Leaving out the source or the sample size, so readers cannot judge the data.</p>',
        check: [function () { return mc('What must every infographic include?', 'The source of the data', ['A circle graph', 'At least 10 numbers'], 'How can a reader check the data?', 'Always give the source.'); }] }
    ] },
    { id: 'centre', title: 'Mean, median and mode', sub: 'What is a typical value?', concepts: [
      { id: 'mmm', title: 'Three kinds of middle', exp: ['D1.5'], skill: 'dp-mmm',
        body: tbl([['<b>Mean</b>', 'add all values, divide by how many'], ['<b>Median</b>', 'the middle value in order (mean of the middle two if even)'], ['<b>Mode</b>', 'the most common value']]),
        watch: K.slides([
          { say: 'Goals in 7 games: 2, 3, 3, 4, 5, 6, 12.', fig: function () { return dotplot([2, 3, 3, 4, 5, 6, 12], 0, 14); } },
          { say: 'Mean: add them, 35, and divide by 7. Mean = 5.', fig: eq('35 &divide; 7 = 5') },
          { say: 'Median: the middle of the ordered list, the 4th value. Median = 4.', fig: eq('2, 3, 3, <b>4</b>, 5, 6, 12') },
          { say: 'Mode: the most common value. Mode = 3.', fig: eq('2, <b>3, 3</b>, 4, 5, 6, 12'), ms: 2400 }
        ]),
        key: '<p><b>Mean: share equally. Median: middle in order. Mode: most common.</b></p>',
        mistake: '<p>Finding the median without putting the data in order first.</p>',
        check: [function () { return { q: 'Find the median of 8, 3, 10, 5, 7, 4.', type: 'num', answer: 6, hint: 'Put them in order. Use the two middle values.', explain: '3, 4, 5, 7, 8, 10. (5 + 7) &divide; 2 = 6.' }; }, K.ck('dp-mmm', 1), K.ck('dp-mmm', 2)] },
      { id: 'outlier', title: 'What an outlier does', exp: ['D1.5'], skill: 'dp-change', hard: true,
        body: '<p>An <b>outlier</b> is a value far from the rest. It pulls the <b>mean</b> toward it. The <b>median</b> hardly moves.</p>',
        watch: K.slides([
          { say: 'With the 12: mean 5, median 4.', fig: function () { return dotplot([2, 3, 3, 4, 5, 6, 12], 0, 14); } },
          { say: 'Remove the 12, one unusual game.', fig: function () { return dotplot([2, 3, 3, 4, 5, 6], 0, 14); } },
          { say: 'Now the mean is 23 &divide; 6, about 3.8. The median is 3.5.', fig: eq('mean 5 &rarr; 3.8 &nbsp;&nbsp; median 4 &rarr; 3.5') },
          { say: 'The mean moved a lot. The median moved a little.', fig: eq('outlier: mean moves, median stays'), ms: 2400 }
        ]),
        try: lab('dpv', [
          { do: 'Add a big value, like <b>18</b>. Watch the mean and median.', goal: function (h) { return /Data \(10 values\)/.test(h.querySelector('#dpout').textContent); }, yes: 'The mean jumped up. The median moved by only half a step.' },
          { do: 'Add <b>0</b> twice. Which one moves more?', goal: function (h) { return /Data \(12 values\): 0, 0/.test(h.querySelector('#dpout').textContent); }, yes: 'Low outliers pull the mean down.' }
        ]),
        ways: [
          { label: 'Sharing equally', html: '<p>The mean is like sharing equally. If one person brings 12 cookies and the others bring 2 to 6, everyone\'s share goes up. The median only cares about the middle person.</p>' },
          { label: 'Salaries', html: '<p>Ten people earn about $50 000. One earns $5 000 000. The mean is about $500 000, which describes nobody. The median, $50 000, is the typical salary.</p>' }
        ],
        key: '<p><b>With an outlier, the median is usually the better "typical" value.</b></p>',
        mistake: '<p>Always reporting the mean, even when one extreme value makes it misleading.</p>',
        check: [K.ck('dp-change', 1), K.ck('dp-change', 2)] }
    ] },
    { id: 'mislead', title: 'Misleading graphs', sub: 'True numbers, wrong impression.', concepts: [
      { id: 'axis', title: 'Check where the axis starts', exp: ['D1.6'],
        body: '<p>A graph can be true but still give the wrong idea. Watch for an axis that does <b>not start at 0</b>, a stretched scale, missing labels, or pictures of different sizes.</p>',
        watch: K.slides([
          { say: 'Customers happy: Brand A 96%, Brand B 98%. With the axis at 0, they look the same.', fig: function () { return bars([{ lab: 'Brand A', v: 96 }, { lab: 'Brand B', v: 98 }], 0, 100, 'Customers happy (%)'); } },
          { say: 'Start the axis at 90, and B looks much bigger.', fig: function () { return bars([{ lab: 'Brand A', v: 96 }, { lab: 'Brand B', v: 98 }], 90, 100, 'Customers happy (%)'); } },
          { say: 'The data did not change. Only the picture did. Always read the scale.', fig: eq('98 &minus; 96 = only 2 points'), ms: 2600 }
        ]),
        try: lab('mlzo', [
          { do: 'Make Brand B look <b>more than 2 times</b> as tall as Brand A.', goal: function (h) { var z = K.v(h, 'mlz'); return (98 - z) / (96 - z) > 2; }, yes: 'A high starting point makes a small difference look huge.' },
          { do: 'Now make the graph <b>honest</b>.', goal: function (h) { return K.v(h, 'mlz') === 0; }, yes: 'With the axis at 0, the brands look almost the same, which is true.' }
        ]),
        key: '<p><b>Read the scale before you trust the picture.</b> Ask who collected the data and how big the sample was.</p>',
        mistake: '<p>Judging by bar heights alone without checking where the axis starts.</p>',
        check: [function () { return mc('A graph\'s axis starts at 50. Bar A reaches 52 and bar B reaches 56. Bar B looks 3 times as tall. What is B really, compared to A?', 'About 8% more', ['3 times as much', 'Twice as much'], 'Compare the actual values, 52 and 56.', '56 is 4 more than 52, about 8% more.'); }, function () { return mc('A bar graph\'s vertical axis starts at 1000. What is the danger?', 'Small differences look much bigger', ['The bars are too short to see', 'The graph has no title'], 'Compare the heights of the bars to the real values.', 'Cutting off the bottom makes differences look bigger.'); }] }
    ] },
    { id: 'prob', title: 'Probability of two events', sub: 'Independent and dependent.', concepts: [
      { id: 'indep', title: 'Independent events', exp: ['D2.1', 'D2.2'], skill: 'dp-indep',
        body: '<p>Two events are <b>independent</b> if the first does not change the chances of the second. To find the chance of both, <b>multiply</b> the probabilities.</p>',
        watch: K.slides([
          { say: 'Flip a coin, then roll a die.', fig: eq('coin: H or T &nbsp;&nbsp; die: 1 to 6') },
          { say: 'A tree diagram shows every outcome: 2 &times; 6 = 12.', fig: function () { return tree(['H', 'T'], ['1', '2', '3', '4', '5', '6'], 'coin', 'die'); } },
          { say: 'Heads and a 6 is one of 12 outcomes.', fig: eq('P(H, 6) = ' + fr(1, 12)) },
          { say: 'Or multiply: one half times one sixth is one twelfth.', fig: eq(fr(1, 2) + ' &times; ' + fr(1, 6) + ' = ' + fr(1, 12)), ms: 2400 }
        ]),
        key: '<p><b>Independent: multiply the probabilities.</b></p>',
        mistake: '<p>Adding the probabilities (1/2 + 1/6). Both events together is less likely than either one, so the answer must be smaller.</p>',
        check: [function () { return { q: 'You flip a coin and spin a spinner with 4 equal colours. What is P(tails and blue)? Type a fraction.', type: 'num', answer: 0.125, show: '1/8', kb: 'text', tol: 1e-6, hint: 'Multiply.', explain: fr(1, 2) + ' &times; ' + fr(1, 4) + ' = ' + fr(1, 8) + '.' }; }, K.ck('dp-indep', 1), K.ck('dp-indep', 2)] },
      { id: 'dep', title: 'Dependent events', exp: ['D2.1', 'D2.2'], skill: 'dp-dep', hard: true,
        body: '<p>Events are <b>dependent</b> if the first changes the second. Picking <b>without putting the first one back</b> is dependent: there is one fewer in the bag.</p>',
        watch: K.slides([
          { say: 'A bag has 3 red and 2 blue marbles. Pick one.', fig: function () { return bag(3, 2); } },
          { say: 'P(red first) = 3 out of 5. Keep that red marble.', fig: function () { return bag(3, 2, 0, 0) + eq('P(red) = ' + fr(3, 5)); } },
          { say: 'Now only 2 red of 4 are left. P(red second) = 2 out of 4.', fig: function () { return bag(3, 2, 0, 0) + eq('P(red) = ' + fr(2, 4)); } },
          { say: 'P(red, red) = 3/5 &times; 2/4 = 6/20 = <b>3/10</b>.', fig: eq(fr(3, 5) + ' &times; ' + fr(2, 4) + ' = ' + fr(6, 20) + ' = ' + fr(3, 10)), ms: 2600 }
        ]),
        try: lab('mbr', [
          { do: 'With <b>No</b> selected, pick two <b>500 times</b>. Is red, red close to 30%?', goal: function (h) { return K.v(h, 'mbr') === 0 && /500 trials/.test(out(h)); }, yes: 'The experimental result is close to the theoretical 30%.' },
          { do: 'Switch to <b>Yes</b> (put it back) and run 500 again. What changes?', goal: function (h) { return K.v(h, 'mbr') === 1 && /500 trials/.test(out(h)); }, yes: 'Putting it back: red, red is now 9/25 = 36%.' }
        ]),
        ways: [
          { label: 'Tree with changing branches', html: '<p>First branch: red 3/5, blue 2/5. After red, the second branch is red 2/4, blue 2/4. After blue, it is red 3/4, blue 1/4. Multiply along the path you want.</p>' },
          { label: 'Count the pairs', html: '<p>Label the marbles R1, R2, R3, B1, B2. There are 5 &times; 4 = 20 ordered pairs. Red, red pairs: 3 &times; 2 = 6. P = 6/20 = 3/10.</p>' }
        ],
        key: '<p><b>Dependent: after the first pick, change the bag, then multiply.</b></p>',
        mistake: '<p>Using the full bag for the second pick (3/5 &times; 3/5) when the first marble was kept.</p>',
        check: [function () { return { q: 'A bag has 4 green and 6 yellow cubes. You pick one, keep it, and pick another. What is P(green, green)? Type a fraction.', type: 'num', answer: 2 / 15, show: '2/15', kb: 'text', tol: 1e-6, hint: 'First: 4 of 10. Then 3 of 9.', explain: fr(4, 10) + ' &times; ' + fr(3, 9) + ' = ' + fr(2, 15) + '.' }; }, K.ck('dp-dep', 1), K.ck('dp-dep', 2)] }
    ] }
  ];


  A.register('data-probability', {
    lessons: LESSONS,

    quiz: [
      { q: 'Which is <b>discrete</b> data?', type: 'mc', options: ['The mass of each apple', 'The number of siblings each student has', 'Students\' favourite music', 'How long each song lasts'], answer: 1, hint: 'Discrete data is counted in whole numbers.', explain: 'You count siblings: 0, 1, 2, ... There is no 1.5 siblings.' },
      { q: 'In a survey of 40 people, 14 chose pizza. What angle is the pizza slice in a circle graph?', type: 'num', answer: 126, unit: '&deg;', hint: 'Find 14 out of 40 as a percent, then that percent of 360&deg;.', explain: '14 &divide; 40 = 35%. 0.35 &times; 360 = 126&deg;.' },
      { q: 'Test scores: 70, 85, 90, 75, 80. What is the mean?', type: 'num', answer: 80, hint: 'Add them, then divide by 5.', explain: '70 + 85 + 90 + 75 + 80 = 400. 400 &divide; 5 = 80.' },
      { q: 'A score of 30 is added to the data 70, 85, 90, 75, 80. What happens?', type: 'mc', options: ['The mean goes down a lot; the median goes down a little', 'The mean stays the same', 'The median goes down a lot; the mean stays the same', 'Both go up'], answer: 0, hint: '30 is far below the rest. Which measure does an outlier pull?', explain: 'New mean: 430 &divide; 6 &asymp; 71.7 (was 80). New median: (75 + 80) &divide; 2 = 77.5 (was 80).' },
      { q: 'A bar graph\'s vertical axis starts at 1000. What is the danger?', type: 'mc', options: ['Small differences look much bigger', 'The bars are too short to see', 'The graph has no title'], answer: 0, fig: bars([{ lab: 'May', v: 1010 }, { lab: 'June', v: 1030 }], 1000, 1040, 'Visitors'), hint: 'Compare the heights of the bars with the actual numbers.', explain: '1030 is only 2% more than 1010, but the June bar looks 3 times as tall.' },
      { q: 'You flip a coin and spin a spinner with 4 equal colours. What is P(tails and blue)? Type a fraction.', type: 'num', answer: 0.125, show: '1/8', kb: 'text', tol: 1e-6, hint: 'The events are independent. Multiply.', explain: fr(1, 2) + ' &times; ' + fr(1, 4) + ' = ' + fr(1, 8) + '.' },
      { q: 'A drawer has 5 black socks and 3 white socks. You take two without looking and without putting the first back. What is P(black, black)? Type a fraction.', type: 'num', answer: 20 / 56, show: '5/14', kb: 'text', tol: 1e-6, hint: 'First: 5 of 8. Then 4 of 7.', explain: fr(5, 8) + ' &times; ' + fr(4, 7) + ' = ' + fr(20, 56) + ' = ' + fr(5, 14) + '.' }
    ],

    practice: [
      { id: 'dp-type', name: 'Kinds of data', code: 'D1.2', gen: function (lv) {
        var list = [['favourite ice cream flavour', 0], ['eye colour', 0], ['province of birth', 0], ['type of pet', 0], ['number of books read this month', 1], ['number of goals in a game', 1], ['number of people in a family', 1], ['number of texts sent in a day', 1],
          ['height of each student', 2], ['time to run 1 km', 2], ['temperature at noon', 2], ['mass of a backpack', 2], ['amount of rain in a day', 2]];
        if (lv === 3) list = list.concat([['shoe size (sizes come in halves)', 1], ['jersey number', 0], ['age in years, as a whole number', 1], ['length of a phone call', 2]]);
        var it = R.pick(list), names = ['Qualitative', 'Discrete', 'Continuous'], why = ['It is a word or category, not a measured number.', 'It is counted, so only certain values are possible.', 'It is measured, so it can be any value in a range.'];
        if (it[0] === 'jersey number') why[0] = 'A jersey number is a label. You would not add or average jersey numbers.';
        if (/shoe/.test(it[0])) why[1] = 'Shoe sizes only come in certain steps, like 7, 7.5 and 8, so they are discrete.';
        return { q: 'What kind of data is <b>' + it[0] + '</b>?', type: 'mc', options: names.slice(), answer: it[1],
          hint: 'Words or labels: qualitative. Counted: discrete. Measured: continuous.', steps: ['Ask: is it a word, a count or a measurement?', why[it[1]], 'So it is ' + names[it[1]].toLowerCase() + '.'], explain: why[it[1]] };
      } },
      { id: 'dp-circle', name: 'Circle graphs', code: 'D1.3', gen: function (lv) {
        var tot = R.pick([20, 25, 40, 50, 60, 80, 120, 200]), pcts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75].filter(function (p) { return tot * p % 100 === 0; }), p = R.pick(pcts), n = tot * p / 100, thing = R.pick(['chose hockey', 'walk to school', 'have a dog', 'prefer winter']);
        if (lv === 1) return { q: n + ' of ' + tot + ' students ' + thing + '. What percent is that?', type: 'num', answer: p, unit: '%', hint: 'Divide ' + n + ' by ' + tot + ', then multiply by 100.',
          steps: [n + ' &divide; ' + tot + ' = ' + dec(n / tot) + '.', dec(n / tot) + ' &times; 100 = ' + p + '.', p + '% of the students ' + thing + '.'], explain: n + ' of ' + tot + ' is ' + p + '%.' };
        if (lv === 2) return { q: 'A slice of a circle graph is ' + p + '%. What is its angle?', type: 'num', answer: cl(p * 3.6), unit: '&deg;', hint: 'A full circle is 360&deg;. Find ' + p + '% of 360.',
          steps: [p + '% = ' + dec(p / 100) + '.', dec(p / 100) + ' &times; 360 = ' + dec(p * 3.6) + '.', 'The angle is ' + dec(p * 3.6) + '&deg;.'], explain: p + '% of 360&deg; = ' + dec(p * 3.6) + '&deg;.' };
        var ang = cl(p * 3.6);
        return { q: 'In a survey of ' + tot + ' people, the slice for "' + thing.replace(/^chose /, '') + '" has an angle of ' + dec(ang) + '&deg;. How many people is that?', type: 'num', answer: n, hint: 'What fraction of 360&deg; is ' + dec(ang) + '&deg;?',
          steps: [dec(ang) + ' &divide; 360 = ' + dec(p / 100) + ', which is ' + p + '%.', p + '% of ' + tot + ' = ' + dec(p / 100) + ' &times; ' + tot + '.', '= ' + n + ' people.'], explain: dec(ang) + '&deg; is ' + p + '% of the circle, and ' + p + '% of ' + tot + ' is ' + n + '.' };
      } },
      { id: 'dp-mmm', name: 'Mean, median, mode', code: 'D1.5', gen: function (lv) {
        var n = lv === 1 ? R.pick([5, 7]) : R.int(6, 9), data = [];
        for (var i = 0; i < n; i++) data.push(R.int(lv === 3 ? 10 : 1, lv === 3 ? 60 : 20));
        var which = R.pick(lv === 1 ? ['median', 'mode', 'range'] : ['mean', 'median', 'mode']);
        if (which === 'mode') { data[R.int(0, n - 1)] = data[0]; data[R.int(1, n - 1)] = data[0]; }
        if (which === 'mean') { var s0 = data.reduce(function (a, b) { return a + b; }, 0), fix = (n - s0 % n) % n; data[0] += fix; }
        var st = stats(data);
        if (which === 'mode' && st.modes.length !== 1) { data.push(data[0]); st = stats(data); if (st.modes.length !== 1) { data = [3, 5, 5, 7, 9, 5, 2]; st = stats(data); } }
        var ans = which === 'mean' ? st.mean : which === 'median' ? st.med : which === 'mode' ? st.modes[0] : st.range;
        var steps = which === 'mean' ? ['Add: ' + data.join(' + ') + ' = ' + st.sum + '.', 'Divide by ' + st.n + ': ' + st.sum + ' &divide; ' + st.n + ' = ' + dec(st.mean) + '.']
          : which === 'median' ? ['Put in order: ' + st.srt.join(', ') + '.', st.n % 2 ? 'There are ' + st.n + ' values. The middle one is value ' + (st.n + 1) / 2 + '.' : 'There are ' + st.n + ' values, so take the two middle ones: ' + st.srt[st.n / 2 - 1] + ' and ' + st.srt[st.n / 2] + '.', 'Median: ' + dec(st.med) + '.']
            : which === 'mode' ? ['Put in order: ' + st.srt.join(', ') + '.', 'Count each value. ' + st.modes[0] + ' appears most often.']
              : ['Greatest: ' + st.srt[st.n - 1] + '. Least: ' + st.srt[0] + '.', 'Range: ' + st.srt[st.n - 1] + ' &minus; ' + st.srt[0] + ' = ' + st.range + '.'];
        return { q: 'Find the <b>' + which + '</b> of: ' + data.join(', '), type: 'num', answer: ans, fig: lv === 1 ? dotplot(data, 0, 20) : '',
          hint: { mean: 'Add them all, then divide by how many there are.', median: 'Put them in order first and find the middle.', mode: 'Which value appears most often?', range: 'Greatest minus least.' }[which], steps: steps,
          explain: 'The ' + which + ' is ' + dec(ans) + '.' };
      } },
      { id: 'dp-change', name: 'Adding or removing data', code: 'D1.5', gen: function (lv) {
        var data = [], n = R.int(5, 7);
        for (var i = 0; i < n; i++) data.push(R.int(10, 20));
        var st = stats(data), v = R.pick(lv === 1 ? [R.int(40, 60), R.int(0, 3)] : [R.int(40, 60), R.int(0, 3), Math.round(st.mean) === st.mean ? st.mean : R.int(40, 60)]);
        var nd = data.concat([v]), s2 = stats(nd), dm = s2.mean - st.mean;
        if (lv === 3) {
          return { q: 'Data: ' + data.join(', ') + '. The value ' + v + ' is added. What is the new mean? Round to one decimal place if needed.', type: 'num', answer: Math.round(s2.mean * 10) / 10, tol: 0.051,
            hint: 'New total &divide; new count.', steps: ['Old total: ' + st.sum + '. Add ' + v + ': ' + s2.sum + '.', 'New count: ' + s2.n + '.', s2.sum + ' &divide; ' + s2.n + ' &asymp; ' + (Math.round(s2.mean * 10) / 10) + '.'],
            explain: 'The mean went from ' + (Math.round(st.mean * 10) / 10) + ' to ' + (Math.round(s2.mean * 10) / 10) + '.' };
        }
        var right = Math.abs(dm) < 1e-9 ? 'The mean stays the same' : dm > 0 ? 'The mean goes up' : 'The mean goes down';
        var o = R.mc(right, ['The mean goes up', 'The mean goes down', 'The mean stays the same'].filter(function (x) { return x !== right; }));
        return { q: 'Data: ' + data.join(', ') + ' (mean ' + (Math.round(st.mean * 10) / 10) + '). The value <b>' + v + '</b> is added. What happens to the mean?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Is ' + v + ' above, below, or equal to the mean?', steps: ['The mean is about ' + (Math.round(st.mean * 10) / 10) + '.', v + ' is ' + (Math.abs(dm) < 1e-9 ? 'equal to' : v > st.mean ? 'above' : 'below') + ' the mean.', 'A value above the mean pulls it up; below pulls it down; equal leaves it the same.'],
          explain: 'New mean: ' + s2.sum + ' &divide; ' + s2.n + ' &asymp; ' + (Math.round(s2.mean * 10) / 10) + '.' };
      } },
      { id: 'dp-indep', name: 'Independent events', code: 'D2.1, D2.2', gen: function (lv) {
        var A1 = R.pick([[1, 2, 'heads on a coin'], [1, 6, 'a 4 on a die'], [1, 2, 'an even number on a die'], [1, 3, 'a number less than 3 on a die'], [1, 4, 'red on a 4-colour spinner']]);
        var B1 = R.pick([[1, 6, 'a 5 on a die'], [1, 2, 'tails on a coin'], [1, 4, 'green on a 4-colour spinner'], [3, 10, 'a red marble from a bag of 3 red and 7 blue']]);
        if (lv === 1) {
          var tot = A1[1] * B1[1];
          return { q: 'You get ' + A1[2] + ', and then ' + B1[2] + '. Are these events independent or dependent?', type: 'mc', options: ['Independent', 'Dependent'], answer: 0,
            hint: 'Does the first result change the chances for the second?', steps: ['The first event does not change the second at all.', 'So they are independent.'], explain: 'They do not affect each other, so they are independent.' };
        }
        var N = A1[0] * B1[0], D = A1[1] * B1[1];
        return { q: 'What is the probability of ' + A1[2] + ' <b>and</b> ' + B1[2] + '? Type a fraction.', type: 'num', answer: N / D, show: plain(N, D), kb: 'text', tol: 1e-6,
          hint: 'Independent events: multiply the two probabilities.', steps: ['P(' + A1[2] + ') = ' + fr(A1[0], A1[1]) + '.', 'P(' + B1[2] + ') = ' + fr(B1[0], B1[1]) + '.', 'Multiply: ' + fr(N, D) + (gcd(N, D) > 1 ? ' = ' + frs(N, D) : '') + '.'],
          explain: fr(A1[0], A1[1]) + ' &times; ' + fr(B1[0], B1[1]) + ' = ' + frs(N, D) + '.' };
      } },
      { id: 'dp-dep', name: 'Dependent events', code: 'D2.1, D2.2', gen: function (lv) {
        var r = R.int(2, 6), b = R.int(2, 6), t = r + b, c1 = R.pick(['red', 'blue']), c2 = lv === 3 ? R.pick(['red', 'blue']) : c1;
        var back = lv === 1 ? R.int(0, 1) === 1 : false;
        if (lv === 1) {
          return { q: 'A bag has ' + r + ' red and ' + b + ' blue marbles. You pick one, ' + (back ? 'put it back' : 'keep it') + ', then pick again. Are the two picks independent or dependent?', type: 'mc', options: ['Independent', 'Dependent'], answer: back ? 0 : 1, fig: bag(r, b),
            hint: 'Is the bag the same for the second pick?', steps: [back ? 'The marble goes back, so the bag is the same.' : 'The first marble stays out, so the bag has changed.', back ? 'Independent.' : 'Dependent.'], explain: back ? 'With replacement the second pick is not affected: independent.' : 'Without replacement the second pick depends on the first: dependent.' };
        }
        var n1 = c1 === 'red' ? r : b, n2 = c2 === 'red' ? r : b;
        if (c1 === c2) n2 = n2 - 1;
        var N = n1 * n2, D = t * (t - 1);
        return { q: 'A bag has ' + r + ' red and ' + b + ' blue marbles. You pick two without putting the first back. What is P(' + c1 + ', then ' + c2 + ')? Type a fraction.', type: 'num', answer: N / D, show: plain(N, D), kb: 'text', tol: 1e-6, fig: bag(r, b),
          hint: 'First pick: ' + n1 + ' of ' + t + '. For the second pick there are only ' + (t - 1) + ' marbles left.',
          steps: ['P(' + c1 + ' first) = ' + fr(n1, t) + '.', 'One marble is gone. ' + (c1 === c2 ? 'There are ' + n2 + ' ' + c2 + ' left' : 'All ' + n2 + ' ' + c2 + ' are still there') + ', out of ' + (t - 1) + '. P(' + c2 + ' second) = ' + fr(n2, t - 1) + '.', 'Multiply: ' + fr(n1, t) + ' &times; ' + fr(n2, t - 1) + ' = ' + fr(N, D) + (N && gcd(N, D) > 1 ? ' = ' + frs(N, D) : '') + '.'],
          explain: 'P = ' + (N ? frs(N, D) : '0') + '.' };
      } }
    ]
  });
})();
