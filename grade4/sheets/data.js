/* Grade 4 Data and Probability: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/data.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: D1.1 qualitative and quantitative data; D1.2 and D1.3 stem-and-leaf plots and double bar graphs;
   D1.5 mean, median and mode; D1.6 reading graphs to answer questions; D2.1 the language of chance; D2.2 predictions
   about two groups. The answer checks are in tests/verify/sheets.js: a statistic is worked out from the data (stat),
   a graph question from the graph's values, and a chance word from the spinner (pick.chance). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* words or numbers: the question and an example answer */
  function KD(q, eg) { return { q: q, pick: { opts: ['qualitative', 'quantitative'], ans: isNaN(+eg) ? 0 : 1, dtype: eg } }; }
  /* a statistic of numbers in the question, or of a stem-and-leaf plot */
  function ST(stat, data, ans) { return { q: 'Data: ' + data.join(', '), eq: [stat.charAt(0).toUpperCase() + stat.slice(1) + ': []'], a: [ans], stat: stat, data: data, wide: data.length > 6 }; }
  function SL(data, stat, ans, q) { return { q: q, pic: ['stem', { data: data }], eq: [stat.charAt(0).toUpperCase() + stat.slice(1) + ': []'], a: [ans], stat: stat }; }
  /* read a stem-and-leaf plot: how many values (count), the least, the greatest */
  function SC(data, stat) { var it = SL(data, stat, 0, { count: 'How many values?', least: 'Least value?', greatest: 'Greatest value?' }[stat]); var d = data.slice().sort(function (p, q) { return p - q; }); it.a = [stat === 'count' ? d.length : stat === 'least' ? d[0] : d[d.length - 1]]; it.eq = ['[]']; return it; }
  /* a spinner: how likely */
  var WORDS = ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'];
  function CH(parts, lab, ans, other) { var o = [WORDS[ans], WORDS[other]].sort(function (p, q) { return WORDS.indexOf(p) - WORDS.indexOf(q); }); return { q: 'Landing on ' + lab + ' is:', pic: ['spin', { parts: parts }], pick: { opts: o, ans: o.indexOf(WORDS[ans]), chance: lab } }; }
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  /* a double bar graph question */
  function DB(q, sets, keys, ans, calc, cats, max) { return { q: q, pic: ['dbar', { cats: cats || DAYS.slice(0, sets[0].length), sets: sets, keys: keys, max: max || 10, step: 2 }], eq: ['[]'], a: [ans], calc: calc }; }

  S.register('data', { code: 'DA', ideas: {

    kinds: {
      watch: 'calling any answer in a survey quantitative. Ask: is the answer a number you count or measure, or a word?',
      goal: 'I can tell qualitative data from quantitative data.',
      learn: {
        show: { cap: 'Favourite colour: red, blue (words). Number of pets: 0, 2 (numbers)', eq: ['qualitative / quantitative'] },
        together: [KD('What is your favourite sport?', 'hockey'), KD('How many books did you read this month?', '4')],
        cue: 'Words or categories: qualitative. Numbers you count or measure: quantitative.',
        own: [KD('How tall is your sunflower in cm?', '85'), KD('What month is your birthday?', 'June'), KD('How many {many} are in your {cont}?', '12'), KD('What is your favourite fruit?', 'apple')]
      },
      p1: {
        show: { cap: 'How many minutes to walk to school? A number', eq: ['quantitative'] },
        items: [KD('What colour is your bike?', 'red'), KD('How many cousins do you have?', '6'), KD('What pet would you like?', 'cat'), KD('How long can you hop on one foot, in seconds?', '40'),
          KD('Which language do you speak at home?', 'Ojibwe'), KD('How many glasses of water do you drink a day?', '5')]
      },
      p2: {
        items: [KD('What is the mass of your backpack in kg?', '3'), KD('What is your favourite season?', 'fall'), KD('How many steps do you take before lunch?', '2400'),
          KD('Which game do you play at recess?', 'tag'), KD('How far do you live from the library, in km?', '2'), KD('Which instrument do you play?', 'drum')]
      },
      p3: {
        items: [KD('How many letters are in your first name?', '5'), KD('Which city were you born in?', 'Halifax'), KD('What is the temperature at noon, in °C?', '18'),
          KD('What snack do you bring?', 'crackers'), KD('How many times did you skip without stopping?', '35'), KD('Which bus do you take?', 'blue')]
      },
      think: {
        items: [{ q: '{b} says "shoe size" is qualitative because shoes are things. What would you tell {b}?', lines: { n: 3, key: 'Shoe size is a number you measure, so it is quantitative.' } },
          { q: 'Write a survey question that gives qualitative data.', lines: { n: 2, key: 'For example: What is your favourite animal?' } },
          { q: 'Write a survey question that gives quantitative data.', lines: { n: 2, key: 'For example: How many minutes do you read each night?' } },
          { q: 'Which graph fits qualitative data best? Explain.', lines: { n: 3, key: 'A bar graph: one bar for each category.' } }]
      }
    },

    'stem-leaf': {
      watch: 'leaving out repeated values or not ordering the leaves. Every value gets its own leaf, in order.',
      goal: 'I can read and make a stem-and-leaf plot.',
      learn: {
        show: { cap: 'Stem 3, leaf 4 means 34', eq: ['3 | 4 → 34'] },
        together: [SC([12, 15, 21, 26, 26, 30], 'count'), SC([41, 43, 47, 52, 58], 'greatest')],
        cue: 'Read a stem with each leaf: stem 3, leaf 4 is 34.',
        own: [SC([30, 32, 35, 44, 46, 51], 'least'), SC([60, 61, 67, 72, 75, 75, 80], 'count')]
      },
      p1: {
        show: { pic: ['stem', { data: [14, 17, 21, 23, 23] }], cap: 'Stem 2, leaf 3: 23 (twice)' },
        items: [SC([25, 27, 31, 36, 40], 'least'), SC([52, 58, 63, 64, 71], 'greatest'),
          SC([11, 14, 14, 20, 23], 'count'), SC([33, 35, 41, 41, 42, 50], 'count')]
      },
      p2: {
        items: [SC([45, 48, 52, 55, 55, 61, 66], 'count'), SL([20, 24, 31, 35, 38, 42, 47], 'range', 27, 'Greatest − least:'),
          SL([12, 18, 21, 25, 30], 'range', 18, 'Greatest − least:'),
          { q: 'Make a stem-and-leaf plot: 34, 21, 38, 25, 34, 40', draw: { h: 66, key: ['stem', { data: [34, 21, 38, 25, 34, 40] }] }, wide: true }]
      },
      p3: {
        items: [SC([62, 65, 71, 74, 74, 79, 83], 'count'), SL([40, 43, 51, 56, 58, 62], 'range', 22, 'Greatest − least:'),
          SC([105, 108, 112, 117, 121], 'greatest'),
          { q: 'Make a stem-and-leaf plot: 57, 49, 62, 51, 57, 66, 48', draw: { h: 64, key: ['stem', { data: [57, 49, 62, 51, 57, 66, 48] }] }, wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote stem 3 with leaves 4 and 4, then crossed one out. What went wrong?', lines: { n: 3, key: 'Every value gets a leaf. 34 twice means two 4 leaves.' } },
          { q: 'Why is a stem-and-leaf plot useful?', lines: { n: 3, key: 'It keeps every value and puts them in order, so the shape of the data is easy to see.' } },
          { q: 'What value does stem 6, leaf 0 show? How do you know?', lines: { n: 2, key: '60: 6 tens and 0 ones.' } },
          { q: 'Make up 6 test scores from 50 to 90 and plot them.', draw: { h: 90, key: 'Any 6 values with stems 5 to 9 and leaves in order.' } }]
      }
    },

    'double-bar': {
      watch: 'reading the wrong group. Check the legend before you read a bar.',
      goal: 'I can read a double bar graph.',
      learn: {
        show: { cap: 'Two bars for each day, one for each group', eq: ['Mon: 3 and 4'] },
        together: [DB('How many more Gr 5 than Gr 4 on Wed?', [[4, 6, 3], [5, 2, 7]], ['Gr 4', 'Gr 5'], 4, '7 − 3', null, 8)],
        cue: 'Check the legend. Then read across from the top of the bar to the scale.',
        own: [DB('How many in all on Mon?', [[4, 6, 3], [5, 2, 7]], ['Gr 4', 'Gr 5'], 9, '4 + 5', null, 8),
          DB('How many Gr 4 in all, Mon to Wed?', [[4, 6, 3], [5, 2, 7]], ['Gr 4', 'Gr 5'], 13, '4 + 6 + 3', null, 8)]
      },
      p1: {
        show: { cap: 'Tue: Gr 4 has 6, Gr 5 has 2', eq: ['6 − 2 = 4 more'] },
        items: [DB('How many boys on Thu?', [[6, 8, 4, 7, 9], [5, 9, 6, 5, 8]], ['Girls', 'Boys'], 5, '5'),
          DB('How many girls on Fri?', [[6, 8, 4, 7, 9], [5, 9, 6, 5, 8]], ['Girls', 'Boys'], 9, '9'),
          DB('How many more boys than girls on Wed?', [[6, 8, 4, 7, 9], [5, 9, 6, 5, 8]], ['Girls', 'Boys'], 2, '6 − 4'),
          DB('How many in all on Mon?', [[6, 8, 4, 7, 9], [5, 9, 6, 5, 8]], ['Girls', 'Boys'], 11, '6 + 5')]
      },
      p2: {
        items: [DB('How many more in July than in May for Team A?', [[4, 6, 10], [2, 8, 6]], ['Team A', 'Team B'], 6, '10 − 4', ['May', 'June', 'July']),
          DB('Which month did Team B beat Team A by 2? Write the number for Team B.', [[4, 6, 10], [2, 8, 6]], ['Team A', 'Team B'], 8, '8', ['May', 'June', 'July']),
          DB('How many goals did Team B score in all?', [[4, 6, 10], [2, 8, 6]], ['Team A', 'Team B'], 16, '2 + 8 + 6', ['May', 'June', 'July']),
          { q: 'Draw a double bar graph: Mon 3 and 5, Tue 6 and 4.', draw: { h: 100, key: ['dbar', { cats: ['Mon', 'Tue'], sets: [[3, 6], [5, 4]], keys: ['A', 'B'], max: 6, step: 2 }] } }]
      },
      p3: {
        items: [DB('How many more cars than trucks in all?', [[8, 6, 10, 4], [2, 4, 6, 2]], ['Cars', 'Trucks'], 14, '8 + 6 + 10 + 4 − (2 + 4 + 6 + 2)', ['8 am', '9 am', '10 am', '11 am']),
          DB('At 10 am, how many times as many cars as trucks?', [[8, 6, 10, 4], [2, 4, 6, 2]], ['Cars', 'Trucks'], 2, '4 ÷ 2', ['8 am', '9 am', '10 am', '11 am']),
          { q: 'Draw a double bar graph: Fall 8 and 4, Winter 2 and 6, Spring 6 and 6.', draw: { h: 110, key: ['dbar', { cats: ['Fall', 'Winter', 'Spring'], sets: [[8, 2, 6], [4, 6, 6]], keys: ['A', 'B'], max: 8, step: 2 }] }, wide: true }]
      },
      think: {
        items: [{ q: '{b} read the Boys bar as Girls. How can {b} avoid that?', lines: { n: 3, key: 'Read the legend first and match the bar to its colour or pattern.' } },
          { q: 'Why put two groups on one graph?', lines: { n: 3, key: 'To compare them side by side for each category.' } },
          { q: 'Write a question that can be answered with a double bar graph.', lines: { n: 2, key: 'For example: Did Grade 4 or Grade 5 read more books on Monday?' } },
          { q: 'What must every double bar graph have?', lines: { n: 2, key: 'A title, labels on both axes, a scale and a legend.' } }]
      }
    },

    'median-mode': {
      watch: 'finding the middle of the list as written, not in order. Put the values in order first.',
      goal: 'I can find the median and mode.',
      learn: {
        show: { cap: 'In order: 2, 3, 5, 5, 8', eq: ['Median: 5', 'Mode: 5'] },
        together: [ST('median', [7, 2, 9, 4, 5], 5), ST('mode', [3, 6, 3, 8, 1], 3)],
        cue: 'Median: put the values in order and take the middle. Mode: the value that shows up most.',
        own: [ST('median', [12, 8, 15, 10, 9], 10), ST('mode', [4, 7, 7, 2, 9, 7], 7), ST('median', [21, 30, 25], 25), ST('mode', [10, 15, 15, 20], 15)]
      },
      p1: {
        show: { cap: 'In order: 1, 4, 6, 6, 9', eq: ['Median: 6'] },
        items: [ST('median', [3, 1, 2], 2), ST('median', [6, 9, 4, 8, 5], 6), ST('mode', [5, 5, 2, 8], 5), ST('mode', [1, 4, 4, 4, 9], 4),
          ST('median', [14, 11, 18, 12, 16], 14), ST('mode', [20, 30, 30, 10], 30)]
      },
      p2: {
        items: [ST('median', [33, 41, 28, 35, 30, 39, 37], 35), ST('mode', [8, 6, 8, 5, 6, 8, 2], 8), ST('median', [50, 45, 60, 55, 40], 50),
          SL([21, 24, 24, 30, 33, 35, 41], 'median', 30, 'Find the median.'), ST('mode', [12, 15, 15, 15, 22, 28], 15), ST('mode', [17, 19, 19, 21, 21, 21], 21)]
      },
      p3: {
        items: [SL([40, 42, 47, 51, 53, 53, 60, 62, 68], 'median', 53, 'Find the median.'), SL([31, 34, 34, 34, 45, 47, 52], 'mode', 34, 'Find the mode.'),
          ST('median', [105, 98, 112, 101, 110], 105), { q: 'Data: 4, 9, 2, 7, 9, 5, 6', eq: ['Median: []', 'Mode: []'], a: [6, 9], stat: ['median', 'mode'], data: [4, 9, 2, 7, 9, 5, 6], wide: true }]
      },
      think: {
        items: [{ q: '{b} says the median of 7, 2, 9 is 2 because it is in the middle. What went wrong?', lines: { n: 3, key: 'Put the values in order first: 2, 7, 9. The median is 7.' } },
          { q: 'Make a list of 5 numbers with a median of 10 and a mode of 12.', lines: { n: 2, key: 'For example: 4, 8, 10, 12, 12.' } },
          { q: 'Can a set of data have no mode? Explain.', lines: { n: 3, key: 'Yes. If every value shows up only once, there is no mode.' } },
          { q: 'Data: 15, 12, 18, 12, 20', eq: ['Median: []', 'Mode: []'], a: [15, 12], stat: ['median', 'mode'], data: [15, 12, 18, 12, 20] }]
      }
    },

    mean: {
      watch: 'adding the values but forgetting to divide, or dividing by the wrong count. Count how many values first.',
      goal: 'I can find the mean by sharing equally.',
      learn: {
        show: { pic: ['bar', { cats: ['A', 'B', 'C'], vals: [2, 6, 4], max: 8, step: 2 }], cap: 'Level the bars: each is 4', eq: ['(2 + 6 + 4) ÷ 3 = 4'] },
        together: [ST('mean', [3, 5, 7], 5), ST('mean', [2, 4, 6, 8], 5)],
        cue: 'Add all the values. Divide by how many values there are.',
        own: [ST('mean', [6, 8, 10], 8), ST('mean', [1, 3, 5, 7], 4), ST('mean', [10, 20, 30], 20), ST('mean', [4, 4, 7], 5)]
      },
      p1: {
        show: { cap: 'Total 12, 3 values', eq: ['12 ÷ 3 = 4'] },
        items: [ST('mean', [2, 4, 6], 4), ST('mean', [5, 5, 5, 5], 5), ST('mean', [1, 2, 6], 3), ST('mean', [3, 7, 8], 6), ST('mean', [10, 12, 14], 12), ST('mean', [9, 1, 5], 5)]
      },
      p2: {
        items: [ST('mean', [12, 15, 18], 15), ST('mean', [20, 25, 30, 25], 25), ST('mean', [7, 9, 11, 13], 10), ST('mean', [40, 50, 60], 50),
          story('{a} reads 8, 10 and 12 pages on 3 nights. What is the mean pages a night?', 'pages', 10, '(8 + 10 + 12) ÷ 3'),
          story('3 {conts} hold 5, 9 and 7 {many}. If shared out equally, how many in each?', '{many}', 7, '(5 + 9 + 7) ÷ 3')]
      },
      p3: {
        items: [ST('mean', [14, 16, 18, 20, 22], 18), ST('mean', [35, 40, 45, 40], 40), ST('mean', [100, 120, 140], 120),
          story('{b} scored 6, 9, 7 and 10 in 4 games. What is the mean score?', 'points', 8, '(6 + 9 + 7 + 10) ÷ 4'),
          { q: 'Data: 2, 4, 6. A new value 20 is added. What is the new mean?', eq: ['[]'], a: [8], stat: 'mean', data: [2, 4, 6, 20] }]
      },
      think: {
        items: [{ q: '{b} says the mean of 4, 6 and 8 is 18. What went wrong?', lines: { n: 3, key: '{b} added but did not divide. 18 ÷ 3 = 6.' } },
          { q: 'Draw bars for 1, 5 and 6. Show how to level them.', draw: { h: 90, key: 'Move 1 from the 5 and 2 from the 6 to the 1: each bar is 4.' } },
          { q: 'Make a set of 3 numbers with a mean of 10.', lines: { n: 2, key: 'For example: 8, 10, 12 or 5, 10, 15.' } },
          { q: 'Data: 5, 5, 5, 25. Which is bigger, the mean or the median?', lines: { n: 3, key: 'The mean (10) is bigger than the median (5). The 25 pulls the mean up.' } }]
      }
    },

    likely: {
      watch: 'choosing "likely" for any colour that is on the spinner. Compare how many parts each colour has.',
      goal: 'I can describe how likely something is.',
      learn: {
        show: { cap: '3 of 4 parts are R', eq: ['R is likely'] },
        together: [CH(['B', 'B', 'G', 'G'], 'B', 2, 3), CH(['R', 'R', 'R', 'R'], 'Y', 0, 1)],
        cue: 'More than half the parts: likely. Exactly half: equally likely. None: impossible. All: certain.',
        own: [CH(['G', 'Y', 'Y', 'Y'], 'G', 1, 3), CH(['P', 'P', 'P'], 'P', 4, 3)]
      },
      p1: {
        items: [CH(['R', 'R', 'B'], 'R', 3, 4), CH(['R', 'R', 'B'], 'B', 1, 0), CH(['Y', 'Y', 'Y', 'Y'], 'Y', 4, 2), CH(['R', 'G', 'R', 'G'], 'G', 2, 1), CH(['B', 'B', 'B', 'G'], 'R', 0, 1), CH(['O', 'P', 'P', 'P', 'P'], 'O', 1, 3)]
      },
      p2: {
        items: [CH(['R', 'R', 'R', 'B', 'B', 'G'], 'R', 2, 3), CH(['R', 'R', 'R', 'B', 'B', 'G'], 'G', 1, 0), CH(['Y', 'Y', 'Y', 'Y', 'Y', 'B'], 'Y', 3, 2),
          CH(['B', 'G', 'B', 'G', 'B', 'G'], 'B', 2, 1),
          { q: 'Colour the spinner so landing on red is likely.', pic: ['spin', { parts: ['', '', '', ''] }], draw: { h: 4, key: '3 or 4 of the 4 parts red (3 for likely but not certain).' } },
          { q: 'Colour the spinner so blue is impossible.', pic: ['spin', { parts: ['', '', ''] }], draw: { h: 4, key: 'No part blue.' } }]
      },
      p3: {
        items: [CH(['R', 'B', 'B', 'G', 'G', 'G', 'G', 'G'], 'G', 3, 4), CH(['R', 'B', 'B', 'G', 'G', 'G', 'G', 'G'], 'R', 1, 3), CH(['R', 'B', 'B', 'G', 'G', 'G', 'G', 'G'], 'Y', 0, 3),
          { q: 'Colour the spinner so green and blue are equally likely.', pic: ['spin', { parts: ['', '', '', '', '', ''] }], draw: { h: 4, key: '3 parts green and 3 parts blue.' } },
          { q: 'A bag has 5 red and 1 blue cube. Is red likely or unlikely?', lines: { n: 2, key: 'Likely: 5 of the 6 cubes are red.' } }]
      },
      think: {
        items: [{ q: '{b} says blue is likely because blue is on the spinner. The spinner has 1 blue part of 5. What would you tell {b}?', lines: { n: 3, key: '1 of 5 parts is less than half, so blue is unlikely.' } },
          { q: 'Describe an event at school that is certain, and one that is impossible.', lines: { n: 3, key: 'For example: certain, the sun sets tonight; impossible, a cat teaches math.' } },
          { q: 'Design a spinner where red is likely and blue is unlikely.', draw: { h: 80, key: 'For example: 4 parts, 3 red and 1 blue.' } },
          { q: 'Why can something unlikely still happen?', lines: { n: 3, key: 'Unlikely means it does not happen often, not never.' } }]
      }
    },

    groups: {
      watch: 'thinking a single new value cannot change the mean. A very big or very small new value pulls the mean toward it.',
      goal: 'I can predict how the data of two groups will compare.',
      learn: {
        show: { cap: 'Add 30 to 4, 6, 8: the mean jumps', eq: ['Mean 6, then 12'] },
        together: [{ q: 'Data: 5, 7, 9. Add 19. New mean?', eq: ['[]'], a: [10], stat: 'mean', data: [5, 7, 9, 19] }, ST('median', [3, 5, 7, 9, 41], 7)],
        cue: 'A very big new value pulls the mean up. The median barely moves.',
        own: [{ q: 'Data: 2, 4, 6. Add 28. New mean?', eq: ['[]'], a: [10], stat: 'mean', data: [2, 4, 6, 28] }, ST('mean', [10, 10, 10, 30], 15),
          ST('median', [10, 10, 10, 30], 10), ST('mean', [1, 2, 3, 2], 2)]
      },
      p1: {
        show: { cap: '4, 4, 4 has mean 4. Add 16', eq: ['(4 + 4 + 4 + 16) ÷ 4 = 7'] },
        items: [ST('mean', [3, 3, 3, 11], 5), ST('median', [3, 3, 3, 11], 3), ST('mean', [6, 6, 12], 8), ST('median', [6, 6, 12], 6),
          ST('mean', [5, 5, 5, 5, 30], 10), ST('median', [5, 5, 5, 5, 30], 5)]
      },
      p2: {
        items: [{ q: 'Grade 4 heights in cm: 130, 134, 138. Grade 1: 110, 114, 118. 3 students each. Which mean is greater?', pick: { opts: ['Grade 4', 'Grade 1'], ans: 0, more: ['(130 + 134 + 138) ÷ 3', '(110 + 114 + 118) ÷ 3'] }, wide: true },
          ST('mean', [130, 134, 138], 134), ST('mean', [110, 114, 118], 114),
          { q: 'Team A ran 6, 8, 10 laps. Team B ran 9, 9, 12. 3 runners each. Which team has the greater mean?', pick: { opts: ['Team A', 'Team B'], ans: 1, more: ['(6 + 8 + 10) ÷ 3', '(9 + 9 + 12) ÷ 3'] }, wide: true },
          ST('median', [6, 8, 10], 8), ST('median', [9, 9, 12], 9)]
      },
      p3: {
        items: [{ q: 'Data: 12, 14, 16. Add 38. New mean?', eq: ['[]'], a: [20], stat: 'mean', data: [12, 14, 16, 38] },
          ST('median', [12, 14, 16, 38], 15),
          { q: 'Class A read 4, 6, 8 books. Class B read 3, 5, 20. 3 students each. Which has the greater mean?', pick: { opts: ['Class A', 'Class B'], ans: 1, more: ['(4 + 6 + 8) ÷ 3', '(3 + 5 + 20) ÷ 3'] }, wide: true },
          { q: 'Class A: 4, 6, 8. Class B: 3, 5, 20. Which has the greater median?', pick: { opts: ['Class A', 'Class B'], ans: 0, more: ['6', '5'] }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says adding one big value cannot change the mean. What would you tell {b}?', lines: { n: 3, key: 'It can: the total grows a lot, so the mean goes up. The median moves only a little.' } },
          { q: 'Predict: will Grade 8 students or Grade 2 students have the greater mean arm span? Why?', lines: { n: 3, key: 'Grade 8: older students are usually taller, with longer arms.' } },
          { q: 'Two groups have the same mean. Must their data be the same? Explain.', lines: { n: 3, key: 'No. 4, 6, 8 and 2, 6, 10 both have a mean of 6.' } },
          { q: 'How could you test your prediction about two groups?', lines: { n: 3, key: 'Collect data from both groups, then find and compare the means or medians.' } }]
      }
    }
  } });
})();
