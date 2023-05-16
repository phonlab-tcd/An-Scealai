import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslationService, MessageKey } from 'app/core/services/translation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss',
    './../../lib/quill-highlight/gramadoir-tags.scss',
    './../../../quill.fonts.scss',
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  showFiller = false;
  dontToggle = false;
  showOptions = true;
  showErrorTags = false;
  storySaved = true;

  constructor(public ts: TranslationService,) { }

  story = {
    text: 'hello',
    title: 'test',
    createdWithPrompts: false
  }


  ngOnInit(): void {
  }

    /* Toggle upper menu buttons */
    toggleOptions() {
      if (!this.dontToggle){
        this.showOptions = !this.showOptions;
      }
      this.dontToggle = false;
    }

      /* If story not saved, make title italic */
  titleStyle() {
    return {'font-style': this.storySaved ? 'normal' : 'italic'};
  }

    downloadStoryUrl() {

    }

    hasNewFeedback() {

    }

    toggleGrammarButton() {
      const key: MessageKey = this.showErrorTags ?
      'hide_grammar_suggestions': 
      'show_grammar_suggestions';
    return this.ts.message(key);

    }

    toggleGrammarTags() {

    }

    showModal() {

    }
}
