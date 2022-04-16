import RequestAnimation from './requestAnimation.js';
const MOLE_INTERVAL_SECOND = 0.7;
const TIME_OUT_INTERVAL_SECOND = 1;
const score = document.getElementById('score');
const timeOut = document.getElementById('time-out');
const squares = document.querySelectorAll('.square');
const modal = document.querySelector('.modal');
const moleAnimation =
  new RequestAnimation(randomChangeMole, MOLE_INTERVAL_SECOND);
const countDownAnimation =
  new RequestAnimation(handleCountDown, TIME_OUT_INTERVAL_SECOND);
const textConentEvent = new CustomEvent('textConent');
let result = 0;
let timeOutSecond = 120;

window.addEventListener('DOMContentLoaded', () => {
  timeOut.textContent = transTimeOut(timeOutSecond);
  modal.querySelector('.start').addEventListener('click', handleStart);
  modal.querySelector('.restart').addEventListener('click', handleReStart);

  squares.forEach(square => (
    square.addEventListener('click', handleSquareClick)
  ))

  timeOut.addEventListener('textConent', handleTextContentEvent)
})

function handleStart() {
  modal.classList.add('hidden');
  modal.querySelector('.modal-description').classList.add('hidden');
  modal.querySelector('.modal-result').classList.remove('hidden');
  moleAnimation.start();
  countDownAnimation.start();
}

function handleReStart() {
  window.location.reload();
}

function randomChangeMole() {
  squares.forEach(square => square.classList.remove('mole'))
  const newSquareMole = squares[Math.floor(Math.random() * squares.length)]
  newSquareMole.classList.add('mole');
}

function handleCountDown() {
  timeOutSecond -= 1;
  timeOut.dispatchEvent(textConentEvent);
}

function handleSquareClick(e) {
  e.preventDefault();
  if (this.classList.contains('mole')) {
    result += 1;
    score.textContent = result;
    this.classList.remove('mole');
  }
}

function handleTextContentEvent(e) {
  e.preventDefault();
  timeOut.textContent = transTimeOut(timeOutSecond);

  if (timeOutSecond === 0) {
    moleAnimation.stop();
    countDownAnimation.stop();
    modal.querySelector('.text').textContent =
      `Your final score is: ${result}`;
    modal.classList.remove('hidden');
  }
}

function transTimeOut(value) {
  if (value <= 60) {
    return value;
  }

  const minutes = `${Math.floor(value / 60)}`.padStart(2, '0');
  const seconds = `${value % 60}`.padEnd(2, '0');

  return `${minutes}:${seconds}`;
}