import { Directive, Input, ElementRef } from '@angular/core';
import { MessageKey, TranslationService } from "./translation.service";
@Directive({
  selector: '[ts]'
})
export class Translation {

  constructor(private elRef: ElementRef, private trans: TranslationService) { }

  @Input() set ts(val: MessageKey) {
    console.log(this.trans.message(val));
    this.elRef.nativeElement.innerHTML = this.trans.message(val);
  }

}
