class GameObject {
  constructor({ position, imgUrl, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }, }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imgUrl;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  };

  draw() {
    ctx.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale,
    )
  };


  updateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.updateFrames();
  };
};