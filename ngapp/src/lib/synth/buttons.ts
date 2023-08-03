import synth from "lib/synth";
import Quill from "quill";
import { BehaviorSubject, Subject } from "rxjs";

const QuillTooltip = Quill.import("ui/tooltip");

// create quill tooltip that acts as button to play synthesis
function createSynthesisPlayButton(quillEditor: Quill, type: string) {
  const button = new QuillTooltip(quillEditor);
  button.root.classList.add("synth-button-" + type);
  button.root.classList.add("synthesis-button");
  button.root.classList.add("custom-tooltip");
  button.root.innerHTML = "<span>▸<span>";
  button.hide();
  return button;
}

export default class Buttons {
  quillEditor: Quill;
  playback = new synth.PlaybackHandle();
  public isCheckedSubject = new BehaviorSubject(true);
  public checked$ = this.isCheckedSubject.asObservable();
  public wordTooltip: typeof QuillTooltip;
  public sentTooltip: typeof QuillTooltip;

  hideCb = this.hide.bind(this);

  constructor(qlEditor: Quill) {
      this.quillEditor = qlEditor;
      this.wordTooltip = createSynthesisPlayButton(qlEditor, "word");
      this.sentTooltip = createSynthesisPlayButton(qlEditor, "sent");

      // this.synthesisPlayback = new synth.PlaybackHandle();
      window.addEventListener('click', (e: MouseEvent) => {
        const clickedNode = e.target instanceof Node;
        if(!clickedNode) return;

        const clickedOnQuillEditor = this.quillEditor.root.contains(e.target);
        if(clickedOnQuillEditor) return;

        const clickedOnTooltip = e.target.parentNode === this.quillEditor.root.parentNode;
        if(clickedOnTooltip) return;

        const clickedInsideTooltip = e.target.parentNode.parentNode === this.quillEditor.root.parentNode;
        if(clickedInsideTooltip) return;

        // otherwise (clicked outside quill editor)
        this.playback.clear();
        this.hide();
      });
  }
    
  hide() {
    this.wordTooltip.hide();
    this.sentTooltip.hide();
  }

  checked() {
    return this.isCheckedSubject.value;
  }

  toggle() {
    this.isCheckedSubject.next(!this.isCheckedSubject.value);
    console.log(this.isCheckedSubject.value);
    if(!this.isCheckedSubject.value) {
      this.hide();
      this.playback.clear();
    }
  }
}