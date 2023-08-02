import synth from "lib/synth";
import Quill from "quill";

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
    public wordTooltip: typeof QuillTooltip;
    public sentTooltip: typeof QuillTooltip;

    constructor(qlEditor: Quill) {
        this.quillEditor = qlEditor;
        this.wordTooltip = createSynthesisPlayButton(qlEditor, "word");
        this.sentTooltip = createSynthesisPlayButton(qlEditor, "sent");
    }
}