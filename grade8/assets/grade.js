/* Grade 8 settings for the shared grade app (assets/engine/site.js): chapters, home page text and options,
   then Grade 8's own number text, typed-answer rules and page motion. */
Atlas.setup({
  grade: 8,
  tools: ['numberline', 'tiles', 'fractions', 'areagrid', 'geoboard', 'coins'],
  meta: [
    { id: 'big-small', title: 'Big and Small Numbers', sub: 'powers of ten and scientific notation', strand: 'B', codes: 'B1.1, B2.3, E2.1',
      desc: 'Powers of ten, multiplying and dividing by 10, 100 and 1000, scientific notation, and mega to pico units.' },
    { id: 'roots-real', title: 'Squares, Roots and Real Numbers', sub: 'perfect squares and the numbers between', strand: 'B', codes: 'B1.2, B1.3, B2.2',
      desc: 'Perfect squares, square roots, estimating roots, and sorting rational and irrational numbers.' },
    { id: 'integers', title: 'Integers', sub: 'working with negatives', strand: 'B', codes: 'B2.4, B2.7',
      desc: 'Add, subtract, multiply and divide integers with counters, number lines and sign rules.' },
    { id: 'fractions', title: 'Fractions', sub: 'all four operations', strand: 'B', codes: 'B2.5, B2.6',
      desc: 'Add and subtract with common denominators, multiply with area models, divide by measuring.' },
    { id: 'percent-ratio', title: 'Percents, Ratios and Rates', sub: 'comparing and scaling', strand: 'B', codes: 'B1.4, B2.1, B2.8',
      desc: 'Percents above 100% and below 1%, percent change, proportions, unit rates and order of operations.' },
    { id: 'algebra', title: 'Patterns, Expressions and Equations', sub: 'rules, like terms, balance', strand: 'C', codes: 'C1.1 to C2.4',
      desc: 'Linear patterns, collecting like terms, evaluating, solving equations and graphing inequalities.' },
    { id: 'data', title: 'Data and Graphs', sub: 'scatter plots, trends, code', strand: 'D', codes: 'D1.1 to D1.6, C3.1, C3.2',
      desc: 'Two-variable data, choosing graphs, strong and weak trends, outliers, misleading graphs and data code.' },
    { id: 'probability', title: 'Probability', sub: 'trees, Venn diagrams, events', strand: 'D', codes: 'D2.1, D2.2',
      desc: 'Theoretical and experimental probability, independent and dependent events, tree and Venn diagrams.' },
    { id: 'geometry', title: 'Angles, Shapes and Moves', sub: 'angle rules, transformations, scale', strand: 'E', codes: 'E1.1 to E1.4, E2.2',
      desc: 'Parallel-line angles, polygon angles, transformations on a grid, tessellations, views and scale drawings.' },
    { id: 'measurement', title: 'Pythagoras, Area and Volume', sub: 'right triangles, circles, solids', strand: 'E', codes: 'E2.3, E2.4',
      desc: 'The Pythagorean theorem, circles, composite shapes, surface area and volume.' },
    { id: 'money', title: 'Money and Planning', sub: 'budgets, interest, credit', strand: 'F', codes: 'F1.1 to F1.6',
      desc: 'Exchange rates, budgets, a long-term plan with taxes, simple and compound interest, better buys and credit cards.' },
    { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
      desc: 'Squares, powers of ten, prefixes, sign rules, formulas and angle facts.' }
  ],
  home: {
    hero: '<p class="kicker">Ontario &middot; Grade 8 &middot; 2020 curriculum</p><h1>Grade 8 Math, one clear step at a time</h1>' +
      '<p class="lede">A free study guide for Ontario Grade 8 math. Each lesson shows a worked example, then asks you to try one. Practice adjusts to you, and the check-up shows what to work on next.</p>',
    start: '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It takes about 10 minutes and builds a practice plan for you.</p>',
    contents: '<h2 class="toch">Contents</h2>',
    card: function (m, i, stats) {
      return '<a class="card" data-strand="' + m.strand + '" href="#' + m.id + '">' +
        '<span class="no">' + (m.ref ? '&#9733;' : (i < 9 ? '0' : '') + (i + 1)) + '</span><span class="cbody"><h2>' + m.title + '</h2><p class="sub">' + m.sub + '</p><p class="desc">' + m.desc + '</p>' +
        '<span class="meta"><span class="pill" data-strand="' + m.strand + '">' + Atlas.strands[m.strand] + '</span>' + stats + '</span></span></a>';
    },
    notes: '<p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 8. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>How each lesson works.</b> A short explanation and picture, a worked example, then a "Your turn" question. A wrong answer points you back to the step to look at again. Each chapter starts with a warm-up from earlier chapters.</p>' +
      '<p><b>Not covered:</b> strand A (social-emotional learning skills and math processes) is woven through, not taught as its own chapter. Mathematical modelling (C4) has no chapter of its own. Building an infographic (D1.4) is described but not built on the site.</p>'
  },
  groupDecimals: true
});

(function () {
  'use strict';
  /* fraction text: 7/4 -> "7/4", whole -> "3" */
  Atlas.frac = function (n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = Atlas.gcd(n, d) || 1; n /= g; d /= g;
    return d === 1 ? String(n) : n + '/' + d;
  };
  /* a stacked fraction for display */
  Atlas.fr = function (n, d) { return '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>'; };
  /* a times-ten-to-the-power expression */
  Atlas.sci = function (a, e) { return '<span class="math">' + a + ' &times; 10<sup>' + String(e).replace('-', '&minus;') + '</sup></span>'; };
  Atlas.neg = function (n) { return n < 0 ? '&minus;' + Math.abs(n) : String(n); };

  /* typed answers: whole numbers, decimals, fractions (3/4), mixed numbers (1 3/4), and the minus signs − and – */
  function parseNum(t) {
    t = String(t).replace(/[\u2212\u2013]/g, '-').replace(/,/g, '').trim();
    var m = t.match(/^(-?)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]);
    m = t.match(/^(-?\d*\.?\d+)\s*\/\s*(-?\d*\.?\d+)$/);
    if (m) return +m[2] ? m[1] / m[2] : NaN;
    t = t.replace(/\s/g, '');
    return parseFloat(t.replace(/[^0-9.\-]/g, ''));
  }
  Atlas.parseNum = parseNum;
  /* very big and very small answers are right when they match to 9 significant figures */
  function judge(q, v) { return Math.abs(v - q.answer) <= (q.tol || Math.max(1e-12, 1e-9 * Math.abs(q.answer))); }

  /* sections, cards and quizzes fade in as they scroll into view */
  function reveal(root) {
    if (!('IntersectionObserver' in window) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting || e.boundingClientRect.bottom < 0) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -4% 0px' });
    Atlas.$$('.sec, .card, .quiz, .chead, .hero', root).forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
  Atlas.setup({ parseNum: parseNum, judge: judge, afterRoute: reveal });
})();
