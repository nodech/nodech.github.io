import moment from 'moment';
import Dragdealer from 'dragdealer';
import {poopBack} from './poo';

let startTime = moment('01/04/16', 'DD/MM/YY');
let endTime = moment('01/04/18', 'DD/MM/YY');

let baseDebt = 3480;

let startTimeN = startTime.unix();
let endTimeN = endTime.unix();

let topay = document.getElementById('topay')
let baseInput = topay.querySelector('input[name="base"]');

let dragText = document.querySelector('#select .handle');
let dragdealer = new Dragdealer('select', {
  animationCallback : (x) => {
    poopBack(x);
    calculate(x);
  }
});

function calculate(n) {
  let gelSym = Math.ceil(n * 8);
  gelSym = gelSym == 0 ? 1 : gelSym;

  let curTime = Math.ceil(n * (endTimeN - startTimeN));
  let date = moment(startTimeN + curTime, 'X');

  dragText.innerHTML = date.format('DD/MM/YYYY');

  baseInput.setAttribute('class', 'money money-' + gelSym);
  baseInput.value = calculateDebt(date);
}

function calculateDebt(date) {
  var year = date.year();
  var month = date.month() + 1;

  if (year === 2016) {
    return baseDebt + ' + ' + calculate2016(baseDebt, 0, month);
  }

  let prev = calculate2016(baseDebt, 0, 13) + baseDebt;

  if (year === 2017) {
    return calculate2017(prev, month).toFixed(2);
  }

  if (year === 2018) {
    return calculate2017(prev, month + 12).toFixed(2);
  }

  return baseDebt;
}

function calculate2016(base, sum, month) {
  if (month < 5)
    return sum;

  let percent = 0.15;

  if (month <= 10) percent = 0.10;
  if (month <= 7) percent = 0.05;

  sum = base * percent + sum;
  return calculate2016(base, sum, month - 1);
}

function calculate2017(prev, month) {
  if (month <= 1)
    return prev;

  let percent = 0.15;

  if (month <= 7) percent = 0.10;
  if (month <= 4) percent = 0.05;

  return calculate2017(prev + prev * percent, month - 1);
}
