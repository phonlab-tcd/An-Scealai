import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { stripGramadoirAttributesFromHtml } from './dashboard.component';
import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';
import { TranslationService } from '../../translation.service';
import { CommonModule } from '@angular/common';
import clone from 'lodash/clone';

const stripped = '<p><span>An shiopa</span></p>'
const withTags = '<p><span data-gramadoir-tag-style-type="PREFIXT" data-gramadoir-tag="{&quot;start&quot;:0,&quot;length&quot;:9,&quot;type&quot;:&quot;PREFIXT&quot;,&quot;tooltip&quot;:null,&quot;messages&quot;:{&quot;en&quot;:&quot;Prefix /t/ missing&quot;,&quot;ga&quot;:&quot;Réamhlitir ‘t’ ar iarraidh&quot;}}">An shiopa</span></p>'

describe('stripping gramadoir tags from html', ()=>{
  it('doesn\'t modify input text', ()=>{
    const withTagsClone = clone(withTags);
    stripGramadoirAttributesFromHtml(withTags);
    expect(withTagsClone).toEqual(withTags);
  });
  it('strips tags correctly', ()=>{
    expect(stripGramadoirAttributesFromHtml(withTags)).toEqual(stripped);
  });
  it('returns empty string for falsey and invalid inputs', ()=>{
    expect(stripGramadoirAttributesFromHtml(undefined)).toEqual('');
    expect(stripGramadoirAttributesFromHtml('')).toEqual('');
    expect(stripGramadoirAttributesFromHtml(0 as any)).toEqual('');
    expect(stripGramadoirAttributesFromHtml(1 as any)).toEqual('');
  });
});

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        QuillModule,
        CommonModule,
      ],
      declarations: [ DashboardComponent ],
      providers: [ TranslationService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not save story without user input', (done) => {
    setTimeout(
      ()=>{
        expect(component.saveStoryDebounceId).toBe(0)
        done()
      },300);
  });

  it('should have a title', ()=>{
    const title = fixture.debugElement.query(By.css('[data-cy=title]'));
    console.log(title.nativeElement.innerText);
    expect(title.nativeElement.innerText).toEqual('...');
  });

  xit('should display the story\'s title', async ()=>{
    const id = 1234;
    spyOn(component,'getStories').and
      .returnValue(Promise.resolve([{title: 'hello',_id: id,text:'text'}]));
    spyOn(component,'getStoryId').and
      .returnValue(Promise.resolve(id));
    await component.ngOnInit()
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('[data-cy=title]'));
    expect(title.nativeElement.innerText).toEqual('hello');
  });

  xit('should display the story\'s text', async ()=>{
    const id = 1234;
    spyOn(component,'getStories').and
      .returnValue(Promise.resolve([{
        title: 'hello',
        _id: id,
        htmlText:'sillytext',
        text:'sillytext',
      }]));
    spyOn(component,'getStoryId').and
      .returnValue(Promise.resolve(id));
    await component.ngOnInit()
    fixture.detectChanges();
    const editor = fixture.debugElement.query(By.css('div.ql-editor'));
    fixture.detectChanges();
    console.log(editor.nativeElement);
    expect(component.story.text).toBe('sillytext');
    expect(component.story.htmlText).toBe('sillytext');
    console.log(editor);
    expect(editor.nativeElement.innerText.trim()).toBe('sillytext');
  });
});
