import { Injectable } from '@angular/core';
import { Story } from './story';
import { HttpClient } from '@angular/common/http';
import { DefaultIterableDifferFactory } from '@angular/core/src/change_detection/change_detection';
import { Router } from '@angular/router';
import { AuthenticationService, TokenPayload } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  chosenStory: Story;

  constructor(private http: HttpClient,
    private router: Router,
    private auth: AuthenticationService) { }

  saveStory(id, title, date, dialect, text, author) {
    const storyObj = {
      id: id,
      title: title,
      date: date,
      dialect: dialect,
      text: text,
      author: author
    };
    console.log(storyObj);
    this.http.post('http://localhost:4000/story/create', storyObj)
      .subscribe(res => this.router.navigateByUrl('/dashboard/' + id));
  }

  getStory() {
    let author = this.auth.getUserDetails().username;
    return this.http.get('http://localhost:4000/story/'+author);
  }

  updateStory(text, id) {
    const obj = {
      text: text
    };
    this.http.post('http://localhost:4000/story/update/'+id, obj).subscribe(
      res => console.log('Done')
    );
  }

  deleteStory(id) {
    return this.http.get('http://localhost:4000/story/delete/'+id);
  }

}
