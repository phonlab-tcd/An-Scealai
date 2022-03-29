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


@Component({
  selector: 'dsc-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {
  public metaData: {time: {start: number}}= null;
  duration: number = null;
  @Input('src') src: string;
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

  ngOnInit(): void {
    console.log('LISTEN ON INIT');
  }

}
