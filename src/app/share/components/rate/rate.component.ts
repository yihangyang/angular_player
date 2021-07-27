import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'charlene-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RateComponent),
      multi: true
    }
  ]
})
export class RateComponent implements OnInit, ControlValueAccessor {
  @Input() count = 5;
  @Input() tpl: TemplateRef<void>;
  private readonly = false;
  starArray: number[] = [];
  private hoverValue = 0;
  private actualValue = 0;
  private hashalf = false;
  rateItemStyles: string[] = [];
  @Output() changed = new EventEmitter<number>();
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.updateStarArray();
  }

  rateHover(isHalf: boolean, index: number): void {
    if(this.readonly || (this.hoverValue === index + 1 && this.hashalf === isHalf)) {
      return;
    }
    this.hoverValue = index + 1;
    this.hashalf = isHalf;
    // console.log('hoverValue', this.hoverValue);
    this.updateStarStyle();
  }

  rateClick(isHalf: boolean, index: number): void {
    // console.log('rateClick', isHalf);
    if(this.readonly) {
      return;
    }
    this.hoverValue = index + 1;
    this.hashalf = isHalf;
    this.setActualValue(isHalf ? index + 0.5 : this.hoverValue);
    this.updateStarStyle();
  }

  private setActualValue(value: number): void {
    if(this.actualValue !== value) {
      this.actualValue = value;
      this.onChange(value);
      this.changed.emit(value);
    }
  }

  rateLeave(): void {
    this.hashalf = !Number.isInteger(this.actualValue);
    this.hoverValue = Math.ceil(this.actualValue);
    this.updateStarStyle();
  }

  private updateStarArray():void {
    this.starArray = Array(this.count).fill(0).map((item, index) => index);
    // console.log(this.starArray);
  }


  private updateStarStyle(): void {
    this.rateItemStyles = this.starArray.map(index => {
      const base = "charlene-rate-item";
      const value = index + 1;
      let cls = '';
      if(value < this.hoverValue || (!this.hashalf && value === this.hoverValue)) {
        cls = base + '-full';
      } else if (this.hashalf && value === this.hoverValue){
        cls = base + '-half';
      }
      const midCls = this.readonly ? ' charlene-rate-item-readonly ' : ' '
      return base + midCls + cls;
    });
  }

  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: number): void {
    if(value) {
      this.actualValue = value || 0;
      this.rateLeave();
      this.cdr.markForCheck();
    }
  }
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }
}
