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

  A.register('shapes-position', {
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
