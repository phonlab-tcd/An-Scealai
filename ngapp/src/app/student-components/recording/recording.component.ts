import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../translation.service';
import { StoryService } from '../../story.service';
import { RecordingService } from '../../recording.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Story } from '../../story';
import { Recording } from '../../recording';
import { Subject } from 'rxjs';
import { SynthesisService, Paragraph, Sentence, Section } from '../../services/synthesis.service';
import { EventType } from '../../event';
import { EngagementService } from '../../engagement.service';

declare var MediaRecorder : any;

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.scss']
})
export class RecordingComponent implements OnInit {

  constructor(private storyService: StoryService, public ts: TranslationService,
              private sanitizer: DomSanitizer, private route: ActivatedRoute,
              private router: Router, private recordingService: RecordingService,
              private synthesis: SynthesisService, private engagement: EngagementService) { }
  
  // Synthesis variables
  story: Story = new Story();
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  chosenSections: Section[];

  // Audio variables
  
  // NOTE: 'section' variables are pointers to corresponding variables
  // for chosen section type (paragraph / sentence)
  recorder;
  stream;
  chunks;

  isRecordingParagraph: boolean[] = [];
  isRecordingSentence: boolean[] = [];
  isRecordingSection: boolean[] = []

  paragraphAudioSources : SafeUrl[] = [];
  sentenceAudioSources: SafeUrl[] = [];
  sectionAudioSources: SafeUrl[] = [];

  paragraphBlobs: any[] = [];
  sentenceBlobs: any[] = [];
  sectionBlobs: any[] = [];  

  paragraphChunks: {[key:number]:any[]} = [];
  sentenceChunks: {[key:number]:any[]}  = [];
  sectionChunks: {[key:number]:any[]}  = [];

  // UI variables
  modalClass : string = "hidden";
  modalChoice: Subject<boolean> = new Subject<boolean>();
  recordingSaved: boolean = true;
  popupVisible = false;
  errorText : string;
  registrationError : boolean;
  audioFinishedLoading: boolean = false;

  /*
  * Call getStory() to get current story recording, story data, synthesise, and recordings
  * Reset variables when recording text updated (function called in updateStory())
  */
  ngOnInit() {
    this.modalClass = "hidden";
    this.chunks = [];
    this.sectionAudioSources = this.paragraphAudioSources;
    this.sectionBlobs = this.paragraphBlobs;
    this.sectionChunks = this.paragraphChunks;
    this.isRecordingSection = this.isRecordingParagraph;
    const storyId = this.route.snapshot.paramMap.get('id');
    this.storyService.getStory(storyId).subscribe(story => {
        this.story = story;
        if (this.story.activeRecording) {
          this.recordingService.get(this.story.activeRecording).subscribe(recording => {
            this.loadSynthesis(recording.storyData);
            this.loadAudio(recording);
          });
        } else {
          this.archive(this.story);
        }
      });
  }

  loadSynthesis(story: Story) {
    this.synthesis.synthesiseStory(story).then(([paragraphs, sentences]) => {
      this.paragraphs = paragraphs;
      this.sentences = sentences;
      this.chosenSections = this.paragraphs;
      this.audioFinishedLoading = true;
    });
  }

  /**
   * Archives story.activeRecording by making a new, blank
   * up-to-date activeRecording for story.
   * 
   * @param story - story whose activeRecording will be updated
   */
  archive(story: Story) {
    
    if(story.activeRecording) {
      this.recordingService.updateArchiveStatus(story.activeRecording).subscribe();
    }
    
    const newActiveRecording = new Recording(story);
    this.recordingService.create(newActiveRecording).subscribe(res => {
      if (res.recording) {
        const newActiveRecordingId = res.recording._id;
        this.storyService.updateActiveRecording(story._id, newActiveRecordingId).subscribe(_ => {
          this.story.activeRecording = newActiveRecordingId;
          // Reset all recording / audio data
          this.paragraphs = [];
          this.paragraphAudioSources = [];
          this.paragraphChunks = [];

          this.sentences = [];
          this.sentenceAudioSources = [];
          this.sentenceChunks = [];

          this.chosenSections = [];
          this.sectionAudioSources = [];
          this.sectionChunks = [];

          this.popupVisible = false;
          this.loadSynthesis(story);
        });
      }
    })
  }

  //--- Audio Control ---//
  // TODO: put recording/playback functions + audio variables in a service

  /**
   * Given some recording, gets audio data from the DB and saves it
   * in SafeUrl arrays to be displayed in <audio>s on the .html page
   * 
   * @param recording - recording whose audio clips should be loaded
   */
  loadAudio(recording: Recording) {
    this.audioFinishedLoading = false;
    for (let i=0; i<recording.paragraphIndices.length; ++i) {
      this.recordingService.getAudio(recording.paragraphAudioIds[i]).subscribe((res) => {
        this.paragraphBlobs[i] = res;
        this.paragraphAudioSources[recording.paragraphIndices[i]] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      });
    }
    for (let i=0; i<recording.sentenceIndices.length; ++i) {
      this.recordingService.getAudio(recording.sentenceAudioIds[i]).subscribe((res) => {
        this.sentenceBlobs[i] = res;
        this.sentenceAudioSources[recording.sentenceIndices[i]] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      });
    }
  }

  /**
   * Given some chunksArray (either paragraphChunks or sentenceChunks) and a
   * sentence / paragraph index, populate that chunks array with audio data
   * recorded through microphone.
   * @param index - index for the paragraph / sentence being recorded
   * @param chunksArray - array of any[], should be either paragraphChunks
   * or sentenceChunks
   */
  recordAudio(index:number) {
    this.engagement.addEventForLoggedInUser(EventType["RECORD-STORY"], this.story)
    
    console.log('Record audio:', index);
    let media = {
      tag: 'audio',
      type: 'audio/mp3',
      ext: '.mp3',
      gUM: {audio: true}
    }
    navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
      this.stream = _stream;
      this.recorder = new MediaRecorder(this.stream);
      this.sectionChunks[index] = [];
      this.recorder.start();
      this.isRecordingSection[index] = true;
      this.recorder.ondataavailable = e => {
        this.sectionChunks[index].push(e.data);
        if(this.recorder.state == 'inactive') {
        };
      };
    }).catch();
  }

  stopRecording(index: number) {
    this.recorder.stop();
    this.isRecordingSection[index] = false;
    this.stream.getTracks().forEach(track => track.stop());
    setTimeout(() => {
      const blob = new Blob(this.sectionChunks[index], {type: 'audio/mp3'});
      this.sectionBlobs[index] = blob;
      this.sectionAudioSources[index] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      this.recordingSaved = false;
    }, 500);
  }

  deleteRecording(index: number) {
    this.recordingSaved = false;
    delete this.sectionAudioSources[index];
    delete this.sectionChunks[index];
    delete this.sectionBlobs[index];
  }
  
  /**
   * Saves contents of this.paragraphChunks and this.sentenceChunks to DB
   * as individual audio clips using recordingService.saveAudio.
   * 
   * Each clip is given an id on the database. These ids are mapped to
   * by paragraph / sentence indices which are stored in Recording object,
   * which is also saved to DB.
   */
  async saveRecordings() {
    const paragraph_promises = Object.entries(this.paragraphBlobs).map(async ([index, blob]) => {
      return this.recordingService.saveAudio(this.story._id, blob, index).toPromise();
    });

    const sentence_promises = Object.entries(this.sentenceBlobs).map(async ([index, blob]) => {
      return this.recordingService.saveAudio(this.story._id, blob, index).toPromise();
    });

    const paragraphResponses = await Promise.all(paragraph_promises);
    const sentenceResponses = await Promise.all(sentence_promises);

    let paragraphIndices = [];
    let paragraphAudioIds = [];
    for (const res of paragraphResponses) {
      paragraphIndices.push(res.index);
      paragraphAudioIds.push(res.fileId);
    }

    let sentenceIndices = [];
    let sentenceAudioIds = [];
    for (const res of sentenceResponses) {
      sentenceIndices.push(res.index);
      sentenceAudioIds.push(res.fileId);
    }

    const trackData = {
      paragraphAudioIds: paragraphAudioIds,
      paragraphIndices: paragraphIndices,
      sentenceIndices: sentenceIndices,
      sentenceAudioIds: sentenceAudioIds
    }

    this.recordingService.update(this.story.activeRecording, trackData).subscribe(res => {
      this.recordingSaved = true;
    });
  }
  
  //--- UI Manipulation ---//

  isRecording(section: Section, index: number) {
    if (section instanceof Sentence) {
      return this.isRecordingSentence[index];
    } else if (section instanceof Paragraph) {
      return this.isRecordingParagraph[index];
    }
  }

  isSentenceMode() {
    return this.chosenSections[0] instanceof Sentence;
  }

  isParagraphMode() {
    return this.chosenSections[0] instanceof Paragraph;
  }

  // toggle paragraph / sentence mode
  changeSections(sections) {
    this.chosenSections = sections;
    const allSections = this.paragraphs.concat(this.sentences);
    allSections.forEach(section => this.stopSection(section));
    if (this.isSentenceMode()) {
      this.sectionAudioSources = this.sentenceAudioSources;
      this.sectionBlobs = this.sentenceBlobs;
      this.sectionChunks = this.sentenceChunks;
      this.isRecordingSection = this.isRecordingSentence;
    } else if (this.isParagraphMode()) {
      this.sectionAudioSources = this.paragraphAudioSources;
      this.sectionBlobs = this.paragraphBlobs;
      this.sectionChunks = this.paragraphChunks;
      this.isRecordingSection = this.isRecordingParagraph;
    }
  }

  playSection(section: Section) {
    section.play();
    section.highlight();
  }

  stopSection(section) {
    section.stop();
    section.removeHighlight();
  }

  showModal() {
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
    this.modalChoice.next(false);
  }

  setModalChoice() {
    this.modalChoice.next(true);
  }

  saveModal() {
    this.saveRecordings();
    this.modalChoice.next(true);
  }
  
  goToDashboard() {
    this.router.navigateByUrl('/dashboard/' + this.story._id);
  }
}
