import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild } from '@angular/core';
var styleProperties = Object.freeze([
    'direction',
    'boxSizing',
    'width',
    'height',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize'
]);
var tagIndexIdPrefix = 'text-highlight-tag-id-';
function indexIsInsideTag(index, tag) {
    return tag.indices.start < index && index < tag.indices.end;
}
function overlaps(tagA, tagB) {
    return (indexIsInsideTag(tagB.indices.start, tagA) ||
        indexIsInsideTag(tagB.indices.end, tagA));
}
function isCoordinateWithinRect(rect, x, y) {
    return rect.left < x && x < rect.right && (rect.top < y && y < rect.bottom);
}
function escapeHtml(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
var TextInputHighlightComponent = /** @class */ (function () {
    function TextInputHighlightComponent(renderer, cdr) {
        this.renderer = renderer;
        this.cdr = cdr;
        /**
         * The CSS class to add to highlighted tags
         */
        this.tagCssClass = '';
        /**
         * An array of indices of the textarea value to highlight
         */
        this.tags = [];
        /**
         * Called when the area over a tag is clicked
         */
        this.tagClick = new EventEmitter();
        /**
         * Called when the area over a tag is moused over
         */
        this.tagMouseEnter = new EventEmitter();
        /**
         * Called when the area over the tag has the mouse is removed from it
         */
        this.tagMouseLeave = new EventEmitter();
        /**
         * @private
         */
        this.highlightElementContainerStyle = {};
        this.textareaEventListeners = [];
        this.isDestroyed = false;
    }
    /**
     * Manually call this function to refresh the highlight element if the textarea styles have changed
     */
    TextInputHighlightComponent.prototype.refresh = function () {
        var _this = this;
        var computed = getComputedStyle(this.textInputElement);
        styleProperties.forEach(function (prop) {
            _this.highlightElementContainerStyle[prop] = computed[prop];
        });
    };
    /**
     * @private
     */
    TextInputHighlightComponent.prototype.ngOnChanges = function (changes) {
        if (changes.textInputElement) {
            this.textInputElementChanged();
        }
        if (changes.tags || changes.tagCssClass || changes.textInputValue) {
            this.addTags();
        }
    };
    /**
     * @private
     */
    TextInputHighlightComponent.prototype.ngOnDestroy = function () {
        this.isDestroyed = true;
        this.textareaEventListeners.forEach(function (unregister) { return unregister(); });
    };
    /**
     * @private
     */
    TextInputHighlightComponent.prototype.onWindowResize = function () {
        this.refresh();
    };
    TextInputHighlightComponent.prototype.textInputElementChanged = function () {
        var _this = this;
        var elementType = this.textInputElement.tagName.toLowerCase();
        if (elementType !== 'textarea') {
            throw new Error('The angular-text-input-highlight component must be passed ' +
                'a textarea to the `textInputElement` input. Instead received a ' +
                elementType);
        }
        setTimeout(function () {
            // in case the element was destroyed before the timeout fires
            if (!_this.isDestroyed) {
                _this.refresh();
                _this.textareaEventListeners.forEach(function (unregister) { return unregister(); });
                _this.textareaEventListeners = [
                    _this.renderer.listen(_this.textInputElement, 'input', function () {
                        _this.addTags();
                    }),
                    _this.renderer.listen(_this.textInputElement, 'scroll', function () {
                        _this.highlightElement.nativeElement.scrollTop = _this.textInputElement.scrollTop;
                        _this.highlightTagElements = _this.highlightTagElements.map(function (tag) {
                            tag.clientRect = tag.element.getBoundingClientRect();
                            return tag;
                        });
                    })
                ];
                // only add event listeners if the host component actually asks for it
                if (_this.tagClick.observers.length > 0) {
                    var onClick = _this.renderer.listen(_this.textInputElement, 'click', function (event) {
                        _this.handleTextareaMouseEvent(event, 'click');
                    });
                    _this.textareaEventListeners.push(onClick);
                }
                if (_this.tagMouseEnter.observers.length > 0) {
                    var onMouseMove = _this.renderer.listen(_this.textInputElement, 'mousemove', function (event) {
                        _this.handleTextareaMouseEvent(event, 'mousemove');
                    });
                    var onMouseLeave = _this.renderer.listen(_this.textInputElement, 'mouseleave', function (event) {
                        if (_this.mouseHoveredTag) {
                            _this.tagMouseLeave.emit(_this.mouseHoveredTag);
                            _this.mouseHoveredTag = undefined;
                        }
                    });
                    _this.textareaEventListeners.push(onMouseMove);
                    _this.textareaEventListeners.push(onMouseLeave);
                }
                _this.addTags();
            }
        });
    };
    TextInputHighlightComponent.prototype.addTags = function () {
        var _this = this;
        var textInputValue = typeof this.textInputValue !== 'undefined'
            ? this.textInputValue
            : this.textInputElement.value;
        var prevTags = [];
        var parts = [];
        this.tags.slice().sort(function (tagA, tagB) {
            return tagA.indices.start - tagB.indices.start;
        })
            .forEach(function (tag) {
            if (tag.indices.start > tag.indices.end) {
                throw new Error("Highlight tag with indices [" + tag.indices.start + ", " + tag.indices
                    .end + "] cannot start after it ends.");
            }
            prevTags.forEach(function (prevTag) {
                if (overlaps(prevTag, tag)) {
                    throw new Error("Highlight tag with indices [" + tag.indices.start + ", " + tag.indices
                        .end + "] overlaps with tag [" + prevTag.indices.start + ", " + prevTag
                        .indices.end + "]");
                }
            });
            // TODO - implement this as an ngFor of items that is generated in the template for a cleaner solution
            var expectedTagLength = tag.indices.end - tag.indices.start;
            var tagContents = textInputValue.slice(tag.indices.start, tag.indices.end);
            if (tagContents.length === expectedTagLength) {
                var previousIndex = prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
                var before = textInputValue.slice(previousIndex, tag.indices.start);
                parts.push(escapeHtml(before));
                var cssClass = tag.cssClass || _this.tagCssClass;
                var tagId = tagIndexIdPrefix + _this.tags.indexOf(tag);
                // text-highlight-tag-id-${id} is used instead of a data attribute to prevent an angular sanitization warning
                parts.push("<span class=\"text-highlight-tag " + tagId + " " + cssClass + "\">" + escapeHtml(tagContents) + "</span>");
                prevTags.push(tag);
            }
        });
        var remainingIndex = prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
        var remaining = textInputValue.slice(remainingIndex);
        parts.push(escapeHtml(remaining));
        parts.push('&nbsp;');
        this.highlightedText = parts.join('');
        this.cdr.detectChanges();
        this.highlightTagElements = Array.from(this.highlightElement.nativeElement.getElementsByTagName('span')).map(function (element) {
            return { element: element, clientRect: element.getBoundingClientRect() };
        });
    };
    TextInputHighlightComponent.prototype.handleTextareaMouseEvent = function (event, eventName) {
        var matchingTagIndex = this.highlightTagElements.findIndex(function (elm) {
            return isCoordinateWithinRect(elm.clientRect, event.clientX, event.clientY);
        });
        if (matchingTagIndex > -1) {
            var target = this.highlightTagElements[matchingTagIndex].element;
            var tagClass = Array.from(target.classList).find(function (className) {
                return className.startsWith(tagIndexIdPrefix);
            });
            if (tagClass) {
                var tagId = tagClass.replace(tagIndexIdPrefix, '');
                var tag = this.tags[+tagId];
                var tagMouseEvent = { tag: tag, target: target, event: event };
                if (eventName === 'click') {
                    this.tagClick.emit(tagMouseEvent);
                }
                else if (!this.mouseHoveredTag) {
                    this.mouseHoveredTag = tagMouseEvent;
                    this.tagMouseEnter.emit(tagMouseEvent);
                }
            }
        }
        else if (eventName === 'mousemove' && this.mouseHoveredTag) {
            this.mouseHoveredTag.event = event;
            this.tagMouseLeave.emit(this.mouseHoveredTag);
            this.mouseHoveredTag = undefined;
        }
    };
    TextInputHighlightComponent.decorators = [
        { type: Component, args: [{
                    selector: 'mwl-text-input-highlight',
                    template: "\n    <div\n      class=\"text-highlight-element\"\n      [ngStyle]=\"highlightElementContainerStyle\"\n      [innerHtml]=\"highlightedText\"\n      #highlightElement>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    TextInputHighlightComponent.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ChangeDetectorRef, },
    ]; };
    TextInputHighlightComponent.propDecorators = {
        'tagCssClass': [{ type: Input },],
        'tags': [{ type: Input },],
        'textInputElement': [{ type: Input },],
        'textInputValue': [{ type: Input },],
        'tagClick': [{ type: Output },],
        'tagMouseEnter': [{ type: Output },],
        'tagMouseLeave': [{ type: Output },],
        'highlightElement': [{ type: ViewChild, args: ['highlightElement',] },],
        'onWindowResize': [{ type: HostListener, args: ['window:resize',] },],
    };
    return TextInputHighlightComponent;
}());
export { TextInputHighlightComponent };
//# sourceMappingURL=text-input-highlight.component.js.map