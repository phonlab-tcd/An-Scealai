import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarErrorTimeComponent } from './grammar-error-time.component';

describe('GrammarErrorTimeComponent', () => {
  let component: GrammarErrorTimeComponent;
  let fixture: ComponentFixture<GrammarErrorTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrammarErrorTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarErrorTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
