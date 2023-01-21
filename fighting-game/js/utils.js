const isGameOver = (players) => {
  return players.some(player => player.health <= 0)
}

const attackCollision = (playerA, playerB) => {
  return (
    playerA.attackBox.position.x + playerA.attackBox.width >= playerB.position.x &&
    playerA.attackBox.position.x <= playerB.position.x + playerB.width &&
    playerA.attackBox.position.y + playerA.attackBox.height >= playerB.position.y &&
    playerA.attackBox.position.y <= playerB.position.y + playerB.height
  )
}

const handleTimer = (players) => {
  let count = timer.firstElementChild;
  count.innerText = gameDurationSecond;
  const timeInterval = setInterval(() => {
    if (isGameOver(players) || --count.innerText <= 0) {
      const timeOut = setTimeout(() => {
        count.classList.remove('animate-ping', 'duration-1000');
        clearTimeout(timeOut);
      }, 1000);
      clearInterval(timeInterval);
      return;
    };
    if (count.innerText <= 10) count.style.color = '#b91c1c';
    if (count.innerText <= 5) count.classList.add('animate-ping', 'duration-1000');
  }, 1000);
};