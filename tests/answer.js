/* Runs inside the page: answers question q in its answer area (root) the way a child would, right or (bad = true) wrong. */
// in-page: answer question q inside root correctly (or wrongly when bad=true)
/* what a child would type for a number answer: the number itself, or a fraction when the question asks for one */
function numText(q) {
  const plain = x => /e/i.test(String(x)) ? x.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 }) : String(x); /* a child types 0.000 001, never 1e-6 */
  if (!q.accept) return plain(q.answer);
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  const tries = [String(q.answer)];
  if (q.show != null) { const d = document.createElement('div'); d.innerHTML = typeof q.show === 'function' ? q.show(q.answer) : q.show; tries.push(d.textContent.trim()); }
  for (let den = 1; den <= 1000; den++) { const num = Math.round(q.answer * den); if (Math.abs(num / den - q.answer) < 1e-9) { const g = gcd(num, den); tries.push(num / g + '/' + den / g); const w = Math.trunc(num / den), r = Math.abs(num - w * den); if (w && r) { const g2 = gcd(r, den); tries.push(w + ' ' + r / g2 + '/' + den / g2); } break; } }
  return tries.find(t => q.accept(t)) || tries[0];
}
window.__answer = function (q, root, api, bad) {
  const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
  const click = el => { if (!el) throw new Error('missing element for ' + q.type); el.dispatchEvent(new MouseEvent('click', { bubbles: true })); };
  switch (q.type) {
    case 'mc': { const j = bad ? (q.answer + 1) % q.options.length : q.answer; click($$('.opt')[j]); break; }
    case 'num': { const i = $('input'); i.value = bad ? (q.answer + Math.abs(q.answer) * 0.1 + 1 + 2 * (q.tol || 0)).toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 }) : numText(q); $('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); break; }
    case 'tap': { const hits = $$('[data-hit]'); const want = String(q.answer); const el = hits.find(h => (bad ? h.getAttribute('data-hit') !== want : h.getAttribute('data-hit') === want)); click(el); break; }
    case 'pick': { const tg = $$('.qk-tg'); const want = bad ? [q.answer[0] === 0 ? 1 : 0].concat(q.answer.slice(1)) : q.answer; tg.forEach((b, j) => { if ((b.getAttribute('aria-pressed') === 'true') !== want.includes(j)) b.click(); }); click($('.qk-go')); break; }
    case 'order': { let g = 0; while (root.querySelector('.qk-slots .qk-card') && g++ < 20) click(root.querySelector('.qk-slots .qk-card')); const n = q.items.length, seq = [...Array(n).keys()]; if (bad) { const t = seq[0]; seq[0] = seq[1]; seq[1] = t; } seq.forEach(k => click(root.querySelector('.qk-pool [data-k="' + k + '"]'))); click($('.qk-go')); break; }
    case 'line': { api.setPos(bad ? (q.answer + (q.tol || 0) + q.snap <= q.max ? q.answer + (q.tol || 0) + q.snap : q.answer - (q.tol || 0) - q.snap) : q.answer); click($('.qk-go')); break; }
    case 'match': { const n = q.pairs.length; for (let i = 0; i < n; i++) { click(root.querySelector('[data-l="' + i + '"]')); const r = bad && i < 2 ? 1 - i : i; click(root.querySelector('[data-r="' + r + '"]')); } click($('.qk-go')); break; }
    case 'tf': { const v = bad ? !q.answer : q.answer; click(root.querySelector('[data-tf="' + (v ? 1 : 0) + '"]')); if (!bad && q.why) click(root.querySelector('[data-j="' + q.why.answer + '"]')); break; }
    case 'fill': { $$('.qk-blank').forEach((inp, i) => { inp.value = String(bad && i === 0 ? q.answers[i] + 1 : q.answers[i]); }); click($('.qk-go')); break; }
    case 'build': { const a = bad ? q.answer + 1 : q.answer; api.tool.fast = true; return Promise.resolve(api.tool.set(Math.floor(a / 100), Math.floor(a / 10) % 10, a % 10)).then(() => new Promise(r => setTimeout(r, 400))).then(() => click($('.qk-go'))); }
    default: throw new Error('no answerer for ' + q.type);
  }
};
