/* Math Atlas teaching guides: one guide per Toolbox tool, for the grown-up (parent, tutor or teacher), never task cards
   for the child. The Toolbox (manip.js) loads this file, the tool's guide (guides/<tool id>.js) and the plain-language
   expectation lines (plan/blurbs.js) only when the Guide button is first tapped.

   A guide file calls AtlasGuide.add(id, guide):
     what   one line: what the tool is for
     keys   [[control, what it does], ...]: what each button and move does
     bands  [{ grades: [from, to], start, lessons, mistakes }, ...]: what to teach in those grades
       start     three steps for the first 2 minutes
       lessons   [{ t: title, codes: { grade: ['B1.1', ...] }, only: [grades] (optional), goal, ido, wedo, youdo, ask,
                    mat: { k, h, t, o } (optional: blocks to put on the mat), matLabel }]
                 A lesson shows in a grade when it has codes for that grade (and the grade is in `only`, if set).
                 Any of its lines can instead be { grade: line } when the numbers differ by grade.
       mistakes  [[what the child does, what to do about it], ...]
   AtlasGuide.html(id, grade) draws the guide for one grade; the curriculum list is every code its lessons name. */
(function () {
  'use strict';
  var G = (window.AtlasGuide = { tools: {} });
  G.add = function (id, guide) { G.tools[id] = guide; };

  function band(g, grade) {
    return g.bands.filter(function (b) { return grade >= b.grades[0] && grade <= b.grades[1]; })[0] || null;
  }
  G.lessons = function (id, grade) {
    var b = band(G.tools[id], grade);
    return b ? b.lessons.filter(function (l) { return l.codes[grade] && (!l.only || l.only.indexOf(grade) >= 0); }) : [];
  };
  G.codes = function (id, grade) {
    var all = [];
    G.lessons(id, grade).forEach(function (l) { l.codes[grade].forEach(function (c) { if (all.indexOf(c) < 0) all.push(c); }); });
    return all.sort(function (a, b) { return a.localeCompare(b, 'en', { numeric: true }); });
  };

  function pick(v, grade) { return v && typeof v === 'object' ? v[grade] : v; }
  function chips(list) { return '<span class="gd-codes">' + list.map(function (c) { return '<i>' + c + '</i>'; }).join('') + '</span>'; }
  function lesson(l, i, grade) {
    function f(k) { return pick(l[k], grade); }
    return '<details class="gd-les"' + (i === 0 ? ' open' : '') + '><summary><span class="gd-n">' + (i + 1) + '</span><b>' + l.t + '</b>' + chips(l.codes[grade]) + '</summary>' +
      '<p class="gd-goal">' + f('goal') + '</p>' +
      '<dl class="gd-steps"><dt>I do</dt><dd>' + f('ido') + '</dd><dt>We do</dt><dd>' + f('wedo') + '</dd><dt>You do</dt><dd>' + f('youdo') + '</dd></dl>' +
      (l.ask ? '<p class="gd-ask"><b>Ask</b>' + f('ask') + '</p>' : '') +
      (l.mat ? '<button type="button" class="gd-mat" data-les="' + i + '">' + f('matLabel') + '</button>' : '') + '</details>';
  }
  G.html = function (id, grade, name) {
    var g = G.tools[id], b = band(g, grade), les = G.lessons(id, grade), codes = G.codes(id, grade), plb = window.PLB || {};
    return '<div class="gd-head"><div><p class="gd-eye">Teaching guide &middot; Grade ' + grade + '</p><h2 id="gdh">' + name + '</h2></div>' +
      '<button type="button" class="tb-x" aria-label="Close">&#10005;</button></div><div class="gd-body">' +
      '<p class="gd-what">' + g.what + '</p>' +
      '<section class="gd-start"><h3>Start here <span>2 minutes</span></h3><ol>' + b.start.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></section>' +
      '<section><h3>Mini-lessons <span>about 5 minutes each</span></h3><p class="gd-note">Each one: you show it, you do it together, then the child does it alone.</p>' +
      les.map(function (l, i) { return lesson(l, i, grade); }).join('') + '</section>' +
      '<section><h3>Watch for</h3><ul class="gd-miss">' + b.mistakes.map(function (m) { return '<li><b>' + m[0] + '</b>' + m[1] + '</li>'; }).join('') + '</ul></section>' +
      '<section><h3>What each button does</h3><dl class="gd-keys">' + g.keys.map(function (k) { return '<dt>' + k[0] + '</dt><dd>' + k[1] + '</dd>'; }).join('') + '</dl></section>' +
      '<section><h3>Curriculum, Grade ' + grade + '</h3><ul class="gd-cur">' + codes.map(function (c) {
        return '<li><b>' + c + '</b>' + (plb['g' + grade + '.' + c] || '') + '</li>';
      }).join('') + '</ul></section></div>';
  };
})();
