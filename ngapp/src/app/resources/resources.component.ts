import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/services/translation';
import { AuthenticationService } from 'app/services/authentication';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  constructor(public ts : TranslationService, public auth: AuthenticationService) { }

  ngOnInit() {
  }

}
