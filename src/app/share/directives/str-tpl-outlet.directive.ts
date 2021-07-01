import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[charleneStrTplOutlet]'
})
export class StrTplOutletDirective implements OnChanges {
  @Input() charleneStrTplOutlet: TemplateRef<any> | string;
  @Input() charleneStrTplOutletContext: any;
  constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<any>) { }

  ngOnChanges(changes: SimpleChanges): void {
    const { charleneStrTplOutlet } = changes;
    if(charleneStrTplOutlet) {
      this.viewContainer.clear();
      const template = (this.charleneStrTplOutlet instanceof TemplateRef) ? this.charleneStrTplOutlet : this.templateRef;
      this.viewContainer.createEmbeddedView(template)
    }
  }

}
