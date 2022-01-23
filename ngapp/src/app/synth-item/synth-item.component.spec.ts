import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthItemComponent } from './synth-item.component';

describe('SynthItemComponent', () => {
  let component: SynthItemComponent;
  let fixture: ComponentFixture<SynthItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynthItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
