import synth from "lib/synth";
import Quill from "quill";

const QuillTooltip = Quill.import("ui/tooltip");

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

export default class Buttons {
    quillEditor: Quill;
    playback = new synth.PlaybackHandle();
    enabled = false;
    public wordTooltip: typeof QuillTooltip;
    public sentTooltip: typeof QuillTooltip;

    constructor(qlEditor: Quill) {
        this.quillEditor = qlEditor;
        this.wordTooltip = createSynthesisPlayButton(qlEditor, "word");
        this.sentTooltip = createSynthesisPlayButton(qlEditor, "sent");
    }
}