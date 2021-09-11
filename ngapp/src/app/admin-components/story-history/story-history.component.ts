import { Component, OnInit } from '@angular/core';
import { EngagementService } from '../../engagement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoryService } from '../../story.service';
import { Event } from '../../event';
import { Story } from '../../story';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import * as Diff from 'diff';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-story-history',
  templateUrl: './story-history.component.html',
  styleUrls: ['./story-history.component.css']
})
export class StoryHistoryComponent implements OnInit {

  constructor(private engagement : EngagementService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private storyService: StoryService,
              private router: Router,
              private sanitizer: DomSanitizer,
              public ts: TranslationService) { }

  events: Event[];
  highlightedTexts: string[] = [];
  entries: Entry[] = [];
  highlightIconClass = "";

  ngOnInit() {
    this.getParams().then(params => {
      let id = params['id'].toString();
      this.engagement.getEventsForStory(id).subscribe((res: Event[]) => {
        this.events = res;
        let prevStory:any;
        this.events.forEach((e) => {
          let entry : Entry = new Entry();
          entry.event = e;
          let s:any = e.storyData
          entry.textHighlighted = s.text;
          entry.textNotHighlighted = s.text;
          if(prevStory) {
            entry.textHighlighted = this.highlightDifference(prevStory.text.toString(), s.text.toString());
          }
          prevStory = s;
          entry.isHighlighted = false;
          this.entries.push(entry);
        });
      })
    })
  }

  highlightDifference(a: any, b: any) : SafeHtml {
    let one = a,
    other = b,
    spanClass = 'notHighlighted',
    output: string = "";

    var diff = Diff.diffChars(one, other);

    diff.forEach(function(part){
      spanClass = part.added ? 'highlightedGreen' : part.removed ? 'highlightedRed' : 'notHighlighted';

      let span : HTMLSpanElement = document.createElement('span');
      span.classList.add(spanClass);
      span.appendChild(document.createTextNode(part.value));

      let container : HTMLElement = document.createElement('span');
      container.appendChild(span);

      output += container.innerHTML;
    });
    return this.sanitizer.bypassSecurityTrustHtml(output);
  }

  toggleHighlights() {
    this.entries.forEach((e) => {
      e.isHighlighted = !e.isHighlighted;
    });
    if(this.highlightIconClass === "") {
      this.highlightIconClass = "iconHighlighted";
    } else {
      this.highlightIconClass = "";
    }
  }

  getParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

  formatDate(dateStr: string) : string {
    let date = new Date(dateStr);

    let dd = date.getDate();
    let mm = date.getMonth() + 1;

    let yyyy = date.getFullYear();
    let ddStr = dd.toString();
    let mmStr = mm.toString();
    if (dd < 10) {
      ddStr = '0' + dd;
    } 
    if (mm < 10) {
      mmStr = '0' + mm;
    }

    let hrsStr = date.getHours().toString();
    let mntsStr = date.getMinutes().toString();
    let secStr = date.getSeconds().toString();

    if(date.getHours() < 10) {
      hrsStr = '0' + hrsStr;
    }
    if(date.getMinutes() < 10) {
      mntsStr = '0' + mntsStr;
    }
    if(date.getSeconds() < 10) {
      secStr = '0' + secStr;
    }

    return ddStr + '-' + mmStr + '-' + yyyy + " " + hrsStr + ":" + mntsStr + ":" + secStr;
  }

  getHighlightIconClass(entry: Entry) : string {
    return entry.isHighlighted ? "iconHighlighted" : "";
  }

}

class Entry {
  event: Event;
  textHighlighted: SafeHtml;
  textNotHighlighted: string;
  isHighlighted: boolean;
}
