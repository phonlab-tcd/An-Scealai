import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { AddPromptDataComponent } from './add-prompt-data.component';

describe('AddContentComponent', () => {
  let component: AddContentComponent;
  let fixture: ComponentFixture<AddContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ AddContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
