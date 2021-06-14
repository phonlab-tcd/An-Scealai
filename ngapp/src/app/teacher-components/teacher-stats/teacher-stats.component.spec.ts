import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherStatsComponent } from './teacher-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeacherStatsComponent', () => {
  let component: TeacherStatsComponent;
  let fixture: ComponentFixture<TeacherStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ TeacherStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /*
  it('should calculate the total stats for the classroom', () => {
    let test = new Map([["ANAITHNID", [3]], ["COMHFHOCAL", [2]], ["GRAM", [1,0,1]]]);
    let test2 = new Map([["MOLADH", [3, 4]], ["COMHFHOCAL", [2]], ["URU", [1,2,3]]]);
    component.stats = [ {_id: null, classroomId: null, studentId: null, studentUsername: null, timeStamps: null, grammarErrors: test }, 
                        {_id: null, classroomId: null, studentId: null, studentUsername: null, timeStamps: null, grammarErrors: test2 } ];

    //component.totalStats = new Map();
    console.log("*****************************************************************************************************************************", component.stats);
    component.getStatsForClass()
    
    expect(component.graphValues).toBe([3,4,1,4,3]);
  });
  */
});
