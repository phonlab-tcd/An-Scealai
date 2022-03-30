import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import { shuffle } from 'lodash';
import { Message } from 'src/description-game/class/message';
import { RecordingService } from 'src/description-game/service/recording.service';
import config from 'src/abairconfig.json';

@Component({
  selector: 'dsc-decide',
  templateUrl: './decide.component.html',
  styleUrls: ['./decide.component.css']
})
export class DecideComponent implements OnInit {
  possibleImages = [];
  messages: Message[] = [];
  audioMessageRefs: string[] = [];
  currentMessage: number = 0;
  selectedImage: string;
  numSeconds = 10;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    private rec: RecordingService,
  ) { }

  ngOnInit(): void {
    this.http.get<InterpretGame>(
      config.baseurl + 'description-game/next/interpret',
      {headers: {Authorization: 'Bearer ' + this.auth.getToken()}},
    ).subscribe((d:any)=>{
      this.possibleImages = 
        shuffle(d.game.red_herrings.concat([d.game.correct_description.imagePath]))
        .map(p=>config.baseurl + p);
      this.audioMessageRefs = d.game.correct_description.audioMessages;
      this.messages = this.audioMessageRefs.map(a=>new Message('true',this.rec,this.cd).initByRef(a));
      console.log(this.audioMessageRefs);
    },console.error);
  }

  nextMessage(): void {
    this.currentMessage++;
    this.currentMessage = this.currentMessage % (this.audioMessageRefs.length);
    console.log(this.currentMessage);
    this.cd.detectChanges();
  }

  selectMessage(i): void {
    if(this.audioMessageRefs[i]) {
      this.currentMessage = i;
      this.cd.detectChanges();
    }
  }

  selectImage(i): void {
    if(this.possibleImages[i]) {
      this.selectedImage = this.possibleImages[i];
      this.cd.detectChanges();
    }
  }
}
interface InterpretGame {
  ownerId: string;
  gameId: string;
  game: {
    red_herrings: [string];
    correct_description: {
      imagePath: string;
      audioMessages: string;
    };
  }
}
