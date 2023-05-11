import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDataTableComponent } from './pos-data-table.component';

describe('PosDataTableComponent', () => {
  let component: PosDataTableComponent;
  let fixture: ComponentFixture<PosDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
