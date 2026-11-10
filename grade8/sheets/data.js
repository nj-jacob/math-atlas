/* Grade 8 Data: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/data.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names.
   Ontario 2020: D1.1 one- and two-variable data, continuous and discrete; D1.2 collecting and organizing two-variable
   data in tables; D1.3 choosing a graph, scatter plots; D1.4 infographics; D1.5 the direction and strength of a
   relationship; D1.6 misleading graphs and fair conclusions; C3.1 and C3.2 code that analyzes data. The answer checks
   are in tests/verify/sheets.js: statistics are worked out again from the data in the question (stat), the kind of
   data and graph follow their rules (vars, cont, graph), a scatter plot's trend comes from its correlation (trend),
   a point is read from the plot (at), and a cut-off axis makes a bar look taller by (value − start) ÷ (value − start). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var Q = S.q;
  function VAR(what, vars) { return { q: what, pick: { opts: ['one-variable', 'two-variable'], ans: vars.length === 1 ? 0 : 1, vars: vars }, wide: true }; }
  function CONT(what) { var meas = /height|length|mass|time|temperature|distance|speed|arm span|volume|area|age in days|weight/.test(what); return { q: what, pick: { opts: ['continuous', 'discrete'], ans: meas ? 0 : 1, cont: what } }; }
  function GRA(what, kind) { var o = ['bar graph', 'line graph', 'circle graph', 'scatter plot']; return { q: what, pick: { opts: o, ans: o.indexOf({ two: 'scatter plot', time: 'line graph', parts: 'circle graph', groups: 'bar graph' }[kind]), graph: kind }, wide: true }; }
  /* a statistic of data given in the question */
  function ST(stat, data, dp) {
    var d = data.slice().sort(function (x, y) { return x - y; }), n = d.length, v = { mean: d.reduce(function (x, y) { return x + y; }, 0) / n, median: n % 2 ? d[(n - 1) / 2] : (d[n / 2 - 1] + d[n / 2]) / 2, range: d[n - 1] - d[0] }[stat];
    return { q: 'Data: ' + data.map(S.fmt).join(', '), eq: [stat.charAt(0).toUpperCase() + stat.slice(1) + ': []'], a: [dp != null ? +v.toFixed(dp) : v], stat: stat, data: data, wide: data.length > 6 };
  }
  function SC(pts, xmax, ymax, xs, ys, xl, yl) { return { pts: pts, xmax: xmax, ymax: ymax, xs: xs, ys: ys, xl: xl, yl: yl, h: 72 }; }
  function TR(sc, opts) {
    var P = sc.pts, n = P.length, mx = P.reduce(function (t, q) { return t + q[0]; }, 0) / n, my = P.reduce(function (t, q) { return t + q[1]; }, 0) / n;
    var sxy = 0, sxx = 0, syy = 0; P.forEach(function (q) { sxy += (q[0] - mx) * (q[1] - my); sxx += (q[0] - mx) * (q[0] - mx); syy += (q[1] - my) * (q[1] - my); });
    var r = sxy / Math.sqrt(sxx * syy || 1), ar = Math.abs(r), want = ar < 0.3 ? 'none' : (ar >= 0.8 ? 'strong ' : 'weak ') + (r > 0 ? 'positive' : 'negative');
    var dir = opts.indexOf(want) < 0 && want !== 'none';
    sc.h = 44; sc.ys = sc.ymax / 2;
    return { q: 'Describe the relationship.', pic: ['scat', sc], pick: { opts: opts, ans: opts.indexOf(dir ? want.split(' ')[1] : want), trend: true, dir: dir } };
  }
  function AT(sc, x, q) { return { q: q, pic: ['scat', sc], eq: ['[]'], a: [sc.pts.filter(function (p) { return p[0] === x; })[0][1]], at: x }; }
  /* a bar graph whose scale starts above 0: how much more, and how many times as tall it looks */
  function ML(v, min, max, step, i, j) {
    return { pic: ['dbar', { cats: ['A', 'B', 'C'].slice(0, v.length), sets: [v], min: min, max: max, step: step }], eq: ['really [] more', 'looks [] times'], a: [v[i] - v[j], (v[i] - min) / (v[j] - min)], calc: v[i] + ' − ' + v[j], looks: [i, j], q: ['A', 'B', 'C'][i] + ' and ' + ['A', 'B', 'C'][j] + ':' };
  }
  function CD(lines, ans, calc, q) { return { q: q || 'What does the program show?', pic: ['code', { lines: lines }], eq: ['[]'], a: [ans], calc: calc }; }
  function ANG(pct, what) { return { q: what + ' is ' + pct + '% of a circle graph. Angle?', eq: [pct + '% of 360 = [] °'], a: [pct * 3.6] }; }
  var HRS = SC([[1, 52], [2, 60], [3, 63], [4, 71], [5, 76], [6, 84], [7, 88]], 8, 100, 1, 20, 'Hours studied', 'Mark (%)');

  S.register('data', { code: 'DA', ideas: {

    onetwo: {
      watch: 'calling any data with two numbers two-variable. Two-variable data pairs two things about the same person or thing.',
      goal: 'I can tell one-variable from two-variable data.',
      learn: {
        show: { cap: 'one thing about each, or two things paired', eq: ['heights: one-variable', 'height and arm span: two'] },
        together: [VAR('The mass of each backpack in the class.', ['mass']), ST('mean', [42, 38, 51, 45, 44])],
        cue: 'Ask: how many things are measured for each person or thing?',
        own: [VAR('Each student\'s hours of sleep and test mark.', ['sleep', 'mark']), ST('median', [12, 7, 15, 9, 11])]
      },
      p1: {
        show: { eq: ['(age, height) pairs', 'two-variable'] },
        items: [VAR('The temperature each day and the ice cream sold.', ['temperature', 'sales']), VAR('The length of each fish caught.', ['length']),
          VAR('The age and price of each used car.', ['age', 'price']), ST('mean', [16, 20, 18, 22, 24]), ST('range', [3.4, 5.1, 2.8, 4.6]), ST('median', [31, 28, 35, 40, 26, 33])]
      },
      p2: {
        items: [VAR('Each player\'s height and jump height.', ['height', 'jump']), VAR('The time each runner took for 5 km.', ['time']),
          ST('mean', [1.5, 2.25, 1.75, 2.5]), ST('median', [104, 96, 120, 88, 110, 99]), ST('range', [-4, 3, -7, 6, 1]),
          { q: 'The mean of 4 marks is 75. Three are 70, 80 and 68. What is the fourth?', eq: ['[]'], a: [82], calc: '4 × 75 − 70 − 80 − 68' }]
      },
      p3: {
        items: [VAR('The number of hours each family watches TV, and their screen size.', ['hours', 'size']), ST('mean', [12.5, 14, 11.5, 13, 14], 1),
          ST('median', [7.2, 6.8, 7.9, 6.5, 8.1, 7.0]), ST('range', [-12, -3, -8, 2, -5]),
          { q: '5 heights have a mean of 152 cm. A sixth student of 164 cm joins. What is the new mean of the 6?', eq: ['[] cm'], a: [154], calc: '(5 × 152 + 164) ÷ 6' }]
      },
      think: {
        items: [{ q: 'Write a question that needs two-variable data.', lines: { n: 2, key: 'For example: do taller students have longer arm spans?' } },
          { q: 'Why can a bar graph not show two-variable data well?', lines: { n: 2, key: 'A bar graph shows one value per group. Two-variable data needs pairs, like a scatter plot.' } },
          ST('mean', [48, 52, 61, 39, 55]),
          { q: '{a} measured hand span only. What else could {a} measure to compare?', lines: { n: 1, key: 'For example height, or foot length.' } }]
      }
    },

    contdisc: {
      watch: 'calling every number discrete. Measured data (height, time, mass) can be any value in between: it is continuous.',
      goal: 'I can tell continuous from discrete data and organize two-variable data in a table.',
      learn: {
        show: { cap: 'counted: discrete; measured: continuous', eq: ['3 pets: discrete', '1.62 m: continuous'] },
        together: [CONT('The height of each plant.'), CONT('The number of goals in a game.')],
        cue: 'Counted in whole steps? Discrete. Measured, with values in between? Continuous.',
        own: [CONT('The time to run 100 m.'), CONT('The number of students on a bus.'), CONT('The mass of a pumpkin.')]
      },
      p1: {
        show: { pic: ['tbl', { head: ['Student', 'Height (cm)', 'Arm span (cm)'], rows: [['A', 152, 150], ['B', 160, 163]] }], cap: 'one row per student, a column per variable' },
        items: [CONT('The temperature at noon.'), CONT('The number of books read.'), CONT('The distance a ball is thrown.'), CONT('The number of siblings.'),
          { q: '4 heights: 152, 160, 148 and 156 cm. What is the mean?', eq: ['[] cm'], a: [154], calc: '(152 + 160 + 148 + 156) ÷ 4' }]
      },
      p2: {
        items: [{ q: 'Use the table. How much longer is B\'s arm span than A\'s?', pic: ['tbl', { head: ['Student', 'Height', 'Arm span'], rows: [['A', 148, 146], ['B', 161, 165], ['C', 155, 153]] }], eq: ['[] cm'], a: [19], calc: '165 − 146', wide: true },
          { q: 'Use the table. What is the mean arm span of the 3 students?', pic: ['tbl', { head: ['Student', 'Height', 'Arm span'], rows: [['A', 148, 146], ['B', 161, 165], ['C', 155, 153]] }], eq: ['[] cm'], a: [154.6667], calc: '(146 + 165 + 153) ÷ 3', dp: 4, wide: true },
          CONT('The speed of a car.'), CONT('The number of cars in a lot.')]
      },
      p3: {
        items: [{ q: 'Height minus arm span for each student. What is the biggest difference?', pic: ['tbl', { head: ['Student', 'Height', 'Arm span'], rows: [['A', 150, 147], ['B', 163, 158], ['C', 142, 144]] }], eq: ['[] cm'], a: [5], calc: '163 − 158', wide: true },
          CONT('The mass of each apple in a bag.'), CONT('The number of apples in a bag.'),
          { q: 'A 2.4 km walk took 0.5 hours. What is the speed in km per hour?', eq: ['[] km an hour'], a: [4.8], calc: '2.4 ÷ 0.5' }]
      },
      think: {
        items: [{ q: 'Is shoe size continuous or discrete? Explain.', lines: { n: 3, key: 'Discrete: sizes come in steps (7, 7.5, 8). Foot length is continuous.' } },
          { q: 'Plan a table for two-variable data on sleep and marks.', draw: { h: 70, key: 'Columns: Student, Hours of sleep, Mark (%). One row per student.' } },
          CONT('The time spent on homework.'),
          { q: 'Why does each row hold one person\'s two values?', lines: { n: 2, key: 'So the pairs stay together and can be plotted as points.' } }]
      }
    },

    choose: {
      watch: 'using a circle graph for change over time. Parts of a whole: circle graph. Change over time: line graph.',
      goal: 'I can choose the best graph for the data.',
      learn: {
        show: { cap: 'pairs: scatter; time: line; parts: circle; groups: bar', eq: ['25% of 360 = 90°'] },
        together: [GRA('How a puppy\'s mass changes each month.', 'time'), ANG(40, 'Soccer')],
        cue: 'Ask what the data is: pairs, change over time, parts of a whole or groups.',
        own: [GRA('Hours of sleep and test marks.', 'two'), ANG(15, 'Hockey')]
      },
      p1: {
        show: { eq: ['30% of 360 = 108°'] },
        items: [GRA('Favourite sports of three classes.', 'groups'), GRA('The temperature every hour.', 'time'), GRA('Height and shoe size of 20 students.', 'two'),
          ANG(50, 'Rent'), ANG(10, 'Savings')]
      },
      p2: {
        items: [GRA('How a town\'s land is used.', 'parts'), GRA('Rainfall in each province last year.', 'groups'),
          ANG(12.5, 'Bus'), ANG(62.5, 'Walk'),
          { q: 'A circle graph has a 72° part. What percent is that?', eq: ['72 ÷ 360 = [] %'], a: [20] },
          { q: '240 students. 15% walk. How many walk?', eq: ['[] students'], a: [36], calc: '15% of 240' }]
      },
      p3: {
        items: [GRA('Arm span and height of each student.', 'two'), GRA('A family\'s monthly spending by part.', 'parts'),
          { q: 'A circle graph part is 54°. What percent?', eq: ['54 ÷ 360 = [] %'], a: [15] },
          { q: 'Out of 800 people, 45% chose maple. How many?', eq: ['[] people'], a: [360], calc: '45% of 800' },
          { q: 'Parts are 30%, 25% and 20%. The rest is "other". What angle of the 360° is "other"?', eq: ['[] °'], a: [90], calc: '(100% − 30% − 25% − 20%) × 360' }]
      },
      think: {
        items: [{ q: 'Why is a scatter plot best for height and arm span?', lines: { n: 3, key: 'Each student gives a pair of values; each pair is one point, so you see the relationship.' } },
          { q: 'When would you use a line graph instead of a bar graph?', lines: { n: 2, key: 'When the data changes over time, so the points are joined in order.' } },
          GRA('The cost of a bus pass each year from 2015 to 2025.', 'time'),
          { q: 'Which graph would you put on an infographic about how students get to school? Why?', lines: { n: 2, key: 'A circle graph: the ways are parts of all the students.' } }]
      }
    },

    scatter: {
      exp: ['D1.3', 'D1.4'],
      watch: 'joining the points with a line. A scatter plot is just points: one for each pair.',
      goal: 'I can make and read a scatter plot.',
      learn: {
        show: { cap: 'one point for each student: (4, 72) is 4 hours and a mark of 72' },
        together: [AT(HRS, 3, 'What mark for 3 hours?')],
        cue: 'Across for the first value, up for the second.',
        own: [AT(HRS, 6, 'What mark for 6 hours?'), AT(HRS, 1, 'What mark for 1 hour?')]
      },
      p1: {
        show: { eq: ['(5, 76): across 5, up 76'] },
        items: [AT(HRS, 2, 'Mark for 2 hours?'), AT(HRS, 7, 'Mark for 7 hours?'),
          { q: 'Mean mark of the 7 students: 52, 60, 63, 71, 76, 84, 88.', eq: ['[] %'], a: [70.5714], calc: '(52 + 60 + 63 + 71 + 76 + 84 + 88) ÷ 7', dp: 4, wide: true },
          { q: 'Plot (1, 3), (2, 5), (3, 6), (4, 8) on a grid.', draw: { h: 90, key: 'Four points rising to the right.' }, wide: true }]
      },
      p2: {
        items: [AT(SC([[150, 38], [155, 40], [160, 41], [165, 43], [170, 44]], 180, 50, 30, 10, 'Height (cm)', 'Foot (cm)'), 165, 'Foot length at 165 cm?'),
          AT(SC([[10, 5], [20, 12], [30, 14], [40, 22], [50, 26]], 60, 30, 10, 10, 'Temp (°C)', 'Sales'), 30, 'Sales at 30 °C?'),
          { q: 'Plot these pairs: (0, 20), (2, 16), (4, 13), (6, 8), (8, 5).', draw: { h: 90, key: 'Points falling to the right.' }, wide: true }]
      },
      p3: {
        items: [AT(SC([[1, 9.5], [2, 8], [3, 6.5], [4, 6], [5, 4]], 6, 10, 1, 2, 'Weeks', 'Kg left'), 4, 'Kg left after 4 weeks?'),
          { q: 'An infographic says 18 of 24 students sleep 8 hours or more. What percent?', eq: ['[] %'], a: [75], calc: '18 ÷ 24 × 100' },
          { q: 'An infographic shows 3/8 of a class bikes. Out of 32, how many?', eq: ['[] students'], a: [12], calc: '3/8 × 32' },
          { q: 'Plan an infographic about screen time: give a title, one graph and one fact.', lines: { n: 3, key: 'For example: "Screens and sleep", a scatter plot of hours of screens and sleep, and a fact like "75% of us sleep 8 hours".' } }]
      },
      think: {
        items: [{ q: 'Why not join the points of a scatter plot?', lines: { n: 2, key: 'Each point is a separate person. Nothing happens between them.' } },
          { q: 'What makes an infographic clear?', lines: { n: 2, key: 'A clear title, one main idea per graph, labels and short facts.' } },
          AT(HRS, 4, 'What mark for 4 hours?'),
          { q: 'Write a question you could answer with a scatter plot.', lines: { n: 1, key: 'For example: do students who read more write better?' } }]
      }
    },

    direction: {
      watch: 'calling a few rising points strong. Strong means the points lie close to a line.',
      goal: 'I can describe the direction and strength of a relationship.',
      learn: {
        show: { cap: 'up to the right, close to a line', eq: ['strong positive'] },
        together: [TR(SC([[1, 9], [2, 8], [3, 6], [4, 5], [5, 3], [6, 2]], 7, 10, 1, 2, 'Price', 'Sold'), ['positive', 'negative', 'none'])],
        cue: 'Up to the right: positive. Down: negative. Close to a line: strong.',
        own: [{ q: 'Points fall to the right, close to a line. Describe the relationship.', lines: { n: 1, key: 'Strong negative.' } }]
      },
      p1: {
        show: { cap: 'rising: positive; falling: negative; scattered: none. Close to a line: strong.' },
        items: [TR(SC([[1, 2], [2, 3], [3, 5], [4, 6], [5, 8]], 6, 10, 1, 2, 'Hours', 'Pay'), ['strong positive', 'weak positive', 'none']),
          TR(SC([[1, 8], [2, 6], [3, 9], [4, 4], [5, 6], [6, 3]], 7, 10, 1, 2, 'Km', 'Time'), ['strong negative', 'weak negative', 'none']),
          TR(SC([[1, 2], [2, 5], [3, 1], [4, 6], [5, 3], [6, 6]], 7, 8, 1, 2, 'Age', 'Size'), ['strong positive', 'weak positive', 'none']),
          TR(SC([[1, 4], [2, 7], [3, 2], [4, 5], [5, 3], [6, 6]], 7, 8, 1, 2, 'Day', 'Rain'), ['positive', 'negative', 'none'])]
      },
      p2: {
        items: [TR(SC([[10, 70], [20, 60], [30, 48], [40, 40], [50, 28]], 60, 80, 10, 20, 'Speed', 'Km left'), ['strong positive', 'strong negative', 'weak negative']),
          TR(SC([[1, 3], [2, 2], [3, 5], [4, 4], [5, 7], [6, 5]], 7, 8, 1, 2, 'Practice', 'Score'), ['strong positive', 'weak positive', 'none']),
          { q: 'As outdoor temperature rises, heating bills fall. What kind of relationship is that?', lines: { n: 2, key: 'Negative: one goes up as the other goes down.' } }]
      },
      p3: {
        items: [TR(SC([[2, 9], [3, 8], [4, 8], [5, 6], [6, 5], [7, 3]], 8, 10, 1, 2, 'Age', 'Value'), ['strong negative', 'weak negative', 'none']),
          TR(SC([[1, 6], [2, 3], [3, 5], [4, 2], [5, 4], [6, 1]], 7, 8, 1, 2, 'Hour', 'Wait'), ['strong negative', 'weak negative', 'none']),
          { q: 'Give two things with a negative relationship.', lines: { n: 2, key: 'For example: the age of a car and its price; hours of screens and hours of sleep.' } }]
      },
      think: {
        items: [{ q: 'What does "no relationship" look like?', lines: { n: 2, key: 'Points scattered everywhere, with no line going up or down.' } },
          { q: '{a} says a weak relationship is no relationship. Explain.', lines: { n: 3, key: 'Weak still has a trend, the points are just spread far from a line.' } },
          TR(SC([[1, 1], [2, 2], [3, 4], [4, 5], [5, 7]], 6, 8, 1, 2, 'Laps', 'Minutes'), ['strong positive', 'weak positive', 'none']),
          { q: 'Give two things with a positive relationship.', lines: { n: 1, key: 'For example: hours worked and pay.' } }]
      }
    },

    cause: {
      exp: ['D1.5', 'D1.6'],
      watch: 'saying one thing causes the other because they rise together. A relationship is not a cause.',
      goal: 'I can spot outliers and tell a relationship from a cause.',
      learn: {
        show: { cap: 'ice cream sales and sunburns rise together: summer causes both', eq: ['not a cause'] },
        together: [ST('mean', [12, 14, 13, 15, 46])],
        cue: 'An outlier is far from the rest. Look for a third thing that causes both.',
        own: [ST('mean', [12, 14, 13, 15]), ST('median', [12, 14, 13, 15, 46])]
      },
      p1: {
        show: { eq: ['5, 6, 6, 7, 30', 'outlier: 30'] },
        items: [ST('mean', [8, 9, 10, 9, 34]), ST('mean', [8, 9, 10, 9]), ST('median', [8, 9, 10, 9, 34]), ST('range', [8, 9, 10, 9, 34]),
          { q: 'Shoe size and reading level rise together in a school. Does a big foot cause good reading?', lines: { n: 2, key: 'No. Age causes both: older students have bigger feet and read better.' } }]
      },
      p2: {
        items: [ST('mean', [70, 74, 68, 72, 21]), ST('mean', [70, 74, 68, 72]), ST('median', [70, 74, 68, 72, 21]),
          { q: 'With the outlier the mean is 61; without it, 71. How much did the outlier pull the mean down?', eq: ['[]'], a: [10], calc: '71 − 61' },
          { q: 'More firefighters at a fire, more damage. What causes both?', lines: { n: 2, key: 'A bigger fire: it brings more firefighters and does more damage.' } }]
      },
      p3: {
        items: [ST('mean', [2.5, 3, 2.8, 9.7], 2), ST('median', [2.5, 3, 2.8, 9.7]), ST('mean', [-2, -4, -3, 19]),
          { q: 'Which is changed more by an outlier, the mean or the median? Show with 4, 5, 6, 45.', lines: { n: 3, key: 'Mean 15, median 5.5. The mean moves a lot; the median barely moves.' } }]
      },
      think: {
        items: [{ q: 'What might cause an outlier?', lines: { n: 2, key: 'A mistake in measuring or writing, or a real but unusual case.' } },
          { q: 'Hot chocolate sales and snow shovel sales rise together. Explain why.', lines: { n: 3, key: 'Cold, snowy weather causes both. One does not cause the other.' } },
          ST('median', [31, 29, 33, 30, 4]),
          { q: 'When should you keep an outlier?', lines: { n: 2, key: 'When it is real data and not a mistake; say it is there.' } }]
      }
    },

    axis: {
      watch: 'reading bar heights, not the scale. A scale that starts above 0 makes small gaps look big.',
      goal: 'I can spot a graph that misleads with a cut-off axis.',
      learn: {
        show: { cap: 'from 48 up: 52 looks twice 50, but is 2 more' },
        together: [ML([60, 55], 50, 64, 2, 0, 1)],
        cue: 'Read the scale. Does it start at 0?',
        own: [{ q: 'A scale starts at 75. Bars show 90 and 80: 15 and 5 above the start. How many times as tall does 90 look?', eq: ['15 ÷ 5 = []'], a: [3] }]
      },
      p1: {
        show: { eq: ['(52 − 48) ÷ (50 − 48) = 2', 'looks 2 times as tall'] },
        items: [ML([30, 25], 20, 32, 2, 0, 1), ML([104, 102, 101], 100, 106, 2, 0, 2), { q: 'A graph starts its scale at 38. Bars show 45 and 42. How much more is 45, really?', eq: ['45 − 42 = []'], a: [3] }]
      },
      p2: {
        items: [ML([250, 230], 200, 260, 20, 0, 1), ML([7.5, 7, 6.5], 6, 8, 0.5, 0, 2),
          { q: 'Sales rose from 400 to 420. What percent increase is that?', eq: ['[] %'], a: [5], calc: '(420 − 400) ÷ 400 × 100' }]
      },
      p3: {
        items: [ML([88, 84, 82], 80, 90, 2, 0, 2), ML([1050, 1025, 1010], 1000, 1060, 20, 0, 2),
          { q: 'A graph shows marks of 72 and 75 with the scale starting at 70. How many times as tall does 75 look?', eq: ['[] times'], a: [2.5], calc: '(75 − 70) ÷ (72 − 70)' }]
      },
      think: {
        items: [{ q: 'Why might an ad cut off the axis?', lines: { n: 3, key: 'To make a small difference look big, so its product seems much better.' } },
          { q: 'How would you redraw a misleading graph?', lines: { n: 2, key: 'Start the scale at 0, with equal steps.' } },
          ML([65, 60], 55, 66, 5, 0, 1),
          { q: 'Name one other way a graph can mislead.', lines: { n: 2, key: 'For example uneven steps on the scale, or pictures of different sizes.' } }]
      }
    },

    fair: {
      exp: ['D1.6', 'D1.4'],
      watch: 'deciding from a few people or from one statistic. Check the sample and compare fair measures.',
      goal: 'I can make fair conclusions from data.',
      learn: {
        show: { cap: 'compare means of groups of different sizes', eq: ['mean = total ÷ count'] },
        together: [ST('mean', [15, 18, 21])],
        cue: 'Is the sample big and fair? Compare means, not totals.',
        own: [ST('mean', [14, 16, 17, 20, 23]), { q: 'Group 1: 15, 18, 21. Group 2 has 5 values: 14, 16, 17, 20, 23. Write the greater mean.', eq: ['[]'], a: [18], calc: '(14 + 16 + 17 + 20 + 23) ÷ 5', wide: true }]
      },
      p1: {
        show: { eq: ['Class A: 120 books, 20 students', 'mean 6 each'] },
        items: [{ q: 'Class A read 120 books with 20 students. Mean per student?', eq: ['[] books'], a: [6], calc: '120 ÷ 20' },
          { q: 'Class B read 150 books with 30 students. Mean per student?', eq: ['[] books'], a: [5], calc: '150 ÷ 30' },
          { q: 'A: 120 books, 20 students. B: 150 books, 30 students. Which read more per student?', pick: { opts: ['A', 'B'], ans: 0, more: ['120 ÷ 20', '150 ÷ 30'] } },
          ST('mean', [3, 5, 4, 8, 6, 4]), ST('median', [3, 5, 4, 8, 6, 4])]
      },
      p2: {
        items: [{ q: '18 of 24 students in one class like art. What percent?', eq: ['[] %'], a: [75], calc: '18 ÷ 24 × 100' },
          { q: '{a} asked 5 friends and 4 liked a movie. What percent?', eq: ['[] %'], a: [80], calc: '4 ÷ 5 × 100' },
          { q: 'Is 5 friends a fair sample for the whole school? Explain.', lines: { n: 2, key: 'No. It is small, and friends may like the same things.' } },
          ST('mean', [72, 85, 64, 91, 78])]
      },
      p3: {
        items: [{ q: 'Team A scored 84 points in 12 games. Team B scored 70 in 10. Mean per game of the better team?', eq: ['[] points'], a: [7], calc: '84 ÷ 12' },
          { q: 'A survey of 400 people: 28% walk to work. How many walk?', eq: ['[] people'], a: [112], calc: '28% of 400' },
          { q: 'A headline says "Most people hate snow!" after asking 10 people at a beach. What is wrong?', lines: { n: 3, key: 'The sample is small and biased: people at a beach likely prefer warm weather.' } }]
      },
      think: {
        items: [{ q: 'Why compare means, not totals, for groups of different sizes?', lines: { n: 3, key: 'A bigger group gets a bigger total even if each person does less. The mean is per person.' } },
          { q: 'Name one thing that makes a sample fair.', lines: { n: 2, key: 'It is big enough and chosen at random from the whole group.' } },
          ST('mean', [6.5, 7, 8, 7.5]),
          { q: 'Write one fair conclusion from: 40 of 50 students walk to school.', lines: { n: 2, key: 'For example: 80% of the students asked walk to school.' } }]
      }
    },

    trace: {
      exp: ['C3.1', 'C3.2'],
      watch: 'skipping a turn of the loop. Write the value after every turn.',
      goal: 'I can trace code that works with data.',
      learn: {
        show: { cap: 'data = 4, 7, 5: add each, then divide by 3', eq: ['(4 + 7 + 5) ÷ 3 ≈ 5.33'] },
        together: [CD(['data = 6, 8, 10', 'total = 0', 'for each n in data', '  total = total + n', 'show total'], 24, '6 + 8 + 10')],
        cue: 'Keep a table: the value of each variable after every turn.',
        own: [CD(['data = 3, 9, 6', 'total = 0', 'for each n in data', '  total = total + n', 'show total ÷ 3'], 6, '(3 + 9 + 6) ÷ 3'),
          CD(['data = 12, 5, 18, 9', 'count = 0', 'for each n in data', '  if n > 10', '    count = count + 1', 'show count'], 2, '1 + 1')]
      },
      p1: {
        show: { eq: ['turns: total = 6, 14, 24'] },
        items: [CD(['data = 2, 4, 6, 8', 'total = 0', 'for each n in data', '  total = total + n', 'show total'], 20, '2 + 4 + 6 + 8'),
          CD(['data = 15, 22, 9, 30', 'count = 0', 'for each n in data', '  if n > 20', '    count = count + 1', 'show count'], 2, '1 + 1'),
          CD(['data = 5, 3, 8', 'biggest = 0', 'for each n in data', '  if n > biggest', '    biggest = n', 'show biggest'], 8, '8'),
          CD(['x = 1', 'repeat 4 times', '  x = x × 3', 'show x'], 81, '1 × 3 × 3 × 3 × 3')]
      },
      p2: {
        items: [CD(['data = 1.5, 2.5, 5', 'total = 0', 'for each n in data', '  total = total + n', 'show total ÷ 3'], 3, '(1.5 + 2.5 + 5) ÷ 3'),
          CD(['data = −3, 5, −8, 2', 'total = 0', 'for each n in data', '  if n < 0', '    total = total + n', 'show total'], -11, '−3 + (−8)'),
          CD(['data = 64, 81, 70, 95, 58', 'pass = 0', 'for each n in data', '  if n ≥ 60', '    pass = pass + 1', 'show pass'], 4, '1 + 1 + 1 + 1'),
          CD(['money = 100', 'repeat 3 times', '  money = money × 1.1', 'show money'], 133.1, '100 × 1.1 × 1.1 × 1.1')]
      },
      p3: {
        items: [CD(['data = 4, 9, 2, 7', 'small = 100', 'for each n in data', '  if n < small', '    small = n', 'show small'], 2, '2'),
          CD(['data = 12, 15, 9, 20', 'total = 0', 'for each n in data', '  total = total + n', 'mean = total ÷ 4', 'show 20 − mean'], 6, '20 − (12 + 15 + 9 + 20) ÷ 4'),
          CD(['temp = −12', 'repeat 5 times', '  temp = temp + 3', 'show temp'], 3, '−12 + 5 × 3'),
          { q: 'The code above starts at −12 °C and adds 3 each turn. Change it to repeat 8 times. What does it show?', eq: ['[] °C'], a: [12], calc: '−12 + 8 × 3' }]
      },
      think: {
        items: [{ q: 'Write code that counts how many marks are 80 or more.', lines: { n: 4, key: 'count = 0; for each n in marks: if n ≥ 80, count = count + 1; show count.' } },
          { q: 'Why does a program help with 1000 data values?', lines: { n: 2, key: 'It does the same steps for every value quickly, with no mistakes from tiredness.' } },
          CD(['data = 8, 3, 6', 'total = 0', 'for each n in data', '  total = total + n × n', 'show total'], 109, '8 × 8 + 3 × 3 + 6 × 6'),
          { q: 'How would you use code to choose the best of three phone plans?', lines: { n: 2, key: 'Work out each plan\'s cost for my use, keep the smallest, and show which plan it is.' } }]
      }
    },

    efficient: {
      watch: 'thinking a longer program is better. Fewer steps that give the same result are more efficient.',
      goal: 'I can change code to make it more efficient, and say how the result changes.',
      learn: {
        show: { cap: 'a loop replaces repeated lines', eq: ['add 5 four times = 4 × 5'] },
        together: [CD(['total = 0', 'repeat 4 times', '  total = total + 5', 'show total'], 20, '4 × 5')],
        cue: 'Same result, fewer steps: more efficient.',
        own: [{ q: 'A program adds 7 one hundred times. Write one step that gives the same total.', eq: ['100 × 7 = []'], a: [700] },
          { q: 'How many times does the loop run for data of 25 values?', eq: ['[] times'], a: [25], calc: '25' }]
      },
      p1: {
        show: { eq: ['repeat 50 times: total + 2', '= 50 × 2 = 100'] },
        items: [CD(['total = 10', 'repeat 6 times', '  total = total + 4', 'show total'], 34, '10 + 6 × 4'),
          { q: 'The code above starts at 10 and adds 4 each time. Change it to repeat 9 times. What is shown now?', eq: ['[]'], a: [46], calc: '10 + 9 × 4' },
          CD(['total = 0', 'repeat 12 times', '  total = total + 2.5', 'show total'], 30, '12 × 2.5'),
          { q: 'A program checks each of 40 values 2 times. How many checks?', eq: ['[] checks'], a: [80], calc: '40 × 2' }]
      },
      p2: {
        items: [CD(['total = 1000', 'repeat 8 times', '  total = total − 75', 'show total'], 400, '1000 − 8 × 75'),
          { q: 'Program A checks all 200 names. Program B stops at the match, found at name 35. How many fewer checks does B make?', eq: ['[] fewer'], a: [165], calc: '200 − 35', wide: true },
          { q: 'Two loops each run 30 times. Joined into one loop, how many turns are saved?', eq: ['[] turns'], a: [30], calc: '30 + 30 − 30' }]
      },
      p3: {
        items: [CD(['x = 2', 'repeat 5 times', '  x = x × 2', 'show x'], 64, '2 × 2 × 2 × 2 × 2 × 2'),
          { q: 'Write one step that gives the same as the code above, using an exponent.', eq: ['2^6 = []'], a: [64] },
          { q: 'A program runs 0.002 seconds per value. How long for 15 000 values?', eq: ['[] seconds'], a: [30], calc: '0.002 × 15000' },
          { q: 'At 0.002 seconds a value, skipping empty values cut 15 000 values to 12 000. How many seconds are saved?', eq: ['[] seconds'], a: [6], calc: '0.002 × (15000 − 12000)' }]
      },
      think: {
        items: [{ q: 'What makes code efficient?', lines: { n: 2, key: 'It gives the right result in fewer steps, without repeated lines.' } },
          { q: '{a} changed a loop from "n > 10" to "n ≥ 10". How can the result change?', lines: { n: 3, key: 'Values equal to 10 are now counted too, so the count can go up.' } },
          CD(['total = 0', 'repeat 7 times', '  total = total + 15', 'show total'], 105, '7 × 15'),
          { q: 'Why test code with a small set of data first?', lines: { n: 2, key: 'You can check the answer by hand and catch mistakes before using lots of data.' } }]
      }
    }

  } });
})();
