export default class GameLoop {
  #update;
  #request;
  /**
   *
   * @param {FrameRequestCallback} update
   */
  constructor(update) {
    this.#update = update;
  }

  #next(time) {
    this.#update(time);
    this.#request = requestAnimationFrame((time) => this.#next(time));
  }

  start() {
    this.#request = requestAnimationFrame((time) => this.#next(time));
  }

  stop() {
    if (this.#request) {
      cancelAnimationFrame(this.#request);
      this.#request = undefined;
    }
  }
}
