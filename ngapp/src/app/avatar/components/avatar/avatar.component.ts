import { Component, OnInit } from '@angular/core';
import init from '../../animation/main';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    init();
  }

}
