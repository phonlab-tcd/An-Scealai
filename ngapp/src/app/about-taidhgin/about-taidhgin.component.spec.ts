import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTaidhginComponent } from './about-taidhgin.component';

describe('AboutTaidhginComponent', () => {
  let component: AboutTaidhginComponent;
  let fixture: ComponentFixture<AboutTaidhginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutTaidhginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTaidhginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
