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
  updateGrammarErrors(id: string, data, updatedTimeStamp: Date): Observable<any> {
    console.log("errors to add: ", data);
    return this.http.post(this.baseUrlStudents + 'updateGrammarErrors/' + id + '/' + updatedTimeStamp, data);
  }

/*
* Delete a stat entry from the database when a student leaves a classroom
*/
  deleteStats(id: string): Observable<any> {
    return this.http.get(this.baseUrlStudents + 'delete/' + id);
  }
  
  deleteStatsForClassroom(id: string): Observable<any>{
    return this.http.get(this.baseUrlStudents + 'deleteForClassroom/' + id);
  }
  

/*
* Return an object containing grammar rule name, description, and classification
*/
  listErrors(): { error: string, description: string, type: string, checked: boolean }[]  {
    return [
      {error: "AIDIOLRA", description: "Adjective in plural needed", type: "GENERAL", checked: false},
      {error: "BADART", description: "Unnecessary use of the definite article", type: "GENERAL", checked: false},
      {error: "BREISCHEIM", description: "Comparative adjective required", type: "GENERAL", checked: false},
      {error: "CASE", description: "Case disagreementrase", type: "GENERAL", checked: false},
      {error: "CUPLA", description: "Unusual combination of words", type: "GENERAL", checked: false},
      {error: "DUBAILTE", description: "Repeated word", type: "GENERAL", checked: false},
      {error: "GENDER", description: "Gender disagreement", type: "GENERAL", checked: false},
      {error: "GENITIVE", description: "The genitive case is required here", type: "GENERAL", checked: false},
      {error: "IOLRA", description: "The plural form is required here", type: "GENERAL", checked: false},
      {error: "NEAMHCHOIT", description: "Valid word but extremely rare in actual usage. Is this the word you want?", type: "GENERAL", checked: false},
      {error: "NEEDART", description: "Definite article required", type: "GENERAL", checked: false},
      {error: "NOGENITIVE", description: "Unnecessary use of the genitive case", type: "GENERAL", checked: false},
      {error: "NOSUBJ", description: "It seems unlikely that you intended to use the subjunctive here", type: "GENERAL", checked: false},
      {error: "NUMBER", description: "Number disagreemen", type: "GENERAL", checked: false},
      {error: "ONEART", description: "No need for the first definite article", type: "GENERAL", checked: false},
      {error: "PRESENT", description: "You should use the present tense here", type: "GENERAL", checked: false},
      {error: "UATHA", description: "The singular form is required here", type: "GENERAL", checked: false},
      
      {error: "ANAITHNID", description: "Unknown word", type: "WORDCHOICE", checked: false},
      {error: "BATOR", description: "You should use another form here instead ", type: "WORDCHOICE", checked: false},
      {error: "CAIGHDEAN", description: "Non-standard form of word", type: "WORDCHOICE", checked: false},
      {error: "CAIGHMOIRF", description: "Derived from a non-standard form of the word", type: "WORDCHOICE", checked: false},
      {error: "DROCHMHOIRF", description: "Derived incorrectly from the root", type: "WORDCHOICE", checked: false},
      {error: "INPHRASE", description: "Usually used in a set phrase", type: "WORDCHOICE", checked: false},
      
      {error: "COMHCHAIGH", description: "Not in database but may be a non-standard compound", type: "UNRECOGNISEDWORD", checked: false},
      {error: "COMHFHOCAL", description: "Not in database but may be a compound", type: "UNRECOGNISEDWORD", checked: false},
      {error: "GRAM", description: "Possibly a foreign word (highly improbable sequence)", type: "UNRECOGNISEDWORD", checked: false},
      {error: "IONADAI", description: "Valid word but another word is more common", type: "UNRECOGNISEDWORD", checked: false},
      {error: "MICHEART", description: "Do you mean this instead?", type: "UNRECOGNISEDWORD", checked: false},
      {error: "MIMHOIRF", description: "Derived form of common misspelling", type: "UNRECOGNISEDWORD", checked: false},
      {error: "MOIRF", description: "Not in database but apparently formed from a certain root", type: "UNRECOGNISEDWORD", checked: false},
      {error: "MOLADH", description: "Unknown word, but could be this word", type: "UNRECOGNISEDWORD", checked: false},
      {error: "NIGA", description: "This word is not needed", type: "UNRECOGNISEDWORD", checked: false},
      
      {error: "NIAITCH", description: "Unnecessary prefix 'h'", type: "PREFIX", checked: false},
      {error: "NIBEE", description: "Unnecessary prefix 'b'", type: "PREFIX", checked: false},
      {error: "NIDEE", description: "Unnecessary prefix 'd'", type: "PREFIX", checked: false},
      {error: "NITEE", description: "Unnecessary prefix 't'", type: "PREFIX", checked: false},
      {error: "PREFIXD", description: "Prefix 'd' missing", type: "PREFIX", checked: false},
      {error: "PREFIXH", description: "Prefix 'h' missing", type: "PREFIX", checked: false},
      {error: "PREFIXT", description: "Prefix 't' missing", type: "PREFIX", checked: false},
        
      {error: "CLAOCHLU", description: "Initial mutation missing", type: "LENITION", checked: false},
      {error: "NIDARASEIMHIU", description: "The second lenition is unnecessary", type: "LENITION", checked: false},
      {error: "NICLAOCHLU", description: "Unnecessary initial mutation", type: "LENITION", checked: false},
      {error: "NISEIMHIU", description: "Unnecessary lenition", type: "LENITION", checked: false},
      {error: "SEIMHIU", description: "Lenition missing", type: "LENITION", checked: false},
      {error: "WEAKSEIMHIU", description: "Often this preposition causes lenition, but this case is unclear", type: "LENITION", checked: false},
      
      {error: "ABSOLUTE", description: "Unnecessary use of the dependent form of the verb", type: "ECLIPSIS", checked: false},
      {error: "NIURU", description: "Unnecessary eclipsis", type: "ECLIPSIS", checked: false},
      {error: "NODATIVE", description: "The dative is used only in special phrases", type: "ECLIPSIS", checked: false},
      {error: "RELATIVE", description: "The dependent form of the verb is required here", type: "ECLIPSIS", checked: false},
      {error: "SYNTHETIC", description: "The synthetic (combined) form, with a given ending, is often used here", type: "ECLIPSIS", checked: false},
      {error: "URU", description: "Eclipsis missing", type: "ECLIPSIS", checked: false},
      
      {error: "LLAES", description: "Aspirate mutation missin", type: "SPECIFICLANGUAGE", checked: false},
      {error: "NESSATREYLYANS", description: "Second (soft) mutation missing", type: "SPECIFICLANGUAGE", checked: false},
      {error: "TRESSATREYLYANS", description: "Third (breathed) mutation missing", type: "SPECIFICLANGUAGE", checked: false},
      {error: "PESWARATREYLYANS", description: "Fourth (hard) mutation missing", type: "SPECIFICLANGUAGE", checked: false},
      {error: "PYMPESTREYLYANS", description: "Fifth (mixed) mutation missing", type: "SPECIFICLANGUAGE", checked: false},
      {error: "PYMPESTREYLYANSTH", description: "Fifth (mixed) mutation after 'th' missing", type: "SPECIFICLANGUAGE", checked: false},
      {error: "VOWELHARMONY", description: "This word violates the rules of Igbo vowel harmony", type: "SPECIFICLANGUAGE", checked: false},  
    ];
  }
}
