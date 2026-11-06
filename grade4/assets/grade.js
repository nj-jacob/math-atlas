/* Grade 4 settings for the shared grade app (assets/engine/site.js): chapters, home page text and options,
   then Grade 4's own fraction text. */
Atlas.setup({
  grade: 4,
  tools: ['base10', 'disks', 'clock', 'areagrid', 'scale', 'hundred', 'numberline', 'fractions', 'balance', 'coins', 'geoboard'],
  meta: [
    { id: 'numbers', title: 'Numbers to 10 000', sub: 'read, build, compare and round', strand: 'B', codes: 'B1.1, B1.2, B1.3',
      desc: 'Place value to 10 000 with blocks and charts. Compare, order, and round to 10, 100 or 1000.' },
    { id: 'add-subtract', title: 'Adding and Subtracting', sub: 'regrouping and checking', strand: 'B', codes: 'B2.1, B2.4',
      desc: 'Add and subtract to 10 000 with blocks, number lines and the column method. Estimate and check.' },
    { id: 'multiply-divide', title: 'Multiplying and Dividing', sub: 'facts, arrays and sharing', strand: 'B', codes: 'B2.1, B2.2, B2.3, B2.5, B2.6, B2.8',
      desc: 'Facts to 10 &times; 10, times 10, 100 and 1000, area models, sharing with remainders, and rates.' },
    { id: 'fractions', title: 'Fractions', sub: 'halves to tenths', strand: 'B', codes: 'B1.4, B1.5, B1.6, B2.7',
      desc: 'Numerator and denominator, fair shares, comparing, counting by fractions, and groups of unit fractions.' },
    { id: 'decimals', title: 'Decimal Tenths', sub: 'one tenth is 0.1', strand: 'B', codes: 'B1.7, B1.8, B1.9, B2.3, B2.4',
      desc: 'Read, compare and round tenths, link tenths to fractions, and add and subtract them.' },
    { id: 'patterns', title: 'Patterns, Equations and Code', sub: 'rules, missing numbers, loops', strand: 'C', codes: 'C1.1 to C3.2',
      desc: 'Repeating and growing patterns, tables and graphs, solving for a symbol, inequalities, and code with loops.' },
    { id: 'data', title: 'Data and Chance', sub: 'collect, graph, describe, predict', strand: 'D', codes: 'D1.1 to D2.2',
      desc: 'Kinds of data, stem-and-leaf plots, double bar graphs, mean, median, mode, and the probability line.' },
    { id: 'shapes', title: 'Shapes, Angles and Grids', sub: 'rectangles, angles, slides and flips', strand: 'E', codes: 'E1.1, E1.2, E1.3, E2.4',
      desc: 'Properties of rectangles, kinds of angles, coordinates, translations and reflections.' },
    { id: 'measuring', title: 'Measuring', sub: 'mass, capacity, time and area', strand: 'E', codes: 'E2.1, E2.2, E2.3, E2.5, E2.6',
      desc: 'Grams and kilograms, litres and millilitres, metric prefixes, elapsed time, and area of rectangles.' },
    { id: 'money', title: 'Money and Smart Choices', sub: 'pay, save, spend, give', strand: 'F', codes: 'F1.1 to F1.5',
      desc: 'Ways to pay, totals and change in whole dollars, spending and saving, and spotting a good price.' },
    { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
      desc: 'Place value, facts, fractions and decimals, units, time, angles and area.' }
  ],
  home: {
    hero: '<h1>Grade 4 Math, one step at a time</h1>' +
      '<p class="lede">A free study site for Ontario Grade 4 math. Short lessons with lots of pictures, drawings you can change, practice that adjusts to you, and a check-up that shows what to work on next.</p>',
    start: '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It takes about 20 minutes and builds a practice plan for you.</p>',
    notes: '<p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 4. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning skills and math processes) is woven through, not taught as its own chapter. Mathematical modelling (C4) has no chapter of its own. Infographics (D1.4) are described, but students make them on paper, not on the site. Coding (C3) uses simple step lists, not a real coding app.</p>'
  },
  svgLabelText: true,
  diskLabel: { x: 130, y: 6, size: 16 }
});

/* a stacked fraction in html, and a mixed number like 2 3/4 */
Atlas.fr = function (n, d) { return '<span class="fr" aria-label="' + n + ' over ' + d + '"><sup>' + n + '</sup><sub>' + d + '</sub></span>'; };
Atlas.mixed = function (w, n, d) { return (w ? w + ' ' : '') + (n ? Atlas.fr(n, d) : ''); };
