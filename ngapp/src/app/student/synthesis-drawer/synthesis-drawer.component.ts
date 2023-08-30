import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { SynthVoiceSelectComponent } from "app/student/synth-voice-select/synth-voice-select.component";
import { Voice, VoiceCode, } from "app/core/services/synthesis.service";

@Component({
  selector: "app-synthesis-drawer",
  templateUrl: "./synthesis-drawer.component.html",
  styleUrls: ["./synthesis-drawer.component.scss"],
})
export class SynthesisDrawerComponent implements OnInit {
  @Output() closeSynthesisEmitter = new EventEmitter();
  @Output() selectedVoice = new EventEmitter<VoiceCode>();
  @Output() selectedSpeed = new EventEmitter<Number>();
  @ViewChild("voiceSelect") voiceSelect: ElementRef<SynthVoiceSelectComponent>;
  audioLoaded: boolean = true;
  audioSpeeds: number[] = [0.2, 0.5, 0.8, 1, 1.2, 1.5, 1.8, 2];
  audioSelectionIndex: number = 3;
  playbackSpeed: number = this.audioSpeeds[this.audioSelectionIndex];

  constructor(public ts: TranslationService) {}

  ngOnInit(): void {}

  /**
   * Send selected voice preference to dashboard for synthesis
   * @param voice voice selected from dropdown menu
   */
  setVoice(voice: Voice) {
    this.selectedVoice.emit(voice.code);
  }

  /**
   * Increase or decrease synthesis speed
   * @param incrementDirection +1 for increase, -1 for decrease
   */
  changeVoiceSpeed(incrementDirection: number) {
    if (incrementDirection > 0 && this.audioSelectionIndex < this.audioSpeeds.length - 1) {
      this.audioSelectionIndex++;
    }
    if (incrementDirection < 0 && this.audioSelectionIndex > 0) {
      this.audioSelectionIndex--;
    }
    this.playbackSpeed = this.audioSpeeds[this.audioSelectionIndex]
    this.selectedSpeed.emit(this.playbackSpeed)
  }

  synthesisUrl(input: string, voice: string) {
    const outputType = "JSON";
    const timing = "WORD";
    const params = new URLSearchParams({input, voice, outputType, timing});
    return `https://www.abair.ie/api2/synthesise?${params}` 
  }

  async fetch_cached(url: string) {
    const p = fetch(url).then(r=>r.json());
    return p;
  }


  test() {
    const stringsArray = ['string1', 'string2', 'string3'];
    this.sendApiCalls(stringsArray).catch((error) => {
      console.error('An error occurred:', error);
    });
  }

  async sendApiCalls(strings: string[]) {
    console.log("Starting api calls...")
    const apiCalls = strings.map(async (str) => {
      // Replace this with your actual API call logic
      const test = await this.makeApiCall(str);
      console.log(test)
      console.log(`API call for "${str}" completed`);
    });
  
    await Promise.all(apiCalls);
    console.log('All API calls completed: done');
  }
  
  async makeApiCall(data: string) {
    console.log(`Making API call for "${data}"`);
    // Simulating an API call delay with setTimeout
    return new Promise((resolve) => {
      console.log(`API call for "${data}" simulated`);
      const prevalid = this.fetch_cached(this.synthesisUrl(data, "ga_UL_anb_nemo"));
      resolve(prevalid);
      // setTimeout(() => {
      //   console.log(`API call for "${data}" simulated`);
      //   resolve(null);
      // }, 5000);
    });
  }


  test2() {
    const audioUrls = [
      'mo madra',
      'dia duit',
      'hello',
    ];
    
    // test 2
    // this.playAudioSequentiallyWithAPI(audioUrls).then(() => {
    //   console.log('All audio playback finished.');
    // })
    // .catch((error) => {
    //   console.error('Error during audio playback:', error);
    // });

    // test 3
    // this.playAudioSequentially(audioUrls).catch((error) => {
    //   console.error('Error during audio playback:', error);
    // });
  }

  async fetchAudioData(url: string): Promise<string> {
    const response = await this.fetch_cached(this.synthesisUrl(url, "ga_UL_anb_nemo"));
    return response.audioContent;
  }
  
  // TEST 2
  // async playAudioSequentiallyWithAPI(audioUrls: string[]) {
  //   const audioQueue: Promise<void>[] = [];
  
  //   for (const url of audioUrls) {
  //     const playPromise = new Promise<void>(async (resolve) => {
  //       try {
  //         const audioData = await this.fetchAudioData(url);
  //         //const audio = new Audio(audioData);
  //         const audio = new Audio(`data:audio/ogg;base64,${audioData}`);
  
  //         audio.onended = () => {
  //           console.log("audio finished playing")
  //           resolve(); // Resolve the Promise when audio playback ends
  //         };
  
  //         audio.play();
  //         console.log("playing audio")
  //       } catch (error) {
  //         console.error('Error fetching or playing audio:', error);
  //         resolve(); // Continue playback even if there's an error
  //       }
  //     });
  
  //     audioQueue.push(playPromise);
  //   }
  
  //   // Wait for all audio playback to finish
  //   await Promise.all(audioQueue);
  // }


  // TEST 3
  // async playAudioSequentially(audioUrls: string[], currentIndex: number = 0) {
  //   if (currentIndex >= audioUrls.length) {
  //     console.log('All audio playback finished.');
  //     return;
  //   }
  
  //   try {
  //     const audioData = await this.fetchAudioData(audioUrls[currentIndex]);
  //     const audio = new Audio(`data:audio/ogg;base64,${audioData}`);
  //     console.log("got audio response")
  
  //     await new Promise<void>((resolve) => {
  //       audio.onended = () => {
  //         resolve(); // Resolve the Promise when audio playback ends
  //       };
  
  //       audio.play();
  //     });
  
  //     // Play the next audio
  //     await this.playAudioSequentially(audioUrls, currentIndex + 1);
  //   } catch (error) {
  //     console.error('Error fetching or playing audio:', error);
  //     // Continue with the next audio even if there's an error
  //     await this.playAudioSequentially(audioUrls, currentIndex + 1);
  //   }
  // }



  //   private audioQueue: string[] = [];
  //   private isPlaying: boolean = false;
  
  
  //   async playAudio(url: string): Promise<void> {
  //     return new Promise<void>((resolve) => {
  //       const audio = new Audio(`data:audio/ogg;base64,${url}`);
  //       audio.onended = () => {
  //         this.isPlaying = false;
  //         this.playNext();
  //         resolve();
  //       };
  //       audio.play();
  //     });
  //   }
  
  // async fetchAudioData(url: string): Promise<string> {
  //   const response = await this.fetch_cached(this.synthesisUrl(url, "ga_UL_anb_nemo"));
  //   console.log("got api response")
  //   return response.audioContent;
  // }
  
  //   async processQueue(): Promise<void> {
  //     if (!this.isPlaying && this.audioQueue.length > 0) {
  //       this.isPlaying = true;
  //       const audioUrl = this.audioQueue.shift()!;
  //       console.log(audioUrl)
  //       const audioData = await this.fetchAudioData(audioUrl);
  //       await this.playAudio(audioData);
  //     }
  //   }
  
  //   enqueueAudio(url: string): void {
  //     this.audioQueue.push(url);
  //     this.processQueue();
  //   }
  
  //   playNext(): void {
  //     this.processQueue();
  //   }
  
  //   test4() {      
  //     const audioUrls: string[] = ["this is a relaly long sentence that will take time to synthesise", "mo madra", "a", "this is another really long response please finish getting the call before playing"]; // Replace with your audio URLs
      
  //     audioUrls.forEach((url) => {
  //       console.log(url)
  //       this.enqueueAudio(url);
  //     });

  //   }

    // async getAndPlayAudio() {
    //   const sentences = ["sentence1", "sentence2", "sentence3"]
    //   sentences.forEach(async (sentence) => {
    //     const audioData = await this.getAudio(sentence) // api call
    //     const audio = new Audio(`data:audio/ogg;base64,${audioData}`);
    //     audio.play()
    //   })
    // }

    // async getAudio(url) {
    //   const response = fetch(url).then(r=>r.json());
    //   return response;
    // }
    

    // async getAndPlayAudio() {
    //   for (const sentence of this.sentences) {
    //     this.playAudio(await this.getAudio(sentence));
    //   }
    // }

    test5() {
      this.getAndPlayAudio()

    }

    async getAndPlayAudio() {
      const sentences = ["this is a really long sentence", "sentence2", "sentence3", "this is a relly long sentence that should take a lot of time to synthesise"]
      for (const sentence of sentences) {
        this.playAudio(await this.getAudio(sentence));
      }
    }

    isPlaying: boolean = false;
    audioQueue: string[] = [];
  
    playAudio(audioData) {
      return new Promise(resolve => {      
        const audio = new Audio(`data:audio/ogg;base64,${audioData}`);
        audio.play();
          audio.onended = () => {
          console.log("audio finished playing")
          resolve(null);
        };
      });
    }
  
    async getAudio(url) {
      const audioData = await this.fetchAudioData(url);
      console.log("got audio data")
      return audioData;
    }


    async test6() {
      const sentences = ["sentence1", "my my my", "sentence3", "this is a relly long sentence that should take a lot of time to synthesise"]
      for (const sentence of sentences) {
        this.playOrQueueAudio(await this.getAudio(sentence));
      } 
    }

    playOrQueueAudio(audioData) {
      if (this.isPlaying) {
        this.audioQueue.push(audioData);
      }
      else {
        const audio = new Audio(`data:audio/ogg;base64,${audioData}`);
        audio.play();
        this.isPlaying = true;
          audio.onended = () => {
            this.isPlaying = false;
            console.log("audio finished playing");
            const nextAudio = this.audioQueue.shift();
            if (nextAudio) this.playOrQueueAudio(nextAudio)
        };
      }
    }

  



}
