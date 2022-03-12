import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import config from 'src/abairconfig.json';

@Component({
  selector: 'description-game-describe-message-list',
  templateUrl: './describe-message-list.component.html',
  styleUrls: ['./describe-message-list.component.css']
})
export class DescribeMessageListComponent implements OnInit {
  saved: any[] = [];
  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private auth: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  receive = (dataavailable) => {
    console.log(dataavailable);
    const newlySaved = { originalBlob: dataavailable, apiRef: null};
    this.saved.push(newlySaved);
    this.cd.detectChanges();
    var form = new FormData();
    form.append('source', dataavailable.data);
    form.append('time_start', dataavailable.time.start);
    form.append('time_stop',  dataavailable.time.stop );
    form.append('time_ready', dataavailable.time.ready);
    console.log(this.http);
    this.http.post<any[]>(
      config.baseurl + 'description-game/audio',
      form,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken()) },
      }).subscribe(ok=>{
        newlySaved.apiRef = ok[0];
        console.log(ok[0]);
        this.cd.detectChanges();
      });
  }

}
