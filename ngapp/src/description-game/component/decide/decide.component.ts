import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import { shuffle } from 'lodash';
import config from 'src/abairconfig.json';

const log = console.log;
const error = console.error;

@Component({
  selector: 'description-game-decide',
  templateUrl: './decide.component.html',
  styleUrls: ['./decide.component.css']
})
export class DecideComponent implements OnInit {
  possibleImages = [];

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.http.get<NextGame>(
      config.baseurl + 'description-game/next/interpret',
      {headers: {Authorization: 'Bearer ' + this.auth.getToken()}},
    ).subscribe((d:any)=>{
      this.possibleImages = 
        shuffle(d.game.red_herrings.concat([d.game.correct_description.imagePath]))
        .map(p=>config.baseurl + p);
    },error);
  }

}

interface NextGame {

};
