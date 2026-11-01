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
3. **Every page.** Every chapter, lesson screen, practice page and quiz opens with no errors.
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
