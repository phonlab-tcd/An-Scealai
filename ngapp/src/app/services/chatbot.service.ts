import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'app/authentication.service';
import config from 'abairconfig';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  baseUrl: string = config.baseurl + "chatbot/";

  constructor(private http: HttpClient, public auth: AuthenticationService) { }

  getUserQuizzes(user){
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
    const body = {
      name: user.username,
      id: user._id
    };
    return this.http.post<any>(this.baseUrl + 'getUserQuizzes', body, {headers});
  }

  getClassroomQuizzes(classroomId) {
    return this.http.get<any>(this.baseUrl + "getTeacherScripts/" + classroomId)
  }

    /**
   * Get any quizzes from the DB that the teacher made
   */
  async getTeacherScripts(classroom){
    return this.http.get<any>(this.baseUrl + 'getTeacherScripts/' + classroom.teacherId + '/' + classroom.code)
  }

  chatAIML(input, pandoraId) {
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
    const body = {
      message: input,
      botId: pandoraId,
    };
    return this.http.post<any>(this.baseUrl + 'aiml-message', body, {headers});
  }

  createQuiz(body) {
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
    return this.http.post<any>(this.baseUrl + 'createQuiz', body, {headers});
  }

  deleteScript(toDelete, userId) {
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
    const body = {
      name: toDelete, 
      user: userId
    }
    return this.http.post<any>(this.baseUrl + 'deleteScript', body, {headers});
  }

  sendVerification(currentFileName, userId) {
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
    const body = {
      name: currentFileName, 
      user: userId
    }
    return this.http.post<any>(this.baseUrl + 'sendScriptVerification', body, {headers});
  }

  downloadNewScript(userId, currentFileName, userRole) {
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
    const body = {
      user: userId, 
      name: currentFileName, 
      role: userRole
    }
    return this.http.post<any>(this.baseUrl + 'getScriptForDownload', body, {headers});
  }

}
