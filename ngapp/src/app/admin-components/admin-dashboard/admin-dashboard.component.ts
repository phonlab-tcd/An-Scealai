import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
