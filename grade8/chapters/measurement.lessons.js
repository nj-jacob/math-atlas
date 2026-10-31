(function () {
  var K = K8, A = Atlas, R = A.R, F = K.fx('measurement'), C = 'measurement';
  var SQ = '<sup>2</sup>', CU = '<sup>3</sup>';
  function eq(t) { return '<p class="k8-eq">' + t + '</p>'; }
  function txt(lines) { return A.svg(400, 40 + lines.length * 34, lines.map(function (l, i) { return '<text x="200" y="' + (40 + i * 34) + '" text-anchor="middle" font-size="22"' + (i === lines.length - 1 ? ' class="tb"' : '') + '>' + l + '</text>'; }).join(''), lines.join('. ')); }

  K.lessons(C, [
    { id: 'pyth', title: 'The Pythagorean relationship', sub: 'How the three sides of a right triangle are linked.', concepts: [
      { id: 'sides', title: 'Legs and the hypotenuse', exp: ['E2.4'], skill: 'ms-hyp',
        body: '<p>A right triangle has one 90° corner. The two sides that make that corner are the <b>legs</b>. The side across from it is the <b>hypotenuse</b>. It is always the longest side.</p>',
        watch: K.film([
          [F.rtri(4, 3, '', '', ''), 'Here is a right triangle. The small square marks the 90° corner.'],
          [F.rtri(4, 3, 'leg', 'leg', '', ''), 'The two sides that meet at the square corner are the legs.'],
          [F.rtri(4, 3, 'leg', 'leg', 'hypotenuse', 'c'), 'The side across from the right angle is the hypotenuse, c.'],
          [F.rtri(4, 3, 'a', 'b', 'c', 'c'), 'We call the legs a and b. The hypotenuse is always c, and it is always the longest.', 2200]
        ]),
        key: '<p>The <b>hypotenuse</b> is across from the right angle and is always the longest side.</p>',
        mistake: '<p>Calling the longest-looking side on the page the hypotenuse when the triangle is turned. Ask: "Which side does not touch the square corner?"</p>',
        check: [K.mc('A right triangle has sides 9 cm, 12 cm and 15 cm. Which is the hypotenuse?', '15 cm', ['9 cm', '12 cm'], 'The hypotenuse is the longest side.', '15 cm is the longest side, so it is the hypotenuse.'),
          K.mc('In the triangle, which side is the hypotenuse?', 'The side labelled c', ['The side labelled a', 'The side labelled b'], 'Find the side that does not touch the square corner.', 'c is across from the right angle.', F.rtri(5, 2.5, 'a', 'b', 'c', ''))] },

      { id: 'squares', title: 'Squares on the sides', exp: ['E2.4'], skill: 'ms-hyp', hard: true,
        body: '<p>Build a square on each side of a right triangle. The two squares on the legs together have exactly the same area as the square on the hypotenuse.</p>' + eq('a' + SQ + ' + b' + SQ + ' = c' + SQ),
        watch: K.film([
          [F.psq(3, 4), 'Legs of 3 and 4. The square on the 3 side holds 9 small squares. The square on the 4 side holds 16.'],
          [F.psq(3, 4), '9 + 16 = 25. The big square on the hypotenuse holds 25. So the hypotenuse is 5.', 2400],
          [F.psq(5, 12), 'Legs of 5 and 12: 25 + 144 = 169. The hypotenuse is √169 = 13.', 2400],
          [F.psq(2, 6), 'It works for every right triangle: 4 + 36 = 40.', 2000]
        ]),
        try: K.tap({ groups: [{ n: 9, cols: 3, label: 'a² (leg 3)', col: 'var(--teal2)' }, { n: 16, cols: 4, label: 'b² (leg 4)', col: 'var(--coral)' }, { n: 25, cols: 5, label: 'c² (hypotenuse 5)', col: 'var(--sb)' }],
          tasks: [
            { do: 'Tap every square in a² and b². Watch the count.', goal: function (s) { return s.c[0] === 9 && s.c[1] === 16; }, yes: '9 + 16 = 25 squares on the legs.' },
            { do: 'Now fill the square on the hypotenuse.', goal: function (s) { return s.c[2] === 25; }, yes: 'Yes: 25 squares. The two small squares exactly fill the big one.' }
          ], draw: function (s) { return '<p class="k8-eq">' + (s.c[0] || '?') + ' + ' + (s.c[1] || '?') + ' = ' + (s.c[2] || '?') + '</p>'; } }),
        ways: [
          { label: 'Cut and rearrange', html: '<p>Both big squares are the same size and hold the same 4 triangles. What is left over must be equal: c' + SQ + ' on the left, a' + SQ + ' + b' + SQ + ' on the right.</p><div class="fig">' + F.rearr() + '</div>' },
          { label: 'A builder\'s trick', html: '<p>Builders mark 3 m along one wall and 4 m along the other. If the diagonal between the marks is exactly 5 m, the corner is square. That works because 3' + SQ + ' + 4' + SQ + ' = 5' + SQ + '.</p><div class="fig">' + F.rtri(4, 3, '4 m', '3 m', '5 m', 'c') + '</div>' },
          { label: 'Only right triangles', html: '<p>Try a triangle without a right angle, with sides 4, 5 and 6: 16 + 25 = 41, but 6' + SQ + ' = 36. They do not match. The rule only works when there is a 90° corner.</p>' }
        ],
        key: '<p><b>a' + SQ + ' + b' + SQ + ' = c' + SQ + '</b>: the squares on the legs add up to the square on the hypotenuse.</p>',
        mistake: '<p>Adding the sides instead of their squares (3 + 4 = 7). Point to the squares in "Try it": it is the areas that add.</p>',
        check: [K.mc('The squares on the legs of a right triangle have areas 36 and 64. What is the area of the square on the hypotenuse?', '100', ['14', '28', '48'], 'The two small squares add up to the big one.', '36 + 64 = 100.'),
          K.num('The legs of a right triangle are 8 and 15. What is a' + SQ + ' + b' + SQ + '?', 289, 'Square each leg, then add.', '64 + 225 = 289.')] },

      { id: 'hyp', title: 'Find the hypotenuse', exp: ['E2.4'], skill: 'ms-hyp',
        body: '<p>To find the hypotenuse: <b>square</b> both legs, <b>add</b>, then take the <b>square root</b>.</p>',
        watch: K.film([
          [F.rtri(8, 6, '8 cm', '6 cm', 'c = ?', 'c'), 'Legs of 8 cm and 6 cm. We want the hypotenuse, c.'],
          [txt(['8² = 64', '6² = 36']), 'Step 1: square each leg. 64 and 36.'],
          [txt(['64 + 36 = 100', 'c² = 100']), 'Step 2: add. c² = 100.'],
          [txt(['c = √100', 'c = 10 cm']), 'Step 3: take the square root. c = 10 cm.', 2200]
        ]),
        try: K.lab({ ctrls: [{ id: 'a', label: 'Leg a', min: 1, max: 15, value: 3 }, { id: 'b', label: 'Leg b', min: 1, max: 15, value: 3 }],
          draw: function (v) { var c2 = v.a * v.a + v.b * v.b, c = Math.sqrt(c2); return { fig: F.rtri(v.a, v.b, v.a, v.b, 'c', 'c'), out: v.a + '² + ' + v.b + '² = ' + c2 + ', so c = √' + c2 + (c % 1 ? ' ≈ ' + Math.round(c * 100) / 100 : ' = <b>' + c + '</b>') }; },
          tasks: [{ do: 'Make the hypotenuse exactly <b>5</b>.', goal: function (v) { return v.a * v.a + v.b * v.b === 25; }, yes: '3² + 4² = 25. c = 5.' },
            { do: 'Make the hypotenuse exactly <b>13</b>.', goal: function (v) { return v.a * v.a + v.b * v.b === 169; }, yes: '5² + 12² = 169. c = 13.' },
            { do: 'Make the hypotenuse exactly <b>10</b>.', goal: function (v) { return v.a * v.a + v.b * v.b === 100; }, yes: '6² + 8² = 100. c = 10.' }] }),
        key: '<p><b>Square, add, square root.</b></p>',
        mistake: '<p>Forgetting the last step and giving c' + SQ + ' as the answer (100 instead of 10). Ask: "Is your answer longer than both legs but shorter than the two legs added?"</p>',
        check: [K.chk(C, 'ms-hyp', 1), K.chk(C, 'ms-hyp', 2)] }
    ] },

    { id: 'missing', title: 'Missing sides and right angles', sub: 'Work backwards, and test for a right angle.', concepts: [
      { id: 'leg', title: 'Find a missing leg', exp: ['E2.4'], skill: 'ms-leg', hard: true,
        body: '<p>If you know the hypotenuse and one leg, <b>subtract</b>: a' + SQ + ' = c' + SQ + ' &minus; b' + SQ + '. Then take the square root.</p>',
        watch: K.film([
          [F.rtri(1.4, 4.8, '1.4 m', 'h = ?', '5 m', 'b'), 'A 5 m ladder leans on a wall. Its foot is 1.4 m out. How high does it reach?'],
          [txt(['5² = 25', '1.4² = 1.96']), 'The ladder is the hypotenuse. Square both lengths.'],
          [txt(['25 − 1.96 = 23.04', 'h² = 23.04']), 'Subtract, because we want a leg.'],
          [txt(['h = √23.04', 'h = 4.8 m']), 'Square root: the ladder reaches 4.8 m up the wall.', 2200]
        ]),
        try: K.lab({ ctrls: [{ id: 'c', label: 'Hypotenuse c', min: 2, max: 20, value: 10 }, { id: 'b', label: 'Leg b', min: 1, max: 19, value: 6 }],
          draw: function (v) { if (v.b >= v.c) return { fig: '', out: '<b>Not possible.</b> A leg must be shorter than the hypotenuse.' }; var a2 = v.c * v.c - v.b * v.b, a = Math.sqrt(a2); return { fig: F.rtri(a, v.b, 'a = ?', v.b, v.c, 'a'), out: v.c + '² − ' + v.b + '² = ' + a2 + ', so a = √' + a2 + (a % 1 ? ' ≈ ' + Math.round(a * 100) / 100 : ' = <b>' + a + '</b>') }; },
          tasks: [{ do: 'With c = 10, choose b so the missing leg is exactly <b>8</b>.', goal: function (v) { return v.c === 10 && v.b === 6; }, yes: '100 − 36 = 64, and √64 = 8.' },
            { do: 'Set c = 13 and b = 5. What is the missing leg?', goal: function (v) { return v.c === 13 && v.b === 5; }, yes: '169 − 25 = 144, so the leg is 12.' },
            { do: 'Make b bigger than c. What happens?', goal: function (v) { return v.b >= v.c; }, yes: 'No triangle: the hypotenuse must be the longest side.' }] }),
        ways: [
          { label: 'Start from the big square', html: '<p>The square on the hypotenuse is made of the two leg squares. Take one away and the other is left: 169 &minus; 25 = 144, so the other leg square is 144, and the leg is 12.</p><div class="fig">' + F.psq(5, 12) + '</div>' },
          { label: 'Check by adding back', html: '<p>Once you have an answer, put it back in: 12' + SQ + ' + 5' + SQ + ' = 144 + 25 = 169 = 13' + SQ + '. If the check works, the answer is right.</p>' }
        ],
        key: '<p>For a leg: <b>c' + SQ + ' &minus; b' + SQ + '</b>, then square root. A leg is always shorter than the hypotenuse.</p>',
        mistake: '<p>Adding instead of subtracting, which gives a "leg" longer than the hypotenuse. Ask: "Which side is the longest? Is that the one you found?"</p>',
        check: [K.chk(C, 'ms-leg', 1), K.chk(C, 'ms-leg', 2)] },

      { id: 'test', title: 'Is it a right triangle?', exp: ['E2.4'], skill: 'ms-leg',
        body: '<p>Square the two shorter sides and add. If you get the square of the longest side, the triangle has a right angle. If not, it does not.</p>',
        watch: K.film([
          [txt(['7, 24, 25', '49 + 576 = 625', '25² = 625']), 'Sides 7, 24 and 25: 49 + 576 = 625, and 25² is 625. They match: a right triangle.'],
          [txt(['6, 9, 11', '36 + 81 = 117', '11² = 121']), 'Sides 6, 9 and 11: 117 is not 121. No right angle.', 2200]
        ]),
        key: '<p>If <b>a' + SQ + ' + b' + SQ + ' = c' + SQ + '</b> with c the longest side, there is a right angle.</p>',
        mistake: '<p>Using the wrong side as c. The longest side must go on its own.</p>',
        check: [function () { var t = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), ok = R.int(0, 1), s = ok ? t : [t[0], t[1], t[2] + 1];
          return { q: 'A triangle has sides ' + s.join(', ') + '. Is it a right triangle?', type: 'mc', options: ['Yes', 'No'], answer: ok ? 0 : 1, hint: 'Square the two shorter sides and add. Compare with the longest side squared.', explain: s[0] * s[0] + ' + ' + s[1] * s[1] + ' = ' + (s[0] * s[0] + s[1] * s[1]) + ', and ' + s[2] + '² = ' + s[2] * s[2] + '. ' + (ok ? 'They match.' : 'They do not match.') }; }] },

      { id: 'round', title: 'When the answer is not whole', exp: ['E2.4', 'B1.3'], skill: 'ms-hyp',
        body: '<p>Most square roots are not whole numbers. Use a calculator and round, then check the answer makes sense: the hypotenuse is longer than each leg, but shorter than the two legs added.</p>',
        watch: K.film([
          [F.rtri(6, 3, '6 cm', '3 cm', 'c = ?', 'c'), 'Legs of 6 cm and 3 cm.'],
          [txt(['36 + 9 = 45', 'c = √45 ≈ 6.7 cm']), '36 + 9 = 45. √45 is about 6.7.'],
          [txt(['6 < 6.7 < 9']), 'Check: longer than 6, shorter than 6 + 3 = 9. It makes sense.', 2200]
        ]),
        key: '<p>Round at the <b>end</b>, then check: longer than each leg, shorter than both added.</p>',
        mistake: '<p>Rounding the squares before adding. Keep every number until the last step.</p>',
        check: [K.chk(C, 'ms-hyp', 3)] }
    ] },

    { id: 'circle', title: 'Circles', sub: 'Around and inside a circle.', concepts: [
      { id: 'parts', title: 'Radius, diameter, circumference', exp: ['E2.3'], skill: 'ms-circle',
        body: '<p>The <b>radius</b> goes from the centre to the edge. The <b>diameter</b> goes all the way across, so it is 2 radii. The distance around is the <b>circumference</b>.</p>',
        watch: K.film([
          [F.circW(5), 'A circle with radius 5 cm. The radius goes from the centre to the edge.'],
          [F.circW(5), 'The diameter goes straight across: 2 × 5 = 10 cm.'],
          [F.circW(5), 'Unroll the edge and it is a bit more than 3 diameters long. That number is π, about 3.14.', 2400]
        ]),
        key: '<p><b>d = 2r</b>. Circumference <b>C = πd</b>, a bit more than 3 diameters.</p>',
        mistake: '<p>Mixing up radius and diameter. Ask: "Does this length go all the way across, or only to the centre?"</p>',
        check: [function () { var r = R.int(3, 25); return { q: 'A circle has a radius of ' + r + ' cm. What is its diameter?', type: 'num', answer: 2 * r, unit: 'cm', hint: 'The diameter is 2 radii.', explain: '2 × ' + r + ' = ' + 2 * r + ' cm.' }; },
          function () { var d = R.int(3, 20) * 2; return { q: 'A circle has a diameter of ' + d + ' cm. What is its radius?', type: 'num', answer: d / 2, unit: 'cm', hint: 'The radius is half the diameter.', explain: d + ' ÷ 2 = ' + d / 2 + ' cm.' }; }] },

      { id: 'circum', title: 'Circumference', exp: ['E2.3'], skill: 'ms-circle',
        body: '<p><b>C = πd</b>, or <b>C = 2πr</b>. Use the π key, or 3.14.</p>',
        watch: K.film([
          [F.circW(30), 'A bike wheel has a diameter of 60 cm.'],
          [txt(['C = π × 60', 'C ≈ 188.5 cm']), 'One turn rolls one circumference: π × 60 ≈ 188.5 cm.'],
          [txt(['100 turns', '≈ 18 850 cm ≈ 188.5 m']), 'In 100 turns the bike rolls about 188.5 m.', 2200]
        ]),
        try: K.lab({ ctrls: [{ id: 'r', label: 'Radius', min: 1, max: 30, value: 2, fmt: function (x) { return x + ' cm'; } }],
          draw: function (v) { return { fig: F.circW(v.r), out: 'C = 2 × π × ' + v.r + ' ≈ <b>' + F.f1(2 * Math.PI * v.r) + ' cm</b>' }; },
          tasks: [{ do: 'Find the radius that gives a circumference of about <b>31.4 cm</b>.', goal: function (v) { return v.r === 5; }, yes: 'r = 5, d = 10, and π × 10 ≈ 31.4.' },
            { do: 'Double the radius. What happens to the circumference?', goal: function (v) { return v.r === 10; }, yes: 'It doubles too: about 62.8 cm.' }] }),
        key: '<p><b>C = πd = 2πr</b>.</p>',
        mistake: '<p>Using 2πr with the diameter, which doubles the answer. Check which length you were given.</p>',
        check: [K.chk(C, 'ms-circle', 1)] },

      { id: 'area', title: 'Area of a circle', exp: ['E2.3'], skill: 'ms-circle', hard: true,
        body: '<p><b>A = πr' + SQ + '</b>. Square the radius first, then multiply by π.</p>',
        watch: K.film([
          [F.slices(), 'Cut a circle into thin slices and lay them side by side.'],
          [F.slices(), 'The shape is almost a rectangle: about πr long and r tall.'],
          [F.slices(), 'So the area is about πr × r = πr².', 2200]
        ]),
        try: K.lab({ ctrls: [{ id: 'r', label: 'Radius', min: 1, max: 20, value: 3, fmt: function (x) { return x + ' cm'; } }],
          draw: function (v) { return { fig: F.circW(v.r), out: 'A = π × ' + v.r + '² = π × ' + v.r * v.r + ' ≈ <b>' + F.f1(Math.PI * v.r * v.r) + ' cm²</b>' }; },
          tasks: [{ do: 'Set the radius to 5. What is the area?', goal: function (v) { return v.r === 5; }, yes: 'π × 25 ≈ 78.5 cm².' },
            { do: 'Now double it to 10. How many times bigger is the area?', goal: function (v) { return v.r === 10; }, yes: 'About 314 cm²: 4 times as big, because 2² = 4.' }] }),
        ways: [
          { label: 'About 3 squares', html: '<p>The dashed square in the picture has sides of r, so its area is r' + SQ + '. The circle holds a bit more than 3 of those squares: π × r' + SQ + '.</p><div class="fig">' + F.circW(4) + '</div>' },
          { label: 'From a diameter', html: '<p>If you are given the diameter, halve it first. d = 12 means r = 6, so A = π × 36 ≈ 113.1.</p>' }
        ],
        key: '<p><b>A = πr' + SQ + '</b>: square the radius, then multiply by π.</p>',
        mistake: '<p>Putting the diameter into πr' + SQ + ', or doing π × r and then squaring. Have the child say the order aloud: "square, then π".</p>',
        check: [K.chk(C, 'ms-circle', 2), K.chk(C, 'ms-circle', 3)] }
    ] },

    { id: 'composite', title: 'Composite shapes', sub: 'Split a shape into pieces you know.', concepts: [
      { id: 'split', title: 'Split, then add', exp: ['E2.3'], skill: 'ms-composite',
        body: '<p>Split the shape into rectangles, triangles and parts of circles. Find each area, then add. If a piece is cut out, subtract it.</p>',
        watch: K.film([
          [F.comp('house', { w: 8, h: 5, t: 3 }), 'A house shape: a rectangle with a triangle on top.'],
          [txt(['Rectangle: 8 × 5 = 40', 'Triangle: 8 × 3 ÷ 2 = 12']), 'Find each piece.'],
          [txt(['40 + 12 = 52 cm²']), 'Add the pieces: 52 cm².'],
          [F.comp('L', { W: 10, H: 7, cw: 4, ch: 3 }), 'An L shape: the whole rectangle minus the missing corner. 70 − 12 = 58 cm².', 2400]
        ]),
        key: '<p><b>Split</b>, find each area, then <b>add</b> (or subtract a cut-out).</p>',
        mistake: '<p>Forgetting to halve for the triangle. The triangle is half of a rectangle.</p>',
        check: [K.chk(C, 'ms-composite', 1), K.chk(C, 'ms-composite', 2)] },
      { id: 'perim', title: 'Perimeter: only the outside', exp: ['E2.3'], skill: 'ms-composite',
        body: '<p>Perimeter is the distance around the <b>outside</b>. Lines you drew to split the shape are not part of it.</p>',
        watch: K.film([
          [F.comp('semi', { w: 10, h: 6 }), 'A rectangle 10 by 6 with a half circle on the end.'],
          [txt(['10 + 6 + 10 = 26']), 'Straight edges on the outside: 26. The dashed line is inside, so it does not count.'],
          [txt(['half of π × 6 ≈ 9.4', '26 + 9.4 = 35.4 cm']), 'The curved edge is half a circumference: about 9.4. Total about 35.4 cm.', 2400]
        ]),
        key: '<p>Perimeter: trace the outside edge only.</p>',
        mistake: '<p>Adding the dashed join line, or the full circumference instead of half.</p>',
        check: [K.chk(C, 'ms-composite', 3)] }
    ] },

    { id: 'volume', title: 'Volume', sub: 'How much space a solid fills.', concepts: [
      { id: 'prism', title: 'Base area times height', exp: ['E2.3'], skill: 'ms-volume',
        body: '<p>A prism has the same shape all the way through. Its volume is the <b>area of the base</b> times the <b>height</b>: it is a stack of base layers.</p>',
        watch: K.film([
          [F.solid('box', { l: 5, w: 4, h: 1 }, { l: '5 cm', w: '4 cm', h: '1' }), 'The base is 5 by 4: 20 cubes in one layer.'],
          [F.solid('box', { l: 5, w: 4, h: 2 }, { l: '5 cm', w: '4 cm', h: '2' }), 'Two layers: 40 cubes.'],
          [F.solid('box', { l: 5, w: 4, h: 3 }, { l: '5 cm', w: '4 cm', h: '3 cm' }), 'Three layers: 20 × 3 = 60 cm³.', 2200]
        ]),
        try: K.lab({ ctrls: [{ id: 'l', label: 'Length', min: 1, max: 10, value: 2 }, { id: 'w', label: 'Width', min: 1, max: 10, value: 2 }, { id: 'h', label: 'Height', min: 1, max: 10, value: 2 }],
          draw: function (v) { return { fig: F.solid('box', { l: v.l, w: v.w, h: v.h }, { l: v.l + ' cm', w: v.w + ' cm', h: v.h + ' cm' }), out: 'Base ' + v.l + ' × ' + v.w + ' = ' + v.l * v.w + ', times ' + v.h + ' = <b>' + v.l * v.w * v.h + ' cm³</b>' }; },
          tasks: [{ do: 'Build a box with a volume of <b>24 cm³</b>.', goal: function (v) { return v.l * v.w * v.h === 24; }, yes: function (v) { return v.l + ' × ' + v.w + ' × ' + v.h + ' = 24. There are several ways.'; } },
            { do: 'Build a <b>different</b> box with volume 24 and a height of 1.', goal: function (v) { return v.l * v.w * v.h === 24 && v.h === 1; }, yes: 'One flat layer of 24 cubes.' }] }),
        key: '<p><b>Volume = base area × height.</b></p>',
        mistake: '<p>Adding the three lengths instead of multiplying, or writing cm' + SQ + ' for a volume.</p>',
        check: [K.chk(C, 'ms-volume', 1)] },
      { id: 'cyl', title: 'Cylinders and triangular prisms', exp: ['E2.3'], skill: 'ms-volume', hard: true,
        body: '<p>The same rule works for any prism and for cylinders. Only the base changes: a triangle (b × h ÷ 2) or a circle (πr' + SQ + ').</p>',
        watch: K.film([
          [F.solid('cyl', { r: 4, h: 10 }, { r: '4 cm', h: '10 cm' }), 'A can: radius 4 cm, height 10 cm.'],
          [txt(['Base: π × 4² ≈ 50.27 cm²']), 'The base is a circle: π × 16 ≈ 50.27 cm².'],
          [txt(['50.27 × 10 ≈ 502.7 cm³']), 'Times the height: about 502.7 cm³.'],
          [F.solid('tri', { a: 3, b: 4, len: 10 }, { a: '3 cm', b: '4 cm', len: '10 cm' }), 'A triangular prism: base 4 × 3 ÷ 2 = 6, times 10 = 60 cm³.', 2400]
        ]),
        ways: [{ label: 'Stack of coins', html: '<p>A cylinder is a stack of thin circles, like a roll of coins. Each coin has area πr' + SQ + ', and the stack is h tall.</p>' }],
        key: '<p>Cylinder: <b>V = πr' + SQ + 'h</b>. Triangular prism: <b>(b × h ÷ 2) × length</b>.</p>',
        mistake: '<p>Using the diameter in πr' + SQ + ', or forgetting to halve the triangle.</p>',
        check: [K.chk(C, 'ms-volume', 2)] },
      { id: 'litres', title: 'Capacity in litres', exp: ['E2.3'], skill: 'ms-volume',
        body: '<p>1 cm' + CU + ' holds 1 mL. So 1000 cm' + CU + ' holds 1 L.</p>',
        watch: K.film([
          [F.solid('box', { l: 10, w: 10, h: 10 }, { l: '10 cm', w: '10 cm', h: '10 cm' }), 'A 10 cm cube: 1000 cm³. It holds exactly 1 L.'],
          [F.solid('box', { l: 40, w: 25, h: 30 }, { l: '40 cm', w: '25 cm', h: '30 cm' }), 'A fish tank 40 × 25 × 30 = 30 000 cm³.'],
          [txt(['30 000 ÷ 1000 = 30 L']), 'Divide by 1000: it holds 30 L.', 2200]
        ]),
        key: '<p><b>1000 cm' + CU + ' = 1 L</b>.</p>',
        mistake: '<p>Dividing by 100 instead of 1000.</p>',
        check: [K.chk(C, 'ms-volume', 3)] }
    ] },

    { id: 'surface', title: 'Surface area', sub: 'Unfold the solid and add the faces.', concepts: [
      { id: 'net', title: 'Nets of a box', exp: ['E2.3'], skill: 'ms-surface',
        body: '<p><b>Surface area</b> is the total area of all the faces, like wrapping paper. Unfold the box into a <b>net</b>: 6 rectangles in 3 matching pairs.</p>',
        watch: K.film([
          [F.solid('box', { l: 5, w: 4, h: 3 }, { l: '5 cm', w: '4 cm', h: '3 cm' }), 'A box 5 by 4 by 3.'],
          [F.boxNet(5, 4, 3), 'Unfold it. Same colours are matching faces: 20, 15 and 12.'],
          [txt(['20 + 15 + 12 = 47', '47 × 2 = 94 cm²']), 'Add one of each pair, then double: 94 cm².', 2400]
        ]),
        try: K.lab({ ctrls: [{ id: 'l', label: 'Length', min: 1, max: 8, value: 3 }, { id: 'w', label: 'Width', min: 1, max: 8, value: 3 }, { id: 'h', label: 'Height', min: 1, max: 8, value: 3 }],
          draw: function (v) { var s = 2 * (v.l * v.w + v.l * v.h + v.w * v.h); return { fig: F.boxNet(v.l, v.w, v.h), out: '2 × (' + v.l * v.w + ' + ' + v.l * v.h + ' + ' + v.w * v.h + ') = <b>' + s + ' cm²</b>' }; },
          tasks: [{ do: 'Make a cube (all sides equal). How many faces match?', goal: function (v) { return v.l === v.w && v.w === v.h; }, yes: 'All 6 faces are the same square.' },
            { do: 'Make a box with a surface area of <b>52 cm²</b>.', goal: function (v) { return 2 * (v.l * v.w + v.l * v.h + v.w * v.h) === 52; }, yes: '2 × 3 × 4 works: 2 × (6 + 8 + 12) = 52.' }] }),
        key: '<p>Box: <b>2 × (lw + lh + wh)</b>.</p>',
        mistake: '<p>Counting only 3 faces, or mixing up surface area (cm' + SQ + ') with volume (cm' + CU + ').</p>',
        check: [K.chk(C, 'ms-surface', 1)] },
      { id: 'cylsa', title: 'Surface area of a cylinder', exp: ['E2.3'], skill: 'ms-surface', hard: true,
        body: '<p>A cylinder unrolls into two circles and a rectangle. The rectangle is as long as the circumference.</p>',
        watch: K.film([
          [F.solid('cyl', { r: 4, h: 10 }, { r: '4 cm', h: '10 cm' }), 'A can: radius 4 cm, height 10 cm.'],
          [F.cylNet(4, 10), 'Unroll it: two circles and a rectangle 2πr long.'],
          [txt(['circles: 2 × π × 16 ≈ 100.5', 'side: 25.13 × 10 ≈ 251.3', 'total ≈ 351.9 cm²']), 'Add the parts: about 351.9 cm².', 2600]
        ]),
        ways: [{ label: 'Peel the label', html: '<p>Peel the label off a can. It is a rectangle: its width is the height of the can, and its length goes once around, the circumference 2πr.</p>' }],
        key: '<p>Cylinder: <b>2πr' + SQ + ' + 2πrh</b>.</p>',
        mistake: '<p>Using πr' + SQ + ' for the side. The side is a rectangle: circumference × height.</p>',
        check: [K.chk(C, 'ms-surface', 2), K.chk(C, 'ms-surface', 3)] }
    ] }
  ]);
})();
