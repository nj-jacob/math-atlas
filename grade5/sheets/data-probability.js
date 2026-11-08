/* Grade 5 Data and Probability: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/data-probability.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: D1.1 samples and populations; D1.2 frequency and relative frequency; D1.3 and D1.4 choosing and making
   graphs (including stacked and double bar graphs); D1.5 mean, median and mode; D1.6 graphs that mislead; D2.1
   probability from 0 to 1; D2.2 expected and actual results. The answer checks are in tests/verify/sheets.js: a
   statistic is worked out from the data (stat), a relative frequency from its count (rel), and a probability from the
   spinner's parts (prob, trials, pick.chance). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* a statistic of a list of numbers given in the question */
  function ST(stat, data, ans) { return { q: 'Data: ' + data.join(', '), eq: [stat.charAt(0).toUpperCase() + stat.slice(1) + ': []'], a: [ans], stat: stat, data: data, wide: data.length > 6 }; }
  /* relative frequency of row i of a tally, as a fraction and a percent */
  function RF(cats, vals, rows) {
    var t = vals.reduce(function (x, y) { return x + y; }, 0);
    return { q: 'Out of the total:', pic: ['tally', { cats: cats, vals: vals, head: ['Choice'] }], eq: rows.map(function (i) { return cats[i] + ': []'; }), a: rows.map(function (i) { return vals[i] + '/' + t; }), rel: rows };
  }
  /* a graph whose scale does not start at 0: how many more there really are, then how many times as tall the bar looks */
  function ML(v, min, max, step, i, j) {
    return { pic: ['dbar', { cats: ['A', 'B', 'C'].slice(0, v.length), sets: [v], min: min, max: max, step: step }], eq: ['really [] more', 'looks [] times as tall'], a: [v[i] - v[j], (v[i] - min) / (v[j] - min)], calc: v[i] + ' − ' + v[j], looks: [i, j], q: ['A', 'B', 'C'][i] + ' and ' + ['A', 'B', 'C'][j] + ':' };
  }
  /* one spinner, several probabilities (or, with trials, how many of each to expect) */
  function SPS(parts, labs, trials) {
    var a = labs.map(function (l) { var c = parts.filter(function (x) { return x === l; }).length, n = parts.length, g = function (x, y) { return y ? g(y, x % y) : x; }, k = g(c, n); return trials ? trials * c / n : (c === 0 ? 0 : c === n ? 1 : c / k + '/' + n / k); });
    return { q: trials ? 'In ' + trials + ' spins, about how many?' : 'Write each probability.', pic: ['spin', { parts: parts }], eq: labs.map(function (l) { return trials ? l + ': about []' : 'P(' + l + ') = []'; }), a: a, prob: labs, trials: trials };
  }
  /* one spinner: the probability of a label, then how likely it is in words */
  function SPC(parts, lab, ans) {
    var o = SPS(parts, [lab]);
    o.q = 'Write P(' + lab + '). Then circle how likely.';
    o.pick = { opts: ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'], ans: ans, chance: lab };
    o.pickLast = true;
    o.wide = true;
    return o;
  }
  function CH(parts, lab, ans) { return { q: 'Landing on ' + lab + ' is:', pic: ['spin', { parts: parts }], pick: { opts: ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'], ans: ans, chance: lab } }; }
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  S.register('data-probability', { code: 'DP', ideas: {

    sample: {
      watch: 'asking only one group (only friends, only one class) and calling it the whole school. A fair sample is picked at random from every part.',
      goal: 'I can tell if a sample is fair and use it to predict.',
      learn: {
        show: { eq: ['population: all 400 students', 'sample: 40 picked at random', '1 in every 10'] },
        together: [story('In a fair sample of 20 students, 8 walk to school. About how many of 200 students walk?', 'students', 80, '8 × 200 / 20'),
          { q: 'To learn what the whole school likes, is asking only the hockey team a fair sample? Why?', lines: { n: 2, key: 'No. The hockey team is not like the whole school. Pick students at random from every grade.' } }],
        cue: 'A fair sample is picked at random from every part of the population.',
        own: [story('In a sample of 10 families, 3 have a dog. About how many of 100 families?', 'families', 30, '3 × 100 / 10'),
          { q: 'Name the population and a fair sample: what lunch do Grade 5 students in Ontario like?', lines: { n: 2, key: 'Population: all Grade 5 students in Ontario. Sample: some students picked at random from many schools.' } }]
      },
      p1: {
        show: { eq: ['sample: 5 of 25 like math best', 'school of 500: 5 × 20 = 100'] },
        items: [story('In a fair sample of 50 people, 20 like summer best. About how many of 500 people?', 'people', 200, '20 × 500 / 50'),
          story('A sample of 25 apples has 2 bruised ones. About how many in 1000 apples?', 'apples', 80, '2 × 1000 / 25'),
          { q: 'Which is the fairer sample of a town: people at one rink, or names picked at random from the whole town? Why?', lines: { n: 2, key: 'Names picked at random from the whole town. People at a rink are not like everyone.' } },
          { q: 'Why is a bigger random sample better?', lines: { n: 2, key: 'It is more likely to look like the whole population.' } }]
      },
      p2: {
        items: [story('In a sample of 40 students, 14 play an instrument. About how many of 400?', 'students', 140, '14 × 400 / 40'),
          story('A sample of 30 fish has 6 trout. About how many trout in a lake of 900 fish?', 'trout', 180, '6 × 900 / 30'),
          { q: '{a} asks 10 friends at the skate park what sport is best. What is wrong with this sample?', lines: { n: 3, key: 'Friends at a skate park are likely to like skating. It is too small and not random.' } },
          { q: 'Plan a fair sample to find the favourite book of students at your school.', lines: { n: 3, key: 'Pick about 5 students at random from every class.' } }]
      },
      p3: {
        items: [story('A sample of 60 voters has 33 for the park. About how many of 6000 voters?', 'voters', 3300, '33 × 6000 / 60'),
          story('In a sample of 8 seed packs, 6 grew. About how many of 200 packs will grow?', 'packs', 150, '6 × 200 / 8'),
          { q: 'A survey asked people at a library about reading. It said 90% read every day. Could that mislead? Why?', lines: { n: 3, key: 'Yes. People at a library read more than most, so the sample is not like the population.' } },
          { q: 'Write a question you could ask a sample of your class.', lines: { n: 2, key: 'Any clear question, for example: How do you get to school?' } }]
      },
      think: {
        items: [{ q: '{b} says asking 3 people is enough to learn about the whole town. Do you agree?', lines: { n: 3, key: 'No. 3 people are too few to look like the whole town.' } },
          { q: 'When would you ask the whole population instead of a sample?', lines: { n: 3, key: 'When the group is small, like one class, so asking everyone is easy.' } },
          story('In a fair sample of 20, 5 chose blue. About how many of 300 would choose blue?', 'people', 75, '5 × 300 / 20')]
      }
    },

    relfreq: {
      watch: 'writing the count instead of comparing it to the total. Relative frequency is the count out of all of them.',
      goal: 'I can find the relative frequency of a count.',
      learn: {
        show: { pic: ['tally', { cats: ['bus', 'walk', 'car'], vals: [6, 10, 4], head: ['Choice'] }], eq: ['walk: 10 of 20 = 1/2 = 50%'] },
        together: [{ q: 'bus', eq: ['6/20 = [] %'], a: [30] }, { q: 'car', eq: ['4/20 = []'], a: [0.2] }],
        cue: 'Count out of the total. The relative frequencies add to 1, or 100%.',
        own: [RF(['yes', 'no'], [9, 11], [0, 1]), { eq: ['9/20 = [] %', '11/20 = [] %'], a: [45, 55] }]
      },
      p1: {
        show: { eq: ['3 of 10 = 3/10 = 0.3 = 30%'] },
        items: [RF(['red', 'blue', 'green'], [5, 3, 2], [0, 2]), { eq: ['7/10 = []'], a: [0.7] }, { eq: ['9/25 = [] %'], a: [36] }]
      },
      p2: {
        items: [RF(['cats', 'dogs', 'fish', 'none'], [9, 12, 3, 1], [0, 1, 3]),
          { eq: ['12/50 = [] %'], a: [24] }, { eq: ['15/20 = []'], a: [0.75] },
          story('{a} flipped a coin 40 times and got 22 heads. What fraction were tails?', 'of the flips', '18/40', '(40 − 22)/40')]
      },
      p3: {
        items: [{ q: 'Out of 200 students, 30% walk. How many walk?', eq: ['[] students'], a: [60], calc: '30% × 200' },
          { q: 'Red has a relative frequency of 1/4 in 80 spins. How many reds?', eq: ['[] reds'], a: [20], calc: '1/4 × 80' },
          { q: 'Of 25 {many}, 10 are small. What percent are small?', eq: ['10/25 = [] %'], a: [40] },
          { q: 'Three relative frequencies are 0.5, 0.3 and []. What is the last one?', eq: ['0.5 + 0.3 + [] = 1'], a: [0.2] }]
      },
      think: {
        items: [{ q: '{b} says 6 votes for soccer is more popular in a class of 20 than 6 votes in a class of 30. Explain.', lines: { n: 3, key: '6 of 20 is 30%, but 6 of 30 is only 20%, so soccer is more popular in the class of 20.' } },
          { q: 'Why do the relative frequencies always add to 1?', lines: { n: 3, key: 'Together they cover every result, which is the whole total.' } },
          RF(['yes', 'no', 'not sure'], [12, 6, 2], [1])]
      }
    },

    choose: {
      watch: 'using a line graph for data that is not over time, or leaving off the title, labels or scale.',
      goal: 'I can choose and read a graph.',
      learn: {
        show: { pic: ['dbar', { cats: ['Mon', 'Tue', 'Wed'], sets: [[3, 5, 2], [4, 2, 6]], keys: ['Gr 5', 'Gr 6'], max: 6, step: 2, title: 'Books read' }], cap: 'a double bar graph compares two groups' },
        together: [{ q: 'Students who biked. How many more in Grade 5 on Fri than on Wed?', pic: ['dbar', { cats: DAYS, sets: [[6, 8, 4, 7, 9], [5, 9, 6, 5, 8]], keys: ['Grade 5', 'Grade 6'], max: 10, step: 2 }], eq: ['[] more'], a: [5], calc: '9 − 4', wide: true }],
        cue: 'Bar: compare. Stacked bar: parts of a whole. Line: change over time.',
        own: [{ q: 'On which days did Grade 6 have more bikers?', lines: { n: 1, key: 'Tue and Wed.' } }, { q: 'Which graph shows change over time?', lines: { n: 1, key: 'A line graph.' } }]
      },
      p1: {
        show: { pic: ['lineg', { cats: ['Mar', 'Apr', 'May', 'Jun'], vals: [2, 9, 15, 20], max: 25, step: 5, title: 'Temperature (°C)' }], cap: 'a line graph shows change over time' },
        items: [{ q: 'How much warmer was Jun than Mar?', pic: ['lineg', { cats: ['Mar', 'Apr', 'May', 'Jun'], vals: [2, 9, 15, 20], max: 25, step: 5 }], eq: ['[] °C'], a: [18], calc: '20 − 2', wide: true },
          { q: 'Which graph shows a plant\'s height each week?', lines: { n: 1, key: 'A line graph, because it shows change over time.' } },
          { q: 'Which graph compares two classes\' favourite fruits?', lines: { n: 1, key: 'A double bar graph.' } }]
      },
      p2: {
        items: [{ q: 'How many {many} in all on Mon?', pic: ['dbar', { cats: ['Mon', 'Tue', 'Wed'], sets: [[4, 6, 3], [5, 2, 6]], keys: ['small', 'big'], max: 12, step: 2, stack: true }], eq: ['[] {many}'], a: [9], calc: '4 + 5' },
          { q: 'How many more big than small on Wed?', pic: ['dbar', { cats: ['Mon', 'Tue', 'Wed'], sets: [[4, 6, 3], [5, 2, 6]], keys: ['small', 'big'], max: 12, step: 2, stack: true }], eq: ['[] more'], a: [3], calc: '6 − 3' },
          { q: 'What 4 things does every graph need?', lines: { n: 2, key: 'A title, labels, a scale and the source of the data.' } }]
      },
      p3: {
        items: [{ q: 'By how much did sales grow from week 1 to week 4?', pic: ['lineg', { cats: ['wk 1', 'wk 2', 'wk 3', 'wk 4'], vals: [12, 18, 15, 30], max: 35, step: 5, title: 'Muffins sold' }], eq: ['[] muffins'], a: [18], calc: '30 − 12', wide: true },
          { q: 'Draw a double bar graph: Boys 4 cats, 6 dogs. Girls 7 cats, 3 dogs.', draw: { h: 120, key: 'Two bars for cats (4 and 7) and two for dogs (6 and 3), with a key, title, labels and a scale.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} drew a line graph of favourite colours. Is that a good choice?', lines: { n: 3, key: 'No. Colours do not change over time. A bar graph compares them better.' } },
          { q: 'When is a stacked bar graph useful?', lines: { n: 3, key: 'To show the parts that make up each whole, like big and small {many} in each day.' } },
          { q: 'What is the mean of Grade 5 bikers over the week?', pic: ['dbar', { cats: DAYS, sets: [[6, 8, 4, 7, 10]], max: 10, step: 2 }], eq: ['[] students'], a: [7], stat: 'mean', wide: true }]
      }
    },

    misleading: {
      watch: 'trusting the size of the bars without reading the scale. Check where the scale starts.',
      goal: 'I can spot a graph that misleads.',
      learn: {
        show: { pic: ['dbar', { cats: ['A', 'B'], sets: [[52, 50]], min: 48, max: 54, step: 2, title: 'Votes' }], cap: 'the scale starts at 48: A looks twice as tall, but is only 2 more' },
        together: [ML([30, 25], 20, 30, 2, 0, 1), { q: 'What would make this graph fair?', lines: { n: 2, key: 'Start the scale at 0.' } }],
        cue: 'Before you trust a graph, check its title, labels, scale and source.',
        own: [{ q: 'A graph of 64 and 62 starts at 60. How many times as tall does 64 look?', eq: ['[] times'], a: [2], calc: '(64 − 60) ÷ (62 − 60)' }, { q: 'Who might want A to look far ahead?', lines: { n: 2, key: 'Someone on A\'s side, or selling A.' } }]
      },
      p1: {
        show: { cap: 'A scale that starts above 0 makes small gaps look big.', eq: ['really 95 − 92 = 3 more', 'looks 5 ÷ 2 = 2.5 times'] },
        items: [ML([95, 92], 90, 96, 2, 0, 1), ML([41, 44, 42], 40, 45, 1, 1, 0),
          { q: 'What should the scale start at to be fair?', lines: { n: 1, key: '0' } },
          { q: 'Name one more way a graph can mislead.', lines: { n: 2, key: 'Uneven steps on the scale, no labels, bars of different widths, or a missing source.' } }]
      },
      p2: {
        items: [ML([18, 16], 15, 19, 1, 0, 1), ML([75, 72, 71], 70, 76, 1, 0, 2),
          { q: 'A toy ad shows a graph with no numbers on the scale. Why could that mislead?', lines: { n: 3, key: 'You cannot tell the real amounts or how big the gaps are.' } }]
      },
      p3: {
        items: [{ q: 'Redraw the graph with a scale from 0. Votes: A 52, B 50.', draw: { h: 110, key: 'Two bars almost the same height, on a scale from 0 to 60.' }, wide: true },
          { q: 'Who might want to use the first graph? Why?', lines: { n: 3, key: 'Someone who wants A to look like it won by a lot.' } },
          ML([126, 122], 120, 128, 2, 0, 1)]
      },
      think: {
        items: [{ q: '{b} says A won by a lot because its bar is 3 times as tall. What should {b} check?', lines: { n: 3, key: 'Where the scale starts. If it does not start at 0, the bars do not show the real sizes.' } },
          { q: 'Why is the source of a graph important?', lines: { n: 3, key: 'It tells you who made it and where the data came from, so you can decide if you trust it.' } },
          ML([33, 31], 30, 34, 1, 0, 1)]
      }
    },

    mmm: {
      watch: 'finding the middle without putting the data in order first. Order the numbers, then find the median.',
      goal: 'I can find the mean, median, mode and range.',
      learn: {
        show: { eq: ['3, 5, 5, 7, 10', 'mean 30 ÷ 5 = 6', 'median 5, mode 5, range 7'] },
        together: [ST('mean', [4, 6, 8], 6), ST('median', [9, 2, 7, 4, 5], 5)],
        cue: 'Mean: total ÷ how many. Median: middle in order. Mode: most often. Range: biggest − smallest.',
        own: [ST('mode', [3, 8, 3, 6, 2], 3), ST('range', [12, 4, 9, 15, 7], 11), ST('mean', [10, 6, 8], 8)]
      },
      p1: {
        show: { eq: ['8, 2, 6', 'in order: 2, 6, 8', 'median 6'] },
        items: [ST('mean', [5, 7, 9], 7), ST('median', [3, 9, 1, 7, 5], 5), ST('mode', [4, 4, 7, 9, 2], 4), ST('range', [20, 35, 12, 28], 23), ST('mean', [2, 4, 6, 8], 5)]
      },
      p2: {
        items: [ST('mean', [12, 15, 9, 14], 12.5), ST('median', [8, 3, 6, 10], 7), ST('mode', [11, 13, 11, 15, 13, 11], 11),
          ST('range', [1.5, 3.2, 2.8, 0.9], 2.3), ST('median', [21, 18, 25, 19, 30, 22, 24], 22), ST('mean', [7, 7, 7, 7, 12], 8)]
      },
      p3: {
        items: [{ q: '{a} scored 6, 8 and 7 in three games. What score in game 4 makes the mean 8?', eq: ['[]'], a: [11], calc: '8 × 4 − (6 + 8 + 7)' },
          ST('median', [4.5, 3.0, 5.5, 4.0], 4.25),
          { q: 'Daily highs (°C):', pic: ['lineg', { cats: DAYS, vals: [14, 18, 16, 20, 17], min: 10, max: 22, step: 2 }], eq: ['mean: []', 'median: []', 'range: []'], a: [17, 17, 6], stat: ['mean', 'median', 'range'] }]
      },
      think: {
        items: [{ q: '{b} says the median of 9, 2, 7 is 2 because it is in the middle. What went wrong?', lines: { n: 3, key: '{b} did not put them in order. 2, 7, 9: the median is 7.' } },
          { q: 'Make a set of 5 numbers with a mean of 6.', lines: { n: 1, key: 'Any 5 numbers that add to 30, such as 4, 5, 6, 7, 8.' } },
          { q: 'Which is best for "the most popular shoe size": mean, median or mode? Why?', lines: { n: 3, key: 'Mode, because it is the size that comes up most often.' } },
          ST('mode', [2, 5, 5, 6, 8, 8, 8], 8)]
      }
    },

    chance: {
      watch: 'counting the colours instead of the parts. Count every equal part: 2 red parts of 4 is 2/4.',
      goal: 'I can describe probability with words and with a number from 0 to 1.',
      learn: {
        show: { pic: ['spin', { parts: ['R', 'R', 'B', 'G'] }], eq: ['P(R) = 2/4 = 1/2'] },
        together: [SPC(['R', 'R', 'B', 'G'], 'B', 1)],
        cue: 'P = ways it can happen ÷ all equally likely outcomes.',
        own: [SPS(['R', 'B', 'B', 'B', 'G'], ['B', 'G']), SPS(['G', 'G', 'G'], ['G', 'Y'])]
      },
      p1: {
        show: { pic: ['spin', { parts: ['A', 'B', 'B'] }], eq: ['P(B) = 2/3, likely'] },
        items: [SPS(['A', 'B', 'C'], ['A', 'C']), SPS(['R', 'B', 'B', 'G', 'G', 'G'], ['R', 'G']), SPC(['1', '2', '2', '2'], '1', 1)]
      },
      p2: {
        items: [SPS(['R', 'R', 'R', 'B', 'B', 'G'], ['R', 'B', 'G']), SPS(['1', '2', '3', '4', '5', '6', '7', '8'], ['7', '9']),
          SPC(['1', '2', '3', '4', '5', '6', '7', '8'], '9', 0)]
      },
      p3: {
        items: [story('A bag has 5 green, 4 yellow and 1 white {one}. What is P(yellow)?', '', '4/10', '4/(5 + 4 + 1)'),
          story('A number cube has 1 to 6. What is P(a number less than 3)?', '', '2/6', '(3 − 1)/6'),
          SPS(['A', 'B', 'A', 'C', 'A', 'B'], ['A', 'B', 'C']),
          { q: 'Draw a spinner where P(red) = 3/4.', draw: { h: 80, key: 'A spinner with 4 equal parts, 3 of them red.' } }]
      },
      think: {
        items: [{ q: '{b} says R, B and G each have a probability of 1/3 on this spinner. Is {b} right?', pic: ['spin', { parts: ['R', 'R', 'B', 'G'] }], lines: { n: 3, key: 'No. R has 2 of 4 parts, so P(R) = 1/2. B and G are 1/4 each.' } },
          { q: 'Why can a probability never be more than 1?', lines: { n: 3, key: 'It can never happen more often than every time. 1 means certain.' } },
          CH(['G', 'G', 'G', 'G'], 'G', 4)]
      }
    },

    experiment: {
      watch: 'expecting the exact theoretical result every time. Results vary, and more trials usually come closer.',
      goal: 'I can predict results and compare them with an experiment.',
      learn: {
        show: { pic: ['spin', { parts: ['R', 'B'] }], eq: ['P(R) = 1/2', '20 spins: expect about 10 R'] },
        together: [SPS(['R', 'B', 'B', 'B'], ['R'], 40), SPS(['1', '2', '3'], ['3'], 30)],
        cue: 'Expected = probability × number of trials.',
        own: [SPS(['A', 'A', 'B', 'C'], ['A'], 100), SPS(['R', 'B'], ['B'], 50)]
      },
      p1: {
        show: { eq: ['P = 1/4, 80 trials', '80 ÷ 4 = 20 expected'] },
        items: [SPS(['R', 'B', 'G', 'Y'], ['G'], 80), SPS(['X', 'X', 'O'], ['X', 'O'], 60),
          SPS(['1', '2', '3', '4', '5'], ['5'], 50), story('P(heads) is 1/2. In 30 flips, about how many heads?', 'heads', 15, '30 × 1/2')]
      },
      p2: {
        items: [SPS(['R', 'R', 'R', 'B'], ['R', 'B'], 200), SPS(['A', 'B', 'C', 'D', 'E', 'F'], ['D'], 120),
          { q: '{a} spun 20 times and got 13 R. P(R) is 1/2. Is that close? Explain.', lines: { n: 3, key: 'Expected 10. 13 is close, because results vary. More spins would likely be closer to half.' } },
          story('A cube with 1 to 6 is rolled 60 times. About how many 6s?', 'sixes', 10, '60 ÷ 6')]
      },
      p3: {
        items: [{ q: '{b} got heads 7 times in 10 flips. What fraction were heads?', eq: ['[]'], a: ['7/10'], calc: '7/10' },
          { q: 'Plan an experiment to test if a spinner is fair.', lines: { n: 3, key: 'Spin it many times, such as 100, tally each result, and compare with the expected numbers.' } },
          SPS(['G', 'Y', 'Y', 'Y', 'Y'], ['Y', 'G'], 250)]
      },
      think: {
        items: [{ q: '{b} says a coin that lands on heads 3 times in a row is more likely to land on tails next. Is {b} right?', lines: { n: 3, key: 'No. Each flip is still 1/2 heads and 1/2 tails. The coin does not remember.' } },
          { q: 'Why do more trials usually give results closer to what you expect?', lines: { n: 3, key: 'Odd results even out over many trials.' } },
          SPS(['R', 'B', 'B', 'B', 'B'], ['R'], 500)]
      }
    }
  } });
})();
