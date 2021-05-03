import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../story.service';
import { Story } from '../../story';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EventType } from '../../event';
import { EngagementService } from '../../engagement.service';
import { TranslationService } from '../../translation.service';
import { SynthesisService, Paragraph, Sentence, Section } from '../../services/synthesis.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.css']
})
export class SynthesisComponent implements OnInit {

  constructor(private storyService: StoryService, private route: ActivatedRoute,
              private router: Router, private sanitizer: DomSanitizer,
              private engagement: EngagementService, public ts : TranslationService,
              private synthesis: SynthesisService) { }
 
  storyId: string;
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  chosenSections: Section[];
  audioFinishedLoading: boolean = false;

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
  }

  //--- UI Manipulation ---//

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