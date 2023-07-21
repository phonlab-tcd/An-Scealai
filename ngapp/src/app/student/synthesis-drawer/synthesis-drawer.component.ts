import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
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
  clickedSentencePosition: { top: number, left: number } = { top: 0, left: 0 };
  playWordButton: HTMLButtonElement;

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
        console.log(this.clickedSentencePosition)
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
    console.log(voiceSelect)
  }


  getSentenceAtCursor(text, start, end) {
    while (
      start >= 0 &&
      text[start] !== "." &&
      text[start] !== "?" &&
      text[start] !== "!"
    ) {
      start--;
    }

    while (
      end < text.length &&
      text[end] !== "." &&
      text[end] !== "?" &&
      text[end] !== "!"
    ) {
      end++;
    }

    return text.substring(start + 1, end).trim();
  }

  getCurrentWordAtCursor(text, start, end) {
    // Find the start of the current word
    while (start >= 0 && /\w/.test(text[start])) {
      start--;
    }

    // Find the end of the current word
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

    hidePlayWordButton() {
      this.playWordButton.style.visibility = "hidden";
    }
}
