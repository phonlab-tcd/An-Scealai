import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProfileComponent } from './register-profile.component';

describe('RegisterProfileComponent', () => {
  let component: RegisterProfileComponent;
  let fixture: ComponentFixture<RegisterProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
