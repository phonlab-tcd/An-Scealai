import { NgModule                           } from '@angular/core';
import { CommonModule                       } from '@angular/common';

import { MatButtonToggleModule              } from '@angular/material/button-toggle';
import { MatButtonModule                    } from '@angular/material/button';
import { MatDialogModule                    } from '@angular/material/dialog';

import { SpinnerModule                      } from 'spinner/spinner.module';
import { SafeHtmlPipeModule                 } from 'safe-html-pipe/module';

import { RecordYourselfRoutingModule        } from './routing.module';
import { RecordingComponent                 } from './recording/component';
import { RecordingComponentSaveGuardDialog  } from './recording/component';
import { RecordingHistoryComponent          } from './recording-history/component';
import { ViewRecordingComponent             } from './view-recording/component';


@NgModule({
  declarations: [
    RecordingComponent,
    RecordingHistoryComponent,
    ViewRecordingComponent,
    RecordingComponentSaveGuardDialog,
  ],
  imports: [
    SafeHtmlPipeModule,
    MatButtonToggleModule,
    MatButtonModule,
    CommonModule,
    RecordYourselfRoutingModule,
    SpinnerModule,
    MatDialogModule,
  ]
})
export class RecordYourselfModule { }
