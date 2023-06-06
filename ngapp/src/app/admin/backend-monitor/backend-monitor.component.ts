import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import config from 'abairconfig';

@Component({
  selector: 'app-backend-monitor',
  templateUrl: './backend-monitor.component.html',
  styleUrls: ['./backend-monitor.component.scss']
})
export class BackendMonitorComponent implements OnInit {

  constructor(private http: HttpClient, public sanitizer:DomSanitizer) { }

  expressMonitorObject: SafeResourceUrl;

  ngOnInit(): void {
    // The express monitor app needs to know which backend url we're using
    // in order to set up a websocket to stream data about the server.
    // 
    // Here, we pass the backend url in a global variable on window object so that
    // we can set up the websocket stream based on whatever backed url is in abairconfig.
    window['abairconfig.baseurl'] = config.baseurl;
    this.http.get(config.baseurl + 'status', {responseType: 'blob'}).subscribe(blob => {
      this.expressMonitorObject = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    });
  }

  setIframeSize(iframe: HTMLIFrameElement): void {
    iframe.style.height = '0'; // Reset the height to avoid scrollbars initially
    iframe.style.height = iframe.contentWindow?.document.body.scrollHeight + 100 + 'px';
    iframe.style.width = '100%';
  }
}
