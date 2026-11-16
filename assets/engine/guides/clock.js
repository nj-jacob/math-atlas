/* Teaching guide: Clock and calendar (Toolbox tool 'clock', Grades 1 to 4). Format: see assets/engine/guide.js. */
AtlasGuide.add('clock', {
  what: 'A clock with hands to drag, a stopwatch, an elapsed-time line and a calendar.',
  keys: [
    ['Clock', 'Drag the minute hand (the hour hand follows), or step the time with the buttons. Run lets the second hand go.'],
    ['Stopwatch', 'Grade 2 and up: start and stop, in minutes and seconds.'],
    ['Elapsed', 'Grade 3 and up: a start clock, an end clock and a line that jumps to the next hour, then by hours, then by minutes.'],
    ['Calendar', 'The month with holidays and the season. Tap two days to count the days and weeks between.'],
    ['Show number', 'Shows the digital time and the time in words.'],
    ['Undo', 'Takes back the last move.']
  ],
  bands: [
    {
      grades: [1, 4],
      start: [
        'Set the clock to 9:00. Ask: “Where is the short hand? The long hand?”',
        'Tap <b>+30 min</b>. Ask: “What time is it now?” (Half past 9.)',
        'Turn on <b>Show number</b> to check. Then choose a mini-lesson below.'
      ],
      lessons: [
        {
          t: 'Days of the week', codes: { 1: ['E2.3'] },
          goal: 'A week has 7 days, always in the same order.',
          ido: 'Open the <b>Calendar</b>. Point to today and read the days across: “Sunday, Monday…”',
          wedo: 'Together: “What day is tomorrow? What day was yesterday?”',
          youdo: 'The child finds the day of their birthday or a holiday this month.',
          ask: '“How many days until the weekend?”'
        },
        {
          t: 'Months and seasons', codes: { 1: ['E2.3'] },
          goal: 'Each month belongs to a season.',
          ido: 'Step through the months. “December, January, February: winter.”',
          wedo: 'Together, find the month after March and its season.',
          youdo: 'The child names a month for each season and a holiday in one of them.',
          ask: '“What season is your birthday in?”'
        },
        {
          t: 'Count the days', codes: { 1: ['E2.3'], 4: ['E2.3'] },
          goal: 'Count the days between two dates; 7 days make a week.',
          ido: 'Tap the 3rd and the 17th. “14 days: 2 weeks.”',
          wedo: 'Together, count from today to a holiday.',
          youdo: { 1: 'The child counts the days from the 1st to the 8th (7, one week).', 4: 'The child finds how many days and weeks from the 5th to the 26th (21 days, 3 weeks).' },
          ask: '“How do you count weeks quickly?”'
        },
        {
          t: 'Read the time', codes: { 2: ['E2.4'], 3: ['E2.6'] },
          goal: 'The short hand shows the hour; the long hand shows the minutes.',
          ido: { 2: 'Set 3:00, then step 5 minutes at a time: “5, 10, 15 minutes past: quarter past 3.”', 3: 'Set 7:40. “The hour hand is past 7. The minute hand is on 8: 40 minutes. 7:40, or 20 to 8.”' },
          wedo: { 2: 'Together, set half past 4 and quarter to 6.', 3: 'Together, set 2:25 p.m. and say it two ways.' },
          youdo: { 2: 'The child sets a time you say and reads one you set.', 3: 'The child sets 10:55 and 1:05 and reads them in words.' },
          ask: '“Why is the hour hand not exactly on the number?”'
        },
        {
          t: 'How long does it take?', codes: { 2: ['E2.4'], 3: ['E2.6'] },
          goal: 'Seconds and minutes measure how long things take.',
          ido: 'Open the <b>Stopwatch</b>. Start it and write your name. “About 5 seconds.”',
          wedo: 'Together, time how long it takes to tidy up 10 blocks.',
          youdo: 'The child guesses, then times, how long it takes to say the alphabet.',
          ask: '“Is a minute longer or shorter than you thought?”'
        },
        {
          t: 'An hour later', codes: { 2: ['E2.4'] },
          goal: 'In one hour, the minute hand goes all the way round once.',
          ido: 'Set 2:00. Tap <b>+1 h</b>. “The minute hand went all the way round. The hour hand moved to 3.”',
          wedo: 'Together, set 4:30 and find the time 30 minutes later, then 1 hour later.',
          youdo: 'The child says what time a 1-hour lesson starting at 9:00 ends, and sets it.',
          ask: '“How many minutes are in an hour?”'
        },
        {
          t: 'Elapsed time', codes: { 3: ['E2.6'], 4: ['E2.3'] },
          goal: 'Jump to the next hour, then by hours, then by minutes.',
          ido: 'In <b>Elapsed</b>, start 9:40, end 11:15. “20 minutes to 10:00, 1 hour to 11:00, 15 minutes to 11:15: 1 h 35 min.”',
          wedo: 'Together: 2:50 to 4:10 (1 h 20 min).',
          youdo: { 3: 'The child finds the time from 8:15 to 9:00, and from 10:30 to 12:00.', 4: 'The child finds the time from 7:45 a.m. to 10:20 a.m., and from 11:30 a.m. to 1:15 p.m.' },
          ask: '“Why jump to the next hour first?”'
        },
        {
          t: 'Before and after noon', codes: { 4: ['E2.3'] },
          goal: 'a.m. is before noon; p.m. is after.',
          ido: 'Set 11:30 a.m. and add 1 hour. “12:30 p.m. We passed noon.”',
          wedo: 'Together: a movie starts at 6:45 p.m. and lasts 1 h 50 min. When does it end? (8:35 p.m.)',
          youdo: 'The child plans a day: three activities with start times and how long each lasts.',
          ask: '“What happens at 12:00?”'
        }
      ],
      mistakes: [
        ['Reads the hour hand as the minutes.', 'Short hand: hours. Long hand: minutes.'],
        ['Reads 7:40 as 8:40 because the hour hand is near 8.', 'The hour hand moves toward 8 but has not reached it.'],
        ['Counts elapsed time from 9:40 to 11:15 as 1 h 75 min.', 'Jump to the next hour first.'],
        ['Counts the start day when counting days.', 'Count the jumps from one day to the next.']
      ]
    }
  ]
});
