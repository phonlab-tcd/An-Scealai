import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookStoryComponent } from './book-story.component';

describe('BookStoryComponent', () => {
  let component: BookStoryComponent;
  let fixture: ComponentFixture<BookStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
