import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'app/authentication.service';
import { ClassroomService } from 'app/classroom.service';
import config from 'abairconfig';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient, public auth: AuthenticationService, private classroomService: ClassroomService) { }

  getPersonalScripts(user){
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
    const body = {
      name: user.username,
      id: user._id
    };

    return this.http.post<any>(config.baseurl + 'Chatbot/getScripts', body, {headers});
  }

    /**
   * Get any quizzes from the DB that the teacher made
   */
  async getTeacherScripts(classroom){
    // let classroom = await firstValueFrom(this.classroomService.getClassroomOfStudent(user._id));
    // console.log(classroom);
    // if (!classroom) {
    //   return null;
    // }
    return this.http.get<any>(config.baseurl + 'Chatbot/getTeacherScripts/' + classroom.teacherId + '/' + classroom.code)
  }

  saveScript(result) {
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
    const body = {
      result
    };

    return this.http.post<any>(config.baseurl + 'Chatbot/SaveScript', body, {headers});

  }

}
