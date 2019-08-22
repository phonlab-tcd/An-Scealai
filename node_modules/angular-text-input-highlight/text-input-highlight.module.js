import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputHighlightComponent } from './text-input-highlight.component';
import { TextInputHighlightContainerDirective } from './text-input-highlight-container.directive';
import { TextInputElementDirective } from './text-input-element.directive';
var TextInputHighlightModule = /** @class */ (function () {
    function TextInputHighlightModule() {
    }
    TextInputHighlightModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        TextInputHighlightComponent,
                        TextInputHighlightContainerDirective,
                        TextInputElementDirective
                    ],
                    imports: [CommonModule],
                    exports: [
                        TextInputHighlightComponent,
                        TextInputHighlightContainerDirective,
                        TextInputElementDirective
                    ]
                },] },
    ];
    /** @nocollapse */
    TextInputHighlightModule.ctorParameters = function () { return []; };
    return TextInputHighlightModule;
}());
export { TextInputHighlightModule };
//# sourceMappingURL=text-input-highlight.module.js.map