import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/authentication.service';
import { HttpClient } from '@angular/common/http';
import config from '../../../abairconfig';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.scss']
})
export class AddContentComponent implements OnInit {

  selectedContent: string = '';
  selectedPOS: string = '';
  posWord: string = '';
  posTranslation: string = '';
  errorMessage: string = '';
  displayedColumns: string[] = ['pos', 'word', 'translation', 'date'];
  dataSource;
  showData: boolean = false;

  constructor(private auth: AuthenticationService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getPartOfSpeechData()
  }

  addContent() {
    if (this.selectedContent == 'partOfSpeech') {
      console.log(this.selectedPOS);
      console.log(this.posWord);
      console.log(this.posTranslation);
      if (!this.selectedPOS || ! this.posWord || !this.posTranslation) {
        this.errorMessage = "Please fill in all information";
        return;
      }
      const headers = { 'Authorization': 'Bearer ' + this.auth.getToken() }
      const body = {
        type: this.selectedContent,
        partOfSpeechData: {
          partOfSpeech: this.selectedPOS,
          word: this.posWord,
          translation: this.posTranslation
        }
      };
      console.log(body);
      this.http.post<any>(config.baseurl + 'prompt/addContent/', body, {headers}).subscribe({
        next: () => {
          this.selectedPOS = '';
          this.posWord = '';
          this.posTranslation = '';
          this.errorMessage = '';
          this.getPartOfSpeechData();
        },
        error: (err) => {this.errorMessage = "Entry already exists"}
      });
    }
  }

  getPartOfSpeechData() {
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken() }
    this.http.get<any>(config.baseurl + 'prompt/getPartOfSpeechData/', {headers}).subscribe({
      next: (data) => {
        console.log(data);
        this.dataSource = data;
        console.log(this.dataSource)
      },
      error: (err) => {console.log(err)}
    });

  }

}
