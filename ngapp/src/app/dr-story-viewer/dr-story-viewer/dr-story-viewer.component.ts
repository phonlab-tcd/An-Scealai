import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SynthItem } from "app/core/models/synth-item";
import { SynthesisService, Voice, voices } from "app/core/services/synthesis.service";
import { TranslationService } from "app/core/services/translation.service";
import { SynthesisPlayerComponent } from "app/student/synthesis-player/synthesis-player.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ClassroomService } from "app/core/services/classroom.service";
import { MessageService } from "app/core/services/message.service";
import { RecordAudioService } from "app/core/services/record-audio.service";
import { DigitalReaderStoryService } from "app/core/services/dr-story.service";
import { SynthVoiceSelectComponent } from "app/synth-voice-select/synth-voice-select.component";
import { DomSanitizer } from "@angular/platform-browser";
import { firstValueFrom } from "rxjs";
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from 'app/dialogs/basic-dialog/basic-dialog.component';
import { Message } from "app/core/models/message";
import { CommonModule } from "@angular/common";
import { SynthItemModule } from "app/synth-item/synth-item.module";
import { SynthVoiceSelectModule } from "app/synth-voice-select/synth-voice-select.module";
import { EngagementService } from "app/core/services/engagement.service";
import { EventType } from "app/core/models/event";

import { constructHTML } from '@phonlab-tcd/json2html';
import { DigitalReaderStoryBuilderComponent } from "../dr-story-builder/dr-story-builder.component";

@Component({
  standalone: true,
  imports: [CommonModule, SynthItemModule, SynthVoiceSelectModule, MatDialogModule, DigitalReaderStoryBuilderComponent],
  selector: "app-dr-story-viewer",
  templateUrl: "./dr-story-viewer.component.html",
  styleUrls: ["./dr-story-viewer.component.scss"],
})
export class DigitalReaderStoryViewerComponent implements OnInit {

  // game options
  playWithTimer = false;
  totalTime: number = 0;
  interval: any;
  isRecording: boolean = false;  
  dialogRef: MatDialogRef<unknown>;

  // synthesis variables
  synthesisPlayer: SynthesisPlayerComponent;
  playbackSpeed: number = 1; //Shoud range from 0.5x to 2x speed incrementing in 0.5.
  @ViewChild("voiceSelect") voiceSelect: ElementRef<SynthVoiceSelectComponent>;
  selectedVoice: Voice | undefined;
  synthItem: SynthItem;
  errorText: boolean = false;
  synthItems: SynthItem[] = [];

  storyId: string = '';
  storyObj: Object = {};
  story: Element;

  // user variables
  studentId: string = "";
  teacherId: string = "";

  startingWordId:string | null = null;

  constructor(
    private messageService: MessageService,
    private classroomService: ClassroomService,
    private auth: AuthenticationService,
    private synth: SynthesisService,
    private drStoryService: DigitalReaderStoryService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public ts: TranslationService,
    protected sanitizer: DomSanitizer,
    private recordAudioService: RecordAudioService,
    private dialog: MatDialog,
    private engagement: EngagementService
  ) {
    // see if dictogloss is generated from messages
    //try {
    const storyId = this.router.getCurrentNavigation()?.initialUrl.queryParams['storyId']
    if (storyId) {
      this.storyId = storyId
      console.log(storyId)
      console.log(this.storyId)

      const startingWordId = this.router.getCurrentNavigation()?.initialUrl.queryParams['startingWordId']
      console.log(startingWordId)
      if (startingWordId) this.startingWordId = startingWordId;
    } else {
      console.log('No story id provided')
      this.goToDRStoryLibrary('Please select a story from the library') //TODO : Add translation to ts
    }
  }

  /**
   * Get user details -> id, role
   * Refresh synthesis voice settings
   * Check if dictogloss is sent from messages
   */
  async ngOnInit() {
    let storyObj = {}
    try {
      storyObj = await firstValueFrom(this.drStoryService.getPublicDRStoryById(this.storyId))
      console.log(storyObj)
    } catch (err) {
      console.log(err)
      this.goToDRStoryLibrary('Please select a story from the library') //TODO : Add translation to ts
      return
    }

    //console.log(Object.keys(storyObj).length)
    if (Object.keys(storyObj).length!==0)
      this.storyObj = storyObj
    else {
      this.goToDRStoryLibrary('Invalid story selection') //TODO : Add translation to ts
      return
    }

    const rawStory = constructHTML(this.storyObj['story'])

    //this.story = this.removeEmptyTags(rawStory) // this also removes all <img> tags!!!
    this.story = rawStory
    console.log(this.story)

    //console.log(this.story.querySelector('body'))
    
  }

  /*removeEmptyTags(root: Element) {
    const descendants = root.querySelectorAll('*')
    descendants.forEach((descendant) => {
      if (descendant.textContent==='') {
        descendant.remove()
      }
    })
    return root;
  }*/

  goToDRStoryLibrary(alertMessage?:string) {
    this.router.navigateByUrl('dr-library')
    if (alertMessage) alert(alertMessage)
  }

  /**
   * Refresh the synthetic voice: deletes old audio urls and creates new array
   * @param voice Synthesis voice option
   * @returns
   */
  refreshVoice(voice: Voice | undefined = undefined) {
    if (voice) this.selectedVoice = voice;
    this.synthItems.forEach((s: SynthItem) => {
      s.audioUrl = undefined;
      s.dispose();
    });
    this.synthItems = [];
    console.log('refresh synth')
    //this.collateSynths();
  }

}
