import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClassroomDrawerComponent } from './classroom-drawer.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('ClassroomDrawerComponent', () => {
  let component: ClassroomDrawerComponent;
  let fixture: ComponentFixture<ClassroomDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomDrawerComponent ],
      imports: [ HttpClientTestingModule, MatDialogModule ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
