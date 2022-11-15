import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from '../../translation.service';
import { RecordingService } from '../../services/recording.service';
import { SafeUrl } from '@angular/platform-browser';

export interface DialogData {
  type: string;
  id: string;
  confirmButton: string;
}

@Component({
  selector: 'app-recording-dialog',
  templateUrl: './recording-dialog.component.html',
  styleUrls: ['./recording-dialog.component.scss']
})
export class RecordingDialogComponent{

  constructor(@Inject(MAT_DIALOG_DATA) 
              public data: DialogData,
              private dialogRef: MatDialogRef<RecordingDialogComponent>,
              public ts: TranslationService,
              private recordingService: RecordingService) { }
  
  newRecording : boolean = false;
  isRecording: boolean = false;
  showAudio: boolean = false;
  errorText: string = "";  
  audioSource : SafeUrl;
  
  /*
  * Start and stop recording
  */
  record() {
    if(this.isRecording) {
      this.newRecording = this.recordingService.stopRecording();
    }
    else {
      this.showAudio = false;
      this.newRecording = false;
      this.recordingService.recordAudio();
    }
    this.isRecording = !this.isRecording;
  }


/*
* Playback the recorded audio
*/
  getAudio() {
    this.showAudio = true;
    this.audioSource = this.recordingService.playbackAudio();
  }

/*
* Add the audio fedback to the database
*/
  saveAudio() {
    this.getAudio();
    
    if (this.data.type == "feedbackAudio") {
      this.errorText = this.recordingService.saveAudio(this.data.id);
      if(!this.errorText) {
        this.dialogRef.close(true);
      }
    }
    else if (this.data.type == "messageAudio") {
      this.dialogRef.close(this.audioSource);
    }
    else {
      this.dialogRef.close(false);
    }
  }

}
