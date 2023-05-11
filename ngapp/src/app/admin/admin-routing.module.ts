import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TeachersComponent } from './teachers/teachers.component'
import { FindUserComponent } from './find-user/find-user.component';
import { DatabaseStatsComponent } from './database-stats/database-stats.component';
import { ProfileStatsComponent } from './profile-stats/profile-stats.component';
import { FeatureStatsComponent  } from './feature-stats/feature-stats.component';
import { AddContentComponent } from './add-content/add-content.component';
import { UserComponent } from './user/user.component';
import { AdminClassroomComponent } from './admin-classroom/admin-classroom.component';
import { StoryComponent } from './story/story.component';
import { StoryHistoryComponent } from './story-history/story-history.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: AdminDashboardComponent },
  { path: 'teachers', pathMatch: 'full', component: TeachersComponent },
  { path: 'find-user', pathMatch: 'full', component: FindUserComponent },
  { path: 'database-stats', pathMatch: 'full', component: DatabaseStatsComponent },
  { path: 'profile-stats', pathMatch: 'full', component: ProfileStatsComponent },
  { path: 'feature-stats', pathMatch: 'full', component: FeatureStatsComponent },
  { path: 'add-content', pathMatch: 'full', component: AddContentComponent },
  { path: 'user/:id', pathMatch: 'full', component: UserComponent },
  { path: 'classroom/:id', pathMatch: 'full', component: AdminClassroomComponent },
  { path: 'story/:id', pathMatch: 'full', component: StoryComponent },
  { path: 'story-history/:id', pathMatch: 'full', component: StoryHistoryComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }