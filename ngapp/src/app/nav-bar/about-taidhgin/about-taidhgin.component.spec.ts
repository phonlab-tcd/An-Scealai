import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutTaidhginComponent } from './about-taidhgin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";

describe('AboutTaidhginComponent', () => {
  let component: AboutTaidhginComponent;
  let fixture: ComponentFixture<AboutTaidhginComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ AboutTaidhginComponent ],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
        ],
      })
      .compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTaidhginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
