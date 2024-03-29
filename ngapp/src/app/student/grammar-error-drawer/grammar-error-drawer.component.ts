import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { QuillHighlighter } from "lib/quill-highlight/quill-highlight";
import { ERROR_TYPES, ERROR_INFO, ErrorTag, ErrorType, CHECKBOXES, CHECKBOX_TYPE } from "lib/grammar-engine/types";
import { GrammarEngine } from "lib/grammar-engine/grammar-engine";

@Component({
  selector: "app-grammar-error-drawer",
  templateUrl: "./grammar-error-drawer.component.html",
  styleUrls: ["./grammar-error-drawer.component.scss"],
})
export class GrammarErrorDrawerComponent implements OnInit {
  @Output() closeGrammarEmitter = new EventEmitter();
  @Input() quillHighlighter?: QuillHighlighter;
  @Input() grammarLoaded?: boolean;
  @Input() grammarErrorsTypeDict?: Object;
  @Input() grammarEngine?: GrammarEngine;
  @Input() checkBoxes?: CHECKBOX_TYPE;

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
  toggleLegendTag(key: ErrorType) {
    if (!this.checkBoxes) return;
    this.checkBoxes[key] = !this.checkBoxes[key];

    const errorsToToggle = this.grammarEngine!.errorStoreForLatestCheck.getType(key);

    if(!errorsToToggle) return;
    if(!this.quillHighlighter) return;

    if(this.checkBoxes[key])  this.quillHighlighter.show(errorsToToggle);
    else                      this.quillHighlighter.hide(errorsToToggle);

    if (this.checkBoxes[key]) {
      document.getElementById(key)!.classList.remove("hideLegendItem");
    } else {      
      document.getElementById(key)!.classList.add("hideLegendItem");
    }
  }
  
  public tickedTagTypes() {
    if (!this.checkBoxes) return;
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
}
