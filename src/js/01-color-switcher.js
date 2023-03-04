// const btnStart = document.querySelector('button[data-start]');
// const btnStop = document.querySelector('button[data-stop]');
// // btnStop.disabled = true;
// let timerId = null;

// function getRandomHexColor() {
//   return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// }

// btnStart.addEventListener('click', () => {
//   btnStart.disabled = true;
//   btnStop.disabled = false;

//   timerId = setInterval(() => {
//     document.body.style.background = getRandomHexColor();
//   }, 1000);
// });

// btnStop.addEventListener('click', () => {
//   clearInterval(timerId);
//   btnStart.disabled = false;
//   btnStop.disabled = true;
// });

//Variant 2

const startButton = document.querySelector('button[data-start]');
const stopButton = document.querySelector('button[data-stop]');
let intervalId;

//Рандомна зміна кольору
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

//Функція зміни кольору
function changeBackgroundColor() {
  document.body.style.background = getRandomHexColor();
}

function startColorChanging() {
  // Встановлення інтервалу зміни кольору
  intervalId = setInterval(changeBackgroundColor, 1000);
  startButton.disabled = true;
  stopButton.disabled = false;
}

function stopColorChanging() {
  clearInterval(intervalId);
  startButton.disabled = false;
  stopButton.disabled = true;
}

//Add EventListener
// startButton.addEventListener('click', startColorChanging);
// stopButton.addEventListener('click', stopColorChanging);

//Use handlers
startButton.onclick = startColorChanging;
stopButton.onclick = stopColorChanging;
