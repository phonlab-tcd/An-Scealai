import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuillEditorComponent } from 'ngx-quill';
import * as qh from "./quill-highlight";
import Quill from 'quill';

fdescribe('QuillEditorComponent', () => {
  let component: QuillEditorComponent;
  let fixture: ComponentFixture<QuillEditorComponent>;
  let quillEditor: Quill;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuillEditorComponent],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(QuillEditorComponent);
    component = fixture.componentInstance;
    component.theme = "snow";
    fixture.detectChanges();
    tick();
    fixture.whenStable().then(()=>{
        quillEditor = component.quillEditor;
    })

  }));

  it('should create the Quill editor', () => {
    expect(component).toBeTruthy();
  });

  it("should take a quill editor component to initialize",fakeAsync(()=>{
    quillEditor.setText("aaaaa bbbbb ccccc ddddd eeeeee ffffff gggggg hhhhhhh");
    component.quillEditor.formatText(0, 10, {"color": "red"}, 'api');

    const highlighter = new qh.QuillHighlighter(component.quillEditor, {} as any, {} as any );
    expect(highlighter);
    highlighter.addTag({fromX: 10, toX: 12, nameEN: "random tag", color: "#2390FF"} as any)
  }));

});
