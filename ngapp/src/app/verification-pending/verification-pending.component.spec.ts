import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPendingComponent } from './verification-pending.component';

describe('VerificationPendingComponent', () => {
  let component: VerificationPendingComponent;
  let fixture: ComponentFixture<VerificationPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
