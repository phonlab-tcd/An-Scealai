import seekParentSentence from "lib/seekParentSentence";
import seekParentWord from "lib/seekParentWord";
import synth from "lib/synth";
import Quill from "quill";
import { DashboardComponent } from "app/student/dashboard/dashboard.component";
import type { Location as LocationInText } from "../findLocationsInText";
import findLocationsInText from "../findLocationsInText";
import newTimeout from "lib/newTimeout";
import { z } from "zod";
import { Story } from "app/core/models/story";

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
async function onclick(this: Buttons, text: string, startIndex: number, synthSettings) {
  const clickId = this.playback.newClick();
  this.playback.clear();
  const prevalid = await fetch_cached(synthesisUrl(text,synthSettings.voice));
  if(!this.playback.isMostRecentClick(clickId)) return this.playback.clear();

  const v = synthAPI2validator.safeParse(prevalid);
  if(!v.success) throw v;

  const res = v.data;
  const locations = findLocationsInText(text, res.timing.map(e => e.word), startIndex);
  const audio = new Audio(`data:audio/ogg;base64,${v.data.audioContent}`);
  audio.playbackRate = synthSettings.speed;
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
    this.playback.turnHighlightOnTimeout[myId] = newTimeout((startms / synthSettings.speed) - SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_ON, on);
    this.playback.turnHighlightOffTimeout[myId] = newTimeout((endms / synthSettings.speed)  + SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_OFF, off);
  }
}

/**
 * Apply/remove synth-highlight styles when hovering over play buttons
 * TODO => make this a method of the quill editor
 * @param this Quill editor
 * @param isMouseIn true if hover on synth button, false if hover out
 * @param parentSpan start/end indices of text to be highlighted
 */
function onMouseInOrOut(this: Quill, isMouseIn: boolean, parentSpan: ReturnType<typeof seekParentWord>) {
  const start = parentSpan.startIndex;
  const length = parentSpan.endIndex - start;
  const props = { "synth-highlight": isMouseIn};
  this.formatText(start, length, props, 'api');
}

export default class Buttons {
  quillEditor: Quill;
  synthSettings;
  playback = new synth.PlaybackHandle();
  enabled = false;
  public wordTooltip: typeof QuillTooltip;
  public sentTooltip: typeof QuillTooltip;

  constructor(qlEditor: Quill, story: Story, synthSettings) {
    this.quillEditor = qlEditor;
    this.synthSettings = synthSettings;
    new ResizeObserver(this.hide.bind(this)).observe(this.quillEditor.root.parentElement);
    this.wordTooltip = createSynthesisPlayButton(qlEditor, "word");
    this.sentTooltip = createSynthesisPlayButton(qlEditor, "sent");

    this.quillEditor.on("selection-change", this.show.bind(this, story, synthSettings));

    // this.synthesisPlayback = new synth.PlaybackHandle();
    const clickEventListener = window.addEventListener('click', (e: MouseEvent) => {
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
    });
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

  /**
   * Get word and sentence text to synthesise
   * Create and show synthesis play buttons
   * @param this Dashboard component
   * @param range range of selected text
   */
  show(story, synthSettings, range){
    console.log(range);
    if(!range) return;

    const quill = this.quillEditor;
    const wordTooltip = this.wordTooltip;
    const parentWord = seekParentWord(story.text, range.index);
    wordTooltip.root.onmouseover = onMouseInOrOut.bind(quill, true,  parentWord);
    wordTooltip.root.onmouseout  = onMouseInOrOut.bind(quill, false, parentWord);
    wordTooltip.root.onclick = onclick.bind(this, parentWord.text, parentWord.startIndex, synthSettings);

    const sentenceTooltip = this.sentTooltip;
    const parentSentence = seekParentSentence(story.text, range.index);
    sentenceTooltip.root.onmouseover = onMouseInOrOut.bind(quill, true,  parentSentence);
    sentenceTooltip.root.onmouseout  = onMouseInOrOut.bind(quill, false, parentSentence);
    sentenceTooltip.root.onclick = onclick.bind(this, parentSentence.text, parentSentence.startIndex, synthSettings);

    if(parentWord.text) this.showWordButtonAtIndex(parentWord.endIndex);
    else wordTooltip.hide();

    if(parentSentence.text) this.showSentenceButtonAtIndex(parentSentence.startIndex);
    else sentenceTooltip.hide();
  }
}