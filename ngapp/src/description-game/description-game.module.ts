import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './component/image/image.component';
import { DescribeComponent } from './component/describe/describe.component';
import { RecordMessageComponent } from './component/record-message/record-message.component';
import { ListenComponent } from './component/listen/listen.component';

@NgModule({
  declarations: [
    ImageComponent,
    DescribeComponent,
    RecordMessageComponent,
    ListenComponent
  ],
  imports: [
    CommonModule,
  ],
})
export class DescriptionGameModule { }
