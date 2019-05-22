import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-new-story',
  templateUrl: './new-story.component.html',
  styleUrls: ['./new-story.component.css']
})
export class NewStoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  makeUUID() {
    console.log('UUID: ', uuid());
  }

}
