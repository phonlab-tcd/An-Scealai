import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'An Scéalaí';

  checkVal = false;

  changeCheck() {
    if(this.checkVal === false) {
      this.checkVal = true;
    } else {
      this.checkVal = false;
    }
    
    console.log("TEST");
  }
}
