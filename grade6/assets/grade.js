/* Grade 6 settings for the shared grade app (assets/engine/site.js): chapters, home page text and options,
   then Grade 6's own fraction text. */
Atlas.setup({
  grade: 6,
  tools: ['base10', 'disks', 'numberline', 'fractions', 'balance', 'patterns', 'data', 'tiles', 'areagrid', 'geoboard', 'scale', 'coins'],
  meta: [
    { id: 'numbers-integers', title: 'Big Numbers, Integers and Factors', sub: 'to one million, below zero, prime factors', strand: 'B', codes: 'B1.1, B1.2, B1.3, B2.2, B2.6',
      desc: 'Read numbers to one million, use negative numbers, divisibility rules and factor trees.' },
    { id: 'decimals', title: 'Decimals to Thousandths', sub: 'tenths, hundredths, thousandths', strand: 'B', codes: 'B1.3, B1.4, B1.5, B1.6',
      desc: 'Read, compare, order and round decimals, and match them to fractions.' },
    { id: 'fractions', title: 'Fractions', sub: 'unlike denominators, groups of a fraction', strand: 'B', codes: 'B1.3, B2.5, B2.9, B2.10',
      desc: 'Add and subtract unlike fractions, multiply and divide whole numbers by fractions.' },
    { id: 'decimal-ops', title: 'Decimal Calculations', sub: 'add, subtract, multiply, divide', strand: 'B', codes: 'B2.1, B2.4, B2.7, B2.8, B2.11',
      desc: 'Estimate first, then add, subtract, multiply and divide with decimals.' },
    { id: 'ratios-percents', title: 'Ratios, Rates and Percents', sub: 'comparing and scaling', strand: 'B', codes: 'B2.1, B2.3, B2.12',
      desc: 'Ratio tables, unit rates, better buys and percents of a number in your head.' },
    { id: 'patterns-algebra', title: 'Patterns, Equations and Code', sub: 'rules, variables, balance', strand: 'C', codes: 'C1.1 to C3.2',
      desc: 'Growing and shrinking patterns, expressions, equations, inequalities and code with conditions.' },
    { id: 'data-probability', title: 'Data, Graphs and Probability', sub: 'histograms, averages, chance', strand: 'D', codes: 'D1.1 to D2.2',
      desc: 'Discrete and continuous data, histograms, broken-line graphs, mean, median, mode and chance.' },
    { id: 'shapes-grids', title: 'Shapes, Grids and Moves', sub: 'quadrilaterals, views, four quadrants', strand: 'E', codes: 'E1.1 to E1.4',
      desc: 'Properties of quadrilaterals, views of 3D objects, the four-quadrant grid and transformations.' },
    { id: 'measurement', title: 'Measuring', sub: 'units, angles, area, surface area', strand: 'E', codes: 'E2.1 to E2.6',
      desc: 'Metric conversions, angles up to 360&deg;, area of trapezoids and kites, nets and surface area.' },
    { id: 'money', title: 'Money Matters', sub: 'paying, saving, interest', strand: 'F', codes: 'F1.1 to F1.5',
      desc: 'Ways to pay, saving goals, interest and fees, and trading, lending and donating.' },
    { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
      desc: 'Place value, divisibility, equivalents, formulas, units and angle facts.' }
  ],
  home: {
    hero: '<h1>Grade 6 Math, step by step</h1>' +
      '<p class="lede">A free study site for Ontario Grade 6 math. Short lessons built around pictures, drawings you can change, practice that adjusts to you, and a check-up that shows what to work on next.</p>',
    start: '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It takes about 20 minutes and builds a practice plan for you.</p>',
    notes: '<p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 6. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning skills and math processes) is woven through, not taught as its own chapter. Mathematical modelling (C4) has no chapter of its own. Infographics (D1.4) are described but not built on the site. Coding (C3) is taught with short code you read and change on paper, not a live coding tool.</p>'
  },
  /* typed answers: the minus signs − and – count as - */
  parseNum: function (t) { return parseFloat(String(t).replace(/[\u2212\u2013]/g, '-').replace(/[^0-9.\-]/g, '')); }
});

/* a stacked fraction for HTML text */
Atlas.fr = function (n, d) { return '<span class="fr" role="math" aria-label="' + n + ' over ' + d + '"><span>' + n + '</span><span>' + d + '</span></span>'; };
