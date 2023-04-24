import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'app/authentication.service';
import config from 'abairconfig';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  baseUrl: string = config.baseurl + "chatbot/";
  headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }

  constructor(private http: HttpClient, public auth: AuthenticationService) { }

  getUserQuizzes(user){
    const headers = this.headers;
    const body = {
      name: user.username,
      id: user._id
    };
    return this.http.post<any>(this.baseUrl + 'getUserQuizzes', body, {headers});
  }

  getClassroomQuizzes(classroomId) {
    return this.http.get<any>(this.baseUrl + "getClassroomQuizzes/" + classroomId)
  }

  getCommunityQuizzes() {
    return this.http.get<any>(this.baseUrl + "getCommunityQuizzes");
  }

  setAsCommunityQuiz(quizId) {
    const headers = this.headers;
    const body = {
      id: quizId
    };
    return this.http.post<any>(this.baseUrl + 'setAsCommunityQuiz', body, {headers});
  }

  chatAIML(input: string, pandoraId: string) {
    const headers = this.headers;
    const body = {
      message: input,
      botId: pandoraId,
    };
    return this.http.post<any>(this.baseUrl + 'getAIMLResponse', body, {headers});
  }

  createQuiz(body) {
    const headers = this.headers;
    return this.http.post<any>(this.baseUrl + 'createQuiz', body, {headers});
  }

  deleteQuiz(id) {
    return this.http.get<any>(this.baseUrl + 'deleteQuiz/' + id);
  }

  sendVerification(currentFileName, userId) {
    const headers = this.headers;
    const body = {
      name: currentFileName, 
      user: userId
    }
    return this.http.post<any>(this.baseUrl + 'sendScriptVerification', body, {headers});
  }

  downloadNewScript(userId, currentFileName, userRole) {
    const headers = this.headers;
    const body = {
      user: userId, 
      name: currentFileName, 
      role: userRole
    }
    return this.http.post<any>(this.baseUrl + 'getScriptForDownload', body, {headers});
  }

}
