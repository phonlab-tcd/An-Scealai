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
  userResults : User[] = [];
  numberOfUsers : number = 0;
  students : boolean = false;
  teachers : boolean = false;
  admins : boolean = false;
  allStudents : User[] = [];
  allTeachers : User[] = [];
  allAdmins: User[] = [];
  
  /**
   * Gets an array of all users on the database
   */
  getUserResults() {
    this.userService.getAllUsers().subscribe((users: any) => {
      this.userResults = users, this.numberOfUsers = this.userResults.length, this.filterArray(users);
    });
  }
  
  /*
  *  Fill individual arays of students, teachers, and admins from the userResults array
  */
  filterArray(users) {
    for(let i of users) {
      if(i.role === "STUDENT") {
        this.allStudents.push(i);
      }
      else if (i.role === "TEACHER") {
        this.allTeachers.push(i);
      }
      else if (i.role === "ADMIN") {
        this.allAdmins.push(i);
      }
      else {
        console.log("User is not a student, teacher, or admin");
      }
    }
  }
}
