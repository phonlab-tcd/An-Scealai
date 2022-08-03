import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoryService } from 'app/story.service';
import { AuthenticationService } from 'app/authentication.service';
import { ProfileService } from 'app/profile.service';

@Component({
  selector: 'app-proverb-prompts',
  templateUrl: './proverb-prompts.component.html',
  styleUrls: ['./proverb-prompts.component.scss'],
})
export class ProverbPromptsComponent implements OnInit {
  currentPromptIndex: number;
  promptExists: boolean = false;
  userLevel: string;
  levelForm: FormGroup;
  currentPromptBank: string[];
  newStoryForm: FormGroup;
  prompt: string;
  dialectPreferences: string[] = ["Gaeilge Mumha", "Gaeilge Chonnact", "Gaeilge Uladh", "", "Other"];
  dialectPreference: string;
  randomDialectChoice: number;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private auth: AuthenticationService,
    private storyService: StoryService,
    public ts: TranslationService,) 
    { this.ppCreateForm(); }

  ngOnInit(): void {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    console.log("Proverb prompts init...");
    this.profileService.getForUser(userDetails._id).subscribe((res) => {
      if(res) {
        let p = res.profile;
        this.dialectPreference = p.dialectPreference;
      }
    }, (err) => {
    });
  }

  ppCreateForm() {
    this.newStoryForm = this.fb.group({
      title: ['', Validators.required],
      dialect: ['connemara']
    });
  }

  ppAddNewStory(title, dialect, text) {
    let date = new Date();
    let username = this.auth.getUserDetails().username;
    let studentId = this.auth.getUserDetails()._id;
    this.storyService.saveStory(studentId, title, date, dialect, text, username);
  }

  //selectedDialect don't work
  returnDialect() {
    if(this.dialectPreference === "Gaeilge Mumha"){
      return this.ts.l.pp_munster;
    } else if (this.dialectPreference === "Gaeilge Chonnact"){
      return this.ts.l.pp_connacht;
    } else if (this.dialectPreference === "Gaeilge Uladh") {
      return this.ts.l.pp_ulster;
    } else {
      return this.currentPromptBank;
    }
  }

  //For randomPrompt()
  currentPrompt() {
    let bank = this.dialectPreference;
    if(bank === "Gaeilge Uladh"){
      this.currentPromptBank = this.ts.l.pp_munster;
    } else if(bank === "Gaeilge Chonnact") {
      this.currentPromptBank = this.ts.l.pp_connacht;
    } else if (bank === "Gaeilge Uladh"){
      this.currentPromptBank = this.ts.l.pp_ulster;
    } else {
      this.currentPromptBank = this.randomDialect(Math.floor(Math.random() * 3));
      console.log(this.currentPromptBank);
      
    }
  }

  randomDialect(choice: number){
    if(choice === 0) {
      return this.ts.l.pp_munster;
    }else if(choice === 1) {
      return this.ts.l.pp_connacht;
    } else {
      return this.ts.l.pp_ulster;
    }
  }

  //Try find a way to not have the arrays in ts service
  randomPrompt(promptArray: string[]) {
    this.promptExists = true;
    this.currentPromptIndex = Math.floor(Math.random() * promptArray.length);
    this.prompt = this.currentPromptBank[this.currentPromptIndex];
    return this.currentPromptIndex;
  }
}
