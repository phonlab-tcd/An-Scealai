import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SaveGuardDialog } from './save-guard-dialog.component';

export abstract class SaveGuarded {
  showDialog() {
    const dialogRef = this.dialog().open(SaveGuardDialog,{data: this});
  }
  abstract save(): Promise<void>;
  abstract saved(): boolean;
  abstract dialog(): MatDialog;
  saving: boolean;
  canDeactivate: Subject<boolean> = new Subject<boolean>();
}

