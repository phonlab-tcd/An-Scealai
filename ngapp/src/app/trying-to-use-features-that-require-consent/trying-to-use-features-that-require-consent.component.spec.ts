import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TryingToUseFeaturesThatRequireConsentComponent } from './trying-to-use-features-that-require-consent.component';

describe('TryingToUseFeaturesThatRequireConsentComponent', () => {
  let component: TryingToUseFeaturesThatRequireConsentComponent;
  let fixture: ComponentFixture<TryingToUseFeaturesThatRequireConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TryingToUseFeaturesThatRequireConsentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TryingToUseFeaturesThatRequireConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
