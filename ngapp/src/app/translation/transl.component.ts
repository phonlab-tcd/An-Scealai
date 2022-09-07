import { Input, ElementRef, Attribute, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageKey, TranslationService } from "../translation.service";

@Component({
  selector: 'transl',
  template: '',
})
export class Transl {
  private _sub: Subscription;

  constructor(
    private el: ElementRef,
    private ts: TranslationService,
  ) {
    this._sub = {unsubscribe: function (){}} as Subscription;
  }

  @Input('key') set key(k){
    this._sub.unsubscribe();
    this._sub = this.ts.languageCode$
      .subscribe(
        _ => this.el.nativeElement.innerHTML = this.ts.message(k));
  }
}
