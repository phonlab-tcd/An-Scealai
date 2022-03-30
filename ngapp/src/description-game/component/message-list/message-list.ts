import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
  @Output('trashMessage')
  trashMessage: EventEmitter<{index: number; message: Message}>
    = new EventEmitter();
  @ViewChild('fullHeightDiv')
  fullHeightDiv: ElementRef;

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
  }

  fillHeight(ref: HTMLElement): string {
    return '' + max([100, (window.innerHeight - ref.offsetTop)/2]) + 'px';
  }

  removeMessage(n, message) {
    this.trashMessage.emit({index: n, message});
  }

  scrollToBottom(): void {
    console.log('SCROLL TO BOTTOM', this);
    this.fullHeightDiv.nativeElement.scrollTop
      = this.fullHeightDiv.nativeElement.scrollHeight;
  }
}
