(function () {
  var K = K8, A = Atlas, F = K.fx('data'), C = 'data', T = K.txt;
  var HT = [[152, 150], [160, 158], [148, 151], [171, 169], [165, 167], [158, 155], [175, 178], [162, 160], [155, 157], [168, 166]];
  function plot(n, extra) { var o = { pts: HT.slice(0, n), xs: [145, 180, 5], ys: [145, 180, 5], title: 'Height and arm span', xl: 'Height (cm)', yl: 'Arm span (cm)', desc: n + ' students plotted.' }; if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; }); return F.scatter(o); }

  K.lessons(C, [
    { id: 'kinds', title: 'Kinds of data', sub: 'What you record, and how.', concepts: [
      { id: 'onetwo', title: 'One or two variables?', exp: ['D1.1'], skill: 'da-type',
        body: '<p><b>One-variable data</b> records one thing about each person or object. <b>Two-variable data</b> records two things about each, so you can ask if they are related.</p>',
        watch: K.film([
          [T(['How much do students sleep?']), 'One thing per student: hours of sleep. One-variable.'],
          [T(['Do students who sleep more', 'score higher on tests?']), 'Two things per student: sleep and score. Two-variable.'],
          [T(['"affect", "related to"', '→ two-variable']), 'Words like affect or related to mean you need two variables.', 2600]
        ]),
        key: '<p>Count the things you record <b>for each one</b>: one or two.</p>',
        mistake: '<p>Counting the number of people instead of the number of measurements per person.</p>',
        check: [K.chk(C, 'da-type', 1), K.chk(C, 'da-type', 1)] },
      { id: 'contdisc', title: 'Continuous or discrete?', exp: ['D1.1', 'D1.2'], skill: 'da-type', hard: true,
        body: '<p><b>Continuous</b> data can be any value in a range, like 152.4 cm. You <b>measure</b> it. <b>Discrete</b> data can only be certain values, like 3 pets. You <b>count</b> it.</p>',
        watch: K.film([
          [T(['height: 152.4 cm']), 'Height can be any value: measured, continuous.'],
          [T(['pets: 3']), 'You cannot have 2.7 pets: counted, discrete.'],
          [T(['run time: 14.38 s', 'goals: 2']), 'Time is continuous. Goals are discrete.', 2600]
        ]),
        ways: [{ label: 'The halfway test', html: '<p>Ask: can there be a value halfway between two of them? Between 152 cm and 153 cm, yes (152.5). Between 2 goals and 3 goals, no.</p>' }],
        key: '<p><b>Measure</b> → continuous. <b>Count</b> → discrete.</p>',
        mistake: '<p>Calling money continuous. Prices go up in cents, so money is usually treated as discrete.</p>',
        check: [K.chk(C, 'da-type', 2), K.chk(C, 'da-type', 3)] }
    ] },
    { id: 'graphs', title: 'Choosing and making graphs', sub: 'The right graph for the data.', concepts: [
      { id: 'choose', title: 'Choose a graph', exp: ['D1.3'], skill: 'da-graph',
        body: '<p>Categories: bar or circle graph. One continuous variable: histogram. Change over time: line graph. Two variables: <b>scatter plot</b>.</p>',
        watch: K.film([
          [F.bars([12, 8, 5], ['Soccer', 'Hockey', 'Swim'], 0, 'Favourite sport'), 'Categories, like favourite sport: a bar graph.'],
          [plot(10), 'Two measurements for each student: a scatter plot.'],
          [T(['temperature each hour', '→ line graph']), 'Change over time: a line graph.', 2600]
        ]),
        key: '<p>Match the graph to the <b>kind of data</b>.</p>',
        mistake: '<p>Using a line graph for categories. Lines suggest something changes smoothly between the points.</p>',
        check: [K.chk(C, 'da-graph', 1), K.chk(C, 'da-graph', 2)] },
      { id: 'scatter', title: 'Making a scatter plot', exp: ['D1.3'], skill: 'da-graph', hard: true,
        body: '<p>Each pair of values becomes one dot. The variable that might cause the change goes <b>across</b>. A good graph has a title, labelled axes with units, an even scale, and a source.</p>',
        watch: K.film([
          [plot(1), 'Student A: height 152 cm across, arm span 150 cm up. One dot.'],
          [plot(4), 'Add students B, C and D.'],
          [plot(10), 'All 10 students. The dots rise from left to right.', 2600]
        ]),
        ways: [{ label: 'Like a map', html: '<p>Plotting is like finding a spot on a map: go across to the first number, then up to the second.</p>' }],
        key: '<p>One pair → <b>one dot</b>: across first, then up.</p>',
        mistake: '<p>Swapping the axes for some points. Plot every pair in the same order.</p>',
        check: [K.mc('Student X is 170 cm tall with an arm span of 165 cm. Where is the dot?', '170 across, 165 up', ['165 across, 170 up', '170 across, 170 up'], 'Height goes across; arm span goes up.', 'Across to 170 for height, up to 165 for arm span.'), K.chk(C, 'da-graph', 3)] }
    ] },
    { id: 'relate', title: 'Describing a relationship', sub: 'Direction, strength, outliers.', concepts: [
      { id: 'direction', title: 'Direction and strength', exp: ['D1.5'], skill: 'da-corr',
        body: '<p>Up from left to right is <b>positive</b>; down is <b>negative</b>. Points close to a straight line make a <b>strong</b> relationship; loose points make a <b>weak</b> one.</p>',
        watch: K.film([
          [F.scatter({ pts: F.makePts(1, 'strong', 7, 20), nums: false, xl: 'variable 1', yl: 'variable 2', desc: 'Strong positive.' }), 'Strong positive: up, and tight to a line.'],
          [F.scatter({ pts: F.makePts(-1, 'weak', 9, 20), nums: false, xl: 'variable 1', yl: 'variable 2', desc: 'Weak negative.' }), 'Weak negative: down, but loose.'],
          [F.scatter({ pts: F.makePts(0, 'strong', 5, 20), nums: false, xl: 'variable 1', yl: 'variable 2', desc: 'No relationship.' }), 'No relationship: no trend at all.', 2600]
        ]),
        try: K.reuse(C, 0, { tasks: [
          { do: 'Make a <b>strong negative</b> relationship.', goal: function (g) { return g('scd') === -1 && g('scs') === 'strong'; }, yes: 'Down from left to right, tight to a line.' },
          { do: 'Now make a <b>weak positive</b> one.', goal: function (g) { return g('scd') === 1 && g('scs') === 'weak'; }, yes: 'Up, but loosely scattered.' }] }),
        key: '<p>Say the <b>direction</b>, then the <b>strength</b>.</p>',
        mistake: '<p>Calling a steep line "strong" and a gentle line "weak". Strength is how close the points are to a line, not how steep it is.</p>',
        check: [K.chk(C, 'da-corr', 1), K.chk(C, 'da-corr', 2)] },
      { id: 'cause', title: 'Outliers and causes', exp: ['D1.5', 'D1.6'], skill: 'da-corr', hard: true,
        body: '<p>An <b>outlier</b> is a point far from the rest. Check it, but do not delete it just because it is unusual. And a relationship does not prove that one thing <b>causes</b> the other.</p>',
        watch: K.film([
          [F.scatter({ pts: F.makePts(1, 'strong', 7, 20, true), nums: false, xl: 'variable 1', yl: 'variable 2', hl: 'last', desc: 'Strong positive with one outlier.' }), 'One point sits far from the pattern: an outlier.'],
          [T(['ice cream sales ↑', 'sunburns ↑']), 'Ice cream sales and sunburns both rise in summer.'],
          [T(['hot weather causes both']), 'Ice cream does not cause sunburns. Hot weather affects both.', 2800]
        ]),
        ways: [{ label: 'Look for a third thing', html: '<p>When two things rise together, ask: "Is something else driving both?" Shoe size and reading level both grow with age.</p>' }],
        key: '<p>Related <b>does not mean</b> caused by.</p>',
        mistake: '<p>Concluding "A causes B" from a scatter plot alone.</p>',
        check: [K.chk(C, 'da-corr', 3), K.mc('Towns with more firefighters have more fires. What is the best conclusion?', 'Bigger towns have more of both', ['Firefighters cause fires', 'Fewer firefighters would mean fewer fires'], 'Look for a third thing that affects both.', 'Town size drives both numbers. It is a relationship, not a cause.')] }
    ] },
    { id: 'mislead', title: 'Misleading graphs', sub: 'Accurate numbers, wrong impression.', concepts: [
      { id: 'axis', title: 'The cut-off axis', exp: ['D1.6'], skill: 'da-mislead', hard: true,
        body: '<p>The most common trick is a vertical axis that does not start at 0. Small differences then look huge.</p>',
        watch: K.film([
          [F.bars([90, 94], ['Brand A', 'Brand B'], 88, 'Battery life (hours)'), 'Axis from 88: brand B looks three times as long-lasting.'],
          [F.bars([90, 94], ['Brand A', 'Brand B'], 0, 'Battery life (hours)'), 'Axis from 0: the bars are nearly the same.'],
          [T(['94 − 90 = 4 h', '4 ÷ 90 ≈ 4%']), 'B really lasts about 4% longer.', 2600]
        ]),
        try: K.reuse(C, 1, { tasks: [
          { do: 'Make the graph show the <b>true sizes</b>.', goal: function (g) { return g('mgf') === 0; }, yes: 'Starting at 0, the bars are almost equal.' },
          { do: 'Now make the difference look as <b>big as possible</b>.', goal: function (g) { return g('mgf') === 88; }, yes: 'Starting at 88 cuts off almost everything but the difference.' }] }),
        ways: [{ label: 'Read the numbers', html: '<p>Ignore the bar heights. Read the values and compare them yourself: 94 vs 90.</p>' }],
        key: '<p>Check where the axis <b>starts</b>.</p>',
        mistake: '<p>Comparing bar heights without reading the scale.</p>',
        check: [K.chk(C, 'da-mislead', 1), K.chk(C, 'da-mislead', 2)] },
      { id: 'fair', title: 'Fair conclusions', exp: ['D1.6', 'D1.4'], skill: 'da-mislead',
        body: '<p>Ask: Who collected the data, and why? How big was the sample? Are percents compared to the same total? A fair infographic shows its <b>source</b> and does not stretch the scales.</p>',
        watch: K.film([
          [T(['"9 out of 10 dentists agree"']), 'Sounds strong. But how many dentists were asked?'],
          [T(['only 10 dentists asked', 'by the toothpaste company']), 'A tiny sample, chosen by someone who wants a result.'],
          [T(['source? sample? scale?']), 'Three questions to ask of any graph.', 2600]
        ]),
        key: '<p>Check the <b>source</b>, the <b>sample</b> and the <b>scale</b>.</p>',
        mistake: '<p>Trusting a claim because it has a number in it.</p>',
        check: [K.chk(C, 'da-mislead', 3), K.num('Store A sold 50 bikes and store B sold 55. What percent more did B sell than A?', 10, 'Difference ÷ A.', '5 ÷ 50 = 0.1 = 10%.', { unit: '%' })] }
    ] },
    { id: 'code', title: 'Using code with data', sub: 'Let the computer count.', concepts: [
      { id: 'trace', title: 'Trace a loop', exp: ['C3.1', 'C3.2'], skill: 'da-code',
        body: '<p>This program checks each temperature in a list and counts the ones above a limit. To <b>trace</b> it, go through the list one value at a time, like the computer does.</p>',
        watch: K.film([
          [T(['temps = [4, −2, 7, 0, 5, 9, −6, 3]', 'if t > 3: count + 1']), 'Count the temperatures greater than 3.'],
          [T(['4 ✓  −2  7 ✓  0', '5 ✓  9 ✓  −6  3']), 'Check each one. 3 is not greater than 3.'],
          [T(['print(count) → 4']), 'Four values pass. It prints 4.', 2600]
        ]),
        try: K.reuse(C, 2, { tasks: [
          { do: 'Change the code so it prints <b>5</b>, keeping the limit at 3.', goal: function (g) { return g('cdl') === 3 && /Output:\s*5/.test(g.text('#cdout')); }, yes: 'With >=, the 3 counts too.' },
          { do: 'Make it count <b>every</b> temperature (output 8).', goal: function (g) { return /Output:\s*8/.test(g.text('#cdout')); }, yes: 'Any limit below −6 lets every value pass.' }] }),
        key: '<p>Trace <b>one value at a time</b>, exactly as written.</p>',
        mistake: '<p>Treating > and >= the same. The boundary value only counts with >=.</p>',
        check: [K.chk(C, 'da-code', 1), K.chk(C, 'da-code', 2)] },
      { id: 'efficient', title: 'Efficient code', exp: ['C3.2'], skill: 'da-code', hard: true,
        body: '<p>Efficient code does the job in fewer steps. To find a count <b>and</b> a total, one loop that updates both beats two loops over the same list.</p>',
        watch: K.film([
          [T(['loop 1: count', 'loop 2: total']), 'Two loops read the list twice.'],
          [T(['one loop:', 'total = total + t', 'if t > 3: count + 1']), 'One loop does both jobs in a single pass.', 2800]
        ]),
        ways: [{ label: 'Like shopping', html: '<p>You would not walk the whole store once for milk and again for bread. Get both in one trip.</p>' }],
        key: '<p>One pass, <b>several jobs</b>.</p>',
        mistake: '<p>Resetting a counter inside the loop, so it never goes past 1.</p>',
        check: [K.chk(C, 'da-code', 3), K.num('The loop adds every value in [4, −2, 7, 0, 5, 9, −6, 3] to total. What is total at the end?', 20, 'Add them one at a time.', '4 − 2 + 7 + 0 + 5 + 9 − 6 + 3 = 20.')] }
    ] }
  ]);
})();