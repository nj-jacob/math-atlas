# Automatic checks

The checks in `tests/run.js` stand in for a careful human tester. They run:
- on every pull request (workflow **Checks**);
- before every publish (workflow **Publish to Firebase**). If any check fails, nothing is published and the live site stays as it was.

## What they check

1. **Repository rules.** Every script parses. The shared engine (the grade app `site.js`, lessons, toolbox and answer types) exists only once, in `assets/engine/`, and every grade page loads it, with its own `assets/grade.js` settings. Every Math Plan expectation in `plan/ladder.js` has one short plain-language line in `plan/blurbs.js` (140 characters at most).
2. **Every question.** Each practice skill is made 40 times at each level. Every lesson "Your turn" check and every written quiz question is checked too:
   - the question fits its type (for example, the right answer is one of the options);
   - nothing on screen says "undefined" or "NaN";
   - every newer question shape has its answer worked out again by `tests/verify/`.
3. **Every page.** Every chapter, lesson screen, practice page, quiz and Toolbox tool opens with no errors. On a phone-size screen the Toolbox blocks are tapped and dragged like a child would: add ones, drag a one into Tens to snap 10 ones into a ten, drag a ten off the mat, and Undo. The Toolbox number line is used the same way: put a marker on the line, jump by 10 twice, tap the line between 30 and 40 to zoom in, zoom out, and Undo. The Toolbox counters too: tap 12 counters onto two ten-frames ("10 and 2"), turn one over (11 + 1), share them into 5 groups (2 in each, 2 left over), drag one off the mat, and Undo. No number may show before Show number is on. The Toolbox number chart: count by 5 (20 squares coloured), jump from 23 to 47 ("23 + 24 = 47"), and Undo. Each step must do the right thing, and nothing may run off the side of the screen.
4. **Answering like a child.** On a phone-size screen (390 px wide), practice questions of every kind are answered right, and sometimes wrong first. They must be marked correctly. Nothing may run off the side of the screen. Fresh quizzes answered all right must score 7 of 7.
5. **Saved progress.** In every grade, progress saved the way the grade has always saved it (skill levels, secure skills, a quiz score, a check-up, the plan) still shows on the home and check-up pages, and practice saves back under the same keys in the same shape.

## Running them yourself

```
cd tests
npm install                 # first time only
npx playwright install chromium   # first time only
npm test                    # everything (several minutes)
npm run quick               # fewer tries, faster
node run.js --grade 3       # one grade
```

The last line says **ALL CHECKS PASSED** or lists each problem with the grade, chapter and skill it came from.
