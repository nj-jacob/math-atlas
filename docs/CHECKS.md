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
3. **Every page.** Every chapter, lesson screen, practice page, quiz and Toolbox tool opens with no errors. On a phone-size screen the Toolbox blocks are tapped and dragged like a child would: add ones, drag a one into Tens to snap 10 ones into a ten, drag a ten off the mat, and Undo. The Toolbox number line is used the same way: put a marker on the line, jump by 10 twice, tap the line between 30 and 40 to zoom in, zoom out, and Undo. The Toolbox counters too: tap 12 counters onto two ten-frames ("10 and 2"), turn one over (11 + 1), share them into 5 groups (2 in each, 2 left over), drag one off the mat, and Undo. No number may show before Show number is on. The Toolbox number chart: count by 5 (20 squares coloured), jump from 23 to 47 ("23 + 24 = 47"), and Undo. The Toolbox fraction kit: tap three fourths ("3/4", or "3 fourths" in Grades 1 and 2), split them into eighths (6/8), Undo, pack 7 fourths into 1 3/4, share 7 by 2 (3 1/2 each), put one share on the mat, and drag a third onto the mat. In Grades 4 and up it also: makes 0.37 from decimal pieces (0.3 in Grade 4) and checks the grid (30 tenth squares) and the Symbols window (37/100 and 37%), makes 5 groups of 1/4 and Undoes one, and counts halves to 10. From Grade 5 it joins 6/8 into 3/4, combines 3/8 and 2/8, and fits fourths into 3 (12). From Grade 6 it adds 1/2 and 1/3 with same-size pieces (5/6) and lines up a typed 65% and 3/4. In Grades 7 and 8 it works out 3/4 × 2/3 (6/12 = 1/2, with 6 small parts in the Area window), fits 2/3 into 3/4 (1 1/8, also in twelfths), finds 5/12 between 1/3 and 1/2, and lines up −3/4 and −1/2. Grade 8 also does 1 1/2 × 2/3 = 1 and types 150% (1 1/2) and 0.5% (1/200). From Grade 3 it uses Ratio: 3 groups of 1 red and 5 blue (1 to 5 = 3 to 15, in Grade 3), 3 apples for each of 4 children (12, in Grade 4), 2 : 3 four times as much (8 : 12) from Grade 5, 3 : 2 juice as 60% of the mix and 4 apples for $6 as $1.50 for 1 from Grade 6, adding 2 to both of 2 : 3 (4 : 5, off the graph's line) from Grade 7, and in Grade 8 compares 3 : 2 with 3 : 5 (A is stronger) and solves 3 : 5 = ? : 20 (12). The Toolbox balance: 5 + 3 balances 4 + 4, Make it balance shows 1 dashed cube after one is taken off, and from Grade 3 3 × 4 balances 6 + 6. From Grade 4 it tries 4 in x + 3 < 9 (true for x < 6), and Grades 4 to 6 solve a new puzzle by taking the same from both sides. Grade 6 solves a typed 2x + 3 = 11, Grade 7 3x + 2 = x + 8 and Grade 8 x + 4 = −2 with balloons. The Toolbox pattern builder: a core of 3 shapes repeated 3 times reads A B B, from Grade 3 position 7 of A B C is a red circle, numbers start at 2 and add 2, Grade 4 and up grow tiles with a table and a graph, Grade 6 and up show the rule 3n + 1 and step 20 (61), Grade 7 and up see 2n + 5 meet 4n + 1 at step 2, and Grade 8 starts at 6 and adds −2. Each step must do the right thing, and nothing may run off the side of the screen.
4. **Answering like a child.** On a phone-size screen (390 px wide), practice questions of every kind are answered right, and sometimes wrong first. They must be marked correctly. Nothing may run off the side of the screen. Fresh quizzes answered all right must score 7 of 7.
5. **Saved progress.** In every grade, progress saved the way the grade has always saved it (skill levels, secure skills, a quiz score, a check-up, the plan) still shows on the home and check-up pages, and practice saves back under the same keys in the same shape.
6. **Worksheets.** Every printable worksheet is drawn in every theme, with and without its answer key, in the real fonts (this one check may fetch Google Fonts). Nothing may run past the bottom of the page, outside the page or out of its question's column, and no word may be left unfilled. Every answer on every key is worked out again from the question by `tests/verify/sheets.js`: the sums with the answers filled in must be true, a picture must match its sum, a story's answer must follow from its numbers, and each circled choice must be the only right one. The Worksheets tab must open on a phone without running off the side, and printing a sheet with its key must give exactly 2 pages.

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
