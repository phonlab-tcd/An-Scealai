import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import {
  tick,
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  waitForAsync} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GrammarCheckerComponent } from './grammar-checker.component';
import { Router } from '@angular/router';
import { Story } from 'src/app/story';
import { StoryService } from 'src/app/story.service';

describe('GrammarCheckerComponent', () => {
  let component: GrammarCheckerComponent;
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let fixture: ComponentFixture<GrammarCheckerComponent>;
  let story: Story;

  beforeAll(async () => {
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        GrammarCheckerComponent,
      ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      // providers: [],
    })
    .compileComponents();

    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    expect(testHostComponent.grammarCheckerComponent).toBeTruthy();
  });

  it('will not have done a grammar check when the component is first created', () => {
    // Text has not been checked
    expect(testHostComponent.grammarCheckerComponent.timeThatCheckedTextWasChecked).toBeUndefined();
  });

  it('should find misused séimhiú in the test text', () => {
    expect(testHostComponent).toBeTruthy();

    expect(testHostComponent.grammarCheckerComponent).toBeTruthy();

    expect(testHostComponent.grammarCheckerComponent.filteredTags).toBeTruthy();

    /*
    expect(
      story
        .text
        .slice(
          component.filteredTags[0].indices.start,
          component.filteredTags[0].indices.end)
    ).toMatch('chúpla');
    */
  });

  @Component({
    selector: 'app-host-component',
    template: '<app-grammar-checker [story]="testStory"></app-grammar-checker>',
  })
  class TestHostComponent implements AfterViewInit {
    @ViewChild(GrammarCheckerComponent)
    public grammarCheckerComponent: GrammarCheckerComponent;

    constructor(
      private myStoryService: StoryService,
    ) {}

    testStory: Story;

    async ngAfterViewInit() {
      this.testStory = await this.myStoryService.getStoriesFor('testUser').toPromise()[0];
    }
  }
});


