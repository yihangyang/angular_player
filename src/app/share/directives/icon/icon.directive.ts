import { Directive, ElementRef, HostBinding, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { IconType } from './type';

@Directive({
  selector: '[charleneIcon]',
  host: {
    '[class.iconfont]': 'true'
  }
})
export class IconDirective implements OnChanges {
  // @HostBinding('class.iconfont') readonly hostCls = true;
  @Input('charleneIcon') type: IconType;
  constructor(private el: ElementRef, private rd2: Renderer2) { 
  }
  ngOnChanges(changes: SimpleChanges): void {
    const { type } = changes;
    // console.log(type);
    if(type.previousValue) {
      this.rd2.removeClass(this.el.nativeElement,'icon-' + type.previousValue)
    }
    this.rd2.addClass(this.el.nativeElement,'icon-' + type.currentValue);
  }

}
