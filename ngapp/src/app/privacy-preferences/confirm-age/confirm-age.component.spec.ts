import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAgeComponent } from './confirm-age.component';

describe('ConfirmAgeComponent', () => {
  let component: ConfirmAgeComponent;
  let fixture: ComponentFixture<ConfirmAgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmAgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
