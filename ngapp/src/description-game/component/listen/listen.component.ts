import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'description-game-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {

  @Input('recording') recording: any;
  @Input('index') index: number;
  audio: HTMLAudioElement;
  constructor() { }

  ngOnInit(): void {
    this.audio = new Audio(window.URL.createObjectURL(this.recording.data));
  }


}
