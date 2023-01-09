import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }
  
}
