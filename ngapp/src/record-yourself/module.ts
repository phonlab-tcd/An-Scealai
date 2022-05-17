import { NgModule                     } from '@angular/core';
import { CommonModule                 } from '@angular/common';

import { MatButtonToggleModule        } from '@angular/material/button-toggle';
import { MatButtonModule              } from '@angular/material/button';
import { MatDialogModule              } from '@angular/material/dialog';
import { MatSidenavModule             } from '@angular/material/sidenav';

import { SpinnerModule                } from 'spinner/spinner.module';
import { SafeHtmlPipeModule           } from 'safe-html-pipe/module';

import { RecordYourselfRoutingModule  } from './routing.module';
import { RecordingComponent           } from './recording/component';
import { RecordingSaveGuardDialog     } from './recording/component';
import { RecordingHistoryComponent    } from './recording-history/component';
import { ViewRecordingComponent       } from './view-recording/component';
import { RecordYourselfNav            } from './navigation.component';


@NgModule({
  declarations: [
    RecordingComponent,
    RecordingHistoryComponent,
    ViewRecordingComponent,
    RecordingSaveGuardDialog,
    RecordYourselfNav,
  ],
  imports: [
    SafeHtmlPipeModule,
    MatButtonToggleModule,
    MatButtonModule,
    CommonModule,
    RecordYourselfRoutingModule,
    SpinnerModule,
    MatDialogModule,
    MatSidenavModule,
  ]
})
export class RecordYourselfModule { }
