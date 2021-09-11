import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Classroom } from './classroom';
import { Observable } from 'rxjs';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  constructor(private http: HttpClient) { }

  baseUrl: string = config.baseurl + 'classroom/';

  createClassroom(classroom: Classroom): Observable<any>  {
    return this.http.post(this.baseUrl + 'create', classroom);
  }

  getClassroomsForTeacher(teacherId: string): Observable<any> {
    return this.http.get(this.baseUrl + 'forTeacher/' + teacherId);
  }

  deleteClassroomsForTeachers(teacherId: string): Observable<any> {
    return this.http.get(this.baseUrl + 'deleteAllClassrooms/' + teacherId);
  }

  getClassroom(id: string): Observable<any> {
    return this.http.get(this.baseUrl + id);
  }

  addStudentToClassroom(classroomId: string, studentId: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'addStudent/' + classroomId,
      {studentId});
  }

  removeStudentFromClassroom(classroomId: string, studentId: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'removeStudent/' + classroomId,
      {studentId});
  }

  editTitle(classroomId: string, newTitle: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'updateTitle/' + classroomId,
      {title: newTitle});
  }

  delete(classroomId: string): Observable<any> {
    return this.http.get(this.baseUrl + 'delete/' + classroomId);
  }

  getAllCodes(): Observable<any> {
    return this.http.get(this.baseUrl + 'getAllCodes');
  }

  getClassroomFromCode(code: string): Observable<any> {
    return this.http.get(this.baseUrl + 'getClassroomForCode/' + code);
  }

  getAllClassrooms(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getClassroomOfStudent(studentId: string): Observable<any>  {
    // TODO res is null
    return this.http.get(this.baseUrl + 'getClassroomForStudent/' + studentId);
  }

  generateCode(): string{
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 setGrammarRules(classroomId: string, rules: string[]): Observable<any> {
   console.log('rules to add:');
   console.log( rules);
   return this.http.post(
     this.baseUrl + 'setGrammarRules/' + classroomId,
     {grammarRules: rules});
 }

 getGrammarRules(classroomId: string): Observable<any> {
   return this.http.get(this.baseUrl + 'getGrammarRules/' + classroomId);
 }
}
