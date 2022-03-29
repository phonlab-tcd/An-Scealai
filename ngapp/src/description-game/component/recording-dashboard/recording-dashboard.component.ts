import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import config from 'src/abairconfig.json';
import { RecordingService } from 'src/description-game/service/recording.service';

@Component({
  selector: 'dsc-recording-dashboard',
  templateUrl: './recording-dashboard.component.html',
  styleUrls: ['./recording-dashboard.component.css']
})
export class RecordingDashboardComponent implements OnInit {
  ids: string[] = [];
  show = false;

  constructor(
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private auth: AuthenticationService,
    private rec: RecordingService,
  ) { }

  play=(a)=>a.play();

  ngOnInit(): void {
    this.http.get<any[]>(
      config.baseurl + 'description-game/allAudio',
      {headers: { Authorization: 'Bearer '.concat(this.auth.getToken())}})
      .subscribe(ok=>{
        this.ids = ok;
      });
  }

}
