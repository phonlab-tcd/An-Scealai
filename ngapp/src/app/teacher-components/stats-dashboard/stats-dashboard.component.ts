import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss']
})
export class StatsDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  toggleFullscreen(event: MouseEvent): void {
    const targetElem = event.target as HTMLElement;
    const cardElem = targetElem.closest('.stats-card'); // They may have clicked on a descendent of the mat card
    if (cardElem.classList.contains('stats-card-fullscreen')) {
      cardElem.classList.remove('stats-card-fullscreen');
    } else {
      cardElem.classList.add('stats-card-fullscreen');
    }
  }

}
