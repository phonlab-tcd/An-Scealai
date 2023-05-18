import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TranslationService, MessageKey, } from "app/core/services/translation.service";
import { QuillHighlighter } from '../../lib/quill-highlight/quill-highlight';

@Component({
  selector: 'app-grammar-error-drawer',
  templateUrl: './grammar-error-drawer.component.html',
  styleUrls: ['./grammar-error-drawer.component.scss']
})
export class GrammarErrorDrawerComponent implements OnInit {

  @Output() closeGrammarEmitter = new EventEmitter();
  @Input() quillHighlighter: QuillHighlighter;
  @Input() grammarLoaded: boolean;
  @Input() grammarErrorsTypeDict: Object;
  @Input() checkBoxes: Object;

  constructor(public ts: TranslationService,) { }

  ngOnInit(): void {
  }

  /* Sets text for bottom blue bar of grammar checker */
  selectedGrammarSuggestion() {
    if (this.quillHighlighter)
      return this.quillHighlighter.getGrammarMessage(this.grammarLoaded)
    else
      return '';
  }

      /**
   * Apply error highlighting depending on which errors are checked to display
   * @param tags grammar errors
   * @param boxChecked true if box checked, false otherwise
   */
      setCheckBox(key, tags) {
        this.checkBoxes[key] = !this.checkBoxes[key];
        if (this.checkBoxes['showAll']) this.checkBoxes['showAll'] = false;
        
        if(this.checkBoxes[key]) {
          this.quillHighlighter.show(tags);
          document.getElementById(key).classList.remove("hideLegendItem");
        }
        else {
          this.quillHighlighter.hide(tags);
          document.getElementById(key).classList.add("hideLegendItem");
        }
      }

}
