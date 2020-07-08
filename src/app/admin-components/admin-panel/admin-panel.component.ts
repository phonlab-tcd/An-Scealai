import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  
  //onDashboard: Boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  /*
  goBack() {
    this.router.navigateByUrl('admin/dashboard/');
  }
  */
}
