import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseStatsComponent } from './database-stats.component';

describe('DatabaseStatsComponent', () => {
  let component: DatabaseStatsComponent;
  let fixture: ComponentFixture<DatabaseStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});