import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BookContentsComponent } from './book-contents.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from '../../core/pipes/filter.pipe';
import { MatDialog } from '@angular/material/dialog';

describe('BookContentsComponent', () => {
  let component: BookContentsComponent;
  let fixture: ComponentFixture<BookContentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientModule],
      declarations: [ FilterPipe, BookContentsComponent ],
      providers: [
        { provide: MatDialog, useValue: {} }
    ]
    })
    .compileComponents();
  }));


  it('can\'t create without user details', waitForAsync(() => {
    spyOn(window, 'alert');
    let fixture = TestBed.createComponent(BookContentsComponent);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalled();
  }));
});
