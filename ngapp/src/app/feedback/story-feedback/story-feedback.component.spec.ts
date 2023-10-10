import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';

import { StoryFeedbackComponent } from './story-feedback.component';

describe('StoryFeedbackComponent', () => {
  let component: StoryFeedbackComponent;
  let fixture: ComponentFixture<StoryFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryFeedbackComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: {} }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
