import { Component, OnInit } from '@angular/core';
import config from 'src/abairconfig.json';

@Component({
  selector: 'description-game-describe',
  templateUrl: './describe.component.html',
  styleUrls: ['./describe.component.css']
})
export class DescribeComponent implements OnInit {
  imageUri = config.baseurl.concat('image/dog/001.png');
  constructor() { }

  ngOnInit(): void {
  }

}
