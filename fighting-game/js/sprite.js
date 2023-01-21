class Sprite extends GameObject {
  constructor({ position,
    velocity,
    color = 'red',
    speed = 1,
    offset = { x: 0, y: 0 },
    imgUrl,
    scale = 1,
    framesMax = 1,
    sprites,
    attackBox = {
      offset: {}, width: undefined, height: undefined,
    }
  }) {
    super({
      position,
      imgUrl,
      scale,
      framesMax,
      offset,
    })

    this.velocity = velocity;
    this.color = color;
    this.speed = speed;
    this.width = 50;
    this.height = 150;
    this.lastKey
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    }
    this.isAttacking = 0;
    this.isJumping = 0;
    this.health = 100;
    this.sprites = sprites;
    this.frameCurrent = 0; // override
    this.framesElapsed = 0; // override
    this.framesHold = 5; // override
    this.isDead = 0;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgUrl;
    }
  };

  update() {
    this.draw();
    if (!this.isDead) this.updateFrames()

    // attack boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      (this.position.y + this.height + this.velocity.y) >= canvas.height - 96
    ) {
      this.velocity.y = 0;
      this.position.y = 330;
      this.isJumping = 0;
    } else {
      this.velocity.y += gravity;
    }
  };

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = 1;
  }

  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    // death
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.framesMax - 1) {
        this.isDead = 1;
      }
      return;
    }
    // attack
    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.framesMax - 1
    ) return;
    // takeHit
    if (
      this.image === this.sprites.takeHit.image &&
      this.frameCurrent < this.sprites.takeHit.framesMax - 1
    ) return;

    const updatedSprite = this.sprites[sprite];

    if (this.image !== updatedSprite.image) {
      this.frameCurrent = 0;
      this.image = updatedSprite.image;
      this.framesMax = updatedSprite.framesMax;
    }
  }
};

