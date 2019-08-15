import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClassroomComponent } from './admin-classroom.component';

describe('AdminClassroomComponent', () => {
  let component: AdminClassroomComponent;
  let fixture: ComponentFixture<AdminClassroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClassroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
