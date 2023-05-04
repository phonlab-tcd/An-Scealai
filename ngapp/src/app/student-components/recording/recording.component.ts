import { Component, OnInit } from "@angular/core";
import { TranslationService } from "../../translation.service";
import { StoryService } from "../../story.service";
import { RecordingService } from "../../recording.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Story } from "../../story";
import { Recording } from "../../recording";
import { SynthesisService, Paragraph, Sentence, Section, } from "../../services/synthesis.service";
import { EventType } from "../../event";
import { EngagementService } from "../../engagement.service";
import { firstValueFrom } from "rxjs";
import { requestMediaPermissions } from 'mic-check';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";

declare var MediaRecorder: any;

@Component({
  selector: "app-recording",
  templateUrl: "./recording.component.html",
  styleUrls: ["./recording.component.scss"],
})
export class RecordingComponent implements OnInit {
  constructor(
    private storyService: StoryService,
    public ts: TranslationService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private recordingService: RecordingService,
    private synthesis: SynthesisService,
    private engagement: EngagementService,
    private dialog: MatDialog
  ) {}

  // Synthesis variables
  story: Story = new Story();
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  chosenSections: Section[];

  // NOTE: 'section' variables are pointers to corresponding variables
  // for chosen section type (paragraph / sentence)
  recorder;
  stream;
  chunks;

  isRecordingParagraph: boolean[] = [];
  isRecordingSentence: boolean[] = [];
  isRecordingSection: boolean[] = [];

  paragraphAudioSources: SafeUrl[] = [];
  sentenceAudioSources: SafeUrl[] = [];
  sectionAudioSources: SafeUrl[] = [];

  paragraphBlobs: any[] = [];
  sentenceBlobs: any[] = [];
  sectionBlobs: any[] = [];

  paragraphChunks: { [key: number]: any[] } = [];
  sentenceChunks: { [key: number]: any[] } = [];
  sectionChunks: { [key: number]: any[] } = [];

  // UI variables
  recordingSaved: boolean = true;
  audioFinishedLoading: boolean = false;
  dialogRef: MatDialogRef<unknown>;

  // ASR variables
  url_ASR_API = "https://phoneticsrv3.lcs.tcd.ie/asr_api/recognise";
  sentenceTranscriptions: string[] = [];
  paragraphTranscriptions: string[] = [];
  sectionTranscriptions: string[] = [];
  isTranscribing: boolean[] = [false];

  // Archived recordings variables
  recordings: Recording[] = [];
  currentRecording: Recording = null;
  lastClickedRecordingId: string = "";

  /*
   * Get story form url params
   * If the story has any recordings, load them, otherwise create a new one
   */
  async ngOnInit() {
    this.chunks = [];
    this.sectionAudioSources = this.paragraphAudioSources;
    this.sectionBlobs = this.paragraphBlobs;
    this.sectionChunks = this.paragraphChunks;
    this.sectionTranscriptions = this.paragraphTranscriptions;
    this.isRecordingSection = this.isRecordingParagraph;

    const storyId = this.route.snapshot.paramMap.get("id");
    this.story = await firstValueFrom(this.storyService.getStory(storyId));

    // check if browser microphone allowed before loading recordings
    requestMediaPermissions({audio: true, video: false})
    .then(async () => {
      // load story recordings if they exist, otherwise create a new recording object
      this.story.activeRecording? this.loadRecordings() : this.createNewRecording();
    })
    .catch((err) => {
      // open dialog requesting microphone access if not allowed
      this.openMicRequestDialog();
    });


  }

  /**
   * Get all recording objects for the given story
   */
  async loadRecordings() {
    // get a list of all recordings for the story
    this.recordings = await firstValueFrom(
      this.recordingService.getRecordings(this.story._id)
    );
    this.recordings.sort((a, b) => (a.date > b.date ? -1 : 1));

    // filter out the recording from the list that is currently active (i.e. not archived)
    let activeRecording = this.recordings.filter((recording) => {
      return recording.archived === false;
    });
    // set this active recording as the current recording to view
    this.setCurrentRecording(activeRecording[0]);
  }

  /**
   * Set the current recording and call functions to load audio/synthesis
   * @param recording recording object to view
   */
  setCurrentRecording(recording: Recording) {
    this.currentRecording = recording;
    this.loadSynthesis(this.currentRecording.storyData);
    this.loadAudio(this.currentRecording);

    // set css for selecting a recording in the archive nav
    let id = this.currentRecording._id;
    let recordingElement = document.getElementById(id);
    if (recordingElement) {
      // remove css highlighting for currently highlighted recording (from archive)
      if (this.lastClickedRecordingId) {
        document
          .getElementById(this.lastClickedRecordingId)
          .classList.remove("clickedresultCard");
      }
      this.lastClickedRecordingId = id;
      // add css highlighting to the newly clicked recording
      recordingElement.classList.add("clickedresultCard");
    }
  }

  /**
   * Create a new recording object in the DB for the given story
   */
  async createNewRecording() {
    // create a new active recording with the story text
    const newRecording = await firstValueFrom( this.recordingService.create(new Recording(this.story)) );

    // set this new recording as the story's current active recording
    this.story = await firstValueFrom( this.storyService.updateActiveRecording(this.story._id, newRecording._id) );

    // load the story's recordings (now just an array containing this new recording object)
    this.loadRecordings();
  }

  /**
   * Set the current recording's status to 'archived'
   * Call a function to create a new recording object
   */
  async archiveRecording() {
    await firstValueFrom( this.recordingService.updateArchiveStatus(this.currentRecording._id) );
    this.createNewRecording();
  }

  /**
   * Synthesie the story text of the given recording object
   * @param story story text to synthesise
   */
  loadSynthesis(story: Story) {
    this.synthesis.synthesiseStory(story).then(([paragraphs, sentences]) => {
      this.paragraphs = paragraphs;
      this.sentences = sentences;
      this.chosenSections = this.paragraphs;
      this.audioFinishedLoading = true;
    });
  }

  //--- Audio Control ---//
  // TODO: put recording/playback functions + audio variables in a service

  /**
   * Given some recording, gets audio data from the DB and saves it
   * in SafeUrl arrays to be displayed in <audio>s on the .html page
   * Also sets the transcription arrays based on the sentences that have audio
   *
   * @param recording - recording whose audio clips should be loaded
   */
  async loadAudio(recording: Recording) {
    this.audioFinishedLoading = false;
    this.paragraphAudioSources = [];
    this.paragraphTranscriptions = [];
    this.sentenceAudioSources = [];
    this.sentenceTranscriptions = [];
    this.sectionAudioSources = [];
    this.sectionTranscriptions = [];

    // load in paragraph audio and transcriptions
    for (let i = 0; i < recording.paragraphIndices.length; ++i) {
      let res = await firstValueFrom( this.recordingService.getAudio(recording.paragraphAudioIds[i]) );
      this.paragraphBlobs[i] = res;
      this.paragraphAudioSources[recording.paragraphIndices[i]] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      this.paragraphTranscriptions[recording.paragraphIndices[i]] = recording.paragraphTranscriptions[recording.paragraphIndices[i]];
    }

    // load in sentence audio and transcriptions
    for (let i = 0; i < recording.sentenceIndices.length; ++i) {
      let res = await firstValueFrom( this.recordingService.getAudio(recording.sentenceAudioIds[i]) );
      this.sentenceBlobs[i] = res;
      this.sentenceAudioSources[recording.sentenceIndices[i]] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      this.sentenceTranscriptions[recording.sentenceIndices[i]] = recording.sentenceTranscriptions[recording.sentenceIndices[i]];
    }

    // set the default section to paragraph data
    this.sectionTranscriptions = this.paragraphTranscriptions;
    this.sectionAudioSources = this.paragraphAudioSources;
  }

  /**
   * Given some chunksArray (either paragraphChunks or sentenceChunks) and a
   * sentence / paragraph index, populate that chunks array with audio data
   * recorded through microphone.
   * @param index - index for the paragraph / sentence being recorded
   * or sentenceChunks
   */
  recordAudio(index: number) {
    this.engagement.addEventForLoggedInUser(
      EventType["RECORD-STORY"],
      this.story
    );

    let media = {
      tag: "audio",
      type: "audio/mp3",
      ext: ".mp3",
      gUM: { audio: true },
    };
    navigator.mediaDevices
      .getUserMedia(media.gUM)
      .then((_stream) => {
        this.stream = _stream;
        this.recorder = new MediaRecorder(this.stream);
        this.sectionChunks[index] = [];
        this.recorder.start();
        this.isRecordingSection[index] = true;
        this.recorder.ondataavailable = (e) => {
          this.sectionChunks[index].push(e.data);
          if (this.recorder.state == "inactive") {
          }
        };
      })
      .catch();
  }

  /* stop recording stream and convert audio to base64 to send to ASR */
  stopRecording(index: number) {
    this.recorder.stop();
    this.isRecordingSection[index] = false;
    this.stream.getTracks().forEach((track) => track.stop());
    setTimeout(() => {
      const blob = new Blob(this.sectionChunks[index], { type: "audio/mp3" });
      this.sectionBlobs[index] = blob;
      this.sectionAudioSources[index] = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(blob)
      );
      this.recordingSaved = false;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        let encodedAudio = (<string>reader.result).split(";base64,")[1]; // convert audio to base64
        this.getTranscription(encodedAudio, index);
      }.bind(this);
    }, 500);
  }

  /* send audio to the ASR system and get transcription */
  getTranscription(audioData: string, index: number) {
    this.isTranscribing[index] = true;
    if (this.isParagraphMode()) {
      this.paragraphTranscriptions[index] = null;
    }
    if (this.isSentenceMode()) {
      this.sentenceTranscriptions[index] = null;
    }
    const rec_req = {
      recogniseBlob: audioData,
      developer: true,
    };

    fetch(this.url_ASR_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rec_req),
    })
      .then((response) => response.json())
      .then((data) => {
        let transcription = data["transcriptions"][0]["utterance"];

        if (this.isParagraphMode()) {
          this.paragraphTranscriptions[index] = transcription;
          this.sectionTranscriptions[index] =
            this.paragraphTranscriptions[index];
        } else if (this.isSentenceMode()) {
          this.sentenceTranscriptions[index] = transcription;
          this.sectionTranscriptions[index] =
            this.sentenceTranscriptions[index];
        }
        this.isTranscribing[index] = false;
      });
  }

  /**
   * Delete any recording made for the given paragraph or sentence
   * @param index index of paragraph or sentence
   */
  deleteRecording(index: number) {
    this.recordingSaved = false;
    delete this.sectionAudioSources[index];
    delete this.sectionChunks[index];
    delete this.sectionBlobs[index];
    delete this.sectionTranscriptions[index];
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
    // save paragraph audio
    const paragraph_promises = Object.entries(this.paragraphBlobs).map(
      async ([index, blob]) => {
        return this.recordingService
          .saveAudio(this.story._id, blob, index)
          .toPromise();
      }
    );

    // save sentence audio
    const sentence_promises = Object.entries(this.sentenceBlobs).map(
      async ([index, blob]) => {
        return this.recordingService
          .saveAudio(this.story._id, blob, index)
          .toPromise();
      }
    );

    const paragraphResponses = await Promise.all(paragraph_promises);
    const sentenceResponses = await Promise.all(sentence_promises);

    let paragraphIndices = [];
    let paragraphAudioIds = [];
    // set the paragraph indices to indicate which paragraphs have audio/transcriptions
    for (const res of paragraphResponses) {
      paragraphIndices.push(res.index);
      paragraphAudioIds.push(res.fileId);
    }

    let sentenceIndices = [];
    let sentenceAudioIds = [];
    // set the sentence indices to indicate which sentences have audio/transcriptions
    for (const res of sentenceResponses) {
      sentenceIndices.push(res.index);
      sentenceAudioIds.push(res.fileId);
    }

    // object containing the data for the updated indices
    const trackData = {
      paragraphAudioIds: paragraphAudioIds,
      paragraphIndices: paragraphIndices,
      paragraphTranscriptions: this.paragraphTranscriptions,
      sentenceIndices: sentenceIndices,
      sentenceAudioIds: sentenceAudioIds,
      sentenceTranscriptions: this.sentenceTranscriptions,
    };

    // update the recording object with the indices/audio files for the new data
    let updatedRecording = await firstValueFrom( this.recordingService.update(this.story.activeRecording, trackData) );

    // reload the current recording to display the updated audio/transcriptions
    if (updatedRecording) {
      this.recordingSaved = true;
      const currentRecordingIndex = this.recordings.indexOf(this.currentRecording);
      this.recordings.splice(currentRecordingIndex, 1, updatedRecording);
    } else {
      alert("Error while saving audio");
    }
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
    allSections.forEach((section) => this.stopSection(section));
    if (this.isSentenceMode()) {
      this.sectionAudioSources = this.sentenceAudioSources;
      this.sectionBlobs = this.sentenceBlobs;
      this.sectionChunks = this.sentenceChunks;
      this.sectionTranscriptions = this.sentenceTranscriptions;
      this.isRecordingSection = this.isRecordingSentence;
    } else if (this.isParagraphMode()) {
      this.sectionAudioSources = this.paragraphAudioSources;
      this.sectionBlobs = this.paragraphBlobs;
      this.sectionChunks = this.paragraphChunks;
      this.sectionTranscriptions = this.paragraphTranscriptions;
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

  goToDashboard() {
    this.router.navigateByUrl("/dashboard/" + this.story._id);
  }

  /**
   * Dialog for message telling user to unblock their microphone
   */
  openMicRequestDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.microphone_blocked,
        message: this.ts.l.page_requires_microphone,
        confirmText: this.ts.l.refresh,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });
    
    this.dialogRef.afterClosed().subscribe( async (res) => {
        this.dialogRef = undefined;
        console.log(res);
        if(res) {
          this.ngOnInit();
        }
        else this.goToDashboard();
      });
  }
}
