(function () {
  var A = Atlas, R = A.R;
  function cl(x) { return parseFloat(x.toPrecision(10)); }
  /* small seeded random generator, so pictures stay the same between visits */
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function gauss(r) { var u = r() || 1e-9, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function corr(pts) {
    var n = pts.length, mx = 0, my = 0;
    pts.forEach(function (p) { mx += p[0]; my += p[1]; }); mx /= n; my /= n;
    var sxy = 0, sxx = 0, syy = 0;
    pts.forEach(function (p) { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); syy += (p[1] - my) * (p[1] - my); });
    return sxy / Math.sqrt(sxx * syy || 1);
  }
  /* points with a given direction (1, -1, 0) and strength ('strong', 'weak'); retries until r matches the label */
  var BANDS = { strong: [0.85, 0.98], weak: [0.35, 0.6], none: [0, 0.15] };
  function makePts(dir, str, seed, n, outlier) {
    n = n || 18;
    var band = BANDS[dir === 0 ? 'none' : str];
    for (var tries = 0; tries < 400; tries++) {
      var r = rng(seed + tries * 7919), pts = [];
      var sd = dir === 0 ? 3 : str === 'strong' ? 0.55 : 2.1;
      for (var i = 0; i < n; i++) {
        var x = 0.5 + 9 * r(), y = dir === 0 ? 2 + 6 * r() : 5 + dir * 0.5 * (x - 5) + sd * gauss(r) * 0.5;
        pts.push([x, Math.max(0.3, Math.min(9.7, y))]);
      }
      var c = Math.abs(corr(pts));
      if (c >= band[0] && c <= band[1] && (dir === 0 || corr(pts) * dir > 0)) {
        if (outlier) pts.push(dir >= 0 ? [8.6, 1.2] : [8.6, 8.8]);
        return pts;
      }
    }
    return pts;
  }
  /* scatter plot. o: {pts, xl, yl, xs:[lo,hi,step], ys, title, src, hl:index} */
  function scatter(o) {
    var x0 = 54, y0 = 214, W = 326, H = 176, s = '', xs = o.xs || [0, 10, 2], ys = o.ys || [0, 10, 2];
    function X(v) { return x0 + W * (v - xs[0]) / (xs[1] - xs[0]); } function Y(v) { return y0 - H * (v - ys[0]) / (ys[1] - ys[0]); }
    if (o.title) s += '<text x="200" y="18" text-anchor="middle" font-size="16" class="tb">' + o.title + '</text>';
    for (var v = ys[0]; v <= ys[1] + 1e-9; v += ys[2]) s += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + (x0 + W) + '" y2="' + Y(v) + '" style="stroke:var(--line)"/>' + (o.nums === false ? '' : '<text x="' + (x0 - 7) + '" y="' + (Y(v) + 5) + '" text-anchor="end" font-size="14">' + cl(v) + '</text>');
    for (var u = xs[0]; u <= xs[1] + 1e-9; u += xs[2]) s += '<line x1="' + X(u) + '" y1="' + y0 + '" x2="' + X(u) + '" y2="' + (y0 + 5) + '" style="stroke:var(--ink)"/>' + (o.nums === false ? '' : '<text x="' + X(u) + '" y="' + (y0 + 21) + '" text-anchor="middle" font-size="14">' + cl(u) + '</text>');
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + W) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + (y0 - H) + '" x2="' + x0 + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="1.5"/>';
    s += '<text x="' + (x0 + W / 2) + '" y="' + (y0 + 42) + '" text-anchor="middle" font-size="15">' + (o.xl || '') + '</text>';
    s += '<text transform="translate(16,' + (y0 - H / 2) + ') rotate(-90)" text-anchor="middle" font-size="15">' + (o.yl || '') + '</text>';
    o.pts.forEach(function (p, i) {
      var hl = o.hl === i || (o.hl === 'last' && i === o.pts.length - 1);
      s += '<circle cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="' + (hl ? 7 : 5) + '" style="fill:' + (hl ? 'var(--accent)' : 'var(--strand)') + ';fill-opacity:' + (hl ? 1 : 0.8) + ';stroke:var(--card)" stroke-width="1"/>';
    });
    var H2 = y0 + 50;
    if (o.src) { s += '<text x="' + x0 + '" y="' + (y0 + 64) + '" font-size="13" class="t2">Source: ' + o.src + '</text>'; H2 += 18; }
    return A.svg(400, H2, s, o.label || 'Scatter plot with ' + o.pts.length + ' points. ' + (o.desc || ''));
  }
  /* bar chart, possibly with a broken axis */
  function bars(vals, names, from, title, unit) {
    var x0 = 54, y0 = 200, W = 320, H = 170, s = '', mx = Math.max.apply(null, vals), top = Math.ceil(mx / 10) * 10 + (from ? 0 : 10);
    if (from && top - from < 10) top = from + 10;
    function Y(v) { return y0 - H * (v - from) / (top - from); }
    var step = (top - from) > 50 ? 20 : (top - from) > 20 ? 10 : (top - from) > 8 ? 2 : 1;
    s += '<text x="200" y="16" text-anchor="middle" font-size="16" class="tb">' + title + '</text>';
    for (var v = from; v <= top; v += step) s += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + (x0 + W) + '" y2="' + Y(v) + '" style="stroke:var(--line)"/><text x="' + (x0 - 7) + '" y="' + (Y(v) + 5) + '" text-anchor="end" font-size="14">' + v + '</text>';
    var bw = W / vals.length;
    vals.forEach(function (val, i) {
      s += '<rect x="' + (x0 + i * bw + bw * 0.2) + '" y="' + Y(val) + '" width="' + bw * 0.6 + '" height="' + (y0 - Y(val)) + '" style="fill:color-mix(in srgb,var(--strand) ' + (40 + i * 15) + '%,var(--card))"/>' +
        '<text x="' + (x0 + (i + 0.5) * bw) + '" y="' + (y0 + 20) + '" text-anchor="middle" font-size="15">' + names[i] + '</text>' +
        '<text x="' + (x0 + (i + 0.5) * bw) + '" y="' + (Y(val) - 6) + '" text-anchor="middle" font-size="14" class="tb">' + val + '</text>';
    });
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + W) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + (y0 - H) + '" x2="' + x0 + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="1.5"/>';
    if (from) s += '<path d="M' + (x0 - 8) + ' ' + (y0 - 10) + ' l8 -5 l8 5" fill="none" style="stroke:var(--bad)" stroke-width="2"/><text x="' + (x0 + 6) + '" y="' + (y0 + 40) + '" font-size="14" style="fill:var(--bad)" class="tb">The axis starts at ' + from + ', not 0</text>';
    return A.svg(400, y0 + (from ? 48 : 30), s, title + '. Bar chart: ' + names.map(function (n, i) { return n + ' ' + vals[i]; }).join(', ') + '. ' + (from ? 'The vertical axis starts at ' + from + ', which exaggerates the differences.' : 'The vertical axis starts at 0.'));
  }

  var HT = [[152, 150], [160, 158], [148, 151], [171, 169], [165, 167], [158, 155], [175, 178], [162, 160], [155, 157], [168, 166]];
  var TBL = '<div class="tbl"><table><thead><tr><th class="l">Student</th>' + HT.map(function (p, i) { return '<th>' + String.fromCharCode(65 + i) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    '<tr><td class="l">Height (cm)</td>' + HT.map(function (p) { return '<td>' + p[0] + '</td>'; }).join('') + '</tr><tr><td class="l">Arm span (cm)</td>' + HT.map(function (p) { return '<td>' + p[1] + '</td>'; }).join('') + '</tr></tbody></table></div>';

  var CODE1 = function (lim, ge) {
    return 'temps = [4, -2, 7, 0, 5, 9, -6, 3]\ncount = 0\nfor t in temps:\n    if t ' + (ge ? '&gt;=' : '&gt;') + ' ' + lim + ':\n        count = count + 1\nprint(count)';
  };
  var TEMPS = [4, -2, 7, 0, 5, 9, -6, 3];

  var html =
'<section class="sec"><h2><span class="n">1</span>One-variable and two-variable data</h2>' +
'<p><b>One-variable data</b> measures one thing about each person or object, like everyone\'s favourite sport. <b>Two-variable data</b> measures two things about each one, so you can ask whether they are related, like each student\'s height <b>and</b> arm span.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Question</th><th>Type</th></tr></thead><tbody>' +
'<tr><td class="l">How many hours of sleep do Grade 8 students get?</td><td>one-variable</td></tr>' +
'<tr><td class="l">Do students who sleep more get higher test scores?</td><td>two-variable</td></tr>' +
'<tr><td class="l">What is the most common pet in our class?</td><td>one-variable</td></tr>' +
'<tr><td class="l">Does a car\'s speed affect how far it takes to stop?</td><td>two-variable</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Is "Does the temperature affect how many hot chocolates a caf&eacute; sells?" one- or two-variable?</p><ol><li>List what you would record for each day: the temperature, and the number of hot chocolates sold.</li><li>That is two measurements for each day.</li><li>So it needs two-variable data.</li></ol></div>' +
A.yt({ q: '"How long does each student take to get to school?" needs which kind of data?', opts: ['One-variable', 'Two-variable'], a: 0, back: 'Go back to step 1: list what you would record for each student. How many measurements is that?', ok: 'You record one thing per student, the travel time. That is one-variable data.' }) +
'<div class="key"><b class="t">Key idea</b><p>If the question uses words like "affect", "related to" or "does more of one mean more of the other", you need two-variable data.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Collecting data in a table of values</h2>' +
'<p><b>Continuous data</b> can be any value in a range, like 152.4 cm or 3.75 s. You measure it. <b>Discrete data</b> can only be certain values, like 3 pets. You count it.</p>' +
'<p>A Grade 8 class measured each student\'s height and arm span. Each column is one student. Each student gives a pair of values.</p>' + TBL +
'<div class="eg"><b class="t">Worked example</b><p>Plan a data collection for "Does a ball bounce higher when dropped from higher up?"</p><ol><li>Variables: drop height (cm) and bounce height (cm). Both are continuous.</li><li>Drop the ball from 50, 100, 150 and 200 cm. Do 3 trials each and record the mean bounce.</li><li>Record each drop height and bounce height as a pair in a table of values.</li></ol></div>' +
A.yt({ q: 'Which of these is continuous data?', opts: ['The time to run 100 m', 'The number of goals in a game', 'The number of siblings you have', 'Your favourite colour'], a: 0, back: 'Ask for each one: is it measured (any value in a range) or counted (only whole numbers)?', ok: 'A run time can be 14.38 s or any value between, so it is continuous. Goals and siblings are counted, so they are discrete.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Choosing a graph and making a scatter plot</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Data</th><th class="l">Good graph</th></tr></thead><tbody>' +
'<tr><td class="l">Categories (favourite sport)</td><td class="l">bar graph or circle graph</td></tr>' +
'<tr><td class="l">One continuous variable (heights)</td><td class="l">histogram</td></tr>' +
'<tr><td class="l">Change over time (temperature each hour)</td><td class="l">line graph</td></tr>' +
'<tr><td class="l">Two variables, looking for a relationship</td><td class="l"><b>scatter plot</b></td></tr></tbody></table></div>' +
'<p>A good graph has a <b>title</b>, <b>labels with units</b> on both axes, an even <b>scale</b>, and the <b>source</b> of the data.</p>' +
'<div class="fig">' + scatter({ pts: HT, xs: [145, 180, 5], ys: [145, 180, 5], title: 'Height and arm span of 10 Grade 8 students', xl: 'Height (cm)', yl: 'Arm span (cm)', src: 'class measurements, October', desc: 'The points rise from left to right in a tight line.' }) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Plot student A from the table.</p><ol><li>Height goes across: find 152 on the horizontal axis.</li><li>Arm span goes up: find 150 on the vertical axis.</li><li>Put a dot where they meet. Each dot is one student.</li></ol></div>' +
A.yt({ q: 'Which graph best shows the temperature outside every hour for one day?', opts: ['Line graph', 'Scatter plot', 'Circle graph', 'Histogram'], a: 0, back: 'Look at the table: which graph is for change over time?', ok: 'Temperature changing over time is best shown with a line graph.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>The variable you think might <b>cause</b> the change usually goes across the bottom (horizontal axis). The one that might respond goes up the side.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Describing a relationship</h2>' +
'<p>Look at the overall shape of a scatter plot:</p>' +
'<ul class="steplist"><li><b>Direction.</b> Up from left to right is <b>positive</b>. Down is <b>negative</b>. No slope is <b>none</b>.</li><li><b>Strength.</b> Points close to a straight line make a <b>strong</b> relationship. Loosely scattered points make a <b>weak</b> one.</li><li><b>Outliers.</b> A point far from the others is an outlier. Check if it is a mistake, but do not delete it just because it is unusual.</li></ul>' +
'<div class="lab"><span class="lt">Try it: shape a scatter plot</span>' +
'<div class="ctrl"><label for="scd">Direction<select id="scd"><option value="1">positive</option><option value="-1">negative</option><option value="0">none</option></select></label>' +
'<label for="scs">Strength<select id="scs"><option value="strong">strong</option><option value="weak">weak</option></select></label>' +
'<label for="sco">Outlier<select id="sco"><option value="0">no</option><option value="1">add one</option></select></label></div>' +
'<div class="fig" id="scfig"></div><div class="out" id="scout"></div><div class="btnrow"><button type="button" class="btn alt" id="scnew">New sample</button></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Describe the height and arm span plot in part 3.</p><ol><li>Direction: the points go up from left to right, so it is positive.</li><li>Strength: the points are close to a straight line, so it is strong.</li><li>Outliers: none. Conclusion: taller students in this class tend to have longer arm spans.</li></ol></div>' +
A.yt({ q: 'The more minutes students spent on their phones before bed, the fewer hours they slept, and the points were close to a line. How would you describe it?', opts: ['Strong negative', 'Strong positive', 'Weak negative', 'None'], a: 0, back: 'Go back to steps 1 and 2: more of one goes with less of the other. Which direction is that? Close to a line means which strength?', ok: 'More phone time goes with less sleep: negative. Close to a line: strong.' }) +
'<div class="key"><b class="t">Key idea</b><p>A relationship does not prove that one thing <b>causes</b> the other. Ice cream sales and sunburns both rise in summer, but ice cream does not cause sunburns. Hot weather affects both.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Misleading graphs and good conclusions</h2>' +
'<p>A graph can be accurate and still give the wrong impression. The most common trick is a vertical axis that does not start at 0.</p>' +
'<div class="lab"><span class="lt">Try it: move the axis</span>' +
'<div class="ctrl"><label for="mgf">Vertical axis starts at<select id="mgf"><option value="0">0</option><option value="80" selected>80</option><option value="88">88</option></select></label></div>' +
'<div class="fig" id="mgfig"></div><div class="out" id="mgout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Brand B says "Our phone lasts much longer!" Its graph shows battery life of 90 h for brand A and 94 h for brand B, with the axis starting at 88. Is the claim fair?</p><ol><li>The B bar looks 3 times as tall as A, because only the part above 88 shows.</li><li>Real difference: 94 &minus; 90 = 4 h.</li><li>Compare to A: 4 &divide; 90 &asymp; 0.044, about 4% longer. That is not "much" longer.</li></ol></div>' +
A.yt({ q: 'Store A sold 50 bikes and store B sold 55. What percent more did B sell than A?', a: 10, unit: '%', back: 'Go back to steps 2 and 3: find the real difference, then divide by A\'s amount.', ok: '55 &minus; 50 = 5, and 5 &divide; 50 = 0.1 = 10%.' }) +
'<p>Other things to check: Who collected the data, and why? How big was the sample? Are percents compared to the same total? An <b>infographic</b> tells a story with data using graphs, numbers and pictures. A fair infographic shows its source and does not stretch the scales.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Using code to analyse data</h2>' +
'<p>Code can sort through data much faster than we can. This short program counts how many temperatures (&deg;C) are above a limit.</p>' +
'<div class="lab"><span class="lt">Try it: change the code</span>' +
'<div class="ctrl"><label for="cdl">Limit: <output id="cdlo"></output><input type="range" id="cdl" min="-8" max="10" value="3"></label><label for="cdg">Comparison<select id="cdg"><option value="0">&gt; (greater than)</option><option value="1">&gt;= (greater than or equal)</option></select></label></div>' +
'<code class="mono" id="cdcode"></code><div class="out" id="cdout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Trace the code with limit 3 and &gt;.</p><ol><li>Go through the list one value at a time: 4, &minus;2, 7, 0, 5, 9, &minus;6, 3.</li><li>Values greater than 3: 4, 7, 5, 9. Each adds 1 to count.</li><li>3 is not greater than 3. The program prints 4.</li></ol></div>' +
A.yt({ q: 'If the line changes to <code>if t &gt;= 3:</code>, what does the program print?', a: 5, back: 'Go back to step 2: now a value equal to 3 also counts. Check each value again.', ok: '4, 7, 5, 9 and now 3 as well: the count is 5.' }) +
'<div class="key"><b class="t">Key idea</b><p>Efficient code does the job with fewer steps. To find both the count and the total, one loop that updates both is more efficient than two separate loops over the same list.</p></div>' +
'<code class="mono">count = 0\ntotal = 0\nfor t in temps:\n    total = total + t\n    if t &gt; 3:\n        count = count + 1\nprint(count, total / len(temps))</code>' +
'</section>';

  var Q1 = [['How tall are the students in our school?', 0], ['Does practice time affect free-throw success?', 1], ['What is the most popular lunch at our school?', 0], ['Is there a link between a dog\'s age and its mass?', 1], ['How much rain fell each month this year?', 0], ['Do taller plants produce more tomatoes?', 1], ['How many hours do students spend on homework?', 0], ['Does the price of a car relate to its fuel use?', 1]];
  var CT = [['the mass of a newborn baby', 1], ['the number of students in a class', 0], ['the time to finish a puzzle', 1], ['the number of pets at home', 0], ['the temperature at noon', 1], ['the number of red cars in a parking lot', 0], ['the length of a river', 1], ['the number of goals scored', 0]];
  var GR = [['The number of students who chose each lunch option', 'Bar graph'], ['How the price of a stock changed each month this year', 'Line graph'], ['Hours of study and test scores for 30 students', 'Scatter plot'], ['The heights of 120 students, in groups like 150 to 155 cm', 'Histogram'], ['What fraction of the school budget goes to each area', 'Circle graph'], ['Engine size and fuel use for 25 cars', 'Scatter plot'], ['Daily high temperature for the month of May', 'Line graph']];
  var GRS = ['Bar graph', 'Line graph', 'Scatter plot', 'Histogram', 'Circle graph'];
  var practice = [
    { id: 'da-type', name: 'Kinds of data', code: 'D1.1', gen: function (lv) {
      if (lv === 2) { var c = R.pick(CT); return { q: 'Is <b>' + c[0] + '</b> continuous or discrete data?', type: 'mc', options: ['Continuous', 'Discrete'], answer: c[1] ? 0 : 1,
        hint: 'Is it measured (any value in a range) or counted?', steps: ['Ask: could it be a value like 3.47?', c[1] ? 'Yes, it is measured.' : 'No, it is counted in whole numbers.', 'So it is ' + (c[1] ? 'continuous' : 'discrete') + '.'], explain: c[0].charAt(0).toUpperCase() + c[0].slice(1) + ' is ' + (c[1] ? 'measured, so continuous.' : 'counted, so discrete.') }; }
      var q = R.pick(Q1);
      return { q: (lv === 3 ? 'A student wants to answer: ' : '') + '"' + q[0] + '" Does this need one-variable or two-variable data?', type: 'mc', options: ['One-variable', 'Two-variable'], answer: q[1],
        hint: 'List what you would record for each person or object. One thing or two?', steps: ['Think of what to record for each case.', q[1] ? 'Two measurements, to see if they are related.' : 'One measurement only.', 'So it is ' + (q[1] ? 'two' : 'one') + '-variable data.'], explain: 'This question needs ' + (q[1] ? 'two' : 'one') + '-variable data.' };
    } },
    { id: 'da-graph', name: 'Choose a graph', code: 'D1.3', gen: function (lv) {
      var g = R.pick(GR), o = R.mc(g[1], R.shuffle(GRS.filter(function (x) { return x !== g[1]; })));
      return { q: 'Which graph best shows: ' + g[0].charAt(0).toLowerCase() + g[0].slice(1) + '?', type: 'mc', options: o.options, answer: o.answer,
        hint: 'Categories: bar. Change over time: line. Two variables: scatter. Grouped continuous: histogram. Parts of a whole: circle.', steps: ['Decide what kind of data it is.', 'Match it to the graph in the table from part 3.', 'Best choice: ' + g[1].toLowerCase() + '.'], explain: 'A ' + g[1].toLowerCase() + ' suits this data best.' };
    } },
    { id: 'da-corr', name: 'Describe a scatter plot', code: 'D1.5', gen: function (lv) {
      var dir = R.pick([1, -1, 0]), str = R.pick(['strong', 'weak']), seed = R.int(1, 1e6), out = lv === 3 && R.int(0, 1) && dir !== 0;
      if (lv === 1) str = 'strong';
      var pts = makePts(dir, str, seed, 18, out), right = dir === 0 ? 'No relationship' : (str === 'strong' ? 'Strong ' : 'Weak ') + (dir > 0 ? 'positive' : 'negative');
      var all = ['Strong positive', 'Weak positive', 'Strong negative', 'Weak negative', 'No relationship'];
      var choices = lv === 1 ? all.filter(function (x) { return x === right || x === 'No relationship' || /Strong/.test(x); }) : all;
      var o = R.mc(right, R.shuffle(choices.filter(function (x) { return x !== right; })));
      return { q: 'Describe the relationship in this scatter plot.' + (out ? ' (Ignore the large highlighted point: it is an outlier.)' : ''), type: 'mc', options: o.options, answer: o.answer,
        fig: scatter({ pts: pts, nums: false, xl: 'variable 1', yl: 'variable 2', hl: out ? 'last' : -1, desc: '' }),
        hint: 'Direction first: do the points go up, down, or neither from left to right? Then strength: how close are they to a straight line?',
        steps: ['Direction: ' + (dir > 0 ? 'up from left to right, positive.' : dir < 0 ? 'down from left to right, negative.' : 'no clear up or down trend.'), dir === 0 ? 'No direction means no relationship.' : 'Strength: the points are ' + (str === 'strong' ? 'close to a line, strong.' : 'loosely spread, weak.'), 'Answer: ' + right.toLowerCase() + '.'],
        explain: 'It shows ' + (dir === 0 ? 'no relationship' : 'a ' + right.toLowerCase() + ' relationship') + '.' };
    } },
    { id: 'da-mislead', name: 'Read a misleading graph', code: 'D1.6', gen: function (lv) {
      var a = R.int(40, 90), pc = R.pick([2, 4, 5, 10, 20, 25]), b = cl(a * (1 + pc / 100));
      while (b % 1) { a++; b = cl(a * (1 + pc / 100)); }
      var from = Math.max(0, Math.floor(a / 10) * 10 - (lv === 1 ? 0 : 0));
      if (lv === 1) return { q: 'Why might this graph be misleading?', type: 'mc', options: ['The vertical axis does not start at 0', 'It has no bars', 'The bars are in the wrong order', 'It shows too many categories'], answer: 0, fig: bars([a, b], ['A', 'B'], from || 10, 'Sales this year'),
        hint: 'Look at the numbers on the vertical axis. Where do they start?', steps: ['Check the bottom of the vertical axis.', 'It starts at ' + (from || 10) + ', not 0.', 'That makes the difference between the bars look bigger than it is.'], explain: 'Starting the axis above 0 exaggerates the difference.' };
      return { q: 'Using the real values, what percent more is B than A?', type: 'num', unit: '%', answer: pc, fig: bars([a, b], ['A', 'B'], from || 10, 'Sales this year'),
        hint: 'Find the difference, then divide by A. Ignore how tall the bars look.', steps: ['Difference: ' + b + ' &minus; ' + a + ' = ' + cl(b - a) + '.', 'Divide by A: ' + cl(b - a) + ' &divide; ' + a + ' = ' + cl(pc / 100) + '.', 'That is ' + pc + '%.'], explain: 'B is ' + pc + '% more than A, even though the bar looks much taller.' };
    } },
    { id: 'da-code', name: 'Trace code with data', code: 'C3.2', gen: function (lv) {
      var list = [], n = lv === 1 ? 5 : 6;
      for (var i = 0; i < n; i++) list.push(R.int(-5, 12));
      var lim = R.int(0, 8), ge = lv === 3 && R.int(0, 1), code, ans, st, k = list.filter(function (t) { return ge ? t >= lim : t > lim; });
      if (lv === 2 && R.int(0, 1)) {
        var tot = list.reduce(function (s, t) { return s + t; }, 0);
        code = 'data = [' + list.join(', ') + ']\ntotal = 0\nfor x in data:\n    total = total + x\nprint(total)';
        return { q: 'What does this program print?<code class="mono">' + code + '</code>', type: 'num', answer: tot, show: A.neg(tot),
          hint: 'The loop adds every value to total, one at a time.', steps: ['total starts at 0.', 'Add each value: ' + list.map(A.neg).join(' + ') + '.', 'It prints ' + A.neg(tot) + '.'], explain: 'The sum of the list is ' + A.neg(tot) + '.' };
      }
      code = 'data = [' + list.join(', ') + ']\ncount = 0\nfor x in data:\n    if x ' + (ge ? '&gt;=' : '&gt;') + ' ' + lim + ':\n        count = count + 1\nprint(count)';
      return { q: 'What does this program print?<code class="mono">' + code + '</code>', type: 'num', answer: k.length,
        hint: 'Go through the list one value at a time. Only values ' + (ge ? 'greater than or equal to ' : 'greater than ') + lim + ' add 1.', steps: ['Check each value against ' + lim + '.', 'Values that pass: ' + (k.length ? k.join(', ') : 'none') + '.', 'count ends at ' + k.length + '.'], explain: k.length + ' value' + (k.length === 1 ? '' : 's') + ' pass the test.' };
    } }
  ];

  var quiz = [
    { q: '"Is there a relationship between the number of hours a phone is used and its battery temperature?" What kind of data is needed?', type: 'mc', options: ['Two-variable', 'One-variable'], answer: 0, hint: 'How many things would you record for each phone?', explain: 'Two measurements per phone (hours and temperature), so two-variable data.' },
    { q: 'Which is <b>discrete</b> data?', type: 'mc', options: ['The number of texts sent in a day', 'The length of a song', 'The mass of a backpack', 'The time to walk home'], answer: 0, hint: 'Discrete data is counted.', explain: 'You count texts in whole numbers. The others are measured, so they are continuous.' },
    { q: 'Which graph best shows the relationship between hours of practice and points scored for 20 players?', type: 'mc', options: ['Scatter plot', 'Circle graph', 'Bar graph', 'Line graph'], answer: 0, hint: 'Two variables, looking for a relationship.', explain: 'Each player gives a pair of values, so a scatter plot fits.' },
    { q: 'Describe this scatter plot.', fig: scatter({ pts: makePts(-1, 'strong', 4242, 18), nums: false, xl: 'age of car (years)', yl: 'value ($)', desc: 'The points fall from left to right, close to a line.' }), type: 'mc', options: ['Strong negative', 'Weak positive', 'Strong positive', 'No relationship'], answer: 0, hint: 'Do the points go up or down from left to right? How close are they to a line?', explain: 'The points go down from left to right, close to a line: a strong negative relationship. Older cars tend to be worth less.' },
    { q: 'A graph shows 72% for one brand and 75% for another, with the axis starting at 70%. The second bar looks 2.5 times as tall. By how many percentage points do they really differ?', type: 'num', answer: 3, hint: 'Subtract the real values.', explain: '75 &minus; 72 = 3 percentage points. The broken axis makes it look much bigger.' },
    { q: 'Students found that towns with more libraries have more crime. What is the best conclusion?', type: 'mc', options: ['Bigger towns tend to have more of both; libraries do not cause crime', 'Libraries cause crime', 'Closing libraries would lower crime', 'The data must be wrong'], answer: 0, hint: 'A relationship does not prove cause. Is there something else that affects both?', explain: 'Population affects both. A relationship alone does not show cause and effect.' },
    { q: 'What does this program print?<code class="mono">scores = [12, 7, 15, 9, 20]\ncount = 0\nfor s in scores:\n    if s &gt;= 12:\n        count = count + 1\nprint(count)</code>', type: 'num', answer: 3, hint: 'Count the scores that are 12 or more.', explain: '12, 15 and 20 are at least 12, so it prints 3.' }
  ];

  A.register('data', {
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); }, seed = 1234;
      function sc() {
        var dir = +$('#scd').value, str = $('#scs').value, out = $('#sco').value === '1';
        $('#scs').disabled = dir === 0;
        var pts = makePts(dir, str, seed, 20, out), r = corr(pts.slice(0, 20));
        var name = dir === 0 ? 'no relationship' : str + ' ' + (dir > 0 ? 'positive' : 'negative');
        $('#scfig').innerHTML = scatter({ pts: pts, nums: false, xl: 'variable 1', yl: 'variable 2', hl: out ? 'last' : -1, desc: 'This shows ' + name + '.' });
        $('#scout').innerHTML = '<span class="big">' + name.charAt(0).toUpperCase() + name.slice(1) + '</span><br>' +
          (dir === 0 ? 'The points are spread with no up or down trend.' : str === 'strong' ? 'The points stay close to a straight line.' : 'There is a trend, but the points are loosely scattered.') +
          (out ? ' The large highlighted point is an outlier: far from the pattern of the rest.' : '');
      }
      A.bind(root, ['scd', 'scs', 'sco'], sc);
      $('#scnew').addEventListener('click', function () { seed = Math.floor(Math.random() * 1e6); sc(); });
      A.bind(root, ['mgf'], function () {
        var f = +$('#mgf').value;
        $('#mgfig').innerHTML = bars([90, 94], ['Brand A', 'Brand B'], f, 'Battery life (hours)');
        var hA = 90 - f, hB = 94 - f;
        $('#mgout').innerHTML = 'The B bar looks <b>' + cl(Math.round(hB / hA * 10) / 10) + ' times</b> as tall as A. In fact B is only 94 &divide; 90 &asymp; 1.04 times A, about 4% more.' + (f ? ' Starting at ' + f + ' cuts off the bottom of both bars.' : ' Starting at 0 shows the true size.');
      });
      A.bind(root, ['cdl', 'cdg'], function () {
        var lim = +$('#cdl').value, ge = $('#cdg').value === '1', k = TEMPS.filter(function (t) { return ge ? t >= lim : t > lim; });
        $('#cdlo').textContent = lim < 0 ? '−' + -lim : lim;
        $('#cdcode').innerHTML = CODE1(lim, ge);
        $('#cdout').innerHTML = 'Output: <span class="big">' + k.length + '</span><br>Values that pass: ' + (k.length ? k.map(A.neg).join(', ') : 'none') + '.';
      });
    }
  });
})();
