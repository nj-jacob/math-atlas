(function () {
  var K = K8, A = Atlas, F = K.fx('integers'), C = 'integers', T = K.txt;
  function mat(st) { return F.counters(st.pos, st.neg, Math.min(st.pos, st.neg)); }

  K.lessons(C, [
    { id: 'zero', title: 'Integers and zero pairs', sub: 'Positive, negative, and the pair that makes zero.', concepts: [
      { id: 'what', title: 'What integers are', exp: ['B1.1'], skill: 'int-add',
        body: '<p><b>Integers</b> are the whole numbers and their opposites: …, −3, −2, −1, 0, 1, 2, 3, …. In a Canadian winter you read them off the thermometer.</p>',
        watch: K.film([
          [F.thermo(5), 'A mild day: 5°C. Five degrees above zero.'],
          [F.thermo(-8), 'A cold morning: −8°C. Eight degrees below zero.'],
          [F.thermo(-8, 5), 'From −8 up to 5 is a rise of 13 degrees: 8 to reach zero, then 5 more.', 2600]
        ]),
        key: '<p>Every integer has an <b>opposite</b> the same distance from 0: 5 and −5.</p>',
        mistake: '<p>Thinking −8 is bigger than −3 because 8 is bigger than 3. On the thermometer, −8 is colder, so it is smaller.</p>',
        check: [K.mc('Which is colder?', '−12°C', ['−4°C', '0°C', '3°C'], 'Further below zero is colder.', '−12 is furthest below zero.'),
          K.mc('What is the opposite of −7?', '7', ['−7', '0', '1/7'], 'The opposite is the same distance from 0 on the other side.', '−7 and 7 are both 7 away from 0.')] },
      { id: 'pairs', title: 'Zero pairs', exp: ['B2.4'], skill: 'int-add', hard: true,
        body: '<p>A yellow <b>+</b> counter is +1. A red <b>−</b> counter is −1. One of each makes a <b>zero pair</b>, because +1 + (−1) = 0. Adding or removing zero pairs never changes a number.</p>',
        watch: K.film([
          [F.counters(5, 2, 0), '5 positive and 2 negative counters. What number do they show?'],
          [F.counters(5, 2, 2), 'Match each negative with a positive. Two zero pairs, each worth 0.'],
          [F.counters(3, 0, 0), 'Take them away. 3 positive counters are left: +3.'],
          [F.counters(6, 3, 3), 'Add three zero pairs: it still shows +3. Zero pairs never change the value.', 2600]
        ]),
        try: K.mat({ start: { pos: 2, neg: 0 }, draw: mat, tasks: [
          { do: 'Make the mat show <b>−4</b>.', goal: function (s) { return s.val === -4; }, yes: 'Four more negatives than positives: −4.' },
          { do: 'Now show <b>−4</b> again, using <b>exactly 10</b> counters.', goal: function (s) { return s.val === -4 && s.n === 10; }, yes: '3 positives and 7 negatives: 3 zero pairs and 4 negatives left.' },
          { do: 'Show <b>0</b> using <b>8</b> counters.', goal: function (s) { return s.val === 0 && s.n === 8; }, yes: 'Four zero pairs: 0.' }] }),
        ways: [{ label: 'Money', html: '<p>A + counter is a $1 coin you have. A − counter is $1 you owe. Have $5 and owe $2, and you are really worth $3.</p>' },
          { label: 'Steps', html: '<p>Take 5 steps forward and 2 steps back. You end up 3 steps forward. Each forward-and-back pair gets you nowhere.</p>' }],
        key: '<p>+1 and −1 make a <b>zero pair</b>. Cancel the pairs, count what is left.</p>',
        mistake: '<p>Adding the counters together (5 + 2 = 7) instead of cancelling pairs. Ask: "What does one + and one − make?"</p>',
        check: [K.num('What number do 3 positive and 7 negative counters show?', -4, 'Cancel the zero pairs, then count what is left.', '3 zero pairs cancel. 4 negatives are left: −4.', { show: '−4' }),
          K.num('What number do 9 positive and 4 negative counters show?', 5, 'Cancel the zero pairs, then count what is left.', '4 zero pairs cancel. 5 positives are left: 5.')] }
    ] },
    { id: 'add', title: 'Adding integers', sub: 'Move right for positive, left for negative.', concepts: [
      { id: 'line', title: 'Adding on the number line', exp: ['B2.4'], skill: 'int-add',
        body: '<p>Start at the first number. Adding a positive moves you <b>right</b>. Adding a negative moves you <b>left</b>.</p>',
        watch: K.film([
          [F.jump(-7, 4, -10, 5), '(−7) + 4: start at −7 and move 4 right. You land on −3.'],
          [F.jump(2, -6, -10, 5), '2 + (−6): start at 2 and move 6 left. You land on −4.'],
          [F.jump(-3, -5, -10, 5), '(−3) + (−5): start at −3, move 5 more left. −8.', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Keep <b>add</b>. Set it to <b>(−6) + (−5)</b>.', goal: function (g) { return g('iaa') === -6 && g('iab') === -5 && g('iop') === '+'; }, yes: 'Both move left: −11.' },
          { do: 'Find a sum with a positive and a negative that equals <b>−3</b>.', goal: function (g) { var a = g('iaa'), b = g('iab'); return g('iop') === '+' && a * b < 0 && a + b === -3; }, yes: 'Different signs: subtract the sizes and keep the sign of the bigger one.' }] }),
        key: '<p>Add a positive: <b>right</b>. Add a negative: <b>left</b>.</p>',
        mistake: '<p>Moving the wrong way for a negative. Say the direction out loud before each jump.</p>',
        check: [K.chk(C, 'int-add', 1), K.chk(C, 'int-add', 1)] },
      { id: 'signs', title: 'The adding rules', exp: ['B2.4'], skill: 'int-add', hard: true,
        body: '<p><b>Same signs:</b> add the sizes and keep the sign. <b>Different signs:</b> subtract the sizes and take the sign of the bigger size.</p>',
        watch: K.film([
          [T(['(−6) + (−5)', 'same signs: 6 + 5 = 11', '= −11']), 'Same signs: add the sizes, keep the sign.'],
          [F.counters(4, 7, 4), '4 + (−7): four zero pairs cancel and 3 negatives are left.'],
          [T(['4 + (−7)', 'different: 7 − 4 = 3', 'bigger size is 7 (negative) → −3']), 'Different signs: subtract, then take the sign of the bigger size.', 2600]
        ]),
        ways: [{ label: 'Counters', html: '<p>Lay out the counters, cancel every zero pair, count what is left. The leftover colour is the sign.</p>' },
          { label: 'Bank account', html: '<p>You owe $7 (−7) and earn $4 (+4). You still owe $3: −3.</p>' }],
        key: '<p>Same signs: <b>add, keep the sign</b>. Different signs: <b>subtract, sign of the bigger size</b>.</p>',
        mistake: '<p>Giving (−7) + 4 = −11. Adding a positive moves toward zero, so the answer must be more than −7.</p>',
        check: [K.chk(C, 'int-add', 2), K.chk(C, 'int-add', 3)] }
    ] },
    { id: 'sub', title: 'Subtracting integers', sub: 'Add the opposite.', concepts: [
      { id: 'opposite', title: 'Subtract: add the opposite', exp: ['B2.4'], skill: 'int-sub', hard: true,
        body: '<p>To subtract an integer, <b>add its opposite</b>. Keep the first number, change − to +, and flip the sign of the second number.</p>' + K.eq('3 − (−5) = 3 + 5 = 8'),
        watch: K.film([
          [T(['3 − (−5)']), 'Take away −5 from 3. How?'],
          [F.counters(8, 5, 5), 'Show 3 with five extra zero pairs. It is still 3.'],
          [F.counters(8, 0, 0), 'Now take away the five − counters. Eight + counters are left.'],
          [T(['3 − (−5) = 3 + 5 = 8']), 'Taking away −5 did the same as adding 5.', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Choose <b>subtract</b> and set it to <b>3 − (−5)</b>.', goal: function (g) { return g('iop') === '-' && g('iaa') === 3 && g('iab') === -5; }, yes: 'The line shows 3 + 5 = 8.' },
          { do: 'Now set <b>−2 − 6</b>.', goal: function (g) { return g('iop') === '-' && g('iaa') === -2 && g('iab') === 6; }, yes: '−2 + (−6) = −8.' }] }),
        ways: [{ label: 'Distance apart', html: '<p>5 − (−3) asks: how far is it from −3 up to 5? 3 steps to reach 0, then 5 more: 8.</p>' },
          { label: 'Taking away a debt', html: '<p>If someone takes away a $5 debt you owe, you are $5 better off. Subtracting a negative makes you go up.</p>' }],
        key: '<p><b>Keep, change, flip</b>: keep the first, change − to +, flip the second.</p>',
        mistake: '<p>Flipping both numbers. In −4 − (−9), the −4 stays: −4 + 9 = 5.</p>',
        check: [K.chk(C, 'int-sub', 1), K.chk(C, 'int-sub', 2)] },
      { id: 'change', title: 'Finding a change', exp: ['B2.4'], skill: 'int-sub',
        body: '<p>Change = later − earlier. If the answer is positive, it went up. If negative, it went down.</p>',
        watch: K.film([
          [F.thermo(-8, 5), '7 a.m.: −8°C. Noon: 5°C. How much did it warm up?'],
          [T(['change = 5 − (−8)', '= 5 + 8 = 13']), 'Later minus earlier. It warmed up by 13 degrees.'],
          [T(['−2 − 6 = −8']), 'From 6 to −2: change = −2 − 6 = −8. It fell 8 degrees.', 2600]
        ]),
        key: '<p>Change = <b>later − earlier</b>.</p>',
        mistake: '<p>Subtracting in the wrong order and getting the wrong sign. Ask: "Did it go up or down?"</p>',
        check: [K.num('In Iqaluit it was −21°C at dawn and −9°C at noon. By how many degrees did it warm up?', 12, 'Change = later − earlier = −9 − (−21).', '−9 − (−21) = −9 + 21 = 12 degrees.', { unit: '°C' }), K.chk(C, 'int-sub', 3)] }
    ] },
    { id: 'mul', title: 'Multiplying integers', sub: 'Groups, patterns and counting signs.', concepts: [
      { id: 'groups', title: 'Groups of negatives', exp: ['B2.7'], skill: 'int-mul',
        body: '<p>3 × (−4) means three groups of −4: (−4) + (−4) + (−4) = −12. A positive times a negative is negative.</p>',
        watch: K.film([
          [F.counters(0, 4, 0), 'One group of −4.'],
          [F.counters(0, 8, 0), 'Two groups: −8.'],
          [F.counters(0, 12, 0), 'Three groups: −12. So 3 × (−4) = −12.', 2400]
        ]),
        key: '<p>Positive × negative = <b>negative</b>.</p>',
        mistake: '<p>Writing 3 × (−4) = 12. Count the counters: they are all negative.</p>',
        check: [K.chk(C, 'int-mul', 1), K.num('Work out 5 × (−3).', -15, 'Five groups of −3.', '(−3) + (−3) + (−3) + (−3) + (−3) = −15.', { show: '−15' })] },
      { id: 'negneg', title: 'Negative times negative', exp: ['B2.7'], skill: 'int-mul', hard: true,
        body: '<p>Follow the pattern. Each time the second number drops by 1, the product changes by the same amount. Past zero, a negative times a negative becomes <b>positive</b>.</p>',
        watch: K.film([
          [F.pattern(-4), '−4 × 3 = −12, −4 × 2 = −8, −4 × 1 = −4. Each row goes up by 4.'],
          [F.pattern(-4), 'Keep going: −4 × 0 = 0, then −4 × (−1) = 4, −4 × (−2) = 8.'],
          [F.signGrid(), 'Same signs give a positive. Different signs give a negative.', 2800]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Set the first number to <b>−3</b>. What is −3 × (−3)?', goal: function (g) { return g('imp') === -3; }, yes: 'The pattern climbs by 3 each row, so −3 × (−3) = 9.' },
          { do: 'Now try a <b>positive</b> first number. What happens past 0?', goal: function (g) { return g('imp') > 0; }, yes: 'Positive × negative is negative.' }] }),
        ways: [{ label: 'Opposite of the opposite', html: '<p>−3 × 4 = −12. The − in front of the 3 means "the opposite of". So −3 × (−4) is the opposite of 3 × (−4) = −12, which is 12.</p>' },
          { label: 'Film running backwards', html: '<p>A tank loses 4 L every hour (−4). Three hours ago (−3) it had 12 L more than now: (−3) × (−4) = 12.</p>' }],
        key: '<p><b>Same signs → positive. Different signs → negative.</b></p>',
        mistake: '<p>Using the adding rule: (−4) × (−6) = −24 "because both are negative". For multiplying, two negatives make a positive.</p>',
        check: [K.chk(C, 'int-mul', 1), K.chk(C, 'int-mul', 2)] },
      { id: 'count', title: 'Count the negative signs', exp: ['B2.7'], skill: 'int-mul',
        body: '<p>When you multiply several integers, count the negative signs. An <b>even</b> number gives a positive answer. An <b>odd</b> number gives a negative.</p>',
        watch: K.film([
          [T(['(−2) × (−3) × (−1)']), 'Three negative signs.'],
          [T(['2 × 3 × 1 = 6']), 'Multiply the sizes: 6.'],
          [T(['3 negatives: odd → −6']), 'Odd number of negatives: the answer is −6.', 2400]
        ]),
        key: '<p>Even negatives → <b>+</b>. Odd negatives → <b>−</b>.</p>',
        mistake: '<p>Mixing up −3² and (−3)². (−3)² = 9, but −3² = −(3 × 3) = −9.</p>',
        check: [K.chk(C, 'int-mul', 3), K.mc('What is the sign of (−1) × (−2) × (−3) × (−4)?', 'Positive', ['Negative', 'Zero'], 'Count the negative signs.', 'Four negatives is even, so it is positive (24).')] }
    ] },
    { id: 'div', title: 'Dividing and several steps', sub: 'Same sign rules, then the order of operations.', concepts: [
      { id: 'divide', title: 'Dividing integers', exp: ['B2.7'], skill: 'int-div',
        body: '<p>Division undoes multiplication, so it uses the <b>same sign rules</b>. Since (−6) × 8 = −48, we know −48 ÷ 8 = −6.</p>',
        watch: K.film([
          [T(['(−6) × 8 = −48']), 'Start with a multiplication fact.'],
          [T(['−48 ÷ 8 = −6', '−48 ÷ (−6) = 8']), 'Undo it either way. Different signs: negative. Same signs: positive.'],
          [F.signGrid(), 'The same grid works for dividing.', 2400]
        ]),
        key: '<p>Divide the sizes, then <b>same signs → +, different → −</b>.</p>',
        mistake: '<p>Forgetting the sign when dividing: −45 ÷ (−9) = −5. Two negatives make a positive: 5.</p>',
        check: [K.chk(C, 'int-div', 1), K.chk(C, 'int-div', 2)] },
      { id: 'steps', title: 'Several steps', exp: ['B2.1', 'B2.7'], skill: 'int-mixed', hard: true,
        body: '<p>Use the order of operations: brackets, then × and ÷, then + and −. Apply the sign rules at every step.</p>',
        watch: K.film([
          [T(['−2 × (3 − 8)']), 'Brackets first.'],
          [T(['3 − 8 = −5', '−2 × (−5)']), '3 − 8 = −5. Now multiply.'],
          [T(['−2 × (−5) = 10']), 'Same signs: positive. 10.'],
          [T(['mean of −3, 5, −8', '= (−6) ÷ 3 = −2']), 'Mean temperature: add, then divide. −2°C.', 2600]
        ]),
        ways: [{ label: 'One line at a time', html: '<p>Rewrite the whole line after every step. Only change one thing each time.</p>' }],
        key: '<p><b>Brackets → × ÷ → + −</b>, with the sign rules each time.</p>',
        mistake: '<p>Working left to right and ignoring the brackets. Underline the brackets first.</p>',
        check: [K.chk(C, 'int-mixed', 1), K.chk(C, 'int-mixed', 2), K.num('The low temperatures for four days were −6°C, 2°C, −9°C and −3°C. What was the mean low?', -4, 'Add the four, then divide by 4.', '(−6) + 2 + (−9) + (−3) = −16. −16 ÷ 4 = −4°C.', { unit: '°C', show: '−4' })] }
    ] }
  ]);
})();