import { Component, OnInit, Input } from '@angular/core';
import { TranslationService } from '../../../translation.service';

@Component({
  selector: 'app-dictionary-lookups',
  templateUrl: './dictionary-lookups.component.html',
  styleUrls: ['./dictionary-lookups.component.scss']
})
export class DictionaryLookupsComponent implements OnInit {
  
  @Input() dictionaryWords: any[] = [];

  constructor(ts: TranslationService) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: any) {
    console.log(this.dictionaryWords)
  }
  

}
