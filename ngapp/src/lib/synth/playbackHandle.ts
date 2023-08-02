import type newTimeout from "../newTimeout";

export default class PlaybackHandle {
  turnHighlightOnTimeout: {[key in number]: ReturnType<typeof newTimeout>} = {};
  turnHighlightOffTimeout:  {[key in number]: ReturnType<typeof newTimeout>} = {};
  clickCount = 0;
  public audio: HTMLAudioElement;
  cancelTurnOn() {
    for(const timeoutHandle of Object.values(this.turnHighlightOnTimeout)) {
      timeoutHandle.clear()
    }
    this.turnHighlightOnTimeout = {};
  }
  cancelTurnOff() {
    for(const timeoutHandle of Object.values(this.turnHighlightOffTimeout)) {
      timeoutHandle.trigger();
    }
    this.turnHighlightOffTimeout = {};
  }
  clear(){
    this.cancelTurnOn();
    this.cancelTurnOff();
    this.pause();
  }
  pause() {
    if(this.audio instanceof HTMLAudioElement) this.audio.pause();
  }
  timeoutHandles(forTurningHighlightOn: boolean) {
    if(forTurningHighlightOn) return this.turnHighlightOnTimeout;
    return this.turnHighlightOffTimeout;
  }
  newClick() {
    this.clickCount = this.clickCount + 1;
    return this.clickCount;
  }
  latestClick() {
    return this.clickCount;
  }
  isMostRecentClick(clickId: number) {
    return clickId === this.clickCount;
  }
}