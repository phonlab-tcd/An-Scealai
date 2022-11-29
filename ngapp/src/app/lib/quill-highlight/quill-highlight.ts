import Quill from 'quill';
import { TranslationService } from 'app/translation.service';

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

// type TooltippedHighlightTag = {
//     tag: HighlightTag;
//     tooltip: any;
// }

export class QuillHighlighter {
    quillEditor: Quill;
    mostRecentHoveredMessage: String = '';
    private ts: TranslationService;

    constructor(quillEditor: Quill, ts: TranslationService) {
        this.quillEditor = quillEditor;
        this.ts = ts;
        console.log(this.ts);
        this.mostRecentHoveredMessage = this.ts.message('hover_over_a_highlighted_word_for_a_grammar_suggestion');
    }

    public show(tags: HighlightTag[]): void {
        if(!tags) return;
      
        tags.forEach((tag) => {
            // Add highlighting to error text (https://quilljs.com/docs/api/#formattext)
            
            this.quillEditor.formatText(
                tag.fromX,
                (tag.toX - tag.fromX),
                {
                    'highlight-tag': JSON.stringify(tag),
                    'highlight-tag-type': tag.type,
                    'background-color': tag.color
                },
                'api'
            );
        });

        // Create message popups with tooltips
        const tagElements = document.querySelectorAll('[highlight-tag]');
        tagElements.forEach(tagElement => {
            const tagData = tagElement.getAttribute('highlight-tag');
            if (!tagData) return;
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

    public hide() {
        this.quillEditor.formatText(
            0, // from the very beginning of the text
            this.quillEditor.getLength(), // to the very end of the text
            {'highlight-tag': null,
            'highlight-tag-type': null,
            'background-color': ''} // delete all highlight-tag's on the parchment
        );
        document.querySelectorAll('.custom-tooltip').forEach(elem => elem.remove());
    }

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
      }
      
    public getMostRecentMessage() {
      return this.mostRecentHoveredMessage;
    }
}

