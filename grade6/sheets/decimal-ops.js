/* Grade 6 Decimal Calculations: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/decimal-ops.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random, so
   a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 multi-step problems and the order of operations; B2.4 add and subtract whole numbers and
   decimals, estimating first; B2.7 three-digit whole numbers times tenths; B2.8 three-digit whole numbers divided by
   tenths, with remainders; B2.11 decimals to thousandths divided by whole numbers up to 10. The answer checks are in
   tests/verify/sheets.js: every sum is worked out again, a circled estimate must be the closest (est), a remainder
   must be less than the divisor and be dropped or rounded up as the story says (rem), and a story's answer follows
   from its numbers (calc). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* a sum and its answer, worked out here with whole numbers so no rounding creeps in (the checks work it out again) */
  function v(e) { return +Function('return ' + e.replace(/(\d) (?=\d{3}\b)/g, '$1').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'))().toFixed(6); }
  function Q(e) { return { eq: [e + ' = []'], a: [v(e)] }; }
  function QW(e) { return { eq: [e + ' = []'], a: [v(e)], wide: true }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* the closest estimate of e */
  function ES(e, opts) {
    var t = v(e), d = opts.map(function (o) { return Math.abs(v(o) - t); }), best = d.indexOf(Math.min.apply(null, d));
    return { q: 'Closest estimate of ' + e + ':', pick: { opts: opts, ans: best, est: e } };
  }
  /* whole number × tenths, by the whole-number fact first */
  function TT(n, t) { return { eq: [n + ' × ' + t + ' = []', n + ' × 0.' + t + ' = []'], a: [n * t, v(n + ' * 0.' + t)] }; }
  /* whole number ÷ tenths: multiply both by 10 first */
  function DT(n, d) { return { eq: [n + ' ÷ ' + d + ' = ' + n * 10 + ' ÷ [] = []'], a: [Math.round(d * 10), v(n * 10 + ' / ' + Math.round(d * 10))], wide: true }; }
  /* a remainder story: t ÷ d with leftovers dropped ('down') or needing one more group ('up') */
  function RM(q, t, d, how, unit) {
    var r = t % d, qq = (t - r) / d;
    return { q: q, eq: [t + ' ÷ ' + d + ' = [] R []', '[] ' + unit], a: [qq, r, how === 'up' && r ? qq + 1 : qq], rem: how };
  }

  S.register('decimal-ops', { code: 'DO', ideas: {

    friendly: {
      watch: 'skipping the estimate and trusting a misplaced decimal point (2.145 instead of 21.45).',
      goal: 'I can estimate with friendly numbers before I calculate.',
      learn: {
        show: { cap: 'round to friendly numbers first', eq: ['19.8 + 31.25 is about 20 + 30', 'about 50'] },
        together: [ES('19.8 + 31.25', ['5', '50', '500']), ES('4.9 × 21', ['10', '100', '1000'])],
        cue: 'Estimate, calculate, then check: is the answer close?',
        own: [ES('62.3 − 18.9', ['40', '45', '80']), ES('298 × 0.5', ['15', '150', '1500']), Q('19.8 + 31.25')]
      },
      p1: {
        show: { eq: ['7.9 × 3 is about 8 × 3 = 24', '7.9 × 3 = 23.7'] },
        items: [ES('8.95 + 3.1', ['10', '12', '20']), ES('99.5 − 49.75', ['40', '50', '60']), ES('6.1 × 4', ['2.4', '24', '240']),
          ES('302 × 0.3', ['9', '90', '900']), Q('8.95 + 3.1'), Q('6.1 × 4')]
      },
      p2: {
        items: [ES('149.8 + 250.4', ['300', '400', '500']), ES('9.96 × 5', ['5', '50', '500']), ES('81.2 ÷ 9', ['0.9', '9', '90']),
          Q('149.8 + 250.4'), Q('9.96 × 5'), Q('81.9 ÷ 9')]
      },
      p3: {
        items: [{ q: '{a} buys a book for $12.95 and a pen for $3.10. About how much is that?', pick: { opts: ['$14', '$16', '$20'], ans: 1, est: '12.95 + 3.10' }, wide: true },
          { q: '{b} says 4.2 × 31 = 1302. Estimate: is that sensible?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '4.2 × 31 = 1302', wide: true },
          Q('4.2 × 31'), ES('597 × 0.2', ['12', '120', '1200']), Q('597 × 0.2')]
      },
      think: {
        items: [{ q: 'Why estimate before you calculate?', lines: { n: 3, key: 'The estimate shows about how big the answer is, so a misplaced decimal point stands out.' } },
          { q: '{b} gets 2.145 for 2.5 + 18.95. What does an estimate tell you?', lines: { n: 3, key: 'About 3 + 19 = 22, so 2.145 cannot be right. It should be 21.45.' } },
          Q('2.5 + 18.95'),
          { q: 'Write a sum whose estimate is about 100.', lines: { n: 1, key: 'For example 49.6 + 50.8 (about 50 + 50).' } }]
      }
    },

    steps: {
      watch: 'working from left to right only (3 + 4 × 2 = 14). Brackets first, then × and ÷, then + and −.',
      goal: 'I can solve problems with several steps.',
      learn: {
        show: { cap: 'brackets, then × and ÷, then + and −', eq: ['3 + 4 × 2 = 3 + 8', '= 11'] },
        together: [Q('5 + 6 × 3'), Q('(5 + 6) × 3')],
        cue: 'Brackets first, then × and ÷ from the left, then + and − from the left.',
        own: [Q('20 − 12 ÷ 4'), Q('2.5 × 4 + 3'), story('{a} buys 3 {many} at $2.50 and a {one} at $4. Cost?', 'dollars', 11.5, '3 × 2.50 + 4')]
      },
      p1: {
        show: { eq: ['(10 − 4) × 2 = 6 × 2 = 12'] },
        items: [Q('8 + 2 × 5'), Q('(8 + 2) × 5'), Q('30 ÷ 5 − 2'), Q('30 ÷ (5 − 2)'), Q('1.5 + 0.5 × 4'), Q('(1.5 + 0.5) × 4')]
      },
      p2: {
        items: [Q('100 − 8 × 7'), Q('48 ÷ (4 + 2)'), Q('3 × 4.5 − 2'), Q('(12.5 − 2.5) ÷ 4'),
          story('{b} earns $15 a week for 4 weeks, then spends $23. How much is left?', 'dollars', 37, '15 × 4 − 23'),
          story('Tickets cost $8.50. A family buys 4 and pays with $50. Change?', 'dollars', 16, '50 − 4 × 8.50')]
      },
      p3: {
        items: [QW('2 × (3.5 + 1.5) − 6 ÷ 3'), QW('(20 − 4) ÷ 8 + 0.75'),
          story('A canoe rental is $25 plus $6.50 per hour. Cost for 3 hours?', 'dollars', 44.5, '25 + 6.50 × 3'),
          story('{a} has 2 bags of 24 {many} and shares them equally among 6 friends. How many each?', '{many}', 8, '2 × 24 ÷ 6'),
          { q: 'Add brackets to make it true: 6 + 4 × 3 = 30', lines: { n: 1, key: '(6 + 4) × 3 = 30' } }]
      },
      think: {
        items: [{ q: '{b} says 3 + 4 × 2 = 14. What went wrong?', lines: { n: 2, key: '{b} added first. × comes before +: 3 + 8 = 11.' } },
          { q: 'Write a story for 4 × 3 + 5.', lines: { n: 2, key: 'For example: 4 bags of 3 {many} and 5 more {many}: 17 {many}.' } },
          QW('(7.5 + 2.5) × (6 − 4)'),
          { q: 'Why do we need an order of operations?', lines: { n: 2, key: 'So everyone gets the same answer from the same sum.' } }]
      }
    },

    lineup: {
      watch: 'lining up the last digits instead of the decimal points. In 14.6 + 3.275, tenths must sit under tenths.',
      goal: 'I can add and subtract decimals by lining up the points.',
      learn: {
        show: { cap: 'points in a line, zeros fill the gaps', eq: ['14.600 + 3.275', '= 17.875'] },
        together: [Q('14.6 + 3.275'), Q('8.4 − 2.75')],
        cue: 'Points in a line. Zeros fill the gaps.',
        own: [Q('5.06 + 12.9'), Q('20 − 6.45'), Q('0.375 + 0.625')]
      },
      p1: {
        show: { eq: ['9.5 − 3.25 = 9.50 − 3.25 = 6.25'] },
        items: [Q('3.4 + 2.15'), Q('7.08 + 1.9'), Q('6.5 − 2.3'), Q('9.2 − 4.75'), Q('12.345 + 0.6'), Q('10 − 0.4')]
      },
      p2: {
        items: [Q('45.6 + 9.875'), Q('100 − 37.25'), Q('3.009 + 4.991'), Q('15.3 − 8.678'), Q('2834 + 1599'), Q('70 000 − 23 456')]
      },
      p3: {
        items: [story('{a} ran 2.75 km, 3.4 km and 1.125 km. How far in all?', 'km', 7.275, '2.75 + 3.4 + 1.125'),
          story('A 5 L jug has 1.375 L of water. How much more to fill it?', 'L', 3.625, '5 − 1.375'),
          story('{b} jumped 3.48 m. Ari jumped 2.9 m. How much farther did {b} jump?', 'm', 0.58, '3.48 − 2.9'),
          QW('125 000 + 87 650'), { eq: ['6.2 + [] = 10'], a: [3.8] }]
      },
      think: {
        items: [{ q: '{b} adds 14.6 + 3.275 and gets 3.421. What went wrong?', lines: { n: 3, key: 'The last digits were lined up, not the points. Line up the points: 14.600 + 3.275 = 17.875.' } },
          { q: 'Why can you write 9.5 as 9.50?', lines: { n: 2, key: 'Zero hundredths adds nothing, so the value stays the same.' } },
          Q('42 − 17.396'),
          { q: 'Write two decimals with 3 places that add to 1.', lines: { n: 1, key: 'For example 0.375 + 0.625.' } }]
      }
    },

    tenths: {
      watch: 'forgetting the decimal point: 245 × 0.3 is not 735. Estimate: a third of 240 is about 80.',
      goal: 'I can multiply a whole number by tenths.',
      learn: {
        show: { cap: '0.3 is 3 tenths', eq: ['245 × 3 = 735', '245 × 0.3 = 73.5'] },
        together: [TT(245, 3), TT(160, 4)],
        cue: 'Multiply by the digit, then divide by 10.',
        own: [TT(128, 6), TT(305, 7), Q('500 × 0.9')]
      },
      p1: {
        show: { eq: ['120 × 0.5 = 600 ÷ 10 = 60'] },
        items: [Q('120 × 0.2'), Q('300 × 0.4'), Q('150 × 0.6'), Q('241 × 0.3'), Q('512 × 0.5'), Q('108 × 0.9')]
      },
      p2: {
        items: [Q('376 × 0.4'), Q('629 × 0.8'), Q('455 × 0.7'), Q('999 × 0.1'),
          story('A bag of rice has a mass of 0.6 kg. What is the mass of 135 bags?', 'kg', 81, '135 × 0.6'),
          story('A {one} is 0.8 m long. How long are 250 of them end to end?', 'm', 200, '250 × 0.8')]
      },
      p3: {
        items: [Q('847 × 0.6'), Q('703 × 0.9'),
          story('Each lap of a pool is 0.5 km. {a} swims 124 laps over a month. How far?', 'km', 62, '124 × 0.5'),
          story('A snail moves 0.3 m each minute. How far in 225 minutes?', 'm', 67.5, '225 × 0.3'),
          { eq: ['[] × 0.4 = 100'], a: [250] }]
      },
      think: {
        items: [{ q: '{b} says 245 × 0.3 = 735. Use an estimate to show why that cannot be right.', lines: { n: 3, key: '0.3 is about a third, and a third of 245 is about 80. So 735 is far too big: 73.5.' } },
          { q: 'Why is 400 × 0.5 the same as half of 400?', lines: { n: 2, key: '0.5 is one half, so 400 × 0.5 = 200.' } },
          Q('968 × 0.7'),
          { q: 'Does multiplying by 0.9 make a number bigger or smaller? Why?', lines: { n: 2, key: 'Smaller. 0.9 is less than 1, so you take only part of the number.' } }]
      }
    },

    scale: {
      watch: 'expecting a smaller answer. Dividing by a number less than 1 always gives a bigger answer.',
      goal: 'I can divide a whole number by tenths.',
      learn: {
        show: { cap: 'times 10 on both sides', eq: ['120 ÷ 0.4 = 1200 ÷ 4', '= 300'] },
        together: [DT(120, 0.4), DT(36, 0.9)],
        cue: 'Times 10 on both sides, then divide by a whole number.',
        own: [DT(150, 0.5), DT(240, 0.6), Q('84 ÷ 0.7')]
      },
      p1: {
        show: { eq: ['6 ÷ 0.2: how many 0.2s in 6?', '60 ÷ 2 = 30'] },
        items: [Q('6 ÷ 0.2'), Q('8 ÷ 0.4'), Q('45 ÷ 0.5'), Q('72 ÷ 0.8'), Q('100 ÷ 0.5'), Q('63 ÷ 0.9')]
      },
      p2: {
        items: [Q('125 ÷ 0.5'), Q('312 ÷ 0.6'), Q('490 ÷ 0.7'), Q('248 ÷ 0.8'),
          story('A ribbon is 18 m long. Each bow uses 0.6 m. How many bows?', 'bows', 30, '18 ÷ 0.6'),
          story('How many 0.4 L cups can be filled from a 120 L tank?', 'cups', 300, '120 ÷ 0.4')]
      },
      p3: {
        items: [Q('525 ÷ 0.3'), Q('816 ÷ 0.4'),
          story('A path is 450 m. A paving stone is 0.9 m long. How many stones in a row?', 'stones', 500, '450 ÷ 0.9'),
          story('Seeds are planted every 0.2 m along a 150 m row. How many gaps?', 'gaps', 750, '150 ÷ 0.2'),
          { eq: ['[] ÷ 0.5 = 360'], a: [180] }]
      },
      think: {
        items: [{ q: '{b} says 120 ÷ 0.4 = 30. What would you tell {b}?', lines: { n: 3, key: 'Dividing by less than 1 gives a bigger answer. 1200 ÷ 4 = 300.' } },
          { q: 'Why does multiplying both numbers by 10 not change the answer?', lines: { n: 3, key: 'Both are 10 times bigger, so the same number of groups fit: 12 ÷ 4 = 120 ÷ 40.' } },
          Q('720 ÷ 0.9'),
          { q: 'Write a story for 30 ÷ 0.5.', lines: { n: 2, key: 'For example: how many 0.5 L bottles can be filled from 30 L? 60.' } }]
      }
    },

    remainder: {
      watch: 'always dropping the remainder. Read the question: full pieces drop it, boxes needed round up.',
      goal: 'I can decide what a remainder means in a story.',
      learn: {
        show: { cap: '50 people, 8 seats a van: 50 ÷ 8 = 6 R 2', eq: ['6 vans hold 48', '7 vans needed'] },
        together: [RM('50 people go to camp. A van holds 8. How many vans are needed?', 50, 8, 'up', 'vans'),
          RM('A 50 m roll of ribbon is cut into 8 m pieces. How many full pieces?', 50, 8, 'down', 'pieces')],
        cue: 'The question decides: drop the leftovers, round up, or keep them as a decimal.',
        own: [RM('125 eggs go in cartons of 12. How many full cartons?', 125, 12, 'down', 'cartons'),
          RM('125 students need tables of 12. How many tables?', 125, 12, 'up', 'tables')]
      },
      p1: {
        show: { eq: ['22 ÷ 4 = 5 R 2', 'as a decimal: 5.5'] },
        items: [RM('31 juice boxes go in packs of 6. How many full packs?', 31, 6, 'down', 'packs'),
          RM('31 hikers, 6 to a tent. How many tents?', 31, 6, 'up', 'tents'),
          { eq: ['22 ÷ 4 = []'], a: [5.5] }, { eq: ['37 ÷ 2 = []'], a: [18.5] }]
      },
      p2: {
        items: [RM('A 125 m rope is cut into 0.4 m pieces (1250 ÷ 4 in tenths). How many full pieces?', 1250, 4, 'down', 'pieces'),
          RM('230 books go on shelves that hold 25. How many shelves are needed?', 230, 25, 'up', 'shelves'),
          story('4 friends share a $30 bill equally. How much each?', 'dollars', 7.5, '30 ÷ 4'),
          { eq: ['45 ÷ 8 = []'], a: [5.625] }]
      },
      p3: {
        items: [RM('A bus holds 48. How many buses for 300 students?', 300, 48, 'up', 'buses'),
          RM('{a} has $100 to buy $9 tickets. How many tickets?', 100, 9, 'down', 'tickets'),
          story('5 cousins share 18 L of maple sap equally. How much each?', 'L', 3.6, '18 ÷ 5'),
          story('A 7 m board is cut into 4 equal shelves. How long is each?', 'm', 1.75, '7 ÷ 4')]
      },
      think: {
        items: [{ q: '55 people, 10 per canoe. {b} says 5 canoes. Is {b} right?', lines: { n: 2, key: 'No. 55 ÷ 10 = 5 R 5, and the last 5 people need a canoe too: 6 canoes.' } },
          { q: 'Write a story for 17 ÷ 5 where the answer is 3.', lines: { n: 2, key: 'For example: 17 {many} into bags of 5. How many full bags? 3.' } },
          { q: 'Write a story for 17 ÷ 5 where the answer is 3.4.', lines: { n: 2, key: 'For example: 5 friends share 17 m of string equally: 3.4 m each.' } },
          RM('80 {many} go in {conts} of 6. How many {conts} to hold all of them?', 80, 6, 'up', '{conts}')]
      }
    },

    trade: {
      watch: 'stopping at a remainder. With decimals you can write zeros at the end (2.6 = 2.60) and keep sharing.',
      goal: 'I can divide a decimal by a whole number.',
      learn: {
        show: { cap: 'share, then trade leftovers for 10 of the next place', eq: ['7.35 ÷ 3', '= 2.45'] },
        together: [Q('7.35 ÷ 3'), Q('8.4 ÷ 4')],
        cue: 'Leftovers become 10 of the next place. The point goes above the point.',
        own: [Q('9.6 ÷ 2'), Q('5.25 ÷ 5'), Q('2.6 ÷ 4')]
      },
      p1: {
        show: { eq: ['4.8 ÷ 2 = 2.4'] },
        items: [Q('6.9 ÷ 3'), Q('8.05 ÷ 5'), Q('1.44 ÷ 6'), Q('3.5 ÷ 7'), Q('9.81 ÷ 9'), Q('4.2 ÷ 8')]
      },
      p2: {
        items: [Q('12.6 ÷ 4'), Q('0.735 ÷ 5'), Q('7.2 ÷ 9'), Q('5.1 ÷ 6'),
          story('{a} shares 4.5 kg of {many} equally into 6 {conts}. How much in each?', 'kg', 0.75, '4.5 ÷ 6'),
          story('A 9.6 km trail has 8 equal parts. How long is each part?', 'km', 1.2, '9.6 ÷ 8')]
      },
      p3: {
        items: [Q('3.216 ÷ 8'), Q('0.84 ÷ 7'),
          story('3 friends share a $14.25 lunch bill equally. How much each?', 'dollars', 4.75, '14.25 ÷ 3'),
          story('A 2.5 L jug fills 10 cups equally. How much in each cup?', 'L', 0.25, '2.5 ÷ 10'),
          { eq: ['[] ÷ 4 = 1.15'], a: [4.6] }]
      },
      think: {
        items: [{ q: '{b} divides 2.6 ÷ 4 and stops at 0.6 R 0.2. How can {b} keep going?', lines: { n: 3, key: 'Write 2.6 as 2.60. Share the 20 hundredths: 5 each. So 2.6 ÷ 4 = 0.65.' } },
          { q: 'How can you check 7.35 ÷ 3 = 2.45?', lines: { n: 2, key: 'Multiply back: 2.45 × 3 = 7.35.' } },
          Q('6.3 ÷ 9'),
          { q: 'Write a story for 5.4 ÷ 6.', lines: { n: 2, key: 'For example: 6 friends share 5.4 m of rope equally: 0.9 m each.' } }]
      }
    }
  } });
})();
