import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMessageComponent } from './enter-message.component';

describe('EnterMessageComponent', () => {
  let component: EnterMessageComponent;
  let fixture: ComponentFixture<EnterMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
