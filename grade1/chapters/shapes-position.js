(function () {
  var A = Atlas, R = A.R;
  var COL = { circle: '#e04b3a', triangle: '#2f9a4c', square: '#2c68cf', rectangle: '#f2bd24', hexagon: '#8441bd' };
  var SIDES = { circle: 0, triangle: 3, square: 4, rectangle: 4, hexagon: 6 };
  var FLAT = Object.keys(SIDES);
  var st = function (c) { return 'style="fill:' + c + '" stroke="rgba(0,0,0,.5)" stroke-width="2.5" stroke-linejoin="round"'; };
  function flat(k, x, y, z, c) {
    var r = z / 2; c = c || COL[k];
    if (k === 'circle') return '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 2) + '" ' + st(c) + '/>';
    if (k === 'square') return '<rect x="' + (x - r + 4) + '" y="' + (y - r + 4) + '" width="' + (z - 8) + '" height="' + (z - 8) + '" ' + st(c) + '/>';
    if (k === 'rectangle') return '<rect x="' + (x - r + 2) + '" y="' + (y - r * .55) + '" width="' + (z - 4) + '" height="' + (z * .55) + '" ' + st(c) + '/>';
    if (k === 'triangle') return '<path d="M' + x + ' ' + (y - r + 3) + 'L' + (x + r - 2) + ' ' + (y + r - 6) + 'L' + (x - r + 2) + ' ' + (y + r - 6) + 'Z" ' + st(c) + '/>';
    var p = []; for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3; p.push((x + (r - 2) * Math.cos(a)).toFixed(1) + ' ' + (y + (r - 2) * Math.sin(a)).toFixed(1)); }
    return '<path d="M' + p.join('L') + 'Z" ' + st(c) + '/>';
  }
  function flatPic(k, z) { z = z || 70; return A.svg(z + 8, z + 8, flat(k, z / 2 + 4, z / 2 + 4, z), 'a ' + k); }
  /* solid shapes, drawn simply with a lit front */
  var SOLIDS = ['cube', 'sphere', 'cylinder', 'cone', 'rectangular prism', 'pyramid'];
  var OBJ = { cube: 'a number cube (a die)', sphere: 'a ball', cylinder: 'a soup can', cone: 'an ice cream cone', 'rectangular prism': 'a cereal box', pyramid: 'a tent' };
  var FACES = { cube: 'square', cylinder: 'circle', 'rectangular prism': 'rectangle', pyramid: 'triangle' };
  function solid(k, x, y, z) {
    var r = z / 2, c = { cube: '#2c68cf', sphere: '#e04b3a', cylinder: '#2f9a4c', cone: '#f2bd24', 'rectangular prism': '#ee7d24', pyramid: '#8441bd' }[k];
    var S = 'stroke="rgba(0,0,0,.55)" stroke-width="2.5" stroke-linejoin="round"', lite = 'color-mix(in srgb,' + c + ' 55%,#fff)', dark = 'color-mix(in srgb,' + c + ' 70%,#000)';
    if (k === 'sphere') return '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 3) + '" style="fill:' + c + '" ' + S + '/><ellipse cx="' + (x - r * .3) + '" cy="' + (y - r * .35) + '" rx="' + r * .25 + '" ry="' + r * .15 + '" style="fill:#fff;opacity:.55"/>';
    if (k === 'cylinder') return '<path d="M' + (x - r * .6) + ' ' + (y - r * .6) + 'V' + (y + r * .6) + 'A' + r * .6 + ' ' + r * .22 + ' 0 0 0 ' + (x + r * .6) + ' ' + (y + r * .6) + 'V' + (y - r * .6) + '" style="fill:' + c + '" ' + S + '/><ellipse cx="' + x + '" cy="' + (y - r * .6) + '" rx="' + r * .6 + '" ry="' + r * .22 + '" style="fill:' + lite + '" ' + S + '/>';
    if (k === 'cone') return '<path d="M' + x + ' ' + (y - r + 3) + 'L' + (x + r * .6) + ' ' + (y + r * .62) + 'A' + r * .6 + ' ' + r * .22 + ' 0 0 1 ' + (x - r * .6) + ' ' + (y + r * .62) + 'Z" style="fill:' + c + '" ' + S + '/>';
    if (k === 'pyramid') return '<path d="M' + x + ' ' + (y - r + 3) + 'L' + (x - r * .8) + ' ' + (y + r * .55) + 'L' + (x + r * .15) + ' ' + (y + r * .75) + 'Z" style="fill:' + c + '" ' + S + '/><path d="M' + x + ' ' + (y - r + 3) + 'L' + (x + r * .15) + ' ' + (y + r * .75) + 'L' + (x + r * .85) + ' ' + (y + r * .4) + 'Z" style="fill:' + dark + '" ' + S + '/>';
    var w = k === 'cube' ? z * .6 : z * .42, h = k === 'cube' ? z * .6 : z * .72, d = z * .22, x0 = x - (w + d) / 2, y0 = y + (h - d) / 2;
    return '<rect x="' + x0 + '" y="' + (y0 - h) + '" width="' + w + '" height="' + h + '" style="fill:' + c + '" ' + S + '/>' +
      '<path d="M' + x0 + ' ' + (y0 - h) + 'l' + d + ' ' + (-d) + 'h' + w + 'l' + (-d) + ' ' + d + 'Z" style="fill:' + lite + '" ' + S + '/>' +
      '<path d="M' + (x0 + w) + ' ' + (y0 - h) + 'l' + d + ' ' + (-d) + 'v' + h + 'l' + (-d) + ' ' + d + 'Z" style="fill:' + dark + '" ' + S + '/>';
  }
  function solidPic(k, z) { z = z || 80; return A.svg(z + 8, z + 8, solid(k, z / 2 + 4, z / 2 + 4, z), 'a ' + k); }
  /* a shape with a fold line. good: the line makes matching halves */
  var SYM = [
    ['square', 'v', 1], ['square', 'd', 1], ['circle', 'v', 1], ['rectangle', 'v', 1], ['rectangle', 'h', 1], ['triangle', 'v', 1], ['heart', 'v', 1], ['hexagon', 'h', 1],
    ['rectangle', 'd', 0], ['circle', 'off', 0], ['square', 'off', 0], ['heart', 'h', 0], ['triangle', 'h', 0], ['scalene', 'v', 0], ['lshape', 'v', 0]
  ];
  function foldPic(sh, line) {
    var z = 110, x = 64, y = 64, s, r = z / 2;
    if (sh === 'heart') s = '<path d="M64 108C10 74 22 22 64 44C106 22 118 74 64 108Z" ' + st('#e05aa0') + '/>';
    else if (sh === 'scalene') s = '<path d="M30 104L112 104L46 22Z" ' + st('#2f9a4c') + '/>';
    else if (sh === 'lshape') s = '<path d="M26 18H64V74H104V108H26Z" ' + st('#2c68cf') + '/>';
    else if (sh === 'triangle') s = '<path d="M64 14L114 106H14Z" ' + st(COL.triangle) + '/>';
    else s = flat(sh, x, y, z);
    var L;
    if (line === 'v') L = [64, 4, 64, 124];
    else if (line === 'h') L = sh === 'triangle' ? [4, 66, 124, 66] : sh === 'heart' ? [4, 62, 124, 62] : [4, 64, 124, 64];
    else if (line === 'd') L = sh === 'rectangle' ? [6, 34, 122, 94] : [13, 13, 115, 115];
    else L = [84, 4, 84, 124];
    s += '<line x1="' + L[0] + '" y1="' + L[1] + '" x2="' + L[2] + '" y2="' + L[3] + '" style="stroke:var(--ink)" stroke-width="3.5" stroke-dasharray="8 6"/>';
    return A.svg(128, 128, s, 'A ' + (sh === 'scalene' ? 'triangle with three different sides' : sh === 'lshape' ? 'shape like the letter L' : sh) + ' with a dashed fold line');
  }
  /* shelf picture for position words: a 3 by 3 shelf */
  var THINGS = ['apple', 'ball', 'star', 'fish', 'flower', 'car', 'leaf', 'sock', 'cube'];
  function shelf(items) {
    var s = '<rect x="4" y="4" width="282" height="252" rx="8" style="fill:#d9a066;stroke:#7a4b2a" stroke-width="4"/>';
    for (var i = 1; i < 3; i++) s += '<rect x="8" y="' + (4 + i * 84 - 3) + '" width="274" height="6" style="fill:#7a4b2a"/>';
    items.forEach(function (k, i) { if (k) s += A.icon(k, 4 + (i % 3) * 94 + 47, 4 + Math.floor(i / 3) * 84 + 46, 52); });
    return A.svg(290, 260, s, 'A shelf with 3 rows. Top row: ' + names(items.slice(0, 3)) + '. Middle row: ' + names(items.slice(3, 6)) + '. Bottom row: ' + names(items.slice(6, 9)) + '.');
  }
  function names(arr) { return arr.map(function (k) { return k ? A.NAMES[k][0] : 'empty'; }).join(', '); }
  /* robot grid for coding */
  var DIR = { U: [0, -1, '&#8593;', 'up'], D: [0, 1, '&#8595;', 'down'], L: [-1, 0, '&#8592;', 'left'], Rt: [1, 0, '&#8594;', 'right'] };
  function grid(n, robot, things, path) {
    var c = 52, s = '';
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) s += '<rect x="' + (4 + i * c) + '" y="' + (4 + j * c) + '" width="' + c + '" height="' + c + '" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
    if (path && path.length > 1) s += '<path d="M' + path.map(function (p) { return (4 + p[0] * c + c / 2) + ' ' + (4 + p[1] * c + c / 2); }).join('L') + '" fill="none" style="stroke:var(--accent)" stroke-width="4" stroke-dasharray="7 5" stroke-linecap="round"/>';
    (things || []).forEach(function (t) { s += A.icon(t[2], 4 + t[0] * c + c / 2, 4 + t[1] * c + c / 2, 38); });
    var rx = 4 + robot[0] * c + c / 2, ry = 4 + robot[1] * c + c / 2;
    s += '<rect x="' + (rx - 15) + '" y="' + (ry - 14) + '" width="30" height="26" rx="6" style="fill:#7c8aa3" stroke="#2a2633" stroke-width="2"/><circle cx="' + (rx - 6) + '" cy="' + (ry - 3) + '" r="3.5" style="fill:#fff"/><circle cx="' + (rx + 6) + '" cy="' + (ry - 3) + '" r="3.5" style="fill:#fff"/><line x1="' + rx + '" y1="' + (ry - 14) + '" x2="' + rx + '" y2="' + (ry - 21) + '" stroke="#2a2633" stroke-width="2"/><circle cx="' + rx + '" cy="' + (ry - 22) + '" r="3" style="fill:#e04b3a"/>';
    return A.svg(n * c + 8, n * c + 8, s, 'A ' + n + ' by ' + n + ' grid. The robot is in column ' + (robot[0] + 1) + ', row ' + (robot[1] + 1) + '.' + (things || []).map(function (t) { return ' A ' + A.NAMES[t[2]][0] + ' is in column ' + (t[0] + 1) + ', row ' + (t[1] + 1) + '.'; }).join(''));
  }
  function codeHtml(code) { return '<span class="code">' + code.map(function (k) { return '<b>' + DIR[k][2] + '</b>'; }).join('') + '</span>'; }
  function run(start, code) { var p = [start.slice()]; code.forEach(function (k) { var l = p[p.length - 1]; p.push([l[0] + DIR[k][0], l[1] + DIR[k][1]]); }); return p; }

  function q2d(lv) {
    if (lv === 1) {
      var k = R.pick(FLAT), choices = R.shuffle([k].concat(R.shuffle(FLAT.filter(function (x) { return x !== k && !(k === 'square' && x === 'rectangle') && !(k === 'rectangle' && x === 'square'); })).slice(0, 2)));
      return { q: 'Which shape is a <b>' + k + '</b>?', type: 'mc', options: choices.map(function (x) { return flatPic(x, 64); }), answer: choices.indexOf(k),
        hint: k === 'circle' ? 'A circle is round with no corners.' : 'Count the sides. A ' + k + ' has ' + SIDES[k] + ' sides.', steps: ['Look at each shape.', k === 'circle' ? 'Find the round one with no straight sides.' : 'Count the straight sides on each one.', 'The ' + k + ' is the one with ' + (k === 'circle' ? 'no corners' : SIDES[k] + ' sides') + '.'], explain: 'A ' + k + (k === 'circle' ? ' is round and has no corners.' : ' has ' + SIDES[k] + ' sides and ' + SIDES[k] + ' corners.') };
    }
    if (lv === 2) {
      var k2 = R.pick(['triangle', 'square', 'rectangle', 'hexagon']), what = R.pick(['sides', 'corners']), rot = R.int(0, 3) * 20;
      return { q: 'How many <b>' + what + '</b> does this shape have?', type: 'num', answer: SIDES[k2], fig: A.svg(110, 110, '<g transform="rotate(' + rot + ' 55 55)">' + flat(k2, 55, 55, 90) + '</g>', 'a ' + k2),
        hint: what === 'sides' ? 'A side is a straight edge. Trace each one with your finger.' : 'A corner is where two sides meet. Touch each one.', steps: ['Put your finger on one ' + (what === 'sides' ? 'side' : 'corner') + '.', 'Go around the shape, counting each one once.', 'This ' + k2 + ' has ' + SIDES[k2] + ' ' + what + '.'], explain: 'A ' + k2 + ' has ' + SIDES[k2] + ' sides and ' + SIDES[k2] + ' corners.' };
    }
    var rule = R.pick(['3', '4', 'curve']), pool = rule === 'curve' ? ['triangle', 'square', 'rectangle', 'hexagon'] : rule === '3' ? ['triangle'] : ['square', 'rectangle'];
    var odd = rule === 'curve' ? 'circle' : R.pick(FLAT.filter(function (x) { return pool.indexOf(x) < 0; }));
    var group = []; for (var i = 0; i < 3; i++) group.push(pool[i % pool.length]);
    var sizes = [60, 50, 66], all = R.shuffle(group.concat([odd]).map(function (x, i) { return { k: x, z: sizes[i % 3] || 56, odd: i === 3 }; }));
    var ans = all.map(function (a) { return a.odd; }).indexOf(true);
    var desc = rule === 'curve' ? 'have straight sides' : 'have ' + rule + ' sides';
    return { q: 'Three of these shapes ' + desc + '. Which one does <b>not</b> belong?', type: 'mc', options: all.map(function (a) { return flatPic(a.k, a.z); }), answer: ans,
      hint: 'Count the sides on each shape.', steps: ['Count the sides on each shape.', 'The sorting rule is: shapes that ' + desc + '.', 'The ' + odd + ' does not fit the rule.'], explain: 'The ' + odd + ' has ' + (SIDES[odd] ? SIDES[odd] + ' sides' : 'no straight sides') + ', so it does not belong.' };
  }
  function q3d(lv) {
    if (lv === 1) {
      var k = R.pick(SOLIDS), ch = R.shuffle([k].concat(R.shuffle(SOLIDS.filter(function (x) { return x !== k; })).slice(0, 2)));
      return { q: 'Which solid is shaped like <b>' + OBJ[k] + '</b>?', type: 'mc', options: ch.map(function (x) { return solidPic(x, 70); }), answer: ch.indexOf(k),
        hint: 'Picture ' + OBJ[k] + ' in your hand. Is it round? Does it have flat faces?', steps: ['Think about the shape of ' + OBJ[k] + '.', 'Find the solid that looks the same.', OBJ[k].charAt(0).toUpperCase() + OBJ[k].slice(1) + ' is a ' + k + '.'], explain: OBJ[k].charAt(0).toUpperCase() + OBJ[k].slice(1) + ' is shaped like a ' + k + '.' };
    }
    if (lv === 2) {
      var k2 = R.pick(SOLIDS), opts = R.shuffle([k2].concat(R.shuffle(SOLIDS.filter(function (x) { return x !== k2; })).slice(0, 2)));
      return { q: 'What is the name of this solid?', type: 'mc', options: opts, answer: opts.indexOf(k2), fig: solidPic(k2, 100), wide: true,
        hint: 'Look for flat faces, curved parts and points.', steps: ['Does it roll? Does it have a point?', 'Count the flat faces you can see.', 'It is a ' + k2 + '.'], explain: 'This solid is a ' + k2 + ', shaped like ' + OBJ[k2] + '.' };
    }
    var k3 = R.pick(Object.keys(FACES)), f = FACES[k3], o2 = R.shuffle([f].concat(R.shuffle(['circle', 'triangle', 'square', 'rectangle'].filter(function (x) { return x !== f; })).slice(0, 2)));
    return { q: 'If you trace around the bottom of a <b>' + k3 + '</b>, what flat shape do you get?', type: 'mc', options: o2.map(function (x) { return flatPic(x, 58); }), answer: o2.indexOf(f), fig: solidPic(k3, 90),
      hint: 'Look at the flat face it stands on.', steps: ['A ' + k3 + ' stands on a flat face.', 'That face is a ' + f + '.', 'Tracing it makes a ' + f + '.'], explain: 'The bottom face of a ' + k3 + ' is a ' + f + '.' };
  }
  function qSym(lv) {
    var list = lv === 1 ? SYM.filter(function (s) { return ['square', 'circle', 'heart'].indexOf(s[0]) >= 0; }) : SYM;
    var it = R.pick(list);
    return { q: 'If you fold on the dashed line, do the two halves <b>match</b>?', type: 'mc', options: ['Yes, they match', 'No, they do not match'], answer: it[2] ? 0 : 1, fig: foldPic(it[0], it[1]), wide: true, chk: it,
      hint: 'Imagine folding the paper on the line. Would one side land exactly on top of the other?', steps: ['Look at the two sides of the dashed line.', 'Are they the same size and the same shape, like a mirror?', it[2] ? 'Yes. The halves match.' : 'No. One side is different, so they do not match.'],
      explain: it[2] ? 'The line splits the shape into two matching halves.' : 'The two parts are not the same, so they do not match.' };
  }
  function qPos(lv) {
    var items = R.shuffle(THINGS).slice(0, 9), i = R.int(0, 8), r = Math.floor(i / 3), c = i % 3;
    var rel = [];
    if (r > 0) rel.push(['above', i - 3]);
    if (r < 2) rel.push(['below', i + 3]);
    if (lv > 1 && c > 0) rel.push(['to the left of', i - 1]);
    if (lv > 1 && c < 2) rel.push(['to the right of', i + 1]);
    if (lv === 3 && c === 1) rel.push(['between', -1]);
    var pk = R.pick(rel), ans;
    var q;
    if (pk[0] === 'between') { q = 'What is <b>between</b> the ' + A.NAMES[items[i - 1]][0] + ' and the ' + A.NAMES[items[i + 1]][0] + '?'; ans = items[i]; }
    else { q = 'What is <b>' + pk[0] + '</b> the ' + A.NAMES[items[i]][0] + '?'; ans = items[pk[1]]; }
    var wrong = R.shuffle(items.filter(function (k) { return k !== ans && k !== items[i]; })).slice(0, 2);
    var o = R.mc(A.NAMES[ans][0], wrong.map(function (k) { return A.NAMES[k][0]; }));
    return { q: q, type: 'mc', options: o.options, answer: o.answer, fig: shelf(items),
      hint: pk[0] === 'above' ? 'Above means higher up, on the shelf over it.' : pk[0] === 'below' ? 'Below means lower down, on the shelf under it.' : pk[0] === 'between' ? 'Between means in the middle of the two.' : pk[0] === 'to the left of' ? 'Your left hand is the hand that makes an L with your thumb and finger.' : 'Right is the side away from your L hand.',
      steps: ['Find the ' + A.NAMES[items[i]][0] + ' on the shelf.', 'Look ' + (pk[0] === 'above' ? 'up one shelf' : pk[0] === 'below' ? 'down one shelf' : pk[0] === 'between' ? 'at the things on each side' : pk[0] === 'to the left of' ? 'one space to the left' : 'one space to the right') + '.', 'It is the ' + A.NAMES[ans][0] + '.'], explain: 'The ' + A.NAMES[ans][0] + ' is ' + pk[0] + ' the ' + A.NAMES[items[i]][0] + '.' };
  }
  function qCode(lv) {
    var n = 5, start, code, tries = 0;
    do {
      tries++;
      start = [R.int(0, 4), R.int(0, 4)];
      var len = lv === 1 ? R.int(1, 3) : lv === 2 ? R.int(3, 4) : R.int(4, 6), dirs = lv === 1 ? [R.pick(['U', 'D', 'L', 'Rt'])] : R.shuffle(['U', 'D', 'L', 'Rt']).slice(0, 2);
      code = []; for (var i = 0; i < len; i++) code.push(lv === 1 ? dirs[0] : lv === 2 ? dirs[i < len / 2 ? 0 : 1] : R.pick(['U', 'D', 'L', 'Rt']));
      var path = run(start, code), ok = path.every(function (p) { return p[0] >= 0 && p[0] < n && p[1] >= 0 && p[1] < n; });
      var end = path[path.length - 1];
    } while ((!ok || (end[0] === start[0] && end[1] === start[1])) && tries < 200);
    var cells = [];
    for (var x = 0; x < n; x++) for (var y = 0; y < n; y++) if (!(x === start[0] && y === start[1])) cells.push([x, y]);
    var walked = run(start, code).map(function (p) { return p[0] + ',' + p[1]; });
    var others = R.shuffle(cells.filter(function (c) { return walked.indexOf(c[0] + ',' + c[1]) < 0; })).slice(0, 2);
    var kinds = R.shuffle(['apple', 'star', 'fish', 'ball', 'flower']).slice(0, 3);
    var things = [[end[0], end[1], kinds[0]], [others[0][0], others[0][1], kinds[1]], [others[1][0], others[1][1], kinds[2]]];
    var o = R.mc(A.NAMES[kinds[0]][0], [A.NAMES[kinds[1]][0], A.NAMES[kinds[2]][0]]);
    var wordsCode = code.map(function (k) { return DIR[k][3]; }).join(', ');
    return { q: 'The robot follows this code, one arrow at a time: ' + codeHtml(code) + ' <span class="sr">(' + wordsCode + ')</span> What does it reach?', type: 'mc', options: o.options, answer: o.answer, fig: grid(n, start, things), chk: { start: start, code: code, things: things },
      hint: 'Move one square for each arrow. Put your finger on the robot and follow the arrows in order.', steps: ['Start at the robot.', 'Move one square for each arrow: ' + wordsCode + '.<div class="fig">' + grid(n, start, things, run(start, code)) + '</div>', 'The robot stops at the ' + A.NAMES[kinds[0]][0] + '.'],
      explain: 'Following ' + wordsCode + ', the robot reaches the ' + A.NAMES[kinds[0]][0] + '.' };
  }

  var CH = 'shapes-position';
  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters[CH].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  function card(html, cap) { return html + (cap ? '<span>' + cap + '</span>' : ''); }
  /* "Try it": code the robot. Tap arrows to write the code, then run it. */
  function robot(start, goal, kind) {
    return { do: 'Write code to move the robot to the <b>' + A.NAMES[kind][0] + '</b>. Tap arrows, then press <b>Run</b>.', mount: function (host, done) {
      var code = [];
      host.innerHTML = '<div class="btnrow" role="group" aria-label="Add a step">' + ['U', 'D', 'L', 'Rt'].map(function (k) { return '<button type="button" class="btn alt" data-d="' + k + '" aria-label="' + DIR[k][3] + '">' + DIR[k][2] + '</button>'; }).join('') + '</div>' +
        '<p>My code: <span class="cd"></span></p><div class="btnrow"><button type="button" class="btn rn">Run</button><button type="button" class="btn alt un">Take back</button></div><div class="fig g1-frame"></div><p class="mp-read" aria-live="polite"></p>';
      function draw(path) { A.$('.cd', host).innerHTML = code.length ? codeHtml(code) : '<span class="t2">no steps yet</span>'; A.$('.fig', host).innerHTML = grid(5, path ? path[path.length - 1] : start, [[goal[0], goal[1], kind]], path); }
      A.$$('[data-d]', host).forEach(function (b) { b.addEventListener('click', function () { if (code.length < 10) code.push(b.getAttribute('data-d')); draw(); }); });
      A.$('.un', host).addEventListener('click', function () { code.pop(); draw(); A.$('.mp-read', host).textContent = ''; });
      A.$('.rn', host).addEventListener('click', function () {
        var p = run(start, code), end = p[p.length - 1], off = p.some(function (q) { return q[0] < 0 || q[1] < 0 || q[0] > 4 || q[1] > 4; });
        if (off) { A.$('.mp-read', host).textContent = 'Oops, the robot would leave the grid. Take back a step.'; return; }
        draw(p); Manip.bump(A.$('.fig', host), 'mp-fade');
        if (end[0] === goal[0] && end[1] === goal[1]) { A.$('.mp-read', host).textContent = 'The robot reached the ' + A.NAMES[kind][0] + '!'; done('Your code works.'); }
        else A.$('.mp-read', host).textContent = 'Not there yet. Follow your code one step at a time to find the fix.';
      });
      draw();
    } };
  }
  var ROUND = { circle: 1 };

  var LESSONS = [
    { id: 'flat', title: 'Flat shapes', sub: 'Sides and corners.', concepts: [
      { id: 'sides', title: 'Sides and corners', exp: ['E1.1'], skill: 's-2d',
        body: '<p>Flat shapes are <b>2D shapes</b>. A <b>side</b> is a straight edge. A <b>corner</b> is where two sides meet.</p><div class="vrow">' + FLAT.map(function (k) { return '<figure>' + flatPic(k, 60) + '<figcaption>' + k + (SIDES[k] ? ': ' + SIDES[k] + ' sides' : ': round') + '</figcaption></figure>'; }).join('') + '</div>',
        watch: { tool: 'geoboard', opts: { size: 5 }, steps: [
          { say: 'Stretch a band around 3 pegs.', act: function (t) { return t.shape([[0, 4], [2, 0], [4, 4]], 450); }, ms: 900 },
          { say: '3 sides and 3 corners: a <b>triangle</b>.', ms: 1600 },
          { say: 'Now 4 pegs, all sides the same: a <b>square</b>.', act: function (t) { t.reset(); return t.shape([[0, 0], [3, 0], [3, 3], [0, 3]], 450); }, ms: 1800 }
        ] },
        try: { tool: 'geoboard', opts: { size: 5 }, tasks: [
          { do: 'Make a <b>triangle</b>. Tap pegs, then tap the first peg again to close it.', goal: function (s) { return s.closed && s.sides === 3; }, yes: '3 sides, 3 corners. A triangle.' },
          { do: 'Make a shape with <b>4 sides</b>.', goal: function (s) { return s.closed && s.sides === 4; }, yes: '4 sides and 4 corners.' }
        ] },
        key: '<p>Count the <b>sides</b> to name a shape.</p>',
        check: [P('s-2d', 1), P('s-2d', 2)] },
      { id: 'turned', title: 'Turning does not change the name', exp: ['E1.1'], skill: 's-2d', hard: true,
        body: '<p>A triangle turned upside down is still a triangle. It still has 3 sides. <b>Turning a shape does not change its name.</b></p>',
        watch: { tool: 'g1stage', steps: [0, 45, 90, 180].map(function (d, i) { return { say: i ? 'Turn it. Still 3 sides: still a <b>triangle</b>.' : 'A triangle.', act: function (t) { return t.show(A.svg(110, 110, '<g transform="rotate(' + d + ' 55 55)">' + flat('triangle', 55, 55, 92) + '</g>', 'a triangle turned')); }, ms: 1000 }; }) },
        try: { tool: 'g1pick', opts: { items: [0, 1, 2, 3].map(function (i) { var k = ['triangle', 'square', 'triangle', 'rectangle'][i], d = [180, 45, 100, 90][i]; return { id: k + i, html: A.svg(90, 90, '<g transform="rotate(' + d + ' 45 45)">' + flat(k, 45, 45, 70) + '</g>', 'a turned shape') }; }) }, tasks: [
          { do: 'Tap <b>every triangle</b>, even turned ones.', goal: function (s) { return s.n === 2 && s.picked.indexOf('triangle0') >= 0 && s.picked.indexOf('triangle2') >= 0; }, yes: 'Yes. They have 3 sides, so they are triangles.' }
        ] },
        ways: [{ label: 'Count, do not look', html: '<p>Do not decide by how it looks. Touch each side and count. 3 sides is always a triangle. 4 equal sides is always a square, even when it looks like a diamond.</p>' }],
        mistake: '<p>Saying a square turned on its corner is a "diamond", or an upside-down triangle is not a triangle. Count the sides together.</p>',
        key: '<p>Turn it any way: the name <b>stays the same</b>.</p>',
        check: [P('s-2d', 2), P('s-2d', 3)] }
    ] },

    { id: 'solids', title: 'Solid shapes', sub: 'Shapes you can hold.', concepts: [
      { id: 'names', title: 'Solids around us', exp: ['E1.1'], skill: 's-3d',
        body: '<p>Solid shapes are <b>3D objects</b>. You can hold them. A ball is a <b>sphere</b>. A can is a <b>cylinder</b>. A box is a <b>rectangular prism</b>.</p>',
        watch: { tool: 'g1stage', steps: SOLIDS.map(function (k) { return { say: 'A <b>' + k + '</b>, like ' + OBJ[k] + '.', act: function (t) { return t.show(solidPic(k, 120)); }, ms: 1100 }; }) },
        try: { tool: 'g1pick', opts: { multi: false, items: ['cube', 'sphere', 'cylinder', 'cone'].map(function (k) { return { id: k, html: card(solidPic(k, 70)) }; }) }, tasks: [
          { do: 'Tap the shape like a <b>soup can</b>.', goal: function (s) { return s.picked[0] === 'cylinder'; }, yes: 'A soup can is a cylinder.' },
          { do: 'Tap the shape like a <b>ball</b>.', setup: function (t) { t.clear(); }, reset: false, goal: function (s) { return s.picked[0] === 'sphere'; }, yes: 'A ball is a sphere.' }
        ] },
        key: '<p>Look for solid shapes in things around you.</p>',
        check: [P('s-3d', 1), P('s-3d', 1)] },
      { id: 'faces', title: 'Flat shapes in solid shapes', exp: ['E1.2'], skill: 's-3d',
        body: '<p>Trace around the bottom of a solid and you get a flat shape. A box gives a <b>rectangle</b>. A can gives a <b>circle</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Stand a can on paper and trace around it.', act: function (t) { return t.show(solidPic('cylinder', 110)); }, ms: 1400 },
          { say: 'The tracing is a <b>circle</b>.', act: function (t) { return t.show(flatPic('circle', 100)); }, ms: 1400 },
          { say: 'A cube gives a <b>square</b>.', act: function (t) { return t.show(solidPic('cube', 100) + flatPic('square', 90)); }, ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: ['circle', 'square', 'triangle', 'rectangle'].map(function (k) { return { id: k, html: card(flatPic(k, 60)) }; }) }, tasks: [
          { do: 'Trace a <b>cereal box</b> (a rectangular prism). Which shape do you get?', goal: function (s) { return s.picked[0] === 'rectangle'; }, yes: 'The face of a box is a rectangle.' }
        ] },
        key: '<p>Faces of solids are <b>flat shapes</b>.</p>',
        check: [P('s-3d', 2), P('s-3d', 3)] }
    ] },

    { id: 'sort', title: 'Sorting shapes', sub: 'One rule at a time.', concepts: [
      { id: 'rule', title: 'A sorting rule', exp: ['E1.1'], skill: 's-2d',
        body: '<p>To <b>sort</b>, pick one rule, like "4 sides" or "round". Colour and size do not matter for that rule.</p>',
        watch: { tool: 'g1pick', opts: { items: FLAT.concat(['square', 'triangle']).map(function (k, i) { return { id: k + i, html: flatPic(k, 56) }; }) }, steps: [
          { say: 'Rule: shapes with <b>4 sides</b>.', ms: 1200 },
          { say: 'Square: 4 sides. Yes.', act: function (t) { return t.pick('square2'); }, ms: 700 },
          { say: 'Rectangle: 4 sides. Yes.', act: function (t) { return t.pick('rectangle3'); }, ms: 700 },
          { say: 'This square is a different colour, but it has 4 sides. Yes.', act: function (t) { return t.pick('square5'); }, ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { items: ['triangle', 'circle', 'hexagon', 'triangle', 'square', 'circle'].map(function (k, i) { return { id: k + i, html: flatPic(k, 56 - (i % 2) * 14) }; }) }, tasks: [
          { do: 'Sort by the rule <b>round</b>. Tap every round shape.', goal: function (s) { return s.n === 2 && s.picked.every(function (p) { return /circle/.test(p); }); }, yes: 'Only the circles are round. Big or small does not matter.' }
        ] },
        key: '<p>One <b>rule</b> decides each group.</p>',
        check: [P('s-2d', 3), P('s-3d', 2)] }
    ] },

    { id: 'halves', title: 'Matching halves', sub: 'Fold it. Do the halves match?', concepts: [
      { id: 'fold', title: 'Halves that match', exp: ['E1.3'], skill: 's-sym',
        body: '<p>Some shapes fold so the two halves <b>match</b> exactly, like a mirror. A heart folded down the middle matches.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Fold the heart down the middle.', act: function (t) { return t.show(foldPic('heart', 'v')); }, ms: 1400 },
          { say: 'The two sides match. Yes.', ms: 1200 },
          { say: 'Fold it across. The top and bottom do <b>not</b> match.', act: function (t) { return t.show(foldPic('heart', 'h')); }, ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { items: [['square', 'd'], ['circle', 'off'], ['rectangle', 'v'], ['triangle', 'h']].map(function (p, i) { return { id: 'f' + i, html: foldPic(p[0], p[1]) }; }) }, tasks: [
          { do: 'Tap every fold line where the halves <b>match</b>.', goal: function (s) { return s.n === 2 && s.picked.indexOf('f0') >= 0 && s.picked.indexOf('f2') >= 0; }, yes: 'The square corner to corner, and the rectangle down the middle.' }
        ] },
        mistake: '<p>Thinking every line through the middle makes matching halves. Fold real paper shapes to test.</p>',
        key: '<p>Fold it. If the edges line up <b>all the way round</b>, the halves match.</p>',
        check: [P('s-sym', 1), P('s-sym', 2)] }
    ] },

    { id: 'where', title: 'Where is it?', sub: 'Position words.', concepts: [
      { id: 'above', title: 'Above, below, beside', exp: ['E1.4'], skill: 's-pos',
        body: '<p><b>Position words</b> tell where something is: above, below, beside, between, in front of, behind.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'The flower is in the middle.', act: function (t) { return t.show(shelf(['apple', 'ball', 'star', 'fish', 'flower', 'car', 'leaf', 'sock', 'cube'])); }, ms: 1400 },
          { say: 'The ball is <b>above</b> the flower. The sock is <b>below</b> it.', ms: 1800 },
          { say: 'The fish and the car are <b>beside</b> it. The flower is <b>between</b> them.', ms: 2000 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: ['ball', 'sock', 'car'].map(function (k) { return { id: k, html: card(G1.icon(k, 50), A.NAMES[k][0]) }; }) }, tasks: [
          { do: 'Look at the shelf. What is <b>below</b> the flower?<div class="fig">' + shelf(['apple', 'ball', 'star', 'fish', 'flower', 'car', 'leaf', 'sock', 'cube']) + '</div>', goal: function (s) { return s.picked[0] === 'sock'; }, yes: 'The sock is below the flower.' }
        ] },
        key: '<p>Position words tell <b>where</b>.</p>',
        check: [P('s-pos', 1), P('s-pos', 2)] },
      { id: 'left', title: 'Left and right', exp: ['E1.4'], skill: 's-pos', hard: true,
        body: '<p>Hold up your <b>left</b> hand with your thumb out. Your thumb and finger make an <b>L</b>. L is for left.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Hold up both hands, palms away from you.', act: function (t) { return t.show(A.svg(220, 110, A.icon('hand', 55, 55, 90) + '<g transform="translate(220,0) scale(-1,1)">' + A.icon('hand', 55, 55, 90) + '</g>', 'two hands')); }, ms: 1500 },
          { say: 'The hand that makes an <b>L</b> is your <b>left</b>.', ms: 1600 },
          { say: 'On the shelf, the apple is on the <b>left</b> of the ball. The star is on the <b>right</b>.', act: function (t) { return t.show(shelf(['apple', 'ball', 'star', '', '', '', '', '', ''])); }, ms: 2000 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: ['fish', 'car'].map(function (k) { return { id: k, html: card(G1.icon(k, 50), A.NAMES[k][0]) }; }) }, tasks: [
          { do: 'Which is on the <b>left</b> of the flower?<div class="fig">' + shelf(['', '', '', 'fish', 'flower', 'car', '', '', '']) + '</div>', goal: function (s) { return s.picked[0] === 'fish'; }, yes: 'The fish is on the left.' }
        ] },
        ways: [{ label: 'Use your body', html: '<p>Stand up. Wave your left hand. Stomp your right foot. Touch your left ear. Practise a little every day.</p>' }],
        mistake: '<p>Mixing up left and right, which is very common at this age. Use the "L" hand trick and a sticker on the left hand.</p>',
        key: '<p>The hand that makes an <b>L</b> is your <b>left</b>.</p>',
        check: [P('s-pos', 2), P('s-pos', 3)] }
    ] },

    { id: 'code', title: 'Directions and code', sub: 'Steps in order.', concepts: [
      { id: 'follow', title: 'Follow the code', exp: ['E1.5', 'C3.1'], skill: 's-code',
        body: '<p><b>Code</b> is a list of steps done in order. Each arrow moves the robot one square.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'The code is ' + codeHtml(['Rt', 'Rt', 'U', 'U']) + '.', act: function (t) { return t.show(grid(5, [0, 4], [[2, 2, 'star']])); }, ms: 1500 },
          { say: 'Right, right.', act: function (t) { return t.show(grid(5, [2, 4], [[2, 2, 'star']], run([0, 4], ['Rt', 'Rt']))); }, ms: 1200 },
          { say: 'Up, up. The robot reaches the star.', act: function (t) { return t.show(grid(5, [2, 2], [[2, 2, 'star']], run([0, 4], ['Rt', 'Rt', 'U', 'U']))); }, ms: 1800 }
        ] },
        try: robot([0, 4], [3, 1], 'star'),
        key: '<p>Do each step <b>in order</b>.</p>',
        check: [P('s-code', 1), P('s-code', 2)] },
      { id: 'debug', title: 'Fix the code', exp: ['C3.2'], skill: 's-code', hard: true,
        body: '<p>If the robot ends up in the wrong place, the code has a mistake. Follow it <b>one step at a time</b> to find the step to change.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'This code should reach the apple: ' + codeHtml(['U', 'U', 'Rt']) + '.', act: function (t) { return t.show(grid(5, [1, 3], [[3, 1, 'apple']])); }, ms: 1600 },
          { say: 'Run it: up, up, right. The robot misses the apple.', act: function (t) { return t.show(grid(5, [2, 1], [[3, 1, 'apple']], run([1, 3], ['U', 'U', 'Rt']))); }, ms: 1800 },
          { say: 'It needs one more right. Fixed code: ' + codeHtml(['U', 'U', 'Rt', 'Rt']) + '.', act: function (t) { return t.show(grid(5, [3, 1], [[3, 1, 'apple']], run([1, 3], ['U', 'U', 'Rt', 'Rt']))); }, ms: 2000 }
        ] },
        try: robot([4, 4], [0, 2], 'apple'),
        ways: [{ label: 'Act it out', html: '<p>Make a grid with tape on the floor. One person reads the code. The other walks it, one square per arrow.</p>' }],
        mistake: '<p>Starting over from scratch instead of finding the one wrong step. Point to each arrow and move a finger one square.</p>',
        key: '<p>Find the step that goes wrong. <b>Change just that step.</b></p>',
        check: [P('s-code', 2), P('s-code', 3)] }
    ] }
  ];

  A.register('shapes-position', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Flat shapes</h2>' +
'<p>Flat shapes are also called <b>2D shapes</b>. We tell them apart by their <b>sides</b> (straight edges) and <b>corners</b> (where two sides meet).</p>' +
'<div class="vrow">' + FLAT.map(function (k) { return '<figure>' + flatPic(k, 70) + '<figcaption>' + k + ': ' + (SIDES[k] ? SIDES[k] + ' sides, ' + SIDES[k] + ' corners' : 'round, no corners') + '</figcaption></figure>'; }).join('') + '</div>' +
'<div class="eg"><b class="t">Watch me</b><p>I count the sides of this shape. I touch each side once: 1, 2, 3, 4, 5, 6. It has 6 sides and 6 corners. It is a <b>hexagon</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>A triangle turned upside down is still a triangle. Turning a shape does not change its name.</p>' +
'<div class="vrow"><figure>' + A.svg(90, 90, flat('triangle', 45, 45, 80), 'a triangle') + '</figure><figure>' + A.svg(90, 90, '<g transform="rotate(180 45 45)">' + flat('triangle', 45, 45, 80) + '</g>', 'a triangle upside down') + '</figure><figure>' + A.svg(90, 90, '<g transform="rotate(35 45 45)">' + flat('triangle', 45, 45, 80) + '</g>', 'a triangle tipped over') + '</figure></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Solid shapes</h2>' +
'<p>Solid shapes are also called <b>3D objects</b>. You can hold them. Many things around us have these shapes.</p>' +
'<div class="vrow">' + SOLIDS.map(function (k) { return '<figure>' + solidPic(k, 80) + '<figcaption>' + k + ': like ' + OBJ[k] + '</figcaption></figure>'; }).join('') + '</div>' +
'<div class="eg"><b class="t">Watch me</b><p>A cereal box is a rectangular prism. If I stand it on a table and trace around the bottom, I get a <b>rectangle</b>. Flat shapes are hiding in solid shapes.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>A sphere rolls. A cube slides. A cylinder can roll and slide.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Sorting shapes</h2>' +
'<p>We can <b>sort</b> shapes by one thing at a time. The <b>sorting rule</b> tells which group each shape goes in.</p>' +
'<div class="lab"><span class="lt">Try it: pick a sorting rule</span><div class="btnrow" role="group" aria-label="Sorting rule"><button type="button" class="btn" data-rule="curve">Straight sides or round</button><button type="button" class="btn alt" data-rule="four">4 sides or not</button><button type="button" class="btn alt" data-rule="three">3 corners or not</button></div>' +
'<div id="srfig"></div></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is the sorting rule?</p><div class="vrow"><figure>' + A.svg(200, 70, flat('square', 34, 35, 56) + flat('rectangle', 100, 35, 56) + flat('square', 166, 35, 46, '#2f9a4c'), 'Group 1: a square, a rectangle, another square') + '<figcaption>Group 1</figcaption></figure><figure>' + A.svg(200, 70, flat('triangle', 34, 35, 56) + flat('circle', 100, 35, 56) + flat('hexagon', 166, 35, 56), 'Group 2: a triangle, a circle, a hexagon') + '<figcaption>Group 2</figcaption></figure></div><ol>' +
'<li>Look at group 1. Count the sides: 4, 4, 4.</li><li>Look at group 2: 3 sides, no sides, 6 sides. None has 4.</li><li>The rule is: <b>4 sides</b> or <b>not 4 sides</b>. Colour and size do not matter here.</li></ol></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Matching halves</h2>' +
'<p>Some shapes can be folded so the two halves <b>match</b> exactly, like a mirror.</p>' +
'<div class="vrow"><figure>' + foldPic('heart', 'v') + '<figcaption>The halves match</figcaption></figure><figure>' + foldPic('heart', 'h') + '<figcaption>The halves do not match</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>I fold a square from corner to corner. One triangle lands exactly on the other. The halves <b>match</b>.</p><div class="fig">' + foldPic('square', 'd') + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Try it with paper: draw a shape, cut it out, and fold it. If the edges line up all the way around, the halves match.</p></div>' +
'<div class="lab"><span class="lt">Try it: fold it</span><div class="ctrl"><label for="sym1">Shape<select id="sym1"><option value="square">square</option><option value="rectangle">rectangle</option><option value="circle">circle</option><option value="triangle">triangle</option><option value="heart">heart</option></select></label>' +
'<label for="sym2">Fold line<select id="sym2"><option value="v">up and down</option><option value="h">across</option><option value="d">corner to corner</option></select></label></div>' +
'<div class="fig" id="symfig"></div><div class="out" id="symout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Where is it?</h2>' +
'<p><b>Position words</b> tell where something is: above, below, beside, between, left, right, in front of, behind.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + shelf(['apple', 'ball', 'star', 'fish', 'flower', 'car', 'leaf', 'sock', 'cube']) + '</div><p>The flower is in the middle. The ball is <b>above</b> the flower. The sock is <b>below</b> it. The fish is to the <b>left</b> of it. The car is to the <b>right</b>. The flower is <b>between</b> the fish and the car.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Hold up your left hand with your thumb out. Your thumb and finger make an <b>L</b>. L is for left.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Directions and code</h2>' +
'<p><b>Code</b> is a list of steps, done in order. Each arrow moves the robot one square.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + grid(5, [0, 4], [[2, 2, 'star']], run([0, 4], ['Rt', 'Rt', 'U', 'U'])) + '</div><p>The code ' + codeHtml(['Rt', 'Rt', 'U', 'U']) + ' means: right, right, up, up. The robot follows each step in order and reaches the <b>star</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>The order matters. If one arrow is wrong, the robot ends up somewhere else. To fix the code, follow it one step at a time and find where it goes wrong.</p></div>' +
'<div class="lab"><span class="lt">Try it: code the robot to the star</span><div class="btnrow" role="group" aria-label="Add a step"><button type="button" class="btn alt" data-dir="U" aria-label="up">&#8593;</button><button type="button" class="btn alt" data-dir="D" aria-label="down">&#8595;</button><button type="button" class="btn alt" data-dir="L" aria-label="left">&#8592;</button><button type="button" class="btn alt" data-dir="Rt" aria-label="right">&#8594;</button></div>' +
'<div class="btnrow"><button type="button" class="btn" id="cdrun">Run the code</button><button type="button" class="btn alt" id="cdundo">Remove last step</button><button type="button" class="btn alt" id="cdnew">New puzzle</button></div>' +
'<p class="out">My code: <span id="cdcode"></span></p><div class="fig" id="cdfig"></div><div class="out" id="cdout" aria-live="polite"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      var SET = [['circle', 50], ['square', 60], ['triangle', 54], ['rectangle', 64], ['hexagon', 56], ['square', 44], ['triangle', 66], ['circle', 40]];
      function sortRule(rule) {
        var yes = [], no = [], lab = rule === 'curve' ? ['Straight sides', 'Round'] : rule === 'four' ? ['4 sides', 'Not 4 sides'] : ['3 corners', 'Not 3 corners'];
        SET.forEach(function (it) { var k = it[0], inA = rule === 'curve' ? SIDES[k] > 0 : rule === 'four' ? SIDES[k] === 4 : SIDES[k] === 3; (inA ? yes : no).push(it); });
        function hoop(list, t) { var s = '', x = 8; list.forEach(function (it) { s += flat(it[0], x + it[1] / 2, 50, it[1]); x += it[1] + 6; }); return '<figure>' + A.svg(Math.max(x + 4, 80), 100, '<rect x="2" y="2" width="' + Math.max(x, 76) + '" height="96" rx="30" style="fill:none;stroke:var(--strand)" stroke-width="3"/>' + s, t + ': ' + list.map(function (i) { return i[0]; }).join(', ')) + '<figcaption>' + t + '</figcaption></figure>'; }
        $('#srfig', root).innerHTML = '<div class="vrow">' + hoop(yes, lab[0]) + hoop(no, lab[1]) + '</div>';
      }
      A.$$('[data-rule]', root).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-rule') === 'curve'));
        b.addEventListener('click', function () { A.$$('[data-rule]', root).forEach(function (x) { x.classList.toggle('alt', x !== b); x.setAttribute('aria-pressed', String(x === b)); }); sortRule(b.getAttribute('data-rule')); });
      });
      sortRule('curve');
      function sym() {
        var sh = $('#sym1', root).value, ln = $('#sym2', root).value;
        var good = { square: { v: 1, h: 1, d: 1 }, rectangle: { v: 1, h: 1, d: 0 }, circle: { v: 1, h: 1, d: 1 }, triangle: { v: 1, h: 0, d: 0 }, heart: { v: 1, h: 0, d: 0 } }[sh][ln];
        var line = sh === 'circle' && ln === 'd' ? 'd' : ln;
        $('#symfig', root).innerHTML = sh === 'triangle' && ln === 'd' ? A.svg(128, 128, '<path d="M64 14L114 106H14Z" ' + st(COL.triangle) + '/><line x1="14" y1="106" x2="89" y2="60" style="stroke:var(--ink)" stroke-width="3.5" stroke-dasharray="8 6"/>', 'A triangle with a slanted fold line') :
          sh === 'heart' && ln === 'd' ? A.svg(128, 128, '<path d="M64 108C10 74 22 22 64 44C106 22 118 74 64 108Z" ' + st('#e05aa0') + '/><line x1="14" y1="20" x2="114" y2="110" style="stroke:var(--ink)" stroke-width="3.5" stroke-dasharray="8 6"/>', 'A heart with a slanted fold line') :
          sh === 'circle' && ln === 'd' ? A.svg(128, 128, flat('circle', 64, 64, 110) + '<line x1="22" y1="22" x2="106" y2="106" style="stroke:var(--ink)" stroke-width="3.5" stroke-dasharray="8 6"/>', 'A circle with a slanted fold line through the middle') : foldPic(sh, line);
        $('#symout', root).innerHTML = good ? '<b>The halves match.</b> One side would land exactly on the other.' : '<b>The halves do not match.</b> The two parts are different shapes.';
      }
      $('#sym1', root).addEventListener('change', sym); $('#sym2', root).addEventListener('change', sym); sym();
      var start, star, code = [];
      function newPuzzle() {
        do { start = [R.int(0, 4), R.int(0, 4)]; star = [R.int(0, 4), R.int(0, 4)]; } while (Math.abs(start[0] - star[0]) + Math.abs(start[1] - star[1]) < 3);
        code = []; draw();
        $('#cdout', root).textContent = 'Press the arrows to write your code. Then press Run.';
      }
      function draw(path) {
        $('#cdcode', root).innerHTML = code.length ? codeHtml(code) : '(no steps yet)';
        $('#cdfig', root).innerHTML = grid(5, path ? path[path.length - 1] : start, [[star[0], star[1], 'star']], path);
      }
      A.$$('[data-dir]', root).forEach(function (b) { b.addEventListener('click', function () { if (code.length < 12) { code.push(b.getAttribute('data-dir')); draw(); } }); });
      $('#cdundo', root).addEventListener('click', function () { code.pop(); draw(); });
      $('#cdnew', root).addEventListener('click', newPuzzle);
      $('#cdrun', root).addEventListener('click', function () {
        var path = run(start, code), off = -1;
        path.forEach(function (p, i) { if (off < 0 && (p[0] < 0 || p[0] > 4 || p[1] < 0 || p[1] > 4)) off = i; });
        if (off >= 0) { draw(path.slice(0, off)); $('#cdout', root).innerHTML = 'Step ' + off + ' moves the robot off the grid. Fix that step.'; return; }
        draw(path);
        var e = path[path.length - 1];
        $('#cdout', root).innerHTML = e[0] === star[0] && e[1] === star[1] ? '<b>The robot reached the star.</b> Your code has ' + code.length + ' steps.' : 'The robot stopped ' + (e[0] < star[0] ? (star[0] - e[0]) + ' square' + (star[0] - e[0] > 1 ? 's' : '') + ' left of' : e[0] > star[0] ? (e[0] - star[0]) + ' square' + (e[0] - star[0] > 1 ? 's' : '') + ' right of' : 'in line with') + ' the star' + (e[1] !== star[1] ? ', and ' + Math.abs(e[1] - star[1]) + ' square' + (Math.abs(e[1] - star[1]) > 1 ? 's' : '') + (e[1] < star[1] ? ' above' : ' below') + ' it' : '') + '. Change the code and run it again.';
      });
      newPuzzle();
    },

    checks: [
      [function () { return q2d(1); }, function () { return q2d(2); }, function () { return q2d(2); }],
      [function () { return q3d(1); }, function () { return q3d(2); }, function () { return q3d(3); }],
      [function () { return q2d(3); }, function () { return q2d(3); }, function () { return q2d(3); }],
      [function () { return qSym(1); }, function () { return qSym(2); }, function () { return qSym(2); }],
      [function () { return qPos(1); }, function () { return qPos(2); }, function () { return qPos(3); }],
      [function () { return qCode(1); }, function () { return qCode(2); }, function () { return qCode(2); }]
    ],

    quiz: [
      { q: 'How many sides does a <b>hexagon</b> have?', type: 'num', answer: 6, fig: flatPic('hexagon', 90),
        hint: 'Touch each side once as you count.', explain: 'A hexagon has 6 sides and 6 corners.' },
      { q: 'Which solid is shaped like <b>a soup can</b>?', type: 'mc', options: [solidPic('cone', 70), solidPic('cylinder', 70), solidPic('cube', 70)], answer: 1,
        hint: 'A soup can has a circle on the top and bottom.', explain: 'A soup can is a cylinder.' },
      { q: 'If you trace around the bottom of a <b>cube</b>, what flat shape do you get?', type: 'mc', options: [flatPic('circle', 58), flatPic('triangle', 58), flatPic('square', 58)], answer: 2,
        hint: 'All the faces of a cube are the same shape.', explain: 'Every face of a cube is a square.' },
      { q: 'Three of these shapes have 4 sides. Which one does <b>not</b> belong?', type: 'mc', options: [flatPic('square', 60), flatPic('triangle', 60), flatPic('rectangle', 60), flatPic('square', 46)], answer: 1,
        hint: 'Count the sides on each shape.', explain: 'The triangle has 3 sides, not 4.' },
      { q: 'If you fold on the dashed line, do the two halves <b>match</b>?', type: 'mc', options: ['Yes, they match', 'No, they do not match'], answer: 1, wide: true, fig: foldPic('rectangle', 'd'),
        hint: 'Imagine folding on the line. Would the corners line up?', explain: 'Folding a rectangle from corner to corner does not make the halves line up, so they do not match.' },
      { q: 'What is <b>below</b> the star?', type: 'mc', options: ['apple', 'car', 'fish'], answer: 1, fig: shelf(['apple', 'ball', 'star', 'fish', 'flower', 'car', 'leaf', 'sock', 'cube']),
        hint: 'Find the star. Look down one shelf.', explain: 'The car is on the shelf just under the star.' },
      { q: 'The robot follows this code: ' + codeHtml(['U', 'U', 'Rt']) + ' <span class="sr">(up, up, right)</span> What does it reach?', type: 'mc', options: ['apple', 'ball', 'fish'], answer: 2, fig: grid(5, [1, 3], [[2, 1, 'fish'], [0, 1, 'apple'], [3, 3, 'ball']]),
        hint: 'Move one square for each arrow, in order.', explain: 'Up, up puts the robot just right of the apple. Then right one square: the fish.' }
    ],

    practice: [
      { id: 's-2d', name: 'Flat shapes', code: 'E1.1', gen: q2d },
      { id: 's-3d', name: 'Solid shapes', code: 'E1.1, E1.2', gen: q3d },
      { id: 's-sym', name: 'Matching halves', code: 'E1.3', gen: qSym },
      { id: 's-pos', name: 'Position words', code: 'E1.4', gen: qPos },
      { id: 's-code', name: 'Follow the code', code: 'E1.5, C3.1, C3.2', gen: qCode }
    ]
  });
})();
