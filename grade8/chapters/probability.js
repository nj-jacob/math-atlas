(function () {
  var A = Atlas, R = A.R, G = A.gcd;
  function simp(n, d) { var g = G(n, d) || 1; return [n / g, d / g]; }
  function TX(n, d) { var s = simp(n, d); return s[1] === 1 ? String(s[0]) : s[0] + '/' + s[1]; }
  function FR(n, d) { var s = simp(n, d); return s[1] === 1 ? String(s[0]) : A.fr(s[0], s[1]); }
  function raw(n, d) { return A.fr(n, d); }

  /* tree diagram. levels: [[{t, p:[n,d]}...], [{t, p}...]] or second level as function(first index) -> list */
  function tree(first, second, label, hl) {
    var s = '', n1 = first.length, rows = [], x0 = 10, x1 = 120, x2 = 230, xo = 268;
    first.forEach(function (a, i) { (typeof second === 'function' ? second(i) : second).forEach(function (b, j) { rows.push({ i: i, j: j, a: a, b: b }); }); });
    var rh = Math.max(30, Math.min(40, 360 / rows.length)), H = rows.length * rh + 30, top = 26;
    s += '<text x="' + x1 + '" y="16" text-anchor="middle" font-size="14" class="t2">first</text><text x="' + x2 + '" y="16" text-anchor="middle" font-size="14" class="t2">second</text><text x="' + (xo + 60) + '" y="16" text-anchor="middle" font-size="14" class="t2">outcome, probability</text>';
    var midY = top + rows.length * rh / 2;
    first.forEach(function (a, i) {
      var mine = rows.filter(function (r) { return r.i === i; }), y1 = top + (rows.indexOf(mine[0]) + mine.length / 2) * rh;
      s += '<line x1="' + x0 + '" y1="' + midY + '" x2="' + (x1 - 26) + '" y2="' + y1 + '" style="stroke:var(--ink2)" stroke-width="1.5"/>' +
        '<text x="' + ((x0 + x1 - 26) / 2) + '" y="' + ((midY + y1) / 2 - 6) + '" text-anchor="middle" font-size="14" class="tb" style="fill:var(--strand)">' + a.p[0] + '/' + a.p[1] + '</text>' +
        '<text x="' + x1 + '" y="' + (y1 + 6) + '" text-anchor="middle" font-size="16" class="tb">' + a.t + '</text>';
      mine.forEach(function (r) {
        var y2 = top + (rows.indexOf(r) + 0.5) * rh;
        s += '<line x1="' + (x1 + 26) + '" y1="' + y1 + '" x2="' + (x2 - 22) + '" y2="' + y2 + '" style="stroke:var(--ink2)" stroke-width="1.5"/>' +
          '<text x="' + ((x1 + x2) / 2 + 2) + '" y="' + ((y1 + y2) / 2 - 4) + '" text-anchor="middle" font-size="13" class="tb" style="fill:var(--accent)">' + r.b.p[0] + '/' + r.b.p[1] + '</text>' +
          '<text x="' + x2 + '" y="' + (y2 + 6) + '" text-anchor="middle" font-size="16" class="tb">' + r.b.t + '</text>';
        var on = hl && hl(r);
        if (on) s += '<rect x="' + (xo - 4) + '" y="' + (y2 - rh / 2 + 3) + '" width="132" height="' + (rh - 6) + '" rx="3" style="fill:color-mix(in srgb,var(--hi) 40%,var(--card))"/>';
        s += '<text x="' + xo + '" y="' + (y2 + 6) + '" font-size="15"' + (on ? ' class="tb"' : '') + '>' + r.a.t + r.b.t + ': ' + TX(r.a.p[0] * r.b.p[0], r.a.p[1] * r.b.p[1]) + '</text>';
      });
    });
    return A.svg(400, H, s, label || 'Tree diagram with ' + rows.length + ' outcomes.');
  }
  /* bag of marbles */
  function bag(r, b, taken) {
    var s = '<path d="M30 40 q-20 90 30 110 h120 q50 -20 30 -110 z" style="fill:color-mix(in srgb,var(--ink2) 10%,var(--card));stroke:var(--ink2)" stroke-width="2"/><path d="M40 40 q80 -22 160 0" fill="none" style="stroke:var(--ink2)" stroke-width="2"/>', all = [];
    for (var i = 0; i < r; i++) all.push(1); for (var j = 0; j < b; j++) all.push(0);
    all.forEach(function (red, k) {
      var x = 62 + (k % 5) * 28, y = 70 + Math.floor(k / 5) * 28, gone = taken && k === 0;
      s += '<circle cx="' + x + '" cy="' + y + '" r="11" style="fill:' + (red ? 'var(--bad)' : 'var(--sb)') + ';opacity:' + (gone ? 0.2 : 1) + '"/>';
    });
    s += '<text x="240" y="70" font-size="17">' + r + ' red</text><text x="240" y="96" font-size="17">' + b + ' blue</text><text x="240" y="122" font-size="17" class="t2">' + (r + b) + ' in total</text>';
    return A.svg(340, 160, s, 'A bag with ' + r + ' red and ' + b + ' blue marbles, ' + (r + b) + ' in total.');
  }
  /* Venn diagram: a only, both, b only, neither */
  function venn(la, lb, a, both, b, neither, hlMode) {
    var s = '<rect x="4" y="4" width="392" height="200" rx="6" style="fill:var(--card);stroke:var(--ink2)" stroke-width="1.5"/>';
    var fa = hlMode === 'or' || hlMode === 'a' ? 'color-mix(in srgb,var(--strand) 30%,transparent)' : 'transparent', fb = hlMode === 'or' || hlMode === 'b' ? 'color-mix(in srgb,var(--accent) 30%,transparent)' : 'transparent';
    s += '<circle cx="150" cy="108" r="80" style="fill:' + fa + ';stroke:var(--strand)" stroke-width="2.5"/><circle cx="250" cy="108" r="80" style="fill:' + fb + ';stroke:var(--accent)" stroke-width="2.5"/>';
    if (hlMode === 'and') s += '<path d="M200 41 a80 80 0 0 1 0 134 a80 80 0 0 1 0 -134z" style="fill:color-mix(in srgb,var(--hi) 55%,transparent)"/>';
    s += '<text x="110" y="24" text-anchor="middle" font-size="16" class="tb" style="fill:var(--strand)">' + la + '</text><text x="290" y="24" text-anchor="middle" font-size="16" class="tb" style="fill:var(--accent)">' + lb + '</text>';
    s += '<text x="115" y="116" text-anchor="middle" font-size="24" class="tb">' + a + '</text><text x="200" y="116" text-anchor="middle" font-size="24" class="tb">' + both + '</text><text x="285" y="116" text-anchor="middle" font-size="24" class="tb">' + b + '</text>';
    s += '<text x="372" y="190" text-anchor="end" font-size="16">neither: <tspan class="tb">' + neither + '</tspan></text>';
    return A.svg(400, 208, s, 'Venn diagram. ' + la + ' only: ' + a + '. Both: ' + both + '. ' + lb + ' only: ' + b + '. Neither: ' + neither + '.');
  }
  /* bars comparing experimental and theoretical probability */
  function compareBars(exp, theo, n) {
    var s = '', W = 250, x0 = 124;
    s += '<text x="' + (x0 - 8) + '" y="34" text-anchor="end" font-size="16">theory</text><rect x="' + x0 + '" y="16" width="' + W * theo + '" height="26" style="fill:var(--strand)"/><text x="' + (x0 + W * theo + 6) + '" y="35" font-size="16" class="tb">' + (theo * 100).toFixed(1) + '%</text>';
    s += '<text x="' + (x0 - 8) + '" y="80" text-anchor="end" font-size="16">' + n + ' trials</text><rect x="' + x0 + '" y="62" width="' + W * exp + '" height="26" style="fill:var(--accent)"/><text x="' + (x0 + W * exp + 6) + '" y="81" font-size="16" class="tb">' + (exp * 100).toFixed(1) + '%</text>';
    s += '<line x1="' + x0 + '" y1="8" x2="' + x0 + '" y2="96" style="stroke:var(--ink)" stroke-width="1.5"/>';
    return A.svg(400, 100, s, 'Theoretical probability ' + (theo * 100).toFixed(1) + ' percent. Experimental probability after ' + n + ' trials ' + (exp * 100).toFixed(1) + ' percent.');
  }
  var COIN = [{ t: 'H', p: [1, 2] }, { t: 'T', p: [1, 2] }];

  var html =
'<section class="sec"><h2><span class="n">1</span>Theoretical and experimental probability</h2>' +
'<p>The <b>theoretical probability</b> of an event is what should happen in the long run, when all outcomes are equally likely:</p>' +
'<p style="text-align:center">P(event) = ' + raw('favourable', 'all outcomes') + '</p>' +
'<p>The <b>experimental probability</b> is what actually happened in trials: the number of times it happened divided by the number of trials. With more trials, it usually gets closer to the theoretical probability.</p>' +
'<div class="fig">' + bag(3, 5) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>You roll a standard die. What is P(a number greater than 4)?</p><ol><li>All outcomes: 1, 2, 3, 4, 5, 6. That is 6.</li><li>Favourable: 5 and 6. That is 2.</li><li>P = ' + raw(2, 6) + ' = ' + raw(1, 3) + '.</li></ol></div>' +
A.yt({ q: 'A bag has 3 red and 5 blue marbles (above). What is P(red)? Type a fraction.', a: 3 / 8, show: '3/8', back: 'Go back to steps 1 and 2: count all the marbles, then count the red ones.', ok: '3 red out of 8 marbles: P(red) = ' + raw(3, 8) + '.' }) +
'<div class="key"><b class="t">Key idea</b><p>Probability is always from 0 (impossible) to 1 (certain). The probabilities of all outcomes add to 1. So P(not red) = 1 &minus; ' + raw(3, 8) + ' = ' + raw(5, 8) + '.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Independent events and tree diagrams</h2>' +
'<p>Two events are <b>independent</b> if one does not change the chances of the other. Flipping a coin does not affect a die roll. A <b>tree diagram</b> shows every outcome. To find the probability of a path, <b>multiply</b> along its branches.</p>' +
'<div class="fig">' + tree(COIN, COIN, 'Tree diagram for two coin flips. Each branch has probability one half. The four outcomes HH, HT, TH and TT each have probability one quarter.', function (r) { return r.a.t === 'H' && r.b.t === 'H'; }) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>You flip a coin and roll a die. What is P(heads and a 6)?</p><ol><li>P(heads) = ' + raw(1, 2) + '. P(6) = ' + raw(1, 6) + '.</li><li>The events are independent, so multiply: ' + raw(1, 2) + ' &times; ' + raw(1, 6) + '.</li><li>P(heads and 6) = ' + raw(1, 12) + '. There are 12 equally likely outcomes, and only one is H6.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: build a tree</span>' +
'<div class="ctrl"><label for="tra">First spinner: equal parts<select id="tra"><option>2</option><option selected>3</option><option>4</option></select></label><label for="trb">Second spinner: equal parts<select id="trb"><option selected>2</option><option>3</option><option>4</option></select></label></div>' +
'<div class="fig" id="trfig"></div><div class="out" id="trout"></div></div>' +
A.yt({ q: 'You flip a coin twice. What is P(two heads)? Type a fraction.', a: 0.25, show: '1/4', back: 'Look at the highlighted path in the tree: multiply the probability on each branch.', ok: raw(1, 2) + ' &times; ' + raw(1, 2) + ' = ' + raw(1, 4) + '.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Do not add along a path. "Heads <b>and</b> 6" must be less likely than heads alone, so you multiply. You <b>add</b> the probabilities of separate paths when an event can happen in more than one way.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Dependent events</h2>' +
'<p>Events are <b>dependent</b> when the first one changes the chances of the second. Drawing a marble and <b>not putting it back</b> leaves fewer marbles in the bag.</p>' +
'<div class="lab"><span class="lt">Try it: with or without putting it back</span>' +
'<div class="ctrl"><label for="bgr">Red: <output id="bgro"></output><input type="range" id="bgr" min="1" max="6" value="3"></label><label for="bgb">Blue: <output id="bgbo"></output><input type="range" id="bgb" min="1" max="6" value="2"></label>' +
'<label for="bgp">After the first draw<select id="bgp"><option value="0">do not put it back</option><option value="1">put it back</option></select></label></div>' +
'<div class="fig" id="bgfig"></div><div class="out" id="bgout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A bag has 3 red and 2 blue marbles. You draw two without putting the first back. What is P(red, red)?</p><ol><li>First draw: P(red) = ' + raw(3, 5) + '.</li><li>Now 2 red are left out of 4 marbles. Second draw: P(red) = ' + raw(2, 4) + '.</li><li>Multiply: ' + raw(3, 5) + ' &times; ' + raw(2, 4) + ' = ' + raw(6, 20) + ' = ' + raw(3, 10) + '.</li></ol></div>' +
A.yt({ q: 'Same bag (3 red, 2 blue), no putting back. What is P(blue, blue)? Type a fraction.', a: 0.1, show: '1/10', back: 'Go back to step 2: after one blue is taken out, how many blue are left, and how many marbles in total?', ok: raw(2, 5) + ' &times; ' + raw(1, 4) + ' = ' + raw(2, 20) + ' = ' + raw(1, 10) + '.' }) +
'<div class="key"><b class="t">Key idea</b><p>With replacement, P(red, red) = ' + raw(3, 5) + ' &times; ' + raw(3, 5) + ' = ' + raw(9, 25) + '. Without replacement it is ' + raw(3, 10) + ', a bit less, because one red is gone for the second draw.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Venn diagrams</h2>' +
'<p>A <b>Venn diagram</b> sorts a group into overlapping circles. The overlap is people or things that belong to both. Use it to find P(A or B) without counting anyone twice.</p>' +
'<div class="fig">' + venn('Hockey', 'Soccer', 13, 5, 7, 5, 'or') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>In a class of 30, 18 play hockey, 12 play soccer and 5 play both. What is the probability a random student plays hockey or soccer?</p><ol><li>Hockey only: 18 &minus; 5 = 13. Soccer only: 12 &minus; 5 = 7. Both: 5.</li><li>Hockey or soccer: 13 + 5 + 7 = 25. (Not 18 + 12 = 30, which counts the 5 twice.)</li><li>P = ' + raw(25, 30) + ' = ' + raw(5, 6) + '.</li></ol></div>' +
A.yt({ q: 'Same class. What is the probability a student plays neither sport? Type a fraction.', a: 1 / 6, show: '1/6', back: 'Find how many are outside both circles: the class total minus the students inside the circles from step 2.', ok: '30 &minus; 25 = 5 play neither. P = ' + raw(5, 30) + ' = ' + raw(1, 6) + '.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the two circle totals counts the overlap twice. P(A or B) = P(A) + P(B) &minus; P(A and B).</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Testing theory with an experiment</h2>' +
'<p>You can check a theoretical probability by running many trials. The computer can do thousands in a blink.</p>' +
'<div class="lab"><span class="lt">Try it: run trials</span>' +
'<div class="ctrl"><label for="sie">Event<select id="sie"><option value="hh">two coins: both heads</option><option value="s7">two dice: sum of 7</option><option value="rr">bag of 3 red, 2 blue: two reds, no putting back</option></select></label>' +
'<label for="sin">Trials<select id="sin"><option>10</option><option selected>100</option><option>1000</option><option>10000</option></select></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="sigo">Run trials</button></div><div class="fig" id="sifig"></div><div class="out" id="siout" aria-live="polite"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>You roll two dice 200 times and get a sum of 7 on 38 rolls. Compare with theory.</p><ol><li>Experimental: ' + raw(38, 200) + ' = 0.19.</li><li>Theory: 6 of the 36 outcomes sum to 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1), so ' + raw(6, 36) + ' &asymp; 0.167.</li><li>They are close. With more rolls, the experimental value would likely get closer.</li></ol></div>' +
A.yt({ q: 'If you flip two coins 400 times, about how many times would you expect two heads?', a: 100, back: 'Expected count = theoretical probability &times; number of trials. P(two heads) = ' + raw(1, 4) + '.', ok: raw(1, 4) + ' &times; 400 = 100.' }) +
'</section>';

  var practice = [
    { id: 'pb-single', name: 'Probability of one event', code: 'D2.1', gen: function (lv) {
      if (lv === 1) { var r = R.int(1, 7), b = R.int(1, 7), g = R.int(0, 4), t = r + b + g, c = R.pick(['red', 'blue']);
        var n = c === 'red' ? r : b;
        return { q: 'A bag has ' + r + ' red, ' + b + ' blue' + (g ? ' and ' + g + ' green' : '') + ' marbles. What is P(' + c + ')? Type a fraction.', type: 'num', answer: n / t, show: TX(n, t), fig: g ? '' : bag(r, b),
          hint: 'Count all the marbles, then count the ' + c + ' ones.', steps: ['Total: ' + r + ' + ' + b + (g ? ' + ' + g : '') + ' = ' + t + '.', c.charAt(0).toUpperCase() + c.slice(1) + ': ' + n + '.', 'P(' + c + ') = ' + n + '/' + t + (G(n, t) > 1 ? ' = ' + TX(n, t) : '') + '.'], explain: 'P(' + c + ') = ' + TX(n, t) + '.' }; }
      var ev = R.pick([['an even number', 3], ['a number greater than 2', 4], ['a multiple of 3', 2], ['a prime number', 3], ['a number less than 5', 4]]);
      if (lv === 2) return { q: 'You roll a standard die. What is P(' + ev[0] + ')? Type a fraction.', type: 'num', answer: ev[1] / 6, show: TX(ev[1], 6),
        hint: 'List the outcomes 1 to 6 and count the ones that fit.', steps: ['Outcomes: 1, 2, 3, 4, 5, 6.', 'Favourable: ' + ev[1] + '.', 'P = ' + ev[1] + '/6 = ' + TX(ev[1], 6) + '.'], explain: 'P = ' + TX(ev[1], 6) + '.' };
      return { q: 'You roll a standard die. What is P(<b>not</b> ' + ev[0] + ')? Type a fraction.', type: 'num', answer: 1 - ev[1] / 6, show: TX(6 - ev[1], 6),
        hint: 'P(not A) = 1 &minus; P(A).', steps: ['P(' + ev[0] + ') = ' + ev[1] + '/6.', 'P(not) = 1 &minus; ' + ev[1] + '/6 = ' + (6 - ev[1]) + '/6.', '= ' + TX(6 - ev[1], 6) + '.'], explain: 'P(not ' + ev[0] + ') = ' + TX(6 - ev[1], 6) + '.' };
    } },
    { id: 'pb-indep', name: 'Independent events', code: 'D2.2', gen: function (lv) {
      var a = R.pick([2, 3, 4, 5]), b = R.pick([2, 3, 4, 6]), ka = R.int(1, a - 1), kb = R.int(1, b - 1);
      if (lv === 1) { ka = 1; kb = 1; }
      var n = ka * kb, d = a * b;
      var ctx = 'Spinner A has ' + a + ' equal parts and ' + ka + ' of them ' + (ka === 1 ? 'is' : 'are') + ' green. Spinner B has ' + b + ' equal parts and ' + kb + ' of them ' + (kb === 1 ? 'is' : 'are') + ' green.';
      if (lv === 3 && R.int(0, 1)) {
        /* exactly one green: two paths */
        var n2 = ka * (b - kb) + (a - ka) * kb;
        return { q: ctx + ' You spin both. What is P(exactly one green)? Type a fraction.', type: 'num', answer: n2 / d, show: TX(n2, d),
          hint: 'Two paths: green then not green, or not green then green. Multiply along each path, then add the paths.', steps: ['Path 1: ' + ka + '/' + a + ' &times; ' + (b - kb) + '/' + b + ' = ' + ka * (b - kb) + '/' + d + '.', 'Path 2: ' + (a - ka) + '/' + a + ' &times; ' + kb + '/' + b + ' = ' + (a - ka) * kb + '/' + d + '.', 'Add: ' + n2 + '/' + d + ' = ' + TX(n2, d) + '.'], explain: 'P(exactly one green) = ' + TX(n2, d) + '.' };
      }
      return { q: ctx + ' You spin both. What is P(both green)? Type a fraction.', type: 'num', answer: n / d, show: TX(n, d),
        fig: lv === 1 ? tree([{ t: 'G', p: [ka, a] }, { t: 'N', p: [a - ka, a] }], [{ t: 'G', p: [kb, b] }, { t: 'N', p: [b - kb, b] }], 'Tree diagram for the two spinners. G is green, N is not green.') : '',
        hint: 'The spinners are independent. Multiply the two probabilities.', steps: ['P(A green) = ' + ka + '/' + a + '. P(B green) = ' + kb + '/' + b + '.', 'Multiply: ' + ka + '/' + a + ' &times; ' + kb + '/' + b + ' = ' + n + '/' + d + '.', 'Simplify: ' + TX(n, d) + '.'], explain: 'P(both green) = ' + TX(n, d) + '.' };
    } },
    { id: 'pb-dep', name: 'Dependent events', code: 'D2.2', gen: function (lv) {
      var r = R.int(2, 6), b = R.int(2, 6), t = r + b, c = R.pick(['red', 'blue']), k = c === 'red' ? r : b, rep = lv === 1 && R.int(0, 1);
      if (lv === 3) {
        var n3 = r * b * 2, d3 = t * (t - 1);
        return { q: 'A bag has ' + r + ' red and ' + b + ' blue marbles. You draw two without putting the first back. What is P(one of each colour)? Type a fraction.', type: 'num', answer: n3 / d3, show: TX(n3, d3),
          hint: 'Two paths: red then blue, or blue then red. The second draw has one fewer marble.', steps: ['Red then blue: ' + r + '/' + t + ' &times; ' + b + '/' + (t - 1) + ' = ' + r * b + '/' + d3 + '.', 'Blue then red: ' + b + '/' + t + ' &times; ' + r + '/' + (t - 1) + ' = ' + r * b + '/' + d3 + '.', 'Add: ' + n3 + '/' + d3 + ' = ' + TX(n3, d3) + '.'], explain: 'P(one of each) = ' + TX(n3, d3) + '.' };
      }
      var n = rep ? k * k : k * (k - 1), d = rep ? t * t : t * (t - 1);
      return { q: 'A bag has ' + r + ' red and ' + b + ' blue marbles. You draw one, ' + (rep ? '<b>put it back</b>' : '<b>do not put it back</b>') + ', and draw again. What is P(' + c + ', ' + c + ')? Type a fraction.', type: 'num', answer: n / d, show: TX(n, d), fig: lv === 1 ? bag(r, b) : '',
        hint: rep ? 'The bag is the same for both draws.' : 'After the first ' + c + ' is taken out, there is one fewer ' + c + ' and one fewer marble.',
        steps: ['First: P(' + c + ') = ' + k + '/' + t + '.', 'Second: ' + (rep ? 'still ' + k + '/' + t : (k - 1) + '/' + (t - 1)) + '.', 'Multiply: ' + n + '/' + d + ' = ' + TX(n, d) + '.'], explain: 'P(' + c + ', ' + c + ') = ' + TX(n, d) + '.' };
    } },
    { id: 'pb-venn', name: 'Venn diagrams', code: 'D2.1', gen: function (lv) {
      var both = R.int(2, 8), ao = R.int(3, 12), bo = R.int(3, 12), ne = R.int(1, 8), tot = ao + both + bo + ne;
      var names = R.pick([['Band', 'Choir'], ['Cats', 'Dogs'], ['Math club', 'Chess club'], ['Swims', 'Skates']]);
      var ask = lv === 1 ? 'both' : lv === 2 ? R.pick(['or', 'neither']) : 'only';
      var n = ask === 'both' ? both : ask === 'or' ? ao + both + bo : ask === 'neither' ? ne : ao;
      var words = { both: 'is in both groups', or: 'is in ' + names[0] + ' or ' + names[1] + ' (or both)', neither: 'is in neither group', only: 'is in ' + names[0] + ' only' }[ask];
      if (lv === 3) return { q: 'In a group of ' + tot + ', ' + (ao + both) + ' are in ' + names[0] + ', ' + (bo + both) + ' are in ' + names[1] + ', and ' + both + ' are in both. What is the probability a random person ' + words + '? Type a fraction.', type: 'num', answer: n / tot, show: TX(n, tot),
        hint: 'Draw the Venn diagram. The ' + names[0] + ' only part is the ' + names[0] + ' total minus the overlap.', steps: [names[0] + ' only: ' + (ao + both) + ' &minus; ' + both + ' = ' + ao + '.', 'P = ' + ao + '/' + tot + '.', 'Simplify: ' + TX(ao, tot) + '.'], explain: 'P = ' + TX(ao, tot) + '.' };
      return { q: 'The Venn diagram shows ' + tot + ' students. What is the probability a random student ' + words + '? Type a fraction.', type: 'num', answer: n / tot, show: TX(n, tot), fig: venn(names[0], names[1], ao, both, bo, ne, ask === 'both' ? 'and' : ask === 'or' ? 'or' : ''),
        hint: ask === 'or' ? 'Add the three parts inside the circles. Count the overlap once.' : ask === 'neither' ? 'Look outside both circles.' : 'Look at the overlap in the middle.',
        steps: ['Favourable: ' + (ask === 'or' ? ao + ' + ' + both + ' + ' + bo + ' = ' + n : n) + '.', 'Total: ' + tot + '.', 'P = ' + n + '/' + tot + ' = ' + TX(n, tot) + '.'], explain: 'P = ' + TX(n, tot) + '.' };
    } },
    { id: 'pb-exp', name: 'Experiments and predictions', code: 'D2.2', gen: function (lv) {
      if (lv === 1) { var tr = R.pick([50, 80, 100, 200]), hits = R.int(5, tr / 2);
        return { q: 'A spinner landed on blue ' + hits + ' times in ' + tr + ' spins. What is the experimental probability of blue? Type a fraction or decimal.', type: 'num', answer: hits / tr, show: TX(hits, tr),
          hint: 'Experimental probability = times it happened &divide; number of trials.', steps: ['Times blue: ' + hits + '.', 'Trials: ' + tr + '.', 'P = ' + hits + '/' + tr + ' = ' + TX(hits, tr) + '.'], explain: 'Experimental P(blue) = ' + TX(hits, tr) + ' = ' + (hits / tr) + '.' }; }
      var ev = R.pick([['flip two coins and get two heads', 1, 4], ['roll a die and get a 6', 1, 6], ['roll two dice and get a sum of 7', 1, 6], ['flip three coins and get three tails', 1, 8], ['spin a 5-part spinner and get red', 1, 5]]);
      var trials = ev[2] * R.pick([20, 25, 40, 50, 60, 100]), exp = trials * ev[1] / ev[2];
      return { q: 'You ' + ev[0] + '. If you do this ' + A.fmt(trials) + ' times, about how many times would you expect it to happen?', type: 'num', answer: exp,
        hint: 'Expected count = probability &times; number of trials.', steps: ['P = ' + ev[1] + '/' + ev[2] + '.', 'Expected: ' + ev[1] + '/' + ev[2] + ' &times; ' + A.fmt(trials) + '.', '= ' + A.fmt(exp) + '.'], explain: 'Expected about ' + A.fmt(exp) + ' times.' };
    } }
  ];

  var quiz = [
    { q: 'A bag has 4 red, 6 blue and 2 green marbles. What is P(blue)? Type a fraction.', type: 'num', answer: 0.5, show: '1/2', hint: 'There are 12 marbles. How many are blue?', explain: '6 of 12 are blue: ' + raw(6, 12) + ' = ' + raw(1, 2) + '.' },
    { q: 'You roll a die and flip a coin. What is P(an even number and tails)? Type a fraction.', type: 'num', answer: 0.25, show: '1/4', hint: 'They are independent. Multiply P(even) by P(tails).', explain: raw(3, 6) + ' &times; ' + raw(1, 2) + ' = ' + raw(3, 12) + ' = ' + raw(1, 4) + '.' },
    { q: 'A bag has 5 red and 3 blue marbles. Two are drawn without putting the first back. What is P(red, red)? Type a fraction.', type: 'num', answer: 20 / 56, show: '5/14', hint: 'After one red is taken, there are 4 red out of 7.', explain: raw(5, 8) + ' &times; ' + raw(4, 7) + ' = ' + raw(20, 56) + ' = ' + raw(5, 14) + '.' },
    { q: 'Which pair of events is <b>dependent</b>?', type: 'mc', options: ['Drawing two cards from a deck without putting the first back', 'Flipping a coin twice', 'Rolling a die and spinning a spinner', 'Drawing a marble, putting it back, and drawing again'], answer: 0, hint: 'Which one changes what is left for the second event?', explain: 'Without replacement, the first card changes what is left, so the second draw depends on the first.' },
    { q: 'Of 40 students, 22 have a sister, 15 have a brother, and 6 have both. How many have a sister or a brother?', type: 'num', answer: 31, hint: 'Add the two groups, then take away the overlap so it is not counted twice.', explain: '22 + 15 &minus; 6 = 31.' },
    { q: 'You flip three coins. What is P(three heads)? Type a fraction.', type: 'num', answer: 0.125, show: '1/8', hint: 'Multiply ' + raw(1, 2) + ' three times.', explain: raw(1, 2) + ' &times; ' + raw(1, 2) + ' &times; ' + raw(1, 2) + ' = ' + raw(1, 8) + '.' },
    { q: 'In 60 rolls of a die, a 3 came up 14 times. Which statement is true?', type: 'mc', options: ['The experimental probability is 14/60, a bit more than the theoretical 1/6', 'The die must be unfair', 'The theoretical probability is 14/60', 'The experimental probability is 1/6'], answer: 0, hint: 'Experimental: times it happened &divide; trials. Theoretical for a fair die: 1/6 = 10/60.', explain: '14/60 &asymp; 0.233, and 1/6 &asymp; 0.167. Small differences are normal in 60 rolls, so this alone does not prove the die is unfair.' }
  ];

  A.register('probability', {
    fx: { simp: simp, TX: TX, FR: FR, raw: raw, tree: tree, bag: bag, venn: venn, compareBars: compareBars },
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); }, L = 'ABCD';
      A.bind(root, ['tra', 'trb'], function () {
        var a = +$('#tra').value, b = +$('#trb').value;
        var f = [], s2 = [];
        for (var i = 0; i < a; i++) f.push({ t: L.charAt(i), p: [1, a] });
        for (var j = 0; j < b; j++) s2.push({ t: String(j + 1), p: [1, b] });
        $('#trfig').innerHTML = tree(f, s2, 'Tree for a ' + a + '-part spinner then a ' + b + '-part spinner. There are ' + a * b + ' outcomes, each with probability 1/' + a * b + '.', function (r) { return r.i === 0 && r.j === 0; });
        $('#trout').innerHTML = '<span class="big">' + a + ' &times; ' + b + ' = ' + a * b + ' outcomes</span><br>Each path: ' + raw(1, a) + ' &times; ' + raw(1, b) + ' = ' + raw(1, a * b) + '. The highlighted path is A1.';
      });
      A.bind(root, ['bgr', 'bgb', 'bgp'], function () {
        var r = +$('#bgr').value, b = +$('#bgb').value, rep = $('#bgp').value === '1', t = r + b;
        $('#bgro').textContent = r; $('#bgbo').textContent = b;
        var first = [{ t: 'R', p: [r, t] }, { t: 'B', p: [b, t] }];
        $('#bgfig').innerHTML = bag(r, b) + tree(first, function (i) {
          if (rep) return [{ t: 'R', p: [r, t] }, { t: 'B', p: [b, t] }];
          return i === 0 ? [{ t: 'R', p: [r - 1, t - 1] }, { t: 'B', p: [b, t - 1] }] : [{ t: 'R', p: [r, t - 1] }, { t: 'B', p: [b - 1, t - 1] }];
        }, 'Tree diagram for two draws ' + (rep ? 'with' : 'without') + ' putting the first marble back.', function (x) { return x.i === 0 && x.j === 0; });
        var n = rep ? r * r : r * (r - 1), d = rep ? t * t : t * (t - 1);
        $('#bgout').innerHTML = '<span class="big">P(red, red) = ' + raw(r, t) + ' &times; ' + (rep ? raw(r, t) : raw(r - 1, t - 1)) + ' = ' + FR(n, d) + '</span><br>' + (rep ? 'Putting it back: the second draw is the same as the first. Independent.' : 'Not putting it back: the second draw has ' + (t - 1) + ' marbles. Dependent.');
      });
      function trial(e) {
        if (e === 'hh') return Math.random() < 0.5 && Math.random() < 0.5;
        if (e === 's7') return (1 + Math.floor(Math.random() * 6)) + (1 + Math.floor(Math.random() * 6)) === 7;
        var bagL = [1, 1, 1, 0, 0], i = Math.floor(Math.random() * 5), first = bagL.splice(i, 1)[0];
        return first === 1 && bagL[Math.floor(Math.random() * 4)] === 1;
      }
      var TH = { hh: [1, 4, raw(1, 2) + ' &times; ' + raw(1, 2)], s7: [6, 36, '6 of 36 outcomes'], rr: [3, 10, raw(3, 5) + ' &times; ' + raw(2, 4)] };
      function run() {
        var e = $('#sie').value, n = +$('#sin').value, hits = 0;
        for (var k = 0; k < n; k++) if (trial(e)) hits++;
        var th = TH[e][0] / TH[e][1];
        $('#sifig').innerHTML = compareBars(hits / n, th, A.fmt(n));
        $('#siout').innerHTML = 'It happened <b>' + A.fmt(hits) + '</b> times in ' + A.fmt(n) + ' trials: experimental probability ' + (hits / n).toFixed(3) + '.<br>Theory: ' + TH[e][2] + ' = ' + FR(TH[e][0], TH[e][1]) + ' &asymp; ' + th.toFixed(3) + '. Run more trials and they usually get closer.';
      }
      $('#sigo').addEventListener('click', run);
      $('#sie').addEventListener('change', run);
      run();
    }
  });
})();
