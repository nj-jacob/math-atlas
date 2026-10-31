(function () {
  var K = K8, A = Atlas, R = A.R, F = K.fx('roots-real'), C = 'roots-real', T = K.txt;
  var SQ = '<sup>2</sup>', RT = '&radic;';

  K.lessons(C, [
    { id: 'squares', title: 'Square numbers', sub: 'A number times itself, and the square it makes.', concepts: [
      { id: 'square', title: 'What squaring means', exp: ['B2.2'], skill: 'rr-square',
        body: '<p>To <b>square</b> a number, multiply it by itself. 6' + SQ + ' means 6 × 6 = 36. It is the area of a square with sides of 6.</p>',
        watch: K.film([
          [F.square(3), 'A square 3 tiles wide and 3 tall holds 9 tiles. 3² = 9.'],
          [F.square(4), 'Make the side 4. Now 16 tiles: 4² = 16.'],
          [F.square(6), 'Side 6: 6 × 6 = 36 tiles. Not 6 × 2.'],
          [F.square(10), 'Side 10: 100 tiles. The small 2 means "use it as a factor twice".', 2400]
        ]),
        example: K.film([
          [F.square(8), 'My turn. I will find 8². The small 2 tells me to use 8 as a factor twice.'],
          [T(['8² = 8 × 8']), 'First I write it as a multiplication: 8 × 8.'],
          [T(['8 × 8 = 64']), 'Next I multiply: 8 × 8 = 64.'],
          [F.square(8), 'I check with the picture: a square 8 wide and 8 tall holds 64 tiles. So <b>8² = 64</b>, the area of a square with side 8.', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Build the square with an area of <b>144</b>.', goal: function (g) { return g('sqn') === 12; }, yes: '12 × 12 = 144. So 12² = 144.' },
          { do: 'Now build the square with an area of <b>225</b>.', goal: function (g) { return g('sqn') === 15; }, yes: '15 × 15 = 225.' }] }),
        key: '<p>n' + SQ + ' = <b>n × n</b>: the area of a square with side n.</p>',
        mistake: '<p>Doubling instead of squaring: 6' + SQ + ' = 12. Point to the tiles: a 6 by 6 square has 36.</p>',
        check: [K.chk(C, 'rr-square', 1), K.chk(C, 'rr-square', 2)] },
      { id: 'decimal', title: 'Squaring decimals and fractions', exp: ['B2.2'], skill: 'rr-square', hard: true,
        body: '<p>The rule does not change: multiply the number by itself. For a decimal, count the decimal places. For a fraction, square the top and square the bottom.</p>',
        watch: K.film([
          [T(['0.3² = 0.3 × 0.3']), 'Square 0.3. Multiply it by itself.'],
          [T(['3 × 3 = 9', 'two decimal places → 0.09']), '3 × 3 = 9. Each 0.3 has one decimal place, so the answer has two: 0.09.'],
          [T(['(2/5)² = (2 × 2)/(5 × 5)', '= 4/25']), 'For a fraction, square the top and the bottom.'],
          [T(['30² = 3² × 100', '= 900']), 'For 30², square 3, then add the two zeros from the two tens.', 2400]
        ]),
        example: K.film([
          [T(['0.6² = ?']), 'My turn. I will square 0.6. The rule is the same: I multiply it by itself.'],
          [T(['0.6 × 0.6']), 'First I write 0.6 × 0.6.'],
          [T(['6 × 6 = 36']), 'Next I leave out the decimal points for a moment: 6 × 6 = 36.'],
          [T(['one place + one place', '= two places → 0.36']), 'Then I count decimal places. Each 0.6 has one, so the answer has two: 0.36.'],
          [T(['0.36 < 0.6 ✓']), 'I check: squaring a number less than 1 makes it smaller. 0.36 is less than 0.6, so <b>0.6² = 0.36</b>.', 2600]
        ]),
        ways: [{ label: 'Area of a small square', html: '<p>A square 0.3 m wide is smaller than a square metre. Its area must be smaller than 0.3 too: 0.09 m' + SQ + '. Squaring a number less than 1 makes it <b>smaller</b>.</p>' },
          { label: 'Count the places', html: '<p>0.3 × 0.3: one place + one place = two places. 9 becomes 0.09. 0.05 × 0.05: two + two = four places, so 25 becomes 0.0025.</p>' }],
        key: '<p>Same rule: <b>multiply by itself</b>. Decimal places add; fractions square top and bottom.</p>',
        mistake: '<p>Writing 0.3' + SQ + ' = 0.9. Ask: "How many decimal places are in 0.3 × 0.3?"</p>',
        check: [K.chk(C, 'rr-square', 3), K.mc('What is 0.4' + SQ + '?', '0.16', ['1.6', '0.8', '0.016'], '0.4 × 0.4. Count two decimal places.', '4 × 4 = 16, with two decimal places: 0.16.')] }
    ] },
    { id: 'roots', title: 'Square roots', sub: 'Going backwards from area to side.', concepts: [
      { id: 'root', title: 'Square roots undo squaring', exp: ['B2.2'], skill: 'rr-root',
        body: '<p>The <b>square root</b> of a number is what you square to get it. If a square has an area of 81, its side is ' + RT + '81 = 9.</p>' + K.eq(RT + '81 = 9 because 9' + SQ + ' = 81'),
        watch: K.film([
          [F.square(7), 'This square has an area of 49. How long is each side?'],
          [F.square(7), '7 × 7 = 49, so each side is 7. We write √49 = 7.'],
          [T(['√64 = 8', 'check: 8 × 8 = 64']), 'Check any root by squaring your answer.', 2400]
        ]),
        example: K.film([
          [F.square(11), 'My turn. This square has an area of 121. I will find √121, the length of each side.'],
          [T(['? × ? = 121']), 'I ask: what number times itself makes 121?'],
          [T(['10 × 10 = 100', '11 × 11 = 121']), 'I try 10: 100 is too small. I try 11: 11 × 11 = 121.'],
          [T(['√121 = 11', 'check: 11² = 121 ✓']), 'So <b>√121 = 11</b>. I check by squaring: 11² = 121.', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'A square has an area of <b>81</b>. Find its side.', goal: function (g) { return g('sqn') === 9; }, yes: '√81 = 9.' },
          { do: 'Now find the side of a square with area <b>169</b>.', goal: function (g) { return g('sqn') === 13; }, yes: '√169 = 13.' }] }),
        key: '<p>' + RT + 'n is the number that, <b>times itself</b>, makes n.</p>',
        mistake: '<p>Halving: ' + RT + '64 = 32. Check by squaring: 32 × 32 is far bigger than 64.</p>',
        check: [K.chk(C, 'rr-root', 1), K.chk(C, 'rr-root', 2)] },
      { id: 'rootfrac', title: 'Roots of decimals and fractions', exp: ['B2.2'], skill: 'rr-root', hard: true,
        body: '<p>Use the facts you know. ' + RT + '0.49 = 0.7 because 0.7 × 0.7 = 0.49. ' + RT + '(9/16) = 3/4 because you take the root of the top and of the bottom.</p>',
        watch: K.film([
          [T(['√0.49 = ?', 'think: √49 = 7']), 'Start with the whole-number fact: √49 = 7.'],
          [T(['0.7 × 0.7 = 0.49', '√0.49 = 0.7']), '0.7 × 0.7 = 0.49, so √0.49 = 0.7.'],
          [T(['√(9/16) = √9 / √16', '= 3/4']), 'For a fraction, root the top and the bottom.', 2400]
        ]),
        example: K.film([
          [T(['√0.64 = ?']), 'My turn. I will find √0.64.'],
          [T(['√64 = 8']), 'First I use the whole-number fact I know: √64 = 8.'],
          [T(['0.64 = 64/100', '√64 / √100 = 8/10']), 'Next I write 0.64 as 64 hundredths. I take the root of the top and of the bottom: 8/10.'],
          [T(['8/10 = 0.8']), 'So √0.64 = 0.8.'],
          [T(['0.8 × 0.8 = 0.64 ✓']), 'Last, I check by squaring: 0.8 × 0.8 = 0.64. <b>Use the whole-number fact, then check by squaring.</b>', 2600]
        ]),
        ways: [{ label: 'Check by squaring', html: '<p>Guess, then square to check. Is ' + RT + '0.36 = 0.06? 0.06 × 0.06 = 0.0036. Too small. Try 0.6: 0.6 × 0.6 = 0.36. Yes.</p>' },
          { label: 'As a fraction', html: '<p>0.49 = 49/100. ' + RT + '49 = 7 and ' + RT + '100 = 10, so the root is 7/10 = 0.7.</p>' }],
        key: '<p>Use the whole-number fact, then <b>check by squaring</b>.</p>',
        mistake: '<p>' + RT + '0.49 = 0.07. Squaring 0.07 gives 0.0049, so it cannot be right.</p>',
        check: [K.chk(C, 'rr-root', 3), K.mc('What is ' + RT + '0.81?', '0.9', ['0.09', '9', '0.405'], 'Which decimal times itself is 0.81? Think of ' + RT + '81.', '0.9 × 0.9 = 0.81.')] }
    ] },
    { id: 'estimate', title: 'Estimating square roots', sub: 'Squeeze a root between two perfect squares.', concepts: [
      { id: 'between', title: 'Between two whole numbers', exp: ['B1.3'], skill: 'rr-estimate',
        body: '<p>Most numbers are not perfect squares. Find the perfect squares on each side. ' + RT + '50 sits between ' + RT + '49 = 7 and ' + RT + '64 = 8.</p>',
        watch: K.film([
          [T(['√50 = ?']), 'Estimate √50.'],
          [T(['49 < 50 < 64']), 'Find the perfect squares on each side: 49 and 64.'],
          [F.rootLine(50), 'So √50 is between 7 and 8, and very close to 7.'],
          [F.rootLine(30), '√30: 25 < 30 < 36, so it is between 5 and 6, about 5.5.', 2400]
        ]),
        example: K.film([
          [T(['√75 = ?']), 'My turn. I will estimate √75.'],
          [T(['64 &lt; 75 &lt; 81']), 'First I find the perfect squares on each side: 64 and 81.'],
          [T(['√64 = 8', '√81 = 9']), 'Next I take their roots: 8 and 9.'],
          [F.rootLine(75), 'So √75 is <b>between 8 and 9</b>. 75 is a little nearer 81, so the root is just past halfway: about 8.7.', 2600]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Find a number whose root is between <b>7 and 8</b>, but not a perfect square.', goal: function (g) { var n = +g('rtn'); return n > 49 && n < 64; }, yes: 'Any number from 50 to 63 has a root between 7 and 8.' },
          { do: 'Now find the perfect square whose root is exactly <b>10</b>.', goal: function (g) { return g('rtn') === 100; }, yes: '√100 = 10.' }] }),
        key: '<p>Find the <b>perfect squares on each side</b>. The root sits between their roots.</p>',
        mistake: '<p>Saying ' + RT + '50 is between 25 and 26 by halving. Ask: "What is 25 × 25?"</p>',
        check: [K.chk(C, 'rr-estimate', 1), K.chk(C, 'rr-estimate', 1)] },
      { id: 'closer', title: 'One decimal place', exp: ['B1.3'], skill: 'rr-estimate', hard: true,
        body: '<p>Decide which perfect square the number is nearer to. Guess a decimal, square it, and adjust.</p>',
        watch: K.film([
          [F.rootLine(40), '√40: 36 < 40 < 49. 40 is much nearer 36, so the root is just above 6.'],
          [T(['6.3 × 6.3 = 39.69']), 'Try 6.3. Squared, it is 39.69: very close to 40.'],
          [T(['6.4 × 6.4 = 40.96']), '6.4 squared is 40.96: a bit further away.'],
          [T(['√40 ≈ 6.3']), 'So √40 ≈ 6.3.', 2400]
        ]),
        example: K.film([
          [F.rootLine(55), 'My turn. I will find √55 to one decimal place. 49 &lt; 55 &lt; 64, so the root is between 7 and 8, nearer 7.'],
          [T(['7.4 × 7.4 = 54.76']), 'I guess 7.4 and square it: 54.76. Just under 55.'],
          [T(['7.5 × 7.5 = 56.25']), 'I go up one tenth: 7.5 squared is 56.25. That is over 55, and further away.'],
          [T(['√55 ≈ 7.4']), 'So <b>√55 ≈ 7.4</b>. Guess, square, adjust.', 2400]
        ]),
        ways: [{ label: 'Guess and check', html: '<p>Guess, square, adjust. Too big? Go down a tenth. Too small? Go up. Two or three tries is enough.</p>' },
          { label: 'How far along?', html: '<p>40 is 4 of the 13 steps from 36 to 49. 4/13 is about 0.3, so ' + RT + '40 is about 6.3.</p>' }],
        key: '<p><b>Guess, square, adjust.</b></p>',
        mistake: '<p>Picking 6.5 every time as "halfway". Check: 6.5' + SQ + ' = 42.25, more than 40.</p>',
        check: [K.chk(C, 'rr-estimate', 2), K.chk(C, 'rr-estimate', 3)] }
    ] },
    { id: 'real', title: 'Rational and irrational numbers', sub: 'Decimals that stop or repeat, and ones that never do.', concepts: [
      { id: 'kinds', title: 'Rational or irrational?', exp: ['B1.2'], skill: 'rr-classify', hard: true,
        body: '<p>A <b>rational</b> number can be written as a fraction of integers. Its decimal ends (0.75) or repeats (0.333…). An <b>irrational</b> number\'s decimal never ends and never repeats, like ' + RT + '2 or π.</p>',
        watch: K.film([
          [T(['3/4 = 0.75']), '3/4 is 0.75. The decimal ends: rational.'],
          [T(['1/3 = 0.333…']), '1/3 is 0.333… It goes on, but it repeats: still rational.'],
          [F.diagonal(), 'The diagonal of a 1 by 1 square is √2 = 1.414 213… It never ends and never repeats: irrational.'],
          [T(['√49 = 7', 'rational']), 'Careful: √49 = 7. Work out roots first.', 2400]
        ]),
        example: K.film([
          [T(['2/9,  √7,  √36']), 'My turn. I will sort these numbers: rational or irrational?'],
          [T(['2/9 = 0.222…']), 'First 2/9. I divide: 0.222… The 2 repeats, so it is rational.'],
          [T(['√36 = 6']), 'Next √36. I work out the root first: 6. A whole number is rational.'],
          [T(['√7 = 2.645 751…']), 'Then √7. 7 is not a perfect square, so its decimal never ends and never repeats: irrational.'],
          [T(['rational: 2/9, √36', 'irrational: √7']), 'Ends or repeats: <b>rational</b>. Never ends, never repeats: <b>irrational</b>.', 2600]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Tap a number that is <b>irrational</b>.', goal: function (g) { return /irrational/i.test(g.text('#rsout')) && !/not/.test(g.text('#rsout').split('.')[0]); }, yes: 'Yes. Its decimal never ends and never repeats.' },
          { do: 'Tap the square root that is <b>not</b> irrational.', goal: function (g) { return /√49/.test(g.text('#rsout')); }, yes: '√49 = 7, a natural number.' }] }),
        ways: [{ label: 'Can you write a fraction?', html: '<p>If you can write it as integer ÷ integer, it is rational. 0.25 = 1/4. &minus;6 = &minus;6/1. Nobody can do that for π.</p>' },
          { label: 'Perfect square test', html: '<p>For a root: is the number under ' + RT + ' a perfect square? ' + RT + '36 yes, rational. ' + RT + '35 no, irrational.</p>' }],
        key: '<p>Ends or repeats → <b>rational</b>. Never ends, never repeats → <b>irrational</b>.</p>',
        mistake: '<p>Calling 0.333… irrational because it goes on forever. It repeats, so it is rational (1/3).</p>',
        check: [K.chk(C, 'rr-classify', 1), K.chk(C, 'rr-classify', 2)] },
      { id: 'family', title: 'The real number family', exp: ['B1.2'], skill: 'rr-classify',
        body: '<p>Natural numbers sit inside whole numbers, which sit inside integers, which sit inside rational numbers. Rational and irrational numbers together make the <b>real numbers</b>.</p>',
        watch: K.film([
          [F.nested('nat'), 'Natural numbers: 1, 2, 3, the counting numbers.'],
          [F.nested('whole'), 'Add 0 and you have the whole numbers.'],
          [F.nested('int'), 'Add the negatives: integers.'],
          [F.nested('rat'), 'Add fractions and decimals that end or repeat: rational numbers.'],
          [F.nested('irr'), 'Beside them, the irrational numbers. Together: the real numbers.', 2400]
        ]),
        example: K.film([
          [F.nested('nat'), 'My turn. I will find every set that 12 belongs to. 12 is a counting number, so it is natural.'],
          [F.nested('int'), 'Natural numbers sit inside the whole numbers and the integers, so 12 is in those too.'],
          [F.nested('rat'), 'Integers sit inside the rational numbers: 12 = 12/1. So 12 is rational, and real.'],
          [F.nested('rat'), 'Now −2.5. It is negative and not whole, so it is not natural, whole or an integer. It is −5/2: rational.'],
          [F.nested('irr'), 'I check: each box sits inside the next, and every number here is real. 12 is in five sets. −2.5 is in two.', 2800]
        ]),
        key: '<p>Each box sits <b>inside</b> the next. Every number here is real.</p>',
        mistake: '<p>Thinking 0 is a natural number. Natural numbers start at 1; 0 is whole.</p>',
        check: [K.mc('&minus;3 belongs to which smallest set?', 'Integers', ['Whole numbers', 'Natural numbers', 'Irrational numbers'], 'Whole numbers are never negative.', '&minus;3 is an integer, not a whole number.'),
          K.chk(C, 'rr-classify', 3)] }
    ] },
    { id: 'order', title: 'Comparing real numbers', sub: 'Roots, fractions and decimals on one line.', concepts: [
      { id: 'line', title: 'Change to decimals', exp: ['B1.2'], skill: 'rr-order',
        body: '<p>To compare roots, fractions and decimals, change them all to decimals with three places. Then place them on a number line.</p>',
        watch: K.film([
          [T(['√10, 3.1, π, 19/6']), 'Order these from least to greatest.'],
          [T(['√10 ≈ 3.162', '3.1 = 3.100', 'π ≈ 3.142', '19/6 ≈ 3.167']), 'Change each to a decimal with three places.'],
          [F.realLine(3, 3.3, [{ v: 3.1, t: '3.1' }, { v: Math.PI, t: 'π' }, { v: Math.sqrt(10), t: '√10' }, { v: 19 / 6, t: '19/6' }]), 'On the line: 3.1, π, √10, 19/6.', 2600]
        ]),
        example: K.film([
          [T(['7/3,  2.3,  √5,  2.27']), 'My turn. I will order these from least to greatest.'],
          [T(['7/3 ≈ 2.333', '2.3 = 2.300', '√5 ≈ 2.236', '2.27 = 2.270']), 'First I change each one to a decimal with three places.'],
          [T(['2.236 &lt; 2.270', '&lt; 2.300 &lt; 2.333']), 'Next I compare the decimals, place by place.'],
          [F.realLine(2, 2.5, [{ v: Math.sqrt(5), t: '√5' }, { v: 2.27, t: '2.27' }, { v: 2.3, t: '2.3' }, { v: 7 / 3, t: '7/3' }]), 'So the order is √5, 2.27, 2.3, 7/3. <b>Change everything to decimals, then compare.</b>', 2800]
        ]),
        try: K.lab({
          ctrls: [{ id: 'n', label: 'Root of', min: 2, max: 40, value: 12, fmt: function (x) { return '√' + x; } }, { id: 'd', label: 'Decimal', min: 10, max: 60, value: 30, fmt: function (x) { return (x / 10).toFixed(1); } }],
          draw: function (v) {
            var r = Math.sqrt(v.n), d = v.d / 10, lo = Math.floor(Math.min(r, d)), hi = Math.max(lo + 1, Math.ceil(Math.max(r, d)));
            return { fig: F.realLine(lo, hi, [{ v: r, t: '√' + v.n }, { v: d, t: d.toFixed(1) }]),
              out: '√' + v.n + ' ≈ ' + r.toFixed(3) + '. ' + (Math.abs(r - d) < 1e-9 ? 'They are equal.' : '<b>' + (r > d ? '√' + v.n + ' > ' + d.toFixed(1) : d.toFixed(1) + ' > √' + v.n) + '</b>') };
          },
          tasks: [{ do: 'Set the decimal to <b>4.5</b>. Then find the biggest root that is still <b>less</b> than 4.5.', goal: function (v) { return v.d === 45 && v.n === 20; }, yes: '√20 ≈ 4.472 < 4.5, but √21 ≈ 4.583 > 4.5.' },
            { do: 'Set the root to <b>√30</b>. Then move the decimal to the tenth closest to it.', goal: function (v) { return v.n === 30 && v.d === 55; }, yes: '√30 ≈ 5.477, so 5.5 is the closest tenth.' }]
        }),
        key: '<p>Change everything to <b>decimals with three places</b>, then compare.</p>',
        mistake: '<p>Comparing the number under the root instead of the root: ' + RT + '20 vs 4.5, thinking 20 &gt; 4.5.</p>',
        check: [K.chk(C, 'rr-order', 1), K.chk(C, 'rr-order', 2)] },
      { id: 'squareit', title: 'Compare by squaring', exp: ['B1.2'], skill: 'rr-order', hard: true,
        body: '<p>To compare a root with a positive decimal, square the decimal. ' + RT + '20 or 4.5? 4.5' + SQ + ' = 20.25, which is more than 20, so 4.5 is bigger.</p>',
        watch: K.film([
          [T(['√20 or 4.5?']), 'Which is bigger?'],
          [T(['(√20)² = 20', '4.5² = 20.25']), 'Square both. Squaring a root just removes it.'],
          [T(['20 < 20.25', 'so √20 < 4.5']), 'The bigger square comes from the bigger number.', 2400]
        ]),
        example: K.film([
          [T(['√45 or 6.7?']), 'My turn. I will find which is bigger: √45 or 6.7.'],
          [T(['(√45)² = 45']), 'First I square the root. Squaring a root just removes it: 45.'],
          [T(['6.7² = 44.89']), 'Next I square the decimal: 6.7 × 6.7 = 44.89.'],
          [T(['45 > 44.89', 'so √45 > 6.7']), 'Then I compare. 45 is bigger, so <b>√45 is bigger</b>. Bigger square, bigger number.', 2600]
        ]),
        ways: [{ label: 'Use the squeeze', html: '<p>16 &lt; 20 &lt; 25, so ' + RT + '20 is between 4 and 5. 20 is a little closer to 16 than to 25, so ' + RT + '20 is a bit under 4.5.</p>' }],
        key: '<p>For positive numbers: <b>bigger square, bigger number</b>.</p>',
        mistake: '<p>Using this with negative numbers. (&minus;5)' + SQ + ' = 25, but &minus;5 is less than 4.</p>',
        check: [K.mc('Which is greater?', RT + '30', ['5.4'], 'Square 5.4 and compare with 30.', '5.4' + SQ + ' = 29.16 < 30, so ' + RT + '30 is greater.'), K.chk(C, 'rr-order', 3)] }
    ] }
  ]);
})();