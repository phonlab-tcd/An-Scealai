import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '../../dialog'
import { TranslationService } from '../../translation.service';
import { AuthenticationService } from '../../authentication.service';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) 
              public data: Dialog, 
              public ts: TranslationService,
              public auth: AuthenticationService) { }
  
  textInput:string = "";
  textInput2: string = "";

  ngOnInit(): void {
  }

}
