import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisSnapshotComponent } from './synthesis-snapshot.component';

describe('SynthesisSnapshotComponent', () => {
  let component: SynthesisSnapshotComponent;
  let fixture: ComponentFixture<SynthesisSnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynthesisSnapshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesisSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
