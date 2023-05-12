import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomSelectorComponent } from './classroom-selector/classroom-selector.component';
import { StatsDashboardComponent } from './stats-dashboard/stats-dashboard.component';
import { WordCountsComponent } from './story-stats/word-counts/word-counts.component';
import { DictionaryLookupsComponent } from './story-stats/dictionary-lookups/dictionary-lookups.component';
import { StatsDashboardRoutingModule } from './stats-dashboard-routing.module';
import { NgramDistributionComponent } from './story-stats/ngram-distribution/ngram-distribution.component';
import { GrammarErrorTimeComponent } from './story-stats/grammar-error-time/grammar-error-time.component';
import { GrammarPieChartComponent } from './story-stats/grammar-pie-chart/grammar-pie-chart.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';



@NgModule({
  declarations: [
    StatsDashboardComponent,
    ClassroomSelectorComponent,
    WordCountsComponent,
    DictionaryLookupsComponent,
    NgramDistributionComponent,
    GrammarErrorTimeComponent,
    GrammarPieChartComponent
  ],
  imports: [
    CommonModule,
    StatsDashboardRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  exports: [
    StatsDashboardComponent
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
],
})
export class StatsDashboardModule { }
