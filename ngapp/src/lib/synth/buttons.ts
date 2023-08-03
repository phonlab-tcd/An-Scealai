import seekParentSentence from "lib/seekParentSentence";
import seekParentWord from "lib/seekParentWord";
import Quill from "quill";
import type { Location as LocationInText } from "../findLocationsInText";
import findLocationsInText from "../findLocationsInText";
import newTimeout from "lib/newTimeout";
import synth from "lib/synth";
import type Settings from "lib/synth/settings";
import { z } from "zod";
import { fromEvent } from 'rxjs';


const QuillTooltip = Quill.import("ui/tooltip");

const SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_ON = 300;
const SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_OFF = 0;

function synthesisUrl(input: string, voice: string) {
  const outputType = "JSON";
  const timing = "WORD";
  const params = new URLSearchParams({input, voice, outputType, timing});
  return `https://www.abair.ie/api2/synthesise?${params}` 
}

const fetch_cache = {};

async function fetch_cached(url: string) {
  const cached = fetch_cache[url];
  if(cached) {
    return cached;
  }
  const p = fetch(url).then(r=>r.json());
  fetch_cache[url] = p;
  return p;
}

/**
 * Turns on or off the highlighting for sentence level synthesis, call in timeout 
 * @param this Dashboard component
 * @param turnEmphasisOn true for highlighting on, false for highlighting off
 * @param location start/end indices for highlighting
 * @param myId index of word in array of words to synthesise
 */
function highlightTokenToggle_timeoutHandler(this: Buttons, turnEmphasisOn: boolean, location: LocationInText, myId: number) {
  const start = location.startIndex;
  const length = location.endIndex - location.startIndex;
  const props = { "synth-highlight-em": turnEmphasisOn};
  this.quillEditor.formatText(start, length, props, 'api');
  const timeoutHandles = this.playback.timeoutHandles(turnEmphasisOn);
  if(timeoutHandles[myId] instanceof Object) delete timeoutHandles[myId];
}

/**
 * Create quill tooltip that acts as button to play synthesis
 * @param quillEditor Quill editor
 * @param type 'word' or 'sent'
 * @returns new quill tooltip with styles
 */
function createSynthesisPlayButton(quillEditor: Quill, type: string) {
  const button = new QuillTooltip(quillEditor);
  button.root.classList.add("synth-button-" + type);
  button.root.classList.add("synthesis-button");
  button.root.classList.add("custom-tooltip");
  button.root.innerHTML = "<span>▸<span>";
  button.hide();
  return button;
}

const synthAPI2validator = z.object({
  audioContent: z.string(),
  timing: z.array(z.object({word: z.string(), end: z.number()})),
});

/**
 * Synthesise text, playback audio, and highlight text
 * @param this Dashboard component
 * @param text text to highlight
 * @param startIndex index to start highlighting
 */
async function onclick(this: Buttons, text: string, startIndex: number) {
  const clickId = this.playback.newClick();
  this.playback.clear();
  const prevalid = await fetch_cached(synthesisUrl(text,this.synthSettings.voice));
  if(!this.playback.isMostRecentClick(clickId)) return this.playback.clear();

  const v = synthAPI2validator.safeParse(prevalid);
  if(!v.success) throw v;

  const res = v.data;
  const locations = findLocationsInText(text, res.timing.map(e => e.word), startIndex);
  const audio = new Audio(`data:audio/ogg;base64,${v.data.audioContent}`);
  const speed = this.synthSettings.speed;
  audio.playbackRate = speed;
  audio.play();

  this.playback.audio = audio;

  for(let i = 0; i < res.timing.length; i++) {
    const startTimeSeconds = i == 0 ? 0.0 : res.timing[i-1].end; 
    const timing = res.timing[i];
    const location = locations[i];
    const myId = i;

    const startms = startTimeSeconds * 1000;
    const endms = timing.end * 1000;
    
    const on = highlightTokenToggle_timeoutHandler.bind(this, true, location, myId);
    const off = highlightTokenToggle_timeoutHandler.bind(this, false, location, myId);
    this.playback.turnHighlightOnTimeout[myId] = newTimeout((startms / speed) - SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_ON, on);
    this.playback.turnHighlightOffTimeout[myId] = newTimeout((endms / speed)  + SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_OFF, off);
  }
}

function hideOnClickAway(this: Buttons, e: MouseEvent) {
  const clickedNode = e.target instanceof Node;
  if(!clickedNode) return;

  const clickedOnQuillEditor = this.quillEditor.root.contains(e.target);
  if(clickedOnQuillEditor) return;

  const clickedOnTooltip = e.target.parentNode === this.quillEditor.root.parentNode;
  if(clickedOnTooltip) return;

  const clickedInsideTooltip = e.target.parentNode.parentNode === this.quillEditor.root.parentNode;
  if(clickedInsideTooltip) return;

  // otherwise (clicked outside quill editor)
  this.hide();
}

/**
 * Apply/remove synth-highlight styles when hovering over play buttons
 * TODO => make this a method of the quill editor
 * @param this Quill editor
 * @param isMouseIn true if hover on synth button, false if hover out
 * @param parentSpan start/end indices of text to be highlighted
 */
function onMouseInOrOut(this: Buttons, isMouseIn: boolean, whichButton: "word" | "sent") {
  const start = this.mostRecent[whichButton].startIndex;
  const length = this.mostRecent[whichButton].endIndex - start;
  const props = { "synth-highlight": isMouseIn};
  this.quillEditor.formatText(start, length, props, 'api');
}

export default class Buttons {
  quillEditor: Quill;
  synthSettings: Settings;
  playback = new synth.PlaybackHandle();
  enabled = true;
  clickEventListener;
  mostRecent = {
    word: null,
    sent: null,
  };
  mostRecentSelectionRange;
  public wordTooltip: typeof QuillTooltip;
  public sentTooltip: typeof QuillTooltip;

  constructor(qlEditor: Quill, synthSettings: Settings) {
    this.quillEditor = qlEditor;
    this.synthSettings = synthSettings;

    // TODO instead of hiding should just update position
    new ResizeObserver(this.hide.bind(this)).observe(this.quillEditor.root.parentElement);
    this.wordTooltip = createSynthesisPlayButton(qlEditor, "word");
    this.sentTooltip = createSynthesisPlayButton(qlEditor, "sent");
    this.wordTooltip.root.onmouseover = onMouseInOrOut.bind(this, true, "word");
    this.wordTooltip.root.onmouseout  = onMouseInOrOut.bind(this, false, "word");
    this.sentTooltip.root.onmouseover = onMouseInOrOut.bind(this, true, "sent");
    this.sentTooltip.root.onmouseout  = onMouseInOrOut.bind(this, false, "sent");
    this.quillEditor.on("selection-change", this.show.bind(this));
    fromEvent(this.quillEditor, 'text-change').subscribe({next: ([_, _content, source]) => {
      if (source == 'api') return;
      this.hide();
    }})
    this.clickEventListener = window.addEventListener('click', hideOnClickAway.bind(this));
  }

  hide(){
    this.wordTooltip.hide();
    this.sentTooltip.hide();
    this.playback.clear();
  }

  toggle() {
    this.enabled = !this.enabled;
    if(!this.enabled) {
      this.hide();
    }
  }

  showSentenceButtonAtIndex(location: number) {
    if(!this.enabled) return;
    const tooltip = this.sentTooltip;
    tooltip.positionTopLeft(location);
    tooltip.show();
  }

  showWordButtonAtIndex(location: number) {
    if(!this.enabled) return;
    const tooltip = this.wordTooltip;
    tooltip.positionBottomRight(location);
    tooltip.show()
  }

  onResize() {
    if(!this.mostRecentSelectionRange) return;

  }

  /**
   * Get word and sentence text to synthesise
   * Create and show synthesis play buttons
   * @param this Dashboard component
   * @param range range of selected text
   */
  show(range){
    console.log(range);
    if(!range) return;

    this.mostRecentSelectionRange = range;

    const text = this.quillEditor.getText();

    const quill = this.quillEditor;
    const wordTooltip = this.wordTooltip;
    this.mostRecent.word = seekParentWord(text, range.index);
    wordTooltip.root.onclick = onclick.bind(this, this.mostRecent.word.text, this.mostRecent.word.startIndex, this.synthSettings);

    const sentenceTooltip = this.sentTooltip;
    this.mostRecent.sent = seekParentSentence(text, range.index);
    sentenceTooltip.root.onclick = onclick.bind(this, this.mostRecent.sent.text, this.mostRecent.sent.startIndex, this.synthSettings);

    if(this.mostRecent.word.text) this.showWordButtonAtIndex(this.mostRecent.word.endIndex);
    else wordTooltip.hide();

    if(this.mostRecent.sent.text) this.showSentenceButtonAtIndex(this.mostRecent.sent.startIndex);
    else sentenceTooltip.hide();
  }
}