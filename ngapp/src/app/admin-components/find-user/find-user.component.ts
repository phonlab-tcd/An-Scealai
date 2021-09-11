import { Component, OnInit, } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent implements OnInit {

  constructor(private userService: UserService, public ts: TranslationService) { }
  
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
  searchText: string = '';
  //onDashboard: Boolean = false;

  /**
   * Gets an array of all users on the database, call the function to make subarrays
   */
  getUserResults() {
    this.userService.getAllUsers().subscribe((users: any) => {
      this.userResults = users.map((userData: any) => new User().fromJSON(userData));
      this.numberOfUsers = this.userResults.length;
      this.filterArray(users);
    });
  }
  
  /*
  *  Fill individual arays of students, teachers, and admins from the userResults array
  */
  filterArray(users: any) {
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
  /*
  goBack() {
    this.router.navigateByUrl('/admin/dashboard/');
  }
  */
}
