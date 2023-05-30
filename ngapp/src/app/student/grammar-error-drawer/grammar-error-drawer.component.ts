import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { TranslationService, MessageKey, } from "app/core/services/translation.service";
import { QuillHighlighter } from "../../lib/quill-highlight/quill-highlight";

@Component({
  selector: "app-grammar-error-drawer",
  templateUrl: "./grammar-error-drawer.component.html",
  styleUrls: ["./grammar-error-drawer.component.scss"],
})
export class GrammarErrorDrawerComponent implements OnInit {
  @Output() closeGrammarEmitter = new EventEmitter();
  @Input() quillHighlighter: QuillHighlighter;
  @Input() grammarLoaded: boolean;
  @Input() grammarErrorsTypeDict: Object;
  @Input() checkBoxes: Object;

  constructor(public ts: TranslationService) {}

  ngOnInit(): void {}

  /**
   * Sets text for grammar message of hovered error tag
   * Either displays the grammar message, or 'checking grammar' if not loaded
   * @returns 
   */
  selectedGrammarSuggestion() {
    if (this.quillHighlighter)
      return this.quillHighlighter.getGrammarMessage(this.grammarLoaded);
    else return "";
  }

  /**
   * Apply error highlighting depending on which errors are clicked to display
   * @param key error name
   * @param tags all error tags for given error name
   */
  toggleLegendTag(key, tags) {
    this.checkBoxes[key] = !this.checkBoxes[key];

    if (this.checkBoxes[key]) {
      this.quillHighlighter.show(tags);
      document.getElementById(key).classList.remove("hideLegendItem");
    } else {
      this.quillHighlighter.hide(tags);
      document.getElementById(key).classList.add("hideLegendItem");
    }
  }
}
