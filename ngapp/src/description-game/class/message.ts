import { ChangeDetectorRef } from '@angular/core';
import { RecordingService } from "src/description-game/service/recording.service";
import { RandomColor } from './randomColor';

export class Message {
  private cd: ChangeDetectorRef;
  private rec: RecordingService;
  private gameId: string;
  private _apiRef: string;
  src: string;
  color: RandomColor;

  apiRef() {
    return this._apiRef;
  }

  constructor( gameId: string, recordingService:  RecordingService, changeDetector: ChangeDetectorRef) {
    this.gameId = gameId;
    this.cd = changeDetector;
    this.rec = recordingService;
    if(!this.gameId) {
      throw new Error('message does not have gameId');
    }
    if(!this.cd) {
      throw new Error('message does not have changeDetector');
    }
    if(!this.rec) {
      throw new Error('message does not have recordingService');
    }
    this.color = new RandomColor();
  }

  initByRef(apiRef: string): Message {
    this._apiRef = apiRef;
    ;(async () => {
      this.src = await this.rec.fetchAudioSrc(apiRef);
      console.log(this.src);
      this.cd.detectChanges();
    })();
    return this;
  }

  initByBlob(blob: {data: any}): Message {
    console.log('INIT BY BLOB');
    this.src = window.URL.createObjectURL(blob.data);
    console.log(this.src);
    ;(async () => {
      this._apiRef = await this.rec.saveToDbAndGetRef(this.gameId, blob);
      console.log(this.apiRef());
      this.cd.detectChanges();
    })();
    return this;
  }

  async removeFromGame(): Promise<Message> {
    this.rec.removeMessageFromGame(this.gameId,this.apiRef());
    return this;
  }
}
