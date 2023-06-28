import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuillEditorComponent } from 'ngx-quill';
// import { expect, describe, fdescribe, beforeEach, it, fit } from "jasmine-core";
import * as qh from "./quill-highlight";
import Quill from 'quill';
import { ErrorTag, ErrorType } from '../grammar-engine/types';

const errorTagRest = {
  errorText: '',
  messageGA: '',
  messageEN: '',
  context: '',
  nameEN: '',
  nameGA: '',
  color: '',
  type: 'GAELSPELL' as ErrorType,
};

function i() {
  return crypto.randomUUID();
}

function mkTag(f,t): ErrorTag {
  return {
    fromX: f,
    toX: t,
    id: i(),
    ...errorTagRest,
  }
}

// trigger a mouseover event that bubbles up to parent elements
function bubblingMouseover(el: Element) {
    el.dispatchEvent(new MouseEvent("mouseover", {bubbles: true}));
}

fdescribe('QuillEditorComponent', () => {
  let component: QuillEditorComponent;
  let fixture: ComponentFixture<QuillEditorComponent>;
  let quillEditor: Quill;


  // helper test functions
  let visibleTooltips: Function;
  let visibleTooltip: Function;
  let anyTooltip: Function;
  let allTooltips: Function;
  let countAllTooltips: Function;
  let lastHighlightElement: Function;
  let numberOfTagGroups: Function;


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

    visibleTooltips = function() {
       return component
        .elementRef
        .nativeElement
        .querySelectorAll(".custom-tooltip:not(.ql-hidden)");
    }

    visibleTooltip = function() {
       return component
        .elementRef
        .nativeElement
        .querySelector(".custom-tooltip:not(.ql-hidden)");

    }

    allTooltips = function() {
       return component
        .elementRef
        .nativeElement
        .querySelectorAll(".custom-tooltip");
    }
    
    anyTooltip = function() {
       return component
        .elementRef
        .nativeElement
        .querySelector(".custom-tooltip");
    }

    countAllTooltips = function(){ 
        return allTooltips().length;
    }

    lastHighlightElement = function(){ 
        const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");
        return Array.from(spans).slice(-1)[0];
    }

    numberOfTagGroups = function () {
        const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");
        const uniqueIds = Array.from(new Set(Array.from(spans).map((span: any)=>span.getAttribute("id")))) 
        return uniqueIds.length;
    }

  }));

  it("adjacent spans are not overlapping",()=>{
    expect(qh.spansOverlap({fromX: 0, toX: 1},{fromX: 1, toX: 2})).toBeFalsy();
  });

  it("knows if two spans are overlapping",()=>{
    expect(qh.spansOverlap({fromX: 0, toX: 1},{fromX: 1, toX: 2})).toBeFalsy();
    expect(qh.spansOverlap({fromX: 0, toX: 5},{fromX: 1, toX: 2})).toBeTruthy();
    expect(qh.spansOverlap({fromX: 3, toX: 5},{fromX: 0, toX: 6})).toBeTruthy();
    expect(qh.spansOverlap({fromX: 3, toX: 5},{fromX: 0, toX: 1})).toBeFalsy();

  })

  // adversarial examples
  xit("handles misformed input reasonably", ()=>{
   expect(qh.spansOverlap({fromX: 10, toX: 5},{fromX: 9, toX: 12})).toBeTruthy();
  })

  it('should create the Quill editor', () => {
    expect(component).toBeTruthy();
  });

  it("should only have one visible tooltip when multiple grammar tags exist, and when mouseover is triggered on many",fakeAsync(()=>{
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const highlighter = new qh.QuillHighlighter(component.quillEditor, ()=>{
        return renderText;
    }, {} as any );
    highlighter.addTag({fromX: 10, toX: 20} as any);
    highlighter.addTag({fromX: 25, toX: 35} as any);

    const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");

    const lastSpan: HTMLElement = Array.from(spans).slice(-1)[0]as any;
    expect(spans[0].dispatchEvent);
    expect(lastSpan.dispatchEvent);
    for (const span of spans) {
        bubblingMouseover(span);
    }
    const tooltips = visibleTooltips();
    expect(tooltips.length).toBe(1);

  }));

  it("should remove all highlighting and tooltips with hideAll",fakeAsync(()=>{
    // GIVEN a quill editor with some text and segment of text colored red
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');


    // GIVEN a new QuillHighlighter instance with simple renderer
    const renderText = "text in tooltip";
    const highlighter = new qh.QuillHighlighter(component.quillEditor, ()=>{
        return renderText;
    }, {} as any );


    // WHEN we add two tags,  and then hideAll
    highlighter.addTag({fromX: 10, toX: 20} as any);
    highlighter.addTag({fromX: 25, toX: 35} as any);
    highlighter.hideAll();

    const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");

    const lastSpan: HTMLElement = Array.from(spans).slice(-1)[0]as any;
    for (const span of spans) {
        bubblingMouseover(span);
    }
    const tooltips = visibleTooltips();
    expect(tooltips.length).toBe(0);

  }));

  it("should render tooltip when mouseover event fires on last highlight-tag",fakeAsync(()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const highlighter = new qh.QuillHighlighter(component.quillEditor, ()=>{
        return renderText;
    }, {} as any );
    highlighter.addTag({fromX: 10, toX: 20} as any);
    // highlighter.addTag({fromX: 15, toX: 25} as any);

    const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");

    const lastSpan: HTMLElement = Array.from(spans).slice(-1)[0] as any;
    bubblingMouseover(lastSpan);
    const tooltipEl = visibleTooltips()[0];
    
    expect(tooltipEl).toBeTruthy();
    expect(tooltipEl.innerText).toBe(renderText);
  }));

  it("should merge overlapping highlights (minimum overlap)",fakeAsync(()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("012345678901234567890123456789\n0123456789\n0123456789\n");
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const highlighter = new qh.QuillHighlighter(component.quillEditor, ()=>{
        return renderText;
    }, {} as any );
    highlighter.addTag({fromX: 9,  toX: 11} as any);
    highlighter.addTag({fromX: 10, toX: 20} as any);
    highlighter.addTag({fromX: 19, toX: 25} as any);

    expect(numberOfTagGroups()).toBe(1);
  }));

  it("should NOT merge adjacent highlights",fakeAsync(()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const highlighter = new qh.QuillHighlighter(component.quillEditor, ()=>{
        return renderText;
    }, {} as any );
    highlighter.addTag({fromX: 7, toX: 8} as any);
    highlighter.addTag({fromX: 10, toX: 25} as any);
    highlighter.addTag({fromX: 25, toX: 40} as any);
    highlighter.addTag({fromX: 40, toX: 41} as any);
    highlighter.addTag({fromX: 41, toX: 42} as any);

    const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");

    const lastSpan: HTMLElement = Array.from(spans).slice(-1)[0] as any;
    bubblingMouseover(lastSpan);
    const tooltips = allTooltips();
    expect(numberOfTagGroups()).toBe(5);
  }));

  it("should merge overlapping highlights",fakeAsync(()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const highlighter = new qh.QuillHighlighter(component.quillEditor, ()=>{
        return renderText;
    }, {} as any );
    highlighter.addTag({fromX: 10, toX: 20} as any);
    highlighter.addTag({fromX: 19, toX: 25} as any);

    highlighter.addTag({fromX: 30, toX: 34} as any);
    highlighter.addTag({fromX: 35, toX: 38} as any);

    const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");

    const lastSpan: HTMLElement = Array.from(spans).slice(-1)[0] as any;
    bubblingMouseover(lastSpan);
    const tooltips = allTooltips();
    expect(numberOfTagGroups()).toBe(3);
  }));

  it("should merge subsumed highlights",fakeAsync(()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const highlighter = new qh.QuillHighlighter(component.quillEditor, ()=>{
        return renderText;
    }, {} as any );
    highlighter.addTag({fromX: 10, toX: 20} as any);
    highlighter.addTag({fromX: 12, toX: 18} as any);

    highlighter.addTag({fromX: 30, toX: 34} as any);
    highlighter.addTag({fromX: 28, toX: 36} as any);

    const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");
    
    expect(numberOfTagGroups()).toBe(2);
  }));

  it("remove one tag from a group of tags",fakeAsync(()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    // add some color to the text for an extra challenge
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const renderer = () => renderText;
    const highlighter = new qh.QuillHighlighter(component.quillEditor, renderer, {} as any );

    const t1 = mkTag(10,20);
    const t2 = mkTag(15,25);
    highlighter.addTag(t1);
    highlighter.addTag(t2);
    highlighter.removeTag(t2);

    expect(numberOfTagGroups()).toBe(1);
  }));

  it("should remove one tag from a group of densely overlapping tags",fakeAsync(async ()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    // add some color to the text for an extra challenge
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const renderer = () => renderText;
    const highlighter = new qh.QuillHighlighter(component.quillEditor, renderer, {} as any );

    const ErrorTag = {
      errorText: '',
      messageGA: '',
      messageEN: '',
      context: '',
      nameEN: '',
      nameGA: '',
      color: '',
      type: 'GAELSPELL' as ErrorType,
    };

    function i() {
      return crypto.randomUUID();
    }

    const t1 = mkTag(0,1);
    const t2 = mkTag(1,2);
    const t3 = mkTag(0,2);
    highlighter.addTag(t1);
    highlighter.addTag(t2);
    highlighter.addTag(t3);
    highlighter.removeTag(t3);

    expect(numberOfTagGroups()).toBe(2);
  }));

  it("should remove one tag from a group of densely overlapping tags",fakeAsync(async ()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    // add some color to the text for an extra challenge
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const renderer = () => renderText;
    const highlighter = new qh.QuillHighlighter(component.quillEditor, renderer, {} as any );

    const t1 = mkTag(0, 10);
    const t2 = mkTag(10,20);
    const t3 = mkTag(0, 20);
    highlighter.addTag(t1);
    highlighter.addTag(t2);
    highlighter.addTag(t3);
    highlighter.removeTag(t3);

    expect(numberOfTagGroups()).toBe(2);
  }));
});
