import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentGroupComponent } from './consent-group.component';

describe('ConsentGroupComponent', () => {
  let component: ConsentGroupComponent;
  let fixture: ComponentFixture<ConsentGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
