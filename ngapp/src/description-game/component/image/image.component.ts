import { Component, OnInit } from '@angular/core';
import config from 'src/abairconfig.json';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  public src: string = config.baseurl + 'image/dog/1.png';

  constructor() { }

  next_image(i) {
    i = (i % 6);
    this.src = config.baseurl + 'image/dog/' + i + '.png';
    setTimeout(()=>this.next_image(i+1),2 * 1000);
  }

  ngOnInit(): void {
    this.next_image(0);
  }

}
