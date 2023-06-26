import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomDrawerComponent } from './classroom-drawer.component';

describe('ClassroomDrawerComponent', () => {
  let component: ClassroomDrawerComponent;
  let fixture: ComponentFixture<ClassroomDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomDrawerComponent ]
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
