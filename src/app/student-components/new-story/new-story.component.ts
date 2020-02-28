import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { StoryService } from '../../story.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-new-story',
  templateUrl: './new-story.component.html',
  styleUrls: ['./new-story.component.css']
})
export class NewStoryComponent implements OnInit {

  newStoryForm: FormGroup;
  constructor(private fb: FormBuilder,  private storyService: StoryService,
    private auth: AuthenticationService, public ts : TranslationService) {
    this.createForm();
  }

  createForm() {
    this.newStoryForm = this.fb.group({
      title: ['', Validators.required],
      dialect: ['connemara']
    });
  }

  ngOnInit() {
  }

  addNewStory(title, dialect) {
    let id = uuid();
    let date = new Date();
    let username = this.auth.getUserDetails().username;
    this.storyService.saveStory(id, title, date, dialect, "", username);
  }
}
