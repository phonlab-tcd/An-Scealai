import { Component } from '@angular/core';
import { ConsentService } from '../consent.service';
import { HttpClient } from '@angular/common/http';
import config from '../../../abairconfig';
import { TranslationService } from '../../translation.service';
import { EngagementService } from "../../engagement.service";

@Component({
  selector: 'confirm-age',
  templateUrl: './confirm-age.component.html',
  styleUrls: ['./../style.scss']
})
export class ConfirmAgeComponent {
  constructor(
    private consent: ConsentService,
    private http: HttpClient) {}


  choose(event){
    this.consent.age.next(event.value);
    this.http.post(config.baseurl + 'privacy-preferences/age',{range:event.value}).subscribe();
  }
}