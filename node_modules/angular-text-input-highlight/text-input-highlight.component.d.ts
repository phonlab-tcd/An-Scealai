import { ChangeDetectorRef, EventEmitter, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { HighlightTag } from './highlight-tag.interface';
export interface TagMouseEvent {
    tag: HighlightTag;
    target: HTMLElement;
    event: MouseEvent;
}
export declare class TextInputHighlightComponent implements OnChanges, OnDestroy {
    private renderer;
    private cdr;
    /**
     * The CSS class to add to highlighted tags
     */
    tagCssClass: string;
    /**
     * An array of indices of the textarea value to highlight
     */
    tags: HighlightTag[];
    /**
     * The textarea to highlight
     */
    textInputElement: HTMLTextAreaElement;
    /**
     * The textarea value, in not provided will fall back to trying to grab it automatically from the textarea
     */
    textInputValue: string;
    /**
     * Called when the area over a tag is clicked
     */
    tagClick: EventEmitter<TagMouseEvent>;
    /**
     * Called when the area over a tag is moused over
     */
    tagMouseEnter: EventEmitter<TagMouseEvent>;
    /**
     * Called when the area over the tag has the mouse is removed from it
     */
    tagMouseLeave: EventEmitter<TagMouseEvent>;
    /**
     * @private
     */
    highlightElementContainerStyle: {
        [key: string]: string;
    };
    /**
     * @private
     */
    highlightedText: string;
    private highlightElement;
    private textareaEventListeners;
    private highlightTagElements;
    private mouseHoveredTag;
    private isDestroyed;
    constructor(renderer: Renderer2, cdr: ChangeDetectorRef);
    /**
     * Manually call this function to refresh the highlight element if the textarea styles have changed
     */
    refresh(): void;
    /**
     * @private
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @private
     */
    ngOnDestroy(): void;
    /**
     * @private
     */
    onWindowResize(): void;
    private textInputElementChanged();
    private addTags();
    private handleTextareaMouseEvent(event, eventName);
}
