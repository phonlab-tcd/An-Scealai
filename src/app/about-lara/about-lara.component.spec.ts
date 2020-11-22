import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutLaraComponent } from './about-lara.component';

describe('AboutLaraComponent', () => {
  let component: AboutLaraComponent;
  let fixture: ComponentFixture<AboutLaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutLaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutLaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
