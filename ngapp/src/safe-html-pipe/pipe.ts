import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  // TODO: this is a very misleading name for the pipe,
  // if it doesn't actually make sure the html is safe.
  // perhaps the pipe name should 'trustHtml'
  // (Neimhin Mon 16 May 2022 16:38:19 IST)
  transform(value: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
