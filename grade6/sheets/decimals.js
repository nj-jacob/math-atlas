/* Grade 6 Decimals to Thousandths: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/decimals.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random, so a
   sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.3 compare and order fractions and decimals together; B1.4 read, represent, compare and order
   decimals to thousandths; B1.5 round terminating and repeating decimals; B1.6 fractions and decimals as the same
   amount. The answer checks are in tests/verify/sheets.js: place value words are worked out ("3 tenths"), decimals in
   words are read back (words), rounding is done again (round), a fraction's decimal stops only when its bottom has
   no factor but 2 and 5 (rep), and an order uses exactly the numbers given (set). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* a decimal in words, to write with digits */
  function NW(w, n) { return { q: w.charAt(0).toUpperCase() + w.slice(1), eq: ['[]'], a: [n], words: w }; }
  /* a decimal to write in words (the key gives the words) */
  function WN(n, w) { return { q: 'Write ' + n + ' in words.', lines: { n: 1, key: w }, wide: true }; }
  /* a hundred grid with k squares shaded: the decimal it shows */
  function HG(k) { return { pic: ['grid', { n: k, unit: '0.01', quiet: true, u: 7 }], eq: ['[]'], a: [k / 100] }; }
  /* the value of a number as the sheet writes it: 0.45, 3/4, 1 1/4, −0.5 */
  function V(x) {
    var s = String(x).replace('\u2212', '-'), m = s.match(/^(-?)(?:(\d+) )?(\d+)\/(\d+)$/);
    return m ? (m[1] ? -1 : 1) * ((+m[2] || 0) + m[3] / m[4]) : +s;
  }
  /* compare two numbers with <, > or = */
  function CM(x, y) { var p = V(x), q = V(y); return { eq: [x + '   ?   ' + y], pick: { opts: ['<', '>', '='], ans: p < q ? 0 : p > q ? 1 : 2, cmp: [x, y] }, pickLast: true }; }
  /* least to greatest */
  function OR(list, sorted) { return { q: 'Least to greatest: ' + list.join(', '), eq: [sorted.map(function () { return '[]'; }).join(' < ')], a: sorted, set: list, wide: true }; }
  /* round n to the nearest step (1, 0.1 or 0.01) */
  var NAME = { 1: 'whole number', 0.1: 'tenth', 0.01: 'hundredth' };
  function RD(n, step, ans, q) { return { q: q || 'To the nearest ' + NAME[step] + ':', eq: [n + ' is about []'], a: [ans], round: step }; }
  /* terminating or repeating */
  function TR(n, d) {
    var g = function (x, y) { return y ? g(y, x % y) : x; }, b = d / g(n, d);
    while (b % 2 === 0) b /= 2;
    while (b % 5 === 0) b /= 5;
    return { q: n + '/' + d + ' as a decimal', pick: { opts: ['terminating', 'repeating'], ans: b === 1 ? 0 : 1, rep: [n, d] } };
  }

  var dec = {

    tenths: {
      watch: 'thinking 0.1 is smaller than 0.01 because 1 is less than 10. Each place to the right is 10 times smaller.',
      goal: 'I can show tenths, hundredths and thousandths.',
      learn: {
        show: { pic: ['grid', { n: 37, unit: '0.01', quiet: true, u: 8 }], cap: '37 of 100 squares', eq: ['37 hundredths', '0.37'] },
        together: [HG(45), { eq: ['1 tenth = [] hundredths'], a: [10] }],
        cue: 'Each place to the right is one tenth of the place before it.',
        own: [HG(8), { eq: ['0.01 = [] thousandths'], a: [10] }, { eq: ['0.4 = [] hundredths'], a: [40] }]
      },
      p1: {
        show: { eq: ['0.1 = 10 hundredths', '0.1 = 100 thousandths'] },
        items: [HG(62), HG(90), { eq: ['0.7 = [] tenths'], a: [7] }, { eq: ['0.07 = [] hundredths'], a: [7] }, { eq: ['0.007 = [] thousandths'], a: [7] }, { eq: ['0.3 = [] thousandths'], a: [300] }]
      },
      p2: {
        items: [HG(5), { eq: ['0.25 = [] thousandths'], a: [250] }, { eq: ['[] tenths = 1'], a: [10] }, { eq: ['[] thousandths = 1'], a: [1000] },
          { pic: ['dline', { min: 0, max: 1, d: 10, show: 'dec', pt: 0.6 }], eq: ['0.6 = [] hundredths'], a: [60] }, { eq: ['0.125 = [] thousandths'], a: [125] }]
      },
      p3: {
        items: [{ eq: ['2.305 = 2 + [] tenths + [] thousandths'], a: [3, 5], wide: true }, { eq: ['0.48 = 4 tenths + [] hundredths'], a: [8], wide: true },
          { eq: ['1.06 = [] hundredths'], a: [106] }, { eq: ['0.1 ÷ 10 = []'], a: [0.01] }, { eq: ['10 × 0.005 = []'], a: [0.05] }]
      },
      think: {
        items: [{ q: '{b} says 0.1 < 0.01 because 1 < 10. Is {b} right?', lines: { n: 2, key: 'No. 0.1 is 10 hundredths, so 0.1 > 0.01.' } },
          { q: 'Shade 0.5 of the grid two ways. Why are they the same?', lines: { n: 2, key: '5 tenths (5 columns) and 50 hundredths (50 squares) cover the same area.' } },
          { eq: ['0.6 = [] thousandths'], a: [600] },
          { q: 'Where do you see thousandths in real life?', lines: { n: 2, key: 'For example: race times (9.581 s), or kilograms in grams (0.250 kg is 250 g).' } }]
      }
    },

    read: {
      watch: 'saying "point" for "and", or naming the wrong last place. 4.36 is "four and thirty-six hundredths".',
      goal: 'I can read and write decimals to thousandths.',
      learn: {
        show: { cap: 'four and thirty-six thousandths', eq: ['4.036'] },
        together: [NW('two and five tenths', 2.5), WN(0.48, 'forty-eight hundredths')],
        cue: 'Read the number after the point, then name the last place.',
        own: [NW('seven and twelve hundredths', 7.12), NW('nine thousandths', 0.009), WN(3.105, 'three and one hundred five thousandths')]
      },
      p1: {
        show: { cap: 'two hundred five thousandths', eq: ['0.205'] },
        items: [NW('six tenths', 0.6), NW('one and three hundredths', 1.03), NW('forty-five thousandths', 0.045), NW('twelve and seven tenths', 12.7),
          WN(5.08, 'five and eight hundredths'), { eq: ['5.08 = 5 + [] hundredths'], a: [8] }]
      },
      p2: {
        items: [NW('two hundred thirty-four thousandths', 0.234), NW('ten and ten thousandths', 10.01), WN(0.706, 'seven hundred six thousandths'),
          { eq: ['3.462 = 3 + [] tenths + [] hundredths + [] thousandths'], a: [4, 6, 2], wide: true },
          { q: 'Which is "eight and four hundredths"?', pick: { opts: ['8.4', '8.04', '8.004'], ans: 1, nw: 'eight and four hundredths' }, wide: true }]
      },
      p3: {
        items: [NW('one hundred and one thousandth', 100.001), WN(20.02, 'twenty and two hundredths'),
          { q: 'A runner finished in nine and five hundred eighty-one thousandths seconds.', eq: ['[] s'], a: [9.581], words: 'nine and five hundred eighty-one thousandths', wide: true },
          { q: 'Which is "sixty thousandths"?', pick: { opts: ['0.6', '0.06', '0.006'], ans: 1, nw: 'sixty thousandths' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} reads 4.36 as "four point thirty-six". How should it be read?', lines: { n: 2, key: 'Four and thirty-six hundredths. The point is read as "and".' } },
          { q: 'Why is 0.50 read as "fifty hundredths" but equal to five tenths?', lines: { n: 2, key: '50 hundredths and 5 tenths cover the same part of a whole.' } },
          NW('three and three thousandths', 3.003),
          { q: 'Write a decimal with a 7 in the thousandths place and say it.', lines: { n: 1, key: 'For example 0.257: two hundred fifty-seven thousandths.' } }]
      }
    },

    zeros: {
      watch: 'thinking 0.45 > 0.5 because 45 > 5. Add a zero so both have the same places: 0.45 < 0.50.',
      goal: 'I can compare decimals by lining them up.',
      learn: {
        show: { cap: 'add zeros so both have 3 places', eq: ['0.45 → 0.450', '0.5 → 0.500', '0.45 < 0.5'] },
        together: [CM('0.45', '0.5'), CM('2.07', '2.7')],
        cue: 'Give both the same number of places, then compare from the left.',
        own: [CM('0.3', '0.299'), CM('1.5', '1.50'), OR(['0.6', '0.06', '0.66'], ['0.06', '0.6', '0.66'])]
      },
      p1: {
        show: { eq: ['0.8 = 0.80 = 0.800'] },
        items: [CM('0.7', '0.65'), CM('0.123', '0.13'), CM('3.4', '3.40'), CM('0.09', '0.1'), CM('5.002', '5.02'), CM('12.5', '12.49')]
      },
      p2: {
        items: [OR(['0.4', '0.044', '0.44', '0.404'], ['0.044', '0.4', '0.404', '0.44']), OR(['1.25', '1.205', '1.2', '1.025'], ['1.025', '1.2', '1.205', '1.25']),
          { q: 'Write 0.5 with thousandths.', eq: ['[]'], a: ['0.500'], calc: '0.5' },
          { q: 'Which is the greatest?', pick: { opts: ['0.09', '0.9', '0.099', '0.909'], ans: 3, big: true }, wide: true }]
      },
      p3: {
        items: [OR(['2.3', '2.03', '2.33', '2.303', '2.033'], ['2.03', '2.033', '2.3', '2.303', '2.33']),
          { q: 'Race times (s): {a} 12.08, {b} 12.8, Ari 12.008. Who was fastest?', pick: { opts: ['{a}', '{b}', 'Ari'], ans: 2, less: ['12.08', '12.8', '12.008'] }, wide: true },
          { q: 'Which is the least?', pick: { opts: ['0.7', '0.07', '0.077', '0.707'], ans: 1, small: true }, wide: true }, CM('0.999', '1')]
      },
      think: {
        items: [{ q: '{b} says 0.45 > 0.5 because 45 > 5. What would you tell {b}?', lines: { n: 3, key: 'Write 0.5 as 0.50. Now 45 hundredths < 50 hundredths, so 0.45 < 0.5.' } },
          { q: 'Does adding a zero at the end change a decimal? Why?', lines: { n: 2, key: 'No. 0.5 = 0.50: zero hundredths adds nothing.' } },
          { q: 'Which is between 0.3 and 0.4?', pick: { opts: ['0.29', '0.35', '0.41'], ans: 1, between: [0.3, 0.4] } },
          OR(['0.8', '0.08', '0.88', '0.808'], ['0.08', '0.8', '0.808', '0.88'])]
      }
    },

    hill: {
      watch: 'looking at the wrong digit. To round to the nearest tenth, look at the hundredths digit: 5 or more rounds up.',
      goal: 'I can round decimals to the nearest whole, tenth or hundredth.',
      learn: {
        show: { cap: 'nearest tenth: look at the hundredths', eq: ['3.462: the 6 rounds up', '3.462 is about 3.5'] },
        together: [RD(3.462, 0.1, 3.5), RD(7.381, 0.01, 7.38)],
        cue: 'Look one place to the right of where you round. 5 or more rounds up.',
        own: [RD(4.75, 1, 5), RD(0.649, 0.1, 0.6), RD(2.996, 0.01, 3)]
      },
      p1: {
        show: { eq: ['8.27 to the nearest whole:', '8.27 is about 8'] },
        items: [RD(6.4, 1, 6), RD(12.51, 1, 13), RD(0.83, 0.1, 0.8), RD(5.071, 0.1, 5.1), RD(1.234, 0.01, 1.23), RD(9.876, 0.01, 9.88)]
      },
      p2: {
        items: [RD(19.95, 0.1, 20), RD(0.045, 0.01, 0.05), RD(3.499, 1, 3), RD(14.06, 0.1, 14.1),
          { q: 'A runner’s time is 10.468 s. Round to the nearest hundredth.', eq: ['10.468 is about []'], a: [10.47], round: 0.01, wide: true },
          { q: 'Which rounds to 2.4 (nearest tenth)?', pick: { opts: ['2.35', '2.46', '2.32'], ans: 0, round: { to: 0.1, val: 2.4 } }, wide: true }]
      },
      p3: {
        items: [RD(0.999, 0.01, 1), RD(45.555, 0.1, 45.6), RD(99.5, 1, 100),
          { q: 'A bag of apples has a mass of 1.738 kg. To the nearest tenth of a kilogram?', eq: ['1.738 is about []'], a: [1.7], round: 0.1, wide: true },
          { q: 'Which rounds to 6 (nearest whole)?', pick: { opts: ['5.49', '6.51', '5.5'], ans: 2, round: { to: 1, val: 6 } }, wide: true }]
      },
      think: {
        items: [{ q: '{b} rounds 4.749 to the nearest tenth and gets 4.8. What went wrong?', lines: { n: 3, key: 'Only the hundredths digit (4) matters. 4 < 5, so it rounds down to 4.7.' } },
          { q: 'Give a decimal that rounds to 3.2 to the nearest tenth.', lines: { n: 1, key: 'Anything from 3.15 up to (not including) 3.25, for example 3.18.' } },
          RD(7.995, 0.01, 8),
          { q: 'Why might a store round a price to the nearest hundredth?', lines: { n: 2, key: 'Money only goes to cents, and a cent is one hundredth of a dollar.' } }]
      }
    },

    repeat: {
      watch: 'calling 1/8 repeating because it has many digits. 1/8 = 0.125 stops, so it terminates.',
      goal: 'I can tell terminating from repeating decimals and round them.',
      learn: {
        show: { cap: '2 ÷ 3 never stops', eq: ['2/3 = 0.666…', '2/3 is about 0.67'] },
        together: [TR(1, 3), RD('0.333…', 0.01, 0.33)],
        cue: 'A terminating decimal stops. A repeating decimal goes on forever.',
        own: [TR(1, 4), TR(5, 6), RD('0.8333…', 0.1, 0.8)]
      },
      p1: {
        show: { eq: ['1/4 = 0.25: terminating', '1/3 = 0.333…: repeating'] },
        items: [TR(1, 2), TR(2, 9), TR(3, 5), TR(1, 6), RD('0.1666…', 0.01, 0.17), RD('0.777…', 0.1, 0.8)]
      },
      p2: {
        items: [TR(7, 8), TR(4, 11), TR(3, 20), TR(5, 12), RD('0.4545…', 0.01, 0.45), RD('1.666…', 1, 2)]
      },
      p3: {
        items: [TR(9, 15), TR(7, 25), TR(2, 7), RD('0.142857…', 0.01, 0.14), RD('3.0909…', 0.1, 3.1)]
      },
      think: {
        items: [{ q: 'How can you tell 1/3 will never stop?', lines: { n: 3, key: '1 ÷ 3 leaves 1 each time, so the 3 repeats forever.' } },
          { q: '{b} says 0.125 repeats because it has 3 digits. Is {b} right?', lines: { n: 2, key: 'No. It stops after 3 digits, so it terminates.' } },
          TR(6, 9),
          { q: 'Split $10 three ways. Why does each person not get exactly $3.33?', lines: { n: 3, key: '10 ÷ 3 = 3.333… repeats. Three people at $3.33 makes $9.99, so 1 cent is left.' } }]
      }
    },

    tens: {
      watch: 'putting the digits over the wrong bottom. The last place names the bottom: 0.045 is 45/1000.',
      goal: 'I can write tenths, hundredths and thousandths as fractions.',
      learn: {
        show: { cap: 'the last place is thousandths', eq: ['0.045 = 45/1000'] },
        together: [{ eq: ['0.7 = []/10'], a: [7] }, { eq: ['0.39 = []/100'], a: [39] }],
        cue: 'The bottom number names the last place.',
        own: [{ eq: ['0.009 = []/1000'], a: [9] }, { eq: ['3/10 = []'], a: [0.3] }, { eq: ['17/100 = []'], a: [0.17] }]
      },
      p1: {
        show: { eq: ['0.21 = 21/100', '21/100 = 0.21'] },
        items: [{ eq: ['0.1 = []/10'], a: [1] }, { eq: ['0.06 = []/100'], a: [6] }, { eq: ['0.125 = []/1000'], a: [125] },
          { eq: ['9/10 = []'], a: [0.9] }, { eq: ['3/100 = []'], a: [0.03] }, { eq: ['250/1000 = []'], a: [0.25] }]
      },
      p2: {
        items: [{ eq: ['0.5 = []/10 = []/100'], a: [5, 50], wide: true }, { eq: ['0.75 = []/100 = 3/[]'], a: [75, 4], wide: true },
          { eq: ['1.3 = []/10'], a: [13] }, { eq: ['0.008 = []/1000'], a: [8] }, { eq: ['407/1000 = []'], a: [0.407] }, { eq: ['2 7/10 = []'], a: [2.7] }]
      },
      p3: {
        items: [{ eq: ['0.2 = 1/[]'], a: [5] }, { eq: ['0.25 = 1/[]'], a: [4] }, { eq: ['0.125 = 1/[]'], a: [8] },
          { eq: ['3 45/100 = []'], a: [3.45] },
          { q: '{a} ran 0.6 of the trail. How many parts out of 10 is that?', eq: ['[]/10'], a: [6], calc: '0.6 × 10', wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote 0.45 = 45/10. What went wrong?', lines: { n: 2, key: 'The last digit is in the hundredths place, so 0.45 = 45/100.' } },
          { q: 'Why is 0.5 the same as 1/2?', lines: { n: 2, key: '0.5 is 5 tenths, and 5/10 = 1/2: the same amount.' } },
          { eq: ['0.06 = []/100 = 3/[]'], a: [6, 50], wide: true },
          { q: 'Draw a hundred grid that shows 0.3 and 3/10.', draw: { h: 70, key: 'Three of ten columns shaded (30 squares).' } }]
      }
    },

    divide: {
      watch: 'dividing the bottom by the top (8 ÷ 3). For 3/8, divide the top by the bottom: 3 ÷ 8 = 0.375.',
      goal: 'I can change any fraction into a decimal.',
      learn: {
        show: { cap: '3/8 means 3 ÷ 8', eq: ['3 ÷ 8 = 0.375', '3/8 = 0.375'] },
        together: [{ eq: ['1/4 = 1 ÷ 4 = []'], a: [0.25] }, { eq: ['3/5 = []/10 = []'], a: [6, 0.6] }],
        cue: 'A fraction and its decimal are the same amount. Divide the top by the bottom.',
        own: [{ eq: ['1/8 = []'], a: [0.125] }, { eq: ['7/20 = []/100 = []'], a: [35, 0.35] }, { eq: ['2/3 is about []'], a: [0.67], round: 0.01 }]
      },
      p1: {
        show: { eq: ['1/2 = 5/10 = 0.5'] },
        items: [{ eq: ['3/4 = []'], a: [0.75] }, { eq: ['2/5 = []'], a: [0.4] }, { eq: ['1/20 = []'], a: [0.05] },
          { eq: ['5/8 = []'], a: [0.625] }, { eq: ['9/25 = []'], a: [0.36] }, { eq: ['1/3 is about []'], a: [0.33], round: 0.01 }]
      },
      p2: {
        items: [{ eq: ['7/8 = []'], a: [0.875] }, { eq: ['11/20 = []'], a: [0.55] }, { eq: ['3/50 = []'], a: [0.06] }, { eq: ['1 1/4 = []'], a: [1.25] },
          { eq: ['5/6 is about []'], a: [0.83], round: 0.01 }, { eq: ['4/9 is about []'], a: [0.44], round: 0.01 }]
      },
      p3: {
        items: [{ eq: ['13/40 = []'], a: [0.325] }, { eq: ['2 3/8 = []'], a: [2.375] },
          { q: '{a} answered 17 of 20 questions right. What decimal of the test is that?', eq: ['[]'], a: [0.85], calc: '17 ÷ 20', wide: true },
          { q: '3 friends share 2 pizzas. About how much pizza each, to the nearest hundredth?', eq: ['2/3 is about []'], a: [0.67], round: 0.01, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 3/8 = 8 ÷ 3. What went wrong?', lines: { n: 2, key: 'The fraction bar means the top divided by the bottom: 3 ÷ 8 = 0.375.' } },
          { q: 'Why is it easy to change 7/25 to a decimal without dividing?', lines: { n: 3, key: 'Multiply top and bottom by 4: 7/25 = 28/100 = 0.28.' } },
          { eq: ['19/50 = []'], a: [0.38] },
          { q: 'Which is closer to 1/2: 0.45 or 0.6? Explain.', lines: { n: 2, key: '0.45: it is 0.05 from 0.5. 0.6 is 0.1 away.' } }]
      }
    },

    order: {
      watch: 'comparing a fraction and a decimal by their digits (3/4 and 0.8: "3 < 8"). Change both to decimals first.',
      goal: 'I can order fractions and decimals together.',
      learn: {
        show: { cap: 'change to decimals first', eq: ['3/4 = 0.75, 4/5 = 0.8', '0.7 < 3/4 < 4/5'] },
        together: [CM('3/4', '0.8'), CM('0.6', '1/2')],
        cue: 'Make them all decimals, then put them on one number line.',
        own: [CM('2/5', '0.38'), OR(['0.3', '1/4', '0.35'], ['1/4', '0.3', '0.35'])]
      },
      p1: {
        show: { eq: ['1/2 = 0.5', '0.45 < 1/2 < 0.55'] },
        items: [CM('1/4', '0.3'), CM('0.9', '9/10'), CM('3/5', '0.65'), CM('0.125', '1/10'), OR(['0.7', '1/2', '0.6'], ['1/2', '0.6', '0.7'])]
      },
      p2: {
        items: [OR(['3/8', '0.4', '0.35', '1/3'], ['1/3', '0.35', '3/8', '0.4']), OR(['1.2', '1 1/4', '1.05', '1 1/10'], ['1.05', '1 1/10', '1.2', '1 1/4']),
          { q: 'Which is the greatest?', pick: { opts: ['2/3', '0.6', '0.65', '5/8'], ans: 0, big: true }, wide: true },
          { q: 'Which is the least?', pick: { opts: ['0.2', '1/4', '3/20', '0.18'], ans: 2, small: true }, wide: true }]
      },
      p3: {
        items: [OR(['−0.5', '0.25', '−1', '3/4', '0'], ['−1', '−0.5', '0', '0.25', '3/4']),
          { q: '{a} ran 2 3/4 km, {b} ran 2.8 km and Ari ran 2.65 km. Who ran the farthest?', pick: { opts: ['{a}', '{b}', 'Ari'], ans: 1, more: ['2 3/4', '2.8', '2.65'] }, wide: true },
          CM('7/8', '0.875'), CM('1/3', '0.3')]
      },
      think: {
        items: [{ q: '{b} says 3/4 < 0.7 because 3 < 7. What would you tell {b}?', lines: { n: 3, key: '3/4 = 0.75. Compare 0.75 and 0.70: 3/4 > 0.7.' } },
          { q: 'Why is it easier to compare when all are decimals?', lines: { n: 2, key: 'Decimals share the same places, so you compare digit by digit from the left.' } },
          OR(['0.09', '1/10', '0.11', '1/8'], ['0.09', '1/10', '0.11', '1/8']),
          { q: 'Name a fraction between 0.5 and 0.6.', lines: { n: 1, key: 'For example 11/20 (0.55) or 4/7 (about 0.57).' } }]
      }
    }
  };
  S.register('decimals', { code: 'DE', ideas: dec });
})();
