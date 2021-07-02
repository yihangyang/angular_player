import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, Renderer2, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';

const ColorPresets = ['magenta', 'orange', 'green'];
type TagsMode = 'default' | 'circle';
@Component({
  selector: 'charlene-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() charleneColor = "";
  @Input() charleneShape = "default";
  @Input() charleneClosable = false;
  @HostBinding("class.charlene-tag-circle") get circleCls(): boolean { return this.charleneShape === 'circle'; }
  @HostBinding("class.charlene-tag-circle") get closeCls(): boolean { return this.charleneClosable; }
  @HostBinding("class.charlene-tag") readonly hostCls = true;
  constructor(private el: ElementRef, private rd2: Renderer2) { }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    // this.setStyle();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.setStyle(changes.charleneColor);
  }
  

  private setStyle(color: SimpleChange): void {
    const hostEl = this.el.nativeElement;
    if(!hostEl || !this.charleneColor){ return; }
    if(ColorPresets.includes(this.charleneColor)) {
      if(ColorPresets.includes(color.previousValue)) {
        this.rd2.removeClass(hostEl, 'charlene-tag-' + color.previousValue);
      }
      this.rd2.addClass(hostEl, 'charlene-tag-' + this.charleneColor);
    };
  }

}
