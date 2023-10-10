import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoryFeedbackComponent } from './story-feedback/story-feedback.component';
import { FeedbackCommentComponent } from './feedback-comment/feedback-comment.component';
import { QuillModule } from 'ngx-quill';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [
    StoryFeedbackComponent,
    FeedbackCommentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
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
  ],
  exports: [StoryFeedbackComponent, FeedbackCommentComponent],
})
export class FeedbackModule { }
