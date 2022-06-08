import { waitForAsync             } from '@angular/core/testing';
import { ComponentFixture         } from '@angular/core/testing';
import { TestBed                  } from '@angular/core/testing';
import { By                       } from '@angular/platform-browser';
import { HttpClientTestingModule  } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA         } from '@angular/core';
import { RouterTestingModule      } from '@angular/router/testing';
import { FindUserComponent        } from './find-user.component';
import { FilterPipe               } from '../../pipes/filter.pipe';
import { Observable               } from 'rxjs';

describe('FindUserComponent', () => {
  let component: FindUserComponent;
  let fixture: ComponentFixture<FindUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ FindUserComponent, FilterPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', ()=>{
    expect(component).toBeTruthy();
  });

  it('should fetch some users', async ()=>{
    component.searchText = '.';
    component.LIMIT = 3;
    const users = ['alice','mary','bob'].map(username=>{return {username}});
    (component as any).userService = {
      searchUser: ()=>new Observable(o=>{
        const count = users.length;
        o.next({users,count});
      })
    }
    component.searchUsers();
    await new Promise<void>((resolve,reject) => {
      setTimeout(()=>{
        fixture.detectChanges();
        expect(component.userResults.length).toBe(3);
        const userCards = fixture
          .debugElement
          .query(By.css('[data-cy=user-card-container]'))
          .children;
        expect(userCards[0].nativeElement.innerText).toEqual(users[0].username);
        expect(userCards.length).toBe(users.length);
        console.dir(userCards);
        resolve();
      },1);
    });
  });
});
