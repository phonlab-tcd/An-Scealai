import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictglossComponent } from './dictgloss.component';

describe('DictglossComponent', () => {
  let component: DictglossComponent;
  let fixture: ComponentFixture<DictglossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictglossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DictglossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
