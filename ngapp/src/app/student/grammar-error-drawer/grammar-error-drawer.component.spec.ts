import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarErrorDrawerComponent } from './grammar-error-drawer.component';

describe('GrammarErrorDrawerComponent', () => {
  let component: GrammarErrorDrawerComponent;
  let fixture: ComponentFixture<GrammarErrorDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrammarErrorDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarErrorDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
