/**
 * @param {Function} Function The animation callback or something others wish to do.
 * @param {Number} number Timeout(second), the callback will be invoked after timeout;
 * @description The callback function will be continuously invoked by browser requestAnimationFrame after timeout.
 ** P.S. Window.requestAnimationFrame will be called at every repaint.
 */
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