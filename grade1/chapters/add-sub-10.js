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

  A.register('add-sub-10', {
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
})();
