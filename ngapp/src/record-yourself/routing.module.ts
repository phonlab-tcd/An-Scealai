import { NgModule                     } from '@angular/core';
import { RouterModule, Routes         } from '@angular/router';
import { RecordingComponent           } from './recording/component';
import { RecordYourselfNav            } from './navigation.component';
import { RecordingHistoryComponent    } from './recording-history/component';
import { ViewRecordingComponent       } from './view-recording/component';
import { CanDeactivateRecordingGuard  } from 'app/can-deactivate.guard';

const routes: Routes = [
  { path: '',
    component: RecordYourselfNav,
    children: [
      { path: 'recording/:id',
        component: RecordingComponent,
        canDeactivate: [CanDeactivateRecordingGuard],
      },
      { path: 'archive/:id',
        component: RecordingHistoryComponent
      },
      { path: 'view/:id',
        component: ViewRecordingComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordYourselfRoutingModule { }
