import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'a[charleneBtn], button[charleneBtn]',
  host: {
    '[class.charlene-btn]': 'true'
  }
})
export class CharleneBtnDirective {
  @Input() @HostBinding('class.charlene-btn-block') charleneBlock = false;
  @Input() @HostBinding('class.charlene-btn-circle') charleneCircle = false;
  constructor() { }

}
