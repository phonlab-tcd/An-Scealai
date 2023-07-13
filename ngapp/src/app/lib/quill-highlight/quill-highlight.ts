import Quill from 'quill';
import { EngagementService } from 'app/core/services/engagement.service';
import { ErrorTag } from '../grammar-engine/types';
import { Observable, fromEvent } from 'rxjs';

// This is required to top quill from adding "Visit link:" before our text
export const tooltipClassname = "custom-tooltip";

const Parchment = Quill.import('parchment');
const Tooltip = Quill.import('ui/tooltip');

Quill.register(
  new Parchment.Attributor.Attribute(
    'highlight-tag',
    'highlight-tag',
    { scope: Parchment.Scope.INLINE }
  )
);

Quill.register(
  new Parchment.Attributor.Attribute(
    'left-edge',
    'left-edge',
    { scope: Parchment.Scope.INLINE }
  )
);

Quill.register(
  new Parchment.Attributor.Attribute(
    'right-edge',
    'right-edge',
    { scope: Parchment.Scope.INLINE }
  )
);

Quill.register(
  new Parchment.Attributor.Attribute(
    'id',
    'id',
    { scope: Parchment.Scope.INLINE }
  )
);



export function spansOverlap(a: Span, b: Span) {
  if (a.fromX >= b.toX || b.fromX >= a.toX) {
    return false;
  }
  return true;
}

export type HighlightTag = ErrorTag;

type MessageRenderer = (ht: HighlightTag) => string;
type Span = { fromX: number, toX: number };

export class QuillHighlighter {
  quillEditor: Quill;
  mostRecentHoveredMessage: String = '';
  private engagement: EngagementService; // TODO: QuillHighlighter shouldn't know about engagement service
  private editorElement: HTMLElement;

  // all grammar messages for a merged highlight-tag, i.e. several highlight tags were overlapping and so got merged together into one, but the tooltip shows all messages
  private mergedGroupData: Map<string, HighlightTag[]> = new Map();

  // not necessarily the spans of any individual highlight-tag, but the span of a group of overlapping highlight tags
  private mergedGroupSpan: Map<string, Span> = new Map();

  private messageRenderer: MessageRenderer;
  private tooltip: typeof Tooltip;

  // todo better type for text change
  private textChange$: Observable<any>;

  constructor(quillEditor: Quill, messageRenderer: MessageRenderer, engagement: EngagementService) {
    this.quillEditor = quillEditor;
    console.log(this.quillEditor);

    // only need to instantiate one tooltip, reuse it when hover on a new highlight
    this.tooltip = new Tooltip(quillEditor);

    this.textChange$ = fromEvent(this.quillEditor, 'text-change')
    this.textChange$.subscribe({
      next: ([delta, content, source]) => {
        if (source === "api") return;
        // by 'cosmetic' here I mean that it doesn't affect the text content but just styling
        const deltaIsCosmetic: boolean = delta.ops.every(op => 'retain' in op)
        if (deltaIsCosmetic) {
          const formattingChangeSpans = delta.ops.reduce(
            (acc, cur) => {
              return {
                i: acc.i + cur.retain,
                spans: ('attributes' in cur) ? acc.spans.concat([{ fromX: acc.i, toX: acc.i + cur.retain }]) : acc.spans
              }
            },
            { i: 0, spans: [] }
          ).spans;
          formattingChangeSpans.forEach(span => this.tidyUp(span));
        }
      }
    });

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
    // update: (seems to be fine, even with changing pages)
    this.editorElement = document.querySelector(".ql-editor");

    // start ql-document wide event listener, branch within event listener to see if tooltip should be rendered
    this.editorElement.addEventListener("mouseover", (event) => {
      if (event.target instanceof Element) {
        const id = event.target.getAttribute("id");
        if (id) {
          const span = this.mergedGroupSpan.get(id);
          const data = this.mergedGroupData.get(id);
          if (span && data) {
            this.mouseOverTagElem(data, span);
          }
        } else {
          this.tooltip.hide();
        }
      }
    })
  }

  private onlyUnique(value, index, array) {
    return array.map(x => x.symbol).indexOf(value.symbol) === index;
  }

  // Add highlighting to error text (https://quilljs.com/docs/api/#formattext)
  private tagDataForRange(startIndex, endIndex) {

    let allMessages = [];
    const span = { fromX: startIndex, toX: endIndex };
    for (let i = startIndex; i <= endIndex; i++) {
      const format = this.quillEditor.getFormat(i);

      // id for group of messages
      const id = format["id"];
      if (id) {
        const messages = this.mergedGroupData.get(id);
        const existingSpan = this.mergedGroupSpan.get(id);
        if (existingSpan && spansOverlap(span, existingSpan)) {
          span.fromX = Math.min(span.fromX, existingSpan.fromX);
          span.toX = Math.max(span.toX, existingSpan.toX);
          allMessages = allMessages.concat(messages);
          i = existingSpan.toX;
        } else {
        }
      }
    }

    
    const idsIn = {};
    const tags = allMessages.filter(x => {
      if(idsIn[x.id]) return false;
      idsIn[x.id] = true;
      return true;
    });
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
    /// highlightTagsSet = Array.from(new Set(highlightTagsSet.map(o => JSON.stringify(o)))).map(s => JSON.parse(s));

    function alphabeticalSort(a, b) {
      if (a.nameGA < b.nameGA) return -1;
      return 1;
    }
    highlightTagsSet = highlightTagsSet.filter(x => x).sort(alphabeticalSort);

    const id = crypto.randomUUID().toString();
    this.mergedGroupData.set(id, highlightTagsSet);
    this.mergedGroupSpan.set(id, span);

    this.quillEditor.formatText(span.fromX, span.toX - span.fromX, { "highlight-tag": true, "id": id }, 'api');
    const tagElements = this.editorElement.querySelectorAll(`[id="${id}"]`);

    tagElements.forEach(function (tagElement) {
      tagElement.removeAttribute("left-edge");
      tagElement.removeAttribute("right-edge");
    });
    tagElements[0].setAttribute("left-edge", "");
    tagElements[tagElements.length - 1].setAttribute("right-edge", "");
  }
  
  // Ensures that the tag groups encompassed by 'span' have 
  // coherent highlighting.
  // This is used to prevent undesired gaps from appearing
  // in highlight tags when some format operation is applied
  // in quill, e.g. making some text bold or italic.
  public tidyUp(span: Span) {
    let i = span.fromX;
    while (i < span.toX) {
      const format = this.quillEditor.getFormat(i, 1);
      const id = format["id"];
      if (!id) { ++i; continue; }
      const tagElements = this.editorElement.querySelectorAll(`[id="${id}"]`);
      tagElements.forEach(function (tagElement) {
        tagElement.removeAttribute("left-edge");
        tagElement.removeAttribute("right-edge");
      });
      tagElements[0].setAttribute("left-edge", "");
      tagElements[tagElements.length - 1].setAttribute("right-edge", "");
      // Because we have already formatted the whole merge group here we can
      // skip i forward to the end of the group
      const groupSpan = this.mergedGroupSpan.get(id);
      i = groupSpan ? groupSpan.toX : i + 1;
    }
  }

  public equivalentTag(a: HighlightTag, b: HighlightTag) {
    return a.id === b.id;
  }

  public removeTag(tag) {
    const format = this.quillEditor.getFormat(Math.floor(tag.fromX + tag.toX)/2);
    const id = format["id"];
    if (id) {
      const messages = this.mergedGroupData.get(id);
      const groupSpan = this.mergedGroupSpan.get(id);

      // TODO: check that this doesn't destroy other formatting
      this.quillEditor.formatText(groupSpan.fromX, groupSpan.toX - groupSpan.fromX + 1, {"highlight-tag": false, "id": false}, 'api');

      const keepTags = messages.filter(t=>!this.equivalentTag(t,tag));
      this.mergedGroupData.delete(id);
      this.mergedGroupSpan.delete(id);

      for(const keepTag of keepTags) {
        this.addTag(keepTag);
      }
    }
  }

  // Apply css highlighting to given error tags
  // @param tags - array of tags to highlight
  public show(tags: HighlightTag[]): void {
    for (const tag of tags) {
      setTimeout(() => {
        this.addTag(tag);
      }, 0);
    }
    return;
  }

  // Remove css highlighting to input array of error tags
  // @param tags - array of tags to remove highlighting
  public hide(tags: HighlightTag[]) {
    tags.forEach((tag) => {
      this.removeTag(tag);
    });
  }

  // Remove css highlighting from all error tags
  public hideAll() {
    this.mergedGroupData = new Map();
    this.mergedGroupSpan = new Map();
    const tagElements = document.querySelectorAll('[data-selected]');
    this.quillEditor.formatText(
      0,
      Number.MAX_SAFE_INTEGER,
      {
        'highlight-tag': null,
        'background-color': '',
        'data-selected': null
      }, 'api'
    );
    this.tooltip.hide();
  }

  // Set styling and contents for tooltip
  private mouseOverTagElem(tags: HighlightTag[], span: { fromX: number, toX: number }) {
    // tagElement.setAttribute('data-selected', '');

    // for some reason bounds aren't calculated correctly until someone scrolls
    const scrollTop = this.quillEditor.root.scrollTop;
    this.quillEditor.root.scroll({ top: + scrollTop + 1 });
    this.quillEditor.root.scroll({ top: + scrollTop });

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
          max-width: 400px;
        `;
        this.tooltip.root.setAttribute('style', style);
          
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