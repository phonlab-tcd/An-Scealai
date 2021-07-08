import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../story.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../translation.service';
import {
  SynthesisService,
  Paragraph,
  Sentence,
  Section,
  API_2_Audio_Encoding,
  API_2_Voice } from '../../services/synthesis.service';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.css']
})
export class SynthesisComponent implements OnInit {

  constructor(
    private storyService: StoryService,
    private route: ActivatedRoute,
    private router: Router,
    public ts: TranslationService,
    private synthesis: SynthesisService) { }

  storyId: string;
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  chosenSections: Section[];
  audioFinishedLoading = false;
  audioElems: HTMLAudioElement[][];

  formats: any[];
  voices: any[];


  text(i: number) {
    return '' + i + ' ' + 2 * i;
  }

  async ngOnInit() {
    this.audioElems = new Array(this.synthesis.api2encodings.length);
    for (let f = 0; f < this.audioElems.length; f++) {
      this.audioElems[f] = new Array(this.synthesis.api2voices.length);
      for (let v = 0; v < this.audioElems.length; v++) {
        this.audioElems[f][v] = new Audio(await this.synthesis.api2_synthesise_post({
             input: this.text(f * v),
             speed: 1,
             voice: this.synthesis.api2voices[v] as API_2_Voice,
             audioEncoding: this.synthesis.api2encodings[f] as API_2_Audio_Encoding,
           }).toPromise());

      }
    }
    /*
    console.log('ngOnInit, synthesis_component');
    this.audioElems = new Array(10);
    for (let i = 0; i < this.audioElems.length; i++ ) {
        console.log('hello', i);
        const input = this.text(i);
        this.synthesis
            .api2_synthesise_post({
              input,
              speed: null,
              voice: (this.synthesis.dialectToVoice('connemara') as API_2_Voice),
              audioEncoding: ('MP3' as API_2_Audio_Encoding)})
            .subscribe(
              (url) => {
                this.audioElems[i] = new Audio(url); },
              (err) => {
                  console.count('err');
                  console.dir(err);
              },
              () => {
                console.count('complete');
              });
    }
    */

    this.storyId = this.route.snapshot.paramMap.get('id');
    this.storyService.getStory(this.storyId).subscribe((story) => {
      this.synthesis.synthesiseStory(story).then(([paragraphs, sentences]) => {
        this.paragraphs = paragraphs;
        this.sentences = sentences;
        this.chosenSections = this.paragraphs;
        this.audioFinishedLoading = true;
      });
    });
  }

  // Play or pause audioElem[i] depending on audioElem[i].pause state (play if paused, pause if playing)
  audioClick(f: number, v: number) {
    console.dir(this.audioElems);
    console.log('play:[' + f + '][' + v + ']');
    console.dir(this.audioElems[f][v]);
    if ( !(this.audioElems[f][v] instanceof Audio )) {
      return false;
    }
    if ( this.audioElems[f][v].paused ) {
      return this.audioElems[f][v].play();
    }
    return this.audioElems[f][v].pause();
  }

  // --- UI Manipulation --- //
  isSentenceMode() {
    return this.chosenSections[0] instanceof Sentence;
  }

  isParagraphMode() {
    return this.chosenSections[0] instanceof Paragraph;
  }

  changeSections(sections) {
    this.chosenSections = sections;
    const allSections = this.paragraphs.concat(this.sentences);
    allSections.forEach(section => this.stopSection(section));
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
    this.router.navigateByUrl('/dashboard/' + this.storyId);
  }
}
