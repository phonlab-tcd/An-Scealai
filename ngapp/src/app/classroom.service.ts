import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Classroom } from './core/models/classroom';
import { User } from './core/models/user';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import config from 'abairconfig';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  constructor(private http: HttpClient,
              private user: UserService) { }

  baseUrl: string = config.baseurl + "classroom/";

  createClassroom(classroom: Classroom) : Observable<any>  {
    return this.http.post(this.baseUrl + "create", classroom);
  }

  getClassroomsForTeacher(teacherId: string) : Observable<any> {
    return this.http.get(this.baseUrl + "forTeacher/" + teacherId);
  }
  
  deleteClassroomsForTeachers(teacherId: string) : Observable<any> {
    return this.http.get(this.baseUrl + "deleteAllClassrooms/" + teacherId);
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

  deleteClassroom(classroomId: string) : Observable<any> {
    return this.http.get(this.baseUrl + "delete/" + classroomId);
  }

  getAllCodes() : Observable<any> {
    return this.http.get(this.baseUrl + "getAllCodes");
  }

  getClassroomFromCode(code: string) : Observable<any> {
    return this.http.get(this.baseUrl + "getClassroomForCode/" + code);
  }

  getAllClassrooms() : Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getClassroomOfStudent(studentId: string) : Observable<any>  {
    // TODO res is null
    return this.http.get(this.baseUrl + 'getClassroomForStudent/' + studentId);
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
 
 setClassroomCheckers(classroomId: string, checkers: string[]):Observable<any> {
   return this.http.post(this.baseUrl + 'setClassroomCheckers/' + classroomId, {"checkers":checkers});
 }
 
 getClassroomCheckers(classroomId: string):Observable<any> {
   return this.http.get(this.baseUrl + 'getClassroomCheckers/' + classroomId);
 }

 getTotalClassrooms() : Observable<any> {
  return this.http.get(this.baseUrl + "getTotalClassrooms/allDB");
}

}
