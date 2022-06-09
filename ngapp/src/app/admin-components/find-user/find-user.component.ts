import { Component, OnInit, } from '@angular/core';
import { User } from 'app/user';
import { UserService } from 'app/user.service';
import { TranslationService } from 'app/translation.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Role } from 'role';
import { SearchUserEndpoint } from '@api/src/endpoint/user/searchUser';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.scss']
})
export class FindUserComponent implements OnInit {
  constructor(
    private userService: UserService,
    public ts: TranslationService,
  ) { }
  
  public searchText: string;
  public searchModelChanged: Subject<string> = new Subject<string>();
  private searchModelChangeSubscription: Subscription;

  ngOnInit() {
    this.userService.getUserCount().subscribe(res => this.userCount = res.total);
    this.searchModelChangeSubscription = this.searchModelChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(searchString => {
        this.searchText = searchString;
        this.currentPage = 0;
        this.searchUsers();
      });
  }

  ngOnDestroy() {
    this.searchModelChangeSubscription.unsubscribe();
  }

  userCount: number = 0;

  // This array will store User objects to be displayed
  userResults: User[] = [];
  
  numberOfUsers : number = 0;
  resultCount: number = 0;
  currentPage: number = 0;
  LIMIT = 20;
  roleFilter = {
    'STUDENT': true,
    'TEACHER': true,
    'ADMIN': true,
  }
  dataLoaded: boolean = true;

  validSearchText() {
    try {
      new RegExp(this.searchText, 'i'); // i for case insensitive
    }
    catch (e) {
      console.log('Caught error:', e);
      alert("invalid regular expression");
      return false;
    }
    return true;
  }

  private getRoles(): Role[] {
    const roles: Role[] = [];
    ['STUDENT','ADMIN','TEACHER'].forEach((r:Role)=>{
      if(this.roleFilter[r]) roles.push(r);
    });
    return roles;
  }

  searchUsers() {
    if (!this.validSearchText()) return;
    this.dataLoaded = false;
    this.userResults = [];
    const roles: Role[] = this.getRoles();
    this.userService
        .searchUser(this.searchText, this.currentPage, this.LIMIT, roles)
        .subscribe((res: SearchUserEndpoint) => {
          console.log(res);
          this.userResults = res.users.map(u=>new User(u));
          this.resultCount = res.count;
          this.dataLoaded = true;
      });
  }

  getPageCount(): number {
    const pageCount = Math.floor(this.resultCount / this.LIMIT);
    return pageCount > 0 ? pageCount - 1 : 0;
  }

  goNextPage() {
    if (this.currentPage < this.getPageCount() - 1) {
      this.currentPage++;
      this.searchUsers();
    }
  }

  goPrevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.searchUsers();
    }
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
