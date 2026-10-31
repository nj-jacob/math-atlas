(function () {
  var A = Atlas, R = A.R;
  var ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function b1000(n) {
    var s = '';
    if (n >= 100) { s += ones[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
    if (n >= 20) { s += tens[Math.floor(n / 10)]; if (n % 10) s += '-' + ones[n % 10]; }
    else if (n > 0) s += ones[n];
    return s;
  }
  function words(n) {
    if (n === 0) return 'zero';
    var s = '';
    if (n >= 1000) { s += b1000(Math.floor(n / 1000)) + ' thousand'; n %= 1000; if (n) s += ' '; }
    if (n) s += b1000(n);
    return s;
  }
  var heads = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands'];
  var shortH = ['Ones', 'Tens', 'Hund.', 'Thous.', 'Ten thous.'];
  var NM = { 10: 'ten', 100: 'hundred', 1000: 'thousand' };

  /* small unlabelled disks in a 3 by 3 grid, for the inside of a chart column */
  function dots(d, p) {
    if (!d) return '';
    var s = '';
    for (var i = 0; i < d; i++) s += A.draw.disk(7 + (i % 3) * 13, 7 + Math.floor(i / 3) * 13, 5.5, p);
    return A.svg(40, 40, s, d + ' disk' + (d > 1 ? 's' : ''));
  }
  /* place value chart: coloured headings, the digit, disks for the digit, and its value */
  function chart(n, o) {
    o = o || {};
    var s = String(n), cols = o.cols || s.length;
    while (s.length < cols) s = '0' + s;
    var lead = cols - String(n).length, h = '<div class="pv" style="max-width:' + (cols * 96) + 'px;margin:8px auto">';
    for (var i = 0; i < cols; i++) {
      var p = cols - 1 - i, d = +s.charAt(i), dim = i < lead;
      h += '<div' + (i === o.hl ? ' class="on"' : '') + '><span class="h c' + p + '"><span class="lg">' + heads[p] + '</span><span class="sm">' + shortH[p] + '</span></span><span class="d' + (dim ? ' dim' : '') + '">' + d + '</span>' +
        (o.dots === false ? '' : '<span class="dk">' + (dim ? '' : dots(d, p)) + '</span>') +
        (o.vals ? '<span class="v">' + (dim || !d ? '' : A.fmt(d * Math.pow(10, p))) + '</span>' : '') + '</div>';
    }
    return h + '</div>';
  }
  /* each digit drops down to the value it stands for */
  function expanded(n) {
    var s = String(n), len = s.length, cw = Math.min(110, 540 / len), x0 = 280 - cw * len / 2, out = '';
    out += '<defs><marker id="nmah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    for (var i = 0; i < len; i++) {
      var p = len - 1 - i, d = +s.charAt(i), cx = x0 + cw * (i + 0.5), val = d * Math.pow(10, p);
      out += '<text x="' + cx + '" y="44" text-anchor="middle" font-size="42" font-weight="700" style="font-family:var(--display);fill:var(--p' + p + ')">' + d + '</text>' +
        '<line x1="' + cx + '" y1="54" x2="' + cx + '" y2="84" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#nmah)"/>' +
        '<rect x="' + (cx - cw / 2 + 8) + '" y="90" width="' + (cw - 16) + '" height="36" rx="10" style="fill:' + (d ? 'color-mix(in srgb,var(--p' + p + ') 16%,var(--card))' : 'var(--card)') + ';stroke:var(--p' + p + ')" stroke-width="2.5"' + (d ? '' : ' stroke-dasharray="5 4"') + '/>' +
        '<text x="' + cx + '" y="114" text-anchor="middle" font-size="19" font-weight="700"' + (d ? '' : ' class="t2"') + '>' + A.fmt(val) + '</text>' +
        '<text x="' + cx + '" y="150" text-anchor="middle" font-size="16" class="t2">' + A.PLACES[p] + '</text>';
      if (i < len - 1) out += '<text x="' + (cx + cw / 2) + '" y="114" text-anchor="middle" font-size="18" font-weight="700">+</text>';
    }
    return A.svg(560, 158, out, A.fmt(n) + ' in expanded form');
  }
  /* a hill over a number line: halfway is the top, and the number rolls to the side it is on */
  function hill(n, p, id) {
    id = id || 'nmrh';
    var lo = Math.floor(n / p) * p, hi = lo + p, t = (n - lo) / p, up = n - lo >= p / 2;
    var x = 40 + 480 * t, y = 100 - 150 * t * (1 - t), s = '';
    s += '<path d="M40 100 Q280 -50 520 100" fill="none" style="stroke:color-mix(in srgb,var(--strand) 30%,var(--line))" stroke-width="12" stroke-linecap="round"/>';
    s += '<line x1="280" y1="25" x2="280" y2="132" style="stroke:var(--ink2)" stroke-dasharray="4 4" stroke-width="1.5"/>';
    s += '<line x1="40" y1="132" x2="520" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var i = 0; i <= 10; i++) { var tx = 40 + 48 * i; s += '<line x1="' + tx + '" y1="' + (i % 5 ? 126 : 122) + '" x2="' + tx + '" y2="' + (i % 5 ? 138 : 142) + '" style="stroke:var(--ink)" stroke-width="2"/>'; }
    [[40, lo, 'lower'], [280, lo + p / 2, 'halfway'], [520, hi, 'upper']].forEach(function (k) {
      s += '<text x="' + k[0] + '" y="164" text-anchor="middle" font-size="19" class="tb">' + A.fmt(k[1]) + '</text><text x="' + k[0] + '" y="186" text-anchor="middle" class="t2" font-size="18">' + k[2] + '</text>';
    });
    if (n !== lo) {
      var ex = up ? 500 : 60;
      s += '<path d="M' + x + ' ' + (y - 16) + ' Q' + ((x + ex) / 2) + ' ' + (Math.min(y, 80) - 30) + ' ' + ex + ' 86" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#' + id + ')"/>';
    }
    s = '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>' + s;
    s += '<circle cx="' + (n === lo ? 40 : up ? 520 : 40) + '" cy="132" r="11" style="fill:none;stroke:var(--accent)" stroke-width="4"/>';
    s += '<circle cx="' + x + '" cy="' + (y - 9) + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + Math.min(Math.max(x, 60), 500) + '" y="' + (y - 26) + '" text-anchor="middle" font-size="19" class="tb">' + A.fmt(n) + '</text>';
    return A.svg(560, 194, s, A.fmt(n) + ' on a hill between ' + A.fmt(lo) + ' and ' + A.fmt(hi) + '. It rounds to ' + A.fmt(n === lo ? lo : up ? hi : lo) + '.');
  }
  /* every place is 10 of the place to its right: blocks from 1 to 10 000 */
  function stairs() {
    var P = A.draw.prism, s = '';
    s += '<defs><marker id="nmst" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    function arrow(x1, x2, y) {
      return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#nmst)"/>' +
        '<text x="' + ((x1 + x2) / 2) + '" y="' + (y - 8) + '" text-anchor="middle" font-size="19" class="tb">&times; 10</text>';
    }
    function lab(x, y, a, b, p) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="24" font-weight="700" style="fill:var(--p' + p + ')">' + a + '</text>' +
        '<text x="' + x + '" y="' + (y + 22) + '" text-anchor="middle" font-size="19" class="t2">' + b + '</text>';
    }
    var u = 6, base = 92;
    s += P(30, base, u, u, u, 1, 1, 1, 0) + lab(33, base + 24, '1', 'one', 0) + arrow(48, 96, base - 20);
    s += P(110, base, u, u, 10 * u, 1, 1, 10, 1) + lab(113, base + 24, '10', 'ten', 1) + arrow(132, 186, base - 20);
    s += P(200, base, 10 * u, u, 10 * u, 10, 1, 10, 2) + lab(230, base + 24, '100', 'hundred', 2) + arrow(276, 340, base - 20);
    s += P(356, base, 10 * u, 10 * u, 10 * u, 10, 10, 10, 3) + lab(398, base + 24, '1000', 'thousand', 3);
    /* row 2: ten thousand cubes in a row make 10 000 */
    s += '<line x1="20" y1="138" x2="540" y2="138" style="stroke:var(--line)" stroke-dasharray="4 4"/><text x="280" y="162" text-anchor="middle" font-size="20" class="tb">10 thousand cubes make ten thousand.</text>';
    var v = 30, b2 = 236;
    for (var i = 0; i < 10; i++) s += P(36 + i * (v + 12), b2, v, v, v, 10, 10, 10, 3);
    s += lab(280, b2 + 28, '10 000', 'ten thousand', 4);
    return A.svg(560, 296, s, 'Base-ten blocks. 1 small cube is one. 10 make a rod, which is ten. 10 rods make a flat, which is a hundred. 10 flats make a big cube, which is a thousand. 10 big cubes make ten thousand.');
  }
  /* 100 squares, each worth 100, filled up to n (n up to 10 000) */
  function grid10k(n) {
    var sz = 26, s = '', full = Math.floor(n / 100), part = (n % 100) / 100;
    for (var i = 0; i < 100; i++) {
      var x = 58 + (i % 10) * sz, y = 6 + Math.floor(i / 10) * sz;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1"/>';
      if (i < full) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (sz - 3) + '" height="' + (sz - 3) + '" rx="3" style="fill:var(--strand)"/>';
      else if (i === full && part > 0) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + ((sz - 3) * part).toFixed(1) + '" height="' + (sz - 3) + '" rx="3" style="fill:var(--strand);opacity:.55"/>';
    }
    for (var r = 1; r <= 10; r++) s += '<text x="52" y="' + (6 + r * sz - 8) + '" text-anchor="end" font-size="14" class="t2">' + A.fmt(r * 1000) + '</text>';
    s += '<rect x="336" y="10" width="20" height="20" rx="3" style="fill:var(--strand)"/><text x="364" y="26" font-size="17">= 100</text>' +
      '<text x="336" y="60" font-size="17">10 squares</text><text x="336" y="80" font-size="17">= 1000</text>' +
      '<text x="336" y="114" font-size="17">100 squares</text><text x="336" y="134" font-size="17">= 10 000</text>';
    return A.svg(450, 270, s, A.fmt(n) + ' shown as ' + full + ' of 100 squares, each worth 100');
  }
  /* comparing on a number line with good tick marks */
  function cmpLine(a, b) {
    var lo = Math.min(a, b), hi = Math.max(a, b), step = hi - lo > 2000 ? 1000 : hi - lo > 200 ? 100 : 10;
    var L = Math.floor(lo / step) * step, H = Math.ceil(hi / step) * step;
    if (H === L) H = L + step;
    while ((H - L) / step > 10) { step *= 2; L = Math.floor(lo / step) * step; H = Math.ceil(hi / step) * step; }
    var x0 = 30, x1 = 530, s = '<line x1="' + x0 + '" y1="44" x2="' + x1 + '" y2="44" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var v = L; v <= H; v += step) {
      var x = x0 + (x1 - x0) * (v - L) / (H - L);
      s += '<line x1="' + x + '" y1="37" x2="' + x + '" y2="51" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="73" text-anchor="middle" font-size="17">' + A.fmt(v) + '</text>';
    }
    [[a, 'var(--strand)', 'first'], [b, 'var(--hi)', 'second']].forEach(function (p, k) {
      var x = x0 + (x1 - x0) * (p[0] - L) / (H - L);
      s += '<circle cx="' + x + '" cy="44" r="8" style="fill:' + p[1] + ';stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="' + (k ? 16 : 28) + '" text-anchor="middle" class="tb" font-size="17">' + p[2] + '</text>';
    });
    return A.svg(560, 80, s, 'Number line showing ' + a + ' and ' + b);
  }
  function digitsOf(n) { var s = String(n), out = []; for (var i = 0; i < s.length; i++) { var v = +s.charAt(i) * Math.pow(10, s.length - 1 - i); if (v) out.push(v); } return out; }

  /* practice generators, also used by the "Your turn" checks */
  var gen = {
    value: function (lv) {
      var n = lv === 1 ? R.int(1000, 9999) : lv === 2 ? R.int(1000, 9999) : R.int(1000, 9999);
      var s = String(n), len = s.length, i = R.int(0, len - 1);
      while (s.charAt(i) === '0') i = R.int(0, len - 1);
      var dgt = +s.charAt(i), place = len - 1 - i, val = dgt * Math.pow(10, place);
      if (lv === 3) {
        var k = R.pick([1, 2]), total = Math.floor(n / Math.pow(10, k));
        return { q: 'How many <b>' + A.PLACES[k] + '</b> are in <span class="math">' + A.fmt(n) + '</span>, counting all of them?', type: 'num', answer: total,
          fig: chart(n, { dots: false }),
          hint: 'Cover the digit' + (k > 1 ? 's' : '') + ' to the right of the ' + A.PLACES[k] + ' place. Read what is left.',
          steps: ['Find the ' + A.PLACES[k] + ' place in ' + A.fmt(n) + '.', 'Cover the ' + k + ' digit' + (k > 1 ? 's' : '') + ' to its right.', 'What is left is ' + A.fmt(total) + ', so there are ' + A.fmt(total) + ' ' + A.PLACES[k] + '.'],
          explain: A.fmt(n) + ' = ' + A.fmt(total) + ' ' + A.PLACES[k] + ' + ' + (n % Math.pow(10, k)) + '.' };
      }
      var wrong = [dgt, dgt * Math.pow(10, place + 1), dgt * Math.pow(10, Math.max(0, place - 1)), dgt * Math.pow(10, place + 2)].filter(function (v) { return v !== val; });
      var o = R.mc(A.fmt(val), wrong.map(A.fmt));
      return { q: 'What is the value of the underlined digit in <span class="math">' + s.slice(0, i) + '<u>' + dgt + '</u>' + s.slice(i + 1) + '</span>?',
        type: 'mc', options: o.options, answer: o.answer, fig: lv === 1 ? chart(n, { hl: i }) : '',
        hint: lv === 1 ? 'Find the underlined digit in the chart. Read the name of its place.' : 'Name the place first: ones, tens, hundreds or thousands.',
        steps: ['The underlined ' + dgt + ' is in the <b>' + A.PLACES[place] + '</b> place.', 'One ' + A.PLACE1[place] + ' is ' + A.fmt(Math.pow(10, place)) + '.', dgt + ' &times; ' + A.fmt(Math.pow(10, place)) + ' = ' + A.fmt(val) + '.<div class="fig">' + chart(n, { hl: i, dots: false }) + '</div>'],
        explain: 'The ' + dgt + ' is in the ' + A.PLACES[place] + ' place, so it is worth ' + A.fmt(val) + '.' };
    },
    blocks: function (lv) {
      var n, q = 'What number do these ' + (lv === 1 ? 'base-ten blocks' : 'disks') + ' show?';
      if (lv === 1) {
        n = R.int(1, 3) * 1000 + R.int(0, 4) * 100 + R.int(0, 5) * 10 + R.int(0, 6);
        var d = ('0000' + n).slice(-4);
        return { q: q, type: 'num', answer: n, fig: A.draw.blocks(n), hint: 'Big cubes are thousands, flats are hundreds, rods are tens, small cubes are ones. A place with none gets a 0.',
          steps: ['Count the big cubes: ' + d[0] + ' thousands. Count the flats: ' + d[1] + ' hundreds.', 'Count the rods: ' + d[2] + ' tens. Count the small cubes: ' + d[3] + ' ones.', 'Write one digit for each place: ' + A.fmt(n) + '.'],
          explain: 'The blocks show ' + A.fmt(n) + '.' };
      }
      var c = [R.int(0, 6), R.int(0, 5), R.int(0, 5), R.int(1, 9)];
      c[R.int(0, 2)] = 0;
      n = c[3] * 1000 + c[2] * 100 + c[1] * 10 + c[0];
      if (lv === 2) {
        var g = [], miss = [];
        for (var p = 3; p >= 0; p--) { if (c[p]) g.push({ p: p, n: c[p] }); else miss.push(A.PLACES[p]); }
        return { q: q, type: 'num', answer: n, fig: A.draw.disks(g), hint: 'Count each row. A place with no disks gets a 0.',
          steps: ['Count the disks in each place: ' + g.map(function (x) { return x.n + ' ' + (x.n === 1 ? A.PLACE1[x.p] : A.PLACES[x.p]); }).join(', ') + '.', miss.length ? 'There are no ' + miss.join(' and no ') + ', so write 0 there.' : 'Every place has disks.', 'The number is ' + A.fmt(n) + '.'],
          explain: 'The disks show ' + A.fmt(n) + '.' };
      }
      /* level 3: one place has 10 or more disks, and the rows are mixed up */
      var cand = [0, 1, 2].filter(function (k) { return c[k + 1] > 0; }), t = R.pick(cand);
      c[t + 1]--; c[t] += 10;
      var groups = [];
      for (var p2 = 3; p2 >= 0; p2--) if (c[p2]) groups.push({ p: p2, n: c[p2] });
      groups = R.shuffle(groups);
      return { q: q + ' Watch for a place with 10 or more.', type: 'num', answer: n, fig: A.draw.disks(groups),
        hint: 'There are ' + c[t] + ' ' + A.PLACES[t] + '. Ten of them make 1 ' + A.PLACE1[t + 1] + '.',
        steps: ['Count each kind of disk. There are ' + c[t] + ' ' + A.PLACES[t] + '.', '10 ' + A.PLACES[t] + ' make 1 ' + A.PLACE1[t + 1] + '. Trade them: ' + (c[t] - 10) + ' ' + A.PLACES[t] + ' and 1 more ' + A.PLACE1[t + 1] + '.', 'Now each place has 9 or fewer. Write the digits from the biggest place down: ' + A.fmt(n) + '.'],
        explain: 'After trading 10 ' + A.PLACES[t] + ' for 1 ' + A.PLACE1[t + 1] + ', the number is ' + A.fmt(n) + '.' };
    },
    forms: function (lv) {
      var n = R.int(1, 9) * 1000 + R.int(1, 9) * 100 + R.int(1, 9) * 10 + R.int(1, 9);
      if (lv >= 2) { var z = R.int(0, 2); n -= Math.floor(n / Math.pow(10, z)) % 10 * Math.pow(10, z); }
      var parts = digitsOf(n), shownParts = lv === 3 ? R.shuffle(parts) : parts;
      return { q: 'Write in standard form: <span class="math">' + shownParts.map(A.fmt).join(' + ') + '</span>', type: 'num', answer: n,
        fig: lv === 1 ? A.draw.disks(parts.map(function (v) { var p = String(v).length - 1; return { p: p, n: v / Math.pow(10, p) }; })) : '',
        hint: lv === 3 ? 'The parts are mixed up. Sort them from biggest to smallest first.' : 'Put each part in its place. Any empty place gets a 0.',
        steps: ['Sort the parts from biggest to smallest: ' + parts.map(A.fmt).join(' + ') + '.', 'Write one digit for each place, from thousands down to ones. Write 0 for any place that is missing.', 'The number is ' + A.fmt(n) + '.<div class="fig">' + expanded(n) + '</div>'],
        explain: 'Each part fills one place. The result is ' + A.fmt(n) + '.' };
    },
    words: function (lv) {
      var n = lv === 1 ? R.int(1, 9) * 1000 + R.int(1, 9) * 100 + R.int(10, 99) : R.int(1, 9) * 1000 + R.pick([0, R.int(1, 9)]) * 100 + R.pick([0, R.int(1, 9)]) * 10 + R.int(1, 9);
      var th = Math.floor(n / 1000), on = n % 1000;
      var wrong = [], noZ = +String(n).replace(/0/g, '');
      if (noZ !== n) wrong.push(noZ);
      wrong.push(th * 100 + on, th * 1000 + on * 10 > 9999 ? n + 100 : th * 1000 + (on % 100) * 10, n + R.pick([1, 10, 100]) * R.int(1, 3), th * 10000 + on);
      wrong = wrong.filter(function (w, i) { return w !== n && w > 0 && wrong.indexOf(w) === i; });
      var steps = ['Split the number into two parts: the thousands and the rest.', 'Thousands: ' + th + ' &rarr; "' + b1000(th) + ' thousand".',
        'The rest: ' + ('00' + on).slice(-3) + ' &rarr; "' + b1000(on) + '". After the thousands, the rest always takes three digits.', 'Together: ' + A.fmt(n) + ' is ' + words(n) + '.'];
      if (lv === 3) {
        var o = R.mc(words(n), wrong.slice(0, 3).map(words));
        return { q: 'Which is the word form of <span class="math">' + A.fmt(n) + '</span>?', type: 'mc', options: o.options, answer: o.answer,
          fig: chart(n, { dots: false }), hint: 'Read the thousands first, then the last three digits. Skip any place that has a 0.', steps: steps, explain: A.fmt(n) + ' is ' + words(n) + '.' };
      }
      var o2 = R.mc(A.fmt(n), wrong.slice(0, 3).map(A.fmt));
      return { q: 'Which number is <b>' + words(n) + '</b>?', type: 'mc', options: o2.options, answer: o2.answer,
        hint: 'Write the thousands digit, then three digits for the rest. Use 0 for any empty place.', steps: steps, explain: words(n) + ' is ' + A.fmt(n) + '.' };
    },
    compare: function (lv) {
      if (lv < 3) {
        var a, b;
        if (lv === 1) { a = R.int(1000, 9999); b = a + R.pick([-1, 1]) * R.int(1, 8) * Math.pow(10, R.int(1, 3)); }
        else { a = R.int(100, 999); b = R.int(1000, 1999); if (R.int(0, 1)) { var t = a; a = b; b = t; } if (R.int(0, 1)) { a = R.int(1000, 9899); b = a + R.pick([-1, 1]) * R.int(1, 9); } }
        if (b < 100 || b > 10000 || b === a) b = a + 10;
        var sym = a > b ? '&gt;' : '&lt;', o = R.mc(sym, ['&gt;', '&lt;', '=']);
        var cols = Math.max(String(a).length, String(b).length), sa0 = ('0000' + a).slice(-cols), sb0 = ('0000' + b).slice(-cols), d0 = 0;
        while (d0 < cols && sa0.charAt(d0) === sb0.charAt(d0)) d0++;
        return { q: 'Which symbol goes in the box? <span class="math">' + A.fmt(a) + ' &#9633; ' + A.fmt(b) + '</span>', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Start at the left. Find the first place where the digits are different.', fig: lv === 1 ? chart(a, { cols: cols, dots: false }) + chart(b, { cols: cols, dots: false }) : '',
          steps: ['Line up the numbers by place.', 'Start at the left. The first different digits are in the ' + A.PLACES[cols - 1 - d0] + ' place: ' + sa0.charAt(d0) + ' and ' + sb0.charAt(d0) + '.<div class="fig">' + chart(a, { cols: cols, hl: d0, dots: false }) + chart(b, { cols: cols, hl: d0, dots: false }) + '</div>', 'The bigger digit there makes the bigger number, so ' + A.fmt(a) + ' ' + sym + ' ' + A.fmt(b) + '.'],
          explain: A.fmt(a) + ' ' + sym + ' ' + A.fmt(b) + '. The symbol opens toward the greater number.' };
      }
      var th = R.int(2, 8) * 1000, nums = [];
      while (nums.length < 4) { var v = th + R.int(0, 9) * 100 + R.int(0, 99); if (nums.indexOf(v) < 0) nums.push(v); }
      var sorted = nums.slice().sort(function (x, y) { return x - y; });
      var right = sorted.map(A.fmt).join(', ');
      var w1 = sorted.slice().reverse().map(A.fmt).join(', '), w2 = [sorted[1], sorted[0], sorted[2], sorted[3]].map(A.fmt).join(', '), w3 = [sorted[0], sorted[2], sorted[1], sorted[3]].map(A.fmt).join(', ');
      var o2 = R.mc(right, [w1, w2, w3]);
      return { q: 'Which list is in order from <b>least to greatest</b>? <span class="t2">(' + R.shuffle(nums).map(A.fmt).join(', ') + ')</span>', type: 'mc', options: o2.options, answer: o2.answer,
        hint: 'All the numbers have the same thousands digit. Compare the hundreds next, then the tens.',
        steps: ['The thousands digits are all ' + th / 1000 + '.', 'Compare the hundreds digits, then the tens if they match.', 'From least to greatest: ' + right + '.'],
        explain: 'In order: ' + right + '.' };
    },
    round: function (lv) {
      var p = lv === 1 ? R.pick([10, 100]) : lv === 2 ? R.pick([100, 1000]) : 1000;
      var n = lv === 1 ? R.int(100, 999) : R.int(1000, 9999);
      if (lv === 3) n = R.pick([R.int(1, 8) * 1000 + 900 + R.int(50, 99), R.int(1, 9) * 1000 + 500, R.int(1, 8) * 1000 + R.int(450, 549)]);
      var lo = Math.floor(n / p) * p, hi = lo + p, ans = n - lo >= p / 2 ? hi : lo, dg = Math.floor((n % p) / (p / 10));
      var nm = NM[p];
      var o = R.mc(A.fmt(ans), [A.fmt(ans === hi ? lo : hi), A.fmt(Math.round(n / (p / 10)) * (p / 10)), A.fmt(ans + p)]);
      return { q: 'Round <span class="math">' + A.fmt(n) + '</span> to the nearest <b>' + nm + '</b>.', type: 'mc', options: o.options, answer: o.answer,
        fig: lv < 3 ? hill(n, p, 'nmrq') : '', hint: lv < 3 ? 'Is the yellow ball before the top of the hill or past it?' : 'Find the ' + nm + 's on either side, then look at the next digit to the right.',
        steps: ['The ' + nm + 's on either side are ' + A.fmt(lo) + ' and ' + A.fmt(hi) + '.', 'Look at the digit just to the right of the ' + nm + 's place. It is ' + dg + '.', (dg >= 5 ? '5 or more rounds up, to ' + A.fmt(hi) + '.' : 'Less than 5 rounds down, to ' + A.fmt(lo) + '.') + (lv === 3 ? '<div class="fig">' + hill(n, p, 'nmrs') + '</div>' : '')],
        explain: A.fmt(n) + ' rounds to ' + A.fmt(ans) + '.' };
    }
  };

  A.register('numbers', {
    html:
'<section class="sec"><h2><span class="n">1</span>Places up to 10 000</h2>' +
'<p>Every digit in a number has a <b>place</b>. The place decides what the digit is worth. Each place is worth <b>10 times</b> the place to its right.</p>' +
'<div class="fig">' + stairs() + '</div>' +
'<p>In this chapter each place has its own colour, so you can follow a digit from the chart to the blocks to the words.</p>' +
'<div class="legend"><span><i style="background:var(--p4)"></i>ten thousands</span><span><i style="background:var(--p3)"></i>thousands</span><span><i style="background:var(--p2)"></i>hundreds</span><span><i style="background:var(--p1)"></i>tens</span><span><i style="background:var(--p0)"></i>ones</span></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' +
'<div class="ctrl"><label for="nmr">Slide to pick a number: <output id="nmo"></output></label><input type="range" id="nmr" min="0" max="10000" step="1" value="4107"></div>' +
'<div class="ctrl"><label for="nmn">Or type one (0 to 10000)<input type="number" id="nmn" min="0" max="10000" value="4107"></label></div>' +
'<div id="nmchart"></div><div class="fig" id="nmblk"></div><div class="out" id="nmout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>A <b>zero</b> holds a place open. In 4107 the 0 says "no tens". There are no rods there, but the place still has to be written.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>In 4107, the 4 is in the thousands place, so it is worth <b>4000</b>. The 1 is in the hundreds place, so it is worth <b>100</b>. The 7 is worth <b>7</b>.</p><div class="fig">' + chart(4107, { vals: true }) + '</div></div>' +
A.yt({ gen: function () { return gen.value(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Writing and breaking apart numbers</h2>' +
'<p>The same number can be written three ways. Follow each coloured digit down to the value it stands for.</p>' +
'<div class="fig">' + expanded(5236) + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">Form</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l">Standard form</td><td class="l math">5236</td></tr>' +
'<tr><td class="l">Expanded form</td><td class="l math">5000 + 200 + 30 + 6</td></tr>' +
'<tr><td class="l">Word form</td><td class="l">five thousand two hundred thirty-six</td></tr></tbody></table></div>' +
'<p>To <b>decompose</b> a number means to break it into parts. You can always trade one bigger disk for 10 of the next smaller disk. The total stays the same.</p>' +
'<div class="lab"><span class="lt">Try it: trade disks</span>' +
'<div class="ctrl"><label for="nmtn">Start number (1000 to 9999)<input type="number" id="nmtn" min="1000" max="9999" value="1362"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-tr="3">Break 1 thousand into 10 hundreds</button><button type="button" class="btn alt" data-tr="2">Break 1 hundred into 10 tens</button><button type="button" class="btn alt" data-tr="1">Break 1 ten into 10 ones</button></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-gr="2">Group 10 hundreds</button><button type="button" class="btn alt" data-gr="1">Group 10 tens</button><button type="button" class="btn alt" data-gr="0">Group 10 ones</button></div>' +
'<div class="fig" id="nmtfig"></div><div class="out" id="nmtout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>1362 is 1 thousand, 3 hundreds, 6 tens and 2 ones. Break the thousand into 10 hundreds and you get <b>13 hundreds, 6 tens and 2 ones</b>. That is still 1362. With money, 1362 dollars could be 136 ten-dollar bills and 1 toonie.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Do not say "and" in a whole number. 3045 is "three thousand forty-five". The word "and" is saved for decimals, later in this site.</p></div>' +
A.yt({ gen: function () { return gen.forms(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Comparing and ordering</h2>' +
'<p>Line the numbers up by place. <b>Start at the left.</b> The first place where the digits are different tells you which number is greater.</p>' +
'<p>The symbol opens toward the greater number. <span class="math">2 &lt; 7</span> is read "2 is less than 7". <span class="math">7 &gt; 2</span> is read "7 is greater than 2". A number with more digits is greater: 1000 &gt; 999.</p>' +
'<div class="lab"><span class="lt">Try it: compare place by place</span>' +
'<div class="ctrl"><label for="nmca">First number<input type="number" id="nmca" min="0" max="10000" value="6482"></label>' +
'<label for="nmcb">Second number<input type="number" id="nmcb" min="0" max="10000" value="6428"></label></div>' +
'<div id="nmcchart"></div><div class="fig" id="nmcline"></div><div class="out" id="nmcout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Order 5280, 3890, 5208 and 4730 from least to greatest. Start at the left: the thousands are 5, 3, 5, 4. So 3890 is least, then 4730. Two numbers have 5 thousands, so compare their hundreds: 2 and 2 are the same. Compare the tens: 8 and 0. So 5208 comes before 5280.</p>' +
'<div class="fig" id="nmofig"></div><p>Least to greatest: <b>3890, 4730, 5208, 5280</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Looking at the last digits first. 4001 is greater than 3999, even though 1 is less than 9. Always start at the left.</p></div>' +
A.yt({ gen: function () { return gen.compare(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Rounding</h2>' +
'<p>Rounding finds the nearest "friendly" number. Picture a hill between two friendly numbers. Halfway is the top. A number past the top rolls <b>up</b>. A number before the top rolls back <b>down</b>. A number exactly at the top rounds up.</p>' +
'<div class="lab"><span class="lt">Try it: round to a place</span>' +
'<div class="ctrl"><label for="nmrn">Number (0 to 10000)<input type="number" id="nmrn" min="0" max="10000" value="3650"></label>' +
'<label for="nmrp">Round to the nearest<select id="nmrp"><option value="10">ten</option><option value="100">hundred</option><option value="1000" selected>thousand</option></select></label></div>' +
'<div class="fig" id="nmrfig"></div><div class="out" id="nmrout"></div></div>' +
'<p>Without a picture, use this rule. Look at the digit just to the <b>right</b> of the rounding place. <b>5 or more, round up. Less than 5, round down.</b></p>' +
'<div class="eg"><b class="t">Worked example</b><p>Round 3650 to the nearest thousand. The thousands on either side are 3000 and 4000. The digit to the right of the thousands is 6. 6 is 5 or more, so round up: <b>4000</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Forgetting to carry. Rounding 2970 to the nearest hundred gives 3000. 29 hundreds and 1 more hundred is 30 hundreds.</p>' +
'<div class="fig">' + hill(2970, 100, 'nmrm') + '</div></div>' +
A.yt({ gen: function () { return gen.round(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Numbers in everyday life</h2>' +
'<p>We use numbers to count, measure, and say how much things cost. Often we only need to know <b>about</b> how big a number is.</p>' +
'<div class="facts"><div><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--strand)" stroke-width="2.5"/><path d="M22 10V22L30 27" style="fill:none;stroke:var(--strand)" stroke-width="3" stroke-linecap="round"/></svg><span><b>1440</b><small>minutes in one day</small></span></div>' +
'<div><svg viewBox="0 0 44 44" aria-hidden="true"><rect x="6" y="9" width="32" height="29" rx="4" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--strand)" stroke-width="2.5"/><line x1="6" y1="17" x2="38" y2="17" style="stroke:var(--strand)" stroke-width="2.5"/><line x1="14" y1="5" x2="14" y2="12" style="stroke:var(--strand)" stroke-width="3"/><line x1="30" y1="5" x2="30" y2="12" style="stroke:var(--strand)" stroke-width="3"/></svg><span><b>8760</b><small>hours in a year of 365 days</small></span></div>' +
'<div><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M6 34 Q22 4 38 34" style="fill:none;stroke:var(--strand)" stroke-width="3" stroke-dasharray="4 3"/><circle cx="6" cy="34" r="4" style="fill:var(--strand)"/><circle cx="38" cy="34" r="4" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/></svg><span><b>10 000</b><small>metres in a 10 km race</small></span></div></div>' +
'<div class="lab"><span class="lt">Try it: how big is 10 000?</span>' +
'<div class="ctrl"><label for="nmkp">Pick one<select id="nmkp"><option value="1440">Minutes in a day: 1440</option><option value="8760">Hours in a year: 8760</option><option value="5000">Halfway to 10 000: 5000</option><option value="365">Days in a year: 365</option><option value="10000">10 000</option></select></label>' +
'<label for="nmkn">Or type a number<input type="number" id="nmkn" min="0" max="10000" value="1440"></label></div>' +
'<div class="fig" id="nmkfig"></div><div class="out" id="nmkout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>10 000 is 10 thousands, or 100 hundreds, or 1000 tens. Each square in the picture is 100, and the whole picture is 10 000.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>There are 8760 hours in a year. Rounded to the nearest thousand, that is about <b>9000</b>. On the 100-square picture it fills between 87 and 88 squares.</p></div>' +
A.yt({ q: 'About how many squares of the picture would 3000 fill?', type: 'num', answer: 30, hint: 'Each square is 100. How many hundreds are in 3000?', explain: '3000 is 30 hundreds, so it fills 30 squares.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function pv() {
        var n = parseInt($('#nmn', root).value, 10);
        if (isNaN(n)) n = 0;
        n = Math.max(0, Math.min(10000, n));
        $('#nmo', root).textContent = A.fmt(n);
        $('#nmchart', root).innerHTML = chart(n, { cols: 5, vals: true });
        $('#nmblk', root).innerHTML = A.draw.blocks(n, null, 540);
        var parts = [], s = String(n);
        for (var k = 0; k < s.length; k++) {
          var p = s.length - 1 - k;
          if (s.charAt(k) !== '0') parts.push('<b class="c' + p + 't">' + A.fmt(+s.charAt(k) * Math.pow(10, p)) + '</b>');
        }
        $('#nmout', root).innerHTML = '<p><b>Expanded form:</b> <span class="math">' + (parts.join(' + ') || '0') + '</span></p><p><b>In words:</b> ' + words(n) + '</p>';
      }
      $('#nmr', root).addEventListener('input', function () { $('#nmn', root).value = this.value; pv(); });
      $('#nmn', root).addEventListener('input', function () { var v = Math.max(0, Math.min(10000, parseInt(this.value, 10) || 0)); $('#nmr', root).value = v; pv(); });
      pv();

      /* trade disks. c[p] is the number of disks in place p */
      var c = [0, 0, 0, 0], MAX = 30;
      function trStart() {
        var n = Math.max(1000, Math.min(9999, parseInt($('#nmtn', root).value, 10) || 1000));
        c = [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000)];
        tr();
      }
      function tr() {
        /* four columns on wide screens, two by two on a phone so the disks stay big */
        var narrow = $('#nmtfig', root).clientWidth < 480, per = narrow ? 2 : 4;
        var r = 14, gap = 31, colW = 138, rows = 1, rows2 = 1, s = '', total = 0;
        for (var p = 0; p < 4; p++) { rows = Math.max(rows, Math.ceil(c[p] / 4)); total += c[p] * Math.pow(10, p); }
        for (var p3 = 0; p3 < 2; p3++) rows2 = Math.max(rows2, Math.ceil(c[p3] / 4));
        var blockH = 40 + rows * gap + 4;
        for (var q = 3; q >= 0; q--) {
          var x0 = ((3 - q) % per) * colW + 4, yo = narrow && q < 2 ? blockH : 0;
          s += '<rect x="' + x0 + '" y="' + (2 + yo) + '" width="' + (colW - 8) + '" height="26" rx="8" style="fill:var(--p' + q + ')"/>' +
            '<text x="' + (x0 + (colW - 8) / 2) + '" y="' + (21 + yo) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:' + (q ? '#fff' : '#2a211b') + '">' + c[q] + ' ' + (c[q] === 1 ? A.PLACE1[q] : A.PLACES[q]) + '</text>';
          for (var i = 0; i < c[q]; i++) s += A.draw.disk(x0 + 19 + (i % 4) * gap, 50 + yo + Math.floor(i / 4) * gap, r, q);
        }
        $('#nmtfig', root).innerHTML = A.svg(per * colW, narrow ? blockH + 40 + rows2 * gap + 4 : blockH, s, c[3] + ' thousands, ' + c[2] + ' hundreds, ' + c[1] + ' tens and ' + c[0] + ' ones');
        var parts = [];
        for (var k = 3; k >= 0; k--) if (c[k]) parts.push('<b class="c' + k + 't">' + c[k] + ' ' + (c[k] === 1 ? A.PLACE1[k] : A.PLACES[k]) + '</b>');
        $('#nmtout', root).innerHTML = '<p>' + parts.join(' + ') + ' = <span class="big">' + A.fmt(total) + '</span></p><p class="t2">Same number, different parts.</p>';
        root.querySelectorAll('[data-tr]').forEach(function (b) { var p = +b.getAttribute('data-tr'); b.disabled = c[p] < 1 || c[p - 1] + 10 > MAX; });
        root.querySelectorAll('[data-gr]').forEach(function (b) { var p = +b.getAttribute('data-gr'); b.disabled = c[p] < 10; });
      }
      root.querySelectorAll('[data-tr]').forEach(function (b) { b.addEventListener('click', function () { var p = +b.getAttribute('data-tr'); if (c[p] > 0 && c[p - 1] + 10 <= MAX) { c[p]--; c[p - 1] += 10; tr(); } }); });
      root.querySelectorAll('[data-gr]').forEach(function (b) { b.addEventListener('click', function () { var p = +b.getAttribute('data-gr'); if (c[p] >= 10) { c[p] -= 10; c[p + 1]++; tr(); } }); });
      A.bind(root, ['nmtn'], trStart);

      function cp() {
        var a = Math.max(0, Math.min(10000, parseInt($('#nmca', root).value, 10) || 0));
        var b = Math.max(0, Math.min(10000, parseInt($('#nmcb', root).value, 10) || 0));
        var sa = ('0000' + a).slice(-5), sb = ('0000' + b).slice(-5), diff = -1;
        for (var i = 0; i < 5; i++) if (sa.charAt(i) !== sb.charAt(i)) { diff = i; break; }
        $('#nmcchart', root).innerHTML = '<p class="t2" style="margin:.3em 0 0;font-size:.9rem">First number</p>' + chart(a, { cols: 5, hl: diff, dots: false }) +
          '<p class="t2" style="margin:.3em 0 0;font-size:.9rem">Second number</p>' + chart(b, { cols: 5, hl: diff, dots: false });
        $('#nmcline', root).innerHTML = cmpLine(a, b);
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=';
        $('#nmcout', root).innerHTML = '<p><span class="big">' + A.fmt(a) + ' ' + sym + ' ' + A.fmt(b) + '</span></p><p>' +
          (diff < 0 ? 'Every digit matches, so the numbers are equal.' : 'Start at the left. The first difference is in the <b>' + A.PLACES[4 - diff] + '</b> place: ' + sa.charAt(diff) + ' and ' + sb.charAt(diff) + '. On a number line, the greater number is further right.') + '</p>';
      }
      A.bind(root, ['nmca', 'nmcb'], cp);
      (function () {
        var pts = [5280, 3890, 5208, 4730], s = '<line x1="24" y1="50" x2="536" y2="50" style="stroke:var(--ink)" stroke-width="2"/>';
        for (var v = 3000; v <= 6000; v += 500) {
          var x = 24 + 512 * (v - 3000) / 3000;
          s += '<line x1="' + x + '" y1="43" x2="' + x + '" y2="57" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="78" text-anchor="middle" font-size="17">' + v + '</text>';
        }
        pts.forEach(function (p) {
          var x = 24 + 512 * (p - 3000) / 3000, up = p === 5280;
          s += '<circle cx="' + x + '" cy="50" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/><text x="' + (x + (p === 5208 ? -14 : p === 5280 ? 14 : 0)) + '" y="' + (up ? 16 : 34) + '" text-anchor="middle" font-size="17" class="tb">' + p + '</text>';
        });
        $('#nmofig', root).innerHTML = A.svg(560, 90, s, 'Number line from 3000 to 6000 with 3890, 4730, 5208 and 5280 marked from left to right');
      })();

      function rd() {
        var n = parseInt($('#nmrn', root).value, 10);
        if (isNaN(n) || n < 0) n = 0;
        if (n > 10000) n = 10000;
        var p = parseInt($('#nmrp', root).value, 10);
        var lo = Math.floor(n / p) * p, hi = lo + p, dg = Math.floor((n % p) / (p / 10)), res = n - lo >= p / 2 ? hi : lo;
        $('#nmrfig', root).innerHTML = hill(n, p, 'nmrw');
        var s = String(n), pi = s.length - 1 - Math.round(Math.log(p) / Math.LN10), shown = '';
        for (var i = 0; i < s.length; i++) {
          var ch = s.charAt(i);
          if (s.length > 4 && (s.length - i) % 3 === 0 && i) shown += ' ';
          shown += i === pi ? '<span style="outline:2px solid var(--accent);border-radius:3px;padding:0 2px">' + ch + '</span>' :
            i === pi + 1 ? '<span style="text-decoration:underline 3px var(--hi);text-underline-offset:4px">' + ch + '</span>' : ch;
        }
        var why = n === lo ? A.fmt(n) + ' is already a multiple of ' + A.fmt(p) + ', so it stays the same.' :
          'The digit to the right of the rounding place is <b>' + dg + '</b>. ' + (dg >= 5 ? '5 or more, so round <b>up</b>.' : 'Less than 5, so round <b>down</b>.');
        $('#nmrout', root).innerHTML = '<p><span class="big">' + (pi >= 0 ? shown : A.fmt(n)) + ' &#8776; ' + A.fmt(res) + '</span></p><p>' + why + '</p>' +
          (pi >= 0 ? '<p class="t2" style="font-size:.9rem">Boxed: the rounding place. Underlined: the digit that decides.</p>' : '<p class="t2" style="font-size:.9rem">This number is smaller than one ' + NM[p] + ', so it rounds to 0 or ' + A.fmt(p) + '.</p>');
      }
      A.bind(root, ['nmrn', 'nmrp'], rd);

      function hk(fromSelect) {
        if (fromSelect) $('#nmkn', root).value = $('#nmkp', root).value;
        var n = Math.max(0, Math.min(10000, parseInt($('#nmkn', root).value, 10) || 0));
        $('#nmkfig', root).innerHTML = grid10k(n);
        var sq = n / 100, frac = n >= 9500 ? 'almost all of 10 000' : n >= 4500 && n <= 5500 ? 'about half of 10 000' : n >= 2000 && n <= 3000 ? 'about a quarter of 10 000' : n >= 900 && n <= 1100 ? 'about a tenth of 10 000' : '';
        $('#nmkout', root).innerHTML = '<p><span class="big">' + A.fmt(n) + '</span> fills ' + (sq === Math.floor(sq) ? sq : 'between ' + Math.floor(sq) + ' and ' + Math.ceil(sq)) + ' of the 100 squares' + (frac ? ', ' + frac : '') + '.</p>';
      }
      $('#nmkp', root).addEventListener('change', function () { hk(true); });
      $('#nmkn', root).addEventListener('input', function () { hk(false); });
      hk(false);
    },

    quiz: [
      { q: 'What is the value of the digit 6 in <span class="math">3682</span>?', type: 'mc', options: ['6', '60', '600', '6000'], answer: 2,
        hint: 'Find the 6 in a place value chart. Which place is it in?', explain: 'The 6 is in the hundreds place, so it is worth 600.' },
      { q: 'What number do these blocks show?', type: 'num', answer: 2304, fig: A.draw.blocks(2304),
        hint: 'Count the big cubes, flats, rods and small cubes. There are no rods, so the tens digit is 0.', explain: '2 thousands, 3 hundreds, 0 tens, 4 ones: 2304.' },
      { q: 'Which number is <b>seven thousand fifty-nine</b>?', type: 'mc', options: ['759', '7590', '7059', '7509'], answer: 2,
        hint: 'Write the thousands digit, then three digits for the rest. There are no hundreds.', explain: 'Seven thousand is 7000 and fifty-nine is 059. Together: 7059.' },
      { q: 'Which is greater: <span class="math">4001</span> or <span class="math">3999</span>?', type: 'mc', options: ['4001', '3999', 'They are equal'], answer: 0,
        hint: 'Start at the left, in the thousands place.', explain: '4 thousands is more than 3 thousands, so 4001 is greater.' },
      { q: 'Round <span class="math">3650</span> to the nearest thousand.', type: 'mc', options: ['3000', '4000', '3700', '3600'], answer: 1, fig: hill(3650, 1000, 'nmq5'),
        hint: 'Is the yellow ball before the top of the hill or past it?', explain: 'The hundreds digit is 6, which is 5 or more, so round up to 4000.' },
      { q: 'How many hundreds are in <span class="math">5236</span>, counting all of them?', type: 'num', answer: 52,
        hint: 'Cover the last two digits.', explain: '5236 = 52 hundreds + 36. Covering the tens and ones digits leaves 52.' },
      { q: 'Which list is in order from least to greatest?', type: 'mc',
        options: ['8521, 5812, 8502', '5812, 8502, 8521', '5812, 8521, 8502', '8502, 5812, 8521'], answer: 1,
        hint: 'Start at the left. Compare the thousands first, then the tens.', explain: '5812 has 5 thousands, so it is least. 8502 &lt; 8521 because 0 tens &lt; 2 tens.' }
    ],

    practice: [
      { id: 'n4-value', name: 'Value of a digit', code: 'B1.1', gen: gen.value },
      { id: 'n4-blocks', name: 'Read blocks and disks', code: 'B1.1', gen: gen.blocks },
      { id: 'n4-forms', name: 'Expanded and standard form', code: 'B1.1', gen: gen.forms },
      { id: 'n4-words', name: 'Numbers in words', code: 'B1.1', gen: gen.words },
      { id: 'n4-compare', name: 'Compare and order', code: 'B1.2', gen: gen.compare },
      { id: 'n4-round', name: 'Round to 10, 100 or 1000', code: 'B1.3', gen: gen.round }
    ]
  });
})();
