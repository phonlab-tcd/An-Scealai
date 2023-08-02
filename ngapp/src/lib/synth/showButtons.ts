import seekParentWord from "../seekParentWord";
import seekParentSentence from "../seekParentSentence";
import findLocationsInText from "../findLocationsInText";
import newTimeout from "../newTimeout";
import { DashboardComponent } from "app/student/dashboard/dashboard.component";
import { HttpParams } from "@angular/common/http";
import type Quill from "quill";
import { firstValueFrom } from "rxjs";
import type { Location as LocationInText } from "../findLocationsInText";

const SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_ON = 300;
const SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_OFF = 0;

/** TODO => make this a method of the quill editor */
function onMouseInOrOut(this: Quill, isMouseIn: boolean, parentSpan: ReturnType<typeof seekParentWord>) {
  const start = parentSpan.startIndex;
  const length = parentSpan.endIndex - start;
  const props = { "synth-highlight": isMouseIn};
  this.formatText(start, length, props, 'api');
}

/** turns on or off the highlighting for sentence level synthesis, call in timeout */
function highlightTokenToggle_timeoutHandler(this: DashboardComponent, turnEmphasisOn: boolean, location: LocationInText, myId: number) {
  const start = location.startIndex;
  const length = location.endIndex - location.startIndex;
  const props = { "synth-highlight-em": turnEmphasisOn};
  this.quillEditor.formatText(start, length, props, 'api');
  const timeoutHandles = this.synthButtons.playback.timeoutHandles(turnEmphasisOn);
  if(timeoutHandles[myId] instanceof Object) delete timeoutHandles[myId];
}

/** Synthesise and playback with live text highlighting the text in @param text, whose starting index in the overall text is @param startIndex */
async function onclick(this: DashboardComponent, text: string, startIndex: number) {
  const options = { params: new HttpParams().set('input', text).set('voice', this.synthSettings.voice).set('outputType', 'JSON').set('timing', 'WORD') }
  const clickId = this.synthButtons.playback.newClick();
  this.synthButtons.playback.clear();
  const prevalid = await firstValueFrom(this.http.get('https://www.abair.ie/api2/synthesise', options));
  if(!this.synthButtons.playback.isMostRecentClick(clickId)) return this.synthButtons.playback.clear();

  const v = this.synthAPI2validator.safeParse(prevalid);
  if(!v.success) throw v;

  const res = v.data;
  const locations = findLocationsInText(text, res.timing.map(e => e.word), startIndex);
  const audio = new Audio(`data:audio/ogg;base64,${v.data.audioContent}`);
  audio.playbackRate = this.synthSettings.speed;
  audio.play();

  this.synthButtons.playback.audio = audio;

  for(let i = 0; i < res.timing.length; i++) {
    const startTimeSeconds = i == 0 ? 0.0 : res.timing[i-1].end; 
    const timing = res.timing[i];
    const location = locations[i];
    const myId = i;

    const startms = startTimeSeconds * 1000;
    const endms = timing.end * 1000;
    
    const on = highlightTokenToggle_timeoutHandler.bind(this, true, location, myId);
    const off = highlightTokenToggle_timeoutHandler.bind(this, false, location, myId);
    this.synthButtons.playback.turnHighlightOnTimeout[myId] = newTimeout((startms / this.synthSettings.speed) - SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_ON, on);
    this.synthButtons.playback.turnHighlightOffTimeout[myId] = newTimeout((endms / this.synthSettings.speed)  + SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_OFF, off);
  }
}

export default function showButtons(this: DashboardComponent, range){
    if(!range) return;

    const quill = this.quillEditor;
    const wordTooltip = this.synthButtons.wordTooltip;
    const parentWord = seekParentWord(this.story.text, range.index);
    wordTooltip.root.onmouseover = onMouseInOrOut.bind(quill, true,  parentWord);
    wordTooltip.root.onmouseout  = onMouseInOrOut.bind(quill, false, parentWord);
    wordTooltip.root.onclick = onclick.bind(this, parentWord.text, parentWord.startIndex);

    const sentenceTooltip = this.synthButtons.sentTooltip;
    const parentSentence = seekParentSentence(this.story.text, range.index);
    sentenceTooltip.root.onmouseover = onMouseInOrOut.bind(quill, true,  parentSentence);
    sentenceTooltip.root.onmouseout  = onMouseInOrOut.bind(quill, false, parentSentence);
    sentenceTooltip.root.onclick = onclick.bind(this, parentSentence.text, parentSentence.startIndex);

    if(parentWord.text) this.showSynthesisPlayWordButtonAtIndex(parentWord.endIndex);
    else wordTooltip.hide();

    if(parentSentence.text) this.showSynthesisPlaySentenceButtonAtIndex(parentSentence.startIndex);
    else sentenceTooltip.hide();
}