import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { PromptDataRow } from '../../admin/add-content/prompt-data-table/prompt-data-table.component';
import { map, catchError } from 'rxjs/operators';
import config from "../../../abairconfig";

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  baseUrl: string = config.baseurl + "propmt";

  constructor(private http: HttpClient) { }

  getPromptDataRows(): Observable<PromptDataRow[]> {
    return this.http
      .get(this.baseUrl)
      .pipe<PromptDataRow[]>(map((data: any) => data.PromptDataRows));
  }

  updatePromptDataRow(PromptDataRow: PromptDataRow): Observable<PromptDataRow> {
    return this.http.patch<PromptDataRow>(`${this.baseUrl}/updatePrompt/${PromptDataRow._id}`, PromptDataRow);
  }

  addPromptDataRow(PromptDataRow: PromptDataRow): Observable<PromptDataRow> {
    return this.http.post<PromptDataRow>(`${this.baseUrl}/addPrompt`, PromptDataRow);
  }

  deletePromptDataRow(id: number): Observable<PromptDataRow> {
    return this.http.delete<PromptDataRow>(`${this.baseUrl}/deletePrompt/${id}`);
  }

  deletePromptDataRows(PromptDataRows: PromptDataRow[]): Observable<PromptDataRow[]> {
    // return forkJoin(
    //   PromptDataRows.map((PromptDataRow) =>
    //     this.http.delete<PromptDataRow>(`${this.baseUrl}/deletePrompt/${PromptDataRow.id}`)
    //   )
    // );
    const deleteRequests = PromptDataRows.map((PromptDataRow) =>
    this.http.delete<PromptDataRow>(`${this.baseUrl}/deletePrompt/${PromptDataRow._id}`).pipe(
      catchError((error) => {
        console.error('Delete request error: ', error);
        return throwError(() => new Error(`Error deleting prompt: ${PromptDataRow} `));
      })
    )
  );

  return forkJoin(deleteRequests);
  }
}