import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictglossMessageComponent } from './dictgloss-message.component';

describe('DictglossMessageComponent', () => {
  let component: DictglossMessageComponent;
  let fixture: ComponentFixture<DictglossMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictglossMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DictglossMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
