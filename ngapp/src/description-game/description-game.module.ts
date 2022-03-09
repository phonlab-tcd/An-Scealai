import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './component/image/image.component';
import { DescribeComponent } from './component/describe/describe.component';
import { RecordMessageComponent } from './component/record-message/record-message.component';
import { ListenComponent } from './component/listen/listen.component';
import { RecordingDashboardComponent } from './component/recording-dashboard/recording-dashboard.component';
import { NgWaveformModule } from './ng-waveform/ng-waveform.module';
import { ChooseComponent } from './component/choose/choose.component';
import { DecideComponent } from './component/decide/decide.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@NgModule({
  declarations: [
    ImageComponent,
    DescribeComponent,
    RecordMessageComponent,
    ListenComponent,
    RecordingDashboardComponent,
    ChooseComponent,
    DecideComponent
  ],
  imports: [
    CommonModule,
    NgWaveformModule,
    BrowserAnimationsModule,
    MatTabsModule,
    NgxImageZoomModule,
  ],
})
export class DescriptionGameModule { }
