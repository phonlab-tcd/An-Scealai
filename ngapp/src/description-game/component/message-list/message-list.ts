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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'dsc-message-list',
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.css']
})
export class MessageList implements OnInit {
  log = console.log;
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

  drop(event: CdkDragDrop<Message[]>) {
    moveItemInArray(this.messages, event.previousIndex, event.currentIndex);
  }

  initGame(gameInfo: { audioMessages: string[], _id: string}) {
    this.gameId = gameInfo._id;
  }

  fillHeight(ref: HTMLElement): string {
    return '' + (window.innerHeight - ref.offsetTop) + 'px';
  }

  removeMessage(n, message) {
    this.trashMessage.emit({index: n, message});
  }

  scrollToBottom(): void {
    this.logarithmRaceToBottom();
  }

  logarithmRaceToBottom() {
    console.count('LOG TO BOTTOM');
    const st = this.fullHeightDiv.nativeElement.scrollTop;
    const sh = this.fullHeightDiv.nativeElement.scrollTopMax;
    const diff = sh-st;
    console.log(diff);
    if(diff < 3) {
      console.count('end log to bottom');
      this.fullHeightDiv.nativeElement.scrollTop =
        this.fullHeightDiv.nativeElement.scrollTopMax;
      return;
    }
    this.fullHeightDiv.nativeElement.scrollTop += Math.ceil(diff/10);
    setTimeout(()=>{this.logarithmRaceToBottom()},1);
  }
}
