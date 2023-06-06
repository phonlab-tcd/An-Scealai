import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDrawerComponent } from './feedback-drawer.component';

describe('FeedbackDrawerComponent', () => {
  let component: FeedbackDrawerComponent;
  let fixture: ComponentFixture<FeedbackDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
