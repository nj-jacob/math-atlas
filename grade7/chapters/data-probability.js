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

  A.register('data-probability', {
    html:
'<section class="sec"><h2><span class="n">1</span>Kinds of data, and why we use percents</h2>' +
'<p>Data can be words or numbers. Knowing the kind helps you choose how to show it.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Kind</th><th class="l">What it is</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l"><b>Qualitative</b></td><td class="l">words or categories</td><td class="l">favourite sport, eye colour</td></tr>' +
'<tr><td class="l"><b>Discrete</b> quantitative</td><td class="l">numbers you count, no in-betweens</td><td class="l">number of pets, goals scored</td></tr>' +
'<tr><td class="l"><b>Continuous</b> quantitative</td><td class="l">numbers you measure, any value in a range</td><td class="l">height, time, temperature</td></tr></tbody></table></div>' +
'<p>With big data sets we often use <b>percents</b>. 360 out of 1200 students is hard to picture, but <b>30%</b> is easy: 30 out of every 100. Percents also let you compare groups of different sizes.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>School A: 90 of 300 students bike to school. School B: 150 of 600. Which has the bigger share of bikers?</p><p>A: 90 &divide; 300 = 30%. B: 150 &divide; 600 = 25%. School B has more bikers, but School A has a <b>bigger share</b>.</p></div>' +
A.yt({ q: 'The time it takes students to run 100 m is which kind of data?', type: 'mc', options: ['Qualitative', 'Discrete', 'Continuous'], answer: 2, hint: 'Is time counted or measured?', explain: 'Time is measured and can be any value, like 14.37 s, so it is continuous.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Circle graphs</h2>' +
'<p>A <b>circle graph</b> shows how a whole is split into parts. Each slice is a percent of the whole circle. A full circle is 360&deg;, so 1% is 3.6&deg;.</p>' +
'<div class="fig">' + pie([{ lab: 'Bus', v: 12 }, { lab: 'Walk', v: 9 }, { lab: 'Car', v: 6 }, { lab: 'Bike', v: 3 }], 'How 30 students get to school') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Bus: 12 of 30 = 12 &divide; 30 = 0.4 = <b>40%</b>. Its slice is 40% of 360&deg; = 0.4 &times; 360 = <b>144&deg;</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: build a circle graph</span>' +
'<div class="ctrl">' + ['Soccer', 'Hockey', 'Basketball', 'Swimming'].map(function (l, i) { return '<label for="pi' + i + '">' + l + ': <output id="pi' + i + 'o"></output><input type="range" id="pi' + i + '" min="0" max="40" value="' + [14, 10, 8, 4][i] + '"></label>'; }).join('') + '</div>' +
'<div class="fig" id="pifig"></div><div class="out" id="piout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The percents in a circle graph always add to 100%, and the angles add to 360&deg;. Use a circle graph only when the parts make <b>one whole</b>.</p></div>' +
A.yt({ q: 'In a circle graph, a slice is 25% of the circle. What is its angle?', answer: 90, unit: '&deg;', hint: '25% is one quarter of 360&deg;.', explain: '0.25 &times; 360 = 90&deg;.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Choosing a graph, and infographics</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Graph</th><th class="l">Best for</th></tr></thead><tbody>' +
'<tr><td class="l">Bar graph</td><td class="l">comparing categories (qualitative or discrete data)</td></tr>' +
'<tr><td class="l">Circle graph</td><td class="l">parts of one whole, as percents</td></tr>' +
'<tr><td class="l">Line graph</td><td class="l">change over time (continuous data)</td></tr>' +
'<tr><td class="l">Histogram</td><td class="l">continuous data grouped into intervals, like heights 140&ndash;149 cm</td></tr>' +
'<tr><td class="l">Stem-and-leaf plot</td><td class="l">a small set of numbers, keeping every value</td></tr></tbody></table></div>' +
'<p>Every graph needs a <b>title</b>, <b>labels</b> on the axes, a sensible <b>scale</b>, and the <b>source</b> of the data.</p>' +
'<p>An <b>infographic</b> tells a story with data. It mixes a few graphs, big numbers and short sentences. Here is a small one about the class from section 2.</p>' +
'<div class="info"><div class="ihead">Getting to school, Room 7B</div><div class="ibig"><b>70%</b><span>come by bus or on foot</span></div>' +
'<div class="fig">' + pie([{ lab: 'Bus', v: 12 }, { lab: 'Walk', v: 9 }, { lab: 'Car', v: 6 }, { lab: 'Bike', v: 3 }], '', 70) + '</div>' +
'<div class="ibig"><b>1 in 10</b><span>bikes, even in winter</span></div><p class="isrc">Source: class survey of 30 students, October</p></div>' +
'<p class="t2">To make your own: pick a question, collect data, choose 2 or 3 displays, write one headline number, and give your source.</p>' +
A.yt({ q: 'Which graph is best for showing how a puppy\'s mass changed each month for a year?', type: 'mc', options: ['Circle graph', 'Line graph', 'Bar graph of favourite colours'], answer: 1, hint: 'The data changes over time.', explain: 'Change over time is shown best with a line graph.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Mean, median and mode, and what changes them</h2>' +
'<div class="tbl"><table><tbody><tr><td class="l"><b>Mean</b></td><td class="l">add all values, divide by how many</td></tr><tr><td class="l"><b>Median</b></td><td class="l">the middle value when the data is in order (the mean of the two middle values if there is an even number)</td></tr><tr><td class="l"><b>Mode</b></td><td class="l">the value that appears most often</td></tr><tr><td class="l"><b>Range</b></td><td class="l">greatest minus least: how spread out the data is</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Goals in 7 games: 2, 3, 3, 4, 5, 6, 12. Mean: 35 &divide; 7 = 5. Median: 4. Mode: 3.</p><p>Remove the 12 (one unusual game, an <b>outlier</b>): mean becomes 23 &divide; 6 &asymp; 3.8, median 3.5. The mean moved a lot. The median moved a little.</p></div>' +
'<div class="lab"><span class="lt">Try it: add and remove data</span>' +
'<div class="btnrow"><label for="dpv" class="sr">Value to add</label><input type="number" id="dpv" min="0" max="20" value="18"><button type="button" class="btn" id="dpadd">Add value</button><button type="button" class="btn alt" id="dprem">Remove last value</button><button type="button" class="btn alt" id="dpres">Reset</button></div>' +
'<div class="fig" id="dpfig"></div><div class="out" id="dpout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>An outlier pulls the <b>mean</b> toward it. The <b>median</b> hardly moves. When data has an outlier, the median often describes the "typical" value better.</p></div>' +
A.yt({ q: 'Find the median of 8, 3, 10, 5, 7, 4.', answer: 6, hint: 'Put them in order. There are 6 values, so use the two in the middle.', explain: 'In order: 3, 4, 5, 7, 8, 10. The middle two are 5 and 7. Median = (5 + 7) &divide; 2 = 6.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Misleading graphs</h2>' +
'<p>A graph can be true but still give the wrong idea. Watch for an axis that does <b>not start at 0</b>, a stretched scale, missing labels, or pictures of different sizes.</p>' +
'<div class="lab"><span class="lt">Try it: same data, two graphs</span>' +
'<div class="ctrl"><label for="mlz">Vertical axis starts at: <output id="mlzo"></output><input type="range" id="mlz" min="0" max="95" step="5" value="90"></label></div>' +
'<div class="fig" id="mlfig"></div><div class="out" id="mlout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Judging by the height of the bars without reading the scale. Always check where the axis starts and what each line is worth.</p></div>' +
'<p>When you read any data, ask: Who collected it? How big was the sample? Does the graph make a difference look bigger than it is? What might be left out?</p>' +
A.yt({ q: 'A graph\'s axis starts at 50. Bar A reaches 52 and bar B reaches 56. Bar B looks 3 times as tall. What is B really, compared to A?', type: 'mc', options: ['3 times as much', 'About 8% more', 'Twice as much'], answer: 1, hint: 'Compare the actual values, 52 and 56.', explain: '56 is 4 more than 52. 4 &divide; 52 is about 8%. The cut-off axis makes it look huge.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Independent and dependent events</h2>' +
'<p>Two events are <b>independent</b> if the first does not change the chances of the second. Flipping a coin and rolling a die are independent. To find the chance of both, <b>multiply</b> the probabilities.</p>' +
'<div class="fig">' + tree(['H', 'T'], ['1', '2', '3', '4', '5', '6'], 'coin', 'die') + '</div>' +
'<p>There are 2 &times; 6 = 12 equally likely outcomes. P(heads and a 6) = ' + fr(1, 2) + ' &times; ' + fr(1, 6) + ' = ' + fr(1, 12) + '.</p>' +
'<p>Events are <b>dependent</b> if the first changes the second. Picking marbles <b>without putting the first one back</b> is dependent: there is one fewer marble in the bag.</p>' +
'<div class="row2"><div class="fig">' + bag(3, 2) + '</div><div class="eg"><b class="t">Worked example</b><p>3 red, 2 blue. Pick two without replacing.</p><p>P(red first) = ' + fr(3, 5) + '. Now 2 red of 4 are left: P(red second) = ' + fr(2, 4) + '.</p><p>P(red, red) = ' + fr(3, 5) + ' &times; ' + fr(2, 4) + ' = ' + fr(6, 20) + ' = ' + fr(3, 10) + '.</p><p>With replacing, it would be ' + fr(3, 5) + ' &times; ' + fr(3, 5) + ' = ' + fr(9, 25) + '.</p></div></div>' +
'<div class="vs"><div><b class="t">Independent</b><p>Put the marble back. The bag is the same for the second pick.</p></div><div><b class="t">Dependent</b><p>Keep the marble. The bag has changed for the second pick.</p></div></div>' +
'<div class="lab"><span class="lt">Try it: experiment with the bag of 3 red and 2 blue</span>' +
'<div class="ctrl"><label for="mbr">Put the first marble back?<select id="mbr"><option value="1">Yes (independent)</option><option value="0" selected>No (dependent)</option></select></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="mb10">Pick two, 10 times</button><button type="button" class="btn" id="mb500">Pick two, 500 times</button><button type="button" class="btn alt" id="mbclr">Clear</button></div>' +
'<div class="out" id="mbout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The <b>experimental</b> probability (from trials) gets closer to the <b>theoretical</b> probability (from reasoning) as the number of trials grows.</p></div>' +
A.yt({ q: 'A bag has 4 green and 6 yellow cubes. You pick one, keep it, and pick another. What is P(green, green)? Type a fraction.', answer: 2 / 15, show: '2/15', kb: 'text', tol: 1e-6, hint: 'First pick: 4 of 10. Second pick: 3 of 9.', explain: fr(4, 10) + ' &times; ' + fr(3, 9) + ' = ' + fr(12, 90) + ' = ' + fr(2, 15) + '.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.bind(root, ['pi0', 'pi1', 'pi2', 'pi3'], function () {
        var labs = ['Soccer', 'Hockey', 'Basketball', 'Swimming'], items = labs.map(function (l, i) { var v = +$('#pi' + i, root).value; $('#pi' + i + 'o', root).textContent = v; return { lab: l, v: v }; });
        var tot = items.reduce(function (s, i) { return s + i.v; }, 0);
        if (!tot) { $('#pifig', root).innerHTML = ''; $('#piout', root).innerHTML = '<p>Add some votes.</p>'; return; }
        $('#pifig', root).innerHTML = pie(items, 'Favourite sport (' + tot + ' votes)');
        $('#piout', root).innerHTML = '<div class="tbl"><table><thead><tr><th class="l">Sport</th><th>Votes</th><th>Percent</th><th>Angle</th></tr></thead><tbody>' + items.map(function (i) { return '<tr><td class="l">' + i.lab + '</td><td>' + i.v + '</td><td>' + (Math.round(i.v / tot * 1000) / 10) + '%</td><td>' + (Math.round(i.v / tot * 3600) / 10) + '&deg;</td></tr>'; }).join('') + '<tr><td class="l"><b>Total</b></td><td><b>' + tot + '</b></td><td><b>100%</b></td><td><b>360&deg;</b></td></tr></tbody></table></div>';
      });
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
      A.bind(root, ['mlz'], function () {
        var z = +$('#mlz', root).value, it = [{ lab: 'Brand A', v: 96 }, { lab: 'Brand B', v: 98 }, { lab: 'Brand C', v: 97 }];
        $('#mlzo', root).textContent = z;
        $('#mlfig', root).innerHTML = bars(it, z, 100, 'Customers happy (%)');
        $('#mlout', root).innerHTML = z > 0 ? '<p>The axis starts at ' + z + ', so Brand B\'s bar looks ' + (Math.round((98 - z) / (96 - z) * 10) / 10) + ' times as tall as Brand A\'s. Really, 98% is only 2 points more than 96%.</p>' : '<p>With the axis at 0, you can see the three brands are almost the same.</p>';
      });
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
    },

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
