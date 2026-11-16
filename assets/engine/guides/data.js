/* Teaching guide: Data and chance (Toolbox tool 'data', every grade). Format: see assets/engine/guide.js. */
AtlasGuide.add('data', {
  what: 'Sorting, surveys and graphs, number lists with mean, median and mode (Grade 4 and up), and chance experiments.',
  keys: [
    ['Sort', 'Tap or drag shapes into groups by one rule, or by two rules in a Venn or Carroll diagram (Grade 2 and up). Sort them all does it for you.'],
    ['Graph', 'A survey with − and + for each answer, shown as a tally, picture graph, bar graph and more by grade.'],
    ['Numbers', 'Grade 4 and up: a list of numbers as a stem-and-leaf plot, with the mean, median and mode; more graphs by grade.'],
    ['Chance', 'A spinner, bag, coin or die, tried 1, 10 or 100 times, with what should happen and what did.'],
    ['Show number', 'Shows counts, averages and probabilities.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 3],
      start: [
        'In <b>Sort</b>, drag a few shapes into the red group. Ask: “What is my rule?”',
        'Tap <b>Sort them all</b>. Ask: “How many are red? How many are not?”',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Sort by a rule', codes: { 1: ['D1.1'], 2: ['D1.1'], 3: ['D1.1'] },
          goal: 'A sorting rule decides where each thing goes.',
          ido: { 1: 'Sort by “red”. Say for each shape: “Red: in. Not red: out.”', 2: 'Choose <b>Venn</b>: red and triangle. “A red triangle goes in the middle.”', 3: 'Choose <b>Carroll</b>: red or not, triangle or not. Place each shape and say why.' },
          wedo: 'Together, choose a new rule and sort a few shapes.',
          youdo: 'The child sorts by a secret rule; you guess the rule.',
          ask: '“Where does this shape go? Why?”'
        },
        {
          t: 'Make a graph', codes: { 1: ['D1.2', 'D1.3'], 2: ['D1.2', 'D1.3'], 3: ['D1.2', 'D1.3'] },
          goal: 'Collect answers, then show them in a graph.',
          ido: 'In <b>Graph</b>, ask the family their favourite fruit. Tap + for each answer. Look at the tally and the graph.',
          wedo: { 1: 'Together, read the picture graph: “Which has the most?”', 2: 'Together, compare the bar graph and the tally.', 3: 'Together, read the picture graph where 1 picture = 2.' },
          youdo: 'The child asks their own question, collects answers and shows the graph.',
          ask: '“What title should this graph have?”'
        },
        {
          t: 'Read the graph', codes: { 1: ['D1.4', 'D1.5'], 2: ['D1.4', 'D1.5'], 3: ['D1.4', 'D1.5'] },
          goal: 'A graph answers questions. The mode is the most common answer.',
          ido: 'Point to the tallest bar: “Apple is the most popular. That is the mode.”',
          wedo: { 1: 'Together: “How many more chose apple than banana?”', 2: 'Together: “What is the mode? What does it tell us?”', 3: 'Together, find the fair share (mean) of a small set by evening out the bars.' },
          youdo: 'The child writes two questions the graph answers, and answers them.',
          ask: '“What should we buy for snack? Why?”'
        },
        {
          t: 'How likely?', codes: { 1: ['D2.1'], 2: ['D2.1'], 3: ['D2.1'] },
          goal: 'Some things are impossible, some possible, some certain.',
          ido: 'In <b>Chance</b>, make a spinner with 2 red parts of 4. “Red is as likely as not.” Spin 10 times.',
          wedo: 'Together, change the spinner so red is certain, then impossible.',
          youdo: { 1: 'The child makes a spinner where blue is possible but not certain.', 2: 'The child makes a spinner where red is likely, then its opposite.', 3: 'The child makes a spinner where red is unlikely, and tests it 100 times.' },
          ask: '“Why didn’t red come up exactly half the time?”'
        }
      ],
      mistakes: [
        ['Puts a red triangle in only one circle of the Venn.', 'It is red AND a triangle: the middle.'],
        ['Reads the picture graph without the key.', 'Check the key: 1 picture may be 2.'],
        ['Thinks “likely” means “will happen”.', 'Spin 10 times: likely things do not always happen.'],
        ['Counts a tally of 5 as 4.', 'The fifth mark crosses the four.']
      ]
    },
    {
      grades: [4, 8],
      start: [
        'In <b>Numbers</b>, look at the list. Ask: “What is a typical value here?”',
        'Turn on <b>Show number</b> to see the mean, median and mode.',
        'Tap one number to take it off. Ask: “Which average changed most?” Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Mean, median and mode', codes: { 4: ['D1.5'], 5: ['D1.5'], 6: ['D1.5'], 7: ['D1.5'] },
          goal: 'Three ways to find a typical value.',
          ido: 'Read the list. “The median is the middle. The mode is the most common. The mean is the fair share.”',
          wedo: { 4: 'Together, put the numbers in order and find the median.', 5: 'Together, find the mean of a list with decimals.', 6: 'Together, find the range and say what it tells us.', 7: 'Together, take off the biggest number and see how the mean changes.' },
          youdo: 'The child makes a list of 7 numbers with a mean of 10.',
          ask: '“Which average is best here? Why?”'
        },
        {
          t: 'Choose the graph', codes: { 4: ['D1.3'], 5: ['D1.3'], 6: ['D1.3'], 7: ['D1.3'], 8: ['D1.3'] },
          goal: 'Each graph fits a different kind of data.',
          ido: { 4: 'In <b>Graph</b>, show two classes as a double-bar graph. “It compares the classes side by side.”', 5: 'Show a stacked bar. “It shows parts of the whole.”', 6: 'In <b>Numbers</b>, show a histogram. “Measured data in intervals.”', 7: 'In <b>Graph</b>, show a circle graph. “Percents of the whole.”', 8: 'In <b>Numbers</b>, show pairs on a scatter plot. “Is there a relationship?”' },
          wedo: 'Together, decide which graph you would use for: favourite sports, heights, time spent on homework.',
          youdo: 'The child picks a graph for a question you give and explains why.',
          ask: '“What would be misleading about the wrong graph?”'
        },
        {
          t: 'Should vs did', codes: { 4: ['D2.1'], 5: ['D2.2'], 6: ['D2.2'], 7: ['D2.2'], 8: ['D2.2'] },
          goal: 'More tries get closer to what should happen.',
          ido: 'In <b>Chance</b>, spin a half-red spinner 10 times, then 100 times. Compare the grey bars (should) with the coloured bars (did).',
          wedo: { 4: 'Together, place red on the probability line.', 5: 'Together, write red as a fraction.', 6: 'Together, try a coin and a die at once (12 outcomes).', 7: 'Together, draw from a bag without putting back and see how the chances change.', 8: 'Together, run three coins in a row 100 times.' },
          youdo: 'The child predicts the result of 100 tries, then runs them.',
          ask: '“Why are 10 tries less reliable than 100?”'
        },
        {
          t: 'Scatter plots', codes: { 8: ['D1.5'] },
          goal: 'Points show if two things are related.',
          ido: 'In <b>Numbers</b>, show height and arm span pairs. “As height goes up, arm span goes up: strong, positive.”',
          wedo: 'Together, add a point that does not fit and see the trend line move.',
          youdo: 'The child describes the relationship in words.',
          ask: '“Does a relationship mean one causes the other?”'
        },
        {
          t: 'Tree diagrams', codes: { 8: ['D2.1'] },
          goal: 'A tree lists every outcome.',
          ido: 'In <b>Chance</b>, draw the tree for two coins. “HH, HT, TH, TT. HH is 1/4.”',
          wedo: 'Together, find the chance of one head and one tail (1/2).',
          youdo: 'The child draws a tree for a coin and a 3-part spinner.',
          ask: '“Why are HT and TH different outcomes?”'
        }
      ],
      mistakes: [
        ['Finds the median without putting the numbers in order.', 'Order them first.'],
        ['Thinks 5 heads in a row makes tails more likely.', 'Each flip is still 1/2.'],
        ['Uses a bar graph for parts of a whole.', 'Try a stacked bar or circle graph.'],
        ['Expects exactly 50 reds in 100 spins.', 'Close to 50 is expected; exactly 50 is not.']
      ]
    }
  ]
});
