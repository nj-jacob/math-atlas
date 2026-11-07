/* Grade 3 settings for the shared grade app (assets/engine/site.js): chapters, home page text and options. */
Atlas.setup({
  grade: 3,
  tools: ['base10', 'disks', 'clock', 'areagrid', 'counters', 'hundred', 'numberline', 'fractions', 'balance', 'patterns', 'data', 'coins', 'geoboard'],
  meta: [
    { id: 'numbers-1000', title: 'Numbers to 1000', sub: 'hundreds, tens and ones', strand: 'B', codes: 'B1.1 to B1.5',
      desc: 'Build, read and write numbers to 1000. Skip count, compare and round.' },
    { id: 'add-subtract', title: 'Adding and Subtracting', sub: 'sums up to 1000', strand: 'B', codes: 'B2.3, B2.4, B2.5, C2.3',
      desc: 'Mental math, estimating, and adding and subtracting with blocks and on paper.' },
    { id: 'multiply-divide', title: 'Multiplying and Dividing', sub: 'equal groups and arrays', strand: 'B', codes: 'B2.1, B2.2, B2.6, B2.9',
      desc: 'Arrays, facts of 2, 5 and 10, sharing and grouping, and scaling up.' },
    { id: 'fractions', title: 'Fractions and Fair Shares', sub: 'equal parts', strand: 'B', codes: 'B1.6, B1.7, B2.7, B2.8',
      desc: 'Share things fairly, name fractions, and find fractions that are the same size.' },
    { id: 'patterns', title: 'Patterns, Equations and Code', sub: 'rules, equal sides, steps', strand: 'C', codes: 'C1.1 to C3.2',
      desc: 'Repeating patterns, pattern rules, variables, equal expressions and simple code.' },
    { id: 'data', title: 'Data and Chance', sub: 'sort, graph, predict', strand: 'D', codes: 'D1.1 to D2.2',
      desc: 'Sort with Venn and Carroll diagrams, make graphs, find the mean and mode, and talk about chance.' },
    { id: 'shapes', title: '3D Shapes and Directions', sub: 'faces, edges, turns', strand: 'E', codes: 'E1.1 to E1.4',
      desc: 'Cubes, prisms, pyramids, cylinders and cones, matching shapes, and giving directions.' },
    { id: 'length-area', title: 'Length, Perimeter and Area', sub: 'units, perimeter, area', strand: 'E', codes: 'E2.1, E2.2, E2.5, E2.7 to E2.9',
      desc: 'Metric units of length, the distance around a shape, and how much space a shape covers.' },
    { id: 'time-mass', title: 'Time, Mass and Capacity', sub: 'clocks, balances, containers', strand: 'E', codes: 'E2.3, E2.4, E2.6',
      desc: 'Tell time on clocks, compare mass with a pan balance, and measure how much a container holds.' },
    { id: 'money', title: 'Money: Making Change', sub: 'coins, bills and change', strand: 'F', codes: 'F1.1',
      desc: 'Count Canadian coins and bills, and find the change from a purchase.' },
    { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
      desc: 'Place value, facts of 2, 5 and 10, fractions, units, shapes and coins.' }
  ],
  home: {
    hero: '<h1>Grade 3 Math, one step at a time</h1>' +
      '<p class="lede">A free study site for Ontario Grade 3 math. Short lessons, pictures you can change, practice that adjusts to you, and a check-up that shows what to work on next.</p>' +
      '<p class="t2">An atlas is a book of maps. This one maps out the math of Grade 3, one chapter at a time.</p>',
    start: '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It takes about 15 minutes and builds a practice plan for you.</p>',
    notes: '<p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 3. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning skills and math processes) is woven through, not taught as its own chapter. Mathematical modelling (C4) has no chapter of its own.</p>'
  },
  wholeDollars: true
});
