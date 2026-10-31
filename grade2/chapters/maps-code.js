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

  A.register('maps-code', {
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
