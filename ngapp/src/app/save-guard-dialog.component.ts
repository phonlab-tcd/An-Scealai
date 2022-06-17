import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService } from './translation.service';
import { SaveGuarded } from './abstract-save-guarded-component';

@Component({
  selector: 'save-guard-dialog',
  template: `
    <ng-container *ngIf="!host.saving; else spinner">
      <h1 class="modalText">{{ts.l.save_changes_made_to_this_recording}}</h1>
      <button mat-button [mat-dialog-close] color=warn>
        {{ts.l.cancel}}
      </button>
      <button mat-button color=primary (click)=save()>
        {{ts.l.save}} <i class="fas fa-save"></i>
      </button>
    </ng-container>
    <ng-template #spinner>
      <grid-spinner></grid-spinner>
    </ng-template>
    `,
})
export class SaveGuardDialog {
  constructor(
    public dialogRef: MatDialogRef<SaveGuardDialog>,
    public ts: TranslationService,
    @Inject(MAT_DIALOG_DATA) public host: SaveGuarded,
  ){}
  saving = false;

  async save() {
    this.host.saving = true;
    await this.host.save();
    this.host.canDeactivate.next(true);
    this.dialogRef.close();
  }
}
