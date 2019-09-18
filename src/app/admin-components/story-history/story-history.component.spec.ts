import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryHistoryComponent } from './story-history.component';

describe('StoryHistoryComponent', () => {
  let component: StoryHistoryComponent;
  let fixture: ComponentFixture<StoryHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
