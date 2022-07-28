import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
@Component({
  selector: 'app-state-exam-prompts',
  templateUrl: './state-exam-prompts.component.html',
  styleUrls: ['./state-exam-prompts.component.scss']
})
export class StateExamPromptsComponent implements OnInit {
  currentPromptIndex: number;
  promptExists: boolean = false;
  userLevel: string;

  constructor(
    public ts: TranslationService,
  ) { }

  ngOnInit(): void {
    console.log("State exam prompts init");
  }

  //Try find a way to not have the arrays in ts service
  randomPrompt(promptArray: string[]) {
    this.promptExists = true;
    this.currentPromptIndex = Math.floor(Math.random() * promptArray.length);
    return this.currentPromptIndex;
  }
}
