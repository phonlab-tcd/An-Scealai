import {HttpClientTestingModule} from "@angular/common/http/testing";
import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import {AppComponent} from "../app.component";

import { QuillHighlightService } from './quill-highlight.service';

describe('QuillHighlightService', () => {
  let qh: QuillHighlightService;
  let quillEditor: Quill = new Quill('quillEditor');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
    qh = TestBed.inject(QuillHighlightService);
  });

  it('should be created', () => {
    expect(qh).toBeTruthy();
    console.dir(quillEditor);
  });
});
