import Quill from 'quill';
import { TranslationService } from 'app/core/services/translation.service';
import { EngagementService } from 'app/core/services/engagement.service'
import { HighlightDirective } from 'app/core/directives/highlight.directive';
import { start } from 'repl';

// This is required to top quill from adding "Visit link:" before our text
export const tooltipClassname = "custom-tooltip";

const Parchment = Quill.import('parchment');
const Tooltip = Quill.import('ui/tooltip');

Quill.register(
    new Parchment.Attributor.Attribute(
        'highlight-tag',
        'highlight-tag',
        {scope: Parchment.Scope.INLINE}
    )
);

Quill.register(
  new Parchment.Attributor.Attribute(
      'id',
      'id',
      {scope: Parchment.Scope.INLINE}
  )
);

type Span = {fromX: number, toX: number};

export function spansOverlap(a: Span, b: Span) {
  if (a.fromX >= b.toX || b.fromX >= a.toX) {
    return false;
  }
  return true;
}

export type HighlightTag = {
  messageGA: string;
  messageEN: string;
  nameEN: string;
  nameGA: string;
  color: string;
  fromX: number;
  toX: number;
}

type MessageRenderer = (ht: HighlightTag)=>string;

export class QuillHighlighter {
    quillEditor: Quill;
    mostRecentHoveredMessage: String = '';
    private ts: TranslationService;
    private engagement: EngagementService;
    private editorElement: HTMLElement;

    // all grammar messages for a merged highlight-tag, i.e. several highlight tags were overlapping and so got merged together into one, but the tooltip shows all messages
    private mergedGroupData: Map<string, HighlightTag[]> = new Map();

    // not necessarily the spans of any individual highlight-tag, but the span of a group of overlapping highlight tags
    private mergedGroupSpan: Map<string, {fromX: number, toX: number}> = new Map();
    private messageRenderer: MessageRenderer;
    private tooltip: typeof Tooltip;

    constructor(quillEditor: Quill, messageRenderer: MessageRenderer, engagement: EngagementService) {
        this.quillEditor = quillEditor;

        // only need to instantiate one tooltip, reuse it when hover on a new highlight
        this.tooltip = new Tooltip(quillEditor);

        // add "custom-tooltip" class so that Quil doesn't prepend with "View Link:" hyperlink text
        this.tooltip.root.classList.add(tooltipClassname);
        
        // this functionality (message rendering) has been deferred to user of this class for ease of testing and to separate concerns
        // TODO: it would make sense to revert to a more generic HighlightTag datastructure (fromX, toX, data), where data can be of any type or could be an template type specified by the user
        //        The best way to implement this might be to seperate out the location (fromX, toX) and the data so the addTag interface would become:
        //                             addTag(TagSpan, UserSpecifiedTagData)
        //                                                                                          and class usage would become:
        //                             new QuillHighlighter<UserSpecifiedTagData>(quillEditor, renderer, engagement);
        //                      etc...
        // hold a reference to message rendering function
        this.messageRenderer = messageRenderer;

        // TODO: QuillHighlighter should (optionally?) emit interesting data (which set of messages someone looked at and for how), and engagement business should be handled on the outside by the class user
        this.engagement = engagement;

        // TODO: assuming the underlying .ql-editor element never gets swapped out, but is that true?????
        this.editorElement = document.querySelector(".ql-editor");

        // start ql-document wide event listener, branch within event listener to see if tooltip should be rendered
        this.editorElement.addEventListener("mouseover",(event)=>{
          if (event.target instanceof Element){
            const id = event.target.getAttribute("id");
            if(id){
              const span = this.mergedGroupSpan.get(id);
              const data = this.mergedGroupData.get(id);
              if (span && data) {
                this.mouseOverTagElem(data,span);
              }
            } else {
              this.tooltip.hide();
            }
          }
        })
    }
    private onlyUnique(value, index, array){
      return array.map(x=>x.symbol).indexOf(value.symbol) === index;
    }
    // Add highlighting to error text (https://quilljs.com/docs/api/#formattext)
    private tagDataForRange(startIndex, endIndex) {
    
      let allMessages = [];
      const span = {fromX: startIndex, toX: endIndex};
      for (let i = startIndex; i <= endIndex; i++) {
        const format = this.quillEditor.getFormat(i);

        // id for group of messages
        const id = format["id"];
        if (id) {
          const messages = this.mergedGroupData.get(id);
          const existingSpan = this.mergedGroupSpan.get(id);
          if(spansOverlap(span, existingSpan)) {
            span.fromX = Math.min(span.fromX, existingSpan.fromX);
            span.toX = Math.max(span.toX, existingSpan.toX);
            console.log("overlap", span,existingSpan);
            allMessages = allMessages.concat(messages);
            i = span.toX;
          } else {
            console.log("no overlap", startIndex, endIndex, existingSpan);
          }
        }
      }
    
      const tags = allMessages.filter(x=>x).filter(this.onlyUnique);
      return { tags, span };
    }

    public addTag(tag: HighlightTag) {
      // find the overlapping highlight tags
      let range = this.tagDataForRange(tag.fromX, tag.toX);
      let highlightTagsSet = range.tags;
      let span = range.span;
      
      highlightTagsSet.push(tag)

      // collapse to unique tags by serializing, creating a Set, then deserializing
      // TODO: does this definitely work? What about objects {a: 1, b: 2} vs {b: 2, a: 1}???
      highlightTagsSet = Array.from(new Set(highlightTagsSet.map(o=>JSON.stringify(o)))).map(s=>JSON.parse(s));

      function alphabeticalSort(a,b) {
        if(a.nameGA < b.nameGA) return -1;
        return 1;
      }
      highlightTagsSet = highlightTagsSet.filter(x=>x).sort(alphabeticalSort);

      window["hts"] = highlightTagsSet;


       const id = crypto.randomUUID().toString();
       this.mergedGroupData.set(id, highlightTagsSet);
       console.log("setspan", id, span);
       this.mergedGroupSpan.set(id, span);

       console.log(span.fromX, span.toX - span.fromX);
       this.quillEditor.formatText(span.fromX, span.toX - span.fromX, {"highlight-tag": true, "id": id}, 'api');
       const tagElements = this.editorElement.querySelectorAll(`[id="${id}"]`);
       tagElements[0].classList.add("left-edge");
      //  Array.from(tagElements).slice(-1)[0].classList.add("right-edge");

      //  const tagElements = this.editorElement.querySelectorAll(`[id="${id}"`);
      //  if (tagElements.length === 0) {
      //   throw new Error("failed to find tag element for newly created highlight-tag");
      //  }
      //  tagElements.forEach(tagElement=>{
      //   if (tagElement["cleanup"]) {
      //    tagElement["cleanup"]();
      //   }
      //  });


        // TODO (memory optimization): create tooltips lazily with an id, delete using id instead of reference to dom node
        // const tooltip = new Tooltip(this.quillEditor);
        // tooltip.root.classList.add("custom-tooltip");

        // TODO (optimization): use just one 'mouseover' listener that finds data using tagData Map
        // const mouseover = () => {
          // this.mouseOverTagElem(highlightTagsSet, span);
        // }
      //  
        // const mouseout = () => {
          // tagElement.removeAttribute('data-selected');
          // this.tooltip.hide();
        // }
        // tagElements.forEach((tagElement)=>{
          // tagElement.addEventListener('mouseover', mouseover);
          // tagElement.addEventListener('mouseout', mouseout);
          // function cleanup(){
            // tagElement.removeEventListener('mouseover', mouseover);
            // tagElement.removeEventListener('mouseover', mouseout);
            // this.tooltip.hide();
          // }
          // tagElement["cleanup"] = cleanup;
        // });


    }
    
    /**
    * Apply css highlighting to given error tags
    * @param tags - array of tags to highlight
    */
    public show(tags: HighlightTag[]): void {
        for(const tag of tags) {
          setTimeout(()=>{
            this.addTag(tag);
          },0);
        }
        return;
    }

    /**
    * Remove css highlighting to input array of error tags
    * @param tags - array of tags to remove highlighting
    */
    public hide(tags: HighlightTag[]) {
        tags.forEach((tag) => {
          this.quillEditor.formatText(
            tag.fromX,
            (tag.toX - tag.fromX),
              {'highlight-tag': null,
              'background-color': '',
              'data-selected': null}
          );
        });
    
        document.querySelectorAll(`.${tooltipClassname}`).forEach(elem => elem.remove());
    }
    
    /**
    * Remove css highlighting from all error tags
    */
    public hideAll() {
      this.mergedGroupData = new Map();
      this.mergedGroupSpan = new Map();
      const tagElements = document.querySelectorAll('[data-selected]');
      this.quillEditor.formatText(
        0,
        Number.MAX_SAFE_INTEGER,
          {'highlight-tag': null,
          'background-color': '',
          'data-selected': null}
      );
      this.tooltip.hide()
    }

    /**
    * Set styling for tooltip
    * @param tag - error tag for applying tooltip
    * @param tagElement - html element associated with tag
    * @param tooltip - tooltip to be applied to tag
    */
    private mouseOverTagElem(tags: HighlightTag[], span: {fromX: number, toX: number}) {
        // tagElement.setAttribute('data-selected', '');
    
        // for some reason bounds aren't calculated correctly until someone scrolls
        const scrollTop = this.quillEditor.root.scrollTop;
        this.quillEditor.root.scroll({top: + scrollTop + 1});
        this.quillEditor.root.scroll({top: + scrollTop});
    
        const tooltipContents = this.makeTooltipContents(tags);
        this.tooltip.root.innerHTML = tooltipContents;
        this.mostRecentHoveredMessage = tooltipContents;
    
        this.tooltip.show();
        this.tooltip.position(this.quillEditor.getBounds(span.fromX, span.toX - span.fromX));
    
        let style = this.tooltip.root.getAttribute('style') || '';
        style = style + `
          font-size: medium;
          padding: 20px;
          -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
          -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
          box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
          border: 2px solid var(--scealai-med-brown);
          border-radius: 2px;
        `;
        this.tooltip.root.setAttribute('style', style);
    
        // Ensure that tooltip isn't cut off by the right edge of the editor
        const rightOverflow =
          (this.tooltip.root.offsetLeft + this.tooltip.root.offsetWidth) -
          this.quillEditor.root.offsetWidth;
    
        this.tooltip.root.style.left =
          (rightOverflow > 0) ?
          `${(this.tooltip.root.offsetLeft - rightOverflow) - 5}px` : // - 5px for right padding
          this.tooltip.root.style.left;
    
        // Ensure that tooltip isn't cut off by the left edge of the editor
        this.tooltip.root.style.left =
          (this.tooltip.root.offsetLeft < 0) ?
          `${(this.tooltip.root.offsetLeft - this.tooltip.root.offsetLeft) + 5}px` : // + 5px for left padding
          this.tooltip.root.style.left;
          
        // TODO: implement observable which emits interesting events (e.g. how long someone hovered on a message)
        // TODO: reenable engagement service
        // this.engagement.mouseOverGrammarSuggestionEvent(tag);
      }
      
    private makeTooltipContents(data: HighlightTag[]): string {

      // // TODO: sort the contents once before inserting into map?
      // function alphabeticalSort(a,b) {
      //   if(a.nameGA < b.nameGA) return -1;
      //   return 1;
      // }
      return data
        // .sort(alphabeticalSort)
        .map(this.messageRenderer)
        .join("<hr>");
    }
}

