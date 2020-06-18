import { Component, OnInit } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUserResults();
  }

  // This array will store User objects to be displayed
  userResults : User[];

  /**
   * Gets an array of all users on the database
   */
  getUserResults() {
    this.userService.getAllUsers().subscribe((users) => {
      this.userResults = users;
    })
  }

}
