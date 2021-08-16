import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[charleneDragHandler]'
})
export class DragHandlerDirective {

  constructor(readonly el: ElementRef) { }

}
