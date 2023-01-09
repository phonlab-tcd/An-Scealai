import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgramDistributionComponent } from './ngram-distribution.component';

describe('NgramDistributionComponent', () => {
  let component: NgramDistributionComponent;
  let fixture: ComponentFixture<NgramDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgramDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgramDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
