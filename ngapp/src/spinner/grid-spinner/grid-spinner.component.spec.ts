import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSpinnerComponent } from './grid-spinner.component';

describe('GridSpinnerComponent', () => {
  let component: GridSpinnerComponent;
  let fixture: ComponentFixture<GridSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
