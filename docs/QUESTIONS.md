# Writing questions

## The question object

Every question is a plain object. Common fields:

| Field | Meaning |
| --- | --- |
| `q` | The question text (HTML allowed) |
| `type` | The answer type (below) |
| `fig` | Optional picture shown under the question (SVG or HTML) |
| `hint` | Shown after a first wrong answer |
| `steps` | A list of steps, shown one at a time after a miss |
| `explain` | Shown after the answer |
| `shape` | Set automatically by `Atlas.Q.vary` |
| `meta` | `{ k: 'check-key', ... }`: the facts the answer check needs |

## Answer types

| type | The child… | Fields |
| --- | --- | --- |
| `mc` | picks one answer | `options`, `answer` (index) |
| `num` | types a number | `answer`, optional `unit`, `tol` |
| `tap` | taps part of a picture | `pic` (SVG with `data-hit="key"` parts) and `answer` (key), **or** `tiles` (list of HTML) and `answer` (index); `answerText` |
| `pick` | picks every answer that fits | `options`, `answer` (list of indexes; not all of them) |
| `order` | taps cards into order | `items` **in the right order** (shown shuffled), optional `first` / `last` labels |
| `line` | places a marker on a number line | `min`, `max`, `tick`, `every`, `snap`, `answer`, `tol`, optional `hideValue` |
| `match` | matches pairs | `pairs: [[left, right], ...]` (right side shown shuffled) |
| `tf` | says true or false, then picks why | `answer` (true or false), optional `why: { options, answer }` |
| `fill` | fills blanks | `fill` (text with `[[]]` for each blank), `answers` (one number per blank) |
| `build` | builds it with a tool | `tool: 'base10'` or `'coins'`, `answer` (value; coins in cents) |

## Question shapes

Give every practice skill several shapes, so a child meets the same idea asked in different ways:

- **plain**: the original question.
- **picture**: the same idea shown with blocks, a number line or a diagram.
- **story**: a short everyday Canadian word problem. Rotate names (`Atlas.Q.name()`) and contexts. Keep sentences short.
- **reverse**: work backwards ("What number plus 25 makes 59?").
- **mistake**: a named child made a mistake. True or false, then why (`tf` with `why`).
- **order / match / pick / line / tap / build / fill**: new ways to answer the same idea.

Shapes unlock by level: `[minLevel, 'name', fn]`. Keep level 1 gentle and pictorial.

At the end of the chapter file, one line wires the shapes into every practice skill and turns on fresh quizzes:

```
Atlas.Q.shapes('numbers-1000', SHAPES);
```

Each skill keeps its first way of asking as `plain`. Don't copy this loop into a grade: use the shared helper.

`grade3/chapters/numbers-1000.js` is the worked example.

Grade kits may add small helpers for writing shapes, such as `G6.why(right, wrong)` in `grade6/assets/g6lessons.js`, which builds the "why" choices for a `tf` question. In Grade 3, `G3.pl(n, 'vote')` gives "1 vote" or "3 votes" and `G3.an('apple')` gives "an apple" (`grade3/assets/g3kit.js`), so generated sentences stay grammatical.

## Answer checks (required)

Every new shape sets `meta.k` and the facts behind the question, for example `meta: { k: 'round-tf', n: 349, said: 400 }`. Add a check with the same key to `tests/verify/gradeN.js`:

```
set('round-tf', (q, m) => (H.roundTo(m.n, 100) === m.said) === q.answer ? '' : 'truth');
```

The check must work the answer out again **in its own way**, without calling the site's code. It returns `''` when the answer is right, or a short message when it is wrong. Helpers are in `tests/validate.js` (`H.roundTo`, `H.fromWords`, `H.placeVal` and more).

## Full chapters

A chapter registered with `full: true` is built to the full teaching standard. Grade 3 Fractions is the first one. The checks hold a full chapter to these rules:

- **Every idea** has a Watch clip, a "My turn" example, a common mistake for grown-ups, its own practice skill, 3 **Together** problems and 5 **Your turn** questions about that idea only.
- **Together** (`together: [function () -> problem]`) is the guided "we do" step. A problem is `{ q, fig, steps: [{ prompt, q }], done }`. The child answers one step at a time. Problem 1 shows the prompt on every step, problem 2 on the first step only, and problem 3 on none. A wrong step gets its fix straight away, then the same step again.
- **Your turn** needs 4 right on the first try to mark the idea "Got it" (2 in other chapters).
- **Mistake fixes:** a question can set `wrong: { 'wrong answer in plain words': 'short fix that names the mistake' }`. The fix shows after that wrong answer, in Together, Your turn and practice, in place of the general hint (`Atlas.Q.diag`).
- **Warm-up:** an idea marked "Got it" comes back 1, 3, 7 and 21 days later in a short warm-up on the chapter page (`#chapter/review`). A miss sends it back to "Seen".
- **Practice skills:** every question, including the plain one, sets `meta.k` and has an answer check. Each skill makes 30 or more different questions. Level 3 must not mostly repeat level 1. True/false must be true between 25% and 75% of the time. The right choice must not usually be the longest, or nearly always in the same place.
- **Secure:** a skill in a full chapter is secure only after 3 right in a row at level 3 on two different days, and a later miss takes "secure" away. This works the same in every grade (the shared app, `assets/engine/site.js`), so any grade's chapter can become a full chapter.
