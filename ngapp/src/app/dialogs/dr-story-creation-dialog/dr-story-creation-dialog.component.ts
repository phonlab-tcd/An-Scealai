import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslationService } from 'app/core/services/translation.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { firstValueFrom } from 'rxjs';

export interface DialogData {
  title: string;
  message: string;
  data: any;
  type: string;
  collections: Object;
  userRole: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ClipboardModule, MatDialogModule, PdfViewerModule, MatCheckboxModule],
  selector: 'app-basic-dialog',
  templateUrl: './dr-story-creation-dialog.component.html',
  styleUrls: ['./dr-story-creation-dialog.component.scss']
})
export class DigitalReaderStoryCreationDialogComponent {
  public dialectMapping: Object;
  public collectionOptions: Array<string>;
  public inputs: Object;
  public thumbnail: File | null = null;
  
  //pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  copyIconClicked: boolean = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) 
              public data: DialogData,
              public ts: TranslationService,
              public auth: AuthenticationService
              ) {
                /*this.dialectMapping = {
                  Connacht: 'connemara',
                  Connachta: 'connemara',
                  Munster: 'kerry',
                  Mumha: 'kerry',
                  Ulster: 'donegal',
                  Ulaidh: 'donegal',
                }*/

                this.inputs = {
                  title: '',
                  /*dialects: {
                    connemara: false,
                    kerry: false,
                    donegal: false
                  },*/
                  collections: this.data.collections,
                  thumbnail: '',
                  public: false
                }
              }
  
  processThumbnail(files: FileList) {
    if (files.length>0) {
      const tmp = files[0]
      console.log(tmp)
      if (tmp.type.startsWith("image/")) {

        this.thumbnail = tmp;

        console.log(this.thumbnail);

        const reader = new FileReader();
        reader.onload = (e) => {
          //img.src = e.target.result;
          //console.log(e.target?.result)
          this.inputs['thumbnail'] = e.target?.result
        };
        reader.readAsDataURL(tmp);
      } else {
        alert(this.ts.l.must_be_image)
      }
    } else {
      this.thumbnail = null;
    }
  }
}

