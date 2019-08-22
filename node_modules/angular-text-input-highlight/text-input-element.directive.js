import { Directive } from '@angular/core';
var TextInputElementDirective = /** @class */ (function () {
    function TextInputElementDirective() {
    }
    TextInputElementDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'textarea[mwlTextInputElement]',
                    host: {
                        '[class.text-input-element]': 'true'
                    }
                },] },
    ];
    /** @nocollapse */
    TextInputElementDirective.ctorParameters = function () { return []; };
    return TextInputElementDirective;
}());
export { TextInputElementDirective };
//# sourceMappingURL=text-input-element.directive.js.map