import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescribeMessageListComponent } from './describe-message-list.component';

describe('DescribeMessageListComponent', () => {
  let component: DescribeMessageListComponent;
  let fixture: ComponentFixture<DescribeMessageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescribeMessageListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescribeMessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
