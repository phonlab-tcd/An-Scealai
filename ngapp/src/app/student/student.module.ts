import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { BookContentsComponent } from './book-contents/book-contents.component';
import { SynthesisPlayerComponent } from './synthesis-player/synthesis-player.component';
import { DashboardOldComponent } from './dashboard-old/dashboard-old.component';
import { SynthVoiceSelectComponent } from 'app/synth-voice-select/synth-voice-select.component';
import { RecordingComponent } from './recording/recording.component';
import { SynthesisComponent } from './synthesis/synthesis.component';

import { SpinnerModule } from '../spinner/spinner.module';

import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { FilterPipe } from 'app/core/pipes/filter.pipe';
import { SafeHtmlPipe } from 'app/core/pipes/safe-html.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    BookContentsComponent,
    DashboardOldComponent,
    SynthesisPlayerComponent,
    SynthVoiceSelectComponent,
    SynthesisComponent,
    RecordingComponent,
    FilterPipe,
    SafeHtmlPipe,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MatSelectModule,
    FormsModule,
    SpinnerModule,
    MatSidenavModule,
    MatIconModule,
    QuillModule.forRoot({
      customOptions: [{
              import: 'formats/font',
              whitelist: [
                  'sans-serif',
                  'serif',
                  'monospace',
                  'arial',
                  'times-new-roman', // @quill-font
              ]
          }],
  }),
  ]
})
export class StudentModule { }
