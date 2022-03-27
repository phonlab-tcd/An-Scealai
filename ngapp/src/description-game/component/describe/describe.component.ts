import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from "src/app/authentication.service";
import config from 'src/abairconfig.json';

@Component({
  selector: 'description-game-describe',
  templateUrl: './describe.component.html',
  styleUrls: ['./describe.component.css']
})
export class DescribeComponent implements OnInit {
  @ViewChild('messageList') messageList = null;
  gameInfo: any;
  imageUri = '';
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
  ) {
    this.fetchGameInfo().subscribe(d=>{
      this.gameInfo=d
    });
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
    const messageIds = messageList.saved.concat(messageList.fromDb);
    const game = this.gameInfo;
    this.http.post(
      config.baseurl + 'description-game/submit/describe',
      { game, messageIds, },
      { headers: { Authorization: 'Bearer ' + this.auth.getToken() } }
    ).subscribe(console.log,console.error);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
