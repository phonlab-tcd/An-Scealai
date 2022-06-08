import { Injectable           } from '@angular/core';
import { HttpClient           } from '@angular/common/http';
import { Observable           } from 'rxjs';
import { Role                 } from 'role';
import { SearchUserEndpoint   } from '../../../api/src/endpoint/user/searchUser';
import { SearchUserQueryBody  } from '../../../api/src/endpoint/user/searchUser';
import config from 'abairconfig';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string = config.baseurl + 'user/';

  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'viewUser', {headers: {_id : id}});
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(this.baseUrl + 'getUserByUsername/' + username);
  }

  searchUser(
    searchString: string,
    pageNumber: number,
    limit: number,
    roles: Role[]): Observable<SearchUserEndpoint> {
    const currentPage = pageNumber;
    const body: SearchUserQueryBody = {searchString,limit,currentPage,roles};
    const url = this.baseUrl + 'searchUser'
    return this.http.post<SearchUserEndpoint>(url,body);
  }

  getUserCount(): Observable<any> {
    return this.http.get(this.baseUrl + 'count/');
  }

  deleteUser(username: string): Observable<any> {
    return this.http.get(this.baseUrl + 'deleteUser/' + username);
  }

  updateUsername(id: string, username: string): Observable<any> {
    return this.http.post(this.baseUrl + 'updateUsername/' + id, { username });
  }

  updatePassword(id: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + 'updatePassword/' + id, { password });
  }

  sendNewPassword(username: string, email: string): Observable<any> {
    return this.http.post(this.baseUrl + 'sendNewPassword/', {
      username,
      email
    });
  }
}
