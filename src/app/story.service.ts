import { Injectable } from '@angular/core';
import { Story } from './story';
import { HttpClient } from '@angular/common/http';
import { DefaultIterableDifferFactory } from '@angular/core/src/change_detection/change_detection';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  chosenStory: Story;

  constructor(private http: HttpClient,
    private router: Router) { }

  saveStory(id, title, date, dialect, text) {
    const storyObj = {
      id: id,
      title: title,
      date: date,
      dialect: dialect,
      text: text
    };
    console.log(storyObj);
    this.http.post('http://localhost:4000/story/save', storyObj)
      .subscribe(res => this.router.navigateByUrl('/dashboard/' + id));
  }

  getStory() {
    return this.http.get('http://localhost:4000/story/');
  }

  updateStory(text, id) {
    const obj = {
      text: text
    };
    this.http.post('http://localhost:4000/story/update/'+id, obj).subscribe(
      res => console.log('Done')
    );
  }

}
