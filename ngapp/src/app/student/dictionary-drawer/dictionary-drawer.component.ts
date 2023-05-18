import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslationService } from "app/core/services/translation.service";
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from "rxjs";
import { EngagementService } from "app/core/services/engagement.service";
import { EventType } from "app/core/models/event";
import config from 'abairconfig';

@Component({
  selector: 'app-dictionary-drawer',
  templateUrl: './dictionary-drawer.component.html',
  styleUrls: ['./dictionary-drawer.component.scss']
})
export class DictionaryDrawerComponent implements OnInit {

    wordLookedUp: string = '';
    selectTeanglann = true;
    selectExternalLinks: boolean = false;
    defaultDictIframeText = this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:text/html;charset=utf-8,` +
      this.ts.l.search_for_words_in_dictionary
    );
    @Output() closeDictionaryEmitter = new EventEmitter();

  constructor(public ts: TranslationService, protected sanitizer: DomSanitizer, private http: HttpClient, private engagement: EngagementService,) { }

  ngOnInit(): void {
  }

    /* Set html for dictionary iframe and log looked-up word to DB */
    async lookupWord() {
      if(this.wordLookedUp) {
        const teanglannRequest = this.http.post(config.baseurl + 'proxy/', {url: `https://www.teanglann.ie/en/fgb/${this.wordLookedUp}`});
        const teanglannHtml = await firstValueFrom(teanglannRequest) as string;
        const teanglannDoc = new DOMParser().parseFromString(teanglannHtml, 'text/html');
        
        // The links by default will point to localhost/en/fgb/<...> instead of teanglann/en/fgb/<...>
        const exampleLinks = teanglannDoc.querySelectorAll('.ex > .head > a');
        exampleLinks.forEach((link: HTMLAnchorElement) => link.href =
        `https://www.teanglann.ie${link.href.slice(link.href.lastIndexOf('/en/'))}`);
  
        const moreExamplesLink = teanglannDoc.querySelector('.moar');
        moreExamplesLink?.remove(); // this requires teanglann javascript to work, so can just remove.
        
        const resultsContainer = teanglannDoc.querySelector('.listings') as HTMLDivElement;
        resultsContainer.style.cssText += 'margin-right: 0px; padding: 10px;';
  
        const frameObj = document.getElementById('dictiframe') as HTMLIFrameElement;
        frameObj.src = 
          "data:text/html;charset=utf-8," +
          `<link type="text/css" rel="stylesheet" href="https://www.teanglann.ie/furniture/template.css">` +
          `<link type="text/css" rel="stylesheet" href="https://www.teanglann.ie/furniture/fgb.css">` +
          resultsContainer.outerHTML;
  
        this.engagement.addEventForLoggedInUser(EventType['USE-DICTIONARY'], null, this.wordLookedUp);
      }
      else {
        alert(this.ts.l.enter_a_word_to_lookup);
      }
    }
    
    /* Clear the dictionary input box */
    clearDictInput() {
      if(this.wordLookedUp) {
        this.wordLookedUp = "";
      }
    }

}
