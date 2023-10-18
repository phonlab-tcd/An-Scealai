import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeachersComponent } from './teachers.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog} from '@angular/material/dialog';

describe('TeachersComponent', () => {
  let component: TeachersComponent;
  let fixture: ComponentFixture<TeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ TeachersComponent ],
      providers: [
          { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
