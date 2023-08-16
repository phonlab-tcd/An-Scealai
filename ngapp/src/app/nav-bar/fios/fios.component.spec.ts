import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiosComponent } from './fios.component';

describe('FiosComponent', () => {
  let component: FiosComponent;
  let fixture: ComponentFixture<FiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
