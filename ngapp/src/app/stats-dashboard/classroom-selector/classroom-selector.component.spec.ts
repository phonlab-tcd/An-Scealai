import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomSelectorComponent } from './classroom-selector.component';

describe('ClassroomSelectorComponent', () => {
  let component: ClassroomSelectorComponent;
  let fixture: ComponentFixture<ClassroomSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
