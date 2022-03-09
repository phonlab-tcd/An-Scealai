import { Component, ChangeDetectorRef, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'description-game-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  @Input('src') src: string;
  @ViewChild('viewer') viewer;
  private count = { mouseover: 0, mouseout: 0 }

  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.viewer.thumbWidth = 20;
    this.viewer.thumbHeight = 20;
    this.viewer.fullWidth = 20;
    this.viewer.fullHeight = 20;
    this.cd.detectChanges();
  }
  
}
