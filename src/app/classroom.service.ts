import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Classroom } from './classroom';
import { User } from './user';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  constructor(private http: HttpClient,
              private user: UserService) { }

  baseUrl: string = "http://localhost:4000/classroom/";

  createClassroom(classroom: Classroom) : Observable<any>  {
    return this.http.post(this.baseUrl + "create", classroom);
  }

  getClassroomsForTeacher(teacherId: string) : Observable<any> {
    return this.http.get(this.baseUrl + "forTeacher/" + teacherId);
  }

  getClassroom(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + id);
  }

  addStudentToClassroom(classroomId: string, studentId: string) : Observable<any> {
    return this.http.post(this.baseUrl + "addStudent/" + classroomId, {"studentId":studentId}); 
  }

  removeStudentFromClassroom(classroomId: string, studentId: string) : Observable<any> {
    return this.http.post(this.baseUrl + "removeStudent/" + classroomId, {"studentId":studentId});
  }

  editTitle(classroomId: string, newTitle: string) : Observable<any> {
    return this.http.post(this.baseUrl + "updateTitle/" + classroomId, {"title":newTitle});
  }

  delete(classroomId: string) : Observable<any> {
    return this.http.get(this.baseUrl + "delete/" + classroomId);
  }

  getAllCodes() : Observable<any> {
    return this.http.get(this.baseUrl + "getAllCodes");
  }

  generateCode() : string{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

}
