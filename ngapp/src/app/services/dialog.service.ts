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
  
  openDialog(data:Dialog, width?:string): Observable<any> {
     
    return this.dialog.open(ConfirmDialogComponent, {
      data,
      width: width? width : '50%',
      disableClose: true
    }).afterClosed();
  }
}
