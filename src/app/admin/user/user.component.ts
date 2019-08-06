import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Story } from '../../story';
import { StoryService } from '../../story.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private storyService: StoryService) { }

  user: any;
  stories: Story[];

  ngOnInit() {
    this.getUserId().then(params => {
      this.http.get('http://localhost:4000/user/viewUser', {headers: {_id : params['id'].toString()}}).subscribe((res) => {
        this.user = res;
        this.storyService
        .getStoriesFor(this.user.username)
        .subscribe((data: Story[]) => {
          this.stories = data;
        });
      });
    })
  }

  getUserId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

}
