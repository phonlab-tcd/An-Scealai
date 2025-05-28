import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { StoryService } from "app/core/services/story.service";
import { MessageService } from "app/core/services/message.service";
import { EngagementService } from "./engagement.service";
import { EventType } from "app/core/models/event";

@Injectable({
  providedIn: "root",
})
export class RecordAudioService {
  constructor(
    protected sanitizer: DomSanitizer,
    private storyService: StoryService,
    private messageService: MessageService,
    private engagement: EngagementService
  ) {}

  audioSource: SafeUrl;
  recorder;
  stream;
  chunks;

  /* Set recording parameters and start recording */
  recordAudio() {
    this.chunks = [];
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
        this.startRecording();
        this.recorder.ondataavailable = (e) => {
          this.chunks.push(e.data);
          if (this.recorder.state == "inactive") {
          }
        };
      })
      .catch();
  }

  /* Reset chunks and start recorder */
  startRecording() {
    this.chunks = [];
    this.recorder.start();
  }

  /* Stop recorder */
  stopRecording(): boolean {
    this.recorder.stop();
    try {
      this.stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  }

  /* Get blob from recording and return as SafeUrl */
  playbackAudio(): SafeUrl {
    this.audioSource = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(new Blob(this.chunks, { type: "audio/mp3" }))
    );
    return this.audioSource;
  }

  /* Add the audio story fedback to the database */
  saveAudioFeedback(storyId: string): string {
    let blob = new Blob(this.chunks, { type: "audio/mp3" });
    let errorText = "";

    this.storyService.addFeedbackAudio(storyId, blob).subscribe(
      (res) => {
        console.log(res);
        if (this.recorder.state != "inactive") {
          this.recorder.stop();
          this.stream.getTracks().forEach((track) => track.stop());
        }
        this.chunks = [];
      },
      (err) => {
        errorText = err.message;
      }
    );
    return errorText;
  }

  getAudioBlob() {
    return new Blob(this.chunks, { type: "audio/mp3" });
  }

  saveAudioMessage(id: string) {
    let blob = new Blob(this.chunks, { type: "audio/mp3" });

    this.messageService.addMessageAudio(id, blob).subscribe(() => {
      if (this.recorder.state != "inactive") {
        this.recorder.stop();
        this.stream.getTracks().forEach((track) => track.stop());
      }
      this.chunks = [];
    });
  }

  async getAudioTranscription(): Promise<string | null> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // chunks needs some time to fully load?
    const blob = new Blob(this.chunks, { type: "audio/mp3" });
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    const transcription: string | null = await new Promise((resolve) => {
      /* stop recording stream and convert audio to base64 to send to ASR */
      reader.onloadend = async function () {
        const encodedAudio = (<string>reader.result).split(";base64,")[1]; // convert audio to base64
        // send audio to ASR
        const rec_req = {
          recogniseBlob: encodedAudio,
          developer: true,
          method: "online2bin",
        };
        await fetch("https://api.abair.ie/v3/recognition/recognise", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rec_req),
        })
          .then((response) => response.json())
          .then((data) => {
            let transcript = data["transcriptions"][0]["utterance"];
            const containsNaturalLanguage = /[a-zA-Z]/.test(transcript);
            if (!containsNaturalLanguage) transcript = null; // string may just contain \n and \r
            resolve(transcript);
          });
      };
    });
    if (transcription) this.engagement.addSpeakStoryEvent(transcription, blob);
    return transcription;
  }
}
