import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SynthesisPlayerComponent } from './synthesis-player/synthesis-player.component';
import { RecordingComponent } from './recording/recording.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoryDrawerComponent } from './story-drawer/story-drawer.component';
import { DictionaryDrawerComponent } from './dictionary-drawer/dictionary-drawer.component';
import { GrammarErrorDrawerComponent } from './grammar-error-drawer/grammar-error-drawer.component';
import { FeedbackDrawerComponent } from './feedback-drawer/feedback-drawer.component';
import { SynthesisDrawerComponent } from './synthesis-drawer/synthesis-drawer.component';
import { HomePageComponent } from './home-page/home-page.component';

import { StudentRoutingModule } from './student-routing.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { SynthItemModule } from '../synth-item/synth-item.module';
import { SynthVoiceSelectModule } from 'app/synth-voice-select/synth-voice-select.module';

import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { FeedbackModule } from '../feedback/feedback.module';

import { FilterPipe } from 'app/core/pipes/filter.pipe';
import { SafeHtmlPipe } from 'app/core/pipes/safe-html.pipe';

@NgModule({
  declarations: [
    SynthesisPlayerComponent,
    RecordingComponent,
    FilterPipe,
    SafeHtmlPipe,
    DashboardComponent,
    StoryDrawerComponent,
    DictionaryDrawerComponent,
    GrammarErrorDrawerComponent,
    FeedbackDrawerComponent,
    SynthesisDrawerComponent,
    HomePageComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MatSelectModule,
    FormsModule,
    SpinnerModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatSlideToggleModule,
    SynthItemModule,
    SynthVoiceSelectModule,
    FeedbackModule,
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
