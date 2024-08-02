import seekParentSentence from "lib/seekParentSentence";
import seekParentWord from "lib/seekParentWord";
import Quill from "quill";
import type { Location as LocationInText } from "../findLocationsInText";
import findLocationsInText from "../findLocationsInText";
import newTimeout from "lib/newTimeout";
import synth from "lib/synth";
import type Settings from "lib/synth/settings";
import { z } from "zod";
import { EngagementService } from "app/core/services/engagement.service";

const QuillTooltip = Quill.import("ui/tooltip");

const SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_ON = 300;
const SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_OFF = 0;

const synth_cache: { [key: string]: object } = {};

// data shape validation of synthesis api response
const synthAPI2validator = z.object({
  audioContent: z.string(),
  timing: z.array(z.object({ word: z.string(), end: z.number() })),
});

/**
 * Synthesise text, playback audio, and highlight text
 * Called when the user clicks on one of the synthesis play buttons
 * @param this buttons from Dashboard Component
 * @param tooltipReference the parent tooltip object on to which this onclick is added
 * @param text text to highlight
 * @param startIndex index to start highlighting
 */
async function onclick( this: Buttons, tooltipReference: typeof QuillTooltip, text: string, startIndex: number ) {
  const clickId = this.playback.newClick();
  this.playback.clear();
  Buttons.toggleLoadingSpinner(tooltipReference, "on");
  const prevalid = await fetchSynthAudio( text, this.synthSettings.voice, this.synthSettings.speed );
  if (!this.playback.isMostRecentClick(clickId)) return this.playback.clear();

  const v = synthAPI2validator.safeParse(prevalid);
  if (!v.success) throw v;

  const res = v.data;
  this.addPlaySynthesisEvent(text);

  const tokens = res.timing.map((e) => e.word);
  const locations = findLocationsInText(text, tokens, startIndex);
  const audio = new Audio(`data:audio/mp3;base64,${v.data.audioContent}`);
  const speed = this.synthSettings.speed;
  audio.playbackRate = speed;
  Buttons.toggleLoadingSpinner(tooltipReference, "off");
  audio.play();

  this.playback.audio = audio;

  // start highlighting
  for (let i = 0; i < res.timing.length; i++) {
    const startTimeSeconds = i == 0 ? 0.0 : res.timing[i - 1].end;
    const timing = res.timing[i];
    const location = locations[i];
    const myId = i;

    const startms = startTimeSeconds * 1000;
    const endms = timing.end * 1000;

    const on = highlightTokenToggle_timeoutHandler.bind( this, true, location, myId );
    const off = highlightTokenToggle_timeoutHandler.bind( this, false, location, myId );
    this.playback.turnHighlightOnTimeout[myId] = newTimeout( startms / speed - SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_ON, on );
    this.playback.turnHighlightOffTimeout[myId] = newTimeout( endms / speed + SYNTHESIS_HIGHLIGHTING_LAX_MS_TURN_OFF, off );
  }
}

/**
 * Synthesise the text using the synthesis api
 * @param textInput text to synthesise
 * @param voice selected voice
 * @param speed voice speed
 * @returns api response (audio and timing info)
 */
async function fetchSynthAudio( textInput: string, voice: string, speed: number ) {
  const cacheKey = createCacheKey(textInput, voice, speed);
  const cachedAudio = synth_cache[cacheKey];
  if (cachedAudio) {
    return cachedAudio;
  }

  const reqBody = {
    synthinput: {
      text: textInput,
      normalise: true,
    },
    voiceparams: {
      langaugeCode: "ga-IE",
      name: voice,
    },
    audioconfig: {
      audioEncoding: "LINEAR16",
      speakingRate: speed,
      pitch: 1,
    },
    outputType: "JSON",
    timing: "WORD",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  const p = fetch("https://abair.ie/api2/synthesise", options).then((r) => r.json() );
  synth_cache[cacheKey] = p;
  return p;
}

/**
 * Create a unique id for each synth request to use as a key for cache
 * @param textInput input story text
 * @param voice selected voice
 * @param speed selected speed
 * @returns combined string from the three parameters
 */
function createCacheKey(textInput: string, voice: string, speed: number) {
  return textInput + voice + speed;
}

/**
 * Turns on or off the highlighting for sentence level synthesis, call in timeout
 * @param this Dashboard component
 * @param turnEmphasisOn true for highlighting on, false for highlighting off
 * @param location start/end indices for highlighting
 * @param myId index of word in array of words to synthesise
 */
function highlightTokenToggle_timeoutHandler( this: Buttons, turnEmphasisOn: boolean, location: LocationInText, myId: number ) {
  const start = location.startIndex;
  const length = location.endIndex - location.startIndex;
  const props = { "synth-highlight-em": turnEmphasisOn };
  this.quillEditor.formatText(start, length, props, "api");
  const timeoutHandles = this.playback.timeoutHandles(turnEmphasisOn);
  if (timeoutHandles[myId] instanceof Object) delete timeoutHandles[myId];
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

/**
 * Hide the synthesis buttons if the user clicks off the page
 * @param this buttons from Dashboard Component
 * @param e Click event
 */
function hideOnClickAway(this: Buttons, e: MouseEvent) {
  const clickedNode = e.target instanceof Node;
  if (!clickedNode) return;

  const clickedOnQuillEditor = this.quillEditor.root.contains(e.target);
  if (clickedOnQuillEditor) return;

  if (!e.target.parentNode) return;

  const clickedOnTooltip = e.target.parentNode === this.quillEditor.root.parentNode;
  if (clickedOnTooltip) return;

  const clickedInsideTooltip = e.target.parentNode.parentNode === this.quillEditor.root.parentNode;
  if (clickedInsideTooltip) return;

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
function onMouseInOrOut( this: Buttons, isMouseIn: boolean, whichButton: "word" | "sent" ) {
  const start = this.mostRecent[whichButton].startIndex;
  const length = this.mostRecent[whichButton].endIndex - start;
  const props = { "synth-highlight": isMouseIn };
  this.quillEditor.formatText(start, length, props, "api");
}

/**
 * Returns the hide() function if the user made text changes
 * (i.e. if text changes are made by the Quill editor, it won't hide)
 * @param f hide() fuction
 * @returns hide() function
 */
function userTextChange(f: Function) {
  return function (_a, _b, source) {
    if (source === "user") return f(_a, _b, source);
  };
}

export default class Buttons {
  quillEditor: Quill;
  synthSettings: Settings;
  engagement: EngagementService;
  playback = new synth.PlaybackHandle();
  enabled = localStorage.getItem("synthPreference") === "true" ?? true;
  clickEventListener;
  mostRecent = {
    word: null,
    sent: null,
  };
  mostRecentSelectionRange;
  public wordTooltip: typeof QuillTooltip;
  public sentTooltip: typeof QuillTooltip;

  constructor(qlEditor: Quill, synthSettings: Settings, engagement: EngagementService) {
    this.quillEditor = qlEditor;
    this.synthSettings = synthSettings;
    this.engagement = engagement;

    // TODO instead of hiding should just update position
    new ResizeObserver(this.hide.bind(this)).observe(this.quillEditor.root.parentElement);
    this.wordTooltip = createSynthesisPlayButton(qlEditor, "word");
    this.sentTooltip = createSynthesisPlayButton(qlEditor, "sent");
    this.wordTooltip.root.onmouseover = onMouseInOrOut.bind(this, true, "word");
    this.wordTooltip.root.onmouseout = onMouseInOrOut.bind(this, false, "word");
    this.sentTooltip.root.onmouseover = onMouseInOrOut.bind(this, true, "sent");
    this.sentTooltip.root.onmouseout = onMouseInOrOut.bind(this, false, "sent");
    this.quillEditor.on("selection-change", this.show.bind(this));
    this.quillEditor.on("text-change", userTextChange(this.hide.bind(this)));
    this.clickEventListener = window.addEventListener("click", hideOnClickAway.bind(this));
  }

  /**
   * Toggles the contents of a synth play button between the standard ▸ play button and a loading spinner.
   * @param tooltip a reference to the tooltip representing the synth button
   * @param mode 'on' to set as a spinner or 'off' to set as a play button
   */
  static toggleLoadingSpinner(tooltip: typeof QuillTooltip, mode: "on" | "off") {
    if (mode === "on") {
      tooltip.root.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
    } else {
      tooltip.root.innerHTML = "<span>▸<span>";
    }
  }

  addPlaySynthesisEvent(text: string) {
    this.engagement.addPlaySynthesisEvent(this.synthSettings.voice, text, this.synthSettings.speed)
  }

  hide() {
    this.wordTooltip.hide();
    this.sentTooltip.hide();
    this.playback.clear();
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("synthPreference", this.enabled.toString());
    if (!this.enabled) {
      this.hide();
    }
  }

  showSentenceButtonAtIndex(location: number) {
    if (!this.enabled) return;
    const tooltip = this.sentTooltip;
    tooltip.positionTopLeft(location);
    tooltip.show();
  }

  showWordButtonAtIndex(location: number) {
    if (!this.enabled) return;
    const tooltip = this.wordTooltip;
    tooltip.positionBottomRight(location);
    tooltip.show();
  }

  onResize() {
    if (!this.mostRecentSelectionRange) return;
  }

  /**
   * Get word and sentence text to synthesise
   * Create and show synthesis play buttons
   * @param this Dashboard component
   * @param range range of selected text
   */
  show(range) {
    if (!range) return;

    this.mostRecentSelectionRange = range;

    const text = this.quillEditor.getText();

    const quill = this.quillEditor;
    const wordTooltip = this.wordTooltip;
    this.mostRecent.word = seekParentWord(text, range.index);
    wordTooltip.root.onclick = onclick.bind(this, wordTooltip, this.mostRecent.word.text, this.mostRecent.word.startIndex);

    const sentenceTooltip = this.sentTooltip;
    this.mostRecent.sent = seekParentSentence(text, range.index);
    sentenceTooltip.root.onclick = onclick.bind(this, sentenceTooltip, this.mostRecent.sent.text, this.mostRecent.sent.startIndex);

    if (this.mostRecent.word.text) this.showWordButtonAtIndex(this.mostRecent.word.endIndex);
    else wordTooltip.hide();

    if (this.mostRecent.sent.text) this.showSentenceButtonAtIndex(this.mostRecent.sent.startIndex);
    else sentenceTooltip.hide();
  }
}
