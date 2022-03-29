import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import max from 'lodash/max';
import { Message } from 'src/description-game/class/message';
import { RecordingService } from 'src/description-game/service/recording.service';

@Component({
  selector: 'dsc-message-list',
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.css']
})
export class MessageList implements OnInit {
  @Input('gameId')
  gameId: string;
  @Input('messages')
  messages: Message[] = [];

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private rec: RecordingService,
    private auth: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
  }

  initGame(gameInfo: { audioMessages: string[], _id: string}) {
    this.gameId = gameInfo._id;
    const dbMessages = gameInfo.audioMessages.map(a=>{
      const m = new Message(this.gameId, this.rec,this.cd);
      m.initByRef(a);
      return m;
    });
    this.messages = (dbMessages).concat(this.messages);
  }

  fillHeight(ref: HTMLElement): string {
    return '' + max([100, (window.innerHeight - ref.offsetTop)/2]) + 'px';
  }

  removeMessage(n, message) {
    this.messages = this.messages.filter((v,i)=>i!=n);
    message.removeFromGame();
  }
}
