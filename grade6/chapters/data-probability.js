(function () {
  var A = Atlas, R = A.R, gcd = A.gcd;
  function cl(x) { return Math.round(x * 100) / 100; }
  function frac(n, d) { var g = gcd(n, d) || 1; return n === 0 ? '0' : n === d ? '1' : A.fr(n / g, d / g); }
  /* histogram: counts per interval, labels at the boundaries */
  function hist(bins, lo, w, title, xlab) {
    var W = 520, H = 250, x0 = 56, y0 = 200, mx = Math.max.apply(null, bins.concat([1])), top = Math.ceil(mx / 2) * 2, s = '', bw = (W - x0 - 10) / bins.length;
    function Y(v) { return y0 - (y0 - 30) * v / top; }
    for (var g = 0; g <= top; g += top > 10 ? 2 : 1) s += '<line x1="' + x0 + '" y1="' + Y(g) + '" x2="' + (W - 10) + '" y2="' + Y(g) + '" style="stroke:var(--line)"/><text x="' + (x0 - 8) + '" y="' + (Y(g) + 5) + '" text-anchor="end" font-size="16">' + g + '</text>';
    bins.forEach(function (c, i) {
      var x = x0 + i * bw;
      s += '<rect x="' + x + '" y="' + Y(c) + '" width="' + bw + '" height="' + (y0 - Y(c)) + '" style="fill:color-mix(in srgb,var(--strand) 70%,var(--card));stroke:var(--ink)" stroke-width="1.5"/>';
      if (bins.length <= 8 || i % 2 === 0) s += '<text x="' + x + '" y="' + (y0 + 20) + '" text-anchor="middle" font-size="16">' + (lo + i * w) + '</text>';
    });
    s += '<text x="' + (W - 10) + '" y="' + (y0 + 20) + '" text-anchor="middle" font-size="16">' + (lo + bins.length * w) + '</text>';
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 10) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="24" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + ((x0 + W) / 2) + '" y="16" text-anchor="middle" font-size="17" class="tb">' + title + '</text><text x="' + ((x0 + W) / 2) + '" y="' + (y0 + 44) + '" text-anchor="middle" font-size="16" class="t2">' + xlab + '</text>';
    s += '<text x="16" y="' + ((y0 + 30) / 2) + '" font-size="16" class="t2" transform="rotate(-90 16 ' + ((y0 + 30) / 2) + ')" text-anchor="middle">frequency</text>';
    return A.svg(W, H, s, title + '. Histogram with ' + bins.length + ' intervals of width ' + w + ' starting at ' + lo + '. Counts: ' + bins.join(', '));
  }
  function bin(data, lo, w, n) { var b = []; for (var i = 0; i < n; i++) b.push(0); data.forEach(function (d) { var k = Math.floor((d - lo) / w); if (k >= 0 && k < n) b[k]++; }); return b; }
  /* broken-line graph with a y axis that can start above zero */
  function bline(xs, ys, ymin, ymax, step, title, ylab) {
    var W = 520, H = 250, x0 = 60, y0 = 200, s = '';
    function X(i) { return x0 + 20 + (W - x0 - 40) * i / (xs.length - 1); }
    function Y(v) { return y0 - (y0 - 30) * (v - ymin) / (ymax - ymin); }
    for (var g = ymin; g <= ymax; g += step) s += '<line x1="' + x0 + '" y1="' + Y(g) + '" x2="' + (W - 10) + '" y2="' + Y(g) + '" style="stroke:var(--line)"/><text x="' + (x0 - 8) + '" y="' + (Y(g) + 5) + '" text-anchor="end" font-size="16">' + g + '</text>';
    xs.forEach(function (x, i) { s += '<text x="' + X(i) + '" y="' + (y0 + 22) + '" text-anchor="middle" font-size="16">' + x + '</text>'; });
    s += '<polyline points="' + ys.map(function (v, i) { return X(i) + ',' + Y(v); }).join(' ') + '" fill="none" style="stroke:var(--strand)" stroke-width="3"/>';
    ys.forEach(function (v, i) { s += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="5" style="fill:var(--strand)"/>'; });
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 10) + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="24" style="stroke:var(--ink)" stroke-width="2"/>';
    if (ymin > 0) s += '<path d="M' + (x0 - 7) + ' ' + (y0 - 8) + ' l14 -5 M' + (x0 - 7) + ' ' + (y0 - 2) + ' l14 -5" style="stroke:var(--bad)" stroke-width="2"/>';
    s += '<text x="' + ((x0 + W) / 2) + '" y="16" text-anchor="middle" font-size="17" class="tb">' + title + '</text><text x="16" y="' + ((y0 + 30) / 2) + '" font-size="16" class="t2" transform="rotate(-90 16 ' + ((y0 + 30) / 2) + ')" text-anchor="middle">' + ylab + '</text>';
    return A.svg(W, H - 20, s, title + '. Broken-line graph. Values: ' + ys.join(', ') + '. The vertical axis starts at ' + ymin + '.');
  }
  /* dot plot with mean (triangle) and median (bar) marked */
  function dotplot(data, lo, hi) {
    var W = 540, x0 = 30, x1 = 510, y0 = 150, s = '', cnt = {}, st = hi - lo > 20 ? 5 : hi - lo > 10 ? 2 : 1;
    function X(v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var t = lo; t <= hi; t++) { s += '<line x1="' + X(t) + '" y1="' + (y0 - 5) + '" x2="' + X(t) + '" y2="' + (y0 + 5) + '" style="stroke:var(--ink)"/>'; if ((t - lo) % st === 0) s += '<text x="' + X(t) + '" y="' + (y0 + 24) + '" text-anchor="middle" font-size="17">' + t + '</text>'; }
    data.forEach(function (d) { cnt[d] = (cnt[d] || 0) + 1; s += '<circle cx="' + X(d) + '" cy="' + (y0 - 12 - (cnt[d] - 1) * 16) + '" r="7" style="fill:var(--strand);stroke:var(--ink)"/>'; });
    var st2 = stats(data);
    s += '<path d="M' + X(st2.mean) + ' ' + (y0 + 30) + ' l-9 14 h18z" style="fill:var(--hi);stroke:var(--ink)"/><text x="' + X(st2.mean) + '" y="' + (y0 + 62) + '" text-anchor="middle" font-size="16" class="tb">mean</text>';
    s += '<line x1="' + X(st2.median) + '" y1="' + (y0 - 116) + '" x2="' + X(st2.median) + '" y2="' + (y0 + 4) + '" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="6 4"/><text x="' + X(st2.median) + '" y="' + (y0 - 122) + '" text-anchor="middle" font-size="16" class="tb" style="fill:var(--bad)">median</text>';
    return A.svg(W, y0 + 70, s, 'Dot plot of ' + data.length + ' values. Mean ' + cl(st2.mean) + ', median ' + st2.median + '.');
  }
  function stats(d) {
    var s = d.slice().sort(function (a, b) { return a - b; }), n = s.length, sum = s.reduce(function (a, b) { return a + b; }, 0), cnt = {}, best = 0, modes = [];
    s.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; best = Math.max(best, cnt[v]); });
    Object.keys(cnt).forEach(function (k) { if (cnt[k] === best && best > 1) modes.push(+k); });
    return { sorted: s, n: n, sum: sum, mean: sum / n, median: n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2, modes: modes.sort(function (a, b) { return a - b; }), range: s[n - 1] - s[0] };
  }
  /* probability line from 0 to 1 with a marked value */
  function pline(p, lab) {
    var W = 540, x0 = 30, x1 = 510, s = '';
    function X(v) { return x0 + (x1 - x0) * v; }
    s += '<line x1="' + x0 + '" y1="40" x2="' + x1 + '" y2="40" style="stroke:var(--ink)" stroke-width="3"/>';
    [[0, 'impossible', '0'], [0.5, 'even chance', '1/2'], [1, 'certain', '1']].forEach(function (k) { s += '<line x1="' + X(k[0]) + '" y1="30" x2="' + X(k[0]) + '" y2="50" style="stroke:var(--ink)" stroke-width="2"/><text x="' + X(k[0]) + '" y="72" text-anchor="middle" font-size="17">' + k[2] + '</text><text x="' + Math.min(Math.max(X(k[0]), 60), 480) + '" y="92" text-anchor="middle" font-size="15" class="t2">' + k[1] + '</text>'; });
    s += '<text x="' + X(0.22) + '" y="92" text-anchor="middle" font-size="15" class="t2">unlikely</text><text x="' + X(0.78) + '" y="92" text-anchor="middle" font-size="15" class="t2">likely</text>';
    if (p !== null && p !== undefined) s += '<circle cx="' + X(p) + '" cy="40" r="10" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + Math.min(Math.max(X(p), 50), 490) + '" y="18" text-anchor="middle" font-size="17" class="tb">' + (lab || '') + '</text>';
    return A.svg(W, 100, s, 'Probability line from 0 to 1' + (p !== null && p !== undefined ? ' with a point at ' + cl(p) : ''));
  }
  /* grid of outcomes for two independent events */
  function ogrid(a, b, hl, la, lb) {
    var cw = 54, ch = 34, s = '', W = 90 + b.length * cw, H = 40 + a.length * ch;
    b.forEach(function (y, j) { s += '<text x="' + (90 + j * cw + cw / 2) + '" y="26" text-anchor="middle" font-size="16" class="tb">' + y + '</text>'; });
    a.forEach(function (x, i) {
      s += '<text x="80" y="' + (40 + i * ch + 23) + '" text-anchor="end" font-size="16" class="tb">' + x + '</text>';
      b.forEach(function (y, j) {
        var on = hl && hl(x, y);
        s += '<rect x="' + (90 + j * cw) + '" y="' + (40 + i * ch) + '" width="' + cw + '" height="' + ch + '" style="fill:' + (on ? 'color-mix(in srgb,var(--strand) 60%,var(--card))' : 'var(--card)') + ';stroke:var(--line)"/><text x="' + (90 + j * cw + cw / 2) + '" y="' + (40 + i * ch + 23) + '" text-anchor="middle" font-size="14"' + (on ? ' font-weight="700"' : ' class="t2"') + '>' + x.charAt(0) + y + '</text>';
      });
    });
    s += '<text x="' + (90 + b.length * cw / 2) + '" y="10" text-anchor="middle" font-size="14" class="t2">' + lb + '</text><text x="4" y="30" font-size="14" class="t2">' + la + '</text>';
    return A.svg(W, H, s, 'Outcome grid: ' + a.length + ' rows by ' + b.length + ' columns gives ' + a.length * b.length + ' equally likely outcomes');
  }
  var HEIGHTS = [138, 141, 143, 145, 146, 147, 148, 149, 150, 150, 151, 152, 152, 153, 154, 155, 155, 156, 157, 158, 159, 160, 161, 163, 166];

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var CH = 'data-probability', g = G6.g, lab = G6.lab, play = G6.play;
  /* shared by the plain questions and the practice shapes below */
  var DATA_KINDS = [['the number of siblings each student has', 'discrete'], ['the number of cars in a parking lot', 'discrete'], ['how many goals each player scored', 'discrete'], ['the number of texts sent in a day', 'discrete'],
    ['the height of each tree in a park', 'continuous'], ['the time each runner takes', 'continuous'], ['the temperature at noon each day', 'continuous'], ['the mass of each apple', 'continuous'], ['how much rain fell each day', 'continuous'],
    ['each student’s favourite season', 'qualitative'], ['the colour of each car', 'qualitative'], ['the type of pet each family has', 'qualitative']];
  var GRAPH_FITS = [['the temperature every hour for a day', 'broken-line graph'], ['the height of a plant each week', 'broken-line graph'], ['the heights of 50 students', 'histogram'], ['the times of 40 runners in a race', 'histogram'], ['the favourite sport of each student', 'bar graph'], ['the number of each colour of car in a lot', 'bar graph']];
  var B5 = bin(HEIGHTS, 135, 5, 7);
  function part(k) { return B5.map(function (c, i) { return i < k ? c : 0; }); }
  var TEMPS = bline(['8 am', '10 am', '12 pm', '2 pm', '4 pm', '6 pm'], [12, 15, 19, 22, 20, 16], 0, 25, 5, 'Temperature on a spring day', '°C');
  var LESSONS = [
    { id: 'data', title: 'Kinds of data', sub: 'counted, measured or words', concepts: [
      { id: 'kinds', title: 'Counted or measured?', exp: ['D1.1'], skill: 'dp-type',
        body: '<p><b>Qualitative</b> data are words, like favourite sport. <b>Quantitative</b> data are numbers. If you <b>count</b> it, it is <b>discrete</b>. If you <b>measure</b> it, it is <b>continuous</b>.</p>',
        watch: play([
          ['Favourite sport: words, so qualitative.', '<p class="g6-big">soccer, hockey, swimming</p>', 'Qualitative'],
          ['Number of pets: you count them. You cannot have 2.5 pets.', '<p class="g6-big">0, 1, 2, 3</p>', 'Discrete'],
          ['Height: you measure it. It can be 152.4 cm.', '<p class="g6-big">152.4 cm</p>', 'Continuous']
        ]),
        example: G6.example([
          ['My turn. Eye colour: blue, brown, green. The data are words, so it is qualitative.', '<p class="g6-big">blue, brown, green</p>', 'Qualitative'],
          ['Books read this month: I count them. Counted data are whole numbers.', '<p class="g6-big">0, 2, 3, 5</p>', 'Discrete'],
          ['Time to run 100 m: I measure it. It can be 15.42 seconds.', '<p class="g6-big">15.42 s</p>', 'Continuous'],
          ['I check with the rule: count it, discrete. Measure it, continuous. Words, qualitative.', '<p class="g6-big">words &middot; counted &middot; measured</p>']
        ]),
        key: '<p>Count it: discrete. Measure it: continuous. Words: qualitative.</p>',
        check: [{ q: 'The time it takes each student to walk to school is&hellip;', type: 'mc', options: ['qualitative', 'discrete', 'continuous'], answer: 2, hint: 'Counted or measured?', explain: 'Time is measured, so it is continuous.' }, g(CH, 'dp-type', 1), g(CH, 'dp-type', 2)] },
      { id: 'sample', title: 'Samples and intervals', exp: ['D1.2'], skill: 'dp-hist',
        body: '<p>The <b>population</b> is the whole group you ask about. A <b>sample</b> is a smaller part of it. Data with many different values are grouped into <b>intervals</b>, like 140 to 145 cm.</p>',
        watch: play([
          ['Question: how tall are Grade 6 students in our school? That group is the population.', '<p class="g6-big">All Grade 6 students</p>', 'Population'],
          ['We measure 25 of them: a sample.', '<p class="t2">' + HEIGHTS.join(', ') + '</p>', 'Sample of 25'],
          ['Group them in intervals of 5 cm. 145 goes in "145 to 150", where it starts.', '<div class="tbl"><table><thead><tr><th>Interval (cm)</th><th>Count</th></tr></thead><tbody>' + B5.map(function (c, i) { return '<tr><td>' + (135 + 5 * i) + ' to ' + (140 + 5 * i) + '</td><td>' + c + '</td></tr>'; }).join('') + '</tbody></table></div>']
        ]),
        example: G6.example([
          ['My turn. Question: how long do the 90 Grade 6 students at my school sleep? All 90 are the population.', '<p class="g6-big">All 90 students</p>', 'Population'],
          ['I ask 20 of them. Those 20 are the sample.', '<p class="g6-big">20 students asked</p>', 'Sample'],
          ['I group the answers in intervals of 1 hour: 8 to 9, 9 to 10, 10 to 11.', '<div class="tbl"><table><thead><tr><th>Interval (h)</th><th>Count</th></tr></thead><tbody><tr><td>8 to 9</td><td>6</td></tr><tr><td>9 to 10</td><td>10</td></tr><tr><td>10 to 11</td><td>4</td></tr></tbody></table></div>'],
          ['Where does exactly 9 hours go? Each interval includes its start, so 9 goes in "9 to 10".', '<p class="g6-big">9 h &rarr; 9 to 10</p>']
        ]),
        key: '<p>Each interval includes its start number but not its end number.</p>',
        mistake: '<p>Putting a value that sits on a boundary in two intervals, or in the lower one. 145 cm belongs in 145 to 150.</p>',
        check: [{ q: 'A survey asks 40 students from a school of 600. What is the sample?', type: 'mc', options: ['the 600 students', 'the 40 students asked', 'the questions'], answer: 1, hint: 'The sample is the smaller group you actually ask.', explain: 'The 40 students asked are the sample. All 600 are the population.' },
          { q: 'Intervals are 140 to 145, 145 to 150, and so on. Which interval holds 150?', type: 'mc', options: ['145 to 150', '150 to 155', 'both'], answer: 1, hint: 'An interval starts at its first number.', explain: '150 is the start of 150 to 155.' }] }
    ] },
    { id: 'graphs', title: 'Graphs', sub: 'pick the right one, read it carefully', concepts: [
      { id: 'hist', title: 'Histograms', exp: ['D1.3'], skill: 'dp-hist',
        body: '<p>A <b>histogram</b> shows how many values fall in each interval. The bars <b>touch</b>, because the number line underneath has no gaps.</p>',
        watch: play([
          ['Start with the first interval: 135 to 140 cm.', hist(part(1), 135, 5, 'Heights of 25 students', 'height (cm)')],
          ['Add the next intervals.', hist(part(3), 135, 5, 'Heights of 25 students', 'height (cm)')],
          ['All 7 intervals. Most students are 150 to 155 cm.', hist(B5, 135, 5, 'Heights of 25 students', 'height (cm)'), 'Tallest bar: 7 students']
        ]),
        try: lab(CH, 0, 'Pick an interval width that makes exactly <b>4</b> bars.', function (h) { return h.querySelector('#hw').value === '10'; }, 'Yes: width 10 gives 4 intervals. Fewer bars, less detail.'),
        example: G6.example([
          ['My turn. I draw a histogram of minutes spent reading. The first interval is 0 to 10: 2 students.', hist([2, 0, 0, 0, 0], 0, 10, 'Minutes spent reading', 'minutes')],
          ['I add the next intervals: 10 to 20 has 5, and 20 to 30 has 8.', hist([2, 5, 8, 0, 0], 0, 10, 'Minutes spent reading', 'minutes')],
          ['I add the last two: 4 and 1. The bars touch, because the intervals meet.', hist([2, 5, 8, 4, 1], 0, 10, 'Minutes spent reading', 'minutes')],
          ['I read the tallest bar on the left scale: 8 students read 20 to 30 minutes.', hist([2, 5, 8, 4, 1], 0, 10, 'Minutes spent reading', 'minutes'), 'Tallest bar: 8 students']
        ]),
        key: '<p>Read the bar height on the left scale. Bars touch.</p>',
        check: [{ q: 'In the 5 cm histogram, how many students are at least 150 cm but less than 155 cm?', type: 'num', answer: 7, fig: hist(B5, 135, 5, 'Heights of 25 students', 'height (cm)'), hint: 'Find the bar that starts at 150.', explain: 'That bar has height 7.' }, g(CH, 'dp-hist', 1), g(CH, 'dp-hist', 2)] },
      { id: 'choose', title: 'Choosing a graph', exp: ['D1.3', 'D1.4'], skill: 'dp-graph',
        body: '<p>Change over time: <b>broken-line graph</b>. Many numbers in intervals: <b>histogram</b>. Categories: <b>bar graph</b>. Parts of a whole: <b>circle graph</b>. Every graph needs a title, axis labels and a source.</p>',
        watch: play([
          ['Temperature through a day changes over time.', TEMPS],
          ['Join the points with straight lines: a broken-line graph.', TEMPS, 'Warmest at 2 pm: 22 °C']
        ]),
        ways: [{ label: 'Pick by question', html: '<div class="tbl"><table><thead><tr><th class="l">Your data</th><th class="l">Graph</th></tr></thead><tbody><tr><td class="l">Favourite fruit</td><td class="l">bar graph</td></tr><tr><td class="l">Heights of 25 students</td><td class="l">histogram</td></tr><tr><td class="l">Temperature each hour</td><td class="l">broken-line graph</td></tr><tr><td class="l">How you spend a day</td><td class="l">circle graph</td></tr></tbody></table></div>' },
          { label: 'Infographics', html: '<p>An <b>infographic</b> tells one story about a data set. It mixes a title, a few big numbers, one or two graphs and short sentences. Example: "Our class sleep": the mean hours of sleep in big type, a histogram of sleep times, and one tip.</p>' }],
        example: G6.example([
          ['My turn. A plant&rsquo;s height each week changes over time. I pick a broken-line graph.', bline(['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'], [2, 4, 7, 9, 12], 0, 15, 5, 'Plant height', 'cm'), 'Change over time'],
          ['The heights of 25 students are many measured numbers. I group them and pick a histogram.', hist(B5, 135, 5, 'Heights of 25 students', 'height (cm)'), 'Measured, in intervals'],
          ['Each student&rsquo;s favourite season is words. I pick a bar graph.', '<p class="g6-big">winter, spring, summer, fall</p>', 'Categories'],
          ['I check every graph has a title, labels and where the data came from.', '<p class="g6-big">title &middot; labels &middot; source</p>']
        ]),
        key: '<p>Ask what the data are, then pick the graph. Title, labels, source.</p>',
        check: [{ q: 'Which graph is best for showing park visitors each month for a year?', type: 'mc', options: ['histogram', 'broken-line graph', 'circle graph'], answer: 1, hint: 'Months are time.', explain: 'Change over time: broken-line graph.' }, g(CH, 'dp-graph', 1), g(CH, 'dp-graph', 2)] },
      { id: 'mislead', title: 'Misleading graphs', exp: ['D1.6'], skill: 'dp-graph', hard: true,
        body: '<p>Always read the <b>scale</b>. If the vertical axis does not start at 0, a small change can look huge.</p>',
        watch: play([
          ['The hydro bill went from $92 to $101. This graph makes it look like it shot up.', bline(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], [92, 94, 95, 97, 98, 101], 80, 110, 5, 'Monthly hydro bill', 'dollars'), 'Axis starts at 80'],
          ['Start the axis at 0 and the change looks as small as it really is.', bline(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], [92, 94, 95, 97, 98, 101], 0, 110, 10, 'Monthly hydro bill', 'dollars'), 'Axis starts at 0']
        ]),
        try: lab(CH, 1, 'Make the graph honest.', function (h) { return h.querySelector('#mz').value === '0'; }, 'Yes: starting at 0 shows the true size of the change.'),
        ways: [{ label: 'Do the math', html: '<p>$92 to $101 is a rise of $9. $9 out of $92 is about 10%. A small rise, whatever the picture looks like.</p>' }],
        example: G6.example([
          ['My turn. Bike sales went from 40 to 44 in a week. This graph makes it look huge.', bline(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], [40, 41, 42, 42, 43, 44], 38, 45, 1, 'Bikes sold each day', 'bikes'), 'Axis starts at 38'],
          ['I check where the axis starts: at 38, not 0. That stretches a small change.', bline(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], [40, 41, 42, 42, 43, 44], 38, 45, 1, 'Bikes sold each day', 'bikes'), 'Look at the scale'],
          ['I redraw it from 0. The change looks as small as it really is: 4 more bikes.', bline(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], [40, 41, 42, 42, 43, 44], 0, 50, 10, 'Bikes sold each day', 'bikes'), 'Axis starts at 0']
        ]),
        key: '<p>Check where the axis starts. Look for the zigzag break.</p>',
        check: [{ q: 'Why might a graph be misleading?', type: 'mc', options: ['It has a title', 'The vertical axis does not start at 0', 'It uses a broken line', 'It shows 6 months'], answer: 1, hint: 'Look at the scale.', explain: 'A vertical axis that does not start at 0 makes small changes look big.' }, g(CH, 'dp-graph', 3)] }
    ] },
    { id: 'centre', title: 'Mean, median, mode, range', sub: 'one number to sum up the data', concepts: [
      { id: 'mean', title: 'The mean', exp: ['D1.5'], skill: 'dp-mmm',
        body: '<p>The <b>mean</b> is the fair share: add all the values, then divide by how many there are. On a dot plot it is the balance point.</p>',
        watch: play([
          ['Data: 3, 5, 5, 7, 10.', dotplot([3, 5, 5, 7, 10], 0, 12)],
          ['Add them: 3 + 5 + 5 + 7 + 10 = 30.', dotplot([3, 5, 5, 7, 10], 0, 12), 'Total 30'],
          ['There are 5 values. 30 &divide; 5 = 6. The triangle balances the data at 6.', dotplot([3, 5, 5, 7, 10], 0, 12), 'Mean = 6']
        ]),
        try: lab(CH, 2, 'Type <b>4 or more</b> values with a mean of exactly <b>10</b>.', function (h) { var d = h.querySelector('#mdd').value.split(/[,\s]+/).map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x) && x >= 0 && x <= 30; }); return d.length >= 4 && d.reduce(function (a, b) { return a + b; }, 0) === 10 * d.length; }, 'Yes: the total is 10 times the number of values.'),
        example: G6.example([
          ['My turn. I find the mean of 4, 6, 9, 9, 12.', dotplot([4, 6, 9, 9, 12], 0, 14)],
          ['I add them: 4 + 6 + 9 + 9 + 12 = 40.', dotplot([4, 6, 9, 9, 12], 0, 14), 'Total 40'],
          ['There are 5 values. Mean = total &divide; how many: 40 &divide; 5 = 8.', dotplot([4, 6, 9, 9, 12], 0, 14), 'Mean = 8']
        ]),
        key: '<p>Mean = total &divide; how many.</p>',
        check: [{ q: 'What is the mean of 12, 15, 9, 20, 14?', type: 'num', answer: 14, hint: 'Add them, then divide by 5.', explain: '70 &divide; 5 = 14.' }, g(CH, 'dp-mmm', 1), g(CH, 'dp-mmm', 2)] },
      { id: 'median', title: 'Median, mode and range', exp: ['D1.5'], skill: 'dp-mmm', hard: true,
        body: '<p><b>Median</b>: the middle value when the data are in order. <b>Mode</b>: the most common value. <b>Range</b>: greatest minus least, which shows the spread.</p>',
        watch: play([
          ['8, 3, 12, 5, 9, 6. First put them in order.', '<p class="g6-big">3, 5, 6, 8, 9, 12</p>'],
          ['6 values, so there are two in the middle: 6 and 8.', '<p class="g6-big">3, 5, <b>6, 8</b>, 9, 12</p>'],
          ['Median: halfway between them, 7.', dotplot([3, 5, 6, 8, 9, 12], 0, 14), 'Median = 7'],
          ['Range: 12 &minus; 3 = 9. No value repeats, so there is no mode.', dotplot([3, 5, 6, 8, 9, 12], 0, 14), 'Range = 9']
        ]),
        ways: [{ label: 'Cross off the ends', html: '<p>Write the data in order. Cross off one from each end, again and again. What is left in the middle is the median (or the two to average).</p>' },
          { label: 'One huge value', html: '<p>4, 5, 5, 6, 30: the mean is 10 but the median is 5. One very big value pulls the mean, not the median.</p>' }],
        example: G6.example([
          ['My turn. Data: 7, 2, 10, 4, 4. First I put them in order.', '<p class="g6-big">2, 4, 4, 7, 10</p>'],
          ['5 values, so the middle one is the 3rd: 4. The median is 4.', '<p class="g6-big">2, 4, <b>4</b>, 7, 10</p>', 'Median = 4'],
          ['4 appears most often, so the mode is 4.', dotplot([2, 4, 4, 7, 10], 0, 12), 'Mode = 4'],
          ['Range: biggest minus smallest, 10 &minus; 2 = 8.', dotplot([2, 4, 4, 7, 10], 0, 12), 'Range = 8']
        ]),
        key: '<p>Median: order first. Mode: most often. Range: biggest minus smallest.</p>',
        mistake: '<p>Finding the median without putting the data in order first.</p>',
        check: [{ q: 'What is the median of 8, 3, 12, 5, 9, 6?', type: 'num', answer: 7, hint: 'Order them. Average the middle two.', explain: '(6 + 8) &divide; 2 = 7.' }, { q: 'What is the range of 34, 28, 41, 30, 37?', type: 'num', answer: 13, hint: 'Greatest minus least.', explain: '41 &minus; 28 = 13.' }, g(CH, 'dp-mmm', 3)] },
      { id: 'compare', title: 'Comparing two data sets', exp: ['D1.5', 'D1.6'], skill: 'dp-mmm',
        body: '<p>Use a measure of centre (mean or median) to see which set is higher, and the range to see which is more <b>consistent</b>.</p>',
        watch: play([
          ['Team A scored 2, 3, 3, 4, 8. Team B scored 3, 3, 4, 4, 6.', '<div class="vrow"><figure><figcaption>Team A</figcaption>' + dotplot([2, 3, 3, 4, 8], 0, 10) + '</figure><figure><figcaption>Team B</figcaption>' + dotplot([3, 3, 4, 4, 6], 0, 10) + '</figure></div>'],
          ['Both means are 4.', '<p class="g6-big">20 &divide; 5 = 4</p>', 'Same mean'],
          ['Range: A is 6, B is 3. Team B is more consistent.', '<p class="g6-big">A: 8 &minus; 2 = 6<br>B: 6 &minus; 3 = 3</p>', 'Smaller range = more consistent']
        ]),
        example: G6.example([
          ['My turn. Mia scored 6, 7, 7, 8, 7 on quizzes. Leo scored 4, 9, 10, 5, 7.', '<div class="vrow"><figure><figcaption>Mia</figcaption>' + dotplot([6, 7, 7, 8, 7], 0, 10) + '</figure><figure><figcaption>Leo</figcaption>' + dotplot([4, 9, 10, 5, 7], 0, 10) + '</figure></div>'],
          ['I find each mean: 35 &divide; 5 = 7 for both. The centre is the same.', '<p class="g6-big">35 &divide; 5 = 7</p>', 'Same mean'],
          ['I find each range: Mia 8 &minus; 6 = 2. Leo 10 &minus; 4 = 6.', '<p class="g6-big">Mia: 2 &nbsp; Leo: 6</p>'],
          ['Same centre, but Mia&rsquo;s range is smaller. Mia is more consistent.', '<p class="g6-big">smaller range = more consistent</p>']
        ]),
        key: '<p>Centre tells you how high. Range tells you how spread out.</p>',
        check: [{ q: 'Runner P: 12, 13, 12, 13 s. Runner Q: 9, 16, 11, 14 s. Both means are 12.5 s. Who is more consistent?', type: 'mc', options: ['Runner P', 'Runner Q', 'They are the same'], answer: 0, hint: 'Find each range.', explain: 'P has range 1, Q has range 7. P is more consistent.' }, g(CH, 'dp-mmm', 2)] }
    ] },
    { id: 'probability', title: 'Probability', sub: 'from impossible to certain', concepts: [
      { id: 'pline', title: 'The probability line', exp: ['D2.1'], skill: 'dp-prob',
        body: '<p>Probability runs from 0 (impossible) to 1 (certain). With equally likely outcomes: probability = favourable outcomes &divide; all outcomes. Write it as a fraction, decimal or percent.</p>',
        watch: play([
          ['Roll a 7 on a die: impossible.', pline(0, '7'), '0'],
          ['Roll a 5: 1 of 6 outcomes.', pline(1 / 6, 'roll a 5'), A.fr(1, 6) + ' &#8776; 0.17 &#8776; 17%'],
          ['Roll an even number: 3 of 6.', pline(0.5, 'even'), A.fr(1, 2) + ' = 0.5 = 50%'],
          ['Roll less than 7: certain.', pline(1, 'less than 7'), '1']
        ]),
        example: G6.example([
          ['My turn. A spinner has 4 equal parts: 3 blue and 1 red. I place each chance on the line.', '<p class="g6-big">3 blue &middot; 1 red</p>'],
          ['Blue: 3 of 4 parts. Favourable &divide; all = 3/4 = 0.75.', pline(0.75, 'blue'), A.fr(3, 4) + ' = 0.75 = 75%'],
          ['Red: 1 of 4 parts = 1/4 = 0.25.', pline(0.25, 'red'), A.fr(1, 4) + ' = 0.25 = 25%'],
          ['Green: no green parts, so 0. It is impossible.', pline(0, 'green'), '0']
        ]),
        key: '<p>Favourable &divide; all. 0 is impossible, 1 is certain.</p>',
        check: [{ q: 'A bag has 3 red, 5 blue and 2 green marbles. What is the probability of picking blue, as a percent?', type: 'num', unit: '%', answer: 50, hint: 'Blue &divide; all marbles.', explain: '5 of 10 = 50%.' }, g(CH, 'dp-prob', 1), g(CH, 'dp-prob', 2)] },
      { id: 'two', title: 'Two events at once', exp: ['D2.2'], skill: 'dp-two',
        body: '<p>Two events are <b>independent</b> when one does not change the other, like a coin and a die. List every outcome in a grid.</p>',
        watch: play([
          ['A coin has 2 outcomes. A die has 6.', ogrid(['H', 'T'], [1, 2, 3, 4, 5, 6], null, 'coin', 'die')],
          ['The grid has 2 &times; 6 = 12 outcomes, all equally likely.', ogrid(['H', 'T'], [1, 2, 3, 4, 5, 6], null, 'coin', 'die'), '12 outcomes'],
          ['Heads and a 6: just 1 square.', ogrid(['H', 'T'], [1, 2, 3, 4, 5, 6], function (x, y) { return x === 'H' && y === 6; }, 'coin', 'die'), A.fr(1, 12)],
          ['Heads and an even number: 3 squares.', ogrid(['H', 'T'], [1, 2, 3, 4, 5, 6], function (x, y) { return x === 'H' && y % 2 === 0; }, 'coin', 'die'), A.fr(3, 12) + ' = ' + A.fr(1, 4)]
        ]),
        example: G6.example([
          ['My turn. I flip a coin and spin red, blue or green. The coin has 2 outcomes; the spinner has 3.', ogrid(['H', 'T'], ['R', 'B', 'G'], null, 'coin', 'spinner')],
          ['Outcomes = 2 &times; 3 = 6, all equally likely.', ogrid(['H', 'T'], ['R', 'B', 'G'], null, 'coin', 'spinner'), '6 outcomes'],
          ['Tails and blue: I count 1 square.', ogrid(['H', 'T'], ['R', 'B', 'G'], function (x, y) { return x === 'T' && y === 'B'; }, 'coin', 'spinner'), A.fr(1, 6)],
          ['Heads and not green: I count 2 squares.', ogrid(['H', 'T'], ['R', 'B', 'G'], function (x, y) { return x === 'H' && y !== 'G'; }, 'coin', 'spinner'), A.fr(2, 6) + ' = ' + A.fr(1, 3)]
        ]),
        key: '<p>Outcomes = first count &times; second count. Then count the ones you want.</p>',
        check: [{ q: 'You spin a 4-part spinner (red, blue, green, yellow) and flip a coin. What is the probability of red and tails?', type: 'mc', options: ['1/4', '1/8', '1/6', '1/2'], answer: 1, hint: '4 &times; 2 outcomes.', explain: '1 of 8.' }, g(CH, 'dp-two', 1), g(CH, 'dp-two', 2)] },
      { id: 'experiment', title: 'Theory and experiment', exp: ['D2.2'], skill: 'dp-two', hard: true,
        body: '<p><b>Theoretical</b> probability is what should happen. <b>Experimental</b> probability is what does happen when you try it. With more tries, they usually get closer.</p>',
        try: lab(CH, 3, 'Run the experiment at least <b>100</b> times. Watch the green dot move toward the orange one.', function (h) { return /of \d[\d\s]{2,} tries/.test(h.querySelector('#prout').textContent); }, 'See how close they are now? More tries, closer results.'),
        ways: [{ label: 'Why small samples wobble', html: '<p>Flip a coin 4 times and you might get 3 heads (75%). Flip it 1000 times and you will get close to 50%. A few tries can be far from the theory.</p>' }],
        example: G6.example([
          ['My turn. In theory, a die lands on 5 one time in 6: about 17%.', pline(1 / 6, 'theory'), A.fr(1, 6) + ' &#8776; 17%'],
          ['I roll it 30 times and get 8 fives. That is 8/30, about 27%. Far from the theory.', pline(8 / 30, '30 rolls'), A.fr(8, 30) + ' &#8776; 27%'],
          ['I roll 600 times and get 104 fives: 104/600, about 17%.', pline(104 / 600, '600 rolls'), '&#8776; 17%'],
          ['Small experiments wobble. Many tries settle near the theory.', '<p class="g6-big">more tries &rarr; closer to ' + A.fr(1, 6) + '</p>']
        ]),
        key: '<p>Experiments wobble. Many tries settle near the theory.</p>',
        mistake: '<p>Thinking a result is "due": after 5 heads in a row, believing tails is more likely. The next flip is still ' + A.fr(1, 2) + '.</p>',
        check: [{ q: 'You flip a coin 10 times and get 7 heads. What is the experimental probability of heads?', type: 'mc', options: ['1/2', '7/10', '3/10', '7/3'], answer: 1, hint: 'What happened &divide; tries.', explain: '7 heads in 10 tries: 7/10.' }, { q: 'After 5 heads in a row, what is the probability the next flip is heads?', type: 'mc', options: ['less than 1/2', '1/2', 'more than 1/2'], answer: 1, hint: 'Does the coin remember?', explain: 'Each flip is independent: still 1/2.' }, g(CH, 'dp-two', 2)] }
    ] }
  ];
  A.register('data-probability', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Kinds of data</h2>' +
'<p><b>Qualitative</b> data are words or categories: favourite sport, eye colour. <b>Quantitative</b> data are numbers. Quantitative data come in two kinds:</p>' +
'<div class="tbl"><table><thead><tr><th class="l"></th><th class="l">Discrete</th><th class="l">Continuous</th></tr></thead><tbody>' +
'<tr><td class="l">What it is</td><td class="l">counted, only certain values</td><td class="l">measured, any value in a range</td></tr>' +
'<tr><td class="l">Examples</td><td class="l">number of pets, goals in a game, people on a bus</td><td class="l">height, time to run 100 m, temperature, mass</td></tr>' +
'<tr><td class="l">Ask yourself</td><td class="l">Can there be 2.5 of them? <b>No</b>.</td><td class="l">Can it be 2.5, or 2.57? <b>Yes</b>.</td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>If you <b>count</b> it, it is discrete. If you <b>measure</b> it, it is continuous.</p></div>' +
'<p>To answer a question about a <b>population</b> (a whole group), you often collect data from a smaller <b>sample</b> of it. Continuous data and wide-ranging data are usually grouped into <b>intervals</b> like 140 to 145 cm.</p>' +
A.yt({ q: 'The time it takes each student to walk to school is&hellip;', type: 'mc', options: ['qualitative', 'discrete', 'continuous'], answer: 2,
  hint: 'Say the rule: counted or measured? Time is measured with a clock.', explain: 'Time is measured and can be any value, like 12.5 minutes, so it is continuous.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Histograms</h2>' +
'<p>A <b>histogram</b> shows how many values fall in each interval. It looks like a bar graph, but the bars <b>touch</b>, because the number line underneath has no gaps. Use it for continuous data or data with many values.</p>' +
'<div class="lab"><span class="lt">Try it: choose the interval width</span>' +
'<p class="t2" style="margin:.3em 0">Heights of 25 Grade 6 students, in cm: ' + HEIGHTS.join(', ') + '</p>' +
'<div class="ctrl"><label for="hw">Interval width<select id="hw"><option>2</option><option selected>5</option><option>10</option><option>15</option></select></label></div>' +
'<div class="fig" id="hfig"></div><div class="out" id="hout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Putting a value in two intervals. A height of exactly 145 cm goes in the 145 to 150 interval, not 140 to 145. Each interval includes its start number but not its end number.</p></div>' +
A.yt({ q: 'In the histogram with width 5, how many students are at least 150 cm but less than 155 cm?', type: 'num', answer: 7,
  hint: 'Find the bar that starts at 150. Read its height on the left scale.', explain: 'The bar from 150 to 155 has height 7: the values 150, 150, 151, 152, 152, 153 and 154.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Broken-line graphs and choosing a graph</h2>' +
'<p>A <b>broken-line graph</b> shows how something changes over time, like temperature through a day. Points are joined with straight lines.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Your data</th><th class="l">Good choice</th></tr></thead><tbody>' +
'<tr><td class="l">Categories (favourite fruit)</td><td class="l">bar graph or pictograph</td></tr><tr><td class="l">Many numbers grouped in intervals (heights)</td><td class="l">histogram</td></tr>' +
'<tr><td class="l">Change over time (temperature each hour)</td><td class="l">broken-line graph</td></tr><tr><td class="l">Parts of a whole (how you spend a day)</td><td class="l">circle graph</td></tr></tbody></table></div>' +
'<p>Every graph needs a <b>title</b>, <b>labels</b> on both axes, and the <b>source</b> of the data. An <b>infographic</b> combines several graphs, numbers and short text to tell one story about a data set.</p>' +
'<div class="lab"><span class="lt">Try it: spot a misleading graph</span>' +
'<p class="t2" style="margin:.3em 0">Average monthly hydro bill for a family, in dollars (made-up data).</p>' +
'<div class="ctrl"><label for="mz">Vertical axis starts at<select id="mz"><option value="0">0 (honest)</option><option value="80" selected>80 (zoomed in)</option></select></label></div>' +
'<div class="fig" id="mfig"></div><div class="out" id="mout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Before you trust a graph, read the scale. A vertical axis that does not start at zero can make a small change look huge.</p></div>' +
A.yt({ q: 'Which graph is best for showing the number of visitors to a park each month for a year?', type: 'mc', options: ['histogram', 'broken-line graph', 'circle graph'], answer: 1,
  hint: 'Say the rule: change over time uses a broken-line graph.', explain: 'Months are time, so a broken-line graph shows how visits change.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Mean, median, mode and range</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Measure</th><th class="l">How to find it</th><th class="l">For 3, 5, 5, 7, 10</th></tr></thead><tbody>' +
'<tr><td class="l"><b>Mean</b></td><td class="l">add all values, divide by how many</td><td class="l">30 &divide; 5 = 6</td></tr>' +
'<tr><td class="l"><b>Median</b></td><td class="l">middle value when in order (average of the two middle ones if there is an even number)</td><td class="l">5</td></tr>' +
'<tr><td class="l"><b>Mode</b></td><td class="l">most common value (there can be none, or more than one)</td><td class="l">5</td></tr>' +
'<tr><td class="l"><b>Range</b></td><td class="l">greatest &minus; least: shows the spread</td><td class="l">10 &minus; 3 = 7</td></tr></tbody></table></div>' +
'<p>The mean is the <b>balance point</b> of the data. The median splits the data into two halves.</p>' +
'<div class="lab"><span class="lt">Try it: change the data</span>' +
'<div class="ctrl"><label for="mdd">Values (whole numbers 0 to 30, with commas)<input type="text" id="mdd" value="4, 7, 7, 9, 12, 15" style="width:16em"></label></div>' +
'<div class="fig" id="mdfig"></div><div class="out" id="mdout"></div></div>' +
'<div class="eg"><b class="t">Worked example: compare two data sets</b><p>Team A scored 2, 3, 3, 4, 8 goals. Team B scored 3, 3, 4, 4, 6. Both means are 4. Team A has a range of 6, team B a range of 3. Team B is more <b>consistent</b>.</p></div>' +
A.yt({ q: 'What is the median of 8, 3, 12, 5, 9, 6?', type: 'num', answer: 7,
  hint: 'Say the steps: put them in order first. With 6 values, average the two in the middle.', explain: 'In order: 3, 5, 6, 8, 9, 12. The middle two are 6 and 8. (6 + 8) &divide; 2 = 7.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Probability</h2>' +
'<p>Probability is how likely something is, from 0 (impossible) to 1 (certain). With equally likely outcomes:</p>' +
'<p class="math" style="font-size:1.1rem;white-space:normal">probability = (number of favourable outcomes) &divide; (number of possible outcomes)</p>' +
'<p>Rolling a 5 on a six-sided die: ' + A.fr(1, 6) + ', about 0.17 or 17%.</p><div class="fig">' + pline(1 / 6, 'roll a 5') + '</div>' +
'<p>Two events are <b>independent</b> when one does not change the other, like flipping a coin and rolling a die. List all the outcomes in a grid. A coin and a die give 2 &times; 6 = 12 outcomes. Getting heads <b>and</b> a 6 is 1 of 12: ' + A.fr(1, 12) + '.</p>' +
'<div class="fig">' + ogrid(['H', 'T'], [1, 2, 3, 4, 5, 6], function (x, y) { return x === 'H' && y === 6; }, 'coin', 'die') + '</div>' +
'<p><b>Theoretical probability</b> is what should happen. <b>Experimental probability</b> is what does happen when you try it. With more trials, they usually get closer.</p>' +
'<div class="lab"><span class="lt">Try it: flip a coin and roll a die</span>' +
'<div class="ctrl"><label for="prt">Target<select id="prt"><option value="H6">heads and a 6</option><option value="He">heads and an even number</option><option value="T12">tails and a 1 or 2</option></select></label></div>' +
'<div class="btnrow"><button type="button" class="btn" data-n="10">Do it 10 times</button><button type="button" class="btn" data-n="100">100 times</button><button type="button" class="btn" data-n="1000">1000 times</button><button type="button" class="btn alt" id="prr">Reset</button></div>' +
'<div class="fig" id="prfig"></div><div class="out" id="prout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a result is "due". If you flip 5 heads in a row, the next flip is still ' + A.fr(1, 2) + ' heads. The coin does not remember.</p></div>' +
A.yt({ q: 'A spinner has 4 equal parts: red, blue, green, yellow. You spin it and flip a coin. What is the probability of red and tails?', type: 'mc', options: ['1/4', '1/8', '1/6', '1/2'], answer: 1,
  hint: 'Say the steps: count all outcomes in a grid, 4 &times; 2. How many are red and tails?', explain: '4 &times; 2 = 8 outcomes, and only 1 is red-tails. ' + A.fr(1, 8) + '.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function hs() {
        var w = +$('#hw', root).value, lo = Math.floor(136 / w) * w, n = Math.ceil((168 - lo) / w), b = bin(HEIGHTS, lo, w, n);
        $('#hfig', root).innerHTML = hist(b, lo, w, 'Heights of 25 students', 'height (cm)');
        var big = b.indexOf(Math.max.apply(null, b));
        $('#hout', root).innerHTML = '<p>' + n + ' intervals of ' + w + ' cm. The tallest bar is ' + (lo + big * w) + ' to ' + (lo + (big + 1) * w) + ' cm, with ' + b[big] + ' students.</p><p class="t2">' + (w <= 2 ? 'Very narrow intervals: lots of short bars and the shape is hard to see.' : w >= 15 ? 'Very wide intervals: only a few bars, so detail is lost.' : 'A good width: the shape of the data is easy to see.') + '</p>';
      }
      A.bind(root, ['hw'], hs);
      function mz() {
        var z = +$('#mz', root).value, ys = [92, 94, 95, 97, 98, 101];
        $('#mfig', root).innerHTML = bline(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], ys, z, 110, z ? 5 : 10, 'Monthly hydro bill', 'dollars');
        $('#mout', root).innerHTML = z ? '<p>The line looks like it shoots up. But the axis starts at $80 (see the zigzag). The bill only went from $92 to $101.</p>' : '<p>With the axis starting at 0, you can see the change is small: $92 to $101, about 10%.</p>';
      }
      A.bind(root, ['mz'], mz);
      function md() {
        var d = $('#mdd', root).value.split(/[,\s]+/).map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x) && x >= 0 && x <= 30; }).slice(0, 20);
        if (!d.length) { $('#mdfig', root).innerHTML = ''; $('#mdout', root).innerHTML = '<p>Type some whole numbers from 0 to 30, separated by commas.</p>'; return; }
        var s = stats(d);
        $('#mdfig', root).innerHTML = dotplot(d, 0, 30);
        $('#mdout', root).innerHTML = '<p>In order: ' + s.sorted.join(', ') + ' (' + s.n + ' values)</p><div class="tbl"><table><tbody>' +
          '<tr><th class="l">Mean</th><td class="l">' + s.sum + ' &divide; ' + s.n + ' = ' + (s.sum % s.n ? '<b>' + cl(s.mean) + '</b> (rounded)' : '<b>' + s.mean + '</b>') + '</td></tr>' +
          '<tr><th class="l">Median</th><td class="l"><b>' + s.median + '</b>' + (s.n % 2 ? ' (the middle value)' : ' (average of ' + s.sorted[s.n / 2 - 1] + ' and ' + s.sorted[s.n / 2] + ')') + '</td></tr>' +
          '<tr><th class="l">Mode</th><td class="l"><b>' + (s.modes.length ? s.modes.join(' and ') : 'none') + '</b></td></tr>' +
          '<tr><th class="l">Range</th><td class="l">' + s.sorted[s.n - 1] + ' &minus; ' + s.sorted[0] + ' = <b>' + s.range + '</b></td></tr></tbody></table></div><p class="t2">Try adding one very big value like 30. The mean moves a lot. The median hardly moves.</p>';
      }
      A.bind(root, ['mdd'], md);
      var tally = { n: 0, hit: 0 };
      function tgt() { var t = $('#prt', root).value; return t === 'H6' ? [function (c, d) { return c === 'H' && d === 6; }, 1, 12] : t === 'He' ? [function (c, d) { return c === 'H' && d % 2 === 0; }, 3, 12] : [function (c, d) { return c === 'T' && d <= 2; }, 2, 12]; }
      function pr() {
        var t = tgt(), th = t[1] / t[2];
        $('#prfig', root).innerHTML = ogrid(['H', 'T'], [1, 2, 3, 4, 5, 6], t[0], 'coin', 'die');
        var ex = tally.n ? tally.hit / tally.n : null;
        $('#prout', root).innerHTML = '<p><b>Theoretical:</b> ' + t[1] + ' of 12 outcomes = ' + frac(t[1], t[2]) + ' &#8776; ' + cl(th) + ' (' + Math.round(th * 100) + '%)</p>' +
          '<p><b>Experimental:</b> ' + (tally.n ? tally.hit + ' of ' + A.fmt(tally.n) + ' tries = ' + cl(ex) + ' (' + Math.round(ex * 100) + '%)' : 'press a button to start') + '</p>' + pline(th, 'theory').replace('</svg>', ex !== null ? '<circle cx="' + (30 + 480 * ex) + '" cy="40" r="7" style="fill:var(--strand);stroke:var(--ink)"/>' + '</svg>' : '</svg>') +
          '<p class="t2">Orange: theoretical. Green: experimental. More tries usually bring them closer.</p>';
      }
      root.querySelectorAll('[data-n]').forEach(function (b) { b.addEventListener('click', function () { var t = tgt(), n = +b.getAttribute('data-n'); for (var i = 0; i < n; i++) { if (t[0](Math.random() < 0.5 ? 'H' : 'T', 1 + Math.floor(Math.random() * 6))) tally.hit++; tally.n++; } pr(); }); });
      $('#prr', root).addEventListener('click', function () { tally = { n: 0, hit: 0 }; pr(); });
      $('#prt', root).addEventListener('change', function () { tally = { n: 0, hit: 0 }; pr(); });
      pr();
    },

    quiz: [
      { q: 'Which is <b>discrete</b> data?', type: 'mc', options: ['the mass of a backpack', 'the number of books in a backpack', 'the length of a pencil', 'the time to finish a test'], answer: 1,
        hint: 'Discrete data are counted. Which one do you count?', explain: 'You count books, and you cannot have 2.5 books. The others are measured, so they are continuous.' },
      { q: 'How many students are 155 cm or taller?', type: 'num', answer: 10, fig: hist(bin(HEIGHTS, 135, 5, 7), 135, 5, 'Heights of 25 students', 'height (cm)'),
        hint: 'Add the bars that start at 155 or more.', explain: 'The 155 to 160 bar has 6, the 160 to 165 bar has 3 and the 165 to 170 bar has 1: 6 + 3 + 1 = 10.' },
      { q: 'Why might this graph be misleading?', type: 'mc', options: ['It has no title', 'The vertical axis does not start at 0', 'The line should be a bar', 'There are too many months'], answer: 1, fig: bline(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], [92, 94, 95, 97, 98, 101], 80, 110, 5, 'Monthly hydro bill', 'dollars'),
        hint: 'Look at the numbers on the left side.', explain: 'The axis starts at 80, so a rise from $92 to $101 looks much bigger than it is.' },
      { q: 'What is the mean of 12, 15, 9, 20, 14?', type: 'num', answer: 14,
        hint: 'Add them all, then divide by 5.', explain: '12 + 15 + 9 + 20 + 14 = 70. 70 &divide; 5 = 14.' },
      { q: 'What is the range of 34, 28, 41, 30, 37?', type: 'num', answer: 13,
        hint: 'Greatest minus least.', explain: '41 &minus; 28 = 13.' },
      { q: 'A bag has 3 red, 5 blue and 2 green marbles. What is the probability of picking blue, as a percent?', type: 'num', answer: 50, unit: '%', fig: pline(0.5, 'blue'),
        hint: 'Blue marbles &divide; all marbles. Then change to a percent.', explain: '5 of 10 marbles are blue: ' + A.fr(5, 10) + ' = 0.5 = 50%.' },
      { q: 'You roll a die and flip a coin. What is the probability of an even number and heads?', type: 'mc', options: ['1/2', '1/4', '1/12', '3/6'], answer: 1, fig: ogrid(['H', 'T'], [1, 2, 3, 4, 5, 6], function (x, y) { return x === 'H' && y % 2 === 0; }, 'coin', 'die'),
        hint: 'Count the shaded outcomes in the grid out of 12.', explain: 'H2, H4 and H6: 3 of 12 = ' + A.fr(3, 12) + ' = ' + A.fr(1, 4) + '.' }
    ],

    practice: [
      { id: 'dp-type', name: 'Kinds of data', code: 'D1.1', gen: function (lv) {
        var items = DATA_KINDS;
        var pool = lv === 1 ? items.filter(function (x) { return x[1] !== 'qualitative'; }) : items, it = R.pick(pool);
        var opts = lv === 1 ? ['discrete', 'continuous'] : ['qualitative', 'discrete', 'continuous'];
        return { q: 'What kind of data is <b>' + it[0] + '</b>?', type: 'mc', options: opts, answer: opts.indexOf(it[1]), v: { it: it[0], k: it[1] },
          hint: 'Is it words? Then qualitative. Counted? Discrete. Measured? Continuous.', steps: ['Are the data words or numbers? ' + (it[1] === 'qualitative' ? 'Words or categories.' : 'Numbers.'), it[1] === 'qualitative' ? 'Categories are qualitative.' : 'Are they counted or measured? ' + (it[1] === 'discrete' ? 'Counted.' : 'Measured.'), 'So it is ' + it[1] + '.'],
          explain: it[0].charAt(0).toUpperCase() + it[0].slice(1) + ' is ' + it[1] + (it[1] === 'discrete' ? ': it is counted.' : it[1] === 'continuous' ? ': it is measured.' : ': it is categories, not numbers.') };
      } },
      { id: 'dp-mmm', name: 'Mean, median, mode, range', code: 'D1.5', gen: function (lv) {
        var n = lv === 1 ? 5 : R.pick([5, 6, 7]), d = [];
        for (var i = 0; i < n; i++) d.push(R.int(1, lv === 3 ? 50 : 20));
        var kind = R.pick(lv === 1 ? ['range', 'median', 'mode'] : ['mean', 'median', 'range', 'mean']);
        if (kind === 'mode') { d[1] = d[3]; }
        var s = stats(d);
        if (kind === 'mode' && s.modes.length !== 1) { d = [3, 5, 5, 8, 9]; s = stats(d); }
        if (kind === 'mean' && s.sum % n) { d[0] += n - s.sum % n; s = stats(d); }
        var ansV = kind === 'mean' ? s.mean : kind === 'median' ? s.median : kind === 'mode' ? s.modes[0] : s.range;
        var steps = { mean: ['Add them: ' + d.join(' + ') + ' = ' + s.sum + '.', 'Divide by how many values: ' + s.sum + ' &divide; ' + n + '.', 'Mean = ' + s.mean + '.'],
          median: ['Put them in order: ' + s.sorted.join(', ') + '.', n % 2 ? 'There are ' + n + ' values, so the middle is value number ' + (n + 1) / 2 + '.' : 'There are ' + n + ' values, so average the two middle ones: ' + s.sorted[n / 2 - 1] + ' and ' + s.sorted[n / 2] + '.', 'Median = ' + s.median + '.'],
          mode: ['Put them in order: ' + s.sorted.join(', ') + '.', 'Look for the value that appears most often.', 'Mode = ' + s.modes[0] + '.'],
          range: ['Find the greatest: ' + s.sorted[n - 1] + '. Find the least: ' + s.sorted[0] + '.', 'Subtract: ' + s.sorted[n - 1] + ' &minus; ' + s.sorted[0] + '.', 'Range = ' + s.range + '.'] }[kind];
        return { q: 'Find the <b>' + kind + '</b> of: <span class="math">' + d.join(', ') + '</span>', type: 'num', answer: ansV, v: { d: d, kind: kind }, fig: lv === 1 ? dotplot(d, 0, 20) : '',
          hint: { mean: 'Add them all, then divide by ' + n + '.', median: 'Put them in order first.', mode: 'Which value appears most often?', range: 'Greatest minus least.' }[kind], steps: steps, explain: 'The ' + kind + ' is ' + ansV + '.' };
      } },
      { id: 'dp-hist', name: 'Read a histogram', code: 'D1.3', gen: function (lv) {
        var w = R.pick([5, 10]), lo = R.pick([0, 10, 20, 30]), nb = R.int(4, 6), b = [];
        for (var i = 0; i < nb; i++) b.push(R.int(1, 9));
        var ctx = R.pick(['Minutes spent on homework', 'Kilometres biked this week', 'Ages of people at a concert', 'Scores on a test']);
        var k = R.int(0, nb - 1), title = ctx;
        if (lv === 1) return { q: 'How many values are in the interval ' + (lo + k * w) + ' to ' + (lo + (k + 1) * w) + '?', type: 'num', answer: b[k], fig: hist(b, lo, w, title, ''), v: { b: b, k: k, kind: 'one' },
          hint: 'Find the bar that starts at ' + (lo + k * w) + '. Read across to the scale.', steps: ['Find ' + (lo + k * w) + ' on the bottom.', 'The bar from ' + (lo + k * w) + ' to ' + (lo + (k + 1) * w) + ' is ' + b[k] + ' high.', 'There are ' + b[k] + ' values.'], explain: 'That bar has height ' + b[k] + '.' };
        if (lv === 2) { var tot = b.reduce(function (a, c) { return a + c; }, 0);
          return { q: 'How many values are shown in this histogram altogether?', type: 'num', answer: tot, fig: hist(b, lo, w, title, ''), v: { b: b, kind: 'total' },
            hint: 'Add the heights of all the bars.', steps: ['Read each bar: ' + b.join(', ') + '.', 'Add them.', b.join(' + ') + ' = ' + tot + '.'], explain: 'The total is ' + tot + '.' }; }
        var cut = R.int(1, nb - 1), above = b.slice(cut).reduce(function (a, c) { return a + c; }, 0);
        return { q: 'How many values are ' + (lo + cut * w) + ' or more?', type: 'num', answer: above, fig: hist(b, lo, w, title, ''), v: { b: b, cut: cut, kind: 'above' },
          hint: 'Add the bars that start at ' + (lo + cut * w) + ' or later.', steps: ['The bars starting at ' + (lo + cut * w) + ' or more are: ' + b.slice(cut).join(', ') + '.', 'Add them.', 'Total: ' + above + '.'], explain: b.slice(cut).join(' + ') + ' = ' + above + '.' };
      } },
      { id: 'dp-graph', name: 'Choose and read graphs', code: 'D1.6', gen: function (lv) {
        if (lv === 1) { var c = R.pick(GRAPH_FITS);
          var o = ['bar graph', 'histogram', 'broken-line graph'];
          return { q: 'Which graph is best for <b>' + c[0] + '</b>?', type: 'mc', options: o, answer: o.indexOf(c[1]), v: { c: c },
            hint: 'Categories: bar graph. Many numbers in intervals: histogram. Change over time: broken-line graph.', steps: ['What kind of data is it?', c[1] === 'broken-line graph' ? 'It changes over time.' : c[1] === 'histogram' ? 'It is many measured numbers that can be grouped in intervals.' : 'It is categories.', 'Best choice: ' + c[1] + '.'], explain: 'A ' + c[1] + ' fits ' + c[0] + '.' }; }
        var ys = [], v0 = R.int(5, 15);
        for (var i = 0; i < 6; i++) { v0 += R.int(-3, 5); ys.push(Math.max(1, v0)); }
        var xs = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mx = Math.ceil((Math.max.apply(null, ys) + 1) / 5) * 5;
        if (lv === 2) { var k = R.int(0, 5);
          return { q: 'This graph shows the temperature at noon (&deg;C). What was it on ' + xs[k] + '?', type: 'num', answer: ys[k], fig: bline(xs, ys, 0, mx, mx > 20 ? 5 : 1 * 5, 'Noon temperature', '&deg;C').replace(/<circle/g, '<circle').replace('</svg>', ys.map(function (v, i) { return '<text x="' + (80 + 420 * i / 5) + '" y="' + (200 - 170 * v / mx - 12) + '" text-anchor="middle" font-size="15" class="tb">' + v + '</text>'; }).join('') + '</svg>'), v: { ys: ys, k: k, kind: 'read' },
            hint: 'Find ' + xs[k] + ' on the bottom. Go up to the point.', steps: ['Find ' + xs[k] + '.', 'Go up to the dot.', 'It shows ' + ys[k] + '&deg;C.'], explain: 'On ' + xs[k] + ' it was ' + ys[k] + '&deg;C.' }; }
        var best = 0, bi = 0; for (var j = 1; j < 6; j++) if (ys[j] - ys[j - 1] > best) { best = ys[j] - ys[j - 1]; bi = j; }
        if (best <= 0) { ys[3] = ys[2] + 4; best = 4; bi = 3; for (var j2 = 1; j2 < 6; j2++) if (ys[j2] - ys[j2 - 1] > ys[bi] - ys[bi - 1]) bi = j2; best = ys[bi] - ys[bi - 1]; }
        var ties = 0; for (var j3 = 1; j3 < 6; j3++) if (ys[j3] - ys[j3 - 1] === best) ties++;
        if (ties > 1) { ys[bi] += 1; best += 1; if (bi < 5) ys[bi + 1] += 1; }
        mx = Math.ceil((Math.max.apply(null, ys) + 1) / 5) * 5;
        var o2 = R.mc(xs[bi - 1] + ' to ' + xs[bi], [1, 2, 3, 4, 5].filter(function (j) { return j !== bi; }).map(function (j) { return xs[j - 1] + ' to ' + xs[j]; }));
        return { q: 'Between which two days did the temperature rise the most?', type: 'mc', options: o2.options, answer: o2.answer, fig: bline(xs, ys, 0, mx, 5, 'Noon temperature', '&deg;C').replace('</svg>', ys.map(function (v, i) { return '<text x="' + (80 + 420 * i / 5) + '" y="' + (200 - 170 * v / mx - 12) + '" text-anchor="middle" font-size="15" class="tb">' + v + '</text>'; }).join('') + '</svg>'), v: { ys: ys, kind: 'rise' },
          hint: 'Look for the steepest line going up.', steps: ['Find the change for each pair of days.', 'The biggest rise is ' + best + '&deg;C.', 'That is ' + xs[bi - 1] + ' to ' + xs[bi] + '.'], explain: 'The steepest rise, ' + best + '&deg;C, is ' + xs[bi - 1] + ' to ' + xs[bi] + '.' };
      } },
      { id: 'dp-prob', name: 'Probability of one event', code: 'D2.1', gen: function (lv) {
        var a = R.int(1, 6), b = R.int(1, 6), c = R.int(1, 6), tot = a + b + c, col = R.pick([['red', a], ['blue', b], ['green', c]]);
        var bag = 'A bag has ' + a + ' red, ' + b + ' blue and ' + c + ' green marbles. ';
        if (lv === 1) { var o = R.mc(frac(col[1], tot), [frac(col[1], tot - col[1]) , frac(1, 3), frac(Math.max(1, tot - col[1]), tot), frac(1, tot)].filter(function (x) { return x !== frac(col[1], tot); }));
          return { q: bag + 'What is the probability of picking ' + col[0] + '?', type: 'mc', options: o.options, answer: o.answer, v: { f: col[1], t: tot },
            hint: 'Favourable outcomes &divide; all outcomes.', steps: ['There are ' + col[1] + ' ' + col[0] + ' marbles.', 'There are ' + a + ' + ' + b + ' + ' + c + ' = ' + tot + ' marbles in all.', 'Probability = ' + A.fr(col[1], tot) + (gcd(col[1], tot) > 1 ? ' = ' + frac(col[1], tot) : '') + '.'], explain: col[1] + ' of ' + tot + ' marbles are ' + col[0] + ': ' + frac(col[1], tot) + '.' }; }
        var sides = R.pick([4, 5, 10, 20, 25]), fav = R.int(1, sides - 1), pct = fav * 100 / sides;
        if (lv === 2) return { q: 'A spinner has ' + sides + ' equal sections. ' + fav + ' are blue. What is the probability of blue, as a percent?', type: 'num', unit: '%', answer: pct, fig: pline(fav / sides, 'blue'), v: { f: fav, t: sides },
          hint: 'Write ' + A.fr(fav, sides) + ', then make the bottom 100.', steps: ['Probability = ' + A.fr(fav, sides) + '.', 'Multiply top and bottom by ' + 100 / sides + ': ' + A.fr(fav * 100 / sides, 100) + '.', 'That is ' + pct + '%.'], explain: A.fr(fav, sides) + ' = ' + pct + '%.' };
        var trials = R.pick([20, 40, 50, 100, 200]), p = R.pick([[1, 2], [1, 4], [1, 5], [3, 4], [2, 5], [1, 10]]), exp = trials * p[0] / p[1];
        return { q: 'The probability of winning a game is ' + A.fr(p[0], p[1]) + '. If you play ' + trials + ' times, about how many times should you win?', type: 'num', answer: exp, v: { p: p, n: trials },
          hint: 'Find ' + A.fr(p[0], p[1]) + ' of ' + trials + '.', steps: ['Predicted wins = probability &times; number of tries.', trials + ' &divide; ' + p[1] + ' = ' + trials / p[1] + '.', '&times; ' + p[0] + ' = ' + exp + '.'], explain: A.fr(p[0], p[1]) + ' of ' + trials + ' is ' + exp + '. The real number may be a bit different.' };
      } },
      { id: 'dp-two', name: 'Two independent events', code: 'D2.2', gen: function (lv) {
        var A1 = R.pick([[['H', 'T'], 'flip a coin', 'coin'], [['R', 'B', 'G'], 'spin a 3-colour spinner (red, blue, green)', 'spinner'], [['R', 'B', 'G', 'Y'], 'spin a 4-colour spinner (red, blue, green, yellow)', 'spinner']]);
        var B1 = R.pick([[[1, 2, 3, 4, 5, 6], 'roll a die', 'die'], [[1, 2, 3, 4], 'spin a spinner numbered 1 to 4', 'number']]);
        var a = R.pick(A1[0]), names = { H: 'heads', T: 'tails', R: 'red', B: 'blue', G: 'green', Y: 'yellow' };
        var cond = lv === 1 ? [function (y) { return y === B1[0][B1[0].length - 1]; }, 'a ' + B1[0][B1[0].length - 1]] : lv === 2 ? [function (y) { return y % 2 === 0; }, 'an even number'] : [function (y) { return y >= B1[0].length - 2; }, 'a ' + (B1[0].length - 2) + ' or higher'];
        var fav = B1[0].filter(cond[0]).length, tot = A1[0].length * B1[0].length;
        var o = R.mc(frac(fav, tot), [frac(fav, B1[0].length), frac(1, A1[0].length + B1[0].length), frac(fav + 1, tot), frac(1, A1[0].length)].filter(function (x) { return x !== frac(fav, tot); }));
        return { q: 'You ' + A1[1] + ' and ' + B1[1] + '. What is the probability of ' + names[a] + ' and ' + cond[1] + '?', type: 'mc', options: o.options, answer: o.answer, v: { fav: fav, tot: tot },
          fig: lv < 3 ? ogrid(A1[0], B1[0], function (x, y) { return x === a && cond[0](y); }, A1[2], B1[2]) : '',
          hint: 'Count all outcomes: ' + A1[0].length + ' &times; ' + B1[0].length + '. Then count the ones that match.', steps: ['All outcomes: ' + A1[0].length + ' &times; ' + B1[0].length + ' = ' + tot + '.', 'Matching outcomes: ' + names[a] + ' with ' + B1[0].filter(cond[0]).join(', ') + ': ' + fav + '.', 'Probability = ' + A.fr(fav, tot) + (gcd(fav, tot) > 1 ? ' = ' + frac(fav, tot) : '') + '.' + (lv === 3 ? ogrid(A1[0], B1[0], function (x, y) { return x === a && cond[0](y); }, A1[2], B1[2]) : '')],
          explain: fav + ' of ' + tot + ' outcomes: ' + frac(fav, tot) + '.' };
      } }
    ]
  });
  /* ---------- practice shapes: more ways to ask each skill (docs/QUESTIONS.md). Answer checks: tests/verify/grade6.js ---------- */
  (function () {
    var Q = A.Q, why = G6.why, nm = Q.name, KINDS = ['qualitative', 'discrete', 'continuous'];
    function ft(n, d) { var k = gcd(n, d) || 1; return n / k + '/' + d / k; }
    function ofKind(k) { return DATA_KINDS.filter(function (x) { return x[1] === k; }); }
    function distinct(n, lo, hi) { var d = []; while (d.length < n) { var v = R.int(lo, hi); if (d.indexOf(v) < 0) d.push(v); } return d; }
    function picked(list) { var l = R.shuffle(list); return { options: l.map(function (x) { return x[0]; }), answer: l.map(function (x, j) { return x[1] ? j : -1; }).filter(function (j) { return j >= 0; }) }; }
    var SHAPES = {
      'dp-type': [
        [1, 'match', function () {
          var its = KINDS.map(function (k) { return R.pick(ofKind(k)); });
          return { q: 'Match each set of data to its kind.', type: 'match', pairs: its.map(function (it) { return [it[0].charAt(0).toUpperCase() + it[0].slice(1), it[1]]; }),
            hint: 'Words: qualitative. Counted: discrete. Measured: continuous.', steps: its.map(function (it) { return it[0] + ': ' + it[1] + '.'; }), explain: 'Counted is discrete. Measured is continuous. Categories are qualitative.', meta: { k: 'g6-type-match' } };
        }],
        [1, 'pick', function () {
          var want = R.pick(['discrete', 'continuous']), right = R.shuffle(ofKind(want)).slice(0, 2), wrong = R.shuffle(DATA_KINDS.filter(function (x) { return x[1] !== want; })).slice(0, 3);
          var o = picked(right.map(function (x) { return [x[0], 1]; }).concat(wrong.map(function (x) { return [x[0]]; })));
          return { q: 'Pick every set of data that is <b>' + want + '</b>.', type: 'pick', options: o.options, answer: o.answer,
            hint: want === 'discrete' ? 'Discrete data are counted.' : 'Continuous data are measured.', steps: right.map(function (x) { return x[0] + ' is ' + want + '.'; }), explain: want === 'discrete' ? 'You count these.' : 'You measure these.', meta: { k: 'g6-type-pick', want: want } };
        }],
        [1, 'mistake', function () {
          var it = R.pick(DATA_KINDS.filter(function (x) { return x[1] !== 'qualitative'; })), who = nm(), truth = !R.int(0, 2), s = truth ? it[1] : it[1] === 'discrete' ? 'continuous' : 'discrete';
          return { q: who + ' says <b>' + it[0] + '</b> is ' + s + ' data. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(it[1] === 'discrete' ? 'You count it, so it is discrete.' : 'You measure it, so it is continuous.', ['Any data with numbers is discrete.', 'Data that changes is always continuous.']),
            hint: 'Do you count it or measure it?', steps: [it[0] + ' is ' + (it[1] === 'discrete' ? 'counted' : 'measured') + '.'], explain: 'It is ' + it[1] + ' data.', meta: { k: 'g6-type-tf', it: it[0], said: s } };
        }]
      ],
      'dp-mmm': [
        [1, 'tap', function () {
          var n = R.pick([5, 7]), d = distinct(n, 1, 30), med = stats(d).median;
          return { q: 'Tap the <b>median</b> of these values.', type: 'tap', tiles: d.map(String), answer: d.indexOf(med), answerText: String(med),
            hint: 'Put them in order first. The median is in the middle.', steps: ['In order: ' + stats(d).sorted.join(', ') + '.', 'The middle value is ' + med + '.'], explain: 'The median is ' + med + '.', meta: { k: 'g6-mmm-tap' } };
        }],
        [1, 'fill', function () {
          var d = distinct(5, 1, 20), s = stats(d);
          return { q: 'For the data <span class="math">' + d.join(', ') + '</span>:', type: 'fill', fill: 'Range = [[]] &nbsp; Median = [[]]', answers: [s.range, s.median], fig: dotplot(d, 0, 20),
            hint: 'Put the values in order first.', steps: ['In order: ' + s.sorted.join(', ') + '.', 'Range: ' + s.sorted[4] + ' &minus; ' + s.sorted[0] + ' = ' + s.range + '.', 'Median: ' + s.median + '.'], explain: 'Range ' + s.range + ', median ' + s.median + '.', meta: { k: 'g6-mmm-fill', d: d } };
        }],
        [1, 'mistake', function () {
          var d = distinct(5, 1, 20), s = stats(d);
          if (s.sum % 5) { d[0] += 5 - s.sum % 5; s = stats(d); }
          var who = nm(), truth = !R.int(0, 2), said = truth ? s.mean : s.median !== s.mean ? s.median : s.mean + 1;
          return { q: 'The data are <span class="math">' + d.join(', ') + '</span>. ' + who + ' says the <b>mean</b> is <b>' + said + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('The mean is the total shared equally: ' + s.sum + ' &divide; 5 = ' + s.mean + '.', ['The mean is the middle value.', 'The mean is the value that appears most.']),
            hint: 'Add them all, then divide by 5.', steps: [d.join(' + ') + ' = ' + s.sum + '.', s.sum + ' &divide; 5 = ' + s.mean + '.'], explain: 'The mean is ' + s.mean + '.', meta: { k: 'g6-mmm-tf', d: d, said: said } };
        }],
        [2, 'story', function () {
          var d = [R.int(60, 95), R.int(60, 95), R.int(60, 95), R.int(60, 95)], s = stats(d), who = nm();
          if (s.sum % 4) { d[0] += 4 - s.sum % 4; s = stats(d); }
          return { q: who + ' scored ' + d.slice(0, 3).join(', ') + ' and ' + d[3] + ' on four tests. What is the mean score?', type: 'num', answer: s.mean,
            hint: 'Add the four scores, then divide by 4.', steps: [d.join(' + ') + ' = ' + s.sum + '.', s.sum + ' &divide; 4 = ' + s.mean + '.'], explain: 'The mean score is ' + s.mean + '.', meta: { k: 'g6-mmm-story', d: d } };
        }]
      ],
      'dp-hist': [
        [1, 'mistake', function () {
          var w = R.pick([5, 10]), lo = R.pick([0, 10, 20]), b = [R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(1, 9)], tot = b.reduce(function (x, y) { return x + y; }, 0), who = nm(), truth = !R.int(0, 2), said = truth ? tot : b.length;
          return { q: who + ' says this histogram shows <b>' + said + '</b> values in all. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: hist(b, lo, w, 'Minutes spent reading', ''),
            why: why('Each bar’s height is a count. Add them: ' + b.join(' + ') + ' = ' + tot + '.', ['Count the bars.', 'Read the tallest bar.']),
            hint: 'Add the heights of all the bars.', steps: [b.join(' + ') + ' = ' + tot + '.'], explain: tot + ' values in all.', meta: { k: 'g6-hist-tf', b: b, said: said } };
        }],
        [1, 'fill', function () {
          var w = R.pick([5, 10]), lo = R.pick([0, 10, 20]), b = [R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(1, 9)], cut = R.int(1, 4), x = lo + cut * w;
          var below = b.slice(0, cut).reduce(function (p, c) { return p + c; }, 0), above = b.slice(cut).reduce(function (p, c) { return p + c; }, 0);
          return { q: 'Use the histogram.', type: 'fill', fill: 'Values below ' + x + ': [[]] &nbsp; Values ' + x + ' or more: [[]]', answers: [below, above], fig: hist(b, lo, w, 'Kilometres biked this week', ''),
            hint: 'Split the bars at ' + x + '. Add each side.', steps: ['Below ' + x + ': ' + b.slice(0, cut).join(' + ') + ' = ' + below + '.', x + ' or more: ' + b.slice(cut).join(' + ') + ' = ' + above + '.'], explain: below + ' and ' + above + '.', meta: { k: 'g6-hist-fill', b: b, lo: lo, w: w } };
        }],
        [2, 'pick', function () {
          var w = 10, lo = R.pick([0, 20, 40]), b, t = R.int(3, 6), o;
          do { b = [R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(1, 9)]; o = picked(b.map(function (c, i) { return [(lo + i * w) + ' to ' + (lo + (i + 1) * w), c > t]; })); } while (!o.answer.length || o.answer.length === 5);
          return { q: 'Pick every interval with <b>more than ' + t + '</b> values.', type: 'pick', options: o.options, answer: o.answer, fig: hist(b, lo, w, 'Ages of people at a concert', ''),
            hint: 'Find ' + t + ' on the side. Which bars go higher?', steps: ['Bars taller than ' + t + ': ' + o.answer.map(function (j) { return o.options[j]; }).join(', ') + '.'], explain: 'Those bars are taller than ' + t + '.', meta: { k: 'g6-hist-pick', b: b, lo: lo, w: w } };
        }]
      ],
      'dp-graph': [
        [1, 'match', function () {
          var types = ['bar graph', 'histogram', 'broken-line graph'], its = types.map(function (t) { return R.pick(GRAPH_FITS.filter(function (x) { return x[1] === t; })); });
          return { q: 'Match each set of data to the best graph.', type: 'match', pairs: its.map(function (it) { return [it[0].charAt(0).toUpperCase() + it[0].slice(1), it[1]]; }),
            hint: 'Categories: bar graph. Many numbers in intervals: histogram. Change over time: broken-line graph.', steps: its.map(function (it) { return it[0] + ': ' + it[1] + '.'; }), explain: 'Match the graph to the kind of data.', meta: { k: 'g6-graph-match' } };
        }],
        [1, 'mistake', function () {
          var it = R.pick(GRAPH_FITS), who = nm(), truth = !R.int(0, 2), others = ['bar graph', 'histogram', 'broken-line graph'].filter(function (x) { return x !== it[1]; }), s = truth ? it[1] : R.pick(others);
          return { q: who + ' says a <b>' + s + '</b> is the best graph for ' + it[0] + '. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why(it[1] === 'broken-line graph' ? 'It changes over time, so a broken-line graph is best.' : it[1] === 'histogram' ? 'It is many measured numbers grouped in intervals, so a histogram is best.' : 'It is categories, so a bar graph is best.', ['Any graph works for any data.', 'A histogram is always best.']),
            hint: 'Is it categories, many numbers, or change over time?', steps: ['Best: ' + it[1] + '.'], explain: 'A ' + it[1] + ' fits best.', meta: { k: 'g6-graph-tf', it: it[0], said: s } };
        }],
        [1, 'tap', function () {
          var xs = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ys = distinct(6, 4, 24), top = ys.indexOf(Math.max.apply(null, ys));
          return { q: 'This graph shows the noon temperature. Tap the warmest day.', type: 'tap', tiles: xs, answer: top, answerText: xs[top], fig: bline(xs, ys, 0, 25, 5, 'Noon temperature', '&deg;C'),
            hint: 'Find the highest point on the graph.', steps: ['The highest point is ' + ys[top] + '&deg;C on ' + xs[top] + '.'], explain: xs[top] + ' was warmest.', meta: { k: 'g6-graph-tap', ys: ys } };
        }]
      ],
      'dp-prob': [
        [1, 'line', function () {
          var tot = R.pick([4, 5, 10]), r = R.int(1, tot - 1);
          return { q: 'A bag has ' + r + ' red and ' + (tot - r) + ' blue marbles. Place the probability of picking red on the line.', type: 'line', min: 0, max: 1, tick: 0.05, every: 0.5, snap: 0.05, answer: r / tot,
            hint: 'Red &divide; all marbles.', steps: [r + ' of ' + tot + ' marbles are red: ' + ft(r, tot) + '.'], explain: 'The probability is ' + ft(r, tot) + ' = ' + r / tot + '.', meta: { k: 'g6-prob-line', f: r, t: tot } };
        }],
        [1, 'mistake', function () {
          var r = R.int(1, 6), b = R.int(1, 6), who = nm(), truth = !R.int(0, 2), said = truth ? [r, r + b] : [r, b];
          return { q: 'A bag has ' + r + ' red and ' + b + ' blue marbles. ' + who + ' says the probability of red is <b>' + said[0] + '/' + said[1] + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('Compare red with <b>all</b> the marbles: ' + r + ' out of ' + (r + b) + '.', ['Compare red with blue.', 'The probability of red is always 1/2.']),
            hint: 'How many marbles are there in all?', steps: [r + ' + ' + b + ' = ' + (r + b) + ' marbles.', 'Probability of red: ' + r + '/' + (r + b) + '.'], explain: r + '/' + (r + b) + '.', meta: { k: 'g6-prob-tf', r: r, b: b, said: said } };
        }],
        [1, 'order', function () {
          var c = distinct(3, 1, 9).sort(function (x, y) { return x - y; }), cols = R.shuffle(['red', 'blue', 'green']);
          var cnt = {}; cols.forEach(function (k, i) { cnt[k] = c[i]; });
          return { q: 'A bag has ' + c[0] + ' ' + cols[0] + ', ' + c[1] + ' ' + cols[1] + ' and ' + c[2] + ' ' + cols[2] + ' marbles. Put the colours in order from <b>least</b> likely to most likely.', type: 'order', items: cols.slice(), first: 'least likely', last: 'most likely',
            hint: 'Fewer marbles means less likely.', steps: ['Least: ' + cols[0] + ' (' + c[0] + '). Most: ' + cols[2] + ' (' + c[2] + ').'], explain: cols.join(', ') + '.', meta: { k: 'g6-prob-order', cnt: cnt } };
        }]
      ],
      'dp-two': [
        [1, 'fill', function () {
          var nb = R.pick([4, 6]);
          return { q: 'You flip a coin and roll a number cube numbered 1 to ' + nb + '.', type: 'fill', fill: 'Outcomes in all: [[]] &nbsp; Outcomes with heads and an even number: [[]]', answers: [2 * nb, nb / 2],
            hint: 'Multiply the outcomes of each one.', steps: ['2 &times; ' + nb + ' = ' + 2 * nb + '.', 'Heads with ' + [2, 4, 6].slice(0, nb / 2).join(', ') + ': ' + nb / 2 + '.'], explain: nb / 2 + ' of ' + 2 * nb + '.', meta: { k: 'g6-two-fill', nb: nb } };
        }],
        [1, 'mistake', function () {
          var nb = R.pick([4, 6]), who = nm(), truth = !R.int(0, 2), said = truth ? [1, 2 * nb] : [1, 2 + nb];
          return { q: 'You flip a coin and roll a number cube numbered 1 to ' + nb + '. ' + who + ' says the probability of heads and a ' + nb + ' is <b>' + said[0] + '/' + said[1] + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
            why: why('There are 2 &times; ' + nb + ' = ' + 2 * nb + ' outcomes, and only one is heads and ' + nb + '.', ['Add the outcomes: 2 + ' + nb + '.', 'Each event has a probability of 1/2.']),
            hint: 'Multiply to count all the outcomes.', steps: ['2 &times; ' + nb + ' = ' + 2 * nb + ' outcomes.', 'Probability: 1/' + 2 * nb + '.'], explain: '1/' + 2 * nb + '.', meta: { k: 'g6-two-tf', nb: nb, said: said } };
        }],
        [2, 'pick', function () {
          var out = [];
          ['H', 'T'].forEach(function (c) { [1, 2, 3, 4].forEach(function (n) { out.push([c + n, c === 'H' && n % 2 === 0]); }); });
          var o = picked(out);
          return { q: 'You flip a coin (H or T) and spin a spinner numbered 1 to 4. Pick every outcome that is <b>heads and an even number</b>.', type: 'pick', options: o.options, answer: o.answer,
            hint: 'It must have H and an even number.', steps: ['H2 and H4.'], explain: 'H2 and H4: 2 of 8 outcomes.', meta: { k: 'g6-two-pick' } };
        }]
      ]
    };
    Atlas.Q.shapes(CH, SHAPES);
  })();
})();
