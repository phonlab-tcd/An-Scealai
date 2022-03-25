import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import config from 'src/abairconfig.json';
@Component({
  selector: 'description-game-decide',
  templateUrl: './decide.component.html',
  styleUrls: ['./decide.component.css']
})
export class DecideComponent implements OnInit {
  possibleImages = ['/dog/001.png','/dog/002.png','/dog/001.png','/dog/002.png','/dog/001.png','/dog/002.png'].map(u => config.baseurl + 'image' + u);

  constructor() { }

  ngOnInit(): void {
  }

}
