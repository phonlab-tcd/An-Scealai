import { Component, OnInit, ViewChild, ElementRef, Input, HostListener } from "@angular/core";
import { SynthItem } from "app/core/models/synth-item";
import { SynthesisService, Voice } from "app/core/services/synthesis.service";
import { TranslationService } from "app/core/services/translation.service";
import { SynthesisPlayerComponent } from "app/student/synthesis-player/synthesis-player.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
/*import { ClassroomService } from "app/core/services/classroom.service";
import { MessageService } from "app/core/services/message.service";
import { RecordAudioService } from "app/core/services/record-audio.service";
import { DigitalReaderStoryService } from "app/core/services/dr-story.service";
import { SynthVoiceSelectComponent } from "app/synth-voice-select/synth-voice-select.component";
import { firstValueFrom } from "rxjs";
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../dialogs/basic-dialog/basic-dialog.component';
import { Message } from "app/core/models/message";*/
import { CommonModule } from "@angular/common";
/*import { SynthItemModule } from "app/synth-item/synth-item.module";
import { SynthVoiceSelectModule } from "app/synth-voice-select/synth-voice-select.module";
import { EngagementService } from "app/core/services/engagement.service";
import { EventType } from "app/core/models/event";*/

//import { constructHTML } from '@phonlab-tcd/json2html';
import { ViewEncapsulation } from '@angular/core';
import { DigitalReaderStoryService } from "app/core/services/dr-story.service";
import { firstValueFrom } from "rxjs";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: "app-dr-story-builder",
  templateUrl: "./dr-story-builder.component.html",
  styleUrls: ["./dr-story-builder.component.scss"], // Digital Reader Story Styling
  encapsulation: ViewEncapsulation.None // Without this line, non-angular html can not be targetted for styling
})
export class DigitalReaderStoryBuilderComponent implements OnInit {
  
  @Input() type=''
  @Input() content:Element
  @Input() class:string
  @Input() id:string
  @Input() src:string
  @Input() lemma:string
  @Input() tags:string

  public forceTrustedHTML:SafeHtml;
  private wasInside = false;

  constructor(
    
    private auth: AuthenticationService,
    private synth: SynthesisService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public ts: TranslationService,
    protected sanitizer: DomSanitizer,
    private drStoryService: DigitalReaderStoryService,
  ) {
    
  }

  async ngOnInit() {
    this.forceTrustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.content.innerHTML)
  }


  /*@HostListener('click')
  clickInside() {
    //this.text = "clicked inside";
    console.log('inside')
    this.wasInside = true;
  }*/
  checkForSegmentParent(node:Element) {
    if (node.classList.contains('sentence') || node.classList.contains('word'))
      return node;
    let tmp = node;
    while (tmp.parentElement) {
      tmp = tmp.parentElement
      if (tmp.classList.contains('sentence') || tmp.classList.contains('word'))
        return tmp;
    }
    return null;
  }

  @HostListener('document:click', ['$event.target'])
  async checkSegmentClicked(targetElem:Element) {
    //console.log(event)
    const segment = this.checkForSegmentParent(targetElem)
    if (segment && segment.classList.contains('word')) {
      console.log(segment)
      const storySentencesWithMatchingWords:Array<any> = await firstValueFrom(
        this.drStoryService.getMatchingWords(segment.getAttribute('lemma'), segment.getAttribute('tags'))
      )
      //console.log()
      const sentencesWithMatchingWords = []
      for (let storyGroup of storySentencesWithMatchingWords) {
        console.log(storyGroup)
        for (let sentence of storyGroup.sentences) {
          sentencesWithMatchingWords.push(sentence)
        }
      }
      console.log(sentencesWithMatchingWords)
      const audioObj = await firstValueFrom(this.synth.synthesiseText(
        segment.textContent,
        { name: "Sibéal", gender: "female", shortCode: "snc", code: "ga_CO_snc_nemo", dialect: "connacht", algorithm: "nemo", },
        true,
        'MP3',
        1))
      const tmp = document.createElement('audio');
      console.log(audioObj);
      tmp.src = audioObj.audioUrl;
      tmp.play();
      tmp.remove();
    }
    /*if (!this.wasInside) {
      //this.text = "clicked outside";
      console.log('out')
    }
    this.wasInside = false;*/
  }

}
