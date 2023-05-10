import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  constructor(public ts : TranslationService, public auth: AuthenticationService) { }

  ngOnInit() {
  }

}
