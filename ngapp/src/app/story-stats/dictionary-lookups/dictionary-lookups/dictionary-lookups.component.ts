import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-dictionary-lookups',
  templateUrl: './dictionary-lookups.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dictionary-lookups.component.scss']
})
export class DictionaryLookupsComponent implements OnInit {
  
  @Input() dictionaryLookups:Object;

  constructor(private ts: TranslationService, public auth: AuthenticationService) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: any) {
  }
  
}
