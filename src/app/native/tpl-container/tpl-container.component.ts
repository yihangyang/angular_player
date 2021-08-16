import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'charlene-tpl-container',
  templateUrl: './tpl-container.component.html',
  styleUrls: ['./tpl-container.component.scss']
})
export class TplContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('firstTpl', {read: TemplateRef}) readonly firstTpl: TemplateRef<any>;
  @ViewChild('secondTpl', {read: TemplateRef}) readonly secondTpl: TemplateRef<any>;
  @ViewChild('box') readonly boxEl: ElementRef;
  @ViewChild('firstContainer', {read: ViewContainerRef}) readonly firstContain: ViewContainerRef;
  constructor() { }
  insert(tpl: TemplateRef<any>) {
    this.firstContain.insert(tpl.createEmbeddedView(null));
  }
  ngAfterViewInit(): void {
    // this.boxEl.nativeElement.appendChild(viewRef.rootNodes[0]);    
    this.firstContain.createEmbeddedView(this.firstTpl);
  }

  ngOnInit(): void {
  }

}
