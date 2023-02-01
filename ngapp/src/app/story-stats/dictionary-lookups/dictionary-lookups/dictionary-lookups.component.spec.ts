import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DictionaryLookupsComponent } from './dictionary-lookups.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DictionaryLookupsComponent', () => {
  let component: DictionaryLookupsComponent;
  let fixture: ComponentFixture<DictionaryLookupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictionaryLookupsComponent ],
      imports: [HttpClientTestingModule], 
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictionaryLookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
