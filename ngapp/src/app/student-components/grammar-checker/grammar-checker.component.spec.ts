import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GrammarCheckerComponent } from './grammar-checker.component';
import {Router} from '@angular/router';

describe('GrammarCheckerComponent', () => {
  let component: GrammarCheckerComponent;
  let fixture: ComponentFixture<GrammarCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrammarCheckerComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      // providers: [],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrammarCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
