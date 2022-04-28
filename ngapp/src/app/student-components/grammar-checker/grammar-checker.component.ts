// app/student-components/grammar-checker/grammar-checker.component.ts
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  } from '@angular/core';

import { AuthenticationService } from 'app/authentication.service';
import { StatsService } from 'app/stats.service';
import { ClassroomService } from 'app/classroom.service';
import { HighlightTag, } from 'angular-text-input-highlight';
import { GrammarService, GrammarTag } from 'app/grammar.service';
import { TranslationService } from 'app/translation.service';
import { Story } from 'app/story';
import debounce from 'lodash/debounce';

function cloneString(str: string) {
  return (' ' + str).slice(1);
}

enum FILTER
{
  GRAMADOIR,
  VOWEL,
}

/*
** **************** Tag Set Type **************************
*/
type TagSet = Record<FILTER, HighlightTag[]>;

@Component({
  selector: 'app-grammar-checker',
  templateUrl: './grammar-checker.component.html',
  // TODO WRITE LESS CSS
  styleUrls: [
    './grammar-checker.component.css',
    '../../app.component.css',
  ],
})
export class GrammarCheckerComponent implements
    AfterViewInit
{

  FILTER = FILTER;

  @Input() story: Story;
  @Input() classroomId: string;

  @ViewChild('grammarCheckerTextArea')
  grammarCheckerTextArea: ElementRef<HTMLTextAreaElement>;

  checkedText = {
    [FILTER.GRAMADOIR]: '',
    [FILTER.VOWEL]: '',
  };
  timeThatCheckedTextWasChecked: Date;

  mostRecentGramadoirRunId = 0;
  mostRecentVowelRunId = 0;

  grammarLoading = true;

  vowelLoading = true;

  selectedFilter = this.FILTER.GRAMADOIR;

  filteredTags: Map<string, HighlightTag[]> = new Map();
  tags: HighlightTag[];
  teacherSelectedErrors: string[] = [];
  chosenTag: GrammarTag;
  tagSets: TagSet = {
    [FILTER.GRAMADOIR]: [],
    [FILTER.VOWEL]: [],
  };
  grammarSelected = true;
  checkBox: Map<string, boolean> = new Map();
  hideEntireGrammarChecker = true;

  gramadoirErrorMessage: string = null;

  constructor(
    private grammar: GrammarService,
    // ts is public so that it can be accessed in the html template
    public ts: TranslationService,
    private statsService: StatsService,
    private classroomService: ClassroomService,
    private auth: AuthenticationService,
   ) { }

  debounceGramadoir = debounce(() => {
    this.synchroniseGramadoir();
    this.synchroniseVowelAgreementChecker();
  }, 500);

  ngAfterViewInit(): void {
    this.synchroniseGramadoir();
    this.synchroniseVowelAgreementChecker();
  }

  
  // Set boolean variables for
  // checking data / grammar window
  // in interface
  // Check grammar using grammar service
  // Set grammar tags using grammar
  // service subscription and filter them by rule
  // Add logged event for checked grammar
  async runGramadoir(): Promise<void> {
    this.putFocusOnGrammarTextArea();
    // PUT BACKEND REQUEST IN THE QUEUE
    const checkingText = cloneString(this.story.text);
    const tagsHandle = this
      .grammar
      .getGramadoirTagsEnglishAndIrishAsHighlightTags(checkingText, this.story);

    // CANCEL GRAMMAR CHECKER IF TEXT HASN'T CHANGED
    if (!this.gramadoirErrorMessage && checkingText === this.checkedText[FILTER.GRAMADOIR]) {
      const backupFilteredTags = this.filteredTags;
      this.filteredTags = new Map();
      tagsHandle.tags.catch((error) => {
        this.gramadoirErrorMessage = error.name + ': ' + error.message;
      });
      tagsHandle.controller.abort();
      // WAIT 100 MILISECONDS SO THAT THE USER SEES THAT THEIR CLICK WAS ACKNOWLEDGED
      setTimeout(() => {
        this.filteredTags = backupFilteredTags;
      }, 100);
      // NO NEED TO CALCULATE VOWEL AGREEMENT AGAIN SINCE TEXT HASN'T CHANGED
    } else {
      this.checkedText[FILTER.GRAMADOIR] = checkingText;
      this.filteredTags.clear();
      await tagsHandle.tags.then(
          (tags) => { this.graciouslyReceiveGramadoirHighlightTags(tags); },
          (error) => { this.graciouslyHandleGramadoirError(error); });

    }
  }

  putFocusOnGrammarTextArea() {
    if (this.grammarCheckerTextArea) {
      this.grammarCheckerTextArea.nativeElement.scrollTo(0, 0);
      this.grammarCheckerTextArea.nativeElement.focus();
      this.putFocusOnGrammarTextArea = this.putFocusOnGrammarTextAreaAlt;
    }
  }

  putFocusOnGrammarTextAreaAlt() {
    this.grammarCheckerTextArea.nativeElement.scrollTo(0, 0);
    this.grammarCheckerTextArea.nativeElement.focus();
  }

  graciouslyHandleGramadoirError(error: any) {
    this.gramadoirErrorMessage = error.message;
    window.alert(`There was an error while running ` +
                 `the grammar checker. You may need ` +
                 `to refresh the page, but please save ` +
                 `your work (copy it into a document on ` +
                 `your computer) before refreshing.\n\n\n` +
                 `Error message: ${error.message}`);
  }

  graciouslyReceiveGramadoirHighlightTags = (tags: HighlightTag[]) => {
    console.count("RECEIVING GRAMMAR HIGHLIGHT TAGS");
    // NOTE RECEPTION TIME
    this.timeThatCheckedTextWasChecked = new Date();

    // UPDATE GRAMADOIR TAGS
    this.tagSets[FILTER.GRAMADOIR] = tags;

    // RESET GRAMADOIR FILTER
    this.filterTags();

    // REMOVE ERROR MESSAGE IF IT EXISTS
    this.gramadoirErrorMessage = null;
  }

  // filter the grammar tags using a map
  // key: rule name
  // value: array of tags that match the rule
  // sets checkBox map value to false (value) for each rule (key)
  filterTags() {
    this.filteredTags.clear();
    this.classroomService.getGrammarRules(
      this.classroomId)
        .subscribe(
          (res) => {
            console.count("GOT CLASSROOM GRAMMAR RULES");
            this.teacherSelectedErrors = res;

            // loop through tags of errors found in the story
            for (const tag of this.tagSets[FILTER.GRAMADOIR]) {
              let values: HighlightTag[] = [];
              let rule: string = tag.data.english.ruleId.substring(22);
              const rx = rule.match(/(\b[A-Z][A-Z]+)/g);
              rule = rx[0];
              // check against errors that the teacher provides
              if (this.teacherSelectedErrors.length > 0) {
                if (this.teacherSelectedErrors.indexOf(rule) !== -1) {
                  if (this.filteredTags.has(rule)) {
                    values = this.filteredTags.get(rule);
                    values.push(tag);
                    this.filteredTags.set(rule, values);
                  }
                  else {
                    values.push(tag);
                    this.filteredTags.set(rule, values);
                    this.checkBox.set(rule, false);
                  }
                }
              }
              // otherwise check against all grammar errors
              else {
                if (this.filteredTags.has(rule)) {
                  values = this.filteredTags.get(rule);
                  values.push(tag);
                  this.filteredTags.set(rule, values);
                }
                else {
                  values.push(tag);
                  this.filteredTags.set(rule, values);
                  this.checkBox.set(rule, true);
                }
              }
            }
            this.updateStats();
    });
  }

  // Update the grammar error map of the stat object
  // corresponding to the current student id
  updateStats() {
    console.count("UPDATE STATS GRAMMAR CHECKER");
    const updatedTimeStamp = new Date();
    const userDetails = this.auth.getUserDetails();

    if (!userDetails) {
      return;
    }

    this.statsService
        .updateGrammarErrors(
            userDetails._id,
            this.filteredTags,
            updatedTimeStamp)
        .subscribe();
  }

  // Set tags to vowel tags or grammar tags based on event value
  onChangeGrammarFilter(eventValue: FILTER) {
    this.chosenTag = null;
    this.grammarCheckerTextArea?.nativeElement.scrollTo(0, 0);
    this.selectedFilter = eventValue;
  }

  // Gets an array of HighlighTags for which the associated grammar error category
  // is selected according to the checkBox map.
  // E.g. if 'seimhiu' checkbox is selected, then this will return the array of
  // HighlightTags for seimhiu.
  getSelectedTags(): HighlightTag[] {
    // Get only those filteredTags whose keys map to true in checkBox
    const selectedTagsLists =
      Array.from(this.filteredTags.entries())
          .map(
            (entry) => {
              // entry[0] is key, entry[1] is val.
              if (this.checkBox.get(entry[0])) {
                return entry[1];
              } else {
                return [];
              }
            }
          );
    // Flatten 2d array of HighlightTags
    const selectedTags =
      selectedTagsLists.reduce((acc, val) => acc.concat(val), []);
    return selectedTags;
  }

  // set the css class to hover over the tag
  addTagHoverClass(tagElement: HTMLInputElement) {
    tagElement.classList.remove('tagNotHover');
    tagElement.classList.add('tagHover');
  }

  // set the css class to not hover over the tag
  removeTagHoverClass(tagElement: HTMLInputElement) {
    tagElement.classList.remove('tagHover');
    tagElement.classList.add('tagNotHover');
  }

  // set chosen tag to tag passed in parameters
  chooseGrammarTag(tag: HighlightTag) {
    if (tag.data.vowelAgreement) {
      this.chosenTag = new GrammarTag('vowelAgreement', tag.data);
      return;
    }

    this.chosenTag =
      new GrammarTag('gramadoir', tag.data.english, tag.data.irish);
  }

  chosenTagIsVowelAgreement() {
    return (this.chosenTag ? false : this.chosenTag?.type === 'vowelAgreement');
  }

  getGramadoirMessage() {
    if (!this.chosenTag) {
      return 'ERROR: GrammarTag is ' + this.chosenTag;
    }

    switch (this.chosenTag.type) {
      case 'gramadoir':
        switch (this.ts.l.iso_code){
          case 'en':
            return this.chosenTag.messageEnglish;
          case 'ga':
            return this.chosenTag.messageIrish;
        }
        break;
      case 'vowelAgreement':
        return (this.ts.l[this.chosenTag.message] ?
                this.ts.l[this.chosenTag.message] :
                this.chosenTag.message);
    }
  }

  isGramadoirMode() {
    return this.selectedFilter === this.FILTER.GRAMADOIR;
  }

  isVowelMode() {
    return this.selectedFilter === this.FILTER.VOWEL;
  }

  async synchroniseGramadoir() {
    this.mostRecentGramadoirRunId++;
    const myGramadoirRunId = this.mostRecentGramadoirRunId;
    this.grammarLoading = true;
    await this.runGramadoir();
    if (myGramadoirRunId === this.mostRecentGramadoirRunId) {
      this.grammarLoading = false;
    }
  }

  async synchroniseVowelAgreementChecker(){
    this.mostRecentVowelRunId++;
    const myVowelRunId = this.mostRecentVowelRunId;
    this.vowelLoading = true;
    this.tagSets[FILTER.VOWEL] = [];
    const syncStarted = new Date();

    this.checkedText[FILTER.VOWEL] =
      cloneString(this.story.text);

    const newTags  =
      this.grammar
          .getVowelAgreementTags(
              this.checkedText[FILTER.VOWEL]);

    try{
      const timeElapsed =
        new Date().valueOf() - syncStarted.valueOf();

      const remainingWait =
        timeElapsed >= 100 ? 0 : 100 - timeElapsed;

      setTimeout(() => {
        if (myVowelRunId === this.mostRecentVowelRunId){
          this.vowelLoading = false;
        }
        this.tagSets[FILTER.VOWEL] = newTags;
      }, remainingWait);
    }
    catch (error) {
      this.tagSets[FILTER.VOWEL] = newTags;
      this.vowelLoading = false;
    }
  }
}
