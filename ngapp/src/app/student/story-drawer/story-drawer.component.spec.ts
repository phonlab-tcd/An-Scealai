import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDrawerComponent } from './story-drawer.component';

describe('StoryDrawerComponent', () => {
  let component: StoryDrawerComponent;
  let fixture: ComponentFixture<StoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
