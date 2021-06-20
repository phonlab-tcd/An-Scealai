import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../story.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../translation.service';
import { SynthesisService, Paragraph, Sentence, Section } from '../../services/synthesis.service';

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
              private synthesis: SynthesisService) { }

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
    this.synthesisObserver = this.synthesis.abairAPIv2Synthesise('Dia is Muire duit');
    console.log(this.synthesisObserver);
    /*
    .subscribe(
      (data) => {
        console.log(`Observer got a next value [${count}]]: ` + data),
        count++;
        this.synthesisResponse += data;
      },
      (err) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );
   */
    console.log('end of synthesise function');
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
