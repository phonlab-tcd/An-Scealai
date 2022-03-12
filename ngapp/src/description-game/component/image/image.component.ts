import { Component, ChangeDetectorRef, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'description-game-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  @Input('src') src: string;
  private count = { mouseover: 0, mouseout: 0 }

  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }
}
