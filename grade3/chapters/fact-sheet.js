(function () {
  var A = Atlas;
  function frBars() {
    var D = [1, 2, 3, 4, 5, 6, 8, 10], s = '', W = 400, x0 = 54;
    D.forEach(function (d, r) {
      var y = 4 + r * 40, cw = (W - x0 - 4) / d;
      s += '<text x="' + (x0 - 10) + '" y="' + (y + 24) + '" text-anchor="end" font-size="17" class="tb">' + (d === 1 ? '1' : '1/' + d) + '</text>';
      for (var i = 0; i < d; i++) s += '<rect x="' + (x0 + i * cw) + '" y="' + y + '" width="' + cw + '" height="34" style="fill:color-mix(in srgb,var(--sc) ' + (i === 0 ? 55 : 14) + '%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
    });
    return A.svg(W, 4 + D.length * 40, s, 'Fraction strips: one whole, then halves, thirds, fourths, fifths, sixths, eighths and tenths. More parts means smaller parts.');
  }
  function compass() {
    var s = '<circle cx="100" cy="100" r="62" style="fill:var(--card);stroke:var(--ink)" stroke-width="3"/>' +
      '<polygon points="100,44 110,100 100,156 90,100" style="fill:var(--strand)"/><polygon points="44,100 100,90 156,100 100,110" style="fill:var(--ink2)"/>' +
      '<text x="100" y="26" text-anchor="middle" font-size="20" class="tb">N</text><text x="100" y="190" text-anchor="middle" font-size="20" class="tb">S</text>' +
      '<text x="182" y="107" text-anchor="middle" font-size="20" class="tb">E</text><text x="18" y="107" text-anchor="middle" font-size="20" class="tb">W</text>';
    return A.svg(200, 200, s, 'A compass. North is up, south is down, east is right, west is left.');
  }
  function row(n) { var c = ''; for (var i = 1; i <= 10; i++) c += '<td>' + n * i + '</td>'; return '<tr><th class="l">&times; ' + n + '</th>' + c + '</tr>'; }

  A.register('fact-sheet', {
    html:
'<section class="sec"><h2><span class="n">1</span>Place value</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Place</th><th>Value</th><th class="l">Blocks</th></tr></thead><tbody>' +
'<tr><td class="l">Thousands</td><td>1000</td><td class="l">10 flats</td></tr><tr><td class="l">Hundreds</td><td>100</td><td class="l">a flat (10 rods)</td></tr><tr><td class="l">Tens</td><td>10</td><td class="l">a rod (10 cubes)</td></tr><tr><td class="l">Ones</td><td>1</td><td class="l">a small cube</td></tr></tbody></table></div>' +
'<p>347 = 3 hundreds + 4 tens + 7 ones = 300 + 40 + 7. Ten of a place makes 1 of the next place. Round to the nearest 10 or 100: 5 or more rounds up.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Facts of 2, 5 and 10</h2>' +
'<div class="tbl"><table><thead><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr></thead><tbody>' + row(2) + row(5) + row(10) + '</tbody></table></div>' +
'<p>Multiplying is adding equal groups. 4 &times; 5 = 5 + 5 + 5 + 5 = 20. Each fact has a division partner: 4 &times; 5 = 20, so 20 &divide; 5 = 4 and 20 &divide; 4 = 5. Order does not matter: 3 &times; 2 = 2 &times; 3.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Fractions</h2>' +
'<div class="fig">' + frBars() + '</div>' +
'<p>The bottom number tells how many <b>equal parts</b> make the whole. The top number tells how many parts we have. More parts means each part is smaller: 1/8 is less than 1/4. 2 halves, 3 thirds and 4 fourths each make 1 whole. 1/2 = 2/4.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Measurement</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Length</th><th class="l">Time</th><th class="l">Money</th></tr></thead><tbody>' +
'<tr><td class="l">1 cm = 10 mm</td><td class="l">1 minute = 60 seconds</td><td class="l">nickel = 5¢</td></tr>' +
'<tr><td class="l">1 m = 100 cm</td><td class="l">1 hour = 60 minutes</td><td class="l">dime = 10¢, quarter = 25¢</td></tr>' +
'<tr><td class="l">1 km = 1000 m</td><td class="l">1 day = 24 hours</td><td class="l">loonie = $1, toonie = $2</td></tr></tbody></table></div>' +
'<p><b>Perimeter</b>: add all the sides. <b>Area</b>: count the squares that cover the shape, with no gaps and no overlaps. Small areas use cm&sup2;, big areas use m&sup2;. <b>Mass</b>: the heavier side of a pan balance goes down. <b>Capacity</b>: fill each cup to the top. <b>Change</b>: count up from the price to the money you paid.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>3D objects and directions</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Object</th><th>Faces</th><th>Edges</th><th>Vertices</th></tr></thead><tbody>' +
'<tr><td class="l">cube</td><td>6</td><td>12</td><td>8</td></tr><tr><td class="l">rectangular prism</td><td>6</td><td>12</td><td>8</td></tr><tr><td class="l">triangular prism</td><td>5</td><td>9</td><td>6</td></tr>' +
'<tr><td class="l">square-based pyramid</td><td>5</td><td>8</td><td>5</td></tr><tr><td class="l">triangular pyramid</td><td>4</td><td>6</td><td>4</td></tr></tbody></table></div>' +
'<p>Curved objects: a <b>cylinder</b> has 2 flat faces (circles) and 1 curved surface. A <b>cone</b> has 1 flat face (a circle), 1 curved surface and 1 point.</p>' +
'<div class="fig">' + compass() + '</div>' +
'<p>A quarter turn right from north faces east. A half turn faces the opposite way. Four quarter turns make a full turn.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Data and chance</h2>' +
'<p><b>Mode</b>: the value that shows up most often. <b>Mean</b>: share the total equally. Add the values, then divide by how many there are. 2, 4 and 6 add to 12, and 12 &divide; 3 = 4.</p>' +
'<p><b>Chance words</b>, from least to most likely: impossible, unlikely, equally likely, likely, certain.</p>' +
'</section>'
  });
})();
