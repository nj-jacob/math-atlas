# How Math Atlas is built

Math Atlas is a set of plain web pages with no build step: what is in this repository is exactly what the browser loads. It is hosted on Firebase at https://ontario-math-atlas.web.app.

## Folders

| Folder or file | What it is |
| --- | --- |
| `index.html`, `curriculum.html` | Home page ("My plan", or "Plans" with one card per child for parents and tutors) and the Curriculum page (every grade and chapter). Both share the top bar and sign-in from `assets/home.js` and `home.css`. |
| `family.html`, `live.html` | Family sign-in and parent and tutor pages, and the "Work together" page |
| `404.html` | The "page not found" page. Firebase shows it for any address that does not exist. It uses `/` paths so it works at any depth. |
| `plan/` | Math Plan: placement test and learning plans, Grades 1 to 8 |
| `grade1/` … `grade8/` | One site per grade (see below) |
| `assets/engine/` | **Shared by every grade**: lesson engine, toolbox, answer types |
| `assets/atlas-theme.css` | The one look for every page |
| `assets/atlas-header.js` | The shared header on grade sites ("All grades" link to the Curriculum page) |
| `assets/icon.svg` | The site icon shown in browser tabs and bookmarks. Every page links to it. |
| `assets/load-note.js` | On the family and "Work together" pages: if sign-in cannot load, shows a short note instead of a blank page |
| `assets/fb.js`, `sync.js`, `family.js`, `live.js` | Sign-in and saving progress (Firebase) |
| `tests/` | Automatic checks (see `CHECKS.md`) |
| `.github/workflows/` | `checks.yml` runs the checks on pull requests. `deploy.yml` runs them again, then publishes `main`. |

## One grade site

`gradeN/index.html` loads, in this order:
1. `gradeN/assets/site.js`: the grade's app (chapter list, router, practice, quiz, check-up, progress). It creates the `Atlas` object.
2. `../assets/engine/qkit.js`: the answer types (`Atlas.Q`).
3. `../assets/engine/manip.js`: the toolbox of manipulatives (`Manip`: base-ten blocks, number lines, coins and more).
4. `../assets/engine/lesson.js`: the one-idea-per-screen lessons (`Atlas.lessons`).
5. `gradeN/assets/gNkit.js`: small helpers for that grade's chapters (optional).
6. `gradeN/chapters/*.js`: one file per chapter. Each one calls `Atlas.register(id, chapter)`.

## A chapter

```
Atlas.register('numbers-1000', {
  lessons:  [ { id, title, concepts: [ { id, title, body, watch, try, key, mistake, check } ] } ],
  quiz:     [ fixed questions ],
  quizFresh: true,          // the chapter quiz is made fresh each time from the practice skills
  practice: [ { id, name, code: 'B1.1', gen: function (level) { return question; } } ]
});
```

- **Practice skills** make a new question every time, at level 1, 2 or 3. The site moves a child up a level after 3 right in a row, and down after 2 misses.
- **Question shapes**: a skill can ask the same idea in several ways. `Atlas.Q.vary(skillId, level, [[minLevel, 'shape-name', fn], ...])` picks one, never the same shape twice in a row. See `QUESTIONS.md`.
- **Check-ups** use level 1 of every skill, then a few level-2 questions.
- **Idea cards**: each idea in a lesson shows as a small stack of cards, one at a time: "Watch" (or "Learn") with the explanation and clip, "Try it" with the key idea, then "Your turn". Back and Next move through the cards first, then to the other ideas. A part the idea doesn't have is left out. An idea with only one part shows as a single page.
- **Watch clips** (`Manip.player`) don't start on their own. The student taps Play, or steps one part at a time with ‹ and ›. The "Auto-play" switch on any clip turns auto-start on for every clip. It is saved in this browser as `atlas:autoplay`.
- **Worked examples ("My turn")**: an idea can add `example` (the same shape as `watch`). It gets its own "My turn" card after the first card: one example solved step by step in "I" language ("My turn. First I..."), played like a Watch clip. It has no voice: Noel tried the device's built-in voice and found it too robotic.

## Math Plan

`plan/index.html` loads `vis.js` (pictures), `bank.js` (placement questions), `ladder.js` (every Ontario expectation, Grades 1 to 8, in the Ministry's wording), `blurbs.js` (one short plain-language line for each expectation), `engine.js` (placement and plan logic) and `app.js` (the screens). The plain line is what children and parents see, for example on "Today's idea" and when a concept-map square is tapped. The Ministry wording is shown under "Ontario wording". When an expectation is added to `ladder.js`, add its line to `blurbs.js` too, or the checks fail.

## Saved progress

Progress is kept in the browser (`localStorage`, prefix `gNatlas:`). When a child is signed in, `assets/sync.js` copies it to Firebase so parents and tutors see it.
