import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { SynthVoiceSelectComponent } from "app/student/synth-voice-select/synth-voice-select.component";
import { SynthesisService, Voice } from "app/core/services/synthesis.service";
import Quill from "quill";

@Component({
  selector: "app-synthesis-drawer",
  templateUrl: "./synthesis-drawer.component.html",
  styleUrls: ["./synthesis-drawer.component.scss"],
})
export class SynthesisDrawerComponent implements OnInit {
  @Output() closeSynthesisEmitter = new EventEmitter();
  @Input() quillEditor: Quill;
  @ViewChild("voiceSelect") voiceSelect: ElementRef<SynthVoiceSelectComponent>;
  currentSentence: string;
  currentWord: string;
  playbackSpeed: number = 1; //Shoud range from 0.5x to 2x speed incrementing in 0.5.
  audioLoaded: boolean = true;
  clickedSentencePosition: { top: number; left: number } = { top: 0, left: 0 };
  playWordButton: HTMLButtonElement;

  currentSentenceRange: {start: number, end: number};

  constructor(public ts: TranslationService) {}

  ngOnInit(): void {
    this.createPlayWordButton();
  }

  ngAfterViewInit() {
    // Subscribe to the 'selection-change' event
    this.quillEditor.on("selection-change", (range: any) => {
      if (range) {
        const cursorPosition = this.quillEditor.getBounds(range.index);
        this.clickedSentencePosition.top = cursorPosition.top;
        this.clickedSentencePosition.left = cursorPosition.left;
        this.showInlinePlayWordButton(range);

        const text = this.quillEditor.getText();
        let start = range.index - 1;
        let end = range.index;
        this.currentSentence = this.getSentenceAtCursor(text, start, end);
        console.log(this.currentSentence);
        this.currentWord = this.getCurrentWordAtCursor(text, start, end);
        console.log(this.currentWord);
      }
    });
  }

  test(voiceSelect) {
    console.log(voiceSelect);
  }

  /**
   * Gets the sentence text from location of the cursor
   * @param text Quill text
   * @param start start of quill selection range - 1
   * @param end start of quill selection range
   * @returns sentence text
   */
  getSentenceAtCursor(text, start, end) {
    while ( start >= 0 && text[start] !== "." && text[start] !== "?" && text[start] !== "!" ) {
      start--;
    }

    while ( end < text.length && text[end] !== "." && text[end] !== "?" && text[end] !== "!" ) {
      end++;
    }

    this.currentSentenceRange = {start, end}

    return text.substring(start + 1, end).trim();
  }

  /**
   * Gets the current word in text from location of the cursor
   * @param text Quill text
   * @param start start of quill selection range -1
   * @param end start of quill selection range
   * @returns word text
   */
  getCurrentWordAtCursor(text, start, end) {
    while (start >= 0 && /\w/.test(text[start])) {
      start--;
    }

    while (end < text.length && /\w/.test(text[end])) {
      end++;
    }

    return text.substring(start + 1, end).trim();
  }

  /**
   * Increase or decrease synthesis speed
   * @param increment selected voice speed level
   */
  changeVoiceSpeed(increment: number) {
    if (increment > 0 && this.playbackSpeed < 2) {
      this.playbackSpeed += 0.5;
    }
    if (increment < 0 && this.playbackSpeed > 0.5) {
      this.playbackSpeed -= 0.5;
    }
  }


  /**
   * Create a play button to hover over current word
   */
  createPlayWordButton() {
    this.playWordButton = document.createElement("button");
    this.playWordButton.id = "playWordButton";
    //this.playWordButton.addEventListener("click", () => {});
    this.playWordButton.classList.add("playWordButton");
    this.playWordButton.style.visibility = "hidden";

    // create icon inside button
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-message");
    this.playWordButton.appendChild(iconElement);

    document.body.appendChild(this.playWordButton);
  }

  /**
   * Show the play button over current word when user moves cursor
   * @param range Quill selection range
   */
  showInlinePlayWordButton(range) {
    if (range && range.length > 0) {
      // don't want to create button when highlightCommentReferenceInQuill() is fired
      const length = range.length;
      // get bounds of selected text
      const bounds = this.quillEditor.getBounds(range.index, length);
      // get bounds of entire quill editor
      const editorContainer = this.quillEditor.root.parentNode as HTMLElement;
      const { top } = editorContainer.getBoundingClientRect();
      // set the location of the button
      this.playWordButton.style.left = `${bounds.right}px`;
      this.playWordButton.style.top = `${top + bounds.bottom}px`;
      this.playWordButton.style.visibility = "visible";
    } else {
      // remove any previous comment button added
      this.hidePlayWordButton();
    }
  }

  /**
   * Hide the play button
   */
  hidePlayWordButton() {
    this.playWordButton.style.visibility = "hidden";
  }
}
