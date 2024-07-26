import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DigitalReaderStoryDrawerComponent } from './dr-story-drawer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterPipe } from '../../core/pipes/filter.pipe';

describe('DigitalReaderStoryDrawerComponent', () => {
  let component: DigitalReaderStoryDrawerComponent;
  let fixture: ComponentFixture<DigitalReaderStoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule, HttpClientTestingModule ],
      declarations: [ DigitalReaderStoryDrawerComponent, FilterPipe ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalReaderStoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
