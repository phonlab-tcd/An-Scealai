import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module'

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SpinnerModule } from '../spinner/spinner.module';

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
import { PosDataTableComponent } from './add-content/pos-data-table/pos-data-table.component';
import { PromptDataTableComponent } from './add-content/prompt-data-table/prompt-data-table.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    TeachersComponent,
    FindUserComponent,
    DatabaseStatsComponent,
    ProfileStatsComponent,
    FeatureStatsComponent,
    AddContentComponent,
    UserComponent,
    AdminClassroomComponent,
    StoryComponent,
    StoryHistoryComponent,
    PosDataTableComponent,
    PromptDataTableComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    SpinnerModule
  ],
  providers: [
    MatPaginator,
    MatSort,
    MatDatepickerModule,
],
})
export class AdminModule { }

