/* Grade 7 Data and Probability: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/data-probability.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: D1.1 percents to compare groups; D1.2 qualitative, discrete and continuous data; D1.3 circle graphs and
   choosing a graph; D1.4 infographics; D1.5 mean, median and mode, and what an outlier does; D1.6 misleading graphs;
   D2.1 and D2.2 the probability of two independent or dependent events. The answer checks are in tests/verify/sheets.js:
   a circle graph's slices are its own percents, a statistic is worked out again from the data in the question, two
   events are read from their grid of outcomes, and a bag is counted again after each draw. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var KINDS = ['qualitative', 'discrete', 'continuous'];
  /* what kind of data: words, counted or measured */
  function DK(q, k) { var o = {}; o[k] = true; return { q: q, pick: { opts: KINDS, ans: ['words', 'counted', 'measured'].indexOf(k), dkind: o }, wide: true }; }
  /* a part of a group as a percent */
  function PG(part, all) { return { eq: [part + ' ÷ ' + all + ' = [] %'], a: [Math.round(part / all * 1e6) / 1e4], wide: String(part).length + String(all).length > 6 }; }
  /* a circle graph, and a count or an angle from one slice */
  function PIE(cats, vals, title) { return ['pie', { cats: cats, vals: vals, title: title }]; }
  function CNT(pie, cat, total) { var v = pie[1].vals[pie[1].cats.indexOf(cat)]; return { q: total + ' people. How many chose ' + cat + '?', pic: pie, eq: [total + ' × ' + v + '% = []'], a: [total * v / 100] }; }
  function ANG(p) { return { eq: [p + '% × 360 = [] °'], a: [p * 3.6] }; }
  /* a statistic of some data */
  function ST(data, stat, unit) { return { q: 'Data: ' + data.join(', '), eq: [stat.charAt(0).toUpperCase() + stat.slice(1) + ': []' + (unit ? ' ' + unit : '')], a: [stat === 'mean' ? data.reduce(function (x, y) { return x + y; }, 0) / data.length : stat === 'range' ? Math.max.apply(null, data) - Math.min.apply(null, data) : med(data)], data: data, stat: stat }; }
  function med(d) { var s = d.slice().sort(function (x, y) { return x - y; }), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  /* which graph fits */
  function GG(q, g) { var o = {}; o[g] = true; var opts = ['bar graph', 'double bar graph', 'line graph', 'circle graph']; return { q: q, pick: { opts: opts, ans: { cats: 0, two: 1, time: 2, parts: 3 }[g], graph: o }, wide: true }; }
  /* independent or dependent */
  function ID(q, how) { var o = {}; if (how) o[how] = true; return { q: q, pick: { opts: ['independent', 'dependent'], ans: how ? 0 : 1, indep: o }, wide: true }; }
  /* two events from a grid of outcomes: the chance of one outcome of each */
  function TWO(a, b, pa, pb) { return { pic: ['outs', { a: a, b: b, ta: 'coin', tb: 'number cube' }], q: 'P(' + pa.join(' or ') + ' and ' + pb.join(' or ') + ')', eq: ['[]'], a: [frac(pa.length * pb.length, a.length * b.length)], two: [pa, pb] }; }
  function frac(n, d) { var g = gcd(n, d); return n / g + '/' + d / g; }
  function gcd(x, y) { return y ? gcd(y, x % y) : x; }

  S.register('data-probability', { code: 'DP', ideas: {

    kinds: {
      watch: 'calling any number data "continuous". Number of siblings is a number, but it is counted, so it is discrete.',
      goal: 'I can tell qualitative, discrete and continuous data apart.',
      learn: {
        show: { cap: 'words: qualitative · counted: discrete · measured: continuous' },
        together: [DK('Favourite season', 'words'), DK('Number of siblings', 'counted')],
        cue: 'Words, counted or measured?',
        own: [DK('Time to run 100 m', 'measured'), DK('Goals scored in a game', 'counted')]
      },
      p1: {
        show: { cap: 'mass of a backpack: measured', eq: ['continuous'] },
        items: [DK('Mass of a pumpkin', 'measured'), DK('Number of books read', 'counted'), DK('Language spoken at home', 'words'),
          DK('Temperature at noon', 'measured'), DK('Cars in a parking lot', 'counted')]
      },
      p2: {
        items: [DK('Length of a snake', 'measured'), DK('Number of letters in a name', 'counted'), DK('Province of birth', 'words'),
          DK('Time spent on homework', 'measured'), DK('Students on each bus', 'counted')]
      },
      p3: {
        items: [DK('Litres of water used in a day', 'measured'), DK('Number of canoes rented', 'counted'), DK('Kind of tree in a park', 'words'),
          DK('Distance thrown in a ball toss', 'measured'), DK('Shoe size', 'counted')]
      },
      think: {
        items: [{ q: '{b} says number of siblings is continuous because it is a number. What went wrong?', lines: { n: 3, key: 'Siblings are counted in whole numbers, so the data is discrete.' } },
          { q: 'Write one survey question for each kind of data.', lines: { n: 3, key: 'For example: favourite fruit (qualitative), number of pets (discrete), arm span in cm (continuous).' } },
          DK('Height of a sunflower', 'measured')]
      }
    },

    percent: {
      watch: 'comparing the counts (150 > 90) when the groups are different sizes. Change both to percents first.',
      goal: 'I can compare groups of different sizes with percents.',
      learn: {
        show: { cap: 'School A: 90 of 150 walk. School B: 150 of 300 walk.', eq: ['90 ÷ 150 = 60%', '150 ÷ 300 = 50%'] },
        together: [PG(45, 60), PG(120, 400)],
        cue: 'Part ÷ whole, then × 100.',
        own: [PG(18, 24), PG(210, 300), PG(33, 50)]
      },
      p1: {
        show: { eq: ['36 of 48 = 36 ÷ 48 = 75%'] },
        items: [PG(27, 30), PG(14, 40), PG(150, 250), PG(9, 12), PG(63, 90), PG(240, 800)]
      },
      p2: {
        items: [{ q: 'Which class has more who bike? A: 12 of 20. B: 15 of 30.', pick: { opts: ['A', 'B'], ans: 0, more: ['12 / 20', '15 / 30'] }, wide: true },
          { q: 'Which team won more of its games? A: 18 of 24. B: 21 of 30.', pick: { opts: ['A', 'B'], ans: 0, more: ['18 / 24', '21 / 30'] }, wide: true },
          { q: 'Which town recycles more? A: 360 of 600 homes. B: 520 of 800 homes.', pick: { opts: ['A', 'B'], ans: 1, more: ['360 / 600', '520 / 800'] }, wide: true },
          PG(52, 80), PG(330, 1200)]
      },
      p3: {
        items: [{ q: 'A survey of 1 200 Ontario teens: 780 play a sport. What percent?', eq: ['[]'], a: ['65%'], calc: '780 / 1200' },
          { q: 'In a sample of 250 students, 40% walk. How many walk?', eq: ['[] students'], a: [100], calc: '250 × 40%' },
          { q: 'Which camp has more who canoe? A: 45 of 75. B: 64 of 100.', pick: { opts: ['A', 'B'], ans: 1, more: ['45 / 75', '64 / 100'] }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says School A has more walkers because 150 is more than 90. What else should {a} check?', lines: { n: 3, key: 'The size of each school. Compare percents: 90 of 150 is 60%, 150 of 300 is 50%.' } },
          { q: 'Why do large surveys report percents?', lines: { n: 3, key: 'Percents compare groups of different sizes fairly, out of 100.' } },
          PG(84, 120)]
      }
    },

    slices: {
      watch: 'using a circle graph for data that is not parts of one whole. The slices must add to 100%.',
      goal: 'I can read a circle graph.',
      learn: {
        show: { pic: PIE(['Soccer', 'Hockey', 'Swim', 'Other'], [40, 30, 20, 10], 'Favourite sport'), cap: 'the slices add to 100%' },
        together: [CNT(PIE(['Walk', 'Bus', 'Car'], [50, 30, 20], 'How we get to school'), 'Bus', 200), { q: 'Same graph: how many chose Walk?', eq: ['200 × 50% = []'], a: [100] }],
        cue: 'Total × percent.',
        own: [{ q: '80 people: 35% have a dog. How many?', eq: ['80 × 35% = []'], a: [28] }, { q: '80 people: 15% have a fish. How many?', eq: ['80 × 15% = []'], a: [12] }]
      },
      p1: {
        show: { cap: '25% of 120 people', eq: ['120 × 25% = 30'] },
        items: [CNT(PIE(['Apple', 'Pear', 'Plum', 'Grape'], [45, 25, 20, 10], 'Favourite fruit'), 'Apple', 60), CNT(PIE(['Read', 'Sport', 'Music'], [40, 35, 25], 'After school'), 'Sport', 300),
          { q: 'Fruit graph: how many chose Grape?', eq: ['60 × 10% = []'], a: [6] }, { q: 'After school graph: how many chose Music?', eq: ['300 × 25% = []'], a: [75] }]
      },
      p2: {
        items: [{ q: 'How many more chose Soccer than Swim?', pic: PIE(['Soccer', 'Hockey', 'Swim', 'Other'], [40, 30, 20, 10], 'Favourite sport'), eq: ['Soccer − Swim = [] percent'], a: [20] },
          { q: 'What percent chose Hockey or Other?', pic: PIE(['Soccer', 'Hockey', 'Swim', 'Other'], [40, 30, 20, 10], 'Favourite sport'), eq: ['Hockey + Other = [] percent'], a: [40] },
          { q: 'The slices are 45%, 30% and ?%. What is the missing slice?', eq: ['100% − 45% − 30% = [] %'], a: [25], wide: true },
          { q: 'Can a circle graph show 50%, 30% and 30%? Add them.', eq: ['50% + 30% + 30% = [] %'], a: [110], wide: true }]
      },
      p3: {
        items: [CNT(PIE(['Maple', 'Oak', 'Pine', 'Birch'], [35, 25, 30, 10], 'Trees in a park'), 'Pine', 240), CNT(PIE(['Maple', 'Oak', 'Pine', 'Birch'], [35, 25, 30, 10], 'Trees in a park'), 'Birch', 240),
          GG('How a budget is spent', 'parts')]
      },
      think: {
        items: [{ q: '{b} drew a circle graph of the temperature each month. What went wrong?', lines: { n: 3, key: 'Temperatures are not parts of one whole. A line graph shows change over time.' } },
          { q: 'Why must the slices add to 100%?', lines: { n: 2, key: 'Together they are the whole group.' } },
          CNT(PIE(['Yes', 'No', 'Unsure'], [55, 30, 15], 'Should recess be longer?'), 'Yes', 400)]
      }
    },

    angles: {
      watch: 'using the percent as the angle: a 40% slice drawn as 40°. Multiply by 360.',
      goal: 'I can work out the angle of each slice.',
      learn: {
        show: { cap: '40% of the circle', eq: ['40% × 360 = 144°'] },
        together: [ANG(25), ANG(50)],
        cue: 'Angle = percent × 360°.',
        own: [ANG(10), ANG(75), ANG(30)]
      },
      p1: {
        show: { eq: ['20% × 360 = 72°'] },
        items: [ANG(5), ANG(15), ANG(20), ANG(35), ANG(45), ANG(60), ANG(80), ANG(12.5)]
      },
      p2: {
        items: [{ q: '30 of 120 students chose blue.', eq: ['30 ÷ 120 = [] %', '[] % × 360 = [] °'], a: [25, 25, 90], wide: true },
          { q: '18 of 60 students chose green.', eq: ['18 ÷ 60 = [] %', '[] % × 360 = [] °'], a: [30, 30, 108], wide: true },
          { q: '9 of 36 students chose red.', eq: ['9 ÷ 36 = [] %', '[] % × 360 = [] °'], a: [25, 25, 90], wide: true }]
      },
      p3: {
        items: [{ q: 'A slice is 90°. What percent is it?', eq: ['90 ÷ 360 = [] %'], a: [25] },
          { q: 'A slice is 54°. What percent is it?', eq: ['54 ÷ 360 = [] %'], a: [15] },
          { q: 'Three slices are 120°, 90° and ?. Find the missing angle.', eq: ['360 − 120 − 90 = [] °'], a: [150], wide: true },
          ANG(2.5)]
      },
      think: {
        items: [{ q: '{a} drew a 40% slice as a 40° angle. What went wrong?', lines: { n: 3, key: 'The whole circle is 360°, so 40% is 0.4 × 360 = 144°.' } },
          { q: 'Why do all the angles of a circle graph add to 360°?', lines: { n: 2, key: 'The slices together make the whole circle, which turns 360°.' } },
          ANG(65)]
      }
    },

    choose: {
      watch: 'picking a graph by looks. Ask what the data is: categories, parts of a whole, or change over time?',
      goal: 'I can choose the right graph for the data.',
      learn: {
        show: { cap: 'parts of one whole', eq: ['circle graph'] },
        together: [GG('How a family spends its money each month', 'parts'), GG('A puppy\'s mass each week', 'time')],
        cue: 'What is the data: categories, parts of a whole, or change over time?',
        own: [GG('Favourite fruit of boys and of girls', 'two'), GG('Number of each kind of tree in a park', 'cats')]
      },
      p1: {
        show: { cap: 'every graph needs', eq: ['title, labels, scale', 'and a source'] },
        items: [GG('Temperature in Iqaluit each month', 'time'), GG('How a day is spent: sleep, school, play', 'parts'),
          GG('Medals won by four countries', 'cats'), GG('Books read by Grade 6 and Grade 7 each term', 'two')]
      },
      p2: {
        items: [GG('Height of a bean plant each day', 'time'), GG('Kinds of litter found in a cleanup, as parts of the total', 'parts'),
          GG('Votes for each of five class names', 'cats'), GG('Goals scored at home and away by each team', 'two')]
      },
      p3: {
        items: [GG('The population of Ontario every 10 years', 'time'), GG('What percent of a budget goes to food, rent and fun', 'parts'),
          { q: 'A graph has no title and no labels. Name two things to add.', lines: { n: 2, key: 'A title, labels on each axis, a scale, a source.' } }]
      },
      think: {
        items: [{ q: '{b} used a circle graph for the temperature each month. Which graph is better? Why?', lines: { n: 3, key: 'A line graph: the data is change over time, not parts of a whole.' } },
          { q: 'Why does a graph need a source?', lines: { n: 2, key: 'So readers can tell where the data came from and whether to trust it.' } },
          GG('Number of each kind of bird seen at a feeder', 'cats')]
      }
    },

    info: {
      watch: 'leaving out the source or the sample size, so readers cannot judge the data.',
      goal: 'I can read and plan an infographic.',
      learn: {
        show: { pic: PIE(['Walk', 'Bus', 'Car', 'Bike'], [45, 30, 15, 10], 'How 400 students get to school'), cap: 'headline: almost half walk' },
        together: [CNT(PIE(['Walk', 'Bus', 'Car', 'Bike'], [45, 30, 15, 10], 'How 400 students get to school'), 'Walk', 400),
          { q: 'Write a headline for the graph above.', lines: { n: 2, key: 'For example: Almost half of students walk to school.' } }],
        cue: 'Question, headline number, displays, source.',
        own: [{ q: 'How many bike?', eq: ['400 × 10% = []'], a: [40] },
          { q: 'What else should the infographic show?', lines: { n: 2, key: 'The source and the sample size (400 students).' } }]
      },
      p1: {
        show: { cap: 'question, headline, 2 or 3 displays, source' },
        items: [{ q: 'Plan an infographic about how your class gets to school. What is your question?', lines: { n: 2, key: 'For example: How do students in our class get to school?' } },
          { q: 'Which two displays would you use? Why?', lines: { n: 3, key: 'For example a circle graph for parts of the class and a bar graph for each way.' } },
          { q: 'What headline number would you put at the top?', lines: { n: 2, key: 'The biggest or most surprising percent, such as 45% walk.' } }]
      },
      p2: {
        items: [CNT(PIE(['Paper', 'Plastic', 'Food', 'Other'], [40, 25, 25, 10], 'Waste from 200 homes (kg)'), 'Paper', 200),
          { q: 'Write a headline for the waste graph.', lines: { n: 2, key: 'For example: Paper is 40% of household waste.' } },
          { q: 'What information is missing to trust this graph?', lines: { n: 2, key: 'The source, and when the data was collected.' } }]
      },
      p3: {
        items: [{ q: 'An infographic says "Most teens love hockey!" but shows no sample size. Why is that a problem?', lines: { n: 3, key: 'We cannot tell how many teens were asked. A small sample may not be typical.' } },
          { q: 'Sketch the layout of an infographic about screen time.', draw: { h: 140, key: 'A title, a headline number, two displays such as a bar graph and a circle graph, and the source.' } }]
      },
      think: {
        items: [{ q: 'Why does an infographic use pictures and graphs instead of a table?', lines: { n: 3, key: 'Readers see the story quickly. The headline and displays show what matters.' } },
          { q: 'Name three things every infographic needs.', lines: { n: 2, key: 'A clear question or title, the data in displays, and the source.' } }]
      }
    },

    mmm: {
      watch: 'finding the median without putting the data in order first.',
      goal: 'I can find the mean, median and mode.',
      learn: {
        show: { cap: '4, 7, 7, 9, 13', eq: ['mean: 40 ÷ 5 = 8', 'median: 7', 'mode: 7'] },
        together: [ST([6, 2, 9, 3, 5], 'mean'), ST([6, 2, 9, 3, 5], 'median')],
        cue: 'Put the data in order first.',
        own: [ST([12, 8, 15, 9], 'mean'), ST([12, 8, 15, 9], 'median'), ST([3, 8, 1, 4, 9], 'range')]
      },
      p1: {
        show: { cap: '2, 5, 8, 9: two middle numbers', eq: ['(5 + 8) ÷ 2 = 6.5'] },
        items: [ST([7, 3, 8, 6, 6], 'mean'), ST([7, 3, 8, 6, 6], 'median'), ST([14, 20, 11, 17], 'mean'), ST([14, 20, 11, 17], 'median'),
          ST([5, 9, 5, 2, 4], 'range'), { q: '4, 6, 6, 8, 6, 3', eq: ['Mode: []'], a: [6], data: [4, 6, 6, 8, 6, 3], stat: 'mode' }]
      },
      p2: {
        items: [ST([2.5, 3, 4.5, 2], 'mean'), ST([1.2, 3.4, 2.6, 1.8, 2.5], 'median'), ST([45, 52, 38, 61, 49, 55], 'mean'), ST([45, 52, 38, 61, 49, 55], 'median'),
          ST([120, 95, 140, 110], 'mean'), ST([120, 95, 140, 110], 'range')]
      },
      p3: {
        items: [{ q: 'Quiz marks: 7, 9, 6, 8, 10. What is the mean mark?', eq: ['[]'], a: [8], data: [7, 9, 6, 8, 10], stat: 'mean' },
          { q: 'Heights (cm): 152, 148, 160, 155, 145, 158. Median?', eq: ['[] cm'], a: [153.5], data: [152, 148, 160, 155, 145, 158], stat: 'median' },
          { q: 'The mean of 4 numbers is 9. Three are 6, 8 and 12. What is the fourth?', eq: ['[]'], a: [10], calc: '4 × 9 − 6 − 8 − 12', wide: true }]
      },
      think: {
        items: [{ q: '{b} said the median of 6, 2, 9, 3, 5 is 9, the middle number. What went wrong?', lines: { n: 3, key: 'Put the data in order first: 2, 3, 5, 6, 9. The median is 5.' } },
          { q: 'Make a set of 5 numbers with mean 6 and median 5.', lines: { n: 2, key: 'For example 2, 4, 5, 9, 10.' } },
          ST([18, 22, 25, 19, 21], 'mean')]
      }
    },

    outlier: {
      watch: 'always reporting the mean, even when one extreme value makes it misleading.',
      goal: 'I can see what an outlier does to the mean and median.',
      learn: {
        show: { cap: '4, 5, 5, 6, 30', eq: ['mean 10, median 5', 'the 30 pulls the mean up'] },
        together: [ST([3, 4, 4, 5, 34], 'mean'), ST([3, 4, 4, 5, 34], 'median')],
        cue: 'An outlier moves the mean much more than the median.',
        own: [ST([20, 22, 21, 23, 89], 'mean'), ST([20, 22, 21, 23, 89], 'median')]
      },
      p1: {
        show: { eq: ['10, 12, 14: mean 12', '10, 12, 14, 60: mean 24'] },
        items: [ST([6, 8, 10], 'mean'), ST([6, 8, 10, 40], 'mean'), ST([6, 8, 10], 'median'), ST([6, 8, 10, 40], 'median'),
          ST([15, 18, 12, 95], 'mean'), ST([15, 18, 12, 95], 'median')]
      },
      p2: {
        items: [{ q: 'Wages ($): 15, 16, 16, 17, 96. Which is the better typical value? Why?', lines: { n: 2, key: 'The median, $16. The $96 pulls the mean up to $32.' } },
          ST([15, 16, 16, 17, 96], 'mean'), ST([15, 16, 16, 17, 96], 'median'),
          ST([2, 41, 44, 45, 48], 'mean'), ST([2, 41, 44, 45, 48], 'median')]
      },
      p3: {
        items: [{ q: 'Five houses sold for $400 000, $420 000, $410 000, $430 000 and $2 400 000. Mean?', eq: ['$ []'], a: [812000], data: [400000, 420000, 410000, 430000, 2400000], stat: 'mean', wide: true },
          { q: 'Houses sold for $400 000, $420 000, $410 000, $430 000 and $2 400 000. Median?', eq: ['$ []'], a: [420000], data: [400000, 420000, 410000, 430000, 2400000], stat: 'median', q2: true, wide: true },
          { q: 'Which better describes a typical house price?', lines: { n: 2, key: 'The median, $420 000. The one $2 400 000 house pulls the mean up.' } }]
      },
      think: {
        items: [{ q: 'A store says its "average" wage is $40 an hour. Most workers earn $16. How can both be true?', lines: { n: 3, key: 'A few very high wages (an outlier) pull the mean up. The median would be about $16.' } },
          { q: 'When is the mean a good typical value?', lines: { n: 2, key: 'When there are no outliers, so the data is spread evenly.' } },
          ST([7, 8, 9, 8, 48], 'median')]
      }
    },

    axis: {
      watch: 'judging by bar heights alone without checking where the axis starts.',
      goal: 'I can spot a graph that misleads.',
      learn: {
        show: { cap: 'axis starts at 30: B looks 3 times as tall', eq: ['60 ÷ 40 = 1.5'] },
        together: [{ q: 'How many times as tall does B look?', pic: ['dbar', { cats: ['A', 'B'], sets: [[50, 75]], min: 40, max: 80, step: 10, title: 'Sales' }], eq: ['[] times'], a: [3.5], looks: [1, 0] },
          { q: 'How many times as many is B, really?', eq: ['75 ÷ 50 = []'], a: [1.5] }],
        cue: 'Read the scale before you trust the picture.',
        own: [{ q: 'How many times as tall does B look?', pic: ['dbar', { cats: ['A', 'B'], sets: [[22, 26]], min: 20, max: 26, step: 2, title: 'Points' }], eq: ['[] times'], a: [3], looks: [1, 0] }]
      },
      p1: {
        show: { eq: ['the axis starts at 30, not 0'] },
        items: [{ q: 'B looks how many times as tall as A?', pic: ['dbar', { cats: ['A', 'B'], sets: [[80, 100]], min: 70, max: 100, step: 10, title: 'Marks' }], eq: ['[] times'], a: [3], looks: [1, 0] },
          { q: 'How many times as many, really?', eq: ['100 ÷ 80 = []'], a: [1.25] },
          { q: 'B looks how many times as tall as A?', pic: ['dbar', { cats: ['A', 'B'], sets: [[40, 50]], min: 35, max: 50, step: 5, title: 'Visitors' }], eq: ['[] times'], a: [3], looks: [1, 0] },
          { q: 'How many times as many, really?', eq: ['50 ÷ 40 = []'], a: [1.25] }]
      },
      p2: {
        items: [{ q: 'A company says "Sales tripled!" The graph starts at 50 and shows 52 and 56. Is it fair?', lines: { n: 3, key: 'No. The axis does not start at 0. Sales went up from 52 to 56, about 8%, not triple.' } },
          { q: 'A survey of 10 people says "80% love our app." What should you ask?', lines: { n: 3, key: 'Who was asked and how many. 10 people is a small sample, and they may be chosen by the company.' } },
          { q: 'Name two ways a graph can mislead.', lines: { n: 2, key: 'An axis that does not start at 0, uneven scales, pictures of different sizes, or a tiny sample.' } }]
      },
      p3: {
        items: [{ q: 'Redraw the sales graph so it is fair.', draw: { h: 140, key: 'A bar graph with the axis starting at 0: bars for 52 and 56 almost the same height.' } },
          { q: 'Who might want the graph to look like sales tripled? Why?', lines: { n: 3, key: 'The company, to make its sales look better to buyers.' } }]
      },
      think: {
        items: [{ q: '{b} says B is three times A because its bar is three times as tall. What went wrong?', lines: { n: 3, key: 'The axis starts above 0. Read the numbers: B is only a little more than A.' } },
          { q: 'Why does it matter who collected the data?', lines: { n: 3, key: 'People may choose data or graphs that help their side.' } }]
      }
    },

    indep: {
      watch: 'adding the probabilities (1/2 + 1/6). Both events together is less likely than either one, so multiply.',
      goal: 'I can find the probability of two independent events.',
      learn: {
        show: { pic: ['outs', { a: ['H', 'T'], b: [1, 2, 3, 4, 5, 6], ta: 'coin', tb: 'number cube' }], cap: '12 outcomes', eq: ['P(H and 6) = 1/2 × 1/6 = 1/12'] },
        together: [TWO(['H', 'T'], [1, 2, 3, 4, 5, 6], ['T'], [3]), TWO(['H', 'T'], [1, 2, 3, 4, 5, 6], ['H'], [2, 4, 6])],
        cue: 'Multiply the probabilities.',
        own: [{ eq: ['1/2 × 1/6 = []'], a: ['1/12'] }, { eq: ['1/2 × 1/3 = []'], a: ['1/6'] }, { eq: ['1/2 × 1/2 = []'], a: ['1/4'] }]
      },
      p1: {
        show: { eq: ['P(H) × P(4) = 1/2 × 1/6 = 1/12'] },
        items: [{ eq: ['1/2 × 1/4 = []'], a: ['1/8'] }, { eq: ['1/3 × 1/2 = []'], a: ['1/6'] }, { eq: ['1/6 × 1/6 = []'], a: ['1/36'] }, { eq: ['2/5 × 1/2 = []'], a: ['1/5'] },
          ID('Flip a coin and roll a number cube.', 'separate'), ID('Pick a marble, put it back, pick again.', 'back')]
      },
      p2: {
        items: [TWO(['H', 'T'], [1, 2, 3, 4, 5, 6], ['H'], [1, 2]), TWO(['H', 'T'], [1, 2, 3, 4, 5, 6], ['H', 'T'], [6]),
          { eq: ['3/4 × 2/3 = []'], a: ['1/2'] }, { eq: ['1/5 × 1/5 = []'], a: ['1/25'] },
          ID('Pick a card, keep it, pick another.', null), ID('Spin a spinner, then roll a number cube.', 'separate')]
      },
      p3: {
        items: [{ q: 'A spinner is 1/4 red. You spin twice. P(red, then red)?', eq: ['1/4 × 1/4 = []'], a: ['1/16'] },
          { q: 'P(rain today) = 3/10. A coin lands heads. P(rain and heads)?', eq: ['3/10 × 1/2 = []'], a: ['3/20'], wide: true },
          { q: 'Which is more likely: H and 6 (1/2 × 1/6), or just H (1/2)?', pick: { opts: ['H and 6', 'just H'], ans: 1, more: ['1/2 × 1/6', '1/2'] }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says P(H and 6) = 1/2 + 1/6 = 2/3. What went wrong?', lines: { n: 3, key: 'Both happening is less likely than either one. Multiply: 1/2 × 1/6 = 1/12.' } },
          { q: 'Why are a coin flip and a number cube independent?', lines: { n: 2, key: 'The coin cannot change what the cube shows.' } },
          { eq: ['1/2 × 1/2 × 1/2 = []'], a: ['1/8'] }]
      }
    },

    dep: {
      watch: 'using the full bag for the second pick when the first marble was kept. Change the bag, then multiply.',
      goal: 'I can find the probability of two dependent events.',
      learn: {
        show: { pic: ['bag', { c: { red: 3, blue: 2 } }], cap: 'keep the first red', eq: ['3/5 × 2/4 = 6/20 = 3/10'] },
        together: [{ q: 'A bag has 3 red and 2 blue. Pick red, do not put it back, pick red again.', eq: ['3/5 × [] = []'], a: ['2/4', '3/10'], dep: { bag: { red: 3, blue: 2 }, draws: ['red', 'red'], back: false }, wide: true },
          { q: 'A bag has 3 red and 2 blue. Pick red, put it back, pick red again.', eq: ['3/5 × [] = []'], a: ['3/5', '9/25'], dep: { bag: { red: 3, blue: 2 }, draws: ['red', 'red'], back: true }, wide: true }],
        cue: 'After the first pick, change the bag.',
        own: [{ q: 'A bag has 4 green and 1 yellow. Pick green, do not put it back, pick green again.', eq: ['4/5 × [] = []'], a: ['3/4', '3/5'], dep: { bag: { green: 4, yellow: 1 }, draws: ['green', 'green'], back: false }, wide: true }]
      },
      p1: {
        show: { cap: 'not put back', eq: ['5 marbles, then 4'] },
        items: [{ q: 'A bag has 2 red and 3 blue. Pick blue, do not put it back, pick blue again.', eq: ['[]'], a: ['3/10'], dep: { bag: { red: 2, blue: 3 }, draws: ['blue', 'blue'], back: false }, wide: true },
          { q: 'A bag has 5 red and 1 blue. Pick red, do not put it back, pick red again.', eq: ['[]'], a: ['2/3'], dep: { bag: { red: 5, blue: 1 }, draws: ['red', 'red'], back: false }, wide: true },
          { q: 'A bag has 2 red and 2 blue. Pick red, do not put it back, pick blue.', eq: ['[]'], a: ['1/3'], dep: { bag: { red: 2, blue: 2 }, draws: ['red', 'blue'], back: false }, wide: true },
          { q: 'A bag has 2 red and 2 blue. Pick red, put it back, pick blue.', eq: ['[]'], a: ['1/4'], dep: { bag: { red: 2, blue: 2 }, draws: ['red', 'blue'], back: true }, wide: true }]
      },
      p2: {
        items: [{ q: 'A box has 6 white and 4 black socks. Pick white, do not put it back, pick white again.', eq: ['[]'], a: ['1/3'], dep: { bag: { white: 6, black: 4 }, draws: ['white', 'white'], back: false }, wide: true },
          { q: 'A box has 6 white and 4 black socks. Pick white, put it back, pick white again.', eq: ['[]'], a: ['9/25'], dep: { bag: { white: 6, black: 4 }, draws: ['white', 'white'], back: true }, wide: true },
          ID('Pick a name from a hat, keep it, pick another name.', null), ID('Roll a number cube twice.', 'separate')]
      },
      p3: {
        items: [{ q: 'A jar has 7 lemon and 3 cherry candies. {a} takes cherry, does not put it back, then {b} takes cherry.', eq: ['[]'], a: ['1/15'], dep: { bag: { lemon: 7, cherry: 3 }, draws: ['cherry', 'cherry'], back: false }, wide: true },
          { q: 'A bag has 3 red and 5 blue. Which is more likely: two reds put back, or two reds not put back?', lines: { n: 3, key: 'Put back: 3/8 × 3/8 = 9/64. Not put back: 3/8 × 2/7 = 6/56 = 3/28. Put back is more likely.' } }]
      },
      think: {
        items: [{ q: '{b} found P(red, red) without putting back as 3/5 × 3/5. What went wrong?', lines: { n: 3, key: 'After one red is kept, 2 red are left out of 4. It is 3/5 × 2/4.' } },
          { q: 'Why does keeping the first marble change the second chance?', lines: { n: 2, key: 'There are fewer marbles, and fewer of the colour picked.' } }]
      }
    }
  } });
})();
