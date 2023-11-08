import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module'

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SpinnerModule } from '../spinner/spinner.module';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TeachersComponent } from './teachers/teachers.component'
import { FindUserComponent } from './find-user/find-user.component';
import { DatabaseStatsComponent } from './database-stats/database-stats.component';
import { ProfileStatsComponent } from './profile-stats/profile-stats.component';
import { FeatureStatsComponent  } from './feature-stats/feature-stats.component';
import { AddPromptDataComponent } from './add-prompt-data/add-prompt-data.component';
import { UserComponent } from './user/user.component';
import { AdminClassroomComponent } from './admin-classroom/admin-classroom.component';
import { StoryComponent } from './story/story.component';
import { StoryHistoryComponent } from './story-history/story-history.component';
import { PromptDataTableComponent } from './add-prompt-data/prompt-data-table/prompt-data-table.component';
import { HighlightDirective } from 'app/core/directives/highlight.directive';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableExporterModule } from 'mat-table-exporter';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    TeachersComponent,
    FindUserComponent,
    DatabaseStatsComponent,
    ProfileStatsComponent,
    FeatureStatsComponent,
    AddPromptDataComponent,
    UserComponent,
    AdminClassroomComponent,
    StoryComponent,
    StoryHistoryComponent,
    PromptDataTableComponent,
    HighlightDirective
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
    SpinnerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule,
    HttpClientModule,
    MatTableExporterModule,
  ],
  providers: [
    MatPaginator,
    MatSort,
    MatDatepickerModule,
],
})
export class AdminModule { }

