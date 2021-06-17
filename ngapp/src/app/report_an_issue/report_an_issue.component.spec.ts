import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportAnIssueComponent } from './report_an_issue.component';

describe('SponsorsComponent', () => {
  let component: ReportAnIssueComponent;
  let fixture: ComponentFixture<ReportAnIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ RouterTestingModule, HttpClientTestingModule],
      declarations: [ ReportAnIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAnIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have access to the translation service', () => {
    expect(component.ts).toBeTruthy();
  });
});
