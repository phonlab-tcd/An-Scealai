import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';

import { FeedbackCommentComponent } from './feedback-comment.component';

describe('FeedbackCommentComponent', () => {
  let component: FeedbackCommentComponent;
  let fixture: ComponentFixture<FeedbackCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackCommentComponent ],
      imports: [HttpClientTestingModule, MatMenuModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
