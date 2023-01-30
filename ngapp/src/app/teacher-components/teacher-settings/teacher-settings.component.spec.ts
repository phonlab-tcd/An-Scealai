import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSettingsComponent } from './teacher-settings.component';

describe('TeacherSettingsComponent', () => {
  let component: TeacherSettingsComponent;
  let fixture: ComponentFixture<TeacherSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
