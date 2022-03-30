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
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MessageList } from './component/message-list/message-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ImageComponent,
    DescribeComponent,
    RecordMessageComponent,
    ListenComponent,
    RecordingDashboardComponent,
    ChooseComponent,
    DecideComponent,
    MessageList,
  ],
  imports: [
    CommonModule,
    NgWaveformModule,
    BrowserAnimationsModule,
    MatTabsModule,
    NgxImageZoomModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
  ],
})
export class DescriptionGameModule { }
