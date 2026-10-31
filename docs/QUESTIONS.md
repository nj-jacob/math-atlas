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

```
var ch = Atlas.chapters['numbers-1000'];
ch.quizFresh = true;
ch.practice.forEach(function (sk) {
  var plain = sk.gen, extra = SHAPES[sk.id] || [];
  sk.gen = function (lv) { return Atlas.Q.vary(sk.id, lv, [[1, 'plain', plain]].concat(extra)); };
});
```

`grade3/chapters/numbers-1000.js` is the worked example.

Grade 6 wraps the same loop in one helper, `G6.shapes(CH, SHAPES)` in `grade6/assets/g6lessons.js`, called at the end of each chapter file. `G6.why(right, wrong)` builds the "why" choices for a `tf` question.

## Answer checks (required)

Every new shape sets `meta.k` and the facts behind the question, for example `meta: { k: 'round-tf', n: 349, said: 400 }`. Add a check with the same key to `tests/verify/gradeN.js`:

```
set('round-tf', (q, m) => (H.roundTo(m.n, 100) === m.said) === q.answer ? '' : 'truth');
```

The check must work the answer out again **in its own way**, without calling the site's code. It returns `''` when the answer is right, or a short message when it is wrong. Helpers are in `tests/validate.js` (`H.roundTo`, `H.fromWords`, `H.placeVal` and more).
