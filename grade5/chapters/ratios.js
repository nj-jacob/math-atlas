(function () {
  var A = Atlas, R = A.R;
  /* rows of coloured counters: a of colour 1, b of colour 2 */
  function counters(a, b, per) {
    per = per || 12;
    var s = '', n = a + b, rows = Math.ceil(n / per);
    for (var i = 0; i < n; i++) {
      var x = 18 + (i % per) * 30, y = 18 + Math.floor(i / per) * 30;
      s += i < a ? '<circle cx="' + x + '" cy="' + y + '" r="11" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>' :
        '<rect x="' + (x - 11) + '" y="' + (y - 11) + '" width="22" height="22" rx="3" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/>';
    }
    return A.svg(Math.min(n, per) * 30 + 8, rows * 30 + 8, s, a + ' circles and ' + b + ' squares');
  }
  /* double number line: top values a*k, bottom b*k */
  function dline(a, b, k, ua, ub, hi) {
    var W = 460, x0 = 76, x1 = 440, s = '';
    s += '<line x1="' + x0 + '" y1="30" x2="' + x1 + '" y2="30" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x0 + '" y1="80" x2="' + x1 + '" y2="80" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var i = 0; i <= k; i++) {
      var x = x0 + (x1 - x0) * i / k, on = i === hi;
      s += '<line x1="' + x + '" y1="22" x2="' + x + '" y2="38" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x + '" y1="72" x2="' + x + '" y2="88" style="stroke:var(--ink)" stroke-width="2"/>' +
        '<text x="' + x + '" y="16" text-anchor="middle" font-size="16" class="' + (on ? 'tb' : '') + '">' + A.fmt(a * i) + '</text>' +
        '<text x="' + x + '" y="108" text-anchor="middle" font-size="16" class="' + (on ? 'tb' : '') + '">' + A.fmt(b * i) + '</text>';
      if (on) s += '<rect x="' + (x - 22) + '" y="2" width="44" height="110" rx="8" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/>';
    }
    s += '<text x="4" y="35" font-size="15" class="tb">' + ua + '</text><text x="4" y="85" font-size="15" class="tb">' + ub + '</text>';
    return A.svg(W, 114, s, 'Double number line: ' + a + ' ' + ua + ' for every ' + b + ' ' + ub);
  }

  /* ratio table as a picture: two rows, columns of values, and "x k" arrows above and below that show the step */
  function rtab(top, bot, cols, steps, label) {
    var lw = Math.max(100, Math.max(top.length, bot.length) * 8.4 + 26), cw = 84, W = lw + cols.length * cw + 8, s = '', y1 = 66, y2 = 106;
    s += '<defs><marker id="rtA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>';
    s += '<rect x="4" y="' + (y1 - 20) + '" width="' + (W - 8) + '" height="80" rx="8" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>' +
      '<line x1="4" y1="' + (y1 + 20) + '" x2="' + (W - 4) + '" y2="' + (y1 + 20) + '" style="stroke:var(--line)" stroke-width="1.5"/>' +
      '<line x1="' + lw + '" y1="' + (y1 - 20) + '" x2="' + lw + '" y2="' + (y2 + 20) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    s += '<text x="14" y="' + (y1 + 6) + '" font-size="15" font-weight="700" style="fill:var(--strand)">' + top + '</text><text x="14" y="' + (y2 + 6) + '" font-size="15" font-weight="700" style="fill:#b07f00">' + bot + '</text>';
    cols.forEach(function (c, i) {
      var x = lw + cw * (i + 0.5);
      s += '<text x="' + x + '" y="' + (y1 + 7) + '" text-anchor="middle" font-size="20" font-weight="800">' + c[0] + '</text><text x="' + x + '" y="' + (y2 + 7) + '" text-anchor="middle" font-size="20" font-weight="800">' + c[1] + '</text>';
    });
    (steps || []).forEach(function (st) {
      var xa = lw + cw * (st[0] + 0.5), xb = lw + cw * (st[1] + 0.5), m = (xa + xb) / 2;
      s += '<path d="M' + (xa + 10) + ' ' + (y1 - 24) + ' Q' + m + ' ' + (y1 - 46) + ' ' + (xb - 10) + ' ' + (y1 - 24) + '" fill="none" style="stroke:var(--accent)" stroke-width="2" marker-end="url(#rtA)"/>' +
        '<text x="' + m + '" y="' + (y1 - 50) + '" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--accent)">' + st[2] + '</text>' +
        '<path d="M' + (xa + 10) + ' ' + (y2 + 24) + ' Q' + m + ' ' + (y2 + 46) + ' ' + (xb - 10) + ' ' + (y2 + 24) + '" fill="none" style="stroke:var(--accent)" stroke-width="2" marker-end="url(#rtA)"/>' +
        '<text x="' + m + '" y="' + (y2 + 52) + '" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--accent)">' + st[2] + '</text>';
    });
    return A.svg(W, y2 + 60, s, label || 'Ratio table');
  }
  /* tape diagram: a parts and b parts, with a brace for the whole */
  function tape(a, b, la, lb) {
    var u = Math.min(40, 440 / (a + b)), s = '', x0 = 10;
    for (var i = 0; i < a + b; i++) s += '<rect x="' + (x0 + i * u) + '" y="10" width="' + u + '" height="34" style="fill:' + (i < a ? 'var(--strand)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
    var xa = x0 + a * u, xe = x0 + (a + b) * u;
    s += '<text x="' + (x0 + a * u / 2) + '" y="62" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--strand)">' + la + ': ' + a + '</text>' +
      '<text x="' + (xa + b * u / 2) + '" y="62" text-anchor="middle" font-size="14" font-weight="700" style="fill:#b07f00">' + lb + ': ' + b + '</text>' +
      '<path d="M' + x0 + ' 72 q0 8 8 8 H' + ((x0 + xe) / 2 - 8) + ' q8 0 8 8 q0 -8 8 -8 H' + (xe - 8) + ' q8 0 8 -8" fill="none" style="stroke:var(--ink2)" stroke-width="2"/>' +
      '<text x="' + ((x0 + xe) / 2) + '" y="106" text-anchor="middle" font-size="14" font-weight="700">whole: ' + (a + b) + '</text>';
    return A.svg(Math.max(xe + 10, 200), 112, s, la + ' ' + a + ', ' + lb + ' ' + b + ', whole ' + (a + b));
  }
  /* fruit as coloured circles */
  function fruit(a, b) {
    var s = '';
    for (var i = 0; i < a + b; i++) {
      var x = 22 + i * 40, apple = i < a;
      s += '<circle cx="' + x + '" cy="26" r="15" style="fill:' + (apple ? '#d63a3a' : '#f08c00') + ';stroke:var(--ink)" stroke-width="1.5"/>' +
        (apple ? '<path d="M' + x + ' 12 q3 -7 8 -7" fill="none" stroke="#2b8a3e" stroke-width="3" stroke-linecap="round"/>' : '<circle cx="' + x + '" cy="14" r="2.5" fill="#2b8a3e"/>');
    }
    return A.svg((a + b) * 40 + 6, 48, s, a + ' apples and ' + b + ' oranges');
  }

  A.register('ratios', {
    html:
'<section class="sec"><h2><span class="n">1</span>What is a ratio?</h2>' +
'<p>A <b>ratio</b> compares two amounts. If a bag has 3 circles and 5 squares, the ratio of circles to squares is <b>3 to 5</b>, written <span class="math">3:5</span>. Order matters: squares to circles is 5:3.</p>' +
'<div class="lab"><span class="lt">Try it: make a ratio</span>' +
'<div class="ctrl"><label for="rc">Circles: <output id="rco"></output><input type="range" id="rc" min="0" max="12" value="3"></label>' +
'<label for="rs">Squares: <output id="rso"></output><input type="range" id="rs" min="0" max="12" value="5"></label></div>' +
'<div class="fig" id="rfig"></div><div class="out" id="rout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>A ratio can compare part to part (circles to squares, 3:5) or part to whole (circles to all shapes, 3:8). Read the words carefully.</p><div class="fig">' + tape(3, 5, 'circles', 'squares') + '</div></div>' +
'<div class="eg"><p><b>Example.</b> A fruit bowl has 4 apples and 6 oranges. Apples to oranges is 4:6. Oranges to all the fruit is 6:10.</p><div class="fig">' + fruit(4, 6) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Equivalent ratios</h2>' +
'<p>Equivalent ratios make the same comparison. Multiply both numbers by the <b>same</b> number. 2:3 is the same as 4:6, because 2 groups of (2 circles and 3 squares) is 4 circles and 6 squares.</p>' +
'<div class="lab"><span class="lt">Try it: ratio table</span>' +
'<div class="ctrl"><label for="ea">First amount<select id="ea"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option></select></label>' +
'<label for="eb">Second amount<select id="eb"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option></select></label>' +
'<label for="ek">Number of groups: <output id="eko"></output><input type="range" id="ek" min="1" max="8" value="3"></label></div>' +
'<div class="fig" id="efig"></div><div class="tbl" id="etbl"></div><div class="out" id="eout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the same number to both parts. 2:3 is not the same as 4:5. Adding 2 to each changes the comparison. Always <b>multiply</b> both parts.</p>' +
'<div class="pies"><figure>' + counters(4, 6, 10) + '<figcaption>2:3 doubled is 4:6. Same mix.</figcaption></figure><figure>' + counters(4, 5, 10) + '<figcaption>4:5 has fewer squares for each circle.</figcaption></figure></div></div>' +
'<div class="eg"><p><b>Example.</b> Is 3:4 equivalent to 12:16? 3 &times; 4 = 12 and 4 &times; 4 = 16. Both parts were multiplied by 4, so <b>yes</b>.</p><div class="fig">' + rtab('first part', 'second part', [[3, 4], [12, 16]], [[0, 1, '&times; 4']]) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Rates</h2>' +
'<p>A <b>rate</b> is a ratio that compares two different kinds of units, like kilometres and hours, or dollars and kilograms. "80 km per hour" means 80 km for every 1 hour. That is written 80 km/h.</p>' +
'<div class="lab"><span class="lt">Try it: a trip at a steady speed</span>' +
'<div class="ctrl"><label for="sp">Speed (km per hour)<select id="sp"><option>20</option><option>40</option><option>60</option><option selected>80</option><option>90</option><option>100</option></select></label>' +
'<label for="sh">Hours driven: <output id="sho"></output><input type="range" id="sh" min="1" max="6" value="3"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="eg"><p><b>Example.</b> Cycling 45 km in 3 hours is the same rate as 15 km in 1 hour. Divide both parts by 3 to find the rate for 1 hour.</p><div class="fig">' + dline(15, 1, 3, 'km', 'hours', 1) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up the units. 80 km/h means 80 km in 1 hour, not 1 km in 80 hours.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Solving problems with a ratio table</h2>' +
'<p>A ratio table keeps both amounts in step. Whatever you do to one column, do to the other.</p>' +
'<div class="eg"><p><b>A recipe uses 3 cups of flour for every 2 eggs. How much flour for 8 eggs?</b></p>' +
'<div class="fig">' + rtab('eggs', 'cups of flour', [[2, 3], [4, 6], [8, 12]], [[0, 1, '&times; 2'], [1, 2, '&times; 2']], 'Ratio table: 2 eggs to 3 cups, 4 eggs to 6 cups, 8 eggs to 12 cups. Each step doubles both rows.') + '</div>' +
'<p>2 eggs doubled is 4, so double the flour: 6. Doubled again: 8 eggs and <b>12 cups</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Look for the step from the number you know to the number you want. Is it &times; 2? &times; 4? &divide; 3? Use the same step on the other amount.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function r1() {
        var c = +$('#rc', root).value, s = +$('#rs', root).value;
        $('#rco', root).textContent = c; $('#rso', root).textContent = s;
        $('#rfig', root).innerHTML = c + s ? counters(c, s) : '<p>Add some shapes.</p>';
        var g = A.gcd(c, s);
        $('#rout', root).innerHTML = '<p><span class="big">circles : squares = ' + c + ':' + s + '</span></p>' +
          '<p>Squares to circles: ' + s + ':' + c + '. Circles to all shapes: ' + c + ':' + (c + s) + '.' + (g > 1 && c && s ? ' Simplest form of ' + c + ':' + s + ' is ' + c / g + ':' + s / g + '.' : '') + '</p>';
      }
      A.bind(root, ['rc', 'rs'], r1);

      function r2() {
        var a = +$('#ea', root).value, b = +$('#eb', root).value, k = +$('#ek', root).value;
        $('#eko', root).textContent = k;
        var s = '';
        for (var g = 0; g < k; g++) {
          var gx = 6 + (g % 4) * 112, gy = 6 + Math.floor(g / 4) * 64;
          s += '<rect x="' + gx + '" y="' + gy + '" width="104" height="56" rx="8" style="fill:none;stroke:var(--line)" stroke-width="2"/>';
          for (var i = 0; i < a + b; i++) {
            var x = gx + 12 + (i % 6) * 16, y = gy + 16 + Math.floor(i / 6) * 22;
            s += i < a ? '<circle cx="' + x + '" cy="' + y + '" r="6.5" style="fill:var(--strand)"/>' : '<rect x="' + (x - 6.5) + '" y="' + (y - 6.5) + '" width="13" height="13" rx="2" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1"/>';
          }
        }
        $('#efig', root).innerHTML = A.svg(456, Math.ceil(k / 4) * 64 + 8, s, k + ' groups of ' + a + ' circles and ' + b + ' squares');
        var t = '<table><thead><tr><th>Groups</th>', r = '<tr><th>Circles</th>', q = '<tr><th>Squares</th>';
        for (var j = 1; j <= k; j++) { t += '<th>' + j + '</th>'; r += '<td>' + a * j + '</td>'; q += '<td>' + b * j + '</td>'; }
        $('#etbl', root).innerHTML = t + '</tr></thead><tbody>' + r + '</tr>' + q + '</tr></tbody></table>';
        $('#eout', root).innerHTML = '<p><span class="big">' + a + ':' + b + ' = ' + a * k + ':' + b * k + '</span></p><p>Both parts were multiplied by ' + k + '.</p>';
      }
      A.bind(root, ['ea', 'eb', 'ek'], r2);

      function r3() {
        var v = +$('#sp', root).value, h = +$('#sh', root).value;
        $('#sho', root).textContent = h;
        $('#sfig', root).innerHTML = dline(v, 1, 6, 'km', 'hours', h);
        $('#sout', root).innerHTML = '<p><span class="big">' + v + ' km/h &times; ' + h + ' h = ' + v * h + ' km</span></p><p>For every 1 hour, the car goes ' + v + ' km. In ' + h + ' hours it goes ' + h + ' &times; ' + v + ' = ' + v * h + ' km.</p>';
      }
      A.bind(root, ['sp', 'sh'], r3);
    },

    quiz: [
      { q: 'A class has 12 girls and 13 boys. What is the ratio of boys to girls?', type: 'mc', options: ['12:13', '13:12', '13:25', '12:25'], answer: 1, fig: counters(12, 13, 13), hint: 'Boys come first in the question. Here girls are circles and boys are squares.', explain: 'Boys to girls is 13:12.' },
      { q: 'A box has 4 red pens and 7 blue pens. What is the ratio of red pens to all pens?', type: 'mc', options: ['4:7', '7:4', '4:11', '11:4'], answer: 2, fig: tape(4, 7, 'red', 'blue'), hint: 'Find the total number of pens first.', explain: '4 + 7 = 11 pens in all, so red to all is 4:11.' },
      { q: 'Which ratio is equivalent to 3:4?', type: 'mc', options: ['6:7', '9:12', '4:3', '3:8'], answer: 1, hint: 'Multiply both parts by the same number.', explain: '3 &times; 3 = 9 and 4 &times; 3 = 12, so 9:12.' },
      { q: 'Fill in the missing number: <span class="math">2:5 = 8:?</span>', type: 'num', answer: 20, fig: rtab('first', 'second', [[2, 5], [8, '?']], [[0, 1, '&times; ?']]), hint: 'What was 2 multiplied by to get 8?', explain: '2 &times; 4 = 8, so 5 &times; 4 = 20.' },
      { q: 'A train travels at 90 km/h. How far does it go in 4 hours?', type: 'num', answer: 360, unit: 'km', fig: dline(90, 1, 4, 'km', 'hours', -1).replace(/>360</, '>?<'), hint: '90 km for each hour.', explain: '90 &times; 4 = 360 km.' },
      { q: 'A cyclist rides 45 km in 3 hours at a steady speed. How far does she ride in 1 hour?', type: 'num', answer: 15, unit: 'km', hint: 'Divide both parts of the rate by 3.', explain: '45 &divide; 3 = 15 km in 1 hour.' },
      { q: 'A recipe uses 3 cups of flour for every 2 eggs. How many cups of flour are needed for 8 eggs?', type: 'num', answer: 12, unit: 'cups', fig: rtab('eggs', 'cups of flour', [[2, 3], [8, '?']], [[0, 1, '&times; 4']]), hint: '2 eggs to 8 eggs is &times; 4.', explain: '3 &times; 4 = 12 cups.' }
    ],

    quick: ['ra-write', 'ra-equiv', 'ra-rate', 'ra-table'],

    practice: [
      { id: 'ra-write', name: 'Write a ratio', code: 'B2.9', gen: function (lv) {
        var a = R.int(1, 7), b = R.int(1, 7);
        while (b === a) b = R.int(1, 7);
        var kind = lv === 1 ? 'pp' : lv === 2 ? R.pick(['pp', 'rev']) : R.pick(['pw', 'rev']);
        var right = kind === 'pp' ? a + ':' + b : kind === 'rev' ? b + ':' + a : a + ':' + (a + b);
        var ask = kind === 'pp' ? 'circles to squares' : kind === 'rev' ? 'squares to circles' : 'circles to all shapes';
        var o = R.mc(right, [a + ':' + b, b + ':' + a, a + ':' + (a + b), b + ':' + (a + b)]);
        return { q: 'What is the ratio of <b>' + ask + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: counters(a, b),
          hint: kind === 'pw' ? 'Count all the shapes for the second number.' : 'Write the amounts in the order the words say.',
          steps: ['There are ' + a + ' circles and ' + b + ' squares' + (kind === 'pw' ? ', ' + (a + b) + ' shapes in all' : '') + '.', 'The question asks for ' + ask + '.', 'So the ratio is ' + right + '.'],
          explain: ask.charAt(0).toUpperCase() + ask.slice(1) + ' is ' + right + '.' };
      } },
      { id: 'ra-equiv', name: 'Equivalent ratios', code: 'B2.9', gen: function (lv) {
        var a = R.int(1, 6), b = R.int(2, 9), k = R.int(2, lv === 1 ? 3 : lv === 2 ? 6 : 9);
        if (a === b) b++;
        if (lv === 3 && R.int(0, 1)) {
          var o = R.mc((a * k) + ':' + (b * k), [(a + k) + ':' + (b + k), (a * k) + ':' + (b * k + 1), (b * k) + ':' + (a * k)]);
          return { q: 'Which ratio is equivalent to <span class="math">' + a + ':' + b + '</span>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Check: are both parts multiplied by the same number?',
            steps: ['Equivalent ratios multiply both parts by the same number.', a + ' &times; ' + k + ' = ' + a * k + ' and ' + b + ' &times; ' + k + ' = ' + b * k + '.<div class="fig">' + rtab('first', 'second', [[a, b], [a * k, b * k]], [[0, 1, '&times; ' + k]]) + '</div>', 'So ' + a + ':' + b + ' = ' + a * k + ':' + b * k + '.'], explain: a + ':' + b + ' = ' + a * k + ':' + b * k + ' (both &times; ' + k + ').' };
        }
        var top = R.int(0, 1) === 1;
        return { q: 'Fill in the missing number: <span class="math">' + a + ':' + b + ' = ' + (top ? a * k + ':?' : '?:' + b * k) + '</span>', type: 'num', answer: top ? b * k : a * k,
          fig: lv === 1 ? counters(a * k, b * k, a + b <= 6 ? (a + b) * 2 : 12) : rtab('first', 'second', [[a, b], top ? [a * k, '?'] : ['?', b * k]], [[0, 1, '&times; ?']]),
          hint: 'What was ' + (top ? a : b) + ' multiplied by to get ' + (top ? a * k : b * k) + '?',
          steps: [(top ? a + ' &times; ' + k + ' = ' + a * k : b + ' &times; ' + k + ' = ' + b * k) + ', so the multiplier is ' + k + '.', 'Multiply the other part by ' + k + ' too.', (top ? b + ' &times; ' + k + ' = ' + b * k : a + ' &times; ' + k + ' = ' + a * k) + '.'],
          explain: a + ':' + b + ' = ' + a * k + ':' + b * k + '.' };
      } },
      { id: 'ra-rate', name: 'Rates', code: 'B2.9', gen: function (lv) {
        var v = R.pick([12, 15, 20, 25, 40, 50, 60, 80, 90]), h = R.int(2, lv === 1 ? 4 : 8), ctx = R.pick([['km', 'hour', 'A bus travels at'], ['L', 'minute', 'A pump fills']]);
        if (lv < 3) {
          var unitTxt = ctx[0] === 'km' ? ' km per hour' : ' L per minute';
          return { q: ctx[2] + ' ' + v + unitTxt + '. How ' + (ctx[0] === 'km' ? 'far does it go' : 'much does it fill') + ' in ' + h + ' ' + ctx[1] + 's?', type: 'num', answer: v * h, unit: ctx[0],
            fig: lv === 1 ? dline(v, 1, h, ctx[0], ctx[1] + 's', h) : '', hint: v + ' ' + ctx[0] + ' for each ' + ctx[1] + '. How many ' + ctx[1] + 's?',
            steps: ['In 1 ' + ctx[1] + ': ' + v + ' ' + ctx[0] + '.', 'In ' + h + ' ' + ctx[1] + 's: ' + h + ' &times; ' + v + '.', h + ' &times; ' + v + ' = ' + v * h + ' ' + ctx[0] + '.'],
            explain: v + ' &times; ' + h + ' = ' + v * h + ' ' + ctx[0] + '.' };
        }
        var who = v >= 40 ? 'A car' : 'A cyclist';
        return { q: who + ' travels ' + v * h + ' km in ' + h + ' hours at a steady speed. How far does it go in 1 hour?', type: 'num', answer: v, unit: 'km',
          fig: rtab('km', 'hours', [['?', 1], [v * h, h]], [[1, 0, '&divide; ' + h]]), hint: 'Divide both parts of the rate by ' + h + '.', steps: [v * h + ' km in ' + h + ' hours.', 'Divide both by ' + h + ' to get the rate for 1 hour.', v * h + ' &divide; ' + h + ' = ' + v + ' km.'],
          explain: v * h + ' &divide; ' + h + ' = ' + v + ' km in 1 hour.' };
      } },
      { id: 'ra-table', name: 'Ratio tables and recipes', code: 'B2.9', gen: function (lv) {
        var a = R.int(2, 5), b = R.int(1, 4), k = R.int(2, lv === 1 ? 3 : 5);
        if (a === b) a++;
        var thing = R.pick([['cups of flour', 'eggs'], ['scoops of juice mix', 'litres of water'], ['blue beads', 'white beads']]);
        if (lv === 3) {
          var k2 = R.int(2, 4), A1 = a * k2, B1 = b * k2, k3 = R.int(3, 6);
          return { q: 'A mix uses ' + A1 + ' ' + thing[0] + ' for every ' + B1 + ' ' + thing[1] + '. How many ' + thing[0] + ' go with ' + b * k3 + ' ' + thing[1] + '?', type: 'num', answer: a * k3,
            fig: rtab(thing[1], thing[0], [[B1, A1], [b, '?'], [b * k3, '?']], [[0, 1, '&divide; ' + k2], [1, 2, '&times; ' + k3]]),
            hint: 'First find the amount for ' + b + ' ' + thing[1] + ' by dividing both parts by ' + k2 + '.',
            steps: ['Divide both parts by ' + k2 + ': ' + a + ' ' + thing[0] + ' for ' + b + ' ' + thing[1] + '.', b + ' &times; ' + k3 + ' = ' + b * k3 + ', so multiply by ' + k3 + '.', a + ' &times; ' + k3 + ' = ' + a * k3 + ' ' + thing[0] + '.'],
            explain: A1 + ':' + B1 + ' = ' + a + ':' + b + ' = ' + a * k3 + ':' + b * k3 + '.' };
        }
        var tbl = rtab(thing[1], thing[0], [[b, a], [b * k, '?']], [[0, 1, '&times; ' + k]]);
        return { q: 'A mix uses ' + a + ' ' + thing[0] + ' for every ' + b + ' ' + thing[1] + '. How many ' + thing[0] + ' go with ' + b * k + ' ' + thing[1] + '?', type: 'num', answer: a * k, fig: tbl,
          hint: b + ' to ' + b * k + ' is &times; ' + k + '. Do the same to the other row.',
          steps: [b + ' &times; ' + k + ' = ' + b * k + '.', 'Multiply the ' + thing[0] + ' by ' + k + ' too.', a + ' &times; ' + k + ' = ' + a * k + '.'], explain: a + ':' + b + ' = ' + a * k + ':' + b * k + '.' };
      } }
    ]
  });
})();
