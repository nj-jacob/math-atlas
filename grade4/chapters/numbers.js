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

  /* ---------- one idea at a time ---------- */
  var K = A.kit, M = window.Manip;
  /* place value disks in a 2 by 2 block: thousands and hundreds on top, tens and ones below */
  function disksFig(c) {
    var gap = 30, r = 13, colW = 150, s = '', rowsTop = Math.max(1, Math.ceil(c[3] / 4), Math.ceil(c[2] / 4)), rowsBot = Math.max(1, Math.ceil(c[1] / 4), Math.ceil(c[0] / 4));
    var topH = 38 + rowsTop * gap + 10, total = 0;
    [3, 2, 1, 0].forEach(function (q, i) {
      var x0 = (i % 2) * colW + 4, y0 = i < 2 ? 0 : topH;
      total += c[q] * Math.pow(10, q);
      s += '<rect x="' + x0 + '" y="' + (y0 + 2) + '" width="' + (colW - 10) + '" height="26" rx="8" style="fill:var(--p' + q + ')"/>' +
        '<text x="' + (x0 + (colW - 10) / 2) + '" y="' + (y0 + 21) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:' + (q ? '#fff' : '#2a211b') + '">' + c[q] + ' ' + (c[q] === 1 ? A.PLACE1[q] : A.PLACES[q]) + '</text>';
      for (var j = 0; j < c[q]; j++) s += A.draw.disk(x0 + 20 + (j % 4) * gap, y0 + 48 + Math.floor(j / 4) * gap, r, q);
    });
    return A.svg(2 * colW, topH + 38 + rowsBot * gap + 6, s, c[3] + ' thousands, ' + c[2] + ' hundreds, ' + c[1] + ' tens and ' + c[0] + ' ones: ' + total);
  }
  function cOf(n) { return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000)]; }
  function val(c) { return c[0] + 10 * c[1] + 100 * c[2] + 1000 * c[3]; }
  function expParts(n) {
    var parts = [], s = String(n);
    for (var k = 0; k < s.length; k++) { var p = s.length - 1 - k; if (s.charAt(k) !== '0') parts.push('<b class="c' + p + 't">' + A.fmt(+s.charAt(k) * Math.pow(10, p)) + '</b>'); }
    return parts.join(' + ') || '0';
  }
  /* two numbers lined up by place, with the compared place lit */
  function cmpCharts(a, b, upto) {
    var sa = ('0000' + a).slice(-5), sb = ('0000' + b).slice(-5), s = '';
    for (var i = 0; i < 5; i++) {
      var x = 30 + i * 100, p = 4 - i, on = i === upto, done = i < upto;
      s += '<rect x="' + (x - 4) + '" y="4" width="92" height="28" rx="8" style="fill:var(--p' + p + ')"/><text x="' + (x + 42) + '" y="24" text-anchor="middle" font-size="15" font-weight="700" style="fill:' + (p ? '#fff' : '#2a211b') + '">' + ['ones', 'tens', 'hund.', 'thous.', 'ten th.'][p] + '</text>';
      if (on) s += '<rect x="' + (x - 4) + '" y="38" width="92" height="104" rx="10" style="fill:color-mix(in srgb,var(--hi) 40%,transparent);stroke:var(--accent)" stroke-width="3"/>';
      [sa, sb].forEach(function (str, r) {
        var lead = str.slice(0, i + 1).replace(/0/g, '') === '' && i < 4;
        s += '<text x="' + (x + 42) + '" y="' + (78 + r * 50) + '" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display);fill:' + (lead ? 'var(--line)' : done ? 'var(--ink2)' : 'var(--ink)') + '">' + str.charAt(i) + '</text>';
      });
    }
    return A.svg(530, 150, s, A.fmt(a) + ' above ' + A.fmt(b) + ', lined up by place');
  }
  function firstDiff(a, b) { var sa = ('0000' + a).slice(-5), sb = ('0000' + b).slice(-5); for (var i = 0; i < 5; i++) if (sa.charAt(i) !== sb.charAt(i)) return i; return -1; }
  function T(name, lv) { return function () { return gen[name](lv); }; }

  var LESSONS = [
    { id: 'places', title: 'Places up to 10 000', sub: 'Each place is worth 10 of the place to its right.', concepts: [
      { id: 'ten-times', title: 'Each place is 10 times bigger', exp: ['B1.1'], skill: 'n4-blocks',
        body: '<p>Ten of one block make the next block. <b>10 ones</b> make a ten, <b>10 tens</b> make a hundred, <b>10 hundreds</b> make a thousand.</p>',
        watch: { tool: 'base10', opts: { o: 0 }, steps: [
          { say: 'Here are 10 one cubes.', act: function (t) { return t.add('o', 10, 120); } },
          { say: 'Ten ones slide together to make <b>1 ten</b>.', act: function (t) { return t.group('o'); } },
          { say: 'Add tens until there are 10 tens: 10, 20, 30 ... 100.', act: function (t) { return t.add('t', 9, 260); } },
          { say: 'Ten tens slide together to make <b>1 hundred</b>.', act: function (t) { return t.group('t'); } },
          { say: 'The pattern keeps going. <b>10 hundreds make 1 thousand.</b>', act: function (t) { return t.pulseCol('h'); }, ms: 1800 }
        ] },
        ways: [
          { label: 'The block stairs', html: '<div class="fig">' + stairs() + '</div><p>Each step up is <b>&times; 10</b>: 1, 10, 100, 1000, 10 000.</p>' },
          { label: 'With money', html: '<p>Ten $1 coins trade for a $10 bill. Ten $10 bills trade for a $100 bill. Ten $100 bills make $1000.</p><p>' + M.cashHtml(1000) + ' = ' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function () { return M.cashHtml(100); }).join('') + '</p>' }
        ],
        try: { tool: 'base10', opts: { controls: true, t: 8 }, tasks: [
          { do: 'Add tens until you have 10 tens. Then press <b>Group 10 tens</b>.', goal: function (s) { return s.h >= 1; }, yes: 'Yes. 10 tens became 1 hundred.' },
          { do: 'Press <b>Break a hundred</b>. How many tens do you get?', reset: false, goal: function (s) { return s.last === 'split-h'; }, yes: '10 tens. Still 100.' }
        ] },
        key: '<p><b>10 of a place make 1 of the next place to the left.</b></p>',
        check: [function () {
          var p = R.int(1, 3), o = R.mc(A.fmt(Math.pow(10, p)), [A.fmt(Math.pow(10, p - 1)), A.fmt(Math.pow(10, p + 1)), String(10 + Math.pow(10, p - 1))]);
          return { q: '10 ' + A.PLACES[p - 1] + ' make how much?', type: 'mc', options: o.options, answer: o.answer, hint: '10 of a place make 1 of the next place to the left.', explain: '10 ' + A.PLACES[p - 1] + ' make 1 ' + A.PLACE1[p] + ', which is ' + A.fmt(Math.pow(10, p)) + '.' };
        }, function () {
          var n = R.int(2, 9);
          return { q: 'How many hundreds make ' + n + ' thousand?', type: 'num', answer: n * 10, hint: '1 thousand is 10 hundreds.', explain: n + ' thousand is ' + n + ' &times; 10 = ' + n * 10 + ' hundreds.', steps: ['1 thousand = 10 hundreds.', n + ' thousands = ' + n + ' &times; 10 hundreds = ' + n * 10 + ' hundreds.'] };
        }] },

      { id: 'build', title: 'Build a number to 10 000', exp: ['B1.1'], skill: 'n4-value',
        body: '<p>A <b>place value chart</b> shows how many of each block a number has. The place of a digit decides what it is worth.</p>',
        watch: K.watch([
          ['Let\'s build 3245. Start with an empty chart.', chart(0, { cols: 4, vals: true })],
          ['3 thousands: worth 3000.', chart(3000, { cols: 4, vals: true })],
          ['2 hundreds: worth 200.', chart(3200, { cols: 4, vals: true })],
          ['4 tens: worth 40.', chart(3240, { cols: 4, vals: true })],
          ['5 ones: worth 5. The number is <b>3245</b>.', chart(3245, { cols: 4, vals: true }), 2000]
        ]),
        try: K.lab({ controls: [
          { id: 'th', label: 'Thousands', min: 0, max: 9, value: 2 }, { id: 'h', label: 'Hundreds', min: 0, max: 9, value: 4 },
          { id: 't', label: 'Tens', min: 0, max: 9, value: 1 }, { id: 'o', label: 'Ones', min: 0, max: 9, value: 3 }],
          render: function (s) { var n = s.th * 1000 + s.h * 100 + s.t * 10 + s.o; s.n = n; return { fig: chart(n, { cols: 4, vals: true }) + '<div class="fig">' + A.draw.blocks(n, null, 520) + '</div>', out: '<p><span class="big">' + A.fmt(n) + '</span> = <span class="math">' + expParts(n) + '</span></p>' }; },
          tasks: [
            { do: 'Build <b>5372</b>.', goal: function (s) { return s.n === 5372; }, yes: '5 thousands, 3 hundreds, 7 tens and 2 ones make 5372.' },
            { do: 'Build <b>8016</b>.', goal: function (s) { return s.n === 8016; }, yes: '8016: no hundreds, so the hundreds place shows 0.' },
            { do: 'Build the greatest number you can.', goal: function (s) { return s.n === 9999; }, yes: '9999. One more would be 10 000, which needs a new place.' }
          ] }),
        key: '<p>The <b>place</b> of a digit decides its value. In 3245, the 3 is worth <b>3000</b>.</p>',
        check: [T('value', 1), T('value', 2)] },

      { id: 'zero', title: 'Zero holds a place', exp: ['B1.1'], skill: 'n4-forms', hard: true,
        body: '<p>When a place is empty, we write a <b>0</b> there. The zero keeps the other digits in their places.</p>' + chart(4107, { vals: true }),
        watch: K.watch([
          ['Four thousand one hundred seven. Thousands: 4.', chart(4000, { cols: 4, vals: true })],
          ['Hundreds: 1.', chart(4100, { cols: 4, vals: true })],
          ['Tens: none. The tens place still gets a digit: <b>0</b>.', chart(4100, { cols: 4, vals: true, hl: 2 })],
          ['Ones: 7. We write <b>4107</b>, not 417.', chart(4107, { cols: 4, vals: true }), 2200]
        ]),
        ways: [
          { label: 'Count the digits', html: '<p>Any number from 1000 to 9999 has <b>4 digits</b>: thousands, hundreds, tens, ones. Write one digit for each place.</p><p class="math big">4 _ _ 7 &rarr; 4 1 0 7</p><p>417 has only 3 digits, so it is a much smaller number.</p>' },
          { label: 'With money', html: '<p>$4107 is four $1000 piles, one $100 bill, <b>no $10 bills</b>, and seven loonies.</p><p>$417 is far less: no $1000 piles at all.</p>' },
          { label: 'Say it in parts', html: '<div class="tbl"><table><thead><tr><th>We say</th><th>Th</th><th>H</th><th>T</th><th>O</th><th>We write</th></tr></thead><tbody>' +
            [[4107, 'four thousand one hundred seven'], [6030, 'six thousand thirty'], [9005, 'nine thousand five']].map(function (r) { var d = ('000' + r[0]).slice(-4); return '<tr><td>' + r[1] + '</td><td class="c3t"><b>' + d[0] + '</b></td><td class="c2t"><b>' + d[1] + '</b></td><td class="c1t"><b>' + d[2] + '</b></td><td class="c0t"><b>' + d[3] + '</b></td><td><b>' + r[0] + '</b></td></tr>'; }).join('') + '</tbody></table></div>' }
        ],
        key: '<p>An empty place gets a <b>0</b>. Every place needs a digit.</p>',
        mistake: '<p>Leaving out the zero: writing "four thousand one hundred seven" as <b>417</b>, or adding extra zeros: <b>4000107</b>. Ask: how many digits should a number in the thousands have?</p>',
        check: [T('words', 2), T('forms', 2)] }
    ] },

    { id: 'forms', title: 'Three ways to write a number', sub: 'Standard, expanded and word form.', concepts: [
      { id: 'expanded', title: 'Expanded form', exp: ['B1.1'], skill: 'n4-forms',
        body: '<p><b>Expanded form</b> shows what each digit is worth, added together. 5236 = 5000 + 200 + 30 + 6.</p>',
        watch: K.watch([
          ['5236. Each coloured digit drops to the value it stands for.', expanded(5236), 2600],
          ['A zero adds nothing: 7048 = 7000 + 40 + 8.', expanded(7048), 2600]
        ]),
        try: K.lab({ controls: [{ id: 'n', label: 'Slide to pick a number:', min: 1000, max: 9999, value: 4306, fmt: A.fmt }],
          render: function (s) { return { fig: expanded(s.n), out: '<p class="math">' + A.fmt(s.n) + ' = ' + expParts(s.n) + '</p>' }; },
          tasks: [
            { do: 'Find a number whose expanded form has exactly <b>2 parts</b>.', goal: function (s) { return String(s.n).replace(/0/g, '').length === 2; }, yes: function (s) { return A.fmt(s.n) + ' has two zeros, so only 2 parts.'; } },
            { do: 'Find a number with <b>6000 + 50</b> in it.', goal: function (s) { return Math.floor(s.n / 1000) === 6 && Math.floor(s.n / 10) % 10 === 5; }, yes: 'Yes: 6 thousands and 5 tens.' }
          ] }),
        key: '<p>Expanded form adds up the <b>value of each digit</b>. Skip the zeros.</p>',
        check: [T('forms', 1), T('forms', 3)] },

      { id: 'words', title: 'Word form', exp: ['B1.1'], skill: 'n4-words',
        body: '<p>Say the <b>thousands</b> first, then the rest, like a 3-digit number. 3045 is "three thousand forty-five".</p>',
        watch: K.watch([
          ['2 thousands: "two thousand".', chart(2000, { cols: 4 })],
          ['5 hundreds: "two thousand five hundred".', chart(2500, { cols: 4 })],
          ['6 tens and 8 ones: "two thousand five hundred sixty-eight".', chart(2568, { cols: 4 }), 2400]
        ]),
        try: K.lab({ controls: [{ id: 'n', label: 'Slide to pick a number:', min: 1000, max: 9999, value: 2568, fmt: A.fmt }],
          render: function (s) { return { fig: chart(s.n, { cols: 4 }), out: '<p class="big">' + words(s.n) + '</p>' }; },
          tasks: [
            { do: 'Find <b>four thousand twelve</b>.', goal: function (s) { return s.n === 4012; }, yes: '4012. The hundreds place is 0.' },
            { do: 'Find <b>seven thousand seven hundred</b>.', goal: function (s) { return s.n === 7700; }, yes: '7700.' }
          ] }),
        key: '<p>Read the thousands, then the hundreds, tens and ones. Do not say "and".</p>',
        mistake: '<p>Saying "and" inside a whole number ("three thousand and forty-five"). In math, "and" is saved for the decimal point.</p>',
        check: [T('words', 1), T('words', 3)] },

      { id: 'trade', title: 'Trade without changing the number', exp: ['B1.1'], skill: 'n4-blocks', hard: true,
        body: '<p>You can break a disk into <b>10 of the next smaller</b> disk. The parts change, but the number stays the same.</p>',
        watch: K.watch([
          ['1362: 1 thousand, 3 hundreds, 6 tens, 2 ones.', disksFig([2, 6, 3, 1])],
          ['Break the thousand into 10 hundreds.', disksFig([2, 6, 13, 0])],
          ['Now 13 hundreds, 6 tens and 2 ones. Still <b>1362</b>.', disksFig([2, 6, 13, 0]), 2200],
          ['Break a ten into 10 ones: 13 hundreds, 5 tens, 12 ones. Still 1362.', disksFig([12, 5, 13, 0]), 2400]
        ]),
        try: K.lab({ init: function (s) { s.c = [2, 6, 3, 1]; }, controls: [
          { id: 'b3', type: 'action', label: 'Break a thousand', act: function (s) { s.c[3]--; s.c[2] += 10; }, can: function (s) { return s.c && s.c[3] > 0 && s.c[2] <= 19; } },
          { id: 'b2', type: 'action', label: 'Break a hundred', act: function (s) { s.c[2]--; s.c[1] += 10; }, can: function (s) { return s.c && s.c[2] > 0 && s.c[1] <= 19; } },
          { id: 'b1', type: 'action', label: 'Break a ten', act: function (s) { s.c[1]--; s.c[0] += 10; }, can: function (s) { return s.c && s.c[1] > 0 && s.c[0] <= 19; } },
          { id: 'g0', type: 'action', label: 'Group 10 ones', act: function (s) { s.c[0] -= 10; s.c[1]++; }, can: function (s) { return s.c && s.c[0] >= 10; } },
          { id: 'g1', type: 'action', label: 'Group 10 tens', act: function (s) { s.c[1] -= 10; s.c[2]++; }, can: function (s) { return s.c && s.c[1] >= 10; } },
          { id: 'g2', type: 'action', label: 'Group 10 hundreds', act: function (s) { s.c[2] -= 10; s.c[3]++; }, can: function (s) { return s.c && s.c[2] >= 10; } }],
          render: function (s) { if (!s.c) return {}; return { fig: disksFig(s.c), out: '<p>' + [3, 2, 1, 0].filter(function (k) { return s.c[k]; }).map(function (k) { return '<b class="c' + k + 't">' + s.c[k] + ' ' + (s.c[k] === 1 ? A.PLACE1[k] : A.PLACES[k]) + '</b>'; }).join(' + ') + ' = <span class="big">' + A.fmt(val(s.c)) + '</span></p>' }; },
          tasks: [
            { do: 'Show 1362 with <b>no thousand disk</b>.', goal: function (s) { return s.c && s.c[3] === 0; }, yes: '13 hundreds, 6 tens, 2 ones. Still 1362.' },
            { do: 'Now show it with <b>more than 9 ones</b>.', goal: function (s) { return s.c && s.c[0] > 9; }, yes: 'The ones changed, but the number did not.' },
            { do: 'Group everything back so each place has 9 or fewer.', goal: function (s) { return s.c && s.c[3] === 1 && s.c[0] === 2; }, yes: 'Back to 1 thousand, 3 hundreds, 6 tens, 2 ones.' }
          ] }),
        ways: [
          { label: 'With money', html: '<p>$1362 could be one $1000 pile, three $100 bills, six $10 bills and two loonies. Or <b>136 ten-dollar bills and a toonie</b>. Same money.</p>' },
          { label: 'With numbers', html: '<p class="math">1000 + 300 + 60 + 2 = 1362</p><p class="math">1300 + 60 + 2 = 1362</p><p class="math">1300 + 50 + 12 = 1362</p>' }
        ],
        key: '<p>Trading 1 of a place for 10 of the next smaller place <b>does not change the number</b>.</p>',
        mistake: '<p>Thinking 13 hundreds is "13 hundred-dollar mistake" and not a real way to write 1300. Encourage trading with real or paper money.</p>',
        check: [T('blocks', 2), T('value', 3)] }
    ] },

    { id: 'compare', title: 'Compare and order', sub: 'Start at the left.', concepts: [
      { id: 'left', title: 'Start at the left', exp: ['B1.2'], skill: 'n4-compare',
        body: '<p>Line the numbers up by place. Compare from the <b>left</b>. The first place where the digits differ decides.</p>',
        watch: K.watch([
          ['Which is greater, 6482 or 6428? Line them up by place.', cmpCharts(6482, 6428, -1)],
          ['Thousands: 6 and 6. The same, so keep going.', cmpCharts(6482, 6428, 1)],
          ['Hundreds: 4 and 4. The same again.', cmpCharts(6482, 6428, 2)],
          ['Tens: 8 and 2. Different! 8 tens is more, so <b>6482 &gt; 6428</b>.', cmpCharts(6482, 6428, 3), 2400]
        ]),
        try: K.lab({ controls: [{ id: 'a', type: 'number', label: 'First number', min: 0, max: 10000, value: 4519 }, { id: 'b', type: 'number', label: 'Second number', min: 0, max: 10000, value: 4591 }],
          render: function (s) { var d = firstDiff(s.a, s.b); s.d = d; return { fig: cmpCharts(s.a, s.b, d) + cmpLine(s.a, s.b), out: '<p class="big">' + A.fmt(s.a) + ' ' + (s.a > s.b ? '&gt;' : s.a < s.b ? '&lt;' : '=') + ' ' + A.fmt(s.b) + '</p><p>' + (d < 0 ? 'Every digit matches.' : 'The first difference is in the <b>' + A.PLACES[4 - d] + '</b> place.') + '</p>' }; },
          tasks: [
            { do: 'Make two numbers that first differ in the <b>ones</b> place.', goal: function (s) { return s.d === 4; }, yes: 'Only the ones differ, so the ones decide.' },
            { do: 'Make the first number greater, even though its <b>ones digit is smaller</b>.', goal: function (s) { return s.a > s.b && s.a % 10 < s.b % 10; }, yes: 'Yes. A bigger place on the left matters more than the ones.' }
          ] }),
        key: '<p>Compare from the <b>left</b>. The first different digit decides.</p>',
        mistake: '<p>Comparing the last digits first: thinking 3999 &gt; 4001 because 9 &gt; 1. Have the child point to the leftmost place first.</p>',
        check: [T('compare', 1), T('compare', 2)] },

      { id: 'symbols', title: 'Greater than and less than', exp: ['B1.2'], skill: 'n4-compare',
        body: '<p>The symbol opens toward the <b>greater</b> number. <span class="math">7 &gt; 2</span> says "7 is greater than 2". <span class="math">2 &lt; 7</span> says "2 is less than 7".</p>',
        watch: K.watch([
          ['On a number line, greater numbers are further <b>right</b>.', cmpLine(3600, 5100)],
          ['5100 is right of 3600, so <b>5100 &gt; 3600</b>, and <b>3600 &lt; 5100</b>.', cmpLine(3600, 5100), 2400]
        ]),
        try: K.lab({ controls: [{ id: 'a', label: 'First:', min: 0, max: 10000, step: 100, value: 2400, fmt: A.fmt }, { id: 'b', label: 'Second:', min: 0, max: 10000, step: 100, value: 7100, fmt: A.fmt }],
          render: function (s) { return { fig: cmpLine(s.a, s.b), out: '<p class="big">' + A.fmt(s.a) + ' ' + (s.a > s.b ? '&gt;' : s.a < s.b ? '&lt;' : '=') + ' ' + A.fmt(s.b) + '</p>' }; },
          tasks: [
            { do: 'Make the sentence use <b>&gt;</b>.', goal: function (s) { return s.a > s.b; }, yes: 'The first number is further right, so it is greater.' },
            { do: 'Make the two numbers <b>equal</b>.', goal: function (s) { return s.a === s.b; }, yes: 'Same spot on the line: they are equal.' }
          ] }),
        key: '<p>The symbol <b>opens toward the greater number</b>.</p>',
        check: [T('compare', 1), T('compare', 2)] },

      { id: 'order', title: 'Put numbers in order', exp: ['B1.2'], skill: 'n4-compare',
        body: '<p>To order numbers from least to greatest, compare the thousands first. If two are tied, compare the hundreds, and so on.</p>',
        watch: K.watch([
          ['Order 5280, 3890, 5208 and 4730. Look at the thousands: 5, 3, 5, 4.', orderLine([5280, 3890, 5208, 4730], 0)],
          ['3890 is least, then 4730.', orderLine([5280, 3890, 5208, 4730], 2)],
          ['5280 and 5208 tie on thousands and hundreds. Tens: 0 &lt; 8, so 5208 comes first.', orderLine([5280, 3890, 5208, 4730], 4), 2600]
        ]),
        key: '<p>Order by comparing <b>from the left</b>, one place at a time.</p>',
        check: [T('compare', 3), T('compare', 3)] }
    ] },

    { id: 'round', title: 'Rounding', sub: 'Find the nearest friendly number.', concepts: [
      { id: 'hill', title: 'The rounding hill', exp: ['B1.3'], skill: 'n4-round',
        body: '<p>Picture a hill between two friendly numbers. Past the top, a number rolls <b>up</b>. Before the top, it rolls back <b>down</b>. Exactly at the top, it rounds up.</p>',
        watch: K.watch([
          ['Round 3200 to the nearest thousand. It sits between 3000 and 4000.', hill(3200, 1000, 'nmw1')],
          ['3200 is before the top, so it rolls down to <b>3000</b>.', hill(3200, 1000, 'nmw1'), 1600],
          ['Now 3700. It is past the top, so it rolls up to <b>4000</b>.', hill(3700, 1000, 'nmw1')],
          ['3500 is exactly at the top. It rounds <b>up</b> to 4000.', hill(3500, 1000, 'nmw1'), 2200]
        ]),
        try: K.lab({ controls: [{ id: 'n', label: 'Number:', min: 3000, max: 4000, step: 50, value: 3250, fmt: A.fmt }],
          render: function (s) { s.r = s.n - 3000 >= 500 ? 4000 : 3000; return { fig: hill(s.n, 1000, 'nmw2'), out: '<p class="big">' + A.fmt(s.n) + ' &#8776; ' + A.fmt(s.r) + '</p>' }; },
          tasks: [
            { do: 'Find a number that rounds <b>up</b> to 4000.', goal: function (s) { return s.r === 4000 && s.n < 4000; }, yes: 'It is past the top, so it rolls up.' },
            { do: 'Find the <b>smallest</b> number on this hill that rounds up.', goal: function (s) { return s.n === 3500; }, yes: '3500, exactly halfway, rounds up.' }
          ] }),
        key: '<p>Halfway or past: round <b>up</b>. Before halfway: round <b>down</b>.</p>',
        check: [T('round', 1), T('round', 1)] },

      { id: 'rule', title: 'The digit to the right decides', exp: ['B1.3'], skill: 'n4-round',
        body: '<p>Look at the digit just <b>right</b> of the rounding place. <b>5 or more: round up. Less than 5: round down.</b></p>',
        watch: K.watch([
          ['Round 3650 to the nearest hundred. The hundreds digit is 6.', hill(3650, 100, 'nmw3')],
          ['The digit to its right is 5. 5 or more, so round up: <b>3700</b>.', hill(3650, 100, 'nmw3'), 2000],
          ['To the nearest thousand: the digit right of the 3 is 6. Round up: <b>4000</b>.', hill(3650, 1000, 'nmw3'), 2400]
        ]),
        try: K.lab({ controls: [{ id: 'n', type: 'number', label: 'Number (0 to 10000)', min: 0, max: 10000, value: 4271 }, { id: 'p', type: 'select', label: 'Round to the nearest', options: [['10', 'ten'], ['100', 'hundred'], ['1000', 'thousand']] }],
          render: function (s) { var p = +s.p, lo = Math.floor(s.n / p) * p; s.r = s.n - lo >= p / 2 ? lo + p : lo; return { fig: hill(s.n, p, 'nmw4'), out: '<p class="big">' + A.fmt(s.n) + ' &#8776; ' + A.fmt(s.r) + '</p>' }; },
          tasks: [
            { do: 'Round <b>4271</b> to the nearest hundred.', goal: function (s) { return s.n === 4271 && s.p === '100'; }, yes: '7 is 5 or more, so 4271 rounds up to 4300.' },
            { do: 'Find a number that rounds to <b>6000</b> to the nearest thousand.', goal: function (s) { return s.p === '1000' && s.r === 6000; }, yes: function (s) { return A.fmt(s.n) + ' rounds to 6000.'; } }
          ] }),
        key: '<p><b>5 or more, round up. Less than 5, round down.</b></p>',
        check: [T('round', 2), T('round', 2)] },

      { id: 'carry', title: 'When rounding up carries over', exp: ['B1.3'], skill: 'n4-round', hard: true,
        body: '<p>Sometimes rounding up makes the next place grow. 2970 to the nearest hundred is <b>3000</b>.</p>',
        watch: K.watch([
          ['2970 to the nearest hundred. It is between 2900 and 3000.', hill(2970, 100, 'nmw5')],
          ['The tens digit is 7, so round up. 29 hundreds + 1 hundred = 30 hundreds = <b>3000</b>.', hill(2970, 100, 'nmw5'), 2600]
        ]),
        ways: [
          { label: 'Count by hundreds', html: '<p>Count up by hundreds from 2900: <b>2900, 3000</b>. The next hundred after 2900 is 3000, not 2100 or 21000.</p>' },
          { label: 'With disks', html: '<div class="fig">' + disksFig([0, 7, 9, 2]) + '</div><p>Rounding up adds 1 hundred to the 9 hundreds: 10 hundreds, which group into 1 more thousand. So 2 thousands become 3 thousands: <b>3000</b>.</p>' }
        ],
        key: '<p>If rounding up makes 10 in a place, <b>group it</b> into the next place.</p>',
        mistake: '<p>Writing 2970 &#8776; "21000" or "2100". Ask what the hundred after 2900 is.</p>',
        check: [T('round', 3), T('round', 3)] }
    ] },

    { id: 'big', title: 'How big is 10 000?', sub: 'Numbers in everyday life.', concepts: [
      { id: 'ten-thousand', title: '10 000 is 100 hundreds', exp: ['B1.1'], skill: 'n4-value',
        body: '<p>10 000 is <b>10 thousands</b>, or <b>100 hundreds</b>. In the picture each square is 100, and the whole picture is 10 000.</p>',
        watch: K.watch([
          ['One square is 100.', grid10k(100)],
          ['A row of 10 squares is 1000.', grid10k(1000)],
          ['Half the squares: 5000.', grid10k(5000)],
          ['All 100 squares: <b>10 000</b>.', grid10k(10000), 2000]
        ]),
        try: K.lab({ controls: [{ id: 'n', label: 'Number:', min: 0, max: 10000, step: 100, value: 1400, fmt: A.fmt }],
          render: function (s) { return { fig: grid10k(s.n), out: '<p><b>' + A.fmt(s.n) + '</b> fills ' + s.n / 100 + ' of 100 squares.</p>' }; },
          tasks: [
            { do: 'Show <b>half</b> of 10 000.', goal: function (s) { return s.n === 5000; }, yes: '5000 fills 50 squares: half.' },
            { do: 'There are 1440 minutes in a day. Show about that many.', goal: function (s) { return Math.abs(s.n - 1440) <= 60; }, yes: 'About 14 squares. A day is less than a sixth of 10 000 minutes.' }
          ] }),
        key: '<p><b>10 000 = 10 thousands = 100 hundreds.</b></p>',
        check: [function () { var t = R.int(1, 9); return { q: 'How many squares of 100 does ' + A.fmt(t * 1000) + ' fill?', type: 'num', answer: t * 10, fig: grid10k(t * 1000), hint: 'Each square is 100. Each row of 10 is 1000.', explain: A.fmt(t * 1000) + ' is ' + t * 10 + ' hundreds.', steps: ['Each row is 1000.', t + ' rows = ' + t * 10 + ' squares.'] }; }, T('value', 3)] }
    ] }
  ];
  function orderLine(pts, stage) {
    var sorted = pts.slice().sort(function (a, b) { return a - b; }), s = '<line x1="24" y1="70" x2="536" y2="70" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var v = 3000; v <= 6000; v += 500) { var x = 24 + 512 * (v - 3000) / 3000; s += '<line x1="' + x + '" y1="63" x2="' + x + '" y2="77" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="100" text-anchor="middle" font-size="18">' + v + '</text>'; }
    sorted.slice(0, stage).forEach(function (p, k) {
      var x = 24 + 512 * (p - 3000) / 3000;
      s += '<circle cx="' + x + '" cy="70" r="8" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/><text x="' + (x + (p === 5208 ? -18 : p === 5280 ? 18 : 0)) + '" y="' + (k % 2 ? 26 : 48) + '" text-anchor="middle" font-size="19" class="tb">' + p + '</text>';
    });
    s += '<text x="280" y="20" text-anchor="middle" font-size="18" class="t2">' + (stage ? 'least &rarr; greatest' : pts.join(', ')) + '</text>';
    return A.svg(560, 110, s, 'Number line from 3000 to 6000' + (stage ? ' with ' + sorted.slice(0, stage).join(', ') + ' placed' : ''));
  }


  A.register('numbers', {
    lessons: LESSONS,
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

  /* ---------- More ways to ask (question shapes; see docs/QUESTIONS.md) ----------
     Each skill keeps its first way of asking ("plain") and adds new shapes. Shapes unlock by level.
     q.meta holds the facts that tests/verify/grade4.js uses to work each answer out again. */
  var why = K.why, nm = A.Q && A.Q.name;
  function u(n, i) { var s = String(n); return s.slice(0, i) + '<u>' + s.charAt(i) + '</u>' + s.slice(i + 1); }
  function distinct4() { var d; do { d = [R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(1, 9)]; } while (new Set(d).size < 4); return d; }
  function num4(d) { return d[0] * 1000 + d[1] * 100 + d[2] * 10 + d[3]; }
  function valAt(n, i) { var s = String(n); return +s.charAt(i) * Math.pow(10, s.length - 1 - i); }
  function groupsOf(n) { var g = []; for (var p = 3; p >= 0; p--) { var d = Math.floor(n / Math.pow(10, p)) % 10; if (d) g.push({ p: p, n: d }); } return g; }
  function sumText(parts) { return parts.map(A.fmt).join(' + '); }
  var STORY = [['seats', 'The arena has', 'seats'], ['books', 'The library has', 'books'], ['people', 'The town has', 'people'], ['steps', 'Hana walked', 'steps today'], ['trees', 'A tree farm in Nova Scotia has', 'trees']];
  var SHAPES = {
    'n4-value': [
      [1, 'tap', function () {
        var d = distinct4(), n = num4(d), i = R.int(0, 3), val = valAt(n, i);
        return { q: 'Tap the digit that is worth <b>' + A.fmt(val) + '</b>.', type: 'tap', pic: K.digits(n), answer: String(i), answerText: 'the ' + d[i] + ' in the ' + A.PLACES[3 - i] + ' place',
          hint: A.fmt(val) + ' is ' + d[i] + ' ' + A.PLACES[3 - i] + '. Which digit is in the ' + A.PLACES[3 - i] + ' place?',
          steps: ['From the right, the places are ones, tens, hundreds, thousands.', 'The ' + A.PLACES[3 - i] + ' digit is ' + d[i] + '.'],
          explain: 'In ' + A.fmt(n) + ', the ' + d[i] + ' is in the ' + A.PLACES[3 - i] + ' place, so it is worth ' + A.fmt(val) + '.', meta: { k: 'n4-value-tap', n: n, val: val } };
      }],
      [1, 'story', function (lv) {
        var c = R.pick(STORY), d = distinct4(), n = num4(d), i = lv === 1 ? R.int(0, 1) : R.int(0, 3), val = valAt(n, i);
        return { q: c[1] + ' ' + A.fmt(n) + ' ' + c[2] + '. The <b>' + d[i] + '</b> in ' + A.fmt(n) + ' stands for how many ' + c[0] + '?', type: 'num', answer: val,
          fig: chart(n, { hl: i, dots: false }), hint: 'Find the place of the ' + d[i] + ' in the chart.',
          steps: ['The ' + d[i] + ' is in the ' + A.PLACES[3 - i] + ' place.', d[i] + ' ' + A.PLACES[3 - i] + ' = ' + A.fmt(val) + '.'],
          explain: 'The ' + d[i] + ' stands for ' + A.fmt(val) + ' ' + c[0] + '.', meta: { k: 'n4-value-num', n: n, i: i } };
      }],
      [2, 'mistake', function () {
        var d = distinct4(), n = num4(d), i = R.int(0, 2), p = 3 - i, val = valAt(n, i), who = nm();
        var truth = !R.int(0, 2), wrongP = p === 3 ? 2 : p + 1, said = truth ? val : d[i] * Math.pow(10, wrongP);
        var right = 'The ' + d[i] + ' is in the ' + A.PLACES[p] + ' place, so it is worth ' + A.fmt(val) + '.';
        return { q: who + ' says the <b>' + d[i] + '</b> in <span class="math">' + u(n, i) + '</span> is worth <b>' + A.fmt(said) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['A digit is always worth just itself.', 'The ' + d[i] + ' is in the ' + A.PLACES[wrongP] + ' place, so it is worth ' + A.fmt(d[i] * Math.pow(10, wrongP)) + '.', 'The biggest digit is always worth the most.']),
          hint: 'Name the place of the underlined digit first.', steps: [right], explain: right, meta: { k: 'n4-value-tf', n: n, i: i, said: said } };
      }],
      [2, 'match', function () {
        var pairs = [], seen = {};
        while (pairs.length < 3) {
          var d = distinct4(), n = num4(d), i = R.int(0, 3), val = valAt(n, i);
          if (seen[val] || seen['n' + n]) continue; seen[val] = seen['n' + n] = 1;
          pairs.push(['<span class="math">' + u(n, i) + '</span>', A.fmt(val)]);
        }
        return { q: 'Match each underlined digit to the value it stands for.', type: 'match', pairs: pairs,
          hint: 'For each number, name the place of the underlined digit.', steps: ['Ones are worth 1, tens 10, hundreds 100 and thousands 1000.'],
          explain: pairs.map(function (p) { return p[0].replace(/<[^>]+>/g, '') + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'n4-value-match', pairs: pairs } };
      }]
    ],
    'n4-blocks': [
      [1, 'build', function (lv) {
        var h = R.int(1, lv === 1 ? 4 : 8), t = R.int(10, 14), o = R.int(1, 9), n = h * 100 + t * 10 + o;
        return { q: 'Build the number that is <b>' + h + ' hundreds, ' + t + ' tens and ' + o + ' ones</b>. Trade 10 tens for a hundred if you like. Then press Check.', type: 'build', tool: 'base10', answer: n,
          hint: t + ' tens is more than 9 tens. 10 tens make 1 hundred.',
          steps: [t + ' tens = 1 hundred and ' + (t - 10) + ' tens.', 'So you have ' + (h + 1) + ' hundreds, ' + (t - 10) + ' tens and ' + o + ' ones.', 'That is ' + n + '.'],
          explain: h * 100 + ' + ' + t * 10 + ' + ' + o + ' = ' + n + '.', meta: { k: 'n4-blocks-build', h: h, t: t, o: o } };
      }],
      [1, 'tap', function () {
        var d = distinct4(), n = num4(d), alts = [num4([d[0], d[2], d[1], d[3]]), num4([d[0], d[1], d[3], d[2]]), num4([d[1], d[0], d[2], d[3]])];
        var set = R.shuffle([n].concat(R.shuffle(alts).slice(0, 2)));
        return { q: 'Which disks show <b>' + A.fmt(n) + '</b>? Tap them.', type: 'tap', tiles: set.map(function (v) { return A.draw.disks(groupsOf(v), 'Place value disks'); }), answer: set.indexOf(n), answerText: 'the disks with ' + d[0] + ' thousands, ' + d[1] + ' hundreds, ' + d[2] + ' tens and ' + d[3] + ' ones',
          hint: A.fmt(n) + ' has ' + d[0] + ' thousands and ' + d[1] + ' hundreds. Count those rows first.', steps: ['Count the disks in each row of each picture.', 'You need ' + d[0] + ', ' + d[1] + ', ' + d[2] + ' and ' + d[3] + ', from thousands down to ones.'],
          explain: A.fmt(n) + ' is ' + d[0] + ' thousands, ' + d[1] + ' hundreds, ' + d[2] + ' tens and ' + d[3] + ' ones.', meta: { k: 'n4-blocks-tap', n: n, set: set } };
      }],
      [2, 'fill', function (lv) {
        var th = R.int(1, 9), h = R.int(0, 9), t = R.int(0, 9), o = R.int(0, 9), n = th * 1000 + h * 100 + t * 10 + o;
        if (lv === 3) return { q: 'There are no more thousand cubes, so use flats instead. Fill in the blanks.', type: 'fill', fill: '<span class="math">' + A.fmt(n) + '</span> = [[]] thousands, [[]] hundreds, [[]] tens and [[]] ones', answers: [th - 1, h + 10, t, o],
          hint: 'Trade 1 thousand for 10 hundreds.', steps: ['One less thousand: ' + (th - 1) + '.', 'Ten more hundreds: ' + (h + 10) + '.'],
          explain: A.fmt((th - 1) * 1000) + ' + ' + A.fmt((h + 10) * 100) + ' + ' + t * 10 + ' + ' + o + ' = ' + A.fmt(n) + '.', meta: { k: 'n4-blocks-trade', n: n } };
        return { q: 'Fill in the blanks.', type: 'fill', fill: '<span class="math">' + A.fmt(n) + '</span> = [[]] thousands, [[]] hundreds, [[]] tens and [[]] ones', answers: [th, h, t, o],
          fig: chart(n, { dots: false }), hint: 'Read the digits from left to right. A place with 0 gets 0.', steps: ['The digits are ' + th + ', ' + h + ', ' + t + ' and ' + o + '.'],
          explain: A.fmt(n) + ' = ' + th + ' thousands, ' + h + ' hundreds, ' + t + ' tens and ' + o + ' ones.', meta: { k: 'n4-blocks-fill', n: n } };
      }],
      [2, 'mistake', function () {
        var c = [R.int(1, 9), 0, R.int(1, 9), R.int(1, 9)], who = nm();
        if (R.int(0, 1)) { c[1] = R.int(1, 9); c[2] = 0; }
        var n = num4(c), truth = !R.int(0, 2), noZero = +String(n).replace(/0/g, ''), said = truth ? n : noZero;
        var right = 'There are ' + c[0] + ' thousands, ' + c[1] + ' hundreds, ' + c[2] + ' tens and ' + c[3] + ' ones, so the disks show ' + A.fmt(n) + '.';
        return { q: who + ' says these disks show <b>' + A.fmt(said) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth, fig: A.draw.disks(groupsOf(n)),
          why: why(right, ['A place with no disks can be skipped.', 'Every disk is worth 1, so just count them.', 'The row with the most disks is the thousands.']),
          hint: 'Check every place. Is one place empty?', steps: [right], explain: right, meta: { k: 'n4-blocks-tf', n: n, said: said } };
      }]
    ],
    'n4-forms': [
      [1, 'fill', function (lv) {
        var d = [R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(1, 9)];
        if (lv >= 2) d[R.int(1, 3)] = 0;
        var n = num4(d), parts = digitsOf(n);
        return { q: 'Write <b>' + A.fmt(n) + '</b> in expanded form.' + (parts.length < 4 ? ' A place with 0 is left out.' : ''), type: 'fill', fill: '<span class="math">' + A.fmt(n) + '</span> = ' + parts.map(function () { return '[[]]'; }).join(' + '), answers: parts,
          hint: 'Write what each digit is worth, biggest first.', steps: parts.map(function (v) { return 'One part is ' + A.fmt(v) + '.'; }),
          explain: A.fmt(n) + ' = ' + sumText(parts) + '.', meta: { k: 'n4-forms-fill', n: n } };
      }],
      [1, 'match', function () {
        var d = distinct4(), base = [num4(d), num4([d[0], d[1], d[3], d[2]]), num4([d[0], d[2], d[1], d[3]])];
        var pairs = base.map(function (n) { return [sumText(digitsOf(n)), A.fmt(n)]; });
        return { q: 'Match each expanded form to its number.', type: 'match', pairs: pairs,
          hint: 'The parts look alike. Check the hundreds, tens and ones parts.', steps: ['Add the parts of each one.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'n4-forms-match', pairs: pairs } };
      }],
      [2, 'pick', function () {
        var d; do { d = distinct4(); } while (d[0] < 2);
        var n = num4(d);
        var good = [sumText(digitsOf(n)), sumText([(d[0] - 1) * 1000, (d[1] + 10) * 100, d[2] * 10 + d[3]]), sumText([d[0] * 1000, d[1] * 100 + d[2] * 10, d[3]])];
        var bad = [sumText([d[0] * 1000, d[1] * 100, d[2], d[3] * 10]), sumText([d[0] * 100, d[1] * 1000, d[2] * 10, d[3]]), sumText([d[0] * 1000, d[1] * 10, d[2] * 100, d[3]])];
        var opts = R.shuffle(good.slice(0, 2).concat(R.pick([[good[2]], []])).concat(bad.slice(0, 2)));
        var ans = opts.map(function (o, j) { return good.indexOf(o) >= 0 ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every sum that equals <b>' + A.fmt(n) + '</b>.', type: 'pick', options: opts, answer: ans,
          hint: 'Add each one up. Parts can be grouped in different ways and still make the same number.', steps: ['Work out each sum.', 'Pick the ones that make ' + A.fmt(n) + '.'],
          explain: 'These make ' + A.fmt(n) + ': ' + ans.map(function (j) { return opts[j]; }).join('; ') + '.', meta: { k: 'n4-forms-pick', n: n } };
      }],
      [2, 'story', function () {
        var who = nm(), d = [R.int(1, 9), R.int(0, 9), R.int(1, 9), R.int(1, 9)];
        return { q: who + ' has ' + d[0] + ' boxes of 1000 stickers, ' + d[1] + ' packs of 100, ' + d[2] + ' strips of 10 and ' + d[3] + ' single stickers. How many stickers is that?', type: 'num', answer: num4(d),
          hint: 'Each box is a thousand, each pack a hundred and each strip a ten.', steps: [sumText([d[0] * 1000, d[1] * 100, d[2] * 10, d[3]]) + '.', 'Put one digit in each place: ' + A.fmt(num4(d)) + '.'],
          explain: who + ' has ' + A.fmt(num4(d)) + ' stickers.', meta: { k: 'n4-forms-story', d: d } };
      }]
    ],
    'n4-words': [
      [1, 'match', function () {
        var pairs = [], seen = {};
        while (pairs.length < 3) { var n = R.int(1, 9) * 1000 + R.pick([0, R.int(1, 9)]) * 100 + R.int(1, 99); if (seen[n]) continue; seen[n] = 1; pairs.push([words(n), A.fmt(n)]); }
        return { q: 'Match each number in words to its digits.', type: 'match', pairs: pairs,
          hint: 'Read the thousands first, then the last three digits.', steps: ['After the thousands there are always three more digits. Use 0 for an empty place.'],
          explain: pairs.map(function (p) { return p[0] + ' is ' + p[1]; }).join('. ') + '.', meta: { k: 'n4-words-match', pairs: pairs } };
      }],
      [1, 'tap', function () {
        var th = R.int(1, 9), h = R.int(1, 9), o = R.int(1, 9), n = th * 1000 + h * 100 + o;
        var set = R.shuffle([n, th * 1000 + h * 10 + o, th * 100 + h * 10 + o, th * 1000 + h * 100 + o * 10].filter(function (v, i, a) { return a.indexOf(v) === i; }));
        return { q: 'Tap the number <b>' + words(n) + '</b>.', type: 'tap', tiles: set.map(function (v) { return '<span class="math">' + A.fmt(v) + '</span>'; }), answer: set.indexOf(n), answerText: A.fmt(n),
          hint: 'There are no tens. Which place needs a 0?', steps: ['Thousands: ' + th + '. Hundreds: ' + h + '. Tens: 0. Ones: ' + o + '.'],
          explain: words(n) + ' is ' + A.fmt(n) + '.', meta: { k: 'n4-words-tap', set: set } };
      }],
      [2, 'mistake', function () {
        var n = R.int(1, 9) * 1000 + R.int(1, 9) * 10 + R.int(1, 9), who = nm(), truth = !R.int(0, 2), said = truth ? n : +String(n).replace(/0/g, '');
        var right = 'There are no hundreds, so a 0 holds the hundreds place: ' + A.fmt(n) + '.';
        return { q: who + ' writes <b>' + words(n) + '</b> as <span class="math">' + A.fmt(said) + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['You only write the digits you say out loud.', 'Thousands always come last.', 'You write a 0 for every word.']),
          hint: 'Does every place have a digit?', steps: [right], explain: right, meta: { k: 'n4-words-tf', n: n, said: said } };
      }],
      [3, 'order', function () {
        var nums = [];
        while (nums.length < 4) { var v = R.int(2, 8) * 1000 + R.int(0, 9) * 100 + R.int(1, 99); if (nums.indexOf(v) < 0) nums.push(v); }
        nums.sort(function (a, b) { return a - b; });
        return { q: 'Put these in order from <b>least to greatest</b>.', type: 'order', items: nums.map(words), first: 'least', last: 'greatest',
          hint: 'Write each one in digits first.', steps: nums.map(function (v) { return words(v) + ' = ' + A.fmt(v) + '.'; }),
          explain: 'In order: ' + nums.map(A.fmt).join(', ') + '.', meta: { k: 'n4-words-order' } };
      }]
    ],
    'n4-compare': [
      [1, 'line', function (lv) {
        var lo = R.int(1, 8) * 1000, n = lo + R.int(1, 9) * 100 + (lv === 3 ? R.pick([0, 50]) : 0);
        return { q: 'Place <b>' + A.fmt(n) + '</b> on the number line.', type: 'line', min: lo, max: lo + 1000, tick: 100, every: 500, snap: lv === 3 ? 50 : 100, answer: n, tol: 0,
          hint: 'Each small step is 100. Count on from ' + A.fmt(lo) + '.', steps: [A.fmt(n) + ' is ' + A.fmt(n - lo) + ' more than ' + A.fmt(lo) + '.', 'Count ' + Math.round((n - lo) / 100) + ' steps of 100.'],
          explain: A.fmt(n) + ' sits ' + A.fmt(n - lo) + ' past ' + A.fmt(lo) + '.', meta: { k: 'n4-cmp-line' } };
      }],
      [1, 'order', function (lv) {
        var th = R.int(1, 8) * 1000, nums = [];
        while (nums.length < 4) { var v = (lv === 1 ? R.int(1, 9) * 1000 : th) + R.int(0, 9) * 100 + R.int(0, 99); if (nums.indexOf(v) < 0) nums.push(v); }
        var big = lv > 1 && !R.int(0, 1);
        nums.sort(function (a, b) { return big ? b - a : a - b; });
        return { q: 'Put these numbers in order from <b>' + (big ? 'greatest to least' : 'least to greatest') + '</b>.', type: 'order', items: nums.map(A.fmt), first: big ? 'greatest' : 'least', last: big ? 'least' : 'greatest',
          hint: 'Compare the thousands first. If they match, compare the hundreds.', steps: ['Line the numbers up by place.', 'Order: ' + nums.map(A.fmt).join(', ') + '.'],
          explain: 'In order: ' + nums.map(A.fmt).join(', ') + '.', meta: { k: 'n4-cmp-order', big: big } };
      }],
      [2, 'story', function () {
        var t = A.Q.two(), a = R.int(1000, 9999), b = a + R.pick([-1, 1]) * R.int(1, 9) * R.pick([10, 100]);
        if (b > 9999 || b < 1000) b = a - 90;
        var less = !R.int(0, 1), o = { options: [t[0], t[1]], answer: (less ? a < b : a > b) ? 0 : 1 };
        return { q: t[0] + ' read <b>' + A.fmt(a) + '</b> pages this year. ' + t[1] + ' read <b>' + A.fmt(b) + '</b> pages. Who read <b>' + (less ? 'fewer' : 'more') + '</b> pages?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Compare from the left. Find the first place where the digits differ.', steps: [A.fmt(Math.max(a, b)) + ' &gt; ' + A.fmt(Math.min(a, b)) + '.'],
          explain: o.options[o.answer] + ' read ' + (less ? 'fewer' : 'more') + ' pages.', meta: { k: 'n4-cmp-story', a: a, b: b, less: less } };
      }],
      [2, 'pick', function () {
        var x = R.int(2, 8) * 1000 + R.int(1, 8) * 100 + R.int(10, 89), less = !R.int(0, 1), opts = [x - R.pick([1, 10, 100]), x + R.pick([1, 10, 100])];
        R.shuffle([x + 1000, x - 1000, x + 20, x - 20, x + 200, x - 200, +String(x).split('').reverse().join('')]).forEach(function (v) { if (opts.length < 5 && v >= 1000 && v <= 9999 && opts.indexOf(v) < 0 && v !== x) opts.push(v); });
        opts = R.shuffle(opts);
        var ans = opts.map(function (v, j) { return (less ? v < x : v > x) ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every number that is <b>' + (less ? 'less' : 'greater') + ' than ' + A.fmt(x) + '</b>.', type: 'pick', options: opts.map(A.fmt), answer: ans,
          hint: 'Compare each one with ' + A.fmt(x) + ', starting at the left.', steps: ['Look for the first place where the digits differ.'],
          explain: 'These are ' + (less ? 'less' : 'greater') + ' than ' + A.fmt(x) + ': ' + ans.map(function (j) { return A.fmt(opts[j]); }).join(', ') + '.', meta: { k: 'n4-cmp-pick', x: x, less: less, opts: opts } };
      }]
    ],
    'n4-round': [
      [1, 'line', function (lv) {
        var p = lv === 1 ? 100 : R.pick([100, 1000]), n = lv === 1 ? R.int(101, 999) : R.int(1001, 9999);
        if (n % p === 0) n += p / 10 * 3;
        var lo = Math.floor(n / p) * p, ans = n - lo >= p / 2 ? lo + p : lo;
        return { q: 'Round <b>' + A.fmt(n) + '</b> to the nearest ' + NM[p] + '. Place your answer on the line.', type: 'line', min: lo, max: lo + p, tick: p / 10, every: p / 2, snap: p / 10, answer: ans, tol: 0,
          fig: hill(n, p, 'nmrl'), hint: 'Is ' + A.fmt(n) + ' before the halfway mark, ' + A.fmt(lo + p / 2) + ', or past it?',
          steps: [A.fmt(n) + ' is between ' + A.fmt(lo) + ' and ' + A.fmt(lo + p) + '.', 'Halfway is ' + A.fmt(lo + p / 2) + '. ' + (ans > lo ? A.fmt(n) + ' is at or past halfway, so it rounds up.' : A.fmt(n) + ' is before halfway, so it rounds down.')],
          explain: A.fmt(n) + ' rounds to ' + A.fmt(ans) + '.', meta: { k: 'n4-round-line', n: n, p: p } };
      }],
      [1, 'mistake', function (lv) {
        var p = lv === 1 ? 100 : R.pick([100, 1000]), n = R.int(1001, 9999), who = nm();
        if (n % p === 0) n += p / 10 * 4;
        var lo = Math.floor(n / p) * p, ans = n - lo >= p / 2 ? lo + p : lo, truth = !R.int(0, 1), said = truth ? ans : (ans === lo ? lo + p : lo);
        var dg = Math.floor(n % p / (p / 10)), right = 'The digit after the ' + NM[p] + 's place is ' + dg + ', so ' + A.fmt(n) + ' rounds ' + (ans > lo ? 'up' : 'down') + ' to ' + A.fmt(ans) + '.';
        return { q: who + ' says <b>' + A.fmt(n) + '</b> rounded to the nearest ' + NM[p] + ' is <b>' + A.fmt(said) + '</b>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['You always round down.', 'You always round up.', 'Look at the ones digit only.']),
          hint: 'Look at the digit just to the right of the ' + NM[p] + 's place.', steps: [right], explain: right, meta: { k: 'n4-round-tf', n: n, p: p, said: said } };
      }],
      [2, 'match', function (lv) {
        var p = lv === 3 ? 1000 : 100, pairs = [], seen = {};
        while (pairs.length < 3) { var n = R.int(1001, 9899); if (n % p === 0) continue; var r = H4round(n, p); if (seen[r]) continue; seen[r] = 1; pairs.push([A.fmt(n), A.fmt(r)]); }
        return { q: 'Match each number to the nearest ' + NM[p] + '.', type: 'match', pairs: pairs,
          hint: 'Look at the digit just to the right of the ' + NM[p] + 's place: 5 or more rounds up.', steps: ['Round each one, then match.'],
          explain: pairs.map(function (q) { return q[0] + ' rounds to ' + q[1]; }).join('. ') + '.', meta: { k: 'n4-round-match', p: p, pairs: pairs } };
      }],
      [3, 'story', function () {
        var c = R.pick([['people came to the Canada Day fireworks', 'people'], ['fans watched the hockey game', 'fans'], ['cars crossed the bridge today', 'cars']]), n = R.int(1001, 9999);
        if (n % 1000 === 0) n += 321;
        return { q: '<b>' + A.fmt(n) + '</b> ' + c[0] + '. Round to the nearest thousand. About how many ' + c[1] + ' is that?', type: 'num', answer: H4round(n, 1000),
          hint: 'Look at the hundreds digit.', steps: ['The thousands on either side are ' + A.fmt(Math.floor(n / 1000) * 1000) + ' and ' + A.fmt(Math.floor(n / 1000) * 1000 + 1000) + '.', 'The hundreds digit is ' + Math.floor(n % 1000 / 100) + '.'],
          explain: 'About ' + A.fmt(H4round(n, 1000)) + ' ' + c[1] + '.', meta: { k: 'n4-round-story', n: n } };
      }]
    ]
  };
  function H4round(n, p) { var lo = Math.floor(n / p) * p; return n - lo >= p / 2 ? lo + p : lo; }
  Atlas.Q.shapes('numbers', SHAPES);
})();
