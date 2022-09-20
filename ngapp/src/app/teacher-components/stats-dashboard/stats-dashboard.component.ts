import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss']
})
export class StatsDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

  sampleTexts = [
    'Hello there. The cat sat on the mat.',
    'The dog sat on the frog.',
    'The frog sat on the dog'
  ];
  

  toggleFullscreen(event: MouseEvent): void {
    // Make the card fullscreen via CSS
    const targetElem = event.target as HTMLElement;
    const cardElem = targetElem.closest('.stats-card') as HTMLElement; // They may have clicked on a descendent of the mat card
    const canvasElem = cardElem.querySelector('canvas');
    const fullscreenIcon = targetElem.closest('i') as HTMLElement;
    if (cardElem.classList.contains('stats-card-fullscreen')) {
      cardElem.classList.remove('stats-card-fullscreen');
      canvasElem.style.cssText = `width: 400px; height: 200px;`;
      fullscreenIcon.classList.remove('fa-compress');
      fullscreenIcon.classList.add('fa-expand');
    } else {
      cardElem.classList.add('stats-card-fullscreen');
      canvasElem.width = cardElem.offsetWidth;
      canvasElem.height = 400;
      canvasElem.style.cssText = `width: ${cardElem.offsetWidth}px;`;
      fullscreenIcon.classList.remove('fa-expand');
      fullscreenIcon.classList.add('fa-compress');
    }
  }

}