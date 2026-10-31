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
        example: K.film([
          [T(['Does screen time', 'relate to sleep?']), 'My turn. I will decide: is this question about one variable or two?'],
          [T(['for each student:', 'screen time + hours of sleep']), 'First I ask what I would record for each student: screen time and hours of sleep. That is two things.'],
          [T(['"relate to" → two-variable']), 'The words "relate to" also tell me I am comparing two things. So it is two-variable data.'],
          [T(['What is the most common', 'shoe size in our class?']), 'Now a second question. For each student I record just one thing, shoe size. One-variable.'],
          [T(['screen time and sleep: two', 'shoe size: one']), 'Count the things you record <b>for each one</b>: one or two.', 2600]
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
        example: K.film([
          [T(['backpack mass: 6.3 kg']), 'My turn. I will sort two kinds of data. First, backpack mass. I measure it on a scale.'],
          [T(['measured → continuous']), 'Mass can be any value, like 6.3 kg or 6.35 kg. So it is continuous.'],
          [T(['books inside: 4']), 'Next, the number of books inside. I count them.'],
          [T(['counted → discrete']), 'You cannot have 4.5 books, so it is discrete. <b>Measure: continuous. Count: discrete.</b>', 2600]
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
        example: K.film([
          [T(['a seedling’s height,', 'measured every day']), 'My turn. I will choose a graph for this data.'],
          [T(['one measurement,', 'changing over time']), 'First I ask what kind of data it is. It is one measurement, and it changes over time.'],
          [T(['change over time', '→ line graph']), 'Change over time calls for a line graph. The line shows the growth from day to day.'],
          [T(['no categories → not bar', 'one measurement → not scatter']), 'I check the others. There are no categories, so not a bar graph. There is only one measurement, so not a scatter plot. <b>Match the graph to the kind of data.</b>', 3000]
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
        example: K.film([
          [plot(0), 'My turn. Student K is 157 cm tall, with an arm span of 159 cm. I will plot this pair.'],
          [T(['height → across', 'arm span → up']), 'First I check the axes: height goes across, arm span goes up.'],
          [F.scatter({ pts: [[157, 159]], xs: [145, 180, 5], ys: [145, 180, 5], title: 'Height and arm span', xl: 'Height (cm)', yl: 'Arm span (cm)', hl: 'last', desc: 'One dot at 157 across and 159 up.' }), 'Next I go across to 157, then up to 159, and put one dot there.'],
          [plot(10, { pts: HT.concat([[157, 159]]), hl: 'last', desc: 'Eleven students plotted. Student K fits the rising pattern.' }), 'I check: with the rest of the class, the new dot fits the rising pattern. <b>One pair, one dot: across first, then up.</b>', 2800]
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
        example: K.film([
          [F.scatter({ pts: F.makePts(-1, 'strong', 11, 18), nums: false, xl: 'Temperature', yl: 'Hot drinks sold', desc: 'Points fall from left to right, close to a line.' }), 'My turn. This plot compares the temperature with the hot drinks sold at a rink. I will describe it.'],
          [F.scatter({ pts: F.makePts(-1, 'strong', 11, 18), nums: false, xl: 'Temperature', yl: 'Hot drinks sold', desc: 'Points fall from left to right, close to a line.' }), 'First the direction. Reading left to right, the dots go down. That is negative: warmer days, fewer hot drinks.'],
          [F.scatter({ pts: F.makePts(-1, 'strong', 11, 18), nums: false, xl: 'Temperature', yl: 'Hot drinks sold', desc: 'Points fall from left to right, close to a line.' }), 'Next the strength. The dots stay close to a line, so it is strong.'],
          [T(['strong negative']), 'So it is a <b>strong negative</b> relationship. Say the direction, then the strength.', 2400]
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
        example: K.film([
          [T(['bigger shoe size', 'higher reading score']), 'My turn. In a school from Grade 1 to Grade 8, students with bigger feet have higher reading scores. I will decide if one causes the other.'],
          [T(['do big feet help reading?']), 'First I ask: could bigger feet make someone read better? No, that makes no sense.'],
          [T(['older students:', 'bigger feet, more reading']), 'Next I look for something that affects both. Older students have bigger feet, and more years of reading practice.'],
          [T(['age affects both']), 'So age is behind both. <b>Related does not mean caused by.</b>', 2600]
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
        example: K.film([
          [F.bars([48, 52], ['Plan A', 'Plan B'], 46, 'Votes'), 'My turn. This graph shows votes for two plans. Plan B looks three times as popular. I will check.'],
          [T(['axis starts at 46']), 'First I check where the axis starts. It starts at 46, not 0, so the bottom of each bar is cut off.'],
          [F.bars([48, 52], ['Plan A', 'Plan B'], 0, 'Votes'), 'Next I draw it from 0. Now the bars are nearly the same height.'],
          [T(['52 − 48 = 4 votes', '4 ÷ 48 ≈ 8%']), 'I work out the real difference: 4 votes, about 8% more. Not three times. <b>Check where the axis starts.</b>', 2800]
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
        example: K.film([
          [T(['"90% of Canadians', 'exercise every day"']), 'My turn. A headline makes this claim. I will check it with three questions.'],
          [T(['source: a gym ad']), 'First the source. It comes from a gym’s advertisement. The gym wants a big number.'],
          [T(['sample: 20 people,', 'all at the gym']), 'Next the sample. Only 20 people were asked, and all of them were at a gym. They do not stand for all Canadians.'],
          [T(['not a fair conclusion']), 'So the conclusion is <b>not fair</b>. Check the source, the sample and the scale.', 2600]
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
        example: K.film([
          [T(['nums = [6, 1, 8, 3, 10, 2]', 'if n &lt; 5: count + 1']), 'My turn. I will trace this loop. count starts at 0.'],
          [T(['6 no    1 yes → 1', '8 no    3 yes → 2']), 'I check one value at a time. 6 is not less than 5. 1 is, so count becomes 1. 8 is not. 3 is, so count becomes 2.'],
          [T(['10 no    2 yes → 3']), '10 is not less than 5. 2 is, so count becomes 3.'],
          [T(['print(count) → 3']), 'The loop ends, so it prints <b>3</b>. Trace one value at a time, exactly as written.', 2600]
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
        example: K.film([
          [T(['nums = [5, 8, 2, 7]', 'total? how many > 4?']), 'My turn. I need two answers from this list: the total, and how many values are greater than 4. I will get both in one loop.'],
          [T(['for n in nums:', 'total = total + n', 'if n > 4: count + 1']), 'First I put both jobs inside the same loop. Each value is read only once.'],
          [T(['5: total 5, count 1', '8: total 13, count 2']), 'I trace it. 5: total 5, count 1. 8: total 13, count 2.'],
          [T(['2: total 15, count 2', '7: total 22, count 3']), '2: total 15, and count stays 2. 7: total 22, count 3.'],
          [T(['total = 22, count = 3']), 'One pass gave both answers: total 22, count 3. <b>One pass, several jobs.</b>', 2600]
        ]),
        ways: [{ label: 'Like shopping', html: '<p>You would not walk the whole store once for milk and again for bread. Get both in one trip.</p>' }],
        key: '<p>One pass, <b>several jobs</b>.</p>',
        mistake: '<p>Resetting a counter inside the loop, so it never goes past 1.</p>',
        check: [K.chk(C, 'da-code', 3), K.num('The loop adds every value in [4, −2, 7, 0, 5, 9, −6, 3] to total. What is total at the end?', 20, 'Add them one at a time.', '4 − 2 + 7 + 0 + 5 + 9 − 6 + 3 = 20.')] }
    ] }
  ]);
})();