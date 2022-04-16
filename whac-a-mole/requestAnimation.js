class RequestAnimation {
  #cancelId;
  #lastRenderTime;

  constructor(animationFunc, animationTimeOut) {
    this.#lastRenderTime = 0;
    this.startAnimation = (currentTime) => {
      this.#cancelId = window.requestAnimationFrame(this.startAnimation);
      const secondsSinceLastRender =
        (currentTime - this.#lastRenderTime) / 1000;

      if (animationTimeOut && secondsSinceLastRender < animationTimeOut) {
        return;
      }

      animationFunc();
      this.#lastRenderTime = currentTime;
    }
  }

  start(delay) {
    if (delay) {
      setTimeout(() => {
        window.requestAnimationFrame(this.startAnimation);
      }, delay);
    } else {
      window.requestAnimationFrame(this.startAnimation);
    }
  }

  stop() {
    cancelAnimationFrame(this.#cancelId);
    console.warn('cancel request animation frame');
  }
}

export default RequestAnimation;