import Quill from 'quill';
import { TranslationService } from 'app/core/services/translation.service';
import { EngagementService } from 'app/core/services/engagement.service'

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
    private mergedGroupData: Map<string, HighlightTag[]> = new Map();
    private mergedGroupSpan: Map<string, {fromX: number, toX: number}> = new Map();
    private messageRenderer: MessageRenderer;
    private tooltip;

    constructor(quillEditor: Quill, messageRenderer: MessageRenderer, engagement: EngagementService) {
        this.quillEditor = quillEditor;
        this.tooltip = new Tooltip(quillEditor);
        this.tooltip.root.classList.add(tooltipClassname);
        this.messageRenderer = messageRenderer;
        this.engagement = engagement;
        this.editorElement = document.querySelector(".ql-editor");
        this.editorElement.addEventListener("mouseover",(event)=>{
          if (event.target instanceof Element){
            const id = event.target.getAttribute("id");
            if(id){
              console.log(id.toString());
              console.log(id);
              const span = this.mergedGroupSpan.get(id);
              const data = this.mergedGroupData.get(id);
              if (span && data) {
                this.mouseOverTagElem(data,span);
              }
            } else {
              this.tooltip.hide();
            }
          }
          // console.log(event.target);
        })
    }
    private onlyUnique(value, index, array){
      return array.map(x=>x.symbol).indexOf(value.symbol) === index;
    }
    // Add highlighting to error text (https://quilljs.com/docs/api/#formattext)
    private tagDataForRange(startIndex, endIndex) {
    
      let allMessages = [];
      for (let i = startIndex + 1; i <= endIndex - 1; i++) {
        const format = this.quillEditor.getFormat(i);

        // group of messages id
        const id = format["id"];
        console.log("index:", i, id);
        if (id) {
          const messages = this.mergedGroupData.get(id);
          allMessages = allMessages.concat(messages);
        }
      }
    
      return allMessages.filter(x=>x).filter(this.onlyUnique);
    }

    public addTag(tag: HighlightTag) {
      // find the overlapping highlight tags
      let highlightTagsSet = this.tagDataForRange(tag.fromX, tag.toX);
      
      highlightTagsSet.push(tag)

      // collapse to unique tags by serializing, creating a Set, then deserializing
      highlightTagsSet = Array.from(new Set(highlightTagsSet.map(o=>JSON.stringify(o)))).map(s=>JSON.parse(s));


      highlightTagsSet = highlightTagsSet.filter(x=>x);

      window["hts"] = highlightTagsSet;

      const span = {fromX: tag.fromX, toX: tag.toX};
      highlightTagsSet.forEach(function(t) {
        if(t.fromX < span.fromX) {
          span.fromX = t.fromX;
        }
        if(t.toX   > span.toX)   {
          span.toX = t.toX;
        }
       });

       const id = crypto.randomUUID().toString();
       this.mergedGroupData.set(id, highlightTagsSet);
       this.mergedGroupSpan.set(id, span);

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
        console.log(tags);
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
        // this.engagement.mouseOverGrammarSuggestionEvent(tag);
      }
      
    private makeTooltipContents(data: HighlightTag[]): string {
      function alphabeticalSort(a,b) {
        if(a.nameGA < b.nameGA) return -1;
        return 1;
      }
      return data
        .sort(alphabeticalSort)
        .map(this.messageRenderer)
        .join("<hr>");
    }
}

