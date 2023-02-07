import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherSettingsComponent } from './teacher-settings.component';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';

describe('TeacherSettingsComponent', () => {
  let component: TeacherSettingsComponent;
  let fixture: ComponentFixture<TeacherSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherSettingsComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule], 
      providers: [
          { provide: MatDialog, useValue: {} }
      ]
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
