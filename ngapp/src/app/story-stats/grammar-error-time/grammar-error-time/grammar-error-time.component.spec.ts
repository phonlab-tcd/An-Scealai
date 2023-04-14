import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GrammarErrorTimeComponent } from './grammar-error-time.component';

describe('GrammarErrorTimeComponent', () => {
  let component: GrammarErrorTimeComponent;
  let fixture: ComponentFixture<GrammarErrorTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrammarErrorTimeComponent ],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarErrorTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
