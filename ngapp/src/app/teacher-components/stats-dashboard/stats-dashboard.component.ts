import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from "rxjs";
import { UserService } from "../../user.service";

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss']
})
export class StatsDashboardComponent implements OnInit {
  
  studentErrors: any;
  grammarErrorsLoaded: boolean = false;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    await this.getGrammarErrors();
  }
  
  toggleFullscreen(event: MouseEvent): void {
    // Make the card fullscreen via CSS
    const targetElem = event.target as HTMLElement;
    const cardElem = targetElem.closest('.stats-card') as HTMLElement; // They may have clicked on a descendent of the mat card
    const canvasElem = cardElem.querySelector('canvas');
    if (cardElem.classList.contains('stats-card-fullscreen')) {
      cardElem.classList.remove('stats-card-fullscreen');
      canvasElem.style.cssText = `width: 400px; height: 200px;`;
    } else {
      cardElem.classList.add('stats-card-fullscreen');
      canvasElem.width = cardElem.offsetWidth;
      canvasElem.height = 400;
      canvasElem.style.cssText = `width: ${cardElem.offsetWidth}px;`;
    }
  }
  
  // Get grammar errors for a given student
  private async getGrammarErrors() {
    this.studentErrors = await firstValueFrom(
      this.userService.getGrammarErrors("id number goes here")
    );
    console.log(this.studentErrors);
    this.grammarErrorsLoaded = true;
  }


}
