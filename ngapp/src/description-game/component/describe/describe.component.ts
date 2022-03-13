import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map} from 'rxjs/operators';
import config from 'src/abairconfig.json';
import {AuthenticationService} from "src/app/authentication.service";

@Component({
  selector: 'description-game-describe',
  templateUrl: './describe.component.html',
  styleUrls: ['./describe.component.css']
})
export class DescribeComponent implements OnInit {
  gameInfo: any;
  imageUri = '';
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
  ) {
    this.fetchGameInfo().subscribe(d=>{
      console.log('gameInfo:',d);
      this.gameInfo=d
    });
  }

  fetchGameInfo() {
    return this.http.get<{imagePath: string;audioMessages: any[]}>(
      config.baseurl + 'description-game/next/describe',
      {headers: {Authorization: 'Bearer ' + this.auth.getToken() }})
      .pipe(
        tap(d=>{
          console.log(d);
          this.imageUri=config.baseurl.concat(d.imagePath)
        }));
  }

  ngOnInit(): void {
  }

}
