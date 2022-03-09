import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecideComponent } from './decide.component';

describe('DecideComponent', () => {
  let component: DecideComponent;
  let fixture: ComponentFixture<DecideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
