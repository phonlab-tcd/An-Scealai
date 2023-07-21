import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisDrawerComponent } from './synthesis-drawer.component';

describe('SynthesisDrawerComponent', () => {
  let component: SynthesisDrawerComponent;
  let fixture: ComponentFixture<SynthesisDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynthesisDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynthesisDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
