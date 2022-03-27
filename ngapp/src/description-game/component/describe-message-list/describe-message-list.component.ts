import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import config from 'src/abairconfig.json';

@Component({
  selector: 'description-game-describe-message-list',
  templateUrl: './describe-message-list.component.html',
  styleUrls: ['./describe-message-list.component.css']
})
export class DescribeMessageListComponent implements OnInit {
  private _gameInfo;
  fromDb: string[] = []; // TODO actually should be ObjectId[]
  saved: any[] = [];
  unprocessedRecordings: {start: number; stop: number}[] = []; 

  @Input('gameInfo')
  set gameInfo(d:{audioMessages: any[]}) {
    this._gameInfo = d;
    if(d && d.audioMessages)
      this.fromDb = d.audioMessages;
    this.cd.detectChanges();
  }

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private auth: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
  }

  receiveRecordingId(d) {
    this.unprocessedRecordings.push(d);
  }

  process(dataavailable) {
    console.log(dataavailable);
    console.log(this.unprocessedRecordings);
    console.log(dataavailable.time.start);
    this.unprocessedRecordings = 
      this.unprocessedRecordings
        .filter(t=>t.start!=dataavailable.time.start);
    console.log(this.unprocessedRecordings);
    const newlySaved = { originalBlob: dataavailable, apiRef: null};
    this.saved.push(newlySaved);
    this.cd.detectChanges();
    var form = new FormData();
    form.append('source', dataavailable.data);
    form.append('game_type','describe');
    form.append('game_id',this._gameInfo._id);
    form.append('time_start', dataavailable.time.start);
    form.append('time_stop',  dataavailable.time.stop );
    form.append('time_ready', dataavailable.time.ready);
    console.log(this.http);
    this.http.post<any[]>(
      config.baseurl + 'description-game/audio',
      form,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken()) },
      }).subscribe(ok=>{
        newlySaved.apiRef = ok[0];
        console.log(ok[0]);
        this.cd.detectChanges();
      });
  }

  removeSaved(index) {
    console.log('removSaved('+index+')');
    console.log(this.saved);
    this.saved = this.saved.slice(0,index).concat(this.saved.slice(index+1));
    console.log(this.saved);
    this.cd.detectChanges();
  }
}
