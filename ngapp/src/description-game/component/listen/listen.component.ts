import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from 'src/abairconfig.json';
import {AuthenticationService} from "src/app/authentication.service";
import { NgWaveformComponent } from '../../ng-waveform/ng-waveform.component'

function timestamp(_id:string):string {
  return new String(_id).substring(0,8);
}

function date(timestamp: string) {
  return new Date(parseInt(timestamp,16) *1000);
}

interface MetaData {
  time: {
    start: number;
    stop: number;
    ready: number;
  };
  mimetype: string;
}

@Component({
  selector: 'description-game-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {
  public metaData: {time: {start: number}}= null;
  @Input('originalBlob') originalBlob: any;
  @Input('apiRef') apiRef: string; // ObjectId
  @Input('index') index: number;
  @Input('height') height: number = 40;
  @ViewChild('waveform') waveform: NgWaveformComponent;
  @Output('deleteMe') deleteMe: EventEmitter<number> = new EventEmitter();
  
  backgroundColor = '#b1d0b9';

  printMetaData() {
    console.log('METADATA');
    console.log(this.metaData);
  }

  private _metaDataString: string;

  metaDataString() {
    if(this._metaDataString)
      return this._metaDataString;
    if(!this.metaData)
      return 'waiting...';
    if(!this.metaData.time)
      return 'no time info...';
    const d = new Date(this.metaData.time.start);
    const s = d.toLocaleDateString() + '\t' + d.toLocaleTimeString();
    this._metaDataString = s;
    return s;
  }

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    public cd: ChangeDetectorRef,
  ) { }

  onTimeUpdate() {
    this.waveform.refreshProgress();
  }

  togglePlayback() {
    if(this.waveform)
      this.waveform.togglePlayback();
  }

  isPlaying() {
    if(this.waveform)
      return this.waveform.isPlaying();
    return false;
  }

  date(){
    if(this.originalBlob) {
      return new Date(this.originalBlob.time.start)
        .toLocaleTimeString();
    }
  };

  audio: HTMLAudioElement;
  d: Date;

  ngOnInit(): void {
    if(this.originalBlob) {
      this.metaData = {time: this.originalBlob.time};
      this.audio =
        new Audio(
          window.URL.createObjectURL(
            this.originalBlob.data));
      return;
    }
    if(!this.apiRef) {
      this.deleteMe.emit(this.index);
      return;
    }
    this.fetchMetaData();
    this.fetchAudio();
  }

  fetchMetaData() {
    this.http.get<MetaData>(
      config.baseurl + `description-game/meta/audio/${this.apiRef}`,
      {
        headers: {Authorization: 'Bearer ' + this.auth.getToken()},
      })
      .subscribe((d: MetaData) => {
        console.log(d);
        this.metaData = d;});
  }

  fetchAudio() {
    this.http.get(
      config.baseurl + `description-game/audio/${this.apiRef}`,
      {
        headers: {Authorization: 'Bearer ' + this.auth.getToken()},
        responseType: 'text',
      })
      .subscribe(d => {
        this.audio = new Audio(d);
        console.log(this.audio);
        this.cd.detectChanges();
      });
  }
}
