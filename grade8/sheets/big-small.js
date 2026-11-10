/* Grade 8 Big and Small Numbers: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/big-small.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names.
   Ontario 2020: B1.1 very large and very small numbers, scientific notation; B2.3 multiplying and dividing by powers of
   ten; E2.1 mega, giga, tera, micro, nano and pico. The answer checks are in tests/verify/sheets.js: every sum is worked
   out again (10⁵ and 10^[] are powers, "4 gigawatts" is 4 × 10⁹), scientific notation starts with a number from 1 to 10
   (sci), and a circled number is the biggest or smallest (big, small, cmp). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var Q = S.q;
  /* a power of ten as a number, or a number as a power of ten */
  function PW(e) { return Q('10' + e); }
  function AS(n, e) { return { eq: [n + ' = 10^[]'], a: [e] }; }
  /* a number in scientific notation, both ways */
  function SCI(n, c, e) { return n.length > 8 ? { q: 'Write ' + n + ' in scientific notation.', eq: ['[] × 10^[]'], a: [c, e], sci: true, is: n } : { eq: [n + ' = [] × 10^[]'], a: [c, e], sci: true }; }
  function STD(c, e) { return Q(c + ' × 10' + e); }
  /* which is greater: the sign between two numbers */
  function CMP(x, y) { return { pick: { opts: ['<', '=', '>'], ans: S.calc(x) < S.calc(y) ? 0 : S.calc(x) > S.calc(y) ? 2 : 1, cmp: [x, y] }, q: x + '  ?  ' + y }; }
  function BIG(opts, small) {
    var v = opts.map(S.calc), best = small ? Math.min.apply(null, v) : Math.max.apply(null, v);
    return { q: 'Circle the ' + (small ? 'smallest' : 'greatest') + '.', pick: { opts: opts, ans: v.indexOf(best), big: !small, small: !!small }, wide: true };
  }
  function ST(q, calc, unit) { return { q: q, eq: ['[]' + (unit ? ' ' + unit : '')], a: [S.calc(calc)], calc: calc }; }

  S.register('big-small', { code: 'BS', ideas: {

    pos: {
      watch: 'reading 10³ as 10 × 3 = 30. The exponent counts the tens multiplied, so 10³ = 10 × 10 × 10 = 1000.',
      goal: 'I can write a positive power of ten as a number, and a number as a power of ten.',
      learn: {
        show: { eq: ['10⁴ = 10 × 10 × 10 × 10', '10⁴ = 10 000'] },
        together: [PW('³'), AS(100, 2)],
        cue: '10ⁿ is 1 followed by n zeros.',
        own: [PW('⁵'), AS(10000, 4), PW('¹')]
      },
      p1: {
        show: { eq: ['10² = 10 × 10', '10² = 100'] },
        items: [PW('²'), PW('⁶'), AS(1000, 3), AS(10, 1), Q('10 × 10 × 10'), PW('⁷')]
      },
      p2: {
        items: [AS(1000000, 6), PW('⁸'), Q('10² × 10³'), Q('10⁵ ÷ 10²'), AS(100000, 5), Q('3 × 10⁴')]
      },
      p3: {
        items: [Q('10⁹'), AS(10000000, 7), Q('7 × 10³'), Q('10⁶ ÷ 10³'), Q('10⁴ + 10³'), Q('2 × 10⁵ + 4 × 10³', { wide: true })]
      },
      think: {
        items: [{ q: '{a} says 10⁴ = 40. What went wrong?', lines: { n: 3, key: '{a} multiplied 10 × 4. 10⁴ means four tens multiplied: 10 000.' } },
          { q: 'How many zeros are in 10¹²? How do you know?', lines: { n: 2, key: '12 zeros. 10ⁿ is 1 followed by n zeros.' } },
          BIG(['10⁵', '5 × 10²', '50 000', '10⁴'], false),
          { q: 'Why is 10² × 10³ the same as 10⁵?', lines: { n: 3, key: '2 tens multiplied, then 3 more tens: 5 tens multiplied in all.' } }]
      }
    },

    neg: {
      watch: 'thinking 10⁻² is −100. A negative exponent makes a small number above 0: 10⁻² = 0.01.',
      goal: 'I can write zero and negative powers of ten as decimals.',
      learn: {
        show: { eq: ['10⁰ = 1, 10⁻¹ = 0.1', '10⁻² = 0.01'] },
        together: [PW('⁻³'), PW('⁰')],
        cue: 'Each step down divides by 10. 10⁻ⁿ has its 1 in the n-th place after the point.',
        own: [PW('⁻¹'), AS(0.0001, -4), PW('⁻⁵')]
      },
      p1: {
        show: { eq: ['10⁻³ is 3 places after the point', '10⁻³ = 0.001'] },
        items: [PW('⁻²'), PW('⁻⁴'), AS(0.1, -1), AS(1, 0), AS(0.001, -3), PW('⁻⁶')]
      },
      p2: {
        items: [Q('1 ÷ 10³'), AS(0.00001, -5), Q('3 × 10⁻²'), Q('7 × 10⁻³'), Q('10⁻¹ + 10⁻²'), Q('4 × 10⁻¹')]
      },
      p3: {
        items: [AS(0.000001, -6), Q('5 × 10⁻⁴'), Q('10⁰ + 10⁻³'), Q('2 × 10⁻¹ + 6 × 10⁻³'), Q('10² × 10⁻²'), Q('8 × 10⁻⁵')]
      },
      think: {
        items: [{ q: '{b} says 10⁻³ = −1000. Explain the mistake.', lines: { n: 3, key: 'A negative exponent divides: 10⁻³ = 1 ÷ 1000 = 0.001, a small number above 0.' } },
          { q: 'Why does 10⁰ equal 1?', lines: { n: 3, key: '10¹ = 10. One step down divides by 10: 10 ÷ 10 = 1.' } },
          BIG(['10⁻²', '10⁻⁵', '0.03', '10⁻¹'], true),
          { q: 'Order from least to greatest: 10⁻¹, 10⁻⁴, 10⁰, 10⁻²', eq: ['[] < [] < [] < []'], a: [0.0001, 0.01, 0.1, 1], set: [0.1, 0.0001, 1, 0.01], wide: true }]
      }
    },

    times: {
      watch: 'adding a zero to a decimal (3.4 × 10 = 3.40). The digits move one place left: 34.',
      goal: 'I can multiply a decimal by 10, 100 and 1000 in my head.',
      learn: {
        show: { eq: ['5.08 × 100: 2 places left', '5.08 × 100 = 508'] },
        together: [Q('3.47 × 10'), Q('0.6 × 100')],
        cue: '× 10, 100, 1000: every digit moves 1, 2, 3 places left.',
        own: [Q('2.15 × 1000'), Q('0.08 × 10'), Q('4.9 × 100')]
      },
      p1: {
        show: { eq: ['0.75 × 1000: 3 places left', '0.75 × 1000 = 750'] },
        items: [Q('6.2 × 10'), Q('1.35 × 100'), Q('0.04 × 1000'), Q('12.7 × 10'), Q('0.509 × 100'), Q('3.002 × 1000')]
      },
      p2: {
        items: [Q('0.031 × 100'), Q('45.6 × 1000'), Q('0.007 × 10'), Q('9.99 × 100'), { eq: ['2.5 × [] = 2500'], a: [1000] }, { eq: ['0.36 × [] = 36'], a: [100] }]
      },
      p3: {
        items: [Q('0.0408 × 1000'), Q('8.5 × 10³'), { eq: ['[] × 100 = 70.4'], a: [0.704] }, Q('0.019 × 10⁴'),
          ST('A sheet of paper is 0.096 mm thick. How thick are 1000 sheets?', '0.096 × 1000', 'mm'),
          ST('One bead costs $0.35. What do 100 beads cost?', '0.35 × 100', 'dollars')]
      },
      think: {
        items: [{ q: '{a} says 4.6 × 10 = 4.60. What went wrong?', lines: { n: 3, key: 'Adding a 0 after the decimal does not change the value. The digits move left: 46.' } },
          { q: 'Explain how to find 0.25 × 1000 in your head.', lines: { n: 3, key: '1000 has 3 zeros, so each digit moves 3 places left: 250.' } },
          { q: 'Does × 100 always make a number bigger? Explain.', lines: { n: 3, key: 'Yes for numbers above 0: the digits move to bigger places. 0 × 100 is still 0.' } },
          { eq: ['3.6 × [] = 36 000'], a: [10000] }]
      }
    },

    divide: {
      watch: 'moving the digits the wrong way when dividing. ÷ 100 makes the number smaller: digits move right.',
      goal: 'I can divide a number by 10, 100 and 1000 in my head.',
      learn: {
        show: { eq: ['47 ÷ 100: 2 places right', '47 ÷ 100 = 0.47'] },
        together: [Q('356 ÷ 10'), Q('8.2 ÷ 100')],
        cue: '÷ 10, 100, 1000: every digit moves 1, 2, 3 places right.',
        own: [Q('925 ÷ 1000'), Q('4.6 ÷ 10'), Q('73 ÷ 100')]
      },
      p1: {
        show: { eq: ['5 ÷ 1000: 3 places right', '5 ÷ 1000 = 0.005'] },
        items: [Q('84 ÷ 10'), Q('612 ÷ 100'), Q('3.9 ÷ 10'), Q('2500 ÷ 1000'), Q('0.7 ÷ 100'), Q('48 ÷ 1000')]
      },
      p2: {
        items: [Q('0.45 ÷ 10'), Q('6 ÷ 100'), Q('19.2 ÷ 1000'), Q('305 ÷ 100'), { eq: ['720 ÷ [] = 0.72'], a: [1000] }, { eq: ['[] ÷ 10 = 0.38'], a: [3.8] }]
      },
      p3: {
        items: [Q('0.06 ÷ 100'), Q('4500 ÷ 10³'), { eq: ['[] ÷ 1000 = 0.015'], a: [15] }, Q('81 ÷ 10⁴'),
          ST('A 2.4 kg bag of rice is shared into 10 equal bags. How many kilograms in each?', '2.4 ÷ 10', 'kg'),
          ST('1000 nails have a mass of 1850 g. What is the mass of one nail?', '1850 ÷ 1000', 'g')]
      },
      think: {
        items: [{ q: '{b} says 56 ÷ 100 = 5600. What went wrong?', lines: { n: 3, key: '{b} moved the digits left. Dividing makes it smaller: 0.56.' } },
          { q: 'Why is ÷ 1000 the same as × 0.001?', lines: { n: 3, key: 'Both move every digit 3 places right. 0.001 is one thousandth.' } },
          BIG(['0.4 ÷ 10', '40 ÷ 100', '4 ÷ 1000', '400 ÷ 10000'], false),
          { eq: ['7.3 ÷ [] = 0.0073'], a: [1000] }]
      }
    },

    parts: {
      watch: 'writing a first part of 10 or more (32 × 10⁴). The first part must be at least 1 and less than 10: 3.2 × 10⁵.',
      goal: 'I can say if a number is in scientific notation, and name its two parts.',
      learn: {
        show: { cap: 'a number from 1 to 10, times a power of 10', eq: ['3.2 × 10⁵ = 320 000'] },
        together: [STD(4.5, '³'), SCI('7000', 7, 3)],
        cue: 'The first part is at least 1 and less than 10.',
        own: [STD(6.1, '⁴'), SCI('250', 2.5, 2)]
      },
      p1: {
        show: { eq: ['8.03 × 10² is scientific notation', '8.03 × 10² = 803'] },
        items: [STD(2, '³'), STD(9.4, '²'), STD(1.25, '⁴'), SCI('600', 6, 2), SCI('48', 4.8, 1), SCI('3100', 3.1, 3)]
      },
      p2: {
        items: [{ q: 'Is 23 × 10³ in scientific notation?', pick: { opts: ['yes', 'no'], ans: 1, sci: '23 × 10³' } }, STD(5.06, '⁵'), STD(7.2, '¹'), SCI('90 000', 9, 4), SCI('12 500', 1.25, 4), SCI('405', 4.05, 2)]
      },
      p3: {
        items: [STD(3.003, '³'), SCI('56 000', 5.6, 4), SCI('7 020 000', 7.02, 6), Q('4 × 10² + 3 × 10¹'), { eq: ['63 × 10³ = [] × 10^[]'], a: [6.3, 4], sci: true }, { eq: ['0.8 × 10⁴ = [] × 10^[]'], a: [8, 3], sci: true }]
      },
      think: {
        items: [{ q: 'Why is 15 × 10² not in scientific notation? Fix it.', lines: { n: 3, key: '15 is not less than 10. 15 × 10² = 1500 = 1.5 × 10³.' } },
          { q: 'Why do scientists use scientific notation?', lines: { n: 3, key: 'Very big and very small numbers are shorter to write and easier to compare.' } },
          { q: 'Circle the number in scientific notation.', pick: { opts: ['0.5 × 10³', '12 × 10⁴', '4.7 × 10⁶', '10 × 10²'], ans: 2, sci: true }, wide: true },
          SCI('810', 8.1, 2)]
      }
    },

    big: {
      watch: 'counting the digits instead of the places the point moves. In 4 600 000 the point moves 6 places: 4.6 × 10⁶.',
      goal: 'I can write very big numbers in scientific notation and back.',
      learn: {
        show: { cap: 'move the point 7 places left', eq: ['38 000 000 = 3.8 × 10⁷'] },
        together: [SCI('5 200 000', 5.2, 6), STD(9.1, '⁸')],
        cue: 'Move the point until one digit is in front. Count the moves: that is the power.',
        own: [SCI('640 000', 6.4, 5), STD(2.75, '⁶')]
      },
      p1: {
        show: { eq: ['8 000 000 = 8 × 10⁶', '1 and 6 zeros: 10⁶'] },
        items: [SCI('3 000 000', 3, 6), SCI('47 000', 4.7, 4), SCI('910 000 000', 9.1, 8), STD(6, '⁷'), STD(1.4, '⁹'), STD(8.25, '⁵')]
      },
      p2: {
        items: [SCI('13 000 000', 1.3, 7), SCI('2 080 000', 2.08, 6), STD(5.5, '¹⁰'), STD(3.06, '⁷'),
          { q: 'Canada has about 38 000 000 people.', eq: ['[] × 10^[]'], a: [3.8, 7], sci: true, is: '38 000 000' },
          { q: 'Earth is about 150 000 000 km from the Sun.', eq: ['[] × 10^[]'], a: [1.5, 8], sci: true, is: '150 000 000' }]
      },
      p3: {
        items: [SCI('700 400 000', 7.004, 8), STD(4.32, '¹¹'), SCI('62 000 000 000', 6.2, 10), Q('2 × 10⁶ + 3 × 10⁵', { wide: true }),
          { q: 'A server stores 3 400 000 000 000 bytes.', eq: ['[] × 10^[]'], a: [3.4, 12], sci: true, is: '3 400 000 000 000' },
          ST('A city of 2.7 × 10⁶ people grows by 10⁵. How many now?', '2.7 × 10⁶ + 10⁵', 'people')]
      },
      think: {
        items: [{ q: '{a} wrote 450 000 as 4.5 × 10⁶. Explain the mistake.', lines: { n: 3, key: 'The point moves 5 places, not 6: 4.5 × 10⁵. {a} counted the digits.' } },
          { q: 'How can you check 7.2 × 10⁵ = 720 000?', lines: { n: 3, key: 'Move the point 5 places right: 7.2 becomes 720 000. Or 7.2 × 100 000.' } },
          BIG(['9.9 × 10⁵', '1.1 × 10⁶', '99 000', '8 × 10⁵'], false),
          SCI('1 230 000', 1.23, 6)]
      }
    },

    small: {
      watch: 'giving a small number a positive power. 0.0036 is less than 1, so the power is negative: 3.6 × 10⁻³.',
      goal: 'I can write very small numbers in scientific notation and back.',
      learn: {
        show: { cap: 'move the point 4 places right', eq: ['0.000 52 = 5.2 × 10⁻⁴'] },
        together: [SCI('0.003', 3, -3), STD(7.1, '⁻²')],
        cue: 'A number less than 1 has a negative power. Count the places the point moves right.',
        own: [SCI('0.000 8', 8, -4), STD(4.6, '⁻³')]
      },
      p1: {
        show: { eq: ['0.06 = 6 × 10⁻²', 'the point moves 2 places'] },
        items: [SCI('0.4', 4, -1), SCI('0.007', 7, -3), SCI('0.025', 2.5, -2), STD(9, '⁻⁴'), STD(1.5, '⁻¹'), STD(3.08, '⁻²')]
      },
      p2: {
        items: [SCI('0.000 061', 6.1, -5), SCI('0.0909', 9.09, -2), STD(5.2, '⁻⁵'), STD(2.4, '⁻⁶'),
          { q: 'A hair is about 0.000 08 m wide.', eq: ['0.000 08 = [] × 10^[]'], a: [8, -5], sci: true },
          { q: 'A grain of sand has a mass of about 0.0044 g.', eq: ['0.0044 = [] × 10^[]'], a: [4.4, -3], sci: true }]
      },
      p3: {
        items: [SCI('0.000 000 3', 3, -7), STD(6.75, '⁻⁴'), SCI('0.000 102', 1.02, -4), Q('5 × 10⁻² + 3 × 10⁻³'),
          { q: 'A virus is 0.000 000 12 m long.', eq: ['[] × 10^[]'], a: [1.2, -7], sci: true, is: '0.000 000 12' },
          ST('A cell is 2 × 10⁻⁵ m wide. How wide are 1000 cells in a row?', '2 × 10⁻⁵ × 1000', 'm')]
      },
      think: {
        items: [{ q: '{b} wrote 0.0047 as 4.7 × 10³. Explain the mistake.', lines: { n: 3, key: '0.0047 is less than 1, so the power is negative: 4.7 × 10⁻³.' } },
          { q: 'Which is smaller, 3 × 10⁻⁴ or 9 × 10⁻³? How do you know?', lines: { n: 3, key: '3 × 10⁻⁴. A more negative power means more places after the point.' } },
          BIG(['2 × 10⁻³', '8 × 10⁻⁴', '0.005', '1 × 10⁻²'], true),
          SCI('0.000 55', 5.5, -4)]
      }
    },

    stairs: {
      watch: 'mixing up mega (10⁶) and micro (10⁻⁶). Big prefixes have positive powers, small ones negative.',
      goal: 'I can use the prefixes from pico to tera and their powers of ten.',
      learn: {
        show: { cap: 'tera 10¹², giga 10⁹, mega 10⁶, kilo 10³', eq: ['milli 10⁻³, micro 10⁻⁶', 'nano 10⁻⁹, pico 10⁻¹²'] },
        together: [{ eq: ['1 megametre = 10^[] metres'], a: [6] }, { eq: ['1 nanometre = 10^[] metres'], a: [-9] }],
        cue: 'Each step on the stairs is 1000 times: 10³.',
        own: [{ eq: ['1 gigametre = 10^[] metres'], a: [9] }, { eq: ['1 micrometre = 10^[] metres'], a: [-6] }]
      },
      p1: {
        show: { eq: ['1 kilogram = 10³ grams', '1 milligram = 10⁻³ grams'] },
        items: [{ eq: ['1 terabyte = 10^[] bytes'], a: [12] }, { eq: ['1 picosecond = 10^[] seconds'], a: [-12] }, { eq: ['1 megawatt = 10^[] watts'], a: [6] },
          { eq: ['1 microgram = 10^[] grams'], a: [-6] }, { eq: ['1 kilometre = [] metres'], a: [1000] }, { eq: ['1 millimetre = [] metres'], a: [0.001] }]
      },
      p2: {
        items: [{ eq: ['1 GB = [] MB'], a: [1000] }, { eq: ['1 mg = [] µg'], a: [1000] }, { eq: ['1 TB = [] GB'], a: [1000] },
          { eq: ['1 ns = [] ps'], a: [1000] }, { eq: ['1 MW = [] kW'], a: [1000] }, { eq: ['1 GW = [] MW'], a: [1000] }]
      },
      p3: {
        items: [{ eq: ['1 GW = [] kW'], a: [1000000] }, { eq: ['1 ms = [] ns'], a: [1000000] }, { eq: ['1 TB = [] MB'], a: [1000000] },
          { eq: ['1 µm = [] pm'], a: [1000000] }, { eq: ['1 megabyte = 10^[] bytes'], a: [6] }, { eq: ['1 nanogram = 10^[] grams'], a: [-9] }]
      },
      think: {
        items: [{ q: '{a} says a microgram is bigger than a milligram. Is that right? Explain.', lines: { n: 3, key: 'No. Micro is 10⁻⁶ and milli is 10⁻³. A microgram is 1000 times smaller.' } },
          { q: 'How many steps of 1000 from kilo to tera? What is that as a power of ten?', lines: { n: 2, key: '3 steps: kilo to mega to giga to tera. 1000 × 1000 × 1000 = 10⁹.' } },
          { q: 'Circle the biggest.', pick: { opts: ['1 gigabyte', '1 terabyte', '1 megabyte', '1 kilobyte'], ans: 1, big: true }, wide: true },
          { eq: ['1 kilometre = 10^[] millimetres'], a: [6] }]
      }
    },

    real: {
      watch: 'moving the point the wrong way when changing units. A smaller unit needs a bigger number: 3 GB = 3000 MB.',
      goal: 'I can change between prefixes in real measurements.',
      learn: {
        show: { cap: '1 gigabyte = 1000 megabytes', eq: ['4.5 GB = 4500 MB'] },
        together: [{ eq: ['2.4 MW = [] kW'], a: [2400] }, { eq: ['750 nm = [] µm'], a: [0.75] }],
        cue: 'To a smaller unit, multiply. To a bigger unit, divide.',
        own: [{ eq: ['3 TB = [] GB'], a: [3000] }, { eq: ['5200 µg = [] mg'], a: [5.2] }]
      },
      p1: {
        show: { eq: ['0.8 km = 800 m', '0.8 × 1000 = 800'] },
        items: [{ eq: ['6 GB = [] MB'], a: [6000] }, { eq: ['2500 kW = [] MW'], a: [2.5] }, { eq: ['0.4 mg = [] µg'], a: [400] },
          { eq: ['9000 ps = [] ns'], a: [9] }, { eq: ['1.2 GW = [] MW'], a: [1200] }, { eq: ['35 mm = [] µm'], a: [35000] }]
      },
      p2: {
        items: [{ eq: ['0.25 TB = [] GB'], a: [250] }, { eq: ['4800 MB = [] GB'], a: [4.8] }, { eq: ['7 µm = [] nm'], a: [7000] },
          ST('A phone holds 128 gigabytes. A song is 4 megabytes. How many songs fit?', '128 × 1000 ÷ 4', 'songs'),
          ST('A wind farm makes 300 megawatts. How many kilowatts is that?', '300 × 1000', 'kW'),
          ST('A red blood cell is 8 micrometres wide. How many nanometres?', '8 × 1000', 'nm')]
      },
      p3: {
        items: [{ eq: ['3.5 GW = [] kW'], a: [3500000] }, { eq: ['650 000 kB = [] GB'], a: [0.65] },
          ST('A cloud plan gives 2 terabytes. Photos use 1500 gigabytes. How many gigabytes are left?', '2 × 1000 − 1500', 'GB'),
          ST('A chip switches in 0.4 nanoseconds. How many picoseconds?', '0.4 × 1000', 'ps'),
          ST('A dam makes 1.8 gigawatts. A town needs 45 megawatts. How many towns can it power?', '1.8 × 1000 ÷ 45', 'towns'),
          { eq: ['0.002 mm = [] µm'], a: [2] }]
      },
      think: {
        items: [{ q: '{b} changed 5 gigabytes to 0.005 megabytes. What went wrong?', lines: { n: 3, key: 'A megabyte is smaller, so there are more of them: 5 × 1000 = 5000 MB.' } },
          { q: 'Name something measured in nanometres and something in gigabytes.', lines: { n: 2, key: 'For example: the size of a virus in nanometres; a phone\'s storage in gigabytes.' } },
          { q: 'Circle the longest time.', pick: { opts: ['3000 nanoseconds', '2 microseconds', '0.004 milliseconds'], ans: 2, big: true }, wide: true },
          ST('A file is 2.5 gigabytes. How many megabytes?', '2.5 × 1000', 'MB')]
      }
    },

    power: {
      watch: 'comparing the first parts first. In scientific notation compare the powers first: 1.2 × 10⁶ > 9.8 × 10⁵.',
      goal: 'I can compare and order numbers in scientific notation.',
      learn: {
        show: { cap: 'the bigger power wins', eq: ['1.2 × 10⁶ > 9.8 × 10⁵'] },
        together: [CMP('4 × 10⁷', '9 × 10⁶'), CMP('3.5 × 10⁴', '2.9 × 10⁴')],
        cue: 'Compare the powers first. Same power? Compare the first parts.',
        own: [CMP('6.1 × 10⁻³', '2 × 10⁻²'), CMP('7 × 10⁵', '700 000')]
      },
      p1: {
        show: { cap: 'same power: compare 5.3 and 5.1', eq: ['5.3 × 10⁸ > 5.1 × 10⁸'] },
        items: [CMP('2 × 10⁹', '8 × 10⁸'), CMP('4.4 × 10³', '4.04 × 10³'), CMP('1 × 10⁻²', '9 × 10⁻³'), CMP('6.7 × 10⁵', '6.7 × 10⁶'), CMP('3 × 10⁻⁵', '3 × 10⁻⁴'), CMP('2.5 × 10²', '250')]
      },
      p2: {
        items: [BIG(['3.1 × 10⁶', '9.9 × 10⁵', '1.2 × 10⁷', '8 × 10⁶'], false), BIG(['5 × 10⁻³', '2 × 10⁻²', '7 × 10⁻⁴', '1 × 10⁻³'], true),
          { q: 'Order from least to greatest.', eq: ['[] < [] < []'], a: ['4 × 10⁴', '2 × 10⁵', '1.5 × 10⁶'], set: ['2 × 10⁵', '1.5 × 10⁶', '4 × 10⁴'], wide: true },
          CMP('9.1 × 10⁻⁶', '1.1 × 10⁻⁵'), CMP('5 × 10³', '0.5 × 10⁴')]
      },
      p3: {
        items: [{ q: 'Order from least to greatest.', eq: ['[] < [] < [] < []'], a: ['8 × 10⁻³', '2 × 10⁻²', '6.5 × 10⁻²', '0.1'], set: ['6.5 × 10⁻²', '0.1', '8 × 10⁻³', '2 × 10⁻²'], wide: true },
          ST('A blue whale is 1.5 × 10⁵ kg. An elephant is 6 × 10³ kg. How many times as heavy is the whale?', '1.5 × 10⁵ ÷ (6 × 10³)', 'times'),
          ST('Jupiter is 1.4 × 10⁵ km wide. Earth is 1.3 × 10⁴ km wide. How much wider is Jupiter?', '1.4 × 10⁵ − 1.3 × 10⁴', 'km'),
          CMP('4.99 × 10⁸', '5 × 10⁸'), CMP('2 × 10⁻⁹', '1 × 10⁻¹⁰')]
      },
      think: {
        items: [{ q: '{a} says 9 × 10⁴ > 2 × 10⁵ because 9 > 2. Explain the mistake.', lines: { n: 3, key: 'The powers decide first: 2 × 10⁵ = 200 000 is more than 90 000.' } },
          { q: 'When do you need to compare the first parts?', lines: { n: 2, key: 'Only when the powers are the same.' } },
          BIG(['7.5 × 10¹¹', '1 × 10¹²', '9.9 × 10¹¹'], false),
          CMP('3.6 × 10⁻⁴', '0.000 36')]
      }
    },

    beat: {
      watch: 'forgetting that a smaller negative power is a smaller number: 10⁻⁸ < 10⁻⁷.',
      goal: 'I can find numbers bigger or smaller than a given number and explain how they are used.',
      learn: {
        show: { cap: 'beat 4.2 × 10⁶ by the least change', eq: ['4.3 × 10⁶ > 4.2 × 10⁶'] },
        together: [{ q: 'Is 6 × 10⁵ greater than 5.9 × 10⁵?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '6 × 10⁵ > 5.9 × 10⁵' }, CMP('2.1 × 10⁻⁴', '2.01 × 10⁻⁴')],
        cue: 'Same power: the first parts decide. Different power: the power decides.',
        own: [{ q: 'Is 9 × 10⁻⁷ greater than 1 × 10⁻⁶?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '9 × 10^-7 > 1 × 10^-6' }, CMP('8.8 × 10⁹', '1.2 × 10¹⁰')]
      },
      p1: {
        show: { eq: ['3 × 10⁻⁵ is bigger than 3 × 10⁻⁶', 'its power is less negative'] },
        items: [CMP('5 × 10⁻⁸', '5 × 10⁻⁷'), CMP('1.9 × 10⁴', '2 × 10³'), CMP('7.3 × 10²', '7.3 × 10⁻²'), CMP('4 × 10⁶', '4 000 000'), CMP('6.02 × 10³', '6.2 × 10³'), CMP('1 × 10⁰', '0.9')]
      },
      p2: {
        items: [BIG(['2 × 10⁻⁸', '9 × 10⁻⁹', '1 × 10⁻⁷', '5 × 10⁻⁸'], false), BIG(['3.3 × 10¹⁰', '4 × 10⁹', '2.9 × 10¹⁰', '3.1 × 10¹⁰'], true),
          ST('Toronto has about 2.8 × 10⁶ people. Ottawa has about 1 × 10⁶. How many more in Toronto?', '2.8 × 10⁶ − 1 × 10⁶', 'people'),
          ST('A dust speck is 5 × 10⁻⁵ m. A pollen grain is 2.5 × 10⁻⁵ m. How many times as wide is the dust?', '5 × 10⁻⁵ ÷ (2.5 × 10⁻⁵)', 'times'),
          CMP('9.99 × 10⁻³', '1 × 10⁻²')]
      },
      p3: {
        items: [{ q: 'Write a number in scientific notation between 4 × 10⁵ and 5 × 10⁵.', lines: { n: 1, key: 'For example 4.5 × 10⁵.' } },
          { q: 'Write a number in scientific notation between 10⁻³ and 10⁻².', lines: { n: 1, key: 'For example 5 × 10⁻³.' } },
          ST('Light travels 3 × 10⁵ km in a second. How far in 60 seconds?', '3 × 10⁵ × 60', 'km'),
          ST('A bacterium is 2 × 10⁻⁶ m long. How many fit along 1 cm (10⁻² m)?', '10⁻² ÷ (2 × 10⁻⁶)', 'bacteria'),
          CMP('6.5 × 10⁻¹²', '6.5 × 10⁻¹¹')]
      },
      think: {
        items: [{ q: 'Name a very big and a very small number used in real life. Write each in scientific notation.', lines: { n: 3, key: 'For example: Canada\'s population, about 3.8 × 10⁷; a hair\'s width, about 8 × 10⁻⁵ m.' } },
          { q: '{b} says 1 × 10⁻⁹ is a negative number. Is that right?', lines: { n: 2, key: 'No. It is 0.000 000 001: very small but above 0.' } },
          BIG(['1 × 10⁻⁹', '1 × 10⁻¹²', '1 × 10⁻⁶', '1 × 10⁻³'], true),
          CMP('1.5 × 10⁸', '15 × 10⁷')]
      }
    }
  } });
})();
