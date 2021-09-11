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

  constructor(private storyService: StoryService, private route: ActivatedRoute,
              private router: Router, public ts : TranslationService,
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

  changeSections(sections: any) {
    this.chosenSections = sections;
    const allSections = this.paragraphs.concat(this.sentences);
    allSections.forEach(section => this.stopSection(section));
  }

  playSection(section: Section) {
    section.play();
    section.highlight();
  }

  stopSection(section: any) {
    section.stop();
    section.removeHighlight();
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard/' + this.storyId);
  }
}
