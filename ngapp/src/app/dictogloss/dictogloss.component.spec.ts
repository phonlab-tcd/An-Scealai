import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { DictoglossComponent } from './dictogloss.component';

describe('DictoglossComponent', () => {
  let component: DictoglossComponent;
  let fixture: ComponentFixture<DictoglossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictoglossComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: {} }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictoglossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
