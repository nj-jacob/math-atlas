/* Grade 8 Probability: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/probability.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names.
   Ontario 2020: D2.1 probability with tree and Venn diagrams, the chance an event does not happen, and "or"; D2.2
   several independent and dependent events, and comparing what should happen with what does. The answer checks are in
   tests/verify/sheets.js: every probability is worked out again by listing all the outcomes (sp), by drawing from the
   bag with or without putting back (bag), or from the Venn diagram's counts (vp); expected counts are the probability
   times the number of trials. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var DIE = ['1', '2', '3', '4', '5', '6'], COIN = ['H', 'T'];
  function fr(k, n) { return S.asFrac(k / n); }
  /* a probability by listing outcomes: sets of outcomes for each event, o.ev the allowed outcomes (null for any), o.sum,
     o.more, o.dbl as in the check; row is what is written before "=" */
  function SP(q, sets, o, row, extra) {
    var all = sets.reduce(function (acc, set) { var out = []; acc.forEach(function (a) { set.forEach(function (x) { out.push(a.concat([x])); }); }); return out; }, [[]]);
    var ok = all.filter(function (oc) {
      return (!o.ev || oc.every(function (x, i) { return !o.ev[i] || o.ev[i].indexOf(x) >= 0; })) && (o.sum == null || oc.reduce(function (t, x) { return t + +x; }, 0) === o.sum) &&
        (o.more == null || oc.reduce(function (t, x) { return t + +x; }, 0) > o.more) && (!o.dbl || oc.every(function (x) { return x === oc[0]; }));
    });
    var it = { q: q, eq: [row + ' = []'], a: [fr(ok.length, all.length)], sp: { sets: sets, ev: o.ev, sum: o.sum, more: o.more, dbl: o.dbl } };
    if (extra) Object.keys(extra).forEach(function (k) { it[k] = extra[k]; });
    if (it.trials) { it.eq = ['about [] times']; it.a = [ok.length / all.length * it.trials]; }
    if (it.pct) { it.eq = [row + ' = [] %']; it.a = [+(ok.length / all.length * 100).toFixed(4)]; }
    return it;
  }
  /* one die or spinner: the chance of the listed outcomes */
  function ONE(q, set, ev, row) { return SP(q, [set], { ev: [ev] }, row); }
  /* a bag: c counts, draw the colours in order, back: put back between draws */
  function BAG(c, draw, back, row) {
    var n = 0, k; for (k in c) n += c[k];
    var p = 1, cc = {}; for (k in c) cc[k] = c[k];
    draw.forEach(function (d) { var t = 0, j; for (j in cc) t += cc[j]; p *= cc[d] / t; if (!back) cc[d]--; });
    var said = Object.keys(c).map(function (j) { return c[j] + ' ' + j; }).join(', ');
    return { q: 'A bag has ' + said + '. Draw ' + draw.length + (back ? ', putting it back.' : ', not putting back.'), eq: [row + ' = []'], a: [S.asFrac(p)], bag: { c: c, draw: draw, back: back } };
  }
  function VN(a, b, n, part, row, count) {
    var t = n[0] + n[1] + n[2] + n[3], v = { a: n[0] + n[1], b: n[1] + n[2], both: n[1], either: n[0] + n[1] + n[2], neither: n[3], aonly: n[0], bonly: n[2] }[part];
    return { pic: ['pvenn', { a: a, b: b, n: n }], q: count ? 'How many?' : 'Choose one person.', eq: [row + ' = []'], a: [count ? v : S.asFrac(v / t)], vp: part, vcount: !!count };
  }
  function IND(q, back) { return { q: q, pick: { opts: ['independent', 'dependent'], ans: back ? 0 : 1, indep: { back: back } }, wide: true }; }

  S.register('probability', { code: 'PB', ideas: {

    theory: {
      watch: 'counting outcomes that are not equally likely. List outcomes that each have the same chance.',
      goal: 'I can find a theoretical probability.',
      learn: {
        show: { cap: 'favourable outcomes ÷ all equally likely outcomes', eq: ['P(even on a die) = 3/6 = 1/2'] },
        together: [ONE('Roll a die.', DIE, ['5', '6'], 'P(5 or 6)')],
        cue: 'Count the outcomes you want. Divide by all the outcomes.',
        own: [ONE('Roll a die.', DIE, ['1', '2', '3', '4'], 'P(less than 5)'), ONE('Spin A, B, C, D, E.', ['A', 'B', 'C', 'D', 'E'], ['A'], 'P(A)')]
      },
      p1: {
        show: { eq: ['P(3) = 1/6', 'P(odd) = 3/6 = 1/2'] },
        items: [ONE('Roll a die.', DIE, ['2'], 'P(2)'), ONE('Roll a die.', DIE, ['1', '3', '5'], 'P(odd)'), ONE('Roll a die.', DIE, ['3', '6'], 'P(a multiple of 3)'),
          ONE('Spin 1 to 8.', ['1', '2', '3', '4', '5', '6', '7', '8'], ['2', '3', '5', '7'], 'P(prime)'), ONE('Spin 1 to 10.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], ['10'], 'P(10)'),
          ONE('Roll a die.', DIE, [], 'P(7)')]
      },
      p2: {
        items: [ONE('Spin 1 to 10.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], ['3', '6', '9'], 'P(multiple of 3)'),
          ONE('Spin 1 to 12.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], ['1', '2', '3', '4', '6', '12'], 'P(factor of 12)'),
          SP('Roll a die 300 times.', [DIE], { ev: [['6']] }, 'P(6)', { trials: 300 }),
          SP('Roll a die.', [DIE], { ev: [['1', '2', '3']] }, 'P(1, 2 or 3)', { pct: true }),
          ONE('Pick a letter of CANADA.', ['C', 'A1', 'N', 'A2', 'D', 'A3'], ['A1', 'A2', 'A3'], 'P(A)')]
      },
      p3: {
        items: [ONE('Spin 1 to 20.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'], ['4', '8', '12', '16', '20'], 'P(multiple of 4)'),
          SP('Spin 1 to 8, 400 times.', [['1', '2', '3', '4', '5', '6', '7', '8']], { ev: [['1', '8']] }, 'P(1 or 8)', { trials: 400 }),
          SP('Spin 1 to 5.', [['1', '2', '3', '4', '5']], { ev: [['2', '4']] }, 'P(even)', { pct: true }),
          ONE('Pick a letter of ONTARIO.', ['O1', 'N', 'T', 'A', 'R', 'I', 'O2'], ['O1', 'A', 'I', 'O2'], 'P(vowel)')]
      },
      think: {
        items: [{ q: '{a} says a spinner with red and blue has P(red) = 1/2. When is that wrong?', lines: { n: 3, key: 'When the parts are not equal: if red is 3 of 4 equal parts, P(red) = 3/4.' } },
          { q: 'What does a probability of 0 mean? Of 1?', lines: { n: 2, key: '0: it cannot happen. 1: it is certain.' } },
          ONE('Roll a die.', DIE, ['1', '2', '3', '4', '5', '6'], 'P(1 to 6)'),
          { q: 'Make a spinner where P(green) = 3/8.', draw: { h: 70, key: 'A spinner with 8 equal parts, 3 of them green.' } }]
      }
    },

    not: {
      watch: 'counting the outcomes again. P(not A) = 1 − P(A).',
      goal: 'I can find the chance an event does not happen.',
      learn: {
        show: { cap: 'it happens or it does not: the two add to 1', eq: ['P(not 6) = 1 − 1/6 = 5/6'] },
        together: [ONE('Roll a die.', DIE, ['1', '2', '3', '4'], 'P(not 5 or 6)')],
        cue: 'Find P(A). Take it from 1.',
        own: [ONE('Spin 1 to 8.', ['1', '2', '3', '4', '5', '6', '7', '8'], ['1', '2', '3', '4', '5', '6', '7'], 'P(not 8)'), { eq: ['1 − 2/9 = []'], a: ['7/9'] }]
      },
      p1: {
        show: { eq: ['P(rain) = 0.3', 'P(no rain) = 0.7'] },
        items: [{ eq: ['1 − 1/4 = []'], a: ['3/4'] }, { eq: ['1 − 0.35 = []'], a: [0.65] }, { eq: ['100% − 12% = [] %'], a: [88] },
          ONE('Roll a die.', DIE, ['1', '2', '3', '4', '5'], 'P(not 6)'), ONE('Roll a die.', DIE, ['2', '4', '6'], 'P(not odd)'),
          ONE('Spin 1 to 10.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], ['1', '2', '3', '4', '5', '6', '7', '8'], 'P(not 9 or 10)')]
      },
      p2: {
        items: [{ q: 'P(win) = 3/20. P(not win)?', eq: ['1 − 3/20 = []'], a: ['17/20'] }, { q: 'P(late) = 0.08. P(not late)?', eq: ['1 − 0.08 = []'], a: [0.92] },
          { q: 'There is a 65% chance of sun. Chance of no sun?', eq: ['100% − 65% = [] %'], a: [35] },
          ONE('Spin 1 to 12.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'P(not 11 or 12)'),
          BAG({ red: 3, blue: 5, green: 2 }, ['blue'], true, 'P(blue)')]
      },
      p3: {
        items: [SP('Toss two coins.', [COIN, COIN], { ev: [['H'], ['H']] }, 'P(two heads)'), { q: 'So P(not two heads)?', eq: ['1 − 1/4 = []'], a: ['3/4'] },
          { q: 'A team wins 0.45 of games and ties 0.1. What is P(lose)?', eq: ['1 − 0.45 − 0.1 = []'], a: [0.45] },
          { q: 'P(red) = 2/7 and P(blue) = 3/7. What is P(neither)?', eq: ['1 − 2/7 − 3/7 = []'], a: ['2/7'] },
          SP('Spin 1 to 6, 240 times.', [DIE], { ev: [['1', '2', '3', '4', '5']] }, 'P(not 6)', { trials: 240 })]
      },
      think: {
        items: [{ q: 'Why do P(A) and P(not A) add to 1?', lines: { n: 3, key: 'Every outcome is either in A or not in A, and all outcomes together are certain: 1.' } },
          { q: 'When is it easier to find P(not A) first?', lines: { n: 2, key: 'When A has many outcomes, like "not all heads": find P(all heads) and take it from 1.' } },
          { eq: ['1 − 5/12 = []'], a: ['7/12'] },
          { q: 'Can P(not A) be greater than P(A)? Give an example.', lines: { n: 2, key: 'Yes: P(6) = 1/6, P(not 6) = 5/6.' } }]
      }
    },

    tree: {
      watch: 'missing branches. Each outcome of the first event branches into every outcome of the second.',
      goal: 'I can list outcomes with a tree diagram.',
      learn: {
        show: { pic: ['ptree', { a: COIN, b: COIN }], cap: '2 × 2 = 4 outcomes' },
        together: [{ q: 'A coin and a spinner A, B, C. How many outcomes?', pic: ['ptree', { a: COIN, b: ['A', 'B', 'C'] }], eq: ['[] outcomes'], a: [6] }],
        cue: 'Every first branch splits into all the second outcomes.',
        own: [SP('A coin, then a die.', [COIN, DIE], { ev: [['H'], ['1', '2', '3', '4', '5', '6']] }, 'P(H, any)'), { q: 'A die then a coin: how many outcomes?', eq: ['6 × 2 = []'], a: [12] }]
      },
      p1: {
        show: { eq: ['outcomes = 2 × 3 = 6'] },
        items: [{ q: '3 shirts and 4 pants. How many outfits?', eq: ['3 × 4 = []'], a: [12] }, { q: 'A die and a spinner 1 to 5. Outcomes?', eq: ['6 × 5 = []'], a: [30] },
          SP('Spin A, B. Then toss a coin.', [['A', 'B'], COIN], { ev: [['A'], ['T']] }, 'P(A, T)'),
          SP('Spin A, B, C. Then toss a coin.', [['A', 'B', 'C'], COIN], { ev: [['A', 'B'], ['H']] }, 'P(A or B, then H)'),
          SP('Toss 3 coins.', [COIN, COIN, COIN], { dbl: true }, 'P(all the same)')]
      },
      p2: {
        items: [SP('Toss a coin and roll a die.', [COIN, DIE], { ev: [['H'], ['2', '4', '6']] }, 'P(H, even)'),
          SP('Roll two dice.', [DIE, DIE], { dbl: true }, 'P(a double)'),
          SP('Roll two dice.', [DIE, DIE], { sum: 7 }, 'P(sum 7)'),
          SP('Roll two dice.', [DIE, DIE], { more: 9 }, 'P(sum more than 9)'),
          { q: 'Toss 4 coins. How many outcomes?', eq: ['2 × 2 × 2 × 2 = []'], a: [16] }]
      },
      p3: {
        items: [SP('Roll two dice.', [DIE, DIE], { sum: 10 }, 'P(sum 10)'), SP('Toss 3 coins.', [COIN, COIN, COIN], { ev: [['H'], ['H'], ['H']] }, 'P(HHH)'),
          SP('Spin 1 to 4 twice.', [['1', '2', '3', '4'], ['1', '2', '3', '4']], { sum: 5 }, 'P(sum 5)'),
          SP('Roll two dice, 360 times.', [DIE, DIE], { sum: 7 }, 'P(sum 7)', { trials: 360 }),
          { q: 'A menu: 3 mains, 2 sides, 4 drinks. How many meals?', eq: ['3 × 2 × 4 = []'], a: [24] }]
      },
      think: {
        items: [{ q: 'Why is the total number of outcomes a product?', lines: { n: 3, key: 'Each first outcome pairs with every second outcome: 2 × 3 pairs.' } },
          { q: 'Draw a tree for a coin then a spinner R, G.', draw: { h: 80, key: 'H splits to HR, HG; T splits to TR, TG: 4 outcomes.' } },
          SP('Roll two dice.', [DIE, DIE], { sum: 12 }, 'P(sum 12)'),
          { q: 'Why is a sum of 7 the most likely with two dice?', lines: { n: 2, key: 'It has the most ways: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1.' } }]
      }
    },

    multiply: {
      watch: 'adding the probabilities along a path. Multiply along a path: 1/2 × 1/6 = 1/12.',
      goal: 'I can multiply probabilities of independent events.',
      learn: {
        show: { cap: 'P(H then 6)', eq: ['1/2 × 1/6 = 1/12'] },
        together: [SP('Toss a coin, roll a die.', [COIN, DIE], { ev: [['T'], ['1', '2']] }, 'P(T, 1 or 2)')],
        cue: 'Find each probability. Multiply along the path.',
        own: [{ eq: ['1/2 × 1/2 = []'], a: ['1/4'] }, SP('Roll two dice.', [DIE, DIE], { ev: [['6'], ['6']] }, 'P(6, 6)')]
      },
      p1: {
        show: { eq: ['P(H, H, H) = 1/2 × 1/2 × 1/2', '= 1/8'] },
        items: [{ eq: ['1/3 × 1/4 = []'], a: ['1/12'] }, { eq: ['1/2 × 2/5 = []'], a: ['1/5'] }, { eq: ['0.5 × 0.4 = []'], a: [0.2] },
          SP('Roll a die, toss a coin.', [DIE, COIN], { ev: [['1', '3', '5'], ['H']] }, 'P(odd, H)'),
          SP('Spin 1 to 4 twice.', [['1', '2', '3', '4'], ['1', '2', '3', '4']], { ev: [['4'], ['4']] }, 'P(4, 4)')]
      },
      p2: {
        items: [{ eq: ['3/4 × 2/3 = []'], a: ['1/2'] }, { eq: ['0.3 × 0.3 = []'], a: [0.09] },
          BAG({ red: 2, blue: 3 }, ['red', 'red'], true, 'P(red, red)'), BAG({ red: 4, green: 6 }, ['red', 'green'], true, 'P(red, green)'),
          SP('Toss 3 coins.', [COIN, COIN, COIN], { ev: [['T'], ['T'], ['T']] }, 'P(TTT)')]
      },
      p3: {
        items: [{ q: 'P(rain) is 0.4 on Monday and 0.4 on Tuesday. P(rain both days)?', eq: ['0.4 × 0.4 = []'], a: [0.16] },
          { q: 'A player scores 70% of free throws. P(scoring two in a row)?', eq: ['0.7 × 0.7 = []'], a: [0.49] },
          BAG({ red: 3, white: 7 }, ['white', 'white'], true, 'P(white, white)'),
          SP('Roll a die 3 times.', [DIE, DIE, DIE], { ev: [['6'], ['6'], ['6']] }, 'P(three 6s)')]
      },
      think: {
        items: [{ q: '{a} says P(H, H) = 1/2 + 1/2 = 1. Explain.', lines: { n: 3, key: 'That says two heads are certain. Multiply: 1/2 × 1/2 = 1/4.' } },
          { q: 'Why does multiplying make the chance smaller?', lines: { n: 2, key: 'Both things must happen. A fraction of a fraction is smaller.' } },
          BAG({ red: 1, blue: 4 }, ['blue', 'blue'], true, 'P(blue, blue)'),
          { q: 'Check P(H, 6) = 1/12 with a tree.', lines: { n: 2, key: '2 × 6 = 12 equally likely branches, and one is H, 6.' } }]
      }
    },

    noreplace: {
      watch: 'using the same bag for the second draw. Without putting back, there is one fewer of that colour and one fewer in all.',
      goal: 'I can find probabilities of dependent events.',
      learn: {
        show: { cap: '3 red, 2 blue, not putting back', eq: ['P(red, red) = 3/5 × 2/4 = 3/10'] },
        together: [BAG({ red: 4, blue: 2 }, ['red', 'red'], false, 'P(red, red)')],
        cue: 'After a draw, take one from that colour and one from the total.',
        own: [BAG({ red: 2, green: 3 }, ['green', 'green'], false, 'P(green, green)'), BAG({ red: 2, green: 3 }, ['red', 'green'], false, 'P(red, green)')]
      },
      p1: {
        show: { eq: ['5 in the bag, then 4'] },
        items: [BAG({ red: 3, blue: 1 }, ['red', 'red'], false, 'P(red, red)'), BAG({ red: 5, blue: 5 }, ['blue', 'blue'], false, 'P(blue, blue)'),
          BAG({ red: 2, white: 4 }, ['red', 'white'], false, 'P(red, white)'), BAG({ red: 2, white: 4 }, ['white', 'red'], false, 'P(white, red)')]
      },
      p2: {
        items: [BAG({ red: 6, blue: 4 }, ['red', 'blue'], false, 'P(red, blue)'), BAG({ red: 1, blue: 4 }, ['red', 'red'], false, 'P(red, red)'),
          BAG({ green: 3, yellow: 5 }, ['yellow', 'yellow'], false, 'P(yellow, yellow)'), BAG({ green: 3, yellow: 5 }, ['yellow', 'yellow'], true, 'P(yellow, yellow)')]
      },
      p3: {
        items: [BAG({ red: 4, blue: 3, green: 1 }, ['blue', 'green'], false, 'P(blue, green)'), BAG({ red: 5, blue: 3 }, ['red', 'red', 'red'], false, 'P(red, red, red)'),
          { q: '12 names in a hat, 3 are from Grade 8. Two are drawn. P(both Grade 8)?', eq: ['3/12 × 2/11 = []'], a: ['1/22'] }]
      },
      think: {
        items: [{ q: 'Why does the second fraction change without putting back?', lines: { n: 3, key: 'One marble is gone: there is one fewer of that colour and one fewer in all.' } },
          { q: 'Can P(red, red) be 0 without putting back? When?', lines: { n: 2, key: 'Yes, when there is only 1 red in the bag.' } },
          BAG({ red: 2, blue: 2 }, ['red', 'blue'], false, 'P(red, blue)'),
          { q: 'Give a real example of dependent events.', lines: { n: 2, key: 'For example drawing two cards without putting the first back.' } }]
      }
    },

    which: {
      watch: 'calling every two-step event dependent. They are dependent only when the first changes the chances of the second.',
      goal: 'I can tell independent from dependent events.',
      learn: {
        show: { cap: 'putting back: the chances stay the same', eq: ['independent'] },
        together: [IND('Roll a die, then toss a coin.', true)],
        cue: 'Does the first result change the chances of the second?',
        own: [IND('Draw a card, keep it, draw another.', false), IND('Spin a spinner twice.', true)]
      },
      p1: {
        show: { eq: ['not put back:', 'dependent'] },
        items: [IND('Pick a name, put it back, pick again.', true), IND('Pick two students for a team, one after the other.', false),
          IND('Toss a coin two times.', true), IND('Eat a candy from a bag, then pick another.', false)]
      },
      p2: {
        items: [IND('Draw a marble, put it back, draw again.', true), IND('Choose two different books from a shelf.', false),
          BAG({ red: 3, blue: 3 }, ['red', 'red'], true, 'P(red, red)'), BAG({ red: 3, blue: 3 }, ['red', 'red'], false, 'P(red, red)')]
      },
      p3: {
        items: [BAG({ red: 4, white: 6 }, ['white', 'white'], true, 'P(white, white)'), BAG({ red: 4, white: 6 }, ['white', 'white'], false, 'P(white, white)'),
          { q: 'How much less likely is white, white without putting back?', eq: ['9/25 − 1/3 = []'], a: ['2/75'] },
          IND('Roll two dice at the same time.', true)]
      },
      think: {
        items: [{ q: 'Why is "putting back" independent?', lines: { n: 3, key: 'The bag is the same for the second draw, so the chances are the same.' } },
          { q: 'Is the weather today and tomorrow independent? Explain.', lines: { n: 2, key: 'Not really: a rainy day is often followed by another, so one changes the other.' } },
          IND('Choose a president, then a different vice-president.', false),
          { q: 'Write a pair of independent events.', lines: { n: 1, key: 'For example toss a coin and roll a die.' } }]
      }
    },

    overlap: {
      watch: 'adding the overlap twice. A person in both circles is counted once.',
      goal: 'I can read a Venn diagram.',
      learn: {
        show: { cap: 'the middle is both; outside the circles is neither', eq: ['Hockey: 8 + 5 = 13'] },
        together: [VN('Hockey', 'Soccer', [8, 5, 7, 4], 'b', 'Soccer', true)],
        cue: 'Inside a circle counts for that group. The middle counts for both.',
        own: [VN('Hockey', 'Soccer', [8, 5, 7, 4], 'both', 'P(both)')]
      },
      p1: {
        show: { eq: ['circle A = A only + both'] },
        items: [VN('Art', 'Music', [6, 4, 9, 1], 'a', 'Art', true), VN('Art', 'Music', [6, 4, 9, 1], 'b', 'Music', true),
          VN('Art', 'Music', [6, 4, 9, 1], 'both', 'P(both)'), VN('Art', 'Music', [6, 4, 9, 1], 'neither', 'P(neither)')]
      },
      p2: {
        items: [VN('Cats', 'Dogs', [7, 3, 10, 5], 'aonly', 'P(cats only)'), VN('Cats', 'Dogs', [7, 3, 10, 5], 'b', 'P(dogs)'),
          VN('French', 'Cree', [12, 3, 5, 20], 'a', 'P(French)'), VN('French', 'Cree', [12, 3, 5, 20], 'bonly', 'P(Cree only)')]
      },
      p3: {
        items: [VN('Bike', 'Bus', [14, 6, 22, 8], 'neither', 'P(neither)'), VN('Bike', 'Bus', [14, 6, 22, 8], 'aonly', 'P(bike only)'),
          { q: '30 students: 18 like math, 15 like art, 7 like both. How many like neither?', eq: ['30 − (18 + 15 − 7) = []'], a: [4], wide: true }]
      },
      think: {
        items: [{ q: 'Why subtract "both" when you add the two circles?', lines: { n: 3, key: 'People in both are in each circle, so adding counts them twice.' } },
          { q: 'What does the region outside both circles show?', lines: { n: 1, key: 'The people in neither group.' } },
          VN('Ski', 'Skate', [9, 6, 3, 2], 'b', 'P(skate)'),
          { q: 'Draw a Venn diagram: 4 only A, 2 both, 3 only B, 1 neither.', draw: { h: 80, key: 'Two overlapping circles: 4 in A only, 2 in the middle, 3 in B only, 1 outside.' } }]
      }
    },

    or: {
      watch: 'adding P(A) and P(B) when they overlap. Take the overlap away once.',
      goal: 'I can find P(A or B).',
      learn: {
        show: { cap: 'P(A or B) = P(A) + P(B) − P(both)', eq: ['13/24 + 12/24 − 5/24 = 20/24'] },
        together: [VN('Hockey', 'Soccer', [8, 5, 7, 4], 'either', 'P(hockey or soccer)')],
        cue: 'Count everyone in either circle once.',
        own: [VN('Art', 'Music', [6, 4, 9, 1], 'either', 'P(art or music)'), ONE('Roll a die.', DIE, ['2', '4', '5', '6'], 'P(even or 5)')]
      },
      p1: {
        show: { eq: ['P(even or 3)', '= 3/6 + 1/6 = 4/6'] },
        items: [ONE('Roll a die.', DIE, ['1', '2', '3', '5'], 'P(odd or 2)'), ONE('Roll a die.', DIE, ['3', '4', '5', '6'], 'P(more than 3 or 3)'),
          VN('Cats', 'Dogs', [7, 3, 10, 5], 'either', 'P(cats or dogs)'), VN('Bike', 'Bus', [14, 6, 22, 8], 'either', 'P(bike or bus)')]
      },
      p2: {
        items: [ONE('Spin 1 to 10.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], ['2', '4', '5', '6', '8', '10'], 'P(even or 5)'),
          ONE('Spin 1 to 10.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], ['2', '3', '4', '6', '8', '9', '10'], 'P(even or multiple of 3)'),
          { q: 'P(A) = 0.5, P(B) = 0.3, P(both) = 0.1. P(A or B)?', eq: ['0.5 + 0.3 − 0.1 = []'], a: [0.7] },
          { q: 'P(A) = 2/5, P(B) = 1/5, they never happen together. P(A or B)?', eq: ['2/5 + 1/5 = []'], a: ['3/5'] }]
      },
      p3: {
        items: [ONE('Spin 1 to 12.', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], ['3', '4', '6', '8', '9', '12'], 'P(multiple of 3 or 4)'),
          { q: 'P(A) = 0.45, P(B) = 0.35, P(both) = 0.15. P(A or B)?', eq: ['0.45 + 0.35 − 0.15 = []'], a: [0.65] },
          { q: 'In a class of 28, 12 play piano, 10 play guitar, 4 play both. P(piano or guitar)?', eq: ['(12 + 10 − 4)/28 = []'], a: ['9/14'], wide: true }]
      },
      think: {
        items: [{ q: 'When can you just add P(A) and P(B)?', lines: { n: 2, key: 'When A and B cannot happen together: no overlap.' } },
          { q: '{a} says P(even or more than 3) on a die is 3/6 + 3/6 = 1. Explain.', lines: { n: 3, key: '4 and 6 are counted twice. The outcomes are 2, 4, 5, 6: P = 4/6 = 2/3.' } },
          ONE('Roll a die.', DIE, ['2', '3', '4', '6'], 'P(even or 3)'),
          { q: 'Can P(A or B) be less than P(A)? Explain.', lines: { n: 2, key: 'No. "A or B" includes all of A.' } }]
      }
    },

    trials: {
      exp: ['D2.1', 'D2.2'],
      watch: 'expecting the results to match exactly. Experiments vary; more trials come closer to the theory.',
      goal: 'I can find an experimental probability and compare it with the theory.',
      learn: {
        show: { cap: 'heads 27 times in 50 tosses', eq: ['27/50 = 0.54'] },
        together: [{ q: 'A 6 came up 14 times in 60 rolls. Experimental P(6)?', eq: ['[]'], a: ['7/30'], calc: '14 ÷ 60' }],
        cue: 'Times it happened ÷ number of trials.',
        own: [{ q: 'Heads 46 times in 100 tosses. Experimental P(H)?', eq: ['[]'], a: [0.46], calc: '46 ÷ 100' }, { q: 'How far is 0.46 from the theory, 0.5?', eq: ['0.5 − 0.46 = []'], a: [0.04] }]
      },
      p1: {
        show: { eq: ['times ÷ trials', '18 ÷ 40 = 0.45'] },
        items: [{ q: 'Red 12 times in 40 spins. Experimental P(red)?', eq: ['[]'], a: [0.3], calc: '12 ÷ 40' }, { q: 'Tails 31 times in 50 tosses. P(tails)?', eq: ['[]'], a: [0.62], calc: '31 ÷ 50' },
          { q: 'A double came up 9 times in 36 rolls of two dice. Experimental P?', eq: ['[]'], a: [0.25], calc: '9 ÷ 36' },
          SP('Theory: P(double) for two dice.', [DIE, DIE], { dbl: true }, 'P(double)'),
          { q: 'A sum of 7 came up 22 times in 120 rolls. As a percent?', eq: ['[] %'], a: [18.3333], calc: '22 ÷ 120 × 100', dp: 4 }]
      },
      p2: {
        items: [{ q: '{a} drew blue 18 times in 60 draws, putting back. Experimental P(blue)?', eq: ['[]'], a: [0.3], calc: '18 ÷ 60' },
          BAG({ blue: 2, red: 3 }, ['blue'], true, 'Theory P(blue)'),
          { q: 'Difference between 0.4 (theory) and 0.3 (experiment)?', eq: ['0.4 − 0.3 = []'], a: [0.1] },
          { q: 'Heads: 5 of 10, then 48 of 100, then 503 of 1000. Write the last as a decimal.', eq: ['[]'], a: [0.503], calc: '503 ÷ 1000' }]
      },
      p3: {
        items: [{ q: 'A spinner landed on A 45 times in 150 spins. Experimental P(A) as a percent?', eq: ['[] %'], a: [30], calc: '45 ÷ 150 × 100' },
          { q: 'Two coins tossed 80 times: two heads 24 times. Experimental P?', eq: ['[]'], a: [0.3], calc: '24 ÷ 80' },
          SP('Theory: two coins, P(two heads).', [COIN, COIN], { ev: [['H'], ['H']] }, 'P(HH)'),
          { q: 'How far apart are 0.3 and 1/4?', eq: ['0.3 − 0.25 = []'], a: [0.05] }]
      },
      think: {
        items: [{ q: 'Why do more trials give a result closer to the theory?', lines: { n: 3, key: 'Chance ups and downs even out over many trials.' } },
          { q: 'A die gave 6 nine times in 20 rolls. Is it unfair? Explain.', lines: { n: 3, key: 'Not sure: 20 rolls is few. Roll many more times before deciding.' } },
          { q: 'Green 36 times in 90 spins. Experimental P(green)?', eq: ['[]'], a: [0.4], calc: '36 ÷ 90' },
          { q: 'Plan an experiment to test a spinner.', lines: { n: 2, key: 'Spin it many times, for example 200, tally each result and compare with the theory.' } }]
      }
    },

    predict: {
      watch: 'expecting exactly the predicted number. Probability times trials is about how many.',
      goal: 'I can predict results from a probability.',
      learn: {
        show: { cap: 'P(6) = 1/6, 120 rolls', eq: ['1/6 × 120 = about 20'] },
        together: [SP('Roll a die 90 times. How many 3s?', [DIE], { ev: [['3']] }, 'P(3)', { trials: 90 })],
        cue: 'Probability times the number of trials.',
        own: [SP('Toss a coin 70 times. Heads?', [COIN], { ev: [['H']] }, 'P(H)', { trials: 70 }), BAG({ red: 1, blue: 3 }, ['red'], true, 'P(red)')]
      },
      p1: {
        show: { eq: ['0.3 × 200 = 60'] },
        items: [SP('Spin 1 to 4, 80 times. How many 4s?', [['1', '2', '3', '4']], { ev: [['4']] }, 'P(4)', { trials: 80 }),
          SP('Roll a die 300 times. How many even?', [DIE], { ev: [['2', '4', '6']] }, 'P(even)', { trials: 300 }),
          { q: 'P(rain) = 0.3 on each of 30 days. About how many rainy days?', eq: ['0.3 × 30 = []'], a: [9] },
          { q: 'A player hits 25% of shots. In 48 shots, about how many hits?', eq: ['[] hits'], a: [12], calc: '25% of 48' }]
      },
      p2: {
        items: [SP('Roll two dice 180 times. How many doubles?', [DIE, DIE], { dbl: true }, 'P(double)', { trials: 180 }),
          SP('Toss two coins 200 times. How many HH?', [COIN, COIN], { ev: [['H'], ['H']] }, 'P(HH)', { trials: 200 }),
          { q: '2% of phones are faulty. In 3500 phones, how many?', eq: ['[] phones'], a: [70], calc: '2% of 3500' },
          { q: 'P(win) = 1/8. How many games to expect 5 wins?', eq: ['5 × 8 = []'], a: [40] }]
      },
      p3: {
        items: [SP('Roll two dice 720 times. How many sums of 7?', [DIE, DIE], { sum: 7 }, 'P(sum 7)', { trials: 720 }),
          { q: '0.4% of 25 000 tickets win. How many winners?', eq: ['[] tickets'], a: [100], calc: '0.4% of 25000' },
          { q: 'A store expects 3 of every 50 shirts returned. Out of 1200 shirts?', eq: ['3/50 × 1200 = []'], a: [72] },
          { q: 'Predicted 60, got 52. By what percent of the prediction is it off?', eq: ['[] %'], a: [13.3333], calc: '(60 − 52) ÷ 60 × 100', dp: 4 }]
      },
      think: {
        items: [{ q: 'Why say "about 20" and not "exactly 20"?', lines: { n: 2, key: 'Chance varies, so the real count will be near 20, not always 20.' } },
          { q: 'How could a store use a prediction like this?', lines: { n: 2, key: 'For example to order enough stock or plan for returns.' } },
          SP('Spin 1 to 5, 250 times. How many 5s?', [['1', '2', '3', '4', '5']], { ev: [['5']] }, 'P(5)', { trials: 250 }),
          { q: 'A coin gave 62 heads in 100. Predict heads in the next 100. Explain.', lines: { n: 2, key: 'About 50: each toss is still 1/2. The past does not change it.' } }]
      }
    }

  } });
})();
