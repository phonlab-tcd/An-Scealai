import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService } from '../../translation.service';
import { AuthenticationService } from '../../authentication.service';

export interface DialogData {
  title: string;
  message: string;
  data: any;
  type: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.scss']
})
export class BasicDialogComponent {
  public textInputs: string[] = [];
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  
  constructor(@Inject(MAT_DIALOG_DATA) 
              public data: DialogData,
              public ts: TranslationService,
              public auth: AuthenticationService) {}
}

