/* Grade 5 settings for the shared grade app (assets/engine/site.js): chapters, home page text and options. */
Atlas.setup({
  grade: 5,
  tools: ['disks', 'base10', 'numberline', 'fractions', 'areagrid', 'geoboard', 'coins', 'scale', 'tiles'],
  meta: [
    { id: 'place-value', title: 'Place Value', sub: 'whole numbers to 100 000', strand: 'B', codes: 'B1.1, B1.2',
      desc: 'Read, write, build, compare and order big numbers.' },
    { id: 'fractions', title: 'Fractions', sub: 'equal parts of a whole', strand: 'B', codes: 'B1.3, B1.4, B2.5, B2.8',
      desc: 'Equivalent fractions, mixed numbers, comparing, adding like fractions, and unit fractions.' },
    { id: 'decimals', title: 'Decimals and Percents', sub: 'tenths, hundredths, out of 100', strand: 'B', codes: 'B1.5, B1.6, B1.7, B2.3, B2.4',
      desc: 'Read and compare decimals, round to tenths, link to fractions and percents, add and subtract.' },
    { id: 'multiply-divide', title: 'Multiplying and Dividing', sub: 'area models and algorithms', strand: 'B', codes: 'B2.1, B2.2, B2.6, B2.7',
      desc: 'Facts to 12 &times; 12, two-digit by two-digit multiplying, and dividing by two-digit numbers.' },
    { id: 'ratios', title: 'Ratios and Rates', sub: 'comparing two amounts', strand: 'B', codes: 'B2.9',
      desc: 'Write ratios, make equivalent ratios with tables, and work with rates like km per hour.' },
    { id: 'patterns-algebra', title: 'Patterns, Equations and Code', sub: 'rules, variables, loops', strand: 'C', codes: 'C1.1 to C3.2',
      desc: 'Growing and shrinking patterns, expressions, equations, inequalities and code with conditions.' },
    { id: 'data-probability', title: 'Data and Probability', sub: 'samples, graphs, averages, chance', strand: 'D', codes: 'D1.1 to D2.2',
      desc: 'Sampling, relative frequency, stacked-bar and misleading graphs, mean and median, probability.' },
    { id: 'shapes-grids', title: 'Shapes and Grids', sub: 'triangles, views, coordinates', strand: 'E', codes: 'E1.1 to E1.5',
      desc: 'Kinds of triangles, congruent shapes, views of objects, coordinates and transformations.' },
    { id: 'measurement', title: 'Measurement', sub: 'units, angles, area', strand: 'E', codes: 'E2.1 to E2.6',
      desc: 'Metric conversions, measuring angles, area of parallelograms and triangles, area and perimeter.' },
    { id: 'money', title: 'Money Matters', sub: 'spending, budgets, credit, taxes', strand: 'F', codes: 'F1.1 to F1.6',
      desc: 'Ways to pay, sales tax, budgets, credit and debt, better buys, and what taxes pay for.' },
    { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
      desc: 'Place value, equivalents, formulas, units and angle names.' }
  ],
  home: {
    hero: '<h1>Grade 5 Math, taken apart</h1>' +
      '<p class="lede">A free study site for Ontario Grade 5 math. Short lessons, drawings you can change, practice that adjusts to you, and a check-up that shows what to work on next.</p>',
    start: '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It takes about 20 minutes and builds a practice plan for you.</p>',
    notes: '<p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 5. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning skills and math processes) is woven through, not taught as its own chapter. Mathematical modelling (C4) has no chapter of its own. Infographics (D1.4) are described but not built on the site.</p>'
  }
});
