/* Grade 3 Time, Mass and Capacity: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/time-mass.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020 (the codes the lessons name): E2.3 capacity with non-standard units; E2.4 mass with a pan balance;
   E2.6 time on analog and digital clocks, and seconds, minutes and hours.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function hm(h, m) { return h + ':' + two(m); }
  /* a clock to read, with its answer rows: 'hour' ([] o'clock), 'digital' ([]), 'past' ([] minutes past []), 'words' (quarter past ...) */
  function CK(h, m, how, q) {
    var eq, a;
    if (how === 'hour') { eq = ['[] o\'clock']; a = [h]; }
    else if (how === 'past') { eq = ['[] minutes past []']; a = [m, h]; }
    else if (how === 'words') {
      if (m === 15) { eq = ['quarter past []']; a = [h]; } else if (m === 30) { eq = ['half past []']; a = [h]; } else { eq = ['quarter to []']; a = [h % 12 + 1]; }
    } else { eq = ['[]']; a = [hm(h, m)]; }
    return { q: q || 'What time is it?', pic: ['clock', { h: h, m: m, R: 30 }], eq: eq, a: a };
  }
  /* draw the hands */
  function DR(h, m) { return { q: 'Draw the hands: ' + hm(h, m) + '.', pic: ['clock', { h: h, m: m, blank: true, R: 30 }] }; }
  /* amounts of time: '2 hours = [] minutes' */
  function TU(left, unit, ans) { return { eq: [left + ' = [] ' + unit], a: [ans], wide: left.length > 10 }; }
  /* how long from one time to another */
  function SP(from, to, q) { var a = from.split(':'), b = to.split(':'), d = ((+b[0] % 12) * 60 + +b[1] - (+a[0] % 12) * 60 - +a[1] + 720) % 720; return { q: q || 'How long from ' + from + ' to ' + to + '?', eq: ['[] minutes'], a: [d], span: [from, to] }; }
  function DU(thing, sec) { var u = sec < 90 ? 'seconds' : sec < 5400 ? 'minutes' : 'hours', o = ['seconds', 'minutes', 'hours']; return { q: 'Which unit for ' + thing + '?', pick: { opts: o, ans: o.indexOf(u), dur: sec }, wide: true }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* a pan balance: which is heavier? (tilt 1: the right side is down) */
  function HV(l, r, tilt) { return { q: 'Which is heavier?', pic: ['balance', { l: l, r: r, tilt: tilt }], pick: { opts: [l, r], ans: tilt === 1 ? 1 : 0 } }; }
  /* level with cubes: how many cubes? */
  function CU(thing, n) { return { q: 'The balance is level. How many cubes?', pic: ['balance', { l: thing, r: n, tilt: 0 }], eq: ['[] cubes'], a: [n], find: 'total' }; }
  /* full cups poured into a container */
  function CP(n, cont) { return { q: 'These full cups filled the ' + cont + '. How many cups does it hold?', pic: ['cups', { n: n }], eq: ['[] cups'], a: [n], find: 'total' }; }
  function FX(q, why) { return { q: q, pick: { opts: ['too small', 'too big'], ans: why === 'gaps' ? 0 : 1, cover: why } }; }
  function WH(q, ans) { var o = ['mass', 'capacity', 'time']; return { q: q, pick: { opts: o, ans: o.indexOf(ans) } }; }

  S.register('time-mass', { code: 'TM', ideas: {

    hands: {
      watch: 'reading the long hand as the hour, or naming the hour the short hand has not reached yet. Ask: which number has the short hand passed?',
      goal: 'I can read the hour from the short hand.',
      learn: {
        show: { pic: ['clock', { h: 3, m: 0 }], cap: 'Short hand on 3, long hand on 12', eq: ['3 o\'clock'] },
        together: [CK(5, 0, 'hour'), CK(9, 0, 'hour')],
        cue: 'Find the short hand first. The hour is the number it points to or has just passed.',
        own: [CK(2, 0, 'hour'), CK(11, 0, 'hour')]
      },
      p1: {
        show: { pic: ['clock', { h: 7, m: 50 }], cap: 'Near 8, but it has not reached it', eq: ['the hour is 7'] },
        items: [CK(4, 0, 'hour'), CK(8, 0, 'hour'), DR(10, 0), DR(3, 0)]
      },
      p2: {
        items: [CK(7, 30, 'digital', 'The short hand is past 7. What time is it?'), CK(2, 30, 'digital'), CK(10, 0, 'hour'), CK(5, 30, 'digital'), DR(6, 0), DR(12, 0)]
      },
      p3: {
        items: [CK(8, 45, 'digital', 'The short hand is near 9. What time is it?'), CK(3, 50, 'digital'), DR(9, 0), DR(1, 30),
          { q: '{a} says this clock shows 8 o\'clock. Fix it.', pic: ['clock', { h: 7, m: 50 }], lines: { n: 2, key: 'The short hand has not reached 8. It is 7:50.' }, wide: true }]
      },
      think: {
        items: [{ q: 'How do you tell the hour hand from the minute hand?', lines: { n: 2, key: 'The hour hand is short. The minute hand is long.' } },
          { q: 'Where is the short hand at half past 4?', lines: { n: 2, key: 'Halfway between 4 and 5.' } },
          { q: 'What do you do at 7 o\'clock in the morning? At night?', lines: { n: 2, key: 'For example: wake up; get ready for bed.' } },
          { q: 'Why is the short hand between numbers most of the time?', lines: { n: 2, key: 'It moves slowly all hour, from one number to the next.' } }]
      }
    },

    fives: {
      watch: 'reading the number the long hand points to as the minutes (the 8 as "8 minutes"). Count by 5s from 12, pointing at each number.',
      goal: 'I can count the minutes by 5s.',
      learn: {
        show: { pic: ['clock', { h: 4, m: 25 }], cap: 'Long hand on 5: 5, 10, 15, 20, 25', eq: ['25 minutes past 4'] },
        together: [CK(2, 40, 'past'), CK(6, 10, 'past')],
        cue: 'Start at 12. Count by 5s to the long hand. Then read the hour.',
        own: [CK(9, 20, 'past'), CK(1, 35, 'past')]
      },
      p1: {
        show: { cap: 'Each number on the clock is 5 more minutes', eq: ['8 × 5 = 40 minutes'] },
        items: [story('The long hand points to 3. Each number is 5 minutes. How many minutes past?', 'minutes', 15, '3 × 5'), story('The long hand points to 7. Each number is 5 minutes. How many minutes past?', 'minutes', 35, '7 × 5'),
          CK(5, 15, 'digital'), CK(8, 45, 'digital'), CK(12, 55, 'digital'), CK(10, 30, 'digital')]
      },
      p2: {
        items: [CK(4, 40, 'past'), CK(7, 25, 'past'), CK(1, 10, 'digital'), CK(6, 50, 'digital'), DR(2, 20), DR(9, 35)]
      },
      p3: {
        items: [CK(3, 55, 'digital'), CK(11, 5, 'digital'), DR(5, 45), DR(8, 10),
          { q: '{b} says the long hand on 8 means 8 minutes. Count by 5s. What is it?', eq: ['[] minutes'], a: [40], calc: '8 × 5' },
          { q: 'The long hand points to 11. Count by 5s. How many minutes past?', eq: ['[] minutes'], a: [55], calc: '11 × 5' }]
      },
      think: {
        items: [{ q: 'Why do we count the minutes by 5s?', lines: { n: 2, key: 'There are 5 minutes from one number to the next.' } },
          { q: 'How many minutes in one trip around the clock?', lines: { n: 1, key: '60 minutes: 12 × 5.' } },
          { q: 'The long hand is on 6. How far around has it gone?', lines: { n: 2, key: 'Halfway: 30 minutes.' } },
          { q: 'Make up a time with the long hand on 9. Write it two ways.', lines: { n: 2, key: 'For example: 2:45, or 45 minutes past 2.' } }]
      }
    },

    minute: {
      watch: 'stopping at the last 5 and forgetting the small marks. Count by 5s, then touch each small mark.',
      goal: 'I can read the time to the minute.',
      learn: {
        show: { pic: ['clock', { h: 6, m: 23 }], cap: 'By 5s to 20, then 1, 2, 3', eq: ['6:23'] },
        together: [CK(2, 17, 'digital'), CK(9, 54, 'digital')],
        cue: 'Count by 5s to the last number. Then count the small marks one at a time.',
        own: [CK(4, 8, 'digital'), CK(7, 36, 'digital')]
      },
      p1: {
        show: { cap: 'Past 10: by 5s to 50, then 4 more', eq: ['9:54'] },
        items: [CK(3, 12, 'digital'), CK(5, 47, 'digital'), CK(8, 3, 'digital'), CK(10, 31, 'digital')]
      },
      p2: {
        items: [CK(2, 44, 'past'), CK(7, 6, 'past'), DR(4, 13), DR(11, 27), CK(1, 52, 'digital'), CK(9, 38, 'digital')]
      },
      p3: {
        items: [CK(5, 59, 'digital'), CK(8, 1, 'digital'), DR(3, 48), DR(10, 4),
          { q: '{a} reads 10:54 when the short hand is just before 10. What is the time?', eq: ['[]'], a: ['9:54'], pic: ['clock', { h: 9, m: 54 }] }]
      },
      think: {
        items: [{ q: 'How many small marks are between two numbers?', lines: { n: 1, key: '5 marks: 1 minute each.' } },
          { q: 'Why is it tricky to read times like 9:56?', lines: { n: 2, key: 'The short hand is almost on 10, but the hour is still 9.' } },
          { q: 'Read a clock at home to the minute. Write the time.', lines: { n: 1, key: 'For example: 4:37.' } },
          { q: 'Explain how you read 6:23 on a clock.', lines: { n: 2, key: 'The short hand is past 6. Count by 5s to 20, then 3 more.' } }]
      }
    },

    words: {
      watch: 'naming quarter to after the hour just passed (6:45 as "quarter to 6"). "To" names the next hour.',
      goal: 'I can say quarter past, half past and quarter to.',
      learn: {
        show: { pic: ['clock', { h: 8, m: 15 }], cap: 'A quarter of the way around', eq: ['quarter past 8'] },
        together: [CK(8, 30, 'words'), CK(8, 45, 'words')],
        cue: 'Quarter past: 15 minutes. Half past: 30. Quarter to: 15 minutes before the next hour.',
        own: [CK(3, 15, 'words'), CK(6, 45, 'words')]
      },
      p1: {
        show: { pic: ['clock', { h: 6, m: 45 }], cap: '15 minutes before 7', eq: ['quarter to 7'] },
        items: [CK(1, 15, 'words'), CK(4, 30, 'words'), CK(9, 45, 'words'), CK(2, 45, 'words')]
      },
      p2: {
        items: [{ eq: ['quarter past 4 = []'], a: ['4:15'] }, { eq: ['half past 9 = []'], a: ['9:30'] },
          { eq: ['quarter to 3 = []'], a: ['2:45'] }, { eq: ['quarter to 12 = []'], a: ['11:45'] },
          DR(7, 15), DR(4, 45)]
      },
      p3: {
        items: [CK(7, 45, 'words'), CK(12, 30, 'words'), DR(1, 45), DR(10, 15),
          { q: '{b} says this is quarter to 6. Fix it.', pic: ['clock', { h: 6, m: 45 }], lines: { n: 2, key: 'It is quarter to 7: "to" names the next hour.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why is 15 minutes called a quarter?', lines: { n: 2, key: 'The long hand goes a quarter of the way around.' } },
          { q: 'How do you know if it is "past" or "to"?', lines: { n: 2, key: 'Right side of the clock: past. Left side: to.' } },
          { q: 'What do you do at half past 3 on a school day?', lines: { n: 2, key: 'For example: come home from school.' } },
          { q: 'Which is later, quarter to 5 or quarter past 5?', lines: { n: 2, key: 'Quarter past 5. Quarter to 5 is 4:45.' } }]
      }
    },

    screen: {
      watch: 'writing 3:5 for 3:05, or reading 3:05 and 3:50 as the same. Minutes always take two digits.',
      goal: 'I can read and write digital time.',
      learn: {
        show: { cap: 'Hours, a colon, then 2 digits for minutes', eq: ['5 minutes past 3 = 3:05'] },
        together: [CK(9, 1, 'digital'), CK(11, 15, 'digital')],
        cue: 'Write the hour, a colon, then the minutes with 2 digits. Under 10 minutes, start with 0.',
        own: [CK(4, 7, 'digital'), CK(6, 50, 'digital')]
      },
      p1: {
        show: { cap: '3:05 and 3:50 are not the same', eq: ['3:05 ≠ 3:50'] },
        items: [{ eq: ['quarter past 2 = []'], a: ['2:15'] }, { eq: ['half past 6 = []'], a: ['6:30'] },
          { eq: ['20 minutes past 7 = []'], a: ['7:20'] }, { eq: ['5 minutes past 1 = []'], a: ['1:05'] },
          CK(10, 9, 'digital'), CK(3, 40, 'digital')]
      },
      p2: {
        items: [CK(12, 2, 'digital'), CK(5, 55, 'digital'), { eq: ['quarter to 10 = []'], a: ['9:45'] }, { eq: ['8 minutes past 4 = []'], a: ['4:08'] },
          DR(3, 5), DR(3, 50)]
      },
      p3: {
        items: [{ eq: ['35 minutes past 11 = []'], a: ['11:35'] }, { eq: ['1 minutes past 8 = []'], a: ['8:01'] },
          DR(6, 9), DR(9, 41),
          { q: '{a} wrote 7:5 for 5 minutes past 7. Fix it.', lines: { n: 1, key: '7:05' } }, { q: 'Which is later: 2:08 or 2:40?', lines: { n: 1, key: '2:40' } }]
      },
      think: {
        items: [{ q: 'Why does 3:05 need the 0?', lines: { n: 2, key: 'Without it, 3:5 could be read as 3:50.' } },
          { q: 'Where do you see digital clocks?', lines: { n: 2, key: 'For example: a microwave, a phone, a car.' } },
          { q: 'Which is easier to read, digital or a clock face? Why?', lines: { n: 2, key: 'For example: digital, because it shows the numbers.' } },
          { q: 'Say 10:45 two ways.', lines: { n: 2, key: 'Ten forty-five, or quarter to 11.' } }]
      }
    },

    timer: {
      watch: 'treating the timer as one number (2:10 as 210 seconds). Minutes on the left, seconds on the right, and a minute is 60 seconds.',
      goal: 'I can read a timer in minutes and seconds.',
      learn: {
        show: { cap: 'A timer shows minutes, then seconds', eq: ['1:15 = 60 + 15', '75 seconds'] },
        together: [TU('1:30', 'seconds', 90), TU('2:10', 'seconds', 130)],
        cue: 'Each minute on the left is 60 seconds. Add the seconds on the right.',
        own: [TU('1:00', 'seconds', 60), TU('1:45', 'seconds', 105), TU('2:00', 'seconds', 120), TU('0:40', 'seconds', 40)]
      },
      p1: {
        show: { cap: '60 seconds make 1:00', eq: ['2:10 = 130 seconds'] },
        items: [TU('1:05', 'seconds', 65), TU('1:20', 'seconds', 80), TU('2:30', 'seconds', 150), TU('3:00', 'seconds', 180), TU('1:50', 'seconds', 110), TU('2:05', 'seconds', 125)]
      },
      p2: {
        items: [{ eq: ['90 seconds = []'], a: ['1:30'], timer: true }, { eq: ['70 seconds = []'], a: ['1:10'], timer: true },
          { eq: ['125 seconds = []'], a: ['2:05'], timer: true }, { eq: ['200 seconds = []'], a: ['3:20'], timer: true },
          story('A timer is set for 60 seconds. 25 seconds have passed. How many seconds are left?', 'seconds', 35, '60 − 25'), TU('1:15', 'seconds', 75)]
      },
      p3: {
        items: [TU('3:45', 'seconds', 225), TU('4:00', 'seconds', 240), { eq: ['150 seconds = []'], a: ['2:30'], timer: true },
          story('{a} holds a plank for 0:50, then 0:40. How many seconds in all?', 'seconds', 90, '50 + 40'),
          { q: '{b} says 2:10 is 210 seconds. Fix it.', lines: { n: 2, key: '2 minutes is 120 seconds, plus 10 makes 130 seconds.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why is 1:30 not 130 seconds?', lines: { n: 2, key: 'A minute is 60 seconds, so 1:30 is 60 + 30 = 90 seconds.' } },
          { q: 'Time yourself doing 10 jumping jacks. Write the time.', lines: { n: 1, key: 'For example: 0:12.' } },
          { q: 'What would you use a timer for at home?', lines: { n: 2, key: 'For example: cooking, brushing teeth, a game.' } },
          { q: 'What does a timer show after 59 seconds go by, then 1 more?', lines: { n: 1, key: '1:00' } }]
      }
    },

    units: {
      watch: 'using 100 instead of 60 (1 hour = 100 minutes). The long hand goes once around in 60 minutes.',
      goal: 'I can use seconds, minutes and hours.',
      learn: {
        show: { cap: '60 seconds make 1 minute. 60 minutes make 1 hour.', eq: ['2 hours = 120 minutes'] },
        together: [TU('1 hour', 'minutes', 60), TU('2 minutes', 'seconds', 120)],
        cue: 'Each bigger unit is 60 of the smaller one. Add 60 for each.',
        own: [TU('3 hours', 'minutes', 180), TU('1 minute 20 seconds', 'seconds', 80), DU('a blink', 1), DU('a movie', 7200)]
      },
      p1: {
        show: { cap: 'Brushing your teeth', eq: ['about 2 minutes'] },
        items: [DU('brushing your teeth', 120), DU('a sleep at night', 36000), DU('tying a shoe', 15), DU('a soccer game', 5400), TU('4 minutes', 'seconds', 240), TU('2 hours', 'minutes', 120)]
      },
      p2: {
        items: [TU('1 hour 15 minutes', 'minutes', 75), TU('3 minutes 30 seconds', 'seconds', 210), DU('a car ride to the next city', 9000), DU('eating breakfast', 900),
          { eq: ['120 seconds = [] minutes'], a: [2] }, { eq: ['180 minutes = [] hours'], a: [3] }]
      },
      p3: {
        items: [TU('5 minutes', 'seconds', 300), TU('2 hours 30 minutes', 'minutes', 150), DU('a sneeze', 2), DU('a school day', 23400),
          { q: '{a} says 1 hour = 100 minutes. Fix it.', lines: { n: 1, key: '1 hour = 60 minutes.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Name something that takes about 1 second, 1 minute and 1 hour.', lines: { n: 3, key: 'For example: a clap, washing hands, a hockey game.' } },
          { q: 'Why don\'t we time a trip in seconds?', lines: { n: 2, key: 'The number would be huge. Hours or minutes are easier.' } },
          { q: 'How many seconds in half a minute?', lines: { n: 1, key: '30 seconds.' } },
          { q: 'How many minutes in a day of school, about?', lines: { n: 2, key: 'For example: about 6 hours, or 360 minutes.' } }]
      }
    },

    later: {
      watch: 'subtracting times like plain numbers (3:15 − 2:40 = 75). Count on: first to the next hour, then on.',
      goal: 'I can find how long from one time to another.',
      learn: {
        show: { cap: '2:40 to 3:00 is 20. 3:00 to 3:15 is 15.', eq: ['20 + 15 = 35 minutes'] },
        together: [SP('2:40', '3:15'), SP('4:50', '5:35')],
        cue: 'Hop to the next hour. Then hop on to the end time. Add the hops.',
        own: [SP('1:30', '2:10'), SP('9:45', '10:20'), SP('6:00', '6:45'), SP('11:20', '12:05')]
      },
      p1: {
        show: { cap: '4:50 to 5:00 is 10, then 35 more', eq: ['45 minutes'] },
        items: [SP('3:00', '3:40'), SP('7:10', '7:55'), SP('8:30', '9:00'), SP('5:15', '5:50'), SP('1:45', '2:15'), SP('10:40', '11:05')]
      },
      p2: {
        items: [SP('3:35', '4:20', 'Soccer starts at 3:35 and ends at 4:20. How long?'), SP('6:50', '7:30', 'A movie starts at 6:50. It ends at 7:30. How long?'),
          SP('12:15', '12:50'), SP('9:25', '10:10'), SP('2:55', '3:25'), SP('11:40', '12:30')]
      },
      p3: {
        items: [SP('8:45', '9:35', 'The bus leaves at 8:45 and arrives at 9:35. How long is the ride?'), SP('4:20', '5:05', 'Swimming is 4:20 to 5:05. How long?'),
          story('A cake bakes for 35 minutes. It went in at 2:10. At how many minutes past 2 is it done?', 'minutes past 2', 45, '10 + 35'),
          { q: '{a} says 3:15 − 2:40 is 75 minutes. Fix it.', lines: { n: 2, key: 'An hour is 60 minutes, not 100. Count on: 20 + 15 = 35 minutes.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why can\'t you subtract times like normal numbers?', lines: { n: 2, key: 'An hour has 60 minutes, not 100.' } },
          { q: 'How long is your school day? Show your hops.', lines: { n: 2, key: 'For example: 8:45 to 3:15 is 6 hours 30 minutes.' } },
          { q: 'Why hop to the hour first?', lines: { n: 2, key: 'O\'clock times are easy to count on from.' } },
          { q: 'Plan an hour: list 3 things and how long each takes.', lines: { n: 3, key: 'For example: homework 20 minutes, reading 25, play 15.' } }]
      }
    },

    balance: {
      watch: 'judging mass by size. A big pillow is not always heavier than a small stone. The lower side is heavier.',
      goal: 'I can compare masses with a pan balance.',
      learn: {
        show: { cap: 'Shoe and mug: the mug side went down', eq: ['the mug is heavier'] },
        together: [HV('pillow', 'stone', 1), HV('book', 'pencil', -1)],
        cue: 'The heavier side goes down. Level means the same mass.',
        own: [HV('apple', 'grape', -1), HV('feather', 'marble', 1)]
      },
      p1: {
        show: { cap: 'A big pillow and a small stone: the stone side went down', eq: ['bigger is not always heavier'] },
        items: [HV('rock', 'leaf', -1), HV('cup', 'jug', 1), HV('hat', 'boot', 1), HV('melon', 'lemon', -1)]
      },
      p2: {
        items: [HV('balloon', 'coin', 1), HV('brick', 'sponge', -1), HV('crayon', 'bottle', 1),
          { q: 'Which is heavier? Explain.', pic: ['balance', { l: 'ball', r: 'block', tilt: 0 }], lines: { n: 2, key: 'Neither: the balance is level, so they have the same mass.' } }]
      },
      p3: {
        items: [HV('tissues', 'soup can', 1), HV('dictionary', 'tennis ball', -1),
          { q: 'A pear is heavier than an apple. An apple is heavier than a plum. Which is lightest?', pick: { opts: ['pear', 'apple', 'plum'], ans: 2 }, chain: ['pear', 'apple', 'plum'] },
          { q: 'Draw a balance with the heavier thing on the right.', draw: { h: 80, key: 'A balance tipped down on the right.' } }]
      },
      think: {
        items: [{ q: 'Why can a small thing be heavier than a big thing?', lines: { n: 2, key: 'It can be made of heavier stuff, like a stone and a pillow.' } },
          { q: 'Hold two things. Guess which is heavier. Check with a balance.', lines: { n: 2, key: 'For example: a book was heavier than a shoe.' } },
          { q: 'What does it mean when the balance is level?', lines: { n: 2, key: 'Both sides have the same mass.' } },
          { q: 'How could you find the heaviest of 3 things with a balance?', lines: { n: 3, key: 'Compare two, then compare the heavier one with the third.' } }]
      }
    },

    cubes: {
      watch: 'counting cubes before the balance is level, or losing count. Wait until level, then count in rows.',
      goal: 'I can measure mass in cubes.',
      learn: {
        show: { cap: 'Level: the apple balances 9 cubes', eq: ['apple = 9 cubes'] },
        together: [CU('orange', 11), CU('pencil case', 6)],
        cue: 'Add cubes one at a time until the balance is level. Then count them.',
        own: [CU('banana', 8), CU('cup', 12)]
      },
      p1: {
        show: { cap: 'Rows of 4: 4, 8, then 3 more', eq: ['11 cubes'] },
        items: [CU('lemon', 7), CU('toy car', 10), CU('mug', 14), CU('egg', 5)]
      },
      p2: {
        items: [CU('glue stick', 4), CU('potato', 15),
          story('An apple balances 9 cubes. An orange balances 12. How many more for the orange?', 'cubes', 3, '12 − 9'), story('A pear balances 8 cubes. How many cubes for 2 pears?', 'cubes', 16, '8 + 8')]
      },
      p3: {
        items: [CU('shoe', 16), story('A shoe is 15 cubes. A book is 22. How many more is the book?', 'cubes', 7, '22 − 15'),
          story('3 eggs each balance 5 cubes. How many cubes for all 3?', 'cubes', 15, '3 × 5'),
          { q: '{a} counted cubes while the balance was still tipped. What will go wrong?', lines: { n: 2, key: 'The count is not the mass yet. Wait until it is level.' } }]
      },
      think: {
        items: [{ q: 'Why must the cubes all be the same?', lines: { n: 2, key: 'So each cube counts as the same amount of mass.' } },
          { q: 'Find something that balances about 10 cubes.', lines: { n: 1, key: 'For example: a small apple.' } },
          { q: 'Why count cubes in rows?', lines: { n: 2, key: 'So you do not lose count.' } },
          { q: 'Would a bigger cube give a bigger or smaller count?', lines: { n: 2, key: 'Smaller: each big cube is heavier.' } }]
      }
    },

    mest: {
      watch: 'thinking an estimate must be exact, or skipping it. Estimate, measure, then say how far off.',
      goal: 'I can estimate a mass, then measure it.',
      learn: {
        show: { cap: 'Guess 12 cubes. Measure 15 cubes.', eq: ['15 − 12 = 3', '3 off'] },
        together: [story('{a} guessed 20 cubes. The mug was 18. How far off?', 'cubes', 2, '20 − 18'), story('{b} guessed 10. The pear was 13. How far off?', 'cubes', 3, '13 − 10')],
        cue: 'Think of something you know ("an apple is about 9 cubes"). Guess, measure, then find the difference.',
        own: [story('Guess 25, measured 21. How far off?', 'cubes', 4, '25 − 21'), story('Guess 7, measured 7. How far off?', 'cubes', 0, '7 − 7')]
      },
      p1: {
        show: { cap: 'An apple is about 9 cubes', eq: ['2 apples: about 18'] },
        items: [story('An apple is about 9 cubes. About how many for 2 apples?', 'cubes', 18, '9 + 9'), story('A pencil is about 2 cubes. About how many for 5 pencils?', 'cubes', 10, '5 × 2'),
          story('Guess 30, measured 26. How far off?', 'cubes', 4, '30 − 26'), story('Guess 14, measured 17. How far off?', 'cubes', 3, '17 − 14')]
      },
      p2: {
        items: [{ q: 'An apple is about 9 cubes. Is a melon about 3, 9 or 40 cubes?', pick: { opts: ['3', '9', '40'], ans: 2, big: true }, lines: { n: 1, key: 'A melon is much heavier than an apple.' } },
          { q: 'A book is about 20 cubes. Is a crayon about 1, 20 or 50 cubes?', pick: { opts: ['1', '20', '50'], ans: 0, small: true }, lines: { n: 1, key: 'A crayon is much lighter than a book.' } },
          story('{a} guessed 16, {b} guessed 22. It was 19. How far off was {a}?', 'cubes', 3, '19 − 16'), story('{b} guessed 22. The mug was 19. How far off?', 'cubes', 3, '22 − 19')]
      },
      p3: {
        items: [story('Guess 45, measured 38. How far off?', 'cubes', 7, '45 − 38'), story('A bag of rice is about 50 cubes. About how many for 3 bags?', 'cubes', 150, '3 × 50'),
          { q: 'Why is a close estimate still useful?', lines: { n: 2, key: 'It tells you about how heavy it is before you measure.' }, wide: true }]
      },
      think: {
        items: [{ q: 'How do you make a good estimate of mass?', lines: { n: 2, key: 'Compare to something you know, and hold both.' } },
          { q: '{a}\'s estimate was 2 off. Was it wrong? Explain.', lines: { n: 2, key: 'No. An estimate is a close guess, not exact.' } },
          { q: 'Estimate, then measure, 3 things. How close were you?', lines: { n: 3, key: 'For example: guessed 10, was 12 (2 off).' } },
          { q: 'Did your estimates get closer? Why?', lines: { n: 2, key: 'Yes, because I learned what a cube feels like.' } }]
      }
    },

    cups: {
      watch: 'losing count, or thinking a taller container always holds more. Pour, count each full cup, and compare counts.',
      goal: 'I can measure capacity with cups.',
      learn: {
        show: { pic: ['cups', { n: 8 }], cap: 'Full to the top: the jug holds 8 cups', eq: ['8 cups'] },
        together: [CP(6, 'pot'), CP(4, 'vase')],
        cue: 'Pour full cups one at a time. Count each one until the container is full.',
        own: [CP(9, 'bucket'), CP(5, 'bowl')]
      },
      p1: {
        show: { cap: 'Taller is not always more', eq: ['count the cups'] },
        items: [CP(3, 'mug'), CP(7, 'jug'), CP(10, 'bucket'), CP(2, 'bottle')]
      },
      p2: {
        items: [story('A jug holds 8 cups. A bottle holds 5 cups. How many more does the jug hold?', 'cups', 3, '8 − 5'), story('A pot holds 6 cups. How many cups do 2 pots hold?', 'cups', 12, '6 + 6'),
          CP(8, 'kettle'), CP(6, 'pitcher')]
      },
      p3: {
        items: [story('A tall vase holds 4 cups. A wide bowl holds 7 cups. How many more does the bowl hold?', 'cups', 3, '7 − 4'), story('A tub holds 12 cups. 5 are poured in. How many more to fill it?', 'cups', 7, '12 − 5'),
          { q: 'A tall glass and a wide bowl: which holds more? How can you tell?', lines: { n: 2, key: 'Pour cups into both and count. Tall does not always mean more.' }, wide: true }]
      },
      think: {
        items: [{ q: 'What is capacity?', lines: { n: 2, key: 'How much a container holds.' } },
          { q: 'Why must each cup be full?', lines: { n: 2, key: 'So each cup counts as the same amount.' } },
          { q: 'Find two containers at home. Guess which holds more. Check with cups.', lines: { n: 3, key: 'For example: the pot held 6 cups, the jug 8.' } },
          { q: 'Why might a short, wide container hold more than a tall, thin one?', lines: { n: 2, key: 'It is wider, so it has more space inside.' } }]
      }
    },

    careful: {
      watch: 'not filling each cup to the top, letting it overflow, or using units that leave gaps. Fill to the line, stop at the top.',
      goal: 'I can measure capacity carefully.',
      learn: {
        show: { cap: 'Full cups, no spills, no gaps', eq: ['a careful count'] },
        together: [FX('{a} did not fill the cups to the top. Is the count too small or too big?', 'notfull'), FX('{b} filled the jug with blocks, leaving gaps. Is the count too small or too big?', 'gaps')],
        cue: 'Fill each cup to the top. Stop when the container is full. Use units that pour, like water or rice.',
        own: [FX('The bucket overflowed. Is the count too small or too big?', 'spill'), FX('Some cups were half full. Is the count too small or too big?', 'notfull')]
      },
      p1: {
        show: { cap: 'Half-full cups mean extra cups', eq: ['count too big'] },
        items: [FX('{a} spilled while pouring. Is the count too small or too big?', 'spill'), FX('{b} used marbles, with gaps between them. Is the count too small or too big?', 'gaps'),
          CP(7, 'jug'), CP(9, 'pot')]
      },
      p2: {
        items: [FX('The cups were not full. Too small or too big?', 'notfull'), FX('Big blocks left gaps. Too small or too big?', 'gaps'),
          { q: 'Which is better for measuring capacity: rice or blocks? Why?', lines: { n: 2, key: 'Rice: it fills the space with no gaps.' } }, { q: 'How do you know a cup is full?', lines: { n: 2, key: 'It is filled right to the top, not spilling.' } }]
      },
      p3: {
        items: [FX('{a} poured until it spilled over. Too small or too big?', 'spill'), story('{b} counted 9 cups, but 1 spilled out. How many does the jug really hold?', 'cups', 8, '9 − 1'),
          { q: 'Write 3 rules for measuring capacity carefully.', lines: { n: 3, key: 'Fill each cup to the top. Stop when full. Use units with no gaps.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why does a half-full cup make the count too big?', lines: { n: 2, key: 'You need more half-full cups to fill the container.' } },
          { q: 'Why do blocks make the count too small?', lines: { n: 2, key: 'They leave gaps, so the space is not all counted.' } },
          { q: 'Practise at the sink. What did you notice?', lines: { n: 2, key: 'For example: careful pouring gave the same count each time.' } },
          { q: 'Why should everyone use the same size cup?', lines: { n: 2, key: 'So the counts can be compared.' } }]
      }
    },

    cest: {
      watch: 'adding the cups and the jugs instead of counting groups, or guessing wildly. Use a known container as a benchmark.',
      goal: 'I can estimate capacity with a known container.',
      learn: {
        show: { cap: 'A jug holds 4 cups. The pot holds 3 jugs.', eq: ['4 + 4 + 4 = 12 cups'] },
        together: [story('A jug holds 5 cups. A bucket holds 2 jugs. About how many cups?', 'cups', 10, '5 + 5'), story('A bottle holds 3 cups. A jug holds 4 bottles. About how many cups?', 'cups', 12, '4 × 3')],
        cue: 'Count how many of the known container fit. Then count by its cups.',
        own: [story('A mug holds 2 cups. A pot holds 5 mugs. About how many cups?', 'cups', 10, '5 × 2'), story('A jug holds 6 cups. A tub holds 3 jugs. About how many cups?', 'cups', 18, '3 × 6')]
      },
      p1: {
        show: { cap: '3 jugs of 4 cups', eq: ['not 3 + 4'] },
        items: [story('A jug holds 4 cups. A sink holds 5 jugs. About how many cups?', 'cups', 20, '5 × 4'), story('A cup is 1. A bowl is 3 cups. 4 bowls: how many cups?', 'cups', 12, '4 × 3'),
          story('A bottle holds 2 cups. A cooler holds 6 bottles. How many cups?', 'cups', 12, '6 × 2'), story('A pail holds 5 cups. 4 pails: how many cups?', 'cups', 20, '4 × 5')]
      },
      p2: {
        items: [{ q: 'A mug holds about 2 cups. Does a bathtub hold about 5, 50 or 500 mugs?', pick: { opts: ['5', '50', '500'], ans: 2, big: true }, lines: { n: 1, key: 'A bathtub is huge compared with a mug.' } },
          { q: 'A jug holds about 8 cups. Does a glass hold about 1, 8 or 20 cups?', pick: { opts: ['1', '8', '20'], ans: 0, small: true }, lines: { n: 1, key: 'A glass is much smaller than a jug.' } },
          story('A jug holds 6 cups. A pot holds 2 jugs. About how many cups?', 'cups', 12, '2 × 6'), story('A watering can holds 7 cups. 3 cans: how many cups?', 'cups', 21, '3 × 7')]
      },
      p3: {
        items: [story('A jug holds 8 cups. A tub holds 4 jugs. About how many cups?', 'cups', 32, '4 × 8'), story('A pot holds 10 cups. A sink holds 3 pots and 4 more cups. How many cups?', 'cups', 34, '3 × 10 + 4'),
          { q: '{a} says 3 jugs of 4 cups is 7 cups. Fix it.', lines: { n: 2, key: '3 jugs of 4 cups is 4 + 4 + 4 = 12 cups.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why use a known container to estimate?', lines: { n: 2, key: 'It gives a picture of the amount, so the estimate is closer.' } },
          { q: 'Pick a container at home as your benchmark. How much does it hold?', lines: { n: 2, key: 'For example: my water bottle holds about 3 cups.' } },
          { q: 'About how many cups does your kitchen sink hold? How did you estimate?', lines: { n: 3, key: 'For example: about 40 cups; it holds about 5 pots of 8 cups.' } },
          { q: 'How could you check your estimate?', lines: { n: 2, key: 'Fill it with cups and count.' } }]
      }
    },

    which: {
      watch: 'mixing up mass and capacity (weighing a bottle to see how much it holds). Ask: how heavy, how much it holds, or how long?',
      goal: 'I can choose what to measure.',
      learn: {
        show: { cap: 'How heavy: mass. How much it holds: capacity. How long: time.', eq: ['mass, capacity, time'] },
        together: [WH('How heavy is a pumpkin?', 'mass'), WH('How much water does a pot hold?', 'capacity')],
        cue: 'Ask: how heavy, how much it holds, or how long it takes?',
        own: [WH('How long does recess last?', 'time'), WH('Which is heavier, a book or a shoe?', 'mass'), WH('How much juice fills the jug?', 'capacity'), WH('How long does it take to walk home?', 'time')]
      },
      p1: {
        show: { cap: 'Weighing a bottle tells its mass, not what it holds', eq: ['holds: capacity'] },
        items: [WH('How heavy is your backpack?', 'mass'), WH('How many cups does the bucket hold?', 'capacity'), WH('How long does a song take?', 'time'),
          WH('Does the apple or the orange weigh more?', 'mass'), WH('How much soup fills the bowl?', 'capacity'), WH('How long does a bath take?', 'time')]
      },
      p2: {
        items: [WH('How much sand does the pail hold?', 'capacity'), WH('Is the watermelon heavy?', 'mass'), WH('How many minutes does the bus take?', 'time'),
          { q: 'What tool measures mass?', pick: { opts: ['balance', 'cup', 'clock'], ans: 0 }, tool3: 'mass' }, { q: 'What tool measures capacity?', pick: { opts: ['balance', 'cup', 'clock'], ans: 1 }, tool3: 'capacity' },
          { q: 'What tool measures time?', pick: { opts: ['balance', 'cup', 'clock'], ans: 2 }, tool3: 'time' }]
      },
      p3: {
        items: [WH('How much milk does the glass hold?', 'capacity'), WH('How heavy is a bag of flour?', 'mass'), WH('How long does the movie take?', 'time'),
          { q: 'Plan a snack: write one thing to measure for mass, capacity and time.', lines: { n: 3, key: 'For example: an apple\'s mass, the juice a cup holds, the minutes to eat.' }, wide: true }]
      },
      think: {
        items: [{ q: 'What is the difference between mass and capacity?', lines: { n: 2, key: 'Mass is how heavy. Capacity is how much a container holds.' } },
          { q: 'Can a heavy thing hold a little? Give an example.', lines: { n: 2, key: 'Yes: a heavy stone pot with a small hole inside.' } },
          { q: 'Name a job where people measure time.', lines: { n: 2, key: 'For example: a coach timing a race.' } },
          { q: 'What would you measure to bake a cake?', lines: { n: 3, key: 'Mass of flour, capacity of milk, and time in the oven.' } }]
      }
    }
  } });
})();
