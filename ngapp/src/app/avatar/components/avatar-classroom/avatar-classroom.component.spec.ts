import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarClassroomComponent } from './avatar-classroom.component';

describe('AvatarClassroomComponent', () => {
  let component: AvatarClassroomComponent;
  let fixture: ComponentFixture<AvatarClassroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarClassroomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
