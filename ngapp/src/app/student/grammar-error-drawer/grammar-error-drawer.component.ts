import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { QuillHighlighter } from "../../lib/quill-highlight/quill-highlight";
import { ERROR_TYPES, ERROR_INFO, ErrorTag, ErrorType } from "app/lib/grammar-engine/types";
import { GrammarEngine } from "app/lib/grammar-engine/grammar-engine";

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
  @Input() grammarErrors: ErrorTag[];
  @Input() grammarEngine: GrammarEngine;
  @Input() checkBoxes: Object;

  public ERROR_TYPES = ERROR_TYPES;
  public ERROR_INFO = ERROR_INFO;

  constructor(public ts: TranslationService) {}

  ngOnInit(): void {}

  displayTagType(type: ErrorType): boolean {
    if(!this.grammarEngine || !this.grammarEngine.errorStoreForLatestCheck) {
      return false;
    }
    return this.grammarEngine.errorStoreForLatestCheck.typeIsNonEmpty(type);
  }

  /**
   * Apply error highlighting depending on which errors are clicked to display
   * @param key error name
   */
  toggleLegendTag(key) {
    this.checkBoxes[key] = !this.checkBoxes[key];

    const errorsToToggle = this.grammarEngine.errorStoreForLatestCheck.getType(key);

    if(!errorsToToggle) return;
    if(!this.quillHighlighter) return;

    if(this.checkBoxes[key])  this.quillHighlighter.show(errorsToToggle);
    else                      this.quillHighlighter.hide(errorsToToggle);

    // this.quillHighlighter.hideAll();
    // this.quillHighlighter.show( this.grammarErrors.filter((tag) => this.checkBoxes[tag.type]).map(ErrorTag2HighlightTag) )

    if (this.checkBoxes[key]) {
      document.getElementById(key).classList.remove("hideLegendItem");
    } else {      
      document.getElementById(key).classList.add("hideLegendItem");
    }
  }
  
  public tickedTagTypes() {
    const types = [];
    for(const type of ERROR_TYPES) {
      if(this.checkBoxes[type]) {
        types.push(type);
      }
    }
    return types;
  }

  public nonEmptyErrorTypes() {
    if(!this.grammarEngine || !this.grammarEngine.errorStoreForLatestCheck) return [];
    return this.grammarEngine.errorStoreForLatestCheck.nonEmptyTypes();
  }

  /**
   * Returns true if the grammarErrorsTypeDict object has any key/value pairs
   * @returns true or false
   */
  hasGrammarErrors():boolean {
    return true; // TODO fix this
  }
}
