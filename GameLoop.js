export default class GameLoop {
  #update;
  #request;
  #prevTime
  /**
   *
   * @param {FrameRequestCallback} update
   */
  constructor(update) {
    this.#update = update;
  }

  #next(currentTime) {
    this.#prevTime ||= currentTime;
    this.#update(currentTime - this.#prevTime);
    this.#prevTime = currentTime;
    this.#request = requestAnimationFrame((currentTime) => this.#next(currentTime));
  }

  start() {
    this.#request = requestAnimationFrame((currentTime) => this.#next(currentTime));
  }

  stop() {
    if (this.#request) {
      cancelAnimationFrame(this.#request);
      this.#request = undefined;
    }
    this.#prevTime = undefined;
  }
}
