import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../../../translation.service';
import { AuthenticationService } from '../../../authentication.service';

@Component({
  selector: 'app-dictionary-lookups',
  templateUrl: './dictionary-lookups.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dictionary-lookups.component.scss']
})
export class DictionaryLookupsComponent implements OnInit {
  
  @Input() dictionaryWords: any[] = [];
  @Input() dictionaryLookups;

  constructor(private ts: TranslationService, public auth: AuthenticationService) { }

  ngOnInit(): void {
  }
  
}
