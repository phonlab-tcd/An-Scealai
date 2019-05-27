import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editMode: boolean;

  constructor(public auth: AuthenticationService) { }

  ngOnInit() {
    this.editMode = false;
  }

  toggleEditMode() {
    if(this.editMode) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

}
