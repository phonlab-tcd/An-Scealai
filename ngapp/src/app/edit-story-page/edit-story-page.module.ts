import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditStoryPageRoutingModule } from './edit-story-page-routing.module';
import { EditStoryComponent } from "./edit-story/component";
import { SynthModule } from "../synthesis/synth.module";
import { QuillModule } from "ngx-quill";

@NgModule({
  declarations: [
    EditStoryComponent,
  ],
  imports: [
    CommonModule,
    EditStoryPageRoutingModule,
    SynthModule,
    QuillModule.forRoot({
      customOptions: [{
        import: 'formats/font',
        whitelist: [
          'sans-serif',         // @quill-font
          'serif',              // @quill-font
          'monospace',          // @quill-font
          'arial',              // @quill-font
          'times-new-roman',    // @quill-font
        ]
      }],
    }),
  ]
})
export class EditStoryPageModule { }
