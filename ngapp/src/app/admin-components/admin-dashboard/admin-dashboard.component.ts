import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
