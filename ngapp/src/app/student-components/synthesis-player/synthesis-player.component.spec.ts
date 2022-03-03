import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisPlayerComponent } from './synthesis-player.component';

describe('SynthesisPlayerComponent', () => {
  let component: SynthesisPlayerComponent;
  let fixture: ComponentFixture<SynthesisPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynthesisPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesisPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
