import Quill from 'quill';
import { TranslationService } from 'app/translation.service';
import { EngagementService } from '../../engagement.service'

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
        'highlight-tag-type',
        'highlight-tag-type',
        {scope: Parchment.Scope.INLINE}
    )
);

export type HighlightTag = {
    type: string; // this will end up corresponding with the ERROR_INFO keys 
    messageGA: string;
    messageEN: string;
    nameEN: string;
    nameGA: string;
    color: string;
    fromX: number;
    toX: number;
}

export class QuillHighlighter {
    quillEditor: Quill;
    mostRecentHoveredMessage: String = '';
    private ts: TranslationService;
    private engagement: EngagementService;

    constructor(quillEditor: Quill, ts: TranslationService, engagement: EngagementService) {
        this.quillEditor = quillEditor;
        this.ts = ts;
        this.engagement = engagement;
    }
    
    /**
    * Apply css highlighting to given error tags
    * @param tags - array of tags to highlight
    */
    public show(tags: HighlightTag[]): void {
        if(!tags) return;
        this.hideAll();  // remove any previous highlighting 
      
        tags.forEach((tag) => {
          console.log(tag);
            // Add highlighting to error text (https://quilljs.com/docs/api/#formattext)
            this.quillEditor.formatText(
                tag.fromX,
                (tag.toX - tag.fromX),
                {
                    'highlight-tag': JSON.stringify(tag),
                    'highlight-tag-type': tag.type,
                    'background-color': tag.color,
                },
                'api'
            );
        });

        // Create message popups with tooltips
        const tagElements = document.querySelectorAll('[highlight-tag]');
        tagElements.forEach(tagElement => {
            const tagData = tagElement.getAttribute('highlight-tag');
            if (!tagData) {
              console.log("NO TAG DATA: ", tagElement);
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
              'highlight-tag-type': null,
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
          'highlight-tag-type': null,
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
    
        tooltip.root.innerHTML = this.ts.l.iso_code == 'en' ? tag.messageEN : tag.messageGA;
        this.mostRecentHoveredMessage = this.ts.l.iso_code == 'en' ? tag.messageEN : tag.messageGA;
    
        tooltip.show();
        tooltip.position(this.quillEditor.getBounds(tag.fromX, tag.toX - tag.fromX));
    
        let style = tooltip.root.getAttribute('style') || '';
        style = style + 'font-size: medium; z-index: 10000001;';
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
}

