import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BookContentsComponent } from './book-contents.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BookContentsComponent', () => {
  let component: BookContentsComponent;
  let fixture: ComponentFixture<BookContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ BookContentsComponent ]
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
  
  it('toggleDeleteMode() should change deleteMode to true then false', () => {
    component.deleteMode = false;
    component.toggleDeleteMode();
    expect(component.deleteMode).toBe(true, 'on after click');
    component.toggleDeleteMode();
    expect(component.deleteMode).toBe(false, 'off after second click');
  });
});
