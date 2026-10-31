(function () {
  var A = Atlas, M = window.Manip;
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
  var names = A.PLACES.slice().reverse();
  var heads = ['Hundred thousands', 'Ten thousands', 'Thousands', 'Hundreds', 'Tens', 'Ones'];
  var shortH = ['Hund. thous.', 'Ten thous.', 'Thous.', 'Hund.', 'Tens', 'Ones'];
  var R = A.R;

  /* small unlabelled disks in a 3 by 3 grid, for the inside of a chart column */
  function dots(d, p) {
    if (!d) return '';
    var s = '';
    for (var i = 0; i < d; i++) s += A.draw.disk(7 + (i % 3) * 13, 7 + Math.floor(i / 3) * 13, 5.5, p);
    return A.svg(40, 40, s, d + ' disk' + (d > 1 ? 's' : ''));
  }
  /* place value chart: coloured headings, the digit, disks for the digit, and its value.
     o.cols columns (default: just the digits of n), o.hl highlights one column, o.vals shows values */
  function chart(n, o) {
    o = o || {};
    var s = String(n), cols = o.cols || s.length;
    while (s.length < cols) s = '0' + s;
    var lead = cols - String(n).length, h = '<div class="pv"' + (cols < 6 ? ' style="max-width:' + (cols * 92) + 'px;margin:8px auto"' : '') + '>';
    for (var i = 0; i < cols; i++) {
      var p = cols - 1 - i, d = +s.charAt(i), dim = i < lead;
      h += '<div' + (i === o.hl ? ' class="on"' : '') + '><span class="h c' + p + '"><span class="lg">' + heads[5 - p] + '</span><span class="sm">' + shortH[5 - p] + '</span></span><span class="d' + (dim ? ' dim' : '') + '">' + d + '</span>' +
        (o.dots === false ? '' : '<span class="dk">' + (dim ? '' : dots(d, p)) + '</span>') +
        (o.vals ? '<span class="v">' + (dim || !d ? '' : A.fmt(d * Math.pow(10, p))) + '</span>' : '') + '</div>';
    }
    return h + '</div>';
  }
  /* the number in big coloured digits, split into the thousands period and the ones period, with the words for each */
  function periods(n) {
    var s = String(n), len = s.length, th = Math.floor(n / 1000), on = n % 1000, out = '', cw = 30;
    var thS = th ? String(th) : '', onS = th ? ('00' + on).slice(-3) : String(on);
    function digits(str, cx, pTop) {
      var x = cx - str.length * cw / 2, h = '';
      for (var i = 0; i < str.length; i++) h += '<text x="' + (x + cw * (i + 0.5)) + '" y="50" text-anchor="middle" font-size="46" font-weight="800" style="font-family:var(--display);fill:var(--p' + (pTop - i) + ')">' + str.charAt(i) + '</text>';
      return h;
    }
    function brace(cx, wid, sub) {
      var x1 = cx - wid / 2, x2 = cx + wid / 2;
      return '<path d="M' + x1 + ' 62 q0 9 9 9 H' + (cx - 8) + ' q8 0 8 9 q0 -9 8 -9 H' + (x2 - 9) + ' q9 0 9 -9" fill="none" style="stroke:var(--ink2)" stroke-width="2"/>' +
        '<text x="' + cx + '" y="100" text-anchor="middle" font-size="16" class="t2">' + sub + '</text>';
    }
    var onWords = th && !on ? '(say nothing for 000)' : b1000(on) || 'zero';
    if (th) {
      out += digits(thS, 200, len - 1) + digits(onS, 360, 2) + brace(200, thS.length * cw, 'thousands period') + brace(360, 3 * cw, 'ones period');
      out += '<text x="272" y="130" text-anchor="end" font-size="15" font-weight="700">' + b1000(th) + ' thousand</text>' +
        '<text x="288" y="130" font-size="15" font-weight="700"' + (on ? '' : ' class="t2"') + '>' + onWords + '</text>';
    } else {
      out += digits(onS, 280, len - 1) + brace(280, len * cw, 'ones period') + '<text x="280" y="130" text-anchor="middle" font-size="16" font-weight="700">' + onWords + '</text>';
    }
    return A.svg(560, 140, out, A.fmt(n) + ' is read ' + words(n));
  }
  /* each digit drops down to the value it stands for */
  function expanded(n) {
    var s = String(n), len = s.length, cw = Math.min(110, 540 / len), x0 = 280 - cw * len / 2, out = '';
    out += '<defs><marker id="pvah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    for (var i = 0; i < len; i++) {
      var p = len - 1 - i, d = +s.charAt(i), cx = x0 + cw * (i + 0.5), val = d * Math.pow(10, p);
      out += '<text x="' + cx + '" y="44" text-anchor="middle" font-size="42" font-weight="800" style="font-family:var(--display);fill:var(--p' + p + ')">' + d + '</text>' +
        '<line x1="' + cx + '" y1="54" x2="' + cx + '" y2="84" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#pvah)"/>' +
        '<rect x="' + (cx - cw / 2 + 8) + '" y="90" width="' + (cw - 16) + '" height="36" rx="8" style="fill:' + (d ? 'color-mix(in srgb,var(--p' + p + ') 16%,var(--card))' : 'var(--card)') + ';stroke:var(--p' + p + ')" stroke-width="2.5"' + (d ? '' : ' stroke-dasharray="5 4"') + '/>' +
        '<text x="' + cx + '" y="114" text-anchor="middle" font-size="' + (cw < 100 ? 15 : 17) + '" font-weight="700"' + (d ? '' : ' class="t2"') + '>' + A.fmt(val) + '</text>' +
        '<text x="' + cx + '" y="148" text-anchor="middle" font-size="' + (cw >= 100 ? 15 : 13) + '" class="t2">' + A.PLACES[p] + '</text>';
      if (i < len - 1) out += '<text x="' + (cx + cw / 2) + '" y="114" text-anchor="middle" font-size="18" font-weight="700">+</text>';
    }
    return A.svg(560, 154, out, A.fmt(n) + ' in expanded form');
  }
  /* a hill over a number line: halfway is the top, and the number rolls to the side it is on */
  function hill(n, p) {
    var lo = Math.floor(n / p) * p, hi = lo + p, t = (n - lo) / p, up = n - lo >= p / 2;
    var x = 40 + 480 * t, y = 100 - 150 * t * (1 - t), s = '';
    s += '<path d="M40 100 Q280 -50 520 100" fill="none" style="stroke:var(--line)" stroke-width="10" stroke-linecap="round"/>';
    s += '<line x1="280" y1="25" x2="280" y2="132" style="stroke:var(--ink2)" stroke-dasharray="4 4" stroke-width="1.5"/>';
    s += '<line x1="40" y1="132" x2="520" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var i = 0; i <= 10; i++) { var tx = 40 + 48 * i; s += '<line x1="' + tx + '" y1="' + (i % 5 ? 126 : 122) + '" x2="' + tx + '" y2="' + (i % 5 ? 138 : 142) + '" style="stroke:var(--ink)" stroke-width="2"/>'; }
    [[40, lo, 'lower'], [280, lo + p / 2, 'halfway'], [520, hi, 'upper']].forEach(function (k) {
      s += '<text x="' + k[0] + '" y="164" text-anchor="middle" font-size="17" class="tb">' + A.fmt(k[1]) + '</text><text x="' + k[0] + '" y="184" text-anchor="middle" class="t2" font-size="15">' + k[2] + '</text>';
    });
    if (n !== lo) {
      var ex = up ? 500 : 60;
      s += '<path d="M' + x + ' ' + (y - 16) + ' Q' + ((x + ex) / 2) + ' ' + (Math.min(y, 80) - 30) + ' ' + ex + ' 86" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#rha)"/>';
    }
    s = '<defs><marker id="rha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>' + s;
    s += '<circle cx="' + (n === lo ? 40 : up ? 520 : 40) + '" cy="132" r="11" style="fill:none;stroke:var(--accent)" stroke-width="4"/>';
    s += '<circle cx="' + x + '" cy="' + (y - 9) + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    s += '<text x="' + Math.min(Math.max(x, 60), 500) + '" y="' + (y - 26) + '" text-anchor="middle" font-size="15" class="tb">' + A.fmt(n) + '</text>';
    return A.svg(560, 192, s, A.fmt(n) + ' on a hill between ' + A.fmt(lo) + ' and ' + A.fmt(hi) + '. It rounds to ' + A.fmt(n === lo ? lo : up ? hi : lo) + '.');
  }
  /* every place is 10 of the place to its right: blocks from 1 to 100 000 */
  function stairs() {
    var P = A.draw.prism, s = '', k = 0.42;
    s += '<defs><marker id="sta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    function arrow(x1, x2, y) {
      return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" style="stroke:var(--ink2)" stroke-width="2" marker-end="url(#sta)"/>' +
        '<text x="' + ((x1 + x2) / 2) + '" y="' + (y - 8) + '" text-anchor="middle" font-size="16" class="tb">&times; 10</text>';
    }
    function lab(x, y, a, b, p) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--p' + p + ')">' + a + '</text>' +
        '<text x="' + x + '" y="' + (y + 19) + '" text-anchor="middle" font-size="15" class="t2">' + b + '</text>';
    }
    /* row 1: small cube, rod, flat, big cube */
    var u = 6, base = 92;
    s += P(30, base, u, u, u, 1, 1, 1, 0) + lab(33, base + 24, '1', 'one', 0) + arrow(48, 96, base - 20);
    s += P(110, base, u, u, 10 * u, 1, 1, 10, 1) + lab(113, base + 24, '10', 'ten', 1) + arrow(132, 186, base - 20);
    s += P(200, base, 10 * u, u, 10 * u, 10, 1, 10, 2) + lab(230, base + 24, '100', 'hundred', 2) + arrow(276, 340, base - 20);
    s += P(356, base, 10 * u, 10 * u, 10 * u, 10, 10, 10, 3) + lab(386 + 12, base + 24, '1000', 'thousand', 3);
    /* row 2: the same shapes again, built from thousand cubes */
    var v = 17, b2 = 372;
    s += '<line x1="20" y1="138" x2="540" y2="138" style="stroke:var(--line)" stroke-dasharray="4 4"/><text x="280" y="160" text-anchor="middle" font-size="16" class="tb">The shapes repeat, built from thousand cubes.</text>';
    s += P(30, b2, v, v, v, 1, 1, 1, 3) + lab(37, b2 + 24, '1000', 'thousand', 3) + arrow(60, 110, b2 - 40);
    s += P(126, b2, v, v, 10 * v, 1, 1, 10, 4) + lab(134, b2 + 24, '10 000', 'ten thousand', 4) + arrow(158, 224, b2 - 40);
    s += P(244, b2, 10 * v, v, 10 * v, 10, 1, 10, 5) + lab(244 + 85, b2 + 24, '100 000', 'hundred thousand', 5);
    s += '<text x="478" y="' + (b2 - 120) + '" text-anchor="middle" font-size="15" class="t2">10 of these</text><text x="478" y="' + (b2 - 101) + '" text-anchor="middle" font-size="15" class="t2">make</text><text x="478" y="' + (b2 - 82) + '" text-anchor="middle" font-size="15" class="t2">1 000 000</text>';
    return A.svg(560, 420, s, 'Base-ten blocks. 1 small cube is one. 10 make a rod, which is ten. 10 rods make a flat, which is a hundred. 10 flats make a big cube, which is a thousand. Then the shapes repeat with thousand cubes: 10 make ten thousand, and 100 make a hundred thousand.');
  }
  /* small pictures for the everyday numbers */
  var icons = {
    arena: '<svg viewBox="0 0 44 44" aria-hidden="true"><ellipse cx="22" cy="22" rx="20" ry="14" fill="none" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="3 2.5"/><ellipse cx="22" cy="22" rx="13" ry="8" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--strand)" stroke-width="2"/><line x1="22" y1="14" x2="22" y2="30" style="stroke:var(--strand)" stroke-width="1.5"/></svg>',
    steps: '<svg viewBox="0 0 44 44" aria-hidden="true"><g style="fill:var(--strand)"><ellipse cx="14" cy="30" rx="5" ry="8"/><circle cx="14" cy="18" r="3"/><ellipse cx="30" cy="18" rx="5" ry="8"/><circle cx="30" cy="6" r="3"/></g></svg>',
    globe: '<svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--strand)" stroke-width="2"/><ellipse cx="22" cy="22" rx="8" ry="19" fill="none" style="stroke:var(--strand)" stroke-width="1.5"/><line x1="3" y1="22" x2="41" y2="22" style="stroke:var(--hi)" stroke-width="3"/></svg>'
  };
  /* 100 squares, each worth 1000, filled up to n */
  function hundredK(n) {
    var sz = 26, s = '', full = Math.floor(n / 1000), part = (n % 1000) / 1000;
    for (var i = 0; i < 100; i++) {
      var x = 62 + (i % 10) * sz, y = 6 + Math.floor(i / 10) * sz;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:var(--card);stroke:var(--line)" stroke-width="1"/>';
      if (i < full) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (sz - 3) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--strand)"/>';
      else if (i === full && part > 0) s += '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + ((sz - 3) * part).toFixed(1) + '" height="' + (sz - 3) + '" rx="2" style="fill:var(--strand);opacity:.55"/>';
    }
    for (var r = 1; r <= 10; r++) s += '<text x="56" y="' + (6 + r * sz - 8) + '" text-anchor="end" font-size="15" class="t2">' + A.fmt(r * 10000) + '</text>';
    s += '<rect x="340" y="10" width="20" height="20" rx="2" style="fill:var(--strand)"/><text x="368" y="26" font-size="17">= 1000</text>' +
      '<text x="340" y="60" font-size="17">100 squares</text><text x="340" y="82" font-size="17">= 100 000</text>';
    return A.svg(460, 270, s, A.fmt(n) + ' shown as ' + full + ' of 100 squares, each worth 1000');
  }


  /* ---------- Lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = A.kit;
  function P(id, lv) { return K.P('place-value', id, lv); }
  function an(html) { return html.replace('class="pv"', 'class="pv g5-anim"'); }
  function disksTool(places, start, extra) { return function (el) { return K.disks(el, Object.assign({ places: places || [4, 3, 2, 1, 0], start: start }, extra || {})); }; }
  function cmpFig(a, b, hl) {
    return '<div class="g5-anim">' + chart(a, { cols: 5, hl: hl, dots: false }) + chart(b, { cols: 5, hl: hl, dots: false }) + '</div>';
  }
  var LESSONS = [
    { id: 'read', title: 'Reading big numbers', sub: 'Every place is worth 10 times the place to its right.', concepts: [
      { id: 'ten-times', title: 'Each place is 10 times bigger', exp: ['B1.1'], skill: 'pv-value',
        body: '<p>Ten disks in one place make <b>one</b> disk in the next place to the left. That is why each place is worth <b>10 times</b> the place to its right.</p>',
        watch: { mount: disksTool([3, 2, 1, 0], { 0: 6 }), steps: [
          { say: 'Here are 6 ones.', ms: 1000 },
          { say: 'Add 4 more ones. Now there are 10 ones.', act: function (t) { return t.add(0, 4, 300); } },
          { say: '10 ones are grouped into <b>1 ten</b>.', act: function (t) { return t.group(0); } },
          { say: 'Add tens until there are 10 tens.', act: function (t) { return t.add(1, 9, 220); } },
          { say: '10 tens are grouped into <b>1 hundred</b>.', act: function (t) { return t.group(1); } },
          { say: 'It keeps going: 10 hundreds make 1 thousand, and 10 thousands make 10 000.', act: function (t) { return t.add(2, 9, 160).then(function () { return t.group(2); }); }, ms: 2200 }
        ] },
        try: { mount: function (host, done) {
          var t = K.disks(host, { places: [3, 2, 1, 0], controls: true, start: { 0: 7 }, onChange: function (s) {
            if (s.last.indexOf('group-') === 0 && s.counts[2] >= 1 && !t.told) { t.told = 1; done('Yes. Every time you group 10, you make 1 of the next place.'); }
          } });
        }, do: 'Add ones and tens, then press <b>Group 10 into 1</b>. Keep going until you make a <b>hundred</b> disk.' },
        key: '<p><b>10 of one place = 1 of the next place to the left.</b></p>',
        check: [function () {
          var p = R.int(1, 4), o = R.mc(A.fmt(Math.pow(10, p)), [A.fmt(Math.pow(10, p - 1)), A.fmt(Math.pow(10, p + 1)), '10']);
          return { q: '10 disks of ' + A.fmt(Math.pow(10, p - 1)) + ' are worth how much?', type: 'mc', options: o.options, answer: o.answer, fig: A.draw.disks([{ p: p - 1, n: 10 }]), hint: 'Ten of one place make one of the next place.', explain: '10 &times; ' + A.fmt(Math.pow(10, p - 1)) + ' = ' + A.fmt(Math.pow(10, p)) + '.' };
        }, P('pv-value', 1)] },

      { id: 'digit-value', title: 'A digit is worth what its place says', exp: ['B1.1'], skill: 'pv-value',
        body: '<p>The same digit can be worth very different amounts. In <b>47 305</b> the 7 is in the thousands place, so it is worth <b>7000</b>.</p>',
        watch: K.watch([
          { say: 'Here is 47 305 in a place value chart.', fig: an(chart(47305, { vals: false })) },
          { say: 'The 4 is in the ten thousands place. It is worth <b>40 000</b>.', fig: an(chart(47305, { vals: true, hl: 0 })) },
          { say: 'The 7 is in the thousands place. It is worth <b>7000</b>.', fig: an(chart(47305, { vals: true, hl: 1 })) },
          { say: 'The 3 is worth 300, and the 5 is worth 5.', fig: an(chart(47305, { vals: true, hl: 3 })), ms: 1800 }
        ]),
        try: K.widget('place-value', 0, 'Nice. Watch how each digit tells you how many disks are in its place.'),
        ways: [
          { label: 'Say the place', html: '<p>Point to the digit, then say its place: "7 thousands". 7 thousands is 7000.</p><div class="fig">' + periods(47305) + '</div>' },
          { label: 'Count the zeros', html: '<p>The value of a digit is the digit followed by one zero for each place to its right. The 7 in 47 305 has 3 places to its right: <b>7000</b>.</p>' }
        ],
        key: '<p><b>Value = digit &times; place.</b> The 7 in the thousands place is worth 7 &times; 1000 = 7000.</p>',
        check: [P('pv-value', 1), P('pv-value', 2)] },

      { id: 'zero', title: 'Zero holds a place', exp: ['B1.1'], skill: 'pv-forms', hard: true,
        body: '<p>When a place is empty, we still write a <b>0</b> there. In <b>40 305</b> the zeros keep the 4 in the ten thousands place.</p>',
        watch: { mount: disksTool([4, 3, 2, 1, 0]), steps: [
          { say: 'Build 40 305. First, 4 ten thousands.', act: function (t) { return t.add(4, 4, 300); } },
          { say: 'No thousands. That column stays empty, so we write <b>0</b>.', act: function (t) { return t.pulseCol(3); } },
          { say: '3 hundreds.', act: function (t) { return t.add(2, 3, 300); } },
          { say: 'No tens. Another <b>0</b>.', act: function (t) { return t.pulseCol(1); } },
          { say: '5 ones. We write <b>40 305</b>, not 435.', act: function (t) { return t.add(0, 5, 220); }, ms: 2200 }
        ] },
        try: { mount: function (host, done) {
          var tg = [40305, 60070, 90009], k = 0, p = A.$$ ? null : null, msg = document.createElement('p');
          msg.className = 'ls-task'; host.appendChild(msg);
          var box = document.createElement('div'); host.appendChild(box);
          function say() { msg.innerHTML = 'Build <b>' + A.fmt(tg[k]) + '</b> with the fewest disks.'; }
          var t = K.disks(box, { places: [4, 3, 2, 1, 0], controls: true, onChange: function (s) {
            var tot = 0; Object.keys(s.counts).forEach(function (q) { tot += s.counts[q]; });
            if (s.value === tg[k] && Object.keys(s.counts).every(function (q) { return s.counts[q] < 10; })) {
              k++;
              if (k < tg.length) { M.bump(msg, 'yes'); setTimeout(function () { t.set({}); say(); }, 900); }
              else { msg.innerHTML = 'All three built.'; done('Yes. Empty columns are written as 0.'); }
            }
          } });
          say();
        }, do: 'Three numbers with empty places.' },
        ways: [
          { label: 'With money', html: '<p>$40 305 could be four $10 000 cheques, no $1000 bills, three $100 bills, no $10 bills and five $1 coins. The zeros say "none of these".</p>' },
          { label: 'In a chart', html: '<div class="fig">' + chart(40305, { vals: true }) + '</div><p>Every column gets a digit. Empty columns get a 0.</p>' }
        ],
        key: '<p>A <b>0</b> holds an empty place, so every other digit stays in its own place.</p>',
        mistake: '<p>Leaving out zeros: writing forty thousand three hundred five as <b>4305</b> or <b>435</b>. Ask the child to build it with disks, then write one digit for every column, from left to right.</p>',
        check: [P('pv-forms', 1), P('pv-disks', 1)] }
    ] },

    { id: 'write', title: 'Writing numbers three ways', sub: 'Standard form, expanded form and words.', concepts: [
      { id: 'expanded', title: 'Expanded form', exp: ['B1.1'], skill: 'pv-forms',
        body: '<p><b>Expanded form</b> shows what each digit is worth, added together. 52 408 = 50 000 + 2000 + 400 + 8.</p>',
        watch: K.watch([
          { say: 'Start with 52 408.', fig: an(chart(52408, { dots: false })) },
          { say: 'Each digit drops down to the value it stands for.', fig: expanded(52408) },
          { say: 'The 0 in the tens place is worth nothing, so it is left out of the sum.', fig: expanded(52408), ms: 1800 },
          { say: '52 408 = 50 000 + 2000 + 400 + 8.', fig: expanded(52408), ms: 1800 }
        ]),
        try: { mount: function (host, done) {
          var msg = document.createElement('p'); msg.className = 'ls-task'; msg.innerHTML = 'Build <b>30 000 + 6000 + 70 + 2</b> with disks.'; host.appendChild(msg);
          var b = document.createElement('div'); host.appendChild(b);
          K.disks(b, { places: [4, 3, 2, 1, 0], controls: true, onChange: function (s) { if (s.value === 36072) done('Yes. That is 36 072 in standard form.'); } });
        }, do: 'Turn expanded form into disks.' },
        key: '<p>Standard form: <b>52 408</b>. Expanded form: <b>50 000 + 2000 + 400 + 8</b>. Same number.</p>',
        check: [P('pv-forms', 1), P('pv-forms', 2)] },

      { id: 'words', title: 'Numbers in words', exp: ['B1.1'], skill: 'pv-words',
        body: '<p>Read a big number in two parts. Read the <b>thousands</b> part and say "thousand", then read the rest.</p>',
        watch: K.watch([
          { say: '47 305 has two parts, split by the space.', fig: periods(47305) },
          { say: 'The left part is "forty-seven thousand".', fig: periods(47305) },
          { say: 'The right part is "three hundred five". Together: forty-seven thousand three hundred five.', fig: periods(47305), ms: 2400 },
          { say: 'In 60 018 the right part is "eighteen": sixty thousand eighteen.', fig: periods(60018), ms: 2200 }
        ]),
        try: K.widget('place-value', 0, 'Good. Try a number with zeros in it and read the words.'),
        key: '<p>Read the <b>thousands</b> part, say "thousand", then read the rest. The space in 47 305 shows where to split.</p>',
        mistake: '<p>Saying "and" inside a whole number (three hundred <b>and</b> five). In math, "and" marks the decimal point. Model it without "and".</p>',
        check: [P('pv-words', 1), P('pv-words', 2)] },

      { id: 'trade', title: 'One number, many ways', exp: ['B1.1'], skill: 'pv-disks', hard: true,
        body: '<p>You can break one disk into 10 of the next smaller disk. The number stays the same. 2304 is also 23 hundreds and 4 ones.</p>',
        watch: { mount: disksTool([3, 2, 1, 0], { 3: 2, 2: 3, 0: 4 }), steps: [
          { say: 'This is 2304.', ms: 1200 },
          { say: 'Break a thousand into 10 hundreds.', act: function (t) { return t.split(3); } },
          { say: 'Now it is 1 thousand and 13 hundreds. Still 2304.', ms: 1600 },
          { say: 'Break the other thousand too: 23 hundreds and 4 ones.', act: function (t) { return t.split(3); }, ms: 2000 },
          { say: 'Count to check.', act: function (t) { return t.countAll(120); }, ms: 1200 }
        ] },
        try: K.widget('place-value', 1, 'Yes. The disks change, but the total does not.'),
        ways: [
          { label: 'With money', html: '<p>A $100 bill is the same as ten $10 bills. Trading does not change how much money you have.</p>' },
          { label: 'With numbers', html: '<p class="math">2000 + 300 + 4 = 2304</p><p class="math">1000 + 1300 + 4 = 2304</p><p class="math">2300 + 4 = 2304</p>' }
        ],
        key: '<p>Trading 1 disk for 10 of the next smaller disk <b>does not change the number</b>.</p>',
        check: [P('pv-disks', 2), P('pv-disks', 3)] }
    ] },

    { id: 'compare', title: 'Comparing and ordering', sub: 'Start at the left.', concepts: [
      { id: 'compare', title: 'Compare from the left', exp: ['B1.2'], skill: 'pv-compare',
        body: '<p>Line the numbers up by place. Compare from the <b>left</b>. The first place where the digits differ decides which number is greater.</p>',
        watch: K.watch([
          { say: 'Which is greater, 38 245 or 38 712?', fig: cmpFig(38245, 38712) },
          { say: 'Ten thousands: 3 and 3. The same.', fig: cmpFig(38245, 38712, 0) },
          { say: 'Thousands: 8 and 8. The same.', fig: cmpFig(38245, 38712, 1) },
          { say: 'Hundreds: 2 and 7. Different! 7 hundreds is more.', fig: cmpFig(38245, 38712, 2) },
          { say: 'So <b>38 245 &lt; 38 712</b>. The open side faces the greater number.', fig: cmpFig(38245, 38712, 2), ms: 2200 }
        ]),
        try: K.widget('place-value', 2, 'Nice. Try two numbers that only differ in the ones place.'),
        key: '<p>Compare digits from the <b>left</b>. The first different digit decides. More digits means greater.</p>',
        mistake: '<p>Comparing the last digits first, or deciding by the biggest digit anywhere. 40 001 &gt; 39 999 even though 9 &gt; 1. Have the child line the numbers up in a chart.</p>',
        check: [P('pv-compare', 1), P('pv-compare', 2)] },

      { id: 'order', title: 'Put numbers in order', exp: ['B1.2'], skill: 'pv-compare',
        body: '<p>To order a list, compare the biggest place first. If two numbers tie there, look at the next place.</p>',
        watch: K.watch([
          { say: 'Order 52 800, 38 900, 61 200 and 47 300.', fig: A.draw.line(30000, 70000, 10000, null, 'Number line from 30 000 to 70 000') },
          { say: 'They all have 5 digits. Look at the ten thousands: 5, 3, 6, 4.', fig: A.draw.line(30000, 70000, 10000, 38900) },
          { say: 'The smallest is 38 900, then 47 300.', fig: A.draw.line(30000, 70000, 10000, 47300) },
          { say: 'Then 52 800, then 61 200. Least to greatest: 38 900, 47 300, 52 800, 61 200.', fig: A.draw.line(30000, 70000, 10000, 61200), ms: 2400 }
        ]),
        key: '<p>Order by the <b>biggest place first</b>. Least to greatest goes left to right on a number line.</p>',
        check: [P('pv-compare', 2), P('pv-compare', 3)] }
    ] },

    { id: 'round', title: 'Rounding', sub: 'Find the nearest friendly number.', concepts: [
      { id: 'hill', title: 'Round with a hill', exp: ['B1.1'], skill: 'pv-round',
        body: '<p>Picture a hill between two friendly numbers. Halfway is the top. A number past the top rolls <b>up</b>. Before the top, it rolls back <b>down</b>.</p>',
        watch: K.watch([
          { say: 'Round 48 650 to the nearest thousand. It is between 48 000 and 49 000.', fig: hill(48000, 1000) },
          { say: 'Halfway is 48 500, the top of the hill.', fig: hill(48500, 1000) },
          { say: '48 650 is past the top.', fig: hill(48650, 1000) },
          { say: 'So it rolls up to <b>49 000</b>.', fig: hill(48650, 1000), ms: 2200 }
        ]),
        try: K.widget('place-value', 3, 'Good. Try a number exactly at halfway. It rounds up.'),
        key: '<p>Look at the digit to the <b>right</b> of the rounding place. <b>5 or more</b>: round up. <b>Less than 5</b>: round down.</p>',
        check: [P('pv-round', 1), P('pv-round', 2)] },

      { id: 'carry', title: 'When rounding up carries over', exp: ['B1.1'], skill: 'pv-round', hard: true,
        body: '<p>Rounding up adds 1 to the rounding place. If that place is a 9, it becomes 10 and carries, just like adding.</p>',
        watch: K.watch([
          { say: 'Round 39 700 to the nearest thousand.', fig: hill(39000, 1000) },
          { say: 'It is between 39 000 and 40 000. The hundreds digit is 7.', fig: hill(39700, 1000) },
          { say: '7 is 5 or more, so round up: 39 thousands + 1 thousand = <b>40 000</b>.', fig: hill(39700, 1000), ms: 2400 }
        ]),
        ways: [
          { label: 'Count thousands', html: '<p>39 700 has 39 whole thousands. Rounding up gives one more: 40 thousands, which is 40 000.</p>' },
          { label: 'Number line', html: '<div class="fig">' + A.draw.line(39000, 40000, 100, 39700, 'Number line from 39 000 to 40 000 with 39 700 marked') + '</div><p>39 700 is closer to 40 000.</p>' }
        ],
        key: '<p>A 9 that rounds up becomes 10: write 0 and carry 1 to the left.</p>',
        mistake: '<p>Writing 39 700 rounded as <b>30 000</b> or <b>39 000 + 1</b>. Ask how many whole thousands there are, then add one more.</p>',
        check: [P('pv-round', 3), P('pv-round', 2)] }
    ] },

    { id: 'size', title: 'How big is 100 000?', sub: 'Big numbers in everyday life.', concepts: [
      { id: 'hundred-k', title: 'Picture 100 000', exp: ['B1.1'], skill: 'pv-value',
        body: '<p>100 000 is 100 groups of 1000. On this grid every square is 1000, so all 100 squares make 100 000.</p>',
        watch: K.watch([
          { say: 'Each square is 1000.', fig: hundredK(1000) },
          { say: 'A large hockey arena seats about 19 000 people: 19 squares.', fig: hundredK(19000) },
          { say: 'Around the Earth is about 40 000 km: 40 squares.', fig: hundredK(40075) },
          { say: '100 squares make <b>100 000</b>.', fig: hundredK(100000), ms: 2200 }
        ]),
        try: K.widget('place-value', 4, 'Nice. Big numbers are easier to picture as groups of 1000.'),
        key: '<p>100 000 = 10 &times; 10 000 = 100 &times; 1000 = 1000 &times; 100.</p>',
        check: [function () {
          var n = R.int(2, 9) * 10000, o = R.mc(String(n / 1000), [String(n / 10000), String(n / 100), String(n / 1000 + 10)]);
          return { q: 'How many thousands are in ' + A.fmt(n) + '?', type: 'mc', options: o.options, answer: o.answer, fig: hundredK(n), hint: 'Each square is 1000. Count the squares.', explain: A.fmt(n) + ' is ' + n / 1000 + ' thousands.' };
        }, P('pv-value', 2)] }
    ] }
  ];

  A.register('place-value', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Reading big numbers</h2>' +
'<p>Every digit in a number has a <b>place</b>, and the place decides what the digit is worth. Each place is worth <b>10 times</b> the place to its right.</p>' +
'<div class="fig">' + stairs() + '</div>' +
'<p>In this chapter each place has its own colour, so you can follow a digit from the chart to the blocks to the words.</p>' +
'<div class="legend"><span><i style="background:var(--p5)"></i>hundred thousands</span><span><i style="background:var(--p4)"></i>ten thousands</span><span><i style="background:var(--p3)"></i>thousands</span><span><i style="background:var(--p2)"></i>hundreds</span><span><i style="background:var(--p1)"></i>tens</span><span><i style="background:var(--p0)"></i>ones</span></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' +
'<div class="ctrl"><label for="pvr">Pick a number: <output id="pvo"></output></label><input type="range" id="pvr" min="0" max="100000" step="1" value="47305"></div>' +
'<div class="ctrl"><label for="pvn">Or type one (0 to 100000)<input type="number" id="pvn" min="0" max="100000" value="47305"></label></div>' +
'<p class="t2" style="margin:.4em 0 0;font-size:.9rem">The digit tells you how many disks are in each place.</p>' +
'<div id="pvchart"></div><div class="fig" id="pvper"></div><div class="out" id="pvout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>A <b>zero</b> is a placeholder. In 40 305 the zeros hold the thousands and tens places open. There are no disks there, but the place still has to be written.</p></div>' +
'<div class="fig">' + chart(40305, { vals: true }) + '</div>' +
'<div class="eg"><p><b>Example.</b> In 47 305, the 7 is in the thousands place, so it is worth 7000. The 4 is in the ten thousands place, so it is worth 40 000.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Three ways to write a number</h2>' +
'<p>The same number can be written three ways. Follow each coloured digit down to the value it stands for.</p>' +
'<div class="fig">' + expanded(52408) + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">Form</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l">Standard form</td><td class="l math">52 408</td></tr>' +
'<tr><td class="l">Expanded form</td><td class="l math">50 000 + 2000 + 400 + 8</td></tr>' +
'<tr><td class="l">Word form</td><td class="l">fifty-two thousand four hundred eight</td></tr></tbody></table></div>' +
'<p>To <b>decompose</b> a number, split it into parts. One bigger disk can always be traded for 10 of the next smaller disk. The total does not change.</p>' +
'<div class="lab"><span class="lt">Try it: trade disks</span>' +
'<div class="ctrl"><label for="trn">Start number (1000 to 9999)<input type="number" id="trn" min="1000" max="9999" value="2304"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-tr="3">Break 1 thousand into 10 hundreds</button><button type="button" class="btn alt" data-tr="2">Break 1 hundred into 10 tens</button><button type="button" class="btn alt" data-tr="1">Break 1 ten into 10 ones</button></div>' +
'<div class="btnrow"><button type="button" class="btn alt" data-gr="2">Group 10 hundreds</button><button type="button" class="btn alt" data-gr="1">Group 10 tens</button><button type="button" class="btn alt" data-gr="0">Group 10 ones</button></div>' +
'<div class="fig" id="trfig"></div><div class="out" id="trout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Do not write "and" in the middle of a whole number. 308 is "three hundred eight". The word "and" is saved for the decimal point.</p></div>' +
'<div class="eg"><p><b>Example.</b> Write 60 000 + 3000 + 50 + 9 in standard form. There are no hundreds, so write a 0 in that place: <b>63 059</b>.</p>' +
'<div class="fig">' + chart(63059, { hl: 2 }) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Comparing and ordering</h2>' +
'<p>Line the numbers up by place value and compare from the <b>left</b>. The first place where the digits are different decides which number is greater.</p>' +
'<p>The symbol always opens toward the greater number: <span class="math">9 &lt; 12</span> is read "9 is less than 12". A number with more digits is greater: 10 000 &gt; 9999.</p>' +
'<div class="lab"><span class="lt">Try it: compare place by place</span>' +
'<div class="ctrl"><label for="cpa">First number<input type="number" id="cpa" min="0" max="100000" value="38245"></label>' +
'<label for="cpb">Second number<input type="number" id="cpb" min="0" max="100000" value="38712"></label></div>' +
'<div id="cpchart"></div><div class="fig" id="cpline"></div><div class="out" id="cpout"></div></div>' +
'<div class="eg"><p><b>Example.</b> Order 52 800, 38 900, 61 200 and 47 300 from least to greatest. Every number has 5 digits, so compare the ten thousands first: 3, 4, 5, 6.</p>' +
'<div class="fig" id="ordfig"></div><p>Least to greatest: <b>38 900, 47 300, 52 800, 61 200</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Comparing the last digits first. 40 001 is greater than 39 999, even though 1 is less than 9. Always start at the left.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Rounding whole numbers</h2>' +
'<p>Rounding finds the nearest "friendly" number. Picture a hill between two friendly numbers. Halfway is the top. A number past the top rolls <b>up</b>. A number before the top rolls back <b>down</b>. Exactly halfway also rounds up.</p>' +
'<div class="lab"><span class="lt">Try it: round to a place</span>' +
'<div class="ctrl"><label for="rn">Number<input type="number" id="rn" min="0" max="100000" value="48650"></label>' +
'<label for="rp">Round to the nearest<select id="rp"><option value="10">ten</option><option value="100">hundred</option><option value="1000" selected>thousand</option><option value="10000">ten thousand</option></select></label></div>' +
'<div class="fig" id="rline"></div><div class="out" id="rout"></div></div>' +
'<p>Without a picture, look at the digit just to the <b>right</b> of the place you are rounding to. If it is <b>5 or more</b>, round up. If it is less than 5, round down.</p>' +
'<div class="eg"><p><b>Example.</b> Round 48 650 to the nearest thousand. The thousands on either side are 48 000 and 49 000. The hundreds digit is 6, so round up: <b>49 000</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Forgetting to carry. Rounding 39 700 to the nearest thousand gives 40 000, because 39 thousands plus 1 more thousand is 40 thousands.</p>' +
'<div class="fig">' + hill(39700, 1000) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Big numbers in everyday life</h2>' +
'<p>Big numbers count things like people, distances and money. Often we only need to know <b>about</b> how big a number is.</p>' +
'<div class="facts"><div>' + icons.arena + '<span><b>about 19 000</b><small>seats in a large hockey arena</small></span></div>' +
'<div>' + icons.steps + '<span><b>about 70 000</b><small>steps a person walks in a busy week</small></span></div>' +
'<div>' + icons.globe + '<span><b>about 40 000</b><small>kilometres around the Earth at the equator</small></span></div></div>' +
'<div class="lab"><span class="lt">Try it: how big is 100 000?</span>' +
'<div class="ctrl"><label for="hkp">Pick one<select id="hkp"><option value="19000">Hockey arena seats: 19 000</option><option value="40075">Around the Earth: 40 075 km</option><option value="70000">Steps in a busy week: 70 000</option><option value="5000">A small town: 5000 people</option><option value="100000">100 000</option></select></label>' +
'<label for="hkn">Or type a number<input type="number" id="hkn" min="0" max="100000" value="19000"></label></div>' +
'<div class="fig" id="hkfig"></div><div class="out" id="hkout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Each place is 10 times the place to its right. 100 000 is 10 groups of 10 000, 100 groups of 1000, and 1000 groups of 100.</p></div>' +
'<div class="eg"><p><b>Example.</b> The distance around the Earth is 40 075 km. Rounded to the nearest thousand, that is about 40 000 km, which is easier to remember. On the 100-square picture, it fills just over 40 squares.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      /* section 1 */
      function pv() {
        var n = parseInt($('#pvn', root).value, 10);
        if (isNaN(n)) n = 0;
        n = Math.max(0, Math.min(100000, n));
        $('#pvo', root).textContent = A.fmt(n);
        $('#pvchart', root).innerHTML = chart(n, { cols: 6, vals: true });
        $('#pvper', root).innerHTML = periods(n);
        var s = String(n), parts = [];
        for (var k = 0; k < s.length; k++) {
          var p = s.length - 1 - k;
          if (s.charAt(k) !== '0') parts.push('<b class="c' + p + 't">' + A.fmt(+s.charAt(k) * Math.pow(10, p)) + '</b>');
        }
        $('#pvout', root).innerHTML = '<p><b>Expanded form:</b> <span class="math">' + (parts.join(' + ') || '0') + '</span></p><p><b>In words:</b> ' + words(n) + '</p>';
      }
      $('#pvr', root).addEventListener('input', function () { $('#pvn', root).value = this.value; pv(); });
      $('#pvn', root).addEventListener('input', function () { var v = Math.max(0, Math.min(100000, parseInt(this.value, 10) || 0)); $('#pvr', root).value = v; pv(); });
      pv();

      /* section 2: trade disks. c[p] is the number of disks in place p */
      var c = [0, 0, 0, 0], MAX = 30;
      function trStart() {
        var n = Math.max(1000, Math.min(9999, parseInt($('#trn', root).value, 10) || 1000));
        c = [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000)];
        tr();
      }
      function tr() {
        var r = 14, gap = 31, colW = 138, rows = 1, s = '', total = 0;
        for (var p = 0; p < 4; p++) { rows = Math.max(rows, Math.ceil(c[p] / 4)); total += c[p] * Math.pow(10, p); }
        for (var q = 3; q >= 0; q--) {
          var x0 = (3 - q) * colW + 4;
          s += '<rect x="' + x0 + '" y="2" width="' + (colW - 8) + '" height="26" rx="6" style="fill:var(--p' + q + ')"/>' +
            '<text x="' + (x0 + (colW - 8) / 2) + '" y="20" text-anchor="middle" font-size="13" font-weight="700" style="fill:' + (q ? '#fff' : '#13203a') + '">' + c[q] + ' ' + (c[q] === 1 ? A.PLACE1[q] : A.PLACES[q]) + '</text>';
          for (var i = 0; i < c[q]; i++) s += A.draw.disk(x0 + 19 + (i % 4) * gap, 50 + Math.floor(i / 4) * gap, r, q);
        }
        $('#trfig', root).innerHTML = A.svg(4 * colW, 40 + rows * gap + 4, s, c[3] + ' thousands, ' + c[2] + ' hundreds, ' + c[1] + ' tens and ' + c[0] + ' ones');
        var parts = [];
        for (var k = 3; k >= 0; k--) if (c[k]) parts.push('<b class="c' + k + 't">' + c[k] + ' ' + (c[k] === 1 ? A.PLACE1[k] : A.PLACES[k]) + '</b>');
        $('#trout', root).innerHTML = '<p>' + parts.join(' + ') + ' = <span class="big">' + A.fmt(total) + '</span></p><p class="t2">Same number, different parts.</p>';
        root.querySelectorAll('[data-tr]').forEach(function (b) { var p = +b.getAttribute('data-tr'); b.disabled = c[p] < 1 || c[p - 1] + 10 > MAX; });
        root.querySelectorAll('[data-gr]').forEach(function (b) { b.disabled = c[+b.getAttribute('data-gr')] < 10; });
      }
      root.querySelectorAll('[data-tr]').forEach(function (b) { b.addEventListener('click', function () { var p = +b.getAttribute('data-tr'); if (c[p] > 0) { c[p]--; c[p - 1] += 10; tr(); } }); });
      root.querySelectorAll('[data-gr]').forEach(function (b) { b.addEventListener('click', function () { var p = +b.getAttribute('data-gr'); if (c[p] >= 10) { c[p] -= 10; c[p + 1]++; tr(); } }); });
      A.bind(root, ['trn'], trStart);

      /* section 3 */
      function cp() {
        var a = Math.max(0, Math.min(100000, parseInt($('#cpa', root).value, 10) || 0));
        var b = Math.max(0, Math.min(100000, parseInt($('#cpb', root).value, 10) || 0));
        var sa = String(a), sb = String(b);
        while (sa.length < 6) sa = '0' + sa;
        while (sb.length < 6) sb = '0' + sb;
        var diff = -1;
        for (var i = 0; i < 6; i++) if (sa.charAt(i) !== sb.charAt(i)) { diff = i; break; }
        $('#cpchart', root).innerHTML = '<p class="t2" style="margin:.3em 0 0;font-size:.9rem">First number</p>' + chart(a, { cols: 6, hl: diff }) +
          '<p class="t2" style="margin:.3em 0 0;font-size:.9rem">Second number</p>' + chart(b, { cols: 6, hl: diff });
        var lo = Math.min(a, b), hi = Math.max(a, b), step = hi - lo > 20000 ? 10000 : hi - lo > 2000 ? 1000 : hi - lo > 200 ? 100 : 10;
        var L = Math.floor(lo / step) * step, H = Math.ceil(hi / step) * step;
        if (H === L) H = L + step;
        while ((H - L) / step > 10) step *= 2, L = Math.floor(lo / step) * step, H = Math.ceil(hi / step) * step;
        var W = 440, x0 = 24, x1 = 416, s = '<line x1="' + x0 + '" y1="40" x2="' + x1 + '" y2="40" style="stroke:var(--ink)" stroke-width="2"/>';
        for (var v = L; v <= H; v += step) {
          var x = x0 + (x1 - x0) * (v - L) / (H - L);
          s += '<line x1="' + x + '" y1="33" x2="' + x + '" y2="47" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="66" text-anchor="middle" font-size="12">' + A.fmt(v) + '</text>';
        }
        [[a, 'var(--strand)'], [b, 'var(--hi)']].forEach(function (p, k) {
          var x = x0 + (x1 - x0) * (p[0] - L) / (H - L);
          s += '<circle cx="' + x + '" cy="40" r="7" style="fill:' + p[1] + ';stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="22" text-anchor="middle" class="tb" font-size="12" dy="' + (k ? -8 : 8) + '">' + (k ? 'second' : 'first') + '</text>';
        });
        $('#cpline', root).innerHTML = A.svg(W, 74, s, 'Number line showing ' + a + ' and ' + b);
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=';
        $('#cpout', root).innerHTML = '<p><span class="big">' + A.fmt(a) + ' ' + sym + ' ' + A.fmt(b) + '</span></p><p>' +
          (diff < 0 ? 'Every digit matches, so the numbers are equal.' : 'The first difference is in the <b>' + names[diff] + '</b> place: ' + sa.charAt(diff) + ' and ' + sb.charAt(diff) + '. On a number line, the greater number is further right.') + '</p>';
      }
      A.bind(root, ['cpa', 'cpb'], cp);
      /* ordering example: four numbers on one line */
      (function () {
        var pts = [52800, 38900, 61200, 47300], s = '<line x1="24" y1="44" x2="536" y2="44" style="stroke:var(--ink)" stroke-width="2"/>';
        for (var v = 30000; v <= 70000; v += 10000) {
          var x = 24 + 512 * (v - 30000) / 40000;
          s += '<line x1="' + x + '" y1="36" x2="' + x + '" y2="52" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="72" text-anchor="middle" font-size="13">' + A.fmt(v) + '</text>';
        }
        pts.forEach(function (p, i) {
          var x = 24 + 512 * (p - 30000) / 40000;
          s += '<circle cx="' + x + '" cy="44" r="7" style="fill:var(--strand);stroke:var(--ink)" stroke-width="2"/><text x="' + x + '" y="24" text-anchor="middle" font-size="14" class="tb">' + A.fmt(p) + '</text>';
        });
        $('#ordfig', root).innerHTML = A.svg(560, 80, s, 'Number line from 30 000 to 70 000 with 38 900, 47 300, 52 800 and 61 200 marked from left to right');
      })();

      /* section 4 */
      function rd() {
        var n = parseInt($('#rn', root).value, 10);
        if (isNaN(n) || n < 0) n = 0;
        if (n > 100000) n = 100000;
        var p = parseInt($('#rp', root).value, 10);
        var lo = Math.floor(n / p) * p, hi = lo + p;
        var dg = Math.floor((n % p) / (p / 10));
        var res = n - lo >= p / 2 ? hi : lo;
        $('#rline', root).innerHTML = hill(n, p);
        /* the number with the rounding digit boxed and the deciding digit underlined */
        var s = String(n), pi = s.length - 1 - Math.round(Math.log(p) / Math.LN10), shown = '';
        for (var i = 0; i < s.length; i++) {
          var ch = s.charAt(i);
          if (s.length > 4 && (s.length - i) % 3 === 0 && i) shown += ' ';
          shown += i === pi ? '<span style="outline:2px solid var(--accent);border-radius:3px;padding:0 2px">' + ch + '</span>' :
            i === pi + 1 ? '<span style="text-decoration:underline 3px var(--hi);text-underline-offset:4px">' + ch + '</span>' : ch;
        }
        var why = n === lo ? A.fmt(n) + ' is already a multiple of ' + A.fmt(p) + '.' :
          'The digit to the right of the rounding place is <b>' + dg + '</b>, which is ' + (dg >= 5 ? '5 or more, so round <b>up</b>.' : 'less than 5, so round <b>down</b>.');
        $('#rout', root).innerHTML = '<p><span class="big">' + (pi >= 0 ? shown : A.fmt(n)) + ' &#8776; ' + A.fmt(res) + '</span></p><p>' + why + '</p>' +
          (pi >= 0 ? '<p class="t2" style="font-size:.9rem">Boxed: the rounding place. Underlined: the digit that decides.</p>' : '');
      }
      A.bind(root, ['rn', 'rp'], rd);

      /* section 5 */
      function hk(fromSelect) {
        if (fromSelect) $('#hkn', root).value = $('#hkp', root).value;
        var n = Math.max(0, Math.min(100000, parseInt($('#hkn', root).value, 10) || 0));
        $('#hkfig', root).innerHTML = hundredK(n);
        var sq = n / 1000, frac = n >= 95000 ? 'almost all of 100 000' : n >= 45000 && n <= 55000 ? 'about half of 100 000' : n >= 20000 && n <= 30000 ? 'about a quarter of 100 000' : n >= 9000 && n <= 11000 ? 'about a tenth of 100 000' : '';
        $('#hkout', root).innerHTML = '<p><span class="big">' + A.fmt(n) + '</span> fills ' + (sq === Math.floor(sq) ? A.fmt(sq) : 'about ' + A.fmt(Math.round(sq))) + ' of the 100 squares' + (frac ? ', ' + frac : '') + '.</p>';
      }
      $('#hkp', root).addEventListener('change', function () { hk(true); });
      $('#hkn', root).addEventListener('input', function () { hk(false); });
      hk(false);
    },

    quiz: [
      { q: 'What is the value of the digit 6 in <span class="math">36 482</span>?', type: 'mc', options: ['6', '600', '6000', '60 000'], answer: 2,
        hint: 'Find the 6 in a place value chart. Which place is it in?', explain: 'The 6 is in the thousands place, so it is worth 6000.' },
      { q: 'What number do these disks show?', type: 'num', answer: 74023, fig: A.draw.disks([{ p: 4, n: 7 }, { p: 3, n: 4 }, { p: 1, n: 2 }, { p: 0, n: 3 }], '7 ten thousand disks, 4 thousand disks, 2 ten disks and 3 one disks'),
        hint: 'Count the disks in each row. There is no row for hundreds, so the hundreds digit is 0.', explain: '7 ten thousands, 4 thousands, 0 hundreds, 2 tens, 3 ones: 74 023.' },
      { q: 'Which number is <b>fifty thousand six hundred nine</b>?', type: 'mc', options: ['5609', '50 690', '50 609', '56 009'], answer: 2,
        hint: 'Write the thousands part first, then the hundreds, tens and ones.', explain: 'Fifty thousand is 50 000, and six hundred nine is 609. Together: 50 609.' },
      { q: 'Which is greater: <span class="math">40 001</span> or <span class="math">39 999</span>?', type: 'mc', options: ['40 001', '39 999', 'They are equal'], answer: 0,
        hint: 'Start comparing at the left, in the ten thousands place.', explain: '4 ten thousands is more than 3 ten thousands, so 40 001 is greater.' },
      { q: 'Round <span class="math">48 650</span> to the nearest thousand.', type: 'mc', options: ['48 000', '49 000', '48 700', '50 000'], answer: 1, fig: hill(48650, 1000).replace(/rha/g, 'rhq'),
        hint: 'Which side of the hill is the yellow ball on?', explain: 'The hundreds digit is 6, which is 5 or more, so round the thousands up: 49 000.' },
      { q: 'How many hundreds are in <span class="math">52 408</span>, counting all of them?', type: 'num', answer: 524,
        hint: 'Cover the last two digits.', explain: '52 408 = 524 hundreds + 8. Covering the tens and ones digits leaves 524.' },
      { q: 'Which list is in order from least to greatest?', type: 'mc',
        options: ['85 210, 58 120, 85 012', '58 120, 85 012, 85 210', '58 120, 85 210, 85 012', '85 012, 58 120, 85 210'], answer: 1,
        hint: 'Compare the ten thousands first, then the hundreds.', explain: '58 120 has 5 ten thousands, so it is least. 85 012 &lt; 85 210 because 0 hundreds &lt; 2 hundreds.' }
    ],

    quick: ['pv-value', 'pv-forms', 'pv-compare', 'pv-round', 'pv-words'],

    practice: [
      { id: 'pv-value', name: 'Value of a digit', code: 'B1.1', gen: function (lv) {
        var n = lv === 1 ? R.int(1000, 9999) : R.int(10000, 99999);
        var s = String(n), len = s.length, i = R.int(0, len - 1);
        while (s.charAt(i) === '0') i = R.int(0, len - 1);
        var dgt = +s.charAt(i), place = len - 1 - i, val = dgt * Math.pow(10, place);
        var pnames = A.PLACES;
        if (lv === 3) {
          var k = R.pick([2, 3]), total = Math.floor(n / Math.pow(10, k));
          return { q: 'How many <b>' + pnames[k] + '</b> are in <span class="math">' + A.fmt(n) + '</span>, counting all of them?', type: 'num', answer: total,
            fig: chart(n, { dots: false }),
            hint: 'Cover the digits to the right of the ' + pnames[k] + ' place. Read what is left.',
            steps: ['Find the ' + pnames[k] + ' place in ' + A.fmt(n) + '.', 'Cover the ' + k + ' digit' + (k > 1 ? 's' : '') + ' to its right.', 'What is left is ' + A.fmt(total) + ', so there are ' + A.fmt(total) + ' ' + pnames[k] + '.'],
            explain: A.fmt(n) + ' = ' + A.fmt(total) + ' ' + pnames[k] + ' + ' + (n % Math.pow(10, k)) + '.' };
        }
        var wrong = [dgt, dgt * Math.pow(10, place + 1), dgt * Math.pow(10, Math.max(0, place - 1)), dgt * Math.pow(10, place + 2)].filter(function (v) { return v !== val && v <= 900000; });
        var o = R.mc(A.fmt(val), wrong.map(A.fmt));
        return { q: 'What is the value of the digit <b>' + dgt + '</b> in <span class="math">' + s.slice(0, i) + '<u>' + dgt + '</u>' + s.slice(i + 1) + '</span>?' + (len > 4 ? ' <span class="t2">(' + A.fmt(n) + ')</span>' : ''),
          type: 'mc', options: o.options, answer: o.answer, fig: chart(n, { hl: i }),
          hint: 'Find the underlined digit in the chart. Read the name of its place.',
          steps: ['The underlined ' + dgt + ' is in the <b>' + pnames[place] + '</b> place.', 'One ' + A.PLACE1[place] + ' is ' + A.fmt(Math.pow(10, place)) + '.', dgt + ' &times; ' + A.fmt(Math.pow(10, place)) + ' = ' + A.fmt(val) + '.'],
          explain: 'The ' + dgt + ' is in the ' + pnames[place] + ' place, so it is worth ' + A.fmt(val) + '.' };
      } },
      { id: 'pv-disks', name: 'Read blocks and disks', code: 'B1.1', gen: function (lv) {
        var n, fig, steps, hint, q = 'What number do these ' + (lv === 1 ? 'base-ten blocks' : 'disks') + ' show?';
        if (lv === 1) {
          n = R.int(1, 3) * 1000 + R.int(0, 4) * 100 + R.int(0, 5) * 10 + R.int(0, 6);
          var d = String(n);
          fig = A.draw.blocks(n);
          hint = 'Big cubes are thousands, flats are hundreds, rods are tens, small cubes are ones.';
          steps = ['Count the big cubes: ' + d[0] + ' thousand' + (d[0] === '1' ? '' : 's') + '. Count the flats: ' + d[1] + ' hundreds.', 'Count the rods: ' + d[2] + ' tens. Count the small cubes: ' + d[3] + ' ones.', 'Write one digit for each place: ' + A.fmt(n) + '.'];
          return { q: q, type: 'num', answer: n, fig: fig, hint: hint, steps: steps, explain: 'The blocks show ' + A.fmt(n) + '.' };
        }
        var c = [R.int(0, 6), R.int(0, 5), R.int(0, 5), R.int(0, 5), R.int(1, 4)];
        c[R.int(1, 3)] = 0;
        if (lv === 2) {
          n = c[4] * 10000 + c[3] * 1000 + c[2] * 100 + c[1] * 10 + c[0];
          var g = [];
          for (var p = 4; p >= 0; p--) if (c[p]) g.push({ p: p, n: c[p] });
          var miss = [];
          for (var m = 4; m >= 0; m--) if (!c[m]) miss.push(A.PLACES[m]);
          return { q: q, type: 'num', answer: n, fig: A.draw.disks(g), hint: 'Count each row. A place with no disks gets a 0.',
            steps: ['Count the disks in each place: ' + g.map(function (x) { return x.n + ' ' + (x.n === 1 ? A.PLACE1[x.p] : A.PLACES[x.p]); }).join(', ') + '.', miss.length ? 'There are no ' + miss.join(' and no ') + ', so write 0 there.' : 'Every place has disks.', 'The number is ' + A.fmt(n) + '.'],
            explain: 'The disks show ' + A.fmt(n) + '.' };
        }
        /* level 3: one place has 10 or more disks, and the rows are mixed up */
        n = c[4] * 10000 + c[3] * 1000 + c[2] * 100 + c[1] * 10 + c[0];
        var cand = [0, 1, 2, 3].filter(function (k) { return c[k + 1] > 0; }), t = R.pick(cand);
        c[t + 1]--; c[t] += 10;
        var groups = [];
        for (var p2 = 4; p2 >= 0; p2--) if (c[p2]) groups.push({ p: p2, n: c[p2] });
        groups = R.shuffle(groups);
        return { q: q + ' Watch for a place with 10 or more.', type: 'num', answer: n, fig: A.draw.disks(groups),
          hint: 'There are ' + c[t] + ' ' + A.PLACES[t] + '. Ten of them make 1 ' + A.PLACE1[t + 1] + '.',
          steps: ['Count each kind of disk. There are ' + c[t] + ' ' + A.PLACES[t] + '.', '10 ' + A.PLACES[t] + ' make 1 ' + A.PLACE1[t + 1] + '. Trade them: ' + (c[t] - 10) + ' ' + A.PLACES[t] + ' and 1 more ' + A.PLACE1[t + 1] + '.', 'Now each place has 9 or fewer. Write the digits from the biggest place down: ' + A.fmt(n) + '.'],
          explain: 'After trading 10 ' + A.PLACES[t] + ' for 1 ' + A.PLACE1[t + 1] + ', the number is ' + A.fmt(n) + '.' };
      } },
      { id: 'pv-forms', name: 'Expanded and standard form', code: 'B1.1', gen: function (lv) {
        var n;
        if (lv === 1) n = R.int(1, 9) * 1000 + R.int(1, 9) * 100 + R.int(1, 9) * 10 + R.int(0, 9);
        else { n = R.int(1, 9) * 10000 + R.int(0, 9) * 1000 + R.int(0, 9) * 100 + R.int(0, 9) * 10 + R.int(0, 9); var z = R.int(1, 3); n -= Math.floor(n / Math.pow(10, z)) % 10 * Math.pow(10, z); }
        var parts = [], s = String(n);
        for (var i = 0; i < s.length; i++) { var v = +s.charAt(i) * Math.pow(10, s.length - 1 - i); if (v) parts.push(v); }
        if (lv === 3) parts = R.shuffle(parts);
        return { q: 'Write in standard form: <span class="math">' + parts.map(A.fmt).join(' + ') + '</span>', type: 'num', answer: n,
          hint: lv === 3 ? 'The parts are mixed up. Sort them from biggest to smallest first.' : 'Put each part in its place. Any empty place gets a 0.',
          steps: ['Sort the parts from biggest to smallest: ' + parts.slice().sort(function (a, b) { return b - a; }).map(A.fmt).join(' + ') + '.', 'Write one digit for each place, from the biggest place down to ones. Write 0 for any place that is missing.', 'The number is ' + A.fmt(n) + '.<div class="fig">' + expanded(n) + '</div>'],
          fig: lv < 3 ? A.draw.disks(parts.slice().sort(function (a, b) { return b - a; }).map(function (v) { var p = String(v).length - 1; return { p: p, n: v / Math.pow(10, p) }; })) : '',
          explain: 'Each part fills one place. The result is ' + A.fmt(n) + '.' };
      } },
      { id: 'pv-words', name: 'Numbers in words', code: 'B1.1', gen: function (lv) {
        var n = lv === 1 ? R.int(1, 9) * 1000 + R.pick([0, R.int(1, 9)]) * 100 + R.int(0, 99) : R.int(10, 99) * 1000 + R.pick([0, R.int(1, 9)]) * 100 + R.pick([0, R.int(1, 9)]) * 10 + R.int(0, 9);
        var th = Math.floor(n / 1000), on = n % 1000;
        var wrong = [], noZ = +String(n).replace(/0/g, '');
        if (noZ !== n) wrong.push(noZ);
        wrong.push(th * 10000 + on, th * 100 + on, n + R.pick([1, 10, 100]) * R.int(1, 3));
        if (on < 100) wrong.push(th * 1000 + on * 10);
        wrong = wrong.filter(function (w) { return w !== n && w > 0; });
        var steps = ['Split the number into two parts: the thousands part and the rest.', 'Thousands part: ' + (lv === 3 ? A.fmt(th) + ' &rarr; "' + b1000(th) + ' thousand"' : '"' + b1000(th) + ' thousand" &rarr; ' + A.fmt(th)) + '.',
          'The rest: ' + (on ? (lv === 3 ? A.fmt(on) + ' &rarr; "' + b1000(on) + '"' : '"' + b1000(on) + '" &rarr; ' + ('00' + on).slice(-3)) : 'nothing, so the last three digits are 000') + '. Every part after the thousands needs three digits.',
          'Together: ' + A.fmt(n) + ' is ' + words(n) + '.<div class="fig">' + periods(n) + '</div>'];
        if (lv === 3) {
          var o = R.mc(words(n), wrong.slice(0, 3).map(words));
          return { q: 'Which is the word form of <span class="math">' + A.fmt(n) + '</span>?', type: 'mc', options: o.options, answer: o.answer,
            fig: chart(n, { dots: false }), hint: 'Read the thousands part first, then the last three digits.', steps: steps, explain: A.fmt(n) + ' is ' + words(n) + '.' };
        }
        var o2 = R.mc(A.fmt(n), wrong.slice(0, 3).map(A.fmt));
        return { q: 'Which number is <b>' + words(n) + '</b>?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Write the thousands part, then three digits for the rest. Use 0 for any empty place.', steps: steps, explain: words(n) + ' is ' + A.fmt(n) + '.' };
      } },
      { id: 'pv-compare', name: 'Compare and order', code: 'B1.2', gen: function (lv) {
        if (lv < 3) {
          var a = lv === 1 ? R.int(1000, 9999) : R.int(10000, 99999), pos = R.int(1, 3), b = a + R.pick([-1, 1]) * R.int(1, 9) * Math.pow(10, pos);
          if (b < 1000 || b > 100000) b = a + 10;
          var sym = a > b ? '&gt;' : '&lt;', o = R.mc(sym, ['&gt;', '&lt;', '=']);
          var sa = A.fmt(a), sb = A.fmt(b), cols = Math.max(String(a).length, String(b).length), sa0 = String(a), sb0 = String(b), d0 = 0;
          while (sa0.length < cols) sa0 = '0' + sa0;
          while (sb0.length < cols) sb0 = '0' + sb0;
          while (d0 < cols && sa0.charAt(d0) === sb0.charAt(d0)) d0++;
          return { q: 'Which symbol goes in the box? <span class="math">' + sa + ' &#9633; ' + sb + '</span>', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Compare digits from the left. Find the first place where they are different.', fig: chart(a, { cols: cols }) + chart(b, { cols: cols }),
            steps: ['Line up the numbers by place.', 'Start at the left. The first different digits are in the ' + A.PLACES[cols - 1 - d0] + ' place.<div class="fig">' + chart(a, { cols: cols, hl: d0, dots: false }) + chart(b, { cols: cols, hl: d0, dots: false }) + '</div>', 'The number with the bigger digit there is greater, so ' + sa + ' ' + sym + ' ' + sb + '.'],
            explain: sa + ' ' + sym + ' ' + sb + '. The symbol opens toward the greater number.' };
        }
        var base = R.int(2, 9) * 10000, nums = [base + R.int(0, 9) * 1000 + R.int(100, 999), base + R.int(0, 9) * 1000 + R.int(100, 999), base + R.int(0, 9) * 1000 + R.int(100, 999)];
        nums.push(nums[0] + 1000 > 99999 ? nums[0] - 1000 : nums[0] + R.pick([10, 100]));
        var uniq = nums.filter(function (v, i) { return nums.indexOf(v) === i; });
        while (uniq.length < 4) uniq.push(uniq[uniq.length - 1] + 1);
        var sorted = uniq.slice().sort(function (x, y) { return x - y; });
        var right = sorted.map(A.fmt).join(', ');
        var w1 = sorted.slice().reverse().map(A.fmt).join(', '), w2 = [sorted[1], sorted[0], sorted[2], sorted[3]].map(A.fmt).join(', '), w3 = [sorted[0], sorted[2], sorted[1], sorted[3]].map(A.fmt).join(', ');
        var o2 = R.mc(right, [w1, w2, w3]);
        return { q: 'Which list is in order from <b>least to greatest</b>?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'All the numbers have the same ten thousands digit. Compare the thousands next.',
          steps: ['The ten thousands digits are all the same.', 'Compare the thousands digits, then the hundreds if needed.', 'From least to greatest: ' + right + '.'],
          explain: 'In order: ' + right + '.' };
      } },
      { id: 'pv-round', name: 'Round to estimate', code: 'B1.1', gen: function (lv) {
        var p = lv === 1 ? R.pick([10, 100]) : lv === 2 ? 1000 : R.pick([1000, 10000]);
        var n = lv === 1 ? R.int(100, 9999) : R.int(10000, 99999);
        if (lv === 3 && p === 1000) n = Math.floor(n / 10000) * 10000 + 9000 + R.int(500, 999);
        var lo = Math.floor(n / p) * p, hi = lo + p, ans = n - lo >= p / 2 ? hi : lo, dg = Math.floor((n % p) / (p / 10));
        var nm = { 10: 'ten', 100: 'hundred', 1000: 'thousand', 10000: 'ten thousand' }[p];
        var o = R.mc(A.fmt(ans), [A.fmt(ans === hi ? lo : hi), A.fmt(Math.round(n / (p / 10)) * (p / 10)), A.fmt(ans + p)]);
        return { q: 'Round <span class="math">' + A.fmt(n) + '</span> to the nearest <b>' + nm + '</b>.', type: 'mc', options: o.options, answer: o.answer,
          fig: lv < 3 ? hill(n, p) : '', hint: lv < 3 ? 'Is the yellow ball before or past the top of the hill?' : 'Find the ' + nm + 's on either side, then look at the next digit to the right.',
          steps: ['The ' + nm + 's on either side are ' + A.fmt(lo) + ' and ' + A.fmt(hi) + '.', 'Look at the digit just to the right of the ' + nm + 's place. It is ' + dg + '.', (dg >= 5 ? '5 or more rounds up, to ' + A.fmt(hi) + '.' : 'Less than 5 rounds down, to ' + A.fmt(lo) + '.') + (lv === 3 ? '<div class="fig">' + hill(n, p) + '</div>' : '')],
          explain: A.fmt(n) + ' rounds to ' + A.fmt(ans) + '.' };
      } }
    ]
  });

  /* ---------- more ways to ask each practice skill (docs/QUESTIONS.md); answer checks in tests/verify/grade5.js ---------- */
  var K = A.kit, nm = function () { return A.Q.name(); };
  function under(n, i) {
    var f = A.fmt(n), k = -1, out = '';
    for (var j = 0; j < f.length; j++) { var c = f.charAt(j); if (c !== ' ') k++; out += c !== ' ' && k === i ? '<u>' + c + '</u>' : c; }
    return '<span class="math">' + out + '</span>';
  }
  function nonzero(n) { var s = String(n), i; do { i = R.int(0, s.length - 1); } while (s.charAt(i) === '0'); return i; }
  function parts(n) { var s = String(n), out = []; for (var i = 0; i < s.length; i++) { var v = +s.charAt(i) * Math.pow(10, s.length - 1 - i); if (v) out.push(v); } return out; }
  function nearest(n, p) { var lo = Math.floor(n / p) * p; return n - lo >= p / 2 ? lo + p : lo; }
  function big(lv) { return lv === 1 ? R.int(1000, 9999) : R.int(10000, 99999); }
  var SHAPES = {
    'pv-value': [
      [1, 'tap', function (lv) {
        var n = big(lv), s = String(n), i = nonzero(n), p = s.length - 1 - i, val = +s.charAt(i) * Math.pow(10, p);
        return { q: 'Tap the digit that is worth <b>' + A.fmt(val) + '</b>.', type: 'tap', pic: K.digits(n), answer: String(i), answerText: 'the ' + s.charAt(i) + ' in the ' + A.PLACES[p] + ' place',
          hint: A.fmt(val) + ' is ' + s.charAt(i) + ' ' + A.PLACES[p] + '. Find the ' + A.PLACES[p] + ' place.', steps: ['Name the places from the right: ones, tens, hundreds, thousands, ten thousands.', 'The ' + A.PLACES[p] + ' place holds a ' + s.charAt(i) + '.', s.charAt(i) + ' &times; ' + A.fmt(Math.pow(10, p)) + ' = ' + A.fmt(val) + '.'],
          explain: 'In ' + A.fmt(n) + ', the ' + s.charAt(i) + ' is in the ' + A.PLACES[p] + ' place, so it is worth ' + A.fmt(val) + '.', meta: { k: 'g5pv-tap', n: n, val: val } };
      }],
      [1, 'story', function (lv) {
        var c = R.pick([['A hockey arena in Halifax has', 'seats'], ['A school library in Regina has', 'books'], ['A farm in Alberta grew', 'pumpkins'], ['A food bank in Toronto packed', 'meals']]);
        var n = big(lv), s = String(n), i = nonzero(n), p = s.length - 1 - i, val = +s.charAt(i) * Math.pow(10, p);
        return { q: c[0] + ' ' + under(n, i) + ' ' + c[1] + '. How many ' + c[1] + ' does the underlined <b>' + s.charAt(i) + '</b> stand for?', type: 'num', answer: val,
          hint: 'Which place is the underlined digit in?', steps: ['The ' + s.charAt(i) + ' is in the ' + A.PLACES[p] + ' place.', s.charAt(i) + ' ' + A.PLACES[p] + ' = ' + A.fmt(val) + '.'],
          explain: 'The ' + s.charAt(i) + ' stands for ' + A.fmt(val) + ' ' + c[1] + '.', meta: { k: 'g5pv-story', n: n, i: i } };
      }],
      [1, 'match', function (lv) {
        var pairs = [], items = [], seen = {};
        while (pairs.length < 3) {
          var n = big(lv), i = nonzero(n), val = +String(n).charAt(i) * Math.pow(10, String(n).length - 1 - i);
          if (seen[val] || seen['n' + n]) continue; /* a number twice would show two cards that look the same */
          seen[val] = 1; seen['n' + n] = 1; items.push([n, i]); pairs.push([under(n, i), A.fmt(val)]);
        }
        return { q: 'Match each underlined digit to its value.', type: 'match', pairs: pairs,
          hint: 'For each number, name the place of the underlined digit.', steps: ['Ones are worth 1, tens 10, hundreds 100, thousands 1000, ten thousands 10 000.', 'Multiply the digit by the value of its place.'],
          explain: pairs.map(function (x) { return A.fmt(+x[0].replace(/<[^>]+>/g, '').replace(/\s/g, '')) + ': ' + x[1]; }).join('. ') + '.', meta: { k: 'g5pv-match', items: items } };
      }],
      [2, 'mistake', function (lv) {
        var n = R.int(10000, 99999), s = String(n), i = nonzero(n), p = s.length - 1 - i, d = +s.charAt(i), val = d * Math.pow(10, p), who = nm();
        var truth = !R.int(0, 2), said = truth ? val : (p ? R.pick([d, d * Math.pow(10, p - 1)]) : d * 10);
        var right = 'The ' + d + ' is in the ' + A.PLACES[p] + ' place, so it is worth ' + A.fmt(val) + '.';
        return K.tf(who, 'the underlined ' + d + ' in ' + under(n, i) + ' is worth <b>' + A.fmt(said) + '</b>.', truth, right,
          ['A digit is always worth just itself.', 'The biggest digit is always worth the most.', 'Count places from the left to find the value.'],
          { hint: 'Find the place of the underlined digit first.', meta: { k: 'g5pv-tf', n: n, i: i, said: said } });
      }]
    ],
    'pv-disks': [
      [1, 'tap', function (lv) {
        var d = [R.int(1, 4), R.int(1, 5), R.int(0, 5), R.int(1, 6)], n = d[0] * 1000 + d[1] * 100 + d[2] * 10 + d[3];
        var alt = [d[0] * 1000 + d[2] * 100 + d[1] * 10 + d[3], d[0] * 1000 + d[1] * 100 + d[3] * 10 + d[2], d[1] * 1000 + d[0] * 100 + d[2] * 10 + d[3]];
        var set = [n];
        alt.forEach(function (v) { if (set.indexOf(v) < 0 && set.length < 3 && v >= 1000) set.push(v); });
        if (set.length < 2) set.push(n + 100);
        set = R.shuffle(set);
        var draw = function (v) { var g = [], s = String(v); for (var k = 0; k < 4; k++) if (+s.charAt(k)) g.push({ p: 3 - k, n: +s.charAt(k) }); return A.draw.disks(g); };
        return { q: 'Which disks show <b>' + A.fmt(n) + '</b>? Tap them.', type: 'tap', tiles: set.map(draw), answer: set.indexOf(n), answerText: 'the disks for ' + A.fmt(n),
          hint: A.fmt(n) + ' has ' + d[0] + ' thousands and ' + d[1] + ' hundreds. Check those rows first.', steps: ['Count the thousands disks in each picture. You need ' + d[0] + '.', 'Then check the hundreds (' + d[1] + '), tens (' + d[2] + ') and ones (' + d[3] + ').'],
          explain: A.fmt(n) + ' is ' + d[0] + ' thousands, ' + d[1] + ' hundreds, ' + d[2] + ' tens and ' + d[3] + ' ones.', meta: { k: 'g5pv-disktap', n: n, set: set } };
      }],
      [1, 'fill', function (lv) {
        var top = lv === 1 ? 3 : 4, c = [], g = [], n = 0, names = [];
        for (var p = top; p >= 0; p--) { var k = p === top ? R.int(1, 5) : R.int(0, 6); c.push(k); n += k * Math.pow(10, p); if (k) g.push({ p: p, n: k }); names.push('[[]] ' + A.PLACES[p]); }
        return { q: 'Count the disks in each place. Fill in the blanks.', type: 'fill', fig: A.draw.disks(g), fill: names.join(', ') + ' make <span class="math">' + A.fmt(n) + '</span>.', answers: c,
          hint: 'A place with no disks gets 0.', steps: ['Count one row at a time, from the biggest place down.', 'Write 0 for any place with no disks.'],
          explain: c.map(function (k, j) { return k + ' ' + A.PLACES[top - j]; }).join(', ') + ' make ' + A.fmt(n) + '.', meta: { k: 'g5pv-diskfill', n: n } };
      }],
      [1, 'build', function (lv) {
        var m = R.int(11, lv === 1 ? 49 : 99), n = m * 10, down = lv > 1 && !R.int(0, 1);
        return { q: (down ? 'Show <b>' + A.fmt(n * 10) + ' &divide; 10</b>' : 'Show <b>10 times ' + m + '</b>') + ' with base-ten blocks. Then press Check.', type: 'build', tool: 'base10', answer: n,
          hint: down ? 'Dividing by 10 moves every digit one place to the right.' : 'Times 10, each ten becomes a hundred and each one becomes a ten.',
          steps: [down ? A.fmt(n * 10) + ' &divide; 10 = ' + n + '.' : m + ' &times; 10 = ' + n + '.', n + ' is ' + Math.floor(n / 100) + ' flats and ' + Math.floor(n / 10) % 10 + ' rods.'],
          explain: (down ? A.fmt(n * 10) + ' &divide; 10' : '10 &times; ' + m) + ' = ' + n + '. Each digit moved one place.', meta: { k: 'g5pv-build', m: m, n: n, down: down } };
      }],
      [2, 'mistake', function (lv) {
        var c = [R.int(1, 9), R.int(0, 5), R.int(1, 5), R.int(1, 4)], t = R.int(0, 2), who = nm();
        c[t] += 10;
        var n = 0, g = [];
        for (var p = 3; p >= 0; p--) { n += c[p] * Math.pow(10, p); g.push({ p: p, n: c[p] }); }
        var truth = !R.int(0, 2), said = truth ? n : n - Math.pow(10, t + 1);
        var right = c[t] + ' ' + A.PLACES[t] + ' is 1 ' + A.PLACE1[t + 1] + ' and ' + (c[t] - 10) + ' ' + A.PLACES[t] + ', so the disks show ' + A.fmt(n) + '.';
        return K.tf(who, 'these disks show <b>' + A.fmt(said) + '</b>.', truth, right,
          ['A place can hold 10 or more, so write ' + c[t] + ' there.', 'Ten of a place make 10 of the next place.', 'Just count all the disks.'],
          { fig: A.draw.disks(g), hint: 'Is there a place with 10 or more disks? Trade 10 of them first.', meta: { k: 'g5pv-disktf', c: c, said: said } });
      }]
    ],
    'pv-forms': [
      [1, 'fill', function (lv) {
        var n = lv === 1 ? R.int(1, 9) * 1000 + R.int(1, 9) * 100 + R.int(1, 9) * 10 + R.int(1, 9) : R.int(1, 9) * 10000 + R.int(1, 9) * 1000 + R.int(0, 9) * 100 + R.int(1, 9) * 10 + R.int(1, 9);
        var ps = parts(n);
        return { q: 'Write <span class="math">' + A.fmt(n) + '</span> in expanded form.', type: 'fill', fill: '<span class="math">' + A.fmt(n) + '</span> = ' + ps.map(function () { return '[[]]'; }).join(' + '), answers: ps,
          hint: 'Each digit becomes its value. Start with the biggest place.', steps: ['Read each digit with its place, from the left.', 'Write each value: ' + ps.map(A.fmt).join(' + ') + '.'],
          explain: A.fmt(n) + ' = ' + ps.map(A.fmt).join(' + ') + '.', meta: { k: 'g5pv-formfill', n: n } };
      }],
      [1, 'match', function (lv) {
        var pairs = [], seen = {};
        while (pairs.length < 3) {
          var n = big(lv);
          if (lv > 1) n -= Math.floor(n / 100) % 10 * 100;
          if (seen[n]) continue;
          seen[n] = 1; pairs.push([parts(n).map(A.fmt).join(' + '), A.fmt(n)]);
        }
        return { q: 'Match each expanded form to its number.', type: 'match', pairs: pairs,
          hint: 'Add the parts place by place. A missing place gets a 0.', steps: ['Look at the biggest part first. It tells you how many digits the number has.', 'Fill each place. Write 0 where a part is missing.'],
          explain: pairs.map(function (x) { return x[0] + ' = ' + x[1]; }).join('. ') + '.', meta: { k: 'g5pv-formmatch', pairs: pairs } };
      }],
      [1, 'mistake', function (lv) {
        var n = R.int(1, 9) * 10000 + R.int(1, 9) * 100 + R.int(0, 9) * 10 + R.int(1, 9), ps = parts(n), who = nm();
        var truth = !R.int(0, 2), said = truth ? n : +String(n).replace(/0/g, '');
        var right = ps.map(A.fmt).join(' + ') + ' has no thousands, so the thousands place needs a 0: ' + A.fmt(n) + '.';
        return K.tf(who, '<span class="math">' + ps.map(A.fmt).join(' + ') + '</span> = <b>' + A.fmt(said) + '</b>.', truth, right,
          ['You can skip a place that has nothing in it.', 'Just write the first digit of each part side by side.', 'Expanded form and standard form are never equal.'],
          { hint: 'Is every place filled? A missing place needs a 0.', meta: { k: 'g5pv-formtf', parts: ps, said: said } });
      }]
    ],
    'pv-words': [
      [1, 'match', function (lv) {
        var pairs = [], seen = {};
        while (pairs.length < 3) {
          var n = lv === 1 ? R.int(1, 9) * 1000 + R.int(0, 999) : R.int(10, 99) * 1000 + R.int(0, 999);
          if (seen[n]) continue;
          seen[n] = 1; pairs.push([words(n), A.fmt(n)]);
        }
        return { q: 'Match each number in words to its digits.', type: 'match', pairs: pairs,
          hint: 'Read the thousands part first, then the last three digits.', steps: ['The words before "thousand" give the thousands part.', 'The words after "thousand" give the last three digits.'],
          explain: pairs.map(function (x) { return x[0] + ' is ' + x[1]; }).join('. ') + '.', meta: { k: 'g5pv-wordmatch', pairs: pairs } };
      }],
      [1, 'tap', function (lv) {
        var n = lv === 1 ? R.int(1, 9) * 1000 + R.int(1, 9) * 10 + R.int(0, 9) : R.int(10, 99) * 1000 + R.int(1, 9) * 10 + R.int(0, 9), th = Math.floor(n / 1000), on = n % 1000;
        var set = [n];
        [th * 10000 + on, th * 100 + on, +String(n).replace(/0/g, '')].forEach(function (v) { if (set.indexOf(v) < 0 && set.length < 3) set.push(v); });
        set = R.shuffle(set);
        return { q: 'Tap the number <b>' + words(n) + '</b>.', type: 'tap', tiles: set.map(function (v) { return '<span class="math" style="font-size:1.4em">' + A.fmt(v) + '</span>'; }), answer: set.indexOf(n), answerText: A.fmt(n),
          hint: 'After "thousand" you need three digits. Use 0 for an empty place.', steps: ['"' + b1000(th) + ' thousand" is ' + th + ' thousands.', 'The rest is ' + on + ', written with three digits: ' + ('00' + on).slice(-3) + '.'],
          explain: words(n) + ' is ' + A.fmt(n) + '.', meta: { k: 'g5pv-wordtap', set: set } };
      }],
      [2, 'mistake', function (lv) {
        var n = R.int(10, 99) * 1000 + R.int(1, 9) * 10 + R.int(1, 9), who = nm();
        var truth = !R.int(0, 2), said = truth ? n : Math.floor(n / 1000) * 100 + n % 100;
        var right = 'After the thousands, there are three places: hundreds, tens and ones. The hundreds place needs a 0, so it is ' + A.fmt(n) + '.';
        return K.tf(who, '<b>' + words(n) + '</b> is written <span class="math">' + A.fmt(said) + '</span>.', truth, right,
          ['Write each part just as you hear it.', 'There is no hundreds part, so leave that place out.', 'Words and digits can never match.'],
          { hint: 'How many digits come after the thousands?', meta: { k: 'g5pv-wordtf', said: said } });
      }]
    ],
    'pv-compare': [
      [1, 'order', function (lv) {
        var base = lv === 1 ? R.int(1, 9) * 1000 : R.int(1, 9) * 10000, vals = [];
        while (vals.length < 4) { var v = base + R.int(0, lv === 1 ? 999 : 9999); if (vals.indexOf(v) < 0) vals.push(v); }
        vals.sort(function (a, b) { return a - b; });
        return { q: 'Put these numbers in order from <b>least to greatest</b>.', type: 'order', items: vals.map(A.fmt), first: 'least', last: 'greatest',
          hint: 'They all start the same. Compare the next place.', steps: ['Line the numbers up by place.', 'Find the first place where the digits are different. The smaller digit comes first.'],
          explain: 'From least to greatest: ' + vals.map(A.fmt).join(', ') + '.', meta: { k: 'g5pv-order' } };
      }],
      [1, 'story', function (lv) {
        var who = A.Q.two(), c = R.pick([['steps on a step counter', 'more steps'], ['points in a reading challenge', 'more points'], ['pennies in a fundraiser jar', 'more pennies']]);
        var a = big(lv), b = a + R.pick([-1, 1]) * R.int(1, 9) * Math.pow(10, R.int(1, 2));
        if (b < 1000) b = a + 100;
        return { q: who[0] + ' has ' + A.fmt(a) + ' ' + c[0] + '. ' + who[1] + ' has ' + A.fmt(b) + '. Who has ' + c[1] + '?', type: 'mc', options: who, answer: a > b ? 0 : 1,
          hint: 'Compare the digits from the left. Find the first place that is different.', steps: ['Line up ' + A.fmt(a) + ' and ' + A.fmt(b) + ' by place.', 'The first different digit tells you which is greater.'],
          explain: (a > b ? who[0] : who[1]) + ' has ' + c[1] + ', because ' + A.fmt(Math.max(a, b)) + ' &gt; ' + A.fmt(Math.min(a, b)) + '.', meta: { k: 'g5pv-story2', a: a, b: b } };
      }],
      [1, 'pick', function (lv) {
        var x = big(lv), more = !!R.int(0, 1), vals = [];
        /* two above, two below and one either way, so there is always something to pick and something to leave */
        while (vals.length < 5) { var dir = vals.length < 2 ? 1 : vals.length < 4 ? -1 : R.pick([-1, 1]), v = x + dir * R.int(1, 9) * Math.pow(10, R.int(0, lv === 1 ? 2 : 3)); if (v > 0 && vals.indexOf(v) < 0) vals.push(v); }
        vals = R.shuffle(vals);
        var fits = function (v) { return more ? v > x : v < x; };
        return K.pick('Pick every number ' + (more ? 'greater' : 'less') + ' than <b>' + A.fmt(x) + '</b>.', vals, fits, A.fmt, {
          hint: 'Compare each one with ' + A.fmt(x) + ', starting from the left.', steps: ['Check each number. Find the first place where it differs from ' + A.fmt(x) + '.', 'A bigger digit there means a greater number.'],
          explain: 'The numbers ' + (more ? 'greater' : 'less') + ' than ' + A.fmt(x) + ': ' + vals.filter(fits).map(A.fmt).join(', ') + '.', meta: { k: 'g5pv-pick', x: x, more: more, vals: vals } });
      }],
      [2, 'mistake', function (lv) {
        var a = R.int(7, 9) * 1000 + R.int(7, 9) * 100 + R.int(70, 99), b = 10000 + R.int(0, 2) * 1000 + R.int(0, 299), who = nm();
        var right = A.fmt(b) + ' has 5 digits and ' + A.fmt(a) + ' has only 4, so ' + A.fmt(b) + ' is greater.';
        return K.tf(who, '<span class="math">' + A.fmt(a) + '</span> is greater than <span class="math">' + A.fmt(b) + '</span> because its digits are bigger.', a > b, right,
          ['Big digits always make a bigger number.', 'Compare the ones digits first.', 'Add up the digits. The bigger total wins.'],
          { hint: 'Count the digits in each number first.', meta: { k: 'g5pv-cmptf', a: a, b: b } });
      }]
    ],
    'pv-round': [
      [1, 'line', function (lv) {
        var p = lv === 1 ? R.pick([10, 100]) : 1000, n, lo;
        do { n = p === 10 ? R.int(101, 999) : p === 100 ? R.int(1001, 9999) : R.int(10001, 99999); lo = Math.floor(n / p) * p; } while (n === lo || n - lo === p / 2);
        var ans = nearest(n, p), name = { 10: 'ten', 100: 'hundred', 1000: 'thousand' }[p];
        return { q: 'Round <span class="math">' + A.fmt(n) + '</span> to the nearest <b>' + name + '</b>. Mark your answer on the line.', type: 'line', min: lo - p, max: lo + 2 * p, tick: p / 10, every: p, snap: p, answer: ans, tol: 0,
          fig: hill(n, p), hint: 'Is ' + A.fmt(n) + ' closer to ' + A.fmt(lo) + ' or to ' + A.fmt(lo + p) + '?', steps: ['The ' + name + 's on either side are ' + A.fmt(lo) + ' and ' + A.fmt(lo + p) + '.', 'Halfway is ' + A.fmt(lo + p / 2) + '. ' + A.fmt(n) + ' is ' + (n > lo + p / 2 ? 'past' : 'before') + ' halfway.', 'So it rounds to ' + A.fmt(ans) + '.'],
          explain: A.fmt(n) + ' rounds to ' + A.fmt(ans) + '.', meta: { k: 'g5pv-roundline', n: n, p: p } };
      }],
      [1, 'pick', function (lv) {
        var p = lv === 1 ? 100 : 1000, t = (lv === 1 ? R.int(11, 98) : R.int(11, 98)) * p, vals = [];
        while (vals.length < 5) { var v = t + R.int(-p, p); if (v !== t - p / 2 && v !== t + p / 2 && vals.indexOf(v) < 0) vals.push(v); }
        var fits = function (v) { return Math.abs(v - t) < p / 2; };
        if (!vals.some(fits)) vals[0] = t + R.int(1, p / 2 - 1);
        if (vals.every(fits)) vals[1] = t + p / 2 + R.int(1, p / 2 - 1);
        vals = vals.filter(function (v, i) { return vals.indexOf(v) === i; });
        return K.pick('Pick every number that rounds to <b>' + A.fmt(t) + '</b> (nearest ' + (p === 100 ? 'hundred' : 'thousand') + ').', vals, fits, A.fmt, {
          hint: 'A number rounds to ' + A.fmt(t) + ' if it is between ' + A.fmt(t - p / 2) + ' and ' + A.fmt(t + p / 2) + '.', steps: ['Halfway points are ' + A.fmt(t - p / 2) + ' and ' + A.fmt(t + p / 2) + '.', 'Pick the numbers between them.'],
          explain: 'These round to ' + A.fmt(t) + ': ' + vals.filter(fits).map(A.fmt).join(', ') + '.', meta: { k: 'g5pv-roundpick', t: t, p: p, vals: vals } });
      }],
      [1, 'mistake', function (lv) {
        var p = lv === 1 ? 100 : 1000, n, lo;
        do { n = p === 100 ? R.int(1001, 9999) : R.int(10001, 99999); lo = Math.floor(n / p) * p; } while (n - lo < p / 10 || n - lo === p / 2);
        var ans = nearest(n, p), who = nm(), truth = !R.int(0, 2), said = truth ? ans : (ans === lo ? lo + p : lo);
        var dg = Math.floor((n % p) / (p / 10)), name = p === 100 ? 'hundred' : 'thousand';
        var right = 'The digit after the ' + name + 's place is ' + dg + ', so ' + A.fmt(n) + ' rounds ' + (ans > lo ? 'up' : 'down') + ' to ' + A.fmt(ans) + '.';
        return K.tf(who, '<span class="math">' + A.fmt(n) + '</span> rounded to the nearest ' + name + ' is <b>' + A.fmt(said) + '</b>.', truth, right,
          ['Always round down, so the number gets smaller.', 'Look at the ones digit to decide.', 'Always round up, so you have enough.'],
          { hint: 'Look at the digit just right of the ' + name + 's place.', meta: { k: 'g5pv-roundtf', n: n, p: p, said: said } });
      }],
      [2, 'story', function (lv) {
        var c = R.pick(['fans came to a hockey game in Winnipeg', 'people ran a marathon in Ottawa', 'visitors came to a fair in Calgary']), n = R.int(10001, 99999), p = lv === 3 ? 10000 : 1000;
        if (n % p === p / 2) n++;
        var ans = nearest(n, p), name = p === 1000 ? 'thousand' : 'ten thousand';
        return { q: A.fmt(n) + ' ' + c + '. A reporter rounds to the nearest <b>' + name + '</b>. What number does the reporter write?', type: 'num', answer: ans,
          hint: 'Find the ' + name + 's on either side of ' + A.fmt(n) + '.', steps: ['The ' + name + 's on either side are ' + A.fmt(Math.floor(n / p) * p) + ' and ' + A.fmt(Math.floor(n / p) * p + p) + '.', 'Look at the next digit to the right to decide.'],
          explain: A.fmt(n) + ' rounds to ' + A.fmt(ans) + '.', meta: { k: 'g5pv-roundstory', n: n, p: p } };
      }]
    ]
  };
  Atlas.Q.shapes('place-value', SHAPES);
})();
