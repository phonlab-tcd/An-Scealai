import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';

@Component({
  selector: 'app-state-exam-prompts',
  templateUrl: './state-exam-prompts.component.html',
  styleUrls: ['./state-exam-prompts.component.scss']
})
export class StateExamPromptsComponent implements OnInit {
  currentPrompt: string;

  constructor(
    public ts: TranslationService,
  ) { }

  ngOnInit(): void {
    console.log("State exam prompts init");
  }

  randomPrompt(promptArray: string[]) {
    const index: number = Math.floor(Math.random() * promptArray.length);
    this.currentPrompt = promptArray[index];
    return this.currentPrompt;
  }
}
