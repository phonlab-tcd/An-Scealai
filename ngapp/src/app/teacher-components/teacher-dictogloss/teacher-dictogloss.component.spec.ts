import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDictoglossComponent } from './teacher-dictogloss.component';

describe('TeacherDictoglossComponent', () => {
  let component: TeacherDictoglossComponent;
  let fixture: ComponentFixture<TeacherDictoglossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherDictoglossComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherDictoglossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
