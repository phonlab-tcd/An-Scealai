import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentStats } from './studentStats';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  baseUrl:string = config.baseurl + 'stats/';
  baseUrlStudents:string = config.baseurl + 'studentStats/';

  constructor(private http: HttpClient) { }
  
// *********************** Admin stats ************************************
  getSynthesisData() : Observable<any> {
    return this.http.get(this.baseUrl + 'synthesisFixes');
  }

// *********************** Student stats ************************************

/*
* Add a new student stat object to the db (called in profile component)
*/
  addNewStatEntry(statObj: StudentStats): Observable<any> {
    return this.http.post(this.baseUrlStudents + 'create', statObj);
  }
  
/*
* Return array of stats objects of the students in a given classroom
*/
  getStatsForClassroom(id: string): Observable<any> {
    return this.http.get(this.baseUrlStudents + 'getStatsByClassroom/' + id);
  }
  
/*
* Update the grammar error map for the stat object of a given student
*/
  updateGrammarErrors(id: string, data): Observable<any> {
    return this.http.post(this.baseUrlStudents + 'updateGrammarErrors/' + id, data);
  }

/*
* Delete a stat entry from the database when a student leaves a classroom
*/
  deleteStats(id: string): Observable<any> {
    console.log("Calling stats delete service");
    console.log("ID to delete: " + id);
    return this.http.get(this.baseUrlStudents + 'delete/' + id);
  }
}
