import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuillEditorComponent } from 'ngx-quill';
// import { expect, describe, fdescribe, beforeEach, it, fit } from "jasmine-core";
import * as qh from "./quill-highlight";
import Quill from 'quill';

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
    console.log(spans);
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
    console.log(spans);
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
    console.log(tooltipEl);
    
    expect(tooltipEl).toBeTruthy();
    expect(tooltipEl.innerText).toBe(renderText);
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
    highlighter.addTag({fromX: 15, toX: 25} as any);

    const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");

    const lastSpan: HTMLElement = Array.from(spans).slice(-1)[0] as any;
    bubblingMouseover(lastSpan);
    const tooltips = component.elementRef.nativeElement.querySelectorAll(".custom-tooltip")
    expect(tooltips.length).toBe(1);
  }));

  it("should NOT merge adjacent highlights",fakeAsync(()=>{
    // GIVEN quill editor with text on multiple lines
    quillEditor.setText("0123456789\n0123456789\n0123456789\n0123456789\n0123456789\n");
    component.quillEditor.formatText(16, 2, {"color": "red"}, 'api');

    const renderText = "text in tooltip";
    const highlighter = new qh.QuillHighlighter(component.quillEditor, ()=>{
        return renderText;
    }, {} as any );
    highlighter.addTag({fromX: 10, toX: 25} as any);
    highlighter.addTag({fromX: 25, toX: 40} as any);

    const spans = component.elementRef.nativeElement.querySelectorAll("[highlight-tag]");

    const lastSpan: HTMLElement = Array.from(spans).slice(-1)[0] as any;
    bubblingMouseover(lastSpan);
    const tooltips = allTooltips();
    expect(numberOfTagGroups()).toBe(2);
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

});
