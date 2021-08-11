import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureStatsComponent } from './feature-stats.component';

describe('FeatureStatsComponent', () => {
  let component: FeatureStatsComponent;
  let fixture: ComponentFixture<FeatureStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
