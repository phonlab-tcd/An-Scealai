import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingComponent } from './recording-contents.component';

describe('RecordingContentsComponent', () => {
  let component: RecordingComponent;
  let fixture: ComponentFixture<RecordingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
