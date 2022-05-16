import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordYourselfComponent } from './record-yourself.component';

describe('RecordYourselfComponent', () => {
  let component: RecordYourselfComponent;
  let fixture: ComponentFixture<RecordYourselfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordYourselfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordYourselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
