import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDictglossComponent } from './teacher-dictgloss.component';

describe('TeacherDictglossComponent', () => {
  let component: TeacherDictglossComponent;
  let fixture: ComponentFixture<TeacherDictglossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherDictglossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherDictglossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
