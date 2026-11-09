/* Grade 1 Canadian Money: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/money.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random, so a
   sheet always prints the same. Theme words: {a} {b} names.
   Ontario 2020: F1.1 name Canadian coins (nickel, dime, quarter, loonie, toonie) and bills ($5, $10, $20, $50), and compare
   their values. The answer checks are in tests/verify/sheets.js: coin names and bill colours, values from the picture, the
   coin or bill worth more or less, and values in order. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var NAME = { 5: 'nickel', 10: 'dime', 25: 'quarter', 100: 'loonie', 200: 'toonie' }, COLOUR = { 500: 'blue', 1000: 'purple', 2000: 'green', 5000: 'red' };
  var nm = function (c) { return NAME[c] || '$' + c / 100 + ' bill'; };
  /* name the coin */
  function NC(c, opts) { return { q: 'Name this coin.', pic: ['coins', { list: [c] }], pick: { opts: opts, ans: opts.indexOf(NAME[c]), coin: c } }; }
  /* the colour of the bill */
  function CB(c, opts) { return { q: 'What colour is this bill?', pic: ['coins', { list: [c] }], pick: { opts: opts, ans: opts.indexOf(COLOUR[c]), coin: c } }; }
  /* how many cents is it worth? */
  function VC(c) { return { q: 'How many cents is a ' + NAME[c] + ' worth?', pic: ['coins', { list: [c] }], eq: ['[] ¢'], a: [c] }; }
  /* which is worth more (or less)? */
  function WM(a, b, op) { var o = [nm(a), nm(b)]; return { q: 'Which is worth ' + (op || 'more') + '?', pick: { opts: o, ans: (op === 'less') === (a < b) ? 0 : 1, worth: op || 'more' } }; }
  /* the one list from least to greatest */
  function OL(lists) {
    var o = lists.map(function (l) { return l.map(nm).join(', '); }), ans = lists.findIndex(function (l) { return l.every(function (c, i) { return !i || c > l[i - 1]; }); });
    return { q: 'Which list goes from least to greatest?', pick: { opts: o, ans: ans, worth: 'order' }, wide: o.join('').length > 64 };
  }
  /* write the values in order */
  function OR(list) { var s = list.slice().sort(function (x, y) { return x - y; }); return { q: 'Write the cents from least to greatest.', pic: ['coins', { list: list }], eq: [s.map(function () { return '[] ¢'; }).join(' < ')], a: s, set: list, wide: list.length > 3 }; }

  S.register('money', { code: 'MO', ideas: {

    names: {
      watch: 'mixing up the nickel and the quarter. Read the number on the coin: 5 or 25.',
      goal: 'I can name Canadian coins.',
      learn: {
        show: { pic: ['coins', { list: [5, 10, 25, 100, 200] }], cap: 'nickel, dime, quarter, loonie, toonie', eq: ['Read the number'] },
        together: [NC(5, ['nickel', 'dime']), NC(100, ['toonie', 'loonie'])],
        cue: 'Read the number. Then say the name.',
        own: [NC(25, ['quarter', 'nickel']), NC(200, ['loonie', 'toonie'])]
      },
      p1: { show: { pic: ['coins', { list: [10] }], eq: ['dime'] }, items: [NC(10, ['dime', 'nickel']), NC(5, ['quarter', 'nickel']), NC(25, ['dime', 'quarter']), NC(100, ['loonie', 'quarter']), NC(200, ['toonie', 'dime']), NC(10, ['loonie', 'dime'])] },
      p2: { items: [NC(5, ['nickel', 'dime', 'quarter']), NC(25, ['nickel', 'loonie', 'quarter']), NC(200, ['loonie', 'toonie', 'quarter']), NC(100, ['dime', 'toonie', 'loonie']), NC(10, ['dime', 'quarter', 'nickel']), NC(5, ['toonie', 'quarter', 'nickel'])] },
      p3: { items: [NC(25, ['nickel', 'dime', 'quarter', 'loonie']), NC(10, ['nickel', 'dime', 'quarter', 'loonie']), NC(200, ['nickel', 'dime', 'loonie', 'toonie']), NC(100, ['dime', 'quarter', 'loonie', 'toonie']), NC(5, ['nickel', 'dime', 'quarter', 'toonie']), NC(25, ['dime', 'quarter', 'loonie', 'toonie'])] },
      think: {
        items: [{ q: 'Which coin has a loon on it?', lines: { n: 1, key: 'The loonie ($1).' } },
          { q: 'Draw the coin with two rings, one inside the other.', draw: { h: 50, key: 'The toonie ($2): an inner circle inside an outer ring.' } },
          { q: '{a} says every coin is a "quarter". What can {a} do to tell them apart?', lines: { n: 2, key: 'Read the number on each coin and look at its size and picture.' } },
          NC(5, ['nickel', 'dime', 'quarter'])]
      }
    },

    cents: {
      watch: 'thinking $1 is less than 25¢ because 1 is less than 25. A dollar is 100 cents.',
      goal: 'I can tell what each coin is worth.',
      learn: {
        show: { pic: ['coins', { list: [25, 100] }], cap: '¢ means cents. $ means dollars.', eq: ['$1 = 100¢'] },
        together: [VC(10), VC(100)],
        cue: 'Read the number. Cents have ¢. Dollars have $.',
        own: [VC(25), VC(200)]
      },
      p1: { show: { eq: ['nickel: 5¢'] }, items: [VC(5), VC(10), VC(25), VC(100), WM(25, 100), WM(10, 5)] },
      p2: { items: [VC(200), VC(25), WM(200, 100), WM(5, 25), WM(100, 25, 'less'), WM(10, 200, 'less')] },
      p3: { items: [VC(100), VC(5), WM(25, 200), WM(100, 10, 'less'), WM(10, 25), WM(200, 5, 'less')] },
      think: {
        items: [{ q: 'Is $1 worth more than 25¢? Why?', lines: { n: 2, key: 'Yes. $1 is 100 cents, and 100 is more than 25.' } },
          { q: 'Write the toonie\'s value two ways.', lines: { n: 1, key: '$2 and 200¢.' } },
          VC(200),
          WM(100, 25, 'less')]
      }
    },

    colours: {
      watch: 'guessing the bill by its colour alone. Read the number first.',
      goal: 'I can name Canadian bills and their colours.',
      learn: {
        show: { pic: ['coins', { list: [500, 1000, 2000, 5000] }], cap: 'blue, purple, green, red', eq: ['Read the number'] },
        together: [CB(500, ['blue', 'red']), CB(2000, ['purple', 'green'])],
        cue: 'Read the number on the bill. Then say its colour.',
        own: [CB(1000, ['purple', 'blue']), CB(5000, ['green', 'red'])]
      },
      p1: { show: { eq: ['$10 bill: purple'] }, items: [CB(500, ['blue', 'green']), CB(1000, ['red', 'purple']), CB(2000, ['green', 'blue']), CB(5000, ['red', 'purple']), WM(500, 2000), WM(5000, 1000)] },
      p2: { items: [CB(1000, ['blue', 'purple', 'green']), CB(5000, ['green', 'purple', 'red']), CB(500, ['purple', 'blue', 'red']), WM(2000, 1000), WM(500, 5000, 'less'), WM(1000, 200)] },
      p3: { items: [CB(2000, ['blue', 'purple', 'green', 'red']), CB(500, ['blue', 'purple', 'green', 'red']), WM(200, 500), WM(5000, 2000, 'less'), WM(1000, 100, 'less'), OL([[500, 1000, 2000], [1000, 500, 2000]])] },
      think: {
        items: [{ q: 'Which bill would you use to buy a book that costs $8?', lines: { n: 1, key: 'The $10 bill (purple). $5 is not enough.' } },
          { q: 'Why do bills have different colours?', lines: { n: 2, key: 'To help tell them apart quickly. The number tells the value.' } },
          CB(5000, ['blue', 'purple', 'green', 'red']),
          WM(2000, 5000)]
      }
    },

    dime: {
      watch: 'choosing the bigger coin as worth more. Read the number, not the size.',
      goal: 'I can compare coins by value, not size.',
      learn: {
        show: { pic: ['coins', { list: [5, 10] }], cap: 'The nickel is bigger', eq: ['The dime is worth more'] },
        together: [WM(5, 10), WM(25, 100)],
        cue: 'Do not look at size. Read the numbers and compare.',
        own: [WM(10, 5, 'less'), WM(200, 100, 'less')]
      },
      p1: { show: { eq: ['10¢ is more than 5¢'] }, items: [WM(10, 5), WM(5, 25), WM(10, 25), WM(100, 25), WM(200, 100), WM(5, 10, 'less')] },
      p2: { items: [WM(25, 10, 'less'), WM(100, 5, 'less'), OR([10, 5]), OR([25, 5]), OR([100, 10]), OR([5, 25])] },
      p3: { items: [OR([10, 5, 25]), OR([100, 25, 10]), WM(5, 200), WM(10, 100, 'less'), WM(25, 5, 'less'), WM(100, 10)] },
      think: {
        items: [{ q: '{b} says a nickel is worth more than a dime because it is bigger. Is {b} right?', lines: { n: 2, key: 'No. A nickel is 5¢ and a dime is 10¢. Size does not tell the value.' } },
          { q: 'Would you trade a dime for a nickel? Why?', lines: { n: 2, key: 'No. A dime is worth 10¢ and a nickel only 5¢.' } },
          OR([25, 10, 5]),
          WM(5, 10)]
      }
    },

    order: {
      watch: 'putting a $5 bill before a quarter because 5 is less than 25. Dollars are worth more than cents.',
      goal: 'I can put coins and bills in order.',
      learn: {
        show: { cap: 'least to greatest', eq: ['10¢ < 25¢ < 100¢'] },
        together: [OR([25, 10, 5]), OL([[10, 25, 100], [25, 10, 100]])],
        cue: 'Find the least first. Then the next, and the next.',
        own: [OR([100, 5, 25]), OL([[500, 100, 1000], [100, 500, 1000]])]
      },
      p1: { show: { eq: ['nickel, dime, quarter'] }, items: [OR([10, 25, 5]), OR([200, 25, 100]), OR([5, 100, 10]), OR([25, 200, 10]), OL([[5, 10, 25], [10, 5, 25]]), OL([[100, 200, 25], [25, 100, 200]])] },
      p2: { items: [OR([200, 5, 100]), OL([[25, 500, 100], [25, 100, 500]]), OR([100, 10, 25, 5]), OL([[1000, 2000, 5000], [2000, 1000, 5000]]), OL([[10, 200, 100], [10, 100, 200]])] },
      p3: { items: [OR([200, 25, 5, 100]), OR([10, 200, 25, 100]), OL([[5, 25, 10, 100], [5, 10, 25, 100]]), OL([[200, 1000, 500], [200, 500, 1000]])] },
      think: {
        items: [{ q: 'Put these in order: $20 bill, dime, loonie.', lines: { n: 1, key: 'dime, loonie, $20 bill.' } },
          { q: 'Which is worth the most: a toonie, a $5 bill or a quarter? How do you know?', lines: { n: 2, key: 'The $5 bill. Bills are worth more than these coins.' } },
          OR([100, 10, 200]),
          OL([[5, 25, 200, 500], [5, 200, 25, 500]])]
      }
    }
  } });
})();
