// src/app/student-components/grammar-checker/grammar-checker.component.ts
import { EngagementService} from 'src/app/engagement.service';
import { EventType } from 'src/app/event';
import { AuthenticationService } from 'src/app/authentication.service';
import { StatsService } from 'src/app/stats.service';
import { ClassroomService } from 'src/app/classroom.service';
import { HighlightTag, } from 'angular-text-input-highlight';
import { Component, OnInit, Input } from '@angular/core';
import { GrammarService, GrammarTag, TagSet  } from 'src/app/grammar.service';
import { TranslationService } from 'src/app/translation.service';
import { Story } from 'src/app/story';

@Component({
  selector: 'app-grammar-checker',
  templateUrl: './grammar-checker.component.html',
  // TODO WRITE LESS CSS
  styleUrls: [
  ],
})
export class GrammarCheckerComponent implements OnInit {

  @Input() story: Story;
  @Input() classroomId: string;

  grammarLoading = true;
  grammarChecked = false;

  filteredTags: Map<string, HighlightTag[]> = new Map();
  tags: HighlightTag[] = [];
  teacherSelectedErrors: string[] = [];
  chosenTag: GrammarTag;
  tagSets: TagSet;
  grammarSelected = true;
  checkBox: Map<string, boolean> = new Map();
  hideEntireGrammarChecker = true;

  constructor(
    private grammar: GrammarService,
    private ts: TranslationService,
    private statsService: StatsService,
    private classroomService: ClassroomService,
    private auth: AuthenticationService,
    private engagement: EngagementService,
   ) { }

  ngOnInit(): void {
    this.runGramadoir();
  }

  /*
  * Set boolean variables for checking data / grammar window in interface
  * Check grammar using grammar service
  * Set grammar tags using grammar service subscription and filter them by rule
  * Add logged event for checked grammar
  */
  runGramadoir() {
    this.grammarChecked = false;
    this.grammarLoading = true;
    this.tags = [];
    this.filteredTags.clear();
    this.chosenTag = null;
    this.grammar
        .checkGrammar(this.story._id).subscribe(
          (res: TagSet) => {
            this.tagSets = res;
            this.tags = this.tagSets.gramadoirTags;
            this.filterTags();
            this.grammarLoading = false;
            this.grammarChecked = true;
            this.engagement.addEventForLoggedInUser(EventType['GRAMMAR-CHECK-STORY'], this.story);
      });
  }

  /*
  * filter the grammar tags using a map
  * key: rule name
  * value: array of tags that match the rule
  * sets checkBox map value to false (value) for each rule (key)
  */
  filterTags() {
    this.classroomService.getGrammarRules(
      this.classroomId)
        .subscribe(
          (res) => {  
            this.teacherSelectedErrors = res;

            // loop through tags of errors found in the story
            for(let tag of this.tags) {
              let values: HighlightTag[] = [];
              let rule: string = tag.data.ruleId.substring(22);
              
              let rx = rule.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g);
              rule = rx[0];
            
              // check against errors that the teacher provides
              if(this.teacherSelectedErrors.length > 0) {
                if(this.teacherSelectedErrors.indexOf(rule) !== -1) {
                  if(this.filteredTags.has(rule)) {
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
                if(this.filteredTags.has(rule)) {
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
            console.log("Filtered tags: ", this.filteredTags);
            this.updateStats();
    });
  }

  /*
  * Update the grammar error map of the stat object corresponding to the current student id
  */
  updateStats() {
    console.log('Update grammar errors');
    const updatedTimeStamp = new Date();
    const userDetails = this.auth.getUserDetails();

    if (!userDetails) {
      return;
    }

    this.statsService
        .updateGrammarErrors(
            userDetails._id,
            this.filteredTags,
            updatedTimeStamp,
        ).subscribe(
        (res) => {
          console.log(res);
        });
  }

  /*
  * Set tags to vowel tags or grammar tags based on event value
  */
  onChangeGrammarFilter(eventValue: any) {
    this.chosenTag = null;
    if (eventValue === 'vowel') {
      this.tags = this.tagSets.vowelTags;
      this.grammarSelected = false;
    }
    if (eventValue === 'gramadoir') {
      this.tags = this.tagSets.gramadoirTags;
      this.grammarSelected = true;
    }
  }

  /**
   * Gets an array of HighlighTags for which the associated grammar error category
   * is selected according to the checkBox map.
   * E.g. if 'seimhiu' checkbox is selected, then this will return the array of
   * HighlightTags for seimhiu.
   */
  getSelectedTags(): HighlightTag[] {
    // Get only those filteredTags whose keys map to true in checkBox
    const selectedTagsLists = Array.from(this.filteredTags.entries()).map(entry => {
      // entry[0] is key, entry[1] is val.
      if (this.checkBox.get(entry[0])) {
        return entry[1];
      } else {
        return [];
      }
    });
    // Flatten 2d array of HighlightTags
    const selectedTags = selectedTagsLists.reduce((acc, val) => acc.concat(val), []);
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
    this.chosenTag = new GrammarTag(tag.data);
  }
}
