(function () {
  var A = Atlas, R = A.R;
  function clamp(v, a, b) { v = parseInt(v, 10); if (isNaN(v)) v = a; return Math.max(a, Math.min(b, v)); }
  var ATTR = {
    even: ['Even', function (n) { return n % 2 === 0; }],
    gt15: ['Greater than 15', function (n) { return n > 15; }],
    m5: ['Multiple of 5', function (n) { return n % 5 === 0; }],
    lt10: ['Less than 10', function (n) { return n < 10; }],
    odd: ['Odd', function (n) { return n % 2 === 1; }],
    gt10: ['Greater than 10', function (n) { return n > 10; }]
  };
  var NUMS = [3, 6, 8, 10, 12, 15, 17, 20, 22, 25, 27, 30];

  function venn(nums, a, b) {
    var fa = ATTR[a][1], fb = ATTR[b][1], s = '', reg = { a: [], b: [], ab: [], none: [] };
    nums.forEach(function (n) { var x = fa(n), y = fb(n); reg[x && y ? 'ab' : x ? 'a' : y ? 'b' : 'none'].push(n); });
    s += '<rect x="4" y="4" width="552" height="292" rx="14" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>';
    s += '<circle cx="210" cy="150" r="118" style="fill:color-mix(in srgb,var(--sb) 16%,transparent);stroke:var(--sb)" stroke-width="3"/>';
    s += '<circle cx="350" cy="150" r="118" style="fill:color-mix(in srgb,var(--se) 16%,transparent);stroke:var(--se)" stroke-width="3"/>';
    s += '<text x="150" y="26" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--sb)">' + ATTR[a][0] + '</text><text x="410" y="26" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--se)">' + ATTR[b][0] + '</text>';
    function place(list, cx, cy, cols) { var t = ''; list.forEach(function (n, i) { t += '<text x="' + (cx + ((i % cols) - (Math.min(list.length, cols) - 1) / 2) * 42) + '" y="' + (cy + Math.floor(i / cols) * 32) + '" text-anchor="middle" font-size="25" class="tb">' + n + '</text>'; }); return t; }
    s += place(reg.a, 160, 120, 3) + place(reg.ab, 280, 120, 1) + place(reg.b, 400, 120, 3) + place(reg.none, 280, 290, 8);
    return { svg: A.svg(560, 300, s, 'Venn diagram. ' + ATTR[a][0] + ' only: ' + (reg.a.join(', ') || 'none') + '. Both: ' + (reg.ab.join(', ') || 'none') + '. ' + ATTR[b][0] + ' only: ' + (reg.b.join(', ') || 'none') + '. Neither: ' + (reg.none.join(', ') || 'none') + '.'), reg: reg };
  }
  function carroll(nums, a, b) {
    var fa = ATTR[a][1], fb = ATTR[b][1], cell = function (x, y) { return nums.filter(function (n) { return fa(n) === x && fb(n) === y; }).join(', ') || '&ndash;'; };
    return '<div class="tbl"><table><thead><tr><th></th><th>' + ATTR[b][0] + '</th><th>Not ' + ATTR[b][0].toLowerCase() + '</th></tr></thead><tbody>' +
      '<tr><th class="l">' + ATTR[a][0] + '</th><td>' + cell(true, true) + '</td><td>' + cell(true, false) + '</td></tr>' +
      '<tr><th class="l">Not ' + ATTR[a][0].toLowerCase() + '</th><td>' + cell(false, true) + '</td><td>' + cell(false, false) + '</td></tr></tbody></table></div>';
  }
  function icon(x, y, part) {
    var r = 15;
    if (part >= 1) return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/><circle cx="' + (x - 5) + '" cy="' + (y - 3) + '" r="2.2" style="fill:#fff"/><circle cx="' + (x + 5) + '" cy="' + (y - 3) + '" r="2.2" style="fill:#fff"/><path d="M' + (x - 6) + ' ' + (y + 5) + ' Q' + x + ' ' + (y + 10) + ' ' + (x + 6) + ' ' + (y + 5) + '" fill="none" stroke="#fff" stroke-width="2"/>';
    var w = 2 * r * part;
    return '<clipPath id="cp' + x + '_' + y + '"><rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + w + '" height="' + 2 * r + '"/></clipPath><g clip-path="url(#cp' + x + '_' + y + ')">' + icon(x, y, 1) + '</g><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" style="stroke:var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>';
  }
  /* pictograph. data: [[name, count]], key: how many each picture stands for */
  function picto(title, data, key, src) {
    var maxP = Math.max.apply(null, data.map(function (d) { return Math.ceil(d[1] / key); })), W = Math.max(380, 170 + maxP * 36);
    var s = '<text x="' + W / 2 + '" y="24" text-anchor="middle" font-size="20" font-weight="700" style="font-family:var(--display)">' + title + '</text>', y = 56, uid = Math.random().toString(36).slice(2, 6);
    data.forEach(function (d) {
      s += '<text x="110" y="' + (y + 6) + '" text-anchor="end" font-size="18" class="tb">' + d[0] + '</text>';
      var full = Math.floor(d[1] / key), part = (d[1] % key) / key;
      for (var i = 0; i < full; i++) s += icon(140 + i * 36, y, 1);
      if (part) s += icon(140 + full * 36, y, part).replace(/cp(\d)/g, 'cp' + uid + '$1');
      y += 42;
    });
    s += icon(150, y + 4, 1) + '<text x="174" y="' + (y + 11) + '" font-size="18">= ' + key + ' ' + (key === 1 ? 'vote' : 'votes') + '</text>';
    if (src) s += '<text x="' + (W - 8) + '" y="' + (y + 40) + '" text-anchor="end" font-size="14" class="t2">Source: ' + src + '</text>';
    return A.svg(W, y + (src ? 50 : 24), s, 'Pictograph: ' + title + '. ' + data.map(function (d) { return d[0] + ' ' + d[1]; }).join(', ') + '. Each picture means ' + key + '.');
  }
  /* bar graph with a scale */
  function bars(title, data, step, src, ylab) {
    var max = Math.max.apply(null, data.map(function (d) { return d[1]; })), top = Math.max(step, Math.ceil(max / step) * step), H = 220, x0 = 70, W = 470, bw = W / data.length, s = '';
    s += '<text x="300" y="22" text-anchor="middle" font-size="20" font-weight="700" style="font-family:var(--display)">' + title + '</text>';
    for (var v = 0; v <= top; v += step) {
      var y = 260 - H * v / top;
      s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + W) + '" y2="' + y + '" style="stroke:var(--line)" stroke-width="1.5"/><text x="' + (x0 - 8) + '" y="' + (y + 6) + '" text-anchor="end" font-size="16">' + v + '</text>';
    }
    data.forEach(function (d, i) {
      var h = H * d[1] / top, x = x0 + i * bw + bw * 0.18;
      s += '<rect x="' + x + '" y="' + (260 - h) + '" width="' + bw * 0.64 + '" height="' + h + '" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/>' +
        '<text x="' + (x + bw * 0.32) + '" y="284" text-anchor="middle" font-size="17" class="tb">' + d[0] + '</text>';
    });
    s += '<line x1="' + x0 + '" y1="260" x2="' + (x0 + W) + '" y2="260" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="' + x0 + '" y1="260" x2="' + x0 + '" y2="36" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<text x="18" y="150" text-anchor="middle" font-size="15" class="t2" transform="rotate(-90 18 150)">' + (ylab || 'Number of votes') + '</text>';
    if (src) s += '<text x="540" y="306" text-anchor="end" font-size="14" class="t2">Source: ' + src + '</text>';
    return A.svg(560, 312, s, 'Bar graph: ' + title + '. ' + data.map(function (d) { return d[0] + ' ' + d[1]; }).join(', ') + '. The scale counts by ' + step + '.');
  }
  function tally(n) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var g = Math.floor(i / 5), k = i % 5, x = 6 + g * 46 + k * 8;
      s += k === 4 ? '<line x1="' + (x - 34) + '" y1="28" x2="' + (x + 2) + '" y2="8" style="stroke:var(--ink)" stroke-width="2.5"/>' : '<line x1="' + x + '" y1="6" x2="' + x + '" y2="32" style="stroke:var(--ink)" stroke-width="2.5"/>';
    }
    return A.svg(Math.max(40, Math.ceil(n / 5) * 46 + 8), 38, s, n + ' tally marks');
  }
  function towerFig(vals, mean) {
    var u = 20, w = 70, s = '', base = 230;
    vals.forEach(function (v, i) {
      for (var k = 0; k < v; k++) s += '<rect x="' + (20 + i * w) + '" y="' + (base - (k + 1) * u) + '" width="' + (w - 18) + '" height="' + (u - 2) + '" rx="3" style="fill:' + (k < mean ? 'var(--strand)' : 'var(--hi)') + ';stroke:var(--ink)" stroke-width="1.2"/>';
      s += '<text x="' + (20 + i * w + (w - 18) / 2) + '" y="' + (base + 22) + '" text-anchor="middle" font-size="18" class="tb">' + v + '</text>';
    });
    var my = base - mean * u;
    s += '<line x1="10" y1="' + my + '" x2="' + (20 + vals.length * w) + '" y2="' + my + '" style="stroke:var(--bad)" stroke-width="3" stroke-dasharray="7 5"/>';
    return A.svg(Math.max(300, 30 + vals.length * w), base + 30, s, 'Towers of ' + vals.join(', ') + ' cubes, with a line at ' + mean);
  }
  function spinner(red, blue, label) {
    var n = red + blue, r = 90, cx = 100, cy = 100, s = '';
    if (!n) return A.svg(200, 200, '<circle cx="100" cy="100" r="90" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>', 'An empty spinner');
    for (var i = 0; i < n; i++) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n, col = i < red ? 'var(--bad)' : 'var(--sb)';
      s += n === 1 ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2.5"/>' :
        '<path d="M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + ' Z" style="fill:' + col + ';stroke:var(--ink)" stroke-width="2.5"/>';
    }
    s += '<line x1="100" y1="100" x2="100" y2="30" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="8" style="fill:var(--ink)"/>';
    return A.svg(200, 200, s, label || 'Spinner with ' + red + ' red and ' + blue + ' blue equal parts');
  }
  function likely(fav, total) { return fav === 0 ? 'impossible' : fav === total ? 'certain' : fav * 2 === total ? 'equally likely' : fav * 2 < total ? 'unlikely' : 'likely'; }
  var SETS = {
    sport: { t: 'Favourite sport', src: 'Room 12 survey', d: [['Hockey', 12], ['Soccer', 9], ['Swim', 6], ['Basketball', 4]] },
    fruit: { t: 'Favourite fruit', src: 'Grade 3 survey', d: [['Apple', 8], ['Banana', 5], ['Grapes', 10], ['Orange', 3]] },
    pets: { t: 'Pets at home', src: 'Class interviews', d: [['Dog', 14], ['Cat', 10], ['Fish', 4], ['None', 7]] }
  };

  A.register('data', {
    html:
'<section class="sec"><h2><span class="n">1</span>Sorting with diagrams</h2>' +
'<p>We can sort things by their <b>attributes</b>, like "even" or "greater than 15". A <b>Venn diagram</b> uses circles. Things that fit both go where the circles overlap. A <b>Carroll diagram</b> uses a table with rows and columns.</p>' +
'<div class="lab"><span class="lt">Try it: sort 12 numbers</span>' +
'<p class="t2" style="margin:.2em 0">Numbers: ' + NUMS.join(', ') + '</p>' +
'<div class="ctrl"><label for="vna">First attribute<select id="vna"><option value="even" selected>Even</option><option value="odd">Odd</option><option value="lt10">Less than 10</option></select></label>' +
'<label for="vnb">Second attribute<select id="vnb"><option value="gt15" selected>Greater than 15</option><option value="m5">Multiple of 5</option></select></label>' +
'<label for="vnt">Diagram<select id="vnt"><option value="venn">Venn</option><option value="carroll">Carroll</option></select></label></div>' +
'<div class="fig" id="vnfig"></div><div class="out" id="vnout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To sort by three attributes, use a <b>tree diagram</b>. Each branch asks a yes or no question, one attribute at a time.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Where does 20 go in the Venn diagram for "Even" and "Greater than 15"? 20 is even. 20 is greater than 15. It fits both, so it goes in the <b>middle</b>, where the circles overlap.</p></div>' +
'<div class="yt" data-yt="s1"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Collecting data and tallies</h2>' +
'<p>To answer a question, collect <b>data</b>. You can ask people (an interview), watch (an observation), or test (an experiment). Data in words, like "apple", is <b>qualitative</b>. Data in numbers, like "8 cm tall", is <b>quantitative</b>.</p>' +
'<p>Keep count with <b>tally marks</b>. Every fifth mark crosses the other four, so you can count by 5s. A <b>frequency table</b> shows how many of each.</p>' +
'<div class="lab"><span class="lt">Try it: run a class survey</span>' +
'<p style="margin:.2em 0">Question: <b>What is your favourite season?</b> Tap to add a vote.</p>' +
'<div class="btnrow"><button type="button" class="btn alt" data-v="0">Winter</button><button type="button" class="btn alt" data-v="1">Spring</button><button type="button" class="btn alt" data-v="2">Summer</button><button type="button" class="btn alt" data-v="3">Fall</button><button type="button" class="btn alt" id="svreset">Start over</button></div>' +
'<div class="tbl" id="svtbl"></div><div class="fig" id="svfig"></div><div class="out" id="svout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting a tally of 5 as 4. The slanted mark is the fifth one. A tally of 3 groups of 5 and 2 more is 17.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Read this tally: two groups of 5 and 3 more. Count by 5s: 5, 10, then 11, 12, 13. That is <b>13</b>.</p><div class="fig">' + tally(13) + '</div></div>' +
'<div class="yt" data-yt="s2"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Pictographs and bar graphs</h2>' +
'<p>Graphs show data as a picture. In a <b>pictograph</b>, one picture can stand for more than one, like 2 votes. Check the <b>key</b>. In a <b>bar graph</b>, read the <b>scale</b> on the side. It might count by 1s, 2s, 5s or 10s. Every graph needs a <b>title</b>, <b>labels</b> and a <b>source</b>, which tells where the data came from.</p>' +
'<div class="lab"><span class="lt">Try it: change the key and the scale</span>' +
'<div class="ctrl"><label for="gds">Data<select id="gds"><option value="sport">Favourite sport</option><option value="fruit">Favourite fruit</option><option value="pets">Pets at home</option></select></label>' +
'<label for="gdk">Pictograph key: 1 picture =<select id="gdk"><option>1</option><option selected>2</option><option>5</option></select></label>' +
'<label for="gdc">Bar graph scale counts by<select id="gdc"><option>1</option><option selected>2</option><option>5</option><option>10</option></select></label></div>' +
'<div class="fig" id="gdpic"></div><div class="fig" id="gdbar"></div><div class="out" id="gdout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The same data can look different when the key or scale changes. Always read the key or scale before you count.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>The key says 1 picture = 2 votes. Swim has 3 pictures and half a picture. Count by 2s: 2, 4, 6. Half a picture is half of 2, which is 1. Swim has <b>7 votes</b>.</p><div class="fig">' + picto('Favourite activity', [['Swim', 7]], 2) + '</div></div>' +
'<div class="yt" data-yt="s3"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Mean and mode</h2>' +
'<p>The <b>mode</b> is the value that shows up most often. A data set can have one mode, more than one mode, or no mode.</p>' +
'<p>The <b>mean</b> is a fair share. Imagine making all the towers the same height by moving cubes. The height they all end up at is the mean. To find it, add all the values, then divide by how many values there are.</p>' +
'<div class="lab"><span class="lt">Try it: level the towers</span>' +
'<div class="ctrl"><label for="mt1">Tower 1: <output id="mt1o"></output><input type="range" id="mt1" min="1" max="9" value="3"></label><label for="mt2">Tower 2: <output id="mt2o"></output><input type="range" id="mt2" min="1" max="9" value="7"></label>' +
'<label for="mt3">Tower 3: <output id="mt3o"></output><input type="range" id="mt3" min="1" max="9" value="4"></label><label for="mt4">Tower 4: <output id="mt4o"></output><input type="range" id="mt4" min="1" max="9" value="6"></label></div>' +
'<div class="fig" id="mtfig"></div><div class="out" id="mtout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Mixing up mean and mode. Mode = most common. Mean = fair share. In 2, 2, 8 the mode is 2, but the mean is 12 &divide; 3 = 4.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>Three friends read 4, 6 and 8 books. Add: 4 + 6 + 8 = 18. Share among 3: 18 &divide; 3 = 6. The mean is <b>6 books</b>. Every value is different, so there is <b>no mode</b>.</p><div class="fig">' + towerFig([4, 6, 8], 6) + '</div></div>' +
'<div class="yt" data-yt="s4"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>How likely is it?</h2>' +
'<p>We use words to say how likely something is: <b>impossible</b>, <b>unlikely</b>, <b>equally likely</b>, <b>likely</b>, <b>certain</b>. If something is impossible, its opposite is certain.</p>' +
'<div class="lab"><span class="lt">Try it: build a spinner</span>' +
'<div class="ctrl"><label for="spr">Red parts: <output id="spro"></output><input type="range" id="spr" min="0" max="8" value="3"></label><label for="spb">Blue parts: <output id="spbo"></output><input type="range" id="spb" min="0" max="8" value="5"></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="spgo">Spin 20 times</button></div>' +
'<div class="fig" id="spfig"></div><div class="out" id="spout" aria-live="polite"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Data from a different group can come out differently. If one class has a mode of "hockey", another class might have "soccer". Make a prediction, then collect data to test it.</p></div>' +
'<div class="eg"><b class="t">Watch first</b><p>A bag has 9 green cubes and 1 yellow cube. Picking green is <b>likely</b>. Picking yellow is <b>unlikely</b>. Picking purple is <b>impossible</b>.</p></div>' +
'<div class="yt" data-yt="s5"></div>' +
'</section>',

    turns: {
      s1: [
        { q: 'Where does 12 go? Circles: "Even" and "Greater than 15".', options: ['Even only', 'Greater than 15 only', 'Both', 'Neither'], answer: 0, why: '12 is even, but 12 is not greater than 15.' },
        { q: 'Where does 17 go? Circles: "Even" and "Greater than 15".', options: ['Even only', 'Greater than 15 only', 'Both', 'Neither'], answer: 1, why: '17 is odd, and 17 is greater than 15.' },
        { q: 'Where does 7 go? Circles: "Even" and "Greater than 15".', options: ['Even only', 'Greater than 15 only', 'Both', 'Neither'], answer: 3, why: '7 is odd and less than 15, so it goes outside both circles.' }
      ],
      s2: [
        { q: 'How many does this tally show?', fig: tally(8), options: ['5', '8', '9'], answer: 1, why: 'One group of 5, then 3 more: 5, 6, 7, 8.' },
        { q: 'Which question gives quantitative data?', options: ['What is your favourite colour?', 'How many pets do you have?', 'What is your favourite game?'], answer: 1, why: 'Quantitative data is numbers. The answer to "how many" is a number.' },
        { q: 'How many does this tally show?', fig: tally(15), options: ['13', '15', '18'], answer: 1, why: 'Three groups of 5: 5, 10, 15.' }
      ],
      s3: [
        { q: 'Key: 1 picture = 2 votes. Soccer has 4 pictures. How many votes?', options: ['4', '6', '8'], answer: 2, why: 'Count by 2s for each picture: 2, 4, 6, 8.' },
        { q: 'Key: 1 picture = 2 votes. Swim has 3 and a half pictures. How many votes?', options: ['6', '7', '8'], answer: 1, why: '3 pictures are 6 votes. Half a picture is 1 vote. 6 + 1 = 7.' },
        { q: 'A bar ends halfway between 10 and 20 on the scale. What does it show?', options: ['12', '15', '18'], answer: 1, why: 'Halfway between 10 and 20 is 15.' }
      ],
      s4: [
        { q: 'What is the mode of 3, 5, 5, 6, 9?', options: ['5', '6', '9'], answer: 0, why: '5 shows up twice. Every other value shows up once.' },
        { q: 'What is the mean of 2, 4, 6?', options: ['4', '6', '12'], answer: 0, why: 'Add: 2 + 4 + 6 = 12. Share among 3: 12 &divide; 3 = 4.' },
        { q: 'Does 1, 4, 7, 8 have a mode?', options: ['Yes, 4', 'Yes, 8', 'No mode'], answer: 2, why: 'Each value shows up only once, so there is no mode.' }
      ],
      s5: [
        { q: 'A spinner is all blue. Spinning blue is:', options: ['certain', 'likely', 'impossible'], answer: 0, why: 'Every part is blue, so it must land on blue.' },
        { q: 'A spinner has 1 red part and 1 blue part, the same size. Spinning red is:', options: ['unlikely', 'equally likely', 'certain'], answer: 1, why: 'Red and blue have the same amount of space.' },
        { q: 'A bag has 2 red and 8 blue cubes. Picking red is:', options: ['likely', 'unlikely', 'impossible'], answer: 1, why: 'There are fewer red cubes than blue cubes, but red is still possible.' }
      ]
    },

    init: function (root) {
      var $ = A.$;
      function vn() {
        var a = $('#vna', root).value, b = $('#vnb', root).value, t = $('#vnt', root).value;
        var v = venn(NUMS, a, b);
        $('#vnfig', root).innerHTML = t === 'venn' ? v.svg : carroll(NUMS, a, b);
        $('#vnout', root).innerHTML = '<p><b>Both:</b> ' + (v.reg.ab.join(', ') || 'none') + '. <b>' + ATTR[a][0] + ' only:</b> ' + (v.reg.a.join(', ') || 'none') + '. <b>' + ATTR[b][0] + ' only:</b> ' + (v.reg.b.join(', ') || 'none') + '. <b>Neither:</b> ' + (v.reg.none.join(', ') || 'none') + '.</p>';
      }
      A.bind(root, ['vna', 'vnb', 'vnt'], vn);
      var votes = [3, 5, 8, 6], names = ['Winter', 'Spring', 'Summer', 'Fall'];
      function sv() {
        $('#svtbl', root).innerHTML = '<table><thead><tr><th class="l">Season</th><th class="l">Tally</th><th>Frequency</th></tr></thead><tbody>' + names.map(function (n, i) { return '<tr><td class="l">' + n + '</td><td class="l">' + tally(votes[i]) + '</td><td>' + votes[i] + '</td></tr>'; }).join('') + '</tbody></table>';
        var tot = votes.reduce(function (x, y) { return x + y; }, 0), mx = Math.max.apply(null, votes), top = names.filter(function (n, i) { return votes[i] === mx && mx > 0; });
        $('#svfig', root).innerHTML = tot ? bars('Favourite season', names.map(function (n, i) { return [n, votes[i]]; }), mx > 20 ? 5 : mx > 10 ? 2 : 1, 'Our class survey') : '';
        $('#svout', root).innerHTML = '<p>' + tot + ' votes in all.' + (top.length ? ' Most votes: <b>' + top.join(' and ') + '</b> (' + mx + ').' : '') + '</p>';
      }
      root.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-v'); if (votes[i] < 40) votes[i]++; sv(); }); });
      $('#svreset', root).addEventListener('click', function () { votes = [0, 0, 0, 0]; sv(); });
      sv();
      function gd() {
        var d = SETS[$('#gds', root).value], k = +$('#gdk', root).value, c = +$('#gdc', root).value;
        $('#gdpic', root).innerHTML = picto(d.t, d.d, k, d.src);
        $('#gdbar', root).innerHTML = bars(d.t, d.d, c, d.src);
        var first = d.d[0], pics = first[1] / k;
        $('#gdout', root).innerHTML = '<p>' + first[0] + ' has ' + first[1] + ' votes. With a key of ' + k + ', that is ' + (pics === Math.floor(pics) ? pics : Math.floor(pics) + ' and a part') + ' picture' + (pics === 1 ? '' : 's') + '.' +
          (first[1] % k ? ' A part of a picture stands for ' + first[1] % k + ' vote' + (first[1] % k > 1 ? 's' : '') + '.' : '') + ' Most votes: <b>' + d.d.slice().sort(function (x, y) { return y[1] - x[1]; })[0][0] + '</b>.</p>';
      }
      A.bind(root, ['gds', 'gdk', 'gdc'], gd);
      function mt() {
        var v = [1, 2, 3, 4].map(function (i) { var x = +$('#mt' + i, root).value; $('#mt' + i + 'o', root).textContent = x; return x; });
        var sum = v.reduce(function (x, y) { return x + y; }, 0), q = Math.floor(sum / 4), r = sum % 4, cnt = {}, best = 0, modes = [];
        v.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; best = Math.max(best, cnt[x]); });
        Object.keys(cnt).forEach(function (k) { if (cnt[k] === best && best > 1) modes.push(+k); });
        $('#mtfig', root).innerHTML = towerFig(v, r ? sum / 4 : q);
        $('#mtout', root).innerHTML = '<p><b>Mean:</b> ' + v.join(' + ') + ' = ' + sum + '. ' + sum + ' &divide; 4 = ' + (r ? q + ' with ' + r + ' left over, so the mean is between ' + q + ' and ' + (q + 1) : '<span class="big">' + q + '</span>') + '.</p>' +
          '<p><b>Mode:</b> ' + (modes.length ? modes.sort(function (a, b) { return a - b; }).join(' and ') + (modes.length > 1 ? ' (two modes)' : '') : 'no mode, because no value shows up more than once') + '.</p>';
      }
      A.bind(root, ['mt1', 'mt2', 'mt3', 'mt4'], mt);
      var spins = null;
      function sp() {
        var r = +$('#spr', root).value, b = +$('#spb', root).value;
        $('#spro', root).textContent = r; $('#spbo', root).textContent = b;
        $('#spgo', root).disabled = r + b === 0;
        $('#spfig', root).innerHTML = spinner(r, b);
        var msg = r + b === 0 ? 'Add some parts to the spinner.' : 'Landing on red is <b>' + likely(r, r + b) + '</b>. Landing on blue is <b>' + likely(b, r + b) + '</b>.';
        $('#spout', root).innerHTML = '<p>' + msg + '</p>' + (spins ? '<p>Last 20 spins: <b>' + spins[0] + ' red</b> and <b>' + spins[1] + ' blue</b>. Spin again and the counts change a little, but the more likely colour usually wins.</p>' : '');
      }
      A.bind(root, ['spr', 'spb'], function () { spins = null; sp(); });
      $('#spgo', root).addEventListener('click', function () {
        var r = +$('#spr', root).value, b = +$('#spb', root).value, c = [0, 0];
        for (var i = 0; i < 20; i++) c[Math.random() * (r + b) < r ? 0 : 1]++;
        spins = c; sp();
      });
    },

    quiz: [
      { q: 'Where does 25 go? Circles: "Odd" and "Multiple of 5".', type: 'mc', options: ['Odd only', 'Multiple of 5 only', 'Both', 'Neither'], answer: 2,
        hint: 'Is 25 odd? Is 25 a multiple of 5?', explain: '25 is odd and it is a multiple of 5, so it goes where the circles overlap.' },
      { q: 'How many votes did Grapes get?', type: 'num', answer: 10, fig: picto('Favourite fruit', [['Apple', 8], ['Banana', 5], ['Grapes', 10], ['Orange', 3]], 2, 'Grade 3 survey'),
        hint: 'Each picture means 2 votes. Count by 2s.', explain: 'Grapes has 5 pictures: 2, 4, 6, 8, 10.' },
      { q: 'How many more people chose Hockey than Swim?', type: 'num', answer: 6, fig: bars('Favourite sport', [['Hockey', 12], ['Soccer', 9], ['Swim', 6], ['Basketball', 4]], 2, 'Room 12 survey'),
        hint: 'Read both bars on the scale. Then subtract.', explain: 'Hockey is 12 and Swim is 6. 12 &minus; 6 = 6.' },
      { q: 'What is the mode of 4, 7, 7, 2, 7, 4?', type: 'num', answer: 7,
        hint: 'Which number shows up the most times?', explain: '7 shows up 3 times. That is more than any other value.' },
      { q: 'Four plants grew 3 cm, 5 cm, 6 cm and 10 cm. What is the mean?', type: 'num', answer: 6, unit: 'cm',
        hint: 'Add the four values, then share by 4.', explain: '3 + 5 + 6 + 10 = 24. 24 &divide; 4 = 6 cm.' },
      { q: 'This spinner has 1 red part and 3 blue parts. Landing on red is:', type: 'mc', options: ['impossible', 'unlikely', 'equally likely', 'likely'], answer: 1, fig: spinner(1, 3),
        hint: 'Is there more red or more blue?', explain: 'Red takes up less of the spinner than blue, so red is unlikely, but it can happen.' },
      { q: 'Which is <b>quantitative</b> data?', type: 'mc', options: ['Favourite colours', 'Heights of plants in cm', 'Names of pets', 'Kinds of trees'], answer: 1,
        hint: 'Quantitative data is numbers you can measure or count.', explain: 'Heights in centimetres are numbers.' }
    ],

    practice: [
      { id: 'dt-venn', name: 'Venn and Carroll diagrams', code: 'D1.1', gen: function (lv) {
        var pairs = [['even', 'gt15'], ['odd', 'm5'], ['lt10', 'm5'], ['even', 'gt10']], pr = R.pick(pairs), a = pr[0], b = pr[1], n = R.int(1, lv === 1 ? 20 : 30);
        var fa = ATTR[a][1](n), fb = ATTR[b][1](n), right = fa && fb ? 'Both' : fa ? ATTR[a][0] + ' only' : fb ? ATTR[b][0] + ' only' : 'Neither';
        var opts = [ATTR[a][0] + ' only', ATTR[b][0] + ' only', 'Both', 'Neither'];
        return { q: 'Where does <b>' + n + '</b> go? Circles: "' + ATTR[a][0] + '" and "' + ATTR[b][0] + '".', type: 'mc', options: opts, answer: opts.indexOf(right),
          fig: lv === 1 ? venn([], a, b).svg : '',
          hint: 'Ask two questions. Is ' + n + ' ' + ATTR[a][0].toLowerCase() + '? Is it ' + ATTR[b][0].toLowerCase() + '?',
          steps: ['Is ' + n + ' ' + ATTR[a][0].toLowerCase() + '? ' + (fa ? 'Yes.' : 'No.'), 'Is ' + n + ' ' + ATTR[b][0].toLowerCase() + '? ' + (fb ? 'Yes.' : 'No.'), 'So it goes in: ' + right + '.'],
          explain: n + ' goes in: ' + right + '.' };
      } },
      { id: 'dt-picto', name: 'Read a pictograph', code: 'D1.3', gen: function (lv) {
        var key = lv === 1 ? 2 : R.pick([2, 5, 10]), names = R.pick([['Hockey', 'Soccer', 'Swim', 'Skating'], ['Apple', 'Pear', 'Plum', 'Kiwi'], ['Bus', 'Car', 'Walk', 'Bike']]);
        var data = names.map(function (n) { return [n, key * R.int(1, 6) + (key === 2 && lv > 1 && R.int(0, 1) ? 1 : 0)]; });
        var t = 'How we ' + (names[0] === 'Bus' ? 'get to school' : 'voted'), i = R.int(0, 3), j = (i + R.int(1, 3)) % 4;
        var fig = picto(t, data, key, 'Class survey');
        if (lv === 3) {
          var hi = data[i][1] >= data[j][1] ? i : j, lo = hi === i ? j : i;
          if (data[hi][1] === data[lo][1]) data[hi][1] += key, fig = picto(t, data, key, 'Class survey');
          return { q: 'How many more chose ' + data[hi][0] + ' than ' + data[lo][0] + '?', type: 'num', answer: data[hi][1] - data[lo][1], fig: fig,
            hint: 'Find each number using the key. Then subtract.', steps: ['Each picture means ' + key + '.', data[hi][0] + ': ' + data[hi][1] + '. ' + data[lo][0] + ': ' + data[lo][1] + '.', data[hi][1] + ' &minus; ' + data[lo][1] + ' = ' + (data[hi][1] - data[lo][1]) + '.'],
            explain: (data[hi][1] - data[lo][1]) + ' more chose ' + data[hi][0] + '.' };
        }
        return { q: 'How many chose ' + data[i][0] + '?', type: 'num', answer: data[i][1], fig: fig,
          hint: 'Read the key first. Each picture means ' + key + '.',
          steps: ['The key says 1 picture = ' + key + '.', data[i][0] + ' has ' + Math.floor(data[i][1] / key) + ' whole picture' + (Math.floor(data[i][1] / key) === 1 ? '' : 's') + (data[i][1] % key ? ' and a half picture' : '') + '.', 'Count by ' + key + 's' + (data[i][1] % key ? ' and add 1 for the half' : '') + ': ' + data[i][1] + '.'],
          explain: data[i][0] + ' got ' + data[i][1] + '.' };
      } },
      { id: 'dt-bar', name: 'Read a bar graph', code: 'D1.5', gen: function (lv) {
        var step = lv === 1 ? 1 : R.pick([2, 5]), names = R.pick([['Red', 'Blue', 'Green', 'Yellow'], ['Mon', 'Tue', 'Wed', 'Thu'], ['Cats', 'Dogs', 'Fish', 'Birds']]);
        var data = names.map(function (n) { return [n, step * R.int(1, lv === 1 ? 8 : 9)]; }), i = R.int(0, 3);
        var t = names[0] === 'Mon' ? 'Books read each day' : names[0] === 'Red' ? 'Favourite colour' : 'Favourite pet', fig = bars(t, data, step, 'Class survey');
        if (lv === 3) {
          var tot = data.reduce(function (x, d) { return x + d[1]; }, 0);
          return { q: 'How many votes are there in all?', type: 'num', answer: tot, fig: fig, hint: 'Read every bar. Then add them up.',
            steps: ['The scale counts by ' + step + '.', 'The bars show ' + data.map(function (d) { return d[1]; }).join(', ') + '.', 'Add: ' + data.map(function (d) { return d[1]; }).join(' + ') + ' = ' + tot + '.'], explain: 'There are ' + tot + ' votes in all.' };
        }
        return { q: 'What does the bar for ' + data[i][0] + ' show?', type: 'num', answer: data[i][1], fig: fig,
          hint: 'Find the top of the bar. Look across to the scale. The scale counts by ' + step + '.',
          steps: ['The scale counts by ' + step + '.', 'Follow the top of the ' + data[i][0] + ' bar across to the scale.', 'It lines up with ' + data[i][1] + '.'],
          explain: 'The ' + data[i][0] + ' bar shows ' + data[i][1] + '.' };
      } },
      { id: 'dt-mode', name: 'Find the mode', code: 'D1.4', gen: function (lv) {
        var m = R.int(1, 12), list = [m, m], n = lv === 1 ? 5 : 7;
        if (lv > 1) list.push(m);
        var others = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(function (x) { return x !== m; }));
        var k = 0;
        while (list.length < n) { list.push(others[k]); if (lv === 3 && k === 0 && list.length < n) list.push(others[k]); k++; }
        list = R.shuffle(list);
        var sorted = list.slice().sort(function (a, b) { return a - b; });
        return { q: 'What is the mode of <span class="math">' + list.join(', ') + '</span>?', type: 'num', answer: m,
          hint: 'Put the numbers in order. Look for the one that shows up most often.',
          steps: ['In order: ' + sorted.join(', ') + '.', m + ' shows up ' + list.filter(function (x) { return x === m; }).length + ' times. No other number shows up that often.', 'The mode is ' + m + '.'],
          explain: 'The mode is ' + m + '.' };
      } },
      { id: 'dt-mean', name: 'Find the mean', code: 'D1.4', gen: function (lv) {
        var n = lv === 1 ? 2 : lv === 2 ? 3 : R.pick([4, 5]), mean = R.int(2, 9), list = [];
        for (var i = 0; i < n; i++) list.push(mean);
        for (var t = 0; t < n * 2; t++) { var a = R.int(0, n - 1), b = R.int(0, n - 1), d = R.int(1, 3); if (a !== b && list[a] - d >= 1 && list[b] + d <= 15) { list[a] -= d; list[b] += d; } }
        var sum = list.reduce(function (x, y) { return x + y; }, 0);
        return { q: 'What is the mean of <span class="math">' + list.join(', ') + '</span>?', type: 'num', answer: mean,
          fig: lv === 1 ? towerFig(list, mean) : '',
          hint: 'Add all the values. Then divide by how many values there are (' + n + ').',
          steps: ['Add: ' + list.join(' + ') + ' = ' + sum + '.', 'There are ' + n + ' values.', sum + ' &divide; ' + n + ' = ' + mean + '.<div class="fig">' + towerFig(list, mean) + '</div>'],
          explain: 'The mean is ' + mean + '.' };
      } },
      { id: 'dt-chance', name: 'How likely?', code: 'D2.1', gen: function (lv) {
        var tot = R.int(4, 10), fav = lv === 1 ? R.pick([0, tot]) : lv === 2 ? R.pick([R.int(1, Math.floor((tot - 1) / 2)), R.int(Math.ceil((tot + 1) / 2), tot - 1)]) : R.pick([0, tot, R.int(1, tot - 1), tot % 2 ? 1 : tot / 2]);
        var colour = R.pick(['red', 'green', 'yellow']), other = colour === 'red' ? 'blue' : 'red', ans = likely(fav, tot), opts = ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'];
        return { q: 'A bag has ' + fav + ' ' + colour + ' cube' + (fav === 1 ? '' : 's') + ' and ' + (tot - fav) + ' ' + other + ' cube' + (tot - fav === 1 ? '' : 's') + '. Picking ' + colour + ' without looking is:', type: 'mc', options: opts, answer: opts.indexOf(ans),
          fig: spinner(fav, tot - fav, fav + ' ' + colour + ' and ' + (tot - fav) + ' ' + other).replace(/var\(--bad\)/g, colour === 'red' ? 'var(--bad)' : colour === 'green' ? 'var(--sd)' : 'var(--hi)').replace(/var\(--sb\)/g, other === 'red' ? 'var(--bad)' : 'var(--sb)'),
          hint: 'Compare the number of ' + colour + ' cubes with the number of ' + other + ' cubes.',
          steps: ['There are ' + fav + ' ' + colour + ' out of ' + tot + ' cubes.', fav === 0 ? 'There are no ' + colour + ' cubes at all.' : fav === tot ? 'Every cube is ' + colour + '.' : fav * 2 === tot ? 'Half the cubes are ' + colour + '.' : fav * 2 < tot ? 'Fewer than half are ' + colour + '.' : 'More than half are ' + colour + '.', 'So picking ' + colour + ' is ' + ans + '.'],
          explain: 'Picking ' + colour + ' is ' + ans + '.' };
      } }
    ]
  });
})();
