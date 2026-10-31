(function () {
  var A = Atlas, R = A.R, D = A.draw, M = '&minus;';
  var COLS = ['var(--strand)', 'var(--p1)', 'var(--se)', 'var(--sc)', 'var(--sf)', 'var(--p0)'];
  /* g plates with n things on each. Wraps after 4 plates. */
  function plates(g, n, kind, label) {
    var pw = 116, ph = 96, per = Math.min(g, 4), s = '';
    for (var i = 0; i < g; i++) {
      var px = 6 + (i % per) * (pw + 12), py = 6 + Math.floor(i / per) * (ph + 12);
      s += '<ellipse cx="' + (px + pw / 2) + '" cy="' + (py + ph / 2) + '" rx="' + pw / 2 + '" ry="' + ph / 2 + '" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2.5"/>';
      s += '<ellipse cx="' + (px + pw / 2) + '" cy="' + (py + ph / 2) + '" rx="' + (pw / 2 - 10) + '" ry="' + (ph / 2 - 9) + '" fill="none" style="stroke:var(--line)" stroke-width="1.5"/>';
      var cols = n <= 4 ? 2 : 3, r = n > 9 ? 8 : 10, gx = r * 2.5;
      for (var j = 0; j < n; j++) {
        var rows = Math.ceil(n / cols), cx = px + pw / 2 + ((j % cols) - (Math.min(cols, n) - 1) / 2) * gx, cy = py + ph / 2 + (Math.floor(j / cols) - (rows - 1) / 2) * gx;
        s += A.THING[kind || 'dot'](cx, cy, r, kind === 'dot' || !kind ? COLS[i % COLS.length] : undefined);
      }
    }
    var rowsP = Math.ceil(g / per);
    return A.svg(per * (pw + 12) + 2, rowsP * (ph + 12) + 2, s, label || g + ' plates with ' + n + ' on each plate');
  }
  /* sharing: items dealt into s boxes; left = leftovers shown below */
  function share(total, s, label) {
    var each = Math.floor(total / s), left = total % s, bw = 96, out = '', per = Math.min(s, 4);
    for (var i = 0; i < s; i++) {
      var bx = 6 + (i % per) * (bw + 12), by = 6 + Math.floor(i / per) * 120;
      out += D.rr(bx, by, bw, 106, 14, 'var(--card)', 'style="stroke:var(--ink2)" stroke-width="2.5"');
      out += '<text x="' + (bx + bw / 2) + '" y="' + (by + 100) + '" text-anchor="middle" font-size="16" class="t2">friend ' + (i + 1) + '</text>';
      for (var j = 0; j < each; j++) out += A.THING.dot(bx + 22 + (j % 3) * 26, by + 20 + Math.floor(j / 3) * 24, 9, COLS[0]);
    }
    var y0 = 6 + Math.ceil(s / per) * 120;
    if (left) {
      out += '<text x="6" y="' + (y0 + 22) + '" font-size="17" font-weight="700">Left over:</text>';
      for (var k = 0; k < left; k++) out += A.THING.dot(110 + k * 26, y0 + 16, 9, 'var(--bad)');
    }
    return A.svg(Math.max(per * (bw + 12) + 2, 240), y0 + (left ? 34 : 0), out, label || total + ' shared among ' + s + ': ' + each + ' each' + (left ? ', ' + left + ' left over' : ''));
  }
  /* pieces of size 1/d (d = 2 or 4) joined into wholes */
  function partsToWholes(n, d) {
    var r = 34, s = '', wholes = Math.ceil(n / d), gap = 2 * r + 18;
    for (var w = 0; w < wholes; w++) {
      var cx = 6 + r + w * gap, cy = 6 + r;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:var(--card);stroke:var(--line)" stroke-width="2" stroke-dasharray="5 4"/>';
      for (var i = 0; i < d; i++) {
        var k = w * d + i;
        if (k >= n) break;
        var a0 = -Math.PI / 2 + 2 * Math.PI * i / d, a1 = a0 + 2 * Math.PI / d;
        s += '<path d="M' + cx + ' ' + cy + 'L' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + 'Z" style="fill:' + (d === 2 ? 'var(--se)' : 'var(--sd)') + ';stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
      }
    }
    return A.svg(wholes * gap, 2 * r + 12, s, n + ' ' + (d === 2 ? 'halves' : 'fourths') + ' of a circle, put together into wholes');
  }
  function wholesText(n, d) {
    var w = Math.floor(n / d), p = n % d, nm = d === 2 ? ['half', 'halves'] : ['fourth', 'fourths'];
    var part = p === 0 ? '' : d === 2 ? 'a half' : p === 1 ? 'one fourth' : p === 2 ? 'two fourths (a half)' : 'three fourths';
    if (!w) return part;
    return w + ' whole' + (w > 1 ? 's' : '') + (part ? ' and ' + part : '');
  }
  function rep(g, n) { var a = []; for (var i = 0; i < g; i++) a.push(n); return a.join(' + '); }
  function skip(g, n) { var a = []; for (var i = 1; i <= g; i++) a.push(i * n); return a.join(', '); }

  A.register('groups-sharing', {
    html:
'<section class="sec"><h2><span class="n">1</span>Equal groups</h2>' +
'<p><b>Equal groups</b> all have the same number in them. To find the total, add the same number again and again, or skip count.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>3 plates with 4 cookies on each. That is <b>3 groups of 4</b>. I skip count by 4s: 4, 8, 12. So there are <b>12</b> cookies. 4 + 4 + 4 = 12.</p><div class="fig">' + plates(3, 4, 'dot') + '</div></div>' +
'<div class="yt" data-yt="groups"></div>' +
'<div class="lab"><span class="lt">Try it: make equal groups</span>' +
'<div class="ctrl"><label for="gg">Groups: <output id="ggo">4</output><input type="range" id="gg" min="1" max="8" value="4"></label><label for="gn">In each group: <output id="gno">3</output><input type="range" id="gn" min="1" max="10" value="3"></label></div>' +
'<div class="fig" id="gfig"></div><div class="out" id="gout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>"Groups of" is a short way to say "add the same number again". 5 groups of 2 is 2 + 2 + 2 + 2 + 2 = 10.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Equal or not equal?</h2>' +
'<p>Groups are only equal if <b>every</b> group has the same number. Check each group before you skip count.</p>' +
'<div class="vrow"><figure>' + plates(3, 5, 'star') + '<figcaption>Equal: 3 groups of 5</figcaption></figure><figure>' + (function () {
  var s = '', sizes = [5, 3, 5];
  sizes.forEach(function (n, i) { var px = 6 + i * 128; s += '<ellipse cx="' + (px + 58) + '" cy="54" rx="58" ry="48" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2.5"/>'; for (var j = 0; j < n; j++) s += A.THING.star(px + 58 + ((j % 3) - 1) * 25, 42 + Math.floor(j / 3) * 25, 10); });
  return A.svg(386, 108, s, 'Not equal: the groups have 5, 3 and 5');
})() + '<figcaption>Not equal: 5, 3 and 5</figcaption></figure></div>' +
'<div class="yt" data-yt="equal"></div>' +
'<p>An <b>array</b> is equal groups in rows. Each row is one group.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>An egg carton has 2 rows of 6. That is 2 groups of 6. 6 + 6 = <b>12</b> eggs.</p><div class="fig">' + D.things(12, { kind: 'dot', cols: 6, r: 14, col: 'var(--card)' }).replace(/fill:var\(--card\)/g, 'fill:#f4ede1') + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the number of groups to the number in each group. 3 groups of 4 is not 3 + 4 = 7. It is 4 + 4 + 4 = 12.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Groups of halves and fourths</h2>' +
'<p>A group can be part of a thing. <b>2 halves</b> make 1 whole. <b>4 fourths</b> make 1 whole.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>5 children each eat <b>half</b> an orange. That is 5 groups of one half. I put the halves together: 2 halves, 2 halves, and 1 half. That is <b>2 and a half oranges</b>.</p><div class="fig">' + partsToWholes(5, 2) + '</div></div>' +
'<div class="yt" data-yt="halves"></div>' +
'<div class="lab"><span class="lt">Try it: put the parts together</span>' +
'<div class="ctrl"><label for="hn">How many parts: <output id="hno">6</output><input type="range" id="hn" min="1" max="12" value="6"></label><label for="hd">Each part is<select id="hd"><option value="2">one half</option><option value="4" selected>one fourth</option></select></label></div>' +
'<div class="fig" id="hfig"></div><div class="out" id="hout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Count the parts, then make wholes. Every 2 halves is a whole. Every 4 fourths is a whole.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Sharing equally</h2>' +
'<p>To <b>share equally</b>, give one to each person, again and again, until there are not enough to go around. Every person gets the same number.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>12 grapes shared by 3 friends. I give 1 to each friend, then 1 more to each, and keep going. Each friend gets <b>4</b>. Check: 4 + 4 + 4 = 12.</p><div class="fig">' + share(12, 3) + '</div></div>' +
'<div class="yt" data-yt="share"></div>' +
'<div class="lab"><span class="lt">Try it: share fairly</span>' +
'<div class="ctrl"><label for="sn">Things to share: <output id="sno">10</output><input type="range" id="sn" min="1" max="12" value="10"></label><label for="ss">Friends: <output id="sso">4</output><input type="range" id="ss" min="1" max="6" value="4"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Giving out extra so nothing is left over. Then the shares are not equal. If some are left over, say so: 10 shared by 4 is 2 each with 2 left over.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Making groups by taking away</h2>' +
'<p>Sometimes you know the size of each group and need to find <b>how many groups</b>. Take away one group at a time and count how many times.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>12 muffins go in boxes of 3. How many boxes? 12 ' + M + ' 3 = 9, 9 ' + M + ' 3 = 6, 6 ' + M + ' 3 = 3, 3 ' + M + ' 3 = 0. I took away 3 four times, so there are <b>4 boxes</b>.</p>' +
'<div class="fig">' + D.hops({ min: 0, max: 12, tick: 1, every: 3, id: 'hb', hops: [{ a: 12, b: 9, t: M + '3' }, { a: 9, b: 6, t: M + '3' }, { a: 6, b: 3, t: M + '3' }, { a: 3, b: 0, t: M + '3' }], marks: [{ v: 12, col: 'var(--hi)' }], label: 'Jumps back by 3 from 12 to 0: four jumps' }) + '</div></div>' +
'<div class="yt" data-yt="takeg"></div>' +
'<div class="key"><b class="t">Key idea</b><p>Equal groups, adding the same number, and taking away the same number all go together. 3 + 3 + 3 + 3 = 12, so 12 can be split into 4 groups of 3.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function g() {
        var gg = +$('#gg', root).value, n = +$('#gn', root).value;
        $('#ggo', root).textContent = gg; $('#gno', root).textContent = n;
        $('#gfig', root).innerHTML = plates(gg, n, 'dot');
        $('#gout', root).innerHTML = '<p><b>' + gg + ' group' + (gg > 1 ? 's' : '') + ' of ' + n + '</b></p><p class="math">' + rep(gg, n) + ' = <span class="big">' + gg * n + '</span></p><p class="t2">Skip count by ' + n + 's: ' + skip(gg, n) + '.</p>';
      }
      A.bind(root, ['gg', 'gn'], g);
      function h() {
        var n = +$('#hn', root).value, d = +$('#hd', root).value;
        $('#hno', root).textContent = n;
        $('#hfig', root).innerHTML = partsToWholes(n, d);
        $('#hout', root).innerHTML = '<p>' + n + ' ' + (d === 2 ? (n === 1 ? 'half' : 'halves') : (n === 1 ? 'fourth' : 'fourths')) + ' make <span class="big">' + wholesText(n, d) + '</span>.</p>';
      }
      A.bind(root, ['hn', 'hd'], h);
      function s() {
        var n = +$('#sn', root).value, k = +$('#ss', root).value, e = Math.floor(n / k), l = n % k;
        $('#sno', root).textContent = n; $('#sso', root).textContent = k;
        $('#sfig', root).innerHTML = share(n, k);
        $('#sout', root).innerHTML = '<p><span class="big">' + e + ' each</span>' + (l ? ' and <b>' + l + ' left over</b>.' : ', none left over.') + '</p><p class="t2">Check: ' + (e ? rep(k, e) : '0') + (l ? ' + ' + l : '') + ' = ' + n + '.</p>';
      }
      A.bind(root, ['sn', 'ss'], s);
    },

    turns: {
      groups: function () { var g = R.int(2, 5), n = R.pick([2, 5, 10, 3, 4]); return { q: 'How many in all? <b>' + g + ' groups of ' + n + '</b>', type: 'num', answer: g * n, fig: plates(g, n, 'dot'), hint: 'Skip count by ' + n + 's, once for each plate.', explain: rep(g, n) + ' = ' + g * n + '.' }; },
      equal: function () {
        var eq = R.int(0, 1), n = R.int(3, 5), sizes = [n, n, n];
        if (!eq) sizes[R.int(0, 2)] = n - 1;
        var s = '';
        sizes.forEach(function (k, i) { var px = 6 + i * 128; s += '<ellipse cx="' + (px + 58) + '" cy="54" rx="58" ry="48" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2.5"/>'; for (var j = 0; j < k; j++) s += A.THING.apple(px + 58 + ((j % 3) - 1) * 25, 42 + Math.floor(j / 3) * 25, 10); });
        return { q: 'Are these equal groups?', type: 'mc', options: ['Yes, equal', 'No, not equal'], answer: eq ? 0 : 1, fig: A.svg(386, 108, s, 'Three plates of apples'), hint: 'Count the apples on each plate. Do all the plates have the same number?', explain: 'The plates have ' + sizes.join(', ') + '. ' + (eq ? 'They are all the same, so the groups are equal.' : 'One is different, so the groups are not equal.') };
      },
      halves: function () { var n = R.int(3, 7), o = R.mc(wholesText(n, 2), [wholesText(n + 1, 2), wholesText(n * 2, 2)]); return { q: n + ' friends each have <b>half</b> a sandwich. How many whole sandwiches is that?', type: 'mc', options: o.options, answer: o.answer, fig: partsToWholes(n, 2), hint: 'Every 2 halves make 1 whole. Count the halves in pairs.', explain: n + ' halves make ' + wholesText(n, 2) + '.' }; },
      share: function () { var k = R.int(2, 4), e = R.int(2, 3), n = k * e; return { q: n + ' pencils are shared equally by ' + k + ' friends. How many does each friend get?', type: 'num', answer: e, fig: D.things(n, { kind: 'cube', cols: 12, r: 9 }), hint: 'Give 1 to each friend, then 1 more to each, until all ' + n + ' are gone. Count one friend\'s share.', explain: 'Each friend gets ' + e + '. Check: ' + rep(k, e) + ' = ' + n + '.' }; },
      takeg: function () { var k = R.pick([2, 3, 4, 5]), g = R.int(2, Math.floor(12 / k)), n = k * g; return { q: n + ' socks go into bags of ' + k + '. How many bags?', type: 'num', answer: g, hint: 'Take away ' + k + ' again and again until you reach 0. Count how many times.', explain: 'Taking away ' + k + ' from ' + n + ' happens ' + g + ' times, so ' + g + ' bags.' }; }
    },

    quiz: [
      { q: 'How many in all? <b>4 groups of 5</b>', type: 'num', answer: 20, fig: plates(4, 5, 'star'), hint: 'Skip count by 5s, four times.', explain: '5, 10, 15, 20. 5 + 5 + 5 + 5 = 20.' },
      { q: 'Which is the same as <b>3 groups of 6</b>?', type: 'mc', options: ['3 + 6', '6 + 6 + 6', '3 + 3 + 3', '6 + 3 + 6'], answer: 1, hint: 'Write the number in each group once for every group.', explain: '3 groups of 6 is 6 + 6 + 6 = 18.' },
      { q: '7 children each eat <b>half</b> an apple. How many whole apples do they eat?', type: 'mc', options: ['3 and a half', '7', '14', '3'], answer: 0, fig: partsToWholes(7, 2), hint: 'Two halves make a whole. How many pairs of halves are there?', explain: '7 halves is 3 pairs of halves and 1 more half: 3 and a half apples.' },
      { q: '8 fourths of a pizza make how many whole pizzas?', type: 'num', answer: 2, fig: partsToWholes(8, 4), hint: 'Every 4 fourths make one whole.', explain: '4 fourths + 4 fourths = 2 wholes.' },
      { q: '12 crackers are shared equally by 4 friends. How many does each friend get?', type: 'num', answer: 3, hint: 'Deal them out one at a time to 4 friends.', explain: 'Each friend gets 3. 3 + 3 + 3 + 3 = 12.' },
      { q: '11 marbles are shared equally by 2 friends. What happens?', type: 'mc', options: ['Each gets 5, and 1 is left over', 'Each gets 6', 'Each gets 5, and none are left', 'Each gets 4, and 3 are left over'], answer: 0, fig: share(11, 2), hint: 'Deal them out. Stop when there are not enough for everyone to get one more.', explain: '5 + 5 = 10, so each gets 5 and 1 marble is left over.' },
      { q: '10 shoes are put into pairs. How many pairs?', type: 'num', answer: 5, hint: 'Take away 2 again and again: 10, 8, 6&hellip; Count the jumps.', explain: '10 &minus; 2 &minus; 2 &minus; 2 &minus; 2 &minus; 2 = 0. That is 5 pairs.' }
    ],

    practice: [
      { id: 'g2-groups', name: 'Equal groups', code: 'B2.5', gen: function (lv) {
        var g = R.int(2, lv === 1 ? 4 : 6), n = lv === 1 ? R.pick([2, 5, 10]) : R.int(2, 6);
        if (lv === 3) {
          var o = R.mc(rep(g, n), [g + ' + ' + n, rep(g + 1, n), rep(g, n + 1)]);
          return { q: 'Which matches <b>' + g + ' groups of ' + n + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Write ' + n + ' once for each of the ' + g + ' groups.', steps: ['There are ' + g + ' groups.', 'Each group has ' + n + '.', 'So write ' + n + ', ' + g + ' times: ' + rep(g, n) + '.'], explain: g + ' groups of ' + n + ' is ' + rep(g, n) + ' = ' + g * n + '.' };
        }
        return { q: 'How many in all? <b>' + g + ' groups of ' + n + '</b>', type: 'num', answer: g * n, fig: plates(g, n, R.pick(['dot', 'apple', 'star'])), hint: 'Skip count by ' + n + 's, one count for each group.', steps: ['Each group has ' + n + '.', 'Skip count by ' + n + 's ' + g + ' times: ' + skip(g, n) + '.', 'There are ' + g * n + ' in all.'], explain: rep(g, n) + ' = ' + g * n + '.' };
      } },
      { id: 'g2-parts', name: 'Groups of halves and fourths', code: 'B2.5', gen: function (lv) {
        var d = lv === 1 ? 2 : lv === 2 ? R.pick([2, 4]) : 4, n = d === 2 ? R.int(2, 9) : R.int(lv === 3 ? 5 : 2, 12);
        var right = wholesText(n, d), wrong = [wholesText(n + 1, d), wholesText(n + 2, d), wholesText(Math.max(1, n - 1), d), String(n)].filter(function (x) { return x !== right; });
        var o = R.mc(right, wrong);
        return { q: n + ' ' + (d === 2 ? 'halves' : 'fourths') + ' of a pie. How much pie is that?', type: 'mc', options: o.options, answer: o.answer, fig: lv < 3 ? partsToWholes(n, d) : '', hint: 'Every ' + d + ' ' + (d === 2 ? 'halves' : 'fourths') + ' make 1 whole.',
          steps: ['Group the pieces in ' + d + 's. Each group of ' + d + ' is a whole.', 'There are ' + Math.floor(n / d) + ' full group' + (Math.floor(n / d) === 1 ? '' : 's') + (n % d ? ' and ' + n % d + ' more piece' + (n % d > 1 ? 's' : '') : '') + '.', 'That is ' + right + '.<div class="fig">' + partsToWholes(n, d) + '</div>'], explain: n + ' ' + (d === 2 ? 'halves' : 'fourths') + ' make ' + right + '.' };
      } },
      { id: 'g2-share', name: 'Sharing equally', code: 'B2.6', gen: function (lv) {
        var k = R.int(2, lv === 1 ? 3 : 4), e = R.int(1, Math.floor(12 / k)), left = lv === 3 ? R.int(1, k - 1) : 0, n = k * e + left;
        if (n > 12) { e = Math.floor((12 - left) / k); n = k * e + left; }
        if (lv === 3) {
          var o = R.mc(e + ' each, ' + left + ' left over', [(e + 1) + ' each, none left over', e + ' each, none left over', (e - 1 >= 0 ? e - 1 : e + 2) + ' each, ' + (left + k) + ' left over']);
          return { q: n + ' stickers are shared equally by ' + k + ' friends. What happens?', type: 'mc', options: o.options, answer: o.answer, hint: 'Deal them out one at a time. Stop when there are not enough for everyone.', steps: ['Give 1 to each of the ' + k + ' friends, again and again.', 'After ' + e + ' rounds, ' + k * e + ' are given out.', left + ' left over is not enough for everyone to get another.<div class="fig">' + share(n, k) + '</div>'], explain: 'Each friend gets ' + e + ' and ' + left + ' ' + (left === 1 ? 'is' : 'are') + ' left over.' };
        }
        return { q: n + ' cookies are shared equally by ' + k + ' friends. How many does each friend get?', type: 'num', answer: e, fig: lv === 1 ? D.things(n, { kind: 'dot', cols: 12, r: 9 }) : '', hint: 'Deal one at a time to each friend until all ' + n + ' are gone.', steps: ['Give 1 to each friend. Keep going.', 'Each round uses ' + k + ' cookies.', 'Each friend gets ' + e + '.<div class="fig">' + share(n, k) + '</div>'], explain: rep(k, e) + ' = ' + n + ', so each gets ' + e + '.' };
      } },
      { id: 'g2-takeaway', name: 'How many groups?', code: 'B2.6', gen: function (lv) {
        var k = lv === 1 ? 2 : R.int(2, 5), g = R.int(2, Math.floor(12 / k)), n = k * g, hs = [];
        for (var i = 0; i < g; i++) hs.push({ a: n - i * k, b: n - (i + 1) * k, t: M + k });
        return { q: n + ' crayons are packed in boxes of ' + k + '. How many boxes?', type: 'num', answer: g, fig: lv === 1 ? D.things(n, { kind: 'cube', cols: 12, r: 9 }) : '', hint: 'Take away ' + k + ' at a time until you reach 0. Count how many times.',
          steps: ['Start at ' + n + '. Take away ' + k + ' again and again.', 'You reach 0 after ' + g + ' jumps.<div class="fig">' + D.hops({ min: 0, max: n, tick: 1, every: k, id: 'hg', hops: hs, marks: [{ v: n, col: 'var(--hi)' }] }) + '</div>', 'So there are ' + g + ' boxes.'], explain: n + ' is ' + g + ' groups of ' + k + '.' };
      } },
      { id: 'g2-story', name: 'Group and share stories', code: 'B2.5, B2.6', gen: function (lv) {
        var kind = R.int(0, lv === 1 ? 0 : 2), g = R.int(2, 4), n = R.int(2, 3);
        if (kind === 0) return { q: 'There are ' + g + ' vases. Each vase has ' + n + ' flowers. How many flowers in all?', type: 'num', answer: g * n, hint: 'This is ' + g + ' groups of ' + n + '. Add ' + n + ' again and again.', steps: [g + ' groups of ' + n + '.', rep(g, n) + ' = ' + g * n + '.'], explain: rep(g, n) + ' = ' + g * n + ' flowers.' };
        if (kind === 1) return { q: g * n + ' children make teams of ' + n + '. How many teams?', type: 'num', answer: g, hint: 'Take away ' + n + ' at a time. Count the teams.', steps: ['Each team takes ' + n + ' children.', 'Count by ' + n + 's to ' + g * n + ': ' + skip(g, n) + '.', 'That is ' + g + ' teams.'], explain: g + ' teams of ' + n + ' make ' + g * n + '.' };
        return { q: g * n + ' stickers are shared equally by ' + g + ' friends. How many each?', type: 'num', answer: n, hint: 'Deal one to each of the ' + g + ' friends, again and again.', steps: ['Each round gives out ' + g + ' stickers.', 'After ' + n + ' rounds, all ' + g * n + ' are given out.', 'Each friend gets ' + n + '.'], explain: rep(g, n) + ' = ' + g * n + ', so ' + n + ' each.' };
      } }
    ]
  });
})();
