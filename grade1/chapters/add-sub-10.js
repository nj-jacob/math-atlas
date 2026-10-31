(function () {
  var A = Atlas, R = A.R;
  var M = '&minus;';
  var PEOPLE = ['Mia', 'Leo', 'Ava', 'Noah', 'Zoe', 'Sam', 'Priya', 'Omar', 'Lily', 'Ben', 'Aiyana', 'Mei'];
  var THINGS = ['apple', 'ball', 'fish', 'flower', 'star', 'car'];
  function seq(a, n) { var o = []; for (var i = 0; i < n; i++) o.push(a + i); return o; }
  function hops(a, k, back) { var h = []; for (var i = 0; i < k; i++) h.push(back ? [a - i, a - i - 1] : [a + i, a + i + 1]); return h; }
  function eqn(s) { return '<span class="math">' + s + '</span>'; }

  function qAdd(lv) {
    var a, b;
    if (lv === 1) { a = R.int(1, 4); b = R.int(1, 5 - a); }
    else { a = R.int(1, 9); b = R.int(1, 10 - a); }
    var c = a + b;
    if (lv === 3 && R.int(0, 1)) {
      return { q: eqn(a + ' + <b class="blank">?</b> = ' + c) + ' What is the missing number?', type: 'num', answer: b,
        fig: A.draw.frames(a, { ghost: c, c: 24, label: a + ' red counters and ' + b + ' empty rings, ' + c + ' in all' }),
        hint: 'Start at ' + a + ' and count on until you get to ' + c + '. How many did you count on?',
        steps: ['You have ' + a + '. You need ' + c + '.', 'Count on from ' + a + ': ' + seq(a + 1, b).join(', ') + '.', 'You counted on ' + b + '. So ' + a + ' + ' + b + ' = ' + c + '.'],
        explain: a + ' + ' + b + ' = ' + c + '.' };
    }
    var big = Math.max(a, b), small = Math.min(a, b);
    return { q: 'What is ' + eqn(a + ' + ' + b) + '?', type: 'num', answer: c,
      fig: lv < 3 ? A.draw.frames(a, { b: b, c: 26 }) : '',
      hint: 'Start with the bigger number, ' + big + '. Count on ' + small + ' more.',
      steps: ['Start at ' + big + '. Say it in your head.', 'Count on ' + small + ': ' + seq(big + 1, small).join(', ') + '.' + '<div class="fig">' + A.draw.nl(0, 10, { mark: big, hops: hops(big, small) }) + '</div>', 'You land on ' + c + '. So ' + a + ' + ' + b + ' = ' + c + '.'],
      explain: a + ' + ' + b + ' = ' + c + '.' };
  }
  function qTen(lv) {
    var a = lv === 1 ? R.int(5, 9) : R.int(1, 9), b = 10 - a;
    var fig = lv < 3 ? A.draw.frames(a, { ghost: 10, c: 26, label: a + ' counters in a ten frame, ' + b + ' empty' }) : '';
    if (lv === 3 && R.int(0, 1)) {
      var o = R.mc(a + ' + ' + b, [a + ' + ' + (b + 1), (a + 1) + ' + ' + (b + 1), a + ' + ' + Math.max(0, b - 1)].filter(function (x) { return x !== a + ' + ' + b; }));
      return { q: 'Which pair makes <b>10</b>?', type: 'mc', options: o.options, answer: o.answer,
        hint: 'Picture a ten frame. Fill in the first number. How many empty boxes are left?',
        steps: ['Look at the first number in each pair: ' + a + '.', 'A ten frame with ' + a + ' has ' + b + ' empty boxes.', 'So ' + a + ' + ' + b + ' = 10.'], explain: a + ' + ' + b + ' = 10.' };
    }
    return { q: eqn(a + ' + <b class="blank">?</b> = 10') + ' How many more make 10?', type: 'num', answer: b, fig: fig,
      hint: 'Count the empty boxes in the ten frame.', steps: ['The ten frame has ' + a + ' counters.', 'Count the empty boxes: ' + seq(1, b).join(', ') + '.', 'There are ' + b + ' empty. ' + a + ' + ' + b + ' = 10.'], explain: a + ' and ' + b + ' make 10.' };
  }
  function qFacts(lv) {
    var kind = lv === 1 ? R.pick(['dbl', 'zero']) : lv === 2 ? R.pick(['dbl', 'turn']) : R.pick(['turn', 'near']);
    var a, b, c;
    if (kind === 'dbl') {
      a = R.int(1, 5); c = a + a;
      return { q: 'Double ' + a + '. What is ' + eqn(a + ' + ' + a) + '?', type: 'num', answer: c, fig: A.draw.frames(a, { b: a, c: 24 }),
        hint: 'Doubles are two of the same. Count all the counters.', steps: ['There are ' + a + ' red and ' + a + ' yellow.', 'Start at ' + a + ' and count on ' + a + ': ' + seq(a + 1, a).join(', ') + '.', a + ' + ' + a + ' = ' + c + '.'], explain: 'Double ' + a + ' is ' + c + '.' };
    }
    if (kind === 'zero') {
      a = R.int(1, 10); var first = R.int(0, 1);
      return { q: 'What is ' + eqn(first ? a + ' + 0' : '0 + ' + a) + '?', type: 'num', answer: a,
        hint: 'Adding 0 means adding nothing.', steps: ['You have ' + a + '.', 'Zero more means no more.', 'You still have ' + a + '.'], explain: 'Adding 0 does not change a number. ' + (first ? a + ' + 0' : '0 + ' + a) + ' = ' + a + '.' };
    }
    if (kind === 'turn') {
      do { a = R.int(1, 8); b = R.int(1, 10 - a); } while (a === b);
      c = a + b;
      return { q: eqn(a + ' + ' + b + ' = ' + c) + '. So what is ' + eqn(b + ' + ' + a) + '?', type: 'num', answer: c, fig: A.draw.frames(b, { b: a, c: 22 }),
        hint: 'The same numbers in a different order make the same total.', steps: ['Look: ' + b + ' + ' + a + ' uses the same two numbers as ' + a + ' + ' + b + '.', 'Turning them around does not change the total.', 'So ' + b + ' + ' + a + ' = ' + c + '.'], explain: 'Turn-around facts have the same answer: ' + b + ' + ' + a + ' = ' + c + '.' };
    }
    a = R.int(1, 4); c = a + a + 1;
    return { q: 'You know ' + eqn(a + ' + ' + a + ' = ' + (a + a)) + '. What is ' + eqn(a + ' + ' + (a + 1)) + '?', type: 'num', answer: c, fig: A.draw.frames(a, { b: a + 1, c: 22 }),
      hint: a + ' + ' + (a + 1) + ' is one more than ' + a + ' + ' + a + '.', steps: ['Start with the double: ' + a + ' + ' + a + ' = ' + (a + a) + '.', a + ' + ' + (a + 1) + ' has 1 more.', (a + a) + ' and 1 more is ' + c + '.'], explain: 'Double ' + a + ' is ' + (a + a) + ', and one more is ' + c + '.' };
  }
  function qSub(lv) {
    var n, k;
    if (lv === 1) { n = R.int(2, 5); k = R.int(1, n - 1); }
    else { n = R.int(4, 10); k = R.int(1, n - 1); }
    var d = n - k;
    if (lv === 3 && R.int(0, 1)) {
      return { q: eqn(n + ' ' + M + ' <b class="blank">?</b> = ' + d) + ' What is the missing number?', type: 'num', answer: k,
        hint: 'You start with ' + n + ' and end with ' + d + '. How many were taken away? Count up from ' + d + ' to ' + n + '.',
        steps: ['You start with ' + n + '.', 'Count up from ' + d + ' to ' + n + ': ' + seq(d + 1, k).join(', ') + '.', 'You counted ' + k + '. So ' + n + ' ' + M + ' ' + k + ' = ' + d + '.'], explain: n + ' ' + M + ' ' + k + ' = ' + d + '.' };
    }
    return { q: 'What is ' + eqn(n + ' ' + M + ' ' + k) + '?', type: 'num', answer: d,
      fig: lv < 3 ? A.draw.frames(n, { x: k, c: 26, label: n + ' counters with ' + k + ' crossed out' }) : '',
      hint: 'Start with ' + n + '. Take away ' + k + '. Count what is left, or count back ' + k + ' from ' + n + '.',
      steps: ['Start at ' + n + '.', 'Count back ' + k + ': ' + seq(d, k).reverse().join(', ') + '.<div class="fig">' + A.draw.nl(0, 10, { mark: n, hops: hops(n, k, true) }) + '</div>', 'You land on ' + d + '. So ' + n + ' ' + M + ' ' + k + ' = ' + d + '.'],
      explain: n + ' take away ' + k + ' leaves ' + d + '.' };
  }
  function qFam(lv) {
    var a = R.int(1, 8), b = R.int(1, 10 - a), c = a + b;
    if (lv === 1) return { q: eqn(a + ' + ' + b + ' = ' + c) + '. So what is ' + eqn(c + ' ' + M + ' ' + b) + '?', type: 'num', answer: a, fig: A.draw.frames(a, { b: b, c: 22 }),
      hint: 'Take the yellow ones away. What is left?', steps: ['The whole is ' + c + '. The parts are ' + a + ' and ' + b + '.', 'Take away the part ' + b + '.', 'The other part is left: ' + a + '.'], explain: 'If ' + a + ' + ' + b + ' = ' + c + ', then ' + c + ' ' + M + ' ' + b + ' = ' + a + '.' };
    if (lv === 2) {
      var ok = R.int(0, 1), shown = ok ? b : (b > 1 && R.int(0, 1) ? b - 1 : b + 1), back = shown + a;
      return { q: 'Use adding to check. Is ' + eqn(c + ' ' + M + ' ' + a + ' = ' + shown) + ' right?', type: 'mc', options: ['Yes, it is right', 'No, it is wrong'], answer: ok ? 0 : 1, wide: true,
        hint: 'Add the answer back: ' + shown + ' + ' + a + '. Do you get ' + c + '?',
        steps: ['To check ' + c + ' ' + M + ' ' + a + ' = ' + shown + ', add ' + shown + ' + ' + a + '.', shown + ' + ' + a + ' = ' + back + '.', back === c ? 'You got back to ' + c + ', so it is right.' : back + ' is not ' + c + ', so it is wrong. The right answer is ' + b + '.'],
        explain: shown + ' + ' + a + ' = ' + back + (ok ? ', so it is right.' : ', not ' + c + '. So it is wrong: ' + c + ' ' + M + ' ' + a + ' = ' + b + '.') };
    }
    var good = c + ' &minus; ' + a + ' = ' + b;
    var wrong = [c + ' + ' + a + ' = ' + (c + a), a + ' &minus; ' + b + ' = ' + c, (c + 1) + ' &minus; ' + b + ' = ' + a, b + ' + ' + c + ' = ' + a];
    var o = R.mc(good, R.shuffle(wrong));
    return { q: 'Which fact is in the same family as ' + eqn(a + ' + ' + b + ' = ' + c) + '?', type: 'mc', options: o.options, answer: o.answer, wide: true,
      hint: 'A fact family uses the same three numbers: ' + a + ', ' + b + ' and ' + c + '. The biggest one is the whole.',
      steps: ['The numbers in the family are ' + a + ', ' + b + ' and ' + c + '.', 'In a subtraction fact, you start with the whole, ' + c + '.', c + ' &minus; ' + a + ' = ' + b + ' uses the same numbers and starts with the whole.'],
      explain: a + ' + ' + b + ' = ' + c + ', ' + b + ' + ' + a + ' = ' + c + ', ' + c + ' &minus; ' + a + ' = ' + b + ' and ' + c + ' &minus; ' + b + ' = ' + a + ' are one family.' };
  }
  function qStory(lv) {
    var who = R.pick(PEOPLE), kind = R.pick(THINGS), add = lv === 1 ? 1 : R.int(0, 1), a, b, c;
    var name = function (n) { return A.nm(kind, n); };
    if (add) {
      a = R.int(1, lv === 1 ? 4 : 7); b = R.int(1, (lv === 1 ? 5 : 10) - a); c = a + b;
      if (lv === 3) return { q: who + ' has some ' + A.NAMES[kind][1] + '. A friend gives ' + who + ' ' + b + ' more. Now ' + who + ' has ' + c + '. How many did ' + who + ' have at the start?', type: 'num', answer: a,
        hint: 'You know the total, ' + c + ', and one part, ' + b + '. Find the other part.', steps: ['The whole is ' + c + '. One part is ' + b + '.', 'Take the ' + b + ' away from ' + c + ', or count up from ' + b + ' to ' + c + '.', c + ' ' + M + ' ' + b + ' = ' + a + '. ' + who + ' had ' + a + ' at the start.'], explain: a + ' + ' + b + ' = ' + c + ', so ' + who + ' started with ' + a + '.' };
      return { q: who + ' has ' + name(a) + '. ' + who + ' gets ' + b + ' more. How many ' + A.NAMES[kind][1] + ' now?', type: 'num', answer: c,
        fig: A.draw.row(kind, a, { s: 30 }), hint: 'Getting more means adding. Start at ' + a + ' and count on ' + b + '.',
        steps: ['Getting more means we add.', 'Start at ' + a + ', count on ' + b + ': ' + seq(a + 1, b).join(', ') + '.', a + ' + ' + b + ' = ' + c + '. ' + who + ' has ' + c + ' now.'], explain: a + ' + ' + b + ' = ' + c + '.' };
    }
    a = R.int(3, 10); b = R.int(1, a - 1); c = a - b;
    var verb = kind === 'apple' ? R.pick(['eats', 'gives away']) : R.pick(['gives away', 'loses']);
    return { q: who + ' has ' + name(a) + '. ' + who + ' ' + verb + ' ' + b + '. How many ' + A.NAMES[kind][1] + ' are left?', type: 'num', answer: c,
      fig: lv < 3 ? A.draw.row(kind, a, { s: 30 }) : '', hint: '"Left" means take away. Start at ' + a + ' and count back ' + b + '.',
      steps: ['Taking some away means we subtract.', 'Start at ' + a + ', count back ' + b + ': ' + seq(c, b).reverse().join(', ') + '.', a + ' ' + M + ' ' + b + ' = ' + c + '. There are ' + c + ' left.'], explain: a + ' ' + M + ' ' + b + ' = ' + c + '.' };
  }

  var CH = 'add-sub-10';
  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters[CH].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  function fr(a, b, lab) { return A.draw.frames(a, { b: b || 0, c: 30, label: lab || (a + ' red and ' + (b || 0) + ' yellow counters') }); }

  var LESSONS = [
    { id: 'add', title: 'Adding', sub: 'Put groups together.', concepts: [
      { id: 'join', title: 'Adding puts groups together', exp: ['B2.2'], skill: 'a-add',
        body: '<p>When we <b>add</b>, we put two groups together and find how many in all.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Here are 3 red counters.', act: function (t) { return t.show(fr(3, 0)); }, ms: 1200 },
          { say: 'Add 4 yellow counters.', act: function (t) { return t.show(fr(3, 4)); }, ms: 1200 },
          { say: 'Count them all: 1, 2, 3, then 4, 5, 6, 7.', act: function (t) { return t.show(fr(3, 4) + '<p class="big">' + eqn('3 + 4 = 7') + '</p>'); }, ms: 1200 },
          { say: '3 and 4 make <b>7</b>. We write 3 + 4 = 7.', ms: 1800 }
        ] },
        try: { tool: 'tenframe', opts: { two: true }, tasks: [
          { do: 'Show ' + eqn('2 + 5') + ': 2 red and 5 yellow. Tap a box once for red, twice for yellow.', goal: function (s) { return s.a === 2 && s.b === 5; }, yes: '2 + 5 = 7.' },
          { do: 'Show ' + eqn('6 + 3') + '.', goal: function (s) { return s.a === 6 && s.b === 3; }, yes: '6 + 3 = 9.' }
        ] },
        key: '<p><b>+</b> means put together. <b>=</b> means "is the same as".</p>',
        check: [P('a-add', 1), P('a-add', 1)] },
      { id: 'count-on', title: 'Count on from the bigger number', exp: ['B2.2'], skill: 'a-add',
        body: '<p>Start at the <b>bigger</b> number. Say it in your head. Then count on the smaller number.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 10, every: 1, start: 6 }, steps: [
          { say: 'What is 2 + 6? Start at the bigger number, 6.', ms: 1400 },
          { say: 'Count on 2: 7 ...', act: function (t) { return t.hop(7, '1'); }, ms: 500 },
          { say: 'Count on 2: 7, 8.', act: function (t) { return t.hop(8, '2'); }, ms: 800 },
          { say: 'We land on 8. So <b>2 + 6 = 8</b>.', ms: 1800 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 10, every: 1, start: 0, step: 1 }, tasks: [
          { do: 'Find ' + eqn('3 + 5') + '. Move the dot to 5, then jump on 3.', goal: function (s) { return s.at === 8 && s.hops >= 3; }, yes: '5 ... 6, 7, 8. So 3 + 5 = 8.' }
        ] },
        mistake: '<p>Counting the start number again (5 + 3: "5, 6, 7" = 7). Say the start number in your head, then count the jumps.</p>',
        key: '<p>Start <b>big</b>, count on <b>small</b>.</p>',
        check: [P('a-add', 2), P('a-add', 2)] },
      { id: 'missing', title: 'Find the missing number', exp: ['B2.2'], skill: 'a-add', hard: true,
        body: '<p>' + eqn('4 + <b class="blank">?</b> = 7') + ' asks: "4 and how many more make 7?" Count on from 4 to 7.</p>',
        watch: { tool: 'tenframe', opts: { n: 4 }, steps: [
          { say: '4 + ? = 7. Start with 4.', ms: 1400 },
          { say: 'Add counters until there are 7: 5, 6, 7.', act: function (t) { return t.fill(7, 600); }, ms: 700 },
          { say: 'We added <b>3</b>. So 4 + 3 = 7.', ms: 1800 }
        ] },
        try: { tool: 'tenframe', opts: { n: 5 }, tasks: [
          { do: 'Solve ' + eqn('5 + <b class="blank">?</b> = 9') + '. Add counters until there are 9.', reset: false, goal: function (s) { return s.n === 9; }, yes: 'You added 4. So 5 + 4 = 9.' }
        ] },
        ways: [
          { label: 'Count on with fingers', html: '<p>Say "4" in your head. Put up one finger for each number: 5, 6, 7. You have <b>3 fingers</b> up.</p>' },
          { label: 'Take away', html: '<p>7 take away 4 leaves 3. So the missing number is 3. ' + eqn('7 &minus; 4 = 3') + '</p>' }
        ],
        key: '<p>Count on from the part you know to the whole.</p>',
        check: [P('a-add', 3), P('a-add', 3)] }
    ] },

    { id: 'ten', title: 'Make 10', sub: 'Pairs that make 10.', concepts: [
      { id: 'pairs', title: 'Pairs that make 10', exp: ['B2.2'], skill: 'a-ten',
        body: '<p>A full ten frame is 10. Red and yellow counters show two numbers that <b>make 10</b>.</p><div class="vrow">' + [1, 2, 3, 4, 5].map(function (a) { return '<figure>' + A.draw.frames(a, { b: 10 - a, c: 13 }) + '<figcaption>' + a + ' + ' + (10 - a) + '</figcaption></figure>'; }).join('') + '</div>',
        watch: { tool: 'g1stage', steps: [1, 2, 3, 4, 5, 6].map(function (a) { return { say: a + ' and ' + (10 - a) + ' make 10.', act: function (t) { return t.show(fr(a, 10 - a) + '<p class="big">' + eqn(a + ' + ' + (10 - a) + ' = 10') + '</p>'); }, ms: 1300 }; }) },
        try: { tool: 'tenframe', opts: { two: true }, tasks: [
          { do: 'Fill the frame with red and yellow to make <b>10</b>. Use 7 red.', goal: function (s) { return s.a === 7 && s.b === 3; }, yes: '7 + 3 = 10.' },
          { do: 'Make 10 another way.', goal: function (s) { return s.full && s.a !== 7 && s.a > 0 && s.b > 0; }, yes: function (s) { return s.a + ' + ' + s.b + ' = 10.'; } }
        ] },
        key: '<p>1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5 all make <b>10</b>.</p>',
        check: [P('a-ten', 1), P('a-ten', 1)] },
      { id: 'how-many', title: 'How many more make 10?', exp: ['B2.2'], skill: 'a-ten',
        body: '<p>Look at the empty boxes. They show how many more make 10.</p>',
        watch: { tool: 'tenframe', opts: { n: 6 }, steps: [
          { say: '6 counters. How many more make 10?', ms: 1400 },
          { say: 'Count the empty boxes as we fill them: 1, 2, 3, 4.', act: function (t) { return t.fill(10, 600); }, ms: 700 },
          { say: '<b>4</b> more. 6 + 4 = 10.', ms: 1800 }
        ] },
        try: { tool: 'tenframe', opts: { n: 2 }, tasks: [
          { do: '2 are in the frame. Fill it up. How many did you add?', reset: false, goal: function (s) { return s.full; }, yes: 'You added 8. 2 + 8 = 10.' }
        ] },
        key: '<p>The <b>empty boxes</b> show how many more make 10.</p>',
        check: [P('a-ten', 2), P('a-ten', 2)] }
    ] },

    { id: 'facts', title: 'Facts that help', sub: 'Doubles, turn-arounds and zero.', concepts: [
      { id: 'doubles', title: 'Doubles', exp: ['B2.1'], skill: 'a-facts',
        body: '<p>A <b>double</b> adds a number to itself: 3 + 3 = 6. Doubles are easy to remember.</p>',
        watch: { tool: 'counters', opts: { n: 0, arrange: 'pairs' }, steps: [
          { say: '1 + 1 = 2', act: function (t) { return t.setN(2); }, ms: 900 },
          { say: '2 + 2 = 4', act: function (t) { return t.setN(4); }, ms: 900 },
          { say: '3 + 3 = 6', act: function (t) { return t.setN(6); }, ms: 900 },
          { say: '4 + 4 = 8', act: function (t) { return t.setN(8); }, ms: 900 },
          { say: '5 + 5 = 10. Each double makes two equal rows.', act: function (t) { return t.setN(10); }, ms: 1800 }
        ] },
        try: { tool: 'counters', opts: { n: 2, arrange: 'pairs', controls: ['pairs'], max: 10 }, tasks: [
          { do: 'Show the double <b>4 + 4</b>. Use + 1, then Pair them up.', goal: function (s) { return s.n === 8 && s.mode === 'pairs'; }, yes: '4 + 4 = 8. Two rows of 4.' }
        ] },
        key: '<p>Doubles: <b>1+1=2, 2+2=4, 3+3=6, 4+4=8, 5+5=10</b>.</p>',
        check: [P('a-facts', 1), P('a-facts', 1)] },
      { id: 'turn', title: 'Turn-arounds', exp: ['B2.1'], skill: 'a-facts',
        body: '<p>You can add in any order. <b>2 + 5</b> and <b>5 + 2</b> are both 7. These are turn-around facts.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: '2 red and 5 yellow: 2 + 5 = 7.', act: function (t) { return t.show(fr(2, 5) + '<p class="big">' + eqn('2 + 5 = 7') + '</p>'); }, ms: 1600 },
          { say: 'Turn the frame around: 5 + 2. Still 7.', act: function (t) { return t.show('<div style="transform:rotate(180deg)">' + fr(2, 5) + '</div><p class="big">' + eqn('5 + 2 = 7') + '</p>'); }, ms: 1800 },
          { say: 'Same counters, same total. Start with the bigger number to count on faster.', ms: 1800 }
        ] },
        try: { tool: 'tenframe', opts: { two: true }, tasks: [
          { do: 'Show ' + eqn('1 + 6') + ': 1 red and 6 yellow.', goal: function (s) { return s.a === 1 && s.b === 6; }, yes: '1 + 6 = 7.' },
          { do: 'Now the turn-around: ' + eqn('6 + 1') + '. 6 red and 1 yellow.', goal: function (s) { return s.a === 6 && s.b === 1; }, yes: '6 + 1 = 7 too.' }
        ] },
        key: '<p>The order does not change the total: <b>2 + 5 = 5 + 2</b>.</p>',
        check: [P('a-facts', 2), P('a-facts', 2)] },
      { id: 'zero', title: 'Adding zero', exp: ['B2.1'], skill: 'a-facts',
        body: '<p>Zero means none. Adding 0 does not change a number: <b>6 + 0 = 6</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: '6 red counters.', act: function (t) { return t.show(fr(6, 0)); }, ms: 1200 },
          { say: 'Add 0 yellow counters. Nothing new comes.', act: function (t) { return t.show(fr(6, 0) + '<p class="big">' + eqn('6 + 0 = 6') + '</p>'); }, ms: 1800 }
        ] },
        key: '<p>Any number <b>+ 0</b> stays the same.</p>',
        check: [function () { var n = R.int(1, 9); return { q: eqn(n + ' + 0 = <b class="blank">?</b>'), type: 'num', answer: n, hint: 'Adding zero adds nothing.', explain: n + ' + 0 = ' + n + '.' }; }, P('a-facts', 3)] }
    ] },

    { id: 'sub', title: 'Subtracting', sub: 'Take away, and count back.', concepts: [
      { id: 'take', title: 'Subtracting takes away', exp: ['B2.2'], skill: 'a-sub',
        body: '<p>When we <b>subtract</b>, we take some away and find how many are left.</p>',
        watch: { tool: 'g1objects', opts: { kind: 'apple', n: 8 }, steps: [
          { say: 'There are 8 apples.', ms: 1200 },
          { say: '3 apples get eaten.', act: function (t) { return t.setN(5); }, ms: 900 },
          { say: 'Count what is left: 1, 2, 3, 4, 5.', act: function (t) { return t.countAll(420); }, ms: 600 },
          { say: '8 take away 3 is <b>5</b>. We write 8 &minus; 3 = 5.', ms: 1800 }
        ] },
        try: { tool: 'g1objects', opts: { kind: 'fish', n: 9, controls: ['less'], max: 9 }, tasks: [
          { do: 'There are 9 fish. <b>Take away 4</b> with the &minus; 1 button. How many are left?', goal: function (s) { return s.n === 5; }, yes: '9 &minus; 4 = 5.' }
        ] },
        key: '<p><b>&minus;</b> means take away.</p>',
        check: [P('a-sub', 1), P('a-sub', 1)] },
      { id: 'back', title: 'Count back', exp: ['B2.2'], skill: 'a-sub',
        body: '<p>To take away a small number, start at the big number and <b>count back</b>.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 10, every: 1, start: 9 }, steps: [
          { say: 'What is 9 &minus; 2? Start at 9.', ms: 1400 },
          { say: 'Count back 2: 8 ...', act: function (t) { return t.hop(8, '1'); }, ms: 500 },
          { say: 'Count back 2: 8, 7.', act: function (t) { return t.hop(7, '2'); }, ms: 800 },
          { say: 'We land on 7. <b>9 &minus; 2 = 7</b>.', ms: 1800 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 10, every: 1, start: 10, step: 1 }, tasks: [
          { do: 'Find ' + eqn('10 &minus; 3') + '. Start at 10 and press Jump back 3 times.', goal: function (s) { return s.at === 7 && s.hops >= 3; }, yes: '10 ... 9, 8, 7. So 10 &minus; 3 = 7.' }
        ] },
        mistake: '<p>Counting the start number as the first jump back (9 &minus; 2: "9, 8"). The first number said is one jump back.</p>',
        key: '<p>Start at the big number. <b>Count back</b>.</p>',
        check: [P('a-sub', 2), P('a-sub', 2)] }
    ] },

    { id: 'family', title: 'Adding and subtracting go together', sub: 'Fact families.', concepts: [
      { id: 'family', title: 'A fact family', exp: ['B2.1'], skill: 'a-fam',
        body: '<p>The same three numbers make four facts. 3, 5 and 8: <b>3 + 5 = 8</b>, <b>5 + 3 = 8</b>, <b>8 &minus; 3 = 5</b>, <b>8 &minus; 5 = 3</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: '3 red and 5 yellow make 8.', act: function (t) { return t.show(fr(3, 5) + '<p class="big">' + eqn('3 + 5 = 8') + '</p>'); }, ms: 1500 },
          { say: 'Turn it around: 5 + 3 = 8.', act: function (t) { return t.show(fr(3, 5) + '<p class="big">' + eqn('5 + 3 = 8') + '</p>'); }, ms: 1500 },
          { say: 'Take away the 3 red: 8 &minus; 3 = 5.', act: function (t) { return t.show(A.draw.frames(0, { b: 5, ghost: 8, c: 30 }) + '<p class="big">' + eqn('8 &minus; 3 = 5') + '</p>'); }, ms: 1500 },
          { say: 'Take away the 5 yellow: 8 &minus; 5 = 3. Four facts, one family.', act: function (t) { return t.show(fr(3, 0) + '<p class="big">' + eqn('8 &minus; 5 = 3') + '</p>'); }, ms: 1800 }
        ] },
        key: '<p>Three numbers, <b>four facts</b>.</p>',
        check: [P('a-fam', 1), P('a-fam', 2)] },
      { id: 'think-add', title: 'Think addition to subtract', exp: ['B2.1'], skill: 'a-fam', hard: true,
        body: '<p>To find <b>9 &minus; 4</b>, think: "4 and what make 9?" 4 + 5 = 9, so 9 &minus; 4 = <b>5</b>.</p>',
        watch: { tool: 'tenframe', opts: { n: 4 }, steps: [
          { say: '9 &minus; 4? Think: 4 + ? = 9.', ms: 1500 },
          { say: 'Count on from 4 to 9: 5, 6, 7, 8, 9.', act: function (t) { return t.fill(9, 500); }, ms: 700 },
          { say: 'That is 5 more. So <b>9 &minus; 4 = 5</b>.', ms: 1800 }
        ] },
        ways: [
          { label: 'Use the family', html: '<p>If you know ' + eqn('4 + 5 = 9') + ', you also know ' + eqn('9 &minus; 4 = 5') + ' and ' + eqn('9 &minus; 5 = 4') + '.</p>' },
          { label: 'On a number line', html: '<div class="fig">' + A.draw.nl(0, 10, { mark: 4, hops: hops(4, 5) }) + '</div><p>From 4 to 9 is 5 jumps.</p>' }
        ],
        key: '<p>Subtracting asks: <b>"What do I add?"</b></p>',
        check: [P('a-fam', 3), P('a-sub', 3)] }
    ] },

    { id: 'story', title: 'Story problems', sub: 'Read, picture, solve, check.', concepts: [
      { id: 'join', title: 'Stories that join', exp: ['B2.2'], skill: 'a-story',
        body: '<p>Some stories put things <b>together</b>. Words like <b>in all</b>, <b>more came</b>, <b>altogether</b> tell us to add.</p>',
        watch: { tool: 'g1objects', opts: { kind: 'ball', n: 4 }, steps: [
          { say: 'Ava has 4 balls.', ms: 1300 },
          { say: 'Leo gives her 3 more.', act: function (t) { return t.setN(7); }, ms: 1000 },
          { say: 'How many in all? Count: 1 to 7.', act: function (t) { return t.countAll(380); }, ms: 600 },
          { say: '4 + 3 = <b>7</b> balls.', ms: 1800 }
        ] },
        try: { tool: 'g1objects', opts: { kind: 'flower', n: 5, controls: ['more'], max: 10 }, tasks: [
          { do: 'Zoe picks 5 flowers. Then she picks 2 more. Show the flowers, then tap each one to count.', goal: function (s) { return s.n === 7 && s.allCounted; }, yes: '5 + 2 = 7 flowers.' }
        ] },
        key: '<p>Read it. Picture it. Solve it. Check it.</p>',
        check: [P('a-story', 1), P('a-story', 2)] },
      { id: 'away', title: 'Stories that take away', exp: ['B2.2'], skill: 'a-story',
        body: '<p>Some stories take things <b>away</b>. Words like <b>left</b>, <b>ate</b>, <b>flew away</b>, <b>gave away</b> tell us to subtract.</p>',
        watch: { tool: 'g1objects', opts: { kind: 'star', n: 9 }, steps: [
          { say: 'There are 9 stickers.', ms: 1300 },
          { say: 'Sam gives 4 away.', act: function (t) { return t.setN(5); }, ms: 1000 },
          { say: 'How many are left? 9 &minus; 4 = <b>5</b>.', act: function (t) { return t.countAll(380); }, ms: 1800 }
        ] },
        try: { tool: 'g1objects', opts: { kind: 'apple', n: 8, controls: ['less'], max: 8 }, tasks: [
          { do: 'There are 8 apples. Mei eats 2. Show what is left.', goal: function (s) { return s.n === 6; }, yes: '8 &minus; 2 = 6 apples left.' }
        ] },
        mistake: '<p>Adding the two numbers in every story. Ask: "Does the group get bigger or smaller?"</p>',
        key: '<p>Bigger group: <b>add</b>. Smaller group: <b>subtract</b>.</p>',
        check: [P('a-story', 2), P('a-story', 3)] }
    ] }
  ];

  A.register('add-sub-10', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Adding puts groups together</h2>' +
'<p>When we <b>add</b>, we put two groups together and find how many in all. The sign <b>+</b> means "plus" or "add". The sign <b>=</b> means "is the same as".</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.frames(3, { b: 4, c: 28 }) + '</div><p>3 red and 4 yellow. I start at 4, the bigger number, and count on 3: 5, 6, 7. So ' + eqn('3 + 4 = 7') + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ' + eqn('5 + 2') + '?</p><ol><li>Start at the bigger number: 5. Say it in your head.</li><li>Count on 2: 6, 7.<div class="fig">' + A.draw.nl(0, 10, { mark: 5, hops: [[5, 6], [6, 7]] }) + '</div></li><li>We land on 7. ' + eqn('5 + 2 = 7') + '.</li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>Start with the bigger number and count on. It is faster.</p></div>' +
'<div class="lab"><span class="lt">Try it: add two groups</span><div class="row2">' + A.stepHtml('ad1', 'Red', 3) + A.stepHtml('ad2', 'Yellow', 4) + '</div>' +
'<div class="fig" id="adfig"></div><div class="out" id="adout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Make 10</h2>' +
'<p>A ten frame shows the pairs that make 10. The counters and the empty boxes always make 10.</p>' +
'<div class="vrow"><figure>' + A.draw.frames(6, { b: 4, c: 18 }) + '<figcaption>6 + 4</figcaption></figure><figure>' + A.draw.frames(7, { b: 3, c: 18 }) + '<figcaption>7 + 3</figcaption></figure><figure>' + A.draw.frames(9, { b: 1, c: 18 }) + '<figcaption>9 + 1</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.frames(8, { ghost: 10, c: 28 }) + '</div><p>There are 8 counters and 2 empty boxes. ' + eqn('8 + 2 = 10') + '.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Learn the pairs that make 10 by heart: 1 and 9, 2 and 8, 3 and 7, 4 and 6, 5 and 5. They help with bigger numbers later.</p></div>' +
'<div class="lab"><span class="lt">Try it: pairs that make 10</span>' + A.stepHtml('mt1', 'Red counters', 7) +
'<div class="fig" id="mtfig"></div><div class="out" id="mtout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Facts that help</h2>' +
'<p>Some facts help you find others fast.</p>' +
'<div class="vrow"><figure>' + A.draw.frames(2, { b: 5, c: 18 }) + '<figcaption>2 + 5 = 7</figcaption></figure><figure>' + A.draw.frames(5, { b: 2, c: 18 }) + '<figcaption>5 + 2 = 7</figcaption></figure></div>' +
'<p><b>Turn-arounds.</b> You can add in any order. ' + eqn('2 + 5') + ' and ' + eqn('5 + 2') + ' are both 7.</p>' +
'<p><b>Doubles.</b> Two of the same: ' + eqn('1 + 1 = 2') + ', ' + eqn('2 + 2 = 4') + ', ' + eqn('3 + 3 = 6') + ', ' + eqn('4 + 4 = 8') + ', ' + eqn('5 + 5 = 10') + '.</p>' +
'<p><b>Plus zero.</b> Adding 0 changes nothing: ' + eqn('6 + 0 = 6') + '.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>What is ' + eqn('4 + 5') + '? I know the double ' + eqn('4 + 4 = 8') + '. 5 is one more than 4, so ' + eqn('4 + 5') + ' is one more than 8. It is <b>9</b>.</p><div class="fig">' + A.draw.frames(4, { b: 5, c: 24 }) + '</div></div>' +
'<div class="lab"><span class="lt">Try it: turn it around</span><div class="row2">' + A.stepHtml('tr1', 'First number', 2) + A.stepHtml('tr2', 'Second number', 6) + '</div>' +
'<div class="vrow" id="trfig"></div><div class="out" id="trout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Subtracting takes away</h2>' +
'<p>When we <b>subtract</b>, we take some away and find how many are <b>left</b>. The sign <b>&minus;</b> means "minus" or "take away".</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.frames(8, { x: 3, c: 28, label: '8 counters with 3 crossed out' }) + '</div><p>I have 8. I take away 3, so I cross out 3. I count what is left: 5. So ' + eqn('8 &minus; 3 = 5') + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ' + eqn('9 &minus; 2') + '?</p><ol><li>Start at 9.</li><li>Count back 2: 8, 7.<div class="fig">' + A.draw.nl(0, 10, { mark: 9, hops: [[9, 8], [8, 7]] }) + '</div></li><li>We land on 7. ' + eqn('9 &minus; 2 = 7') + '.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>When you count back, do not count the number you start on. For ' + eqn('9 &minus; 2') + ', say "8, 7", not "9, 8".</p></div>' +
'<div class="lab"><span class="lt">Try it: take away</span><div class="row2">' + A.stepHtml('sb1', 'Start with', 8) + A.stepHtml('sb2', 'Take away', 3) + '</div>' +
'<div class="fig" id="sbfig"></div><div class="out" id="sbout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Adding and subtracting go together</h2>' +
'<p>A <b>fact family</b> is a group of facts that use the same three numbers. If you know one, you know them all.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.frames(3, { b: 5, c: 26 }) + '</div><p>3 red and 5 yellow make 8.</p>' +
'<p>' + eqn('3 + 5 = 8') + ' &nbsp; ' + eqn('5 + 3 = 8') + ' &nbsp; ' + eqn('8 &minus; 3 = 5') + ' &nbsp; ' + eqn('8 &minus; 5 = 3') + '</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>Is ' + eqn('7 &minus; 4 = 3') + ' right? Check it with adding.</p><ol><li>Take the answer, 3, and add back the 4.</li><li>' + eqn('3 + 4 = 7') + '.</li><li>We got back to 7, so the subtraction is right.</li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>Subtracting undoes adding. You can check a subtraction by adding.</p></div>' +
'<div class="lab"><span class="lt">Try it: build a fact family</span><div class="row2">' + A.stepHtml('ff1', 'Red part', 3) + A.stepHtml('ff2', 'Yellow part', 5) + '</div>' +
'<div class="fig" id="fffig"></div><div class="out" id="ffout"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      var a = 3, b = 4, s1, s2;
      function ad() {
        $('#adfig', root).innerHTML = A.draw.frames(a, { b: b, c: 26 }) + A.draw.nl(0, 10, { mark: Math.max(a, b), hops: hops(Math.max(a, b), Math.min(a, b)) });
        $('#adout', root).innerHTML = '<span class="big">' + a + ' + ' + b + ' = ' + (a + b) + '</span>' + (Math.min(a, b) ? '<br>Start at ' + Math.max(a, b) + ', count on ' + Math.min(a, b) + ': ' + seq(Math.max(a, b) + 1, Math.min(a, b)).join(', ') + '.' : '<br>Adding 0 changes nothing.');
      }
      s1 = A.stepper(root, 'ad1', 0, 10, function (n) { a = n; if (s2 && a + b > 10) { s2.set(10 - a); return; } ad(); });
      s2 = A.stepper(root, 'ad2', 0, 10, function (n) { b = n; if (a + b > 10) { s1.set(10 - b); return; } ad(); });
      A.stepper(root, 'mt1', 0, 10, function (n) {
        $('#mtfig', root).innerHTML = A.draw.frames(n, { b: 10 - n, c: 30 });
        $('#mtout', root).innerHTML = '<span class="big">' + n + ' + ' + (10 - n) + ' = 10</span><br>' + n + ' red and ' + (10 - n) + ' yellow.';
      });
      var x = 2, y = 6, t1, t2;
      function tr() {
        $('#trfig', root).innerHTML = '<figure>' + A.draw.frames(x, { b: y, c: 18 }) + '<figcaption>' + x + ' + ' + y + ' = ' + (x + y) + '</figcaption></figure><figure>' + A.draw.frames(y, { b: x, c: 18 }) + '<figcaption>' + y + ' + ' + x + ' = ' + (x + y) + '</figcaption></figure>';
        $('#trout', root).innerHTML = 'Same numbers, same total: <b>' + (x + y) + '</b>.' + (x === y ? ' This is a double.' : '') + (x === 0 || y === 0 ? ' Adding 0 changes nothing.' : '');
      }
      t1 = A.stepper(root, 'tr1', 0, 10, function (n) { x = n; if (t2 && x + y > 10) { t2.set(10 - x); return; } tr(); });
      t2 = A.stepper(root, 'tr2', 0, 10, function (n) { y = n; if (x + y > 10) { t1.set(10 - y); return; } tr(); });
      var st = 8, tk = 3, u1, u2;
      function sb() {
        $('#sbfig', root).innerHTML = A.draw.frames(st, { x: tk, c: 28, min: 10, label: st + ' counters with ' + tk + ' crossed out' });
        $('#sbout', root).innerHTML = '<span class="big">' + st + ' &minus; ' + tk + ' = ' + (st - tk) + '</span><br>' + (tk ? 'Count back ' + tk + ' from ' + st + ': ' + seq(st - tk, tk).reverse().join(', ') + '.' : 'Taking away 0 leaves the same number.');
      }
      u1 = A.stepper(root, 'sb1', 1, 10, function (n) { st = n; if (u2 && tk > st) { u2.set(st); return; } sb(); });
      u2 = A.stepper(root, 'sb2', 0, 10, function (n) { if (n > st) { u2.set(st); return; } tk = n; sb(); });
      var p = 3, q = 5, v1, v2;
      function ff() {
        var w = p + q;
        $('#fffig', root).innerHTML = A.draw.frames(p, { b: q, c: 26, min: 10 });
        $('#ffout', root).innerHTML = 'The numbers are ' + p + ', ' + q + ' and ' + w + '.<br><span class="math">' + p + ' + ' + q + ' = ' + w + '</span> &nbsp; <span class="math">' + q + ' + ' + p + ' = ' + w + '</span><br><span class="math">' + w + ' &minus; ' + p + ' = ' + q + '</span> &nbsp; <span class="math">' + w + ' &minus; ' + q + ' = ' + p + '</span>';
      }
      v1 = A.stepper(root, 'ff1', 1, 9, function (n) { p = n; if (v2 && p + q > 10) { v2.set(10 - p); return; } ff(); });
      v2 = A.stepper(root, 'ff2', 1, 9, function (n) { q = n; if (p + q > 10) { v1.set(10 - q); return; } ff(); });
    },

    checks: [
      [function () { return qAdd(1); }, function () { return qAdd(2); }, function () { return qStory(1); }],
      [function () { return qTen(1); }, function () { return qTen(2); }, function () { return qTen(2); }],
      [function () { return qFacts(1); }, function () { return qFacts(2); }, function () { return qFacts(3); }],
      [function () { return qSub(1); }, function () { return qSub(2); }, function () { return qStory(2); }],
      [function () { return qFam(1); }, function () { return qFam(2); }, function () { return qFam(3); }]
    ],

    quiz: [
      { q: 'What is ' + eqn('6 + 3') + '?', type: 'num', answer: 9, fig: A.draw.frames(6, { b: 3, c: 24 }),
        hint: 'Start at 6 and count on 3.', explain: '6 and 3 more: 7, 8, 9. So 6 + 3 = 9.' },
      { q: eqn('4 + <b class="blank">?</b> = 10'), type: 'num', answer: 6, fig: A.draw.frames(4, { ghost: 10, c: 24, label: '4 counters and 6 empty boxes' }),
        hint: 'Count the empty boxes.', explain: '4 and 6 make 10.' },
      { q: 'What is ' + eqn('10 &minus; 4') + '?', type: 'num', answer: 6, fig: A.draw.frames(10, { x: 4, c: 24, label: '10 counters with 4 crossed out' }),
        hint: 'Count the counters that are not crossed out.', explain: '10 take away 4 leaves 6.' },
      { q: eqn('3 + 6 = 9') + '. So what is ' + eqn('6 + 3') + '?', type: 'num', answer: 9,
        hint: 'Same numbers, different order.', explain: 'Turn-around facts have the same total: 6 + 3 = 9.' },
      { q: 'Which fact is in the same family as ' + eqn('2 + 7 = 9') + '?', type: 'mc', options: ['9 &minus; 7 = 2', '9 + 2 = 11', '7 &minus; 2 = 5', '9 &minus; 3 = 6'], answer: 0, wide: true,
        hint: 'Look for the fact that uses 2, 7 and 9.', explain: '9 &minus; 7 = 2 uses the same three numbers.' },
      { q: 'Ava has 7 balls. She loses 2. How many balls are left?', type: 'num', answer: 5, fig: A.draw.row('ball', 7, { s: 30 }),
        hint: '"Left" means take away. Count back 2 from 7.', explain: '7 &minus; 2 = 5. Ava has 5 balls left.' },
      { q: 'Double 4. What is ' + eqn('4 + 4') + '?', type: 'mc', options: ['6', '8', '9', '44'], answer: 1,
        hint: 'Count 4, then count on 4 more.', explain: '4 + 4 = 8.' }
    ],

    practice: [
      { id: 'a-add', name: 'Adding to 10', code: 'B2.2', gen: qAdd },
      { id: 'a-ten', name: 'Make 10', code: 'B2.2', gen: qTen },
      { id: 'a-facts', name: 'Doubles, turn-arounds, zero', code: 'B2.1', gen: qFacts },
      { id: 'a-sub', name: 'Subtracting from 10', code: 'B2.2', gen: qSub },
      { id: 'a-fam', name: 'Fact families', code: 'B2.1', gen: qFam },
      { id: 'a-story', name: 'Story problems to 10', code: 'B2.2', gen: qStory }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ---------- */
  var G = window.G1, nm = A.Q ? A.Q.name : function () { return R.pick(PEOPLE); };
  function sumPair(lv) { var a = R.int(1, lv === 1 ? 4 : 8), b = R.int(1, (lv === 1 ? 5 : 10) - a); return [a, b]; }
  var SHAPES = {
    'a-add': [
      [1, 'tap', function (lv) {
        var p = sumPair(lv), a = p[0], b = p[1], c = a + b, alts = [b + 1, b - 1, b + 2].filter(function (x) { return x >= 1 && a + x <= 10; }).slice(0, 2), set = R.shuffle([b].concat(alts));
        return { q: 'Tap the ten frame that shows ' + eqn(a + ' + ' + b) + '.', type: 'tap', tiles: set.map(function (x) { return A.draw.frames(a, { b: x, c: 16 }); }), answer: set.indexOf(b), answerText: 'the frame with ' + a + ' red and ' + b + ' yellow',
          hint: 'Look for ' + a + ' red counters and ' + b + ' yellow ones.', steps: ['Count the red counters in each frame: ' + a + '.', 'Then count the yellow ones. You want ' + b + '.'],
          explain: a + ' red and ' + b + ' yellow make ' + c + '.', meta: { k: 'g1-add-tap' } };
      }],
      [1, 'line', function (lv) {
        var p = sumPair(lv), a = p[0], b = p[1];
        return { q: 'Start at ' + a + '. Jump ' + b + ' more. Put the marker where you land.', type: 'line', min: 0, max: 10, tick: 1, every: 1, snap: 1, answer: a + b,
          hint: 'Start at ' + a + '. Count on ' + b + '.', steps: ['Start at ' + a + '.', 'Count on ' + b + ': ' + seq(a + 1, b).join(', ') + '.'],
          explain: a + ' + ' + b + ' = ' + (a + b) + '.', meta: { k: 'g1-add-line' } };
      }],
      [2, 'match', function (lv) {
        var pairs = [], sums = [];
        while (pairs.length < 3) { var p = sumPair(lv); if (sums.indexOf(p[0] + p[1]) < 0) { sums.push(p[0] + p[1]); pairs.push([p[0] + ' + ' + p[1], String(p[0] + p[1])]); } }
        return { q: 'Match each sum to its answer.', type: 'match', pairs: pairs, hint: 'Start at the bigger number and count on.', steps: ['Add each pair. Then find its answer.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'g1-add-match' } };
      }],
      [2, 'mistake', function (lv) {
        var p = sumPair(lv), a = p[0], b = p[1], c = a + b, who = nm(), truth = !R.int(0, 2), said = truth ? c : c + R.pick([1, -1]);
        var right = a + ' + ' + b + ' = ' + c + '. Start at ' + a + ' and count on ' + b + '.';
        return G.tf(who + ' says ' + eqn(a + ' + ' + b + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, right,
          ['Count the first number again when you count on.', 'Adding makes a number smaller.', 'You add by putting the digits side by side.'], { k: 'g1-add-tf' },
          { hint: 'Work out ' + a + ' + ' + b + ' yourself.' });
      }]
    ],
    'a-ten': [
      [1, 'tap', function (lv) {
        var a = R.int(lv === 1 ? 5 : 1, 9), need = 10 - a, set = R.shuffle(G.near(a, 3, 1, 9));
        return { q: 'Tap the ten frame that needs <b>' + need + '</b> more to make 10.', type: 'tap', tiles: set.map(function (x) { return A.draw.frames(x, { ghost: 10, c: 16 }); }), answer: set.indexOf(a), answerText: 'the frame with ' + a,
          hint: 'Count the empty boxes in each frame.', steps: ['A full frame is 10.', 'You want ' + need + ' empty boxes.'],
          explain: a + ' and ' + need + ' make 10.', meta: { k: 'g1-ten10-tap' } };
      }],
      [1, 'match', function (lv) {
        var as = [];
        while (as.length < 3) { var a = R.int(lv === 1 ? 5 : 1, 9); if (as.indexOf(a) < 0) as.push(a); }
        return { q: 'How many more make 10? Match each frame to its number.', type: 'match', pairs: as.map(function (a) { return [A.draw.frames(a, { ghost: 10, c: 14 }), String(10 - a)]; }),
          hint: 'Count the empty boxes.', steps: ['The empty boxes show how many more make 10.'],
          explain: as.map(function (a) { return a + ' + ' + (10 - a) + ' = 10'; }).join('. ') + '.', meta: { k: 'g1-ten10-match' } };
      }],
      [2, 'story', function (lv) {
        var who = nm(), c = R.pick([['crayons', 'box'], ['eggs', 'carton'], ['pencils', 'case'], ['muffins', 'tray']]), n = R.int(1, 9);
        return { q: 'A ' + c[1] + ' holds 10 ' + c[0] + '. ' + who + ' puts ' + n + ' in it. How many more ' + c[0] + ' fit?', type: 'num', answer: 10 - n,
          hint: 'How many more make 10?', steps: ['Start at ' + n + ' and count on to 10.', 'That is ' + (10 - n) + '.'],
          explain: n + ' + ' + (10 - n) + ' = 10.', meta: { k: 'g1-ten10-story' } };
      }],
      [3, 'pick', function () {
        var opts = [], good = 0;
        while (opts.length < 5) {
          var a = R.int(1, 9), ok = good < 3 && R.int(0, 1), b = ok ? 10 - a : 10 - a + R.pick([1, -1]), t = a + ' + ' + b;
          if (b < 0 || opts.indexOf(t) >= 0 || (!ok && opts.length - good >= 3)) continue;
          opts.push(t); if (ok) good++;
        }
        if (!good) opts[0] = '4 + 6';
        var ans = []; opts.forEach(function (t, j) { var p = t.split(' + '); if (+p[0] + +p[1] === 10) ans.push(j); });
        return { q: 'Pick every pair that makes <b>10</b>.', type: 'pick', options: opts, answer: ans, hint: 'Picture a ten frame. Does each pair fill it?', steps: ['Add each pair.'],
          explain: ans.map(function (j) { return opts[j]; }).join(', ') + ' make 10.', meta: { k: 'g1-ten10-pick', opts: opts } };
      }]
    ],
    'a-facts': [
      [1, 'match', function (lv) {
        var vals = R.shuffle([1, 2, 3, 4, 5]).slice(0, 3);
        return { q: 'Match each double to its answer.', type: 'match', pairs: vals.map(function (a) { return [a + ' + ' + a, String(a + a)]; }),
          hint: 'A double is the same number twice.', steps: ['Think of a ten frame with two equal rows.'],
          explain: vals.map(function (a) { return a + ' + ' + a + ' = ' + (a + a); }).join('. ') + '.', meta: { k: 'g1-facts-match' } };
      }],
      [1, 'tap', function (lv) {
        var a = R.int(2, 5), set = R.shuffle([[a, a], [a, a + 1], [a + 1, a - 1]]);
        return { q: 'Tap the picture that shows a <b>double</b>.', type: 'tap', tiles: set.map(function (p) { return A.draw.frames(p[0], { b: p[1], c: 16 }); }), answer: set.map(function (p) { return p[0] === p[1]; }).indexOf(true), answerText: 'the frame with ' + a + ' red and ' + a + ' yellow',
          hint: 'A double has the same number of red and yellow.', steps: ['Count the red, then the yellow, in each frame.'],
          explain: a + ' + ' + a + ' = ' + (a + a) + ' is a double.', meta: { k: 'g1-facts-tap' } };
      }],
      [2, 'mistake', function (lv) {
        var a, b; do { a = R.int(1, 8); b = R.int(1, 10 - a); } while (a === b);
        var who = nm(), truth = !R.int(0, 2), said = truth ? a + b : a + b + R.pick([1, -1]);
        var right = 'Turning the numbers around does not change the total. ' + b + ' + ' + a + ' = ' + (a + b) + ' too.';
        return G.tf(who + ' knows ' + eqn(a + ' + ' + b + ' = ' + (a + b)) + '. ' + who + ' says ' + eqn(b + ' + ' + a + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, right,
          ['Turning the numbers around changes the total.', 'The first number is always the total.', 'Adding 0 changes the number.'], { k: 'g1-facts-tf' },
          { hint: 'Does the order of the numbers change the total?' });
      }]
    ],
    'a-sub': [
      [1, 'line', function (lv) {
        var n = lv === 1 ? R.int(3, 6) : R.int(5, 10), k = R.int(1, n - 1);
        return { q: 'Start at ' + n + '. Jump back ' + k + '. Put the marker where you land.', type: 'line', min: 0, max: 10, tick: 1, every: 1, snap: 1, answer: n - k,
          hint: 'Jumping back is taking away. Count back ' + k + '.', steps: ['Start at ' + n + '.', 'Count back ' + k + ': ' + seq(n - k, k).reverse().join(', ') + '.'],
          explain: n + ' ' + M + ' ' + k + ' = ' + (n - k) + '.', meta: { k: 'g1-sub-line' } };
      }],
      [1, 'tap', function (lv) {
        var n = lv === 1 ? R.int(3, 6) : R.int(5, 9), k = R.int(1, n - 2), set = R.shuffle([[n, k], [n, k + 1], [n + 1, k]]);
        return { q: 'Tap the picture that shows ' + eqn(n + ' ' + M + ' ' + k) + '.', type: 'tap', tiles: set.map(function (p) { return A.draw.frames(p[0], { x: p[1], c: 16 }); }), answer: set.map(function (p) { return p.join(); }).indexOf(n + ',' + k), answerText: 'the frame with ' + n + ' counters and ' + k + ' crossed out',
          hint: 'Look for ' + n + ' counters with ' + k + ' crossed out.', steps: ['Count all the counters: you want ' + n + '.', 'Count the crossed-out ones: you want ' + k + '.'],
          explain: n + ' take away ' + k + ' leaves ' + (n - k) + '.', meta: { k: 'g1-sub-tap' } };
      }],
      [2, 'mistake', function (lv) {
        var n = R.int(4, 10), k = R.int(1, n - 1), who = nm(), truth = !R.int(0, 2), said = truth ? n - k : n - k + 1;
        var right = n + ' ' + M + ' ' + k + ' = ' + (n - k) + '. Start at ' + n + ' and count back ' + k + '.';
        return G.tf(who + ' says ' + eqn(n + ' ' + M + ' ' + k + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, right,
          ['Count the start number as the first jump back.', 'Taking away makes a number bigger.', 'Subtracting is the same as adding.'], { k: 'g1-sub-tf' },
          { hint: 'Count back ' + k + ' from ' + n + '.' });
      }]
    ],
    'a-fam': [
      [1, 'fill', function (lv) {
        var p = sumPair(lv), a = p[0], b = p[1], c = a + b;
        return { q: 'Use the adding fact to fill in the blanks.', type: 'fill', fill: eqn(a + ' + ' + b + ' = ' + c) + '<br>' + eqn(c + ' ' + M + ' ' + a + ' = [[]]') + '<br>' + eqn(c + ' ' + M + ' ' + b + ' = [[]]'), answers: [b, a],
          hint: 'The same three numbers make the whole family.', steps: [c + ' is the whole. ' + a + ' and ' + b + ' are the parts.', 'Take one part from the whole: the other part is left.'],
          explain: c + ' ' + M + ' ' + a + ' = ' + b + ' and ' + c + ' ' + M + ' ' + b + ' = ' + a + '.', meta: { k: 'g1-fam-fill' } };
      }],
      [1, 'pick', function (lv) {
        var a, b; do { var p = sumPair(lv); a = p[0]; b = p[1]; } while (a === b);
        var c = a + b, good = [b + ' + ' + a + ' = ' + c, c + ' ' + M + ' ' + a + ' = ' + b, c + ' ' + M + ' ' + b + ' = ' + a], bad = [c + ' + ' + a + ' = ' + (c + a), (c + 1) + ' ' + M + ' ' + a + ' = ' + b, a + ' + ' + c + ' = ' + (a + c)];
        var opts = R.shuffle(R.shuffle(good).slice(0, 2 + R.int(0, 1)).concat(R.shuffle(bad).slice(0, 2)));
        var ans = []; opts.forEach(function (o, j) { if (good.indexOf(o) >= 0) ans.push(j); });
        return { q: 'Pick every fact in the same family as ' + eqn(a + ' + ' + b + ' = ' + c) + '.', type: 'pick', options: opts, answer: ans,
          hint: 'A family uses only ' + a + ', ' + b + ' and ' + c + ', and every fact is true.', steps: ['Check each fact: does it use only ' + a + ', ' + b + ' and ' + c + '?', 'Is it true?'],
          explain: 'The family is ' + a + ' + ' + b + ' = ' + c + ', ' + good.join(', ') + '.', meta: { k: 'g1-fam-pick' } };
      }],
      [2, 'match', function (lv) {
        var p = sumPair(lv), a = p[0], b = p[1], c = a + b;
        if (a === b) { b = b === 1 ? 2 : b - 1; c = a + b; }
        return { q: 'These are all in the family of ' + eqn(a + ' + ' + b + ' = ' + c) + '. Match each one to its answer.', type: 'match', pairs: [[c + ' ' + M + ' ' + a, String(b)], [c + ' ' + M + ' ' + b, String(a)], [b + ' + ' + a, String(c)]],
          hint: 'Use the adding fact.', steps: [c + ' is the whole. ' + a + ' and ' + b + ' are the parts.'],
          explain: c + ' ' + M + ' ' + a + ' = ' + b + '. ' + c + ' ' + M + ' ' + b + ' = ' + a + '. ' + b + ' + ' + a + ' = ' + c + '.', meta: { k: 'g1-fam-match' } };
      }]
    ],
    'a-story': [
      [1, 'which way', function (lv) {
        var who = nm(), kind = R.pick(THINGS), add = R.int(0, 1), a = R.int(3, lv === 1 ? 6 : 9), b = R.int(1, add ? 10 - a : a - 1);
        var verb = add ? R.pick(['gets', 'finds']) + ' ' + b + ' more' : (kind === 'apple' ? R.pick(['eats', 'gives away']) : R.pick(['gives away', 'loses'])) + ' ' + b;
        var o = R.mc(add ? 'Add' : 'Subtract', [add ? 'Subtract' : 'Add']);
        return { q: who + ' has ' + A.nm(kind, a) + '. ' + who + ' ' + verb + '. To find how many ' + (add ? 'now' : 'are left') + ', do you add or subtract?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Getting more means add. Losing, eating or giving away means subtract.', steps: [add ? 'There will be more than before, so add.' : 'There will be fewer than before, so subtract.', add ? a + ' + ' + b + ' = ' + (a + b) + '.' : a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.'],
          explain: add ? 'Add: ' + a + ' + ' + b + ' = ' + (a + b) + '.' : 'Subtract: ' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.', meta: { k: 'g1-story-way' } };
      }],
      [1, 'fill', function (lv) {
        var who = nm(), kind = R.pick(THINGS), add = lv === 1 ? 1 : R.int(0, 1), a = R.int(2, lv === 1 ? 5 : 9), b = R.int(1, add ? Math.max(1, (lv === 1 ? 6 : 10) - a) : a - 1);
        var q = who + ' has ' + A.nm(kind, a) + '. ' + who + (add ? ' gets ' + b + ' more.' : ' gives away ' + b + '.') + ' Write the number sentence.';
        return { q: q, type: 'fill', fill: eqn(a + ' ' + (add ? '+' : M) + ' ' + b + ' = [[]]'), answers: [add ? a + b : a - b],
          hint: add ? 'Start at ' + a + ' and count on ' + b + '.' : 'Start at ' + a + ' and count back ' + b + '.', steps: [add ? 'More means add.' : 'Giving away means subtract.'],
          explain: a + ' ' + (add ? '+' : M) + ' ' + b + ' = ' + (add ? a + b : a - b) + '.', meta: { k: 'g1-story-fill' } };
      }],
      [2, 'mistake', function (lv) {
        var who = nm(), a = R.int(4, 10), b = R.int(1, a - 1), truth = !R.int(0, 2), said = truth ? a - b : a + b;
        var right = b + ' popped, so take away: ' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.';
        return G.tf('There were ' + a + ' balloons. ' + b + ' popped. ' + who + ' says <b>' + said + '</b> are left. True or false: ' + who + ' is right.', truth, right,
          ['Always add the two numbers in a story.', 'The answer is always the bigger number.', 'Popped balloons are still left.'], { k: 'g1-story-tf' },
          { hint: '"Left" means take away.' });
      }]
    ]
  };
  G.shapes(CH, SHAPES);
})();
