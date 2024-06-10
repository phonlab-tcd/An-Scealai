import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BatMirialtaDrawerComponent } from './batmirialta-drawer.component';

describe('BatMirialtaDrawerComponent', () => {
  let component: BatmirialtaDrawerComponent;
  let fixture: ComponentFixture<BatmirialtaDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ BatMirialtaDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatMirialtaDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
