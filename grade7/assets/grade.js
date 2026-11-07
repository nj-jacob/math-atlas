/* Grade 7 settings for the shared grade app (assets/engine/site.js): chapters, home page text and options,
   then Grade 7's own fraction text, typed-answer rules and page motion. */
Atlas.setup({
  grade: 7,
  tools: ['numberline', 'fractions', 'balance', 'patterns', 'data', 'grid', 'solids', 'tiles', 'areagrid', 'times', 'scale', 'coins', 'geoboard', 'disks'],
  meta: [
    { id: 'powers-factors', title: 'Powers, Roots and Factors', sub: 'big numbers, exponents, square roots, GCF and LCM', strand: 'B', codes: 'B1.1, B1.2, B2.6, B2.7',
      desc: 'Numbers to one billion, powers of ten, perfect squares, square roots, common factors and common multiples.' },
    { id: 'fractions', title: 'Fractions', sub: 'simplify, compare, add and subtract', strand: 'B', codes: 'B1.4, B1.5, B2.5',
      desc: 'Simplify with the GCF, compare and order, find a fraction between two others, add and subtract.' },
    { id: 'mult-div', title: 'Multiplying and Dividing', sub: 'fractions, decimals, rounding, order of operations', strand: 'B', codes: 'B1.6, B2.1, B2.8, B2.9',
      desc: 'Round decimals, multiply and divide fractions and decimals, and use the order of operations.' },
    { id: 'integers', title: 'Integers', sub: 'numbers below zero', strand: 'B', codes: 'B1.3, B2.4, C1.4',
      desc: 'Negative numbers on a line and a thermometer, comparing, adding and subtracting integers, and integer patterns.' },
    { id: 'percent-ratio', title: 'Percents, Ratios and Rates', sub: 'comparing amounts fairly', strand: 'B', codes: 'B1.7, B2.2, B2.3, B2.10',
      desc: 'Fraction, decimal and percent equivalents, quick percent changes, unit rates and proportional reasoning.' },
    { id: 'algebra', title: 'Patterns, Expressions and Equations', sub: 'rules, variables, balance, code', strand: 'C', codes: 'C1.1 to C3.2',
      desc: 'Linear growing patterns, like terms, evaluating, solving equations and inequalities, and reading code.' },
    { id: 'data-probability', title: 'Data and Probability', sub: 'circle graphs, averages, chance', strand: 'D', codes: 'D1.1 to D2.2',
      desc: 'Kinds of data, circle graphs, mean, median and mode, misleading graphs, independent and dependent events.' },
    { id: 'shapes-moves', title: 'Shapes, Views and Moves', sub: '3-D objects and transformations', strand: 'E', codes: 'E1.1 to E1.4',
      desc: 'Prisms, pyramids and cylinders, top, front and side views, translations, reflections, rotations and dilations.' },
    { id: 'circles-volume', title: 'Circles, Surface Area and Volume', sub: 'pi, cylinders and prisms', strand: 'E', codes: 'E2.1 to E2.7',
      desc: 'Circumference and area of circles, mL and cubic centimetres, unit conversions, volume and surface area.' },
    { id: 'money', title: 'Money Matters', sub: 'exchange rates, budgets, interest', strand: 'F', codes: 'F1.1 to F1.6',
      desc: 'Convert currencies, plan a budget for a big goal, interest on savings and loans, and compare accounts.' },
    { id: 'fact-sheet', title: 'Fact Sheet', sub: 'the key facts on one page', strand: 'B', ref: true,
      desc: 'Powers, squares, equivalents, integer rules, formulas and units.' }
  ],
  home: {
    hero: '<p class="kicker">Ontario Grade 7 &middot; 2020 curriculum</p><h1>Grade 7 Math, <em>one idea at a time</em></h1>' +
      '<p class="lede">A free study site for Ontario Grade 7 math. Each idea is shown with a picture, worked through with an example, then handed to you to try. Practice adjusts to you, and a check-up shows what to work on next.</p>',
    start: '<p><b>Not sure where to start?</b> Take the <a href="#check-up">check-up</a>. It has 20 questions, takes about 25 minutes, and builds a practice plan for you.</p>',
    notes: '<p><b>About this site.</b> It follows the five content strands (B to F) of the 2020 Ontario elementary math curriculum for Grade 7. ' +
      'It is a study aid, not a copy of the curriculum. Teachers and parents should check details against the Ministry of Education document.</p>' +
      '<p><b>Not covered as its own chapter:</b> strand A (social-emotional learning skills and math processes) is woven through. Mathematical modelling (C4) has no chapter of its own. Making a full infographic (D1.4) and writing real code (C3) are explained with examples, but done off the site.</p>'
  },
  input: { mode: 'decimal', placeholder: 'Type your answer', pad: false },
  checkup: {
    steps: [
      'Each question is new. There are no hints and no time limit.',
      'Questions start at the starter level. A chapter check-up asks one easy question for every skill, then a few a step harder.',
      'If you do not know, choose <b>"I\'m not sure yet"</b>. That is more useful than a guess.',
      'At the end you see every answer, what each question checked, and a plan for what to practise.',
      'Your practice levels change to match your results.'
    ],
    whole: [{ scope: 'all', per: 2, label: 'Quick whole-grade check-up', button: 'Whole-grade check-up: two starter questions from every chapter' }],
    note: ''
  }
});

(function () {
  'use strict';
  /* stacked fractions in text: Atlas.fr(3, 4), Atlas.mixed(2, 1, 4) */
  Atlas.fr = function (n, d) {
    var neg = typeof n === 'number' && n < 0 ? '&minus;' : '';
    return neg + '<span class="fr"><span>' + (neg ? -n : n) + '</span><span>' + d + '</span></span>';
  };
  Atlas.mixed = function (w, n, d) { if (w === 0 && n) return Atlas.fr(n, d); return (w < 0 ? '&minus;' + (-w) : w) + (n ? '&#8202;' + Atlas.fr(n, d) : ''); };
  /* a fraction n/d in simplest form, as a mixed number if it is more than 1 */
  Atlas.frs = function (n, d, plain) {
    if (d < 0) { n = -n; d = -d; }
    var g = Atlas.gcd(n, d) || 1; n /= g; d /= g;
    if (d === 1) return String(n);
    var w = Math.trunc(n / d), r = Math.abs(n % d);
    if (plain) return (w ? w + ' ' : (n < 0 ? '-' : '')) + r + '/' + d;
    return w ? Atlas.mixed(w, r, d) : Atlas.fr(n, d);
  };
  /* is the typed answer a fraction in lowest terms equal to n/d? */
  Atlas.lowest = function (n, d) {
    return function (t) {
      t = String(t).trim().replace(/\u2212/g, '-');
      var m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/), w = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
      if (m) return Atlas.gcd(+m[1], +m[2]) === 1 && Math.abs(m[1] / m[2] - n / d) < 1e-9;
      if (w) return Atlas.gcd(+w[2], +w[3]) === 1 && +w[2] < +w[3] && Math.abs(Math.abs(+w[1]) + w[2] / w[3] - Math.abs(n / d)) < 1e-9;
      return /^-?\d+$/.test(t) && +t === n / d;
    };
  };

  /* accepts 12 000, -4, \u22124, 3/4, -3/4 and mixed numbers like 2 1/2 */
  function parseNum(t) {
    t = String(t).replace(/\u2212/g, '-').replace(/,/g, '').trim();
    var m = t.match(/^(-?)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]);
    m = t.match(/^(-?\s*\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/);
    if (m) return +m[2] ? parseFloat(m[1].replace(/\s/g, '')) / +m[2] : NaN;
    return parseFloat(t.replace(/[^0-9.\-]/g, ''));
  }
  Atlas.parseNum = parseNum;
  /* q.accept(raw text) lets a question insist on a form, such as lowest terms */
  Atlas.judgeNum = function (q, v, raw) { return q.accept ? q.accept(raw) : Math.abs(v - q.answer) <= (q.tol || 1e-9); };

  /* pictures draw themselves in as they scroll into view */
  function drawIn(sv) {
    if (!window.matchMedia || !matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    var k = 0;
    Atlas.$$('*', sv).forEach(function (n) {
      if (/^(defs|marker|title|tspan)$/i.test(n.tagName) || n.closest('defs')) return;
      n.style.setProperty('--i', Math.min(k++, 30));
      if (n.getTotalLength && /^(line|path|polyline)$/i.test(n.tagName)) { try { n.style.setProperty('--len', Math.ceil(n.getTotalLength()) + 1); } catch (x) {} }
    });
    sv.classList.remove('draw'); void sv.getBoundingClientRect(); sv.classList.add('draw');
    setTimeout(function () { sv.classList.remove('draw'); }, 2200);
  }
  Atlas.drawIn = drawIn;
  function motion(root) {
    if (!('IntersectionObserver' in window) || !window.matchMedia || !matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        Atlas.$$('.fig > svg, .opts svg', el).forEach(drawIn);
        el.classList.add('in');
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Atlas.$$('.hero, .cards > *, .sec, .quiz, .pbox, .note, .cuopts, .cuch', root).forEach(function (el) {
      /* anything already scrolled past is shown at once, so a page opened part way down is never left hidden */
      if (el.getBoundingClientRect().bottom < 0) return;
      el.classList.add('rv'); io.observe(el);
    });
  }
  /* slider readouts give a small bump when they change */
  document.addEventListener('input', function (e) {
    var o = e.target && e.target.closest && e.target.closest('label');
    o = o && o.querySelector('output');
    if (o) { o.classList.remove('bump'); void o.offsetWidth; o.classList.add('bump'); }
  });
  Atlas.setup({ parseNum: parseNum, judge: Atlas.judgeNum, afterRoute: motion });
})();
