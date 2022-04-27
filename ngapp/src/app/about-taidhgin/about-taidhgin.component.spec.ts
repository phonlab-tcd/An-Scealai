import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AboutTaidhginComponent } from './about-taidhgin.component';
import { TranslationService } from '../translation.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AboutTaidhginComponent', () => {
  let component: AboutTaidhginComponent;
  let fixture: ComponentFixture<AboutTaidhginComponent>;
  beforeEach(()=>{
    TestBed.configureTestingModule({
      declarations: [ AboutTaidhginComponent ],
      providers: [ TranslationService ],
      imports: [
        NgbModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    })
    .compileComponents();
    fixture = TestBed.createComponent(AboutTaidhginComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
