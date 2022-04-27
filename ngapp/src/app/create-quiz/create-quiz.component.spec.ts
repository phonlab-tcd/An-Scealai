import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateQuizComponent } from './create-quiz.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateQuizComponent', () => {
  let component: CreateQuizComponent;
  let fixture: ComponentFixture<CreateQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuizComponent ],
      imports: [
        NgbModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    })
    .compileComponents();
    fixture = TestBed.createComponent(CreateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
