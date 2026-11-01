(function () {
  var K = K8, A = Atlas, R = A.R, F = K.fx('big-small'), C = 'big-small', T = K.txt;
  var P = function (e) { return '10<sup>' + String(e).replace('-', '&minus;') + '</sup>'; };

  K.lessons(C, [
    { id: 'powers', title: 'Powers of ten', sub: 'Each step is ten times bigger or smaller.', concepts: [
      { id: 'pos', title: 'Positive powers of ten', exp: ['B1.1'], skill: 'bs-pow',
        body: '<p>10<sup>3</sup> means 10 × 10 × 10 = 1000. The exponent tells you how many tens are multiplied, and also how many zeros follow the 1.</p>',
        watch: K.film([
          [T(['10¹ = 10']), 'One ten: 10.'],
          [T(['10² = 10 × 10', '= 100']), 'Two tens multiplied: 100. Two zeros.'],
          [T(['10³ = 10 × 10 × 10', '= 1000']), 'Three tens: 1000. Three zeros.'],
          [F.ladder(), 'Each step up the ladder is ten times bigger.', 2400]
        ]),
        example: K.film([
          [T(['10⁴ = ?']), 'My turn. I will write 10⁴ as a number.'],
          [T(['10⁴ = 10 × 10 × 10 × 10']), 'First I write it out. The 4 means four tens multiplied together.'],
          [T(['10 × 10 = 100', '100 × 10 = 1000', '1000 × 10 = 10 000']), 'Next I multiply step by step: 100, then 1000, then 10 000.'],
          [T(['10⁴ = 10 000', '1 and four zeros ✓']), 'I check by counting the zeros: four. <b>10ⁿ is 1 followed by n zeros.</b>', 2400]
        ]),
        key: '<p>10<sup>n</sup> is <b>1 followed by n zeros</b>.</p>',
        mistake: '<p>Reading 10<sup>3</sup> as 10 × 3 = 30. Have the child write out the tens being multiplied.</p>',
        check: [K.chk(C, 'bs-pow', 1)] },
      { id: 'neg', title: 'Zero and negative powers', exp: ['B1.1'], skill: 'bs-pow', hard: true,
        body: '<p>Going down the ladder divides by 10 each step. So 10<sup>0</sup> = 1, 10<sup>&minus;1</sup> = 0.1, 10<sup>&minus;2</sup> = 0.01. A negative exponent makes a <b>small</b> number, never a negative one.</p>',
        watch: K.film([
          [T(['10² = 100', '10¹ = 10']), 'Start at 100. Step down: divide by 10 to get 10.'],
          [T(['10⁰ = 1']), 'Step down again: 1. So 10⁰ = 1.'],
          [T(['10⁻¹ = 0.1', '10⁻² = 0.01']), 'Keep going: 0.1, then 0.01. Still positive, just smaller.'],
          [T(['10⁻⁵ = 0.000 01']), 'The exponent −5 puts the 1 in the fifth place after the point.', 2400]
        ]),
        example: K.film([
          [T(['10⁻³ = ?']), 'My turn. I will write 10⁻³ as a decimal.'],
          [T(['10⁰ = 1']), 'First I start at 10⁰ = 1.'],
          [T(['10⁻¹ = 0.1', '10⁻² = 0.01', '10⁻³ = 0.001']), 'Next I step down three times, dividing by 10 each time: 0.1, then 0.01, then 0.001.'],
          [T(['10⁻³ = 0.001']), 'I check: the 1 is in the third place after the point. <b>10⁻ⁿ has its 1 in the n-th place after the point.</b>', 2600]
        ]),
        ways: [{ label: 'Count the places', html: '<p>10<sup>&minus;3</sup> = 0.001: the 1 is in the <b>3rd</b> place after the decimal point. The exponent tells you which place.</p>' },
          { label: 'As fractions', html: '<p>10<sup>&minus;2</sup> = 1/100 = 0.01. A negative exponent means "one over": 1 ÷ 10<sup>2</sup>.</p>' }],
        key: '<p>10<sup>0</sup> = 1. 10<sup>&minus;n</sup> has its 1 in the <b>n-th place after the point</b>.</p>',
        mistake: '<p>Thinking 10<sup>&minus;2</sup> is &minus;100. It is 0.01: small, but above zero.</p>',
        check: [K.chk(C, 'bs-pow', 2), K.chk(C, 'bs-pow', 3)] }
    ] },
    { id: 'shift', title: 'Times and divide by 10, 100, 1000', sub: 'The digits move; the point stays.', concepts: [
      { id: 'times', title: 'Multiply: digits move left', exp: ['B2.3'], skill: 'bs-shift',
        body: '<p>Multiplying by 10 moves every digit <b>1 place left</b>. By 100, 2 places. By 1000, 3 places. The number of zeros tells you how many places.</p>',
        watch: K.film([
          [F.slide('3.47', 1), '3.47 × 10: every digit moves 1 place left. 34.7.'],
          [F.slide('3.47', 2), '3.47 × 100: 2 places left. 347.'],
          [F.slide('3.47', 3), '3.47 × 1000: 3 places left. Fill the empty ones place with 0: 3470.', 2400]
        ]),
        example: K.film([
          [T(['5.08 × 100']), 'My turn. I will multiply 5.08 by 100.'],
          [T(['× 100 → 2 places left']), 'First I count the zeros in 100: two. So every digit moves 2 places left.'],
          [F.slide('5.08', 2), 'Next I move the digits: 5.08 becomes 508.'],
          [T(['5.08 × 100 = 508', 'about 5 × 100 = 500 ✓']), 'I check with an estimate: about 5 × 100 = 500. <b>× 10, 100, 1000: digits move 1, 2, 3 places left.</b>', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [{ do: 'Choose <b>× 100</b> and watch 25.6 become 2560.', goal: function (g) { return g('sho') === 2; }, yes: 'Every digit moved 2 places left.' },
          { do: 'Type <b>0.75</b> and choose <b>× 1000</b>.', goal: function (g) { return String(g('shn')) === '0.75' && g('sho') === 3; }, yes: '0.75 × 1000 = 750.' }] }),
        key: '<p><b>× 10, 100, 1000</b>: digits move <b>1, 2, 3 places left</b>.</p>',
        mistake: '<p>"Add a zero" to multiply by 10. 2.5 × 10 is 25, not 2.50.</p>',
        check: [K.chk(C, 'bs-shift', 1), K.chk(C, 'bs-shift', 2)] },
      { id: 'divide', title: 'Divide: digits move right', exp: ['B2.3'], skill: 'bs-shift',
        body: '<p>Dividing moves every digit to the <b>right</b>. Fill empty places with zeros. Multiplying by 0.1 is the same as dividing by 10.</p>',
        watch: K.film([
          [F.slide('4.5', -1), '4.5 ÷ 10: 1 place right. 0.45.'],
          [F.slide('4.5', -2), '4.5 ÷ 100: 2 places right. Put a 0 in the tenths: 0.045.'],
          [T(['× 0.1 is ÷ 10', '× 0.01 is ÷ 100']), 'Multiplying by 0.1 does the same as dividing by 10.', 2400]
        ]),
        example: K.film([
          [T(['6.2 ÷ 100']), 'My turn. I will divide 6.2 by 100.'],
          [T(['÷ 100 → 2 places right']), 'First I count the zeros: two. So every digit moves 2 places right.'],
          [F.slide('6.2', -2), 'Next I move the digits. The 6 lands in the hundredths, so I put a 0 in the tenths: 0.062.'],
          [T(['6.2 ÷ 100 = 0.062', 'smaller than 6.2 ✓']), 'I check: dividing made it smaller, as it should. <b>÷ 10, 100, 1000: digits move 1, 2, 3 places right.</b>', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [{ do: 'Choose <b>÷ 1000</b>. Where do the digits go?', goal: function (g) { return g('sho') === -3; }, yes: 'Every digit moved 3 places right.' }] }),
        key: '<p><b>÷ 10, 100, 1000</b>: digits move <b>1, 2, 3 places right</b>.</p>',
        mistake: '<p>Moving the wrong way. Ask: "Should the answer be bigger or smaller?"</p>',
        check: [K.chk(C, 'bs-shift', 3)] }
    ] },
    { id: 'sci', title: 'Scientific notation', sub: 'A short way to write very big and very small numbers.', concepts: [
      { id: 'parts', title: 'The two parts', exp: ['B1.1'], skill: 'bs-sci-big',
        body: '<p>Scientific notation writes a number as <b>a × 10<sup>n</sup></b>. The first part is at least 1 and less than 10. The power of ten says how far to move the point.</p>',
        watch: K.film([
          [F.anatomy(), '3.8 × 10⁷. The first part, 3.8, is between 1 and 10.'],
          [F.anatomy(), 'The power, 10⁷, moves the point 7 places right: 38 000 000.', 2400]
        ]),
        example: K.film([
          [T(['6.05 × 10⁴']), 'My turn. I will read 6.05 × 10⁴ and write it out in full.'],
          [T(['first part: 6.05', '1 ≤ 6.05 &lt; 10 ✓']), 'First I check the first part: 6.05 is between 1 and 10, so this is scientific notation.'],
          [T(['10⁴ → point moves 4 right']), 'Next the power: 10⁴ moves the point 4 places right.'],
          [T(['6.05 × 10⁴ = 60 500']), 'So 6.05 × 10⁴ = <b>60 500</b>. A first part from 1 up to 10, then × 10ⁿ.', 2600]
        ]),
        key: '<p><b>1 ≤ a &lt; 10</b>, then × 10<sup>n</sup>.</p>',
        mistake: '<p>Writing 38 × 10<sup>6</sup>. It is equal, but 38 is not between 1 and 10, so it is not scientific notation.</p>',
        check: [K.mc('Which is written in scientific notation?', '4.2 × 10⁵', ['42 × 10⁴', '0.42 × 10⁶', '4.2 + 10⁵'], 'The first part must be at least 1 and less than 10.', 'Only 4.2 × 10⁵ has a first part between 1 and 10.')] },
      { id: 'big', title: 'Big numbers', exp: ['B1.1'], skill: 'bs-sci-big',
        body: '<p>Hop the decimal point left until one non-zero digit is in front of it. The number of hops is the (positive) power.</p>',
        watch: K.film([
          [F.hops('5600000'), '5 600 000: the point hops 6 places left to sit after the 5.'],
          [T(['5 600 000 = 5.6 × 10⁶']), 'So 5 600 000 = 5.6 × 10⁶.', 2200]
        ]),
        example: K.film([
          [F.hops('47300000'), 'My turn. I will write 47 300 000 in scientific notation. The point must sit just after the first digit, 4.'],
          [F.hops('47300000'), 'I count the hops left: 7 places.'],
          [T(['4.73 × 10⁷']), 'The first part is 4.73. Seven hops left gives a power of 7: 4.73 × 10⁷.'],
          [T(['4.73 × 10 000 000', '= 47 300 000 ✓']), 'I check by writing it back out. <b>Big number: count the hops left. Positive power.</b>', 2600]
        ]),
        key: '<p>Big number: <b>count the hops left</b> → positive power.</p>',
        mistake: '<p>Counting the zeros only (5) instead of the hops (6).</p>',
        check: [K.chk(C, 'bs-sci-big', 1), K.chk(C, 'bs-sci-big', 2)] },
      { id: 'small', title: 'Small numbers', exp: ['B1.1'], skill: 'bs-sci-small', hard: true,
        body: '<p>For a number less than 1, hop the point <b>right</b> to just after the first non-zero digit. The power is negative.</p>',
        watch: K.film([
          [F.hops('0.00007'), '0.000 07: the point hops 5 places right to sit after the 7.'],
          [T(['0.000 07 = 7 × 10⁻⁵']), 'So it is 7 × 10⁻⁵.', 2200]
        ]),
        example: K.film([
          [F.hops('0.0032'), 'My turn. I will write 0.0032 in scientific notation. The point must sit just after the first digit that is not 0: the 3.'],
          [F.hops('0.0032'), 'I count the hops right: 3 places.'],
          [T(['3.2 × 10⁻³']), 'The first part is 3.2. Hops right give a negative power: 3.2 × 10⁻³.'],
          [T(['3.2 × 0.001 = 0.0032 ✓']), 'I check: 3.2 × 0.001 = 0.0032. <b>Small number: hops right, negative power.</b>', 2600]
        ]),
        try: K.reuse(C, 1, { tasks: [{ do: 'Set the size to <b>2 × 10<sup>&minus;6</sup></b>, about the size of a bacterium.', goal: function (g) { return g('sca') === 20 && g('sce') === -6; }, yes: '0.000 002 m: two micrometres.' },
          { do: 'Now make something huge: <b>1.5 × 10<sup>8</sup></b>.', goal: function (g) { return g('sca') === 15 && g('sce') === 8; }, yes: '150 000 000 m = 150 000 km. Light travels that far in half a second.' }] }),
        ways: [{ label: 'Check by moving back', html: '<p>To check 7 × 10<sup>&minus;5</sup>, move the point 5 places left from 7: 0.000 07. It matches.</p>' }],
        key: '<p>Small number: <b>hops right</b> → negative power.</p>',
        mistake: '<p>Giving a positive power for a small number. Ask: "Is the number bigger or smaller than 1?"</p>',
        check: [K.chk(C, 'bs-sci-small', 1), K.chk(C, 'bs-sci-small', 2), K.chk(C, 'bs-sci-small', 3)] }
    ] },
    { id: 'prefix', title: 'Metric prefixes', sub: 'From pico to tera.', concepts: [
      { id: 'stairs', title: 'The prefix stairs', exp: ['E2.1', 'B1.1'], skill: 'bs-prefix', hard: true,
        body: '<p>Each prefix is a power of ten. Kilo is 10<sup>3</sup>, mega 10<sup>6</sup>, giga 10<sup>9</sup>. Milli is 10<sup>&minus;3</sup>, micro 10<sup>&minus;6</sup>, nano 10<sup>&minus;9</sup>.</p>',
        watch: K.film([
          [F.prefixStairs(), 'Each step on the stairs is a factor of 1000.'],
          [T(['3 GB = 3 × 1000 MB', '= 3000 MB']), 'Going to a smaller unit means more of them: multiply.'],
          [T(['500 mm = 500 ÷ 1000 m', '= 0.5 m']), 'Going to a bigger unit means fewer: divide.', 2400]
        ]),
        example: K.film([
          [F.prefixStairs(), 'My turn. I will change 2.5 kg to grams. First I find both on the stairs: kilo is one step above the base unit, the gram.'],
          [T(['kg → g: smaller unit', '→ multiply']), 'Grams are smaller, so I will need more of them. I multiply.'],
          [T(['2.5 × 1000 = 2500 g']), 'One step is 1000, so 2.5 × 1000 = 2500 g.'],
          [T(['2500 ÷ 1000 = 2.5 kg ✓']), 'I check by going back up: 2500 ÷ 1000 = 2.5 kg. <b>Smaller unit: multiply. Bigger unit: divide.</b>', 2600]
        ]),
        try: K.reuse(C, 2, { tasks: [{ do: 'Change it to convert <b>4 kilo</b> into <b>milli</b>.', goal: function (g) { return g('pcf') === 3 && g('pct') === -3 && String(g('pcv')).replace(/\s/g, '') === '4'; }, yes: 'Kilo to milli is 2 steps down (10⁶), so 4 kilo = 4 000 000 milli.' }] }),
        ways: [{ label: 'Smaller unit, more of them', html: '<p>A kilometre is long, so you need only a few. A millimetre is tiny, so you need lots. Smaller unit → bigger number.</p>' }],
        key: '<p>Smaller unit → <b>multiply</b>. Bigger unit → <b>divide</b>.</p>',
        mistake: '<p>Multiplying when going to a bigger unit. Ask: "Should the number of units go up or down?"</p>',
        check: [K.chk(C, 'bs-prefix', 1), K.chk(C, 'bs-prefix', 2)] },
      { id: 'real', title: 'Prefixes in real life', exp: ['E2.1', 'B1.1'], skill: 'bs-prefix',
        body: '<p>You see prefixes every day: a 5 <b>k</b>m run, a 128 <b>G</b>B phone, a 2 <b>m</b>m raindrop. Same prefix, same power of ten, whatever the unit.</p>',
        watch: K.film([
          [T(['128 GB phone', '= 128 000 MB']), 'Giga to mega is one step down the stairs: times 1000.'],
          [T(['3 MW turbine', '= 3 000 000 W']), 'Mega to the base unit is two steps: times 1 000 000.'],
          [T(['250 µm hair', '= 0.25 mm']), 'Micro to milli is one step up: divide by 1000.', 2400]
        ]),
        example: K.film([
          [T(['4.7 GB movie', 'in kB?']), 'My turn. A movie file is 4.7 GB. I will write its size in kilobytes.'],
          [T(['giga → mega → kilo', '2 steps down']), 'First I count the steps on the stairs: giga to mega, then mega to kilo. Two steps down.'],
          [T(['× 1000 × 1000', '= × 1 000 000']), 'Each step down is × 1000. Two steps: × 1 000 000.'],
          [T(['4.7 × 1 000 000', '= 4 700 000 kB']), 'So the movie is <b>4 700 000 kB</b>. Count the steps between prefixes. Each step is 1000.', 2600]
        ]),
        key: '<p>Count the steps between prefixes. Each step is <b>1000</b>.</p>',
        mistake: '<p>Treating each step as 10 instead of 1000.</p>',
        check: [K.chk(C, 'bs-prefix', 2), K.chk(C, 'bs-prefix', 3)] }
    ] },
    { id: 'compare', title: 'Compare and order', sub: 'Look at the power first.', concepts: [
      { id: 'power', title: 'Bigger power, bigger number', exp: ['B1.1'], skill: 'bs-compare',
        body: '<p>To compare numbers in scientific notation, compare the <b>powers</b> first. Only if the powers match do you compare the first parts.</p>',
        watch: K.film([
          [F.compareLine([{ a: 4.5, e: 6, t: '4.5 × 10⁶' }, { a: 9.1, e: 5, t: '9.1 × 10⁵' }]), '4.5 × 10⁶ or 9.1 × 10⁵? The power 6 beats 5, even though 9.1 is bigger than 4.5.'],
          [T(['4 500 000 > 910 000']), 'Written out: 4 500 000 is bigger than 910 000.', 2400]
        ]),
        example: K.film([
          [F.compareLine([{ a: 2.3, e: 8, t: '2.3 × 10⁸' }, { a: 8.7, e: 7, t: '8.7 × 10⁷' }]), 'My turn. I will find which is bigger: 2.3 × 10⁸ or 8.7 × 10⁷.'],
          [T(['powers: 8 and 7']), 'First I compare the powers. 8 is bigger than 7.'],
          [T(['2.3 × 10⁸ is bigger']), 'So 2.3 × 10⁸ is bigger, even though 8.7 is more than 2.3.'],
          [T(['230 000 000 > 87 000 000 ✓']), 'I check by writing both out: 230 000 000 is more than 87 000 000. <b>Compare the powers first, then the first parts.</b>', 2800]
        ]),
        key: '<p>Compare the <b>powers</b> first, then the first parts.</p>',
        mistake: '<p>Comparing 9.1 with 4.5 and ignoring the powers.</p>',
        check: [K.chk(C, 'bs-compare', 1), K.chk(C, 'bs-compare', 2)] },
      { id: 'beat', title: 'Beat the number', exp: ['B1.1'], skill: 'bs-compare', hard: true,
        body: '<p>Build your own number and place it next to <b>5.2 × 10⁶</b>. Watch how the power moves it far more than the first part does.</p>',
        watch: K.film([
          [F.compareLine([{ a: 5.2, e: 6, t: '5.2 × 10⁶' }, { a: 1.1, e: 7, t: '1.1 × 10⁷' }]), '1.1 × 10⁷ is bigger: power 7 beats power 6.'],
          [F.compareLine([{ a: 5.2, e: 6, t: '5.2 × 10⁶' }, { a: 3.8, e: 6, t: '3.8 × 10⁶' }]), 'Same power, so compare 5.2 and 3.8. 5.2 × 10⁶ is bigger.', 2400]
        ]),
        example: K.film([
          [T(['6.1 × 10⁻⁴', '9.5 × 10⁻⁵', '2.4 × 10⁻⁴']), 'My turn. I will order these small numbers from least to greatest.'],
          [T(['powers: −4, −5, −4', '−5 is the smallest']), 'First I compare the powers. −5 is less than −4, so 9.5 × 10⁻⁵ is the smallest.'],
          [T(['same power −4:', '2.4 &lt; 6.1']), 'Next, two numbers share the power −4. I compare their first parts: 2.4 is less than 6.1.'],
          [T(['9.5 × 10⁻⁵ &lt; 2.4 × 10⁻⁴', '&lt; 6.1 × 10⁻⁴']), 'So the order is 9.5 × 10⁻⁵, then 2.4 × 10⁻⁴, then 6.1 × 10⁻⁴.'],
          [T(['0.000 095 &lt; 0.000 24', '&lt; 0.000 61 ✓']), 'I check by writing them out. <b>Compare the powers first, then the first parts.</b>', 2800]
        ]),
        try: K.lab({
          ctrls: [{ id: 'a', label: 'First part', min: 10, max: 99, value: 30, fmt: function (x) { return (x / 10).toFixed(1); } }, { id: 'e', label: 'Power of ten', min: 3, max: 9, value: 5 }],
          draw: function (v) {
            var a = v.a / 10, mine = a * Math.pow(10, v.e), rel = mine > 5.2e6 ? 'bigger than' : mine < 5.2e6 ? 'smaller than' : 'equal to';
            return { fig: F.compareLine([{ a: 5.2, e: 6, t: '5.2 × 10⁶' }, { a: a, e: v.e, t: a.toFixed(1) + ' × 10' + '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(v.e) }]),
              out: '<span class="big">' + a.toFixed(1) + ' &times; 10<sup>' + v.e + '</sup> is ' + rel + ' 5.2 &times; 10<sup>6</sup></span>' };
          },
          tasks: [{ do: 'Make a number <b>bigger</b> than 5.2 × 10⁶ using a first part <b>smaller than 2</b>.', goal: function (v) { return v.a < 20 && v.a * Math.pow(10, v.e - 1) > 5.2e6; }, yes: 'Yes. A bigger power wins, even with a small first part.' },
            { do: 'Now use power <b>6</b> and make a number that is <b>smaller</b> than 5.2 × 10⁶.', goal: function (v) { return v.e === 6 && v.a < 52; }, yes: 'Yes. Same power, so the smaller first part is the smaller number.' }]
        }),
        ways: [{ label: 'Write them out', html: '<p>1.5 × 10⁷ = 15 000 000 and 5.2 × 10⁶ = 5 200 000. Written out, the first has one more digit, so it is bigger.</p>' },
          { label: 'Count the digits', html: '<p>For big numbers, the power is one less than the number of digits before the point. More digits means a bigger number.</p>' }],
        key: '<p>Compare the <b>powers</b> first, then the first parts.</p>',
        mistake: '<p>Changing only the first part and expecting it to beat a higher power.</p>',
        check: [K.chk(C, 'bs-compare', 2), K.chk(C, 'bs-compare', 3)] }
    ] }
  ]);
})();
