import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from 'src/abairconfig.json';
import {AuthenticationService} from "src/app/authentication.service";
import { NgWaveformComponent } from '../../ng-waveform/ng-waveform.component';
import { RecordingService } from '../../service/recording.service';

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
  selector: 'dsc-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {
  public metaData: {time: {start: number}}= null;
  duration: number = null;
  @Input('originalBlob') originalBlob: any;
  @Input('apiRef') apiRef: string; // ObjectId
  @Input('index') index: number;
  @Input('height') height: number = 40;
  @ViewChild('waveform') waveform: NgWaveformComponent;
  @Output('deleteMe') deleteMe: EventEmitter<number> = new EventEmitter();
  @Output('finishPlaying') finishPlaying: EventEmitter<string> = new EventEmitter();
  
  backgroundColor = '#b1d0b9';

  public tooltipText: string = '';

  makeTooltip() {
    this.tooltipText = ''; 
    if(this.metaData && this.metaData.time && this.metaData.time.start) {
    const startTime = new Date(this.metaData.time.start);
    this.tooltipText =
      startTime.toLocaleDateString() + ' ' +
      startTime.toLocaleTimeString();
    }
    if(this.duration)
      this.tooltipText += ' Duration: ' + this.duration.toFixed(2) + 's';
    this.cd.detectChanges();
  }

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private rec: RecordingService,
    public cd: ChangeDetectorRef,
  ) { }

  setDuration(d:number) {
    this.duration = d;
    this.makeTooltip();
  }

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

  src: string;
  d: Date;

  ngOnInit(): void {
    if(this.originalBlob) {
      this.src =
          window.URL.createObjectURL(
            this.originalBlob.data);
      this.metaData = {time: this.originalBlob.time};
      this.makeTooltip();
      this.cd.detectChanges();
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
        this.metaData = d;
        this.makeTooltip();
        this.cd.detectChanges();
      });
  }

  async fetchAudio() {
    this.src = await this.rec.fetchAudioSrc(this.apiRef);
    this.cd.detectChanges();
  }
}
