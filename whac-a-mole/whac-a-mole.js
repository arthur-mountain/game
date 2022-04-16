import RequestAnimation from './requestAnimation.js';
import { createElement, transTimeOut } from './utils.js';

// Constants
const MOLE_INTERVAL_SECOND = 0.7;
const TIME_OUT_INTERVAL_SECOND = 1;

// DOM Element
const score = document.getElementById('score');
const timeOut = document.getElementById('time-out');
const squares = document.querySelectorAll('.square');
const modal = document.querySelector('.modal');

// RequestAnimationFrame instance
const moleAnimation =
  new RequestAnimation(randomPosition, MOLE_INTERVAL_SECOND);
const countDownAnimation =
  new RequestAnimation(handleCountDown, TIME_OUT_INTERVAL_SECOND);

// Custom event for textContent change
const textConentEvent = new CustomEvent('textConentChange');
let result = 0;
let timeOutSecond = 1;

window.addEventListener('DOMContentLoaded', () => {
  timeOut.textContent = transTimeOut(timeOutSecond);
  modal.querySelector('.start').addEventListener('click', handleStartGame);

  squares.forEach(square => (
    square.addEventListener('click', handleSquareClick)
  ))

  timeOut.addEventListener('textConentChange', handleTextChangeEvent)
})

function handleStartGame() {
  modal.classList.add('hidden');
  modal.querySelector('.modal-description').remove();
  moleAnimation.start();
  countDownAnimation.start();
}

function handleReStartGame() {
  window.location.reload();
}

// Change mole random position.
function randomPosition() {
  squares.forEach(square => square.classList.remove('mole'))
  const newSquareMole = squares[Math.floor(Math.random() * squares.length)]
  newSquareMole.classList.add('mole');
}


// Game time out
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

function handleTextChangeEvent(e) {
  e.preventDefault();
  timeOut.textContent = transTimeOut(timeOutSecond);

  // Game over (stop animation, show result modal)
  if (timeOutSecond === 0) {
    moleAnimation.stop();
    countDownAnimation.stop();
    const modalResult = createElement(
      'div',
      { className: "modal-result" },
      createElement('text', { className: "text" }, 'Your final score is:'),
      createElement('span', { className: 'result' }, `${result}`),
      createElement('br'),
      createElement('button', { type: 'button', className: 'restart', onClick: handleReStartGame }, 'RESTART'),
    );

    modal.appendChild(modalResult);
    modal.classList.remove('hidden');
  }
}