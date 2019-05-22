import { Injectable } from '@angular/core';
import { Story } from './story';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  chosenStory: Story;

  constructor(private http: HttpClient) { }

  saveStory(id, title, date, text) {
    const storyObj = {
      id: id,
      title: title,
      date: date,
      text: text
    };
    console.log(storyObj);
    this.http.post('http://localhost:4000/story/save', storyObj)
      .subscribe(res => console.log('Done'));
  }

  getStory() {
    return this.http.get('http://localhost:4000/story/');
  }

}
