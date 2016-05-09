
let POOP_SPEED = 0;
let POO_UNICODE = '\u{1F4A9}'
let pooElement = document.querySelector('.poop .poo');
let pooDroplets = document.querySelector('.poop .pooDrops');

let POO_SIZE_MIN = 0;
let POO_SIZE_MAX = 110;
let POO_WIDTH_MIN = 40;
let POO_WIDTH_MAX = 200;

pooElement.style.fontSize = POO_SIZE_MIN + 'px';
pooElement.innerHTML = POO_UNICODE;
pooDroplets.innerHTML = POO_UNICODE;

let updatePoopSize = (n) => {
  let diffWidth = POO_WIDTH_MAX - POO_WIDTH_MIN;
  let curWidth = POO_WIDTH_MIN + Math.floor(n * diffWidth);

  let diffSize = POO_SIZE_MAX - POO_SIZE_MIN;
  let curSize = POO_SIZE_MIN + Math.floor(n * diffSize);

  pooElement.style.width = curWidth + 'px';
  pooElement.style.marginLeft = '-' + ((curWidth / 2) - 20) + 'px';
  pooElement.style.fontSize = curSize + 'px';
  pooDroplets.style.fontSize = Math.round(curSize / 3) + 'px';
}

export function poopBack(n) {
  POOP_SPEED = n;
  updatePoopSize(n);
}
