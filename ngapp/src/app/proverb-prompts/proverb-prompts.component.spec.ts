import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProverbPromptsComponent } from './proverb-prompts.component';

describe('ProverbPromptsComponent', () => {
  let component: ProverbPromptsComponent;
  let fixture: ComponentFixture<ProverbPromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProverbPromptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProverbPromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
