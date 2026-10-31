(function () {
  var K = K8, A = Atlas, F = K.fx('probability'), C = 'probability', T = K.txt;
  var COIN = [{ t: 'H', p: [1, 2] }, { t: 'T', p: [1, 2] }];
  var DIE = [1, 2, 3, 4, 5, 6].map(function (n) { return { t: String(n), p: [1, 6] }; });

  K.lessons(C, [
    { id: 'basics', title: 'Probability of one event', sub: 'Favourable over all.', concepts: [
      { id: 'theory', title: 'Theoretical probability', exp: ['D2.1'], skill: 'pb-single',
        body: '<p>When all outcomes are equally likely, P(event) = favourable outcomes ÷ all outcomes. It is always from 0 (impossible) to 1 (certain).</p>',
        watch: K.film([
          [F.bag(3, 5), 'A bag with 3 red and 5 blue marbles. 8 in total.'],
          [T(['P(red) = 3/8']), '3 of the 8 are red: P(red) = 3/8.'],
          [T(['die: P(greater than 4)', '= 2/6 = 1/3']), 'On a die, 5 and 6 are greater than 4: 2 of 6 outcomes.', 2600]
        ]),
        example: K.film([
          [F.bag(4, 6), 'My turn. A bag holds 4 red and 6 blue marbles. I will find P(blue).'],
          [T(['all: 4 + 6 = 10']), 'First I count all the outcomes: 4 + 6 = 10 marbles.'],
          [T(['favourable: 6 blue']), 'Next I count the favourable ones: 6 are blue.'],
          [T(['P(blue) = 6/10 = 3/5']), 'So P(blue) = 6/10. I simplify: 3/5.'],
          [T(['3/5 > 1/2 ✓']), 'I check: more than half the marbles are blue, and 3/5 is more than 1/2. <b>P = favourable ÷ all.</b>', 2600]
        ]),
        key: '<p>P = <b>favourable ÷ all</b>.</p>',
        mistake: '<p>Writing red over blue (3/5) instead of red over all (3/8).</p>',
        check: [K.chk(C, 'pb-single', 1), K.chk(C, 'pb-single', 2)] },
      { id: 'not', title: 'The chance it does not happen', exp: ['D2.1'], skill: 'pb-single',
        body: '<p>The probabilities of all outcomes add to 1. So P(not A) = 1 − P(A).</p>',
        watch: K.film([
          [F.bag(3, 5), 'P(red) = 3/8.'],
          [T(['P(not red) = 1 − 3/8', '= 5/8']), 'Everything that is not red: 1 − 3/8 = 5/8. That matches the 5 blue.', 2600]
        ]),
        example: K.film([
          [F.bag(2, 7), 'My turn. A bag has 2 red and 7 blue marbles. I will find P(not red).'],
          [T(['P(red) = 2/9']), 'First I find P(red): 2 of the 9 marbles, so 2/9.'],
          [T(['P(not red) = 1 − 2/9', '= 7/9']), 'Next I take it away from 1, because the two chances add to 1. 1 − 2/9 = 7/9.'],
          [T(['7 blue out of 9 ✓']), 'I check: 7 of the 9 marbles are not red, which is 7/9. <b>P(not A) = 1 − P(A).</b>', 2600]
        ]),
        key: '<p>P(not A) = <b>1 − P(A)</b>.</p>',
        mistake: '<p>Giving a probability above 1 or below 0. Any answer outside 0 to 1 has a mistake in it.</p>',
        check: [K.chk(C, 'pb-single', 3), K.mc('P(rain tomorrow) = 0.35. What is P(no rain)?', '0.65', ['0.35', '1.35', '0.5'], 'The two must add to 1.', '1 − 0.35 = 0.65.')] }
    ] },
    { id: 'indep', title: 'Independent events', sub: 'Tree diagrams and multiplying.', concepts: [
      { id: 'tree', title: 'Tree diagrams', exp: ['D2.2'], skill: 'pb-indep',
        body: '<p>Two events are <b>independent</b> if one does not change the chances of the other. A <b>tree diagram</b> shows every outcome: each first branch splits into every second branch.</p>',
        watch: K.film([
          [F.tree(COIN, COIN, 'Two coin flips.'), 'Flip a coin twice. Each flip has two branches.'],
          [F.tree(COIN, COIN, 'Two coin flips. HH highlighted.', function (r) { return r.a.t === 'H' && r.b.t === 'H'; }), '2 × 2 = 4 outcomes. HH is one of them: 1/4.'],
          [T(['3-part spinner, 2-part spinner', '3 × 2 = 6 outcomes']), 'The number of outcomes multiplies.', 2600]
        ]),
        example: K.film([
          [F.tree(COIN, [{ t: 'A', p: [1, 4] }, { t: 'B', p: [1, 4] }, { t: 'C', p: [1, 4] }, { t: 'D', p: [1, 4] }], 'A coin, then a spinner with parts A, B, C and D.'), 'My turn. I flip a coin, then spin a spinner with four equal parts: A, B, C and D. I will draw the tree.'],
          [F.tree(COIN, [{ t: 'A', p: [1, 4] }, { t: 'B', p: [1, 4] }, { t: 'C', p: [1, 4] }, { t: 'D', p: [1, 4] }], 'A coin, then a spinner with parts A, B, C and D.'), 'First the coin: 2 branches. Then from each of those, the spinner: 4 branches.'],
          [T(['2 × 4 = 8 outcomes']), 'I count the ends: 2 × 4 = 8 outcomes.'],
          [F.tree(COIN, [{ t: 'A', p: [1, 4] }, { t: 'B', p: [1, 4] }, { t: 'C', p: [1, 4] }, { t: 'D', p: [1, 4] }], 'A coin, then a spinner. Heads then A highlighted.', function (r) { return r.a.t === 'H' && r.b.t === 'A'; }), 'Heads then A is one of the 8, so P(H, A) = 1/8. <b>Outcomes = first × second.</b>', 2800]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Make a tree with exactly <b>12</b> outcomes.', goal: function (g) { return g('tra') * g('trb') === 12; }, yes: '3 × 4 or 4 × 3: 12 outcomes, each 1/12.' },
          { do: 'Now make the <b>fewest</b> outcomes possible.', goal: function (g) { return g('tra') === 2 && g('trb') === 2; }, yes: '2 × 2 = 4 outcomes, each 1/4.' }] }),
        key: '<p>Outcomes = <b>first × second</b>.</p>',
        mistake: '<p>Adding the branches (3 + 2 = 5) instead of multiplying (3 × 2 = 6).</p>',
        check: [K.chk(C, 'pb-indep', 1), K.chk(C, 'pb-indep', 1)] },
      { id: 'multiply', title: 'Multiply along a path', exp: ['D2.2'], skill: 'pb-indep', hard: true,
        body: '<p>To find the probability of one path, <b>multiply</b> along its branches. If an event can happen along more than one path, <b>add</b> those paths.</p>',
        watch: K.film([
          [T(['P(heads and 6)', '= 1/2 × 1/6 = 1/12']), 'Coin then die: multiply. Heads and 6 is less likely than heads alone.'],
          [F.tree(COIN, COIN, 'Two coin flips. One head and one tail highlighted.', function (r) { return r.a.t !== r.b.t; }), 'Exactly one head: HT or TH. Two paths.'],
          [T(['1/4 + 1/4 = 1/2']), 'Add the separate paths: 1/2.', 2600]
        ]),
        example: K.film([
          [T(['coin, then die', 'P(tails and even)?']), 'My turn. I flip a coin, then roll a die. I will find P(tails and an even number).'],
          [T(['P(tails) = 1/2', 'P(even) = 3/6 = 1/2']), 'First I find each chance on its own. Tails: 1/2. Even (2, 4 or 6): 3/6 = 1/2.'],
          [T(['1/2 × 1/2 = 1/4']), 'Both must happen, one after the other, so I multiply along the path: 1/4.'],
          [T(['T2, T4, T6: 3 of 12', '3/12 = 1/4 ✓']), 'I check by counting: 2 × 6 = 12 outcomes, and 3 of them are tails with an even number. 3/12 = 1/4. <b>Along a path: multiply.</b>', 2800]
        ]),
        ways: [{ label: 'Count the outcomes', html: '<p>A coin and a die give 2 × 6 = 12 equally likely outcomes. Only one is H6, so P = 1/12. Multiplying gives the same answer faster.</p>' },
          { label: '"And" vs "or"', html: '<p><b>And</b> along one path: multiply. <b>Or</b> between different paths: add.</p>' }],
        key: '<p>Along a path: <b>multiply</b>. Between paths: <b>add</b>.</p>',
        mistake: '<p>Adding along a path: 1/2 + 1/6. "And" must be less likely than either event alone.</p>',
        check: [K.chk(C, 'pb-indep', 2), K.chk(C, 'pb-indep', 3)] }
    ] },
    { id: 'dep', title: 'Dependent events', sub: 'When the first draw changes the second.', concepts: [
      { id: 'noreplace', title: 'Without putting it back', exp: ['D2.2'], skill: 'pb-dep', hard: true,
        body: '<p>Events are <b>dependent</b> when the first changes the chances of the second. Draw a marble and do not put it back: there is one fewer in the bag.</p>',
        watch: K.film([
          [F.bag(3, 2), '3 red and 2 blue. P(red first) = 3/5.'],
          [F.bag(3, 2, true), 'Keep the red. Now 2 red out of 4 are left.'],
          [T(['P(red, red) = 3/5 × 2/4', '= 6/20 = 3/10']), 'Multiply: 3/10.', 2600]
        ]),
        example: K.film([
          [F.bag(2, 5), 'My turn. A bag has 2 red and 5 blue marbles. I take two, without putting the first back. I will find P(red, red).'],
          [T(['P(red first) = 2/7']), 'First draw: 2 red out of 7. P = 2/7.'],
          [F.bag(2, 5, true), 'I keep the red. Now 1 red is left, out of 6 marbles. P(red second) = 1/6.'],
          [T(['2/7 × 1/6 = 2/42', '= 1/21']), 'I multiply along the path: 2/42. I simplify: <b>1/21</b>.'],
          [T(['1/21 &lt; 2/7 ✓']), 'I check: two reds in a row is less likely than one red. <b>Second draw: one fewer of that colour, and one fewer in total.</b>', 2800]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Set the bag to <b>4 red and 2 blue</b>, not putting it back.', goal: function (g) { return g('bgr') === 4 && g('bgb') === 2 && g('bgp') === 0; }, yes: '4/6 × 3/5 = 12/30 = 2/5.' },
          { do: 'Now <b>put it back</b>. Does P(red, red) go up or down?', goal: function (g) { return g('bgr') === 4 && g('bgb') === 2 && g('bgp') === 1; }, yes: '4/6 × 4/6 = 4/9, a bit more, because the red is back.' }] }),
        ways: [{ label: 'Act it out', html: '<p>Put 3 red and 2 blue counters in a cup. Take one red out and look: what is left for the second draw?</p>' }],
        key: '<p>Second draw: <b>one fewer</b> of that colour and one fewer in total.</p>',
        mistake: '<p>Using 3/5 for the second draw too. Ask: "How many are left in the bag now?"</p>',
        check: [K.chk(C, 'pb-dep', 1), K.chk(C, 'pb-dep', 2)] },
      { id: 'which', title: 'Independent or dependent?', exp: ['D2.2'], skill: 'pb-dep',
        body: '<p>Ask: does the first event change what can happen next? Coins and dice have no memory: independent. Cards or marbles kept out: dependent.</p>',
        watch: K.film([
          [T(['coin, then die']), 'The coin cannot change the die: independent.'],
          [T(['two cards, first not returned']), 'The deck has changed: dependent.'],
          [T(['marble drawn, then put back']), 'The bag is back to how it was: independent.', 2600]
        ]),
        example: K.film([
          [T(['pick a president,', 'then a vice-president']), 'My turn. A class picks a president, then a different student as vice-president. I will decide: independent or dependent?'],
          [T(['first pick leaves', 'one fewer student']), 'First I ask: did the first event change the setup? Yes. The president cannot be picked again, so one fewer student is left.'],
          [T(['→ dependent']), 'The setup changed, so the events are dependent.'],
          [T(['spinner, then die', '→ independent']), 'Compare: a spinner cannot change a die, so those are independent. <b>Did the first event change the setup? Then dependent.</b>', 2800]
        ]),
        key: '<p>Did the first event <b>change the setup</b>? Then dependent.</p>',
        mistake: '<p>Thinking a coin is "due" for heads after several tails. Each flip is independent.</p>',
        check: [K.mc('You flip a coin and get tails 5 times in a row. What is P(heads) on the next flip?', '1/2', ['More than 1/2', 'Less than 1/2'], 'Does the coin remember earlier flips?', 'Flips are independent: still 1/2.'), K.chk(C, 'pb-dep', 3)] }
    ] },
    { id: 'venn', title: 'Venn diagrams', sub: 'Overlaps without double counting.', concepts: [
      { id: 'overlap', title: 'Reading a Venn diagram', exp: ['D2.1'], skill: 'pb-venn',
        body: '<p>A <b>Venn diagram</b> sorts a group into overlapping circles. The overlap holds the people in both groups. Outside the circles are those in neither.</p>',
        watch: K.film([
          [F.venn('Hockey', 'Soccer', 13, 5, 7, 5), '30 students. 18 play hockey, 12 play soccer, 5 play both.'],
          [F.venn('Hockey', 'Soccer', 13, 5, 7, 5, 'and'), 'The overlap: 5 play both. Hockey only is 18 − 5 = 13.'],
          [F.venn('Hockey', 'Soccer', 13, 5, 7, 5, 'a'), 'All hockey players: 13 + 5 = 18.', 2600]
        ]),
        example: K.film([
          [T(['28 students', 'cat 15, dog 11, both 4']), 'My turn. In a class of 28, 15 have a cat, 11 have a dog, and 4 have both. I will fill the Venn diagram.'],
          [F.venn('Cat', 'Dog', 11, 4, 7, 6, 'and'), 'First the overlap: 4 have both.'],
          [F.venn('Cat', 'Dog', 11, 4, 7, 6), 'Next the only parts. Cat only: 15 − 4 = 11. Dog only: 11 − 4 = 7.'],
          [F.venn('Cat', 'Dog', 11, 4, 7, 6), 'Then outside both circles: 28 − 11 − 4 − 7 = 6 have neither.'],
          [T(['11 + 4 + 7 + 6 = 28 ✓']), 'I check that everyone is counted once: 28. <b>Fill the overlap first, then the only parts.</b>', 2600]
        ]),
        key: '<p>Fill the <b>overlap first</b>, then the "only" parts.</p>',
        mistake: '<p>Putting 18 in the hockey-only part. The 5 in the overlap are part of the 18.</p>',
        check: [K.chk(C, 'pb-venn', 1), K.chk(C, 'pb-venn', 2)] },
      { id: 'or', title: 'P(A or B)', exp: ['D2.1'], skill: 'pb-venn', hard: true,
        body: '<p>To find P(A or B), count everyone in either circle once. Adding the two circle totals counts the overlap twice.</p>',
        watch: K.film([
          [F.venn('Hockey', 'Soccer', 13, 5, 7, 5, 'or'), 'Hockey or soccer: 13 + 5 + 7 = 25.'],
          [T(['18 + 12 = 30 ✗', 'counts the 5 twice']), 'Adding 18 + 12 counts the overlap twice.'],
          [T(['P = 25/30 = 5/6']), 'P(hockey or soccer) = 25/30 = 5/6.', 2600]
        ]),
        example: K.film([
          [F.venn('Canoe', 'Hike', 16, 6, 9, 9), 'My turn. At a camp of 40, 22 canoe, 15 hike, and 6 do both. I will find P(canoe or hike).'],
          [F.venn('Canoe', 'Hike', 16, 6, 9, 9, 'or'), 'First I shade everyone in either circle: 16 + 6 + 9 = 31.'],
          [T(['22 + 15 = 37 ✗', 'the 6 counted twice']), 'I do not just add 22 + 15. That counts the 6 in the overlap twice. 37 − 6 = 31.'],
          [T(['P(canoe or hike) = 31/40']), 'So P(canoe or hike) = 31/40. <b>Count the overlap once.</b>', 2600]
        ]),
        ways: [{ label: 'The formula', html: '<p>P(A or B) = P(A) + P(B) − P(A and B) = 18/30 + 12/30 − 5/30 = 25/30.</p>' },
          { label: 'Use "neither"', html: '<p>5 play neither, so 30 − 5 = 25 play at least one.</p>' }],
        key: '<p>Count the overlap <b>once</b>.</p>',
        mistake: '<p>Adding both circle totals. Ask: "Did anyone get counted twice?"</p>',
        check: [K.chk(C, 'pb-venn', 3), K.num('Same class of 30: what is the probability a student plays neither sport?', 1 / 6, 'Count outside both circles.', '30 − 25 = 5. 5/30 = 1/6.', { show: '1/6' })] }
    ] },
    { id: 'exp', title: 'Experiments', sub: 'What happens when you actually try it.', concepts: [
      { id: 'trials', title: 'Experimental probability', exp: ['D2.1', 'D2.2'], skill: 'pb-exp',
        body: '<p><b>Experimental probability</b> = times it happened ÷ number of trials. With more trials, it usually gets closer to the theoretical probability.</p>',
        watch: K.film([
          [F.compareBars(0.19, 1 / 6, '200'), '200 rolls of two dice: a sum of 7 came up 38 times, 0.19.'],
          [F.compareBars(0.168, 1 / 6, '10 000'), '10 000 rolls: 0.168. Very close to the theory, 6/36 ≈ 0.167.', 2800]
        ]),
        example: K.film([
          [T(['roll a die: P(4)?']), 'My turn. I will compare an experiment with the theory for rolling a 4.'],
          [T(['theory: 1/6 ≈ 0.167']), 'First the theory: one 4 out of six faces. 1/6 ≈ 0.167.'],
          [F.compareBars(14 / 60, 1 / 6, '60'), 'I roll 60 times and get a 4 fourteen times. 14 ÷ 60 ≈ 0.233. A bit far from the theory.'],
          [F.compareBars(1012 / 6000, 1 / 6, '6000'), 'I roll 6000 times and get 1012 fours: 1012 ÷ 6000 ≈ 0.169. Very close. <b>More trials, closer to theory.</b>', 2800]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Choose <b>two dice: sum of 7</b>, set <b>10 000</b> trials, and run them.', goal: function (g) { return g('sie') === 's7' && /in 10.000 trials/.test(g.text('#siout')); }, yes: 'With 10 000 trials the bars almost match.' },
          { do: 'Now run just <b>10</b> trials a few times. How much do the results jump?', goal: function (g) { return /in 10 trials/.test(g.text('#siout')); }, yes: 'Small samples vary a lot. That is why we run many trials.' }] }),
        key: '<p>More trials → <b>closer to theory</b>.</p>',
        mistake: '<p>Expecting 10 trials to match the theory exactly. Small samples vary.</p>',
        check: [K.chk(C, 'pb-exp', 1), K.chk(C, 'pb-exp', 1)] },
      { id: 'predict', title: 'Predicting results', exp: ['D2.2'], skill: 'pb-exp', hard: true,
        body: '<p>Expected count = probability × number of trials. It is a prediction for the long run, not a promise.</p>',
        watch: K.film([
          [T(['P(two heads) = 1/4']), 'Flip two coins.'],
          [T(['400 trials × 1/4 = 100']), 'In 400 trials, expect about 100 double heads.'],
          [T(['real result: 93, 107, 101…']), 'Real results land near 100, not exactly on it.', 2600]
        ]),
        example: K.film([
          [T(['spinner: 5 equal parts,', '1 part is gold']), 'My turn. A spinner has 5 equal parts, and 1 is gold. I will predict how many golds in 250 spins.'],
          [T(['P(gold) = 1/5']), 'First the probability: 1 part out of 5.'],
          [T(['250 × 1/5 = 50']), 'Next I multiply by the number of trials: 250 × 1/5 = 50.'],
          [T(['expect about 50']), 'I expect about 50 golds. A real run might give 46 or 53: near 50, not exactly on it. <b>Expected = P × trials.</b>', 2600]
        ]),
        ways: [{ label: 'Scale a fraction', html: '<p>1/4 of the time means 1 out of every 4. In 400 trials there are 100 groups of 4.</p>' }],
        key: '<p>Expected = <b>P × trials</b>.</p>',
        mistake: '<p>Dividing trials by the probability (400 ÷ 1/4 = 1600). Expected must be less than the number of trials.</p>',
        check: [K.chk(C, 'pb-exp', 2), K.chk(C, 'pb-exp', 3)] }
    ] }
  ]);
})();