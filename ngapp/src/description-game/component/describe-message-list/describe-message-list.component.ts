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
  fromDb: any[] = [];
  handles: any[] = [];
  saved: any[] = [];
  @Input('gameInfo')
  set gameInfo(d:{audioMessages: any[]}) {
    this._gameInfo = d;
    if(d.audioMessages)
      this.fromDb = d.audioMessages;
  }
  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private auth: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
  }

  receiveHandle(handle) {
    console.log('receiveHandle',handle);
    this.handles.push(handle);
    console.log(this.handles);
  }

  refresh() {
    console.log(this.handles);
    this.handles = this.handles.map(x=>{
        this.receive(x.dataavailable);
        x.processing = false;
        return x;
      });
    this.handles = this.handles.filter(x=>x.processing);
  }

  receive = (dataavailable) => {
    console.log(dataavailable);
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
    delete this.saved[index];
  }

}
