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

  constructor(private auth: AuthenticationService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  addContent() {
    if (this.selectedContent == 'partOfSpeech') {
      console.log(this.selectedPOS);
      console.log(this.posWord);
      console.log(this.posTranslation);
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
        next: () => {},
        error: (err) => {console.log("Data already added")}
      });
    }
  }

}
