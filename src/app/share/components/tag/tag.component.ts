import { AfterViewInit,EventEmitter, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, Output, Renderer2, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';

const ColorPresets = ['magenta', 'orange', 'green'];
type TagsMode = 'default' | 'circle';
@Component({
  selector: 'charlene-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagComponent implements OnChanges {
  @Input() charleneColor = "";
  @Input() charleneShape: TagsMode = "default";
  @Input() charleneClosable = false;
  @Output() closed = new EventEmitter<void>();
  @HostBinding("class.charlene-tag-circle") get circleCls(): boolean { return this.charleneShape === 'circle'; }
  @HostBinding("class.charlene-tag-close") get closeCls(): boolean { return this.charleneClosable; }
  @HostBinding("class.charlene-tag") readonly hostCls = true;

  private currentPresetCls = ""
  constructor(private el: ElementRef, private rd2: Renderer2) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.setStyle(changes.charleneColor);
  }
  

  private setStyle(color: SimpleChange): void {
    const hostEl = this.el.nativeElement;
    if(!hostEl || !this.charleneColor){ return; }
    if(this.currentPresetCls) { // default color before
      this.rd2.removeClass(hostEl, color.currentValue);
      this.currentPresetCls = '';
    }
    if(ColorPresets.includes(this.charleneColor)) { // default color
      this.currentPresetCls = 'charlene-tag-' + this.charleneColor;
      this.rd2.addClass(hostEl, this.currentPresetCls);
      this.rd2.removeStyle(hostEl, 'color'),
      this.rd2.removeStyle(hostEl, 'border-color', ),
      this.rd2.removeStyle(hostEl, 'background-color')
    } else { // not default color
      this.rd2.setStyle(hostEl, 'color', '#fff'),
      this.rd2.setStyle(hostEl, 'border-color', 'transparent'),
      this.rd2.setStyle(hostEl, 'background-color', color.currentValue)
    }
  }

}
