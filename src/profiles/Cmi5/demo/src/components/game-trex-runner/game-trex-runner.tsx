import { Component, h, Element, Event, EventEmitter } from "@stencil/core";
import "./trex-runner";

declare class Runner {
  constructor(el: string)
};

@Component({
  tag: "game-trex-runner",
  styleUrl: "game-trex-runner.css"
})
export class GameTrexRunner {
  @Element() el: HTMLElement;
  gameEl: HTMLDivElement;
  @Event() gameStart: EventEmitter;
  @Event() gameScore: EventEmitter;

  componentDidLoad() {
    new Runner(".interstitial-wrapper");
    this.gameEl.addEventListener("start", () => {
      this.gameStart.emit();
    })
    this.gameEl.addEventListener("score", (event: CustomEvent) => {
      this.gameScore.emit(event.detail);
    });
  }

  render() {
    return [
    <div id="offline-resources">
      <img id="offline-resources-1x" src="images/100-percent/100-offline-sprite.png" />
      <img id="offline-resources-2x" src="images/200-percent/200-offline-sprite.png" />
      <div id="audio-resources">
        <audio id="offline-sound-press" src="sounds/button-press.mp3"></audio>
        <audio id="offline-sound-hit" src="sounds/hit.mp3"></audio>
        <audio id="offline-sound-reached" src="sounds/score-reached.mp3"></audio>
      </div>
    </div>,
    <div class="interstitial-wrapper" ref={(gameEl) => this.gameEl = gameEl}></div>
    ];
  }
}
