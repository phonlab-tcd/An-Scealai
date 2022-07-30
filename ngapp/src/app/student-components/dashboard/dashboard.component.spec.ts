import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SynthesisPlayerComponent } from '../synthesis-player/synthesis-player.component';
import { DashboardComponent } from './dashboard.component';
import { By } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';
import { TranslationService } from '../../translation.service';
import { Story } from 'app/story';

fdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const qm = QuillModule.forRoot();

  beforeEach(()=>TestBed
    .configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        qm,
        CommonModule,
        FormsModule,
      ],
      declarations: [ DashboardComponent, SynthesisPlayerComponent ],
      providers: [ TranslationService, ...qm.providers]
    })
    .compileComponents()
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.ts.initLanguage();
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

  it('should display the story\'s title', async ()=>{
    const title = 'title';
    component['story']=new Story();
    component['story'].title = 'title';
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('[data-cy=title]'));
    expect(titleEl.nativeElement.innerText).toEqual(title);
  });

  it('should display the story\'s text', async ()=>{
    const text = 'text';
    component['story']=new Story();
    component['story'].htmlText=text;
    fixture.detectChanges();
    await fixture.whenStable().then(()=>
      expect(component.quillEditor.getText().trim()).toBe(text));
  });
});
