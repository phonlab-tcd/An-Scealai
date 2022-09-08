import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA} from "@angular/material/dialog";
import { ConsentGroup } from "./consent.service";

@Component({
    template: `
        <mat-dialog-content>
            <consent-group for={{data}}></consent-group>
        </mat-dialog-content>
        `
})
export class ConsentGroupInDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: ConsentGroup){}

}