/* Grade 6 Data and Probability: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/data-probability.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: D1.1 qualitative, discrete and continuous data; D1.2 samples and data sorted into intervals; D1.3 and
   D1.4 histograms, broken-line graphs and infographics; D1.5 mean, median, mode and range; D1.6 comparing data sets and
   graphs that mislead; D2.1 probability from 0 to 1 as a fraction, decimal or percent; D2.2 two independent events, and
   theoretical against experimental probability. The answer checks are in tests/verify/sheets.js: the kind of data
   follows from the question's words (pick.dc), an interval's count from the data (bins), a statistic from the data
   (stat), a probability from the spinner's parts (prob, trials, pick.chance), and two spinners give every pair of
   outcomes (outcomes, two). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* qualitative (words), discrete (counted) or continuous (measured) */
  function DC(q, ans) { return { q: q, pick: { opts: ['qualitative', 'discrete', 'continuous'], ans: ans, dc: true } }; }
  /* sort the data into k intervals of width w from lo */
  function BN(data, lo, w, k) {
    var rows = [], a = [];
    for (var i = 0; i < k; i++) {
      var s = lo + i * w, e = s + w;
      rows.push(s + ' to ' + e + ': []');
      a.push(data.filter(function (v) { return v >= s && v < e; }).length);
    }
    return { q: 'Data: ' + data.join(', '), eq: rows, a: a, bins: data, wide: data.length > 6 };
  }
  /* a histogram of counts in intervals */
  function HG(lo, w, vals, max, step) {
    return ['dbar', { cats: vals.map(function (v, i) { return (lo + i * w) + '–' + (lo + (i + 1) * w); }), sets: [vals], max: max, step: step, hist: true }];
  }
  /* a statistic of a list of numbers given in the question */
  function ST(stat, data, ans, name) { return { q: (name || 'Data') + ': ' + data.join(', '), eq: [stat.charAt(0).toUpperCase() + stat.slice(1) + ': []'], a: [ans], stat: stat, data: data, wide: data.length > 6 }; }
  /* a graph whose scale does not start at 0: how many more there really are, then how many times as tall the bar looks */
  function ML(v, min, max, step, i, j) {
    return { pic: ['dbar', { cats: ['A', 'B', 'C'].slice(0, v.length), sets: [v], min: min, max: max, step: step }], eq: ['really [] more', 'looks [] times as tall'], a: [v[i] - v[j], (v[i] - min) / (v[j] - min)], calc: v[i] + ' − ' + v[j], looks: [i, j], q: ['A', 'B', 'C'][i] + ' and ' + ['A', 'B', 'C'][j] + ':' };
  }
  function fr(c, n) { var g = function (x, y) { return y ? g(y, x % y) : x; }, k = g(c, n); return c === 0 ? 0 : c === n ? 1 : c / k + '/' + n / k; }
  function cnt(parts, l) { return parts.filter(function (x) { return x === l; }).length; }
  /* one spinner, several probabilities (or, with trials, how many of each to expect) */
  function SPS(parts, labs, trials) {
    var a = labs.map(function (l) { return trials ? trials * cnt(parts, l) / parts.length : fr(cnt(parts, l), parts.length); });
    return { q: trials ? 'In ' + trials + ' spins, about how many?' : 'Write each probability.', pic: ['spin', { parts: parts }], eq: labs.map(function (l) { return trials ? l + ': about []' : 'P(' + l + ') = []'; }), a: a, prob: labs, trials: trials };
  }
  /* one probability as a fraction and as a decimal */
  function PD(parts, lab) {
    return { q: 'P(' + lab + ') as a fraction, then a decimal.', pic: ['spin', { parts: parts }], eq: ['fraction: []', 'decimal: []'], a: [fr(cnt(parts, lab), parts.length), cnt(parts, lab) / parts.length], prob: [lab, lab] };
  }
  var WORDS = ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'];
  function CH(parts, lab, ans) { return { q: 'Landing on ' + lab + ' is:', pic: ['spin', { parts: parts }], pick: { opts: WORDS, ans: ans, chance: lab } }; }
  /* two spinners: how many outcomes, then the chance of l1 on the first and l2 on the second */
  function TW(p1, p2, l1, l2) {
    var both = cnt(p1, l1) * cnt(p2, l2), all = p1.length * p2.length;
    return { q: 'Spin both.', pic: ['row', { list: [['spin', { parts: p1 }], ['spin', { parts: p2 }]] }], eq: ['outcomes: []', 'P(' + l1 + ' and ' + l2 + ') = []'], a: [all, fr(both, all)], outcomes: true, two: [[l1], [l2]] };
  }
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  S.register('data-probability', { code: 'DP', ideas: {

    kinds: {
      watch: 'calling all number data the same. Count it: discrete. Measure it: continuous. Words: qualitative.',
      goal: 'I can tell qualitative, discrete and continuous data apart.',
      learn: {
        show: { eq: ['favourite sport: qualitative', 'number of pets: discrete', 'height: continuous'] },
        together: [DC('Favourite colour of each student', 0), DC('Number of books each student read', 1)],
        cue: 'Words: qualitative. Counted: discrete. Measured: continuous.',
        own: [DC('Height of each bean plant', 2), DC('Kind of pet each family has', 0), DC('How many goals each team scored', 1)]
      },
      p1: {
        show: { eq: ['152.4 cm: continuous'] },
        items: [DC('Time each runner took for 100 m', 2), DC('Number of people in each car', 1), DC('Favourite season of each student', 0),
          DC('Mass of each pumpkin', 2), DC('Language spoken at home', 0)]
      },
      p2: {
        items: [DC('Temperature each day at noon', 2), DC('Number of siblings each student has', 1), DC('Type of tree in the park', 0),
          DC('Distance each student lives from school', 2), DC('How many apps on each phone', 1),
          { q: 'Can a family have 2.5 pets? What does that tell you about the data?', lines: { n: 2, key: 'No. Pets are counted in whole numbers, so the data are discrete.' } }]
      },
      p3: {
        items: [DC('Length of each snake at the zoo', 2), DC('Number of canoes rented each day', 1),
          { q: 'Write a survey question that gives qualitative data.', lines: { n: 1, key: 'For example: What is your favourite fruit?' } },
          { q: 'Write a survey question that gives continuous data.', lines: { n: 1, key: 'For example: How long does it take you to get to school?' } }]
      },
      think: {
        items: [{ q: '{b} says shoe size is continuous because feet grow. Is {b} right?', lines: { n: 3, key: 'Shoe sizes come in set steps (5, 5½, 6), so the sizes are discrete. Foot length is continuous.' } },
          { q: 'Why does it matter which kind of data you have?', lines: { n: 2, key: 'It decides which graph to use: bars for words or counts, a histogram or line for measured data.' } },
          DC('Mass of each backpack', 2),
          { q: 'Turn "How tall are you?" into a question with discrete data.', lines: { n: 1, key: 'For example: How many centimetres did you grow this year, to the nearest whole cm? Or: How many people in your family are taller than you?' } }]
      }
    },

    sample: {
      watch: 'putting a value that sits on a boundary in two intervals. 145 goes in 145 to 150, where it starts.',
      goal: 'I can use a sample and sort data into intervals.',
      learn: {
        show: { eq: ['population: all 90 students', 'sample: 20 picked at random', '9 goes in 9 to 10, not 8 to 9'] },
        together: [story('In a fair sample of 20 students, 6 bike to school. About how many of 300 students bike?', 'students', 90, '6 × 300 / 20'), BN([3, 7, 12, 5, 10, 14], 0, 5, 3)],
        cue: 'An interval starts at its first number and stops just before its last.',
        own: [BN([41, 47, 50, 44, 52, 45], 40, 5, 3)]
      },
      p1: {
        show: { eq: ['140 to 145: 140, 141, … 144.9', '145 starts the next one'] },
        items: [BN([12, 25, 18, 20, 31, 27, 15], 10, 10, 3), BN([3, 8, 5, 9, 1, 6], 0, 4, 3),
          story('A sample of 40 trees has 12 maples. About how many maples in a forest of 2000 trees?', 'maples', 600, '12 × 2000 / 40'),
          ]
      },
      p2: {
        items: [BN([142, 155, 148, 150, 139, 146, 153, 145, 158], 135, 5, 5),
          story('In a sample of 50 voters, 28 want a new rink. About how many of 4000 voters?', 'voters', 2240, '28 × 4000 / 50'),
          { q: 'Name the population and a fair sample: how long do Grade 6 students in Ontario sleep?', lines: { n: 2, key: 'Population: all Grade 6 students in Ontario. Sample: students picked at random from many schools.' } }]
      },
      p3: {
        items: [BN([2.5, 4.1, 3.0, 5.6, 4.9, 3.7, 2.2, 5.0], 2, 1, 4),
          story('In a sample of 80 people, 15% walk to work. How many in the sample walk?', 'people', 12, '15% × 80'),
          { q: 'Why group heights into intervals instead of listing every value?', lines: { n: 2, key: 'There are many different values. Intervals show where most of the data are.' } }]
      },
      think: {
        items: [{ q: '{b} put 150 in both 145 to 150 and 150 to 155. What went wrong?', lines: { n: 3, key: 'Each value goes in one interval only. 150 starts 150 to 155, so it goes there.' } },
          { q: 'Plan how to collect data on how students get to school. Observe, survey or experiment?', lines: { n: 3, key: 'A survey of a random sample from every grade: ask how each one gets to school.' } },
          BN([22, 35, 28, 30, 19, 26, 33], 15, 5, 4)]
      }
    },

    hist: {
      watch: 'leaving gaps between the bars. In a histogram the bars touch, because the intervals meet.',
      goal: 'I can read and draw a histogram.',
      learn: {
        show: { cap: 'minutes of reading', eq: ['bars touch: no gaps'] },
        together: [{ q: 'How many students read 20 minutes or more?', pic: HG(0, 10, [2, 5, 8, 4, 1], 8, 2), eq: ['[] students'], a: [13], calc: '8 + 4 + 1', wide: true }],
        cue: 'Read each bar on the scale. Add the bars you need.',
        own: [{ q: 'How many students in all?', pic: HG(0, 10, [2, 5, 8, 4, 1], 8, 2), eq: ['[] students'], a: [20], calc: '2 + 5 + 8 + 4 + 1', wide: true }]
      },
      p1: {
        show: { eq: ['bar 150–155: 7 students'] },
        items: [{ q: 'Heights (cm). How many are 145 cm or taller?', pic: HG(135, 5, [2, 5, 6, 7, 3], 8, 2), eq: ['[] students'], a: [16], calc: '6 + 7 + 3', wide: true },
          { q: 'How many are shorter than 145 cm?', pic: HG(135, 5, [2, 5, 6, 7, 3], 8, 2), eq: ['[] students'], a: [7], calc: '2 + 5', wide: true }]
      },
      p2: {
        items: [{ q: 'Minutes of screen time. How many more in 60–90 than in 0–30?', pic: HG(0, 30, [4, 9, 12, 5], 12, 2), eq: ['[] more'], a: [8], calc: '12 − 4', wide: true },
          { q: 'How many people answered?', pic: HG(0, 30, [4, 9, 12, 5], 12, 2), eq: ['[] people'], a: [30], calc: '4 + 9 + 12 + 5', wide: true }]
      },
      p3: {
        items: [{ q: 'Masses of apples (g). What fraction are 150 g or more?', pic: HG(100, 25, [3, 8, 6, 3], 8, 2), eq: ['[]'], a: ['9/20'], calc: '(6 + 3)/(3 + 8 + 6 + 3)', wide: true },
          { q: 'Draw a histogram of these jumps (cm): 0 to 50: 3, 50 to 100: 7, 100 to 150: 5.', draw: { h: 110, key: 'Three touching bars of 3, 7 and 5 with a title, labels and a scale from 0.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why do the bars of a histogram touch but a bar graph\'s bars do not?', lines: { n: 3, key: 'A histogram shows intervals on a number line with no gaps. A bar graph shows separate categories.' } },
          { q: '{b} used intervals of 1 cm for 25 heights. What problem might that cause?', lines: { n: 3, key: 'Too many bars with only 0 or 1 in each, so you cannot see where most heights are.' } },
          { q: 'Which interval has the most students?', pic: HG(135, 5, [2, 5, 6, 7, 3], 8, 2), lines: { n: 1, key: '150 to 155 cm: 7 students.' }, wide: true }]
      }
    },

    choose: {
      watch: 'using a broken-line graph for data that is not over time. A broken-line graph shows change over time.',
      goal: 'I can choose a graph and read a broken-line graph.',
      learn: {
        show: { pic: ['lineg', { cats: ['Mar', 'Apr', 'May', 'Jun'], vals: [2, 9, 15, 20], max: 25, step: 5, title: 'Temperature (°C)' }], cap: 'a broken-line graph: change over time' },
        together: [{ q: 'How much warmer was Jun than Mar?', pic: ['lineg', { cats: ['Mar', 'Apr', 'May', 'Jun'], vals: [2, 9, 15, 20], max: 25, step: 5 }], eq: ['[] °C'], a: [18], calc: '20 − 2', wide: true }],
        cue: 'Bars: compare groups. Histogram: intervals. Broken line: change over time.',
        own: [{ q: 'Which graph shows a puppy\'s mass each month?', lines: { n: 1, key: 'A broken-line graph, because it shows change over time.' } },
          { q: 'Which graph shows the heights of 30 students?', lines: { n: 1, key: 'A histogram, with heights grouped in intervals.' } }]
      },
      p1: {
        show: { eq: ['favourite fruit: bar graph', 'times in a race: histogram'] },
        items: [{ q: 'By how much did sales grow from week 1 to week 4?', pic: ['lineg', { cats: ['wk 1', 'wk 2', 'wk 3', 'wk 4'], vals: [12, 18, 15, 30], max: 35, step: 5, title: 'Muffins sold' }], eq: ['[] muffins'], a: [18], calc: '30 − 12', wide: true },
          { q: 'Which graph compares two classes\' favourite sports?', lines: { n: 1, key: 'A double bar graph.' } },
          { q: 'Which graph shows a town\'s population every 10 years?', lines: { n: 1, key: 'A broken-line graph.' } }]
      },
      p2: {
        items: [{ q: 'Rainfall (mm). How much more in Jun than in Apr?', pic: ['lineg', { cats: ['Apr', 'May', 'Jun', 'Jul'], vals: [65, 80, 95, 70], min: 50, max: 100, step: 10 }], eq: ['[] mm'], a: [30], calc: '95 − 65', wide: true },
          { q: 'Mean rainfall over the 4 months?', pic: ['lineg', { cats: ['Apr', 'May', 'Jun', 'Jul'], vals: [65, 80, 95, 70], min: 50, max: 100, step: 10 }], eq: ['[] mm'], a: [77.5], stat: 'mean', wide: true }]
      },
      p3: {
        items: [{ q: 'Plan an infographic on how your class gets to school. Name two graphs and a fact you would show.', lines: { n: 3, key: 'For example: a bar graph of bus, walk, car and bike; a broken-line graph of walkers each month; a fact such as "half of us walk".' }, wide: true },
          { q: 'Draw a broken-line graph: a plant was 2 cm, 5 cm, 9 cm and 12 cm tall in weeks 1 to 4.', draw: { h: 110, key: 'Four points joined by lines, rising from 2 to 12, with a title, labels and a scale.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} drew a broken-line graph of favourite colours. Is that a good choice?', lines: { n: 3, key: 'No. Colours do not change over time. A bar graph compares them better.' } },
          { q: 'What makes an infographic clear?', lines: { n: 3, key: 'A title, a few clear graphs with labels, short facts, and the source of the data.' } },
          { q: 'Mean number of bikes at school each day?', pic: ['dbar', { cats: DAYS, sets: [[12, 15, 9, 14, 10]], max: 16, step: 4 }], eq: ['[] bikes'], a: [12], stat: 'mean', wide: true }]
      }
    },

    mislead: {
      watch: 'trusting the size of the bars without reading the scale. Check where the scale starts.',
      goal: 'I can spot a graph that misleads.',
      learn: {
        show: { pic: ['dbar', { cats: ['A', 'B'], sets: [[52, 50]], min: 48, max: 54, step: 2, title: 'Votes', h: 50 }], cap: 'starts at 48: A looks twice as tall, but is 2 more' },
        together: [ML([30, 25], 20, 30, 2, 0, 1)],
        cue: 'Check the title, labels, scale and source.',
        own: [{ q: 'Bars of 64 and 62, scale from 60. 64 looks how many times as tall?', eq: ['[] times'], a: [2], calc: '(64 − 60) ÷ (62 − 60)' }]
      },
      p1: {
        show: { eq: ['really 95 − 92 = 3 more', 'looks 5 ÷ 2 = 2.5 times'] },
        items: [ML([95, 92], 90, 96, 2, 0, 1), ML([41, 44, 42], 40, 45, 1, 1, 0),
          { q: 'Name one more way a graph can mislead.', lines: { n: 2, key: 'Uneven steps on the scale, no labels, bars of different widths, or a missing source.' } }]
      },
      p2: {
        items: [ML([18, 16], 15, 19, 1, 0, 1), ML([75, 72, 71], 70, 76, 1, 0, 2),
          { q: 'An ad says "4 out of 5 dentists agree", but asked only 5 dentists. Why could that mislead?', lines: { n: 3, key: '5 dentists is a very small sample, so it may not show what most dentists think.' } }]
      },
      p3: {
        items: [ML([126, 122], 120, 128, 2, 0, 1),
          { q: 'Redraw the graph with a scale from 0. Votes: A 52, B 50.', draw: { h: 80, key: 'Two bars almost the same height, on a scale from 0 to 60.' }, wide: true },
          ]
      },
      think: {
        items: [{ q: '{b} says A won by a lot because its bar is 3 times as tall. What should {b} check?', lines: { n: 3, key: 'Where the scale starts. If it does not start at 0, the bars do not show the real sizes.' } },
          { q: 'Why is the source of a graph important?', lines: { n: 3, key: 'It tells you who made it and where the data came from, so you can decide if you trust it.' } },
          ML([33, 31], 30, 34, 1, 0, 1)]
      }
    },

    mean: {
      watch: 'dividing by the wrong count. The mean is the total ÷ how many values there are.',
      goal: 'I can find the mean and use it.',
      learn: {
        show: { eq: ['4, 6, 8, 10, 12', 'total 40, 5 values', 'mean 40 ÷ 5 = 8'] },
        together: [ST('mean', [4, 6, 8], 6), ST('mean', [10, 15, 20, 25], 17.5)],
        cue: 'Add them all. Divide by how many.',
        own: [ST('mean', [7, 9, 11], 9), ST('mean', [2.5, 3.5, 4.5, 5.5], 4), ST('mean', [12, 18, 15, 11, 14], 14)]
      },
      p1: {
        show: { eq: ['mean = total ÷ how many'] },
        items: [ST('mean', [5, 7, 9], 7), ST('mean', [2, 4, 6, 8], 5), ST('mean', [20, 30, 40, 50], 35), ST('mean', [1.5, 2.5, 3.5], 2.5),
          ST('mean', [9, 9, 9, 13], 10), ST('mean', [100, 80, 90], 90)]
      },
      p2: {
        items: [ST('mean', [12, 15, 9, 14], 12.5), ST('mean', [36, 41, 38, 45], 40), ST('mean', [0.8, 1.2, 1.0, 1.4], 1.1),
          { q: 'Daily highs (°C):', pic: ['lineg', { cats: DAYS, vals: [14, 18, 16, 20, 17], min: 10, max: 22, step: 2 }], eq: ['Mean: []'], a: [17], stat: 'mean', wide: true },
          { q: '{a} scored 6, 8 and 7 in three games. What score in game 4 makes the mean 8?', eq: ['[]'], a: [11], calc: '8 × 4 − (6 + 8 + 7)', wide: true }]
      },
      p3: {
        items: [ST('mean', [125, 140, 132, 151, 147], 139), ST('mean', [3.2, 4.8, 5.1, 2.9], 4),
          { q: 'The mean of 5 tests is 80. The first four are 75, 82, 79 and 88. What is the fifth?', eq: ['[]'], a: [76], calc: '80 × 5 − (75 + 82 + 79 + 88)', wide: true },
          { q: 'A team scored a mean of 3 goals in 6 games. How many goals in all?', eq: ['[] goals'], a: [18], calc: '3 × 6' }]
      },
      think: {
        items: [{ q: 'Why is the mean called a "fair share"?', lines: { n: 2, key: 'If you shared the total out evenly, each value would get the mean.' } },
          { q: 'Make a set of 4 numbers with a mean of 10.', lines: { n: 1, key: 'Any 4 numbers that add to 40, such as 7, 9, 11, 13.' } },
          ST('mean', [45, 55, 60, 40], 50),
          { q: 'One value of 2, 3, 4, 3, 30 is much bigger. What does it do to the mean?', lines: { n: 2, key: 'It pulls the mean up to 8.4, though most values are about 3.' } }]
      }
    },

    median: {
      watch: 'finding the middle without putting the data in order first. Order the numbers, then find the median.',
      goal: 'I can find the median, mode and range.',
      learn: {
        show: { eq: ['3, 5, 5, 7, 10', 'median 5, mode 5', 'range 10 − 3 = 7'] },
        together: [ST('median', [9, 2, 7, 4, 5], 5), ST('mode', [3, 8, 3, 6, 2], 3)],
        cue: 'Median: middle in order. Mode: most often. Range: biggest − smallest.',
        own: [ST('range', [12, 4, 9, 15, 7], 11), ST('median', [8, 3, 6, 10], 7), ST('mode', [11, 13, 11, 15, 13, 11], 11)]
      },
      p1: {
        show: { eq: ['8, 2, 6 in order: 2, 6, 8', 'median 6'] },
        items: [ST('median', [3, 9, 1, 7, 5], 5), ST('mode', [4, 4, 7, 9, 2], 4), ST('range', [20, 35, 12, 28], 23),
          ST('median', [14, 10, 12, 18], 13), ST('range', [1.5, 3.2, 2.8, 0.9], 2.3), ST('mode', [6, 2, 6, 8, 2, 6], 6)]
      },
      p2: {
        items: [ST('median', [4.5, 3.0, 5.5, 4.0], 4.25), ST('mode', [2, 5, 5, 6, 8, 8, 8], 8),
          { q: 'Scores:', pic: ['dbar', { cats: DAYS, sets: [[6, 9, 4, 9, 7]], max: 10, step: 2 }], eq: ['Median: []', 'Mode: []', 'Range: []'], a: [7, 9, 5], stat: ['median', 'mode', 'range'], wide: true }]
      },
      p3: {
        items: [ST('median', [152, 148, 160, 155, 149, 151], 151.5), ST('range', [2.4, 5.1, 3.8, 1.9], 3.2),
          { q: 'Which best describes the usual shoe size: mean, median or mode? Why?', lines: { n: 2, key: 'Mode, because it is the size most people wear.' } },
          { q: 'Make 5 numbers with a median of 6 and a range of 8.', lines: { n: 1, key: 'For example 2, 4, 6, 7, 10.' } }]
      },
      think: {
        items: [{ q: '{b} says the median of 9, 2, 7 is 2 because it is in the middle. What went wrong?', lines: { n: 3, key: '{b} did not put them in order. 2, 7, 9: the median is 7.' } },
          { q: 'When is the median better than the mean?', lines: { n: 3, key: 'When one value is much bigger or smaller than the rest. It does not pull the median.' } },
          ST('median', [30, 2, 3, 4, 3], 3)]
      }
    },

    compare: {
      watch: 'comparing only one number. Use the centre and the spread: the mean or median, and the range.',
      goal: 'I can compare two sets of data.',
      learn: {
        show: { eq: ['A: 4, 5, 6, mean 5, range 2', 'B: 1, 5, 9, mean 5, range 8', 'B is more spread out'] },
        together: [ST('mean', [12, 14, 16], 14, 'Team A'), ST('mean', [8, 15, 19], 14, 'Team B')],
        cue: 'Find the centre of each. Then the spread.',
        own: [ST('range', [12, 14, 16], 4, 'Team A'), ST('range', [8, 15, 19], 11, 'Team B'),
          { q: 'Which team scores more steadily?', lines: { n: 1, key: 'Team A: its range is smaller.' } }]
      },
      p1: {
        show: { eq: ['bigger mean: more on average', 'bigger range: less steady'] },
        items: [ST('mean', [20, 25, 30], 25, 'Class A'), ST('mean', [22, 28, 31], 27, 'Class B'),
          ST('median', [3, 8, 5, 6, 4], 5, 'Week 1'), ST('median', [7, 2, 9, 6, 8], 7, 'Week 2'),
          { q: 'Which class read more on average?', lines: { n: 1, key: 'Class B: its mean is 27, bigger than 25.' } }]
      },
      p2: {
        items: [{ q: 'Jumps (cm):', pic: ['dbar', { cats: ['1st', '2nd', '3rd', '4th'], sets: [[110, 125, 120, 125], [100, 140, 115, 125]], keys: ['A', 'B'], max: 150, step: 50 }], lines: { n: 2, key: 'A: mean 120, range 15. B: mean 120, range 40. Same mean; A is steadier.' }, wide: true },
          ST('mean', [110, 125, 120, 125], 120, 'Jumper A'), ST('range', [100, 140, 115, 125], 40, 'Jumper B')]
      },
      p3: {
        items: [ST('mean', [5.2, 4.8, 5.0, 5.4], 5.1, 'Plant A (cm)'), ST('mean', [4.1, 6.3, 5.5, 4.5], 5.1, 'Plant B (cm)'),
          ST('range', [4.1, 6.3, 5.5, 4.5], 2.2, 'Plant B (cm)'),
          { q: 'Both plants have the same mean. Which grew more evenly? Explain.', lines: { n: 2, key: 'Plant A: its range is 0.6 cm, much smaller than 2.2 cm.' } }]
      },
      think: {
        items: [{ q: '{b} says two teams with the same mean play the same. Do you agree?', lines: { n: 3, key: 'Not always. One team may be steady and the other up and down. Check the range too.' } },
          { q: 'Make two sets of 3 numbers with mean 10: one spread out, one close together.', lines: { n: 2, key: 'For example 9, 10, 11 and 2, 10, 18.' } },
          ST('median', [15, 30, 20, 25], 22.5, 'Times (min)')]
      }
    },

    pline: {
      watch: 'writing a probability bigger than 1. A probability is always from 0 (impossible) to 1 (certain).',
      goal: 'I can show a probability from 0 to 1 as a fraction, decimal or percent.',
      learn: {
        show: { cap: '3 blue parts of 4', eq: ['P(B) = 3/4 = 0.75 = 75%'] },
        together: [PD(['B', 'B', 'B', 'R'], 'R'), { eq: ['1/4 = []%'], a: [25] }],
        cue: 'Favourable ÷ all. Then change it to a decimal or a percent.',
        own: [PD(['R', 'G', 'G', 'Y', 'Y'], 'Y'), { eq: ['2/5 = []%'], a: [40] }]
      },
      p1: {
        show: { eq: ['0: impossible', '0.5: equally likely', '1: certain'] },
        items: [PD(['1', '2', '3', '4'], '4'), CH(['R', 'B', 'B', 'B', 'B'], 'R', 1), { eq: ['7/10 = []%'], a: [70] }, { eq: ['3/5 = []%'], a: [60] }]
      },
      p2: {
        items: [PD(['R', 'R', 'B', 'G', 'G', 'G', 'G', 'G', 'Y', 'Y'], 'G'), SPS(['A', 'B', 'B', 'C', 'C', 'C'], ['A', 'C']),
          story('A bag has 3 red, 5 blue and 2 green {many}. What is P(blue) as a decimal?', '', 0.5, '5/(3 + 5 + 2)'),
          { eq: ['3/20 = []%'], a: [15] }]
      },
      p3: {
        items: [story('A number cube has 1 to 6. P(a number less than 5) as a fraction?', '', '4/6', '(5 − 1)/6'),
          story('There are 20 names in a hat; 8 are girls. P(a girl) as a decimal?', '', 0.4, '8/20'),
          CH(['1', '2', '3', '4', '5', '6', '7', '8'], '9', 0),
          { q: 'Draw a spinner where P(red) = 0.25 and P(blue) = 75%.', draw: { h: 80, key: 'A spinner with 4 equal parts: 1 red and 3 blue.' } }]
      },
      think: {
        items: [{ q: '{b} says P(rain) is 1.5. What is wrong?', lines: { n: 2, key: 'A probability cannot be more than 1, which means certain.' } },
          { q: 'Name an event that is certain and one that is impossible.', lines: { n: 2, key: 'For example: the sun rises tomorrow (certain); rolling a 7 on a 1 to 6 cube (impossible).' } },
          PD(['R', 'B', 'B', 'B', 'B', 'B', 'B', 'B'], 'R')]
      }
    },

    two: {
      watch: 'adding the outcomes of the two events. Multiply: 2 outcomes and 3 outcomes make 2 × 3 = 6 pairs.',
      goal: 'I can find the probability of two independent events.',
      learn: {
        show: { cap: 'a coin (H, T) and a spinner (R, B, G)', eq: ['2 × 3 = 6 outcomes'] },
        together: [TW(['H', 'T'], ['1', '2', '3', '4'], 'T', '3')],
        cue: 'Outcomes = first count × second count. Then count the ones you want.',
        own: [TW(['R', 'B'], ['R', 'B'], 'R', 'R'), TW(['A', 'B', 'C'], ['1', '2'], 'C', '2')]
      },
      p1: {
        show: { eq: ['H1 H2 H3 T1 T2 T3', '6 outcomes'] },
        items: [TW(['H', 'T'], ['1', '2', '3'], 'H', '2'), TW(['R', 'B', 'G'], ['X', 'Y'], 'G', 'Y'), TW(['1', '2', '3', '4'], ['H', 'T'], '4', 'T')]
      },
      p2: {
        items: [TW(['R', 'B', 'G', 'Y'], ['1', '2', '3'], 'Y', '1'), TW(['A', 'A', 'B'], ['1', '2'], 'A', '1'),
          { q: 'Make a tree diagram for flipping a coin and spinning red, blue or green.', draw: { h: 90, key: 'H branches to R, B, G and T branches to R, B, G: 6 outcomes.' }, wide: true }]
      },
      p3: {
        items: [TW(['H', 'T'], ['1', '2', '3', '4', '5', '6'], 'H', '6'), TW(['R', 'R', 'B'], ['R', 'B', 'B', 'B'], 'R', 'B'),
          { q: 'Why does the coin not change what the cube rolls?', lines: { n: 2, key: 'They are independent: one does not change the other.' } }]
      },
      think: {
        items: [{ q: '{b} says a coin and a 1 to 6 cube give 2 + 6 = 8 outcomes. What went wrong?', lines: { n: 3, key: 'Each coin side pairs with each number: 2 × 6 = 12 outcomes.' } },
          { q: 'Write two events that are not independent.', lines: { n: 2, key: 'For example: picking 2 {many} from a {cont} without putting the first back.' } },
          TW(['1', '2', '3'], ['1', '2', '3'], '3', '3')]
      }
    },

    experiment: {
      watch: 'expecting the exact theoretical result every time. Results vary, and more trials usually come closer.',
      goal: 'I can compare theoretical and experimental probability.',
      learn: {
        show: { pic: ['spin', { parts: ['R', 'B'] }], cap: 'theory: P(R) = 1/2', eq: ['12 R in 20: 12/20'] },
        together: [SPS(['R', 'B', 'B', 'B'], ['R'], 40), story('{a} spun 40 times and got R 13 times. Experimental P(R)?', '', '13/40', '13/40')],
        cue: 'Theory: favourable ÷ all. Experiment: times it happened ÷ trials.',
        own: [SPS(['1', '2', '3'], ['3'], 30), story('{b} rolled a cube 30 times and got 4 sixes. Experimental P(6)?', '', '4/30', '4/30')]
      },
      p1: {
        show: { eq: ['P = 1/4, 80 trials', 'expect 80 ÷ 4 = 20'] },
        items: [SPS(['R', 'B', 'G', 'Y'], ['G'], 80), SPS(['X', 'X', 'O'], ['X', 'O'], 60),
          story('A coin landed on heads 27 times in 50 flips. Experimental P(heads)?', '', '27/50', '27/50'),
          story('P(heads) is 1/2. In 50 flips, how many heads would you expect?', 'heads', 25, '50 × 1/2')]
      },
      p2: {
        items: [SPS(['R', 'R', 'R', 'B'], ['R', 'B'], 200), SPS(['A', 'B', 'C', 'D', 'E', 'F'], ['D'], 120),
          { q: '{a} spun 20 times and got 13 R. P(R) is 1/2. Is that close? Explain.', lines: { n: 3, key: 'Expected 10. 13 is close, because results vary. More spins would likely be closer to half.' } }]
      },
      p3: {
        items: [story('Out of 200 spins, 52 landed on blue. Experimental P(blue) as a decimal?', '', 0.26, '52/200'),
          { q: 'Plan an experiment to test if a spinner is fair.', lines: { n: 3, key: 'Spin it many times, such as 100, tally each result, and compare with the expected numbers.' } },
          SPS(['G', 'Y', 'Y', 'Y', 'Y'], ['Y', 'G'], 250)]
      },
      think: {
        items: [{ q: '{b} says a coin that lands on heads 3 times in a row is more likely to land on tails next. Is {b} right?', lines: { n: 3, key: 'No. Each flip is still 1/2 heads and 1/2 tails. The coin does not remember.' } },
          { q: 'Why do more trials usually give results closer to the theory?', lines: { n: 3, key: 'Odd results even out over many trials.' } },
          SPS(['R', 'B', 'B', 'B', 'B'], ['R'], 500)]
      }
    }
  } });
})();
