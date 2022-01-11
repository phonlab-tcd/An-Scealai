import { Component, OnInit, } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { TranslationService } from '../../translation.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent implements OnInit {

  constructor(private userService: UserService, public ts: TranslationService) { }
  
  public searchText: string;
  public searchModelChanged: Subject<string> = new Subject<string>();
  private searchModelChangeSubscription: Subscription;

  ngOnInit() {
    this.searchModelChangeSubscription = this.searchModelChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(searchString => {
        this.searchUsers(searchString)
      });
  }

  ngOnDestroy() {
    this.searchModelChangeSubscription.unsubscribe();
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
  dataLoaded: boolean = true;

  searchUsers(searchString: string) {
    this.dataLoaded = false;
    this.userService.searchUser(searchString, 0, 2).subscribe((users: any) => {
      this.userResults = users.map(userData => new User().fromJSON(userData));
      this.dataLoaded = true;
    });
  }
  
  /*
  *  Fill individual arays of students, teachers, and admins from the userResults array
  */
 // We'll probably need to do this filtering on the backend.
 /*
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
  */

  /*
  goBack() {
    this.router.navigateByUrl('/admin/dashboard/');
  }
  */
}
