import Quill from 'quill';
import { TranslationService } from 'app/core/services/translation.service';
import { EngagementService } from 'app/core/services/engagement.service'
import {isEqual} from "lodash";
import { hi } from 'date-fns/locale';

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

type TagData = {
  messageGA: string;
  messageEN: string;
  nameEN: string;
  nameGA: string;
  color: string;
}

export type HighlightTag = {    
    data: TagData[];
    fromX: number;
    toX: number;
}

export class QuillHighlighter {
    quillEditor: Quill;
    mostRecentHoveredMessage: String = '';
    private ts: TranslationService;
    private engagement: EngagementService;
    private editorElement: HTMLElement;

    constructor(quillEditor: Quill, ts: TranslationService, engagement: EngagementService) {
        this.quillEditor = quillEditor;
        this.ts = ts;
        this.engagement = engagement;
        this.editorElement = document.querySelector(".ql-editor");
        window["quillEditor"] = this.quillEditor;
    }
    // Add highlighting to error text (https://quilljs.com/docs/api/#formattext)
    private getHighlightTagsForRange(startIndex, endIndex): Set<string> {
      const highlightTags = new Set<string>();
    
      for (let i = startIndex; i <= endIndex; i++) {
        const format = this.quillEditor.getFormat(i);
        console.log("GOT FORMAT:", format);
        const ht = format["highlight-tag"] as string;
        if (ht) {
          highlightTags.add(ht);
        }
      }
    
      return highlightTags;
    }

    public addTag(tag: HighlightTag) {

      // find the overlapping highlight tags
      const highlightTagsSet = this.getHighlightTagsForRange(tag.fromX -1, tag.toX +1);
      const highlightTags = Array.from(highlightTagsSet).map(function(s){ return JSON.parse(s) });
      console.log("Set:", highlightTagsSet)
      console.log("Parsed:", highlightTags);
      console.log("Stringified", JSON.stringify(highlightTags));
      let htdata = [];
      for (const tagArray of highlightTags) {
        htdata = htdata.concat(tagArray);
      }
      console.log("HTDATA", htdata);
      console.log("tag.data",tag.data);
      const tagDatas = [...htdata, ...tag.data].filter(x=>x);
      console.log("tagDatas", tagDatas);

      if (highlightTags.length > 0) {
        console.log("HIGHLIGHT TAGS ALREADY THERE:", highlightTags, tag, "JOINED:", tagDatas);
      }

      const span: HighlightTag = {fromX: tag.fromX, toX: tag.toX, data: tagDatas as any};
      htdata.forEach(function(t) {
        console.log("CHECKING T:",t)
        if(t.fromX < span.fromX) {
          console.log("LT", t,span);
          span.fromX = t.fromX;
        }
        if(t.toX   > span.toX)   {
          span.toX = t.toX;
        }
       });


       const id = crypto.randomUUID().toString();
       const s = JSON.stringify(tagDatas);
       console.log("STRINGIFIED:", s);
       console.log(id, span);
       this.quillEditor.formatText(span.fromX, span.toX - span.fromX, {}, 'api');
       this.quillEditor.formatText(span.fromX, span.toX - span.fromX, {"highlight-tag": s, "id": id}, 'api');

       const tagElement = this.editorElement.querySelector(`[id="${id}"`);
       if (!tagElement) {
        throw new Error("failed to find tag element for newly created highlight-tag");
       }

       const tooltip = new Tooltip(this.quillEditor);
       tooltip.root.classList.add('custom-tooltip');

       tagElement.addEventListener('mouseover', () => {
           this.mouseOverTagElem(span, tagElement, tooltip);
       });
       
       tagElement.addEventListener('mouseout', () => {
         tagElement.removeAttribute('data-selected');
         tooltip.hide();
       });
    }
    
    /**
    * Apply css highlighting to given error tags
    * @param tags - array of tags to highlight
    */
    public show(tags: HighlightTag[]): void {
        // window["addTag"] = this.addTag.bind(this);
        // window["getHighlightTagsForRange"] = this.getHighlightTagsForRange.bind(this);
        for(const tag of tags) {
          console.log(tag.data);
          this.addTag(tag);
        }
        return;
        if(!tags) return;

        // pre-processing step to merge tags?
        tags = this.mergeTags(tags);
      
        tags.forEach((tag) => {
            // Add highlighting to error text (https://quilljs.com/docs/api/#formattext)
            this.quillEditor.formatText(
                tag.fromX,
                (tag.toX - tag.fromX),
                {
                    'highlight-tag': JSON.stringify(tag)
                },
                'api'
            );
        });

        // Create message popups with tooltips
        const tagElements = document.querySelectorAll('[highlight-tag]');
        tagElements.forEach(tagElement => {
            const tagData = tagElement.getAttribute('highlight-tag');
            if (!tagData) {
              return;
            } 
            const highlightTag = JSON.parse(tagData) as HighlightTag;
            const tooltip = new Tooltip(this.quillEditor);
            tooltip.root.classList.add('custom-tooltip');

            tagElement.addEventListener('mouseover', () => {
                this.mouseOverTagElem(highlightTag, tagElement, tooltip);
            });
            
            tagElement.addEventListener('mouseout', () => {
              tagElement.removeAttribute('data-selected');
              tooltip.hide();
            });
        });
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
    
        document.querySelectorAll('.custom-tooltip').forEach(elem => elem.remove());
    }
    
    /**
    * Remove css highlighting from all error tags
    */
    public hideAll() {
      const tagElements = document.querySelectorAll('[data-selected]');
      tagElements.forEach(tag => tag.removeAttribute('data-selected'))
      this.quillEditor.formatText(
        0,
        this.quillEditor.getLength(),
          {'highlight-tag': null,
          'background-color': '',
          'data-selected': null}
      );
      
      document.querySelectorAll('.custom-tooltip').forEach(elem => elem.remove());
    }

    /**
    * Set styling for tooltip
    * @param tag - error tag for applying tooltip
    * @param tagElement - html element associated with tag
    * @param tooltip - tooltip to be applied to tag
    */
    private mouseOverTagElem(tag: HighlightTag, tagElement: Element, tooltip) {
        tagElement.setAttribute('data-selected', '');
    
        // for some reason bounds aren't calculated correctly until someone scrolls
        const scrollTop = this.quillEditor.root.scrollTop;
        this.quillEditor.root.scroll({top: + scrollTop + 1});
        this.quillEditor.root.scroll({top: + scrollTop});
    
        const tooltipContents = this.makeTooltipContents(tag.data, this.ts.l.iso_code);
        tooltip.root.innerHTML = tooltipContents;
        this.mostRecentHoveredMessage = tooltipContents;
    
        tooltip.show();
        tooltip.position(this.quillEditor.getBounds(tag.fromX, tag.toX - tag.fromX));
    
        let style = tooltip.root.getAttribute('style') || '';
        style = style + `
          font-size: medium;
          padding: 20px;
          -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
          -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
          box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
          border: 2px solid var(--scealai-med-brown);
          border-radius: 2px;
        `;
        tooltip.root.setAttribute('style', style);
    
        // Ensure that tooltip isn't cut off by the right edge of the editor
        const rightOverflow =
          (tooltip.root.offsetLeft + tooltip.root.offsetWidth) -
          this.quillEditor.root.offsetWidth;
    
        tooltip.root.style.left =
          (rightOverflow > 0) ?
          `${(tooltip.root.offsetLeft - rightOverflow) - 5}px` : // - 5px for right padding
          tooltip.root.style.left;
    
        // Ensure that tooltip isn't cut off by the left edge of the editor
        tooltip.root.style.left =
          (tooltip.root.offsetLeft < 0) ?
          `${(tooltip.root.offsetLeft - tooltip.root.offsetLeft) + 5}px` : // + 5px for left padding
          tooltip.root.style.left;
          
        this.engagement.mouseOverGrammarSuggestionEvent(tag);
      }
      
    /**
    * Return either last tag hovered, checking grammar, or instructions message
    * @param grammarLoaded - boolean to determine if grammar is finished loading
    */
    public getGrammarMessage(grammarLoaded: boolean) {
      if(grammarLoaded) {
        if (!this.mostRecentHoveredMessage)
          return this.ts.message('hover_over_a_highlighted_word_for_a_grammar_suggestion');
        else 
          return this.mostRecentHoveredMessage;
      }
      else 
        return this.ts.message('checking_grammar');
    }

    private makeTooltipContents(data: TagData[], lang: 'en' | 'ga'): string {
      const getName = (datum) => lang == 'en' ? datum.nameEN : datum.nameGA;
      const getMessage = (datum) => lang == 'en' ? datum.messageEN : datum.messageGA;
      return data.map(datum => `<div style="white-space: pre-wrap; text-align: left;"><span class="circle" style="background: ${datum.color}"></span> ${getName(datum)}: ${getMessage(datum)}</div>`).join('<hr>')
    }

    private overlaps(tagA: HighlightTag, tagB: HighlightTag): boolean {
      return (tagA.fromX <= tagB.toX) && (tagA.toX >= tagB.fromX);
    }

    private makeMergedTag(tags: HighlightTag[]): HighlightTag {
      const lowest_fromX = Math.min(...tags.map(tag => tag.fromX));
      const highest_toX = Math.max(...tags.map(tag => tag.toX));
      const merged_data = tags.reduce((acc, tag) => this.arrayToSet(acc.concat(tag.data)), []); // make it a set so we don't duplicate the messages in the tooltip
      return {
        data: merged_data,
        fromX: lowest_fromX,
        toX: highest_toX
      }
    }

    private mergeTags(tags: HighlightTag[], i: number = 0): HighlightTag[] {
      // step 0: nothing to merge if the list is empty
      if (!tags.length) return tags; 
      // step 1: find any tags that overlap with the first tag
      const tagA = tags[0]
      const overlap_set = tags.filter(tagB => this.overlaps(tagA, tagB));
      // step 2: merge all of those overlapping tags into a new 'merged tag'
      const merged_tag = this.makeMergedTag(overlap_set);
      // step 3: replace any of the tags that were merged together with the newly created merged_tag
      const updated_tags = tags.filter(tag => !overlap_set.includes(tag)).concat([merged_tag]);
      // step 4.1: if there weren't any merges, then we're done. 
      const noMoreMergesAtCurrentIndex = tags.length == updated_tags.length
      if (noMoreMergesAtCurrentIndex && i == (tags.length-1)) {
        return tags;
      }

      // step 4.2: otherwise, keep merging!
      return this.mergeTags(updated_tags, noMoreMergesAtCurrentIndex ? (i + 1) : i);
    }

    private arrayToSet(array: any[]): any[] {
      return array.filter((obj, index, self) => {
        return index === self.findIndex((o) =>
          JSON.stringify(o) === JSON.stringify(obj)
        );
      });
    }
}

