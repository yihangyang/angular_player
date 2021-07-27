import { Directive,EventEmitter, ElementRef, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
  selector: '[charleneToggleMore]'
})
export class ToggleMoreDirective implements OnChanges {
  @Input() content: string;
  @Input() isFull: boolean = false;
  @Input('charleneToggleMore') maxHeight: number = 0;
  @Output() initRealHeight = new EventEmitter<number>();
  private realHeight = this.maxHeight;
  constructor(
    private el: ElementRef,
    private rd2: Renderer2
  ) { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { content, isFull } = changes;
    if(content?.currentValue) {
      // const rect = this.el.nativeElement.getBoundingClientRect();
      timer(100).subscribe(()=> {
        this.realHeight= this.getHiddenDomRect(this.el.nativeElement).height;
        this.initRealHeight.emit(this.realHeight);
      })
    }

    if(isFull){
      const maxHeight = isFull.currentValue ? this.realHeight : this.maxHeight;
      this.rd2.setStyle(this.el.nativeElement, 'maxHeight', maxHeight + 'px');
    }
  }
  

  // get hidden element rect
  private getHiddenDomRect(dom: HTMLElement): DOMRect {
    const cloneNode = dom.cloneNode(true) as HTMLElement;
    this.rd2.setStyle(cloneNode, 'position', 'absolute');
    this.rd2.setStyle(cloneNode, 'visibility', 'hidden');
    this.rd2.setStyle(cloneNode, 'pointerEvents', 'hidden');
    this.rd2.setStyle(cloneNode, 'maxHeight', 'unset');
    this.rd2.appendChild(dom.parentNode, cloneNode);
    const rect = cloneNode.getBoundingClientRect();
    this.rd2.removeChild(dom.parentNode, cloneNode);
    return rect;
  }

}
