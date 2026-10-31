(function () {
  var K = K8, A = Atlas, F = K.fx('algebra'), C = 'algebra', T = K.txt;
  function addN(t, k, s, n) { var p = Promise.resolve(); for (var i = 0; i < n; i++) p = p.then(function () { return t.add(k, s); }); return p; }

  K.lessons(C, [
    { id: 'pattern', title: 'Linear patterns', sub: 'A constant rate and a starting value.', concepts: [
      { id: 'rate', title: 'Rate and initial value', exp: ['C1.1', 'C1.2'], skill: 'al-pattern',
        body: '<p>In a <b>linear pattern</b>, the terms change by the same amount every step: the <b>constant rate</b>. The value at figure 0 is the <b>initial value</b>.</p>',
        watch: K.film([
          [F.tiles(3, 2), 'Each figure adds 3 purple tiles. The constant rate is 3.'],
          [F.tiles(3, 2), 'Go back one step from figure 1: 5 − 3 = 2. The 2 orange tiles are the initial value.'],
          [T(['t = 3n + 2']), 'Rate times figure number, plus the initial value.', 2400]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Build the pattern <b>t = 2n + 5</b>.', goal: function (g) { return g('pm') === 2 && g('pb') === 5; }, yes: 'Starts at 5, up 2 each figure.' },
          { do: 'Make a <b>shrinking</b> pattern that starts at <b>20</b> and drops <b>4</b> each figure.', goal: function (g) { return g('pm') === -4 && g('pb') === 20; }, yes: 't = −4n + 20. The line slopes down.' }] }),
        key: '<p>Rate = <b>change each step</b>. Initial value = <b>figure 0</b>.</p>',
        mistake: '<p>Taking the first term as the initial value. Figure 1 is not figure 0: step back once.</p>',
        check: [K.chk(C, 'al-pattern', 1), K.chk(C, 'al-pattern', 2)] },
      { id: 'graphs', title: 'Patterns as graphs', exp: ['C1.2'], skill: 'al-pattern', hard: true,
        body: '<p>Graph a linear pattern and the points make a straight line. A bigger rate makes a <b>steeper</b> line. A bigger initial value starts it <b>higher</b>. A negative rate slopes <b>down</b>.</p>',
        watch: K.film([
          [F.graph([{ m: 2, b: 1 }]), 't = 2n + 1: starts at 1, up 2 each step.'],
          [F.graph([{ m: 2, b: 1 }, { m: 4, b: 1 }]), 't = 4n + 1: same start, steeper.'],
          [F.graph([{ m: 3, b: 2 }, { m: -4, b: 30 }]), 't = −4n + 30 starts high and slopes down. Where they cross, the terms are equal.', 2800]
        ]),
        ways: [{ label: 'Read the table', html: '<p>In the table, the rate is the jump between neighbouring terms. On the graph, it is how far each point rises per step right.</p>' }],
        key: '<p>Rate → <b>steepness</b>. Initial value → <b>where it starts</b>.</p>',
        mistake: '<p>Thinking a higher-starting line is always bigger. A steeper line can catch up and pass it.</p>',
        check: [K.chk(C, 'al-pattern', 2), K.chk(C, 'al-pattern', 3)] }
    ] },
    { id: 'rule', title: 'Using a pattern rule', sub: 'Jump ahead, or work backwards.', concepts: [
      { id: 'forward', title: 'Find any term', exp: ['C1.3'], skill: 'al-rule',
        body: '<p>The rule t = 3n + 2 gives any term from its figure number. Replace n and calculate. No need to draw 50 figures.</p>',
        watch: K.film([
          [T(['t = 3n + 2', 'figure 50?']), 'How many tiles in figure 50?'],
          [T(['t = 3 × 50 + 2']), 'Replace n with 50.'],
          [T(['= 150 + 2 = 152']), 'Multiply first, then add: 152 tiles.', 2400]
        ]),
        key: '<p>Replace <b>n</b>, multiply, then add.</p>',
        mistake: '<p>Adding before multiplying: 3 × (50 + 2). Follow BEDMAS.</p>',
        check: [K.chk(C, 'al-rule', 1), K.num('For t = 4n + 3, what is term 25?', 103, 'Replace n with 25.', '4 × 25 + 3 = 103.')] },
      { id: 'backward', title: 'Which figure?', exp: ['C1.3', 'C2.3'], skill: 'al-rule', hard: true,
        body: '<p>To find which figure has a certain number of tiles, set the rule equal to that number and solve.</p>',
        watch: K.film([
          [T(['3n + 2 = 62']), 'Which figure has 62 tiles?'],
          [T(['3n = 60']), 'Take 2 from both sides.'],
          [T(['n = 20']), 'Divide by 3. Figure 20.', 2400]
        ]),
        ways: [{ label: 'Undo the steps', html: '<p>The rule says: times 3, then add 2. To go backwards: subtract 2, then divide by 3. (62 − 2) ÷ 3 = 20.</p>' }],
        key: '<p>Set rule = number, then <b>solve</b>.</p>',
        mistake: '<p>Putting 62 in for n instead of t. Ask: "Is 62 the figure number or the number of tiles?"</p>',
        check: [K.chk(C, 'al-rule', 2), K.chk(C, 'al-rule', 3)] }
    ] },
    { id: 'like', title: 'Collecting like terms', sub: 'Same shape, same kind.', concepts: [
      { id: 'tiles', title: 'Like terms with tiles', exp: ['C2.1'], skill: 'al-like',
        body: '<p><b>Like terms</b> have the same variable part. 3x and 2x are like terms; 3x and 3 are not. A long x tile and a small unit tile are different shapes, so they never combine.</p>',
        watch: { tool: 'tiles', opts: {}, steps: [
          { say: 'Build 3x + 5: three x tiles and five unit tiles.', act: function (t) { return addN(t, 'x', 1, 3).then(function () { return addN(t, 'one', 1, 5); }); }, ms: 900 },
          { say: 'Add 2x − 7: two more x tiles and seven negative units.', act: function (t) { return addN(t, 'x', 1, 2).then(function () { return addN(t, 'one', -1, 7); }); }, ms: 900 },
          { say: 'Cancel the zero pairs. 5x and two negative units are left: 5x − 2.', act: function (t) { return t.zeroPairs(); }, ms: 1800 }
        ] },
        try: { tool: 'tiles', opts: {}, tasks: [
          { do: 'Build <b>(3x + 5) + (2x − 7)</b> with the tiles.', goal: function (s) { return s.x === 5 && s.one === -2 && s.n === 17; }, yes: '5 x tiles, 5 positive and 7 negative units.' },
          { do: 'Now tap <b>Remove zero pairs</b>. What is left?', reset: false, goal: function (s) { return s.x === 5 && s.one === -2 && s.n === 7; }, yes: '5x − 2.' }] },
        key: '<p>Combine only <b>like terms</b>: x with x, numbers with numbers.</p>',
        mistake: '<p>Writing 5x − 2 = 3x. Point to the tiles: x tiles and unit tiles are different shapes.</p>',
        check: [K.chk(C, 'al-like', 1), K.chk(C, 'al-like', 2)] },
      { id: 'signs', title: 'Like terms with negatives', exp: ['C2.1'], skill: 'al-like', hard: true,
        body: '<p>Each term carries the sign in front of it. In 4x − 6 + x + 2, the terms are 4x, −6, x and +2. Remember that x means 1x.</p>',
        watch: K.film([
          [T(['4x − 6 + x + 2']), 'Underline the x terms, circle the numbers.'],
          [T(['4x + x = 5x']), 'x terms: 4x + 1x = 5x.'],
          [T(['−6 + 2 = −4']), 'Numbers: −6 + 2 = −4.'],
          [T(['5x − 4']), 'Put them together: 5x − 4.', 2400]
        ]),
        ways: [{ label: 'Tiles', html: '<p>Build it with tiles, then remove zero pairs.</p>', tool: 'tiles', opts: { start: { x: 5, one: -4 } } },
          { label: 'Sort into columns', html: '<p>Make two columns: x terms and numbers. Copy each term with its sign into its column, then add each column.</p>' }],
        key: '<p>Each term <b>keeps the sign in front of it</b>.</p>',
        mistake: '<p>Dropping the sign when regrouping: 4x − 6 + x + 2 → 5x + 8.</p>',
        check: [K.chk(C, 'al-like', 3), K.mc('Simplify 7 − 3x + 2x − 10.', '−x − 3', ['−5x − 3', 'x − 3', '−x + 17'], 'x terms: −3x + 2x. Numbers: 7 − 10.', '−3x + 2x = −x and 7 − 10 = −3.')] }
    ] },
    { id: 'eval', title: 'Evaluating expressions', sub: 'Substitute in brackets, then BEDMAS.', concepts: [
      { id: 'sub', title: 'Substitute and calculate', exp: ['C2.2'], skill: 'al-eval',
        body: '<p>To <b>evaluate</b>, replace each variable with its value <b>in brackets</b>, then follow BEDMAS.</p>',
        watch: K.film([
          [T(['2.5x − 4, x = −2']), 'Evaluate 2.5x − 4 when x = −2.'],
          [T(['2.5(−2) − 4']), 'Put −2 in brackets where x was.'],
          [T(['−5 − 4 = −9']), 'Multiply, then subtract: −9.', 2400]
        ]),
        key: '<p>Value in <b>brackets</b>, then BEDMAS.</p>',
        mistake: '<p>Writing 2.5−2 (subtracting) instead of 2.5 × (−2). Brackets show it is a product.</p>',
        check: [K.chk(C, 'al-eval', 1), K.chk(C, 'al-eval', 2)] },
      { id: 'power', title: 'Negatives and exponents', exp: ['C2.2'], skill: 'al-eval', hard: true,
        body: '<p>Brackets protect the sign. If a = −2, then a² = (−2)² = 4, not −4.</p>',
        watch: K.film([
          [T(['3a² − 2b', 'a = −2, b = 1.5']), 'Evaluate 3a² − 2b.'],
          [T(['3(−2)² − 2(1.5)']), 'Substitute with brackets.'],
          [T(['(−2)² = 4', '3 × 4 − 3']), 'Exponent first: (−2)² = 4.'],
          [T(['12 − 3 = 9']), 'Answer: 9.', 2400]
        ]),
        ways: [{ label: 'Write it out', html: '<p>(−2)² means (−2) × (−2). Two negatives make a positive: 4.</p>' }],
        key: '<p>(−a)² is <b>positive</b>.</p>',
        mistake: '<p>Calculating −2² on a calculator without brackets and getting −4.</p>',
        check: [K.chk(C, 'al-eval', 3), K.num('Evaluate x² + 3x when x = −4.', 4, 'Brackets: (−4)² + 3(−4).', '16 − 12 = 4.')] }
    ] },
    { id: 'solve', title: 'Solving equations', sub: 'Keep the balance.', concepts: [
      { id: 'balance', title: 'Keep it balanced', exp: ['C2.3'], skill: 'al-solve',
        body: '<p>An equation is a balance. Whatever you do to one side, do to the other. Undo the operations in <b>reverse order</b> until x is alone. Then check.</p>',
        watch: K.film([
          [F.balance('3x + 4', '19'), '3x + 4 = 19. Both sides balance.'],
          [F.balance('3x', '15'), 'Take 4 from both sides: 3x = 15.'],
          [F.balance('x', '5'), 'Divide both sides by 3: x = 5. Check: 3 × 5 + 4 = 19.', 2600]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Step through <b>3x + 4 = 19</b> to the end.', goal: function (g) { return g('eqs') === 0 && /Step 3 of 3/.test(g.text('#eqout')); }, yes: 'x = 5.' },
          { do: 'Choose <b>−2x + 7 = 15</b> and step to the end.', goal: function (g) { return g('eqs') === 2 && /Step 3 of 3/.test(g.text('#eqout')); }, yes: 'Dividing by −2 gives x = −4.' }] }),
        key: '<p>Same to <b>both sides</b>. Undo in <b>reverse</b> order.</p>',
        mistake: '<p>Dividing before subtracting: 3x + 4 = 19 → x + 4 = 19/3. Undo the + 4 first.</p>',
        check: [K.chk(C, 'al-solve', 1), K.num('Solve 4x + 6 = −10.', -4, 'Take 6 from both sides, then divide by 4.', '4x = −16, so x = −4.')] },
      { id: 'both', title: 'x on both sides', exp: ['C2.3'], skill: 'al-solve', hard: true,
        body: '<p>When x is on both sides, first move all the x terms to one side. Then solve as usual.</p>',
        watch: K.film([
          [F.balance('5x − 3', '2x + 9'), '5x − 3 = 2x + 9.'],
          [F.balance('3x − 3', '9'), 'Take 2x from both sides.'],
          [F.balance('3x', '12'), 'Add 3 to both sides.'],
          [F.balance('x', '4'), 'Divide by 3: x = 4. Check: 17 = 17.', 2600]
        ]),
        ways: [{ label: 'Move the smaller x', html: '<p>Take away the smaller x term from both sides. Then the x term left over is positive.</p>' },
          { label: 'Check by substituting', html: '<p>Put your answer back into both sides. If the two sides match, you are right.</p>' }],
        key: '<p>Gather <b>x terms on one side</b>, numbers on the other.</p>',
        mistake: '<p>Moving 2x to the left but writing +2x. Taking 2x from both sides changes 5x to 3x.</p>',
        check: [K.chk(C, 'al-solve', 2), K.chk(C, 'al-solve', 3)] }
    ] },
    { id: 'ineq', title: 'Inequalities', sub: 'Many answers, shown on a line.', concepts: [
      { id: 'graph', title: 'Graphing an inequality', exp: ['C2.4'], skill: 'al-ineq',
        body: '<p>x &lt; 5 has many solutions. An <b>open</b> circle means 5 is not included (&lt;, &gt;). A <b>filled</b> circle means it is (≤, ≥).</p>',
        watch: K.film([
          [F.ineqLine('<', 5, -1, 11), 'x < 5: open circle at 5, arrow to the left.'],
          [F.ineqLine('>=', 2, -4, 8), 'x ≥ 2: filled circle at 2, arrow to the right.', 2600]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Graph <b>x ≥ −2</b>.', goal: function (g) { return g('iqo') === '>=' && g('iqk') === -2; }, yes: 'Filled circle at −2, shading right.' },
          { do: 'Graph <b>x &lt; 4</b>.', goal: function (g) { return g('iqo') === '<' && g('iqk') === 4; }, yes: 'Open circle at 4, shading left.' }] }),
        key: '<p>Open: <b>not included</b>. Filled: <b>included</b>.</p>',
        mistake: '<p>Using a filled circle for &lt;. Ask: "Is 5 itself less than 5?"</p>',
        check: [K.chk(C, 'al-ineq', 1), K.mc('Which inequality has a filled circle at 3 and shading to the left?', 'x ≤ 3', ['x < 3', 'x ≥ 3', 'x > 3'], 'Filled means included; left means smaller.', 'Filled circle and left: x ≤ 3.')] },
      { id: 'flip', title: 'Flip for a negative', exp: ['C2.4'], skill: 'al-ineq', hard: true,
        body: '<p>Solve like an equation, with one extra rule: when you <b>multiply or divide by a negative</b>, flip the sign.</p>',
        watch: K.film([
          [T(['−2x + 1 ≥ 9']), 'Solve −2x + 1 ≥ 9.'],
          [T(['−2x ≥ 8']), 'Take 1 from both sides.'],
          [T(['x ≤ −4']), 'Divide by −2 and flip ≥ to ≤.'],
          [F.ineqLine('<=', -4, -10, 2), 'Check x = −5: −2(−5) + 1 = 11 ≥ 9. ✓', 2600]
        ]),
        ways: [{ label: 'Why it flips', html: '<p>2 &lt; 5. Multiply both by −1: −2 and −5. Now −2 is the bigger one, so −2 &gt; −5. Multiplying by a negative reverses the order.</p>' }],
        key: '<p>× or ÷ by a negative: <b>flip the sign</b>.</p>',
        mistake: '<p>Flipping the sign when subtracting a negative or when dividing by a positive. Only multiplying or dividing by a negative flips it.</p>',
        check: [K.chk(C, 'al-ineq', 2), K.chk(C, 'al-ineq', 3)] }
    ] }
  ]);
})();