import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserGuidesComponent } from './user-guides.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserGuidesComponent', () => {
  let component: UserGuidesComponent;
  let fixture: ComponentFixture<UserGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGuidesComponent ],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
