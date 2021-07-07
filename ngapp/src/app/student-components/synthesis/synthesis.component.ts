import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../story.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../translation.service';
import {  SynthesisService,
          Paragraph,
          Sentence,
          Section,
          AbairAPIv2AudioEncoding,
          AbairAPIv2Voice,
        } from '../../services/synthesis.service';


import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.css']
})
export class SynthesisComponent implements OnInit {

  constructor(private storyService: StoryService,
              private route: ActivatedRoute,
              private router: Router,
              public ts: TranslationService,
              private synthesis: SynthesisService,
              private http: HttpClient) { }

  storyId: string;
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  chosenSections: Section[];
  audioFinishedLoading = false;

  synthesisResponse: {
    audioContent: string
  };

  synthesisObserver;

  ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id');
    this.storyService.getStory(this.storyId).subscribe((story) => {
      this.synthesis.synthesiseStory(story).then(([paragraphs, sentences]) => {
        this.paragraphs = paragraphs;
        this.sentences = sentences;
        this.chosenSections = this.paragraphs;
        this.audioFinishedLoading = true;
      });
    });

    this.synthesisResponse = {
      audioContent: 'Nothing fetched yet'
    };
  }

  // New Synthesis Functions API v2

  async synthesise() {
    const text = 'Dia is Muire duit';
    const uri = `https://www.abair.tcd.ie/api2/synthesise?input=${encodeURIComponent(text)}`;
    const abairGetResponse = this.http.get(uri,
      {
        observe: 'body',
    }).subscribe(
      data => console.log('GET Got data: ', data),
      error => console.error('GET Error: ', error),
      () => console.log('Completed GET request.')
    );

    const abairPutResponse = this.http.put(uri, {
      observe: 'body',
    }).subscribe(
      data => console.log('PUT Got data: ', data),
      error => console.error('PUT Error: ', error),
      () => console.log('Completed PUT request.')
    );

    console.log('GET: ', abairGetResponse);
    console.log('PUT: ', abairPutResponse);
  }

  // --- UI Manipulation ---//

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
