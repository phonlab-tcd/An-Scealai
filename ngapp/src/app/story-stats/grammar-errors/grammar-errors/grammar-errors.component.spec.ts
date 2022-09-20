import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarErrorsComponent } from './grammar-errors.component';

describe('GrammarErrorsComponent', () => {
  let component: GrammarErrorsComponent;
  let fixture: ComponentFixture<GrammarErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrammarErrorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrammarErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
