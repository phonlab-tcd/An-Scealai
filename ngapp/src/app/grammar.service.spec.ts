import { flushMicrotasks, TestBed, ComponentFixture } from '@angular/core/testing';
import { GrammarService } from './grammar.service';
import { StoryService } from 'src/app/story.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { tick, fakeAsync, waitForAsync, async} from '@angular/core/testing';

describe('GrammarService', () => {
  let service: GrammarService;
  let storyService: StoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(GrammarService);
    storyService = TestBed.inject(StoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly get grammar tags in English and Irish', (done: DoneFn) => {
    const story = new Story();
    story.text = 'Dia dhuit';
    service
      .updateStoryAndGetGrammarTagsAsHighlightTags(story)
      .subscribe((tags) => {
        expect(tags.savedStory).toBe(false);
        done();
      },
      done.fail);
  });
});
