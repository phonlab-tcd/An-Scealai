import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private http: HttpClient,) { }

  story : any;
  
  ngOnInit() {
    this.getParams().then(params => {
      this.http.get('http://localhost:4000/story/viewStory/' + params['id'].toString()).subscribe((res) => {
        this.story = res[0];
      });
    })
  }

  getParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

}
