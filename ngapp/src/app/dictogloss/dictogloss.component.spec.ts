import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictoglossComponent } from './dictogloss.component';

describe('DictoglossComponent', () => {
  let component: DictoglossComponent;
  let fixture: ComponentFixture<DictoglossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictoglossComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictoglossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
