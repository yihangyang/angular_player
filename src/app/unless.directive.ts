import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[charleneUnless]'
})
export class UnlessDirective {
  private hasView = false;
  @Input()
  set charleneUnless(condition:boolean) {
    if(!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  constructor(private templateRef: TemplateRef<any>, private viewContainer:ViewContainerRef) {
    console.log('text')
  }

}
