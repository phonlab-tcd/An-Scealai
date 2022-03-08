import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'description-game-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  @Input('src') src: string;
  private count = { mouseover: 0, mouseout: 0 }

  constructor() { }

  mouseover() { this.count.mouseover++}
  mouseout() { this.count.mouseout++}

  ngOnInit(): void {}
}
