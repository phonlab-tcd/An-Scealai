import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCountsComponent } from './word-counts.component';

describe('WordCountsComponent', () => {
  let component: WordCountsComponent;
  let fixture: ComponentFixture<WordCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordCountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
