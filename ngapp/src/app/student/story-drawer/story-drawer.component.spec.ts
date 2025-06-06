import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StoryDrawerComponent } from './story-drawer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterPipe } from '../../core/pipes/filter.pipe';

describe('StoryDrawerComponent', () => {
  let component: StoryDrawerComponent;
  let fixture: ComponentFixture<StoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule, HttpClientTestingModule ],
      declarations: [ StoryDrawerComponent, FilterPipe ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
