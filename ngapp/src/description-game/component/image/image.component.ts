import { Component, OnInit } from '@angular/core';
import config from 'src/abairconfig.json';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  public src: string = config.baseurl + 'image/dog/1.png';
  private count = { mouseover: 0, mouseout: 0 }

  constructor() { }

  mouseover() { this.count.mouseover++}
  mouseout() { this.count.mouseout++}

  ngOnInit(): void {}

}
