import { NgModule       } from '@angular/core';
import { SafeHtmlPipe   } from 'safe-html-pipe/pipe';

@NgModule({
  declarations: [
    SafeHtmlPipe,
  ],
  exports: [
    SafeHtmlPipe,
  ],
})
export class SafeHtmlPipeModule { }
