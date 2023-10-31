import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { PromptData } from 'app/core/models/prompt';
import { map, catchError } from 'rxjs/operators';
import config from "../../../abairconfig";

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  baseUrl: string = config.baseurl + "prompt";

  constructor(private http: HttpClient) { }

  getPromptDatas(type: string): Observable<PromptData[]> {
    return this.http
      .get(`${this.baseUrl}/getPrompts/${type}`)
      .pipe<PromptData[]>(map((data: any) => data));
  }

  updatePromptData(PromptData: PromptData, type: string): Observable<PromptData> {
    return this.http.patch<PromptData>(`${this.baseUrl}/updatePrompt/${type}`, PromptData);
  }

  addPromptData(PromptData: PromptData, type: string): Observable<PromptData> {
    return this.http.post<PromptData>(`${this.baseUrl}/addPrompt/${type}`, PromptData);
  }

  deletePromptData(id: string, type: string): Observable<PromptData> {
    return this.http.delete<PromptData>(`${this.baseUrl}/deletePrompt/${type}/${id}`);
  }

  deletePromptDatas(PromptDatas: PromptData[], type: string): Observable<PromptData[]> {
    const deleteRequests = PromptDatas.map((PromptData) =>
    this.http.delete<PromptData>(`${this.baseUrl}/deletePrompt/${type}/${PromptData._id}`).pipe(
      catchError((error) => {
        console.error('Delete request error: ', error);
        return throwError(() => new Error(`Error deleting prompt: ${PromptData} `));
      })
    )
  );

  return forkJoin(deleteRequests);
  }
}