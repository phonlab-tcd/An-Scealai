import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from 'src/abairconfig.json';

@Component({
  selector: 'description-game-describe',
  templateUrl: './describe.component.html',
  styleUrls: ['./describe.component.css']
})
export class DescribeComponent implements OnInit {
  gameSessionData: any;
  imageUri = '';
  constructor(
    private http: HttpClient,
  ) {
    this.http.get<{imagePath: string}>(config.baseurl + 'description-game/next/describe')
      .subscribe(ok=>{
        this.gameSessionData = ok;
        this.imageUri = config.baseurl.concat(ok.imagePath);
      })
  }

  ngOnInit(): void {
  }

}
