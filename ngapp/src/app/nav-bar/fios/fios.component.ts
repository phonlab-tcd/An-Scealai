import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-fios',
  templateUrl: './fios.component.html',
  styleUrls: ['./fios.component.scss']
})
export class FiosComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit(): void {
  }

}
