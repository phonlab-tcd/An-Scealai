import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from "src/app/authentication.service";
import { Message } from 'src/description-game/class/message';
import { RecordingService } from 'src/description-game/service/recording.service';
import config from 'src/abairconfig.json';

@Component({
  selector: 'dsc-describe',
  templateUrl: './describe.component.html',
  styleUrls: ['./describe.component.css']
})
export class DescribeComponent implements OnInit {
  @ViewChild('messageList') messageList = null;
  messages: Message[] = [];
  gameInfo: any;
  imageUri = '';
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private rec: RecordingService,
    private cd: ChangeDetectorRef,
  ) {
  }

  newMessage(dataavailable) {
    const newM = new Message(this.gameInfo._id, this.rec, this.cd);
    this.messages.push(newM);
    newM.initByBlob(dataavailable);
    this.cd.detectChanges();
  }

  fetchGameInfo() {
    return this.http.get<{imagePath: string;audioMessages: any[]}>(
      config.baseurl + 'description-game/next/describe',
      {headers: {Authorization: 'Bearer ' + this.auth.getToken() }})
      .pipe(
        tap(d=>{
          this.imageUri=config.baseurl.concat(d.imagePath)
        }));
  }

  submitDescription(messageList) {
    const messageIds =
      messageList.apiRefs.concat(
        messageList.inMemoryRefs.map(i=>i.apiRef));
    const game = this.gameInfo;
    this.http.post(
      config.baseurl + 'description-game/submit/describe',
      { game, messageIds, },
      { headers: { Authorization: 'Bearer ' + this.auth.getToken() } }
    ).subscribe(()=>{
      this.messageList.refresh();
      this.ngAfterViewInit();
    },console.error);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.messageList.gameInfo = undefined;
    this.cd.detectChanges();
    this.fetchGameInfo().subscribe(d=>{
      this.gameInfo=d;
      this.messageList.initGame(d);
    });
    this.cd.detectChanges();
  }

  hitStop(messageList, event) {
    messageList.scrollTop = messageList.scrollTopMax;
  }
}
