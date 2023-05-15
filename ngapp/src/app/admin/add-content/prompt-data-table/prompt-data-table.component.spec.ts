import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptDataTableComponent } from './prompt-data-table.component';

describe('PromptDataTableComponent', () => {
  let component: PromptDataTableComponent;
  let fixture: ComponentFixture<PromptDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromptDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
