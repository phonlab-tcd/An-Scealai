import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './component/image/image.component';
import { DescribeComponent } from './component/describe/describe.component';
import { RecordMessageComponent } from './component/record-message/record-message.component';
import { ListenComponent } from './component/listen/listen.component';
import { RecordingDashboardComponent } from './component/recording-dashboard/recording-dashboard.component';
import { NgWaveformModule } from './ng-waveform/ng-waveform.module';

@NgModule({
  declarations: [
    ImageComponent,
    DescribeComponent,
    RecordMessageComponent,
    ListenComponent,
    RecordingDashboardComponent
  ],
  imports: [
    CommonModule,
    NgWaveformModule,
  ],
})
export class DescriptionGameModule { }
