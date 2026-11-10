# Rules for working on Math Atlas

Read this before changing anything. The owner, Noel, is not a developer, so these rules stand in for a human code reviewer. Follow them on every change, however small.

## How a change goes live
1. Work on a branch, never directly on `main`. Pushing to `main` publishes to the live site, where a child uses it.
2. Run the checks before you push: `cd tests && npm install && npm test`. For a quicker pass while you work, run `npm run quick` or `node run.js --grade 3`.
3. Open a pull request. The **Checks** workflow runs on it. Merge only when it is green and Noel has OK'd the change.
4. The publish workflow runs the checks again and publishes only if they pass.
5. Add a line to `CHANGELOG.md` under today's date.
6. When something goes live, starts waiting on Noel, or a new part of Atlas is started (in either repository), update `checklist.html`, the "What's built" page Noel bookmarks.

## Where things live
See `docs/ARCHITECTURE.md`. In short:
- `assets/engine/` holds the **one shared copy** of the grade app (`site.js`: home page, practice, quiz, check-up, progress), the lesson engine (`lesson.js`), the toolbox (`manip.js/css`) and the answer types (`qkit.js/css`). Never copy these into a grade folder. A check fails if you do.
- `gradeN/assets/grade.js` holds that grade's settings (chapter list, home page words, options such as Grade 1's number pad) and its own drawing helpers. No app logic goes there.
- `gradeN/chapters/*.js` holds one chapter each: lessons, written quiz, practice skills, and question shapes.
- `assets/atlas-theme.css` is the one look for every grade. Don't add colours or fonts in a grade.

## Writing questions
See `docs/QUESTIONS.md`. Every new question shape:
- uses a type from `qkit.js` (or the older `mc` / `num`);
- sets `meta: { k: 'some-key', ... }`;
- has a matching answer check in `tests/verify/gradeN.js` that works the answer out **independently**.

A shape without an answer check fails the checks on purpose.

## Improving a lesson
Every expectation belongs to one **concept family** in `plan/families.js` (for example Fractions, Grades 1 to 7). When you improve a lesson, a picture or a question shape, look up its family and check the same idea in the other grades. Carry the improvement to them where it fits, in the same pull request or a follow-up one, and say in the pull request which grades you checked. On the site, the concept map's "By idea" view shows the same list.

## House rules (Noel's)
- One calm, premium look across all grades. Nothing gamified. No read-aloud.
- "Common mistake" boxes show only in the grown-up view.
- Canadian conventions: metric, CAD, a space in numbers with 5 or more digits, Canadian spelling.
- Short, plain sentences for children. Plain English for Noel; explain any jargon.

## Keep it tidy
- Keep each change focused: one goal per pull request.
- Don't leave dead code, debug logs or commented-out blocks behind.
- If two grades need the same thing, put it in `assets/engine/` once rather than copying it.
- If you change how something works, update the doc that describes it in the same pull request.
