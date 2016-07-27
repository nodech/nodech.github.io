var nums = document.getElementById('nums');
var start = '<table>';
var end = '</table>';

for (var i = 0; i < 100; i++) {
  var html = '<tr>';
  for (var j = 0; j < 100; j++) {
    var num = j + (i * 100);

    if (num % 10 == 0) {
      html += '</tr><tr>';
    }

    var kind = whichNum('' + num);
    html += '<td class="type-' + kind + '">' + num + '</td>';
  }
  nums.innerHTML += start + html + end;
}

function whichNum(n) {
  n = n.split('').map((n) => +n)

  let highToLow = true;
  let lowToHigh = true;
  let equal = true;

  for (let i = 1; i < n.length; i++) {
    if (n[i-1] < n[i])  highToLow = false;
    if (n[i-1] > n[i])  lowToHigh = false;
    if (n[i-1] != n[i]) equal = false;
  }

  if (equal)     return 0;
  if (highToLow) return 1;
  if (lowToHigh) return 2;

  return -1;
}

