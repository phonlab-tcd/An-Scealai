import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { Dialog } from '../dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }
  
  confirmDialog(data: Dialog): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '50%',
      disableClose: true
    }).afterClosed();
  }
}
