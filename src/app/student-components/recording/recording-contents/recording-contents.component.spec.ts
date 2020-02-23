import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingContentsComponent } from './recording-contents.component';

describe('RecordingContentsComponent', () => {
  let component: RecordingContentsComponent;
  let fixture: ComponentFixture<RecordingContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
