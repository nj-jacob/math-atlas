(function () {
  var A = Atlas, R = A.R, D = A.draw;
  var C = 56; /* grid cell size */
  /* small map symbols, drawn centred in a cell */
  var ICON = {
    home: { n: 'home', d: function (x, y) { return '<polygon points="' + x + ',' + (y - 18) + ' ' + (x + 18) + ',' + (y - 3) + ' ' + (x - 18) + ',' + (y - 3) + '" style="fill:var(--bad)" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/><rect x="' + (x - 13) + '" y="' + (y - 3) + '" width="26" height="20" style="fill:var(--hi)" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/><rect x="' + (x - 4) + '" y="' + (y + 5) + '" width="8" height="12" fill="#6b4b2a"/>'; } },
    school: { n: 'school', d: function (x, y) { return '<rect x="' + (x - 20) + '" y="' + (y - 10) + '" width="40" height="26" style="fill:var(--sb)" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/><polygon points="' + (x - 8) + ',' + (y - 10) + ' ' + x + ',' + (y - 20) + ' ' + (x + 8) + ',' + (y - 10) + '" style="fill:var(--sb)" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/><rect x="' + (x - 4) + '" y="' + (y + 4) + '" width="8" height="12" fill="#fff"/><rect x="' + (x - 16) + '" y="' + (y - 5) + '" width="7" height="7" fill="#fff"/><rect x="' + (x + 9) + '" y="' + (y - 5) + '" width="7" height="7" fill="#fff"/>'; } },
    tree: { n: 'tree', d: function (x, y) { return '<rect x="' + (x - 3) + '" y="' + (y + 2) + '" width="6" height="15" fill="#7a5230"/><circle cx="' + x + '" cy="' + (y - 6) + '" r="14" style="fill:var(--sd)" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>'; } },
    pond: { n: 'pond', d: function (x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="22" ry="14" style="fill:#74c0fc" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>'; } },
    store: { n: 'store', d: function (x, y) { return '<rect x="' + (x - 18) + '" y="' + (y - 12) + '" width="36" height="28" style="fill:var(--card)" stroke="rgba(0,0,0,.6)" stroke-width="1.5"/><path d="M' + (x - 20) + ' ' + (y - 12) + 'h40v8h-40z" style="fill:var(--sf)"/><rect x="' + (x - 5) + '" y="' + (y + 2) + '" width="10" height="14" style="fill:var(--sf)"/>'; } },
    library: { n: 'library', d: function (x, y) { return '<rect x="' + (x - 18) + '" y="' + (y - 14) + '" width="36" height="30" style="fill:var(--sc)" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/><rect x="' + (x - 12) + '" y="' + (y - 8) + '" width="5" height="18" fill="#fff"/><rect x="' + (x - 4) + '" y="' + (y - 8) + '" width="5" height="18" fill="#fff"/><rect x="' + (x + 4) + '" y="' + (y - 8) + '" width="5" height="18" fill="#fff"/>'; } },
    swing: { n: 'playground', d: function (x, y) { return '<path d="M' + (x - 20) + ' ' + (y + 16) + 'L' + (x - 12) + ' ' + (y - 16) + 'H' + (x + 12) + 'L' + (x + 20) + ' ' + (y + 16) + '" fill="none" style="stroke:var(--se)" stroke-width="4"/><line x1="' + (x - 4) + '" y1="' + (y - 16) + '" x2="' + (x - 4) + '" y2="' + (y + 6) + '" style="stroke:var(--ink)" stroke-width="1.5"/><line x1="' + (x + 4) + '" y1="' + (y - 16) + '" x2="' + (x + 4) + '" y2="' + (y + 6) + '" style="stroke:var(--ink)" stroke-width="1.5"/><rect x="' + (x - 7) + '" y="' + (y + 5) + '" width="14" height="4" fill="#6b4b2a"/>'; } },
    star: { n: 'star', d: function (x, y) { return A.THING.star(x, y, 18, 'var(--hi)'); } }
  };
  /* the neighbourhood map used through the chapter: [col, row, icon] */
  var TOWN = [[0, 0, 'home'], [3, 0, 'school'], [5, 1, 'library'], [1, 2, 'tree'], [2, 2, 'tree'], [4, 3, 'pond'], [0, 4, 'store'], [5, 4, 'swing']];
  function gridSvg(cols, rows, items, extra, label, legend) {
    var s = '';
    s += '<rect x="2" y="2" width="' + (cols * C) + '" height="' + (rows * C) + '" rx="6" style="fill:color-mix(in srgb,var(--sd) 10%,var(--card));stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 1; i < cols; i++) s += '<line x1="' + (2 + i * C) + '" y1="2" x2="' + (2 + i * C) + '" y2="' + (2 + rows * C) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    for (var j = 1; j < rows; j++) s += '<line x1="2" y1="' + (2 + j * C) + '" x2="' + (2 + cols * C) + '" y2="' + (2 + j * C) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    (items || []).forEach(function (it) { s += ICON[it[2]].d(2 + it[0] * C + C / 2, 2 + it[1] * C + C / 2); });
    s += extra || '';
    var h = rows * C + 4;
    if (legend) {
      var used = [];
      items.forEach(function (it) { if (used.indexOf(it[2]) < 0) used.push(it[2]); });
      used.forEach(function (k, n) { var lx = 14 + (n % 4) * 86, ly = h + 30 + Math.floor(n / 4) * 52; s += '<g transform="translate(' + lx + ',' + ly + ') scale(.75)">' + ICON[k].d(0, 0) + '</g><text x="' + (lx + 22) + '" y="' + (ly + 6) + '" font-size="16">' + ICON[k].n + '</text>'; });
      s += '<text x="6" y="' + (h + 4) + '" font-size="16" font-weight="700">Legend</text>';
      h += 12 + Math.ceil(used.length / 4) * 52;
    }
    return A.svg(Math.max(cols * C + 4, legend ? 350 : 0), h, s, label || 'A map grid');
  }
  /* a marker (rounded arrowhead) at a cell, with an optional path of cells */
  function marker(c, r, col, lab) {
    var x = 2 + c * C + C / 2, y = 2 + r * C + C / 2;
    return '<circle cx="' + x + '" cy="' + y + '" r="17" style="fill:' + (col || 'var(--strand)') + ';stroke:var(--ink)" stroke-width="2.5"/><text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" font-size="19" font-weight="800" style="fill:#fff">' + (lab || '') + '</text>';
  }
  function pathSvg(cells, col) {
    if (cells.length < 2) return '';
    return '<polyline points="' + cells.map(function (p) { return (2 + p[0] * C + C / 2) + ',' + (2 + p[1] * C + C / 2); }).join(' ') + '" fill="none" style="stroke:' + (col || 'var(--strand)') + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 9" opacity=".85"/>';
  }
  var DIR = { up: [0, -1, '&uarr;'], down: [0, 1, '&darr;'], left: [-1, 0, '&larr;'], right: [1, 0, '&rarr;'] };
  /* run code: list of {d, n}. Returns the cells visited, stopping at the grid edge */
  function run(start, code, cols, rows) {
    var c = start[0], r = start[1], out = [[c, r]], hit = false;
    code.forEach(function (st) { for (var i = 0; i < st.n; i++) { var nc = c + DIR[st.d][0], nr = r + DIR[st.d][1]; if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) { hit = true; return; } c = nc; r = nr; out.push([c, r]); } });
    out.hit = hit;
    return out;
  }
  function codeHtml(code, hl) {
    return '<ol class="code">' + code.map(function (st, i) { return '<li' + (i === hl ? ' class="on"' : '') + '><span>' + DIR[st.d][2] + '</span> move ' + st.d + ' ' + st.n + '</li>'; }).join('') + '</ol>';
  }
  function codeText(code) { return code.map(function (st) { return 'move ' + st.d + ' ' + st.n; }).join(', then '); }
  function at(c, r) { var f = TOWN.filter(function (t) { return t[0] === c && t[1] === r; })[0]; return f ? ICON[f[2]].n : null; }
  /* a shelf of things for position words */
  var SHELF = ['apple', 'star', 'fish', 'cube'];
  function shelf(order) {
    var s = '<rect x="4" y="74" width="352" height="10" rx="3" fill="#a07850"/><rect x="4" y="164" width="352" height="10" rx="3" fill="#a07850"/>';
    order.forEach(function (k, i) {
      var x = 50 + (i % 4) * 86, y = i < 4 ? 52 : 142;
      s += A.THING[k](x, y, 18, k === 'cube' ? 'var(--sc)' : undefined);
    });
    return A.svg(360, 180, s, 'A shelf. Top row from left to right: ' + order.slice(0, 4).join(', ') + '. Bottom row: ' + order.slice(4).join(', ') + '.');
  }

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'maps-code';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  var GREEN = function (c) { return '<rect x="' + (2 + c[0] * C) + '" y="' + (2 + c[1] * C) + '" width="' + C + '" height="' + C + '" style="fill:color-mix(in srgb,var(--sd) 40%,transparent)"/>'; };
  /* a ring around one thing on the shelf (i: 0-7) */
  function ring(i, col) { var x = 50 + (i % 4) * 86, y = i < 4 ? 52 : 142; return K.pop('<circle cx="' + x + '" cy="' + y + '" r="30" fill="none" style="stroke:' + (col || 'var(--strand)') + '" stroke-width="4"/>', 0); }
  function shelfWith(order, extra) { return shelf(order).replace('</svg>', (extra || '') + '</svg>'); }
  var S1 = ['apple', 'star', 'fish', 'cube', 'star', 'cube', 'apple', 'fish'];
  /* tap things on the shelf to answer position questions */
  function shelfLab(qs) {
    return K.lab('<p class="t2 lq"></p><div class="fig lsh"></div><div class="out" aria-live="polite"></div>', function (root, done) {
      var i = 0, out = root.querySelector('.out');
      function draw(extra) {
        var hits = S1.map(function (k, j) { var x = 50 + (j % 4) * 86, y = j < 4 ? 52 : 142; return '<rect x="' + (x - 40) + '" y="' + (y - 40) + '" width="80" height="76" fill="transparent" data-j="' + j + '" style="cursor:pointer" role="button" tabindex="0" aria-label="' + k + (j < 4 ? ' on the top shelf' : ' on the bottom shelf') + '"/>'; }).join('');
        root.querySelector('.lsh').innerHTML = shelfWith(S1, (extra || '') + hits);
        root.querySelector('.lq').innerHTML = i < qs.length ? '<b>' + (i + 1) + ' of ' + qs.length + ':</b> ' + qs[i][0] : '<b>All done.</b>';
      }
      function pick(j) {
        if (i >= qs.length) return;
        if (j === qs[i][1]) { out.innerHTML = '<p><span class="big">Yes.</span> ' + qs[i][2] + '</p>'; i++; draw(ring(j, 'var(--ok)')); if (i === qs.length) done('All ' + qs.length + ' found. You used position words to find each one.'); }
        else { out.innerHTML = '<p>That is the ' + S1[j] + (j < 4 ? ' on the top shelf' : ' on the bottom shelf') + '. Try again.</p>'; draw(ring(j, 'var(--bad)')); }
      }
      root.addEventListener('click', function (e) { var t = e.target.closest('[data-j]'); if (t) pick(+t.getAttribute('data-j')); });
      root.addEventListener('keydown', function (e) { var t = e.target.closest('[data-j]'); if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(+t.getAttribute('data-j')); } });
      draw();
    }, 'Tap the thing each question asks for.');
  }
  /* tap a place on the map */
  var mapLab = K.lab('<p class="t2 lq"></p><div class="fig lmap"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var qs = [['Tap the <b>pond</b>. Use the legend to find its symbol.', [4, 3], 'That is the pond.'], ['Tap the place just <b>above</b> the store.', [0, 3], 'One square up from the store. It is empty.'], ['Tap the place just to the <b>left</b> of the library.', [4, 1], 'One square left of the library.']], i = 0, out = root.querySelector('.out');
    function draw(extra) {
      var hits = ''; for (var r = 0; r < 5; r++) for (var c = 0; c < 6; c++) hits += '<rect x="' + (2 + c * C) + '" y="' + (2 + r * C) + '" width="' + C + '" height="' + C + '" fill="transparent" data-c="' + c + ',' + r + '" style="cursor:pointer"/>';
      root.querySelector('.lmap').innerHTML = gridSvg(6, 5, TOWN, (extra || '') + hits, 'The neighbourhood map. Tap a square.', true);
      root.querySelector('.lq').innerHTML = i < qs.length ? '<b>' + (i + 1) + ' of ' + qs.length + ':</b> ' + qs[i][0] : '<b>All done.</b>';
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-c]'); if (!t || i >= qs.length) return;
      var p = t.getAttribute('data-c').split(',').map(Number), ok = p[0] === qs[i][1][0] && p[1] === qs[i][1][1];
      out.innerHTML = ok ? '<p><span class="big">Yes.</span> ' + qs[i][2] + '</p>' : '<p>' + (at(p[0], p[1]) ? 'That is the ' + at(p[0], p[1]) + '.' : 'That is an empty square.') + ' Try again.</p>';
      if (ok) i++;
      draw(marker(p[0], p[1], ok ? 'var(--ok)' : 'var(--bad)', ''));
      if (ok && i === qs.length) done('Well done. You read the map with the legend and position words.');
    });
    draw();
  }, 'Tap the square each question asks for.');
  /* walk the map with arrow buttons */
  var walkLab = K.lab('<p class="t2">Start at home. Walk to the <b>library</b>. Press the arrows to move one square at a time.</p>' +
    '<div class="btnrow"><button type="button" class="btn alt" data-mv="up" aria-label="Move up">&uarr; up</button><button type="button" class="btn alt" data-mv="down" aria-label="Move down">&darr; down</button><button type="button" class="btn alt" data-mv="left" aria-label="Move left">&larr; left</button><button type="button" class="btn alt" data-mv="right" aria-label="Move right">&rarr; right</button><button type="button" class="btn" data-mv="home">Back to home</button></div>' +
    '<div class="fig lwfig"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var pos = [0, 0], moves = [];
    function said() { var s = [], last = null; moves.forEach(function (d) { if (last && last.d === d) last.n++; else s.push(last = { d: d, n: 1 }); }); return s.map(function (x) { return x.d + ' ' + x.n; }).join(', '); }
    function draw() {
      var trail = [[0, 0]], c = [0, 0]; moves.forEach(function (d) { c = [c[0] + DIR[d][0], c[1] + DIR[d][1]]; trail.push(c); });
      root.querySelector('.lwfig').innerHTML = gridSvg(6, 5, TOWN, pathSvg(trail) + marker(pos[0], pos[1], 'var(--hi)', ''), 'Map with your position marked');
      var here = at(pos[0], pos[1]);
      root.querySelector('.out').innerHTML = '<p>' + (here ? 'You are at the <b>' + here + '</b>.' : 'You are on an empty square.') + (moves.length ? ' Your directions: <b>' + said() + '</b>.' : '') + '</p>';
      root.querySelectorAll('[data-mv]').forEach(function (b) { var d = DIR[b.getAttribute('data-mv')]; if (d) { var nc = pos[0] + d[0], nr = pos[1] + d[1]; b.disabled = nc < 0 || nr < 0 || nc > 5 || nr > 4; } });
      if (here === 'library') done('You reached the library. Your directions were ' + said() + '.');
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-mv]'); if (!b) return;
      var k = b.getAttribute('data-mv');
      if (k === 'home') { pos = [0, 0]; moves = []; } else { pos = [pos[0] + DIR[k][0], pos[1] + DIR[k][1]]; moves.push(k); }
      draw();
    });
    draw();
  }, 'Walk from home to the library. Your directions are written for you as you go.');
  /* the robot after k steps of code */
  function robotFrame(start, code, k, star, cols, rows, col) {
    var p = run(start, code.slice(0, k), cols, rows), e = p[p.length - 1];
    return '<div class="row2"><div>' + codeHtml(code, k - 1) + '</div><div class="fig">' + gridSvg(cols, rows, star ? [[star[0], star[1], 'star']] : [], GREEN(start) + pathSvg(p, col) + K.pop(marker(e[0], e[1], col || 'var(--strand)', 'R'), 0), 'The robot after ' + k + ' steps') + '</div></div>';
  }
  var codeLab = K.lab('<p class="t2">Get the robot from the green square to the star. Add steps, then run the code.</p>' +
    '<div class="ctrl"><label for="lcd">Direction<select id="lcd"><option value="up">&uarr; up</option><option value="down">&darr; down</option><option value="left">&larr; left</option><option value="right" selected>&rarr; right</option></select></label><label for="lcn">Squares<select id="lcn"><option>1</option><option selected>2</option><option>3</option><option>4</option></select></label></div>' +
    '<div class="btnrow"><button type="button" class="btn alt" id="lcadd">Add step</button><button type="button" class="btn alt" id="lcundo">Remove last step</button></div>' +
    '<div class="row2"><div class="lclist"></div><div class="fig lcfig"></div></div>' +
    '<div class="btnrow"><button type="button" class="btn" id="lcrun">Run the code</button><button type="button" class="btn alt" id="lcnew">New star</button></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var $ = A.$, start = [0, 4], star = [4, 1], code = [], ran = false;
    function draw() {
      root.querySelector('.lclist').innerHTML = code.length ? codeHtml(code) : '<p class="t2">No steps yet.</p>';
      var extra = GREEN(start), p = run(start, code, 5, 5), e = ran ? p[p.length - 1] : start;
      if (ran) extra += pathSvg(p);
      root.querySelector('.lcfig').innerHTML = gridSvg(5, 5, [[star[0], star[1], 'star']], extra + marker(e[0], e[1], 'var(--strand)', 'R'), 'Robot grid');
      var out = root.querySelector('.out');
      if (!ran) { out.innerHTML = ''; return; }
      var ok = e[0] === star[0] && e[1] === star[1], dx = star[0] - e[0], dy = star[1] - e[1];
      out.innerHTML = '<p><span class="big">' + (ok ? 'On the star.' : 'Not on the star yet.') + '</span></p><p>' + (p.hit ? 'The robot reached the edge and stopped. ' : '') + (ok ? 'Your code works.' : 'It needs to go ' + [dx ? Math.abs(dx) + ' ' + (dx > 0 ? 'right' : 'left') : '', dy ? Math.abs(dy) + ' ' + (dy > 0 ? 'down' : 'up') : ''].filter(Boolean).join(' and ') + ' more. Change a step and run it again.') + '</p>';
      if (ok) done('Your code works. Press "New star" for another.');
    }
    $('#lcadd', root).addEventListener('click', function () { if (code.length < 8) { code.push({ d: $('#lcd', root).value, n: +$('#lcn', root).value }); ran = false; draw(); } });
    $('#lcundo', root).addEventListener('click', function () { code.pop(); ran = false; draw(); });
    $('#lcrun', root).addEventListener('click', function () { ran = true; draw(); });
    $('#lcnew', root).addEventListener('click', function () { do { star = [R.int(0, 4), R.int(0, 4)]; } while (star[0] === start[0] && star[1] === start[1]); code = []; ran = false; draw(); });
    draw();
  }, 'Build code for the robot, then run it.');
  /* fix one step of broken code */
  var debugLab = K.lab('<p class="t2">This code should take the robot to the star. Run it, find the wrong step, and fix its number.</p>' +
    '<div class="ctrl"><label for="ldb1">Step 1: move right<select id="ldb1"><option>1</option><option>2</option><option selected>3</option><option>4</option></select></label><label for="ldb2">Step 2: move down<select id="ldb2"><option>1</option><option selected>2</option><option>3</option></select></label></div>' +
    '<div class="fig ldfig"></div><div class="btnrow"><button type="button" class="btn" id="ldrun">Run the code</button></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var $ = A.$, star = [2, 2];
    function draw(ran) {
      var code = [{ d: 'right', n: +$('#ldb1', root).value }, { d: 'down', n: +$('#ldb2', root).value }], p = run([0, 0], code, 5, 4), e = ran ? p[p.length - 1] : [0, 0], ok = e[0] === star[0] && e[1] === star[1];
      root.querySelector('.ldfig').innerHTML = gridSvg(5, 4, [[star[0], star[1], 'star']], GREEN([0, 0]) + (ran ? pathSvg(p, ok ? 'var(--strand)' : 'var(--bad)') : '') + marker(e[0], e[1], ran && !ok ? 'var(--bad)' : 'var(--strand)', 'R'), 'Robot grid with a star');
      root.querySelector('.out').innerHTML = !ran ? '' : ok ? '<p><span class="big">Fixed.</span> The robot lands on the star.</p>' : '<p>It ends ' + (e[0] !== star[0] ? Math.abs(e[0] - star[0]) + ' square' + (Math.abs(e[0] - star[0]) > 1 ? 's' : '') + ' too far ' + (e[0] > star[0] ? 'right' : 'left') : Math.abs(e[1] - star[1]) + ' square' + (Math.abs(e[1] - star[1]) > 1 ? 's' : '') + ' too far ' + (e[1] > star[1] ? 'down' : 'up')) + '. Which step is wrong?</p>';
      if (ran && ok) done('You debugged it: you found the wrong step and changed only that step.');
    }
    root.addEventListener('change', function () { draw(false); });
    $('#ldrun', root).addEventListener('click', function () { draw(true); });
    draw(false);
  }, 'Run the code. Find the wrong step and fix it.');
  /* two robots, one step at a time */
  function twoFrame(n) { return gridSvg(5, 4, [], pathSvg([[0, 3], [1, 3], [2, 3], [3, 3]].slice(0, n + 1)) + pathSvg([[4, 3], [4, 2], [4, 1], [4, 0]].slice(0, n + 1), 'var(--se)') + K.pop(marker(n, 3, 'var(--strand)', 'A') + marker(4, 3 - n, 'var(--se)', 'B'), 0), 'After step ' + n + ', robot A has moved ' + n + ' right and robot B ' + n + ' up'); }
  var twoLab = K.lab('<div class="btnrow"><button type="button" class="btn" id="ltnext">Next step</button><button type="button" class="btn alt" id="ltre">Start again</button></div><div class="fig ltfig"></div><div class="out" aria-live="polite"></div>', function (root, done) {
    var n = 0, $ = A.$;
    function draw() {
      root.querySelector('.ltfig').innerHTML = twoFrame(n);
      $('#ltnext', root).disabled = n >= 3;
      root.querySelector('.out').innerHTML = '<p>After step <b>' + n + '</b>: A has moved <span class="big">' + n + '</span> right. B has moved <span class="big">' + n + '</span> up.</p>';
      if (n === 3) done('Both robots moved on every step, at the same time. That is concurrent code.');
    }
    $('#ltnext', root).addEventListener('click', function () { n++; draw(); });
    $('#ltre', root).addEventListener('click', function () { n = 0; draw(); });
    draw();
  }, 'Press "Next step". Both robots move at the same time.');

  var LESSONS = [
    { id: 'where', title: 'Where is it?', sub: 'Position words.', concepts: [
      { id: 'leftright', title: 'Left, right and between', exp: ['E1.5'], skill: 'm2-position',
        body: '<p><b>Left</b> and <b>right</b> tell which side. <b>Between</b> means in the middle of two things. Left and right always mean <b>your</b> left and right as you look at the picture.</p>',
        watch: K.clip([
          ['The top shelf: apple, star, fish, cube.', shelf(S1)],
          ['The star is to the <b>right</b> of the apple.', shelfWith(S1, ring(0, 'var(--se)') + ring(1))],
          ['The fish is to the <b>left</b> of the cube.', shelfWith(S1, ring(3, 'var(--se)') + ring(2))],
          ['The star is <b>between</b> the apple and the fish.', shelfWith(S1, ring(0, 'var(--se)') + ring(2, 'var(--se)') + ring(1)), 2000]
        ]),
        try: shelfLab([['Tap the thing to the <b>left</b> of the fish on the top shelf.', 1, 'The star is left of the fish.'], ['Tap the thing <b>between</b> the star and the apple on the bottom shelf.', 5, 'The cube is in the middle.'], ['Tap the thing to the <b>right</b> of the apple on the top shelf.', 1, 'The star is right of the apple.']]),
        ways: [{ label: 'Make an L', html: '<p>Hold up both hands, palms away, thumbs out. The hand whose thumb and finger make an <b>L</b> is your <b>left</b>.</p>' }],
        key: '<p>Left and right: your left and right as you look at the picture.</p>',
        mistake: '<p>Mixing up left and right, or using the left and right of a person in the picture. Have your child point with their own left hand first.</p>',
        check: [T('pos'), P('m2-position', 1)] },
      { id: 'abovebelow', title: 'Above and below', exp: ['E1.5'], skill: 'm2-position',
        body: '<p><b>Above</b> means higher up. <b>Below</b> means lower down. Look straight up or straight down.</p>',
        watch: K.clip([
          ['Find the star on the top shelf.', shelfWith(S1, ring(1))],
          ['Look straight down. The <b>cube</b> is below it.', shelfWith(S1, ring(1, 'var(--se)') + ring(5))],
          ['Find the fish on the bottom shelf. Look straight up: the <b>cube</b> is above it.', shelfWith(S1, ring(7, 'var(--se)') + ring(3)), 2000]
        ]),
        try: shelfLab([['Tap the thing <b>below</b> the apple on the top shelf.', 4, 'The star is straight below the apple.'], ['Tap the thing <b>above</b> the apple on the bottom shelf.', 2, 'The fish is straight above it.'], ['Tap the thing <b>above</b> the star on the bottom shelf.', 0, 'The apple is straight above.']]),
        key: '<p>Above: look straight up. Below: look straight down.</p>',
        check: [P('m2-position', 2), P('m2-position', 3)] }
    ] },
    { id: 'maps', title: 'Reading a map', sub: 'Symbols, legends and directions.', concepts: [
      { id: 'legend', title: 'Maps and legends', exp: ['E1.4'], skill: 'm2-map',
        body: '<p>A <b>map</b> is a drawing of a place from above, like a bird would see it. A <b>legend</b> tells what each symbol means.</p>',
        watch: K.clip([
          ['A neighbourhood, seen from above.', gridSvg(6, 5, TOWN, '', 'The neighbourhood map')],
          ['The <b>legend</b> shows what each symbol means.', gridSvg(6, 5, TOWN, '', 'The neighbourhood map with a legend', true)],
          ['Find the pond in the legend. Then find it on the map.', gridSvg(6, 5, TOWN, K.pop(marker(4, 3, 'transparent', '')), 'The pond is circled', true)],
          ['The pond is one square up and one square left of the playground.', gridSvg(6, 5, TOWN, pathSvg([[5, 4], [5, 3], [4, 3]]), 'From the playground up 1 and left 1 to the pond', true), 2200]
        ]),
        try: mapLab,
        key: '<p>Find the symbol in the legend first. Then find it on the map.</p>',
        mistake: '<p>Thinking a map shows things the size they really are. The symbols only show <b>where</b> things are.</p>',
        check: [T('map'), P('m2-map', 1)] },
      { id: 'directions', title: 'Give directions', exp: ['E1.4'], skill: 'm2-map', hard: true,
        body: '<p>Directions say <b>which way</b> and <b>how many squares</b>: "right 3, then down 2".</p>',
        watch: K.clip([
          ['From home to the school.', gridSvg(6, 5, TOWN, marker(0, 0, 'var(--hi)', ''), 'Start at home')],
          ['Right 1, 2, 3. <b>Right 3</b>.', gridSvg(6, 5, TOWN, pathSvg([[0, 0], [1, 0], [2, 0], [3, 0]]) + K.pop(marker(3, 0, 'var(--hi)', '')), 'Right 3 to the school')],
          ['Now to the pond: <b>right 1</b>.', gridSvg(6, 5, TOWN, pathSvg([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]) + K.pop(marker(4, 0, 'var(--hi)', '')), 'Right 1 more')],
          ['Then <b>down 3</b>. Right 1, down 3 reaches the pond.', gridSvg(6, 5, TOWN, pathSvg([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3]]) + K.pop(marker(4, 3, 'var(--hi)', '')), 'Down 3 to the pond'), 2200]
        ]),
        try: walkLab,
        ways: [
          { label: 'One part at a time', html: '<p>First count the squares <b>across</b> (left or right). Then count the squares <b>up or down</b>. Say each part with its number.</p>' },
          { label: 'Use your finger', html: '<p>Put a finger on the start. Slide it one square at a time and count out loud. Say the direction when you change.</p>' }
        ],
        key: '<p>Which way, and how many. Then the next way, and how many.</p>',
        mistake: '<p>Counting the starting square as a move. The first move is the first square you step <b>onto</b>.</p>',
        check: [T('move'), P('m2-map', 2), P('m2-map', 3)] }
    ] },
    { id: 'code', title: 'Writing code', sub: 'Steps in order.', concepts: [
      { id: 'order', title: 'Code runs in order', exp: ['C3.1'], skill: 'm2-code', hard: true,
        body: '<p><b>Code</b> is a list of steps for a computer or robot. The steps run <b>in order</b>, from top to bottom. Finish one step before starting the next.</p>',
        watch: K.clip([
          ['The robot starts on the green square.', robotFrame([1, 1], [{ d: 'right', n: 2 }, { d: 'down', n: 3 }], 0, [3, 4], 5, 5)],
          ['Step 1: move right 2.', robotFrame([1, 1], [{ d: 'right', n: 2 }, { d: 'down', n: 3 }], 1, [3, 4], 5, 5)],
          ['Step 2: move down 3. The robot ends on the <b>star</b>.', robotFrame([1, 1], [{ d: 'right', n: 2 }, { d: 'down', n: 3 }], 2, [3, 4], 5, 5), 2000]
        ]),
        try: codeLab,
        ways: [
          { label: 'Be the robot', html: '<p>Mark squares on the floor with tape. Read one step, do it, then read the next. Do not peek ahead.</p>' },
          { label: 'Tick each step', html: '<p>Put a finger on step 1. Move the robot. Tick the step. Only then move your finger to step 2.</p>' }
        ],
        key: '<p>One step at a time, top to bottom. This is called <b>sequential</b> order.</p>',
        mistake: '<p>Doing the steps out of order, or adding the moves together ("right 2 and down 3 is 5 squares") instead of following each one.</p>',
        check: [T('end'), P('m2-code', 1), P('m2-code', 2)] }
    ] },
    { id: 'debug', title: 'Fixing code', sub: 'Find the wrong step.', concepts: [
      { id: 'fix', title: 'Debugging', exp: ['C3.2'], skill: 'm2-debug',
        body: '<p>When code does not do what you want, find the step that is wrong and change it. This is called <b>debugging</b>.</p>',
        watch: K.clip([
          ['The code should reach the star.', robotFrame([3, 0], [{ d: 'down', n: 2 }, { d: 'left', n: 2 }], 0, [2, 2], 5, 4)],
          ['Run it. Step 1 is fine.', robotFrame([3, 0], [{ d: 'down', n: 2 }, { d: 'left', n: 2 }], 1, [2, 2], 5, 4)],
          ['Step 2 goes one square too far.', robotFrame([3, 0], [{ d: 'down', n: 2 }, { d: 'left', n: 2 }], 2, [2, 2], 5, 4, 'var(--bad)')],
          ['Change step 2 to <b>move left 1</b>. Fixed.', robotFrame([3, 0], [{ d: 'down', n: 2 }, { d: 'left', n: 1 }], 2, [2, 2], 5, 4), 2200]
        ]),
        try: debugLab,
        key: '<p>Run it. Watch where it goes wrong. Change only that step.</p>',
        mistake: '<p>Starting over from scratch, or changing a step that was already right.</p>',
        check: [T('fix'), P('m2-debug', 1), P('m2-debug', 2)] }
    ] },
    { id: 'together', title: 'Two at once', sub: 'Concurrent code.', concepts: [
      { id: 'conc', title: 'Robots at the same time', exp: ['C3.1'], skill: 'm2-together',
        body: '<p>Some code makes things happen <b>at the same time</b>. This is called <b>concurrent</b> code. Two robots each follow their own code, step by step, together.</p>',
        watch: K.clip([
          ['A moves right. B moves up. Start.', twoFrame(0)],
          ['Step 1: both move.', twoFrame(1)],
          ['Step 2: both move again.', twoFrame(2)],
          ['Step 3: A is 3 right, B is 3 up.', twoFrame(3), 2000]
        ]),
        try: twoLab,
        key: '<p>Same time: every robot moves on every step.</p>',
        mistake: '<p>Moving one robot all the way first, then the other.</p>',
        check: [T('conc'), P('m2-together', 1), P('m2-together', 2)] }
    ] }
  ];
  A.register('maps-code', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Where is it?</h2>' +
'<p>Position words tell where things are: <b>left</b>, <b>right</b>, <b>above</b>, <b>below</b>, <b>beside</b> (next to), and <b>between</b>.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + shelf(['apple', 'star', 'fish', 'cube', 'star', 'cube', 'apple', 'fish']) + '</div>' +
'<p>The star on the top shelf is <b>between</b> the apple and the fish. The cube on the top shelf is <b>above</b> the fish on the bottom shelf. The apple on the top shelf is to the <b>left</b> of the star.</p></div>' +
'<div class="yt" data-yt="pos"></div>' +
'<div class="key"><b class="t">Key idea</b><p>Left and right depend on whose left. On this site, left and right always mean <b>your</b> left and right as you look at the picture.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Reading a map</h2>' +
'<p>A <b>map</b> is a drawing of a place from above, like a bird would see it. A <b>legend</b> tells what each symbol means.</p>' +
'<div class="fig">' + gridSvg(6, 5, TOWN, '', 'A map of a neighbourhood: home at the top left, school at the top, library at the right, two trees, a pond, a store at the bottom left and a playground at the bottom right', true) + '</div>' +
'<div class="eg"><b class="t">Watch me</b><p>Where is the pond? I find its symbol in the legend, then on the map. The pond is one row <b>above</b> the playground, and one square to its <b>left</b>.</p></div>' +
'<div class="yt" data-yt="map"></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a map shows things the size they really are. A map is much smaller than the real place. The symbols only show <b>where</b> things are.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Moving on a grid</h2>' +
'<p>To give directions on a grid, say <b>which way</b> and <b>how many squares</b>: "right 3, down 2".</p>' +
'<div class="eg"><b class="t">Watch me</b><p>From home to the school: move <b>right 3</b> squares. From the school to the pond: move <b>right 1</b>, then <b>down 3</b>.</p><div class="fig">' + gridSvg(6, 5, TOWN, pathSvg([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3]]), 'A dotted path from home right 3 to the school, then right 1 and down 3 to the pond') + '</div></div>' +
'<div class="yt" data-yt="move"></div>' +
'<div class="lab"><span class="lt">Try it: walk the map</span>' +
'<p class="t2" style="margin:0 0 6px">Start at home. Press the arrows to move one square at a time.</p>' +
'<div class="btnrow"><button type="button" class="btn alt" data-mv="up" aria-label="Move up">&uarr; up</button><button type="button" class="btn alt" data-mv="down" aria-label="Move down">&darr; down</button><button type="button" class="btn alt" data-mv="left" aria-label="Move left">&larr; left</button><button type="button" class="btn alt" data-mv="right" aria-label="Move right">&rarr; right</button><button type="button" class="btn" id="mvreset">Back to home</button></div>' +
'<div class="fig" id="mvfig"></div><div class="out" id="mvout"></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Writing code</h2>' +
'<p><b>Code</b> is a list of steps for a computer or robot. The steps run <b>in order</b>, from the top to the bottom. Change the order and the robot ends up somewhere else.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>The robot starts on the green square. Its code is: move right 2, move down 3. I follow each step in order. The robot ends on the <b>star</b>.</p>' +
'<div class="row2"><div>' + codeHtml([{ d: 'right', n: 2 }, { d: 'down', n: 3 }]) + '</div><div class="fig">' + gridSvg(5, 5, [[3, 4, 'star']], '<rect x="' + (2 + C) + '" y="' + (2 + C) + '" width="' + C + '" height="' + C + '" style="fill:color-mix(in srgb,var(--sd) 40%,transparent)"/>' + pathSvg(run([1, 1], [{ d: 'right', n: 2 }, { d: 'down', n: 3 }], 5, 5)) + marker(3, 4, 'var(--strand)', 'R'), 'Robot path: start, right 2, down 3, ends on the star') + '</div></div></div>' +
'<div class="yt" data-yt="end"></div>' +
'<div class="lab"><span class="lt">Try it: code the robot</span>' +
'<p class="t2" style="margin:0 0 6px">Get the robot from the green square to the star. Add steps, then run the code.</p>' +
'<div class="ctrl"><label for="cd">Direction<select id="cd"><option value="up">&uarr; up</option><option value="down">&darr; down</option><option value="left">&larr; left</option><option value="right" selected>&rarr; right</option></select></label><label for="cn">Squares<select id="cn"><option>1</option><option selected>2</option><option>3</option><option>4</option></select></label><button type="button" class="btn alt" id="cadd">Add step</button><button type="button" class="btn alt" id="cundo">Remove last step</button></div>' +
'<div class="row2"><div id="clist"></div><div class="fig" id="cfig"></div></div>' +
'<div class="btnrow"><button type="button" class="btn" id="crun">Run the code</button><button type="button" class="btn alt" id="cnew">New star</button></div><div class="out" id="cout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Read code one step at a time. Finish each step before you start the next one. This is called <b>sequential</b> order.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Fixing code, and two at once</h2>' +
'<p>If code does not do what you want, find the step that is wrong and change it. This is called <b>debugging</b>.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>This code should take the robot from the green square to the star, but it ends one square too far left. Step 2 says "move left 2". It should say "move left 1". I change that step, and now the robot lands on the star.</p>' +
'<div class="row2"><div>' + codeHtml([{ d: 'down', n: 2 }, { d: 'left', n: 2 }], 1) + '</div><div class="fig">' + gridSvg(5, 4, [[2, 2, 'star']], '<rect x="' + (2 + 3 * C) + '" y="2" width="' + C + '" height="' + C + '" style="fill:color-mix(in srgb,var(--sd) 40%,transparent)"/>' + pathSvg(run([3, 0], [{ d: 'down', n: 2 }, { d: 'left', n: 2 }], 5, 4), 'var(--bad)') + marker(1, 2, 'var(--bad)', 'R'), 'The robot goes down 2 and left 2, one square past the star') + '</div></div></div>' +
'<div class="yt" data-yt="fix"></div>' +
'<p>Some code makes things happen <b>at the same time</b>. This is called <b>concurrent</b> code. Two robots can each follow their own code, step by step, together.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Robot A: move right 1, then right 1, then right 1. Robot B: move up 1, then up 1, then up 1. They both start a step at the same time. After step 3, A is 3 squares right and B is 3 squares up.</p>' +
'<div class="fig">' + gridSvg(5, 4, [], pathSvg([[0, 3], [1, 3], [2, 3], [3, 3]]) + pathSvg([[4, 3], [4, 2], [4, 1], [4, 0]], 'var(--se)') + marker(3, 3, 'var(--strand)', 'A') + marker(4, 0, 'var(--se)', 'B'), 'Robot A moves right 3 along the bottom while robot B moves up 3 along the right side') + '</div></div>' +
'<div class="yt" data-yt="conc"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      var pos = [0, 0], trail = [[0, 0]];
      function mv() {
        $('#mvfig', root).innerHTML = gridSvg(6, 5, TOWN, pathSvg(trail) + marker(pos[0], pos[1], 'var(--hi)', ''), 'Map with your position marked');
        var here = at(pos[0], pos[1]);
        $('#mvout', root).innerHTML = '<p>' + (here ? 'You are at the <b>' + here + '</b>.' : 'You are on an empty square.') + ' Steps taken: ' + (trail.length - 1) + '.</p>';
        root.querySelectorAll('[data-mv]').forEach(function (b) { var d = DIR[b.getAttribute('data-mv')], nc = pos[0] + d[0], nr = pos[1] + d[1]; b.disabled = nc < 0 || nr < 0 || nc > 5 || nr > 4; });
      }
      root.querySelectorAll('[data-mv]').forEach(function (b) { b.addEventListener('click', function () { var d = DIR[b.getAttribute('data-mv')]; pos = [pos[0] + d[0], pos[1] + d[1]]; trail.push(pos.slice()); mv(); }); });
      $('#mvreset', root).addEventListener('click', function () { pos = [0, 0]; trail = [[0, 0]]; mv(); });
      mv();
      var start = [0, 4], star = [4, 1], code = [], ran = false;
      function draw() {
        $('#clist', root).innerHTML = code.length ? codeHtml(code) : '<p class="t2">No steps yet.</p>';
        var extra = '<rect x="' + (2 + start[0] * C) + '" y="' + (2 + start[1] * C) + '" width="' + C + '" height="' + C + '" style="fill:color-mix(in srgb,var(--sd) 40%,transparent)"/>', end = start;
        if (ran) { var p = run(start, code, 5, 5); extra += pathSvg(p); end = p[p.length - 1]; }
        extra += marker(end[0], end[1], 'var(--strand)', 'R');
        $('#cfig', root).innerHTML = gridSvg(5, 5, [[star[0], star[1], 'star']], extra, 'Robot grid. Robot ' + (ran ? 'after running the code' : 'at the start') + '. Star at column ' + (star[0] + 1) + ', row ' + (star[1] + 1) + '.');
        if (!ran) { $('#cout', root).innerHTML = ''; return; }
        var pp = run(start, code, 5, 5), e = pp[pp.length - 1], ok = e[0] === star[0] && e[1] === star[1];
        $('#cout', root).innerHTML = '<p><span class="big">' + (ok ? 'On the star!' : 'Not on the star yet.') + '</span></p><p>' + (pp.hit ? 'The robot reached the edge of the grid and stopped. ' : '') +
          (ok ? 'Your code works. Could you do it with fewer steps?' : 'The robot is ' + Math.abs(star[0] - e[0]) + ' square' + (Math.abs(star[0] - e[0]) === 1 ? '' : 's') + ' ' + (star[0] > e[0] ? 'left of' : 'right of') + ' the star and ' + Math.abs(star[1] - e[1]) + ' square' + (Math.abs(star[1] - e[1]) === 1 ? '' : 's') + ' ' + (star[1] > e[1] ? 'above' : 'below') + ' it. Change a step and run it again.') + '</p>';
      }
      $('#cadd', root).addEventListener('click', function () { if (code.length < 8) { code.push({ d: $('#cd', root).value, n: +$('#cn', root).value }); ran = false; draw(); } });
      $('#cundo', root).addEventListener('click', function () { code.pop(); ran = false; draw(); });
      $('#crun', root).addEventListener('click', function () { ran = true; draw(); });
      $('#cnew', root).addEventListener('click', function () { do { star = [R.int(0, 4), R.int(0, 4)]; } while (star[0] === start[0] && star[1] === start[1]); code = []; ran = false; draw(); });
      draw();
    },

    turns: {
      pos: function () {
        var order = R.shuffle(SHELF).concat(R.shuffle(SHELF)), i = R.int(1, 2), k = R.int(0, 2), q, ans;
        if (k === 0) { q = 'On the top shelf, what is just to the <b>left</b> of the ' + order[i] + '?'; ans = order[i - 1]; }
        else if (k === 1) { q = 'On the top shelf, what is just to the <b>right</b> of the ' + order[i] + '?'; ans = order[i + 1]; }
        else { q = 'What is <b>below</b> the ' + order[i] + ' on the top shelf?'; ans = order[4 + i]; }
        var o = R.mc(ans, SHELF.filter(function (x) { return x !== ans; }));
        return { q: q, type: 'mc', options: o.options, answer: o.answer, fig: shelf(order), hint: k === 2 ? 'Look straight down from it to the bottom shelf.' : 'Your left hand is on the left side of the picture.', explain: 'It is the ' + ans + '.' };
      },
      map: function () {
        var qs = [['What is just to the <b>left</b> of the school?', 'nothing: an empty square', ['tree', 'home', 'library']],
          ['What is <b>below</b> the home, at the bottom of the map?', 'store', ['pond', 'tree', 'school']],
          ['What is one square right and one square down from the pond?', 'playground', ['library', 'store', 'tree']],
          ['How many trees are on the map?', '2', ['1', '3', '4']]];
        var p = R.pick(qs), o = R.mc(p[1], p[2]);
        return { q: p[0], type: 'mc', options: o.options, answer: o.answer, fig: gridSvg(6, 5, TOWN, '', 'The neighbourhood map', true), hint: 'Find the first place on the map. Then look in the direction the question says.', explain: 'The answer is ' + p[1] + '.' };
      },
      move: function () {
        var trips = [['home', 'store', 'down 4'], ['store', 'playground', 'right 5'], ['library', 'school', 'up 1, left 2'], ['pond', 'playground', 'right 1, down 1'], ['home', 'school', 'right 3']];
        var t = R.pick(trips), wrong = trips.filter(function (x) { return x[2] !== t[2]; }).map(function (x) { return x[2]; });
        var o = R.mc(t[2], R.shuffle(wrong).slice(0, 2));
        return { q: 'Which directions go from the <b>' + t[0] + '</b> to the <b>' + t[1] + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: gridSvg(6, 5, TOWN, '', 'The neighbourhood map', true), hint: 'Count the squares across and the squares up or down.', explain: 'From the ' + t[0] + ', go ' + t[2] + ' to reach the ' + t[1] + '.' };
      },
      end: function () {
        var st = [R.int(0, 1), R.int(0, 1)], code = [{ d: 'right', n: R.int(1, 3) }, { d: 'down', n: R.int(1, 3) }];
        if (R.int(0, 1)) code.reverse();
        var p = run(st, code, 5, 5), e = p[p.length - 1], labels = 'ABCD', spots = [e];
        while (spots.length < 4) { var c = [R.int(0, 4), R.int(0, 4)]; if (!spots.some(function (s) { return s[0] === c[0] && s[1] === c[1]; }) && !(c[0] === st[0] && c[1] === st[1])) spots.push(c); }
        spots = R.shuffle(spots);
        var extra = '<rect x="' + (2 + st[0] * C) + '" y="' + (2 + st[1] * C) + '" width="' + C + '" height="' + C + '" style="fill:color-mix(in srgb,var(--sd) 40%,transparent)"/>';
        spots.forEach(function (s, i) { extra += '<text x="' + (2 + s[0] * C + C / 2) + '" y="' + (2 + s[1] * C + C / 2 + 8) + '" text-anchor="middle" font-size="22" font-weight="800">' + labels.charAt(i) + '</text>'; });
        var idx = spots.indexOf(e);
        return { q: 'The robot starts on the green square. Code: <b>' + codeText(code) + '</b>. Where does it end?', type: 'mc', options: ['A', 'B', 'C', 'D'], answer: idx, fig: gridSvg(5, 5, [], extra, 'A grid with a green start square and squares marked A to D'), hint: 'Do one step at a time. Put your finger on the green square and move it.', explain: 'Following each step in order, the robot ends on square ' + labels.charAt(idx) + '.' };
      },
      fix: function () {
        var right = R.int(1, 3), down = R.int(1, 3), bad = right + R.pick([1, -1]); if (bad < 1) bad = right + 1;
        var code = [{ d: 'right', n: bad }, { d: 'down', n: down }], o = R.mc('Step 1 should be: move right ' + right, ['Step 2 should be: move down ' + (down + 1), 'Step 1 should be: move left ' + right, 'The code is already right']);
        var extra = '<rect x="2" y="2" width="' + C + '" height="' + C + '" style="fill:color-mix(in srgb,var(--sd) 40%,transparent)"/>' + pathSvg(run([0, 0], code, 5, 5), 'var(--bad)');
        return { q: 'The robot starts on the green square and should end on the star. The code is <b>' + codeText(code) + '</b>. How do you fix it?', type: 'mc', options: o.options, answer: o.answer, fig: gridSvg(5, 5, [[right, down, 'star']], extra, 'The robot misses the star'), hint: 'Count how many squares right the star is from the green square.', explain: 'The star is ' + right + ' squares right and ' + down + ' down. Step 1 should be: move right ' + right + '.' };
      },
      conc: function () {
        var n = R.int(1, 3), o = R.mc('A is ' + n + ' right, B is ' + n + ' up', ['A is ' + n + ' right, B has not moved', 'A has not moved, B is ' + n + ' up', 'A is ' + (n + 1) + ' right, B is ' + n + ' up']);
        return { q: 'Robots A and B start together. A moves right 1 each step. B moves up 1 each step. Where are they after step ' + n + '?', type: 'mc', options: o.options, answer: o.answer, hint: 'Both robots move at the same time, one square each step.', explain: 'They move together, so after ' + n + ' step' + (n > 1 ? 's' : '') + ' each has moved ' + n + '.' };
      }
    },

    quiz: [
      { q: 'On the map, what is to the <b>right</b> of the home, in the same row?', type: 'mc', options: ['store', 'school', 'pond', 'tree'], answer: 1, fig: gridSvg(6, 5, TOWN, '', 'The neighbourhood map', true), hint: 'Start at the home and look along the top row to the right.', explain: 'Along the top row to the right of home is the school.' },
      { q: 'What does a legend on a map tell you?', type: 'mc', options: ['how big the place really is', 'what each symbol means', 'what time it is', 'who lives there'], answer: 1, hint: 'Look at the bottom of the map in this chapter.', explain: 'A legend shows what each symbol on the map stands for.' },
      { q: 'From the store, which directions reach the playground?', type: 'mc', options: ['up 5', 'right 5', 'right 4', 'down 5'], answer: 1, fig: gridSvg(6, 5, TOWN, '', 'The neighbourhood map', true), hint: 'Both are in the bottom row. Count the squares across.', explain: 'The store and the playground are in the bottom row, 5 squares apart. Move right 5.' },
      { q: 'A robot runs <b>move up 2, then move right 1</b>. Which is true?', type: 'mc', options: ['It moves right first, then up', 'It moves up first, then right', 'It moves up and right at the same time', 'It only moves up'], answer: 1, hint: 'Code runs from the top step down, in order.', explain: 'Steps run in order: up 2 first, then right 1.' },
      { q: 'A robot starts at the green square and runs <b>move down 1, then move right 3</b>. How many squares does it move in all?', type: 'num', answer: 4, hint: 'Add the squares in each step.', explain: '1 + 3 = 4 squares.' },
      { q: 'Code should take a robot right 4, but it says <b>move right 3</b>. What is the fix?', type: 'mc', options: ['Change it to move right 4', 'Add move left 1', 'Change it to move up 4', 'Remove the step'], answer: 0, hint: 'The robot needs to go one more square to the right.', explain: 'Change the step to move right 4.' },
      { q: 'Two robots run their code at the same time. Each moves 1 square per step. After 3 steps, how many squares has each robot moved?', type: 'num', answer: 3, hint: 'They move together, one square every step.', explain: 'Each robot moves 1 square per step, so each has moved 3.' }
    ],

    practice: [
      { id: 'm2-position', name: 'Position words', code: 'E1.5', gen: function (lv) {
        var order = R.shuffle(SHELF).concat(R.shuffle(SHELF)), i = R.int(1, 2), q, ans, k = lv === 1 ? R.int(0, 1) : lv === 2 ? R.int(0, 2) : 3;
        if (k === 0) { q = 'On the top shelf, what is just to the <b>left</b> of the ' + order[i] + '?'; ans = order[i - 1]; }
        else if (k === 1) { q = 'On the top shelf, what is just to the <b>right</b> of the ' + order[i] + '?'; ans = order[i + 1]; }
        else if (k === 2) { q = 'What is <b>above</b> the ' + order[4 + i] + ' on the bottom shelf?'; ans = order[i]; }
        else { q = 'On the top shelf, what is <b>between</b> the ' + order[i - 1] + ' and the ' + order[i + 1] + '?'; ans = order[i]; }
        var o = R.mc(ans, SHELF.filter(function (x) { return x !== ans; }));
        return { q: q, type: 'mc', options: o.options, answer: o.answer, fig: shelf(order), hint: k === 2 ? 'Look straight up from it to the top shelf.' : k === 3 ? 'Find the two things. What sits in the middle?' : 'Your left hand is on the left side of the picture.', steps: ['Find the thing named in the question.', 'Look ' + ['left', 'right', 'up', 'on both sides'][k] + '.', 'It is the ' + ans + '.'], explain: 'It is the ' + ans + '.' };
      } },
      { id: 'm2-map', name: 'Read a map', code: 'E1.4', gen: function (lv) {
        var places = TOWN.filter(function (t) { return t[2] !== 'tree'; }), a = R.pick(places), b = R.pick(places.filter(function (t) { return t !== a; }));
        var dx = b[0] - a[0], dy = b[1] - a[1];
        if (lv === 1) {
          var dirs = []; if (dx) dirs.push(dx > 0 ? 'right' : 'left'); if (dy) dirs.push(dy > 0 ? 'down' : 'up');
          var right = dirs.join(' and '), all = ['right', 'left', 'up', 'down', 'right and up', 'right and down', 'left and up', 'left and down'];
          var o = R.mc(right, R.shuffle(all.filter(function (x) { return x !== right; })).slice(0, 3));
          return { q: 'Which way do you go from the <b>' + ICON[a[2]].n + '</b> to the <b>' + ICON[b[2]].n + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: gridSvg(6, 5, TOWN, '', 'The neighbourhood map', true), hint: 'Put your finger on the ' + ICON[a[2]].n + '. Which way do you move to reach the ' + ICON[b[2]].n + '?', steps: ['Find the ' + ICON[a[2]].n + ' and the ' + ICON[b[2]].n + '.', 'Is the ' + ICON[b[2]].n + ' further right or left? Higher or lower?', 'You go ' + right + '.'], explain: 'From the ' + ICON[a[2]].n + ', go ' + right + ' to reach the ' + ICON[b[2]].n + '.' };
        }
        return { q: 'How many squares do you move in all to go from the <b>' + ICON[a[2]].n + '</b> to the <b>' + ICON[b[2]].n + '</b>? Move only across and up or down.', type: 'num', answer: Math.abs(dx) + Math.abs(dy), fig: gridSvg(6, 5, TOWN, lv === 2 ? pathSvg((function () { var p = [[a[0], a[1]]], c = a[0], r = a[1]; while (c !== b[0]) { c += dx > 0 ? 1 : -1; p.push([c, r]); } while (r !== b[1]) { r += dy > 0 ? 1 : -1; p.push([c, r]); } return p; })()) : '', 'The neighbourhood map', true), hint: 'Count the squares across. Then count the squares up or down. Add them.', steps: ['Across: ' + Math.abs(dx) + ' square' + (Math.abs(dx) === 1 ? '' : 's') + '.', 'Up or down: ' + Math.abs(dy) + ' square' + (Math.abs(dy) === 1 ? '' : 's') + '.', Math.abs(dx) + ' + ' + Math.abs(dy) + ' = ' + (Math.abs(dx) + Math.abs(dy)) + '.'], explain: Math.abs(dx) + Math.abs(dy) + ' squares in all.' };
      } },
      { id: 'm2-code', name: 'Read code', code: 'C3.1', gen: function (lv) {
        var st = [R.int(0, 1), R.int(0, 1)], steps = lv === 1 ? 1 : lv === 2 ? 2 : 3, code = [], dirs = ['right', 'down'];
        for (var i = 0; i < steps; i++) code.push({ d: lv === 3 && i === 2 ? R.pick(['left', 'up']) : dirs[i % 2], n: R.int(1, 2) });
        var p = run(st, code, 5, 5), e = p[p.length - 1];
        if (p.hit) { code = [{ d: 'right', n: 2 }, { d: 'down', n: 2 }]; p = run(st, code, 5, 5); e = p[p.length - 1]; }
        var spots = [e];
        while (spots.length < 4) { var c = [R.int(0, 4), R.int(0, 4)]; if (!spots.some(function (s) { return s[0] === c[0] && s[1] === c[1]; }) && !(c[0] === st[0] && c[1] === st[1])) spots.push(c); }
        spots = R.shuffle(spots);
        var extra = '<rect x="' + (2 + st[0] * C) + '" y="' + (2 + st[1] * C) + '" width="' + C + '" height="' + C + '" style="fill:color-mix(in srgb,var(--sd) 40%,transparent)"/>';
        spots.forEach(function (s, k) { extra += '<text x="' + (2 + s[0] * C + C / 2) + '" y="' + (2 + s[1] * C + C / 2 + 8) + '" text-anchor="middle" font-size="22" font-weight="800">' + 'ABCD'.charAt(k) + '</text>'; });
        var idx = spots.indexOf(e);
        return { q: 'The robot starts on the green square. Code: <b>' + codeText(code) + '</b>. Where does it end?', type: 'mc', options: ['A', 'B', 'C', 'D'], answer: idx, fig: gridSvg(5, 5, [], extra, 'A grid with a green start square and squares marked A to D'), hint: 'Follow one step at a time, in order.', steps: code.map(function (s, k) { return 'Step ' + (k + 1) + ': move ' + s.d + ' ' + s.n + '.'; }).concat(['The robot ends on ' + 'ABCD'.charAt(idx) + '.<div class="fig">' + gridSvg(5, 5, [], extra + pathSvg(p), 'The robot path') + '</div>']), explain: 'The robot ends on square ' + 'ABCD'.charAt(idx) + '.' };
      } },
      { id: 'm2-debug', name: 'Fix the code', code: 'C3.2', gen: function (lv) {
        var right = R.int(1, 3), down = R.int(1, 3), which = lv === 1 ? 0 : R.int(0, 1), code = [{ d: 'right', n: right }, { d: 'down', n: down }];
        var wrongN = code[which].n + R.pick([1, -1]); if (wrongN < 1) wrongN = code[which].n + 1;
        var bad = code.map(function (c) { return { d: c.d, n: c.n }; }); bad[which].n = wrongN;
        if (lv === 3) bad[which].d = which === 0 ? 'left' : 'up', bad[which].n = code[which].n;
        var fixText = 'Step ' + (which + 1) + ' should be: move ' + code[which].d + ' ' + code[which].n;
        var o = R.mc(fixText, ['Step ' + (2 - which) + ' should be: move ' + code[1 - which].d + ' ' + (code[1 - which].n + 1), 'Step ' + (which + 1) + ' should be: move ' + code[which].d + ' ' + (code[which].n + 2), 'The code is already right']);
        var extra = '<rect x="2" y="2" width="' + C + '" height="' + C + '" style="fill:color-mix(in srgb,var(--sd) 40%,transparent)"/>' + (lv < 3 ? pathSvg(run([0, 0], bad, 5, 5), 'var(--bad)') : '');
        return { q: 'From the green square, the robot should reach the star. The code is <b>' + codeText(bad) + '</b>. How do you fix it?', type: 'mc', options: o.options, answer: o.answer, fig: gridSvg(5, 5, [[right, down, 'star']], extra, 'A grid with a start square and a star'), hint: 'Count the squares from the green square to the star: across, then down.', steps: ['The star is ' + right + ' right and ' + down + ' down from the start.', 'Check each step against that.', fixText + '.'], explain: fixText + '.' };
      } },
      { id: 'm2-together', name: 'Two at once', code: 'C3.1', gen: function (lv) {
        var a = R.int(1, 3), b = R.int(1, 3), n = R.int(1, 3);
        if (lv === 1) return { q: 'Robot A and robot B start at the same time. Each moves 1 square every step. After ' + n + ' steps, how many squares has robot B moved?', type: 'num', answer: n, hint: 'They both move on every step.', steps: ['Every step, both robots move 1 square.', 'After ' + n + ' steps, each has moved ' + n + '.'], explain: n + ' squares.' };
        return { q: 'Robot A moves ' + a + ' square' + (a > 1 ? 's' : '') + ' each step. Robot B moves ' + b + ' square' + (b > 1 ? 's' : '') + ' each step. They start at the same time. After ' + n + ' steps, how many squares have they moved <b>together</b>?', type: 'num', answer: n * (a + b), hint: 'Find how far each robot goes, then add.', steps: ['Robot A: ' + n + ' steps of ' + a + ' is ' + n * a + '.', 'Robot B: ' + n + ' steps of ' + b + ' is ' + n * b + '.', n * a + ' + ' + n * b + ' = ' + n * (a + b) + '.'], explain: 'Together they move ' + n * (a + b) + ' squares.' };
      } }
    ]
  });
})();
