import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BookContentsComponent } from './book-contents.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterPipe } from 'app/pipes/filter.pipe';

describe('BookContentsComponent', () => {
  let component: BookContentsComponent;
  let fixture: ComponentFixture<BookContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule],
      declarations: [ FilterPipe, BookContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
