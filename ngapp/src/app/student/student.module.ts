import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { BookContentsComponent } from './book-contents/book-contents.component';
import { SynthesisPlayerComponent } from './synthesis-player/synthesis-player.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SynthVoiceSelectComponent } from 'app/synth-voice-select/synth-voice-select.component';

import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { FilterPipe } from 'app/pipes/filter.pipe';


@NgModule({
  declarations: [
    BookContentsComponent,
    DashboardComponent,
    SynthesisPlayerComponent,
    SynthVoiceSelectComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MatSelectModule,
    FormsModule,
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
