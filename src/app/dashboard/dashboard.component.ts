import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showContents: boolean = false;
  showStory: boolean = true;
  showChatbot: boolean = false;
  title: string = "Teideal";
  leftBtnLabel: string = "My Stories";
  rightBtnLabel: string = "Taidhgín";
  leftBtnVisible: boolean = true;
  rightBtnVisible: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
