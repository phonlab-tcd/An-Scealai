import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPreferencesComponent } from './privacy-preferences.component';

describe('PrivacyPreferencesComponent', () => {
  let component: PrivacyPreferencesComponent;
  let fixture: ComponentFixture<PrivacyPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPreferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
