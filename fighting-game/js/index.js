const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
canvas.style.border = '1px solid black';

const gameDurationSecond = 200;
const gravity = 0.7;

const background = new GameObject({
  position: { x: 0, y: 0 },
  imgUrl: "../img/background.png"
});

const shop = new GameObject({
  position: { x: 550, y: 160 },
  imgUrl: "../img/shop.png",
  scale: 2.5,
  framesMax: 6,
});

const hero = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 200, y: 92 },
  speed: 3,
  imgUrl: "../img/hero/Idle.png",
  framesMax: 8,
  scale: 2,
  sprites: {
    idle: {
      imgUrl: "../img/hero/Idle.png",
      framesMax: 8,
    },
    run: {
      imgUrl: "../img/hero/Run.png",
      framesMax: 8,
    },
    jump: {
      imgUrl: "../img/hero/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgUrl: "../img/hero/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgUrl: "../img/hero/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imgUrl: "../img/hero/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imgUrl: "../img/hero/TakeHitWhiteSilhouette.png",
      framesMax: 4,
    },
    death: {
      imgUrl: "../img/hero/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: { x: 50, y: 50 },
    width: 127,
    height: 50,
  },
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  offset: { x: 180, y: 102 },
  speed: 3,
  imgUrl: "../img/enemy/Idle.png",
  framesMax: 4,
  scale: 2,
  sprites: {
    idle: {
      imgUrl: "../img/enemy/Idle.png",
      framesMax: 4,
    },
    run: {
      imgUrl: "../img/enemy/Run.png",
      framesMax: 8,
    },
    jump: {
      imgUrl: "../img/enemy/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgUrl: "../img/enemy/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgUrl: "../img/enemy/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imgUrl: "../img/enemy/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imgUrl: "../img/enemy/TakeHit.png",
      framesMax: 3,
    },
    death: {
      imgUrl: "../img/enemy/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: { x: -110, y: 50 },
    width: 110,
    height: 50,
  },
});

const moveKeys = {
  // hero
  'd': { pressed: 0, },
  'a': { pressed: 0, },
  // enemy
  'ArrowRight': { pressed: 0, },
  'ArrowLeft': { pressed: 0, },
}

const animate = () => {
  const frameId = window.requestAnimationFrame(animate);
  // if (isGameOver([hero, enemy])) {
  //   window.cancelAnimationFrame(frameId);
  //   return;
  // }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  hero.update();
  enemy.update();

  hero.velocity.x = 0;
  enemy.velocity.x = 0;

  // hero movement
  if (moveKeys.d.pressed && hero.lastKey === 'd') {
    hero.velocity.x = hero.speed;
    hero.switchSprite('run');
  } else if (moveKeys.a.pressed && hero.lastKey === 'a') {
    hero.velocity.x = -hero.speed;
    hero.switchSprite('run');
  } else {
    hero.switchSprite('idle');
  }

  if (hero.velocity.y < 0) {
    hero.switchSprite('jump');
  } else if (hero.velocity.y > 0) {
    hero.switchSprite('fall');
  }

  // enemy movement
  if (moveKeys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = enemy.speed;
    enemy.switchSprite('run');
  } else if (moveKeys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -enemy.speed;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // hero attack
  if (
    hero.isAttacking &&
    attackCollision(hero, enemy) &&
    hero.frameCurrent === 4
  ) {
    enemy.takeHit();
    enemyHealth.style.width = `${enemy.health}%`;
  }
  if (hero.isAttacking && hero.frameCurrent === 4) {
    hero.isAttacking = 0;
  }

  // enemy attack
  if (
    enemy.isAttacking &&
    attackCollision(enemy, hero) &&
    enemy.frameCurrent === 2
  ) {
    hero.takeHit();
    heroHealth.style.width = `${hero.health}%`;
  }
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = 0;
  }
};
animate();

const handleHeroKeyEvent = (evt) => {
  if (hero.isDead) {
    window.removeEventListener("keydown", handleHeroKeyEvent);
    return;
  }
  switch (evt.key) {
    case "d":
    case "a":
      moveKeys[evt.key].pressed = 1;
      hero.lastKey = evt.key;
      break;
    case "w":
      !hero.isJumping && (hero.velocity.y = -20);
      hero.isJumping = 1;
      break;
    case " ":
      hero.attack();
      break;
    default:
      break;
  }
}

const handleEnemyKeyEvent = (evt) => {
  if (enemy.isDead) {
    window.removeEventListener("keydown", handleEnemyKeyEvent);
    return;
  }
  switch (evt.key) {
    case "ArrowRight":
    case "ArrowLeft":
      moveKeys[evt.key].pressed = 1;
      enemy.lastKey = evt.key;
      break;
    case "ArrowUp":
      !enemy.isJumping && (enemy.velocity.y = -20);
      enemy.isJumping = 1;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
    default:
      break;
  }
}
const handleKeyUp = (evt) => {
  if (moveKeys[evt.key]) moveKeys[evt.key].pressed = 0;
}

window.addEventListener("keydown", handleHeroKeyEvent);
window.addEventListener("keydown", handleEnemyKeyEvent);
window.addEventListener("keyup", handleKeyUp);
handleTimer([hero, enemy]);
