import newTimeout from "../newTimeout";

export default class SynthPlaybackHandle {
  turnHighlightOnTimeout: {[key in number]: ReturnType<typeof newTimeout>} = {};
  turnHighlightOffTimeout:  {[key in number]: ReturnType<typeof newTimeout>} = {};
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
}