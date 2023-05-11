import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StatsDashboardComponent } from './stats-dashboard/stats-dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: StatsDashboardComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class StatsDashboardRoutingModule { }