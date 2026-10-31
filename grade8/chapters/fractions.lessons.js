(function () {
  var K = K8, A = Atlas, F = K.fx('fractions'), C = 'fractions', T = K.txt, f = F.raw;

  K.lessons(C, [
    { id: 'addsub', title: 'Adding and subtracting fractions', sub: 'Only same-size pieces can be added.', concepts: [
      { id: 'same', title: 'Same-size pieces', exp: ['B2.5'], skill: 'fr-add',
        body: '<p>You can only add pieces of the <b>same size</b>. ' + f(3, 8) + ' + ' + f(2, 8) + ' = ' + f(5, 8) + ': add the tops, keep the bottom. The bottom names the size of the piece.</p>',
        watch: K.film([
          [F.addPic(3, 8, 2, 8), 'Eighths plus eighths. The pieces are the same size, so just count them: 5 eighths.'],
          [F.addPic(1, 2, 1, 3), 'Halves and thirds are different sizes. You cannot count them together yet.'],
          [F.addPic(1, 2, 1, 3), 'Cut both into sixths: 3/6 + 2/6 = 5/6.', 2600]
        ]),
        example: K.film([
          [F.addPic(2, 7, 3, 7), 'My turn. I will add 2/7 + 3/7. First I check the bottoms: both are sevenths, so the pieces are the same size.'],
          [F.addPic(2, 7, 3, 7), 'So I can just count the pieces: 2 sevenths and 3 sevenths make 5 sevenths.'],
          [T(['2/7 + 3/7 = 5/7']), 'I add the tops, 2 + 3 = 5, and keep the bottom, 7. The answer is 5/7.'],
          [T(['5/7 &lt; 1 ✓']), 'I check: 5 pieces out of 7 is less than a whole, which makes sense. <b>Add the tops, keep the bottom</b>, but only when the bottoms match.', 2800]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Set the picture to <b>1/2 + 1/3</b>.', goal: function (g) { return g('fan') === 1 && g('fad') === 2 && g('fcn') === 1 && g('fcd') === 3 && g('fop') === '+'; }, yes: 'Both are cut into sixths: 3/6 + 2/6 = 5/6.' },
          { do: 'Now make a sum that equals exactly <b>1</b>, using two different bottoms.', goal: function (g) { var a = g('fan'), b = g('fad'), c = g('fcn'), d = g('fcd'); return g('fop') === '+' && b !== d && a * d + c * b === b * d; }, yes: 'The pieces fill exactly one whole.' }] }),
        key: '<p>Add the <b>tops</b>, keep the <b>bottom</b>, but only when the bottoms match.</p>',
        mistake: '<p>Adding the bottoms: ' + f(1, 2) + ' + ' + f(1, 3) + ' = ' + f(2, 5) + '. That answer is less than ' + f(1, 2) + ', which cannot be right.</p>',
        check: [K.chk(C, 'fr-add', 1), K.chk(C, 'fr-add', 1)] },
      { id: 'common', title: 'Find a common denominator', exp: ['B2.5'], skill: 'fr-add', hard: true,
        body: '<p>Rename both fractions so the bottoms match. The <b>lowest common multiple</b> of the bottoms works best.</p>',
        watch: K.film([
          [T(['2/3 + 1/4']), 'Thirds and fourths. What size piece fits both?'],
          [T(['multiples of 3: 3, 6, 9, 12', 'multiples of 4: 4, 8, 12']), 'List the multiples. They first meet at 12.'],
          [F.addPic(2, 3, 1, 4), 'Rename: 2/3 = 8/12 and 1/4 = 3/12.'],
          [T(['8/12 + 3/12 = 11/12']), 'Now add the tops: 11/12.', 2600]
        ]),
        example: K.film([
          [T(['3/5 + 1/4']), 'My turn. I will add 3/5 + 1/4. The bottoms do not match.'],
          [T(['fives: 5, 10, 15, 20', 'fours: 4, 8, 12, 16, 20']), 'First I list multiples to find a piece size that fits both. They first meet at 20.'],
          [F.addPic(3, 5, 1, 4), 'Next I rename: 3/5 = 12/20 and 1/4 = 5/20.'],
          [T(['12/20 + 5/20 = 17/20']), 'Now the pieces match, so I add the tops: 17/20.'],
          [T(['17/20']), '17 and 20 share no factor, so <b>17/20</b> is the answer. Rename, then add the tops.', 2600]
        ]),
        ways: [{ label: 'Fraction wall', html: '<p>Line up the strips. Find a row whose pieces fit exactly under both fractions.</p>', tool: 'fractions', opts: { wall: [1, 3, 4, 6, 12] } },
          { label: 'Multiply the bottoms', html: '<p>3 × 4 = 12 always works as a common denominator. It may not be the lowest, so simplify at the end.</p>' }],
        key: '<p><b>Rename, then add the tops.</b> Simplify at the end.</p>',
        mistake: '<p>Changing the bottom but not the top: ' + f(2, 3) + ' = ' + f(2, 12) + '. Whatever you multiply the bottom by, multiply the top by too.</p>',
        check: [K.chk(C, 'fr-add', 2), K.chk(C, 'fr-add', 2)] },
      { id: 'subtract', title: 'Subtracting fractions', exp: ['B2.5'], skill: 'fr-sub',
        body: '<p>Subtracting works the same way: rename to a common denominator, then subtract the tops.</p>',
        watch: K.film([
          [F.addPic(3, 4, 1, 6, true), '3/4 − 1/6. Common denominator: 12.'],
          [T(['9/12 − 2/12 = 7/12']), '3/4 = 9/12 and 1/6 = 2/12. Subtract the tops: 7/12.', 2600]
        ]),
        example: K.film([
          [T(['7/8 − 1/3']), 'My turn. I will work out 7/8 − 1/3.'],
          [F.addPic(7, 8, 1, 3, true), 'First I find a common denominator. 8 and 3 first meet at 24.'],
          [T(['7/8 = 21/24', '1/3 = 8/24']), 'Next I rename both fractions as twenty-fourths.'],
          [T(['21/24 − 8/24 = 13/24']), 'Then I subtract the tops: 21 − 8 = 13. The answer is <b>13/24</b>. Rename, then subtract the tops.', 2600]
        ]),
        key: '<p>Rename, then <b>subtract the tops</b>.</p>',
        mistake: '<p>Subtracting the bottoms too (4 − 6). Only the tops are subtracted; the bottom names the piece size.</p>',
        check: [K.chk(C, 'fr-sub', 1), K.chk(C, 'fr-sub', 2)] }
    ] },
    { id: 'mixed', title: 'Mixed numbers', sub: 'Wholes and parts, added and taken away.', concepts: [
      { id: 'mixadd', title: 'Adding mixed numbers', exp: ['B2.5'], skill: 'fr-add',
        body: '<p>Add the wholes. Add the fractions. If the fractions make more than 1, carry a whole.</p>',
        watch: K.film([
          [T(['2 1/3 + 1 3/4']), 'Add 2 1/3 and 1 3/4.'],
          [T(['wholes: 2 + 1 = 3']), 'Wholes first: 3.'],
          [T(['4/12 + 9/12 = 13/12', '= 1 1/12']), 'Fractions: 13/12. That is more than 1: 1 1/12.'],
          [T(['3 + 1 1/12 = 4 1/12']), 'Put them together: 4 1/12.', 2600]
        ]),
        example: K.film([
          [T(['3 3/4 + 1 2/3']), 'My turn. I will add 3 3/4 and 1 2/3.'],
          [T(['wholes: 3 + 1 = 4']), 'First I add the wholes: 3 + 1 = 4.'],
          [T(['3/4 + 2/3', '= 9/12 + 8/12 = 17/12']), 'Next the fractions. I rename them as twelfths: 9/12 + 8/12 = 17/12.'],
          [T(['17/12 = 1 5/12']), '17/12 is more than 1. Twelve twelfths make 1 whole, so 17/12 = 1 5/12.'],
          [T(['4 + 1 5/12 = 5 5/12']), 'Last I put them together: <b>5 5/12</b>. Wholes, then fractions, then tidy up.', 2600]
        ]),
        key: '<p><b>Wholes, then fractions</b>, then tidy up.</p>',
        mistake: '<p>Leaving 13/12 inside a mixed number (3 13/12). Ask: "Is the fraction part more than one whole?"</p>',
        check: [K.chk(C, 'fr-add', 3), K.chk(C, 'fr-add', 3)] },
      { id: 'regroup', title: 'Subtracting with regrouping', exp: ['B2.5'], skill: 'fr-sub', hard: true,
        body: '<p>If the fraction you take away is bigger than the fraction you have, <b>trade 1 whole</b> for a full set of pieces.</p>',
        watch: K.film([
          [T(['4 1/5 − 1 3/5']), 'You cannot take 3/5 from 1/5.'],
          [T(['4 1/5 = 3 + 5/5 + 1/5', '= 3 6/5']), 'Trade 1 whole for 5/5. 4 1/5 becomes 3 6/5.'],
          [T(['3 6/5 − 1 3/5 = 2 3/5']), 'Now subtract: 2 3/5.', 2600]
        ]),
        example: K.film([
          [T(['5 1/4 − 2 3/4']), 'My turn. I will work out 5 1/4 − 2 3/4. I cannot take 3/4 from 1/4.'],
          [T(['5 1/4 = 4 + 4/4 + 1/4', '= 4 5/4']), 'So I trade 1 whole for 4/4. 5 1/4 becomes 4 5/4.'],
          [T(['4 5/4 − 2 3/4']), 'Now I subtract the wholes, 4 − 2 = 2, and the fractions, 5/4 − 3/4 = 2/4.'],
          [T(['2 2/4 = 2 1/2']), 'That makes 2 2/4. I simplify: <b>2 1/2</b>.'],
          [T(['2 1/2 + 2 3/4 = 5 1/4 ✓']), 'I check by adding back: 2 1/2 + 2 3/4 = 5 1/4. Not enough parts? Trade 1 whole.', 2600]
        ]),
        ways: [{ label: 'Improper fractions', html: '<p>Change both first: 4 1/5 = 21/5 and 1 3/5 = 8/5. 21/5 − 8/5 = 13/5 = 2 3/5. No trading needed.</p>' },
          { label: 'Count up', html: '<p>From 1 3/5 to 2 is 2/5. From 2 to 4 1/5 is 2 1/5. Together: 2 3/5.</p>' }],
        key: '<p>Not enough parts? <b>Trade 1 whole</b> for a full set of pieces.</p>',
        mistake: '<p>Subtracting the smaller fraction from the bigger one (3/5 − 1/5) to avoid regrouping.</p>',
        check: [K.chk(C, 'fr-sub', 3), K.chk(C, 'fr-sub', 3)] }
    ] },
    { id: 'mul', title: 'Multiplying fractions', sub: 'A fraction of a fraction.', concepts: [
      { id: 'of', title: 'A fraction of a fraction', exp: ['B2.6'], skill: 'fr-mul', hard: true,
        body: '<p>' + f(2, 3) + ' × ' + f(3, 4) + ' means ' + f(2, 3) + ' <b>of</b> ' + f(3, 4) + '. One fraction cuts the square into columns, the other into rows. The overlap is the answer. Multiply top × top and bottom × bottom.</p>',
        watch: K.film([
          [F.areaPic(2, 3, 1, 1), 'Shade 2/3 of the square: 2 of 3 columns.'],
          [F.areaPic(2, 3, 3, 4), 'Now take 3/4 of it with rows. The overlap is 6 of 12 small pieces.'],
          [T(['2/3 × 3/4 = 6/12', '= 1/2']), 'Top × top = 6, bottom × bottom = 12. Simplify: 1/2.', 2600]
        ]),
        example: K.film([
          [F.areaPic(3, 5, 1, 1), 'My turn. I will find 2/3 of 3/5. First I shade 3/5 of the square: 3 of 5 columns.'],
          [F.areaPic(3, 5, 2, 3), 'Next I take 2/3 of it with rows. The overlap is 6 of 15 small pieces.'],
          [T(['3/5 × 2/3 = 6/15']), 'I check with the rule: top × top = 6, bottom × bottom = 15.'],
          [T(['6/15 = 2/5']), 'Then I simplify by dividing top and bottom by 3. The answer is <b>2/5</b>. Top × top, bottom × bottom.', 2600]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Show <b>1/2 × 4/5</b>. How many pieces overlap?', goal: function (g) { return g('man') === 1 && g('mad') === 2 && g('mcn') === 4 && g('mcd') === 5; }, yes: '4 of 10 pieces: 4/10 = 2/5.' },
          { do: 'Make an overlap of exactly <b>6 of 20</b>.', goal: function (g) { return g('man') * g('mcn') === 6 && g('mad') * g('mcd') === 20; }, yes: '6/20 = 3/10.' }] }),
        ways: [{ label: 'Of a number', html: '<p>' + f(3, 4) + ' of 20: find ' + f(1, 4) + ' (5), then take 3 of them (15). Multiplying by a fraction less than 1 makes a number <b>smaller</b>.</p>' }],
        key: '<p><b>Top × top, bottom × bottom</b>. No common denominator needed.</p>',
        mistake: '<p>Finding a common denominator first, out of habit. It still works but adds steps and errors.</p>',
        check: [K.chk(C, 'fr-mul', 1), K.chk(C, 'fr-mul', 1)] },
      { id: 'whole', title: 'Whole and mixed numbers', exp: ['B2.6'], skill: 'fr-mul',
        body: '<p>Write whole numbers over 1, and change mixed numbers to improper fractions. Then multiply as usual.</p>',
        watch: K.film([
          [T(['5 × 2/3 = 5/1 × 2/3', '= 10/3 = 3 1/3']), 'A whole number is that number over 1.'],
          [T(['1 1/2 × 2 2/3', '= 3/2 × 8/3']), 'Change mixed numbers to improper fractions.'],
          [T(['= 24/6 = 4']), 'Multiply, then simplify: 4.', 2600]
        ]),
        example: K.film([
          [T(['2 1/4 × 1 1/3']), 'My turn. I will multiply 2 1/4 by 1 1/3.'],
          [T(['2 1/4 = 9/4', '1 1/3 = 4/3']), 'First I change each mixed number to a fraction. 2 1/4 is 8 quarters and 1 more quarter: 9/4.'],
          [T(['9/4 × 4/3 = 36/12']), 'Next I multiply: top × top = 36, bottom × bottom = 12.'],
          [T(['36/12 = 3']), 'Then I simplify: 36 ÷ 12 = 3.'],
          [T(['about 2 × 1.5 = 3 ✓']), 'I check with an estimate: about 2 × 1.5, which is 3. <b>Make everything a fraction first.</b>', 2600]
        ]),
        key: '<p>Make everything a <b>fraction</b> first.</p>',
        mistake: '<p>Multiplying the wholes and the fractions separately: 1 1/2 × 2 2/3 ≠ 2 + 2/6.</p>',
        check: [K.chk(C, 'fr-mul', 2), K.chk(C, 'fr-mul', 3)] }
    ] },
    { id: 'div', title: 'Dividing fractions', sub: 'How many of these fit into that?', concepts: [
      { id: 'fit', title: 'How many fit?', exp: ['B2.6'], skill: 'fr-div',
        body: '<p>' + f(3, 4) + ' ÷ ' + f(1, 8) + ' asks: <b>how many ' + f(1, 8) + 's fit into ' + f(3, 4) + '</b>?</p>',
        watch: K.film([
          [F.divPic(3, 4, 1, 8), 'Lay eighths along 3/4. Six of them fit.'],
          [F.divPic(2, 1, 1, 3), '2 ÷ 1/3: each whole holds 3 thirds, so 2 wholes hold 6.'],
          [F.divPic(3, 2, 3, 4), '3/2 ÷ 3/4: two pieces of 3/4 fit into 1 1/2.', 2600]
        ]),
        example: K.film([
          [T(['2/3 ÷ 1/6']), 'My turn. I will find 2/3 ÷ 1/6. It asks: how many sixths fit into 2/3?'],
          [F.divPic(2, 3, 1, 6), 'First I draw 2/3 of a bar. Then I lay sixths along it.'],
          [F.divPic(2, 3, 1, 6), 'I count: 4 sixths fit, because 2/3 is the same as 4/6.'],
          [T(['2/3 ÷ 1/6 = 4', 'check: 4 × 1/6 = 2/3 ✓']), 'So the answer is 4. I check: 4 sixths make 2/3. <b>Dividing asks how many fit.</b>', 2600]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Show <b>3/4 ÷ 1/8</b>.', goal: function (g) { return g('dan') === 3 && g('dad') === 4 && g('dcn') === 1 && g('dcd') === 8; }, yes: 'Six eighths fit into 3/4.' },
          { do: 'Make a division where the answer is exactly <b>4</b>.', goal: function (g) { return g('dan') * g('dcd') === 4 * g('dad') * g('dcn'); }, yes: 'Four pieces fit exactly.' }] }),
        key: '<p>Dividing asks <b>how many fit</b>.</p>',
        mistake: '<p>Expecting division to make a number smaller. Dividing by a fraction less than 1 gives a <b>bigger</b> answer.</p>',
        check: [K.chk(C, 'fr-div', 1), K.chk(C, 'fr-div', 1)] },
      { id: 'flip', title: 'Multiply by the reciprocal', exp: ['B2.6'], skill: 'fr-div', hard: true,
        body: '<p>To divide by a fraction, <b>keep</b> the first, <b>change</b> ÷ to ×, and <b>flip</b> the second. ' + f(2, 3) + ' ÷ ' + f(3, 4) + ' = ' + f(2, 3) + ' × ' + f(4, 3) + ' = ' + f(8, 9) + '.</p>',
        watch: K.film([
          [T(['2/3 ÷ 3/4']), 'Keep 2/3.'],
          [T(['2/3 × 4/3']), 'Change ÷ to ×. Flip 3/4 to 4/3.'],
          [T(['= 8/9']), 'Multiply: 8/9. Just under 1, because 3/4 is a bit bigger than 2/3.', 2600]
        ]),
        example: K.film([
          [T(['3/5 ÷ 2/3']), 'My turn. I will divide 3/5 by 2/3.'],
          [T(['keep 3/5']), 'First I keep the first fraction: 3/5.'],
          [T(['3/5 × 3/2']), 'Next I change ÷ to ×, and flip only the second fraction: 2/3 becomes 3/2.'],
          [T(['= 9/10']), 'Then I multiply: top × top = 9, bottom × bottom = 10. The answer is 9/10.'],
          [T(['9/10 &lt; 1 ✓']), 'I check: 3/5 is a bit less than 2/3, so not quite one 2/3 fits. 9/10 makes sense. <b>Keep, change, flip.</b>', 2800]
        ]),
        ways: [{ label: 'Common denominator', html: '<p>Rename both: ' + f(8, 12) + ' ÷ ' + f(9, 12) + '. Same-size pieces, so divide the tops: 8 ÷ 9 = ' + f(8, 9) + '.</p>' },
          { label: 'Why flipping works', html: '<p>÷ ' + f(1, 4) + ' asks how many quarters fit. Every whole holds 4 quarters, so it is the same as × 4. Flipping ' + f(1, 4) + ' gives 4.</p>' }],
        key: '<p><b>Keep, change, flip.</b> Flip only the second fraction.</p>',
        mistake: '<p>Flipping the first fraction instead of the second. Say "keep, change, flip" out loud in that order.</p>',
        check: [K.chk(C, 'fr-div', 2), K.chk(C, 'fr-div', 3)] }
    ] },
    { id: 'word', title: 'Choosing the operation', sub: 'Decide what is happening, then calculate.', concepts: [
      { id: 'choose', title: 'Which operation?', exp: ['B2.6', 'B2.5'], skill: 'fr-word', hard: true,
        body: '<p>Put together or how much more: <b>+ or −</b>. A fraction <b>of</b> something, or groups of a fraction: <b>×</b>. How many pieces fit, or share equally: <b>÷</b>.</p>',
        watch: K.film([
          [T(['2 1/2 batches of 2/3 cup']), 'Groups of a fraction: multiply. 5/2 × 2/3 = 10/6 = 1 2/3 cups.'],
          [T(['4 1/2 m cut into 3/4 m pieces']), 'How many pieces fit: divide. 9/2 ÷ 3/4 = 6 pieces.'],
          [T(['3/4 of a pizza, eat 1/3 of a pizza']), 'Taking away: subtract. 9/12 − 4/12 = 5/12.', 2800]
        ]),
        example: K.film([
          [T(['2 1/4 L of juice', 'glasses of 3/8 L']), 'My turn. Maya has 2 1/4 L of juice. Each glass holds 3/8 L. I will find how many glasses she can fill.'],
          [T(['how many fit? → divide']), 'First I ask what is happening. She is finding how many 3/8s fit into 2 1/4. That is dividing.'],
          [T(['2 1/4 ÷ 3/8', '= 9/4 × 8/3']), 'Next I change the mixed number to 9/4. Keep, change, flip: 9/4 × 8/3.'],
          [T(['= 72/12 = 6']), 'I multiply and simplify: 72/12 = 6 glasses.'],
          [T(['6 × 3/8 = 2 1/4 ✓']), 'I check: 6 glasses of 3/8 L make 18/8 = 2 1/4 L. <b>Ask what is happening before you calculate.</b>', 2800]
        ]),
        ways: [{ label: 'Estimate first', html: '<p>2 1/2 batches of about 2/3 cup should be between 1 and 2 cups. If your answer is far from that, check the operation.</p>' },
          { label: 'Swap in whole numbers', html: '<p>Read the problem with easy numbers: "2 batches of 3 cups". You would multiply. So multiply with the fractions too.</p>' }],
        key: '<p>Ask "what is happening?" <b>before</b> you calculate.</p>',
        mistake: '<p>Picking an operation from key words alone ("of" does not always appear). Have the child retell the story with whole numbers.</p>',
        check: [K.chk(C, 'fr-word', 1), K.chk(C, 'fr-word', 2)] },
      { id: 'sense', title: 'Does the answer make sense?', exp: ['B2.6'], skill: 'fr-word',
        body: '<p>Before you trust an answer, check its size. Multiplying by a fraction less than 1 makes a number <b>smaller</b>. Dividing by a fraction less than 1 makes it <b>bigger</b>.</p>',
        watch: K.film([
          [T(['12 × 3/4 = 9', '9 < 12']), '3/4 of 12 is less than 12. Smaller, as expected.'],
          [T(['12 ÷ 3/4 = 16', '16 > 12']), 'How many 3/4s fit into 12? More than 12 of them: 16.'],
          [T(['12 × 3/4 = 16 ?', 'too big: check']), 'If a "fraction of" answer comes out bigger, something went wrong.', 2600]
        ]),
        example: K.film([
          [T(['10 × 2/5   or   10 ÷ 2/5']), 'My turn. Before I calculate, I will predict each answer: bigger or smaller than 10?'],
          [T(['× 2/5 → smaller', '10 × 2/5 = 4']), 'Taking 2/5 of 10 gives part of 10, so it must be smaller. 10 × 2/5 = 20/5 = 4. Smaller, as I predicted.'],
          [T(['÷ 2/5 → bigger', '10 ÷ 2/5 = 25']), 'Asking how many 2/5s fit into 10 gives more than 10. 10 × 5/2 = 25. Bigger, as I predicted.'],
          [T(['4 &lt; 10 &lt; 25 ✓']), 'Both answers match my predictions. × a fraction under 1: <b>smaller</b>. ÷ a fraction under 1: <b>bigger</b>.', 2800]
        ]),
        key: '<p>× a fraction under 1 → <b>smaller</b>. ÷ a fraction under 1 → <b>bigger</b>.</p>',
        mistake: '<p>Accepting an answer without checking its size. Ask: "Should it be more or less than what you started with?"</p>',
        check: [K.mc('Without calculating: 18 ÷ 2/3 is…', 'more than 18', ['less than 18', 'exactly 18'], 'Dividing by a fraction less than 1 gives a bigger answer.', '18 ÷ 2/3 = 27, more than 18.'),
          K.mc('Without calculating: 5/6 × 4 1/2 is…', 'less than 4 1/2', ['more than 4 1/2', 'exactly 4 1/2'], 'Multiplying by a fraction less than 1 gives a smaller answer.', '5/6 × 4 1/2 = 3 3/4, less than 4 1/2.'), K.chk(C, 'fr-word', 3)] }
    ] }
  ]);
})();